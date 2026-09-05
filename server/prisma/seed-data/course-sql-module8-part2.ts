/**
 * Databases Complete Course — Module 8: DDL, Constraints & Schema Evolution, lessons 4-6.
 *
 * Lesson 4: Altering tables safely — ADD/DROP/RENAME COLUMN, why adding a constant
 *           DEFAULT is fast but adding NOT NULL to a populated table without a default
 *           fails immediately, the add-nullable/backfill/constrain pattern, and
 *           CHECK ... NOT VALID + VALIDATE CONSTRAINT to avoid a long-held lock.
 * Lesson 5: Sequences, IDENTITY & schemas — GENERATED ALWAYS AS IDENTITY, why gaps in
 *           a sequence are normal and harmless, and schemas/search_path for namespacing
 *           tables within one database.
 * Lesson 6: DROP, TRUNCATE, CASCADE & migration discipline — RESTRICT vs CASCADE on
 *           DROP, TRUNCATE vs DELETE (including the RESTART IDENTITY gotcha),
 *           versioned migrations, and the expand-contract pattern for changing a
 *           column without breaking readers mid-deploy.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 8
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'sql-altering-tables-safely',
    title: 'Altering Tables Safely',
    titleHi: 'Tables Ko Safely Alter Karna',
    description: '`ALTER TABLE` looks like a single, simple statement, but some forms are instant while others rewrite every row or lock the table for the duration. Adding a `NOT NULL` column safely on a live, populated table is a specific, learnable pattern — not a single command.',
    descriptionHi: '`ALTER TABLE` ek single, simple statement dikhता hai, par kuch forms instant hain jabki doosre har row rewrite karte hain ya table ko poori duration ke liye lock karте hain. Ek live, populated table par safely ek `NOT NULL` column add karna ek specific, seekhने layak pattern hai — ek single command nahi.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Renovating a shop while it stays open, versus one that has to close its doors for the whole job.** Adding a new shelf near the entrance that starts empty is quick and barely disrupts anyone browsing — customers keep shopping the whole time. But announcing "as of right now, every single item in the shop must have a price tag, no exceptions" is a very different job if the shop already has ten thousand untagged items on the floor: you cannot honestly claim that rule is satisfied until someone has physically walked the floor and tagged every item, and if you try to enforce it instantly, you either have to close the doors while it happens or you announce a fact that is immediately false. The safe way to introduce that same universal rule in a shop that must stay open the whole time is to do it in stages: first put up a sign that says "tags are strongly recommended" (accept the column without requiring it yet), quietly walk the floor over the next few days tagging everything (backfill the existing rows), and only once every item genuinely has a tag do you flip the sign to "all items must have a tag" (enforce the constraint) — and even that final flip can be done as "we now believe this is true, verify it once in the background" rather than stopping every customer at the door while a clerk re-checks every single shelf.',
      hi: '**Ek dukaan ko renovate karna jabki wo khuली rehती hai, us dukaan ke muकаble jise poore kaam ke liye band karna paड़ता hai.** Entrance ke paas ek nayi shelf add karna jo khaali shuru hoती hai jaldi hai aur browsing kar rahe kisी ko shायad hi disrupt karti hai. Par "ab se, dukaan ki har ek cheez par price tag hona chahiye, koi exception nahi" announce karna ek bahut alag kaam hai agar dukaan mein pehle se das hazar untagged items floor par hain: aap honестly claim nahi kar sakte ki wo rule satisfy hai jab tak koi floor par physically chalकर har item tag na kare. Us same universal rule ko ek dukaan mein introduce karne ka safe tarika, jise poore samay khuला rehna hai, ise stages mein karna hai: pehle ek sign lagाओ jo kahе "tags strongly recommended hain" (column accept karo abhi require kiye bina), chupchaap floor chalो aglे kuch dinon mein sab kuch tag karте hue (existing rows backfill karo), aur sirf jab har item genuinely ek tag rakhता hai tab sign ko "sab items ka tag hona chahiye" par flip karो (constraint enforce karo).',
    },

    simple: `**Adding a column with a constant \`DEFAULT\` — fast, even on a populated table (PostgreSQL 11+)**

\`\`\`sql
ALTER TABLE emp ADD COLUMN active boolean NOT NULL DEFAULT true;
-- PostgreSQL 11+: does NOT rewrite existing rows for a constant default -- near-instant,
-- regardless of table size
\`\`\`

**Adding \`NOT NULL\` with no default on a populated table fails immediately**

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text NOT NULL;
-- ERROR: column "dept" of relation "emp" contains null values
-- (every EXISTING row would need a value that does not exist yet)
\`\`\`

**The safe pattern: add nullable -> backfill -> THEN constrain**

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                        -- 1. nullable, instant
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;        -- 2. backfill existing rows
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;               -- 3. now safe to enforce
\`\`\`

**\`CHECK ... NOT VALID\` + \`VALIDATE CONSTRAINT\` — a two-step way to avoid a long lock**

\`\`\`sql
-- step 1: add the constraint, enforced for all NEW/changed rows immediately,
-- but existing rows are NOT scanned/checked yet -- fast, brief lock
ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0) NOT VALID;

-- step 2: scan existing rows to confirm they already satisfy it -- can run
-- concurrently with normal reads/writes, at the cost of a second pass
ALTER TABLE emp VALIDATE CONSTRAINT positive_salary;
-- if any existing row violates it, VALIDATE fails and tells you exactly that
\`\`\`

**Other common ALTER TABLE moves**

\`\`\`sql
ALTER TABLE emp RENAME COLUMN nm TO name;   -- old name STOPS WORKING for every reader immediately
ALTER TABLE emp DROP COLUMN legacy_field;   -- data is gone -- there is no "are you sure" from SQL itself
\`\`\`

**Rule of thumb: think in terms of what has to happen physically**

\`\`\`
new column, no default, nullable            -> instant (nothing to check/rewrite)
new column, constant DEFAULT (PG11+)        -> instant (metadata only)
new column, NOT NULL, no default            -> FAILS on a populated table
SET NOT NULL on an existing, populated col  -> scans the whole table, can fail if any NULL exists
new CHECK, added normally                    -> scans + locks the whole table for the scan
new CHECK, added NOT VALID + VALIDATE later  -> brief lock now, scan happens as a separate, safer step
\`\`\``,

    simpleHi: `**Ek constant \`DEFAULT\` ke saath column add karna — fast, populated table par bhi (PostgreSQL 11+)**

\`\`\`sql
ALTER TABLE emp ADD COLUMN active boolean NOT NULL DEFAULT true;
-- PostgreSQL 11+: ek constant default ke liye existing rows rewrite NAHI karta -- near-instant
\`\`\`

**Bina default ke ek populated table par \`NOT NULL\` add karna turant fail hota hai**

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text NOT NULL;
-- ERROR: column "dept" of relation "emp" contains null values
\`\`\`

**Safe pattern: nullable add karo -> backfill karo -> PHIR constrain karo**

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                        -- 1. nullable, instant
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;        -- 2. existing rows backfill
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;               -- 3. ab enforce karna safe
\`\`\`

**\`CHECK ... NOT VALID\` + \`VALIDATE CONSTRAINT\` — ek lambe lock se bachने ka two-step tarika**

\`\`\`sql
-- step 1: constraint add karo, sabhi NAYI/badली rows ke liye turant enforced,
-- par existing rows abhi tak scan/check NAHI hoती -- fast, brief lock
ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0) NOT VALID;

-- step 2: existing rows scan karo confirm karne ke liye ki wo pehle se satisfy karti hain
ALTER TABLE emp VALIDATE CONSTRAINT positive_salary;
\`\`\`

**Doosre common ALTER TABLE moves**

\`\`\`sql
ALTER TABLE emp RENAME COLUMN nm TO name;   -- purana naam har reader ke liye TURANT kaam karna band karta hai
ALTER TABLE emp DROP COLUMN legacy_field;   -- data gayab -- SQL khud koi "kya aap sure hain" nahi deta
\`\`\`

**Rule of thumb: soचो ki physically kya hona hai**

\`\`\`
naya column, koi default nahi, nullable            -> instant
naya column, constant DEFAULT (PG11+)              -> instant
naya column, NOT NULL, koi default nahi             -> populated table par FAIL
existing, populated col par SET NOT NULL           -> poori table scan, koi NULL ho to fail
normally add ki gayi nayi CHECK                     -> scan + poori table lock
NOT VALID + baad mein VALIDATE ki gayi nayi CHECK   -> abhi brief lock, scan ek alag, safer step
\`\`\``,

    content: `## \`ALTER TABLE\` is not one operation — it is many, with very different costs

Every \`ALTER TABLE\` sub-command has to physically do *something* to make the schema change true for every existing row, and that "something" ranges from "update one line of metadata" to "read and rewrite every row in the table while holding a lock that blocks other queries". Knowing which category a given change falls into is the difference between a safe deploy and an incident.

## Adding a column: nullable vs \`NOT NULL\`, constant \`DEFAULT\` vs not

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                          -- nullable, no default: instant
ALTER TABLE emp ADD COLUMN active boolean NOT NULL DEFAULT true; -- constant default: instant (PG 11+)
ALTER TABLE emp ADD COLUMN dept text NOT NULL;                 -- NOT NULL, no default, populated table:
                                                                -- ERROR immediately
\`\`\`

- A nullable column with no default needs nothing done to existing rows — every existing row's new value is simply \`NULL\`. Instant, regardless of table size.
- **Since PostgreSQL 11**, adding a column with a *constant* \`DEFAULT\` (a literal, not an expression involving \`now()\` or another column) is **also** near-instant: PostgreSQL stores the default in the table's metadata and returns it for existing rows without physically rewriting them. (Before PostgreSQL 11, this rewrote the entire table — a real, sometimes hours-long, table-locking operation on a large table. Knowing your PostgreSQL version matters here.)
- Adding a **\`NOT NULL\` column with no default** on a table that already has rows is impossible to satisfy — every existing row would need a value nobody supplied — so PostgreSQL rejects it outright rather than guessing.

## The safe pattern for adding a required column to a populated table

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                    -- 1. add it nullable — instant
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;   -- 2. backfill every existing row
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;          -- 3. only now, enforce NOT NULL
\`\`\`

Step 3 still has to **scan the whole table** to confirm no row is \`NULL\` before it can promise \`NOT NULL\` going forward — but by the time you run it, step 2 has already guaranteed that scan will pass. On a very large table, even that scan-and-lock step can be a concern; the general technique of doing a risky change in small, verifiable stages (add, backfill, then constrain) rather than one big atomic step is the core idea behind zero-downtime schema changes.

## \`CHECK ... NOT VALID\` then \`VALIDATE CONSTRAINT\`: the same idea, for \`CHECK\`

Adding an ordinary \`CHECK\` constraint to a populated table requires scanning every existing row to confirm it satisfies the rule, while holding a lock for the duration of that scan. \`NOT VALID\` splits this into two steps:

\`\`\`sql
ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0) NOT VALID;
-- takes effect IMMEDIATELY for all new inserts and updates, with only a brief lock --
-- existing rows are NOT checked yet, so this step is fast regardless of table size

ALTER TABLE emp VALIDATE CONSTRAINT positive_salary;
-- scans existing rows to confirm the constraint already holds -- can run without
-- blocking ordinary reads/writes the way the combined ADD CONSTRAINT would
\`\`\`

If any existing row actually violates the constraint, \`VALIDATE CONSTRAINT\` fails and reports it — the constraint remains \`NOT VALID\` (i.e., not yet confirmed for old data) until you either fix the offending rows or drop the constraint. This two-step pattern is the standard way to add a \`CHECK\` (or a \`FOREIGN KEY\`, which supports the same \`NOT VALID\`/\`VALIDATE\` split) to a large, live table without a long blocking scan happening in the same moment as the schema change.

## Renaming and dropping columns

\`\`\`sql
ALTER TABLE emp RENAME COLUMN nm TO name;
SELECT nm FROM emp;   -- ERROR: column "nm" does not exist -- IMMEDIATELY, for every reader
\`\`\`

A rename is instant (it is metadata-only), but it is also **immediately breaking** for any query, application code, or reporting tool still using the old name — there is no transition period. This is precisely why renaming a column safely in a live system usually goes through an **expand-contract** sequence rather than a single \`RENAME\` (Lesson 6): add the new name, have writers populate both for a while, migrate readers over, only then drop the old name.

\`\`\`sql
ALTER TABLE emp DROP COLUMN legacy_field;   -- the data is gone; SQL itself asks no "are you sure"
\`\`\`

Dropping a column is irreversible at the SQL level (recovery, if any, comes from a database backup, not from the \`DROP\` statement itself) — treat it with the same caution as \`DROP TABLE\` (Lesson 6).

## The general mental model

Before running any \`ALTER TABLE\` against a table with real data in it, ask: **does this require reading or rewriting every existing row, and does it need to lock the table while doing so?**

| change | existing rows touched? | typical cost |
|---|---|---|
| add nullable column, no default | no | instant |
| add column with constant default (PG11+) | no | instant |
| add column with \`NOT NULL\`, no default, populated table | — | rejected outright |
| \`ALTER COLUMN ... SET NOT NULL\` | yes (checked) | scan, can fail |
| add \`CHECK\`/\`FOREIGN KEY\` (normal) | yes (checked) | scan + lock for the scan |
| add \`CHECK\`/\`FOREIGN KEY ... NOT VALID\` then \`VALIDATE\` | yes, but split into 2 steps | brief lock, then a separate scan |
| \`RENAME COLUMN\` | no | instant, but breaks old readers immediately |
| \`DROP COLUMN\` | no (data discarded) | instant, irreversible |
| change a column's data type | usually yes | often a full table rewrite |

Module 9 (Transactions & Concurrency) covers *why* some of these need a lock at all, and for how long, in more depth — this lesson is about recognising which category a change falls into before you run it against a live table.`,

    contentHi: `## \`ALTER TABLE\` ek operation nahi hai — bahut sारे hain, bahut alag costs ke saath

Har \`ALTER TABLE\` sub-command ko physically *kuch* karna padta hai schema change ko har existing row ke liye sahi banane ke liye, aur wo "kuch" "metadata ki ek line update karo" se lekar "table ki har row padho aur rewrite karो ek lock hold karte hue jo doosri queries ko block karta hai" tak range karta hai.

## Column add karna: nullable vs \`NOT NULL\`, constant \`DEFAULT\` vs nahi

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                          -- nullable, koi default nahi: instant
ALTER TABLE emp ADD COLUMN active boolean NOT NULL DEFAULT true; -- constant default: instant (PG 11+)
ALTER TABLE emp ADD COLUMN dept text NOT NULL;                 -- NOT NULL, koi default nahi, populated table:
                                                                -- turant ERROR
\`\`\`

- Ek nullable column bina default ke existing rows par kuch karne ki zaroorat nahi — har existing row ki nayi value bस \`NULL\` hai.
- **PostgreSQL 11 se**, ek *constant* \`DEFAULT\` ke saath column add karna **bhi** near-instant hai: PostgreSQL default ko table ke metadata mein store karta hai. (PostgreSQL 11 se pehle, ye poori table rewrite karta tha.)
- Ek table par jispar pehle se rows hain **bina default ke ek \`NOT NULL\` column** add karna satisfy karna impossible hai.

## Ek populated table mein ek required column add karne ka safe pattern

\`\`\`sql
ALTER TABLE emp ADD COLUMN dept text;                    -- 1. nullable add karo — instant
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;   -- 2. har existing row backfill karo
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;          -- 3. sirf ab, NOT NULL enforce karo
\`\`\`

## \`CHECK ... NOT VALID\` phir \`VALIDATE CONSTRAINT\`: wahi idea, \`CHECK\` ke liye

\`\`\`sql
ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0) NOT VALID;
-- SABHI naye inserts/updates ke liye TURANT effect mein, sirf ek brief lock ke saath --
-- existing rows abhi tak check NAHI hoती

ALTER TABLE emp VALIDATE CONSTRAINT positive_salary;
-- existing rows scan karta hai confirm karne ke liye ki constraint pehle se hold karta hai
\`\`\`

Agar koi existing row asal mein constraint violate karti hai, \`VALIDATE CONSTRAINT\` fail hoता hai aur report karta hai.

## Column rename aur drop karna

\`\`\`sql
ALTER TABLE emp RENAME COLUMN nm TO name;
SELECT nm FROM emp;   -- ERROR: column "nm" does not exist -- TURANT, har reader ke liye
\`\`\`

Rename instant hai, par ye **turant breaking** bhi hai kisi bhi query ke liye jo abhi bhi purana naam istemal karti hai. Yahi wajah hai ki live system mein ek column ko safely rename karna usually ek **expand-contract** sequence se guzarta hai (Lesson 6).

\`\`\`sql
ALTER TABLE emp DROP COLUMN legacy_field;   -- data gayab; SQL khud koi "kya aap sure hain" nahi poochता
\`\`\`

## General mental model

Kisi bhi \`ALTER TABLE\` chalane se pehle poочो: **kya isে har existing row padhne ya rewrite karne ki zaroorat hai, aur kya table ko lock karna hoga?**

Module 9 (Transactions & Concurrency) is baare mein aur gehраई se cover karta hai ki kuch operations ko lock ki zaroorat kyun hai — ye lesson ye pehchanने ke baare mein hai ki ek change kaunसी category mein aata hai use live table par chalane se pehle.`,

    examples: [
      {
        title: 'Adding a column with a constant DEFAULT works instantly on a populated table',
        titleHi: 'Ek constant DEFAULT waala column add karna ek populated table par instantly kaam karta hai',
        code: `CREATE TABLE emp (id int PRIMARY KEY, name text);
INSERT INTO emp VALUES (1,'Ada'),(2,'Bo');

ALTER TABLE emp ADD COLUMN active boolean NOT NULL DEFAULT true;
SELECT * FROM emp ORDER BY id;`,
        output: ` id | name | active
----+------+--------
 1  | Ada  | t
 2  | Bo   | t
(2 rows)`,
        explain: '`active boolean NOT NULL DEFAULT true` is added to a table that already has 2 rows. Because the default is a constant literal (`true`), not an expression depending on `now()` or another column, PostgreSQL (11+) stores it as table metadata rather than rewriting every existing row — both Ada and Bo instantly show `active = true` without any per-row rewrite happening.',
        explainHi: '`active boolean NOT NULL DEFAULT true` ek table mein add kiya jaता hai jismein pehle se 2 rows hain. Kyunki default ek constant literal (`true`) hai, `now()` ya ek doosre column par depend karne waala expression nahi, PostgreSQL (11+) ise table metadata ke roop mein store karta hai har existing row rewrite karne ke bजाy — Ada aur Bo dono turant `active = true` dikhाte hain bina kisi per-row rewrite ke.',
      },
      {
        title: 'Adding NOT NULL with no default fails immediately on a populated table',
        titleHi: 'Bina default ke NOT NULL add karna ek populated table par turant fail hota hai',
        code: `CREATE TABLE emp (id int PRIMARY KEY, name text);
INSERT INTO emp VALUES (1,'Ada');
ALTER TABLE emp ADD COLUMN dept text NOT NULL;`,
        output: `[ERROR] column "dept" of relation "emp" contains null values`,
        explain: 'The table already has one row (`id = 1`). Adding `dept text NOT NULL` with no default asks PostgreSQL to guarantee every row, including the pre-existing one, has a non-null `dept` — but there is no value to put there, since the column did not exist when that row was written. PostgreSQL refuses rather than inventing a placeholder, reporting exactly which column contains the problem.',
        explainHi: 'Table mein pehle se ek row hai (`id = 1`). Bina default ke `dept text NOT NULL` add karna PostgreSQL se maanga hai ki har row, pre-existing row sहित, ek non-null `dept` rakhे — par wahaan daalne ke liye koi value nahi hai, kyunki column tab exist nahi karta tha jab wo row likhi gayi thi. PostgreSQL ek placeholder invent karne ke bजाy refuse karta hai, theek batate hue kaunसे column mein problem hai.',
      },
      {
        title: 'The safe pattern: add nullable, backfill, then set NOT NULL',
        titleHi: 'Safe pattern: nullable add karo, backfill karo, phir NOT NULL set karo',
        code: `CREATE TABLE emp (id int PRIMARY KEY, name text);
INSERT INTO emp VALUES (1,'Ada'),(2,'Bo');

ALTER TABLE emp ADD COLUMN dept text;
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;

SELECT * FROM emp ORDER BY id;`,
        output: ` id | name | dept
----+------+------------
 1  | Ada  | unassigned
 2  | Bo   | unassigned
(2 rows)`,
        explain: "Step 1 adds `dept` as nullable — both existing rows get `NULL` in it, instantly, with no scan needed. Step 2's `UPDATE ... WHERE dept IS NULL` explicitly gives every row the value `'unassigned'`, closing the gap. Only THEN does step 3's `SET NOT NULL` run, and it succeeds because by this point every row genuinely does have a non-null value — the constraint is asserting something that is now actually true.",
        explainHi: "Step 1 `dept` ko nullable ke roop mein add karta hai — dono existing rows ko isमein `NULL` milta hai, turant, bina kisी scan ke. Step 2 ka `UPDATE ... WHERE dept IS NULL` explicitly har row ko `'unassigned'` value deता hai, gap band karте hue. Sirf TAB step 3 ka `SET NOT NULL` chalता hai, aur ye succeed hota hai kyunki is point tak har row genuinely ek non-null value rakhती hai — constraint kuch assert kar raha hai jo ab asal mein sach hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- adding a required column and its NOT NULL constraint in one step, on a live table
ALTER TABLE emp ADD COLUMN dept text NOT NULL;
-- fails outright the instant the table has even one existing row -- there is no
-- value to put in "dept" for rows that already existed before this column did`,
        right: `ALTER TABLE emp ADD COLUMN dept text;                     -- nullable first
UPDATE emp SET dept = 'unassigned' WHERE dept IS NULL;     -- give every row a value
ALTER TABLE emp ALTER COLUMN dept SET NOT NULL;            -- now the promise can be kept`,
        why: 'A NOT NULL constraint is a promise that every row has a value, and PostgreSQL will not accept a promise it cannot verify at the moment it is made. Adding a NOT NULL column with no default to a table that already contains rows would require inventing a value for those existing rows out of nowhere, which the database has no basis to do, so it refuses the statement immediately rather than silently making something up. The three-step pattern, add the column nullable, explicitly decide what value existing rows should get and write it with an UPDATE, then apply SET NOT NULL only once every row genuinely has a value, lets you choose the backfill value deliberately instead of the database guessing, and turns an operation that would otherwise be flatly impossible into three individually safe steps.',
        whyHi: 'Ek `NOT NULL` constraint ek promise hai ki har row ka ek value hai, aur PostgreSQL ek aisa promise accept nahi karता jise ye verify nahi kar sakta jab ye kiya jaта hai. Ek table mein jisme pehle se rows hain bina default ke ek `NOT NULL` column add karna un existing rows ke liye kahin se ek value invent karne ki zaroorat rakhता, jo database ke paas karne ka koi aadhaar nahi. Three-step pattern aapko backfill value deliberately choose karne deता hai database ko guess karne ke bजाy.',
      },
      {
        wrong: `-- adding a CHECK constraint the "normal" way on a large, busy production table
ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0);
-- this scans every existing row to confirm the rule holds, while holding a lock
-- for the ENTIRE scan -- on a huge table, that can block reads/writes for a
-- noticeable, unplanned window`,
        right: `ALTER TABLE emp ADD CONSTRAINT positive_salary CHECK (salary > 0) NOT VALID;  -- fast, brief lock
ALTER TABLE emp VALIDATE CONSTRAINT positive_salary;                            -- separate, safer scan`,
        why: 'Adding a CHECK constraint in the ordinary way requires PostgreSQL to scan every existing row before it can guarantee the rule holds, and it must hold a lock on the table for the full duration of that scan so no row can slip through unchecked while the scan is in progress. On a small table this is invisible; on a large, actively-written table, the scan can take long enough to noticeably block other queries during a production deployment. Adding the constraint with NOT VALID applies it immediately to all new writes with only a brief lock, deferring the expensive full-table scan to a separate VALIDATE CONSTRAINT step that can be run afterward, at a chosen time, and does not require the same exclusive access the combined operation does. This two-step pattern is the standard way to introduce a CHECK, or a FOREIGN KEY, on a large live table without an unplanned blocking window.',
        whyHi: 'Ek `CHECK` constraint normal tarike se add karne ke liye PostgreSQL ko har existing row scan karni hoती hai isse pehle ki ye guarantee kare ki rule hold karta hai, aur ise poori scan ke liye table par ek lock hold karна hoga. Ek chhoti table par ye invisible hai; ek badी, actively-written table par, scan itni der le sakta hai ki doosri queries ko noticeably block kare. `NOT VALID` ke saath constraint add karna ise turant sabhi naye writes par apply karta hai sirf ek brief lock ke saath, expensive full-table scan ko ek alag `VALIDATE CONSTRAINT` step tak deफर karте hue.',
      },
      {
        wrong: `-- renaming a column and assuming existing readers keep working
ALTER TABLE emp RENAME COLUMN nm TO name;
-- every application query, report, and dashboard still using "nm" breaks
-- IMMEDIATELY -- there is no transition window, no deprecation period`,
        right: `-- for a column readers depend on, use an expand-contract sequence instead (Lesson 6):
-- 1. add the new column, 2. write to both old and new for a while, 3. migrate
-- readers to the new name at their own pace, 4. only then drop the old column`,
        why: 'RENAME COLUMN is instant precisely because it only changes metadata, but that same instantness is what makes it dangerous: the moment it commits, every query anywhere that still references the old column name starts failing, with no grace period during which both names work. In a system with more than one deployed consumer of the table, an application server, a reporting tool, an analytics job, a straight rename is effectively "break everyone who has not redeployed yet at the exact same instant the migration runs." The safer approach treats a rename as a multi-step migration in its own right: introduce the new name alongside the old one, have writers populate both during a transition period, move readers over to the new name one at a time, and only remove the old column once nothing depends on it anymore.',
        whyHi: '`RENAME COLUMN` turant hai theek isliye kyunki ye sirf metadata badalta hai, par wahi turant hona ise dangerous banata hai: jis pal ye commit hota hai, kahin bhi purana column naam abhi bhi reference karने waali har query fail hona shuru hoती hai, koi grace period ke bina. Ek system mein jahaan table ke ek se zyada deployed consumers hain, ek straight rename effectively "jisne abhi tak redeploy nahi kiya use theek migration chalne ke usī instant break karo" hai. Safer approach ek rename ko apne aap mein ek multi-step migration ki tarah treat karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A migration linter that blocks any PR adding `NOT NULL` to an existing column without a preceding backfill migration** — encoding the three-step safe pattern as an automated check.',
        hi: '**Ek migration linter jo kisi bhi PR ko block karta hai jo bina pehle ke backfill migration ke ek existing column mein `NOT NULL` add karta hai** — three-step safe pattern ko ek automated check ke roop mein encode karте hue.',
      },
      {
        en: '**Every new `CHECK`/`FOREIGN KEY` on a large table added as `NOT VALID` in one deploy, `VALIDATE CONSTRAINT` run as a separate, off-peak-hours job** — standard practice at any company running PostgreSQL at scale.',
        hi: '**Ek badी table par har naya `CHECK`/`FOREIGN KEY` ek deploy mein `NOT VALID` ke roop mein add kiya jaता hai, `VALIDATE CONSTRAINT` ek alag, off-peak-hours job ke roop mein chalाya jaता hai**.',
      },
      {
        en: '**A "no bare `ALTER TABLE ... RENAME COLUMN` on a shared table" rule in a migration review checklist**, requiring the expand-contract sequence instead whenever more than one service reads the table.',
        hi: '**Ek migration review checklist mein "shared table par koi bare `ALTER TABLE ... RENAME COLUMN` nahi" rule**, jab bhi ek se zyada service table padhती hai expand-contract sequence chahिए.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does adding a `NOT NULL` column with no default fail on a populated table, and what is the safe way to add one?',
        qHi: 'Bina default ke ek `NOT NULL` column add karna ek populated table par kyun fail hota hai, aur ek add karne ka safe tarika kya hai?',
        a: 'A NOT NULL constraint is a promise, enforced by the database, that every row in the table has a non-null value in that column. When you add a brand new column with no default to a table that already has rows, PostgreSQL has no value to put into that column for those existing rows, they did not exist when the rows were originally written, so it cannot honestly claim NOT NULL holds for them, and it rejects the statement immediately with an error naming the column and stating it contains null values, rather than silently inventing a value or leaving the constraint unenforced. The safe way to introduce a required column on a live, populated table is to do it in three separate steps. First add the column without NOT NULL, so it is nullable and the operation is instant regardless of table size. Second, run an UPDATE that explicitly decides what value existing rows should have and writes it, backfilling every row that would otherwise be null. Third, only once you have confirmed every row has a value, run ALTER COLUMN SET NOT NULL, which will succeed because the condition it is asserting is now actually true. Splitting it this way also lets you choose the backfill value deliberately, rather than being limited to whatever a single DEFAULT expression could produce.',
        aHi: 'Ek `NOT NULL` constraint ek promise hai, database dwara enforced, ki table ki har row ke us column mein ek non-null value hai. Jab aap ek table mein jispar pehle se rows hain ek bilkul naya column bina default ke add karте ho, PostgreSQL ke paas un existing rows ke liye us column mein daalne ke liye koi value nahi hai, to ye statement ko turant reject karта hai. Live, populated table par ek required column introduce karne ka safe tarika teen alag steps mein karna hai: pehle bina `NOT NULL` ke column add karo, phir ek `UPDATE` chalाओ jo explicitly decide karta hai existing rows ka value kya hona chahiye, phir sirf jab har row ka ek value confirm ho jaye, `SET NOT NULL` chalao.',
      },
      {
        q: 'What does `CHECK ... NOT VALID` followed by `VALIDATE CONSTRAINT` accomplish that a plain `ADD CONSTRAINT` does not?',
        qHi: '`CHECK ... NOT VALID` ke baad `VALIDATE CONSTRAINT` wo kya accomplish karta hai jo ek plain `ADD CONSTRAINT` nahi karta?',
        a: 'A plain ADD CONSTRAINT for a CHECK requires PostgreSQL to do two things as one atomic operation: start enforcing the rule for all future writes, and confirm that every existing row already satisfies it. The second part means scanning the entire table, and PostgreSQL has to hold a lock on the table for the whole duration of that scan so that no row can be inserted or modified in a way that would violate the rule while the check is still in progress, which on a large, actively used table can mean a noticeably long blocking window during a deployment. Adding the constraint with the NOT VALID clause separates these two concerns. It takes effect immediately for enforcement purposes, any new insert or update from that moment on is checked against the rule, but it explicitly skips validating the existing rows, so the operation itself is fast and only needs a brief lock. The separate VALIDATE CONSTRAINT statement then performs the full-table scan on its own schedule, without requiring the same kind of exclusive access, and if it finds an existing row that violates the rule, it reports that clearly rather than silently succeeding. This lets you introduce a constraint on a large live table without a single operation that blocks for as long as a full scan takes.',
        aHi: 'Ek `CHECK` ke liye ek plain `ADD CONSTRAINT` PostgreSQL ko do cheezें ek atomic operation ke roop mein karne ki maang karta hai: sabhi future writes ke liye rule enforce karna shuru karna, aur confirm karna ki har existing row pehle se ise satisfy karti hai. Doosra hissa poori table scan karna matlab rakhता hai, aur PostgreSQL ko poori scan ke liye table par ek lock hold karna hoga. `NOT VALID` clause ke saath constraint add karna in do concerns ko separate karta hai. Ye enforcement purposes ke liye turant effect mein aata hai, par ye explicitly existing rows validate karna skip karta hai, to operation khud fast hai. Alag `VALIDATE CONSTRAINT` statement phir full-table scan apne schedule par karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `emp(id int PRIMARY KEY, name text)` with 2 existing rows. Add a column `region text NOT NULL DEFAULT \'unknown\'` in one step and confirm it succeeds instantly (constant default, PG11+ fast path). Then, in a separate attempt, try adding `dept text NOT NULL` with no default and confirm it fails.',
        taskHi: 'Table `emp(id, name)` 2 existing rows ke saath. Ek step mein `region text NOT NULL DEFAULT \'unknown\'` column add karo. Phir, ek alag attempt mein, bina default ke `dept text NOT NULL` add karne ki koshish karo.',
        hint: 'A constant `DEFAULT` value lets PostgreSQL satisfy `NOT NULL` for existing rows without rewriting them (PG11+). No default at all leaves no value to assign, so it fails immediately.',
        hintHi: 'Ek constant `DEFAULT` value PostgreSQL ko existing rows ke liye `NOT NULL` satisfy karne deता hai bina unhe rewrite kiye. Koi default na hone par assign karne ke liye koi value nahi bachती, to ye turant fail hota hai.',
      },
      {
        task: 'Table `product(id int PRIMARY KEY, price int)` with rows including one negative price already present. Add `CHECK (price > 0) NOT VALID` and confirm it succeeds despite the bad existing row. Then run `VALIDATE CONSTRAINT` and confirm it fails, naming the constraint.',
        taskHi: 'Table `product(id, price)` rows ke saath jinme se ek negative price pehle se maujood hai. `CHECK (price > 0) NOT VALID` add karo aur confirm karo ye galat existing row ke bavjood succeed hota hai. Phir `VALIDATE CONSTRAINT` chalao.',
        hint: '`NOT VALID` skips checking existing rows at add-time, so it succeeds even with a bad row already present. `VALIDATE CONSTRAINT` performs the deferred scan and reports the violation it finds.',
        hintHi: '`NOT VALID` add-time par existing rows check karna skip karta hai, to ye ek galat row ke saath bhi succeed hota hai. `VALIDATE CONSTRAINT` deferred scan karta hai aur jo violation milta hai use report karta hai.',
      },
      {
        task: 'Table `emp(id int PRIMARY KEY, nm text)`. Rename `nm` to `name`, then try `SELECT nm FROM emp` and confirm it errors immediately. Explain in a comment why this makes a bare `RENAME COLUMN` risky on a table with more than one reader, and sketch (in comments) the expand-contract alternative from Lesson 6.',
        taskHi: 'Table `emp(id, nm)`. `nm` ko `name` mein rename karo, phir `SELECT nm FROM emp` try karo aur confirm karo ye turant error deta hai.',
        hint: 'The old column name stops existing the instant the `ALTER TABLE ... RENAME` commits — there is no grace period. Any reader (app code, reports) still using the old name breaks immediately, everywhere, at once.',
        hintHi: 'Purana column naam `ALTER TABLE ... RENAME` commit hote hi exist karna band kar deta hai — koi grace period nahi. Purana naam istemal karne waala koi bhi reader turant, har jagah, ek saath toot jaata hai.',
      },
    ],

    keyTakeaways: [
      '`ALTER TABLE` is many operations with VERY different costs — always ask "does this need to read/rewrite every existing row, and does it lock the table while doing so?" before running one against a live, populated table.',
      'Adding a NULLABLE column with no default is INSTANT (nothing to fill in for existing rows). Adding a column with a CONSTANT `DEFAULT` is ALSO instant on PostgreSQL 11+ (stored as metadata, not rewritten — check your PG version, this changed behavior).',
      'Adding a `NOT NULL` column with NO default to a POPULATED table FAILS IMMEDIATELY (`column ... contains null values`) — there is no value to assign to pre-existing rows, and PostgreSQL will not invent one.',
      'THE SAFE PATTERN for a required column on a live table: (1) `ADD COLUMN` nullable — instant; (2) `UPDATE` to backfill every existing row with a deliberately-chosen value; (3) `ALTER COLUMN ... SET NOT NULL` — now safe, because step 2 already guarantees no `NULL`s remain. `SET NOT NULL` still SCANS the whole table to confirm this.',
      '`CHECK`/`FOREIGN KEY` added the ORDINARY way scans + LOCKS the whole table for the scan\'s duration — risky on a large live table. `ADD CONSTRAINT ... NOT VALID` enforces the rule for all NEW writes immediately with only a BRIEF lock, deferring the full-table scan to a separate `VALIDATE CONSTRAINT` step that can run later without the same blocking cost. If an existing row violates it, `VALIDATE CONSTRAINT` reports the failure explicitly.',
      '`RENAME COLUMN` is instant (metadata-only) but IMMEDIATELY BREAKS every reader still using the old name — no transition window. On a table with more than one consumer, use an EXPAND-CONTRACT sequence instead (Lesson 6): add the new name, dual-write for a while, migrate readers, then drop the old name.',
      '`DROP COLUMN` is instant but IRREVERSIBLE at the SQL level — treat with the same caution as `DROP TABLE` (Lesson 6). Changing a column\'s data type is usually a FULL TABLE REWRITE.',
    ],
    keyTakeawaysHi: [
      '`ALTER TABLE` bahut si operations hain BAHUT alag costs ke saath — hamesha poочो "kya isе har existing row padhne/rewrite karne ki zaroorat hai, aur kya ye aise karते hue table lock karta hai?" ek live, populated table par chalane se pehle.',
      'Bina default ke ek NULLABLE column add karna INSTANT hai. Ek CONSTANT `DEFAULT` waala column add karna PostgreSQL 11+ par BHI instant hai (metadata ke roop mein stored, rewritten nahi).',
      'Ek POPULATED table mein koi default na waale `NOT NULL` column add karna TURANT FAIL hota hai — pre-existing rows ko assign karne ke liye koi value nahi hai.',
      'SAFE PATTERN ek live table par ek required column ke liye: (1) `ADD COLUMN` nullable — instant; (2) har existing row ko ek deliberately-chosen value se backfill karne ke liye `UPDATE`; (3) `ALTER COLUMN ... SET NOT NULL` — ab safe.',
      '`CHECK`/`FOREIGN KEY` ORDINARY tarike se add ki gayi poori table scan + LOCK karti hai. `ADD CONSTRAINT ... NOT VALID` rule ko sabhi NAYI writes ke liye turant enforce karta hai sirf ek BRIEF lock ke saath.',
      '`RENAME COLUMN` instant hai par purana naam istemal karne waale har reader ko TURANT TODTА hai — koi transition window nahi. Ek se zyada consumers waali table par, EXPAND-CONTRACT sequence istemal karo (Lesson 6).',
      '`DROP COLUMN` instant hai par SQL level par IRREVERSIBLE hai. Ek column ka data type badalna usually ek FULL TABLE REWRITE hai.',
    ],
  },

  {
    slug: 'sql-sequences-identity-and-schemas',
    title: 'Sequences, IDENTITY & Schemas',
    titleHi: 'Sequences, IDENTITY Aur Schemas',
    description: 'Behind every auto-incrementing primary key is a sequence — a small, separate counter object. `GENERATED ALWAYS AS IDENTITY` is the modern way to attach one; gaps in the numbers it produces are normal, not corruption. Schemas let one database hold several independent namespaces of same-named tables.',
    descriptionHi: 'Har auto-incrementing primary key ke peeche ek sequence hai — ek chhota, alag counter object. `GENERATED ALWAYS AS IDENTITY` ek attach karne ka modern tarika hai; iske dwara produce ki gayi numbers mein gaps normal hain, corruption nahi. Schemas ek database ko same-named tables ke kई independent namespaces rakhने deते hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A deli\'s take-a-number machine, and the separate wings of a single large building.** The little ticket dispenser at a busy deli does one job only: hand out the next number, in order, forever. It has no idea who is being served, whether an order got cancelled, or whether ticket 42 ever actually got called — its entire responsibility is "42 has been handed out, next time someone presses the button, hand out 43." If ticket 42\'s order gets cancelled before anyone is served, number 42 is simply never called; the counter does not "give it back", and nobody expects it to — the numbers were only ever a way to keep order, not a complete, gap-free inventory of every order ever placed. That is exactly a sequence attached to a primary key: it hands out the next integer and moves on, and a cancelled transaction or a failed insert leaves a permanent, harmless gap. Separately, imagine one large office building shared by two unrelated companies, each with its own "Reception" desk, its own "Records" room, its own "Invoice" filing cabinet — the *names* are identical, but nobody confuses Company A\'s Invoice cabinet with Company B\'s, because you always say *which wing* you mean. A schema is that wing: it lets a single database hold two entirely separate sets of same-named tables without them ever colliding.',
      hi: '**Ek deli ki take-a-number machine, aur ek single badी building ke alag wings.** Ek busy deli ka chhota ticket dispenser sirf ek kaam karta hai: agla number handout karो, order mein, hamesha. Ise koi idea nahi ki kisकी serve ho raha hai, kya ek order cancel hua, ya kya ticket 42 kabhi asal mein call hua. Iski poori responsibility hai "42 handout ho chuka hai, agli baar koi button dabाता hai, 43 handout karो." Agar ticket 42 ka order kisi ke serve hone se pehle cancel ho jaता hai, number 42 bस kabhi call nahi hota; counter ise "wapas nahi deता", aur koi expect bhi nahi karta. Yahi theek ek sequence hai jo primary key se attach ki gayi hai: ye agla integer handout karta hai aur aage badता hai, aur ek cancelled transaction ek permanent, harmless gap chhoड़ता hai. Alag se, ek badी office building socho jo do unrelated companies share karти hain, har ek ki apni "Reception" desk, apna "Records" room, apna "Invoice" filing cabinet — *naam* identical hain, par koi bhi Company A ke Invoice cabinet ko Company B ke saath confuse nahi karta, kyunki aap hamesha kehte ho *kaunसی wing*. Ek schema wahi wing hai.',
    },

    simple: `**\`GENERATED ALWAYS AS IDENTITY\` — the modern way to auto-increment a primary key**

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b'), ('c');
SELECT * FROM t;   -- ids 1, 2, 3, assigned automatically -- never write to "id" yourself
\`\`\`

**Behind it is a separate sequence object — a simple, fast counter**

\`\`\`
each INSERT: ask the sequence for "the next value", use it, move on
the sequence has no idea whether that value was ever actually committed
\`\`\`

**Gaps in the sequence are NORMAL — never rely on "gapless" ids**

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a');
-- a transaction that ADVANCES the sequence but then rolls back leaves a permanent gap:
-- BEGIN; INSERT INTO t (name) VALUES ('will-rollback'); ROLLBACK;
INSERT INTO t (name) VALUES ('b');
SELECT * FROM t;   -- 1, 'a'  and  3, 'b'  -- id 2 was consumed and never reused
\`\`\`

**\`DELETE\` does NOT reset the sequence; only \`TRUNCATE ... RESTART IDENTITY\` does**

\`\`\`sql
DELETE FROM t;                          -- removes rows -- the sequence position is UNCHANGED
INSERT INTO t (name) VALUES ('c');      -- continues from where the sequence left off
TRUNCATE t RESTART IDENTITY;            -- the ONLY way to reset the counter back to 1
\`\`\`

**\`serial\` (legacy) vs \`GENERATED ALWAYS AS IDENTITY\` (modern, SQL-standard)**

\`\`\`sql
id serial PRIMARY KEY                          -- older syntax, still works, some rough edges
id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY -- prefer this in new schemas
\`\`\`

**Schemas — namespaces inside one database**

\`\`\`sql
CREATE SCHEMA billing;
CREATE TABLE billing.invoice (id int PRIMARY KEY);   -- distinct from "public.invoice"
CREATE TABLE invoice (id int PRIMARY KEY);            -- lives in the default "public" schema
SELECT * FROM billing.invoice;                        -- schema-qualified: unambiguous
SELECT * FROM invoice;                                -- resolved via search_path (usually "public")
\`\`\``,

    simpleHi: `**\`GENERATED ALWAYS AS IDENTITY\` — ek primary key auto-increment karne ka modern tarika**

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b'), ('c');
SELECT * FROM t;   -- ids 1, 2, 3, automatically assigned -- kabhi khud "id" mein likho mat
\`\`\`

**Iske peeche ek alag sequence object hai — ek simple, fast counter**

\`\`\`
har INSERT: sequence se "agli value" poочो, use karो, aage badो
sequence ko koi idea nahi ki wo value kabhi asal mein committed hui ya nahi
\`\`\`

**Sequence mein gaps NORMAL hain — kabhi "gapless" ids par bharosa mat karo**

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a');
-- ek transaction jo sequence ko ADVANCE karता hai par phir rollback hota hai
-- ek permanent gap chhoड़ता hai
INSERT INTO t (name) VALUES ('b');
SELECT * FROM t;   -- 1, 'a'  aur  3, 'b'  -- id 2 consume hua aur kabhi reuse nahi hua
\`\`\`

**\`DELETE\` sequence RESET NAHI karta; sirf \`TRUNCATE ... RESTART IDENTITY\` karta hai**

\`\`\`sql
DELETE FROM t;                          -- rows hataता hai -- sequence position UNCHANGED
INSERT INTO t (name) VALUES ('c');      -- jahaan sequence chhoड़ी thi wahaan se continue
TRUNCATE t RESTART IDENTITY;            -- counter ko 1 par wapas reset karne ka EKMATRA tarika
\`\`\`

**\`serial\` (legacy) vs \`GENERATED ALWAYS AS IDENTITY\` (modern, SQL-standard)**

\`\`\`sql
id serial PRIMARY KEY                          -- purana syntax, abhi bhi kaam karta hai
id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY -- naye schemas mein ise prefer karo
\`\`\`

**Schemas — ek database ke andar namespaces**

\`\`\`sql
CREATE SCHEMA billing;
CREATE TABLE billing.invoice (id int PRIMARY KEY);   -- "public.invoice" se distinct
CREATE TABLE invoice (id int PRIMARY KEY);            -- default "public" schema mein
SELECT * FROM billing.invoice;                        -- schema-qualified: unambiguous
SELECT * FROM invoice;                                -- search_path se resolved
\`\`\``,

    content: `## What is behind an auto-incrementing column

\`GENERATED ALWAYS AS IDENTITY\` attaches a **sequence** to a column: a small, separate database object whose only job is to hand out the next integer in order, every time it is asked, with no other logic attached.

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b'), ('c');
-- ids 1, 2, 3 -- assigned automatically; you never write to "id" yourself
\`\`\`

\`GENERATED ALWAYS\` (as opposed to \`GENERATED BY DEFAULT\`) means the column, like a \`GENERATED ... STORED\` column (Lesson 3), normally rejects an explicit value on insert — the sequence is always the source of truth. (\`GENERATED BY DEFAULT AS IDENTITY\` exists for the rarer case of needing to explicitly insert a specific id, such as during a data migration, while still having the sequence available for ordinary inserts.)

## Why gaps in the numbers are normal

A sequence's only contract is "give out the next integer, in order, and never give out the same one twice" — it has **no knowledge of, and no interest in, whether the row that consumed a number was ever actually committed**. Any of the following leaves a permanent gap:

- A transaction that inserts a row (consuming a sequence value) and then rolls back.
- A statement that fails partway through, after the sequence value was already claimed.
- Concurrent transactions, where sequence values can be claimed slightly out of the order the rows are eventually committed in.

None of these are bugs or corruption — a sequence intentionally does not roll back with its transaction, specifically so that two concurrent transactions never have to wait on each other just to get their next number. **Never build logic that assumes ids are gapless** ("the 5th row ever inserted has id 5") — if you need a true, gapless row count or position, compute it with \`row_number()\` (Module 6) at query time, not by reading the primary key.

## \`serial\` vs \`GENERATED ALWAYS AS IDENTITY\`

\`serial\` is PostgreSQL's older, non-standard shorthand for "create a sequence and wire it to this column as the default":

\`\`\`sql
id serial PRIMARY KEY                            -- legacy, still supported
id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY  -- modern, SQL-standard syntax, prefer this
\`\`\`

\`GENERATED ALWAYS AS IDENTITY\` is the SQL-standard syntax (also used by other databases), integrates more cleanly with privileges and \`pg_dump\`, and — because it is \`GENERATED ALWAYS\` by default — actively prevents the easy-to-make mistake of accidentally overwriting an identity value with an explicit \`INSERT\`. New schemas should use \`IDENTITY\`; \`serial\` remains common in older codebases and is not wrong, just superseded.

## \`DELETE\` vs \`TRUNCATE\` and the sequence

Deleting rows does **not** rewind the sequence — the counter has no relationship to how many rows currently exist, only to how many values it has ever handed out:

\`\`\`sql
DELETE FROM t;                     -- rows gone; sequence position unchanged
INSERT INTO t (name) VALUES ('c'); -- picks up from wherever the sequence left off
\`\`\`

Plain \`TRUNCATE t\` also does **not** reset the sequence by default — only \`TRUNCATE t RESTART IDENTITY\` explicitly resets the counter back to its starting value (Lesson 6 covers \`TRUNCATE\` vs \`DELETE\` in full).

## Schemas: namespaces within one database

A **schema** is a namespace inside a database — a way for two tables with the **same name** to coexist without colliding, as long as they live in different schemas:

\`\`\`sql
CREATE SCHEMA billing;
CREATE TABLE billing.invoice (id int PRIMARY KEY);
CREATE TABLE invoice (id int PRIMARY KEY);   -- this one lives in "public", the default schema

SELECT * FROM billing.invoice;   -- schema-qualified: always unambiguous
SELECT * FROM invoice;           -- unqualified: resolved via search_path
\`\`\`

Every PostgreSQL database starts with a default schema named \`public\`; an unqualified table name is resolved by searching the schemas listed in the \`search_path\` setting, in order, and using the first match. Schemas are useful for organizing a large database into logical areas (\`billing\`, \`analytics\`, \`auth\`), for giving different teams or applications their own namespace within a shared database, or for keeping several versions/environments of similar tables separated without needing entirely separate databases. **In shared or multi-schema databases, prefer explicit schema-qualified names** (\`billing.invoice\` rather than relying on \`search_path\` resolving \`invoice\` correctly) — it removes an entire class of "which table did that unqualified name actually resolve to" ambiguity, especially in migrations and scripts that might run with a different \`search_path\` than expected.`,

    contentHi: `## Ek auto-incrementing column ke peeche kya hai

\`GENERATED ALWAYS AS IDENTITY\` ek column se ek **sequence** attach karता hai: ek chhota, alag database object jiska sirf kaam hai agla integer order mein handout karna, har baar jab pucha jae.

\`\`\`sql
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b'), ('c');
-- ids 1, 2, 3 -- automatically assigned; aap kabhi khud "id" mein likhte nahi
\`\`\`

\`GENERATED ALWAYS\` (\`GENERATED BY DEFAULT\` ke muकаble) matlab column, ek \`GENERATED ... STORED\` column ki tarah (Lesson 3), normally insert par ek explicit value reject karta hai — sequence hamesha source of truth hai.

## Numbers mein gaps normal kyun hain

Ek sequence ka ekmatra contract "agla integer, order mein, do" hai — ise **koi gyaan ya interest nahi ki jis row ne ek number consume kiya wo kabhi asal mein committed hui ya nahi**. In mein se koi bhi ek permanent gap chhoड़ता hai:
- Ek transaction jo ek row insert karta hai (sequence value consume karके) aur phir rollback hota hai.
- Ek statement jo beech mein fail hota hai.
- Concurrent transactions.

In mein se koi bhi bug ya corruption nahi hai — ek sequence jaan-boojhkar apne transaction ke saath rollback nahi hoता. **Kabhi aisा logic mat banao jo maане ki ids gapless hain** — agar aapko true, gapless row count chahiye, ise \`row_number()\` (Module 6) se query time par compute karो.

## \`serial\` vs \`GENERATED ALWAYS AS IDENTITY\`

\`serial\` PostgreSQL ka purana, non-standard shorthand hai. \`GENERATED ALWAYS AS IDENTITY\` SQL-standard syntax hai, privileges aur \`pg_dump\` ke saath zyada saaf integrate karta hai. Naye schemas ko \`IDENTITY\` istemal karna chahiye.

## \`DELETE\` vs \`TRUNCATE\` aur sequence

Rows delete karna sequence ko **rewind NAHI karta**:

\`\`\`sql
DELETE FROM t;                     -- rows gone; sequence position unchanged
INSERT INTO t (name) VALUES ('c'); -- jahaan sequence chhoड़ी thi wahaan se
\`\`\`

Plain \`TRUNCATE t\` bhi default se sequence reset NAHI karta — sirf \`TRUNCATE t RESTART IDENTITY\` explicitly counter ko wapas reset karta hai (Lesson 6).

## Schemas: ek database ke andar namespaces

Ek **schema** ek database ke andar ek namespace hai:

\`\`\`sql
CREATE SCHEMA billing;
CREATE TABLE billing.invoice (id int PRIMARY KEY);
CREATE TABLE invoice (id int PRIMARY KEY);   -- default "public" schema mein

SELECT * FROM billing.invoice;   -- schema-qualified: hamesha unambiguous
SELECT * FROM invoice;           -- unqualified: search_path se resolved
\`\`\`

Har PostgreSQL database ek default schema \`public\` ke saath shuru hoती hai. **Shared ya multi-schema databases mein, explicit schema-qualified names prefer karo** — ye "wo unqualified naam asal mein kaunसी table resolve hua" ambiguity ki poori category hataता hai.`,

    examples: [
      {
        title: 'IDENTITY assigns sequential ids automatically, in order of insertion',
        titleHi: 'IDENTITY sequential ids automatically assign karta hai, insertion ke order mein',
        code: `CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b'), ('c');
SELECT * FROM t ORDER BY id;`,
        output: ` id | name
----+------
 1  | a
 2  | b
 3  | c
(3 rows)`,
        explain: "Each `INSERT` asks the sequence backing `id` for the next value, in order: `1` for `'a'`, `2` for `'b'`, `3` for `'c'` — one insert statement inserting all three values at once still assigns them sequentially, matching the order the rows are listed in the `VALUES` clause. Nothing here needed to name `id` explicitly; the sequence supplied every value.",
        explainHi: "Har `INSERT` `id` ke peeche ki sequence se agli value poochता hai, order mein: `'a'` ke liye `1`, `'b'` ke liye `2`, `'c'` ke liye `3` — ek insert statement jo teenon values ek saath insert karta hai phir bhi unhe sequentially assign karta hai, `VALUES` clause mein rows list hone ke order se match karте hue. Yahaan `id` ko explicitly naam dene ki zaroorat nahi thi; sequence ne har value supply ki.",
      },
      {
        title: 'DELETE does not reset the sequence; the next insert continues from where it left off',
        titleHi: 'DELETE sequence reset nahi karta; agla insert jahaan chhoda tha wahaan se continue karta hai',
        code: `CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b');
DELETE FROM t;
INSERT INTO t (name) VALUES ('c');
SELECT * FROM t;`,
        output: ` id | name
----+------
 3  | c
(1 row)`,
        explain: "Rows `'a'` (id 1) and `'b'` (id 2) are inserted, then `DELETE FROM t` removes both — but `DELETE` only removes rows, it has no effect on the sequence object itself. The sequence's internal counter is still sitting at 2 (the last value it handed out), so the next `INSERT` gets `id = 3`, continuing exactly where the sequence left off rather than restarting from 1.",
        explainHi: "Rows `'a'` (id 1) aur `'b'` (id 2) insert hoती hain, phir `DELETE FROM t` dono hataता hai — par `DELETE` sirf rows hataता hai, sequence object par khud iska koi effect nahi hai. Sequence ka internal counter abhi bhi 2 par hai (aakhri value jo isne handout ki), to agla `INSERT` `id = 3` paata hai, theek wahin se continue karте hue jahaan sequence ne chhoड़a tha, 1 se restart karne ke bजाy.",
      },
      {
        title: 'Schema-qualified names disambiguate two tables that share a name',
        titleHi: 'Schema-qualified names ek hi naam share karne waali do tables ko disambiguate karte hain',
        code: `CREATE SCHEMA billing;
CREATE TABLE billing.invoice (id int PRIMARY KEY, amt int);
CREATE TABLE invoice (id int PRIMARY KEY, amt int);
INSERT INTO billing.invoice VALUES (1, 100);
INSERT INTO invoice VALUES (1, 999);

SELECT 'billing' AS which, amt FROM billing.invoice
UNION ALL
SELECT 'public' AS which, amt FROM invoice;`,
        output: ` which   | amt
---------+-----
 billing | 100
 public  | 999
(2 rows)`,
        explain: '`billing.invoice` and `invoice` (in the default `public` schema) are two entirely separate tables that happen to share the name `invoice` — they can each independently hold a row with `id = 1` without colliding, because they live in different namespaces. Schema-qualifying the `FROM` clause in each half of the `UNION ALL` is what makes it unambiguous which table each row came from.',
        explainHi: '`billing.invoice` aur `invoice` (default `public` schema mein) do poori tarah alag tables hain jo `invoice` naam share karти hain — dono independently `id = 1` waali ek row rakh sakte hain bina collide kiye, kyunki wo alag namespaces mein rehते hain. `UNION ALL` ke har hisse mein `FROM` clause ko schema-qualify karna hi ye unambiguous banata hai ki har row kaunसी table se aayi.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming the identity column gives a gapless count of rows ever inserted
CREATE TABLE ticket (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, subject text);
-- "the current id tells us exactly how many tickets have ever been created"
-- SELECT max(id) FROM ticket;  -- treated as "total tickets ever created"`,
        right: `SELECT count(*) FROM ticket;   -- the actual count of rows that exist right now
-- if you need "the Nth ticket ever inserted" for some other reason, that requires
-- a separate, explicit tracking mechanism -- the identity column does not promise it`,
        why: 'A sequence\'s only guarantee is that it hands out each integer once, in increasing order; it makes no promise that every value it hands out corresponds to a row that is still present, or even that every value was ever committed at all. A rolled-back transaction, a failed insert, or ordinary concurrent activity can all consume a sequence value that no surviving row ever uses, leaving a permanent gap. Reading the maximum identity value as though it were a running total of everything ever inserted silently overcounts by however many gaps have accumulated, and the number only grows more wrong over the life of the table. If you need an actual count of existing rows, count them directly; if you need something like "the Nth thing ever created", that requires its own explicit tracking, because the identity sequence was never designed to provide it.',
        whyHi: 'Ek sequence ka ekmatra guarantee ye hai ki ye har integer ek baar, badte order mein deта hai; ye koi promise nahi karta ki jo bhi value ye deता hai wo abhi bhi maujood ek row se correspond karti hai. Ek rolled-back transaction, ek failed insert, ya ordinary concurrent activity sab ek sequence value consume kar sakte hain jise koi surviving row kabhi istemal nahi karti, ek permanent gap chhoड़te hue. Maximum identity value ko aise padhna jaise ye ab tak insert ki gayi har cheez ka ek running total ho chupchaap utne overcounts karta hai jitne gaps accumulate hue.',
      },
      {
        wrong: `-- expecting TRUNCATE alone to reset the sequence back to 1
CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b');
TRUNCATE t;
INSERT INTO t (name) VALUES ('c');
-- expected id 1, but the sequence was never told to restart`,
        right: `TRUNCATE t RESTART IDENTITY;
INSERT INTO t (name) VALUES ('c');
-- RESTART IDENTITY is not implied by TRUNCATE alone -- it must be requested explicitly`,
        why: 'TRUNCATE by itself empties a table quickly, but it does not touch any sequence associated with the table\'s columns unless you explicitly say RESTART IDENTITY. Without that clause, the sequence keeps whatever value it was already at, so the next insert continues numbering from there rather than starting over, which surprises people who assume "empty the table" implicitly means "and reset the counter too." The two behaviors are deliberately separate: sometimes you want to keep numbering continuous even after clearing test data, and sometimes, typically when resetting a table between test runs, you want a clean restart, so PostgreSQL makes you ask for the restart explicitly rather than guessing which one you meant.',
        whyHi: '`TRUNCATE` akela jaldi ek table khaali karta hai, par ye table ke columns se associated koi sequence ko touch nahi karta jab tak aap explicitly `RESTART IDENTITY` na kahо. Us clause ke bina, sequence jahaan pehle se thi wahaan rehती hai, to agla insert wahaan se numbering continue karta hai shuru se nahi, jo un logon ko surprise karta hai jo maानते hain ki "table khaali karo" implicitly "aur counter bhi reset karo" ka matlab hai.',
      },
      {
        wrong: `-- an unqualified table name in a database with multiple schemas and an
-- unexpected search_path
-- SET search_path TO analytics, public;
SELECT * FROM invoice;   -- silently queries analytics.invoice, NOT the "public.invoice"
                         -- the author of the query actually meant`,
        right: `SELECT * FROM public.invoice;   -- schema-qualified: always resolves to the SAME table,
                                 -- regardless of the session's current search_path`,
        why: 'An unqualified table name is resolved by walking the schemas listed in the current session\'s search_path, in order, and using whichever schema contains a matching table first. That resolution depends entirely on the search_path in effect at the moment the query runs, which can differ between connections, environments, or even change mid-session, so the same unqualified query text can silently refer to a different table depending on context, with no error to flag the ambiguity. Schema-qualifying the name removes this dependency entirely: it names the exact table intended regardless of search_path, which matters especially in migration scripts, shared functions, or any query that might run in an environment whose search_path is not what the author assumed.',
        whyHi: 'Ek unqualified table naam current session ke `search_path` mein listed schemas ko order mein chalकर resolve hota hai, aur jo bhi schema pehle ek matching table rakhता hai wo istemal hota hai. Wo resolution poori tarah us `search_path` par depend karta hai jo query chalne ke waqt effect mein hai, jo connections, environments ke beech alag ho sakta hai. Naam ko schema-qualify karna is dependency ko poori tarah hataता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A support ticket about "why are there gaps in our order numbers" answered by explaining sequence semantics** rather than treating it as a data-loss bug — a common, harmless misunderstanding.',
        hi: '**"hamare order numbers mein gaps kyun hain" waale ek support ticket ka jawab sequence semantics samjhाकर diya gaya** ek data-loss bug ki tarah treat karne ke bजाy.',
      },
      {
        en: '**A multi-tenant SaaS database using one `CREATE SCHEMA` per tenant** so each tenant\'s tables share identical structure and names but are physically isolated within one PostgreSQL instance.',
        hi: '**Ek multi-tenant SaaS database prati tenant ek `CREATE SCHEMA` istemal karti hai** taaki har tenant ki tables identical structure aur names share karें par physically isolated hon.',
      },
      {
        en: '**Every table reference in migration scripts written schema-qualified (`public.orders`, not `orders`)** as a defensive habit against a script accidentally running with an unexpected `search_path`.',
        hi: '**Migration scripts mein har table reference schema-qualified likhी jaती hai** ek script ke accidentally ek unexpected `search_path` ke saath chalne ke against ek defensive habit ke roop mein.',
      },
    ],

    interviewQA: [
      {
        q: 'Why are gaps in an auto-generated identity column normal, and what should you never rely on them for?',
        qHi: 'Ek auto-generated identity column mein gaps normal kyun hain, aur aapko unke liye kabhi kya bharosa nahi karna chahiye?',
        a: 'An identity column is backed by a sequence, and a sequence\'s entire contract is to hand out the next integer, in increasing order, every time it is asked, with no awareness of whether the row that requested the number is ever actually committed. A transaction that inserts a row, consuming a sequence value, and then rolls back leaves that value permanently unused, because sequences deliberately do not roll back along with the transaction that used them, which is what allows concurrent transactions to each grab a number without waiting on one another. The same thing happens if a statement fails partway through after already claiming a value. None of this represents data loss or corruption; it is simply the sequence doing its one job, handing out unique, increasing numbers, without also promising that the numbers are contiguous. What you should never do is treat the identity value as a reliable count of how many rows have ever been inserted, or assume that consecutive rows have consecutive ids; if you need an accurate row count, count the rows directly, and if you need a genuinely gapless ordinal position, compute it at query time with a window function like row number rather than reading it off the primary key.',
        aHi: 'Ek identity column ke peeche ek sequence hai, aur ek sequence ka poora contract agla integer dena hai, badte order mein, har baar jab pucha jae, is baat ki koi jaанकаri ke bina ki number maangने waali row kabhi asal mein committed hui ya nahi. Ek transaction jo ek row insert karta hai, ek sequence value consume karके, aur phir rollback hota hai us value ko permanently unused chhoड़ deta hai, kyunki sequences jaan-boojhkar apni transaction ke saath rollback nahi hote. Aapko kabhi identity value ko ab tak insert hui rows ka ek reliable count ki tarah treat nahi karna chahiye. Agar aapko ek accurate row count chahiye, rows ko seedhe count karo.',
      },
      {
        q: 'What is a schema in PostgreSQL, and why would you schema-qualify a table name explicitly?',
        qHi: 'PostgreSQL mein ek schema kya hai, aur aap ek table naam ko explicitly schema-qualify kyun karоge?',
        a: 'A schema is a namespace inside a single database: a way to group tables, and to let two tables with the identical name coexist without colliding, as long as they live in different schemas. Every database starts with a default schema called public, and you can create additional schemas to organize a large database into logical areas, give different teams or applications their own separated namespace within one shared database, or keep parallel versions of similar tables apart. When you reference a table without naming its schema, PostgreSQL resolves that name by walking the schemas listed in the current session\'s search_path setting, in order, and using the first one that contains a matching table. The risk is that this resolution depends entirely on whatever search_path happens to be in effect when the query runs, which can vary between connections, environments, or even change within a session, so the exact same unqualified query text can silently refer to a different table depending on context, with nothing raising an error to flag that ambiguity. Explicitly qualifying the name, writing billing.invoice rather than just invoice, removes that dependency completely: it names the one specific table intended regardless of search_path, which matters most in migration scripts, shared functions, and any code that might run in a context whose search_path differs from what its author assumed.',
        aHi: 'Ek schema ek single database ke andar ek namespace hai: tables group karne ka ek tarika, aur do tables ko identical naam ke saath coexist karne deने ka, jab tak wo alag schemas mein rehti hain. Har database ek default schema `public` ke saath shuru hoती hai. Jab aap bina schema naam ke ek table reference karte ho, PostgreSQL us naam ko current session ke `search_path` setting mein listed schemas ko order mein chalकर resolve karta hai. Risk ye hai ki ye resolution poori tarah us `search_path` par depend karta hai jo query chalne ke waqt effect mein hai. Naam ko explicitly qualify karna, `billing.invoice` likhна sirf `invoice` ki bजाy, us dependency ko poori tarah hataता hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text)`. Insert 3 rows, `DELETE FROM t` all of them, then insert one more row and confirm its `id` continues from 4, not restarting at 1.',
        taskHi: 'Table `t(id GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text)`. 3 rows insert karo, sabko `DELETE FROM t` karo, phir ek aur row insert karo aur confirm karo iska `id` 4 se continue karta hai, 1 par restart nahi hota.',
        hint: '`DELETE` removes rows but never touches the sequence backing the identity column. The next `INSERT` picks up exactly where the sequence left off.',
        hintHi: '`DELETE` rows hataता hai par identity column ke peeche ki sequence ko kabhi touch nahi karta. Agla `INSERT` theek wahin se leta hai jahaan sequence chhodi thi.',
      },
      {
        task: 'Repeat the previous exercise but use `TRUNCATE t RESTART IDENTITY` instead of `DELETE`. Confirm the next inserted row gets `id = 1` again.',
        taskHi: 'Pichli exercise repeat karo par `DELETE` ke bajaye `TRUNCATE t RESTART IDENTITY` istemal karo. Confirm karo agli insert ki gayi row `id = 1` phir se paati hai.',
        hint: 'Only `TRUNCATE ... RESTART IDENTITY` explicitly resets the sequence — plain `TRUNCATE` (Lesson 6) behaves like `DELETE` for the sequence, leaving its position unchanged.',
        hintHi: 'Sirf `TRUNCATE ... RESTART IDENTITY` explicitly sequence reset karta hai — plain `TRUNCATE` (Lesson 6) sequence ke liye `DELETE` jaisa behave karta hai.',
      },
      {
        task: 'Create schema `sales` and a table `sales.customer(id int PRIMARY KEY, name text)`, alongside a default-schema `customer(id int PRIMARY KEY, name text)`. Insert different data into each and write two `SELECT`s that prove they are genuinely separate tables despite sharing a name.',
        taskHi: 'Schema `sales` aur ek table `sales.customer(id, name)` banao, ek default-schema `customer(id, name)` ke saath. Har ek mein alag data insert karo aur do `SELECT`s likho jo prove karte hain ki wo genuinely alag tables hain naam share karne ke bavjood.',
        hint: '`SELECT * FROM sales.customer` and `SELECT * FROM customer` (or `public.customer`) return independent result sets — same table name, two entirely separate tables, disambiguated only by the schema.',
        hintHi: '`SELECT * FROM sales.customer` aur `SELECT * FROM customer` independent result sets lautate hain — same table name, do poori tarah alag tables, sirf schema se disambiguated.',
      },
    ],

    keyTakeaways: [
      '`GENERATED ALWAYS AS IDENTITY` attaches a SEQUENCE to a column — a separate object whose only job is handing out the next integer, in order, on request. `GENERATED ALWAYS` (vs `GENERATED BY DEFAULT`) rejects an explicit value on insert, same spirit as a `GENERATED ... STORED` column (Lesson 3).',
      'GAPS in the sequence are NORMAL, not corruption: a rolled-back transaction, a failed insert, or ordinary concurrent activity can all consume a value that no surviving row ends up using — sequences deliberately do NOT roll back with their transaction (that\'s what lets concurrent inserts avoid waiting on each other).',
      'NEVER rely on ids being gapless (`max(id)` is NOT a reliable "total rows ever inserted" count). For an actual row count, `count(*)`. For a true gapless ordinal position, compute it at query time with `row_number()` (Module 6).',
      '`serial` (legacy, non-standard) vs `GENERATED ALWAYS AS IDENTITY` (modern, SQL-standard, prefer in new schemas) — same underlying mechanism, `IDENTITY` integrates more cleanly and defaults to rejecting accidental explicit inserts.',
      '`DELETE FROM t` does NOT reset the sequence — the counter has no relationship to current row count, only to how many values it has EVER handed out. Plain `TRUNCATE t` ALSO does not reset it by default. ONLY `TRUNCATE t RESTART IDENTITY` explicitly resets the counter (Lesson 6).',
      'A SCHEMA is a namespace inside one database — lets two tables with the SAME NAME coexist in different schemas without colliding (`billing.invoice` vs `public.invoice`). Every database starts with a default `public` schema; an unqualified name resolves via `search_path`, in order, first match wins.',
      'PREFER explicit schema-qualified names (`billing.invoice`, not bare `invoice`) in shared/multi-schema databases and especially in migrations/scripts — removes the "which table did that unqualified name actually resolve to" ambiguity that depends on the session\'s `search_path`, which can vary or differ from what the author assumed.',
    ],
    keyTakeawaysHi: [
      '`GENERATED ALWAYS AS IDENTITY` ek column se ek SEQUENCE attach karta hai — ek alag object jiska sirf kaam agla integer, order mein, request par dena hai. `GENERATED ALWAYS` insert par ek explicit value reject karta hai, `GENERATED ... STORED` column (Lesson 3) jaisi spirit.',
      'Sequence mein GAPS NORMAL hain, corruption nahi: ek rolled-back transaction, ek failed insert, ya ordinary concurrent activity sab ek value consume kar sakte hain jise koi surviving row istemal nahi karti — sequences jaan-boojhkar apni transaction ke saath rollback NAHI hote.',
      'KABHI ids ke gapless hone par bharosa mat karo (`max(id)` "ab tak insert hui total rows" ka reliable count NAHI hai). Ek actual row count ke liye, `count(*)`. Ek true gapless ordinal position ke liye, query time par `row_number()` (Module 6) se compute karo.',
      '`serial` (legacy, non-standard) vs `GENERATED ALWAYS AS IDENTITY` (modern, SQL-standard, naye schemas mein prefer karo).',
      '`DELETE FROM t` sequence RESET NAHI karta — counter ka current row count se koi relationship nahi hai. Plain `TRUNCATE t` BHI default se ise reset NAHI karta. SIRF `TRUNCATE t RESTART IDENTITY` explicitly counter reset karta hai (Lesson 6).',
      'Ek SCHEMA ek database ke andar ek namespace hai — do SAME NAME waali tables ko alag schemas mein coexist karne deta hai bina collide kiye. Har database ek default `public` schema ke saath shuru hoती hai; ek unqualified naam `search_path` se resolve hota hai.',
      'Shared/multi-schema databases mein, aur khaas kar migrations/scripts mein, explicit schema-qualified names PREFER karo — "wo unqualified naam asal mein kaunsi table resolve hua" ambiguity hataता hai jo session ke `search_path` par depend karti hai.',
    ],
  },

  {
    slug: 'sql-drop-truncate-cascade-and-migrations',
    title: 'DROP, TRUNCATE, CASCADE & Migration Discipline',
    titleHi: 'DROP, TRUNCATE, CASCADE Aur Migration Discipline',
    description: '`DROP` refuses to remove something other objects depend on unless you say `CASCADE`. `TRUNCATE` empties a table faster than `DELETE` but behaves differently around identity and triggers. And schema changes on a live system are safest done as small, reversible, versioned steps — the expand-contract pattern ties every lesson in this module together.',
    descriptionHi: '`DROP` kuch hataने se refuse karta hai jispar doosre objects depend karte hain jab tak aap `CASCADE` na kahें. `TRUNCATE` ek table ko `DELETE` se faster khaali karta hai par identity aur triggers ke aas-paas alag behave karta hai. Aur ek live system par schema changes chhoटe, reversible, versioned steps ke roop mein karna sabse safe hai — expand-contract pattern is module ke har lesson ko jodता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Demolishing a load-bearing wall, versus emptying a room, versus renovating a house while a family still lives in it.** A construction crew that tries to knock down a wall other walls and the roof are resting on gets stopped, correctly, the moment someone checks the blueprints — "you cannot remove this without also dealing with everything attached to it." That refusal is `DROP` without `CASCADE`: PostgreSQL checking its own blueprint (foreign keys, views, other dependencies) and stopping you before something structural collapses unexpectedly. Saying "yes, tear down everything attached too" is `CASCADE` — sometimes exactly right, sometimes a way to accidentally demolish far more than you meant to. Emptying every box out of one room quickly, versus carrying them out one at a time and inspecting each — that is `TRUNCATE` versus `DELETE`: both end with an empty room, but one is a fast, wholesale sweep with its own separate rules about what does and does not get reset, the other processes each item individually and can react to each one. And a family renovation while everyone still lives there is the discipline behind schema migrations on a live system: you never take out the only working bathroom and the only working kitchen on the same day — you add the new one, let everyone use whichever works, move everyone over deliberately, and only then remove the old one. That is the "expand, then contract" sequence, not a single dramatic demolition-and-rebuild in one afternoon.',
      hi: '**Ek load-bearing wall giराना, ek room khaali karne ke muकаble, ek ghar renovate karने ke muकаble jismein ek family abhi bhi rehती hai.** Ek construction crew jo ek wall giराने ki koshish karti hai jispar doosri walls aur roof tikी hain rok di jaती hai, theek se, jab koi blueprints check karta hai — "aap ise bina iske saath attached har cheez deal kiye hataa nahi sakte." Wo refusal `DROP` bina `CASCADE` ke hai: PostgreSQL apna blueprint check kar raha hai aur aapko rokта hai isse pehle ki kuch structural achanak collapse ho. "haan, sab kuch attached bhi tear down karो" `CASCADE` hai — kabhi theek sahi, kabhi accidentally bahut zyada demolish karne ka tarika. Ek room ke sabhi boxes ko jaldi khaali karna, ek-ek le jaने aur inspect karne ke muकаble — wo `TRUNCATE` versus `DELETE` hai. Aur ek family renovation jabki sab wahaan rehते hain, live system par schema migrations ke peeche ki discipline hai: aap kabhi ek hi din working bathroom aur working kitchen dono nahi hataते — aap naya add karte ho, sabko jo bhi kaam karta hai istemal karne dete ho, deliberately sabko move karte ho, aur sirf tab purana hataते ho.',
    },

    simple: `**\`DROP\` refuses when something else depends on it — \`CASCADE\` overrides that**

\`\`\`sql
CREATE TABLE parent_t (id int PRIMARY KEY);
CREATE TABLE child_t (id int PRIMARY KEY, parent_id int REFERENCES parent_t(id));
DROP TABLE parent_t;            -- ERROR: other objects depend on it (the FK from child_t)
DROP TABLE parent_t CASCADE;    -- succeeds -- ALSO drops the dependent FK constraint on child_t
                                -- (child_t itself survives; only the constraint referencing
                                --  parent_t is removed)
\`\`\`

**\`TRUNCATE\` vs \`DELETE\` — both empty a table, but differently**

\`\`\`sql
DELETE FROM t;                  -- removes rows one at a time (logically); fires row-level
                                 -- triggers; does NOT touch the identity sequence
TRUNCATE t;                     -- empties the table as a single fast operation; does NOT
                                 -- fire row-level triggers; ALSO does not reset identity
                                 -- unless you say so explicitly:
TRUNCATE t RESTART IDENTITY;    -- the only form that resets the counter
\`\`\`

**Migration discipline: small, versioned, reversible steps — never one giant unreviewed change**

\`\`\`
each schema change = one migration file, in order, checked into version control,
applied the same way in every environment (dev, staging, production)
\`\`\`

**Expand-contract: how you change something readers depend on WITHOUT breaking them**

\`\`\`
1. EXPAND  -- add the new thing alongside the old (new column, new table, wider type)
2. MIGRATE -- writers populate/write to both; readers move over to the new thing
             at their own pace, verified one at a time
3. CONTRACT -- only once NOTHING depends on the old thing anymore, remove it
             (DROP COLUMN, DROP TABLE, RENAME)
\`\`\`

**This is the same idea as Lesson 4's safe-NOT-NULL pattern, generalized**

\`\`\`
add nullable -> backfill -> constrain     (Lesson 4, for ONE column becoming required)
add new -> dual-write/migrate -> remove old   (this lesson, for ANY breaking schema change)
\`\`\``,

    simpleHi: `**\`DROP\` refuse karta hai jab kuch aur ispar depend karta hai — \`CASCADE\` ise override karta hai**

\`\`\`sql
CREATE TABLE parent_t (id int PRIMARY KEY);
CREATE TABLE child_t (id int PRIMARY KEY, parent_id int REFERENCES parent_t(id));
DROP TABLE parent_t;            -- ERROR: doosre objects ispar depend karte hain
DROP TABLE parent_t CASCADE;    -- succeed hota hai -- dependent FK constraint bhi drop
                                -- (child_t khud bachta hai; sirf parent_t reference
                                --  karne waala constraint hataya jaata hai)
\`\`\`

**\`TRUNCATE\` vs \`DELETE\` — dono ek table khaali karte hain, par alag tarike se**

\`\`\`sql
DELETE FROM t;                  -- rows ek-ek karke hataता hai; row-level triggers fire
                                 -- karta hai; identity sequence ko touch NAHI karta
TRUNCATE t;                     -- table ko ek fast operation ke roop mein khaali karta hai;
                                 -- row-level triggers fire NAHI karta; ye bhi default se
                                 -- identity reset nahi karta jab tak explicitly na kahо:
TRUNCATE t RESTART IDENTITY;    -- ekmatra form jo counter reset karta hai
\`\`\`

**Migration discipline: chhoटe, versioned, reversible steps — kabhi ek giant unreviewed change nahi**

\`\`\`
har schema change = ek migration file, order mein, version control mein checked in,
har environment (dev, staging, production) mein usi tarike se apply
\`\`\`

**Expand-contract: readers jispar depend karte hain use bina toड़e kaise badalें**

\`\`\`
1. EXPAND  -- naya cheez purane ke saath add karo
2. MIGRATE -- writers dono ko populate/write karte hain; readers apni raftार se
             naye cheez par move hote hain, ek-ek karke verified
3. CONTRACT -- sirf jab KUCH BHI purani cheez par depend nahi karta, use hataо
\`\`\`

**Ye Lesson 4 ke safe-NOT-NULL pattern jaisा hi idea hai, generalized**

\`\`\`
nullable add karo -> backfill -> constrain     (Lesson 4, EK column ke required banне ke liye)
naya add karo -> dual-write/migrate -> purana hataо   (ye lesson, KISI bhi breaking schema change ke liye)
\`\`\``,

    content: `## \`DROP\`: \`RESTRICT\` by default, \`CASCADE\` on request

Dropping a table (or column, or constraint) that other objects depend on fails by default — PostgreSQL will not silently break a foreign key, a view, or another dependent object:

\`\`\`sql
CREATE TABLE parent_t (id int PRIMARY KEY);
CREATE TABLE child_t (id int PRIMARY KEY, parent_id int REFERENCES parent_t(id));
DROP TABLE parent_t;
-- ERROR: cannot drop table parent_t because other objects depend on it
\`\`\`

This is the implicit \`RESTRICT\` behaviour (the same term from Module 7's \`ON DELETE RESTRICT\`, applied here to schema objects instead of rows). Adding \`CASCADE\` tells PostgreSQL to also drop everything that depends on the target:

\`\`\`sql
DROP TABLE parent_t CASCADE;
-- succeeds -- and also drops the foreign key constraint on child_t that referenced it
-- (child_t itself is NOT dropped -- only the dependent CONSTRAINT is)
\`\`\`

**\`CASCADE\` on a \`DROP\` is exactly as dangerous as \`ON DELETE CASCADE\` (Module 7): it removes dependent objects with no further confirmation.** Before reaching for it, understand *what* depends on the thing you are dropping — the error message from the plain (non-cascade) attempt, or a catalog query, will tell you.

## \`TRUNCATE\` vs \`DELETE\`

Both remove all rows from a table, but they differ in mechanism and side effects:

| | \`DELETE FROM t\` | \`TRUNCATE t\` |
|---|---|---|
| speed on a large table | scans and removes row by row | near-instant, deallocates storage directly |
| row-level triggers | fire, once per row | do **not** fire |
| identity/sequence | untouched (Lesson 5) | untouched **unless** \`RESTART IDENTITY\` is specified |
| transactional | yes, can be rolled back | yes, can also be rolled back (unlike some other databases) |
| \`WHERE\` clause | supported (delete a subset) | not supported (always empties the whole table) |

Reach for \`TRUNCATE\` when you genuinely want to empty an entire table quickly (resetting data between test runs, clearing a staging/scratch table) and do not need row-level triggers to fire or a partial deletion. Reach for \`DELETE ... WHERE ...\` for anything selective, or when triggers on individual row deletions matter.

## Migration discipline

A schema change applied by hand, once, directly against a production database, with no record of exactly what ran, is a recurring source of "why does staging have a different schema than production" bugs. The standard discipline:

- **Every schema change is a versioned migration file**, checked into the same version control as the application code, applied in a fixed order.
- **The same migration runs, in the same order, in every environment** (a developer's machine, staging, production) — schema drift between environments is a bug, not a curiosity.
- **Migrations are typically append-only**: instead of editing a migration that has already run somewhere, you write a new one that adjusts further — the history of *how* the schema got to its current state is itself valuable, for debugging and for understanding intent later.
- Most migration tools track *which* migrations have already run against a given database, so re-running the same migration twice is a no-op or an explicit error, not silent double-application.

## Expand-contract: the general pattern for a breaking schema change

This lesson's various "safe" patterns — Lesson 4's add-nullable/backfill/constrain, Lesson 5's caution about renames breaking readers instantly — are all instances of one general idea, usually called **expand-contract** (or "parallel change"):

1. **Expand**: add the new structure *alongside* the old, without removing or renaming anything readers currently depend on. (A new column, in addition to the old one; a new table; a wider column type installed as a second column.)
2. **Migrate**: for a while, both the old and new structures coexist. Writers are updated to populate both (or the new one is backfilled from the old). Readers — application code, reports, other services — are moved over to the new structure one at a time, verified, and rolled back individually if something is wrong, with no single moment where everything must switch at once.
3. **Contract**: only once nothing depends on the old structure any more, remove it — \`DROP COLUMN\`, \`DROP TABLE\`, or the \`RENAME\` that a straight, one-step rename would have done immediately (Lesson 4).

The entire point is that **no single step is both irreversible and immediately breaking for every consumer at once**. A plain \`RENAME COLUMN\` (Lesson 4) is fast but breaks every reader instantly — expand-contract spreads that same eventual outcome (the column has a new name, everyone uses it) across several individually-safe, individually-revertable steps.

## Bringing Module 8 together

Across this module: **column types** are a design-time bet on future range and precision (Lesson 1); **constraints** turn business rules into guarantees enforced for every writer (Lesson 2); **generated columns** close the "derived value drifts" gap for values depending on the same row (Lesson 3); **altering tables safely** means recognising which operations rewrite/lock and which do not, and staging risky changes (Lesson 4); **sequences and schemas** are the supporting objects behind auto-increment and namespacing (Lesson 5); and this lesson's **\`DROP\`/\`TRUNCATE\` semantics plus migration discipline** are how all of the above gets applied to a live system without an outage. Module 7's data-modeling foundations and this module's DDL mechanics together are what it means to *design and evolve* a schema — Module 9 turns to what happens when multiple transactions touch that schema at the same time.`,

    contentHi: `## \`DROP\`: default se \`RESTRICT\`, request par \`CASCADE\`

Ek table (ya column, ya constraint) drop karna jispar doosre objects depend karte hain default se fail hota hai:

\`\`\`sql
CREATE TABLE parent_t (id int PRIMARY KEY);
CREATE TABLE child_t (id int PRIMARY KEY, parent_id int REFERENCES parent_t(id));
DROP TABLE parent_t;
-- ERROR: cannot drop table parent_t because other objects depend on it
\`\`\`

Ye implicit \`RESTRICT\` behaviour hai. \`CASCADE\` add karna PostgreSQL ko kehта hai ki target par depend karne waala sab kuch bhi drop kare:

\`\`\`sql
DROP TABLE parent_t CASCADE;
-- succeed hota hai -- aur foreign key constraint bhi drop karta hai jo ise reference karta tha
-- (child_t khud DROP NAHI hoती -- sirf dependent CONSTRAINT hoती hai)
\`\`\`

**\`DROP\` par \`CASCADE\` theek utna hi dangerous hai jितna \`ON DELETE CASCADE\` (Module 7): ye dependent objects ko bina kisi aur confirmation ke hataता hai.**

## \`TRUNCATE\` vs \`DELETE\`

Dono ek table se sabhi rows hataте hain, par mechanism aur side effects mein alag hain:

| | \`DELETE FROM t\` | \`TRUNCATE t\` |
|---|---|---|
| badी table par speed | row by row scan aur remove | near-instant |
| row-level triggers | fire hote hain, prati row ek baar | fire NAHI hote |
| identity/sequence | untouched | untouched jab tak \`RESTART IDENTITY\` na ho |
| transactional | haan | haan |
| \`WHERE\` clause | supported | supported NAHI |

## Migration discipline

Haath se, ek baar, seedhے production database ke against apply kiya gaya ek schema change "staging aur production ka schema alag kyun hai" bugs ka ek recurring source hai. Standard discipline:
- **Har schema change ek versioned migration file hai**, application code ke saath version control mein checked in.
- **Wahi migration, wahi order mein, har environment mein chalti hai**.
- **Migrations typically append-only hain**: pehle se chalے migration ko edit karne ke bजाy, aap ek naya likhте ho.

## Expand-contract: ek breaking schema change ka general pattern

Is lesson ke kई "safe" patterns — Lesson 4 ka add-nullable/backfill/constrain — sab ek general idea, usually **expand-contract** kahaте hain, ke instances hain:

1. **Expand**: naya structure purane ke SAATH add karो, kuch remove ya rename kiye bina.
2. **Migrate**: kuch samay ke liye, purana aur naya dono coexist karте hain. Writers dono ko populate karте hain. Readers apni raftार se naye structure par move hote hain.
3. **Contract**: sirf jab kuch bhi purane structure par depend nahi karta, ise hataо.

Poora point ye hai ki **koi single step ek saath irreversible aur har consumer ke liye turant breaking na ho**.

## Module 8 ko saath laна

Is poore module mein: **column types** future range aur precision par ek design-time bet hain (Lesson 1); **constraints** business rules ko guarantees mein badalте hain (Lesson 2); **generated columns** "derived value drifts" gap band karте hain (Lesson 3); **tables ko safely alter karna** ye pehchanने ke baare mein hai ki kaunसी operations rewrite/lock karti hain (Lesson 4); **sequences aur schemas** auto-increment aur namespacing ke peeche ke supporting objects hain (Lesson 5); aur ye lesson ka **\`DROP\`/\`TRUNCATE\` semantics plus migration discipline** ye hai ki upar ka sab ek live system par kaise apply hota hai bina outage ke.`,

    examples: [
      {
        title: 'DROP TABLE fails when a foreign key depends on it; CASCADE removes that dependency',
        titleHi: 'DROP TABLE fail hota hai jab ek foreign key ispar depend karti hai; CASCADE us dependency ko hata deta hai',
        code: `CREATE TABLE parent_t (id int PRIMARY KEY);
CREATE TABLE child_t (id int PRIMARY KEY, parent_id int REFERENCES parent_t(id));
DROP TABLE parent_t CASCADE;

-- child_t itself still exists; only the FK constraint referencing parent_t is gone
INSERT INTO child_t VALUES (1, 999);
SELECT * FROM child_t;`,
        output: ` id | parent_id
----+-----------
 1  | 999
(1 row)`,
        explain: '`DROP TABLE parent_t CASCADE` succeeds, but only the FOREIGN KEY constraint on `child_t` referencing `parent_t` is removed as a side effect — `child_t` itself is untouched. That is why the subsequent `INSERT INTO child_t VALUES (1, 999)` succeeds even though no `parent_t` row with `id = 999` (or any id at all) exists any more: there is no constraint left to check it against.',
        explainHi: '`DROP TABLE parent_t CASCADE` succeed hota hai, par sirf `child_t` par `parent_t` ko reference karने waala FOREIGN KEY constraint side effect ke roop mein hataya jaта hai — `child_t` khud untouched hai. Yahi wajah hai ki uske baad `INSERT INTO child_t VALUES (1, 999)` succeed hota hai chahe ab `id = 999` waali koi `parent_t` row (ya koi bhi id) exist na kare: check karne ke liye koi constraint bacha hi nahi.',
      },
      {
        title: 'DELETE does not reset an identity sequence; TRUNCATE RESTART IDENTITY does',
        titleHi: 'DELETE ek identity sequence reset nahi karta; TRUNCATE RESTART IDENTITY karta hai',
        code: `CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b');
TRUNCATE t RESTART IDENTITY;
INSERT INTO t (name) VALUES ('c');
SELECT * FROM t;`,
        output: ` id | name
----+------
 1  | c
(1 row)`,
        explain: "`TRUNCATE t RESTART IDENTITY` explicitly resets the sequence back to its starting point before the new insert happens, so `'c'` gets `id = 1` — as if the table (and its counter) were brand new. This is the ONLY combination that resets the counter; the `RESTART IDENTITY` clause has to be stated, it is never implied by `TRUNCATE` alone.",
        explainHi: "`TRUNCATE t RESTART IDENTITY` naye insert hone se pehle sequence ko explicitly wapas iske starting point par reset karta hai, to `'c'` ko `id = 1` milta hai — jaise table (aur iska counter) bilkul naya ho. Ye EKMATRA combination hai jo counter reset karta hai; `RESTART IDENTITY` clause ko batана hoga, ye kabhi akele `TRUNCATE` se implied nahi hai.",
      },
      {
        title: 'Plain TRUNCATE (no RESTART IDENTITY) leaves the sequence exactly where DELETE would',
        titleHi: 'Plain TRUNCATE (bina RESTART IDENTITY) sequence ko theek wahin chhodta hai jahan DELETE chhodta',
        code: `CREATE TABLE t (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);
INSERT INTO t (name) VALUES ('a'), ('b');
TRUNCATE t;
INSERT INTO t (name) VALUES ('c');
SELECT * FROM t;`,
        output: ` id | name
----+------
 3  | c
(1 row)`,
        explain: "Without the `RESTART IDENTITY` clause, plain `TRUNCATE t` empties the table just as fast as before, but leaves the sequence exactly where it was — at 2, after handing out ids 1 and 2 for `'a'` and `'b'`. So the next insert, `'c'`, gets `id = 3`, behaving identically to how `DELETE FROM t` would have behaved for the sequence, even though the two statements empty the table through very different mechanisms.",
        explainHi: "`RESTART IDENTITY` clause ke bina, plain `TRUNCATE t` table ko theek pehle jaisa jaldi khaali karta hai, par sequence ko theek wahin chhoड़ta hai jahaan ye tha — 2 par, `'a'` aur `'b'` ke liye ids 1 aur 2 handout karne ke baad. To agla insert, `'c'`, `id = 3` paata hai, theek waise behave karте hue jaise `DELETE FROM t` sequence ke liye karta, chahe do statements table ko bahut alag mechanisms se khaali karте hain.",
      },
    ],

    mistakes: [
      {
        wrong: `-- reaching for CASCADE the instant a plain DROP is refused, without checking what it removes
DROP TABLE customer;
-- ERROR: cannot drop table customer because other objects depend on it
DROP TABLE customer CASCADE;
-- succeeds -- but ALSO silently drops every view, every foreign key constraint, and
-- every other dependent object across the entire database, with no itemized confirmation`,
        right: `-- first find out exactly what depends on it, then decide deliberately
-- (e.g. query pg_depend / information_schema, or read the RESTRICT error's mentioned objects)
-- SELECT ... FROM information_schema.table_constraints WHERE ...
-- only THEN decide: drop the dependents individually, migrate them, or accept CASCADE
-- knowing exactly what it will take with it`,
        why: 'The RESTRICT error is PostgreSQL telling you it found at least one dependent object and refusing to guess whether removing it is acceptable; reaching immediately for CASCADE without reading what the error actually depends on treats a deliberate safety check as an annoyance to bypass rather than information to use. CASCADE does not ask again or list what it is about to remove beyond the original error; it simply proceeds to drop every dependent object it finds, which on a real production schema can include views built on the table, foreign keys from tables you did not think about, or other objects nobody remembered still referenced it. The safer habit is to treat the RESTRICT failure as a prompt to investigate, find out specifically what depends on the object, and decide deliberately whether CASCADE\'s blast radius is actually what you intend before using it.',
        whyHi: '`RESTRICT` error PostgreSQL ka aapko batana hai ki isne kam se kam ek dependent object dhoonda aur guess karne se refuse karta hai ki ise hataना acceptable hai. Turant `CASCADE` par pahunchna, error asal mein kya depend karta hai ye padhे bina, ek deliberate safety check ko ek annoyance ki tarah treat karta hai. `CASCADE` phir se poочता nahi ya list nahi karta ki ye kya hataने waala hai; ye bस har dependent object hataता hai jo ise milta hai. Safer habit `RESTRICT` failure ko investigate karne ka ek prompt maानना hai.',
      },
      {
        wrong: `-- using DELETE FROM to clear a large staging table before a nightly reload
DELETE FROM staging_import;
-- correct result, but scans and removes every row individually, firing any
-- row-level triggers along the way -- slow and unnecessary for a full-table clear`,
        right: `TRUNCATE staging_import;
-- empties the whole table as a single fast operation, without firing row-level
-- triggers that a full clear-and-reload does not need`,
        why: 'DELETE without a WHERE clause still removes rows one at a time under the hood, and if the table has row-level triggers, each of those fires once per row, work that is entirely wasted when the actual intent is simply to empty the whole table before a bulk reload. TRUNCATE is designed exactly for this case: it deallocates the table\'s storage directly rather than visiting each row, is dramatically faster on a large table, and skips row-level triggers, which are irrelevant when there will shortly be no old rows left to have triggered anything meaningful about. Reach for DELETE when you need a WHERE clause, a subset of rows, or when row-level trigger behavior matters; reach for TRUNCATE when the goal is genuinely "empty this entire table" and neither of those applies.',
        whyHi: 'Bina `WHERE` clause ke `DELETE` phir bhi ek-ek karke rows hataता hai, aur agar table mein row-level triggers hain, un mein se har ek prati row ek baar fire hota hai, kaam jo poori tarah wasted hai jab asli intent bस poori table khaali karna hai. `TRUNCATE` theek is case ke liye design kiya gaya hai: ye har row visit karne ke bजाy table ka storage seedhे deallocate karta hai, ek badी table par dramatically faster hai, aur row-level triggers skip karta hai.',
      },
      {
        wrong: `-- renaming a shared column outright, as one step, on a live multi-service system
ALTER TABLE customer RENAME COLUMN legacy_email TO email;
-- every service still deployed with the old column name breaks the instant this commits`,
        right: `-- expand-contract instead:
ALTER TABLE customer ADD COLUMN email text;                 -- 1. EXPAND: add alongside
UPDATE customer SET email = legacy_email WHERE email IS NULL; -- backfill from the old column
-- 2. MIGRATE: update writers to populate both; migrate readers to "email" one service at a time
-- 3. CONTRACT (only once nothing reads legacy_email anymore):
-- ALTER TABLE customer DROP COLUMN legacy_email;`,
        why: 'A direct RENAME COLUMN is instant at the database level but has no concept of a transition period: the moment it commits, every query anywhere still referencing the old column name fails, with no grace window during which both names work. On a system with more than one deployed consumer of the table, that is equivalent to breaking everyone who has not yet redeployed to use the new name, at the exact instant the migration runs, regardless of deployment order. The expand-contract sequence achieves the same end state, one column with the new name, without ever requiring a single instant where the change must be complete everywhere at once: the new column exists alongside the old one for as long as needed, each consumer moves over on its own schedule and can be verified individually, and only the final cleanup step removes the old column, by which point nothing depends on it any more.',
        whyHi: 'Ek direct `RENAME COLUMN` database level par instant hai par ismein transition period ka koi concept nahi hai: jis pal ye commit hota hai, kahin bhi purana column naam abhi bhi reference karने waali har query fail hoती hai. Ek se zyada deployed consumers waale system par, ye har us cheez ko toड़ने ke barabar hai jisne abhi tak naya naam istemal karne ke liye redeploy nahi kiya. Expand-contract sequence wahi end state achieve karta hai bina kabhi ek single instant chahiye jahaan change poori tarah ek saath complete hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A "check what depends on it first" step baked into the runbook for any `DROP TABLE`/`DROP COLUMN` in production** — a query against `information_schema` before ever considering `CASCADE`.',
        hi: '**Production mein kisi bhi `DROP TABLE`/`DROP COLUMN` ke liye runbook mein "pehle check karo isPar kya depend karta hai" step baked in**.',
      },
      {
        en: '**A migration tool (Flyway, Alembic, Prisma Migrate, ActiveRecord migrations) enforced as the ONLY way schema changes reach production** — no direct `psql` DDL against a live database, ever.',
        hi: '**Ek migration tool (Flyway, Alembic, Prisma Migrate) enforced ekmatra tarike ke roop mein jisse schema changes production tak pahunchte hain** — kabhi live database ke against direct `psql` DDL nahi.',
      },
      {
        en: '**A column rename executed as a textbook expand-contract over three separate deploys** (add + backfill, dual-write + migrate readers, drop old column) rather than a single `RENAME COLUMN` on a table read by five different services.',
        hi: '**Ek column rename teen alag deploys ke across ek textbook expand-contract ke roop mein execute ki gayi** paanch alag services dwara padhी jaने waali ek table par ek single `RENAME COLUMN` ke bजाy.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `TRUNCATE` and `DELETE`, and when would you choose one over the other?',
        qHi: '`TRUNCATE` aur `DELETE` mein kya antar hai, aur aap ek ko doosre par kab chunोge?',
        a: 'Both remove every row from a table when used without qualification, but they differ in mechanism and in several side effects. DELETE, conceptually, removes rows one at a time, so if the table has row-level triggers they fire once per row, and it supports a WHERE clause to remove only a subset. TRUNCATE instead deallocates the table\'s storage directly as a single operation, which makes it dramatically faster on a large table, but it does not fire row-level triggers, and it cannot take a WHERE clause; it always empties the entire table, or fails. Both are transactional in PostgreSQL and can be rolled back, which is not universally true in every database, so that particular difference does not apply here. A subtler point concerns any identity or sequence associated with the table: neither DELETE nor a plain TRUNCATE resets the sequence back to its starting value, since both simply remove rows without telling the sequence anything happened; only TRUNCATE with the explicit RESTART IDENTITY clause resets the counter. In practice, you reach for DELETE when you need to remove a subset of rows or rely on row-level trigger behavior, and for TRUNCATE when the genuine intent is to empty an entire table quickly, such as clearing a staging table before a bulk reload or resetting test data between runs.',
        aHi: 'Dono bina qualification ke istemal hone par table se har row hataте hain, par wo mechanism aur kई side effects mein alag hain. `DELETE`, conceptually, rows ko ek-ek karke hataता hai, to agar table mein row-level triggers hain wo prati row ek baar fire hote hain, aur ye ek subset hataने ke liye ek `WHERE` clause support karta hai. `TRUNCATE` iske bजाy table ka storage seedhے deallocate karta hai ek single operation ke roop mein, jo ise ek badी table par dramatically faster banata hai, par ye row-level triggers fire nahi karta, aur ye `WHERE` clause nahi le sakta. Ek subtler point: na `DELETE` na plain `TRUNCATE` sequence ko wapas iski starting value par reset karte hain; sirf explicit `RESTART IDENTITY` clause ke saath `TRUNCATE` counter reset karta hai.',
      },
      {
        q: 'What is the expand-contract pattern, and why is it safer than a single `ALTER TABLE ... RENAME COLUMN` on a table with multiple consumers?',
        qHi: 'Expand-contract pattern kya hai, aur ye kई consumers waali ek table par ek single `ALTER TABLE ... RENAME COLUMN` se safer kyun hai?',
        a: 'Expand-contract, sometimes called parallel change, is a way of making a breaking schema change in stages so that no single step is both irreversible and immediately breaking for every consumer of the schema at once. The expand step adds the new structure alongside the old one without touching or removing anything current readers depend on, for instance adding a brand new column rather than renaming the existing one. The migrate step is the period where both structures coexist: writers are updated to populate the new one, perhaps alongside the old, existing data is backfilled into it, and readers, whether that is application code, reports, or other services, are moved over to use the new structure one at a time, each one verifiable and revertible independently rather than all at once. Only in the contract step, once nothing depends on the old structure any more, is it actually removed. Compare this to a direct rename: that operation is instant at the database level, but it has no transition period whatsoever, so the moment it commits, every query anywhere still referencing the old name fails immediately, which in a system with more than one deployed consumer is equivalent to breaking whichever ones have not yet redeployed to use the new name, at the exact instant the migration runs, regardless of how carefully the deployment was otherwise sequenced. Expand-contract reaches the identical final state, a single column under the new name, without ever requiring that instantaneous, all-at-once cutover.',
        aHi: 'Expand-contract, kabhi parallel change kaha jaता hai, ek breaking schema change ko stages mein karne ka tarika hai taaki koi single step ek saath irreversible aur schema ke har consumer ke liye turant breaking na ho. Expand step naya structure purane ke saath add karta hai bina current readers jispar depend karte hain use touch ya remove kiye. Migrate step wo period hai jahaan dono structures coexist karте hain: writers ko naye ko populate karne ke liye update kiya jaता hai, readers ko naye structure ko istemal karne ke liye ek-ek karke move kiya jaता hai. Sirf contract step mein, jab kuch bhi purane structure par depend nahi karta, ise asal mein hataya jaता hai. Ek direct rename ki tulna mein: wo operation database level par instant hai, par ismein bilkul koi transition period nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Tables `parent_t(id int PRIMARY KEY)` and `child_t(id int PRIMARY KEY, parent_id int REFERENCES parent_t(id))`. Try `DROP TABLE parent_t` and observe the error. Then run `DROP TABLE parent_t CASCADE` and confirm `child_t` itself still exists (only the FK constraint is gone) by inserting a row with an arbitrary `parent_id`.',
        taskHi: 'Tables `parent_t(id)` aur `child_t(id, parent_id REFERENCES parent_t(id))`. `DROP TABLE parent_t` try karo aur error dekho. Phir `DROP TABLE parent_t CASCADE` chalao aur confirm karo `child_t` khud abhi bhi exist karti hai.',
        hint: 'CASCADE removes the dependent FOREIGN KEY constraint, not `child_t` itself. After the cascade, `child_t` accepts any `parent_id` value, including ones that never existed in `parent_t`.',
        hintHi: 'CASCADE dependent FOREIGN KEY constraint hataता hai, `child_t` khud nahi. Cascade ke baad, `child_t` koi bhi `parent_id` value accept karta hai.',
      },
      {
        task: 'Table `t(id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text)`. Insert 2 rows. Run plain `TRUNCATE t` and insert a 3rd row — confirm its id continues (does not restart). Then repeat from scratch with `TRUNCATE t RESTART IDENTITY` and confirm the id DOES restart at 1.',
        taskHi: 'Table `t(id GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text)`. 2 rows insert karo. Plain `TRUNCATE t` chalao aur ek teesri row insert karo — confirm karo iska id continue karta hai. Phir shuru se `TRUNCATE t RESTART IDENTITY` ke saath repeat karo.',
        hint: 'Plain `TRUNCATE` behaves like `DELETE` for the sequence — it does not reset it. Only the explicit `RESTART IDENTITY` clause resets the counter back to its starting value.',
        hintHi: 'Plain `TRUNCATE` sequence ke liye `DELETE` jaisa behave karta hai — ye ise reset nahi karta. Sirf explicit `RESTART IDENTITY` clause counter ko wapas reset karta hai.',
      },
      {
        task: 'Table `customer(id int PRIMARY KEY, legacy_email text)` with 2 rows populated. Perform an expand-contract rename to `email`: (1) add column `email text`, (2) backfill it from `legacy_email` with an `UPDATE`, (3) confirm both columns show the same values, then (in a comment) describe what step 3, the CONTRACT, would be once nothing reads `legacy_email` anymore.',
        taskHi: 'Table `customer(id, legacy_email)` 2 populated rows ke saath. `email` mein ek expand-contract rename karo: (1) `email text` column add karo, (2) `UPDATE` se `legacy_email` se backfill karo, (3) confirm karo dono columns same values dikhate hain.',
        hint: 'Steps 1-2 are the EXPAND phase. The (unwritten, real-world) MIGRATE phase would have application code start writing to and reading from `email`. Only once no reader touches `legacy_email` would step 3, `ALTER TABLE customer DROP COLUMN legacy_email`, be the safe CONTRACT.',
        hintHi: 'Steps 1-2 EXPAND phase hain. (Unwritten, real-world) MIGRATE phase mein application code `email` se likhна/padhna shuru karta. Sirf jab koi reader `legacy_email` touch na kare, step 3, `ALTER TABLE customer DROP COLUMN legacy_email`, safe CONTRACT hoga.',
      },
    ],

    keyTakeaways: [
      '`DROP` refuses by default (implicit `RESTRICT`) when other objects depend on the target — `ERROR: cannot drop table X because other objects depend on it`. `CASCADE` overrides this and drops the dependents too — but is exactly as dangerous as `ON DELETE CASCADE` (Module 7): it removes things with NO further confirmation. Investigate WHAT depends on something before reaching for `CASCADE`, not after.',
      '`DELETE` vs `TRUNCATE`: `DELETE` removes rows one at a time, fires row-level triggers, supports `WHERE` (a subset). `TRUNCATE` empties the WHOLE table as one fast operation, does NOT fire row-level triggers, does NOT support `WHERE`. Both are transactional/rollback-able in PostgreSQL.',
      'NEITHER `DELETE` NOR plain `TRUNCATE` resets an identity sequence — only `TRUNCATE t RESTART IDENTITY` explicitly does (Lesson 5 recap). Reach for `TRUNCATE` when genuinely emptying a whole table fast (staging/test data); `DELETE ... WHERE` for anything selective or where row triggers matter.',
      'MIGRATION DISCIPLINE: every schema change = one versioned migration file, checked into version control, applied in the SAME order in every environment (dev/staging/prod) — schema drift between environments is a bug. Migrations are typically append-only (write a new one to adjust, don\'t edit one that already ran).',
      'EXPAND-CONTRACT (a.k.a. parallel change) is the general pattern behind every "safe" technique in this module: (1) EXPAND — add the new thing alongside the old, touching nothing readers depend on; (2) MIGRATE — both coexist, writers populate/backfill both, readers move over one at a time, verified individually; (3) CONTRACT — only once NOTHING depends on the old thing, remove it.',
      'The whole point of expand-contract: NO single step is both irreversible AND immediately breaking for every consumer at once. A plain `RENAME COLUMN` (Lesson 4) is fast but breaks every reader THE INSTANT it commits — expand-contract spreads that same eventual outcome across several individually-safe, individually-revertable steps.',
      'Module 8 summary: column types (L1) + constraints (L2) + generated columns (L3) + safe `ALTER TABLE` (L4) + sequences/schemas (L5) + `DROP`/`TRUNCATE`/migration discipline (L6) together are how a schema is designed AND evolved without an outage. Module 9 covers what happens when multiple transactions touch that schema concurrently.',
    ],
    keyTakeawaysHi: [
      '`DROP` default se refuse karta hai (implicit `RESTRICT`) jab doosre objects target par depend karte hain. `CASCADE` ise override karta hai aur dependents bhi drop karta hai — par theek utna hi dangerous hai jितна `ON DELETE CASCADE`. `CASCADE` par pahunchne se PEHLE investigate karo ki KYA depend karta hai.',
      '`DELETE` vs `TRUNCATE`: `DELETE` rows ek-ek karke hataता hai, row-level triggers fire karta hai, `WHERE` support karta hai. `TRUNCATE` POORI table ko ek fast operation ke roop mein khaali karta hai, row-level triggers fire NAHI karta, `WHERE` support NAHI karta.',
      'NA `DELETE` NA plain `TRUNCATE` ek identity sequence reset karte hain — sirf `TRUNCATE t RESTART IDENTITY` explicitly karta hai. Genuinely poori table jaldi khaali karne ke liye `TRUNCATE` istemal karo; selective kisi bhi cheez ke liye `DELETE ... WHERE`.',
      'MIGRATION DISCIPLINE: har schema change = ek versioned migration file, version control mein checked in, har environment mein SAME order mein applied — environments ke beech schema drift ek bug hai.',
      'EXPAND-CONTRACT is module ke har "safe" technique ke peeche general pattern hai: (1) EXPAND — naya cheez purane ke saath add karo; (2) MIGRATE — dono coexist karte hain, readers ek-ek karke move hote hain; (3) CONTRACT — sirf jab KUCH BHI purani cheez par depend nahi karta, use hataо.',
      'Expand-contract ka poora point: KOI single step ek saath irreversible AUR har consumer ke liye turant breaking na ho. Ek plain `RENAME COLUMN` fast hai par commit hote hi har reader ko todта hai.',
      'Module 8 summary: column types + constraints + generated columns + safe `ALTER TABLE` + sequences/schemas + `DROP`/`TRUNCATE`/migration discipline saath mein ye hai ki ek schema kaise design aur evolve hota hai bina outage ke. Module 9 cover karta hai ki jab kई transactions usी schema ko concurrently touch karte hain to kya hota hai.',
    ],
  },
];
