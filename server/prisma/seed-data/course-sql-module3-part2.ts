/**
 * Databases Complete Course — Module 3: Joins, lessons 4-6.
 *
 * Lesson 4: CROSS JOIN & fan-out — the deliberate cross join (calendar x entity), the
 *           ACCIDENTAL cross join (missing ON / comma join), fan-out from a one-to-many
 *           join multiplying rows so sum/count/avg are wrong, and the fixes
 *           (count(DISTINCT), aggregate-before-join, two independent subqueries).
 * Lesson 5: join vs subquery vs EXISTS — "combine columns" is a join, "filter by
 *           existence" is a semi-join (EXISTS / IN), the anti-join (NOT EXISTS), the
 *           NOT IN + NULL trap, DISTINCT-after-join vs EXISTS, when the planner treats
 *           them the same.
 * Lesson 6: LATERAL joins — a subquery in FROM that can reference earlier FROM items;
 *           CROSS JOIN LATERAL / LEFT JOIN LATERAL ... ON true; top-N-per-group with
 *           LATERAL + LIMIT; LATERAL with set-returning functions; vs a scalar subquery.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 3
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'sql-cross-joins-and-fan-out',
    title: 'CROSS JOIN & Fan-Out: When a Join Multiplies Your Rows',
    titleHi: 'CROSS JOIN Aur Fan-Out: Jab Ek Join Aapki Rows Multiply Kare',
    description: 'A `CROSS JOIN` deliberately pairs every left row with every right row — useful for building a grid (every product × every month). The danger: a join to a one-to-many table *also* multiplies rows, so a `sum` or `count` after it double-counts. And a `JOIN` with no `ON` is an accidental cross join.',
    descriptionHi: 'Ek `CROSS JOIN` jaan-boojhkar har left row ko har right row se pair karta hai — ek grid banane ke liye useful (har product × har month). Khatra: ek one-to-many table ka join *bhi* rows multiply karta hai, to iske baad ek `sum` ya `count` double-count karta hai. Aur bina `ON` ke ek `JOIN` ek accidental cross join hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A spreadsheet where one stray formula copies a value down every row.** You have a sheet of *customers* and, next to it, a sheet of *their orders*. You want a report with one line per customer and their total spend. You paste the orders in beside the customers, matched by id — but a customer with three orders now occupies **three rows** on the combined sheet, and their name, their signup date, their address are all repeated on each of those three rows. Now you sum the "customer lifetime value" column, which was on the *customer* side: that value gets added **once per order row**, so a customer whose true value is £100 contributes £300 to the total. Nothing errored; the number is just silently triple. The fix is to either count distinct customers, or total the orders *first* (collapsing them to one number per customer) *before* laying the sheets side by side. A **deliberate** cross join is the opposite situation — you *want* every pairing, like generating a blank row for every (store, product, week) so you can see which combinations had zero sales.',
      hi: '**Ek spreadsheet jahaan ek stray formula ek value ko har row mein neeche copy karta hai.** Aapke paas *customers* ki ek sheet hai aur, iske paas, *unke orders* ki ek sheet. Aap ek report chahte ho prati customer ek line aur unke total spend ke saath. Aap orders ko customers ke paas paste karte ho, id se matched — par teen orders waala ek customer ab combined sheet par **teen rows** occupy karta hai, aur unka name, signup date, address sab un teen rows par repeat hote hain. Ab aap "customer lifetime value" column sum karte ho, jo *customer* side par tha: wo value **prati order row ek baar** add hota hai, to jiski true value £100 hai wo total mein £300 contribute karta hai. Kuch error nahi hua; number bस chupchaap triple hai. Fix ya distinct customers count karna hai, ya orders ko *pehle* total karna. Ek **deliberate** cross join ulta hai — aap *har* pairing chahte ho.',
    },

    simple: `**\`CROSS JOIN\` — every left row x every right row, on purpose**

\`\`\`sql
SELECT s.name AS store, m.month
FROM   store s
CROSS JOIN (SELECT generate_series(1, 12) AS month) m;
-- 5 stores x 12 months = 60 rows -- a blank grid you can LEFT JOIN sales onto
\`\`\`

**Accidental cross join — a \`JOIN\` with no \`ON\`, or a comma with no \`WHERE\`**

\`\`\`sql
FROM a, b                         -- no linking WHERE -> a x b
FROM a JOIN b ON true             -- explicit, at least honest
FROM a JOIN b ON a.x = b.y JOIN c -- missing ON for c -> c is cross-joined to (a x b)
\`\`\`

**Fan-out: a one-to-many join multiplies rows**

\`\`\`sql
-- customer 1:N orders.  A customer with 3 orders -> 3 rows in the joined result.
SELECT c.name, c.credit_limit, o.total
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- c.name and c.credit_limit are REPEATED on every one of that customer's order rows
\`\`\`

**The double-count bug**

\`\`\`sql
-- WRONG: sum(c.credit_limit) adds the limit once PER ORDER
SELECT sum(c.credit_limit) FROM customer c JOIN orders o ON o.customer_id = c.id;

-- WRONG: two one-to-many joins multiply each other
SELECT c.id, sum(o.total), sum(p.amount)          -- BOTH sums are inflated
FROM customer c
JOIN orders  o ON o.customer_id = c.id            -- N orders
JOIN payment p ON p.customer_id = c.id;           -- M payments -> N*M rows per customer
\`\`\`

**Fixes**

\`\`\`sql
-- count distinct the thing you actually want to count
SELECT count(DISTINCT c.id) FROM customer c JOIN orders o ON ...;

-- aggregate the many-side FIRST, then join the single row
SELECT c.name, ot.order_total
FROM customer c
JOIN (SELECT customer_id, sum(total) AS order_total FROM orders GROUP BY customer_id) ot
  ON ot.customer_id = c.id;

-- two independent aggregates: two subqueries, not two joins
SELECT c.name,
  (SELECT sum(total)  FROM orders  o WHERE o.customer_id = c.id) AS order_total,
  (SELECT sum(amount) FROM payment p WHERE p.customer_id = c.id) AS payment_total
FROM customer c;
\`\`\``,

    simpleHi: `**\`CROSS JOIN\` — har left row x har right row, jaan-boojhkar**

\`\`\`sql
SELECT s.name AS store, m.month
FROM   store s
CROSS JOIN (SELECT generate_series(1, 12) AS month) m;
-- 5 stores x 12 months = 60 rows -- ek blank grid jispar aap sales LEFT JOIN kar sakte ho
\`\`\`

**Accidental cross join — bina \`ON\` ke ek \`JOIN\`, ya bina \`WHERE\` ke ek comma**

\`\`\`sql
FROM a, b                         -- koi linking WHERE nahi -> a x b
FROM a JOIN b ON a.x = b.y JOIN c -- c ke liye missing ON -> c (a x b) se cross-joined
\`\`\`

**Fan-out: ek one-to-many join rows multiply karta hai**

\`\`\`sql
-- customer 1:N orders.  3 orders waala customer -> joined result mein 3 rows.
SELECT c.name, c.credit_limit, o.total
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- c.name aur c.credit_limit us customer ki har order row par REPEAT hote hain
\`\`\`

**Double-count bug**

\`\`\`sql
-- GALAT: sum(c.credit_limit) limit ko PRATI ORDER ek baar add karta hai
SELECT sum(c.credit_limit) FROM customer c JOIN orders o ON o.customer_id = c.id;

-- GALAT: do one-to-many joins ek doosre ko multiply karte hain
SELECT c.id, sum(o.total), sum(p.amount)          -- DONO sums inflated
FROM customer c
JOIN orders  o ON o.customer_id = c.id
JOIN payment p ON p.customer_id = c.id;           -- N*M rows prati customer
\`\`\`

**Fixes**

\`\`\`sql
-- jo cheez aap asal mein count karna chahte ho use count distinct karo
SELECT count(DISTINCT c.id) FROM customer c JOIN orders o ON ...;

-- many-side ko PEHLE aggregate karo, phir single row join karo
SELECT c.name, ot.order_total
FROM customer c
JOIN (SELECT customer_id, sum(total) AS order_total FROM orders GROUP BY customer_id) ot
  ON ot.customer_id = c.id;

-- do independent aggregates: do subqueries, do joins nahi
SELECT c.name,
  (SELECT sum(total)  FROM orders  o WHERE o.customer_id = c.id) AS order_total,
  (SELECT sum(amount) FROM payment p WHERE p.customer_id = c.id) AS payment_total
FROM customer c;
\`\`\``,

    content: `## \`CROSS JOIN\` — the deliberate one

\`a CROSS JOIN b\` produces every combination of a row from \`a\` and a row from \`b\`, with no condition. \`|a| × |b|\` rows. It is the "combine" step of a join with no "filter". Written explicitly (\`CROSS JOIN\`) it signals intent; written as \`FROM a, b\` with no \`WHERE\` it is the same thing but looks like a mistake.

Legitimate uses:

- **Building a dense grid.** \`store CROSS JOIN month\` gives a row for every (store, month) pair; \`LEFT JOIN\` the sales table onto it and \`coalesce(sum(sales), 0)\` and you have a report where every store-month appears even with zero sales.
- **Expanding a small dimension.** \`CROSS JOIN (VALUES ('S'),('M'),('L')) AS sizes(size)\` to generate a variant row per size.
- **\`CROSS JOIN generate_series(...)\`** to fan a single row into N.

If either side has more than a few rows this explodes: \`1000 × 1000\` is a million rows. Keep at least one side tiny.

## The accidental cross join

Every table in a \`FROM\` must be connected to the rest by a join condition. If one is not, it is cross-joined:

\`\`\`sql
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN product p                              -- forgot: ON p.id = ...
\`\`\`

Now \`p\` is cross-joined to \`(orders ⋈ customer)\` — every order paired with every product. On real data this is millions of rows, a slow query or an out-of-memory error, and if you \`LIMIT\` it you get *plausible-looking wrong data*. The comma form (\`FROM a, b, c WHERE ...\`) makes this easy to do — a missing \`AND a.x = c.y\` in the \`WHERE\` and \`c\` is unconstrained. Use \`JOIN ... ON\` so a missing condition is a visible gap, and check that every table in the \`FROM\` has a path to the others.

## Fan-out — the quiet correctness bug

A join to a table on the **many** side of a one-to-many relationship **multiplies the rows** on the one side. \`customer JOIN orders\` — a customer with 3 orders becomes 3 rows in the result, and **every column from \`customer\` is repeated on all 3**.

That is fine if you only read the order data. It is a **bug the moment you aggregate a column from the one side**, or a second many-side table:

### Case 1: aggregating a one-side column after a many-side join

\`\`\`sql
SELECT sum(c.credit_limit)
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- a customer with limit 5000 and 3 orders contributes 15000, not 5000
\`\`\`

**Fix:** \`sum(DISTINCT ...)\` only works if the values are distinct (limits often are not). The reliable fixes are \`count(DISTINCT c.id)\` for a count, or aggregate on the customer table without the join, or a subquery.

### Case 2: two many-side joins multiply each other

\`\`\`sql
SELECT c.id, sum(o.total) AS orders_total, sum(p.amount) AS payments_total
FROM customer c
JOIN orders  o ON o.customer_id = c.id
JOIN payment p ON p.customer_id = c.id
GROUP BY c.id;
\`\`\`

A customer with 3 orders and 2 payments produces **3 × 2 = 6 rows**. \`sum(o.total)\` adds each order **twice** (once per payment), \`sum(p.amount)\` adds each payment **three times**. **Both totals are wrong**, and the error factor depends on the other relation's row count, so it is not even a constant multiplier you could divide out.

**Fixes for fan-out:**

1. **Aggregate the many-side first, then join the pre-aggregated single row:**

   \`\`\`sql
   SELECT c.name, o.order_total, p.payment_total
   FROM customer c
   LEFT JOIN (SELECT customer_id, sum(total) AS order_total FROM orders GROUP BY customer_id) o
     ON o.customer_id = c.id
   LEFT JOIN (SELECT customer_id, sum(amount) AS payment_total FROM payment GROUP BY customer_id) p
     ON p.customer_id = c.id;
   \`\`\`

   Each subquery collapses its table to one row per customer, so the joins are now one-to-one and nothing multiplies.

2. **Independent scalar subqueries in the \`SELECT\` list** (no join at all for the aggregates):

   \`\`\`sql
   SELECT c.name,
     (SELECT sum(total)  FROM orders  WHERE customer_id = c.id) AS order_total,
     (SELECT sum(amount) FROM payment WHERE customer_id = c.id) AS payment_total
   FROM customer c;
   \`\`\`

   Clear and correct; can be slower if the subqueries are not well-indexed (Module 5).

3. **\`count(DISTINCT ...)\` / \`sum(DISTINCT ...)\`** — patches a \`count\` cheaply, but \`sum(DISTINCT)\` is usually wrong (two customers can legitimately have the same order total).

4. **\`FILTER\` + a single join** works when both aggregates are over the *same* table, but not for two different many-side tables.

### How to spot fan-out

- The result has **more rows than you expected** for the grain you asked for.
- A \`sum\` or \`count\` is a **suspiciously round multiple** of the right answer.
- The query has **two or more joins to tables that are each many-per-key**.

The Django course's Module 3 and Module 13 cover the ORM version of exactly this bug (\`annotate(Sum(...), Sum(...))\` over two relations double-counts).`,

    contentHi: `## \`CROSS JOIN\` — deliberate waala

\`a CROSS JOIN b\` \`a\` ki ek row aur \`b\` ki ek row ka har combination produce karta hai, bina condition ke. \`|a| × |b|\` rows. Explicitly likha (\`CROSS JOIN\`) ye intent signal karta hai; \`FROM a, b\` bina \`WHERE\` ke wahi cheez hai par ek mistake dikhता hai.

Legitimate uses:
- **Ek dense grid banana.** \`store CROSS JOIN month\` har (store, month) pair ke liye ek row deta hai; ispar sales table \`LEFT JOIN\` karo aur har store-month appear karta hai zero sales ke saath bhi.
- **Ek chhoti dimension expand karna.**

Agar kisi bhi side ke paas kuch se zyada rows hain ye explode hota hai. Kam se kam ek side ko tiny rakho.

## Accidental cross join

\`FROM\` mein har table ko baaki se ek join condition se connected hona chahiye. Agar ek nahi hai, ye cross-joined hai:

\`\`\`sql
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN product p                              -- bhool gaye: ON p.id = ...
\`\`\`

Ab \`p\` \`(orders ⋈ customer)\` se cross-joined hai. Real data par ye millions of rows hai, ek slow query ya out-of-memory error, aur agar aap \`LIMIT\` karte ho aapko *plausible-dikhता galat data* milta hai.

## Fan-out — quiet correctness bug

Ek one-to-many relationship ke **many** side par ek table ka join one side par **rows multiply karta hai**. \`customer JOIN orders\` — 3 orders waala ek customer result mein 3 rows ban jata hai, aur **\`customer\` se har column un 3 par repeat hota hai**.

Ye theek hai agar aap sirf order data read karte ho. Ye ek **bug hai jis pal aap one side se ek column aggregate karte ho**, ya ek doosri many-side table.

### Case 1: ek many-side join ke baad ek one-side column aggregate karna

\`\`\`sql
SELECT sum(c.credit_limit)
FROM customer c JOIN orders o ON o.customer_id = c.id;
-- limit 5000 aur 3 orders waala customer 15000 contribute karta hai, 5000 nahi
\`\`\`

### Case 2: do many-side joins ek doosre ko multiply karte hain

3 orders aur 2 payments waala customer **3 × 2 = 6 rows** produce karta hai. \`sum(o.total)\` har order **do baar** add karta hai, \`sum(p.amount)\` har payment **teen baar**. **Dono totals galat hain.**

**Fan-out ke fixes:**

1. **Many-side ko pehle aggregate karo, phir pre-aggregated single row join karo:** har subquery apni table ko prati customer ek row mein collapse karta hai, to joins ab one-to-one hain.
2. **\`SELECT\` list mein independent scalar subqueries** (aggregates ke liye koi join nahi).
3. **\`count(DISTINCT ...)\`** — ek \`count\` ko sasta patch karta hai, par \`sum(DISTINCT)\` aksar galat hai.

### Fan-out kaise spot karo

- Result mein aapki expected se **zyada rows**.
- Ek \`sum\` ya \`count\` sahi answer ka ek **suspiciously round multiple**.
- Query mein **do ya zyada joins tables ke liye jo prati-key many hain**.

Django course ke Module 3 aur Module 13 theek is bug ka ORM version cover karte hain.`,

    examples: [
      {
        title: 'A deliberate CROSS JOIN builds a dense (dept x quarter) grid',
        titleHi: 'Ek deliberate CROSS JOIN ek dense (dept x quarter) grid banata hai',
        code: `CREATE TABLE dept (name text);
INSERT INTO dept VALUES ('eng'), ('sales');

SELECT d.name AS dept, q.quarter
FROM dept d
CROSS JOIN (SELECT unnest(ARRAY['Q1','Q2','Q3']) AS quarter) q
ORDER BY d.name, q.quarter;`,
        output: ` dept  | quarter
-------+---------
 eng   | Q1
 eng   | Q2
 eng   | Q3
 sales | Q1
 sales | Q2
 sales | Q3
(6 rows)`,
        explain: '`CROSS JOIN` pairs every left row with every right row and takes NO condition: 2 departments x 3 quarters = 6 rows. This is the deliberate use — a dense skeleton. In a real report you would then `LEFT JOIN` the facts onto this grid and `coalesce(sum(...), 0)` so every dept/quarter cell shows, including the ones with zero activity.',
        explainHi: '`CROSS JOIN` har left row ko har right row se pair karता hai aur KOI condition nahi leta: 2 departments x 3 quarters = 6 rows. Ye deliberate use hai — ek dense skeleton. Ek real report mein aap phir facts ko is grid par `LEFT JOIN` karते aur `coalesce(sum(...), 0)` taaki har dept/quarter cell dikhे, zero activity waale bhi.',
      },
      {
        title: 'Fan-out: a one-to-many join double-counts a one-side column',
        titleHi: 'Fan-out: ek one-to-many join ek one-side column double-count karta hai',
        code: `CREATE TABLE customer (id int, name text, credit_limit int);
INSERT INTO customer VALUES (1, 'Acme', 5000), (2, 'Globex', 3000);

CREATE TABLE ordr (id int, customer_id int, total int);
INSERT INTO ordr VALUES (10, 1, 100), (11, 1, 200), (12, 1, 50), (13, 2, 400);
-- Acme has 3 orders, Globex has 1

-- WRONG: credit_limit is summed once per order row
SELECT sum(c.credit_limit) AS wrong_limit_sum, count(*) AS joined_rows
FROM customer c JOIN ordr o ON o.customer_id = c.id;

-- RIGHT: count distinct customers / sum limits without the join
SELECT count(DISTINCT c.id) AS n_customers,
       (SELECT sum(credit_limit) FROM customer) AS real_limit_sum
FROM customer c JOIN ordr o ON o.customer_id = c.id;`,
        output: ` wrong_limit_sum | joined_rows
-----------------+-------------
 18000           | 4
(1 row)

 n_customers | real_limit_sum
-------------+----------------
 2           | 8000
(1 row)`,
        explain: "`Acme` has 3 orders, so joining `customer` to `ordr` turns Acme's single row into 3 identical rows — and `sum(c.credit_limit)` adds `5000` once PER ORDER row: `5000*3 + 3000*1 = 18000`, not the true `8000`. `joined_rows` is 4, not 2. The fixes: `count(DISTINCT c.id)` collapses the duplicates for a count, and to total a one-side column you must sum it WITHOUT the fan-out join (here a subquery over `customer` alone).",
        explainHi: '`Acme` ke 3 orders hain, to `customer` ko `ordr` se join karna Acme ki single row ko 3 identical rows banata hai — aur `sum(c.credit_limit)` `5000` ko PRATI ORDER row ek baar add karता hai: `5000*3 + 3000*1 = 18000`, asli `8000` nahi. `joined_rows` 4 hai, 2 nahi. Fixes: `count(DISTINCT c.id)` ek count ke liye duplicates collapse karता hai, aur ek one-side column total karne ke liye aapko use fan-out join ke BINA sum karna hoga.',
      },
      {
        title: 'Two many-side joins multiply; aggregate-before-join fixes it',
        titleHi: 'Do many-side joins multiply karte hain; aggregate-before-join fix karta hai',
        code: `CREATE TABLE cust (id int, name text);
INSERT INTO cust VALUES (1, 'Acme');
CREATE TABLE ordr (customer_id int, total int);
INSERT INTO ordr VALUES (1, 100), (1, 200), (1, 50);       -- 3 orders, real total 350
CREATE TABLE pay (customer_id int, amount int);
INSERT INTO pay VALUES (1, 120), (1, 230);                  -- 2 payments, real total 350

-- WRONG: 3 orders x 2 payments = 6 rows -> both sums inflated
SELECT sum(o.total) AS orders_x, sum(p.amount) AS pays_x
FROM cust c JOIN ordr o ON o.customer_id = c.id JOIN pay p ON p.customer_id = c.id;

-- RIGHT: collapse each side to one row per customer first
SELECT c.name, ot.t AS orders_total, pt.t AS pays_total
FROM cust c
LEFT JOIN (SELECT customer_id, sum(total)  AS t FROM ordr GROUP BY customer_id) ot ON ot.customer_id = c.id
LEFT JOIN (SELECT customer_id, sum(amount) AS t FROM pay  GROUP BY customer_id) pt ON pt.customer_id = c.id;`,
        output: ` orders_x | pays_x
----------+--------
 700      | 1050
(1 row)

 name | orders_total | pays_total
------+--------------+------------
 Acme | 350          | 350
(1 row)`,
        explain: "The customer's real order total is 350 and real payment total is 350. Joining `cust` to BOTH `ordr` (3 rows) and `pay` (2 rows) produces the cartesian product: 3 x 2 = 6 rows. `sum(o.total)` adds each order twice (once per payment) -> 700; `sum(p.amount)` adds each payment three times -> 1050. Both wrong, with DIFFERENT factors. The fix: collapse each child to one row per customer in a subquery FIRST, then join those pre-aggregated rows one-to-one.",
        explainHi: 'Customer ka asli order total 350 hai aur asli payment total 350. `cust` ko `ordr` (3 rows) AUR `pay` (2 rows) DONO se join karna cartesian product produce karता hai: 3 x 2 = 6 rows. `sum(o.total)` har order do baar add karता hai -> 700; `sum(p.amount)` har payment teen baar -> 1050. Dono galat, ALAG factors ke saath. Fix: har child ko ek subquery mein PEHLE prati customer ek row mein collapse karo, phir un pre-aggregated rows ko one-to-one join karo.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "total order value and total items shipped, per customer"
SELECT c.name, sum(ol.line_total) AS order_value, sum(sh.qty) AS shipped_qty
FROM customer c
JOIN order_line ol ON ol.customer_id = c.id
JOIN shipment   sh ON sh.customer_id = c.id
GROUP BY c.name;
-- a customer with 4 order lines and 3 shipments -> 12 rows -> both sums are ~inflated`,
        right: `SELECT c.name, ol.v AS order_value, sh.q AS shipped_qty
FROM customer c
LEFT JOIN (SELECT customer_id, sum(line_total) AS v FROM order_line GROUP BY customer_id) ol
  ON ol.customer_id = c.id
LEFT JOIN (SELECT customer_id, sum(qty) AS q FROM shipment GROUP BY customer_id) sh
  ON sh.customer_id = c.id;`,
        why: 'Joining a customer to two separate one-to-many tables produces the cartesian product of the two child sets for each customer: four order lines times three shipments is twelve rows, and the order-line total is added three times while the shipment quantity is added four times. Neither sum is right, and the inflation factor is different for each and depends on the other table\'s row count, so you cannot fix it by dividing. The correct approach is to aggregate each child table down to one row per customer in a subquery, then join those pre-aggregated rows, which are now one-to-one with the customer. Alternatively, compute each total as an independent scalar subquery in the SELECT list.',
        whyHi: 'Ek customer ko do alag one-to-many tables se join karna har customer ke liye do child sets ka cartesian product produce karta hai: chaar order lines guna teen shipments baarah rows hai, aur order-line total teen baar add hota hai jabki shipment quantity chaar baar. Koi sum sahi nahi hai, aur inflation factor har ek ke liye alag hai aur doosri table ke row count par nirbhar karta hai. Sahi approach har child table ko ek subquery mein prati customer ek row tak aggregate karna hai, phir un pre-aggregated rows ko join karna.',
      },
      {
        wrong: `SELECT o.id, o.total, c.name, p.title
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN product p;                                 -- no ON clause for product
-- every order paired with every product -- millions of rows`,
        right: `SELECT o.id, o.total, c.name, p.title
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN order_line ol ON ol.order_id = o.id
JOIN product p ON p.id = ol.product_id;         -- product connects via the line item`,
        why: 'A JOIN without an ON clause (or a comma-join without a linking WHERE) is a cross join: every row on the left paired with every row on the right. Here product has no relationship expressed to the rest of the FROM, so the result is the cross product of orders-times-customers with the entire product table. On real data that is a runaway query. The real relationship is that an order contains order lines and each line references a product, so product must join through order_line. The lesson: every table in the FROM must have a join condition connecting it to at least one other table, and a JOIN with no ON should never appear unless it is an explicit, intentional CROSS JOIN.',
        whyHi: 'Bina ON clause ke ek JOIN (ya bina linking WHERE ke ek comma-join) ek cross join hai: left par har row right par har row se paired. Yahaan product ka baaki FROM se koi relationship express nahi kiya, to result orders-guna-customers ka cross product poori product table ke saath hai. Asli relationship ye hai ki ek order mein order lines hain aur har line ek product reference karti hai, to product ko order_line ke through join karna hoga.',
      },
      {
        wrong: `-- "how many customers have placed an order"
SELECT count(*) FROM customer c JOIN orders o ON o.customer_id = c.id;
-- counts ORDER rows, not customers -- a customer with 5 orders is counted 5 times`,
        right: `SELECT count(DISTINCT c.id) FROM customer c JOIN orders o ON o.customer_id = c.id;
-- or:  SELECT count(*) FROM customer c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
        why: 'After a one-to-many join, count star counts the rows in the joined result, which is one per order, not one per customer. A customer with five orders contributes five to the count, so the number is the total order count of customers-who-ordered, not the number of such customers. count of DISTINCT the customer id collapses the duplicates and gives the customer count. Even cleaner for a pure existence question is count star of customer where EXISTS an order, which never fans out in the first place because EXISTS is a semi-join that does not multiply rows.',
        whyHi: 'Ek one-to-many join ke baad, count star joined result mein rows count karta hai, jo prati order ek hai, prati customer nahi. Paanch orders waala ek customer count mein paanch contribute karta hai. count of DISTINCT customer id duplicates collapse karta hai. Ek pure existence sawaal ke liye aur saaf count star of customer where EXISTS an order hai, jo pehle jagah fan out hi nahi karta kyunki EXISTS ek semi-join hai jo rows multiply nahi karta.',
      },
    ],

    realWorld: [
      {
        en: '**A "coverage matrix" report built with `region CROSS JOIN product_line` `LEFT JOIN`ed to sales** — so every region/line combination shows, and the ones with zero revenue (the gaps in coverage) are visible, not just absent.',
        hi: '**Ek "coverage matrix" report `region CROSS JOIN product_line` `LEFT JOIN`ed to sales se** — taaki har combination dikhे.',
      },
      {
        en: '**A dashboard query that computes `orders_total` and `refunds_total` as two subqueries, never two joins** — after a QA bug where a customer with many of both showed revenue inflated by the refund count.',
        hi: '**Ek dashboard query jo `orders_total` aur `refunds_total` ko do subqueries ke roop mein compute karta hai, kabhi do joins nahi** — ek QA bug ke baad.',
      },
      {
        en: '**A review rule: any query with two `JOIN`s to different child tables and a `sum`/`count` gets a hard look for fan-out** — the aggregate-before-join subquery pattern is the standard fix in the codebase.',
        hi: '**Ek review rule: do child tables ke do `JOIN`s aur ek `sum`/`count` waali koi query fan-out ke liye check hoti hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is fan-out, how does it corrupt a `sum`, and what are the fixes?',
        qHi: 'Fan-out kya hai, ye ek `sum` ko kaise corrupt karta hai, aur fixes kya hain?',
        a: 'Fan-out is what happens when you join to a table on the many side of a one-to-many relationship. Each row on the one side is paired with every matching row on the many side, so a customer with three orders becomes three rows in the joined result, and every column from the customer is repeated on all three. Reading the order data is fine. The problem is aggregating a column that comes from the one side, or from a second many-side table. If you sum the customer credit limit after joining to orders, the limit is added once per order row, so a customer with limit five thousand and three orders contributes fifteen thousand. Worse, if you join a customer to two different child tables, orders and payments, you get the cartesian product of the two child sets, three orders times two payments is six rows, and the order total is summed twice while the payment total is summed three times, with different inflation factors that you cannot divide out. The fixes: for a count, use count of distinct the key you actually want. For sums, aggregate each child table to one row per parent in a subquery and then join those pre-aggregated rows, which are one-to-one with the parent, or compute each total as an independent scalar subquery in the select list. sum of distinct is usually wrong because two rows can legitimately have the same value.',
        aHi: 'Fan-out wo hai jab aap ek one-to-many relationship ke many side par ek table se join karte ho. One side par har row many side par har matching row se paired hoti hai, to teen orders waala ek customer joined result mein teen rows ban jata hai, aur customer se har column un teenon par repeat hota hai. Order data read karna theek hai. Problem ek column aggregate karna hai jo one side se aata hai, ya ek doosri many-side table se. Agar aap orders se join karne ke baad customer credit limit sum karte ho, limit prati order row ek baar add hoti hai. Aur bura, agar aap ek customer ko do alag child tables se join karte ho, aapko do child sets ka cartesian product milta hai. Fixes: ek count ke liye, count of distinct istemal karo. Sums ke liye, har child table ko ek subquery mein prati parent ek row tak aggregate karo aur phir un pre-aggregated rows ko join karo.',
      },
      {
        q: 'When is a `CROSS JOIN` intentional, and how do you accidentally write one?',
        qHi: 'Ek `CROSS JOIN` kab intentional hai, aur aap ek accidentally kaise likhte ho?',
        a: 'A cross join produces every combination of a row from the left and a row from the right, with no condition, so the row count is the product of the two sizes. It is intentional when you actually want that grid. The common case is building a dense report skeleton: cross join a small dimension like stores against another like months, then left join the fact table onto it and coalesce the missing values to zero, so the report has a row for every store-month even the ones with no activity, and the gaps are visible rather than absent. It is also used to expand one row into several, for example cross joining against generate series, or against a small values list of sizes or variants. You write one accidentally in two ways. First, the comma form of from, from a comma b, with a missing or incomplete where clause linking them: forget the a dot x equals b dot y and you get the full product. Second, a JOIN with no ON clause, or a multi-table from where one table has no join condition connecting it to the others, so that table is cross joined to everything else. On real data both explode into millions or billions of rows, and if you happen to add a limit you get plausible-looking but wrong results. The defence is to always use JOIN with an explicit ON, and to check that every table in the from has a path to the rest.',
        aHi: 'Ek cross join left ki ek row aur right ki ek row ka har combination produce karta hai, bina condition ke, to row count do sizes ka product hai. Ye intentional hai jab aap asal mein wo grid chahte ho. Aam case ek dense report skeleton banana hai: stores jaisi ek chhoti dimension ko months jaisi doosri ke against cross join karo, phir fact table ko ispar left join karo aur missing values ko zero mein coalesce karo. Aap ek accidentally do tareekon se likhte ho. Pehla, from ka comma form ek missing where clause ke saath. Doosra, bina ON clause ke ek JOIN. Real data par dono millions of rows mein explode hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Tables `team(name text)` (2 rows) and a values list of 4 weeks. `CROSS JOIN` them to get 8 (team, week) rows. Then `LEFT JOIN` a `result(team text, week int, wins int)` table (with only 3 of the 8 combinations filled) and `coalesce(wins, 0)`. Confirm all 8 rows appear, with `0` for the missing combinations.',
        taskHi: 'Tables `team(name)` (2 rows) aur 4 weeks ki ek values list. `CROSS JOIN` karke 8 (team, week) rows lo. Phir ek `result` table `LEFT JOIN` karo aur `coalesce(wins, 0)`.',
        hint: '`FROM team t CROSS JOIN (SELECT generate_series(1,4) AS week) w LEFT JOIN result r ON r.team = t.name AND r.week = w.week`. `coalesce(r.wins, 0)`.',
        hintHi: '`FROM team t CROSS JOIN (SELECT generate_series(1,4) AS week) w LEFT JOIN result r ON r.team = t.name AND r.week = w.week`.',
      },
      {
        task: 'Tables `customer(id int, name text)` (1 row), `ordr(customer_id int, total int)` (3 rows for that customer, totals 10/20/30), `refund(customer_id int, amount int)` (2 rows, amounts 5/5). Write the WRONG query joining all three and summing `total` and `amount`; note the sums are `120` and `30` (inflated). Then write the RIGHT query with two aggregate subqueries; confirm `60` and `10`.',
        taskHi: 'Tables `customer` (1 row), `ordr` (3 rows, 10/20/30), `refund` (2 rows, 5/5). GALAT query likho jo teenon join karti hai; sums `120` aur `30` hain. Phir SAHI query do aggregate subqueries ke saath; `60` aur `10`.',
        hint: '3 orders x 2 refunds = 6 rows -> `sum(total)` = (10+20+30)*2 = 120, `sum(amount)` = (5+5)*3 = 30. Subqueries: `sum(total)` = 60, `sum(amount)` = 10.',
        hintHi: '3 orders x 2 refunds = 6 rows -> `sum(total)` = 120, `sum(amount)` = 30. Subqueries: 60 aur 10.',
      },
      {
        task: 'Tables `author(id int)` and `book(author_id int)` where 3 authors have written books (one wrote 4) and 1 author has written none. Write `SELECT count(*) FROM author a JOIN book b ON b.author_id = a.id` and note it counts books, not authors. Then write `count(DISTINCT a.id)` and confirm it is `3`.',
        taskHi: 'Tables `author(id)` aur `book(author_id)`. `SELECT count(*) FROM author a JOIN book b ON b.author_id = a.id` likho aur note karo ye books count karti hai. Phir `count(DISTINCT a.id)` — `3`.',
        hint: '`count(*)` after the join = total book count of authors-who-wrote (e.g. 6). `count(DISTINCT a.id)` collapses to the number of distinct authors, `3`.',
        hintHi: '`count(*)` join ke baad = books ka total. `count(DISTINCT a.id)` distinct authors ki sankhya mein collapse, `3`.',
      },
    ],

    keyTakeaways: [
      '`CROSS JOIN` = every left row x every right row, NO condition -> `|a| x |b|` rows. DELIBERATE uses: a dense report grid (`store CROSS JOIN month` then `LEFT JOIN` the facts + `coalesce(sum, 0)` so empty cells show `0`), expanding a small dimension, fanning one row into N via `generate_series`. Keep at least one side TINY.',
      'ACCIDENTAL cross join: `FROM a, b` with no linking `WHERE`, OR a `JOIN` with no `ON`, OR a multi-table `FROM` where one table has no join path -> that table is cross-joined to everything (millions of rows; `LIMIT` gives plausible WRONG data). Use `JOIN ... ON` so a missing condition is a visible gap.',
      'FAN-OUT: joining to the MANY side of a 1:N relationship MULTIPLIES the one-side rows — a customer with 3 orders -> 3 result rows, with EVERY customer column REPEATED. Fine for reading order data; a BUG the moment you aggregate a one-side column or a 2nd many-side table.',
      'Case 1: `sum(c.credit_limit)` after `JOIN orders` adds the limit ONCE PER ORDER. Case 2: two many-side joins (`JOIN orders JOIN payment`) produce the CARTESIAN PRODUCT of the two child sets (3 orders x 2 payments = 6 rows) -> `sum(o.total)` x2, `sum(p.amount)` x3 — BOTH wrong, with DIFFERENT inflation factors you can\'t divide out.',
      'FIX fan-out: (1) aggregate each many-side table to ONE row per key in a subquery, THEN join (now 1:1, nothing multiplies); (2) independent scalar subqueries in the `SELECT` list (no join for the aggregates); (3) `count(DISTINCT key)` patches a count cheaply — but `sum(DISTINCT)` is usually WRONG (two rows can legitimately share a value).',
      'SPOT fan-out: more rows than the grain you asked for; a `sum`/`count` that is a suspiciously round MULTIPLE of the right answer; two+ joins to tables that are each many-per-key. (Same bug as the Django ORM `annotate(Sum, Sum)` over two relations.)',
      'For a pure "how many parents have a child" question, `count(*) ... WHERE EXISTS (...)` NEVER fans out (Lesson 5) — `EXISTS` is a semi-join that does not multiply rows.',
    ],
    keyTakeawaysHi: [
      '`CROSS JOIN` = har left row x har right row, KOI condition NAHI -> `|a| x |b|` rows. DELIBERATE uses: ek dense report grid, ek chhoti dimension expand karna. Kam se kam ek side TINY rakho.',
      'ACCIDENTAL cross join: bina linking `WHERE` ke `FROM a, b`, YA bina `ON` ke ek `JOIN` -> wo table sab se cross-joined (millions of rows; `LIMIT` plausible GALAT data deta hai). `JOIN ... ON` istemal karo.',
      'FAN-OUT: ek 1:N relationship ke MANY side se join karna one-side rows MULTIPLY karta hai — 3 orders waala customer -> 3 result rows, HAR customer column REPEATED. Order data read karne ke liye theek; ek BUG jis pal aap ek one-side column ya ek 2nd many-side table aggregate karte ho.',
      'Case 1: `JOIN orders` ke baad `sum(c.credit_limit)` limit ko PRATI ORDER ek baar add karta hai. Case 2: do many-side joins do child sets ka CARTESIAN PRODUCT produce karte hain -> DONO sums galat, ALAG inflation factors ke saath.',
      'FAN-OUT FIX: (1) har many-side table ko ek subquery mein prati key EK row tak aggregate karo, PHIR join karo; (2) `SELECT` list mein independent scalar subqueries; (3) `count(DISTINCT key)` ek count patch karta hai — par `sum(DISTINCT)` aksar GALAT hai.',
      'FAN-OUT SPOT karo: expected se zyada rows; ek `sum`/`count` jo sahi answer ka suspiciously round MULTIPLE hai; tables ke do+ joins jo prati-key many hain.',
      'Ek pure "kitne parents ke child hain" sawaal ke liye, `count(*) ... WHERE EXISTS (...)` KABHI fan out nahi karta (Lesson 5).',
    ],
  },

  {
    slug: 'sql-join-vs-subquery-vs-exists',
    title: 'Join vs Subquery vs `EXISTS`: Combine, or Just Filter?',
    titleHi: 'Join vs Subquery vs `EXISTS`: Combine, Ya Sirf Filter?',
    description: 'Use a join when you need columns from both tables in the output. Use `EXISTS` (a semi-join) when you only need to *filter* by whether a related row exists — it never fans out and needs no `DISTINCT`. Use `NOT EXISTS` for "has no match"; avoid `NOT IN` with a nullable subquery.',
    descriptionHi: 'Ek join istemal karo jab aapko output mein dono tables se columns chahiye. `EXISTS` (ek semi-join) istemal karo jab aapko sirf *filter* karna hai ki ek related row hai ya nahi — ye kabhi fan out nahi karta aur koi `DISTINCT` nahi chahiye. `NOT EXISTS` "koi match nahi" ke liye; ek nullable subquery ke saath `NOT IN` avoid karo.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Checking a guest list versus copying the guest list onto the invitations.** If your task is "print each invitation with the guest\'s table assignment", you must actually *combine* the two lists — pull the table number from the seating chart onto each invitation. That is a join: you need data from both sides in the result. But if the task is only "which of these people are on the approved list?", you do not need anything *from* the approved list — you just need a yes/no per person. You run down your list and, for each name, glance at whether it appears on the approved list at all, then move on. You never copy anything across, you never end up with a name twice just because it is on the approved list in two places, and you do not need to de-duplicate afterwards. That "glance for existence and move on" is `EXISTS` — a *semi*-join. And "which of these people are **not** on the list" is `NOT EXISTS`. The mistake is doing the full copy-across (a join) when all you needed was the glance, then having to clean up the duplicates it created with `DISTINCT`.',
      hi: '**Ek guest list check karna versus guest list ko invitations par copy karna.** Agar aapka task "har invitation ko guest ke table assignment ke saath print karo" hai, aapko asal mein do lists *combine* karni hai. Wo ek join hai: aapko result mein dono sides se data chahiye. Par agar task sirf "in logon mein se kaun approved list par hai?" hai, aapko approved list *se* kuch nahi chahiye — aapko bस prati vyakti ek haan/naa chahiye. Aap apni list neeche jaate ho aur, har name ke liye, ek nazar daalte ho ki ye approved list par bilkul aata hai ya nahi, phir aage badhte ho. Aap kabhi kuch copy nahi karte, aap kabhi ek name do baar nahi paate sirf isliye ki ye approved list par do jagah hai, aur aapko baad mein de-duplicate nahi karna padta. Wo "existence ke liye nazar daalo aur aage badho" `EXISTS` hai — ek *semi*-join. Aur "in logon mein se kaun list par NAHI hai" `NOT EXISTS` hai. Galti full copy-across (ek join) karna hai jab aapko sirf nazar chahiye thi, phir `DISTINCT` se duplicates saaf karna.',
    },

    simple: `**Join — you need columns from both tables**

\`\`\`sql
SELECT c.name, o.id, o.total          -- output uses columns from BOTH
FROM customer c
JOIN orders o ON o.customer_id = c.id;
\`\`\`

**\`EXISTS\` (semi-join) — you only need to FILTER by existence**

\`\`\`sql
SELECT c.name                          -- output uses ONLY customer columns
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- "customers who have at least one order"
-- one row per matching customer, NO fan-out, NO DISTINCT needed
\`\`\`

**\`NOT EXISTS\` (anti-join) — "has no matching row"**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- "customers who have never ordered" -- NULL-safe, unlike NOT IN
\`\`\`

**\`IN\` / \`NOT IN\` with a subquery — readable, but \`NOT IN\` has the NULL trap**

\`\`\`sql
WHERE c.id IN     (SELECT customer_id FROM orders)      -- fine
WHERE c.id NOT IN (SELECT customer_id FROM orders)      -- DANGER: if any customer_id is NULL,
                                                       -- this returns ZERO rows (Module 1)
\`\`\`

**Join + \`DISTINCT\` — the semi-join done the hard way**

\`\`\`sql
-- these two give the same result:
SELECT DISTINCT c.name FROM customer c JOIN orders o ON o.customer_id = c.id;
SELECT c.name FROM customer c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- EXISTS is usually clearer and lets the planner stop at the first match
\`\`\`

**The decision**

\`\`\`
need columns from the other table in the output?       -> JOIN
only need "does a related row exist?" as a filter?      -> EXISTS   (or IN)
only need "does NO related row exist?"                  -> NOT EXISTS  (not NOT IN)
need one derived scalar from the other table per row?   -> scalar subquery (Module 5)
\`\`\``,

    simpleHi: `**Join — aapko dono tables se columns chahiye**

\`\`\`sql
SELECT c.name, o.id, o.total          -- output DONO se columns istemal karta hai
FROM customer c
JOIN orders o ON o.customer_id = c.id;
\`\`\`

**\`EXISTS\` (semi-join) — aapko sirf existence se FILTER karna hai**

\`\`\`sql
SELECT c.name                          -- output SIRF customer columns istemal karta hai
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- "kam se kam ek order waale customers"
-- prati matching customer ek row, KOI fan-out NAHI, KOI DISTINCT NAHI chahiye
\`\`\`

**\`NOT EXISTS\` (anti-join) — "koi matching row nahi"**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- "kabhi order na karne waale customers" -- NULL-safe, NOT IN ke ulta
\`\`\`

**\`IN\` / \`NOT IN\` subquery ke saath — readable, par \`NOT IN\` ka NULL trap hai**

\`\`\`sql
WHERE c.id IN     (SELECT customer_id FROM orders)      -- theek
WHERE c.id NOT IN (SELECT customer_id FROM orders)      -- DANGER: agar koi customer_id NULL hai,
                                                       -- ye ZERO rows lautata hai (Module 1)
\`\`\`

**Join + \`DISTINCT\` — semi-join hard tarike se**

\`\`\`sql
-- ye dono same result dete hain:
SELECT DISTINCT c.name FROM customer c JOIN orders o ON o.customer_id = c.id;
SELECT c.name FROM customer c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- EXISTS aksar saaf hai aur planner ko pehle match par rukne deta hai
\`\`\`

**Decision**

\`\`\`
output mein doosri table se columns chahiye?            -> JOIN
sirf "kya ek related row hai?" ek filter ke roop mein?  -> EXISTS   (ya IN)
sirf "kya KOI related row NAHI hai?"                    -> NOT EXISTS  (NOT IN nahi)
prati row doosri table se ek derived scalar chahiye?    -> scalar subquery (Module 5)
\`\`\``,

    content: `## The three tools, by intent

| you want... | use | shape |
|---|---|---|
| columns from both tables in the result | **\`JOIN\`** | combine + filter |
| to keep left rows that **have** a related row | **\`EXISTS\`** / \`IN\` | semi-join |
| to keep left rows that **have no** related row | **\`NOT EXISTS\`** | anti-join |
| one computed value from the related set, per row | **scalar subquery** | Module 5 |

The distinction that matters most: a **join** brings the other table's columns into your result and, if the relationship is one-to-many, multiplies your rows (fan-out — Lesson 4). \`EXISTS\` and \`IN\` are **semi-joins**: they use the other table *only to decide whether to keep each left row*, they never add its columns, and they never multiply — one left row in, at most one left row out.

## \`EXISTS\`

\`WHERE EXISTS (subquery)\` is \`TRUE\` for a left row if the correlated subquery returns **at least one row**. Conventions:

- **\`SELECT 1\`** (or \`SELECT *\`) inside — the select list is irrelevant, the database only checks *whether* a row comes back. \`SELECT 1\` is idiomatic.
- The subquery is **correlated** — it references the outer row (\`WHERE o.customer_id = c.id\`).
- The planner can **short-circuit**: it stops scanning the inner table as soon as one matching row is found, which makes \`EXISTS\` often faster than counting.
- **No fan-out, no \`DISTINCT\`** — the result has one row per qualifying left row, period.

\`SELECT DISTINCT c.* FROM customer c JOIN orders o ON o.customer_id = c.id\` produces the same rows as the \`EXISTS\` version, but it has to build the full joined result (3 order rows per 3-order customer) and then de-duplicate it. \`EXISTS\` skips both steps. Prefer \`EXISTS\` for "left rows that have a match" whenever you do not need order columns in the output.

## \`IN (subquery)\`

\`WHERE c.id IN (SELECT customer_id FROM orders)\` is also a semi-join and is often the most readable form for "is this key in that set". The planner usually executes \`IN (subquery)\` and the equivalent \`EXISTS\` identically. \`IN\` reads better for a simple single-column membership test; \`EXISTS\` reads better when the correlation involves multiple columns or extra conditions.

## \`NOT EXISTS\` vs \`NOT IN\` — the \`NULL\` trap

For the **anti-join** ("left rows with no match"):

- **\`NOT EXISTS (subquery)\`** is \`TRUE\` when the correlated subquery returns **no rows**. It is **\`NULL\`-safe**: a \`NULL\` in the inner table simply does not satisfy the correlation and is ignored.
- **\`NOT IN (subquery)\`** expands to \`c.id <> v1 AND c.id <> v2 AND ...\`. If **any** value in the subquery result is \`NULL\`, one term becomes \`c.id <> NULL\` = \`UNKNOWN\`, and \`... AND UNKNOWN\` is never \`TRUE\`, so the **entire query returns zero rows** — silently, regardless of the real data (Module 1, Lesson 4).

**Rule: use \`NOT EXISTS\` for an anti-join against a subquery. Use \`NOT IN\` only with a hard-coded, guaranteed-\`NULL\`-free literal list** (\`WHERE status NOT IN ('deleted', 'archived')\`).

The \`LEFT JOIN ... WHERE right.pk IS NULL\` form (Lesson 2) is a third way to write an anti-join; \`NOT EXISTS\` is usually clearer because there is no "which column do I test for \`NULL\`" question.

## When the planner treats them the same

Modern query planners (PostgreSQL's included) recognise these equivalences and often produce the **identical execution plan** for:

- \`EXISTS\` ⟷ \`IN (subquery)\` ⟷ \`JOIN ... GROUP BY\` / \`DISTINCT\` (for a pure semi-join)
- \`NOT EXISTS\` ⟷ \`LEFT JOIN ... IS NULL\` (for an anti-join)

So the choice is often about **readability and safety**, not raw speed. But not always — a poorly-correlated \`EXISTS\`, or a \`NOT IN\` with a large un-indexed subquery, can be slow. When performance matters, check \`EXPLAIN\` (Module 10). The safe defaults:

- **Need both tables' columns** → \`JOIN\`.
- **"has a related row"** → \`EXISTS\` (or \`IN\` for a simple key test).
- **"has no related row"** → \`NOT EXISTS\`.
- **Never** \`NOT IN\` against a subquery whose column can be \`NULL\`.

## Correlated subquery in \`SELECT\` (preview)

If you need *one value* from the related set per row — the count of orders, the date of the latest — that is a **scalar subquery in the \`SELECT\` list**, covered in Module 5:

\`\`\`sql
SELECT c.name,
  (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customer c;
\`\`\`

It is neither a join nor a semi-join filter; it is "compute this per row". Beware it runs once per output row — a \`LEFT JOIN ... GROUP BY\` is often faster for many rows (Module 5).`,

    contentHi: `## Teen tools, intent se

| aap chahte ho... | istemal | shape |
|---|---|---|
| result mein dono tables se columns | **\`JOIN\`** | combine + filter |
| left rows rakhna jinke paas ek related row **hai** | **\`EXISTS\`** / \`IN\` | semi-join |
| left rows rakhna jinke paas **koi** related row **nahi** | **\`NOT EXISTS\`** | anti-join |
| prati row related set se ek computed value | **scalar subquery** | Module 5 |

Jo antar sabse zyada maayne rakhta hai: ek **join** doosri table ke columns aapke result mein laata hai aur, agar relationship one-to-many hai, aapki rows multiply karta hai (fan-out — Lesson 4). \`EXISTS\` aur \`IN\` **semi-joins** hain: wo doosri table ko *sirf ye decide karne ke liye istemal karte hain ki har left row rakhni hai ya nahi*, wo kabhi iske columns add nahi karte, aur wo kabhi multiply nahi karte.

## \`EXISTS\`

\`WHERE EXISTS (subquery)\` ek left row ke liye \`TRUE\` hai agar correlated subquery **kam se kam ek row** return karta hai. Conventions:
- Andar **\`SELECT 1\`** — select list irrelevant hai.
- Subquery **correlated** hai — ye outer row reference karti hai.
- Planner **short-circuit** kar sakta hai: jaise hi ek matching row milti hai ye inner table scan karna band kar deta hai.
- **Koi fan-out, koi \`DISTINCT\` nahi.**

## \`IN (subquery)\`

\`WHERE c.id IN (SELECT customer_id FROM orders)\` bhi ek semi-join hai. Planner aksar \`IN (subquery)\` aur equivalent \`EXISTS\` ko identically execute karta hai.

## \`NOT EXISTS\` vs \`NOT IN\` — \`NULL\` trap

**Anti-join** ke liye:
- **\`NOT EXISTS (subquery)\`** \`TRUE\` hai jab correlated subquery **koi rows nahi** return karti. Ye **\`NULL\`-safe** hai.
- **\`NOT IN (subquery)\`** \`c.id <> v1 AND c.id <> v2 AND ...\` mein expand hota hai. Agar subquery result mein **koi** value \`NULL\` hai, ek term \`c.id <> NULL\` = \`UNKNOWN\` ban jata hai, aur poori query **zero rows lautati hai** — chupchaap.

**Niyam: ek subquery ke against ek anti-join ke liye \`NOT EXISTS\` istemal karo. \`NOT IN\` sirf ek hard-coded, guaranteed-\`NULL\`-free literal list ke saath.**

## Jab planner unhe same treat karta hai

Modern query planners in equivalences ko pehchante hain aur aksar **identical execution plan** produce karte hain. To choice aksar **readability aur safety** ke baare mein hai, raw speed nahi. Par hamesha nahi — jab performance maayne rakhti hai, \`EXPLAIN\` check karo (Module 10).

## \`SELECT\` mein correlated subquery (preview)

Agar aapko prati row related set se *ek value* chahiye — orders ka count, latest ki date — wo ek **scalar subquery** hai, Module 5 mein covered. Ye prati output row ek baar chalti hai — ek \`LEFT JOIN ... GROUP BY\` aksar zyada rows ke liye faster hai.`,

    examples: [
      {
        title: 'EXISTS as a semi-join: one row per matching customer, no DISTINCT',
        titleHi: 'EXISTS ek semi-join ke roop mein: prati matching customer ek row, koi DISTINCT nahi',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');

CREATE TABLE ordr (id int, customer_id int);
INSERT INTO ordr VALUES (10, 1), (11, 1), (12, 1), (13, 2);
-- Acme has 3 orders, Globex 1, Initech 0

-- EXISTS: Acme appears ONCE despite 3 orders; no DISTINCT needed
SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM ordr o WHERE o.customer_id = c.id)
ORDER BY c.name;

-- the join version needs DISTINCT to get the same result
SELECT DISTINCT c.name
FROM customer c JOIN ordr o ON o.customer_id = c.id
ORDER BY c.name;`,
        output: ` name
--------
 Acme
 Globex
(2 rows)

 name
--------
 Acme
 Globex
(2 rows)`,
        explain: '`WHERE EXISTS (SELECT 1 FROM ordr o WHERE o.customer_id = c.id)` is a SEMI-join: it uses `ordr` only to decide whether to keep each customer, never adds order columns, and never multiplies. `Acme` appears ONCE despite 3 orders, and no `DISTINCT` is needed. The `JOIN` version returns the same 2 names but only after building the fanned-out result (3 Acme rows) and de-duplicating it — wasted work.',
        explainHi: '`WHERE EXISTS (SELECT 1 FROM ordr o WHERE o.customer_id = c.id)` ek SEMI-join hai: ye `ordr` ko sirf har customer rakhne ka decide karne ke liye istemal karता hai, kabhi order columns add nahi karता, aur kabhi multiply nahi karता. `Acme` 3 orders ke bावjood EK baar aata hai, aur koi `DISTINCT` nahi chahिए. `JOIN` version wahi 2 names deता hai par sirf fanned-out result (3 Acme rows) banakar aur use de-duplicate karके — wasted work.',
      },
      {
        title: 'NOT EXISTS is NULL-safe; NOT IN with a NULL in the set returns nothing',
        titleHi: 'NOT EXISTS NULL-safe hai; set mein ek NULL ke saath NOT IN kuch nahi lautata',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');

CREATE TABLE ordr (id int, customer_id int);
INSERT INTO ordr VALUES (10, 1), (11, 2), (12, NULL);   -- one order has a NULL customer_id

-- NOT EXISTS: correct -> Initech (id 3) has no order
SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM ordr o WHERE o.customer_id = c.id)
ORDER BY c.name;

-- NOT IN: the NULL in the subquery poisons it -> ZERO rows
SELECT c.name
FROM customer c
WHERE c.id NOT IN (SELECT customer_id FROM ordr)
ORDER BY c.name;`,
        output: ` name
---------
 Initech
(1 row)

 name
------
(0 rows)`,
        explain: '`NOT EXISTS` is NULL-safe: it asks directly whether the correlated subquery returns any row, and the `NULL` `customer_id` simply fails the correlation and is ignored -> `Initech` is correctly returned. `NOT IN (SELECT customer_id FROM ordr)` expands to `c.id <> 10 AND c.id <> 11 AND c.id <> NULL`; that last term is `UNKNOWN`, so the whole `AND` is never `TRUE` and the query returns ZERO rows regardless of the data.',
        explainHi: '`NOT EXISTS` NULL-safe hai: ye seedhे poochता hai ki correlated subquery koi row lautaती hai ya nahi, aur `NULL` `customer_id` bस correlation fail karता hai aur ignore hoता hai -> `Initech` sahi return hoता hai. `NOT IN (SELECT customer_id FROM ordr)` `c.id <> 10 AND c.id <> 11 AND c.id <> NULL` mein expand hoता hai; wo aakhri term `UNKNOWN` hai, to poora `AND` kabhi `TRUE` nahi aur query data ke bावjood ZERO rows lautaती hai.',
      },
      {
        title: 'JOIN when you need the other table\'s columns; EXISTS when you only filter',
        titleHi: 'JOIN jab doosri table ke columns chahiye; EXISTS jab sirf filter',
        code: `CREATE TABLE author (id int, name text);
INSERT INTO author VALUES (1, 'Ann'), (2, 'Ben'), (3, 'Cai');
CREATE TABLE book (id int, author_id int, title text);
INSERT INTO book VALUES (10, 1, 'A One'), (11, 1, 'A Two'), (12, 2, 'B One');

-- need the titles in the output -> JOIN
SELECT a.name AS author, b.title
FROM author a JOIN book b ON b.author_id = a.id
ORDER BY a.name, b.title;

-- only need "which authors are published" -> EXISTS
SELECT a.name
FROM author a
WHERE EXISTS (SELECT 1 FROM book b WHERE b.author_id = a.id)
ORDER BY a.name;`,
        output: ` author | title
--------+-------
 Ann    | A One
 Ann    | A Two
 Ben    | B One
(3 rows)

 name
------
 Ann
 Ben
(2 rows)`,
        explain: 'Two questions, two tools. "Show each author with their book titles" NEEDS columns from `book`, so it is a `JOIN` — `Ann` appears twice, once per title. "Which authors are published" only needs to FILTER `author` by whether a book exists, so it is `EXISTS` — one row per matching author, `Cai` (no books) excluded, no fan-out. Use the join only when the other table\'s columns actually appear in the `SELECT`.',
        explainHi: 'Do sawaal, do tools. "Har author ko unki book titles ke saath dikhao" ko `book` se columns CHAHIYE, to ye ek `JOIN` hai — `Ann` do baar aata hai, prati title ek baar. "Kaunse authors published hain" ko sirf `author` ko filter karna hai ki ek book hai ya nahi, to ye `EXISTS` hai — prati matching author ek row, `Cai` (koi books nahi) excluded, koi fan-out nahi. Join sirf tab istemal karo jab doosri table ke columns asal mein `SELECT` mein aate hain.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "list customers who have placed an order"
SELECT c.name
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- a customer with 5 orders is listed 5 times`,
        right: `SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- one row per customer; no fan-out, no DISTINCT`,
        why: 'The output only needs customer names, but the query joins to orders, which fans out: a customer with five orders produces five identical name rows. The usual patch is SELECT DISTINCT, but that forces the database to materialise the full joined result and then sort or hash it to remove duplicates, work that is entirely wasted. EXISTS expresses the actual intent, which is a filter on whether a related row exists, not a combination of the two tables. It produces exactly one row per qualifying customer, never fans out, and lets the planner stop scanning orders for a customer the moment it finds the first matching order.',
        whyHi: 'Output ko sirf customer names chahiye, par query orders se join karti hai, jo fan out karti hai: paanch orders waala ek customer paanch identical name rows produce karta hai. Aam patch SELECT DISTINCT hai, par wo database ko poora joined result materialise karke phir duplicates hataane ke liye sort ya hash karne par majboor karta hai. EXISTS asli intent express karta hai. Ye prati qualifying customer theek ek row produce karta hai.',
      },
      {
        wrong: `-- "products that have never been ordered"
SELECT p.name
FROM product p
WHERE p.id NOT IN (SELECT product_id FROM order_line);
-- returns ZERO rows the moment any order_line has a NULL product_id`,
        right: `SELECT p.name
FROM product p
WHERE NOT EXISTS (SELECT 1 FROM order_line ol WHERE ol.product_id = p.id);`,
        why: 'NOT IN against a subquery is a trap whenever the subquery column can be NULL. It expands to a chain of not-equal comparisons joined by AND, and one comparison against NULL is UNKNOWN, which makes the whole AND chain never true, so the query silently returns nothing regardless of the data. An order_line with a NULL product_id, from a soft-deleted product or a data import, is enough to trigger it. NOT EXISTS asks directly whether any matching row exists and treats a NULL in the inner table as simply not matching, which is correct. Reserve NOT IN for hard-coded literal lists that you know contain no NULL.',
        whyHi: 'Ek subquery ke against NOT IN ek trap hai jab bhi subquery column NULL ho sakta hai. Ye not-equal comparisons ki ek chain mein expand hota hai jo AND se judi hai, aur NULL ke against ek comparison UNKNOWN hai, jo poori AND chain ko kabhi true nahi banata. Ek NULL product_id waala ek order_line ise trigger karne ke liye kaafi hai. NOT EXISTS seedhे poochta hai ki koi matching row hai ya nahi.',
      },
      {
        wrong: `-- "customers and how many orders they have" -- using EXISTS
SELECT c.name,
  (SELECT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)) AS has_orders
FROM customer c;
-- has_orders is a boolean -- it cannot tell you the COUNT`,
        right: `-- EXISTS answers yes/no; for a number, use a count -- a scalar subquery or a grouped LEFT JOIN
SELECT c.name, count(o.id) AS order_count
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;`,
        why: 'EXISTS and IN are existence filters: they answer whether at least one related row exists, a boolean. They are the wrong tool the moment the question needs a quantity, a total, a latest date, or any actual value from the related set. For a count per row, use a scalar subquery with count, or a LEFT JOIN with GROUP BY and count of the right-side key. Match the tool to the shape of the answer: yes/no is EXISTS, a number or value per row is an aggregate.',
        whyHi: 'EXISTS aur IN existence filters hain: wo poochte hain ki kam se kam ek related row hai ya nahi, ek boolean. Wo galat tool hain jis pal sawaal ko ek quantity, ek total, ek latest date, ya related set se koi actual value chahiye. Prati row ek count ke liye, count ke saath ek scalar subquery istemal karo, ya GROUP BY aur right-side key ke count ke saath ek LEFT JOIN. Tool ko answer ke shape se match karo.',
      },
    ],

    realWorld: [
      {
        en: '**`WHERE EXISTS (...)` as the team default for "rows that have a related X"** — a reviewer flags `SELECT DISTINCT` after a join as "this is a semi-join, write it as `EXISTS`" unless the join columns are actually used in the output.',
        hi: '**"related X waali rows" ke liye team default `WHERE EXISTS (...)`** — ek reviewer join ke baad `SELECT DISTINCT` ko flag karta hai.',
      },
      {
        en: '**`NOT IN` banned against any subquery in the style guide** — `NOT EXISTS` or `LEFT JOIN ... IS NULL` only, because the `NULL` behaviour of `NOT IN` has caused a "report shows nothing" incident before.',
        hi: '**Style guide mein kisi bhi subquery ke against `NOT IN` banned** — sirf `NOT EXISTS`.',
      },
      {
        en: '**An "unused index" cleanup query: `SELECT ... FROM pg_stat_user_indexes s WHERE NOT EXISTS (SELECT 1 FROM ... constraint uses)`** — a real anti-join over catalog tables, written with `NOT EXISTS` for correctness.',
        hi: '**Ek "unused index" cleanup query `NOT EXISTS` ke saath likhi** — catalog tables par ek real anti-join.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you use a join vs `EXISTS`, and why is `EXISTS` often better for "rows that have a match"?',
        qHi: 'Aap ek join vs `EXISTS` kab istemal karte ho, aur `EXISTS` "match waali rows" ke liye aksar behtar kyun hai?',
        a: 'You use a join when the result needs columns from both tables, when you actually want to combine the two datasets. You use EXISTS when the other table is only there to filter, to decide whether to keep each row of the first table based on whether a related row exists. The key difference is that a join to a one-to-many table fans out: a customer with five orders becomes five rows, with the customer columns repeated, so if you only wanted the customer names you now have duplicates and have to add DISTINCT. That DISTINCT forces the database to build the whole joined result and then de-duplicate it, which is wasted work. EXISTS is a semi-join: it uses the orders table only to test each customer, never adds order columns, never multiplies, and produces exactly one row per qualifying customer with no DISTINCT. The planner can also short-circuit, stopping its scan of orders for a given customer as soon as it finds the first matching order, rather than counting them all. So for "customers who have ordered", EXISTS is both clearer and usually faster. Use the join only when order columns actually appear in the SELECT.',
        aHi: 'Aap ek join istemal karte ho jab result ko dono tables se columns chahiye, jab aap asal mein do datasets combine karna chahte ho. Aap EXISTS istemal karte ho jab doosri table sirf filter karne ke liye hai, ye decide karne ke liye ki pehli table ki har row rakhni hai ya nahi is aadhaar par ki ek related row hai ya nahi. Key antar ye hai ki ek one-to-many table ka join fan out karta hai: paanch orders waala ek customer paanch rows ban jata hai, customer columns repeated ke saath. Wo DISTINCT database ko poora joined result banakar phir de-duplicate karne par majboor karta hai. EXISTS ek semi-join hai: ye orders table ko sirf har customer test karne ke liye istemal karta hai, kabhi order columns add nahi karta, kabhi multiply nahi karta. Planner short-circuit bhi kar sakta hai.',
      },
      {
        q: 'Why should you use `NOT EXISTS` instead of `NOT IN` for an anti-join?',
        qHi: 'Ek anti-join ke liye aapko `NOT IN` ke bजाy `NOT EXISTS` kyun istemal karna chahiye?',
        a: 'NOT IN against a subquery expands to a chain of not-equal comparisons joined by AND: the key is not equal to the first value, and not equal to the second, and so on. If any value returned by the subquery is NULL, one of those comparisons becomes key not equal to NULL, which evaluates to UNKNOWN, and anything ANDed with UNKNOWN is at best UNKNOWN, never TRUE. So the entire predicate is never true for any row and the query silently returns zero rows, regardless of what the data actually contains. This happens the moment a single NULL appears in that column, from a nullable foreign key, a soft delete, a bad import. It is invisible in testing if your test data has no NULLs and catastrophic in production when one appears. NOT EXISTS does not have this problem: it asks directly whether the correlated subquery returns any row, and a NULL row in the inner table simply fails the correlation condition and is ignored, which is the correct behaviour. So the rule is NOT EXISTS for an anti-join against a subquery, and NOT IN only with a hard-coded literal list you know is NULL-free. The LEFT JOIN with a WHERE that the right primary key IS NULL is a third correct form, but NOT EXISTS is usually clearest because it avoids the question of which column to test.',
        aHi: 'Ek subquery ke against NOT IN not-equal comparisons ki ek chain mein expand hota hai jo AND se judi hai. Agar subquery dwara return kiya koi value NULL hai, un comparisons mein se ek key not equal to NULL ban jata hai, jo UNKNOWN evaluate hota hai, aur UNKNOWN ke saath AND kiya kuch bhi kabhi TRUE nahi. To poora predicate kisi row ke liye kabhi true nahi hai aur query chupchaap zero rows lautati hai. Ye tab hota hai jab us column mein ek single NULL aata hai. Ye testing mein invisible hai agar aapke test data mein koi NULLs nahi hain. NOT EXISTS mein ye problem nahi hai: ye seedhे poochta hai ki correlated subquery koi row lautati hai ya nahi.',
      },
    ],

    exercises: [
      {
        task: 'Tables `blog(id int, title text)` and `comment(id int, blog_id int)` where one blog has 4 comments, one has 1, one has 0. Write "blogs that have at least one comment" TWO ways: (a) `JOIN` + `DISTINCT`; (b) `WHERE EXISTS`. Confirm identical results (2 rows) and note in a comment which one avoids building the fanned-out intermediate result.',
        taskHi: 'Tables `blog(id, title)` aur `comment(id, blog_id)`. "kam se kam ek comment waale blogs" DO tareeke se: (a) `JOIN` + `DISTINCT`; (b) `WHERE EXISTS`.',
        hint: '(a) `SELECT DISTINCT b.title FROM blog b JOIN comment c ON c.blog_id = b.id`. (b) `SELECT b.title FROM blog b WHERE EXISTS (SELECT 1 FROM comment c WHERE c.blog_id = b.id)`. (b) never materialises the 4-comment blog\'s 4 rows.',
        hintHi: '(a) `SELECT DISTINCT ... JOIN ...`. (b) `WHERE EXISTS (SELECT 1 ...)`. (b) kabhi 4-comment blog ki 4 rows materialise nahi karti.',
      },
      {
        task: 'Tables `sku(code text)` and `stock(sku_code text, qty int)` where `stock` has rows for 2 of 4 SKUs, and ALSO one row with `sku_code = NULL`. Write "SKUs with no stock record" via `NOT EXISTS` and confirm it returns the 2 missing SKUs. Then try `WHERE code NOT IN (SELECT sku_code FROM stock)` and confirm it returns `0` rows because of the `NULL`.',
        taskHi: 'Tables `sku(code)` aur `stock(sku_code, qty)` jahaan `stock` mein 4 mein se 2 SKUs ke liye rows hain, aur ek row `sku_code = NULL` bhi. "bina stock record waale SKUs" `NOT EXISTS` se likho. Phir `NOT IN` try karo — `0` rows.',
        hint: '`WHERE NOT EXISTS (SELECT 1 FROM stock s WHERE s.sku_code = sku.code)` -> 2 rows. `NOT IN (SELECT sku_code FROM stock)` -> the `NULL` in the set makes `code <> NULL` UNKNOWN -> 0 rows.',
        hintHi: '`WHERE NOT EXISTS (SELECT 1 FROM stock s WHERE s.sku_code = sku.code)` -> 2 rows. `NOT IN` -> `NULL` set mein -> 0 rows.',
      },
      {
        task: 'Tables `customer(id int, name text)` and `orders(customer_id int, total int)`. Write ONE query returning `name` plus `has_orders` (boolean from `EXISTS`) plus `order_count` (from a scalar subquery `count(*)`). Insert a customer with 0 orders and confirm they show `false` and `0`. Explain in a comment why `EXISTS` alone cannot give the count.',
        taskHi: 'Tables `customer(id, name)` aur `orders(customer_id, total)`. EK query jo `name` plus `has_orders` (`EXISTS` se boolean) plus `order_count` (scalar subquery `count(*)` se) return karti hai.',
        hint: '`(EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)) AS has_orders` and `(SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count`. `EXISTS` is a yes/no; it discards the count.',
        hintHi: '`(EXISTS (...)) AS has_orders` aur `(SELECT count(*) FROM ...) AS order_count`. `EXISTS` ek yes/no hai; ye count discard karta hai.',
      },
    ],

    keyTakeaways: [
      'DECISION: columns from BOTH tables in the output -> `JOIN`. Only FILTER by "does a related row exist" -> `EXISTS` / `IN` (a SEMI-join). "No related row exists" -> `NOT EXISTS` (an ANTI-join). One derived VALUE from the related set per row -> a scalar subquery (Module 5).',
      'A `JOIN` brings the other table\'s columns in AND fans out on a 1:N relationship. `EXISTS`/`IN` are SEMI-joins: they use the other table ONLY to keep/drop each left row, NEVER add its columns, NEVER multiply — one left row in, at most one out. So NO fan-out, NO `DISTINCT` needed.',
      '`WHERE EXISTS (SELECT 1 FROM ... WHERE <correlation>)` = `TRUE` if the correlated subquery returns >=1 row. `SELECT 1` is idiomatic (the list is ignored). The planner SHORT-CIRCUITS — stops at the first match. `SELECT DISTINCT c.* FROM c JOIN o ...` gives the same rows but builds the full fanned result then de-dups — prefer `EXISTS`.',
      '`IN (subquery)` is also a semi-join and often the MOST READABLE form for "is this key in that set". The planner usually executes `IN (subquery)` and the equivalent `EXISTS` IDENTICALLY. `IN` for a simple single-column test; `EXISTS` when the correlation is multi-column or has extra conditions.',
      '`NOT EXISTS (subquery)` = `TRUE` when the subquery returns NO rows — `NULL`-SAFE (a `NULL` inner row just fails the correlation). `NOT IN (subquery)` expands to `key <> v1 AND key <> v2 AND ...` — ONE `NULL` in the result -> `key <> NULL` = `UNKNOWN` -> the `AND` is NEVER `TRUE` -> the WHOLE query returns ZERO rows, silently.',
      'RULE: `NOT EXISTS` for an anti-join against a SUBQUERY. `NOT IN` ONLY with a hard-coded, guaranteed-`NULL`-free LITERAL list (`status NOT IN (\'deleted\', \'archived\')`). `LEFT JOIN ... WHERE right.pk IS NULL` is a third anti-join form (Lesson 2) — `NOT EXISTS` avoids the "which column to test" question.',
      'Modern planners produce the SAME plan for `EXISTS` <-> `IN (subquery)` <-> `JOIN + DISTINCT` (semi-join) and `NOT EXISTS` <-> `LEFT JOIN ... IS NULL` (anti-join) — so the choice is READABILITY + SAFETY, not raw speed (but check `EXPLAIN` when it matters — Module 10).',
      '`EXISTS`/`IN` answer YES/NO only. For a COUNT / total / latest date per row, use an aggregate: a scalar subquery `count(*)` or a `LEFT JOIN ... GROUP BY count(right.key)`. Match the tool to the shape of the answer.',
    ],
    keyTakeawaysHi: [
      'DECISION: output mein DONO tables se columns -> `JOIN`. Sirf "kya ek related row hai" se FILTER -> `EXISTS` / `IN` (ek SEMI-join). "Koi related row nahi" -> `NOT EXISTS` (ek ANTI-join). Prati row related set se ek derived VALUE -> ek scalar subquery (Module 5).',
      'Ek `JOIN` doosri table ke columns laata hai AUR ek 1:N relationship par fan out karta hai. `EXISTS`/`IN` SEMI-joins hain: wo doosri table ko SIRF har left row rakhne/drop karne ke liye istemal karte hain, KABHI multiply nahi. To KOI fan-out, KOI `DISTINCT` NAHI chahiye.',
      '`WHERE EXISTS (SELECT 1 FROM ... WHERE <correlation>)` = `TRUE` agar correlated subquery >=1 row lautati hai. Planner SHORT-CIRCUIT karta hai. `SELECT DISTINCT c.* FROM c JOIN o ...` same rows deta hai par full fanned result banakar de-dup karta hai — `EXISTS` prefer karo.',
      '`IN (subquery)` bhi ek semi-join hai aur aksar SABSE READABLE form. Planner aksar `IN (subquery)` aur equivalent `EXISTS` ko IDENTICALLY execute karta hai.',
      '`NOT EXISTS (subquery)` = `TRUE` jab subquery KOI rows nahi lautati — `NULL`-SAFE. `NOT IN (subquery)` `key <> v1 AND ...` mein expand hota hai — ek `NULL` -> `key <> NULL` = `UNKNOWN` -> `AND` KABHI `TRUE` nahi -> POORI query ZERO rows lautati hai, chupchaap.',
      'NIYAM: ek SUBQUERY ke against anti-join ke liye `NOT EXISTS`. `NOT IN` SIRF ek hard-coded, guaranteed-`NULL`-free LITERAL list ke saath.',
      'Modern planners `EXISTS` <-> `IN (subquery)` <-> `JOIN + DISTINCT` ke liye SAME plan produce karte hain — to choice READABILITY + SAFETY hai, raw speed nahi.',
      '`EXISTS`/`IN` sirf YES/NO answer karte hain. Ek COUNT / total ke liye ek aggregate istemal karo: ek scalar subquery `count(*)` ya ek `LEFT JOIN ... GROUP BY count(right.key)`.',
    ],
  },

  {
    slug: 'sql-lateral-joins',
    title: '`LATERAL` Joins: A Subquery in `FROM` That Sees the Row Before It',
    titleHi: '`LATERAL` Joins: `FROM` Mein Ek Subquery Jo Iske Pehle Ki Row Dekhti Hai',
    description: 'Normally a subquery in `FROM` is self-contained. `LATERAL` lets it reference columns from tables earlier in the `FROM` clause — so it runs *once per outer row*, with that row\'s values plugged in. It is the clean way to do "top 3 per group" and to expand a set-returning function per row.',
    descriptionHi: 'Normally `FROM` mein ek subquery self-contained hoti hai. `LATERAL` ise `FROM` clause mein pehle ki tables se columns reference karne deta hai — to ye *prati outer row ek baar* chalti hai, us row ki values plug-in ke saath. Ye "prati group top 3" karne aur prati row ek set-returning function expand karne ka saaf tarika hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A market researcher who visits each shop on a list and, at each one, runs a little survey *using that shop\'s details*.** A normal subquery in `FROM` is a survey the researcher designs once, in the office, before setting out — it cannot mention any particular shop. A `LATERAL` subquery is the opposite: the researcher walks to shop #1, and *now*, standing there, fills in the survey with "this shop\'s three best-selling items" or "the last five visitors to this shop"; then walks to shop #2 and runs the same survey again, freshly, with shop #2\'s details. The survey is re-run once per shop, each time parameterised by the shop it is standing in front of. That is exactly `... FROM shop s CROSS JOIN LATERAL (SELECT ... WHERE x.shop_id = s.id LIMIT 3) t` — the inner query sees `s.id` because `LATERAL` lets it look left at the row currently being processed. Without `LATERAL`, that inner `WHERE x.shop_id = s.id` is an error: `s` does not exist yet from the subquery\'s point of view.',
      hi: '**Ek market researcher jo ek list par har shop visit karta hai aur, har ek par, *us shop ki details istemal karke* ek chhota survey chalata hai.** `FROM` mein ek normal subquery ek survey hai jo researcher ek baar, office mein, nikalne se pehle design karta hai — ye kisi particular shop ka zikr nahi kar sakti. Ek `LATERAL` subquery ulta hai: researcher shop #1 tak chalta hai, aur *ab*, wahaan khada, survey ko "is shop ke teen best-selling items" se bharta hai; phir shop #2 tak chalta hai aur wahi survey phir se chalata hai, freshly, shop #2 ki details ke saath. Survey prati shop ek baar re-run hota hai, har baar us shop se parameterised jiske saamne ye khada hai. Wo theek `... FROM shop s CROSS JOIN LATERAL (SELECT ... WHERE x.shop_id = s.id LIMIT 3) t` hai — inner query `s.id` dekhti hai kyunki `LATERAL` ise currently process ho rahi row ko left dekhne deta hai.',
    },

    simple: `**Without \`LATERAL\`: a subquery in \`FROM\` cannot see the other tables**

\`\`\`sql
SELECT d.name, top.emp_name
FROM department d,
     (SELECT name AS emp_name FROM employee e WHERE e.dept_id = d.id LIMIT 1) top;
-- ERROR: invalid reference to FROM-clause entry for table "d"
\`\`\`

**With \`LATERAL\`: the subquery runs once per outer row, seeing its columns**

\`\`\`sql
SELECT d.name, top.emp_name
FROM department d
CROSS JOIN LATERAL (
  SELECT e.name AS emp_name
  FROM employee e
  WHERE e.dept_id = d.id            -- <-- d.id is visible because of LATERAL
  ORDER BY e.hired_at DESC
  LIMIT 1
) top;
-- one row per department, showing its most recently hired employee
\`\`\`

**\`LEFT JOIN LATERAL ... ON true\` — keep outer rows with no inner match**

\`\`\`sql
FROM department d
LEFT JOIN LATERAL (SELECT ... WHERE e.dept_id = d.id LIMIT 3) recent ON true
-- a department with no employees: kept, with the LATERAL columns NULL
-- (ON true because the matching is already done inside the subquery)
\`\`\`

**Top-N per group — the killer use case**

\`\`\`sql
-- the 3 most expensive products in each category
SELECT c.name AS category, p.name, p.price
FROM category c
CROSS JOIN LATERAL (
  SELECT name, price FROM product WHERE category_id = c.id
  ORDER BY price DESC LIMIT 3
) p;
-- (a window function -- ROW_NUMBER() ... <= 3 -- also does this; Module 6)
\`\`\`

**Expand a set-returning function per row**

\`\`\`sql
SELECT o.id, item.value ->> 'sku' AS sku, (item.value ->> 'qty')::int AS qty
FROM orders o
CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item;
-- one output row per element of each order's JSON items array
\`\`\`

**\`LATERAL\` vs a scalar subquery in \`SELECT\`**

\`\`\`sql
-- scalar subquery: ONE value per outer row
SELECT o.id, (SELECT max(paid_at) FROM payment WHERE order_id = o.id) AS last_paid FROM orders o;

-- LATERAL: as MANY columns and rows as you want per outer row
SELECT o.id, lp.paid_at, lp.amount
FROM orders o
CROSS JOIN LATERAL (SELECT paid_at, amount FROM payment WHERE order_id = o.id
                    ORDER BY paid_at DESC LIMIT 1) lp;
\`\`\``,

    simpleHi: `**Bina \`LATERAL\`: \`FROM\` mein ek subquery doosri tables nahi dekh sakti**

\`\`\`sql
SELECT d.name, top.emp_name
FROM department d,
     (SELECT name AS emp_name FROM employee e WHERE e.dept_id = d.id LIMIT 1) top;
-- ERROR: invalid reference to FROM-clause entry for table "d"
\`\`\`

**\`LATERAL\` ke saath: subquery prati outer row ek baar chalti hai, iske columns dekhkar**

\`\`\`sql
SELECT d.name, top.emp_name
FROM department d
CROSS JOIN LATERAL (
  SELECT e.name AS emp_name
  FROM employee e
  WHERE e.dept_id = d.id            -- <-- d.id visible hai LATERAL ki wajah se
  ORDER BY e.hired_at DESC
  LIMIT 1
) top;
\`\`\`

**\`LEFT JOIN LATERAL ... ON true\` — bina inner match ke outer rows rakho**

\`\`\`sql
FROM department d
LEFT JOIN LATERAL (SELECT ... WHERE e.dept_id = d.id LIMIT 3) recent ON true
-- bina employees waala ek department: rakha, LATERAL columns NULL ke saath
\`\`\`

**Top-N per group — killer use case**

\`\`\`sql
-- har category mein 3 sabse mehnge products
SELECT c.name AS category, p.name, p.price
FROM category c
CROSS JOIN LATERAL (
  SELECT name, price FROM product WHERE category_id = c.id
  ORDER BY price DESC LIMIT 3
) p;
-- (ek window function -- ROW_NUMBER() ... <= 3 -- bhi ye karta hai; Module 6)
\`\`\`

**Prati row ek set-returning function expand karo**

\`\`\`sql
SELECT o.id, item.value ->> 'sku' AS sku
FROM orders o
CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item;
-- har order ke JSON items array ke prati element ek output row
\`\`\`

**\`LATERAL\` vs \`SELECT\` mein ek scalar subquery**

\`\`\`sql
-- scalar subquery: prati outer row EK value
SELECT o.id, (SELECT max(paid_at) FROM payment WHERE order_id = o.id) AS last_paid FROM orders o;

-- LATERAL: prati outer row jitne chaho utne columns aur rows
SELECT o.id, lp.paid_at, lp.amount
FROM orders o
CROSS JOIN LATERAL (SELECT paid_at, amount FROM payment WHERE order_id = o.id
                    ORDER BY paid_at DESC LIMIT 1) lp;
\`\`\``,

    content: `## The rule \`LATERAL\` changes

In a normal \`FROM\` clause, the items are **independent** — a subquery or function in \`FROM\` is evaluated once, on its own, and cannot reference the other tables in the same \`FROM\`. So this fails:

\`\`\`sql
FROM department d,
     (SELECT ... FROM employee e WHERE e.dept_id = d.id) x   -- "d" is not visible here
\`\`\`

**\`LATERAL\`** removes that restriction for one \`FROM\` item: a \`LATERAL\` subquery (or function) **may reference columns of the \`FROM\` items that appear before it**. The database then evaluates it **once for every row** of those earlier items, substituting that row's values.

Conceptually it is a \`for\` loop: "for each department row, run this subquery with \`d\` bound to the current row, and join its output rows onto \`d\`".

## Syntax

- **\`CROSS JOIN LATERAL (subquery) alias\`** — like a cross join, but the subquery is re-evaluated per outer row. If the subquery returns 0 rows for some outer row, that outer row is **dropped** (same as an inner join).
- **\`LEFT JOIN LATERAL (subquery) alias ON true\`** — keeps the outer row even when the subquery returns nothing, NULL-padding the lateral columns. The \`ON\` is \`true\` because the row-matching logic is *inside* the subquery (its \`WHERE\`), so there is no separate join condition.
- **\`, LATERAL (subquery) alias\`** — the comma form; equivalent to \`CROSS JOIN LATERAL\`.
- A **set-returning function** in \`FROM\` that references an earlier column is **implicitly \`LATERAL\`** — you can write \`FROM orders o, jsonb_array_elements(o.items)\` without the keyword, though writing it is clearer.

## Use case 1: top-N per group

The problem: "the 3 highest-paid employees **in each** department". A plain \`JOIN\` + \`ORDER BY\` + \`LIMIT\` gives the top 3 *overall*, not per department. \`LATERAL\` solves it directly:

\`\`\`sql
SELECT d.name AS dept, e.name, e.salary
FROM department d
CROSS JOIN LATERAL (
  SELECT name, salary
  FROM employee
  WHERE dept_id = d.id
  ORDER BY salary DESC
  LIMIT 3
) e;
\`\`\`

For each department, the subquery does its own \`ORDER BY salary DESC LIMIT 3\`, and those (up to) 3 rows are attached to the department. Use \`LEFT JOIN LATERAL ... ON true\` if you also want departments with fewer than 3 (or 0) employees to appear.

The **window-function alternative** (Module 6) is \`ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)\` in a subquery, then \`WHERE rn <= 3\`. Both are standard; \`LATERAL\` with \`LIMIT\` can be faster when there is an index on \`(dept_id, salary DESC)\` because each inner query is a tiny index scan, whereas the window function must sort every row of each partition.

## Use case 2: expanding a set per row

A set-returning function — \`jsonb_array_elements\`, \`unnest\`, \`generate_series\`, \`regexp_split_to_table\` — produces many rows from one input. To run it *per row of a table*, using that row's data as input, you need \`LATERAL\`:

\`\`\`sql
-- one output row per tag in each article's tag array
SELECT a.id, a.title, t AS tag
FROM article a
CROSS JOIN LATERAL unnest(a.tags) AS t;

-- one output row per element of each order's JSONB line-items array
SELECT o.id, li ->> 'sku' AS sku, (li ->> 'qty')::int AS qty
FROM orders o
CROSS JOIN LATERAL jsonb_array_elements(o.line_items) AS li;
\`\`\`

This is the standard pattern for "unnest a JSON/array column into rows".

## Use case 3: a per-row calculation that needs multiple statements

When the value you want requires an intermediate result — "the running median", "the most recent event of each type", a small multi-step computation — a \`LATERAL\` subquery can hold that logic and return several derived columns at once, which a scalar subquery in \`SELECT\` cannot (a scalar subquery returns exactly one value).

## \`LATERAL\` vs scalar subquery vs \`JOIN ... GROUP BY\`

| you want | tool |
|---|---|
| one derived value per outer row | scalar subquery in \`SELECT\` |
| several derived columns / a few rows per outer row | \`LATERAL\` |
| top-N rows per group | \`LATERAL\` + \`LIMIT\`, or window function + \`WHERE rn <= N\` |
| an aggregate per group over the whole set | \`JOIN ... GROUP BY\` |
| expand an array/JSON column into rows | \`CROSS JOIN LATERAL unnest / jsonb_array_elements\` |

## Performance

\`LATERAL\` runs the inner query **once per qualifying outer row**, like a correlated subquery. That is efficient when:

- The outer side is already filtered down to few rows.
- The inner query hits an index on the correlation column (so each iteration is a cheap index lookup, not a scan).

It is a bad choice when the outer side has millions of rows and each inner iteration is expensive — then a single set-based \`JOIN\` / window function that processes everything in one pass usually wins. As always, \`EXPLAIN (ANALYZE)\` tells you (Module 10).`,

    contentHi: `## Wo niyam jo \`LATERAL\` badalta hai

Ek normal \`FROM\` clause mein, items **independent** hain — \`FROM\` mein ek subquery ek baar evaluate hoti hai, apne aap, aur usi \`FROM\` mein doosri tables reference nahi kar sakti. To ye fail hota hai:

\`\`\`sql
FROM department d,
     (SELECT ... FROM employee e WHERE e.dept_id = d.id) x   -- "d" yahaan visible nahi
\`\`\`

**\`LATERAL\`** wo restriction hataता hai: ek \`LATERAL\` subquery **iske pehle aane waale \`FROM\` items ke columns reference kar sakti hai**. Database phir ise **har row ke liye ek baar** evaluate karta hai, us row ki values substitute karke.

Conceptually ye ek \`for\` loop hai: "har department row ke liye, is subquery ko \`d\` current row se bound karके chalao, aur iski output rows ko \`d\` par join karo".

## Syntax

- **\`CROSS JOIN LATERAL (subquery) alias\`** — ek cross join jaisa, par subquery prati outer row re-evaluate hoti hai. Agar subquery kisi outer row ke liye 0 rows lautati hai, wo outer row **drop** ho jati hai.
- **\`LEFT JOIN LATERAL (subquery) alias ON true\`** — outer row rakhता hai jab subquery kuch nahi lautati, lateral columns NULL-padding karke. \`ON\` \`true\` hai kyunki row-matching logic subquery ke *andar* hai.
- Ek earlier column reference karne waala **set-returning function** \`FROM\` mein **implicitly \`LATERAL\`** hai.

## Use case 1: top-N per group

Problem: "**har** department mein 3 highest-paid employees". Ek plain \`JOIN\` + \`ORDER BY\` + \`LIMIT\` overall top 3 deता hai, per department nahi. \`LATERAL\` ise seedhे solve karta hai — har department ke liye, subquery apna \`ORDER BY salary DESC LIMIT 3\` karta hai.

**Window-function alternative** (Module 6) \`ROW_NUMBER() OVER (PARTITION BY ...)\` hai. Dono standard hain; \`(dept_id, salary DESC)\` par ek index ke saath \`LATERAL\` + \`LIMIT\` faster ho sakta hai.

## Use case 2: prati row ek set expand karna

Ek set-returning function — \`jsonb_array_elements\`, \`unnest\`, \`generate_series\` — ek input se kई rows produce karta hai. Ise *ek table ki prati row* chalane ke liye, us row ka data input ke roop mein istemal karke, aapko \`LATERAL\` chahiye. Ye "ek JSON/array column ko rows mein unnest karo" ka standard pattern hai.

## \`LATERAL\` vs scalar subquery vs \`JOIN ... GROUP BY\`

| aap chahte ho | tool |
|---|---|
| prati outer row ek derived value | \`SELECT\` mein scalar subquery |
| kई derived columns / prati outer row kuch rows | \`LATERAL\` |
| prati group top-N rows | \`LATERAL\` + \`LIMIT\`, ya window function |
| prati group ek aggregate | \`JOIN ... GROUP BY\` |
| ek array/JSON column ko rows mein expand | \`CROSS JOIN LATERAL unnest\` |

## Performance

\`LATERAL\` inner query ko **prati qualifying outer row ek baar** chalata hai. Ye efficient hai jab outer side pehle se kam rows tak filtered hai aur inner query correlation column par ek index hit karta hai. Ye ek bura choice hai jab outer side ke millions of rows hain aur har inner iteration mehnga hai — phir ek single set-based \`JOIN\` / window function aksar jeetta hai.`,

    examples: [
      {
        title: 'Top-1 per group: LATERAL with ORDER BY + LIMIT inside',
        titleHi: 'Prati group top-1: andar ORDER BY + LIMIT ke saath LATERAL',
        code: `CREATE TABLE dept (id int, name text);
INSERT INTO dept VALUES (1, 'eng'), (2, 'sales'), (3, 'ops');   -- ops has no employees

CREATE TABLE emp (id int, name text, dept_id int, salary int);
INSERT INTO emp VALUES
  (1, 'Ada', 1, 120), (2, 'Bo', 1, 95), (3, 'Cy', 2, 110), (4, 'Di', 2, 90);

-- highest-paid employee in each department; ops (no employees) is dropped by CROSS JOIN
SELECT d.name AS dept, top.name AS top_earner, top.salary
FROM dept d
CROSS JOIN LATERAL (
  SELECT name, salary FROM emp WHERE dept_id = d.id ORDER BY salary DESC LIMIT 1
) top
ORDER BY d.name;`,
        output: ` dept  | top_earner | salary
-------+------------+--------
 eng   | Ada        | 120
 sales | Cy         | 110
(2 rows)`,
        explain: '`CROSS JOIN LATERAL (subquery)` re-runs the subquery once per outer row, with `d.id` substituted — so the `ORDER BY salary DESC LIMIT 1` happens PER DEPARTMENT, giving the top earner in each. This is top-N-per-group, which a plain `JOIN ... ORDER BY ... LIMIT` cannot do (that gives the global top 1). `ops` has no employees so its subquery returns nothing and `CROSS JOIN LATERAL` drops it, exactly like an inner join.',
        explainHi: '`CROSS JOIN LATERAL (subquery)` subquery ko prati outer row ek baar re-run karता hai, `d.id` substituted ke saath — to `ORDER BY salary DESC LIMIT 1` PRATI DEPARTMENT hoता hai, har ek mein top earner deता hai. Ye top-N-per-group hai, jo ek plain `JOIN ... ORDER BY ... LIMIT` nahi kar sakti (wo global top 1 deती hai). `ops` ke koi employees nahi to iski subquery kuch nahi lautaती aur `CROSS JOIN LATERAL` use drop karता hai, theek ek inner join ki tarah.',
      },
      {
        title: 'LEFT JOIN LATERAL ... ON true keeps the group with no matches',
        titleHi: 'LEFT JOIN LATERAL ... ON true bina matches waale group ko rakhta hai',
        code: `CREATE TABLE dept (id int, name text);
INSERT INTO dept VALUES (1, 'eng'), (2, 'sales'), (3, 'ops');

CREATE TABLE emp (id int, name text, dept_id int, salary int);
INSERT INTO emp VALUES (1, 'Ada', 1, 120), (2, 'Bo', 1, 95), (3, 'Cy', 2, 110);

-- LEFT JOIN LATERAL: ops appears with NULLs instead of being dropped
SELECT d.name AS dept, top.name AS top_earner
FROM dept d
LEFT JOIN LATERAL (
  SELECT name FROM emp WHERE dept_id = d.id ORDER BY salary DESC LIMIT 1
) top ON true
ORDER BY d.name;`,
        output: ` dept  | top_earner
-------+------------
 eng   | Ada
 ops   | NULL
 sales | Cy
(3 rows)`,
        explain: "Switching `CROSS JOIN LATERAL` to `LEFT JOIN LATERAL (subquery) ON true` keeps `ops` in the result with `top_earner` NULL, instead of dropping it. `LEFT` preserves the outer row; `ON true` is the right join condition because the actual matching (`dept_id = d.id`) already lives INSIDE the subquery's `WHERE`, so there is nothing left for `ON` to test.",
        explainHi: '`CROSS JOIN LATERAL` ko `LEFT JOIN LATERAL (subquery) ON true` mein badalna `ops` ko result mein `top_earner` NULL ke saath rakhता hai, use drop karne ke bजाy. `LEFT` outer row preserve karता hai; `ON true` sahi join condition hai kyunki asli matching (`dept_id = d.id`) pehle se subquery ke `WHERE` ke ANDAR hai, to `ON` ke test karne ke liye kuch nahi bachता.',
      },
      {
        title: 'Expand a JSON array column into one row per element',
        titleHi: 'Ek JSON array column ko prati element ek row mein expand karo',
        code: `CREATE TABLE ordr (id int, items jsonb);
INSERT INTO ordr VALUES
  (1, '[{"sku":"A1","qty":2},{"sku":"B2","qty":1}]'),
  (2, '[{"sku":"C3","qty":5}]');

SELECT o.id AS order_id,
       item ->> 'sku'        AS sku,
       (item ->> 'qty')::int AS qty
FROM ordr o
CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item
ORDER BY o.id, sku;`,
        output: ` order_id | sku | qty
----------+-----+-----
 1        | A1  | 2
 1        | B2  | 1
 2        | C3  | 5
(3 rows)`,
        explain: '`CROSS JOIN LATERAL jsonb_array_elements(o.items)` runs the set-returning function once per order row, using THAT row\'s `items` array as input, and emits one output row per array element. Order 1\'s 2-element array becomes 2 rows, order 2\'s 1-element array becomes 1 row. `item ->> \'sku\'` reads a text field; `(item ->> \'qty\')::int` reads and casts. This is the standard "explode a JSON/array column into rows" pattern.',
        explainHi: '`CROSS JOIN LATERAL jsonb_array_elements(o.items)` set-returning function ko prati order row ek baar chalाता hai, US row ke `items` array ko input ke roop mein istemal karके, aur prati array element ek output row emit karता hai. Order 1 ka 2-element array 2 rows banता hai, order 2 ka 1-element array 1 row. `item ->> \'sku\'` ek text field padhता hai; `(item ->> \'qty\')::int` padhकर cast karता hai. Ye standard "ek JSON/array column ko rows mein explode karo" pattern hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "the 3 most recent orders for each customer" -- with a plain join
SELECT c.name, o.id, o.created_at
FROM customer c
JOIN orders o ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 3;
-- returns the 3 most recent orders OVERALL, across all customers -- not 3 per customer`,
        right: `SELECT c.name, o.id, o.created_at
FROM customer c
CROSS JOIN LATERAL (
  SELECT id, created_at FROM orders
  WHERE customer_id = c.id
  ORDER BY created_at DESC
  LIMIT 3
) o;`,
        why: 'A join followed by ORDER BY and LIMIT applies the limit to the entire result set, so you get the global top 3, not the top 3 within each group. To get top-N per group you need the ordering and the limit to happen once per group. LATERAL does exactly that: the subquery, re-evaluated per customer with that customer id substituted, does its own ORDER BY and LIMIT 3, and those up-to-three rows are attached to the customer. The window-function form, ROW_NUMBER partitioned by customer then filter to 3 or fewer, is the other standard approach and is covered in Module 6.',
        whyHi: 'Ek join jiske baad ORDER BY aur LIMIT hai limit ko poore result set par apply karta hai, to aapko global top 3 milta hai, har group ke andar top 3 nahi. Top-N per group ke liye aapko ordering aur limit ko prati group ek baar hona chahiye. LATERAL theek wahi karta hai: subquery, prati customer re-evaluated us customer id ke saath, apna ORDER BY aur LIMIT 3 karta hai.',
      },
      {
        wrong: `-- LATERAL, but the subquery returns nothing for some outer rows
SELECT d.name, r.recent_hire
FROM department d
CROSS JOIN LATERAL (
  SELECT name AS recent_hire FROM employee WHERE dept_id = d.id ORDER BY hired_at DESC LIMIT 1
) r;
-- departments with no employees silently disappear from the report`,
        right: `SELECT d.name, r.recent_hire
FROM department d
LEFT JOIN LATERAL (
  SELECT name AS recent_hire FROM employee WHERE dept_id = d.id ORDER BY hired_at DESC LIMIT 1
) r ON true;
-- ON true, and LEFT so an empty department is kept with recent_hire = NULL`,
        why: 'CROSS JOIN LATERAL behaves like an inner join: if the lateral subquery produces zero rows for a given outer row, that outer row is dropped from the result. For "every department and its most recent hire", a department with no employees should still appear, with a NULL. The fix is LEFT JOIN LATERAL with ON true. LEFT keeps the outer row, and ON true is the correct join condition because the actual row-matching, dept_id equals d dot id, is already inside the subquery, so there is nothing left for the ON to test.',
        whyHi: 'CROSS JOIN LATERAL ek inner join ki tarah behave karta hai: agar lateral subquery kisi diye outer row ke liye zero rows produce karti hai, wo outer row result se drop ho jati hai. "Har department aur iska sabse recent hire" ke liye, bina employees waala ek department phir bhi appear hona chahiye. Fix LEFT JOIN LATERAL ON true hai.',
      },
      {
        wrong: `-- LATERAL over a huge unfiltered table, one expensive query per row
SELECT u.id, stats.*
FROM users u                                    -- 5 million rows
CROSS JOIN LATERAL (
  SELECT count(*) AS n, max(created_at) AS last
  FROM events e WHERE e.user_id = u.id          -- full events scan per user? -> disaster
) stats;`,
        right: `SELECT u.id, coalesce(s.n, 0) AS n, s.last
FROM users u
LEFT JOIN (
  SELECT user_id, count(*) AS n, max(created_at) AS last
  FROM events GROUP BY user_id                   -- ONE pass over events, grouped
) s ON s.user_id = u.id;`,
        why: 'LATERAL re-runs its subquery once per outer row. That is efficient when the outer side is small or the inner query is a cheap indexed lookup. It is a poor choice when the outer table has millions of rows and each inner iteration does real work, because you multiply that work by the row count. For a straightforward aggregate-per-key over a large child table, a single GROUP BY that scans the child table once and then a join to the parent is dramatically faster. Reach for LATERAL when you specifically need top-N-per-group, a set expansion, or a multi-column per-row result that an aggregate cannot express, and check the plan.',
        whyHi: 'LATERAL apni subquery ko prati outer row ek baar re-run karta hai. Ye efficient hai jab outer side chhota hai ya inner query ek sasta indexed lookup hai. Ye ek bura choice hai jab outer table ke millions of rows hain aur har inner iteration real work karta hai. Ek bade child table par ek straightforward aggregate-per-key ke liye, ek single GROUP BY jo child table ko ek baar scan karta hai bahut faster hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "recent activity" panel: `FROM user u CROSS JOIN LATERAL (SELECT ... WHERE e.user_id = u.id ORDER BY e.at DESC LIMIT 5) recent`** with an index on `(user_id, at DESC)` so each user\'s panel is five index rows.',
        hi: '**Ek "recent activity" panel: `FROM user u CROSS JOIN LATERAL (... ORDER BY e.at DESC LIMIT 5) recent`** `(user_id, at DESC)` par ek index ke saath.',
      },
      {
        en: '**`CROSS JOIN LATERAL jsonb_to_recordset(payload -> \'lines\')` in an ingestion query** to shred an incoming JSON document\'s line array into typed rows for insertion into a normalized table.',
        hi: '**Ek ingestion query mein `CROSS JOIN LATERAL jsonb_to_recordset(payload -> \'lines\')`** ek incoming JSON document ki line array ko typed rows mein shred karne ke liye.',
      },
      {
        en: '**A pricing query: `FROM order_line ol CROSS JOIN LATERAL (SELECT unit_price FROM price_tier WHERE min_qty <= ol.qty ORDER BY min_qty DESC LIMIT 1) t`** — the best-matching tier per line, in one pass.',
        hi: '**Ek pricing query: `FROM order_line ol CROSS JOIN LATERAL (SELECT unit_price FROM price_tier WHERE min_qty <= ol.qty ORDER BY min_qty DESC LIMIT 1) t`** — prati line best-matching tier.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `LATERAL` do, and what is the canonical problem it solves?',
        qHi: '`LATERAL` kya karta hai, aur ye kaunsi canonical problem solve karta hai?',
        a: 'Normally the items in a FROM clause are independent: a subquery or function in FROM is evaluated once, standalone, and cannot reference the other tables listed in the same FROM. LATERAL lifts that restriction for one item. A LATERAL subquery may reference columns of the FROM items that come before it, and the database then evaluates it once for every row of those earlier items, substituting that row\'s values. Conceptually it is a for-each loop over the outer rows, running the subquery per row and joining its output back. You write it as CROSS JOIN LATERAL, which behaves like an inner join and drops an outer row if the subquery returns nothing, or LEFT JOIN LATERAL with ON true, which keeps the outer row and NULL-pads. The canonical problem it solves is top-N per group. A plain join with ORDER BY and LIMIT gives the global top N, not the top N within each group, because the limit applies to the whole result. With LATERAL, the subquery does its own ORDER BY and LIMIT once per group, so you get the three most expensive products in each category, or the five most recent orders per customer. The other big use is expanding a set-returning function per row, like unnesting an array column or shredding a JSON array into one row per element, where the function needs the current row as input. The window-function approach, ROW_NUMBER partitioned and filtered, also does top-N, and which is faster depends on indexes.',
        aHi: 'Normally FROM clause mein items independent hain: FROM mein ek subquery ek baar evaluate hoti hai, standalone, aur usi FROM mein listed doosri tables reference nahi kar sakti. LATERAL wo restriction ek item ke liye hataता hai. Ek LATERAL subquery iske pehle aane waale FROM items ke columns reference kar sakti hai, aur database phir ise un earlier items ki har row ke liye ek baar evaluate karta hai. Conceptually ye outer rows par ek for-each loop hai. Aap ise CROSS JOIN LATERAL likhते ho, jo ek inner join ki tarah behave karta hai, ya LEFT JOIN LATERAL ON true ke saath. Ye jo canonical problem solve karta hai wo top-N per group hai. Ek plain join ORDER BY aur LIMIT ke saath global top N deता hai. LATERAL ke saath, subquery apna ORDER BY aur LIMIT prati group ek baar karti hai.',
      },
      {
        q: 'When is `LATERAL` the wrong choice, and what do you use instead?',
        qHi: '`LATERAL` kab galat choice hai, aur aap iske bजाy kya istemal karte ho?',
        a: 'LATERAL runs its subquery once per qualifying outer row, exactly like a correlated subquery. That is efficient in two situations: when the outer side has already been filtered down to a small number of rows, and when the inner subquery hits an index on the correlation column so each iteration is a cheap lookup rather than a scan. It is the wrong choice when the outer table has millions of rows and each inner iteration does real work, because you have multiplied that work by the outer row count. The classic mistake is a LATERAL that computes an aggregate like count and max per user over a large events table: that is potentially a full events scan per user. For a plain aggregate-per-key over a large child table, the right approach is a single GROUP BY that scans the child table once, producing one row per key, then a join to the parent. That is set-based and processes everything in one pass. So reserve LATERAL for the cases only it handles cleanly: top-N rows per group, expanding a set-returning function per row, or a per-row result with multiple columns that a scalar subquery cannot return. And when performance matters, run EXPLAIN ANALYZE to see whether the per-row iteration or a set-based plan is actually cheaper.',
        aHi: 'LATERAL apni subquery ko prati qualifying outer row ek baar chalata hai, theek ek correlated subquery ki tarah. Ye do situations mein efficient hai: jab outer side pehle se kam rows tak filtered hai, aur jab inner subquery correlation column par ek index hit karta hai. Ye galat choice hai jab outer table ke millions of rows hain aur har inner iteration real work karta hai. Classic galti ek LATERAL hai jo ek bade events table par prati user count aur max jaisa ek aggregate compute karta hai. Ek bade child table par ek plain aggregate-per-key ke liye, sahi approach ek single GROUP BY hai jo child table ko ek baar scan karta hai. To LATERAL ko un cases ke liye rakho jo sirf ye cleanly handle karta hai: prati group top-N rows, prati row ek set-returning function expand karna.',
      },
    ],

    exercises: [
      {
        task: 'Tables `blog(id int, title text)` and `post(id int, blog_id int, published_at date, headline text)`. Use `CROSS JOIN LATERAL` to get, for each blog, its 2 most recent posts (`ORDER BY published_at DESC LIMIT 2` inside). Confirm a blog with 5 posts shows exactly 2 rows and a blog with 1 post shows 1 row. Then switch to `LEFT JOIN LATERAL ... ON true` and confirm a post-less blog now appears with `NULL`s.',
        taskHi: 'Tables `blog(id, title)` aur `post(id, blog_id, published_at, headline)`. `CROSS JOIN LATERAL` istemal karke har blog ke 2 sabse recent posts lo. Phir `LEFT JOIN LATERAL ... ON true` par switch karo.',
        hint: '`FROM blog b CROSS JOIN LATERAL (SELECT headline, published_at FROM post WHERE blog_id = b.id ORDER BY published_at DESC LIMIT 2) p`. `CROSS` drops the post-less blog; `LEFT ... ON true` keeps it.',
        hintHi: '`FROM blog b CROSS JOIN LATERAL (SELECT ... WHERE blog_id = b.id ORDER BY published_at DESC LIMIT 2) p`. `LEFT ... ON true` post-less blog rakhta hai.',
      },
      {
        task: 'Table `survey(id int, answers jsonb)` where `answers` is a JSON array of `{"q": ..., "a": ...}` objects. Write a query using `CROSS JOIN LATERAL jsonb_array_elements(answers)` that returns one row per answer: `survey_id`, `q`, `a`. Test with one survey of 3 answers and one of 1.',
        taskHi: 'Table `survey(id, answers jsonb)` jahaan `answers` ek JSON array hai. `CROSS JOIN LATERAL jsonb_array_elements(answers)` istemal karke ek query likho jo prati answer ek row return karti hai.',
        hint: '`FROM survey s CROSS JOIN LATERAL jsonb_array_elements(s.answers) AS elem`, then `elem ->> \'q\'` and `elem ->> \'a\'` in the SELECT.',
        hintHi: '`FROM survey s CROSS JOIN LATERAL jsonb_array_elements(s.answers) AS elem`, phir SELECT mein `elem ->> \'q\'`.',
      },
      {
        task: 'Tables `order_line(id int, qty int)` and `price_tier(min_qty int, unit_price numeric)` with tiers `(1, 10.00), (10, 9.00), (100, 8.00)`. Use `CROSS JOIN LATERAL (SELECT unit_price FROM price_tier WHERE min_qty <= ol.qty ORDER BY min_qty DESC LIMIT 1) t` to attach the best-matching (highest applicable) tier price to each line. Test with quantities 5, 10, 250.',
        taskHi: 'Tables `order_line(id, qty)` aur `price_tier(min_qty, unit_price)`. `CROSS JOIN LATERAL (... WHERE min_qty <= ol.qty ORDER BY min_qty DESC LIMIT 1) t` istemal karke har line ko best-matching tier price attach karo. Quantities 5, 10, 250 se test karo.',
        hint: 'qty 5 -> only the `min_qty=1` tier applies -> `10.00`. qty 10 -> tiers 1 and 10 apply, `ORDER BY min_qty DESC LIMIT 1` picks 10 -> `9.00`. qty 250 -> `8.00`.',
        hintHi: 'qty 5 -> sirf `min_qty=1` tier -> `10.00`. qty 10 -> `ORDER BY min_qty DESC LIMIT 1` 10 chunta hai -> `9.00`. qty 250 -> `8.00`.',
      },
    ],

    keyTakeaways: [
      'NORMALLY `FROM` items are INDEPENDENT — a subquery/function in `FROM` can\'t reference the other `FROM` tables. `LATERAL` lifts that: a `LATERAL` subquery MAY reference columns of `FROM` items BEFORE it, and the DB evaluates it ONCE PER ROW of those earlier items (conceptually a `for`-each loop).',
      '`CROSS JOIN LATERAL (subq) alias` — inner-join-like; DROPS an outer row if the subquery returns 0 rows. `LEFT JOIN LATERAL (subq) alias ON true` — KEEPS the outer row, NULL-pads the lateral columns (`ON true` because the matching is INSIDE the subquery\'s `WHERE`). `, LATERAL (subq)` = comma form. A set-returning fn referencing an earlier column is IMPLICITLY `LATERAL`.',
      'CANONICAL USE — TOP-N PER GROUP: a plain `JOIN ... ORDER BY ... LIMIT` gives the GLOBAL top N. `LATERAL` puts the `ORDER BY` + `LIMIT` INSIDE, run once per group -> "3 most expensive products IN EACH category". (Window function `ROW_NUMBER() OVER (PARTITION BY ...) ... WHERE rn <= N` also does it — Module 6.)',
      'USE 2 — EXPAND A SET PER ROW: `CROSS JOIN LATERAL unnest(t.arr)` / `jsonb_array_elements(t.json)` / `regexp_split_to_table(...)` / `generate_series(...)` — one output row per element, with the current row as input. The standard "unnest an array/JSON column into rows" pattern.',
      'USE 3 — a per-row result with MULTIPLE columns / a multi-step calc that a scalar subquery (one value only) can\'t return.',
      'TOOL CHOICE: one derived value per row -> scalar subquery in `SELECT`; several columns / few rows per outer row -> `LATERAL`; top-N per group -> `LATERAL` + `LIMIT` OR window fn; an aggregate per group -> `JOIN ... GROUP BY`; array/JSON -> `LATERAL unnest`/`jsonb_array_elements`.',
      'PERFORMANCE: `LATERAL` runs the inner query ONCE PER qualifying outer row (like a correlated subquery). GOOD when the outer side is already small OR the inner query hits an index on the correlation column. BAD when the outer table has millions of rows and each iteration does real work — then a single set-based `JOIN` / `GROUP BY` / window fn that processes everything in ONE pass wins. `EXPLAIN (ANALYZE)` decides (Module 10).',
    ],
    keyTakeawaysHi: [
      'NORMALLY `FROM` items INDEPENDENT hain — `FROM` mein ek subquery doosri `FROM` tables reference nahi kar sakti. `LATERAL` wo hataता hai: ek `LATERAL` subquery iske PEHLE ke `FROM` items ke columns reference kar sakti hai, aur DB ise un earlier items ki PRATI ROW ek baar evaluate karta hai.',
      '`CROSS JOIN LATERAL (subq) alias` — inner-join-jaisa; ek outer row DROP karta hai agar subquery 0 rows lautati hai. `LEFT JOIN LATERAL (subq) alias ON true` — outer row RAKHता hai, lateral columns NULL-pad karta hai. Ek set-returning fn IMPLICITLY `LATERAL` hai.',
      'CANONICAL USE — TOP-N PER GROUP: ek plain `JOIN ... ORDER BY ... LIMIT` GLOBAL top N deта hai. `LATERAL` `ORDER BY` + `LIMIT` ko ANDAR daalta hai, prati group ek baar -> "har category mein 3 sabse mehnge products".',
      'USE 2 — PRATI ROW EK SET EXPAND KARO: `CROSS JOIN LATERAL unnest(t.arr)` / `jsonb_array_elements(t.json)` — prati element ek output row. "Ek array/JSON column ko rows mein unnest karo" ka standard pattern.',
      'USE 3 — ek per-row result MULTIPLE columns ke saath jo ek scalar subquery (sirf ek value) nahi lauta sakti.',
      'TOOL CHOICE: prati row ek value -> `SELECT` mein scalar subquery; prati outer row kई columns -> `LATERAL`; top-N per group -> `LATERAL` + `LIMIT` YA window fn; prati group ek aggregate -> `JOIN ... GROUP BY`.',
      'PERFORMANCE: `LATERAL` inner query ko PRATI qualifying outer row ek baar chalata hai. ACHHA jab outer side pehle se chhota hai YA inner query correlation column par ek index hit karta hai. BURA jab outer table ke millions of rows hain — phir ek single set-based `JOIN` / `GROUP BY` / window fn jeetta hai.',
    ],
  },
];
