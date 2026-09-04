/**
 * Databases Complete Course — Module 1: The Relational Model & SELECT Basics, lessons 1-3.
 *
 * Lesson 1: the relational model — tables / rows / columns, data types (integer, text,
 *           numeric, boolean, date, timestamp), NULL, the schema, CREATE TABLE + INSERT,
 *           a first SELECT. PostgreSQL-first.
 * Lesson 2: projection — SELECT col-list vs SELECT *, column aliases (AS), expressions and
 *           computed columns in the select list, literals, DISTINCT (and DISTINCT over
 *           multiple columns).
 * Lesson 3: filtering with WHERE — comparison operators, AND / OR / NOT and their
 *           precedence (the "or without parens" trap), BETWEEN, IN, and how WHERE runs
 *           before SELECT.
 *
 * Conventions:
 *  - Each example `code` is a self-contained SQL script (CREATE + INSERT + the query).
 *  - `output` is the psql-style table(s) the verify harness renders: header, a
 *    "----+----" separator, left-aligned values, `NULL` for null, `t`/`f` for booleans,
 *    and a `(N rows)` footer. Multiple result statements are separated by a blank line.
 *  - Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 1
 *  - Backticks inside simple/simpleHi/content/contentHi are \`. Prose fields are
 *    single-quoted -> never put a literal SQL string ('x') in them unescaped; keep SQL
 *    snippets in the backtick fields.
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_1: CourseLesson[] = [
  {
    slug: 'sql-relational-model-and-tables',
    title: 'The Relational Model: Tables, Rows, Types & `NULL`',
    titleHi: 'Relational Model: Tables, Rows, Types & `NULL`',
    description: 'A relational database stores data in **tables** — a fixed set of typed **columns**, and any number of **rows**. That is the whole model. Everything else in SQL — joins, aggregates, windows — is a way of asking questions against tables. This lesson builds one and reads it back.',
    descriptionHi: 'Ek relational database data ko **tables** mein store karta hai — typed **columns** ka ek fixed set, aur kितni bhi **rows**. Yahi poora model hai. SQL mein baaki sab kuch — joins, aggregates, windows — tables ke against sawaal poochne ka ek tareeka hai. Ye lesson ek banata hai aur ise wapas padhता hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: '**A filing cabinet of identical forms.** A table is one drawer. Every sheet in that drawer is the *same blank form* — the same labelled boxes in the same order: "Title", "Author", "Year", "Price". That fixed set of boxes is the **columns**, and the form design (which boxes exist, and what kind of thing goes in each — a number, some text, a yes/no) is the **schema**. Each filled-in sheet is a **row**. A box left blank because the information is genuinely not known — the author of an anonymous work — is **`NULL`**: not zero, not an empty string, but "no value here". You do not rearrange the boxes per sheet, you do not add a box to one sheet only, and you do not put a paragraph where a year should go — the form is the contract, and every row honours it. SQL is the language for pulling sheets out of drawers by their contents.',
      hi: '**Ek filing cabinet jismें identical forms hain.** Ek table ek drawer hai. Us drawer mein har sheet *wahi blank form* hai — wahi labelled boxes usi order mein: "Title", "Author", "Year", "Price". Boxes ka wo fixed set **columns** hai, aur form design (kaunse boxes hain, aur har ek mein kis tarah ki cheez jaati hai — ek number, kuch text, ek yes/no) **schema** hai. Har bhari hui sheet ek **row** hai. Ek box jo isliye blank chhoड़ा gaya kyunki information sach mein pata nahi — ek anonymous kaam ka author — **`NULL`** hai: zero nahi, empty string nahi, par "yahaan koi value nahi". Aap prati sheet boxes rearrange nahi karte, aap sirf ek sheet mein ek box add nahi karte, aur aap ek year ki jagah ek paragraph nahi daalте — form contract hai, aur har row ise nibhaती hai. SQL drawers se sheets unke contents se nikaalne ki bhasha hai.',
    },

    simple: `**A table = typed columns + rows**

\`\`\`sql
CREATE TABLE book (
  id       integer  PRIMARY KEY,   -- a whole number; the unique identifier for the row
  title    text     NOT NULL,      -- variable-length string; NOT NULL = must be provided
  author   text,                   -- nullable: may be unknown
  year     integer,
  price    numeric(6,2),           -- exact decimal: up to 6 digits, 2 after the point
  in_print boolean                 -- true / false / NULL
);
\`\`\`

**Put rows in with \`INSERT\`**

\`\`\`sql
INSERT INTO book (id, title, author, year, price, in_print) VALUES
  (1, 'The Pragmatic Programmer', 'Hunt & Thomas', 1999, 39.99, true),
  (2, 'SQL Antipatterns',         'Karwin',        2010, 34.95, true),
  (4, 'Out of Print Classic',      NULL,           1977, NULL,  false);
\`\`\`

\`\`\`
string literals use SINGLE quotes:  'Karwin'      ("double quotes" mean an identifier)
NULL is a keyword, never quoted:    NULL          (means "unknown / no value")
a missing column in the INSERT gets its DEFAULT (or NULL if none)
\`\`\`

**Read it back with \`SELECT\`**

\`\`\`sql
SELECT * FROM book;                 -- every column, every row (order not guaranteed)
SELECT title, year FROM book;       -- just these columns
\`\`\`

**The common PostgreSQL types**

\`\`\`
integer / bigint        whole numbers        int, int8
numeric(p,s) / decimal  exact decimals       money, precise math -- NOT float for currency
real / double precision approximate floats   scientific, not currency
text / varchar(n)       strings              text is the Postgres default; varchar(n) caps length
boolean                 true / false / NULL
date                    a calendar day        2026-01-15
timestamptz             an instant in time    prefer over "timestamp" (no zone) for real apps
uuid, json / jsonb, arrays, ...               (later modules)
\`\`\`

**\`NULL\` is not a value — it is the absence of one**

\`\`\`
NULL  !=  0
NULL  !=  ''       (empty string)
NULL  !=  NULL     (two unknowns are not "equal")   -- Lesson 4
\`\`\``,

    simpleHi: `**Ek table = typed columns + rows**

\`\`\`sql
CREATE TABLE book (
  id       integer  PRIMARY KEY,   -- ek poora number; row ke liye unique identifier
  title    text     NOT NULL,      -- variable-length string; NOT NULL = dena zaroori
  author   text,                   -- nullable: unknown ho sakta hai
  year     integer,
  price    numeric(6,2),           -- exact decimal: 6 digits tak, point ke baad 2
  in_print boolean                 -- true / false / NULL
);
\`\`\`

**\`INSERT\` se rows daalो**

\`\`\`sql
INSERT INTO book (id, title, author, year, price, in_print) VALUES
  (1, 'The Pragmatic Programmer', 'Hunt & Thomas', 1999, 39.99, true),
  (2, 'SQL Antipatterns',         'Karwin',        2010, 34.95, true),
  (4, 'Out of Print Classic',      NULL,           1977, NULL,  false);
\`\`\`

\`\`\`
string literals SINGLE quotes istemal karte hain:  'Karwin'   ("double quotes" ek identifier hai)
NULL ek keyword hai, kabhi quoted nahi:            NULL       (matlab "unknown / no value")
INSERT mein ek missing column iska DEFAULT paata hai (ya NULL agar koi nahi)
\`\`\`

**\`SELECT\` se wapas padhो**

\`\`\`sql
SELECT * FROM book;                 -- har column, har row (order guaranteed nahi)
SELECT title, year FROM book;       -- sirf ye columns
\`\`\`

**Aam PostgreSQL types**

\`\`\`
integer / bigint        poore numbers        int, int8
numeric(p,s) / decimal  exact decimals       money, precise math -- currency ke liye float NAHI
real / double precision approximate floats   scientific, currency nahi
boolean                 true / false / NULL
date                    ek calendar din       2026-01-15
timestamptz             samay mein ek instant  real apps ke liye "timestamp" (no zone) se behtar
uuid, json / jsonb, arrays, ...               (baad ke modules)
\`\`\`

**\`NULL\` ek value nahi hai — ye ek ki anupस्थिति hai**

\`\`\`
NULL  !=  0
NULL  !=  ''       (empty string)
NULL  !=  NULL     (do unknowns "barabar" nahi hain)   -- Lesson 4
\`\`\``,

    content: `## The model

A **relational database** is, at its core, a collection of **tables** (also called *relations*). A table has:

- a **name** (\`book\`, \`customer\`, \`order_line\`),
- a fixed, ordered list of **columns**, each with a **name** and a **data type**,
- zero or more **rows** (also called *tuples* or *records*), where each row has exactly one value — possibly \`NULL\` — for every column.

That is the entire data model. There are no nested objects, no documents, no pointers you dereference. Complex data is represented as *more tables* linked by shared values (Module 3, joins). The power of SQL is that this uniform shape lets one small language — \`SELECT ... FROM ... WHERE ...\` — answer an enormous range of questions.

**PostgreSQL** is the SQL database this course teaches against. Most of what you learn is standard SQL and transfers to MySQL, SQL Server, Oracle, and SQLite; where Postgres differs or offers something better, the lesson says so.

## The schema

The **schema** is the definition of your tables: which tables exist, their columns, the types, and the rules (constraints — Module 7). You create it with **DDL** (Data Definition Language): \`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`. You change the *data* with **DML** (Data Manipulation Language): \`INSERT\`, \`UPDATE\`, \`DELETE\`, and \`SELECT\` to read.

\`\`\`sql
CREATE TABLE book (
  id       integer       PRIMARY KEY,
  title    text          NOT NULL,
  author   text,
  year     integer,
  price    numeric(6,2),
  in_print boolean       DEFAULT true
);
\`\`\`

- **\`PRIMARY KEY\`** — this column uniquely identifies a row; no two rows may share a value, and it may not be \`NULL\`. Almost every table has one (often an auto-generated \`id\`).
- **\`NOT NULL\`** — the column must always have a value.
- **\`DEFAULT\`** — the value used when an \`INSERT\` does not mention the column.

## Data types

The type is a promise about every value in that column. Getting it right matters:

- **Whole numbers** — \`integer\` (±2 billion), \`bigint\` (±9 quintillion), \`smallint\`.
- **Exact decimals** — \`numeric(precision, scale)\` / \`decimal\`. \`numeric(6,2)\` holds numbers like \`9999.99\`. **Use this for money and any value where rounding errors are unacceptable.**
- **Approximate floats** — \`real\`, \`double precision\`. Fast, but \`0.1 + 0.2 != 0.3\`. For science, not for currency.
- **Strings** — \`text\` (unlimited, the Postgres default and usually the right choice), \`varchar(n)\` (capped at \`n\` characters), \`char(n)\` (fixed, space-padded — avoid).
- **Boolean** — \`boolean\`: \`true\`, \`false\`, or \`NULL\`. Literals: \`true\`/\`false\` (also \`'t'\`, \`'yes'\`, \`1\` on input).
- **Dates and times** — \`date\` (a day), \`time\`, \`timestamp\` (a date+time with *no* zone), \`timestamptz\` (an instant, stored as UTC — **prefer this**), \`interval\` (a duration).
- **Later** — \`uuid\`, \`json\`/\`jsonb\`, arrays, \`enum\`, \`bytea\`, geometric and range types.

A **string literal** in SQL is written with **single quotes**: \`'Karwin'\`. **Double quotes** mean a *quoted identifier* (a table or column name), used when a name has spaces or reserved words — \`"order"\`, \`"first name"\`. Mixing them up (\`SELECT "title"\` when you meant \`SELECT title\` — harmless — versus \`WHERE author = "Karwin"\` — an error, "column Karwin does not exist") is a classic beginner slip.

## \`INSERT\`

\`\`\`sql
INSERT INTO book (id, title, author, year)
VALUES (3, 'Database Internals', 'Petrov', 2019);
\`\`\`

Name the columns you are providing; the rest get their \`DEFAULT\` (or \`NULL\`). You can insert many rows in one statement with comma-separated \`VALUES\` tuples — much faster than one \`INSERT\` per row (Module 10).

## \`NULL\`

\`NULL\` means **"there is no value here"** — unknown, not applicable, not yet entered. It is emphatically **not** \`0\` and **not** the empty string \`''\`. A price of \`NULL\` means "we do not know the price"; a price of \`0\` means "it is free". Because \`NULL\` is the absence of a value, it behaves strangely in comparisons and arithmetic — \`NULL + 1\` is \`NULL\`, \`NULL = NULL\` is *not* true. Lesson 4 is entirely about this; for now, just know that a blank in a result is \`NULL\`, and it is different from everything else.

## Reading it back

\`\`\`sql
SELECT * FROM book;                       -- all columns, all rows
SELECT id, title, price FROM book;        -- projection: choose columns
\`\`\`

\`SELECT *\` is fine for exploring, but in application code you name the columns you need — it is a stable contract (a later \`ALTER TABLE\` adding a column will not surprise your code) and it is less data over the wire.

**A \`SELECT\` with no \`ORDER BY\` returns rows in no guaranteed order.** The database may return them in insertion order, or physical-storage order, or a different order after a vacuum — you must not rely on it. If order matters, say so (Lesson 5).`,

    contentHi: `## Model

Ek **relational database** apne core par **tables** (jinhe *relations* bhi kehte hain) ka ek sangrah hai. Ek table ke paas hai:

- ek **naam** (\`book\`, \`customer\`, \`order_line\`),
- **columns** ki ek fixed, ordered list, har ek ek **naam** aur ek **data type** ke saath,
- zero ya zyada **rows**, jahaan har row ke paas har column ke liye theek ek value hai — possibly \`NULL\`.

Yahi poora data model hai. Koi nested objects nahi, koi documents nahi. Complex data *aur tables* ke roop mein represent hota hai jo shared values se linked hain (Module 3, joins).

Ye course **PostgreSQL** ke against sikhाता hai. Aap jo seekhte ho uska zyादातr standard SQL hai aur MySQL, SQL Server, Oracle, SQLite mein transfer hota hai.

## Schema

**Schema** aapki tables ki definition hai: kaunसी tables hain, unke columns, types, aur rules (constraints — Module 7). Aap ise **DDL** se banate ho: \`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`. *Data* aap **DML** se badalte ho: \`INSERT\`, \`UPDATE\`, \`DELETE\`, aur padhने ke liye \`SELECT\`.

- **\`PRIMARY KEY\`** — ye column ek row ko unique-ly identify karta hai; koi do rows ek value share nahi kar sakti, aur ye \`NULL\` nahi ho sakta.
- **\`NOT NULL\`** — column mein hamesha ek value honi chahिए.
- **\`DEFAULT\`** — jab ek \`INSERT\` column ka zikr nahi karta to jo value istemal hoती hai.

## Data types

Type us column mein har value ke baare mein ek vaada hai:

- **Poore numbers** — \`integer\`, \`bigint\`, \`smallint\`.
- **Exact decimals** — \`numeric(precision, scale)\` / \`decimal\`. **Money aur kisi bhi value ke liye ise istemal karो jahaan rounding errors sweekार nahi.**
- **Approximate floats** — \`real\`, \`double precision\`. Tez, par \`0.1 + 0.2 != 0.3\`. Science ke liye, currency ke liye nahi.
- **Strings** — \`text\` (unlimited, Postgres default aur aksar sahi chunaव), \`varchar(n)\` (\`n\` characters par capped).
- **Boolean** — \`boolean\`: \`true\`, \`false\`, ya \`NULL\`.
- **Dates aur times** — \`date\`, \`time\`, \`timestamp\` (*bina* zone), \`timestamptz\` (ek instant, UTC ke roop mein stored — **ise prefer karो**), \`interval\`.

Ek **string literal** SQL mein **single quotes** se likha jaata hai: \`'Karwin'\`. **Double quotes** ek *quoted identifier* (ek table ya column naam) hain. Inhe mix karna (\`WHERE author = "Karwin"\` — ek error, "column Karwin does not exist") ek classic beginner slip hai.

## \`INSERT\`

Jo columns aap de rahe ho unhe naam do; baaki apna \`DEFAULT\` (ya \`NULL\`) paate hain. Aap ek statement mein comma-separated \`VALUES\` tuples se kई rows insert kar sakte ho — prati row ek \`INSERT\` se kaafi tez.

## \`NULL\`

\`NULL\` ka matlab **"yahaan koi value nahi"** — unknown, applicable nahi, abhi tak enter nahi kiya. Ye zor dekar **na** \`0\` hai **na** empty string \`''\`. \`NULL\` ki ek price ka matlab "hume price pata nahi"; \`0\` ki ek price ka matlab "ye muft hai". Kyunki \`NULL\` ek value ki anupस्थिति hai, ye comparisons aur arithmetic mein ajeeब behave karta hai — \`NULL + 1\` \`NULL\` hai, \`NULL = NULL\` *true nahi* hai. Lesson 4 poori tarah iske baare mein hai.

## Wapas padhna

\`SELECT *\` exploring ke liye theek hai, par application code mein aap jो columns chahिए unhe naam dete ho — ye ek stable contract hai aur wire par kam data hai.

**Ek \`SELECT\` bina \`ORDER BY\` ke rows ko bina kisi guaranteed order ke lautाता hai.** Agar order maayne rakhta hai, to kaho (Lesson 5).`,

    examples: [
      {
        title: 'Create a table, insert rows, read them back',
        titleHi: 'Ek table banao, rows insert karo, unhe wapas padho',
        code: `CREATE TABLE book (
  id       integer PRIMARY KEY,
  title    text NOT NULL,
  author   text,
  year     integer,
  price    numeric(6,2),
  in_print boolean
);

INSERT INTO book (id, title, author, year, price, in_print) VALUES
  (1, 'The Pragmatic Programmer', 'Hunt & Thomas', 1999, 39.99, true),
  (2, 'SQL Antipatterns',         'Karwin',        2010, 34.95, true),
  (3, 'Database Internals',       'Petrov',        2019, 49.99, false),
  (4, 'Out of Print Classic',     NULL,            1977, NULL,  false);

SELECT * FROM book ORDER BY id;`,
        output: ` id | title                    | author        | year | price | in_print
----+--------------------------+---------------+------+-------+----------
 1  | The Pragmatic Programmer | Hunt & Thomas | 1999 | 39.99 | t
 2  | SQL Antipatterns         | Karwin        | 2010 | 34.95 | t
 3  | Database Internals       | Petrov        | 2019 | 49.99 | f
 4  | Out of Print Classic     | NULL          | 1977 | NULL  | f
(4 rows)`,
        explain: '`CREATE TABLE` fixes the columns and their types once; every `INSERT` must supply a value (or `NULL` where allowed) for each. `SELECT *` returns every column of every row. psql shows `NULL` as `NULL`, booleans as `t`/`f`, and `ORDER BY id` is what makes the row order predictable — without it the order is not guaranteed.',
        explainHi: '`CREATE TABLE` columns aur unke types ek baar fix karta hai; har `INSERT` ko har ek ke liye ek value (ya jahaan allowed hai wahaan `NULL`) deni hoti hai. `SELECT *` har row ke har column ko lautata hai. psql `NULL` ko `NULL` dikhata hai, booleans ko `t`/`f`, aur `ORDER BY id` wo hai jo row order predictable banata hai.',
      },
      {
        title: 'Every literal has a type — pg_typeof shows it',
        titleHi: 'Har literal ka ek type hota hai — pg_typeof ise dikhata hai',
        code: `SELECT
  pg_typeof(1)                            AS int_lit,
  pg_typeof(1.5)                          AS num_lit,
  pg_typeof(text 'hi')                    AS text_lit,
  pg_typeof(true)                         AS bool_lit,
  pg_typeof(date '2026-01-15')            AS date_lit,
  pg_typeof(timestamptz '2026-01-15 09:30+00') AS tstz_lit;`,
        output: ` int_lit | num_lit | text_lit | bool_lit | date_lit | tstz_lit
---------+---------+----------+----------+----------+--------------------------
 integer | numeric | text     | boolean  | date     | timestamp with time zone
(1 row)`,
        explain: "Every value in SQL has a type, including literals you type inline. `pg_typeof` reports it: a bare `1` is `integer`, `1.5` is `numeric`, `true` is `boolean`, and `date '...'` / `timestamptz '...'` are typed date/time literals. The type controls which operators apply and how comparisons and sorting behave.",
        explainHi: 'SQL mein har value ka ek type hota hai, un literals samet jo aap inline type karte ho. `pg_typeof` ise report karta hai: ek bare `1` `integer` hai, `1.5` `numeric`, `true` `boolean`. Type control karta hai ki kaunse operators lagu hote hain aur comparisons aur sorting kaise behave karti hain.',
      },
      {
        title: 'NULL is not 0 and not an empty string',
        titleHi: 'NULL na 0 hai na ek empty string',
        code: `CREATE TABLE price_check (item text, price numeric);
INSERT INTO price_check VALUES
  ('paid item',  9.99),
  ('free item',  0),
  ('unknown price', NULL);

SELECT
  item,
  price,
  price = 0            AS is_zero,
  price IS NULL        AS is_unknown
FROM price_check
ORDER BY item;`,
        output: ` item          | price | is_zero | is_unknown
---------------+-------+---------+------------
 free item     | 0     | t       | f
 paid item     | 9.99  | f       | f
 unknown price | NULL  | NULL    | t
(3 rows)`,
        explain: "`price = 0` is `t` only for the row that actually stores `0`; for the `NULL` row it is `NULL` (unknown), not `f`. `price IS NULL` is the only test that returns a definite `t`/`f` for a missing value. `NULL`, `0`, and `''` are three different things — `0` is a known value, `NULL` is the absence of one.",
        explainHi: "`price = 0` sirf us row ke liye `t` hai jo asal mein `0` store karti hai; `NULL` row ke liye ye `NULL` (unknown) hai, `f` nahi. `price IS NULL` ekmatra test hai jo ek missing value ke liye ek definite `t`/`f` lautata hai. `NULL`, `0`, aur `''` teen alag cheezein hain.",
      },
    ],

    mistakes: [
      {
        wrong: `SELECT * FROM book WHERE author = "Karwin";
-- ERROR:  column "Karwin" does not exist`,
        right: `SELECT * FROM book WHERE author = 'Karwin';
-- single quotes = a string value; double quotes = an identifier (column/table name)`,
        why: 'SQL uses single quotes for string literals and double quotes for identifiers (table and column names). Writing double quotes around a value makes the database look for a *column* called Karwin, which does not exist, so you get "column does not exist" — a confusing error message for what is really a quoting mistake. This trips up developers coming from languages where both quote styles make a string. Single quotes for data, always.',
        whyHi: 'SQL string literals ke liye single quotes aur identifiers (table aur column names) ke liye double quotes istemal karta hai. Ek value ke around double quotes likhna database ko Karwin naam ka ek *column* dhoondhne pe majboor karta hai, jo maujood nahi, to aapko "column does not exist" milta hai — ek quoting galti ke liye ek confusing error. Data ke liye single quotes, hamesha.',
      },
      {
        wrong: `CREATE TABLE payment (amount real);      -- 'real' is a binary float
INSERT INTO payment VALUES (0.1), (0.2);
SELECT sum(amount) FROM payment;         -- 0.30000000000000004`,
        right: `CREATE TABLE payment (amount numeric(12,2));   -- exact decimal
INSERT INTO payment VALUES (0.1), (0.2);
SELECT sum(amount) FROM payment;               -- 0.30`,
        why: 'real and double precision are binary floating-point: many decimal fractions (0.1, 0.2, 0.29) cannot be represented exactly, so sums drift and comparisons fail unpredictably. For money, quantities billed, tax, or anything where a cent must be a cent, use numeric (also called decimal) with an explicit scale. It stores the value exactly and does decimal arithmetic. Reserve real/double for measurements and scientific data where a tiny relative error is acceptable.',
        whyHi: 'real aur double precision binary floating-point hain: kई decimal fractions (0.1, 0.2, 0.29) theek represent nahi ho sakte, to sums drift karte hain aur comparisons unpredictably fail hote hain. Money ke liye, billed quantities, tax, ya kuch bhi jahaan ek cent ek cent hona chahिए, numeric (jise decimal bhi kehte hain) ek explicit scale ke saath istemal karो. Ye value ko theek store karta hai. real/double ko measurements aur scientific data ke liye rakhो.',
      },
      {
        wrong: `SELECT * FROM book;
-- then the app code reads row[3] assuming that is the price
-- ...a later ALTER TABLE book ADD COLUMN subtitle text  shifts every position`,
        right: `SELECT id, title, price FROM book;
-- name the columns; adding a column later cannot break this query or the code reading it`,
        why: 'SELECT * returns columns in the table\'s definition order, which changes whenever someone runs ALTER TABLE ... ADD COLUMN. Application code that reads results positionally, or a view built on SELECT *, silently breaks or starts returning the wrong field. Naming the columns you actually use makes the query a stable contract: the result shape is fixed regardless of schema changes, and it is self-documenting. Use SELECT * only for interactive exploration.',
        whyHi: 'SELECT * columns ko table ki definition order mein lautाता hai, jo tab badalta hai jab koi ALTER TABLE ... ADD COLUMN chalाता hai. Application code jo results ko positionally padhता hai, ya SELECT * par bana ek view, chupchaap toot jaata hai ya galat field lautाने lagta hai. Jो columns aap asal mein istemal karte ho unhe naam dena query ko ek stable contract banata hai. SELECT * sirf interactive exploration ke liye istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**`numeric` for every money column, `timestamptz` for every instant** — a house rule in the schema: prices, balances, tax, and fees are `numeric(_, 2)` (or `numeric(_, 4)` for FX), and "when did this happen" columns are `timestamptz` not `timestamp`, so a server in a different timezone never shifts a value.',
        hi: '**Har money column ke liye `numeric`, har instant ke liye `timestamptz`** — schema mein ek house rule: prices, balances, tax `numeric(_, 2)` hain, aur "ye kab hua" columns `timestamptz` hain `timestamp` nahi.',
      },
      {
        en: '**`text` everywhere, not `varchar(n)`** — Postgres stores them identically and `text` has no performance cost, so teams drop the length caps (which only ever cause "value too long" errors in production) and enforce real limits with a `CHECK (length(x) <= 200)` constraint where a limit genuinely matters.',
        hi: '**Har jagah `text`, `varchar(n)` nahi** — Postgres unhe identically store karta hai aur `text` ki koi performance cost nahi, to teams length caps hatा dete hain aur jahaan ek limit sach mein maayne rakhta hai wahaan ek `CHECK` constraint se real limits enforce karte hain.',
      },
      {
        en: '**A generated `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY` on every table** — the app never supplies the id; the database assigns a monotonic one, so inserts cannot collide and the primary key is never a business value that might change.',
        hi: '**Har table par ek generated `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`** — app kabhi id supply nahi karta; database ek monotonic assign karta hai, to inserts collide nahi ho sakti.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the relational model, and what does `NULL` actually mean?',
        qHi: 'Relational model kya hai, aur `NULL` ka asal mein kya matlab hai?',
        a: 'The relational model represents all data as tables. A table has a name, a fixed ordered list of columns each with a name and a data type, and any number of rows, where every row has exactly one value for every column. There are no nested structures and no pointers — relationships between entities are expressed by storing shared values in separate tables and joining them. That uniformity is what lets a single small query language answer a huge range of questions. The schema is the definition of the tables — which exist, their columns and types, and their constraints — and you build it with DDL statements like CREATE TABLE, while you change the data with DML: INSERT, UPDATE, DELETE, and SELECT to read. NULL is not a value; it is a marker meaning "there is no value here" — unknown, not applicable, or not yet supplied. It is specifically not zero and not the empty string. A price of NULL means the price is unknown; a price of zero means the item is free; a name of empty string is a name that happens to be blank. Because NULL is the absence of a value rather than a value, it does not behave like one in comparisons or arithmetic: NULL plus anything is NULL, and NULL equals NULL is not true — it evaluates to NULL, which is not the same as true. That is why you test for it with IS NULL rather than equals NULL.',
        aHi: 'Relational model saare data ko tables ke roop mein represent karta hai. Ek table ke paas ek naam, columns ki ek fixed ordered list har ek naam aur data type ke saath, aur kितni bhi rows hain, jahaan har row ke paas har column ke liye theek ek value hai. Koi nested structures nahi aur koi pointers nahi — entities ke beech relationships alag tables mein shared values store karke aur unhe join karke express hoti hain. Schema tables ki definition hai, aur aap ise CREATE TABLE jaise DDL statements se banate ho, jabki data aap DML se badalte ho: INSERT, UPDATE, DELETE, aur padhने ke liye SELECT. NULL ek value nahi hai; ye ek marker hai jiska matlab "yahaan koi value nahi" — unknown, applicable nahi, ya abhi tak supply nahi kiya. Ye khaaskar na zero hai na empty string. NULL ki ek price ka matlab price unknown hai; zero ki ek price ka matlab item muft hai. Kyunki NULL ek value ki anupस्थिति hai, ye comparisons ya arithmetic mein ek jaisा behave nahi karta: NULL plus kuch bhi NULL hai, aur NULL equals NULL true nahi hai. Isiliye aap iske liye IS NULL se test karte ho.',
      },
      {
        q: 'When would you use `numeric` vs `real`/`double precision`, and `text` vs `varchar(n)`?',
        qHi: 'Aap `numeric` vs `real`/`double precision`, aur `text` vs `varchar(n)` kab istemal karoge?',
        a: 'Use numeric — also spelled decimal — for any value where the result must be exact: money, prices, balances, tax, billed quantities, anything measured in indivisible units like cents. numeric stores the value exactly and performs true decimal arithmetic, so a sum of 0.1 and 0.2 is exactly 0.3 and a cent is always a cent. You give it a precision and scale, like numeric with 12 total digits and 2 after the decimal point. Use real or double precision only for approximate quantities where a tiny relative error does not matter — sensor readings, scientific measurements, statistics, coordinates. They are binary floating point, so many decimal fractions cannot be represented exactly, sums drift, and equality comparisons are unreliable; never use them for currency. For strings, in PostgreSQL specifically, text and varchar are stored and performed identically — there is no speed or space advantage to varchar with a limit. The length cap on varchar only produces "value too long" errors, often in production when real data exceeds an arbitrary guess. So the common practice is to use text everywhere and, where a length genuinely must be bounded, enforce it with an explicit CHECK constraint that you can see and change. In databases other than Postgres the tradeoffs can differ, but the "prefer text, constrain explicitly" habit travels well.',
        aHi: 'numeric — jise decimal bhi likhte hain — kisi bhi value ke liye istemal karो jahaan result exact hona chahिए: money, prices, balances, tax, billed quantities, cents jaise indivisible units mein maapी koi cheez. numeric value ko theek store karta hai aur sacha decimal arithmetic karta hai, to 0.1 aur 0.2 ka sum theek 0.3 hai. Aap ise ek precision aur scale dete ho. real ya double precision sirf approximate quantities ke liye istemal karो jahaan ek chhoti relative error maayne nahi rakhती — sensor readings, scientific measurements, coordinates. Wo binary floating point hain, to kई decimal fractions theek represent nahi ho sakte; currency ke liye kabhi istemal mat karो. Strings ke liye, khaaskar PostgreSQL mein, text aur varchar identically store aur perform hote hain — length ke saath varchar ka koi speed ya space fayda nahi. varchar par length cap sirf "value too long" errors produce karta hai. To aam practice har jagah text istemal karna hai aur, jahaan ek length sach mein bounded honi chahिए, ise ek explicit CHECK constraint se enforce karना.',
      },
    ],

    exercises: [
      {
        task: 'Create a table `movie` with columns: `id` integer primary key, `title` text not null, `director` text (nullable), `year` integer, `rating` numeric(3,1), `oscar_winner` boolean. Insert four rows including one where `director` is `NULL` and one where `rating` is `NULL`. Then `SELECT * FROM movie ORDER BY id` and confirm the `NULL`s render as `NULL` (not blank, not `0`).',
        taskHi: 'Ek table `movie` banao columns ke saath: `id` integer primary key, `title` text not null, `director` text (nullable), `year` integer, `rating` numeric(3,1), `oscar_winner` boolean. Chaar rows insert karo jismें ek mein `director` `NULL` ho aur ek mein `rating` `NULL` ho. Phir `SELECT * FROM movie ORDER BY id`.',
        hint: 'String values use single quotes: `\'Nolan\'`. `NULL` is a bare keyword, never quoted. List the columns in the `INSERT (...)` so the order is explicit.',
        hintHi: 'String values single quotes istemal karte hain: `\'Nolan\'`. `NULL` ek bare keyword hai, kabhi quoted nahi. `INSERT (...)` mein columns list karo.',
      },
      {
        task: 'Using your `movie` table, run `SELECT title, rating, rating IS NULL AS rating_missing, rating = 0 AS rating_is_zero FROM movie ORDER BY title`. Observe that for the `NULL`-rating row, `rating_is_zero` is itself `NULL` (not `f`) — a comparison with `NULL` yields `NULL`, never `true` or `false`.',
        taskHi: 'Apni `movie` table se, `SELECT title, rating, rating IS NULL AS rating_missing, rating = 0 AS rating_is_zero FROM movie ORDER BY title` chalao. Dekho ki `NULL`-rating row ke liye, `rating_is_zero` khud `NULL` hai (`f` nahi).',
        hint: 'This previews Lesson 4. The key observation: `<anything> = NULL` is `NULL`, and `NULL` in a boolean context is treated as "not true", so such rows are excluded by a `WHERE`.',
        hintHi: 'Ye Lesson 4 ka preview hai. Mukhya observation: `<kuch bhi> = NULL` `NULL` hai, aur ek boolean context mein `NULL` ko "not true" maana jaata hai.',
      },
      {
        task: 'Write two `CREATE TABLE` statements for a `payment` table: one with `amount real`, one with `amount numeric(12,2)`. Insert `(0.1)` and `(0.2)` into each, then `SELECT sum(amount) FROM payment` for each. Note that the `real` version does not sum to exactly `0.3`.',
        taskHi: 'Ek `payment` table ke liye do `CREATE TABLE` statements likho: ek `amount real` ke saath, ek `amount numeric(12,2)` ke saath. Har mein `(0.1)` aur `(0.2)` insert karo, phir har ke liye `SELECT sum(amount) FROM payment`. Dhyaan do ki `real` version theek `0.3` nahi jodta.',
        hint: 'Run them in two separate scripts (or `DROP TABLE payment` between). `real` is IEEE-754 binary float; `numeric` is exact base-10.',
        hintHi: 'Unhe do alag scripts mein chalao (ya beech mein `DROP TABLE payment`). `real` IEEE-754 binary float hai; `numeric` exact base-10 hai.',
      },
    ],

    keyTakeaways: [
      'The relational model: ALL data is tables. A table = a name + a fixed ordered list of typed columns + any number of rows, each row having exactly one value (possibly `NULL`) per column. Relationships = shared values across tables + joins (Module 3).',
      'DDL defines the schema (`CREATE`/`ALTER`/`DROP TABLE`); DML changes data (`INSERT`/`UPDATE`/`DELETE`); `SELECT` reads. `PRIMARY KEY` = uniquely identifies a row (unique + not null); `NOT NULL` = must have a value; `DEFAULT` = value used when `INSERT` omits the column.',
      'Types are a promise about every value: `integer`/`bigint` (whole), `numeric(p,s)` (EXACT decimal — USE FOR MONEY), `real`/`double precision` (approximate float — NOT money), `text` (strings — the Postgres default), `boolean`, `date`, `timestamptz` (prefer over `timestamp`).',
      "String literal = SINGLE quotes (`'Karwin'`). DOUBLE quotes = an identifier (column/table name). `WHERE author = \"Karwin\"` -> ERROR \"column Karwin does not exist\".",
      '`NULL` = "no value here" (unknown / N/A). It is NOT `0` and NOT `\'\'`. A blank in a result is `NULL`. `NULL` behaves strangely in comparisons + arithmetic (`NULL + 1` = `NULL`; `NULL = NULL` is NOT true) — Lesson 4.',
      '`SELECT *` = all columns (definition order — shifts on `ALTER TABLE ADD COLUMN`); name the columns in app code for a stable contract. `INSERT` names the columns you provide; the rest get `DEFAULT`/`NULL`; multi-row `VALUES` is far faster than one `INSERT` per row.',
      'A `SELECT` with NO `ORDER BY` returns rows in NO guaranteed order — never rely on insertion or "natural" order. Ask for order explicitly (Lesson 5).',
      'PostgreSQL is the teaching target; most of it is standard SQL that transfers to MySQL / SQL Server / Oracle / SQLite.',
    ],
    keyTakeawaysHi: [
      'Relational model: SAARA data tables hai. Ek table = ek naam + typed columns ki ek fixed ordered list + kितni bhi rows, har row ke paas prati column theek ek value (possibly `NULL`). Relationships = tables ke paar shared values + joins (Module 3).',
      'DDL schema define karta hai (`CREATE`/`ALTER`/`DROP TABLE`); DML data badalta hai (`INSERT`/`UPDATE`/`DELETE`); `SELECT` padhता hai. `PRIMARY KEY` = ek row ko unique-ly identify (unique + not null); `NOT NULL`; `DEFAULT`.',
      'Types har value ke baare mein ek vaada hain: `integer`/`bigint`, `numeric(p,s)` (EXACT decimal — MONEY KE LIYE), `real`/`double precision` (approximate — money NAHI), `text` (Postgres default), `boolean`, `date`, `timestamptz` (`timestamp` se behtar).',
      "String literal = SINGLE quotes (`'Karwin'`). DOUBLE quotes = ek identifier. `WHERE author = \"Karwin\"` -> ERROR \"column Karwin does not exist\".",
      '`NULL` = "yahaan koi value nahi" (unknown / N/A). Ye `0` NAHI aur `\'\'` NAHI. Result mein ek blank `NULL` hai. `NULL` comparisons + arithmetic mein ajeeब behave karta hai — Lesson 4.',
      '`SELECT *` = saare columns (definition order — `ALTER TABLE ADD COLUMN` par shift); app code mein columns naam do. `INSERT` jo columns aap dete ho unhe naam deta hai; baaki `DEFAULT`/`NULL`; multi-row `VALUES` kaafi tez.',
      'Ek `SELECT` bina `ORDER BY` ke rows ko KISI guaranteed order mein NAHI lautाता — kabhi insertion ya "natural" order par bharosा mat karो. Order explicitly maango (Lesson 5).',
      'PostgreSQL teaching target hai; iska zyादातr standard SQL hai jo MySQL / SQL Server / Oracle / SQLite mein transfer hota hai.',
    ],
  },

  {
    slug: 'sql-select-projection',
    title: 'Projection: Choosing Columns, Aliases & Expressions',
    titleHi: 'Projection: Columns Chunna, Aliases & Expressions',
    description: 'The `SELECT` list does not have to be plain column names. It can rename columns (`AS`), compute new ones (`price * 0.9`), call functions (`upper(name)`), and combine values (`first || \' \' || last`). `DISTINCT` then removes duplicate rows from the result.',
    descriptionHi: '`SELECT` list ko plain column names hone ki zaroorat nahi. Ye columns rename kar sakti hai (`AS`), naye compute kar sakti hai (`price * 0.9`), functions call kar sakti hai (`upper(name)`), aur values combine kar sakti hai. `DISTINCT` phir result se duplicate rows hatा deता hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 2,

    analogy: {
      en: '**A photographer choosing a crop and a filter.** The table is the full negative — every column, every row. **Projection** is deciding what makes it into the print: you pick which parts of the frame to keep (choose columns), you can crop *and adjust* — brighten, convert to black and white, add a border (expressions: `price * 0.9`, `upper(title)`, `first || \' \' || last`) — and you can label the print on the back (`AS sale_price`). What you cannot do at this stage is decide *which negatives* to print — that is filtering, the next lesson. Projection is purely "given these rows, what columns and computed values do I want to see, and what do I call them". \`DISTINCT\` is the extra instruction "and if two prints come out identical, only keep one".',
      hi: '**Ek photographer ek crop aur ek filter chunता hai.** Table poora negative hai — har column, har row. **Projection** ye tय karna hai ki print mein kya jaayega: aap chunte ho frame ke kaunse hisse rakhne hain (columns chunna), aap crop *aur adjust* kar sakte ho — brighten, black and white mein convert, ek border add (expressions: `price * 0.9`, `upper(title)`) — aur aap print ko peeche label kar sakte ho (`AS sale_price`). Is stage par aap jо nahi kar sakte wo ye tय karna hai ki *kaunse negatives* print karne hain — wo filtering hai, agla lesson. `DISTINCT` extra instruction hai "aur agar do prints identical nikalte hain, sirf ek rakhо".',
    },

    simple: `**Choose columns, or all of them**

\`\`\`sql
SELECT title, author, year FROM book;   -- projection: three columns
SELECT * FROM book;                     -- all columns (exploration only)
\`\`\`

**Rename a column with \`AS\` (or just a space)**

\`\`\`sql
SELECT
  title             AS book_title,
  price * 0.9       AS sale_price,      -- an expression NEEDS a name to be useful
  year                 publication_year -- AS is optional, but write it -- clearer
FROM book;
\`\`\`

**Expressions in the select list**

\`\`\`sql
SELECT
  upper(title)                 AS shout,          -- a function call
  price * 1.20                 AS price_with_tax, -- arithmetic
  author || ' (' || year || ')' AS citation,      -- || is string concatenation
  length(title)                AS title_len,
  price IS NULL                AS price_unknown   -- a boolean expression
FROM book;
\`\`\`

\`\`\`
||        string concatenation           'a' || 'b'  ->  'ab'   (NULL || x -> NULL!)
+ - * /   arithmetic
%         modulo
functions upper lower length trim substring round abs ceil floor coalesce ...
a column list item can be:  a column, a literal, or any expression built from them
\`\`\`

**\`DISTINCT\` — drop duplicate result rows**

\`\`\`sql
SELECT DISTINCT region FROM sale;              -- unique regions
SELECT DISTINCT region, channel FROM sale;     -- unique (region, channel) PAIRS
SELECT DISTINCT ON (region) region, channel    -- Postgres: one row per region
  FROM sale ORDER BY region, channel;
\`\`\`

\`\`\`
DISTINCT applies to the WHOLE select list, not one column
DISTINCT is not free: it sorts or hashes the result to find duplicates
if the rows are already unique (e.g. you selected the primary key), DISTINCT does nothing but cost time
\`\`\``,

    simpleHi: `**Columns chuno, ya sab**

\`\`\`sql
SELECT title, author, year FROM book;   -- projection: teen columns
SELECT * FROM book;                     -- saare columns (sirf exploration)
\`\`\`

**\`AS\` se ek column rename karo (ya bस ek space)**

\`\`\`sql
SELECT
  title             AS book_title,
  price * 0.9       AS sale_price,      -- ek expression ko useful hone ko ek naam CHAHIYE
  year                 publication_year -- AS optional hai, par likho -- spasht
FROM book;
\`\`\`

**Select list mein expressions**

\`\`\`sql
SELECT
  upper(title)                 AS shout,          -- ek function call
  price * 1.20                 AS price_with_tax, -- arithmetic
  author || ' (' || year || ')' AS citation,      -- || string concatenation hai
  length(title)                AS title_len,
  price IS NULL                AS price_unknown   -- ek boolean expression
FROM book;
\`\`\`

\`\`\`
||        string concatenation           'a' || 'b'  ->  'ab'   (NULL || x -> NULL!)
+ - * /   arithmetic
%         modulo
functions upper lower length trim substring round abs ceil floor coalesce ...
ek column list item ho sakta hai:  ek column, ek literal, ya unse bana koi expression
\`\`\`

**\`DISTINCT\` — duplicate result rows hatao**

\`\`\`sql
SELECT DISTINCT region FROM sale;              -- unique regions
SELECT DISTINCT region, channel FROM sale;     -- unique (region, channel) JODIYAN
SELECT DISTINCT ON (region) region, channel    -- Postgres: prati region ek row
  FROM sale ORDER BY region, channel;
\`\`\`

\`\`\`
DISTINCT POORI select list par lागू hota hai, ek column par nahi
DISTINCT muft nahi hai: ye duplicates dhoondhne ko result ko sort ya hash karta hai
agar rows pehle se unique hain (jaise aapne primary key select kiya), DISTINCT kuch nahi karta bस time kharch
\`\`\``,

    content: `## Projection

**Projection** is the operation of choosing what appears in each output row: which columns, plus any computed values. In relational terms, \`SELECT\` *projects* the table onto a chosen set of attributes. It does not change which rows come back — that is \`WHERE\` (Lesson 3).

The select list is a comma-separated list of **expressions**. Each expression can be:

- a **column reference** — \`title\`, \`book.price\`;
- a **literal** — \`42\`, \`'draft'\`, \`true\`, \`NULL\`;
- a **computation** built from columns, literals, operators, and function calls — \`price * 0.9\`, \`upper(title)\`, \`coalesce(nickname, first_name)\`, \`extract(year from created_at)\`.

## Aliases — \`AS\`

An **alias** renames a column in the result. \`price * 0.9\` with no alias comes back under an ugly system-generated name (\`?column?\`); \`price * 0.9 AS sale_price\` names it. Rules:

- \`AS\` is optional (\`price AS p\` and \`price p\` are the same) but including it reads better.
- If the alias needs spaces or special characters, double-quote it: \`AS "Sale Price"\`. (This is one of the few legitimate uses of double quotes.)
- **An alias defined in the \`SELECT\` list cannot be used in the same query's \`WHERE\` or \`GROUP BY\`** — those clauses run *before* the select list is evaluated (Lesson 6). It *can* be used in \`ORDER BY\`, which runs after.

## Operators and functions

- **Arithmetic:** \`+ - * /\` and \`%\` (modulo). Integer division truncates: \`7 / 2\` is \`3\`; write \`7.0 / 2\` or cast for a decimal result.
- **String concatenation:** \`||\`. \`'Hello, ' || name\`. **If any operand is \`NULL\`, the whole result is \`NULL\`** — use \`concat(...)\` (which skips nulls) or \`coalesce\` to guard.
- **Comparison:** \`= <> < <= > >=\`, and \`IS NULL\` / \`IS NOT NULL\`. A comparison is itself an expression of type \`boolean\`, so you can select it: \`SELECT price > 30 AS is_pricey\`.
- **Functions:** hundreds of them. Common: \`upper\`, \`lower\`, \`trim\`, \`length\`, \`substring\`, \`replace\`, \`round(x, n)\`, \`abs\`, \`ceil\`, \`floor\`, \`coalesce(a, b, ...)\`, \`nullif(a, b)\`, \`now()\`, \`extract(field from timestamp)\`. Cast a value's type with \`x::integer\` or \`CAST(x AS integer)\`.

## Computed / derived columns

A projected expression is often called a **derived column** or **computed column**. It exists only in the result — the table is unchanged. This is where a lot of light data shaping happens: formatting a name, deriving an age from a birthdate, computing a line total from quantity and price, turning a status code into a label with \`CASE\` (Module 2).

\`\`\`sql
SELECT
  concat_ws(' ', first_name, last_name)          AS full_name,
  date_part('year', age(birth_date))             AS years_old,
  quantity * unit_price                          AS line_total
FROM ...;
\`\`\`

## \`DISTINCT\`

\`SELECT DISTINCT\` removes **duplicate rows** from the result — where "duplicate" means *every column in the select list matches*.

- \`SELECT DISTINCT region FROM sale\` — the set of regions that appear.
- \`SELECT DISTINCT region, channel FROM sale\` — the set of distinct \`(region, channel)\` **combinations**. A common mistake is expecting this to mean "distinct regions, and also show a channel" — it does not; it de-duplicates the pair.
- \`SELECT DISTINCT id, name FROM customer\` — if \`id\` is the primary key, every row is already unique, so \`DISTINCT\` does nothing except make the database sort/hash the whole result for no reason. Do not sprinkle \`DISTINCT\` to "fix" unexpected duplicates without understanding where they came from (usually a join — Module 3).

**\`DISTINCT ON (expr)\`** is a PostgreSQL extension: keep the first row for each distinct value of \`expr\`, according to the \`ORDER BY\`. \`SELECT DISTINCT ON (customer_id) * FROM orders ORDER BY customer_id, created_at DESC\` gives each customer's most recent order. Powerful, but non-standard — the portable equivalent uses a window function (Module 6).

## \`DISTINCT\` vs \`GROUP BY\`

\`SELECT DISTINCT a, b FROM t\` and \`SELECT a, b FROM t GROUP BY a, b\` produce the same rows. Use \`DISTINCT\` when you just want unique combinations; use \`GROUP BY\` when you also want to *aggregate* within each group (Module 4).`,

    contentHi: `## Projection

**Projection** ye chunne ka operation hai ki har output row mein kya dikhता hai: kaunse columns, plus koi computed values. \`SELECT\` table ko chune gaye attributes ke ek set par *project* karता hai. Ye nahi badalता ki kaunसी rows wapas aati hain — wo \`WHERE\` hai (Lesson 3).

Select list **expressions** ki ek comma-separated list hai. Har expression ho sakta hai:

- ek **column reference** — \`title\`, \`book.price\`;
- ek **literal** — \`42\`, \`'draft'\`, \`true\`, \`NULL\`;
- columns, literals, operators, aur function calls se bani ek **computation** — \`price * 0.9\`, \`upper(title)\`, \`coalesce(nickname, first_name)\`.

## Aliases — \`AS\`

Ek **alias** result mein ek column rename karता hai. \`price * 0.9\` bina alias ke ek ugly system-generated naam (\`?column?\`) ke tahat aata hai; \`price * 0.9 AS sale_price\` ise naam deता hai. Rules:

- \`AS\` optional hai par ise shamil karna behtar padhता hai.
- **\`SELECT\` list mein define kiya ek alias usi query ke \`WHERE\` ya \`GROUP BY\` mein istemal nahi ho sakta** — wo clauses select list ke evaluate hone se *pehle* chalते hain (Lesson 6). Ye \`ORDER BY\` mein istemal ho *sakta* hai.

## Operators aur functions

- **Arithmetic:** \`+ - * /\` aur \`%\`. Integer division truncate karता hai: \`7 / 2\` \`3\` hai; ek decimal result ke liye \`7.0 / 2\` likho.
- **String concatenation:** \`||\`. **Agar koi bhi operand \`NULL\` hai, poora result \`NULL\` hai** — guard ke liye \`concat(...)\` ya \`coalesce\` istemal karो.
- **Comparison:** \`= <> < <= > >=\`, aur \`IS NULL\`. Ek comparison khud type \`boolean\` ka ek expression hai, to aap ise select kar sakte ho.
- **Functions:** \`upper\`, \`lower\`, \`trim\`, \`length\`, \`round(x, n)\`, \`coalesce\`, \`nullif\`, \`now()\`, \`extract\`. Ek value ka type \`x::integer\` se cast karो.

## \`DISTINCT\`

\`SELECT DISTINCT\` result se **duplicate rows** hatाता hai — jahaan "duplicate" ka matlab *select list mein har column match karता hai*.

- \`SELECT DISTINCT region, channel FROM sale\` — distinct \`(region, channel)\` **combinations** ka set. Ek aam galti ise "distinct regions, aur ek channel bhi dikhाओ" samajhna hai — aisा nahi hai; ye jodी ko de-duplicate karता hai.
- Agar \`id\` primary key hai, har row pehle se unique hai, to \`DISTINCT\` kuch nahi karता sivाy database ko poore result ko sort/hash karवाने ke.

**\`DISTINCT ON (expr)\`** ek PostgreSQL extension hai: \`ORDER BY\` ke hisaab se \`expr\` ki har distinct value ke liye pehli row rakhо. \`SELECT DISTINCT ON (customer_id) * FROM orders ORDER BY customer_id, created_at DESC\` har customer ka sabse recent order deता hai. Powerful, par non-standard — portable equivalent ek window function istemal karता hai (Module 6).

## \`DISTINCT\` vs \`GROUP BY\`

\`SELECT DISTINCT a, b FROM t\` aur \`SELECT a, b FROM t GROUP BY a, b\` same rows produce karте hain. \`DISTINCT\` tab istemal karो jab aap sirf unique combinations chahते ho; \`GROUP BY\` tab jab aap har group ke andar *aggregate* bhi karna chahते ho (Module 4).`,

    examples: [
      {
        title: 'Projection: choose columns, alias them, compute new ones',
        titleHi: 'Projection: columns chuno, unhe alias karo, naye compute karo',
        code: `CREATE TABLE book (id int, title text, price numeric(6,2), pages int);
INSERT INTO book VALUES
  (1, 'A Short Book',  30.00, 320),
  (2, 'A Long Book',   45.00, 540),
  (3, 'A Cheap Book',  12.50, 110);

SELECT
  title,
  price,
  price * 0.9              AS sale_price,
  round(price / pages, 4)  AS price_per_page,
  upper(title)             AS shouty
FROM book
ORDER BY id;`,
        output: ` title        | price | sale_price | price_per_page | shouty
--------------+-------+------------+----------------+--------------
 A Short Book | 30.00 | 27.000     | 0.0938         | A SHORT BOOK
 A Long Book  | 45.00 | 40.500     | 0.0833         | A LONG BOOK
 A Cheap Book | 12.50 | 11.250     | 0.1136         | A CHEAP BOOK
(3 rows)`,
        explain: 'The `SELECT` list chooses and computes the output columns: `title` and `price` are passed through, `price * 0.9`, `round(price / pages, 4)`, and `upper(title)` are computed per row, and `AS` names each result. The source rows are unchanged — projection only shapes what comes back.',
        explainHi: '`SELECT` list output columns chunti aur compute karti hai: `title` aur `price` pass-through hain, `price * 0.9`, `round(price / pages, 4)`, aur `upper(title)` prati row compute hote hain, aur `AS` har result ko naam deta hai. Source rows unchanged hain — projection sirf shape karta hai ki kya wapas aata hai.',
      },
      {
        title: 'String concatenation with || — and the NULL trap',
        titleHi: '|| se string concatenation — aur NULL trap',
        code: `CREATE TABLE person (id int, first_name text, last_name text, nickname text);
INSERT INTO person VALUES
  (1, 'Ada',  'Lovelace', NULL),
  (2, 'Grace', 'Hopper',  'Amazing Grace');

SELECT
  first_name || ' ' || last_name           AS via_pipes,
  first_name || ' "' || nickname || '"'    AS with_nickname_pipes,   -- NULL if nickname is NULL
  concat(first_name, ' "', nickname, '"')  AS with_nickname_concat   -- concat() skips NULLs
FROM person
ORDER BY id;`,
        output: ` via_pipes    | with_nickname_pipes   | with_nickname_concat
--------------+-----------------------+-----------------------
 Ada Lovelace | NULL                  | Ada ""
 Grace Hopper | Grace "Amazing Grace" | Grace "Amazing Grace"
(2 rows)`,
        explain: '`||` concatenates strings, but if any operand is `NULL` the whole result is `NULL` — so `with_nickname_pipes` is `NULL` for Ada, whose nickname is missing. `concat()` instead skips `NULL` arguments (treating them as `\'\'`), which is why `with_nickname_concat` produces `Ada ""` rather than `NULL`.',
        explainHi: '`||` strings ko concatenate karta hai, par agar koi operand `NULL` hai to poora result `NULL` hai — to `with_nickname_pipes` Ada ke liye `NULL` hai, jiska nickname missing hai. `concat()` iske bजाy `NULL` arguments skip karta hai (unhe `\'\'` maankar), isiliye `with_nickname_concat` `NULL` ke bजाy `Ada ""` produce karta hai.',
      },
      {
        title: 'DISTINCT applies to the whole select list',
        titleHi: 'DISTINCT poori select list par lागू hota hai',
        code: `CREATE TABLE sale (id int, region text, channel text);
INSERT INTO sale VALUES
  (1,'NA','web'), (2,'NA','web'), (3,'EU','web'),
  (4,'EU','store'), (5,'NA','store');

SELECT DISTINCT region FROM sale ORDER BY region;

SELECT DISTINCT region, channel FROM sale ORDER BY region, channel;`,
        output: ` region
--------
 EU
 NA
(2 rows)

 region | channel
--------+---------
 EU     | store
 EU     | web
 NA     | store
 NA     | web
(4 rows)`,
        explain: '`DISTINCT` de-duplicates on the ENTIRE select list, not one column. `SELECT DISTINCT region` collapses to the 2 unique regions; `SELECT DISTINCT region, channel` keeps every unique (region, channel) PAIR, which is 4 rows. Adding a column to a `DISTINCT` query can therefore increase the row count.',
        explainHi: '`DISTINCT` POORI select list par de-duplicate karta hai, ek column par nahi. `SELECT DISTINCT region` 2 unique regions tak collapse karta hai; `SELECT DISTINCT region, channel` har unique (region, channel) PAIR rakhta hai, jo 4 rows hai. Ek `DISTINCT` query mein ek column add karna isliye row count badha sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT DISTINCT region, channel FROM sale;
-- expecting: "the distinct regions, each with one channel"
-- getting:   every distinct (region, channel) PAIR -- more rows, not fewer`,
        right: `-- if you want one channel per region, pick which one deliberately:
SELECT DISTINCT ON (region) region, channel
FROM sale
ORDER BY region, channel;        -- Postgres: first channel alphabetically, per region`,
        why: 'DISTINCT de-duplicates the entire select list as a unit. Adding a second column to SELECT DISTINCT does not "keep it distinct on the first column and tag along the second" — it asks for distinct combinations of both, which typically produces more rows, not fewer. If you genuinely want one row per region, you must decide which channel to show: DISTINCT ON (region) with an ORDER BY in Postgres, or a window function / GROUP BY with an aggregate elsewhere.',
        whyHi: 'DISTINCT poori select list ko ek unit ke roop mein de-duplicate karता hai. SELECT DISTINCT mein ek doosra column add karna "pehle column par distinct rakho aur doosra saath le lo" nahi kehта — ye dono ke distinct combinations maangता hai, jо aam taur par zyada rows produce karता hai, kam nahi. Agar aap sach mein prati region ek row chahते ho, aapко tय karna hoga kaunसा channel dikhाना: Postgres mein DISTINCT ON (region), ya kahin aur ek window function / GROUP BY.',
      },
      {
        wrong: `SELECT
  price * 0.9 AS sale_price,
  sale_price * quantity AS revenue   -- ERROR: column "sale_price" does not exist
FROM order_line;`,
        right: `SELECT
  price * 0.9              AS sale_price,
  (price * 0.9) * quantity AS revenue        -- repeat the expression, or ...
FROM order_line;

-- ... use a subquery / CTE so the alias is a real column (Module 5):
SELECT sale_price, sale_price * quantity AS revenue
FROM (SELECT price * 0.9 AS sale_price, quantity FROM order_line) s;`,
        why: 'A select-list alias is not a variable you can reference later in the same select list — all the expressions in one SELECT are evaluated against the source row, not against each other, and the alias only exists once the row is projected. To reuse a computed value, either repeat the expression, or compute it in an inner subquery / CTE whose output column then IS a real column the outer query can name. (Some databases relax this; Postgres does not.)',
        whyHi: 'Ek select-list alias ek variable nahi hai jise aap usi select list mein baad mein reference kar sako — ek SELECT mein saare expressions source row ke against evaluate hote hain, ek doosre ke against nahi, aur alias sirf tab exist karता hai jab row project ho jaati hai. Ek computed value ko reuse karने ko, ya expression repeat karो, ya ise ek inner subquery / CTE mein compute karो jiska output column phir ek real column HAI.',
      },
      {
        wrong: `SELECT count(DISTINCT customer_id), region
FROM orders
GROUP BY region;
-- fine -- but then someone "cleans it up":
SELECT DISTINCT count(customer_id), region FROM orders GROUP BY region;
-- DISTINCT here is pointless: GROUP BY already made region unique`,
        right: `SELECT region, count(DISTINCT customer_id) AS unique_customers
FROM orders
GROUP BY region;
-- DISTINCT belongs INSIDE count(), to count distinct customers -- not on the outer SELECT`,
        why: 'DISTINCT on a SELECT that already has a GROUP BY is almost always a no-op that just adds a sort: GROUP BY has already collapsed each group to one row, so there is nothing to de-duplicate. The DISTINCT people actually want is usually inside an aggregate — count(DISTINCT x) counts how many different values of x there are per group. Putting DISTINCT on the outer SELECT instead does nothing useful and signals a misunderstanding of what GROUP BY produced.',
        whyHi: 'Ek SELECT par DISTINCT jiske paas pehle se ek GROUP BY hai lगbhag hamesha ek no-op hai jо bस ek sort add karता hai: GROUP BY ne pehle hi har group ko ek row mein collapse kar diya. Jо DISTINCT log asal mein chahте hain wo aam taur par ek aggregate ke ANDAR hai — count(DISTINCT x) ginता hai prati group x ki kितni alag values hain.',
      },
    ],

    realWorld: [
      {
        en: '**An API endpoint that names its columns** — the query is `SELECT id, name, email, created_at FROM users WHERE ...`, never `SELECT *`, so a later migration adding a `password_reset_token` column cannot accidentally leak it into a JSON response, and the response schema is stable.',
        hi: '**Ek API endpoint jо apne columns naam deta hai** — query `SELECT id, name, email, created_at FROM users WHERE ...` hai, kabhi `SELECT *` nahi, to ek `password_reset_token` column add karta ek baad ka migration ise galti se ek JSON response mein leak nahi kar sakta.',
      },
      {
        en: '**`DISTINCT ON (user_id) ... ORDER BY user_id, created_at DESC`** for "each user\'s latest session" — a single-pass Postgres query that replaces a correlated subquery or a self-join, used all over reporting and dashboard code.',
        hi: '**"Har user ka latest session" ke liye `DISTINCT ON (user_id) ... ORDER BY user_id, created_at DESC`** — ek single-pass Postgres query jо ek correlated subquery ya ek self-join ko replace karती hai.',
      },
      {
        en: '**Derived display columns computed in SQL, not the app** — `concat_ws(\', \', city, region, country) AS location`, `round(score * 100) AS percent`, `amount_cents / 100.0 AS amount` — so every consumer of the query sees the same formatting and the logic lives in one place.',
        hi: '**Derived display columns SQL mein compute kiye, app mein nahi** — `concat_ws(\', \', city, region, country) AS location`, `round(score * 100) AS percent` — to query ka har consumer same formatting dekhता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is projection, and why can you use a `SELECT` alias in `ORDER BY` but not in `WHERE`?',
        qHi: 'Projection kya hai, aur aap ek `SELECT` alias `ORDER BY` mein kyun istemal kar sakte ho par `WHERE` mein nahi?',
        a: 'Projection is the operation of choosing what each output row contains: which columns from the source, plus any computed expressions built from them. It does not affect which rows are returned — that is filtering, done by WHERE. The select list is a comma-separated list of expressions, and each one can be a column, a literal, or a computation using operators and functions, optionally renamed with AS. The reason an alias works in ORDER BY but not WHERE comes down to the logical order in which the clauses are processed. Conceptually the database evaluates FROM first, then WHERE, then GROUP BY and HAVING, then the SELECT list — which is where the aliases are created — then DISTINCT, then ORDER BY, then LIMIT. WHERE runs before the select list is evaluated, so at that point the alias simply does not exist yet; you have to repeat the underlying expression, or wrap it in a subquery. ORDER BY runs after the select list, so the alias is already defined and can be referenced by name. This ordering also explains why an aggregate condition goes in HAVING, not WHERE, and why you cannot filter on a window function in the same query level.',
        aHi: 'Projection ye chunne ka operation hai ki har output row mein kya hai: source se kaunse columns, plus unse bane koi computed expressions. Ye affect nahi karта ki kaunसी rows return hoti hain — wo filtering hai, WHERE dwara. Select list expressions ki ek comma-separated list hai, aur har ek ek column, ek literal, ya operators aur functions ka istemal karके ek computation ho sakti hai, optionally AS se renamed. Ek alias ORDER BY mein kaam karता hai par WHERE mein nahi, iska kaaran wo logical order hai jismें clauses process hote hain. Conceptually database pehle FROM evaluate karता hai, phir WHERE, phir GROUP BY aur HAVING, phir SELECT list — jahaan aliases bante hain — phir DISTINCT, phir ORDER BY, phir LIMIT. WHERE select list ke evaluate hone se pehle chalता hai, to us point par alias abhi exist nahi karता. ORDER BY select list ke baad chalता hai, to alias pehle se defined hai.',
      },
      {
        q: 'A colleague added `DISTINCT` to a query "to remove duplicates". What questions do you ask?',
        qHi: 'Ek colleague ne ek query mein "duplicates hatаने ko" `DISTINCT` add kiya. Aap kya sawaal poochते ho?',
        a: 'The first question is where the duplicates are coming from, because DISTINCT is a symptom, not usually the fix. In a query against a single table where you selected the primary key, there cannot be duplicate rows, so DISTINCT there is pure overhead — it forces a sort or hash of the whole result for nothing. When duplicates do appear, the overwhelmingly common cause is a join that multiplies rows: joining orders to order_lines and then selecting order columns gives one row per line, so the order looks duplicated. The right fix is usually to aggregate — GROUP BY the order and count or sum the lines — or to restructure the join, or to use EXISTS instead of a join if you only needed to test for presence. The second question is whether DISTINCT is even doing what they think: DISTINCT applies to the entire select list, so if they added it and also added columns, they may now be getting more rows, not fewer. The third is performance: on a large result DISTINCT is a full sort or hash aggregate, and if the real goal is "one row per customer" then DISTINCT ON or a window function ranked by a tiebreaker is both faster and correct, because plain DISTINCT gives you no control over which of the duplicate rows survives.',
        aHi: 'Pehla sawaal ye hai ki duplicates kahaan se aa rahe hain, kyunki DISTINCT ek symptom hai, aam taur par fix nahi. Ek single table ke against ek query mein jahaan aapne primary key select kiya, duplicate rows nahi ho saktीं, to wahaan DISTINCT pure overhead hai. Jab duplicates dikhते hain, sabse aam kaaran ek join hai jо rows multiply karता hai: orders ko order_lines se join karके phir order columns select karna prati line ek row deता hai. Sahi fix aam taur par aggregate karna hai — order ko GROUP BY karके lines count ya sum karो — ya join restructure karना, ya EXISTS istemal karना. Doosra sawaal ye hai ki kya DISTINCT wahi kar raha hai jо wo sochте hain: DISTINCT poori select list par lागू hota hai. Teesra performance hai: ek bade result par DISTINCT ek full sort hai, aur agar asli goal "prati customer ek row" hai to DISTINCT ON ya ek window function dono tez aur sahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `product(id int, name text, cost numeric(8,2), markup numeric(4,2))`. Insert 3 rows. Write a `SELECT` that returns: `name`, `cost`, a computed `price` = `cost * (1 + markup)` aliased as `price`, and a computed `label` = `upper(name) || \' ($\' || round(cost * (1 + markup), 2) || \')\'` aliased as `label`. Order by `id`.',
        taskHi: 'Table `product(id int, name text, cost numeric(8,2), markup numeric(4,2))`. 3 rows insert karo. Ek `SELECT` likho jо lautae: `name`, `cost`, ek computed `price` = `cost * (1 + markup)` `price` aliased, aur ek computed `label`. `id` se order karo.',
        hint: '`AS` names each expression. `||` concatenates; wrap the numeric in `round(..., 2)` and Postgres will coerce it to text inside the `||` chain.',
        hintHi: '`AS` har expression ko naam deta hai. `||` concatenate karta hai; numeric ko `round(..., 2)` mein wrap karo aur Postgres ise `||` chain ke andar text mein coerce karega.',
      },
      {
        task: 'Table `event(id int, kind text, city text)` with rows where several `(kind, city)` pairs repeat. Run `SELECT DISTINCT kind FROM event`, then `SELECT DISTINCT kind, city FROM event ORDER BY kind, city`. Confirm the second returns the distinct *pairs* (more rows than the first), not "distinct kinds with a city attached".',
        taskHi: 'Table `event(id int, kind text, city text)` rows ke saath jahaan kई `(kind, city)` pairs repeat hote hain. `SELECT DISTINCT kind FROM event` chalao, phir `SELECT DISTINCT kind, city FROM event ORDER BY kind, city`. Pushti karo ki doosra distinct *pairs* lautaता hai.',
        hint: '`DISTINCT` is applied to the whole projected row. The two queries answer different questions: "which kinds exist" vs "which (kind, city) combinations exist".',
        hintHi: '`DISTINCT` poori projected row par lागू hota hai. Do queries alag sawaalon ka jawab dete hain.',
      },
      {
        task: 'Table `session(user_id int, started_at timestamptz, device text)` with 2 users and 3 sessions each at different times. Use `SELECT DISTINCT ON (user_id) user_id, started_at, device FROM session ORDER BY user_id, started_at DESC` to get each user\'s most recent session. Then note what happens if you remove the `ORDER BY` (Postgres will error or give an arbitrary row).',
        taskHi: 'Table `session(user_id int, started_at timestamptz, device text)` 2 users aur har ek 3 sessions ke saath alag times par. `SELECT DISTINCT ON (user_id) ... ORDER BY user_id, started_at DESC` se har user ka sabse recent session lo. Phir dhyaan do agar aap `ORDER BY` hataते ho to kya hota hai.',
        hint: '`DISTINCT ON (user_id)` keeps the FIRST row per `user_id` as ordered — so the `ORDER BY` must start with `user_id` and then the tiebreaker (`started_at DESC` for "most recent").',
        hintHi: '`DISTINCT ON (user_id)` ordered ke hisaab se prati `user_id` PEHLI row rakhta hai — to `ORDER BY` `user_id` se shuru hona chahिए phir tiebreaker.',
      },
    ],

    keyTakeaways: [
      'PROJECTION = choosing what each output row contains (which columns + computed expressions). It does NOT change which rows come back — that is `WHERE`. The select list is a comma-separated list of EXPRESSIONS: a column, a literal, or a computation (operators + functions).',
      '`AS` renames a result column. `price * 0.9 AS sale_price`. `AS` is optional but write it. Double-quote an alias with spaces: `AS "Sale Price"`. A `SELECT` alias CANNOT be used in the same query\'s `WHERE`/`GROUP BY` (they run first) but CAN in `ORDER BY` (runs after) — Lesson 6.',
      'Operators: `+ - * / %` (integer `/` TRUNCATES — `7/2` = `3`); `||` = string concat (ANY `NULL` operand -> whole result `NULL` — use `concat()` which skips nulls); `= <> < <= > >=` + `IS NULL` (a comparison is itself a `boolean` expression you can select).',
      'Common functions: `upper`/`lower`/`trim`/`length`/`substring`/`replace`, `round(x,n)`/`abs`/`ceil`/`floor`, `coalesce(a,b,...)`/`nullif(a,b)`, `now()`/`extract(field from ts)`. Cast with `x::type` or `CAST(x AS type)`.',
      'A projected expression = a DERIVED / COMPUTED column: it exists only in the result, the table is unchanged. Do light data shaping here (format a name, derive an age, compute a line total).',
      '`DISTINCT` removes duplicate ROWS — "duplicate" = EVERY column in the select list matches. `SELECT DISTINCT a, b` = distinct `(a,b)` PAIRS (often MORE rows, not fewer) — NOT "distinct a, with a b attached".',
      '`DISTINCT` is NOT free (a sort or hash of the whole result). If rows are already unique (you selected the PK) it does nothing but cost time. Don\'t sprinkle it to "fix" duplicates from a join (Module 3) — fix the join.',
      '`DISTINCT ON (expr) ... ORDER BY expr, tiebreak` (Postgres) = one row per distinct `expr`, picked by the `ORDER BY` — e.g. each customer\'s latest order. Non-standard; the portable form is a window function (Module 6). `SELECT DISTINCT a,b` == `SELECT a,b ... GROUP BY a,b` (use GROUP BY when you also aggregate).',
    ],
    keyTakeawaysHi: [
      'PROJECTION = ye chunna ki har output row mein kya hai (kaunse columns + computed expressions). Ye NAHI badalता ki kaunसी rows wapas aati hain — wo `WHERE` hai. Select list EXPRESSIONS ki ek comma-separated list hai.',
      '`AS` ek result column rename karता hai. Ek `SELECT` alias usi query ke `WHERE`/`GROUP BY` mein istemal NAHI ho sakta (wo pehle chalते hain) par `ORDER BY` mein ho SAKTA hai — Lesson 6.',
      'Operators: `+ - * / %` (integer `/` TRUNCATE karता hai — `7/2` = `3`); `||` = string concat (KOI `NULL` operand -> poora result `NULL` — `concat()` istemal karो jо nulls skip karता hai); `= <> < <= > >=` + `IS NULL`.',
      'Aam functions: `upper`/`lower`/`trim`/`length`, `round(x,n)`, `coalesce`/`nullif`, `now()`/`extract`. `x::type` se cast karो.',
      'Ek projected expression = ek DERIVED / COMPUTED column: ye sirf result mein exist karता hai, table unchanged hai. Yahaan light data shaping karो.',
      '`DISTINCT` duplicate ROWS hatаता hai — "duplicate" = select list mein HAR column match karता hai. `SELECT DISTINCT a, b` = distinct `(a,b)` JODIYAN (aksar ZYADA rows) — "distinct a, ek b ke saath" NAHI.',
      '`DISTINCT` MUFT NAHI hai (poore result ka sort ya hash). Agar rows pehle se unique hain to ye kuch nahi karता bस time kharch. Ek join se duplicates "fix" karने ko ise mat chhidkो — join fix karो.',
      '`DISTINCT ON (expr) ... ORDER BY expr, tiebreak` (Postgres) = prati distinct `expr` ek row, `ORDER BY` se chuni — jaise har customer ka latest order. Non-standard; portable form ek window function hai (Module 6).',
    ],
  },

  {
    slug: 'sql-where-filtering',
    title: 'Filtering with `WHERE`: Operators, `AND`/`OR`, `IN`, `BETWEEN`',
    titleHi: '`WHERE` Se Filtering: Operators, `AND`/`OR`, `IN`, `BETWEEN`',
    description: '`WHERE` decides which rows survive. It evaluates a boolean condition for every row and keeps the ones where it is `true` (not `false`, and — importantly — not `NULL`). The condition combines comparisons with `AND`, `OR`, `NOT`, `IN`, `BETWEEN` — and `AND` binds tighter than `OR`, which is the classic trap.',
    descriptionHi: '`WHERE` tय karता hai ki kaunसी rows bachती hain. Ye har row ke liye ek boolean condition evaluate karता hai aur unhe rakhता hai jahaan ye `true` hai (`false` nahi, aur — mahatvapoorn — `NULL` nahi). Condition comparisons ko `AND`, `OR`, `NOT`, `IN`, `BETWEEN` se combine karती hai — aur `AND` `OR` se tighter bind karता hai, jо classic trap hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A bouncer with a checklist at the door.** Every row (person) walks up; the bouncer runs the checklist (the `WHERE` condition) and the row gets in only if the answer is a clear **yes**. A clear "no" is turned away — obviously. But there is a third case that catches people out: if the bouncer *cannot tell* — the ID is smudged, the field is `NULL` — that is **not a yes**, so the row is also turned away. The checklist can have "and" clauses (over 21 **and** on the list) and "or" clauses (a member **or** a plus-one), and the order of operations matters: "on the list or a member and over 21" is read by the bouncer as "on the list, OR (a member and over 21)" — `AND` groups first — which is probably not the rule you meant. Put parentheses where you mean them.',
      hi: '**Darvaze par ek checklist waala ek bouncer.** Har row (vyakti) upar aata hai; bouncer checklist (`WHERE` condition) chalाता hai aur row tabhi andar aati hai jab jawab ek spasht **haan** hai. Ek spasht "nahi" wapas bhej diya jaata hai. Par ek teesra case hai jо logon ko pakadता hai: agar bouncer *bata nahi sakta* — ID smudged hai, field `NULL` hai — wo **ek haan nahi hai**, to row bhi wapas bhej di jaati hai. Checklist mein "and" clauses (21 se upar **aur** list par) aur "or" clauses ho sakti hain, aur operations ka order maayne rakhता hai: "list par ya member aur 21 se upar" bouncer dwara "list par, YA (member aur 21 se upar)" ke roop mein padhा jaata hai — `AND` pehle group karता hai. Jahaan aapका matlab hai wahaan parentheses daalो.',
    },

    simple: `**\`WHERE\` keeps rows where the condition is \`true\`**

\`\`\`sql
SELECT name, salary FROM employee
WHERE dept = 'eng' AND salary > 100000;
\`\`\`

\`\`\`
runs AFTER FROM, BEFORE SELECT   -> cannot reference a SELECT-list alias (Lesson 6)
evaluated PER ROW               -> keeps rows where the condition is exactly true
NOT true (false OR null)        -> row is dropped   (this is the NULL gotcha, Lesson 4)
\`\`\`

**Comparison operators**

\`\`\`sql
WHERE year = 2019
WHERE year <> 2019            -- also written !=
WHERE price >= 20 AND price < 50
WHERE title LIKE 'The %'      -- pattern match: % = any run, _ = one char
WHERE title ILIKE 'the %'     -- Postgres: case-insensitive LIKE
WHERE author IS NULL          -- NOT  = NULL   (Lesson 4)
\`\`\`

**Combining conditions — mind the precedence**

\`\`\`sql
-- AND binds tighter than OR. These are DIFFERENT:
WHERE kind = 'a' OR kind = 'b' AND active        -- = kind='a' OR (kind='b' AND active)
WHERE (kind = 'a' OR kind = 'b') AND active      -- what you almost certainly meant

NOT price > 30      -- = price <= 30 ... but NOT (price > 30) with a NULL price -> NULL -> dropped
\`\`\`

**\`IN\` and \`BETWEEN\` — shorthand**

\`\`\`sql
WHERE dept IN ('eng', 'sales', 'ops')       -- = dept='eng' OR dept='sales' OR dept='ops'
WHERE dept NOT IN ('hr', 'legal')           -- CAUTION: NULL in the list breaks NOT IN (Lesson 4)
WHERE salary BETWEEN 90000 AND 115000       -- INCLUSIVE both ends: salary >= 90000 AND salary <= 115000
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'   -- misses most of Jan 31! (see below)
\`\`\`

\`\`\`
BETWEEN is inclusive on BOTH ends. For a date RANGE, prefer half-open:
  WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
  -- catches every instant in January, no off-by-one at the boundary
\`\`\``,

    simpleHi: `**\`WHERE\` un rows ko rakhता hai jahaan condition \`true\` hai**

\`\`\`sql
SELECT name, salary FROM employee
WHERE dept = 'eng' AND salary > 100000;
\`\`\`

\`\`\`
FROM ke BAAD, SELECT se PEHLE chalता hai   -> ek SELECT-list alias reference nahi kar sakta (Lesson 6)
PRATI ROW evaluate hota hai               -> un rows ko rakhता hai jahaan condition theek true hai
NOT true (false YA null)                  -> row drop ho jaati hai   (ye NULL gotcha hai, Lesson 4)
\`\`\`

**Comparison operators**

\`\`\`sql
WHERE year = 2019
WHERE year <> 2019            -- != bhi likha jaata hai
WHERE price >= 20 AND price < 50
WHERE title LIKE 'The %'      -- pattern match: % = koi bhi run, _ = ek char
WHERE title ILIKE 'the %'     -- Postgres: case-insensitive LIKE
WHERE author IS NULL          -- NAHI  = NULL   (Lesson 4)
\`\`\`

**Conditions combine karна — precedence ka dhyaan**

\`\`\`sql
-- AND, OR se tighter bind karता hai. Ye ALAG hain:
WHERE kind = 'a' OR kind = 'b' AND active        -- = kind='a' OR (kind='b' AND active)
WHERE (kind = 'a' OR kind = 'b') AND active      -- jо aapका lगbhag zaroor matlab tha
\`\`\`

**\`IN\` aur \`BETWEEN\` — shorthand**

\`\`\`sql
WHERE dept IN ('eng', 'sales', 'ops')       -- = dept='eng' OR dept='sales' OR dept='ops'
WHERE dept NOT IN ('hr', 'legal')           -- SAAVDHAN: list mein NULL NOT IN ko toड़ता hai (Lesson 4)
WHERE salary BETWEEN 90000 AND 115000       -- DONO ends INCLUSIVE
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'   -- Jan 31 ka zyादातr miss karता hai!
\`\`\`

\`\`\`
BETWEEN DONO ends par inclusive hai. Ek date RANGE ke liye, half-open prefer karो:
  WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
\`\`\``,

    content: `## What \`WHERE\` does

\`WHERE\` takes a **boolean expression** and evaluates it for every row produced by \`FROM\`. A row is kept **only if the expression evaluates to \`true\`**. If it evaluates to \`false\` *or* to \`NULL\` (unknown), the row is dropped. That "\`NULL\` is not \`true\`, so the row is dropped" behaviour is the single most common source of surprising results, and Lesson 4 covers it in full.

\`WHERE\` runs **after \`FROM\` and before the \`SELECT\` list** in the logical processing order (Lesson 6). Consequences: you cannot reference a select-list alias in \`WHERE\`, and \`WHERE\` filters *rows*, before any grouping — a condition on an *aggregate* (like \`sum(x) > 100\`) goes in \`HAVING\`, not \`WHERE\` (Module 4).

## Comparison operators

- **\`=\`** equality, **\`<>\`** or **\`!=\`** inequality, **\`< <= > >=\`** ordering. These work on numbers, strings (lexicographic / collation order), dates, and booleans.
- **\`IS NULL\` / \`IS NOT NULL\`** — the *only* correct way to test for \`NULL\`. \`x = NULL\` is always \`NULL\`, never \`true\` (Lesson 4).
- **\`IS DISTINCT FROM\` / \`IS NOT DISTINCT FROM\`** — like \`<>\` / \`=\` but treats \`NULL\` as a comparable value (\`NULL IS NOT DISTINCT FROM NULL\` is \`true\`).
- **\`LIKE\`** — pattern match: \`%\` matches any sequence of characters (including none), \`_\` matches exactly one. \`WHERE email LIKE '%@gmail.com'\`. Case-sensitive. **\`ILIKE\`** (Postgres) is the case-insensitive version. \`~\` and \`~*\` are regex match / case-insensitive regex.
- **\`IN (v1, v2, ...)\`** — true if the value equals any listed value. Shorthand for a chain of \`OR\`s. \`IN\` can also take a subquery (Module 5).
- **\`BETWEEN a AND b\`** — shorthand for \`x >= a AND x <= b\`. **Inclusive on both ends.**

## Precedence: \`AND\` before \`OR\`

This is the classic SQL bug. \`NOT\` binds tightest, then \`AND\`, then \`OR\`. So:

\`\`\`sql
WHERE status = 'active' OR status = 'trial' AND plan = 'pro'
\`\`\`

is parsed as \`status = 'active' OR (status = 'trial' AND plan = 'pro')\` — which returns *every* active row regardless of plan, plus trial-pro rows. If you meant "active or trial, and also pro", you must parenthesise:

\`\`\`sql
WHERE (status = 'active' OR status = 'trial') AND plan = 'pro'
\`\`\`

**Rule of thumb: whenever a \`WHERE\` mixes \`AND\` and \`OR\`, add parentheses even where they are technically redundant.** It removes all doubt for the next reader (and for you in six months).

\`NOT\` has its own trap: \`NOT (price > 30)\` is *not* the same as \`price <= 30\` when \`price\` is \`NULL\` — the first is \`NOT NULL\` = \`NULL\` = dropped, the second is also \`NULL\` = dropped, so here they agree, but \`NOT (x IN (1,2,3))\` with a \`NULL\` \`x\` behaves in ways people do not expect (Lesson 4).

## \`IN\` and \`NOT IN\`

\`x IN (a, b, c)\` is \`x = a OR x = b OR x = c\`. Clean and readable.

\`x NOT IN (a, b, c)\` is \`x <> a AND x <> b AND x <> c\`. **This breaks if the list contains \`NULL\`:** \`x <> NULL\` is \`NULL\`, so the whole \`AND\` chain can never be \`true\`, and \`NOT IN\` silently returns *no rows*. If the list might contain \`NULL\` (especially a subquery list), use \`NOT EXISTS\` instead (Module 5). This is one of the highest-value gotchas in SQL.

## \`BETWEEN\` and date ranges

\`BETWEEN\` is inclusive on both ends, which is fine for discrete values (\`year BETWEEN 2000 AND 2009\` — exactly the 2000s). It is a **trap for timestamps**:

\`\`\`sql
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'
\`\`\`

\`'2026-01-31'\` with no time part is \`2026-01-31 00:00:00\`, so this misses everything that happened *during* January 31st. For any range over a continuous quantity (timestamps, and often \`numeric\`), use the **half-open** form:

\`\`\`sql
WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
\`\`\`

\`>= start\` and \`< end\`: every instant in the period, no off-by-one, and consecutive ranges tile perfectly with no gap or overlap.

## Strings and case

\`WHERE name = 'ada'\` will not match a stored \`'Ada'\` — \`=\` on \`text\` is case-sensitive (and collation-sensitive). For case-insensitive matching: \`WHERE lower(name) = 'ada'\` (but this defeats a plain index on \`name\` unless you index \`lower(name)\`), or \`WHERE name ILIKE 'ada'\`, or a \`citext\` column. Similarly, trailing spaces matter: \`'ada '\` \`<>\` \`'ada'\`.`,

    contentHi: `## \`WHERE\` kya karता hai

\`WHERE\` ek **boolean expression** leता hai aur ise \`FROM\` dwara produce ki har row ke liye evaluate karता hai. Ek row **tabhi rakhी jaati hai jab expression \`true\` evaluate hota hai**. Agar ye \`false\` *ya* \`NULL\` (unknown) evaluate hota hai, row drop ho jaati hai. Wo "\`NULL\` \`true\` nahi hai, to row drop hoती hai" behaviour aश्चaryajanak results ka sabse aam source hai, aur Lesson 4 ise poori tarah cover karta hai.

\`WHERE\` logical processing order mein **\`FROM\` ke baad aur \`SELECT\` list se pehle** chalता hai (Lesson 6). Parinaम: aap \`WHERE\` mein ek select-list alias reference nahi kar sakte, aur \`WHERE\` *rows* filter karता hai — ek *aggregate* par ek condition (jaise \`sum(x) > 100\`) \`HAVING\` mein jaati hai, \`WHERE\` mein nahi (Module 4).

## Comparison operators

- **\`=\`**, **\`<>\`** ya **\`!=\`**, **\`< <= > >=\`**.
- **\`IS NULL\` / \`IS NOT NULL\`** — \`NULL\` ke liye test karने ka *ekmatra* sahi tareeka. \`x = NULL\` hamesha \`NULL\` hai (Lesson 4).
- **\`IS DISTINCT FROM\`** — \`<>\` jaisा par \`NULL\` ko ek comparable value ke roop mein treat karता hai.
- **\`LIKE\`** — pattern match: \`%\` koi bhi sequence, \`_\` theek ek char. Case-sensitive. **\`ILIKE\`** (Postgres) case-insensitive hai.
- **\`IN (v1, v2, ...)\`** — true agar value kisi listed value ke barabar hai.
- **\`BETWEEN a AND b\`** — \`x >= a AND x <= b\` ke liye shorthand. **Dono ends par inclusive.**

## Precedence: \`AND\` \`OR\` se pehle

Ye classic SQL bug hai. \`NOT\` tightest bind karता hai, phir \`AND\`, phir \`OR\`. To:

\`\`\`sql
WHERE status = 'active' OR status = 'trial' AND plan = 'pro'
\`\`\`

\`status = 'active' OR (status = 'trial' AND plan = 'pro')\` ke roop mein parse hota hai — jо plan ki parwah kiye bina *har* active row lautाता hai. Agar aapका matlab "active ya trial, aur pro bhi" tha, aapको parenthesise karna hoga.

**Rule of thumb: jab bhi ek \`WHERE\` \`AND\` aur \`OR\` mix karता hai, parentheses add karो even jahaan wo technically redundant hain.**

## \`IN\` aur \`NOT IN\`

\`x IN (a, b, c)\` \`x = a OR x = b OR x = c\` hai.

\`x NOT IN (a, b, c)\` \`x <> a AND x <> b AND x <> c\` hai. **Ye toड़ता hai agar list mein \`NULL\` hai:** \`x <> NULL\` \`NULL\` hai, to poora \`AND\` chain kabhi \`true\` nahi ho sakta, aur \`NOT IN\` chupchaap *koi rows* nahi lautाता. Agar list mein \`NULL\` ho sakta hai (khaaskar ek subquery list), \`NOT EXISTS\` istemal karो (Module 5).

## \`BETWEEN\` aur date ranges

\`BETWEEN\` dono ends par inclusive hai, jо discrete values ke liye theek hai. Ye **timestamps ke liye ek trap** hai:

\`\`\`sql
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'
\`\`\`

\`'2026-01-31'\` bina time part ke \`2026-01-31 00:00:00\` hai, to ye sab kuch miss karता hai jо January 31st *ke dauran* hua. Ek continuous quantity par kisi bhi range ke liye, **half-open** form istemal karो:

\`\`\`sql
WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
\`\`\`

## Strings aur case

\`WHERE name = 'ada'\` ek stored \`'Ada'\` se match nahi karega — \`text\` par \`=\` case-sensitive hai. Case-insensitive matching ke liye: \`WHERE lower(name) = 'ada'\` (par ye \`name\` par ek plain index ko haraता hai jab tak aap \`lower(name)\` index na karो), ya \`WHERE name ILIKE 'ada'\`, ya ek \`citext\` column.`,

    examples: [
      {
        title: 'WHERE with AND: both conditions must hold',
        titleHi: 'AND ke saath WHERE: dono conditions hone chahिए',
        code: `CREATE TABLE employee (id int, name text, dept text, salary int, hired date);
INSERT INTO employee VALUES
  (1, 'Ada', 'eng',   120000, '2020-03-01'),
  (2, 'Bo',  'eng',    95000, '2021-07-15'),
  (3, 'Cy',  'sales',  80000, '2019-11-20'),
  (4, 'Di',  'sales', 110000, '2022-01-10'),
  (5, 'Ed',  'ops',    70000, '2023-05-05');

SELECT name, dept, salary
FROM employee
WHERE dept = 'eng' AND salary > 100000
ORDER BY name;`,
        output: ` name | dept | salary
------+------+--------
 Ada  | eng  | 120000
(1 row)`,
        explain: "`WHERE dept = 'eng' AND salary > 100000` is evaluated per row and keeps a row only when BOTH parts are `true`. Ada (eng, 120000) passes; Bo (eng, 95000) fails the salary test; the sales and ops rows fail the dept test. `ORDER BY name` then sorts the single surviving row.",
        explainHi: "`WHERE dept = 'eng' AND salary > 100000` prati row evaluate hota hai aur ek row ko sirf tab rakhta hai jab DONO parts `true` hon. Ada (eng, 120000) pass; Bo (eng, 95000) salary test fail karta hai; sales aur ops rows dept test fail karte hain. `ORDER BY name` phir single bachi row sort karta hai.",
      },
      {
        title: 'The AND/OR precedence trap: parentheses change the result',
        titleHi: 'AND/OR precedence trap: parentheses result badalte hain',
        code: `CREATE TABLE ticket (id int, kind text, urgent boolean);
INSERT INTO ticket VALUES
  (1, 'bug',     true),
  (2, 'bug',     false),
  (3, 'feature', true),
  (4, 'feature', false),
  (5, 'chore',   true);

-- WITHOUT parens: kind='bug' OR (kind='feature' AND urgent)
SELECT id, kind, urgent FROM ticket
WHERE kind = 'bug' OR kind = 'feature' AND urgent
ORDER BY id;

-- WITH parens: (kind='bug' OR kind='feature') AND urgent
SELECT id, kind, urgent FROM ticket
WHERE (kind = 'bug' OR kind = 'feature') AND urgent
ORDER BY id;`,
        output: ` id | kind    | urgent
----+---------+--------
 1  | bug     | t
 2  | bug     | f
 3  | feature | t
(3 rows)

 id | kind    | urgent
----+---------+--------
 1  | bug     | t
 3  | feature | t
(2 rows)`,
        explain: "`AND` binds tighter than `OR`, so the first query is `kind='bug' OR (kind='feature' AND urgent)` — every bug row passes regardless of `urgent`, plus urgent features (3 rows). Parenthesising as `(kind='bug' OR kind='feature') AND urgent` applies the `urgent` filter to both kinds (2 rows). Same tokens, different meaning.",
        explainHi: "`AND` `OR` se tighter bind karta hai, to pehli query `kind='bug' OR (kind='feature' AND urgent)` hai — har bug row `urgent` ki parwah kiye bina pass hota hai, plus urgent features (3 rows). `(kind='bug' OR kind='feature') AND urgent` ke roop mein parenthesise karna `urgent` filter dono kinds par lagu karta hai (2 rows). Wahi tokens, alag matlab.",
      },
      {
        title: 'IN and BETWEEN as shorthand',
        titleHi: 'IN aur BETWEEN shorthand ke roop mein',
        code: `CREATE TABLE employee (id int, name text, dept text, salary int);
INSERT INTO employee VALUES
  (1,'Ada','eng',120000), (2,'Bo','eng',95000), (3,'Cy','sales',80000),
  (4,'Di','sales',110000), (5,'Ed','ops',70000), (6,'Fi','hr',60000);

SELECT name, dept, salary
FROM employee
WHERE dept IN ('eng', 'sales')
  AND salary BETWEEN 90000 AND 115000
ORDER BY salary DESC;`,
        output: ` name | dept  | salary
------+-------+--------
 Di   | sales | 110000
 Bo   | eng   | 95000
(2 rows)`,
        explain: "`dept IN ('eng', 'sales')` is shorthand for `dept = 'eng' OR dept = 'sales'`. `salary BETWEEN 90000 AND 115000` is `salary >= 90000 AND salary <= 115000` — inclusive on BOTH ends. Di (110000) and Bo (95000) satisfy both; the others fail one or the other. `ORDER BY salary DESC` sorts them.",
        explainHi: "`dept IN ('eng', 'sales')` `dept = 'eng' OR dept = 'sales'` ka shorthand hai. `salary BETWEEN 90000 AND 115000` `salary >= 90000 AND salary <= 115000` hai — DONO ends par inclusive. Di (110000) aur Bo (95000) dono satisfy karte hain; baaki ek ya doosra fail karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `SELECT * FROM subscription
WHERE plan = 'free' OR plan = 'trial' AND created_at < '2026-01-01';
-- intent: free-or-trial subs created before 2026
-- actual: ALL free subs (any date) + trial subs created before 2026`,
        right: `SELECT * FROM subscription
WHERE (plan = 'free' OR plan = 'trial') AND created_at < '2026-01-01';`,
        why: 'AND binds tighter than OR, so the database reads the unparenthesised version as plan = free OR (plan = trial AND created_at < ...). The date filter only applies to the trial branch; every free row passes regardless of date. Whenever a WHERE clause mixes AND and OR, wrap the OR group in parentheses — even when precedence would technically give the right answer, because the explicit version is the one the next person reads correctly.',
        whyHi: 'AND, OR se tighter bind karता hai, to database bina-parentheses version ko plan = free OR (plan = trial AND created_at < ...) ke roop mein padhता hai. Date filter sirf trial branch par lागू hota hai; har free row date ki parwah kiye bina pass hoती hai. Jab bhi ek WHERE clause AND aur OR mix karता hai, OR group ko parentheses mein wrap karो.',
      },
      {
        wrong: `SELECT * FROM product
WHERE category NOT IN ('discontinued', 'internal', NULL);
-- returns ZERO rows, always -- even products that are clearly in neither category`,
        right: `SELECT * FROM product
WHERE category NOT IN ('discontinued', 'internal')
  AND category IS NOT NULL;         -- or filter the NULL out of the list first
-- for a subquery list, use NOT EXISTS (Module 5) which is NULL-safe`,
        why: 'NOT IN (a, b, NULL) expands to category <> a AND category <> b AND category <> NULL. That last term, category <> NULL, evaluates to NULL for every row, and NULL AND anything is at best NULL, never true — so the whole condition is never true and you get no rows. A literal NULL in a NOT IN list, or a subquery that can return NULL, silently zeroes the result. Either guarantee no NULLs in the list, or use NOT EXISTS.',
        whyHi: 'NOT IN (a, b, NULL) category <> a AND category <> b AND category <> NULL mein expand hota hai. Wo aakhri term, category <> NULL, har row ke liye NULL evaluate hota hai, aur NULL AND kuch bhi behtar se behtar NULL hai, kabhi true nahi — to poori condition kabhi true nahi hoती aur aapको koi rows nahi milती. Ya list mein koi NULLs guarantee karो, ya NOT EXISTS istemal karो.',
      },
      {
        wrong: `SELECT count(*) FROM event
WHERE occurred_at BETWEEN '2026-06-01' AND '2026-06-30';
-- silently omits everything on June 30 after midnight -- ~1 day of data missing`,
        right: `SELECT count(*) FROM event
WHERE occurred_at >= '2026-06-01'
  AND occurred_at <  '2026-07-01';   -- half-open: every instant in June, no boundary bug`,
        why: 'BETWEEN is inclusive on both ends, and a bare date string like 2026-06-30 is interpreted as 2026-06-30 00:00:00. So BETWEEN start AND 2026-06-30 stops at the very first instant of June 30 and drops the other 23-plus hours of that day. For any range over a timestamp (or any continuous value), use the half-open pattern: >= the start and < the day after the end. Consecutive half-open ranges also tile perfectly, so a "this month" and "last month" query never double-count or miss the boundary row.',
        whyHi: 'BETWEEN dono ends par inclusive hai, aur ek bare date string jaise 2026-06-30 ko 2026-06-30 00:00:00 ke roop mein interpret kiya jaata hai. To BETWEEN start AND 2026-06-30 June 30 ke pehle hi instant par ruk jaता hai aur us din ke doosre 23-plus ghante drop kar deта hai. Ek timestamp par kisi bhi range ke liye, half-open pattern istemal karो: >= start aur < end ke agle din. Consecutive half-open ranges perfectly tile bhi karте hain.',
      },
    ],

    realWorld: [
      {
        en: '**Half-open date ranges everywhere in reporting** — every "orders this week / this month / this quarter" query is `created_at >= :start AND created_at < :end`, and the boundaries are computed as `date_trunc(\'month\', now())` etc., so adjacent periods tile with no gap and no double-count.',
        hi: '**Reporting mein har jagah half-open date ranges** — har "is hafte / is mahine orders" query `created_at >= :start AND created_at < :end` hai, aur boundaries `date_trunc(\'month\', now())` ke roop mein compute hoती hain.',
      },
      {
        en: '**Parenthesised `OR` groups as a lint rule** — a SQL review checklist item: "any `WHERE` mixing `AND` and `OR` must parenthesise the `OR`". Catches the precedence bug before it ships a query that returns 10x the intended rows.',
        hi: '**Parenthesised `OR` groups ek lint rule ke roop mein** — ek SQL review checklist item: "`AND` aur `OR` mix karता koi bhi `WHERE` `OR` ko parenthesise kare".',
      },
      {
        en: '**`NOT EXISTS` instead of `NOT IN` for "customers with no orders"** — because the `orders.customer_id` subquery can contain `NULL` and `NOT IN` would silently return nothing; the team\'s convention is `NOT IN` only for hard-coded, `NULL`-free literal lists.',
        hi: '**"bina orders waale customers" ke liye `NOT IN` ke bजाy `NOT EXISTS`** — kyunki `orders.customer_id` subquery mein `NULL` ho sakta hai aur `NOT IN` chupchaap kuch nahi lautाता; team ka convention `NOT IN` sirf hard-coded, `NULL`-free literal lists ke liye hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the `AND`/`OR` precedence trap and the `NOT IN` with `NULL` trap.',
        qHi: '`AND`/`OR` precedence trap aur `NULL` ke saath `NOT IN` trap samjhाओ.',
        a: 'In SQL, NOT binds tightest, then AND, then OR — same as most languages. So a WHERE like "status = active OR status = trial AND plan = pro" is parsed as "status = active OR (status = trial AND plan = pro)". If the intent was "the subscription is active or trial, and additionally it is on the pro plan", this is wrong: it returns every active subscription regardless of plan, plus the trial-pro ones. The fix is to parenthesise the OR group explicitly, and the discipline is to always add those parentheses whenever a WHERE mixes AND and OR, even when the default precedence happens to be correct, so the next reader is not relying on remembering the rule. The NOT IN trap is about three-valued logic. NOT IN (a, b, c) expands to "x <> a AND x <> b AND x <> c". If any element of that list is NULL — a literal NULL, or more commonly a subquery whose column is nullable — then one of those terms becomes "x <> NULL", which evaluates to NULL for every row. NULL AND anything can be NULL or false but never true, so the entire condition is never true and NOT IN silently returns zero rows, even rows that obviously match none of the non-null values. IN does not have this problem because "x = NULL" being NULL just means that one comparison does not contribute a match. The safe alternatives are to guarantee the list has no NULLs, or to use NOT EXISTS with a correlated subquery, which handles NULL correctly.',
        aHi: 'SQL mein, NOT tightest bind karता hai, phir AND, phir OR. To ek WHERE jaise "status = active OR status = trial AND plan = pro" "status = active OR (status = trial AND plan = pro)" ke roop mein parse hota hai. Agar intent "subscription active ya trial hai, aur additionally pro plan par hai" tha, ye galat hai: ye plan ki parwah kiye bina har active subscription lautाता hai. Fix OR group ko explicitly parenthesise karna hai, aur discipline hmeshा wo parentheses add karna hai jab bhi ek WHERE AND aur OR mix karता hai. NOT IN trap three-valued logic ke baare mein hai. NOT IN (a, b, c) "x <> a AND x <> b AND x <> c" mein expand hota hai. Agar us list ka koi element NULL hai, to un terms mein se ek "x <> NULL" ban jaता hai, jо har row ke liye NULL evaluate hota hai. NULL AND kuch bhi NULL ya false ho sakta hai par kabhi true nahi, to poori condition kabhi true nahi hoती aur NOT IN chupchaap zero rows lautाता hai. Surakshit vikalp ye guarantee karna hai ki list mein koi NULLs nahi, ya NOT EXISTS istemal karna.',
      },
      {
        q: 'Why prefer `created_at >= start AND created_at < end` over `BETWEEN` for date ranges?',
        qHi: 'Date ranges ke liye `BETWEEN` par `created_at >= start AND created_at < end` kyun prefer karein?',
        a: 'BETWEEN a AND b is exactly "x >= a AND x <= b" — inclusive on both ends. For discrete values that is often what you want: year BETWEEN 2000 AND 2009 is precisely the decade. The problem is timestamps. A bare date literal like 2026-06-30 has an implicit time of midnight, so "occurred_at BETWEEN 2026-06-01 AND 2026-06-30" actually means "from the first instant of June 1 up to and including the first instant of June 30" — it drops everything that happened during June 30 after midnight, roughly a full day of data, silently. You could patch it by writing the end as 2026-06-30 23:59:59.999999, but that is fragile: it depends on the column\'s precision, and it still is not quite the boundary. The clean pattern is half-open: occurred_at >= 2026-06-01 AND occurred_at < 2026-07-01. That captures every instant in June with no rounding, it does not care about the timestamp precision, and crucially consecutive periods tile perfectly — the end of one range is exactly the start of the next, so a dashboard comparing "this month" and "last month" never double-counts a row on the boundary and never misses one. Half-open intervals are the standard way to slice continuous quantities, not just time.',
        aHi: 'BETWEEN a AND b theek "x >= a AND x <= b" hai — dono ends par inclusive. Discrete values ke liye wo aksar wahi hai jо aap chahते ho: year BETWEEN 2000 AND 2009 theek decade hai. Problem timestamps hai. Ek bare date literal jaise 2026-06-30 ka ek implicit time midnight hai, to "occurred_at BETWEEN 2026-06-01 AND 2026-06-30" asal mein "June 1 ke pehle instant se June 30 ke pehle instant tak aur usme shamil" ka matlab hai — ye June 30 ke dauran midnight ke baad jо hua sab drop karता hai, lगbhag ek poora din data, chupchaap. Saaf pattern half-open hai: occurred_at >= 2026-06-01 AND occurred_at < 2026-07-01. Ye June mein har instant capture karता hai bina rounding ke, aur mahatvapoorn roop se consecutive periods perfectly tile karте hain.',
      },
    ],

    exercises: [
      {
        task: 'Table `ticket(id int, kind text, urgent boolean)` with 5 rows spanning kinds `bug`/`feature`/`chore` and both `urgent` values. Run `WHERE kind = \'bug\' OR kind = \'feature\' AND urgent` and then `WHERE (kind = \'bug\' OR kind = \'feature\') AND urgent`. Confirm the first returns MORE rows (all bugs regardless of urgency, plus urgent features) and explain why in one sentence.',
        taskHi: 'Table `ticket(id int, kind text, urgent boolean)` 5 rows ke saath. `WHERE kind = \'bug\' OR kind = \'feature\' AND urgent` chalao phir `WHERE (kind = \'bug\' OR kind = \'feature\') AND urgent`. Pushti karo ki pehla ZYADA rows lautaता hai aur ek vakya mein kyun samjhाओ.',
        hint: '`AND` binds tighter than `OR`, so without parens the condition is `kind=\'bug\' OR (kind=\'feature\' AND urgent)` — the `urgent` filter never touches the `bug` rows.',
        hintHi: '`AND`, `OR` se tighter bind karता hai, to bina parens ke condition `kind=\'bug\' OR (kind=\'feature\' AND urgent)` hai.',
      },
      {
        task: 'Table `product(id int, name text, status text)` with statuses including some `NULL`. Run `SELECT * FROM product WHERE status NOT IN (\'archived\', \'hidden\')` and count the rows. Then add a `NULL` to the list: `WHERE status NOT IN (\'archived\', \'hidden\', NULL)` and count again — it should be `0`. Fix it with `... AND status IS NOT NULL`.',
        taskHi: 'Table `product(id int, name text, status text)` kuch `NULL` statuses ke saath. `SELECT * FROM product WHERE status NOT IN (\'archived\', \'hidden\')` chalao aur rows count karo. Phir list mein ek `NULL` add karo aur phir count karo — `0` hona chahिए. `... AND status IS NOT NULL` se fix karo.',
        hint: '`NOT IN (..., NULL)` becomes `... AND status <> NULL`, and `status <> NULL` is `NULL` for every row, so the whole `AND` chain can never be `true`.',
        hintHi: '`NOT IN (..., NULL)` `... AND status <> NULL` ban jaता hai, aur `status <> NULL` har row ke liye `NULL` hai.',
      },
      {
        task: 'Table `event(id int, occurred_at timestamptz)`. Insert events across June including one at `2026-06-30 14:00:00+00` and one at `2026-06-30 23:30:00+00`. Run `WHERE occurred_at BETWEEN \'2026-06-01\' AND \'2026-06-30\'` and note both June 30 afternoon/evening events are MISSING. Rewrite as `occurred_at >= \'2026-06-01\' AND occurred_at < \'2026-07-01\'` and confirm they now appear.',
        taskHi: 'Table `event(id int, occurred_at timestamptz)`. June mein events insert karo jismें ek `2026-06-30 14:00:00+00` par ho aur ek `2026-06-30 23:30:00+00` par. `WHERE occurred_at BETWEEN \'2026-06-01\' AND \'2026-06-30\'` chalao aur dhyaan do ki dono June 30 events MISSING hain. `occurred_at >= \'2026-06-01\' AND occurred_at < \'2026-07-01\'` ke roop mein rewrite karo.',
        hint: '`\'2026-06-30\'` = `2026-06-30 00:00:00`, so `BETWEEN` stops there. The half-open form `< \'2026-07-01\'` includes every instant of June 30.',
        hintHi: '`\'2026-06-30\'` = `2026-06-30 00:00:00`, to `BETWEEN` wahaan ruk jaता hai. Half-open form `< \'2026-07-01\'` June 30 ka har instant shamil karता hai.',
      },
    ],

    keyTakeaways: [
      '`WHERE` evaluates a BOOLEAN expression per row and keeps rows where it is EXACTLY `true`. `false` OR `NULL` -> row dropped. Runs AFTER `FROM`, BEFORE `SELECT` -> no select-list alias in `WHERE`; a condition on an AGGREGATE goes in `HAVING` not `WHERE` (Module 4).',
      'Operators: `=` `<>`/`!=` `< <= > >=`; `IS NULL`/`IS NOT NULL` (the ONLY correct NULL test — `x = NULL` is always `NULL`); `IS DISTINCT FROM` (NULL-safe `<>`); `LIKE`/`ILIKE` (`%` = any run, `_` = one char; `ILIKE` = case-insensitive, Postgres); `~`/`~*` (regex).',
      'PRECEDENCE: `NOT` > `AND` > `OR`. `a = x OR a = y AND b` parses as `a = x OR (a = y AND b)`. RULE: whenever a `WHERE` mixes `AND` and `OR`, PARENTHESISE the `OR` group — even when redundant.',
      '`x IN (a,b,c)` = `x=a OR x=b OR x=c` (clean). `x NOT IN (a,b,c)` = `x<>a AND x<>b AND x<>c` — BREAKS if the list contains `NULL` (`x <> NULL` is `NULL` -> the AND chain is never `true` -> ZERO rows, silently). For a nullable subquery list use `NOT EXISTS` (Module 5).',
      '`BETWEEN a AND b` = `x >= a AND x <= b` — INCLUSIVE on BOTH ends. Fine for discrete values (`year BETWEEN 2000 AND 2009`).',
      'For a TIMESTAMP / continuous range, `BETWEEN` is a TRAP: `\'2026-06-30\'` = midnight, so `BETWEEN start AND \'2026-06-30\'` drops all of June 30 after 00:00. Use HALF-OPEN: `>= start AND < end` — every instant, no off-by-one, consecutive ranges tile perfectly.',
      '`=` on `text` is CASE- and collation-SENSITIVE: `\'ada\'` does not match stored `\'Ada\'`, and trailing spaces matter. Case-insensitive: `lower(name) = \'ada\'` (needs a `lower(name)` index to stay fast), `name ILIKE \'ada\'`, or a `citext` column.',
      '`WHERE` filters ROWS only. It cannot see aggregates, window functions, or select-list aliases (all computed later). This is the logical-processing-order rule — Lesson 6.',
    ],
    keyTakeawaysHi: [
      '`WHERE` prati row ek BOOLEAN expression evaluate karता hai aur un rows ko rakhता hai jahaan ye THEEK `true` hai. `false` YA `NULL` -> row drop. `FROM` ke BAAD, `SELECT` se PEHLE chalता hai -> `WHERE` mein koi select-list alias nahi; ek AGGREGATE par ek condition `HAVING` mein jaati hai (Module 4).',
      'Operators: `=` `<>`/`!=` `< <= > >=`; `IS NULL`/`IS NOT NULL` (EKMATRA sahi NULL test); `IS DISTINCT FROM` (NULL-safe `<>`); `LIKE`/`ILIKE` (`%` = koi run, `_` = ek char; `ILIKE` case-insensitive, Postgres); `~`/`~*` (regex).',
      'PRECEDENCE: `NOT` > `AND` > `OR`. `a = x OR a = y AND b` `a = x OR (a = y AND b)` ke roop mein parse hota hai. RULE: jab bhi ek `WHERE` `AND` aur `OR` mix karता hai, `OR` group ko PARENTHESISE karो.',
      '`x IN (a,b,c)` = `x=a OR x=b OR x=c`. `x NOT IN (a,b,c)` = `x<>a AND x<>b AND x<>c` — TODTA hai agar list mein `NULL` hai (`x <> NULL` `NULL` hai -> AND chain kabhi `true` nahi -> ZERO rows, chupchaap). Ek nullable subquery list ke liye `NOT EXISTS` (Module 5).',
      '`BETWEEN a AND b` = `x >= a AND x <= b` — DONO ends par INCLUSIVE. Discrete values ke liye theek.',
      'Ek TIMESTAMP / continuous range ke liye, `BETWEEN` ek TRAP hai: `\'2026-06-30\'` = midnight. HALF-OPEN istemal karो: `>= start AND < end` — har instant, koi off-by-one nahi, consecutive ranges perfectly tile.',
      '`text` par `=` CASE- aur collation-SENSITIVE hai: `\'ada\'` stored `\'Ada\'` se match nahi karता. Case-insensitive: `lower(name) = \'ada\'`, `name ILIKE \'ada\'`, ya ek `citext` column.',
      '`WHERE` sirf ROWS filter karता hai. Ye aggregates, window functions, ya select-list aliases nahi dekh sakta (sab baad mein computed). Ye logical-processing-order rule hai — Lesson 6.',
    ],
  },
];
