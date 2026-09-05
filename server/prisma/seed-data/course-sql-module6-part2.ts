/**
 * Databases Complete Course — Module 6: Window Functions, lessons 4-6.
 *
 * Lesson 4: Window aggregates & running totals — sum/avg/count as window functions,
 *           the implicit frame when ORDER BY is present (RANGE UNBOUNDED PRECEDING TO
 *           CURRENT ROW), partitioned running totals, moving averages.
 * Lesson 5: Window frames explicitly — ROWS vs RANGE vs GROUPS, BETWEEN x PRECEDING
 *           AND y FOLLOWING, UNBOUNDED / CURRENT ROW, centered moving windows, the
 *           RANGE-with-duplicates gotcha.
 * Lesson 6: The WINDOW clause & window vs GROUP BY — naming a shared window definition,
 *           combining window functions with GROUP BY, and a decision guide for when to
 *           reach for a window function versus GROUP BY versus both.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 6
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'sql-window-aggregates-and-running-totals',
    title: 'Window Aggregates: Running Totals & Moving Averages',
    titleHi: 'Window Aggregates: Running Totals Aur Moving Averages',
    description: 'Any aggregate — `sum`, `avg`, `count`, `min`, `max` — becomes a window function with `OVER`. Add `ORDER BY` and it becomes a RUNNING calculation: a running total, a moving average, a running count. `PARTITION BY` makes it restart per group.',
    descriptionHi: 'Koi bhi aggregate — `sum`, `avg`, `count`, `min`, `max` — `OVER` ke saath ek window function ban jaता hai. `ORDER BY` add karो aur ye ek RUNNING calculation ban jaता hai: ek running total, ek moving average, ek running count. `PARTITION BY` ise prati group restart karाता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A cashier\'s receipt tape versus the till\'s total drawer count.** The till drawer count at the end of the day is a `GROUP BY` aggregate: one number, the total, everything else discarded. A receipt tape is different — as each item is scanned, the tape prints that item\'s price *and* the running subtotal so far, right there on the same line. By the time you reach the last item, the "running subtotal" column equals the day\'s total, but every line in between showed you the total-so-far, not the final total. That is exactly `sum(amt) OVER (ORDER BY scan_time)`: it is an aggregate, computed the same way `sum` always is, but instead of collapsing everything into one line, it re-computes the sum fresh at each row using only the rows up to and including that one. `PARTITION BY cashier` would be running a separate tape per till — each cashier\'s subtotal restarts from zero.',
      hi: '**Ek cashier ki receipt tape versus till ka total drawer count.** Din ke ant mein till drawer count ek `GROUP BY` aggregate hai: ek number, total, baaki sab discarded. Ek receipt tape alag hai — jaise-jaise har item scan hoता hai, tape us item ki price *aur* ab tak ka running subtotal print karता hai, usi line par. Jab aap aakhri item tak pahunchते ho, "running subtotal" column din ke total ke barabar hai, par beech ki har line aapको total-so-far dikhाती hai, final total nahi. Wo theek `sum(amt) OVER (ORDER BY scan_time)` hai: ye ek aggregate hai, jaise `sum` hamesha hoता hai, par sab kuch ek line mein collapse karne ke bजाy, ye har row par sum ko fresh se recompute karता hai sirf us row tak ki rows istemal karके. `PARTITION BY cashier` prati till alag tape chalाना hoगा.',
    },

    simple: `**Any aggregate + \`OVER (ORDER BY ...)\` = a RUNNING calculation**

\`\`\`sql
SELECT sold_on, amt,
       sum(amt)   OVER (ORDER BY sold_on) AS running_total,
       count(*)   OVER (ORDER BY sold_on) AS running_count,
       round(avg(amt) OVER (ORDER BY sold_on), 1) AS running_avg
FROM sales;
\`\`\`

**\`PARTITION BY\` makes the running calculation restart per group**

\`\`\`sql
SELECT region, sold_on, amt,
       sum(amt) OVER (PARTITION BY region ORDER BY sold_on) AS region_running_total
FROM sales;
-- each region's running total starts fresh from its own first row
\`\`\`

**A moving average over the last 3 rows (frame clause — full detail in Lesson 5)**

\`\`\`sql
SELECT sold_on, amt,
       round(avg(amt) OVER (
         ORDER BY sold_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW    -- this row + the 2 before it
       ), 1) AS moving_avg_3
FROM sales;
\`\`\`

**Why the running total works: the DEFAULT frame with \`ORDER BY\`**

\`\`\`
OVER (ORDER BY sold_on)
-- is short for:
OVER (ORDER BY sold_on RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- "everything from the start up to (and including) this row" -- that IS a running total
\`\`\`

**Without \`ORDER BY\`, \`sum() OVER (...)\` is a flat total, not running**

\`\`\`sql
sum(amt) OVER ()                    -- one grand total, same value on every row
sum(amt) OVER (ORDER BY sold_on)    -- running total, grows row by row
\`\`\``,

    simpleHi: `**Koi bhi aggregate + \`OVER (ORDER BY ...)\` = ek RUNNING calculation**

\`\`\`sql
SELECT sold_on, amt,
       sum(amt)   OVER (ORDER BY sold_on) AS running_total,
       count(*)   OVER (ORDER BY sold_on) AS running_count,
       round(avg(amt) OVER (ORDER BY sold_on), 1) AS running_avg
FROM sales;
\`\`\`

**\`PARTITION BY\` running calculation ko prati group restart karाता hai**

\`\`\`sql
SELECT region, sold_on, amt,
       sum(amt) OVER (PARTITION BY region ORDER BY sold_on) AS region_running_total
FROM sales;
-- har region ka running total apni pehli row se fresh shuru hoता hai
\`\`\`

**Aakhri 3 rows par ek moving average (frame clause — poori detail Lesson 5)**

\`\`\`sql
SELECT sold_on, amt,
       round(avg(amt) OVER (
         ORDER BY sold_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW    -- ye row + iske pehle ki 2
       ), 1) AS moving_avg_3
FROM sales;
\`\`\`

**Running total kyun kaam karta hai: \`ORDER BY\` ke saath DEFAULT frame**

\`\`\`
OVER (ORDER BY sold_on)
-- iske liye short hai:
OVER (ORDER BY sold_on RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- "start se is row tak (sहित) sab kuch" -- YAHI ek running total hai
\`\`\`

**Bina \`ORDER BY\`, \`sum() OVER (...)\` ek flat total hai, running nahi**

\`\`\`sql
sum(amt) OVER ()                    -- ek grand total, har row par same value
sum(amt) OVER (ORDER BY sold_on)    -- running total, row by row badता hai
\`\`\``,

    content: `## From flat aggregate to running aggregate

You already know \`sum(amt) OVER ()\` (Lesson 1): it computes the sum over the whole window (here, all rows) and stamps the same value on every row — a **flat** total.

Add an \`ORDER BY\` inside \`OVER\`, and the meaning changes: now each row's window is **"from the start of the partition up to this row"**, so the sum is **recomputed row by row** as you move through the order — a **running total**.

\`\`\`sql
SELECT sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS running_total
FROM sales
ORDER BY sold_on;
\`\`\`

The same applies to every aggregate:

- \`count(*) OVER (ORDER BY x)\` → running count ("how many rows so far").
- \`avg(amt) OVER (ORDER BY x)\` → running/cumulative average.
- \`min(amt) OVER (ORDER BY x)\` → running minimum ("the lowest value seen so far").
- \`max(amt) OVER (ORDER BY x)\` → running maximum ("the high-water mark so far").

## Why \`ORDER BY\` changes the meaning: the implicit frame

Every window aggregate operates over a **frame** — a subset of the partition's rows. When \`OVER\` has **no \`ORDER BY\`**, the frame defaults to the **entire partition** (flat total). When \`OVER\` **has an \`ORDER BY\`** and no explicit frame clause, PostgreSQL defaults the frame to:

\`\`\`
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
\`\`\`

— "from the first row of the partition through the current row (inclusive)". That is precisely the definition of a running total. Lesson 5 covers the frame clause in full (including how to make a moving window instead of a running-from-the-start one); for now, the practical rule is: **\`ORDER BY\` inside \`OVER\`, with an aggregate, gives you a running calculation by default.**

## \`PARTITION BY\` + running total

Add \`PARTITION BY\` and the running calculation **restarts at zero for each partition**:

\`\`\`sql
SELECT region, sold_on, amt,
       sum(amt) OVER (PARTITION BY region ORDER BY sold_on) AS region_running_total
FROM sales;
\`\`\`

Each region's first row (by \`sold_on\`) has a running total equal to just its own \`amt\`; the running total only ever includes rows **from the same region**, ordered up to that point.

## Moving average with a bounded frame

A **running** average includes every row from the start — it can smooth out too much as the series grows long. A **moving** average uses a fixed-size window that slides along:

\`\`\`sql
SELECT sold_on, amt,
       round(avg(amt) OVER (
         ORDER BY sold_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW   -- last 3 rows: this one + 2 before
       ), 1) AS moving_avg_3
FROM sales;
\`\`\`

This is an explicit frame clause overriding the default. Lesson 5 is the deep dive on \`ROWS BETWEEN ... AND ...\`.

## \`sum() OVER (...)\` as "percent of total" and "percent of running total"

Combining a flat and a running window in one query is common:

\`\`\`sql
SELECT sold_on, amt,
       round(100.0 * amt / sum(amt) OVER (), 1)                       AS pct_of_grand_total,
       round(100.0 * sum(amt) OVER (ORDER BY sold_on) / sum(amt) OVER (), 1) AS pct_reached_so_far
FROM sales
ORDER BY sold_on;
\`\`\`

\`pct_reached_so_far\` answers "what fraction of the eventual total had we reached by this point" — a classic use in progress-tracking dashboards.

## Cost note

A running total / moving average requires the partition to be sorted by the \`ORDER BY\` — same cost consideration as ranking functions (Lesson 1/2). If several window expressions in the query share the exact same \`PARTITION BY ... ORDER BY ... frame\`, name the window once (Lesson 6) so the engine computes the sort a single time.`,

    contentHi: `## Flat aggregate se running aggregate tak

Aap pehle se \`sum(amt) OVER ()\` (Lesson 1) jaanते ho: ye poore window (yahaan, sabhi rows) par sum compute karता hai aur har row par same value stamp karता hai — ek **flat** total.

\`OVER\` ke andar ek \`ORDER BY\` add karो, aur matlab badalता hai: ab har row ka window hai **"partition ke start se is row tak"**, to sum **row by row recompute** hoता hai jaise-jaise aap order mein aage badhte ho — ek **running total**.

\`\`\`sql
SELECT sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS running_total
FROM sales ORDER BY sold_on;
\`\`\`

Wahi har aggregate par apply hoता hai:
- \`count(*) OVER (ORDER BY x)\` → running count.
- \`avg(amt) OVER (ORDER BY x)\` → running/cumulative average.
- \`min(amt) OVER (ORDER BY x)\` → running minimum.
- \`max(amt) OVER (ORDER BY x)\` → running maximum.

## \`ORDER BY\` matlab kyun badalta hai: implicit frame

Har window aggregate ek **frame** par kaam karता hai — partition ki rows ka ek subset. Jab \`OVER\` mein **koi \`ORDER BY\` nahi** hai, frame default se **poora partition** hai (flat total). Jab \`OVER\` mein **\`ORDER BY\` hai** aur koi explicit frame clause nahi, PostgreSQL frame default se:

\`\`\`
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
\`\`\`

— "partition ki pehli row se current row tak (sहित)". Yahi theek ek running total ki definition hai. Practical niyam: **\`OVER\` ke andar \`ORDER BY\`, ek aggregate ke saath, default se ek running calculation deता hai.**

## \`PARTITION BY\` + running total

\`PARTITION BY\` add karो aur running calculation **prati partition zero se restart hoता hai**:

\`\`\`sql
SELECT region, sold_on, amt,
       sum(amt) OVER (PARTITION BY region ORDER BY sold_on) AS region_running_total
FROM sales;
\`\`\`

## Bounded frame ke saath moving average

Ek **running** average start se har row include karता hai. Ek **moving** average ek fixed-size window istemal karता hai jo aage slide hoता hai:

\`\`\`sql
SELECT sold_on, amt,
       round(avg(amt) OVER (
         ORDER BY sold_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW   -- aakhri 3 rows
       ), 1) AS moving_avg_3
FROM sales;
\`\`\`

## \`sum() OVER (...)\` "percent of total" aur "percent of running total" ke roop mein

\`\`\`sql
SELECT sold_on, amt,
       round(100.0 * amt / sum(amt) OVER (), 1)                       AS pct_of_grand_total,
       round(100.0 * sum(amt) OVER (ORDER BY sold_on) / sum(amt) OVER (), 1) AS pct_reached_so_far
FROM sales ORDER BY sold_on;
\`\`\`

\`pct_reached_so_far\` "is point tak eventual total ka kitna fraction pahunchा" batाता hai.

## Cost note

Ek running total / moving average ko partition ko \`ORDER BY\` se sorted chahिए. Agar kई window expressions same \`PARTITION BY ... ORDER BY ... frame\` share karते hain, window ko ek baar naam do (Lesson 6).`,

    examples: [
      {
        title: 'Running total, running count, and running average',
        titleHi: 'Running total, running count, aur running average',
        code: `CREATE TABLE sales (sold_on date, amt int);
INSERT INTO sales VALUES
  ('2026-01-03',200),('2026-01-15',60),('2026-01-28',90),('2026-02-10',70);

SELECT sold_on::text AS sold_on, amt,
       sum(amt)   OVER (ORDER BY sold_on) AS running_total,
       count(*)   OVER (ORDER BY sold_on) AS running_count,
       round(avg(amt) OVER (ORDER BY sold_on), 1) AS running_avg
FROM sales
ORDER BY sold_on;`,
        output: ` sold_on    | amt | running_total | running_count | running_avg
------------+-----+---------------+---------------+-------------
 2026-01-03 | 200 | 200           | 1             | 200.0
 2026-01-15 | 60  | 260           | 2             | 130.0
 2026-01-28 | 90  | 350           | 3             | 116.7
 2026-02-10 | 70  | 420           | 4             | 105.0
(4 rows)`,
        explain: '`sum(amt) OVER (ORDER BY sold_on)` recomputes from scratch at every row, using only rows up to and including that one — `200`, then `200+60=260`, then `350`, then `420`. `count(*) OVER (ORDER BY sold_on)` counts the same growing set (`1,2,3,4`), and `avg` divides the running sum by the running count at each point.',
        explainHi: '`sum(amt) OVER (ORDER BY sold_on)` har row par nayi shuruat se recompute hota hai, sirf us row tak ki rows istemal karke — `200`, phir `200+60=260`, phir `350`, phir `420`. `count(*) OVER (ORDER BY sold_on)` wahi badta hua set ginta hai (`1,2,3,4`), aur `avg` har point par running sum ko running count se divide karta hai.',
      },
      {
        title: 'Partitioned running total: each region restarts from its own first row',
        titleHi: 'Partitioned running total: har region apni pehli row se restart karta hai',
        code: `CREATE TABLE sales (region text, sold_on date, amt int);
INSERT INTO sales VALUES
  ('N','2026-01-05',100),('N','2026-01-12',150),('N','2026-01-20',80),('N','2026-02-02',120),
  ('S','2026-01-03',200),('S','2026-01-15',60),('S','2026-01-28',90),('S','2026-02-10',70);

SELECT region, sold_on::text AS sold_on, amt,
       sum(amt) OVER (PARTITION BY region ORDER BY sold_on) AS region_running
FROM sales
ORDER BY region, sold_on;`,
        output: ` region | sold_on    | amt | region_running
--------+------------+-----+----------------
 N      | 2026-01-05 | 100 | 100
 N      | 2026-01-12 | 150 | 250
 N      | 2026-01-20 | 80  | 330
 N      | 2026-02-02 | 120 | 450
 S      | 2026-01-03 | 200 | 200
 S      | 2026-01-15 | 60  | 260
 S      | 2026-01-28 | 90  | 350
 S      | 2026-02-10 | 70  | 420
(8 rows)`,
        explain: "`sum(amt) OVER (PARTITION BY region ORDER BY sold_on)` computes an independent running total for each region: N's total climbs `100, 250, 330, 450` on its own dates, while S's climbs `200, 260, 350, 420` on its own dates. Neither region's running total is influenced by the other's rows — `PARTITION BY` isolates them completely.",
        explainHi: '`sum(amt) OVER (PARTITION BY region ORDER BY sold_on)` har region ke liye ek independent running total compute karta hai: N ka total apni dates par `100, 250, 330, 450` chadhta hai, jabki S ka apni dates par `200, 260, 350, 420`. Koi bhi region ka running total doosre ki rows se influenced nahi hai — `PARTITION BY` unhe poori tarah isolate karta hai.',
      },
      {
        title: 'A 3-row moving average using an explicit bounded frame',
        titleHi: 'Ek explicit bounded frame istemal karके ek 3-row moving average',
        code: `CREATE TABLE sales (sold_on date, amt int);
INSERT INTO sales VALUES
  ('2026-01-03',200),('2026-01-15',60),('2026-01-28',90),('2026-02-10',70);

SELECT sold_on::text AS sold_on, amt,
       round(avg(amt) OVER (
         ORDER BY sold_on
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ), 1) AS moving_avg_3
FROM sales
ORDER BY sold_on;`,
        output: ` sold_on    | amt | moving_avg_3
------------+-----+--------------
 2026-01-03 | 200 | 200.0
 2026-01-15 | 60  | 130.0
 2026-01-28 | 90  | 116.7
 2026-02-10 | 70  | 73.3
(4 rows)`,
        explain: '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` bounds the frame to at most 3 physical rows: the current one plus the 2 before it. Row 1 has only itself (avg = its own amount, `200.0`), row 2 has itself plus row 1 (avg of 2 values, `130.0`), and from row 3 onward every average is over exactly 3 values — a genuinely MOVING window, unlike the ever-growing running average.',
        explainHi: '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` frame ko zyada se zyada 3 physical rows tak bound karta hai: current ek plus iske pehle ki 2. Row 1 ke paas sirf khud hai (avg = apna amount, `200.0`), row 2 ke paas khud plus row 1 hai (2 values ka avg, `130.0`), aur row 3 se aage har average theek 3 values par hai — ek asal MOVING window, hamesha badte running average ke ulta.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "the total revenue, shown on every row" -- accidentally wrote a running total
SELECT sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS total
FROM sales;
-- "total" grows on every row instead of showing the same grand total everywhere`,
        right: `SELECT sold_on, amt, sum(amt) OVER () AS total
FROM sales;
-- no ORDER BY inside OVER -> the whole partition is the frame -> a flat total on every row`,
        why: 'Adding an ORDER BY inside OVER changes the default frame from the whole partition to "start of partition through the current row", which turns a flat sum into a running sum. If the intent was simply to repeat the grand total on every row, the ORDER BY should not be there at all: OVER with empty parentheses uses the entire partition as the frame regardless of row order, giving a constant value. The ORDER BY is only needed when you actually want the running or positional behavior it enables, for ranking, running totals, or lag and lead.',
        whyHi: '\`OVER\` ke andar ek `ORDER BY` add karna default frame ko poore partition se "partition ke start se current row tak" mein badalता hai, jo ek flat sum ko ek running sum mein badal deता hai. Agar intent sirf grand total ko har row par repeat karna tha, `ORDER BY` bilkul nahi hona chahिए tha: khaali parentheses ke saath \`OVER\` poore partition ko frame ke roop mein istemal karता hai row order ke bavjood, ek constant value deता hai.',
      },
      {
        wrong: `-- "3-day moving average" -- but forgot the frame, got a running average instead
SELECT sold_on, amt, avg(amt) OVER (ORDER BY sold_on) AS moving_avg
FROM sales;
-- this is a RUNNING average (grows to include everything), not a 3-row window`,
        right: `SELECT sold_on, amt,
       avg(amt) OVER (ORDER BY sold_on ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3
FROM sales;`,
        why: 'Without an explicit frame clause, ORDER BY alone gives the default frame of everything from the start of the partition to the current row, which is a running average over an ever-growing set, not a moving average over a fixed recent window. A moving average needs an explicit ROWS BETWEEN clause bounding how many preceding rows are included alongside the current one; two preceding plus the current row gives a three-row window that slides forward one row at a time. This distinction, growing frame versus fixed-size sliding frame, is the difference between "cumulative" and "moving", and it is easy to write the wrong one by omitting the frame clause.',
        whyHi: 'Bina ek explicit frame clause ke, akela `ORDER BY` default frame deता hai partition ke start se current row tak sab kuch, jo ek ever-growing set par ek running average hai, ek fixed recent window par ek moving average nahi. Ek moving average ko ek explicit `ROWS BETWEEN` clause chahिए jo bound karता hai ki current row ke saath kितनी preceding rows include hain.',
      },
      {
        wrong: `-- "% of the eventual total reached by each date" -- dividing by the wrong sum
SELECT sold_on, amt,
       round(100.0 * sum(amt) OVER (ORDER BY sold_on) / sum(amt) OVER (ORDER BY sold_on), 1) AS pct
FROM sales;
-- both numerator and denominator are the SAME running total -> always 100`,
        right: `SELECT sold_on, amt,
       round(100.0 * sum(amt) OVER (ORDER BY sold_on) / sum(amt) OVER (), 1) AS pct_reached_so_far
FROM sales;
-- denominator uses the FLAT grand total (no ORDER BY) -- numerator is the running total`,
        why: 'Both window expressions in the mistaken query have exactly the same specification, ORDER BY sold_on with the implicit running frame, so they compute the identical running total, and dividing a number by itself is always one, a hundred percent, on every row. The intended calculation needs two different windows: a running total as the numerator, using ORDER BY so it grows row by row, and the flat grand total as the denominator, using OVER with no ORDER BY so the whole partition is summed regardless of position. Getting the two window specifications distinct is the entire trick.',
        whyHi: 'Galat query mein dono window expressions ka theek wahi specification hai, `ORDER BY sold_on` implicit running frame ke saath, to wo identical running total compute karте hain, aur ek number ko khud se divide karna hamesha ek hoता hai, har row par sौ percent. Intended calculation ko do alag windows chahिए: numerator ke roop mein ek running total, denominator ke roop mein flat grand total, bina `ORDER BY` ke.',
      },
    ],

    realWorld: [
      {
        en: '**A cash-flow chart: `sum(amount) OVER (ORDER BY txn_date)` as the running balance line**, next to the raw transaction amounts as bars.',
        hi: '**Ek cash-flow chart: `sum(amount) OVER (ORDER BY txn_date)` running balance line ke roop mein**.',
      },
      {
        en: '**A 7-day moving average of daily active users: `avg(dau) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`** to smooth day-of-week noise in a metrics dashboard.',
        hi: '**Daily active users ka 7-day moving average: `avg(dau) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`**.',
      },
      {
        en: '**A fundraising progress bar: `sum(pledged) OVER (ORDER BY pledged_at) / sum(pledged) OVER () AS pct_of_goal`** — the running total against the flat total, in one query.',
        hi: '**Ek fundraising progress bar: `sum(pledged) OVER (ORDER BY pledged_at) / sum(pledged) OVER () AS pct_of_goal`** — running total flat total ke against, ek query mein.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you compute a running total in SQL, and why does adding `ORDER BY` to `OVER` produce one?',
        qHi: 'Aap SQL mein ek running total kaise compute karते ho, aur `OVER` mein `ORDER BY` add karna ek kyun produce karता hai?',
        a: 'You compute a running total with sum of the column, followed by OVER with an ORDER BY inside it, for example sum of amount over order by date. The reason this behaves as running rather than a single grand total comes down to the default frame. Every window aggregate operates over a frame, a subset of the partition\'s rows. When OVER has no ORDER BY, the frame defaults to the entire partition, so the sum is the same flat number on every row. The moment you add an ORDER BY, the default frame changes to range between unbounded preceding and current row, meaning the frame for each row is everything from the start of the partition through that row, inclusive. Summing over a frame that grows by one row each time you move forward is exactly the definition of a running total. Adding PARTITION BY on top restarts this running total independently for each partition, so a running total by region begins again at each region\'s first row in the chosen order.',
        aHi: 'Aap ek running total sum of the column se compute karте ho, iske baad andar ek `ORDER BY` waala `OVER`. Ye running ki tarah behave karта hai, single grand total nahi, iska kaaran default frame hai. Har window aggregate ek frame par kaam karता hai. Jab `OVER` mein koi `ORDER BY` nahi, frame default se poora partition hai, to sum har row par wahi flat number hai. Jis pal aap ek `ORDER BY` add karте ho, default frame `range between unbounded preceding and current row` mein badal jaता hai, matlab har row ke liye frame partition ke start se us row tak sab kuch hai, inclusive. Ek frame par sum karna jo har baar aage badhne par ek row se badता hai theek ek running total ki definition hai.',
      },
      {
        q: 'What is the difference between a running average and a moving average, and how do you write each?',
        qHi: 'Ek running average aur ek moving average mein kya antar hai, aur aap har ek kaise likhте ho?',
        a: 'A running, or cumulative, average includes every row from the start of the partition up through the current row, so its window grows by one row each step and it never forgets early data; you write it as avg of the column over order by the sequencing column, relying on the implicit frame. A moving average instead uses a fixed-size window that slides forward, always covering the same number of rows, for instance the current row and the two immediately before it for a three-point average; older rows fall out of scope as new ones enter. You write a moving average by giving an explicit frame clause, rows between two preceding and current row, rather than relying on the default. The practical difference shows up as the series progresses: a running average smooths out more and more as more data accumulates and reacts slowly to recent change, while a moving average stays responsive to recent values because it always forgets the oldest ones in its fixed window. Forgetting the explicit frame clause is the classic bug: you get a running average when you meant a moving one.',
        aHi: 'Ek running, ya cumulative, average partition ke start se current row tak har row include karता hai, to iska window har step ek row se badता hai. Aap ise `avg of the column over order by sequencing column` likhते ho, implicit frame par bharosa karके. Ek moving average iske bजाy ek fixed-size window istemal karता hai jo aage slide hoता hai, hamesha wahi sankhya mein rows cover karте hue. Aap ek moving average ek explicit frame clause dekar likhте ho, `rows between two preceding and current row`, default par bharosa karne ke bजाy. Practical antar: ek running average zyada se zyada smooth hoता hai jaise-jaise data accumulate hoता hai. Explicit frame clause bhoolna classic bug hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `txn(txn_date date, amount int)` with 5 rows spanning a month. Add `running_balance` (`sum(amount) OVER (ORDER BY txn_date)`) and confirm it equals the flat `sum(amount) OVER ()` only on the LAST row.',
        taskHi: 'Table `txn(txn_date, amount)` ek month ke 5 rows ke saath. `running_balance` add karो aur confirm karो ye sirf AAKHRI row par flat `sum(amount) OVER ()` ke barabar hai.',
        hint: 'The running total only reaches the grand total on the last row (by `txn_date`) because that row\'s frame — start of partition through current row — finally covers every row.',
        hintHi: 'Running total sirf aakhri row (`txn_date` se) par grand total tak pahunchता hai kyunki us row ka frame — partition ke start se current row tak — aakhirkar har row cover karता hai.',
      },
      {
        task: 'Table `metric(day date, value int)` with 10 daily rows. Add BOTH a running average (`avg(value) OVER (ORDER BY day)`) and a 3-day moving average (`avg(value) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`). Confirm they agree only on the first 3 rows and diverge after.',
        taskHi: 'Table `metric(day, value)` 10 daily rows ke saath. Ek running average AUR ek 3-day moving average dono add karो. Confirm karो wo sirf pehli 3 rows par agree karте hain.',
        hint: 'For the first row, both frames contain exactly 1 row. For the 3rd row, the running frame has 3 rows and the moving frame also has 3 (2 preceding + current) -- they still match. From the 4th row on, the running frame keeps growing while the moving frame stays at 3.',
        hintHi: 'Pehli row ke liye, dono frames mein theek 1 row hai. 3rd row ke liye, dono ke paas 3 rows hain — abhi bhi match. 4th row se, running frame badta rehta hai jabki moving frame 3 par rehta hai.',
      },
      {
        task: 'Table `pledge(pledged_at date, amount int)` for a fundraiser. Write `pct_of_goal` = `round(100.0 * sum(amount) OVER (ORDER BY pledged_at) / sum(amount) OVER (), 1)`. Confirm the LAST row (by `pledged_at`) shows `100.0`.',
        taskHi: 'Table `pledge(pledged_at, amount)` ek fundraiser ke liye. `pct_of_goal` likho. Confirm karो AAKHRI row `100.0` dikhाती hai.',
        hint: 'Numerator: running total (`ORDER BY` present). Denominator: flat grand total (`OVER ()`, no `ORDER BY`). Only on the last row does the running total equal the grand total, giving `100.0`.',
        hintHi: 'Numerator: running total. Denominator: flat grand total. Sirf aakhri row par running total grand total ke barabar hai, `100.0` deता hue.',
      },
    ],

    keyTakeaways: [
      'ANY aggregate (`sum`/`avg`/`count`/`min`/`max`) + `OVER (...)` becomes a window function. NO `ORDER BY` inside `OVER` -> the frame is the WHOLE partition -> a FLAT value (same on every row). `ORDER BY` inside `OVER` -> the frame becomes "start of partition THROUGH current row" -> a RUNNING calculation.',
      'This is the DEFAULT FRAME rule: `OVER (ORDER BY x)` is shorthand for `OVER (ORDER BY x RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`. That IS the definition of a running total/count/avg/min/max — it grows by one row each step.',
      '`PARTITION BY` + `ORDER BY` = the running calculation RESTARTS AT ZERO for each partition — a region\'s running total only ever includes rows from that region, up to the current point.',
      'RUNNING (cumulative) vs MOVING average: running = default frame, grows forever, smooths more as data accumulates. MOVING = an EXPLICIT bounded frame (`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` for a 3-row window) that slides forward, staying responsive to recent data. Forgetting the explicit frame -> you get running when you meant moving.',
      '`sum(x) OVER ()` (flat, no `ORDER BY`) vs `sum(x) OVER (ORDER BY t)` (running) COMBINE for "% of eventual total reached so far": `running_total / flat_grand_total`. Using the SAME window spec for both numerator and denominator is a bug (always `100%`).',
      'Cost: a running total / moving average needs the partition SORTED by the `OVER`\'s `ORDER BY` — same cost profile as ranking functions. Several window expressions sharing the identical `PARTITION BY ... ORDER BY ... frame` should share ONE named window (Lesson 6) so the sort happens once.',
      'Guideline: if you want the SAME number on every row -> no `ORDER BY` inside `OVER`. If you want a value that changes as you move through the rows in some order -> `ORDER BY` inside `OVER` (running by default; add an explicit frame for moving/centered windows, Lesson 5).',
    ],
    keyTakeawaysHi: [
      'KOI BHI aggregate (`sum`/`avg`/`count`/`min`/`max`) + `OVER (...)` ek window function ban jaता hai. `OVER` ke andar `ORDER BY` NAHI -> frame POORA partition hai -> ek FLAT value. `OVER` ke andar `ORDER BY` -> frame "partition ke start se CURRENT ROW TAK" ban jaता hai -> ek RUNNING calculation.',
      'Ye DEFAULT FRAME niyam hai: `OVER (ORDER BY x)` `OVER (ORDER BY x RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` ke liye shorthand hai. Yahi ek running total/count/avg ki definition hai.',
      '`PARTITION BY` + `ORDER BY` = running calculation prati partition ZERO se RESTART hoती hai.',
      'RUNNING (cumulative) vs MOVING average: running = default frame, hamesha badता hai. MOVING = ek EXPLICIT bounded frame jo aage slide hoता hai, recent data ke liye responsive rehта hai. Explicit frame bhoolna -> aapको running milता hai jab aap moving chahте the.',
      '`sum(x) OVER ()` (flat) vs `sum(x) OVER (ORDER BY t)` (running) "ab tak eventual total ka kितना pahunchा" ke liye COMBINE hote hain. Numerator aur denominator dono ke liye SAME window spec istemal karna ek bug hai (hamesha `100%`).',
      'Cost: ek running total ko `OVER` ke `ORDER BY` se SORTED partition chahिए. IDENTICAL `PARTITION BY ... ORDER BY ... frame` share karने waali kई window expressions ko EK named window share karna chahिए (Lesson 6).',
      'Guideline: agar aap har row par SAME number chahте ho -> `OVER` ke andar `ORDER BY` nahi. Agar aap ek value chahте ho jo kisi order mein rows ke through chalte hue badalती hai -> `OVER` ke andar `ORDER BY`.',
    ],
  },

  {
    slug: 'sql-window-frames',
    title: 'Window Frames: ROWS, RANGE & GROUPS',
    titleHi: 'Window Frames: ROWS, RANGE Aur GROUPS',
    description: 'The frame clause says exactly which rows around the current one are included in a window calculation. `ROWS` counts physical rows; `RANGE` counts by ORDER BY value (duplicates included together); `GROUPS` counts peer groups. `BETWEEN x PRECEDING AND y FOLLOWING` builds moving and centered windows.',
    descriptionHi: 'Frame clause theek batाता hai ki current row ke aas-paas kaunसी rows ek window calculation mein include hain. `ROWS` physical rows ginता hai; `RANGE` ORDER BY value se ginता hai (duplicates ek saath included); `GROUPS` peer groups ginता hai. `BETWEEN x PRECEDING AND y FOLLOWING` moving aur centered windows banाता hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Deciding how many neighbouring houses count as "the neighbourhood" when averaging home prices — by house count, by street distance, or by block.** If you say "average the price of the 5 physically nearest houses", that is `ROWS` — you count a fixed number of *entries*, regardless of how far apart they actually are. If instead you say "average every house within 200 metres", that is `RANGE` — you count by a *measured distance* on the ordering value, so a cluster of ten houses that all happen to be within 200 metres are all included together, while a sparse street might only capture two. `GROUPS` is a middle ground for when many houses share the *exact same* recorded distance (duplicates on the ordering value) — you count whole "distance-brackets" as one unit rather than splitting a tied bracket arbitrarily. All three are answers to the same question — "which rows are my neighbours?" — measured three different ways: by position, by value, or by tied-value group.',
      hi: '**Home prices average karte waqt kितne neighbouring houses "neighbourhood" ginे jaते hain decide karna — house count se, street distance se, ya block se.** Agar aap kahte ho "5 physically nearest houses ki price average karो", wo `ROWS` hai — aap ek fixed number of *entries* ginте ho, chahे wo kितने door hon. Agar iske bजाy aap kahte ho "200 metres ke andar har house average karो", wo `RANGE` hai — aap ordering value par ek *measured distance* se ginте ho, to das houses ka ek cluster jo 200 metres ke andar hain sab saath include hote hain. `GROUPS` ek middle ground hai jab kई houses *bilkul same* recorded distance share karते hain (ordering value par duplicates) — aap poori "distance-brackets" ko ek unit ke roop mein ginте ho, ek tied bracket ko arbitrarily split karne ke bजाy. Teenों ek hi sawaal ke jawab hain — "mere neighbours kaun hain?" — teen alag tarikों se measured: position se, value se, ya tied-value group se.',
    },

    simple: `**\`ROWS\` — count PHYSICAL rows, regardless of value**

\`\`\`sql
sum(n) OVER (ORDER BY k ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- includes the current row and every physical row before it in the ORDER BY -- one at a time
\`\`\`

**\`RANGE\` — count by ORDER BY VALUE — duplicates move together**

\`\`\`sql
sum(n) OVER (ORDER BY k RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- if several rows share the same k, ALL of them enter the frame together, not one by one
\`\`\`

**A moving / sliding window: \`BETWEEN x PRECEDING AND y FOLLOWING\`**

\`\`\`sql
avg(n) OVER (ORDER BY i ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)   -- centered 3-row average
avg(n) OVER (ORDER BY i ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)   -- trailing 3-row average
sum(n) OVER (ORDER BY i ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING)   -- leading 3-row sum
\`\`\`

**\`UNBOUNDED\` and \`CURRENT ROW\` as boundaries**

\`\`\`
UNBOUNDED PRECEDING   -- all the way to the start of the partition
UNBOUNDED FOLLOWING   -- all the way to the end of the partition
CURRENT ROW           -- the row being computed
n PRECEDING / n FOLLOWING   -- n rows (ROWS) or n units of ORDER BY value (RANGE) away
\`\`\`

**The full-partition frame (for a true \`last_value\`/\`max\` over everything)**

\`\`\`sql
last_value(amt) OVER (
  PARTITION BY region ORDER BY sold_on
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING   -- the ENTIRE partition, every row
)
\`\`\``,

    simpleHi: `**\`ROWS\` — PHYSICAL rows ginता hai, value ke bavjood**

\`\`\`sql
sum(n) OVER (ORDER BY k ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- current row aur ORDER BY mein iske pehle ki har physical row include karता hai -- ek-ek
\`\`\`

**\`RANGE\` — ORDER BY VALUE se ginता hai — duplicates saath chalte hain**

\`\`\`sql
sum(n) OVER (ORDER BY k RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- agar kई rows same k share karती hain, SAB frame mein saath ghुसती hain, ek-ek karके nahi
\`\`\`

**Ek moving / sliding window: \`BETWEEN x PRECEDING AND y FOLLOWING\`**

\`\`\`sql
avg(n) OVER (ORDER BY i ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)   -- centered 3-row average
avg(n) OVER (ORDER BY i ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)   -- trailing 3-row average
sum(n) OVER (ORDER BY i ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING)   -- leading 3-row sum
\`\`\`

**\`UNBOUNDED\` aur \`CURRENT ROW\` boundaries ke roop mein**

\`\`\`
UNBOUNDED PRECEDING   -- partition ke start tak
UNBOUNDED FOLLOWING   -- partition ke end tak
CURRENT ROW           -- jo row compute ho rahi hai
n PRECEDING / n FOLLOWING   -- n rows (ROWS) ya ORDER BY value ki n units (RANGE) door
\`\`\`

**Full-partition frame (poore par ek sacchа \`last_value\`/\`max\` ke liye)**

\`\`\`sql
last_value(amt) OVER (
  PARTITION BY region ORDER BY sold_on
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING   -- POORA partition, har row
)
\`\`\``,

    content: `## The frame clause, in full

\`\`\`
[ROWS | RANGE | GROUPS] BETWEEN frame_start AND frame_end
\`\`\`

where each bound is one of: \`UNBOUNDED PRECEDING\`, \`n PRECEDING\`, \`CURRENT ROW\`, \`n FOLLOWING\`, \`UNBOUNDED FOLLOWING\`. The frame defines, **for each row**, which other rows in the partition are visible to the window function.

## \`ROWS\` — physical row count

\`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` means literally "the 2 rows physically before this one, plus this one" — 3 rows, full stop, regardless of whether their \`ORDER BY\` values are equal or different. This is what you want for "last N rows", "next N rows", "centered window of N rows".

## \`RANGE\` — logical value distance

\`RANGE BETWEEN ... AND ...\` measures by the **value** of the \`ORDER BY\` expression, not row count. \`RANGE\` requires (in the general case) a single \`ORDER BY\` column. Critically: **if multiple rows share the same \`ORDER BY\` value ("peers"), \`RANGE\` includes ALL of them together, or none of them** — it cannot split a tie. \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` (the implicit default when you write only \`ORDER BY\`) means "every row whose value is ≤ the current row's value" — so two rows with an identical value get the **same** running-sum result, because from either row's perspective, both are "≤ current".

\`\`\`sql
-- k = 1, 1, 2 ; n = 10, 20, 5
sum(n) OVER (ORDER BY k ROWS  BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  -- 10, 30, 35 (one row at a time)
sum(n) OVER (ORDER BY k RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) -- 30, 30, 35 (both k=1 rows tied together)
\`\`\`

This is the reason the implicit default frame (\`RANGE ... CURRENT ROW\`) can surprise you with duplicate \`ORDER BY\` values: a running total using the default frame gives **the same value to every row that ties**, not a strictly increasing sequence. If you want strictly one-row-at-a-time behaviour regardless of ties, use \`ROWS\` explicitly.

## \`GROUPS\` — count by peer group

\`GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW\` counts **whole groups of peers** (rows with equal \`ORDER BY\` value) as one step, rather than one physical row (\`ROWS\`) or a value distance (\`RANGE\`). Rarely needed day-to-day; it matters when ties should move together in fixed-size steps (e.g. "the current rank and the rank before it, whatever their sizes").

## Building moving and centered windows

\`\`\`sql
-- trailing (last 3 rows including current)
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW

-- leading (current row and next 2)
ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING

-- centered (1 before, current, 1 after -> 3 total)
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING

-- the whole partition (for a true last_value / partition-wide max)
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
\`\`\`

Near the edges of a partition, \`n PRECEDING\`/\`n FOLLOWING\` simply clips to whatever rows exist — no error, the average is just computed over fewer rows (e.g. a centered 3-row average on the first row only has itself and the next row: 2 rows, not 3).

## Default frames, spelled out

| \`OVER\` clause | default frame |
|---|---|
| no \`ORDER BY\`, no frame | entire partition (\`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\`) |
| \`ORDER BY\` present, no frame | \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` |

That second row is the one to memorise: it explains both the running-total default (Lesson 4) and the \`last_value\` gotcha (Lesson 3) in one line.

## Practical guidance

- Use **\`ROWS\`** for anything counted in rows: last-N, moving averages, top-N logic, "N rows around this one". It is the one you reach for by default.
- Use **\`RANGE\`** deliberately for value-based windows — e.g. "all transactions within the last 7 days" using \`RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW\` on a timestamp column (PostgreSQL supports numeric/interval \`RANGE\` offsets).
- Whenever you want the **whole partition** regardless of position (a partition-wide max, a true \`last_value\`), always spell out \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` — never rely on the default.`,

    contentHi: `## Frame clause, poori tarah

\`\`\`
[ROWS | RANGE | GROUPS] BETWEEN frame_start AND frame_end
\`\`\`

jahaan har bound in mein se ek hai: \`UNBOUNDED PRECEDING\`, \`n PRECEDING\`, \`CURRENT ROW\`, \`n FOLLOWING\`, \`UNBOUNDED FOLLOWING\`. Frame **har row ke liye** define karता hai ki partition mein kaunसी doosri rows window function ko visible hain.

## \`ROWS\` — physical row count

\`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` matlab theek "is se pehle ki 2 physically rows, plus ye" — 3 rows, bस, chahे unke \`ORDER BY\` values barabar hon ya alag. Ye wahi hai jo aap "last N rows", "moving averages" ke liye chahте ho.

## \`RANGE\` — logical value distance

\`RANGE BETWEEN ... AND ...\` \`ORDER BY\` expression ki **value** se measure karता hai, row count se nahi. Zaroori: **agar kई rows same \`ORDER BY\` value ("peers") share karती hain, \`RANGE\` SAB ko saath include karता hai, ya kisi ko nahi** — ye ek tie split nahi kar sakta.

\`\`\`sql
-- k = 1, 1, 2 ; n = 10, 20, 5
sum(n) OVER (ORDER BY k ROWS  BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  -- 10, 30, 35
sum(n) OVER (ORDER BY k RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) -- 30, 30, 35
\`\`\`

Ye isliye hai ki implicit default frame (\`RANGE ... CURRENT ROW\`) duplicate \`ORDER BY\` values ke saath aapको surprise kar sakта hai: default frame istemal karта ek running total **har tied row ko same value** deता hai. Agar aap strictly one-row-at-a-time behaviour chahте ho ties ke bavjood, \`ROWS\` explicitly istemal karो.

## \`GROUPS\` — peer group se ginна

\`GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW\` **poore peer groups** ko ek step ke roop mein ginता hai. Rarely zaroori.

## Moving aur centered windows banана

\`\`\`sql
-- trailing (aakhri 3 rows current sहित)
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
-- leading (current row aur agली 2)
ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING
-- centered (1 pehle, current, 1 baad -> 3 total)
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
-- poora partition
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
\`\`\`

Partition ke edges ke paas, \`n PRECEDING\`/\`n FOLLOWING\` bस jitni rows moujood hain unpar clip hoता hai — koi error nahi.

## Default frames

| \`OVER\` clause | default frame |
|---|---|
| koi \`ORDER BY\` nahi, koi frame nahi | poora partition |
| \`ORDER BY\` maujood, koi frame nahi | \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` |

Wo doosri row yaad rakhne layak hai: ye running-total default (Lesson 4) aur \`last_value\` gotcha (Lesson 3) dono ek line mein explain karती hai.

## Practical guidance

- Rows mein count ki gayi kisi bhi cheez ke liye **\`ROWS\`** istemal karो.
- Value-based windows ke liye deliberately **\`RANGE\`** istemal karो.
- Jab bhi aapको position ke bavjood **poora partition** chahिए, hamesha \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` likho — default par bharosa mat karो.`,

    examples: [
      {
        title: 'ROWS counts physical rows one-by-one; RANGE lumps duplicate ORDER BY values together',
        titleHi: 'ROWS physical rows ek-ek karके ginta hai; RANGE duplicate ORDER BY values ko saath rakhta hai',
        code: `WITH v(k, n) AS (VALUES (1, 10), (1, 20), (2, 5))
SELECT k, n,
  sum(n) OVER (ORDER BY k ROWS  BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS by_rows,
  sum(n) OVER (ORDER BY k RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS by_range
FROM v;`,
        output: ` k | n  | by_rows | by_range
---+----+---------+----------
 1 | 10 | 10      | 30
 1 | 20 | 30      | 30
 2 | 5  | 35      | 35
(3 rows)`,
        explain: 'Two rows tie on `k=1` (`n=10` and `n=20`). `ROWS` counts physical rows one at a time regardless of the tie: `10`, then `10+20=30`, then `35`. `RANGE`, by contrast, cannot split a tie — both `k=1` rows enter the frame TOGETHER (`10+20=30`) and both show `30`, only advancing to `35` once `k` genuinely changes to `2`. This is exactly why the default frame (`RANGE`) can surprise you.',
        explainHi: 'Do rows `k=1` par tie karte hain (`n=10` aur `n=20`). `ROWS` tie ke bavjood physical rows ek-ek karke ginta hai: `10`, phir `10+20=30`, phir `35`. `RANGE`, iske viparit, ek tie split nahi kar sakta — dono `k=1` rows frame mein SAATH ghusti hain (`10+20=30`) aur dono `30` dikhाti hain, sirf `k` genuinely `2` mein badalne par `35` tak aage badhता hai. Yahi wajah hai ki default frame (`RANGE`) surprise kar sakta hai.',
      },
      {
        title: 'A centered 3-row moving average with ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
        titleHi: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING ke saath ek centered 3-row moving average',
        code: `WITH v(i, n) AS (VALUES (1,10),(2,20),(3,30),(4,40),(5,50))
SELECT i, n,
  round(avg(n) OVER (ORDER BY i ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 1) AS centered
FROM v
ORDER BY i;`,
        output: ` i | n  | centered
---+----+----------
 1 | 10 | 15.0
 2 | 20 | 20.0
 3 | 30 | 30.0
 4 | 40 | 40.0
 5 | 50 | 45.0
(5 rows)`,
        explain: '`ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` is a symmetric window of up to 3 rows: the current row, the one before, and the one after. At the edges (`i=1` and `i=5`) there is no row on one side, so the frame simply has 2 rows instead of 3 — `(10+20)/2=15.0` and `(40+50)/2=45.0` — while the interior rows (`i=2,3,4`) each average exactly 3 values.',
        explainHi: '`ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` zyada se zyada 3 rows ka ek symmetric window hai: current row, iske pehle waali, aur baad waali. Edges par (`i=1` aur `i=5`) ek side par koi row nahi, to frame mein bस 2 rows hain 3 ke bजाy — `(10+20)/2=15.0` aur `(40+50)/2=45.0` — jabki interior rows (`i=2,3,4`) har ek theek 3 values ka average karti hain.',
      },
      {
        title: 'The correct fix for last_value: an explicit whole-partition frame',
        titleHi: 'last_value ke liye sahi fix: ek explicit whole-partition frame',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES ('N',80),('N',100),('N',120),('N',150),('S',60),('S',70),('S',90),('S',200);

SELECT region, amt,
  last_value(amt) OVER (
    PARTITION BY region ORDER BY amt
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS region_max
FROM sales
ORDER BY region, amt;`,
        output: ` region | amt | region_max
--------+-----+------------
 N      | 80  | 150
 N      | 100 | 150
 N      | 120 | 150
 N      | 150 | 150
 S      | 60  | 200
 S      | 70  | 200
 S      | 90  | 200
 S      | 200 | 200
(8 rows)`,
        explain: "With no `ORDER BY`-driven default frame issue this time — `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` explicitly spans the ENTIRE partition regardless of the current row's position, so `last_value(amt)` correctly returns each region's true maximum (`150` for N, `200` for S) on every one of that region's rows, unlike the default frame which would have stopped at the current row.",
        explainHi: 'Is baar bina `ORDER BY`-driven default frame issue ke — `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` explicitly current row ki position ke bavjood POORE partition ko span karta hai, to `last_value(amt)` sahi se har region ka sacchа maximum lौtaता hai (N ke liye `150`, S ke liye `200`) us region ki har row par, default frame ke ulta jo current row par ruk jaता.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "a running total, one row at a time, even with tied dates"
SELECT sold_on, amt, sum(amt) OVER (ORDER BY sold_on) AS running
FROM sales;
-- two sales on the SAME sold_on both show the COMBINED total, not one-then-the-other`,
        right: `SELECT sold_on, amt,
       sum(amt) OVER (ORDER BY sold_on ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running
FROM sales;
-- ROWS forces strictly one-physical-row-at-a-time accumulation, ignoring ties`,
        why: 'Writing only ORDER BY sold_on with no explicit frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, and RANGE groups rows with an identical ORDER BY value together: it cannot split a tie, so if two sales share the same date, both rows receive the sum including both of them, not a strictly incremental one-then-the-other progression. If the intent is a running total that advances by exactly one row for every row, regardless of whether the ordering column repeats, the frame must be stated explicitly as ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which counts physical rows and is indifferent to value ties.',
        whyHi: 'Sirf `ORDER BY sold_on` bina explicit frame ke likhна `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` mein default hoता hai, aur `RANGE` identical `ORDER BY` value waali rows ko saath group karता hai: ye ek tie split nahi kar sakta, to agar do sales same date share karती hain, dono rows dono ko include karके sum paati hain, ek strictly incremental progression nahi. Agar intent ek running total hai jo har row ke liye theek ek row se aage badhता hai, frame ko explicitly `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` ke roop mein batана hoga.',
      },
      {
        wrong: `-- "average of this row and the next 2" -- got the direction backwards
SELECT i, n, avg(n) OVER (ORDER BY i ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS leading_avg
FROM v;
-- this is TRAILING (this row + the 2 BEFORE), not leading (this row + the 2 AFTER)`,
        right: `SELECT i, n, avg(n) OVER (ORDER BY i ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING) AS leading_avg
FROM v;`,
        why: 'PRECEDING and FOLLOWING are not interchangeable directions, and mixing them up silently produces a correct-looking but wrong average. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW looks backward: it includes the current row and the two rows immediately before it in the ordering, a trailing window. A leading window looks forward instead: ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING includes the current row and the two rows after it. Reading the frame clause left to right as "start bound AND end bound" and checking which side of CURRENT ROW each bound sits on is the reliable way to avoid swapping the direction.',
        whyHi: 'PRECEDING aur FOLLOWING interchangeable directions nahi hain, aur unhe mix karna chupchaap ek theek-dikhने waali par galat average produce karता hai. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` peeche dekhता hai: ye current row aur ordering mein iske turant pehle ki do rows include karता hai, ek trailing window. Ek leading window iske bजाy aage dekhता hai: `ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING` current row aur iske baad ki do rows include karता hai.',
      },
      {
        wrong: `-- "the max amount in the region" -- forgot to widen the frame
SELECT region, amt,
  max(amt) OVER (PARTITION BY region ORDER BY amt) AS region_max
FROM sales;
-- with the default frame, region_max is a RUNNING max, equal to amt on the last row only
-- by coincidence -- every OTHER row shows the max of the rows SO FAR, not the true region max`,
        right: `SELECT region, amt,
  max(amt) OVER (PARTITION BY region) AS region_max   -- no ORDER BY -> whole partition
FROM sales;
-- (max/min are fine without a frame override because they don't need an ORDER BY at all here)`,
        why: 'Adding an ORDER BY to max\'s OVER clause, even though max does not conceptually need an ordering, switches on the default frame of range between unbounded preceding and current row, turning a whole-partition maximum into a running maximum that only equals the true region maximum once the current row happens to be the largest value reached so far. Every earlier row instead shows the running high-water mark, which looks plausible but is not the region-wide maximum the query intended. Since max and min do not require ORDER BY to be meaningful over a partition, the simplest fix is to drop it entirely so the frame defaults to the whole partition; if you need to keep the ORDER BY for a different column in the same query context, widen this specific window\'s frame to ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING instead.',
        whyHi: '`max` ke `OVER` clause mein ek `ORDER BY` add karna, chahे `max` ko conceptually ek ordering ki zaroorat nahi, default frame `range between unbounded preceding and current row` on kar deता hai, ek whole-partition maximum ko ek running maximum mein badalते hue. Kyunki `max`/`min` ko partition par meaningful hone ke liye `ORDER BY` ki zaroorat nahi, sabse simple fix ise poori tarah hataना hai taaki frame poore partition par default ho.',
      },
    ],

    realWorld: [
      {
        en: '**A 7-day rolling revenue metric on an operational dashboard: `sum(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`** — explicit `ROWS`, immune to any day appearing twice in the source data.',
        hi: '**Ek operational dashboard par ek 7-day rolling revenue metric: explicit `ROWS`**.',
      },
      {
        en: '**A smoothing filter on sensor readings: `avg(temp) OVER (ORDER BY reading_at ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)`** — a centered 5-point average to reduce noise before charting.',
        hi: '**Sensor readings par ek smoothing filter: ek centered 5-point average**.',
      },
      {
        en: '**`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` standardised across the codebase for every partition-wide `last_value`/`max`/`min`** after a bug where the default frame silently truncated a "final balance" column.',
        hi: '**`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` codebase mein standardised ek bug ke baad**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `ROWS` and `RANGE` in a window frame?',
        qHi: 'Ek window frame mein `ROWS` aur `RANGE` mein kya antar hai?',
        a: 'Both define which rows around the current one are included in the calculation, but they count differently. ROWS counts physical row positions: two preceding means literally the two rows immediately before the current one in the ordering, regardless of whether their values are equal, distinct, or anything else. RANGE instead counts by the value of the ORDER BY expression: it measures a logical distance along that value, and critically, if multiple rows share the exact same ORDER BY value, they are peers and RANGE cannot split them, so a boundary like current row includes all peers of the current row together, not one at a time. This matters most with the default frame: when you write ORDER BY with no explicit frame, PostgreSQL defaults to RANGE between unbounded preceding and current row, so a running total computed this way gives every row tied on the ordering value the identical, combined sum, rather than advancing by one row at a time. If you want strictly per-row advancement even in the presence of ties, you must say ROWS explicitly. ROWS is also the natural choice for things genuinely measured in row counts, like a trailing three rows or a centered five-row average, while RANGE is right for genuinely value-based windows, such as all transactions within a certain number of days of the current one on a timestamp column.',
        aHi: 'Dono define karте hain ki current row ke aas-paas kaunसी rows calculation mein include hain, par wo alag tarike se ginте hain. `ROWS` physical row positions ginta hai: `two preceding` matlab theek ordering mein current se turant pehle ki do rows, chahे unki values barabar hon ya alag. `RANGE` iske bजाy `ORDER BY` expression ki value se ginta hai: ye us value ke saath ek logical distance measure karता hai, aur zaroori: agar kई rows theek same `ORDER BY` value share karти hain, wo peers hain aur `RANGE` unhe split nahi kar sakta. Ye default frame ke saath sabse zyada maayne rakhता hai: jab aap bina explicit frame ke `ORDER BY` likhте ho, PostgreSQL `RANGE between unbounded preceding and current row` default karता hai.',
      },
      {
        q: 'How would you write a centered 5-row moving average, and how does it behave at the edges of the partition?',
        qHi: 'Aap ek centered 5-row moving average kaise likhogे, aur ye partition ke edges par kaise behave karта hai?',
        a: 'A centered five-row average includes the current row, the two rows immediately before it, and the two immediately after it in the ordering, which is written as avg of the column over order by the sequencing column rows between two preceding and two following. The frame is symmetric around the current row by construction. At the edges of a partition, there simply are not enough rows on one side: for the very first row there are no preceding rows at all, so the frame can only include the current row plus up to two following rows, and the average is computed over however many rows actually exist rather than raising an error or padding with nulls. The same happens in reverse at the last row. So the average near the edges is computed over fewer than five rows, typically three at the very first or last position, and this asymmetry is worth being aware of when interpreting the smoothed series, since the edge values are noisier estimates than the interior ones.',
        aHi: 'Ek centered five-row average current row, iske turant pehle ki do rows, aur iske turant baad ki do rows include karता hai, jo `avg of the column over order by sequencing column rows between two preceding and two following` ke roop mein likha jaता hai. Frame construction se current row ke around symmetric hai. Partition ke edges par, ek side par bस itni rows nahi hain: bilkul pehli row ke liye koi preceding rows nahi hain, to frame sirf current row plus do following rows tak include kar sakта hai, aur average jitni rows asal mein exist karти hain unpar compute hoता hai, error raise karne ya nulls se pad karne ke bजाy.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(k int, n int)` with rows `(1,10), (1,20), (2,5)` (two rows tie on `k=1`). Add `by_rows` (`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`) and `by_range` (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`), both `sum(n) OVER (ORDER BY k ...)`. Confirm `by_rows` = `10, 30, 35` and `by_range` = `30, 30, 35`.',
        taskHi: 'Table `t(k, n)` rows `(1,10), (1,20), (2,5)` ke saath (do rows `k=1` par tie karти hain). `by_rows` aur `by_range` add karो.',
        hint: '`ROWS` accumulates one physical row at a time regardless of ties: `10, 10+20=30, 30+5=35`. `RANGE` groups both `k=1` rows together: both get `30` (their combined sum), then `35`.',
        hintHi: '`ROWS` ties ke bavjood ek physical row ek baar accumulate karta hai: `10, 30, 35`. `RANGE` dono `k=1` rows ko saath group karta hai: dono `30` pate hain, phir `35`.',
      },
      {
        task: 'Table `v(i int, n int)` with 5 rows `i=1..5`. Write a TRAILING 3-row sum (`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`) and a LEADING 3-row sum (`ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING`). Confirm they give different results and explain in a comment which direction each looks.',
        taskHi: 'Table `v(i, n)` 5 rows `i=1..5` ke saath. Ek TRAILING 3-row sum aur ek LEADING 3-row sum likho. Confirm karो wo alag results dete hain.',
        hint: 'Trailing (`2 PRECEDING AND CURRENT ROW`) looks backward from the current row. Leading (`CURRENT ROW AND 2 FOLLOWING`) looks forward. At row `i=1`, trailing has only 1 row in frame; leading has 3.',
        hintHi: 'Trailing peeche dekhta hai. Leading aage dekhta hai. Row `i=1` par, trailing ke frame mein sirf 1 row hai; leading ke 3.',
      },
      {
        task: 'Table `sales(region text, amt int)`. Compare `max(amt) OVER (PARTITION BY region ORDER BY amt)` (running max, WRONG for "the region max") against `max(amt) OVER (PARTITION BY region)` (no `ORDER BY`, whole partition). Confirm only the second gives the true region maximum on every row.',
        taskHi: 'Table `sales(region, amt)`. `max(amt) OVER (PARTITION BY region ORDER BY amt)` (running max) ko `max(amt) OVER (PARTITION BY region)` (koi `ORDER BY` nahi) se compare karो.',
        hint: 'Adding `ORDER BY` to `max` turns on the default frame (up to current row), making it a running max — correct only on the last row. Drop the `ORDER BY` entirely for a true partition-wide max.',
        hintHi: '`max` mein `ORDER BY` add karna default frame on karta hai, ise ek running max banaते hue — sirf aakhri row par sahi. Ek true partition-wide max ke liye `ORDER BY` poori tarah hatao.',
      },
    ],

    keyTakeaways: [
      'Frame clause: `[ROWS | RANGE | GROUPS] BETWEEN frame_start AND frame_end`, bounds from `UNBOUNDED PRECEDING`, `n PRECEDING`, `CURRENT ROW`, `n FOLLOWING`, `UNBOUNDED FOLLOWING`. Defines, PER ROW, which other partition rows the window function can see.',
      '`ROWS` = count PHYSICAL rows, regardless of `ORDER BY` value ties. `RANGE` = count by `ORDER BY` VALUE — rows with the SAME value ("peers") move together, ALL or NONE (cannot split a tie). `GROUPS` = count whole peer-groups as one step (rare).',
      'THE surprising consequence: the DEFAULT frame with `ORDER BY` present is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — so a "running total" with duplicate `ORDER BY` values gives ALL tied rows the SAME combined value, not a strict one-at-a-time progression. For strict per-row advancement regardless of ties, use `ROWS` explicitly.',
      'Build moving/centered windows: TRAILING = `ROWS BETWEEN N PRECEDING AND CURRENT ROW`. LEADING = `ROWS BETWEEN CURRENT ROW AND N FOLLOWING`. CENTERED = `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` (or wider). Near partition edges, `n PRECEDING`/`FOLLOWING` CLIPS to however many rows actually exist — no error, no padding.',
      'DEFAULT FRAMES memorised: no `ORDER BY` + no frame -> ENTIRE partition. `ORDER BY` present + no frame -> `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. This second rule explains BOTH the running-total default (Lesson 4) AND the `last_value` gotcha (Lesson 3).',
      'For a value-based (not row-count) window on a timestamp/numeric column — "all rows within 7 days" — `RANGE BETWEEN INTERVAL \'7 days\' PRECEDING AND CURRENT ROW` (PostgreSQL supports interval/numeric `RANGE` offsets).',
      'RULE: whenever you want the WHOLE partition regardless of the current row\'s position (a true partition-wide max/last_value), state `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` explicitly — never rely on the default, and note `max`/`min` usually don\'t even need an `ORDER BY` for this.',
    ],
    keyTakeawaysHi: [
      'Frame clause: `[ROWS | RANGE | GROUPS] BETWEEN frame_start AND frame_end`. PRATI ROW define karता hai ki window function kaunसी doosri partition rows dekh sakta hai.',
      '`ROWS` = PHYSICAL rows ginता hai, `ORDER BY` value ties ke bavjood. `RANGE` = `ORDER BY` VALUE se ginता hai — same value waali rows ("peers") saath chalti hain, SAB ya KOI NAHI. `GROUPS` = poore peer-groups ko ek step ke roop mein ginता hai (rare).',
      'Surprising consequence: `ORDER BY` maujood hone par DEFAULT frame `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` hai — to duplicate `ORDER BY` values waala ek "running total" SABHI tied rows ko SAME combined value deता hai. Strict per-row advancement ke liye, `ROWS` explicitly istemal karo.',
      'Moving/centered windows banao: TRAILING = `ROWS BETWEEN N PRECEDING AND CURRENT ROW`. LEADING = `ROWS BETWEEN CURRENT ROW AND N FOLLOWING`. CENTERED = `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING`. Partition edges ke paas, `n PRECEDING`/`FOLLOWING` jitni rows exist karti hain unpar CLIP hota hai.',
      'DEFAULT FRAMES yaad karo: koi `ORDER BY` nahi + koi frame nahi -> POORA partition. `ORDER BY` maujood + koi frame nahi -> `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Ye doosra niyam running-total default (Lesson 4) AUR `last_value` gotcha (Lesson 3) dono explain karता hai.',
      'Ek value-based window ke liye — "7 days ke andar sabhi rows" — `RANGE BETWEEN INTERVAL \'7 days\' PRECEDING AND CURRENT ROW`.',
      'NIYAM: jab bhi aapको current row ki position ke bavjood POORA partition chahिए, explicitly `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` batao — default par bharosa mat karो.',
    ],
  },

  {
    slug: 'sql-window-clause-and-vs-groupby',
    title: 'The WINDOW Clause & Window vs GROUP BY',
    titleHi: 'WINDOW Clause Aur Window vs GROUP BY',
    description: 'The `WINDOW` clause names a window definition so several functions can share it without repeating `PARTITION BY ... ORDER BY ...`. And a query can combine `GROUP BY` with a window function — the window then sees the grouped rows, useful for "each group\'s share of the grand total".',
    descriptionHi: '`WINDOW` clause ek window definition ko naam deता hai taaki kई functions bina `PARTITION BY ... ORDER BY ...` repeat kiye ise share kar sakें. Aur ek query `GROUP BY` ko ek window function ke saath combine kar sakती hai — window phir grouped rows dekhता hai, "har group ka grand total mein share" ke liye useful.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**Giving a camera setup a name so three different photographers don\'t each have to re-position the tripod.** If several shots need the exact same camera position, angle, and focus — "tripod at spot 3, facing the stage, focused on the mic" — you set it up once, call it "Shot A", and then three photographers each take their own picture using "Shot A" without re-measuring anything. The `WINDOW` clause is exactly that: you define `w AS (PARTITION BY region ORDER BY amt DESC)` once, and then `rank() OVER w`, `sum(amt) OVER w`, and any other function can reuse that exact setup by name, guaranteeing they all see the same rows in the same order — and the database only does the "positioning" (the sort) once. The other half of this lesson answers a standing question from the whole module: `GROUP BY` and a window function are not rivals, they can appear in the same query — first the rows are grouped down to one row per group, and *then* a window function can run again on top of *those* grouped rows, e.g. to show what fraction of the grand total each group represents.',
      hi: '**Ek camera setup ko ek naam dena taaki teen alag photographers ko har baar tripod re-position na karna pade.** Agar kई shots ko theek wahi camera position, angle, aur focus chahिए — "tripod spot 3 par, stage ki taraf, mic par focused" — aap ise ek baar set karте ho, "Shot A" kahте ho, aur phir teen photographers har ek "Shot A" istemal karke apni photo lete hain bina kuch re-measure kiye. `WINDOW` clause theek yahi hai: aap `w AS (PARTITION BY region ORDER BY amt DESC)` ek baar define karте ho, aur phir `rank() OVER w`, `sum(amt) OVER w`, aur koi bhi doosra function us exact setup ko naam se reuse kar sakता hai. Is lesson ka doosra hissa poore module ke ek standing sawaal ka jawab deता hai: `GROUP BY` aur ek window function rivals nahi hain, wo usi query mein aa sakते hain — pehle rows prati group ek row tak grouped hoती hain, aur *phir* ek window function un grouped rows par phir se chal sakta hai.',
    },

    simple: `**\`WINDOW\` — name a definition, reuse it across several functions**

\`\`\`sql
SELECT region, product, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running_total
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC);
-- w is defined ONCE; the sort for (region, amt DESC) happens once too
\`\`\`

**You can still override part of a named window per use**

\`\`\`sql
SELECT region, amt,
  sum(amt) OVER w                                    AS running,
  sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS region_total
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt);
\`\`\`

**\`GROUP BY\` + a window function: the window sees the GROUPED rows**

\`\`\`sql
SELECT region, sum(amt) AS region_total,
       sum(sum(amt)) OVER () AS grand_total,               -- window over the grouped result
       round(100.0 * sum(amt) / sum(sum(amt)) OVER (), 1) AS pct_of_all
FROM sales
GROUP BY region;
-- one row per region (from GROUP BY), plus each region's % of the overall total
\`\`\`

**Decision guide**

\`\`\`
one row per group, detail gone                  -> GROUP BY
every detail row + a group-level number         -> window, PARTITION BY
every detail row + a running/positional value    -> window, ORDER BY
a rank / row-number / lag / top-N-per-group      -> window (only windows do this)
each GROUP's share of a grand total              -> GROUP BY + a window over the grouped rows
\`\`\``,

    simpleHi: `**\`WINDOW\` — ek definition ko naam do, kई functions mein reuse karो**

\`\`\`sql
SELECT region, product, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running_total
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC);
-- w EK baar define hota hai; (region, amt DESC) ke liye sort bhi ek baar hoता hai
\`\`\`

**Aap prati use ek named window ka hissa abhi bhi override kar sakte ho**

\`\`\`sql
SELECT region, amt,
  sum(amt) OVER w                                    AS running,
  sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS region_total
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt);
\`\`\`

**\`GROUP BY\` + ek window function: window GROUPED rows dekhता hai**

\`\`\`sql
SELECT region, sum(amt) AS region_total,
       sum(sum(amt)) OVER () AS grand_total,
       round(100.0 * sum(amt) / sum(sum(amt)) OVER (), 1) AS pct_of_all
FROM sales
GROUP BY region;
-- prati region ek row (GROUP BY se), plus har region ka overall total mein %
\`\`\`

**Decision guide**

\`\`\`
prati group ek row, detail gone                  -> GROUP BY
har detail row + ek group-level number           -> window, PARTITION BY
har detail row + ek running/positional value     -> window, ORDER BY
ek rank / row-number / lag / top-N-per-group     -> window (sirf windows ye karте hain)
har GROUP ka grand total mein share              -> GROUP BY + grouped rows par ek window
\`\`\``,

    content: `## The \`WINDOW\` clause

When several window functions in a \`SELECT\` share the same \`PARTITION BY\`/\`ORDER BY\`/frame, repeating the full specification is noisy and, more importantly, obscures whether they are really the *same* window (guaranteeing one shared sort) or subtly different ones (each needing its own sort):

\`\`\`sql
-- repeated, harder to see they match, and easy to accidentally make them different
SELECT region, amt,
  rank()   OVER (PARTITION BY region ORDER BY amt DESC) AS r,
  sum(amt) OVER (PARTITION BY region ORDER BY amt DESC) AS running
FROM sales;
\`\`\`

\`\`\`sql
-- named once
SELECT region, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC);
\`\`\`

A query can define **several** named windows, comma-separated, and one window can even be defined **in terms of another**:

\`\`\`sql
WINDOW
  by_region AS (PARTITION BY region),
  by_region_amt AS (by_region ORDER BY amt DESC)
\`\`\`

You can also **partially override** a named window at the point of use — add a frame clause, for instance:

\`\`\`sql
SELECT region, amt,
  sum(amt) OVER w AS running,                                                       -- default frame
  sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS total -- override frame
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt);
\`\`\`

Beyond readability, naming the window is a **hint to the planner** that these really are the same partitioning/ordering — some engines can then guarantee (rather than merely hope) a single sort is reused.

## Combining \`GROUP BY\` with a window function

A query can have both. The processing order (Lesson 1) tells you what the window sees: \`GROUP BY\`/\`HAVING\` run **before** window functions, so **the window operates on the already-grouped rows**, not the original detail rows.

\`\`\`sql
SELECT region, sum(amt) AS region_total,
       sum(sum(amt)) OVER () AS grand_total,
       round(100.0 * sum(amt) / sum(sum(amt)) OVER (), 1) AS pct_of_all
FROM sales
GROUP BY region;
\`\`\`

Reading this: \`GROUP BY region\` collapses \`sales\` to one row per region with \`sum(amt)\` as \`region_total\`. Then, over **those** (already one-per-region) rows, \`sum(sum(amt)) OVER ()\` sums the region totals into a grand total, shown on every (region) row. The inner \`sum(amt)\` is a normal grouped aggregate; the outer \`sum(...) OVER ()\` is a window aggregate **over the result of the \`GROUP BY\`**. This is the standard way to get "each group's percentage of everything" without a second query or a self-join.

## Window vs \`GROUP BY\` — the final decision guide

| need | tool |
|---|---|
| one row per group; detail rows not needed | \`GROUP BY\` |
| every detail row, plus a per-group total/avg/count alongside it | window, \`PARTITION BY\`, no \`GROUP BY\` |
| every detail row, plus a running or positional value | window, \`ORDER BY\`, no \`GROUP BY\` |
| a rank, row number, "previous row", top-N-per-group | window (ranking/offset functions) |
| one row per group, plus each group's share of an overall total | \`GROUP BY\`, then a window \`OVER ()\` on the grouped result |
| filtering by a window value (e.g. \`rn <= 3\`) | window in a subquery/CTE, filter outer query |

## A closing note on Module 6

Across this module: **any aggregate + \`OVER\`** keeps rows instead of collapsing them (Lesson 1); **ranking functions** (Lesson 2) number and bucket ordered rows; **\`lag\`/\`lead\`/\`first_value\`/\`last_value\`** (Lesson 3) fetch values from elsewhere in the ordering; **the implicit frame** (Lesson 4) turns \`ORDER BY\` into a running calculation; the **explicit frame clause** (Lesson 5) gives full control over which rows are "in scope"; and this lesson ties it together with **named windows** and **window-after-\`GROUP BY\`**. Together with joins (Module 3), aggregation (Module 4), and subqueries/CTEs (Module 5), this is the complete core toolkit for shaping query results — Module 7 moves on to designing the tables these queries run against.`,

    contentHi: `## \`WINDOW\` clause

Jab \`SELECT\` mein kई window functions same \`PARTITION BY\`/\`ORDER BY\`/frame share karте hain, poori specification repeat karna noisy hai:

\`\`\`sql
-- named ek baar
SELECT region, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC);
\`\`\`

Ek query kई named windows define kar sakती hai, comma-separated, aur ek window ek doosre ke roop mein bhi define ho sakti hai:

\`\`\`sql
WINDOW
  by_region AS (PARTITION BY region),
  by_region_amt AS (by_region ORDER BY amt DESC)
\`\`\`

Aap use ke point par ek named window ko **partially override** bhi kar sakte ho — ek frame clause add karके.

Readability se pare, window ko naam dena **planner ke liye ek hint** hai ki ye asal mein wahi partitioning/ordering hain.

## \`GROUP BY\` ko ek window function ke saath combine karna

Ek query mein dono ho sakते hain. Processing order (Lesson 1) batाता hai window kya dekhता hai: \`GROUP BY\`/\`HAVING\` window functions se **pehle** chalते hain, to **window pehle se grouped rows par operate karता hai**, original detail rows par nahi.

\`\`\`sql
SELECT region, sum(amt) AS region_total,
       sum(sum(amt)) OVER () AS grand_total,
       round(100.0 * sum(amt) / sum(sum(amt)) OVER (), 1) AS pct_of_all
FROM sales
GROUP BY region;
\`\`\`

Isse padhна: \`GROUP BY region\` \`sales\` ko prati region ek row mein collapse karta hai \`sum(amt)\` ke saath \`region_total\` ke roop mein. Phir, un (pehle se prati-region-ek) rows par, \`sum(sum(amt)) OVER ()\` region totals ko ek grand total mein sum karta hai, har (region) row par dikhाya gaya. Inner \`sum(amt)\` ek normal grouped aggregate hai; outer \`sum(...) OVER ()\` ek window aggregate hai \`GROUP BY\` ke result **par**. Ye "har group ka sab kuch mein percentage" paane ka standard tarika hai bina ek doosri query ya self-join ke.

## Window vs \`GROUP BY\` — final decision guide

| zaroorat | tool |
|---|---|
| prati group ek row; detail rows nahi chahिए | \`GROUP BY\` |
| har detail row, plus ek per-group total/avg/count | window, \`PARTITION BY\`, koi \`GROUP BY\` nahi |
| har detail row, plus ek running/positional value | window, \`ORDER BY\`, koi \`GROUP BY\` nahi |
| ek rank, row number, "pichli row", top-N-per-group | window |
| prati group ek row, plus har group ka overall total mein share | \`GROUP BY\`, phir grouped result par ek window \`OVER ()\` |
| ek window value se filter karna | subquery/CTE mein window, outer query filter |

## Module 6 par ek closing note

Is poore module mein: **koi bhi aggregate + \`OVER\`** rows collapse karne ke bजाy rakhता hai (Lesson 1); **ranking functions** (Lesson 2) ordered rows ko number aur bucket karте hain; **\`lag\`/\`lead\`/\`first_value\`/\`last_value\`** (Lesson 3) ordering mein kahीं aur se values fetch karте hain; **implicit frame** (Lesson 4) \`ORDER BY\` ko ek running calculation mein badalता hai; **explicit frame clause** (Lesson 5) poora control deता hai; aur ye lesson **named windows** aur **window-after-\`GROUP BY\`** se sab jodता hai. Joins (Module 3), aggregation (Module 4), aur subqueries/CTEs (Module 5) ke saath, ye query results banane ka poora core toolkit hai — Module 7 un tables ko design karne par jaता hai jinke against ye queries chalте hain.`,

    examples: [
      {
        title: 'A named WINDOW shared by rank() and a running total, plus one override',
        titleHi: 'rank() aur ek running total dwara share ek named WINDOW, plus ek override',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES ('N',150),('N',100),('N',120),('N',80),('S',200),('S',90),('S',70),('S',60);

SELECT region, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running_total,
  sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS region_total
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC)
ORDER BY region, amt DESC;`,
        output: ` region | amt | r | running_total | region_total
--------+-----+---+---------------+--------------
 N      | 150 | 1 | 150           | 450
 N      | 120 | 2 | 270           | 450
 N      | 100 | 3 | 370           | 450
 N      | 80  | 4 | 450           | 450
 S      | 200 | 1 | 200           | 420
 S      | 90  | 2 | 290           | 420
 S      | 70  | 3 | 360           | 420
 S      | 60  | 4 | 420           | 420
(8 rows)`,
        explain: "`w` is defined once as `PARTITION BY region ORDER BY amt DESC` and reused for both `rank()` and the running `sum(amt) OVER w`, guaranteeing they see the exact same rows in the exact same order. The third column overrides just the frame — `OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)` — to get the whole-region total instead of a running one, while keeping `w`'s partition and order.",
        explainHi: '`w` ko `PARTITION BY region ORDER BY amt DESC` ke roop mein ek baar define kiya gaya hai aur `rank()` aur running `sum(amt) OVER w` dono ke liye reuse kiya gaya, guarantee karte hue ki wo theek wahi rows theek wahi order mein dekhते hain. Teesra column sirf frame override karta hai taaki running ke bजाy poore-region ka total mile, `w` ka partition aur order rakhte hue.',
      },
      {
        title: 'GROUP BY collapses to one row per region; a window then adds each region\'s share',
        titleHi: 'GROUP BY prati region ek row mein collapse karta hai; ek window phir har region ka share add karta hai',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES ('N',100),('N',150),('N',80),('N',120),('S',200),('S',60),('S',90),('S',70);

SELECT region, sum(amt) AS region_total,
       sum(sum(amt)) OVER () AS grand_total,
       round(100.0 * sum(amt) / sum(sum(amt)) OVER (), 1) AS pct_of_all
FROM sales
GROUP BY region
ORDER BY region;`,
        output: ` region | region_total | grand_total | pct_of_all
--------+--------------+-------------+------------
 N      | 450          | 870         | 51.7
 S      | 420          | 870         | 48.3
(2 rows)`,
        explain: "`GROUP BY region` first collapses 8 rows to 2 (one per region), with `sum(amt)` as a normal grouped aggregate producing each region's total (`450`, `420`). The window function then runs on THOSE 2 rows: `sum(sum(amt)) OVER ()` sums the two region totals into a grand total (`870`), shown on both rows, and dividing gives each region's percentage of everything (`51.7`, `48.3`).",
        explainHi: '`GROUP BY region` pehle 8 rows ko 2 mein collapse karta hai (prati region ek), `sum(amt)` ek normal grouped aggregate ke roop mein har region ka total produce karte hue (`450`, `420`). Window function phir UN 2 rows par chalta hai: `sum(sum(amt)) OVER ()` do region totals ko ek grand total mein sum karta hai (`870`), dono rows par dikhaya gaya, aur divide karna har region ka sab kuch mein percentage deta hai (`51.7`, `48.3`).',
      },
      {
        title: 'Two named windows, one built on the other',
        titleHi: 'Do named windows, ek doosre par bani',
        code: `CREATE TABLE sales (region text, amt int);
INSERT INTO sales VALUES ('N',100),('N',150),('S',200),('S',60);

SELECT region, amt,
  sum(amt) OVER by_region      AS region_total,
  rank()   OVER by_region_amt  AS r
FROM sales
WINDOW
  by_region     AS (PARTITION BY region),
  by_region_amt AS (by_region ORDER BY amt DESC)
ORDER BY region, amt DESC;`,
        output: ` region | amt | region_total | r
--------+-----+--------------+---
 N      | 150 | 250          | 1
 N      | 100 | 250          | 2
 S      | 200 | 260          | 1
 S      | 60  | 260          | 2
(4 rows)`,
        explain: '`by_region` is `PARTITION BY region` alone (no order); `by_region_amt` builds on it by adding `ORDER BY amt DESC`. `sum(amt) OVER by_region` (no order inside) gives the flat region total on every row; `rank() OVER by_region_amt` needs the ordering to rank within each region. One window definition reused inside another avoids repeating the shared `PARTITION BY region`.',
        explainHi: '`by_region` akela `PARTITION BY region` hai (koi order nahi); `by_region_amt` `ORDER BY amt DESC` add karke ispar banta hai. `sum(amt) OVER by_region` (andar koi order nahi) har row par flat region total deta hai; `rank() OVER by_region_amt` ko har region ke andar rank karne ke liye ordering chahiye. Ek window definition doosri ke andar reuse karna shared `PARTITION BY region` repeat karne se bachata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- repeating the same window spec 3 times -- easy to make them silently different
SELECT region, amt,
  rank()       OVER (PARTITION BY region ORDER BY amt DESC) AS r,
  sum(amt)     OVER (PARTITION BY region ORDER BY amt DESC) AS running,
  count(*)     OVER (PARTITION BY region ORDER BY amt)      AS n   -- oops: ASC here, DESC above
FROM sales;`,
        right: `SELECT region, amt,
  rank()   OVER w AS r,
  sum(amt) OVER w AS running,
  count(*) OVER w AS n
FROM sales
WINDOW w AS (PARTITION BY region ORDER BY amt DESC);`,
        why: 'Copy-pasting the same OVER specification for several functions invites a small, easy-to-miss divergence, here the third function accidentally sorts ascending while the first two sort descending, which changes what "running" means for that one column and is hard to spot in review. Naming the window once with a WINDOW clause and referencing it by name from every function guarantees, by construction, that all of them share the exact same partitioning, ordering, and frame; a change to the definition automatically applies everywhere it is used, and there is no copy to fall out of sync.',
        whyHi: 'Kई functions ke liye wahi `OVER` specification copy-paste karna ek chhote, miss karne mein aasan divergence ko invite karta hai, yahaan teesra function accidentally ascending sort karta hai jabki pehle do descending. Window ko ek `WINDOW` clause se ek baar naam dena aur har function se naam se reference karna guarantee karta hai ki wo sab theek wahi partitioning, ordering, aur frame share karте hain; definition mein ek change automatically har jagah apply hota hai.',
      },
      {
        wrong: `-- "each department's share of company payroll" -- window before GROUP BY collapses it
SELECT dept, salary,
       round(100.0 * salary / sum(salary) OVER (), 1) AS pct
FROM emp
GROUP BY dept;
-- ERROR: column "emp.salary" must appear in the GROUP BY clause or be used in an aggregate function`,
        right: `SELECT dept, sum(salary) AS dept_total,
       round(100.0 * sum(salary) / sum(sum(salary)) OVER (), 1) AS pct
FROM emp
GROUP BY dept;`,
        why: 'Once GROUP BY is present, every SELECT item must be either a grouped column or an aggregate, the same rule from Module 4; a bare salary column referenced inside a window function is still a bare non-aggregated column and triggers the usual error. The fix is to aggregate salary first, sum of salary as dept_total, which is a normal grouped aggregate producing one row per department, and then apply the window function to that aggregate: sum of sum of salary over an empty OVER computes the grand total across the already-grouped department totals. The window runs after GROUP BY in the processing order, so it operates on the one-row-per-department result, not the original per-employee rows, which is exactly why the argument to the outer sum must itself be an aggregate.',
        whyHi: 'Ek baar `GROUP BY` maujood hone par, har `SELECT` item ya to ek grouped column ya ek aggregate hona chahिए, Module 4 se wahi niyam; ek bare `salary` column jo window function ke andar reference kiya gaya abhi bhi ek bare non-aggregated column hai aur usual error trigger karta hai. Fix pehle `salary` ko aggregate karna hai, `sum of salary as dept_total`, jo ek normal grouped aggregate hai prati department ek row produce karte hue, aur phir us aggregate par window function apply karna.',
      },
      {
        wrong: `-- trying to filter "only departments above the company average" using a window in WHERE
SELECT dept, sum(salary) AS total
FROM emp
GROUP BY dept
WHERE sum(salary) > avg(sum(salary)) OVER ();
-- ERROR: syntax error -- WHERE cannot come after GROUP BY, and can't see the window anyway`,
        right: `SELECT dept, total FROM (
  SELECT dept, sum(salary) AS total,
         avg(sum(salary)) OVER () AS overall_avg
  FROM emp
  GROUP BY dept
) t
WHERE total > overall_avg;`,
        why: 'Two separate rules collide here. First, WHERE must precede GROUP BY syntactically and is evaluated before grouping happens, so it cannot follow GROUP BY at all. Second, even moved to the right position, WHERE runs before window functions are computed, so a window expression can never be referenced there regardless of what it computes over. The general fix for filtering on any window result, discussed since the very first lesson of this module, is to compute the window column in an inner query or CTE and filter on that column in an outer query, where it is now an ordinary value subject to ordinary WHERE rules.',
        whyHi: 'Yahaan do alag niyam takराते hain. Pehla, `WHERE` ko syntactically `GROUP BY` se pehle aana chahिए aur grouping hone se pehle evaluate hota hai, to ye `GROUP BY` ke baad bilkul nahi aa sakta. Doosra, sahi position par move karne par bhi, `WHERE` window functions compute hone se pehle chalta hai, to ek window expression ko wahaan kabhi reference nahi kiya ja sakta. General fix ek inner query ya CTE mein window column compute karna aur outer query mein us column par filter karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**A revenue dashboard\'s SQL template that always defines `WINDOW w AS (PARTITION BY region ORDER BY period)` once at the top** and references `w` from every rank/running-total column, so the sort is provably shared and definitions cannot drift apart.',
        hi: '**Ek revenue dashboard ka SQL template jo hamesha `WINDOW w AS (...)` ek baar upar define karta hai** aur har rank/running-total column se `w` reference karta hai.',
      },
      {
        en: '**A budget report: `GROUP BY department` then `sum(sum(spend)) OVER ()` for the company total and `sum(spend) / sum(sum(spend)) OVER ()` for each department\'s share** — one query, no second round trip for the total.',
        hi: '**Ek budget report: `GROUP BY department` phir company total ke liye `sum(sum(spend)) OVER ()`** — ek query, total ke liye koi doosra round trip nahi.',
      },
      {
        en: '**A style-guide rule: 3+ window functions in one `SELECT` must share a named `WINDOW`** unless they are genuinely computed over different partitions/orderings — catches copy-paste drift in review.',
        hi: '**Ek style-guide rule: ek `SELECT` mein 3+ window functions ko ek named `WINDOW` share karna chahिए** jab tak wo sach mein alag partitions/orderings par compute na hon.',
      },
    ],

    interviewQA: [
      {
        q: 'What does the `WINDOW` clause do, and what problem does it solve?',
        qHi: '`WINDOW` clause kya karta hai, aur ye kaunसی problem solve karता hai?',
        a: 'The WINDOW clause lets you give a name to a window specification, a combination of PARTITION BY, ORDER BY, and an optional frame, once, and then reference that name from OVER in as many function calls as you like within the same query, instead of repeating the full specification each time. It solves two problems. The first is readability and maintenance: when several ranking or aggregate window functions in one query are meant to operate over the exact same rows in the exact same order, spelling out the specification separately for each is verbose, and worse, invites accidental drift, one occurrence subtly different from another, which is easy to miss in review and hard to debug. Naming it once and referencing it everywhere guarantees they stay identical, and a later change to the definition automatically applies to every use. The second is a hint to the query planner that these are genuinely the same partitioning and ordering, which can let the engine perform the underlying sort a single time and reuse it, rather than treating each occurrence as independent. You can also define one named window in terms of another, and override part of a named window at a specific use, for instance adding an explicit frame while keeping the same partition and order.',
        aHi: '`WINDOW` clause aapको ek window specification ko ek naam dene deता hai, `PARTITION BY`, `ORDER BY`, aur ek optional frame ka combination, ek baar, aur phir usi query ke andar jitni chahे utni function calls mein `OVER` se us naam ko reference karne deता hai. Ye do problems solve karta hai. Pehla readability aur maintenance hai: jab ek query mein kई ranking ya aggregate window functions ko theek wahi rows par theek wahi order mein operate karna hai, har ek ke liye specification alag se likhна verbose hai, aur bura, accidental drift ko invite karta hai. Doosra planner ke liye ek hint hai ki ye sach mein wahi partitioning aur ordering hain.',
      },
      {
        q: 'Can `GROUP BY` and window functions appear in the same query, and if so, what does the window see?',
        qHi: 'Kya `GROUP BY` aur window functions ek hi query mein aa sakते hain, aur agar haan, window kya dekhta hai?',
        a: 'Yes, and this is a genuinely useful combination, not a conflict, because the logical processing order resolves any ambiguity. FROM and WHERE run first, then GROUP BY collapses the surviving rows into one row per group and any grouped aggregates are computed, then HAVING filters groups, and only after all of that do window functions run. So when a query has both a GROUP BY and a window function, the window operates on the already-grouped result set, one row per group, not on the original detail rows. A common pattern exploits this directly: group by some column to get one row per group with, say, sum of a measure as that group\'s total, and then apply a window aggregate with an empty OVER, sum of the group total over an empty window, which sums those already-grouped totals into a grand total shown on every group row. Dividing the group total by that grand total gives each group\'s percentage of the whole in a single query, without a second round trip or a self-join. Because the window function itself needs its argument to be an aggregate here, since GROUP BY is in force, this pattern always looks like an aggregate nested inside a window aggregate.',
        aHi: 'Haan, aur ye ek genuinely useful combination hai, conflict nahi, kyunki logical processing order kisi bhi ambiguity ko resolve karta hai. `FROM` aur `WHERE` pehle chalते hain, phir `GROUP BY` bachi hui rows ko prati group ek row mein collapse karta hai aur koi bhi grouped aggregates compute hote hain, phir `HAVING` groups filter karta hai, aur sirf iske baad window functions chalते hain. To jab ek query mein `GROUP BY` aur ek window function dono hain, window pehle se grouped result set par operate karta hai. Ek common pattern isi ka istemal karta hai: kisi column se group karo prati group ek row paane ke liye, phir ek window aggregate empty `OVER` ke saath apply karo, jo un pehle se grouped totals ko ek grand total mein sum karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `sales(region text, amt int)`. Write a query with a named window `w AS (PARTITION BY region ORDER BY amt DESC)`, using `w` for both `rank()` and `sum(amt)`. Then add a third column using `sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)` for the true region total. Confirm all three columns are correct.',
        taskHi: 'Table `sales(region, amt)`. Ek named window `w AS (PARTITION BY region ORDER BY amt DESC)` waali query likho, `rank()` aur `sum(amt)` dono ke liye `w` istemal karके.',
        hint: '`WINDOW w AS (PARTITION BY region ORDER BY amt DESC)`, then `rank() OVER w`, `sum(amt) OVER w` (running), and `sum(amt) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)` (total, overriding just the frame).',
        hintHi: '`WINDOW w AS (...)`, phir `rank() OVER w`, `sum(amt) OVER w`, aur frame override karте hue `sum(amt) OVER (w ROWS BETWEEN ...)`.',
      },
      {
        task: 'Table `emp(dept text, salary int)`. Write `GROUP BY dept` returning `dept`, `dept_total` (`sum(salary)`), `company_total` (`sum(sum(salary)) OVER ()`), and `pct` (`round(100.0 * sum(salary) / sum(sum(salary)) OVER (), 1)`). Confirm the `pct` column sums to ~100 across departments.',
        taskHi: 'Table `emp(dept, salary)`. `GROUP BY dept` jo `dept`, `dept_total`, `company_total`, aur `pct` lौtaती hai likho.',
        hint: 'The inner `sum(salary)` is a normal grouped aggregate (one per dept). The outer `sum(...) OVER ()` is a window aggregate over the GROUPED rows, giving the grand total on every dept row.',
        hintHi: 'Inner `sum(salary)` ek normal grouped aggregate hai. Outer `sum(...) OVER ()` GROUPED rows par ek window aggregate hai, har dept row par grand total deता hue.',
      },
      {
        task: 'Try writing `WHERE sum(salary) > avg(sum(salary)) OVER ()` after a `GROUP BY dept` and observe the error. Rewrite it correctly: compute `total` and `overall_avg` as columns in an inner query with `GROUP BY`, then filter `WHERE total > overall_avg` in the outer query.',
        taskHi: '`GROUP BY dept` ke baad `WHERE sum(salary) > avg(sum(salary)) OVER ()` likhne ki koshish karo aur error dekho. Sahi tareeke se rewrite karo.',
        hint: 'WHERE cannot follow GROUP BY syntactically, and even if it could, window functions are not visible in WHERE. Push the window computation into a subquery/CTE and filter the outer query on the resulting column.',
        hintHi: '`WHERE` syntactically `GROUP BY` ke baad nahi aa sakta, aur agar aa bhi sake, window functions `WHERE` mein visible nahi hain. Window computation ko ek subquery/CTE mein push karo aur outer query mein resulting column par filter karo.',
      },
    ],

    keyTakeaways: [
      '`WINDOW w AS (PARTITION BY ... ORDER BY ... frame)` names a window spec ONCE; any function can then write `OVER w` instead of repeating the full definition. Guarantees several functions share the EXACT same rows/order (no accidental drift) and is a hint the planner can reuse ONE sort.',
      'Several named windows can be defined, comma-separated; one can build on another (`w2 AS (w1 ORDER BY ...)`). You can PARTIALLY OVERRIDE a named window at point of use — e.g. add/replace the frame: `OVER (w ROWS BETWEEN ...)`.',
      '`GROUP BY` and a window function CAN coexist in one query. Processing order (`FROM`->`WHERE`->`GROUP BY`->`HAVING`->window functions) means the window operates on the ALREADY-GROUPED rows, not the original detail rows.',
      'Pattern: "each group\'s share of the total" = `GROUP BY g` (inner `sum(x)` = normal grouped aggregate, one row per group) + `sum(sum(x)) OVER ()` (outer window aggregate over the grouped result = grand total on every group row). Because `GROUP BY` is active, the window\'s argument must itself be an aggregate.',
      'FINAL DECISION GUIDE: one row per group, detail gone -> `GROUP BY`. Every detail row + a per-group number -> window `PARTITION BY` (no `GROUP BY`). Every row + running/positional value -> window `ORDER BY`. A rank/row-number/lag/top-N-per-group -> window only. Each group\'s share of an overall total -> `GROUP BY` then a window `OVER ()` on the grouped result. Filtering by a window value -> window in a subquery/CTE, filter the OUTER query.',
      'Module 6 recap: aggregate + `OVER` keeps rows (L1); ranking functions number/bucket ordered rows (L2); `lag`/`lead`/`first_value`/`last_value` fetch values from elsewhere in the order (L3); the implicit frame turns `ORDER BY` into a running calc (L4); the explicit frame clause gives full control (L5); named windows + window-after-`GROUP BY` tie it together (L6).',
    ],
    keyTakeawaysHi: [
      '`WINDOW w AS (PARTITION BY ... ORDER BY ... frame)` ek window spec ko EK baar naam deता hai; koi bhi function phir poori definition repeat karne ke bजाy `OVER w` likh sakta hai. Guarantee karta hai ki kई functions EXACT same rows/order share karें, aur planner ke liye ek hint hai ki EK sort reuse ho sakta hai.',
      'Kई named windows comma-separated define ho sakती hain; ek doosri par ban sakти hai. Aap use ke point par ek named window ko PARTIALLY OVERRIDE kar sakte ho.',
      '`GROUP BY` aur ek window function EK query mein coexist kar sakते hain. Processing order ka matlab window ALREADY-GROUPED rows par operate karta hai, original detail rows par nahi.',
      'Pattern: "har group ka total mein share" = `GROUP BY g` (inner `sum(x)` = normal grouped aggregate) + `sum(sum(x)) OVER ()` (outer window aggregate grouped result par = har group row par grand total). Kyunki `GROUP BY` active hai, window ke argument ko khud ek aggregate hona chahिए.',
      'FINAL DECISION GUIDE: prati group ek row -> `GROUP BY`. Har detail row + ek per-group number -> window `PARTITION BY`. Har row + running/positional value -> window `ORDER BY`. Ek rank/row-number/lag/top-N-per-group -> SIRF window. Har group ka overall total mein share -> `GROUP BY` phir grouped result par ek window `OVER ()`. Ek window value se filter -> subquery/CTE mein window, OUTER query filter.',
      'Module 6 recap: aggregate + `OVER` rows rakhता hai (L1); ranking functions ordered rows number/bucket karте hain (L2); `lag`/`lead`/`first_value`/`last_value` order mein kahीं aur se values fetch karте hain (L3); implicit frame `ORDER BY` ko ek running calc mein badalता hai (L4); explicit frame clause poora control deता hai (L5); named windows + window-after-`GROUP BY` sab jodते hain (L6).',
    ],
  },
];
