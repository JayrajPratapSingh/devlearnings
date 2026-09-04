/**
 * Databases Complete Course — Module 5: Subqueries & CTEs, lessons 4-6.
 *
 * Lesson 4: Common Table Expressions (WITH) — naming a subquery, chaining several,
 *           referencing an earlier CTE, CTE vs subquery vs view, and PostgreSQL's
 *           inline-by-default behaviour with the MATERIALIZED / NOT MATERIALIZED hint.
 * Lesson 5: Recursive CTEs (WITH RECURSIVE) — the anchor + recursive term joined by
 *           UNION [ALL], walking an org chart, walking a graph with cycle detection,
 *           generating a series, and limiting depth.
 * Lesson 6: Data-modifying CTEs & choosing — WITH ... AS (INSERT/UPDATE/DELETE ...
 *           RETURNING), moving rows between tables in one statement, the snapshot
 *           semantics, and a decision guide: subquery vs join vs CTE vs EXISTS.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 5
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'sql-common-table-expressions',
    title: 'Common Table Expressions: WITH',
    titleHi: 'Common Table Expressions: WITH',
    description: 'A CTE is a named subquery written before the main query with `WITH name AS (...)`. It reads top-to-bottom like a sequence of steps, can be referenced multiple times, and later CTEs can use earlier ones. In modern PostgreSQL a CTE is inlined by default; `MATERIALIZED` forces it to run once.',
    descriptionHi: 'Ek CTE ek named subquery hai jo main query se pehle `WITH name AS (...)` se likhi jaती hai. Ye steps ke sequence ki tarah top-to-bottom padhती hai, kई baar reference ho sakती hai, aur baad ki CTEs pehli waali istemal kar sakती hain. Modern PostgreSQL mein ek CTE default se inlined hoती hai; `MATERIALIZED` ise ek baar chalाne ko force karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Writing out a recipe as numbered prep steps instead of one impossible run-on sentence.** A gnarly query with subqueries nested inside subqueries inside a `FROM` clause is like a recipe written as: "combine the thing made from whisking the thing you got by separating the thing from the other thing...". A CTE lets you write it the way a real recipe reads: "Step 1 — *the marinade*: mix these. Step 2 — *the sauce*: reduce those. Step 3: coat the chicken in the marinade, then the sauce." Each step has a **name**, each builds on the ones above, and the final query just refers to them by name. Nothing about the *result* changes — it is the same dish — but a person can now follow it, review it, and change step 2 without re-reading the whole thing. One nuance: naming a step does not mean the kitchen prepares it in a separate bowl and sets it aside; a modern kitchen may fold your "Step 1" straight into "Step 3" if that is faster. If you specifically need it prepared once and reused — because it is expensive, or you use it in three later steps — you say so explicitly (`MATERIALIZED`).',
      hi: '**Ek recipe ko numbered prep steps ke roop mein likhna, ek impossible run-on sentence ke bजाy.** Ek gnarly query jisme subqueries ke andar subqueries ek `FROM` clause mein nested hain, ek recipe ki tarah hai jo aise likhi hai: "us cheez ko combine karo jo us cheez ko whisk karne se banी jo aapको us cheez ko alag karne se milी...". Ek CTE aapको ise aise likhne deता hai jaise ek real recipe padhती hai: "Step 1 — *marinade*: ye mix karo. Step 2 — *sauce*: wo reduce karo. Step 3: chicken ko marinade mein coat karo, phir sauce mein." Har step ka ek **naam** hai, har ek upar waalon par banता hai. *Result* ke baare mein kuch nahi badalता. Ek nuance: ek step ko naam dena matlab nahi ki kitchen use ek alag bowl mein prepare karके rakh deती hai; ek modern kitchen aapke "Step 1" ko seedhे "Step 3" mein fold kar sakती hai. Agar aapको specifically ek baar prepared aur reused chahिए — kyunki wo mehnga hai — aap explicitly kehते ho (`MATERIALIZED`).',
    },

    simple: `**A CTE names a subquery and puts it first**

\`\`\`sql
WITH dept_avg AS (
  SELECT dept, avg(salary) AS a
  FROM emp
  GROUP BY dept
)
SELECT e.name, e.salary, d.a AS dept_average
FROM emp e
JOIN dept_avg d ON d.dept = e.dept
WHERE e.salary > d.a;
\`\`\`

**Several CTEs, comma-separated; a later one can use an earlier one**

\`\`\`sql
WITH
  paid AS (
    SELECT * FROM orders WHERE status = 'paid'
  ),
  per_customer AS (
    SELECT customer_id, sum(total) AS spend
    FROM paid                          -- references the CTE above
    GROUP BY customer_id
  )
SELECT c.name, p.spend
FROM customer c
JOIN per_customer p ON p.customer_id = c.id
ORDER BY p.spend DESC;
\`\`\`

**Reference a CTE more than once (a subquery you would have to repeat)**

\`\`\`sql
WITH monthly AS (
  SELECT date_trunc('month', ts) AS m, sum(amt) AS total FROM sale GROUP BY 1
)
SELECT this.m, this.total, this.total - prev.total AS mom_change
FROM monthly this
LEFT JOIN monthly prev ON prev.m = this.m - interval '1 month';
\`\`\`

**PostgreSQL: CTE is INLINED by default (since v12); force with \`MATERIALIZED\`**

\`\`\`sql
WITH big AS MATERIALIZED (        -- run once, store the result, reuse it
  SELECT * FROM huge_view WHERE active
)
SELECT * FROM big JOIN other USING (id);

WITH small AS NOT MATERIALIZED (  -- always inline, even if referenced many times
  SELECT id FROM lookup WHERE kind = 'x'
)
SELECT * FROM small;
\`\`\``,

    simpleHi: `**Ek CTE ek subquery ko naam deता hai aur pehle rakhता hai**

\`\`\`sql
WITH dept_avg AS (
  SELECT dept, avg(salary) AS a
  FROM emp
  GROUP BY dept
)
SELECT e.name, e.salary, d.a AS dept_average
FROM emp e
JOIN dept_avg d ON d.dept = e.dept
WHERE e.salary > d.a;
\`\`\`

**Kई CTEs, comma-separated; baad waali pehli istemal kar sakती hai**

\`\`\`sql
WITH
  paid AS (
    SELECT * FROM orders WHERE status = 'paid'
  ),
  per_customer AS (
    SELECT customer_id, sum(total) AS spend
    FROM paid                          -- upar ki CTE reference karता hai
    GROUP BY customer_id
  )
SELECT c.name, p.spend
FROM customer c
JOIN per_customer p ON p.customer_id = c.id
ORDER BY p.spend DESC;
\`\`\`

**Ek CTE ko ek se zyada baar reference karo (ek subquery jo aapको repeat karni padती)**

\`\`\`sql
WITH monthly AS (
  SELECT date_trunc('month', ts) AS m, sum(amt) AS total FROM sale GROUP BY 1
)
SELECT this.m, this.total, this.total - prev.total AS mom_change
FROM monthly this
LEFT JOIN monthly prev ON prev.m = this.m - interval '1 month';
\`\`\`

**PostgreSQL: CTE default se INLINED hoती hai (v12 se); \`MATERIALIZED\` se force karo**

\`\`\`sql
WITH big AS MATERIALIZED (        -- ek baar chalao, result store karo, reuse karo
  SELECT * FROM huge_view WHERE active
)
SELECT * FROM big JOIN other USING (id);

WITH small AS NOT MATERIALIZED (  -- hamesha inline, kई baar reference hone par bhi
  SELECT id FROM lookup WHERE kind = 'x'
)
SELECT * FROM small;
\`\`\``,

    content: `## What a CTE is

A **Common Table Expression** is a named temporary result set defined with \`WITH\`, available only for the duration of the single statement that follows:

\`\`\`sql
WITH name AS (
  SELECT ...
)
SELECT ... FROM name ...;
\`\`\`

Inside the main query, \`name\` behaves like a table. A CTE is functionally equivalent to a **derived table** (Lesson 1), but:

- It is **named and written first**, so a complex query reads as a sequence of named steps instead of nested parentheses.
- It can be **referenced multiple times** in the main query without repeating the SQL.
- **Later CTEs can reference earlier ones**, building a pipeline.

## Multiple CTEs

Separate them with commas after the single \`WITH\`:

\`\`\`sql
WITH
  a AS ( SELECT ... ),
  b AS ( SELECT ... FROM a ... ),   -- b can use a
  c AS ( SELECT ... FROM a JOIN b ... )
SELECT ... FROM c;
\`\`\`

Each CTE sees the ones **declared before it** (and, with \`RECURSIVE\`, itself — Lesson 5). They do **not** see ones declared after. The main query sees all of them.

## CTE vs subquery vs view

| | scope | named | reusable in the query | stored |
|---|---|---|---|---|
| **derived table** (subquery in \`FROM\`) | one statement | needs an alias | no (repeat it) | no |
| **CTE** (\`WITH\`) | one statement | yes | yes | no |
| **view** | permanent | yes | yes (any query) | definition stored in the catalog |

A **view** is the right tool when the same query shape is needed across many statements — it is a CTE you do not have to keep re-typing. A **CTE** is for structuring one complex statement. A **materialized view** additionally stores the *result* on disk and is refreshed on demand (Module 11).

## The materialization question (PostgreSQL specifics)

Historically (PostgreSQL ≤ 11), a CTE was an **optimization fence**: it was always executed exactly once, its result stashed, and the planner could not push predicates into it or reorder it with the rest of the query. That made CTEs a tool for *forcing* a plan — sometimes helpfully, often accidentally slow.

**Since PostgreSQL 12**, a CTE that is (a) referenced **only once** and (b) not recursive and (c) has no side effects is **inlined** by default — folded into the main query and optimized together, exactly like a derived table. You can override:

- **\`WITH x AS MATERIALIZED (...)\`** — force the old behaviour: run once, store the result, reuse. Good when the CTE is expensive and referenced several times, or when you *want* the fence (e.g. to stop the planner from re-running a volatile function).
- **\`WITH x AS NOT MATERIALIZED (...)\`** — force inlining even when referenced multiple times. Good when the CTE is cheap and inlining lets the planner use an index per reference.

Other databases differ: SQL Server and Oracle generally inline; MySQL 8 materializes by default and can inline. If you rely on one behaviour, state it explicitly.

## When a CTE helps readability

- A query with **3+ levels** of nested subqueries → flatten into named steps.
- A subquery you would otherwise **paste twice** (self-comparison, month-over-month) → define once, join to itself.
- A **multi-stage transform**: filter → aggregate → rank → pick → format, each stage a CTE.
- Anywhere a reviewer would have to mentally name the subquery to discuss it — give it that name.

## When NOT to reach for a CTE

- A single simple subquery in \`WHERE\` or \`SELECT\` — a scalar or \`EXISTS\` is more direct.
- When you need the shape in **many** queries — make a view.
- On PostgreSQL ≤ 11, be aware the fence can hurt; on 12+, a \`MATERIALIZED\` CTE referenced once still pays the fence cost.`,

    contentHi: `## Ek CTE kya hai

Ek **Common Table Expression** \`WITH\` se define kiya gaya ek named temporary result set hai, jo sirf iske baad aane waale single statement ke liye available hai:

\`\`\`sql
WITH name AS ( SELECT ... )
SELECT ... FROM name ...;
\`\`\`

Main query ke andar, \`name\` ek table ki tarah behave karता hai. Ek CTE functionally ek **derived table** (Lesson 1) ke equivalent hai, par:
- Ye **named aur pehle likhi** hoती hai — ek complex query nested parentheses ke bजाy named steps ke sequence ki tarah padhती hai.
- Ise main query mein **kई baar reference** kiya ja sakta hai bина SQL repeat kiye.
- **Baad ki CTEs pehli waali reference kar sakती hain.**

## Kई CTEs

Single \`WITH\` ke baad commas se separate karो. Har CTE **apne se pehle declare ki gayi** waali dekhती hai (aur, \`RECURSIVE\` ke saath, khud ko — Lesson 5).

## CTE vs subquery vs view

Ek **view** tab sahi tool hai jab wahi query shape kई statements mein chahिए. Ek **CTE** ek complex statement structure karne ke liye hai. Ek **materialized view** additionally *result* ko disk par store karता hai (Module 11).

## Materialization sawaal (PostgreSQL specifics)

Historically (PostgreSQL ≤ 11), ek CTE ek **optimization fence** thi: hamesha theek ek baar execute hoती, iska result stash hoता, aur planner ise reorder nahi kar sakता tha.

**PostgreSQL 12 se**, ek CTE jo (a) **sirf ek baar** referenced hai aur (b) recursive nahi hai aur (c) koi side effects nahi rakhती **default se inlined** hoती hai — main query mein fold hoती hai aur saath optimize hoती hai. Aap override kar sakte ho:
- **\`WITH x AS MATERIALIZED (...)\`** — purana behaviour force karो: ek baar chalao, store karो, reuse karो.
- **\`WITH x AS NOT MATERIALIZED (...)\`** — kई baar referenced hone par bhi inlining force karो.

Doosre databases alag hain: SQL Server aur Oracle generally inline karते hain; MySQL 8 default se materialize karता hai.

## Ek CTE readability mein kab madad karता hai

- **3+ levels** ke nested subqueries waali ek query → named steps mein flatten karो.
- Ek subquery jo aap **do baar paste** karते → ek baar define karो, khud se join karो.
- Ek **multi-stage transform**: filter → aggregate → rank → pick → format.

## Ek CTE ke liye kab NAHI

- \`WHERE\` ya \`SELECT\` mein ek single simple subquery — ek scalar ya \`EXISTS\` zyada direct hai.
- Jab aapको shape **kई** queries mein chahिए — ek view banao.`,

    examples: [
      {
        title: 'Two chained CTEs: filter, then aggregate the filtered result',
        titleHi: 'Do chained CTEs: filter, phir filtered result aggregate karo',
        code: `CREATE TABLE emp (id int, name text, dept text, salary int);
INSERT INTO emp VALUES
  (1,'Ada','eng',120),(2,'Bo','eng',95),(3,'Cy','sales',110),(4,'Di','sales',90);

WITH dept_avg AS (
  SELECT dept, avg(salary) AS a FROM emp GROUP BY dept
),
above AS (
  SELECT e.name, e.dept, e.salary
  FROM emp e
  JOIN dept_avg d ON d.dept = e.dept
  WHERE e.salary > d.a
)
SELECT * FROM above ORDER BY name;`,
        output: ` name | dept  | salary
------+-------+--------
 Ada  | eng   | 120
 Cy   | sales | 110
(2 rows)`,
        explain: "`dept_avg` computes the average salary per department; `above` then joins `emp` to it and keeps employees earning more than their own department's average. The main query just reads `above`. Two named steps read top-to-bottom instead of a nested subquery-in-a-subquery. `above` references `dept_avg` — a later CTE using an earlier one.",
        explainHi: '`dept_avg` prati department average salary compute karता hai; `above` phir `emp` ko isse join karता hai aur wo employees rakhता hai jo apne department ke average se zyada kamाते hain. Main query bस `above` padhता hai. Do named steps ek nested subquery-in-a-subquery ke bजाy top-to-bottom padhते hain. `above` `dept_avg` reference karता hai.',
      },
      {
        title: 'Referencing one CTE twice: month-over-month change via a self-join',
        titleHi: 'Ek CTE ko do baar reference karna: self-join se month-over-month change',
        code: `SET TIME ZONE 'UTC';
CREATE TABLE sale (ts timestamptz, amt int);
INSERT INTO sale VALUES
  ('2026-01-10', 100), ('2026-01-20', 50),
  ('2026-02-05', 200),
  ('2026-03-01', 90), ('2026-03-15', 60);

WITH monthly AS (
  SELECT date_trunc('month', ts)::date AS m, sum(amt) AS total
  FROM sale GROUP BY 1
)
SELECT cur.m::text AS month, cur.total,
       cur.total - prev.total AS mom_change
FROM monthly cur
LEFT JOIN monthly prev ON prev.m = (cur.m - interval '1 month')::date
ORDER BY cur.m;`,
        output: ` month      | total | mom_change
------------+-------+------------
 2026-01-01 | 150   | NULL
 2026-02-01 | 200   | 50
 2026-03-01 | 150   | -50
(3 rows)`,
        explain: 'The `monthly` CTE (sum per month) is referenced TWICE — once as `cur`, once as `prev` — and self-joined on `prev.m = cur.m - 1 month` to line each month up with the one before it. `mom_change` is `cur.total - prev.total`. January has no prior month so `prev` is `NULL` -> `mom_change` is `NULL`. Without a CTE you would paste the monthly aggregation twice.',
        explainHi: '`monthly` CTE (prati month sum) DO baar referenced hai — ek baar `cur`, ek baar `prev` — aur `prev.m = cur.m - 1 month` par self-joined taaki har month pichle waale se line up ho. `mom_change` `cur.total - prev.total` hai. January ke pehle koi month nahi to `prev` `NULL` hai -> `mom_change` `NULL`. Bина CTE ke aap monthly aggregation do baar paste karते.',
      },
      {
        title: 'MATERIALIZED vs NOT MATERIALIZED both produce the same result',
        titleHi: 'MATERIALIZED vs NOT MATERIALIZED dono same result dete hain',
        code: `CREATE TABLE emp (id int, name text, salary int);
INSERT INTO emp VALUES (1,'Ada',120),(2,'Bo',95),(3,'Cy',110),(4,'Di',90);

WITH x AS MATERIALIZED (SELECT name FROM emp WHERE salary > 100)
SELECT * FROM x ORDER BY name;

WITH y AS NOT MATERIALIZED (SELECT name FROM emp WHERE salary > 100)
SELECT * FROM y ORDER BY name;`,
        output: ` name
------
 Ada
 Cy
(2 rows)

 name
------
 Ada
 Cy
(2 rows)`,
        explain: '`MATERIALIZED` and `NOT MATERIALIZED` produce IDENTICAL results — the keyword only changes the PLAN, never the answer. `MATERIALIZED` forces the CTE to run once and store its result (useful when it is expensive and referenced several times, or when you want an optimization fence). `NOT MATERIALIZED` forces inlining. Here, referenced once and cheap, the default (inlined) would apply anyway.',
        explainHi: '`MATERIALIZED` aur `NOT MATERIALIZED` IDENTICAL results dete hain — keyword sirf PLAN badalता hai, kabhi answer nahi. `MATERIALIZED` CTE ko ek baar chalाne aur iska result store karne ko force karता hai (useful jab ye mehnga hai aur kई baar referenced hai). `NOT MATERIALIZED` inlining force karता hai. Yahaan, ek baar referenced aur sasta, default (inlined) waise bhi apply hoता.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming a CTE is always computed once (true on PG <= 11, NOT on PG 12+)
WITH active_users AS (
  SELECT * FROM users WHERE last_seen > now() - interval '30 days'
)
SELECT * FROM active_users WHERE country = 'IN';
-- on PG 12+ this is inlined: the country filter and the last_seen filter are combined,
-- and an index on (country, last_seen) can be used -- which is what you want here`,
        right: `-- if you specifically NEED it run once (expensive CTE, referenced 3x), say so:
WITH active_users AS MATERIALIZED (
  SELECT * FROM users WHERE last_seen > now() - interval '30 days'
)
SELECT ... FROM active_users a JOIN ... ;`,
        why: 'On PostgreSQL 11 and earlier, a CTE was an optimization fence: always materialised once, and the planner could not push the outer country filter down into it, so the whole active-users set was built and then filtered. People learned to rely on that, sometimes to force a plan. PostgreSQL 12 changed the default: a CTE referenced only once, non-recursive, side-effect-free, is inlined and optimised together with the outer query, so the two filters merge and a suitable composite index is usable. That is usually better. If a query written for the old behaviour regressed, or if you have an expensive CTE used several times where one computation is genuinely better, add the MATERIALIZED keyword to opt back in explicitly rather than depending on version-specific defaults.',
        whyHi: 'PostgreSQL 11 aur pehle, ek CTE ek optimization fence thi: hamesha ek baar materialised, aur planner outer country filter ise andar push nahi kar sakता tha. Log ispar bharosa karna seekh gaye. PostgreSQL 12 ne default badla: ek CTE jo sirf ek baar referenced hai, non-recursive, side-effect-free, inlined hoती hai aur outer query ke saath optimise hoती hai. Wo aksar behtar hai. Agar purane behaviour ke liye likhi ek query regress hui, MATERIALIZED keyword add karो.',
      },
      {
        wrong: `-- a CTE used in only one place, adding nothing but a name
WITH t AS (SELECT id, name FROM customer WHERE active)
SELECT * FROM t WHERE name LIKE 'A%';`,
        right: `SELECT id, name FROM customer WHERE active AND name LIKE 'A%';
-- or keep the CTE if the real query is genuinely complex and the name aids reading`,
        why: 'A CTE earns its place when it names a non-trivial step, when it is referenced more than once, or when it turns deeply nested subqueries into a readable pipeline. Wrapping a single simple filter in a one-use CTE adds a layer of indirection and a name to track without making anything clearer. On modern PostgreSQL it will be inlined so there is no performance cost, but the reader still has to jump to the WITH block and back. Use a CTE for structure that genuinely needs structuring; for a plain filter, just write the WHERE.',
        whyHi: 'Ek CTE apni jagah kamाता hai jab ye ek non-trivial step ko naam deता hai, jab ye ek se zyada baar referenced hai, ya jab ye deeply nested subqueries ko ek readable pipeline mein badalता hai. Ek single simple filter ko ek one-use CTE mein wrap karna indirection ki ek layer add karता hai bина kuch saaf kiye. Modern PostgreSQL par ye inlined hogi to koi performance cost nahi, par reader ko phir bhi WITH block par jump karke wapas aana hoga.',
      },
      {
        wrong: `-- expecting a CTE to be visible to a LATER statement
WITH recent AS (SELECT * FROM log WHERE ts > now() - interval '1 hour')
SELECT count(*) FROM recent;

SELECT * FROM recent WHERE level = 'error';   -- ERROR: relation "recent" does not exist`,
        right: `-- a CTE lives for ONE statement only. For reuse across statements, make a view:
CREATE VIEW recent AS SELECT * FROM log WHERE ts > now() - interval '1 hour';
SELECT count(*) FROM recent;
SELECT * FROM recent WHERE level = 'error';`,
        why: 'A WITH clause is part of a single statement and its names vanish the moment that statement finishes. The second statement has no knowledge of the first statement\'s CTE, hence relation does not exist. If you need the same named query in more than one statement, that is exactly what a view is for: a stored query definition you can select from anywhere, as many times as you like. A view is essentially a permanent, reusable CTE. If you also want the result cached on disk rather than recomputed each time, a materialized view does that, at the cost of needing an explicit refresh.',
        whyHi: 'Ek WITH clause ek single statement ka hissa hai aur iske names us statement ke khatm hote hi gायab ho jaते hain. Doosre statement ko pehle statement ki CTE ka koi gyaan nahi. Agar aapको ek se zyada statement mein wahi named query chahिए, uske liye ek view hai: ek stored query definition jise aap kahin se bhi select kar sakte ho. Ek view essentially ek permanent, reusable CTE hai.',
      },
    ],

    realWorld: [
      {
        en: '**A funnel query as five CTEs — `signups`, `activated`, `subscribed`, `retained_30d`, `retained_90d`** — each filtering the one above, so the final `SELECT` is just five `count(*)`s and the logic reads like a report.',
        hi: '**Ek funnel query paanch CTEs ke roop mein** — har ek upar waali ko filter karके, to final `SELECT` bस paanch `count(*)`s hai.',
      },
      {
        en: '**`WITH ranked AS (SELECT *, row_number() OVER (...) rn FROM x) SELECT * FROM ranked WHERE rn <= 3`** — the standard "top-N per group" shape, where the CTE exists purely so you can `WHERE` on the window result (Module 6).',
        hi: '**`WITH ranked AS (SELECT *, row_number() OVER (...) rn FROM x) SELECT * FROM ranked WHERE rn <= 3`** — standard "top-N per group" shape.',
      },
      {
        en: '**A reconciliation query with `WITH ours AS MATERIALIZED (...), theirs AS MATERIALIZED (...)`** — `MATERIALIZED` on purpose so each expensive side is computed exactly once before the full-outer-join comparison.',
        hi: '**Ek reconciliation query `WITH ours AS MATERIALIZED (...), theirs AS MATERIALIZED (...)` ke saath** — har mehnga side theek ek baar compute hoता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a CTE, and how does it differ from a derived table and from a view?',
        qHi: 'Ek CTE kya hai, aur ye ek derived table aur ek view se kaise alag hai?',
        a: 'A CTE, introduced by WITH, is a named subquery that exists for the duration of one statement. You write it before the main query, give it a name, and then refer to that name as if it were a table. Compared with a derived table, a subquery in the FROM clause, a CTE is functionally the same but it is named and placed first, it can be referenced more than once without repeating the SQL, and later CTEs in the same WITH can build on earlier ones, so a multi-step query reads as a pipeline instead of nested parentheses. Compared with a view, the difference is lifetime and scope. A view is a stored query definition in the database catalog, usable from any statement, by anyone with permission, indefinitely. A CTE is local to the single statement and disappears when it finishes. So you use a CTE to structure one complex query and a view when the same query shape is needed across many queries. A materialized view is a third thing: it stores the actual result set on disk and must be refreshed explicitly.',
        aHi: 'Ek CTE, WITH se introduce kiya gaya, ek named subquery hai jo ek statement ke liye exist karता hai. Aap ise main query se pehle likhते ho, ise ek naam dete ho, aur phir us naam ko aise refer karते ho jaise wo ek table ho. Ek derived table ke comparison mein, ek CTE functionally same hai par ye named aur pehle placed hai, ise ek se zyada baar reference kiya ja sakta hai bина SQL repeat kiye, aur usi WITH mein baad ki CTEs pehli waali par ban sakती hain. Ek view ke comparison mein, antar lifetime aur scope hai. Ek view database catalog mein ek stored query definition hai. Ek CTE single statement ke liye local hai.',
      },
      {
        q: 'On PostgreSQL, is a CTE materialized or inlined, and when would you override the default?',
        qHi: 'PostgreSQL par, ek CTE materialized hai ya inlined, aur aap default kab override karोge?',
        a: 'It depends on the version. Through PostgreSQL 11 a CTE was always an optimization fence: executed exactly once, its result stored, and the planner could not push predicates into it or reorder it against the rest of the query. From PostgreSQL 12 the default changed: a CTE that is referenced only once, is not recursive, and has no side effects is inlined, meaning it is folded into the main query and optimized together, just like a derived table, so outer filters can be pushed in and indexes used. You override with an explicit keyword. WITH name AS MATERIALIZED forces the run-once-and-store behaviour, which you want when the CTE is expensive and referenced several times, so one computation beats several, or when you deliberately want the fence, for instance to stop a volatile function from being evaluated repeatedly. WITH name AS NOT MATERIALIZED forces inlining even when the CTE is referenced multiple times, which helps when the CTE is cheap and inlining lets each reference use its own index. Being explicit also protects a query from behaving differently across versions or across database engines, since SQL Server and Oracle inline while MySQL 8 tends to materialize.',
        aHi: 'Ye version par nirbhar karता hai. PostgreSQL 11 tak ek CTE hamesha ek optimization fence thi: theek ek baar execute, iska result stored, aur planner ise reorder nahi kar sakता tha. PostgreSQL 12 se default badla: ek CTE jo sirf ek baar referenced hai, recursive nahi hai, aur koi side effects nahi rakhती inlined hoती hai. Aap ek explicit keyword se override karते ho. WITH name AS MATERIALIZED run-once-and-store behaviour force karता hai, jo aap tab chahте ho jab CTE mehnga hai aur kई baar referenced hai. WITH name AS NOT MATERIALIZED inlining force karता hai. Explicit hona query ko versions ke beech alag behave karne se bhi bachाता hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `sale(product text, region text, amount int)`. Write a query with TWO CTEs: `by_product` (sum per product) and `total` (grand total, a 1-row CTE). Then `SELECT product, amount, round(100.0 * amount / (SELECT s FROM total), 1) AS pct` joining `by_product` to `total`. Confirm the `pct` column sums to ~100.',
        taskHi: 'Table `sale(product, region, amount)`. DO CTEs waali query: `by_product` aur `total`. Phir `by_product` ko `total` se joining karके `pct` nikालो.',
        hint: '`WITH by_product AS (SELECT product, sum(amount) AS amount FROM sale GROUP BY product), total AS (SELECT sum(amount) AS s FROM sale) SELECT ...`. The `total` CTE has one row.',
        hintHi: '`WITH by_product AS (...), total AS (SELECT sum(amount) AS s FROM sale) SELECT ...`. `total` CTE ki ek row hai.',
      },
      {
        task: 'Rewrite this nested query as chained CTEs: `SELECT * FROM (SELECT dept, avg(salary) a FROM (SELECT * FROM emp WHERE active) x GROUP BY dept) y WHERE y.a > 100`. Make `active_emp` and `dept_avg` CTEs and confirm identical output.',
        taskHi: 'Is nested query ko chained CTEs ke roop mein rewrite karो: `SELECT * FROM (SELECT dept, avg(salary) a FROM (SELECT * FROM emp WHERE active) x GROUP BY dept) y WHERE y.a > 100`.',
        hint: '`WITH active_emp AS (SELECT * FROM emp WHERE active), dept_avg AS (SELECT dept, avg(salary) AS a FROM active_emp GROUP BY dept) SELECT * FROM dept_avg WHERE a > 100`.',
        hintHi: '`WITH active_emp AS (...), dept_avg AS (SELECT dept, avg(salary) AS a FROM active_emp GROUP BY dept) SELECT * FROM dept_avg WHERE a > 100`.',
      },
      {
        task: 'Table `emp(name text, salary int)`. Write `WITH x AS MATERIALIZED (SELECT name FROM emp WHERE salary > 100) SELECT * FROM x` and the same with `NOT MATERIALIZED`. Confirm identical results. Then explain in a comment when the `MATERIALIZED` version would actually differ in a real database (expensive CTE referenced multiple times).',
        taskHi: 'Table `emp(name, salary)`. `WITH x AS MATERIALIZED (...) SELECT * FROM x` aur `NOT MATERIALIZED` waali likho. Dono same. Phir comment mein samjhao kab `MATERIALIZED` version asal mein alag hoga.',
        hint: 'Results are always identical — the keyword only affects the PLAN. `MATERIALIZED` matters when the CTE is costly and used 2+ times (compute once) or when you need the optimization fence.',
        hintHi: 'Results hamesha identical — keyword sirf PLAN affect karता hai. `MATERIALIZED` tab maayne rakhता hai jab CTE costly hai aur 2+ baar use hoती hai.',
      },
    ],

    keyTakeaways: [
      'A CTE (`WITH name AS (...)`) is a NAMED subquery written BEFORE the main query, living for ONE statement. Inside the query `name` behaves like a table. Functionally = a derived table, but named, reusable multiple times without repeating SQL, and chainable.',
      'Multiple CTEs: comma-separated after ONE `WITH`. Each CTE sees the ones DECLARED BEFORE it (and itself with `RECURSIVE`, Lesson 5); NOT ones after. The main query sees all.',
      'CTE vs derived table vs view: derived table = one statement, needs alias, not reusable in the query. CTE = one statement, named, reusable. VIEW = permanent, stored in the catalog, usable from ANY query. A view is a CTE you don\'t re-type; use it when the shape is needed across many statements.',
      'A CTE lives for ONE statement only — a later statement referencing it gets `relation "name" does not exist`. For cross-statement reuse -> `CREATE VIEW`.',
      'PostgreSQL <= 11: a CTE was ALWAYS an optimization fence (run once, result stored, no predicate push-down). PostgreSQL 12+: a CTE referenced ONCE, non-recursive, side-effect-free is INLINED by default (folded in + optimized together, like a derived table).',
      '`WITH x AS MATERIALIZED (...)` forces run-once-and-store — use when the CTE is expensive AND referenced several times, or you want the fence (e.g. stop a volatile function re-running). `WITH x AS NOT MATERIALIZED (...)` forces inlining even when referenced multiple times. Be explicit if you depend on one — other DBs differ (SQL Server/Oracle inline, MySQL 8 materializes).',
      'Reach for a CTE for: 3+ levels of nested subqueries, a subquery you\'d paste twice (self-join for month-over-month), a multi-stage transform. Do NOT wrap a single simple `WHERE`/`SELECT` subquery in a one-use CTE — a scalar or `EXISTS` is more direct.',
    ],
    keyTakeawaysHi: [
      'Ek CTE (`WITH name AS (...)`) ek NAMED subquery hai jo main query se PEHLE likhi jaती hai, EK statement ke liye. Query ke andar `name` ek table ki tarah behave karता hai. Functionally = ek derived table, par named, kई baar reusable, chainable.',
      'Kई CTEs: EK `WITH` ke baad comma-separated. Har CTE apne se PEHLE DECLARE ki gayi waali dekhती hai (aur `RECURSIVE` ke saath khud ko); baad waali NAHI.',
      'CTE vs derived table vs view: derived table = ek statement, alias chahिए, query mein reusable nahi. CTE = ek statement, named, reusable. VIEW = permanent, catalog mein stored, KISI BHI query se usable.',
      'Ek CTE sirf EK statement ke liye jeeती hai — baad ka statement ise reference karे to `relation "name" does not exist`. Cross-statement reuse ke liye -> `CREATE VIEW`.',
      'PostgreSQL <= 11: ek CTE HAMESHA ek optimization fence thi. PostgreSQL 12+: ek CTE jo EK baar referenced hai, non-recursive, side-effect-free default se INLINED hoती hai.',
      '`WITH x AS MATERIALIZED (...)` run-once-and-store force karता hai — jab CTE mehnga hai AUR kई baar referenced hai. `WITH x AS NOT MATERIALIZED (...)` inlining force karता hai. Explicit raho — doosre DBs alag hain.',
      'Ek CTE ke liye: 3+ levels nested subqueries, ek subquery jo aap do baar paste karते, ek multi-stage transform. Ek single simple `WHERE`/`SELECT` subquery ko one-use CTE mein wrap NA karो.',
    ],
  },

  {
    slug: 'sql-recursive-ctes',
    title: 'Recursive CTEs: Walking Trees and Graphs',
    titleHi: 'Recursive CTEs: Trees Aur Graphs Chalna',
    description: 'A `WITH RECURSIVE` CTE refers to itself. It has an ANCHOR term (the starting rows) and a RECURSIVE term (rows reachable from what you have so far), joined by `UNION` or `UNION ALL`. It is how SQL handles org charts, category trees, bills of materials, and graph reachability.',
    descriptionHi: 'Ek `WITH RECURSIVE` CTE khud ko refer karता hai. Iska ek ANCHOR term (starting rows) aur ek RECURSIVE term (ab tak jo hai usse reachable rows) hai, `UNION` ya `UNION ALL` se joined. Ye tarika hai jisse SQL org charts, category trees, bills of materials, aur graph reachability handle karता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Exploring a cave system by always writing down every new passage you can see from where you have already been.** You start in one chamber — that is the **anchor**: "the rooms I know about so far" begins as just this one. Then you repeat a single rule: "for every room on my known list, add any room connected to it that is not already on the list". Each pass discovers the next ring of rooms outward. You stop when a pass adds nothing new. That repeated rule is the **recursive term** — it always works from *the rooms discovered on the previous pass*, joining them to the map of passages to find the next ones. Two practical cautions map directly to SQL: if the cave has a loop, you will keep "discovering" the same rooms forever unless you carry a list of where you have been and refuse to re-enter (**cycle detection**); and if you only care about rooms within three passages of the start, you add a depth counter and stop expanding past three.',
      hi: '**Ek cave system explore karna jahaan aap hamesha har naya passage likh lete ho jo aap wahan se dekh sakte ho jahaan aap pehle ja chuke ho.** Aap ek chamber mein shuru karते ho — wo **anchor** hai: "wo rooms jo main ab tak jaanता hoon" sirf isse shuru hoता hai. Phir aap ek single rule repeat karते ho: "meri known list ke har room ke liye, koi bhi room add karो jo isse connected hai jo pehle se list par nahi hai". Har pass rooms ki agli ring discover karता hai. Aap tab rukते ho jab ek pass kuch naya add nahi karता. Wo repeated rule **recursive term** hai. Do practical cautions seedhे SQL par map hoती hain: agar cave mein ek loop hai, aap hamesha wahi rooms "discover" karते rahोge jab tak aap ek list na le jaao ki aap kahaan ja chuke ho (**cycle detection**); aur agar aapको sirf start se teen passages ke andar ke rooms chahिए, aap ek depth counter add karते ho.',
    },

    simple: `**The shape: anchor \`UNION ALL\` recursive term**

\`\`\`sql
WITH RECURSIVE cte AS (
  -- ANCHOR: the starting row(s), no reference to cte
  SELECT id, name, mgr_id, 1 AS depth
  FROM emp
  WHERE mgr_id IS NULL

  UNION ALL

  -- RECURSIVE: rows reachable from what cte already contains
  SELECT e.id, e.name, e.mgr_id, c.depth + 1
  FROM emp e
  JOIN cte c ON e.mgr_id = c.id       -- <-- cte refers to itself
)
SELECT * FROM cte;
\`\`\`

**Build a path string as you descend**

\`\`\`sql
WITH RECURSIVE chain AS (
  SELECT id, name, mgr_id, name::text AS path
  FROM emp WHERE mgr_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.mgr_id, c.path || ' > ' || e.name
  FROM emp e JOIN chain c ON e.mgr_id = c.id
)
SELECT depth, path FROM chain;
\`\`\`

**Generate a series without \`generate_series\`**

\`\`\`sql
WITH RECURSIVE n AS (
  SELECT 1 AS i
  UNION ALL
  SELECT i + 1 FROM n WHERE i < 10       -- the WHERE is the stop condition
)
SELECT i FROM n;
\`\`\`

**Graph traversal with cycle protection (carry the visited list)**

\`\`\`sql
WITH RECURSIVE reach AS (
  SELECT src, dst, ARRAY[src, dst] AS visited
  FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst, r.visited || e.dst
  FROM reach r JOIN edge e ON e.src = r.dst
  WHERE NOT e.dst = ANY(r.visited)       -- don't revisit -> no infinite loop
)
SELECT DISTINCT dst FROM reach;
\`\`\`

**\`UNION\` (dedups each step) vs \`UNION ALL\` (keeps everything, faster)**`,

    simpleHi: `**Shape: anchor \`UNION ALL\` recursive term**

\`\`\`sql
WITH RECURSIVE cte AS (
  -- ANCHOR: starting row(s), cte ka koi reference nahi
  SELECT id, name, mgr_id, 1 AS depth
  FROM emp
  WHERE mgr_id IS NULL

  UNION ALL

  -- RECURSIVE: ab tak cte mein jo hai usse reachable rows
  SELECT e.id, e.name, e.mgr_id, c.depth + 1
  FROM emp e
  JOIN cte c ON e.mgr_id = c.id       -- <-- cte khud ko refer karता hai
)
SELECT * FROM cte;
\`\`\`

**Descend karते hue ek path string banao**

\`\`\`sql
WITH RECURSIVE chain AS (
  SELECT id, name, mgr_id, name::text AS path
  FROM emp WHERE mgr_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.mgr_id, c.path || ' > ' || e.name
  FROM emp e JOIN chain c ON e.mgr_id = c.id
)
SELECT depth, path FROM chain;
\`\`\`

**Bина \`generate_series\` ke ek series generate karो**

\`\`\`sql
WITH RECURSIVE n AS (
  SELECT 1 AS i
  UNION ALL
  SELECT i + 1 FROM n WHERE i < 10       -- WHERE stop condition hai
)
SELECT i FROM n;
\`\`\`

**Cycle protection ke saath graph traversal (visited list le jाओ)**

\`\`\`sql
WITH RECURSIVE reach AS (
  SELECT src, dst, ARRAY[src, dst] AS visited
  FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst, r.visited || e.dst
  FROM reach r JOIN edge e ON e.src = r.dst
  WHERE NOT e.dst = ANY(r.visited)       -- revisit mat karो -> koi infinite loop nahi
)
SELECT DISTINCT dst FROM reach;
\`\`\`

**\`UNION\` (har step dedups) vs \`UNION ALL\` (sab rakhता hai, faster)**`,

    content: `## The structure

\`WITH RECURSIVE cte AS ( anchor  UNION [ALL]  recursive_term )\` has three parts:

1. **Anchor term** — a \`SELECT\` that does **not** reference \`cte\`. It produces the initial rows (the roots of the tree, the start node of the graph, the first number).
2. **\`UNION\`** or **\`UNION ALL\`** — combines anchor and recursive results. \`UNION\` removes duplicate rows at each step (safer for graphs, slower); \`UNION ALL\` keeps everything (correct for trees, faster).
3. **Recursive term** — a \`SELECT\` that **does** reference \`cte\`. It is run repeatedly: each iteration joins the *rows produced by the previous iteration* to the base table to find the next layer. It stops when an iteration produces **zero rows**.

The keyword is \`WITH RECURSIVE\` even if only one of several CTEs is recursive.

## How execution proceeds

\`\`\`
working_table := result of anchor
output        := working_table
loop:
  next := recursive_term, with "cte" bound to working_table
  if next is empty: stop
  append next to output
  working_table := next
\`\`\`

So the recursive term always sees **only the most recent batch**, not the whole accumulated result. That is why you thread state (depth, path, visited-array) through the columns — each row carries what the next iteration needs.

## Tree traversal: org chart / category tree

\`\`\`sql
WITH RECURSIVE subtree AS (
  SELECT id, name, parent_id, 0 AS depth
  FROM category
  WHERE id = 42                              -- start from one node

  UNION ALL

  SELECT c.id, c.name, c.parent_id, s.depth + 1
  FROM category c
  JOIN subtree s ON c.parent_id = s.id       -- children of what we have
)
SELECT repeat('  ', depth) || name AS indented, depth
FROM subtree
ORDER BY depth;
\`\`\`

Change the join direction (\`c.id = s.parent_id\`) to walk **up** to ancestors instead of down to descendants. A tree has no cycles, so \`UNION ALL\` is fine and no cycle guard is needed.

## Graph traversal: cycles will hang the query

A graph can have cycles (\`1 → 2 → 3 → 1\`). Without protection the recursive term loops forever (PostgreSQL will eventually error or you cancel it). Two defences:

**1. Carry a visited array and exclude already-seen nodes:**

\`\`\`sql
WITH RECURSIVE reach AS (
  SELECT src, dst, ARRAY[src, dst] AS path
  FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst, r.path || e.dst
  FROM reach r JOIN edge e ON e.src = r.dst
  WHERE NOT e.dst = ANY(r.path)              -- the cycle guard
)
SELECT DISTINCT dst FROM reach ORDER BY dst;
\`\`\`

**2. The SQL-standard \`CYCLE\` clause** (PostgreSQL 14+):

\`\`\`sql
WITH RECURSIVE reach AS (
  SELECT src, dst FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst FROM reach r JOIN edge e ON e.src = r.dst
)
CYCLE dst SET is_cycle USING cycle_path       -- stops when dst repeats on a path
SELECT DISTINCT dst FROM reach WHERE NOT is_cycle;
\`\`\`

## Always bound the recursion

Even for a tree, a bad \`parent_id\` (a row that is its own ancestor via a data error) creates a cycle. Defensive habits:

- Add \`AND depth < 100\` to the recursive term's \`WHERE\` as a hard ceiling.
- Use \`UNION\` instead of \`UNION ALL\` if duplicates would otherwise accumulate.
- \`SET statement_timeout\` on jobs that run recursive CTEs over user data.

## Series generation

\`\`\`sql
WITH RECURSIVE d AS (
  SELECT date '2026-01-01' AS day
  UNION ALL
  SELECT day + 1 FROM d WHERE day < date '2026-01-31'
)
SELECT day FROM d;
\`\`\`

For plain integer or date series, \`generate_series(start, stop, step)\` is simpler and faster — reach for a recursive CTE when each row depends on the previous in a non-arithmetic way (running balance with resets, string building, path accumulation).

## Performance notes

- A recursive CTE is **materialized** (it is a genuine fixpoint iteration — it cannot be inlined).
- Index the join column of the recursive term (\`category.parent_id\`, \`edge.src\`) or each iteration is a full scan.
- The whole intermediate result lives in memory / temp files — a broad traversal of a large graph can be expensive. For deep hierarchy-heavy workloads some teams add a materialized \`path\` column (\`ltree\`, or a \`/1/4/42/\` string) maintained by triggers, and query that instead.`,

    contentHi: `## Structure

\`WITH RECURSIVE cte AS ( anchor  UNION [ALL]  recursive_term )\` ke teen hisse hain:

1. **Anchor term** — ek \`SELECT\` jo \`cte\` ko reference **nahi** karता. Ye initial rows produce karता hai (tree ki roots, graph ka start node).
2. **\`UNION\`** ya **\`UNION ALL\`** — \`UNION\` har step par duplicate rows hataता hai (graphs ke liye safer, slower); \`UNION ALL\` sab rakhता hai (trees ke liye sahi, faster).
3. **Recursive term** — ek \`SELECT\` jo \`cte\` ko reference **karता hai**. Ye baar-baar chalता hai: har iteration *pichli iteration dwara produce ki gayi rows* ko base table se join karता hai. Ye tab rukता hai jab ek iteration **zero rows** produce karता hai.

Keyword \`WITH RECURSIVE\` hai chahे kई CTEs mein se sirf ek recursive ho.

## Execution kaise aage badhता hai

Recursive term hamesha **sirf sabse recent batch** dekhता hai, poora accumulated result nahi. Isiliye aap state (depth, path, visited-array) columns ke through thread karते ho.

## Tree traversal: org chart / category tree

\`\`\`sql
WITH RECURSIVE subtree AS (
  SELECT id, name, parent_id, 0 AS depth FROM category WHERE id = 42
  UNION ALL
  SELECT c.id, c.name, c.parent_id, s.depth + 1
  FROM category c JOIN subtree s ON c.parent_id = s.id
)
SELECT repeat('  ', depth) || name AS indented FROM subtree ORDER BY depth;
\`\`\`

Join direction badalो (\`c.id = s.parent_id\`) to descendants ke bजाy ancestors tak **upar** chalो.

## Graph traversal: cycles query ko hang kar denge

Ek graph mein cycles ho sakti hain (\`1 → 2 → 3 → 1\`). Bина protection recursive term hamesha loop karता hai. Do defences:

**1. Ek visited array le jाओ:**

\`\`\`sql
WHERE NOT e.dst = ANY(r.path)              -- cycle guard
\`\`\`

**2. SQL-standard \`CYCLE\` clause** (PostgreSQL 14+):

\`\`\`sql
CYCLE dst SET is_cycle USING cycle_path
\`\`\`

## Hamesha recursion ko bound karो

Ek tree ke liye bhi, ek galat \`parent_id\` ek cycle banाता hai. Defensive habits:
- Recursive term ke \`WHERE\` mein \`AND depth < 100\` add karो.
- Duplicates accumulate hon to \`UNION ALL\` ke bजाy \`UNION\`.
- User data par recursive CTEs chalane waali jobs par \`SET statement_timeout\`.

## Series generation

Plain integer ya date series ke liye, \`generate_series(start, stop, step)\` simpler aur faster hai — ek recursive CTE tab istemal karो jab har row pichli par non-arithmetic tarike se nirbhar karती hai.

## Performance notes

- Ek recursive CTE **materialized** hoती hai (ise inline nahi kiya ja sakta).
- Recursive term ke join column ko index karो (\`category.parent_id\`, \`edge.src\`).
- Poora intermediate result memory / temp files mein rehता hai. Deep hierarchy-heavy workloads ke liye kuch teams ek materialized \`path\` column (\`ltree\`) add karते hain.`,

    examples: [
      {
        title: 'Recursive CTE: walk an org chart top-down, building a path',
        titleHi: 'Recursive CTE: ek org chart top-down chalो, ek path banाते hue',
        code: `CREATE TABLE org (id int, name text, mgr_id int);
INSERT INTO org VALUES
  (1,'CEO',NULL),(2,'VP-A',1),(3,'VP-B',1),(4,'Mgr-A1',2),(5,'IC-A1a',4);

WITH RECURSIVE chain AS (
  SELECT id, name, mgr_id, 1 AS depth, name::text AS path
  FROM org WHERE mgr_id IS NULL
  UNION ALL
  SELECT o.id, o.name, o.mgr_id, c.depth + 1, c.path || ' > ' || o.name
  FROM org o JOIN chain c ON o.mgr_id = c.id
)
SELECT depth, path FROM chain ORDER BY path;`,
        output: ` depth | path
-------+------------------------------
 1     | CEO
 2     | CEO > VP-A
 3     | CEO > VP-A > Mgr-A1
 4     | CEO > VP-A > Mgr-A1 > IC-A1a
 2     | CEO > VP-B
(5 rows)`,
        explain: "The ANCHOR selects the root (`mgr_id IS NULL` -> CEO) with `depth = 1` and `path = 'CEO'`. The RECURSIVE term joins `org` to the CTE on `o.mgr_id = c.id` — the direct reports of whoever is already in `chain` — incrementing `depth` and appending to `path`. Each iteration discovers the next level down; it stops when a level has no reports. `ORDER BY path` renders the tree as an indented outline.",
        explainHi: "ANCHOR root select karता hai (`mgr_id IS NULL` -> CEO) `depth = 1` aur `path = 'CEO'` ke saath. RECURSIVE term `org` ko CTE se `o.mgr_id = c.id` par join karता hai — jo bhi pehle se `chain` mein hai uske direct reports — `depth` increment karके aur `path` mein append karके. Har iteration agla level neeche discover karता hai; ye tab rukता hai jab ek level ke koi reports nahi.",
      },
      {
        title: 'Recursive CTE as a number generator with a stop condition',
        titleHi: 'Ek stop condition ke saath number generator ke roop mein recursive CTE',
        code: `WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 5     -- stops when n reaches 5
)
SELECT array_agg(n)::text AS series FROM nums;`,
        output: ` series
-------------
 {1,2,3,4,5}
(1 row)`,
        explain: 'The ANCHOR seeds `n = 1`. The RECURSIVE term emits `n + 1` from each row of the previous batch, but only `WHERE n < 5` — so from `n = 4` it emits `5`, and from `n = 5` the `WHERE` is false and it emits nothing, ending the recursion. The result is `1, 2, 3, 4, 5`. (For a plain range, `generate_series(1, 5)` is simpler — use recursion only when each row truly depends on the previous.)',
        explainHi: 'ANCHOR `n = 1` seed karता hai. RECURSIVE term pichle batch ki har row se `n + 1` emit karता hai, par sirf `WHERE n < 5` — to `n = 4` se ye `5` emit karता hai, aur `n = 5` se `WHERE` false hai aur ye kuch emit nahi karता, recursion khatm. Result `1, 2, 3, 4, 5` hai. (Ek plain range ke liye `generate_series(1, 5)` simpler hai.)',
      },
      {
        title: 'Graph reachability with a visited-array cycle guard',
        titleHi: 'Ek visited-array cycle guard ke saath graph reachability',
        code: `CREATE TABLE edge (src int, dst int);
INSERT INTO edge VALUES (1,2),(2,3),(3,1),(3,4);   -- 1->2->3->1 is a cycle

WITH RECURSIVE reach AS (
  SELECT src, dst, ARRAY[src, dst] AS visited
  FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst, r.visited || e.dst
  FROM reach r
  JOIN edge e ON e.src = r.dst
  WHERE NOT e.dst = ANY(r.visited)        -- refuse to re-enter a visited node
)
SELECT DISTINCT dst FROM reach ORDER BY dst;`,
        output: ` dst
-----
 2
 3
 4
(3 rows)`,
        explain: "The edges form a cycle `1 -> 2 -> 3 -> 1`. The recursive term carries a `visited` array and only follows an edge `WHERE NOT e.dst = ANY(r.visited)` — so once a node is on the path it is never re-entered, and the recursion terminates. Reachable-from-1 is `{2, 3, 4}` (node `1` itself is the start, not a 'reached' destination here). Without the guard this query would loop forever.",
        explainHi: 'Edges ek cycle `1 -> 2 -> 3 -> 1` banाती hain. Recursive term ek `visited` array le jाता hai aur sirf ek edge follow karता hai `WHERE NOT e.dst = ANY(r.visited)` — to ek baar ek node path par hai use kabhi re-enter nahi kiya jaता, aur recursion terminate hoती hai. 1-se-reachable `{2, 3, 4}` hai. Bина guard ke ye query hamesha loop karती.',
      },
    ],

    mistakes: [
      {
        wrong: `-- graph traversal with NO cycle guard
WITH RECURSIVE reach AS (
  SELECT src, dst FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst FROM reach r JOIN edge e ON e.src = r.dst
)
SELECT DISTINCT dst FROM reach;
-- if the graph has any cycle (1->2->3->1) this recurses forever`,
        right: `WITH RECURSIVE reach AS (
  SELECT src, dst, ARRAY[src, dst] AS visited FROM edge WHERE src = 1
  UNION ALL
  SELECT r.src, e.dst, r.visited || e.dst
  FROM reach r JOIN edge e ON e.src = r.dst
  WHERE NOT e.dst = ANY(r.visited)
)
SELECT DISTINCT dst FROM reach;
-- or use  UNION  (not UNION ALL) so repeated rows are dropped each iteration
-- or the CYCLE clause on PostgreSQL 14+`,
        why: 'The recursive term keeps following edges outward from whatever it discovered last iteration. In a graph with a cycle, node 1 leads to 2, 2 to 3, 3 back to 1, and now the traversal re-expands 1 and goes around again, forever, because nothing tells it it has been here. The fix is to remember the nodes already on the current path, as an array carried in a column, and refuse to step onto one that is already there. UNION instead of UNION ALL is a coarser fix that de-duplicates whole rows each step, which stops the loop when the rows repeat exactly but not always when a path revisits a node with different accumulated state. PostgreSQL 14 added a standard CYCLE clause that automates the visited-tracking. A tree has no cycles so it does not need this, but a self-referential data error can turn a tree into a cyclic graph, so a depth ceiling is still prudent.',
        whyHi: 'Recursive term jo bhi last iteration mein discover hua usse edges follow karता rehता hai. Ek cycle waale graph mein, node 1 2 par jaता hai, 2 3 par, 3 wapas 1 par, aur ab traversal 1 ko re-expand karता hai aur phir se ghूmता hai, hamesha. Fix current path par pehle se mojood nodes ko yaad rakhna hai, ek array ke roop mein ek column mein le jाya gaya. UNION ALL ke bजाy UNION ek coarser fix hai. PostgreSQL 14 ne ek standard CYCLE clause add kiya. Ek tree ko iski zaroorat nahi par ek self-referential data error ek tree ko cyclic bana sakता hai, to ek depth ceiling prudent hai.',
      },
      {
        wrong: `-- the recursive term references the whole accumulated result -- it does not
WITH RECURSIVE t AS (
  SELECT 1 AS n
  UNION ALL
  SELECT max(n) + 1 FROM t WHERE max(n) < 10   -- ERROR: aggregate in recursive term
)
SELECT * FROM t;`,
        right: `WITH RECURSIVE t AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM t WHERE n < 10             -- operate on the current batch's rows
)
SELECT * FROM t;`,
        why: 'In a recursive CTE, the self-reference inside the recursive term does not mean the entire result accumulated so far; it means only the rows produced by the immediately preceding iteration. Aggregates and several other constructs, DISTINCT, GROUP BY, window functions, a LEFT JOIN with the recursive table on the nullable side, are disallowed in the recursive term precisely because they would need to see the whole set. You write the recursion to work row by row on the previous batch: take each row\'s n and emit n plus one, with a WHERE that stops the emission once n reaches the limit. The stop happens naturally when the recursive term produces no rows.',
        whyHi: 'Ek recursive CTE mein, recursive term ke andar self-reference ka matlab ab tak accumulated poora result nahi hai; iska matlab sirf turant pichli iteration dwara produce ki gayi rows hai. Aggregates aur kई doosre constructs recursive term mein disallowed hain kyunki unhe poora set dekhna hoga. Aap recursion ko pichle batch par row by row kaam karne ke liye likhते ho: har row ka n lo aur n plus one emit karो, ek WHERE ke saath jo emission rokता hai.',
      },
      {
        wrong: `-- using a recursive CTE for a plain integer range
WITH RECURSIVE r AS (
  SELECT 1 AS i UNION ALL SELECT i + 1 FROM r WHERE i < 1000000
)
SELECT count(*) FROM r;
-- correct but slow -- a million iterations, each a tiny query`,
        right: `SELECT count(*) FROM generate_series(1, 1000000);
-- generate_series is a set-returning function built for exactly this`,
        why: 'A recursive CTE that just adds one each step is reimplementing generate_series by hand, and it pays a per-iteration overhead a million times over. generate_series start comma stop comma step is a single set-returning function call that the executor produces in one go, and it exists precisely to make integer, timestamp, and numeric ranges. Reserve the recursive CTE for cases where each new row genuinely depends on the previous one in a way arithmetic cannot express: accumulating a running balance that resets on certain rows, building a materialised path string, walking a hierarchy or graph. For a plain range, use the function.',
        whyHi: 'Ek recursive CTE jo bस har step ek add karता hai generate_series ko haath se reimplement kar raha hai, aur ye ek per-iteration overhead ek million baar pay karता hai. generate_series ek single set-returning function call hai jo executor ek saath produce karता hai, aur ye theek integer, timestamp, aur numeric ranges banane ke liye moujood hai. Recursive CTE ko un cases ke liye rakhो jahaan har nayi row sach mein pichli par nirbhar karती hai ek aise tarike se jise arithmetic express nahi kar sakti.',
      },
    ],

    realWorld: [
      {
        en: '**An org-chart API: `WITH RECURSIVE reports AS (anchor on the manager id UNION ALL join to direct reports)`** returning every descendant with a `depth` for indentation.',
        hi: '**Ek org-chart API: `WITH RECURSIVE reports AS (...)`** jo har descendant ko indentation ke liye ek `depth` ke saath lौtaता hai.',
      },
      {
        en: '**A bill-of-materials explosion: recursively expand `assembly → sub-assembly → part`, multiplying quantities down the tree** to get the total raw parts for a top-level product.',
        hi: '**Ek bill-of-materials explosion: `assembly → sub-assembly → part` ko recursively expand karो**, tree ke neeche quantities multiply karके.',
      },
      {
        en: '**A permissions check: `WITH RECURSIVE grp AS (...)` walking nested group memberships with a `CYCLE` clause** so a group that (mis)contains itself does not hang the auth path.',
        hi: '**Ek permissions check: `WITH RECURSIVE grp AS (...)` jo nested group memberships ko ek `CYCLE` clause ke saath walk karता hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe the structure of a recursive CTE and how it executes.',
        qHi: 'Ek recursive CTE ki structure aur ye kaise execute hoती hai batao.',
        a: 'A recursive CTE is written as WITH RECURSIVE name AS, then an anchor query, then UNION or UNION ALL, then a recursive query, and finally the outer SELECT. The anchor does not reference the CTE; it produces the starting rows, the roots of a tree or the start node of a graph. The recursive term does reference the CTE, and it is run repeatedly. Execution works like this: evaluate the anchor to get an initial working set, emit it, then repeatedly evaluate the recursive term with the CTE name bound to just the rows from the previous iteration, emit those, and make them the new working set. It stops when an iteration produces no rows. The key subtlety is that the self-reference is only the most recent batch, not the whole accumulated output, which is why you thread state like a depth counter or a path string or a visited array through the columns, so each row carries forward what the next step needs. UNION ALL keeps every row and is right for trees; UNION de-duplicates at each step and is a safety measure for graphs. Aggregates, DISTINCT, GROUP BY, and window functions are not allowed in the recursive term.',
        aHi: 'Ek recursive CTE WITH RECURSIVE name AS, phir ek anchor query, phir UNION ya UNION ALL, phir ek recursive query, aur ant mein outer SELECT ke roop mein likhi jaती hai. Anchor CTE ko reference nahi karता; ye starting rows produce karता hai. Recursive term CTE ko reference karता hai, aur ye baar-baar chalता hai. Execution: anchor evaluate karके ek initial working set lo, emit karो, phir baar-baar recursive term evaluate karो CTE name ko sirf pichli iteration ki rows se bound karके. Ye tab rukता hai jab ek iteration koi rows produce nahi karता. Key subtlety ye hai ki self-reference sirf sabse recent batch hai, poora accumulated output nahi. UNION ALL trees ke liye sahi; UNION graphs ke liye safety measure.',
      },
      {
        q: 'How do you stop a recursive CTE from looping forever on a graph with cycles?',
        qHi: 'Aap ek recursive CTE ko cycles waale graph par hamesha loop karne se kaise rokते ho?',
        a: 'The recursive term keeps expanding outward from the last batch of rows, and if the graph has a cycle, say node one points to two, two to three, three back to one, the traversal will keep rediscovering the same nodes and never terminate. The standard fix is to carry the set of nodes already visited on the current path as an array in a column, appending each new node as you go, and add a condition to the recursive term that excludes any edge whose destination is already in that array. That way a path stops as soon as it would revisit a node. A coarser alternative is to use UNION instead of UNION ALL, which removes duplicate rows at each iteration and will halt when rows repeat exactly, though it is less precise if the accumulated state differs. PostgreSQL 14 and later provide a standard CYCLE clause that automates the visited tracking: you name the column to watch, a boolean flag column it sets, and a path column, and it stops expanding a branch when that column value repeats. As a belt-and-braces measure, and because even a tree can be corrupted into a cycle by a bad parent pointer, it is wise to also carry a depth counter and cap it in the WHERE.',
        aHi: 'Recursive term last batch se bahar expand karता rehता hai, aur agar graph mein ek cycle hai, traversal wahi nodes rediscover karta rehेga aur kabhi terminate nahi hoga. Standard fix current path par pehle se visited nodes ke set ko ek column mein array ke roop mein le jाना hai, har naya node append karके, aur recursive term mein ek condition add karो jo kisi bhi edge ko exclude karता hai jiska destination pehle se us array mein hai. Ek coarser alternative UNION ALL ke bजाy UNION istemal karna hai. PostgreSQL 14+ ek standard CYCLE clause deta hai. Ek belt-and-braces measure ke roop mein, ek depth counter bhi le jाओ aur WHERE mein cap karो.',
      },
    ],

    exercises: [
      {
        task: 'Table `category(id int, name text, parent_id int)` forming a tree: `1 Electronics (NULL)`, `2 Phones (1)`, `3 Laptops (1)`, `4 Android (2)`. Write a recursive CTE that starts at `Electronics` and returns every descendant with a `depth` (Electronics = 0). Confirm 4 rows with depths 0, 1, 1, 2.',
        taskHi: 'Table `category(id, name, parent_id)` ek tree banाते hue. Ek recursive CTE likho jo `Electronics` par shuru hoती hai aur har descendant ko ek `depth` ke saath lौtaती hai.',
        hint: 'Anchor: `WHERE id = 1` with `0 AS depth`. Recursive: `JOIN cte c ON category.parent_id = c.id`, `c.depth + 1`. Stops when a level has no children.',
        hintHi: 'Anchor: `WHERE id = 1` `0 AS depth` ke saath. Recursive: `JOIN cte c ON category.parent_id = c.id`, `c.depth + 1`.',
      },
      {
        task: 'Write a recursive CTE `powers` that produces the powers of 2 up to 128: `1, 2, 4, 8, 16, 32, 64, 128`. Anchor `SELECT 1 AS v`; recursive `SELECT v * 2 FROM powers WHERE v < 128`. Confirm 8 rows.',
        taskHi: 'Ek recursive CTE `powers` likho jo 2 ki powers 128 tak produce karती hai. Anchor `SELECT 1 AS v`; recursive `SELECT v * 2 FROM powers WHERE v < 128`.',
        hint: 'The `WHERE v < 128` is the stop condition: when `v = 128`, `128 < 128` is false, the recursive term emits nothing, recursion ends. The `128` row itself was emitted from the `v = 64` iteration.',
        hintHi: '`WHERE v < 128` stop condition hai: jab `v = 128`, `128 < 128` false, recursive term kuch emit nahi karता. `128` row `v = 64` iteration se emit hui.',
      },
      {
        task: 'Table `edge(src int, dst int)` with `(1,2), (2,3), (3,4), (4,2)` — note `2 → 3 → 4 → 2` is a cycle. Write a recursive CTE from node `1` that carries a `visited int[]` and uses `WHERE NOT e.dst = ANY(visited)`. Confirm it terminates and reaches `{2, 3, 4}`. Then remove the guard and observe it hang (cancel it).',
        taskHi: 'Table `edge(src, dst)` `(1,2), (2,3), (3,4), (4,2)` ke saath — `2 → 3 → 4 → 2` ek cycle hai. Node `1` se ek recursive CTE likho jo ek `visited int[]` le jाती hai.',
        hint: '`ARRAY[src, dst] AS visited` in the anchor, `visited || e.dst` in the recursive term, `WHERE NOT e.dst = ANY(r.visited)`. Without the guard, `2→3→4→2→3→4...` never ends.',
        hintHi: 'Anchor mein `ARRAY[src, dst] AS visited`, recursive term mein `visited || e.dst`, `WHERE NOT e.dst = ANY(r.visited)`. Bина guard ke `2→3→4→2...` kabhi khatm nahi hoता.',
      },
    ],

    keyTakeaways: [
      'A recursive CTE = `WITH RECURSIVE name AS ( ANCHOR  UNION [ALL]  RECURSIVE_TERM )`. Anchor: a `SELECT` that does NOT reference `name` (the starting rows). Recursive term: a `SELECT` that DOES reference `name` — run repeatedly until an iteration produces ZERO rows.',
      'The self-reference inside the recursive term sees ONLY the rows from the PREVIOUS iteration, not the whole accumulated result. Thread state (depth counter, path string, visited array) through the SELECT columns so each row carries what the next step needs.',
      '`UNION ALL` keeps every row — right for TREES, faster. `UNION` de-dups each iteration — a safety net for GRAPHS. Aggregates / `DISTINCT` / `GROUP BY` / window functions are NOT allowed in the recursive term.',
      'TREE traversal (org chart, category tree, BOM): anchor on the root(s), recursive term joins `child.parent_id = cte.id` (flip to `child.id = cte.parent_id` to walk UP to ancestors). No cycle guard needed for a real tree.',
      'GRAPH traversal: a cycle (`1->2->3->1`) makes the recursion loop FOREVER. Defences: (1) carry a `visited` array and `WHERE NOT e.dst = ANY(visited)`; (2) `UNION` instead of `UNION ALL`; (3) the standard `CYCLE col SET is_cycle USING path` clause (PostgreSQL 14+).',
      'ALWAYS bound recursion: add `AND depth < 100` to the recursive `WHERE` (a bad `parent_id` can turn a tree into a cycle), and `SET statement_timeout` for jobs over user data.',
      'For a plain integer/date range use `generate_series(start, stop, step)` — simpler and faster. Use a recursive CTE only when each row depends on the previous in a NON-arithmetic way (running balance with resets, path building). A recursive CTE is always MATERIALIZED; index the recursive join column.',
    ],
    keyTakeawaysHi: [
      'Ek recursive CTE = `WITH RECURSIVE name AS ( ANCHOR  UNION [ALL]  RECURSIVE_TERM )`. Anchor: ek `SELECT` jo `name` reference NAHI karता. Recursive term: ek `SELECT` jo `name` reference KARता hai — baar-baar chalता hai jab tak ek iteration ZERO rows produce na kare.',
      'Recursive term ke andar self-reference SIRF PICHLI iteration ki rows dekhता hai, poora accumulated result nahi. State (depth counter, path string, visited array) ko SELECT columns ke through thread karो.',
      '`UNION ALL` har row rakhता hai — TREES ke liye sahi, faster. `UNION` har iteration dedup karता hai — GRAPHS ke liye safety net. Aggregates / `DISTINCT` / `GROUP BY` / window functions recursive term mein allowed NAHI.',
      'TREE traversal: root(s) par anchor, recursive term `child.parent_id = cte.id` join karता hai (`child.id = cte.parent_id` to ancestors tak UPAR). Ek real tree ke liye cycle guard nahi chahिए.',
      'GRAPH traversal: ek cycle (`1->2->3->1`) recursion ko HAMESHA loop karता hai. Defences: (1) ek `visited` array le jाओ aur `WHERE NOT e.dst = ANY(visited)`; (2) `UNION ALL` ke bजाy `UNION`; (3) standard `CYCLE` clause (PostgreSQL 14+).',
      'HAMESHA recursion bound karो: recursive `WHERE` mein `AND depth < 100` add karो, aur user data par jobs ke liye `SET statement_timeout`.',
      'Ek plain integer/date range ke liye `generate_series(start, stop, step)` istemal karो. Ek recursive CTE sirf tab jab har row pichli par NON-arithmetic tarike se nirbhar karती hai. Ek recursive CTE hamesha MATERIALIZED hoती hai; recursive join column index karो.',
    ],
  },

  {
    slug: 'sql-data-modifying-ctes-and-choosing',
    title: 'Data-Modifying CTEs & Choosing Your Tool',
    titleHi: 'Data-Modifying CTEs Aur Apna Tool Chunna',
    description: 'PostgreSQL lets a CTE be an `INSERT`, `UPDATE`, or `DELETE` with `RETURNING` — so one statement can move rows between tables, or update and log in a single atomic step. This lesson also pulls Module 3-5 together: when to use a join, a subquery, a CTE, or EXISTS.',
    descriptionHi: 'PostgreSQL ek CTE ko `RETURNING` ke saath ek `INSERT`, `UPDATE`, ya `DELETE` hone deता hai — to ek statement rows ko tables ke beech move kar sakта hai, ya ek single atomic step mein update aur log kar sakта hai. Ye lesson Module 3-5 ko bhi ek saath laता hai: ek join, ek subquery, ek CTE, ya EXISTS kab istemal karें.',
    difficulty: 'HARD',
    duration: 20,
    order: 6,

    analogy: {
      en: '**Moving files between two filing cabinets and keeping a transfer log — in one motion, so you can never end up with a file in neither drawer.** Normally you would: pull the folders out of cabinet A (one action), put them in cabinet B (another action), write the transfer slip (a third). If someone interrupts you between steps, a folder could be sitting on the desk belonging to nobody. A data-modifying CTE lets you staple all three into a single motion: "the folders I am removing from A" is named, and in the same breath they go into B and onto the log. Either the whole motion happens or none of it does. The other half of this lesson is a toolbox review: you have now seen four ways to bring a second table to bear on a query — a join (when you want its columns), a subquery in `WHERE` (a computed value or a set to test against), `EXISTS` (just "is there a match?"), and a CTE (to name a step you will reuse or build on). Picking the right one is mostly about what you need *out*: columns, a value, a yes/no, or a named intermediate.',
      hi: '**Do filing cabinets ke beech files move karna aur ek transfer log rakhna — ek motion mein, taaki aap kabhi ek file kisi drawer mein na rakhkर na rah jाओ.** Normally aap: cabinet A se folders nikालो (ek action), unhe cabinet B mein daalो (doosra action), transfer slip likho (teesra). Agar koi aapको steps ke beech interrupt karता hai, ek folder desk par kisi ka na hokar baith sakта hai. Ek data-modifying CTE aapको teenon ko ek single motion mein staple karने deता hai. Ya poori motion hoती hai ya bilkul nahi. Is lesson ka doosra hissa ek toolbox review hai: aapne ab ek query par ek doosri table laने ke chaar tarike dekhे hain — ek join (jab aap iske columns chahते ho), `WHERE` mein ek subquery (ek computed value ya test karne ke liye ek set), `EXISTS` (bस "kya ek match hai?"), aur ek CTE (ek step ko naam dene ke liye).',
    },

    simple: `**A CTE can be \`INSERT\` / \`UPDATE\` / \`DELETE\` ... \`RETURNING\`**

\`\`\`sql
-- move the 'done' rows from live -> archive, in one statement
WITH moved AS (
  DELETE FROM live_task
  WHERE status = 'done'
  RETURNING *
)
INSERT INTO archived_task
SELECT * FROM moved;
\`\`\`

**Update and capture what changed**

\`\`\`sql
WITH bumped AS (
  UPDATE account SET balance = balance - 10 WHERE id = 5 RETURNING id, balance
)
INSERT INTO ledger (account_id, new_balance, note)
SELECT id, balance, 'monthly fee' FROM bumped;
\`\`\`

**All sub-statements see the SAME snapshot (taken before the statement)**

\`\`\`sql
WITH x AS (UPDATE t SET n = n + 1 RETURNING id)
SELECT n FROM t;          -- shows the OLD n -- the outer SELECT sees pre-update rows
\`\`\`

**Choosing your tool — what do you need OUT of the second table?**

\`\`\`
its COLUMNS in the result            -> JOIN
a single computed VALUE per row      -> scalar subquery (SELECT / WHERE)
a SET to test membership against     -> IN / = ANY (subquery)
just "does a matching row EXIST?"    -> EXISTS / NOT EXISTS
a NAMED step you reuse or build on   -> CTE (WITH)
one AGGREGATE of a child set per row -> LEFT JOIN + GROUP BY  (or correlated scalar)
top-N rows per group                 -> LATERAL, or window fn + WHERE rn <= N
\`\`\``,

    simpleHi: `**Ek CTE ek \`INSERT\` / \`UPDATE\` / \`DELETE\` ... \`RETURNING\` ho sakti hai**

\`\`\`sql
-- 'done' rows ko live -> archive move karो, ek statement mein
WITH moved AS (
  DELETE FROM live_task
  WHERE status = 'done'
  RETURNING *
)
INSERT INTO archived_task
SELECT * FROM moved;
\`\`\`

**Update karो aur jo badla capture karो**

\`\`\`sql
WITH bumped AS (
  UPDATE account SET balance = balance - 10 WHERE id = 5 RETURNING id, balance
)
INSERT INTO ledger (account_id, new_balance, note)
SELECT id, balance, 'monthly fee' FROM bumped;
\`\`\`

**Sabhi sub-statements SAME snapshot dekhते hain (statement se pehle liya gaya)**

\`\`\`sql
WITH x AS (UPDATE t SET n = n + 1 RETURNING id)
SELECT n FROM t;          -- PURANA n dikhाता hai -- outer SELECT pre-update rows dekhता hai
\`\`\`

**Apna tool chunna — aapको doosri table se kya OUT chahिए?**

\`\`\`
result mein iske COLUMNS            -> JOIN
prati row ek single computed VALUE  -> scalar subquery (SELECT / WHERE)
membership test karne ke liye ek SET -> IN / = ANY (subquery)
bस "kya ek matching row EXIST karता hai?" -> EXISTS / NOT EXISTS
ek NAMED step jo aap reuse karते ho -> CTE (WITH)
prati row ek child set ka AGGREGATE -> LEFT JOIN + GROUP BY  (ya correlated scalar)
prati group top-N rows             -> LATERAL, ya window fn + WHERE rn <= N
\`\`\``,

    content: `## Data-modifying CTEs (PostgreSQL)

PostgreSQL allows \`INSERT\`, \`UPDATE\`, and \`DELETE\` statements as CTEs, each with a \`RETURNING\` clause that exposes the affected rows to the rest of the statement. This makes several multi-table operations **atomic and single-statement**:

**Move rows between tables:**

\`\`\`sql
WITH moved AS (
  DELETE FROM live_orders WHERE created_at < now() - interval '1 year'
  RETURNING *
)
INSERT INTO orders_archive SELECT * FROM moved;
\`\`\`

**Update one table, log to another:**

\`\`\`sql
WITH closed AS (
  UPDATE ticket SET status = 'closed', closed_at = now()
  WHERE status = 'open' AND updated_at < now() - interval '30 days'
  RETURNING id
)
INSERT INTO ticket_event (ticket_id, event) SELECT id, 'auto-closed' FROM closed;
\`\`\`

**Insert into a parent and its children together:**

\`\`\`sql
WITH new_order AS (
  INSERT INTO orders (customer_id, total) VALUES (7, 250) RETURNING id
)
INSERT INTO order_line (order_id, sku, qty)
SELECT new_order.id, v.sku, v.qty
FROM new_order, (VALUES ('A1', 2), ('B2', 1)) AS v(sku, qty);
\`\`\`

### Snapshot semantics — the one surprise

All parts of a data-modifying CTE statement — every sub-statement and the outer query — **see the database as it was *before* the statement started**. They do **not** see each other's changes. So:

\`\`\`sql
WITH x AS (UPDATE t SET n = n + 1 WHERE id = 1 RETURNING id)
SELECT n FROM t WHERE id = 1;     -- shows the OLD value of n
\`\`\`

The \`UPDATE\` *does* happen (and is committed with the transaction), but the outer \`SELECT\` reads the pre-statement snapshot. If you need the new value, take it from the CTE's own \`RETURNING\`:

\`\`\`sql
WITH x AS (UPDATE t SET n = n + 1 WHERE id = 1 RETURNING n)
SELECT n FROM x;                  -- shows the NEW value
\`\`\`

Also: the **execution order** of multiple data-modifying sub-CTEs is **not guaranteed**, and modifying the same row twice in one statement is undefined. Keep each target row touched by exactly one sub-statement.

> Other databases: SQL Server has \`OUTPUT\` (similar to \`RETURNING\`) and its own composability rules; MySQL does not support data-modifying CTEs. This is a PostgreSQL strength.

## Choosing your tool — the Module 3-5 summary

You now have the full toolkit for "involve another table". The decision is driven by **what you need in the output**:

| you need | tool | notes |
|---|---|---|
| **columns** from the other table | \`JOIN\` (\`INNER\` / \`LEFT\`) | fans out on one-to-many — watch aggregates (Module 4) |
| a single **derived value** per row | correlated **scalar subquery** in \`SELECT\` | one or two are fine; many over a big table → join |
| a **set** to test membership | \`IN (subquery)\` / \`= ANY\` | \`NOT IN\` → use \`NOT EXISTS\` (NULL trap) |
| just **"is there a match?"** | \`EXISTS\` | semi-join, no fan-out, no \`DISTINCT\` |
| **"is there no match?"** | \`NOT EXISTS\` | NULL-safe anti-join |
| an **aggregate** of a related set per row | \`LEFT JOIN ... GROUP BY\` **or** pre-aggregated derived table / CTE | avoids fan-out double-counting |
| **top-N rows per group** | \`LATERAL\` (Module 3) **or** window function + \`WHERE rn <= N\` (Module 6) | |
| a **named, reusable intermediate** | \`CTE\` (\`WITH\`) | inlined on PG 12+ unless \`MATERIALIZED\` |
| the same shape in **many queries** | \`VIEW\` | a stored, reusable query |
| **recursion** (tree / graph / series) | \`WITH RECURSIVE\` | always bound the depth |

### Rules of thumb

- **Start with a join.** It is the most optimizable and the most familiar. Reach for the others when a join would fan out, or when you only need a boolean, or when the query has grown too nested to read.
- **\`EXISTS\` over \`IN\` for correlation with extra conditions**; **\`IN\` over \`EXISTS\` for a simple single-column key** — readability, the planner usually treats them alike.
- **Never \`NOT IN\` a subquery** — \`NOT EXISTS\`.
- **A CTE is for humans.** If naming the step does not make the query clearer, inline it.
- **One correlated scalar subquery is fine; three+ over a large table → pre-aggregate.**
- **Measure with \`EXPLAIN (ANALYZE)\`** when it matters — the "which is faster" answer is workload- and index-dependent (Module 10).`,

    contentHi: `## Data-modifying CTEs (PostgreSQL)

PostgreSQL \`INSERT\`, \`UPDATE\`, aur \`DELETE\` statements ko CTEs ke roop mein allow karता hai, har ek ek \`RETURNING\` clause ke saath jo affected rows ko baaki statement ko expose karता hai. Isse kई multi-table operations **atomic aur single-statement** ban jaते hain:

**Rows ko tables ke beech move karो:**

\`\`\`sql
WITH moved AS (
  DELETE FROM live_orders WHERE created_at < now() - interval '1 year' RETURNING *
)
INSERT INTO orders_archive SELECT * FROM moved;
\`\`\`

**Ek table update karो, doosri mein log karो:**

\`\`\`sql
WITH closed AS (
  UPDATE ticket SET status = 'closed' WHERE status = 'open' AND ... RETURNING id
)
INSERT INTO ticket_event (ticket_id, event) SELECT id, 'auto-closed' FROM closed;
\`\`\`

### Snapshot semantics — ek surprise

Ek data-modifying CTE statement ke sabhi hisse — har sub-statement aur outer query — **database ko waise dekhते hain jaise wo statement shuru hone se *pehle* tha**. Wo ek doosre ke changes **nahi** dekhते. To:

\`\`\`sql
WITH x AS (UPDATE t SET n = n + 1 WHERE id = 1 RETURNING id)
SELECT n FROM t WHERE id = 1;     -- n ka PURANA value dikhाता hai
\`\`\`

\`UPDATE\` *hoता hai* (aur transaction ke saath commit hoता hai), par outer \`SELECT\` pre-statement snapshot padhता hai. Naya value chahिए to CTE ke apne \`RETURNING\` se lo.

Saath hi: kई data-modifying sub-CTEs ka **execution order guaranteed nahi** hai, aur ek statement mein ek row ko do baar modify karna undefined hai.

> Doosre databases: SQL Server ke paas \`OUTPUT\` hai; MySQL data-modifying CTEs support nahi karता. Ye ek PostgreSQL strength hai.

## Apna tool chunna — Module 3-5 summary

Aapke paas ab "ek doosri table involve karो" ke liye poora toolkit hai. Decision **is par nirbhar hai ki aapको output mein kya chahिए**:

| aapको chahिए | tool | notes |
|---|---|---|
| doosri table se **columns** | \`JOIN\` | one-to-many par fan out — aggregates dekhो (Module 4) |
| prati row ek single **derived value** | \`SELECT\` mein correlated **scalar subquery** | ek-do theek; badी table par kई → join |
| membership test karne ke liye ek **set** | \`IN (subquery)\` / \`= ANY\` | \`NOT IN\` → \`NOT EXISTS\` istemal karो |
| bस **"kya ek match hai?"** | \`EXISTS\` | semi-join, koi fan-out nahi |
| **"kya koi match nahi?"** | \`NOT EXISTS\` | NULL-safe anti-join |
| prati row ek related set ka **aggregate** | \`LEFT JOIN ... GROUP BY\` **ya** pre-aggregated CTE | fan-out double-counting se bachता hai |
| **prati group top-N rows** | \`LATERAL\` **ya** window function + \`WHERE rn <= N\` | |
| ek **named, reusable intermediate** | \`CTE\` (\`WITH\`) | PG 12+ par inlined jab tak \`MATERIALIZED\` na ho |
| **kई queries** mein wahi shape | \`VIEW\` | ek stored, reusable query |
| **recursion** (tree / graph / series) | \`WITH RECURSIVE\` | hamesha depth bound karो |

### Rules of thumb

- **Ek join se shuru karो.** Ye sabse optimizable aur sabse familiar hai.
- **Extra conditions waali correlation ke liye \`IN\` par \`EXISTS\`**; **ek simple single-column key ke liye \`EXISTS\` par \`IN\`** — readability.
- **Kabhi \`NOT IN\` ek subquery** — \`NOT EXISTS\`.
- **Ek CTE insानों ke liye hai.** Agar step ko naam dena query saaf nahi karता, inline karो.
- **Ek correlated scalar subquery theek hai; ek badी table par teen+ → pre-aggregate.**
- **\`EXPLAIN (ANALYZE)\` se measure karो** jab maayne rakhता hai (Module 10).`,

    examples: [
      {
        title: 'Data-modifying CTE: archive then delete in one atomic statement',
        titleHi: 'Data-modifying CTE: ek atomic statement mein archive phir delete',
        code: `CREATE TABLE live (id int, status text);
INSERT INTO live VALUES (1,'active'),(2,'done'),(3,'done'),(4,'active');
CREATE TABLE archive (id int, status text);

WITH moved AS (
  DELETE FROM live WHERE status = 'done' RETURNING id, status
)
INSERT INTO archive SELECT * FROM moved;

SELECT 'live' AS tbl, id FROM live ORDER BY id;
SELECT 'archive' AS tbl, id FROM archive ORDER BY id;`,
        output: ` tbl  | id
------+----
 live | 1
 live | 4
(2 rows)

 tbl     | id
---------+----
 archive | 2
 archive | 3
(2 rows)`,
        explain: "`moved` is a `DELETE ... RETURNING` CTE: it removes the `'done'` rows from `live` and hands their columns to the outer `INSERT`, which writes them into `archive`. All in ONE atomic statement — there is no moment when a row exists in neither table (or both). After it, `live` has ids `1, 4` and `archive` has `2, 3`.",
        explainHi: "`moved` ek `DELETE ... RETURNING` CTE hai: ye `live` se `'done'` rows hataता hai aur unke columns outer `INSERT` ko deता hai, jo unhe `archive` mein likhता hai. Sab EK atomic statement mein — koi pal nahi jab ek row kisi table mein na ho (ya dono mein). Iske baad, `live` ke ids `1, 4` hain aur `archive` ke `2, 3`.",
      },
      {
        title: 'The snapshot rule: the outer SELECT sees the pre-UPDATE value',
        titleHi: 'Snapshot niyam: outer SELECT pre-UPDATE value dekhta hai',
        code: `CREATE TABLE acct (id int, bal int);
INSERT INTO acct VALUES (1, 100);

-- the UPDATE runs, but the outer SELECT reads the snapshot from BEFORE the statement
WITH bump AS (
  UPDATE acct SET bal = bal + 50 WHERE id = 1 RETURNING id
)
SELECT bal AS bal_seen_by_outer_select FROM acct WHERE id = 1;

-- afterwards, the update is visible
SELECT bal AS bal_after FROM acct WHERE id = 1;`,
        output: ` bal_seen_by_outer_select
--------------------------
 100
(1 row)

 bal_after
-----------
 150
(1 row)`,
        explain: "The `UPDATE` inside the CTE genuinely runs (and persists), but the SNAPSHOT RULE says every part of the statement — including the outer `SELECT` — sees the database as it was BEFORE the statement started. So `bal_seen_by_outer_select` is the OLD `100`. A separate statement afterwards sees the committed `150`. To read the new value inside the same statement, select from the CTE's `RETURNING`.",
        explainHi: 'CTE ke andar `UPDATE` sach mein chalता hai (aur persist karता hai), par SNAPSHOT RULE kehता hai ki statement ka har hissa — outer `SELECT` sहित — database ko waise dekhता hai jaise wo statement shuru hone se PEHLE tha. To `bal_seen_by_outer_select` PURANA `100` hai. Baad mein ek alag statement committed `150` dekhता hai. Usi statement ke andar naya value padhne ke liye CTE ke `RETURNING` se select karो.',
      },
      {
        title: 'Choosing: same question, four tools, and what each returns',
        titleHi: 'Chunna: wahi sawaal, chaar tools, aur har ek kya lौtaता hai',
        code: `CREATE TABLE customer (id int, name text);
INSERT INTO customer VALUES (1,'Acme'),(2,'Globex'),(3,'Initech');
CREATE TABLE orders (id int, customer_id int, total int);
INSERT INTO orders VALUES (10,1,100),(11,1,200),(12,2,50);

-- JOIN: customer + order columns (Acme appears twice -- fan-out)
SELECT c.name, o.total FROM customer c JOIN orders o ON o.customer_id = c.id ORDER BY c.name, o.total;

-- EXISTS: just "has ordered" -- one row per customer, no fan-out
SELECT c.name FROM customer c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) ORDER BY c.name;

-- correlated scalar: one derived value per customer
SELECT c.name, (SELECT coalesce(sum(total),0) FROM orders o WHERE o.customer_id = c.id) AS spend
FROM customer c ORDER BY c.name;`,
        output: ` name   | total
--------+-------
 Acme   | 100
 Acme   | 200
 Globex | 50
(3 rows)

 name
--------
 Acme
 Globex
(2 rows)

 name    | spend
---------+-------
 Acme    | 300
 Globex  | 50
 Initech | 0
(3 rows)`,
        explain: "Same customers, three tools, three shapes. `JOIN` brings order columns in and FANS OUT — Acme's 2 orders make 2 rows. `EXISTS` is a pure filter — one row per customer that has ordered (Acme, Globex), no fan-out, Initech excluded. The correlated scalar gives one derived value per customer — `spend`, with `coalesce(..., 0)` so Initech shows `0`. Pick the tool by what you need in the output.",
        explainHi: 'Wahi customers, teen tools, teen shapes. `JOIN` order columns laता hai aur FAN OUT karता hai — Acme ke 2 orders 2 rows banाते hain. `EXISTS` ek pure filter hai — prati customer jo order kar chuka ek row (Acme, Globex), koi fan-out nahi, Initech excluded. Correlated scalar prati customer ek derived value deता hai — `spend`, `coalesce(..., 0)` ke saath. Tool ko is se chuno ki aapको output mein kya chahिए.',
      },
    ],

    mistakes: [
      {
        wrong: `-- expecting the outer query to see the CTE's UPDATE
WITH paid AS (
  UPDATE invoice SET status = 'paid' WHERE id = 5 RETURNING id
)
SELECT status FROM invoice WHERE id = 5;
-- returns the OLD status -- the outer SELECT sees the pre-statement snapshot`,
        right: `WITH paid AS (
  UPDATE invoice SET status = 'paid' WHERE id = 5 RETURNING id, status
)
SELECT status FROM paid;
-- read the new value from the CTE's own RETURNING`,
        why: 'In a data-modifying CTE statement, every part sees the database as it was before the statement began. The UPDATE inside the CTE genuinely runs and its effect persists after the statement, but the outer SELECT, and any other sub-CTE, still reads the pre-statement snapshot, so querying the base table for the new value gives the old one. To observe what the modification produced, select from the CTE itself, which exposes exactly the rows it changed through its RETURNING list. Add the columns you need to that RETURNING.',
        whyHi: 'Ek data-modifying CTE statement mein, har hissa database ko waise dekhता hai jaise wo statement shuru hone se pehle tha. CTE ke andar UPDATE sach mein chalता hai aur iska effect statement ke baad persist karता hai, par outer SELECT abhi bhi pre-statement snapshot padhता hai. Modification ne jo produce kiya use dekhne ke liye, CTE se hi select karो, jo RETURNING ke through theek wo rows expose karता hai jo isne badली.',
      },
      {
        wrong: `-- two sub-CTEs modifying the SAME rows in one statement
WITH a AS (UPDATE task SET priority = priority + 1 WHERE queue = 'x' RETURNING id),
     b AS (UPDATE task SET priority = priority * 2 WHERE queue = 'x' RETURNING id)
SELECT * FROM a UNION SELECT * FROM b;
-- undefined: the order of a and b is not guaranteed, and each row is updated twice`,
        right: `-- do it in one UPDATE with the combined expression
UPDATE task SET priority = (priority + 1) * 2 WHERE queue = 'x';
-- or, if the steps are genuinely separate, use two statements in a transaction`,
        why: 'PostgreSQL does not guarantee the execution order of multiple data-modifying CTEs within a single statement, and it explicitly leaves the result undefined when the same row is targeted by more than one of them. Here both sub-CTEs update every task in queue x, so each row is written twice with no defined order, and the final priority could be from either expression applied in either sequence. If the two adjustments are really one logical change, fold them into a single UPDATE expression. If they are distinct steps that must happen in order, run them as two separate statements inside one transaction so ordering and visibility are well defined.',
        whyHi: 'PostgreSQL ek single statement ke andar kई data-modifying CTEs ka execution order guarantee nahi karता, aur ye explicitly result ko undefined chhodता hai jab ek hi row ko unme se ek se zyada target karते hain. Yahaan dono sub-CTEs queue x ka har task update karते hain, to har row do baar likhi jaती hai bина defined order ke. Agar do adjustments sach mein ek logical change hain, unhe ek single UPDATE expression mein fold karो. Agar wo distinct steps hain, unhe ek transaction ke andar do alag statements ke roop mein chalao.',
      },
      {
        wrong: `-- reaching for a CTE + join when EXISTS is the whole question
WITH customers_with_orders AS (
  SELECT DISTINCT customer_id FROM orders
)
SELECT c.name
FROM customer c
JOIN customers_with_orders x ON x.customer_id = c.id;`,
        right: `SELECT c.name
FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
        why: 'The question is only whether each customer has at least one order, a pure existence test, and EXISTS expresses exactly that in one clause with no intermediate result, no DISTINCT, and no join to de-duplicate. Building a CTE of distinct customer ids and then joining to it does the same work the long way: it materialises or inlines a de-duplicated set and performs a join whose only purpose is filtering. When the entire need is a yes or no about a related row, EXISTS or NOT EXISTS is the most direct and usually the most efficient tool, and it is the one a reader recognises immediately as an existence check.',
        whyHi: 'Sawaal sirf ye hai ki har customer ke paas kam se kam ek order hai ya nahi, ek pure existence test, aur EXISTS theek wahi ek clause mein express karता hai bина intermediate result, bина DISTINCT, aur bина de-duplicate karne ke liye join ke. Distinct customer ids ki ek CTE banakar phir usse join karna wahi kaam lambe tarike se karता hai. Jab poori zaroorat ek related row ke baare mein haan ya naa hai, EXISTS ya NOT EXISTS sabse direct aur aksar sabse efficient tool hai.',
      },
    ],

    realWorld: [
      {
        en: '**A retention job: `WITH expired AS (DELETE FROM session WHERE last_seen < now() - interval \'90 days\' RETURNING user_id) INSERT INTO churn_signal SELECT DISTINCT user_id, now() FROM expired`** — cleanup and analytics in one atomic pass.',
        hi: '**Ek retention job: `WITH expired AS (DELETE ... RETURNING user_id) INSERT INTO churn_signal SELECT ...`** — cleanup aur analytics ek atomic pass mein.',
      },
      {
        en: '**Order creation: `WITH o AS (INSERT INTO orders (...) RETURNING id) INSERT INTO order_line SELECT o.id, ... FROM o, unnest($lines)`** — parent and children inserted together so a half-created order is impossible.',
        hi: '**Order creation: `WITH o AS (INSERT ... RETURNING id) INSERT INTO order_line SELECT o.id, ...`** — parent aur children ek saath insert.',
      },
      {
        en: '**A team style guide table pinned in the wiki: "join for columns, EXISTS for a filter, CTE for a named step, never NOT IN a subquery"** — the Module 3-5 summary, enforced in review.',
        hi: '**Wiki mein pin ki gayi ek team style guide table: "columns ke liye join, filter ke liye EXISTS, named step ke liye CTE, kabhi NOT IN a subquery nahi"**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a data-modifying CTE, and what is the snapshot rule you must remember?',
        qHi: 'Ek data-modifying CTE kya hai, aur wo snapshot niyam kya hai jo aapको yaad rakhna chahिए?',
        a: 'In PostgreSQL a CTE can be an INSERT, UPDATE, or DELETE with a RETURNING clause, and the rows it returns are available to the rest of the statement. This lets you do multi-table operations atomically in one statement: delete rows from one table and insert them into an archive, update a table and write an audit row to another, insert a parent row and its children in one go. Because it is a single statement it is all-or-nothing. The rule you must remember is the snapshot rule: every part of the statement, the outer query and each sub-CTE, sees the database as it was before the statement started. They do not see each other\'s modifications. So if a CTE updates a row and the outer query then selects that row from the base table, it gets the old value. To see the new value you must select from the CTE itself, via its RETURNING list. Two more cautions: the execution order of multiple data-modifying sub-CTEs is not guaranteed, and updating the same row from more than one of them is undefined, so each target row should be touched by exactly one sub-statement.',
        aHi: 'PostgreSQL mein ek CTE ek RETURNING clause ke saath ek INSERT, UPDATE, ya DELETE ho sakti hai, aur jo rows ye lौtaती hai wo baaki statement ko available hain. Isse aap multi-table operations ek statement mein atomically kar sakte ho. Kyunki ye ek single statement hai ye all-or-nothing hai. Wo niyam jo aapको yaad rakhna chahिए wo snapshot niyam hai: statement ka har hissa, outer query aur har sub-CTE, database ko waise dekhता hai jaise wo statement shuru hone se pehle tha. Wo ek doosre ke modifications nahi dekhते. Naya value dekhne ke liye aapको CTE se hi select karna hoga, iske RETURNING ke through. Do aur cautions: kई data-modifying sub-CTEs ka execution order guaranteed nahi.',
      },
      {
        q: 'You need to bring a second table into a query. Walk through how you decide between a join, a subquery, EXISTS, and a CTE.',
        qHi: 'Aapको ek query mein ek doosri table lani hai. Aap ek join, ek subquery, EXISTS, aur ek CTE ke beech kaise decide karते ho?',
        a: 'The deciding question is what I need out of that second table. If I need its columns in the result set, I use a join, and I pick INNER or LEFT depending on whether unmatched rows should drop or be kept; I stay alert that a one-to-many join fans out and can double a sum. If I need a single computed value per row, like a company average or a per-row count, a scalar subquery in the SELECT or WHERE is the direct expression; one or two are fine, but many correlated scalars over a big table should become a join to a pre-aggregated set. If I need a set of values to test membership against, that is IN or equals ANY with a subquery, and if the test is negative I use NOT EXISTS rather than NOT IN because of the NULL trap. If the entire question is whether a matching row exists, EXISTS or NOT EXISTS is the cleanest: it is a semi-join or anti-join, it never fans out, and it needs no DISTINCT. If I need an aggregate of a related set per row, a LEFT JOIN with GROUP BY or a pre-aggregated derived table avoids the fan-out double-count. And a CTE is orthogonal to all of this: I reach for WITH when a step deserves a name because it is reused or because the query has become too nested to read, not because it changes what is computed. My default is to start with a join and move to the others when a join would fan out, when I only need a boolean, or when readability demands it.',
        aHi: 'Deciding sawaal ye hai ki mujhe us doosri table se kya chahिए. Agar mujhe result set mein iske columns chahिए, main ek join istemal karता hoon, aur INNER ya LEFT chunता hoon. Agar mujhe prati row ek single computed value chahिए, SELECT ya WHERE mein ek scalar subquery direct expression hai. Agar mujhe membership test karne ke liye values ka ek set chahिए, wo ek subquery ke saath IN ya equals ANY hai, aur agar test negative hai main NOT IN ke bजाy NOT EXISTS istemal karता hoon. Agar poora sawaal ye hai ki ek matching row exist karता hai ya nahi, EXISTS ya NOT EXISTS sabse saaf hai. Agar mujhe prati row ek related set ka aggregate chahिए, GROUP BY ke saath ek LEFT JOIN fan-out double-count se bachता hai. Aur ek CTE is sab se orthogonal hai. Mera default ek join se shuru karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Tables `todo(id int, done bool)` with rows `(1,false), (2,true), (3,true), (4,false)` and empty `todo_archive(id int)`. Write ONE statement: `WITH m AS (DELETE FROM todo WHERE done RETURNING id) INSERT INTO todo_archive SELECT id FROM m`. Then confirm `todo` has ids `1, 4` and `todo_archive` has `2, 3`.',
        taskHi: 'Tables `todo(id, done)` aur khaali `todo_archive(id)`. EK statement: `WITH m AS (DELETE FROM todo WHERE done RETURNING id) INSERT INTO todo_archive SELECT id FROM m`.',
        hint: 'The `DELETE ... RETURNING id` removes the done rows and hands their ids to the CTE; the outer `INSERT` reads them from `m`. One atomic statement — no window where a row is in neither table.',
        hintHi: '`DELETE ... RETURNING id` done rows hataता hai aur unke ids CTE ko deता hai; outer `INSERT` unhe `m` se padhता hai. Ek atomic statement.',
      },
      {
        task: 'Table `counter(id int, n int)` with `(1, 10)`. Run `WITH b AS (UPDATE counter SET n = n + 5 WHERE id = 1 RETURNING n) SELECT (SELECT n FROM counter WHERE id = 1) AS from_table, (SELECT n FROM b) AS from_cte`. Confirm `from_table` is `10` (old snapshot) and `from_cte` is `15` (new).',
        taskHi: 'Table `counter(id, n)` `(1, 10)` ke saath. `WITH b AS (UPDATE counter SET n = n + 5 WHERE id = 1 RETURNING n) SELECT (SELECT n FROM counter WHERE id = 1) AS from_table, (SELECT n FROM b) AS from_cte` chalao.',
        hint: 'The outer query reads the pre-statement snapshot, so `from_table` = `10`. The CTE\'s `RETURNING n` carries the post-update value, so `from_cte` = `15`. A follow-up `SELECT n FROM counter` shows `15`.',
        hintHi: 'Outer query pre-statement snapshot padhता hai, to `from_table` = `10`. CTE ka `RETURNING n` post-update value le jाता hai, to `from_cte` = `15`.',
      },
      {
        task: 'For each scenario name the best tool: (a) "show every order with its customer name and city"; (b) "list customers who have never placed an order"; (c) "each customer with their total lifetime spend"; (d) "the 2 newest orders per customer"; (e) "a 5-step funnel report". Answers: (a) JOIN, (b) NOT EXISTS, (c) LEFT JOIN + GROUP BY (or pre-aggregated CTE), (d) LATERAL or window fn, (e) chained CTEs.',
        taskHi: 'Har scenario ke liye best tool name karो: (a) "har order iske customer name aur city ke saath"; (b) "kabhi order na karne waale customers"; (c) "har customer iske total lifetime spend ke saath"; (d) "prati customer 2 newest orders"; (e) "ek 5-step funnel report".',
        hint: '(a) needs columns from both -> JOIN. (b) "no match" -> NOT EXISTS. (c) an aggregate per row -> LEFT JOIN + GROUP BY. (d) top-N per group -> LATERAL / window. (e) named stages -> chained CTEs.',
        hintHi: '(a) dono se columns -> JOIN. (b) "no match" -> NOT EXISTS. (c) prati row aggregate -> LEFT JOIN + GROUP BY. (d) top-N per group -> LATERAL / window. (e) named stages -> chained CTEs.',
      },
    ],

    keyTakeaways: [
      'PostgreSQL: a CTE can be `INSERT` / `UPDATE` / `DELETE ... RETURNING`. This makes multi-table ops ATOMIC in ONE statement: move rows table->table, update-and-log, insert a parent + its children. (SQL Server has `OUTPUT`; MySQL has no data-modifying CTEs.)',
      'SNAPSHOT RULE: every part of a data-modifying CTE statement (the outer query AND each sub-CTE) sees the DB as it was BEFORE the statement — they do NOT see each other\'s changes. `WITH x AS (UPDATE t SET n=n+1 RETURNING id) SELECT n FROM t` shows the OLD `n`. Read the new value from the CTE\'s own `RETURNING`.',
      'Execution ORDER of multiple data-modifying sub-CTEs is NOT guaranteed; touching the same row from two of them is UNDEFINED. Keep each target row in exactly one sub-statement.',
      'CHOOSING (what do you need OUT of the other table?): columns -> `JOIN`; one derived value per row -> scalar subquery; a set to test membership -> `IN`/`= ANY`; "is there a match?" -> `EXISTS`; "no match?" -> `NOT EXISTS`; an aggregate per row -> `LEFT JOIN + GROUP BY` / pre-aggregated CTE; top-N per group -> `LATERAL` / window fn; a named reusable step -> `CTE`; same shape across many queries -> `VIEW`; tree/graph/series -> `WITH RECURSIVE`.',
      'RULES OF THUMB: start with a JOIN (most optimizable, most familiar) — switch when it would fan out, when you only need a boolean, or when nesting hurts readability. `EXISTS` for multi-column/extra-condition correlation; `IN` for a simple single-column key. NEVER `NOT IN` a subquery -> `NOT EXISTS`.',
      'A CTE is FOR HUMANS — if naming the step does not make the query clearer, inline it. One correlated scalar subquery is fine; 3+ over a large table -> pre-aggregate into a `LEFT JOIN`.',
      'When performance matters, `EXPLAIN (ANALYZE)` decides — "which is faster" is workload- and index-dependent (Module 10). The planner usually treats `EXISTS` / `IN` / `JOIN+DISTINCT` alike for a semi-join.',
    ],
    keyTakeawaysHi: [
      'PostgreSQL: ek CTE `INSERT` / `UPDATE` / `DELETE ... RETURNING` ho sakti hai. Isse multi-table ops EK statement mein ATOMIC ban jaते hain: rows table->table move karो, update-and-log, ek parent + iske children insert. (SQL Server ke paas `OUTPUT`; MySQL ke paas data-modifying CTEs nahi.)',
      'SNAPSHOT RULE: ek data-modifying CTE statement ka har hissa DB ko waise dekhता hai jaise wo statement se PEHLE tha — wo ek doosre ke changes NAHI dekhते. Naya value CTE ke apne `RETURNING` se padhो.',
      'Kई data-modifying sub-CTEs ka execution ORDER guaranteed NAHI; ek hi row ko do se touch karna UNDEFINED hai.',
      'CHOOSING (doosri table se kya OUT chahिए?): columns -> `JOIN`; prati row ek derived value -> scalar subquery; membership set -> `IN`/`= ANY`; "kya match hai?" -> `EXISTS`; "no match?" -> `NOT EXISTS`; prati row aggregate -> `LEFT JOIN + GROUP BY`; top-N per group -> `LATERAL` / window fn; named reusable step -> `CTE`; kई queries mein wahi shape -> `VIEW`; tree/graph/series -> `WITH RECURSIVE`.',
      'RULES OF THUMB: ek JOIN se shuru karो — switch jab ye fan out kare, jab sirf ek boolean chahिए, ya jab nesting readability ko nuकsान kare. Multi-column correlation ke liye `EXISTS`; simple single-column key ke liye `IN`. KABHI `NOT IN` ek subquery -> `NOT EXISTS`.',
      'Ek CTE INSANON KE LIYE hai — agar step ko naam dena query saaf nahi karता, inline karो. Ek correlated scalar subquery theek hai; badी table par 3+ -> pre-aggregate.',
      'Jab performance maayne rakhता hai, `EXPLAIN (ANALYZE)` decide karता hai (Module 10). Planner aksar `EXISTS` / `IN` / `JOIN+DISTINCT` ko ek semi-join ke liye same treat karता hai.',
    ],
  },
];
