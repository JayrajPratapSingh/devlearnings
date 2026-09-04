/**
 * Databases Complete Course — Module 1: The Relational Model & SELECT Basics, lessons 4-6.
 *
 * Lesson 4: NULL & three-valued logic — TRUE / FALSE / UNKNOWN, IS NULL vs = NULL,
 *           NULL in arithmetic and string ops, NULL in aggregates (count(*) vs count(col),
 *           sum/avg ignore NULL), NULL in GROUP BY / DISTINCT (one NULL group),
 *           ORDER BY ... NULLS FIRST/LAST, IS DISTINCT FROM, COALESCE / NULLIF,
 *           the NOT IN (…, NULL) trap.
 * Lesson 5: ORDER BY & LIMIT — sort keys (column / expression / position / alias),
 *           ASC/DESC, NULLS FIRST/LAST and the default, multiple keys & tie-breaking,
 *           LIMIT / OFFSET / FETCH FIRST, "LIMIT without ORDER BY is nondeterministic",
 *           OFFSET pagination and its cost (preview of keyset).
 * Lesson 6: Logical query processing order — FROM -> WHERE -> GROUP BY -> HAVING ->
 *           SELECT -> DISTINCT -> ORDER BY -> LIMIT; why a SELECT alias is invisible to
 *           WHERE/GROUP BY/HAVING but visible to ORDER BY; WHERE (rows) vs HAVING (groups);
 *           SELECT DISTINCT + ORDER BY expr must be in the select list.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 1
 * `output` is the psql-style table the harness renders. Conventions: see course-sql-module1.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'sql-null-and-three-valued-logic',
    title: '`NULL` & Three-Valued Logic: `TRUE` / `FALSE` / `UNKNOWN`',
    titleHi: '`NULL` Aur Three-Valued Logic: `TRUE` / `FALSE` / `UNKNOWN`',
    description: '`NULL` means "no value here" — not zero, not empty. Any comparison *with* `NULL` produces `UNKNOWN`, a third truth value, so `x = NULL` is never `true`, `WHERE` drops `UNKNOWN` rows, `count(col)` skips them, and `NOT IN` with a `NULL` in the list silently returns nothing. This is the single biggest source of surprising SQL results.',
    descriptionHi: '`NULL` ka matlab "yahaan koi value nahi" — zero nahi, empty nahi. `NULL` ke *saath* koi bhi comparison `UNKNOWN` produce karta hai, ek teesra truth value, to `x = NULL` kabhi `true` nahi hota, `WHERE` `UNKNOWN` rows drop karta hai, `count(col)` unhe skip karta hai, aur list mein ek `NULL` waala `NOT IN` chupchaap kuch nahi lautata. Ye surprising SQL results ka sabse bada source hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A form where a blank box means "not filled in", and a rule that you can never answer a question *about* a blank box with a plain yes or no.** Someone asks "is the author box equal to \'Anonymous\'?" — but the box is blank. You genuinely cannot say yes, and you cannot say no; the honest answer is "unknown". SQL formalises exactly that: alongside `TRUE` and `FALSE` there is a third value, `UNKNOWN`, and any comparison touching a `NULL` yields it. The consequences all follow from one rule — **`WHERE` keeps a row only on `TRUE`**, so `UNKNOWN` rows are dropped just like `FALSE` ones. "Is `price` less than 100?" for a row whose price is blank is `UNKNOWN`, so that row silently vanishes from `WHERE price < 100` *and* from `WHERE price >= 100` — it is in neither result. To ask about the blank itself you need a different kind of question, `IS NULL`, which is the only operator that inspects the box rather than comparing its contents.',
      hi: '**Ek form jahaan ek blank box ka matlab "bhara nahi gaya", aur ek niyam ki aap kabhi ek blank box ke *baare mein* ek sawaal ka jawab plain haan ya na se nahi de sakte.** Koi poochta hai "kya author box \'Anonymous\' ke barabar hai?" — par box blank hai. Aap sach mein haan nahi keh sakte, aur na nahi keh sakte; imandaar jawab "unknown" hai. SQL theek wahi formalise karta hai: `TRUE` aur `FALSE` ke saath ek teesra value hai, `UNKNOWN`, aur `NULL` ko chhune waala koi bhi comparison ise deta hai. Sabhi consequences ek niyam se aate hain — **`WHERE` ek row ko sirf `TRUE` par rakhta hai**, to `UNKNOWN` rows `FALSE` waali ki tarah drop ho jaati hain. Ek row jiski price blank hai uske liye "kya `price` 100 se kam hai?" `UNKNOWN` hai, to wo row chupchaap `WHERE price < 100` se *aur* `WHERE price >= 100` se gायab ho jaati hai — wo kisi mein bhi nahi hai. Blank ke baare mein poochne ke liye aapko ek alag tarah ka sawaal chahiye, `IS NULL`.',
    },

    simple: `**Three truth values, not two**

\`\`\`sql
SELECT
  1 = 1        AS a,   -- t
  1 = 2        AS b,   -- f
  1 = NULL     AS c,   -- NULL  (unknown — you cannot compare a value to "no value")
  NULL = NULL  AS d,   -- NULL  (two unknowns are not "equal")
  NULL IS NULL AS e;   -- t     (IS NULL inspects the box, it does not compare)
\`\`\`

**\`AND\` / \`OR\` / \`NOT\` with \`UNKNOWN\`**

\`\`\`
true  AND NULL = NULL      false AND NULL = false     (false short-circuits)
true  OR  NULL = true      false OR  NULL = NULL      (true short-circuits)
NOT NULL       = NULL
\`\`\`

**\`WHERE\` keeps a row only when the condition is exactly \`TRUE\`**

\`\`\`sql
-- a row whose price is NULL is in NEITHER of these:
SELECT * FROM item WHERE price < 100;    -- NULL < 100 -> UNKNOWN -> dropped
SELECT * FROM item WHERE price >= 100;   -- NULL >= 100 -> UNKNOWN -> dropped
SELECT * FROM item WHERE price IS NULL;  -- the only way to get it
\`\`\`

**Testing for \`NULL\` — \`IS NULL\`, never \`= NULL\`**

\`\`\`sql
WHERE author IS NULL          -- correct
WHERE author IS NOT NULL      -- correct
WHERE author = NULL           -- always UNKNOWN -> row always dropped -> a silent bug
\`\`\`

**\`NULL\` propagates through arithmetic and \`||\`**

\`\`\`sql
100 + NULL          -- NULL       (not 100)
total - discount    -- NULL if discount is NULL  -> wrap: total - COALESCE(discount, 0)
'Mr ' || middle_name || ' Smith'   -- NULL if middle_name is NULL  -> use concat() or COALESCE
\`\`\`

**Aggregates ignore \`NULL\` — except \`count(*)\`**

\`\`\`sql
count(*)        -- counts ROWS, including all-NULL ones
count(score)    -- counts rows where score IS NOT NULL
sum(score)      -- adds the non-NULL values; sum of an all-NULL/empty set is NULL (not 0)
avg(score)      -- non-NULL total / non-NULL count -> NULLs do not drag the average down
\`\`\`

**\`GROUP BY\` and \`DISTINCT\` treat all \`NULL\`s as one group**

\`\`\`sql
SELECT category, count(*) FROM product GROUP BY category;
-- rows with category IS NULL form a single group with key NULL
SELECT DISTINCT category FROM product;   -- NULL appears once
\`\`\`

**\`ORDER BY\` — where do \`NULL\`s sort?**

\`\`\`sql
ORDER BY salary            -- ASC:  NULLs LAST  (Postgres default)
ORDER BY salary DESC       -- DESC: NULLs FIRST (Postgres default — NULL sorts as "largest")
ORDER BY salary DESC NULLS LAST   -- force it
\`\`\`

**\`COALESCE\` / \`NULLIF\` / \`IS DISTINCT FROM\`**

\`\`\`sql
COALESCE(a, b, c, 0)   -- first non-NULL argument, else the last
NULLIF(x, 0)           -- NULL if x = 0, else x   (turn a sentinel into a real NULL)
a IS NOT DISTINCT FROM b   -- like =, but NULL IS NOT DISTINCT FROM NULL is TRUE
\`\`\`

**The \`NOT IN\` + \`NULL\` trap**

\`\`\`sql
WHERE status NOT IN ('archived', 'hidden', NULL)   -- returns ZERO rows, always
-- expands to: status <> 'archived' AND status <> 'hidden' AND status <> NULL
--             the last term is UNKNOWN for every row -> the AND is never TRUE
-- fix: keep NULL out of the list, or use NOT EXISTS (Module 5)
\`\`\``,

    simpleHi: `**Teen truth values, do nahi**

\`\`\`sql
SELECT
  1 = 1        AS a,   -- t
  1 = 2        AS b,   -- f
  1 = NULL     AS c,   -- NULL  (unknown — ek value ko "no value" se compare nahi kar sakte)
  NULL = NULL  AS d,   -- NULL  (do unknowns "equal" nahi hain)
  NULL IS NULL AS e;   -- t     (IS NULL box inspect karta hai, compare nahi)
\`\`\`

**\`AND\` / \`OR\` / \`NOT\` \`UNKNOWN\` ke saath**

\`\`\`
true  AND NULL = NULL      false AND NULL = false
true  OR  NULL = true      false OR  NULL = NULL
NOT NULL       = NULL
\`\`\`

**\`WHERE\` ek row ko sirf tab rakhta hai jab condition theek \`TRUE\` ho**

\`\`\`sql
-- ek row jiski price NULL hai in DONO mein se KISI mein nahi:
SELECT * FROM item WHERE price < 100;    -- NULL < 100 -> UNKNOWN -> dropped
SELECT * FROM item WHERE price >= 100;   -- NULL >= 100 -> UNKNOWN -> dropped
SELECT * FROM item WHERE price IS NULL;  -- ise paane ka ekmatra tareeka
\`\`\`

**\`NULL\` ke liye test — \`IS NULL\`, kabhi \`= NULL\` nahi**

\`\`\`sql
WHERE author IS NULL          -- sahi
WHERE author IS NOT NULL      -- sahi
WHERE author = NULL           -- hamesha UNKNOWN -> row hamesha dropped -> ek silent bug
\`\`\`

**\`NULL\` arithmetic aur \`||\` ke through propagate hota hai**

\`\`\`sql
100 + NULL          -- NULL       (100 nahi)
total - discount    -- NULL agar discount NULL hai  -> wrap: total - COALESCE(discount, 0)
'Mr ' || middle_name || ' Smith'   -- NULL agar middle_name NULL hai
\`\`\`

**Aggregates \`NULL\` ignore karte hain — \`count(*)\` ke alawa**

\`\`\`sql
count(*)        -- ROWS count karta hai, sabhi all-NULL waali samet
count(score)    -- un rows ko count karta hai jahaan score IS NOT NULL
sum(score)      -- non-NULL values jodta hai; all-NULL/empty set ka sum NULL hai (0 nahi)
avg(score)      -- non-NULL total / non-NULL count -> NULLs average ko neeche nahi kheenchte
\`\`\`

**\`GROUP BY\` aur \`DISTINCT\` sabhi \`NULL\`s ko ek group maante hain**

\`\`\`sql
SELECT category, count(*) FROM product GROUP BY category;
-- category IS NULL waali rows key NULL ke saath ek single group banati hain
SELECT DISTINCT category FROM product;   -- NULL ek baar dikhta hai
\`\`\`

**\`ORDER BY\` — \`NULL\`s kahaan sort hote hain?**

\`\`\`sql
ORDER BY salary            -- ASC:  NULLs LAST  (Postgres default)
ORDER BY salary DESC       -- DESC: NULLs FIRST (Postgres default — NULL "largest" sort hota hai)
ORDER BY salary DESC NULLS LAST   -- force karo
\`\`\`

**\`COALESCE\` / \`NULLIF\` / \`IS DISTINCT FROM\`**

\`\`\`sql
COALESCE(a, b, c, 0)   -- pehla non-NULL argument, warna aakhri
NULLIF(x, 0)           -- NULL agar x = 0, warna x
a IS NOT DISTINCT FROM b   -- = jaisa, par NULL IS NOT DISTINCT FROM NULL TRUE hai
\`\`\`

**\`NOT IN\` + \`NULL\` trap**

\`\`\`sql
WHERE status NOT IN ('archived', 'hidden', NULL)   -- hamesha ZERO rows lautata hai
-- fix: NULL ko list se bahar rakho, ya NOT EXISTS istemal karo (Module 5)
\`\`\``,

    content: `## \`NULL\` is a marker, not a value

\`NULL\` is SQL's way of recording that a column has **no value** in this row — the information is missing, not applicable, or not yet known. It is not zero, not an empty string, not \`false\`. Because it is "no value", you cannot do arithmetic with it, compare it, or concatenate it in the normal way — every such operation returns \`NULL\` again, meaning "the result is also unknown".

## Three-valued logic

SQL predicates can be \`TRUE\`, \`FALSE\`, or **\`UNKNOWN\`** (often shown as \`NULL\` in a boolean context). Any comparison operator (\`=\`, \`<>\`, \`<\`, \`>\`, \`LIKE\`, …) applied to a \`NULL\` on either side yields \`UNKNOWN\`. Even \`NULL = NULL\` is \`UNKNOWN\` — two missing values are not "equal", because you do not know what either of them is.

The truth tables for the connectives:

| \`AND\` | T | F | U |   | \`OR\` | T | F | U |
|---|---|---|---|---|---|---|---|---|
| **T** | T | F | U |   | **T** | T | T | T |
| **F** | F | F | F |   | **F** | T | F | U |
| **U** | U | F | U |   | **U** | T | U | U |

\`NOT UNKNOWN\` is \`UNKNOWN\`. The pattern: \`AND\` can still be \`FALSE\` if one side is \`FALSE\` (short-circuit), \`OR\` can still be \`TRUE\` if one side is \`TRUE\`, but otherwise a \`NULL\` operand poisons the result to \`UNKNOWN\`.

## The one rule everything follows from: \`WHERE\` keeps only \`TRUE\`

\`WHERE\`, \`ON\` (join conditions), \`HAVING\`, and \`CHECK\` constraints all keep a row (or accept a value) **only when the condition is \`TRUE\`**. A condition that is \`FALSE\` *or* \`UNKNOWN\` fails. So:

\`\`\`sql
-- rows with a NULL price satisfy NEITHER:
WHERE price > 50       -- UNKNOWN -> dropped
WHERE price <= 50      -- UNKNOWN -> dropped
WHERE NOT (price > 50) -- NOT UNKNOWN = UNKNOWN -> still dropped
\`\`\`

A common bug is assuming \`WHERE NOT (condition)\` is the exact complement of \`WHERE condition\`. It is not, when \`NULL\`s are involved: rows where \`condition\` is \`UNKNOWN\` are missing from *both*.

## Testing for \`NULL\`

The **only** correct tests are \`IS NULL\` and \`IS NOT NULL\`. They inspect whether the value is present; they always return \`TRUE\` or \`FALSE\`, never \`UNKNOWN\`. \`x = NULL\` and \`x <> NULL\` are always \`UNKNOWN\` and are almost always a mistake — some databases in non-standard modes rewrite \`= NULL\` to \`IS NULL\`, but do not rely on that.

**\`IS DISTINCT FROM\`** and **\`IS NOT DISTINCT FROM\`** are the "\`NULL\`-aware" versions of \`<>\` and \`=\`: they treat \`NULL\` as a normal comparable value, so \`NULL IS NOT DISTINCT FROM NULL\` is \`TRUE\` and \`1 IS DISTINCT FROM NULL\` is \`TRUE\`. Useful when you want two \`NULL\`s to count as "the same".

## \`NULL\` in aggregates

- **\`count(*)\`** counts rows — every row, regardless of \`NULL\`s.
- **\`count(expr)\`** counts rows where \`expr\` is **not** \`NULL\`. \`count(DISTINCT expr)\` likewise.
- **\`sum\`, \`avg\`, \`min\`, \`max\`** ignore \`NULL\` inputs. \`avg\` divides the non-\`NULL\` sum by the non-\`NULL\` count, so \`NULL\`s do **not** pull the average toward zero — if that is what you want, use \`sum(expr) / count(*)\` or \`avg(coalesce(expr, 0))\`.
- \`sum\` / \`avg\` / \`max\` / \`min\` of an **empty group or an all-\`NULL\` column is \`NULL\`, not \`0\`**. Wrap in \`COALESCE(sum(x), 0)\` when you need a numeric zero.

## \`NULL\` in \`GROUP BY\`, \`DISTINCT\`, \`UNION\`

For grouping and de-duplication, SQL treats all \`NULL\`s as **equal to each other** (the opposite of the comparison rule). So \`GROUP BY category\` puts every \`NULL\`-category row into one group keyed \`NULL\`; \`SELECT DISTINCT category\` returns \`NULL\` at most once; \`UNION\` (which de-duplicates) collapses duplicate \`NULL\` rows. This inconsistency — \`NULL\` is "not equal to anything" for \`WHERE\` but "equal to other \`NULL\`s" for \`GROUP BY\` — is deliberate and worth memorising.

## \`NULL\` in \`ORDER BY\`

\`NULL\`s must sort somewhere. The SQL standard leaves it implementation-defined; **PostgreSQL** sorts \`NULL\`s as if they were **larger than any non-\`NULL\` value**, so:

- \`ORDER BY col ASC\` → \`NULL\`s **last**
- \`ORDER BY col DESC\` → \`NULL\`s **first**

Override with \`ORDER BY col ASC NULLS FIRST\` / \`DESC NULLS LAST\`. Other databases differ (MySQL sorts \`NULL\`s first in ascending order), so if portability or a specific placement matters, always write \`NULLS FIRST\`/\`NULLS LAST\` explicitly.

## Handling \`NULL\`: \`COALESCE\` and \`NULLIF\`

- **\`COALESCE(a, b, c, …)\`** returns the first argument that is not \`NULL\`, evaluating left to right. The everyday use is a default: \`COALESCE(nickname, first_name, 'friend')\`, \`price - COALESCE(discount, 0)\`, \`COALESCE(sum(amount), 0)\`.
- **\`NULLIF(a, b)\`** returns \`NULL\` if \`a = b\`, otherwise \`a\`. The use is turning a sentinel value back into a real \`NULL\` (\`NULLIF(rating, 0)\`, \`NULLIF(trim(note), '')\`) or guarding a division (\`x / NULLIF(y, 0)\` yields \`NULL\` instead of a divide-by-zero error).

## Should a column allow \`NULL\`?

Default to **\`NOT NULL\`** and add a sensible default; only allow \`NULL\` when "unknown / not applicable" is a genuine, distinct state you need to represent (an optional \`middle_name\`, a \`shipped_at\` that is \`NULL\` until shipment). Every nullable column is a branch you must handle in every query, aggregate, and join. Do not use \`NULL\` as a lazy stand-in for \`0\`, \`''\`, \`false\`, or "default" — those are values, and storing them as values keeps your logic simple.`,

    contentHi: `## \`NULL\` ek marker hai, ek value nahi

\`NULL\` SQL ka tareeka hai record karne ka ki ek column mein is row mein **koi value nahi** — information missing hai, applicable nahi hai, ya abhi tak pata nahi. Ye zero nahi, empty string nahi, \`false\` nahi. Kyunki ye "no value" hai, aap iske saath arithmetic, compare, ya concatenate normal tareeke se nahi kar sakte — har aisa operation phir se \`NULL\` lautata hai.

## Three-valued logic

SQL predicates \`TRUE\`, \`FALSE\`, ya **\`UNKNOWN\`** ho sakte hain. Kisi bhi side par \`NULL\` par lagaya koi bhi comparison operator \`UNKNOWN\` deta hai. \`NULL = NULL\` bhi \`UNKNOWN\` hai — do missing values "equal" nahi hain.

Pattern: \`AND\` abhi bhi \`FALSE\` ho sakta hai agar ek side \`FALSE\` hai, \`OR\` abhi bhi \`TRUE\` ho sakta hai agar ek side \`TRUE\` hai, par warna ek \`NULL\` operand result ko \`UNKNOWN\` mein poison karta hai. \`NOT UNKNOWN\` \`UNKNOWN\` hai.

## Ek niyam jisse sab kuch aata hai: \`WHERE\` sirf \`TRUE\` rakhta hai

\`WHERE\`, \`ON\`, \`HAVING\`, aur \`CHECK\` sab ek row rakhte hain **sirf jab condition \`TRUE\` ho**. Ek condition jo \`FALSE\` *ya* \`UNKNOWN\` hai fail hoti hai.

\`\`\`sql
-- NULL price waali rows KISI ko satisfy nahi karti:
WHERE price > 50       -- UNKNOWN -> dropped
WHERE price <= 50      -- UNKNOWN -> dropped
\`\`\`

Ek aam bug ye maanna hai ki \`WHERE NOT (condition)\` \`WHERE condition\` ka exact complement hai. Jab \`NULL\`s shamil hain to ye nahi hai: rows jahaan \`condition\` \`UNKNOWN\` hai *dono* se missing hain.

## \`NULL\` ke liye test

**Ekmatra** sahi tests \`IS NULL\` aur \`IS NOT NULL\` hain. Wo hamesha \`TRUE\` ya \`FALSE\` lautate hain, kabhi \`UNKNOWN\` nahi. \`x = NULL\` hamesha \`UNKNOWN\` hai.

**\`IS DISTINCT FROM\`** aur **\`IS NOT DISTINCT FROM\`** \`<>\` aur \`=\` ke "\`NULL\`-aware" versions hain: wo \`NULL\` ko ek normal comparable value maante hain.

## Aggregates mein \`NULL\`

- **\`count(*)\`** rows count karta hai — har row.
- **\`count(expr)\`** un rows ko count karta hai jahaan \`expr\` **not** \`NULL\` hai.
- **\`sum\`, \`avg\`, \`min\`, \`max\`** \`NULL\` inputs ignore karte hain. \`avg\` non-\`NULL\` sum ko non-\`NULL\` count se divide karta hai.
- Ek **empty group ya all-\`NULL\` column ka \`sum\`/\`avg\`/\`max\`/\`min\` \`NULL\` hai, \`0\` nahi**. \`COALESCE(sum(x), 0)\` mein wrap karo.

## \`GROUP BY\`, \`DISTINCT\` mein \`NULL\`

Grouping aur de-duplication ke liye, SQL sabhi \`NULL\`s ko **ek doosre ke barabar** maanta hai (comparison rule ke ulta). To \`GROUP BY category\` har \`NULL\`-category row ko ek group mein daalta hai key \`NULL\` ke saath. Ye inconsistency jaan-boojhkar hai.

## \`ORDER BY\` mein \`NULL\`

**PostgreSQL** \`NULL\`s ko kisi bhi non-\`NULL\` value se **bada** sort karta hai:
- \`ORDER BY col ASC\` -> \`NULL\`s **last**
- \`ORDER BY col DESC\` -> \`NULL\`s **first**

\`ORDER BY col ASC NULLS FIRST\` se override karo. Doosre databases alag hain, to portability ya specific placement maayne rakhta hai to hamesha \`NULLS FIRST\`/\`NULLS LAST\` explicitly likho.

## \`NULL\` handle karna: \`COALESCE\` aur \`NULLIF\`

- **\`COALESCE(a, b, c, …)\`** pehla argument lautata hai jo \`NULL\` nahi hai. Rozana use ek default hai: \`price - COALESCE(discount, 0)\`, \`COALESCE(sum(amount), 0)\`.
- **\`NULLIF(a, b)\`** \`NULL\` lautata hai agar \`a = b\`, warna \`a\`. Use ek sentinel ko real \`NULL\` banana (\`NULLIF(rating, 0)\`) ya ek division guard karna (\`x / NULLIF(y, 0)\`).

## Kya ek column ko \`NULL\` allow karna chahiye?

Default **\`NOT NULL\`** + ek sensible default; \`NULL\` sirf tab allow karo jab "unknown / not applicable" ek genuine, distinct state hai. Har nullable column ek branch hai jise aapko har query mein handle karna hoga. \`NULL\` ko \`0\`, \`''\`, \`false\`, ya "default" ke lazy stand-in ke roop mein istemal mat karo.`,

    examples: [
      {
        title: 'Three-valued logic: any comparison with NULL is UNKNOWN',
        titleHi: 'Three-valued logic: NULL ke saath koi bhi comparison UNKNOWN hai',
        code: `SELECT
  (1 = 1)          AS t_eq,
  (1 = 2)          AS f_eq,
  (1 = NULL)       AS null_eq,
  (NULL = NULL)    AS null_null,
  (NULL IS NULL)   AS is_null,
  (true AND NULL)  AS t_and_null,
  (false AND NULL) AS f_and_null,
  (true OR NULL)   AS t_or_null,
  (NOT NULL)       AS not_null;`,
        output: ` t_eq | f_eq | null_eq | null_null | is_null | t_and_null | f_and_null | t_or_null | not_null
------+------+---------+-----------+---------+------------+------------+-----------+----------
 t    | f    | NULL    | NULL      | t       | NULL       | f          | t         | NULL
(1 row)`,
        explain: 'Only `1 = 1` and `1 = 2` give a definite `t`/`f`. Every expression touching a `NULL` yields `NULL` (UNKNOWN): `1 = NULL`, `NULL = NULL`, `true AND NULL`, `NOT NULL`. The exceptions follow the short-circuit rule: `false AND NULL` is `f` (AND is false if either side is), `true OR NULL` is `t` (OR is true if either side is). `NULL IS NULL` is the one test that returns `t`.',
        explainHi: 'Sirf `1 = 1` aur `1 = 2` ek definite `t`/`f` dete hain. `NULL` ko chhune waala har expression `NULL` (UNKNOWN) deta hai. Apvaad short-circuit rule follow karte hain: `false AND NULL` `f` hai, `true OR NULL` `t` hai. `NULL IS NULL` wo ek test hai jo `t` lautata hai.',
      },
      {
        title: 'count(*) vs count(col); sum and avg ignore NULL',
        titleHi: 'count(*) vs count(col); sum aur avg NULL ignore karte hain',
        code: `CREATE TABLE result (id int, score int);
INSERT INTO result VALUES (1, 10), (2, NULL), (3, 30), (4, NULL);

SELECT
  count(*)              AS cnt_star,     -- 4 rows
  count(score)          AS cnt_score,    -- 2 non-NULL scores
  sum(score)            AS sum_score,    -- 10 + 30
  round(avg(score), 2)  AS avg_score     -- 40 / 2, not 40 / 4
FROM result;`,
        output: ` cnt_star | cnt_score | sum_score | avg_score
----------+-----------+-----------+-----------
 4        | 2         | 40        | 20.00
(1 row)`,
        explain: '`count(*)` counts all 4 rows. `count(score)` counts only the 2 rows where `score IS NOT NULL`. `sum(score)` adds just the non-NULL values (10 + 30 = 40). `avg(score)` is 40 / 2 = 20.00, NOT 40 / 4 — the two NULL rows are ignored entirely, they do not drag the average toward zero.',
        explainHi: '`count(*)` sabhi 4 rows count karta hai. `count(score)` sirf 2 rows count karta hai jahaan `score IS NOT NULL`. `sum(score)` sirf non-NULL values jodta hai (10 + 30 = 40). `avg(score)` 40 / 2 = 20.00 hai, 40 / 4 NAHI — do NULL rows poori tarah ignore hoti hain.',
      },
      {
        title: 'NULL arithmetic, COALESCE for a default, NULLIF for a sentinel',
        titleHi: 'NULL arithmetic, default ke liye COALESCE, sentinel ke liye NULLIF',
        code: `CREATE TABLE line (item text, price numeric, discount numeric);
INSERT INTO line VALUES ('a', 100, 10), ('b', 50, NULL), ('c', NULL, 5);

SELECT
  item,
  price - discount                AS naive_net,   -- NULL wherever a NULL is involved
  price - COALESCE(discount, 0)    AS safe_net,    -- treat missing discount as 0
  COALESCE(price, 0)              AS price_or_0,
  NULLIF(discount, 0)             AS discount_or_null
FROM line
ORDER BY item;`,
        output: ` item | naive_net | safe_net | price_or_0 | discount_or_null
------+-----------+----------+------------+------------------
 a    | 90        | 90       | 100        | 10
 b    | NULL      | 50       | 50         | NULL
 c    | NULL      | NULL     | 0          | 5
(3 rows)`,
        explain: '`price - discount` is `NULL` for rows b and c because arithmetic with a `NULL` yields `NULL`. `price - COALESCE(discount, 0)` substitutes `0` for a missing discount, so row b becomes `50` — but row c is still `NULL` because `price` itself is missing. `COALESCE(price, 0)` fixes that. `NULLIF(discount, 0)` would turn a `0` discount into `NULL`; here no discount is `0` so the values pass through.',
        explainHi: '`price - discount` rows b aur c ke liye `NULL` hai kyunki `NULL` ke saath arithmetic `NULL` deta hai. `price - COALESCE(discount, 0)` ek missing discount ke liye `0` substitute karta hai, to row b `50` ban jaati hai — par row c abhi bhi `NULL` hai kyunki `price` khud missing hai. `COALESCE(price, 0)` ise fix karta hai.',
      },
      {
        title: 'GROUP BY and DISTINCT collapse all NULLs into one; ORDER BY ... NULLS LAST',
        titleHi: 'GROUP BY aur DISTINCT sabhi NULLs ko ek mein collapse karte hain',
        code: `CREATE TABLE g (category text, v int);
INSERT INTO g VALUES ('a', 1), ('a', 2), (NULL, 3), (NULL, 4), ('b', 5);

-- every NULL-category row is one group, keyed NULL
SELECT category, count(*) AS n
FROM g
GROUP BY category
ORDER BY category NULLS LAST;`,
        output: ` category | n
----------+---
 a        | 2
 b        | 1
 NULL     | 2
(3 rows)`,
        explain: "For `GROUP BY`, SQL treats all `NULL`s as the SAME key, so the two `NULL`-category rows form one group with `count(*) = 2` (the opposite of the comparison rule, where `NULL = NULL` is unknown). `ORDER BY category NULLS LAST` overrides PostgreSQL's default (which for ascending already puts `NULL`s last, but writing it makes the intent explicit and portable).",
        explainHi: '`GROUP BY` ke liye, SQL sabhi `NULL`s ko SAME key maanta hai, to do `NULL`-category rows ek group banati hain `count(*) = 2` ke saath (comparison rule ka ulta). `ORDER BY category NULLS LAST` PostgreSQL ke default ko override karta hai (jo ascending ke liye pehle se `NULL`s ko last daalta hai, par ise likhna intent ko explicit aur portable banata hai).',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT * FROM subscription WHERE canceled_at = NULL;
-- intent: active subscriptions (no cancellation date)
-- actual: ZERO rows, always -- "= NULL" is UNKNOWN for every row`,
        right: `SELECT * FROM subscription WHERE canceled_at IS NULL;`,
        why: 'x = NULL is not a test for NULL; it is a comparison, and any comparison with NULL evaluates to UNKNOWN, never TRUE. WHERE keeps a row only when the condition is TRUE, so the query returns nothing, silently. The only correct tests are IS NULL and IS NOT NULL, which check for presence rather than comparing the value. Some databases in a non-standard compatibility mode rewrite = NULL to IS NULL, but that behaviour is not portable and relying on it hides the bug.',
        whyHi: 'x = NULL NULL ke liye ek test nahi hai; ye ek comparison hai, aur NULL ke saath koi bhi comparison UNKNOWN evaluate hota hai, kabhi TRUE nahi. WHERE ek row ko sirf tab rakhta hai jab condition TRUE ho, to query chupchaap kuch nahi lautati. Ekmatra sahi tests IS NULL aur IS NOT NULL hain.',
      },
      {
        wrong: `-- "everyone not in the eng or sales departments"
SELECT * FROM employee
WHERE dept NOT IN (SELECT dept FROM department WHERE building = 'HQ');
-- returns ZERO rows if ANY department at HQ has a NULL dept value`,
        right: `SELECT e.* FROM employee e
WHERE NOT EXISTS (
  SELECT 1 FROM department d
  WHERE d.building = 'HQ' AND d.dept = e.dept
);
-- NOT EXISTS is NULL-safe: a NULL in the subquery just does not match`,
        why: 'NOT IN (subquery) expands to a chain of "e.dept <> value" joined by AND. If the subquery returns even one NULL, one term becomes "e.dept <> NULL" which is UNKNOWN for every row, and "anything AND UNKNOWN" is never TRUE, so the whole predicate fails for all rows and you get an empty result. This is invisible until a NULL sneaks into that column. NOT EXISTS with a correlated subquery does not have this problem: a NULL row in the subquery simply does not satisfy the correlation and is ignored. Use NOT IN only with hard-coded, guaranteed-NULL-free literal lists.',
        whyHi: 'NOT IN (subquery) "e.dept <> value" ki ek chain mein expand hota hai jo AND se judi hai. Agar subquery ek bhi NULL lautati hai, ek term "e.dept <> NULL" ban jaata hai jo har row ke liye UNKNOWN hai, aur "kuch bhi AND UNKNOWN" kabhi TRUE nahi, to poora predicate sab rows ke liye fail hota hai aur aapko empty result milta hai. NOT EXISTS ke saath ek correlated subquery mein ye problem nahi hai.',
      },
      {
        wrong: `-- "count of orders that are NOT paid"
SELECT count(*) FROM orders WHERE status <> 'paid';
-- silently omits every order whose status is NULL`,
        right: `SELECT count(*) FROM orders
WHERE status <> 'paid' OR status IS NULL;
-- or, if NULL status should never exist, make the column NOT NULL`,
        why: 'status <> \'paid\' is UNKNOWN for any row where status is NULL, so those rows are dropped from the count. If some orders have a NULL status, the "not paid" count is understated and "paid" + "not paid" does not equal the total. Whenever you filter on a nullable column with an inequality, decide explicitly whether NULL belongs in the result and add "OR col IS NULL" (or "AND col IS NOT NULL") to say so. Better still, if a NULL in that column is never meaningful, forbid it with NOT NULL so the question does not arise.',
        whyHi: 'status <> \'paid\' kisi bhi row ke liye UNKNOWN hai jahaan status NULL hai, to wo rows count se drop ho jaati hain. Agar kuch orders ka status NULL hai, "not paid" count kam bataya jaata hai. Jab bhi aap ek nullable column par ek inequality se filter karte ho, explicitly decide karo ki NULL result mein hai ya nahi aur "OR col IS NULL" add karo. Behtar, agar us column mein ek NULL kabhi meaningful nahi, ise NOT NULL se forbid karo.',
      },
    ],

    realWorld: [
      {
        en: '**`NOT NULL` by default in every schema review** — a nullable column has to be justified ("this really can be unknown"), because each one adds a `IS NULL` branch to every query, a `COALESCE` to every aggregate, and a `NULLS LAST` to every sort that touches it.',
        hi: '**Har schema review mein default se `NOT NULL`** — ek nullable column ko justify karna padta hai, kyunki har ek har query mein ek `IS NULL` branch jodta hai.',
      },
      {
        en: '**`COALESCE(sum(amount), 0)` in every reporting query** so an empty period shows `0` revenue instead of a `NULL` that breaks the chart or the downstream arithmetic.',
        hi: '**Har reporting query mein `COALESCE(sum(amount), 0)`** taaki ek empty period `NULL` ke bजाy `0` revenue dikhाe.',
      },
      {
        en: '**`NOT EXISTS` as the team standard for anti-joins** ("customers with no orders", "products never sold") — `NOT IN` is banned for subqueries because one `NULL` in the inner column silently zeroes the result and it is impossible to notice in review.',
        hi: '**Anti-joins ke liye team standard `NOT EXISTS`** — subqueries ke liye `NOT IN` banned hai kyunki inner column mein ek `NULL` chupchaap result ko zero kar deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is three-valued logic in SQL, and how does it affect `WHERE` and `NOT`?',
        qHi: 'SQL mein three-valued logic kya hai, aur ye `WHERE` aur `NOT` ko kaise affect karta hai?',
        a: 'SQL boolean expressions have three possible results, not two: TRUE, FALSE, and UNKNOWN. UNKNOWN arises whenever a comparison touches a NULL — anything equals NULL, anything less than NULL, even NULL equals NULL, all evaluate to UNKNOWN, because NULL means "no value" and you cannot compare against a value you do not have. The connectives follow suit: TRUE AND UNKNOWN is UNKNOWN, FALSE AND UNKNOWN is still FALSE because AND short-circuits on FALSE, TRUE OR UNKNOWN is TRUE, and NOT UNKNOWN is UNKNOWN. The single rule that makes this matter is that WHERE, join ON clauses, HAVING, and CHECK constraints keep a row or accept a value only when the condition is exactly TRUE. A row where the condition is UNKNOWN is dropped, exactly like a row where it is FALSE. So a row with a NULL price is excluded by WHERE price greater than 50 and also excluded by WHERE price less than or equal to 50 — it is in neither result set. And because of this, WHERE NOT (condition) is not the logical complement of WHERE condition: rows where the condition is UNKNOWN are missing from both. To ask about NULL itself you must use IS NULL or IS NOT NULL, the only operators that return a definite TRUE or FALSE for a NULL input.',
        aHi: 'SQL boolean expressions ke teen possible results hain, do nahi: TRUE, FALSE, aur UNKNOWN. UNKNOWN tab aata hai jab ek comparison ek NULL ko chhuता hai — kuch bhi NULL ke barabar, NULL NULL ke barabar, sab UNKNOWN evaluate hote hain. Connectives bhi follow karte hain: TRUE AND UNKNOWN UNKNOWN hai, FALSE AND UNKNOWN abhi bhi FALSE hai, TRUE OR UNKNOWN TRUE hai, NOT UNKNOWN UNKNOWN hai. Ek niyam jo ise maayne deta hai: WHERE, ON, HAVING, CHECK ek row ko sirf tab rakhte hain jab condition theek TRUE ho. Ek row jahaan condition UNKNOWN hai drop ho jaati hai. To NULL price waali ek row WHERE price > 50 se aur WHERE price <= 50 dono se excluded hai. Aur isliye, WHERE NOT (condition) WHERE condition ka logical complement nahi hai.',
      },
      {
        q: 'How does `NULL` behave in aggregates, `GROUP BY`, and `ORDER BY`?',
        qHi: '`NULL` aggregates, `GROUP BY`, aur `ORDER BY` mein kaise behave karta hai?',
        a: 'In aggregates, count(*) counts every row including all-NULL ones, but count(column) counts only the rows where that column is not NULL. sum, avg, min, and max skip NULL inputs entirely — so avg divides the non-NULL total by the non-NULL count, and NULLs do not pull the average toward zero. Crucially, sum or avg or max or min of an empty group, or of a column that is entirely NULL, returns NULL, not 0, which is why reporting queries wrap it as COALESCE of sum comma 0. In GROUP BY and in DISTINCT and in UNION, SQL does the opposite of the comparison rule: it treats all NULLs as equal to each other, so every NULL-keyed row lands in a single group and DISTINCT returns NULL at most once. That inconsistency — NULL is not equal to anything for WHERE, but equal to other NULLs for grouping — is deliberate and you just have to know it. In ORDER BY, NULLs have to sort somewhere and the standard leaves it undefined; PostgreSQL sorts NULL as larger than any value, so ascending puts NULLs last and descending puts them first. MySQL does the opposite for ascending. If the placement matters or the query must be portable, write NULLS FIRST or NULLS LAST explicitly.',
        aHi: 'Aggregates mein, count(*) har row count karta hai, par count(column) sirf un rows ko count karta hai jahaan wo column NULL nahi hai. sum, avg, min, max NULL inputs poori tarah skip karte hain — to avg non-NULL total ko non-NULL count se divide karta hai. Mahatvapoorn: ek empty group ka, ya poori tarah NULL column ka, sum ya avg ya max ya min NULL lautata hai, 0 nahi. GROUP BY mein aur DISTINCT mein aur UNION mein, SQL comparison rule ka ulta karta hai: ye sabhi NULLs ko ek doosre ke barabar maanta hai, to har NULL-keyed row ek single group mein aati hai. ORDER BY mein, PostgreSQL NULL ko kisi bhi value se bada sort karta hai, to ascending NULLs ko last daalta hai. Placement maayne rakhta hai ya query portable honi chahiye to NULLS FIRST ya NULLS LAST explicitly likho.',
      },
    ],

    exercises: [
      {
        task: 'Run one `SELECT` that returns, as columns: `1 = NULL`, `NULL = NULL`, `NULL <> NULL`, `NULL IS NULL`, `NULL IS DISTINCT FROM NULL`, `NULL IS NOT DISTINCT FROM NULL`. Predict each before running. Confirm the first three are `NULL`, `IS NULL` is `t`, `IS DISTINCT FROM` is `f`, and `IS NOT DISTINCT FROM` is `t`.',
        taskHi: 'Ek `SELECT` chalao jo columns ke roop mein lautaye: `1 = NULL`, `NULL = NULL`, `NULL <> NULL`, `NULL IS NULL`, `NULL IS DISTINCT FROM NULL`, `NULL IS NOT DISTINCT FROM NULL`. Har ek predict karo. Confirm karo.',
        hint: 'Just `SELECT (1 = NULL) AS a, (NULL = NULL) AS b, ...;` — no table needed. Comparisons give `NULL`; `IS NULL` and the `DISTINCT FROM` family always give `t`/`f`.',
        hintHi: 'Bस `SELECT (1 = NULL) AS a, (NULL = NULL) AS b, ...;` — koi table nahi chahiye. Comparisons `NULL` dete hain; `IS NULL` aur `DISTINCT FROM` family hamesha `t`/`f`.',
      },
      {
        task: 'Table `survey(id int, rating int)` with rows `(1,5) (2,NULL) (3,3) (4,NULL) (5,4)`. Compute `count(*)`, `count(rating)`, `sum(rating)`, `avg(rating)` (rounded to 2), and also `sum(rating)::numeric / count(*)` (the "NULLs count as low" average). Confirm `avg(rating)` is `4.00` but the divide-by-count-star version is `2.40`.',
        taskHi: 'Table `survey(id int, rating int)` rows `(1,5) (2,NULL) (3,3) (4,NULL) (5,4)` ke saath. `count(*)`, `count(rating)`, `sum(rating)`, `avg(rating)` (2 tak rounded), aur `sum(rating)::numeric / count(*)` compute karo. Confirm `avg(rating)` `4.00` hai par doosra `2.40`.',
        hint: '`avg(rating)` = 12 / 3 = 4.00 (only non-NULL rows). `sum(rating) / count(*)` = 12 / 5 = 2.40 (spreads the sum over all rows, treating NULL as if it were 0).',
        hintHi: '`avg(rating)` = 12 / 3 = 4.00 (sirf non-NULL rows). `sum(rating) / count(*)` = 12 / 5 = 2.40.',
      },
      {
        task: 'Table `task(id int, assignee text, done boolean)` with some `NULL` assignees and some `NULL` done. Run `SELECT count(*) FROM task WHERE done <> true` and `SELECT count(*) FROM task WHERE done <> true OR done IS NULL`. Explain the difference. Then run `SELECT assignee, count(*) FROM task GROUP BY assignee ORDER BY assignee NULLS LAST` and confirm the `NULL` assignees form one group.',
        taskHi: 'Table `task(id int, assignee text, done boolean)` kuch `NULL` values ke saath. `WHERE done <> true` aur `WHERE done <> true OR done IS NULL` count karo. Antar samjhाओ. Phir `GROUP BY assignee` — confirm `NULL` assignees ek group banate hain.',
        hint: '`done <> true` is `UNKNOWN` for `NULL` rows, so the first count omits them. `GROUP BY` treats all `NULL`s as one key, so unassigned tasks are a single group.',
        hintHi: '`done <> true` `NULL` rows ke liye `UNKNOWN` hai, to pehla count unhe omit karta hai. `GROUP BY` sabhi `NULL`s ko ek key maanta hai.',
      },
    ],

    keyTakeaways: [
      '`NULL` = "no value here" — NOT `0`, NOT `\'\'`, NOT `false`. Any comparison touching a `NULL` (`=`, `<>`, `<`, `LIKE`, even `NULL = NULL`) evaluates to `UNKNOWN`, a third truth value.',
      '`AND`/`OR`/`NOT` with `UNKNOWN`: `TRUE AND U = U`, `FALSE AND U = FALSE` (short-circuit), `TRUE OR U = TRUE`, `FALSE OR U = U`, `NOT U = U`.',
      'THE RULE everything follows from: `WHERE` / `ON` / `HAVING` / `CHECK` keep a row only when the condition is EXACTLY `TRUE`. `FALSE` and `UNKNOWN` both fail -> a `NULL`-price row is in NEITHER `WHERE price < 100` NOR `WHERE price >= 100`. `WHERE NOT (cond)` is NOT the complement of `WHERE cond` when `NULL`s exist.',
      'Test for `NULL` with `IS NULL` / `IS NOT NULL` ONLY — `x = NULL` is always `UNKNOWN` (silent bug). `IS DISTINCT FROM` / `IS NOT DISTINCT FROM` are the `NULL`-aware `<>` / `=` (`NULL IS NOT DISTINCT FROM NULL` -> `TRUE`).',
      '`NULL` propagates through arithmetic (`100 + NULL` -> `NULL`) and `||` (`a || NULL` -> `NULL`). Wrap nullable operands: `price - COALESCE(discount, 0)`.',
      'Aggregates: `count(*)` counts ROWS; `count(col)` counts NON-`NULL` values; `sum`/`avg`/`min`/`max` IGNORE `NULL` (so `avg` = non-null-sum / non-null-count, `NULL`s don\'t drag it down). `sum`/`avg`/`max`/`min` of an empty/all-`NULL` set is `NULL` NOT `0` -> `COALESCE(sum(x), 0)`.',
      '`GROUP BY` / `DISTINCT` / `UNION` treat ALL `NULL`s as EQUAL (opposite of the comparison rule) -> one `NULL` group, `NULL` appears once. This inconsistency is deliberate.',
      '`ORDER BY` (PostgreSQL): `NULL` sorts as LARGEST -> `ASC` = `NULL`s last, `DESC` = `NULL`s first. Other DBs differ -> write `NULLS FIRST` / `NULLS LAST` explicitly when it matters. `NOT IN (…, NULL)` -> ALWAYS zero rows (one term becomes `x <> NULL` -> `UNKNOWN` -> the `AND` never `TRUE`) -> use `NOT EXISTS`.',
      'Design: default `NOT NULL` + a sensible default; allow `NULL` only when "unknown / not applicable" is a genuine distinct state. Every nullable column is a branch in every query.',
    ],
    keyTakeawaysHi: [
      '`NULL` = "yahaan koi value nahi" — `0` NAHI, `\'\'` NAHI, `false` NAHI. `NULL` ko chhune waala koi bhi comparison `UNKNOWN` evaluate hota hai, ek teesra truth value.',
      '`AND`/`OR`/`NOT` `UNKNOWN` ke saath: `TRUE AND U = U`, `FALSE AND U = FALSE`, `TRUE OR U = TRUE`, `NOT U = U`.',
      'THE NIYAM: `WHERE` / `ON` / `HAVING` / `CHECK` ek row ko sirf tab rakhte hain jab condition THEEK `TRUE` ho. `FALSE` aur `UNKNOWN` dono fail -> ek `NULL`-price row `WHERE price < 100` ya `WHERE price >= 100` KISI mein nahi.',
      '`NULL` ke liye test SIRF `IS NULL` / `IS NOT NULL` — `x = NULL` hamesha `UNKNOWN` (silent bug). `IS DISTINCT FROM` `NULL`-aware `<>` hai.',
      '`NULL` arithmetic (`100 + NULL` -> `NULL`) aur `||` ke through propagate hota hai. Nullable operands wrap karo: `price - COALESCE(discount, 0)`.',
      'Aggregates: `count(*)` ROWS count karta hai; `count(col)` NON-`NULL` values; `sum`/`avg`/`min`/`max` `NULL` IGNORE karte hain. Empty/all-`NULL` set ka `sum` `NULL` hai `0` NAHI -> `COALESCE(sum(x), 0)`.',
      '`GROUP BY` / `DISTINCT` sabhi `NULL`s ko EQUAL maante hain (comparison rule ka ulta) -> ek `NULL` group. Ye inconsistency jaan-boojhkar hai.',
      '`ORDER BY` (PostgreSQL): `NULL` LARGEST sort hota hai -> `ASC` = last, `DESC` = first. `NULLS FIRST`/`NULLS LAST` explicitly likho. `NOT IN (…, NULL)` -> HAMESHA zero rows -> `NOT EXISTS` istemal karo.',
      'Design: default `NOT NULL` + ek sensible default; `NULL` sirf tab allow karo jab "unknown" ek genuine distinct state hai.',
    ],
  },

  {
    slug: 'sql-order-by-and-limit',
    title: '`ORDER BY` & `LIMIT`: Sorting, Ties, Pagination',
    titleHi: '`ORDER BY` & `LIMIT`: Sorting, Ties, Pagination',
    description: '`ORDER BY` is the only thing that makes a result\'s row order meaningful — without it a database may return rows in *any* order, and that order can change. `LIMIT` / `OFFSET` take a slice, but only a slice of an *ordered* result is well-defined, and `OFFSET` pagination gets slower the deeper you go.',
    descriptionHi: '`ORDER BY` ekmatra cheez hai jo ek result ke row order ko meaningful banati hai — iske bina ek database rows ko *kisi bhi* order mein lauta sakta hai, aur wo order badal sakta hai. `LIMIT` / `OFFSET` ek slice lete hain, par ek *ordered* result ka hi ek slice well-defined hai, aur `OFFSET` pagination jitna gehra jाओ utna slow hota hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A deck of index cards a clerk hands you back.** Without an instruction, the clerk returns the matching cards in whatever order they happened to come off the pile — which today might be insertion order, tomorrow might be the order an index walked them, and after a data reorganisation might be something else entirely. "Give me the first ten" of an *unsorted* pile is meaningless: first by what? `ORDER BY` is the sorting instruction — "by year, newest first; break ties by title" — and only once the pile is sorted does "the first ten" (`LIMIT 10`) or "the next ten" (`LIMIT 10 OFFSET 10`) name a definite set of cards. And note how the clerk fulfils "give me cards 90 to 100": they count past the first 90, one at a time, and hand you the next 10. Ask for cards 100,000 to 100,010 and they still count past a hundred thousand cards first. That counting is why deep `OFFSET` pagination degrades — the database does the skipped work, it just throws it away.',
      hi: '**Index cards ka ek deck jo ek clerk aapko wapas deta hai.** Bina ek instruction ke, clerk matching cards ko jis order mein wo pile se aayin us order mein lautata hai — jo aaj insertion order ho sakta hai, kal ek index ne unhe jis order mein walk kiya, aur ek data reorganisation ke baad kuch aur poori tarah. Ek *unsorted* pile ke "pehle das do" meaningless hai: pehle kis se? `ORDER BY` sorting instruction hai — "year se, newest first; ties title se break karo" — aur pile sort hone ke baad hi "pehle das" (`LIMIT 10`) ya "agle das" (`LIMIT 10 OFFSET 10`) cards ka ek definite set naam karta hai. Aur dhyaan do clerk "cards 90 se 100 do" kaise poora karta hai: wo pehle 90 se aage ginता hai, ek-ek karke, aur aapko agle 10 deता hai. Cards 100,000 se 100,010 maango aur wo abhi bhi pehle ek lakh cards se aage ginता hai. Wo counting kyun deep `OFFSET` pagination degrade hoti hai.',
    },

    simple: `**Without \`ORDER BY\`, row order is undefined**

\`\`\`sql
SELECT id, name FROM users LIMIT 10;
-- "10 users" -- but WHICH 10, and in what order? Undefined, and NOT stable.
-- add ORDER BY to make it deterministic:
SELECT id, name FROM users ORDER BY id LIMIT 10;
\`\`\`

**Sort keys — column, expression, position, or alias**

\`\`\`sql
ORDER BY created_at DESC              -- by a column
ORDER BY lower(name)                  -- by an expression
ORDER BY salary * 12 DESC             -- by a computed value
ORDER BY total DESC                   -- by a SELECT-list ALIAS  (allowed in ORDER BY — Lesson 6)
ORDER BY 3 DESC, 1                    -- by SELECT-list POSITION  (3rd column, then 1st) -- avoid in real code
\`\`\`

**\`ASC\` / \`DESC\` and \`NULLS\` placement**

\`\`\`sql
ORDER BY price ASC                    -- ascending (default)
ORDER BY price DESC                   -- descending
ORDER BY price DESC NULLS LAST        -- Postgres default for DESC is NULLS FIRST -- override it
\`\`\`

**Multiple keys — and always add a tiebreaker**

\`\`\`sql
ORDER BY dept ASC, salary DESC        -- by dept; within a dept, highest salary first
ORDER BY score DESC, id ASC           -- score first; ties broken by id -> a TOTAL, stable order
-- ORDER BY score DESC alone: rows with equal score come back in ANY order, and it can change
\`\`\`

**\`LIMIT\` / \`OFFSET\` — take a slice of the ordered result**

\`\`\`sql
SELECT ... ORDER BY id LIMIT 20;               -- first 20
SELECT ... ORDER BY id LIMIT 20 OFFSET 40;     -- rows 41-60  (page 3, page size 20)
SELECT ... ORDER BY id OFFSET 40;              -- everything from row 41 on
SELECT ... ORDER BY id FETCH FIRST 20 ROWS ONLY;   -- SQL-standard spelling of LIMIT
\`\`\`

**\`OFFSET\` pagination gets slower the deeper you go**

\`\`\`
LIMIT 20 OFFSET 0        -> read 20 rows
LIMIT 20 OFFSET 100000   -> read 100020 rows, discard the first 100000, return 20
-- the database still does the skipped work. For deep pages use KEYSET pagination:
WHERE id > :last_seen_id ORDER BY id LIMIT 20     -- O(1) per page, no growing OFFSET
\`\`\``,

    simpleHi: `**\`ORDER BY\` ke bina, row order undefined hai**

\`\`\`sql
SELECT id, name FROM users LIMIT 10;
-- "10 users" -- par KAUNSE 10, aur kis order mein? Undefined, aur stable NAHI.
SELECT id, name FROM users ORDER BY id LIMIT 10;   -- deterministic banane ke liye
\`\`\`

**Sort keys — column, expression, position, ya alias**

\`\`\`sql
ORDER BY created_at DESC              -- ek column se
ORDER BY lower(name)                  -- ek expression se
ORDER BY salary * 12 DESC             -- ek computed value se
ORDER BY total DESC                   -- ek SELECT-list ALIAS se  (ORDER BY mein allowed — Lesson 6)
ORDER BY 3 DESC, 1                    -- SELECT-list POSITION se -- real code mein avoid karo
\`\`\`

**\`ASC\` / \`DESC\` aur \`NULLS\` placement**

\`\`\`sql
ORDER BY price ASC                    -- ascending (default)
ORDER BY price DESC                   -- descending
ORDER BY price DESC NULLS LAST        -- DESC ke liye Postgres default NULLS FIRST hai -- override
\`\`\`

**Multiple keys — aur hamesha ek tiebreaker add karo**

\`\`\`sql
ORDER BY dept ASC, salary DESC        -- dept se; ek dept ke andar, highest salary first
ORDER BY score DESC, id ASC           -- score first; ties id se break -> ek TOTAL, stable order
-- ORDER BY score DESC akele: barabar score waali rows KISI bhi order mein aati hain
\`\`\`

**\`LIMIT\` / \`OFFSET\` — ordered result ka ek slice**

\`\`\`sql
SELECT ... ORDER BY id LIMIT 20;               -- pehle 20
SELECT ... ORDER BY id LIMIT 20 OFFSET 40;     -- rows 41-60  (page 3, page size 20)
SELECT ... ORDER BY id FETCH FIRST 20 ROWS ONLY;   -- LIMIT ki SQL-standard spelling
\`\`\`

**\`OFFSET\` pagination jitna gehra jाओ utna slow**

\`\`\`
LIMIT 20 OFFSET 0        -> 20 rows padho
LIMIT 20 OFFSET 100000   -> 100020 rows padho, pehle 100000 discard karo, 20 lautao
-- deep pages ke liye KEYSET pagination:
WHERE id > :last_seen_id ORDER BY id LIMIT 20     -- prati page O(1), koi badhta OFFSET nahi
\`\`\``,

    content: `## A relation has no inherent order

The relational model defines a table as an unordered *set* of rows. A \`SELECT\` without \`ORDER BY\` therefore has no guaranteed row order — the database returns rows in whatever order is cheapest, which depends on the plan (sequential scan, index scan, hash join output), the physical layout, concurrent activity, and the server version. It often *looks* like insertion order on a small fresh table, which trains people to rely on it; then a query gets an index, or the table is vacuumed, and the order silently changes.

**If the order matters, say so with \`ORDER BY\`.** This includes "just give me any 10" — \`LIMIT\` without \`ORDER BY\` returns an arbitrary, unstable 10.

## Sort keys

\`ORDER BY\` takes a comma-separated list of sort keys, each optionally \`ASC\` (default) or \`DESC\`, and optionally \`NULLS FIRST\` / \`NULLS LAST\`. A key can be:

- **A column name**: \`ORDER BY last_name\`.
- **An expression**: \`ORDER BY lower(email)\`, \`ORDER BY price / weight DESC\`, \`ORDER BY (first_name || ' ' || last_name)\`.
- **A select-list alias**: \`SELECT price * qty AS total ... ORDER BY total\`. \`ORDER BY\` runs *after* the \`SELECT\` list is computed (Lesson 6), so the alias is visible here — unlike in \`WHERE\`.
- **A select-list position**: \`ORDER BY 2, 1\` means "by the 2nd output column, then the 1st". This is terse and fragile — adding a column to the \`SELECT\` list silently changes what \`2\` means — so prefer names or aliases in code you will keep.
- **A \`CASE\` expression** for custom ordering: \`ORDER BY CASE status WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END\`.

## Direction and \`NULL\` placement

\`ASC\` sorts small-to-large (numbers ascending, strings by collation, dates earliest first, \`false\` before \`true\`). \`DESC\` reverses it. Each key has its own direction: \`ORDER BY a ASC, b DESC\`.

\`NULL\`s must go somewhere. **PostgreSQL** treats \`NULL\` as larger than any value, so \`ASC\` → \`NULLS LAST\`, \`DESC\` → \`NULLS FIRST\`. Override per key with \`NULLS FIRST\` / \`NULLS LAST\`. Because other databases choose differently, write the \`NULLS\` clause explicitly whenever the placement is part of the requirement (e.g. "unrated items at the bottom").

## Ties and stable ordering

If two rows are equal on every sort key, their relative order is **undefined** — and, critically, **not stable**: re-running the same query can return them in a different order, and with \`LIMIT\` that means a row can appear on page 2 one moment and page 3 the next, or be skipped entirely.

**Always end \`ORDER BY\` with a key that is unique** (usually the primary key): \`ORDER BY created_at DESC, id DESC\`. This makes the ordering *total* and *deterministic*, which is what pagination and reproducible reports require.

## \`LIMIT\`, \`OFFSET\`, \`FETCH\`

- **\`LIMIT n\`** — return at most \`n\` rows (of the ordered result). \`LIMIT 0\` returns none (useful for fetching column metadata). \`LIMIT ALL\` = no limit.
- **\`OFFSET m\`** — skip the first \`m\` rows, then start returning. \`OFFSET\` without \`LIMIT\` is legal (return everything after row \`m\`).
- **\`FETCH FIRST n ROWS ONLY\`** — the SQL-standard spelling; \`FETCH FIRST n ROWS WITH TIES\` also returns rows tied with the \`n\`-th on the \`ORDER BY\` key.
- Order of clauses: \`... ORDER BY ... LIMIT ... OFFSET ...\`. Logically \`OFFSET\` is applied, then \`LIMIT\`.

## The cost of \`OFFSET\` pagination

\`LIMIT 20 OFFSET 100000\` does not "jump" to row 100001. The database produces the ordered result and **counts through the first 100,000 rows, discarding each**, then returns the next 20. The work grows linearly with the page number, so page 5,000 of a listing is dramatically slower than page 1 — and if rows are inserted or deleted between requests, the offsets shift and users see duplicates or gaps.

**Keyset (cursor) pagination** fixes both problems. Instead of "skip 100,000", you remember the sort key of the last row shown and ask for rows *after* it:

\`\`\`sql
-- page 1
SELECT ... ORDER BY created_at DESC, id DESC LIMIT 20;
-- page 2: pass the last row's (created_at, id) back as parameters
SELECT ... WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;
\`\`\`

With an index on \`(created_at, id)\` this reads exactly 20 rows per page regardless of depth, and it is stable against concurrent inserts. The tradeoff: you cannot jump to an arbitrary page number, only "next" / "previous". For user-facing infinite scroll and "load more", keyset is the right default; reserve \`OFFSET\` for small, bounded result sets. (Module 10 covers this in depth.)`,

    contentHi: `## Ek relation ka koi inherent order nahi

Relational model ek table ko rows ka ek unordered *set* define karta hai. Ek \`SELECT\` bina \`ORDER BY\` ke isliye koi guaranteed row order nahi hai — database rows ko jis order mein sabse sasta hai us order mein lautata hai, jo plan (sequential scan, index scan), physical layout, concurrent activity, aur server version par nirbhar karta hai. Ye aksar ek chhote fresh table par insertion order *jaisa dikhta* hai; phir ek query ko ek index milta hai, ya table vacuum hota hai, aur order chupchaap badal jaata hai.

**Agar order maayne rakhta hai, \`ORDER BY\` se kaho.** Isme "bस koi bhi 10 do" shamil hai.

## Sort keys

\`ORDER BY\` sort keys ki ek comma-separated list leta hai, har ek optionally \`ASC\` (default) ya \`DESC\`, aur optionally \`NULLS FIRST\` / \`NULLS LAST\`. Ek key ho sakti hai:

- **Ek column name**: \`ORDER BY last_name\`.
- **Ek expression**: \`ORDER BY lower(email)\`.
- **Ek select-list alias**: \`ORDER BY\` \`SELECT\` list compute hone ke *baad* chalता hai (Lesson 6), to alias yahaan visible hai — \`WHERE\` ke ulta.
- **Ek select-list position**: \`ORDER BY 2, 1\`. Terse aur fragile — prefer names ya aliases.
- **Ek \`CASE\` expression** custom ordering ke liye.

## Direction aur \`NULL\` placement

\`ASC\` small-to-large sort karta hai. \`DESC\` ise reverse karta hai. Har key ka apna direction hai.

**PostgreSQL** \`NULL\` ko kisi bhi value se bada maanta hai, to \`ASC\` -> \`NULLS LAST\`, \`DESC\` -> \`NULLS FIRST\`. Per key \`NULLS FIRST\` / \`NULLS LAST\` se override karo. Kyunki doosre databases alag chunते hain, jab placement requirement ka hissa hai to \`NULLS\` clause explicitly likho.

## Ties aur stable ordering

Agar do rows har sort key par barabar hain, unka relative order **undefined** hai — aur, mahatvapoorn roop se, **stable nahi**: wahi query re-run karna unhe ek alag order mein lauta sakta hai, aur \`LIMIT\` ke saath iska matlab ek row ek pal page 2 par aur agle page 3 par dikh sakti hai, ya poori tarah skip ho sakti hai.

**Hamesha \`ORDER BY\` ko ek key se khatam karo jo unique hai** (aksar primary key): \`ORDER BY created_at DESC, id DESC\`. Ye ordering ko *total* aur *deterministic* banata hai.

## \`LIMIT\`, \`OFFSET\`, \`FETCH\`

- **\`LIMIT n\`** — zyaada se zyaada \`n\` rows lautao.
- **\`OFFSET m\`** — pehli \`m\` rows skip karo, phir lautana shuru karo.
- **\`FETCH FIRST n ROWS ONLY\`** — SQL-standard spelling.
- Clauses ka order: \`... ORDER BY ... LIMIT ... OFFSET ...\`.

## \`OFFSET\` pagination ki cost

\`LIMIT 20 OFFSET 100000\` row 100001 par "jump" nahi karta. Database ordered result produce karta hai aur **pehli 100,000 rows se aage ginता hai, har ek discard karke**, phir agli 20 lautata hai. Kaam page number ke saath linearly badhता hai. Aur agar rows insert ya delete hoती hain requests ke beech, offsets shift hote hain aur users duplicates ya gaps dekhते hain.

**Keyset (cursor) pagination** dono problems fix karta hai. "100,000 skip karo" ke bजाy, aap dikhाyi gayi aakhri row ki sort key yaad rakhते ho aur uske *baad* ki rows maangते ho:

\`\`\`sql
SELECT ... WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;
\`\`\`

\`(created_at, id)\` par ek index ke saath ye depth ki parwah kiye bina prati page theek 20 rows padhता hai. Tradeoff: aap ek arbitrary page number par jump nahi kar sakte. User-facing infinite scroll ke liye keyset sahi default hai. (Module 10 ise detail mein cover karta hai.)`,

    examples: [
      {
        title: 'Default NULL placement, and forcing it with NULLS LAST',
        titleHi: 'Default NULL placement, aur NULLS LAST se ise force karna',
        code: `CREATE TABLE emp (name text, salary int);
INSERT INTO emp VALUES ('Ada', 120), ('Bo', NULL), ('Cy', 90), ('Di', NULL), ('Ed', 110);

-- DESC: Postgres puts NULLs FIRST by default (NULL sorts as "largest")
SELECT name, salary FROM emp ORDER BY salary DESC;

-- force NULLs to the bottom
SELECT name, salary FROM emp ORDER BY salary DESC NULLS LAST;`,
        output: ` name | salary
------+--------
 Bo   | NULL
 Di   | NULL
 Ada  | 120
 Ed   | 110
 Cy   | 90
(5 rows)

 name | salary
------+--------
 Ada  | 120
 Ed   | 110
 Cy   | 90
 Bo   | NULL
 Di   | NULL
(5 rows)`,
        explain: '`ORDER BY salary DESC` puts the `NULL` salaries FIRST — PostgreSQL sorts `NULL` as larger than any value, so descending brings them to the top. That is rarely what you want for "highest paid first". `ORDER BY salary DESC NULLS LAST` forces the unknown salaries to the bottom where they belong.',
        explainHi: '`ORDER BY salary DESC` `NULL` salaries ko PEHLE daalta hai — PostgreSQL `NULL` ko kisi bhi value se bada sort karta hai, to descending unhe top par laata hai. `ORDER BY salary DESC NULLS LAST` unknown salaries ko neeche force karta hai jahaan wo rehni chahiye.',
      },
      {
        title: 'Multiple sort keys, and ordering by a select-list expression by position',
        titleHi: 'Multiple sort keys, aur position se ek select-list expression se order karna',
        code: `CREATE TABLE emp (name text, dept text, salary int);
INSERT INTO emp VALUES
  ('Ada','eng',120), ('Bo','eng',95), ('Cy','sales',95), ('Di','sales',110);

-- by dept ascending; within a dept, salary descending
SELECT name, dept, salary FROM emp ORDER BY dept ASC, salary DESC;

-- order by the 3rd output column (annual) descending
SELECT name, salary, salary * 12 AS annual FROM emp ORDER BY 3 DESC;`,
        output: ` name | dept  | salary
------+-------+--------
 Ada  | eng   | 120
 Bo   | eng   | 95
 Di   | sales | 110
 Cy   | sales | 95
(4 rows)

 name | salary | annual
------+--------+--------
 Ada  | 120    | 1440
 Di   | 110    | 1320
 Bo   | 95     | 1140
 Cy   | 95     | 1140
(4 rows)`,
        explain: '`ORDER BY dept ASC, salary DESC` sorts by department first, then by salary descending within each department — so within `eng`, Ada (120) comes before Bo (95). The second query uses `ORDER BY 3`, meaning "the 3rd column of the SELECT list" (`annual`), sorted descending. Position-based ordering is terse but fragile: inserting a column shifts what `3` means.',
        explainHi: '`ORDER BY dept ASC, salary DESC` pehle department se sort karta hai, phir har department ke andar salary descending — to `eng` ke andar, Ada (120) Bo (95) se pehle aati hai. Doosri query `ORDER BY 3` istemal karti hai, matlab "SELECT list ka 3rd column" (`annual`), descending. Position-based ordering terse par fragile hai.',
      },
      {
        title: 'LIMIT / OFFSET as pages of an ordered result',
        titleHi: 'LIMIT / OFFSET ek ordered result ke pages ke roop mein',
        code: `CREATE TABLE t (id int, name text);
INSERT INTO t VALUES (1,'a'), (2,'b'), (3,'c'), (4,'d'), (5,'e');

SELECT id, name FROM t ORDER BY id LIMIT 2;             -- page 1
SELECT id, name FROM t ORDER BY id LIMIT 2 OFFSET 2;    -- page 2
SELECT id, name FROM t ORDER BY id OFFSET 4;            -- everything after row 4`,
        output: ` id | name
----+------
 1  | a
 2  | b
(2 rows)

 id | name
----+------
 3  | c
 4  | d
(2 rows)

 id | name
----+------
 5  | e
(1 row)`,
        explain: '`LIMIT 2` returns the first 2 rows of the ordered result. `LIMIT 2 OFFSET 2` skips those 2 and returns the next 2 (a page-2). `OFFSET 4` with no `LIMIT` skips 4 and returns everything after — here just row 5. The database still generates the ordered result and walks past the skipped rows; `OFFSET` does not "seek".',
        explainHi: '`LIMIT 2` ordered result ki pehli 2 rows lautata hai. `LIMIT 2 OFFSET 2` un 2 ko skip karke agli 2 lautata hai (ek page-2). `OFFSET 4` bina `LIMIT` ke 4 skip karke baaki sab lautata hai — yahaan sirf row 5. Database abhi bhi ordered result generate karta hai aur skipped rows se aage chalta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "latest 10 signups"
SELECT id, email FROM users LIMIT 10;
-- returns 10 rows in an arbitrary order that is NOT necessarily the newest,
-- and the set can change between identical runs`,
        right: `SELECT id, email FROM users
ORDER BY created_at DESC, id DESC
LIMIT 10;`,
        why: 'LIMIT slices the result, but without ORDER BY there is no defined result order to slice — the database returns whichever 10 rows are cheapest to produce, which is not "the latest" and is not stable. On a small table it often coincidentally looks like insertion order, so the bug ships and only surfaces later when the plan changes. Any query that takes a top-N or a page must have an ORDER BY that fully determines the order, ending in a unique column so ties cannot reshuffle.',
        whyHi: 'LIMIT result ko slice karta hai, par ORDER BY ke bina slice karne ke liye koi defined result order nahi hai — database jo bhi 10 rows produce karna sabse sasta hai wo lautata hai, jo "latest" nahi hai aur stable nahi hai. Ek chhote table par ye aksar insertion order jaisa dikhता hai, to bug ship ho jaता hai. Koi bhi query jo ek top-N ya ek page leti hai use ek ORDER BY chahiye jo order poori tarah determine kare.',
      },
      {
        wrong: `-- paginating by a non-unique key
SELECT id, title FROM article
ORDER BY published_on DESC
LIMIT 20 OFFSET 20;
-- many articles share a published_on -> the tie order is arbitrary ->
-- a row can appear on both page 1 and page 2, or on neither`,
        right: `SELECT id, title FROM article
ORDER BY published_on DESC, id DESC     -- unique tiebreaker
LIMIT 20 OFFSET 20;`,
        why: 'When the sort key is not unique, rows with the same value are returned in an undefined and unstable order. With LIMIT/OFFSET pagination that is a real bug: the database might place a tied row at position 20 on one request and position 21 on the next, so it shows up on two pages or is skipped. Ending ORDER BY with a unique column (the primary key) makes the total order deterministic, so pages tile correctly. This also matters for reproducible exports and for keyset pagination, which needs a unique cursor.',
        whyHi: 'Jab sort key unique nahi hai, ek hi value waali rows ek undefined aur unstable order mein lautayi jaati hain. LIMIT/OFFSET pagination ke saath ye ek real bug hai: database ek tied row ko ek request par position 20 par aur agle par 21 par rakh sakta hai, to wo do pages par dikhती hai ya skip ho jaती hai. \`ORDER BY\` ko ek unique column se khatam karna total order ko deterministic banata hai.',
      },
      {
        wrong: `-- deep pagination with OFFSET
SELECT * FROM event ORDER BY id LIMIT 50 OFFSET 500000;
-- the database reads and discards 500,000 rows first -> slow, and gets
-- slower every page; concurrent inserts also shift every offset`,
        right: `-- keyset: remember the last id, ask for rows after it
SELECT * FROM event
WHERE id > :last_seen_id      -- from the previous page's last row
ORDER BY id
LIMIT 50;
-- with an index on id this reads exactly 50 rows, any page, any depth`,
        why: 'OFFSET does not skip work — the database still generates the ordered result and walks past every offset row, discarding it, before returning the page. Cost grows linearly with the page number, so late pages are dramatically slower, and because offsets are positional, an insert or delete between requests shifts every subsequent page and users see duplicates or missing rows. Keyset pagination filters by the sort key of the last row seen (WHERE key > last_key), so with a matching index each page is a constant-time index range scan regardless of how deep you are, and it is immune to concurrent inserts. The one thing it gives up is jumping to an arbitrary page number.',
        whyHi: 'OFFSET kaam skip nahi karta — database abhi bhi ordered result generate karta hai aur har offset row se aage chalता hai, use discard karke, page lautane se pehle. Cost page number ke saath linearly badhती hai. Aur kyunki offsets positional hain, requests ke beech ek insert ya delete har agle page ko shift karता hai aur users duplicates dekhते hain. Keyset pagination dikhi gayi aakhri row ki sort key se filter karता hai, to ek matching index ke saath har page ek constant-time index range scan hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every paginated list ends `ORDER BY <sort>, id`** — a lint rule flags any `ORDER BY` feeding a `LIMIT` that does not end in a unique column, because a non-total order plus pagination is a duplicate-or-skip bug waiting to happen.',
        hi: '**Har paginated list `ORDER BY <sort>, id` se khatam hoती hai** — ek lint rule kisi bhi `ORDER BY` ko flag karता hai jo ek `LIMIT` feed karता hai aur ek unique column se khatam nahi hota.',
      },
      {
        en: '**Infinite-scroll feeds use keyset pagination with a `(created_at, id)` cursor** and a matching composite index — page 500 loads as fast as page 1, and new posts arriving mid-scroll do not cause the "I keep seeing the same item" glitch that `OFFSET` produces.',
        hi: '**Infinite-scroll feeds ek `(created_at, id)` cursor ke saath keyset pagination istemal karte hain** aur ek matching composite index — page 500 page 1 jitni tez load hoती hai.',
      },
      {
        en: '**Admin tables with "jump to page N" keep `OFFSET` but cap the result set** — the query is `... LIMIT 50 OFFSET :n` only after a `WHERE` that filters to at most a few thousand rows, so the offset never gets deep enough to hurt.',
        hi: '**"page N par jump" waale admin tables `OFFSET` rakhते hain par result set cap karते hain** — query ek `WHERE` ke baad hi `... LIMIT 50 OFFSET :n` hai jo zyaada se zyaada kuch hazaar rows tak filter karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must a query that uses `LIMIT` also have an `ORDER BY`, and why should that `ORDER BY` end in a unique column?',
        qHi: 'Ek query jo `LIMIT` istemal karti hai use `ORDER BY` bhi kyun chahiye, aur wo `ORDER BY` ek unique column se kyun khatam hona chahiye?',
        a: 'The relational model says a table is an unordered set, so a SELECT without ORDER BY has no guaranteed row order — the engine returns rows in whatever order the chosen plan produces them, which varies with indexes, physical layout, statistics, and server version. LIMIT then takes "the first n" of that undefined order, which means you get an arbitrary n rows, not the ones you meant, and re-running the query can return a different set. So any top-N or paged query needs an ORDER BY that expresses the intended order. That ORDER BY should end in a unique column, normally the primary key, because if the sort keys you named are not unique, rows that tie on all of them come back in an undefined and unstable order. Under pagination that is a correctness bug: a tied row can land at position 20 on one request and position 21 on the next, so it appears on two consecutive pages or is skipped entirely, and identical exports come out in different orders. Adding the primary key as the final sort key makes the order total and deterministic, so pages tile without overlap or gaps and results are reproducible. Keyset pagination needs this too, since its cursor has to be a unique value to unambiguously mark "everything after this row".',
        aHi: 'Relational model kehta hai ek table ek unordered set hai, to ek SELECT bina ORDER BY ke koi guaranteed row order nahi hai — engine rows ko jis order mein chuna plan unhe produce karता hai us order mein lautata hai, jo indexes, physical layout, statistics, aur server version ke saath badalता hai. LIMIT phir us undefined order ke "pehle n" leta hai, jiska matlab aapko ek arbitrary n rows milती hain, wo nahi jo aapka matlab tha. To koi bhi top-N ya paged query ko ek ORDER BY chahiye. Wo ORDER BY ek unique column se khatam hona chahiye, aam taur par primary key, kyunki agar aapne jo sort keys naam ki wo unique nahi hain, un sab par tie karne waali rows ek undefined aur unstable order mein aati hain. Pagination ke tahat ye ek correctness bug hai: ek tied row ek request par position 20 par aur agle par 21 par aa sakti hai, to wo do pages par dikhती hai ya skip ho jaती hai. Primary key ko final sort key ke roop mein add karna order ko total aur deterministic banata hai.',
      },
      {
        q: 'Explain why `OFFSET` pagination degrades on deep pages, and what keyset pagination does instead.',
        qHi: 'Deep pages par `OFFSET` pagination kyun degrade hoती hai, aur keyset pagination iske bजाy kya karता hai, samjhाओ.',
        a: 'OFFSET does not seek to a position; it produces the full ordered result and then reads and discards rows one by one until it has skipped the offset count, then returns the next limit rows. So LIMIT 20 OFFSET 100000 makes the database materialise and walk past 100,000 rows it will throw away. The cost is linear in the page number, so page 5,000 is thousands of times more expensive than page 1. There is a second problem: offsets are positional, so if rows are inserted or deleted between two page requests, every subsequent offset shifts, and the user sees the same row twice or misses one. Keyset pagination, also called cursor or seek pagination, replaces "skip N rows" with "give me rows after this specific row". You order by a unique-ending key, remember the key values of the last row on the current page, and the next page is a WHERE clause: key greater than the last key seen, same ORDER BY, same LIMIT. With an index on the sort key, each page is a constant-time index range scan no matter how deep, and because it anchors on a value rather than a position, concurrent inserts and deletes do not cause duplicates or gaps. The tradeoff is that you can only go next and previous, not jump to page 500, so it fits infinite scroll and "load more" but not a numbered pager over an unbounded set.',
        aHi: 'OFFSET ek position par seek nahi karता; ye poora ordered result produce karता hai aur phir rows ko ek-ek karke padhता aur discard karता hai jab tak offset count skip na ho jaaye, phir agli limit rows lautata hai. To LIMIT 20 OFFSET 100000 database ko 100,000 rows materialise aur unse aage chalne par majboor karता hai jo wo phenk degा. Cost page number mein linear hai. Ek doosri problem hai: offsets positional hain, to agar rows insert ya delete hoती hain do page requests ke beech, har agla offset shift hoता hai. Keyset pagination "N rows skip karo" ko "is specific row ke baad ki rows do" se replace karता hai. Aap ek unique-ending key se order karते ho, current page ki aakhri row ke key values yaad rakhते ho, aur agla page ek WHERE clause hai. Sort key par ek index ke saath, har page ek constant-time index range scan hai chahे jitna gehra ho. Tradeoff ye hai ki aap sirf next aur previous ja sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Table `player(id int, name text, score int)` with 8 rows where at least two players share a `score`. Run `SELECT name, score FROM player ORDER BY score DESC LIMIT 3` a few times mentally — note the tied rows could come in any order. Then run `... ORDER BY score DESC, id ASC LIMIT 3` and confirm it is now a single deterministic top-3.',
        taskHi: 'Table `player(id int, name text, score int)` 8 rows ke saath jahaan kam se kam do players ek `score` share karte hain. `ORDER BY score DESC LIMIT 3` chalao — tied rows kisi bhi order mein aa sakti hain. Phir `... ORDER BY score DESC, id ASC LIMIT 3`.',
        hint: 'The `id ASC` final key breaks score ties so exactly one row is "third". Without it, which of the tied rows is included in the top-3 is undefined.',
        hintHi: '`id ASC` final key score ties break karता hai to theek ek row "third" hai. Iske bina, tied rows mein se kaunsi top-3 mein hai undefined hai.',
      },
      {
        task: 'Table `log(id serial primary key, msg text)` with 25 rows. Fetch "page 3, page size 10" two ways: (a) `ORDER BY id LIMIT 10 OFFSET 20`; (b) keyset — first get page 2\'s last id with `ORDER BY id LIMIT 10 OFFSET 10`, then `WHERE id > :that_id ORDER BY id LIMIT 10`. Confirm both return rows 21-25 (only 5 left). Note which one would still be fast at OFFSET 20,000,000.',
        taskHi: 'Table `log(id serial primary key, msg text)` 25 rows ke saath. "page 3, page size 10" do tareeke se fetch karo: (a) `OFFSET 20`; (b) keyset. Confirm dono rows 21-25 lautate hain. Note karo kaunsa OFFSET 20,000,000 par bhi fast hoga.',
        hint: 'Both return the same 5 rows here. At huge depth, (a) reads and discards 20M rows every call; (b) uses the primary-key index to seek directly to `id > :cursor` and reads only the page.',
        hintHi: 'Dono yahaan wahi 5 rows lautate hain. Bade depth par, (a) har call 20M rows padhता aur discard karता hai; (b) primary-key index istemal karता hai.',
      },
      {
        task: 'Table `item(name text, rating numeric)` with some `NULL` ratings. Write the query for "best-rated first, unrated items always at the very bottom, ties broken alphabetically by name". Confirm the `NULL`-rating rows appear last regardless of `ASC`/`DESC` on rating.',
        taskHi: 'Table `item(name text, rating numeric)` kuch `NULL` ratings ke saath. "best-rated first, unrated hamesha bilkul neeche, ties name se alphabetically" ke liye query likho. Confirm `NULL`-rating rows last dikhते hain.',
        hint: '`ORDER BY rating DESC NULLS LAST, name ASC`. The explicit `NULLS LAST` overrides Postgres\'s default (which for `DESC` would put NULLs first).',
        hintHi: '`ORDER BY rating DESC NULLS LAST, name ASC`. Explicit `NULLS LAST` Postgres ke default ko override karता hai.',
      },
    ],

    keyTakeaways: [
      'A table is an UNORDERED SET — a `SELECT` without `ORDER BY` has NO guaranteed row order (it depends on the plan / layout / version and can change silently). "Give me any 10" via `LIMIT` alone returns an arbitrary, unstable 10.',
      'Sort keys: a COLUMN (`ORDER BY name`), an EXPRESSION (`ORDER BY lower(email)`), a SELECT-list ALIAS (`ORDER BY total` — visible here because `ORDER BY` runs after `SELECT`, Lesson 6), a POSITION (`ORDER BY 2, 1` — terse + fragile, avoid), a `CASE` (custom order).',
      'Each key has its own `ASC` (default) / `DESC`. `NULL` placement (PostgreSQL): `NULL` sorts as LARGEST -> `ASC` = `NULLS LAST`, `DESC` = `NULLS FIRST`. Write `NULLS FIRST` / `NULLS LAST` explicitly when placement is a requirement (other DBs differ).',
      'TIES: rows equal on every sort key come back in an UNDEFINED, NON-STABLE order — re-running can reorder them, and with `LIMIT` a row can hit page 2 then page 3, or vanish. ALWAYS end `ORDER BY` with a UNIQUE column (the PK) -> a TOTAL, deterministic order.',
      '`LIMIT n` (at most n rows of the ordered result; `LIMIT 0` = none), `OFFSET m` (skip the first m; legal without `LIMIT`), `FETCH FIRST n ROWS ONLY` (SQL-standard; `WITH TIES` also returns rows tied with the n-th). Clause order: `ORDER BY ... LIMIT ... OFFSET ...`.',
      '`OFFSET m` does NOT seek — the DB produces the ordered result and READS + DISCARDS the first m rows, then returns the page. Cost grows LINEARLY with the page number -> deep pages are dramatically slower. Concurrent inserts/deletes shift every offset -> users see duplicates / gaps.',
      'KEYSET (cursor) pagination: remember the last row\'s sort-key values, next page = `WHERE (k1, k2) < (:last_k1, :last_k2) ORDER BY k1 DESC, k2 DESC LIMIT n`. With a matching index -> constant-time per page at ANY depth, immune to concurrent writes. Tradeoff: only next/prev, no jump-to-page-N.',
      'Default: keyset for user-facing infinite scroll / "load more"; `OFFSET` only for small BOUNDED result sets (e.g. after a `WHERE` that caps rows to a few thousand). Module 10 covers pagination in depth.',
    ],
    keyTakeawaysHi: [
      'Ek table ek UNORDERED SET hai — `ORDER BY` ke bina ek `SELECT` ka KOI guaranteed row order NAHI (plan / layout / version par nirbhar, chupchaap badal sakta hai). Akele `LIMIT` se "koi bhi 10" ek arbitrary, unstable 10 lautata hai.',
      'Sort keys: ek COLUMN, ek EXPRESSION, ek SELECT-list ALIAS (yahaan visible kyunki `ORDER BY` `SELECT` ke baad chalता hai), ek POSITION (`ORDER BY 2, 1` — fragile, avoid), ek `CASE`.',
      'Har key ka apna `ASC` / `DESC`. `NULL` placement (PostgreSQL): `NULL` LARGEST sort hota hai -> `ASC` = `NULLS LAST`, `DESC` = `NULLS FIRST`. Placement requirement hai to explicitly likho.',
      'TIES: har sort key par barabar rows ek UNDEFINED, NON-STABLE order mein aati hain -> `LIMIT` ke saath ek row page 2 phir page 3 par aa sakti hai ya gायab. HAMESHA `ORDER BY` ko ek UNIQUE column (PK) se khatam karo.',
      '`LIMIT n`, `OFFSET m` (pehli m skip; `LIMIT` ke bina legal), `FETCH FIRST n ROWS ONLY` (SQL-standard). Clause order: `ORDER BY ... LIMIT ... OFFSET ...`.',
      '`OFFSET m` seek NAHI karता — DB ordered result produce karता hai aur pehli m rows PADHता + DISCARD karता hai. Cost page number ke saath LINEARLY badhती hai. Concurrent inserts/deletes har offset shift karते hain -> duplicates / gaps.',
      'KEYSET pagination: aakhri row ki sort-key values yaad rakho, agla page = `WHERE (k1, k2) < (:last_k1, :last_k2) ORDER BY ... LIMIT n`. Ek matching index ke saath -> KISI bhi depth par prati page constant-time. Tradeoff: sirf next/prev.',
      'Default: user-facing infinite scroll ke liye keyset; `OFFSET` sirf chhote BOUNDED result sets ke liye. Module 10 pagination ko detail mein cover karta hai.',
    ],
  },

  {
    slug: 'sql-logical-query-processing-order',
    title: 'How a `SELECT` Really Runs: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`',
    titleHi: 'Ek `SELECT` Asal Mein Kaise Chalta Hai: Logical Processing Order',
    description: 'You write `SELECT ... FROM ... WHERE ...` but the database evaluates the clauses in a different order: `FROM` first, then `WHERE`, then `GROUP BY`, then `HAVING`, then the `SELECT` list, then `DISTINCT`, then `ORDER BY`, then `LIMIT`. This order explains every "why can\'t I use my alias here" and "why is this in `HAVING` not `WHERE`" question.',
    descriptionHi: 'Aap `SELECT ... FROM ... WHERE ...` likhte ho par database clauses ko ek alag order mein evaluate karta hai: pehle `FROM`, phir `WHERE`, phir `GROUP BY`, phir `HAVING`, phir `SELECT` list, phir `DISTINCT`, phir `ORDER BY`, phir `LIMIT`. Ye order har "yahaan main apna alias kyun nahi istemal kar sakta" aur "ye `WHERE` nahi `HAVING` mein kyun hai" sawaal explain karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A kitchen where the order the courses are written on the ticket is not the order they are cooked.** The ticket reads "plate up, garnish, sear the fish, take from the walk-in, discard the trimmings" — but the line does not start by plating. It works bottom-up: **take the ingredients out** (`FROM` — assemble the source rows), **discard what you will not use** (`WHERE` — drop rows), **portion into batches** (`GROUP BY`), **reject whole batches that fail spec** (`HAVING`), **cook and plate each portion** (`SELECT` — compute the output columns), **remove duplicate plates** (`DISTINCT`), **arrange them in serving order** (`ORDER BY`), **send out only the first four** (`LIMIT`). Now the puzzles solve themselves: you cannot garnish with an ingredient you have not taken out yet — a name you invent in `SELECT` (an alias) does not exist when `WHERE` runs, because `WHERE` happened first. But `ORDER BY` runs *after* plating, so it *can* arrange by the plated dish. And a spec check on a whole batch ("total weight over 2kg") has to be `HAVING`, because the batches do not exist until `GROUP BY`.',
      hi: '**Ek kitchen jahaan ticket par courses jis order mein likhे hain wo order nahi jismें wo pakाye jaate hain.** Ticket kehta hai "plate up, garnish, fish sear karo, walk-in se lo, trimmings phenk do" — par line plating se shuru nahi karти. Ye bottom-up kaam karти hai: **ingredients bahar nikालो** (`FROM` — source rows assemble karo), **jo istemal nahi karोge use phenk do** (`WHERE` — rows drop karo), **batches mein portion karo** (`GROUP BY`), **poore batches reject karo jo spec fail karते hain** (`HAVING`), **har portion cook aur plate karो** (`SELECT` — output columns compute karो), **duplicate plates hatाओ** (`DISTINCT`), **serving order mein arrange karो** (`ORDER BY`), **sirf pehle chaar bhejो** (`LIMIT`). Ab puzzles khud solve ho jaate hain: aap ek ingredient se garnish nahi kar sakte jo aapne abhi tak bahar nahi nikाला — ek name jo aap `SELECT` mein invent karते ho (ek alias) `WHERE` chalте samay maujood nahi hai. Par `ORDER BY` plating ke *baad* chalता hai, to ye plated dish se arrange kar *sakта* hai.',
    },

    simple: `**Written order vs evaluation order**

\`\`\`
you WRITE:        SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...

DB EVALUATES:    1. FROM  + JOIN      -> assemble the working set of rows
                 2. WHERE             -> drop rows (row-level filter, no aggregates)
                 3. GROUP BY          -> collapse rows into groups
                 4. HAVING            -> drop groups (group-level filter, aggregates allowed)
                 5. SELECT list       -> compute output columns + assign aliases
                 6. DISTINCT          -> remove duplicate output rows
                 7. ORDER BY          -> sort (can see SELECT aliases)
                 8. LIMIT / OFFSET    -> take a slice
\`\`\`

**Consequence 1: \`WHERE\` cannot see a \`SELECT\` alias (step 2 is before step 5)**

\`\`\`sql
SELECT price * qty AS total FROM sale WHERE total > 100;   -- ERROR: column "total" does not exist
SELECT price * qty AS total FROM sale WHERE price * qty > 100;   -- repeat the expression
-- (or wrap in a subquery / CTE and filter the outer query -- Module 5)
\`\`\`

**Consequence 2: \`ORDER BY\` CAN see a \`SELECT\` alias (step 7 is after step 5)**

\`\`\`sql
SELECT price * qty AS total FROM sale ORDER BY total DESC;   -- fine
\`\`\`

**Consequence 3: filter rows in \`WHERE\`, filter groups in \`HAVING\`**

\`\`\`sql
SELECT dept, count(*) AS n
FROM employee
WHERE active                     -- row filter: runs BEFORE grouping
GROUP BY dept
HAVING count(*) > 5;             -- group filter: needs the groups to exist -> aggregate goes here
\`\`\`

**Consequence 4: \`SELECT\` / \`GROUP BY\` — every non-aggregated column must be grouped**

\`\`\`sql
SELECT dept, name FROM employee GROUP BY dept;
-- ERROR: column "name" must appear in the GROUP BY clause or be used in an aggregate
-- because a group can contain many different 'name' values -- which one would it show?
\`\`\`

**Consequence 5: \`SELECT DISTINCT\` + \`ORDER BY\` — the sort expr must be in the select list**

\`\`\`sql
SELECT DISTINCT category FROM product ORDER BY price;
-- ERROR: for SELECT DISTINCT, ORDER BY expressions must appear in select list
-- DISTINCT (step 6) already collapsed the rows -> 'price' is gone before ORDER BY (step 7) runs
\`\`\``,

    simpleHi: `**Likha order vs evaluation order**

\`\`\`
aap LIKHTE ho:   SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...

DB EVALUATE:     1. FROM  + JOIN      -> rows ka working set assemble karo
                 2. WHERE             -> rows drop karo (row-level filter, koi aggregates nahi)
                 3. GROUP BY          -> rows ko groups mein collapse karo
                 4. HAVING            -> groups drop karo (group-level filter, aggregates allowed)
                 5. SELECT list       -> output columns compute karo + aliases assign karo
                 6. DISTINCT          -> duplicate output rows hatao
                 7. ORDER BY          -> sort karo (SELECT aliases dekh sakta hai)
                 8. LIMIT / OFFSET    -> ek slice lo
\`\`\`

**Consequence 1: \`WHERE\` ek \`SELECT\` alias nahi dekh sakta (step 2, step 5 se pehle)**

\`\`\`sql
SELECT price * qty AS total FROM sale WHERE total > 100;   -- ERROR: column "total" does not exist
SELECT price * qty AS total FROM sale WHERE price * qty > 100;   -- expression repeat karo
\`\`\`

**Consequence 2: \`ORDER BY\` ek \`SELECT\` alias DEKH SAKTA hai (step 7, step 5 ke baad)**

\`\`\`sql
SELECT price * qty AS total FROM sale ORDER BY total DESC;   -- theek
\`\`\`

**Consequence 3: rows \`WHERE\` mein filter karo, groups \`HAVING\` mein**

\`\`\`sql
SELECT dept, count(*) AS n
FROM employee
WHERE active                     -- row filter: grouping se PEHLE chalता hai
GROUP BY dept
HAVING count(*) > 5;             -- group filter: groups ke maujood hone ki zaroorat -> aggregate yahaan
\`\`\`

**Consequence 4: \`SELECT\` / \`GROUP BY\` — har non-aggregated column grouped hona chahiye**

\`\`\`sql
SELECT dept, name FROM employee GROUP BY dept;
-- ERROR: column "name" must appear in the GROUP BY clause or be used in an aggregate
-- kyunki ek group mein kई alag 'name' values ho sakti hain -- kaunsi dikhाe?
\`\`\`

**Consequence 5: \`SELECT DISTINCT\` + \`ORDER BY\` — sort expr select list mein hona chahiye**

\`\`\`sql
SELECT DISTINCT category FROM product ORDER BY price;
-- ERROR: for SELECT DISTINCT, ORDER BY expressions must appear in select list
-- DISTINCT (step 6) ne rows collapse kar di -> 'price' ORDER BY (step 7) se pehle chala gaya
\`\`\``,

    content: `## The clause order you write is not the order it runs

Every \`SELECT\` is written in a fixed clause order — \`SELECT\`, \`FROM\`, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, \`ORDER BY\`, \`LIMIT\` — but the database evaluates it in a *different* fixed order, called the **logical query processing order**:

1. **\`FROM\` / \`JOIN\`** — start from the base tables, apply joins, produce a combined set of rows. (Subqueries in \`FROM\` and CTEs are resolved here.)
2. **\`WHERE\`** — evaluate the condition per row; keep rows where it is \`TRUE\`. Only column values are available; no aggregates, no \`SELECT\` aliases.
3. **\`GROUP BY\`** — partition the surviving rows into groups, one per distinct combination of the grouping expressions. After this step you are working with *groups*, not rows.
4. **\`HAVING\`** — evaluate a condition per group; keep groups where it is \`TRUE\`. Aggregates (\`count\`, \`sum\`, …) are available because the groups now exist.
5. **\`SELECT\` list** — compute each output expression (one value per group if grouped, else per row) and bind the column aliases.
6. **\`DISTINCT\`** — remove duplicate output rows (comparing the full \`SELECT\` list).
7. **\`ORDER BY\`** — sort the output rows. Can reference \`SELECT\` aliases and output columns, because they now exist.
8. **\`LIMIT\` / \`OFFSET\`** (or \`FETCH\`) — take a slice of the sorted output.

(Window functions, if present, are computed between step 5's row set and step 6 — after \`GROUP BY\`/\`HAVING\`, which is why a window function can see aggregate results but cannot itself be used in \`WHERE\`/\`HAVING\`. Module 6.)

## Why the "can't use my alias" errors happen

An alias defined in the \`SELECT\` list (\`... AS total\`) is bound in **step 5**. Any clause that runs *earlier* cannot see it:

- **\`WHERE\`** (step 2) — \`WHERE total > 100\` fails. Repeat the expression (\`WHERE price * qty > 100\`), or push the computation into a subquery/CTE and filter the outer query.
- **\`GROUP BY\`** (step 3) — in standard SQL you cannot \`GROUP BY total\` either; repeat the expression. (PostgreSQL *does* allow a \`SELECT\` alias in \`GROUP BY\` as an extension, but not in \`WHERE\`.)
- **\`HAVING\`** (step 4) — same; repeat the aggregate expression.

Any clause that runs *later* can see it:

- **\`ORDER BY\`** (step 7) — \`ORDER BY total DESC\` is fine, and idiomatic.
- \`DISTINCT\` implicitly operates on the computed \`SELECT\` list.

## \`WHERE\` vs \`HAVING\`

They are both filters, at different stages:

- **\`WHERE\` filters rows, before grouping.** Use it for conditions on plain column values (\`status = 'active'\`, \`created_at >= '2026-01-01'\`). Filtering here also makes the query faster — fewer rows reach \`GROUP BY\`.
- **\`HAVING\` filters groups, after grouping.** Use it for conditions on aggregates (\`count(*) > 5\`, \`sum(amount) > 1000\`, \`avg(score) < 50\`). An aggregate cannot appear in \`WHERE\` because at step 2 the groups do not exist yet.

Rule of thumb: **if the condition mentions an aggregate function, it goes in \`HAVING\`; otherwise it goes in \`WHERE\`.** Putting a non-aggregate condition in \`HAVING\` usually works but is slower and misleading; putting an aggregate in \`WHERE\` is an error.

## \`GROUP BY\` and the "must appear in GROUP BY" rule

Once you group, each output row represents a *group* of input rows. Every column in the \`SELECT\` list must therefore be either (a) one of the grouping expressions, or (b) inside an aggregate function — because for any other column, the group contains many values and there is no single answer. \`SELECT dept, name FROM employee GROUP BY dept\` is rejected: which of the many \`name\`s in the "eng" group should the one output row show? (Standard SQL and PostgreSQL reject it. MySQL historically returned an arbitrary value with \`ONLY_FULL_GROUP_BY\` disabled — a frequent source of wrong results.)

There is one refinement: if you group by a table's primary key, PostgreSQL lets you \`SELECT\` any other column of that table ungrouped, because the key functionally determines them.

## \`SELECT DISTINCT\` + \`ORDER BY\`

\`DISTINCT\` (step 6) collapses the output rows down to the distinct combinations of the \`SELECT\` list. \`ORDER BY\` (step 7) then runs on that collapsed set. So \`ORDER BY\` can only reference values that survived \`DISTINCT\` — i.e. things in the \`SELECT\` list. \`SELECT DISTINCT category FROM product ORDER BY price\` is an error: after \`DISTINCT category\` there is no \`price\` left to sort by. Add \`price\` to the select list (which changes what "distinct" means), or drop \`DISTINCT\` and use \`GROUP BY category\` with \`min(price)\` if you wanted "distinct categories, ordered by their cheapest product".

## Why this matters beyond errors

Knowing the order lets you predict *what a query does* and *why it is slow*:

- A \`WHERE\` that eliminates 99% of rows before \`GROUP BY\`/\`ORDER BY\`/\`JOIN\` amplification is worth far more than the same condition in \`HAVING\`.
- \`ORDER BY\` + \`LIMIT\` at the end means the database may still have to sort the *entire* intermediate result before taking the top N — unless an index provides the order (Module 10).
- A scalar subquery in the \`SELECT\` list is evaluated once per output row, at step 5 — so an expensive one inside a query that returns 100k rows runs 100k times.`,

    contentHi: `## Jo clause order aap likhte ho wo order nahi jismें ye chalता hai

Har \`SELECT\` ek fixed clause order mein likhा jaता hai — \`SELECT\`, \`FROM\`, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, \`ORDER BY\`, \`LIMIT\` — par database ise ek *alag* fixed order mein evaluate karता hai, jise **logical query processing order** kehte hain:

1. **\`FROM\` / \`JOIN\`** — base tables se shuru karo, joins apply karo, rows ka ek combined set produce karo.
2. **\`WHERE\`** — prati row condition evaluate karo; un rows ko rakho jahaan ye \`TRUE\` hai. Sirf column values available; koi aggregates nahi, koi \`SELECT\` aliases nahi.
3. **\`GROUP BY\`** — bachी rows ko groups mein partition karo. Iske baad aap *groups* ke saath kaam kar rahe ho, rows ke nahi.
4. **\`HAVING\`** — prati group condition evaluate karo. Aggregates available hain kyunki groups ab maujood hain.
5. **\`SELECT\` list** — har output expression compute karo aur column aliases bind karo.
6. **\`DISTINCT\`** — duplicate output rows hatao.
7. **\`ORDER BY\`** — output rows sort karo. \`SELECT\` aliases reference kar sakta hai.
8. **\`LIMIT\` / \`OFFSET\`** — sorted output ka ek slice lo.

(Window functions step 5 ke row set aur step 6 ke beech compute hote hain — Module 6.)

## "alias istemal nahi kar sakta" errors kyun hote hain

\`SELECT\` list mein define kiya ek alias **step 5** mein bind hota hai. Koi bhi clause jo *pehle* chalता hai use nahi dekh sakta:

- **\`WHERE\`** (step 2) — \`WHERE total > 100\` fail hota hai. Expression repeat karo, ya computation ko ek subquery/CTE mein push karo.
- **\`GROUP BY\`** (step 3) — standard SQL mein aap \`GROUP BY total\` bhi nahi kar sakte. (PostgreSQL \`GROUP BY\` mein ek alias allow karता hai ek extension ke roop mein, par \`WHERE\` mein nahi.)
- **\`HAVING\`** (step 4) — same.

Koi bhi clause jo *baad mein* chalता hai use dekh sakta hai:

- **\`ORDER BY\`** (step 7) — \`ORDER BY total DESC\` theek hai, aur idiomatic.

## \`WHERE\` vs \`HAVING\`

Dono filters hain, alag stages par:

- **\`WHERE\` rows filter karता hai, grouping se pehle.** Plain column values par conditions ke liye istemal karo. Yahaan filter karna query ko tez bhi banata hai.
- **\`HAVING\` groups filter karता hai, grouping ke baad.** Aggregates par conditions ke liye istemal karo (\`count(*) > 5\`). Ek aggregate \`WHERE\` mein nahi aa sakta kyunki step 2 par groups abhi maujood nahi.

Angoothे ka niyam: **agar condition ek aggregate function mention karता hai, ye \`HAVING\` mein jaता hai; warna \`WHERE\` mein.**

## \`GROUP BY\` aur "must appear in GROUP BY" niyam

Ek baar aap group karते ho, har output row input rows ke ek *group* ko represent karता hai. \`SELECT\` list ka har column isliye ya (a) grouping expressions mein se ek, ya (b) ek aggregate function ke andar hona chahिए — kyunki kisi doosre column ke liye, group mein kई values hain. \`SELECT dept, name FROM employee GROUP BY dept\` reject hota hai. (Standard SQL aur PostgreSQL ise reject karте hain. MySQL historically ek arbitrary value lautaता tha — galat results ka ek frequent source.)

## \`SELECT DISTINCT\` + \`ORDER BY\`

\`DISTINCT\` (step 6) output rows ko \`SELECT\` list ke distinct combinations tak collapse karता hai. \`ORDER BY\` (step 7) phir us collapsed set par chalता hai. To \`ORDER BY\` sirf un values ko reference kar sakta hai jo \`DISTINCT\` se bachीं. \`SELECT DISTINCT category FROM product ORDER BY price\` ek error hai.

## Ye errors ke aage kyun maayne rakhता hai

Order janna aapको predict karne deता hai ki *ek query kya karती hai* aur *ye kyun slow hai*:
- Ek \`WHERE\` jo \`GROUP BY\`/\`ORDER BY\`/\`JOIN\` amplification se pehle 99% rows eliminate karता hai wahi condition \`HAVING\` mein se bahut zyaada value ka hai.
- \`ORDER BY\` + \`LIMIT\` ant mein ka matlab database ko abhi bhi *poore* intermediate result ko sort karना pad sakta hai top N lene se pehle — jab tak ek index order na de (Module 10).
- \`SELECT\` list mein ek scalar subquery prati output row ek baar evaluate hota hai — to ek query jo 100k rows lautaती hai usme ek expensive one 100k baar chalता hai.`,

    examples: [
      {
        title: 'A SELECT alias works in ORDER BY but not in WHERE',
        titleHi: 'Ek SELECT alias ORDER BY mein kaam karta hai par WHERE mein nahi',
        code: `CREATE TABLE sale (id int, price numeric, qty int);
INSERT INTO sale VALUES (1, 10, 3), (2, 50, 1), (3, 2, 10), (4, 5, 4);

-- WHERE cannot see the alias -> repeat the expression there
-- ORDER BY runs after SELECT -> it CAN use the alias
SELECT id, price * qty AS total
FROM sale
WHERE price * qty > 25
ORDER BY total DESC;`,
        output: ` id | total
----+-------
 2  | 50
 1  | 30
(2 rows)`,
        explain: '`WHERE` runs at step 2, before the `SELECT` list (step 5) creates the alias `total`, so `WHERE` must repeat `price * qty` — it cannot see `total`. `ORDER BY` runs at step 7, after the `SELECT` list, so `ORDER BY total DESC` works and is the idiomatic form. Same expression, two clauses, opposite alias visibility.',
        explainHi: '`WHERE` step 2 par chalta hai, `SELECT` list (step 5) ke alias `total` banane se pehle, to `WHERE` ko `price * qty` repeat karna hoga — ye `total` nahi dekh sakta. `ORDER BY` step 7 par chalta hai, `SELECT` list ke baad, to `ORDER BY total DESC` kaam karta hai aur idiomatic form hai.',
      },
      {
        title: 'WHERE filters rows before grouping; HAVING filters groups after',
        titleHi: 'WHERE grouping se pehle rows filter karta hai; HAVING baad mein groups',
        code: `CREATE TABLE ordr (cust text, amount int, refunded boolean);
INSERT INTO ordr VALUES
  ('a', 10, false), ('a', 20, false), ('a', 5, true),
  ('b', 40, false), ('b', 50, false),
  ('c', 3, false);

SELECT cust, sum(amount) AS revenue, count(*) AS orders
FROM ordr
WHERE NOT refunded            -- row filter: the refunded order never reaches the group
GROUP BY cust
HAVING sum(amount) > 15       -- group filter: 'c' totals 3, so it is dropped
ORDER BY revenue DESC;`,
        output: ` cust | revenue | orders
------+---------+--------
 b    | 90      | 2
 a    | 30      | 2
(2 rows)`,
        explain: "`WHERE NOT refunded` runs BEFORE grouping (step 2), so the refunded order for `a` never reaches the group — `a`'s revenue is 30, not 35. `HAVING sum(amount) > 15` runs AFTER grouping (step 4), so `c` (total 3) is formed as a group and then dropped. Row filter vs group filter, two different stages.",
        explainHi: '`WHERE NOT refunded` grouping se PEHLE chalta hai (step 2), to `a` ke liye refunded order group tak kabhi nahi pahunchता — `a` ka revenue 30 hai, 35 nahi. `HAVING sum(amount) > 15` grouping ke BAAD chalta hai (step 4), to `c` (total 3) ek group ke roop mein banti hai aur phir drop hoti hai.',
      },
      {
        title: 'SELECT DISTINCT then ORDER BY: sort by something in the select list',
        titleHi: 'SELECT DISTINCT phir ORDER BY: select list ki kisi cheez se sort karo',
        code: `CREATE TABLE product (name text, category text, price numeric);
INSERT INTO product VALUES
  ('x', 'tools', 30), ('y', 'tools', 10), ('z', 'food', 5), ('w', 'food', 8), ('v', 'toys', 20);

-- want: the distinct categories, ordered by their cheapest product.
-- SELECT DISTINCT category ORDER BY price is an ERROR (price is gone after DISTINCT).
-- use GROUP BY instead:
SELECT category, min(price) AS cheapest
FROM product
GROUP BY category
ORDER BY cheapest ASC;`,
        output: ` category | cheapest
----------+----------
 food     | 5
 tools    | 10
 toys     | 20
(3 rows)`,
        explain: '`SELECT DISTINCT category ORDER BY price` fails because `DISTINCT` (step 6) collapses the rows down to just `category`, so `price` no longer exists when `ORDER BY` (step 7) runs. The correct way to say "distinct categories, ordered by their cheapest product" is `GROUP BY category` with `min(price)` — now `cheapest` is a real output column `ORDER BY` can use.',
        explainHi: '`SELECT DISTINCT category ORDER BY price` fail hota hai kyunki `DISTINCT` (step 6) rows ko sirf `category` tak collapse karta hai, to `price` `ORDER BY` (step 7) chalte samay maujood nahi. "distinct categories, unke cheapest product se ordered" kehne ka sahi tareeka `GROUP BY category` `min(price)` ke saath hai.',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT customer_id, sum(amount) AS lifetime_value
FROM orders
WHERE lifetime_value > 1000       -- ERROR: column "lifetime_value" does not exist
GROUP BY customer_id;`,
        right: `SELECT customer_id, sum(amount) AS lifetime_value
FROM orders
GROUP BY customer_id
HAVING sum(amount) > 1000         -- aggregate condition -> HAVING, and repeat the expression
ORDER BY lifetime_value DESC;     -- alias is fine here`,
        why: 'Two things are wrong. First, the alias lifetime_value is created in the SELECT list, which is evaluated at step 5, long after WHERE (step 2), so WHERE cannot see it. Second, sum(amount) is an aggregate, and aggregates do not exist until after GROUP BY forms the groups (step 3), so the condition cannot go in WHERE at all — it belongs in HAVING (step 4). HAVING also cannot use the alias in standard SQL, so you repeat sum(amount). ORDER BY (step 7) runs after the SELECT list, so it is the one place the alias is usable.',
        whyHi: 'Do cheezein galat hain. Pehla, alias lifetime_value SELECT list mein banता hai (step 5), WHERE (step 2) ke baad, to WHERE ise nahi dekh sakta. Doosra, sum(amount) ek aggregate hai, aur aggregates GROUP BY ke groups banane (step 3) ke baad tak maujood nahi, to condition WHERE mein bilkul nahi ja sakti — ye HAVING mein hai. HAVING bhi standard SQL mein alias istemal nahi kar sakta, to aap sum(amount) repeat karte ho. ORDER BY (step 7) SELECT list ke baad chalता hai.',
      },
      {
        wrong: `SELECT dept, name, max(salary) AS top
FROM employee
GROUP BY dept;
-- ERROR: column "name" must appear in the GROUP BY clause or be used in an aggregate`,
        right: `-- if you want the name of the top earner per dept, that is a top-N-per-group
-- query -- use a window function (Module 6) or a correlated subquery (Module 5):
SELECT DISTINCT ON (dept) dept, name, salary AS top
FROM employee
ORDER BY dept, salary DESC;`,
        why: 'After GROUP BY dept, each output row stands for a whole department, and a department has many employees with many different names. There is no single name to put in that row, so SQL rejects the query rather than picking one arbitrarily. max(salary) is fine because an aggregate reduces the many salaries in the group to one value. To get the name that goes with the maximum salary you need a different tool: DISTINCT ON (Postgres), a window function like row_number() partitioned by dept, or a correlated subquery. MySQL with ONLY_FULL_GROUP_BY off would return some arbitrary name here, which is how silent data bugs happen.',
        whyHi: 'GROUP BY dept ke baad, har output row ek poore department ke liye khada hai, aur ek department mein kई alag names ke saath kई employees hain. Us row mein daalne ke liye koi single name nahi hai, to SQL query ko reject karता hai ek ko arbitrarily chunne ke bजाy. max(salary) theek hai kyunki ek aggregate group ki kई salaries ko ek value tak reduce karता hai. Maximum salary ke saath jaane waala name paane ke liye aapको ek alag tool chahिए: DISTINCT ON, ek window function, ya ek correlated subquery.',
      },
      {
        wrong: `SELECT o.id,
       (SELECT count(*) FROM order_line l WHERE l.order_id = o.id) AS line_count
FROM orders o
ORDER BY line_count DESC
LIMIT 10;
-- correct, but the subquery runs once PER ROW at step 5 -> once per order in the
-- whole table, because ORDER BY needs every line_count before it can sort + LIMIT`,
        right: `SELECT o.id, count(l.id) AS line_count
FROM orders o
LEFT JOIN order_line l ON l.order_id = o.id
GROUP BY o.id
ORDER BY line_count DESC
LIMIT 10;
-- one pass: the join + GROUP BY computes every count together, then sort + LIMIT`,
        why: 'A scalar subquery in the SELECT list is evaluated at step 5, once for every row that reaches that step. Because ORDER BY line_count then LIMIT 10 comes later (steps 7-8), the database must compute line_count for every order in the table before it can know which 10 are the top — the LIMIT does not save the subquery from running on all of them. Rewriting the per-row subquery as a JOIN plus GROUP BY lets the engine compute all the counts in a single aggregation pass. Understanding that SELECT-list expressions run per output row, and that ORDER BY/LIMIT run after, is what tells you the first query is O(rows) subquery executions.',
        whyHi: 'SELECT list mein ek scalar subquery step 5 par evaluate hota hai, har row ke liye ek baar jo us step tak pahunchती hai. Kyunki ORDER BY line_count phir LIMIT 10 baad mein aata hai (steps 7-8), database ko table ke har order ke liye line_count compute karना hoga ye jaanne se pehle ki kaunse 10 top hain — LIMIT subquery ko un sab par chalne se nahi bachaता. Per-row subquery ko ek JOIN plus GROUP BY ke roop mein rewrite karna engine ko ek single aggregation pass mein sabhi counts compute karne deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team style guide that says "aggregate conditions in `HAVING`, everything else in `WHERE`"** and forbids relying on PostgreSQL\'s `GROUP BY`-alias extension, so the same queries port cleanly to other engines.',
        hi: '**Ek team style guide jo kehता hai "aggregate conditions `HAVING` mein, baaki sab `WHERE` mein"** aur PostgreSQL ke `GROUP BY`-alias extension par bharosा karne se mana karता hai.',
      },
      {
        en: '**Reviewers reject `SELECT` lists with a scalar subquery on a query that can return many rows** — it is rewritten as a `JOIN` + `GROUP BY`, or a `LATERAL` join, once someone recognises the per-row execution from the processing order.',
        hi: '**Reviewers ek query par ek scalar subquery waale `SELECT` lists ko reject karте hain jo kई rows lauta sakti hai** — ise ek `JOIN` + `GROUP BY` ke roop mein rewrite kiya jaता hai.',
      },
      {
        en: '**"Filter early" as a performance principle** — push every non-aggregate predicate into `WHERE` (or a subquery\'s `WHERE`) so the row count is small *before* the expensive join, sort, or aggregation, which the processing order makes explicit.',
        hi: '**"Jaldi filter karो" ek performance principle ke roop mein** — har non-aggregate predicate ko `WHERE` mein push karो taaki expensive join, sort, ya aggregation se *pehle* row count chhota ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the logical query processing order, and why can you use a `SELECT` alias in `ORDER BY` but not in `WHERE`?',
        qHi: 'Logical query processing order kya hai, aur aap ek `SELECT` alias `ORDER BY` mein kyun istemal kar sakte ho par `WHERE` mein nahi?',
        a: 'Although you write a query as SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, the database evaluates the clauses in a different fixed order. First FROM and the joins assemble the working set of rows. Then WHERE filters those rows, using only column values — no aggregates, no aliases. Then GROUP BY collapses the surviving rows into groups. Then HAVING filters the groups, and here aggregates are allowed because the groups now exist. Then the SELECT list is computed, which is also where column aliases are bound. Then DISTINCT removes duplicate output rows. Then ORDER BY sorts. Then LIMIT and OFFSET take a slice. The alias question falls straight out of this. An alias is created when the SELECT list runs, which is step five. WHERE is step two, before that, so the name simply does not exist yet and you must repeat the underlying expression or wrap the query. ORDER BY is step seven, after the SELECT list, so by then the alias is a real output column and referencing it is not only legal but the idiomatic way to write it. The same logic explains why an aggregate condition must be in HAVING, not WHERE — aggregates do not exist until after grouping — and why every non-aggregated column in a grouped SELECT has to appear in GROUP BY.',
        aHi: 'Halाnki aap ek query SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT ke roop mein likhते ho, database clauses ko ek alag fixed order mein evaluate karता hai. Pehle FROM aur joins rows ka working set assemble karте hain. Phir WHERE un rows ko filter karता hai, sirf column values istemal karके — koi aggregates nahi, koi aliases nahi. Phir GROUP BY bachी rows ko groups mein collapse karता hai. Phir HAVING groups ko filter karता hai, aur yahaan aggregates allowed hain. Phir SELECT list compute hoती hai, jahaan column aliases bind hote hain. Phir DISTINCT. Phir ORDER BY sort karता hai. Phir LIMIT aur OFFSET. Alias sawaal iससे seedhे nikalता hai. Ek alias tab banता hai jab SELECT list chalती hai, jo step paanch hai. WHERE step do hai, uससे pehle, to name abhi maujood hi nahi hai. ORDER BY step saat hai, SELECT list ke baad, to tab tak alias ek real output column hai.',
      },
      {
        q: 'When does a condition belong in `WHERE` vs `HAVING`, and what is the `GROUP BY` "must appear" rule?',
        qHi: 'Ek condition `WHERE` vs `HAVING` mein kab hai, aur `GROUP BY` "must appear" niyam kya hai?',
        a: 'WHERE and HAVING are both filters but at different stages of processing. WHERE runs before grouping and filters individual rows, so it can only test plain column values — status equals active, created before a date. HAVING runs after GROUP BY has formed the groups and filters whole groups, so it is where conditions on aggregates go — count greater than five, sum of amount over a thousand, average score below fifty. The simple rule is: if the condition contains an aggregate function it must be in HAVING; otherwise it goes in WHERE. Putting an aggregate in WHERE is a hard error because at that point the groups and their aggregates do not exist. Putting a non-aggregate in HAVING usually runs but is slower, because you have grouped rows you could have discarded earlier, and it reads as if something aggregate-related is happening when it is not. The GROUP BY must-appear rule follows from what a grouped row means: after GROUP BY dept, each output row represents an entire department, so every column in the SELECT list has to be either one of the grouping expressions or wrapped in an aggregate. Any other column, like employee name, has many different values within the group and there is no single correct one to show, so standard SQL and PostgreSQL reject the query. The exception is that grouping by a table\'s primary key lets you select that table\'s other columns ungrouped, because the key determines them.',
        aHi: 'WHERE aur HAVING dono filters hain par processing ke alag stages par. WHERE grouping se pehle chalता hai aur individual rows filter karता hai, to ye sirf plain column values test kar sakta hai. HAVING GROUP BY ke groups banane ke baad chalता hai aur poore groups filter karता hai, to yahaan aggregates par conditions jaती hain — count paanch se zyaada, amount ka sum ek hazaar se upar. Saral niyam: agar condition mein ek aggregate function hai to ye HAVING mein hona chahिए; warna WHERE mein. WHERE mein ek aggregate daalна ek hard error hai. HAVING mein ek non-aggregate daalना aam taur par chalता hai par slower hai. GROUP BY must-appear niyam is baat se aata hai ki ek grouped row ka kya matlab hai: GROUP BY dept ke baad, har output row ek poore department ko represent karता hai, to SELECT list ka har column ya grouping expressions mein se ek ya ek aggregate mein wrapped hona chahिए.',
      },
    ],

    exercises: [
      {
        task: 'Table `sale(id int, unit numeric, qty int)`. Write `SELECT id, unit * qty AS total FROM sale ORDER BY total DESC LIMIT 3` — it works. Now change `ORDER BY total` to `WHERE total > 20` and observe the error `column "total" does not exist`. Fix it by repeating the expression in `WHERE`. Explain in one sentence which processing step binds the alias and which step `WHERE` is.',
        taskHi: 'Table `sale(id int, unit numeric, qty int)`. `SELECT id, unit * qty AS total FROM sale ORDER BY total DESC LIMIT 3` — kaam karता hai. Ab `ORDER BY total` ko `WHERE total > 20` mein badlो aur error dekho. Expression repeat karके fix karो.',
        hint: 'The alias is bound at step 5 (SELECT list). `WHERE` is step 2. Step 2 runs before step 5, so the name is not yet defined; `ORDER BY` is step 7, after step 5.',
        hintHi: 'Alias step 5 (SELECT list) par bind hota hai. `WHERE` step 2 hai. Step 2 step 5 se pehle chalता hai.',
      },
      {
        task: 'Table `payment(user_id int, cents int, status text)` with statuses `ok`/`failed`. Write one query that returns, per user, the number and sum of their `ok` payments, but only for users whose `ok` total exceeds 5000, ordered by total descending. Confirm the `failed` rows never contribute (they are removed in `WHERE`, before `GROUP BY`).',
        taskHi: 'Table `payment(user_id int, cents int, status text)`. Ek query likho jo prati user unke `ok` payments ki sankhya aur sum lautaye, par sirf un users ke liye jinka `ok` total 5000 se zyaada hai, total descending se ordered.',
        hint: '`WHERE status = \'ok\'` (row filter, before grouping), `GROUP BY user_id`, `HAVING sum(cents) > 5000` (group filter), `ORDER BY sum(cents) DESC` or the alias.',
        hintHi: '`WHERE status = \'ok\'`, `GROUP BY user_id`, `HAVING sum(cents) > 5000`, `ORDER BY` sum ya alias.',
      },
      {
        task: 'Table `product(name text, category text, price numeric)`. Try `SELECT DISTINCT category FROM product ORDER BY price` and read the error. Then write the query that actually answers "each distinct category, ordered by its lowest price" using `GROUP BY` + `min(price)`. Explain why `DISTINCT` + `ORDER BY price` cannot work (which step removes `price`).',
        taskHi: 'Table `product(name text, category text, price numeric)`. `SELECT DISTINCT category FROM product ORDER BY price` try karो aur error padhो. Phir `GROUP BY` + `min(price)` se sahi query likho.',
        hint: '`DISTINCT` (step 6) collapses rows to distinct `category` values — `price` is gone before `ORDER BY` (step 7). `GROUP BY category` + `min(price) AS lo` + `ORDER BY lo` gives the intended result.',
        hintHi: '`DISTINCT` (step 6) rows ko distinct `category` values tak collapse karता hai — `price` `ORDER BY` (step 7) se pehle chala gaya. `GROUP BY category` + `min(price)` istemal karो.',
      },
    ],

    keyTakeaways: [
      'WRITTEN order (`SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT`) is NOT the EVALUATION order. The DB runs: (1) `FROM`/`JOIN` -> (2) `WHERE` -> (3) `GROUP BY` -> (4) `HAVING` -> (5) `SELECT` list + alias binding -> (6) `DISTINCT` -> (7) `ORDER BY` -> (8) `LIMIT`/`OFFSET`. (Window functions: between 5 and 6.)',
      'A `SELECT` ALIAS is bound at step 5. Clauses BEFORE it can\'t see it: `WHERE` (2), `GROUP BY` (3, standard SQL), `HAVING` (4) -> repeat the expression or use a subquery/CTE. Clauses AFTER it can: `ORDER BY` (7) -> `ORDER BY total DESC` is idiomatic. (PostgreSQL extension: alias allowed in `GROUP BY`, NOT `WHERE`.)',
      '`WHERE` filters ROWS before grouping (plain column values only — no aggregates); `HAVING` filters GROUPS after grouping (aggregates allowed, because the groups now exist). RULE: condition mentions an aggregate fn -> `HAVING`; otherwise -> `WHERE`. Aggregate in `WHERE` = hard error; non-aggregate in `HAVING` = works but slower.',
      '`GROUP BY` "must appear" rule: after grouping, each output row = a whole GROUP, so every `SELECT`-list column must be (a) a grouping expression or (b) inside an aggregate. `SELECT dept, name ... GROUP BY dept` is rejected (many `name`s per dept). Exception: group by a table\'s PK -> its other columns are selectable ungrouped. (MySQL with `ONLY_FULL_GROUP_BY` off returns an arbitrary value — silent bug.)',
      '`SELECT DISTINCT` (step 6) collapses to the distinct `SELECT` list; `ORDER BY` (step 7) then only sees what survived -> `SELECT DISTINCT category ... ORDER BY price` is an error (`price` is gone). Use `GROUP BY category` + `min(price)` for "distinct categories ordered by cheapest".',
      '"Top-N per group" (the name of the max-salary employee per dept) is NOT a `GROUP BY` — use `DISTINCT ON` (Postgres), a window function (Module 6), or a correlated subquery (Module 5).',
      'PERFORMANCE follows from the order: a `WHERE` that cuts 99% of rows BEFORE `JOIN`/`GROUP BY`/`ORDER BY` beats the same condition in `HAVING`. `ORDER BY` + `LIMIT` may still sort the ENTIRE intermediate result first (unless an index gives the order — Module 10).',
      'A scalar subquery in the `SELECT` list runs ONCE PER OUTPUT ROW (step 5) — an expensive one in a query returning 100k rows runs 100k times, and `LIMIT` (step 8) does NOT save it. Rewrite as `JOIN` + `GROUP BY` or `LATERAL`.',
    ],
    keyTakeawaysHi: [
      'LIKHA order EVALUATION order NAHI hai. DB chalाता hai: (1) `FROM`/`JOIN` -> (2) `WHERE` -> (3) `GROUP BY` -> (4) `HAVING` -> (5) `SELECT` list + alias binding -> (6) `DISTINCT` -> (7) `ORDER BY` -> (8) `LIMIT`.',
      'Ek `SELECT` ALIAS step 5 par bind hota hai. Uससे PEHLE ke clauses ise nahi dekh sakte: `WHERE` (2), `GROUP BY` (3), `HAVING` (4) -> expression repeat karो. BAAD ke: `ORDER BY` (7) -> `ORDER BY total DESC` idiomatic hai.',
      '`WHERE` grouping se pehle ROWS filter karता hai (sirf plain column values); `HAVING` grouping ke baad GROUPS filter karता hai (aggregates allowed). NIYAM: condition ek aggregate fn mention karता hai -> `HAVING`; warna -> `WHERE`.',
      '`GROUP BY` "must appear": grouping ke baad har output row = ek poora GROUP, to har `SELECT`-list column (a) ek grouping expression ya (b) ek aggregate ke andar hona chahिए. `SELECT dept, name ... GROUP BY dept` reject hota hai.',
      '`SELECT DISTINCT` (step 6) distinct `SELECT` list tak collapse karता hai; `ORDER BY` (step 7) phir sirf jo bacha dekhता hai -> `SELECT DISTINCT category ... ORDER BY price` ek error hai. `GROUP BY category` + `min(price)` istemal karो.',
      '"Top-N per group" ek `GROUP BY` NAHI hai — `DISTINCT ON`, ek window function (Module 6), ya ek correlated subquery (Module 5) istemal karो.',
      'PERFORMANCE order se aati hai: ek `WHERE` jo `JOIN`/`GROUP BY`/`ORDER BY` se PEHLE 99% rows kaatता hai wahi condition `HAVING` mein se behtar hai.',
      '`SELECT` list mein ek scalar subquery PRATI OUTPUT ROW ek baar chalता hai (step 5) — 100k rows lautane waali query mein ek expensive one 100k baar chalता hai, aur `LIMIT` (step 8) ise NAHI bachaता. `JOIN` + `GROUP BY` ke roop mein rewrite karो.',
    ],
  },
];
