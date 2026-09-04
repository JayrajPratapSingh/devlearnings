/**
 * Databases Complete Course — Module 2: Filtering, Expressions & Functions, lessons 4-6.
 *
 * Lesson 4: string functions — length / char_length / octet_length, upper / lower / initcap,
 *           trim family, substring / left / right, position / strpos, replace / translate /
 *           overlay, split_part / string_to_array, concat / concat_ws / || (NULL recap),
 *           format(), lpad / rpad / repeat, starts_with, to_char for numbers, citext.
 * Lesson 5: numbers & math — integer types and overflow, numeric(p,s) exact vs float
 *           inexact (0.1 + 0.2), round / round(x,n) and numeric-vs-float half-rounding,
 *           trunc / ceil / floor, abs / sign / mod / div, power / sqrt / exp / ln / log,
 *           division by zero + x / NULLIF(y,0), casts, random / gen_random_uuid,
 *           aggregate result types, generate_series, width_bucket.
 * Lesson 6: dates, times & intervals — date / time / timestamp / timestamptz and WHY
 *           timestamptz always; interval; now / statement_timestamp / clock_timestamp;
 *           date/interval arithmetic and month-end clamping; age() vs subtraction;
 *           date_trunc; extract / date_part; to_char / to_timestamp / to_date;
 *           AT TIME ZONE (both directions); make_date / make_timestamptz; generate_series
 *           over timestamps; EXTRACT(epoch ...); the half-open range recap.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 2
 * Every date/time example STARTS with `SET TIME ZONE 'UTC';` and casts timestamp/date
 * outputs `::text` (the harness renders a JS Date as an ISO-Z string otherwise).
 * `division by zero` / overflow examples render as `[ERROR] <message>` in `output`.
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'sql-string-functions',
    title: 'String Functions: Trim, Split, Pad, Format, Case-Fold',
    titleHi: 'String Functions: Trim, Split, Pad, Format, Case-Fold',
    description: 'The everyday string toolkit: `length` / `upper` / `lower` / `initcap`, the `trim` family, `substring` / `left` / `right`, `split_part` and `string_to_array`, `concat` / `concat_ws` (NULL-safe, unlike `||`), `format` for building strings safely, `lpad` / `rpad`, and case-insensitive matching.',
    descriptionHi: 'Rozana string toolkit: `length` / `upper` / `lower` / `initcap`, `trim` family, `substring` / `left` / `right`, `split_part` aur `string_to_array`, `concat` / `concat_ws` (NULL-safe, `||` ke ulta), safely strings banane ke liye `format`, `lpad` / `rpad`, aur case-insensitive matching.',
    difficulty: 'EASY',
    duration: 20,
    order: 4,

    analogy: {
      en: '**A stationery drawer for working with printed labels.** There is a guillotine that cuts a label to a fixed width from the left (`left`), one that cuts from the right (`right`), and one that snips out a piece from a marked position (`substring`). A trimmer shaves whitespace off the edges (`trim`). A stamp set converts a label to all-caps or all-lowercase or Title Case (`upper` / `lower` / `initcap`). A slotting jig cuts a comma-separated strip into its individual tags (`string_to_array`, `split_part`). A label maker joins fields with a chosen separator and, unlike sticky-taping strips end to end, does not ruin the whole label if one field is blank (`concat_ws` versus `||`). And a form-filler pads a number out to a fixed number of digits with leading zeros so every code lines up (`lpad`). The rule that trips people up: the *joining* tools behave differently around a blank field — tape (`||`) makes the whole thing blank, the label maker (`concat`) just skips it.',
      hi: '**Printed labels ke saath kaam karne ke liye ek stationery drawer.** Ek guillotine hai jo ek label ko left se ek fixed width tak kaatता hai (`left`), ek jo right se kaatता hai (`right`), aur ek jo ek marked position se ek piece nikालता hai (`substring`). Ek trimmer edges se whitespace shave karta hai (`trim`). Ek stamp set ek label ko all-caps ya all-lowercase ya Title Case mein badalता hai (`upper` / `lower` / `initcap`). Ek slotting jig ek comma-separated strip ko iske individual tags mein kaatता hai (`string_to_array`, `split_part`). Ek label maker fields ko ek chosen separator ke saath jodता hai aur, strips ko end to end sticky-tape karne ke ulta, agar ek field blank hai to poore label ko barbaad nahi karta (`concat_ws` versus `||`). Aur ek form-filler ek number ko leading zeros ke saath ek fixed number of digits tak pad karta hai (`lpad`).',
    },

    simple: `**Length, case**

\`\`\`sql
length('café')          -- 4    (characters, not bytes; octet_length('café') = 5)
upper('abc')            -- 'ABC'
lower('ABC')            -- 'abc'
initcap('hello world')  -- 'Hello World'   (capitalise each word)
\`\`\`

**Trim whitespace (or any chars)**

\`\`\`sql
trim('  x  ')                 -- 'x'          (both ends, spaces)
ltrim('  x  ')  / rtrim(...)  -- one side
trim(BOTH '0' FROM '007x00')  -- '7x'         (trim a specific character)
btrim('xxabcxx', 'x')         -- 'abc'
\`\`\`

**Slice**

\`\`\`sql
substring('abcdef' FROM 2 FOR 3)  -- 'bcd'    (1-based start, length)
substr('abcdef', 2, 3)            -- 'bcd'    (function-call form)
left('abcdef', 2)                 -- 'ab'     (negative = all but last N: left('abcdef', -2) = 'abcd')
right('abcdef', 2)                -- 'ef'
position('cd' IN 'abcdef')        -- 3        (1-based; 0 if not found)
\`\`\`

**Replace / split / join**

\`\`\`sql
replace('a-b-c', '-', '_')        -- 'a_b_c'   (ALL occurrences, plain text -- not regex)
translate('a.b,c', '.,', '--')    -- 'a-b-c'   (char-by-char mapping)
split_part('a.b.c', '.', 2)       -- 'b'       (nth piece, 1-based)
string_to_array('a,b,c', ',')     -- {a,b,c}   (-> a text[])
array_to_string(ARRAY['a','b'], '-')  -- 'a-b'

'x' || NULL || 'y'                -- NULL      (|| poisons on any NULL)
concat('x', NULL, 'y')            -- 'xy'      (concat SKIPS NULL)
concat_ws('-', 'a', NULL, 'c')    -- 'a-c'     (join with separator, skip NULL)
\`\`\`

**Build strings safely with \`format\`**

\`\`\`sql
format('Hello %s, you have %s messages', name, n)   -- %s = value as text
format('SELECT * FROM %I WHERE id = %L', tbl, id)  -- %I = safe identifier, %L = safe literal
-- %I / %L are the correct way to build dynamic SQL in PL/pgSQL, not string concatenation
\`\`\`

**Pad / repeat / test**

\`\`\`sql
lpad('7', 4, '0')        -- '0007'
rpad('7', 4, '0')        -- '7000'
repeat('ab', 3)          -- 'ababab'
starts_with('foobar', 'foo')   -- true
'foobar' LIKE 'foo%'           -- true (same idea)
\`\`\`

**Case-insensitive matching**

\`\`\`sql
WHERE lower(email) = lower(:input)           -- portable; add an index on lower(email)
WHERE email ILIKE :input                     -- PostgreSQL
-- or use the citext type for a column that compares case-insensitively by default
\`\`\``,

    simpleHi: `**Length, case**

\`\`\`sql
length('café')          -- 4    (characters, bytes nahi; octet_length('café') = 5)
upper('abc')            -- 'ABC'
initcap('hello world')  -- 'Hello World'
\`\`\`

**Trim whitespace (ya koi chars)**

\`\`\`sql
trim('  x  ')                 -- 'x'
trim(BOTH '0' FROM '007x00')  -- '7x'
btrim('xxabcxx', 'x')         -- 'abc'
\`\`\`

**Slice**

\`\`\`sql
substring('abcdef' FROM 2 FOR 3)  -- 'bcd'    (1-based start, length)
left('abcdef', 2)                 -- 'ab'
right('abcdef', 2)                -- 'ef'
position('cd' IN 'abcdef')        -- 3        (1-based; 0 agar nahi mila)
\`\`\`

**Replace / split / join**

\`\`\`sql
replace('a-b-c', '-', '_')        -- 'a_b_c'   (SABHI occurrences, plain text)
split_part('a.b.c', '.', 2)       -- 'b'       (nth piece, 1-based)
string_to_array('a,b,c', ',')     -- {a,b,c}

'x' || NULL || 'y'                -- NULL
concat('x', NULL, 'y')            -- 'xy'      (concat NULL SKIP karta hai)
concat_ws('-', 'a', NULL, 'c')    -- 'a-c'
\`\`\`

**\`format\` se safely strings banao**

\`\`\`sql
format('Hello %s, you have %s messages', name, n)   -- %s = value as text
format('SELECT * FROM %I WHERE id = %L', tbl, id)  -- %I = safe identifier, %L = safe literal
\`\`\`

**Pad / repeat / test**

\`\`\`sql
lpad('7', 4, '0')        -- '0007'
repeat('ab', 3)          -- 'ababab'
starts_with('foobar', 'foo')   -- true
\`\`\`

**Case-insensitive matching**

\`\`\`sql
WHERE lower(email) = lower(:input)           -- portable; lower(email) par ek index add karo
WHERE email ILIKE :input                     -- PostgreSQL
-- ya citext type istemal karo
\`\`\``,

    content: `## Length and case

- **\`length(s)\`** / **\`char_length(s)\`** — number of **characters**. **\`octet_length(s)\`** — number of **bytes** (differs for multibyte UTF-8: \`length('é')\` is 1, \`octet_length('é')\` is 2). **\`bit_length\`** — bits.
- **\`upper\`** / **\`lower\`** — full case fold, locale-aware.
- **\`initcap(s)\`** — uppercase the first letter of each word, lowercase the rest. Good enough for display, but "each word" is naive (it will "Title Case" \`o'brien\` as \`O'Brien\` and \`mcdonald\` as \`Mcdonald\`).

## The trim family

- **\`trim(s)\`** — remove leading and trailing **spaces**. **\`ltrim\`** / **\`rtrim\`** — one side.
- **\`trim([LEADING|TRAILING|BOTH] chars FROM s)\`** — remove any of the given characters from the chosen end(s): \`trim(BOTH '/' FROM '/path/')\` → \`'path'\`.
- **\`btrim(s, chars)\`** — function form of \`trim(BOTH chars FROM s)\`.

Trimming input before storing or comparing is common — a form field with a trailing space is a frequent cause of "the login says my email is wrong".

## Slicing

- **\`substring(s FROM start FOR length)\`** — 1-based start, given number of characters. \`substring(s FROM start)\` omits the length (to end of string). Also **\`substr(s, start, length)\`** as a plain function call, and **\`substring(s FROM pattern)\`** with a POSIX regex (Lesson 2).
- **\`left(s, n)\`** / **\`right(s, n)\`** — first / last \`n\` characters. A **negative** \`n\` means "all but the last / first \`|n|\`": \`left('abcdef', -2)\` = \`'abcd'\`.
- **\`position(sub IN s)\`** / **\`strpos(s, sub)\`** — 1-based index of the first occurrence, or **\`0\`** if not found (not \`NULL\`).

## Replace, translate, overlay

- **\`replace(s, from, to)\`** — replace **all** occurrences of a literal substring. This is **not** regex — \`replace('a.b', '.', '-')\` treats \`.\` literally. For pattern replacement use \`regexp_replace(..., 'g')\`.
- **\`translate(s, from_set, to_set)\`** — map each character in \`from_set\` to the character at the same position in \`to_set\`; characters with no mapping (\`to_set\` shorter) are deleted. \`translate('a1b2', '12', '')\` → \`'ab'\`.
- **\`overlay(s PLACING repl FROM start FOR n)\`** — splice \`repl\` into \`s\` replacing \`n\` characters from \`start\`.

## Splitting and joining

- **\`split_part(s, delimiter, n)\`** — the \`n\`-th field (1-based) when \`s\` is split on \`delimiter\`. Returns \`''\` if \`n\` is past the end. Ideal for pulling one piece out of a fixed-format string.
- **\`string_to_array(s, delimiter)\`** → a \`text[]\`. **\`string_to_table(s, delimiter)\`** (PG14+) → a set of rows. **\`regexp_split_to_array\`** / **\`regexp_split_to_table\`** when the delimiter is a pattern.
- **\`array_to_string(arr, delimiter)\`** — the reverse.
- **\`concat(a, b, c, ...)\`** — concatenate, treating \`NULL\` as \`''\`. **\`concat_ws(sep, a, b, c, ...)\`** — join with a separator, **skipping \`NULL\`** arguments entirely (so no doubled separator). Both are the \`NULL\`-safe alternative to \`||\`, which returns \`NULL\` if any operand is \`NULL\`.

## \`format\` — the safe string builder

**\`format(fmtstr, args...)\`** is like C's \`printf\` or Python's \`%\`-formatting:

- **\`%s\`** — the argument as text (\`NULL\` → the string \`''\` — actually the literal text, so be careful).
- **\`%I\`** — the argument as a **quoted SQL identifier** (a table or column name), quoting only if needed and escaping embedded quotes.
- **\`%L\`** — the argument as a **quoted SQL literal** (a value), with proper escaping, and \`NULL\` → the keyword \`NULL\`.
- **\`%1$s\`** — positional (reuse an argument).

\`%I\` and \`%L\` are the **only correct way** to build dynamic SQL strings (in \`PL/pgSQL\`, \`EXECUTE format(...)\`). Never concatenate user input into a SQL string — that is SQL injection. (Application code should use parameterised queries instead of building SQL at all.)

## Padding, repeating, testing

- **\`lpad(s, len, fill)\`** / **\`rpad(s, len, fill)\`** — pad \`s\` to \`len\` characters with \`fill\` on the left / right. If \`s\` is already longer than \`len\`, it is **truncated**. \`lpad(id::text, 6, '0')\` for zero-padded codes.
- **\`repeat(s, n)\`** — \`s\` repeated \`n\` times. **\`chr(n)\`** / **\`ascii(c)\`** — code point ↔ character.
- **\`starts_with(s, prefix)\`** — boolean, and it can use a B-tree index the way \`LIKE 'prefix%'\` can.

## Case-insensitive comparison, properly

\`WHERE name = 'smith'\` is case-sensitive. Options:

1. **\`WHERE lower(name) = lower('Smith')\`** — portable. For performance, add a **functional index**: \`CREATE INDEX ON person (lower(name))\`.
2. **\`WHERE name ILIKE 'smith'\`** — PostgreSQL; no wildcards means it is an exact case-insensitive match (but does not use a plain index; needs \`pg_trgm\`).
3. **\`citext\`** — an extension type that compares and de-duplicates case-insensitively by default. Convenient for an email or username column; slightly slower and you must \`CREATE EXTENSION citext\`.

Collation matters too: the database or column \`COLLATE\` setting decides sort order and, for some collations, case- and accent-sensitivity. A \`COLLATE "en-US-x-icu"\` or a case-insensitive collation (\`COLLATE case_insensitive\`, PG12+ non-deterministic collations) can make \`=\` itself case-insensitive.`,

    contentHi: `## Length aur case

- **\`length(s)\`** / **\`char_length(s)\`** — **characters** ki sankhya. **\`octet_length(s)\`** — **bytes** ki sankhya (multibyte UTF-8 ke liye alag: \`length('é')\` 1 hai, \`octet_length('é')\` 2).
- **\`upper\`** / **\`lower\`** — poora case fold, locale-aware.
- **\`initcap(s)\`** — har word ka pehla letter uppercase. Display ke liye theek, par "har word" naive hai.

## Trim family

- **\`trim(s)\`** — leading aur trailing **spaces** hatao. **\`ltrim\`** / **\`rtrim\`** — ek side.
- **\`trim([LEADING|TRAILING|BOTH] chars FROM s)\`** — diye characters mein se koi bhi chosen end(s) se hatao.
- **\`btrim(s, chars)\`** — \`trim(BOTH chars FROM s)\` ka function form.

Store ya compare karne se pehle input trim karna aam hai.

## Slicing

- **\`substring(s FROM start FOR length)\`** — 1-based start. **\`substr(s, start, length)\`** plain function call.
- **\`left(s, n)\`** / **\`right(s, n)\`** — pehle / aakhri \`n\` characters. **Negative** \`n\` matlab "aakhri / pehle \`|n|\` ke alawa sab".
- **\`position(sub IN s)\`** / **\`strpos(s, sub)\`** — pehle occurrence ka 1-based index, ya **\`0\`** agar nahi mila (\`NULL\` nahi).

## Replace, translate, overlay

- **\`replace(s, from, to)\`** — ek literal substring ke **sabhi** occurrences replace karo. Ye regex **nahi** hai.
- **\`translate(s, from_set, to_set)\`** — har character ko map karo; bina mapping wale delete ho jaate hain.

## Splitting aur joining

- **\`split_part(s, delimiter, n)\`** — \`n\`-th field (1-based). \`''\` agar \`n\` end se aage hai.
- **\`string_to_array(s, delimiter)\`** -> ek \`text[]\`. **\`regexp_split_to_array\`** jab delimiter ek pattern hai.
- **\`concat(a, b, c, ...)\`** — \`NULL\` ko \`''\` maankar concatenate. **\`concat_ws(sep, a, b, c, ...)\`** — ek separator ke saath join, \`NULL\` arguments **skip** karke. Dono \`||\` ke \`NULL\`-safe vikalp hain.

## \`format\` — safe string builder

**\`format(fmtstr, args...)\`** \`printf\` jaisa: **\`%s\`** (value as text), **\`%I\`** (quoted SQL identifier), **\`%L\`** (quoted SQL literal, proper escaping ke saath). \`%I\` aur \`%L\` dynamic SQL strings banane ka **ekmatra sahi tareeka** hain. User input ko kabhi ek SQL string mein concatenate mat karo — wo SQL injection hai.

## Padding, repeating, testing

- **\`lpad(s, len, fill)\`** / **\`rpad(s, len, fill)\`** — pad karo. Agar \`s\` pehle se \`len\` se lamba hai, ye **truncate** ho jaata hai.
- **\`repeat(s, n)\`** — \`s\` \`n\` baar repeated.
- **\`starts_with(s, prefix)\`** — boolean, aur ye ek B-tree index istemal kar sakta hai.

## Case-insensitive comparison

1. **\`WHERE lower(name) = lower('Smith')\`** — portable. Performance ke liye ek **functional index** add karo.
2. **\`WHERE name ILIKE 'smith'\`** — PostgreSQL.
3. **\`citext\`** — ek extension type jo default se case-insensitively compare karta hai.

Collation bhi maayne rakhta hai: database ya column \`COLLATE\` setting sort order tय karta hai.`,

    examples: [
      {
        title: 'length vs octet_length, the trim family, initcap',
        titleHi: 'length vs octet_length, trim family, initcap',
        code: `SELECT
  length('café')                    AS chars,       -- 4
  octet_length('café')              AS bytes,       -- 5 (é is 2 bytes in UTF-8)
  initcap('the QUICK brown fox')    AS titled,
  trim('   spaced   ')              AS trimmed,
  btrim('...core...', '.')          AS unwrapped,
  trim(TRAILING '0' FROM '25.900')  AS no_trailing_zeros;`,
        output: ` chars | bytes | titled              | trimmed | unwrapped | no_trailing_zeros
-------+-------+---------------------+---------+-----------+-------------------
 4     | 5     | The Quick Brown Fox | spaced  | core      | 25.9
(1 row)`,
        explain: "`length('café')` counts 4 CHARACTERS but `octet_length('café')` is 5 BYTES — `é` is two bytes in UTF-8. `initcap` upper-cases the first letter of each word. `trim` with no arguments removes leading and trailing spaces; `btrim(s, '.')` removes leading/trailing dots; `trim(TRAILING '0' FROM '25.900')` strips only the trailing zeros, giving `25.9`.",
        explainHi: "`length('café')` 4 CHARACTERS count karता hai par `octet_length('café')` 5 BYTES hai — `é` UTF-8 mein do bytes hai. `initcap` har word ka pehla letter upper-case karता hai. `trim` bina arguments leading/trailing spaces hataता hai; `trim(TRAILING '0' FROM '25.900')` sirf trailing zeros strip karता hai.",
      },
      {
        title: 'Slice, split, and NULL-safe joining',
        titleHi: 'Slice, split, aur NULL-safe joining',
        code: `SELECT
  substring('2026-03-15' FROM 6 FOR 2)   AS month_part,   -- '03'
  left('abcdef', -2)                     AS all_but_last2, -- 'abcd'
  position('@' IN 'ada@example.com')     AS at_pos,        -- 4
  split_part('a.b.c.d', '.', 3)          AS third,         -- 'c'
  ('x' || NULL || 'y')                   AS pipes_null,    -- NULL
  concat_ws(' ', 'Ada', NULL, 'Lovelace') AS full_name;    -- 'Ada Lovelace'`,
        output: ` month_part | all_but_last2 | at_pos | third | pipes_null | full_name
------------+---------------+--------+-------+------------+--------------
 03         | abcd          | 4      | c     | NULL       | Ada Lovelace
(1 row)`,
        explain: '`substring(\'2026-03-15\' FROM 6 FOR 2)` takes 2 characters starting at position 6 (1-based), `\'03\'`. `left(\'abcdef\', -2)` with a NEGATIVE length means "all but the last 2", `\'abcd\'`. `position(\'@\' IN ...)` is the 1-based index, `4`. `split_part(\'a.b.c.d\', \'.\', 3)` is the 3rd piece, `\'c\'`. `\'x\' || NULL || \'y\'` is `NULL` (any `NULL` poisons `||`), but `concat_ws(\' \', \'Ada\', NULL, \'Lovelace\')` skips the `NULL` and produces `\'Ada Lovelace\'` with a single space.',
        explainHi: '`substring(\'2026-03-15\' FROM 6 FOR 2)` position 6 (1-based) se 2 characters leta hai, `\'03\'`. `left(\'abcdef\', -2)` NEGATIVE length ke saath matlab "aakhri 2 ke alawa sab", `\'abcd\'`. `\'x\' || NULL || \'y\'` `NULL` hai, par `concat_ws(\' \', \'Ada\', NULL, \'Lovelace\')` `NULL` skip karता hai aur ek single space ke saath `\'Ada Lovelace\'` produce karता hai.',
      },
      {
        title: 'lpad for codes, format with %I/%L, case-insensitive match',
        titleHi: 'codes ke liye lpad, %I/%L ke saath format, case-insensitive match',
        code: `SELECT
  'INV-' || lpad(42::text, 6, '0')                       AS invoice_no,   -- 'INV-000042'
  format('SELECT * FROM %I WHERE email = %L', 'user', $$a' OR '1'='1$$)  AS safe_sql,
  (lower('Ada@Example.COM') = lower('ADA@example.com'))  AS emails_match;`,
        output: ` invoice_no | safe_sql                                              | emails_match
------------+-------------------------------------------------------+--------------
 INV-000042 | SELECT * FROM "user" WHERE email = 'a'' OR ''1''=''1' | t
(1 row)`,
        explain: '`lpad(42::text, 6, \'0\')` zero-pads to 6 characters, `\'000042\'`. `format(\'... %I ... %L\', \'user\', ...)` uses `%I` to quote the identifier as `"user"` (a reserved word, so it needs quoting) and `%L` to quote the value as a SQL literal, doubling every embedded quote — so the injection payload `a\' OR \'1\'=\'1` is rendered safely as `\'a\'\' OR \'\'1\'\'=\'\'1\'`. `lower(...) = lower(...)` makes the two differently-cased emails compare equal.',
        explainHi: '`lpad(42::text, 6, \'0\')` 6 characters tak zero-pad karता hai, `\'000042\'`. `format(\'... %I ... %L\', \'user\', ...)` `%I` se identifier ko `"user"` ke roop mein quote karता hai aur `%L` se value ko ek SQL literal ke roop mein quote karता hai, har embedded quote double karके — to injection payload safely render hoता hai. `lower(...) = lower(...)` do alag-case emails ko barabar compare karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- build a full display name
SELECT first_name || ' ' || middle_name || ' ' || last_name AS display_name
FROM person;
-- every row where middle_name IS NULL gets display_name = NULL (the whole name vanishes)`,
        right: `SELECT concat_ws(' ', first_name, middle_name, last_name) AS display_name
FROM person;
-- concat_ws skips NULL arguments AND does not leave a doubled space`,
        why: 'The || operator returns NULL if any operand is NULL, so a single missing middle name blanks the entire concatenated string. Wrapping each part in COALESCE fixes the NULL but leaves a doubled space where the middle name would have been. concat_ws does both jobs: it drops NULL arguments entirely and only inserts the separator between the parts that are actually present, so "Ada" and NULL and "Lovelace" becomes "Ada Lovelace", not "Ada  Lovelace" and not NULL. Use || only when you are sure no operand can be NULL.',
        whyHi: '|| operator NULL return karta hai agar koi operand NULL hai, to ek single missing middle name poori concatenated string ko blank kar deta hai. Har part ko COALESCE mein wrap karna NULL fix karta hai par ek doubled space chhod deta hai. concat_ws dono kaam karta hai: ye NULL arguments poori tarah drop karta hai aur sirf actually present parts ke beech separator daalता hai.',
      },
      {
        wrong: `-- "replace dots with dashes in a version string"
SELECT regexp_replace(version, '.', '-') FROM release;
-- '.' in a regex is "any character" -> '1.2.3' becomes '-1.2.3' (only the first char, replaced)
-- ...actually every char, if you add 'g': '-------'`,
        right: `SELECT replace(version, '.', '-') FROM release;
-- replace() is plain text: '.' means a literal dot, and ALL of them are replaced`,
        why: 'regexp_replace treats its second argument as a pattern, so an unescaped dot matches any character, not a literal dot. Without the g flag it replaces the first character; with g it replaces every character. When the "from" is a fixed literal string, use replace, which is plain-text, replaces all occurrences, and needs no escaping. Reserve regexp_replace for actual patterns, and remember to escape regex metacharacters (dot, star, plus, parens, brackets) when you want them literally.',
        whyHi: 'regexp_replace apne doosre argument ko ek pattern maanta hai, to ek unescaped dot koi bhi character match karta hai, ek literal dot nahi. Jab "from" ek fixed literal string hai, replace istemal karo, jo plain-text hai, sabhi occurrences replace karta hai, aur koi escaping nahi chahiye.',
      },
      {
        wrong: `-- store a code padded to 8 digits
SELECT lpad(order_id::text, 8, '0') AS code FROM big_orders;
-- order_id 123456789 is 9 digits -> lpad TRUNCATES it to '23456789' -- silently wrong`,
        right: `SELECT
  CASE WHEN length(order_id::text) > 8
       THEN order_id::text                     -- do not pad; it is already wider
       ELSE lpad(order_id::text, 8, '0')
  END AS code
FROM big_orders;
-- or size the target so overflow cannot happen, or use to_char(order_id, 'FM00000000')`,
        why: 'lpad and rpad pad a string up to the target length, but if the string is already longer than the target they truncate it from the far end. So a fixed-width padding of an id that has outgrown the width silently produces a shorter, wrong value. Guard the length, choose a width that the values cannot exceed, or use to_char with a numeric format mask which does not truncate. This bites when an id or sequence crosses the padded-width boundary years after the code was written.',
        whyHi: 'lpad aur rpad ek string ko target length tak pad karte hain, par agar string pehle se target se lambi hai to wo ise far end se truncate karte hain. To ek id ka fixed-width padding jo width se bada ho gaya chupchaap ek chhota, galat value produce karta hai. Length guard karo, ya to_char ek numeric format mask ke saath istemal karo jo truncate nahi karta.',
      },
    ],

    realWorld: [
      {
        en: '**`trim(lower(email))` applied at write time (in the app or a `BEFORE INSERT` trigger)** so the stored value is canonical, plus a `UNIQUE` index on it, so "Ada@X.com " and "ada@x.com" cannot both register.',
        hi: '**Write time par `trim(lower(email))`** taaki stored value canonical ho, plus uspar ek `UNIQUE` index.',
      },
      {
        en: '**`concat_ws(\', \', address_line, city, region, postcode, country)` for a one-line address** — parts that are `NULL` (no region, say) just drop out with no stray comma.',
        hi: '**Ek one-line address ke liye `concat_ws(\', \', address_line, city, region, postcode, country)`** — `NULL` parts bina stray comma ke gir jaate hain.',
      },
      {
        en: '**`split_part(user_agent, \' \', 1)` and `split_part(referrer, \'/\', 3)` in a lightweight analytics view** to pull the browser family and the referring host without a regex or a parsing library.',
        hi: '**Ek lightweight analytics view mein `split_part(user_agent, \' \', 1)`** browser family nikालने ke liye bina ek regex ke.',
      },
    ],

    interviewQA: [
      {
        q: 'Why prefer `concat_ws` / `concat` over `||`, and what is the difference between them?',
        qHi: '`||` par `concat_ws` / `concat` kyun prefer karein, aur unke beech kya antar hai?',
        a: 'The pipe-pipe operator returns NULL if any of its operands is NULL, so concatenating several columns where one might be missing blanks the entire result. A single NULL middle name makes the whole display name NULL. concat treats NULL as an empty string, so it never returns NULL from a NULL input, and it just leaves that piece out. concat_ws goes further: the first argument is a separator, and it joins the remaining arguments with that separator while skipping NULL arguments entirely, so you do not get a doubled separator where a NULL was. So building a full name from first, middle, last with concat_ws of a space produces Ada Lovelace when the middle name is NULL, not Ada space space Lovelace and not NULL. The rule is: use pipe-pipe only when you are certain no operand can be NULL, for example concatenating string literals or non-nullable columns; use concat_ws whenever you are joining a set of possibly-NULL fields with a delimiter, which is most real-world string building.',
        aHi: 'Pipe-pipe operator NULL return karta hai agar iske kisi bhi operand NULL hai, to kई columns concatenate karna jahaan ek missing ho sakta hai poore result ko blank kar deta hai. Ek single NULL middle name poore display name ko NULL banata hai. concat NULL ko ek empty string maanta hai, to ye kabhi ek NULL input se NULL return nahi karta. concat_ws aur aage jaता hai: pehla argument ek separator hai, aur ye baaki arguments ko us separator ke saath join karta hai jabki NULL arguments poori tarah skip karta hai. Niyam: pipe-pipe sirf tab istemal karo jab aap sure ho koi operand NULL nahi ho sakta; concat_ws jab bhi aap possibly-NULL fields ka ek set ek delimiter ke saath join kar rahe ho.',
      },
      {
        q: 'How do you do a case-insensitive equality search on a text column, and how do you keep it fast?',
        qHi: 'Aap ek text column par case-insensitive equality search kaise karte ho, aur ise fast kaise rakhte ho?',
        a: 'The portable way is to fold both sides to the same case: WHERE lower of the column equals lower of the input. This works in every SQL database. The catch is that applying lower to the column means a plain B-tree index on the raw column cannot be used, so on a large table the query becomes a full scan. The fix is a functional or expression index: CREATE INDEX ON person, lower of name. Now the planner can use the index for the lower-of-column equals lower-of-constant predicate. In PostgreSQL specifically you can also use ILIKE with no wildcards for an exact case-insensitive match, but ILIKE does not use a plain index either and needs a pg_trgm index to be fast. A third option is the citext extension type, which compares case-insensitively by default, so ordinary equality and unique constraints just work case-insensitively on that column, at a small performance cost and the need to install the extension. For a username or email column, a canonical-form approach is often cleanest: store the value already lower-cased and trimmed, put a normal unique index on it, and normalise on the way in.',
        aHi: 'Portable tareeka dono sides ko same case mein fold karna hai: WHERE column ka lower equals input ka lower. Ye har SQL database mein kaam karta hai. Catch ye hai ki column par lower apply karna matlab raw column par ek plain B-tree index istemal nahi ho sakta, to ek bade table par query ek full scan ban jaती hai. Fix ek functional ya expression index hai: CREATE INDEX ON person, name ka lower. PostgreSQL mein aap ILIKE bina wildcards ke bhi istemal kar sakte ho, par ILIKE bhi ek plain index istemal nahi karta. Ek teesra option citext extension type hai. Ek username ya email column ke liye, ek canonical-form approach aksar sabse saaf hai: value ko pehle se lower-cased aur trimmed store karo.',
      },
    ],

    exercises: [
      {
        task: 'One `SELECT` computing: `length(\'naïve\')`, `octet_length(\'naïve\')`, `initcap(\'hello-world foo\')`, `trim(BOTH \'x\' FROM \'xxfooxx\')`, `left(\'abcdefgh\', -3)`, `split_part(\'a/b/c/d\', \'/\', 3)`. Predict each; confirm `length` is 5 but `octet_length` is 6 (the ï is 2 bytes), and `left(..., -3)` is `\'abcde\'`.',
        taskHi: 'Ek `SELECT` jo compute karta hai: `length(\'naïve\')`, `octet_length(\'naïve\')`, `initcap(\'hello-world foo\')`, `trim(BOTH \'x\' FROM \'xxfooxx\')`, `left(\'abcdefgh\', -3)`, `split_part(\'a/b/c/d\', \'/\', 3)`.',
        hint: '`ï` is one character but two UTF-8 bytes. `left(s, -3)` drops the last 3 chars: `abcdefgh` -> `abcde`. `split_part` piece 3 of a slash-split is `c`.',
        hintHi: '`ï` ek character par do UTF-8 bytes. `left(s, -3)` aakhri 3 chars drop karta hai. `split_part` piece 3 `c` hai.',
      },
      {
        task: 'Table `person(first text, middle text, last text)` with rows including one where `middle IS NULL`. Compare `first || \' \' || middle || \' \' || last` against `concat_ws(\' \', first, middle, last)` for that row. Confirm the first gives `NULL` and the second gives a clean two-word name.',
        taskHi: 'Table `person(first text, middle text, last text)` ek row ke saath jahaan `middle IS NULL`. `first || \' \' || middle || \' \' || last` ko `concat_ws(\' \', first, middle, last)` se compare karo.',
        hint: '`||` with a `NULL` operand -> `NULL`. `concat_ws` skips the `NULL` `middle` and inserts only one space between `first` and `last`.',
        hintHi: '`||` ek `NULL` operand ke saath -> `NULL`. `concat_ws` `NULL` `middle` skip karta hai.',
      },
      {
        task: 'Table `account(id int, email text)` with `\'Ada@X.com\'`, `\'ada@x.com\'`, `\'BOB@y.io\'`. Write a query that finds the row(s) matching the input `\'ADA@x.COM\'` case-insensitively, using `lower()` on both sides. Then write one comment describing the index you would add to keep this fast on a million rows.',
        taskHi: 'Table `account(id int, email text)`. Ek query likho jo input `\'ADA@x.COM\'` se case-insensitively match karti hai, dono sides par `lower()` istemal karke. Phir ek comment: kaunsa index add karoge.',
        hint: '`WHERE lower(email) = lower(\'ADA@x.COM\')` matches both `Ada@X.com` and `ada@x.com`. The index: `CREATE INDEX account_email_lower ON account (lower(email))`.',
        hintHi: '`WHERE lower(email) = lower(\'ADA@x.COM\')`. Index: `CREATE INDEX account_email_lower ON account (lower(email))`.',
      },
    ],

    keyTakeaways: [
      '`length`/`char_length` = CHARACTERS; `octet_length` = BYTES (differ for multibyte UTF-8). `upper`/`lower` locale-aware; `initcap` = title-case each word (naive — mishandles `o\'brien`, `mcdonald`).',
      'TRIM: `trim(s)` = both ends, spaces; `ltrim`/`rtrim` = one side; `trim([LEADING|TRAILING|BOTH] chars FROM s)` / `btrim(s, chars)` = remove specific chars. Trim input before storing/comparing (trailing-space "wrong email" bugs).',
      'SLICE: `substring(s FROM start FOR len)` / `substr(s, start, len)` (1-based); `left(s, n)` / `right(s, n)` (NEGATIVE n = "all but last/first |n|"); `position(sub IN s)` / `strpos(s, sub)` = 1-based, `0` (not `NULL`) if not found.',
      '`replace(s, from, to)` = PLAIN TEXT, ALL occurrences, NO escaping (`.` is literal). `regexp_replace(s, pat, repl [, flags])` = PATTERN, needs `\'g\'` for all. `translate(s, from_set, to_set)` = char-by-char map (unmapped -> deleted).',
      'SPLIT/JOIN: `split_part(s, delim, n)` = nth field (1-based, `\'\'` past end); `string_to_array` -> `text[]`; `regexp_split_to_array`/`_table` for pattern delims. `concat(...)` treats `NULL` as `\'\'`; `concat_ws(sep, ...)` joins with a separator SKIPPING `NULL` args — both are the `NULL`-SAFE alternative to `||` (which -> `NULL` on any `NULL`).',
      '`format(fmt, args)`: `%s` (value as text), `%I` (quoted IDENTIFIER — table/col name), `%L` (quoted LITERAL — value, proper escaping, `NULL` -> keyword `NULL`), `%1$s` positional. `%I`/`%L` are the ONLY correct way to build dynamic SQL — never concatenate user input into a SQL string.',
      '`lpad(s, len, fill)` / `rpad(...)` pad to `len` — but TRUNCATE from the far end if `s` is already longer than `len` (silent bug when an id outgrows the width; `to_char(n, \'FM00000000\')` does not truncate). `starts_with(s, prefix)` can use a B-tree index like `LIKE \'prefix%\'`.',
      'CASE-INSENSITIVE `=`: (1) `WHERE lower(col) = lower(:in)` + a FUNCTIONAL index `CREATE INDEX ON t (lower(col))` (portable, fast); (2) `col ILIKE :in` (PostgreSQL, no plain-index use); (3) `citext` type (compares CI by default). Or store a canonical (trimmed + lower-cased) form with a normal `UNIQUE` index.',
    ],
    keyTakeawaysHi: [
      '`length`/`char_length` = CHARACTERS; `octet_length` = BYTES (multibyte UTF-8 ke liye alag). `initcap` = har word title-case (naive).',
      'TRIM: `trim(s)` = dono ends, spaces; `trim([LEADING|TRAILING|BOTH] chars FROM s)` / `btrim(s, chars)` = specific chars hatao. Store/compare se pehle input trim karo.',
      'SLICE: `substring(s FROM start FOR len)` (1-based); `left(s, n)` / `right(s, n)` (NEGATIVE n = "aakhri/pehle |n| ke alawa sab"); `position(sub IN s)` = 1-based, `0` agar nahi mila.',
      '`replace(s, from, to)` = PLAIN TEXT, SABHI occurrences (`.` literal). `regexp_replace` = PATTERN, sabhi ke liye `\'g\'` chahiye. `translate` = char-by-char map.',
      'SPLIT/JOIN: `split_part(s, delim, n)` = nth field (1-based); `string_to_array` -> `text[]`. `concat(...)` `NULL` ko `\'\'` maanta hai; `concat_ws(sep, ...)` `NULL` args SKIP karke join karta hai — dono `||` ke `NULL`-SAFE vikalp.',
      '`format(fmt, args)`: `%s` (value as text), `%I` (quoted IDENTIFIER), `%L` (quoted LITERAL). `%I`/`%L` dynamic SQL banane ka EKMATRA sahi tareeka — user input ko kabhi SQL string mein concatenate mat karo.',
      '`lpad(s, len, fill)` `len` tak pad karta hai — par far end se TRUNCATE karta hai agar `s` pehle se lamba hai (silent bug). `starts_with(s, prefix)` ek B-tree index istemal kar sakta hai.',
      'CASE-INSENSITIVE `=`: (1) `WHERE lower(col) = lower(:in)` + ek FUNCTIONAL index (portable, fast); (2) `col ILIKE :in` (PostgreSQL); (3) `citext` type. Ya ek canonical form store karo ek normal `UNIQUE` index ke saath.',
    ],
  },

  {
    slug: 'sql-numbers-and-math',
    title: 'Numbers & Math: `numeric` vs `float`, Rounding, Overflow',
    titleHi: 'Numbers Aur Math: `numeric` vs `float`, Rounding, Overflow',
    description: '`numeric` is exact decimal — use it for money. `real` / `double precision` are binary floating-point — fast, but `0.1 + 0.2` is not `0.3`. Casting to `integer` rounds (differently for `numeric` and `float`); `trunc` chops. Integer overflow and `numeric` precision overflow are errors, not silent wrap-around.',
    descriptionHi: '`numeric` exact decimal hai — money ke liye ise istemal karo. `real` / `double precision` binary floating-point hain — fast, par `0.1 + 0.2` `0.3` nahi hai. `integer` mein cast karna round karta hai (`numeric` aur `float` ke liye alag); `trunc` chop karta hai. Integer overflow aur `numeric` precision overflow errors hain, silent wrap-around nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Two rulers.** One is marked in exact tenths and hundredths — every gradation is a real decimal, and adding 0.1 and 0.2 lands you precisely on 0.3. That is `numeric`: it stores the digits you asked for, exactly, and arithmetic is exact. The other ruler is subtly warped: it is marked in *binary* fractions, so most decimal values fall *between* its lines and get snapped to the nearest one. Measure 0.1, measure 0.2, add them, and you land a hair past 0.3 — `0.30000000000000004`. That is `double precision`: astonishingly fast for the engine to work with, fine for physics and statistics where a rounding error in the 16th digit is noise, and completely wrong for money, where that error compounds across a million transactions into real dollars. The rule follows directly: exact quantities that must add up — currency, counts of things, quantities on an invoice — go on the exact ruler; measured or estimated real-world quantities where speed matters and the last digit does not — go on the fast one.',
      hi: '**Do rulers.** Ek exact tenths aur hundredths mein marked hai — har gradation ek real decimal hai, aur 0.1 aur 0.2 jodना aapko theek 0.3 par le jaта hai. Wo `numeric` hai: ye wo digits store karta hai jo aapne maange, theek, aur arithmetic exact hai. Doosra ruler subtly warped hai: ye *binary* fractions mein marked hai, to zyaadatar decimal values iski lines ke *beech* girती hain aur nearest ek par snap ho jaती hain. 0.1 measure karo, 0.2 measure karo, jodो, aur aap 0.3 se ek baal aage girते ho — `0.30000000000000004`. Wo `double precision` hai: engine ke liye kaam karna astonishingly fast, physics aur statistics ke liye theek jahaan 16th digit mein ek rounding error noise hai, aur money ke liye poori tarah galat, jahaan wo error ek million transactions ke paar real dollars mein compound hoता hai. Niyam seedhे follow hoता hai: exact quantities jo add up honi chahिए — currency, counts — exact ruler par jaती hain; measured real-world quantities jahaan speed maayne rakhती hai — fast ek par.',
    },

    simple: `**The number types**

\`\`\`
smallint    2 bytes   -32768 .. 32767
integer     4 bytes   about +-2.1 billion              (the everyday integer)
bigint      8 bytes   about +-9.2 x 10^18
numeric(p,s)  exact decimal, p total digits, s after the point.  numeric (no p,s) = unbounded.
real          4 bytes  ~6 significant digits    } binary floating point -- FAST, INEXACT
double precision 8 b   ~15 significant digits   } '0.1 + 0.2' <> '0.3'
\`\`\`

**Exact vs inexact**

\`\`\`sql
SELECT 0.1::numeric + 0.2::numeric;   -- 0.3                    (exact)
SELECT 0.1::float8  + 0.2::float8;    -- 0.30000000000000004   (binary rounding)
-- MONEY -> numeric(12,2) or store integer cents.  NEVER float for currency.
\`\`\`

**Integer division truncates (Lesson 1 recap)**

\`\`\`sql
17 / 5           -- 3      (integer / integer)
17 % 5           -- 2      modulo
div(17, 5)       -- 3      explicit integer quotient
17::numeric / 5  -- 3.4    (one side numeric)
\`\`\`

**Rounding — and it differs by type**

\`\`\`sql
round(2.5)          -- 3    numeric: round half AWAY from zero  (2.5->3, 3.5->4, -2.5->-3)
round(2.5::float8)  -- 2    float:   round half to EVEN         (2.5->2, 3.5->4)
round(2.345, 2)     -- 2.35   round to 2 decimal places  (numeric only)
trunc(3.99)         -- 3    chop toward zero      trunc(-3.99) -- -3
floor(-3.1)         -- -4   toward negative infinity
ceil(3.1)           -- 4    toward positive infinity
3.9::integer        -- 4    a CAST to integer ROUNDS (it does not truncate)
\`\`\`

**Overflow and precision are ERRORS, not silent wrap**

\`\`\`sql
SELECT 2147483647 + 1;         -- ERROR: integer out of range     (use bigint)
SELECT 12.34::numeric(3,2);    -- ERROR: numeric field overflow   (3 digits, 2 after -> max 9.99)
SELECT 1 / 0;                  -- ERROR: division by zero
\`\`\`

**Math functions**

\`\`\`sql
abs(-7)      sign(-3)      mod(-17, 5)      power(2, 10)     sqrt(144)
exp(1)       ln(x)         log(x)  -- base 10        log(2, 8)  -- base 2  -> 3
random()             -- double in [0, 1)          NON-DETERMINISTIC -- code, not example output
gen_random_uuid()    -- a random UUID
\`\`\`

**Aggregate result types widen**

\`\`\`sql
sum(int_col)   -> bigint      (so a big sum of ints does not overflow)
avg(int_col)   -> numeric     (a fractional average, exact)
sum(numeric)   -> numeric
\`\`\`

**Bucketing**

\`\`\`sql
width_bucket(value, low, high, n)   -- which of n equal-width buckets in [low, high); n+1 if above high
generate_series(1, 5)              -- 1,2,3,4,5   (a set of rows)
generate_series(0, 100, 25)       -- 0,25,50,75,100
\`\`\``,

    simpleHi: `**Number types**

\`\`\`
smallint    2 bytes   integer      4 bytes (~+-2.1 billion)      bigint      8 bytes
numeric(p,s)  exact decimal, p total digits, s point ke baad.  numeric = unbounded.
real          4 bytes  } binary floating point -- FAST, INEXACT
double precision 8 b   } '0.1 + 0.2' <> '0.3'
\`\`\`

**Exact vs inexact**

\`\`\`sql
SELECT 0.1::numeric + 0.2::numeric;   -- 0.3                    (exact)
SELECT 0.1::float8  + 0.2::float8;    -- 0.30000000000000004
-- MONEY -> numeric(12,2) ya integer cents store karo. Currency ke liye KABHI float nahi.
\`\`\`

**Integer division truncate karti hai**

\`\`\`sql
17 / 5           -- 3      17 % 5 -- 2      div(17, 5) -- 3      17::numeric / 5 -- 3.4
\`\`\`

**Rounding — type se alag**

\`\`\`sql
round(2.5)          -- 3    numeric: half zero se DOOR  (2.5->3, -2.5->-3)
round(2.5::float8)  -- 2    float:   half to EVEN       (2.5->2, 3.5->4)
round(2.345, 2)     -- 2.35   2 decimal places tak
trunc(3.99)         -- 3    zero ki taraf chop      floor(-3.1) -- -4      ceil(3.1) -- 4
3.9::integer        -- 4    integer mein CAST ROUND karta hai
\`\`\`

**Overflow aur precision ERRORS hain, silent wrap nahi**

\`\`\`sql
SELECT 2147483647 + 1;         -- ERROR: integer out of range
SELECT 12.34::numeric(3,2);    -- ERROR: numeric field overflow
SELECT 1 / 0;                  -- ERROR: division by zero
\`\`\`

**Math functions**

\`\`\`sql
abs(-7)   sign(-3)   mod(-17, 5)   power(2, 10)   sqrt(144)   ln(x)   log(x)   log(2, 8) -> 3
random()             -- [0, 1) mein double, NON-DETERMINISTIC -- code, example output nahi
gen_random_uuid()
\`\`\`

**Aggregate result types widen hote hain**

\`\`\`sql
sum(int_col)   -> bigint         avg(int_col)   -> numeric         sum(numeric)   -> numeric
\`\`\`

**Bucketing**

\`\`\`sql
width_bucket(value, low, high, n)   -- [low, high) mein n equal-width buckets mein se kaunsa
generate_series(1, 5)              -- 1,2,3,4,5
\`\`\``,

    content: `## The exact type: \`numeric\`

\`numeric\` (a.k.a. \`decimal\`) stores numbers as **base-10 digits**, exactly. \`numeric(p, s)\` means \`p\` significant digits total, \`s\` of them after the decimal point — so \`numeric(10, 2)\` holds values up to \`99999999.99\`. \`numeric\` with no arguments is unbounded (any precision). Arithmetic on \`numeric\` is exact: \`0.1 + 0.2\` is \`0.3\`, \`1.0 / 3\` gives as many digits as configured.

The cost: \`numeric\` is stored as a variable-length digit string and every operation is software arithmetic, so it is **noticeably slower** than the machine's native float — often 5–20× for heavy computation. That is a fine trade for money and quantities; it is a bad trade for a physics simulation.

**Use \`numeric\` for anything where the value must be exact and must add up: currency amounts, tax, quantities on an invoice, anything financial or regulatory.** Or store money as an **integer number of cents** (\`bigint\`) and divide by 100 only for display — also exact, and the fastest option.

## The inexact types: \`real\` and \`double precision\`

These are IEEE-754 binary floating point — 32-bit (\`real\`, ~6 significant digits) and 64-bit (\`double precision\` / \`float8\`, ~15). They are the CPU's native number format, so arithmetic is extremely fast, and they can represent a huge range. But they store values in **binary fractions**, and most decimal fractions (0.1, 0.2, 0.01) have no exact binary representation, so they are stored as the nearest representable value. The errors are tiny (~10⁻¹⁶ relative) but real, and they **accumulate**: sum a million rows of \`0.01\` in \`double precision\` and you will be off by a fraction of a cent — which, for money, is a bug.

\`0.1::float8 + 0.2::float8\` displays as \`0.30000000000000004\`. This is not a PostgreSQL quirk; it is the same in every language that uses IEEE-754 doubles (JavaScript, Python \`float\`, C \`double\`).

**Use \`double precision\` for measured or computed real-world quantities where the 15th digit does not matter and speed does: sensor readings, scientific data, statistics, ML features, geospatial coordinates.**

## Integer types and overflow

\`smallint\` (2 bytes), \`integer\` (4 bytes, ±2.1 billion), \`bigint\` (8 bytes, ±9.2×10¹⁸). Pick the smallest that comfortably fits the domain plus headroom; \`integer\` is the sensible default for counts and IDs on small-to-medium tables, \`bigint\` for anything that could exceed two billion (a global \`event\` table, a high-volume \`order_line\`).

**Integer arithmetic that exceeds the type's range raises \`integer out of range\` (or \`smallint out of range\`)** — it does *not* wrap around to a negative number the way C does. This is safer but it means \`SELECT sum(quantity)\` on an \`integer\` column can fail if the total exceeds two billion — which is exactly why \`sum()\` of an \`integer\` returns a \`bigint\`.

## Rounding, truncation, and casting

| operation | 2.5 | 3.5 | -2.5 | 3.99 | -3.1 |
|---|---|---|---|---|---|
| \`round(x)\` on **\`numeric\`** | 3 | 4 | -3 | 4 | -3 |
| \`round(x)\` on **\`float8\`** | **2** | 4 | -2 | 4 | -3 |
| \`trunc(x)\` | 2 | 3 | -2 | 3 | -3 |
| \`floor(x)\` | 2 | 3 | -3 | 3 | **-4** |
| \`ceil(x)\` | 3 | 4 | -2 | 4 | -3 |
| \`x::integer\` (cast) | 3 | 4 | -3 | 4 | -3 |

Key points:

- **\`round()\` on \`numeric\` rounds half away from zero**; **\`round()\` on \`float\` rounds half to even** ("banker's rounding"). So \`round(0.5)\` on numeric is 1, but \`round(0.5::float8)\` is 0. If the rounding rule matters (it does for money), stay in \`numeric\`.
- **\`round(x, n)\`** — round to \`n\` decimal places — is defined for \`numeric\` only. \`round(2.345, 2)\` = \`2.35\`.
- **\`trunc()\`** chops toward zero (\`trunc(-3.9)\` = \`-3\`). **\`floor()\`** and **\`ceil()\`** go toward negative / positive infinity (\`floor(-3.1)\` = \`-4\`).
- **Casting to \`integer\` rounds** (like \`round\`), it does not truncate. People assume \`3.9::int\` is 3; it is 4. Use \`trunc(3.9)::int\` if you mean "chop".

## \`numeric\` precision overflow

Assigning a value that exceeds a column's declared \`numeric(p, s)\` — too many digits before the point — raises **\`numeric field overflow\`**. \`12.34::numeric(3, 2)\` fails: 3 total digits with 2 after the point leaves only 1 before, max \`9.99\`. Excess digits *after* the point are rounded, not rejected: \`1.239::numeric(4, 2)\` is \`1.24\`.

## Division by zero — guard with \`NULLIF\` (Lesson 1)

\`x / 0\`, \`x % 0\`, \`div(x, 0)\`, \`mod(x, 0)\` all raise **\`division by zero\`**. \`x / NULLIF(y, 0)\` yields \`NULL\` instead. \`0 ^ 0\` is \`1\`; \`0.0 / 0.0\` in \`float8\` is also an error in PostgreSQL (unlike some languages that give \`NaN\`).

## Math functions and randomness

\`abs\`, \`sign\`, \`mod\`, \`gcd\`, \`lcm\`, \`power\` (or \`^\`), \`sqrt\`, \`cbrt\`, \`exp\`, \`ln\`, \`log(x)\` (base 10), \`log(b, x)\` (base \`b\`), \`factorial\`, plus the trig family. \`pi()\`.

\`random()\` returns a \`double precision\` in \`[0, 1)\`. \`random(a, b)\` (PG17+) or \`floor(random() * n)::int\` for a random integer. \`gen_random_uuid()\` for a v4 UUID (needs no extension in PG13+). **These are non-deterministic — never put their output in a documented example, and be aware that \`WHERE random() < 0.1\` re-evaluates per row.**

## Aggregate result types

\`sum\` and \`avg\` widen their result so it cannot overflow and so an average is fractional:

| input type | \`sum()\` | \`avg()\` |
|---|---|---|
| \`smallint\`, \`integer\` | \`bigint\` | \`numeric\` |
| \`bigint\` | \`numeric\` | \`numeric\` |
| \`numeric\` | \`numeric\` | \`numeric\` |
| \`real\`, \`double precision\` | \`double precision\` | \`double precision\` |

\`avg\` of an \`integer\` column is always exact-decimal — \`avg\` of \`(1, 2)\` is \`1.5\`, not \`1\`.

## Bucketing and series

- **\`width_bucket(value, low, high, count)\`** — returns which of \`count\` equal-width buckets spanning \`[low, high)\` the value falls in: \`0\` if below \`low\`, \`count + 1\` if at or above \`high\`. Handy for histograms.
- **\`generate_series(start, stop [, step])\`** — a **set-returning function**: one row per value. \`generate_series(1, 5)\` → 1..5; \`generate_series(0, 100, 10)\` → 0,10,…,100. Works for \`integer\`, \`bigint\`, \`numeric\`, and \`timestamp\` (Lesson 6). Use it to generate test data, fill gaps in a report (a row per day even with no data), or drive a numbers table.`,

    contentHi: `## Exact type: \`numeric\`

\`numeric\` (yani \`decimal\`) numbers ko **base-10 digits** ke roop mein store karta hai, theek. \`numeric(p, s)\` matlab kul \`p\` significant digits, unme se \`s\` decimal point ke baad. \`numeric\` par arithmetic exact hai: \`0.1 + 0.2\` \`0.3\` hai.

Cost: \`numeric\` ek variable-length digit string ke roop mein store hota hai aur har operation software arithmetic hai, to ye machine ke native float se **noticeably slower** hai — bhaari computation ke liye aksar 5-20x.

**Kisi bhi cheez ke liye \`numeric\` istemal karo jahaan value exact honi chahिए aur add up honi chahिए: currency amounts, tax, invoice quantities.** Ya money ko **integer number of cents** (\`bigint\`) ke roop mein store karo.

## Inexact types: \`real\` aur \`double precision\`

Ye IEEE-754 binary floating point hain. Arithmetic bahut fast hai. Par ye values ko **binary fractions** mein store karte hain, aur zyaadatar decimal fractions (0.1, 0.2) ka koi exact binary representation nahi hai. Errors tiny hain par real, aur wo **accumulate** karte hain: \`double precision\` mein \`0.01\` ki ek million rows sum karo aur aap ek cent ke fraction se off honge — money ke liye ek bug.

\`0.1::float8 + 0.2::float8\` \`0.30000000000000004\` dikhता hai. Ye ek PostgreSQL quirk nahi hai; ye har language mein same hai jo IEEE-754 doubles istemal karti hai (JavaScript, Python \`float\`).

**Measured ya computed real-world quantities ke liye \`double precision\` istemal karo jahaan 15th digit maayne nahi rakhता aur speed rakhती hai: sensor readings, scientific data, statistics, ML features.**

## Integer types aur overflow

\`smallint\` (2 bytes), \`integer\` (4 bytes, ±2.1 billion), \`bigint\` (8 bytes). Domain plus headroom ke liye sabse chhota jo comfortably fit ho.

**Integer arithmetic jo type ki range se aage jaता hai \`integer out of range\` raise karता hai** — ye C ki tarah wrap nahi karता. Isiliye ek \`integer\` column ka \`sum()\` ek \`bigint\` return karता hai.

## Rounding, truncation, aur casting

- **\`round()\` \`numeric\` par half zero se DOOR round karता hai**; **\`round()\` \`float\` par half to EVEN** ("banker's rounding"). \`round(0.5)\` numeric par 1 hai, par \`round(0.5::float8)\` 0.
- **\`round(x, n)\`** — \`n\` decimal places tak — sirf \`numeric\` ke liye.
- **\`trunc()\`** zero ki taraf chop. **\`floor()\`** / **\`ceil()\`** negative / positive infinity ki taraf.
- **\`integer\` mein casting ROUND karता hai** — truncate nahi. \`3.9::int\` 4 hai, 3 nahi.

## \`numeric\` precision overflow

Ek column ke declared \`numeric(p, s)\` se aage ek value — point se pehle bahut zyaada digits — **\`numeric field overflow\`** raise karता hai. Point ke *baad* excess digits round hote hain, reject nahi.

## Division by zero — \`NULLIF\` se guard karo

\`x / 0\`, \`x % 0\` sab **\`division by zero\`** raise karते hain. \`x / NULLIF(y, 0)\` \`NULL\` deता hai.

## Math functions aur randomness

\`abs\`, \`sign\`, \`mod\`, \`power\` (ya \`^\`), \`sqrt\`, \`exp\`, \`ln\`, \`log(x)\` (base 10), \`log(b, x)\` (base \`b\`). \`random()\` \`[0, 1)\` mein ek \`double\` return karता hai. \`gen_random_uuid()\` ek v4 UUID. **Ye non-deterministic hain — inhe kabhi ek documented example mein mat daalो.**

## Aggregate result types

\`sum\` aur \`avg\` apne result ko widen karते hain: \`sum(integer)\` -> \`bigint\`, \`avg(integer)\` -> \`numeric\` (fractional, exact).

## Bucketing aur series

- **\`width_bucket(value, low, high, count)\`** — \`[low, high)\` mein \`count\` equal-width buckets mein se kaunsa. Histograms ke liye.
- **\`generate_series(start, stop [, step])\`** — ek **set-returning function**: prati value ek row. Test data generate karne, ek report mein gaps bharने ke liye.`,

    examples: [
      {
        title: 'Exact numeric vs inexact float; integer sum widens to bigint',
        titleHi: 'Exact numeric vs inexact float; integer sum bigint mein widen hota hai',
        code: `SELECT
  (0.1::numeric + 0.2::numeric)::text AS numeric_add,   -- '0.3'
  (0.1::float8  + 0.2::float8)::text  AS float_add;      -- '0.30000000000000004'

CREATE TABLE cnt (n integer);
INSERT INTO cnt VALUES (2000000000), (2000000000);   -- would overflow integer if added as int
SELECT sum(n) AS total, pg_typeof(sum(n)) AS total_type FROM cnt;`,
        output: ` numeric_add | float_add
-------------+---------------------
 0.3         | 0.30000000000000004
(1 row)

 total      | total_type
------------+------------
 4000000000 | bigint
(1 row)`,
        explain: '`0.1 + 0.2` in `numeric` is exactly `0.3`; in `float8` it is `0.30000000000000004` because binary floating point cannot represent those decimals exactly and the rounding errors add up. The `sum(n)` example inserts two values that would overflow a 4-byte `integer` if added as one, but `sum()` of an `integer` column returns `bigint`, so `4000000000` is fine.',
        explainHi: '`numeric` mein `0.1 + 0.2` theek `0.3` hai; `float8` mein ye `0.30000000000000004` hai kyunki binary floating point un decimals ko theek represent nahi kar sakta. `sum(n)` example do values insert karता hai jo ek 4-byte `integer` overflow kar deती agar ek ke roop mein add hon, par ek `integer` column ka `sum()` `bigint` return karता hai.',
      },
      {
        title: 'Rounding: numeric half-away-from-zero, float half-to-even, cast rounds',
        titleHi: 'Rounding: numeric half-away-from-zero, float half-to-even, cast round karta hai',
        code: `SELECT
  round(2.5)          AS num_2_5,     -- 3
  round(-2.5)         AS num_neg,     -- -3
  round(2.5::float8)  AS flt_2_5,     -- 2   (banker's rounding)
  round(3.5::float8)  AS flt_3_5,     -- 4
  round(2.345, 2)     AS to_places,   -- 2.35
  trunc(3.99)         AS chopped,     -- 3
  floor(-3.1)         AS floored,     -- -4
  3.9::integer        AS cast_rounds; -- 4  (NOT 3)`,
        output: ` num_2_5 | num_neg | flt_2_5 | flt_3_5 | to_places | chopped | floored | cast_rounds
---------+---------+---------+---------+-----------+---------+---------+-------------
 3       | -3      | 2       | 4       | 2.35      | 3       | -4      | 4
(1 row)`,
        explain: "`round(2.5)` on a `numeric` is `3` and `round(-2.5)` is `-3` — round half AWAY from zero. `round(2.5::float8)` is `2` and `round(3.5::float8)` is `4` — floats use round half to EVEN (banker's rounding). `round(2.345, 2)` (two-argument, `numeric` only) is `2.35`. `trunc(3.99)` chops to `3`, `floor(-3.1)` goes down to `-4`, and `3.9::integer` ROUNDS to `4` — not `3`.",
        explainHi: '`numeric` par `round(2.5)` `3` hai aur `round(-2.5)` `-3` — round half zero se DOOR. `round(2.5::float8)` `2` hai aur `round(3.5::float8)` `4` — floats round half to EVEN istemal karते hain. `round(2.345, 2)` `2.35` hai. `trunc(3.99)` `3` mein chop karता hai, `floor(-3.1)` `-4` par jaता hai, aur `3.9::integer` `4` mein ROUND karता hai — `3` nahi.',
      },
      {
        title: 'Overflow and precision are errors; NULLIF guards division',
        titleHi: 'Overflow aur precision errors hain; NULLIF division guard karta hai',
        code: `-- each of these raises an error (shown as the harness reports it):
SELECT 12.34::numeric(3,2);   -- 3 digits total, 2 after the point -> max 9.99`,
        output: `[ERROR] numeric field overflow`,
        explain: '`12.34::numeric(3, 2)` requires 3 total digits with 2 after the decimal point, leaving room for only 1 digit before it (max `9.99`), so `12.34` overflows and the statement raises `numeric field overflow` — it is a hard error, not a truncation or a `NULL`. Integer overflow (`2147483647 + 1`) and `1 / 0` behave the same way: an error that aborts the statement.',
        explainHi: '`12.34::numeric(3, 2)` ko 2 point ke baad ke saath 3 total digits chahिए, point se pehle sirf 1 digit ke liye jagah chhodकर (max `9.99`), to `12.34` overflow karता hai aur statement `numeric field overflow` raise karता hai — ye ek hard error hai, ek truncation ya `NULL` nahi.',
      },
      {
        title: 'width_bucket for a histogram; generate_series to fill a range',
        titleHi: 'ek histogram ke liye width_bucket; ek range bharne ke liye generate_series',
        code: `-- put each score into one of 4 equal buckets over [0, 100)
SELECT
  width_bucket(score, 0, 100, 4) AS bucket,
  count(*)                        AS n
FROM (SELECT unnest(ARRAY[5, 12, 40, 55, 60, 88, 95, 100]) AS score) s
GROUP BY 1
ORDER BY 1;

-- a row for every step even where there is no data
SELECT generate_series(0, 100, 25) AS threshold;`,
        output: ` bucket | n
--------+---
 1      | 2
 2      | 1
 3      | 2
 4      | 2
 5      | 1
(5 rows)

 threshold
-----------
 0
 25
 50
 75
 100
(5 rows)`,
        explain: '`width_bucket(score, 0, 100, 4)` assigns each score to one of 4 equal-width buckets over `[0, 100)`: 5 and 12 -> bucket 1, 40 -> bucket 2, 55 and 60 -> bucket 3, 88 and 95 -> bucket 4, and 100 (at or above the high bound) -> the overflow bucket 5. `generate_series(0, 100, 25)` produces one row per step: 0, 25, 50, 75, 100.',
        explainHi: '`width_bucket(score, 0, 100, 4)` har score ko `[0, 100)` par 4 equal-width buckets mein se ek assign karता hai: 5 aur 12 -> bucket 1, 40 -> bucket 2, 55 aur 60 -> bucket 3, 88 aur 95 -> bucket 4, aur 100 (high bound par ya upar) -> overflow bucket 5. `generate_series(0, 100, 25)` prati step ek row produce karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `CREATE TABLE invoice (
  id serial PRIMARY KEY,
  amount double precision   -- money in a float
);
-- sum(amount) over thousands of rows drifts by cents; amount = 0.1 + 0.2 stored is 0.30000000000000004`,
        right: `CREATE TABLE invoice (
  id serial PRIMARY KEY,
  amount_cents bigint NOT NULL   -- exact; or  amount numeric(12,2)
);
-- display: amount_cents / 100.0 ;  arithmetic stays in integers or numeric`,
        why: 'Binary floating point cannot represent most decimal fractions exactly, so every monetary value stored in a real or double precision column is slightly off, and the errors compound: sum a large table and the total is wrong by a fraction of a cent, reconciliation fails, and an auditor notices. The two correct choices are numeric with a fixed scale, which is exact decimal arithmetic, or an integer count of the smallest unit such as cents, which is exact and the fastest. Never use float for currency, interest, tax, or any quantity that must reconcile. Reserve float for measured or estimated real-world values where a 15th-digit error is irrelevant.',
        whyHi: 'Binary floating point zyaadatar decimal fractions ko theek represent nahi kar sakta, to ek real ya double precision column mein store kiya har monetary value thoda off hai, aur errors compound karते hain: ek bade table ko sum karo aur total ek cent ke fraction se galat hai. Do sahi choices numeric ek fixed scale ke saath, ya smallest unit jaise cents ka ek integer count. Currency ke liye kabhi float istemal mat karo.',
      },
      {
        wrong: `-- "average items per order" as a whole number
SELECT sum(item_count) / count(*) AS avg_items FROM orders;
-- both are integers -> integer division -> "3" when the real average is 3.7`,
        right: `SELECT
  round(avg(item_count), 1) AS avg_items,          -- avg() already returns numeric -> 3.7
  sum(item_count)::numeric / count(*) AS also_ok
FROM orders;`,
        why: 'sum of an integer column is a bigint and count is a bigint, so dividing them is integer division and the fraction is lost — an average of 3.7 is reported as 3. The avg aggregate does the right thing automatically: avg of an integer column returns numeric, so avg gives 3.7 directly. If you insist on sum over count, cast one side to numeric first. This is the same integer-division trap as cents-to-dollars, and it is especially sneaky in an average because the truncated number still looks like a plausible answer.',
        whyHi: 'Ek integer column ka sum ek bigint hai aur count ek bigint, to unhe divide karna integer division hai aur fraction kho jaता hai — 3.7 ka ek average 3 report hota hai. avg aggregate automatically sahi cheez karता hai: ek integer column ka avg numeric return karता hai. Agar aap sum over count par zid karते ho, pehle ek side ko numeric mein cast karo.',
      },
      {
        wrong: `SELECT trunc_amount FROM (
  SELECT amount::integer AS trunc_amount FROM payment   -- "truncate the cents"
) t;
-- amount 19.99 -> 20, not 19 -- a CAST rounds, it does not truncate`,
        right: `SELECT trunc(amount)::integer AS trunc_amount FROM payment;
-- or floor(amount) if you specifically want "round down"`,
        why: 'Casting a fractional number to integer applies rounding, half away from zero for numeric, so 19.99 becomes 20 and 19.5 becomes 20. If the intent is to drop the fractional part entirely, that is trunc, which chops toward zero, or floor if you want to always round down including for negatives. The mental model people carry from C-style casts, where the fraction is simply discarded, does not apply to SQL. Any time you write value colon-colon integer expecting truncation, you have an off-by-one waiting to happen.',
        whyHi: 'Ek fractional number ko integer mein cast karna rounding apply karता hai, numeric ke liye half zero se door, to 19.99 20 ban jaता hai. Agar intent fractional part poori tarah drop karna hai, wo trunc hai, jo zero ki taraf chop karता hai, ya floor agar aap hamesha round down chahते ho.',
      },
    ],

    realWorld: [
      {
        en: '**Money stored as `bigint` cents everywhere, `numeric(12,2)` only at reporting boundaries** — all arithmetic (totals, tax, splits) is integer, exact, and fast; the conversion to a decimal string happens once, in the serializer.',
        hi: '**Money har jagah `bigint` cents ke roop mein store, `numeric(12,2)` sirf reporting boundaries par** — sबhi arithmetic integer, exact, aur fast.',
      },
      {
        en: '**`double precision` for `lat` / `lng`, `temperature_c`, `latency_ms` p99 estimates** — quantities that are measured or approximated, where the storage and compute speed of native float is worth more than the 16th significant digit.',
        hi: '**`lat` / `lng`, `temperature_c` ke liye `double precision`** — quantities jo measured ya approximated hain.',
      },
      {
        en: '**`generate_series(date_trunc(\'day\', :from), :to, \'1 day\')` LEFT JOINed to the fact table** so a daily-activity report has a row for every day, showing `0` on days with no events instead of a gap in the chart.',
        hi: '**`generate_series(...)` fact table se LEFT JOINed** taaki ek daily-activity report mein har din ke liye ek row ho.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you use `numeric` vs `double precision`, and why is `0.1 + 0.2` not `0.3` in float?',
        qHi: 'Aap `numeric` vs `double precision` kab istemal karte ho, aur float mein `0.1 + 0.2` `0.3` kyun nahi hai?',
        a: 'numeric stores numbers as base-ten digits and does arithmetic on them exactly, so 0.1 plus 0.2 is exactly 0.3 and a sum of a million rows is exact to the last digit. The cost is speed: it is software arithmetic on a digit string, several times slower than the CPU\'s native float. double precision is IEEE-754 64-bit binary floating point, the CPU\'s native format, so it is very fast and covers an enormous range, but it stores values as binary fractions. Most decimal fractions, including 0.1 and 0.2 and 0.01, have no finite binary representation, so they are rounded to the nearest representable value on the way in. Add two of those rounded values and the result is a hair off, which is why 0.1 plus 0.2 in a double displays as 0.30000000000000004. This is not a database bug; it is identical in JavaScript, Python floats, and C doubles. The rule is: use numeric, or integer counts of the smallest unit like cents, for anything that must be exact and must reconcile, which is all money and financial and regulatory quantities. Use double precision for measured or estimated real-world values, like coordinates, sensor data, and statistics, where a relative error around ten to the minus sixteen is noise and speed matters.',
        aHi: 'numeric numbers ko base-ten digits ke roop mein store karता hai aur unpar arithmetic theek karता hai, to 0.1 plus 0.2 theek 0.3 hai aur ek million rows ka sum aakhri digit tak exact hai. Cost speed hai: ye ek digit string par software arithmetic hai, CPU ke native float se kई guna slower. double precision IEEE-754 64-bit binary floating point hai, bahut fast, par ye values ko binary fractions mein store karता hai. Zyaadatar decimal fractions, 0.1 aur 0.2 samet, ka koi finite binary representation nahi hai, to wo nearest representable value mein round hote hain. Do aisी rounded values jodो aur result ek baal off hai, isiliye ek double mein 0.1 plus 0.2 0.30000000000000004 dikhता hai. Niyam: numeric, ya cents jaise smallest unit ke integer counts, kisi bhi cheez ke liye jo exact honi chahिए. double precision measured real-world values ke liye.',
      },
      {
        q: 'What does casting a fractional value to `integer` do, and how does `round` differ between `numeric` and `float`?',
        qHi: 'Ek fractional value ko `integer` mein cast karna kya karता hai, aur `round` `numeric` aur `float` ke beech kaise alag hai?',
        a: 'Casting a fractional value to integer rounds it to the nearest whole number; it does not truncate. For a numeric input it rounds half away from zero, so 2.5 becomes 3, 3.5 becomes 4, and negative 2.5 becomes negative 3. People routinely assume the cast just drops the fraction like a C cast, and that assumption produces off-by-one bugs. If you actually want to discard the fractional part, use trunc, which chops toward zero, or floor to always go down or ceil to always go up. As for round itself, it behaves differently by type. On numeric, round uses round half away from zero, the schoolbook rule, which is what you want for money. On float, round uses round half to even, also called banker\'s rounding, so round of 0.5 as a float is 0, round of 1.5 is 2, and round of 2.5 is 2. That is deliberate for floating point because it reduces bias in long sums, but it surprises people. Also, round with a second argument for decimal places only exists for numeric. So the practical advice is to do money rounding in numeric, not float, so the rule is predictable and a two-argument round is available.',
        aHi: 'Ek fractional value ko integer mein cast karna ise nearest whole number mein round karता hai; ye truncate nahi karता. Ek numeric input ke liye ye half zero se door round karता hai, to 2.5 3 ban jaता hai, negative 2.5 negative 3. Log routinely maante hain ki cast bस fraction drop karता hai jaise ek C cast, aur wo assumption off-by-one bugs produce karता hai. Agar aap fractional part discard karna chahते ho, trunc istemal karo. round khud type se alag behave karता hai. numeric par, round half away from zero istemal karता hai. float par, round half to even ("banker\'s rounding") istemal karता hai, to ek float ke roop mein round of 2.5 2 hai. Do decimal places ke liye ek doosre argument waala round sirf numeric ke liye maujood hai.',
      },
    ],

    exercises: [
      {
        task: 'One `SELECT` computing `(0.1::numeric * 3)::text`, `(0.1::float8 * 3)::text`, `round(0.5)`, `round(0.5::float8)`, `round(1.5::float8)`, `2.7::int`, `trunc(2.7)`, `floor(-0.5)`. Predict each. Confirm numeric `0.1 * 3` is exactly `0.3` but the float version is `0.30000000000000004`, and float `round(0.5)` is `0` (even) while `round(1.5)` is `2`.',
        taskHi: 'Ek `SELECT` jo compute karता hai `(0.1::numeric * 3)::text`, `(0.1::float8 * 3)::text`, `round(0.5)`, `round(0.5::float8)`, `round(1.5::float8)`, `2.7::int`, `trunc(2.7)`, `floor(-0.5)`. Har ek predict karो.',
        hint: 'Numeric is exact; float `* 3` accumulates rounding. Float `round` is half-to-even: `0.5 -> 0`, `1.5 -> 2`, `2.5 -> 2`. `2.7::int` rounds to `3`; `trunc` gives `2`.',
        hintHi: 'Numeric exact hai; float `* 3` rounding accumulate karता hai. Float `round` half-to-even hai: `0.5 -> 0`, `1.5 -> 2`. `2.7::int` `3` mein round karता hai; `trunc` `2` deता hai.',
      },
      {
        task: 'Create `t(x smallint)` and run `INSERT INTO t VALUES (32767)` then `SELECT x + 1 FROM t`. Observe `ERROR: smallint out of range`. Then `SELECT (x::integer) + 1 FROM t` and confirm it works (`32768`). Write a comment: what would C do here, and why is the SQL behaviour safer?',
        taskHi: '`t(x smallint)` banao aur `INSERT INTO t VALUES (32767)` phir `SELECT x + 1 FROM t` chalao. `ERROR: smallint out of range` dekho. Phir `SELECT (x::integer) + 1 FROM t`.',
        hint: 'Casting `x` to `integer` before the arithmetic gives the expression room. C would silently wrap `32767 + 1` to `-32768`; SQL raises an error rather than producing a garbage negative number.',
        hintHi: '`x` ko arithmetic se pehle `integer` mein cast karna expression ko room deता hai. C `32767 + 1` ko chupchaap `-32768` mein wrap karega; SQL ek error raise karता hai.',
      },
      {
        task: 'Table `sale(amount_cents bigint)` with rows `199`, `2599`, `50`, `1000`. Compute the total and the average as proper dollar amounts: `sum(amount_cents)::numeric / 100` and `round(avg(amount_cents)::numeric / 100, 2)`. Confirm total `38.48` and average `9.62`. Note in a comment why you must not store `amount_cents` as `double precision`.',
        taskHi: 'Table `sale(amount_cents bigint)` rows `199`, `2599`, `50`, `1000` ke saath. Total aur average ko proper dollar amounts ke roop mein compute karो.',
        hint: '`sum` of a `bigint` column is `numeric`, so `/ 100` keeps the fraction; `round(..., 2)` for the average. `double precision` would make cent totals drift and reconciliation fail.',
        hintHi: 'Ek `bigint` column ka `sum` `numeric` hai, to `/ 100` fraction rakhता hai; average ke liye `round(..., 2)`. `double precision` cent totals ko drift karvाega.',
      },
    ],

    keyTakeaways: [
      '`numeric` / `numeric(p, s)` = EXACT base-10 decimal (`0.1 + 0.2` = `0.3`), but software arithmetic -> 5-20x slower than native float. `real`/`double precision` = IEEE-754 BINARY float -> very fast, HUGE range, but INEXACT (`0.1::float8 + 0.2::float8` = `0.30000000000000004` — same in JS/Python/C).',
      'MONEY / anything that must reconcile -> `numeric(p,s)` OR `bigint` cents (exact, fastest). NEVER `float` for currency/tax/interest — the error COMPOUNDS across rows. `float` is for measured/estimated real-world values (coords, sensors, stats) where the 15th digit is noise.',
      'INTEGER OVERFLOW = a hard ERROR (`integer out of range`), NOT C-style wrap-around. This is why `sum(integer)` returns `bigint` and `sum(bigint)` returns `numeric`. `avg(integer)` returns `numeric` (so `avg(1,2)` = `1.5`, exact).',
      'ROUNDING: `round()` on `numeric` = half AWAY from zero (`2.5`->`3`, `-2.5`->`-3`); `round()` on `float` = half to EVEN / banker\'s (`2.5::float8`->`2`, `3.5::float8`->`4`). `round(x, n)` (n decimal places) is `numeric`-ONLY. Do money rounding in `numeric`.',
      '`trunc(x)` chops toward zero (`trunc(-3.9)` = `-3`); `floor(x)` toward -inf (`floor(-3.1)` = `-4`); `ceil(x)` toward +inf. A CAST `x::integer` ROUNDS (not truncates!) — `3.9::int` = `4`. Use `trunc(x)::int` to chop.',
      '`numeric(p,s)` overflow: too many digits BEFORE the point -> `numeric field overflow` ERROR; too many AFTER -> rounded (`1.239::numeric(4,2)` = `1.24`). `x / 0`, `x % 0`, `div(x, 0)` -> `division by zero` ERROR -> guard with `x / NULLIF(y, 0)` -> `NULL`.',
      'MATH: `abs`/`sign`/`mod`/`power`(`^`)/`sqrt`/`exp`/`ln`, `log(x)` = base 10, `log(b, x)` = base b. `random()` -> `double` in `[0,1)`; `gen_random_uuid()` -> v4 UUID (no extension, PG13+). BOTH non-deterministic — never in example output; `WHERE random() < 0.1` re-evaluates PER ROW.',
      '`width_bucket(v, low, high, n)` -> which of n equal buckets over `[low, high)` (`0` below, `n+1` at/above high) — histograms. `generate_series(start, stop [, step])` -> a SET (one row per value) for ints/numeric/timestamps — generate test data, or LEFT JOIN it to fill gaps in a per-day report.',
    ],
    keyTakeawaysHi: [
      '`numeric` / `numeric(p, s)` = EXACT base-10 decimal, par software arithmetic -> native float se 5-20x slower. `real`/`double precision` = IEEE-754 BINARY float -> bahut fast, par INEXACT (`0.1::float8 + 0.2::float8` = `0.30000000000000004`).',
      'MONEY -> `numeric(p,s)` YA `bigint` cents (exact, fastest). Currency ke liye KABHI `float` nahi — error rows ke paar COMPOUND hoता hai. `float` measured values ke liye.',
      'INTEGER OVERFLOW = ek hard ERROR (`integer out of range`), C-style wrap NAHI. Isiliye `sum(integer)` `bigint` return karता hai. `avg(integer)` `numeric` return karता hai (`avg(1,2)` = `1.5`).',
      'ROUNDING: `numeric` par `round()` = half zero se DOOR; `float` par `round()` = half to EVEN / banker\'s (`2.5::float8`->`2`). `round(x, n)` sirf `numeric` ke liye. Money rounding `numeric` mein karो.',
      '`trunc(x)` zero ki taraf chop; `floor(x)` -inf ki taraf; `ceil(x)` +inf. Ek CAST `x::integer` ROUND karता hai (truncate NAHI!) — `3.9::int` = `4`. Chop ke liye `trunc(x)::int`.',
      '`numeric(p,s)` overflow: point se PEHLE bahut digits -> `numeric field overflow` ERROR; BAAD -> rounded. `x / 0` -> `division by zero` ERROR -> `x / NULLIF(y, 0)` se guard karो.',
      'MATH: `power`(`^`)/`sqrt`/`exp`/`ln`, `log(x)` = base 10, `log(b, x)` = base b. `random()` -> `[0,1)` mein `double`; `gen_random_uuid()`. DONO non-deterministic — kabhi example output mein nahi.',
      '`width_bucket(v, low, high, n)` -> histograms. `generate_series(start, stop [, step])` -> ek SET — test data generate karो, ya per-day report mein gaps bharने ke liye LEFT JOIN karो.',
    ],
  },

  {
    slug: 'sql-dates-times-and-intervals',
    title: 'Dates, Times & Intervals: `timestamptz`, `date_trunc`, `AT TIME ZONE`',
    titleHi: 'Dates, Times Aur Intervals: `timestamptz`, `date_trunc`, `AT TIME ZONE`',
    description: '`timestamptz` stores an absolute instant and is what you almost always want; `timestamp` (no tz) is a naive wall-clock reading with no anchor. `date + interval` clamps at month ends; `date - date` gives days; `date_trunc` and `extract` slice a timestamp; `AT TIME ZONE` converts between an instant and a local wall time.',
    descriptionHi: '`timestamptz` ek absolute instant store karta hai aur wo hai jo aap lगbhag hamesha chahते ho; `timestamp` (no tz) ek naive wall-clock reading hai bina anchor ke. `date + interval` month ends par clamp karता hai; `date - date` days deता hai; `date_trunc` aur `extract` ek timestamp slice karते hain; `AT TIME ZONE` ek instant aur ek local wall time ke beech convert karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A photo of a wall clock versus a note of an exact moment.** \`timestamp\` without a time zone is the photo: it shows "3:00" but you do not know *whose* 3:00 — Tokyo, London, New York are three different actual instants. Store two of these from two cities and you cannot tell which event happened first; subtract them and the answer is meaningless. \`timestamptz\` is the note: it records the one true instant (internally, seconds since an agreed reference in UTC), and *displaying* it in any city just shows that same instant translated to that city\'s clock. Two \`timestamptz\` values always compare and subtract correctly, no matter where they were recorded. **\`AT TIME ZONE\` is the translator both ways**: given the true instant, "what did the wall clock in Kolkata read?" — and given a wall-clock photo plus "this was Kolkata", "what true instant was that?". Almost every column you think of as "a time something happened" is the note, not the photo: use \`timestamptz\`.',
      hi: '**Ek wall clock ki photo bनाम ek exact moment ka note.** \`timestamp\` bina time zone ke photo hai: ye "3:00" dikhाता hai par aap nahi jaanते *kiska* 3:00 — Tokyo, London, New York teen alag actual instants hain. Do cities se do aisे store karो aur aap nahi bata sakte kaunsa event pehle hua; unhe subtract karो aur jawab meaningless hai. \`timestamptz\` note hai: ye ek true instant record karता hai (internally, UTC mein ek agreed reference se seconds), aur ise kisi bhi city mein *display* karna bस wahi instant us city ke clock mein translated dikhाता hai. Do \`timestamptz\` values hamesha sahi compare aur subtract karती hain. **\`AT TIME ZONE\` dono taraf ka translator hai**. Lगbhag har column jise aap "ek time jab kuch hua" samajhते ho note hai, photo nahi: \`timestamptz\` istemal karो.',
    },

    simple: `**The types**

\`\`\`
date            a calendar day, no time         '2026-06-15'
time            a wall-clock time, no date       '14:30:00'
timestamp       date + time, NO time zone        '2026-06-15 14:30:00'   (a "naive" reading)
timestamptz     an absolute instant             '2026-06-15 14:30:00+05:30'  <-- USE THIS
interval        a span of time                  '2 days 03:00:00'
\`\`\`

**Why \`timestamptz\` (almost) always**

\`\`\`sql
-- timestamptz stores the instant in UTC; input with an offset, display in the session TZ
SET TIME ZONE 'UTC';
SELECT timestamptz '2026-06-15 12:00:00-04';   -- 2026-06-15 16:00:00+00   (same instant, shown in UTC)

-- timestamp (no tz) has no anchor: two of them from different places cannot be compared
\`\`\`

**"Now" — several flavours**

\`\`\`sql
now()                    -- = transaction_timestamp(); SAME for the whole transaction
current_timestamp        -- same as now()
statement_timestamp()    -- start of the current statement
clock_timestamp()        -- the real wall clock, changes mid-statement  (non-deterministic)
current_date  current_time
\`\`\`

**Arithmetic**

\`\`\`sql
date '2026-06-15' + 10                     -- date + integer -> date 10 days later
date '2026-06-15' - date '2026-06-01'      -- 14      (integer days)
timestamptz '...' + interval '90 minutes'  -- an instant 90 min later
timestamptz '...' - timestamptz '...'      -- an interval (exact)
date '2026-01-31' + interval '1 month'     -- 2026-02-28   (CLAMPS to the last valid day)
\`\`\`

**\`age\` vs subtraction**

\`\`\`sql
age(a, b)          -- a "calendar" interval: '2 years 5 mons 5 days'   (human-readable)
a - b              -- an exact interval: '887 days'                     (for real math)
age(ts)            -- age(now(), ts) -- "how long ago"
\`\`\`

**Truncate and extract**

\`\`\`sql
date_trunc('month', ts)   -- first instant of ts's month     ('day','week','quarter','year','hour'...)
extract(year   FROM ts)   -- 2026
extract(isodow FROM ts)   -- 1..7, Monday = 1     (dow: 0..6, Sunday = 0)
extract(epoch  FROM ts)   -- Unix seconds (a double)
extract(epoch  FROM interval '1 hour')   -- 3600
\`\`\`

**Format and parse**

\`\`\`sql
to_char(ts, 'YYYY-MM-DD HH24:MI')     -- timestamp -> formatted text
to_timestamp('2026-06-05 09:07', 'YYYY-MM-DD HH24:MI')   -- text -> timestamptz
to_date('05/06/2026', 'DD/MM/YYYY')                       -- text -> date
\`\`\`

**Convert between an instant and a wall time**

\`\`\`sql
tstz_col AT TIME ZONE 'Asia/Kolkata'   -- timestamptz -> timestamp: "what did the IST clock read?"
ts_col   AT TIME ZONE 'Asia/Kolkata'   -- timestamp -> timestamptz: "this wall time was in IST; which instant?"
\`\`\`

**Date ranges — half-open (Module 1 recap)**

\`\`\`sql
WHERE created_at >= '2026-06-01' AND created_at < '2026-07-01'   -- all of June, no boundary bug
\`\`\``,

    simpleHi: `**Types**

\`\`\`
date            ek calendar day, no time         '2026-06-15'
time            ek wall-clock time, no date       '14:30:00'
timestamp       date + time, NO time zone        '2026-06-15 14:30:00'   (ek "naive" reading)
timestamptz     ek absolute instant             '2026-06-15 14:30:00+05:30'  <-- ISE ISTEMAL KARO
interval        time ka ek span                  '2 days 03:00:00'
\`\`\`

**\`timestamptz\` (lगbhag) hamesha kyun**

\`\`\`sql
SET TIME ZONE 'UTC';
SELECT timestamptz '2026-06-15 12:00:00-04';   -- 2026-06-15 16:00:00+00   (same instant, UTC mein)
-- timestamp (no tz) ka koi anchor nahi: alag jagahon se do compare nahi ho sakte
\`\`\`

**"Now" — kई flavours**

\`\`\`sql
now()                    -- = transaction_timestamp(); poore transaction ke liye SAME
statement_timestamp()    -- current statement ka start
clock_timestamp()        -- asli wall clock, mid-statement badalता hai (non-deterministic)
\`\`\`

**Arithmetic**

\`\`\`sql
date '2026-06-15' + 10                     -- date + integer -> 10 days baad
date '2026-06-15' - date '2026-06-01'      -- 14      (integer days)
timestamptz '...' - timestamptz '...'      -- ek interval (exact)
date '2026-01-31' + interval '1 month'     -- 2026-02-28   (aakhri valid din par CLAMP)
\`\`\`

**\`age\` vs subtraction**

\`\`\`sql
age(a, b)          -- ek "calendar" interval: '2 years 5 mons 5 days'   (human-readable)
a - b              -- ek exact interval: '887 days'                     (asli math ke liye)
\`\`\`

**Truncate aur extract**

\`\`\`sql
date_trunc('month', ts)   -- ts ke month ka pehla instant
extract(year   FROM ts)   -- 2026
extract(isodow FROM ts)   -- 1..7, Monday = 1
extract(epoch  FROM interval '1 hour')   -- 3600
\`\`\`

**Format aur parse**

\`\`\`sql
to_char(ts, 'YYYY-MM-DD HH24:MI')     -- timestamp -> formatted text
to_timestamp('2026-06-05 09:07', 'YYYY-MM-DD HH24:MI')   -- text -> timestamptz
\`\`\`

**Ek instant aur ek wall time ke beech convert karो**

\`\`\`sql
tstz_col AT TIME ZONE 'Asia/Kolkata'   -- timestamptz -> timestamp: "IST clock ne kya padhा?"
ts_col   AT TIME ZONE 'Asia/Kolkata'   -- timestamp -> timestamptz: "ye wall time IST mein tha; kaunsa instant?"
\`\`\`

**Date ranges — half-open (Module 1 recap)**

\`\`\`sql
WHERE created_at >= '2026-06-01' AND created_at < '2026-07-01'   -- poora June
\`\`\``,

    content: `## The four temporal types

- **\`date\`** — a calendar day: year, month, day. No time, no zone. Use for a birthday, a due date, a "business day" — anything where the time of day is genuinely not part of the fact.
- **\`time\`** (and \`time with time zone\`, which is nearly useless) — a wall-clock time with no date. Rare; usually a \`time\` is better modelled as an \`interval\` or a pair of \`timestamptz\`.
- **\`timestamp\`** (a.k.a. \`timestamp without time zone\`) — a date and a time, with **no time zone information**. It is a "naive" reading: \`2026-06-15 14:30:00\` with no indication of which 14:30 on Earth that is. PostgreSQL does no conversion on it — what you put in is what you get out.
- **\`timestamptz\`** (a.k.a. \`timestamp with time zone\`) — an **absolute instant**. Internally it is stored as microseconds since 2000-01-01 UTC. On **input**, a value with an offset (\`+05:30\`) or a zone is converted to UTC; a value without one is interpreted in the **session time zone** (\`SET TIME ZONE\`). On **output**, it is rendered in the session time zone. The stored value is always the same absolute point regardless of how it is displayed.

## Why \`timestamptz\` is (almost) always the right choice

The name is misleading — \`timestamptz\` does **not** store a time zone. It stores an instant. What it gives you:

- **Correct comparison and ordering** — two \`timestamptz\` values from different parts of the world sort by which actually happened first.
- **Correct subtraction** — \`a - b\` is the true elapsed interval.
- **Correct \`now()\`** — \`now()\` returns a \`timestamptz\`, so \`WHERE created_at > now() - interval '7 days'\` means the same thing everywhere.

A \`timestamp\` (no tz) gives you none of that: it is just a string of digits with no anchor. The only legitimate uses of \`timestamp\` without a zone are a genuinely zone-less concept (a recurring "09:00 local" alarm that should fire at 9am *wherever the user is*) or interop with a system that mandates it. **Default to \`timestamptz\` for every "when did this happen" column.**

Practical setup: run the database in \`UTC\` (\`timezone = 'UTC'\`), store \`timestamptz\`, and convert to the user's zone only in the application or with \`AT TIME ZONE\` at the presentation edge.

## \`interval\`

An \`interval\` is a span: some number of months, days, and seconds (kept as three separate fields, because "1 month" is not a fixed number of days). \`interval '1 year 2 months 3 days 04:05:06'\`. Arithmetic: \`interval + interval\`, \`interval * number\`, \`timestamptz +/- interval\`, \`date +/- interval\`.

\`justify_interval\`, \`justify_days\`, \`justify_hours\` normalise the fields (\`justify_hours(interval '36 hours')\` → \`1 day 12:00:00\`).

## Date and interval arithmetic

- \`date + integer\` → \`date\` (that many days later). \`date - integer\` → \`date\`.
- \`date - date\` → **\`integer\`** (number of days). *Not* an interval.
- \`timestamptz + interval\` / \`- interval\` → \`timestamptz\`.
- \`timestamptz - timestamptz\` → \`interval\` (exact, in days and seconds).
- **Month arithmetic clamps**: \`date '2026-01-31' + interval '1 month'\` is \`2026-02-28\` (February has no 31st). \`date '2026-03-31' - interval '1 month'\` is also \`2026-02-28\`. This is usually what you want, but note it is **not reversible**: \`(d + interval '1 month') - interval '1 month'\` can differ from \`d\`.
- Adding \`interval '1 day'\` vs \`interval '24 hours'\` differ across a DST boundary: \`1 day\` keeps the wall-clock time, \`24 hours\` adds exactly 86400 seconds.

## \`age()\` vs subtraction

- **\`age(a, b)\`** returns a **calendar interval** — "2 years, 5 months, 5 days" — computed by walking the calendar, so it is human-meaningful but the "days" component depends on the months involved. **\`age(ts)\`** is \`age(current_date, ts)\` — "how old / how long ago".
- **\`a - b\`** returns an **exact interval** in days and seconds — "887 days" — suitable for precise math (rates, SLAs, durations).

Use \`age\` for display ("account created 2 years ago"), subtraction for computation ("was this within 30 days").

## \`date_trunc\` and \`extract\`

- **\`date_trunc(field, ts)\`** — zero out everything finer than \`field\`. \`date_trunc('month', ts)\` → the first instant of that month; \`date_trunc('week', ts)\` → Monday 00:00 of that week; also \`'hour'\`, \`'day'\`, \`'quarter'\`, \`'year'\`, \`'decade'\`. **The truncation happens in the session time zone** (or an explicit third argument in PG16+: \`date_trunc('day', ts, 'Asia/Kolkata')\`) — a UTC database truncating a \`timestamptz\` gives UTC day boundaries, which may not be the user's day.
- **\`extract(field FROM source)\`** (or **\`date_part('field', source)\`**) — pull out one component as a number: \`year\`, \`month\`, \`day\`, \`hour\`, \`minute\`, \`second\`, \`dow\` (0=Sunday), \`isodow\` (1=Monday), \`doy\`, \`week\` (ISO week), \`quarter\`, \`epoch\` (seconds since 1970 for a timestamp, total seconds for an interval).

\`extract(epoch FROM interval '1 hour')\` is \`3600\` — the standard way to get an interval "in seconds".

## \`to_char\` / \`to_timestamp\` / \`to_date\`

- **\`to_char(ts, format)\`** — timestamp/date/interval → formatted text. Format codes: \`YYYY\` \`MM\` \`DD\` \`HH24\` \`MI\` \`SS\` \`Dy\` (Mon) \`Day\` (Monday) \`Mon\` \`Month\` \`TZ\` \`FM\` (trim padding). \`to_char(now(), 'FMDay, DD FMMonth YYYY')\`.
- **\`to_timestamp(text, format)\`** → \`timestamptz\`. **\`to_date(text, format)\`** → \`date\`. Use these to parse a non-ISO string (\`to_date('05/31/2026', 'MM/DD/YYYY')\`); ISO strings cast directly (\`'2026-05-31'::date\`).
- **\`to_timestamp(unix_seconds)\`** (one numeric argument) → \`timestamptz\` from an epoch.

## \`AT TIME ZONE\` — the two directions

\`AT TIME ZONE 'zone'\` flips between an absolute instant and a naive wall time:

- **\`timestamptz AT TIME ZONE 'zone'\`** → \`timestamp\` (no tz): "what did the wall clock in \`zone\` read at that instant?" \`(order_placed_at AT TIME ZONE 'Asia/Kolkata')\` gives the local time the customer saw.
- **\`timestamp AT TIME ZONE 'zone'\`** → \`timestamptz\`: "this naive wall time was in \`zone\` — which absolute instant is that?" Used when a source system hands you local times with a known zone.

## \`generate_series\` over time

\`generate_series(start_ts, stop_ts, step_interval)\` → one row per step. \`generate_series(date_trunc('day', :from), :to, interval '1 day')\` builds a row per day, which you \`LEFT JOIN\` to a fact table so a time-series report has no gaps.`,

    contentHi: `## Chaar temporal types

- **\`date\`** — ek calendar day. No time, no zone. Ek birthday, ek due date ke liye.
- **\`time\`** — ek wall-clock time bina date ke. Rare.
- **\`timestamp\`** (yani \`timestamp without time zone\`) — ek date aur ek time, **koi time zone information nahi**. Ek "naive" reading. PostgreSQL ispar koi conversion nahi karता.
- **\`timestamptz\`** (yani \`timestamp with time zone\`) — ek **absolute instant**. Internally microseconds since 2000-01-01 UTC. **Input** par, ek offset (\`+05:30\`) waali value UTC mein convert hoती hai; ek bina offset ki **session time zone** mein interpret hoती hai. **Output** par, ye session time zone mein render hoती hai.

## \`timestamptz\` (lगbhag) hamesha sahi choice kyun

Name misleading hai — \`timestamptz\` ek time zone **store nahi karता**. Ye ek instant store karता hai. Ye aapको deता hai:
- **Sahi comparison aur ordering** — duniya ke alag hisson se do \`timestamptz\` values us hisaab se sort hoती hain jо asal mein pehle hua.
- **Sahi subtraction** — \`a - b\` true elapsed interval hai.
- **Sahi \`now()\`** — \`now()\` ek \`timestamptz\` return karता hai.

Ek \`timestamp\` (no tz) aapको inme se kuch nahi deता. **Har "kab hua" column ke liye \`timestamptz\` default karो.** Setup: database \`UTC\` mein chalाओ, \`timestamptz\` store karो, user ke zone mein sirf application mein ya \`AT TIME ZONE\` se convert karो.

## \`interval\`

Ek \`interval\` ek span hai: kuch months, days, aur seconds (teen alag fields ke roop mein, kyunki "1 month" ek fixed number of days nahi hai). \`justify_hours(interval '36 hours')\` -> \`1 day 12:00:00\`.

## Date aur interval arithmetic

- \`date + integer\` -> \`date\`. \`date - date\` -> **\`integer\`** (days ki sankhya). Ek interval *nahi*.
- \`timestamptz - timestamptz\` -> \`interval\` (exact).
- **Month arithmetic clamp karता hai**: \`date '2026-01-31' + interval '1 month'\` \`2026-02-28\` hai. Ye **reversible nahi hai**.
- \`interval '1 day'\` vs \`interval '24 hours'\` ek DST boundary ke paar alag hain.

## \`age()\` vs subtraction

- **\`age(a, b)\`** ek **calendar interval** return karता hai — "2 years, 5 months, 5 days" — human-meaningful. **\`age(ts)\`** = \`age(current_date, ts)\`.
- **\`a - b\`** ek **exact interval** return karता hai — "887 days" — precise math ke liye.

Display ke liye \`age\`, computation ke liye subtraction.

## \`date_trunc\` aur \`extract\`

- **\`date_trunc(field, ts)\`** — \`field\` se finer sab zero out karो. **Truncation session time zone mein hoती hai** — ek UTC database ek \`timestamptz\` truncate karके UTC day boundaries deता hai.
- **\`extract(field FROM source)\`** — ek component ek number ke roop mein nikालो: \`year\`, \`isodow\` (1=Monday), \`epoch\`.

\`extract(epoch FROM interval '1 hour')\` \`3600\` hai.

## \`to_char\` / \`to_timestamp\` / \`to_date\`

- **\`to_char(ts, format)\`** — formatted text. Codes: \`YYYY MM DD HH24 MI SS Dy Mon FM\`.
- **\`to_timestamp(text, format)\`** / **\`to_date(text, format)\`** — ek non-ISO string parse karो.
- **\`to_timestamp(unix_seconds)\`** — ek epoch se \`timestamptz\`.

## \`AT TIME ZONE\` — do directions

- **\`timestamptz AT TIME ZONE 'zone'\`** -> \`timestamp\`: "us instant par \`zone\` mein wall clock ne kya padhा?"
- **\`timestamp AT TIME ZONE 'zone'\`** -> \`timestamptz\`: "ye naive wall time \`zone\` mein tha — kaunsa absolute instant?"

## \`generate_series\` time par

\`generate_series(start_ts, stop_ts, step_interval)\` -> prati step ek row. Ek per-day report mein gaps nahi ke liye ise ek fact table se \`LEFT JOIN\` karो.`,

    examples: [
      {
        title: 'timestamptz stores an instant; timestamp is a naive reading',
        titleHi: 'timestamptz ek instant store karta hai; timestamp ek naive reading hai',
        code: `SET TIME ZONE 'UTC';
SELECT
  (timestamptz '2026-06-15 12:00:00-04')::text AS aware,    -- converted to UTC: 16:00
  (timestamp   '2026-06-15 12:00:00')::text    AS naive,    -- stored verbatim: 12:00
  (date '2026-06-15')::text                    AS just_date,
  (timestamptz '2026-06-15 12:00:00-04'
     - timestamptz '2026-06-15 09:00:00-04')::text AS elapsed;   -- exact 3h`,
        output: ` aware                  | naive               | just_date  | elapsed
------------------------+---------------------+------------+----------
 2026-06-15 16:00:00+00 | 2026-06-15 12:00:00 | 2026-06-15 | 03:00:00
(1 row)`,
        explain: "`timestamptz '2026-06-15 12:00:00-04'` is stored as an absolute instant and, with the session in UTC, displays as `2026-06-15 16:00:00+00` — the same moment, four hours later on the UTC clock. `timestamp '2026-06-15 12:00:00'` has no zone, so it is stored and shown verbatim as `12:00`. Subtracting two `timestamptz` values gives the exact elapsed `interval`, `03:00:00`.",
        explainHi: "`timestamptz '2026-06-15 12:00:00-04'` ek absolute instant ke roop mein store hota hai aur, session UTC mein hone se, `2026-06-15 16:00:00+00` display hota hai — wahi moment, UTC clock par chaar ghante baad. `timestamp '2026-06-15 12:00:00'` ka koi zone nahi, to ye verbatim `12:00` store aur dikhाya jaता hai. Do `timestamptz` values subtract karna exact elapsed `interval` deता hai, `03:00:00`.",
      },
      {
        title: 'Date arithmetic: day math, month-end clamping, date - date',
        titleHi: 'Date arithmetic: day math, month-end clamping, date - date',
        code: `SET TIME ZONE 'UTC';
SELECT
  (date '2026-06-15' + 10)::text                   AS ten_days_on,      -- 2026-06-25
  (date '2026-06-15' - date '2026-06-01')          AS day_count,        -- 14  (integer)
  (date '2026-01-31' + interval '1 month')::text   AS jan31_plus_1mo,   -- 2026-02-28  (clamped)
  (date '2026-03-31' - interval '1 month')::text   AS mar31_minus_1mo;  -- 2026-02-28  (clamped)`,
        output: ` ten_days_on | day_count | jan31_plus_1mo      | mar31_minus_1mo
-------------+-----------+---------------------+---------------------
 2026-06-25  | 14        | 2026-02-28 00:00:00 | 2026-02-28 00:00:00
(1 row)`,
        explain: "`date '2026-06-15' + 10` adds 10 days -> `2026-06-25`. `date '2026-06-15' - date '2026-06-01'` returns the INTEGER `14`, a day count, not an interval. Adding `interval '1 month'` to `2026-01-31` lands on `2026-02-28` because February has no 31st — month arithmetic CLAMPS to the last valid day. Subtracting `1 month` from `2026-03-31` clamps the same way, also to `2026-02-28`.",
        explainHi: "`date '2026-06-15' + 10` 10 days jodता hai -> `2026-06-25`. `date '2026-06-15' - date '2026-06-01'` INTEGER `14` return karता hai, ek day count, ek interval nahi. `2026-01-31` mein `interval '1 month'` jodना `2026-02-28` par land karता hai kyunki February ka koi 31st nahi — month arithmetic aakhri valid din par CLAMP karता hai.",
      },
      {
        title: 'date_trunc, extract, and age vs exact subtraction',
        titleHi: 'date_trunc, extract, aur age vs exact subtraction',
        code: `SET TIME ZONE 'UTC';
SELECT
  date_trunc('quarter', timestamptz '2026-05-20 10:00:00+00')::text  AS quarter_start,  -- Apr 1
  extract(isodow FROM date '2026-06-15')                             AS mon_is_1,       -- 1
  extract(epoch  FROM interval '90 minutes')::int                    AS ninety_min_sec, -- 5400
  age(timestamptz '2026-06-15', timestamptz '2024-01-10')::text      AS calendar_age,   -- 2 years 5 mons 5 days
  (timestamptz '2026-06-15' - timestamptz '2024-01-10')::text        AS exact_span;     -- 887 days`,
        output: ` quarter_start          | mon_is_1 | ninety_min_sec | calendar_age          | exact_span
------------------------+----------+----------------+-----------------------+------------
 2026-04-01 00:00:00+00 | 1        | 5400           | 2 years 5 mons 5 days | 887 days
(1 row)`,
        explain: "`date_trunc('quarter', May 20)` returns the first instant of that quarter, `2026-04-01` (Q2 begins in April). `extract(isodow ...)` for a Monday is `1`. `extract(epoch FROM interval '90 minutes')` converts the span to seconds, `5400`. And `age(a, b)` gives a human calendar interval `2 years 5 mons 5 days`, while `a - b` gives the exact `887 days` — same span, two representations, one for display and one for math.",
        explainHi: "`date_trunc('quarter', May 20)` us quarter ka pehla instant return karता hai, `2026-04-01` (Q2 April mein shuru hoता hai). Monday ke liye `extract(isodow ...)` `1` hai. `extract(epoch FROM interval '90 minutes')` span ko seconds mein convert karता hai, `5400`. `age(a, b)` ek human calendar interval `2 years 5 mons 5 days` deता hai, jabki `a - b` exact `887 days` deता hai.",
      },
      {
        title: 'AT TIME ZONE both directions; generate_series over months',
        titleHi: 'AT TIME ZONE dono directions; months par generate_series',
        code: `SET TIME ZONE 'UTC';
SELECT
  (timestamptz '2026-06-15 12:00:00+00' AT TIME ZONE 'Asia/Kolkata')::text AS ist_wall_clock,   -- 17:30
  (timestamp   '2026-06-15 12:00:00'    AT TIME ZONE 'Asia/Kolkata')::text AS instant_from_ist; -- 06:30 UTC

SELECT to_char(d, 'YYYY-MM') AS month
FROM generate_series(date '2026-01-01', date '2026-04-01', interval '1 month') AS d;`,
        output: ` ist_wall_clock      | instant_from_ist
---------------------+------------------------
 2026-06-15 17:30:00 | 2026-06-15 06:30:00+00
(1 row)

 month
---------
 2026-01
 2026-02
 2026-03
 2026-04
(4 rows)`,
        explain: "`timestamptz '2026-06-15 12:00:00+00' AT TIME ZONE 'Asia/Kolkata'` converts the instant to the wall clock in Kolkata, `17:30` (a plain `timestamp`). Going the other way, `timestamp '2026-06-15 12:00:00' AT TIME ZONE 'Asia/Kolkata'` interprets that naive `12:00` as being IST and returns the corresponding absolute instant, `06:30 UTC`. `generate_series(..., interval '1 month')` yields one row per month.",
        explainHi: "`timestamptz '2026-06-15 12:00:00+00' AT TIME ZONE 'Asia/Kolkata'` instant ko Kolkata ke wall clock mein convert karता hai, `17:30`. Doosri taraf jaते hue, `timestamp '2026-06-15 12:00:00' AT TIME ZONE 'Asia/Kolkata'` us naive `12:00` ko IST maankar corresponding absolute instant return karता hai, `06:30 UTC`. `generate_series(..., interval '1 month')` prati month ek row deता hai.",
      },
    ],

    mistakes: [
      {
        wrong: `CREATE TABLE event (id serial, occurred_at timestamp);   -- no time zone
-- app in Mumbai inserts local time, app in NYC inserts local time,
-- ORDER BY occurred_at is now meaningless, and "occurred_at > now() - interval '1 hour'"
-- compares a naive value to a timestamptz -> implicit, wrong conversion`,
        right: `CREATE TABLE event (id serial, occurred_at timestamptz NOT NULL DEFAULT now());
-- every insert records the true instant; ordering, subtraction, and now() comparisons all work.
-- run the DB in UTC; convert to the viewer's zone with AT TIME ZONE at display time.`,
        why: 'timestamp without time zone stores a wall-clock reading with no anchor, so two rows written from different time zones cannot be compared or ordered correctly, and the elapsed time between them is wrong. It also mixes badly with now(), which is a timestamptz: PostgreSQL will implicitly convert the naive value using the session time zone, which is rarely the zone it was actually written in, so the comparison is silently off. Use timestamptz for every column that records when something happened. It stores an absolute instant, so ordering, subtraction, and comparison against now() are all correct regardless of where the row was created; you only deal with zones at the presentation edge.',
        whyHi: 'timestamp without time zone ek wall-clock reading store karता hai bina anchor ke, to alag time zones se likhी do rows sahi compare ya order nahi ho sakti. Ye now() ke saath bhi bura mix karता hai, jo ek timestamptz hai: PostgreSQL naive value ko session time zone se implicitly convert karega, jo shायद hi wo zone hai jismें ye asal mein likha gaya. Har column ke liye timestamptz istemal karो jо record karता hai kab kuch hua.',
      },
      {
        wrong: `-- "orders in June 2026"
SELECT count(*) FROM orders
WHERE occurred_at BETWEEN '2026-06-01' AND '2026-06-30';
-- misses everything on June 30 after 00:00:00 -- BETWEEN is inclusive and the date is midnight`,
        right: `SELECT count(*) FROM orders
WHERE occurred_at >= '2026-06-01'
  AND occurred_at <  '2026-07-01';   -- half-open: every instant in June, no boundary bug`,
        why: 'BETWEEN is inclusive on both ends, and a bare date literal is midnight, so BETWEEN start AND 2026-06-30 stops at the first instant of June 30 and drops the other 23-plus hours. The correct pattern for any timestamp range is half-open: greater-or-equal the start and strictly less than the day after the end. It captures every instant in the period, it does not depend on the column\'s precision, and consecutive periods tile perfectly, so a "this month" and "last month" comparison never double-counts or misses a boundary row. This is the same rule from Module 1, and it comes up constantly in reporting.',
        whyHi: 'BETWEEN dono ends par inclusive hai, aur ek bare date literal midnight hai, to BETWEEN start AND 2026-06-30 June 30 ke pehle instant par ruk jaता hai aur us din ke doosre 23-plus ghante drop kar deता hai. Kisi bhi timestamp range ke liye sahi pattern half-open hai: start se greater-or-equal aur end ke agle din se strictly less.',
      },
      {
        wrong: `-- "group revenue by day" for a US business, DB running in UTC
SELECT date_trunc('day', occurred_at) AS day, sum(amount)
FROM orders GROUP BY 1;
-- buckets are UTC days -- an order at 8pm New York time lands in the NEXT UTC day`,
        right: `SELECT date_trunc('day', occurred_at AT TIME ZONE 'America/New_York') AS local_day,
       sum(amount)
FROM orders
GROUP BY 1;
-- or PG16+: date_trunc('day', occurred_at, 'America/New_York')`,
        why: 'date_trunc on a timestamptz truncates in the session time zone, and a database run in UTC therefore produces UTC day boundaries. For a business that thinks in local days, an order placed at 8pm Eastern is 1am the next day UTC, so it is counted on the wrong day and the daily totals are shifted. Convert to the business time zone first, either with AT TIME ZONE before the truncation or, in PostgreSQL 16 and later, by passing the zone as a third argument to date_trunc. Storing in UTC is still correct; the zone only enters at the point where you decide what "a day" means for this report.',
        whyHi: 'ek timestamptz par date_trunc session time zone mein truncate karता hai, aur UTC mein chalाya ek database isliye UTC day boundaries produce karता hai. Ek business ke liye jо local days mein sochता hai, 8pm Eastern par diya ek order UTC ke agle din 1am hai, to ise galat din par count kiya jaता hai. Pehle business time zone mein convert karो, ya to truncation se pehle AT TIME ZONE ke saath ya PG16+ mein date_trunc ko teesre argument ke roop mein zone pass karके.',
      },
    ],

    realWorld: [
      {
        en: '**Database `timezone = \'UTC\'`, every "when" column `timestamptz NOT NULL DEFAULT now()`, and all display conversion via `AT TIME ZONE user.tz` in the API layer** — a single, well-understood rule that eliminates an entire class of off-by-hours bugs.',
        hi: '**Database `timezone = \'UTC\'`, har "when" column `timestamptz NOT NULL DEFAULT now()`** — ek single rule jo off-by-hours bugs ki ek poori class hataता hai.',
      },
      {
        en: '**`generate_series(date_trunc(\'day\', :from), :to, \'1 day\')::date` LEFT JOINed to the events table** so the daily-signups chart shows every day, with `0` where there were no signups instead of a missing bar.',
        hi: '**`generate_series(...)::date` events table se LEFT JOINed** taaki daily-signups chart har din dikhाe.',
      },
      {
        en: '**Half-open ranges computed as `date_trunc(\'month\', now())` and `date_trunc(\'month\', now()) + interval \'1 month\'`** for every "this month" / "last month" KPI, so adjacent periods never overlap or gap.',
        hi: '**Half-open ranges `date_trunc(\'month\', now())` ... ke roop mein compute** har "is mahine" KPI ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `timestamp` and `timestamptz`, and which should you use?',
        qHi: '`timestamp` aur `timestamptz` mein kya antar hai, aur aapko kaunsa istemal karna chahिए?',
        a: 'timestamp without time zone stores a date and a time as written, with no anchor to an actual moment. 2026-06-15 14:30 in that column could be Tokyo, London, or New York time, which are three different instants, and PostgreSQL does no conversion, it just stores and returns the digits. timestamptz, despite the name, does not store a time zone either. It stores an absolute instant, internally as microseconds from a fixed reference in UTC. On input, a value with an offset is converted to that instant, and a value without one is interpreted in the session time zone. On output, the instant is rendered in the session time zone. So the same timestamptz value always represents the same moment no matter how it is displayed. The consequence is that two timestamptz values compare, order, and subtract correctly regardless of where they were recorded, and now() returns a timestamptz so a where clause like created_at greater than now minus seven days means the same thing globally. A timestamp without a zone gives you none of that. So the default for any column that records when something happened is timestamptz. Run the database in UTC, store timestamptz, and convert to a user\'s local zone only at the presentation edge, with AT TIME ZONE or in the application. The rare legitimate use of a zone-less timestamp is a genuinely local concept, like a 9am alarm that should fire at 9 wherever the user is.',
        aHi: 'timestamp without time zone ek date aur time ko jaise likha waise store karता hai, bina kisi actual moment ke anchor ke. Us column mein 2026-06-15 14:30 Tokyo, London, ya New York time ho sakta hai, jo teen alag instants hain, aur PostgreSQL koi conversion nahi karता. timestamptz, name ke bavजूद, ek time zone bhi store nahi karता. Ye ek absolute instant store karता hai, internally UTC mein ek fixed reference se microseconds. Input par, ek offset waali value us instant mein convert hoती hai, aur ek bina offset ki session time zone mein interpret hoती hai. Output par, instant session time zone mein render hoता hai. To wahi timestamptz value hamesha wahi moment represent karती hai. Natija ye hai ki do timestamptz values sahi compare, order, aur subtract karती hain chahे wo kahin bhi record ki gayi hon. To har column ke liye default jо record karता hai kab kuch hua timestamptz hai. Database UTC mein chalाओ.',
      },
      {
        q: 'How does month arithmetic behave with `date + interval`, and how do `age()` and subtraction differ?',
        qHi: '`date + interval` ke saath month arithmetic kaise behave karता hai, aur `age()` aur subtraction kaise alag hain?',
        a: 'Adding an interval of months to a date walks the calendar by that many months and then clamps to the last valid day if the target month is shorter. So January 31 plus one month is February 28, not some rolled-over date in March, and March 31 minus one month is also February 28. This is usually the intuitive result, but it is not reversible: adding a month and then subtracting a month can land you on a different day than you started, because the clamp lost information. Also, adding one day versus twenty-four hours differ across a daylight-saving boundary, one keeps the wall-clock time and the other adds exactly 86400 seconds. As for the two ways to get a duration: age of a and b returns a calendar interval, expressed as years, months, and days by walking the calendar, so it reads naturally as two years five months five days, and age of a single timestamp is age relative to the current date, meaning how long ago. Subtraction, a minus b, returns an exact interval measured in days and seconds, like 887 days, with no calendar interpretation. Use age for human display, like account created two years ago, and use subtraction for precise computation, like checking whether something happened within the last 30 days or computing a rate.',
        aHi: 'Ek date mein months ka ek interval add karna calendar ko utne months walk karता hai aur phir aakhri valid din par clamp karता hai agar target month chhota hai. To January 31 plus ek month February 28 hai, aur March 31 minus ek month bhi February 28. Ye aam taur par intuitive result hai, par ye reversible nahi hai. Ek din vs chaubees ghante ek daylight-saving boundary ke paar alag hain. Duration paane ke do tareekon ke baare mein: age of a aur b ek calendar interval return karता hai, years, months, aur days ke roop mein, to ye "do saal paanch mahine paanch din" ke roop mein naturally padhता hai. Subtraction, a minus b, ek exact interval return karता hai days aur seconds mein, jaise 887 days. Human display ke liye age istemal karो, precise computation ke liye subtraction.',
      },
    ],

    exercises: [
      {
        task: 'With `SET TIME ZONE \'UTC\';`, one `SELECT` computing (all cast `::text`): `timestamptz \'2026-11-01 09:00:00+05:30\'`, `date \'2026-01-31\' + interval \'1 month\'`, `date \'2026-05-15\' - date \'2026-04-20\'`, `extract(epoch FROM interval \'1 day\')`. Confirm the first shows `03:30:00+00`, the clamp gives `2026-02-28`, the date diff is `25`, and a day is `86400` seconds.',
        taskHi: '`SET TIME ZONE \'UTC\';` ke saath, ek `SELECT` (sab `::text` cast): `timestamptz \'2026-11-01 09:00:00+05:30\'`, `date \'2026-01-31\' + interval \'1 month\'`, `date \'2026-05-15\' - date \'2026-04-20\'`, `extract(epoch FROM interval \'1 day\')`.',
        hint: '`09:00 +05:30` is `03:30 UTC`. Jan 31 + 1 month clamps to Feb 28. `date - date` is an integer count of days.',
        hintHi: '`09:00 +05:30` `03:30 UTC` hai. Jan 31 + 1 month Feb 28 par clamp. `date - date` ek integer days count hai.',
      },
      {
        task: 'Table `login(user_id int, at timestamptz)` with a few rows across two days. Write a query grouping logins per calendar day IN `\'Asia/Kolkata\'`, using `date_trunc(\'day\', at AT TIME ZONE \'Asia/Kolkata\')`. Then run it again with plain `date_trunc(\'day\', at)` (UTC) and note that a late-evening IST login moves to the previous day.',
        taskHi: 'Table `login(user_id int, at timestamptz)`. Ek query likho jo `\'Asia/Kolkata\'` mein prati calendar day logins group karती hai. Phir plain `date_trunc(\'day\', at)` (UTC) ke saath phir chalाओ.',
        hint: '`at AT TIME ZONE \'Asia/Kolkata\'` converts the instant to the IST wall clock (a plain `timestamp`), then `date_trunc(\'day\', ...)` buckets by IST midnight. Without it you bucket by UTC midnight.',
        hintHi: '`at AT TIME ZONE \'Asia/Kolkata\'` instant ko IST wall clock mein convert karता hai, phir `date_trunc(\'day\', ...)` IST midnight se bucket karता hai.',
      },
      {
        task: 'Table `signup(created_at timestamptz)` with rows on Jan 2, Jan 2, Jan 5. Use `generate_series(date \'2026-01-01\', date \'2026-01-06\', \'1 day\')` LEFT JOINed to a per-day count so the result has a row for EVERY day Jan 1-6, showing `0` for Jan 1, 3, 4, 6 and the real counts for Jan 2 (2) and Jan 5 (1).',
        taskHi: 'Table `signup(created_at timestamptz)`. `generate_series(...)` ko ek per-day count se LEFT JOIN karो taaki result mein Jan 1-6 ke HAR din ke liye ek row ho, `0` dikhाte hue jahaan koi signup nahi.',
        hint: '`SELECT d::date, count(s.created_at) FROM generate_series(...) d LEFT JOIN signup s ON s.created_at >= d AND s.created_at < d + interval \'1 day\' GROUP BY 1 ORDER BY 1`. `count(s.created_at)` (not `count(*)`) gives `0` for the no-match days.',
        hintHi: '`generate_series` d ko `signup` se LEFT JOIN karो `s.created_at >= d AND s.created_at < d + interval \'1 day\'` par. `count(s.created_at)` no-match days ke liye `0` deता hai.',
      },
    ],

    keyTakeaways: [
      'TYPES: `date` (calendar day, no time), `time` (wall time, no date — rare), `timestamp` = NAIVE reading, NO anchor (`2026-06-15 14:30` — whose 14:30?), `timestamptz` = ABSOLUTE INSTANT (stored as UTC microseconds; input converted from its offset / session TZ, output rendered in session TZ). `interval` = a span (months + days + seconds, kept separate).',
      '`timestamptz` does NOT store a zone — it stores an instant. DEFAULT to `timestamptz` for EVERY "when did this happen" column: correct ordering, correct subtraction, correct `now()` comparison regardless of where the row was written. `timestamp` (no tz) gives you NONE of that + mixes badly with `now()` (implicit wrong conversion). Run the DB in UTC; convert at the presentation edge.',
      '"NOW": `now()` === `transaction_timestamp()` === `current_timestamp` — SAME for the whole transaction. `statement_timestamp()` = current statement start. `clock_timestamp()` = real wall clock, changes mid-statement (non-deterministic).',
      'ARITHMETIC: `date + int` -> `date`; `date - date` -> `integer` DAYS (not an interval!); `timestamptz +/- interval` -> `timestamptz`; `timestamptz - timestamptz` -> exact `interval`. MONTH math CLAMPS: `date \'2026-01-31\' + interval \'1 month\'` = `2026-02-28` (NOT reversible). `interval \'1 day\'` != `interval \'24 hours\'` across a DST boundary.',
      '`age(a, b)` = CALENDAR interval ("2 years 5 mons 5 days", human-readable); `a - b` = EXACT interval ("887 days", for math). `age(ts)` = `age(current_date, ts)` = "how long ago". Use `age` for display, subtraction for computation.',
      '`date_trunc(field, ts)` zeroes everything finer than `field` (`\'day\'`/`\'week\'`(Mon)/`\'month\'`/`\'quarter\'`/`\'year\'`/`\'hour\'`) — IN THE SESSION TZ. A UTC DB truncating a `timestamptz` gives UTC day boundaries -> convert first: `date_trunc(\'day\', ts AT TIME ZONE \'zone\')` (or PG16+ 3rd arg). `extract(field FROM src)` -> a number: `year`/`isodow`(Mon=1)/`dow`(Sun=0)/`week`(ISO)/`epoch`.',
      '`extract(epoch FROM interval \'1 hour\')` = `3600` — the way to get an interval "in seconds". `to_char(ts, fmt)` -> text (`YYYY MM DD HH24 MI SS Dy Mon FM`); `to_timestamp(text, fmt)` / `to_date(text, fmt)` parse a NON-ISO string (ISO casts directly); `to_timestamp(unix_seconds)` from an epoch.',
      '`AT TIME ZONE \'zone\'` FLIPS: `timestamptz AT TIME ZONE \'z\'` -> `timestamp` ("what did the wall clock in z read?"); `timestamp AT TIME ZONE \'z\'` -> `timestamptz` ("this wall time was in z; which instant?"). DATE RANGES: half-open `>= start AND < end` — NEVER `BETWEEN` for timestamps (inclusive + midnight = drops the last day). `generate_series(start_ts, stop_ts, step_interval)` + `LEFT JOIN` to fill gaps in a time-series report.',
    ],
    keyTakeawaysHi: [
      'TYPES: `date` (calendar day), `timestamp` = NAIVE reading, KOI anchor NAHI, `timestamptz` = ABSOLUTE INSTANT (UTC microseconds ke roop mein stored). `interval` = ek span.',
      '`timestamptz` ek zone store NAHI karता — ek instant store karता hai. HAR "kab hua" column ke liye `timestamptz` DEFAULT karो: sahi ordering, subtraction, `now()` comparison. `timestamp` (no tz) inme se KUCH NAHI deता + `now()` ke saath bura mix. DB UTC mein chalाओ.',
      '"NOW": `now()` === `transaction_timestamp()` — poore transaction ke liye SAME. `clock_timestamp()` = asli wall clock, mid-statement badalता hai.',
      'ARITHMETIC: `date + int` -> `date`; `date - date` -> `integer` DAYS (interval NAHI!); `timestamptz - timestamptz` -> exact `interval`. MONTH math CLAMP karता hai: `date \'2026-01-31\' + interval \'1 month\'` = `2026-02-28`. `interval \'1 day\'` != `\'24 hours\'` ek DST boundary ke paar.',
      '`age(a, b)` = CALENDAR interval (human-readable); `a - b` = EXACT interval (math ke liye). Display ke liye `age`, computation ke liye subtraction.',
      '`date_trunc(field, ts)` `field` se finer sab zero karता hai — SESSION TZ MEIN. Ek UTC DB `timestamptz` truncate karके UTC day boundaries deता hai -> pehle convert karो: `date_trunc(\'day\', ts AT TIME ZONE \'zone\')`. `extract(field FROM src)` -> ek number: `isodow`(Mon=1)/`epoch`.',
      '`extract(epoch FROM interval \'1 hour\')` = `3600`. `to_char(ts, fmt)` -> text; `to_timestamp(text, fmt)` / `to_date(text, fmt)` ek NON-ISO string parse karते hain.',
      '`AT TIME ZONE \'zone\'` FLIP karता hai: `timestamptz AT TIME ZONE \'z\'` -> `timestamp`; `timestamp AT TIME ZONE \'z\'` -> `timestamptz`. DATE RANGES: half-open `>= start AND < end` — timestamps ke liye KABHI `BETWEEN` nahi. `generate_series(...)` + `LEFT JOIN` gaps bharने ke liye.',
    ],
  },
];

