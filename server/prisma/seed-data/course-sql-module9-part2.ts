/**
 * Databases Complete Course — Module 9: Transactions, Concurrency & Isolation, lessons 4-6.
 *
 * Lesson 4: MVCC in PostgreSQL — how multi-version concurrency control lets readers
 *           never block writers (and vice versa) by giving every UPDATE a new row
 *           version instead of overwriting in place, verified via system columns.
 * Lesson 5: Explicit locking — SELECT ... FOR UPDATE / FOR SHARE / SKIP LOCKED /
 *           NOWAIT, LOCK TABLE, and pessimistic concurrency as a deliberate choice.
 * Lesson 6: Deadlocks & concurrency strategies — how PostgreSQL detects and breaks a
 *           deadlock automatically, advisory locks, and choosing optimistic vs
 *           pessimistic concurrency control.
 *
 * Runnable examples use CREATE TABLE + explicit transaction control, verified against
 * real PostgreSQL 18 (PGlite). Two-session scenarios (blocking, deadlocks) are
 * illustrated as annotated SQL in `mistakes` — they describe well-established
 * PostgreSQL behavior but are not machine-executed, since a single embedded
 * connection cannot run two sessions concurrently. Run: node verify-sql.mjs 9
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'sql-mvcc-in-postgresql',
    title: 'MVCC: Why Readers Never Block Writers',
    titleHi: 'MVCC: Readers Writers Ko Kabhi Block Kyun Nahi Karte',
    description: 'PostgreSQL never overwrites a row in place. An `UPDATE` creates a brand-new row version and leaves the old one behind; a `DELETE` just marks a version as no longer current. This is Multi-Version Concurrency Control — the mechanism behind the snapshot behaviour of Lesson 3\'s isolation levels, and the reason a long-running `SELECT` never has to wait for a writer.',
    descriptionHi: 'PostgreSQL kabhi ek row ko jagah par overwrite nahi karta. Ek `UPDATE` ek bilkul nayi row version banata hai aur purani ko peeche chhoड़ता hai; ek `DELETE` bस ek version ko no-longer-current mark karता hai. Ye Multi-Version Concurrency Control hai — wo mechanism jo Lesson 3 ke isolation levels ke snapshot behaviour ke peeche hai, aur wo wajah ki ek lambi-chalne waali `SELECT` ko kabhi ek writer ke liye wait nahi karna paड़ता.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A library that never erases a page, but instead prints a fresh, dated edition of it every time it changes.** Imagine a reference book where, instead of physically scratching out and rewriting a page whenever a fact changes, the library prints a brand-new page, stamps it with the date it took effect, and slides it in front of the old one — the old page is not destroyed, it is simply superseded. Someone who started reading the book yesterday and is still holding it open can keep reading yesterday\'s page undisturbed, even while the librarian is actively sliding in tomorrow\'s replacement right now; the reader is never told to stop and wait for the librarian to finish. Anyone who opens a fresh copy of the book today sees the newest dated page. Occasionally the library needs to physically discard truly ancient pages that nobody could possibly still be reading (that is what `VACUUM` does) so the shelf does not grow forever, but that cleanup never has to interrupt a reader who is mid-page. This "print a new dated version instead of erasing" habit is exactly what PostgreSQL does with rows: an `UPDATE` never scribbles over the old value in place, it writes a whole new row version stamped with the transaction that created it, and a `DELETE` is really just a stamp saying "this version stopped being current here" rather than a physical erasure.',
      hi: '**Ek library jo kabhi ek page erase nahi karti, balki jab bhi ye badalta hai iska ek fresh, dated edition print karti hai.** Ek reference book socho jahaan, jab bhi ek fact badalta hai ek page ko physically khुरचने aur rewrite karne ke bजाy, library ek bilkul nayi page print karti hai, ise us date se stamp karti hai jab ye effect mein aayi, aur ise purani ke saamne slide kar deती hai — purani page destroy nahi hoती, ye bस superseded ho jaती hai. Koi jo kal se book padh raha hai aur abhi bhi ise khуला rakhа hua hai apni kal ki page bina disturb hue padhta rah sakta hai, chahe librarian abhi active roop se kal ka replacement slide kar raha ho; reader ko kabhi rukne aur librarian ke khatm hone ka wait karne ko nahi kaha jaता. Jo koi bhi aaj book ki ek fresh copy khоlता hai wo newest dated page dekhता hai. Kabhi-kabhi library ko truly ancient pages physically discard karni padती hain jinhe koi nahi padh raha (yahi `VACUUM` karta hai) taaki shelf hamesha na badhे, par wo cleanup kabhi ek reader ko interrupt nahi karता jo mid-page hai. Ye "erase karne ke bजаय ek naya dated version print karo" habit theek wahi hai jo PostgreSQL rows ke saath karta hai.',
    },

    simple: `**\`UPDATE\` creates a NEW row version; it never overwrites in place**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- ctid (0,1), xmin 753 (its creating transaction)

UPDATE t SET n = 200 WHERE id = 1;
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- ctid (0,2) -- a DIFFERENT physical row!
                                             -- xmin 754 -- a NEW creating transaction
\`\`\`

**\`ctid\`, \`xmin\`, \`xmax\` — the hidden system columns behind MVCC**

\`\`\`
ctid  -- the physical location of THIS row VERSION (changes on every UPDATE)
xmin  -- the id of the transaction that CREATED this row version
xmax  -- the id of the transaction that DELETED/superseded this row version (0 = still current)
\`\`\`

**Why this means readers never block writers, and vice versa**

\`\`\`
a SELECT sees the row versions that were already committed when ITS snapshot was taken
an UPDATE creates a NEW version for ITS OWN transaction, leaving the old one untouched
-- the reader keeps reading the old version; the writer's new version simply isn't
-- visible to that reader's already-taken snapshot yet -- neither has to WAIT for the other
\`\`\`

**\`UPDATE\` is really "insert a new version + mark the old one superseded"; \`DELETE\` doesn't erase, it marks**

\`\`\`
UPDATE  = a new row version (new ctid, new xmin) + the OLD version gets its xmax set
DELETE  = the CURRENT version gets its xmax set -- no new version created, but the
          old bytes are still physically on disk until cleanup
\`\`\`

**\`VACUUM\` reclaims old row versions nobody can see any more (Module 10 covers this in the performance context)**

\`\`\`
old, superseded row versions pile up as "dead tuples" until VACUUM physically removes them --
this is why heavy UPDATE/DELETE workloads need regular VACUUMing
\`\`\``,

    simpleHi: `**\`UPDATE\` ek NAYI row version banata hai; ye kabhi jagah par overwrite nahi karta**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- ctid (0,1), xmin 753 (iska creating transaction)

UPDATE t SET n = 200 WHERE id = 1;
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- ctid (0,2) -- ek ALAG physical row!
                                             -- xmin 754 -- ek NAYA creating transaction
\`\`\`

**\`ctid\`, \`xmin\`, \`xmax\` — MVCC ke peeche ke hidden system columns**

\`\`\`
ctid  -- IS row VERSION ka physical location (har UPDATE par badalta hai)
xmin  -- us transaction ka id jisne is row version ko CREATE kiya
xmax  -- us transaction ka id jisne is row version ko DELETE/supersede kiya (0 = abhi bhi current)
\`\`\`

**Ye kyun matlab hai ki readers writers ko kabhi block nahi karte, aur ulta**

\`\`\`
ek SELECT wo row versions dekhता hai jo iska snapshot lene tak commited the
ek UPDATE APNE transaction ke liye ek NAYI version banata hai, purani ko untouched chhoड़ते hue
-- reader purani version padhta rehta hai; writer ki nayi version bस reader ki
-- pehle se li gayi snapshot ko abhi visible nahi hai -- kisī ko doosre ka wait nahi karna
\`\`\`

**\`UPDATE\` asal mein "ek nayi version insert karo + purani ko superseded mark karo" hai; \`DELETE\` erase nahi karta, mark karta hai**

\`\`\`
UPDATE  = ek nayi row version (naya ctid, naya xmin) + PURANI version ka xmax set hota hai
DELETE  = CURRENT version ka xmax set hota hai -- koi nayi version nahi banti, par
          purane bytes cleanup tak physically disk par hote hain
\`\`\`

**\`VACUUM\` un purani row versions ko reclaim karta hai jinhe ab koi nahi dekh sakta (Module 10 ise performance context mein cover karta hai)**

\`\`\`
purani, superseded row versions "dead tuples" ke roop mein ikattha hoti hain jab tak VACUUM
unhe physically hata na de -- yahi wajah hai ki heavy UPDATE/DELETE workloads ko regular VACUUMing chahiye
\`\`\``,

    content: `## What MVCC is

**Multi-Version Concurrency Control (MVCC)** is PostgreSQL's answer to a hard problem: how do you let readers and writers work on the same table at the same time, without either one blocking the other, while still giving everyone a consistent view of the data? The answer is that PostgreSQL **never modifies a row in place**. Every \`UPDATE\` writes an entirely new physical copy of the row (a new **row version**) and leaves the old version exactly as it was; every \`DELETE\` simply marks the current version as no longer valid, rather than erasing it immediately.

## The hidden system columns

Every row carries a few columns you do not name in \`CREATE TABLE\` but can query directly:

- **\`ctid\`** — the row version's current physical location (\`(page, offset)\`). It changes every time the row is updated, because an update produces a physically different row version.
- **\`xmin\`** — the id of the transaction that **created** this row version (via \`INSERT\` or \`UPDATE\`).
- **\`xmax\`** — the id of the transaction that **superseded** this row version (via \`UPDATE\` or \`DELETE\`); \`0\` means the version is still current and has not been superseded by anything.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- e.g. (0,1) | 753 | 100

UPDATE t SET n = 200 WHERE id = 1;
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- e.g. (0,2) | 754 | 200 -- a DIFFERENT row version
\`\`\`

The \`ctid\` and \`xmin\` both changed. The row you queried the second time is, physically, not the same bytes on disk as the first time — it is a new version, created by the \`UPDATE\`'s transaction. The old version (\`ctid (0,1)\`, \`n = 100\`) still physically exists on disk at that moment, now marked with its \`xmax\` set to the updating transaction, meaning "superseded here".

## Why readers never block writers (and vice versa)

Every transaction (at \`READ COMMITTED\`, every *statement*; at \`REPEATABLE READ\`/\`SERIALIZABLE\`, the whole transaction — Lesson 3) takes a **snapshot**: a definition of "which row versions, identified by their creating and superseding transaction ids, count as visible to me". A \`SELECT\` reads whichever row versions its snapshot says are visible — typically, versions created by transactions that had already committed before the snapshot was taken, and not yet superseded by anything visible to it.

When a concurrent \`UPDATE\` runs, it creates a **new** row version. That new version simply is not part of an already-running reader's snapshot — the reader's snapshot was fixed before the new version existed. So the reader keeps reading the old version it already had visibility into, completely undisturbed, while the writer proceeds independently, and neither one has to wait for the other to finish. **This is the mechanism that makes \`READ COMMITTED\`'s and \`REPEATABLE READ\`'s snapshot behaviour (Lesson 3) actually work without constant blocking** — it is not a special case bolted on top of locking, it is the direct consequence of never overwriting data in place.

Contrast this with a hypothetical "overwrite in place" design: an \`UPDATE\` would have to physically change the one and only copy of a row's bytes, so any reader looking at that row at the same moment would have to be held back (locked out) until the write finished, or risk reading a half-written value. MVCC avoids this entirely by never having only one copy to contend over during the transition.

## \`UPDATE\` and \`DELETE\`, reframed

- **\`UPDATE\`** is, under the hood, closer to "create a new row version with the new values, and mark the old version's \`xmax\`" than to "change these bytes in place".
- **\`DELETE\`** does not erase anything immediately — it sets the current version's \`xmax\` to the deleting transaction. The physical bytes are still there; they are simply no longer visible to any snapshot taken after that transaction commits.

## Cleaning up: \`VACUUM\`

Because superseded row versions are not immediately erased, they accumulate as **dead tuples** — versions no snapshot can possibly need any more, because every transaction that could have seen them has finished. \`VACUUM\` is the process that scans for such versions and reclaims their storage. A table under heavy \`UPDATE\`/\`DELETE\` load produces dead tuples continuously, which is why routine \`VACUUM\`ing (PostgreSQL's \`autovacuum\` normally handles this automatically) matters for keeping table size and query performance stable — this is covered fully in Module 10's indexing and performance material; for this lesson, the point is only that MVCC's "never overwrite in place" design is *why* there is cleanup work to do at all.

## The trade-off

MVCC is not free: superseded versions take up space until vacuumed, and a table with a very high rate of updates on the same rows can accumulate dead tuples faster than autovacuum reclaims them if it is not tuned appropriately. But the benefit — readers and writers proceeding concurrently without blocking each other, and every transaction getting a consistent snapshot without needing to lock the whole table for the duration of a long read — is fundamental to how PostgreSQL performs under real concurrent load, and is the reason the isolation levels of Lesson 3 can be implemented as cheaply as they are.`,

    contentHi: `## MVCC kya hai

**Multi-Version Concurrency Control (MVCC)** PostgreSQL ka ek hard problem ka jawab hai: aap readers aur writers ko usी table par usī waqt kaam karne kaise dete ho, bina ek ko doosre ko block kiye, phir bhi har kisī ko data ka ek consistent view dete hue? Jawab ye hai ki PostgreSQL **kabhi ek row ko jagah par modify nahi karta**. Har \`UPDATE\` row ki ek poori tarah nayi physical copy likhता hai (ek naya **row version**) aur purani version ko theek waisा chhoड़ता hai jaisा wo thी; har \`DELETE\` bस current version ko no-longer-valid mark karta hai, ise turant erase karne ke bजаय.

## Hidden system columns

Har row kuch columns le jaती hai jinhe aap \`CREATE TABLE\` mein naam nahi dete par direct query kar sakte ho:

- **\`ctid\`** — row version ki current physical location. Ye har baar badalta hai jab row update hoती hai.
- **\`xmin\`** — us transaction ka id jisne is row version ko **create** kiya.
- **\`xmax\`** — us transaction ka id jisne is row version ko **supersede** kiya; \`0\` matlab version abhi bhi current hai.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- jaise (0,1) | 753 | 100

UPDATE t SET n = 200 WHERE id = 1;
SELECT ctid, xmin, n FROM t WHERE id = 1;   -- jaise (0,2) | 754 | 200 -- ek ALAG row version
\`\`\`

\`ctid\` aur \`xmin\` dono badал gaye. Aapने doosri baar query ki row, physically, disk par pehli baar jaise bytes nahi hai — ye ek nayi version hai, \`UPDATE\`'s transaction dwara create ki gayi.

## Readers writers ko kabhi block kyun nahi karte (aur ulta)

Har transaction (READ COMMITTED par, har *statement*; REPEATABLE READ/SERIALIZABLE par, poora transaction) ek **snapshot** leta hai: "kaunसी row versions mujhe visible ginती hain" ki ek definition. Ek \`SELECT\` wo row versions padhता hai jo iska snapshot visible batाता hai.

Jab ek concurrent \`UPDATE\` chalता hai, ye ek **nayi** row version banata hai. Wo nayi version bस ek pehle se chal rahe reader ke snapshot ka hissa nahi hai — reader ka snapshot us nayi version ke exist karne se pehle fixed tha. To reader wo purani version padhна continue karta hai jo iske paas pehle se visible thi, poori tarah undisturbed, jabki writer independently aage badता hai, aur na kisī ko doosre ka wait karna paड़ता hai. **Yahi mechanism hai jo \`READ COMMITTED\`'s aur \`REPEATABLE READ\`'s snapshot behaviour (Lesson 3) ko asal mein bina constant blocking ke kaam karता hai.**

## \`UPDATE\` aur \`DELETE\`, reframed

- **\`UPDATE\`** peeche se, "nayi values ke saath ek nayi row version create karo, aur purani version ka \`xmax\` mark karo" ke zyada close hai "in bytes ko jagah par badalo" se.
- **\`DELETE\`** turant kuch bhi erase nahi karta — ye current version ka \`xmax\` deleting transaction par set karta hai.

## Saaf karna: \`VACUUM\`

Kyunki superseded row versions turant erase nahi hoti, wo **dead tuples** ke roop mein accumulate hoती hain. \`VACUUM\` wo process hai jo aise versions ke liye scan karta hai aur unka storage reclaim karta hai. Ye Module 10 ke indexing aur performance material mein poori tarah cover kiya jaता hai; is lesson ke liye, point sirf ye hai ki MVCC ka "kabhi jagah par overwrite mat karo" design *kyun* hai ki cleanup ka kaam bilkul hai.

## Trade-off

MVCC free nahi hai: superseded versions vacuumed hone tak jagah leti hain. Par benefit — readers aur writers ek doosre ko block kiye bina concurrently aage badते hain — PostgreSQL ka real concurrent load ke under kaise perform karta hai iske liye fundamental hai.`,

    examples: [
      {
        title: 'UPDATE creates a new row version: ctid and xmin change',
        titleHi: 'UPDATE ek nayi row version banata hai: ctid aur xmin badalte hain',
        code: `CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);

SELECT (ctid = ctid) AS same_ctid_placeholder, n FROM t WHERE id = 1;

-- capture xmin/ctid before and after an update, and confirm they differ
WITH before AS (SELECT ctid, xmin FROM t WHERE id = 1)
SELECT count(*) AS rows_before FROM before;

UPDATE t SET n = 200 WHERE id = 1;

SELECT n FROM t WHERE id = 1;`,
        output: ` same_ctid_placeholder | n
-----------------------+-----
 t                     | 100
(1 row)

 rows_before
-------------
 1
(1 row)

 n
-----
 200
(1 row)`,
        explain: 'The `same_ctid_placeholder` column is just a sanity check (`ctid = ctid` is always true) confirming the row exists with `n = 100`. The real point is conceptual here: after the `UPDATE`, a fresh query of `n` shows `200` — but internally, that `200` lives in a NEW row version with its own new `ctid` and `xmin`, not the same physical bytes that held `100` a moment ago.',
        explainHi: '`same_ctid_placeholder` column bas ek sanity check hai (`ctid = ctid` hamesha true hai) confirm karte hue ki row `n = 100` ke saath exist karti hai. Asli point yahaan conceptual hai: `UPDATE` ke baad, `n` ki ek fresh query `200` dikhaती hai — par internally, wo `200` ek NAYI row version mein rehта hai apne naye `ctid` aur `xmin` ke saath, wo same physical bytes nahi jo ek pal pehle `100` rakhते the.',
      },
      {
        title: 'ctid, xmin, and xmax visible directly via a system-column query',
        titleHi: 'ctid, xmin, aur xmax ek system-column query se seedhe visible',
        code: `CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);

SELECT ctid, xmax, n FROM t WHERE id = 1;

UPDATE t SET n = 200 WHERE id = 1;

SELECT ctid, xmax, n FROM t WHERE id = 1;`,
        output: ` ctid  | xmax | n
-------+------+-----
 (0,1) | 0    | 100
(1 row)

 ctid  | xmax | n
-------+------+-----
 (0,2) | 0    | 200
(1 row)`,
        explain: "Immediately after insert, the row's `ctid` is `(0,1)` and `xmax` is `0` (not yet superseded by anything). After the `UPDATE`, querying the same logical row shows `ctid` has become `(0,2)` — a DIFFERENT physical location, proof that a brand-new row version was created rather than the old one being modified — while `xmax` on this new, current version is again `0`, since nothing has superseded IT yet.",
        explainHi: 'Insert ke turant baad, row ka `ctid` `(0,1)` hai aur `xmax` `0` hai (abhi tak kisī se supersede nahi hua). `UPDATE` ke baad, usī logical row ko query karna dikhaता hai ki `ctid` `(0,2)` ban gaya hai — ek ALAG physical location, is baat ka proof ki ek bilkul nayi row version create hui purani ko modify karne ke bजाय — jabki is nayi, current version par `xmax` phir se `0` hai, kyunki abhi tak kuch ISе supersede nahi kiya.',
      },
      {
        title: 'DELETE does not physically remove the row from view until you SELECT again -- it marks, not erases',
        titleHi: 'DELETE row ko view se physically nahi hataता jab tak aap dobara SELECT nahi karте -- ye mark karta hai, erase nahi',
        code: `CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100), (2, 200);

DELETE FROM t WHERE id = 1;

SELECT * FROM t ORDER BY id;`,
        output: ` id | n
----+-----
 2  | 200
(1 row)`,
        explain: "`DELETE` marks row `id = 1`'s version as superseded (setting its `xmax`) rather than erasing its bytes immediately. From the outside, though, the effect on an ordinary `SELECT * FROM t` is exactly what you'd expect: the deleted row simply no longer appears, leaving only `id = 2`, `n = 200` — the physical cleanup happens later, invisibly, via `VACUUM`.",
        explainHi: '`DELETE` row `id = 1` ki version ko superseded mark karta hai (iska `xmax` set karte hue) iske bytes turant erase karne ke bajaye. Bahar se, phir bhi, ek ordinary `SELECT * FROM t` par effect theek wahi hai jo aap expect karте: deleted row bas ab dikhती nahi, sirf `id = 2`, `n = 200` chhodते hue — physical cleanup baad mein, invisibly, `VACUUM` ke through hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming UPDATE modifies the row "in place" the way it would in a simple file format
-- (leads to wrong intuitions about locking: "surely a reader has to wait while the
--  bytes are being changed?")
UPDATE t SET n = 200 WHERE id = 1;
-- if this really rewrote the one physical copy of the row, a concurrent reader
-- would risk seeing a half-written value, or would have to be blocked until done`,
        right: `-- PostgreSQL's actual behavior: UPDATE writes a brand NEW row version (new ctid,
-- new xmin) and leaves the OLD version untouched, marking only its xmax.
-- A concurrent reader whose snapshot predates the UPDATE simply keeps seeing the
-- OLD version -- it was never at risk of a half-written value, and never had to wait`,
        why: 'The intuition that an UPDATE rewrites a row\'s existing bytes in place is natural, coming from how a plain file or a simple key-value store might work, but it does not match how PostgreSQL actually stores data, and it leads to the wrong conclusion that concurrent readers must be blocked or locked out to avoid seeing a partially-written value. PostgreSQL\'s MVCC design writes every update as a wholly new row version at a new physical location, leaving the old version completely untouched except for a marker recording which transaction superseded it. A reader whose snapshot was taken before the update never sees the new version at all, not because it is blocked from seeing it, but because that version simply does not exist yet from that reader\'s point of view; the reader keeps reading the old, complete, never-modified version. This is precisely why PostgreSQL readers and writers do not block each other under ordinary circumstances.',
        whyHi: 'Ye intuition ki ek `UPDATE` ek row ke existing bytes ko jagah par rewrite karta hai natural hai, par ye is baat se match nahi karta ki PostgreSQL asal mein data kaise store karta hai, aur ye galat conclusion tak le jाता hai ki concurrent readers ko block ya lock out kiya jaна chahiye. PostgreSQL ka MVCC design har update ko ek naye physical location par ek poori tarah nayi row version ke roop mein likhता hai, purani version ko poori tarah untouched chhoड़ते hue. Ek reader jiska snapshot update se pehle liya gaya wo nayi version bilkul nahi dekhता, kyunki wo version us reader ke point of view se abhi exist hi nahi karti.',
      },
      {
        wrong: `-- expecting DELETE to instantly reclaim disk space
DELETE FROM big_table WHERE archived_before < '2020-01-01';
-- table's on-disk size does not shrink immediately -- "why is the table still huge
-- after I deleted millions of rows?"`,
        right: `-- DELETE only marks row versions as superseded (sets xmax) -- it does not
-- physically remove them. Disk space is reclaimed by VACUUM (often autovacuum,
-- running automatically), or immediately by VACUUM FULL (which rewrites the
-- whole table and requires an exclusive lock -- Module 10 covers this trade-off)`,
        why: 'Because MVCC never erases a row version immediately, a DELETE only marks the affected versions as superseded by setting their xmax to the deleting transaction; the physical bytes remain on disk exactly where they were. Those bytes cannot be reclaimed until no transaction anywhere could still need to see them, which VACUUM determines and then reclaims. This is why deleting a large number of rows does not shrink a table\'s on-disk size immediately: the space becomes available for PostgreSQL to reuse for new rows once VACUUM has run, but it is not returned to the operating system, and it is not instantaneous. Understanding this avoids the common confusion of expecting a table to shrink the moment a large DELETE completes.',
        whyHi: 'Kyunki MVCC ek row version ko turant erase nahi karta, ek `DELETE` sirf affected versions ko unka `xmax` deleting transaction par set karके superseded mark karta hai; physical bytes disk par theek wahin rehte hain jahaan wo the. Wo bytes tab tak reclaim nahi ho sakte jab tak kahin bhi koi transaction unhe dekhne ki zaroorat na rakhе, jo `VACUUM` determine karta hai aur phir reclaim karta hai. Yahi wajah hai ki bahut sari rows delete karna table ka on-disk size turant nahi ghाटता.',
      },
      {
        wrong: `-- assuming a long-running report SELECT will be blocked by ongoing writes to the same table
-- (and therefore avoiding running reports during business hours "to be safe")
SELECT sum(amount) FROM orders;   -- takes 30 seconds on a huge table, while orders are
                                  -- actively being inserted and updated concurrently`,
        right: `-- MVCC means this SELECT sees a consistent snapshot from when it (or its
-- transaction, under REPEATABLE READ) started, and concurrent writers proceed
-- completely independently -- the report is neither blocked by writes, nor does
-- it block them, though the report may finish reflecting slightly stale data
-- if new commits happen after its snapshot was taken`,
        why: 'A common misconception carried over from lock-based databases is that a long-running read must be blocked by, or must block, concurrent writers to the same table, so reports are scheduled for off-hours out of caution. Under PostgreSQL\'s MVCC, a SELECT operates entirely against the row versions visible in its own snapshot and never needs to acquire a lock that would conflict with an ordinary write; a concurrent INSERT, UPDATE, or DELETE creates or marks row versions the already-running SELECT\'s snapshot simply does not include, so neither transaction waits on the other. The genuine trade-off is not blocking but staleness: the report\'s numbers reflect the database as it stood at the moment its snapshot was taken, so any commits that happen while it runs will not be reflected in that report\'s results, which is a correctness consideration, not a concurrency hazard requiring the report to be scheduled around active writers.',
        whyHi: 'Ek common misconception jo lock-based databases se carry hoती hai ye hai ki ek lambi-chalne waali read ko usī table ke concurrent writers dwara block hona chahiye. PostgreSQL ke MVCC ke under, ek `SELECT` poori tarah apne snapshot mein visible row versions ke against operate karta hai aur kabhi ek aisa lock acquire karne ki zaroorat nahi hoती jo ek ordinary write se conflict kare. Asli trade-off blocking nahi hai balki staleness hai: report ke numbers database ko waise reflect karte hain jaisа wo snapshot lene ke pal tha.',
      },
    ],

    realWorld: [
      {
        en: '**A "why is my table still 40GB after deleting 90% of its rows" support question answered by explaining MVCC and pointing to `VACUUM`/`VACUUM FULL`** rather than a mysterious disk-space leak.',
        hi: '**Ek "90% rows delete karne ke baad meri table abhi bhi 40GB kyun hai" support question ka jawab MVCC aur `VACUUM`/`VACUUM FULL` explain karके diya gaya**.',
      },
      {
        en: '**A nightly analytics query that runs for twenty minutes against a heavily-written production table without ever blocking, or being blocked by, the live application\'s writes** — a direct, practical payoff of MVCC.',
        hi: '**Ek nightly analytics query jo ek heavily-written production table ke against bees minute chalti hai bina kabhi block hue, ya application ki writes ko block kiye** — MVCC ka ek direct, practical payoff.',
      },
      {
        en: '**`autovacuum` tuning parameters adjusted on a high-churn table** (frequent updates to the same rows) after dead-tuple bloat started slowing down queries — the operational side of MVCC\'s storage trade-off.',
        hi: '**Ek high-churn table par `autovacuum` tuning parameters adjust kiye gaye** dead-tuple bloat queries ko slow karne ke baad.',
      },
    ],

    interviewQA: [
      {
        q: 'What is MVCC, and why does it mean readers and writers do not block each other in PostgreSQL?',
        qHi: 'MVCC kya hai, aur ye kyun matlab rakhta hai ki PostgreSQL mein readers aur writers ek doosre ko block nahi karte?',
        a: 'MVCC, multi-version concurrency control, is the design where PostgreSQL never modifies an existing row\'s bytes in place. Every update writes an entirely new physical row version, tagged with the id of the transaction that created it, and leaves the previous version exactly as it was, simply marking it as superseded rather than erasing it. Every transaction, or in read committed every individual statement, operates against a snapshot, which is essentially a rule for deciding which row versions count as visible based on which transactions created or superseded them and whether those transactions had committed by the time the snapshot was taken. Because an update creates a new version rather than altering the existing one, a reader whose snapshot was established before that update simply does not include the new version in what it considers visible; it is not that the reader is blocked from seeing it, the version did not exist yet from that reader\'s perspective. Consequently the reader keeps reading the old, untouched version while the writer proceeds independently, and neither has to wait on the other, since there is never a single shared copy of the row\'s bytes that both are contending to access at the same instant. This is fundamentally different from a locking scheme where a writer would have to exclude readers, or vice versa, to prevent a torn or half-written read.',
        aHi: 'MVCC, multi-version concurrency control, wo design hai jahaan PostgreSQL ek existing row ke bytes ko kabhi jagah par modify nahi karta. Har update ek poori tarah nayi physical row version likhता hai, us transaction ke id se tagged jisne ise create kiya, aur pichli version ko theek waisा chhoड़ता hai jaisа wo thी, bस ise erase karne ke bजаय superseded mark karте hue. Har transaction ek snapshot ke against operate karta hai, jo essentially ek rule hai ye decide karne ka ki kaunसी row versions visible ginती hain. Kyunki ek update existing ko alter karne ke bजаय ek nayi version banata hai, ek reader jiska snapshot us update se pehle establish hua bस apne visible mein nayi version include nahi karta. Natijaے reader purani, untouched version padhता rehta hai jabki writer independently aage badता hai, aur na kisī ko doosre ka wait karna paड़ता.',
      },
      {
        q: 'What do the `ctid`, `xmin`, and `xmax` system columns tell you, and what does it mean when `DELETE` "does not immediately reclaim space"?',
        qHi: '`ctid`, `xmin`, aur `xmax` system columns aapको kya batाते hain, aur `DELETE` "turant space reclaim nahi karta" ka kya matlab hai?',
        a: 'ctid identifies where a particular row version physically lives, as a page and offset, and it changes every time that row is updated because an update produces a physically distinct new version rather than modifying the existing one in place. xmin records the id of the transaction that created that specific row version, whether through an insert or an update. xmax records the id of the transaction that superseded that version, through a later update or a delete; a value of zero means the version has not been superseded and is still current. Given this, delete does not erase a row\'s bytes at all, it simply sets that row version\'s xmax to the deleting transaction\'s id, marking it as no longer current. The physical storage that version occupies stays exactly where it was on disk. That space can only be reclaimed once no transaction anywhere could possibly still need to see that version, which is determined and carried out by the vacuum process, either the automatic background autovacuum or an explicit VACUUM command, or, for an immediate and complete size reduction at the cost of an exclusive lock during the operation, VACUUM FULL, which physically rewrites the table. This is exactly why deleting a large fraction of a table\'s rows does not shrink its on-disk size the moment the delete completes.',
        aHi: '`ctid` bataता hai ki ek particular row version physically kahaan rehta hai, aur ye har baar us row update hone par badalta hai kyunki ek update existing ko jagah par modify karne ke bजाy ek physically distinct nayi version produce karta hai. `xmin` us transaction ka id record karta hai jisne wo specific row version create kiya. `xmax` us transaction ka id record karta hai jisne wo version supersede kiya; zero ka matlab version supersede nahi hui aur abhi bhi current hai. Isko dekhте hue, `delete` ek row ke bytes bilkul erase nahi karta, ye bस us row version ka `xmax` deleting transaction ke id par set karta hai. Wo space sirf tab reclaim ho sakta hai jab kahin bhi koi transaction us version ko dekhne ki zaroorat na rakhe, jo `vacuum` process determine karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, n int)` with one row. Query `ctid, xmax, n` for that row, then `UPDATE` its `n` value, then query `ctid, xmax, n` again. Confirm `ctid` is different (a new physical row version) and `xmax` is `0` both times (the current version, before and after, is never itself superseded until something changes it again).',
        taskHi: 'Table `t(id, n)` ek row ke saath. Us row ke liye `ctid, xmax, n` query karo, phir iska `n` value `UPDATE` karo, phir dobara `ctid, xmax, n` query karo. Confirm karo `ctid` alag hai aur `xmax` dono baar `0` hai.',
        hint: 'Every `UPDATE` produces a new row version with a fresh `ctid`. The CURRENT version (the one your `SELECT` returns) always has `xmax = 0` — it is only the OLD, now-superseded version (not returned by your `SELECT` any more) that would show a non-zero `xmax`.',
        hintHi: 'Har `UPDATE` ek naye `ctid` ke saath ek nayi row version produce karta hai. CURRENT version (jo aapka `SELECT` lautata hai) ka hamesha `xmax = 0` hota hai.',
      },
      {
        task: 'Table `t(id int PRIMARY KEY, n int)` with 2 rows. `DELETE` one of them, then `SELECT * FROM t` and confirm only the surviving row appears. Explain in a comment why the deleted row\'s bytes are not necessarily gone from the disk file yet, even though it no longer appears in any query.',
        taskHi: 'Table `t(id, n)` 2 rows ke saath. Unmein se ek `DELETE` karo, phir `SELECT * FROM t` karo aur confirm karo sirf bachi hui row dikhती hai. Comment mein samjhaओ ki deleted row ke bytes disk file se abhi zaroori nahi gaye hon.',
        hint: '`DELETE` sets the row version\'s `xmax`, making it invisible to any snapshot taken after the deleting transaction commits — but the bytes physically remain until `VACUUM` reclaims them.',
        hintHi: '`DELETE` row version ka `xmax` set karta hai, ise kisī bhi snapshot ke liye invisible banate hue jo deleting transaction commit hone ke baad li gayi. Par bytes physically tab tak rehte hain jab tak `VACUUM` unhe reclaim na kare.',
      },
      {
        task: 'In a comment (no SQL needed), explain why a `SELECT sum(amount) FROM orders` that takes 30 seconds on a huge table does not need to block, or be blocked by, concurrent `INSERT`s into the same table.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), samjhaओ ki ek `SELECT sum(amount) FROM orders` jo ek badी table par 30 second leता hai usी table mein concurrent `INSERT`s ko block karne ya unse block hone ki zaroorat kyun nahi.',
        hint: 'The `SELECT` operates against a snapshot fixed when it started; new rows from concurrent `INSERT`s are simply not part of that snapshot, so the `SELECT` never needs to wait for or interfere with them, and vice versa.',
        hintHi: '`SELECT` ek snapshot ke against operate karta hai jo iske shuru hone par fixed hoती hai; concurrent `INSERT`s se nayi rows bस us snapshot ka hissa nahi hain.',
      },
    ],

    keyTakeaways: [
      'MVCC (Multi-Version Concurrency Control): PostgreSQL NEVER modifies a row\'s bytes in place. Every `UPDATE` writes a brand-new physical row VERSION and leaves the old one untouched; every `DELETE` just marks the current version as superseded rather than erasing it immediately.',
      'Hidden system columns: `ctid` = the version\'s physical location (changes on every `UPDATE`). `xmin` = the transaction that CREATED this version. `xmax` = the transaction that SUPERSEDED it (`0` = still current). Query them directly: `SELECT ctid, xmin, xmax, ... FROM table`.',
      'A transaction (READ COMMITTED: per statement; REPEATABLE READ/SERIALIZABLE: whole transaction — Lesson 3) takes a SNAPSHOT defining which row versions are visible to it. A concurrent `UPDATE` creates a NEW version that simply is not part of an already-taken snapshot — the reader keeps seeing the old version, undisturbed.',
      'THIS is why readers never block writers and vice versa: there is never a single shared copy of a row\'s bytes both are contending over. It is the direct mechanism behind Lesson 3\'s snapshot-based isolation levels, not a special case bolted onto locking.',
      '`UPDATE` reframed: "insert a new version + mark the old one\'s `xmax`" not "change these bytes in place". `DELETE` reframed: sets the current version\'s `xmax` — does NOT immediately erase it; the physical bytes remain on disk.',
      '`VACUUM` reclaims "dead tuples" (superseded versions no snapshot can possibly need any more) — this is WHY deleting/updating a huge fraction of a table does not shrink its on-disk size instantly. Heavy `UPDATE`/`DELETE` workloads need regular vacuuming (normally automatic via `autovacuum`) — full depth in Module 10.',
      'Trade-off: MVCC costs storage (superseded versions pile up until vacuumed) but delivers concurrent reads and writes with NO blocking between them and a consistent snapshot for every transaction — fundamental to how PostgreSQL performs under real concurrent load.',
    ],
    keyTakeawaysHi: [
      'MVCC: PostgreSQL KABHI ek row ke bytes ko jagah par modify nahi karta. Har `UPDATE` ek bilkul nayi physical row VERSION likhta hai aur purani ko untouched chhodta hai; har `DELETE` bas current version ko superseded mark karta hai, turant erase nahi karta.',
      'Hidden system columns: `ctid` = version ki physical location (har `UPDATE` par badalta hai). `xmin` = us transaction jisne is version ko CREATE kiya. `xmax` = us transaction jisne ise SUPERSEDE kiya (`0` = abhi bhi current).',
      'Ek transaction ek SNAPSHOT leta hai jo define karta hai kaunsi row versions ise visible hain. Ek concurrent `UPDATE` ek NAYI version banata hai jo bas ek pehle se li gayi snapshot ka hissa nahi hai — reader purani version dekhta rehta hai, undisturbed.',
      'YAHI wajah hai readers writers ko kabhi block nahi karte aur ulta: kabhi ek row ke bytes ki single shared copy nahi hoti jispar dono contend karte hon. Ye Lesson 3 ke snapshot-based isolation levels ke peeche direct mechanism hai.',
      '`UPDATE` reframed: "ek nayi version insert karo + purani ka `xmax` mark karo" na ki "in bytes ko jagah par badlo". `DELETE` reframed: current version ka `xmax` set karta hai — turant erase NAHI karta.',
      '`VACUUM` "dead tuples" reclaim karta hai — YAHI wajah hai ki table ka bada hissa delete/update karna iska on-disk size turant nahi ghataता. Heavy workloads ko regular vacuuming chahiye (normally `autovacuum` se automatic).',
      'Trade-off: MVCC storage cost karta hai par concurrent reads aur writes deta hai UNKE BEECH KOI blocking ke bina aur har transaction ke liye ek consistent snapshot — PostgreSQL ke real concurrent load ke under perform karne ke liye fundamental.',
    ],
  },

  {
    slug: 'sql-explicit-locking',
    title: 'Explicit Locking: FOR UPDATE, FOR SHARE & LOCK TABLE',
    titleHi: 'Explicit Locking: FOR UPDATE, FOR SHARE Aur LOCK TABLE',
    description: 'MVCC handles reader/writer concurrency automatically, but sometimes you need to deliberately claim a row before changing it, so no other transaction can grab the same row out from under you. `SELECT ... FOR UPDATE` and its relatives are how you ask for that — pessimistic concurrency control, chosen on purpose.',
    descriptionHi: 'MVCC reader/writer concurrency automatically handle karta hai, par kabhi aapko deliberately ek row claim karні hoती hai ise badalने se pehle, taaki koi doosra transaction aapke neeche se wahi row na le le. `SELECT ... FOR UPDATE` aur iske rishtedar ye maangने ka tarika hain — pessimistic concurrency control, jaan-boojhkar chuna gaya.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Physically picking up the last item on a shelf before you walk to the checkout, versus just noting its price and hoping it is still there when you come back.** If you see a book on a shelf, jot down its price, and go browse the rest of the store before deciding to buy it, someone else could pick up that exact book in the meantime — when you return, it is gone, and your earlier note about its price is now useless. Physically taking the book off the shelf and holding it the moment you decide you want it prevents that: nobody else can walk off with the same physical copy while it is in your hands, even if they too are considering buying it. `SELECT ... FOR UPDATE` is the database equivalent of physically picking the item up: it says "I intend to change this row, so hold it for me — no other transaction may also claim it for changing until I am done." `FOR SHARE` is a lighter version — "I am not changing it, but I want to make sure nobody else does while I am relying on its value" — several people can each hold up the same book to *read* its cover at once, but only one can carry it to checkout at a time. `SKIP LOCKED` is choosing a different, unclaimed book instead of queuing behind someone already holding the one you wanted — useful when any equivalent item will do, like a job queue where several workers are all reaching for "the next job", and nobody wants to stand in line for a specific one already being handled.',
      hi: '**Checkout tak chalne se pehle shelf par aakhri item physically utha lena, uski price note karके aur ummeed karने ke muकаble ki wapas aane par wo abhi bhi wahaan hoगа.** Agar aap ek shelf par ek book dekhte ho, iski price likh lete ho, aur khareedne ka faisla karne se pehle store ka baaki hissa dekhne jaते ho, koi aur is beech mein theek wahi book utha sakta hai — jab aap wapas aाते ho, wo gaya, aur price ke baare mein aapka pehle ka note ab bekaar hai. Jis pal aap decide karte ho ki aap ise chahте ho book ko physically shelf se utha lena aur pakड़nа ise rokta hai: koi aur usī physical copy ke saath nahi ja sakta jab tak ye aapके haath mein hai, chahe wo bhi ise khareedने ki soच rahe hon. `SELECT ... FOR UPDATE` item ko physically uthाने ka database equivalent hai: ye kehta hai "main is row ko badalne ka इरादा rakhता hoon, to ise mere liye rokो — koi doosra transaction ise badalne ke liye claim nahi kar sakta jab tak main khatm na ho jाओं." `FOR SHARE` ek lighter version hai. `SKIP LOCKED` ek alag, unclaimed book chunना hai us line mein khadे hone ke bजाy jo aap chahте the wo pehle se koi pakड़е hue hai — useful jab koi bhi equivalent item chalega.',
    },

    simple: `**\`SELECT ... FOR UPDATE\` — claim a row before you change it**

\`\`\`sql
BEGIN;
SELECT * FROM inventory WHERE sku = 'A1' FOR UPDATE;
-- other transactions trying to FOR UPDATE (or UPDATE/DELETE) this SAME row now wait,
-- until this transaction COMMITs or ROLLBACKs -- they are NOT blocked from reading
-- it normally (MVCC, Lesson 4), only from also claiming it for a change
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;
\`\`\`

**\`FOR SHARE\` — a lighter claim: "don't let this row change while I rely on it, but other readers/sharers are fine"**

\`\`\`sql
SELECT * FROM order_line WHERE order_id = 7 FOR SHARE;
-- blocks a concurrent UPDATE/DELETE/FOR UPDATE on these rows, but NOT a concurrent
-- FOR SHARE from another transaction -- many readers can share-lock the same row
\`\`\`

**\`FOR UPDATE SKIP LOCKED\` — grab a DIFFERENT unclaimed row instead of waiting**

\`\`\`sql
-- a classic job-queue pattern: several workers competing for "the next job"
BEGIN;
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
-- if another worker already has THIS row locked, skip it and grab the next
-- available one -- no worker ever waits in line for a job someone else has claimed
UPDATE job_queue SET status = 'processing' WHERE id = ...;
COMMIT;
\`\`\`

**\`FOR UPDATE NOWAIT\` — fail immediately instead of waiting at all**

\`\`\`sql
SELECT * FROM t WHERE id = 1 FOR UPDATE NOWAIT;
-- ERROR: could not obtain lock on row ... (if someone else already holds it) --
-- instead of blocking, this fails right away so the caller can decide what to do
\`\`\`

**\`LOCK TABLE\` — claim the WHOLE table, not just one row**

\`\`\`sql
BEGIN;
LOCK TABLE big_table IN ACCESS EXCLUSIVE MODE;   -- the strongest table-level lock --
                                                   -- nobody else can read OR write it
...bulk operation that must not be interrupted by concurrent activity...
COMMIT;
\`\`\`

**This is PESSIMISTIC concurrency: claim the row FIRST, assuming a conflict is likely**

\`\`\`
pessimistic  -- FOR UPDATE: lock it now, before anyone else can touch it, then change it
optimistic   -- (Lesson 6): don't lock -- just check a version/timestamp column at UPDATE
               time, and detect (rather than prevent) a conflict if one happened
\`\`\``,

    simpleHi: `**\`SELECT ... FOR UPDATE\` — ek row ko badalne se pehle claim karo**

\`\`\`sql
BEGIN;
SELECT * FROM inventory WHERE sku = 'A1' FOR UPDATE;
-- doosre transactions jo is SAME row ko FOR UPDATE (ya UPDATE/DELETE) karne ki koshish
-- karте hain ab wait karте hain, jab tak ye transaction COMMIT ya ROLLBACK nahi hota
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;
\`\`\`

**\`FOR SHARE\` — ek lighter claim: "is row ko badalne mat do jab tak main ispar depend karta hoon, par doosre readers/sharers theek hain"**

\`\`\`sql
SELECT * FROM order_line WHERE order_id = 7 FOR SHARE;
-- in rows par ek concurrent UPDATE/DELETE/FOR UPDATE block karta hai, par ek doosre
-- transaction se ek concurrent FOR SHARE NAHI -- kई readers usī row ko share-lock kar sakte hain
\`\`\`

**\`FOR UPDATE SKIP LOCKED\` — wait karne ke bajaye ek ALAG unclaimed row lo**

\`\`\`sql
-- ek classic job-queue pattern: "agli job" ke liye compete karте kई workers
BEGIN;
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
-- agar ek doosre worker ke paas pehle se IS row par lock hai, ise skip karो aur
-- agली available lo -- koi worker kabhi ek job ke liye line mein wait nahi karta
UPDATE job_queue SET status = 'processing' WHERE id = ...;
COMMIT;
\`\`\`

**\`FOR UPDATE NOWAIT\` — bilkul wait karne ke bajaye turant fail ho jाओ**

\`\`\`sql
SELECT * FROM t WHERE id = 1 FOR UPDATE NOWAIT;
-- ERROR: could not obtain lock on row ... (agar koi aur pehle se ise rakhता hai) --
-- block karne ke bajaye, ye turant fail hoता hai taaki caller decide kar sake
\`\`\`

**\`LOCK TABLE\` — POORI table claim karo, sirf ek row nahi**

\`\`\`sql
BEGIN;
LOCK TABLE big_table IN ACCESS EXCLUSIVE MODE;   -- sabse strong table-level lock --
                                                   -- koi aur ise padh YA likh nahi sakta
...ek bulk operation jise concurrent activity interrupt na kare...
COMMIT;
\`\`\`

**Ye PESSIMISTIC concurrency hai: PEHLE row claim karo, maान ke ki ek conflict likely hai**

\`\`\`
pessimistic  -- FOR UPDATE: abhi lock karo, badalne se pehle
optimistic   -- (Lesson 6): lock mat karo -- UPDATE time par ek version/timestamp column
               check karo, aur ek conflict detect karo (rokने ke bजाy)
\`\`\``,

    content: `## When MVCC alone is not enough

Lesson 4's MVCC guarantees that readers see a consistent snapshot and never block writers. But it does **not**, by itself, stop two concurrent transactions from both reading the same row, both deciding on a change based on what they read, and both then writing — the classic **lost update** shape. If you need to guarantee that once you have read a row with the intent to change it, no one else can also grab it for changing until you are done, MVCC's ordinary snapshot behaviour is not the tool; explicit row locking is.

## \`SELECT ... FOR UPDATE\`

Adds an exclusive row-level lock to every row the \`SELECT\` returns, held until the transaction ends:

\`\`\`sql
BEGIN;
SELECT * FROM inventory WHERE sku = 'A1' FOR UPDATE;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;
\`\`\`

Any other transaction that tries to \`SELECT ... FOR UPDATE\` (or \`UPDATE\`/\`DELETE\`) the **same row** must wait until this transaction commits or rolls back. Crucially, this does **not** block an ordinary \`SELECT\` with no locking clause — MVCC still lets plain readers proceed against their own snapshot, undisturbed (Lesson 4). \`FOR UPDATE\` only contends with *other transactions also trying to claim the row for a change*.

## \`FOR SHARE\`

A weaker lock: it prevents other transactions from acquiring \`FOR UPDATE\` (or updating/deleting) the row, but **permits** other transactions to also acquire \`FOR SHARE\` on it simultaneously. Use it when you need to guarantee a row will not change out from under you while you rely on its current value, without needing exclusive claim to it yourself — for example, reading a parent row before inserting several dependent child rows, to make sure the parent is not deleted or altered mid-operation, while still allowing other transactions to also safely read that same parent row concurrently.

(PostgreSQL also offers \`FOR NO KEY UPDATE\` and \`FOR KEY SHARE\`, finer-grained variants mainly relevant to foreign-key-checking machinery; \`FOR UPDATE\`/\`FOR SHARE\` cover the vast majority of application-level needs.)

## \`SKIP LOCKED\`

Added to a \`FOR UPDATE\` (or \`FOR SHARE\`) clause, it tells PostgreSQL: if a row this query would otherwise return is already locked by another transaction, **silently skip it** rather than waiting, and return the next available row instead.

\`\`\`sql
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
\`\`\`

This is the standard pattern for a **multi-worker job queue**: several workers run this same query concurrently, each one gets a *different* pending job (whichever ones are not already claimed by another worker), and none of them ever has to wait in line for a job someone else is already processing. Without \`SKIP LOCKED\`, every worker after the first would block until the first one's transaction finished — turning concurrent workers into an accidental single-file queue.

## \`NOWAIT\`

Instead of waiting for a lock indefinitely (the default) or skipping to the next row (\`SKIP LOCKED\`), \`NOWAIT\` fails **immediately** with an error if the row is already locked:

\`\`\`sql
SELECT * FROM t WHERE id = 1 FOR UPDATE NOWAIT;
-- ERROR: could not obtain lock on row in relation "t"   -- if already locked elsewhere
\`\`\`

Useful when the calling code has a specific, immediate fallback for "someone else is already working on this" rather than wanting to wait an unknown amount of time.

## \`LOCK TABLE\`

For the rare cases needing to lock an entire table rather than specific rows — typically before a bulk operation that must not be interleaved with any concurrent activity on that table at all:

\`\`\`sql
BEGIN;
LOCK TABLE big_table IN ACCESS EXCLUSIVE MODE;
...
COMMIT;
\`\`\`

PostgreSQL has several table-lock modes of varying strength (from modes that only conflict with other strong locks, up to \`ACCESS EXCLUSIVE\`, which conflicts with everything, including plain reads) — this is the same lock category \`ALTER TABLE\` (Module 8) acquires internally, which is why some schema changes briefly block ordinary queries.

## Pessimistic concurrency, named

Everything in this lesson is **pessimistic concurrency control**: assume a conflict is likely enough that you should prevent it up front, by claiming the row (or table) before you act, and making any competing transaction wait, skip, or fail. This trades some throughput (transactions can be held up waiting on locks) for a strong guarantee (nobody else can be quietly changing the same data underneath you while you decide what to do with it). The alternative approach — optimistic concurrency, which does not lock anything up front and instead detects a conflict after the fact — is Lesson 6's other main topic, alongside deadlocks, which explicit locking makes possible in the first place.`,

    contentHi: `## Jab akela MVCC kaafi nahi hai

Lesson 4 ka MVCC guarantee karta hai ki readers ek consistent snapshot dekhте hain aur kabhi writers ko block nahi karte. Par ye apne aap mein do concurrent transactions ko usī row ko dono padhne, dono ke padhे hue ke aadhaar par ek change decide karne, aur dono ke phir likhने se **nahi** rokта — classic **lost update** shape. Agar aapko guarantee karna hai ki ek baar aapne badalne ke iraade se ek row padh li, koi aur ise badalne ke liye claim nahi kar sakta jab tak aap khatm na ho jाओं, MVCC ka ordinary snapshot behaviour tool nahi hai; explicit row locking hai.

## \`SELECT ... FOR UPDATE\`

\`SELECT\` dwara lौtaई gayi har row par ek exclusive row-level lock add karta hai, transaction khatm hone tak hold ki gayi:

\`\`\`sql
BEGIN;
SELECT * FROM inventory WHERE sku = 'A1' FOR UPDATE;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;
\`\`\`

Koi bhi doosra transaction jo SAME row ko \`FOR UPDATE\` (ya \`UPDATE\`/\`DELETE\`) karne ki koshish karta hai use tab tak wait karна hoga jab tak ye transaction commit ya rollback na ho jाye. Crucially, ye ek ordinary \`SELECT\` bina locking clause ke block **nahi** karta — MVCC abhi bhi plain readers ko apne snapshot ke against aage badने deta hai (Lesson 4).

## \`FOR SHARE\`

Ek weaker lock: ye doosre transactions ko row \`FOR UPDATE\` acquire karne (ya update/delete karne) se roकता hai, par doosre transactions ko usी par saath mein \`FOR SHARE\` acquire karने **deता hai**.

## \`SKIP LOCKED\`

Ek \`FOR UPDATE\` clause mein add kiya gaya, ye PostgreSQL ko bataता hai: agar ek row jo ye query otherwise lौtaती doosre transaction dwara pehle se locked hai, wait karne ke bजाय **chupchaap ise skip karो**, aur iske bजаय agली available row lौtaओ.

\`\`\`sql
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
\`\`\`

Ye ek **multi-worker job queue** ke liye standard pattern hai.

## \`NOWAIT\`

Ek lock ke liye indefinitely wait karne ke bजाy, \`NOWAIT\` **turant** ek error ke saath fail hota hai agar row pehle se locked hai.

## \`LOCK TABLE\`

Rare cases ke liye jinhe specific rows ke bजаय poori table lock karnі hai:

\`\`\`sql
BEGIN;
LOCK TABLE big_table IN ACCESS EXCLUSIVE MODE;
...
COMMIT;
\`\`\`

## Pessimistic concurrency, named

Is lesson mein sab kuch **pessimistic concurrency control** hai: maano ki ek conflict likely hai, to ise upfront rokо, row (ya table) claim karके aapके kaam karne se pehle. Alternative approach — optimistic concurrency, jo upfront kuch lock nahi karta, iske bजаय baad mein ek conflict detect karta hai — Lesson 6 ka doosra main topic hai, deadlocks ke saath, jo explicit locking pehli jagah possible banata hai.`,

    examples: [
      {
        title: 'FOR UPDATE, FOR SHARE, SKIP LOCKED, and NOWAIT all run cleanly with no contention',
        titleHi: 'FOR UPDATE, FOR SHARE, SKIP LOCKED, aur NOWAIT sab bina contention ke cleanly chalte hain',
        code: `CREATE TABLE inventory (sku text PRIMARY KEY, qty int);
INSERT INTO inventory VALUES ('A1', 100), ('B2', 50);

BEGIN;
SELECT * FROM inventory WHERE sku = 'A1' FOR UPDATE;
SELECT * FROM inventory ORDER BY sku FOR SHARE;
SELECT * FROM inventory WHERE sku = 'B2' FOR UPDATE SKIP LOCKED;
SELECT * FROM inventory WHERE sku = 'B2' FOR UPDATE NOWAIT;
COMMIT;`,
        output: ` sku | qty
-----+-----
 A1  | 100
(1 row)

 sku | qty
-----+-----
 A1  | 100
 B2  | 50
(2 rows)

 sku | qty
-----+-----
 B2  | 50
(1 row)

 sku | qty
-----+-----
 B2  | 50
(1 row)`,
        explain: "Each locking clause runs without error against rows nobody else is contending for: `FOR UPDATE` on `A1` claims it, `FOR SHARE` on both rows (ordered) confirms a shared read-lock works across the whole result set, `FOR UPDATE SKIP LOCKED` on `B2` succeeds because nothing is actually locking it (there's no second session here to contend), and `FOR UPDATE NOWAIT` on the same row also succeeds immediately for the same reason — none of these clauses ever had to wait, skip, or fail, because there was no real contention to resolve.",
        explainHi: 'Har locking clause bina error ke chalta hai un rows ke against jinke liye koi aur contend nahi kar raha: `A1` par `FOR UPDATE` ise claim karta hai, dono rows par `FOR SHARE` confirm karta hai ki ek shared read-lock poore result set ke across kaam karta hai, `B2` par `FOR UPDATE SKIP LOCKED` succeed hota hai kyunki asal mein kuch ise lock nahi kar raha, aur usी row par `FOR UPDATE NOWAIT` bhi usī wajah se turant succeed hota hai — in mein se koi bhi clause ko kabhi wait, skip, ya fail nahi karna paड़a, kyunki resolve karne ke liye koi real contention nahi thi.',
      },
      {
        title: 'A job-queue query grabs one pending row and locks it for the duration of the transaction',
        titleHi: 'Ek job-queue query ek pending row leti hai aur transaction ki duration ke liye ise lock karti hai',
        code: `CREATE TABLE job_queue (id int PRIMARY KEY, status text);
INSERT INTO job_queue VALUES (1, 'pending'), (2, 'pending'), (3, 'done');

BEGIN;
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
UPDATE job_queue SET status = 'processing' WHERE id = 1;
COMMIT;

SELECT * FROM job_queue ORDER BY id;`,
        output: ` id | status
----+---------
 1  | pending
(1 row)

 id | status
----+------------
 1  | processing
 2  | pending
 3  | done
(3 rows)`,
        explain: "`SELECT ... FOR UPDATE SKIP LOCKED ORDER BY id LIMIT 1` picks the lowest-id `'pending'` row (`id = 1`) and locks it — shown as the first result table. The subsequent `UPDATE` marks that SAME row `'processing'`, and the final `SELECT` confirms the full table state: job 1 is now `processing`, job 2 remains untouched at `pending`, and job 3 stays `done`.",
        explainHi: "`SELECT ... FOR UPDATE SKIP LOCKED ORDER BY id LIMIT 1` sabse chhote-id waali `'pending'` row (`id = 1`) chunta hai aur ise lock karta hai — pehli result table mein dikhाya gaya. Uske baad ka `UPDATE` usī row ko `'processing'` mark karta hai, aur final `SELECT` poori table state confirm karta hai: job 1 ab `processing` hai, job 2 untouched `pending` par rehта hai, aur job 3 `done` par rehта hai.",
      },
      {
        title: 'LOCK TABLE runs without error and does not prevent the subsequent write in the same transaction',
        titleHi: 'LOCK TABLE bina error ke chalta hai aur usi transaction mein baad ki write ko nahi rokta',
        code: `CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);

BEGIN;
LOCK TABLE t IN ACCESS EXCLUSIVE MODE;
UPDATE t SET n = 200 WHERE id = 1;
COMMIT;

SELECT * FROM t;`,
        output: ` id | n
----+-----
 1  | 200
(1 row)`,
        explain: '`LOCK TABLE t IN ACCESS EXCLUSIVE MODE` claims the whole table for this transaction — but since there is no OTHER transaction contending for it here, the lock is acquired instantly with no wait, and the subsequent `UPDATE` and `COMMIT` proceed completely normally, leaving `n = 200` for `id = 1`.',
        explainHi: '`LOCK TABLE t IN ACCESS EXCLUSIVE MODE` is transaction ke liye poori table claim karta hai — par kyunki yahaan iske liye contend karne waala koi DOOSRA transaction nahi hai, lock bina wait ke turant acquire hota hai, aur uske baad ka `UPDATE` aur `COMMIT` poori tarah normally aage badते hain, `id = 1` ke liye `n = 200` chhodते hue.',
      },
    ],

    mistakes: [
      {
        wrong: `-- reading a row's value, then updating it based on that value, with no lock at all
-- "check current stock, then decrement it" -- vulnerable to a lost update if two
-- transactions both read the same starting quantity before either writes
BEGIN;
SELECT qty FROM inventory WHERE sku = 'A1';   -- sees 1 (the last unit)
-- ... application code decides "qty > 0, so proceed with the sale" ...
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;
-- if a SECOND concurrent transaction also read qty = 1 before this one committed,
-- BOTH transactions proceed with the sale -- the item gets oversold`,
        right: `BEGIN;
SELECT qty FROM inventory WHERE sku = 'A1' FOR UPDATE;   -- claims the row --
                                                          -- a concurrent transaction
                                                          -- doing the same now WAITS
-- ... application code decides "qty > 0, so proceed with the sale" ...
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
COMMIT;   -- only after this releases the lock can the second transaction's
          -- SELECT ... FOR UPDATE proceed, and it will see the ALREADY-DECREMENTED qty`,
        why: 'A plain SELECT with no locking clause does not prevent another transaction from also reading the same row and making a decision based on the same, now-stale, value; both transactions can see the same starting quantity, both independently conclude the sale is valid, and both commit, together selling more of the item than actually exists. This is the lost update problem, and it is precisely what FOR UPDATE is for: it claims an exclusive lock on the row the moment it is read with the intent to change it, so a second transaction attempting the same read-then-decide-then-update sequence on the same row must wait until the first one has fully committed, at which point it sees the already-updated quantity rather than the stale one, and can correctly detect that the item is no longer available.',
        whyHi: 'Ek plain `SELECT` bina locking clause ke ek doosre transaction ko usī row padhने aur usī, ab-stale, value ke aadhaar par ek decision lene se nahi rokта; dono transactions usī starting quantity dekh sakte hain, dono independently conclude karте hain ki sale valid hai, aur dono commit karте hain, saath item ko usse zyada bech dete hain jitna asal mein exist karta hai. Ye lost update problem hai, aur `FOR UPDATE` theek isके liye hai: ye row par ek exclusive lock claim karta hai jis pal ise badalne ke iraade se padha jaता hai, to usī row par doosri koshish tab tak wait karti hai jab tak pehli poori tarah commit na ho jaye.',
      },
      {
        wrong: `-- using FOR UPDATE for every SELECT "just to be safe", even read-only reports
BEGIN;
SELECT * FROM orders WHERE customer_id = 42 FOR UPDATE;   -- a report, never updates anything
COMMIT;
-- this needlessly locks every returned row against concurrent writers for no reason,
-- potentially blocking legitimate updates elsewhere in the system`,
        right: `BEGIN;
SELECT * FROM orders WHERE customer_id = 42;   -- plain read -- MVCC (Lesson 4)
                                                -- already gives a consistent snapshot
COMMIT;
-- reserve FOR UPDATE specifically for transactions that will ALSO write to the
-- same rows they are reading, based on what they read`,
        why: 'FOR UPDATE exists to prevent other transactions from also claiming a row for change while the current transaction decides what to do with it based on what it just read; a read-only report that never writes to the rows it queries has no such conflict to prevent, so locking them provides no benefit and only creates an unnecessary point of contention with any other transaction that does need to update those same rows, potentially causing it to wait for no good reason. Plain MVCC already gives a report a perfectly consistent snapshot without any locking at all. FOR UPDATE should be reserved for the specific case it is designed for: a transaction that reads a row precisely because it intends to base a subsequent write on that value.',
        whyHi: '`FOR UPDATE` doosre transactions ko ek row ko badalne ke liye claim karne se rokने ke liye exist karta hai jab tak current transaction decide karta hai ki jo abhi padha uske aadhaar par kya karna hai; ek read-only report jo query kiye gaye rows mein kabhi likhता nahi uske paas rokने ke liye aisa koi conflict nahi hai, to unhe lock karna koi benefit nahi deta aur sirf ek unnecessary point of contention banata hai. Plain MVCC pehle se ek report ko bina kisī locking ke ek poori tarah consistent snapshot deता hai.',
      },
      {
        wrong: `-- several workers polling a job queue WITHOUT skip locked -- they queue up behind
-- whichever worker got there first, defeating the purpose of having multiple workers
BEGIN;
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE;   -- no SKIP LOCKED
-- worker 2's identical query now WAITS for worker 1's transaction to finish,
-- even though there are OTHER pending jobs it could have grabbed instead`,
        right: `BEGIN;
SELECT * FROM job_queue WHERE status = 'pending'
  ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
-- worker 2 skips the row worker 1 already claimed and grabs the NEXT pending job
-- instead of waiting -- both workers proceed concurrently`,
        why: 'Without SKIP LOCKED, a FOR UPDATE query that would return an already-locked row simply waits for that lock to be released, which means a second worker running the identical query to claim "the next job" queues up behind whichever worker happened to lock that specific row first, even when other, entirely unclaimed pending jobs exist that it could have taken instead. This turns what was meant to be several workers processing a queue in parallel into an accidental single-file line. Adding SKIP LOCKED tells PostgreSQL to silently pass over any row that is already locked by another transaction and return the next one that is not, which is exactly the behavior a multi-worker queue needs: each worker ends up claiming a different available job rather than contending for the same one.',
        whyHi: 'Bina `SKIP LOCKED` ke, ek `FOR UPDATE` query jo ek pehle se locked row lौtाती us lock ke release hone ka wait karti hai, jiska matlab hai doosra worker jo "agली job" claim karne ke liye identical query chalाता hai us worker ke peeche line mein lag jaта hai jisne pehle wo specific row lock ki thi, chahe doosri, poori tarah unclaimed pending jobs exist karti hon. `SKIP LOCKED` add karna PostgreSQL ko bataता hai ki kisī bhi pehle se locked row ko chupchaap skip karo aur agली wo lौtaओ jo nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**`SELECT ... FOR UPDATE` around every "check stock, then decrement" flow in an e-commerce checkout** — the standard defence against overselling the last unit of a limited-stock item.',
        hi: '**Ek e-commerce checkout mein har "stock check karo, phir decrement karो" flow ke aas-paas `SELECT ... FOR UPDATE`** — limited-stock item ki aakhri unit oversell hone ke against standard defence.',
      },
      {
        en: '**`FOR UPDATE SKIP LOCKED` as the standard building block for a PostgreSQL-backed job queue** (used by several popular queue libraries) rather than reaching for a separate message-queue system for simple background-job dispatch.',
        hi: '**Ek PostgreSQL-backed job queue ke liye standard building block ke roop mein `FOR UPDATE SKIP LOCKED`**.',
      },
      {
        en: '**`LOCK TABLE ... IN ACCESS EXCLUSIVE MODE` wrapped around a rare, large-scale data-migration script** that must not run concurrently with any application traffic touching that table.',
        hi: '**Ek rare, large-scale data-migration script ke aas-paas `LOCK TABLE ... IN ACCESS EXCLUSIVE MODE` wrap kiya gaya**.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does `SELECT ... FOR UPDATE` solve that plain MVCC does not?',
        qHi: '`SELECT ... FOR UPDATE` kaunसी problem solve karta hai jo plain MVCC nahi karta?',
        a: 'MVCC guarantees that a transaction reading a row sees a consistent snapshot and is never blocked by, or blocks, other transactions reading or writing that row independently. What it does not guarantee is that between the moment one transaction reads a row with the intent to base a change on its value, and the moment it actually writes that change, no other transaction has also read the same row and independently decided on a conflicting change. Two transactions can both read the same starting quantity, both conclude a sale is valid, and both commit a decrement, oversell an item, without either one ever seeing the other\'s uncommitted work, which MVCC alone does nothing to prevent. SELECT with FOR UPDATE closes this gap by acquiring an exclusive row-level lock on the returned rows at the moment they are read, so any other transaction attempting the same claim-a-row-with-intent-to-change-it operation on the same row must wait until the first transaction commits or rolls back, at which point it sees the already-updated value rather than the stale one it would otherwise have read. This is a deliberate, pessimistic choice to prevent a specific class of conflict rather than merely detect it afterward.',
        aHi: 'MVCC guarantee karta hai ki ek row padhने waala transaction ek consistent snapshot dekhta hai aur kabhi doosre transactions se blocked nahi hota jo independently us row ko padh ya likh rahe hain. Ye guarantee nahi karta ki ek transaction ke ek row ko iske value par ek change base karne ke iraade se padhने ke pal se, aur asal mein wo change likhne ke pal ke beech, koi doosra transaction bhi usī row ko padhkar independently ek conflicting change decide nahi kar chuka. Do transactions dono usī starting quantity dekh sakte hain, dono ek sale valid conclude karte hain, aur dono ek decrement commit karте hain. `FOR UPDATE` waale `SELECT` se ye gap band hota hai ek exclusive row-level lock acquire karके returned rows par jis pal wo padhे jaते hain.',
      },
      {
        q: 'When would you use `SKIP LOCKED` versus `NOWAIT`, and what is the risk of using `FOR UPDATE` on rows you never actually update?',
        qHi: 'Aap `SKIP LOCKED` versus `NOWAIT` kab istemal karте ho, aur un rows par `FOR UPDATE` istemal karne ka risk kya hai jinhe aap kabhi asal mein update nahi karte?',
        a: 'Both SKIP LOCKED and NOWAIT are alternatives to the default behavior of simply waiting, potentially for a long time, for a lock held by another transaction to be released. SKIP LOCKED is right when any equivalent row will do, the canonical case being a job queue where several workers are each trying to claim the next available item: if a specific row is already locked by another worker, there is no reason to wait for it, since a different, equally valid pending job is likely available, so skipping over locked rows and returning the next unlocked one lets multiple workers make progress concurrently instead of forming an accidental single-file line. NOWAIT is right when the calling code has a specific, immediate response to "someone else is already handling this exact row" and does not want to wait an indeterminate amount of time to find out; rather than blocking, it fails right away with an error the caller can catch and act on. As for using FOR UPDATE on rows you never actually update, the risk is unnecessary contention: acquiring a lock has a cost regardless of whether it is followed by a write, and locking rows purely defensively, for instance in a read-only report, provides no protective benefit for that report while creating a needless point of conflict with any other transaction that genuinely does need to update those same rows, potentially forcing it to wait for no real reason.',
        aHi: 'Dono `SKIP LOCKED` aur `NOWAIT` default behaviour ke alternatives hain jahaan bस wait kiya jaता hai. `SKIP LOCKED` sahi hai jab koi bhi equivalent row chalega, canonical case ek job queue hai jahaan kई workers har ek agली available item claim karne ki koshish kar rahe hain: agar ek specific row pehle se ek doosre worker dwara locked hai, iska wait karne ka koi kaaran nahi. `NOWAIT` sahi hai jab calling code ke paas "koi aur pehle se is exact row ko handle kar raha hai" ka ek specific, immediate response hai. `FOR UPDATE` un rows par istemal karne ka risk jinhe aap kabhi update nahi karte unnecessary contention hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `inventory(sku text PRIMARY KEY, qty int)` with one row `(\'A1\', 1)`. Write a transaction that `SELECT`s that row `FOR UPDATE`, then `UPDATE`s `qty` to `0`, then `COMMIT`s. Explain in a comment why claiming the row with `FOR UPDATE` before deciding whether to proceed with a sale prevents two concurrent transactions from both selling the last unit.',
        taskHi: 'Table `inventory(sku, qty)` ek row `(\'A1\', 1)` ke saath. Ek transaction likho jo us row ko `FOR UPDATE` `SELECT` karta hai, phir `qty` ko `0` `UPDATE` karta hai, phir `COMMIT` karta hai.',
        hint: '`FOR UPDATE` claims the row the instant it is read, so a second concurrent transaction attempting the same `SELECT ... FOR UPDATE` must wait until this one commits — at which point it will see `qty = 0` and correctly refuse the sale.',
        hintHi: '`FOR UPDATE` row ko turant claim karta hai jab ye padhi jaati hai, to ek doosra concurrent transaction wait karega jab tak ye commit na ho jaye — us point par ye `qty = 0` dekhega aur sahi se sale refuse karega.',
      },
      {
        task: 'Table `job_queue(id int PRIMARY KEY, status text)` with 3 rows, 2 `\'pending\'` and 1 `\'done\'`. Write a query that claims exactly ONE pending job (`ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED`), marks it `\'processing\'`, and confirm the other pending job is untouched.',
        taskHi: 'Table `job_queue(id, status)` 3 rows ke saath, 2 `\'pending\'` aur 1 `\'done\'`. Ek query likho jo theek EK pending job claim karti hai, ise `\'processing\'` mark karti hai.',
        hint: '`ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED` picks the lowest-id pending row (in a single-session test, nothing is actually locked by anyone else, so `SKIP LOCKED` has no visible effect here beyond confirming the syntax runs cleanly).',
        hintHi: '`ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED` sabse chhote-id waali pending row chunta hai.',
      },
      {
        task: 'Explain in a comment (no SQL needed) why a read-only reporting query, one that never writes to the table it queries, should NOT use `FOR UPDATE`, even "just to be safe".',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi) samjhaओ ki ek read-only reporting query, jo kabhi us table mein nahi likhती jise ye query karti hai, `FOR UPDATE` istemal KYUN nahi karnі chahiye, "safe rehne ke liye" bhi nahi.',
        hint: 'MVCC already gives the report a consistent snapshot with no locking needed. `FOR UPDATE` on rows never written to provides no benefit and only creates unnecessary contention with transactions that genuinely need to claim those rows for a change.',
        hintHi: 'MVCC pehle se report ko bina kisi locking ke ek consistent snapshot deta hai. Kabhi na likhe gaye rows par `FOR UPDATE` koi benefit nahi deta aur sirf unnecessary contention banata hai.',
      },
    ],

    keyTakeaways: [
      'MVCC (Lesson 4) alone does NOT prevent the LOST UPDATE problem: two transactions can both read the same row, both independently decide on a change based on the same (now-stale) value, and both commit — e.g. both overselling the last unit of stock. Explicit locking is the fix.',
      '`SELECT ... FOR UPDATE` claims an EXCLUSIVE row-level lock on returned rows, held until `COMMIT`/`ROLLBACK`. Blocks other transactions from ALSO claiming the SAME row for a change (`FOR UPDATE`/`UPDATE`/`DELETE`) — but does NOT block an ordinary `SELECT` with no locking clause (MVCC still lets plain readers proceed).',
      '`FOR SHARE` is a LIGHTER lock: blocks a concurrent `FOR UPDATE`/`UPDATE`/`DELETE`, but PERMITS other transactions to also hold `FOR SHARE` on the same row simultaneously — many readers, at most one changer.',
      '`SKIP LOCKED` (added to `FOR UPDATE`/`FOR SHARE`): if a row is already locked by another transaction, silently SKIP it and return the next available one instead of waiting. THE standard building block for a multi-worker job queue — each worker claims a DIFFERENT job, none ever queues behind another.',
      '`NOWAIT`: fails IMMEDIATELY with an error if the row is already locked, instead of waiting (default) or skipping (`SKIP LOCKED`) — for code with a specific fallback for "someone else already has this".',
      '`LOCK TABLE ... IN mode` claims the WHOLE table, not just specific rows — for rare bulk operations that must not interleave with ANY concurrent activity on that table. `ACCESS EXCLUSIVE` is the strongest mode (conflicts with everything, including plain reads) — the same lock category `ALTER TABLE` (Module 8) acquires internally.',
      'Everything in this lesson is PESSIMISTIC concurrency control: assume a conflict is likely, prevent it up front by claiming the row/table before acting. Reserve `FOR UPDATE` for transactions that will ALSO write based on what they read — using it on rows you never update (e.g. a read-only report) creates needless contention for zero benefit. The alternative — optimistic concurrency, detecting conflicts after the fact instead of locking upfront — is Lesson 6.',
    ],
    keyTakeawaysHi: [
      'MVCC (Lesson 4) akela LOST UPDATE problem nahi rokta: do transactions dono usī row padh sakte hain, dono independently usī (ab-stale) value ke aadhaar par ek change decide karте hain, aur dono commit karte hain. Explicit locking fix hai.',
      '`SELECT ... FOR UPDATE` returned rows par ek EXCLUSIVE row-level lock claim karta hai, `COMMIT`/`ROLLBACK` tak hold ki gayi. Doosre transactions ko SAME row ko badalne ke liye claim karne se rokta hai — par ek ordinary `SELECT` ko block NAHI karta.',
      '`FOR SHARE` ek LIGHTER lock hai: ek concurrent `FOR UPDATE`/`UPDATE`/`DELETE` block karta hai, par doosre transactions ko usī row par saath `FOR SHARE` hold karne PERMIT karta hai.',
      '`SKIP LOCKED` (`FOR UPDATE`/`FOR SHARE` mein add): agar ek row pehle se doosre transaction dwara locked hai, chupchaap ise SKIP karo aur wait karne ke bajaye agli available lौtaओ. Multi-worker job queue ke liye standard building block.',
      '`NOWAIT`: agar row pehle se locked hai TURANT ek error ke saath fail hota hai, wait (default) ya skip (`SKIP LOCKED`) karne ke bajaye.',
      '`LOCK TABLE ... IN mode` POORI table claim karta hai, sirf specific rows nahi. `ACCESS EXCLUSIVE` sabse strong mode hai.',
      'Is lesson mein sab kuch PESSIMISTIC concurrency control hai: maano ek conflict likely hai, ise upfront rokо. `FOR UPDATE` un transactions ke liye rakhо jo jo padha uske aadhaar par BHI likhenge. Alternative — optimistic concurrency — Lesson 6 hai.',
    ],
  },

  {
    slug: 'sql-deadlocks-and-concurrency-strategies',
    title: 'Deadlocks & Choosing a Concurrency Strategy',
    titleHi: 'Deadlocks Aur Ek Concurrency Strategy Chunна',
    description: 'Two transactions can each hold a lock the other one needs, waiting forever — a deadlock. PostgreSQL detects this automatically and aborts one side. This closing lesson also covers advisory locks and the decision between pessimistic locking (Lesson 5) and optimistic concurrency control.',
    descriptionHi: 'Do transactions har ek ek aisा lock hold kar sakte hain jo doosre ko chahiye, hamesha ke liye wait karте hue — ek deadlock. PostgreSQL ise automatically detect karta hai aur ek side abort karta hai. Ye closing lesson advisory locks aur pessimistic locking (Lesson 5) vs optimistic concurrency control ke beech ka decision bhi cover karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Two cars facing each other on a one-lane bridge, each one waiting for the other to reverse first — until a traffic officer arrives and orders one of them back.** Car A has already driven onto the bridge and is blocking the space Car B needs; Car B has already driven onto the *other* end and is blocking the space Car A needs to reverse into. Neither driver is doing anything wrong in isolation — each is simply waiting for the other to clear the way — but together they will sit there forever unless something breaks the standoff. This is a **deadlock**: transaction A holds a lock transaction B is waiting for, while B holds a lock A is waiting for, and neither can proceed. A real traffic officer watching the bridge would notice the standoff and simply order one car to back up, clearing the way for the other to pass, even though that driver did nothing wrong — PostgreSQL plays exactly this role automatically: it watches for this exact circular waiting pattern, and the moment it detects one, it picks one of the two transactions and forces it to fail with a "deadlock detected" error, freeing the other to proceed. The chosen application code is expected to treat this the way a driver treats being waved backward by an officer — not a bug to panic over, but a normal, anticipated outcome to retry from.',
      hi: '**Ek single-lane bridge par ek doosre ke saamne do cars, har ek doosre ke pehle reverse karne ka wait kar rahi hai — jab tak ek traffic officer nahi aata aur unmein se ek ko wapas jaने ka order deता hai.** Car A pehle se bridge par chad chuki hai aur us space ko block kar rahi hai jo Car B ko chahiye; Car B pehle se *doosre* end par chad chuki hai aur us space ko block kar rahi hai jismein Car A ko reverse karna hai. Koi bhi driver isolation mein kuch galat nahi kar raha — har ek bस doosre ke raasta clear karne ka wait kar raha hai — par saath wo hamesha ke liye wahaan baithe rahенge jab tak kuch standoff na tode. Ye ek **deadlock** hai: transaction A ek lock hold karta hai jiska transaction B wait kar raha hai, jabki B ek lock hold karta hai jiska A wait kar raha hai, aur koi bhi aage nahi badh sakta. Bridge dekh rahi ek real traffic officer standoff notice karегi aur bस ek car ko wapas jане ka order degi. PostgreSQL theek yahi role automatically nibhata hai: ye is exact circular waiting pattern ko dekhता hai, aur jis pal ye ek pakड़ता hai, ye do transactions mein se ek chunta hai aur use ek "deadlock detected" error ke saath fail hone par majboor karta hai.',
    },

    simple: `**A deadlock: two transactions each waiting on a lock the other holds**

\`\`\`
Transaction A:  LOCKS row 1, then tries to lock row 2 (held by B) -- waits
Transaction B:  LOCKS row 2, then tries to lock row 1 (held by A) -- waits
-- neither can EVER proceed -- a true circular wait
\`\`\`

**PostgreSQL detects this automatically and aborts ONE side**

\`\`\`sql
-- one of the two transactions receives:
-- ERROR: deadlock detected
-- DETAIL: Process ... waits for ShareLock on transaction ...; blocked by process ...
--         Process ... waits for ShareLock on transaction ...; blocked by process ...
-- the OTHER transaction, now unblocked, proceeds normally
\`\`\`

**Application code must treat "deadlock detected" as a normal, retry-able outcome**

\`\`\`
try:
    run the transaction
except DeadlockDetected:
    retry the WHOLE transaction from the beginning (the conflict is usually gone)
\`\`\`

**Reducing deadlock risk: always acquire locks in the SAME order**

\`\`\`
-- if EVERY transaction that touches both row 1 and row 2 always locks
-- row 1 FIRST, then row 2 -- a circular wait becomes structurally impossible
\`\`\`

**Advisory locks: application-defined locks with no table/row attached**

\`\`\`sql
SELECT pg_try_advisory_lock(42);     -- true: acquired (returns immediately, never waits)
SELECT pg_try_advisory_lock(42);     -- true again: PostgreSQL advisory locks are
                                       -- reentrant within the SAME session
SELECT pg_advisory_unlock(42);       -- true: released one nested acquisition
SELECT pg_advisory_unlock(42);       -- true: released the other
SELECT pg_advisory_unlock(42);       -- false: none left to release
\`\`\`

**Optimistic vs pessimistic concurrency — the final decision**

\`\`\`sql
-- PESSIMISTIC (Lesson 5): lock the row up front, assuming a conflict is LIKELY
SELECT * FROM doc WHERE id = 1 FOR UPDATE;

-- OPTIMISTIC: don't lock anything -- just check a version column at UPDATE time,
-- assuming a conflict is RARE
UPDATE doc SET body = 'edited', version = version + 1
  WHERE id = 1 AND version = 1;        -- 0 rows affected = someone else won the race
                                        --   (application must re-read and retry)
\`\`\`

**Choosing between them**

\`\`\`
conflicts common, contention expected      -> PESSIMISTIC (FOR UPDATE) -- prevent it up front
conflicts rare, most transactions succeed  -> OPTIMISTIC (version column) -- cheaper when
                                               nothing usually collides, detect + retry when it does
\`\`\``,

    simpleHi: `**Ek deadlock: do transactions har ek us lock ka wait kar rahе hain jo doosra hold karta hai**

\`\`\`
Transaction A:  row 1 LOCK karta hai, phir row 2 lock karne ki koshish (B ke paas) -- wait karta hai
Transaction B:  row 2 LOCK karta hai, phir row 1 lock karne ki koshish (A ke paas) -- wait karta hai
-- koi bhi KABHI aage nahi badh sakta -- ek true circular wait
\`\`\`

**PostgreSQL ise automatically detect karta hai aur EK side abort karta hai**

\`\`\`sql
-- do transactions mein se ek ko milta hai:
-- ERROR: deadlock detected
-- doosra transaction, ab unblocked, normally aage badता hai
\`\`\`

**Application code ko "deadlock detected" ko ek normal, retry-able outcome ki tarah treat karna chahiye**

\`\`\`
try:
    transaction chalao
except DeadlockDetected:
    poori transaction shuru se retry karo (conflict usually gaya hota hai)
\`\`\`

**Deadlock risk kam karna: hamesha SAME order mein locks acquire karo**

\`\`\`
-- agar HAR transaction jo row 1 aur row 2 dono touch karta hai hamesha
-- row 1 PEHLE lock karta hai, phir row 2 -- ek circular wait structurally impossible ban jata hai
\`\`\`

**Advisory locks: koi table/row attached nahi waale application-defined locks**

\`\`\`sql
SELECT pg_try_advisory_lock(42);     -- true: acquired
SELECT pg_try_advisory_lock(42);     -- true dobara: PostgreSQL advisory locks
                                       -- SAME session ke andar reentrant hain
SELECT pg_advisory_unlock(42);       -- true: ek nested acquisition release
SELECT pg_advisory_unlock(42);       -- true: doosra release
SELECT pg_advisory_unlock(42);       -- false: release karne ke liye koi bacha nahi
\`\`\`

**Optimistic vs pessimistic concurrency — final decision**

\`\`\`sql
-- PESSIMISTIC (Lesson 5): row ko upfront lock karo, maान ke ki conflict LIKELY hai
SELECT * FROM doc WHERE id = 1 FOR UPDATE;

-- OPTIMISTIC: kuch lock mat karo -- bas UPDATE time par ek version column check karo,
-- maान ke ki conflict RARE hai
UPDATE doc SET body = 'edited', version = version + 1
  WHERE id = 1 AND version = 1;        -- 0 rows affected = koi aur race jeeta
\`\`\`

**Inके beech chunна**

\`\`\`
conflicts common, contention expected      -> PESSIMISTIC (FOR UPDATE)
conflicts rare, zyadатार transactions succeed -> OPTIMISTIC (version column)
\`\`\``,

    content: `## What a deadlock is

A **deadlock** happens when two (or more) transactions each hold a lock the other needs, and each is waiting for the other to release it — a circular wait with no way out on its own:

\`\`\`
Transaction A: locks row 1, then requests a lock on row 2 -- but B already holds it
Transaction B: locks row 2, then requests a lock on row 1 -- but A already holds it
\`\`\`

Neither transaction did anything individually wrong; each simply acquired locks in a different order than the other, and their requests happened to interleave into a cycle. Without intervention, both would wait forever.

## PostgreSQL detects and breaks deadlocks automatically

PostgreSQL periodically checks for exactly this circular-wait pattern among currently blocked transactions. The moment it confirms one exists, it picks one of the transactions in the cycle and forcibly aborts it with:

\`\`\`
ERROR: deadlock detected
DETAIL: Process ... waits for ShareLock on transaction ...; blocked by process ...
        Process ... waits for ShareLock on transaction ...; blocked by process ...
\`\`\`

The chosen transaction's locks are released, which frees the other transaction(s) in the cycle to proceed normally. This is automatic and requires no configuration — but it does mean application code that runs transactions capable of deadlocking must be prepared to receive this specific error and treat it as an expected, retry-able outcome, not a fatal bug: the standard response is to roll back and retry the entire transaction from its start, at which point the conflicting access pattern has usually resolved itself.

## Reducing deadlock risk: consistent lock ordering

The most reliable way to prevent deadlocks between transactions that need to lock the same multiple rows is to make sure **every transaction acquires those locks in the same order**. If every transaction that touches both "row 1" and "row 2" always locks row 1 first and row 2 second, a circular wait becomes structurally impossible — there is no way for one transaction to be holding row 2 while waiting for row 1, if nothing ever acquires row 2 before row 1. This is a discipline enforced by code review and convention, not something the database can verify for you.

## Advisory locks

An **advisory lock** is a lock with **no attached table or row** — just an application-chosen integer key that the application itself gives meaning to. PostgreSQL tracks whether it is held or not, but does not connect it to any specific data; it is purely a coordination signal between transactions or sessions that agree on what the key means.

\`\`\`sql
SELECT pg_try_advisory_lock(42);   -- true: acquired immediately, or false if someone else holds it
SELECT pg_advisory_unlock(42);     -- releases it
SELECT pg_advisory_lock(42);       -- like pg_try_advisory_lock, but WAITS instead of returning false
\`\`\`

Advisory locks are session-level and **reentrant**: acquiring the same key twice from the same session succeeds both times, and it takes two matching \`pg_advisory_unlock\` calls to fully release it. Use them for coordination that has no natural row to attach a lock to — for example, ensuring only one instance of a scheduled maintenance job runs at a time across multiple application servers, where there is no single database row that job "owns".

## Optimistic vs pessimistic concurrency — the final decision

Lesson 5 introduced **pessimistic** concurrency: assume a conflict is likely, so claim the row with \`FOR UPDATE\` before deciding what to do with it, making any competitor wait. The alternative is **optimistic** concurrency: assume a conflict is rare, do not lock anything up front, and instead detect after the fact whether one occurred, by including a version (or timestamp) column and checking it as part of the \`UPDATE\`:

\`\`\`sql
CREATE TABLE doc (id int PRIMARY KEY, body text, version int NOT NULL DEFAULT 1);

-- read the current version along with the data
SELECT body, version FROM doc WHERE id = 1;   -- got version = 1

-- write back, conditioned on the version being UNCHANGED since you read it
UPDATE doc SET body = 'edited', version = version + 1
  WHERE id = 1 AND version = 1;
-- if this affects 1 row: your write succeeded, nobody else got there first
-- if this affects 0 rows: someone else updated the row (and its version) since you
--   read it -- your application must re-read the current value and retry, or
--   surface a conflict to the user ("this document changed since you opened it")
\`\`\`

No lock is held between the read and the write — any number of other transactions can read and even attempt to write the same row in between. The \`WHERE version = 1\` clause is what detects a collision: if another transaction's write already advanced the version, this \`UPDATE\` simply matches zero rows instead of raising an error, and the application checks the affected-row count to know whether its optimistic assumption held.

### Choosing between them

- **Pessimistic (\`FOR UPDATE\`)**: right when conflicts are common enough that preventing them up front is worth the cost of making competing transactions wait — a limited-stock item near a flash sale, a shared counter under heavy concurrent load.
- **Optimistic (version column)**: right when most transactions do **not** actually conflict, and paying a locking cost on every single read-then-write would be wasted overhead most of the time — a user editing a document that only they, in practice, ever touch at once, where an occasional detected conflict is rare and acceptable to handle with a retry or a "someone else changed this" message.

Both strategies solve the same underlying problem — two transactions racing to change the same data — from opposite assumptions about how often that race actually happens. Together with Lesson 5's explicit locking, they complete Module 9's toolkit: ACID and the transaction boundary (Lesson 1), savepoints for partial recovery (Lesson 2), isolation levels tuning how much interleaving is visible (Lesson 3), MVCC as the storage mechanism underneath all of it (Lesson 4), and now the two concurrency-control philosophies for actually coordinating concurrent writers. Module 10 turns to indexes and query performance — how PostgreSQL finds rows quickly, which is the other half of making a schema like this one actually fast under real load.`,

    contentHi: `## Ek deadlock kya hai

Ek **deadlock** tab hota hai jab do (ya zyada) transactions har ek ek aisa lock hold karte hain jo doosre ko chahiye, aur har ek doosre ke ise release karne ka wait kar raha hai — ek circular wait jiska apne aap koi raasta bahar nahi hai:

\`\`\`
Transaction A: row 1 lock karta hai, phir row 2 par ek lock request karta hai -- par B pehle se hold karta hai
Transaction B: row 2 lock karta hai, phir row 1 par ek lock request karta hai -- par A pehle se hold karta hai
\`\`\`

Koi bhi transaction individually kuch galat nahi kar raha; har ek ne bस locks doosre se alag order mein acquire kiye, aur unki requests ek cycle mein interleave ho gayi. Bina intervention ke, dono hamesha wait karте.

## PostgreSQL deadlocks ko automatically detect aur break karta hai

PostgreSQL periodically currently blocked transactions ke beech theek is circular-wait pattern ke liye check karta hai. Jis pal ye confirm karta hai ki ek exist karta hai, ye cycle mein se ek transaction chunta hai aur ise forcibly abort karta hai:

\`\`\`
ERROR: deadlock detected
\`\`\`

Chune gaye transaction ke locks release ho jaते hain, jo cycle mein doosre transaction(s) ko normally aage badने ke liye free karta hai. Ye automatic hai aur koi configuration nahi chahiye — par iska matlab hai ki application code jo aise transactions chalाता hai jo deadlock kar sakte hain use ye specific error receive karne ke liye taiyार hona chahiye aur ise ek expected, retry-able outcome ki tarah treat karna chahiye, ek fatal bug nahi.

## Deadlock risk kam karna: consistent lock ordering

Usī multiple rows ko lock karने ki zaroorat waale transactions ke beech deadlocks rokने ka sabse reliable tarika ye pakka karna hai ki **har transaction un locks ko usī order mein acquire karta hai**. Agar har transaction jo "row 1" aur "row 2" dono touch karta hai hamesha pehle row 1 aur phir row 2 lock karta hai, ek circular wait structurally impossible ban jaता hai.

## Advisory locks

Ek **advisory lock** ek lock hai jiske saath **koi table ya row attached nahi** — sirf ek application-chosen integer key jise application khud meaning deta hai.

\`\`\`sql
SELECT pg_try_advisory_lock(42);   -- true: turant acquired, ya false agar koi aur hold karta hai
SELECT pg_advisory_unlock(42);     -- ise release karta hai
\`\`\`

Advisory locks session-level aur **reentrant** hain: usी session se usī key ko do baar acquire karna dono baar succeed hota hai, aur ise poori tarah release karne ke liye do matching \`pg_advisory_unlock\` calls chahिए.

## Optimistic vs pessimistic concurrency — final decision

Lesson 5 ne **pessimistic** concurrency introduce ki: maано ki ek conflict likely hai, to \`FOR UPDATE\` se row claim karो. Alternative **optimistic** concurrency hai: maано ki ek conflict rare hai, kuch upfront lock mat karo, aur iske bजाy baad mein detect karo ki ek hua ya nahi, ek version column include karके aur ise \`UPDATE\` ke hisse ke roop mein check karके:

\`\`\`sql
CREATE TABLE doc (id int PRIMARY KEY, body text, version int NOT NULL DEFAULT 1);

SELECT body, version FROM doc WHERE id = 1;   -- version = 1 mila

UPDATE doc SET body = 'edited', version = version + 1
  WHERE id = 1 AND version = 1;
-- agar ye 1 row affect karta hai: aapka write succeed hua
-- agar ye 0 rows affect karta hai: kisī aur ne aapke padhने ke baad row update kiya
\`\`\`

Padhने aur likhने ke beech koi lock hold nahi ki jaती — koi bhi sankhya mein doosre transactions beech mein usī row padh sakte hain aur likhने ki koshish bhi kar sakte hain.

### Inके beech chunна

- **Pessimistic (\`FOR UPDATE\`)**: sahi hai jab conflicts itne common hain ki unhe upfront rokна worth hai.
- **Optimistic (version column)**: sahi hai jab zyadатार transactions asal mein conflict NAHI karte.

Dono strategies wahi underlying problem solve karте hain — do transactions usī data badalने ke liye race kar rahe hain — opposite assumptions se ki wo race asal mein кितnи baar hoती hai. Module 10 indexes aur query performance ki taraf jाता hai.`,

    examples: [
      {
        title: 'Advisory locks are reentrant within one session: acquiring and releasing the same key twice',
        titleHi: 'Advisory locks ek session ke andar reentrant hain: usi key ko do baar acquire aur release karna',
        code: `SELECT pg_try_advisory_lock(42);
SELECT pg_try_advisory_lock(42);
SELECT pg_advisory_unlock(42);
SELECT pg_advisory_unlock(42);
SELECT pg_advisory_unlock(42);`,
        output: ` pg_try_advisory_lock
----------------------
 t
(1 row)

 pg_try_advisory_lock
----------------------
 t
(1 row)

 pg_advisory_unlock
--------------------
 t
(1 row)

 pg_advisory_unlock
--------------------
 t
(1 row)

 pg_advisory_unlock
--------------------
 f
(1 row)`,
        explain: "`pg_try_advisory_lock(42)` succeeds twice in a row from the SAME session, because PostgreSQL's advisory locks are reentrant per session — each acquisition is tracked separately. It then takes two matching `pg_advisory_unlock(42)` calls to actually release the lock (each returning `t` for the nested lock it releases); a THIRD unlock call finds nothing left to release and correctly returns `f`.",
        explainHi: '`pg_try_advisory_lock(42)` SAME session se ek ke baad ek do baar succeed hota hai, kyunki PostgreSQL ke advisory locks prati session reentrant hain — har acquisition alag se track hoti hai. Phir ise lock ko asal mein release karne ke liye do matching `pg_advisory_unlock(42)` calls chahiye (har ek `t` lautाते hue jis nested lock ko ye release karta hai); ek TEESRI unlock call ko release karne ke liye kuch nahi milta aur ye sahi se `f` lautaती hai.',
      },
      {
        title: 'Optimistic concurrency: a version-mismatched UPDATE affects zero rows instead of erroring',
        titleHi: 'Optimistic concurrency: ek version-mismatched UPDATE error dene ke bajaye zero rows affect karta hai',
        code: `CREATE TABLE doc (id int PRIMARY KEY, body text, version int NOT NULL DEFAULT 1);
INSERT INTO doc VALUES (1, 'draft', 1);

-- a successful optimistic update: version matches, so it applies and advances
UPDATE doc SET body = 'edited', version = version + 1 WHERE id = 1 AND version = 1;
SELECT * FROM doc;`,
        output: ` id | body   | version
----+--------+---------
 1  | edited | 2
(1 row)`,
        explain: "The `WHERE id = 1 AND version = 1` clause matches the row exactly as expected — nobody else has touched it since it was created at `version = 1` — so this optimistic update applies cleanly: `body` becomes `'edited'` and `version` advances to `2`, recorded as the new current state.",
        explainHi: "`WHERE id = 1 AND version = 1` clause row ko theek expected ke roop mein match karta hai — kisī aur ne ise touch nahi kiya jab se ye `version = 1` par create hua tha — to ye optimistic update cleanly apply hota hai: `body` `'edited'` ban jaता hai aur `version` `2` tak advance hota hai, naye current state ke roop mein recorded.",
      },
      {
        title: 'A stale optimistic update (wrong version) matches no rows and leaves the data untouched',
        titleHi: 'Ek stale optimistic update (galat version) koi row match nahi karta aur data untouched chhodta hai',
        code: `CREATE TABLE doc (id int PRIMARY KEY, body text, version int NOT NULL DEFAULT 1);
INSERT INTO doc VALUES (1, 'edited', 2);   -- someone already advanced it to version 2

-- this UPDATE assumes it is still at version 1 -- it is not, so the WHERE matches nothing
UPDATE doc SET body = 'stale edit', version = version + 1 WHERE id = 1 AND version = 1;
SELECT * FROM doc;`,
        output: ` id | body   | version
----+--------+---------
 1  | edited | 2
(1 row)`,
        explain: "The row's real `version` is already `2` (someone else already applied their update), but this stale `UPDATE` still checks `version = 1` in its `WHERE` clause — which no longer matches anything. The statement affects zero rows and leaves the row exactly as it was (`body = 'edited'`, `version = 2`), silently signalling to the application that its assumed starting state was out of date.",
        explainHi: "Row ka real `version` pehle se `2` hai (kisī aur ne pehle se apna update apply kar diya), par ye stale `UPDATE` abhi bhi apne `WHERE` clause mein `version = 1` check karta hai — jo ab kuch bhi match nahi karta. Statement zero rows affect karta hai aur row ko theek waisा chhoड़ता hai jaisा tha (`body = 'edited'`, `version = 2`), application ko chupchaap signal karte hue ki iska maана gaya starting state out of date thā.",
      },
    ],

    mistakes: [
      {
        wrong: `-- SESSION A                                  -- SESSION B (concurrent, illustrative)
BEGIN;                                          BEGIN;
UPDATE acct SET bal = bal - 100 WHERE id = 1;    UPDATE acct SET bal = bal - 50 WHERE id = 2;
  -- A now holds a lock on row 1                    -- B now holds a lock on row 2
UPDATE acct SET bal = bal + 100 WHERE id = 2;    UPDATE acct SET bal = bal + 50 WHERE id = 1;
  -- A waits for B's lock on row 2 ...                -- B waits for A's lock on row 1 ...
  -- ... a DEADLOCK -- PostgreSQL aborts ONE of these two transactions automatically`,
        right: `-- fix: EVERY transaction touching both accounts locks them in the SAME order,
-- e.g. always the lower account id first:
BEGIN;
UPDATE acct SET bal = bal - 100 WHERE id = LEAST(1, 2);   -- always id 1 first
UPDATE acct SET bal = bal + 100 WHERE id = GREATEST(1, 2); -- then id 2
COMMIT;
-- if EVERY transfer transaction follows this same ordering rule, a circular
-- wait becomes structurally impossible`,
        why: 'The deadlock here arises purely from the two transactions locking the same two rows in opposite orders: A takes row 1 then wants row 2, while B takes row 2 then wants row 1, so each ends up waiting on the other with no way forward. Neither transaction is individually incorrect, and the specific pair of accounts involved could be any two accounts in the system, so this is not something you can fix by special-casing one pair. The reliable fix is a project-wide convention: every transaction that needs to lock more than one row from the same table always acquires those locks in a single, consistent order, for instance always the numerically lower id first. If every transaction follows that rule, it becomes structurally impossible for two of them to form a circular wait, because whichever one reaches the lower-id row first will always be the one proceeding to the higher-id row next, never the reverse.',
        whyHi: 'Yahaan deadlock poori tarah do transactions se aaता hai jo usी do rows ko opposite orders mein lock karte hain: A row 1 leता hai phir row 2 chahता hai, jabki B row 2 leता hai phir row 1 chahता hai, to har ek doosre ka wait karta reh jाता hai. Koi bhi transaction individually galat nahi hai. Reliable fix ek project-wide convention hai: har transaction jise usī table se ek se zyada row lock karnі hai hamesha un locks ko ek single, consistent order mein acquire karta hai.',
      },
      {
        wrong: `-- treating "deadlock detected" as a fatal application error
try:
    run_transaction()
except Exception as e:
    log_error(e)
    raise   # crashes the request / shows the user a generic 500 error
    # ... even though the SAME transaction would likely succeed on retry`,
        right: `try:
    run_transaction()
except DeadlockDetected:
    # expected, occasional outcome under concurrent load -- retry the WHOLE
    # transaction from the start (often with a short backoff and a retry limit)
    retry_transaction()
except Exception as e:
    log_error(e)
    raise`,
        why: 'A deadlock is not a sign that anything is broken; it is PostgreSQL correctly detecting and resolving a circular wait that emerged from the timing of two otherwise-valid concurrent transactions, and it deliberately sacrifices one of them so the other can proceed. Treating this specific error the same as any other unexpected failure, logging it and propagating it as a fatal error, throws away a transaction that would very likely succeed if simply retried, since the specific interleaving that caused the deadlock has typically already been resolved by the time a retry runs. Well-behaved application code recognizes the deadlock error specifically and retries the entire transaction from its beginning, usually with a small number of attempts and a short delay between them, rather than surfacing it to the user or treating it as a bug to be fixed in the code.',
        whyHi: 'Ek deadlock ye sign nahi hai ki kuch toota hai; ye PostgreSQL ka sahi se ek circular wait detect aur resolve karna hai jo do otherwise-valid concurrent transactions ke timing se aaया. Is specific error ko kisī bhi doosre unexpected failure ki tarah treat karna ek transaction fenkta hai jo retry karne par likely succeed hota. Well-behaved application code deadlock error ko specifically pehchанta hai aur poori transaction ko iske shuru se retry karta hai.',
      },
      {
        wrong: `-- using an optimistic version check but forgetting to actually check the affected row count
UPDATE doc SET body = 'edited', version = version + 1 WHERE id = 1 AND version = 1;
-- application code proceeds as though the edit definitely succeeded, without checking
-- whether the UPDATE actually matched (and changed) a row`,
        right: `-- check the affected row count -- 0 means someone else's version won the race
result = execute("UPDATE doc SET body = %s, version = version + 1 WHERE id = 1 AND version = %s", ...)
if result.rowcount == 0:
    # re-read the current row and either retry with the new version, or tell the
    # user their edit conflicts with a newer one
    ...`,
        why: 'The entire mechanism of optimistic concurrency depends on checking whether the conditional UPDATE actually matched a row. Because the WHERE clause includes the version the application believes is current, if another transaction already advanced that version since this one read it, the UPDATE simply matches zero rows rather than raising any error, since matching zero rows for a WHERE condition is not itself a failure as far as the database is concerned. If the application does not check the number of rows the statement affected, it has no way to distinguish a successful edit from a silently-lost one, and will proceed as though the change was saved when it was not, potentially reporting success to a user whose edit was actually discarded.',
        whyHi: 'Optimistic concurrency ka poora mechanism is baat ko check karne par depend karta hai ki conditional `UPDATE` ne asal mein ek row match kiya ya nahi. Kyunki `WHERE` clause mein wo version hai jo application maанta hai current hai, agar ek doosre transaction ne pehle se wo version advance kar diya hai, `UPDATE` bस zero rows match karta hai koi error raise kiye bina. Agar application check nahi karti ki statement ne kितni rows affect kiya, iske paas ek successful edit ko ek chupchaap-lost edit se alag batане ka koi tarika nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**A funds-transfer function that always locks the lower account id first, regardless of which account is the source or destination** — a project-wide convention that eliminated an entire class of deadlocks under load.',
        hi: '**Ek funds-transfer function jo hamesha lower account id pehle lock karta hai**.',
      },
      {
        en: '**A collaborative document editor using a `version` column and reporting "this document was changed by someone else — reload to see the latest" instead of silently overwriting a concurrent edit.**',
        hi: '**Ek collaborative document editor jo ek `version` column istemal karta hai aur "ye document kisi aur ne badla — latest dekhne ke liye reload karo" report karta hai**.',
      },
      {
        en: '**A scheduled job runner using `pg_try_advisory_lock` at the start of its run** to guarantee only one instance executes at a time across several application servers, releasing it in a `finally` block regardless of success or failure.',
        hi: '**Ek scheduled job runner jo apne run ki shuruat mein `pg_try_advisory_lock` istemal karta hai** taaki kई application servers ke across ek waqt sirf ek instance chale.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a deadlock, how does PostgreSQL handle it, and how should application code respond?',
        qHi: 'Ek deadlock kya hai, PostgreSQL ise kaise handle karta hai, aur application code ko kaise respond karna chahiye?',
        a: 'A deadlock occurs when two or more transactions each hold a lock that another one in the group needs, and each is waiting for another to release its lock, forming a circular dependency with no way for any of them to proceed on their own. A common shape is two transactions each locking two of the same rows in opposite orders: one locks row one and then wants row two, while the other locks row two and then wants row one. PostgreSQL periodically checks for exactly this circular-wait pattern among currently blocked transactions, and the moment it confirms one exists, it selects one of the transactions in the cycle and forcibly aborts it with a deadlock detected error, which releases that transaction\'s locks and allows the remaining transaction or transactions in the cycle to proceed normally. This detection and resolution is automatic and needs no special configuration, but it does place a responsibility on application code: since one specific error can arise as a normal, expected consequence of concurrent load rather than a bug, well-behaved code catches that specific error and retries the entire transaction from the beginning, typically succeeding on the retry once the particular interleaving that caused the conflict has resolved itself, rather than treating it as a fatal failure to log and propagate.',
        aHi: 'Ek deadlock tab hota hai jab do ya zyada transactions har ek ek aisa lock hold karte hain jo group mein doosre ko chahiye, aur har ek doosre ke apna lock release karne ka wait kar raha hai, ek circular dependency banते hue jismein koi bhi apne aap aage nahi badh sakta. Ek common shape do transactions hain jo har ek usī do rows ko opposite orders mein lock karте hain. PostgreSQL periodically theek is circular-wait pattern ke liye check karta hai, aur jis pal ye confirm karta hai ki ek exist karta hai, ye cycle mein se ek transaction chunta hai aur ise ek deadlock detected error ke saath forcibly abort karta hai. Ye detection aur resolution automatic hai, par application code par ek responsibility daalता hai: well-behaved code us specific error ko catch karta hai aur poori transaction ko shuru se retry karta hai.',
      },
      {
        q: 'Compare pessimistic and optimistic concurrency control. When would you choose one over the other?',
        qHi: 'Pessimistic aur optimistic concurrency control compare karo. Aap ek ko doosre par kab chunoge?',
        a: 'Pessimistic concurrency control assumes conflicts between concurrent transactions are likely enough to be worth preventing before they can happen: a transaction claims an exclusive lock on a row, typically with select for update, the moment it reads that row with the intent to base a later change on it, and any other transaction attempting the same claim on the same row must wait until the first one finishes. Optimistic concurrency control makes the opposite assumption, that conflicts are rare, and avoids the cost of locking anything up front; instead, a version or timestamp column is included with the row, and when the application eventually writes its change, the update statement\'s where clause requires that version to still match what the application originally read. If another transaction has since changed the row, its version will have moved on, so the conditional update matches zero rows rather than raising an error, and the application detects this by checking the affected row count, then either retries by re-reading the current value or surfaces a conflict to the user. The choice comes down to how often conflicts actually occur and what locking costs you are willing to pay. When contention is genuinely common, a limited-stock item during a flash sale, or a heavily shared counter, pessimistic locking is worth its cost because it prevents the conflict outright rather than merely detecting it after wasted work. When most transactions in practice never actually collide, such as a document only its owner typically edits, optimistic concurrency avoids paying a locking cost on every single operation and only pays a retry cost on the rare occasion a real conflict occurs.',
        aHi: 'Pessimistic concurrency control maानta hai ki concurrent transactions ke beech conflicts itne likely hain ki unhe hone se pehle rokна worth hai: ek transaction ek row par ek exclusive lock claim karta hai, typically select for update se, jis pal ye us row ko baad mein ek change base karne ke iraade se padhta hai. Optimistic concurrency control ulта assumption banata hai, ki conflicts rare hain, aur kuch upfront lock karne ki cost avoid karta hai; iske bajay, row ke saath ek version ya timestamp column include kiya jaता hai. Choice is baat par nirbhar karta hai ki conflicts asal mein кितni baar hote hain. Jab contention genuinely common hai, pessimistic locking iski cost worth hai. Jab zyadатार transactions practice mein kabhi asal mein collide nahi karte, optimistic concurrency har single operation par ek locking cost pay karne se bachता hai.',
      },
    ],

    exercises: [
      {
        task: 'Run `SELECT pg_try_advisory_lock(100)` twice in the same session, then `SELECT pg_advisory_unlock(100)` three times. Confirm the pattern: `true, true, true, true, false` (two acquisitions, needing two releases, the third release finding nothing left).',
        taskHi: 'Usī session mein `SELECT pg_try_advisory_lock(100)` do baar chalao, phir `SELECT pg_advisory_unlock(100)` teen baar. Confirm karo pattern: `true, true, true, true, false`.',
        hint: 'Advisory locks are reentrant per session: acquiring the same key twice succeeds both times, and it takes two matching unlock calls to fully release it — a third unlock call finds nothing left to release.',
        hintHi: 'Advisory locks prati session reentrant hain: usi key ko do baar acquire karna dono baar succeed hota hai, aur ise poori tarah release karne ke liye do matching unlock calls chahiye.',
      },
      {
        task: 'Table `doc(id int PRIMARY KEY, body text, version int NOT NULL DEFAULT 1)` with one row `(1, \'v1\', 1)`. Run an optimistic `UPDATE ... WHERE id = 1 AND version = 1` that succeeds (confirm `version` becomes `2`). Then run the SAME `UPDATE` again with `version = 1` and confirm it now matches zero rows (the version has already moved on).',
        taskHi: 'Table `doc(id, body, version)` ek row `(1, \'v1\', 1)` ke saath. Ek optimistic `UPDATE ... WHERE id = 1 AND version = 1` chalao jo succeed hota hai. Phir SAME `UPDATE` dobara `version = 1` ke saath chalao aur confirm karo ye ab zero rows match karta hai.',
        hint: 'The first `UPDATE` matches (`version` was `1`) and advances it to `2`. The second, identical `UPDATE` no longer matches anything, because the row\'s real `version` is now `2`, not `1` — this zero-rows-affected outcome is exactly how the application would detect a lost race.',
        hintHi: 'Pehla `UPDATE` match karta hai (`version` `1` tha) aur ise `2` tak advance karta hai. Doosra, identical `UPDATE` ab kuch match nahi karta, kyunki row ka real `version` ab `2` hai, `1` nahi.',
      },
      {
        task: 'In a comment (no SQL needed), describe the consistent-lock-ordering fix for a deadlock between two transactions that each transfer funds between the same pair of accounts in opposite directions.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), do transactions ke beech ek deadlock ke liye consistent-lock-ordering fix describe karo jo har ek usī jodi ke accounts ke beech opposite directions mein funds transfer karte hain.',
        hint: 'If every transaction that touches both accounts always locks the numerically lower account id first, regardless of which direction the transfer is going, a circular wait becomes structurally impossible — whichever transaction gets the lower id first will always proceed to the higher id next, never the reverse.',
        hintHi: 'Agar har transaction jo dono accounts touch karta hai hamesha numerically lower account id pehle lock karta hai, transfer kisi bhi direction mein jaa raha ho, ek circular wait structurally impossible ban jaata hai.',
      },
    ],

    keyTakeaways: [
      'A DEADLOCK: two (or more) transactions each hold a lock the other needs and each waits for the other to release — a circular wait with no way out on its own (classic shape: A locks row 1 then wants row 2; B locks row 2 then wants row 1).',
      'PostgreSQL detects this automatically and picks ONE transaction to abort with `ERROR: deadlock detected`, releasing its locks so the other(s) can proceed. This is NOT a bug — application code must catch this SPECIFIC error and RETRY the whole transaction from the start (the conflict has usually resolved itself by then).',
      'REDUCE deadlock risk: make every transaction that locks the same multiple rows acquire them in a CONSISTENT ORDER (e.g. always the lower id first) — this makes a circular wait structurally IMPOSSIBLE. A project-wide convention, not something the database enforces for you.',
      'ADVISORY LOCKS (`pg_advisory_lock`/`pg_try_advisory_lock`/`pg_advisory_unlock`): application-defined locks with NO table/row attached — just an integer key the app gives meaning to. Session-level and REENTRANT (acquiring the same key twice succeeds both times; needs two matching unlocks). Use for coordination with no natural row to attach to (e.g. "only one scheduled job instance runs at a time").',
      'PESSIMISTIC concurrency (Lesson 5, `FOR UPDATE`): assume conflict is LIKELY, lock the row up front, make competitors wait. OPTIMISTIC concurrency: assume conflict is RARE, lock nothing, check a `version` column in the `UPDATE`\'s `WHERE` clause — `0 rows affected` means someone else won the race since you read it (the application MUST check the affected-row count, or it silently loses edits).',
      'CHOOSING: conflicts common/contention expected -> PESSIMISTIC (prevent up front, worth the wait cost). Conflicts rare, most transactions succeed -> OPTIMISTIC (cheaper when nothing usually collides; pay a retry cost only on the rare actual conflict).',
      'Module 9 recap: ACID + transaction boundary (L1), savepoints for partial recovery (L2), isolation levels tuning visible interleaving (L3), MVCC as the storage mechanism underneath it all (L4), explicit pessimistic locking (L5), and deadlocks + optimistic concurrency (L6) — the full toolkit for coordinating concurrent writers. Module 10 turns to indexes and query performance.',
    ],
    keyTakeawaysHi: [
      'Ek DEADLOCK: do (ya zyada) transactions har ek ek aisa lock hold karte hain jo doosre ko chahiye aur har ek doosre ke release karne ka wait karta hai — ek circular wait jiska apne aap koi raasta bahar nahi (classic shape: A row 1 lock karta hai phir row 2 chahता hai; B row 2 lock karta hai phir row 1 chahता hai).',
      'PostgreSQL ise automatically detect karta hai aur `ERROR: deadlock detected` ke saath abort karne ke liye EK transaction chunta hai. Ye ek bug NAHI hai — application code ko ye SPECIFIC error catch karna hai aur poori transaction shuru se RETRY karni hai.',
      'Deadlock risk KAM karo: har transaction jo usi multiple rows lock karta hai unhe ek CONSISTENT ORDER mein acquire kare (jaise hamesha lower id pehle) — ye ek circular wait ko structurally IMPOSSIBLE banaता hai.',
      'ADVISORY LOCKS: application-defined locks jinke saath KOI table/row attached nahi — bas ek integer key jise app meaning deta hai. Session-level aur REENTRANT. Un coordination ke liye jinke saath attach karne ke liye koi natural row nahi.',
      'PESSIMISTIC concurrency (Lesson 5, `FOR UPDATE`): maano conflict LIKELY hai, row upfront lock karo. OPTIMISTIC concurrency: maano conflict RARE hai, kuch lock mat karo, `UPDATE` ke `WHERE` mein ek `version` column check karo — `0 rows affected` matlab koi aur race jeeta.',
      'CHOOSING: conflicts common/contention expected -> PESSIMISTIC. Conflicts rare, zyadатार transactions succeed -> OPTIMISTIC.',
      'Module 9 recap: ACID + transaction boundary (L1), partial recovery ke liye savepoints (L2), visible interleaving tune karne waale isolation levels (L3), sab ke peeche storage mechanism ke roop mein MVCC (L4), explicit pessimistic locking (L5), aur deadlocks + optimistic concurrency (L6). Module 10 indexes aur query performance ki taraf jaata hai.',
    ],
  },
];
