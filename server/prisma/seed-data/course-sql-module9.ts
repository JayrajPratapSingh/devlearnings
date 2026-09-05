/**
 * Databases Complete Course — Module 9: Transactions, Concurrency & Isolation, lessons 1-3.
 *
 * Lesson 1: Transactions & ACID — the four ACID properties, BEGIN/COMMIT/ROLLBACK,
 *           implicit per-statement autocommit, and why one failing statement poisons
 *           an entire transaction until it is rolled back.
 * Lesson 2: Savepoints — SAVEPOINT / RELEASE SAVEPOINT / ROLLBACK TO SAVEPOINT as a
 *           way to discard part of a transaction without losing the rest, and the
 *           real-world pattern of wrapping a risky sub-step in one.
 * Lesson 3: Isolation levels & read phenomena — dirty / non-repeatable / phantom reads
 *           and write skew, the four standard isolation levels, PostgreSQL's actual
 *           levels (READ COMMITTED default, REPEATABLE READ, SERIALIZABLE), and why
 *           requesting READ UNCOMMITTED does not get you real dirty reads.
 *
 * Runnable examples use CREATE TABLE + explicit transaction control, verified against
 * real PostgreSQL 18 (PGlite). Two-session anomaly walkthroughs (dirty/non-repeatable/
 * phantom reads, write skew) are illustrated as annotated SQL in `mistakes` — they
 * describe well-established PostgreSQL behavior but are not machine-executed, since a
 * single embedded connection cannot run two sessions concurrently. Run: node verify-sql.mjs 9
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_9: CourseLesson[] = [
  {
    slug: 'sql-transactions-and-acid',
    title: 'Transactions & ACID',
    titleHi: 'Transactions Aur ACID',
    description: 'A transaction groups several statements into one all-or-nothing unit: either every change in it takes effect, or none do. ACID names the four guarantees a transaction gives you — Atomicity, Consistency, Isolation, Durability — and `BEGIN`/`COMMIT`/`ROLLBACK` are how you draw the boundary around one.',
    descriptionHi: 'Ek transaction kई statements ko ek all-or-nothing unit mein group karta hai: ya to isमein ka har change effect mein aata hai, ya koi nahi. ACID un chaar guarantees ko naam deता hai jo ek transaction aapko deता hai — Atomicity, Consistency, Isolation, Durability — aur `BEGIN`/`COMMIT`/`ROLLBACK` ek ke aas-paas boundary khींchne ka tarika hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A bank transfer written on a single receipt that either goes through whole, or is torn up whole — never half-done.** Moving 200 rupees from your savings account to your checking account is really two separate facts: "subtract 200 from savings" and "add 200 to checking". If the bank\'s system crashed, or the power failed, at the exact instant between those two steps, you would want the bank to guarantee one of exactly two outcomes: either both steps happened, or neither did — never a world where your savings account lost the money but your checking account never received it. That single, indivisible "both-or-neither" guarantee is what a **transaction** gives you, and it is the "A", Atomicity, in ACID. The other three letters are companion promises about the same envelope: the transfer can never leave the books in an impossible state, like a negative balance a `CHECK` constraint forbids (Consistency); if two transfers happen around the same moment, each one behaves as though it ran alone, unaffected by the other mid-flight (Isolation); and once the teller stamps "complete" on the receipt, that fact survives even if the building loses power one second later (Durability). `BEGIN` is picking up the receipt and starting to write on it; `COMMIT` is stamping it complete and filing it, permanently; `ROLLBACK` is deciding, part-way through writing, to tear the whole receipt up as though you had never picked up the pen.',
      hi: '**Ek bank transfer jo ek single receipt par likha jाता hai jo ya to poora hoता hai, ya poora fад diya jaता hai — kabhi aadha-adhoora nahi.** Aapke savings account se checking account mein 200 rupaye move karna asal mein do alag facts hain: "savings se 200 subtract karo" aur "checking mein 200 add karo". Agar bank ka system crash ho jाता, ya power fail ho jaती, theek un do steps ke beech ke instant par, aap chahते ki bank theek do outcomes mein se ek guarantee kare: ya dono steps hue, ya koi nahi hua — kabhi ek aisa world nahi jahaan aapke savings account ne paisa kho diya par aapke checking account ko kabhi mila hi nahi. Wo single, indivisible "both-or-neither" guarantee wo hai jo ek **transaction** aapko deता hai, aur ye ACID mein "A", Atomicity, hai. Baaki teen letters usi envelope ke baare mein companion promises hain: transfer kabhi books ko ek impossible state mein nahi chhoड़ सकता, jaise ek negative balance jise ek `CHECK` constraint forbid karता hai (Consistency); agar do transfers lगभग usi moment ke aas-paas hote hain, har ek waise behave karता hai jaise ye akele chala, doosre se unaffected (Isolation); aur ek baar teller receipt par "complete" stamp karता hai, wo fact bachता hai chahe building ek second baad power kho de (Durability).',
    },

    simple: `**Without an explicit transaction, every statement is its own tiny transaction (autocommit)**

\`\`\`sql
UPDATE account SET balance = balance - 200 WHERE id = 1;   -- commits the instant it succeeds
UPDATE account SET balance = balance + 200 WHERE id = 2;   -- a SEPARATE commit -- if this
                                                             -- one failed, the first already happened
\`\`\`

**\`BEGIN\` ... \`COMMIT\` groups several statements into one all-or-nothing unit**

\`\`\`sql
BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;
-- both changes become visible to everyone else at the SAME instant, or neither does
\`\`\`

**\`ROLLBACK\` discards everything written since \`BEGIN\`**

\`\`\`sql
BEGIN;
UPDATE t SET n = 999 WHERE id = 1;
SELECT n FROM t WHERE id = 1;    -- 999, visible to THIS transaction already
ROLLBACK;
SELECT n FROM t WHERE id = 1;    -- back to the original value -- the UPDATE never happened
\`\`\`

**ACID — the four guarantees**

\`\`\`
Atomicity   -- all of a transaction's writes happen, or NONE do (no half-done transfer)
Consistency -- every CONSTRAINT (Module 8) still holds after the transaction commits
Isolation   -- concurrent transactions don't see each other's uncommitted, in-progress work
              (the exact DEGREE of this is tunable -- Lesson 3)
Durability  -- once COMMIT returns successfully, the change survives a crash immediately after
\`\`\`

**One failing statement poisons the WHOLE transaction until you ROLLBACK**

\`\`\`sql
BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;     -- succeeds, but not yet committed
INSERT INTO account VALUES (1, 999);               -- fails: duplicate key
-- the transaction is now ABORTED -- every further statement, even a harmless SELECT,
-- fails with "current transaction is aborted" until you ROLLBACK
ROLLBACK;                                          -- the ONLY way out -- undoes the
                                                    -- balance UPDATE too, not just the INSERT
\`\`\``,

    simpleHi: `**Bina explicit transaction ke, har statement apna chhotа transaction hai (autocommit)**

\`\`\`sql
UPDATE account SET balance = balance - 200 WHERE id = 1;   -- succeed hote hi commit
UPDATE account SET balance = balance + 200 WHERE id = 2;   -- ek ALAG commit -- agar ye
                                                             -- fail hota, pehla pehle se ho chuka hota
\`\`\`

**\`BEGIN\` ... \`COMMIT\` kई statements ko ek all-or-nothing unit mein group karta hai**

\`\`\`sql
BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;
-- dono changes doosron ke liye theek usी instant par visible hote hain, ya koi nahi
\`\`\`

**\`ROLLBACK\` \`BEGIN\` ke baad likha sab kuch discard karta hai**

\`\`\`sql
BEGIN;
UPDATE t SET n = 999 WHERE id = 1;
SELECT n FROM t WHERE id = 1;    -- 999, IS transaction ke liye pehle se visible
ROLLBACK;
SELECT n FROM t WHERE id = 1;    -- original value par wapas -- UPDATE kabhi hua hi nahi
\`\`\`

**ACID — chaar guarantees**

\`\`\`
Atomicity   -- ek transaction ki sabhi writes hoती hain, ya KOI nahi (koi aadha-adhoora transfer nahi)
Consistency -- transaction commit hone ke baad har CONSTRAINT (Module 8) abhi bhi hold karta hai
Isolation   -- concurrent transactions ek doosre ka uncommitted, in-progress kaam nahi dekhte
              (iski exact DEGREE tunable hai -- Lesson 3)
Durability  -- ek baar COMMIT successfully return hone ke baad, change turant baad ek crash mein bhi bachта hai
\`\`\`

**Ek failing statement POORE transaction ko poison karta hai jab tak aap ROLLBACK na karें**

\`\`\`sql
BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;     -- succeed hota hai, par abhi tak committed nahi
INSERT INTO account VALUES (1, 999);               -- fails: duplicate key
-- transaction ab ABORTED hai -- har aage ka statement, ek harmless SELECT bhi,
-- "current transaction is aborted" se fail hota hai jab tak aap ROLLBACK na karें
ROLLBACK;                                          -- EKMATRA raasta bahar -- balance
                                                    -- UPDATE bhi undo karta hai, sirf INSERT nahi
\`\`\``,

    content: `## What a transaction is

A **transaction** is a sequence of one or more SQL statements that the database treats as a single unit: either every statement's effect is applied, or, if anything goes wrong, none of them are. Without saying otherwise, PostgreSQL runs every individual statement as its **own** implicit transaction — this is why a bare \`UPDATE\` "just works" without you ever typing \`BEGIN\`. **\`BEGIN\`** (equivalently \`START TRANSACTION\`) explicitly opens a transaction that spans everything until the matching \`COMMIT\` or \`ROLLBACK\`.

\`\`\`sql
BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;
\`\`\`

No other transaction can see either \`UPDATE\`'s effect until \`COMMIT\` — at which point both become visible **together, atomically**. If the process crashes, the connection drops, or you run \`ROLLBACK\` instead, **neither** update took effect, as if the transaction had never started.

## ACID, one letter at a time

**Atomicity** — a transaction's writes are all-or-nothing. The classic illustration is a funds transfer: subtracting from one account and adding to another are two separate statements, but they must succeed or fail as one unit, or money can be destroyed or created by a crash landing between them.

**Consistency** — a transaction can only move the database from one state that satisfies all constraints (Module 8's \`NOT NULL\`, \`CHECK\`, \`FOREIGN KEY\`, etc.) to another state that also satisfies them. PostgreSQL enforces this by refusing to \`COMMIT\` a transaction that would leave a constraint violated — the transaction aborts instead.

**Isolation** — concurrent transactions should not see each other's **uncommitted**, in-progress changes, and ideally behave as though they ran one after another rather than interleaved. Exactly how strictly this is enforced is *configurable* — that spectrum is the whole subject of Lesson 3.

**Durability** — once \`COMMIT\` has returned successfully, the change is guaranteed to survive, even if the server crashes one instant later. PostgreSQL achieves this by writing changes to a write-ahead log on durable storage before acknowledging the commit.

## \`BEGIN\`, \`COMMIT\`, \`ROLLBACK\`

\`\`\`sql
BEGIN;               -- open an explicit transaction (equivalently START TRANSACTION)
...statements...
COMMIT;               -- make every change since BEGIN permanent and visible to others
-- or:
ROLLBACK;             -- discard every change since BEGIN, as though none of it happened
\`\`\`

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);

BEGIN;
UPDATE t SET n = 999 WHERE id = 1;
SELECT n FROM t WHERE id = 1;   -- 999 -- visible to THIS transaction, which made the change
ROLLBACK;
SELECT n FROM t WHERE id = 1;   -- 100 -- the UPDATE is undone entirely
\`\`\`

A transaction's own statements always see its own uncommitted changes (there would be no point otherwise) — what \`ROLLBACK\` guarantees is that if you decide not to keep them, it is as though they never happened, for you or anyone else.

## One failing statement poisons the whole transaction

This is the single most important practical fact about PostgreSQL transactions, and it surprises people coming from databases with more lenient behaviour: **the instant any statement inside a transaction fails, PostgreSQL marks the entire transaction as aborted**, and refuses to run any further statement in it — not just the one that failed — until you issue \`ROLLBACK\`.

\`\`\`sql
BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;   -- succeeds (not committed yet)
INSERT INTO account VALUES (1, 999);             -- fails: duplicate key value
-- from this point on, EVERY statement in this transaction fails:
SELECT 1;                                        -- ERROR: current transaction is aborted,
                                                  --        commands ignored until end of transaction block
ROLLBACK;                                        -- the only way out
\`\`\`

There is no way to "skip past" the failed statement and keep the transaction's earlier, valid work — \`ROLLBACK\` discards the whole transaction, including the \`balance = 500\` update that succeeded just fine on its own. If you need to recover from one failed statement **without** losing everything else done in the same transaction, that is exactly what \`SAVEPOINT\` is for (Lesson 2).

## Why this matters for application code

Any application that opens a transaction, runs several statements, and catches errors along the way must understand this rule: **catching an error from one statement inside a transaction does not mean the transaction can continue** — the very next statement, even an unrelated one, will fail too, until the code explicitly rolls back (or rolls back to a savepoint). A common real-world bug is application code that catches an exception from a failed insert, logs it, and tries to proceed with more work in the *same* transaction — every subsequent statement then fails with the "aborted" error, which is often misread as a *new*, unrelated problem rather than the direct consequence of not rolling back after the first failure.`,

    contentHi: `## Ek transaction kya hai

Ek **transaction** ek ya zyada SQL statements ka ek sequence hai jise database ek single unit ki tarah treat karta hai: ya to har statement ka effect apply hota hai, ya, agar kuch galat hota hai, koi nahi hota. Kuch aur kahे bina, PostgreSQL har individual statement ko iske **apne** implicit transaction ke roop mein chalाता hai — yahi wajah hai ki ek bare \`UPDATE\` "bस kaam karta hai" bina aapke kabhi \`BEGIN\` type kiye. **\`BEGIN\`** explicitly ek transaction khоलता hai jo matching \`COMMIT\` ya \`ROLLBACK\` tak sab kuch span karta hai.

\`\`\`sql
BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;
\`\`\`

Koi doosra transaction kisी bhi \`UPDATE\` ka effect \`COMMIT\` tak nahi dekh sakta — jis point par dono **saath, atomically** visible ho jाते hain. Agar process crash hoता hai, connection drop hoता hai, ya aap iske bजाy \`ROLLBACK\` chalाते hain, **koi bhi** update effect mein nahi aाया, jaise transaction kabhi shuru hua hi na ho.

## ACID, ek-ek letter

**Atomicity** — ek transaction ki writes all-or-nothing hain. Classic illustration ek funds transfer hai.

**Consistency** — ek transaction database ko sirf ek state se jo sabhi constraints (Module 8) satisfy karta hai doosre state mein badал sakta hai jo bhi unhe satisfy karta hai. PostgreSQL ek transaction ko \`COMMIT\` karne se refuse karके ise enforce karta hai jo ek constraint violate chhoड़ता.

**Isolation** — concurrent transactions ko ek doosre ke **uncommitted**, in-progress changes nahi dekhne chahिए. Ye theek kितna strictly enforce hota hai *configurable* hai — wo spectrum Lesson 3 ka poora subject hai.

**Durability** — ek baar \`COMMIT\` successfully return ho jाने ke baad, change guaranteed hai ki bacheगа, chahe server ek instant baad crash ho jaye.

## \`BEGIN\`, \`COMMIT\`, \`ROLLBACK\`

\`\`\`sql
BEGIN;               -- ek explicit transaction khоlो
...statements...
COMMIT;               -- BEGIN se har change permanent aur doosron ko visible banao
-- ya:
ROLLBACK;             -- BEGIN se har change discard karo, jaise kuch hua hi na ho
\`\`\`

Ek transaction ke apne statements hamesha iske apne uncommitted changes dekhते hain — jo \`ROLLBACK\` guarantee karta hai wo ye hai ki agar aap unhe rakhne ka faisla nahi karte, ye aisa hai jaise wo kabhi hue hi nahi, aapke liye ya kisी aur ke liye.

## Ek failing statement poora transaction poison karta hai

Ye PostgreSQL transactions ke baare mein sabse important practical fact hai: **jis pal transaction ke andar koi bhi statement fail hota hai, PostgreSQL poore transaction ko aborted mark karta hai**, aur usmein aage koi bhi statement chalane se refuse karta hai — sirf jo fail hua use nahi — jab tak aap \`ROLLBACK\` issue na karें.

\`\`\`sql
BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;   -- succeed hota hai (abhi committed nahi)
INSERT INTO account VALUES (1, 999);             -- fails: duplicate key value
-- is point se, HAR statement is transaction mein fail hota hai:
SELECT 1;                                        -- ERROR: current transaction is aborted,
                                                  --        commands ignored until end of transaction block
ROLLBACK;                                        -- ekmatra raasta bahar
\`\`\`

Failed statement ko "skip" karke transaction ka pehle ka, valid kaam rakhne ka koi tarika nahi hai — \`ROLLBACK\` poora transaction discard karta hai, \`balance = 500\` update sहित jo apne aap mein theek se succeed hua tha. Agar aapko ek failed statement se recover karna hai **bina** usी transaction mein kiya gaya baaki sab kuch khoye, wahi \`SAVEPOINT\` ke liye hai (Lesson 2).

## Ye application code ke liye kyun maayne rakhta hai

Koi bhi application jo ek transaction khоlती hai, kई statements chalाती hai, aur raste mein errors catch karti hai, use ye niyam samajhна hoga: **ek transaction ke andar ek statement se ek error catch karna iska matlab nahi hai ki transaction continue kar sakta hai** — agali statement, ek unrelated bhi, phir fail hogi, jab tak code explicitly rollback na kare.`,

    examples: [
      {
        title: 'ROLLBACK undoes a pending change; committed setup survives',
        titleHi: 'ROLLBACK ek pending change undo karta hai; committed setup bachta hai',
        code: `BEGIN;
CREATE TABLE t (id int PRIMARY KEY, n int);
INSERT INTO t VALUES (1, 100);
COMMIT;

BEGIN;
UPDATE t SET n = 999 WHERE id = 1;
SELECT n FROM t WHERE id = 1;
ROLLBACK;
SELECT n FROM t WHERE id = 1;`,
        output: ` n
-----
 999
(1 row)

 n
-----
 100
(1 row)`,
        explain: "Inside the transaction, the `UPDATE` is applied and the transaction's own `SELECT` sees it immediately (`999`) — a transaction always sees its own uncommitted work. `ROLLBACK` then discards that `UPDATE` entirely, as though it never ran; the following `SELECT` (a new, separate implicit transaction) sees the original committed value, `100`.",
        explainHi: 'Transaction ke andar, `UPDATE` apply hota hai aur transaction ka apna `SELECT` ise turant dekhta hai (`999`) — ek transaction hamesha apna uncommitted kaam dekhta hai. `ROLLBACK` phir us `UPDATE` ko poori tarah discard karta hai, jaise ye kabhi chala hi nahi; agla `SELECT` (ek naya, alag implicit transaction) original committed value dekhta hai, `100`.',
      },
      {
        title: 'A committed transaction persists both statements together',
        titleHi: 'Ek committed transaction dono statements ko saath persist karta hai',
        code: `CREATE TABLE account (id int PRIMARY KEY, balance int);
INSERT INTO account VALUES (1, 1000), (2, 500);

BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;

SELECT id, balance FROM account ORDER BY id;`,
        output: ` id | balance
----+---------
 1  | 800
 2  | 700
(2 rows)`,
        explain: 'Both `UPDATE`s run inside the same `BEGIN`/`COMMIT` block, so they take effect TOGETHER at `COMMIT` — account 1 drops by 200 (to `800`) and account 2 rises by 200 (to `700`) as a single atomic unit. Neither change is visible to anyone else until both have happened.',
        explainHi: 'Dono `UPDATE`s usī `BEGIN`/`COMMIT` block ke andar chalte hain, to wo `COMMIT` par SAATH effect mein aate hain — account 1 200 se girta hai (`800` tak) aur account 2 200 se badhta hai (`700` tak) ek single atomic unit ke roop mein. Koi bhi change kisī aur ko tab tak visible nahi hota jab tak dono na hue hon.',
      },
      {
        title: 'A failing statement inside a transaction aborts the whole thing',
        titleHi: 'Ek transaction ke andar ek failing statement poore ko abort kar deta hai',
        code: `BEGIN;
CREATE TABLE account (id int PRIMARY KEY, balance int);
INSERT INTO account VALUES (1, 1000);
COMMIT;

BEGIN;
UPDATE account SET balance = 500 WHERE id = 1;
INSERT INTO account VALUES (1, 999);`,
        output: `[ERROR] duplicate key value violates unique constraint "account_pkey"`,
        explain: 'The `UPDATE` to `balance = 500` succeeds and is pending inside the open transaction. The next `INSERT` collides with the existing primary key (`id = 1`) and fails — and because this failure happened inside a transaction, PostgreSQL reports exactly that error; the whole transaction is now marked aborted, and the `500` balance update, though it ran without error, will be undone the moment this transaction is eventually rolled back (there is no way to keep it while discarding only the failed insert without a `SAVEPOINT`, Lesson 2).',
        explainHi: '`balance = 500` waala `UPDATE` succeed hota hai aur open transaction ke andar pending hai. Agla `INSERT` existing primary key (`id = 1`) se collide karta hai aur fail hota hai — aur kyunki ye failure ek transaction ke andar hui, PostgreSQL theek wo error report karta hai; poora transaction ab aborted mark hota hai, aur `500` balance update, chahe ye bina error ke chala, jab ye transaction aakhirkar rollback hogi tab undo ho jaega (`SAVEPOINT`, Lesson 2, ke bina sirf failed insert discard karте hue ise rakhne ka koi tarika nahi hai).',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming catching one statement's error lets you continue the SAME transaction
BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- fails: duplicate reservation
-- application code catches the error and logs it, then tries to continue:
UPDATE audit_log SET note = 'reservation failed' WHERE id = 1;
-- ERROR: current transaction is aborted, commands ignored until end of transaction block
-- (this is NOT a new bug -- it is the direct consequence of not rolling back)`,
        right: `BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- fails
ROLLBACK;   -- required before this connection can run anything else
-- start a NEW transaction for the audit log entry, or use a SAVEPOINT (Lesson 2)
-- around the risky INSERT so the inventory UPDATE can survive`,
        why: 'Once a statement fails inside a transaction, PostgreSQL marks the whole transaction as aborted and rejects every subsequent statement in it, regardless of whether that statement is related to the one that failed. Catching the exception in application code and attempting to run the audit log update in the same transaction ignores this rule, so that update fails too, with an error that looks unrelated but is actually just the ongoing consequence of the earlier failure never being rolled back. The transaction must either be rolled back entirely and a new one started for further work, or the risky statement must be wrapped in a SAVEPOINT so that only the savepoint, not the whole transaction, needs to be rolled back on failure.',
        whyHi: 'Ek baar ek transaction ke andar ek statement fail hoता hai, PostgreSQL poore transaction ko aborted mark karta hai aur isमein har aगला statement reject karta hai, chahe wo statement fail hue se related ho ya na ho. Application code mein exception catch karna aur usी transaction mein audit log update chalane ki koshish karna is niyam ko ignore karta hai, to wo update bhi fail hota hai, ek error ke saath jo unrelated dikhता hai par asal mein sirf pehle ki failure ka ongoing consequence hai jo kabhi rollback nahi hui.',
      },
      {
        wrong: `-- doing two related writes as two SEPARATE implicit transactions
UPDATE account SET balance = balance - 200 WHERE id = 1;   -- commits immediately
-- process crashes HERE, before the second statement runs
UPDATE account SET balance = balance + 200 WHERE id = 2;   -- never happens -- money vanished`,
        right: `BEGIN;
UPDATE account SET balance = balance - 200 WHERE id = 1;
UPDATE account SET balance = balance + 200 WHERE id = 2;
COMMIT;
-- a crash before COMMIT means NEITHER update took effect -- no money vanishes`,
        why: 'Without an explicit BEGIN, each statement is its own independent transaction that commits the instant it succeeds. Two related writes issued this way are not atomic as a pair: if anything interrupts the connection between them, the first has already committed permanently while the second never runs, leaving the data in a state that should have been impossible, money subtracted from one account with nowhere corresponding added. Wrapping both statements in an explicit transaction makes them atomic together: either both commit, visible at the same instant, or a crash or error before COMMIT means neither one took effect, so the books can never show half of a transfer.',
        whyHi: 'Bina explicit \`BEGIN\` ke, har statement apna independent transaction hai jo succeed hote hi commit hota hai. Is tarike se issue kiye do related writes ek jodi ke roop mein atomic nahi hain: agar unke beech connection kuch interrupt karta hai, pehla pehle se permanently commit ho chuka hai jabki doosra kabhi nahi chalta, data ko ek state mein chhoड़ते hue jo impossible hona chahiye tha. Dono statements ko ek explicit transaction mein wrap karna unhe saath atomic banata hai.',
      },
      {
        wrong: `-- expecting a CHECK constraint violation to reject only the bad row, leaving good rows committed
BEGIN;
INSERT INTO product (id, price) VALUES (1, 50);    -- valid
INSERT INTO product (id, price) VALUES (2, -10);   -- violates CHECK (price > 0)
COMMIT;   -- expecting product 1 to be saved even though product 2 was rejected`,
        right: `-- either handle each insert as its own transaction (autocommit), so product 1
-- commits independently of product 2's failure:
INSERT INTO product (id, price) VALUES (1, 50);
INSERT INTO product (id, price) VALUES (2, -10);   -- fails, but does not affect product 1
-- or, within one transaction, wrap the risky insert in a SAVEPOINT (Lesson 2)`,
        why: 'A CHECK constraint violation is a statement failure like any other, and it aborts the entire enclosing transaction, not just the one row that violated the rule. Once the second insert fails, the transaction is poisoned, and the COMMIT that follows does not save the earlier, valid insert; it either does nothing or raises its own error, because there is nothing valid left to commit. If the intent is genuinely "save whichever rows are valid, skip whichever are not", each insert should run as its own autocommitted statement rather than sharing one transaction, or the risky insert should be wrapped in a savepoint that can be rolled back on its own without taking the rest of the transaction down with it.',
        whyHi: 'Ek `CHECK` constraint violation kisi bhi doosre statement failure ki tarah hai, aur ye poore enclosing transaction ko abort karta hai, sirf us ek row ko nahi jisne rule violate kiya. Doosra insert fail hone ke baad, transaction poisoned hai, aur uske baad `COMMIT` pehle ke, valid insert ko save nahi karta. Agar intent genuinely "jo bhi rows valid hain unhe save karo, jo nahi unhe skip karo" hai, har insert ko apne aap autocommitted statement ke roop mein chalna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A payments service wrapping "debit the payer, credit the payee" in a single explicit transaction** — the textbook Atomicity example, applied literally in production.',
        hi: '**Ek payments service jo "payer ko debit karo, payee ko credit karo" ko ek single explicit transaction mein wrap karti hai**.',
      },
      {
        en: '**An ORM or query builder that opens a transaction, catches an error from one statement, and correctly issues `ROLLBACK` before starting a fresh transaction for retry logic** — rather than trying to keep using the aborted one.',
        hi: '**Ek ORM jo ek transaction khоlता hai, ek statement se error catch karta hai, aur sahi tareeke se `ROLLBACK` issue karta hai retry logic ke liye ek nayi transaction shuru karne se pehle**.',
      },
      {
        en: '**A "transaction is aborted" error in a log, correctly diagnosed as a symptom of an earlier, unlogged failure in the same transaction** rather than treated as its own root cause.',
        hi: '**Log mein ek "transaction is aborted" error, sahi se usी transaction mein ek pehle ki, unlogged failure ke symptom ke roop mein diagnose ki gayi**.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the four ACID properties in your own words.',
        qHi: 'Apne shabdों mein chaar ACID properties samjhाओ.',
        a: 'Atomicity means a transaction\'s writes are all-or-nothing: every statement inside it takes effect, or, if anything fails, none of them do, so a multi-step operation like a funds transfer can never be observed half-completed. Consistency means a transaction can only move the database from one state that satisfies every declared constraint to another state that also satisfies them; the database enforces this by refusing to commit a transaction that would leave a constraint violated. Isolation means concurrent transactions do not see each other\'s uncommitted, in-progress changes, and ideally each behaves as though it ran alone rather than interleaved with others, though exactly how strictly this is enforced is configurable through isolation levels. Durability means that once a commit has been acknowledged as successful, the change is guaranteed to survive even a crash immediately afterward, which the database achieves by writing the change to durable storage, typically a write-ahead log, before confirming the commit to the client.',
        aHi: 'Atomicity ka matlab hai ek transaction ki writes all-or-nothing hain: iske andar har statement effect leta hai, ya, agar kuch fail hota hai, koi nahi leta. Consistency ka matlab hai ek transaction database ko sirf ek state se jo har declared constraint satisfy karta hai doosre state mein le ja sakta hai jo bhi unhe satisfy karta hai. Isolation ka matlab hai concurrent transactions ek doosre ke uncommitted, in-progress changes nahi dekhte. Durability ka matlab hai ek baar commit successful acknowledge hone ke baad, change guaranteed hai ki turant baad ek crash mein bhi bachegा.',
      },
      {
        q: 'What happens when one statement inside a transaction fails, and why can\'t you just continue with the next statement?',
        qHi: 'Ek transaction ke andar ek statement fail hone par kya hota hai, aur aap agली statement se aage kyun nahi chal sakte?',
        a: 'The moment any statement inside a transaction fails, for instance a constraint violation or a duplicate key, PostgreSQL marks the entire transaction as aborted. From that point on, every subsequent statement in the same transaction is rejected outright with an error stating the transaction is aborted and commands are being ignored until the end of the transaction block, regardless of whether that later statement has anything to do with the one that actually failed. The only way out is to issue ROLLBACK, which discards everything done in the transaction, including any earlier statements that succeeded perfectly well on their own. This exists because the database cannot know, in general, whether the failure invalidates assumptions the later statements were relying on, so rather than guessing, it insists on a clean, explicit decision, either discard the whole attempt via rollback, or, if the failure was anticipated and isolated to one risky sub-step, use a savepoint so that only that sub-step, not the entire transaction, is what gets rolled back.',
        aHi: 'Jis pal ek transaction ke andar koi bhi statement fail hota hai, PostgreSQL poore transaction ko aborted mark karta hai. Us point se, usी transaction mein har aगला statement seedhे reject hota hai ek error ke saath jo batाता hai transaction aborted hai, chahe wo baad ka statement jo asal mein fail hua usse koi lena-dena rakhe ya na rakhe. Bahar nikalne ka ekmatra tarika `ROLLBACK` issue karna hai, jo transaction mein kiya gaya sab kuch discard karta hai. Ye isliye exist karta hai kyunki database generally nahi jaanta ki failure baad ke statements ke assumptions ko invalidate karti hai ya nahi.',
      },
    ],

    exercises: [
      {
        task: 'Table `acct(id int PRIMARY KEY, balance int)` with one row `(1, 1000)`, committed. In a new transaction, `UPDATE` the balance to `2000`, `SELECT` it (confirm `2000`), then `ROLLBACK`, then `SELECT` again (confirm it is back to `1000`).',
        taskHi: 'Table `acct(id, balance)` ek row `(1, 1000)` ke saath, committed. Ek nayi transaction mein, balance ko `2000` `UPDATE` karo, `SELECT` karo (confirm `2000`), phir `ROLLBACK`, phir dobara `SELECT` (confirm `1000` par wapas).',
        hint: 'Commit the setup row first with its own `BEGIN; ...; COMMIT;` so it survives the later `ROLLBACK`. The mid-transaction `SELECT` shows the pending value; the post-rollback `SELECT` shows the original.',
        hintHi: 'Setup row ko pehle apne `BEGIN; ...; COMMIT;` se commit karo taaki ye baad ke `ROLLBACK` se bache. Mid-transaction `SELECT` pending value dikhata hai; post-rollback `SELECT` original dikhata hai.',
      },
      {
        task: 'Two accounts, `(1, 1000)` and `(2, 500)`, committed. In ONE transaction, subtract 300 from account 1 and add 300 to account 2, then `COMMIT`. Confirm both changes are visible together.',
        taskHi: 'Do accounts, `(1, 1000)` aur `(2, 500)`, committed. EK transaction mein, account 1 se 300 subtract karo aur account 2 mein 300 add karo, phir `COMMIT`. Confirm karo dono changes saath visible hain.',
        hint: 'Both `UPDATE`s inside one `BEGIN`/`COMMIT` block succeed or fail together — the final balances (`700` and `800`) only appear once `COMMIT` runs.',
        hintHi: 'Ek `BEGIN`/`COMMIT` block ke andar dono `UPDATE`s saath succeed ya fail hote hain — final balances sirf `COMMIT` chalne par dikhते hain.',
      },
      {
        task: 'Table `product(id int PRIMARY KEY, price int)` with one committed row. In a new transaction, `UPDATE` the price successfully, then attempt an `INSERT` with a duplicate `id` (fails). Confirm the whole attempt reports the duplicate-key error, and explain in a comment why the earlier valid `UPDATE` does not survive unless you separately re-run it after a `ROLLBACK`.',
        taskHi: 'Table `product(id, price)` ek committed row ke saath. Ek nayi transaction mein, price successfully `UPDATE` karo, phir ek duplicate `id` ke saath `INSERT` try karo (fails). Confirm karo poora attempt duplicate-key error report karta hai.',
        hint: 'The failing `INSERT` aborts the whole transaction, which must eventually be rolled back — undoing the earlier `UPDATE` too. There is no way to keep the `UPDATE` while discarding only the failed `INSERT` without a `SAVEPOINT` (Lesson 2).',
        hintHi: 'Failing `INSERT` poore transaction ko abort karta hai, jise aakhirkar rollback karna hoga — pehle ka `UPDATE` bhi undo karте hue. Bina `SAVEPOINT` (Lesson 2) ke sirf failed `INSERT` discard karте hue `UPDATE` rakhne ka koi tarika nahi hai.',
      },
    ],

    keyTakeaways: [
      'A TRANSACTION groups statements into an all-or-nothing unit: every effect applies, or (on failure/`ROLLBACK`) none do. Without an explicit `BEGIN`, EVERY statement is its own implicit transaction (autocommit) — this is why a bare `UPDATE` "just works".',
      '`BEGIN` opens an explicit transaction spanning everything until the matching `COMMIT` (makes changes permanent + visible to others, together) or `ROLLBACK` (discards everything since `BEGIN`, as if it never happened). A transaction always sees its OWN uncommitted changes.',
      'ACID: ATOMICITY (all-or-nothing writes — no half-done transfer). CONSISTENCY (every `CHECK`/`NOT NULL`/`FK` constraint, Module 8, still holds after commit — the DB refuses to commit a violation). ISOLATION (concurrent transactions don\'t see each other\'s uncommitted work — the exact DEGREE is tunable, Lesson 3). DURABILITY (once `COMMIT` returns, the change survives even an immediate crash — via a write-ahead log).',
      'THE #1 PRACTICAL GOTCHA: the instant ANY statement inside a transaction fails, PostgreSQL marks the WHOLE transaction ABORTED — every further statement (even an unrelated `SELECT`) fails with `current transaction is aborted, commands ignored until end of transaction block`, until you `ROLLBACK`.',
      '`ROLLBACK` after a failure discards EVERYTHING since `BEGIN` — including earlier statements that succeeded perfectly fine on their own. There is no way to "skip past" just the failed statement and keep the rest — that specific need is what `SAVEPOINT` solves (Lesson 2).',
      'Application-code danger: catching one statement\'s error and trying to run MORE statements in the SAME transaction fails them too, with an error that looks unrelated but is really just the ongoing consequence of not having rolled back yet. Either `ROLLBACK` and start a new transaction, or use a `SAVEPOINT` around the risky step.',
      'Two related writes issued WITHOUT an explicit transaction (relying on autocommit) are NOT atomic as a pair — a crash between them can leave the data in a state that should have been impossible (money subtracted with nowhere added). Wrap related writes in explicit `BEGIN`/`COMMIT`.',
    ],
    keyTakeawaysHi: [
      'Ek TRANSACTION statements ko ek all-or-nothing unit mein group karta hai: har effect apply hota hai, ya (failure/`ROLLBACK` par) koi nahi hota. Bina explicit `BEGIN` ke, HAR statement apna implicit transaction hai (autocommit).',
      '`BEGIN` ek explicit transaction khоlता hai jo matching `COMMIT` (changes ko permanent + doosron ko visible, saath) ya `ROLLBACK` (`BEGIN` se sab kuch discard) tak sab kuch span karta hai.',
      'ACID: ATOMICITY (all-or-nothing writes). CONSISTENCY (commit ke baad har constraint abhi bhi hold karta hai). ISOLATION (concurrent transactions ek doosre ka uncommitted kaam nahi dekhte — exact DEGREE tunable hai, Lesson 3). DURABILITY (`COMMIT` return hone ke baad, change turant crash mein bhi bachta hai).',
      '#1 PRACTICAL GOTCHA: jis pal transaction ke andar KOI BHI statement fail hota hai, PostgreSQL POORE transaction ko ABORTED mark karta hai — har aage ka statement fail hota hai jab tak aap `ROLLBACK` na karें.',
      'Failure ke baad `ROLLBACK` `BEGIN` se SAB KUCH discard karta hai — pehle ke statements sहित jo apne aap mein theek se succeed hue. Sirf failed statement "skip" karne ka koi tarika nahi hai — wo specific zaroorat `SAVEPOINT` solve karta hai (Lesson 2).',
      'Application-code khatra: ek statement ka error catch karna aur usी transaction mein AUR statements chalane ki koshish unhe bhi fail karti hai, ek unrelated dikhne waale error ke saath. Ya `ROLLBACK` karo aur nayi transaction shuru karo, ya risky step ke aas-paas ek `SAVEPOINT` istemal karo.',
      'Bina explicit transaction ke (autocommit par bharosa karte hue) issue ki gayi do related writes ek jodi ke roop mein atomic NAHI hain — unke beech ek crash data ko ek impossible state mein chhoड़ sakta hai.',
    ],
  },

  {
    slug: 'sql-savepoints',
    title: 'Savepoints: Undo Part of a Transaction, Not All of It',
    titleHi: 'Savepoints: Ek Transaction Ka Hissa Undo Karo, Sab Kuch Nahi',
    description: '`SAVEPOINT` marks a point inside a transaction you can roll back to without discarding everything before it. `ROLLBACK TO SAVEPOINT` undoes only the work since that point; the transaction stays open and can still be committed.',
    descriptionHi: '`SAVEPOINT` ek transaction ke andar ek point mark karta hai jis par aap iske pehle ka sab kuch discard kiye bina rollback kar sakte ho. `ROLLBACK TO SAVEPOINT` sirf us point se ka kaam undo karta hai; transaction open rehta hai aur abhi bhi commit ho sakta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A video game\'s mid-level checkpoint, versus restarting the entire game from the title screen.** You have been playing for twenty minutes, collecting coins and defeating enemies, when you reach a checkpoint the game quietly saves. You then attempt a risky jump and fall into a pit. A game with only "restart from the very beginning" would force you to redo the entire twenty minutes just to retry one jump — the equivalent of a bare `ROLLBACK` discarding an entire transaction to recover from one bad step. A game with checkpoints instead lets you reload from the *last checkpoint*: everything you achieved before it is kept, only the failed attempt since then is undone, and you try the jump again from right where you were. `SAVEPOINT` is placing that checkpoint inside a transaction; `ROLLBACK TO SAVEPOINT` is reloading it, discarding only the moves made since, while every coin collected earlier in the same playthrough stays collected — the game (the transaction) is still running, not restarted, and you can go on to finish it normally with a final `COMMIT` when you reach the end.',
      hi: '**Ek video game ka mid-level checkpoint, poora game title screen se restart karne ke muकаble.** Aap bees minute se khel rahe ho, coins collect kar rahe ho aur enemies defeat kar rahe ho, jab aap ek checkpoint tak pahunchते ho jise game chupchaap save karta hai. Phir aap ek risky jump try karte ho aur ek pit mein gir jaते ho. Sirf "bilkul shuru se restart" waala ek game aapko poore bees minute dobara karne par majboor karega sirf ek jump retry karne ke liye — ek bare `ROLLBACK` ke barabar jo ek galat step se recover karne ke liye poori transaction discard karta hai. Checkpoints waala ek game iske bजाy aapको *aakhri checkpoint* se reload karने deta hai: usse pehle jo bhi aapne achieve kiya rakha jaता hai, sirf tab se failed attempt undo hoता hai, aur aap jump ko theek wahin se dobara try karte ho jahaan aap the. `SAVEPOINT` us checkpoint ko ek transaction ke andar rakhна hai; `ROLLBACK TO SAVEPOINT` ise reload karna hai.',
    },

    simple: `**\`SAVEPOINT name\` marks a point you can return to without losing earlier work**

\`\`\`sql
BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;   -- kept, no matter what happens next
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1;  -- an experimental change --
                                                          -- turns out to be a mistake
ROLLBACK TO SAVEPOINT sp1;                              -- undo ONLY the -5000 change
UPDATE acct SET balance = balance - 50 WHERE id = 1;    -- a corrected change instead
COMMIT;
-- final balance reflects -200 then -50 -- the -5000 attempt never happened
\`\`\`

**\`ROLLBACK TO SAVEPOINT\` does not end the transaction — you can keep going, and still \`COMMIT\`**

\`\`\`
SAVEPOINT sp1              -- place the checkpoint
...risky statements...
ROLLBACK TO SAVEPOINT sp1  -- undo back to the checkpoint -- transaction is STILL OPEN
...try something else...
COMMIT                     -- commit whatever the transaction ended up doing
\`\`\`

**\`RELEASE SAVEPOINT\` — you decided you don't need this checkpoint any more**

\`\`\`sql
SAVEPOINT sp1;
...statements that worked fine...
RELEASE SAVEPOINT sp1;     -- forget the checkpoint -- these changes are now just part
                           -- of the enclosing transaction, nothing special
\`\`\`

**Savepoints can be nested**

\`\`\`sql
SAVEPOINT outer_sp;
  ...
  SAVEPOINT inner_sp;
    ...
  ROLLBACK TO SAVEPOINT inner_sp;   -- undoes back to inner_sp only
  ...
ROLLBACK TO SAVEPOINT outer_sp;    -- undoes back further, to outer_sp
\`\`\`

**The real-world use: wrap ONE risky sub-step, keep the rest of the transaction safe**

\`\`\`
begin a transaction with several steps
for the one step that might fail (an insert that could violate a constraint):
  SAVEPOINT before the risky step
  attempt it
  if it fails: ROLLBACK TO SAVEPOINT, try a fallback, or just skip it
  if it works: RELEASE SAVEPOINT (or just move on)
commit the whole transaction at the end -- the earlier, unrelated steps are untouched
\`\`\``,

    simpleHi: `**\`SAVEPOINT name\` ek point mark karta hai jahaan aap pehle ka kaam khoye bina wapas aa sakte ho**

\`\`\`sql
BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;   -- rakha jaता hai, aage kuch bhi ho
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1;  -- ek experimental change --
                                                          -- ek galti nikлी
ROLLBACK TO SAVEPOINT sp1;                              -- SIRF -5000 change undo karo
UPDATE acct SET balance = balance - 50 WHERE id = 1;    -- iske bजाy ek corrected change
COMMIT;
-- final balance -200 phir -50 reflect karta hai -- -5000 attempt kabhi hua hi nahi
\`\`\`

**\`ROLLBACK TO SAVEPOINT\` transaction khatm nahi karta — aap chalते rah sakte ho, aur abhi bhi \`COMMIT\`**

\`\`\`
SAVEPOINT sp1              -- checkpoint rakho
...risky statements...
ROLLBACK TO SAVEPOINT sp1  -- checkpoint tak undo -- transaction ABHI BHI OPEN hai
...kuch aur try karo...
COMMIT                     -- transaction ne jo bhi kiya use commit karo
\`\`\`

**\`RELEASE SAVEPOINT\` — aapने decide kiya ki ab is checkpoint ki zaroorat nahi**

\`\`\`sql
SAVEPOINT sp1;
...statements jo theek chale...
RELEASE SAVEPOINT sp1;     -- checkpoint bhool jaओ -- ye changes ab bस enclosing
                           -- transaction ka hissa hain, kuch special nahi
\`\`\`

**Savepoints nested ho sakte hain**

\`\`\`sql
SAVEPOINT outer_sp;
  ...
  SAVEPOINT inner_sp;
    ...
  ROLLBACK TO SAVEPOINT inner_sp;   -- sirf inner_sp tak undo
  ...
ROLLBACK TO SAVEPOINT outer_sp;    -- aur peeche, outer_sp tak undo
\`\`\`

**Real-world use: EK risky sub-step wrap karo, baaki transaction safe rakho**

\`\`\`
kई steps waali ek transaction shuru karो
us ek step ke liye jo fail ho sakta hai (ek insert jo ek constraint violate kar sakta hai):
  risky step se pehle SAVEPOINT
  ise try karo
  agar fail hota hai: ROLLBACK TO SAVEPOINT, ek fallback try karo, ya bस skip karo
  agar kaam karta hai: RELEASE SAVEPOINT (ya bस aage badो)
ant mein poori transaction commit karो -- pehle ke, unrelated steps untouched hain
\`\`\``,

    content: `## The gap savepoints fill

Lesson 1 established the rule: one failing statement aborts the **entire** transaction, and \`ROLLBACK\` is the only way out — undoing everything since \`BEGIN\`, not just the failed statement. \`SAVEPOINT\` is the tool for when that is too blunt: it lets you mark a point inside a transaction and later discard **only** the work done after that point, while keeping everything before it and continuing the same transaction.

\`\`\`sql
BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;  -- step 1: kept regardless
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1; -- step 2: an experiment
SELECT balance FROM acct WHERE id = 1;                  -- see the (unwanted) result
ROLLBACK TO SAVEPOINT sp1;                             -- undo step 2 only
UPDATE acct SET balance = balance - 50 WHERE id = 1;   -- step 2, corrected
COMMIT;
\`\`\`

## \`ROLLBACK TO SAVEPOINT\` does not end the transaction

This is the crucial difference from a plain \`ROLLBACK\`: after \`ROLLBACK TO SAVEPOINT sp1\`, the transaction is **still open** — you can run more statements, set another savepoint, and eventually \`COMMIT\` normally. Only the statements between the savepoint and the rollback are undone; everything before the savepoint remains part of the pending transaction, waiting for the eventual \`COMMIT\` or \`ROLLBACK\` of the whole thing.

## \`RELEASE SAVEPOINT\`

Once you no longer need to be able to roll back to a savepoint — the risky section succeeded, or you have decided to commit to keeping it either way — \`RELEASE SAVEPOINT name\` forgets it. This does not undo anything; it simply removes the checkpoint, folding those statements into the surrounding transaction as ordinary, no-longer-separately-revertible work. Savepoints are also automatically released when the enclosing transaction commits or rolls back.

## Nesting

Savepoints can be nested to any depth, and \`ROLLBACK TO SAVEPOINT\` only undoes back to the **named** savepoint, leaving any savepoints set before it (further out) still available:

\`\`\`sql
BEGIN;
SAVEPOINT outer_sp;
  ...
  SAVEPOINT inner_sp;
    ...
  ROLLBACK TO SAVEPOINT inner_sp;   -- back to inner_sp only; outer_sp still exists
  ...
ROLLBACK TO SAVEPOINT outer_sp;     -- back further, discarding the inner_sp work too
COMMIT;
\`\`\`

## The canonical use case: isolating one risky step

The most common real-world pattern is wrapping a single statement or small group of statements that **might** fail — typically because of a constraint you cannot fully check in advance — in a savepoint, so a failure there does not sacrifice the rest of an otherwise-successful transaction:

\`\`\`sql
BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';   -- always wanted, regardless

SAVEPOINT before_reservation;
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- might violate a uniqueness rule
-- if this fails:
ROLLBACK TO SAVEPOINT before_reservation;
INSERT INTO reservation_waitlist (order_id, sku) VALUES (7, 'A1');  -- a fallback instead

COMMIT;   -- the inventory decrement survives either way
\`\`\`

This is exactly what ORM frameworks and connection libraries often do automatically under a nested-transaction API: a "nested transaction" in most of these tools is implemented as a savepoint under the hood, not a genuinely separate transaction (PostgreSQL, like the SQL standard generally, has only one true transaction per connection at a time — nesting is savepoints, all the way down).

## Cost

A savepoint has a small overhead (PostgreSQL has to track it and be able to undo to it), but it is far cheaper than the alternative of restarting an entire transaction's earlier work after a recoverable failure. Reach for one specifically around a step that might legitimately fail as part of normal operation — not as a blanket habit around every statement, which adds overhead without benefit when nothing there is actually at risk of failing.`,

    contentHi: `## Wo gap jo savepoints bharते hain

Lesson 1 ne niyam establish kiya: ek failing statement **poore** transaction ko abort karta hai, aur \`ROLLBACK\` bahar nikalne ka ekmatra tarika hai. \`SAVEPOINT\` us tool ke liye hai jab wo bahut blunt hai: ye aapко ek transaction ke andar ek point mark karne deta hai aur baad mein **sirf** us point ke baad kiya gaya kaam discard karने deta hai, uske pehle ka sab kuch rakhte hue.

\`\`\`sql
BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;  -- step 1: har haal mein rakha
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1; -- step 2: ek experiment
SELECT balance FROM acct WHERE id = 1;                  -- (unwanted) result dekho
ROLLBACK TO SAVEPOINT sp1;                             -- sirf step 2 undo
UPDATE acct SET balance = balance - 50 WHERE id = 1;   -- step 2, corrected
COMMIT;
\`\`\`

## \`ROLLBACK TO SAVEPOINT\` transaction khatm nahi karta

Ye ek plain \`ROLLBACK\` se crucial antar hai: \`ROLLBACK TO SAVEPOINT sp1\` ke baad, transaction **abhi bhi open** hai — aap aur statements chala sakte ho, ek aur savepoint set kar sakte ho, aur aakhirkar normally \`COMMIT\` kar sakte ho.

## \`RELEASE SAVEPOINT\`

Ek baar aapको ek savepoint tak rollback karne ki zaroorat nahi rahती, \`RELEASE SAVEPOINT name\` ise bhool jaता hai. Ye kuch undo nahi karta; ye bस checkpoint hataता hai, un statements ko surrounding transaction mein ordinary, ab-alag-se-revertible-nahi kaam ke roop mein fold karте hue.

## Nesting

Savepoints kisी bhi depth tak nest ho sakte hain, aur \`ROLLBACK TO SAVEPOINT\` sirf **named** savepoint tak undo karta hai, iske pehle set ki gayi savepoints (aur bahar) abhi bhi available chhoड़te hue.

## Canonical use case: ek risky step isolate karna

Sabse common real-world pattern ek single statement ya chhote group of statements ko wrap karna hai jo **shaayad** fail ho, ek savepoint mein, taaki wahaan ek failure poori transaction ke baaki hisse ko qurbaan na kare:

\`\`\`sql
BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';   -- har haal mein chahiye

SAVEPOINT before_reservation;
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- ek uniqueness rule violate kar sakta hai
-- agar ye fail hota hai:
ROLLBACK TO SAVEPOINT before_reservation;
INSERT INTO reservation_waitlist (order_id, sku) VALUES (7, 'A1');  -- iske bजाy ek fallback

COMMIT;   -- inventory decrement dono tarikों se bachта hai
\`\`\`

Ye theek wo hai jo ORM frameworks aksar ek nested-transaction API ke under automatically karte hain: in mein se zyadатार tools mein ek "nested transaction" iske peeche ek savepoint ke roop mein implement hoती hai, ek genuinely separate transaction nahi.

## Cost

Ek savepoint ka ek chhota overhead hai, par ye ek recoverable failure ke baad poori transaction ka pehle ka kaam restart karne se bahut sasta hai. Ek ko specifically us step ke aas-paas rakhо jo normal operation ke hisse ke roop mein legitimately fail ho sakta hai.`,

    examples: [
      {
        title: 'ROLLBACK TO SAVEPOINT discards an experimental change while keeping earlier work',
        titleHi: 'ROLLBACK TO SAVEPOINT ek experimental change discard karta hai pehle ka kaam rakhte hue',
        code: `BEGIN;
CREATE TABLE acct (id int PRIMARY KEY, balance int);
INSERT INTO acct VALUES (1, 1000);
COMMIT;

BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1;
SELECT balance FROM acct WHERE id = 1;
ROLLBACK TO SAVEPOINT sp1;
SELECT balance FROM acct WHERE id = 1;
RELEASE SAVEPOINT sp1;
COMMIT;
SELECT balance FROM acct WHERE id = 1;`,
        output: ` balance
---------
 -4200
(1 row)

 balance
---------
 800
(1 row)

 balance
---------
 800
(1 row)`,
        explain: 'The first `UPDATE` (`-200`) is kept regardless of what follows. After `SAVEPOINT sp1`, the experimental `-5000` update runs, and the mid-transaction `SELECT` shows its (unwanted) result: `800 - 5000 = -4200`. `ROLLBACK TO SAVEPOINT sp1` discards ONLY that experimental update, restoring the balance to `800` — visible in the next `SELECT`, and still true after `RELEASE SAVEPOINT` and `COMMIT`.',
        explainHi: 'Pehla `UPDATE` (`-200`) baad mein jo bhi ho har haal mein rakha jata hai. `SAVEPOINT sp1` ke baad, experimental `-5000` update chalta hai, aur mid-transaction `SELECT` iska (unwanted) result dikhata hai: `800 - 5000 = -4200`. `ROLLBACK TO SAVEPOINT sp1` SIRF us experimental update ko discard karta hai, balance ko `800` par restore karte hue — agle `SELECT` mein visible, aur `RELEASE SAVEPOINT` aur `COMMIT` ke baad bhi sach.',
      },
      {
        title: 'A corrected step after ROLLBACK TO SAVEPOINT still commits normally',
        titleHi: 'ROLLBACK TO SAVEPOINT ke baad ek corrected step abhi bhi normally commit hota hai',
        code: `BEGIN;
CREATE TABLE acct (id int PRIMARY KEY, balance int);
INSERT INTO acct VALUES (1, 1000);
COMMIT;

BEGIN;
UPDATE acct SET balance = balance - 200 WHERE id = 1;
SAVEPOINT sp1;
UPDATE acct SET balance = balance - 5000 WHERE id = 1;
ROLLBACK TO SAVEPOINT sp1;
UPDATE acct SET balance = balance - 50 WHERE id = 1;
COMMIT;

SELECT balance FROM acct WHERE id = 1;`,
        output: ` balance
---------
 750
(1 row)`,
        explain: "After `ROLLBACK TO SAVEPOINT sp1` discards the `-5000` experiment, the transaction is still open (Lesson 2's key point) — so a corrected `-50` update can run right after, and `COMMIT` persists the transaction's final state: `1000 - 200 - 50 = 750`. The abandoned `-5000` attempt never contributes to the final value at all.",
        explainHi: '`ROLLBACK TO SAVEPOINT sp1` ke `-5000` experiment discard karne ke baad, transaction abhi bhi open hai (Lesson 2 ka key point) — to ek corrected `-50` update turant baad chal sakta hai, aur `COMMIT` transaction ki final state persist karta hai: `1000 - 200 - 50 = 750`. Chhoड़ा gaya `-5000` attempt final value mein bilkul contribute nahi karta.',
      },
      {
        title: 'Nested savepoints: rolling back the inner one leaves the outer one intact',
        titleHi: 'Nested savepoints: inner ko rollback karna outer ko intact chhodta hai',
        code: `BEGIN;
CREATE TABLE log (id int PRIMARY KEY, msg text);
COMMIT;

BEGIN;
INSERT INTO log VALUES (1, 'outer step');
SAVEPOINT outer_sp;
  INSERT INTO log VALUES (2, 'inner step (kept)');
  SAVEPOINT inner_sp;
    INSERT INTO log VALUES (3, 'inner step (discarded)');
  ROLLBACK TO SAVEPOINT inner_sp;
COMMIT;

SELECT * FROM log ORDER BY id;`,
        output: ` id | msg
----+-------------------
 1  | outer step
 2  | inner step (kept)
(2 rows)`,
        explain: '`outer_sp` is set after row 1 is inserted; `inner_sp` is set after row 2. Row 3 is inserted after `inner_sp`, so `ROLLBACK TO SAVEPOINT inner_sp` undoes only row 3, leaving rows 1 and 2 — both inserted before `inner_sp` — intact and ready to be committed as part of the still-open transaction.',
        explainHi: '`outer_sp` row 1 insert hone ke baad set hoti hai; `inner_sp` row 2 ke baad. Row 3 `inner_sp` ke baad insert hoti hai, to `ROLLBACK TO SAVEPOINT inner_sp` sirf row 3 undo karti hai, rows 1 aur 2 — dono `inner_sp` se pehle insert hui — ko intact chhodते hue aur abhi bhi open transaction ke hisse ke roop mein commit hone ke liye taiyार.',
      },
    ],

    mistakes: [
      {
        wrong: `-- reaching for a plain ROLLBACK after one risky step fails, losing everything
BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- fails: already reserved
ROLLBACK;   -- discards the inventory decrement too, even though it was fine on its own`,
        right: `BEGIN;
UPDATE inventory SET qty = qty - 1 WHERE sku = 'A1';
SAVEPOINT before_reservation;
INSERT INTO reservation (order_id, sku) VALUES (7, 'A1');  -- fails
ROLLBACK TO SAVEPOINT before_reservation;   -- undoes ONLY the reservation attempt
-- ...try a fallback, or just skip it...
COMMIT;   -- the inventory decrement survives`,
        why: 'A plain ROLLBACK discards the entire transaction, including statements that succeeded perfectly well and had nothing to do with the failure. If the reservation insert is genuinely expected to fail sometimes as part of normal operation, for instance because the item might already be reserved by someone else, wrapping just that insert in a savepoint means a failure there only undoes that one attempt, leaving the earlier inventory update intact and the transaction still open to commit. Reaching for a full rollback after every failure, when only one specific step was actually at risk, throws away valid work unnecessarily.',
        whyHi: 'Ek plain `ROLLBACK` poori transaction discard karta hai, un statements sहित jo theek se succeed hue aur failure se koi lena-dena nahi rakhte the. Agar reservation insert genuinely kabhi-kabhi fail hone ki umeed hai normal operation ke hisse ke roop mein, sirf us insert ko ek savepoint mein wrap karna matlab wahaan ek failure sirf us ek attempt ko undo karti hai, pehle ka inventory update intact chhoड़te hue.',
      },
      {
        wrong: `-- expecting ROLLBACK TO SAVEPOINT to end the transaction, like a plain ROLLBACK
BEGIN;
UPDATE t SET n = 1 WHERE id = 1;
SAVEPOINT sp1;
UPDATE t SET n = 2 WHERE id = 1;
ROLLBACK TO SAVEPOINT sp1;
-- assuming the transaction is now over -- but it is NOT; forgetting to COMMIT or
-- ROLLBACK afterward leaves it open, holding locks, until the connection ends it`,
        right: `BEGIN;
UPDATE t SET n = 1 WHERE id = 1;
SAVEPOINT sp1;
UPDATE t SET n = 2 WHERE id = 1;
ROLLBACK TO SAVEPOINT sp1;
COMMIT;   -- explicitly close out the transaction that ROLLBACK TO SAVEPOINT left open`,
        why: 'ROLLBACK TO SAVEPOINT undoes work back to the named checkpoint, but the enclosing transaction itself remains open and active afterward; it is a mid-transaction operation, not a transaction-ending one, and PostgreSQL still expects an eventual COMMIT or a plain ROLLBACK to actually conclude the transaction. Forgetting this and treating a savepoint rollback as though it ended things leaves a transaction open indefinitely, which can hold locks and prevent other operations, including certain maintenance tasks, until something eventually closes it, whether that is an explicit COMMIT, an explicit ROLLBACK, or the connection itself closing.',
        whyHi: '`ROLLBACK TO SAVEPOINT` named checkpoint tak kaam undo karta hai, par enclosing transaction khud uske baad open aur active rehta hai; ye ek mid-transaction operation hai, transaction-ending nahi, aur PostgreSQL abhi bhi ek eventual `COMMIT` ya ek plain `ROLLBACK` expect karta hai transaction ko asal mein conclude karne ke liye. Ise bhoolna aur ek savepoint rollback ko aisa treat karna jaise ise sab kuch khatm kar diya ek transaction ko indefinitely open chhoड़ता hai.',
      },
      {
        wrong: `-- wrapping EVERY statement in its own savepoint out of excessive caution
BEGIN;
SAVEPOINT sp1;
UPDATE a SET x = 1 WHERE id = 1;
RELEASE SAVEPOINT sp1;
SAVEPOINT sp2;
UPDATE b SET y = 2 WHERE id = 1;
RELEASE SAVEPOINT sp2;
COMMIT;
-- neither statement was actually at risk of failing -- the savepoints add
-- overhead and noise without protecting against anything real`,
        right: `BEGIN;
UPDATE a SET x = 1 WHERE id = 1;   -- not expected to fail -- no savepoint needed
UPDATE b SET y = 2 WHERE id = 1;   -- likewise
COMMIT;
-- reserve SAVEPOINT specifically for the ONE step that might genuinely fail
-- (Lesson 1's product/duplicate-key example, or a similar constraint-driven risk)`,
        why: 'A savepoint exists to isolate a specific step that might legitimately fail as part of normal operation, so that its failure does not sacrifice unrelated work in the same transaction. Wrapping every statement in its own savepoint regardless of whether it is actually at risk adds bookkeeping overhead for no protective benefit, and makes the transaction harder to read, since a reader can no longer tell from the presence of a savepoint which step the author actually expected might fail. Reserve savepoints for the specific statements where failure is a real, anticipated possibility, typically ones guarded by a uniqueness constraint, a foreign key, or a check constraint that the application cannot fully verify in advance.',
        whyHi: 'Ek savepoint ek specific step isolate karne ke liye exist karta hai jo normal operation ke hisse ke roop mein legitimately fail ho sakta hai. Har statement ko iski apni savepoint mein wrap karna chahe wo asal mein risk mein hai ya nahi bina kisi protective benefit ke bookkeeping overhead add karta hai. Savepoints ko un specific statements ke liye rakhо jahaan failure ek real, anticipated possibility hai.',
      },
    ],

    realWorld: [
      {
        en: '**An import job that wraps each row\'s insert in a savepoint, rolls back to it and logs a skipped row on failure, and continues processing the rest of the batch in the SAME transaction** rather than aborting the entire import on one bad row.',
        hi: '**Ek import job jo har row ke insert ko ek savepoint mein wrap karta hai, failure par ise rollback karta hai aur ek skipped row log karta hai, aur SAME transaction mein baaki batch process karna continue karta hai**.',
      },
      {
        en: '**An ORM\'s "nested transaction" API implemented internally as a `SAVEPOINT`** — understanding this explains why a "nested transaction" rollback does not commit the outer one, and why nesting works even though PostgreSQL has only one real transaction per connection.',
        hi: '**Ek ORM ka "nested transaction" API internally ek `SAVEPOINT` ke roop mein implement kiya gaya** — ise samajhna explain karta hai ki ek "nested transaction" rollback outer ko commit kyun nahi karta.',
      },
      {
        en: '**A payment retry step wrapped in a savepoint** so a declined card on attempt one can be rolled back to and retried with a different payment method within the same order-creation transaction.',
        hi: '**Ek payment retry step ek savepoint mein wrap kiya gaya** taaki attempt one par ek declined card ko rollback karके ek alag payment method se retry kiya ja sake.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does `SAVEPOINT` solve, and how is `ROLLBACK TO SAVEPOINT` different from a plain `ROLLBACK`?',
        qHi: '`SAVEPOINT` kaunसी problem solve karta hai, aur `ROLLBACK TO SAVEPOINT` ek plain `ROLLBACK` se kaise alag hai?',
        a: 'The problem savepoints solve follows directly from how PostgreSQL handles a failed statement: once anything inside a transaction fails, the whole transaction is aborted, and a plain ROLLBACK is the only way out, discarding every statement since BEGIN, including ones that succeeded perfectly well and had nothing to do with the failure. A savepoint lets you mark a specific point inside a transaction and later undo only the work done after that point, while everything before it remains part of the still-open transaction. The key difference from a plain ROLLBACK is exactly that: ROLLBACK ends the transaction entirely, whereas ROLLBACK TO SAVEPOINT undoes back to the named checkpoint but leaves the enclosing transaction open and active, so you can continue running statements, set another savepoint, and eventually commit the transaction as a whole, once you have handled or worked around the failure. In practice this is used to isolate one specific step that might legitimately fail, wrapping just that step in a savepoint so a failure there does not force you to redo or lose everything else the transaction had already accomplished.',
        aHi: 'Wo problem jo savepoints solve karте hain seedhे follow karti hai is baat se ki PostgreSQL ek failed statement kaise handle karta hai: ek baar transaction ke andar kuch bhi fail hota hai, poora transaction aborted ho jata hai, aur ek plain `ROLLBACK` bahar nikalne ka ekmatra tarika hai, `BEGIN` se har statement discard karte hue. Ek savepoint aapको ek transaction ke andar ek specific point mark karne deta hai aur baad mein sirf us point ke baad kiya gaya kaam undo karne deta hai. Plain `ROLLBACK` se key antar theek yahi hai: `ROLLBACK` transaction ko poori tarah khatm karta hai, jabki `ROLLBACK TO SAVEPOINT` named checkpoint tak undo karta hai par enclosing transaction ko open aur active chhoड़ता hai.',
      },
      {
        q: 'Does `ROLLBACK TO SAVEPOINT` end the transaction? What do you still need to do afterward?',
        qHi: 'Kya `ROLLBACK TO SAVEPOINT` transaction khatm karta hai? Aapko uske baad abhi bhi kya karna hai?',
        a: 'No, ROLLBACK TO SAVEPOINT does not end the transaction. It undoes the statements executed since the named savepoint was established, but the transaction itself remains open and active afterward, exactly as it was before reaching the savepoint, just without the discarded work. You can continue issuing new statements in the same transaction after a rollback to savepoint, set additional savepoints, and the transaction is still waiting for its own eventual conclusion. That means you still need to explicitly COMMIT the transaction if you want to keep whatever it ended up doing, or issue a full ROLLBACK if you decide to abandon the entire transaction after all. Forgetting this and assuming the transaction is finished once you have rolled back to a savepoint leaves it open indefinitely, which can hold locks and interfere with other operations until something, an explicit commit, an explicit rollback, or the connection closing, eventually ends it.',
        aHi: 'Nahi, `ROLLBACK TO SAVEPOINT` transaction khatm nahi karta. Ye named savepoint establish hone ke baad se chalе statements ko undo karta hai, par transaction khud uske baad open aur active rehта hai, theek waisा jaisा savepoint tak pahunchне se pehle tha, sirf discarded kaam ke bina. Iska matlab hai aapko abhi bhi explicitly transaction `COMMIT` karna hai agar aap wo rakhna chahте ho jo ye aakhirkar karta hai, ya ek poori `ROLLBACK` issue karni hai agar aap poora transaction abandon karna decide karте ho.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, n int)` with one committed row `(1, 100)`. In a new transaction: `UPDATE n to 150`, `SAVEPOINT sp1`, `UPDATE n to 9999` (a mistake), `ROLLBACK TO SAVEPOINT sp1`, then `UPDATE n to 200`, then `COMMIT`. Confirm the final value is `200`, not `150` or `9999`.',
        taskHi: 'Table `t(id, n)` ek committed row `(1, 100)` ke saath. Ek nayi transaction mein: `n` ko `150` `UPDATE`, `SAVEPOINT sp1`, `n` ko `9999` `UPDATE` (ek galti), `ROLLBACK TO SAVEPOINT sp1`, phir `n` ko `200` `UPDATE`, phir `COMMIT`.',
        hint: 'The `9999` update is entirely undone by the rollback to savepoint. The `150` update (before the savepoint) survives. The `200` update (after the rollback) is the final value that gets committed.',
        hintHi: '`9999` update savepoint tak rollback se poori tarah undo hota hai. `150` update (savepoint se pehle) bachta hai. `200` update (rollback ke baad) final value hai jo commit hota hai.',
      },
      {
        task: 'Table `log(id int PRIMARY KEY, msg text)`, empty. In one transaction, insert `(1, \'a\')`, then `SAVEPOINT outer_sp`, insert `(2, \'b\')`, then `SAVEPOINT inner_sp`, insert `(3, \'c\')`, then `ROLLBACK TO SAVEPOINT inner_sp`, then `COMMIT`. Confirm the table has exactly rows 1 and 2, not row 3.',
        taskHi: 'Table `log(id, msg)`, khaali. Ek transaction mein, `(1, \'a\')` insert karo, phir `SAVEPOINT outer_sp`, `(2, \'b\')` insert karo, phir `SAVEPOINT inner_sp`, `(3, \'c\')` insert karo, phir `ROLLBACK TO SAVEPOINT inner_sp`, phir `COMMIT`.',
        hint: 'Rolling back to `inner_sp` only undoes what happened after `inner_sp` was set (row 3). Rows 1 and 2, both inserted before `inner_sp`, survive.',
        hintHi: '`inner_sp` tak rollback karna sirf wo undo karta hai jo `inner_sp` set hone ke baad hua (row 3). Rows 1 aur 2, `inner_sp` se pehle insert hui, bachti hain.',
      },
      {
        task: 'Table `inventory(sku text PRIMARY KEY, qty int)` and `reservation(order_id int PRIMARY KEY, sku text)`, both with one committed row (`sku = \'A1\', qty = 5` and `order_id = 7, sku = \'A1\'`). In a new transaction: decrement `qty` for A1, `SAVEPOINT before_reservation`, try `INSERT INTO reservation VALUES (7, \'A1\')` (fails, duplicate `order_id`), `ROLLBACK TO SAVEPOINT before_reservation`, then `COMMIT`. Confirm the qty decrement survived.',
        taskHi: 'Table `inventory(sku, qty)` aur `reservation(order_id, sku)`, dono ek committed row ke saath. Ek nayi transaction mein: A1 ka `qty` decrement karo, `SAVEPOINT before_reservation`, `INSERT INTO reservation VALUES (7, \'A1\')` try karo (fails, duplicate `order_id`), `ROLLBACK TO SAVEPOINT before_reservation`, phir `COMMIT`. Confirm karo qty decrement bacha.',
        hint: 'The failed `INSERT` (duplicate `order_id = 7`) only poisons back to `before_reservation`. Rolling back to that savepoint clears the failure; the earlier `qty` decrement, made before the savepoint, is untouched and commits normally.',
        hintHi: 'Failed `INSERT` (duplicate `order_id = 7`) sirf `before_reservation` tak poison karta hai. Us savepoint tak rollback karna failure clear karta hai; pehle ka `qty` decrement, savepoint se pehle kiya gaya, untouched hai aur normally commit hota hai.',
      },
    ],

    keyTakeaways: [
      '`SAVEPOINT name` marks a point inside a transaction you can return to WITHOUT discarding everything before it — the fix for Lesson 1\'s "one failure poisons the whole transaction" problem when only ONE step is genuinely at risk.',
      '`ROLLBACK TO SAVEPOINT name` undoes ONLY the statements since that savepoint — everything before it stays part of the still-open transaction. This is the KEY difference from a plain `ROLLBACK`: the enclosing transaction is NOT ended, you can keep working and still `COMMIT` normally afterward.',
      '`RELEASE SAVEPOINT name` forgets a checkpoint you no longer need (without undoing anything) — folds those statements into the surrounding transaction as ordinary work. Savepoints are also auto-released when the enclosing transaction commits or rolls back.',
      'Savepoints NEST to any depth. `ROLLBACK TO SAVEPOINT` only undoes back to the NAMED savepoint — any savepoint set further out (before it) remains available for a later rollback of its own.',
      'CANONICAL USE: wrap ONE risky step (typically one that might violate a constraint you can\'t fully check in advance) in a savepoint, so its failure doesn\'t sacrifice the rest of an otherwise-successful transaction. Most ORM "nested transaction" APIs are savepoints under the hood — PostgreSQL has only ONE real transaction per connection at a time.',
      'GOTCHA: `ROLLBACK TO SAVEPOINT` does NOT end the transaction — forgetting the eventual `COMMIT`/`ROLLBACK` leaves it open indefinitely, holding locks. GOTCHA 2: don\'t wrap EVERY statement in its own savepoint out of excessive caution — reserve them for steps that genuinely might fail; blanket use adds overhead/noise with no protective benefit.',
      'Cost: small overhead to track/support undo, but far cheaper than restarting an entire transaction\'s earlier valid work after one recoverable failure.',
    ],
    keyTakeawaysHi: [
      '`SAVEPOINT name` ek transaction ke andar ek point mark karta hai jahaan aap iske pehle sab kuch discard kiye BINA wapas aa sakte ho — Lesson 1 ki "ek failure poore transaction ko poison karta hai" problem ka fix jab sirf EK step genuinely risk mein hai.',
      '`ROLLBACK TO SAVEPOINT name` SIRF us savepoint se ke statements undo karta hai — iske pehle ka sab kuch abhi bhi open transaction ka hissa rehta hai. Plain `ROLLBACK` se KEY antar: enclosing transaction khatm NAHI hota, aap kaam karte rah sakte ho aur baad mein abhi bhi normally `COMMIT` kar sakte ho.',
      '`RELEASE SAVEPOINT name` ek checkpoint bhool jaata hai jiski aapko ab zaroorat nahi (kuch undo kiye bina). Savepoints enclosing transaction commit ya rollback hone par bhi auto-released hote hain.',
      'Savepoints kisi bhi depth tak NEST hote hain. `ROLLBACK TO SAVEPOINT` sirf NAMED savepoint tak undo karta hai — iske bahar set ki gayi koi bhi savepoint available rehti hai.',
      'CANONICAL USE: EK risky step ko ek savepoint mein wrap karo, taaki iski failure baaki transaction ko qurbaan na kare. Zyadатार ORM "nested transaction" APIs peeche savepoints hain — PostgreSQL ke paas ek waqt prati connection sirf EK real transaction hai.',
      'GOTCHA: `ROLLBACK TO SAVEPOINT` transaction khatm NAHI karta — eventual `COMMIT`/`ROLLBACK` bhoolna ise indefinitely open chhoड़ता hai, locks hold karте hue. GOTCHA 2: har statement ko excessive caution se apni savepoint mein mat wrap karo.',
      'Cost: undo track/support karne ke liye ek chhota overhead, par ek recoverable failure ke baad poori transaction ka pehle ka valid kaam restart karne se bahut sasta.',
    ],
  },

  {
    slug: 'sql-isolation-levels-and-read-phenomena',
    title: 'Isolation Levels & Read Phenomena',
    titleHi: 'Isolation Levels Aur Read Phenomena',
    description: 'Isolation is the "I" in ACID, and it comes in degrees. The SQL standard names four levels and four anomalies they trade off against each other — dirty reads, non-repeatable reads, phantom reads, and write skew. PostgreSQL implements three of the four levels, and its weakest level is stricter than the standard requires.',
    descriptionHi: 'Isolation ACID ka "I" hai, aur ye degrees mein aata hai. SQL standard chaar levels aur chaar anomalies naam deta hai jo ek doosre ke against trade-off hoते hain — dirty reads, non-repeatable reads, phantom reads, aur write skew. PostgreSQL char mein se teen levels implement karta hai, aur iska sabse weak level standard se strict hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Watching someone edit a shared document, at different degrees of "can I see what they haven\'t saved yet".** Imagine two people editing the same paragraph of a shared document at the same time. At the loosest possible setting, you would see every keystroke the other person types, live, even the sentence they typed and then deleted because it was wrong — reading something the other person themselves later took back, which never should have been shown to you at all: a **dirty read**. A stricter setting only shows you their changes once they explicitly save, but if you read the paragraph twice during your own editing session and they saved a change in between, you see two different versions of the *same* paragraph without ever refreshing the page yourself — a **non-repeatable read**. Stricter still, your view of the *whole document* is frozen the moment you started reading it, so individual paragraphs never change underneath you — but if someone adds a brand-new paragraph at the end and saves, your next scroll to the bottom reveals a paragraph that was not there a moment ago, from your own point of view: a **phantom read**. The strictest setting of all guarantees your entire editing session behaves as if you had the document completely to yourself, start to finish, with the *other* person\'s session simply happening before or after yours, never mid-way through — the trade-off being that if both of you actually did touch the document conflictingly at the same moment, the system has to make one of you redo your entire session from scratch.',
      hi: '**Kisी ko ek shared document edit karte hue dekhна, "kya main dekh sakta hoon jo unhone abhi tak save nahi kiya" ke alag degrees par.** Do log usी shared document ke usी paragraph ko usी waqt edit kar rahe hain socho. Sabse loose possible setting par, aap doosre vyakti ka har keystroke dekhoge, live, wo sentence bhi jo unhone type kiya aur phir delete kar diya kyunki wo galat tha — kuch padhna jo doosre vyakti ne khud baad mein wapas le liya, jo aapko bilkul nahi dikhна chahiye tha: ek **dirty read**. Ek strict setting aapको unke changes sirf tab dikhाती hai jab wo explicitly save karте hain, par agar aap apne editing session ke dौran paragraph do baar padhте ho aur unhone beech mein ek change save kiya, aap *usी* paragraph ke do alag versions dekhते ho bina khud page refresh kiye — ek **non-repeatable read**. Aur strict, aapka *poore document* ka view us pal freeze ho jaता hai jab aapne padhна shuru kiya, to individual paragraphs aapke neeche kabhi nahi badalte — par agar koi ant mein ek bilkul naya paragraph add karta hai aur save karta hai, aapka agla scroll neeche ek paragraph reveal karta hai jo ek pal pehle nahi tha: ek **phantom read**. Sabse strict setting guarantee karti hai ki aapka poora editing session aise behave karta hai jaise aapke paas document poori tarah akele ho.',
    },

    simple: `**Four SQL-standard isolation levels, loosest to strictest**

\`\`\`sql
READ UNCOMMITTED  -- weakest: allows dirty reads (in theory -- see below)
READ COMMITTED    -- PostgreSQL's DEFAULT -- never sees another transaction's uncommitted data
REPEATABLE READ   -- your transaction's reads are a consistent snapshot from its start
SERIALIZABLE      -- strictest: behaves as if transactions ran one at a time, never interleaved
\`\`\`

**Four anomalies the levels trade off against**

\`\`\`
DIRTY READ           -- you see another transaction's UNCOMMITTED change (might be rolled back!)
NON-REPEATABLE READ  -- you read the same row twice in one transaction, get DIFFERENT values,
                        because another transaction committed a change to it in between
PHANTOM READ         -- you run the same WHERE-clause query twice, get a DIFFERENT SET OF ROWS,
                        because another transaction inserted/deleted a matching row in between
WRITE SKEW           -- two transactions each read some data, each make a DIFFERENT decision
                        based on it, and together they violate a rule that depended on BOTH decisions
\`\`\`

**Which level prevents which anomaly (SQL standard)**

\`\`\`
                     dirty read | non-repeatable read | phantom read
READ UNCOMMITTED         possible          possible          possible
READ COMMITTED           prevented         possible          possible
REPEATABLE READ          prevented         prevented         possible (standard) / prevented (PG)
SERIALIZABLE             prevented         prevented         prevented
\`\`\`

**PostgreSQL specifics — checkable in one session**

\`\`\`sql
SHOW transaction_isolation;                       -- 'read committed' -- the default
BEGIN ISOLATION LEVEL REPEATABLE READ;
SHOW transaction_isolation;                       -- 'repeatable read'
COMMIT;

-- PostgreSQL ACCEPTS "read uncommitted" as a setting (SHOW will even echo it back) --
-- but its ACTUAL behavior is identical to READ COMMITTED. PostgreSQL never performs
-- true dirty reads, at any requested level.
\`\`\`

**Setting the isolation level**

\`\`\`sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
...
COMMIT;

-- or, once already inside a transaction (before its first real query):
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
...
\`\`\``,

    simpleHi: `**Chaar SQL-standard isolation levels, loosest se strictest**

\`\`\`sql
READ UNCOMMITTED  -- weakest: dirty reads allow karta hai (theory mein -- neeche dekho)
READ COMMITTED    -- PostgreSQL ka DEFAULT -- kabhi doosre transaction ka uncommitted data nahi dekhta
REPEATABLE READ   -- aapke transaction ke reads iske start se ek consistent snapshot hain
SERIALIZABLE      -- strictest: aise behave karta hai jaise transactions ek-ek karke chale, kabhi interleaved nahi
\`\`\`

**Chaar anomalies jo levels ek doosre ke against trade off karte hain**

\`\`\`
DIRTY READ           -- aap ek doosre transaction ka UNCOMMITTED change dekhते ho (rollback ho sakta hai!)
NON-REPEATABLE READ  -- aap ek transaction mein wahi row do baar padhте ho, ALAG values paate ho,
                        kyunki ek doosre transaction ne beech mein ek change commit kiya
PHANTOM READ         -- aap wahi WHERE-clause query do baar chalते ho, ALAG SET OF ROWS paate ho,
                        kyunki ek doosre transaction ne beech mein ek matching row insert/delete ki
WRITE SKEW           -- do transactions har ek kuch data padhте hain, har ek uske aadhaar par
                        ek ALAG decision leते hain, aur saath wo ek rule violate karte hain jo DONO decisions par depend karta tha
\`\`\`

**Kaunsa level kaunsi anomaly rokта hai (SQL standard)**

\`\`\`
                     dirty read | non-repeatable read | phantom read
READ UNCOMMITTED         possible          possible          possible
READ COMMITTED           prevented         possible          possible
REPEATABLE READ          prevented         prevented         possible (standard) / prevented (PG)
SERIALIZABLE             prevented         prevented         prevented
\`\`\`

**PostgreSQL specifics — ek session mein checkable**

\`\`\`sql
SHOW transaction_isolation;                       -- 'read committed' -- default
BEGIN ISOLATION LEVEL REPEATABLE READ;
SHOW transaction_isolation;                       -- 'repeatable read'
COMMIT;

-- PostgreSQL "read uncommitted" ko ek setting ke roop mein ACCEPT karta hai
-- par iska ACTUAL behavior READ COMMITTED ke identical hai. PostgreSQL kabhi
-- true dirty reads perform nahi karta, kisi bhi requested level par.
\`\`\`

**Isolation level set karna**

\`\`\`sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
...
COMMIT;
\`\`\``,

    content: `## Isolation is a dial, not a switch

Lesson 1 named Isolation as one of the four ACID properties: concurrent transactions should not see each other's uncommitted, in-progress work. But *how strictly* this is enforced is configurable, because perfect isolation (behaving as though every transaction ran completely alone, one after another) is expensive to guarantee under real concurrent load. The SQL standard defines four **isolation levels**, from loosest to strictest, and names the specific **anomalies** each level does or does not allow.

## The four anomalies

- **Dirty read**: transaction B sees a change transaction A has made but not yet committed. If A later rolls back, B has seen data that never actually existed as far as the rest of the database is concerned.
- **Non-repeatable read**: within a single transaction, reading the *same row* twice returns two *different* values, because another transaction committed a change to it in between the two reads.
- **Phantom read**: within a single transaction, running the *same query* (a \`WHERE\` condition matching a set of rows) twice returns a *different set of rows*, because another transaction inserted or deleted a matching row in between.
- **Write skew**: two transactions each read some overlapping data, each independently make a decision based on what they see, and neither one's individual change violates any single-row constraint — but the *combination* of both changes violates a rule that depended on the state both transactions were looking at. (The classic example: a rule "at least one of these two on-call doctors must remain on duty"; two doctors each independently check "is my colleague still on duty?", see yes, and both go off duty at once — each transaction was individually valid, but together they broke the rule.)

## The four levels, and what they prevent

| level | dirty read | non-repeatable read | phantom read |
|---|---|---|---|
| \`READ UNCOMMITTED\` | possible | possible | possible |
| \`READ COMMITTED\` | prevented | possible | possible |
| \`REPEATABLE READ\` | prevented | prevented | possible (standard) |
| \`SERIALIZABLE\` | prevented | prevented | prevented |

Each stricter level prevents everything the level below it prevents, plus one more anomaly — until \`SERIALIZABLE\`, which prevents all of them (and, in a properly implemented \`SERIALIZABLE\`, write skew too, which the standard's simple table above does not even name as a separate column).

## PostgreSQL's actual implementation

PostgreSQL implements three genuinely distinct behaviours, though it accepts all four level names:

- **\`READ COMMITTED\` — the default.** Each *statement* within the transaction sees a fresh snapshot of the database taken at the moment that statement starts, so it sees every change committed by other transactions up to that instant, but never anything still uncommitted. This is enough to prevent dirty reads, but not non-repeatable or phantom reads (different statements in the same transaction can see different snapshots).
- **\`REPEATABLE READ\`.** The *entire transaction* takes one snapshot, at its first query, and every subsequent statement in it sees that same snapshot — so re-reading the same row, or re-running the same query, always gives the same answer, for the life of the transaction. **PostgreSQL's \`REPEATABLE READ\` also prevents phantom reads** (stricter than the bare SQL standard requires for this level) using its MVCC snapshot mechanism, though it can still permit write skew.
- **\`SERIALIZABLE\`.** Built on top of \`REPEATABLE READ\`'s snapshot, with additional runtime tracking of the specific pattern of reads and writes across concurrent transactions. If PostgreSQL detects that the interleaving of two or more serializable transactions could not have produced a result equivalent to *some* one-at-a-time ordering of them — including write-skew-shaped conflicts — it aborts one of them with a serialization failure, and the application is expected to retry it.

\`READ UNCOMMITTED\` is accepted as a setting name (\`SHOW transaction_isolation\` will even echo it back literally), but **PostgreSQL's actual behaviour under it is identical to \`READ COMMITTED\`** — it never performs a genuine dirty read, at any requested level, because its MVCC architecture (Lesson 4) makes uncommitted row versions invisible to other transactions as a structural property of how rows are stored, not merely as a locking policy that a laxer setting could relax away.

## Setting the isolation level

\`\`\`sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
...statements...
COMMIT;

-- or, once inside a plain BEGIN, before the transaction's first real query:
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
...
\`\`\`

\`\`\`sql
SHOW transaction_isolation;   -- 'read committed' by default
\`\`\`

## Choosing a level in practice

- **\`READ COMMITTED\`** (the default) is right for the overwhelming majority of ordinary application transactions — most single-statement or few-statement operations do not need a stronger guarantee, and it is the cheapest option.
- **\`REPEATABLE READ\`** matters when a transaction runs several queries that must agree with each other — for instance, computing a report from multiple related \`SELECT\`s where the numbers must be internally consistent even if other transactions are committing changes concurrently.
- **\`SERIALIZABLE\`** is for logic where the *correctness* of a business rule depends on what multiple concurrent transactions are doing together, not just what any one of them individually reads and writes — the write-skew scenario. It comes at a real cost: the application must be prepared to catch a serialization failure and retry the transaction, since PostgreSQL will proactively abort one of two conflicting serializable transactions rather than let an inconsistent outcome through.

The next lesson (MVCC) explains the storage mechanism that makes \`READ COMMITTED\`'s and \`REPEATABLE READ\`'s snapshot behaviour possible without readers ever blocking writers.`,

    contentHi: `## Isolation ek dial hai, ek switch nahi

Lesson 1 ne Isolation ko ACID ki chaar properties mein se ek naam diya: concurrent transactions ko ek doosre ka uncommitted, in-progress kaam nahi dekhna chahiye. Par *ye kितna strictly* enforce hota hai configurable hai, kyunki perfect isolation mehanga hai guarantee karna real concurrent load ke under. SQL standard chaar **isolation levels** define karta hai, loosest se strictest tak, aur naam deta hai specific **anomalies** jo har level allow karta hai ya nahi.

## Chaar anomalies

- **Dirty read**: transaction B ek change dekhता hai jo transaction A ne kiya par abhi tak commit nahi kiya. Agar A baad mein rollback hota hai, B ne wo data dekha jo asal mein kabhi exist hi nahi hua.
- **Non-repeatable read**: ek single transaction ke andar, *usī row* ko do baar padhна do *alag* values lौtaता hai, kyunki ek doosre transaction ne beech mein ek change commit kiya.
- **Phantom read**: ek single transaction ke andar, *usी query* ko do baar chalाना ek *alag set of rows* lौtaता hai, kyunki ek doosre transaction ne beech mein ek matching row insert ya delete ki.
- **Write skew**: do transactions har ek kuch overlapping data padhte hain, har ek independently apne dekhे hue ke aadhaar par ek decision leते hain, aur koi bhi single individual change kisī single-row constraint violate nahi karta — par dono changes ka *combination* ek rule violate karta hai.

## Chaar levels, aur wo kya rokte hain

| level | dirty read | non-repeatable read | phantom read |
|---|---|---|---|
| \`READ UNCOMMITTED\` | possible | possible | possible |
| \`READ COMMITTED\` | prevented | possible | possible |
| \`REPEATABLE READ\` | prevented | prevented | possible (standard) |
| \`SERIALIZABLE\` | prevented | prevented | prevented |

## PostgreSQL ka actual implementation

- **\`READ COMMITTED\` — default.** Transaction ke andar har *statement* database ka ek fresh snapshot dekhता hai jo us statement shuru hone ke pal liya gaya. Ye dirty reads rokने ke liye kaafi hai, par non-repeatable ya phantom reads nahi.
- **\`REPEATABLE READ\`.** *Poora transaction* ek snapshot leta hai, iski pehli query par, aur usmein har agla statement wahi snapshot dekhta hai. **PostgreSQL ka \`REPEATABLE READ\` phantom reads bhi rokта hai** (bare SQL standard se strict), chahe ye abhi bhi write skew allow kar sake.
- **\`SERIALIZABLE\`.** \`REPEATABLE READ\`'s snapshot ke upar, additional runtime tracking ke saath. Agar PostgreSQL detect karta hai ki do ya zyada serializable transactions ka interleaving kisī bhi one-at-a-time ordering ke barabar result produce nahi kar sakta tha, ye ek ko ek serialization failure ke saath abort karta hai.

\`READ UNCOMMITTED\` ek setting naam ke roop mein accepted hai, par **PostgreSQL ka iske under actual behaviour \`READ COMMITTED\` ke identical hai** — ye kisī requested level par kabhi ek genuine dirty read perform nahi karta, kyunki iska MVCC architecture (Lesson 4) uncommitted row versions ko doosre transactions se invisible banata hai ek structural property ke roop mein.

## Level set karna

\`\`\`sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
...statements...
COMMIT;
\`\`\`

## Practice mein ek level chunना

- **\`READ COMMITTED\`** (default) zyadатार ordinary application transactions ke liye sahi hai.
- **\`REPEATABLE READ\`** maayne rakhता hai jab ek transaction kई queries chalाता hai jinhe ek doosre se agree karna chahiye.
- **\`SERIALIZABLE\`** us logic ke liye hai jahaan ek business rule ki correctness is baat par depend karti hai ki kई concurrent transactions saath mein kya kar rahe hain — write-skew scenario. Iski ek real cost hai: application ko ek serialization failure catch karne aur transaction retry karne ke liye taiyार hona chahiye.

Agla lesson (MVCC) us storage mechanism ko explain karta hai jo readers ko writers ko block kiye bina \`READ COMMITTED\`'s aur \`REPEATABLE READ\`'s snapshot behaviour possible banата hai.`,

    examples: [
      {
        title: 'The default isolation level is READ COMMITTED',
        titleHi: 'Default isolation level READ COMMITTED hai',
        code: `SHOW transaction_isolation;`,
        output: ` transaction_isolation
-----------------------
 read committed
(1 row)`,
        explain: "With no isolation level explicitly requested, `SHOW transaction_isolation` reports PostgreSQL's default: `read committed`. This is the level every ordinary, unadorned transaction runs at unless something sets a different one.",
        explainHi: 'Koi isolation level explicitly request na hone par, `SHOW transaction_isolation` PostgreSQL ka default report karta hai: `read committed`. Ye wo level hai jispar har ordinary, unadorned transaction chalता hai jab tak kuch alag set na kare.',
      },
      {
        title: 'Setting REPEATABLE READ and SERIALIZABLE explicitly, confirmed with SHOW',
        titleHi: 'REPEATABLE READ aur SERIALIZABLE explicitly set karna, SHOW se confirm',
        code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SHOW transaction_isolation;
COMMIT;

BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SHOW transaction_isolation;
COMMIT;`,
        output: ` transaction_isolation
-----------------------
 repeatable read
(1 row)

 transaction_isolation
-----------------------
 serializable
(1 row)`,
        explain: '`BEGIN ISOLATION LEVEL REPEATABLE READ` explicitly requests that level for the transaction, and `SHOW transaction_isolation` confirms it took effect: `repeatable read`. The second block shows the equivalent using `SET TRANSACTION ISOLATION LEVEL` after a plain `BEGIN`, requesting `SERIALIZABLE`, and `SHOW` confirms that too.',
        explainHi: '`BEGIN ISOLATION LEVEL REPEATABLE READ` transaction ke liye explicitly wo level request karta hai, aur `SHOW transaction_isolation` confirm karta hai ki ye effect mein aaya: `repeatable read`. Doosra block ek plain `BEGIN` ke baad `SET TRANSACTION ISOLATION LEVEL` istemal karके equivalent dikhata hai, `SERIALIZABLE` request karte hue, aur `SHOW` isे bhi confirm karta hai.',
      },
      {
        title: 'PostgreSQL accepts READ UNCOMMITTED as a setting name (its real behavior is still READ COMMITTED)',
        titleHi: 'PostgreSQL READ UNCOMMITTED ko ek setting naam ke roop mein accept karta hai (iska real behavior abhi bhi READ COMMITTED hai)',
        code: `BEGIN ISOLATION LEVEL READ UNCOMMITTED;
SHOW transaction_isolation;
COMMIT;`,
        output: ` transaction_isolation
-----------------------
 read uncommitted
(1 row)`,
        explain: "PostgreSQL accepts `READ UNCOMMITTED` as a valid setting name — `SHOW transaction_isolation` echoes it back literally, `read uncommitted` — but this is purely a label. PostgreSQL's actual row-visibility mechanism (MVCC, Lesson 4) behaves identically to `READ COMMITTED` no matter which of these two names was requested; a true dirty read never occurs at any level.",
        explainHi: 'PostgreSQL `READ UNCOMMITTED` ko ek valid setting naam ke roop mein accept karta hai — `SHOW transaction_isolation` ise literally echo karta hai, `read uncommitted` — par ye purी tarah ek label hai. PostgreSQL ka actual row-visibility mechanism (MVCC, Lesson 4) `READ COMMITTED` ke identical behave karta hai chahe in do naamों mein se koi bhi request kiya gaya ho; ek true dirty read kisī bhi level par kabhi nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: `-- SESSION A                              -- SESSION B (concurrent, illustrative)
BEGIN;                                       BEGIN;
UPDATE acct SET bal = bal - 500               SELECT bal FROM acct WHERE id = 1;
  WHERE id = 1;   -- not committed yet          -- at READ UNCOMMITTED (in a database
                                                 -- that truly implements it), B would
                                                 -- see the -500, still-uncommitted change
ROLLBACK;                                     -- if A then rolls back, B acted on data
                                                 -- that never actually existed: a DIRTY READ`,
        right: `-- PostgreSQL: B's SELECT at ANY isolation level, including "read uncommitted",
-- never sees A's uncommitted change -- it sees the value from BEFORE A's UPDATE,
-- because PostgreSQL's MVCC makes uncommitted row versions invisible to other
-- transactions structurally, not merely as a relaxable locking policy`,
        why: 'A dirty read means one transaction observes another transaction\'s change before that change is committed, which is dangerous specifically because the change might later be rolled back, leaving the reader having acted on data that the database itself never considered to have really happened. The SQL standard\'s loosest isolation level, read uncommitted, technically permits this. PostgreSQL accepts read uncommitted as a valid setting name, but its actual row-visibility mechanism, MVCC, guarantees that a transaction only ever sees row versions committed before its own snapshot was taken, independent of which isolation level was requested. Because that guarantee comes from how rows are physically stored and versioned rather than from a lock that a looser setting could simply skip, PostgreSQL never produces a true dirty read at any isolation level, making it, in this one specific respect, stricter than the SQL standard technically requires.',
        whyHi: 'Ek dirty read ka matlab hai ek transaction doosre transaction ka change us change ke commit hone se pehle observe karta hai, jo specifically dangerous hai kyunki wo change baad mein rollback ho sakta hai. SQL standard ka sabse loose isolation level, read uncommitted, technically ise permit karta hai. PostgreSQL read uncommitted ko ek valid setting naam ke roop mein accept karta hai, par iska actual row-visibility mechanism, MVCC, guarantee karta hai ki ek transaction sirf wo row versions dekhता hai jo iski apni snapshot lene se pehle committed the, chahe koi bhi isolation level request ki gayi ho.',
      },
      {
        wrong: `-- assuming REPEATABLE READ alone prevents every concurrency bug, including write skew
-- SESSION A (REPEATABLE READ)              -- SESSION B (REPEATABLE READ, concurrent)
BEGIN;                                        BEGIN;
SELECT count(*) FROM oncall WHERE on_duty;    SELECT count(*) FROM oncall WHERE on_duty;
  -- sees 2 doctors on duty                     -- ALSO sees 2 doctors on duty (its own snapshot)
UPDATE oncall SET on_duty = false               UPDATE oncall SET on_duty = false
  WHERE doctor = 'Ada';  -- "at least 1 left"      WHERE doctor = 'Bo';    -- "at least 1 left"
COMMIT;                                       COMMIT;
-- both commits succeed under REPEATABLE READ -- now ZERO doctors are on duty,
-- violating a rule that depended on BOTH decisions together: WRITE SKEW`,
        right: `-- use SERIALIZABLE for logic where a rule's correctness depends on what MULTIPLE
-- concurrent transactions are doing together, not just each one's own reads/writes:
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT count(*) FROM oncall WHERE on_duty;
UPDATE oncall SET on_duty = false WHERE doctor = 'Ada';
COMMIT;   -- PostgreSQL detects the conflicting pattern across the two transactions
          -- and ABORTS one of them with a serialization failure -- the application
          -- must catch this and retry`,
        why: 'REPEATABLE READ guarantees each transaction sees a single, unchanging snapshot for its own reads, and in PostgreSQL specifically it also prevents phantom reads, but it does not analyze whether the combination of two transactions\' independent, individually-valid decisions violates a rule that depended on both of them. Each doctor-off-duty transaction, considered alone, correctly saw two doctors on duty and left one behind, satisfying the rule from its own point of view; the problem only exists in the combination, which is exactly the write skew anomaly, and REPEATABLE READ\'s per-transaction consistent snapshot does nothing to detect it. SERIALIZABLE is built specifically to catch this class of problem: PostgreSQL tracks the pattern of reads and writes across concurrently running serializable transactions and, if it detects that no ordering of them one after another could have produced the same result, aborts one with a serialization failure, forcing the application to retry it, typically succeeding the second time once the conflicting transaction is no longer concurrent.',
        whyHi: '`REPEATABLE READ` guarantee karta hai ki har transaction apne reads ke liye ek single, unchanging snapshot dekhता hai, aur PostgreSQL mein specifically ye phantom reads bhi rokta hai, par ye analyze nahi karta ki do transactions ke independent, individually-valid decisions ka combination ek rule violate karta hai ya nahi jo dono par depend karta tha. Har doctor-off-duty transaction, akele consider kiya gaya, sahi se do doctors on duty dekha aur ek ko chhoड़ा, apne point of view se rule satisfy karte hue; problem sirf combination mein exist karta hai, jo theek write skew anomaly hai. `SERIALIZABLE` specifically is class ki problem pakड़ने ke liye bana hai.',
      },
      {
        wrong: `-- expecting SERIALIZABLE to just work with no other changes to the application
BEGIN ISOLATION LEVEL SERIALIZABLE;
UPDATE oncall SET on_duty = false WHERE doctor = 'Ada';
COMMIT;   -- occasionally raises: ERROR: could not serialize access due to
          -- read/write dependencies among transactions
-- application crashes / shows the user a raw database error`,
        right: `-- application code must catch the serialization failure and retry the WHOLE
-- transaction from the beginning (typically the conflict is gone on retry):
-- try:
--   BEGIN ISOLATION LEVEL SERIALIZABLE; ...; COMMIT;
-- except SerializationFailure:
--   retry the same transaction (often with a short backoff / retry limit)`,
        why: 'SERIALIZABLE is not free: it comes with an explicit contract that the application must uphold, which is that a serialization failure is an expected, normal outcome under concurrent load, not an exceptional bug to crash on. When PostgreSQL detects that the interleaving of concurrent serializable transactions could not correspond to any one-at-a-time ordering, it deliberately aborts one of them rather than committing an inconsistent result, and it reports this with a specific, recognizable error. Code using SERIALIZABLE has to catch that specific error and retry the entire transaction from its beginning, since simply propagating the error to the user or treating it as a fatal condition defeats the purpose of using the strictest isolation level to guarantee correctness in the first place.',
        whyHi: '`SERIALIZABLE` free nahi hai: iske saath ek explicit contract aata hai jise application ko uphold karна hai, jo ye hai ki ek serialization failure concurrent load ke under ek expected, normal outcome hai, crash karne ke liye ek exceptional bug nahi. Jab PostgreSQL detect karta hai ki concurrent serializable transactions ka interleaving kisī bhi one-at-a-time ordering se correspond nahi kar sakta tha, ye jaan-boojhkar unmein se ek ko abort karta hai. `SERIALIZABLE` istemal karne waale code ko wo specific error catch karna hai aur poori transaction ko iske shuru se retry karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**A financial reconciliation job run at `REPEATABLE READ`** so several related `SELECT`s (a balance sheet drawn from multiple queries) agree with each other even while other transactions are committing changes concurrently.',
        hi: '**Ek financial reconciliation job `REPEATABLE READ` par chalाya gaya** taaki kई related `SELECT`s ek doosre se agree karें.',
      },
      {
        en: '**A seat-booking or inventory-decrement flow that switched from `READ COMMITTED` to `SERIALIZABLE` after a write-skew bug allowed two concurrent bookings to both succeed and oversell the last seat.**',
        hi: '**Ek seat-booking flow jo ek write-skew bug ke baad `READ COMMITTED` se `SERIALIZABLE` mein switch hui**.',
      },
      {
        en: '**Retry-with-backoff wrapping around every `SERIALIZABLE` transaction** in a codebase, treating a serialization failure as an expected, routine outcome rather than an application error.',
        hi: '**Ek codebase mein har `SERIALIZABLE` transaction ke around retry-with-backoff wrap kiya gaya**, ek serialization failure ko ek expected, routine outcome ki tarah treat karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Define dirty read, non-repeatable read, and phantom read, and say which PostgreSQL isolation levels prevent each.',
        qHi: 'Dirty read, non-repeatable read, aur phantom read define karo, aur batao kaunसे PostgreSQL isolation levels har ek rokte hain.',
        a: 'A dirty read happens when a transaction sees another transaction\'s change before that other transaction has committed, which is dangerous because the change might later be rolled back, meaning the reader acted on data the database itself never really finalized. A non-repeatable read happens when a transaction reads the same row twice and gets two different values because a separate, concurrent transaction committed a change to that row in between the two reads. A phantom read happens when a transaction runs the same query, with the same WHERE condition, twice and gets a different set of matching rows because another transaction inserted or deleted a qualifying row in between. In PostgreSQL, read committed, the default, prevents dirty reads but permits both non-repeatable and phantom reads, since each individual statement in the transaction sees a fresh snapshot rather than one shared snapshot for the whole transaction. Repeatable read takes one snapshot for the entire transaction, so re-reading a row or re-running a query always gives the same answer, which prevents both non-repeatable reads and, in PostgreSQL specifically, phantom reads too, going beyond what the bare SQL standard requires for that level. Serializable prevents all three, plus the more subtle write skew anomaly, by additionally tracking dependencies across concurrently running transactions and aborting one if their combined effect could not correspond to any strictly one-at-a-time ordering.',
        aHi: 'Ek dirty read tab hota hai jab ek transaction doosre transaction ka change dekhता hai us doosre transaction ke commit hone se pehle. Ek non-repeatable read tab hota hai jab ek transaction usी row ko do baar padhता hai aur do alag values paata hai kyunki ek alag, concurrent transaction ne us row par ek change commit kiya beech mein. Ek phantom read tab hota hai jab ek transaction usी query, usī `WHERE` condition ke saath, do baar chalाता hai aur matching rows ka ek alag set paata hai. PostgreSQL mein, read committed, default, dirty reads rokta hai par dono non-repeatable aur phantom reads permit karta hai. Repeatable read poore transaction ke liye ek snapshot leta hai, jo dono non-repeatable reads aur, PostgreSQL mein specifically, phantom reads bhi rokta hai. Serializable teenon rokta hai, plus zyada subtle write skew anomaly.',
      },
      {
        q: 'What is write skew, and why doesn\'t `REPEATABLE READ` prevent it while `SERIALIZABLE` does?',
        qHi: 'Write skew kya hai, aur `REPEATABLE READ` ise kyun nahi rokta jabki `SERIALIZABLE` rokta hai?',
        a: 'Write skew happens when two concurrent transactions each read some overlapping data, each independently make a change that is individually valid given what they read, and neither transaction\'s own write violates any single-row constraint by itself, but the combination of both changes together violates a business rule that depended on the state both transactions were looking at. A classic example is a rule requiring at least one of two on-call staff to remain on duty: each staff member\'s transaction checks whether the other is still on duty, sees yes, and independently decides it is fine to go off duty, so both transactions commit successfully and the rule ends up violated even though neither transaction did anything wrong in isolation. Repeatable read does not catch this because its guarantee is only about what a single transaction\'s own reads look like, a consistent snapshot from the start of that transaction, it says nothing about coordinating or comparing the decisions of multiple concurrent transactions against each other. Serializable is built specifically to close this gap: it tracks the pattern of reads and writes across all concurrently running serializable transactions and checks whether their combined effect could have arisen from some strict one-transaction-at-a-time ordering; if it could not, which is exactly the shape of a write skew conflict, PostgreSQL aborts one of the transactions with a serialization failure rather than letting the inconsistent combined result commit.',
        aHi: 'Write skew tab hota hai jab do concurrent transactions har ek kuch overlapping data padhte hain, har ek independently ek change karta hai jo unhone jo dekha uske hisab se individually valid hai, aur koi bhi transaction ka apna write kisī single-row constraint ko apne aap violate nahi karta, par dono changes ka combination ek business rule violate karta hai jo dono transactions dekh rahe the us state par depend karta tha. Repeatable read ise nahi pakड़ता kyunki iska guarantee sirf ek single transaction ke apne reads ke baare mein hai. Serializable specifically is gap ko band karne ke liye bana hai: ye sabhi concurrently running serializable transactions ke reads aur writes ka pattern track karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Run `SHOW transaction_isolation` with no transaction open and confirm it reports `read committed`. Then run it again inside `BEGIN ISOLATION LEVEL SERIALIZABLE; ... COMMIT;` and confirm it reports `serializable`.',
        taskHi: '`SHOW transaction_isolation` bina kisi transaction ke chalao aur confirm karo ye `read committed` report karta hai. Phir `BEGIN ISOLATION LEVEL SERIALIZABLE; ... COMMIT;` ke andar chalao aur confirm karo ye `serializable` report karta hai.',
        hint: 'READ COMMITTED is PostgreSQL\'s default when no isolation level is explicitly requested. Inside an explicit `BEGIN ISOLATION LEVEL ...` block, `SHOW transaction_isolation` reflects the level actually in effect for that transaction.',
        hintHi: 'READ COMMITTED PostgreSQL ka default hai jab koi isolation level explicitly request nahi ki gayi. Ek explicit `BEGIN ISOLATION LEVEL ...` block ke andar, `SHOW transaction_isolation` us level ko reflect karta hai jo us transaction ke liye actual mein effect mein hai.',
      },
      {
        task: 'For each of the following, name the anomaly it describes: (a) reading a row twice in one transaction and getting two different values because someone else committed a change in between; (b) seeing someone else\'s update before they have committed it; (c) running the same `WHERE` query twice and getting a different number of rows because someone else inserted a matching row in between.',
        taskHi: 'In mein se har ek ke liye, jo anomaly ye describe karta hai use naam do: (a) ek transaction mein ek row ko do baar padhна aur do alag values paana; (b) kisi ke commit karne se pehle unka update dekhна; (c) usी `WHERE` query ko do baar chalाना aur alag sankhya mein rows paana.',
        hint: '(a) non-repeatable read. (b) dirty read. (c) phantom read.',
        hintHi: '(a) non-repeatable read. (b) dirty read. (c) phantom read.',
      },
      {
        task: 'Explain in a comment (no SQL needed) why PostgreSQL never produces a true dirty read, even when a transaction explicitly requests `READ UNCOMMITTED`.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi) samjhaओ ki PostgreSQL kabhi ek true dirty read produce kyun nahi karta, chahe ek transaction explicitly `READ UNCOMMITTED` request kare.',
        hint: 'PostgreSQL\'s MVCC (Lesson 4) makes uncommitted row versions structurally invisible to other transactions — this is a property of how rows are stored and versioned, not a lock that a looser isolation setting could relax away.',
        hintHi: 'PostgreSQL ka MVCC (Lesson 4) uncommitted row versions ko doosre transactions se structurally invisible banata hai — ye rows kaise store aur versioned hoti hain iska ek property hai, ek lock nahi jise ek looser isolation setting relax kar sake.',
      },
    ],

    keyTakeaways: [
      'Isolation is a DIAL: the SQL standard defines FOUR levels (loosest to strictest: `READ UNCOMMITTED` -> `READ COMMITTED` -> `REPEATABLE READ` -> `SERIALIZABLE`) and FOUR anomalies they trade off (dirty read, non-repeatable read, phantom read, write skew).',
      'DIRTY READ = seeing another transaction\'s UNCOMMITTED change (dangerous: it might roll back). NON-REPEATABLE READ = the SAME ROW read twice in one transaction gives DIFFERENT values (another transaction committed a change in between). PHANTOM READ = the SAME QUERY run twice returns a DIFFERENT SET OF ROWS (another transaction inserted/deleted a match in between). WRITE SKEW = two transactions each individually-valid, but their COMBINATION violates a rule depending on both.',
      'STANDARD table: `READ COMMITTED` prevents dirty reads only. `REPEATABLE READ` also prevents non-repeatable reads. `SERIALIZABLE` prevents all three (and write skew).',
      'POSTGRESQL SPECIFICS: default is `READ COMMITTED` (fresh snapshot PER STATEMENT). `REPEATABLE READ` takes ONE snapshot for the whole transaction and ALSO prevents phantom reads (stricter than the bare standard requires). `SERIALIZABLE` additionally tracks read/write dependencies across concurrent transactions and ABORTS one with a serialization failure if their combined effect couldn\'t match any one-at-a-time ordering — this ALSO catches write skew.',
      '`READ UNCOMMITTED` is ACCEPTED as a setting name in PostgreSQL (`SHOW` echoes it back), but its ACTUAL behavior is IDENTICAL to `READ COMMITTED` — PostgreSQL NEVER performs a true dirty read at any level, because MVCC (Lesson 4) makes uncommitted rows structurally invisible to others, not merely lock-protected.',
      'CHOOSING: `READ COMMITTED` (default) for the vast majority of ordinary transactions. `REPEATABLE READ` when several queries in one transaction must agree with each other (a multi-query report). `SERIALIZABLE` when a business rule\'s correctness depends on what MULTIPLE concurrent transactions do TOGETHER (write-skew-shaped logic) — but the application MUST catch a serialization failure and RETRY the whole transaction; treating it as a fatal error defeats the point.',
      'Set with `BEGIN ISOLATION LEVEL X` or `SET TRANSACTION ISOLATION LEVEL X` (right after `BEGIN`, before the first real query); check with `SHOW transaction_isolation`.',
    ],
    keyTakeawaysHi: [
      'Isolation ek DIAL hai: SQL standard CHAAR levels define karta hai (loosest se strictest: `READ UNCOMMITTED` -> `READ COMMITTED` -> `REPEATABLE READ` -> `SERIALIZABLE`) aur CHAAR anomalies jo wo trade off karte hain.',
      'DIRTY READ = ek doosre transaction ka UNCOMMITTED change dekhna. NON-REPEATABLE READ = ek transaction mein SAME ROW do baar padhna ALAG values deta hai. PHANTOM READ = SAME QUERY do baar chalane par ALAG SET OF ROWS. WRITE SKEW = do transactions har ek individually-valid, par unka COMBINATION ek rule violate karta hai.',
      'STANDARD table: `READ COMMITTED` sirf dirty reads rokta hai. `REPEATABLE READ` non-repeatable reads bhi rokta hai. `SERIALIZABLE` teenon rokta hai (aur write skew).',
      'POSTGRESQL SPECIFICS: default `READ COMMITTED` hai (PRATI STATEMENT fresh snapshot). `REPEATABLE READ` poore transaction ke liye EK snapshot leta hai AUR phantom reads bhi rokta hai. `SERIALIZABLE` additionally concurrent transactions ke across read/write dependencies track karta hai aur ek ko ABORT karta hai — ye write skew BHI pakड़ता hai.',
      '`READ UNCOMMITTED` PostgreSQL mein ek setting naam ke roop mein ACCEPTED hai, par iska ACTUAL behavior `READ COMMITTED` ke IDENTICAL hai — PostgreSQL kisī level par kabhi ek true dirty read perform NAHI karta.',
      'CHOOSING: zyadатار ordinary transactions ke liye `READ COMMITTED` (default). Jab ek transaction mein kई queries ek doosre se agree karni chahiye tab `REPEATABLE READ`. Jab ek business rule ki correctness is baat par depend karti hai ki MULTIPLE concurrent transactions SAATH mein kya karte hain tab `SERIALIZABLE` — par application ko ek serialization failure catch karna aur poori transaction RETRY karna hoga.',
      '`BEGIN ISOLATION LEVEL X` ya `SET TRANSACTION ISOLATION LEVEL X` se set karo; `SHOW transaction_isolation` se check karo.',
    ],
  },
];
