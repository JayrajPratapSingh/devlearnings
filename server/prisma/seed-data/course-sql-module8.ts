/**
 * Databases Complete Course — Module 8: DDL, Constraints & Schema Evolution, lessons 1-3.
 *
 * Lesson 1: Choosing column types — int sizes and overflow, numeric vs floating point,
 *           varchar(n) vs text, timestamptz vs timestamp, boolean, uuid, arrays, and a
 *           pointer to jsonb (Module 11).
 * Lesson 2: Table & column constraints — NOT NULL, DEFAULT, UNIQUE, named and
 *           multi-column CHECK constraints, and how PRIMARY KEY/FOREIGN KEY (Module 7)
 *           fit into the same picture.
 * Lesson 3: Generated columns — GENERATED ALWAYS AS (...) STORED, why you cannot write
 *           to one directly, and how it closes the "derived value drifts out of sync"
 *           gap from Module 7's 3NF lesson.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 8
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_8: CourseLesson[] = [
  {
    slug: 'sql-choosing-column-types',
    title: 'Choosing Column Types',
    titleHi: 'Column Types Chunna',
    description: 'Every column type is a trade-off you make once, at design time, that every future row inherits: how big a number can get before it overflows, how much precision survives arithmetic, how long a string can be, and whether a timestamp remembers what timezone it was written in.',
    descriptionHi: 'Har column type ek trade-off hai jo aap design time par ek baar karte ho, jo har future row inherit karti hai: ek number kितna bada ho sakta hai overflow hone se pehle, arithmetic ke baad kितni precision bachती hai, ek string kितni lambi ho sakti hai, aur kya ek timestamp yaad rakhta hai ki ye kaunसे timezone mein likha gaya tha.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Choosing the right size container before you know how full it will get.** A shipping company that labels every box "small" regardless of contents will eventually try to force a refrigerator into it — the box was the wrong choice from day one, and the failure only shows up the day someone ships something too big. Picking `int` for a column that will count page views is exactly that: it works for years, comfortably, until the count crosses about 2.1 billion and the next increment fails outright, not gracefully. Picking `numeric` for money instead of `float` is the opposite kind of care — a shipping label that says "handle as fragile, exact contents matter", because a few cents of floating-point rounding error, invisible in a demo, becomes a real accounting discrepancy at scale. And writing down a delivery time as "3pm" without saying *which city\'s 3pm* is `timestamp` without a timezone — it reads fine until the package crosses a timezone boundary and nobody can say for certain when "3pm" actually was.',
      hi: '**Sahi size ka container chunना ye jaanne se pehle ki wo кितna bhar jाएga.** Ek shipping company jo har box ko "small" label karti hai contents ke bavjood, aakhirkar ek refrigerator ko usmein force karne ki koshish karegi — box din ek se hi galat choice thi, aur failure sirf tab dikhती hai jab koi bahut bada kuch ship karta hai. Ek column ke liye `int` chunna jo page views ginega theek yahi hai: ye salों tak comfortably kaam karta hai, jab tak count lगभग 2.1 billion cross nahi karta aur agla increment seedhे fail ho jaता hai, gracefully nahi. Money ke liye `float` ke bजाy `numeric` chunna care ka ulта tarika hai — ek shipping label jo kehta hai "fragile ki tarah handle karo, exact contents maayne rakhte hain", kyunki chand cents ka floating-point rounding error, ek demo mein invisible, scale par ek real accounting discrepancy ban jaता hai. Aur ek delivery time ko "3pm" likhна ye bataye bina ki *kaunसे city ka* 3pm hai `timestamp` bina timezone ke hai — ye theek padhta hai jab tak package ek timezone boundary cross nahi karta aur koi pakka nahi keh sakta ki "3pm" asal mein kab tha.',
    },

    simple: `**Integer sizes — pick based on the largest value you will EVER need**

\`\`\`sql
smallint   -- -32,768 to 32,767            (2 bytes)
int        -- about -2.1 billion to 2.1 billion   (4 bytes)  -- the default choice
bigint     -- about ±9.2 * 10^18            (8 bytes)  -- IDs, counters that grow for years
\`\`\`

\`\`\`sql
CREATE TABLE t (a int);
INSERT INTO t VALUES (2147483647);      -- the max int value
UPDATE t SET a = a + 1;                 -- ERROR: integer out of range
\`\`\`

**\`numeric(p, s)\` — exact, for money and anything requiring precision**

\`\`\`sql
CREATE TABLE t (price numeric(10, 2));  -- up to 10 total digits, 2 after the point
INSERT INTO t VALUES (19.999);
SELECT price FROM t;                    -- 20.00 -- ROUNDED to the declared scale on insert
\`\`\`

**\`double precision\` / \`real\` — fast, approximate — never for money**

\`\`\`sql
-- binary floating point cannot represent most decimals exactly (Module 2) --
-- use numeric for anything compared for equality or summed for a balance
\`\`\`

**\`varchar(n)\` enforces a length; \`text\` does not (otherwise identical in PostgreSQL)**

\`\`\`sql
CREATE TABLE t (code varchar(5), notes text);
INSERT INTO t VALUES ('toolong', 'any length at all is fine here');
-- ERROR: value too long for type character varying(5)
\`\`\`

**\`timestamptz\` vs \`timestamp\` — always prefer \`timestamptz\` (Module 2 recap)**

\`\`\`sql
timestamptz  -- stores an absolute INSTANT; converts on display to the session's time zone
timestamp    -- stores wall-clock digits with NO zone information -- ambiguous across zones
\`\`\`

**\`boolean\`, \`uuid\`, arrays — first-class types, not text tricks**

\`\`\`sql
active boolean DEFAULT true
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
tags text[]                              -- a real array, not a comma-separated string (Module 7)
\`\`\`

**\`jsonb\` — for genuinely schema-flexible data (its own deep dive in Module 11)**`,

    simpleHi: `**Integer sizes — sabse badी value ke aadhaar par chunो jo aapko KABHI chahiye**

\`\`\`sql
smallint   -- -32,768 se 32,767            (2 bytes)
int        -- lgभग -2.1 billion se 2.1 billion   (4 bytes)  -- default choice
bigint     -- lgभग ±9.2 * 10^18            (8 bytes)  -- IDs, counters jo salों tak badhते hain
\`\`\`

\`\`\`sql
CREATE TABLE t (a int);
INSERT INTO t VALUES (2147483647);      -- max int value
UPDATE t SET a = a + 1;                 -- ERROR: integer out of range
\`\`\`

**\`numeric(p, s)\` — exact, money aur precision chahne waali kisi bhi cheez ke liye**

\`\`\`sql
CREATE TABLE t (price numeric(10, 2));  -- 10 total digits tak, point ke baad 2
INSERT INTO t VALUES (19.999);
SELECT price FROM t;                    -- 20.00 -- insert par declared scale tak ROUNDED
\`\`\`

**\`double precision\` / \`real\` — fast, approximate — money ke liye kabhi nahi**

\`\`\`sql
-- binary floating point zyadатार decimals ko exactly represent nahi kar sakta (Module 2)
\`\`\`

**\`varchar(n)\` ek length enforce karta hai; \`text\` nahi (baaki PostgreSQL mein identical)**

\`\`\`sql
CREATE TABLE t (code varchar(5), notes text);
INSERT INTO t VALUES ('toolong', 'yahaan koi bhi length theek hai');
-- ERROR: value too long for type character varying(5)
\`\`\`

**\`timestamptz\` vs \`timestamp\` — hamesha \`timestamptz\` prefer karo (Module 2 recap)**

\`\`\`sql
timestamptz  -- ek absolute INSTANT store karta hai; display par session ke time zone mein convert
timestamp    -- KOI zone information ke bina wall-clock digits store karta hai -- zones ke across ambiguous
\`\`\`

**\`boolean\`, \`uuid\`, arrays — first-class types, text tricks nahi**

\`\`\`sql
active boolean DEFAULT true
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
tags text[]                              -- ek real array, comma-separated string nahi (Module 7)
\`\`\`

**\`jsonb\` — genuinely schema-flexible data ke liye (Module 11 mein iska apna deep dive)**`,

    content: `## Column types are a design-time bet on the future

A column's type is not just "how PostgreSQL stores this value" — it is a promise about the range, precision, and shape of every value that row will ever hold. Choosing wrong is invisible for a long time and then fails suddenly, at the worst moment (an ID sequence overflows in production, a money column loses a cent somewhere no one notices for months).

## Integers: pick the size by the largest value you will ever need

| type | range | size |
|---|---|---|
| \`smallint\` | -32,768 to 32,767 | 2 bytes |
| \`int\` / \`integer\` | about ±2.1 billion | 4 bytes |
| \`bigint\` | about ±9.2 × 10¹⁸ | 8 bytes |

\`int\` is the sensible default for most columns. **Reach for \`bigint\` for anything that counts events or serves as a primary key on a table expected to grow for years** — a page-view counter, an event-log id, an order id in a high-volume system. 2.1 billion sounds large until you do the math on a busy table: at 10,000 inserts a day, an \`int\` primary key lasts about 590 years, comfortably fine — but at 10 million inserts a day (a large-scale event log), it overflows in under 6 months. The cost of \`bigint\` over \`int\` is a few extra bytes per row; the cost of guessing wrong is an emergency schema migration on a live, huge table.

\`\`\`sql
CREATE TABLE t (a int);
INSERT INTO t VALUES (2147483647);   -- int's maximum value
UPDATE t SET a = a + 1;              -- ERROR: integer out of range
\`\`\`

## \`numeric\` vs floating point

\`numeric(precision, scale)\` stores an **exact** decimal value: \`precision\` is the total number of digits, \`scale\` is how many are after the decimal point. Values are **rounded to the declared scale on write**:

\`\`\`sql
CREATE TABLE t (price numeric(10, 2));
INSERT INTO t VALUES (19.999);
SELECT price FROM t;   -- 20.00, not 19.999 -- the extra digit was rounded away at insert time
\`\`\`

\`double precision\` (\`float8\`) and \`real\` (\`float4\`) are binary floating-point types: fast, compact, but unable to represent most decimal fractions exactly (Module 2 covered why \`0.1 + 0.2\` is not exactly \`0.3\` in binary floating point). **Rule: use \`numeric\` for money, quantities, or anything ever compared for exact equality or summed into a balance. Use \`double precision\` only for scientific/measurement data where a tiny relative error is acceptable and speed matters** (large-scale numerical computation, not financial or business-record data).

## \`varchar(n)\` vs \`text\`

In PostgreSQL, \`varchar(n)\` and \`text\` are stored identically and perform identically — the **only** difference is that \`varchar(n)\` **rejects** a value longer than \`n\` characters at write time:

\`\`\`sql
CREATE TABLE t (code varchar(5), notes text);
INSERT INTO t VALUES ('toolong', 'any length is fine in a text column');
-- ERROR: value too long for type character varying(5)
\`\`\`

Use \`varchar(n)\` when the length limit is a genuine business rule you want the database to enforce (a fixed-format code, a short handle). Use plain \`text\` for everything else — it is not "less safe" or "less performant", it simply carries no length constraint. (This differs from some other databases, where \`varchar\` without a length or unbounded \`text\` has real performance implications — the PostgreSQL-specific equivalence is worth knowing but should not be assumed to transfer.)

## \`timestamptz\` vs \`timestamp\` (Module 2 recap, in the DDL context)

- \`timestamptz\` stores an absolute point in time (internally, UTC) and converts to the connection's time zone on display. Two events that happened at the same instant, recorded from different time zones, compare and sort correctly against each other.
- \`timestamp\` (without time zone) stores the digits you gave it with **no** zone information — \`'2026-06-15 12:00:00'\` means nothing until you know *whose* clock that was. Comparing or subtracting two \`timestamp\` values recorded in different zones silently produces a meaningless result.

**Default to \`timestamptz\` for anything that records "when did this real-world event happen".** \`timestamp\` (or plain \`date\`) is appropriate only for values that are genuinely zone-independent by definition — a birth date, a calendar holiday.

## \`boolean\`, \`uuid\`, and arrays as first-class types

- \`boolean\` — a real two/three-valued (\`true\`/\`false\`/\`NULL\`) type, not \`0\`/\`1\` integers or \`'Y'\`/\`'N'\` text pretending to be one.
- \`uuid\` — a 128-bit universally-unique identifier, often generated with \`gen_random_uuid()\` (built into PostgreSQL 13+). Useful as a primary key when ids must be generated **client-side before insert**, or must not reveal sequence/count information (an auto-incrementing \`bigint\` id leaks "how many rows exist" and "roughly when this one was created" to anyone who can see two ids).
- \`text[]\` (or any \`type[]\`) — a genuine array type with array operators (\`@>\`, \`ANY\`, \`unnest\`). This is different from the comma-separated-string anti-pattern (Module 7, Lesson 3): a real array column can be queried with \`= ANY(tags)\`, unpacked with \`unnest\`, and indexed with a GIN index — none of which work on a text blob. It is still usually better modeled as a proper child table (Module 7) unless the array truly has no independent attributes of its own.

## A pointer to \`jsonb\`

For genuinely semi-structured or schema-flexible data — a payload whose shape varies per row and is not worth a rigid column-per-field design — PostgreSQL's \`jsonb\` type stores parsed, indexable JSON. It gets its own full treatment in Module 11 (PostgreSQL power features); for now, know that it exists as the modern, structured alternative to both a giant serialized-text column and the EAV anti-pattern (Module 7, Lesson 6).`,

    contentHi: `## Column types future par ek design-time bet hain

Ek column ka type sirf "PostgreSQL ise kaise store karta hai" nahi hai — ye range, precision, aur shape ke baare mein ek promise hai jo wo row kabhi rakhegी. Galat chunna lambe samay tak invisible rehta hai aur phir achanak fail hota hai, sabse bure moment par.

## Integers: sabse badी value ke hisab se size chunो

| type | range | size |
|---|---|---|
| \`smallint\` | -32,768 se 32,767 | 2 bytes |
| \`int\` / \`integer\` | lgभग ±2.1 billion | 4 bytes |
| \`bigint\` | lgभग ±9.2 × 10¹⁸ | 8 bytes |

\`int\` zyadатार columns ke liye sensible default hai. **Kисी bhi cheez ke liye jo events count karti hai ya kई salों tak badने waali table par primary key ka kaam karti hai \`bigint\` chunो.** 10,000 inserts prati din par, ek \`int\` primary key lgभग 590 saal chalता hai — par 10 million inserts prati din par (ek large-scale event log), ye 6 mahiनों se kam mein overflow karta hai.

\`\`\`sql
CREATE TABLE t (a int);
INSERT INTO t VALUES (2147483647);   -- int ki maximum value
UPDATE t SET a = a + 1;              -- ERROR: integer out of range
\`\`\`

## \`numeric\` vs floating point

\`numeric(precision, scale)\` ek **exact** decimal value store karta hai. Values **write par declared scale tak rounded** hoती hain:

\`\`\`sql
CREATE TABLE t (price numeric(10, 2));
INSERT INTO t VALUES (19.999);
SELECT price FROM t;   -- 20.00, 19.999 nahi
\`\`\`

\`double precision\` aur \`real\` binary floating-point types hain: fast, compact, par zyadатार decimal fractions ko exactly represent nahi kar sakte. **Niyam: money, quantities, ya kисी bhi cheez ke liye jise kabhi exact equality ke liye compare kiya jaता hai ya ek balance mein summed kiya jaता hai \`numeric\` istemal karो.**

## \`varchar(n)\` vs \`text\`

PostgreSQL mein, \`varchar(n)\` aur \`text\` identically store aur perform hote hain — SIRF antar ye hai ki \`varchar(n)\` write time par \`n\` characters se lambi value **reject** karta hai. \`varchar(n)\` tab istemal karo jab length limit ek genuine business rule hai; baaki sab ke liye plain \`text\` istemal karो.

## \`timestamptz\` vs \`timestamp\` (Module 2 recap, DDL context mein)

- \`timestamptz\` ek absolute point in time store karta hai aur display par convert hota hai.
- \`timestamp\` (bina time zone) diye gaye digits ko KOI zone information ke bina store karta hai.

**Kисी bhi cheez ke liye jo "ye real-world event kab hua" record karti hai \`timestamptz\` default rakhо.**

## \`boolean\`, \`uuid\`, aur arrays first-class types ke roop mein

- \`boolean\` — ek real type, \`0\`/\`1\` integers ya \`'Y'\`/\`'N'\` text nahi.
- \`uuid\` — ek 128-bit universally-unique identifier, aksar \`gen_random_uuid()\` se generate hota hai. Useful ek primary key ke roop mein jab ids client-side pehle generate honi chahiye, ya sequence/count information reveal nahi karni chahiye.
- \`text[]\` — ek genuine array type array operators ke saath. Ye comma-separated-string anti-pattern (Module 7) se alag hai.

## \`jsonb\` ki taraf ek pointer

Genuinely semi-structured data ke liye, PostgreSQL ka \`jsonb\` type parsed, indexable JSON store karta hai. Ise Module 11 mein poori tarah cover kiya jaता hai.`,

    examples: [
      {
        title: 'int overflows at ~2.1 billion; bigint holds the same value fine',
        titleHi: 'int lgभग 2.1 billion par overflow karta hai; bigint wahi value theek se rakhta hai',
        code: `CREATE TABLE t_int (a int);
INSERT INTO t_int VALUES (2147483647);
UPDATE t_int SET a = a + 1;`,
        output: `[ERROR] integer out of range`,
        explain: "`int`'s maximum value is `2147483647`. Adding `1` to it would require `2147483648`, which is outside the 4-byte range `int` can represent, so PostgreSQL raises `integer out of range` rather than silently wrapping around to a negative number. A `bigint` column has about 9.2 * 10^18 of headroom, so the identical increment on the identical starting value succeeds without any special handling.",
        explainHi: '`int` ki maximum value `2147483647` hai. Isमein `1` add karne ke liye `2147483648` chahiye, jo `int` ke represent kar sakne waale 4-byte range se bahar hai, to PostgreSQL `integer out of range` raise karta hai negative number mein silently wrap around karne ke bजाy. Ek `bigint` column ke paas lgभग 9.2 * 10^18 ka headroom hai, to identical increment identical starting value par bina kisi special handling ke succeed hota hai.',
      },
      {
        title: 'numeric(10,2) rounds to the declared scale on insert',
        titleHi: 'numeric(10,2) insert par declared scale tak round karta hai',
        code: `CREATE TABLE t_price (price numeric(10, 2));
INSERT INTO t_price VALUES (19.999);
SELECT price FROM t_price;`,
        output: ` price
-------
 20.00
(1 row)`,
        explain: '`numeric(10, 2)` allows 10 total digits with exactly 2 after the decimal point. `19.999` has 3 digits after the point, one more than the declared scale, so PostgreSQL rounds it to the nearest value that fits: `20.00`. This rounding happens once, at insert time — the extra precision in `19.999` is not preserved anywhere, so reading the value back always gives `20.00`, never the original input.',
        explainHi: '`numeric(10, 2)` 10 total digits allow karta hai decimal point ke baad theek 2 ke saath. `19.999` ke point ke baad 3 digits hain, declared scale se ek zyada, to PostgreSQL ise sabse close value tak round karta hai jo fit hoती hai: `20.00`. Ye rounding ek baar hoती hai, insert time par — `19.999` mein extra precision kahin bhi preserved nahi hai, to value wapas padhна hamesha `20.00` deta hai, original input kabhi nahi.',
      },
      {
        title: 'varchar(5) rejects a value over its length; text has no limit',
        titleHi: 'varchar(5) apni length se zyada value reject karta hai; text ki koi limit nahi',
        code: `CREATE TABLE t_str (code varchar(5), notes text);
INSERT INTO t_str VALUES ('toolong', repeat('x', 10000));`,
        output: `[ERROR] value too long for type character varying(5)`,
        explain: "`varchar(5)` allows at most 5 characters; `'toolong'` has 7, so the insert is rejected outright with `value too long for type character varying(5)` — PostgreSQL does not silently truncate it. `text` has no declared length limit at all, so a 10,000-character value is accepted without any special configuration.",
        explainHi: "`varchar(5)` zyada se zyada 5 characters allow karta hai; `'toolong'` ke 7 hain, to insert seedhے reject hota hai `value too long for type character varying(5)` ke saath — PostgreSQL ise silently truncate nahi karta. `text` ki koi declared length limit hai hi nahi, to ek 10,000-character value bina kisi special configuration ke accept hoती hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- an event-log id declared as int on a table expected to grow for years
CREATE TABLE analytics_event (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, kind text);
-- fine at launch; at high volume this overflows in months, not decades`,
        right: `CREATE TABLE analytics_event (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, kind text);
-- costs a few extra bytes per row; removes an entire category of future emergency migration`,
        why: 'An int primary key has roughly 2.1 billion possible values. For a table that receives a modest number of rows per day, that limit is effectively never reached, but for a genuinely high-volume table, an event log, a click stream, an audit trail, the same limit can be reached within months rather than centuries once real traffic arrives. The failure mode when it happens is abrupt: every insert starts failing with an out-of-range error, in production, usually discovered only when it happens. Declaring such a column bigint from the start costs a handful of extra bytes per row and closes off the entire failure mode; retrofitting it later on a live, already-huge table is a much more painful migration than choosing correctly up front.',
        whyHi: 'Ek `int` primary key ke paas lgभग 2.1 billion possible values hain. Ek table ke liye jise prati din ek modest sankhya mein rows milती hain, wo limit effectively kabhi nahi pahunchती, par ek genuinely high-volume table ke liye, wahi limit mahiनों mein pahunch sakti hai, saदियों mein nahi. Jab ye hota hai failure mode abrupt hai: har insert out-of-range error se fail hona shuru hoता hai, production mein. Aise column ko shuru se `bigint` declare karna prati row kuch extra bytes cost karta hai aur poora failure mode band kar deta hai.',
      },
      {
        wrong: `-- storing money as double precision
CREATE TABLE invoice (id int PRIMARY KEY, total double precision);
INSERT INTO invoice VALUES (1, 19.99);
-- summing many rows accumulates tiny binary rounding errors that eventually
-- show up as a balance that is off by a cent (or more) with no obvious cause`,
        right: `CREATE TABLE invoice (id int PRIMARY KEY, total numeric(10, 2));
INSERT INTO invoice VALUES (1, 19.99);
-- numeric stores the exact decimal value -- arithmetic on it never introduces
-- binary rounding error`,
        why: 'Binary floating point cannot represent most decimal fractions exactly, so a value like 19.99 is actually stored as the closest representable binary approximation, not the exact decimal. Any single value looks fine when displayed, but summing, subtracting, or comparing many such approximate values accumulates small errors that eventually surface as a total that is off by a cent or more, with no single row that looks wrong in isolation. numeric with an explicit precision and scale stores the exact decimal digits and performs arithmetic on those exact digits, so it never introduces this class of error. The database-design rule is simple: numeric for anything that represents money or must be compared for exact equality, double precision only for scientific or measurement data where small relative error is acceptable.',
        whyHi: 'Binary floating point zyadатार decimal fractions ko exactly represent nahi kar sakta, to 19.99 jaisा ek value asal mein sabse close representable binary approximation ke roop mein store hota hai, exact decimal nahi. Koi bhi single value display hone par theek dikhता hai, par kई aise approximate values ko sum, subtract, ya compare karna chhoटe errors accumulate karta hai jo aakhirkar ek total mein dikhते hain jo ek cent ya zyada se off hai. `numeric` exact decimal digits store karta hai aur unhi exact digits par arithmetic karta hai.',
      },
      {
        wrong: `-- recording an appointment time as a naive timestamp
CREATE TABLE appointment (id int PRIMARY KEY, starts_at timestamp);
INSERT INTO appointment VALUES (1, '2026-06-15 09:00:00');
-- a user in a different time zone reading this value has no way to know
-- whose 9am it was -- the value is ambiguous the moment more than one zone is involved`,
        right: `CREATE TABLE appointment (id int PRIMARY KEY, starts_at timestamptz);
INSERT INTO appointment VALUES (1, '2026-06-15 09:00:00-04');
-- stored as an absolute instant; every reader, regardless of their own session
-- time zone, sees the SAME real-world moment, correctly converted for display`,
        why: 'A plain timestamp column stores the digits it was given with no record of which time zone those digits were written in, so 2026-06-15 09:00:00 means something different depending on who wrote it and where they were. That ambiguity is invisible in a single-time-zone deployment and becomes a real bug the moment the system has users, servers, or database connections in more than one time zone: comparisons, sorts, and interval arithmetic silently mix values that were never actually comparable. timestamptz avoids the whole problem by storing an absolute instant internally and converting to whichever time zone a given session or client requests only at display time, so the underlying stored value is unambiguous and comparisons are always correct regardless of who is reading them.',
        whyHi: 'Ek plain `timestamp` column diye gaye digits ko is record ke bina store karta hai ki wo digits kaunसे time zone mein likhे gaye the, to `2026-06-15 09:00:00` alag matlab rakhta hai is par nirbhar karके ki ise kisne aur kahaan likha. Wo ambiguity ek single-time-zone deployment mein invisible hai aur ek real bug ban jaती hai jis pal system ke users ek se zyada time zone mein hon. `timestamptz` poora problem avoid karta hai internally ek absolute instant store karके aur sirf display time par convert karके.',
      },
    ],

    realWorld: [
      {
        en: '**Every autoincrementing primary key in a high-traffic schema declared `bigint` from day one** — a project-wide convention adopted after a smaller service hit the `int` ceiling on its event table within a year of launch.',
        hi: '**Ek high-traffic schema mein har autoincrementing primary key din ek se `bigint` declare ki gayi** — ek chhoti service ke apni event table par `int` ceiling ek saal ke andar hit karne ke baad adopted ek project-wide convention.',
      },
      {
        en: '**A payments table using `numeric(12,2)` for every money column, with a linter rejecting any `float`/`double precision` column in a migration touching billing tables.**',
        hi: '**Ek payments table jo har money column ke liye `numeric(12,2)` istemal karti hai, ek linter ke saath jo billing tables chhone waale kisi bhi migration mein `float`/`double precision` column reject karta hai.**',
      },
      {
        en: '**A code-review checklist item: "does every new timestamp column use `timestamptz`?"** — the single most common DDL review comment on a distributed team spanning multiple time zones.',
        hi: '**Ek code-review checklist item: "kya har naya timestamp column `timestamptz` istemal karta hai?"** — kई time zones mein failी ek distributed team par sabse common DDL review comment.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should money be stored as `numeric` rather than `double precision` or `real`?',
        qHi: 'Money ko `double precision` ya `real` ke bजाy `numeric` ke roop mein kyun store karна chahiye?',
        a: 'Double precision and real are binary floating-point types, and binary floating point cannot represent most decimal fractions exactly, in the same way that one third cannot be written exactly in decimal. A value like 19.99 is stored as the nearest representable binary approximation rather than the precise decimal number, and that approximation is usually close enough that a single value looks correct when displayed. The problem compounds when you do arithmetic: summing many such approximate values, subtracting them, or comparing them for exact equality accumulates tiny rounding errors that eventually surface as a total or balance that is off by a cent or more, often traced back only after a great deal of debugging, since no individual row looks wrong. Numeric, with an explicit precision and scale, stores the exact decimal digits rather than a binary approximation, and every arithmetic operation on it operates on those exact digits, so it never introduces this class of error. The practical rule is that numeric is the correct choice for money and any other value that will be summed into a balance or compared for exact equality, while double precision is reserved for scientific or measurement contexts where a small relative error is acceptable and raw computational speed matters more than exactness.',
        aHi: 'Double precision aur real binary floating-point types hain, aur binary floating point zyadатार decimal fractions ko exactly represent nahi kar sakta. `19.99` jaisा ek value sabse close representable binary approximation ke roop mein store hota hai, precise decimal number nahi. Problem tab compound hoती hai jab aap arithmetic karте ho: kई aise approximate values ko sum, subtract, ya exact equality ke liye compare karna chhoटe rounding errors accumulate karta hai jo aakhirkar ek total ya balance mein dikhते hain jo ek cent ya zyada se off hai. `Numeric`, explicit precision aur scale ke saath, exact decimal digits store karta hai binary approximation ke bजाy.',
      },
      {
        q: 'What is the difference between `timestamp` and `timestamptz`, and why is `timestamptz` almost always the right default?',
        qHi: '`timestamp` aur `timestamptz` mein kya antar hai, aur `timestamptz` lगभग hamesha sahi default kyun hai?',
        a: 'timestamptz stores a value as an absolute point in time, internally normalized to UTC, and converts it to whatever time zone the current session or client is using only when displaying it. timestamp, without a time zone, stores exactly the digits it was given, with no record of which time zone those digits were meant to represent. The consequence is that a plain timestamp value like a given date and 9am is ambiguous the moment more than one time zone is involved in the system: two different people, in two different time zones, entering or reading that value have no way to agree on what real-world instant it refers to, and comparisons, sorts, or interval arithmetic across rows recorded from different zones silently produce meaningless results without ever raising an error. timestamptz avoids this because the stored value is unambiguous regardless of who wrote it or who reads it; only the final display step depends on the viewer\'s time zone, and that conversion is always correct. The recommendation is to default to timestamptz for anything recording when a real-world event actually happened, and reserve plain timestamp, or date, for values that are genuinely zone-independent by their nature, such as a birth date or a calendar holiday that is the same date everywhere.',
        aHi: '`timestamptz` ek value ko time mein ek absolute point ke roop mein store karta hai, internally UTC mein normalized, aur ise sirf display karte waqt current session ya client jo bhi time zone istemal kar raha hai usmein convert karta hai. `timestamp`, bina time zone ke, theek wo digits store karta hai jo ise diye gaye the, is record ke bina ki wo digits kaunसे time zone ko represent karne waale the. Natija ye hai ki ek plain `timestamp` value ambiguous hai jis pal system mein ek se zyada time zone involved hai. `timestamptz` ise avoid karta hai kyunki stored value ambiguous nahi hai chahe ise kisne likha ya kaun padhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(a int)`. Insert `2147483647` (the maximum `int`) and try `UPDATE t SET a = a + 1` to confirm the overflow error. Then recreate the table with `a bigint` and confirm the same operations succeed.',
        taskHi: 'Table `t(a int)`. `2147483647` (maximum `int`) insert karo aur `UPDATE t SET a = a + 1` try karo overflow error confirm karne ke liye. Phir table ko `a bigint` ke saath recreate karo.',
        hint: '`int` tops out at 2,147,483,647; incrementing it raises `integer out of range`. `bigint` has vastly more headroom (about 9.2 * 10^18) and handles the same increment fine.',
        hintHi: '`int` 2,147,483,647 par khatm hoता hai; ise increment karna `integer out of range` raise karta hai. `bigint` mein bahut zyada headroom hai.',
      },
      {
        task: 'Table `t(price numeric(5,2))`. Insert `123.456` and observe how it is rounded on read. Then try inserting `1234.56` and observe a different kind of error (exceeding total precision, not just scale).',
        taskHi: 'Table `t(price numeric(5,2))`. `123.456` insert karo aur dekho ye read par kaise round hota hai. Phir `1234.56` insert karne ki koshish karo aur ek alag tarah ka error dekho.',
        hint: '`numeric(5,2)` allows 5 total digits, 2 after the decimal point (so up to 3 before it). `123.456` rounds to `123.46`. `1234.56` has 4 digits before the point plus 2 after = 6 total, exceeding precision 5 — `numeric field overflow` (Module 2 recap).',
        hintHi: '`numeric(5,2)` 5 total digits allow karta hai, point ke baad 2. `123.456` `123.46` mein round hota hai. `1234.56` ke 6 total digits hain, precision 5 se zyada — `numeric field overflow`.',
      },
      {
        task: 'Table `t(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text)`. Insert two rows without specifying `id`, then confirm both got different, well-formed UUIDs by checking `length(id::text)` equals 36 for both.',
        taskHi: 'Table `t(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text)`. `id` specify kiye bina do rows insert karo, phir confirm karo dono ko alag, well-formed UUIDs mile `length(id::text)` 36 check karke.',
        hint: 'A UUID\'s canonical text form is always 36 characters (32 hex digits plus 4 hyphens), regardless of its actual random value — a stable, deterministic thing to assert even though the UUID itself is random.',
        hintHi: 'Ek UUID ka canonical text form hamesha 36 characters ka hota hai (32 hex digits plus 4 hyphens), iski actual random value ke bavjood.',
      },
    ],

    keyTakeaways: [
      'A column type is a design-time PROMISE about the range/precision/shape every future row will need — wrong choices are invisible for a long time, then fail suddenly at the worst moment (ID overflow in production, a money total off by cents).',
      'INTEGER SIZES: `smallint` (±32,767, 2 bytes), `int` (±2.1 billion, 4 bytes, the sensible default), `bigint` (±9.2×10^18, 8 bytes). Use `bigint` for ANY high-volume counter or PK on a table expected to grow for years — the cost is a few bytes/row, the alternative is an emergency migration when `int` overflows.',
      '`numeric(precision, scale)` = EXACT decimal, rounded to the declared scale ON INSERT (`19.999` -> `20.00` at `numeric(10,2)`). `double precision`/`real` = binary floating point, CANNOT represent most decimals exactly — fine for scientific/measurement data, NEVER for money or anything summed into a balance or compared for exact equality.',
      '`varchar(n)` vs `text` in PostgreSQL: IDENTICAL storage and performance — the ONLY difference is `varchar(n)` REJECTS a value longer than `n` at write time. Use `varchar(n)` only when the length cap is a genuine business rule; use `text` otherwise (this PG-specific equivalence does NOT transfer to every other database).',
      '`timestamptz` stores an ABSOLUTE INSTANT (converts to the session\'s zone on display) — `timestamp` stores bare digits with NO zone info, ambiguous the moment more than one time zone is involved. DEFAULT TO `timestamptz` for anything recording a real-world event; plain `timestamp`/`date` only for genuinely zone-independent values (a birth date, a calendar holiday).',
      '`boolean` (real true/false/NULL, not `0`/`1` or `\'Y\'`/`\'N\'`), `uuid` (client-generatable, doesn\'t leak sequence/count info the way an auto-increment id does), and `text[]`/array types (real array operators — `@>`, `ANY`, `unnest`, GIN-indexable — unlike a comma-separated string, Module 7) are first-class types, not text-encoding workarounds.',
      '`jsonb` exists for genuinely schema-flexible data (full treatment in Module 11) — the modern, structured alternative to both a giant serialized-text blob and the EAV anti-pattern (Module 7).',
    ],
    keyTakeawaysHi: [
      'Ek column type ek design-time PROMISE hai us range/precision/shape ke baare mein jo har future row ko chahiye — galat choices lambe samay tak invisible hoती hain, phir sabse bure moment par achanak fail hoती hain.',
      'INTEGER SIZES: `smallint` (±32,767, 2 bytes), `int` (±2.1 billion, 4 bytes, sensible default), `bigint` (±9.2×10^18, 8 bytes). Kисी bhi high-volume counter ya kई salों tak badने waali table par PK ke liye `bigint` istemal karो.',
      '`numeric(precision, scale)` = EXACT decimal, INSERT PAR declared scale tak rounded. `double precision`/`real` = binary floating point, zyadатار decimals ko exactly represent NAHI kar sakte — scientific/measurement data ke liye theek, money ke liye KABHI nahi.',
      'PostgreSQL mein `varchar(n)` vs `text`: IDENTICAL storage aur performance — SIRF antar `varchar(n)` write time par `n` se lambi value REJECT karta hai.',
      '`timestamptz` ek ABSOLUTE INSTANT store karta hai — `timestamp` bare digits store karta hai KOI zone info ke bina, ambiguous jis pal ek se zyada time zone involved hai. Real-world event record karne waali kisi bhi cheez ke liye `timestamptz` DEFAULT rakhо.',
      '`boolean` (real true/false/NULL), `uuid` (client-generatable), aur `text[]`/array types (real array operators) first-class types hain, text-encoding workarounds nahi.',
      '`jsonb` genuinely schema-flexible data ke liye exist karta hai (poora treatment Module 11 mein) — ek giant serialized-text blob aur EAV anti-pattern (Module 7) dono ka modern, structured alternative.',
    ],
  },

  {
    slug: 'sql-table-and-column-constraints',
    title: 'Table & Column Constraints',
    titleHi: 'Table Aur Column Constraints',
    description: '`NOT NULL`, `DEFAULT`, `UNIQUE`, and `CHECK` are the guardrails that make invalid data impossible to insert, rather than merely unlikely. Combined with `PRIMARY KEY`/`FOREIGN KEY` (Module 7), they turn business rules into things the database enforces for every writer, always.',
    descriptionHi: '`NOT NULL`, `DEFAULT`, `UNIQUE`, aur `CHECK` wo guardrails hain jo invalid data ko insert karna impossible banaते hain, sirf unlikely nahi. `PRIMARY KEY`/`FOREIGN KEY` (Module 7) ke saath combined, wo business rules ko un cheezों mein badalते hain jo database har writer ke liye, hamesha enforce karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A form with fields that physically refuse to accept bad input, instead of a sign that politely asks you to fill it in correctly.** A paper form that says "please enter a positive number" relies entirely on the person reading and obeying the instruction — nothing stops someone writing "-5" anyway, and the mistake is only caught later, if at all, by whoever processes the form. A well-designed digital form is built differently: the "quantity" box is a stepper that cannot go below one, the "email" box refuses to submit without an @ sign, the "start date" box will not accept a date after the "end date" box. Each of those is a **constraint**: a rule enforced at the point of entry, by the form itself, not by the good intentions of whoever fills it in. `NOT NULL` is "this box cannot be left blank". `DEFAULT` is "if left blank, assume this value". `UNIQUE` is "this value cannot already appear elsewhere on file". `CHECK` is the custom stepper-and-date-range logic — an arbitrary true/false rule the database itself verifies on every single insert and update, for every application, every script, every person who ever touches the table, forever.',
      hi: '**Ek form jiske fields physically bura input accept karne se refuse karte hain, ek sign ke bजाy jo politely aapko theek se bharne ko kehta hai.** Ek paper form jo kehta hai "kripya ek positive number daalें" poori tarah us vyakti par bharosa karta hai jo instruction padhता aur maanता hai — kuch bhi kisi ko "-5" likhne se nahi rokta, aur galti sirf baad mein pakड़ी jaती hai, agar bilkul, jo bhi form process karta hai uske dwara. Ek well-designed digital form alag banी hoती hai: "quantity" box ek stepper hai jo ek se neeche nahi ja sakta, "email" box bina @ sign ke submit karna refuse karta hai. Un har ek ek **constraint** hai: entry ke point par enforce ki gayi ek rule, form khud dwara, bharne waale ki achhी intentions dwara nahi. `NOT NULL` "ye box khaali nahi chhoड़ा ja sakta" hai. `DEFAULT` "agar khaali chhoड़ा, ye value maano" hai. `UNIQUE` "ye value file par kahin aur pehle se nahi ho sakti" hai. `CHECK` custom stepper-and-date-range logic hai.',
    },

    simple: `**\`NOT NULL\` — this column can never be blank**

\`\`\`sql
CREATE TABLE emp (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO emp VALUES (1, NULL);   -- ERROR: null value in column "name" violates not-null constraint
\`\`\`

**\`DEFAULT\` — the value used when the column is omitted**

\`\`\`sql
CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending');
INSERT INTO orders (id) VALUES (1);   -- status becomes 'pending' automatically
\`\`\`

**\`UNIQUE\` — no two rows may share this value (unlike \`PRIMARY KEY\`, more than one per table, and NULLs allowed)**

\`\`\`sql
CREATE TABLE customer (id int PRIMARY KEY, email text UNIQUE);
INSERT INTO customer VALUES (1, 'a@x.com'), (2, 'a@x.com');   -- ERROR: duplicate key value
\`\`\`

**\`CHECK\` — an arbitrary true/false rule, enforced on every row**

\`\`\`sql
CREATE TABLE product (id int PRIMARY KEY, price numeric CONSTRAINT positive_price CHECK (price > 0));
INSERT INTO product VALUES (1, -5);   -- ERROR: violates check constraint "positive_price"
\`\`\`

**\`CHECK\` across multiple columns in the same row**

\`\`\`sql
CREATE TABLE range_t (lo int, hi int, CHECK (lo < hi));
INSERT INTO range_t VALUES (5, 3);   -- ERROR: violates check constraint "range_t_check"
\`\`\`

**Naming constraints — for a readable error, and an easy target for later \`ALTER\`**

\`\`\`sql
price numeric CONSTRAINT positive_price CHECK (price > 0)   -- named: clear error, easy to DROP/ALTER later
price numeric CHECK (price > 0)                              -- unnamed: PostgreSQL invents a name for you
\`\`\`

**The full picture (PRIMARY KEY / FOREIGN KEY recap from Module 7)**

\`\`\`
NOT NULL     -- no blanks
DEFAULT      -- what to use if omitted
UNIQUE       -- no duplicates (any number of UNIQUE constraints per table)
CHECK        -- any custom true/false rule
PRIMARY KEY  -- exactly one per table; UNIQUE + NOT NULL + "this IS the row's identity"
FOREIGN KEY  -- must match a real row in another table (Module 7)
\`\`\``,

    simpleHi: `**\`NOT NULL\` — ye column kabhi blank nahi ho sakta**

\`\`\`sql
CREATE TABLE emp (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO emp VALUES (1, NULL);   -- ERROR: null value in column "name" violates not-null constraint
\`\`\`

**\`DEFAULT\` — jab column omit ho to istemal ki jaने waali value**

\`\`\`sql
CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending');
INSERT INTO orders (id) VALUES (1);   -- status automatically 'pending' ban jaata hai
\`\`\`

**\`UNIQUE\` — koi do rows ye value share nahi kar sakti (\`PRIMARY KEY\` ke ulta, prati table ek se zyada, NULLs allowed)**

\`\`\`sql
CREATE TABLE customer (id int PRIMARY KEY, email text UNIQUE);
INSERT INTO customer VALUES (1, 'a@x.com'), (2, 'a@x.com');   -- ERROR: duplicate key value
\`\`\`

**\`CHECK\` — ek arbitrary true/false rule, har row par enforce**

\`\`\`sql
CREATE TABLE product (id int PRIMARY KEY, price numeric CONSTRAINT positive_price CHECK (price > 0));
INSERT INTO product VALUES (1, -5);   -- ERROR: violates check constraint "positive_price"
\`\`\`

**Usi row mein kई columns ke across \`CHECK\`**

\`\`\`sql
CREATE TABLE range_t (lo int, hi int, CHECK (lo < hi));
INSERT INTO range_t VALUES (5, 3);   -- ERROR: violates check constraint "range_t_check"
\`\`\`

**Constraints ko naam dena — ek readable error ke liye, aur baad mein \`ALTER\` ke liye ek aasan target**

\`\`\`sql
price numeric CONSTRAINT positive_price CHECK (price > 0)   -- named: saaf error, baad mein DROP/ALTER aasan
price numeric CHECK (price > 0)                              -- unnamed: PostgreSQL aapke liye ek naam banaता hai
\`\`\`

**Poori picture (Module 7 se PRIMARY KEY / FOREIGN KEY recap)**

\`\`\`
NOT NULL     -- koi blanks nahi
DEFAULT      -- omit hone par kya istemal karें
UNIQUE       -- koi duplicates nahi (prati table koi bhi sankhya mein UNIQUE constraints)
CHECK        -- koi bhi custom true/false rule
PRIMARY KEY  -- prati table theek ek; UNIQUE + NOT NULL + "ye row ki identity HAI"
FOREIGN KEY  -- ek doosri table mein ek real row se match karна chahiye (Module 7)
\`\`\``,

    content: `## Constraints are enforced for every writer, always

A constraint is a rule the database checks on **every** \`INSERT\` and \`UPDATE\`, regardless of which application, script, or person is doing the writing. This is the core reason to prefer database constraints over "the application validates this before saving" — application-level validation is only as good as every code path that writes to the table, and a bulk import, a manual fix, a second service, or a future feature can all bypass it. A constraint enforced by the database cannot be bypassed by any of them.

## \`NOT NULL\`

The simplest constraint: this column may never hold \`NULL\`.

\`\`\`sql
CREATE TABLE emp (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO emp VALUES (1, NULL);
-- ERROR: null value in column "name" violates not-null constraint
\`\`\`

Reach for \`NOT NULL\` on any column where a missing value would be meaningless or dangerous downstream (Module 1/2 covered how \`NULL\` propagates unexpectedly through comparisons and aggregates) — a customer's email if the business genuinely cannot function without one, a foreign key that must always point somewhere (versus one that models a genuinely optional relationship, Module 7).

## \`DEFAULT\`

The value substituted when a column is **omitted** from an \`INSERT\` (not when it is explicitly set to \`NULL\` — those are different things):

\`\`\`sql
CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO orders (id) VALUES (1);
-- status = 'pending', created_at = the current time -- both filled in automatically
\`\`\`

\`DEFAULT\` combined with \`NOT NULL\` is the standard pattern for audit columns (Module 7, Lesson 6) and status columns that should never be left unset. A default can be a literal, an expression, or a function call (\`now()\`, \`gen_random_uuid()\`) — it is evaluated fresh for each row that needs it.

## \`UNIQUE\`

Guarantees no two rows share the same value in the constrained column(s) — but unlike \`PRIMARY KEY\` (Module 7), a table can have **any number** of \`UNIQUE\` constraints, and a \`UNIQUE\` column **does** allow multiple \`NULL\`s (NULL is never considered equal to another NULL, even by a uniqueness check).

\`\`\`sql
CREATE TABLE customer (id int PRIMARY KEY, email text UNIQUE, phone text UNIQUE);
INSERT INTO customer VALUES (1, 'a@x.com', '555-0001'), (2, 'a@x.com', '555-0002');
-- ERROR: duplicate key value violates unique constraint "customer_email_key"
\`\`\`

Use \`UNIQUE\` for every "real-world unique" attribute alongside a surrogate primary key (Module 7, Lesson 1) — the surrogate id is the internal identity, the \`UNIQUE\` column is where the actual business rule "no two customers share an email" is enforced.

\`UNIQUE\` can also span **multiple columns** (a composite unique constraint), guaranteeing uniqueness of the *combination* rather than any single column — this is exactly the mechanism a junction table's composite primary key uses (Module 7, Lesson 5) to prevent a duplicate pairing.

## \`CHECK\`

An arbitrary boolean expression, evaluated against **every row**, that must be \`TRUE\` (or \`NULL\` — a \`CHECK\` does not reject \`NULL\`, only a definite \`FALSE\`) for the row to be accepted:

\`\`\`sql
CREATE TABLE product (id int PRIMARY KEY, price numeric CONSTRAINT positive_price CHECK (price > 0));
INSERT INTO product VALUES (1, -5);
-- ERROR: new row for relation "product" violates check constraint "positive_price"
\`\`\`

A \`CHECK\` can reference **multiple columns of the same row**, enforcing a relationship between them:

\`\`\`sql
CREATE TABLE range_t (lo int, hi int, CHECK (lo < hi));
INSERT INTO range_t VALUES (5, 3);
-- ERROR: violates check constraint "range_t_check"
\`\`\`

A \`CHECK\` **cannot** reference another table (that is what a \`FOREIGN KEY\`, Module 7, is for) or another row of the same table (that requires application logic, a trigger, or — for aggregate-style rules — is usually redesigned around a different structure entirely).

## Naming constraints

\`CONSTRAINT name CHECK (...)\` gives a constraint an explicit, meaningful name. Without one, PostgreSQL invents a name (typically \`<table>_<column>_check\`), which is functional but less informative in an error message and clumsier to reference later:

\`\`\`sql
price numeric CONSTRAINT positive_price CHECK (price > 0)   -- error says "positive_price"
price numeric CHECK (price > 0)                              -- error says "product_price_check"
\`\`\`

Naming matters most for constraints you expect to reference again — dropping or altering a constraint later requires knowing its name, and \`ALTER TABLE ... DROP CONSTRAINT product_price_check\` is far less discoverable than \`ALTER TABLE ... DROP CONSTRAINT positive_price\`.

## The full constraint picture

\`NOT NULL\`, \`DEFAULT\`, \`UNIQUE\`, and \`CHECK\` (this lesson) combine with \`PRIMARY KEY\` and \`FOREIGN KEY\` (Module 7) to form the complete constraint vocabulary. Together, they are how a schema encodes business rules **as guarantees**, not as documentation that application code may or may not honour: "every order has a status", "no two customers share an email", "a price is always positive", "every book has a real author" all become things that are structurally impossible to violate, for every writer, forever — exactly the theme Module 7 introduced with foreign keys, extended here to every other kind of rule a row's own data can express.`,

    contentHi: `## Constraints har writer ke liye, hamesha enforce hoते hain

Ek constraint ek rule hai jise database **har** \`INSERT\` aur \`UPDATE\` par check karta hai, chahe koi bhi application, script, ya vyakti likh raha ho. Yahi database constraints ko "application ise save karne se pehle validate karti hai" se zyada prefer karne ka core reason hai — application-level validation sirf utni achhी hai jitne har code path ne table mein likha hai, aur ek bulk import, ek manual fix, ek doosri service ise bypass kar sakte hain. Database dwara enforced ek constraint inmein se koi bhi bypass nahi kar sakta.

## \`NOT NULL\`

Sabse simple constraint: ye column kabhi \`NULL\` nahi rakh sakta.

\`\`\`sql
CREATE TABLE emp (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO emp VALUES (1, NULL);
-- ERROR: null value in column "name" violates not-null constraint
\`\`\`

## \`DEFAULT\`

Wo value jo tab substitute hoती hai jab ek column \`INSERT\` se **omit** kiya jaता hai:

\`\`\`sql
CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO orders (id) VALUES (1);
-- status = 'pending', created_at = current time -- dono automatically bhar jaते hain
\`\`\`

## \`UNIQUE\`

Guarantee karta hai ki koi do rows constrained column(s) mein same value share nahi karти — par \`PRIMARY KEY\` (Module 7) ke ulta, ek table mein **koi bhi sankhya** mein \`UNIQUE\` constraints ho sakते hain, aur ek \`UNIQUE\` column kई \`NULL\`s allow karta hai.

\`\`\`sql
CREATE TABLE customer (id int PRIMARY KEY, email text UNIQUE, phone text UNIQUE);
INSERT INTO customer VALUES (1, 'a@x.com', '555-0001'), (2, 'a@x.com', '555-0002');
-- ERROR: duplicate key value violates unique constraint "customer_email_key"
\`\`\`

\`UNIQUE\` **kई columns** ke across bhi ho sakta hai (ek composite unique constraint), *combination* ki uniqueness guarantee karте hue.

## \`CHECK\`

Ek arbitrary boolean expression, **har row** ke against evaluated, jo row accept hone ke liye \`TRUE\` (ya \`NULL\`) hona chahiye:

\`\`\`sql
CREATE TABLE product (id int PRIMARY KEY, price numeric CONSTRAINT positive_price CHECK (price > 0));
INSERT INTO product VALUES (1, -5);
-- ERROR: violates check constraint "positive_price"
\`\`\`

Ek \`CHECK\` **usi row ke kई columns** reference kar sakta hai:

\`\`\`sql
CREATE TABLE range_t (lo int, hi int, CHECK (lo < hi));
INSERT INTO range_t VALUES (5, 3);
-- ERROR: violates check constraint "range_t_check"
\`\`\`

Ek \`CHECK\` doosri table (uske liye \`FOREIGN KEY\`) ya usi table ki doosri row reference NAHI kar sakta.

## Constraints ko naam dena

\`CONSTRAINT name CHECK (...)\` ek constraint ko ek explicit, meaningful naam deta hai. Bina naam ke, PostgreSQL ek naam invent karta hai. Naming us constraints ke liye sabse zyada maayne rakhta hai jise aap phir se reference karne ki umeed rakhte ho.

## Poori constraint picture

\`NOT NULL\`, \`DEFAULT\`, \`UNIQUE\`, aur \`CHECK\` (ye lesson) \`PRIMARY KEY\` aur \`FOREIGN KEY\` (Module 7) ke saath milkar poori constraint vocabulary banaते hain. Saath mein, wo iska tarika hain ki ek schema business rules ko **guarantees ke roop mein** encode karta hai, documentation nahi jise application code honour kare ya na kare.`,

    examples: [
      {
        title: 'Omitting a column with a DEFAULT uses the default value',
        titleHi: 'DEFAULT waale column ko omit karna default value istemal karta hai',
        code: `CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending');

-- omitting status uses the DEFAULT
INSERT INTO orders (id) VALUES (1);
SELECT * FROM orders;`,
        output: ` id | status
----+---------
 1  | pending
(1 row)`,
        explain: "`INSERT INTO orders (id) VALUES (1)` omits `status` entirely, so PostgreSQL substitutes the declared `DEFAULT`, `'pending'`. This is the defining behavior of `DEFAULT`: it only fires when a column is left out of the column list, not whenever the column happens to end up empty by some other means.",
        explainHi: "`INSERT INTO orders (id) VALUES (1)` `status` ko poori tarah omit karta hai, to PostgreSQL declared `DEFAULT`, `'pending'` substitute karta hai. Ye `DEFAULT` ka defining behavior hai: ye sirf tab fire hota hai jab ek column column list se chhoड़ diya jaता hai, jab bhi column kisी doosre tarike se khaali ho jaта hai tab nahi.",
      },
      {
        title: 'Explicitly inserting NULL still violates NOT NULL, even with a DEFAULT declared',
        titleHi: 'Explicitly NULL insert karna abhi bhi NOT NULL violate karta hai, DEFAULT declared hone ke bavjood',
        code: `CREATE TABLE orders (id int PRIMARY KEY, status text NOT NULL DEFAULT 'pending');

-- explicitly inserting NULL still violates NOT NULL -- DEFAULT only fires when the
-- column is left out entirely, not when NULL is written explicitly
INSERT INTO orders (id, status) VALUES (2, NULL);`,
        output: `[ERROR] null value in column "status" of relation "orders" violates not-null constraint`,
        explain: 'Here `status` is explicitly named in the column list and given the value `NULL` — a completely different situation from omitting it. `DEFAULT` never gets a chance to fire, because the column was NOT left out; the explicit `NULL` is what PostgreSQL sees, and that value still violates `NOT NULL` just as directly as leaving the column out with no default ever would.',
        explainHi: 'Yahaan `status` explicitly column list mein named hai aur ise `NULL` value diya gaya hai — ise omit karne se poori tarah alag situation. `DEFAULT` ko kabhi fire hone ka mौका nahi milता, kyunki column ko chhoड़ा NAHI gaya; explicit `NULL` wo hai jo PostgreSQL dekhता hai, aur wo value abhi bhi `NOT NULL` ko theek utna hi seedhے violate karti hai.',
      },
      {
        title: 'A named CHECK constraint gives a clear, specific error',
        titleHi: 'Ek named CHECK constraint ek saaf, specific error deta hai',
        code: `CREATE TABLE product (id int PRIMARY KEY, price numeric CONSTRAINT positive_price CHECK (price > 0));
INSERT INTO product VALUES (1, -5);`,
        output: `[ERROR] new row for relation "product" violates check constraint "positive_price"`,
        explain: '`CONSTRAINT positive_price CHECK (price > 0)` gives the rule an explicit name, `positive_price`, instead of letting PostgreSQL invent one. When `-5` is inserted, the check fails and the error message names the constraint directly — `violates check constraint "positive_price"` — immediately telling you which rule broke, rather than a generic auto-generated name you would have to look up.',
        explainHi: '`CONSTRAINT positive_price CHECK (price > 0)` rule ko ek explicit naam deta hai, `positive_price`, PostgreSQL ko ek invent karne dene ke bजाy. Jab `-5` insert hoता hai, check fail hota hai aur error message constraint ko seedhے name karta hai — turant batate hue kaunसा rule tootha, ek generic auto-generated naam ke bजаय jise aapko dhoondна padta.',
      },
      {
        title: 'A multi-column CHECK enforces a relationship between two columns of the same row',
        titleHi: 'Ek multi-column CHECK usi row ke do columns ke beech ek relationship enforce karta hai',
        code: `CREATE TABLE date_range (id int PRIMARY KEY, starts_on date, ends_on date,
                         CHECK (starts_on < ends_on));
INSERT INTO date_range VALUES (1, '2026-06-10', '2026-06-01');`,
        output: `[ERROR] new row for relation "date_range" violates check constraint "date_range_check"`,
        explain: "`CHECK (starts_on < ends_on)` references TWO columns of the same row, not just one — this is exactly what a multi-column `CHECK` is for. Inserting `('2026-06-10', '2026-06-01')` puts the later date in `starts_on` and the earlier one in `ends_on`, so `starts_on < ends_on` evaluates to `false`, and the row is rejected before it is ever stored.",
        explainHi: "`CHECK (starts_on < ends_on)` usī row ke DO columns reference karta hai, sirf ek nahi — yahi theek wo hai jiske liye ek multi-column `CHECK` hai. `('2026-06-10', '2026-06-01')` insert karna baad ki date ko `starts_on` mein aur pehli ko `ends_on` mein daalta hai, to `starts_on < ends_on` `false` evaluate hota hai, aur row kabhi store hone se pehle reject ho jaती hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- relying on application code alone to enforce "price must be positive"
-- (no CHECK constraint) -- validated only in the API layer
CREATE TABLE product (id int PRIMARY KEY, price numeric);
-- a bulk-import script, a manual fix, or a second internal tool can all
-- insert a negative price with nobody noticing until a report looks wrong`,
        right: `CREATE TABLE product (id int PRIMARY KEY, price numeric CHECK (price > 0));
-- now EVERY writer -- the API, a bulk import, a manual UPDATE, a future
-- service nobody has written yet -- is blocked from ever storing a bad price`,
        why: 'Application-level validation only runs for the code paths someone remembered to add it to. A bulk import script written months later, an ad hoc UPDATE run by an operator during an incident, or a second service added to the system can all write to the same table without going through the original validation logic, and each is a way a negative price can slip in silently. A CHECK constraint is enforced by the database itself on every single write, regardless of which application, script, or person is doing it, so the rule cannot be bypassed by a code path nobody thought to validate. This is the same argument Module 7 made for foreign keys: a database-level constraint is a guarantee, application-level validation is a convention that depends on every future writer remembering to follow it.',
        whyHi: 'Application-level validation sirf un code paths ke liye chalti hai jinme kisi ne ise add karna yaad rakha. Mahiनों baad likha ek bulk import script, ek incident ke dौran ek operator dwara chalाya ek ad hoc UPDATE, ya system mein add ki gayi ek doosri service sab usi table mein likh sakte hain bina original validation logic se guzarे. Ek CHECK constraint database dwara khud har single write par enforce hota hai, chahe koi bhi likh raha ho, to rule ko koi bhi code path bypass nahi kar sakta jisne validate karna nahi socha.',
      },
      {
        wrong: `-- a CHECK constraint that assumes it can see other rows
CREATE TABLE seat_booking (seat_number int, booked_by text,
                          CHECK (seat_number NOT IN (SELECT seat_number FROM seat_booking)));
-- ERROR: subqueries are not allowed in CHECK constraints`,
        right: `-- a CHECK can only look at the CURRENT row's own columns; "no duplicate seat" is
-- a table-wide rule, so it needs a UNIQUE constraint instead
CREATE TABLE seat_booking (seat_number int UNIQUE, booked_by text);`,
        why: 'A CHECK constraint is evaluated against a single candidate row in isolation and has no way to reference other rows of the same table, or any other table, which is why a subquery inside a CHECK is rejected outright by PostgreSQL. Rules that depend on comparing a row to its siblings, like "this seat number must not already be booked by anyone else", are inherently about the whole table\'s current state, not about one row\'s own columns, and that is exactly what a UNIQUE constraint is built to enforce efficiently. The general pattern: CHECK is for a rule the current row can verify entirely on its own; UNIQUE is for "no other row may share this value"; a FOREIGN KEY is for "this value must exist in another table"; anything that needs to compare across many rows in a more complex way than plain uniqueness typically needs a trigger or an application-level check instead.',
        whyHi: 'Ek CHECK constraint ek single candidate row ke against isolation mein evaluate hota hai aur usi table ki doosri rows, ya kisi doosri table, ko reference karne ka koi tarika nahi rakhta, isiliye ek CHECK ke andar ek subquery PostgreSQL dwara seedhے reject hoती hai. "Ye seat number kisi aur ne pehle se book nahi karni chahiye" jaise rules poori table ke current state ke baare mein hain, ek row ke apne columns ke baare mein nahi, aur ye theek wo hai jo ek UNIQUE constraint efficiently enforce karne ke liye bana hai.',
      },
      {
        wrong: `-- an unnamed CHECK, discovered only when the cryptic auto-generated name
-- shows up in an error message or a later migration
CREATE TABLE inventory (id int PRIMARY KEY, qty int CHECK (qty >= 0));
-- error later reads: violates check constraint "inventory_qty_check" -- fine, but
-- guessing the auto-generated name when writing a later ALTER TABLE DROP CONSTRAINT
-- is fragile if the column or table is ever renamed`,
        right: `CREATE TABLE inventory (id int PRIMARY KEY, qty int CONSTRAINT qty_non_negative CHECK (qty >= 0));
-- the name is stable and meaningful regardless of future column/table renames`,
        why: 'An unnamed constraint still gets a name, PostgreSQL generates one automatically, typically combining the table and column names, but that generated name changes if the table or column is later renamed, and it has to be looked up (via a catalog query or an error message) rather than simply known. Naming a constraint explicitly costs nothing at creation time and pays off the moment anyone needs to reference it again: a clearer error message when the constraint is violated, and a stable, memorable target for a later ALTER TABLE DROP CONSTRAINT or ALTER TABLE ... VALIDATE CONSTRAINT, rather than having to first query the system catalogs to discover what PostgreSQL happened to call it.',
        whyHi: 'Ek unnamed constraint ko phir bhi ek naam milता hai, PostgreSQL automatically ek banaता hai, typically table aur column names combine karके, par wo generated naam badal jaता hai agar table ya column baad mein rename ho. Ek constraint ko explicitly naam dena creation time par kuch cost nahi karta aur jis pal kisi ko ise phir se reference karна hai payoff karta hai: constraint violate hone par ek clearer error message, aur baad ke `ALTER TABLE DROP CONSTRAINT` ke liye ek stable, memorable target.',
      },
    ],

    realWorld: [
      {
        en: '**Every money/quantity column in a schema wrapped in a named `CHECK (... > 0)` or `CHECK (... >= 0)`** as a team-wide migration-review requirement, catching an entire class of "negative price" bugs at the database level.',
        hi: '**Ek schema ke har money/quantity column ko ek named `CHECK (... > 0)` mein wrap karna** ek team-wide migration-review requirement ke roop mein.',
      },
      {
        en: '**A `date_range` table with `CHECK (starts_on < ends_on)`** catching a data-entry bug (swapped start/end dates from a form) before it ever reaches a report.',
        hi: '**Ek `date_range` table `CHECK (starts_on < ends_on)` ke saath** ek data-entry bug pakड़te hue.',
      },
      {
        en: '**`UNIQUE (tenant_id, slug)`** — a composite uniqueness rule ensuring slugs are unique *per tenant* in a multi-tenant SaaS schema, rather than globally unique across all tenants.',
        hi: '**`UNIQUE (tenant_id, slug)`** — ek composite uniqueness rule jo ensure karta hai ki slugs *prati tenant* unique hain, globally unique nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why prefer a database-level `CHECK` constraint over validating the same rule only in application code?',
        qHi: 'Sirf application code mein wahi rule validate karne ke bजाy ek database-level `CHECK` constraint kyun prefer karें?',
        a: 'Application-level validation is only as reliable as every single code path that writes to the table. As a system grows, that includes the original API, but also bulk import or data-migration scripts, manual fixes an operator runs directly against the database during an incident, a second internal service that gets added later, or a background job someone writes a year from now, none of which necessarily go through the same validation logic the original application enforces. Any one of those can silently write data that violates the intended rule. A CHECK constraint is evaluated by the database engine itself on every insert and update, unconditionally, for every writer, so the rule cannot be bypassed by a code path nobody remembered to validate. This mirrors the same reasoning Module 7 gave for foreign keys: application code manages the common, expected path well, but a database constraint is the one guarantee that holds regardless of who or what is writing, which is exactly the property you want for a rule like "a price must be positive" that should never have an exception.',
        aHi: 'Application-level validation sirf utni reliable hai jितने single code path table mein likhते hain. Jaise system badता hai, ismein original API shamil hai, par bulk import scripts, ek operator dwara ek incident ke dौran chalाye manual fixes, ek doosri internal service jo baad mein add hoती hai, ya ek background job jo koi ek saal baad likhे, in mein se koi bhi wahi validation logic se nahi guzारता. Ek CHECK constraint database engine khud dwara har insert aur update par evaluate hota hai, unconditionally, har writer ke liye, to rule ko koi code path bypass nahi kar sakta jisne validate karna yaad nahi rakha.',
      },
      {
        q: 'What is the difference between `UNIQUE` and `PRIMARY KEY`, and can a `CHECK` constraint reference another table?',
        qHi: '`UNIQUE` aur `PRIMARY KEY` mein kya antar hai, aur kya ek `CHECK` constraint doosri table reference kar sakta hai?',
        a: 'Both UNIQUE and PRIMARY KEY guarantee no two rows share the same value in the constrained column or columns, but they differ in two ways. A table may have only one PRIMARY KEY, since it is meant to be the single defining identity of a row, but it may have any number of separate UNIQUE constraints, one for each real-world attribute that also happens to need to be distinct, such as an email address alongside a surrogate id. And a PRIMARY KEY implicitly forbids NULL as well as duplicates, whereas a UNIQUE column does allow multiple NULLs, because NULL is never considered equal to another NULL even for uniqueness purposes, so several rows can each have a NULL in a UNIQUE column simultaneously. As for CHECK, it cannot reference another table at all; it is evaluated against a single row in isolation and can only look at that row\'s own column values. A rule that depends on another table, such as "this foreign key must point at a row that actually exists", is what a FOREIGN KEY constraint is specifically for, and a rule that depends on other rows of the very same table, such as uniqueness, needs a UNIQUE constraint rather than a CHECK, since PostgreSQL rejects a subquery inside a CHECK expression outright.',
        aHi: 'UNIQUE aur PRIMARY KEY dono guarantee karте hain ki koi do rows constrained column ya columns mein same value share nahi karti, par wo do tarikों se alag hain. Ek table ki sirf ek PRIMARY KEY ho sakti hai, par iske paas koi bhi sankhya mein alag UNIQUE constraints ho sakте hain. Aur ek PRIMARY KEY implicitly NULL ko bhi forbid karta hai, jabki ek UNIQUE column kई NULLs allow karta hai. CHECK ke baare mein, ye doosri table reference bilkul nahi kar sakta; ye ek single row ke against isolation mein evaluate hota hai. Ek rule jo doosri table par depend karta hai FOREIGN KEY ke liye hai, aur ek rule jo usi table ki doosri rows par depend karta hai use UNIQUE constraint chahiye, CHECK nahi.',
      },
    ],

    exercises: [
      {
        task: 'Table `account(id int PRIMARY KEY, balance numeric NOT NULL DEFAULT 0 CHECK (balance >= 0))`. Insert a row omitting `balance` and confirm it defaults to `0`. Then try inserting a row with `balance = -50` and confirm the CHECK rejects it.',
        taskHi: 'Table `account(id, balance NOT NULL DEFAULT 0 CHECK (balance >= 0))`. `balance` omit karke ek row insert karo aur confirm karo ye `0` par default hoti hai. Phir `balance = -50` waali ek row insert karne ki koshish karo.',
        hint: 'Omitting `balance` triggers `DEFAULT 0`. Explicitly inserting `-50` violates `CHECK (balance >= 0)` regardless of the default — `DEFAULT` and `CHECK` are independent, unrelated mechanisms.',
        hintHi: '`balance` omit karna `DEFAULT 0` trigger karta hai. Explicitly `-50` insert karna `CHECK (balance >= 0)` violate karta hai default ke bavjood.',
      },
      {
        task: 'Table `event(id int PRIMARY KEY, starts_at timestamptz, ends_at timestamptz, CONSTRAINT valid_range CHECK (starts_at < ends_at))`. Insert a valid row, then try one where `ends_at` is before `starts_at` and confirm the NAMED constraint appears in the error message.',
        taskHi: 'Table `event(id, starts_at, ends_at, CONSTRAINT valid_range CHECK (starts_at < ends_at))`. Ek valid row insert karo, phir ek jahaan `ends_at` `starts_at` se pehle hai aur confirm karo NAMED constraint error message mein aata hai.',
        hint: 'The error will read `violates check constraint "valid_range"` — the explicit name makes the failure immediately identifiable, versus a generic auto-generated name.',
        hintHi: 'Error `violates check constraint "valid_range"` padhega — explicit naam failure ko turant identifiable banata hai, ek generic auto-generated naam ke muकаble.',
      },
      {
        task: 'Table `user(id int PRIMARY KEY, username text UNIQUE, email text UNIQUE)`. Insert 2 users with distinct usernames but the SAME email, and confirm the `email` constraint (not `username`) is the one that fires.',
        taskHi: 'Table `user(id, username UNIQUE, email UNIQUE)`. Do users insert karo alag usernames ke saath par SAME email ke saath, aur confirm karo `email` constraint fire hota hai, `username` nahi.',
        hint: 'Two separate `UNIQUE` constraints are independent — violating one (`email`) does not depend on the state of the other (`username`). The error message names the specific constraint (`user_email_key`) that was violated.',
        hintHi: 'Do alag `UNIQUE` constraints independent hain — ek (`email`) violate karna doosre (`username`) ke state par depend nahi karta.',
      },
    ],

    keyTakeaways: [
      'A constraint is checked on EVERY `INSERT`/`UPDATE`, regardless of which application/script/person writes — the core reason to prefer a database constraint over "the app validates this": app-level validation is only as good as every code path that writes to the table, and a database constraint cannot be bypassed by any of them.',
      '`NOT NULL`: this column may never hold `NULL`. `DEFAULT value`: substituted only when the column is OMITTED from the `INSERT` — NOT when it is explicitly set to `NULL` (those are different: an explicit `NULL` still violates `NOT NULL`).',
      '`UNIQUE`: no two rows share this value. Unlike `PRIMARY KEY`: a table can have ANY NUMBER of `UNIQUE` constraints, and a `UNIQUE` column DOES allow multiple `NULL`s (NULL is never "equal" to another NULL, even for uniqueness). `UNIQUE` can span MULTIPLE columns (a composite unique constraint — the mechanism behind a junction table\'s composite PK, Module 7).',
      '`CHECK (expr)`: an arbitrary boolean rule, evaluated per row, must be `TRUE` or `NULL` (not definitely `FALSE`) to pass. CAN reference multiple columns of the SAME row (`CHECK (lo < hi)`). CANNOT reference another table (that\'s `FOREIGN KEY`) or another row of the same table (`CHECK` subqueries are rejected outright — use `UNIQUE` for cross-row uniqueness rules).',
      'NAME your constraints (`CONSTRAINT name CHECK (...)`) — unnamed constraints get an auto-generated name (e.g. `table_column_check`) that changes if the table/column is renamed and must be looked up rather than known; a stable, meaningful name pays off in error messages and later `ALTER TABLE ... DROP/VALIDATE CONSTRAINT`.',
      'THE FULL PICTURE: `NOT NULL` + `DEFAULT` + `UNIQUE` + `CHECK` (this lesson) + `PRIMARY KEY` + `FOREIGN KEY` (Module 7) together turn business rules into structural guarantees ("every order has a status", "no two customers share an email", "a price is always positive") rather than documentation application code may or may not honour.',
    ],
    keyTakeawaysHi: [
      'Ek constraint HAR `INSERT`/`UPDATE` par check hota hai, chahe koi bhi application/script/vyakti likhe — database constraint ko "app ise validate karti hai" se prefer karne ka core reason: app-level validation sirf utni achhी hai jितने code paths table mein likhते hain.',
      '`NOT NULL`: ye column kabhi `NULL` nahi rakh sakta. `DEFAULT value`: sirf tab substitute hota hai jab column `INSERT` se OMIT kiya jaता hai — jab explicitly `NULL` set kiya jaता hai TAB NAHI.',
      '`UNIQUE`: koi do rows ye value share nahi karti. `PRIMARY KEY` ke ulта: ek table ke paas KOI BHI SANKHYA mein `UNIQUE` constraints ho sakте hain, aur ek `UNIQUE` column kई `NULL`s allow karta hai. `UNIQUE` KAI columns ke across ho sakta hai.',
      '`CHECK (expr)`: ek arbitrary boolean rule, prati row evaluated, pass hone ke liye `TRUE` ya `NULL` hona chahiye. USI row ke kई columns reference KAR SAKTA hai. Doosri table (FOREIGN KEY ke liye) ya usi table ki doosri row reference NAHI kar sakta.',
      'Apne constraints ko NAAM do — unnamed constraints ek auto-generated naam paate hain jo table/column rename hone par badal jaata hai; ek stable, meaningful naam error messages aur baad ke `ALTER TABLE` mein payoff karta hai.',
      'POORI PICTURE: `NOT NULL` + `DEFAULT` + `UNIQUE` + `CHECK` (ye lesson) + `PRIMARY KEY` + `FOREIGN KEY` (Module 7) saath mein business rules ko structural guarantees mein badalте hain, documentation nahi jise application code honour kare ya na kare.',
    ],
  },

  {
    slug: 'sql-generated-columns',
    title: 'Generated Columns: Derived Values the Database Guarantees',
    titleHi: 'Generated Columns: Derived Values Jo Database Guarantee Karta Hai',
    description: 'A `GENERATED ALWAYS AS (expression) STORED` column computes its value from other columns of the same row, automatically, on every insert and update — closing the "derived value silently drifts out of sync" gap that Module 7 flagged as a 3NF-adjacent risk.',
    descriptionHi: 'Ek `GENERATED ALWAYS AS (expression) STORED` column apni value usी row ke doosre columns se compute karta hai, automatically, har insert aur update par — us "derived value chupchaap sync se bahar drift karti hai" gap ko band karte hue jise Module 7 ne ek 3NF-adjacent risk ke roop mein flag kiya tha.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A calculator built into the spreadsheet cell itself, versus a coworker who is supposed to remember to recalculate a total by hand.** In a spreadsheet, cell C1 can hold the formula `=A1*B1` — you never type a value into C1 directly, and it can never disagree with A1 and B1, because it is not really a stored fact at all, it is a rule the spreadsheet re-applies automatically the instant either input changes. Compare that to a coworker who has agreed to update a paper ledger\'s "total" column by hand, in pen, every time the quantity or unit price changes on the same line: it works, right up until the one day they are busy, forget, or make an arithmetic slip, and now the ledger shows a total that no longer matches its own inputs, with nothing on the page to flag the disagreement. A `GENERATED` column is the spreadsheet formula: the database itself recomputes it from the row\'s other columns, on every write, and it is structurally impossible for it to hold a stale or self-contradictory value, because you are not even allowed to write to it directly.',
      hi: '**Spreadsheet cell mein hi built-in ek calculator, us coworker ke muकаble jise ek total ko haath se recalculate karна yaad rakhna hai.** Ek spreadsheet mein, cell C1 formula `=A1*B1` rakh sakta hai — aap kabhi C1 mein seedhे ek value type nahi karте, aur ye kabhi A1 aur B1 se disagree nahi kar sakta, kyunki ye asal mein ek stored fact hai hi nahi, ye ek rule hai jise spreadsheet automatically re-apply karta hai jis pal koi bhi input badalta hai. Iski tulna ek coworker se karो jisne ek paper ledger ke "total" column ko haath se, pen se, update karne ko maана hai jab bhi quantity ya unit price usi line par badalti hai: ye kaam karta hai, theek us din tak jab wo busy hon, bhool jaayen, ya ek arithmetic slip karें, aur ab ledger ek total dikhata hai jo apne hi inputs se match nahi karta. Ek `GENERATED` column spreadsheet formula hai: database khud ise row ke doosre columns se recompute karta hai, har write par, aur iske liye ek stale ya self-contradictory value rakhna structurally impossible hai, kyunki aapko ise seedhے likhne ki ijaazat hai hi nahi.',
    },

    simple: `**\`GENERATED ALWAYS AS (expression) STORED\` — computed from other columns, automatically**

\`\`\`sql
CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 3, 9.5);
SELECT * FROM order_line;   -- line_total = 28.50, computed automatically
\`\`\`

**You cannot write to a generated column directly — that is the whole point**

\`\`\`sql
INSERT INTO order_line (id, qty, unit_price, line_total) VALUES (2, 1, 1, 999);
-- ERROR: cannot insert a non-DEFAULT value into column "line_total"
-- (it is always recomputed FROM qty and unit_price -- never trusted to a writer)
\`\`\`

**Why this matters (Module 7 recap): a manually-maintained derived column can drift**

\`\`\`
tax_amount stored separately, "kept in sync" by every writer remembering to recompute it
  -> one writer forgets -> tax_amount silently disagrees with subtotal * tax_rate

line_total as a GENERATED column
  -> impossible to disagree with qty * unit_price -- the database will not allow it
\`\`\`

**When to use it vs a plain query-time calculation vs a view**

\`\`\`
compute it in the SELECT (Module 1-6)      -- always correct, costs nothing to store, but recomputed every read
GENERATED ... STORED column                -- computed once, stored, indexable, still always in sync
a maintained column + trigger              -- for values that depend on OTHER rows (Module 7's comment_count) --
                                               GENERATED can only see the SAME row's own columns
\`\`\``,

    simpleHi: `**\`GENERATED ALWAYS AS (expression) STORED\` — doosre columns se automatically compute**

\`\`\`sql
CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 3, 9.5);
SELECT * FROM order_line;   -- line_total = 28.50, automatically compute
\`\`\`

**Aap ek generated column mein seedhе nahi likh sakte — yahi poora point hai**

\`\`\`sql
INSERT INTO order_line (id, qty, unit_price, line_total) VALUES (2, 1, 1, 999);
-- ERROR: cannot insert a non-DEFAULT value into column "line_total"
-- (ye hamesha qty aur unit_price SE recompute hota hai -- kisi writer par kabhi trust nahi kiya jaata)
\`\`\`

**Ye kyun maayne rakhta hai (Module 7 recap): ek manually-maintained derived column drift kar sakta hai**

\`\`\`
tax_amount alag store, "sync mein rakha" har writer dwara jo recompute karna yaad rakhе
  -> ek writer bhool jaata hai -> tax_amount chupchaap subtotal * tax_rate se disagree karta hai

line_total ek GENERATED column ke roop mein
  -> qty * unit_price se disagree karna impossible hai -- database allow hi nahi karega
\`\`\`

**Ise kab istemal karें vs SELECT mein compute karna vs ek view**

\`\`\`
SELECT mein compute karo (Module 1-6)      -- hamesha sahi, store karne mein kuch cost nahi, par har read par recomputed
GENERATED ... STORED column                -- ek baar compute, stored, indexable, phir bhi hamesha sync mein
ek maintained column + trigger             -- un values ke liye jo DOOSRI rows par depend karte hain (Module 7 ka comment_count) --
                                               GENERATED sirf SAME row ke apne columns dekh sakta hai
\`\`\``,

    content: `## What a generated column is

\`GENERATED ALWAYS AS (expression) STORED\` declares a column whose value is **computed from other columns of the same row** and physically stored on disk, recalculated automatically on every \`INSERT\` and \`UPDATE\`:

\`\`\`sql
CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
\`\`\`

Every time \`qty\` or \`unit_price\` changes, \`line_total\` is recomputed by the database itself — there is no window where it can hold a stale value, because it is never independently written.

## You cannot write to it directly

\`\`\`sql
INSERT INTO order_line (id, qty, unit_price, line_total) VALUES (2, 1, 1, 999);
-- ERROR: cannot insert a non-DEFAULT value into column "line_total"
\`\`\`

This restriction **is the feature**: a column you could optionally override is a column that could drift; a column you structurally cannot write to can never disagree with the expression that defines it.

## Why this matters: closing the Module 7 gap

Module 7 (Lesson 4) flagged storing a derived value in an ordinary column — \`tax_amount\` alongside \`subtotal\` and \`tax_rate\` — as a risk close to a transitive dependency: nothing stops the stored value from silently going stale the moment the inputs change without every writer remembering to recompute it. A \`GENERATED\` column removes that risk entirely for values that depend only on **other columns of the same row**: the database recomputes it, always, on every write, with no possibility of a writer forgetting.

\`\`\`sql
CREATE TABLE invoice (
  subtotal numeric,
  tax_rate numeric,
  tax_amount numeric GENERATED ALWAYS AS (subtotal * tax_rate) STORED
);
-- tax_amount can NEVER disagree with subtotal * tax_rate -- it is not a separate fact,
-- it is the same fact, computed automatically
\`\`\`

## Generated column vs query-time calculation vs a maintained column + trigger

Three ways to get a derived value, each right for a different situation:

| approach | when |
|---|---|
| compute it in the \`SELECT\` (Modules 1-6) | cheap to compute, only needed occasionally at read time — no storage cost, always correct, but redone on every read |
| \`GENERATED ... STORED\` column | depends only on **other columns of the same row**, worth storing (so it can be indexed, or reading it is much more common than the underlying columns changing) |
| a maintained column kept in sync by a trigger (Module 7, Lesson 6) | depends on **other rows** (a \`comment_count\` on \`post\`, aggregated from the \`comment\` table) — \`GENERATED\` cannot see other rows or other tables, only the current row's own columns |

The generated-column restriction to "only this row's own columns" is a hard rule, not a style preference: \`GENERATED\` expressions cannot reference other rows, other tables, or non-deterministic functions like \`now()\` or \`random()\` — anything requiring those still needs the trigger-based pattern from Module 7.

## Indexing a generated column

Because a \`STORED\` generated column is physically materialized like any other column, it can be indexed exactly like one — useful when the derived value is queried or sorted on often (an index on \`line_total\` to quickly find the largest order lines) without needing an **expression index** (Module 10) recomputed on every lookup.

## \`STORED\` vs the alternative

PostgreSQL currently only supports \`STORED\` generated columns (the value is written to disk and kept in sync automatically). Some other databases additionally offer a "virtual"/"not stored" generated column, computed on read rather than written to disk — PostgreSQL does not have this option; the closest equivalent when you specifically do **not** want to pay any storage cost is simply computing the expression in the query itself (the first row of the table above).`,

    contentHi: `## Ek generated column kya hai

\`GENERATED ALWAYS AS (expression) STORED\` ek column declare karta hai jiski value **usी row ke doosre columns se compute** hoती hai aur disk par physically store hoती hai, har \`INSERT\` aur \`UPDATE\` par automatically recalculated:

\`\`\`sql
CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
\`\`\`

Har baar jab \`qty\` ya \`unit_price\` badalta hai, \`line_total\` database khud dwara recompute hota hai — koi window nahi jahaan ye ek stale value rakh sake.

## Aap isমein seedhے nahi likh sakte

\`\`\`sql
INSERT INTO order_line (id, qty, unit_price, line_total) VALUES (2, 1, 1, 999);
-- ERROR: cannot insert a non-DEFAULT value into column "line_total"
\`\`\`

Ye restriction **hi feature hai**: ek column jise aap optionally override kar sakte the ek aisा column hai jo drift kar sakta tha; ek column jise aap structurally likh hi nahi sakte kabhi is expression se disagree nahi kar sakta jo ise define karta hai.

## Ye kyun maayne rakhta hai: Module 7 ka gap band karna

Module 7 (Lesson 4) ne ek derived value ko ek ordinary column mein store karne ko ek risk ke roop mein flag kiya — \`tax_amount\` \`subtotal\` aur \`tax_rate\` ke saath. Ek \`GENERATED\` column ye risk poori tarah hataता hai un values ke liye jo sirf **usी row ke doosre columns** par depend karte hain.

## Generated column vs query-time calculation vs ek maintained column + trigger

Teen tarike ek derived value paane ke, har ek ek alag situation ke liye sahi:

| approach | kab |
|---|---|
| \`SELECT\` mein compute karo | sasta compute karne ke liye, kabhi-kabhi read time par chahiye |
| \`GENERATED ... STORED\` column | sirf **usी row ke doosre columns** par depend karta hai |
| ek trigger dwara maintained column | **doosri rows** par depend karta hai (\`post\` par \`comment_count\`) — \`GENERATED\` doosri rows dekh nahi sakta |

Generated-column ki "sirf is row ke apne columns" tak restriction ek hard rule hai: \`GENERATED\` expressions doosri rows, doosri tables, ya \`now()\`/\`random()\` jaise non-deterministic functions reference nahi kar sakte.

## Ek generated column ko index karna

Kyunki ek \`STORED\` generated column doosre column ki tarah physically materialized hai, ise theek waise hi index kiya ja sakta hai.

## \`STORED\` vs alternative

PostgreSQL abhi sirf \`STORED\` generated columns support karta hai. Kuch doosre databases ek "virtual" generated column bhi dete hain. PostgreSQL ke paas ye option nahi hai; sabse close equivalent jab aapko specifically koi storage cost nahi chahiye query mein hi expression compute karna hai.`,

    examples: [
      {
        title: 'A GENERATED column recomputes automatically from other columns of the same row',
        titleHi: 'Ek GENERATED column usi row ke doosre columns se automatically recompute hota hai',
        code: `CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 3, 9.5);
SELECT * FROM order_line;`,
        output: ` id | qty | unit_price | line_total
----+-----+------------+------------
 1  | 3   | 9.5        | 28.5
(1 row)`,
        explain: '`line_total` is declared `GENERATED ALWAYS AS (qty * unit_price) STORED`, so it is never written directly — the moment `qty` (3) and `unit_price` (9.5) are inserted, PostgreSQL computes `3 * 9.5 = 28.5` and stores that result on the row automatically, with no separate step needed to populate it.',
        explainHi: '`line_total` `GENERATED ALWAYS AS (qty * unit_price) STORED` declare kiya gaya hai, to ye kabhi seedhے likha nahi jaता — jis pal `qty` (3) aur `unit_price` (9.5) insert hote hain, PostgreSQL `3 * 9.5 = 28.5` compute karta hai aur wo result row par automatically store karta hai, ise populate karne ke liye koi alag step ki zaroorat nahi.',
      },
      {
        title: 'Writing directly to a generated column is rejected',
        titleHi: 'Ek generated column mein seedhے likhна reject hota hai',
        code: `CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
INSERT INTO order_line (id, qty, unit_price, line_total) VALUES (2, 1, 1, 999);`,
        output: `[ERROR] cannot insert a non-DEFAULT value into column "line_total"`,
        explain: 'Naming `line_total` in the `INSERT` column list, alongside `id`, `qty`, and `unit_price`, and giving it an explicit value (`999`) is exactly what a `GENERATED` column forbids: PostgreSQL rejects the whole statement with `cannot insert a non-DEFAULT value into column "line_total"`, because the column\'s value is never an independent fact you get to set — it is always derived from the other columns.',
        explainHi: '`INSERT` column list mein `line_total` ko naam dena, `id`, `qty`, aur `unit_price` ke saath, aur ise ek explicit value (`999`) dena theek wo hai jo ek `GENERATED` column forbid karta hai: PostgreSQL poore statement ko reject karta hai `cannot insert a non-DEFAULT value into column "line_total"` ke saath, kyunki column ki value kabhi ek independent fact nahi hai jise aap set kar sakte ho — ye hamesha doosre columns se derived hai.',
      },
      {
        title: 'Updating an input column automatically recomputes the generated column',
        titleHi: 'Ek input column update karna generated column ko automatically recompute karta hai',
        code: `CREATE TABLE order_line (
  id int PRIMARY KEY,
  qty int,
  unit_price numeric,
  line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED
);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 2, 10);

-- change the quantity -- line_total updates itself, with no separate UPDATE needed for it
UPDATE order_line SET qty = 5 WHERE id = 1;
SELECT * FROM order_line;`,
        output: ` id | qty | unit_price | line_total
----+-----+------------+------------
 1  | 5   | 10         | 50
(1 row)`,
        explain: 'The row starts with `qty = 2, unit_price = 10`, so `line_total = 20` initially. `UPDATE order_line SET qty = 5` changes only `qty` explicitly — there is no `SET line_total = ...` anywhere in the statement — yet `line_total` becomes `50` (`5 * 10`) because PostgreSQL recomputes every `GENERATED` column as part of any `UPDATE` that touches a column it depends on.',
        explainHi: 'Row `qty = 2, unit_price = 10` se shuru hoती hai, to `line_total` shuru mein `20` hai. `UPDATE order_line SET qty = 5` sirf `qty` ko explicitly badalta hai — statement mein kahin bhi `SET line_total = ...` nahi hai — phir bhi `line_total` `50` (`5 * 10`) ban jaता hai kyunki PostgreSQL har `GENERATED` column ko kisi bhi `UPDATE` ke hisse ke roop mein recompute karta hai jo iske depend waale column ko touch karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- a manually-maintained "total" column, trusted to every writer to keep in sync
CREATE TABLE order_line (id int PRIMARY KEY, qty int, unit_price numeric, line_total numeric);
INSERT INTO order_line VALUES (1, 3, 9.5, 28.5);
-- later, someone corrects the quantity but forgets to update line_total
UPDATE order_line SET qty = 5 WHERE id = 1;
SELECT * FROM order_line;   -- line_total is now WRONG: still 28.5, should be 47.5`,
        right: `CREATE TABLE order_line (id int PRIMARY KEY, qty int, unit_price numeric,
                         line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 3, 9.5);
UPDATE order_line SET qty = 5 WHERE id = 1;
-- line_total recomputes automatically -- there is no code path that could forget`,
        why: 'A plain numeric column holding a derived value is only ever as correct as the last write that remembered to recompute it. The moment any writer, an application update, a bulk fix, a manual correction, changes one of the inputs without also updating the derived column, the two silently disagree, and nothing in the schema flags the inconsistency; it surfaces later as a report or invoice that does not add up. A GENERATED column removes the possibility of forgetting entirely, because there is no code path that writes to it directly: every UPDATE to qty or unit_price causes PostgreSQL itself to recompute line_total as part of the same statement, so the derived value can never be older than its inputs.',
        whyHi: 'Ek plain numeric column jo ek derived value rakhता hai sirf utna hi sahi hai jitna aakhri write jisne recompute karна yaad rakha. Jis pal koi bhi writer inputs mein se ek badalta hai bina derived column update kiye, dono chupchaap disagree karте hain, aur schema mein kuch bhi is inconsistency ko flag nahi karta. Ek GENERATED column bhoolne ki possibility poori tarah hataता hai, kyunki koi code path isमein seedhे nahi likhता: `qty` ya `unit_price` par har `UPDATE` PostgreSQL khud dwara `line_total` recompute karta hai usi statement ke hisse ke roop mein.',
      },
      {
        wrong: `-- trying to make a GENERATED column depend on another row / table (comment_count-style)
CREATE TABLE post (id int PRIMARY KEY,
                   comment_count int GENERATED ALWAYS AS (
                     (SELECT count(*) FROM comment WHERE comment.post_id = post.id)
                   ) STORED);
-- ERROR: generation expression is not immutable / cannot use subqueries`,
        right: `-- GENERATED can only see THIS row's own columns; a value that depends on other
-- rows needs a trigger-maintained column instead (Module 7, Lesson 6)
CREATE TABLE post (id int PRIMARY KEY, comment_count int NOT NULL DEFAULT 0);
-- maintained by a trigger fired on INSERT/DELETE to the comment table`,
        why: 'A GENERATED column expression is restricted to referencing the columns of the very same row it is computing a value for; it cannot contain a subquery, reference another table, or call a non-deterministic function, precisely because the whole guarantee it provides, that the value can never drift from its inputs, depends on those inputs being fixed and available within the row itself at write time. A count of related rows in another table is a fundamentally different kind of derived value: it depends on the state of a whole other table, which can change independently of any write to the post row itself, for instance when a comment is deleted without post being touched at all. That is exactly the case a database trigger is for, one that fires on changes to the comment table and updates the corresponding post row, which GENERATED columns are not designed to express.',
        whyHi: 'Ek GENERATED column expression usi row ke columns reference karne tak restricted hai jiske liye ye ek value compute kar raha hai; ye ek subquery nahi rakh sakta, doosri table reference nahi kar sakta, kyunki poori guarantee jo ye deता hai us par depend karti hai ki wo inputs row ke andar hi write time par fixed aur available hon. Doosri table mein related rows ka ek count ek fundamentally alag tarah ka derived value hai: ye ek poori doosri table ke state par depend karta hai. Yahi wo case hai jiske liye ek database trigger hai.',
      },
      {
        wrong: `-- assuming a GENERATED column can be updated like an ordinary column via UPDATE
CREATE TABLE order_line (id int PRIMARY KEY, qty int, unit_price numeric,
                         line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED);
INSERT INTO order_line (id, qty, unit_price) VALUES (1, 2, 10);
UPDATE order_line SET line_total = 999 WHERE id = 1;`,
        right: `-- there is nothing to "fix" here by writing to line_total -- update the INPUTS instead
UPDATE order_line SET qty = 99, unit_price = 10.09 WHERE id = 1;
-- line_total recomputes to whatever qty * unit_price now equals`,
        why: 'A GENERATED column rejects direct writes in an UPDATE for the same reason it rejects them in an INSERT: its value is never an independent fact you can set, it is always derived, so PostgreSQL raises the same cannot-insert-a-non-DEFAULT-value error regardless of which statement attempts the write. If the stored total looks wrong, the fix is never to overwrite the generated column itself, since that is not permitted, but to correct whichever input column, qty or unit_price here, actually needs correcting; the generated column then updates itself as a consequence, with no separate step required.',
        whyHi: 'Ek GENERATED column ek `UPDATE` mein direct writes ko usी wajah se reject karta hai jise ye `INSERT` mein reject karta hai: iski value kabhi ek independent fact nahi hai jise aap set kar sakte ho, ye hamesha derived hai. Agar stored total galat dikhता hai, fix kabhi generated column ko khud overwrite karna nahi hai, balki wo input column theek karна hai jise asal mein correction chahiye; generated column phir apne aap update ho jaता hai.',
      },
    ],

    realWorld: [
      {
        en: '**`line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED` on every order-line-shaped table across a company\'s codebase** — a standing convention that eliminated an entire category of "totals don\'t match" support tickets.',
        hi: '**Company ke codebase ke har order-line-shaped table par `line_total numeric GENERATED ALWAYS AS (qty * unit_price) STORED`** — ek standing convention jisne "totals match nahi karте" support tickets ki ek poori category khatm kar di.',
      },
      {
        en: '**`full_name text GENERATED ALWAYS AS (first_name || \' \' || last_name) STORED`, indexed, to support fast search** without recomputing the concatenation on every query.',
        hi: '**`full_name text GENERATED ALWAYS AS (first_name || \' \' || last_name) STORED`, indexed**, fast search support karne ke liye.',
      },
      {
        en: '**A finance schema review rule: any derived numeric column must be either `GENERATED` or explicitly documented with the trigger that maintains it** — no "just trust the app" derived columns allowed.',
        hi: '**Ek finance schema review rule: koi bhi derived numeric column ya to `GENERATED` hona chahiye ya us trigger ke saath explicitly documented jo ise maintain karta hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a `GENERATED` column, and what problem does it solve?',
        qHi: 'Ek `GENERATED` column kya hai, aur ye kaunसी problem solve karta hai?',
        a: 'A generated column, declared with GENERATED ALWAYS AS an expression STORED, computes its value from other columns of the same row and stores that computed value physically on disk, recalculating it automatically every time an INSERT or UPDATE touches the row. The problem it solves is the drift risk of an ordinary derived column: if you store a total as a plain numeric column and rely on every writer, the application, a bulk script, a manual fix, to remember to recompute it whenever the inputs change, the moment one of them forgets, the stored value silently disagrees with what it should be, and nothing in the schema flags that inconsistency until someone notices a total that does not add up. A generated column removes that entire failure mode because you cannot write to it directly at all; any attempt to insert or update it explicitly is rejected, so the only way its value can ever change is through PostgreSQL recomputing it from the current values of the columns it depends on. That makes it structurally impossible for the derived value to be stale, which is exactly the concern Module seven raised about storing something like a tax amount alongside a subtotal and a tax rate.',
        aHi: 'Ek generated column, `GENERATED ALWAYS AS` ek expression `STORED` ke saath declare kiya gaya, usी row ke doosre columns se apni value compute karta hai aur us computed value ko disk par physically store karता hai, har baar jab ek `INSERT` ya `UPDATE` row ko touch karta hai automatically recalculate karте hue. Ye jo problem solve karta hai wo ek ordinary derived column ka drift risk hai: agar aap ek total ko ek plain numeric column ke roop mein store karte ho aur har writer par bharosa karte ho ki jab bhi inputs badalte hain use recompute karna yaad rakhega, ek generated column poori tarah is failure mode ko hataता hai kyunki aap isমein seedhے likh hi nahi sakte.',
      },
      {
        q: 'What can and cannot a `GENERATED` column expression reference, and how do you handle a derived value that depends on other rows?',
        qHi: 'Ek `GENERATED` column expression kya reference kar sakta hai aur kya nahi, aur aap ek derived value ko kaise handle karte ho jo doosri rows par depend karta hai?',
        a: 'A generated column\'s expression may reference only the other columns of the very same row it is computing a value for. It cannot contain a subquery, cannot reference another table, and cannot call a non-deterministic function such as now or random, because the entire guarantee the column provides, that its value can never disagree with its inputs, depends on those inputs being fixed, deterministic, and available within the row at the moment of the write. A value like an order line total, computed from that line\'s own quantity and unit price, fits this perfectly. A value like a post\'s comment count, which depends on how many rows currently exist in a separate comment table, does not fit at all, because that count can change independently of any write to the post row itself, for instance when a comment belonging to it is deleted. For that second kind of derived value, the correct tool is not a generated column but a maintained column kept in sync by a trigger that fires on inserts and deletes to the related table and updates the aggregate column accordingly, which is the pattern Module seven introduced for denormalized counts.',
        aHi: 'Ek generated column ka expression sirf usी row ke doosre columns reference kar sakta hai jiske liye ye ek value compute kar raha hai. Ye ek subquery nahi rakh sakta, doosri table reference nahi kar sakta, aur `now` ya `random` jaisा ek non-deterministic function call nahi kar sakta, kyunki poori guarantee jo column deता hai us par depend karti hai ki wo inputs fixed, deterministic, aur write ke moment par row ke andar available hon. Ek order line total jaisा ek value, us line ke apne quantity aur unit price se compute, ise perfectly fit karta hai. Ek post ke comment count jaisा ek value, jo ek alag comment table mein abhi kितni rows exist karti hain us par depend karta hai, bilkul fit nahi karta. Us doosre tarah ke derived value ke liye, sahi tool ek generated column nahi balki ek trigger dwara maintained column hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `rectangle(id int PRIMARY KEY, width numeric, height numeric, area numeric GENERATED ALWAYS AS (width * height) STORED)`. Insert a row with `width = 4, height = 5`, confirm `area = 20`. Then `UPDATE` the width to `10` and confirm `area` recomputes to `50` with no separate update to `area` itself.',
        taskHi: 'Table `rectangle(id, width, height, area GENERATED ALWAYS AS (width * height) STORED)`. `width = 4, height = 5` waali ek row insert karo, `area = 20` confirm karo. Phir width ko `10` `UPDATE` karo aur confirm karo `area` `50` mein recompute hota hai.',
        hint: 'Only `width` and `height` are ever written directly; `area` recomputes itself as a consequence of the `UPDATE` to `width`, with no explicit `SET area = ...` needed or allowed.',
        hintHi: 'Sirf `width` aur `height` seedhе likhे jaте hain; `area` `width` ke `UPDATE` ke natijaе khud recompute hota hai.',
      },
      {
        task: 'Try `INSERT INTO rectangle (id, width, height, area) VALUES (2, 1, 1, 999)` against the table from the previous exercise and confirm it is rejected. Explain in a comment why this restriction is the whole point of a GENERATED column, not an inconvenient limitation.',
        taskHi: 'Pichli exercise ki table ke against `INSERT INTO rectangle (id, width, height, area) VALUES (2, 1, 1, 999)` try karo aur confirm karo ye reject hota hai.',
        hint: '`cannot insert a non-DEFAULT value into column "area"` — if you COULD write an arbitrary value to `area`, it could disagree with `width * height`, which is exactly the drift a GENERATED column exists to prevent.',
        hintHi: '`cannot insert a non-DEFAULT value into column "area"` — agar aap `area` mein ek arbitrary value likh SAKTE, ye `width * height` se disagree kar sakta tha.',
      },
      {
        task: 'Table `post(id int PRIMARY KEY, comment_count int)` and `comment(id int PRIMARY KEY, post_id int REFERENCES post(id))`. Explain in a comment why `comment_count` CANNOT be a `GENERATED` column here (it needs to count rows in a different table), and what mechanism (from Module 7) would maintain it correctly instead.',
        taskHi: 'Table `post(id, comment_count)` aur `comment(id, post_id REFERENCES post(id))`. Comment mein samjhao `comment_count` yahaan `GENERATED` column KYUN NAHI ho sakta.',
        hint: 'A `GENERATED` expression can only see the current row\'s own columns — `post.comment_count` would need to look at rows of a DIFFERENT table (`comment`), which is not permitted. A trigger on `comment` INSERT/DELETE is the correct mechanism (Module 7, Lesson 6).',
        hintHi: 'Ek `GENERATED` expression sirf current row ke apne columns dekh sakta hai — `post.comment_count` ko ek ALAG table (`comment`) ki rows dekhni hongi, jo allowed nahi hai. `comment` ke `INSERT`/`DELETE` par ek trigger sahi mechanism hai.',
      },
    ],

    keyTakeaways: [
      '`GENERATED ALWAYS AS (expression) STORED` computes a column\'s value from OTHER COLUMNS OF THE SAME ROW, automatically, on every `INSERT`/`UPDATE`, and physically stores the result. You CANNOT write to it directly — `INSERT`/`UPDATE` targeting it raises `cannot insert a non-DEFAULT value into column`.',
      'THE restriction IS the feature: a column you could optionally override could drift out of sync; a column you structurally cannot write to can NEVER disagree with the expression that defines it. Updating an INPUT column automatically recomputes the generated column — no separate step, no code path that could forget.',
      'This directly closes the Module 7 (Lesson 4) gap: a manually-maintained derived value (`tax_amount` alongside `subtotal`/`tax_rate`) can silently go stale if a writer forgets to recompute it. A `GENERATED` version of the same value CANNOT go stale — there is no writer to forget.',
      'THREE ways to get a derived value, each for a different case: compute in the `SELECT` (no storage cost, redone every read); `GENERATED ... STORED` (depends only on the SAME row\'s other columns, worth storing/indexing); a trigger-maintained column (Module 7) for a value depending on OTHER ROWS or OTHER TABLES (`GENERATED` cannot see those).',
      'A `GENERATED` expression is restricted to the CURRENT ROW\'s own columns — no subqueries, no other tables, no non-deterministic functions (`now()`, `random()`). A count of related rows in another table (`post.comment_count` from `comment`) is NOT a valid `GENERATED` expression — it needs the trigger pattern instead.',
      'A `STORED` generated column is physically materialized like any other column, so it CAN be indexed normally (no expression index needed, Module 10) — useful when the derived value is queried/sorted often.',
      'PostgreSQL currently supports only `STORED` generated columns (some other databases also offer a "virtual"/computed-on-read variant; PostgreSQL does not) — the closest equivalent when you specifically want NO storage cost is computing the expression directly in the query.',
    ],
    keyTakeawaysHi: [
      '`GENERATED ALWAYS AS (expression) STORED` ek column ki value SAME ROW KE DOOSRE COLUMNS se compute karta hai, automatically, har `INSERT`/`UPDATE` par, aur result physically store karta hai. Aap isमein seedhe likh NAHI sakte — `cannot insert a non-DEFAULT value into column` error.',
      'RESTRICTION HI feature hai: ek column jise aap optionally override kar sakte the drift kar sakta tha; ek column jise aap structurally likh hi nahi sakte kabhi is expression se disagree nahi kar sakta jo ise define karta hai.',
      'Ye seedhe Module 7 (Lesson 4) ka gap band karta hai: ek manually-maintained derived value stale ho sakta hai agar ek writer recompute karna bhool jaata hai. Ek `GENERATED` version stale NAHI ho sakta — koi writer bhoolne waala nahi hai.',
      'TEEN tarike ek derived value paane ke: `SELECT` mein compute karo (koi storage cost nahi); `GENERATED ... STORED` (sirf SAME row ke doosre columns par depend karta hai); ek trigger-maintained column DOOSRI ROWS ya TABLES par depend karne waale value ke liye.',
      'Ek `GENERATED` expression CURRENT ROW ke apne columns tak restricted hai — koi subqueries nahi, koi doosri tables nahi, koi non-deterministic functions nahi. Doosri table mein related rows ka ek count valid `GENERATED` expression NAHI hai.',
      'Ek `STORED` generated column doosre column ki tarah physically materialized hai, to ise normally index kiya ja sakta hai.',
      'PostgreSQL abhi sirf `STORED` generated columns support karta hai — koi storage cost NAHI chahiye to query mein hi expression compute karo.',
    ],
  },
];
