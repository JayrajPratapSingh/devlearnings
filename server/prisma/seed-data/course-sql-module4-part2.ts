/**
 * Databases Complete Course — Module 4: Aggregation & GROUP BY, lessons 4-6.
 *
 * Lesson 4: FILTER & conditional aggregates — `agg(...) FILTER (WHERE cond)` to give
 *           each aggregate its own row filter, the older `sum(CASE WHEN ...)` and
 *           `count(CASE WHEN ... THEN 1 END)` equivalents, hand-rolled pivots, and
 *           computing many metrics in a single table scan.
 * Lesson 5: GROUPING SETS / ROLLUP / CUBE — one query that returns detail rows AND
 *           subtotals AND a grand total; `ROLLUP` for a hierarchy, `CUBE` for every
 *           combination, `GROUPING SETS` for an explicit list, and `GROUPING()` to
 *           tell a real NULL from a subtotal NULL.
 * Lesson 6: GROUP BY with joins & fan-out — the Module 3 fan-out bug seen through the
 *           aggregation lens, aggregate-before-join, `count(DISTINCT)`, and
 *           `LEFT JOIN ... GROUP BY` + `count(right.col)` to keep zero-count groups.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 4
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'sql-filter-and-conditional-aggregates',
    title: 'FILTER & Conditional Aggregates: Many Metrics, One Scan',
    titleHi: 'FILTER Aur Conditional Aggregates: Kई Metrics, Ek Scan',
    description: '`agg(...) FILTER (WHERE cond)` restricts ONE aggregate to the rows matching `cond`, while other aggregates in the same query see all the rows. It replaces the older `sum(CASE WHEN cond THEN x ELSE 0 END)` trick and lets you compute a whole dashboard row — totals, counts by status, a pivot — in a single pass over the table.',
    descriptionHi: '`agg(...) FILTER (WHERE cond)` EK aggregate ko `cond` se match karti rows tak restrict karta hai, jabki usi query mein doosre aggregates sabhi rows dekhte hain. Ye purane `sum(CASE WHEN cond THEN x ELSE 0 END)` trick ki jagah leta hai aur aapko ek poori dashboard row — totals, status ke hisaab se counts, ek pivot — table par ek single pass mein compute karne deta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**One walk down the supermarket aisle, several tally counters in your hand.** You want to know: how many items total, how many are on offer, the total price of just the frozen goods, and how many are past their sell-by date. The slow way is four separate walks down the aisle, one per question. The fast way is one walk: as you pass each item you click every counter that applies — the "total" counter always, the "on offer" counter only if it has a sticker, add to the "frozen total" only if it came from the freezer, click "expired" only if the date has passed. One pass, four answers, each counter following its own rule. That per-counter rule is `FILTER (WHERE ...)`. The old way to get the same effect was to carry a single counter and, for each item, add either its real value or a zero depending on the rule — `sum(CASE WHEN frozen THEN price ELSE 0 END)` — which works but reads worse and cannot skip a row entirely the way a real filter can.',
      hi: '**Supermarket aisle mein ek walk, haath mein kई tally counters.** Aap jाnna chahte ho: total kitne items, kitne offer par hain, sirf frozen goods ki total price, aur kitne apni sell-by date paar kar chuke hain. Slow tarika chaar alag walks hai, prati sawaal ek. Fast tarika ek walk hai: jaise aap har item paas se guzarte ho aap har counter click karte ho jo apply hoता hai — "total" counter hamesha, "on offer" counter sirf agar sticker hai, "frozen total" mein add sirf agar freezer se aaya, "expired" click sirf agar date paar ho gayi. Ek pass, chaar answers, har counter apna rule follow karता. Wo per-counter rule `FILTER (WHERE ...)` hai. Wahi effect paane ka purana tarika ek single counter le jaana tha aur, har item ke liye, rule ke hisaab se ya iski real value ya ek zero add karna — `sum(CASE WHEN frozen THEN price ELSE 0 END)` — jo chalta hai par kam achha padhता hai.',
    },

    simple: `**\`FILTER (WHERE ...)\` — a per-aggregate row filter**

\`\`\`sql
SELECT
  count(*)                                   AS total_orders,
  count(*) FILTER (WHERE status = 'shipped')  AS shipped,
  count(*) FILTER (WHERE status = 'cancelled')AS cancelled,
  sum(amount) FILTER (WHERE status = 'shipped') AS shipped_revenue,
  avg(amount) FILTER (WHERE status = 'shipped') AS avg_shipped
FROM orders;
-- ONE scan of orders; each aggregate sees only its own subset
\`\`\`

**The old equivalents (still valid, sometimes needed on older engines)**

\`\`\`sql
sum(CASE WHEN status = 'shipped' THEN amount ELSE 0 END)   -- == sum(amount) FILTER (WHERE status='shipped')
count(CASE WHEN status = 'shipped' THEN 1 END)             -- == count(*) FILTER (WHERE status='shipped')
--    note: no ELSE -> CASE yields NULL -> count() skips it
\`\`\`

**A hand-rolled pivot: rows → columns**

\`\`\`sql
SELECT product,
  sum(units) FILTER (WHERE month = 1) AS jan,
  sum(units) FILTER (WHERE month = 2) AS feb,
  sum(units) FILTER (WHERE month = 3) AS mar
FROM sales
GROUP BY product;
\`\`\`

**\`FILTER\` combines with \`GROUP BY\`**

\`\`\`sql
SELECT region,
  count(*)                                  AS orders,
  count(*) FILTER (WHERE amount > 100)       AS big_orders,
  round(100.0 * count(*) FILTER (WHERE amount > 100) / count(*), 1) AS pct_big
FROM orders
GROUP BY region;
\`\`\`

**\`FILTER\` vs \`WHERE\` vs \`HAVING\`**

\`\`\`
WHERE   -- filters rows for the WHOLE query
HAVING  -- filters groups after aggregation
FILTER  -- filters rows for ONE aggregate, others unaffected
\`\`\``,

    simpleHi: `**\`FILTER (WHERE ...)\` — ek per-aggregate row filter**

\`\`\`sql
SELECT
  count(*)                                   AS total_orders,
  count(*) FILTER (WHERE status = 'shipped')  AS shipped,
  count(*) FILTER (WHERE status = 'cancelled')AS cancelled,
  sum(amount) FILTER (WHERE status = 'shipped') AS shipped_revenue,
  avg(amount) FILTER (WHERE status = 'shipped') AS avg_shipped
FROM orders;
-- orders ka EK scan; har aggregate sirf apna subset dekhta hai
\`\`\`

**Purane equivalents (abhi bhi valid, kabhi purane engines par zaroori)**

\`\`\`sql
sum(CASE WHEN status = 'shipped' THEN amount ELSE 0 END)   -- == sum(amount) FILTER (WHERE status='shipped')
count(CASE WHEN status = 'shipped' THEN 1 END)             -- == count(*) FILTER (WHERE status='shipped')
--    note: koi ELSE nahi -> CASE NULL deta hai -> count() ise skip karता hai
\`\`\`

**Ek hand-rolled pivot: rows → columns**

\`\`\`sql
SELECT product,
  sum(units) FILTER (WHERE month = 1) AS jan,
  sum(units) FILTER (WHERE month = 2) AS feb,
  sum(units) FILTER (WHERE month = 3) AS mar
FROM sales
GROUP BY product;
\`\`\`

**\`FILTER\` \`GROUP BY\` ke saath combine hota hai**

\`\`\`sql
SELECT region,
  count(*)                                  AS orders,
  count(*) FILTER (WHERE amount > 100)       AS big_orders,
  round(100.0 * count(*) FILTER (WHERE amount > 100) / count(*), 1) AS pct_big
FROM orders
GROUP BY region;
\`\`\`

**\`FILTER\` vs \`WHERE\` vs \`HAVING\`**

\`\`\`
WHERE   -- POORI query ke liye rows filter karta hai
HAVING  -- aggregation ke baad groups filter karta hai
FILTER  -- EK aggregate ke liye rows filter karta hai, doosre unaffected
\`\`\``,

    content: `## The problem \`FILTER\` solves

A dashboard row usually needs several numbers computed from the same table with **different** row conditions: total orders, shipped orders, cancelled orders, revenue from shipped only, average basket for big orders. \`WHERE\` cannot help — it applies one filter to the whole query. Running five separate queries means five scans of the table and a risk they disagree if data changes between them.

\`agg(expr) FILTER (WHERE condition)\` attaches a condition to **one** aggregate. That aggregate only sees rows where \`condition\` is \`TRUE\`; every other aggregate in the \`SELECT\` still sees all the rows (subject to the query's \`WHERE\`). One scan, many independently-filtered numbers.

\`\`\`sql
SELECT
  count(*)                                        AS total,
  count(*) FILTER (WHERE status = 'shipped')       AS shipped,
  count(*) FILTER (WHERE status = 'cancelled')     AS cancelled,
  sum(amount) FILTER (WHERE status = 'shipped')    AS shipped_rev,
  round(avg(amount) FILTER (WHERE status = 'shipped'), 2) AS avg_shipped
FROM orders;
\`\`\`

## \`FILTER\` vs the \`CASE\` trick

Before \`FILTER\` (standard since SQL:2003 but only added to PostgreSQL in 9.4, and still absent from some engines), the idiom was to push a \`CASE\` **inside** the aggregate:

| goal | \`FILTER\` form | \`CASE\` form |
|---|---|---|
| conditional sum | \`sum(amount) FILTER (WHERE cond)\` | \`sum(CASE WHEN cond THEN amount ELSE 0 END)\` |
| conditional count | \`count(*) FILTER (WHERE cond)\` | \`count(CASE WHEN cond THEN 1 END)\` |
| conditional avg | \`avg(x) FILTER (WHERE cond)\` | \`avg(CASE WHEN cond THEN x END)\` — **no \`ELSE\`** |

Key subtleties of the \`CASE\` form:

- For a **count**, write \`CASE WHEN cond THEN 1 END\` with **no \`ELSE\`**. The missing \`ELSE\` yields \`NULL\` for non-matching rows, and \`count()\` skips \`NULL\` — so you count only the matches. \`CASE WHEN cond THEN 1 ELSE 0 END\` inside \`count()\` would count **every** row (both \`1\` and \`0\` are non-NULL).
- For an **avg**, you must **omit \`ELSE 0\`** — \`avg(CASE WHEN cond THEN x ELSE 0 END)\` drags the average toward zero by including non-matching rows as zeros. \`FILTER\` has no such trap: it genuinely removes the rows.
- For a **sum**, \`ELSE 0\` and \`FILTER\` agree (0 adds nothing) — but \`sum\` of an all-non-matching group is \`0\` with the \`CASE\` form and \`NULL\` with \`FILTER\`.

\`FILTER\` is clearer and less error-prone. Use \`CASE\` only when targeting an engine without \`FILTER\` (e.g. older MySQL — MySQL 8 still lacks \`FILTER\`, so \`SUM(cond)\` / \`COUNT(NULLIF(...))\` idioms persist there).

## Pivoting rows into columns

A "pivot" or "crosstab" turns distinct values of one column into separate output columns. \`FILTER\` does it by hand:

\`\`\`sql
SELECT product,
  sum(units) FILTER (WHERE quarter = 'Q1') AS q1,
  sum(units) FILTER (WHERE quarter = 'Q2') AS q2,
  sum(units) FILTER (WHERE quarter = 'Q3') AS q3,
  sum(units) FILTER (WHERE quarter = 'Q4') AS q4,
  sum(units)                                AS full_year
FROM sales
GROUP BY product;
\`\`\`

You must **name each target column explicitly** — SQL's result shape is fixed at parse time, so a true "one column per value, whatever the values are" pivot needs either dynamic SQL or PostgreSQL's \`crosstab\` (from the \`tablefunc\` extension). For a known, small set of buckets (months, quarters, statuses), the \`FILTER\` form is simplest.

## \`FILTER\` with \`GROUP BY\` and ratios

\`FILTER\` composes with \`GROUP BY\` — each group gets its own filtered aggregates:

\`\`\`sql
SELECT region,
  count(*)                              AS orders,
  count(*) FILTER (WHERE amount >= 100)  AS big,
  round(
    100.0 * count(*) FILTER (WHERE amount >= 100) / count(*), 1
  ) AS pct_big
FROM orders
GROUP BY region;
\`\`\`

Note \`100.0\` (not \`100\`) to force numeric division — \`integer / integer\` truncates (Module 2). If a group could have \`count(*) = 0\` after a \`FILTER\` on the denominator too, guard with \`nullif(count(*), 0)\`.

## \`FILTER\` cannot reference the group's aggregates

The \`FILTER (WHERE ...)\` condition is a **row-level** predicate, evaluated per row like a \`WHERE\`. It cannot mention \`sum(...)\` or other aggregates — that would be circular. If you need "count the rows above this group's average", that is a window function or a subquery (Modules 5-6), not \`FILTER\`.`,

    contentHi: `## Wo problem jo \`FILTER\` solve karta hai

Ek dashboard row aksar usi table se **alag** row conditions ke saath kई numbers chahता hai: total orders, shipped orders, cancelled orders, sirf shipped se revenue. \`WHERE\` madad nahi kar sakता — ye poori query par ek filter apply karता hai. Paanch alag queries chalाna paanch scans matlab hai.

\`agg(expr) FILTER (WHERE condition)\` ek condition ko **ek** aggregate se attach karता hai. Wo aggregate sirf wo rows dekhता hai jahaan \`condition\` \`TRUE\` hai; \`SELECT\` mein har doosra aggregate abhi bhi sabhi rows dekhता hai. Ek scan, kई independently-filtered numbers.

## \`FILTER\` vs \`CASE\` trick

\`FILTER\` se pehle, idiom ek \`CASE\` ko aggregate ke **andar** push karna tha:

| goal | \`FILTER\` form | \`CASE\` form |
|---|---|---|
| conditional sum | \`sum(amount) FILTER (WHERE cond)\` | \`sum(CASE WHEN cond THEN amount ELSE 0 END)\` |
| conditional count | \`count(*) FILTER (WHERE cond)\` | \`count(CASE WHEN cond THEN 1 END)\` |
| conditional avg | \`avg(x) FILTER (WHERE cond)\` | \`avg(CASE WHEN cond THEN x END)\` — **koi \`ELSE\` nahi** |

\`CASE\` form ki key subtleties:
- Ek **count** ke liye, \`CASE WHEN cond THEN 1 END\` **bina \`ELSE\`** likho. Missing \`ELSE\` non-matching rows ke liye \`NULL\` deता hai, aur \`count()\` \`NULL\` skip karता hai. \`count()\` ke andar \`CASE WHEN cond THEN 1 ELSE 0 END\` **har** row ginता.
- Ek **avg** ke liye, \`ELSE 0\` **omit karna hoga** — \`avg(CASE WHEN cond THEN x ELSE 0 END)\` average ko zero ki taraf kheenchता hai. \`FILTER\` mein aisa koi trap nahi.
- Ek **sum** ke liye, \`ELSE 0\` aur \`FILTER\` agree karते hain — par ek all-non-matching group ka \`sum\` \`CASE\` form ke saath \`0\` hai aur \`FILTER\` ke saath \`NULL\`.

\`FILTER\` saaf aur kam error-prone hai. \`CASE\` sirf tab jab \`FILTER\` ke bina ek engine target kar rahe ho (jaise MySQL 8 mein abhi bhi \`FILTER\` nahi hai).

## Rows ko columns mein pivot karna

Ek "pivot" ek column ki distinct values ko alag output columns mein badalता hai. \`FILTER\` ise haath se karता hai:

\`\`\`sql
SELECT product,
  sum(units) FILTER (WHERE quarter = 'Q1') AS q1,
  sum(units) FILTER (WHERE quarter = 'Q2') AS q2,
  sum(units)                                AS full_year
FROM sales
GROUP BY product;
\`\`\`

Aapko **har target column explicitly name karna hoga** — SQL ka result shape parse time par fixed hai. Ek known, chhote set ke buckets (months, quarters, statuses) ke liye \`FILTER\` form sabse simple hai.

## \`FILTER\` \`GROUP BY\` aur ratios ke saath

\`\`\`sql
SELECT region,
  count(*) AS orders,
  count(*) FILTER (WHERE amount >= 100) AS big,
  round(100.0 * count(*) FILTER (WHERE amount >= 100) / count(*), 1) AS pct_big
FROM orders GROUP BY region;
\`\`\`

\`100.0\` (na ki \`100\`) numeric division force karne ke liye — \`integer / integer\` truncate karта hai (Module 2). \`nullif(count(*), 0)\` se guard karo agar denominator zero ho sakta hai.

## \`FILTER\` group ke aggregates reference nahi kar sakта

\`FILTER (WHERE ...)\` condition ek **row-level** predicate hai. Ye \`sum(...)\` ya doosre aggregates mention nahi kar sakти. Agar aapko "is group ke average se upar ki rows count karo" chahिए, wo ek window function ya ek subquery hai (Modules 5-6), \`FILTER\` nahi.`,

    examples: [
      {
        title: 'One scan, many metrics: FILTER gives each aggregate its own row filter',
        titleHi: 'Ek scan, kई metrics: FILTER har aggregate ko apna row filter deta hai',
        code: `CREATE TABLE t2 (region text, status text, amt int);
INSERT INTO t2 VALUES
  ('N', 'shipped', 100), ('N', 'shipped', 200), ('N', 'cancelled', 50), ('N', 'pending', 30),
  ('S', 'shipped', 300), ('S', 'pending', 10);

SELECT region,
  count(*)                                     AS total,
  count(*) FILTER (WHERE status = 'shipped')    AS shipped_cnt,
  sum(amt) FILTER (WHERE status = 'shipped')    AS shipped_rev,
  sum(CASE WHEN status = 'shipped' THEN amt ELSE 0 END) AS shipped_rev_case,
  count(*) FILTER (WHERE status = 'cancelled')  AS cancelled_cnt
FROM t2
GROUP BY region
ORDER BY region;`,
        output: ` region | total | shipped_cnt | shipped_rev | shipped_rev_case | cancelled_cnt
--------+-------+-------------+-------------+------------------+---------------
 N      | 4     | 2           | 300         | 300              | 1
 S      | 2     | 1           | 300         | 300              | 0
(2 rows)`,
        explain: 'Each `FILTER (WHERE ...)` restricts ONE aggregate to its own subset of rows, while `count(*)` (no filter) still sees all of them. In one scan per region: `total` counts every row, `shipped_cnt` only the shipped ones, `shipped_rev` sums `amt` over shipped only. `shipped_rev_case` shows the old `sum(CASE WHEN ... THEN amt ELSE 0 END)` idiom produces the identical `300` — for a `sum`, `ELSE 0` and `FILTER` agree.',
        explainHi: 'Har `FILTER (WHERE ...)` EK aggregate ko iske apne rows ke subset tak restrict karता hai, jabki `count(*)` (koi filter nahi) phir bhi sabko dekhता hai. Prati region ek scan mein: `total` har row ginता hai, `shipped_cnt` sirf shipped, `shipped_rev` sirf shipped par `amt` sum karता hai. `shipped_rev_case` dikhाता hai purana `sum(CASE ...)` idiom identical `300` produce karता hai.',
      },
      {
        title: 'A hand-rolled pivot: months become columns',
        titleHi: 'Ek hand-rolled pivot: months columns ban jaate hain',
        code: `CREATE TABLE px (product text, mon int, units int);
INSERT INTO px VALUES
  ('W', 1, 5), ('W', 1, 3), ('W', 2, 10),
  ('G', 1, 7), ('G', 3, 2);

SELECT product,
  sum(units) FILTER (WHERE mon = 1) AS jan,
  sum(units) FILTER (WHERE mon = 2) AS feb,
  sum(units) FILTER (WHERE mon = 3) AS mar,
  sum(units)                        AS ytd
FROM px
GROUP BY product
ORDER BY product;`,
        output: ` product | jan | feb  | mar  | ytd
---------+-----+------+------+-----
 G       | 7   | NULL | 2    | 9
 W       | 8   | 10   | NULL | 18
(2 rows)`,
        explain: 'A hand-rolled pivot: `sum(units) FILTER (WHERE mon = 1) AS jan` and so on turn the rows of the `mon` column into named output columns. Product `G` has no February rows, so `feb` is `sum` of zero rows = `NULL` (not `0`). But `ytd` (an UNfiltered `sum(units)`) is still correct — `9` for G, `18` for W — because it sees every row regardless of month.',
        explainHi: 'Ek hand-rolled pivot: `sum(units) FILTER (WHERE mon = 1) AS jan` waغैra `mon` column ki rows ko named output columns mein badalते hain. Product `G` ki koi February rows nahi, to `feb` zero rows ka `sum` = `NULL` hai (`0` nahi). Par `ytd` (ek UNfiltered `sum(units)`) phir bhi sahi hai — G ke liye `9`, W ke liye `18`.',
      },
      {
        title: 'count(CASE ... THEN 1 END) with no ELSE == count(*) FILTER',
        titleHi: 'count(CASE ... THEN 1 END) bina ELSE == count(*) FILTER',
        code: `CREATE TABLE r (grade text);
INSERT INTO r VALUES ('A'), ('A'), ('B'), ('C'), ('A');

SELECT
  count(*)                                  AS all_rows,
  count(*) FILTER (WHERE grade = 'A')        AS a_filter,
  count(CASE WHEN grade = 'A' THEN 1 END)    AS a_case_no_else,
  count(CASE WHEN grade = 'A' THEN 1 ELSE 0 END) AS a_case_with_else
FROM r;`,
        output: ` all_rows | a_filter | a_case_no_else | a_case_with_else
----------+----------+----------------+------------------
 5        | 3        | 3              | 5
(1 row)`,
        explain: "`count(x)` counts rows where `x` is NOT `NULL`. `count(CASE WHEN grade='A' THEN 1 END)` — no `ELSE` — yields `1` for A rows and `NULL` for the rest, so `count` tallies only the 3 A's, matching `count(*) FILTER (WHERE grade='A')`. But `count(CASE WHEN grade='A' THEN 1 ELSE 0 END)` yields `1` or `0` — BOTH non-NULL — so `count` sees all 5 rows. The missing `ELSE` is the whole trick.",
        explainHi: "`count(x)` wo rows ginता hai jahaan `x` `NULL` NAHI hai. `count(CASE WHEN grade='A' THEN 1 END)` — koi `ELSE` nahi — A rows ke liye `1` aur baaki ke liye `NULL` deता hai, to `count` sirf 3 A's ginता hai, `count(*) FILTER (WHERE grade='A')` se match karке. Par `count(CASE WHEN grade='A' THEN 1 ELSE 0 END)` `1` ya `0` deता hai — DONO non-NULL — to `count` sabhi 5 rows dekhता hai. Missing `ELSE` poora trick hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- "average order value for shipped orders" -- with CASE and ELSE 0
SELECT avg(CASE WHEN status = 'shipped' THEN amount ELSE 0 END) AS avg_shipped
FROM orders;
-- every non-shipped order contributes a 0 to the average -> answer far too low`,
        right: `SELECT avg(amount) FILTER (WHERE status = 'shipped') AS avg_shipped
FROM orders;
-- or, with CASE, OMIT the ELSE so non-matching rows become NULL and are skipped:
-- avg(CASE WHEN status = 'shipped' THEN amount END)`,
        why: 'avg divides the sum of its inputs by the count of its non-NULL inputs. Writing CASE WHEN shipped THEN amount ELSE 0 END feeds a real 0 for every order that is not shipped, and those zeros are counted in the denominator, so the average is dragged toward zero in proportion to how many non-shipped orders exist. The fix with CASE is to leave off the ELSE, so a non-matching row yields NULL and avg ignores it. FILTER avoids the trap entirely: it removes the non-matching rows before the aggregate sees them, so avg amount FILTER WHERE status equals shipped is exactly the average over the shipped orders. The ELSE 0 pattern is only safe for sum, where adding zero is harmless.',
        whyHi: 'avg apne inputs ke sum ko apne non-NULL inputs ke count se divide karता hai. CASE WHEN shipped THEN amount ELSE 0 END likhना har non-shipped order ke liye ek real 0 feed karता hai, aur wo zeros denominator mein ginे jaate hain, to average zero ki taraf kheencha jaata hai. CASE ke saath fix ELSE chhodना hai, to ek non-matching row NULL deти hai aur avg ise ignore karता hai. FILTER trap poori tarah avoid karता hai. ELSE 0 pattern sirf sum ke liye safe hai.',
      },
      {
        wrong: `-- conditional count with ELSE 0 inside count()
SELECT count(CASE WHEN status = 'error' THEN 1 ELSE 0 END) AS error_count
FROM jobs;
-- returns the TOTAL job count -- both 1 and 0 are non-NULL, so count() counts them all`,
        right: `SELECT count(*) FILTER (WHERE status = 'error') AS error_count FROM jobs;
-- or: count(CASE WHEN status = 'error' THEN 1 END)   -- no ELSE`,
        why: 'count of an expression counts the rows where that expression is not NULL. CASE WHEN error THEN 1 ELSE 0 END never produces NULL, it produces 1 or 0, both of which are non-NULL, so count sees every row and returns the total row count regardless of status. To count only the matches with a CASE you must omit the ELSE, so non-matching rows evaluate to NULL and are skipped. FILTER is the clear modern form and removes any doubt: count star FILTER WHERE status equals error.',
        whyHi: 'ek expression ka count wo rows ginता hai jahaan wo expression NULL nahi hai. CASE WHEN error THEN 1 ELSE 0 END kabhi NULL produce nahi karता, ye 1 ya 0 produce karता hai, dono non-NULL, to count har row dekhता hai aur status ke bavjood total row count lautाता hai. CASE ke saath sirf matches count karne ke liye aapko ELSE omit karna hoga. FILTER saaf modern form hai.',
      },
      {
        wrong: `-- percentage of big orders per region -- integer division
SELECT region,
  count(*) FILTER (WHERE amount >= 100) / count(*) AS pct_big
FROM orders GROUP BY region;
-- integer / integer -> 0 for every region where big orders are a minority`,
        right: `SELECT region,
  round(100.0 * count(*) FILTER (WHERE amount >= 100) / count(*), 1) AS pct_big
FROM orders GROUP BY region;`,
        why: 'Both count expressions return integers, and in SQL integer divided by integer does integer division, discarding the fractional part. If a region has 3 big orders out of 20, the result is 3 / 20 which truncates to 0, not 0.15 and not 15. Multiplying by 100.0, a numeric literal, forces the whole expression into numeric arithmetic so the division keeps its fraction, and round trims it to a sensible number of decimal places. If a FILTER could also empty the denominator, wrap it as nullif of count star comma 0 to get NULL instead of a division-by-zero error.',
        whyHi: 'Dono count expressions integers lautाते hain, aur SQL mein integer divided by integer integer division karता hai, fractional part discard karके. Agar ek region ke 20 mein se 3 big orders hain, result 3 / 20 hai jo 0 mein truncate hoता hai. 100.0 se multiply karna, ek numeric literal, poore expression ko numeric arithmetic mein force karता hai. Agar denominator empty ho sakta hai, nullif of count star comma 0 se wrap karo.',
      },
    ],

    realWorld: [
      {
        en: '**A single "orders summary" query behind an admin header — total, paid, refunded, shipped-today, revenue-this-week — all as `FILTER` aggregates in one pass**, replacing five endpoints that used to fan out to five queries.',
        hi: '**Ek admin header ke peeche ek single "orders summary" query — total, paid, refunded — sab ek pass mein `FILTER` aggregates ke roop mein**, paanch endpoints ki jagah.',
      },
      {
        en: '**A cohort retention grid: `count(DISTINCT user_id) FILTER (WHERE active_in_week = n)` for n = 0..11**, one row per signup cohort, built entirely with `FILTER`.',
        hi: '**Ek cohort retention grid: n = 0..11 ke liye `count(DISTINCT user_id) FILTER (WHERE active_in_week = n)`**, poori tarah `FILTER` se banī.',
      },
      {
        en: '**An SLA report: `avg(resolved_at - created_at) FILTER (WHERE priority = \'P1\')` alongside the P2 and P3 averages** — one scan of the tickets table instead of three.',
        hi: '**Ek SLA report: P2 aur P3 averages ke saath `avg(resolved_at - created_at) FILTER (WHERE priority = \'P1\')`** — tickets table ka ek scan.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `FILTER (WHERE ...)` do on an aggregate, and how does it relate to the `CASE` trick?',
        qHi: 'Ek aggregate par `FILTER (WHERE ...)` kya karता hai, aur ye `CASE` trick se kaise related hai?',
        a: 'FILTER attaches a row condition to a single aggregate. That aggregate only processes the rows where the condition is true, while every other aggregate in the same SELECT still processes all the rows the query\'s WHERE let through. It lets you compute many differently-filtered numbers, total orders, shipped orders, revenue from shipped only, average basket for big orders, in one pass over the table instead of one query per number. Before FILTER was widely available, the way to get the same effect was to push a CASE inside the aggregate. For a conditional sum, sum of CASE WHEN cond THEN amount ELSE 0 END is equivalent, because adding zero for non-matching rows is harmless. For a conditional count you write CASE WHEN cond THEN 1 END with no ELSE, so non-matching rows become NULL and count skips them; adding ELSE 0 would make count tally every row. For a conditional average you must omit the ELSE entirely, because feeding zeros into avg pulls the mean toward zero. FILTER has none of these footguns, it just removes the rows, so it is clearer and safer. You still see the CASE idiom on engines that lack FILTER, such as MySQL.',
        aHi: 'FILTER ek row condition ko ek single aggregate se attach karता hai. Wo aggregate sirf wo rows process karता hai jahaan condition true hai, jabki usi SELECT mein har doosra aggregate abhi bhi sabhi rows process karता hai. Ye aapko kई differently-filtered numbers ek pass mein compute karने deta hai. FILTER se pehle, wahi effect paane ka tarika ek CASE ko aggregate ke andar push karna tha. Ek conditional sum ke liye, sum of CASE WHEN cond THEN amount ELSE 0 END equivalent hai. Ek conditional count ke liye aap bina ELSE ke CASE WHEN cond THEN 1 END likhते ho. Ek conditional average ke liye aapko ELSE poori tarah omit karna hoga. FILTER mein in mein se koi footgun nahi.',
      },
      {
        q: 'How would you produce a pivot (values of one column becoming separate output columns) in SQL?',
        qHi: 'Aap SQL mein ek pivot kaise produce karोge (ek column ki values alag output columns ban rahi hain)?',
        a: 'For a fixed, known set of buckets, the simplest way is a GROUP BY with one FILTER aggregate per target column. To turn months into columns you group by product and select sum of units FILTER WHERE month equals 1 as jan, the same for month 2 as feb, and so on, plus optionally an unfiltered sum for the row total. Each output column is spelled out explicitly. That is the constraint: a SQL statement\'s result shape is fixed when it is parsed, so you cannot write a query that produces "one column per distinct value, whatever those values turn out to be". If the set of buckets is dynamic or large you need either application-side dynamic SQL that builds the column list from a first query, or PostgreSQL\'s crosstab function from the tablefunc extension, which still requires you to declare the output column types. In practice most pivots are over a small stable set, months, quarters, statuses, priorities, so the FILTER form covers them and reads well.',
        aHi: 'Ek fixed, known set ke buckets ke liye, sabse simple tarika ek GROUP BY hai prati target column ek FILTER aggregate ke saath. Months ko columns mein badalने ke liye aap product se group karते ho aur sum of units FILTER WHERE month equals 1 as jan select karते ho, month 2 ke liye wahi feb ke roop mein. Har output column explicitly likha jaता hai. Wo constraint hai: ek SQL statement ka result shape parse hone par fixed hai. Agar buckets ka set dynamic ya bada hai aapko ya application-side dynamic SQL chahिए ya PostgreSQL ka crosstab function. Practice mein zyadातar pivots ek chhote stable set par hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Table `ticket(priority text, resolved bool)` with a mix of P1/P2/P3 rows, some resolved. Write ONE query (no `GROUP BY`) returning: `total`, `p1` (count where priority = P1), `resolved_cnt`, `p1_resolved` (count where P1 AND resolved). Use `count(*) FILTER (WHERE ...)` for each.',
        taskHi: 'Table `ticket(priority, resolved)` P1/P2/P3 rows ke mix ke saath. EK query (no `GROUP BY`) jo lautati hai: `total`, `p1`, `resolved_cnt`, `p1_resolved`. Har ek ke liye `count(*) FILTER (WHERE ...)` istemal karo.',
        hint: '`count(*) AS total, count(*) FILTER (WHERE priority = \'P1\') AS p1, count(*) FILTER (WHERE resolved) AS resolved_cnt, count(*) FILTER (WHERE priority = \'P1\' AND resolved) AS p1_resolved`.',
        hintHi: '`count(*) FILTER (WHERE priority = \'P1\' AND resolved)` chautha column hai. Sabhi ek `SELECT` mein, ek scan.',
      },
      {
        task: 'Table `sale(product text, region text, amount int)`. Pivot region into columns: return `product`, `north` (sum of amount where region = N), `south`, `east`, `west`, and `total`. `GROUP BY product`. Confirm a product sold only in the north shows `NULL` for the other regions but a correct `total`.',
        taskHi: 'Table `sale(product, region, amount)`. Region ko columns mein pivot karo: `product`, `north`, `south`, `east`, `west`, aur `total` lautao. `GROUP BY product`.',
        hint: '`sum(amount) FILTER (WHERE region = \'N\') AS north`, etc., plus a bare `sum(amount) AS total`. Missing regions give `NULL` (sum of zero rows), not `0` — the `total` is still right because the unfiltered `sum` sees every row.',
        hintHi: '`sum(amount) FILTER (WHERE region = \'N\') AS north`, etc., plus ek bare `sum(amount) AS total`. Missing regions `NULL` dete hain.',
      },
      {
        task: 'Table `visit(page text, converted bool)`. For each page return `visits`, `conversions` (count where `converted`), and `conv_rate_pct` = `round(100.0 * conversions / visits, 1)`. Add a second query with `HAVING count(*) >= 10` so low-traffic pages are hidden. Note why `100.0` (not `100`) matters.',
        taskHi: 'Table `visit(page, converted)`. Har page ke liye `visits`, `conversions`, aur `conv_rate_pct` lautao. Ek doosri query `HAVING count(*) >= 10` ke saath.',
        hint: '`count(*) FILTER (WHERE converted) AS conversions`. `100.0 * ... / count(*)` — the `.0` forces numeric division; `100 * int / int` would still truncate the final divide. `HAVING count(*) >= 10` filters the groups.',
        hintHi: '`100.0 * ... / count(*)` — `.0` numeric division force karता hai; `100 * int / int` phir bhi truncate karता. `HAVING count(*) >= 10`.',
      },
    ],

    keyTakeaways: [
      '`agg(expr) FILTER (WHERE cond)` restricts ONE aggregate to rows where `cond` is `TRUE`; every OTHER aggregate in the same `SELECT` still sees all rows. Result: many differently-filtered numbers in ONE table scan instead of one query each.',
      '`FILTER` equivalents (pre-`FILTER`, still needed on MySQL 8 which lacks it): `sum(x) FILTER (WHERE c)` == `sum(CASE WHEN c THEN x ELSE 0 END)`; `count(*) FILTER (WHERE c)` == `count(CASE WHEN c THEN 1 END)` (NO `ELSE`).',
      '`CASE` traps `FILTER` avoids: (1) `count(CASE WHEN c THEN 1 ELSE 0 END)` counts EVERY row (1 and 0 are both non-NULL) — omit the `ELSE`. (2) `avg(CASE WHEN c THEN x ELSE 0 END)` drags the mean toward 0 — omit the `ELSE` so non-matches are `NULL` and skipped. (3) all-non-matching group: `CASE ELSE 0` sum = `0`, `FILTER` sum = `NULL`.',
      'PIVOT rows -> columns: `GROUP BY product` + one `sum(x) FILTER (WHERE month = N) AS mon_n` per bucket, plus a bare `sum(x)` for the row total. Each column named EXPLICITLY (SQL result shape is fixed at parse time) — dynamic pivots need app-side SQL or PG `crosstab`.',
      '`FILTER` composes with `GROUP BY` — each group gets its own filtered aggregates. For a ratio use `round(100.0 * count(*) FILTER (WHERE ...) / count(*), 1)` — the `100.0` forces numeric division (`int / int` truncates, Module 2); guard a possibly-zero denominator with `nullif(count(*), 0)`.',
      'The `FILTER (WHERE ...)` predicate is ROW-level (like a `WHERE`) — it CANNOT reference `sum(...)` or other aggregates. "Rows above the group average" is a window function / subquery (Modules 5-6), not `FILTER`.',
      '`WHERE` filters rows for the whole query; `HAVING` filters groups after aggregation; `FILTER` filters rows for ONE aggregate. Different jobs — they combine freely in one query.',
    ],
    keyTakeawaysHi: [
      '`agg(expr) FILTER (WHERE cond)` EK aggregate ko `cond` `TRUE` waali rows tak restrict karता hai; usi `SELECT` mein har DOOSRA aggregate abhi bhi sabhi rows dekhता hai. Result: kई differently-filtered numbers EK table scan mein.',
      '`FILTER` equivalents (MySQL 8 par abhi bhi zaroori): `sum(x) FILTER (WHERE c)` == `sum(CASE WHEN c THEN x ELSE 0 END)`; `count(*) FILTER (WHERE c)` == `count(CASE WHEN c THEN 1 END)` (KOI `ELSE` NAHI).',
      '`CASE` traps jo `FILTER` avoid karता hai: (1) `count(CASE WHEN c THEN 1 ELSE 0 END)` HAR row ginता hai — `ELSE` omit karo. (2) `avg(CASE WHEN c THEN x ELSE 0 END)` mean ko 0 ki taraf kheenchता hai — `ELSE` omit karo. (3) all-non-matching group: `CASE ELSE 0` sum = `0`, `FILTER` sum = `NULL`.',
      'PIVOT rows -> columns: `GROUP BY product` + prati bucket ek `sum(x) FILTER (WHERE month = N) AS mon_n`, plus row total ke liye ek bare `sum(x)`. Har column EXPLICITLY named.',
      '`FILTER` `GROUP BY` ke saath compose hota hai. Ek ratio ke liye `round(100.0 * count(*) FILTER (WHERE ...) / count(*), 1)` — `100.0` numeric division force karता hai; `nullif(count(*), 0)` se guard karo.',
      '`FILTER (WHERE ...)` predicate ROW-level hai — ye `sum(...)` reference NAHI kar sakта. "Group average se upar ki rows" ek window function / subquery hai (Modules 5-6).',
      '`WHERE` poori query ke liye rows filter karता hai; `HAVING` aggregation ke baad groups; `FILTER` EK aggregate ke liye rows. Alag kaam — ek query mein freely combine hote hain.',
    ],
  },

  {
    slug: 'sql-grouping-sets-rollup-cube',
    title: 'GROUPING SETS, ROLLUP & CUBE: Subtotals in One Query',
    titleHi: 'GROUPING SETS, ROLLUP Aur CUBE: Ek Query Mein Subtotals',
    description: 'A plain `GROUP BY region, product` gives you detail rows only. `ROLLUP (region, product)` adds a subtotal per region AND a grand total. `CUBE` adds every combination. `GROUPING SETS` lets you list exactly the aggregation levels you want — all in one pass.',
    descriptionHi: 'Ek plain `GROUP BY region, product` sirf detail rows deता hai. `ROLLUP (region, product)` prati region ek subtotal AUR ek grand total add karता hai. `CUBE` har combination add karता hai. `GROUPING SETS` aapko theek wo aggregation levels list karने deta hai jo aap chahते ho — sab ek pass mein.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A sales report where you want the line items, the per-department subtotals, and the bottom-line total — without running three reports and stapling them.** Normally \`GROUP BY department, product\` gives you exactly the line items: one number per (department, product). But a real report also has a **subtotal row after each department** ("Electronics total: 40,000") and one **grand total** at the very bottom ("Company total: 512,000"). \`ROLLUP (department, product)\` produces all three levels in a single result set: the detail rows, then for each department a row where *product* is blank meaning "all products in this department", then one row where *both* are blank meaning "everything". \`CUBE\` goes further and also gives you a subtotal **per product across all departments** ("Widgets, company-wide: 90,000"), i.e. every possible blank/not-blank combination. \`GROUPING SETS\` is the manual version: you write the exact list of "blank-ness" patterns you want. The one catch: a blank in a subtotal row shows up as \`NULL\`, which you have to be able to tell apart from a genuine \`NULL\` in the data — that is what the \`GROUPING()\` function is for.',
      hi: '**Ek sales report jahaan aap line items, per-department subtotals, aur bottom-line total chahте ho — bina teen reports chalाye aur staple kiye.** Normally `GROUP BY department, product` aapko theek line items deता hai. Par ek real report mein **har department ke baad ek subtotal row** ("Electronics total: 40,000") aur bilkul neeche ek **grand total** ("Company total: 512,000") bhi hota hai. `ROLLUP (department, product)` teenon levels ek single result set mein produce karता hai: detail rows, phir har department ke liye ek row jahaan *product* blank hai matlab "is department ke sabhi products", phir ek row jahaan *dono* blank hain matlab "sab kuch". `CUBE` aage jaता hai aur **prati product sabhi departments par** ek subtotal bhi deता hai. `GROUPING SETS` manual version hai. Ek catch: ek subtotal row mein ek blank `NULL` dikhता hai, jise aapko data mein ek genuine `NULL` se alag bata paana hoga — uske liye `GROUPING()` function hai.',
    },

    simple: `**Plain \`GROUP BY\` — detail rows only**

\`\`\`sql
SELECT region, product, sum(amt) FROM fs GROUP BY region, product;
-- N | W | 100
-- N | G | 50
-- S | W | 200
-- S | G | 25
\`\`\`

**\`ROLLUP (a, b)\` — detail + subtotal per \`a\` + grand total**

\`\`\`sql
SELECT region, product, sum(amt) FROM fs GROUP BY ROLLUP (region, product);
-- N    | W    | 100     <- detail
-- N    | G    | 50      <- detail
-- N    | NULL | 150     <- subtotal for region N  (product is "all")
-- S    | W    | 200
-- S    | G    | 25
-- S    | NULL | 225     <- subtotal for region S
-- NULL | NULL | 375     <- GRAND total  (both "all")
\`\`\`

**\`CUBE (a, b)\` — every combination, including subtotal per \`b\`**

\`\`\`sql
GROUP BY CUBE (region, product)
-- everything ROLLUP gives, PLUS:
-- NULL | W | 300     <- subtotal for product W across all regions
-- NULL | G | 75      <- subtotal for product G across all regions
\`\`\`

**\`GROUPING SETS\` — you name the exact levels**

\`\`\`sql
GROUP BY GROUPING SETS ((region), (product), ())
-- one row per region, one row per product, one grand total -- NO detail rows
\`\`\`

**\`GROUPING(col)\` — 1 if this row is a subtotal over \`col\`, else 0**

\`\`\`sql
SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'ALL' ELSE region END AS region,
  CASE WHEN GROUPING(product) = 1 THEN 'ALL' ELSE product END AS product,
  sum(amt)
FROM fs GROUP BY ROLLUP (region, product);
\`\`\``,

    simpleHi: `**Plain \`GROUP BY\` — sirf detail rows**

\`\`\`sql
SELECT region, product, sum(amt) FROM fs GROUP BY region, product;
-- N | W | 100
-- N | G | 50
-- S | W | 200
-- S | G | 25
\`\`\`

**\`ROLLUP (a, b)\` — detail + prati \`a\` subtotal + grand total**

\`\`\`sql
SELECT region, product, sum(amt) FROM fs GROUP BY ROLLUP (region, product);
-- N    | W    | 100     <- detail
-- N    | G    | 50      <- detail
-- N    | NULL | 150     <- region N ka subtotal  (product "all" hai)
-- S    | W    | 200
-- S    | G    | 25
-- S    | NULL | 225     <- region S ka subtotal
-- NULL | NULL | 375     <- GRAND total  (dono "all")
\`\`\`

**\`CUBE (a, b)\` — har combination, prati \`b\` subtotal sहित**

\`\`\`sql
GROUP BY CUBE (region, product)
-- jo ROLLUP deता hai wo sab, PLUS:
-- NULL | W | 300     <- sabhi regions par product W ka subtotal
-- NULL | G | 75      <- sabhi regions par product G ka subtotal
\`\`\`

**\`GROUPING SETS\` — aap theek levels name karते ho**

\`\`\`sql
GROUP BY GROUPING SETS ((region), (product), ())
-- prati region ek row, prati product ek row, ek grand total -- KOI detail rows NAHI
\`\`\`

**\`GROUPING(col)\` — 1 agar ye row \`col\` par ek subtotal hai, warna 0**

\`\`\`sql
SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'ALL' ELSE region END AS region,
  CASE WHEN GROUPING(product) = 1 THEN 'ALL' ELSE product END AS product,
  sum(amt)
FROM fs GROUP BY ROLLUP (region, product);
\`\`\``,

    content: `## The problem

You want a report with **multiple levels of aggregation** in one result: the detail, the subtotals, the grand total. Without special syntax you would run a query per level and \`UNION ALL\` them — several scans of the table, and the \`UNION\` branches drift apart over time. \`GROUPING SETS\` and its shorthands \`ROLLUP\` / \`CUBE\` compute all the levels in **one pass**.

## \`GROUPING SETS\` — the general form

\`GROUP BY GROUPING SETS ( set1, set2, ... )\` runs the aggregation **once per listed set** and \`UNION ALL\`s the results. Each set is a parenthesised list of columns; \`()\` is the empty set = the grand total.

\`\`\`sql
SELECT region, product, sum(amt)
FROM fs
GROUP BY GROUPING SETS (
  (region, product),   -- detail
  (region),            -- subtotal per region
  (product),           -- subtotal per product
  ()                   -- grand total
);
\`\`\`

For a set that does not mention a column, that column comes out \`NULL\` in those rows (it means "aggregated over").

## \`ROLLUP\` — hierarchical subtotals

\`ROLLUP (a, b, c)\` is shorthand for the grouping sets:

\`\`\`
(a, b, c)   -- detail
(a, b)      -- subtotal
(a)         -- subtotal
()          -- grand total
\`\`\`

It walks **right to left**, dropping one column at a time. Use it when the columns form a **hierarchy** — \`ROLLUP (year, quarter, month)\`, \`ROLLUP (country, region, city)\`, \`ROLLUP (category, subcategory, product)\`. You get the leaf rows, then each parent level's subtotal, then the total. It does **not** give you a subtotal for \`b\` alone or \`c\` alone.

## \`CUBE\` — every combination

\`CUBE (a, b, c)\` generates **all 2^n** grouping sets — every subset of the columns:

\`\`\`
(a,b,c) (a,b) (a,c) (b,c) (a) (b) (c) ()
\`\`\`

Use it when the columns are **independent dimensions** and you want every possible subtotal — by region, by product, by region-and-product, by neither. \`CUBE (region, product, month)\` gives you 8 levels in one query. It gets expensive fast: \`CUBE\` of 5 columns is 32 grouping sets.

## \`GROUPING(col)\` — real \`NULL\` vs subtotal \`NULL\`

In a subtotal row, the "rolled-up" columns are output as \`NULL\`. But your data might **also** contain a genuine \`NULL\` in that column. \`region = NULL\` could mean "this is the subtotal across all regions" **or** "these are the sales with no region recorded" — and they are different rows with different meanings.

\`GROUPING(col)\` disambiguates: it returns **\`1\`** if \`col\` was rolled up (aggregated over) in this row, **\`0\`** if \`col\` is a real grouping value (including a real \`NULL\`).

\`\`\`sql
SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'All regions'
       ELSE coalesce(region, '(no region)') END AS region,
  sum(amt)
FROM fs
GROUP BY ROLLUP (region);
\`\`\`

You can also \`ORDER BY GROUPING(region), region\` to keep detail rows above their subtotal, and filter with \`HAVING GROUPING(product) = 0\` to drop a level you did not want.

## Ordering the output

Grouping-set queries return rows in an implementation-defined order — the subtotal rows are interleaved unpredictably unless you sort. A common pattern:

\`\`\`sql
ORDER BY
  GROUPING(region), region,     -- detail regions first, "All" last
  GROUPING(product), product;
\`\`\`

## When to use which

| situation | use |
|---|---|
| columns form a drill-down hierarchy | \`ROLLUP\` |
| columns are independent, want all subtotals | \`CUBE\` |
| you want a specific, non-standard set of levels | \`GROUPING SETS\` |
| just the detail | plain \`GROUP BY\` |

These are read-heavy analytical features. For an OLTP endpoint that needs one level, a plain \`GROUP BY\` is right; \`ROLLUP\`/\`CUBE\` shine in reporting and BI queries.`,

    contentHi: `## Problem

Aap ek report chahте ho ek result mein **aggregation ke kई levels** ke saath: detail, subtotals, grand total. Special syntax ke bina aap prati level ek query chalाते aur unhe \`UNION ALL\` karते — kई scans. \`GROUPING SETS\` aur iske shorthands \`ROLLUP\` / \`CUBE\` sabhi levels **ek pass** mein compute karते hain.

## \`GROUPING SETS\` — general form

\`GROUP BY GROUPING SETS ( set1, set2, ... )\` aggregation ko **prati listed set ek baar** chalाता hai aur results \`UNION ALL\` karता hai. \`()\` empty set = grand total.

\`\`\`sql
SELECT region, product, sum(amt)
FROM fs
GROUP BY GROUPING SETS (
  (region, product),   -- detail
  (region),            -- prati region subtotal
  (product),           -- prati product subtotal
  ()                   -- grand total
);
\`\`\`

Jo set ek column mention nahi karता, wo column un rows mein \`NULL\` aata hai.

## \`ROLLUP\` — hierarchical subtotals

\`ROLLUP (a, b, c)\` grouping sets ke liye shorthand hai:

\`\`\`
(a, b, c)   -- detail
(a, b)      -- subtotal
(a)         -- subtotal
()          -- grand total
\`\`\`

Ye **right to left** chalता hai. Ise tab istemal karo jab columns ek **hierarchy** banाते hain — \`ROLLUP (year, quarter, month)\`. Ye \`b\` akele ya \`c\` akele ke liye subtotal **nahi** deता.

## \`CUBE\` — har combination

\`CUBE (a, b, c)\` **sabhi 2^n** grouping sets generate karता hai. Ise tab istemal karo jab columns **independent dimensions** hain. \`CUBE\` of 5 columns = 32 grouping sets — jaldi mehnga.

## \`GROUPING(col)\` — real \`NULL\` vs subtotal \`NULL\`

Ek subtotal row mein, "rolled-up" columns \`NULL\` output hote hain. Par aapke data mein us column mein ek genuine \`NULL\` **bhi** ho sakta hai. \`region = NULL\` ka matlab "sabhi regions ka subtotal" **ya** "bina region ki sales" ho sakta hai.

\`GROUPING(col)\` disambiguate karता hai: **\`1\`** agar \`col\` is row mein rolled up tha, **\`0\`** agar \`col\` ek real grouping value hai (ek real \`NULL\` sहित).

\`\`\`sql
SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'All regions'
       ELSE coalesce(region, '(no region)') END AS region,
  sum(amt)
FROM fs
GROUP BY ROLLUP (region);
\`\`\`

## Output order

Grouping-set queries implementation-defined order mein rows lautाते hain. Common pattern:

\`\`\`sql
ORDER BY GROUPING(region), region, GROUPING(product), product;
\`\`\`

## Kaunsa kab

| situation | istemal |
|---|---|
| columns ek drill-down hierarchy banाते hain | \`ROLLUP\` |
| columns independent, sabhi subtotals chahिए | \`CUBE\` |
| ek specific set of levels chahिए | \`GROUPING SETS\` |
| sirf detail | plain \`GROUP BY\` |

Ye read-heavy analytical features hain. Ek OLTP endpoint ke liye plain \`GROUP BY\` sahi hai; \`ROLLUP\`/\`CUBE\` reporting aur BI queries mein chamakते hain.`,

    examples: [
      {
        title: 'ROLLUP: detail rows, a subtotal per region, and a grand total',
        titleHi: 'ROLLUP: detail rows, prati region ek subtotal, aur ek grand total',
        code: `CREATE TABLE fs (region text, product text, amt int);
INSERT INTO fs VALUES
  ('N', 'W', 100), ('N', 'G', 50), ('S', 'W', 200), ('S', 'G', 25);

SELECT region, product, sum(amt) AS total
FROM fs
GROUP BY ROLLUP (region, product)
ORDER BY region NULLS LAST, product NULLS LAST;`,
        output: ` region | product | total
--------+---------+-------
 N      | G       | 50
 N      | W       | 100
 N      | NULL    | 150
 S      | G       | 25
 S      | W       | 200
 S      | NULL    | 225
 NULL   | NULL    | 375
(7 rows)`,
        explain: '`ROLLUP (region, product)` expands to the grouping sets `(region, product)`, `(region)`, `()`. So you get: the 4 detail rows; then for each region a subtotal row where `product` is `NULL` meaning "all products" (`N` -> 150, `S` -> 225); then one grand-total row where BOTH are `NULL` (375). 7 rows from one pass over the table.',
        explainHi: '`ROLLUP (region, product)` grouping sets `(region, product)`, `(region)`, `()` mein expand hoता hai. To aapको milता hai: 4 detail rows; phir har region ke liye ek subtotal row jahaan `product` `NULL` hai matlab "sabhi products" (`N` -> 150, `S` -> 225); phir ek grand-total row jahaan DONO `NULL` hain (375). Table par ek pass se 7 rows.',
      },
      {
        title: 'GROUPING() turns the subtotal NULLs into readable labels',
        titleHi: 'GROUPING() subtotal NULLs ko readable labels mein badalta hai',
        code: `CREATE TABLE fs (region text, product text, amt int);
INSERT INTO fs VALUES
  ('N', 'W', 100), ('N', 'G', 50), ('S', 'W', 200), ('S', 'G', 25);

SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'ALL' ELSE region END AS region,
  CASE WHEN GROUPING(product) = 1 THEN 'ALL' ELSE product END AS product,
  sum(amt) AS total
FROM fs
GROUP BY ROLLUP (region, product)
ORDER BY GROUPING(region), region, GROUPING(product), product;`,
        output: ` region | product | total
--------+---------+-------
 N      | G       | 50
 N      | W       | 100
 N      | ALL     | 150
 S      | G       | 25
 S      | W       | 200
 S      | ALL     | 225
 ALL    | ALL     | 375
(7 rows)`,
        explain: 'Same `ROLLUP` as before, but `GROUPING(region)` returns `1` when this row is a subtotal OVER region (and `0` for a real region value), so the `CASE` prints `ALL` there instead of a bare `NULL`. This is essential once the data can contain a genuine `NULL` region — `GROUPING()` is the only way to tell "subtotal across regions" apart from "the no-region group". `ORDER BY GROUPING(region), region` keeps detail rows above their subtotal.',
        explainHi: 'Pehle jaisा `ROLLUP`, par `GROUPING(region)` `1` lautाता hai jab ye row region PAR ek subtotal hai (aur ek real region value ke liye `0`), to `CASE` wahaan bare `NULL` ke bजाy `ALL` print karता hai. Ye zaroori hai jab data mein ek genuine `NULL` region ho sakta hai — `GROUPING()` "regions par subtotal" ko "no-region group" se alag batane ka ek matra tarika hai.',
      },
      {
        title: 'GROUPING SETS: exactly the levels you ask for (no detail rows here)',
        titleHi: 'GROUPING SETS: theek wo levels jo aap maangte ho (yahaan koi detail rows nahi)',
        code: `CREATE TABLE fs (region text, product text, amt int);
INSERT INTO fs VALUES
  ('N', 'W', 100), ('N', 'G', 50), ('S', 'W', 200), ('S', 'G', 25);

SELECT region, product, sum(amt) AS total
FROM fs
GROUP BY GROUPING SETS ((region), (product), ())
ORDER BY region NULLS LAST, product NULLS LAST;`,
        output: ` region | product | total
--------+---------+-------
 N      | NULL    | 150
 S      | NULL    | 225
 NULL   | G       | 75
 NULL   | W       | 300
 NULL   | NULL    | 375
(5 rows)`,
        explain: '`GROUPING SETS ((region), (product), ())` asks for EXACTLY three levels and nothing else — note there is NO detail `(region, product)` row here. You get: one row per region (product `NULL`), one row per product (region `NULL`), and the grand total (both `NULL`). This is the manual form `ROLLUP` and `CUBE` are shorthands for.',
        explainHi: '`GROUPING SETS ((region), (product), ())` THEEK teen levels maangता hai aur kuch nahi — note yahaan KOI detail `(region, product)` row nahi. Aapको milता hai: prati region ek row (product `NULL`), prati product ek row (region `NULL`), aur grand total (dono `NULL`). Ye manual form hai jiske `ROLLUP` aur `CUBE` shorthands hain.',
      },
    ],

    mistakes: [
      {
        wrong: `-- detail + subtotals, built by hand
SELECT region, product, sum(amt) FROM fs GROUP BY region, product
UNION ALL
SELECT region, NULL, sum(amt) FROM fs GROUP BY region
UNION ALL
SELECT NULL, NULL, sum(amt) FROM fs;
-- three scans of fs, and easy to get out of sync when the query changes`,
        right: `SELECT region, product, sum(amt)
FROM fs
GROUP BY ROLLUP (region, product);`,
        why: 'The UNION ALL approach works but scans the base table once per level, three times here, and the three branches must be kept consistent by hand: change the filter or the measure in one and forget the others and the subtotals silently stop matching the detail. ROLLUP expresses the same intent in one clause, the database computes all the levels in a single pass over the data, and there is only one copy of the filter and the aggregate to maintain. Use GROUPING SETS if you need a combination of levels that ROLLUP\'s strict hierarchy does not produce.',
        whyHi: 'UNION ALL approach chalta hai par base table ko prati level ek baar scan karता hai, yahaan teen baar, aur teen branches ko haath se consistent rakhna padta hai: ek mein filter ya measure badlो aur doosre bhool jao aur subtotals chupchaap detail se match karna band kar dete hain. ROLLUP wahi intent ek clause mein express karता hai, database sabhi levels ek single pass mein compute karता hai. GROUPING SETS istemal karo agar aapko levels ka ek combination chahिए jo ROLLUP ki strict hierarchy produce nahi karти.',
      },
      {
        wrong: `-- report over data that has real NULL regions
SELECT region, sum(amt) FROM fs GROUP BY ROLLUP (region);
-- output has TWO rows with region = NULL: the "no region recorded" group
-- and the grand total -- indistinguishable`,
        right: `SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'GRAND TOTAL'
       ELSE coalesce(region, '(no region)') END AS region,
  sum(amt)
FROM fs
GROUP BY ROLLUP (region)
ORDER BY GROUPING(region), region;`,
        why: 'ROLLUP emits the rolled-up column as NULL in subtotal rows. If the underlying data also has genuine NULLs in region, the result now contains two different kinds of NULL region row, one meaning "sales with no region", one meaning "all regions combined", and nothing in the plain output tells them apart. GROUPING of region returns 1 only for the true rollup row and 0 for real grouping values including a real NULL, so a CASE on GROUPING lets you label the grand total distinctly and coalesce the real NULL to its own label. Ordering by GROUPING of region also keeps the total row at the bottom instead of sorting in with a NULL key.',
        whyHi: 'ROLLUP subtotal rows mein rolled-up column ko NULL emit karता hai. Agar underlying data mein region mein genuine NULLs bhi hain, result mein ab do alag tarah ki NULL region row hain, ek matlab "bina region ki sales", ek matlab "sabhi regions milाkar". GROUPING of region sirf true rollup row ke liye 1 lautाता hai aur real grouping values ke liye 0 ek real NULL sहित. GROUPING par ek CASE aapko grand total ko distinctly label karने deta hai.',
      },
      {
        wrong: `-- want subtotals by region AND by product, used ROLLUP
SELECT region, product, sum(amt) FROM fs GROUP BY ROLLUP (region, product);
-- gives subtotal per REGION and the grand total, but NO subtotal per product`,
        right: `-- CUBE for every combination, or GROUPING SETS to name them
SELECT region, product, sum(amt) FROM fs GROUP BY CUBE (region, product);
-- or: GROUP BY GROUPING SETS ((region, product), (region), (product), ())`,
        why: 'ROLLUP is hierarchical: ROLLUP of region comma product produces the detail, then peels columns off the right, giving a subtotal per region and then the grand total. It never holds region constant-as-rolled-up while grouping by product, so there is no "product across all regions" subtotal. If you want that, CUBE generates all two-to-the-n combinations including the per-product level, or you spell out exactly the sets you want with GROUPING SETS. Choose ROLLUP only when the columns really are a nested hierarchy such as year, quarter, month.',
        whyHi: 'ROLLUP hierarchical hai: ROLLUP of region comma product detail produce karता hai, phir right se columns peel karता hai, prati region ek subtotal aur phir grand total deता hai. Ye kabhi region ko rolled-up constant rakhkर product se group nahi karता, to koi "sabhi regions par product" subtotal nahi. Agar aap wo chahте ho, CUBE sabhi combinations generate karता hai, ya aap GROUPING SETS se theek wo sets likhते ho. ROLLUP sirf tab chuno jab columns sach mein ek nested hierarchy hain.',
      },
    ],

    realWorld: [
      {
        en: '**A finance "P&L by cost centre" export using `ROLLUP (division, department, cost_centre)`** — the accountants get leaf rows, department subtotals, division subtotals, and the company total from one query.',
        hi: '**Ek finance "P&L by cost centre" export `ROLLUP (division, department, cost_centre)` ke saath** — accountants ko ek query se sabhi levels milते hain.',
      },
      {
        en: '**A BI dashboard tile backed by `CUBE (region, channel)`** so the UI can show revenue sliced by region, by channel, by both, or overall without four round trips.',
        hi: '**Ek BI dashboard tile `CUBE (region, channel)` se backed** taaki UI revenue ko kई tarah slice kar sake bina chaar round trips.',
      },
      {
        en: '**A `GROUPING SETS ((date), (date, product), ())` query feeding a report** that needs a daily total line and a daily-per-product breakdown but explicitly not an all-time-per-product number.',
        hi: '**Ek `GROUPING SETS ((date), (date, product), ())` query jo ek report feed karti hai** jise daily total aur daily-per-product breakdown chahिए par all-time-per-product nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `ROLLUP`, `CUBE`, and `GROUPING SETS`?',
        qHi: '`ROLLUP`, `CUBE`, aur `GROUPING SETS` mein kya antar hai?',
        a: 'They are all ways to compute several aggregation levels in one query, and they all desugar to GROUPING SETS, which is the general form. GROUPING SETS takes an explicit list of column groupings, and the query runs the aggregation once per grouping and unions the results; the empty parentheses set means the grand total. ROLLUP of a, b, c is shorthand for a hierarchy: the full detail on a, b, c, then a, b, then a, then the grand total, peeling one column off the right each step. You use it when the columns nest, like year then quarter then month, and you want each parent level\'s subtotal. CUBE of a, b, c is shorthand for every subset of the columns, two to the power n grouping sets, so you get every possible combination of subtotals: by a, by b, by c, by each pair, by all three, and overall. You use it when the columns are independent dimensions and you want all the cross-tabs. The cost scales: CUBE of five columns is thirty-two grouping sets and thirty-two aggregation passes\' worth of work, so it is a reporting tool, not something for a hot OLTP path.',
        aHi: 'Wo sab ek query mein kई aggregation levels compute karने ke tarike hain, aur wo sab GROUPING SETS mein desugar hote hain, jo general form hai. GROUPING SETS column groupings ki ek explicit list leता hai, aur query prati grouping ek baar aggregation chalाती hai aur results union karती hai; empty parentheses set grand total hai. ROLLUP of a, b, c ek hierarchy ke liye shorthand hai: a, b, c par full detail, phir a, b, phir a, phir grand total. Aap ise tab istemal karते ho jab columns nest karते hain. CUBE of a, b, c columns ke har subset ke liye shorthand hai, do ki power n grouping sets. Cost scale karता hai: CUBE of paanch columns battis grouping sets hai.',
      },
      {
        q: 'What does the `GROUPING()` function do and why do you need it?',
        qHi: '`GROUPING()` function kya karता hai aur aapko iski zaroorat kyun hai?',
        a: 'In a ROLLUP, CUBE, or GROUPING SETS query, a subtotal row represents "aggregated over this column", and the database renders that column as NULL in those rows. The problem is that your actual data may also contain real NULLs in the same column, a sale with no region recorded, an order with no assigned rep. So a row with region NULL is ambiguous: it could be the subtotal across all regions, or it could be the group of rows whose region really is NULL. GROUPING of region resolves this. It returns 1 if region was rolled up in that row, that is, the row is a subtotal or grand total over region, and 0 if region holds a genuine grouping value, including a genuine NULL. So you write a CASE: when GROUPING of region is 1, print "All regions" or "Total"; otherwise print coalesce of region and "no region". You also commonly order by GROUPING of the columns so the subtotal and total rows sort to the end rather than mixing in wherever a NULL key would land.',
        aHi: 'Ek ROLLUP, CUBE, ya GROUPING SETS query mein, ek subtotal row "is column par aggregated" represent karता hai, aur database us column ko un rows mein NULL render karता hai. Problem ye hai ki aapke actual data mein usi column mein real NULLs bhi ho sakte hain. To region NULL waali ek row ambiguous hai: ye sabhi regions ka subtotal ho sakta hai, ya wo rows ka group jinka region sach mein NULL hai. GROUPING of region ise resolve karता hai. Ye 1 lautाता hai agar region us row mein rolled up tha, aur 0 agar region ek genuine grouping value rakhता hai, ek genuine NULL sहित. To aap ek CASE likhते ho. Aap columns ke GROUPING se order bhi karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Table `fs(region text, product text, amt int)` with 4 rows (2 regions x 2 products). Run `GROUP BY ROLLUP (region, product)` and count the output rows (should be 7: 4 detail + 2 region subtotals + 1 grand total). Identify which row is the grand total (`region` and `product` both `NULL`).',
        taskHi: 'Table `fs(region, product, amt)` 4 rows ke saath. `GROUP BY ROLLUP (region, product)` chalao aur output rows gino (7 hone chahिए). Grand total row pehchano.',
        hint: 'ROLLUP (a, b) = grouping sets (a,b), (a), (). 4 detail + one subtotal per region (2) + one grand total = 7. The grand total has both columns `NULL`.',
        hintHi: 'ROLLUP (a, b) = grouping sets (a,b), (a), (). 4 + 2 + 1 = 7. Grand total mein dono columns `NULL`.',
      },
      {
        task: 'Same table. Run `GROUP BY CUBE (region, product)` and confirm you get 9 rows — the 7 from `ROLLUP` PLUS a subtotal for each product across regions. Then write the equivalent `GROUPING SETS (...)` clause explicitly (4 sets).',
        taskHi: 'Wahi table. `GROUP BY CUBE (region, product)` chalao aur confirm karo 9 rows milती hain. Phir equivalent `GROUPING SETS (...)` clause explicitly likho.',
        hint: 'CUBE (region, product) = GROUPING SETS ((region, product), (region), (product), ()). The extra 2 rows vs ROLLUP are `(NULL, product)` subtotals.',
        hintHi: 'CUBE (region, product) = GROUPING SETS ((region, product), (region), (product), ()). Extra 2 rows `(NULL, product)` subtotals hain.',
      },
      {
        task: 'Add a row with `region = NULL` (a real missing region) to `fs`. Run `GROUP BY ROLLUP (region)` and observe two `NULL` rows. Rewrite with `CASE WHEN GROUPING(region) = 1 THEN \'TOTAL\' ELSE coalesce(region, \'(none)\') END` and confirm the grand total is now labelled `TOTAL` while the real-NULL group shows `(none)`.',
        taskHi: '`fs` mein `region = NULL` waali ek row add karo. `GROUP BY ROLLUP (region)` chalao aur do `NULL` rows dekho. `CASE WHEN GROUPING(region) = 1 THEN \'TOTAL\' ELSE coalesce(region, \'(none)\') END` se rewrite karo.',
        hint: '`GROUPING(region)` is `1` only for the rollup total row and `0` for the real-NULL group. That is the only way to tell the two `NULL` rows apart.',
        hintHi: '`GROUPING(region)` sirf rollup total row ke liye `1` hai aur real-NULL group ke liye `0`. Do `NULL` rows ko alag batane ka yahi tarika hai.',
      },
    ],

    keyTakeaways: [
      'Plain `GROUP BY a, b` = detail rows only. `GROUPING SETS`/`ROLLUP`/`CUBE` compute MULTIPLE aggregation levels (detail + subtotals + grand total) in ONE pass — replacing a hand-built `UNION ALL` per level (N scans, drifts out of sync).',
      '`GROUPING SETS ((a,b), (a), (b), ())` = the general form: run the aggregation once per listed set, `UNION ALL` the results. `()` = grand total. A column not in a set comes out `NULL` for those rows.',
      '`ROLLUP (a, b, c)` = HIERARCHICAL shorthand: `(a,b,c)`, `(a,b)`, `(a)`, `()` — peels one column off the RIGHT each step. Use for nested hierarchies (`year, quarter, month`). Does NOT give a subtotal for `b` alone or `c` alone.',
      '`CUBE (a, b, c)` = ALL 2^n subsets — every possible combination of subtotals. Use for INDEPENDENT dimensions. Scales hard: `CUBE` of 5 columns = 32 grouping sets. Reporting/BI tool, not a hot OLTP path.',
      'Subtotal rows render the rolled-up column as `NULL` — INDISTINGUISHABLE from a real `NULL` in the data. `GROUPING(col)` returns `1` if `col` was rolled up in this row, `0` if it holds a real grouping value (incl. a real `NULL`).',
      'Label subtotals with `CASE WHEN GROUPING(region) = 1 THEN \'ALL\' ELSE coalesce(region, \'(none)\') END`. Sort them last with `ORDER BY GROUPING(region), region, GROUPING(product), product` (output order is otherwise implementation-defined).',
      'Pick: hierarchy -> `ROLLUP`; independent dims, want all subtotals -> `CUBE`; a specific custom set of levels -> `GROUPING SETS`; just detail -> plain `GROUP BY`.',
    ],
    keyTakeawaysHi: [
      'Plain `GROUP BY a, b` = sirf detail rows. `GROUPING SETS`/`ROLLUP`/`CUBE` Kई aggregation levels (detail + subtotals + grand total) EK pass mein compute karते hain — prati level ek hand-built `UNION ALL` ki jagah.',
      '`GROUPING SETS ((a,b), (a), (b), ())` = general form: prati listed set ek baar aggregation chalao, results `UNION ALL`. `()` = grand total. Ek set mein na hone waala column un rows ke liye `NULL` aata hai.',
      '`ROLLUP (a, b, c)` = HIERARCHICAL shorthand: `(a,b,c)`, `(a,b)`, `(a)`, `()` — har step RIGHT se ek column peel karता hai. Nested hierarchies ke liye. `b` akele ke liye subtotal NAHI deता.',
      '`CUBE (a, b, c)` = SABHI 2^n subsets. INDEPENDENT dimensions ke liye. Hard scale: `CUBE` of 5 columns = 32 grouping sets. Reporting/BI tool.',
      'Subtotal rows rolled-up column ko `NULL` render karते hain — data mein ek real `NULL` se INDISTINGUISHABLE. `GROUPING(col)` `1` lautाता hai agar `col` is row mein rolled up tha, `0` agar ye ek real grouping value rakhता hai.',
      'Subtotals ko `CASE WHEN GROUPING(region) = 1 THEN \'ALL\' ELSE coalesce(region, \'(none)\') END` se label karo. `ORDER BY GROUPING(region), region, ...` se last sort karo.',
      'Chuno: hierarchy -> `ROLLUP`; independent dims -> `CUBE`; ek specific custom set -> `GROUPING SETS`; sirf detail -> plain `GROUP BY`.',
    ],
  },

  {
    slug: 'sql-group-by-with-joins-and-fan-out',
    title: 'GROUP BY With Joins: The Fan-Out Bug, Fixed',
    titleHi: 'GROUP BY Joins Ke Saath: Fan-Out Bug, Fixed',
    description: 'Joining before you aggregate is where `sum` and `count` most often go wrong. A join to a one-to-many table multiplies rows, so the aggregate double-counts. This lesson is the aggregation-focused drill on spotting it and the three reliable fixes.',
    descriptionHi: 'Aggregate karne se pehle join karna wo jagah hai jahaan `sum` aur `count` sabse zyada galat hote hain. Ek one-to-many table ka join rows multiply karता hai, to aggregate double-count karता hai. Ye lesson ise spot karne aur teen reliable fixes ka aggregation-focused drill hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Counting a company\'s total salary bill from a printout that has one line per (employee, project).** HR gives you a sheet where an employee on three projects appears on three lines, their name and salary repeated on each. If you naively sum the "salary" column you get that person\'s salary counted three times, and your total salary bill comes out wildly inflated — not because any number is wrong, but because the join to the projects list duplicated each employee\'s row. The fixes are the same three every time. One: count distinct people, or sum salary only over distinct employee ids. Two: total the salaries from the *employee* sheet on its own, before it ever meets the projects sheet. Three: if you must work from the combined sheet, first collapse the projects sheet to "number of projects per employee" so each employee is one line again, then join. The moment a query has a `GROUP BY` and a `sum` sitting on top of a join to a "child" table, this is the first thing to check.',
      hi: '**Ek company ka total salary bill ek printout se count karna jisme prati (employee, project) ek line hai.** HR aapko ek sheet deता hai jahaan teen projects par ek employee teen lines par aata hai, unka name aur salary har ek par repeated. Agar aap naively "salary" column sum karते ho aapको us vyakti ki salary teen baar counted milती hai, aur aapka total salary bill bahut inflated aata hai — isliye nahi ki koi number galat hai, balki isliye ki projects list ke join ne har employee ki row duplicate kar di. Fixes har baar wahi teen hain. Ek: distinct people count karo. Do: salaries ko *employee* sheet se akele total karo, projects sheet se milne se pehle. Teen: agar aapको combined sheet se kaam karna hai, pehle projects sheet ko "prati employee projects ki sankhya" mein collapse karo. Jis pal ek query mein ek `GROUP BY` aur ek `sum` ek "child" table ke join ke upar baithा ho, ye pehli cheez check karne ki hai.',
    },

    simple: `**The bug: a one-to-many join multiplies rows, so the aggregate double-counts**

\`\`\`sql
-- customer 1:N orders, customer 1:N payments
SELECT c.name, sum(o.total) AS order_total, sum(p.amount) AS pay_total
FROM customer c
JOIN orders   o ON o.customer_id = c.id     -- 3 orders
JOIN payments p ON p.customer_id = c.id     -- 2 payments
GROUP BY c.name;
-- 3 x 2 = 6 rows per customer -> order_total counted 2x, pay_total counted 3x -- BOTH wrong
\`\`\`

**Fix 1 — aggregate each child FIRST, then join the one-row-per-key result**

\`\`\`sql
SELECT c.name, o.t AS order_total, p.t AS pay_total
FROM customer c
LEFT JOIN (SELECT customer_id, sum(total)  AS t FROM orders   GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, sum(amount) AS t FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
\`\`\`

**Fix 2 — independent scalar subqueries (no join for the aggregates)**

\`\`\`sql
SELECT c.name,
  (SELECT sum(total)  FROM orders   WHERE customer_id = c.id) AS order_total,
  (SELECT sum(amount) FROM payments WHERE customer_id = c.id) AS pay_total
FROM customer c;
\`\`\`

**Fix 3 — \`count(DISTINCT ...)\` when you only need a count**

\`\`\`sql
-- WRONG: count(*) after a fan-out join counts child rows
SELECT count(*) FROM customer c JOIN orders o ON o.customer_id = c.id;
-- RIGHT:
SELECT count(DISTINCT c.id) FROM customer c JOIN orders o ON o.customer_id = c.id;
\`\`\`

**\`LEFT JOIN\` + \`GROUP BY\`: use \`count(child.col)\`, not \`count(*)\`**

\`\`\`sql
SELECT c.name, count(p.id) AS n_products     -- 0 for a category with no products
FROM category c
LEFT JOIN product p ON p.category_id = c.id
GROUP BY c.name;
-- count(*) would give 1 for an empty category (the NULL-padded row)
\`\`\``,

    simpleHi: `**Bug: ek one-to-many join rows multiply karता hai, to aggregate double-count karता hai**

\`\`\`sql
-- customer 1:N orders, customer 1:N payments
SELECT c.name, sum(o.total) AS order_total, sum(p.amount) AS pay_total
FROM customer c
JOIN orders   o ON o.customer_id = c.id     -- 3 orders
JOIN payments p ON p.customer_id = c.id     -- 2 payments
GROUP BY c.name;
-- 3 x 2 = 6 rows prati customer -> order_total 2x counted, pay_total 3x counted -- DONO galat
\`\`\`

**Fix 1 — har child ko PEHLE aggregate karo, phir one-row-per-key result join karo**

\`\`\`sql
SELECT c.name, o.t AS order_total, p.t AS pay_total
FROM customer c
LEFT JOIN (SELECT customer_id, sum(total)  AS t FROM orders   GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, sum(amount) AS t FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
\`\`\`

**Fix 2 — independent scalar subqueries (aggregates ke liye koi join nahi)**

\`\`\`sql
SELECT c.name,
  (SELECT sum(total)  FROM orders   WHERE customer_id = c.id) AS order_total,
  (SELECT sum(amount) FROM payments WHERE customer_id = c.id) AS pay_total
FROM customer c;
\`\`\`

**Fix 3 — \`count(DISTINCT ...)\` jab aapko sirf ek count chahिए**

\`\`\`sql
-- GALAT: fan-out join ke baad count(*) child rows ginता hai
SELECT count(*) FROM customer c JOIN orders o ON o.customer_id = c.id;
-- SAHI:
SELECT count(DISTINCT c.id) FROM customer c JOIN orders o ON o.customer_id = c.id;
\`\`\`

**\`LEFT JOIN\` + \`GROUP BY\`: \`count(child.col)\` istemal karo, \`count(*)\` nahi**

\`\`\`sql
SELECT c.name, count(p.id) AS n_products     -- bina products waali category ke liye 0
FROM category c
LEFT JOIN product p ON p.category_id = c.id
GROUP BY c.name;
-- count(*) ek empty category ke liye 1 deता (NULL-padded row)
\`\`\``,

    content: `## Why this deserves its own lesson

Module 3 introduced fan-out. This lesson drills it from the **aggregation** side, because "a \`GROUP BY\` query whose numbers are silently too big" is one of the most common production data bugs, and the fix is a specific, repeatable pattern.

## The mechanism, precisely

A join to a table on the **many** side of a one-to-many relationship repeats each parent row once per matching child. If you then aggregate a **parent** column, or aggregate across **two** child tables, the repetition inflates the result:

- **One child, aggregating a parent column:** \`customer JOIN orders\`, then \`sum(c.credit_limit)\` — the limit is added once per order.
- **Two children:** \`customer JOIN orders JOIN payments\` — a customer with 3 orders and 2 payments produces **3 × 2 = 6** rows. \`sum(orders.total)\` counts each order **twice** (once per payment); \`sum(payments.amount)\` counts each payment **three times**. The two inflation factors differ, so there is no single divisor that fixes it.

## Fix 1: aggregate before the join

Collapse each child table to **one row per join key** in a subquery, then join those pre-aggregated rows. Now every join is one-to-one and nothing multiplies:

\`\`\`sql
SELECT c.name,
       coalesce(o.order_total, 0)   AS order_total,
       coalesce(p.payment_total, 0) AS payment_total
FROM customer c
LEFT JOIN (
  SELECT customer_id, sum(total) AS order_total
  FROM orders GROUP BY customer_id
) o ON o.customer_id = c.id
LEFT JOIN (
  SELECT customer_id, sum(amount) AS payment_total
  FROM payments GROUP BY customer_id
) p ON p.customer_id = c.id;
\`\`\`

This is the **general-purpose** fix — it works for any number of child tables and any aggregate. \`LEFT JOIN\` + \`coalesce\` keeps customers with no orders/payments (showing \`0\`).

## Fix 2: independent scalar subqueries

Put each aggregate in its own correlated subquery in the \`SELECT\` list. No join, no fan-out:

\`\`\`sql
SELECT c.name,
  (SELECT coalesce(sum(total), 0)  FROM orders   WHERE customer_id = c.id) AS order_total,
  (SELECT coalesce(sum(amount), 0) FROM payments WHERE customer_id = c.id) AS payment_total
FROM customer c;
\`\`\`

Clear and obviously correct. Can be slower than Fix 1 when there are many parent rows and the subqueries are not well-indexed, because each runs once per output row (Module 5 covers the trade-off).

## Fix 3: \`count(DISTINCT ...)\` for counts

When the inflated aggregate is a **count**, \`count(DISTINCT the_key)\` collapses the duplicates cheaply:

\`\`\`sql
-- "how many customers have at least one order AND at least one payment"
SELECT count(DISTINCT c.id)
FROM customer c
JOIN orders   o ON o.customer_id = c.id
JOIN payments p ON p.customer_id = c.id;
\`\`\`

\`count(*)\` here would be the 6-per-customer fanned figure. Note \`sum(DISTINCT x)\` is **not** a valid analogue — two orders can legitimately have the same total, and \`DISTINCT\` would wrongly merge them. \`count(DISTINCT)\` works only because ids are unique.

For "does a related row exist" with no aggregation at all, prefer \`EXISTS\` (Module 3, Lesson 5) — it never fans out.

## \`LEFT JOIN\` + \`GROUP BY\`: \`count(col)\` not \`count(*)\`

To count children per parent **including parents with zero**, \`LEFT JOIN\` the child and \`GROUP BY\` the parent — but count a **non-null child column**, not \`*\`:

\`\`\`sql
SELECT c.name,
       count(p.id)      AS real_count,   -- 0 for a childless category
       count(*)         AS wrong_count   -- 1 for a childless category (the NULL-padded row)
FROM category c
LEFT JOIN product p ON p.category_id = c.id
GROUP BY c.name;
\`\`\`

A category with no products still produces **one row** from the \`LEFT JOIN\` (all \`product\` columns \`NULL\`). \`count(*)\` counts that row as \`1\`; \`count(p.id)\` skips it (the id is \`NULL\`) and correctly reports \`0\`.

## The checklist

When a grouped query's totals look too high:

1. Does the \`FROM\` join to **more than one** child table (many-per-key)? → fan-out; use Fix 1 or 2.
2. Does it aggregate a **parent** column after joining a child? → fan-out; aggregate the parent separately.
3. Is it a \`count(*)\` after a fan-out join where you meant "distinct parents"? → \`count(DISTINCT)\`.
4. Is it \`count(*)\` after a \`LEFT JOIN\` where empty groups show \`1\`? → \`count(child_column)\`.`,

    contentHi: `## Ise apna lesson kyun chahिए

Module 3 ne fan-out introduce kiya. Ye lesson ise **aggregation** side se drill karता hai, kyunki "ek \`GROUP BY\` query jiske numbers chupchaap bahut bade hain" sabse common production data bugs mein se ek hai, aur fix ek specific, repeatable pattern hai.

## Mechanism, theek se

Ek one-to-many relationship ke **many** side par ek table ka join har parent row ko prati matching child ek baar repeat karता hai. Agar aap phir ek **parent** column aggregate karते ho, ya **do** child tables par aggregate karते ho, repetition result inflate karता hai:

- **Ek child, ek parent column aggregate:** \`customer JOIN orders\`, phir \`sum(c.credit_limit)\` — limit prati order ek baar add hoती hai.
- **Do children:** \`customer JOIN orders JOIN payments\` — 3 orders aur 2 payments waala customer **3 × 2 = 6** rows produce karता hai. \`sum(orders.total)\` har order **do baar** ginता hai; \`sum(payments.amount)\` har payment **teen baar**. Do inflation factors alag hain.

## Fix 1: join se pehle aggregate karo

Har child table ko ek subquery mein **prati join key ek row** mein collapse karo, phir un pre-aggregated rows ko join karo:

\`\`\`sql
SELECT c.name,
       coalesce(o.order_total, 0)   AS order_total,
       coalesce(p.payment_total, 0) AS payment_total
FROM customer c
LEFT JOIN (SELECT customer_id, sum(total) AS order_total FROM orders GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, sum(amount) AS payment_total FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
\`\`\`

Ye **general-purpose** fix hai. \`LEFT JOIN\` + \`coalesce\` bina orders/payments waale customers rakhता hai.

## Fix 2: independent scalar subqueries

Har aggregate ko \`SELECT\` list mein apni correlated subquery mein daalo. Koi join, koi fan-out nahi. Saaf aur obviously sahi. Fix 1 se slower ho sakta hai jab bahut parent rows hain (Module 5).

## Fix 3: counts ke liye \`count(DISTINCT ...)\`

Jab inflated aggregate ek **count** hai, \`count(DISTINCT the_key)\` duplicates saste mein collapse karता hai. \`sum(DISTINCT x)\` ek valid analogue **nahi** hai — do orders legitimately same total rakh sakte hain.

"Kya ek related row hai" ke liye bina aggregation ke, \`EXISTS\` prefer karo (Module 3) — ye kabhi fan out nahi karता.

## \`LEFT JOIN\` + \`GROUP BY\`: \`count(col)\`, \`count(*)\` nahi

Prati parent children count karने ke liye **zero waale parents sहित**, child ko \`LEFT JOIN\` karo aur parent se \`GROUP BY\` — par ek **non-null child column** count karo, \`*\` nahi:

\`\`\`sql
SELECT c.name, count(p.id) AS real_count, count(*) AS wrong_count
FROM category c LEFT JOIN product p ON p.category_id = c.id
GROUP BY c.name;
\`\`\`

Bina products waali category phir bhi \`LEFT JOIN\` se **ek row** produce karती hai. \`count(*)\` use \`1\` ginता hai; \`count(p.id)\` ise skip karता hai aur sahi \`0\` report karता hai.

## Checklist

Jab ek grouped query ke totals bahut high dikhें:

1. Kya \`FROM\` **ek se zyada** child table se join karता hai? → fan-out; Fix 1 ya 2.
2. Kya ye ek child join karne ke baad ek **parent** column aggregate karता hai? → parent ko alag aggregate karo.
3. Kya ye ek fan-out join ke baad ek \`count(*)\` hai jahaan aapka matlab "distinct parents" tha? → \`count(DISTINCT)\`.
4. Kya ye ek \`LEFT JOIN\` ke baad \`count(*)\` hai jahaan empty groups \`1\` dikhाते hain? → \`count(child_column)\`.`,

    examples: [
      {
        title: 'Two child joins inflate both sums; aggregate-before-join is correct',
        titleHi: 'Do child joins dono sums inflate karte hain; aggregate-before-join sahi hai',
        code: `CREATE TABLE cust (id int, name text);
INSERT INTO cust VALUES (1, 'Acme');
CREATE TABLE ordr (id int, cust_id int, total int);
INSERT INTO ordr VALUES (10, 1, 100), (11, 1, 200);        -- real order total 300
CREATE TABLE pay (id int, cust_id int, amt int);
INSERT INTO pay VALUES (20, 1, 120), (21, 1, 180);         -- real payment total 300

-- WRONG: 2 orders x 2 payments = 4 rows -> both sums doubled
SELECT c.name, sum(o.total) AS order_total, sum(p.amt) AS pay_total
FROM cust c JOIN ordr o ON o.cust_id = c.id JOIN pay p ON p.cust_id = c.id
GROUP BY c.name;

-- RIGHT: pre-aggregate each child to one row per customer
SELECT c.name, ot.t AS order_total, pt.t AS pay_total
FROM cust c
LEFT JOIN (SELECT cust_id, sum(total) AS t FROM ordr GROUP BY cust_id) ot ON ot.cust_id = c.id
LEFT JOIN (SELECT cust_id, sum(amt)   AS t FROM pay  GROUP BY cust_id) pt ON pt.cust_id = c.id;`,
        output: ` name | order_total | pay_total
------+-------------+-----------
 Acme | 600         | 600
(1 row)

 name | order_total | pay_total
------+-------------+-----------
 Acme | 300         | 300
(1 row)`,
        explain: 'Acme has 2 orders (real total 300) and 2 payments (real total 300). Joining `cust` to BOTH children produces `2 x 2 = 4` rows, so `sum(o.total)` adds each order twice -> 600 and `sum(p.amt)` adds each payment twice -> 600. The fix pre-aggregates each child to one row per customer in a subquery, then `LEFT JOIN`s those — now the joins are one-to-one and the sums are the true `300` / `300`.',
        explainHi: 'Acme ke 2 orders (real total 300) aur 2 payments (real total 300) hain. `cust` ko DONO children se join karna `2 x 2 = 4` rows produce karता hai, to `sum(o.total)` har order do baar jodता hai -> 600 aur `sum(p.amt)` har payment do baar -> 600. Fix har child ko ek subquery mein prati customer ek row mein pre-aggregate karता hai, phir unhe `LEFT JOIN` — ab joins one-to-one hain aur sums sahi `300` / `300` hain.',
      },
      {
        title: 'LEFT JOIN + GROUP BY: count(child.col) gives 0, count(*) wrongly gives 1',
        titleHi: 'LEFT JOIN + GROUP BY: count(child.col) 0 deta hai, count(*) galat 1 deta hai',
        code: `CREATE TABLE cat (id int, name text);
INSERT INTO cat VALUES (1, 'A'), (2, 'B'), (3, 'C');   -- C has no products
CREATE TABLE prod (id int, cat_id int);
INSERT INTO prod VALUES (100, 1), (101, 1), (102, 2);

SELECT c.name,
       count(p.id) AS n_products,   -- correct: 0 for C
       count(*)    AS n_star        -- wrong: 1 for C (the NULL-padded row)
FROM cat c
LEFT JOIN prod p ON p.cat_id = c.id
GROUP BY c.name
ORDER BY c.name;`,
        output: ` name | n_products | n_star
------+------------+--------
 A    | 2          | 2
 B    | 1          | 1
 C    | 0          | 1
(3 rows)`,
        explain: 'Category `C` has no products, but the `LEFT JOIN` still emits one row for it with every `prod` column `NULL`. `count(*)` counts that placeholder row -> wrongly reports `1` product for `C`. `count(p.id)` only counts rows where `p.id IS NOT NULL`, so it skips the placeholder and correctly reports `0`. Rule: after a `LEFT JOIN`, count a non-nullable CHILD column, never `count(*)`.',
        explainHi: 'Category `C` ke koi products nahi, par `LEFT JOIN` phir bhi iske liye ek row emit karता hai har `prod` column `NULL` ke saath. `count(*)` us placeholder row ko ginता hai -> galat `C` ke liye `1` product report karта hai. `count(p.id)` sirf wo rows ginता hai jahaan `p.id IS NOT NULL`, to ye placeholder skip karता hai aur sahi `0` report karता hai. Niyam: ek `LEFT JOIN` ke baad, ek non-nullable CHILD column count karo, kabhi `count(*)` nahi.',
      },
      {
        title: 'count(*) vs count(DISTINCT) after a fan-out join',
        titleHi: 'Ek fan-out join ke baad count(*) vs count(DISTINCT)',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1, 'Acme'), (2, 'Globex'), (3, 'Initech');
CREATE TABLE ordr (id int, customer_id int);
INSERT INTO ordr VALUES (10, 1), (11, 1), (12, 1), (13, 2);
-- Acme: 3 orders, Globex: 1, Initech: 0

-- "how many customers have ordered?"
SELECT count(*)             AS wrong,   -- counts order rows: 4
       count(DISTINCT customer.id) AS right   -- counts customers: 2
FROM customer
JOIN ordr ON ordr.customer_id = customer.id;`,
        output: ` wrong | right
-------+-------
 4     | 2
(1 row)`,
        explain: 'Acme has 3 orders, Globex 1, Initech 0. `JOIN orders` fans Acme\'s row out to 3 rows, so `count(*)` = 4 (the total ORDER count of customers-who-ordered), not the customer count. `count(DISTINCT customer.id)` collapses Acme\'s 3 rows back to 1 and answers the real question — "how many customers have ordered" — with `2`. (`sum(DISTINCT ...)` is NOT a valid analogue: two orders can legitimately share a value.)',
        explainHi: 'Acme ke 3 orders, Globex ka 1, Initech ke 0. `JOIN orders` Acme ki row ko 3 rows mein fan karता hai, to `count(*)` = 4 (order-karne-waale customers ka total ORDER count), customer count nahi. `count(DISTINCT customer.id)` Acme ki 3 rows ko wapas 1 mein collapse karता hai aur asli sawaal answer karता hai — `2`. (`sum(DISTINCT ...)` valid analogue NAHI hai.)',
      },
    ],

    mistakes: [
      {
        wrong: `-- "revenue and units shipped, per product"
SELECT p.name,
       sum(oi.line_total) AS revenue,
       sum(s.qty)         AS units_shipped
FROM product p
JOIN order_item oi ON oi.product_id = p.id
JOIN shipment_item s ON s.product_id = p.id
GROUP BY p.name;
-- product with 4 order_items and 3 shipment_items -> 12 rows -> both sums inflated`,
        right: `SELECT p.name,
       coalesce(oi.revenue, 0)       AS revenue,
       coalesce(s.units_shipped, 0)  AS units_shipped
FROM product p
LEFT JOIN (SELECT product_id, sum(line_total) AS revenue
           FROM order_item GROUP BY product_id) oi ON oi.product_id = p.id
LEFT JOIN (SELECT product_id, sum(qty) AS units_shipped
           FROM shipment_item GROUP BY product_id) s ON s.product_id = p.id;`,
        why: 'Product joins to two child tables that are each many-per-product. For a product with four order items and three shipment items the join produces twelve rows, and the revenue sum adds each order-item line three times while the units sum adds each shipment four times, with different multipliers so no single division rescues it. The reliable fix is to aggregate each child down to one row per product in its own subquery, then LEFT JOIN those. Each subquery is a plain GROUP BY that the planner can execute as one scan, the joins are now one-to-one, and coalesce turns a product with no orders or no shipments into a clean zero.',
        whyHi: 'Product do child tables se join karता hai jo har ek prati-product many hain. Chaar order items aur teen shipment items waale ek product ke liye join baarah rows produce karता hai, aur revenue sum har order-item line teen baar jodता hai jabki units sum har shipment chaar baar. Reliable fix har child ko iski apni subquery mein prati product ek row mein aggregate karna hai, phir unhe LEFT JOIN karna. Joins ab one-to-one hain, aur coalesce bina orders waale product ko ek saaf zero banाता hai.',
      },
      {
        wrong: `-- "number of line items per order, including orders with none"
SELECT o.id, count(*) AS n_lines
FROM orders o
LEFT JOIN order_line ol ON ol.order_id = o.id
GROUP BY o.id;
-- an order with zero lines shows n_lines = 1, not 0`,
        right: `SELECT o.id, count(ol.id) AS n_lines
FROM orders o
LEFT JOIN order_line ol ON ol.order_id = o.id
GROUP BY o.id;`,
        why: 'A LEFT JOIN keeps every order, and for an order with no matching line it emits one row with all order_line columns NULL. count star counts rows, so it counts that placeholder row as one, and every empty order reports n_lines equal to one. count of a column from the child side, such as count of order_line dot id, only counts rows where that column is not NULL, so the placeholder row contributes zero and empty orders correctly report zero. The rule after a LEFT JOIN whenever you want counts of the right side: count a non-nullable right-side column, never count star.',
        whyHi: 'Ek LEFT JOIN har order rakhता hai, aur bina matching line waale order ke liye ye ek row emit karता hai jisme sabhi order_line columns NULL hain. count star rows ginता hai, to ye us placeholder row ko ek ginता hai, aur har empty order n_lines ek report karता hai. Child side se ek column ka count, jaise count of order_line dot id, sirf wo rows ginता hai jahaan wo column NULL nahi hai. LEFT JOIN ke baad niyam jab bhi aap right side ke counts chahते ho: ek non-nullable right-side column count karo, kabhi count star nahi.',
      },
      {
        wrong: `-- total inventory value -- product joined to its stock movements
SELECT sum(p.unit_cost * p.on_hand) AS inventory_value
FROM product p
JOIN stock_movement sm ON sm.product_id = p.id;
-- unit_cost * on_hand is added once per stock_movement row, not once per product`,
        right: `SELECT sum(p.unit_cost * p.on_hand) AS inventory_value
FROM product p;
-- the stock_movement join was never needed for this number`,
        why: 'The quantity being summed, unit cost times on hand, is entirely a property of the product row. Joining to stock_movement, which has many rows per product, repeats each product once per movement, so the per-product value is added as many times as that product has movements. The join contributes nothing to this calculation and should simply be removed. More generally, before aggregating, check that every table in the FROM is actually needed for the numbers you are computing; a join added for a WHERE filter or copied from another query can silently multiply an aggregate. If you did need a filter from stock_movement, use EXISTS instead so it does not fan out.',
        whyHi: 'Jo quantity sum ho rahi hai, unit cost guna on hand, poori tarah product row ki ek property hai. stock_movement se join karna, jiske prati product kई rows hain, har product ko prati movement ek baar repeat karता hai. Join is calculation mein kuch contribute nahi karता aur bस hata dena chahिए. Zyada aam taur par, aggregate karne se pehle, check karo ki FROM mein har table asal mein zaroori hai. Agar aapको stock_movement se ek filter chahिए tha, iske bजाy EXISTS istemal karo taaki ye fan out na kare.',
      },
    ],

    realWorld: [
      {
        en: '**A revenue dashboard that computes `orders_total` and `refunds_total` as two pre-aggregated subqueries joined to `customer`** — rewritten after a bug where a customer with many of both showed revenue multiplied by the refund count.',
        hi: '**Ek revenue dashboard jo `orders_total` aur `refunds_total` ko do pre-aggregated subqueries ke roop mein compute karta hai** — ek bug ke baad rewritten.',
      },
      {
        en: '**A review checklist rule: any `GROUP BY` + `sum`/`count` sitting on top of two or more joins to child tables is flagged for a fan-out check** before merge.',
        hi: '**Ek review checklist rule: do ya zyada child-table joins ke upar koi `GROUP BY` + `sum`/`count` merge se pehle fan-out check ke liye flag hota hai**.',
      },
      {
        en: '**`SELECT c.name, count(o.id) FROM category c LEFT JOIN offer o ... GROUP BY c.name` on a catalog page** — `count(o.id)` specifically, so an empty category shows `0 offers` rather than `1`.',
        hi: '**Ek catalog page par `SELECT c.name, count(o.id) FROM category c LEFT JOIN offer o ... GROUP BY c.name`** — `count(o.id)` specifically, taaki empty category `0` dikhाe.',
      },
    ],

    interviewQA: [
      {
        q: 'A `GROUP BY` report shows totals that are too high. What is the likely cause and how do you fix it?',
        qHi: 'Ek `GROUP BY` report bahut high totals dikhाती hai. Sambhावit kaaran kya hai aur aap ise kaise fix karते ho?',
        a: 'The likely cause is fan-out from a join. If the query joins the main table to a table on the many side of a one-to-many relationship, each main row is repeated once per matching child row, and an aggregate over a main-table column then counts that value once per child. It is worse with two child joins: a parent with three of one child and two of the other becomes six rows, and the two sums inflate by different factors, three and two, so no single division corrects it. The fixes, in order of general applicability. First, aggregate each child table to one row per join key in a subquery, then LEFT JOIN those pre-aggregated results; now every join is one-to-one and nothing multiplies, and this works for any number of children and any aggregate. Second, compute each total as an independent correlated subquery in the SELECT list, which is obviously correct though it can be slower with many parent rows. Third, if the inflated aggregate is specifically a count and you meant "how many distinct parents", use count of DISTINCT the parent key. And after a LEFT JOIN where you want counts including zero, count a non-nullable child column rather than count star, because count star counts the NULL-padded placeholder row as one.',
        aHi: 'Sambhावit kaaran ek join se fan-out hai. Agar query main table ko ek one-to-many relationship ke many side par ek table se join karती hai, har main row prati matching child row ek baar repeat hoती hai, aur ek main-table column par ek aggregate phir us value ko prati child ek baar ginता hai. Do child joins ke saath bura hai. Fixes: pehla, har child table ko ek subquery mein prati join key ek row mein aggregate karo, phir un pre-aggregated results ko LEFT JOIN karo. Doosra, har total ko SELECT list mein ek independent correlated subquery ke roop mein compute karo. Teesra, agar inflated aggregate specifically ek count hai, count of DISTINCT parent key istemal karo. Aur ek LEFT JOIN ke baad, count star ke bजाy ek non-nullable child column count karo.',
      },
      {
        q: 'After a `LEFT JOIN`, why use `count(child.col)` instead of `count(*)`?',
        qHi: 'Ek `LEFT JOIN` ke baad, `count(*)` ke bजाy `count(child.col)` kyun istemal karें?',
        a: 'A LEFT JOIN keeps every row of the left table. For a left row with no matching right row, it still emits one output row, with all the right-table columns set to NULL. If you are grouping by the left key and counting to find "how many children per parent", count star will count that placeholder row, so a parent with zero children reports one instead of zero. count of a right-side column that is never NULL when a real match exists, typically the child\'s primary key, skips the placeholder row because its value is NULL there, and so it correctly reports zero for childless parents and the true count otherwise. The same reasoning applies to sum and avg over right-side columns: they already ignore the NULLs, so they are fine, but count is the one that needs you to name the column explicitly.',
        aHi: 'Ek LEFT JOIN left table ki har row rakhता hai. Bina matching right row waali ek left row ke liye, ye phir bhi ek output row emit karता hai, sabhi right-table columns NULL set ke saath. Agar aap left key se group kar rahe ho aur "prati parent kitne children" dhoondने ke liye count kar rahe ho, count star us placeholder row ko ginेga, to bina children waala ek parent zero ke bजाy ek report karता hai. Ek right-side column ka count jo ek real match hone par kabhi NULL nahi hoता, aam taur par child ki primary key, placeholder row skip karता hai. Wahi reasoning sum aur avg par lागू hoती hai: wo pehle se NULLs ignore karते hain.',
      },
    ],

    exercises: [
      {
        task: 'Tables `author(id int, name text)`, `book(author_id int, price int)` (author 1 has 3 books), `award(author_id int, year int)` (author 1 has 2 awards). Write the WRONG query: `JOIN` both, `GROUP BY author`, `sum(book.price)` and `count(award.*)`. Note the book sum is 2x and the award count is 3x. Then fix with two pre-aggregated subqueries.',
        taskHi: 'Tables `author(id, name)`, `book(author_id, price)` (author 1 ke 3 books), `award(author_id, year)` (author 1 ke 2 awards). GALAT query likho. Phir do pre-aggregated subqueries se fix karo.',
        hint: '3 books x 2 awards = 6 rows. `sum(price)` = (real total) x 2, `count(award)` = 2 x 3 = 6. Fix: `LEFT JOIN (SELECT author_id, sum(price) ... GROUP BY author_id)` and the same for awards.',
        hintHi: '3 x 2 = 6 rows. Fix: `LEFT JOIN (SELECT author_id, sum(price) ... GROUP BY author_id)` aur awards ke liye wahi.',
      },
      {
        task: 'Tables `team(id int, name text)` (3 teams, one with no members) and `member(team_id int, name text)`. Write `SELECT t.name, count(m.team_id) FROM team t LEFT JOIN member m ON m.team_id = t.id GROUP BY t.name`. Confirm the empty team shows `0`. Change `count(m.team_id)` to `count(*)` and confirm it wrongly shows `1`.',
        taskHi: 'Tables `team(id, name)` (3 teams, ek bina members) aur `member(team_id, name)`. `SELECT t.name, count(m.team_id) FROM team t LEFT JOIN member m ON m.team_id = t.id GROUP BY t.name`.',
        hint: 'The empty team gets one `LEFT JOIN` row with `m.team_id = NULL`. `count(m.team_id)` skips it -> `0`. `count(*)` counts it -> `1`.',
        hintHi: 'Empty team ko `m.team_id = NULL` waali ek `LEFT JOIN` row milती hai. `count(m.team_id)` skip -> `0`. `count(*)` -> `1`.',
      },
      {
        task: 'Table `product(id int, unit_cost numeric, on_hand int)` and `movement(product_id int, delta int)` (several rows per product). Someone wrote `SELECT sum(unit_cost * on_hand) FROM product p JOIN movement m ON m.product_id = p.id`. Explain why it is wrong, then write the correct one-liner (hint: the `movement` join is not needed at all).',
        taskHi: 'Table `product(id, unit_cost, on_hand)` aur `movement(product_id, delta)`. Kisi ne `SELECT sum(unit_cost * on_hand) FROM product p JOIN movement m ON m.product_id = p.id` likha. Samjhao kyun galat hai, phir sahi one-liner likho.',
        hint: '`unit_cost * on_hand` is a product-row property. The join repeats each product once per movement, so the value is summed that many times. Correct: `SELECT sum(unit_cost * on_hand) FROM product` — no join.',
        hintHi: '`unit_cost * on_hand` ek product-row property hai. Join har product ko prati movement repeat karता hai. Sahi: `SELECT sum(unit_cost * on_hand) FROM product` — koi join nahi.',
      },
    ],

    keyTakeaways: [
      'FAN-OUT: a join to the MANY side of a 1:N relationship repeats each parent row once per child. Aggregating a PARENT column, or aggregating across TWO child tables, then inflates the result. Two children (3 + 2) = 3x2 = 6 rows -> one sum x2, the other x3 — DIFFERENT factors, no single divisor fixes it.',
      'FIX 1 (general-purpose): aggregate each child to ONE row per join key in a subquery, then `LEFT JOIN` the pre-aggregated results (+ `coalesce(..., 0)`). Joins become 1:1, nothing multiplies. Works for any number of children, any aggregate.',
      'FIX 2: each aggregate as an independent correlated subquery in the `SELECT` list — no join, no fan-out, obviously correct. Can be slower than Fix 1 with many parent rows / poor indexes (Module 5).',
      'FIX 3: for an inflated COUNT, `count(DISTINCT parent_key)` collapses the duplicates. `sum(DISTINCT x)` is NOT a valid analogue (two rows can legitimately share a value). For pure "does a related row exist", use `EXISTS` — it never fans out (Module 3).',
      'After a `LEFT JOIN` + `GROUP BY`, count a NON-NULLABLE CHILD column (`count(p.id)`), NOT `count(*)`: a parent with zero children still gets one `LEFT JOIN` row (child columns `NULL`), which `count(*)` miscounts as `1`. `sum`/`avg` over child columns are fine (they skip the NULLs).',
      'CHECKLIST when grouped totals look too high: (1) joins to >1 child table? (2) aggregating a parent column after a child join? (3) `count(*)` where you meant distinct parents? (4) `count(*)` after `LEFT JOIN` showing `1` for empty groups?',
      'Sometimes the fix is to DELETE a join entirely — a join added for a `WHERE` filter or copy-pasted from another query silently multiplies aggregates. Check every `FROM` table is actually needed for the numbers; use `EXISTS` for existence filters.',
    ],
    keyTakeawaysHi: [
      'FAN-OUT: ek 1:N relationship ke MANY side par ek join har parent row ko prati child ek baar repeat karता hai. Ek PARENT column aggregate karna, ya DO child tables par aggregate karna, result inflate karता hai. Do children (3 + 2) = 6 rows -> ek sum x2, doosra x3 — ALAG factors.',
      'FIX 1 (general-purpose): har child ko ek subquery mein prati join key EK row mein aggregate karo, phir pre-aggregated results ko `LEFT JOIN` karo (+ `coalesce(..., 0)`). Joins 1:1 ban jaate hain.',
      'FIX 2: har aggregate ko `SELECT` list mein ek independent correlated subquery ke roop mein — koi join, koi fan-out nahi. Fix 1 se slower ho sakta hai (Module 5).',
      'FIX 3: ek inflated COUNT ke liye, `count(DISTINCT parent_key)`. `sum(DISTINCT x)` valid analogue NAHI hai. Pure "kya ek related row hai" ke liye `EXISTS` (Module 3).',
      'Ek `LEFT JOIN` + `GROUP BY` ke baad, ek NON-NULLABLE CHILD column count karo (`count(p.id)`), `count(*)` NAHI: bina children waale parent ko phir bhi ek `LEFT JOIN` row milती hai, jise `count(*)` `1` miscount karता hai.',
      'CHECKLIST jab grouped totals bahut high dikhें: (1) >1 child table se joins? (2) child join ke baad parent column aggregate? (3) `count(*)` jahaan distinct parents ka matlab tha? (4) `LEFT JOIN` ke baad `count(*)` empty groups ke liye `1`?',
      'Kabhi fix ek join ko poori tarah DELETE karna hai — ek `WHERE` filter ke liye add kiya join chupchaap aggregates multiply karता hai. Existence filters ke liye `EXISTS` istemal karo.',
    ],
  },
];
