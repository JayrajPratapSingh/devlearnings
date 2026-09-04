/**
 * Databases Complete Course — Module 4: Aggregation & GROUP BY, lessons 1-3.
 *
 * Lesson 1: Aggregate functions & NULL — count / sum / avg / min / max, how every
 *           aggregate except count(*) SKIPS NULL, count(*) vs count(col) vs
 *           count(DISTINCT col), sum/avg of an empty or all-NULL set is NULL not 0,
 *           string_agg / array_agg / bool_and / bool_or and ORDER BY inside an aggregate.
 * Lesson 2: GROUP BY fundamentals — one output row per distinct group key, every
 *           non-aggregated SELECT column must be in GROUP BY (the classic error),
 *           grouping by several columns / by an expression / by ordinal, NULL is its
 *           own group.
 * Lesson 3: HAVING vs WHERE — WHERE filters rows BEFORE grouping, HAVING filters
 *           groups AFTER; no aggregates in WHERE; the logical processing order; put
 *           every non-aggregate condition in WHERE for speed.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 4
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_4: CourseLesson[] = [
  {
    slug: 'sql-aggregate-functions-and-null',
    title: 'Aggregate Functions & NULL: count, sum, avg, min, max',
    titleHi: 'Aggregate Functions Aur NULL: count, sum, avg, min, max',
    description: 'An aggregate function takes many rows and returns one value. The five core ones are `count`, `sum`, `avg`, `min`, `max`. The rule that trips everyone: every aggregate except `count(*)` silently SKIPS `NULL` — and `sum`/`avg` of zero rows is `NULL`, not `0`.',
    descriptionHi: 'Ek aggregate function kई rows leta hai aur ek value lautata hai. Paanch core hain `count`, `sum`, `avg`, `min`, `max`. Wo niyam jo sabko phansata hai: `count(*)` ke alawa har aggregate chupchaap `NULL` SKIP karta hai — aur zero rows ka `sum`/`avg` `NULL` hai, `0` nahi.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A teacher totting up marks from a stack of test papers — some of which were left blank.** "How many papers are in the stack?" is `count(*)` — you count every sheet, blank or not. "How many students actually answered?" is `count(score)` — you skip the blanks. "How many *different* scores appeared?" is `count(DISTINCT score)`. When you add the marks up (`sum`) or take the average (`avg`), you simply do not include the blank papers — a blank is *not* a zero, it is "did not sit the test", and averaging it in as zero would unfairly drag the class average down. So `avg` divides the total by the number of *non-blank* papers. And the edge case: if the entire stack is blank — or there is no stack at all — the total is not "zero marks", it is "there is nothing to total", which the database reports as `NULL`. `min` and `max` likewise look only at the papers that have a mark on them.',
      hi: '**Ek teacher test papers ke stack se marks jod raha hai — jinme se kuch blank chhod diye gaye the.** "Stack mein kitne papers hain?" `count(*)` hai — aap har sheet ginte ho, blank ho ya na ho. "Kitne students ne asal mein answer diya?" `count(score)` hai — aap blanks skip karte ho. "Kitne *alag* scores aaye?" `count(DISTINCT score)` hai. Jab aap marks jodte ho (`sum`) ya average lete ho (`avg`), aap bस blank papers include nahi karte — ek blank *zero nahi* hai, ye "test nahi diya" hai, aur ise zero maankar average karna class average ko galat tarike se neeche kheench dega. To `avg` total ko *non-blank* papers ki sankhya se divide karta hai. Aur edge case: agar poora stack blank hai — ya stack hai hi nahi — total "zero marks" nahi hai, ye "jodne ke liye kuch nahi hai" hai, jise database `NULL` batata hai.',
    },

    simple: `**The five core aggregates**

\`\`\`sql
SELECT count(*)   AS rows,        -- how many rows (blanks included)
       count(n)   AS non_null_n,  -- how many rows where n IS NOT NULL
       count(DISTINCT n) AS distinct_n,
       sum(n)     AS total,
       avg(n)     AS mean,        -- sum(n) / count(n)  -- skips NULLs in BOTH
       min(n)     AS smallest,
       max(n)     AS largest
FROM t;
\`\`\`

**Every aggregate except \`count(*)\` skips \`NULL\`**

\`\`\`sql
-- values: 10, 20, NULL, 5
count(*)          -- 4   (counts the row, NULL or not)
count(n)          -- 3   (the NULL row is not counted)
sum(n)            -- 35  (10 + 20 + 5)
avg(n)            -- 11.67  (35 / 3, NOT 35 / 4)
min(n) / max(n)   -- 5 / 20
\`\`\`

**\`sum\`/\`avg\` of nothing is \`NULL\`, not \`0\`**

\`\`\`sql
SELECT sum(amt), avg(amt) FROM orders WHERE 1 = 0;   -- NULL, NULL  (no rows)
SELECT sum(amt) FROM orders WHERE amt IS NULL;       -- NULL  (all matched rows are NULL)

-- want 0 instead of NULL? wrap it:
SELECT coalesce(sum(amt), 0) FROM orders WHERE 1 = 0;   -- 0
\`\`\`

**\`count(*)\` vs \`count(col)\` vs \`count(DISTINCT col)\`**

\`\`\`sql
count(*)              -- number of rows
count(col)            -- number of rows where col IS NOT NULL
count(DISTINCT col)   -- number of distinct non-NULL values of col
\`\`\`

**Other useful aggregates**

\`\`\`sql
string_agg(name, ', ' ORDER BY name)   -- 'Ada, Bo, Cy'   -- concatenate
array_agg(id ORDER BY id)              -- {1,2,3}          -- collect into an array
bool_and(active)   -- true only if EVERY row is true
bool_or(active)    -- true if ANY row is true
min(created_at) / max(created_at)      -- works on dates and text too
\`\`\``,

    simpleHi: `**Paanch core aggregates**

\`\`\`sql
SELECT count(*)   AS rows,        -- kitni rows (blanks included)
       count(n)   AS non_null_n,  -- kitni rows jahaan n IS NOT NULL
       count(DISTINCT n) AS distinct_n,
       sum(n)     AS total,
       avg(n)     AS mean,        -- sum(n) / count(n)  -- DONO mein NULLs skip
       min(n)     AS smallest,
       max(n)     AS largest
FROM t;
\`\`\`

**\`count(*)\` ke alawa har aggregate \`NULL\` skip karta hai**

\`\`\`sql
-- values: 10, 20, NULL, 5
count(*)          -- 4   (row ginta hai, NULL ho ya na ho)
count(n)          -- 3   (NULL row nahi ginī jaती)
sum(n)            -- 35  (10 + 20 + 5)
avg(n)            -- 11.67  (35 / 3, 35 / 4 NAHI)
min(n) / max(n)   -- 5 / 20
\`\`\`

**Kuch nahi ka \`sum\`/\`avg\` \`NULL\` hai, \`0\` nahi**

\`\`\`sql
SELECT sum(amt), avg(amt) FROM orders WHERE 1 = 0;   -- NULL, NULL  (koi rows nahi)
SELECT sum(amt) FROM orders WHERE amt IS NULL;       -- NULL  (sab matched rows NULL hain)

-- NULL ke bजाy 0 chahिए? wrap karo:
SELECT coalesce(sum(amt), 0) FROM orders WHERE 1 = 0;   -- 0
\`\`\`

**\`count(*)\` vs \`count(col)\` vs \`count(DISTINCT col)\`**

\`\`\`sql
count(*)              -- rows ki sankhya
count(col)            -- rows ki sankhya jahaan col IS NOT NULL
count(DISTINCT col)   -- col ki distinct non-NULL values ki sankhya
\`\`\`

**Doosre useful aggregates**

\`\`\`sql
string_agg(name, ', ' ORDER BY name)   -- 'Ada, Bo, Cy'   -- concatenate
array_agg(id ORDER BY id)              -- {1,2,3}          -- ek array mein collect
bool_and(active)   -- true sirf tab jab HAR row true hai
bool_or(active)    -- true jab KOI row true hai
min(created_at) / max(created_at)      -- dates aur text par bhi chalta hai
\`\`\``,

    content: `## What an aggregate does

An **aggregate function** consumes a set of rows and produces a **single value**. Without \`GROUP BY\` (Lesson 2), an aggregate over the whole result set collapses it to **exactly one row**:

\`\`\`sql
SELECT count(*), sum(total), avg(total) FROM orders;   -- always exactly 1 row
\`\`\`

You **cannot** mix an aggregate and a bare column in the same \`SELECT\` without \`GROUP BY\` — \`SELECT name, count(*) FROM t\` is an error, because \`count(*)\` wants one row and \`name\` has many (Lesson 2 explains the fix).

## The \`NULL\` rule — the one everyone forgets

**Every aggregate except \`count(*)\` ignores \`NULL\` inputs.** They are removed before the function runs:

| aggregate | on values \`10, 20, NULL, 5\` |
|---|---|
| \`count(*)\` | \`4\` — counts **rows**, NULL or not |
| \`count(n)\` | \`3\` — the \`NULL\` is skipped |
| \`sum(n)\` | \`35\` |
| \`avg(n)\` | \`11.666...\` — that is \`35 / 3\`, **not** \`35 / 4\` |
| \`min(n)\` / \`max(n)\` | \`5\` / \`20\` |

This is usually what you want: a missing measurement should not be treated as a zero. But it means **\`avg\` and a hand-rolled \`sum(n) / count(*)\` give different answers** when \`NULL\`s are present. If you genuinely want NULLs to count as zero, convert them first: \`avg(coalesce(n, 0))\`.

## \`sum\` / \`avg\` of nothing is \`NULL\`

If **no rows** reach the aggregate — an empty table, a \`WHERE\` that matches nothing, or a group where every value is \`NULL\` — then:

- \`sum(...)\` returns **\`NULL\`**, not \`0\`
- \`avg(...)\`, \`min(...)\`, \`max(...)\` return **\`NULL\`**
- \`count(...)\` returns **\`0\`** (count is the exception — it always returns a number)

This bites when a \`sum\` feeds into further arithmetic: \`NULL + 5\` is \`NULL\`, so a total built on an empty category silently becomes \`NULL\`. Wrap it: \`coalesce(sum(amount), 0)\`.

## \`count\` has three forms

\`\`\`sql
count(*)              -- number of rows in the group (the fast, common one)
count(column)         -- number of rows where column IS NOT NULL
count(DISTINCT column)-- number of distinct non-NULL values
count(1)              -- identical to count(*) -- the 1 is not "column 1", just a constant
\`\`\`

- \`count(*)\` is what you want for "how many rows". It does not check any value.
- \`count(col)\` is subtly different — use it deliberately when you mean "how many have this field filled in", e.g. \`count(shipped_at)\` = how many orders have shipped.
- \`count(DISTINCT col)\` answers "how many different X" — how many distinct customers ordered, how many distinct products sold.

## Aggregates are not just numeric

- **\`min\` / \`max\`** work on any orderable type: \`max(created_at)\` (latest timestamp), \`min(name)\` (alphabetically first).
- **\`string_agg(expr, delimiter ORDER BY ...)\`** concatenates text values into one string — \`string_agg(tag, ', ' ORDER BY tag)\` → \`'blue, green, red'\`. The \`ORDER BY\` inside the parentheses controls the order of the pieces.
- **\`array_agg(expr ORDER BY ...)\`** collects the values into an array — useful for pulling a child list into one row.
- **\`json_agg\` / \`jsonb_agg\`** builds a JSON array; \`jsonb_object_agg(k, v)\` builds a JSON object.
- **\`bool_and(expr)\`** is \`true\` only if the condition holds for **every** row in the group; **\`bool_or(expr)\`** is \`true\` if it holds for **any**. \`bool_and(paid)\` = "is the whole order paid off".

## \`DISTINCT\` and \`ORDER BY\` inside an aggregate

Two aggregate-only pieces of syntax:

\`\`\`sql
sum(DISTINCT amount)                    -- sum only the distinct values (rarely what you want)
count(DISTINCT customer_id)             -- the common one
string_agg(name, ', ' ORDER BY name)    -- ORDER BY controls element order
array_agg(score ORDER BY score DESC)    -- ditto
\`\`\`

Note \`sum(DISTINCT x)\` is almost always a **mistake** — two rows can legitimately have the same amount, and dropping the "duplicate" silently under-counts. \`count(DISTINCT x)\` is the form you actually reach for.`,

    contentHi: `## Ek aggregate kya karta hai

Ek **aggregate function** rows ka ek set consume karta hai aur ek **single value** produce karta hai. Bina \`GROUP BY\` (Lesson 2) ke, poore result set par ek aggregate use **theek ek row** mein collapse karta hai:

\`\`\`sql
SELECT count(*), sum(total), avg(total) FROM orders;   -- hamesha theek 1 row
\`\`\`

Aap bina \`GROUP BY\` ke ek aggregate aur ek bare column ko usi \`SELECT\` mein **mix nahi kar sakte** — \`SELECT name, count(*) FROM t\` ek error hai.

## \`NULL\` niyam — jo sab bhool jaate hain

**\`count(*)\` ke alawa har aggregate \`NULL\` inputs ignore karta hai.** Wo function chalne se pehle hata diye jaate hain:

| aggregate | values \`10, 20, NULL, 5\` par |
|---|---|
| \`count(*)\` | \`4\` — **rows** ginta hai |
| \`count(n)\` | \`3\` — \`NULL\` skip hoता hai |
| \`sum(n)\` | \`35\` |
| \`avg(n)\` | \`11.666...\` — wo \`35 / 3\` hai, \`35 / 4\` **nahi** |
| \`min(n)\` / \`max(n)\` | \`5\` / \`20\` |

Iska matlab **\`avg\` aur ek hand-rolled \`sum(n) / count(*)\` alag answers dete hain** jab \`NULL\`s मौjood hain. Agar aap sach mein chahte ho ki NULLs zero ginे jaayen: \`avg(coalesce(n, 0))\`.

## Kuch nahi ka \`sum\` / \`avg\` \`NULL\` hai

Agar **koi rows nahi** aggregate tak pahunchti — ek empty table, ek \`WHERE\` jo kuch match nahi karta, ya ek group jahaan har value \`NULL\` hai — to:

- \`sum(...)\` **\`NULL\`** lautata hai, \`0\` nahi
- \`avg(...)\`, \`min(...)\`, \`max(...)\` **\`NULL\`** lautate hain
- \`count(...)\` **\`0\`** lautata hai (count exception hai — hamesha ek number)

Wrap karo: \`coalesce(sum(amount), 0)\`.

## \`count\` ke teen forms

\`\`\`sql
count(*)              -- group mein rows ki sankhya (fast, common)
count(column)         -- rows ki sankhya jahaan column IS NOT NULL
count(DISTINCT column)-- distinct non-NULL values ki sankhya
count(1)              -- count(*) ke identical -- 1 "column 1" nahi, bस ek constant
\`\`\`

- \`count(*)\` "kitni rows" ke liye. Ye koi value check nahi karta.
- \`count(col)\` — "kitni mein ye field bhari hai", e.g. \`count(shipped_at)\`.
- \`count(DISTINCT col)\` — "kitne alag X".

## Aggregates sirf numeric nahi hain

- **\`min\` / \`max\`** kisi bhi orderable type par: \`max(created_at)\`, \`min(name)\`.
- **\`string_agg(expr, delimiter ORDER BY ...)\`** text values ko ek string mein concatenate karta hai. Parentheses ke andar \`ORDER BY\` pieces ka order control karta hai.
- **\`array_agg(expr ORDER BY ...)\`** values ko ek array mein collect karta hai.
- **\`json_agg\` / \`jsonb_agg\`** ek JSON array banata hai.
- **\`bool_and(expr)\`** \`true\` sirf tab jab **har** row ke liye condition true hai; **\`bool_or(expr)\`** \`true\` jab **koi** row.

## Aggregate ke andar \`DISTINCT\` aur \`ORDER BY\`

\`\`\`sql
sum(DISTINCT amount)                    -- sirf distinct values sum (aksar galat)
count(DISTINCT customer_id)             -- common
string_agg(name, ', ' ORDER BY name)    -- ORDER BY element order control karta hai
array_agg(score ORDER BY score DESC)
\`\`\`

\`sum(DISTINCT x)\` lगभग hamesha ek **galti** hai — do rows legitimately same amount rakh sakti hain. \`count(DISTINCT x)\` wo form hai jo aap asal mein istemal karte ho.`,

    examples: [
      {
        title: 'count(*) vs count(col) vs count(DISTINCT), and how sum/avg skip NULL',
        titleHi: 'count(*) vs count(col) vs count(DISTINCT), aur sum/avg NULL kaise skip karte hain',
        code: `CREATE TABLE t (g text, n int);
INSERT INTO t VALUES ('a', 10), ('a', 20), ('a', NULL), ('b', 5);

SELECT count(*)            AS c_star,
       count(n)            AS c_n,
       count(DISTINCT n)   AS c_dist,
       sum(n)              AS s,
       round(avg(n), 2)    AS a,
       min(n)              AS mn,
       max(n)              AS mx
FROM t;`,
        output: ` c_star | c_n | c_dist | s  | a     | mn | mx
--------+-----+--------+----+-------+----+----
 4      | 3   | 3      | 35 | 11.67 | 5  | 20
(1 row)`,
        explain: '`count(*)` counts all 4 rows. `count(n)` skips the one `NULL` -> 3. `count(DISTINCT n)` counts the distinct non-NULL values `10, 20, 5` -> 3. `sum(n)` adds only the non-NULLs: `10 + 20 + 5 = 35`. `avg(n)` is `35 / 3 = 11.67`, NOT `35 / 4` — the `NULL` row is not in the denominator either. `min`/`max` look only at the present values: `5` / `20`.',
        explainHi: '`count(*)` sabhi 4 rows ginता hai. `count(n)` ek `NULL` skip karता hai -> 3. `count(DISTINCT n)` distinct non-NULL values `10, 20, 5` ginता hai -> 3. `sum(n)` sirf non-NULLs jodता hai: `35`. `avg(n)` `35 / 3 = 11.67` hai, `35 / 4` NAHI — `NULL` row denominator mein bhi nahi hai. `min`/`max` sirf मौjood values dekhते hain: `5` / `20`.',
      },
      {
        title: 'sum and avg of zero rows (or all-NULL) is NULL, not 0 — coalesce to fix',
        titleHi: 'zero rows (ya all-NULL) ka sum aur avg NULL hai, 0 nahi — coalesce se fix',
        code: `CREATE TABLE e (n int);
INSERT INTO e VALUES (NULL), (NULL);

-- all matched values are NULL -> sum and avg are NULL, but count(*) is still 2
SELECT sum(n) AS s, avg(n) AS a, count(*) AS c_star, count(n) AS c_n FROM e;

-- no rows match at all -> same story
SELECT sum(n) AS s, count(*) AS c FROM e WHERE n > 0;

-- wrap sum in coalesce when you need a numeric 0
SELECT coalesce(sum(n), 0) AS safe_sum FROM e WHERE n > 0;`,
        output: ` s    | a    | c_star | c_n
------+------+--------+-----
 NULL | NULL | 2      | 0
(1 row)

 s    | c
------+---
 NULL | 0
(1 row)

 safe_sum
----------
 0
(1 row)`,
        explain: 'Every value that reaches these aggregates is `NULL` (first query) or there are no rows at all (second query). `sum` and `avg` of nothing return `NULL`, not `0`. But `count(*)` still returns `2` (it counts rows regardless of content) and `count(n)` returns `0` (no non-NULL values). The third query shows the standard fix: `coalesce(sum(n), 0)` turns the `NULL` into a real `0` for downstream arithmetic.',
        explainHi: 'Har value jo in aggregates tak pahunchती hai `NULL` hai (pehli query) ya koi rows hi nahi (doosri query). Kuch nahi ka `sum` aur `avg` `NULL` lautाते hain, `0` nahi. Par `count(*)` phir bhi `2` lautाता hai (ye content ke bavjood rows ginता hai) aur `count(n)` `0` lautाता hai. Teesri query standard fix dikhाती hai: `coalesce(sum(n), 0)`.',
      },
      {
        title: 'string_agg, array_agg, bool_and / bool_or with GROUP BY',
        titleHi: 'string_agg, array_agg, bool_and / bool_or GROUP BY ke saath',
        code: `CREATE TABLE m (team text, player text, active bool);
INSERT INTO m VALUES
  ('x', 'Cy', true), ('x', 'Ada', true), ('x', 'Bo', false), ('y', 'Di', true);

SELECT team,
       string_agg(player, ', ' ORDER BY player) AS roster,
       array_agg(player ORDER BY player)::text  AS roster_arr,
       bool_and(active) AS all_active,
       bool_or(active)  AS any_active
FROM m
GROUP BY team
ORDER BY team;`,
        output: ` team | roster      | roster_arr  | all_active | any_active
------+-------------+-------------+------------+------------
 x    | Ada, Bo, Cy | {Ada,Bo,Cy} | f          | t
 y    | Di          | {Di}        | t          | t
(2 rows)`,
        explain: "`string_agg(player, ', ' ORDER BY player)` concatenates the group's player names into one string, and the `ORDER BY` inside the parens sorts the pieces alphabetically -> `Ada, Bo, Cy`. `array_agg` does the same into a Postgres array (cast `::text` here so it renders as `{Ada,Bo,Cy}`). `bool_and(active)` is `f` for team x because Bo is inactive (not EVERY row is true); `bool_or(active)` is `t` because AT LEAST one is.",
        explainHi: "`string_agg(player, ', ' ORDER BY player)` group ke player names ko ek string mein concatenate karता hai, aur parens ke andar `ORDER BY` pieces ko alphabetically sort karता hai -> `Ada, Bo, Cy`. `array_agg` wahi ek Postgres array mein karता hai. `bool_and(active)` team x ke liye `f` hai kyunki Bo inactive hai; `bool_or(active)` `t` hai kyunki KAM SE KAM ek hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- "average order value" -- computed by hand
SELECT sum(total) / count(*) AS avg_order FROM orders;
-- if some orders have total = NULL, this divides by too many rows -> answer too low`,
        right: `SELECT avg(total) AS avg_order FROM orders;
-- avg divides sum(total) by count(total) -- the count of NON-NULL totals`,
        why: 'avg of a column is defined as sum of the non-NULL values divided by the count of the non-NULL values. Rebuilding it as sum(total) / count star uses count star, which counts every row including the ones where total is NULL, so the denominator is too big and the average comes out too low. If you actually want NULLs to count as zero in the average, be explicit: avg(coalesce(total, 0)). Otherwise just use avg and let it handle the NULLs correctly.',
        whyHi: 'ek column ka avg non-NULL values ke sum ko non-NULL values ke count se divide karke define hota hai. Ise sum(total) / count star ke roop mein rebuild karna count star istemal karta hai, jo har row ginta hai NULL total waali bhi, to denominator bada hai aur average kam aata hai. Agar aap sach mein chahte ho NULLs average mein zero ginे: avg(coalesce(total, 0)). Warna bस avg istemal karo.',
      },
      {
        wrong: `-- monthly revenue report -- a month with no sales shows a blank/NULL row and breaks a chart
SELECT month, sum(revenue) AS total FROM sales GROUP BY month;
-- for a month where every matching row happens to have revenue = NULL, total is NULL`,
        right: `SELECT month, coalesce(sum(revenue), 0) AS total
FROM sales GROUP BY month;`,
        why: 'sum returns NULL, not 0, when it has no non-NULL values to add. A downstream consumer that expects a number, a chart library, a further calculation, an export, then either errors or renders a gap. Wrapping the sum in coalesce with a zero default gives a clean numeric result for empty or all-NULL groups. The same applies to any place a sum feeds arithmetic: NULL plus anything is NULL, so one empty category can turn a grand total into NULL.',
        whyHi: 'sum NULL lautata hai, 0 nahi, jab iske paas jodne ke liye koi non-NULL values nahi hain. Ek downstream consumer jo ek number expect karta hai — ek chart library, ek aur calculation, ek export — ya to error karta hai ya ek gap render karta hai. sum ko zero default ke saath coalesce mein wrap karna empty ya all-NULL groups ke liye ek saaf numeric result deta hai.',
      },
      {
        wrong: `-- "how many customers placed an order this month"
SELECT count(*) FROM orders WHERE created_at >= date_trunc('month', now());
-- counts ORDERS, not customers -- a customer with 3 orders is counted 3 times`,
        right: `SELECT count(DISTINCT customer_id) FROM orders
WHERE created_at >= date_trunc('month', now());`,
        why: 'count star counts rows. The orders table has one row per order, so count star is the order count, not the customer count. A customer who ordered three times adds three. count of DISTINCT customer_id counts each customer once regardless of how many orders they placed, which is what "how many customers" asks. Reach for count DISTINCT whenever the question is "how many different X" and the table has more than one row per X.',
        whyHi: 'count star rows ginta hai. orders table mein prati order ek row hai, to count star order count hai, customer count nahi. Teen baar order karne waala customer teen jodta hai. count of DISTINCT customer_id har customer ko ek baar ginta hai chahे unhone kitne bhi orders kiye hon. Jab bhi sawaal "kitne alag X" ho aur table mein prati X ek se zyada row ho, count DISTINCT istemal karo.',
      },
    ],

    realWorld: [
      {
        en: '**A KPI query that returns `coalesce(sum(mrr), 0)` and `count(DISTINCT account_id)` in one shot** — the `coalesce` because a brand-new cohort with no revenue yet must render as `0`, not a blank tile.',
        hi: '**Ek KPI query jo `coalesce(sum(mrr), 0)` aur `count(DISTINCT account_id)` ek shot mein lautati hai** — `coalesce` isliye ki bina revenue waali ek nayi cohort `0` render honi chahिए.',
      },
      {
        en: '**`string_agg(role, \', \' ORDER BY role)` to show "Admin, Editor, Viewer" in a single table cell** on an admin users page, instead of one row per role.',
        hi: '**Ek admin users page par ek single table cell mein "Admin, Editor, Viewer" dikhाne ke liye `string_agg(role, \', \' ORDER BY role)`**.',
      },
      {
        en: '**A data-quality check: `count(*) - count(email) AS missing_email`** on the signups table, alerting when the gap between total rows and non-NULL emails crosses a threshold.',
        hi: '**Ek data-quality check: signups table par `count(*) - count(email) AS missing_email`**, alert jab gap ek threshold cross kare.',
      },
    ],

    interviewQA: [
      {
        q: 'How do aggregate functions treat `NULL`, and what is `sum` of zero rows?',
        qHi: 'Aggregate functions `NULL` ko kaise treat karte hain, aur zero rows ka `sum` kya hai?',
        a: 'Every aggregate except count star ignores NULL inputs. The NULLs are stripped out before the function runs, so sum adds only the non-NULL values, avg divides the sum of non-NULL values by the count of non-NULL values, and min and max look only at the values that are present. count star is the exception: it counts rows, whether or not any column is NULL. count of a specific column counts only the rows where that column is not NULL. The practical consequence is that avg and a hand-written sum over count star disagree whenever NULLs are present, because count star includes the NULL rows in the denominator. As for zero rows: if nothing reaches the aggregate, either because the table is empty or the WHERE matched nothing or every value in the group is NULL, then sum returns NULL, not zero, and avg, min, and max also return NULL. Only count returns an actual number, zero. This matters because a NULL sum propagates through later arithmetic, so people wrap it as coalesce of sum comma zero when a numeric result is required.',
        aHi: 'count star ke alawa har aggregate NULL inputs ignore karta hai. NULLs function chalne se pehle hata diye jaate hain, to sum sirf non-NULL values jodta hai, avg non-NULL values ke sum ko non-NULL values ke count se divide karta hai, aur min aur max sirf मौjood values dekhte hain. count star exception hai: ye rows ginta hai. Ek specific column ka count sirf wo rows ginta hai jahaan wo column NULL nahi hai. Practical natija: avg aur ek hand-written sum over count star disagree karte hain jab bhi NULLs मौjood hain. Zero rows ke liye: agar kuch aggregate tak nahi pahunchta, sum NULL lautata hai, zero nahi, aur avg, min, max bhi NULL. Sirf count ek actual number lautata hai, zero. Log ise coalesce of sum comma zero ke roop mein wrap karte hain.',
      },
      {
        q: 'What is the difference between `count(*)`, `count(col)`, and `count(DISTINCT col)`?',
        qHi: '`count(*)`, `count(col)`, aur `count(DISTINCT col)` mein kya antar hai?',
        a: 'count star counts rows. It does not inspect any value, it just tallies how many rows are in the group, and it is the one you want for "how many orders" or "how many rows match". count of a column counts the rows where that column is not NULL, so count of shipped_at tells you how many orders have actually shipped, which is a different number from count star if some are unshipped. count of DISTINCT a column counts how many distinct non-NULL values that column takes across the group, so count DISTINCT customer_id is "how many different customers", regardless of how many orders each placed. A common bug is using count star when the question is really "how many different X", for instance counting rows in a joined result and reporting it as a customer count when the join fanned each customer out to several rows. count of one, by the way, is identical to count star; the one is a constant, not a column reference.',
        aHi: 'count star rows ginta hai. Ye koi value inspect nahi karta, bस ginta hai group mein kitni rows hain, aur ye wo hai jo aap "kitne orders" ke liye chahte ho. Ek column ka count wo rows ginta hai jahaan wo column NULL nahi hai, to count of shipped_at batata hai kitne orders asal mein ship hue. Ek column ka count of DISTINCT ginta hai group bhar mein wo column kitni distinct non-NULL values leta hai, to count DISTINCT customer_id "kitne alag customers" hai. Ek common bug count star istemal karna hai jab sawaal asal mein "kitne alag X" hai. Waise, count of one count star ke identical hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `reading(sensor text, value int)` with rows `(\'a\', 10), (\'a\', 30), (\'a\', NULL), (\'b\', NULL)`. Write one query returning `count(*)`, `count(value)`, `sum(value)`, `avg(value)`. Predict each result before running: `4`, `2`, `40`, `20`. Then add `count(DISTINCT sensor)` and confirm `2`.',
        taskHi: 'Table `reading(sensor, value)` rows `(\'a\', 10), (\'a\', 30), (\'a\', NULL), (\'b\', NULL)` ke saath. Ek query jo `count(*)`, `count(value)`, `sum(value)`, `avg(value)` lautati hai. Har result predict karo: `4`, `2`, `40`, `20`.',
        hint: '`count(*)` counts all 4 rows. `count(value)` skips the 2 NULLs -> 2. `sum` = 10 + 30 = 40. `avg` = 40 / 2 = 20 (NOT 40 / 4). `count(DISTINCT sensor)` = a, b -> 2.',
        hintHi: '`count(*)` sabhi 4 rows. `count(value)` 2 NULLs skip -> 2. `sum` = 40. `avg` = 40 / 2 = 20 (40 / 4 NAHI).',
      },
      {
        task: 'Table `invoice(amount numeric)` that is EMPTY. Run `SELECT sum(amount), avg(amount), count(*), count(amount) FROM invoice`. Confirm you get `NULL, NULL, 0, 0`. Then run `SELECT coalesce(sum(amount), 0) FROM invoice` and confirm `0`.',
        taskHi: 'Table `invoice(amount numeric)` jo KHAALI hai. `SELECT sum(amount), avg(amount), count(*), count(amount) FROM invoice` chalao. `NULL, NULL, 0, 0` confirm karo. Phir `coalesce(sum(amount), 0)` -> `0`.',
        hint: 'On zero rows, `sum`/`avg` are `NULL` but both `count` forms are `0`. `coalesce(sum(...), 0)` is the standard way to force a numeric zero for empty groups.',
        hintHi: 'Zero rows par, `sum`/`avg` `NULL` hain par dono `count` forms `0`. `coalesce(sum(...), 0)` empty groups ke liye standard.',
      },
      {
        task: 'Table `tag(post_id int, label text)` with posts 1 (`sql`, `db`, `perf`) and 2 (`sql`). Write `SELECT post_id, string_agg(label, \', \' ORDER BY label) AS tags, count(*) AS n FROM tag GROUP BY post_id`. Confirm post 1 shows `db, perf, sql` / `3` and post 2 shows `sql` / `1`.',
        taskHi: 'Table `tag(post_id, label)` posts 1 (`sql`, `db`, `perf`) aur 2 (`sql`) ke saath. `SELECT post_id, string_agg(label, \', \' ORDER BY label) AS tags, count(*) AS n FROM tag GROUP BY post_id`.',
        hint: '`string_agg` with `ORDER BY label` inside the parens sorts the pieces alphabetically: `db, perf, sql`. Without the `ORDER BY` the order would be arbitrary.',
        hintHi: 'Parens ke andar `ORDER BY label` ke saath `string_agg` pieces ko alphabetically sort karta hai: `db, perf, sql`.',
      },
    ],

    keyTakeaways: [
      'An aggregate consumes many rows -> ONE value. Without `GROUP BY`, an aggregate over the whole set returns EXACTLY ONE row. You can\'t `SELECT name, count(*)` without `GROUP BY` (Lesson 2).',
      'EVERY aggregate except `count(*)` SKIPS `NULL` inputs (they are removed before the function runs). On `10, 20, NULL, 5`: `count(*)`=4, `count(n)`=3, `sum`=35, `avg`=11.67 (= 35/3, NOT 35/4), `min`/`max`=5/20.',
      '`avg(n)` = `sum(n) / count(n)` — so a hand-rolled `sum(n) / count(*)` gives a DIFFERENT (too-low) answer when NULLs are present. Want NULLs as zero? `avg(coalesce(n, 0))`.',
      '`sum`/`avg`/`min`/`max` of ZERO rows (empty table, `WHERE` matches nothing, all-NULL group) return `NULL`, NOT `0`. Only `count(...)` returns a number (`0`). Wrap for arithmetic: `coalesce(sum(x), 0)`.',
      '`count(*)` = number of rows (checks no value). `count(col)` = rows where `col IS NOT NULL` (use for "how many have this filled in"). `count(DISTINCT col)` = distinct non-NULL values (use for "how many different X"). `count(1)` == `count(*)`.',
      '`min`/`max` work on ANY orderable type: `max(created_at)`, `min(name)`. `string_agg(expr, sep ORDER BY ...)` concatenates; `array_agg(expr ORDER BY ...)` collects into an array; `json_agg`/`jsonb_agg` build JSON; `bool_and`/`bool_or` = all/any true.',
      '`ORDER BY` INSIDE an aggregate\'s parens controls element order (`string_agg`/`array_agg`). `count(DISTINCT x)` is common; `sum(DISTINCT x)` is almost always a BUG (two rows can legitimately share a value).',
    ],
    keyTakeawaysHi: [
      'Ek aggregate kई rows consume karta hai -> EK value. Bina `GROUP BY` ke, poore set par ek aggregate THEEK EK row lautata hai. Bina `GROUP BY` ke `SELECT name, count(*)` nahi kar sakte (Lesson 2).',
      '`count(*)` ke alawa HAR aggregate `NULL` inputs SKIP karta hai. `10, 20, NULL, 5` par: `count(*)`=4, `count(n)`=3, `sum`=35, `avg`=11.67 (= 35/3, 35/4 NAHI), `min`/`max`=5/20.',
      '`avg(n)` = `sum(n) / count(n)` — to ek hand-rolled `sum(n) / count(*)` NULLs मौjood hone par ALAG (bahut kam) answer deta hai. NULLs zero chahिए? `avg(coalesce(n, 0))`.',
      'ZERO rows ka `sum`/`avg`/`min`/`max` `NULL` lautata hai, `0` NAHI. Sirf `count(...)` ek number (`0`) lautata hai. Arithmetic ke liye wrap: `coalesce(sum(x), 0)`.',
      '`count(*)` = rows ki sankhya (koi value check nahi). `count(col)` = rows jahaan `col IS NOT NULL`. `count(DISTINCT col)` = distinct non-NULL values ("kitne alag X"). `count(1)` == `count(*)`.',
      '`min`/`max` KISI BHI orderable type par: `max(created_at)`, `min(name)`. `string_agg(expr, sep ORDER BY ...)` concatenate; `array_agg(expr ORDER BY ...)` array mein collect; `bool_and`/`bool_or` = all/any true.',
      'Aggregate ke parens ke ANDAR `ORDER BY` element order control karta hai. `count(DISTINCT x)` common hai; `sum(DISTINCT x)` lगभग hamesha ek BUG hai.',
    ],
  },

  {
    slug: 'sql-group-by-fundamentals',
    title: 'GROUP BY: One Row Per Group',
    titleHi: 'GROUP BY: Prati Group Ek Row',
    description: '`GROUP BY col` splits the rows into groups that share the same `col` value and returns ONE row per group. Every column in the `SELECT` must then be either in the `GROUP BY` or wrapped in an aggregate — the single most common SQL error.',
    descriptionHi: '`GROUP BY col` rows ko un groups mein split karta hai jo same `col` value share karte hain aur prati group EK row lautata hai. `SELECT` mein har column phir ya to `GROUP BY` mein hona chahिए ya ek aggregate mein wrapped — sabse common SQL error.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Sorting a pile of receipts into labelled envelopes, then writing one summary line per envelope.** You have a shoebox of receipts. You pick a labelling rule — say, one envelope per shop — and drop each receipt into the matching envelope. That is `GROUP BY shop`. Now you throw away the shoebox and keep only the envelopes: you have exactly one envelope per distinct shop. For each envelope you can write a summary line: the shop name (which is written on the envelope, so it is fine to use), the number of receipts inside (`count`), the total spent (`sum`). What you *cannot* write on the summary line is "the receipt amount" — there are many receipts in the envelope, no single amount, so the question is meaningless unless you say *which* summary of them you want (the total? the largest? the average?). If you group by two labels at once — shop *and* month — you get one envelope per (shop, month) combination that actually occurred. Receipts with no shop written on them go into their own "no shop" envelope; they are not discarded.',
      hi: '**Receipts ke ek dher ko labelled envelopes mein sort karna, phir prati envelope ek summary line likhna.** Aapke paas receipts ka ek shoebox hai. Aap ek labelling rule chunte ho — maान lo, prati shop ek envelope — aur har receipt ko matching envelope mein daalte ho. Wo `GROUP BY shop` hai. Ab aap shoebox phenk dete ho aur sirf envelopes rakhte ho: aapke paas theek prati distinct shop ek envelope hai. Har envelope ke liye aap ek summary line likh sakte ho: shop name (jo envelope par likha hai, to istemal karna theek hai), andar receipts ki sankhya (`count`), total spent (`sum`). Jo aap summary line par *nahi* likh sakte wo hai "receipt amount" — envelope mein kई receipts hain, koi single amount nahi. Agar aap ek saath do labels se group karte ho — shop *aur* month — aapko prati (shop, month) combination jo asal mein hua ek envelope milta hai. Bina shop waali receipts apne "no shop" envelope mein jaati hain; wo discard nahi hoti.',
    },

    simple: `**\`GROUP BY\` collapses rows that share a key into one row each**

\`\`\`sql
-- raw rows:                    grouped by region:
-- region | amt                 region | count | sum
-- N      | 100                 N      | 2     | 150
-- N      | 50          -->     S      | 1     | 200
-- S      | 200
SELECT region, count(*), sum(amt)
FROM sales
GROUP BY region;
\`\`\`

**THE RULE: every \`SELECT\` column is in \`GROUP BY\` OR inside an aggregate**

\`\`\`sql
-- ERROR: "column \\"o.city\\" must appear in the GROUP BY clause or be used in an aggregate"
SELECT cust, city, sum(amt) FROM o GROUP BY cust;

-- fix A: group by it too
SELECT cust, city, sum(amt) FROM o GROUP BY cust, city;

-- fix B: aggregate it
SELECT cust, max(city) AS a_city, sum(amt) FROM o GROUP BY cust;
\`\`\`

**Group by several columns → one row per combination**

\`\`\`sql
SELECT region, product, sum(amt)
FROM sales
GROUP BY region, product;      -- one row per (region, product) pair that exists
\`\`\`

**Group by an expression (repeat the expression, not the alias)**

\`\`\`sql
SELECT date_trunc('month', ts) AS month, count(*)
FROM events
GROUP BY date_trunc('month', ts);      -- must repeat the expression
-- (PostgreSQL also allows  GROUP BY month  or  GROUP BY 1  -- but repeating is portable)
\`\`\`

**\`NULL\` forms its own group**

\`\`\`sql
SELECT region, count(*) FROM sales GROUP BY region;
-- rows with region IS NULL are collected into a single group with region = NULL
\`\`\`

**No \`GROUP BY\` + an aggregate = one implicit group (the whole table)**

\`\`\`sql
SELECT count(*), sum(amt) FROM sales;   -- one row, the grand total
\`\`\``,

    simpleHi: `**\`GROUP BY\` un rows ko jo ek key share karti hain ek-ek row mein collapse karta hai**

\`\`\`sql
-- raw rows:                    region se grouped:
-- region | amt                 region | count | sum
-- N      | 100                 N      | 2     | 150
-- N      | 50          -->     S      | 1     | 200
-- S      | 200
SELECT region, count(*), sum(amt)
FROM sales
GROUP BY region;
\`\`\`

**NIYAM: har \`SELECT\` column \`GROUP BY\` mein HAI YA ek aggregate ke andar**

\`\`\`sql
-- ERROR: "column \\"o.city\\" must appear in the GROUP BY clause or be used in an aggregate"
SELECT cust, city, sum(amt) FROM o GROUP BY cust;

-- fix A: ise bhi group karo
SELECT cust, city, sum(amt) FROM o GROUP BY cust, city;

-- fix B: ise aggregate karo
SELECT cust, max(city) AS a_city, sum(amt) FROM o GROUP BY cust;
\`\`\`

**Kई columns se group karo → prati combination ek row**

\`\`\`sql
SELECT region, product, sum(amt)
FROM sales
GROUP BY region, product;      -- prati (region, product) pair jo मौjood hai ek row
\`\`\`

**Ek expression se group karo (expression repeat karo, alias nahi)**

\`\`\`sql
SELECT date_trunc('month', ts) AS month, count(*)
FROM events
GROUP BY date_trunc('month', ts);      -- expression repeat karna hoga
-- (PostgreSQL  GROUP BY month  ya  GROUP BY 1  bhi allow karta hai -- par repeat karna portable hai)
\`\`\`

**\`NULL\` apna group banata hai**

\`\`\`sql
SELECT region, count(*) FROM sales GROUP BY region;
-- region IS NULL waali rows ek single group mein collect hoti hain region = NULL ke saath
\`\`\`

**Bina \`GROUP BY\` + ek aggregate = ek implicit group (poori table)**

\`\`\`sql
SELECT count(*), sum(amt) FROM sales;   -- ek row, grand total
\`\`\``,

    content: `## What \`GROUP BY\` does

\`GROUP BY expr\` partitions the rows (the ones that survived \`WHERE\`) into **groups** where every row in a group has the same value of \`expr\`. The query then emits **one row per group**, and any aggregate in the \`SELECT\` is computed **over that group's rows only**.

\`\`\`sql
SELECT region, count(*) AS n, sum(amt) AS total
FROM sales
GROUP BY region;
\`\`\`

If \`sales\` has 100 rows spread across 4 regions, this returns **4 rows**. \`count(*)\` for the \`'N'\` row is the number of \`'N'\` sales, \`sum(amt)\` is the total of \`'N'\` amounts.

## The rule that causes the classic error

Once you have a \`GROUP BY\`, the query produces one row per group, so **every expression in the \`SELECT\` list must produce one value per group**. That means each \`SELECT\` item must be either:

1. **A column (or expression) that appears in the \`GROUP BY\`** — it is constant within the group, so it has one value.
2. **Wrapped in an aggregate** — \`sum(x)\`, \`count(x)\`, \`max(x)\` — which collapses the group's many values to one.

Anything else is ambiguous. \`SELECT customer_id, city, sum(total) FROM orders GROUP BY customer_id\` fails with:

\`\`\`
ERROR: column "orders.city" must appear in the GROUP BY clause
       or be used in an aggregate function
\`\`\`

because a customer might have orders from several cities and the database does not know which \`city\` you want on the single output row. The fixes:

- **\`GROUP BY customer_id, city\`** — now there is one row per (customer, city), and \`city\` is constant per group.
- **\`max(city)\` / \`min(city)\`** — pick one deterministically.
- **\`string_agg(DISTINCT city, ', ')\`** — list them all.

> **MySQL note:** older MySQL (with \`ONLY_FULL_GROUP_BY\` disabled) silently allowed the broken query and returned an *arbitrary* \`city\`. Every other database, and modern MySQL, rejects it. Do not rely on the lax behaviour.

## Grouping by multiple columns

\`GROUP BY a, b\` makes one group per **distinct combination** of \`(a, b)\` that actually occurs in the data. It does not generate combinations that have no rows (for that, see \`GROUPING SETS\` / \`CUBE\` in Lesson 5).

\`\`\`sql
SELECT region, product, sum(amt)
FROM sales
GROUP BY region, product;
-- 3 regions x 4 products, but only 9 combinations have sales -> 9 rows
\`\`\`

## Grouping by an expression

You can group by a computed value:

\`\`\`sql
SELECT date_trunc('month', ordered_at) AS month, sum(total)
FROM orders
GROUP BY date_trunc('month', ordered_at)
ORDER BY month;
\`\`\`

The \`GROUP BY\` must contain the **same expression**. Standard SQL does not let you reference the \`SELECT\` alias (\`month\`) in \`GROUP BY\` — though **PostgreSQL does** as an extension, and also accepts \`GROUP BY 1\` (the first \`SELECT\` item by position). Repeating the expression is the portable choice; \`GROUP BY 1\` is concise but fragile if the \`SELECT\` list changes.

## \`NULL\` is a group

\`GROUP BY\` treats all \`NULL\`s as **equal to each other** for grouping purposes (unlike \`=\`, which says \`NULL = NULL\` is unknown). So every row with \`region IS NULL\` lands in **one** group, whose \`region\` value in the output is \`NULL\`. Use \`ORDER BY region NULLS LAST\` to park that group at the bottom, or \`coalesce(region, 'Unknown')\` to label it.

## The implicit single group

A \`SELECT\` with an aggregate and **no \`GROUP BY\`** treats the entire result set as one group and returns exactly one row:

\`\`\`sql
SELECT count(*), sum(amt), avg(amt) FROM sales;   -- 1 row: the grand total
\`\`\`

If \`sales\` is empty, you still get **one row**: \`count\` is \`0\`, \`sum\` and \`avg\` are \`NULL\`. (Contrast: \`SELECT amt FROM sales\` on an empty table returns **zero rows**.)

## \`GROUP BY\` and \`DISTINCT\` overlap

\`SELECT DISTINCT region FROM sales\` and \`SELECT region FROM sales GROUP BY region\` return the **same rows**. \`GROUP BY\` is the right tool when you also want aggregates; \`DISTINCT\` is clearer when you just want unique values. The planner often executes them identically.

## Where \`GROUP BY\` sits in processing order

\`FROM\` → \`WHERE\` → **\`GROUP BY\`** → aggregates → \`HAVING\` → \`SELECT\` (aliases assigned here) → \`ORDER BY\` → \`LIMIT\`. This is why \`WHERE\` cannot see aggregates (they have not run yet) and why \`HAVING\` can (Lesson 3), and why \`ORDER BY\` *can* use a \`SELECT\` alias but \`GROUP BY\` (in standard SQL) cannot.`,

    contentHi: `## \`GROUP BY\` kya karta hai

\`GROUP BY expr\` rows ko (jo \`WHERE\` se bachीं) **groups** mein partition karta hai jahaan ek group mein har row ka \`expr\` ka same value hai. Query phir **prati group ek row** emit karti hai, aur \`SELECT\` mein koi bhi aggregate **sirf us group ki rows par** compute hota hai.

\`\`\`sql
SELECT region, count(*) AS n, sum(amt) AS total
FROM sales
GROUP BY region;
\`\`\`

Agar \`sales\` mein 4 regions par 100 rows hain, ye **4 rows** lautata hai.

## Wo niyam jo classic error karta hai

Ek baar \`GROUP BY\` hone par, query prati group ek row produce karti hai, to **\`SELECT\` list mein har expression ko prati group ek value produce karni hogi**. Iska matlab har \`SELECT\` item ya to:

1. **Ek column (ya expression) jo \`GROUP BY\` mein aata hai** — group ke andar constant hai.
2. **Ek aggregate mein wrapped** — \`sum(x)\`, \`count(x)\`, \`max(x)\`.

Kuch aur ambiguous hai. \`SELECT customer_id, city, sum(total) FROM orders GROUP BY customer_id\` fail hota hai:

\`\`\`
ERROR: column "orders.city" must appear in the GROUP BY clause
       or be used in an aggregate function
\`\`\`

kyunki ek customer ke kई cities se orders ho sakte hain. Fixes:

- **\`GROUP BY customer_id, city\`**
- **\`max(city)\` / \`min(city)\`**
- **\`string_agg(DISTINCT city, ', ')\`**

> **MySQL note:** purana MySQL (\`ONLY_FULL_GROUP_BY\` disabled ke saath) chupchaap broken query allow karta tha aur ek *arbitrary* \`city\` lautata tha. Har doosra database ise reject karta hai. Lax behaviour par bharosa mat karo.

## Kई columns se grouping

\`GROUP BY a, b\` \`(a, b)\` ke har **distinct combination** ke liye ek group banata hai jo asal mein data mein hota hai. Ye un combinations ko generate nahi karta jinki koi rows nahi (uske liye Lesson 5 dekho).

## Ek expression se grouping

\`\`\`sql
SELECT date_trunc('month', ordered_at) AS month, sum(total)
FROM orders
GROUP BY date_trunc('month', ordered_at)
ORDER BY month;
\`\`\`

\`GROUP BY\` mein **same expression** hona chahिए. Standard SQL aapko \`GROUP BY\` mein \`SELECT\` alias reference nahi karne deta — halांki **PostgreSQL deta hai**, aur \`GROUP BY 1\` bhi accept karta hai. Expression repeat karna portable choice hai.

## \`NULL\` ek group hai

\`GROUP BY\` grouping ke liye sabhi \`NULL\`s ko **ek doosre ke barabar** treat karta hai. To \`region IS NULL\` waali har row **ek** group mein aati hai. \`ORDER BY region NULLS LAST\` ya \`coalesce(region, 'Unknown')\` istemal karo.

## Implicit single group

Ek aggregate aur **koi \`GROUP BY\` nahi** waala \`SELECT\` poore result set ko ek group treat karta hai aur theek ek row lautata hai:

\`\`\`sql
SELECT count(*), sum(amt), avg(amt) FROM sales;   -- 1 row: grand total
\`\`\`

Agar \`sales\` empty hai, aapko phir bhi **ek row** milti hai: \`count\` \`0\` hai, \`sum\`/\`avg\` \`NULL\`.

## \`GROUP BY\` aur \`DISTINCT\` overlap

\`SELECT DISTINCT region FROM sales\` aur \`SELECT region FROM sales GROUP BY region\` **same rows** lautate hain. \`GROUP BY\` tab sahi hai jab aap aggregates bhi chahte ho; \`DISTINCT\` tab saaf hai jab aap sirf unique values chahte ho.

## Processing order mein \`GROUP BY\` kahaan

\`FROM\` → \`WHERE\` → **\`GROUP BY\`** → aggregates → \`HAVING\` → \`SELECT\` (aliases yahaan) → \`ORDER BY\` → \`LIMIT\`. Isiliye \`WHERE\` aggregates nahi dekh sakta aur \`HAVING\` dekh sakta hai (Lesson 3).`,

    examples: [
      {
        title: 'GROUP BY collapses rows; NULL forms its own group',
        titleHi: 'GROUP BY rows collapse karta hai; NULL apna group banata hai',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES
  ('N', 100), ('N', 50), ('S', 200), (NULL, 10), (NULL, 5);

SELECT region, count(*) AS n, sum(amt) AS total
FROM sales
GROUP BY region
ORDER BY region NULLS LAST;`,
        output: ` region | n | total
--------+---+-------
 N      | 2 | 150
 S      | 1 | 200
 NULL   | 2 | 15
(3 rows)`,
        explain: '`GROUP BY region` collapses the 5 raw rows into one row per distinct region. The two rows with `region IS NULL` do NOT vanish — `GROUP BY` treats all NULLs as equal, so they form a single group whose output `region` is `NULL`, with `count = 2` and `sum = 15`. `ORDER BY region NULLS LAST` parks that group at the bottom.',
        explainHi: '`GROUP BY region` 5 raw rows ko prati distinct region ek row mein collapse karता hai. `region IS NULL` waali do rows GAYAB nahi hoती — `GROUP BY` sabhi NULLs ko barabar treat karता hai, to wo ek single group banाती hain jiska output `region` `NULL` hai, `count = 2` aur `sum = 15` ke saath.',
      },
      {
        title: 'The classic error: a SELECT column not in GROUP BY and not aggregated',
        titleHi: 'Classic error: ek SELECT column jo GROUP BY mein nahi aur aggregated nahi',
        code: `CREATE TABLE o (cust text, city text, amt int);
INSERT INTO o VALUES ('a', 'LDN', 10), ('a', 'MAN', 20), ('b', 'LDN', 5);

-- WRONG: which city belongs on customer a's single output row?
SELECT cust, city, sum(amt) FROM o GROUP BY cust;`,
        output: `[ERROR] column "o.city" must appear in the GROUP BY clause or be used in an aggregate function`,
        explain: "The query groups by `cust` only, so each output row represents one customer — but customer `a` has orders from two cities (`LDN` and `MAN`), and the database has no basis to pick which `city` to show on `a`'s single row. It raises the classic error. The fixes: add `city` to the `GROUP BY` (one row per customer+city), or wrap it — `max(city)`, `string_agg(DISTINCT city, ', ')`.",
        explainHi: "Query sirf `cust` se group karती hai, to har output row ek customer represent karता hai — par customer `a` ke do cities (`LDN` aur `MAN`) se orders hain, aur database ke paas `a` ki single row par kaunsा `city` dikhाना hai iska koi aadhaar nahi. Ye classic error raise karता hai. Fixes: `city` ko `GROUP BY` mein add karo, ya use wrap karo — `max(city)`, `string_agg(DISTINCT city, ', ')`.",
      },
      {
        title: 'Group by multiple columns and by an expression',
        titleHi: 'Kई columns se aur ek expression se group karo',
        code: `SET TIME ZONE 'UTC';
CREATE TABLE ev (ts timestamptz, kind text);
INSERT INTO ev VALUES
  ('2026-01-05 10:00+00', 'click'), ('2026-01-05 11:00+00', 'click'),
  ('2026-02-20 09:00+00', 'view'),  ('2026-02-21 09:00+00', 'click');

SELECT date_trunc('month', ts)::date::text AS month, kind, count(*) AS n
FROM ev
GROUP BY date_trunc('month', ts), kind
ORDER BY month, kind;`,
        output: ` month      | kind  | n
------------+-------+---
 2026-01-01 | click | 2
 2026-02-01 | click | 1
 2026-02-01 | view  | 1
(3 rows)`,
        explain: "You can group by a computed expression. Here `date_trunc('month', ts)` rounds every timestamp down to the first of its month, and grouping by that expression plus `kind` gives one row per (month, kind) that occurs. The `GROUP BY` must REPEAT the expression `date_trunc('month', ts)` — standard SQL does not let it reference the `SELECT` alias `month` (PostgreSQL allows it as an extension, but repeating is portable).",
        explainHi: "Aap ek computed expression se group kar sakte ho. Yahaan `date_trunc('month', ts)` har timestamp ko iske month ke pehle din tak round karता hai, aur us expression plus `kind` se group karna prati (month, kind) jo hoता hai ek row deता hai. `GROUP BY` ko expression `date_trunc('month', ts)` REPEAT karna hoga — standard SQL ise `SELECT` alias `month` reference nahi karने deta.",
      },
    ],

    mistakes: [
      {
        wrong: `-- "each customer's name and their order total"
SELECT customer_id, customer_name, sum(total)
FROM orders
GROUP BY customer_id;
-- ERROR: customer_name must appear in GROUP BY or an aggregate`,
        right: `SELECT customer_id, customer_name, sum(total)
FROM orders
GROUP BY customer_id, customer_name;
-- customer_name is functionally dependent on customer_id, so grouping by both is harmless`,
        why: 'Every non-aggregated column in the SELECT must appear in the GROUP BY. Even though customer_name is functionally determined by customer_id, so there is really only one name per group, standard SQL requires you to say so by listing it in the GROUP BY. Adding it changes nothing about the grouping, because the pair customer_id and customer_name has the same distinct combinations as customer_id alone, but it satisfies the rule. Postgres 9.1 and later can actually infer this when you group by a table\'s primary key, but listing the column explicitly is portable and clear.',
        whyHi: 'SELECT mein har non-aggregated column ko GROUP BY mein aana chahिए. Chahे customer_name customer_id se functionally determined ho, standard SQL aapse ise GROUP BY mein list karke kehne ko kehta hai. Ise add karna grouping ke baare mein kuch nahi badalta, kyunki jodi customer_id aur customer_name ke wahi distinct combinations hain jo akele customer_id ke, par ye niyam satisfy karta hai. Postgres primary key se group karne par ise infer kar sakta hai, par column explicitly list karna portable hai.',
      },
      {
        wrong: `-- group by the SELECT alias
SELECT extract(year FROM hired_at) AS yr, count(*)
FROM employee
GROUP BY yr;
-- works in PostgreSQL and MySQL, ERRORS in some other databases / older standards`,
        right: `SELECT extract(year FROM hired_at) AS yr, count(*)
FROM employee
GROUP BY extract(year FROM hired_at);
-- repeat the expression -- portable everywhere`,
        why: 'Aliases in the SELECT list are assigned late in query processing, after GROUP BY has already run. Standard SQL therefore does not let GROUP BY reference a SELECT alias. PostgreSQL and MySQL relax this and accept GROUP BY yr, but relying on it makes the query non-portable and can surprise a reader who knows the standard order. Repeating the expression in the GROUP BY, or using GROUP BY 1 to refer to the first select item by position, both work; repeating the expression is the most explicit. Note ORDER BY is different: it runs after SELECT, so ORDER BY yr is fine everywhere.',
        whyHi: 'SELECT list mein aliases query processing mein late assign hote hain, GROUP BY ke pehle chal jaane ke baad. Standard SQL isliye GROUP BY ko SELECT alias reference nahi karne deta. PostgreSQL aur MySQL ise relax karte hain aur GROUP BY yr accept karte hain, par ispar bharosa karna query ko non-portable banata hai. GROUP BY mein expression repeat karna, ya position se pehle select item refer karne ke liye GROUP BY 1, dono chalte hain. ORDER BY alag hai: ye SELECT ke baad chalta hai, to ORDER BY yr har jagah theek hai.',
      },
      {
        wrong: `-- "total sales" -- expecting one number, but forgot this runs per group
SELECT region, sum(amt) FROM sales;
-- ERROR: column "sales.region" must appear in the GROUP BY clause`,
        right: `-- if you want the grand total, drop the bare column:
SELECT sum(amt) FROM sales;
-- if you want it per region, add GROUP BY:
SELECT region, sum(amt) FROM sales GROUP BY region;`,
        why: 'The moment a SELECT contains an aggregate, every other item must be groupable. SELECT region, sum(amt) with no GROUP BY asks for a single grand-total row, but then region has many values and nowhere to go. You have to decide: either you want one row for the whole table, in which case remove region, or you want one row per region, in which case add GROUP BY region. There is no meaning to "the region" alongside a grand total.',
        whyHi: 'Jis pal ek SELECT mein ek aggregate hota hai, har doosre item ko groupable hona chahिए. Bina GROUP BY ke SELECT region, sum(amt) ek single grand-total row maangta hai, par phir region ki kई values hain aur jaane ki koi jagah nahi. Aapko decide karna hoga: ya poori table ke liye ek row (region hatao), ya prati region ek row (GROUP BY region add karo).',
      },
    ],

    realWorld: [
      {
        en: '**A "sales by month" endpoint: `GROUP BY date_trunc(\'month\', created_at)` with the expression repeated (not the alias)** so the same query text runs unchanged against the analytics replica which is a different engine.',
        hi: '**Ek "sales by month" endpoint: expression repeat ke saath `GROUP BY date_trunc(\'month\', created_at)`** taaki wahi query text analytics replica par bhi chale.',
      },
      {
        en: '**`SELECT status, count(*) FROM jobs GROUP BY status` on a queue dashboard** — one row per status, and a `NULL` status row immediately flags jobs that were inserted without one.',
        hi: '**Ek queue dashboard par `SELECT status, count(*) FROM jobs GROUP BY status`** — ek `NULL` status row turant un jobs ko flag karta hai jo bina status ke insert hue.',
      },
      {
        en: '**A billing rollup that groups by `(account_id, plan)` and is reviewed against the "every column grouped or aggregated" rule** — a linter in CI rejects a `GROUP BY` query that would rely on MySQL\'s old lax mode.',
        hi: '**Ek billing rollup jo `(account_id, plan)` se group karta hai** — CI mein ek linter MySQL ke purane lax mode par bharosa karne waali query reject karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the rule for what can appear in the `SELECT` list of a `GROUP BY` query.',
        qHi: 'Ek `GROUP BY` query ki `SELECT` list mein kya aa sakta hai, iska niyam samjhao.',
        a: 'A GROUP BY query emits one row per group, so every expression in the SELECT list has to resolve to a single value for the whole group. That leaves exactly two legal kinds of SELECT item. First, a column or expression that is listed in the GROUP BY: it is constant within each group by definition, so it has one value. Second, an aggregate like sum, count, max, avg applied to a column: the aggregate is what collapses the group\'s many values into one. Anything else, a bare column that is neither grouped nor aggregated, is ambiguous, because the group may contain many different values of that column and the database has no basis to pick one. Standard SQL and every serious database reject it with a message like "column must appear in the GROUP BY clause or be used in an aggregate function". Old MySQL with ONLY_FULL_GROUP_BY turned off was the notorious exception: it accepted the query and returned an arbitrary value, which hid real bugs. The fixes for a legitimately-needed column are to add it to the GROUP BY, wrap it in min or max, or use string_agg to list all its values.',
        aHi: 'Ek GROUP BY query prati group ek row emit karti hai, to SELECT list mein har expression ko poore group ke liye ek single value resolve karni hogi. Isse theek do legal tarah ke SELECT item bachte hain. Pehla, ek column ya expression jo GROUP BY mein listed hai: ye har group ke andar constant hai. Doosra, ek aggregate jaise sum, count, max ek column par. Kuch aur — ek bare column jo na grouped na aggregated — ambiguous hai, kyunki group mein us column ki kई alag values ho sakti hain. Standard SQL aur har serious database ise reject karta hai. Purana MySQL ONLY_FULL_GROUP_BY off ke saath notorious exception tha. Fixes: ise GROUP BY mein add karo, min ya max mein wrap karo, ya string_agg istemal karo.',
      },
      {
        q: 'How does `GROUP BY` handle `NULL`, and where does `GROUP BY` sit in the logical processing order?',
        qHi: '`GROUP BY` `NULL` ko kaise handle karta hai, aur `GROUP BY` logical processing order mein kahaan hai?',
        a: 'For grouping, GROUP BY treats all NULLs as equal to one another, which is different from the equals operator where NULL equals NULL is unknown. So every row whose group key is NULL falls into a single group, and that group shows up in the output with NULL as its key value. You often want to push it to the end with ORDER BY key NULLS LAST, or relabel it with coalesce of key comma some-string. As for processing order: the logical sequence is FROM, then WHERE, then GROUP BY, then the aggregates are computed, then HAVING, then the SELECT list including alias assignment, then ORDER BY, then LIMIT. Two consequences follow. WHERE runs before grouping and aggregation, so it cannot reference an aggregate; a condition on an aggregate goes in HAVING, which runs after. And SELECT aliases are assigned after GROUP BY, so standard SQL does not let GROUP BY use an alias, though Postgres and MySQL allow it as an extension; ORDER BY, running after SELECT, can use aliases everywhere.',
        aHi: 'Grouping ke liye, GROUP BY sabhi NULLs ko ek doosre ke barabar treat karta hai, jo equals operator se alag hai jahaan NULL equals NULL unknown hai. To har row jiski group key NULL hai ek single group mein girti hai, aur wo group output mein NULL key value ke saath dikhता hai. Aap ise aksar ORDER BY key NULLS LAST se end mein push karte ho, ya coalesce se relabel karte ho. Processing order: FROM, phir WHERE, phir GROUP BY, phir aggregates compute, phir HAVING, phir SELECT list including alias assignment, phir ORDER BY, phir LIMIT. Do natije: WHERE grouping se pehle chalta hai to ek aggregate reference nahi kar sakta; aggregate ki condition HAVING mein jaati hai. Aur SELECT aliases GROUP BY ke baad assign hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Table `payment(method text, amount int)` with rows `(\'card\', 100), (\'card\', 50), (\'cash\', 30), (NULL, 20), (NULL, 10)`. Write `SELECT method, count(*), sum(amount) FROM payment GROUP BY method ORDER BY method NULLS LAST`. Confirm 3 rows including one with `method = NULL`, `count = 2`, `sum = 30`.',
        taskHi: 'Table `payment(method, amount)` rows `(\'card\', 100), (\'card\', 50), (\'cash\', 30), (NULL, 20), (NULL, 10)` ke saath. `SELECT method, count(*), sum(amount) FROM payment GROUP BY method ORDER BY method NULLS LAST`.',
        hint: 'The two `NULL` method rows collapse into ONE group (GROUP BY treats NULLs as equal), so you get a row with `method = NULL`, `count = 2`, `sum = 30`.',
        hintHi: 'Do `NULL` method rows EK group mein collapse hoti hain, to aapko `method = NULL`, `count = 2`, `sum = 30` waali ek row milti hai.',
      },
      {
        task: 'Table `emp(dept text, title text, salary int)` with 5 rows across 2 depts. First run `SELECT dept, title, sum(salary) FROM emp GROUP BY dept` and observe the error. Then fix it two ways: (a) `GROUP BY dept, title`; (b) `GROUP BY dept` with `string_agg(DISTINCT title, \', \')` instead of the bare `title`.',
        taskHi: 'Table `emp(dept, title, salary)` 2 depts par 5 rows ke saath. Pehle `SELECT dept, title, sum(salary) FROM emp GROUP BY dept` chalao aur error dekho. Phir do tareeke se fix karo.',
        hint: 'The error names `title` as "must appear in the GROUP BY clause or be used in an aggregate". (a) adds it to the key; (b) aggregates it with `string_agg`.',
        hintHi: 'Error `title` ko name karta hai. (a) ise key mein add karta hai; (b) ise `string_agg` se aggregate karta hai.',
      },
      {
        task: 'Table `login(ts timestamptz, user_id int)` with logins across 3 different days. Write a query grouping by `ts::date` (cast to date, then `::text` for display) that returns `day` and `count(*)`. Repeat the `ts::date` expression in the `GROUP BY` — do NOT use the alias. Confirm one row per day.',
        taskHi: 'Table `login(ts timestamptz, user_id int)` 3 alag days par logins ke saath. `ts::date` se group karke `day` aur `count(*)` lautao. `GROUP BY` mein `ts::date` expression repeat karo — alias istemal NA karo.',
        hint: '`SELECT (ts::date)::text AS day, count(*) FROM login GROUP BY ts::date ORDER BY ts::date`. Start with `SET TIME ZONE \'UTC\';` and cast to `::text` so the verifier renders a plain date string.',
        hintHi: '`SELECT (ts::date)::text AS day, count(*) FROM login GROUP BY ts::date ORDER BY ts::date`. `SET TIME ZONE \'UTC\';` se shuru karo aur `::text` cast karo.',
      },
    ],

    keyTakeaways: [
      '`GROUP BY expr` partitions the post-`WHERE` rows into groups sharing the same `expr`, and emits ONE row per group. Each aggregate in the `SELECT` is computed over THAT group\'s rows only. 100 rows across 4 regions -> 4 output rows.',
      'THE RULE (the #1 SQL error): every `SELECT` item must be EITHER in the `GROUP BY` OR wrapped in an aggregate. `SELECT cust, city, sum(amt) ... GROUP BY cust` -> `ERROR: column "city" must appear in the GROUP BY clause or be used in an aggregate function`.',
      'Fixes for the error: (a) `GROUP BY cust, city` (add it to the key); (b) `max(city)` / `min(city)` (pick one); (c) `string_agg(DISTINCT city, \', \')` (list all). Old MySQL with `ONLY_FULL_GROUP_BY` off returned an ARBITRARY value — every other DB rejects it; don\'t rely on the lax mode.',
      '`GROUP BY a, b` = one group per distinct `(a, b)` combination THAT OCCURS in the data (it does NOT invent empty combinations — that\'s `GROUPING SETS`/`CUBE`, Lesson 5).',
      'Group by an EXPRESSION by repeating it: `GROUP BY date_trunc(\'month\', ts)`. Standard SQL forbids the `SELECT` alias in `GROUP BY` (aliases are assigned later); PostgreSQL/MySQL allow `GROUP BY month` or `GROUP BY 1` as an extension — repeating the expression is portable.',
      '`NULL` forms its OWN single group (`GROUP BY` treats all NULLs as equal, unlike `=`). Output shows `region = NULL`; use `ORDER BY region NULLS LAST` or `coalesce(region, \'Unknown\')`.',
      'An aggregate with NO `GROUP BY` = one implicit group (the whole table) -> exactly 1 row, even on an empty table (`count`=0, `sum`/`avg`=NULL). Processing order: `FROM`->`WHERE`->`GROUP BY`->aggregates->`HAVING`->`SELECT`(aliases)->`ORDER BY`->`LIMIT`.',
    ],
    keyTakeawaysHi: [
      '`GROUP BY expr` post-`WHERE` rows ko same `expr` share karne waale groups mein partition karta hai, aur prati group EK row emit karta hai. `SELECT` mein har aggregate SIRF us group ki rows par compute hota hai. 4 regions par 100 rows -> 4 output rows.',
      'NIYAM (#1 SQL error): har `SELECT` item YA `GROUP BY` mein HO YA ek aggregate mein wrapped. `SELECT cust, city, sum(amt) ... GROUP BY cust` -> `ERROR: column "city" must appear in the GROUP BY clause or be used in an aggregate function`.',
      'Error ke fixes: (a) `GROUP BY cust, city`; (b) `max(city)` / `min(city)`; (c) `string_agg(DISTINCT city, \', \')`. Purana MySQL `ONLY_FULL_GROUP_BY` off ke saath ARBITRARY value lautata tha — har doosra DB reject karta hai.',
      '`GROUP BY a, b` = prati distinct `(a, b)` combination JO data mein HOTA hai ek group (ye khaali combinations invent NAHI karta — wo `GROUPING SETS`/`CUBE`, Lesson 5).',
      'Ek EXPRESSION se group karo use repeat karke: `GROUP BY date_trunc(\'month\', ts)`. Standard SQL `GROUP BY` mein `SELECT` alias forbid karta hai; PostgreSQL/MySQL `GROUP BY month` ya `GROUP BY 1` allow karte hain — expression repeat karna portable hai.',
      '`NULL` apna EK single group banata hai (`GROUP BY` sabhi NULLs ko barabar treat karta hai). Output `region = NULL` dikhता hai; `ORDER BY region NULLS LAST` ya `coalesce(region, \'Unknown\')` istemal karo.',
      'Bina `GROUP BY` ke ek aggregate = ek implicit group (poori table) -> theek 1 row, empty table par bhi (`count`=0, `sum`/`avg`=NULL). Processing order: `FROM`->`WHERE`->`GROUP BY`->aggregates->`HAVING`->`SELECT`->`ORDER BY`->`LIMIT`.',
    ],
  },

  {
    slug: 'sql-having-vs-where',
    title: 'HAVING vs WHERE: Filter Rows, or Filter Groups?',
    titleHi: 'HAVING vs WHERE: Rows Filter Karo, Ya Groups Filter Karo?',
    description: '`WHERE` filters individual rows BEFORE they are grouped. `HAVING` filters whole groups AFTER aggregation, so it is the only place you can write a condition on `sum(...)` or `count(...)`. Putting a non-aggregate condition in `HAVING` instead of `WHERE` still works but is slower.',
    descriptionHi: '`WHERE` individual rows ko grouped hone se PEHLE filter karta hai. `HAVING` poore groups ko aggregation ke BAAD filter karta hai, to ye ek matra jagah hai jahaan aap `sum(...)` ya `count(...)` par condition likh sakte ho. Ek non-aggregate condition ko `WHERE` ke bजाy `HAVING` mein daalna phir bhi chalta hai par slower hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Screening job applicants, then screening the shortlists.** Two different filtering moments. First, as applications come in, you reject any that fail a per-applicant rule — no degree, wrong country, missing a required certificate. That is `WHERE`: it looks at one applicant at a time and throws out the ones that do not qualify, before you do anything else. Then you sort the survivors into piles by the role they applied for, and now you assess each *pile* as a whole: "drop any role that attracted fewer than five qualified applicants — not worth interviewing for". That rule is about a property of the whole pile (its size), not any one applicant, so it can only be applied *after* the piles exist. That is `HAVING`. You could, in principle, wait and check every per-applicant rule at the pile stage too, but that means you carried a load of hopeless applications all the way through the sorting step for nothing — cheaper to reject them at the door.',
      hi: '**Job applicants ko screen karna, phir shortlists ko screen karna.** Do alag filtering moments. Pehle, jaise applications aati hain, aap kisi bhi ko reject karte ho jo ek per-applicant rule fail karti hai — koi degree nahi, galat country. Wo `WHERE` hai: ye ek time par ek applicant dekhta hai. Phir aap survivors ko un roles ke piles mein sort karte ho jinke liye unhone apply kiya, aur ab aap har *pile* ko ek whole assess karte ho: "koi bhi role drop karo jise paanch se kam qualified applicants mile". Wo rule poore pile ki ek property (iska size) ke baare mein hai, kisi ek applicant ke nahi, to ye sirf piles banne ke *baad* apply ho sakta hai. Wo `HAVING` hai. Aap principle mein har per-applicant rule pile stage par bhi check kar sakte ho, par iska matlab aapne bekaar applications ko sorting step tak dhoya bekaar mein.',
    },

    simple: `**\`WHERE\` filters rows before grouping. \`HAVING\` filters groups after.**

\`\`\`sql
SELECT   cust, sum(amt) AS paid_total
FROM     ord
WHERE    status = 'paid'      -- (1) keep only paid rows -- BEFORE grouping
GROUP BY cust                 -- (2) one group per customer
HAVING   sum(amt) > 200       -- (3) keep only groups whose paid total exceeds 200
ORDER BY cust;                -- (4)
\`\`\`

**\`HAVING\` is the only place an aggregate condition is legal**

\`\`\`sql
-- ERROR: aggregate functions are not allowed in WHERE
SELECT cust, sum(amt) FROM ord GROUP BY cust WHERE sum(amt) > 100;

-- correct:
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING sum(amt) > 100;
\`\`\`

**A non-aggregate condition works in \`HAVING\` but belongs in \`WHERE\`**

\`\`\`sql
-- works, but slow: every row is grouped, then whole groups are discarded
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING cust <> 'test';

-- better: discard the rows up front, so they never enter a group
SELECT cust, sum(amt) FROM ord WHERE cust <> 'test' GROUP BY cust;
\`\`\`

**Rule of thumb**

\`\`\`
condition mentions an aggregate  (sum, count, avg, ...)   -> HAVING
condition is about a single row  (status, date, country)  -> WHERE
\`\`\`

**Both can appear together — they do different jobs**

\`\`\`sql
SELECT product, count(*) AS n_sales, sum(qty) AS units
FROM sale
WHERE  sold_at >= date '2026-01-01'   -- row filter: this year only
GROUP BY product
HAVING sum(qty) >= 100;               -- group filter: only strong sellers
\`\`\``,

    simpleHi: `**\`WHERE\` rows ko grouping se pehle filter karta hai. \`HAVING\` groups ko baad mein.**

\`\`\`sql
SELECT   cust, sum(amt) AS paid_total
FROM     ord
WHERE    status = 'paid'      -- (1) sirf paid rows rakho -- grouping se PEHLE
GROUP BY cust                 -- (2) prati customer ek group
HAVING   sum(amt) > 200       -- (3) sirf wo groups rakho jinka paid total 200 se zyada
ORDER BY cust;                -- (4)
\`\`\`

**\`HAVING\` ek matra jagah hai jahaan ek aggregate condition legal hai**

\`\`\`sql
-- ERROR: aggregate functions are not allowed in WHERE
SELECT cust, sum(amt) FROM ord GROUP BY cust WHERE sum(amt) > 100;

-- sahi:
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING sum(amt) > 100;
\`\`\`

**Ek non-aggregate condition \`HAVING\` mein chalti hai par \`WHERE\` mein honi chahिए**

\`\`\`sql
-- chalta hai, par slow: har row grouped, phir poore groups discard
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING cust <> 'test';

-- behtar: rows pehle discard karo, wo kabhi ek group mein nahi ghुसती
SELECT cust, sum(amt) FROM ord WHERE cust <> 'test' GROUP BY cust;
\`\`\`

**Rule of thumb**

\`\`\`
condition ek aggregate mention karti hai  (sum, count, avg, ...)   -> HAVING
condition ek single row ke baare mein hai (status, date, country)  -> WHERE
\`\`\`

**Dono ek saath aa sakti hain — wo alag kaam karti hain**

\`\`\`sql
SELECT product, count(*) AS n_sales, sum(qty) AS units
FROM sale
WHERE  sold_at >= date '2026-01-01'   -- row filter: sirf is saal
GROUP BY product
HAVING sum(qty) >= 100;               -- group filter: sirf strong sellers
\`\`\``,

    content: `## Two filters, two moments

A grouped query has **two** filtering stages, and they run at different points:

| clause | filters | runs | can reference an aggregate? |
|---|---|---|---|
| \`WHERE\` | individual **rows** | **before** \`GROUP BY\` | **no** — aggregates have not been computed yet |
| \`HAVING\` | whole **groups** | **after** aggregation | **yes** — that is its whole purpose |

The logical processing order:

\`\`\`
FROM         -- assemble the rows
WHERE        -- drop rows that fail a per-row test        <-- filter 1
GROUP BY     -- partition survivors into groups
(aggregates) -- compute sum / count / avg per group
HAVING       -- drop groups that fail a per-group test    <-- filter 2
SELECT       -- project columns, assign aliases
ORDER BY
LIMIT
\`\`\`

## Why an aggregate cannot go in \`WHERE\`

\`WHERE\` is evaluated **row by row, before any grouping**. At that moment \`sum(amt)\` has no meaning — there is no group to sum over yet. So:

\`\`\`sql
SELECT cust, sum(amt) FROM ord GROUP BY cust WHERE sum(amt) > 100;
-- ERROR: aggregate functions are not allowed in WHERE
\`\`\`

A condition on \`sum(amt)\`, \`count(*)\`, \`avg(x)\`, \`max(x)\` — anything that depends on the whole group — **must** go in \`HAVING\`, which runs after the aggregates exist:

\`\`\`sql
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING sum(amt) > 100;
\`\`\`

\`HAVING\` can also repeat an aggregate that is *not* in the \`SELECT\`: \`HAVING count(*) >= 5\` is fine even if \`count(*)\` is not selected.

## Why a row condition should go in \`WHERE\`, not \`HAVING\`

This runs and gives the right answer:

\`\`\`sql
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING cust <> 'test_account';
\`\`\`

\`cust\` is in the \`GROUP BY\`, so it is available in \`HAVING\`, and the condition filters out the \`test_account\` group. But it is **wasteful**: every \`test_account\` row was carried through the grouping and aggregation step, its \`sum\` was computed, and only then was the whole group thrown away. Move the condition to \`WHERE\` and those rows are dropped **before** grouping — less data to sort, hash, and aggregate:

\`\`\`sql
SELECT cust, sum(amt) FROM ord WHERE cust <> 'test_account' GROUP BY cust;
\`\`\`

**Guideline:** a condition goes in \`WHERE\` unless it *needs* an aggregate. Only genuinely group-level conditions (\`sum > x\`, \`count >= n\`, \`avg between a and b\`) belong in \`HAVING\`.

## \`HAVING\` without \`GROUP BY\`

\`HAVING\` is legal without \`GROUP BY\` — the whole table is the single implicit group:

\`\`\`sql
SELECT sum(amt) FROM ord HAVING sum(amt) > 1000;
-- returns the 1-row grand total, but ONLY if that total exceeds 1000; otherwise 0 rows
\`\`\`

Rare, but occasionally useful as a "only report this if the threshold is met" guard.

## Aliases: what each clause can see

- \`WHERE\` **cannot** use a \`SELECT\` alias (assigned later) — repeat the expression.
- \`HAVING\` **cannot** use a \`SELECT\` alias in standard SQL either — repeat the aggregate. (PostgreSQL does **not** allow \`HAVING\` to reference an output alias, unlike \`GROUP BY\` where it grants an extension.)
- \`ORDER BY\` **can** use a \`SELECT\` alias — it runs last.

\`\`\`sql
SELECT cust, sum(amt) AS total
FROM ord
GROUP BY cust
HAVING sum(amt) > 200        -- repeat the aggregate, NOT  HAVING total > 200
ORDER BY total DESC;         -- alias is fine here
\`\`\`

## \`FILTER\` is often what you actually want

If you find yourself wanting *different* row-filters for *different* aggregates in the same query, that is not a \`WHERE\`/\`HAVING\` question — it is \`FILTER (WHERE ...)\`, covered in Lesson 4:

\`\`\`sql
SELECT cust,
  count(*) FILTER (WHERE status = 'paid')      AS paid,
  count(*) FILTER (WHERE status = 'refunded')  AS refunded
FROM ord GROUP BY cust;
\`\`\``,

    contentHi: `## Do filters, do moments

Ek grouped query mein **do** filtering stages hain, aur wo alag points par chalti hain:

| clause | filters | chalti hai | ek aggregate reference kar sakti hai? |
|---|---|---|---|
| \`WHERE\` | individual **rows** | \`GROUP BY\` se **pehle** | **nahi** |
| \`HAVING\` | poore **groups** | aggregation ke **baad** | **haan** |

Logical processing order:

\`\`\`
FROM         -- rows assemble karo
WHERE        -- per-row test fail karne waali rows drop karo     <-- filter 1
GROUP BY     -- survivors ko groups mein partition karo
(aggregates) -- prati group sum / count / avg compute karo
HAVING       -- per-group test fail karne waale groups drop karo <-- filter 2
SELECT       -- columns project karo, aliases assign karo
ORDER BY
LIMIT
\`\`\`

## Ek aggregate \`WHERE\` mein kyun nahi ja sakta

\`WHERE\` **row by row, kisi bhi grouping se pehle** evaluate hota hai. Us pal \`sum(amt)\` ka koi matlab nahi. To:

\`\`\`sql
SELECT cust, sum(amt) FROM ord GROUP BY cust WHERE sum(amt) > 100;
-- ERROR: aggregate functions are not allowed in WHERE
\`\`\`

\`sum(amt)\`, \`count(*)\`, \`avg(x)\` par ek condition — kuch bhi jo poore group par nirbhar karta hai — \`HAVING\` mein **jाना** chahिए.

\`HAVING\` ek aggregate repeat bhi kar sakta hai jo \`SELECT\` mein *nahi* hai: \`HAVING count(*) >= 5\` theek hai.

## Ek row condition \`WHERE\` mein kyun jाना chahिए, \`HAVING\` mein nahi

Ye chalta hai aur sahi answer deta hai:

\`\`\`sql
SELECT cust, sum(amt) FROM ord GROUP BY cust HAVING cust <> 'test_account';
\`\`\`

\`cust\` \`GROUP BY\` mein hai, to \`HAVING\` mein available hai. Par ye **wasteful** hai: har \`test_account\` row grouping aur aggregation step se dhोया gaya, iska \`sum\` compute hua, aur tabhi poora group phenka gaya. Condition ko \`WHERE\` mein le jao:

\`\`\`sql
SELECT cust, sum(amt) FROM ord WHERE cust <> 'test_account' GROUP BY cust;
\`\`\`

**Guideline:** ek condition \`WHERE\` mein jaati hai jab tak use ek aggregate ki *zaroorat* na ho.

## Bina \`GROUP BY\` ke \`HAVING\`

\`HAVING\` bina \`GROUP BY\` ke legal hai — poori table single implicit group hai:

\`\`\`sql
SELECT sum(amt) FROM ord HAVING sum(amt) > 1000;
-- 1-row grand total lautata hai, par SIRF agar wo total 1000 se zyada hai
\`\`\`

## Aliases: har clause kya dekh sakti hai

- \`WHERE\` ek \`SELECT\` alias **nahi** istemal kar sakta — expression repeat karo.
- \`HAVING\` bhi standard SQL mein ek \`SELECT\` alias **nahi** istemal kar sakta — aggregate repeat karo. (PostgreSQL \`HAVING\` ko output alias reference karne **nahi** deta.)
- \`ORDER BY\` ek \`SELECT\` alias **istemal kar sakta hai** — ye last chalta hai.

\`\`\`sql
SELECT cust, sum(amt) AS total
FROM ord
GROUP BY cust
HAVING sum(amt) > 200        -- aggregate repeat karo, NAHI  HAVING total > 200
ORDER BY total DESC;         -- alias yahaan theek hai
\`\`\`

## \`FILTER\` aksar wo hai jo aap asal mein chahte ho

Agar aap usi query mein *alag* aggregates ke liye *alag* row-filters chahte ho, wo ek \`WHERE\`/\`HAVING\` sawaal nahi hai — wo \`FILTER (WHERE ...)\` hai, Lesson 4.`,

    examples: [
      {
        title: 'WHERE filters rows first, HAVING filters the grouped result',
        titleHi: 'WHERE pehle rows filter karta hai, HAVING grouped result filter karta hai',
        code: `CREATE TABLE ord (cust text, status text, amt int);
INSERT INTO ord VALUES
  ('a', 'paid', 100), ('a', 'paid', 150), ('a', 'cancelled', 999),
  ('b', 'paid', 20),
  ('c', 'paid', 500), ('c', 'paid', 400);

SELECT   cust, sum(amt) AS paid_total, count(*) AS paid_orders
FROM     ord
WHERE    status = 'paid'      -- drop the cancelled 999 row before grouping
GROUP BY cust
HAVING   sum(amt) > 200       -- keep only customers whose paid total exceeds 200
ORDER BY cust;`,
        output: ` cust | paid_total | paid_orders
------+------------+-------------
 a    | 250        | 2
 c    | 900        | 2
(2 rows)`,
        explain: "Order of operations: `WHERE status = 'paid'` runs FIRST and drops the `cancelled` 999 row before any grouping — so it never pollutes a sum. Then `GROUP BY cust` forms the groups and `sum(amt)` is computed per customer. Then `HAVING sum(amt) > 200` drops whole groups: customer `b`'s paid total is only 20, so `b` is removed. `a` (250) and `c` (900) survive.",
        explainHi: "Operations ka order: `WHERE status = 'paid'` PEHLE chalता hai aur `cancelled` 999 row ko kisi bhi grouping se pehle drop karता hai — to ye kabhi ek sum polluta nahi. Phir `GROUP BY cust` groups banाता hai aur `sum(amt)` prati customer compute hoता hai. Phir `HAVING sum(amt) > 200` poore groups drop karता hai: customer `b` ka paid total sirf 20 hai, to `b` hataya jaता hai. `a` (250) aur `c` (900) bachते hain.",
      },
      {
        title: 'An aggregate in WHERE is an error; it must go in HAVING',
        titleHi: 'WHERE mein ek aggregate ek error hai; ise HAVING mein jाना hoga',
        code: `CREATE TABLE ord (cust text, amt int);
INSERT INTO ord VALUES ('a', 100), ('a', 150), ('b', 20);

-- WRONG: WHERE runs before grouping, so sum(amt) has no meaning yet
SELECT cust, sum(amt) FROM ord GROUP BY cust WHERE sum(amt) > 100;`,
        output: `[ERROR] syntax error at or near "WHERE"`,
        explain: "`WHERE` is evaluated row by row, BEFORE grouping — at that point there is no group and `sum(amt)` is meaningless, so an aggregate in `WHERE` is rejected. (PostgreSQL's parser reports it as a syntax error because `WHERE` cannot even appear after `GROUP BY` positionally.) A condition on an aggregate MUST go in `HAVING`, which runs after the aggregates exist: `... GROUP BY cust HAVING sum(amt) > 100`.",
        explainHi: '`WHERE` row by row evaluate hoता hai, grouping se PEHLE — us point par koi group nahi aur `sum(amt)` meaningless hai, to `WHERE` mein ek aggregate reject hoता hai. (PostgreSQL ka parser ise syntax error batाता hai kyunki `WHERE` positionally `GROUP BY` ke baad aa hi nahi sakта.) Ek aggregate par condition `HAVING` mein JAANA hoga.',
      },
      {
        title: 'HAVING count(*) to keep only groups of a minimum size',
        titleHi: 'Sirf ek minimum size ke groups rakhne ke liye HAVING count(*)',
        code: `CREATE TABLE signup (plan text, user_id int);
INSERT INTO signup VALUES
  ('pro', 1), ('pro', 2), ('pro', 3),
  ('team', 4), ('team', 5),
  ('free', 6);

-- only report plans with at least 3 signups
SELECT plan, count(*) AS n
FROM signup
GROUP BY plan
HAVING count(*) >= 3
ORDER BY plan;`,
        output: ` plan | n
------+---
 pro  | 3
(1 row)`,
        explain: '`HAVING count(*) >= 3` keeps only the groups whose row count is at least 3. `pro` has 3 signups and survives; `team` has 2 and `free` has 1, so both are dropped. `HAVING` is the only place this condition can live — `count(*)` is a group-level value that does not exist until after `GROUP BY`. Note `count(*)` need not be in the `SELECT` for `HAVING` to use it.',
        explainHi: '`HAVING count(*) >= 3` sirf wo groups rakhता hai jinka row count kam se kam 3 hai. `pro` ke 3 signups hain aur bachта hai; `team` ke 2 aur `free` ka 1, to dono drop hote hain. `HAVING` ek matra jagah hai jahaan ye condition reh sakti hai. Note `count(*)` ko `HAVING` istemal karne ke liye `SELECT` mein hone ki zaroorat nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "customers whose name is not a test account, with their order totals"
SELECT cust, sum(amt) AS total
FROM ord
GROUP BY cust
HAVING cust NOT LIKE 'test%';
-- correct result, but the test rows were grouped and summed before being discarded`,
        right: `SELECT cust, sum(amt) AS total
FROM ord
WHERE cust NOT LIKE 'test%'
GROUP BY cust;`,
        why: 'The condition cust NOT LIKE test-percent is a per-row test: it looks at one column of one row and needs no aggregate. Such conditions belong in WHERE, which runs before grouping, so the test rows are eliminated up front and never take part in a group or an aggregation. Putting it in HAVING also produces the right answer, because cust is in the GROUP BY and therefore visible to HAVING, but every test row was first carried through the sort or hash for grouping and had its sum computed, only for the whole group to be dropped. On a large table that is a lot of wasted work. Reserve HAVING for conditions that genuinely need a group-level value.',
        whyHi: 'Condition cust NOT LIKE test-percent ek per-row test hai: ye ek row ke ek column ko dekhta hai aur koi aggregate nahi chahिए. Aisi conditions WHERE mein honi chahिए, jo grouping se pehle chalta hai, to test rows pehle hi eliminate ho jaati hain. Ise HAVING mein daalna bhi sahi answer deta hai, kyunki cust GROUP BY mein hai, par har test row pehle grouping ke liye sort ya hash se dhोया gaya aur iska sum compute hua. Ek badi table par ye bahut wasted work hai.',
      },
      {
        wrong: `SELECT cust, sum(amt) AS total
FROM ord
GROUP BY cust
HAVING total > 200;
-- ERROR in PostgreSQL: column "total" does not exist`,
        right: `SELECT cust, sum(amt) AS total
FROM ord
GROUP BY cust
HAVING sum(amt) > 200;
-- repeat the aggregate expression; the alias is not visible in HAVING`,
        why: 'SELECT aliases are assigned after HAVING runs in the logical order, so HAVING cannot see the name total. PostgreSQL grants an extension that lets GROUP BY use a SELECT alias, but it does NOT extend the same courtesy to HAVING, so HAVING total fails with "column total does not exist". You must repeat the full aggregate, HAVING sum of amt greater than 200. ORDER BY, which runs after SELECT, is the one clause that can use the alias, so ORDER BY total DESC is fine.',
        whyHi: 'SELECT aliases logical order mein HAVING chalne ke baad assign hote hain, to HAVING name total nahi dekh sakta. PostgreSQL ek extension deta hai jo GROUP BY ko ek SELECT alias istemal karne deta hai, par ye HAVING ko wahi courtesy NAHI deta, to HAVING total "column total does not exist" se fail hota hai. Aapko poora aggregate repeat karna hoga. ORDER BY, jo SELECT ke baad chalta hai, wo ek clause hai jo alias istemal kar sakti hai.',
      },
      {
        wrong: `-- "products that sold at least 100 units THIS YEAR"
SELECT product, sum(qty)
FROM sale
GROUP BY product
HAVING sum(qty) >= 100 AND sold_at >= date '2026-01-01';
-- ERROR: column "sale.sold_at" must appear in the GROUP BY clause`,
        right: `SELECT product, sum(qty)
FROM sale
WHERE sold_at >= date '2026-01-01'   -- the row-level date filter
GROUP BY product
HAVING sum(qty) >= 100;              -- the group-level total filter`,
        why: 'This mixes the two filter types into one clause. sold_at is a per-row column and it is neither in the GROUP BY nor wrapped in an aggregate, so referencing it in HAVING is the same error you would get in the SELECT list. The date restriction is a row filter and belongs in WHERE; the units-sold threshold is a group filter and belongs in HAVING. Splitting them also happens to be the efficient order: WHERE cuts the data to this year first, then only the surviving rows are grouped and summed and tested against the 100 threshold.',
        whyHi: 'Ye do filter types ko ek clause mein mix karta hai. sold_at ek per-row column hai aur ye na GROUP BY mein hai na ek aggregate mein wrapped, to ise HAVING mein reference karna wahi error hai jo aapko SELECT list mein milta. Date restriction ek row filter hai aur WHERE mein honi chahिए; units-sold threshold ek group filter hai aur HAVING mein. Inhe split karna efficient order bhi hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "power users" report: `WHERE event_type = \'action\'` then `GROUP BY user_id HAVING count(*) > 500`** — the row filter keeps only real actions, the group filter keeps only the heavy accounts.',
        hi: '**Ek "power users" report: `WHERE event_type = \'action\'` phir `GROUP BY user_id HAVING count(*) > 500`** — row filter sirf real actions rakhta hai, group filter sirf heavy accounts.',
      },
      {
        en: '**A data-quality alert that returns rows only when there is a problem: `GROUP BY batch_id HAVING count(*) FILTER (WHERE checksum_ok IS false) > 0`** — no rows means every batch is clean.',
        hi: '**Ek data-quality alert jo sirf tab rows lautata hai jab problem ho: `GROUP BY batch_id HAVING count(*) FILTER (WHERE checksum_ok IS false) > 0`**.',
      },
      {
        en: '**A code-review guideline: any non-aggregate predicate found in a `HAVING` gets moved to `WHERE`** unless it truly needs a grouped value — measured to cut a nightly rollup\'s runtime noticeably on the largest tables.',
        hi: '**Ek code-review guideline: `HAVING` mein mila koi bhi non-aggregate predicate `WHERE` mein move hota hai** jab tak use sach mein ek grouped value ki zaroorat na ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `WHERE` and `HAVING`?',
        qHi: '`WHERE` aur `HAVING` mein kya antar hai?',
        a: 'They filter at different stages. WHERE filters individual rows before any grouping happens. It runs early, right after FROM, so at that point there are no groups and no aggregate values, which is why you cannot put sum or count in a WHERE. HAVING filters whole groups after GROUP BY has partitioned the rows and the aggregates have been computed. That is the only place a condition on an aggregate is legal: HAVING sum of amount greater than 200 keeps only the groups whose total exceeds 200. Both clauses can appear in the same query and do different jobs: WHERE narrows the raw rows, for instance to this year or to paid orders only, and then HAVING narrows the grouped output, for instance to customers with more than five orders. A subtlety: a non-aggregate condition, like a filter on a column that is in the GROUP BY, is accepted in HAVING and gives the right answer, but it is wasteful because those rows were grouped and aggregated before being thrown away. Such conditions should go in WHERE so the rows are dropped before the expensive grouping step.',
        aHi: 'Wo alag stages par filter karte hain. WHERE individual rows ko kisi bhi grouping se pehle filter karta hai. Ye early chalta hai, FROM ke turant baad, to us point par koi groups aur koi aggregate values nahi, isiliye aap sum ya count ko WHERE mein nahi daal sakte. HAVING poore groups ko GROUP BY ne rows partition karne aur aggregates compute hone ke baad filter karta hai. Wo ek matra jagah hai jahaan ek aggregate par condition legal hai. Dono clauses ek hi query mein aa sakti hain: WHERE raw rows narrow karta hai, phir HAVING grouped output narrow karta hai. Ek subtlety: ek non-aggregate condition HAVING mein accepted hai aur sahi answer deti hai, par wasteful hai; aisi conditions WHERE mein jाni chahिए.',
      },
      {
        q: 'Can you use a `SELECT` alias in `WHERE`, `HAVING`, or `ORDER BY`? Why the difference?',
        qHi: 'Kya aap `WHERE`, `HAVING`, ya `ORDER BY` mein ek `SELECT` alias istemal kar sakte ho? Antar kyun?',
        a: 'It comes down to when aliases are assigned in the logical processing order. The order is FROM, WHERE, GROUP BY, aggregates, HAVING, then SELECT which is where the alias names get bound, then ORDER BY, then LIMIT. So WHERE and HAVING both run before the SELECT list is projected, and neither can see a SELECT alias in standard SQL; you repeat the underlying expression instead. ORDER BY runs after SELECT, so it can and commonly does use the alias, for example ORDER BY total DESC where total was defined as sum of amount. There are vendor extensions: PostgreSQL lets GROUP BY reference a SELECT alias, and MySQL is even more permissive and allows it in HAVING too. But relying on those makes the query non-portable and can confuse a reader who expects the standard order, so the safe habit is to repeat the expression everywhere except ORDER BY.',
        aHi: 'Ye is par nirbhar karta hai ki aliases logical processing order mein kab assign hote hain. Order hai FROM, WHERE, GROUP BY, aggregates, HAVING, phir SELECT jahaan alias names bind hote hain, phir ORDER BY, phir LIMIT. To WHERE aur HAVING dono SELECT list project hone se pehle chalte hain, aur na koi standard SQL mein ek SELECT alias dekh sakta hai; aap underlying expression repeat karte ho. ORDER BY SELECT ke baad chalta hai, to ye alias istemal kar sakta hai. Vendor extensions hain: PostgreSQL GROUP BY ko ek SELECT alias reference karne deta hai. Par un par bharosa karna query ko non-portable banata hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `txn(account text, kind text, amount int)` with several rows per account, some `kind = \'fee\'`. Write a query that, considering only `kind = \'purchase\'` rows, returns each account and its purchase total, keeping only accounts whose purchase total is at least `500`. Use `WHERE` for the kind filter and `HAVING` for the total.',
        taskHi: 'Table `txn(account, kind, amount)` prati account kई rows ke saath, kuch `kind = \'fee\'`. Ek query jo sirf `kind = \'purchase\'` rows considering, har account aur iska purchase total lautati hai, sirf `>= 500` total waale accounts rakhkar.',
        hint: '`WHERE kind = \'purchase\'` (row filter, before grouping) then `GROUP BY account HAVING sum(amount) >= 500` (group filter, after). Don\'t put `kind` in `HAVING`.',
        hintHi: '`WHERE kind = \'purchase\'` phir `GROUP BY account HAVING sum(amount) >= 500`. `kind` ko `HAVING` mein mat daalo.',
      },
      {
        task: 'Take a working grouped query with `HAVING sum(amt) > 200 AND cust <> \'demo\'`. It errors (`cust` not grouped/aggregated — actually `cust` IS in GROUP BY so it may run; test it). Rewrite it the clean way: `cust <> \'demo\'` in `WHERE`, `sum(amt) > 200` in `HAVING`. Confirm identical results and note which version scans/aggregates fewer rows.',
        taskHi: 'Ek working grouped query lo `HAVING sum(amt) > 200 AND cust <> \'demo\'` ke saath. Ise saaf tareeke se rewrite karo: `cust <> \'demo\'` `WHERE` mein, `sum(amt) > 200` `HAVING` mein.',
        hint: 'If `cust` is in the `GROUP BY` the original runs, but the `demo` rows are grouped and summed before being dropped. The `WHERE` version removes them before grouping — fewer rows aggregated.',
        hintHi: 'Agar `cust` `GROUP BY` mein hai to original chalti hai, par `demo` rows drop hone se pehle grouped aur summed hoti hain. `WHERE` version unhe grouping se pehle hata deta hai.',
      },
      {
        task: 'Table `review(product text, stars int)`. Write a query returning products with an average rating below `3.0` AND at least `5` reviews (so a single 1-star review does not flag a product). Both conditions are aggregates, so both go in `HAVING`: `HAVING avg(stars) < 3.0 AND count(*) >= 5`.',
        taskHi: 'Table `review(product, stars)`. Ek query jo `3.0` se kam average rating AUR kam se kam `5` reviews waale products lautati hai. Dono conditions aggregates hain, to dono `HAVING` mein: `HAVING avg(stars) < 3.0 AND count(*) >= 5`.',
        hint: 'Both `avg(stars)` and `count(*)` are group-level, so neither can go in `WHERE`. Combine them with `AND` in a single `HAVING`. The `count(*) >= 5` guard stops tiny samples from triggering.',
        hintHi: 'Dono `avg(stars)` aur `count(*)` group-level hain, to koi `WHERE` mein nahi ja sakta. Unhe ek `HAVING` mein `AND` se combine karo.',
      },
    ],

    keyTakeaways: [
      '`WHERE` filters individual ROWS **before** `GROUP BY`. `HAVING` filters whole GROUPS **after** aggregation. Processing order: `FROM` -> `WHERE` -> `GROUP BY` -> (aggregates) -> `HAVING` -> `SELECT` -> `ORDER BY` -> `LIMIT`.',
      '`WHERE` CANNOT reference an aggregate (`sum`/`count`/`avg` haven\'t been computed yet) -> `ERROR: aggregate functions are not allowed in WHERE`. A condition on an aggregate MUST go in `HAVING`.',
      '`HAVING` can use an aggregate that is NOT in the `SELECT` (`HAVING count(*) >= 5` even if `count(*)` is not selected).',
      'A NON-aggregate condition (e.g. on a grouped column) WORKS in `HAVING` but is WASTEFUL — those rows are grouped + aggregated, then the whole group is discarded. Move it to `WHERE` so the rows drop BEFORE the expensive grouping. Guideline: `WHERE` unless the condition NEEDS an aggregate.',
      '`WHERE` and `HAVING` commonly appear TOGETHER: `WHERE sold_at >= ...` (row filter) + `GROUP BY product` + `HAVING sum(qty) >= 100` (group filter). Do NOT put a row column in `HAVING` (`HAVING ... AND sold_at >= ...` -> the "must appear in GROUP BY" error).',
      'ALIASES: `WHERE` and `HAVING` CANNOT use a `SELECT` alias (repeat the expression / aggregate) — PostgreSQL grants the alias extension to `GROUP BY` but NOT to `HAVING`. `ORDER BY` CAN use the alias (it runs last).',
      '`HAVING` without `GROUP BY` is legal — the whole table is one implicit group: `SELECT sum(amt) FROM ord HAVING sum(amt) > 1000` returns the grand total only if it clears 1000. Different row-filters per aggregate = `FILTER (WHERE ...)`, not `HAVING` (Lesson 4).',
    ],
    keyTakeawaysHi: [
      '`WHERE` individual ROWS ko `GROUP BY` se **pehle** filter karta hai. `HAVING` poore GROUPS ko aggregation ke **baad**. Order: `FROM` -> `WHERE` -> `GROUP BY` -> (aggregates) -> `HAVING` -> `SELECT` -> `ORDER BY` -> `LIMIT`.',
      '`WHERE` ek aggregate reference NAHI kar sakta -> `ERROR: aggregate functions are not allowed in WHERE`. Ek aggregate par condition `HAVING` mein JAANA hoga.',
      '`HAVING` ek aggregate istemal kar sakta hai jo `SELECT` mein NAHI hai (`HAVING count(*) >= 5`).',
      'Ek NON-aggregate condition `HAVING` mein CHALTI hai par WASTEFUL hai — wo rows grouped + aggregated hoti hain, phir poora group discard. Use `WHERE` mein le jao. Guideline: `WHERE` jab tak condition ko ek aggregate ki ZAROORAT na ho.',
      '`WHERE` aur `HAVING` aksar SAATH aate hain: `WHERE sold_at >= ...` + `GROUP BY product` + `HAVING sum(qty) >= 100`. Ek row column `HAVING` mein MAT daalo -> "must appear in GROUP BY" error.',
      'ALIASES: `WHERE` aur `HAVING` ek `SELECT` alias NAHI istemal kar sakte — PostgreSQL alias extension `GROUP BY` ko deta hai par `HAVING` ko NAHI. `ORDER BY` alias istemal KAR sakta hai.',
      '`HAVING` bina `GROUP BY` ke legal hai — poori table ek implicit group: `SELECT sum(amt) FROM ord HAVING sum(amt) > 1000`. Prati aggregate alag row-filters = `FILTER (WHERE ...)`, `HAVING` nahi (Lesson 4).',
    ],
  },
];
