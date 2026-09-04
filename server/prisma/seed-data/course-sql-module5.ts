/**
 * Databases Complete Course — Module 5: Subqueries & CTEs, lessons 1-3.
 *
 * Lesson 1: Subquery types & placement — a scalar subquery (one row, one column) in
 *           SELECT / WHERE, a derived table (needs an alias) in FROM, the "more than
 *           one row returned by a subquery used as an expression" error, row
 *           constructor comparison.
 * Lesson 2: Correlated subqueries — a subquery that references the outer row and runs
 *           once per outer row; EXISTS / NOT EXISTS; correlated scalar in SELECT vs a
 *           GROUP BY join; the per-row cost and when the planner de-correlates.
 * Lesson 3: IN / ANY / ALL and the NULL trap — IN (list) vs IN (subquery), `= ANY` and
 *           `<> ALL` as the general forms, the NOT IN + NULL gotcha in depth, and how
 *           ANY / ALL behave against an empty subquery.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 5
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_5: CourseLesson[] = [
  {
    slug: 'sql-subquery-types-and-placement',
    title: 'Subqueries: A Query Inside a Query',
    titleHi: 'Subqueries: Ek Query Ke Andar Ek Query',
    description: 'A subquery is a `SELECT` wrapped in parentheses used inside another statement. Where it sits decides its rules: a SCALAR subquery (exactly one row, one column) goes in `SELECT` or `WHERE`; a DERIVED TABLE (any shape, must have an alias) goes in `FROM`.',
    descriptionHi: 'Ek subquery ek `SELECT` hai jo parentheses mein wrapped hai aur ek doosre statement ke andar istemal hoता hai. Ye kahaan baithता hai iske niyam decide karता hai: ek SCALAR subquery (theek ek row, ek column) `SELECT` ya `WHERE` mein jaता hai; ek DERIVED TABLE (koi bhi shape, ek alias hona chahिए) `FROM` mein jaता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**Answering a question by first looking something up on a different page, then coming back.** Someone asks "which employees earn more than the company average?" You cannot answer in one glance — first you flip to a summary page and work out the average (that is the inner query, and its answer is a single number), then you flip back and go down the staff list keeping anyone above that number (the outer query). A **scalar** subquery is exactly this: the lookup produces one value, and you drop that value into the main question — in the `WHERE` ("above *this number*") or in the `SELECT` ("show each salary *minus this number*"). A **derived table** is different: instead of looking up one number, you first build a small temporary table on scratch paper — "headcount per department" — and then treat that scratch table as if it were a real table in your main query, joining to it or filtering it. Because you are going to refer to it, you have to give the scratch table a name; an unnamed block in the `FROM` is rejected. And a scalar lookup that accidentally returns two numbers is an error — "the average" cannot be two things.',
      hi: '**Ek sawaal ka jawab pehle ek alag page par kuch dhoondkर, phir wapas aakr dena.** Koi poochता hai "kaunse employees company average se zyada kamाते hain?" Aap ek nazar mein jawab nahi de sakte — pehle aap ek summary page par jaate ho aur average nikालते ho (wo inner query hai, aur iska jawab ek single number hai), phir aap wapas jaकर staff list neeche jaते ho us number se upar kisi ko rakhkर (outer query). Ek **scalar** subquery theek yahi hai: lookup ek value produce karता hai, aur aap us value ko main sawaal mein daalते ho — `WHERE` mein ya `SELECT` mein. Ek **derived table** alag hai: ek number lookup karne ke bजाy, aap pehle scratch paper par ek chhoti temporary table banाते ho — "prati department headcount" — aur phir us scratch table ko aise treat karते ho jaise wo aapki main query mein ek real table ho. Kyunki aap ise refer karोge, aapको scratch table ko ek naam dena hoga. Aur do numbers lौtane waala ek scalar lookup ek error hai.',
    },

    simple: `**SCALAR subquery — exactly 1 row, 1 column — goes in \`SELECT\` or \`WHERE\`**

\`\`\`sql
-- in SELECT: one value repeated on every row
SELECT name, salary,
       salary - (SELECT avg(salary) FROM emp) AS above_avg
FROM emp;

-- in WHERE: compare a column to the single value
SELECT name FROM emp
WHERE salary > (SELECT avg(salary) FROM emp);
\`\`\`

**DERIVED TABLE (subquery in \`FROM\`) — any shape, MUST have an alias**

\`\`\`sql
SELECT dept, headcount
FROM ( SELECT dept, count(*) AS headcount FROM emp GROUP BY dept ) AS d   -- alias "d" required
WHERE headcount > 5;
\`\`\`

**A scalar subquery that returns >1 row is a runtime ERROR**

\`\`\`sql
SELECT name, (SELECT salary FROM emp WHERE dept = 'eng') FROM emp;
-- ERROR: more than one row returned by a subquery used as an expression
\`\`\`

**A scalar subquery that returns 0 rows yields \`NULL\` (not an error)**

\`\`\`sql
SELECT (SELECT salary FROM emp WHERE name = 'Nobody');   -- NULL
\`\`\`

**Subquery in \`WHERE ... IN\` — may return many rows, one column**

\`\`\`sql
SELECT name FROM emp
WHERE dept IN (SELECT name FROM dept WHERE region = 'EU');
\`\`\`

**Row constructor — compare several columns at once**

\`\`\`sql
SELECT * FROM emp
WHERE (dept, level) = (SELECT dept, level FROM emp WHERE name = 'Ada');
\`\`\``,

    simpleHi: `**SCALAR subquery — theek 1 row, 1 column — \`SELECT\` ya \`WHERE\` mein**

\`\`\`sql
-- SELECT mein: har row par ek value repeated
SELECT name, salary,
       salary - (SELECT avg(salary) FROM emp) AS above_avg
FROM emp;

-- WHERE mein: ek column ko single value se compare karo
SELECT name FROM emp
WHERE salary > (SELECT avg(salary) FROM emp);
\`\`\`

**DERIVED TABLE (\`FROM\` mein subquery) — koi bhi shape, ALIAS hona CHAHIYE**

\`\`\`sql
SELECT dept, headcount
FROM ( SELECT dept, count(*) AS headcount FROM emp GROUP BY dept ) AS d   -- alias "d" zaroori
WHERE headcount > 5;
\`\`\`

**Ek scalar subquery jo >1 row lauta ता hai ek runtime ERROR hai**

\`\`\`sql
SELECT name, (SELECT salary FROM emp WHERE dept = 'eng') FROM emp;
-- ERROR: more than one row returned by a subquery used as an expression
\`\`\`

**Ek scalar subquery jo 0 rows lauta ता hai \`NULL\` deता hai (error nahi)**

\`\`\`sql
SELECT (SELECT salary FROM emp WHERE name = 'Nobody');   -- NULL
\`\`\`

**\`WHERE ... IN\` mein subquery — kई rows, ek column lauta sakti hai**

\`\`\`sql
SELECT name FROM emp
WHERE dept IN (SELECT name FROM dept WHERE region = 'EU');
\`\`\`

**Row constructor — ek saath kई columns compare karo**

\`\`\`sql
SELECT * FROM emp
WHERE (dept, level) = (SELECT dept, level FROM emp WHERE name = 'Ada');
\`\`\``,

    content: `## What a subquery is

A **subquery** (or subselect) is a complete \`SELECT\` statement enclosed in parentheses and used as part of another statement. It runs and produces a result that the outer statement consumes. The **shape** of that result — one value, one row, one column, or a full table — and **where** the subquery sits determine which forms are legal.

## Scalar subquery — one row, one column

A **scalar subquery** must return **at most one row and exactly one column**. It stands in for a single value, so it can appear anywhere a value is allowed:

- **In the \`SELECT\` list:** \`SELECT name, (SELECT max(price) FROM product) AS top_price FROM ...\` — the same value on every output row.
- **In \`WHERE\` / \`HAVING\`:** \`WHERE salary > (SELECT avg(salary) FROM emp)\` — compared against a column.
- **In an expression:** \`price / (SELECT sum(price) FROM cart)\`.

Two edge cases:

- **Returns more than one row →** runtime error: \`more than one row returned by a subquery used as an expression\`. The database cannot use a set where one value is expected.
- **Returns zero rows →** the scalar subquery evaluates to **\`NULL\`**, silently. \`WHERE x = (SELECT ...)\` then compares \`x = NULL\` = unknown, and the row is dropped — a common source of "why did my query return nothing".

Add \`LIMIT 1\` and an \`ORDER BY\` if a subquery *could* return several rows but you want a specific one.

## Derived table — a subquery in \`FROM\`

A subquery in the \`FROM\` clause is a **derived table** (also "inline view"). It can return **any number of rows and columns** — it behaves exactly like a real table for the rest of the query. You can \`JOIN\` it, filter it, group over it, join it to itself.

\`\`\`sql
SELECT d.dept, d.headcount, d.avg_salary
FROM (
  SELECT dept, count(*) AS headcount, avg(salary) AS avg_salary
  FROM emp
  GROUP BY dept
) AS d
WHERE d.headcount >= 3
ORDER BY d.avg_salary DESC;
\`\`\`

**It must have an alias.** \`FROM (SELECT ...)\` with no name is a syntax error in PostgreSQL — you need \`AS d\` (or just \`d\`). Column names come from the subquery's \`SELECT\` list; alias them there if they are expressions.

Derived tables are how you "filter on an aggregate without \`HAVING\`", "join to a pre-grouped summary" (the fan-out fix from Module 4), or "apply \`WHERE\` to a window-function result" (Module 6). Often a **CTE** (Lesson 4) expresses the same thing more readably.

## Subquery in \`WHERE ... IN\` / \`= ANY\` — one column, many rows

\`WHERE col IN (SELECT one_column FROM ...)\` accepts a subquery returning **one column, any number of rows**. It keeps outer rows whose \`col\` matches any value in that set. \`= ANY (subquery)\` is the same thing; \`EXISTS (subquery)\` (Lesson 2) is the correlated cousin. Details and the \`NOT IN\` NULL trap are Lesson 3.

## Row constructors — comparing several columns

\`(a, b)\` is a **row constructor**. You can compare a whole row at once:

\`\`\`sql
WHERE (dept, level) = (SELECT dept, level FROM emp WHERE id = 42)
WHERE (city, country) IN (SELECT city, country FROM approved_locations)
\`\`\`

\`(a, b) = (x, y)\` means \`a = x AND b = y\`. Useful for "match on this composite key" without repeating the subquery. Note \`NULL\` semantics get subtle with row comparisons — \`(1, NULL) = (1, 2)\` is \`NULL\`, not \`false\`.

## Where subqueries are NOT allowed

- Not in a \`GROUP BY\` clause (group by the expression or a derived table instead).
- A scalar subquery in \`SELECT\` cannot reference an alias defined later in the same \`SELECT\` list.
- Some databases restrict subqueries in \`CHECK\` constraints and \`DEFAULT\` (PostgreSQL disallows them there).

## Do subqueries hurt performance?

Not inherently. An **uncorrelated** scalar subquery like \`(SELECT avg(salary) FROM emp)\` runs **once** and its value is reused. A derived table is usually **flattened** into the parent query by the planner. The cost concern is **correlated** subqueries that run per row — Lesson 2.`,

    contentHi: `## Subquery kya hai

Ek **subquery** ek poora \`SELECT\` statement hai jo parentheses mein enclosed hai aur ek doosre statement ke hisse ke roop mein istemal hoता hai. Ye chalता hai aur ek result produce karता hai jise outer statement consume karता hai. Us result ka **shape** aur subquery **kahaan** baithता hai decide karता hai ki kaunse forms legal hain.

## Scalar subquery — ek row, ek column

Ek **scalar subquery** ko **zyada se zyada ek row aur theek ek column** lौtana chahिए. Ye ek single value ki jagah khadा hoता hai:

- **\`SELECT\` list mein:** har output row par ek hi value.
- **\`WHERE\` / \`HAVING\` mein:** ek column ke against compared.
- **Ek expression mein.**

Do edge cases:
- **Ek se zyada row lौtaता hai →** runtime error: \`more than one row returned by a subquery used as an expression\`.
- **Zero rows lौtaता hai →** scalar subquery **\`NULL\`** evaluate hoता hai, chupchaap. \`WHERE x = (SELECT ...)\` phir \`x = NULL\` = unknown compare karता hai, aur row drop hoती hai.

## Derived table — \`FROM\` mein ek subquery

\`FROM\` clause mein ek subquery ek **derived table** hai. Ye **koi bhi sankhya mein rows aur columns** lौta sakta hai — baaki query ke liye ye ek real table ki tarah behave karता hai.

\`\`\`sql
SELECT d.dept, d.headcount
FROM (
  SELECT dept, count(*) AS headcount FROM emp GROUP BY dept
) AS d
WHERE d.headcount >= 3;
\`\`\`

**Iska ek alias hona chahिए.** Bina naam ke \`FROM (SELECT ...)\` PostgreSQL mein ek syntax error hai.

Derived tables wo hain jinse aap "bina \`HAVING\` ke ek aggregate par filter" karते ho, "ek pre-grouped summary se join" (Module 4 ka fan-out fix), ya "ek window-function result par \`WHERE\` apply" (Module 6). Aksar ek **CTE** (Lesson 4) wahi cheez zyada readably express karता hai.

## \`WHERE ... IN\` mein subquery — ek column, kई rows

\`WHERE col IN (SELECT one_column FROM ...)\` ek subquery accept karता hai jo **ek column, koi bhi sankhya mein rows** lौtaती hai. Details aur \`NOT IN\` NULL trap Lesson 3 hai.

## Row constructors — kई columns compare karna

\`(a, b)\` ek **row constructor** hai. Aap ek poori row ek saath compare kar sakte ho:

\`\`\`sql
WHERE (dept, level) = (SELECT dept, level FROM emp WHERE id = 42)
\`\`\`

\`(a, b) = (x, y)\` ka matlab \`a = x AND b = y\`. \`NULL\` semantics row comparisons ke saath subtle ho jaते hain.

## Subqueries kahaan allowed NAHI hain

- \`GROUP BY\` clause mein nahi.
- \`SELECT\` mein ek scalar subquery usi \`SELECT\` list mein baad mein define kiye alias reference nahi kar sakta.
- PostgreSQL \`CHECK\` constraints aur \`DEFAULT\` mein subqueries disallow karता hai.

## Kya subqueries performance ko nuकsान pahunchाते hain?

Inherently nahi. Ek **uncorrelated** scalar subquery **ek baar** chalता hai. Ek derived table aksar planner dwara parent query mein **flatten** hoती hai. Cost concern **correlated** subqueries hain jo prati row chalते hain — Lesson 2.`,

    examples: [
      {
        title: 'Scalar subquery in SELECT (company average) and in WHERE',
        titleHi: 'SELECT mein scalar subquery (company average) aur WHERE mein',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110),(4,'Di','sales',90);

-- the (SELECT avg...) runs ONCE; its value appears on every row
SELECT name, salary,
       (SELECT round(avg(salary), 1) FROM emp)              AS company_avg,
       salary - (SELECT round(avg(salary), 1) FROM emp)     AS diff
FROM emp
ORDER BY name;

-- same scalar, now as a filter
SELECT name FROM emp WHERE salary > (SELECT avg(salary) FROM emp) ORDER BY name;`,
        output: ` name | salary | company_avg | diff
------+--------+-------------+-------
 Ada  | 120    | 103.8       | 16.2
 Bo   | 95     | 103.8       | -8.8
 Cy   | 110    | 103.8       | 6.2
 Di   | 90     | 103.8       | -13.8
(4 rows)

 name
------
 Ada
 Cy
(2 rows)`,
        explain: '`(SELECT round(avg(salary), 1) FROM emp)` is UNCORRELATED — it names no outer column — so it runs ONCE, produces `103.8`, and that value is dropped onto every row (as `company_avg`, and inside `salary - ...` for `diff`). The second query uses the same scalar in `WHERE`: `salary > 103.8` keeps Ada (120) and Cy (110).',
        explainHi: '`(SELECT round(avg(salary), 1) FROM emp)` UNCORRELATED hai — koi outer column name nahi karता — to ye EK baar chalता hai, `103.8` produce karता hai, aur wo value har row par daal diya jaता hai. Doosri query WHERE mein wahi scalar istemal karती hai: `salary > 103.8` Ada (120) aur Cy (110) rakhती hai.',
      },
      {
        title: 'Derived table in FROM: filter on an aggregate (needs an alias)',
        titleHi: 'FROM mein derived table: ek aggregate par filter (alias chahिए)',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES
  (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110),(4,'Di','sales',90),(5,'Ed','ops',80);

SELECT dept, headcount, avg_salary
FROM (
  SELECT dept, count(*) AS headcount, round(avg(salary), 1) AS avg_salary
  FROM emp
  GROUP BY dept
) AS d
WHERE headcount > 1
ORDER BY dept;`,
        output: ` dept  | headcount | avg_salary
-------+-----------+------------
 eng   | 2         | 107.5
 sales | 2         | 100.0
(2 rows)`,
        explain: 'The subquery in `FROM` computes a per-dept summary, and the outer query then filters it with `WHERE headcount > 1` — which you cannot do directly in the grouped query without `HAVING`. The derived table MUST be aliased (`AS d`); without a name PostgreSQL raises `subquery in FROM must have an alias`. `ops` (headcount 1) is excluded; `eng` and `sales` (both 2) remain.',
        explainHi: '`FROM` mein subquery ek per-dept summary compute karता hai, aur outer query phir ise `WHERE headcount > 1` se filter karता hai — jo aap grouped query mein bина `HAVING` ke seedhे nahi kar sakte. Derived table ko ALIAS hona CHAHIYE (`AS d`); bина naam ke PostgreSQL `subquery in FROM must have an alias` raise karता hai. `ops` (headcount 1) excluded; `eng` aur `sales` (dono 2) rehते hain.',
      },
      {
        title: 'A scalar subquery returning more than one row is a runtime error',
        titleHi: 'Ek se zyada row lौtane waali scalar subquery ek runtime error hai',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110);

-- 'eng' has TWO employees -> the subquery returns 2 rows -> not a scalar
SELECT name, (SELECT salary FROM emp WHERE dept = 'eng') AS eng_salary
FROM emp;`,
        output: `[ERROR] more than one row returned by a subquery used as an expression`,
        explain: "A scalar subquery in the `SELECT` list must return AT MOST ONE ROW. `SELECT salary FROM emp WHERE dept = 'eng'` returns two rows (Ada 120, Bo 95), so the database raises `more than one row returned by a subquery used as an expression` — it has one output slot and a set of values. Fix by aggregating (`max(salary)`), adding `LIMIT 1` with an `ORDER BY`, or correlating on a unique key.",
        explainHi: "`SELECT` list mein ek scalar subquery ko ZYADA SE ZYADA EK ROW lौtaना chahिए. `SELECT salary FROM emp WHERE dept = 'eng'` do rows lौtaता hai (Ada 120, Bo 95), to database `more than one row returned by a subquery used as an expression` raise karता hai. Fix: aggregate karो (`max(salary)`), `ORDER BY` ke saath `LIMIT 1` add karो, ya ek unique key par correlate karो.",
      },
    ],

    mistakes: [
      {
        wrong: `SELECT dept, count(*) AS headcount
FROM (SELECT * FROM emp WHERE active)
GROUP BY dept;
-- ERROR: subquery in FROM must have an alias`,
        right: `SELECT dept, count(*) AS headcount
FROM (SELECT * FROM emp WHERE active) AS e
GROUP BY dept;`,
        why: 'PostgreSQL requires every subquery in the FROM clause to be given a name, because the rest of the query needs a way to refer to it, for column qualification and for joins. The fix is a trailing AS name, or just name with no AS. This is different from a scalar subquery in SELECT or WHERE, which is an expression and needs no alias. Some other databases, such as Oracle, allow an unaliased derived table, so code moved from there will hit this. A CTE avoids the issue entirely because the WITH name is the alias.',
        whyHi: 'PostgreSQL FROM clause mein har subquery ko ek naam diye jaane ki maang karता hai, kyunki baaki query ko ise refer karne ka tarika chahिए, column qualification aur joins ke liye. Fix ek trailing AS name hai, ya bина AS ke sirf name. Ye SELECT ya WHERE mein ek scalar subquery se alag hai, jo ek expression hai aur koi alias nahi chahता. Oracle jaise kuch databases ek unaliased derived table allow karते hain, to wahan se moved code ise hit karेga.',
      },
      {
        wrong: `-- "each order with its customer's name"
SELECT o.id, o.total,
       (SELECT name FROM customer WHERE region = o.region) AS customer_name
FROM orders o;
-- ERROR (when a region has >1 customer): more than one row returned by a subquery`,
        right: `SELECT o.id, o.total,
       (SELECT name FROM customer WHERE customer.id = o.customer_id) AS customer_name
FROM orders o;
-- or just JOIN customer -- clearer when you need several of its columns`,
        why: 'A scalar subquery in the SELECT list must resolve to a single value per outer row. Correlating it on region rather than on the customer id means it can match many customers, and the first outer row whose region has two or more customers triggers the runtime error. The correlation has to be on a key that identifies exactly one row, the customer\'s primary key matched against the order\'s foreign key. Once you need more than one column from the customer, a JOIN is usually cleaner than several parallel scalar subqueries, and the planner handles it better.',
        whyHi: 'SELECT list mein ek scalar subquery ko prati outer row ek single value resolve karna hoga. Ise customer id ke bजाy region par correlate karna matlab ye kई customers match kar sakti hai, aur pehli outer row jiske region mein do ya zyada customers hain runtime error trigger karती hai. Correlation ek key par hona chahिए jo theek ek row identify karता hai. Jab aapको customer se ek se zyada column chahिए, ek JOIN aksar zyada saaf hai.',
      },
      {
        wrong: `-- expected a number, got NULL silently
SELECT p.name, p.price / (SELECT sum(price) FROM product WHERE category = p.category) AS share
FROM product p;
-- for a product in a category that somehow has sum(price) = NULL or 0 -> share is NULL or errors`,
        right: `SELECT p.name,
       p.price / nullif((SELECT sum(price) FROM product WHERE category = p.category), 0) AS share
FROM product p;
-- and be aware a subquery over zero matching rows yields NULL, making the whole expression NULL`,
        why: 'A scalar subquery that matches no rows returns NULL rather than raising an error, so any arithmetic built on it also becomes NULL, and the row quietly carries a NULL where a number was expected. If the subquery can legitimately return 0, dividing by it raises a division-by-zero error instead. Guarding with nullif of the denominator and 0 turns the zero case into NULL too, so the result is a clean NULL you can coalesce or filter, rather than an exception. The broader lesson: a scalar subquery has two silent outcomes, NULL from no rows and an error from many rows, and both deserve a moment\'s thought.',
        whyHi: 'Ek scalar subquery jo koi rows match nahi karती error raise karne ke bजाy NULL lौtaती hai, to ispar bana koi bhi arithmetic bhi NULL ban jaता hai. Agar subquery legitimately 0 lौta sakti hai, ise divide karna division-by-zero error raise karता hai. Denominator aur 0 ke nullif se guard karna zero case ko bhi NULL banाता hai. Broader lesson: ek scalar subquery ke do silent outcomes hain, no rows se NULL aur many rows se ek error.',
      },
    ],

    realWorld: [
      {
        en: '**A leaderboard query with `(SELECT max(score) FROM game) - g.score AS points_behind`** — one uncorrelated scalar subquery, evaluated once, subtracted on every row.',
        hi: '**Ek leaderboard query `(SELECT max(score) FROM game) - g.score AS points_behind` ke saath** — ek uncorrelated scalar subquery, ek baar evaluate.',
      },
      {
        en: '**A report built on a derived table `(SELECT customer_id, sum(total) AS spend FROM orders GROUP BY customer_id) s`** joined to `customer` — the aggregate-before-join pattern that avoids fan-out.',
        hi: '**Ek report ek derived table `(SELECT customer_id, sum(total) AS spend FROM orders GROUP BY customer_id) s` par bani** jo `customer` se joined — fan-out se bacha ने waala pattern.',
      },
      {
        en: '**A guard: `WHERE (tenant_id, resource_id) IN (SELECT tenant_id, resource_id FROM grants WHERE user_id = $1)`** — a row-constructor `IN` doing a composite-key membership check in one clause.',
        hi: '**Ek guard: `WHERE (tenant_id, resource_id) IN (SELECT tenant_id, resource_id FROM grants WHERE user_id = $1)`** — ek row-constructor `IN`.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a scalar subquery, and what happens if it returns zero rows or many rows?',
        qHi: 'Ek scalar subquery kya hai, aur agar ye zero rows ya kई rows lौtaती hai to kya hoता hai?',
        a: 'A scalar subquery is a parenthesised SELECT that returns at most one row and exactly one column, so it can be used anywhere a single value is expected: in the SELECT list, in a WHERE or HAVING comparison, inside an arithmetic expression. If it returns more than one row, that is a runtime error, more than one row returned by a subquery used as an expression, because the engine has one slot and a set of values. If it returns zero rows, there is no error; it evaluates to NULL. That second case is the quiet one. A WHERE clause like column equals that subquery then becomes column equals NULL, which is unknown, so the row is filtered out, and people are puzzled why the query returns nothing. If a subquery could match several rows but you want a specific one, add an ORDER BY and LIMIT 1. If it could match none and you need a number, wrap it in coalesce.',
        aHi: 'Ek scalar subquery ek parenthesised SELECT hai jo zyada se zyada ek row aur theek ek column lौtaती hai, to ise kahin bhi istemal kiya ja sakta hai jahaan ek single value expected hai. Agar ye ek se zyada row lौtaती hai, wo ek runtime error hai, kyunki engine ke paas ek slot hai aur values ka ek set. Agar ye zero rows lौtaती hai, koi error nahi; ye NULL evaluate hoती hai. Wo doosra case quiet hai. Ek WHERE clause jaise column equals that subquery phir column equals NULL ban jaता hai, jo unknown hai, to row filter out ho jaती hai. Agar ek subquery kई rows match kar sakti hai par aap ek specific chahते ho, ek ORDER BY aur LIMIT 1 add karo.',
      },
      {
        q: 'When do you use a subquery in `FROM` (a derived table), and what is the one rule you must not forget?',
        qHi: 'Aap `FROM` mein ek subquery (ek derived table) kab istemal karते ho, aur wo ek niyam kya hai jo aapको nahi bhoolna chahिए?',
        a: 'A derived table is a subquery in the FROM clause that produces an intermediate result set the outer query then treats exactly like a table: you can join it, filter it, group over it, order by its columns. You reach for it when you need to compute something first and then operate on the computed result. The classic cases are filtering on an aggregate without pushing everything into HAVING, joining a table to a pre-aggregated summary of a child table so the join does not fan out and inflate sums, and applying a WHERE to the output of a window function, which cannot be filtered directly. The rule you must not forget in PostgreSQL is that the derived table needs an alias: FROM open-paren SELECT dot dot dot close-paren AS some_name. Without the name it is a syntax error, because the rest of the query needs something to qualify columns with and to reference in joins. A CTE, a WITH clause, is often a more readable way to express the same thing and it names the block by construction.',
        aHi: 'Ek derived table FROM clause mein ek subquery hai jo ek intermediate result set produce karती hai jise outer query phir theek ek table ki tarah treat karती hai. Aap ise tab istemal karते ho jab aapको pehle kuch compute karna hai aur phir computed result par operate karna hai. Classic cases hain bина sab kuch HAVING mein push kiye ek aggregate par filter karna, ek table ko ek child table ke pre-aggregated summary se join karna taaki join fan out na kare, aur ek window function ke output par ek WHERE apply karna. Wo niyam jo aapको PostgreSQL mein nahi bhoolna chahिए wo hai ki derived table ko ek alias chahिए. Bина naam ke ye ek syntax error hai. Ek CTE aksar wahi cheez zyada readably express karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `product(name text, price int)` with 4 rows. Write a query returning `name`, `price`, and `pct_of_total` = `round(100.0 * price / (SELECT sum(price) FROM product), 1)`. Confirm the `pct_of_total` column sums to `100.0` (approximately) and that the scalar subquery is uncorrelated (runs once).',
        taskHi: 'Table `product(name, price)` 4 rows ke saath. Ek query jo `name`, `price`, aur `pct_of_total` = `round(100.0 * price / (SELECT sum(price) FROM product), 1)` lौtaती hai.',
        hint: 'The `(SELECT sum(price) FROM product)` has no reference to the outer row, so it is uncorrelated and evaluated once. `100.0` (not `100`) forces numeric division.',
        hintHi: '`(SELECT sum(price) FROM product)` ka outer row se koi reference nahi, to uncorrelated hai aur ek baar evaluate. `100.0` numeric division force karता hai.',
      },
      {
        task: 'Table `emp(name text, dept text, salary int)`. Using a DERIVED TABLE in `FROM`, get the departments whose average salary exceeds the company-wide average. Structure: `FROM (SELECT dept, avg(salary) AS a FROM emp GROUP BY dept) d WHERE d.a > (SELECT avg(salary) FROM emp)`. Give the derived table an alias and confirm it errors without one.',
        taskHi: 'Table `emp(name, dept, salary)`. `FROM` mein ek DERIVED TABLE istemal karके, wo departments lao jinka average salary company-wide average se zyada hai. Alias do aur confirm karo bина iske error deता hai.',
        hint: 'The derived table produces `(dept, a)` rows; the outer `WHERE` compares `d.a` to a separate uncorrelated scalar subquery. Drop the `d` alias -> `subquery in FROM must have an alias`.',
        hintHi: 'Derived table `(dept, a)` rows produce karता hai; outer `WHERE` `d.a` ko ek alag uncorrelated scalar subquery se compare karता hai. `d` alias hatao -> error.',
      },
      {
        task: 'Table `emp(name text, dept text, level text)`. Write `SELECT name FROM emp WHERE (dept, level) = (SELECT dept, level FROM emp WHERE name = \'Ada\')`. Confirm it returns everyone in Ada\'s exact (dept, level) bucket including Ada. Then note what happens if Ada\'s `level` is `NULL` (the row comparison yields `NULL`, Ada may not match herself).',
        taskHi: 'Table `emp(name, dept, level)`. `SELECT name FROM emp WHERE (dept, level) = (SELECT dept, level FROM emp WHERE name = \'Ada\')` likho. Confirm Ada ke exact bucket mein sab lौtaता hai.',
        hint: '`(dept, level) = (x, y)` means `dept = x AND level = y`. If `y` (Ada\'s level) is `NULL`, `level = NULL` is `UNKNOWN` for every row, so the query returns nothing — even Ada fails to match.',
        hintHi: '`(dept, level) = (x, y)` matlab `dept = x AND level = y`. Agar `y` `NULL` hai, `level = NULL` har row ke liye `UNKNOWN` hai, to query kuch nahi lौtaती.',
      },
    ],

    keyTakeaways: [
      'A subquery is a parenthesised `SELECT` inside another statement. Its legal forms depend on WHERE it sits: SCALAR (1 row, 1 col) in `SELECT`/`WHERE`/an expression; DERIVED TABLE (any shape) in `FROM`; one-column-many-rows in `WHERE ... IN` / `= ANY`.',
      'A SCALAR subquery returning >1 row is a RUNTIME error (`more than one row returned by a subquery used as an expression`). Returning 0 rows yields `NULL` SILENTLY — `WHERE x = (SELECT ... 0 rows)` becomes `x = NULL` = unknown -> row dropped ("why is my result empty").',
      'Add `ORDER BY ... LIMIT 1` if a scalar subquery COULD return several rows but you want one specific. Wrap in `coalesce(..., default)` if it could return none and you need a value.',
      'A DERIVED TABLE (subquery in `FROM`) behaves exactly like a real table — join/filter/group it. In PostgreSQL it MUST have an alias (`FROM (SELECT ...) AS d`) — no alias = syntax error. (Oracle allows unaliased; a CTE names the block by construction.)',
      'Derived tables are how you: filter on an aggregate without `HAVING`, join to a pre-grouped summary (the Module 4 fan-out fix), apply `WHERE` to a window-function result (Module 6). A CTE (Lesson 4) often reads better.',
      '`(a, b)` is a ROW CONSTRUCTOR: `WHERE (dept, level) = (SELECT dept, level FROM ...)` means `dept = x AND b = y` — composite-key match in one clause. Beware `NULL`: `(1, NULL) = (1, 2)` is `NULL`, not `false`.',
      'Subqueries are NOT inherently slow: an UNcorrelated scalar subquery runs ONCE and its value is reused; a derived table is usually flattened into the parent by the planner. The cost concern is CORRELATED subqueries that run per row (Lesson 2).',
    ],
    keyTakeawaysHi: [
      'Ek subquery ek doosre statement ke andar ek parenthesised `SELECT` hai. Iske legal forms is par nirbhar karते hain ki ye KAHAAN baithता hai: SCALAR (1 row, 1 col) `SELECT`/`WHERE` mein; DERIVED TABLE (koi shape) `FROM` mein; one-column-many-rows `WHERE ... IN` mein.',
      'Ek SCALAR subquery jo >1 row lौtaती hai ek RUNTIME error hai. 0 rows lौtane par `NULL` CHUPCHAAP -> `WHERE x = (SELECT ... 0 rows)` `x = NULL` = unknown ban jaता hai -> row dropped.',
      'Ek scalar subquery kई rows lौta sakti hai par aap ek chahते ho to `ORDER BY ... LIMIT 1` add karo. `coalesce(..., default)` mein wrap karo agar none lौta sakti hai.',
      'Ek DERIVED TABLE (`FROM` mein subquery) theek ek real table ki tarah behave karता hai. PostgreSQL mein iska ALIAS hona CHAHIYE — no alias = syntax error.',
      'Derived tables wo hain jinse aap: bина `HAVING` ke ek aggregate par filter, ek pre-grouped summary se join (Module 4 fan-out fix), ek window-function result par `WHERE` apply karते ho. Ek CTE (Lesson 4) aksar behtar padhता hai.',
      '`(a, b)` ek ROW CONSTRUCTOR hai: `WHERE (dept, level) = (SELECT ...)` matlab `dept = x AND b = y`. `NULL` se saawdhान: `(1, NULL) = (1, 2)` `NULL` hai, `false` nahi.',
      'Subqueries inherently slow NAHI hain: ek UNcorrelated scalar subquery EK baar chalती hai; ek derived table aksar parent mein flatten hoती hai. Cost concern CORRELATED subqueries hain (Lesson 2).',
    ],
  },

  {
    slug: 'sql-correlated-subqueries',
    title: 'Correlated Subqueries & EXISTS: The Per-Row Lookup',
    titleHi: 'Correlated Subqueries Aur EXISTS: Prati-Row Lookup',
    description: 'A correlated subquery references a column from the outer query, so it cannot be run once — it is re-evaluated for every outer row, with that row\'s values plugged in. `EXISTS` / `NOT EXISTS` are the most important correlated forms; a correlated scalar in `SELECT` is convenient but can be slow.',
    descriptionHi: 'Ek correlated subquery outer query se ek column reference karता hai, to ise ek baar nahi chalाya ja sakта — ye har outer row ke liye re-evaluate hoती hai, us row ki values plug-in ke saath. `EXISTS` / `NOT EXISTS` sabse important correlated forms hain; `SELECT` mein ek correlated scalar convenient hai par slow ho sakта hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**Going down a guest list and, for each name, phoning a different office to check one thing about *that* person.** An uncorrelated subquery is a single phone call you make before you start — "what is the cut-off score?" — and then you apply that one answer to everyone. A correlated subquery is the opposite: you cannot make the call until you are looking at a specific guest, because the question *contains* their name — "does *Ada Lovelace* have an unpaid invoice?" So you go down the list and place one call per guest, each call parameterised by the guest in front of you. That is why a correlated subquery costs more: it runs once per outer row, not once total. `EXISTS` is the cheapest version of this call — you are only asking "is there at least one matching record?", so the office can hang up the moment it finds one, without reading you the whole file. `NOT EXISTS` is "is there truly none?". A correlated *scalar* subquery is a heavier call — "read me this person\'s current balance" — one number back, once per guest.',
      hi: '**Ek guest list neeche jaना aur, har naam ke liye, ek alag office phone karके *us* vyakti ke baare mein ek cheez check karna.** Ek uncorrelated subquery ek single phone call hai jo aap shuru karne se pehle karते ho — "cut-off score kya hai?" — aur phir aap wo ek jawab sabpar apply karते ho. Ek correlated subquery ulta hai: aap call tab tak nahi kar sakte jab tak aap ek specific guest ko nahi dekh rahe, kyunki sawaal mein *unka* naam hai — "kya *Ada Lovelace* ka ek unpaid invoice hai?" To aap list neeche jaते ho aur prati guest ek call karते ho. Isiliye ek correlated subquery zyada cost karता hai. `EXISTS` is call ka sabse sasta version hai — aap sirf pooch rahe ho "kya kam se kam ek matching record hai?", to office ek milte hi phone rakh sakта hai. `NOT EXISTS` "kya sach mein koi nahi?" hai.',
    },

    simple: `**Uncorrelated (runs once) vs correlated (runs per outer row)**

\`\`\`sql
-- UNCORRELATED: no reference to the outer query -> evaluated once
WHERE salary > (SELECT avg(salary) FROM emp)

-- CORRELATED: mentions e.dept from the outer row -> re-run for every outer row
WHERE salary = (SELECT max(salary) FROM emp e2 WHERE e2.dept = e.dept)
\`\`\`

**\`EXISTS\` — "is there at least one matching row?" (correlated, cheap)**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- one row per matching customer, no fan-out, planner stops at the first match
\`\`\`

**\`NOT EXISTS\` — "is there no matching row?" (the NULL-safe anti-join)**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
\`\`\`

**Correlated scalar in \`SELECT\` — one derived value per row**

\`\`\`sql
SELECT c.name,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count,
       (SELECT max(o.created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customer c;
-- convenient, but each subquery runs once per customer row
\`\`\`

**Often a \`LEFT JOIN ... GROUP BY\` is faster for many rows**

\`\`\`sql
SELECT c.name, count(o.id) AS order_count, max(o.created_at) AS last_order
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
\`\`\``,

    simpleHi: `**Uncorrelated (ek baar chalता) vs correlated (prati outer row chalता)**

\`\`\`sql
-- UNCORRELATED: outer query ka koi reference nahi -> ek baar evaluate
WHERE salary > (SELECT avg(salary) FROM emp)

-- CORRELATED: outer row se e.dept mention karता hai -> har outer row ke liye re-run
WHERE salary = (SELECT max(salary) FROM emp e2 WHERE e2.dept = e.dept)
\`\`\`

**\`EXISTS\` — "kya kam se kam ek matching row hai?" (correlated, sasta)**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- prati matching customer ek row, koi fan-out nahi, planner pehle match par rukта hai
\`\`\`

**\`NOT EXISTS\` — "kya koi matching row nahi?" (NULL-safe anti-join)**

\`\`\`sql
SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
\`\`\`

**\`SELECT\` mein correlated scalar — prati row ek derived value**

\`\`\`sql
SELECT c.name,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count,
       (SELECT max(o.created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customer c;
-- convenient, par har subquery prati customer row ek baar chalती hai
\`\`\`

**Aksar ek \`LEFT JOIN ... GROUP BY\` kई rows ke liye faster hai**

\`\`\`sql
SELECT c.name, count(o.id) AS order_count, max(o.created_at) AS last_order
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
\`\`\``,

    content: `## Correlated vs uncorrelated

A subquery is **uncorrelated** if it makes no reference to the tables of the outer query — it is self-contained, so the database runs it **once** and reuses the result. \`(SELECT avg(salary) FROM emp)\` is uncorrelated.

A subquery is **correlated** if it references a column from an outer table. \`(SELECT max(salary) FROM emp e2 WHERE e2.dept = e.dept)\` mentions \`e.dept\`, which belongs to the outer \`emp e\`. The subquery's result **depends on which outer row is being processed**, so conceptually it is re-evaluated **once per outer row**, with \`e.dept\` bound to that row's value. It is a loop.

## \`EXISTS (subquery)\`

\`WHERE EXISTS (correlated subquery)\` is \`TRUE\` for an outer row when the subquery returns **at least one row**. Conventions and behaviour:

- Write \`SELECT 1\` (or \`SELECT *\`) inside — the select list is ignored, only the existence of a row matters.
- The subquery is correlated (\`WHERE o.customer_id = c.id\`).
- The planner **short-circuits**: it stops scanning the inner table for a given outer row as soon as one match is found. That makes \`EXISTS\` typically faster than \`count(*) > 0\`.
- **No fan-out.** One outer row in, at most one outer row out — no \`DISTINCT\` needed, unlike a join.

This is the tool for "**left rows that have a related row**" — customers who have ordered, posts that have comments, accounts with an open ticket.

## \`NOT EXISTS (subquery)\`

\`TRUE\` when the correlated subquery returns **no rows** — the **anti-join**: customers who have never ordered, products never sold, users with no login. It is **\`NULL\`-safe**: a \`NULL\` in the inner table simply fails the correlation and is ignored, unlike \`NOT IN\` (Lesson 3).

## Correlated scalar subquery in \`SELECT\`

\`\`\`sql
SELECT c.name,
       (SELECT count(*)        FROM orders o WHERE o.customer_id = c.id) AS n_orders,
       (SELECT max(created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customer c;
\`\`\`

This gives **one derived value per outer row** — very readable. Each subquery is correlated and runs once per customer. For a few hundred rows that is fine; for a large \`customer\` table with several such subqueries, it can be much slower than a single:

\`\`\`sql
SELECT c.name, count(o.id) AS n_orders, max(o.created_at) AS last_order
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
\`\`\`

which scans \`orders\` **once**, groups it, and joins. The trade-off: the \`LEFT JOIN\` version fans out then re-collapses (harmless here because we aggregate), and needs every non-aggregated column in \`GROUP BY\`. Rule of thumb: **one correlated scalar is fine; three or more over a big table — switch to a join or a pre-aggregated derived table / CTE.**

## Does the planner actually loop?

Often **no**. Modern planners (PostgreSQL included) **de-correlate** many correlated subqueries — rewriting \`EXISTS\` into a **semi-join**, \`NOT EXISTS\` into an **anti-join**, and a correlated scalar into a **hash join against a grouped subquery** — so the physical plan is set-based, not row-by-row. But this rewrite is not guaranteed: a subquery with \`LIMIT\`, a volatile function, or an awkward correlation may execute as a true per-row loop. When performance matters, check \`EXPLAIN (ANALYZE)\` (Module 10) — a \`SubPlan\` that runs "loops=N" where N is the outer row count is the warning sign.

## \`EXISTS\` vs \`IN\` vs \`JOIN\` — quick guide

| you want | use |
|---|---|
| keep outer rows that have a match, no child columns needed | \`EXISTS\` |
| same, simple single-column key | \`IN (subquery)\` — reads well |
| keep outer rows with **no** match | \`NOT EXISTS\` |
| child columns in the output | \`JOIN\` |
| one aggregate of the child set per outer row | correlated scalar **or** \`LEFT JOIN ... GROUP BY\` |`,

    contentHi: `## Correlated vs uncorrelated

Ek subquery **uncorrelated** hai agar ye outer query ke tables ka koi reference nahi karता — ye self-contained hai, to database ise **ek baar** chalाता hai. \`(SELECT avg(salary) FROM emp)\` uncorrelated hai.

Ek subquery **correlated** hai agar ye ek outer table se ek column reference karता hai. \`(SELECT max(salary) FROM emp e2 WHERE e2.dept = e.dept)\` \`e.dept\` mention karता hai. Subquery ka result **is par nirbhar karता hai ki kaunसी outer row process ho rahi hai**, to conceptually ye **prati outer row ek baar** re-evaluate hoती hai. Ye ek loop hai.

## \`EXISTS (subquery)\`

\`WHERE EXISTS (correlated subquery)\` ek outer row ke liye \`TRUE\` hai jab subquery **kam se kam ek row** lौtaती hai:
- Andar \`SELECT 1\` likho — select list ignore hoती hai.
- Subquery correlated hai.
- Planner **short-circuit** karता hai: ek match milte hi ruk jaता hai. Isse \`EXISTS\` typically \`count(*) > 0\` se faster hai.
- **Koi fan-out nahi.** Koi \`DISTINCT\` nahi chahिए.

Ye "**related row waali left rows**" ke liye tool hai.

## \`NOT EXISTS (subquery)\`

\`TRUE\` jab correlated subquery **koi rows nahi** lौtaती — **anti-join**. Ye **\`NULL\`-safe** hai, \`NOT IN\` ke ulta (Lesson 3).

## \`SELECT\` mein correlated scalar subquery

\`\`\`sql
SELECT c.name,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS n_orders
FROM customer c;
\`\`\`

Ye **prati outer row ek derived value** deता hai — bahut readable. Har subquery correlated hai aur prati customer ek baar chalती hai. Kuch sौ rows ke liye theek; ek badी \`customer\` table ke liye kई aise subqueries ke saath, ye ek single \`LEFT JOIN ... GROUP BY\` se bahut slower ho sakта hai.

Rule of thumb: **ek correlated scalar theek hai; ek badी table par teen ya zyada — ek join ya ek pre-aggregated derived table / CTE par switch karo.**

## Kya planner asal mein loop karता hai?

Aksar **nahi**. Modern planners kई correlated subqueries ko **de-correlate** karते hain — \`EXISTS\` ko ek **semi-join** mein, \`NOT EXISTS\` ko ek **anti-join** mein rewrite karके — to physical plan set-based hai. Par ye rewrite guaranteed nahi hai: \`LIMIT\`, ek volatile function, ya ek awkward correlation waali subquery ek true per-row loop ke roop mein execute ho sakti hai. \`EXPLAIN (ANALYZE)\` check karo (Module 10) — ek \`SubPlan\` jo "loops=N" chalता hai warning sign hai.

## \`EXISTS\` vs \`IN\` vs \`JOIN\` — quick guide

| aap chahते ho | istemal |
|---|---|
| match waali outer rows rakhो, child columns nahi chahिए | \`EXISTS\` |
| wahi, simple single-column key | \`IN (subquery)\` |
| **koi** match nahi waali outer rows rakhो | \`NOT EXISTS\` |
| output mein child columns | \`JOIN\` |
| prati outer row child set ka ek aggregate | correlated scalar **ya** \`LEFT JOIN ... GROUP BY\` |`,

    examples: [
      {
        title: 'Correlated subquery: each employee who earns their department maximum',
        titleHi: 'Correlated subquery: har employee jo apne department ka maximum kamाता hai',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES
  (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110),(4,'Di','sales',90);

SELECT e.name, e.dept, e.salary
FROM emp e
WHERE e.salary = (SELECT max(e2.salary) FROM emp e2 WHERE e2.dept = e.dept)
ORDER BY e.dept;`,
        output: ` name | dept  | salary
------+-------+--------
 Ada  | eng   | 120
 Cy   | sales | 110
(2 rows)`,
        explain: "The subquery `(SELECT max(e2.salary) FROM emp e2 WHERE e2.dept = e.dept)` references `e.dept` from the outer row, so it is CORRELATED — its result depends on which employee is being checked. Conceptually it re-runs per outer row: for Ada it computes `max` over eng (120), for Cy over sales (110). The row is kept only when the employee's own salary equals that per-dept max.",
        explainHi: 'Subquery `(SELECT max(e2.salary) FROM emp e2 WHERE e2.dept = e.dept)` outer row se `e.dept` reference karता hai, to CORRELATED hai — iska result is par nirbhar karता hai ki kaunसा employee check ho raha hai. Conceptually ye prati outer row re-run hoती hai. Row sirf tab rakhी jaती hai jab employee ka apna salary us per-dept max ke barabar hai.',
      },
      {
        title: 'EXISTS and NOT EXISTS: departments that do / do not have employees',
        titleHi: 'EXISTS aur NOT EXISTS: wo departments jinke employees hain / nahi hain',
        code: `CREATE TABLE emp (id int, name text, dept text);
INSERT INTO emp VALUES (1,'Ada','eng'),(2,'Bo','eng'),(3,'Cy','sales');
CREATE TABLE dept (name text);
INSERT INTO dept VALUES ('eng'),('sales'),('ops');

SELECT d.name
FROM dept d
WHERE EXISTS (SELECT 1 FROM emp e WHERE e.dept = d.name)
ORDER BY d.name;

SELECT d.name
FROM dept d
WHERE NOT EXISTS (SELECT 1 FROM emp e WHERE e.dept = d.name)
ORDER BY d.name;`,
        output: ` name
-------
 eng
 sales
(2 rows)

 name
------
 ops
(1 row)`,
        explain: '`WHERE EXISTS (SELECT 1 FROM emp e WHERE e.dept = d.name)` is `TRUE` for a department when at least one employee row correlates — `eng` and `sales` have employees, `ops` does not. `NOT EXISTS` is the exact complement: `ops` alone. `EXISTS` is a semi-join — one row per matching department, no fan-out, and the planner stops at the first matching employee.',
        explainHi: '`WHERE EXISTS (SELECT 1 FROM emp e WHERE e.dept = d.name)` ek department ke liye `TRUE` hai jab kam se kam ek employee row correlate karती hai — `eng` aur `sales` ke employees hain, `ops` ke nahi. `NOT EXISTS` exact complement hai: akela `ops`. `EXISTS` ek semi-join hai — prati matching department ek row, koi fan-out nahi.',
      },
      {
        title: 'Correlated scalar in SELECT vs the equivalent LEFT JOIN + GROUP BY',
        titleHi: 'SELECT mein correlated scalar vs equivalent LEFT JOIN + GROUP BY',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1,'Acme'),(2,'Globex'),(3,'Initech');
CREATE TABLE orders (id int, customer_id int, total int);
INSERT INTO orders VALUES (10,1,100),(11,1,200),(12,2,50);

-- correlated scalar subqueries: readable, one run per customer
SELECT c.name,
       (SELECT count(*)          FROM orders o WHERE o.customer_id = c.id) AS n_orders,
       (SELECT coalesce(sum(total),0) FROM orders o WHERE o.customer_id = c.id) AS spend
FROM customer c
ORDER BY c.name;

-- same answer, one scan of orders
SELECT c.name, count(o.id) AS n_orders, coalesce(sum(o.total),0) AS spend
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;`,
        output: ` name    | n_orders | spend
---------+----------+-------
 Acme    | 2        | 300
 Globex  | 1        | 50
 Initech | 0        | 0
(3 rows)

 name    | n_orders | spend
---------+----------+-------
 Acme    | 2        | 300
 Globex  | 1        | 50
 Initech | 0        | 0
(3 rows)`,
        explain: 'Both queries give the same result. The correlated-scalar version runs two subqueries PER customer row (a `count` and a `sum`), each re-evaluated with `c.id` bound — readable, fine for small tables. The `LEFT JOIN ... GROUP BY` scans `orders` ONCE, groups it, and joins; `count(o.id)` (not `count(*)`) and `coalesce(sum(o.total), 0)` give `0` / `0` for Initech, who has no orders.',
        explainHi: 'Dono queries same result dete hain. Correlated-scalar version PRATI customer row do subqueries chalाता hai, har ek `c.id` bound ke saath re-evaluated — readable, chhoti tables ke liye theek. `LEFT JOIN ... GROUP BY` `orders` ko EK baar scan karता hai; `count(o.id)` (na ki `count(*)`) aur `coalesce(sum(o.total), 0)` Initech ke liye `0` / `0` dete hain.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "customers who have placed an order" -- using a JOIN
SELECT c.name
FROM customer c
JOIN orders o ON o.customer_id = c.id;
-- a customer with 5 orders is listed 5 times`,
        right: `SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
        why: 'The output needs only customer names, but the join to orders fans each customer out to one row per order, so you get duplicates and reach for SELECT DISTINCT, which forces the database to build the full joined set and then de-duplicate it. EXISTS is a semi-join: it uses orders solely to test each customer, never multiplies rows, needs no DISTINCT, and lets the planner stop scanning a customer\'s orders at the first hit. Use the join only when you actually need columns from orders in the result.',
        whyHi: 'Output ko sirf customer names chahिए, par orders ka join har customer ko prati order ek row mein fan karता hai, to aapको duplicates milते hain aur aap SELECT DISTINCT istemal karते ho, jo database ko poora joined set banakар phir de-duplicate karne par majboor karता hai. EXISTS ek semi-join hai: ye orders ko sirf har customer test karne ke liye istemal karता hai, kabhi rows multiply nahi karता, koi DISTINCT nahi chahता.',
      },
      {
        wrong: `-- "products never ordered" -- correlated scalar that can be 0 OR NULL
SELECT p.name
FROM product p
WHERE (SELECT count(*) FROM order_line ol WHERE ol.product_id = p.id) = 0;
-- works, but runs a full count per product just to compare against 0`,
        right: `SELECT p.name
FROM product p
WHERE NOT EXISTS (SELECT 1 FROM order_line ol WHERE ol.product_id = p.id);`,
        why: 'Comparing a correlated count to zero asks the database to count every matching child row for every parent, then check whether the total is zero. NOT EXISTS asks the direct question, is there any matching row, and the planner can stop at the first one it finds and answer no further. For a product with thousands of order lines the count version does thousands of times more work than it needs to. Whenever the real question is presence or absence rather than an exact quantity, EXISTS or NOT EXISTS is both clearer and cheaper.',
        whyHi: 'Ek correlated count ko zero se compare karna database ko har parent ke liye har matching child row count karne ko kehta hai, phir check karता hai ki total zero hai ya nahi. NOT EXISTS seedhा sawaal poochता hai, kya koi matching row hai, aur planner pehli milte hi ruk sakта hai. Hazaron order lines waale ek product ke liye count version zaroorat se hazaron guna zyada kaam karता hai.',
      },
      {
        wrong: `-- dashboard: 6 correlated scalar subqueries over a 2M-row customer table
SELECT c.id, c.name,
  (SELECT count(*) FROM orders  o WHERE o.customer_id = c.id) AS orders,
  (SELECT count(*) FROM tickets t WHERE t.customer_id = c.id) AS tickets,
  (SELECT count(*) FROM logins  l WHERE l.customer_id = c.id) AS logins,
  (SELECT max(created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order,
  (SELECT max(created_at) FROM logins l WHERE l.customer_id = c.id) AS last_login,
  (SELECT sum(total) FROM orders o WHERE o.customer_id = c.id) AS lifetime_value
FROM customer c;`,
        right: `SELECT c.id, c.name,
       o.orders, o.last_order, o.lifetime_value,
       t.tickets, l.logins, l.last_login
FROM customer c
LEFT JOIN (SELECT customer_id, count(*) orders, max(created_at) last_order, sum(total) lifetime_value
           FROM orders GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, count(*) tickets FROM tickets GROUP BY customer_id) t ON t.customer_id = c.id
LEFT JOIN (SELECT customer_id, count(*) logins, max(created_at) last_login
           FROM logins GROUP BY customer_id) l ON l.customer_id = c.id;`,
        why: 'Each correlated scalar subquery is re-run for every row of the outer query. Six of them over a two-million-row table is up to twelve million index lookups, and two of the subqueries hit orders separately when one pass could produce both the count and the max. Pre-aggregating each child table once in a derived table, so it yields one row per customer, and then LEFT JOINing those, scans each child table a single time and lets the planner use hash joins. The planner sometimes de-correlates scalar subqueries into exactly this shape on its own, but with six of them and multiple aggregates it often does not, so writing it explicitly is the safe choice for a large table.',
        whyHi: 'Har correlated scalar subquery outer query ki har row ke liye re-run hoती hai. Ek do-million-row table par chhah ki chhah baarah million tak index lookups hain, aur do subqueries orders ko alag hit karती hain jab ek pass dono produce kar sakta tha. Har child table ko ek derived table mein ek baar pre-aggregate karna, phpir unhe LEFT JOIN karna, har child table ko ek single baar scan karता hai. Planner kabhi khud aise de-correlate karта hai, par chhah ke saath aksar nahi.',
      },
    ],

    realWorld: [
      {
        en: '**`WHERE EXISTS (SELECT 1 FROM subscription s WHERE s.account_id = a.id AND s.status = \'active\')`** as the standard "active accounts" filter — a multi-condition correlation that reads better as `EXISTS` than as a join + `DISTINCT`.',
        hi: '**Standard "active accounts" filter ke roop mein `WHERE EXISTS (SELECT 1 FROM subscription s WHERE s.account_id = a.id AND s.status = \'active\')`**.',
      },
      {
        en: '**A nightly "stale records" job: `DELETE FROM cache c WHERE NOT EXISTS (SELECT 1 FROM source s WHERE s.key = c.key)`** — the anti-join written the NULL-safe way.',
        hi: '**Ek nightly "stale records" job: `DELETE FROM cache c WHERE NOT EXISTS (SELECT 1 FROM source s WHERE s.key = c.key)`** — anti-join NULL-safe tarike se.',
      },
      {
        en: '**A review rule flagging any `SELECT` with 3+ correlated scalar subqueries over the same base table** — rewritten as one pre-aggregated `LEFT JOIN` after a dashboard timed out in production.',
        hi: '**Ek review rule jo usi base table par 3+ correlated scalar subqueries waali koi `SELECT` flag karता hai** — ek dashboard timeout ke baad rewritten.',
      },
    ],

    interviewQA: [
      {
        q: 'What makes a subquery "correlated", and why does it matter for performance?',
        qHi: 'Ek subquery ko "correlated" kya banाता hai, aur ye performance ke liye kyun maayne rakhता hai?',
        a: 'A subquery is correlated when it references a column from a table in the outer query, so its result depends on which outer row is currently being processed. An uncorrelated subquery, by contrast, is self-contained and can be evaluated once and reused. The performance concern with a correlated subquery is that, conceptually, it is a loop: it runs once per outer row, with the correlated column bound to that row\'s value. If the outer query has a million rows and the subquery does an index lookup, that is a million lookups. In practice, modern planners de-correlate many of these: an EXISTS becomes a semi-join, a NOT EXISTS becomes an anti-join, a correlated scalar aggregate often becomes a hash join against a grouped version of the child table, and then the plan is set-based rather than row-by-row. But the rewrite is not guaranteed. A subquery with a LIMIT, a volatile function, or a correlation the optimiser cannot untangle may run as a genuine per-row loop. So when a query with correlated subqueries is slow, you check EXPLAIN ANALYZE for a SubPlan whose loop count equals the outer row count, and if you see it, you rewrite as an explicit join or a pre-aggregated derived table.',
        aHi: 'Ek subquery correlated hai jab ye outer query mein ek table se ek column reference karता hai, to iska result is par nirbhar karता hai ki kaunसी outer row abhi process ho rahi hai. Ek uncorrelated subquery, iske viparit, self-contained hai aur ek baar evaluate hokar reuse ho sakती hai. Performance concern ye hai ki, conceptually, ye ek loop hai: prati outer row ek baar chalती hai. Agar outer query ke ek million rows hain aur subquery ek index lookup karती hai, wo ek million lookups hai. Practice mein, modern planners inme se kई ko de-correlate karते hain. Par rewrite guaranteed nahi hai. Jab correlated subqueries waali ek query slow hai, aap EXPLAIN ANALYZE check karते ho.',
      },
      {
        q: 'When would you prefer a correlated scalar subquery in `SELECT` over a `LEFT JOIN ... GROUP BY`, and when the reverse?',
        qHi: 'Aap ek `LEFT JOIN ... GROUP BY` ke bजाy `SELECT` mein ek correlated scalar subquery kab prefer karोge, aur ulta kab?',
        a: 'The correlated scalar subquery in the SELECT list is the more readable form when you need one or two derived values per row and the outer table is not huge. Each value is a self-describing little query, count of this customer\'s orders, max of their login dates, and there is no GROUP BY to maintain, no worry about which columns must be grouped. For a few hundred or a few thousand outer rows the cost is negligible. You switch to a LEFT JOIN with GROUP BY when the outer table is large or you need several aggregates, especially several over the same child table. The join scans each child table once, groups it, and hash-joins to the parent, which is far cheaper than re-running three or four correlated subqueries for every outer row. The cost of the join approach is that you must list every non-aggregated column in the GROUP BY, and the query reads as less obviously correct. A middle ground is a pre-aggregated derived table or CTE per child, LEFT JOINed in, which keeps one scan per child and stays readable.',
        aHi: 'SELECT list mein correlated scalar subquery zyada readable form hai jab aapको prati row ek ya do derived values chahिए aur outer table bahut badी nahi hai. Har value ek self-describing chhoti query hai, aur koi GROUP BY maintain nahi karna. Kuch sौ ya kuch hazaर outer rows ke liye cost negligible hai. Aap ek LEFT JOIN with GROUP BY par switch karते ho jab outer table badी hai ya aapको kई aggregates chahिए, khaas kar usi child table par kई. Join har child table ko ek baar scan karта hai. Join approach ki cost ye hai ki aapको har non-aggregated column GROUP BY mein list karna hoga. Ek middle ground prati child ek pre-aggregated derived table ya CTE hai.',
      },
    ],

    exercises: [
      {
        task: 'Tables `blog(id int, title text)` and `post(blog_id int, published bool)`. Write "blogs that have at least one PUBLISHED post" using `EXISTS` with a two-condition correlation (`p.blog_id = b.id AND p.published`). Then write "blogs with no published post" by changing `EXISTS` to `NOT EXISTS`. Confirm the two results partition all blogs.',
        taskHi: 'Tables `blog(id, title)` aur `post(blog_id, published)`. "kam se kam ek PUBLISHED post waale blogs" `EXISTS` se likho ek two-condition correlation ke saath. Phir `NOT EXISTS` se ulta.',
        hint: '`WHERE EXISTS (SELECT 1 FROM post p WHERE p.blog_id = b.id AND p.published)`. The correlation carries both the join key and the status filter. `NOT EXISTS` flips it; together they cover every blog exactly once.',
        hintHi: '`WHERE EXISTS (SELECT 1 FROM post p WHERE p.blog_id = b.id AND p.published)`. Correlation dono join key aur status filter le jाता hai.',
      },
      {
        task: 'Table `emp(name text, dept text, salary int)`. Using a CORRELATED subquery in `WHERE`, return each employee whose salary is above their own department\'s average. Structure: `WHERE e.salary > (SELECT avg(e2.salary) FROM emp e2 WHERE e2.dept = e.dept)`. Note this subquery is re-evaluated per outer row.',
        taskHi: 'Table `emp(name, dept, salary)`. `WHERE` mein ek CORRELATED subquery istemal karके, har employee lao jiska salary apne department ke average se upar hai.',
        hint: 'The inner `avg` depends on `e.dept` from the current outer row, so it is correlated. Conceptually it runs once per employee; the planner may de-correlate it into a join against a grouped average.',
        hintHi: 'Inner `avg` current outer row se `e.dept` par nirbhar karता hai, to correlated hai. Planner ise ek grouped average ke join mein de-correlate kar sakта hai.',
      },
      {
        task: 'Tables `customer(id int, name text)` and `orders(customer_id int, total int)`. Write the report `name, n_orders, total_spent` two ways: (a) two correlated scalar subqueries in `SELECT`; (b) one `LEFT JOIN orders ... GROUP BY`. Confirm identical output and note that (b) scans `orders` once while (a) scans it once per customer.',
        taskHi: 'Tables `customer(id, name)` aur `orders(customer_id, total)`. Report `name, n_orders, total_spent` do tareeke se: (a) `SELECT` mein do correlated scalar subqueries; (b) ek `LEFT JOIN orders ... GROUP BY`.',
        hint: '(a) `(SELECT count(*) ...)` and `(SELECT coalesce(sum(total),0) ...)`. (b) `count(o.id)`, `coalesce(sum(o.total),0)`, `GROUP BY c.id, c.name`. Both give `0` / `0` for a customer with no orders.',
        hintHi: '(a) `(SELECT count(*) ...)` aur `(SELECT coalesce(sum(total),0) ...)`. (b) `count(o.id)`, `GROUP BY c.id, c.name`.',
      },
    ],

    keyTakeaways: [
      'UNCORRELATED subquery: no reference to the outer query -> the DB runs it ONCE and reuses the value. CORRELATED subquery: references an outer column (`WHERE e2.dept = e.dept`) -> its result depends on the current outer row, so conceptually it re-runs ONCE PER OUTER ROW (a loop).',
      '`WHERE EXISTS (SELECT 1 FROM ... WHERE <correlation>)` = `TRUE` if the subquery returns >=1 row. `SELECT 1` is idiomatic (list ignored). Planner SHORT-CIRCUITS at the first match -> usually faster than `count(*) > 0`. NO fan-out, NO `DISTINCT` — unlike a join.',
      '`NOT EXISTS` = `TRUE` when the correlated subquery returns NO rows — the NULL-SAFE anti-join (a `NULL` inner row just fails the correlation). Use for "never ordered / never sold / no login".',
      'A CORRELATED SCALAR subquery in `SELECT` gives one derived value per row — very readable, but each runs once per outer row. Fine for ~hundreds of rows / 1-2 subqueries; for a big table with 3+ such subqueries, switch to `LEFT JOIN ... GROUP BY` (one scan of the child) or a pre-aggregated derived table / CTE.',
      'The planner often DE-CORRELATES: `EXISTS` -> semi-join, `NOT EXISTS` -> anti-join, correlated scalar aggregate -> hash join vs a grouped subquery — so the physical plan is set-based, NOT row-by-row. NOT guaranteed: `LIMIT`, a volatile function, or an awkward correlation can force a real per-row loop. Check `EXPLAIN (ANALYZE)` for a `SubPlan` with `loops=N` (Module 10).',
      'GUIDE: keep matching outer rows, no child cols -> `EXISTS`; simple single-col key -> `IN (subquery)`; NO match -> `NOT EXISTS`; child columns in output -> `JOIN`; one aggregate of the child set per row -> correlated scalar OR `LEFT JOIN ... GROUP BY`.',
      '`WHERE (SELECT count(*) ...) = 0` does full counting work just to compare to zero — use `NOT EXISTS` instead (stops at the first match).',
    ],
    keyTakeawaysHi: [
      'UNCORRELATED subquery: outer query ka koi reference nahi -> DB ise EK baar chalाता hai. CORRELATED subquery: ek outer column reference karता hai -> iska result current outer row par nirbhar, conceptually PRATI OUTER ROW ek baar re-run (ek loop).',
      '`WHERE EXISTS (SELECT 1 FROM ... WHERE <correlation>)` = `TRUE` agar subquery >=1 row lौtaती hai. Planner pehle match par SHORT-CIRCUIT karता hai -> `count(*) > 0` se faster. KOI fan-out, KOI `DISTINCT` nahi.',
      '`NOT EXISTS` = `TRUE` jab correlated subquery KOI rows nahi lौtaती — NULL-SAFE anti-join. "Kabhi order nahi / kabhi nahi bika / koi login nahi" ke liye.',
      '`SELECT` mein ek CORRELATED SCALAR subquery prati row ek derived value deता hai — bahut readable, par har ek prati outer row ek baar chalता hai. ~sौ rows / 1-2 subqueries ke liye theek; ek badी table par 3+ ke saath `LEFT JOIN ... GROUP BY` par switch karo.',
      'Planner aksar DE-CORRELATE karता hai: `EXISTS` -> semi-join, `NOT EXISTS` -> anti-join — to physical plan set-based hai. GUARANTEED NAHI: `LIMIT`, ek volatile function ek real per-row loop force kar sakта hai. `EXPLAIN (ANALYZE)` check karo (Module 10).',
      'GUIDE: matching outer rows rakhो, no child cols -> `EXISTS`; simple single-col key -> `IN (subquery)`; NO match -> `NOT EXISTS`; output mein child columns -> `JOIN`; prati row child set ka ek aggregate -> correlated scalar YA `LEFT JOIN ... GROUP BY`.',
      '`WHERE (SELECT count(*) ...) = 0` sirf zero se compare karne ke liye poora counting karता hai — `NOT EXISTS` istemal karो.',
    ],
  },

  {
    slug: 'sql-in-any-all-and-the-null-trap',
    title: 'IN, ANY, ALL and the NOT IN NULL Trap',
    titleHi: 'IN, ANY, ALL Aur NOT IN NULL Trap',
    description: '`x IN (a, b, c)` is shorthand for `x = a OR x = b OR x = c`. `IN (subquery)` and `= ANY (subquery)` are the same. `> ALL` / `> ANY` compare against a whole set. And `NOT IN (subquery)` returns ZERO rows the moment the subquery contains one `NULL` — the single most infamous SQL gotcha.',
    descriptionHi: '`x IN (a, b, c)` `x = a OR x = b OR x = c` ke liye shorthand hai. `IN (subquery)` aur `= ANY (subquery)` same hain. `> ALL` / `> ANY` ek poore set ke against compare karते hain. Aur `NOT IN (subquery)` ZERO rows lौtaता hai jis pal subquery mein ek `NULL` hoता hai — sabse infamous SQL gotcha.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A bouncer with a clipboard.** "Is this person on the guest list?" is `IN` — the bouncer scans the list for a match and, on finding one, waves them through. "Is this person **not** on the list?" is `NOT IN` — and here is the trap. Suppose one line on the list is smudged and unreadable. To be sure someone is *not* on the list, the bouncer must confirm they are not any of the entries — including the smudged one. But he cannot read the smudged line, so he can never be *certain* it is not them. A careful bouncer, faced with "prove a negative against an unreadable entry", refuses everyone: nobody can be confirmed as "definitely not on the list". That is exactly what `NOT IN` does when the list contains a `NULL` — one unreadable entry and the whole check returns nothing. `NOT EXISTS` is a smarter bouncer who just checks "did anyone matching walk in?" and treats the smudge as "not a match", which is the sensible reading.',
      hi: '**Ek bouncer clipboard ke saath.** "Kya ye vyakti guest list par hai?" `IN` hai — bouncer list scan karता hai aur ek milte hi unhe andar bhej deता hai. "Kya ye vyakti list par NAHI hai?" `NOT IN` hai — aur yahaan trap hai. Maान lo list par ek line dhundhli aur unreadable hai. Ye pakka karne ke liye ki koi list par *nahi* hai, bouncer ko confirm karna hoga ki wo koi bhi entry nahi hai — smudged waali sहित. Par wo smudged line nahi padh sakта, to wo kabhi *certain* nahi ho sakта ki wo unme se nahi hai. Ek careful bouncer, "ek unreadable entry ke against ek negative prove karo" ke saamne, sabko refuse karता hai. Yahi `NOT IN` karता hai jab list mein ek `NULL` hai. `NOT EXISTS` ek smarter bouncer hai jo bस check karता hai "kya koi matching andar aaya?" aur smudge ko "not a match" treat karता hai.',
    },

    simple: `**\`IN (list)\` = a chain of \`OR\` equalities**

\`\`\`sql
WHERE status IN ('open', 'pending', 'blocked')
-- same as: status = 'open' OR status = 'pending' OR status = 'blocked'
\`\`\`

**\`IN (subquery)\` and \`= ANY (subquery)\` are identical**

\`\`\`sql
WHERE dept IN     (SELECT name FROM department WHERE region = 'EU')
WHERE dept = ANY  (SELECT name FROM department WHERE region = 'EU')   -- same
\`\`\`

**\`ANY\` / \`ALL\` with other operators compare against a whole set**

\`\`\`sql
WHERE salary > ALL (SELECT salary FROM emp WHERE dept = 'sales')   -- greater than the MAX of that set
WHERE salary > ANY (SELECT salary FROM emp WHERE dept = 'sales')   -- greater than the MIN (at least one)
WHERE salary <> ALL (SELECT salary FROM banned_levels)             -- same as NOT IN
\`\`\`

**THE TRAP: \`NOT IN (subquery)\` + one \`NULL\` = zero rows**

\`\`\`sql
-- if ANY value from the subquery is NULL, this returns NOTHING, always
WHERE customer_id NOT IN (SELECT customer_id FROM orders)
-- because  x <> NULL  is UNKNOWN, and  x <> a AND x <> b AND UNKNOWN  is never TRUE
\`\`\`

**The fixes**

\`\`\`sql
-- 1. NOT EXISTS (recommended) -- NULL-safe
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)

-- 2. filter the NULLs out of the subquery
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)

-- 3. NOT IN a hard-coded literal list you KNOW has no NULL -- fine
WHERE status NOT IN ('deleted', 'archived')
\`\`\``,

    simpleHi: `**\`IN (list)\` = \`OR\` equalities ki ek chain**

\`\`\`sql
WHERE status IN ('open', 'pending', 'blocked')
-- same as: status = 'open' OR status = 'pending' OR status = 'blocked'
\`\`\`

**\`IN (subquery)\` aur \`= ANY (subquery)\` identical hain**

\`\`\`sql
WHERE dept IN     (SELECT name FROM department WHERE region = 'EU')
WHERE dept = ANY  (SELECT name FROM department WHERE region = 'EU')   -- same
\`\`\`

**\`ANY\` / \`ALL\` doosre operators ke saath ek poore set ke against compare karते hain**

\`\`\`sql
WHERE salary > ALL (SELECT salary FROM emp WHERE dept = 'sales')   -- us set ke MAX se zyada
WHERE salary > ANY (SELECT salary FROM emp WHERE dept = 'sales')   -- MIN se zyada (kam se kam ek)
WHERE salary <> ALL (SELECT salary FROM banned_levels)             -- NOT IN jaisा
\`\`\`

**TRAP: \`NOT IN (subquery)\` + ek \`NULL\` = zero rows**

\`\`\`sql
-- agar subquery se KOI value NULL hai, ye KUCH NAHI lौtaता, hamesha
WHERE customer_id NOT IN (SELECT customer_id FROM orders)
-- kyunki  x <> NULL  UNKNOWN hai, aur  x <> a AND x <> b AND UNKNOWN  kabhi TRUE nahi
\`\`\`

**Fixes**

\`\`\`sql
-- 1. NOT EXISTS (recommended) -- NULL-safe
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)

-- 2. subquery se NULLs filter karo
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)

-- 3. ek hard-coded literal list jise aap JAANTE ho NULL-free hai -- theek
WHERE status NOT IN ('deleted', 'archived')
\`\`\``,

    content: `## \`IN\` — membership

\`x IN (v1, v2, v3)\` is \`TRUE\` if \`x\` equals **any** of the listed values. It is exactly \`x = v1 OR x = v2 OR x = v3\`. The list can be:

- **literals:** \`WHERE status IN ('a', 'b', 'c')\`
- **a subquery returning one column:** \`WHERE id IN (SELECT user_id FROM admins)\`
- **a row constructor list:** \`WHERE (x, y) IN ((1, 2), (3, 4))\`

\`IN (subquery)\` is a **semi-join** — it filters the outer rows and never multiplies them.

## \`ANY\` and \`ALL\` — the general forms

\`op ANY (set)\` and \`op ALL (set)\` compare \`x\` against every element with operator \`op\`:

| expression | meaning |
|---|---|
| \`x = ANY (set)\` | \`x\` equals at least one element → **same as \`IN\`** |
| \`x <> ALL (set)\` | \`x\` differs from every element → **same as \`NOT IN\`** |
| \`x > ALL (set)\` | \`x\` is greater than every element → \`x > max(set)\` |
| \`x > ANY (set)\` | \`x\` is greater than at least one element → \`x > min(set)\` |
| \`x < ANY (set)\` | \`x\` is less than at least one → \`x < max(set)\` |

\`> ALL\` and \`> ANY\` are how you say "above everything in this group" or "above something in this group" without a separate \`max()\`/\`min()\` subquery. \`ANY\` has a synonym \`SOME\` (identical).

## Empty-set behaviour (worth memorising)

When the subquery returns **no rows**:

- \`x = ANY (∅)\` → \`FALSE\` (nothing to match) → and so \`x IN (∅)\` is \`FALSE\`
- \`x <> ALL (∅)\` → \`TRUE\` (vacuously differs from everything) → \`x NOT IN (∅)\` is \`TRUE\`
- \`x > ALL (∅)\` → \`TRUE\`
- \`x > ANY (∅)\` → \`FALSE\`

So \`NOT IN\` an empty subquery keeps **all** rows; \`IN\` an empty subquery keeps **none**. This is consistent and usually what you want.

## The \`NOT IN\` + \`NULL\` trap — in full

\`x NOT IN (subquery)\` expands to \`x <> v1 AND x <> v2 AND ... AND x <> vN\`. Now suppose one \`vk\` is \`NULL\`. Then \`x <> NULL\` evaluates to **\`UNKNOWN\`** (three-valued logic — Module 1). And:

\`\`\`
TRUE  AND TRUE  AND UNKNOWN  →  UNKNOWN
FALSE AND TRUE  AND UNKNOWN  →  FALSE
\`\`\`

The result is **never \`TRUE\`** — it is \`UNKNOWN\` when \`x\` matches none of the non-NULL values, and \`FALSE\` when \`x\` matches one. \`WHERE\` keeps only \`TRUE\` rows, so the query returns **zero rows, always**, regardless of the data — the moment a single \`NULL\` is in that column.

Why is this so dangerous? Because:

- It is **silent** — no error, just an empty result.
- It is **data-dependent** — the query works for months, then someone inserts one row with a \`NULL\` foreign key (a soft delete, a bad import) and the report goes blank.
- \`IN\` (without \`NOT\`) does **not** have this problem — a \`NULL\` in the list just never matches, which is harmless.

## The fixes, in order of preference

1. **\`NOT EXISTS\` with a correlated subquery** — the recommended form. It asks "is there a matching row?" directly; a \`NULL\` in the inner table fails the correlation and is ignored. NULL-safe by construction.

   \`\`\`sql
   WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)
   \`\`\`

2. **Add \`WHERE col IS NOT NULL\` to the subquery** — removes the \`NULL\` before it can poison the \`NOT IN\`. Works, but you must remember to do it every time.

3. **\`LEFT JOIN ... WHERE right.key IS NULL\`** — the anti-join written as a join. Correct, but \`NOT EXISTS\` is usually clearer.

4. **\`NOT IN\` a hard-coded literal list** — \`WHERE status NOT IN ('deleted', 'archived')\` — is completely safe, because you can see there is no \`NULL\`. The trap is only with **subqueries** whose column is nullable.

## Team rule

Most style guides ban \`NOT IN (subquery)\` outright — \`NOT EXISTS\` or \`LEFT JOIN ... IS NULL\` only. \`IN (subquery)\` is fine; \`NOT IN\` a literal list is fine; \`NOT IN\` a subquery is the one to avoid.`,

    contentHi: `## \`IN\` — membership

\`x IN (v1, v2, v3)\` \`TRUE\` hai agar \`x\` listed values mein se **kisi ek** ke barabar hai. Ye theek \`x = v1 OR x = v2 OR x = v3\` hai. List ho sakti hai:
- **literals:** \`WHERE status IN ('a', 'b', 'c')\`
- **ek column lौtane waali subquery:** \`WHERE id IN (SELECT user_id FROM admins)\`
- **ek row constructor list.**

\`IN (subquery)\` ek **semi-join** hai — ye outer rows filter karता hai aur kabhi multiply nahi karता.

## \`ANY\` aur \`ALL\` — general forms

| expression | matlab |
|---|---|
| \`x = ANY (set)\` | \`x\` kam se kam ek element ke barabar → **\`IN\` jaisा** |
| \`x <> ALL (set)\` | \`x\` har element se alag → **\`NOT IN\` jaisा** |
| \`x > ALL (set)\` | \`x\` har element se zyada → \`x > max(set)\` |
| \`x > ANY (set)\` | \`x\` kam se kam ek se zyada → \`x > min(set)\` |

\`> ALL\` aur \`> ANY\` wo tarika hain "is group mein sab se upar" ya "is group mein kuch se upar" kehne ka. \`ANY\` ka ek synonym \`SOME\` hai.

## Empty-set behaviour (yaad rakhne layak)

Jab subquery **koi rows nahi** lौtaती:
- \`x = ANY (∅)\` → \`FALSE\` → \`x IN (∅)\` \`FALSE\`
- \`x <> ALL (∅)\` → \`TRUE\` → \`x NOT IN (∅)\` \`TRUE\`
- \`x > ALL (∅)\` → \`TRUE\`; \`x > ANY (∅)\` → \`FALSE\`

To ek empty subquery ka \`NOT IN\` **sabhi** rows rakhता hai; \`IN\` **koi nahi**.

## \`NOT IN\` + \`NULL\` trap — poora

\`x NOT IN (subquery)\` \`x <> v1 AND x <> v2 AND ... AND x <> vN\` mein expand hoता hai. Ab maान lo ek \`vk\` \`NULL\` hai. To \`x <> NULL\` **\`UNKNOWN\`** evaluate hoता hai. Aur:

\`\`\`
TRUE  AND TRUE  AND UNKNOWN  →  UNKNOWN
FALSE AND TRUE  AND UNKNOWN  →  FALSE
\`\`\`

Result **kabhi \`TRUE\` nahi** — \`WHERE\` sirf \`TRUE\` rows rakhता hai, to query **zero rows lौtaती hai, hamesha** — jis pal ek single \`NULL\` us column mein hai.

Ye itna khatarnak kyun?
- Ye **silent** hai — koi error nahi.
- Ye **data-dependent** hai — query mahinों kaam karती hai, phir koi ek \`NULL\` foreign key waali row insert karता hai aur report blank ho jaती hai.
- \`IN\` (bина \`NOT\`) mein ye problem **nahi** hai.

## Fixes, preference ke order mein

1. **\`NOT EXISTS\` ek correlated subquery ke saath** — recommended. NULL-safe by construction.
2. **Subquery mein \`WHERE col IS NOT NULL\` add karo.**
3. **\`LEFT JOIN ... WHERE right.key IS NULL\`.**
4. **\`NOT IN\` ek hard-coded literal list** — poori tarah safe. Trap sirf **subqueries** ke saath hai jinka column nullable hai.

## Team rule

Zyadातar style guides \`NOT IN (subquery)\` ko outright ban karते hain — sirf \`NOT EXISTS\` ya \`LEFT JOIN ... IS NULL\`.`,

    examples: [
      {
        title: 'IN (list), = ANY, and > ALL / > ANY against a set',
        titleHi: 'IN (list), = ANY, aur ek set ke against > ALL / > ANY',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES
  (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110),(4,'Di','sales',90);

-- IN a literal list
SELECT name FROM emp WHERE dept IN ('eng','ops') ORDER BY name;

-- > ALL (sales salaries are 110 and 90) -> salary > 110 -> only Ada
SELECT name FROM emp WHERE salary > ALL (SELECT salary FROM emp WHERE dept='sales') ORDER BY name;

-- > ANY (sales salaries) -> salary > 90 -> Ada, Bo, Cy
SELECT name FROM emp WHERE salary > ANY (SELECT salary FROM emp WHERE dept='sales') ORDER BY name;`,
        output: ` name
------
 Ada
 Bo
(2 rows)

 name
------
 Ada
(1 row)

 name
------
 Ada
 Bo
 Cy
(3 rows)`,
        explain: "`dept IN ('eng', 'ops')` == `dept = 'eng' OR dept = 'ops'` -> Ada, Bo (no one is in `ops`). `salary > ALL (sales salaries 110, 90)` means greater than EVERY sales salary, i.e. `> 110` -> Ada only. `salary > ANY (sales salaries)` means greater than AT LEAST ONE, i.e. `> 90` -> Ada, Bo, Cy.",
        explainHi: "`dept IN ('eng', 'ops')` == `dept = 'eng' OR dept = 'ops'` -> Ada, Bo. `salary > ALL (sales salaries 110, 90)` matlab HAR sales salary se zyada, yaani `> 110` -> sirf Ada. `salary > ANY (sales salaries)` matlab KAM SE KAM EK se zyada, yaani `> 90` -> Ada, Bo, Cy.",
      },
      {
        title: 'The NOT IN NULL trap: one NULL in the subquery empties the result',
        titleHi: 'NOT IN NULL trap: subquery mein ek NULL result khaali kar deta hai',
        code: `CREATE TABLE emp (id int, name text, salary int);
INSERT INTO emp VALUES (1,'Ada',120),(2,'Bo',95),(3,'Cy',110),(4,'Di',90);
CREATE TABLE tn (v int);
INSERT INTO tn VALUES (95), (NULL);          -- one real value, one NULL

-- NOT IN a subquery containing a NULL -> ZERO rows, regardless of data
SELECT name FROM emp WHERE salary NOT IN (SELECT v FROM tn) ORDER BY name;

-- NOT EXISTS is NULL-safe -> Ada, Cy, Di (everyone except Bo who earns 95)
SELECT name FROM emp WHERE NOT EXISTS (SELECT 1 FROM tn WHERE tn.v = emp.salary) ORDER BY name;

-- or filter the NULL out of the subquery
SELECT name FROM emp WHERE salary NOT IN (SELECT v FROM tn WHERE v IS NOT NULL) ORDER BY name;`,
        output: ` name
------
(0 rows)

 name
------
 Ada
 Cy
 Di
(3 rows)

 name
------
 Ada
 Cy
 Di
(3 rows)`,
        explain: '`tn` contains `95` and `NULL`. `salary NOT IN (SELECT v FROM tn)` expands to `salary <> 95 AND salary <> NULL`. `salary <> NULL` is `UNKNOWN` for every row, so the `AND` is never `TRUE` -> ZERO rows, regardless of data. `NOT EXISTS` is NULL-safe (the `NULL` row just fails the correlation) -> Ada, Cy, Di. Filtering `WHERE v IS NOT NULL` out of the subquery is the other fix.',
        explainHi: '`tn` mein `95` aur `NULL` hai. `salary NOT IN (SELECT v FROM tn)` `salary <> 95 AND salary <> NULL` mein expand hoता hai. `salary <> NULL` har row ke liye `UNKNOWN` hai, to `AND` kabhi `TRUE` nahi -> ZERO rows. `NOT EXISTS` NULL-safe hai -> Ada, Cy, Di. Subquery se `WHERE v IS NOT NULL` filter karna doosra fix hai.',
      },
      {
        title: 'ANY / ALL against an EMPTY subquery: NOT-IN keeps all, IN keeps none',
        titleHi: 'Ek KHAALI subquery ke against ANY / ALL: NOT-IN sab rakhta hai, IN koi nahi',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES (1,'Ada','eng',120),(2,'Bo','eng',95);

-- subquery matches no rows -> > ALL (empty) is vacuously TRUE -> all employees
SELECT name FROM emp WHERE salary > ALL (SELECT salary FROM emp WHERE dept='nope') ORDER BY name;

-- > ANY (empty) is FALSE -> no employees
SELECT name FROM emp WHERE salary > ANY (SELECT salary FROM emp WHERE dept='nope') ORDER BY name;

-- NOT IN (empty) keeps everyone
SELECT name FROM emp WHERE salary NOT IN (SELECT salary FROM emp WHERE dept='nope') ORDER BY name;`,
        output: ` name
------
 Ada
 Bo
(2 rows)

 name
------
(0 rows)

 name
------
 Ada
 Bo
(2 rows)`,
        explain: 'Against an EMPTY subquery: `salary > ALL (∅)` is vacuously `TRUE` (there is nothing to fail against) -> all employees. `salary > ANY (∅)` is `FALSE` (nothing to exceed) -> no employees. `salary NOT IN (∅)` is `TRUE` -> all employees. This is consistent: `NOT IN`/`> ALL` of nothing keeps everything; `IN`/`> ANY` of nothing keeps nothing.',
        explainHi: 'Ek EMPTY subquery ke against: `salary > ALL (∅)` vacuously `TRUE` hai -> sabhi employees. `salary > ANY (∅)` `FALSE` hai -> koi employee nahi. `salary NOT IN (∅)` `TRUE` hai -> sabhi employees. Ye consistent hai: kuch nahi ka `NOT IN`/`> ALL` sab kuch rakhता hai; kuch nahi ka `IN`/`> ANY` kuch nahi rakhता.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "customers who have never placed an order"
SELECT c.name
FROM customer c
WHERE c.id NOT IN (SELECT customer_id FROM orders);
-- works in testing, returns ZERO rows in production once one order has a NULL customer_id`,
        right: `SELECT c.name
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
        why: 'NOT IN against a subquery expands to a chain of not-equal tests joined by AND. If the subquery ever yields a NULL, one test becomes id not-equal NULL, which is UNKNOWN, and an AND chain containing UNKNOWN can be FALSE or UNKNOWN but never TRUE, so WHERE keeps nothing and the query silently returns zero rows for all inputs. A nullable customer_id, from a soft-deleted customer or an incomplete import, is enough to trigger it, and because it is data-dependent it can pass every test and then break in production. NOT EXISTS asks whether a correlated matching row exists and treats a NULL inner row as simply not matching, which is the correct behaviour and is not affected by NULLs at all.',
        whyHi: 'Ek subquery ke against NOT IN not-equal tests ki ek chain mein expand hoता hai jo AND se judi hai. Agar subquery kabhi ek NULL deती hai, ek test id not-equal NULL ban jaता hai, jo UNKNOWN hai, aur UNKNOWN waali ek AND chain kabhi TRUE nahi, to WHERE kuch nahi rakhता. Ek nullable customer_id ise trigger karne ke liye kaafi hai, aur kyunki ye data-dependent hai ye har test pass kar sakती hai phir production mein toot sakती hai. NOT EXISTS NULLs se bilkul affected nahi.',
      },
      {
        wrong: `-- "the highest paid employee(s)" -- using a subquery in the wrong place
SELECT name FROM emp WHERE salary = (SELECT salary FROM emp ORDER BY salary DESC);
-- ERROR: more than one row returned by a subquery used as an expression`,
        right: `-- option A: > ALL
SELECT name FROM emp WHERE salary >= ALL (SELECT salary FROM emp);
-- option B: scalar with an aggregate
SELECT name FROM emp WHERE salary = (SELECT max(salary) FROM emp);`,
        why: 'The subquery SELECT salary FROM emp ORDER BY salary DESC returns every salary, one per employee, so using it after equals, where a single value is expected, raises the more-than-one-row error; the ORDER BY does not make it a single value. To compare against the top of a set you either aggregate it to a single value with max and use a plain equals, or you keep the set and use an operator that works over a set: salary greater-or-equal ALL of the salaries means salary is at least as large as every salary, i.e. it is a maximum. Both handle ties, returning all employees at the top salary.',
        whyHi: 'Subquery SELECT salary FROM emp ORDER BY salary DESC har salary lौtaती hai, prati employee ek, to ise equals ke baad istemal karna, jahaan ek single value expected hai, more-than-one-row error raise karता hai; ORDER BY ise ek single value nahi banाता. Set ke top ke against compare karne ke liye aap ya ise max se ek single value mein aggregate karो, ya aap set rakhो aur ek operator istemal karो jo ek set par kaam karता hai: salary greater-or-equal ALL matlab salary har salary se kam se kam utni badी hai.',
      },
      {
        wrong: `-- exclude a few known-bad statuses -- but read from a lookup table
SELECT * FROM job WHERE status NOT IN (SELECT status FROM excluded_status);
-- if excluded_status ever has a NULL row, every job disappears`,
        right: `SELECT j.* FROM job j
WHERE NOT EXISTS (SELECT 1 FROM excluded_status e WHERE e.status = j.status);
-- or, if you trust the lookup table's shape:
-- ... WHERE status NOT IN (SELECT status FROM excluded_status WHERE status IS NOT NULL);`,
        why: 'Even a small, seemingly controlled lookup table is still a subquery, and the NOT IN NULL trap applies the moment a NULL row appears in it, whether from a migration that added a nullable column, a manual insert, or an ETL bug. The result is the same catastrophic silent emptying of the outer query. NOT EXISTS is immune. If you have strong guarantees about the lookup table you can add an explicit IS NOT NULL guard to the subquery, but NOT EXISTS removes the need to reason about it at all and is the safer default for anything reading from another table.',
        whyHi: 'Ek chhoti, seemingly controlled lookup table bhi ek subquery hai, aur NOT IN NULL trap us pal apply hoता hai jab isme ek NULL row aata hai, chahे ek migration se, ek manual insert se, ya ek ETL bug se. Natija wahi catastrophic silent emptying hai. NOT EXISTS immune hai. Agar aapke paas lookup table ke baare mein strong guarantees hain aap ek explicit IS NOT NULL guard add kar sakte ho, par NOT EXISTS ise reason karne ki zaroorat hi hata deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A linter rule that rejects `NOT IN (SELECT ...)` in any migration or query file** and points the author to `NOT EXISTS` — added after a `NOT IN` over a nullable `parent_id` blanked an admin report.',
        hi: '**Ek linter rule jo kisi bhi file mein `NOT IN (SELECT ...)` reject karता hai** aur author ko `NOT EXISTS` ki taraf point karता hai.',
      },
      {
        en: '**`WHERE tier >= ALL (SELECT tier FROM plan WHERE active)` to find the top active plan tier** without a separate `max()` round trip.',
        hi: '**Top active plan tier dhoondne ke liye `WHERE tier >= ALL (SELECT tier FROM plan WHERE active)`** bина ek alag `max()` ke.',
      },
      {
        en: '**A feature-flag check `WHERE user_id = ANY (SELECT user_id FROM beta_cohort)`** — `= ANY` reads naturally here and is exactly `IN`, safe because it is not negated.',
        hi: '**Ek feature-flag check `WHERE user_id = ANY (SELECT user_id FROM beta_cohort)`** — `= ANY` yahaan natural padhता hai aur theek `IN` hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the `NOT IN` NULL trap and how to avoid it.',
        qHi: '`NOT IN` NULL trap samjhao aur ise kaise avoid karें.',
        a: 'x NOT IN of a set expands to x not-equal to the first value AND x not-equal to the second AND so on. If any value in that set is NULL, the corresponding test is x not-equal NULL, which under three-valued logic is UNKNOWN, not TRUE or FALSE. An AND chain that contains an UNKNOWN can evaluate to FALSE, if some other test is FALSE, or to UNKNOWN, if all the definite tests are TRUE, but it can never evaluate to TRUE. Since WHERE only keeps rows where the condition is TRUE, the entire query returns zero rows, for every possible input, the instant one NULL is present in that column. It is dangerous because it is silent, no error, just an empty result, and data-dependent, so the query can work correctly until someone inserts a single row with a NULL in the relevant column, at which point a report or a job quietly produces nothing. The fix is to use NOT EXISTS with a correlated subquery, which asks directly whether a matching row exists and treats a NULL inner row as simply not a match. Alternatively add an explicit IS NOT NULL filter inside the subquery, or use a LEFT JOIN with a WHERE that the right key IS NULL. Plain IN, without NOT, does not have the problem, and NOT IN against a hardcoded literal list you can see contains no NULL is also safe.',
        aHi: 'x NOT IN of a set x not-equal to first value AND x not-equal to second AND aage mein expand hoता hai. Agar us set mein koi value NULL hai, corresponding test x not-equal NULL hai, jo three-valued logic mein UNKNOWN hai. Ek AND chain jisme UNKNOWN hai FALSE evaluate ho sakती hai ya UNKNOWN, par kabhi TRUE nahi. Kyunki WHERE sirf TRUE rows rakhता hai, poori query zero rows lौtaती hai, har possible input ke liye, jis pal ek NULL us column mein hai. Ye khatarnak hai kyunki silent hai aur data-dependent hai. Fix NOT EXISTS istemal karna hai. Ya subquery ke andar ek explicit IS NOT NULL filter add karो. Plain IN mein problem nahi hai.',
      },
      {
        q: 'What do `> ALL` and `> ANY` mean, and how do `IN` / `NOT IN` relate to `ANY` / `ALL`?',
        qHi: '`> ALL` aur `> ANY` ka kya matlab hai, aur `IN` / `NOT IN` `ANY` / `ALL` se kaise related hain?',
        a: 'ANY and ALL apply a comparison operator between a single value on the left and every element of a set on the right. x greater-than ALL of the set is TRUE when x exceeds every element, which is the same as x greater than the maximum of the set. x greater-than ANY of the set is TRUE when x exceeds at least one element, the same as x greater than the minimum. They let you compare against a whole set without a separate max or min subquery. IN and NOT IN are special cases. x IN of a set is exactly x equals ANY of the set, and x NOT IN of a set is exactly x not-equal to ALL of the set. That equivalence is also why the NULL trap exists: NOT IN is not-equal ALL, and not-equal against a NULL element is UNKNOWN, which drags the ALL down so it is never TRUE. One more detail worth knowing is the empty-set behaviour: against an empty subquery, greater-than ALL and NOT IN are vacuously TRUE, keeping every row, while greater-than ANY and IN are FALSE, keeping none.',
        aHi: 'ANY aur ALL left par ek single value aur right par ek set ke har element ke beech ek comparison operator apply karते hain. x greater-than ALL of the set TRUE hai jab x har element se zyada hai, jo x greater than the maximum of the set jaisा hai. x greater-than ANY TRUE hai jab x kam se kam ek se zyada hai. IN aur NOT IN special cases hain. x IN of a set theek x equals ANY hai, aur x NOT IN theek x not-equal to ALL hai. Wo equivalence hi NULL trap ki wajah hai. Empty-set behaviour: ek empty subquery ke against, greater-than ALL aur NOT IN vacuously TRUE hain, jabki greater-than ANY aur IN FALSE hain.',
      },
    ],

    exercises: [
      {
        task: 'Table `emp(name text, salary int)` with salaries `120, 95, 110, 90`. Table `bad(v int)` with rows `(95)` and `(NULL)`. Run `SELECT name FROM emp WHERE salary NOT IN (SELECT v FROM bad)` and confirm you get ZERO rows. Then rewrite with `NOT EXISTS` and confirm you get `Ada, Cy, Di`.',
        taskHi: 'Table `emp(name, salary)` salaries `120, 95, 110, 90` ke saath. Table `bad(v int)` rows `(95)` aur `(NULL)` ke saath. `SELECT name FROM emp WHERE salary NOT IN (SELECT v FROM bad)` chalao — ZERO rows. Phir `NOT EXISTS` se rewrite karo.',
        hint: 'The `NULL` in `bad` makes `salary <> NULL` = `UNKNOWN` for every row, so the `AND` chain is never `TRUE`. `NOT EXISTS (SELECT 1 FROM bad WHERE bad.v = emp.salary)` ignores the `NULL` row.',
        hintHi: '`bad` mein `NULL` har row ke liye `salary <> NULL` = `UNKNOWN` banाता hai. `NOT EXISTS` `NULL` row ignore karता hai.',
      },
      {
        task: 'Table `emp(name text, dept text, salary int)`. Use `>= ALL` to find the employee(s) with the maximum salary company-wide: `WHERE salary >= ALL (SELECT salary FROM emp)`. Confirm it handles a tie (insert two employees on the same top salary and check both appear).',
        taskHi: 'Table `emp(name, dept, salary)`. Company-wide maximum salary waale employee(s) `>= ALL` se dhoondo: `WHERE salary >= ALL (SELECT salary FROM emp)`.',
        hint: '`salary >= ALL (all salaries)` means "no salary is bigger", i.e. this row is at the max. It returns every row tied at the top, unlike `LIMIT 1`.',
        hintHi: '`salary >= ALL (all salaries)` matlab "koi salary badी nahi", yaani ye row max par hai. Top par tied har row lौtaता hai.',
      },
      {
        task: 'Table `emp(name text, dept text)`. Write a query with `dept = ANY (SELECT name FROM valid_dept)` and a parallel one with `dept IN (SELECT name FROM valid_dept)`. Confirm identical results. Then make `valid_dept` empty and confirm both return zero rows (the `IN` / `= ANY` empty-set behaviour).',
        taskHi: 'Table `emp(name, dept)`. `dept = ANY (SELECT name FROM valid_dept)` aur `dept IN (SELECT name FROM valid_dept)` waali queries likho. Phir `valid_dept` khaali karo — dono zero rows.',
        hint: '`= ANY (subquery)` and `IN (subquery)` are the same operation. Against an empty subquery both are `FALSE` for every row, so the result is empty (contrast `NOT IN` empty -> all rows).',
        hintHi: '`= ANY (subquery)` aur `IN (subquery)` same hain. Ek empty subquery ke against dono har row ke liye `FALSE`.',
      },
    ],

    keyTakeaways: [
      '`x IN (v1, v2, v3)` == `x = v1 OR x = v2 OR x = v3`. The list can be literals, a one-column subquery, or a row-constructor list. `IN (subquery)` is a SEMI-join — filters outer rows, never multiplies.',
      '`x = ANY (set)` == `IN`. `x <> ALL (set)` == `NOT IN`. `x > ALL (set)` == `x > max(set)`. `x > ANY (set)` == `x > min(set)`. `ANY` has synonym `SOME`. Use `> ALL`/`> ANY` to compare against a whole set with no separate `max()`/`min()`.',
      'EMPTY-SET behaviour: against a subquery returning no rows, `x IN (∅)` / `x = ANY (∅)` / `x > ANY (∅)` are `FALSE` (keep NO rows); `x NOT IN (∅)` / `x <> ALL (∅)` / `x > ALL (∅)` are vacuously `TRUE` (keep ALL rows).',
      'THE `NOT IN` + `NULL` TRAP: `x NOT IN (subquery)` expands to `x <> v1 AND x <> v2 AND ...`. ONE `NULL` in the subquery -> `x <> NULL` = `UNKNOWN` -> the `AND` chain is NEVER `TRUE` -> the query returns ZERO ROWS, for ALL inputs, silently. Plain `IN` (no `NOT`) is NOT affected.',
      'Why it\'s dangerous: SILENT (no error), and DATA-DEPENDENT — works for months, then one row with a `NULL` FK (soft delete / bad import) blanks the report.',
      'FIXES (in order): (1) `NOT EXISTS (SELECT 1 FROM ... WHERE <correlation>)` — NULL-safe by construction, recommended; (2) add `WHERE col IS NOT NULL` to the subquery; (3) `LEFT JOIN ... WHERE right.key IS NULL`. `NOT IN` a HARD-CODED literal list (`status NOT IN (\'deleted\', \'archived\')`) is completely safe — the trap is subqueries only.',
      'Team rule in most style guides: `NOT IN (subquery)` is BANNED — `NOT EXISTS` or `LEFT JOIN ... IS NULL` only. `IN (subquery)` is fine; `NOT IN` a literal list is fine.',
    ],
    keyTakeawaysHi: [
      '`x IN (v1, v2, v3)` == `x = v1 OR x = v2 OR x = v3`. List literals, ek one-column subquery, ya ek row-constructor list ho sakti hai. `IN (subquery)` ek SEMI-join hai.',
      '`x = ANY (set)` == `IN`. `x <> ALL (set)` == `NOT IN`. `x > ALL (set)` == `x > max(set)`. `x > ANY (set)` == `x > min(set)`. `ANY` ka synonym `SOME`.',
      'EMPTY-SET: koi rows na lौtane waali subquery ke against, `x IN (∅)` / `x = ANY (∅)` / `x > ANY (∅)` `FALSE` hain (KOI rows nahi); `x NOT IN (∅)` / `x <> ALL (∅)` / `x > ALL (∅)` vacuously `TRUE` hain (SABHI rows).',
      '`NOT IN` + `NULL` TRAP: `x NOT IN (subquery)` `x <> v1 AND x <> v2 AND ...` mein expand hoता hai. Subquery mein EK `NULL` -> `x <> NULL` = `UNKNOWN` -> `AND` chain KABHI `TRUE` nahi -> query ZERO ROWS lौtaती hai, SAB inputs ke liye, silently. Plain `IN` affected NAHI.',
      'Khatarnak kyun: SILENT (koi error nahi), aur DATA-DEPENDENT — mahinों kaam karता hai, phir ek `NULL` FK waali row report blank kar deती hai.',
      'FIXES: (1) `NOT EXISTS (SELECT 1 FROM ... WHERE <correlation>)` — NULL-safe, recommended; (2) subquery mein `WHERE col IS NOT NULL`; (3) `LEFT JOIN ... WHERE right.key IS NULL`. Ek HARD-CODED literal list ka `NOT IN` poori tarah safe hai.',
      'Zyadातar style guides ka team rule: `NOT IN (subquery)` BANNED — sirf `NOT EXISTS` ya `LEFT JOIN ... IS NULL`.',
    ],
  },
];
