/**
 * Databases Complete Course — Module 2: Filtering, Expressions & Functions, lessons 1-3.
 *
 * Lesson 1: operators & type casts — arithmetic (integer vs numeric division, %, ^),
 *           string ||, comparison, boolean AND/OR/NOT + IS TRUE / IS FALSE / IS NOT TRUE,
 *           operator precedence, CAST(x AS t) / x::t, implicit vs explicit coercion,
 *           division-by-zero (an error) and the x / NULLIF(y, 0) guard.
 * Lesson 2: pattern matching — LIKE / ILIKE (%, _, ESCAPE), NOT LIKE, SIMILAR TO,
 *           POSIX regex (~, ~*, !~, regexp_match / regexp_replace / regexp_split_*),
 *           character classes, anchors, greedy vs lazy, the leading-% no-index note.
 * Lesson 3: CASE, COALESCE & conditionals — searched vs simple CASE, CASE in
 *           SELECT / WHERE / ORDER BY / GROUP BY / aggregates, COALESCE / NULLIF,
 *           GREATEST / LEAST (ignore NULL on PostgreSQL), conditional aggregation
 *           (count(*) FILTER (WHERE ...) and sum(CASE WHEN ...)).
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 2
 * GOTCHA for date/time examples (Lesson 6, module 2 part 2): start with
 * `SET TIME ZONE 'UTC';` and cast date/timestamp outputs `::text`, or the harness
 * renders a JS Date as an ISO-Z string that won't match psql. Regex: `\d` in a
 * template literal collapses to `d` — use `[0-9]` / `[[:digit:]]` or write `\\d`.
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_2: CourseLesson[] = [
  {
    slug: 'sql-operators-and-type-casts',
    title: 'Operators & Type Casts: Arithmetic, Booleans, `::`',
    titleHi: 'Operators Aur Type Casts: Arithmetic, Booleans, `::`',
    description: 'Every expression in SQL has a type, and the operator you use plus the operand types decide the result type. `7 / 2` is `3` (integer division), `7.0 / 2` is `3.5`. A comparison with `NULL` is `UNKNOWN`. `CAST(x AS type)` or `x::type` converts explicitly — and dividing by zero is an error, not `NULL` or infinity.',
    descriptionHi: 'SQL mein har expression ka ek type hota hai, aur jo operator aap istemal karte ho plus operand types result type tय karte hain. `7 / 2` `3` hai (integer division), `7.0 / 2` `3.5` hai. `NULL` ke saath ek comparison `UNKNOWN` hai. `CAST(x AS type)` ya `x::type` explicitly convert karta hai — aur zero se divide karna ek error hai, `NULL` ya infinity nahi.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A pocket calculator that has separate buttons for "whole-number mode" and "decimal mode", and refuses to guess which you meant.** Punch `7 ÷ 2` in whole-number mode and it shows `3` — it did the division you asked for with the number *type* you gave it, and the fractional part is simply not representable, so it is dropped. Put a decimal point on either number (`7.0 ÷ 2`) and the same machine switches to decimal mode and shows `3.5`. The calculator also has a strict rule about the divide key: press `÷ 0` and it does not show `0`, or blank, or "infinity" — it throws up an **error** and stops, because "divide by zero" has no answer and pretending otherwise would corrupt everything downstream. And it will not silently turn a word into a number for you: if you want to add the text `"42"` to a number you must press the explicit **convert** button first (`::int` / `CAST`). SQL is that calculator: the operand types are the mode, the operator plus the modes fix the result type, and conversions and error cases are things you handle on purpose, not things the engine guesses.',
      hi: '**Ek pocket calculator jismें "whole-number mode" aur "decimal mode" ke liye alag buttons hain, aur guess karne se mana karta hai ki aapka kya matlab tha.** Whole-number mode mein `7 ÷ 2` punch karo aur ye `3` dikhata hai — usne wo division kiya jo aapne maanga, us number *type* ke saath jo aapne diya, aur fractional part representable nahi hai, to ye drop ho jaata hai. Kisi bhi number par ek decimal point lagao (`7.0 ÷ 2`) aur wahi machine decimal mode mein switch hoti hai aur `3.5` dikhati hai. Calculator ka divide key ke baare mein ek strict rule bhi hai: `÷ 0` dabaao aur ye `0`, ya blank, ya "infinity" nahi dikhata — ye ek **error** dikhata hai aur ruk jaata hai. Aur ye aapke liye chupchaap ek word ko number mein nahi badalega: agar aap text `"42"` ko ek number mein add karna chahte ho to aapko pehle explicit **convert** button dabaana hoga (`::int` / `CAST`).',
    },

    simple: `**Arithmetic — the operand types decide the result type**

\`\`\`sql
SELECT 7 / 2;        -- 3      integer / integer -> integer (the remainder is discarded)
SELECT 7.0 / 2;      -- 3.5    numeric / integer -> numeric
SELECT 7 % 2;        -- 1      modulo (remainder); sign follows the dividend: (-7) % 2 = -1
SELECT 2 ^ 10;       -- 1024   exponentiation
SELECT 'a' || 'b';   -- ab     string concatenation
\`\`\`

**Comparison — and \`NULL\` gives \`UNKNOWN\` (Module 1, Lesson 4)**

\`\`\`sql
=   <>  !=   <   <=   >   >=          -- work on numbers, text, dates, booleans
x BETWEEN a AND b     -- a <= x AND x <= b   (inclusive both ends)
x IN (a, b, c)        -- x = a OR x = b OR x = c
x IS NULL             -- the only NULL test
\`\`\`

**Booleans**

\`\`\`sql
AND   OR   NOT                         -- three-valued: TRUE / FALSE / UNKNOWN
x IS TRUE / IS FALSE / IS UNKNOWN      -- collapse UNKNOWN to a definite t/f
(NULL::boolean) IS NOT TRUE            -- t   (NULL is "not true")
\`\`\`

**Precedence (high to low, the ones that bite)**

\`\`\`
::  (cast)   >   unary -   >   ^   >   * / %   >   + -   >   || (concat)
>   comparisons (= < > BETWEEN IN LIKE ...)   >   IS   >   NOT   >   AND   >   OR
-- when in doubt, parenthesise. Especially: AND binds tighter than OR (Module 1).
\`\`\`

**Type casts — explicit conversion**

\`\`\`sql
CAST('42' AS integer)      -- SQL-standard spelling
'42'::integer              -- PostgreSQL shorthand
'3.9'::numeric::integer    -- 4   (numeric -> integer ROUNDS, it does not truncate)
3.9::integer               -- 4   (also rounds)
now()::date                -- drop the time part
price::text                -- number -> string
\`\`\`

**PostgreSQL will not silently coerce text <-> number in most contexts**

\`\`\`sql
SELECT '42' + 8;           -- ERROR (in a table column context): operator does not exist: text + integer
SELECT '42'::int + 8;      -- 50
-- literals like '42' are "unknown type" and CAN adapt, but a text COLUMN will not.
\`\`\`

**Divide by zero is an ERROR — guard it**

\`\`\`sql
SELECT 10 / 0;                       -- ERROR: division by zero
SELECT 10 / NULLIF(divisor, 0);      -- NULL when divisor is 0, no error
SELECT 10.0 / NULLIF(divisor, 0);    -- and use numeric if you want a fractional result
\`\`\``,

    simpleHi: `**Arithmetic — operand types result type tय karte hain**

\`\`\`sql
SELECT 7 / 2;        -- 3      integer / integer -> integer (remainder discard)
SELECT 7.0 / 2;      -- 3.5    numeric / integer -> numeric
SELECT 7 % 2;        -- 1      modulo; sign dividend follow karta hai: (-7) % 2 = -1
SELECT 2 ^ 10;       -- 1024   exponentiation
SELECT 'a' || 'b';   -- ab     string concatenation
\`\`\`

**Comparison — aur \`NULL\` \`UNKNOWN\` deta hai**

\`\`\`sql
=   <>  !=   <   <=   >   >=
x BETWEEN a AND b     -- a <= x AND x <= b   (dono ends inclusive)
x IN (a, b, c)        -- x = a OR x = b OR x = c
x IS NULL             -- ekmatra NULL test
\`\`\`

**Booleans**

\`\`\`sql
AND   OR   NOT                         -- three-valued: TRUE / FALSE / UNKNOWN
x IS TRUE / IS FALSE / IS UNKNOWN      -- UNKNOWN ko ek definite t/f mein collapse karo
(NULL::boolean) IS NOT TRUE            -- t
\`\`\`

**Precedence (high se low)**

\`\`\`
::  (cast)   >   unary -   >   ^   >   * / %   >   + -   >   || (concat)
>   comparisons   >   IS   >   NOT   >   AND   >   OR
-- shak ho to parenthesise. Khaas kar: AND, OR se tighter bind karta hai (Module 1).
\`\`\`

**Type casts — explicit conversion**

\`\`\`sql
CAST('42' AS integer)      -- SQL-standard
'42'::integer              -- PostgreSQL shorthand
'3.9'::numeric::integer    -- 4   (numeric -> integer ROUND karta hai, truncate nahi)
now()::date                -- time part drop karo
price::text                -- number -> string
\`\`\`

**PostgreSQL zyaadatar contexts mein text <-> number silently coerce nahi karega**

\`\`\`sql
SELECT '42' + 8;           -- ERROR: operator does not exist: text + integer (ek text column context mein)
SELECT '42'::int + 8;      -- 50
\`\`\`

**Zero se divide karna ek ERROR hai — guard karo**

\`\`\`sql
SELECT 10 / 0;                       -- ERROR: division by zero
SELECT 10 / NULLIF(divisor, 0);      -- NULL jab divisor 0 hai, koi error nahi
\`\`\``,

    content: `## Every value has a type; operators are typed

SQL is statically typed. \`1\` is \`integer\`, \`1.5\` is \`numeric\`, \`'x'\` is \`text\` (roughly — string literals start as "unknown" and adapt), \`true\` is \`boolean\`, \`date '2026-01-01'\` is \`date\`. An operator like \`+\` or \`/\` or \`||\` is really a family of functions, one per pair of operand types, and the pair you feed it selects which one runs and therefore what type comes back.

## Arithmetic

- **\`+\` \`-\` \`*\`** — result type is the "wider" of the two operands: \`integer * integer\` → \`integer\`, \`integer * numeric\` → \`numeric\`.
- **\`/\`** — **integer division truncates toward zero**: \`7 / 2\` is \`3\`, \`-7 / 2\` is \`-3\`. To get a fractional result, make at least one side non-integer: \`7.0 / 2\`, \`7 / 2.0\`, or \`7::numeric / 2\`.
- **\`%\`** — modulo (remainder). The result takes the **sign of the dividend**: \`(-7) % 3\` is \`-1\`, not \`2\`. (This differs from Python.)
- **\`^\`** — exponentiation, returns \`double precision\`: \`2 ^ 10\` is \`1024\`.
- Integer arithmetic can **overflow** (\`integer\` range is about ±2.1 billion) and raises \`integer out of range\` rather than wrapping. Use \`bigint\` or \`numeric\` for values that can grow.

## \`||\` and \`NULL\`

\`||\` concatenates text (and arrays, and \`jsonb\`). As in Module 1: if **any** operand is \`NULL\`, the whole result is \`NULL\`. Use \`concat(...)\` (skips \`NULL\`) or \`coalesce\` around each part when a missing piece should not blank the whole string.

## Comparison and boolean operators

\`=\`, \`<>\` (or \`!=\`), \`<\`, \`<=\`, \`>\`, \`>=\` compare values of the same (or coercible) type. Text compares by the database or column **collation** (usually locale-aware, so \`'a' < 'B'\` may be true even though \`'a'\` has a higher code point). \`NULL\` on either side → \`UNKNOWN\` (Module 1).

\`AND\`, \`OR\`, \`NOT\` operate on the three-valued logic. The \`IS\` predicates let you **collapse \`UNKNOWN\`**:

- \`x IS TRUE\` — \`TRUE\` only if \`x\` is \`TRUE\`; \`FALSE\` if \`x\` is \`FALSE\` **or \`NULL\`**.
- \`x IS NOT TRUE\` — \`TRUE\` if \`x\` is \`FALSE\` or \`NULL\`.
- \`x IS FALSE\` / \`IS NOT FALSE\` / \`IS UNKNOWN\` / \`IS NOT UNKNOWN\` — analogous.

These always return \`TRUE\`/\`FALSE\`, never \`UNKNOWN\`, which is why \`WHERE flag IS NOT TRUE\` correctly catches both \`false\` and \`NULL\` rows while \`WHERE NOT flag\` misses the \`NULL\`s.

## Operator precedence

High to low, with the traps highlighted:

1. \`::\` (cast) — binds *very* tightly: \`- 2::text\` is \`-(2::text)\` which errors; write \`(-2)::text\`.
2. unary \`-\`
3. \`^\` (and it is **left-associative** in PostgreSQL: \`2 ^ 3 ^ 2\` = \`(2^3)^2\` = 64, not 512)
4. \`*\` \`/\` \`%\`
5. \`+\` \`-\`
6. \`||\`
7. comparison operators, \`BETWEEN\`, \`IN\`, \`LIKE\`, \`~\`
8. \`IS\` (\`IS NULL\`, \`IS TRUE\`, \`IS DISTINCT FROM\`)
9. \`NOT\`
10. \`AND\`
11. \`OR\`

The two that cause real bugs: **\`AND\` before \`OR\`** (Module 1), and **\`||\` before comparison** — \`a || b = c\` parses as \`(a || b) = c\`, which is usually fine, but \`a = b || c\` is \`a = (b || c)\`. When mixing, parenthesise.

## Type casts

Two spellings, identical behaviour:

- **\`CAST(expr AS type)\`** — SQL standard, portable.
- **\`expr::type\`** — PostgreSQL shorthand, terser, chainable (\`x::numeric::int\`).

Casts you use constantly:

- **\`text\` ↔ number**: \`'42'::int\`, \`price::text\`. Fails at runtime if the text is not a valid number (\`'42abc'::int\` → error).
- **numeric → integer**: **rounds half away from zero** (\`3.5::int\` = 4, \`2.5::int\` = 3, \`-2.5::int\` = -3). It does **not** truncate — use \`trunc()\` for that.
- **\`timestamptz\` → \`date\`** (\`now()::date\`) drops the time; **\`date\` → \`timestamptz\`** adds midnight in the session time zone.
- **\`text\` → \`boolean\`**: accepts \`'t'\`,\`'true'\`,\`'yes'\`,\`'1'\`,\`'f'\`,\`'false'\`,\`'no'\`,\`'0'\`.
- **\`::jsonb\`**, **\`::uuid\`**, **\`::inet\`**, **\`::type[]\`** for arrays.

### Implicit coercion

PostgreSQL is conservative. A **string literal** (\`'42'\`) has type "unknown" and will adapt to whatever context needs it, so \`SELECT '42' + 8\` works (the literal becomes \`integer\`). But a **\`text\` column** will not auto-convert: \`SELECT text_col + 8\` raises \`operator does not exist: text + integer\`. Numeric types *do* widen implicitly (\`integer\` → \`bigint\` → \`numeric\` → \`double precision\`). When you need a conversion the engine will not do for you, cast explicitly. Other databases (MySQL especially) coerce far more aggressively, which is a portability hazard — code that relied on \`'5' = 5\` being true will break.

## Division by zero and other runtime errors

\`x / 0\` and \`x % 0\` raise **\`division by zero\`** — the statement fails, the transaction is aborted. This is deliberate: there is no correct numeric answer, and silently returning \`NULL\` or \`0\` would propagate a wrong result. Guard it with **\`NULLIF\`**:

\`\`\`sql
SELECT revenue / NULLIF(orders, 0) AS avg_order_value FROM daily;
-- orders = 0  ->  NULLIF returns NULL  ->  revenue / NULL = NULL  (no error, and NULL is honest here)
\`\`\`

Other runtime errors from expressions: \`numeric field overflow\` (value exceeds the declared \`numeric(p,s)\` precision), \`integer out of range\`, \`invalid input syntax for type ...\` (a bad cast), \`value too long for type character varying(n)\`. All abort the statement; none are silent.`,

    contentHi: `## Har value ka ek type hota hai; operators typed hain

SQL statically typed hai. \`1\` \`integer\` hai, \`1.5\` \`numeric\`, \`'x'\` \`text\`, \`true\` \`boolean\`, \`date '2026-01-01'\` \`date\`. \`+\` ya \`/\` ya \`||\` jaisa ek operator asal mein functions ka ek family hai, prati operand-type pair ek, aur jo pair aap dete ho wo select karta hai ki kaunsa chalta hai aur isliye kya type wapas aata hai.

## Arithmetic

- **\`+\` \`-\` \`*\`** — result type dono operands mein se "wider" hai.
- **\`/\`** — **integer division zero ki taraf truncate karta hai**: \`7 / 2\` \`3\` hai, \`-7 / 2\` \`-3\`. Ek fractional result paane ke liye, kam se kam ek side non-integer banao: \`7.0 / 2\`, \`7::numeric / 2\`.
- **\`%\`** — modulo. Result **dividend ka sign** leta hai: \`(-7) % 3\` \`-1\` hai, \`2\` nahi. (Python se alag.)
- **\`^\`** — exponentiation, \`double precision\` return karta hai; PostgreSQL mein **left-associative**: \`2 ^ 3 ^ 2\` = \`(2^3)^2\` = 64.
- Integer arithmetic **overflow** kar sakta hai (\`integer\` range ~ ±2.1 billion) aur wrap ki bजाy \`integer out of range\` raise karta hai. \`bigint\` ya \`numeric\` istemal karo.

## \`||\` aur \`NULL\`

\`||\` text (aur arrays, aur \`jsonb\`) concatenate karta hai. Module 1 ki tarah: agar **koi** operand \`NULL\` hai, poora result \`NULL\` hai. \`concat(...)\` (\`NULL\` skip karta hai) istemal karo.

## Comparison aur boolean operators

Text database ya column **collation** se compare hota hai (aksar locale-aware). \`NULL\` kisi bhi side -> \`UNKNOWN\`.

\`IS\` predicates aapko **\`UNKNOWN\` collapse karne** dete hain:
- \`x IS TRUE\` — \`TRUE\` sirf agar \`x\` \`TRUE\` hai; \`FALSE\` agar \`x\` \`FALSE\` **ya \`NULL\`** hai.
- \`x IS NOT TRUE\` — \`TRUE\` agar \`x\` \`FALSE\` ya \`NULL\` hai.

Ye hamesha \`TRUE\`/\`FALSE\` return karte hain, kabhi \`UNKNOWN\` nahi — isiliye \`WHERE flag IS NOT TRUE\` sahi se \`false\` aur \`NULL\` dono rows pakadta hai jabki \`WHERE NOT flag\` \`NULL\`s miss karta hai.

## Operator precedence

High se low: \`::\` (cast, bahut tight) > unary \`-\` > \`^\` > \`* / %\` > \`+ -\` > \`||\` > comparisons > \`IS\` > \`NOT\` > \`AND\` > \`OR\`.

Do jo asli bugs karte hain: **\`AND\` \`OR\` se pehle** (Module 1), aur **\`||\` comparison se pehle**. Mix karte samay parenthesise karo.

## Type casts

- **\`CAST(expr AS type)\`** — SQL standard, portable.
- **\`expr::type\`** — PostgreSQL shorthand, chainable.

Casts jo aap lगातार istemal karte ho:
- **\`text\` <-> number**: \`'42'::int\`, \`price::text\`. Runtime par fail hota hai agar text ek valid number nahi (\`'42abc'::int\` -> error).
- **numeric -> integer**: **half zero se door ROUND karta hai** (\`3.5::int\` = 4, \`2.5::int\` = 3). Ye truncate **nahi** karta — uske liye \`trunc()\`.
- **\`timestamptz\` -> \`date\`** time drop karta hai; **\`date\` -> \`timestamptz\`** session TZ mein midnight jodta hai.

### Implicit coercion

PostgreSQL conservative hai. Ek **string literal** (\`'42'\`) ka type "unknown" hai aur adapt karega, to \`SELECT '42' + 8\` kaam karta hai. Par ek **\`text\` column** auto-convert nahi hoga: \`SELECT text_col + 8\` \`operator does not exist: text + integer\` raise karta hai. Numeric types implicitly widen hote hain. Doosre databases (khaas kar MySQL) bahut aggressively coerce karte hain — portability hazard.

## Zero se division aur doosre runtime errors

\`x / 0\` aur \`x % 0\` **\`division by zero\`** raise karte hain — statement fail hota hai, transaction abort hoti hai. Ye jaan-boojhkar hai. \`NULLIF\` se guard karo:

\`\`\`sql
SELECT revenue / NULLIF(orders, 0) AS avg_order_value FROM daily;
-- orders = 0 -> NULLIF NULL return karta hai -> revenue / NULL = NULL (koi error nahi)
\`\`\`

Doosre runtime errors: \`numeric field overflow\`, \`integer out of range\`, \`invalid input syntax for type ...\`, \`value too long for type character varying(n)\`. Sab statement abort karte hain; koi silent nahi.`,

    examples: [
      {
        title: 'Integer vs numeric division, modulo sign, exponentiation',
        titleHi: 'Integer vs numeric division, modulo sign, exponentiation',
        code: `SELECT
  7 / 2          AS int_div,     -- integer / integer -> integer, truncated
  7.0 / 2        AS num_div,     -- one side numeric -> numeric result
  7 % 2          AS pos_mod,
  (-7) % 2       AS neg_mod,     -- sign follows the dividend
  2 ^ 10         AS pow,
  2 ^ 3 ^ 2      AS left_assoc;  -- (2^3)^2 in PostgreSQL, not 2^(3^2)`,
        output: ` int_div | num_div            | pos_mod | neg_mod | pow  | left_assoc
---------+--------------------+---------+---------+------+------------
 3       | 3.5000000000000000 | 1       | -1      | 1024 | 64
(1 row)`,
        explain: '`7 / 2` is integer-over-integer so the result is an integer, `3`; `7.0 / 2` has a numeric operand so the result keeps the fraction, `3.5`. `%` takes the sign of the left operand: `(-7) % 2` is `-1`. And `^` is left-associative in PostgreSQL, so `2 ^ 3 ^ 2` is `(2^3)^2` = 64, not `2^(3^2)` = 512.',
        explainHi: '`7 / 2` integer-over-integer hai to result ek integer hai, `3`; `7.0 / 2` mein ek numeric operand hai to result fraction rakhता hai, `3.5`. `%` left operand ka sign leta hai: `(-7) % 2` `-1` hai. Aur `^` PostgreSQL mein left-associative hai, to `2 ^ 3 ^ 2` `(2^3)^2` = 64 hai.',
      },
      {
        title: 'CAST rounds numeric to integer; a text column will not auto-convert',
        titleHi: 'CAST numeric ko integer mein round karta hai; ek text column auto-convert nahi hoga',
        code: `SELECT
  '42'::integer          AS text_to_int,
  3.9::integer           AS rounds_up,      -- 4  (rounds, not truncates)
  2.5::integer           AS half_to_even,   -- 3  (half away from zero for numeric)
  trunc(3.9)             AS truncated,      -- 3  (this is how you actually chop)
  CAST('2026-03-15' AS date)::text AS as_date;`,
        output: ` text_to_int | rounds_up | half_to_even | truncated | as_date
-------------+-----------+--------------+-----------+------------
 42          | 4         | 3            | 3         | 2026-03-15
(1 row)`,
        explain: "`'42'::integer` parses a valid numeric string. `3.9::integer` and `2.5::integer` show that a cast to integer ROUNDS (3.9 -> 4, 2.5 -> 3 by round-half-away-from-zero for numeric) — it does NOT truncate. `trunc(3.9)` is how you actually chop to `3`. And `CAST('2026-03-15' AS date)` parses an ISO date directly (`::text` here just so the harness prints it plainly).",
        explainHi: "`'42'::integer` ek valid numeric string parse karता hai. `3.9::integer` aur `2.5::integer` dikhाते hain ki integer mein ek cast ROUND karता hai (3.9 -> 4, 2.5 -> 3) — ye truncate NAHI karता. `trunc(3.9)` `3` mein chop karne ka tareeka hai.",
      },
      {
        title: 'IS NOT TRUE catches NULL where NOT does not; divide-by-zero guard',
        titleHi: 'IS NOT TRUE NULL pakadta hai jahaan NOT nahi karta; divide-by-zero guard',
        code: `CREATE TABLE task (id int, done boolean);
INSERT INTO task VALUES (1, true), (2, false), (3, NULL);

-- "not finished": must include the NULL (unknown) rows
SELECT id, done, (NOT done) AS not_done, (done IS NOT TRUE) AS is_not_true
FROM task
ORDER BY id;

-- safe average: avoid division by zero
SELECT 100 / NULLIF(0, 0) AS guarded;   -- NULL, no error`,
        output: ` id | done | not_done | is_not_true
----+------+----------+-------------
 1  | t    | f        | f
 2  | f    | t        | t
 3  | NULL | NULL     | t
(3 rows)

 guarded
---------
 NULL
(1 row)`,
        explain: 'For the `done IS NULL` row, `NOT done` is `NOT NULL` = `NULL`, which `WHERE` would drop — so `NOT done` misses the unknown-status rows. `done IS NOT TRUE` returns a definite `t` for both the `false` row and the `NULL` row, which is what "not finished" should mean. And `100 / NULLIF(0, 0)` turns the zero divisor into `NULL`, so the division yields `NULL` instead of raising `division by zero`.',
        explainHi: '`done IS NULL` row ke liye, `NOT done` `NOT NULL` = `NULL` hai, jise `WHERE` drop kar deता — to `NOT done` unknown-status rows miss karता hai. `done IS NOT TRUE` `false` row aur `NULL` row DONO ke liye ek definite `t` return karता hai. Aur `100 / NULLIF(0, 0)` zero divisor ko `NULL` mein badalता hai, to division `NULL` deता hai `division by zero` raise karne ke bजाy.',
      },
    ],

    mistakes: [
      {
        wrong: `-- average order value
SELECT sum(revenue) / count(*) AS avg_rev FROM daily_summary;
-- if there are no rows, count(*) is 0 -> ERROR: division by zero
-- if revenue and count are integers, the result is also truncated to a whole number`,
        right: `SELECT sum(revenue)::numeric / NULLIF(count(*), 0) AS avg_rev
FROM daily_summary;
-- ::numeric gives a fractional result; NULLIF turns a zero divisor into NULL, no error`,
        why: 'Two defects in one line. First, count(*) can legitimately be zero (an empty table, or an empty group), and integer division by zero is a hard error that aborts the whole statement, not a NULL. Wrap the divisor in NULLIF(x, 0) so a zero divisor yields NULL and the row simply has no average. Second, if both operands are integers the division truncates: revenue 100 over 3 orders is 33, not 33.33. Cast one side to numeric to keep the fraction. The combined form, numerator cast to numeric divided by NULLIF of the denominator, is the standard safe average.',
        whyHi: 'Ek line mein do defects. Pehla, count(*) legitimately zero ho sakta hai (ek empty table, ya ek empty group), aur integer division by zero ek hard error hai jo poora statement abort karta hai, ek NULL nahi. Divisor ko NULLIF(x, 0) mein wrap karo. Doosra, agar dono operands integers hain to division truncate karta hai: 3 orders par 100 revenue 33 hai, 33.33 nahi. Ek side ko numeric mein cast karo.',
      },
      {
        wrong: `SELECT * FROM product WHERE sku = 12345;
-- sku is a text column ("SKU-12345" style, or leading zeros "00042")
-- Postgres: ERROR operator does not exist: text = integer
-- MySQL: silently coerces, and '00042' = 42 is TRUE -> wrong row, no error`,
        right: `SELECT * FROM product WHERE sku = '12345';
-- compare text to text. If the column really holds numbers, fix the column type,
-- don't paper over it with a cast on every query.`,
        why: 'Comparing a text column to a numeric literal forces a type decision. PostgreSQL refuses and raises an error, which is annoying but safe. MySQL and SQLite coerce the text to a number, and now leading zeros, surrounding spaces, and trailing non-digits are silently stripped or truncated, so a query can match the wrong row or miss rows with no indication anything went wrong. Always compare like types: quote the literal when the column is text. If you find yourself casting a column on every query, that is a signal the column has the wrong type and should be migrated.',
        whyHi: 'Ek text column ko ek numeric literal se compare karna ek type decision force karta hai. PostgreSQL mana karta hai aur ek error raise karta hai, jo annoying par safe hai. MySQL aur SQLite text ko ek number mein coerce karte hain, aur ab leading zeros, spaces, aur trailing non-digits chupchaap strip ho jaate hain, to ek query galat row match kar sakti hai. Hamesha same types compare karo. Agar aap har query par ek column cast kar rahe ho, wo ek signal hai ki column ka type galat hai.',
      },
      {
        wrong: `SELECT price_cents / 100 AS dollars FROM item;
-- price_cents is an integer -> integer division -> 1999 / 100 = 19, not 19.99`,
        right: `SELECT price_cents / 100.0        AS dollars,     -- 19.99  (one operand is numeric)
       price_cents::numeric / 100 AS also_ok,
       round(price_cents / 100.0, 2) AS money
FROM item;`,
        why: 'Integer divided by integer stays integer in SQL, truncating toward zero, so a cents-to-dollars conversion loses the cents entirely: 1999 becomes 19. It is a silent data bug — no error, just a wrong number that looks plausible. The fix is to make at least one operand non-integer, either by writing the literal as 100.0 or by casting the column to numeric. Wrapping in round(..., 2) then gives a clean two-decimal money value. This bites constantly with cents, basis points, percentages, and any integer-stored fixed-point quantity.',
        whyHi: 'Integer divided by integer SQL mein integer rehta hai, zero ki taraf truncate karta hai, to ek cents-to-dollars conversion cents poori tarah kho deta hai: 1999 19 ban jaata hai. Ye ek silent data bug hai — koi error nahi, bस ek galat number jo plausible dikhता hai. Fix kam se kam ek operand ko non-integer banana hai, ya literal ko 100.0 likhкर ya column ko numeric mein cast karके.',
      },
    ],

    realWorld: [
      {
        en: '**`amount_cents::numeric / 100` (never `/ 100`) as a house rule for money display** — a linter flags integer `/` where the numerator is a `_cents` / `_bps` column, because the truncation is silent and ships wrong invoices.',
        hi: '**Money display ke liye ek house rule ke roop mein `amount_cents::numeric / 100`** — ek linter integer `/` ko flag karta hai jahaan numerator ek `_cents` column hai.',
      },
      {
        en: '**`x / NULLIF(y, 0)` everywhere a rate or ratio is computed** — conversion rate, click-through, average order value — so an empty denominator produces an honest `NULL` in the report instead of aborting the nightly job.',
        hi: '**Jahaan bhi ek rate ya ratio compute hota hai `x / NULLIF(y, 0)`** — conversion rate, average order value — to ek empty denominator report mein ek honest `NULL` produce karta hai nightly job abort karne ke bजाy.',
      },
      {
        en: '**A migration to fix a `varchar` "amount" column that was being `::numeric` cast in 40 queries** — the casts were a smell; the real fix was `ALTER COLUMN amount TYPE numeric(12,2) USING amount::numeric`.',
        hi: '**Ek `varchar` "amount" column ko fix karne ke liye ek migration jo 40 queries mein `::numeric` cast ho raha tha** — casts ek smell the; asli fix `ALTER COLUMN` tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `7 / 2` return `3` in SQL, and how do you get `3.5`?',
        qHi: 'SQL mein `7 / 2` `3` kyun return karta hai, aur aap `3.5` kaise paate ho?',
        a: 'SQL is statically typed and each operator is resolved by its operand types. Both 7 and 2 are integers, so the division operator that runs is integer-over-integer, whose result is also an integer, and the fractional part is discarded by truncating toward zero — so 7 over 2 is 3, and negative 7 over 2 is negative 3. This is not a rounding choice, it is the type of the operation. To get 3.5 you make at least one operand non-integer: write the literal as 7.0, or cast a column with the double-colon operator to numeric, or multiply by 1.0. Then the operator that runs is numeric division and the result keeps the fraction. This matters most with integer-stored fixed-point values — cents, basis points, percentages — where price_cents divided by 100 silently loses the cents, turning 1999 into 19 with no error. The safe pattern for money is to cast the numerator to numeric and often wrap the whole thing in round with two decimal places.',
        aHi: 'SQL statically typed hai aur har operator apne operand types se resolve hota hai. 7 aur 2 dono integers hain, to jo division operator chalta hai wo integer-over-integer hai, jiska result bhi ek integer hai, aur fractional part zero ki taraf truncate karke discard ho jaata hai — to 7 over 2 3 hai, aur negative 7 over 2 negative 3. Ye ek rounding choice nahi hai, ye operation ka type hai. 3.5 paane ke liye aap kam se kam ek operand ko non-integer banate ho: literal ko 7.0 likho, ya ek column ko double-colon operator se numeric mein cast karo. Ye integer-stored fixed-point values ke saath sabse zyaada maayne rakhta hai — cents, basis points — jahaan price_cents divided by 100 chupchaap cents kho deta hai.',
      },
      {
        q: 'What does casting a `numeric` to an `integer` do, and how is it different from `trunc()`?',
        qHi: 'Ek `numeric` ko `integer` mein cast karna kya karta hai, aur ye `trunc()` se kaise alag hai?',
        a: 'Casting a numeric or floating value to integer rounds it to the nearest whole number, using round-half-away-from-zero for the numeric type — so 3.5 becomes 4, 2.5 becomes 3, and negative 2.5 becomes negative 3. People frequently assume the cast truncates, and it does not, which produces off-by-one bugs when the intent was to chop the fractional part. trunc is the function that actually truncates toward zero: trunc of 3.9 is 3, trunc of negative 3.9 is negative 3. There is also floor, which goes toward negative infinity, so floor of negative 3.1 is negative 4, and ceil, which goes toward positive infinity. So the rule is: cast to integer when you want rounding, call trunc when you want to drop the fraction, and use floor or ceil when you specifically need the directional behaviour. One more wrinkle: rounding of the float types uses round-half-to-even, so casting a double 2.5 gives 2, not 3 — another reason to prefer numeric for anything where the rounding rule matters.',
        aHi: 'Ek numeric ya floating value ko integer mein cast karna ise nearest whole number mein round karta hai, numeric type ke liye round-half-away-from-zero istemal karke — to 3.5 4 ban jaata hai, 2.5 3, aur negative 2.5 negative 3. Log aksar maante hain ki cast truncate karta hai, aur ye nahi karta, jo off-by-one bugs produce karta hai. trunc wo function hai jo asal mein zero ki taraf truncate karta hai. floor bhi hai, jo negative infinity ki taraf jaata hai, aur ceil, jo positive infinity ki taraf. Ek aur baat: float types ki rounding round-half-to-even istemal karti hai, to ek double 2.5 cast karna 2 deta hai, 3 nahi.',
      },
    ],

    exercises: [
      {
        task: 'One `SELECT` (no table) computing: `9 / 4`, `9.0 / 4`, `9 % 4`, `(-9) % 4`, `9 ^ 2`, `\'100\'::int + 1`, `4.6::int`, `trunc(4.6)`. Predict every value, then run. Confirm integer division gives `2`, the negative modulo is `-1`, `4.6::int` is `5` (rounds) but `trunc(4.6)` is `4`.',
        taskHi: 'Ek `SELECT` (koi table nahi) jo compute karta hai: `9 / 4`, `9.0 / 4`, `9 % 4`, `(-9) % 4`, `9 ^ 2`, `\'100\'::int + 1`, `4.6::int`, `trunc(4.6)`. Har value predict karo, phir run karo.',
        hint: 'Integer `/` truncates: `9 / 4 = 2`. `%` sign follows the left operand: `(-9) % 4 = -1`. `::int` on `4.6` rounds to `5`; `trunc` chops to `4`.',
        hintHi: 'Integer `/` truncate karta hai: `9 / 4 = 2`. `%` sign left operand follow karta hai: `(-9) % 4 = -1`. `4.6` par `::int` `5` mein round karta hai; `trunc` `4` mein chop karta hai.',
      },
      {
        task: 'Table `metric(day date, hits int, visitors int)` with one row where `visitors = 0`. Run `SELECT day, hits / visitors FROM metric` and observe `ERROR: division by zero`. Rewrite as `hits::numeric / NULLIF(visitors, 0)` and confirm the zero-visitor row now returns `NULL` for the ratio instead of aborting.',
        taskHi: 'Table `metric(day date, hits int, visitors int)` ek row ke saath jahaan `visitors = 0`. `SELECT day, hits / visitors FROM metric` chalao aur `ERROR: division by zero` dekho. `hits::numeric / NULLIF(visitors, 0)` ke roop mein rewrite karo.',
        hint: '`NULLIF(visitors, 0)` returns `NULL` when `visitors` is `0`; `hits::numeric / NULL` is `NULL`, and `NULL` propagates without an error. The `::numeric` also keeps the ratio fractional.',
        hintHi: '`NULLIF(visitors, 0)` `NULL` return karta hai jab `visitors` `0` hai; `hits::numeric / NULL` `NULL` hai. `::numeric` ratio ko fractional bhi rakhta hai.',
      },
      {
        task: 'Table `flag_test(id int, active boolean)` with rows `(1,true) (2,false) (3,NULL)`. Write two queries: `WHERE NOT active` and `WHERE active IS NOT TRUE`. Confirm the first returns only id 2, the second returns id 2 AND id 3. Explain in one sentence why they differ.',
        taskHi: 'Table `flag_test(id int, active boolean)` rows `(1,true) (2,false) (3,NULL)` ke saath. Do queries likho: `WHERE NOT active` aur `WHERE active IS NOT TRUE`. Confirm pehli sirf id 2 return karti hai, doosri id 2 AUR id 3.',
        hint: '`NOT active` for the `NULL` row is `NOT NULL` = `UNKNOWN`, which `WHERE` drops. `active IS NOT TRUE` returns a definite `t` for both `false` and `NULL`.',
        hintHi: '`NULL` row ke liye `NOT active` `NOT NULL` = `UNKNOWN` hai, jise `WHERE` drop karta hai. `active IS NOT TRUE` `false` aur `NULL` dono ke liye ek definite `t` return karta hai.',
      },
    ],

    keyTakeaways: [
      'SQL is STATICALLY TYPED; an operator resolves by its operand types and that fixes the RESULT type. `integer / integer` -> `integer` (truncates toward zero: `7/2` = `3`, `-7/2` = `-3`). Make ONE side non-integer for a fraction: `7.0/2`, `x::numeric / 2`.',
      '`%` (modulo) result takes the sign of the DIVIDEND: `(-7) % 3` = `-1` (differs from Python). `^` is exponentiation (`double precision`), LEFT-associative in PostgreSQL: `2^3^2` = `(2^3)^2` = 64. Integer arithmetic OVERFLOWS -> `integer out of range` (use `bigint`/`numeric`).',
      '`||` -> `NULL` if ANY operand is `NULL` (use `concat()` which skips NULL). Text comparison uses COLLATION (locale-aware). `NULL` on either side of any comparison -> `UNKNOWN`.',
      '`IS TRUE` / `IS NOT TRUE` / `IS FALSE` / `IS UNKNOWN` collapse `UNKNOWN` to a definite `t`/`f`. `WHERE flag IS NOT TRUE` catches BOTH `false` and `NULL` rows; `WHERE NOT flag` MISSES the `NULL`s (`NOT NULL` = `UNKNOWN` = dropped).',
      'PRECEDENCE (high->low): `::` > unary `-` > `^` > `* / %` > `+ -` > `||` > comparisons/`BETWEEN`/`IN`/`LIKE`/`~` > `IS` > `NOT` > `AND` > `OR`. The biters: `AND` before `OR`, `||` before comparison, `::` binds so tight that `-2::text` = `-(2::text)`.',
      'CASTS: `CAST(x AS t)` (SQL-standard) === `x::t` (PostgreSQL, chainable). `numeric -> integer` ROUNDS half-away-from-zero (`3.5::int` = 4, `2.5::int` = 3) — it does NOT truncate; use `trunc()` to chop, `floor()`/`ceil()` for directional. FLOAT cast uses round-half-to-EVEN (`2.5::float` rounds to `2`).',
      'IMPLICIT COERCION is conservative in PostgreSQL: a string LITERAL (`\'42\'`) is "unknown type" and adapts (`\'42\' + 8` works), but a `text` COLUMN does NOT (`text_col + 8` -> `operator does not exist`). Numeric types widen implicitly. MySQL/SQLite coerce aggressively (`\'00042\' = 42` is true) — a portability + correctness hazard.',
      'DIVISION BY ZERO (`x / 0`, `x % 0`) is a hard ERROR that aborts the statement — NOT `NULL`, NOT infinity. Guard with `x / NULLIF(y, 0)` -> `NULL` when `y = 0`. Other non-silent runtime errors: `numeric field overflow`, `integer out of range`, `invalid input syntax for type ...`, `value too long for type varchar(n)`.',
    ],
    keyTakeawaysHi: [
      'SQL STATICALLY TYPED hai; ek operator apne operand types se resolve hota hai aur wo RESULT type tय karta hai. `integer / integer` -> `integer` (zero ki taraf truncate: `7/2` = `3`). Fraction ke liye EK side non-integer banao: `7.0/2`, `x::numeric / 2`.',
      '`%` result DIVIDEND ka sign leta hai: `(-7) % 3` = `-1` (Python se alag). `^` PostgreSQL mein LEFT-associative: `2^3^2` = `(2^3)^2` = 64. Integer arithmetic OVERFLOW -> `integer out of range`.',
      '`||` -> `NULL` agar KOI operand `NULL` hai (`concat()` istemal karo). Text comparison COLLATION istemal karta hai. Kisi bhi comparison ke kisi bhi side par `NULL` -> `UNKNOWN`.',
      '`IS TRUE` / `IS NOT TRUE` / `IS FALSE` `UNKNOWN` ko ek definite `t`/`f` mein collapse karte hain. `WHERE flag IS NOT TRUE` `false` aur `NULL` DONO rows pakadta hai; `WHERE NOT flag` `NULL`s MISS karta hai.',
      'PRECEDENCE (high->low): `::` > unary `-` > `^` > `* / %` > `+ -` > `||` > comparisons > `IS` > `NOT` > `AND` > `OR`. Biters: `AND` `OR` se pehle, `||` comparison se pehle, `::` itna tight ki `-2::text` = `-(2::text)`.',
      'CASTS: `CAST(x AS t)` === `x::t` (PostgreSQL, chainable). `numeric -> integer` half-away-from-zero ROUND karta hai (`3.5::int` = 4, `2.5::int` = 3) — truncate NAHI; `trunc()` se chop karo. FLOAT cast round-half-to-EVEN (`2.5::float` -> `2`).',
      'IMPLICIT COERCION PostgreSQL mein conservative hai: ek string LITERAL (`\'42\'`) adapt karta hai, par ek `text` COLUMN NAHI (`text_col + 8` -> `operator does not exist`). MySQL/SQLite aggressively coerce karte hain — portability + correctness hazard.',
      'DIVISION BY ZERO (`x / 0`) ek hard ERROR hai jo statement abort karta hai — `NULL` NAHI. `x / NULLIF(y, 0)` se guard karo. Doosre non-silent errors: `numeric field overflow`, `integer out of range`, `invalid input syntax for type ...`.',
    ],
  },

  {
    slug: 'sql-pattern-matching',
    title: 'Pattern Matching: `LIKE`, `ILIKE`, `SIMILAR TO`, Regex',
    titleHi: 'Pattern Matching: `LIKE`, `ILIKE`, `SIMILAR TO`, Regex',
    description: '`LIKE` matches simple wildcards (`%` = any run, `_` = one char). `ILIKE` is its case-insensitive form. For anything real — digit classes, alternation, capture, replace — use POSIX regular expressions with `~`, `regexp_match`, `regexp_replace`. And a leading `%` means the query cannot use a normal B-tree index.',
    descriptionHi: '`LIKE` simple wildcards match karta hai (`%` = koi bhi run, `_` = ek char). `ILIKE` iska case-insensitive form hai. Kisi bhi asli cheez ke liye — digit classes, alternation, capture, replace — POSIX regular expressions istemal karo `~`, `regexp_match`, `regexp_replace` ke saath. Aur ek leading `%` ka matlab query ek normal B-tree index istemal nahi kar sakti.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**Two search tools at a library desk.** The first is a stencil card with a few cut-out shapes — a full-width slot (`%`) you can slide over any run of characters, and a single-letter square (`_`). Hold it over a title and see if the visible letters line up. It is fast and anyone can use it, but it can only express "starts with", "ends with", "contains", "this many characters then that". That is `LIKE`. The second tool is a full pattern language on a laminated sheet — "a digit, then one or more letters, then optionally a dash and four more digits, and capture the middle part" — far more powerful, able to describe almost any shape, and correspondingly slower and easier to get subtly wrong. That is a regular expression. A librarian reaches for the stencil for the common cases and the pattern sheet only when the stencil cannot say what they need. And one practical note about the stencil: if the cut-out slot is at the *front* of the card, the librarian cannot use the alphabetical card catalogue to jump straight to a section — they have to check every card. A pattern that starts with `%` has the same problem with a database index.',
      hi: '**Ek library desk par do search tools.** Pehla ek stencil card hai jismें kuch cut-out shapes hain — ek full-width slot (`%`) jise aap characters ke kisi bhi run par slide kar sakte ho, aur ek single-letter square (`_`). Ise ek title par rakho aur dekho ki visible letters line up hote hain ya nahi. Ye fast hai aur koi bhi istemal kar sakta hai, par ye sirf "starts with", "ends with", "contains" express kar sakta hai. Wo `LIKE` hai. Doosra tool ek laminated sheet par ek poori pattern language hai — "ek digit, phir ek ya zyaada letters, phir optionally ek dash aur chaar aur digits, aur middle part capture karo" — bahut zyaada powerful, aur uske hisaab se slower aur subtly galat karna aasान. Wo ek regular expression hai. Aur stencil ke baare mein ek practical note: agar cut-out slot card ke *aage* hai, librarian alphabetical card catalogue istemal karke ek section par seedhे jump nahi kar sakta. Ek pattern jo `%` se shuru hota hai iski wahi problem ek database index ke saath hai.',
    },

    simple: `**\`LIKE\` — two wildcards**

\`\`\`sql
WHERE title LIKE 'The %'      -- starts with "The "  (% = zero or more of any char)
WHERE title LIKE '%SQL%'      -- contains "SQL"
WHERE code  LIKE 'A_-___'     -- 'A', one char, '-', three chars  (_ = exactly one char)
WHERE title NOT LIKE '%draft%'
WHERE title ILIKE 'the %'     -- case-insensitive (PostgreSQL extension)
\`\`\`

**Escaping a literal \`%\` or \`_\`**

\`\`\`sql
WHERE label LIKE '100\\% off'      -- match a real percent sign  (\\ is the default escape)
WHERE name  LIKE 'a\\_b'           -- match a real underscore
WHERE path  LIKE '%/log%' ESCAPE '!'   -- choose a different escape char if \\ is inconvenient
\`\`\`

**POSIX regular expressions — the real tool**

\`\`\`sql
WHERE s ~  '[0-9]{3}-[0-9]{4}'   -- ~  = matches (case-sensitive)
WHERE s ~* '^abc'                -- ~* = case-insensitive
WHERE s !~ '@'                   -- !~ = does not match
\`\`\`

**Extract / replace / split with regex functions**

\`\`\`sql
regexp_match('order-42', 'order-([0-9]+)')        -- {42}   -> a text[] of the captures
(regexp_match('order-42', 'order-([0-9]+)'))[1]   -- '42'   -> first capture group
regexp_replace('a1b2c3', '[0-9]', '#', 'g')       -- 'a#b#c#'   ('g' = replace all)
regexp_split_to_array('2026-03-15', '-')          -- {2026,03,15}
regexp_split_to_table('a,b,c', ',')               -- one row per piece
\`\`\`

**Character classes and anchors**

\`\`\`
[0-9]  [a-z]  [A-Za-z0-9_]        [[:digit:]]  [[:alpha:]]  [[:space:]]   (POSIX class names)
^  start    $  end    .  any char    \\b  word boundary
*  0+    +  1+    ?  0 or 1    {n}  exactly n    {n,m}  n to m
a|b  a OR b       (…)  group + capture       (?:…)  group without capture
\`\`\`

**The index caveat**

\`\`\`sql
WHERE email LIKE 'ada@%'      -- prefix match: a B-tree index on email CAN be used
WHERE email LIKE '%@acme.com' -- leading %: a plain B-tree index CANNOT help -> full scan
-- for infix / fuzzy search at scale: a trigram index (pg_trgm, Module 11) or full-text search
\`\`\``,

    simpleHi: `**\`LIKE\` — do wildcards**

\`\`\`sql
WHERE title LIKE 'The %'      -- "The " se shuru  (% = kisi bhi char ka zero ya zyaada)
WHERE title LIKE '%SQL%'      -- "SQL" contain karta hai
WHERE code  LIKE 'A_-___'     -- 'A', ek char, '-', teen chars  (_ = theek ek char)
WHERE title ILIKE 'the %'     -- case-insensitive (PostgreSQL extension)
\`\`\`

**Ek literal \`%\` ya \`_\` escape karna**

\`\`\`sql
WHERE label LIKE '100\\% off'      -- ek asli percent sign match karo  (\\ default escape hai)
WHERE path  LIKE '%/log%' ESCAPE '!'   -- ek alag escape char chuno
\`\`\`

**POSIX regular expressions — asli tool**

\`\`\`sql
WHERE s ~  '[0-9]{3}-[0-9]{4}'   -- ~  = matches (case-sensitive)
WHERE s ~* '^abc'                -- ~* = case-insensitive
WHERE s !~ '@'                   -- !~ = does not match
\`\`\`

**Regex functions se extract / replace / split**

\`\`\`sql
(regexp_match('order-42', 'order-([0-9]+)'))[1]   -- '42'   -> pehla capture group
regexp_replace('a1b2c3', '[0-9]', '#', 'g')       -- 'a#b#c#'   ('g' = sabhi replace)
regexp_split_to_array('2026-03-15', '-')          -- {2026,03,15}
regexp_split_to_table('a,b,c', ',')               -- prati piece ek row
\`\`\`

**Character classes aur anchors**

\`\`\`
[0-9]  [a-z]  [[:digit:]]  [[:alpha:]]      ^  start    $  end    .  koi bhi char
*  0+    +  1+    ?  0 ya 1    {n}  theek n     a|b  a YA b    (…)  group + capture
\`\`\`

**Index caveat**

\`\`\`sql
WHERE email LIKE 'ada@%'      -- prefix match: email par ek B-tree index ISTEMAL ho sakta hai
WHERE email LIKE '%@acme.com' -- leading %: ek plain B-tree index MADAD NAHI kar sakta -> full scan
-- scale par infix / fuzzy search ke liye: ek trigram index (pg_trgm, Module 11) ya full-text search
\`\`\``,

    content: `## \`LIKE\` — simple wildcard matching

\`LIKE\` compares a string against a pattern with exactly two special characters:

- **\`%\`** — matches any sequence of zero or more characters.
- **\`_\`** — matches exactly one character.

Everything else in the pattern is literal. \`'The %'\` means "the literal \`The \` followed by anything"; \`'%SQL%'\` means "contains \`SQL\`"; \`'____'\` means "exactly four characters". \`LIKE\` is anchored implicitly to the whole string — there is no partial match, so \`'SQL'\` only matches the exact string \`SQL\`, and you need \`'%SQL%'\` for "contains".

**\`ILIKE\`** is a PostgreSQL extension: the same thing, case-insensitively. \`NOT LIKE\` / \`NOT ILIKE\` negate. (Standard SQL has no \`ILIKE\`; the portable equivalent is \`lower(col) LIKE lower(pattern)\`.)

### Escaping \`%\` and \`_\`

To match a literal percent or underscore, precede it with the **escape character**, which defaults to backslash: \`LIKE '100\\% done'\`, \`LIKE 'first\\_name'\`. If backslash is awkward (it often is, given string-literal escaping), pick another: \`LIKE '10!% off' ESCAPE '!'\`.

## \`SIMILAR TO\` — avoid it

\`SIMILAR TO\` is a SQL-standard hybrid: \`LIKE\` wildcards **plus** regex operators (\`|\`, \`*\`, \`+\`, \`()\`, \`[]\`). In practice nobody uses it — it is less capable than a real regex, unfamiliar, and no faster. If \`LIKE\` is not enough, jump straight to POSIX regex.

## POSIX regular expressions

PostgreSQL has full **Advanced Regular Expressions** (a superset of POSIX ERE). The match operators:

| operator | meaning |
|---|---|
| \`~\` | matches, case-sensitive |
| \`~*\` | matches, case-insensitive |
| \`!~\` | does not match, case-sensitive |
| \`!~*\` | does not match, case-insensitive |

Unlike \`LIKE\`, a regex matches **any substring** by default — \`s ~ 'abc'\` is true if \`abc\` appears anywhere. Anchor with \`^\` (start) and \`$\` (end) when you mean the whole string.

Core syntax: \`.\` any char, \`[...]\` character class, \`[^...]\` negated class, \`\\d\` \`\\w\` \`\\s\` (and POSIX names \`[[:digit:]]\` \`[[:alpha:]]\` \`[[:space:]]\`), quantifiers \`* + ? {n} {n,m}\` (greedy by default, add \`?\` for lazy: \`.*?\`), alternation \`a|b\`, grouping \`(...)\` (captures) and \`(?:...)\` (no capture), \`^ $\` anchors, \`\\b\` word boundary, backreferences \`\\1\`.

*(Note when writing SQL in a host language: a backslash in a single-quoted SQL literal or a template string may need doubling. \`[0-9]\` and \`[[:digit:]]\` sidestep that entirely.)*

## Regex functions

- **\`regexp_match(string, pattern [, flags])\`** → a \`text[]\` of the **capture groups** of the first match (or the whole match in element 1 if there are no groups), or \`NULL\` if no match. Extract with a subscript: \`(regexp_match(s, '...(...)...'))[1]\`.
- **\`regexp_matches(string, pattern, 'g')\`** → **a set** (one row per match) — use in \`FROM\` or with \`SELECT\` when you want all matches.
- **\`regexp_replace(string, pattern, replacement [, flags])\`** → replace the **first** match; pass \`'g'\` to replace all. \`replacement\` can reference groups with \`\\1\`, \`\\2\`.
- **\`regexp_split_to_array(string, pattern)\`** / **\`regexp_split_to_table(string, pattern)\`** → split on the pattern (regex delimiter), into an array or a set of rows.
- PostgreSQL 15+ adds \`regexp_count\`, \`regexp_instr\`, \`regexp_like\`, \`regexp_substr\`.

Flags: \`i\` case-insensitive, \`g\` global (all matches), \`n\`/\`m\` newline-sensitive, \`x\` extended (ignore whitespace in the pattern).

## The performance caveat: leading wildcards and indexes

A **B-tree index** on a text column stores values in sorted order, so it can accelerate a **prefix** match — \`WHERE email LIKE 'ada@%'\` can seek to the \`ada@\` range and scan forward. But \`WHERE email LIKE '%@acme.com'\` or \`WHERE name ILIKE '%smith%'\` has no fixed prefix, so a plain B-tree cannot help and the database scans every row.

For fast infix or fuzzy text search at scale you need a different index type:

- **\`pg_trgm\` trigram indexes** (\`gin_trgm_ops\` / \`gist_trgm_ops\`) — index all 3-character substrings, so \`LIKE '%smith%'\`, \`ILIKE\`, and similarity searches become index-backed. (Module 11.)
- **Full-text search** (\`tsvector\` + GIN) — for word-based search with stemming and ranking. (Module 11.)
- A **functional index** on \`lower(col)\` for case-insensitive *prefix* / *exact* matches without \`pg_trgm\`.

## Which to use

- Simple \`starts with\` / \`ends with\` / \`contains\` / \`exactly N chars\` → **\`LIKE\` / \`ILIKE\`**. Readable, portable, and prefix matches use an index.
- Validation, extraction, structured replacement, splitting on a pattern → **regex** (\`~\`, \`regexp_*\`).
- Heavy repeated fuzzy search → don't do it with \`LIKE '%...%'\` per query; build a trigram or full-text index.
- \`SIMILAR TO\` → never.`,

    contentHi: `## \`LIKE\` — simple wildcard matching

\`LIKE\` ek string ko ek pattern se compare karta hai theek do special characters ke saath:
- **\`%\`** — zero ya zyaada characters ka koi bhi sequence match karta hai.
- **\`_\`** — theek ek character match karta hai.

Baaki sab kuch literal hai. \`LIKE\` implicitly poori string se anchored hai — koi partial match nahi, to "contains" ke liye \`'%SQL%'\` chahiye.

**\`ILIKE\`** ek PostgreSQL extension hai: wahi cheez, case-insensitively. Portable equivalent \`lower(col) LIKE lower(pattern)\` hai.

### \`%\` aur \`_\` escape karna

Ek literal percent ya underscore match karne ke liye, ise **escape character** se pehle karo, jo backslash default hai: \`LIKE '100\\% done'\`. Ek alag chuno: \`LIKE '10!% off' ESCAPE '!'\`.

## \`SIMILAR TO\` — ise avoid karo

\`SIMILAR TO\` ek SQL-standard hybrid hai: \`LIKE\` wildcards **plus** regex operators. Practice mein koi ise istemal nahi karta. Agar \`LIKE\` kaafi nahi, seedhे POSIX regex par jaao.

## POSIX regular expressions

Match operators: \`~\` (matches, case-sensitive), \`~*\` (case-insensitive), \`!~\` (does not match), \`!~*\`.

\`LIKE\` ke ulta, ek regex default se **koi bhi substring** match karta hai — \`s ~ 'abc'\` true hai agar \`abc\` kahin bhi aata hai. \`^\` (start) aur \`$\` (end) se anchor karo jab aapka matlab poori string hai.

Core syntax: \`.\` koi bhi char, \`[...]\` character class, \`\\d\` \`\\w\` \`\\s\` (aur POSIX names \`[[:digit:]]\`), quantifiers \`* + ? {n} {n,m}\` (greedy default, lazy ke liye \`?\`: \`.*?\`), alternation \`a|b\`, grouping \`(...)\` (captures) aur \`(?:...)\` (no capture).

*(Ek host language mein SQL likhte samay: ek single-quoted SQL literal mein ek backslash double karna pad sakta hai. \`[0-9]\` aur \`[[:digit:]]\` ise poori tarah sidestep karte hain.)*

## Regex functions

- **\`regexp_match(string, pattern)\`** -> pehle match ke **capture groups** ka ek \`text[]\`, ya no match par \`NULL\`. Subscript se extract karo: \`(regexp_match(s, '...(...)...'))[1]\`.
- **\`regexp_matches(string, pattern, 'g')\`** -> **ek set** (prati match ek row).
- **\`regexp_replace(string, pattern, replacement [, flags])\`** -> **pehla** match replace karo; \`'g'\` sabhi ke liye. \`replacement\` groups ko \`\\1\` se reference kar sakta hai.
- **\`regexp_split_to_array\`** / **\`regexp_split_to_table\`** -> pattern par split karo.

Flags: \`i\` case-insensitive, \`g\` global, \`x\` extended.

## Performance caveat: leading wildcards aur indexes

Ek text column par ek **B-tree index** values ko sorted order mein store karta hai, to ye ek **prefix** match accelerate kar sakta hai — \`WHERE email LIKE 'ada@%'\` \`ada@\` range par seek kar sakta hai. Par \`WHERE email LIKE '%@acme.com'\` ka koi fixed prefix nahi hai, to ek plain B-tree madad nahi kar sakta aur database har row scan karta hai.

Scale par fast infix ya fuzzy text search ke liye:
- **\`pg_trgm\` trigram indexes** — sabhi 3-character substrings index karte hain. (Module 11.)
- **Full-text search** (\`tsvector\` + GIN) — stemming aur ranking ke saath. (Module 11.)
- \`lower(col)\` par ek **functional index** case-insensitive *prefix* / *exact* matches ke liye.

## Kaunsa istemal karo

- Simple \`starts with\` / \`ends with\` / \`contains\` -> **\`LIKE\` / \`ILIKE\`**.
- Validation, extraction, structured replacement, pattern par splitting -> **regex**.
- Bhaari repeated fuzzy search -> prati query \`LIKE '%...%'\` mat karo; ek trigram ya full-text index banao.
- \`SIMILAR TO\` -> kabhi nahi.`,

    examples: [
      {
        title: 'LIKE wildcards, ILIKE, and escaping a literal % and _',
        titleHi: 'LIKE wildcards, ILIKE, aur ek literal % aur _ escape karna',
        code: `CREATE TABLE label (s text);
INSERT INTO label VALUES ('The Cat'), ('the cat'), ('50% off'), ('a_b'), ('axb');

SELECT s FROM label WHERE s LIKE 'The %';       -- exact case
SELECT s FROM label WHERE s ILIKE 'the %';      -- case-insensitive -> both
SELECT s FROM label WHERE s LIKE '50\\% off';    -- literal percent
SELECT s FROM label WHERE s LIKE 'a\\_b';        -- literal underscore (NOT "a<any>b")`,
        output: ` s
---------
 The Cat
(1 row)

 s
---------
 The Cat
 the cat
(2 rows)

 s
---------
 50% off
(1 row)

 s
-----
 a_b
(1 row)`,
        explain: '`LIKE \'The %\'` is case-sensitive so it matches only `\'The Cat\'`; `ILIKE \'the %\'` matches both cases. `LIKE \'50\\% off\'` — the backslash escapes the `%` so it matches a literal percent sign, not "any run of characters". Likewise `LIKE \'a\\_b\'` matches the literal `a_b` and NOT `axb` (an unescaped `_` would match any one character).',
        explainHi: "`LIKE 'The %'` case-sensitive hai to sirf `'The Cat'` match karता hai; `ILIKE 'the %'` dono cases match karता hai. `LIKE '50\\% off'` — backslash `%` escape karता hai to ye ek literal percent sign match karता hai. Waise hi `LIKE 'a\\_b'` literal `a_b` match karता hai aur `axb` NAHI.",
      },
      {
        title: 'Regex: match, extract a capture group, replace all, split',
        titleHi: 'Regex: match, ek capture group extract, sabhi replace, split',
        code: `SELECT
  'abc123'  ~  '[0-9]+'                                  AS has_digit,
  'ABC'     ~* '^abc$'                                   AS ci_exact,
  (regexp_match('order-42', 'order-([0-9]+)'))[1]        AS captured,
  regexp_replace('a1b2c3', '[0-9]', '#', 'g')            AS masked,
  regexp_split_to_array('2026-03-15', '-')               AS parts;`,
        output: ` has_digit | ci_exact | captured | masked | parts
-----------+----------+----------+--------+--------------------
 t         | t        | 42       | a#b#c# | ["2026","03","15"]
(1 row)`,
        explain: "`~ '[0-9]+'` is `true` because a regex matches any substring by default and `abc123` contains digits. `~* '^abc$'` is case-insensitive and anchored, so `'ABC'` matches. `(regexp_match('order-42', 'order-([0-9]+)'))[1]` pulls out the first capture group as text, `'42'`. `regexp_replace(..., 'g')` replaces every digit; without `'g'` it would replace only the first.",
        explainHi: "`~ '[0-9]+'` `true` hai kyunki ek regex default se koi bhi substring match karता hai aur `abc123` mein digits hain. `~* '^abc$'` case-insensitive aur anchored hai. `(regexp_match(...))[1]` pehla capture group text ke roop mein nikालता hai, `'42'`. `regexp_replace(..., 'g')` har digit replace karता hai.",
      },
      {
        title: 'A prefix LIKE can use an index; a leading % cannot',
        titleHi: 'Ek prefix LIKE ek index istemal kar sakta hai; ek leading % nahi',
        code: `CREATE TABLE account (email text);
INSERT INTO account
SELECT 'user' || g || '@' || (CASE WHEN g % 2 = 0 THEN 'acme.com' ELSE 'other.com' END)
FROM generate_series(1, 5) AS g;

-- prefix: bounded range, index-friendly
SELECT email FROM account WHERE email LIKE 'user2%' ORDER BY email;

-- infix: no fixed prefix, must check every row
SELECT email FROM account WHERE email LIKE '%@acme.com' ORDER BY email;`,
        output: ` email
----------------
 user2@acme.com
(1 row)

 email
----------------
 user2@acme.com
 user4@acme.com
(2 rows)`,
        explain: "`LIKE 'user2%'` has a fixed prefix, so a B-tree index on `email` could satisfy it by seeking to the `user2` range — here it returns just `user2@acme.com`. `LIKE '%@acme.com'` has no fixed prefix; the database must examine every row, returning `user2` and `user4`. Same result correctness, very different cost at scale — the leading `%` is why the second query cannot use a plain index.",
        explainHi: "`LIKE 'user2%'` ka ek fixed prefix hai, to `email` par ek B-tree index ise `user2` range par seek karके satisfy kar sakta hai. `LIKE '%@acme.com'` ka koi fixed prefix nahi; database ko har row examine karना hoga. Same correctness, scale par bahut alag cost — leading `%` isliye doosri query ek plain index istemal nahi kar sakti.",
      },
    ],

    mistakes: [
      {
        wrong: `-- "find users named smith, any case"
SELECT * FROM users WHERE name LIKE '%smith%';
-- misses "Smith", "SMITH", "Smithers".. and on a big table scans every row`,
        right: `-- case-insensitive:
SELECT * FROM users WHERE name ILIKE '%smith%';
-- and for it to be fast at scale, an index that supports infix search:
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX users_name_trgm ON users USING gin (name gin_trgm_ops);`,
        why: 'LIKE is case-sensitive, so a lowercase pattern silently excludes every capitalised match, which for names is most of them. ILIKE (or lower(name) LIKE lower(pattern) for portability) fixes the case problem. The second issue is performance: a pattern with a leading percent has no fixed prefix, so a normal B-tree index on name is useless and every such query is a full table scan. If infix name search is a real feature, add a pg_trgm GIN index, which indexes every three-character substring and makes contains-style LIKE and ILIKE index-backed. Doing repeated percent-wrapped LIKE without that index is one of the most common causes of a query that is fine in dev and melts in production.',
        whyHi: 'LIKE case-sensitive hai, to ek lowercase pattern chupchaap har capitalised match ko exclude karta hai, jo names ke liye zyaadatar hain. ILIKE (ya portability ke liye lower(name) LIKE lower(pattern)) case problem fix karta hai. Doosra issue performance hai: ek leading percent waale pattern ka koi fixed prefix nahi hai, to name par ek normal B-tree index bekaar hai aur har aisi query ek full table scan hai. Agar infix name search ek real feature hai, ek pg_trgm GIN index add karo.',
      },
      {
        wrong: `-- validate an email with LIKE
SELECT * FROM signup WHERE email LIKE '%@%.%';
-- accepts "  @ .", "a@@b..c", "@.@" -- LIKE cannot express structure`,
        right: `SELECT * FROM signup
WHERE email ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$';
-- (a pragmatic check; full RFC-compliant email regex is not worth it --
--  the only real validation is sending a confirmation link)`,
        why: 'LIKE has exactly two wildcards and no way to say "one or more", "not a space", "digits only", or "anchored to the whole string". So a LIKE pattern for something structured like an email accepts a lot of garbage. A regex can express the structure: no spaces or at-signs in the local part, an at-sign, a domain with at least one dot. Anchoring with caret and dollar is essential — without them the regex matches if the pattern appears anywhere in the string. That said, email validation by pattern is a rabbit hole; the only validation that means anything is delivering a message to the address.',
        whyHi: 'LIKE ke theek do wildcards hain aur "ek ya zyaada", "space nahi", "sirf digits", ya "poori string se anchored" kehne ka koi tareeka nahi. To email jaisi structured cheez ke liye ek LIKE pattern bahut garbage accept karta hai. Ek regex structure express kar sakta hai. Caret aur dollar se anchoring zaroori hai — unke bina regex match karta hai agar pattern string mein kahin bhi aata hai.',
      },
      {
        wrong: `-- strip all non-digits from a phone number
SELECT regexp_replace(phone, '[^0-9]', '') FROM contact;
-- only removes the FIRST non-digit: "+1 (555) 123-4567" -> "1 (555) 123-4567"`,
        right: `SELECT regexp_replace(phone, '[^0-9]', '', 'g') FROM contact;
-- the 'g' flag replaces every match -> "15551234567"`,
        why: 'regexp_replace replaces only the first match unless you pass the g flag. Without it, a "remove all X" intent removes exactly one X and leaves the rest, which is a subtle bug because the output looks almost right. Any time you are cleaning or masking a string with regexp_replace, you almost certainly want g. The same applies to regexp_matches, where without g you get only the first match as a single row.',
        whyHi: 'regexp_replace sirf pehla match replace karta hai jab tak aap g flag pass nahi karte. Iske bina, ek "sab X hatao" intent theek ek X hatata hai aur baaki chhod deta hai, jo ek subtle bug hai kyunki output lगbhag sahi dikhता hai. Jab bhi aap regexp_replace se ek string clean ya mask kar rahe ho, aapको lगbhag zaroor g chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A `pg_trgm` GIN index on `product.name` and `customer.email`** so the admin search box (`ILIKE \'%term%\'`) stays fast as the tables grow, instead of every keystroke triggering a sequential scan.',
        hi: '**`product.name` aur `customer.email` par ek `pg_trgm` GIN index** taaki admin search box (`ILIKE \'%term%\'`) tables badhne par fast rahe.',
      },
      {
        en: '**`regexp_replace(raw_sku, \'[^A-Z0-9]\', \'\', \'g\')` in an import pipeline** to normalise supplier SKUs to a canonical form before matching them against the catalogue.',
        hi: '**Ek import pipeline mein `regexp_replace(raw_sku, \'[^A-Z0-9]\', \'\', \'g\')`** supplier SKUs ko catalogue se match karne se pehle ek canonical form mein normalise karne ke liye.',
      },
      {
        en: '**A CHECK constraint `CHECK (slug ~ \'^[a-z0-9]+(-[a-z0-9]+)*$\')`** so a malformed URL slug can never be inserted, enforced by the database rather than only by the application.',
        hi: '**Ek CHECK constraint `CHECK (slug ~ \'^[a-z0-9]+(-[a-z0-9]+)*$\')`** taaki ek malformed URL slug kabhi insert na ho sake, database dwara enforce.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you use `LIKE` vs a regular expression, and what is the index caveat with `LIKE`?',
        qHi: 'Aap `LIKE` vs ek regular expression kab istemal karte ho, aur `LIKE` ke saath index caveat kya hai?',
        a: 'LIKE has exactly two metacharacters: percent for any run of characters and underscore for a single character. It is the right tool for the simple shapes — starts with, ends with, contains, exactly N characters, a fixed template with a couple of wildcard positions. It is readable, portable, and case-insensitive via ILIKE in PostgreSQL. You move to a regular expression the moment you need structure LIKE cannot express: one-or-more, character classes like digits or non-space, alternation, anchoring to the whole string, or capturing part of the match to extract it. The regex operators are tilde and tilde-star for match and case-insensitive match, plus the regexp_match, regexp_replace, and regexp_split functions, and note regexp_replace only replaces the first match unless you pass the g flag. The index caveat is about prefixes. A B-tree index on a text column stores values sorted, so a pattern with a fixed prefix and a trailing percent, like ada-at-percent, can be satisfied by seeking to that range. But a pattern that starts with a percent, or an ILIKE, has no fixed prefix, so a plain B-tree cannot help and every such query scans the whole table. For fast contains-style or fuzzy search at scale you need a trigram index from pg_trgm, or full-text search, not repeated percent-wrapped LIKE.',
        aHi: 'LIKE ke theek do metacharacters hain: percent kisi bhi run ke liye aur underscore ek single character ke liye. Ye simple shapes ke liye sahi tool hai — starts with, ends with, contains, theek N characters. Ye readable, portable, aur PostgreSQL mein ILIKE ke through case-insensitive hai. Aap ek regular expression par tab jaate ho jab aapko structure chahiye jo LIKE express nahi kar sakta: one-or-more, character classes, alternation, poori string se anchoring, ya match ka part capture karna. Index caveat prefixes ke baare mein hai. Ek text column par ek B-tree index values ko sorted store karta hai, to ek fixed prefix aur trailing percent waala pattern us range par seek karke satisfy ho sakta hai. Par ek pattern jo percent se shuru hota hai, ya ek ILIKE, ka koi fixed prefix nahi hai. Scale par fast contains-style search ke liye aapko pg_trgm se ek trigram index chahiye.',
      },
      {
        q: 'How do you extract a substring with a regex in PostgreSQL, and what does `regexp_match` return?',
        qHi: 'Aap PostgreSQL mein ek regex se ek substring kaise extract karte ho, aur `regexp_match` kya return karta hai?',
        a: 'regexp_match takes a string and a pattern and returns a text array of the capture groups from the first match, or NULL if there is no match. If the pattern has parenthesised groups, the array holds each group in order; if it has no groups, the array has a single element which is the entire matched substring. So to pull out a piece you wrap a capture group in the pattern and subscript the result: regexp_match of the string and a pattern like prefix-open-paren-digits-close-paren, then square bracket one, gives you the digits as text. Because it returns an array, you often see it wrapped in parentheses before the subscript. If you need every match rather than just the first, use regexp_matches with the g flag, which returns a set with one row per match, and you use it in the FROM clause or as a set-returning expression. For simple splitting, regexp_split_to_array and regexp_split_to_table cut a string on a regex delimiter into an array or a set of rows respectively. And regexp_replace does substitution, first match only unless you add g, with backreference syntax like backslash-one in the replacement to reuse captured groups.',
        aHi: 'regexp_match ek string aur ek pattern leta hai aur pehle match ke capture groups ka ek text array return karta hai, ya no match par NULL. Agar pattern mein parenthesised groups hain, array har group ko order mein rakhता hai; agar iske koi groups nahi, array ka ek single element hai jo poora matched substring hai. To ek piece nikalne ke liye aap pattern mein ek capture group wrap karte ho aur result ko subscript karte ho: string aur ek pattern jaise prefix-open-paren-digits-close-paren ka regexp_match, phir square bracket one, aapko digits text ke roop mein deta hai. Agar aapko har match chahiye, g flag ke saath regexp_matches istemal karo. regexp_replace substitution karta hai, sirf pehla match jab tak aap g na add karo.',
      },
    ],

    exercises: [
      {
        task: 'Table `entry(s text)` with values `\'File_01.txt\'`, `\'file_02.log\'`, `\'File_03.TXT\'`, `\'notes\'`. Write: (a) `LIKE` for "starts with File_ (exact case)"; (b) `ILIKE` for "starts with file_ any case"; (c) `~` regex for "ends with .txt or .log, case-insensitively". Confirm (a) returns 2, (b) returns 3, (c) returns 3.',
        taskHi: 'Table `entry(s text)` values `\'File_01.txt\'`, `\'file_02.log\'`, `\'File_03.TXT\'`, `\'notes\'` ke saath. Likho: (a) "File_ se shuru (exact case)" ke liye `LIKE`; (b) "file_ se shuru any case" ke liye `ILIKE`; (c) ".txt ya .log par khatam, case-insensitively" ke liye `~` regex.',
        hint: '(a) `LIKE \'File\\_%\'`. (b) `ILIKE \'file\\_%\'`. (c) `s ~* \'\\.(txt|log)$\'` — anchor the end with `$`, escape the dot, use `~*` for case-insensitive.',
        hintHi: '(a) `LIKE \'File\\_%\'`. (b) `ILIKE \'file\\_%\'`. (c) `s ~* \'\\.(txt|log)$\'` — end ko `$` se anchor karo, dot escape karo.',
      },
      {
        task: 'One `SELECT` computing: `regexp_replace(\'a-b-c-d\', \'-\', \'/\')` (no flag) vs the same with `\'g\'`; and `(regexp_match(\'INV-2026-0042\', \'INV-([0-9]{4})-([0-9]+)\'))` — extract the year and the number as two separate columns. Confirm the no-flag replace gives `\'a/b-c-d\'` and the year/number are `\'2026\'` / `\'0042\'`.',
        taskHi: 'Ek `SELECT` jo compute karta hai: `regexp_replace(\'a-b-c-d\', \'-\', \'/\')` (no flag) vs `\'g\'` ke saath wahi; aur `regexp_match(\'INV-2026-0042\', \'INV-([0-9]{4})-([0-9]+)\')` — year aur number ko do alag columns ke roop mein extract karo.',
        hint: '`(regexp_match(...))[1]` is the first group (year), `[2]` is the second (number). Without `\'g\'`, `regexp_replace` changes only the first `-`.',
        hintHi: '`(regexp_match(...))[1]` pehla group hai (year), `[2]` doosra (number). `\'g\'` ke bina, `regexp_replace` sirf pehla `-` badalता hai.',
      },
      {
        task: 'Table `contact(phone text)` with `\'+1 (555) 010-1234\'`, `\'555.010.5678\'`, `\'5550109999\'`. Write one query returning `phone` and a `digits_only` column that strips every non-digit. Confirm all three normalise to a 10- or 11-digit string. Note in a comment which flag makes the strip work.',
        taskHi: 'Table `contact(phone text)` `\'+1 (555) 010-1234\'` etc. ke saath. Ek query likho jo `phone` aur ek `digits_only` column return karti hai jo har non-digit strip karti hai.',
        hint: '`regexp_replace(phone, \'[^0-9]\', \'\', \'g\')`. The `[^0-9]` class matches any non-digit; `\'g\'` is what makes it replace ALL of them, not just the first.',
        hintHi: '`regexp_replace(phone, \'[^0-9]\', \'\', \'g\')`. `[^0-9]` class har non-digit match karta hai; `\'g\'` ise SAB replace karvaता hai.',
      },
    ],

    keyTakeaways: [
      '`LIKE`: `%` = any run of chars, `_` = exactly one char; everything else literal; implicitly anchored to the WHOLE string (so "contains" needs `\'%x%\'`). `ILIKE` = case-insensitive (PostgreSQL; portable = `lower(col) LIKE lower(pat)`). Escape a literal `%`/`_` with `\\` (or `ESCAPE \'!\'`).',
      '`SIMILAR TO` (LIKE + some regex ops) — nobody uses it; if `LIKE` isn\'t enough, go straight to POSIX regex.',
      'REGEX operators: `~` (match, case-sensitive), `~*` (case-insensitive), `!~`, `!~*`. Unlike `LIKE`, a regex matches ANY substring by default — anchor with `^` ... `$` for a whole-string match.',
      'Regex syntax: `.` `[...]` `[^...]` `[[:digit:]]`/`[[:alpha:]]` (or `\\d`/`\\w`/`\\s` — but `\\` may need doubling in a host-language string), `* + ? {n} {n,m}` (greedy; `?` after = lazy), `a|b`, `(...)` capture, `(?:...)` no-capture, `\\b`, `\\1` backref.',
      'FUNCTIONS: `regexp_match(s, pat)` -> `text[]` of capture groups of the FIRST match (element 1 = whole match if no groups), `NULL` if none — extract via `(regexp_match(...))[1]`. `regexp_matches(s, pat, \'g\')` -> a SET (row per match). `regexp_replace(s, pat, repl [, flags])` -> FIRST match only unless `\'g\'`; `\\1` in `repl` = group 1. `regexp_split_to_array` / `regexp_split_to_table`.',
      'THE #1 regex bug: `regexp_replace` without `\'g\'` replaces only the FIRST match — a "strip all X" that removes exactly one X and looks almost right.',
      'INDEX CAVEAT: a B-tree index on text stores sorted values -> `LIKE \'prefix%\'` (fixed prefix) CAN use it. `LIKE \'%infix%\'`, `ILIKE`, `\'%suffix\'` have no fixed prefix -> plain B-tree is useless -> FULL SCAN.',
      'For fast infix/fuzzy search at scale: `pg_trgm` trigram GIN/GiST index (`gin_trgm_ops`) makes `LIKE \'%x%\'`/`ILIKE`/similarity index-backed; or full-text search (`tsvector` + GIN) for word search; or a functional index on `lower(col)` for case-insensitive prefix/exact. (Module 11.)',
    ],
    keyTakeawaysHi: [
      '`LIKE`: `%` = chars ka koi bhi run, `_` = theek ek char; baaki sab literal; implicitly POORI string se anchored (to "contains" ke liye `\'%x%\'` chahiye). `ILIKE` = case-insensitive. Ek literal `%`/`_` ko `\\` se escape karo.',
      '`SIMILAR TO` — koi ise istemal nahi karta; agar `LIKE` kaafi nahi, seedhे POSIX regex par jaao.',
      'REGEX operators: `~` (match, case-sensitive), `~*` (case-insensitive), `!~`, `!~*`. `LIKE` ke ulta, ek regex default se KOI bhi substring match karta hai — `^` ... `$` se anchor karo.',
      'Regex syntax: `.` `[...]` `[[:digit:]]` (ya `\\d`/`\\w` — par `\\` ko ek host-language string mein double karna pad sakta hai), `* + ? {n} {n,m}` (greedy; `?` ke baad = lazy), `a|b`, `(...)` capture, `(?:...)` no-capture.',
      'FUNCTIONS: `regexp_match(s, pat)` -> PEHLE match ke capture groups ka `text[]`, `NULL` agar koi nahi — `(regexp_match(...))[1]` se extract karo. `regexp_replace(s, pat, repl [, flags])` -> sirf PEHLA match jab tak `\'g\'` nahi. `regexp_split_to_array` / `regexp_split_to_table`.',
      '#1 regex bug: `\'g\'` ke bina `regexp_replace` sirf PEHLA match replace karta hai.',
      'INDEX CAVEAT: text par ek B-tree index sorted values store karta hai -> `LIKE \'prefix%\'` ISE istemal kar sakta hai. `LIKE \'%infix%\'`, `ILIKE` ka koi fixed prefix nahi -> plain B-tree bekaar -> FULL SCAN.',
      'Scale par fast infix/fuzzy search ke liye: `pg_trgm` trigram GIN index; ya full-text search; ya `lower(col)` par ek functional index. (Module 11.)',
    ],
  },

  {
    slug: 'sql-case-coalesce-and-conditionals',
    title: '`CASE`, `COALESCE` & Conditional Expressions',
    titleHi: '`CASE`, `COALESCE` Aur Conditional Expressions',
    description: '`CASE WHEN ... THEN ... ELSE ... END` is SQL\'s if/else — an *expression*, so it works in `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, and inside aggregates. `COALESCE`, `NULLIF`, `GREATEST`, `LEAST` are its specialised cousins. Conditional aggregation (`count(*) FILTER (WHERE ...)`) counts several things in one pass.',
    descriptionHi: '`CASE WHEN ... THEN ... ELSE ... END` SQL ka if/else hai — ek *expression*, to ye `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, aur aggregates ke andar kaam karta hai. `COALESCE`, `NULLIF`, `GREATEST`, `LEAST` iske specialised cousins hain. Conditional aggregation (`count(*) FILTER (WHERE ...)`) ek pass mein kई cheezein count karti hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A sorting clerk with a rulebook, working the same conveyor belt for every task.** Each item comes past once; the clerk reads the rulebook top to bottom — "if it is fragile, red bin; else if it is over 5kg, floor pallet; else, shelf" — and the *first* rule that fires decides where it goes. That rulebook is a `CASE` expression, and "first match wins, `ELSE` is the fallback" is exactly how it evaluates. Because the clerk produces one label per item, you can use that label anywhere a label is expected: to decide the bin (a computed column), to pull only certain items off the belt (`WHERE`), to stack the output in a custom order (`ORDER BY`), or to keep running tallies — "how many went to the red bin, how many to the pallet" — without a second pass over the belt (that is `count(*) FILTER (WHERE ...)`). `COALESCE` is a tiny fixed rulebook that only asks "is this blank? then try the next one"; `GREATEST` and `LEAST` are "hand me the biggest / smallest of these"; `NULLIF` is "if these two match, treat it as blank".',
      hi: '**Ek sorting clerk ek rulebook ke saath, har task ke liye wahi conveyor belt chala raha hai.** Har item ek baar past aata hai; clerk rulebook ko top se bottom padhता hai — "agar fragile hai, red bin; nahi to agar 5kg se upar, floor pallet; nahi to, shelf" — aur *pehla* rule jo fire hota hai tय karta hai ye kahaan jaता hai. Wo rulebook ek `CASE` expression hai, aur "first match wins, `ELSE` fallback hai" theek aise ye evaluate hota hai. Kyunki clerk prati item ek label produce karta hai, aap us label ko kahin bhi istemal kar sakte ho jahaan ek label expected hai: bin tय karne ke liye (ek computed column), sirf kuch items belt se nikalne ke liye (`WHERE`), custom order mein output stack karne ke liye (`ORDER BY`), ya running tallies rakhne ke liye — "kitne red bin mein gaye" — belt par ek doosre pass ke bina (wo `count(*) FILTER (WHERE ...)` hai). `COALESCE` ek chhota fixed rulebook hai jo sirf poochta hai "kya ye blank hai? phir agla try karo".',
    },

    simple: `**\`CASE\` — searched form (the common one)**

\`\`\`sql
SELECT
  amount,
  CASE
    WHEN amount IS NULL THEN 'unknown'
    WHEN amount < 10    THEN 'small'
    WHEN amount < 100   THEN 'medium'
    ELSE                    'large'          -- ELSE is optional; without it, no match -> NULL
  END AS bucket
FROM payment;
\`\`\`

**\`CASE\` — simple form (equality against one expression)**

\`\`\`sql
CASE status
  WHEN 'A' THEN 'active'
  WHEN 'I' THEN 'inactive'
  ELSE 'unknown'
END
-- shorthand for: CASE WHEN status = 'A' THEN ... ; note it uses = so it does NOT match NULL
\`\`\`

**\`CASE\` is an expression — use it anywhere**

\`\`\`sql
ORDER BY CASE WHEN priority = 'urgent' THEN 0 ELSE 1 END, created_at   -- custom sort
WHERE CASE WHEN role = 'admin' THEN true ELSE is_public END            -- conditional filter
GROUP BY CASE WHEN age < 18 THEN 'minor' ELSE 'adult' END             -- derived grouping key
SELECT sum(CASE WHEN status = 'paid' THEN amount ELSE 0 END)           -- conditional sum
\`\`\`

**The \`NULL\` helpers**

\`\`\`sql
COALESCE(a, b, c, 0)      -- first non-NULL argument, left to right (a "fallback chain")
NULLIF(x, 0)              -- NULL if x = 0, else x  (turn a sentinel into a real NULL)
GREATEST(a, b, c)        -- largest of the arguments   } PostgreSQL: these IGNORE NULL args
LEAST(a, b, c)           -- smallest of the arguments  } (MySQL/others return NULL -- wrap in COALESCE)
\`\`\`

**Conditional aggregation — count/sum several things in ONE query**

\`\`\`sql
SELECT
  count(*)                                    AS total,
  count(*) FILTER (WHERE status = 'paid')      AS paid,        -- SQL-standard, PostgreSQL
  count(*) FILTER (WHERE status = 'refunded')  AS refunded,
  sum(amount) FILTER (WHERE status = 'paid')   AS revenue,
  count(*) FILTER (WHERE created_at >= now() - interval '7 days') AS this_week
FROM payment;
-- the portable form of FILTER:  count(CASE WHEN status = 'paid' THEN 1 END)
\`\`\`

**\`CASE\` returns ONE type**

\`\`\`sql
CASE WHEN x THEN 1 ELSE 'n/a' END        -- ERROR: integer and text are not compatible
CASE WHEN x THEN 1 ELSE NULL END         -- fine (NULL adapts)
CASE WHEN x THEN 1.0 ELSE 2 END          -- fine -> numeric (both branches widen to numeric)
\`\`\``,

    simpleHi: `**\`CASE\` — searched form (aam waala)**

\`\`\`sql
SELECT
  amount,
  CASE
    WHEN amount IS NULL THEN 'unknown'
    WHEN amount < 10    THEN 'small'
    WHEN amount < 100   THEN 'medium'
    ELSE                    'large'          -- ELSE optional; iske bina, no match -> NULL
  END AS bucket
FROM payment;
\`\`\`

**\`CASE\` — simple form (ek expression ke against equality)**

\`\`\`sql
CASE status
  WHEN 'A' THEN 'active'
  WHEN 'I' THEN 'inactive'
  ELSE 'unknown'
END
-- iska shorthand: CASE WHEN status = 'A' THEN ... ; ye = istemal karta hai to NULL match NAHI karta
\`\`\`

**\`CASE\` ek expression hai — ise kahin bhi istemal karo**

\`\`\`sql
ORDER BY CASE WHEN priority = 'urgent' THEN 0 ELSE 1 END, created_at   -- custom sort
WHERE CASE WHEN role = 'admin' THEN true ELSE is_public END            -- conditional filter
GROUP BY CASE WHEN age < 18 THEN 'minor' ELSE 'adult' END             -- derived grouping key
SELECT sum(CASE WHEN status = 'paid' THEN amount ELSE 0 END)           -- conditional sum
\`\`\`

**\`NULL\` helpers**

\`\`\`sql
COALESCE(a, b, c, 0)      -- pehla non-NULL argument, left to right
NULLIF(x, 0)              -- NULL agar x = 0, warna x
GREATEST(a, b, c)        -- arguments mein sabse bada   } PostgreSQL: ye NULL args IGNORE karte hain
LEAST(a, b, c)           -- arguments mein sabse chhota } (MySQL/doosre NULL return karte hain)
\`\`\`

**Conditional aggregation — EK query mein kई cheezein count/sum karo**

\`\`\`sql
SELECT
  count(*)                                    AS total,
  count(*) FILTER (WHERE status = 'paid')      AS paid,
  sum(amount) FILTER (WHERE status = 'paid')   AS revenue
FROM payment;
-- FILTER ka portable form:  count(CASE WHEN status = 'paid' THEN 1 END)
\`\`\`

**\`CASE\` EK type return karta hai**

\`\`\`sql
CASE WHEN x THEN 1 ELSE 'n/a' END        -- ERROR: integer aur text compatible nahi
CASE WHEN x THEN 1 ELSE NULL END         -- theek
CASE WHEN x THEN 1.0 ELSE 2 END          -- theek -> numeric
\`\`\``,

    content: `## \`CASE\` — the conditional expression

\`CASE\` is SQL's \`if/else\`. It comes in two forms:

**Searched \`CASE\`** — a list of independent conditions:

\`\`\`sql
CASE
  WHEN condition_1 THEN result_1
  WHEN condition_2 THEN result_2
  ...
  ELSE default_result       -- optional
END
\`\`\`

The conditions are tested **top to bottom**, and the **first one that is \`TRUE\`** supplies the result. If none is \`TRUE\` (including if they are all \`FALSE\` or \`UNKNOWN\`) and there is no \`ELSE\`, the result is \`NULL\`. Order matters: put the most specific conditions first.

**Simple \`CASE\`** — equality against one expression:

\`\`\`sql
CASE expr
  WHEN value_1 THEN result_1
  WHEN value_2 THEN result_2
  ELSE default_result
END
\`\`\`

This is shorthand for \`CASE WHEN expr = value_1 THEN ...\`. Because it uses \`=\`, it **cannot match \`NULL\`** — a \`NULL\` \`expr\` falls through to \`ELSE\`. If \`NULL\` is a case you care about, use the searched form with \`WHEN expr IS NULL\`.

## \`CASE\` is an expression, so it goes anywhere

Unlike a procedural \`if\`, \`CASE\` produces a value, so you can use it:

- **In \`SELECT\`** — a derived / labelled column, a computed value.
- **In \`WHERE\`** — \`WHERE CASE WHEN plan = 'enterprise' THEN true ELSE trial_active END\` (though often a plain boolean expression with \`AND\`/\`OR\` is clearer).
- **In \`ORDER BY\`** — a custom sort key: \`ORDER BY CASE status WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 ELSE 2 END\`.
- **In \`GROUP BY\`** — group by a derived bucket: \`GROUP BY CASE WHEN age < 18 THEN 'minor' WHEN age < 65 THEN 'adult' ELSE 'senior' END\`. (Then repeat the same \`CASE\` in \`SELECT\`, or in PostgreSQL you can \`GROUP BY\` the select-list alias.)
- **Inside an aggregate** — \`sum(CASE WHEN refunded THEN -amount ELSE amount END)\`, \`avg(CASE WHEN score > 0 THEN score END)\` (\`NULL\` for the else means \`avg\` skips those rows).

## The specialised conditionals

These are all shorthand for a \`CASE\` you would otherwise write out:

- **\`COALESCE(a, b, c, ...)\`** — returns the first argument that is not \`NULL\`, evaluating left to right and **short-circuiting** (later arguments are not evaluated once one is non-\`NULL\`). The idiomatic default / fallback chain: \`COALESCE(preferred_name, first_name, 'there')\`, \`COALESCE(sum(x), 0)\`, \`price - COALESCE(discount, 0)\`.
- **\`NULLIF(a, b)\`** — returns \`NULL\` if \`a = b\`, otherwise \`a\`. Two uses: turn a sentinel back into \`NULL\` (\`NULLIF(rating, 0)\`, \`NULLIF(trim(note), '')\`), and guard division (\`x / NULLIF(y, 0)\`).
- **\`GREATEST(a, b, c, ...)\` / \`LEAST(...)\`** — the largest / smallest of the arguments, evaluated **row-wise across the argument list** (not down a column — that is \`max\` / \`min\`). **In PostgreSQL these skip \`NULL\` arguments** and only return \`NULL\` if *every* argument is \`NULL\`. **Other databases (MySQL, SQLite) return \`NULL\` if any argument is \`NULL\`** — so for portable behaviour wrap each argument: \`GREATEST(COALESCE(a, 0), COALESCE(b, 0))\`.

## Conditional aggregation

To compute several conditional counts or sums in **one pass over the data**, you have two equivalent forms:

**\`FILTER (WHERE ...)\`** — SQL-standard, supported by PostgreSQL:

\`\`\`sql
SELECT
  count(*)                                       AS total_orders,
  count(*) FILTER (WHERE status = 'shipped')      AS shipped,
  count(*) FILTER (WHERE status = 'cancelled')    AS cancelled,
  sum(total) FILTER (WHERE status = 'shipped')    AS shipped_revenue,
  avg(total) FILTER (WHERE status = 'shipped')    AS shipped_aov
FROM orders;
\`\`\`

**\`aggregate(CASE WHEN ... THEN ... END)\`** — the portable form that works everywhere:

\`\`\`sql
count(CASE WHEN status = 'shipped' THEN 1 END)          -- CASE with no ELSE -> NULL for non-matches
                                                        -- and count() skips NULL
sum(CASE WHEN status = 'shipped' THEN total ELSE 0 END) -- for sum, an explicit ELSE 0 is fine too
\`\`\`

Both run in a single scan and a single \`GROUP BY\` if grouped — vastly better than one \`SELECT count(*) ... WHERE status = 'shipped'\` per metric. This is the standard way to build a dashboard row.

## \`CASE\` type resolution

Every \`THEN\` branch and the \`ELSE\` must resolve to **one common type**. \`CASE WHEN x THEN 1 ELSE 'no' END\` fails with \`CASE types integer and text cannot be matched\`. \`NULL\` adapts to whatever the other branches need. Numeric branches widen (\`integer\` + \`numeric\` → \`numeric\`). If you genuinely need different shapes, cast every branch to \`text\` (or \`jsonb\`) explicitly.`,

    contentHi: `## \`CASE\` — conditional expression

\`CASE\` SQL ka \`if/else\` hai. Do forms:

**Searched \`CASE\`** — independent conditions ki ek list. Conditions **top to bottom** test hoti hain, aur **pehli jo \`TRUE\` hai** result deti hai. Agar koi \`TRUE\` nahi (sab \`FALSE\` ya \`UNKNOWN\` hone samet) aur koi \`ELSE\` nahi, result \`NULL\` hai. Sabse specific conditions pehle rakho.

**Simple \`CASE\`** — ek expression ke against equality. Ye \`CASE WHEN expr = value_1 THEN ...\` ka shorthand hai. Kyunki ye \`=\` istemal karta hai, ye **\`NULL\` match nahi kar sakta** — ek \`NULL\` \`expr\` \`ELSE\` mein gir jaता hai.

## \`CASE\` ek expression hai, to ye kahin bhi jaता hai

- **\`SELECT\` mein** — ek derived / labelled column.
- **\`WHERE\` mein**.
- **\`ORDER BY\` mein** — ek custom sort key.
- **\`GROUP BY\` mein** — ek derived bucket se group karo.
- **Ek aggregate ke andar** — \`sum(CASE WHEN refunded THEN -amount ELSE amount END)\`.

## Specialised conditionals

- **\`COALESCE(a, b, c, ...)\`** — pehla argument jo \`NULL\` nahi hai, left to right, **short-circuiting**.
- **\`NULLIF(a, b)\`** — \`NULL\` agar \`a = b\`, warna \`a\`. Uses: ek sentinel ko \`NULL\` banana, division guard karna.
- **\`GREATEST(a, b, c, ...)\` / \`LEAST(...)\`** — arguments mein sabse bada / chhota, **row-wise** (column ke neeche nahi — wo \`max\` / \`min\`). **PostgreSQL mein ye \`NULL\` arguments skip karte hain**. **Doosre databases (MySQL, SQLite) \`NULL\` return karte hain agar koi argument \`NULL\` hai** — portable behaviour ke liye har argument wrap karo.

## Conditional aggregation

**Ek pass mein** kई conditional counts ya sums compute karne ke liye:

**\`FILTER (WHERE ...)\`** — SQL-standard, PostgreSQL:

\`\`\`sql
SELECT
  count(*)                                    AS total,
  count(*) FILTER (WHERE status = 'shipped')   AS shipped,
  sum(total) FILTER (WHERE status = 'shipped') AS shipped_revenue
FROM orders;
\`\`\`

**\`aggregate(CASE WHEN ...)\`** — portable form:

\`\`\`sql
count(CASE WHEN status = 'shipped' THEN 1 END)     -- CASE bina ELSE -> non-matches ke liye NULL, count() skip karta hai
\`\`\`

Dono ek single scan mein chalte hain — prati metric ek \`SELECT count(*) ... WHERE\` se bahut behtar. Ye ek dashboard row banane ka standard tareeka hai.

## \`CASE\` type resolution

Har \`THEN\` branch aur \`ELSE\` ko **ek common type** mein resolve hona chahiye. \`CASE WHEN x THEN 1 ELSE 'no' END\` fail hota hai. \`NULL\` adapt karta hai. Numeric branches widen hote hain. Agar aapको alag shapes chahिए, har branch ko \`text\` mein cast karo.`,

    examples: [
      {
        title: 'Searched CASE for a bucket; first matching WHEN wins',
        titleHi: 'Ek bucket ke liye searched CASE; pehla matching WHEN jeetta hai',
        code: `CREATE TABLE payment (id int, amount int);
INSERT INTO payment VALUES (1, 5), (2, 50), (3, 500), (4, NULL);

SELECT
  id, amount,
  CASE
    WHEN amount IS NULL THEN 'unknown'
    WHEN amount < 10    THEN 'small'
    WHEN amount < 100   THEN 'medium'
    ELSE                    'large'
  END AS bucket
FROM payment
ORDER BY id;`,
        output: ` id | amount | bucket
----+--------+---------
 1  | 5      | small
 2  | 50     | medium
 3  | 500    | large
 4  | NULL   | unknown
(4 rows)`,
        explain: "The searched `CASE` tests its `WHEN`s top to bottom and takes the first that is `TRUE`. `amount IS NULL` is checked first so the `NULL` row gets `'unknown'` before any numeric comparison is attempted (which would have been `UNKNOWN` anyway). 5 -> `'small'`, 50 -> `'medium'` (it fails `< 10` but passes `< 100`), 500 -> the `ELSE`.",
        explainHi: "Searched `CASE` apne `WHEN`s ko top to bottom test karता hai aur pehla jo `TRUE` hai leta hai. `amount IS NULL` pehle check hoता hai to `NULL` row ko kisi numeric comparison se pehle `'unknown'` milता hai. 5 -> `'small'`, 50 -> `'medium'`, 500 -> `ELSE`.",
      },
      {
        title: 'COALESCE fallback chain, NULLIF sentinel, GREATEST/LEAST ignore NULL (Postgres)',
        titleHi: 'COALESCE fallback chain, NULLIF sentinel, GREATEST/LEAST NULL ignore (Postgres)',
        code: `SELECT
  COALESCE(NULL, NULL, 'third', 'fourth')  AS chain,      -- 'third'
  NULLIF(0, 0)                             AS sentinel,   -- NULL (0 becomes "missing")
  NULLIF(7, 0)                             AS kept,       -- 7
  GREATEST(3, NULL, 9, 1)                  AS g,          -- 9  (Postgres skips the NULL)
  LEAST(3, NULL, 9, 1)                     AS l;          -- 1`,
        output: ` chain | sentinel | kept | g | l
-------+----------+------+---+---
 third | NULL     | 7    | 9 | 1
(1 row)`,
        explain: "`COALESCE` walks its arguments left to right and returns the first non-`NULL` one — the first two are `NULL`, so it returns `'third'`. `NULLIF(0, 0)` returns `NULL` because the arguments are equal (turning a `0` sentinel into a real missing value); `NULLIF(7, 0)` returns `7`. `GREATEST` and `LEAST` on PostgreSQL skip `NULL` arguments, so `GREATEST(3, NULL, 9, 1)` is `9` and `LEAST(...)` is `1` — on MySQL/SQLite the `NULL` would make both return `NULL`.",
        explainHi: "`COALESCE` apne arguments ko left to right walk karता hai aur pehla non-`NULL` return karता hai — pehle do `NULL` hain, to ye `'third'` return karता hai. `NULLIF(0, 0)` `NULL` return karता hai kyunki arguments barabar hain. PostgreSQL par `GREATEST`/`LEAST` `NULL` arguments skip karते hain, to `GREATEST(3, NULL, 9, 1)` `9` hai — MySQL/SQLite par `NULL` dono ko `NULL` bana deता.",
      },
      {
        title: 'Conditional aggregation: a whole dashboard row in one query',
        titleHi: 'Conditional aggregation: ek query mein ek poora dashboard row',
        code: `CREATE TABLE orders (id int, status text, total int);
INSERT INTO orders VALUES
  (1,'shipped',100), (2,'shipped',250), (3,'cancelled',80),
  (4,'pending',40),  (5,'shipped',300), (6,'refunded',120);

SELECT
  count(*)                                     AS total_orders,
  count(*) FILTER (WHERE status = 'shipped')     AS shipped,
  count(*) FILTER (WHERE status = 'cancelled')   AS cancelled,
  sum(total) FILTER (WHERE status = 'shipped')   AS shipped_revenue,
  round(avg(total) FILTER (WHERE status = 'shipped'), 2) AS shipped_aov
FROM orders;`,
        output: ` total_orders | shipped | cancelled | shipped_revenue | shipped_aov
--------------+---------+-----------+-----------------+-------------
 6            | 3       | 1         | 650             | 216.67
(1 row)`,
        explain: 'Each `count(*) FILTER (WHERE ...)` and `sum(...) FILTER (WHERE ...)` restricts that one aggregate to the matching rows, and they all compute in a SINGLE scan of `orders`: 6 rows total, 3 shipped, 1 cancelled, `sum(total)` over just the shipped rows is `650`, and `avg` over the shipped rows rounds to `216.67`. Replacing this with one `SELECT count(*) ... WHERE` per metric would be five scans and a possible inconsistency.',
        explainHi: 'Har `count(*) FILTER (WHERE ...)` aur `sum(...) FILTER (WHERE ...)` us ek aggregate ko matching rows tak restrict karता hai, aur wo sab `orders` ke EK scan mein compute hote hain: 6 rows total, 3 shipped, 1 cancelled, shipped rows par `sum(total)` `650`, aur shipped rows par `avg` `216.67` mein round hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT
  CASE
    WHEN score >= 50 THEN 'pass'
    WHEN score >= 90 THEN 'distinction'   -- UNREACHABLE: 90 already matched the first WHEN
    ELSE 'fail'
  END
FROM exam;
-- everyone with score >= 50 gets 'pass', nobody ever gets 'distinction'`,
        right: `SELECT
  CASE
    WHEN score >= 90 THEN 'distinction'   -- most specific / highest threshold first
    WHEN score >= 50 THEN 'pass'
    ELSE 'fail'
  END
FROM exam;`,
        why: 'Searched CASE evaluates WHEN clauses top to bottom and stops at the first that is TRUE. If you order thresholds from lowest to highest, the lowest one swallows every value above it and the later branches are dead code. A score of 95 satisfies score greater-or-equal 50, so it is labelled pass and the distinction branch is never reached. Order the conditions from most specific or highest threshold to least, so each row falls into the narrowest matching bucket. This is the single most common CASE bug.',
        whyHi: 'Searched CASE WHEN clauses ko top to bottom evaluate karta hai aur pehli jo TRUE hai us par ruk jaता hai. Agar aap thresholds ko lowest se highest order karte ho, lowest wala har value ko nigal leta hai jo iske upar hai aur baad ke branches dead code hain. 95 ka ek score score >= 50 satisfy karta hai, to ise pass label kiya jaता hai. Conditions ko most specific se least order karo.',
      },
      {
        wrong: `-- "count paid and unpaid orders"
SELECT count(*) AS paid FROM orders WHERE status = 'paid';
SELECT count(*) AS unpaid FROM orders WHERE status <> 'paid';
-- two queries, two full scans, and they can disagree if the table changes between them`,
        right: `SELECT
  count(*) FILTER (WHERE status = 'paid')  AS paid,
  count(*) FILTER (WHERE status <> 'paid' OR status IS NULL) AS unpaid
FROM orders;
-- one scan, one consistent snapshot, and NULL-status rows are handled explicitly`,
        why: 'Running a separate aggregate query per metric means N scans of the same table (or N index lookups), N round trips, and a consistency risk: if a row changes between the two queries the numbers will not add up. Conditional aggregation with FILTER (or the portable count of a CASE) computes every metric in a single pass over one consistent view of the data. It also forces you to think about the NULL-status rows once, in one place, rather than having them silently fall out of the "not paid" count.',
        whyHi: 'Prati metric ek alag aggregate query chalाना matlab usi table ke N scans, N round trips, aur ek consistency risk: agar do queries ke beech ek row badalती hai numbers add nahi honge. FILTER ke saath conditional aggregation har metric ko data ke ek consistent view par ek single pass mein compute karta hai. Ye aapko NULL-status rows ke baare mein ek jagah sochne par bhi majboor karta hai.',
      },
      {
        wrong: `SELECT id,
  CASE WHEN balance < 0 THEN balance ELSE 'ok' END AS status
FROM account;
-- ERROR: CASE types numeric and text cannot be matched`,
        right: `SELECT id,
  CASE WHEN balance < 0 THEN balance::text ELSE 'ok' END AS status
FROM account;
-- or return a consistent type: CASE WHEN balance < 0 THEN balance ELSE 0 END`,
        why: 'A CASE expression must have a single result type: every THEN branch and the ELSE have to resolve to one common type, the way a column does. Returning a numeric from one branch and a text literal from another is a type error, caught at planning time. Decide what the column is: if it is a label, cast the numeric branch to text; if it is a number, make the else branch a number too. Mixing "the value, or a message" in one column is usually a design smell anyway -- consider two columns, or a nullable numeric with the message derived in the application.',
        whyHi: 'Ek CASE expression ka ek single result type hona chahiye: har THEN branch aur ELSE ko ek common type mein resolve hona hoga, jaise ek column karta hai. Ek branch se numeric aur doosre se ek text literal return karna ek type error hai, planning time par pakda gaya. Decide karo column kya hai: agar ek label hai, numeric branch ko text mein cast karo; agar ek number hai, else branch ko bhi number banao.',
      },
    ],

    realWorld: [
      {
        en: '**Every admin dashboard endpoint is one `SELECT` with a dozen `count(*) FILTER (WHERE ...)` / `sum(...) FILTER (WHERE ...)` columns** — orders today, revenue this week, refund rate, new signups by plan — replacing what used to be fifteen separate count queries and one slow page.',
        hi: '**Har admin dashboard endpoint ek `SELECT` hai ek dozen `count(*) FILTER (WHERE ...)` columns ke saath** — jo pehle pandrah alag count queries tha.',
      },
      {
        en: '**`ORDER BY CASE WHEN status = \'urgent\' THEN 0 WHEN status = \'high\' THEN 1 ELSE 2 END, created_at`** to sort a ticket queue by a business priority that is not the column\'s natural (alphabetical) order.',
        hi: '**`ORDER BY CASE WHEN status = \'urgent\' THEN 0 ... END, created_at`** ek ticket queue ko ek business priority se sort karne ke liye jo column ka natural order nahi hai.',
      },
      {
        en: '**`GROUP BY CASE WHEN amount < 1000 THEN \'small\' WHEN amount < 10000 THEN \'mid\' ELSE \'large\' END`** for a deal-size distribution report, with the identical `CASE` repeated in the `SELECT` list.',
        hi: '**`GROUP BY CASE WHEN amount < 1000 THEN \'small\' ... END`** ek deal-size distribution report ke liye, wahi `CASE` `SELECT` list mein repeat.',
      },
    ],

    interviewQA: [
      {
        q: 'How does a searched `CASE` evaluate, and what is the most common bug with it?',
        qHi: 'Ek searched `CASE` kaise evaluate hota hai, aur iske saath sabse aam bug kya hai?',
        a: 'A searched CASE is a list of WHEN condition THEN result pairs, optionally ending in ELSE. It is evaluated top to bottom, and the first WHEN whose condition is TRUE supplies the whole expression its value; evaluation then stops, so later branches are not even considered. If no condition is TRUE, meaning they are all FALSE or UNKNOWN, and there is no ELSE, the result is NULL. Because it is an expression that yields a single value, you can put it in SELECT, WHERE, ORDER BY, GROUP BY, and inside an aggregate. The most common bug is ordering the conditions wrong when they overlap. If you bucket a numeric score with WHEN score at least 50 THEN pass before WHEN score at least 90 THEN distinction, then a score of 95 matches the first branch and is labelled pass, and the distinction branch is unreachable dead code. The fix is to order overlapping conditions from most specific or highest threshold to least, so every value lands in the narrowest matching bucket. A related subtlety is the simple CASE form, CASE expr WHEN value, which compiles to equality and therefore never matches a NULL expr -- if NULL is a case you care about you must use the searched form with WHEN expr IS NULL.',
        aHi: 'Ek searched CASE WHEN condition THEN result pairs ki ek list hai, optionally ELSE mein khatam. Ye top to bottom evaluate hota hai, aur pehla WHEN jiski condition TRUE hai poore expression ko iski value deta hai; evaluation phir ruk jaता hai, to baad ke branches consider bhi nahi hote. Agar koi condition TRUE nahi aur koi ELSE nahi, result NULL hai. Kyunki ye ek expression hai jo ek single value deta hai, aap ise SELECT, WHERE, ORDER BY, GROUP BY, aur ek aggregate ke andar daal sakte ho. Sabse aam bug conditions ko galat order karna hai jab wo overlap karti hain. Agar aap ek numeric score ko WHEN score at least 50 THEN pass ke saath WHEN score at least 90 THEN distinction se pehle bucket karte ho, to 95 ka ek score pehla branch match karta hai. Fix overlapping conditions ko most specific se least order karna hai.',
      },
      {
        q: 'What is conditional aggregation and why is `count(*) FILTER (WHERE ...)` better than several separate count queries?',
        qHi: 'Conditional aggregation kya hai aur `count(*) FILTER (WHERE ...)` kई alag count queries se behtar kyun hai?',
        a: 'Conditional aggregation is computing several aggregates, each restricted to a subset of rows, in a single query. In PostgreSQL you write it with the FILTER clause: count star FILTER WHERE status equals shipped, sum of total FILTER WHERE status equals shipped, and so on, alongside a plain count star for the grand total. The portable equivalent that works in any SQL database is to put a CASE inside the aggregate: count of CASE WHEN status equals shipped THEN 1 END, relying on the fact that a CASE with no ELSE yields NULL for non-matching rows and count ignores NULL. Either way, every metric is computed in one pass over the table, sharing one scan and, if grouped, one GROUP BY. The alternative, one SELECT count star WHERE per metric, does N scans or N index lookups and N round trips, and the results can be mutually inconsistent if the data changes between queries -- your paid plus unpaid might not equal your total. Conditional aggregation is the standard way to build a dashboard summary row, and it forces you to handle edge cases like NULL status once, in one place.',
        aHi: 'Conditional aggregation ek single query mein kई aggregates compute karna hai, har ek rows ke ek subset tak restricted. PostgreSQL mein aap ise FILTER clause se likhते ho: count star FILTER WHERE status equals shipped, sum of total FILTER WHERE status equals shipped, aur aage. Portable equivalent jo kisi bhi SQL database mein kaam karta hai aggregate ke andar ek CASE daalना hai: count of CASE WHEN status equals shipped THEN 1 END, is baat par bharosa karके ki bina ELSE ka ek CASE non-matching rows ke liye NULL deta hai aur count NULL ignore karta hai. Kisi bhi tarah, har metric table par ek pass mein compute hota hai. Vikalp, prati metric ek SELECT count star WHERE, N scans karta hai aur results mutually inconsistent ho sakte hain agar data queries ke beech badalता hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `grade(name text, pct int)` with a mix from 30 to 100. Write a `SELECT` adding a `letter` column: 90+ = `\'A\'`, 80-89 = `\'B\'`, 70-79 = `\'C\'`, 60-69 = `\'D\'`, below 60 = `\'F\'`, and `NULL` pct = `\'incomplete\'`. Deliberately try the WHENs in ascending order first and observe everyone gets `\'D\'` or `\'incomplete\'`; then fix the order.',
        taskHi: 'Table `grade(name text, pct int)`. Ek `SELECT` likho jo ek `letter` column jodta hai: 90+ = `\'A\'`, 80-89 = `\'B\'`, ..., 60 se neeche = `\'F\'`, `NULL` = `\'incomplete\'`. Pehle WHENs ko ascending order mein try karo, phir order fix karo.',
        hint: 'Put `WHEN pct IS NULL` first, then the thresholds from highest (`pct >= 90`) to lowest. Ascending order means `pct >= 60` catches almost everyone.',
        hintHi: '`WHEN pct IS NULL` pehle, phir thresholds highest (`pct >= 90`) se lowest tak. Ascending order matlab `pct >= 60` lगbhag sabko pakadta hai.',
      },
      {
        task: 'Table `ticket(id int, priority text, resolved boolean)` with priorities `urgent`/`high`/`normal`/`low` and some `NULL` priorities. In ONE query, return: total count, count of unresolved, count of unresolved-and-urgent, and the count of `NULL`-priority tickets — all with `count(*) FILTER (WHERE ...)`.',
        taskHi: 'Table `ticket(id int, priority text, resolved boolean)`. EK query mein return karo: total count, unresolved count, unresolved-and-urgent count, aur `NULL`-priority tickets ka count — sab `count(*) FILTER (WHERE ...)` ke saath.',
        hint: '`count(*)`, `count(*) FILTER (WHERE resolved IS NOT TRUE)`, `count(*) FILTER (WHERE resolved IS NOT TRUE AND priority = \'urgent\')`, `count(*) FILTER (WHERE priority IS NULL)`.',
        hintHi: '`count(*)`, `count(*) FILTER (WHERE resolved IS NOT TRUE)`, `count(*) FILTER (WHERE resolved IS NOT TRUE AND priority = \'urgent\')`, `count(*) FILTER (WHERE priority IS NULL)`.',
      },
      {
        task: 'Table `reading(sensor text, celsius numeric, fahrenheit numeric)` where exactly one of `celsius` / `fahrenheit` is filled per row. Add a `celsius_final` column = the Celsius value, computed as `COALESCE(celsius, (fahrenheit - 32) / 1.8)`. Then add `hottest` = `GREATEST(celsius_final, 0)` and confirm a `NULL` in one input still gives a number.',
        taskHi: 'Table `reading(sensor text, celsius numeric, fahrenheit numeric)` jahaan prati row theek ek filled hai. Ek `celsius_final` column jodo = `COALESCE(celsius, (fahrenheit - 32) / 1.8)`. Phir `GREATEST(celsius_final, 0)`.',
        hint: '`COALESCE` picks whichever of the two paths is non-NULL. `GREATEST` on PostgreSQL skips a NULL argument, so `GREATEST(x, 0)` is `0` when `x` is NULL — for other DBs wrap `x` in `COALESCE(x, 0)`.',
        hintHi: '`COALESCE` do paths mein se jo non-NULL hai use chunta hai. `GREATEST` PostgreSQL par ek NULL argument skip karta hai.',
      },
    ],

    keyTakeaways: [
      'SEARCHED `CASE WHEN cond THEN res [WHEN ...] [ELSE res] END` — conditions tested TOP TO BOTTOM, FIRST `TRUE` wins, evaluation stops. No match + no `ELSE` -> `NULL`. #1 BUG: overlapping thresholds in the wrong order (`WHEN pct>=50` before `WHEN pct>=90` -> distinction unreachable). Order most-specific / highest-threshold first.',
      'SIMPLE `CASE expr WHEN v THEN res ... END` = shorthand for `CASE WHEN expr = v ...` -> uses `=` -> NEVER matches a `NULL` `expr` (falls to `ELSE`). For a `NULL` case use the searched form with `WHEN expr IS NULL`.',
      '`CASE` is an EXPRESSION (one value) -> use it in `SELECT`, `WHERE`, `ORDER BY` (custom sort key), `GROUP BY` (derived bucket — repeat the `CASE` in `SELECT` or `GROUP BY` the alias in PostgreSQL), and INSIDE aggregates (`sum(CASE WHEN refunded THEN -amount ELSE amount END)`).',
      '`COALESCE(a, b, c, ...)` = first NON-`NULL` arg, left-to-right, SHORT-CIRCUITS. `NULLIF(a, b)` = `NULL` if `a = b` else `a` (sentinel -> real `NULL`; division guard `x / NULLIF(y, 0)`).',
      '`GREATEST(a, b, ...)` / `LEAST(...)` = largest / smallest ACROSS the argument list (row-wise; NOT `max`/`min` which go down a column). PostgreSQL SKIPS `NULL` args (only `NULL` if ALL args are); MySQL/SQLite return `NULL` if ANY arg is -> for portability wrap each: `GREATEST(COALESCE(a,0), COALESCE(b,0))`.',
      'CONDITIONAL AGGREGATION — several conditional counts/sums in ONE pass: `count(*) FILTER (WHERE cond)` / `sum(x) FILTER (WHERE cond)` (SQL-standard, PostgreSQL). Portable form: `count(CASE WHEN cond THEN 1 END)` (no `ELSE` -> `NULL` -> `count` skips it) / `sum(CASE WHEN cond THEN x ELSE 0 END)`.',
      'FILTER beats N separate `SELECT count(*) ... WHERE` queries: 1 scan not N, 1 consistent snapshot (separate queries can disagree if data changes between them), and you handle edge cases like `NULL` status once. This is THE way to build a dashboard summary row.',
      '`CASE` resolves to ONE common type across all `THEN`/`ELSE` branches (`1` and `\'no\'` -> type error). `NULL` adapts; numerics widen (`int` + `numeric` -> `numeric`). For genuinely different shapes cast every branch to `text`.',
    ],
    keyTakeawaysHi: [
      'SEARCHED `CASE WHEN cond THEN res [ELSE res] END` — conditions TOP TO BOTTOM test, PEHLA `TRUE` jeetta hai. No match + no `ELSE` -> `NULL`. #1 BUG: galat order mein overlapping thresholds. Most-specific / highest-threshold pehle order karo.',
      'SIMPLE `CASE expr WHEN v THEN ...` = `CASE WHEN expr = v ...` ka shorthand -> `=` istemal karta hai -> KABHI ek `NULL` `expr` match nahi karta. `NULL` case ke liye searched form `WHEN expr IS NULL` ke saath.',
      '`CASE` ek EXPRESSION hai -> `SELECT`, `WHERE`, `ORDER BY` (custom sort key), `GROUP BY` (derived bucket), aur aggregates ke ANDAR istemal karo.',
      '`COALESCE(a, b, c, ...)` = pehla NON-`NULL` arg, left-to-right, SHORT-CIRCUITS. `NULLIF(a, b)` = `NULL` agar `a = b` warna `a`.',
      '`GREATEST(a, b, ...)` / `LEAST(...)` = argument list ke PAAR sabse bada / chhota (row-wise; `max`/`min` NAHI). PostgreSQL `NULL` args SKIP karta hai; MySQL/SQLite `NULL` return karte hain agar KOI arg `NULL` hai -> portability ke liye har ek wrap karo.',
      'CONDITIONAL AGGREGATION — EK pass mein kई conditional counts/sums: `count(*) FILTER (WHERE cond)` (SQL-standard). Portable: `count(CASE WHEN cond THEN 1 END)`.',
      'FILTER N alag `SELECT count(*) ... WHERE` queries se behtar: 1 scan N nahi, 1 consistent snapshot. Ye dashboard summary row banane KA tareeka hai.',
      '`CASE` sabhi `THEN`/`ELSE` branches ke paar EK common type mein resolve hota hai (`1` aur `\'no\'` -> type error). `NULL` adapt karta hai; numerics widen hote hain.',
    ],
  },
];

