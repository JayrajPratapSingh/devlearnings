/**
 * Databases Complete Course — Module 6: Window Functions, lessons 1-3.
 *
 * Lesson 1: What a window function is — an aggregate (or ranking) computed across a
 *           set of rows WITHOUT collapsing them; OVER (), OVER (PARTITION BY ...);
 *           where it sits in processing order and why you cannot use it in WHERE.
 * Lesson 2: Ranking functions — row_number / rank / dense_rank / ntile, how ties are
 *           handled, percent_rank / cume_dist, and the top-N-per-group pattern
 *           (rank in a subquery/CTE, then WHERE rn <= N).
 * Lesson 3: lag / lead and value-at-offset — lag/lead with offset and default,
 *           first_value / last_value / nth_value, row-to-row deltas and
 *           period-over-period comparisons, and the last_value default-frame gotcha.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 6
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_6: CourseLesson[] = [
  {
    slug: 'sql-window-functions-intro',
    title: 'Window Functions: Aggregate Without Collapsing',
    titleHi: 'Window Functions: Bina Collapse Kiye Aggregate',
    description: 'A window function computes a value across a set of related rows — a running total, a rank, the previous row\'s value — but returns ONE result PER ROW instead of collapsing the group like `GROUP BY`. The `OVER (...)` clause defines which rows each calculation sees.',
    descriptionHi: 'Ek window function related rows ke ek set par ek value compute karता hai — ek running total, ek rank, pichli row ki value — par `GROUP BY` ki tarah group collapse karne ke bजाy PRATI ROW EK result lौtaता hai. `OVER (...)` clause define karता hai ki har calculation kaunसी rows dekhता hai.',
    difficulty: 'MEDIUM',
    duration: 24,

    order: 1,

    analogy: {
      en: '**Marking each runner\'s race result on their own bib, without merging everyone into a single summary line.** A `GROUP BY` is the podium announcement: "Kenya — 3 medals". The individual runners disappear into that one number. A window function is different: every runner keeps their own row on the results sheet, and next to their time you *also* write "position: 4th", "gap to leader: +12s", "position within their own country: 1st", "running count of finishers so far: 17". Each of those extra columns is computed by looking at a *set* of other rows — all finishers, or all finishers from the same country, or all finishers up to this one — but the runner\'s row is never removed or combined. The `OVER (...)` clause is you specifying, for each such column, *which* set of rows to look at: everyone (`OVER ()`), everyone in the same country (`PARTITION BY country`), everyone in finishing order up to here (`ORDER BY time`).',
      hi: '**Har runner ka race result unki apni bib par mark karna, bina sabko ek single summary line mein merge kiye.** Ek `GROUP BY` podium announcement hai: "Kenya — 3 medals". Individual runners us ek number mein gायab ho jaते hain. Ek window function alag hai: har runner apni row results sheet par rakhता hai, aur unke time ke paas aap *bhi* likhते ho "position: 4th", "leader se gap: +12s", "apne desh mein position: 1st", "ab tak finishers ka running count: 17". Un har extra columns ko doosri rows ke ek *set* ko dekhkर compute kiya jaता hai — par runner ki row kabhi remove ya combine nahi hoती. `OVER (...)` clause aap specify karते ho, har aise column ke liye, *kaunसी* set of rows dekhनी hai: sab (`OVER ()`), usi desh mein sab (`PARTITION BY country`), yahaan tak finishing order mein sab (`ORDER BY time`).',
    },

    simple: `**\`GROUP BY\` collapses; a window function keeps every row**

\`\`\`sql
-- GROUP BY: 2 rows out
SELECT region, sum(amt) FROM sales GROUP BY region;

-- window: every sales row, PLUS its region's total on each
SELECT region, product, amt,
       sum(amt) OVER (PARTITION BY region) AS region_total
FROM sales;
\`\`\`

**\`OVER ()\` — the whole result set is the window**

\`\`\`sql
SELECT amt,
       sum(amt) OVER ()                    AS grand_total,
       round(100.0 * amt / sum(amt) OVER (), 1) AS pct_of_all
FROM sales;
\`\`\`

**\`OVER (PARTITION BY col)\` — one window per distinct \`col\` value**

\`\`\`sql
SELECT region, amt,
       avg(amt) OVER (PARTITION BY region) AS region_avg,
       amt - avg(amt) OVER (PARTITION BY region) AS vs_region_avg
FROM sales;
\`\`\`

**\`OVER (ORDER BY col)\` — adds running/positional meaning (Lessons 2-4)**

\`\`\`sql
SELECT sold_on, amt,
       sum(amt)      OVER (ORDER BY sold_on) AS running_total,
       row_number()  OVER (ORDER BY sold_on) AS nth
FROM sales;
\`\`\`

**You CANNOT use a window function in \`WHERE\`, \`GROUP BY\`, or \`HAVING\`**

\`\`\`sql
-- ERROR: window functions are not allowed in WHERE
SELECT * FROM sales WHERE row_number() OVER (ORDER BY amt) <= 3;

-- fix: compute it in a subquery / CTE, then filter the outer query
SELECT * FROM (
  SELECT *, row_number() OVER (ORDER BY amt) AS rn FROM sales
) s WHERE rn <= 3;
\`\`\``,

    simpleHi: `**\`GROUP BY\` collapse karता hai; ek window function har row rakhता hai**

\`\`\`sql
-- GROUP BY: 2 rows out
SELECT region, sum(amt) FROM sales GROUP BY region;

-- window: har sales row, PLUS har ek par iske region ka total
SELECT region, product, amt,
       sum(amt) OVER (PARTITION BY region) AS region_total
FROM sales;
\`\`\`

**\`OVER ()\` — poora result set window hai**

\`\`\`sql
SELECT amt,
       sum(amt) OVER ()                    AS grand_total,
       round(100.0 * amt / sum(amt) OVER (), 1) AS pct_of_all
FROM sales;
\`\`\`

**\`OVER (PARTITION BY col)\` — prati distinct \`col\` value ek window**

\`\`\`sql
SELECT region, amt,
       avg(amt) OVER (PARTITION BY region) AS region_avg,
       amt - avg(amt) OVER (PARTITION BY region) AS vs_region_avg
FROM sales;
\`\`\`

**\`OVER (ORDER BY col)\` — running/positional meaning add karता hai (Lessons 2-4)**

\`\`\`sql
SELECT sold_on, amt,
       sum(amt)      OVER (ORDER BY sold_on) AS running_total,
       row_number()  OVER (ORDER BY sold_on) AS nth
FROM sales;
\`\`\`

**Aap ek window function ko \`WHERE\`, \`GROUP BY\`, ya \`HAVING\` mein istemal NAHI kar sakte**

\`\`\`sql
-- ERROR: window functions are not allowed in WHERE
SELECT * FROM sales WHERE row_number() OVER (ORDER BY amt) <= 3;

-- fix: ek subquery / CTE mein compute karो, phir outer query filter karो
SELECT * FROM (
  SELECT *, row_number() OVER (ORDER BY amt) AS rn FROM sales
) s WHERE rn <= 3;
\`\`\``,

    content: `## The core idea

A **window function** performs a calculation across a set of rows that are related to the current row, and produces **one value for every row**. Unlike \`GROUP BY\`, which folds a group into a single output row, a window function **leaves all the rows in place** and just adds a computed column.

Any aggregate (\`sum\`, \`avg\`, \`count\`, \`min\`, \`max\`, \`string_agg\`, ...) becomes a window function when you follow it with \`OVER (...)\`. There are also **window-only functions**: \`row_number\`, \`rank\`, \`dense_rank\`, \`ntile\`, \`lag\`, \`lead\`, \`first_value\`, \`last_value\`, \`nth_value\`, \`percent_rank\`, \`cume_dist\`.

\`\`\`sql
SELECT region, product, amt,
       sum(amt) OVER (PARTITION BY region) AS region_total,   -- aggregate as a window
       rank()   OVER (PARTITION BY region ORDER BY amt DESC) AS rank_in_region  -- window-only
FROM sales;
\`\`\`

## Anatomy of \`OVER (...)\`

\`\`\`
OVER (
  PARTITION BY expr [, expr ...]   -- split rows into independent groups (default: all rows = one window)
  ORDER BY expr [ASC|DESC] [, ...] -- order rows within each partition (needed for ranking / running / offset)
  frame_clause                     -- which rows around the current one are "in scope" (Lesson 5)
)
\`\`\`

- **No \`PARTITION BY\`** → the window is the **entire result set** (after \`WHERE\`/\`GROUP BY\`/\`HAVING\`).
- **\`PARTITION BY region\`** → each region is its own window; the function restarts for each.
- **\`ORDER BY\`** inside \`OVER\` is separate from the query's final \`ORDER BY\`. It orders rows *for the window calculation* — it is what makes \`row_number\`, \`sum() OVER (ORDER BY ...)\` (running total), and \`lag\` meaningful.
- **\`OVER ()\`** — empty parentheses — is legal and means "one window, all rows, unordered".

## Where window functions run — and why not in \`WHERE\`

Logical processing order:

\`\`\`
FROM → WHERE → GROUP BY → HAVING → **window functions** → SELECT (distinct) → ORDER BY → LIMIT
\`\`\`

Window functions are evaluated **after** \`WHERE\`, \`GROUP BY\`, and \`HAVING\`, and **before** the final \`ORDER BY\`/\`LIMIT\`. Consequences:

1. **You cannot reference a window function in \`WHERE\`, \`GROUP BY\`, or \`HAVING\`** — they have not been computed yet. \`WHERE row_number() OVER (...) <= 3\` is an error.
2. The window sees the rows **that survived \`WHERE\`** — filtering happens first, so a running total is over the filtered set.
3. If the query has a \`GROUP BY\`, the window sees the **grouped rows**, and you can nest an aggregate inside a window: \`sum(sum(amt)) OVER ()\` (Lesson 6).

**To filter on a window result**, wrap the query in a subquery or CTE and filter the outer level:

\`\`\`sql
SELECT * FROM (
  SELECT s.*, row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn
  FROM sales s
) ranked
WHERE rn <= 3;
\`\`\`

(Some databases — Snowflake, BigQuery, DuckDB — offer a \`QUALIFY\` clause that filters on window results directly. PostgreSQL does not; use the subquery.)

## Window vs \`GROUP BY\` — pick by output shape

| you want | use |
|---|---|
| one row per group, the detail rows gone | \`GROUP BY\` |
| every detail row, plus a group-level number on each | window with \`PARTITION BY\` |
| every row, plus a running / positional value | window with \`ORDER BY\` |
| a rank, a row number, "previous row", "top 3 per group" | window (only windows can do these) |

## A note on cost

A window function requires the rows to be **sorted** by \`PARTITION BY\` then \`ORDER BY\` (unless an index already provides that order). One sort per distinct window definition. Several functions that share the *same* \`OVER (...)\` share one sort — name the window (Lesson 6) so it is obvious and guaranteed. Window functions do not multiply rows and are generally cheaper than the equivalent self-join.`,

    contentHi: `## Core idea

Ek **window function** current row se related rows ke ek set par ek calculation karता hai, aur **har row ke liye ek value** produce karता hai. \`GROUP BY\` ke ulta, jo ek group ko ek single output row mein fold karता hai, ek window function **sabhi rows ko jagah par chhod deता hai** aur bस ek computed column add karता hai.

Koi bhi aggregate (\`sum\`, \`avg\`, \`count\`, ...) ek window function ban jaता hai jab aap iske baad \`OVER (...)\` lगाते ho. **Window-only functions** bhi hain: \`row_number\`, \`rank\`, \`dense_rank\`, \`ntile\`, \`lag\`, \`lead\`, \`first_value\`, \`last_value\`, \`nth_value\`.

## \`OVER (...)\` ki anatomy

\`\`\`
OVER (
  PARTITION BY expr    -- rows ko independent groups mein split karो (default: sab rows = ek window)
  ORDER BY expr        -- har partition ke andar rows order karो (ranking / running / offset ke liye zaroori)
  frame_clause         -- current ke aas-paas kaunसी rows "in scope" hain (Lesson 5)
)
\`\`\`

- **Koi \`PARTITION BY\` nahi** → window **poora result set** hai.
- **\`PARTITION BY region\`** → har region apna window; function har ek ke liye restart hoता hai.
- **\`OVER\` ke andar \`ORDER BY\`** query ke final \`ORDER BY\` se alag hai.
- **\`OVER ()\`** legal hai aur matlab "ek window, sab rows, unordered".

## Window functions kab chalते hain — aur \`WHERE\` mein kyun nahi

Logical processing order:

\`\`\`
FROM → WHERE → GROUP BY → HAVING → **window functions** → SELECT → ORDER BY → LIMIT
\`\`\`

Consequences:
1. **Aap ek window function ko \`WHERE\`, \`GROUP BY\`, ya \`HAVING\` mein reference nahi kar sakte** — wo abhi tak compute nahi hue.
2. Window wo rows dekhता hai **jo \`WHERE\` se bacheen**.
3. Agar query mein \`GROUP BY\` hai, window **grouped rows** dekhता hai.

**Ek window result par filter karne ke liye**, query ko ek subquery ya CTE mein wrap karो:

\`\`\`sql
SELECT * FROM (
  SELECT s.*, row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn FROM sales s
) ranked WHERE rn <= 3;
\`\`\`

(Snowflake / BigQuery / DuckDB ke paas ek \`QUALIFY\` clause hai. PostgreSQL ke paas nahi.)

## Window vs \`GROUP BY\`

| aap chahते ho | istemal |
|---|---|
| prati group ek row, detail rows gone | \`GROUP BY\` |
| har detail row, plus har ek par ek group-level number | window \`PARTITION BY\` ke saath |
| har row, plus ek running / positional value | window \`ORDER BY\` ke saath |
| ek rank, ek row number, "pichli row", "prati group top 3" | window (sirf windows ye kar sakte hain) |

## Cost

Ek window function ke liye rows ko \`PARTITION BY\` phir \`ORDER BY\` se **sorted** hona chahिए. Prati distinct window definition ek sort. Wahi \`OVER (...)\` share karne waali kई functions ek sort share karती hain — window ko naam do (Lesson 6).`,

    examples: [
      {
        title: 'OVER () and OVER (PARTITION BY) add group totals to every detail row',
        titleHi: 'OVER () aur OVER (PARTITION BY) har detail row par group totals add karte hain',
        code: `CREATE TABLE sales (id int, region text, product text, amt int);
INSERT INTO sales VALUES
  (1,'N','W',100),(2,'N','W',150),(3,'N','G',80),(7,'N','G',120),
  (4,'S','W',200),(5,'S','G',60),(6,'S','G',90),(8,'S','W',70);

SELECT region, product, amt,
       sum(amt) OVER ()                     AS grand_total,
       sum(amt) OVER (PARTITION BY region)  AS region_total,
       round(100.0 * amt / sum(amt) OVER (PARTITION BY region), 1) AS pct_of_region
FROM sales
ORDER BY region, id;`,
        output: ` region | product | amt | grand_total | region_total | pct_of_region
--------+---------+-----+-------------+--------------+---------------
 N      | W       | 100 | 870         | 450          | 22.2
 N      | W       | 150 | 870         | 450          | 33.3
 N      | G       | 80  | 870         | 450          | 17.8
 N      | G       | 120 | 870         | 450          | 26.7
 S      | W       | 200 | 870         | 420          | 47.6
 S      | G       | 60  | 870         | 420          | 14.3
 S      | G       | 90  | 870         | 420          | 21.4
 S      | W       | 70  | 870         | 420          | 16.7
(8 rows)`,
        explain: '`sum(amt) OVER ()` has no `PARTITION BY`, so the window is the whole table: `870` on every row. `sum(amt) OVER (PARTITION BY region)` restarts per region: `450` for every N row, `420` for every S row. Neither collapses a single row — all 8 detail rows survive, each now carrying group-level totals alongside its own `amt`. That is the defining trait of a window function versus `GROUP BY`.',
        explainHi: '`sum(amt) OVER ()` mein koi `PARTITION BY` nahi, to window poori table hai: har row par `870`. `sum(amt) OVER (PARTITION BY region)` prati region restart hoता hai: har N row ke liye `450`, har S row ke liye `420`. Koi bhi ek row collapse nahi karता — sabhi 8 detail rows bachती hain, har ek ab apne `amt` ke saath group-level totals le jाती hai. Yahi `GROUP BY` ke muकаble window function ki defining trait hai.',
      },
      {
        title: 'A window function in WHERE is an error; filter it in a subquery instead',
        titleHi: 'WHERE mein ek window function ek error hai; ise ek subquery mein filter karo',
        code: `CREATE TABLE sales (id int, region text, amt int);
INSERT INTO sales VALUES (1,'N',100),(2,'N',150),(3,'S',200),(4,'S',60);

-- WRONG: window functions cannot appear in WHERE
SELECT region, amt
FROM sales
WHERE row_number() OVER (ORDER BY amt DESC) <= 2;`,
        output: `[ERROR] window functions are not allowed in WHERE`,
        explain: 'Window functions are evaluated AFTER `WHERE` in the logical processing order, so at the point `WHERE` runs, `row_number()` has not been computed yet and cannot be referenced. PostgreSQL rejects it outright: `window functions are not allowed in WHERE`. The fix (next example) is to compute the window value in an inner query and filter on it one level out, where it is now an ordinary column.',
        explainHi: 'Window functions logical processing order mein `WHERE` ke BAAD evaluate hote hain, to jis point `WHERE` chalta hai, `row_number()` abhi tak compute nahi hua aur reference nahi kiya ja sakta. PostgreSQL ise seedhे reject karta hai. Fix (agla example) window value ko ek inner query mein compute karna aur ek level bahar filter karna hai.',
      },
      {
        title: 'The fix: compute the window in a subquery, filter the outer query',
        titleHi: 'Fix: window ko ek subquery mein compute karo, outer query filter karo',
        code: `CREATE TABLE sales (id int, region text, amt int);
INSERT INTO sales VALUES (1,'N',100),(2,'N',150),(3,'N',80),(4,'S',200),(5,'S',60),(6,'S',90);

SELECT region, amt, rn
FROM (
  SELECT region, amt,
         row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn
  FROM sales
) ranked
WHERE rn <= 2
ORDER BY region, rn;`,
        output: ` region | amt | rn
--------+-----+----
 N      | 150 | 1
 N      | 100 | 2
 S      | 200 | 1
 S      | 90  | 2
(4 rows)`,
        explain: 'The inner query computes `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` as an ordinary column `rn` for every row. The outer query then filters `WHERE rn <= 2` exactly like any other `WHERE` on a plain column, because at THIS level `rn` already exists — it was computed in the level below, not in this one. This subquery-wrapper pattern is how every window-based filter is written.',
        explainHi: 'Inner query `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` ko har row ke liye ek ordinary column `rn` ke roop mein compute karta hai. Outer query phir `WHERE rn <= 2` filter karta hai theek kisi doosre plain column ki tarah, kyunki IS level par `rn` pehle se exist karta hai — ye neeche ke level mein compute hua, isme nahi. Ye subquery-wrapper pattern har window-based filter likhne ka tarika hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "each order and what % of the customer's total it is" -- with GROUP BY
SELECT customer_id, order_id, amount / sum(amount) AS pct
FROM orders
GROUP BY customer_id;
-- ERROR: order_id and amount must appear in GROUP BY or an aggregate`,
        right: `SELECT customer_id, order_id, amount,
       round(100.0 * amount / sum(amount) OVER (PARTITION BY customer_id), 1) AS pct
FROM orders;`,
        why: 'The question wants one row per order, with a customer-level total used in a per-row calculation. GROUP BY is the wrong tool because it collapses each customer to a single row, so order_id and the individual amount have nowhere to go. A window aggregate, sum of amount OVER PARTITION BY customer_id, computes the same per-customer total but attaches it to every order row without removing any, so you can divide each order amount by it. That is the defining use of window functions: a group-level value alongside the detail.',
        whyHi: 'Sawaal prati order ek row chahता hai, ek customer-level total ke saath ek per-row calculation mein. GROUP BY galat tool hai kyunki ye har customer ko ek single row mein collapse karता hai. Ek window aggregate, sum of amount OVER PARTITION BY customer_id, wahi per-customer total compute karता hai par ise har order row par attach karता hai bina kisi ko hataye.',
      },
      {
        wrong: `-- "only the top 3 sales per region"
SELECT region, product, amt,
       rank() OVER (PARTITION BY region ORDER BY amt DESC) AS r
FROM sales
WHERE rank() OVER (PARTITION BY region ORDER BY amt DESC) <= 3;
-- ERROR: window functions are not allowed in WHERE`,
        right: `SELECT region, product, amt, r
FROM (
  SELECT region, product, amt,
         rank() OVER (PARTITION BY region ORDER BY amt DESC) AS r
  FROM sales
) s
WHERE r <= 3;`,
        why: 'Window functions are computed after WHERE in the logical processing order, so at the point WHERE runs, the rank does not exist yet and cannot be referenced. The standard fix is to compute the window column in an inner query or CTE and apply the filter one level out, where the column now exists as an ordinary value. Some analytics databases provide a QUALIFY clause that filters on window results in the same SELECT, but PostgreSQL does not, so the subquery wrapper is the portable pattern.',
        whyHi: 'Window functions logical processing order mein WHERE ke baad compute hote hain, to jis point WHERE chalता hai, rank abhi tak exist nahi karता. Standard fix window column ko ek inner query ya CTE mein compute karna aur filter ko ek level bahar apply karna hai. Kuch analytics databases ek QUALIFY clause dete hain, par PostgreSQL nahi, to subquery wrapper portable pattern hai.',
      },
      {
        wrong: `-- expecting the running total to ignore the WHERE filter
SELECT sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS running
FROM sales
WHERE region = 'N';
-- the running total is over region N only -- WHERE runs BEFORE the window`,
        right: `-- if that is what you want, fine. If you want the running total over ALL regions
-- but only DISPLAY region N, filter in an outer query:
SELECT * FROM (
  SELECT region, sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS running FROM sales
) s
WHERE region = 'N';`,
        why: 'WHERE is applied before window functions are evaluated, so the window only ever sees the rows that passed the filter. A running total with a WHERE region equals N is a running total within region N, not within all sales. If the intent really is a global running total shown for a subset of rows, you must compute the window over the unfiltered set in an inner query and then filter the rows you want to display in the outer query. Being explicit about the order, filter then window, or window then filter, is the key.',
        whyHi: 'WHERE window functions evaluate hone se pehle apply hoता hai, to window sirf wo rows dekhता hai jo filter pass karती hain. WHERE region equals N ke saath ek running total region N ke andar ek running total hai, sabhi sales ke andar nahi. Agar intent sach mein ek global running total hai jo rows ke ek subset ke liye dikhाya gaya, aapको window ko unfiltered set par ek inner query mein compute karna hoga aur phir outer query mein rows filter karnी hongi.',
      },
    ],

    realWorld: [
      {
        en: '**A "% of category revenue" column on a product report: `amt / sum(amt) OVER (PARTITION BY category)`** — every product row kept, each showing its share of its category.',
        hi: '**Ek product report par ek "% of category revenue" column: `amt / sum(amt) OVER (PARTITION BY category)`**.',
      },
      {
        en: '**Top-N-per-group as a CTE: `WITH ranked AS (SELECT *, row_number() OVER (PARTITION BY user_id ORDER BY created_at DESC) rn FROM event) SELECT * FROM ranked WHERE rn <= 5`** — the 5 most recent events per user.',
        hi: '**Top-N-per-group ek CTE ke roop mein** — prati user 5 sabse recent events.',
      },
      {
        en: '**A dashboard tile that runs one query with `sum(revenue) OVER ()` for the denominator** instead of a second query for the total — one scan, no risk the two numbers disagree.',
        hi: '**Ek dashboard tile jo denominator ke liye `sum(revenue) OVER ()` ke saath ek query chalाता hai** — ek scan.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a window function, and how does it differ from `GROUP BY`?',
        qHi: 'Ek window function kya hai, aur ye `GROUP BY` se kaise alag hai?',
        a: 'A window function computes a value across a set of rows related to the current row and returns one result for every row, without collapsing anything. GROUP BY takes a group of rows and folds it into a single output row, so the individual rows are gone; a window function leaves every row in place and just adds a computed column. Any aggregate becomes a window function when followed by OVER with a window specification, and there are also window-only functions like row_number, rank, lag, and lead. The OVER clause has three parts: PARTITION BY, which splits the rows into independent groups, defaulting to the whole result set; ORDER BY, which orders rows within each partition and is what makes ranking, running totals, and offsets meaningful; and an optional frame clause that narrows the set of rows in scope around the current one. You use GROUP BY when you want one summary row per group and the detail is not needed, and a window function when you want to keep the detail rows and also show a group-level or positional value next to each, or when you need a rank, a row number, the previous row\'s value, or a top-N-per-group result, which only window functions can produce.',
        aHi: 'Ek window function current row se related rows ke ek set par ek value compute karता hai aur har row ke liye ek result lौtaता hai, bina kuch collapse kiye. GROUP BY rows ke ek group ko ek single output row mein fold karता hai, to individual rows chali jaती hain; ek window function har row ko jagah par chhodता hai aur bस ek computed column add karता hai. Koi bhi aggregate ek window function ban jaता hai jab iske baad OVER hoता hai. OVER clause ke teen hisse hain: PARTITION BY, ORDER BY, aur ek optional frame clause. Aap GROUP BY tab istemal karte ho jab aap prati group ek summary row chahते ho, aur ek window function tab jab aap detail rows rakhna chahते ho.',
      },
      {
        q: 'Why can\'t you use a window function in `WHERE`, and how do you filter on one?',
        qHi: 'Aap ek window function ko `WHERE` mein kyun istemal nahi kar sakte, aur aap ek par filter kaise karते ho?',
        a: 'The logical processing order of a query is FROM, then WHERE, then GROUP BY, then HAVING, then window functions, then the SELECT list, then ORDER BY, then LIMIT. Window functions are evaluated near the end, after WHERE and HAVING have already run. So at the moment WHERE is applied, no window function has been computed yet, and referencing one there is an error. This also means the window only ever sees the rows that survived WHERE, which is usually what you want but is worth being conscious of: a running total in a query with a WHERE is a running total over the filtered rows. To filter on a window result, you compute it in an inner query or a CTE, giving it a column alias, and then filter on that alias in the outer query, where it is now just an ordinary column. The canonical example is top-N-per-group: assign row_number partitioned by the group and ordered by the ranking key in a subquery, then select from that subquery where the row number is at most N. Some databases have a QUALIFY clause for filtering window results inline, but PostgreSQL does not.',
        aHi: 'Ek query ka logical processing order hai FROM, phir WHERE, phir GROUP BY, phir HAVING, phir window functions, phir SELECT list, phir ORDER BY, phir LIMIT. Window functions ant ke paas evaluate hote hain, WHERE aur HAVING ke pehle hi chal jaane ke baad. To jis pal WHERE apply hoता hai, koi window function abhi tak compute nahi hua, aur wahaan ek reference karna ek error hai. Ek window result par filter karne ke liye, aap ise ek inner query ya CTE mein compute karते ho, ise ek column alias dete ho, aur phir us alias par outer query mein filter karते ho. Canonical example top-N-per-group hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `emp(name text, dept text, salary int)` with 5 rows across 2 depts. Write one query returning every employee plus `dept_total` (`sum(salary) OVER (PARTITION BY dept)`) and `pct` (`round(100.0 * salary / dept_total, 1)`). Confirm all 5 rows are present (not collapsed) and each `pct` within a dept sums to ~100.',
        taskHi: 'Table `emp(name, dept, salary)` 2 depts par 5 rows ke saath. Ek query jo har employee plus `dept_total` aur `pct` lौtaती hai. Confirm sabhi 5 rows मौjood hain.',
        hint: '`sum(salary) OVER (PARTITION BY dept)` puts the dept total on every row without a `GROUP BY`. Repeat the window expression in the `pct` calc, or wrap in a subquery.',
        hintHi: '`sum(salary) OVER (PARTITION BY dept)` har row par dept total daalता hai bina `GROUP BY` ke.',
      },
      {
        task: 'Table `sale(region text, amt int)`. Try `SELECT region, amt FROM sale WHERE rank() OVER (ORDER BY amt DESC) <= 3` and observe the error. Then rewrite it with a CTE `ranked` and `WHERE r <= 3`. Confirm you get the 3 largest sales.',
        taskHi: 'Table `sale(region, amt)`. `SELECT region, amt FROM sale WHERE rank() OVER (ORDER BY amt DESC) <= 3` try karो aur error dekho. Phir ek CTE `ranked` se rewrite karो.',
        hint: 'The error is `window functions are not allowed in WHERE`. `WITH ranked AS (SELECT *, rank() OVER (ORDER BY amt DESC) AS r FROM sale) SELECT region, amt FROM ranked WHERE r <= 3`.',
        hintHi: 'Error `window functions are not allowed in WHERE` hai. `WITH ranked AS (...) SELECT ... WHERE r <= 3`.',
      },
      {
        task: 'Table `t(g text, n int)`. Write a query with `sum(n) OVER ()` and `sum(n) OVER (PARTITION BY g)` side by side. Insert rows for 2 groups and confirm `OVER ()` shows the same grand total on every row while `OVER (PARTITION BY g)` shows each group\'s subtotal.',
        taskHi: 'Table `t(g, n)`. `sum(n) OVER ()` aur `sum(n) OVER (PARTITION BY g)` side by side waali query likho.',
        hint: '`OVER ()` = the whole result set is one window -> constant on every row. `OVER (PARTITION BY g)` = one window per `g` value -> the value changes between groups but is constant within a group.',
        hintHi: '`OVER ()` = poora result set ek window -> har row par constant. `OVER (PARTITION BY g)` = prati `g` value ek window.',
      },
    ],

    keyTakeaways: [
      'A window function computes across a set of related rows but returns ONE value PER ROW — it does NOT collapse rows like `GROUP BY`. Any aggregate + `OVER (...)` becomes one; plus window-only functions: `row_number`, `rank`, `dense_rank`, `ntile`, `lag`, `lead`, `first_value`, `last_value`, `nth_value`.',
      '`OVER (PARTITION BY expr ORDER BY expr frame)`: no `PARTITION BY` -> the whole result set is one window. `PARTITION BY region` -> one window per region (function restarts). `ORDER BY` inside `OVER` is SEPARATE from the query\'s final `ORDER BY` — it orders rows FOR the calculation (needed for ranking / running totals / `lag`). `OVER ()` is valid.',
      'Processing order: `FROM`->`WHERE`->`GROUP BY`->`HAVING`->**window functions**->`SELECT`->`ORDER BY`->`LIMIT`. So a window function CANNOT appear in `WHERE`/`GROUP BY`/`HAVING` (`ERROR: window functions are not allowed in WHERE`), and the window only sees rows that SURVIVED `WHERE`.',
      'To FILTER on a window result: compute it in a subquery / CTE (as a column alias), then filter the outer query. Canonical: top-N-per-group = `row_number() OVER (PARTITION BY g ORDER BY key DESC)` in a subquery, then `WHERE rn <= N`. (PostgreSQL has no `QUALIFY`.)',
      'If the query has `GROUP BY`, the window sees the GROUPED rows — you can nest: `sum(sum(amt)) OVER ()` (Lesson 6).',
      'WINDOW vs `GROUP BY`: one row per group -> `GROUP BY`. Every detail row + a group-level number on each -> window `PARTITION BY`. Every row + a running/positional value -> window `ORDER BY`. A rank / row number / "previous row" / top-N-per-group -> window ONLY.',
      'COST: a window needs the rows SORTED by `PARTITION BY` then `ORDER BY` (one sort per distinct window spec). Functions sharing the SAME `OVER (...)` share one sort — name the window (Lesson 6). Windows don\'t multiply rows — usually cheaper than the equivalent self-join.',
    ],
    keyTakeawaysHi: [
      'Ek window function related rows ke ek set par compute karता hai par PRATI ROW EK value lौtaता hai — ye `GROUP BY` ki tarah rows COLLAPSE NAHI karता. Koi bhi aggregate + `OVER (...)` ek ban jaता hai; plus window-only functions.',
      '`OVER (PARTITION BY expr ORDER BY expr frame)`: koi `PARTITION BY` nahi -> poora result set ek window. `PARTITION BY region` -> prati region ek window. `OVER` ke andar `ORDER BY` query ke final `ORDER BY` se ALAG hai. `OVER ()` valid hai.',
      'Processing order: `FROM`->`WHERE`->`GROUP BY`->`HAVING`->**window functions**->`SELECT`->`ORDER BY`->`LIMIT`. Ek window function `WHERE`/`GROUP BY`/`HAVING` mein NAHI aa sakta, aur window sirf wo rows dekhता hai jo `WHERE` se BACHEEN.',
      'Ek window result par FILTER karne ke liye: ise ek subquery / CTE mein compute karो, phir outer query filter karो. Canonical: top-N-per-group = subquery mein `row_number() OVER (PARTITION BY g ORDER BY key DESC)`, phir `WHERE rn <= N`. (PostgreSQL mein `QUALIFY` nahi.)',
      'Agar query mein `GROUP BY` hai, window GROUPED rows dekhता hai — nest kar sakte ho: `sum(sum(amt)) OVER ()` (Lesson 6).',
      'WINDOW vs `GROUP BY`: prati group ek row -> `GROUP BY`. Har detail row + har ek par ek group-level number -> window `PARTITION BY`. Har row + ek running/positional value -> window `ORDER BY`. Ek rank / row number / "pichli row" -> SIRF window.',
      'COST: ek window ko `PARTITION BY` phir `ORDER BY` se SORTED rows chahिए. SAME `OVER (...)` share karne waali functions ek sort share karती hain — window ko naam do (Lesson 6).',
    ],
  },

  {
    slug: 'sql-ranking-functions',
    title: 'Ranking: row_number, rank, dense_rank, ntile',
    titleHi: 'Ranking: row_number, rank, dense_rank, ntile',
    description: '`row_number()` numbers rows 1, 2, 3 with no ties. `rank()` gives tied rows the same number and then skips (1, 1, 3). `dense_rank()` ties without skipping (1, 1, 2). `ntile(n)` splits rows into n buckets. All need `ORDER BY` inside `OVER`.',
    descriptionHi: '`row_number()` rows ko 1, 2, 3 number deता hai bina ties ke. `rank()` tied rows ko same number deता hai phir skip karता hai (1, 1, 3). `dense_rank()` bina skip kiye tie karता hai (1, 1, 2). `ntile(n)` rows ko n buckets mein split karता hai. Sabको `OVER` ke andar `ORDER BY` chahिए.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**Three ways to write finishing positions when two runners cross the line together, plus a way to split the field into groups.** Two runners tie for 2nd place. `row_number()` is the pragmatic race official who must hand out one bib number per runner regardless — someone is "2" and someone is "3", chosen arbitrarily. `rank()` is the formal record: both are "2nd", and the next runner is "4th" — the tie *consumed* the 3rd position. `dense_rank()` is the medal-tier view: both are on the "2nd" tier, and the next runner is on the "3rd" tier — no position is skipped, we are counting distinct tiers. `ntile(4)` is the coach dividing everyone who finished into four equal squads by finishing order — quartiles — regardless of times. You pick based on the question: "give me exactly the top 10 rows" wants `row_number`; "everyone in the top 3 *places*, ties included" wants `rank` or `dense_rank`; "split customers into spending deciles" wants `ntile(10)`.',
      hi: '**Do runners saath line cross karें to finishing positions likhne ke teen tarike, plus field ko groups mein split karne ka ek tarika.** Do runners 2nd place ke liye tie karते hain. `row_number()` pragmatic race official hai jise phir bhi prati runner ek bib number dena hai — koi "2" hai aur koi "3", arbitrarily chuna gaya. `rank()` formal record hai: dono "2nd" hain, aur agla runner "4th" hai — tie ne 3rd position *consume* kar li. `dense_rank()` medal-tier view hai: dono "2nd" tier par hain, aur agla runner "3rd" tier par — koi position skip nahi hui. `ntile(4)` coach hai jo sabко finishing order se chaar barabar squads mein divide karता hai. Aap sawaal ke aadhaar par chunते ho: "mujhe theek top 10 rows do" `row_number` chahता hai; "top 3 *places* mein sab, ties sहित" `rank` ya `dense_rank` chahता hai; "customers ko spending deciles mein split karो" `ntile(10)` chahता hai.',
    },

    simple: `**The three ranking functions, on scores \`90, 90, 80, 70\`**

\`\`\`sql
SELECT name, score,
  row_number() OVER (ORDER BY score DESC) AS rn,    -- 1, 2, 3, 4   (arbitrary tie-break)
  rank()       OVER (ORDER BY score DESC) AS rnk,   -- 1, 1, 3, 4   (skips after a tie)
  dense_rank() OVER (ORDER BY score DESC) AS drnk   -- 1, 1, 2, 3   (no skip)
FROM v;
\`\`\`

**\`ORDER BY\` inside \`OVER\` is required** — without it there is no "first"

\`\`\`sql
row_number() OVER (ORDER BY created_at)             -- ok
row_number() OVER ()                                -- allowed but order is arbitrary
\`\`\`

**\`PARTITION BY\` restarts the numbering per group**

\`\`\`sql
row_number() OVER (PARTITION BY region ORDER BY amt DESC)   -- 1,2,3.. within each region
\`\`\`

**Top-N per group — the canonical pattern**

\`\`\`sql
SELECT * FROM (
  SELECT s.*,
         row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn
  FROM sales s
) t
WHERE rn <= 3;                 -- top 3 rows per region

-- use rank() instead of row_number() if you want ties to ALL be included
\`\`\`

**\`ntile(n)\` — split rows into \`n\` roughly-equal buckets**

\`\`\`sql
SELECT customer_id, spend,
       ntile(4) OVER (ORDER BY spend DESC) AS spend_quartile   -- 1 = top 25%
FROM customer_totals;
\`\`\`

**\`percent_rank()\` / \`cume_dist()\` — relative position as 0..1**

\`\`\`sql
percent_rank() OVER (ORDER BY score)   -- (rank - 1) / (rows - 1)
cume_dist()    OVER (ORDER BY score)   -- fraction of rows <= this row
\`\`\``,

    simpleHi: `**Teen ranking functions, scores \`90, 90, 80, 70\` par**

\`\`\`sql
SELECT name, score,
  row_number() OVER (ORDER BY score DESC) AS rn,    -- 1, 2, 3, 4   (arbitrary tie-break)
  rank()       OVER (ORDER BY score DESC) AS rnk,   -- 1, 1, 3, 4   (tie ke baad skip)
  dense_rank() OVER (ORDER BY score DESC) AS drnk   -- 1, 1, 2, 3   (koi skip nahi)
FROM v;
\`\`\`

**\`OVER\` ke andar \`ORDER BY\` zaroori hai** — iske bina koi "pehla" nahi

\`\`\`sql
row_number() OVER (ORDER BY created_at)             -- ok
row_number() OVER ()                                -- allowed par order arbitrary hai
\`\`\`

**\`PARTITION BY\` prati group numbering restart karता hai**

\`\`\`sql
row_number() OVER (PARTITION BY region ORDER BY amt DESC)   -- har region ke andar 1,2,3..
\`\`\`

**Top-N per group — canonical pattern**

\`\`\`sql
SELECT * FROM (
  SELECT s.*,
         row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn
  FROM sales s
) t
WHERE rn <= 3;                 -- prati region top 3 rows

-- row_number() ke bजाy rank() istemal karो agar aap chahते ho ties SAB include hon
\`\`\`

**\`ntile(n)\` — rows ko \`n\` roughly-equal buckets mein split karो**

\`\`\`sql
SELECT customer_id, spend,
       ntile(4) OVER (ORDER BY spend DESC) AS spend_quartile   -- 1 = top 25%
FROM customer_totals;
\`\`\`

**\`percent_rank()\` / \`cume_dist()\` — relative position 0..1 ke roop mein**

\`\`\`sql
percent_rank() OVER (ORDER BY score)   -- (rank - 1) / (rows - 1)
cume_dist()    OVER (ORDER BY score)   -- rows ka fraction jo <= is row
\`\`\``,

    content: `## The three ranking functions

All three assign a position based on the \`ORDER BY\` inside \`OVER\`. They differ only in how they handle **ties** (rows with equal \`ORDER BY\` values):

| function | scores \`90, 90, 80, 70\` | rule |
|---|---|---|
| \`row_number()\` | \`1, 2, 3, 4\` | every row a distinct number; ties broken **arbitrarily** |
| \`rank()\` | \`1, 1, 3, 4\` | tied rows get the **same** rank; the next rank **skips** by the tie size |
| \`dense_rank()\` | \`1, 1, 2, 3\` | tied rows get the same rank; the next rank is **+1**, no gap |

- **\`row_number()\`** — use when you need a **unique sequential number** and do not care which of two equal rows comes first (pagination, "pick exactly one per group", numbering for display). If you need determinism across runs, add a tiebreaker column to the \`ORDER BY\` (e.g. \`ORDER BY score DESC, id\`).
- **\`rank()\`** — use when the output should reflect **competition ranking**: two people in 1st place, next person is 3rd. "Skips" are meaningful (they tell you how many were ahead).
- **\`dense_rank()\`** — use when you want **rank as a category counter**: distinct tiers, no gaps. "The 2nd-highest distinct salary" is \`dense_rank() = 2\`.

## \`ORDER BY\` is essential

Ranking functions **require** an \`ORDER BY\` inside \`OVER\` to be meaningful. \`row_number() OVER ()\` is technically allowed but the order is unspecified — never rely on it. \`rank()\` / \`dense_rank()\` without \`ORDER BY\` error in most databases.

The \`OVER\`'s \`ORDER BY\` is **independent** of the query's outer \`ORDER BY\`. It is common (and clearest) to make them match, but you can rank by one thing and display sorted by another.

## \`PARTITION BY\` — rank within groups

\`row_number() OVER (PARTITION BY region ORDER BY amt DESC)\` numbers each region's rows separately, starting from 1 in every region. This is the engine of **top-N per group**.

## Top-N per group

The pattern (repeated from Lesson 1 because it is *the* reason to learn ranking):

\`\`\`sql
WITH ranked AS (
  SELECT s.*,
         row_number() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM product s
)
SELECT * FROM ranked WHERE rn <= 3;
\`\`\`

- Use **\`row_number()\`** for "**at most** 3 rows per group" (arbitrary among ties at the boundary).
- Use **\`rank()\`** for "the top 3 **prices**, including every product tied at 3rd" — the result may have more than 3 rows per group.
- \`LATERAL\` with \`LIMIT\` (Module 3) is an alternative that can be faster with the right index.

## \`ntile(n)\` — bucketing

\`ntile(n)\` divides the ordered rows into \`n\` groups as equal in size as possible, labelling them \`1..n\`. If the row count is not divisible by \`n\`, the **earlier** buckets get one extra row. Uses: quartiles/deciles of a metric, splitting a work queue into \`n\` shards, A/B-style cohorting by rank.

\`\`\`sql
SELECT user_id, total_spend,
       ntile(10) OVER (ORDER BY total_spend DESC) AS spend_decile   -- 1 = top 10% of spenders
FROM lifetime_value;
\`\`\`

## \`percent_rank()\` and \`cume_dist()\`

Both express a row's relative position as a fraction in \`[0, 1]\`:

- **\`percent_rank()\`** = \`(rank() - 1) / (total_rows - 1)\` — the first row is always \`0\`, the last always \`1\`.
- **\`cume_dist()\`** = \`(number of rows with an ORDER BY value ≤ this row) / total_rows\` — "what fraction of the data is at or below me".

Use them for "this student scored better than 85% of the class" style statements.

## Gotchas

- **\`row_number()\` is non-deterministic across ties** unless the \`ORDER BY\` is a total order. For reproducible pagination, always include a unique column last in the \`ORDER BY\`.
- Filtering \`WHERE rn = 1\` gives "one row per group" — but with \`row_number()\` you get an arbitrary one among ties. Use \`ORDER BY ..., tiebreaker\` to make it deterministic, or \`rank() = 1\` if you want all tied winners.
- \`ntile\` needs the whole partition sorted and counted — on huge partitions it is not free.`,

    contentHi: `## Teen ranking functions

Teenों \`OVER\` ke andar \`ORDER BY\` ke aadhaar par ek position assign karते hain. Wo sirf **ties** handle karne mein alag hain:

| function | scores \`90, 90, 80, 70\` | niyam |
|---|---|---|
| \`row_number()\` | \`1, 2, 3, 4\` | har row ek distinct number; ties **arbitrarily** break |
| \`rank()\` | \`1, 1, 3, 4\` | tied rows ko **same** rank; agla rank tie size se **skip** karता hai |
| \`dense_rank()\` | \`1, 1, 2, 3\` | tied rows ko same rank; agla rank **+1**, koi gap nahi |

- **\`row_number()\`** — jab aapको ek **unique sequential number** chahिए (pagination, "prati group theek ek chuno"). Determinism ke liye \`ORDER BY\` mein ek tiebreaker column add karो.
- **\`rank()\`** — jab output **competition ranking** reflect kare: 1st place mein do log, agला vyakti 3rd.
- **\`dense_rank()\`** — jab aap **rank ko ek category counter** ke roop mein chahते ho: "2nd-highest distinct salary" \`dense_rank() = 2\` hai.

## \`ORDER BY\` zaroori hai

Ranking functions ko meaningful hone ke liye \`OVER\` ke andar ek \`ORDER BY\` **chahिए**. \`row_number() OVER ()\` technically allowed hai par order unspecified hai.

## \`PARTITION BY\` — groups ke andar rank

\`row_number() OVER (PARTITION BY region ORDER BY amt DESC)\` har region ki rows ko alag number deता hai, har region mein 1 se shuru. Ye **top-N per group** ka engine hai.

## Top-N per group

\`\`\`sql
WITH ranked AS (
  SELECT s.*, row_number() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM product s
)
SELECT * FROM ranked WHERE rn <= 3;
\`\`\`

- "**zyada se zyada** 3 rows per group" ke liye **\`row_number()\`**.
- "top 3 **prices**, 3rd par tied har product sहित" ke liye **\`rank()\`** — result mein 3 se zyada rows per group ho sakती hain.

## \`ntile(n)\` — bucketing

\`ntile(n)\` ordered rows ko \`n\` groups mein divide karता hai jitne size mein barabar ho sake, \`1..n\` label karके. Agar row count \`n\` se divisible nahi hai, **earlier** buckets ko ek extra row milती hai.

## \`percent_rank()\` aur \`cume_dist()\`

Dono ek row ki relative position ko \`[0, 1]\` mein ek fraction ke roop mein express karते hain.
- **\`percent_rank()\`** = \`(rank() - 1) / (total_rows - 1)\`.
- **\`cume_dist()\`** = \`(is row ke ORDER BY value <= waali rows ki sankhya) / total_rows\`.

## Gotchas

- **\`row_number()\` ties ke across non-deterministic hai** jab tak \`ORDER BY\` ek total order na ho. Reproducible pagination ke liye, hamesha \`ORDER BY\` mein last ek unique column include karो.
- \`WHERE rn = 1\` "prati group ek row" deता hai — par \`row_number()\` ke saath aapको ties mein se ek arbitrary milती hai.`,

    examples: [
      {
        title: 'row_number vs rank vs dense_rank on tied scores',
        titleHi: 'Tied scores par row_number vs rank vs dense_rank',
        code: `WITH v(name, score) AS (
  VALUES ('a', 90), ('b', 90), ('c', 80), ('d', 70)
)
SELECT name, score,
  row_number() OVER (ORDER BY score DESC) AS rn,
  rank()       OVER (ORDER BY score DESC) AS rnk,
  dense_rank() OVER (ORDER BY score DESC) AS drnk
FROM v
ORDER BY score DESC, name;`,
        output: ` name | score | rn | rnk | drnk
------+-------+----+-----+------
 a    | 90    | 1  | 1   | 1
 b    | 90    | 2  | 1   | 1
 c    | 80    | 3  | 3   | 2
 d    | 70    | 4  | 4   | 3
(4 rows)`,
        explain: 'On scores `90, 90, 80, 70`: `row_number()` gives every row a distinct number (`1,2,3,4`), breaking the 90/90 tie arbitrarily. `rank()` gives both 90s rank `1`, then SKIPS to `3` for the next row (the tie occupied two slots). `dense_rank()` also gives both 90s rank `1` but does NOT skip — the next distinct score gets `2`.',
        explainHi: 'Scores `90, 90, 80, 70` par: `row_number()` har row ko ek distinct number deta hai (`1,2,3,4`), 90/90 tie ko arbitrarily break karke. `rank()` dono 90s ko rank `1` deta hai, phir agli row ke liye `3` par SKIP karta hai (tie ne do slots occupy kiye). `dense_rank()` bhi dono 90s ko rank `1` deta hai par SKIP NAHI karta — agli distinct score `2` paati hai.',
      },
      {
        title: 'Top-2 per region: row_number in a subquery, then WHERE rn <= 2',
        titleHi: 'Prati region top-2: subquery mein row_number, phir WHERE rn <= 2',
        code: `CREATE TABLE sales (region text, product text, amt int);
INSERT INTO sales VALUES
  ('N','W',100),('N','W',150),('N','G',80),('N','G',120),
  ('S','W',200),('S','G',60),('S','G',90),('S','W',70);

SELECT region, product, amt
FROM (
  SELECT region, product, amt,
         row_number() OVER (PARTITION BY region ORDER BY amt DESC) AS rn
  FROM sales
) t
WHERE rn <= 2
ORDER BY region, amt DESC;`,
        output: ` region | product | amt
--------+---------+-----
 N      | W       | 150
 N      | G       | 120
 S      | W       | 200
 S      | G       | 90
(4 rows)`,
        explain: "The inner subquery numbers each region's rows independently by `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` — restarting at 1 for every region. The outer `WHERE rn <= 2` keeps the top 2 amounts per region: `150, 120` for N and `200, 90` for S. Using `row_number()` gives EXACTLY 2 rows per region even if there were a tie at the boundary.",
        explainHi: 'Inner subquery har region ki rows ko `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` se independently number karta hai — har region ke liye 1 se restart. Outer `WHERE rn <= 2` prati region top 2 amounts rakhta hai: N ke liye `150, 120` aur S ke liye `200, 90`. `row_number()` istemal karna prati region THEEK 2 rows deta hai, boundary par ek tie hone par bhi.',
      },
      {
        title: 'ntile(2) splits 5 rows into buckets of 3 and 2 (earlier bucket bigger)',
        titleHi: 'ntile(2) 5 rows ko 3 aur 2 ke buckets mein split karta hai',
        code: `WITH v(name, score) AS (
  VALUES ('a', 10), ('b', 20), ('c', 30), ('d', 40), ('e', 50)
)
SELECT name, score,
       ntile(2) OVER (ORDER BY score) AS half,
       ntile(3) OVER (ORDER BY score) AS third
FROM v
ORDER BY score;`,
        output: ` name | score | half | third
------+-------+------+-------
 a    | 10    | 1    | 1
 b    | 20    | 1    | 1
 c    | 30    | 1    | 2
 d    | 40    | 2    | 2
 e    | 50    | 2    | 3
(5 rows)`,
        explain: '`ntile(2)` splits 5 ordered rows into 2 buckets as evenly as possible: since `5 = 2*2 + 1`, the FIRST bucket gets the extra row (3 rows: a,b,c) and the second gets 2 (d,e). `ntile(3)` similarly splits 5 into 3 buckets of sizes 2,2,1 — the earlier buckets get the remainder. Neither depends on the VALUES, only on row position after `ORDER BY score`.',
        explainHi: '`ntile(2)` 5 ordered rows ko 2 buckets mein jitna ho sake barabar split karta hai: kyunki `5 = 2*2 + 1`, PEHLE bucket ko extra row milti hai (3 rows: a,b,c) aur doosre ko 2 (d,e). `ntile(3)` waise hi 5 ko 3 buckets mein 2,2,1 sizes mein split karta hai — earlier buckets ko remainder milta hai. Koi bhi VALUES par nirbhar nahi karta, sirf `ORDER BY score` ke baad row position par.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "the top 3 salaries in the company" -- using row_number
SELECT name, salary
FROM (SELECT name, salary, row_number() OVER (ORDER BY salary DESC) AS rn FROM emp) t
WHERE rn <= 3;
-- if the 3rd and 4th salaries are equal, one of them is arbitrarily excluded`,
        right: `SELECT name, salary
FROM (SELECT name, salary, rank() OVER (ORDER BY salary DESC) AS r FROM emp) t
WHERE r <= 3;
-- rank() keeps every employee tied at the 3rd-highest salary`,
        why: 'row_number assigns a distinct sequential number even to rows with identical ordering values, breaking the tie arbitrarily. If two employees earn the same salary that lands at position 3 and 4, filtering row_number at most 3 keeps one and drops the other, with no principled reason for the choice, and the result can change between runs. rank gives both tied rows the same rank, so filtering rank at most 3 includes everyone whose salary is among the three highest distinct-or-not values. Use row_number when you genuinely want a fixed count of rows and do not care about ties; use rank when the cutoff is a value threshold and ties should be kept together.',
        whyHi: 'row_number identical ordering values waali rows ko bhi ek distinct sequential number assign karता hai, tie arbitrarily break karके. Agar do employees same salary kamाते hain jo position 3 aur 4 par land karता hai, row_number at most 3 par filter karna ek rakhता hai aur doosre ko drop karता hai. rank dono tied rows ko same rank deता hai. row_number tab istemal karो jab aap sach mein ek fixed count of rows chahते ho; rank tab jab cutoff ek value threshold hai.',
      },
      {
        wrong: `-- deterministic pagination with row_number but a non-unique ORDER BY
SELECT * FROM (
  SELECT *, row_number() OVER (ORDER BY created_at) AS rn FROM article
) t
WHERE rn BETWEEN 21 AND 40;
-- if many articles share a created_at, the rows in a "page" shift between requests`,
        right: `SELECT * FROM (
  SELECT *, row_number() OVER (ORDER BY created_at, id) AS rn FROM article
) t
WHERE rn BETWEEN 21 AND 40;
-- add a unique column (id) so the ordering is total and stable`,
        why: 'row_number needs a total order to be reproducible. If the ORDER BY is only created_at and several rows share the same timestamp, the database is free to number those rows in any order, and it may choose differently on the next execution, so page 2 might repeat or skip rows relative to page 1. Adding a guaranteed-unique column such as the primary key as the final ORDER BY term makes the ordering total: every row has a distinct position, and the numbering is identical every time. This matters for any keyset or offset pagination built on row_number.',
        whyHi: 'row_number ko reproducible hone ke liye ek total order chahिए. Agar ORDER BY sirf created_at hai aur kई rows same timestamp share karती hain, database un rows ko kisi bhi order mein number kar sakता hai, aur agli execution par alag choose kar sakता hai. Primary key jaisा ek guaranteed-unique column final ORDER BY term ke roop mein add karna ordering ko total banाता hai.',
      },
      {
        wrong: `-- "which is the 2nd highest distinct salary" -- using rank
SELECT DISTINCT salary
FROM (SELECT salary, rank() OVER (ORDER BY salary DESC) AS r FROM emp) t
WHERE r = 2;
-- if the top salary is held by two people, rank() = 2 does not exist -- returns nothing`,
        right: `SELECT salary
FROM (SELECT DISTINCT salary, dense_rank() OVER (ORDER BY salary DESC) AS dr FROM emp) t
WHERE dr = 2;
-- dense_rank counts distinct values, so "2nd distinct salary" is always dr = 2`,
        why: 'rank leaves gaps after ties: if two employees share the highest salary, they are both rank 1 and the next distinct salary is rank 3, not 2, so filtering rank equals 2 returns an empty result. The question "second highest distinct salary" is about distinct values, which is exactly what dense_rank counts: it assigns 1 to the highest distinct salary, 2 to the next distinct one, with no gaps regardless of how many people hold each. So dense_rank equals 2 reliably identifies the second distinct salary. Use dense_rank whenever the rank is meant to be an index into distinct values.',
        whyHi: 'rank ties ke baad gaps chhodता hai: agar do employees highest salary share karते hain, wo dono rank 1 hain aur agली distinct salary rank 3 hai, 2 nahi. Sawaal "second highest distinct salary" distinct values ke baare mein hai, jo theek wahi hai jo dense_rank ginता hai: ye highest distinct salary ko 1 assign karता hai, agली distinct ko 2, bina gaps ke. dense_rank tab istemal karो jab rank distinct values mein ek index hona chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**"5 most recent orders per customer" as `row_number() OVER (PARTITION BY customer_id ORDER BY created_at DESC)` filtered `<= 5`** — the activity feed on an account page.',
        hi: '**"prati customer 5 sabse recent orders" `row_number() OVER (PARTITION BY customer_id ORDER BY created_at DESC)` `<= 5` filtered**.',
      },
      {
        en: '**Customer spend deciles: `ntile(10) OVER (ORDER BY lifetime_value DESC)`** feeding a marketing segmentation — decile 1 gets the VIP treatment.',
        hi: '**Customer spend deciles: `ntile(10) OVER (ORDER BY lifetime_value DESC)`** ek marketing segmentation feed karте hue.',
      },
      {
        en: '**Deduplication: `row_number() OVER (PARTITION BY email ORDER BY updated_at DESC)` then keep `rn = 1`** — collapse duplicate contact rows to the most recently updated one.',
        hi: '**Deduplication: `row_number() OVER (PARTITION BY email ORDER BY updated_at DESC)` phir `rn = 1` rakhो** — duplicate contact rows collapse.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the difference between `row_number()`, `rank()`, and `dense_rank()`.',
        qHi: '`row_number()`, `rank()`, aur `dense_rank()` mein antar samjhao.',
        a: 'All three assign a position to each row based on the ORDER BY inside the OVER clause, and they differ only in how they treat ties, meaning rows with equal ordering values. row_number always produces a distinct sequential number, one, two, three, and so on, so tied rows are numbered in some arbitrary order. rank gives tied rows the same number and then skips ahead: if two rows tie at position one, the next row is three, not two, because the tie occupied two slots. dense_rank also gives tied rows the same number but does not skip: after two rows at rank one, the next is rank two. The choice follows the question. Use row_number when you need a fixed number of rows and do not care which of two equals is first, for example paginating or taking at most N per group. Use rank when the output should read like competition standings, where skipped numbers convey how many competitors were ahead. Use dense_rank when the rank is really an index into distinct values, for instance finding the third-highest distinct price, where you do not want gaps.',
        aHi: 'Teenों OVER clause ke andar ORDER BY ke aadhaar par har row ko ek position assign karते hain, aur wo sirf ties treat karne mein alag hain. row_number hamesha ek distinct sequential number produce karता hai, to tied rows kisi arbitrary order mein numbered hoती hain. rank tied rows ko same number deता hai aur phir aage skip karता hai: agar do rows position one par tie karती hain, agली row three hai, two nahi. dense_rank bhi tied rows ko same number deता hai par skip nahi karता. Choice sawaal ke baad chalती hai. row_number tab jab aapको ek fixed number of rows chahिए. rank tab jab output competition standings ki tarah padhना chahिए. dense_rank tab jab rank distinct values mein ek index hai.',
      },
      {
        q: 'How do you get the top N rows per group in SQL?',
        qHi: 'Aap SQL mein prati group top N rows kaise laते ho?',
        a: 'The standard pattern uses a ranking window function. In a subquery or CTE, you select the rows and add a column that is row_number, or rank, over a window partitioned by the grouping column and ordered by whatever defines "top", descending. That numbers the rows one, two, three within each group independently. Then in the outer query you filter where that number is at most N. You cannot put the window function directly in the WHERE of the same select, because window functions are evaluated after WHERE, hence the subquery. The choice between row_number and rank matters at the boundary: row_number gives you exactly N rows per group, picking arbitrarily among ties at position N; rank gives you every row whose ranking value is among the top N, so a group with ties at the cutoff returns more than N rows. An alternative that can be faster when there is an index on the group and sort columns is a LATERAL join: for each group row, a subquery that selects from the detail table where it matches, ordered and limited to N. The LATERAL form lets the database stop after N rows per group using the index, rather than sorting the whole partition.',
        aHi: 'Standard pattern ek ranking window function istemal karता hai. Ek subquery ya CTE mein, aap rows select karते ho aur ek column add karते ho jo row_number, ya rank, hai, ek window par jo grouping column se partitioned aur "top" define karne waale se ordered hai, descending. Wo har group ke andar independently rows ko number deता hai. Phir outer query mein aap filter karते ho jahaan wo number at most N hai. Aap window function ko usi select ke WHERE mein seedhे nahi daal sakte. row_number aur rank ke beech choice boundary par maayne rakhती hai. Ek alternative jo faster ho sakता hai wo ek LATERAL join hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `score(player text, points int)` with points `100, 100, 90, 80, 80`. Write one query showing `player`, `points`, and all three of `row_number()`, `rank()`, `dense_rank()` ordered by points descending. Confirm: `rn` = 1..5, `rank` = 1,1,3,4,4, `dense_rank` = 1,1,2,3,3.',
        taskHi: 'Table `score(player, points)` points `100, 100, 90, 80, 80` ke saath. Ek query jo teenों ranking functions dikhाती hai. Confirm: `rn` = 1..5, `rank` = 1,1,3,4,4, `dense_rank` = 1,1,2,3,3.',
        hint: 'All three use `OVER (ORDER BY points DESC)`. `rank` skips to 3 after the two 100s and to 4 (well, stays consistent) — `dense_rank` never skips.',
        hintHi: 'Teenों `OVER (ORDER BY points DESC)` istemal karते hain. `rank` do 100s ke baad 3 par skip karता hai — `dense_rank` kabhi skip nahi karता.',
      },
      {
        task: 'Table `sale(region text, rep text, amt int)`. Return the single top sale per region using `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` in a CTE and `WHERE rn = 1`. Then change to `rank()` and add a tied top sale in one region — confirm `rank() = 1` returns both.',
        taskHi: 'Table `sale(region, rep, amt)`. Prati region single top sale `row_number() OVER (PARTITION BY region ORDER BY amt DESC)` se lao. Phir `rank()` par badlो aur ek region mein ek tied top sale add karो.',
        hint: '`WHERE rn = 1` with `row_number` -> exactly one row per region (arbitrary if tied). `WHERE r = 1` with `rank` -> all rows tied for the region max.',
        hintHi: '`row_number` ke saath `WHERE rn = 1` -> prati region theek ek row. `rank` ke saath `WHERE r = 1` -> region max par tied sab rows.',
      },
      {
        task: 'Table `customer(id int, spend int)` with 10 rows. Add `ntile(4) OVER (ORDER BY spend DESC) AS quartile`. Confirm quartiles 1 and 2 have 3 rows each and quartiles 3 and 4 have 2 each (10 not divisible by 4 -> earlier buckets bigger). Then add `percent_rank()` and note the top row is `0` and the bottom is `1`.',
        taskHi: 'Table `customer(id, spend)` 10 rows ke saath. `ntile(4) OVER (ORDER BY spend DESC) AS quartile` add karो. Confirm quartiles 1 aur 2 ke 3-3 rows hain, 3 aur 4 ke 2-2.',
        hint: '`ntile(4)` on 10 rows: `10 = 4*2 + 2`, so the first 2 buckets get 3 rows, the last 2 get 2. `percent_rank()` is `(rank-1)/(n-1)` so first = 0, last = 1.',
        hintHi: '10 rows par `ntile(4)`: `10 = 4*2 + 2`, to pehle 2 buckets ke 3 rows, aakhri 2 ke 2. `percent_rank()` first = 0, last = 1.',
      },
    ],

    keyTakeaways: [
      'On tied `ORDER BY` values: `row_number()` = `1,2,3,4` (distinct, ties broken ARBITRARILY). `rank()` = `1,1,3,4` (tied rows share a rank, next rank SKIPS by the tie size). `dense_rank()` = `1,1,2,3` (tied rows share, next rank is +1, NO gap).',
      '`row_number()` — unique sequential number; pagination, "at most N per group", dedup (`WHERE rn = 1`). Add a UNIQUE column last in `ORDER BY` (`ORDER BY x, id`) for a TOTAL order — otherwise the numbering is non-deterministic across runs.',
      '`rank()` — competition ranking (two in 1st -> next is 3rd; the skip tells you how many were ahead). `dense_rank()` — rank as a category counter / index into DISTINCT values ("2nd-highest distinct salary" = `dense_rank() = 2`; `rank() = 2` may not exist).',
      'Ranking functions REQUIRE `ORDER BY` inside `OVER` to be meaningful. The `OVER` `ORDER BY` is INDEPENDENT of the query\'s outer `ORDER BY`. `PARTITION BY region` restarts the numbering at 1 per region.',
      'TOP-N PER GROUP: `row_number() OVER (PARTITION BY g ORDER BY key DESC)` in a subquery/CTE, then `WHERE rn <= N`. Use `row_number()` for "AT MOST N rows"; use `rank()` for "top N VALUES, ties at the cutoff ALL included" (may return >N rows). `LATERAL` + `LIMIT` (Module 3) is a faster alternative with the right index.',
      '`ntile(n)` splits the ordered rows into `n` size-balanced buckets labelled `1..n`; if not divisible, EARLIER buckets get the extra row. Uses: quartiles/deciles, sharding a queue, cohorting.',
      '`percent_rank()` = `(rank()-1)/(rows-1)` (first row `0`, last `1`). `cume_dist()` = fraction of rows with an `ORDER BY` value `<=` this row. Both give relative position in `[0,1]` ("scored better than 85% of the class").',
    ],
    keyTakeawaysHi: [
      'Tied `ORDER BY` values par: `row_number()` = `1,2,3,4` (distinct, ties ARBITRARILY break). `rank()` = `1,1,3,4` (tied rows ek rank share karती hain, agla rank tie size se SKIP karता hai). `dense_rank()` = `1,1,2,3` (tied rows share, agla rank +1, KOI gap nahi).',
      '`row_number()` — unique sequential number; pagination, "at most N per group", dedup. `ORDER BY` mein last ek UNIQUE column add karो TOTAL order ke liye — warna numbering runs ke across non-deterministic hai.',
      '`rank()` — competition ranking. `dense_rank()` — rank ek category counter / DISTINCT values mein index ("2nd-highest distinct salary" = `dense_rank() = 2`; `rank() = 2` shायad exist na kare).',
      'Ranking functions ko `OVER` ke andar `ORDER BY` CHAHIYE. `OVER` ka `ORDER BY` query ke outer `ORDER BY` se INDEPENDENT hai. `PARTITION BY region` numbering ko prati region 1 par restart karता hai.',
      'TOP-N PER GROUP: subquery/CTE mein `row_number() OVER (PARTITION BY g ORDER BY key DESC)`, phir `WHERE rn <= N`. "AT MOST N rows" ke liye `row_number()`; "top N VALUES, cutoff par ties SAB included" ke liye `rank()`. `LATERAL` + `LIMIT` faster alternative.',
      '`ntile(n)` ordered rows ko `n` size-balanced buckets `1..n` mein split karता hai; divisible na ho to EARLIER buckets ko extra row milती hai.',
      '`percent_rank()` = `(rank()-1)/(rows-1)`. `cume_dist()` = `ORDER BY` value `<=` is row waali rows ka fraction. Dono `[0,1]` mein relative position dete hain.',
    ],
  },

  {
    slug: 'sql-lag-lead-and-offsets',
    title: 'lag, lead & Value-at-Offset',
    titleHi: 'lag, lead Aur Value-at-Offset',
    description: '`lag(col)` returns `col` from the PREVIOUS row in the window; `lead(col)` from the NEXT. With them you compute row-to-row change, growth rates, gaps between events, and "did this value change". `first_value` / `last_value` / `nth_value` fetch a value at a fixed position in the frame.',
    descriptionHi: '`lag(col)` window mein PICHLI row se `col` lौtaता hai; `lead(col)` AGLI se. Inse aap row-to-row change, growth rates, events ke beech gaps, aur "kya ye value badli" compute karते ho. `first_value` / `last_value` / `nth_value` frame mein ek fixed position par ek value fetch karते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Reading a bank statement line by line, with a finger on the line above and a finger on the line below.** For each transaction you want to know things that only make sense *in relation to its neighbours*: "how much did the balance change since the line above?" (that is `lag` — look back one row), "when is the next transaction, so how many days does this balance hold?" (that is `lead` — look forward one row). You are not summarising the statement; you are annotating each line with a fact borrowed from an adjacent line. `lag(x, 2)` reaches two lines back; `lag(x, 1, 0)` reaches back one line but, at the very top where there is no previous line, uses `0` instead of a blank. `first_value` and `last_value` are different: they jump to a fixed anchor — "the opening balance of this month", "the closing balance of this month" — rather than a relative step. The catch with `last_value` is that, by default, "the window so far" only extends down to the line your finger is currently on, so it returns the *current* line, not the true last line — you have to explicitly tell it to look all the way to the bottom.',
      hi: '**Ek bank statement line by line padhna, upar ki line par ek ungli aur neeche ki line par ek ungli ke saath.** Har transaction ke liye aap wo cheezें jaanna chahते ho jo sirf *iske neighbours ke sambandh mein* samajh aaती hain: "upar ki line se balance kitna badla?" (wo `lag` hai — ek row peeche dekho), "agla transaction kab hai, to ye balance kitne din tikता hai?" (wo `lead` hai). Aap statement summarise nahi kar rahe; aap har line ko ek adjacent line se udhaar li gayi fact se annotate kar rahe ho. `lag(x, 2)` do lines peeche pahunchता hai; `lag(x, 1, 0)` ek line peeche par, bilkul top par jahaan koi pichli line nahi, blank ke bजाy `0` istemal karता hai. `first_value` aur `last_value` alag hain: wo ek fixed anchor par jump karते hain. `last_value` ke saath catch ye hai ki, default se, "ab tak ka window" sirf us line tak extend hoता hai jispar aapki ungli abhi hai, to ye *current* line lौtaता hai, sacchi aakhri line nahi.',
    },

    simple: `**\`lag\` / \`lead\` — value from the previous / next row in the window**

\`\`\`sql
SELECT sold_on, amt,
  lag(amt)  OVER (ORDER BY sold_on) AS prev_amt,   -- NULL on the first row
  lead(amt) OVER (ORDER BY sold_on) AS next_amt,   -- NULL on the last row
  amt - lag(amt) OVER (ORDER BY sold_on) AS delta  -- row-to-row change
FROM sales;
\`\`\`

**Offset and default: \`lag(col, n, default)\`**

\`\`\`sql
lag(amt)          -- previous row, NULL if none
lag(amt, 3)       -- 3 rows back, NULL if none
lag(amt, 1, 0)    -- 1 row back, 0 (not NULL) if none  -- handy for  amt - lag(amt,1,0)
\`\`\`

**Growth rate / period-over-period**

\`\`\`sql
SELECT month, revenue,
  round(100.0 * (revenue - lag(revenue) OVER (ORDER BY month))
        / lag(revenue) OVER (ORDER BY month), 1) AS mom_growth_pct
FROM monthly;
\`\`\`

**Gap between events (per user)**

\`\`\`sql
SELECT user_id, event_at,
  event_at - lag(event_at) OVER (PARTITION BY user_id ORDER BY event_at) AS since_prev
FROM event;
\`\`\`

**\`first_value\` / \`last_value\` / \`nth_value\` — value at a position in the frame**

\`\`\`sql
first_value(amt) OVER (PARTITION BY region ORDER BY sold_on)   -- earliest sale amount
nth_value(amt, 2) OVER (PARTITION BY region ORDER BY sold_on)  -- 2nd sale amount (NULL until row 2)

-- last_value NEEDS an explicit full frame or it returns the CURRENT row:
last_value(amt) OVER (PARTITION BY region ORDER BY sold_on
                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
\`\`\``,

    simpleHi: `**\`lag\` / \`lead\` — window mein pichli / agli row se value**

\`\`\`sql
SELECT sold_on, amt,
  lag(amt)  OVER (ORDER BY sold_on) AS prev_amt,   -- pehli row par NULL
  lead(amt) OVER (ORDER BY sold_on) AS next_amt,   -- aakhri row par NULL
  amt - lag(amt) OVER (ORDER BY sold_on) AS delta  -- row-to-row change
FROM sales;
\`\`\`

**Offset aur default: \`lag(col, n, default)\`**

\`\`\`sql
lag(amt)          -- pichli row, koi nahi to NULL
lag(amt, 3)       -- 3 rows peeche
lag(amt, 1, 0)    -- 1 row peeche, koi nahi to 0 (NULL nahi)
\`\`\`

**Growth rate / period-over-period**

\`\`\`sql
SELECT month, revenue,
  round(100.0 * (revenue - lag(revenue) OVER (ORDER BY month))
        / lag(revenue) OVER (ORDER BY month), 1) AS mom_growth_pct
FROM monthly;
\`\`\`

**Events ke beech gap (prati user)**

\`\`\`sql
SELECT user_id, event_at,
  event_at - lag(event_at) OVER (PARTITION BY user_id ORDER BY event_at) AS since_prev
FROM event;
\`\`\`

**\`first_value\` / \`last_value\` / \`nth_value\` — frame mein ek position par value**

\`\`\`sql
first_value(amt) OVER (PARTITION BY region ORDER BY sold_on)   -- earliest sale amount
nth_value(amt, 2) OVER (PARTITION BY region ORDER BY sold_on)  -- 2nd sale amount (row 2 tak NULL)

-- last_value ko ek explicit full frame CHAHIYE ya ye CURRENT row lौtaता hai:
last_value(amt) OVER (PARTITION BY region ORDER BY sold_on
                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
\`\`\``,

    content: `## \`lag\` and \`lead\`

\`lag(expr [, offset [, default]])\` returns \`expr\` evaluated on the row \`offset\` positions **before** the current row within the window partition (ordered by the \`OVER\`'s \`ORDER BY\`). \`lead\` is the same but **after**.

- \`offset\` defaults to \`1\`.
- \`default\` (the value to use when the offset falls outside the partition) defaults to \`NULL\`.
- They respect \`PARTITION BY\` — \`lag\` does not read across a partition boundary; the first row of each partition has no predecessor.

\`\`\`sql
SELECT day, price,
  lag(price)        OVER (ORDER BY day) AS yesterday,
  price - lag(price) OVER (ORDER BY day) AS change,
  lead(price, 1, price) OVER (ORDER BY day) AS tomorrow_or_self
FROM quote;
\`\`\`

Common uses:

- **Row-to-row delta:** \`value - lag(value) OVER (ORDER BY t)\`.
- **Percent change / growth:** \`(v - lag(v)) / lag(v)\` — guard the divisor with \`nullif(lag(v), 0)\`.
- **Time between events:** \`t - lag(t) OVER (PARTITION BY user ORDER BY t)\` → an \`interval\`.
- **Did it change:** \`value IS DISTINCT FROM lag(value) OVER (...)\` → boolean.
- **Detecting runs / gaps:** compare \`lag\` to spot where a sequence breaks (the "gaps and islands" problem).

## \`first_value\`, \`last_value\`, \`nth_value\`

These return a value from a **specific position within the frame** (not a relative offset):

- \`first_value(expr)\` — \`expr\` from the **first** row of the frame.
- \`last_value(expr)\` — \`expr\` from the **last** row of the frame.
- \`nth_value(expr, n)\` — \`expr\` from the **nth** row of the frame (1-based); \`NULL\` if the frame has fewer than \`n\` rows.

## The \`last_value\` gotcha

When you write \`OVER (ORDER BY x)\` **without an explicit frame**, the default frame is \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` — i.e. "from the start of the partition **up to the current row**". So:

- \`first_value\` → correct (the first row is always in that frame).
- \`last_value\` → **the current row**, not the last row of the partition — because the frame ends at the current row!
- \`nth_value\` → \`NULL\` until the current row reaches position \`n\`.

To get the true last / nth value of the **whole partition**, set the frame explicitly:

\`\`\`sql
last_value(amt) OVER (
  PARTITION BY region ORDER BY sold_on
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
\`\`\`

Or, often simpler: \`first_value(amt) OVER (PARTITION BY region ORDER BY sold_on DESC)\` — flip the sort and take the first.

This frame subtlety is covered fully in Lesson 5; the practical rule for now: **\`last_value\` and \`nth_value\` almost always need an explicit \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\`.**

## \`lag\`/\`lead\` vs a self-join

Before window functions, "compare each row to the previous" meant a self-join on \`t.id = prev.id + 1\` (fragile if ids have gaps) or a correlated subquery finding \`max(t2.t) WHERE t2.t < t.t\` (slow). \`lag\` does it in one pass, correctly handles gaps, and is far faster. Reach for \`lag\`/\`lead\` whenever the logic is "this row relative to its neighbour in some order".

## \`IS DISTINCT FROM\` with \`lag\`

To flag rows where a value **changed** from the previous row, use \`IS DISTINCT FROM\` (not \`<>\`) so that \`NULL\` transitions are handled:

\`\`\`sql
SELECT *, status IS DISTINCT FROM lag(status) OVER (PARTITION BY ticket_id ORDER BY at) AS changed
FROM ticket_history;
\`\`\`

\`<>\` would give \`NULL\` (not \`true\`) when either side is \`NULL\` — including the first row of every partition.`,

    contentHi: `## \`lag\` aur \`lead\`

\`lag(expr [, offset [, default]])\` \`expr\` lौtaता hai jo current row se window partition ke andar \`offset\` positions **pehle** ki row par evaluate hoता hai. \`lead\` wahi par **baad**.

- \`offset\` default \`1\`.
- \`default\` (jab offset partition ke bahar girता hai) default \`NULL\`.
- Wo \`PARTITION BY\` respect karते hain — \`lag\` ek partition boundary ke across nahi padhता.

Common uses:
- **Row-to-row delta:** \`value - lag(value) OVER (ORDER BY t)\`.
- **Percent change:** \`(v - lag(v)) / lag(v)\` — divisor ko \`nullif(lag(v), 0)\` se guard karो.
- **Events ke beech time:** \`t - lag(t) OVER (PARTITION BY user ORDER BY t)\`.
- **Kya badla:** \`value IS DISTINCT FROM lag(value) OVER (...)\`.

## \`first_value\`, \`last_value\`, \`nth_value\`

Ye **frame ke andar ek specific position** se ek value lौtaते hain:
- \`first_value(expr)\` — frame ki **pehli** row se.
- \`last_value(expr)\` — frame ki **aakhri** row se.
- \`nth_value(expr, n)\` — frame ki **nth** row se (1-based).

## \`last_value\` gotcha

Jab aap \`OVER (ORDER BY x)\` **bina explicit frame** likhते ho, default frame \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` hai — yaani "partition ke start se **current row tak**". To:
- \`first_value\` → sahi.
- \`last_value\` → **current row**, partition ki aakhri row nahi — kyunki frame current row par khatm hoता hai!
- \`nth_value\` → \`NULL\` jab tak current row position \`n\` par na pahunchे.

Poore partition ka sacchा last / nth value paane ke liye, frame explicitly set karो:

\`\`\`sql
last_value(amt) OVER (
  PARTITION BY region ORDER BY sold_on
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
\`\`\`

Ya aksar simpler: \`first_value(amt) OVER (PARTITION BY region ORDER BY sold_on DESC)\`.

Practical rule: **\`last_value\` aur \`nth_value\` ko lगभग hamesha ek explicit \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` chahिए.**

## \`lag\`/\`lead\` vs ek self-join

Window functions se pehle, "har row ko pichli se compare karो" ka matlab ek self-join tha (ids mein gaps ho to fragile) ya ek correlated subquery (slow). \`lag\` ise ek pass mein karता hai.

## \`lag\` ke saath \`IS DISTINCT FROM\`

Un rows ko flag karne ke liye jahaan ek value pichli row se **badli**, \`IS DISTINCT FROM\` istemal karो (\`<>\` nahi):

\`\`\`sql
SELECT *, status IS DISTINCT FROM lag(status) OVER (PARTITION BY ticket_id ORDER BY at) AS changed
FROM ticket_history;
\`\`\`

\`<>\` \`NULL\` deता (\`true\` nahi) jab koi bhi side \`NULL\` hai — har partition ki pehli row sहित.`,

    examples: [
      {
        title: 'lag / lead with offset and default, and a row-to-row delta',
        titleHi: 'Offset aur default ke saath lag / lead, aur ek row-to-row delta',
        code: `SET TIME ZONE 'UTC';
CREATE TABLE sales (region text, amt int, sold_on date);
INSERT INTO sales VALUES
  ('N',100,'2026-01-05'),('N',150,'2026-01-12'),('N',80,'2026-01-20'),('N',120,'2026-02-02');

SELECT sold_on::text AS sold_on, amt,
  lag(amt)          OVER (ORDER BY sold_on) AS prev_amt,
  lag(amt, 1, 0)    OVER (ORDER BY sold_on) AS prev_or_zero,
  lead(amt)         OVER (ORDER BY sold_on) AS next_amt,
  amt - lag(amt)    OVER (ORDER BY sold_on) AS delta
FROM sales
ORDER BY sold_on;`,
        output: ` sold_on    | amt | prev_amt | prev_or_zero | next_amt | delta
------------+-----+----------+--------------+----------+-------
 2026-01-05 | 100 | NULL     | 0            | 150      | NULL
 2026-01-12 | 150 | 100      | 100          | 80       | 50
 2026-01-20 | 80  | 150      | 150          | 120      | -70
 2026-02-02 | 120 | 80       | 80           | NULL     | 40
(4 rows)`,
        explain: '`lag(amt)` reaches back one row in `sold_on` order; the first row has no predecessor so it is `NULL`. `lag(amt, 1, 0)` substitutes `0` instead, useful when the first-row delta should compute as a number. `lead(amt)` looks forward, `NULL` on the last row. `amt - lag(amt)` gives the row-to-row change (`NULL` on row 1, then `50, -70, 40`).',
        explainHi: '`lag(amt)` `sold_on` order mein ek row peeche pahunchta hai; pehli row ka koi predecessor nahi to ye `NULL` hai. `lag(amt, 1, 0)` iske bजाy `0` substitute karta hai. `lead(amt)` aage dekhta hai, aakhri row par `NULL`. `amt - lag(amt)` row-to-row change deta hai (row 1 par `NULL`, phir `50, -70, 40`).',
      },
      {
        title: 'The last_value gotcha: default frame returns the current row',
        titleHi: 'last_value gotcha: default frame current row lौtaता hai',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES ('N',80),('N',100),('N',120),('N',150);

SELECT amt,
  first_value(amt) OVER w AS fv,
  last_value(amt)  OVER w AS lv_default_frame,     -- WRONG: this is the current row
  last_value(amt)  OVER (ORDER BY amt
                         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lv_full_frame
FROM sales
WINDOW w AS (ORDER BY amt)
ORDER BY amt;`,
        output: ` amt | fv | lv_default_frame | lv_full_frame
-----+----+------------------+---------------
 80  | 80 | 80               | 150
 100 | 80 | 100              | 150
 120 | 80 | 120              | 150
 150 | 80 | 150              | 150
(4 rows)`,
        explain: "With `OVER (ORDER BY amt)` and no explicit frame, the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — so `first_value` correctly finds the smallest amount (`80`) but `last_value` returns the CURRENT row's own amount on every row (the frame ends there). Widening the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` fixes it, giving the true partition maximum (`150`) on every row.",
        explainHi: '`OVER (ORDER BY amt)` aur bina explicit frame ke, default frame `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` hai — to `first_value` sahi se sabse chhota amount (`80`) dhoondta hai par `last_value` har row par CURRENT row ka apna amount lौtaता hai (frame wahaan khatm hota hai). Frame ko `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` tak chौda karna ise fix karta hai.',
      },
      {
        title: 'Flag rows where a status changed from the previous row',
        titleHi: 'Un rows ko flag karo jahaan status pichli row se badla',
        code: `CREATE TABLE hist (ticket int, at int, status text);
INSERT INTO hist VALUES
  (1,1,'open'),(1,2,'open'),(1,3,'pending'),(1,4,'pending'),(1,5,'closed');

SELECT at, status,
  lag(status) OVER (PARTITION BY ticket ORDER BY at) AS prev_status,
  status IS DISTINCT FROM lag(status) OVER (PARTITION BY ticket ORDER BY at) AS changed
FROM hist
ORDER BY at;`,
        output: ` at | status  | prev_status | changed
----+---------+-------------+---------
 1  | open    | NULL        | t
 2  | open    | open        | f
 3  | pending | open        | t
 4  | pending | pending     | f
 5  | closed  | pending     | t
(5 rows)`,
        explain: "`lag(status) OVER (PARTITION BY ticket ORDER BY at)` fetches the previous row's status within the same ticket. `status IS DISTINCT FROM lag(status)` is `true` whenever the value differs from the row before — including row 1, where `lag` is `NULL` and `'open' IS DISTINCT FROM NULL` is correctly `true` (a plain `<>` would have given `NULL` there instead).",
        explainHi: "`lag(status) OVER (PARTITION BY ticket ORDER BY at)` usi ticket ke andar pichli row ka status fetch karta hai. `status IS DISTINCT FROM lag(status)` `true` hai jab bhi value pichli row se alag hai — row 1 sहित, jahaan `lag` `NULL` hai aur `'open' IS DISTINCT FROM NULL` sahi se `true` hai (ek plain `<>` wahaan `NULL` deta).",
      },
    ],

    mistakes: [
      {
        wrong: `-- "the closing price of each stock" using last_value with the default frame
SELECT symbol, day, price,
  last_value(price) OVER (PARTITION BY symbol ORDER BY day) AS closing_price
FROM quote;
-- closing_price equals the CURRENT row's price on every row, not the final day's price`,
        right: `SELECT symbol, day, price,
  last_value(price) OVER (
    PARTITION BY symbol ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS closing_price
FROM quote;
-- or: first_value(price) OVER (PARTITION BY symbol ORDER BY day DESC)`,
        why: 'When an OVER clause has an ORDER BY but no explicit frame, the frame defaults to everything from the start of the partition up to and including the current row. first_value is unaffected because the first row is always inside that frame, but last_value returns the last row of the frame, which is the current row, so on every row it just echoes that row\'s own price. To get the actual final value you must widen the frame to the whole partition with ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING, or flip the sort to descending and use first_value, which is often clearer.',
        whyHi: 'Jab ek OVER clause mein ORDER BY hai par koi explicit frame nahi, frame default se partition ke start se current row tak sab kuch hai. first_value affected nahi kyunki pehli row hamesha us frame ke andar hai, par last_value frame ki aakhri row lौtaता hai, jo current row hai. Actual final value paane ke liye aapको frame ko poore partition tak ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING se chौda karna hoga.',
      },
      {
        wrong: `-- percent growth, dividing by lag without guarding
SELECT month, revenue,
  (revenue - lag(revenue) OVER (ORDER BY month)) / lag(revenue) OVER (ORDER BY month) AS growth
FROM monthly;
-- first row: lag is NULL -> growth is NULL (ok). But if any month has revenue 0 -> divide by zero`,
        right: `SELECT month, revenue,
  round(
    (revenue - lag(revenue) OVER (ORDER BY month))
      / nullif(lag(revenue) OVER (ORDER BY month), 0), 3
  ) AS growth
FROM monthly;`,
        why: 'lag returns NULL for the first row of the partition, and dividing by NULL yields NULL, which is usually an acceptable "no prior period" marker. The real hazard is a prior period whose value is exactly zero: dividing by it raises a division-by-zero error and aborts the query. Wrapping the divisor in nullif of the lag value and zero converts a zero denominator to NULL, so that row produces a NULL growth rather than an exception. Any ratio built on lag or lead should guard the denominator this way.',
        whyHi: 'lag partition ki pehli row ke liye NULL lौtaता hai, aur NULL se divide karna NULL deता hai, jo aksar ek acceptable "koi prior period nahi" marker hai. Asli khatra ek prior period hai jiska value theek zero hai: isse divide karna ek division-by-zero error raise karता hai. Divisor ko nullif of lag value aur zero mein wrap karna ek zero denominator ko NULL mein convert karता hai.',
      },
      {
        wrong: `-- detect status changes with <>
SELECT at, status,
  status <> lag(status) OVER (PARTITION BY id ORDER BY at) AS changed
FROM history;
-- the first row of every partition has lag = NULL, so  status <> NULL  is NULL, not true`,
        right: `SELECT at, status,
  status IS DISTINCT FROM lag(status) OVER (PARTITION BY id ORDER BY at) AS changed
FROM history;`,
        why: 'The not-equal operator returns NULL, not true or false, whenever either operand is NULL. On the first row of each partition lag has no previous row and returns NULL, so status not-equal NULL is NULL, and the row is not flagged as changed even though it is the start of a sequence. It also fails to flag a transition into or out of a genuine NULL status. IS DISTINCT FROM is the NULL-aware comparison: it treats NULL as a normal comparable value, so NULL versus a non-NULL is distinct (true) and NULL versus NULL is not distinct (false). Use it whenever you compare a column to its lagged or led value.',
        whyHi: 'not-equal operator NULL lौtaता hai, true ya false nahi, jab bhi koi operand NULL hai. Har partition ki pehli row par lag ke paas koi previous row nahi aur ye NULL lौtaता hai, to status not-equal NULL NULL hai, aur row changed flag nahi hoती. IS DISTINCT FROM NULL-aware comparison hai: ye NULL ko ek normal comparable value treat karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Month-over-month revenue growth on a finance dashboard: `(rev - lag(rev) OVER (ORDER BY month)) / nullif(lag(rev) OVER (ORDER BY month), 0)`** — one query, the prior period pulled with `lag`.',
        hi: '**Ek finance dashboard par month-over-month revenue growth: `(rev - lag(rev) OVER (...)) / nullif(lag(rev) OVER (...), 0)`**.',
      },
      {
        en: '**Session detection: `event_at - lag(event_at) OVER (PARTITION BY user_id ORDER BY event_at) > interval \'30 min\'` marks the start of a new session** in a stream of page views.',
        hi: '**Session detection: `event_at - lag(event_at) OVER (PARTITION BY user_id ORDER BY event_at) > interval \'30 min\'` ek naye session ki shuruat mark karता hai**.',
      },
      {
        en: '**An audit view: `value IS DISTINCT FROM lag(value) OVER (PARTITION BY record_id ORDER BY changed_at)`** to show only the rows where a tracked field actually changed.',
        hi: '**Ek audit view: `value IS DISTINCT FROM lag(value) OVER (PARTITION BY record_id ORDER BY changed_at)`** sirf wo rows dikhाne ke liye jahaan ek tracked field asal mein badla.',
      },
    ],

    interviewQA: [
      {
        q: 'What do `lag` and `lead` do, and give two things you would compute with them.',
        qHi: '`lag` aur `lead` kya karते hain, aur do cheezें do jo aap unse compute karोge.',
        a: 'lag of a column returns that column\'s value from a row a fixed number of positions before the current row within the window partition, ordered by the OVER clause\'s ORDER BY; lead does the same looking forward. The offset defaults to one, and there is an optional third argument giving the value to use when the offset lands outside the partition, which otherwise defaults to NULL. They respect PARTITION BY, so lag never reads across a partition boundary and the first row of each partition has no predecessor. Two typical computations: first, row-to-row change, such as a running series where you want each row\'s delta from the one before, value minus lag of value; and period-over-period growth, month revenue minus last month\'s revenue over last month\'s revenue, guarding the denominator with nullif against a zero prior period. Another common one is the gap between consecutive events for the same entity, event time minus lag of event time partitioned by the entity, which yields an interval you can threshold to detect sessions or lapses. Before window functions these needed fragile self-joins on id-plus-one or slow correlated subqueries; lag does it in a single ordered pass.',
        aHi: 'lag ek column ka value lौtaता hai window partition ke andar current row se ek fixed number of positions pehle ki row se, OVER clause ke ORDER BY se ordered; lead wahi aage dekhkर. Offset default ek hai, aur ek optional teesra argument hai jo value deता hai jab offset partition ke bahar land karता hai. Wo PARTITION BY respect karते hain. Do typical computations: pehla, row-to-row change; aur period-over-period growth, denominator ko nullif se guard karके. Ek aur common gap between consecutive events hai. Window functions se pehle inhe fragile self-joins ya slow correlated subqueries chahिए thी.',
      },
      {
        q: 'Why does `last_value` often return the "wrong" value, and how do you fix it?',
        qHi: '`last_value` aksar "galat" value kyun lौtaता hai, aur aap ise kaise fix karते ho?',
        a: 'It is the default frame. When an OVER clause specifies an ORDER BY but no explicit frame clause, the frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which means the window for each row runs from the start of the partition up to and including that row, not the whole partition. first_value is unaffected because the first row of the partition is always within that frame. But last_value returns the last row of the frame, and since the frame ends at the current row, last_value on every row just returns that same row\'s value, which looks like it is echoing the current row rather than giving the partition\'s final value. The fix is to state the frame explicitly as ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING so it spans the entire partition, and then last_value gives the true final value. A frequently cleaner alternative is to reverse the ORDER BY to descending and use first_value, which needs no frame adjustment. The same default-frame issue affects nth_value, which returns NULL until the current row reaches position n.',
        aHi: 'Ye default frame hai. Jab ek OVER clause ek ORDER BY specify karता hai par koi explicit frame clause nahi, frame default se RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW hai, jiska matlab har row ke liye window partition ke start se us row tak chalता hai, poora partition nahi. first_value affected nahi. Par last_value frame ki aakhri row lौtaता hai, aur kyunki frame current row par khatm hoता hai, har row par last_value bस us row ka value lौtaता hai. Fix frame ko explicitly ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING batाना hai. Ek cleaner alternative ORDER BY ko descending karke first_value istemal karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `reading(taken_on date, temp int)` with 5 daily readings. Add `prev_temp` (`lag(temp)`), `next_temp` (`lead(temp)`), and `change` (`temp - lag(temp)`). Confirm row 1\'s `prev_temp` and `change` are `NULL`, and the last row\'s `next_temp` is `NULL`.',
        taskHi: 'Table `reading(taken_on, temp)` 5 daily readings ke saath. `prev_temp`, `next_temp`, aur `change` add karो. Confirm row 1 ka `prev_temp` aur `change` `NULL` hain.',
        hint: 'All three use `OVER (ORDER BY taken_on)`. `lag` is `NULL` on the first row (no predecessor), `lead` is `NULL` on the last (no successor).',
        hintHi: 'Teenों `OVER (ORDER BY taken_on)` istemal karते hain. `lag` pehli row par `NULL`, `lead` aakhri par `NULL`.',
      },
      {
        task: 'Table `sale(region text, amt int, sold_on date)`. For each region, add `first_amt` (`first_value(amt) OVER (PARTITION BY region ORDER BY sold_on)`) and `last_amt`. Show that `last_amt` with the default frame equals the current row\'s `amt`, then fix it with `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.',
        taskHi: 'Table `sale(region, amt, sold_on)`. Har region ke liye `first_amt` aur `last_amt` add karो. Dikhाओ ki default frame ke saath `last_amt` current row ke `amt` ke barabar hai, phir fix karो.',
        hint: 'Default frame ends at CURRENT ROW -> `last_value` = current row. Add the explicit full frame or use `first_value(amt) OVER (PARTITION BY region ORDER BY sold_on DESC)`.',
        hintHi: 'Default frame CURRENT ROW par khatm -> `last_value` = current row. Explicit full frame add karो ya `first_value(... ORDER BY sold_on DESC)`.',
      },
      {
        task: 'Table `status_log(item int, at int, state text)` for one item with states `a, a, b, b, b, c`. Add `changed` = `state IS DISTINCT FROM lag(state) OVER (ORDER BY at)`. Confirm `changed` is `true` on rows 1, 3, 6 and `false` elsewhere. Note why `<>` would make row 1 `NULL` instead of `true`.',
        taskHi: 'Table `status_log(item, at, state)` ek item ke liye states `a, a, b, b, b, c` ke saath. `changed` = `state IS DISTINCT FROM lag(state) OVER (ORDER BY at)` add karो.',
        hint: 'Row 1: `lag` is `NULL`, and `\'a\' IS DISTINCT FROM NULL` is `true` (a real value vs NULL differ). `\'a\' <> NULL` would be `NULL`. Rows 3 and 6 are where the state actually changes.',
        hintHi: 'Row 1: `lag` `NULL` hai, aur `\'a\' IS DISTINCT FROM NULL` `true` hai. `\'a\' <> NULL` `NULL` hoता. Rows 3 aur 6 jahaan state badalता hai.',
      },
    ],

    keyTakeaways: [
      '`lag(expr, offset=1, default=NULL)` = `expr` from the row `offset` positions BEFORE the current row in the window; `lead(...)` = AFTER. They respect `PARTITION BY` (never read across a boundary) — the first row of each partition has no predecessor -> `default` (NULL unless you pass one).',
      '`lag(amt, 1, 0)` gives `0` (not `NULL`) at the boundary — handy so `amt - lag(amt, 1, 0)` is a number on row 1. Common uses: row-to-row delta, percent growth (`(v - lag(v)) / nullif(lag(v), 0)`), time between events (`t - lag(t)` -> interval), "did it change".',
      '`first_value` / `last_value` / `nth_value(expr, n)` return a value at a FIXED POSITION in the FRAME (not a relative offset). `nth_value` is `NULL` if the frame has < n rows.',
      'THE `last_value` GOTCHA: `OVER (ORDER BY x)` with NO explicit frame defaults to `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — "start of partition UP TO current row". So `last_value` returns the CURRENT ROW (frame ends there!), and `nth_value` is `NULL` until the current row reaches position n. `first_value` is unaffected.',
      'FIX: add `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to span the whole partition. OR flip the sort: `first_value(x) OVER (... ORDER BY x DESC)` — often clearer. Rule: `last_value`/`nth_value` almost always need the explicit full frame.',
      'To flag "value changed from previous row" use `value IS DISTINCT FROM lag(value) OVER (...)` — NOT `<>`. `<>` returns `NULL` (not `true`) when either side is `NULL`, including the first row of every partition and any transition to/from a real `NULL`.',
      '`lag`/`lead` replace fragile self-joins (`t.id = prev.id + 1` breaks on gaps) and slow correlated subqueries — one ordered pass, gap-safe, far faster. Reach for them whenever the logic is "this row relative to its neighbour in some order".',
    ],
    keyTakeawaysHi: [
      '`lag(expr, offset=1, default=NULL)` = window mein current row se `offset` positions PEHLE ki row se `expr`; `lead(...)` = BAAD. Wo `PARTITION BY` respect karते hain — har partition ki pehli row ka koi predecessor nahi -> `default`.',
      '`lag(amt, 1, 0)` boundary par `0` deता hai (`NULL` nahi). Common uses: row-to-row delta, percent growth (`(v - lag(v)) / nullif(lag(v), 0)`), events ke beech time, "kya badla".',
      '`first_value` / `last_value` / `nth_value(expr, n)` FRAME mein ek FIXED POSITION par ek value lौtaते hain. `nth_value` `NULL` hai agar frame mein < n rows.',
      '`last_value` GOTCHA: bina explicit frame `OVER (ORDER BY x)` default se `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` hai. To `last_value` CURRENT ROW lौtaता hai (frame wahaan khatm!), aur `nth_value` `NULL` jab tak current row position n par na pahunchे. `first_value` affected nahi.',
      'FIX: poore partition ko span karne ke liye `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` add karो. YA sort flip karो: `first_value(x) OVER (... ORDER BY x DESC)`.',
      '"Value pichli row se badli" flag karne ke liye `value IS DISTINCT FROM lag(value) OVER (...)` — `<>` NAHI. `<>` `NULL` deता hai jab koi side `NULL` hai.',
      '`lag`/`lead` fragile self-joins aur slow correlated subqueries ki jagah lete hain — ek ordered pass, gap-safe, bahut faster.',
    ],
  },
];
