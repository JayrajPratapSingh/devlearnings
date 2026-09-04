/**
 * Databases Complete Course — Module 3: Joins, lessons 1-3.
 *
 * Lesson 1: the join model & INNER JOIN — FROM as a combined row set, ON as the match
 *           condition, INNER JOIN, ON vs WHERE, multi-column joins, USING, NATURAL JOIN
 *           (and why to avoid it), joining three or more tables, join order for INNER.
 * Lesson 2: outer joins — LEFT / RIGHT / FULL, NULL-padding, the "filter the right table
 *           in ON not WHERE" trap for LEFT JOIN, the anti-join (WHERE right.pk IS NULL),
 *           LEFT JOIN + COUNT gotchas.
 * Lesson 3: self-joins & non-equi joins — a table joined to itself (aliases required),
 *           manager/hierarchy, pair comparisons, range/BETWEEN joins, and a `<` join for
 *           unordered pairs.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 3
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_3: CourseLesson[] = [
  {
    slug: 'sql-joins-inner-and-the-join-model',
    title: 'The Join Model & `INNER JOIN`: `ON`, `USING`, Multi-Table',
    titleHi: 'Join Model Aur `INNER JOIN`: `ON`, `USING`, Multi-Table',
    description: 'A join combines rows from two tables into wider rows. Conceptually the database pairs every left row with every right row, then keeps the pairs where the `ON` condition is `TRUE`. `INNER JOIN` returns only matched pairs — an unmatched row on either side disappears.',
    descriptionHi: 'Ek join do tables ki rows ko wider rows mein combine karta hai. Conceptually database har left row ko har right row ke saath pair karta hai, phir un pairs ko rakhta hai jahaan `ON` condition `TRUE` hai. `INNER JOIN` sirf matched pairs return karta hai — kisi bhi side par ek unmatched row gायab ho jati hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Matching two stacks of cards by a shared number.** You have a stack of *order* cards, each with a customer number written on it, and a stack of *customer* cards, each with its number and a name. To produce a list of "order plus the customer\'s name", you go through every order card, find the customer card with the matching number, and staple them together into one wider card. That stapling is the join, and "the numbers match" is the `ON` condition. An **inner** join is strict: if an order card has a customer number that is not in the customer stack — a typo, a deleted customer — that order card is *thrown away*, not kept with blanks. Likewise a customer with no orders never appears. You only get the cards that could be successfully stapled on both sides. Joining a third stack (say *products*) is the same move again: staple the already-stapled order+customer card to the matching product card. And the `ON` condition is a real test, so a card with a *blank* number matches nothing — because "blank equals 7" is not true, it is unknown.',
      hi: '**Do cards ke stacks ko ek shared number se match karna.** Aapke paas *order* cards ka ek stack hai, har ek par ek customer number likha, aur *customer* cards ka ek stack, har ek par iska number aur ek naam. "order plus customer ka naam" ki ek list banane ke liye, aap har order card se guzarte ho, matching number waala customer card dhoondhte ho, aur unhe ek wider card mein staple karte ho. Wo stapling join hai, aur "numbers match" `ON` condition hai. Ek **inner** join strict hai: agar ek order card par ek customer number hai jo customer stack mein nahi hai — ek typo, ek deleted customer — wo order card *phenk diya jata hai*, blanks ke saath nahi rakha jata. Waise hi bina orders waala ek customer kabhi nahi dikhta. Ek teesra stack join karna wahi move phir se hai. Aur `ON` condition ek real test hai, to ek *blank* number waala card kuch match nahi karta — kyunki "blank equals 7" true nahi hai, ye unknown hai.',
    },

    simple: `**The mental model**

\`\`\`
FROM a JOIN b ON a.x = b.y
  1. form every (a-row, b-row) pair            -- conceptually a x b
  2. keep the pairs where  a.x = b.y  is TRUE  -- the ON condition
  3. the output row is a's columns + b's columns, side by side
\`\`\`

**\`INNER JOIN\` — only matched pairs survive**

\`\`\`sql
SELECT e.name, d.name AS dept
FROM   employee e
JOIN   department d ON e.dept_id = d.id;     -- "JOIN" == "INNER JOIN"
-- an employee whose dept_id has no matching department  -> dropped
-- a department with no employees                        -> dropped
-- an employee whose dept_id IS NULL  (NULL = d.id is UNKNOWN) -> dropped
\`\`\`

**\`ON\` vs \`WHERE\` (for an INNER join they are interchangeable — for OUTER they are NOT, Lesson 2)**

\`\`\`sql
FROM a JOIN b ON a.x = b.y AND b.active            -- match condition
FROM a JOIN b ON a.x = b.y  WHERE b.active         -- same result for INNER
\`\`\`

**Multi-column join**

\`\`\`sql
FROM order_line ol
JOIN inventory i
  ON i.warehouse_id = ol.warehouse_id
 AND i.sku          = ol.sku            -- both must match
\`\`\`

**\`USING (col)\` — shorthand when the columns have the SAME name**

\`\`\`sql
FROM orders o JOIN customer c USING (customer_id)
-- = ON o.customer_id = c.customer_id, AND the output has ONE "customer_id" column, not two
\`\`\`

**\`NATURAL JOIN\` — joins on ALL same-named columns. Avoid it.**

\`\`\`sql
FROM a NATURAL JOIN b     -- auto-joins on every column name a and b share
-- fragile: add a "created_at" or "notes" column to both tables later and the join silently changes
\`\`\`

**Joining three or more tables**

\`\`\`sql
SELECT o.id, c.name, p.title
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN order_line ol ON ol.order_id = o.id
JOIN product p ON p.id = ol.product_id;
-- for INNER joins the order you write them does not change the result
\`\`\``,

    simpleHi: `**Mental model**

\`\`\`
FROM a JOIN b ON a.x = b.y
  1. har (a-row, b-row) pair banao            -- conceptually a x b
  2. un pairs ko rakho jahaan  a.x = b.y  TRUE hai  -- ON condition
  3. output row a ke columns + b ke columns, side by side
\`\`\`

**\`INNER JOIN\` — sirf matched pairs bachte hain**

\`\`\`sql
SELECT e.name, d.name AS dept
FROM   employee e
JOIN   department d ON e.dept_id = d.id;     -- "JOIN" == "INNER JOIN"
-- ek employee jiske dept_id ka koi matching department nahi -> dropped
-- ek department bina employees ke                          -> dropped
-- ek employee jiska dept_id IS NULL  (NULL = d.id UNKNOWN)  -> dropped
\`\`\`

**\`ON\` vs \`WHERE\` (ek INNER join ke liye interchangeable — OUTER ke liye NAHI, Lesson 2)**

\`\`\`sql
FROM a JOIN b ON a.x = b.y AND b.active            -- match condition
FROM a JOIN b ON a.x = b.y  WHERE b.active         -- INNER ke liye same result
\`\`\`

**Multi-column join**

\`\`\`sql
FROM order_line ol
JOIN inventory i ON i.warehouse_id = ol.warehouse_id AND i.sku = ol.sku
\`\`\`

**\`USING (col)\` — shorthand jab columns ka naam SAME ho**

\`\`\`sql
FROM orders o JOIN customer c USING (customer_id)
-- = ON o.customer_id = c.customer_id, AUR output mein EK "customer_id" column, do nahi
\`\`\`

**\`NATURAL JOIN\` — SABHI same-named columns par join. Ise avoid karo.**

\`\`\`sql
FROM a NATURAL JOIN b     -- har column name par auto-join jo a aur b share karte hain
-- fragile: dono tables mein baad mein "created_at" add karo aur join chupchaap badal jata hai
\`\`\`

**Teen ya zyada tables join karna**

\`\`\`sql
SELECT o.id, c.name, p.title
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN order_line ol ON ol.order_id = o.id
JOIN product p ON p.id = ol.product_id;
-- INNER joins ke liye jo order aap likhte ho wo result nahi badalta
\`\`\``,

    content: `## What a join actually is

Conceptually, \`FROM a JOIN b ON <condition>\` is a two-step operation:

1. **Combine** — form the set of all possible \`(a_row, b_row)\` pairs. This is the Cartesian product, \`a × b\`: if \`a\` has 100 rows and \`b\` has 50, that is 5,000 combined rows, each holding all of \`a\`'s columns *and* all of \`b\`'s columns.
2. **Filter** — evaluate \`<condition>\` for every combined row and keep the ones where it is \`TRUE\`.

The database does not literally build the full product (that would be catastrophic) — the planner uses indexes and algorithms (nested loop, hash join, merge join — Module 10) to produce the same result efficiently. But the *meaning* is "combine then filter", and that model explains every join behaviour.

## \`INNER JOIN\`

An **inner join** returns only the combined rows where the \`ON\` condition is \`TRUE\`. \`JOIN\` with no qualifier means \`INNER JOIN\`. Three consequences:

- A left row with **no matching right row** produces no output. (An order pointing at a customer that was deleted → the order vanishes from the result.)
- A right row with **no matching left row** produces no output. (A customer who has never ordered → absent.)
- A row where the join column is **\`NULL\`** matches nothing: \`e.dept_id = d.id\` is \`UNKNOWN\` when \`e.dept_id\` is \`NULL\`, and the pair is dropped (Module 1, three-valued logic).

If you need to keep the unmatched rows, you want an **outer** join (Lesson 2).

## \`ON\` vs \`WHERE\`

For an **inner** join, the \`ON\` condition and a \`WHERE\` clause are logically equivalent — both filter the combined rows, and the planner treats \`FROM a JOIN b ON a.x = b.y AND b.active = true\` identically to \`FROM a JOIN b ON a.x = b.y WHERE b.active = true\`. Style convention: put the **join relationship** (\`a.x = b.y\`) in \`ON\` and **filters on the result** (\`b.active\`) in \`WHERE\`, because it reads more clearly and because that distinction *does* matter for outer joins (Lesson 2), so keeping the habit avoids bugs when you later change \`JOIN\` to \`LEFT JOIN\`.

## Multi-column joins

When the relationship is a composite key, the \`ON\` has multiple \`AND\`-ed equalities:

\`\`\`sql
FROM order_line ol
JOIN inventory inv
  ON inv.warehouse_id = ol.warehouse_id
 AND inv.sku          = ol.sku
\`\`\`

All parts must be \`TRUE\` for the pair to survive.

## \`USING\` and \`NATURAL JOIN\`

- **\`JOIN b USING (col1, col2)\`** — shorthand for \`ON a.col1 = b.col1 AND a.col2 = b.col2\`, *and* it merges the joined columns: the output has one \`col1\`, not \`a.col1\` and \`b.col1\`. Requires the columns to have identical names on both sides. Convenient and readable when your schema names foreign keys after the referenced primary key (\`customer.id\` ↔ \`orders.customer_id\` would *not* work with \`USING\`; \`customer.customer_id\` ↔ \`orders.customer_id\` would).
- **\`a NATURAL JOIN b\`** — joins on **every column name the two tables share**, automatically. This is dangerous: it is invisible in the query which columns it joined on, and adding a same-named column to either table later (an \`updated_at\`, a \`notes\`) **silently changes the join** and can quietly break the query or destroy performance. **Do not use \`NATURAL JOIN\` in code you will keep.** Always spell out \`ON\` or \`USING\`.

## Joining three or more tables

Each additional \`JOIN\` combines the running result with another table:

\`\`\`sql
FROM orders o
JOIN customer   c  ON c.id = o.customer_id
JOIN order_line ol ON ol.order_id = o.id
JOIN product    p  ON p.id = ol.product_id
\`\`\`

- Read it as a chain: \`orders\` → its \`customer\` → its \`order_line\`s → each line's \`product\`.
- **For inner joins the textual order does not change the result** — \`A JOIN B JOIN C\` returns the same rows as \`A JOIN C JOIN B\` (though the planner may choose a different execution order for speed). *Outer* joins are order-sensitive.
- Watch the **cardinality**: \`orders JOIN order_line\` is one-to-many, so an order with 3 lines becomes 3 rows. If you then aggregate (\`sum(o.total)\`) you double-count — that is fan-out (Lesson 4).
- Every table in the chain needs a path to the rest via some \`ON\`. A \`JOIN\` with a missing or wrong \`ON\` becomes an accidental Cartesian product (Lesson 4).

## Qualifying column names

Once two tables are in scope, an unqualified column that exists in both (\`id\`, \`name\`, \`created_at\`) is **ambiguous** and raises \`column reference "id" is ambiguous\`. Always alias your tables (\`orders o\`, \`customer c\`) and qualify every column (\`o.id\`, \`c.name\`) in a multi-table query — it is required where names collide and it makes the query readable everywhere else.`,

    contentHi: `## Ek join asal mein kya hai

Conceptually, \`FROM a JOIN b ON <condition>\` ek do-step operation hai:

1. **Combine** — sabhi sambhaavit \`(a_row, b_row)\` pairs ka set banao. Ye Cartesian product hai, \`a × b\`.
2. **Filter** — har combined row ke liye \`<condition>\` evaluate karo aur un ko rakho jahaan ye \`TRUE\` hai.

Database literally poora product nahi banata — planner indexes aur algorithms (nested loop, hash join, merge join — Module 10) istemal karta hai. Par *matlab* "combine phir filter" hai.

## \`INNER JOIN\`

Ek **inner join** sirf wo combined rows return karta hai jahaan \`ON\` condition \`TRUE\` hai. Bina qualifier ke \`JOIN\` matlab \`INNER JOIN\`. Teen consequences:

- Ek left row jiska **koi matching right row nahi** koi output nahi deta.
- Ek right row jiska **koi matching left row nahi** koi output nahi deta.
- Ek row jahaan join column **\`NULL\`** hai kuch match nahi karti (three-valued logic).

Agar aapko unmatched rows rakhni hain, aapko ek **outer** join chahiye (Lesson 2).

## \`ON\` vs \`WHERE\`

Ek **inner** join ke liye, \`ON\` condition aur ek \`WHERE\` clause logically equivalent hain. Style convention: **join relationship** (\`a.x = b.y\`) \`ON\` mein daalo aur **result par filters** (\`b.active\`) \`WHERE\` mein, kyunki ye outer joins ke liye *maayne rakhta hai* (Lesson 2).

## Multi-column joins

Jab relationship ek composite key hai, \`ON\` mein multiple \`AND\`-ed equalities hain. Sabhi parts \`TRUE\` hone chahiye.

## \`USING\` aur \`NATURAL JOIN\`

- **\`JOIN b USING (col1, col2)\`** — \`ON a.col1 = b.col1 AND ...\` ka shorthand, *aur* ye joined columns ko merge karta hai: output mein ek \`col1\`, do nahi. Columns ka naam dono sides par identical hona chahiye.
- **\`a NATURAL JOIN b\`** — **har column name par jo do tables share karti hain**, automatically join. Ye khatarnak hai: query mein invisible hai ki kaunse columns par join kiya, aur baad mein ek same-named column add karna **join ko chupchaap badal deta hai**. **Code mein \`NATURAL JOIN\` istemal mat karo.**

## Teen ya zyada tables join karna

- Ise ek chain ki tarah padho.
- **Inner joins ke liye textual order result nahi badalta**. *Outer* joins order-sensitive hain.
- **Cardinality** dekho: \`orders JOIN order_line\` one-to-many hai, to 3 lines waala ek order 3 rows ban jata hai. Agar aap phir aggregate karte ho, aap double-count karte ho — wo fan-out hai (Lesson 4).
- Ek missing ya galat \`ON\` waala \`JOIN\` ek accidental Cartesian product ban jata hai (Lesson 4).

## Column names qualify karna

Jab do tables scope mein hain, ek unqualified column jo dono mein hai (\`id\`, \`name\`) **ambiguous** hai aur \`column reference "id" is ambiguous\` raise karta hai. Hamesha apne tables ko alias karo (\`orders o\`) aur ek multi-table query mein har column ko qualify karo (\`o.id\`).`,

    examples: [
      {
        title: 'INNER JOIN drops unmatched rows on both sides and NULL join keys',
        titleHi: 'INNER JOIN dono sides par unmatched rows aur NULL join keys drop karta hai',
        code: `CREATE TABLE dept (id int, name text);
INSERT INTO dept VALUES (1, 'eng'), (2, 'sales'), (3, 'ops');   -- 'ops' has no employees

CREATE TABLE emp (id int, name text, dept_id int);
INSERT INTO emp VALUES
  (1, 'Ada', 1), (2, 'Bo', 1), (3, 'Cy', 2), (4, 'Di', 2),
  (5, 'Ed', NULL);   -- Ed has no department

SELECT e.name AS emp, d.name AS dept
FROM emp e
JOIN dept d ON e.dept_id = d.id
ORDER BY e.name;`,
        output: ` emp | dept
-----+-------
 Ada | eng
 Bo  | eng
 Cy  | sales
 Di  | sales
(4 rows)`,
        explain: "An inner `JOIN` keeps only rows that match on BOTH sides. `Ed` has `dept_id` NULL, and `NULL = d.id` is `UNKNOWN` for every department, so Ed is dropped. `'ops'` (dept 3) has no employee pointing at it, so it is dropped too. Only the four employees whose `dept_id` finds a real department survive — inner join is a combine step (pair rows) plus a filter (keep only pairs where `ON` is `TRUE`).",
        explainHi: "Ek inner `JOIN` sirf wo rows rakhता hai jo DONO sides par match karti hain. `Ed` ka `dept_id` NULL hai, aur har department ke liye `NULL = d.id` `UNKNOWN` hai, to Ed drop ho jaता hai. `'ops'` (dept 3) par koi employee point nahi karta, to wo bhi drop hoता hai. Sirf wo chaar employees bachte hain jinka `dept_id` ek asli department dhoondता hai — inner join ek combine step (rows pair karo) plus ek filter (sirf wo pairs rakho jahaan `ON` `TRUE` hai) hai.",
      },
      {
        title: 'A three-table join chained by foreign keys',
        titleHi: 'Foreign keys se chained ek three-table join',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex');

CREATE TABLE ordr (id int, customer_id int);
INSERT INTO ordr VALUES (10, 1), (11, 1), (12, 2);

CREATE TABLE line (order_id int, product text, qty int);
INSERT INTO line VALUES (10, 'Widget', 2), (10, 'Gadget', 1), (12, 'Widget', 5);

SELECT c.name AS customer, o.id AS order_id, l.product, l.qty
FROM customer c
JOIN ordr o  ON o.customer_id = c.id
JOIN line l  ON l.order_id = o.id
ORDER BY o.id, l.product;`,
        output: ` customer | order_id | product | qty
----------+----------+---------+-----
 Acme     | 10       | Gadget  | 1
 Acme     | 10       | Widget  | 2
 Globex   | 12       | Widget  | 5
(3 rows)`,
        explain: "The three tables are chained by foreign keys: `customer` -> `ordr` (via `o.customer_id = c.id`) -> `line` (via `l.order_id = o.id`). Each `JOIN` adds one table and one `ON` clause. Order `11` has no line rows so it contributes nothing; Globex's order `12` has one line. The result grain is one row per ORDER LINE, with the customer and order columns repeated on each line of the same order (`Acme` / `10` appears twice).",
        explainHi: 'Teen tables foreign keys se chained hain: `customer` -> `ordr` (`o.customer_id = c.id` se) -> `line` (`l.order_id = o.id` se). Har `JOIN` ek table aur ek `ON` clause jodता hai. Order `11` ki koi line rows nahi to ye kuch contribute nahi karता; Globex ke order `12` ki ek line hai. Result grain prati ORDER LINE ek row hai, customer aur order columns usi order ki har line par repeat hote hue (`Acme` / `10` do baar aata hai).',
      },
      {
        title: 'USING merges the join column; a multi-column ON',
        titleHi: 'USING join column merge karta hai; ek multi-column ON',
        code: `CREATE TABLE a (k int, v text);
CREATE TABLE b (k int, w text);
INSERT INTO a VALUES (1, 'a1'), (2, 'a2');
INSERT INTO b VALUES (1, 'b1'), (3, 'b3');

-- USING (k): join on k, and the result has ONE k column
SELECT * FROM a JOIN b USING (k);`,
        output: ` k | v  | w
---+----+----
 1 | a1 | b1
(1 row)`,
        explain: '`JOIN b USING (k)` joins on `a.k = b.k` AND collapses the two `k` columns into ONE in the output — so `SELECT *` shows `k, v, w`, not `k, v, k, w`. Only `k = 1` exists in both tables, so one row comes back. `USING` needs the column to be named identically on both sides; a multi-column key is `USING (col1, col2)` or the explicit `ON a.c1 = b.c1 AND a.c2 = b.c2`.',
        explainHi: '`JOIN b USING (k)` `a.k = b.k` par join karता hai AUR do `k` columns ko output mein EK mein collapse karता hai — to `SELECT *` `k, v, w` dikhाता hai, `k, v, k, w` nahi. Sirf `k = 1` dono tables mein hai, to ek row wapas aati hai. `USING` ko column dono sides par identically named chahिए; ek multi-column key `USING (col1, col2)` hai ya explicit `ON a.c1 = b.c1 AND a.c2 = b.c2`.',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT id, name, total
FROM orders o
JOIN customer c ON c.id = o.customer_id;
-- ERROR: column reference "id" is ambiguous  (both tables have an "id")`,
        right: `SELECT o.id AS order_id, c.name AS customer, o.total
FROM orders o
JOIN customer c ON c.id = o.customer_id;`,
        why: 'Once two tables that both have an id (or name, or created_at) are in scope, an unqualified reference to that column is ambiguous and the query fails to plan. Always alias every table in a join and qualify every column with its alias. Beyond the tables where names collide, qualifying everywhere makes the query self-documenting: a reader can see at a glance which table each value comes from, and adding a column to one table later cannot silently make an existing reference ambiguous.',
        whyHi: 'Jab do tables jinme dono ke paas ek id (ya name) hai scope mein hain, us column ka ek unqualified reference ambiguous hai aur query plan nahi hoti. Hamesha ek join mein har table ko alias karo aur har column ko iske alias se qualify karo. Jahaan names collide karte hain wahaan ke alawa, har jagah qualify karna query ko self-documenting banata hai.',
      },
      {
        wrong: `-- "customers and their orders" -- but written with a comma join and no ON
SELECT c.name, o.id
FROM customer c, orders o;
-- returns EVERY customer paired with EVERY order -- a Cartesian product`,
        right: `SELECT c.name, o.id
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- or, if you insist on the comma form:  FROM customer c, orders o WHERE o.customer_id = c.id`,
        why: 'The comma form of FROM, "FROM a, b", is an implicit CROSS JOIN: without a WHERE clause linking them it pairs every row of a with every row of b. With 10,000 customers and 100,000 orders that is a billion rows. The explicit JSON ... ON syntax makes the relationship a required part of the join and makes a forgotten condition a visible omission rather than a silent one. Modern style is always JOIN ... ON (or USING); reserve the comma form, if you use it at all, only for a deliberate cross join.',
        whyHi: 'FROM ka comma form, "FROM a, b", ek implicit CROSS JOIN hai: unhe link karne waale ek WHERE clause ke bina ye a ki har row ko b ki har row se pair karta hai. 10,000 customers aur 100,000 orders ke saath wo ek billion rows hai. Explicit JOIN ... ON syntax relationship ko join ka ek required part banata hai. Modern style hamesha JOIN ... ON hai.',
      },
      {
        wrong: `-- schema evolves: both tables gain a "status" column
SELECT * FROM subscription NATURAL JOIN plan;
-- yesterday it joined on plan_id; today it ALSO joins on status -> most rows vanish`,
        right: `SELECT * FROM subscription s
JOIN plan p ON p.id = s.plan_id;
-- the join keys are explicit and immune to unrelated schema changes`,
        why: 'NATURAL JOIN joins on every column name the two tables have in common, and that set is computed at query time from the current schema. The query does not say which columns those are, so the moment someone adds a same-named column to both tables -- a status, a created_at, a tenant_id -- the join condition silently gains an extra equality and the result set collapses. It is a time-bomb: the query is correct today and wrong after an unrelated migration, with no error. Always write the join keys out explicitly with ON or USING.',
        whyHi: 'NATURAL JOIN har column name par join karta hai jo do tables mein common hai, aur wo set query time par current schema se compute hota hai. Query nahi kehti wo columns kaunse hain, to jis pal koi dono tables mein ek same-named column add karta hai — ek status, ek created_at — join condition chupchaap ek extra equality gain karti hai aur result set collapse ho jata hai. Ye ek time-bomb hai. Hamesha join keys ko ON ya USING se explicitly likho.',
      },
    ],

    realWorld: [
      {
        en: '**Every join in the codebase is `JOIN ... ON` with fully-qualified column names and a table alias** — `NATURAL JOIN` and the comma-join form are banned by the style guide because both hide the join condition.',
        hi: '**Codebase mein har join fully-qualified column names ke saath `JOIN ... ON` hai** — `NATURAL JOIN` aur comma-join form style guide dwara banned hain.',
      },
      {
        en: '**`USING (tenant_id, account_id)` across a set of tables that all carry the same two scoping columns** — a multi-tenant schema where the shorthand is safe *because* the naming is a deliberate, enforced convention.',
        hi: '**Tables ke ek set ke paar `USING (tenant_id, account_id)`** — ek multi-tenant schema jahaan shorthand safe hai kyunki naming ek deliberate convention hai.',
      },
      {
        en: '**A review checklist item: "does every table in the `FROM` connect to the others through an `ON`?"** — catching the accidental Cartesian product that turns a fast query into an out-of-memory crash.',
        hi: '**Ek review checklist item: "kya `FROM` mein har table doosron se ek `ON` ke through connect hoti hai?"** — accidental Cartesian product pakadna.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain what a join does conceptually, and what `INNER JOIN` returns vs what it drops.',
        qHi: 'Ek join conceptually kya karta hai, aur `INNER JOIN` kya return karta hai vs kya drop karta hai, samjhao.',
        a: 'Conceptually a join is combine-then-filter. First you form every possible pairing of a row from the left table with a row from the right table, the Cartesian product, where each combined row carries all the columns of both. Then you evaluate the ON condition against every combined row and keep only the ones where it is TRUE. The database does not literally materialise the full product; the planner uses nested loop, hash, or merge join algorithms with indexes to get the same answer efficiently. But the meaning is combine then filter, and that explains the behaviour. An inner join, which is what plain JOIN means, returns only the combined rows where ON is TRUE. So a left row with no matching right row produces nothing, a right row with no matching left row produces nothing, and a row whose join key is NULL matches nothing because NULL equals anything is UNKNOWN, not TRUE. The practical effect is that an inner join between orders and customers silently drops any order that points at a deleted customer and any customer who has never ordered. If you need to keep those unmatched rows, you use an outer join instead.',
        aHi: 'Conceptually ek join combine-then-filter hai. Pehle aap left table ki ek row aur right table ki ek row ka har sambhaavit pairing banate ho, Cartesian product, jahaan har combined row dono ke sabhi columns rakhta hai. Phir aap har combined row ke against ON condition evaluate karte ho aur sirf un ko rakhte ho jahaan ye TRUE hai. Database literally poora product materialise nahi karta; planner nested loop, hash, ya merge join algorithms indexes ke saath istemal karta hai. Ek inner join, jo plain JOIN ka matlab hai, sirf wo combined rows return karta hai jahaan ON TRUE hai. To bina matching right row waali ek left row kuch nahi deti, aur ek row jiska join key NULL hai kuch match nahi karti. Practical effect ye hai ki orders aur customers ke beech ek inner join chupchaap koi bhi order drop karta hai jo ek deleted customer par point karta hai.',
      },
      {
        q: 'Why should you avoid `NATURAL JOIN` and the comma-join form?',
        qHi: 'Aapko `NATURAL JOIN` aur comma-join form kyun avoid karna chahiye?',
        a: 'NATURAL JOIN joins on every column that the two tables have in common by name, and that set of columns is determined at query time from whatever the schema currently looks like. The query text does not state the join keys, so you cannot see them by reading it, and more importantly the join changes automatically if the schema changes. The day someone adds a column with the same name to both tables, say a status or a created_at or a tenant_id, the join silently acquires an extra equality condition and the result set can collapse, with no error and no warning. It is correct today and wrong after an unrelated migration. The comma-join form, FROM a, b, is an implicit cross join: if you forget or mis-write the WHERE clause that links the tables, you get the full Cartesian product, which on real table sizes is millions or billions of rows and often an out-of-memory failure. The fix for both is the same: always write JOIN with an explicit ON clause, or USING with an explicit column list, so the join condition is visible in the query and stable against schema changes.',
        aHi: 'NATURAL JOIN har column par join karta hai jo do tables ke paas naam se common hai, aur columns ka wo set query time par determine hota hai schema jaisa abhi dikhta hai us se. Query text join keys nahi batata, to aap unhe padhkar nahi dekh sakte, aur zyada mahatvapoorn, join automatically badalta hai agar schema badalti hai. Jis din koi dono tables mein ek same-named column add karta hai, join chupchaap ek extra equality condition acquire karta hai aur result set collapse ho sakta hai. Comma-join form, FROM a, b, ek implicit cross join hai: agar aap unhe link karne waala WHERE clause bhool jate ho, aapko poora Cartesian product milta hai. Dono ka fix same hai: hamesha ek explicit ON clause ke saath JOIN likho.',
      },
    ],

    exercises: [
      {
        task: 'Tables `dept(id int, name text)` with 3 rows including one with no employees, and `emp(id int, name text, dept_id int)` with 4 rows plus one where `dept_id IS NULL`. Write the `INNER JOIN` of `emp` to `dept`. Confirm the row count equals only the employees whose `dept_id` matches a real department — the NULL-dept employee and the empty department both disappear.',
        taskHi: 'Tables `dept(id int, name text)` 3 rows ke saath (ek bina employees ke), aur `emp(id int, name text, dept_id int)` 4 rows plus ek `dept_id IS NULL` ke saath. `emp` ka `dept` se `INNER JOIN` likho.',
        hint: '`FROM emp e JOIN dept d ON e.dept_id = d.id`. The NULL-dept row: `NULL = d.id` is `UNKNOWN` so it never matches. The empty department: no `emp` row references it.',
        hintHi: '`FROM emp e JOIN dept d ON e.dept_id = d.id`. NULL-dept row: `NULL = d.id` `UNKNOWN` hai. Empty department: koi `emp` row ise reference nahi karti.',
      },
      {
        task: 'Tables `book(id int, title text, author_id int)` and `author(id int, name text)`, plus `sale(book_id int, qty int)`. Write a three-table join returning `title`, `author name`, and `qty` for every sale. Then swap the order of the two `JOIN` clauses and confirm the result rows are identical (only the row order may differ before you add `ORDER BY`).',
        taskHi: 'Tables `book(id, title, author_id)`, `author(id, name)`, `sale(book_id, qty)`. Ek three-table join likho jo har sale ke liye `title`, `author name`, `qty` return karti hai. Phir do `JOIN` clauses ka order swap karo.',
        hint: '`FROM sale s JOIN book b ON b.id = s.book_id JOIN author a ON a.id = b.author_id` vs joining `author` before `book` — for inner joins the rows are the same set.',
        hintHi: '`FROM sale s JOIN book b ON ... JOIN author a ON ...` vs `book` se pehle `author` join karna — inner joins ke liye rows same set hain.',
      },
      {
        task: 'Tables `a(k int, x text)` and `b(k int, y text)` where `k` is the shared name. Write `SELECT * FROM a JOIN b USING (k)` and count the output columns. Then write the same join with `ON a.k = b.k` and count again. Confirm `USING` gives one `k` column and `ON` gives two (`a.k` and `b.k`).',
        taskHi: 'Tables `a(k, x)` aur `b(k, y)`. `SELECT * FROM a JOIN b USING (k)` likho aur output columns count karo. Phir `ON a.k = b.k` ke saath wahi join. Confirm `USING` ek `k` column deta hai aur `ON` do.',
        hint: '`USING (k)` merges the join column into one; `ON a.k = b.k` leaves both `a.k` and `b.k` in a `SELECT *`, so you get an extra column.',
        hintHi: '`USING (k)` join column ko ek mein merge karta hai; `ON a.k = b.k` `SELECT *` mein `a.k` aur `b.k` dono chhodta hai.',
      },
    ],

    keyTakeaways: [
      'A JOIN is CONCEPTUALLY combine-then-filter: (1) form every `(left, right)` row pair (the Cartesian product, each pair carrying ALL columns of both); (2) keep pairs where `ON` is `TRUE`. The planner does this efficiently (nested loop / hash / merge join + indexes, Module 10) but the MEANING is combine-then-filter.',
      '`JOIN` = `INNER JOIN`: returns ONLY pairs where `ON` is `TRUE`. Drops: a left row with no match, a right row with no match, and a row whose join key is `NULL` (`NULL = x` is `UNKNOWN`). An `orders JOIN customer` silently loses orders pointing at a deleted customer AND customers who never ordered.',
      'For an INNER join, `ON a.x = b.y AND cond` === `ON a.x = b.y WHERE cond` (interchangeable). CONVENTION: join relationship in `ON`, filters on the result in `WHERE` — the distinction MATTERS for outer joins (Lesson 2), so keep the habit.',
      'Composite-key join: `ON i.warehouse_id = ol.warehouse_id AND i.sku = ol.sku` — ALL parts must be `TRUE`.',
      '`JOIN b USING (col)` = `ON a.col = b.col` AND merges the two columns into ONE in the output (needs identical names both sides). `NATURAL JOIN` = auto-join on ALL shared column names — a TIME-BOMB: adding a same-named column later (`created_at`, `status`) silently changes the join with NO error. DON\'T use `NATURAL JOIN` in real code.',
      'Multi-table: chain `JOIN ... ON` clauses (`orders` -> its `customer` -> its `order_line`s -> each line\'s `product`). For INNER joins the WRITTEN order does NOT change the result (outer joins ARE order-sensitive). Every table needs an `ON` path to the rest.',
      'The comma form `FROM a, b` is an IMPLICIT CROSS JOIN — a forgotten linking `WHERE` = a full Cartesian product (millions/billions of rows, likely OOM). Always `JOIN ... ON`.',
      'In a multi-table query, ALIAS every table (`orders o`) and QUALIFY every column (`o.id`) — unqualified `id` when both tables have one raises `column reference "id" is ambiguous`, and qualifying everywhere makes the query self-documenting.',
    ],
    keyTakeawaysHi: [
      'Ek JOIN CONCEPTUALLY combine-then-filter hai: (1) har `(left, right)` row pair banao (Cartesian product); (2) un pairs ko rakho jahaan `ON` `TRUE` hai. Planner ise efficiently karta hai par MATLAB combine-then-filter hai.',
      '`JOIN` = `INNER JOIN`: SIRF wo pairs return karta hai jahaan `ON` `TRUE` hai. Drop karta hai: bina match ki ek left row, bina match ki ek right row, aur ek row jiska join key `NULL` hai. `orders JOIN customer` chupchaap deleted customer par point karte orders AUR kabhi order na karne waale customers kho deta hai.',
      'Ek INNER join ke liye, `ON a.x = b.y AND cond` === `ON a.x = b.y WHERE cond`. CONVENTION: join relationship `ON` mein, result par filters `WHERE` mein — antar outer joins ke liye MAAYNE rakhta hai.',
      'Composite-key join: `ON i.warehouse_id = ol.warehouse_id AND i.sku = ol.sku` — SABHI parts `TRUE` hone chahiye.',
      '`JOIN b USING (col)` = `ON a.col = b.col` AUR do columns ko output mein EK mein merge karta hai. `NATURAL JOIN` = SABHI shared column names par auto-join — ek TIME-BOMB. Real code mein `NATURAL JOIN` istemal MAT karo.',
      'Multi-table: `JOIN ... ON` clauses chain karo. INNER joins ke liye LIKHA order result NAHI badalta (outer joins order-sensitive HAIN).',
      'Comma form `FROM a, b` ek IMPLICIT CROSS JOIN hai — ek bhoola linking `WHERE` = ek full Cartesian product. Hamesha `JOIN ... ON`.',
      'Ek multi-table query mein, har table ko ALIAS karo (`orders o`) aur har column ko QUALIFY karo (`o.id`) — unqualified `id` `column reference "id" is ambiguous` raise karta hai.',
    ],
  },

  {
    slug: 'sql-outer-joins-left-right-full',
    title: 'Outer Joins: `LEFT`, `RIGHT`, `FULL`, and the `ON`-vs-`WHERE` Trap',
    titleHi: 'Outer Joins: `LEFT`, `RIGHT`, `FULL`, Aur `ON`-vs-`WHERE` Trap',
    description: 'A `LEFT JOIN` keeps every row of the left table, filling the right-side columns with `NULL` where there is no match. `RIGHT` is the mirror; `FULL` keeps both. The classic trap: a filter on the right table in `WHERE` (not `ON`) silently turns a `LEFT JOIN` back into an `INNER JOIN`.',
    descriptionHi: 'Ek `LEFT JOIN` left table ki har row rakhta hai, jahaan koi match nahi wahaan right-side columns ko `NULL` se bharkar. `RIGHT` mirror hai; `FULL` dono rakhta hai. Classic trap: right table par ek filter `WHERE` mein (`ON` nahi) chupchaap ek `LEFT JOIN` ko wapas ek `INNER JOIN` mein badal deta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Taking attendance against a full class roster.** An inner join is calling out names from the *sign-in sheet* only — you never notice who is absent, because absent students left no sign-in row. A **left join** is calling names from the *roster* (the left table, kept whole) and, for each, checking the sign-in sheet: present students get their sign-in time stapled on; absent students still get a line on the report, with the time left blank (\`NULL\`). That blank is the whole point — it is how you *see* the absences. Now the trap. If you finish building that roster-with-blanks report and then, at the end, cross out every line where the sign-in time is before 9am, you have also crossed out every absent student — their time was blank, and "blank is before 9am" is not true, so they fail the filter and vanish. Your "who came in late or was absent" report just lost the absences. The fix: apply the "before 9am" test *while checking the sign-in sheet* (in the \`ON\`), so a blank never gets tested against it — not *after* the roster is assembled (in the \`WHERE\`).',
      hi: '**Ek poore class roster ke against attendance lena.** Ek inner join sirf *sign-in sheet* se naam bolna hai — aap kabhi nahi dekhte kaun absent hai. Ek **left join** *roster* (left table, poora rakha) se naam bolna hai aur, har ek ke liye, sign-in sheet check karna: present students ko unka sign-in time stapled milta hai; absent students ko phir bhi report par ek line milti hai, time blank (\`NULL\`) chhodkar. Wo blank poora point hai — yahi tarika hai aap absences *dekhte* ho. Ab trap. Agar aap wo roster-with-blanks report bana lete ho aur phir, ant mein, har line cross out karte ho jahaan sign-in time 9am se pehle hai, aapne har absent student ko bhi cross out kar diya — unka time blank tha, aur "blank 9am se pehle hai" true nahi hai. Fix: "9am se pehle" test *sign-in sheet check karte samay* (`ON` mein) apply karo, `WHERE` mein nahi.',
    },

    simple: `**\`LEFT JOIN\` — keep all left rows, NULL-pad the right**

\`\`\`sql
SELECT c.name, o.id AS order_id
FROM   customer c
LEFT JOIN orders o ON o.customer_id = c.id;
-- a customer with 3 orders  -> 3 rows
-- a customer with 0 orders  -> 1 row, order_id = NULL   <-- INNER JOIN would drop this
\`\`\`

**\`RIGHT JOIN\` = \`LEFT JOIN\` with the tables swapped**

\`\`\`sql
FROM orders o RIGHT JOIN customer c ON o.customer_id = c.id
-- identical to:  FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
-- most teams use LEFT everywhere and never write RIGHT
\`\`\`

**\`FULL JOIN\` — keep unmatched rows from BOTH sides**

\`\`\`sql
FROM a FULL JOIN b ON a.k = b.k
-- matched pairs, PLUS a-rows with no b (b cols NULL), PLUS b-rows with no a (a cols NULL)
\`\`\`

**THE TRAP: filter the right table in \`ON\`, not \`WHERE\`, for a LEFT JOIN**

\`\`\`sql
-- WRONG: this is secretly an INNER JOIN
SELECT c.name, o.id
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';        -- o.status is NULL for customers with no orders
                               -- NULL = 'paid' -> UNKNOWN -> row dropped -> the LEFT is undone

-- RIGHT: put the right-table condition in ON
SELECT c.name, o.id
FROM customer c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'paid';         -- customers with no paid order: kept, with o.id = NULL
\`\`\`

**The anti-join: "left rows with NO match"**

\`\`\`sql
SELECT c.name
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;             -- customers who have never ordered
-- (this WHERE on the right table is CORRECT here -- it is the whole purpose)
\`\`\`

**\`LEFT JOIN\` + \`COUNT\` — use \`count(right.col)\`, not \`count(*)\`**

\`\`\`sql
SELECT c.name, count(o.id) AS order_count       -- count(o.id): 0 for a customer with no orders
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;
-- count(*) would return 1 for a no-order customer (the NULL-padded row still counts)
\`\`\``,

    simpleHi: `**\`LEFT JOIN\` — sabhi left rows rakho, right ko NULL-pad karo**

\`\`\`sql
SELECT c.name, o.id AS order_id
FROM   customer c
LEFT JOIN orders o ON o.customer_id = c.id;
-- 3 orders waala customer  -> 3 rows
-- 0 orders waala customer  -> 1 row, order_id = NULL   <-- INNER JOIN ise drop karta
\`\`\`

**\`RIGHT JOIN\` = tables swap kiye \`LEFT JOIN\`**

\`\`\`sql
FROM orders o RIGHT JOIN customer c ON o.customer_id = c.id
-- identical:  FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
-- zyaadatar teams har jagah LEFT istemal karti hain aur kabhi RIGHT nahi likhti
\`\`\`

**\`FULL JOIN\` — DONO sides se unmatched rows rakho**

\`\`\`sql
FROM a FULL JOIN b ON a.k = b.k
-- matched pairs, PLUS bina b ke a-rows (b cols NULL), PLUS bina a ke b-rows (a cols NULL)
\`\`\`

**TRAP: ek LEFT JOIN ke liye right table \`ON\` mein filter karo, \`WHERE\` mein NAHI**

\`\`\`sql
-- GALAT: ye chupke se ek INNER JOIN hai
SELECT c.name, o.id
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';        -- bina orders waale customers ke liye o.status NULL hai
                               -- NULL = 'paid' -> UNKNOWN -> row dropped -> LEFT undone

-- SAHI: right-table condition ON mein daalo
SELECT c.name, o.id
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid';
\`\`\`

**Anti-join: "bina match ki left rows"**

\`\`\`sql
SELECT c.name
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;             -- kabhi order na karne waale customers
\`\`\`

**\`LEFT JOIN\` + \`COUNT\` — \`count(right.col)\` istemal karo, \`count(*)\` NAHI**

\`\`\`sql
SELECT c.name, count(o.id) AS order_count       -- count(o.id): bina orders waale customer ke liye 0
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;
-- count(*) ek no-order customer ke liye 1 return karta (NULL-padded row bhi count hoti hai)
\`\`\``,

    content: `## \`LEFT JOIN\` (a.k.a. \`LEFT OUTER JOIN\`)

A left join does everything an inner join does — form the pairs, keep the ones where \`ON\` is \`TRUE\` — **and then**, for every left row that ended up with *no* matching right row, it emits **one output row anyway**, with all the right-table columns set to \`NULL\`.

So \`FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\`:

- A customer with 3 orders → 3 rows (same as inner).
- A customer with 1 order → 1 row.
- A customer with **0 orders** → **1 row**, with every \`o.*\` column \`NULL\`. (An inner join would produce 0 rows for this customer.)

The left table is "preserved" — every one of its rows appears at least once. Use it whenever the question is "all X, and their Y if any": all products and their latest review, all users and their subscription, all days and the count of events on that day.

## \`RIGHT JOIN\` and \`FULL JOIN\`

- **\`RIGHT JOIN\`** preserves the *right* table. \`a RIGHT JOIN b\` is exactly \`b LEFT JOIN a\` with the same \`ON\`. It exists for completeness; in practice, teams standardise on \`LEFT\` and reorder the tables, because a query that mixes \`LEFT\` and \`RIGHT\` is hard to read.
- **\`FULL JOIN\`** (a.k.a. \`FULL OUTER JOIN\`) preserves *both*: matched pairs, plus left rows with no right match (right columns \`NULL\`), plus right rows with no left match (left columns \`NULL\`). Used for reconciliation — "show me everything in system A and everything in system B, lined up where they match and flagged where they do not".

## The \`ON\`-vs-\`WHERE\` trap — the single most common outer-join bug

For an **inner** join, \`ON\` and \`WHERE\` conditions are interchangeable. For an **outer** join they are **completely different**, because they apply at different times:

- A condition in **\`ON\`** is part of *deciding whether two rows match*. It runs *before* the NULL-padding step. A left row that fails to find a right row satisfying the full \`ON\` still gets its NULL-padded output row.
- A condition in **\`WHERE\`** runs *after* the whole join (including the NULL-padding) is complete. It filters the final rows.

Now consider:

\`\`\`sql
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01'
\`\`\`

For a customer with no orders, the left join emits a row with \`o.created_at = NULL\`. Then \`WHERE NULL >= '2026-01-01'\` is \`UNKNOWN\`, so that row is dropped. **Every no-order customer disappears** — the \`LEFT JOIN\` has been silently converted into an \`INNER JOIN\`. The same happens with \`WHERE o.status = 'active'\`, \`WHERE o.amount > 100\`, any condition on a right-table column that is \`NULL\` for the unmatched rows.

**The rule:**

- A condition that should **restrict which right rows are eligible to match** → put it in **\`ON\`**. ("customers and their *paid* orders" → \`ON o.customer_id = c.id AND o.status = 'paid'\`.)
- A condition on the **left table**, or a condition where you genuinely want to *exclude* the unmatched (NULL) rows → \`WHERE\` is fine. ("active customers and their orders" → \`WHERE c.active\`.)
- **The anti-join pattern** \`WHERE o.id IS NULL\` is the deliberate exception: you *want* only the unmatched rows.

## The anti-join

To find "left rows that have **no** match on the right", left-join and then keep the rows where the right side is \`NULL\`:

\`\`\`sql
SELECT c.*
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;          -- test a NON-nullable right column (the PK) for NULL
\`\`\`

Test a column that is **guaranteed non-\`NULL\` when a match exists** — the primary key or the join key on the right. If you test a nullable right column you will also catch rows where the match exists but that column happens to be \`NULL\`.

\`NOT EXISTS\` is an equivalent and often clearer way to write an anti-join (Lesson 5), and it does not have the "which column do I test" question.

## \`LEFT JOIN\` with aggregation

\`\`\`sql
SELECT c.name, count(o.id) AS orders, coalesce(sum(o.total), 0) AS revenue
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
\`\`\`

Two things to get right:

- **\`count(o.id)\`, not \`count(*)\`.** For a customer with no orders, the left join produced one row with \`o.id = NULL\`. \`count(*)\` counts that row → \`1\`. \`count(o.id)\` counts non-\`NULL\` values of \`o.id\` → \`0\`, which is correct.
- **\`coalesce(sum(...), 0)\`.** \`sum\` of a set that is entirely \`NULL\` (a no-order customer) is \`NULL\`, not \`0\`. Wrap it if the report needs a numeric zero.

## Chaining outer joins

\`\`\`sql
FROM a
LEFT JOIN b ON b.a_id = a.id
LEFT JOIN c ON c.b_id = b.id        -- note: c joins to b, which may already be NULL
\`\`\`

If \`b\` is \`NULL\` for some \`a\` row, then \`c.b_id = b.id\` is \`c.b_id = NULL\` → \`UNKNOWN\` → \`c\` is also \`NULL\`. That is usually what you want (no \`b\`, so no \`c\`). But be careful mixing \`INNER\` and \`LEFT\` in a chain: \`a LEFT JOIN b ... INNER JOIN c ON c.b_id = b.id\` will drop every \`a\` row where \`b\` was \`NULL\`, undoing the outer join — the inner join to \`c\` requires a non-\`NULL\` \`b.id\`.`,

    contentHi: `## \`LEFT JOIN\` (yani \`LEFT OUTER JOIN\`)

Ek left join wo sab karta hai jo ek inner join karta hai — pairs banao, un ko rakho jahaan \`ON\` \`TRUE\` hai — **aur phir**, har left row ke liye jiske paas *koi* matching right row nahi tha, ye **phir bhi ek output row emit karta hai**, sabhi right-table columns \`NULL\` set karke.

To \`FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\`:
- 3 orders waala customer → 3 rows.
- **0 orders** waala customer → **1 row**, har \`o.*\` column \`NULL\`. (Ek inner join is customer ke liye 0 rows deta.)

Left table "preserved" hai. Ise tab istemal karo jab sawaal "sabhi X, aur unke Y agar koi hai" hai.

## \`RIGHT JOIN\` aur \`FULL JOIN\`

- **\`RIGHT JOIN\`** *right* table preserve karta hai. \`a RIGHT JOIN b\` theek \`b LEFT JOIN a\` hai. Practice mein teams \`LEFT\` par standardise karti hain.
- **\`FULL JOIN\`** *dono* preserve karta hai. Reconciliation ke liye.

## \`ON\`-vs-\`WHERE\` trap — sabse aam outer-join bug

Ek **inner** join ke liye, \`ON\` aur \`WHERE\` interchangeable hain. Ek **outer** join ke liye wo **poori tarah alag** hain:

- **\`ON\`** mein ek condition *ye decide karne ka hissa hai ki do rows match karti hain*. Ye NULL-padding step se *pehle* chalti hai.
- **\`WHERE\`** mein ek condition poore join ke *baad* chalti hai. Ye final rows filter karti hai.

Ab dekho:

\`\`\`sql
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01'
\`\`\`

Bina orders waale ek customer ke liye, left join ek row emit karta hai \`o.created_at = NULL\` ke saath. Phir \`WHERE NULL >= '2026-01-01'\` \`UNKNOWN\` hai, to wo row drop ho jati hai. **Har no-order customer gायab ho jata hai** — \`LEFT JOIN\` chupchaap ek \`INNER JOIN\` mein badal gaya.

**Niyam:**
- Ek condition jo **restrict kare ki kaunsi right rows match karne ke liye eligible hain** → **\`ON\`** mein daalo.
- **Left table** par ek condition → \`WHERE\` theek hai.
- **Anti-join pattern** \`WHERE o.id IS NULL\` deliberate exception hai.

## Anti-join

"Right par **koi** match na waali left rows" dhoondhne ke liye, left-join karo aur phir un rows ko rakho jahaan right side \`NULL\` hai:

\`\`\`sql
SELECT c.* FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;          -- ek NON-nullable right column (PK) ko NULL ke liye test karo
\`\`\`

Ek column test karo jo **match hone par non-\`NULL\` guaranteed** hai. \`NOT EXISTS\` ek equivalent aur aksar saaf tarika hai (Lesson 5).

## \`LEFT JOIN\` aggregation ke saath

- **\`count(o.id)\`, \`count(*)\` NAHI.** Bina orders waale customer ke liye left join ne ek row \`o.id = NULL\` ke saath banai. \`count(*)\` us row ko count karta hai → \`1\`. \`count(o.id)\` \`o.id\` ki non-\`NULL\` values count karta hai → \`0\`.
- **\`coalesce(sum(...), 0)\`.** Poori tarah \`NULL\` set ka \`sum\` \`NULL\` hai, \`0\` nahi.

## Outer joins chain karna

Ek chain mein \`INNER\` aur \`LEFT\` mix karne mein saavdhan raho: \`a LEFT JOIN b ... INNER JOIN c ON c.b_id = b.id\` har \`a\` row drop karega jahaan \`b\` \`NULL\` tha, outer join undo karke.`,

    examples: [
      {
        title: 'LEFT JOIN keeps the unmatched left row with NULLs; INNER would drop it',
        titleHi: 'LEFT JOIN unmatched left row NULLs ke saath rakhta hai; INNER ise drop karta',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');

CREATE TABLE ordr (id int, customer_id int, status text);
INSERT INTO ordr VALUES (10, 1, 'paid'), (11, 1, 'refunded'), (12, 2, 'paid');
-- Initech (id 3) has no orders

SELECT c.name, o.id AS order_id, o.status
FROM customer c
LEFT JOIN ordr o ON o.customer_id = c.id
ORDER BY c.name, o.id;`,
        output: ` name    | order_id | status
---------+----------+----------
 Acme    | 10       | paid
 Acme    | 11       | refunded
 Globex  | 12       | paid
 Initech | NULL     | NULL
(4 rows)`,
        explain: '`LEFT JOIN` keeps EVERY row of the left table (`customer`) even when the `ON` finds no match on the right. `Acme` has two orders so it appears twice; `Initech` has none, so it appears once with every `ordr` column set to `NULL`. Swap to a plain `JOIN` and the `Initech` row vanishes — that is the whole difference: `LEFT JOIN` preserves unmatched left rows, `INNER` discards them.',
        explainHi: '`LEFT JOIN` left table (`customer`) ki HAR row rakhता hai tab bhi jab `ON` right par koi match nahi dhoondता. `Acme` ke do orders hain to ye do baar aata hai; `Initech` ke koi nahi, to ye ek baar aata hai har `ordr` column `NULL` set ke saath. Ek plain `JOIN` par switch karo aur `Initech` row gायab ho jaती hai — yahi poora antar hai: `LEFT JOIN` unmatched left rows preserve karता hai, `INNER` unhe discard karता hai.',
      },
      {
        title: 'The ON-vs-WHERE trap: a right-table filter in WHERE undoes the LEFT JOIN',
        titleHi: 'ON-vs-WHERE trap: WHERE mein ek right-table filter LEFT JOIN undo karta hai',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');
CREATE TABLE ordr (id int, customer_id int, status text);
INSERT INTO ordr VALUES (10, 1, 'paid'), (11, 1, 'refunded'), (12, 2, 'refunded');

-- WRONG: filter in WHERE -> Initech (no orders) and Globex (no PAID order) both vanish
SELECT c.name, o.id
FROM customer c
LEFT JOIN ordr o ON o.customer_id = c.id
WHERE o.status = 'paid'
ORDER BY c.name;

-- RIGHT: filter in ON -> every customer kept, o.id NULL if they have no paid order
SELECT c.name, o.id
FROM customer c
LEFT JOIN ordr o ON o.customer_id = c.id AND o.status = 'paid'
ORDER BY c.name;`,
        output: ` name | id
------+----
 Acme | 10
(1 row)

 name    | id
---------+------
 Acme    | 10
 Globex  | NULL
 Initech | NULL
(3 rows)`,
        explain: "For an OUTER join, `ON` and `WHERE` are NOT interchangeable. `ON` runs BEFORE NULL-padding — it decides which right rows match. `WHERE` runs AFTER the whole join is built. Putting `o.status = 'paid'` in `WHERE` tests `NULL = 'paid'` = `UNKNOWN` for every NULL-padded row, dropping it, so the `LEFT JOIN` silently collapses to `INNER` (only `Acme` survives). Move the same condition into `ON` and all three customers are kept, with `id` NULL when there is no paid order.",
        explainHi: "Ek OUTER join ke liye, `ON` aur `WHERE` interchangeable NAHI hain. `ON` NULL-padding se PEHLE chalता hai — ye decide karता hai kaunsi right rows match karti hain. `WHERE` poore join banne ke BAAD chalता hai. `o.status = 'paid'` ko `WHERE` mein daalna har NULL-padded row ke liye `NULL = 'paid'` = `UNKNOWN` test karता hai, use drop karके, to `LEFT JOIN` chupchaap `INNER` mein collapse ho jaता hai (sirf `Acme` bachता hai). Wahi condition `ON` mein le jao aur teenon customers rakhे jaते hain, `id` NULL ke saath jab koi paid order nahi.",
      },
      {
        title: 'Anti-join (WHERE right.pk IS NULL) and LEFT JOIN + count(right.col)',
        titleHi: 'Anti-join (WHERE right.pk IS NULL) aur LEFT JOIN + count(right.col)',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');
CREATE TABLE ordr (id int, customer_id int);
INSERT INTO ordr VALUES (10, 1), (11, 1), (12, 2);

-- customers who have never ordered
SELECT c.name
FROM customer c
LEFT JOIN ordr o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- order count per customer -- count(o.id) gives 0, not 1, for Initech
SELECT c.name, count(o.id) AS orders
FROM customer c
LEFT JOIN ordr o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY c.name;`,
        output: ` name
---------
 Initech
(1 row)

 name    | orders
---------+--------
 Acme    | 2
 Globex  | 1
 Initech | 0
(3 rows)`,
        explain: "Two classic `LEFT JOIN` patterns. First, the ANTI-JOIN: `LEFT JOIN ... WHERE o.id IS NULL` keeps only the left rows that found NO match — `Initech`, the customer with no orders. Test the right table's PRIMARY KEY (or join column), never a nullable column. Second, `count(o.id)` after a `LEFT JOIN` counts only non-NULL values, so `Initech` correctly shows `0` — `count(*)` would wrongly show `1` (the NULL-padded row).",
        explainHi: 'Do classic `LEFT JOIN` patterns. Pehla, ANTI-JOIN: `LEFT JOIN ... WHERE o.id IS NULL` sirf wo left rows rakhता hai jinhe KOI match nahi mila — `Initech`, bina orders waala customer. Right table ki PRIMARY KEY (ya join column) test karo, kabhi ek nullable column nahi. Doosra, ek `LEFT JOIN` ke baad `count(o.id)` sirf non-NULL values count karता hai, to `Initech` sahi `0` dikhाता hai — `count(*)` galat `1` dikhाता (NULL-padded row).',
      },
    ],

    mistakes: [
      {
        wrong: `-- "all products and their reviews from the last 30 days"
SELECT p.name, r.rating
FROM product p
LEFT JOIN review r ON r.product_id = p.id
WHERE r.created_at >= now() - interval '30 days';
-- every product with no recent review disappears -- the LEFT JOIN is now an INNER JOIN`,
        right: `SELECT p.name, r.rating
FROM product p
LEFT JOIN review r
  ON r.product_id = p.id
 AND r.created_at >= now() - interval '30 days';
-- products with no recent review: kept, with r.rating = NULL`,
        why: 'The intent is "all products, plus recent reviews where they exist". Putting the date condition in WHERE runs it after the left join has already NULL-padded the review columns for products with no recent review, and NULL >= a date is UNKNOWN, so those product rows are filtered out. The join has silently become inner. The date restriction is part of deciding which review rows are eligible to match, so it belongs in the ON clause alongside the product_id equality. Then a product with no matching review still produces its row with NULL review columns.',
        whyHi: 'Intent "sabhi products, plus recent reviews jahaan wo maujood hain" hai. Date condition ko WHERE mein daalna ise left join ke pehle hi review columns ko NULL-pad karne ke baad chalata hai, aur NULL >= ek date UNKNOWN hai, to wo product rows filter ho jati hain. Date restriction ye decide karne ka hissa hai ki kaunsi review rows match karne ke liye eligible hain, to ye ON clause mein hai.',
      },
      {
        wrong: `-- "number of orders per customer, including zero"
SELECT c.name, count(*) AS order_count
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;
-- a customer with no orders shows order_count = 1, not 0`,
        right: `SELECT c.name, count(o.id) AS order_count
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;`,
        why: 'For a customer with no orders, the left join still produces one output row for them, with every orders column NULL. count(*) counts rows, so it counts that placeholder row and reports 1. count(o.id) counts non-NULL values of o.id, and since the placeholder row has o.id NULL, it correctly reports 0. The same logic applies to sum: sum over a customer whose only row has a NULL amount is NULL, so wrap it in coalesce of that comma zero if the report needs a numeric zero. With a LEFT JOIN, always aggregate a right-table column, never count star.',
        whyHi: 'Bina orders waale customer ke liye, left join phir bhi unke liye ek output row deta hai, har orders column NULL ke saath. count(*) rows count karta hai, to ye us placeholder row ko count karta hai aur 1 report karta hai. count(o.id) o.id ki non-NULL values count karta hai, aur placeholder row mein o.id NULL hai, to ye sahi se 0 report karta hai. Ek LEFT JOIN ke saath, hamesha ek right-table column aggregate karo, kabhi count star nahi.',
      },
      {
        wrong: `-- anti-join, but testing a nullable column
SELECT c.name
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.shipped_at IS NULL;
-- returns customers with no orders AND customers whose orders are all unshipped`,
        right: `SELECT c.name
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;          -- test the PRIMARY KEY: NULL only when there is no matching row
-- or:  WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)`,
        why: 'The anti-join pattern relies on the right-side columns being NULL exactly when there was no match. If you test a column that can be NULL for a real matched row -- shipped_at, a nullable foreign key, an optional field -- you conflate "no order at all" with "has orders, but this column is NULL". Always test a column that is guaranteed non-NULL whenever a match exists: the primary key, or the join key on the right side. NOT EXISTS avoids the question entirely by asking directly whether any matching row exists.',
        whyHi: 'Anti-join pattern right-side columns ke NULL hone par nirbhar hai theek tab jab koi match nahi tha. Agar aap ek column test karte ho jo ek real matched row ke liye NULL ho sakta hai — shipped_at, ek nullable foreign key — aap "koi order hi nahi" ko "orders hain, par ye column NULL hai" ke saath conflate karte ho. Hamesha ek column test karo jo match hone par non-NULL guaranteed hai: primary key. NOT EXISTS sawaal ko poori tarah avoid karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every "list all X with their optional Y" report is a `LEFT JOIN` with any Y-side filter moved into the `ON`** — a reviewer specifically checks that a `LEFT JOIN` has no right-table column in the `WHERE` unless it is a deliberate `IS NULL` anti-join.',
        hi: '**Har "sabhi X unke optional Y ke saath" report ek `LEFT JOIN` hai jismein koi bhi Y-side filter `ON` mein moved hai** — ek reviewer check karta hai.',
      },
      {
        en: '**`generate_series` of days `LEFT JOIN`ed to the events table with `count(e.id)`** for a daily-activity chart with a zero on empty days — `count(*)` would put a spurious `1` on every empty day.',
        hi: '**Days ka `generate_series` events table se `LEFT JOIN`ed `count(e.id)` ke saath** — empty days par zero ke liye.',
      },
      {
        en: '**A nightly reconciliation job using `FULL JOIN` between the billing system export and the payment-processor export**, keyed on transaction id, flagging every row that appears on only one side.',
        hi: '**Ek nightly reconciliation job jo billing system export aur payment-processor export ke beech `FULL JOIN` istemal karta hai**, transaction id par keyed.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a `LEFT JOIN` do that an `INNER JOIN` does not, and why does a filter on the right table in `WHERE` break it?',
        qHi: 'Ek `LEFT JOIN` kya karta hai jo ek `INNER JOIN` nahi, aur `WHERE` mein right table par ek filter ise kyun todta hai?',
        a: 'A left join produces everything an inner join does, the matched pairs, and then additionally, for every left row that found no matching right row, it emits one more output row for that left row with all the right-table columns set to NULL. So the left table is preserved: every one of its rows appears at least once, and you can see which left rows have no partner because their right columns are NULL. That is exactly what an inner join throws away. The WHERE trap comes from ordering. A condition in ON is evaluated as part of deciding whether two rows match, before the NULL-padding step. A condition in WHERE is evaluated after the entire join, including the NULL-padding, is finished. So if you left join customers to orders and then write WHERE order dot status equals paid, the customers with no orders have already been given a row with status NULL, and NULL equals paid is UNKNOWN, so that row fails the WHERE and is removed. Every unmatched customer disappears and the left join has silently become an inner join. The fix is to move any condition that restricts which right rows are eligible to match into the ON clause. Conditions on the left table, or a deliberate right dot pk IS NULL anti-join, are the legitimate uses of WHERE with a left join.',
        aHi: 'Ek left join wo sab produce karta hai jo ek inner join karta hai, matched pairs, aur phir additionally, har left row ke liye jise koi matching right row nahi mila, ye us left row ke liye ek aur output row emit karta hai jismein sabhi right-table columns NULL set hain. To left table preserved hai. Ye theek wahi hai jo ek inner join phenk deta hai. WHERE trap ordering se aata hai. ON mein ek condition ye decide karne ke hisse ke roop mein evaluate hoti hai ki do rows match karti hain, NULL-padding step se pehle. WHERE mein ek condition poore join ke baad evaluate hoti hai. To agar aap customers ko orders se left join karte ho aur phir WHERE order dot status equals paid likhte ho, bina orders waale customers ko pehle hi status NULL ke saath ek row de di gayi hai, aur NULL equals paid UNKNOWN hai. Fix koi bhi condition jo restrict kare ki kaunsi right rows match karne ke liye eligible hain use ON clause mein move karna hai.',
      },
      {
        q: 'How do you write an anti-join (rows with no match) and what column should you test?',
        qHi: 'Aap ek anti-join (bina match ki rows) kaise likhte ho aur aapko kaunsa column test karna chahiye?',
        a: 'The anti-join pattern is a left join followed by a WHERE that keeps only the rows where the right side did not match. You left join the two tables on the relationship, then add WHERE right-table-column IS NULL. The subtlety is which column to test. The pattern works because the left join sets every right-table column to NULL exactly when there was no matching right row. So you must test a column that is guaranteed to be non-NULL whenever a match does exist, which means the right table\'s primary key, or the column used in the join condition on the right side. If instead you test a nullable column, like a shipped-at timestamp or an optional foreign key, you will also match rows where a real matching row exists but that particular column happens to be NULL, conflating "no match" with "matched but this field is empty". A cleaner alternative that sidesteps the whole question is NOT EXISTS with a correlated subquery: WHERE NOT EXISTS, select 1 from the right table where the join condition holds. It asks directly whether any matching row exists, needs no column choice, and handles NULLs correctly, unlike NOT IN.',
        aHi: 'Anti-join pattern ek left join hai jiske baad ek WHERE hai jo sirf un rows ko rakhta hai jahaan right side match nahi hui. Aap do tables ko relationship par left join karte ho, phir WHERE right-table-column IS NULL add karte ho. Subtlety ye hai ki kaunsa column test karna. Pattern kaam karta hai kyunki left join har right-table column ko NULL set karta hai theek tab jab koi matching right row nahi tha. To aapko ek column test karna chahiye jo match hone par non-NULL guaranteed hai, matlab right table ki primary key. Agar aap ek nullable column test karte ho, aap un rows ko bhi match karoge jahaan ek real matching row maujood hai par wo particular column NULL hai. Ek saaf vikalp NOT EXISTS ek correlated subquery ke saath hai.',
      },
    ],

    exercises: [
      {
        task: 'Tables `author(id int, name text)` (3 authors, one with no books) and `book(id int, author_id int, sold int)`. Write a `LEFT JOIN` from `author` to `book`. Confirm the book-less author appears once with `book` columns `NULL`. Then add `WHERE book.sold > 100` and observe the book-less author vanish; fix it by moving the condition into the `ON`.',
        taskHi: 'Tables `author(id, name)` (3 authors, ek bina books ke) aur `book(id, author_id, sold)`. `author` se `book` ka `LEFT JOIN` likho. Phir `WHERE book.sold > 100` add karo aur dekho book-less author gायab ho jata hai; `ON` mein condition move karke fix karo.',
        hint: '`... LEFT JOIN book b ON b.author_id = a.id AND b.sold > 100` keeps every author; `WHERE b.sold > 100` drops any author whose `b.sold` is `NULL` (the book-less one, and any whose books all sold <= 100).',
        hintHi: '`... LEFT JOIN book b ON b.author_id = a.id AND b.sold > 100` har author rakhta hai; `WHERE b.sold > 100` kisi bhi author ko drop karta hai jiska `b.sold` `NULL` hai.',
      },
      {
        task: 'Tables `user_acct(id int, email text)` and `subscription(user_id int, plan text)`. Write two queries: (a) users with NO subscription, via `LEFT JOIN ... WHERE subscription.user_id IS NULL`; (b) the same via `WHERE NOT EXISTS (...)`. Confirm identical results. Insert one user whose subscription row has `plan = NULL` and confirm they do NOT appear in either (they have a subscription).',
        taskHi: 'Tables `user_acct(id, email)` aur `subscription(user_id, plan)`. Do queries: (a) bina subscription waale users, `LEFT JOIN ... WHERE subscription.user_id IS NULL` se; (b) `WHERE NOT EXISTS (...)` se. Confirm identical.',
        hint: 'Test `subscription.user_id` (the join key), not `subscription.plan`. A user with a `plan = NULL` subscription still has a non-NULL `user_id` in that row, so both forms correctly exclude them.',
        hintHi: '`subscription.user_id` (join key) test karo, `subscription.plan` nahi. Ek `plan = NULL` subscription waale user ke paas phir bhi us row mein ek non-NULL `user_id` hai.',
      },
      {
        task: 'Tables `product(id int, name text)` and `review(id int, product_id int, stars int)` where one product has 2 reviews, one has 0. Write `SELECT p.name, count(r.id) AS n_reviews, coalesce(round(avg(r.stars), 1), 0) AS avg_stars FROM product p LEFT JOIN review r ON r.product_id = p.id GROUP BY p.name`. Confirm the review-less product shows `0` and `0`, not `1` and `NULL`.',
        taskHi: 'Tables `product(id, name)` aur `review(id, product_id, stars)`. `SELECT p.name, count(r.id), coalesce(round(avg(r.stars), 1), 0) ... LEFT JOIN ... GROUP BY p.name` likho. Confirm review-less product `0` aur `0` dikhata hai.',
        hint: '`count(r.id)` (not `count(*)`) is `0` for the no-review product. `avg(r.stars)` over its single NULL-padded row is `NULL`, so `coalesce(..., 0)` makes it `0`.',
        hintHi: '`count(r.id)` (`count(*)` nahi) no-review product ke liye `0` hai. Iski single NULL-padded row par `avg(r.stars)` `NULL` hai, to `coalesce(..., 0)` ise `0` banata hai.',
      },
    ],

    keyTakeaways: [
      '`LEFT JOIN` = INNER JOIN + for every left row with NO matching right row, emit ONE extra output row with all right columns `NULL`. The LEFT table is preserved (every row appears >=1 time). Use for "all X and their Y if any". `INNER` would drop those unmatched left rows.',
      '`RIGHT JOIN` = `LEFT JOIN` with tables swapped (`a RIGHT JOIN b` === `b LEFT JOIN a`) — standardise on `LEFT` and reorder. `FULL JOIN` preserves BOTH sides (matched + left-only NULL-padded + right-only NULL-padded) — for reconciliation.',
      'THE #1 OUTER-JOIN BUG: for an OUTER join, `ON` and `WHERE` are NOT interchangeable. `ON` conditions run BEFORE NULL-padding (part of "do these rows match"); `WHERE` runs AFTER the whole join. A right-table condition in `WHERE` (`WHERE o.status = \'paid\'`) tests `NULL` for unmatched rows -> `UNKNOWN` -> dropped -> the `LEFT JOIN` silently becomes `INNER`.',
      'RULE: a condition RESTRICTING which right rows may match -> `ON` (`ON o.customer_id = c.id AND o.status = \'paid\'`). A condition on the LEFT table -> `WHERE` is fine. `WHERE right.pk IS NULL` -> the deliberate ANTI-JOIN exception.',
      'ANTI-JOIN ("left rows with NO match"): `LEFT JOIN ... WHERE right.<pk or join key> IS NULL`. Test a column GUARANTEED non-`NULL` when a match exists (the PK) — NOT a nullable column (or you also catch "matched but that field is `NULL`"). `NOT EXISTS` (Lesson 5) is an equivalent, cleaner form.',
      '`LEFT JOIN` + aggregation: use `count(right.col)` NOT `count(*)` — the NULL-padded row for a no-match left row makes `count(*)` return `1` instead of `0`. Wrap `sum` in `coalesce(sum(...), 0)` — `sum` of an all-`NULL` set is `NULL`, not `0`.',
      'Chaining: `a LEFT JOIN b LEFT JOIN c ON c.b_id = b.id` — if `b` is `NULL`, `c.b_id = NULL` -> `c` is also `NULL` (usually fine). But `a LEFT JOIN b ... INNER JOIN c ON c.b_id = b.id` DROPS every `a` row where `b` was `NULL` — the inner join undoes the outer.',
    ],
    keyTakeawaysHi: [
      '`LEFT JOIN` = INNER JOIN + har left row ke liye jiske paas KOI matching right row nahi, sabhi right columns `NULL` ke saath EK extra output row emit karo. LEFT table preserved hai. "sabhi X aur unke Y agar koi hai" ke liye.',
      '`RIGHT JOIN` = tables swap kiye `LEFT JOIN` — `LEFT` par standardise karo. `FULL JOIN` DONO sides preserve karta hai — reconciliation ke liye.',
      '#1 OUTER-JOIN BUG: ek OUTER join ke liye, `ON` aur `WHERE` interchangeable NAHI hain. `ON` conditions NULL-padding se PEHLE chalti hain; `WHERE` poore join ke BAAD. `WHERE` mein ek right-table condition unmatched rows ke liye `NULL` test karta hai -> `UNKNOWN` -> dropped -> `LEFT JOIN` chupchaap `INNER` ban jata hai.',
      'NIYAM: ek condition jo restrict kare ki kaunsi right rows match kar sakti hain -> `ON`. LEFT table par ek condition -> `WHERE` theek. `WHERE right.pk IS NULL` -> deliberate ANTI-JOIN exception.',
      'ANTI-JOIN: `LEFT JOIN ... WHERE right.<pk> IS NULL`. Ek column test karo jo match hone par non-`NULL` GUARANTEED hai (PK) — ek nullable column NAHI. `NOT EXISTS` (Lesson 5) ek equivalent, saaf form hai.',
      '`LEFT JOIN` + aggregation: `count(right.col)` istemal karo `count(*)` NAHI — no-match left row ke liye NULL-padded row `count(*)` ko `0` ke bजाy `1` return karvaati hai. `sum` ko `coalesce(sum(...), 0)` mein wrap karo.',
      'Chaining: `a LEFT JOIN b ... INNER JOIN c ON c.b_id = b.id` har `a` row DROP karta hai jahaan `b` `NULL` tha — inner join outer ko undo karta hai.',
    ],
  },

  {
    slug: 'sql-self-joins-and-non-equi-joins',
    title: 'Self-Joins & Non-Equi Joins: Hierarchies, Ranges, Pairs',
    titleHi: 'Self-Joins Aur Non-Equi Joins: Hierarchies, Ranges, Pairs',
    description: 'A table can join to itself — with two aliases it becomes "two copies", which is how you match an employee to their manager, or compare each row to another row of the same table. And a join condition does not have to be `=`: `ON a.value BETWEEN b.low AND b.high` buckets rows by range.',
    descriptionHi: 'Ek table khud se join kar sakti hai — do aliases ke saath ye "do copies" ban jati hai, yahi tarika hai ek employee ko unke manager se match karna, ya har row ko usi table ki doosri row se compare karna. Aur ek join condition ko `=` hona zaroori nahi: `ON a.value BETWEEN b.low AND b.high` rows ko range se bucket karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Photocopying the staff list so you can lay two copies side by side.** The company directory has one row per person, and each row also notes that person\'s manager by *their* employee number. To print "name — manager\'s name" you cannot look sideways within one copy; you take a second photocopy of the exact same list, call one copy "employees" and the other "managers", and match each employee row to the managers-copy row whose number equals the employee\'s manager number. Same table, two roles, two aliases. The non-equi part is a different idea: sometimes the thing you match on is not "these two numbers are equal" but "this number falls inside that range" — like grading a percentage by finding which band (`90–100`, `80–89`, …) it lands in. The join condition is `BETWEEN`, not `=`, and the matching table is a small lookup of bands. Both tricks come up constantly: hierarchies and "compare a row to its neighbour" need the self-join; grading, tiered pricing, time-bucketing, and "which shift was this event during" need the range join.',
      hi: '**Staff list ko photocopy karna taaki aap do copies side by side rakh sako.** Company directory mein prati vyakti ek row hai, aur har row us vyakti ke manager ko *unke* employee number se note karti hai. "name — manager ka name" print karne ke liye aap ek copy ke andar sideways nahi dekh sakte; aap wahi list ki ek doosri photocopy lete ho, ek copy ko "employees" aur doosri ko "managers" kehte ho, aur har employee row ko managers-copy row se match karte ho jiska number employee ke manager number ke barabar hai. Wahi table, do roles, do aliases. Non-equi part ek alag idea hai: kabhi jis cheez par aap match karte ho wo "ye do numbers barabar hain" nahi balki "ye number us range ke andar girta hai" hai — jaise ek percentage ko grade karna. Join condition `BETWEEN` hai, `=` nahi.',
    },

    simple: `**Self-join: a table joined to itself, TWO aliases required**

\`\`\`sql
SELECT e.name AS employee, m.name AS manager
FROM   employee e
LEFT JOIN employee m ON e.manager_id = m.id;    -- e and m are the SAME table
-- LEFT JOIN so the CEO (manager_id IS NULL) is still listed, with manager = NULL
\`\`\`

**Self-join to compare a row with another row of the same table**

\`\`\`sql
-- pairs of employees in the same department (each pair once, no self-pair)
SELECT a.name, b.name, a.dept
FROM   employee a
JOIN   employee b ON a.dept = b.dept AND a.id < b.id;   -- a.id < b.id: unordered pairs, no (x,x)
\`\`\`

**Non-equi join: the condition is a range, not \`=\`**

\`\`\`sql
SELECT s.student, s.pct, g.letter
FROM   score s
JOIN   grade g ON s.pct BETWEEN g.lo AND g.hi;   -- match each score to its grade band
-- grade(letter, lo, hi): ('A',90,100), ('B',80,89), ('C',70,79), ...
\`\`\`

**Other non-equi conditions**

\`\`\`sql
ON  event.at >= shift.starts_at AND event.at < shift.ends_at     -- which shift covered this event
ON  order.qty >= tier.min_qty                                    -- volume-pricing tier (then pick the best)
ON  a.created_at < b.created_at                                  -- b happened after a
\`\`\`

**A self non-equi join: "the previous row" without window functions (Module 6 does it better)**

\`\`\`sql
SELECT curr.day, curr.total, prev.total AS prev_total
FROM   daily curr
LEFT JOIN daily prev ON prev.day = curr.day - 1;   -- yesterday's row
\`\`\``,

    simpleHi: `**Self-join: ek table khud se join, DO aliases zaroori**

\`\`\`sql
SELECT e.name AS employee, m.name AS manager
FROM   employee e
LEFT JOIN employee m ON e.manager_id = m.id;    -- e aur m WAHI table hain
-- LEFT JOIN taaki CEO (manager_id IS NULL) phir bhi listed ho, manager = NULL ke saath
\`\`\`

**Ek row ko usi table ki doosri row se compare karne ke liye self-join**

\`\`\`sql
-- ek hi department mein employees ke pairs (har pair ek baar, koi self-pair nahi)
SELECT a.name, b.name, a.dept
FROM   employee a
JOIN   employee b ON a.dept = b.dept AND a.id < b.id;   -- a.id < b.id: unordered pairs, koi (x,x) nahi
\`\`\`

**Non-equi join: condition ek range hai, \`=\` nahi**

\`\`\`sql
SELECT s.student, s.pct, g.letter
FROM   score s
JOIN   grade g ON s.pct BETWEEN g.lo AND g.hi;   -- har score ko iske grade band se match karo
\`\`\`

**Doosri non-equi conditions**

\`\`\`sql
ON  event.at >= shift.starts_at AND event.at < shift.ends_at     -- kis shift ne is event ko cover kiya
ON  order.qty >= tier.min_qty                                    -- volume-pricing tier
ON  a.created_at < b.created_at                                  -- b, a ke baad hua
\`\`\`

**Ek self non-equi join: window functions ke bina "pichhli row" (Module 6 better karta hai)**

\`\`\`sql
SELECT curr.day, curr.total, prev.total AS prev_total
FROM   daily curr
LEFT JOIN daily prev ON prev.day = curr.day - 1;   -- kal ki row
\`\`\``,

    content: `## Self-joins

A **self-join** is a join where both sides are the same table. Nothing special happens in the engine — it is treated as two separate table references that happen to point at the same data. The **requirement** is that you give each reference a **different alias**, because otherwise every column is ambiguous:

\`\`\`sql
FROM employee e JOIN employee m ON e.manager_id = m.id
--   ^ "employees"        ^ "the managers"
\`\`\`

Now \`e.*\` is "the employee" and \`m.*\` is "their manager", two rows from the one \`employee\` table lined up side by side.

### Common self-join shapes

**1. Follow a self-referencing foreign key** (manager, parent category, reply-to comment, "supersedes" version):

\`\`\`sql
SELECT e.name, m.name AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id;   -- LEFT: keep the top of the hierarchy
\`\`\`

This gives you **one level** up. For an arbitrary number of levels (the whole reporting chain, all ancestor categories), you need a **recursive CTE** (Module 5) — a self-join only reaches one hop.

**2. Compare each row to other rows of the same table:**

\`\`\`sql
-- customers who registered on the same day
SELECT a.name, b.name, a.registered_on
FROM customer a
JOIN customer b ON a.registered_on = b.registered_on
              AND a.id < b.id;      -- a.id < b.id: each unordered pair once, and no (x, x)
\`\`\`

The \`a.id < b.id\` (or \`<>\`) condition is essential:

- Without it, every row pairs with **itself** (\`a.id = a.id\` satisfies \`a.registered_on = b.registered_on\`).
- With \`a.id <> b.id\` you get each pair **twice**: \`(Ada, Bo)\` and \`(Bo, Ada)\`.
- With \`a.id < b.id\` you get each pair **once**.

**3. "The previous / next row" by a key:**

\`\`\`sql
SELECT curr.reading_date, curr.value, prev.value AS previous_value
FROM meter curr
LEFT JOIN meter prev ON prev.reading_date = curr.reading_date - interval '1 day';
\`\`\`

This works but is fragile (it assumes readings are exactly one day apart, with no gaps). **Window functions (\`LAG\`, \`LEAD\` — Module 6) are the right tool** for "previous row in order"; the self-join version is worth knowing but rarely the best choice.

## Non-equi joins

A join condition can be **any boolean expression**, not just \`col_a = col_b\`. When it uses \`<\`, \`>\`, \`BETWEEN\`, \`<>\`, or a range overlap instead of (or in addition to) \`=\`, it is a **non-equi join** (or "theta join").

### Range / band lookup

The classic case: a small table defines bands, and you match each fact row to the band it falls in:

\`\`\`sql
CREATE TABLE tax_bracket (rate numeric, lower_bound int, upper_bound int);
-- (0.10, 0, 10000), (0.22, 10001, 40000), (0.32, 40001, NULL)

SELECT i.name, i.income, b.rate
FROM income i
JOIN tax_bracket b
  ON i.income >= b.lower_bound
 AND (i.income <= b.upper_bound OR b.upper_bound IS NULL);
\`\`\`

Grading (\`score BETWEEN lo AND hi\`), shipping zones by weight, pricing tiers by quantity, "which fiscal period is this date in" — all the same shape. Design the band table so the ranges are **contiguous and non-overlapping**, or a fact row will match multiple bands (→ duplicated fact rows) or none (→ dropped fact rows). Half-open bounds (\`>= lo AND < hi\`) tile cleanly; inclusive-both-ends bounds need care at the boundaries.

### Temporal overlap

"Which shift / session / price-validity-window covered this event":

\`\`\`sql
SELECT e.id, s.name AS shift
FROM event e
JOIN shift s ON e.occurred_at >= s.starts_at
           AND e.occurred_at <  s.ends_at;
\`\`\`

Two *ranges* overlapping (not a point in a range) is: \`a.start < b.end AND b.start < a.end\`. PostgreSQL also has **range types** (\`int4range\`, \`tstzrange\`) and the **\`&&\` overlap operator**, plus **exclusion constraints** to *prevent* overlapping rows — a cleaner model when overlap is the whole domain (Module 8/11).

### Inequality self-join for combinations

\`ON a.id < b.id\` (seen above) generates all **pairs**; \`ON a.x <= b.x\` on a numeric column generates all **ordered pairs** — the basis of a hand-rolled running total or a "every value and every value less than it" computation. These are \`O(n²)\` — fine for hundreds of rows, a problem for millions; a window function or a proper aggregate is almost always better at scale.

## Performance note

Non-equi joins **cannot use a hash join** (hashing needs equality) and often fall back to a **nested loop** — for each row on one side, scan the other side for matches. With a good index on the range column (a B-tree on \`lower_bound\`, or a GiST index on a range type) this is fine for a small band table; joining two large tables on a pure inequality is a classic slow query. Keep the band/lookup side small, index the bound columns, and check the plan (Module 10).`,

    contentHi: `## Self-joins

Ek **self-join** ek join hai jahaan dono sides wahi table hain. Engine mein kuch special nahi hota — ise do alag table references ki tarah treat kiya jata hai jo wahi data par point karte hain. **Zaroorat** ye hai ki aap har reference ko ek **alag alias** do, kyunki warna har column ambiguous hai:

\`\`\`sql
FROM employee e JOIN employee m ON e.manager_id = m.id
\`\`\`

### Aam self-join shapes

**1. Ek self-referencing foreign key follow karo** (manager, parent category, reply-to comment):

\`\`\`sql
SELECT e.name, m.name AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id;   -- LEFT: hierarchy ka top rakho
\`\`\`

Ye aapko **ek level** upar deta hai. Kisi bhi number of levels ke liye (poori reporting chain), aapko ek **recursive CTE** (Module 5) chahiye.

**2. Har row ko usi table ki doosri rows se compare karo:**

\`\`\`sql
SELECT a.name, b.name, a.registered_on
FROM customer a
JOIN customer b ON a.registered_on = b.registered_on AND a.id < b.id;
\`\`\`

\`a.id < b.id\` condition zaroori hai:
- Iske bina, har row **khud se** pair hoti hai.
- \`a.id <> b.id\` ke saath har pair **do baar** milta hai.
- \`a.id < b.id\` ke saath har pair **ek baar** milta hai.

**3. Ek key se "pichhli / agli row":** Ye kaam karta hai par fragile hai. **Window functions (\`LAG\`, \`LEAD\` — Module 6) sahi tool hain.**

## Non-equi joins

Ek join condition **koi bhi boolean expression** ho sakti hai, sirf \`col_a = col_b\` nahi. Jab ye \`<\`, \`>\`, \`BETWEEN\` istemal karta hai, ye ek **non-equi join** hai.

### Range / band lookup

Classic case: ek chhoti table bands define karti hai, aur aap har fact row ko us band se match karte ho jismein ye girti hai:

\`\`\`sql
SELECT s.student, s.pct, g.letter
FROM score s
JOIN grade g ON s.pct BETWEEN g.lo AND g.hi;
\`\`\`

Grading, shipping zones by weight, pricing tiers — sab wahi shape. Band table ko aise design karo ki ranges **contiguous aur non-overlapping** hon, warna ek fact row multiple bands (→ duplicated rows) ya none (→ dropped rows) match karegi. Half-open bounds (\`>= lo AND < hi\`) cleanly tile karti hain.

### Temporal overlap

"Kis shift ne is event ko cover kiya":

\`\`\`sql
JOIN shift s ON e.occurred_at >= s.starts_at AND e.occurred_at < s.ends_at
\`\`\`

Do *ranges* overlap: \`a.start < b.end AND b.start < a.end\`. PostgreSQL mein **range types** (\`tstzrange\`) aur **\`&&\` overlap operator** bhi hain.

### Combinations ke liye inequality self-join

\`ON a.id < b.id\` sabhi **pairs** generate karta hai. Ye \`O(n²)\` hai — hundreds of rows ke liye theek, millions ke liye problem; ek window function ya proper aggregate scale par lगbhag hamesha better hai.

## Performance note

Non-equi joins **ek hash join istemal nahi kar sakte** (hashing ko equality chahiye) aur aksar ek **nested loop** par fall back karte hain. Range column par ek achhe index ke saath (\`lower_bound\` par ek B-tree) ye ek chhoti band table ke liye theek hai; ek pure inequality par do bade tables join karna ek classic slow query hai.`,

    examples: [
      {
        title: 'Self-join: match each employee to their manager (LEFT keeps the top)',
        titleHi: 'Self-join: har employee ko unke manager se match karo (LEFT top rakhta hai)',
        code: `CREATE TABLE emp (id int, name text, mgr_id int);
INSERT INTO emp VALUES
  (1, 'Ada', NULL),   -- CEO
  (2, 'Bo',  1),
  (3, 'Cy',  1),
  (4, 'Di',  3);

SELECT e.name AS employee, m.name AS manager
FROM emp e
LEFT JOIN emp m ON e.mgr_id = m.id
ORDER BY e.name;`,
        output: ` employee | manager
----------+---------
 Ada      | NULL
 Bo       | Ada
 Cy       | Ada
 Di       | Cy
(4 rows)`,
        explain: 'A self-join is a table joined to a SECOND alias of ITSELF. `emp e` is the employee, `emp m` is the manager, matched by `e.mgr_id = m.id`. `LEFT JOIN` keeps `Ada` (the CEO, `mgr_id` NULL) with `manager` NULL — a plain `JOIN` would drop her. This only walks ONE level up; a full hierarchy of arbitrary depth needs a recursive CTE (Module 5).',
        explainHi: 'Ek self-join ek table hai jo APNE ek DOOSRE alias se joined hai. `emp e` employee hai, `emp m` manager hai, `e.mgr_id = m.id` se matched. `LEFT JOIN` `Ada` (CEO, `mgr_id` NULL) ko `manager` NULL ke saath rakhता hai — ek plain `JOIN` use drop kar deता. Ye sirf EK level upar chalता hai; arbitrary depth ki ek poori hierarchy ke liye ek recursive CTE chahिए (Module 5).',
      },
      {
        title: 'Self-join for unordered pairs: a.id < b.id gives each pair once',
        titleHi: 'Unordered pairs ke liye self-join: a.id < b.id har pair ek baar deta hai',
        code: `CREATE TABLE person (id int, name text, city text);
INSERT INTO person VALUES
  (1, 'Ada', 'London'), (2, 'Bo', 'London'), (3, 'Cy', 'London'), (4, 'Di', 'Paris');

-- pairs of people in the same city, each pair listed once, nobody paired with themselves
SELECT a.name AS person_a, b.name AS person_b, a.city
FROM person a
JOIN person b ON a.city = b.city AND a.id < b.id
ORDER BY a.name, b.name;`,
        output: ` person_a | person_b | city
----------+----------+--------
 Ada      | Bo       | London
 Ada      | Cy       | London
 Bo       | Cy       | London
(3 rows)`,
        explain: 'To list unordered pairs from one table, self-join and use `a.id < b.id` in the `ON`. `a.id <> b.id` alone would give BOTH `(Ada, Bo)` and `(Bo, Ada)` and pair nobody with themselves; `a.id < b.id` picks exactly one ordering of each pair. `Di` is in Paris alone, so she forms no pair. Three Londoners give `3 choose 2 = 3` pairs.',
        explainHi: 'Ek table se unordered pairs list karne ke liye, self-join karo aur `ON` mein `a.id < b.id` istemal karo. Akela `a.id <> b.id` `(Ada, Bo)` AUR `(Bo, Ada)` DONO deता aur kisi ko khud se pair nahi karता; `a.id < b.id` har pair ka theek ek ordering chunता hai. `Di` akeli Paris mein hai, to wo koi pair nahi banaती. Teen Londoners `3 choose 2 = 3` pairs dete hain.',
      },
      {
        title: 'Non-equi join: bucket each score into its grade band with BETWEEN',
        titleHi: 'Non-equi join: har score ko iske grade band mein BETWEEN se bucket karo',
        code: `CREATE TABLE score (student text, pct int);
INSERT INTO score VALUES ('Ana', 95), ('Ben', 82), ('Cai', 67), ('Dot', 50);

CREATE TABLE grade (letter text, lo int, hi int);
INSERT INTO grade VALUES
  ('A', 90, 100), ('B', 80, 89), ('C', 70, 79), ('D', 60, 69), ('F', 0, 59);

SELECT s.student, s.pct, g.letter
FROM score s
JOIN grade g ON s.pct BETWEEN g.lo AND g.hi   -- non-equi: a range match, not '='
ORDER BY s.pct DESC;`,
        output: ` student | pct | letter
---------+-----+--------
 Ana     | 95  | A
 Ben     | 82  | B
 Cai     | 67  | D
 Dot     | 50  | F
(4 rows)`,
        explain: 'A non-equi join matches on a RANGE, not `=`. `s.pct BETWEEN g.lo AND g.hi` pairs each score with the one grade band it falls inside: 95 -> `A` (90-100), 82 -> `B` (80-89), 67 -> `D` (60-69), 50 -> `F` (0-59). The `grade` table is a small lookup of contiguous bands. Make sure the bands do not overlap, or a score would join to two rows and fan out.',
        explainHi: 'Ek non-equi join ek RANGE par match karता hai, `=` par nahi. `s.pct BETWEEN g.lo AND g.hi` har score ko us ek grade band se pair karता hai jiske andar wo girता hai: 95 -> `A` (90-100), 82 -> `B` (80-89), 67 -> `D` (60-69), 50 -> `F` (0-59). `grade` table contiguous bands ka ek chhota lookup hai. Sunishchit karo ki bands overlap na karें, warna ek score do rows se join karके fan out karता.',
      },
    ],

    mistakes: [
      {
        wrong: `-- pairs of products in the same category
SELECT a.name, b.name
FROM product a
JOIN product b ON a.category = b.category;
-- returns (Widget, Widget), (Widget, Gadget), (Gadget, Widget), (Gadget, Gadget) ...
-- every product paired with itself, and every real pair listed twice`,
        right: `SELECT a.name, b.name
FROM product a
JOIN product b ON a.category = b.category AND a.id < b.id;
-- (Widget, Gadget) once; no self-pairs`,
        why: 'A self-join with only the category equality matches a row against itself, because a row trivially has the same category as itself, and it matches each genuine pair in both directions. Adding a.id less-than b.id does two things at once: it excludes the self-pair, since a row is never less than itself, and it picks exactly one of the two orderings of each real pair. Use less-than for "each unordered pair once", or not-equal if you deliberately want both directions. Forgetting this is the most common self-join mistake and it silently inflates the row count.',
        whyHi: 'Sirf category equality waala ek self-join ek row ko khud se match karta hai, kyunki ek row ka trivially wahi category hai jo khud ka, aur ye har genuine pair ko dono directions mein match karta hai. a.id less-than b.id ek saath do cheezein karta hai: ye self-pair exclude karta hai, aur ye har real pair ki do orderings mein se theek ek chunta hai. "har unordered pair ek baar" ke liye less-than istemal karo.',
      },
      {
        wrong: `-- grade bands with a gap and an overlap
INSERT INTO grade VALUES ('A', 90, 100), ('B', 80, 90), ('C', 70, 79);
--                                   ^^ 90 is in BOTH A and B      ^^ 89 is in NEITHER
SELECT s.pct, g.letter FROM score s JOIN grade g ON s.pct BETWEEN g.lo AND g.hi;
-- a score of 90 gets TWO rows (A and B); a score of 89 gets ZERO rows (dropped)`,
        right: `-- contiguous, non-overlapping bands (inclusive both ends here, so no shared endpoints)
INSERT INTO grade VALUES ('A', 90, 100), ('B', 80, 89), ('C', 70, 79);
-- or half-open: ('A', 90, 101), ('B', 80, 90), ('C', 70, 80)  with  pct >= lo AND pct < hi`,
        why: 'A non-equi join to a band table is only correct if the bands partition the value space: every possible fact value falls in exactly one band. If two bands share an endpoint or overlap, a fact row in the overlap matches both and is duplicated, which then double-counts in any downstream aggregate. If there is a gap, a fact row in the gap matches nothing and is silently dropped, which is worse because it is invisible. Design the band table deliberately: with inclusive BETWEEN, adjacent bands must not share an endpoint (80 to 89, then 90 to 100); with half-open bounds, each band is greater-or-equal its low and strictly less than its high, and they tile perfectly.',
        whyHi: 'Ek band table ka ek non-equi join sirf tab sahi hai jab bands value space ko partition karti hain: har sambhaavit fact value theek ek band mein girti hai. Agar do bands ek endpoint share karti hain ya overlap karti hain, overlap mein ek fact row dono match karti hai aur duplicated hoti hai. Agar ek gap hai, gap mein ek fact row kuch match nahi karti aur chupchaap drop ho jati hai, jo bura hai kyunki ye invisible hai.',
      },
      {
        wrong: `-- "each day's total and the previous day's total" via self non-equi join, on a table with gaps
SELECT curr.day, curr.total, prev.total AS yesterday
FROM daily curr
LEFT JOIN daily prev ON prev.day = curr.day - 1;
-- any day after a gap (weekend, outage) gets yesterday = NULL even though a previous row exists`,
        right: `SELECT day, total,
       lag(total) OVER (ORDER BY day) AS previous_total
FROM daily;
-- LAG takes the previous ROW in order, regardless of the actual date gap (Module 6)`,
        why: 'Matching prev dot day to curr dot day minus one assumes the rows are exactly one calendar day apart with no gaps. Real data has gaps: weekends, holidays, an outage, a day with no activity. On the day after a gap, there is no row whose day equals this day minus one, so the join finds nothing and previous is NULL even though a perfectly good earlier row exists. A window function, LAG over an ordering by day, takes whatever the previous row in that ordering is, so it is correct across gaps. The self non-equi join for previous-row is a useful concept to understand but a window function is the right tool.',
        whyHi: 'prev dot day ko curr dot day minus one se match karna maanta hai ki rows theek ek calendar day alag hain bina gaps ke. Real data mein gaps hain: weekends, holidays, ek outage. Ek gap ke baad ke din, koi row nahi hai jiska day is day minus one ke barabar hai, to join kuch nahi paata aur previous NULL hai bhale ek perfectly achhi earlier row maujood hai. Ek window function, day se ordering par LAG, jo bhi us ordering mein pichhli row hai leta hai.',
      },
    ],

    realWorld: [
      {
        en: '**`LEFT JOIN employee m ON e.manager_id = m.id` on every org-chart screen** — one level of hierarchy per join; the "full chain to the CEO" view uses a recursive CTE (Module 5) instead.',
        hi: '**Har org-chart screen par `LEFT JOIN employee m ON e.manager_id = m.id`** — prati join hierarchy ka ek level.',
      },
      {
        en: '**A `pricing_tier(min_qty, unit_price)` table joined with `ON order_line.qty >= tier.min_qty`** then `DISTINCT ON (order_line.id) ... ORDER BY tier.min_qty DESC` to pick the best-matching (highest threshold) tier for each line.',
        hi: '**Ek `pricing_tier(min_qty, unit_price)` table `ON order_line.qty >= tier.min_qty` ke saath joined** phir best-matching tier chunne ke liye.',
      },
      {
        en: '**`JOIN shift s ON e.occurred_at >= s.starts_at AND e.occurred_at < s.ends_at`** to attribute every production event to the shift that was running, with a GiST index on a `tstzrange` shift-window column keeping it fast.',
        hi: '**`JOIN shift s ON e.occurred_at >= s.starts_at AND e.occurred_at < s.ends_at`** har production event ko chal rahi shift se attribute karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a self-join, why does it need aliases, and how do you list each pair only once?',
        qHi: 'Ek self-join kya hai, ise aliases kyun chahiye, aur aap har pair ko sirf ek baar kaise list karte ho?',
        a: 'A self-join is a join where both sides refer to the same table. The engine does nothing special; it just treats it as two independent references that happen to read the same data. It needs a different alias on each reference because otherwise every column name is ambiguous, there being two copies of every column in scope. With aliases, say e for the employee copy and m for the manager copy, you can join e dot manager id to m dot id and get each employee lined up next to their manager row. That gives one level of a hierarchy; for the whole chain you need a recursive CTE. The other use of a self-join is comparing each row to other rows of the same table, for example finding pairs of people in the same city. If you join only on the city being equal, every row pairs with itself, since a row trivially shares its own city, and every real pair appears twice, once in each order. Adding a dot id less-than b dot id fixes both: a row is never less than itself so self-pairs are excluded, and exactly one of the two orderings of each real pair satisfies the strict inequality, so each unordered pair appears once. Use not-equal instead if you deliberately want both directions.',
        aHi: 'Ek self-join ek join hai jahaan dono sides wahi table refer karte hain. Engine kuch special nahi karta; ye ise do independent references ki tarah treat karta hai jo wahi data padhte hain. Ise har reference par ek alag alias chahiye kyunki warna har column name ambiguous hai. Aliases ke saath, e employee copy ke liye aur m manager copy ke liye, aap e dot manager id ko m dot id se join kar sakte ho. Ye hierarchy ka ek level deta hai; poori chain ke liye ek recursive CTE chahiye. Doosra use har row ko usi table ki doosri rows se compare karna hai. Agar aap sirf city equal hone par join karte ho, har row khud se pair hoti hai, aur har real pair do baar aati hai. a dot id less-than b dot id dono fix karta hai.',
      },
      {
        q: 'What is a non-equi join, where do you use one, and what must be true of a band/lookup table?',
        qHi: 'Ek non-equi join kya hai, aap ek kahaan istemal karte ho, aur ek band/lookup table ka kya sach hona chahiye?',
        a: 'A non-equi join is a join whose condition uses something other than plain equality, typically a comparison like less-than or greater-than, a BETWEEN, or a range overlap. The classic use is matching a fact row to a band in a small lookup table: a percentage to a grade letter with score BETWEEN low and high, an income to a tax bracket, a weight to a shipping zone, a quantity to a pricing tier, or a timestamp to the shift or price-validity window that contained it. For the join to be correct, the bands must partition the value space, meaning every possible fact value falls into exactly one band. If two bands overlap or share an endpoint, a fact value in the overlap matches both and gets duplicated, which double-counts downstream. If there is a gap, a fact value in the gap matches nothing and is silently dropped, which is worse because you cannot see it. So you design the band table deliberately, either with inclusive bounds that do not share endpoints, or with half-open bounds where each band is greater-or-equal its lower bound and strictly less than its upper, so consecutive bands tile with no seam. One caveat: non-equi joins cannot use a hash join, so they often run as a nested loop, which is fine when the band table is small and its bound columns are indexed but slow when joining two large tables on a pure inequality.',
        aHi: 'Ek non-equi join ek join hai jiski condition plain equality ke alawa kuch istemal karti hai, aam taur par ek comparison jaise less-than ya greater-than, ek BETWEEN, ya ek range overlap. Classic use ek fact row ko ek chhoti lookup table mein ek band se match karna hai: ek percentage ko ek grade letter se, ek income ko ek tax bracket se. Join ke sahi hone ke liye, bands ko value space ko partition karna chahiye, matlab har sambhaavit fact value theek ek band mein girti hai. Agar do bands overlap karti hain, overlap mein ek fact value dono match karti hai aur duplicated hoti hai. Agar ek gap hai, gap mein ek fact value kuch match nahi karti aur chupchaap drop ho jati hai. To aap band table ko jaan-boojhkar design karte ho. Ek caveat: non-equi joins ek hash join istemal nahi kar sakte.',
      },
    ],

    exercises: [
      {
        task: 'Table `category(id int, name text, parent_id int)` with rows forming a small tree (e.g. `Electronics` with children `Phones` and `Laptops`, `Phones` with child `Android`). Write a self-join that lists each category next to its parent\'s name, using `LEFT JOIN` so the root shows `parent = NULL`. Note in a comment why this only reaches one level up.',
        taskHi: 'Table `category(id, name, parent_id)` ek chhota tree banati rows ke saath. Ek self-join likho jo har category ko iske parent ke name ke saath list karti hai, `LEFT JOIN` istemal karke.',
        hint: '`FROM category c LEFT JOIN category p ON c.parent_id = p.id`. It only reaches one hop because each row of the join pairs a category with exactly one other row; the grandparent needs a second join or a recursive CTE.',
        hintHi: '`FROM category c LEFT JOIN category p ON c.parent_id = p.id`. Ye sirf ek hop pahunchता hai; grandparent ke liye ek doosra join ya recursive CTE chahiye.',
      },
      {
        task: 'Table `player(id int, name text, rating int)`. Write a self-join producing every pair of players (each pair once, no self-pair) where the two ratings differ by 100 or less: `ON a.id < b.id AND abs(a.rating - b.rating) <= 100`. Confirm the pair count is `n*(n-1)/2` minus the pairs that are too far apart.',
        taskHi: 'Table `player(id, name, rating)`. Ek self-join likho jo har pair of players deti hai (har pair ek baar) jahaan do ratings 100 ya kam se differ karti hain: `ON a.id < b.id AND abs(a.rating - b.rating) <= 100`.',
        hint: '`a.id < b.id` gives each unordered pair once; the `abs(...) <= 100` is the non-equi part restricting to close-rated pairs.',
        hintHi: '`a.id < b.id` har unordered pair ek baar deta hai; `abs(...) <= 100` non-equi part hai jo close-rated pairs tak restrict karta hai.',
      },
      {
        task: 'Tables `shipment(id int, weight_kg numeric)` and `zone(name text, min_kg numeric, max_kg numeric)` with contiguous half-open bands (`\'small\', 0, 5`), (`\'medium\', 5, 20`), (`\'large\', 20, 1000`). Join each shipment to its zone with `ON s.weight_kg >= z.min_kg AND s.weight_kg < z.max_kg`. Insert a shipment of exactly `5.0` kg and confirm it lands in `medium` (not `small`), because the bands are half-open.',
        taskHi: 'Tables `shipment(id, weight_kg)` aur `zone(name, min_kg, max_kg)` contiguous half-open bands ke saath. Har shipment ko iske zone se join karo `ON s.weight_kg >= z.min_kg AND s.weight_kg < z.max_kg`. Theek `5.0` kg ka ek shipment insert karo.',
        hint: 'Half-open: `>= min AND < max`. `5.0` fails `< 5` for `small` but passes `>= 5 AND < 20` for `medium`. Inclusive-both-ends bands would have matched `5.0` in both.',
        hintHi: 'Half-open: `>= min AND < max`. `5.0` `small` ke liye `< 5` fail karta hai par `medium` ke liye `>= 5 AND < 20` pass karta hai.',
      },
    ],

    keyTakeaways: [
      'A SELF-JOIN joins a table to itself — the engine treats it as two independent references to the same data. REQUIREMENT: a DIFFERENT ALIAS per reference (`employee e JOIN employee m`), or every column is ambiguous. `e.*` = "the row", `m.*` = "its related row".',
      'Follow a self-referencing FK (manager, parent category, reply-to): `LEFT JOIN employee m ON e.manager_id = m.id` (LEFT keeps the hierarchy root). Reaches ONE level — the full chain / all ancestors needs a RECURSIVE CTE (Module 5).',
      'Compare each row to OTHER rows of the same table (pairs in the same group): `JOIN person b ON a.city = b.city AND a.id < b.id`. Without `a.id < b.id`: every row pairs with ITSELF + every real pair appears TWICE. `a.id < b.id` = each unordered pair ONCE, no self-pair. (`<>` = both directions.)',
      '"Previous / next row" via `LEFT JOIN t prev ON prev.day = curr.day - 1` WORKS but is FRAGILE — it assumes no gaps (a weekend/outage breaks it). `LAG`/`LEAD` window functions (Module 6) take the previous ROW in order regardless of gaps — the right tool.',
      'A NON-EQUI join uses `<`, `>`, `BETWEEN`, range-overlap instead of (or with) `=`. Classic: match a fact row to a BAND in a small lookup — `score BETWEEN g.lo AND g.hi`, income->tax bracket, weight->shipping zone, qty->pricing tier, timestamp->shift window.',
      'The band table MUST PARTITION the value space (every fact value in EXACTLY one band). OVERLAP / shared endpoint -> a fact row matches multiple bands -> DUPLICATED (double-counts downstream). GAP -> a fact row matches NONE -> silently DROPPED (worse — invisible). Half-open bounds (`>= lo AND < hi`) tile cleanly.',
      'Range OVERLAP (two ranges, not a point in a range): `a.start < b.end AND b.start < a.end`. PostgreSQL also has range types (`tstzrange`) + the `&&` operator + exclusion constraints (Module 8/11).',
      'PERFORMANCE: non-equi joins CANNOT use a hash join (needs `=`) -> often a nested loop. Fine with a SMALL indexed band table; joining two LARGE tables on a pure inequality is a classic slow query. Inequality self-joins for combinations are `O(n²)` — a window function / aggregate is better at scale.',
    ],
    keyTakeawaysHi: [
      'Ek SELF-JOIN ek table ko khud se join karta hai. ZAROORAT: prati reference ek ALAG ALIAS (`employee e JOIN employee m`), warna har column ambiguous hai.',
      'Ek self-referencing FK follow karo (manager, parent category): `LEFT JOIN employee m ON e.manager_id = m.id`. EK level pahunchता hai — poori chain ke liye ek RECURSIVE CTE (Module 5) chahiye.',
      'Har row ko usi table ki DOOSRI rows se compare karo: `JOIN person b ON a.city = b.city AND a.id < b.id`. `a.id < b.id` ke bina: har row KHUD se pair hoti hai + har real pair DO baar aati hai. `a.id < b.id` = har unordered pair EK baar.',
      '"Pichhli / agli row" `LEFT JOIN t prev ON prev.day = curr.day - 1` se KAAM karta hai par FRAGILE — ye no gaps maanta hai. `LAG`/`LEAD` window functions (Module 6) gaps chahे jo ho pichhli ROW leti hain — sahi tool.',
      'Ek NON-EQUI join `<`, `>`, `BETWEEN`, range-overlap istemal karta hai `=` ke bजाy. Classic: ek fact row ko ek chhoti lookup mein ek BAND se match karo — `score BETWEEN g.lo AND g.hi`.',
      'Band table ko value space PARTITION karna CHAHIYE (har fact value THEEK ek band mein). OVERLAP -> DUPLICATED. GAP -> silently DROPPED (bura — invisible). Half-open bounds (`>= lo AND < hi`) cleanly tile karti hain.',
      'Range OVERLAP: `a.start < b.end AND b.start < a.end`. PostgreSQL mein range types (`tstzrange`) + `&&` operator + exclusion constraints bhi hain.',
      'PERFORMANCE: non-equi joins ek hash join istemal NAHI kar sakte -> aksar ek nested loop. Ek CHHOTI indexed band table ke saath theek; do BADE tables ko ek pure inequality par join karna ek classic slow query hai.',
    ],
  },
];
