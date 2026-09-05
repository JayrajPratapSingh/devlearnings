/**
 * Databases Complete Course — Module 7: Data Modeling & Normalization, lessons 4-6.
 *
 * Lesson 4: Third Normal Form & BCNF — no transitive dependency (a non-key column
 *           depending on another non-key column rather than the key), worked anomaly
 *           examples, and Boyce-Codd Normal Form as the stricter edge case.
 * Lesson 5: Modeling relationships — one-to-many (FK on the "many" side), many-to-many
 *           (a junction table), one-to-one, and self-referencing relationships.
 * Lesson 6: Denormalization & common schema patterns — when and how to deliberately
 *           denormalize, audit columns, soft delete, status enums vs lookup tables,
 *           polymorphic association trade-offs, and why EAV is a trap.
 *
 * Examples use CREATE TABLE + INSERT + a query/anomaly, verified against real
 * PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 7
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'sql-third-normal-form-and-bcnf',
    title: 'Third Normal Form & BCNF',
    titleHi: 'Third Normal Form Aur BCNF',
    description: '**3NF**: builds on 2NF by additionally forbidding a TRANSITIVE dependency — a non-key column that depends on another non-key column instead of on the key itself. **BCNF** is a stricter edge-case version of 3NF for tables with overlapping candidate keys.',
    descriptionHi: '**3NF**: 2NF par banта hai additionally ek TRANSITIVE dependency forbid karke — ek non-key column jo ek doosre non-key column par depend karta hai key par nahi. **BCNF** overlapping candidate keys waali tables ke liye 3NF ka ek stricter edge-case version hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A personnel file where an employee\'s city is written down twice, once directly and once indirectly through their zip code — and the two copies can drift apart.** Every employee file has an "employee ID" tab — that is the key. Directly under the key, it is fine to write the employee\'s zip code, because a zip code is a genuine fact about *that employee*. But now imagine the same clerk *also* writes the city name on that file, reasoning "well, I already have the zip code, and zip codes determine cities, so I\'ll just write the city too, for convenience". The city is not really a fact about *the employee* — it is a fact about *the zip code*, which happens to be a fact about the employee. That chain — employee → zip code → city — is a **transitive dependency**, and it creates exactly the same redundancy problem as before: two employees who both live in zip code 10001 will each have "New York" written on their own file, in duplicate, and if the city\'s official name is later corrected to "NYC", the clerk must remember to fix it on *every single employee file* rather than in one place. **Third Normal Form** is the rule "write down only facts about the person on the person\'s tab — facts about the zip code go on the zip code\'s own card".',
      hi: '**Ek personnel file jahaan ek employee ka city do baar likha hai, ek baar directly aur ek baar unke zip code se indirectly — aur do copies drift apart ho sakti hain.** Har employee file ke paas ek "employee ID" tab hai — wo key hai. Key ke seedhे neeche, employee ka zip code likhna theek hai, kyunki ek zip code *us employee* ke baare mein ek genuine fact hai. Par ab socho wahi clerk city name bhi us file par likhta hai, reasoning "mere paas pehle se zip code hai, aur zip codes cities determine karte hain, to main city bhi likh deता hoon, convenience ke liye". City asal mein *employee* ke baare mein ek fact nahi hai — ye *zip code* ke baare mein ek fact hai, jo employee ke baare mein ek fact hoता hai. Wo chain — employee → zip code → city — ek **transitive dependency** hai, aur ye pehle jaisा hi redundancy problem create karti hai: zip code 10001 mein rehने waale do employees dono apni file par "New York" likhа hoga, duplicate mein, aur agar city ka official naam baad mein "NYC" correct hota hai, clerk ko har single employee file fix karna yaad rakhна hoga. **Third Normal Form** ye niyam hai "vyakti ke tab par sirf vyakti ke baare mein facts likho — zip code ke baare mein facts zip code ke apne card par jaate hain".',
    },

    simple: `**3NF violation: a TRANSITIVE dependency (key → A → B, not key → B directly)**

\`\`\`sql
-- employee_id -> zip_code -> city  (city depends on zip_code, NOT directly on employee_id)
CREATE TABLE emp_bad (employee_id int PRIMARY KEY, zip_code text, city text);
INSERT INTO emp_bad VALUES (1, '10001', 'New York'), (2, '10001', 'New York');

-- two employees, same zip, city duplicated -- and now they can silently DRIFT APART:
UPDATE emp_bad SET city = 'NYC' WHERE employee_id = 1;   -- employee 2's row is now WRONG
\`\`\`

**3NF fix: move the transitively-dependent fact to a table keyed by what it REALLY depends on**

\`\`\`sql
CREATE TABLE zip_city (zip_code text PRIMARY KEY, city text);
CREATE TABLE emp_good (employee_id int PRIMARY KEY, zip_code text REFERENCES zip_city(zip_code));
INSERT INTO zip_city VALUES ('10001', 'New York');
INSERT INTO emp_good VALUES (1, '10001'), (2, '10001');

-- one row changes, BOTH employees see the correction via the join -- no drift possible
UPDATE zip_city SET city = 'NYC' WHERE zip_code = '10001';
\`\`\`

**1NF / 2NF / 3NF, side by side**

\`\`\`
1NF: every column atomic                          (no repeating groups)
2NF: every non-key column depends on the WHOLE key (no partial dependency)
3NF: every non-key column depends ONLY on the key  (no transitive dependency)
\`\`\`

**BCNF: the rare edge case 3NF misses**

\`\`\`
BCNF adds: for EVERY functional dependency X -> Y, X must be a candidate key
-- (3NF has a narrow exception for dependencies on a candidate key; BCNF closes it)
-- comes up only with overlapping composite candidate keys -- rare in ordinary schemas
\`\`\`

**In practice: 3NF is the destination for almost all OLTP schemas**

\`\`\`
"does this non-key column depend on the key, the whole key, and nothing but the key?"
                                                          -- a working definition of 3NF
\`\`\``,

    simpleHi: `**3NF violation: ek TRANSITIVE dependency (key → A → B, key → B seedhे nahi)**

\`\`\`sql
-- employee_id -> zip_code -> city  (city zip_code par depend karta hai, employee_id par seedhे NAHI)
CREATE TABLE emp_bad (employee_id int PRIMARY KEY, zip_code text, city text);
INSERT INTO emp_bad VALUES (1, '10001', 'New York'), (2, '10001', 'New York');

-- do employees, same zip, city duplicated -- aur ab wo chupchaap DRIFT APART ho sakte hain:
UPDATE emp_bad SET city = 'NYC' WHERE employee_id = 1;   -- employee 2 ki row ab GALAT hai
\`\`\`

**3NF fix: transitively-dependent fact ko us table mein le jao jispar ye ASAL MEIN depend karta hai**

\`\`\`sql
CREATE TABLE zip_city (zip_code text PRIMARY KEY, city text);
CREATE TABLE emp_good (employee_id int PRIMARY KEY, zip_code text REFERENCES zip_city(zip_code));
INSERT INTO zip_city VALUES ('10001', 'New York');
INSERT INTO emp_good VALUES (1, '10001'), (2, '10001');

-- ek row badalti hai, DONO employees join ke through correction dekhte hain -- koi drift nahi
UPDATE zip_city SET city = 'NYC' WHERE zip_code = '10001';
\`\`\`

**1NF / 2NF / 3NF, saath-saath**

\`\`\`
1NF: har column atomic                          (koi repeating groups nahi)
2NF: har non-key column POORI key par depend    (koi partial dependency nahi)
3NF: har non-key column SIRF key par depend      (koi transitive dependency nahi)
\`\`\`

**BCNF: wo rare edge case jo 3NF miss karta hai**

\`\`\`
BCNF add karta hai: HAR functional dependency X -> Y ke liye, X ek candidate key hona chahiye
-- (3NF ke paas ek candidate key par dependencies ke liye ek narrow exception hai; BCNF ise band karta hai)
-- sirf overlapping composite candidate keys ke saath aata hai -- ordinary schemas mein rare
\`\`\`

**Practice mein: 3NF lगभग sabhi OLTP schemas ki manzil hai**

\`\`\`
"kya ye non-key column key par depend karta hai, poori key par, aur key ke alawa kuch nahi par?"
                                                          -- 3NF ki ek working definition
\`\`\``,

    content: `## Third Normal Form (3NF)

A table is in 3NF when it is in 2NF **and** it has no **transitive dependency**: no non-key column depends on another non-key column instead of depending directly on the key.

A useful, informal restatement of all three forms together, attributed to Bill Kent: *"every non-key column must depend on the key, the whole key, and nothing but the key."*

- **1NF**: every column is atomic (no repeating groups).
- **2NF**: every non-key column depends on the **whole** key (no partial dependency — Lesson 3).
- **3NF**: every non-key column depends on **nothing but** the key (no transitive dependency — this lesson).

\`\`\`sql
-- employee_id -> zip_code -> city
CREATE TABLE emp_bad (employee_id int PRIMARY KEY, zip_code text, city text);
\`\`\`

Here \`city\` does depend (functionally) on \`employee_id\` — but only *because* \`employee_id\` determines \`zip_code\`, and \`zip_code\` determines \`city\`. It is a chain, \`employee_id → zip_code → city\`, not a direct dependency. \`city\` is really a fact about the *zip code*, stored redundantly on every employee who shares that zip code — the same anomaly shape as 2NF, just via a different mechanism (a non-key column determining another non-key column, rather than only part of the key determining one).

**Symptoms**, exactly parallel to 2NF's:

- **Update anomaly**: correcting the city name for a zip code means updating every employee row with that zip, and a partial update leaves the data internally inconsistent — some employees showing "New York", others "NYC" for the identical zip code.
- **Insert anomaly**: you cannot record that zip code 10001 maps to "New York" until at least one employee has that zip code.
- **Delete anomaly**: if the one employee with a rare zip code leaves, the fact "this zip code is in this city" disappears with them.

**The 3NF fix** is the same move as 2NF: extract the transitively-dependent column into its own table, keyed by the thing it actually depends on:

\`\`\`sql
CREATE TABLE zip_city (zip_code text PRIMARY KEY, city text);
CREATE TABLE emp_good (employee_id int PRIMARY KEY, zip_code text REFERENCES zip_city(zip_code));
\`\`\`

Now \`city\` is stored once per zip code, not once per employee. Correcting it is a single-row \`UPDATE\`, and every employee sees the correction via the join, with no possibility of drift between rows.

## Recognising a transitive dependency

The tell-tale sign: **two non-key columns where one determines the other**. If you can ask "given this column's value, is the *other* column's value forced?" and the answer is yes — and that "other column" is not itself part of the key — you have a transitive dependency. \`zip_code → city\`, \`product_id → product_category\` (if stored alongside an order line), \`postal_code → tax_rate\` are all classic examples.

## Boyce-Codd Normal Form (BCNF)

**BCNF** is a slightly stronger version of 3NF that closes a narrow gap. 3NF's precise definition has an exception clause: a transitive dependency \`X → Y\` is *allowed* if \`X\` happens to be a **candidate key** (a column or column-set that could itself serve as the primary key) — even if \`X\` is not the table's *chosen* primary key. BCNF removes that exception: it requires that for **every** functional dependency \`X → Y\` in the table, \`X\` must be a candidate key, full stop.

This distinction only bites in a narrow, specific situation: a table with **two or more overlapping candidate keys** that share a column. A commonly cited example: a table of (student, subject, teacher) where each student takes each subject with exactly one teacher, but each teacher teaches only one subject — creating a dependency \`teacher → subject\` that is not through the chosen key. This is a real but comparatively rare shape in ordinary application schemas; most OLTP designs never encounter a table that satisfies 3NF but fails BCNF.

**Practical guidance:** design for 3NF as the working target for almost every table you build. Learn BCNF's definition to recognise the theoretical distinction (it appears in academic contexts and some interview questions), but do not expect to hunt for BCNF violations in ordinary schema design — if you consistently ask "does every non-key column depend on the key, the whole key, and nothing but the key", you will already be at 3NF and BCNF gaps will be rare enough not to matter for the vast majority of designs.

## Diminishing returns beyond 3NF

Higher normal forms exist beyond BCNF (4NF, 5NF, dealing with independent multi-valued facts and join dependencies), but they address increasingly rare modeling situations. The practical progression for almost every real schema is: **1NF always, 2NF and 3NF as the working standard, BCNF as a concept to recognise, anything beyond that only if a specific, unusual anomaly demonstrates the need.**`,

    contentHi: `## Third Normal Form (3NF)

Ek table 3NF mein hai jab ye 2NF mein hai **aur** iske paas koi **transitive dependency** nahi hai: koi non-key column ek doosre non-key column par depend nahi karta seedhे key par depend karne ke bजाy.

Teenों forms ka ek informal restatement, Bill Kent ko attributed: *"har non-key column ko key par depend karna chahiye, poori key par, aur key ke alawa kuch nahi par."*

- **1NF**: har column atomic hai.
- **2NF**: har non-key column **poori** key par depend karta hai (Lesson 3).
- **3NF**: har non-key column **key ke alawa kuch nahi** par depend karta hai (ye lesson).

\`\`\`sql
-- employee_id -> zip_code -> city
CREATE TABLE emp_bad (employee_id int PRIMARY KEY, zip_code text, city text);
\`\`\`

Yahaan \`city\` sach mein \`employee_id\` par depend karta hai — par sirf isliye *kyunki* \`employee_id\` \`zip_code\` determine karta hai, aur \`zip_code\` \`city\` determine karta hai. Ye ek chain hai, direct dependency nahi. \`city\` asal mein *zip code* ke baare mein ek fact hai, us zip code share karne waale har employee par redundantly stored.

**Symptoms**, 2NF ke exactly parallel:
- **Update anomaly**: zip code ke liye city name correct karna matlab us zip waali har employee row update karna.
- **Insert anomaly**: aap record nahi kar sakte ki zip 10001 "New York" hai jab tak kam se kam ek employee ke paas wo zip nahi.
- **Delete anomaly**: rare zip code waala ek employee chala jaता hai to "ye zip code is city mein hai" fact bhi chala jaता hai.

**3NF fix** wahi move hai jo 2NF: transitively-dependent column ko apni table mein extract karo, us cheez se keyed jispar ye asal mein depend karta hai:

\`\`\`sql
CREATE TABLE zip_city (zip_code text PRIMARY KEY, city text);
CREATE TABLE emp_good (employee_id int PRIMARY KEY, zip_code text REFERENCES zip_city(zip_code));
\`\`\`

## Ek transitive dependency pehchanna

Tell-tale sign: **do non-key columns jahaan ek doosre ko determine karta hai**. Agar aap pooch sakte ho "is column ki value dekhkar, kya doosre column ki value force hoती hai?" aur jawab haan hai — aur wo "doosra column" khud key ka hissa nahi hai — aapke paas ek transitive dependency hai.

## Boyce-Codd Normal Form (BCNF)

**BCNF** 3NF ka ek thoda strong version hai jo ek narrow gap band karta hai. 3NF ki precise definition mein ek exception clause hai: ek transitive dependency \`X → Y\` *allowed* hai agar \`X\` ek **candidate key** nikлता hai — chahे \`X\` table ki *chuni gayi* primary key na ho. BCNF wo exception hataता hai: ise chahiye ki table mein **har** functional dependency \`X → Y\` ke liye, \`X\` ek candidate key ho, poori tarah.

Ye distinction sirf ek narrow, specific situation mein bite karta hai: ek table jiske **do ya zyada overlapping candidate keys** hain jo ek column share karते hain. Ye ordinary application schemas mein ek real par comparatively rare shape hai.

**Practical guidance:** lगभग har table ke liye 3NF ko working target ke roop mein design karo. BCNF ki definition seekho theoretical distinction pehchanने ke liye, par ordinary schema design mein BCNF violations dhoondने ki umeed mat rakhो.

## 3NF se aage diminishing returns

BCNF se aage higher normal forms exist karते hain (4NF, 5NF), par wo badते hue rare modeling situations address karте hain. Lगभग har real schema ke liye practical progression: **1NF hamesha, 2NF aur 3NF working standard ke roop mein, BCNF ek concept ke roop mein pehchanने layak, iske aage kuch bhi sirf tab jab ek specific, unusual anomaly zaroorat demonstrate kare.**`,

    examples: [
      {
        title: '3NF violation: city drifts out of sync because it is stored redundantly',
        titleHi: '3NF violation: city redundantly stored hone ki wajah se sync se bahar drift hoती hai',
        code: `CREATE TABLE emp_bad (employee_id int PRIMARY KEY, zip_code text, city text);
INSERT INTO emp_bad VALUES (1, '10001', 'New York'), (2, '10001', 'New York');

-- correcting the city for employee 1 only -- employee 2 is now silently WRONG
UPDATE emp_bad SET city = 'NYC' WHERE employee_id = 1;
SELECT * FROM emp_bad ORDER BY employee_id;`,
        output: ` employee_id | zip_code | city
-------------+----------+----------
 1           | 10001    | NYC
 2           | 10001    | New York
(2 rows)`,
        explain: "`emp_bad` stores `city` redundantly, once per employee, even though `city` really depends on `zip_code`, not on `employee_id` directly (a transitive dependency: employee_id -> zip_code -> city). Correcting employee 1's city to 'NYC' leaves employee 2 still showing 'New York' for the IDENTICAL zip code 10001 — the two rows have silently drifted out of sync, which is exactly the anomaly a transitive dependency produces.",
        explainHi: "`emp_bad` `city` ko redundantly store karta hai, prati employee ek baar, chahe `city` asal mein `zip_code` par depend karta hai, `employee_id` par seedhe nahi (ek transitive dependency: employee_id -> zip_code -> city). Employee 1 ki city ko 'NYC' correct karna employee 2 ko abhi bhi IDENTICAL zip code 10001 ke liye 'New York' dikhata hue chhod deta hai — dono rows chupchaap sync se bahar drift ho gayi hain.",
      },
      {
        title: '3NF fix: city lives once per zip code, both employees see the correction',
        titleHi: '3NF fix: city prati zip code ek baar rehta hai, dono employees correction dekhte hain',
        code: `CREATE TABLE zip_city (zip_code text PRIMARY KEY, city text);
CREATE TABLE emp_good (employee_id int PRIMARY KEY, zip_code text REFERENCES zip_city(zip_code));
INSERT INTO zip_city VALUES ('10001', 'New York');
INSERT INTO emp_good VALUES (1, '10001'), (2, '10001');

-- ONE row changes; there is no second copy left to drift out of sync
UPDATE zip_city SET city = 'NYC' WHERE zip_code = '10001';

SELECT e.employee_id, z.city
FROM emp_good e JOIN zip_city z ON z.zip_code = e.zip_code
ORDER BY e.employee_id;`,
        output: ` employee_id | city
-------------+------
 1           | NYC
 2           | NYC
(2 rows)`,
        explain: 'Moving `city` into its own `zip_city` table, keyed by `zip_code` alone, removes the transitive dependency: `city` is now stored exactly ONCE per zip code, not once per employee. The single `UPDATE` on `zip_city` is visible to BOTH employees through the join — there is no second copy left anywhere to drift out of sync.',
        explainHi: '`city` ko apni `zip_city` table mein le jाना, sirf `zip_code` se keyed, transitive dependency hataता hai: `city` ab prati zip code THEEK EK BAAR stored hai, prati employee ek baar nahi. `zip_city` par single `UPDATE` join ke through DONO employees ko visible hai — sync se drift karne ke liye kahin koi doosri copy nahi bachi.',
      },
      {
        title: 'Spotting the transitive dependency: two non-key columns, one determines the other',
        titleHi: 'Transitive dependency pehchanna: do non-key columns, ek doosre ko determine karta hai',
        code: `CREATE TABLE order_line_bad (order_id int, product_id int, product_category text, qty int,
                             PRIMARY KEY (order_id, product_id));
INSERT INTO order_line_bad VALUES (1, 55, 'Electronics', 2), (2, 55, 'Electronics', 1);
-- product_id -> product_category is a transitive dependency: category depends on the
-- PRODUCT, not on the order it appears in -- it will be duplicated once per order line
SELECT DISTINCT product_id, product_category FROM order_line_bad;`,
        output: ` product_id | product_category
------------+------------------
 55         | Electronics
(1 row)`,
        explain: "`product_id -> product_category` is a transitive dependency: knowing the product tells you its category unambiguously, and this has nothing to do with which order it appears in. Both order lines for product 55 agree on 'Electronics' here only because no update has happened yet — but because the fact is duplicated per order line, nothing stops the two rows from drifting apart the way the employee/city example did.",
        explainHi: "`product_id -> product_category` ek transitive dependency hai: product jaanna aapko iski category unambiguously batata hai, aur is baat se koi lena-dena nahi ki ye kaunse order mein aata hai. Product 55 ki dono order lines yahaan 'Electronics' par agree karti hain sirf isliye kyunki abhi tak koi update nahi hua — par kyunki fact prati order line duplicated hai, kuch bhi dono rows ko employee/city example ki tarah drift apart hone se nahi rokता.",
      },
    ],

    mistakes: [
      {
        wrong: `-- an "employee" table that also carries the department's budget and manager name
CREATE TABLE employee_bad (id int PRIMARY KEY, name text, dept_id int,
                           dept_budget int, dept_manager text);
-- dept_id -> dept_budget, dept_id -> dept_manager: BOTH are transitive dependencies`,
        right: `CREATE TABLE department (id int PRIMARY KEY, budget int, manager_name text);
CREATE TABLE employee_good (id int PRIMARY KEY, name text, dept_id int REFERENCES department(id));`,
        why: 'Both dept_budget and dept_manager are facts about the department, not about the individual employee: every employee in the same department would carry an identical copy of both values. That is two separate transitive dependencies riding on the same employee_bad table, and correcting a department\'s budget after a reorg would require finding and updating every employee row in that department rather than one department row. The fix separates facts that belong to the department, moved into their own department table keyed by dept_id, from facts that belong to the employee, which stays in employee_good referencing the department by its key.',
        whyHi: '`dept_budget` aur `dept_manager` dono department ke baare mein facts hain, individual employee ke baare mein nahi: usी department ke har employee ke paas dono values ki ek identical copy hoती. Wo do alag transitive dependencies hain usी `employee_bad` table par sawаar. Fix un facts ko separate karta hai jo department ke hain, apni department table mein le jaकर, un facts se jo employee ke hain.',
      },
      {
        wrong: `-- storing a calculated/derived value that depends on another non-key column
CREATE TABLE order_bad (id int PRIMARY KEY, subtotal int, tax_rate numeric, tax_amount int);
-- tax_amount = subtotal * tax_rate -- a transitive-like dependency on OTHER columns in the same row
-- edit subtotal or tax_rate later and tax_amount silently goes stale`,
        right: `CREATE TABLE order_good (id int PRIMARY KEY, subtotal int, tax_rate numeric);
-- compute tax_amount in a query (or a GENERATED column) instead of storing a value
-- that can drift out of sync with the inputs it was computed from
SELECT id, subtotal, tax_rate, subtotal * tax_rate AS tax_amount FROM order_good;`,
        why: 'Storing a value that is entirely derivable from other columns in the same row is a close cousin of a transitive dependency: tax_amount does not need its own storage because it is completely determined by subtotal and tax_rate, and storing it separately creates a second copy of information that can drift out of sync the moment either input changes without someone remembering to recompute the derived column too. The fix is to compute it at query time, or, if it must be persisted for performance or auditing reasons, use a GENERATED column (Module 8) so the database itself guarantees it can never disagree with its inputs, rather than trusting every writer to keep it updated by hand.',
        whyHi: 'Ek value store karna jo poori tarah usi row ke doosre columns se derivable hai ek transitive dependency ka close cousin hai: `tax_amount` ko apna storage nahi chahiye kyunki ye poori tarah `subtotal` aur `tax_rate` se determined hai. Fix isे query time par compute karna hai, ya, agar isе persist karna zaroori hai, ek `GENERATED` column (Module 8) istemal karo.',
      },
      {
        wrong: `-- confusing "any functional dependency" with "a transitive one" -- over-normalizing a direct key dependency
CREATE TABLE order_meta (id int PRIMARY KEY);
CREATE TABLE order_total_table (order_id int PRIMARY KEY REFERENCES order_meta(id), total int);
-- splitting off "total" into its own table because "id -> total is a dependency"
-- this is a direct key dependency, NOT transitive -- there was nothing to fix here`,
        right: `CREATE TABLE orders (id int PRIMARY KEY, total int);
-- id -> total is exactly the kind of dependency a table is SUPPOSED to have: a
-- non-key column depending directly on the primary key. That is not a violation.`,
        why: 'Every non-key column in a normalized table is expected to functionally depend on the primary key, directly, with nothing in between; that dependency is not a defect, it is the entire point of having a primary key at all. A transitive dependency specifically means the chain passes through another non-key column, key to A to B, not key directly to B. Splitting a table that already satisfies key to non-key column directly, like id to total, into two tables joined one-to-one adds an unnecessary join for no normalization benefit: there was no redundancy to remove and no anomaly being prevented. Recognising 3NF violations requires checking specifically for a non-key column determining another non-key column, not simply any column depending on the key, which is the normal and desired shape.',
        whyHi: 'Ek normalized table mein har non-key column ka primary key par directly functionally depend karna expected hai, beech mein kuch bhi na hote hue; wo dependency ek defect nahi hai, ye poori tarah primary key rakhne ka point hai. Ek transitive dependency specifically matlab chain ek doosre non-key column se guzarti hai, key se A se B, key se seedhe B nahi. Ek table ko split karna jo pehle se key-se-non-key-column-directly satisfy karti hai, do tables mein ek-se-ek joined, ek unnecessary join add karta hai bina kisi normalization benefit ke.',
      },
    ],

    realWorld: [
      {
        en: '**A `zip_code -> city/state` lookup table shared across `customer`, `employee`, and `warehouse`** — one correction to a zip code\'s city propagates everywhere it is referenced, instead of three separate `UPDATE` scripts.',
        hi: '**`customer`, `employee`, aur `warehouse` ke across shared ek `zip_code -> city/state` lookup table** — ek correction har jagah propagate karta hai.',
      },
      {
        en: '**A schema review flagging `dept_manager_name` stored on every `employee` row** as a transitive dependency, moved to `department`, catching a bug where two employees in the same department showed different manager names after a partial update.',
        hi: '**Ek schema review jo har `employee` row par stored `dept_manager_name` ko flag karta hai** ek transitive dependency ke roop mein.',
      },
      {
        en: '**A `GENERATED ALWAYS AS (subtotal * tax_rate) STORED` column instead of a manually-maintained `tax_amount`** — the database guarantees the derived value can never drift from its inputs.',
        hi: '**Ek `GENERATED ALWAYS AS (subtotal * tax_rate) STORED` column ek manually-maintained `tax_amount` ke bajaye** — database guarantee karta hai ki derived value apne inputs se kabhi drift nahi ho sakti.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a transitive dependency, and how does Third Normal Form eliminate it?',
        qHi: 'Ek transitive dependency kya hai, aur Third Normal Form ise kaise eliminate karta hai?',
        a: 'A transitive dependency exists when a non-key column depends on the primary key only indirectly, through another non-key column, rather than depending on the key directly. The classic example is a table keyed by employee id that also stores zip code and city: city genuinely varies with employee id, but only because employee id determines zip code and zip code in turn determines city, a chain, key to zip code to city, rather than key directly to city. Third normal form requires that every non-key column depend on nothing but the key, which rules this out. The practical symptom is the same shape of redundancy seen in second normal form violations: the city name is duplicated for every employee who happens to share that zip code, so correcting it means finding and updating every affected employee row, and a partial update leaves some employees showing one city and others showing a different one for the identical zip code. The fix follows the same pattern as fixing a partial dependency: extract the transitively-dependent column into its own table keyed by the thing it actually depends on, here a zip-to-city lookup table keyed by zip code, and reference it by foreign key from the employee table. After the fix, the city is stored exactly once per zip code, and a correction is a single-row update visible to every employee through the join.',
        aHi: 'Ek transitive dependency tab exist karti hai jab ek non-key column primary key par sirf indirectly depend karta hai, ek doosre non-key column ke through, key par directly depend karne ke bajaye. Classic example ek table hai employee id se keyed jo zip code aur city bhi store karti hai: city genuinely employee id ke saath badalti hai, par sirf isliye kyunki employee id zip code determine karta hai aur zip code city determine karta hai, ek chain, key se zip code se city, key se directly city nahi. Third normal form maangta hai ki har non-key column key ke alawa kuch nahi par depend kare. Fix wahi pattern follow karta hai jo partial dependency fix karne ka hai: transitively-dependent column ko apni table mein extract karo.',
      },
      {
        q: 'What does BCNF add beyond 3NF, and how common is the situation it addresses?',
        qHi: 'BCNF 3NF se aage kya add karta hai, aur ye jo situation address karta hai kितनी common hai?',
        a: 'Third normal form\'s formal definition has a specific exception: a dependency X determines Y is tolerated if X happens to be a candidate key, some column or set of columns that could itself have served as the primary key, even if it is not the one actually chosen. Boyce-Codd normal form removes that exception entirely: it demands that for every functional dependency in the table, the determining side must be a candidate key, no exceptions. This distinction only becomes relevant in a narrow, specific situation, a table with two or more overlapping candidate keys that share a column, and it is genuinely rare in ordinary application schemas built around single-column surrogate primary keys. A commonly used textbook example involves students, subjects, and teachers where each student-subject pair has exactly one teacher but each teacher only ever teaches one subject, which creates an odd dependency structure that satisfies third normal form yet still permits a form of redundancy that BCNF would remove. In practice, the working recommendation is to design for third normal form as the everyday target, understand BCNF well enough to recognize the theoretical distinction when it comes up, but not to spend design effort hunting for BCNF violations in ordinary business schemas, since tables satisfying 3NF but failing BCNF are uncommon outside of these specific overlapping-key scenarios.',
        aHi: 'Third normal form ki formal definition mein ek specific exception hai: ek dependency X determines Y tolerate ki jaati hai agar X ek candidate key nikлे, chahe ye actually chuni gayi na ho. Boyce-Codd normal form wo exception poori tarah hataता hai: ye maangta hai ki table mein har functional dependency ke liye, determining side ek candidate key hona chahiye, koi exception nahi. Ye distinction sirf ek narrow, specific situation mein relevant banti hai, ek table jiske do ya zyada overlapping candidate keys hain jo ek column share karте hain. Practice mein, working recommendation third normal form ke liye design karna hai everyday target ke roop mein, BCNF ko theek se samajhna par ordinary business schemas mein BCNF violations dhoondне mein design effort na lagana.',
      },
    ],

    exercises: [
      {
        task: 'Table `product_bad(id int PRIMARY KEY, name text, supplier_id int, supplier_name text, supplier_country text)` where `supplier_name`/`supplier_country` repeat for every product from the same supplier. Identify the transitive dependency and redesign into `supplier(id, name, country)` + `product(id, name, supplier_id)`.',
        taskHi: 'Table `product_bad(id, name, supplier_id, supplier_name, supplier_country)` jahaan `supplier_name`/`supplier_country` usi supplier ke har product ke liye repeat hote hain.',
        hint: '`supplier_id -> supplier_name` and `supplier_id -> supplier_country` are both transitive dependencies (through supplier_id, not through product id directly). Move both to a `supplier` table.',
        hintHi: '`supplier_id -> supplier_name` aur `supplier_id -> supplier_country` dono transitive dependencies hain. Dono ko ek `supplier` table mein le jao.',
      },
      {
        task: 'Table `booking_bad(id int PRIMARY KEY, room_number int, hotel_name text, hotel_city text)`. Two bookings for the same `room_number` at the same hotel currently duplicate `hotel_name`/`hotel_city`. Redesign into a `hotel` table plus a slim `booking` table, then confirm renaming the hotel is a single-row update.',
        taskHi: 'Table `booking_bad(id, room_number, hotel_name, hotel_city)`. Usi hotel ke same `room_number` ke liye do bookings abhi `hotel_name`/`hotel_city` duplicate karti hain.',
        hint: 'You need a `hotel_id` to link bookings to a `hotel` table, since `room_number` alone does not identify which hotel. `hotel(id, name, city)` + `booking(id, room_number, hotel_id)`.',
        hintHi: 'Aapko ek `hotel_id` chahiye bookings ko `hotel` table se link karne ke liye, kyunki akela `room_number` ye identify nahi karta ki kaunsa hotel.',
      },
      {
        task: 'Table `payment(id int PRIMARY KEY, amount int, currency text, amount_usd int)` where `amount_usd` is computed from `amount` and `currency` at insert time and can go stale if `amount` is later corrected. Rewrite the query to compute `amount_usd` on the fly instead of trusting the stored column, given a `fx_rate(currency, rate)` table.',
        taskHi: 'Table `payment(id, amount, currency, amount_usd)` jahaan `amount_usd` insert time par `amount` aur `currency` se compute hota hai aur stale ho sakta hai. Query ko `amount_usd` on-the-fly compute karne ke liye rewrite karo.',
        hint: '`SELECT p.id, p.amount, p.currency, p.amount * f.rate AS amount_usd FROM payment p JOIN fx_rate f ON f.currency = p.currency` — always current, never drifts from the inputs.',
        hintHi: '`SELECT p.id, p.amount, p.currency, p.amount * f.rate AS amount_usd FROM payment p JOIN fx_rate f ON f.currency = p.currency` — hamesha current, inputs se kabhi drift nahi.',
      },
    ],

    keyTakeaways: [
      '3NF = 2NF + no TRANSITIVE dependency: no non-key column depends on ANOTHER non-key column instead of depending directly on the key. Kent\'s summary of all three: "every non-key column depends on the key, the WHOLE key, and NOTHING BUT the key" (1NF/2NF/3NF respectively).',
      'Classic example: `employee_id -> zip_code -> city` — `city` depends on `employee_id` only THROUGH `zip_code`, not directly. Same anomaly shape as 2NF (update/insert/delete anomalies) via a different mechanism: a non-key column determining another non-key column.',
      'RECOGNISE it by asking: "given this non-key column\'s value, is another non-key column\'s value forced?" If yes, and that other column isn\'t part of the key, it\'s transitive. Classic examples: `zip_code -> city`, `product_id -> category`, `postal_code -> tax_rate`.',
      '3NF FIX = same move as 2NF: extract the transitively-dependent column into its OWN table, keyed by what it actually depends on (`city` -> a `zip_city` table keyed by `zip_code`). Correcting it becomes ONE row, and every referencing row sees it via the join — no drift possible.',
      'A derived/computed column stored redundantly (`tax_amount` alongside `subtotal`/`tax_rate`) is a close cousin — it can go stale when the inputs change. Compute at query time, or use a `GENERATED` column (Module 8) so the DB guarantees it never disagrees with its inputs.',
      'BCNF adds: for EVERY functional dependency `X -> Y`, `X` must be a candidate key (3NF has a narrow exception when `X` is A candidate key but not the chosen PK). Only bites with OVERLAPPING composite candidate keys — rare in ordinary schemas built on single-column surrogate PKs.',
      'PRACTICAL TARGET: design for 3NF on almost every table. Know BCNF\'s definition to recognise it, but don\'t hunt for BCNF violations in ordinary schemas. Don\'t confuse "any column depends on the key" (expected, desired) with "transitive dependency" (a non-key column depends on ANOTHER non-key column) — over-normalizing a direct key dependency adds a needless join for zero benefit.',
    ],
    keyTakeawaysHi: [
      '3NF = 2NF + koi TRANSITIVE dependency nahi: koi non-key column ek DOOSRE non-key column par depend nahi karta seedhe key par depend karne ke bajaye. Kent ka teenon ka summary: "har non-key column key par depend karta hai, POORI key par, aur key KE ALAWA KUCH NAHI par".',
      'Classic example: `employee_id -> zip_code -> city` — `city` `employee_id` par SIRF `zip_code` KE THROUGH depend karta hai, seedhe nahi. 2NF jaisa hi anomaly shape ek alag mechanism se: ek non-key column doosre non-key column ko determine karta hai.',
      'ISE pehchano ye pooch kar: "is non-key column ki value dekhkar, kya doosre non-key column ki value force hoti hai?" Agar haan, aur wo doosra column key ka hissa nahi hai, ye transitive hai.',
      '3NF FIX = 2NF jaisa hi move: transitively-dependent column ko apni table mein extract karo, us cheez se keyed jispar ye asal mein depend karta hai. Ise correct karna EK row ban jaata hai, aur har referencing row ise join ke through dekhti hai.',
      'Ek derived/computed column jo redundantly store hota hai (`tax_amount` `subtotal`/`tax_rate` ke saath) ek close cousin hai — inputs badalne par stale ho sakta hai. Query time par compute karo, ya ek `GENERATED` column (Module 8) istemal karo.',
      'BCNF add karta hai: HAR functional dependency `X -> Y` ke liye, `X` ek candidate key hona chahiye. Sirf OVERLAPPING composite candidate keys ke saath bite karta hai — ordinary schemas mein rare.',
      'PRACTICAL TARGET: lगभग har table ke liye 3NF design karo. "Koi bhi column key par depend karta hai" (expected, desired) ko "transitive dependency" (ek non-key column DOOSRE non-key column par depend karta hai) se confuse mat karo.',
    ],
  },

  {
    slug: 'sql-modeling-relationships',
    title: 'Modeling Relationships: 1:N, M:N, 1:1, Self-Referencing',
    titleHi: 'Relationships Modeling: 1:N, M:N, 1:1, Self-Referencing',
    description: 'Every relationship between two entities is one of four shapes. One-to-many: a foreign key on the "many" side. Many-to-many: a junction table with a foreign key to each side. One-to-one: a foreign key with a UNIQUE constraint. Self-referencing: a foreign key pointing back at its own table.',
    descriptionHi: 'Do entities ke beech har relationship in chaar shapes mein se ek hai. One-to-many: "many" side par ek foreign key. Many-to-many: har side ke liye ek foreign key waali ek junction table. One-to-one: ek `UNIQUE` constraint waali ek foreign key. Self-referencing: apni hi table ki taraf point karti ek foreign key.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Four different ways two departments in a company hand paperwork to each other.** One-to-many is a single mailbox rule: every memo from the payroll department names exactly one employee, so you write the employee\'s ID directly on the memo (a foreign key on the "many" side — the memo, which is the many, points at the one employee). Many-to-many is trickier: a single employee can be assigned to several projects, and a single project has several employees — neither side can hold a single ID for the other, so the company invents a separate "assignment slip" whose entire job is to pair one employee with one project (a junction table, existing solely to record the pairing). One-to-one is a special mailbox rule where each employee gets *exactly* one desk and each desk holds *exactly* one employee — you could write it either direction, but you additionally promise "no employee gets two desks, no desk gets two employees" (a foreign key with an extra uniqueness promise). Self-referencing is a memo that names another employee *of the same kind* — "reports to" written on an employee\'s own file, pointing at another row in the very same employee file cabinet.',
      hi: '**Ek company mein do departments ek doosre ko paperwork sौंpने ke chaar alag tarike.** One-to-many ek single mailbox rule hai: payroll department se har memo theek ek employee ko naam deta hai, to aap memo par seedhे employee ki ID likhte ho (many side par ek foreign key — memo, jo many hai, ek employee ki taraf point karta hai). Many-to-many trickier hai: ek single employee kई projects mein assign ho sakta hai, aur ek single project ke kई employees hain — koi bhi side doosre ke liye ek single ID nahi rakh sakta, to company ek alag "assignment slip" invent karti hai jiska poora kaam ek employee ko ek project se pair karna hai (ek junction table, sirf pairing record karne ke liye maujood). One-to-one ek special mailbox rule hai jahaan har employee ko *theek* ek desk milta hai aur har desk *theek* ek employee rakhता hai — aap ise kisi bhi direction likh sakte ho, par aap additionally promise karte ho "koi employee do desks nahi paata, koi desk do employees nahi paata" (ek foreign key ek extra uniqueness promise ke saath). Self-referencing ek memo hai jo *usी tarah ke* ek aur employee ko naam deta hai — ek employee ki apni file par "reports to" likha hua, usी employee file cabinet ki ek aur row ki taraf point karte hue.',
    },

    simple: `**One-to-many: the foreign key goes on the "many" side**

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
-- ONE author writes MANY books -- author_id lives on "book" (the many side), not on "author"
\`\`\`

**Many-to-many: a junction table, foreign keys to BOTH sides**

\`\`\`sql
CREATE TABLE student (id int PRIMARY KEY);
CREATE TABLE course (id int PRIMARY KEY);
CREATE TABLE enrollment (
  student_id int REFERENCES student(id),
  course_id  int REFERENCES course(id),
  PRIMARY KEY (student_id, course_id)   -- composite key: a pair enrolls at most once
);
\`\`\`

**One-to-one: a foreign key PLUS a \`UNIQUE\` constraint**

\`\`\`sql
CREATE TABLE employee (id int PRIMARY KEY);
CREATE TABLE employee_profile (
  employee_id int PRIMARY KEY REFERENCES employee(id)   -- PK doubles as the UNIQUE + FK
);
-- PRIMARY KEY on the FK column itself is the idiomatic 1:1 pattern
\`\`\`

**Self-referencing: a table's FK points back at its own rows**

\`\`\`sql
CREATE TABLE employee2 (id int PRIMARY KEY, name text, manager_id int REFERENCES employee2(id));
-- manager_id, if not NULL, must be the id of another row in THIS SAME table
\`\`\`

**Which shape? Ask two questions**

\`\`\`
"can ONE X have MANY Y, but each Y has only ONE X?"     -> one-to-many
"can ONE X have MANY Y, AND one Y have MANY X?"          -> many-to-many (junction table)
"does each X have AT MOST ONE Y, and vice versa?"        -> one-to-one
"does X relate to ANOTHER ROW OF THE SAME TABLE?"        -> self-referencing
\`\`\``,

    simpleHi: `**One-to-many: foreign key "many" side par jaati hai**

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
-- EK author MANY books likhta hai -- author_id "book" (many side) par rehta hai, "author" par nahi
\`\`\`

**Many-to-many: ek junction table, DONO sides ke liye foreign keys**

\`\`\`sql
CREATE TABLE student (id int PRIMARY KEY);
CREATE TABLE course (id int PRIMARY KEY);
CREATE TABLE enrollment (
  student_id int REFERENCES student(id),
  course_id  int REFERENCES course(id),
  PRIMARY KEY (student_id, course_id)   -- composite key: ek jodi zyada se zyada ek baar enroll
);
\`\`\`

**One-to-one: ek foreign key PLUS ek \`UNIQUE\` constraint**

\`\`\`sql
CREATE TABLE employee (id int PRIMARY KEY);
CREATE TABLE employee_profile (
  employee_id int PRIMARY KEY REFERENCES employee(id)   -- PK khud UNIQUE + FK dono hai
);
\`\`\`

**Self-referencing: ek table ka FK apni hi rows ki taraf point karta hai**

\`\`\`sql
CREATE TABLE employee2 (id int PRIMARY KEY, name text, manager_id int REFERENCES employee2(id));
-- manager_id, agar NULL nahi, USI SAME table ki ek aur row ka id hona chahiye
\`\`\`

**Kaunsa shape? Do sawaal poochho**

\`\`\`
"kya EK X ke MANY Y ho sakte hain, par har Y ka sirf EK X hai?"   -> one-to-many
"kya EK X ke MANY Y ho sakte hain, AUR ek Y ke MANY X?"           -> many-to-many (junction table)
"kya har X ka ZYADA SE ZYADA EK Y hai, aur ulta?"                 -> one-to-one
"kya X USI TABLE KI EK AUR ROW se related hai?"                   -> self-referencing
\`\`\``,

    content: `## The four relationship shapes

Every relationship between two entities reduces to one of four cardinalities, and each has a standard schema pattern.

### One-to-many (1:N)

The most common shape: one row of table A relates to many rows of table B, but each row of B relates to only one row of A. **The foreign key goes on the "many" side** — B holds a column referencing A.

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
\`\`\`

One author, many books; \`book.author_id\` points at exactly one author. Putting the FK anywhere else (say, a list of book ids on \`author\`) would violate 1NF (Lesson 3) — you would be back to a repeating group.

### Many-to-many (M:N)

Neither side can hold a single foreign key to the other, because both sides can have multiple matches. The standard solution is a **junction table** (also "join table", "associative table", "bridge table"): a table whose only job is to hold pairs, one foreign key to each side.

\`\`\`sql
CREATE TABLE student (id int PRIMARY KEY);
CREATE TABLE course (id int PRIMARY KEY);
CREATE TABLE enrollment (
  student_id int REFERENCES student(id),
  course_id  int REFERENCES course(id),
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

The composite primary key \`(student_id, course_id)\` both identifies each enrollment row and enforces "a student enrolls in a given course at most once" for free. A junction table can carry its own attributes too — \`enrollment.grade\` is a fact about the *pairing itself*, not about the student or the course alone (this is exactly the 2NF discussion from Lesson 3).

### One-to-one (1:1)

Each row of A relates to at most one row of B, and vice versa. Modeled as a foreign key **plus a uniqueness guarantee** — without the uniqueness constraint, it would just be a 1:N relationship that happens to have one child per parent today.

\`\`\`sql
CREATE TABLE employee (id int PRIMARY KEY, name text);
CREATE TABLE employee_profile (
  employee_id int PRIMARY KEY REFERENCES employee(id),   -- PK enforces the 1:1 uniqueness
  bio text
);
\`\`\`

Making the foreign key column *itself* the primary key of the child table is the idiomatic pattern: it is automatically unique (no employee has two profiles) and automatically indexed. One-to-one relationships usually exist to split a wide, rarely-needed set of columns off a heavily-queried table (a "profile" or "extended details" table joined in only when needed), or to model optional/exclusive sub-types (Lesson 6's polymorphic association touches on this).

### Self-referencing

A table's foreign key points back at its **own** primary key — modeling a relationship between two instances of the *same* entity type.

\`\`\`sql
CREATE TABLE employee2 (id int PRIMARY KEY, name text, manager_id int REFERENCES employee2(id));
\`\`\`

This is how hierarchies (org charts, category trees — Module 3 and Module 5's recursive CTEs) and self-relationships (a "blocked user" list, a "friend" relationship between two users of a \`user\` table) are modeled. It can be one-to-many (many employees share one manager: this example) or many-to-many (a "friends" relationship between users needs its own junction table, since friendship is symmetric and any user can have many friends).

## A worked decision process

Given two entities, ask in order:

1. **Can an instance of A relate to more than one instance of B, or vice versa?** If neither can, it is 1:1. If exactly one side can ("many"), it is 1:N. If both sides can, it is M:N.
2. **Is this actually two entities, or one entity relating to itself?** If the "two sides" are really the same kind of thing (employees, categories, users), it is self-referencing — apply the same 1:N/M:N logic to that single table.
3. **Does the relationship itself carry data** (an enrollment's grade, a friendship's "since" date)? If so, the junction table (for M:N) or the foreign-key-holding table (for 1:N) is exactly where that data belongs — it is a fact about the *relationship*, not about either entity alone.

## Why this matters beyond correctness

Getting the relationship shape wrong is expensive to fix later: a 1:N modeled as 1:1 (a foreign key with no uniqueness enforced, accidentally allowing what should be exclusive) silently permits duplicate data; an M:N modeled as 1:N (a single FK column trying to hold "the one course" for a student who is actually enrolled in several) forces awkward workarounds like comma-separated ids (straight back to a 1NF violation, Lesson 3). Getting the cardinality right at the ER-modeling stage (Lesson 1) is cheaper than migrating a live table's relationship shape later.`,

    contentHi: `## Chaar relationship shapes

Do entities ke beech har relationship chaar cardinalities mein se ek tak reduce hoती hai, aur har ek ka ek standard schema pattern hai.

### One-to-many (1:N)

Sabse common shape: table A ki ek row table B ki kई rows se related hai, par B ki har row A ki sirf ek row se related hai. **Foreign key "many" side par jaati hai** — B ek column rakhta hai jo A ko reference karta hai.

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
\`\`\`

### Many-to-many (M:N)

Koi bhi side doosre ke liye ek single foreign key nahi rakh sakta, kyunki dono sides ke kई matches ho sakते hain. Standard solution ek **junction table** hai: ek table jiska sirf kaam pairs rakhна hai, har side ke liye ek foreign key.

\`\`\`sql
CREATE TABLE student (id int PRIMARY KEY);
CREATE TABLE course (id int PRIMARY KEY);
CREATE TABLE enrollment (
  student_id int REFERENCES student(id),
  course_id  int REFERENCES course(id),
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

Composite primary key \`(student_id, course_id)\` dono har enrollment row identify karta hai aur "ek student ek diye course mein zyada se zyada ek baar enroll" free mein enforce karta hai.

### One-to-one (1:1)

A ki har row B ki zyada se zyada ek row se related hai, aur ulta. Ek foreign key **plus ek uniqueness guarantee** ke roop mein modeled — uniqueness constraint ke bina, ye bस ek 1:N relationship hoga jismein aaj prati parent ek child hai.

\`\`\`sql
CREATE TABLE employee (id int PRIMARY KEY, name text);
CREATE TABLE employee_profile (
  employee_id int PRIMARY KEY REFERENCES employee(id),
  bio text
);
\`\`\`

Foreign key column ko *khud* child table ki primary key banана idiomatic pattern hai.

### Self-referencing

Ek table ki foreign key apni **hi** primary key ki taraf point karti hai — *usी* entity type ke do instances ke beech ek relationship modeling.

\`\`\`sql
CREATE TABLE employee2 (id int PRIMARY KEY, name text, manager_id int REFERENCES employee2(id));
\`\`\`

Ye theek hierarchies aur self-relationships model karne ka tarika hai. Ye one-to-many ho sakта hai (kई employees ek manager share karте hain) ya many-to-many (users ke beech ek "friends" relationship ko apni junction table chahiye).

## Ek worked decision process

Do entities diye jाने par, order mein poochो:
1. **Kya A ka ek instance B ke ek se zyada instances se related ho sakta hai, ya ulta?** Agar koi bhi nahi, ye 1:1 hai. Agar theek ek side ("many"), ye 1:N hai. Agar dono, ye M:N hai.
2. **Kya ye asal mein do entities hain, ya ek entity khud se related hai?** Self-referencing.
3. **Kya relationship khud data le jाती hai?** Agar haan, junction table (M:N ke liye) ya foreign-key-holding table (1:N ke liye) theek wahi jagah hai jahaan wo data belong karta hai.

## Ye correctness se pare kyun maayne rakhta hai

Relationship shape galat karna baad mein fix karna mehnga hai: ek 1:N ko 1:1 model karna chupchaap duplicate data allow karta hai; ek M:N ko 1:N model karna comma-separated ids jaise awkward workarounds force karta hai (seedhे ek 1NF violation par wapas, Lesson 3).`,

    examples: [
      {
        title: 'One-to-many: an author with several books, foreign key on the "many" side',
        titleHi: 'One-to-many: kई books waala ek author, "many" side par foreign key',
        code: `CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id), title text);
INSERT INTO author VALUES (1, 'Ada');
INSERT INTO book VALUES (10, 1, 'Notes'), (11, 1, 'Letters');

SELECT a.name, b.title FROM author a JOIN book b ON b.author_id = a.id ORDER BY b.title;`,
        output: ` name | title
------+---------
 Ada  | Letters
 Ada  | Notes
(2 rows)`,
        explain: '`book.author_id` is the foreign key, placed on the "many" side (books), pointing at exactly one author. The `JOIN` reassembles the one-to-many relationship: Ada\'s ONE row in `author` matches BOTH her books, producing one output row per book, each carrying her name. This is why the FK belongs on `book`, not on `author` — an author row cannot hold a list of book ids without violating 1NF.',
        explainHi: '`book.author_id` foreign key hai, "many" side (books) par rakhi gayi, theek ek author ki taraf point karte hue. `JOIN` one-to-many relationship reassemble karta hai: `author` mein Ada ki EK row uski DONO books se match karti hai, prati book ek output row produce karte hue. Yahi wajah hai ki FK `book` par hai, `author` par nahi — ek author row 1NF violate kiye bina book ids ki ek list nahi rakh sakti.',
      },
      {
        title: 'Many-to-many: a junction table with a composite key preventing duplicate pairs',
        titleHi: 'Many-to-many: ek junction table jo duplicate pairs ko rokती hai',
        code: `CREATE TABLE student (id int PRIMARY KEY, name text);
CREATE TABLE course (id int PRIMARY KEY, name text);
CREATE TABLE enrollment (student_id int REFERENCES student(id),
                         course_id int REFERENCES course(id),
                         PRIMARY KEY (student_id, course_id));
INSERT INTO student VALUES (1,'Ada'),(2,'Bo');
INSERT INTO course VALUES (101,'SQL'),(102,'Python');
INSERT INTO enrollment VALUES (1,101),(1,102),(2,101);

-- Ada cannot enroll in SQL a second time
INSERT INTO enrollment VALUES (1,101);`,
        output: `[ERROR] duplicate key value violates unique constraint "enrollment_pkey"`,
        explain: 'The composite primary key `(student_id, course_id)` both identifies each enrollment AND enforces "a given pair enrolls at most once" as a side effect. Ada is already enrolled in course 101; inserting `(1, 101)` a second time collides with the existing row\'s key — `duplicate key value violates unique constraint "enrollment_pkey"` — with no application-level duplicate check needed.',
        explainHi: 'Composite primary key `(student_id, course_id)` har enrollment ko identify karti hai AUR ek side effect ke roop mein "ek diyi jodi zyada se zyada ek baar enroll" enforce karti hai. Ada pehle se course 101 mein enrolled hai; `(1, 101)` doosri baar insert karna existing row ki key se collide karta hai — bina kisi application-level duplicate check ke.',
      },
      {
        title: 'One-to-one: the child\'s primary key IS the foreign key, enforcing exclusivity',
        titleHi: 'One-to-one: child ki primary key HI foreign key hai, exclusivity enforce karte hue',
        code: `CREATE TABLE employee (id int PRIMARY KEY, name text);
CREATE TABLE employee_profile (employee_id int PRIMARY KEY REFERENCES employee(id), bio text);
INSERT INTO employee VALUES (1, 'Ada');
INSERT INTO employee_profile VALUES (1, 'Mathematician');

-- a second profile for the SAME employee is rejected -- that is what makes it 1:1, not 1:N
INSERT INTO employee_profile VALUES (1, 'Second bio attempt');`,
        output: `[ERROR] duplicate key value violates unique constraint "employee_profile_pkey"`,
        explain: 'Making `employee_id` itself the PRIMARY KEY of `employee_profile` (rather than a separate surrogate id plus a plain FK) means a second profile row for the SAME employee collides with the existing row\'s primary key: `duplicate key value violates unique constraint "employee_profile_pkey"`. This is what structurally guarantees the one-to-one cardinality — a plain, non-unique foreign key would have allowed the second row silently.',
        explainHi: '`employee_id` ko khud `employee_profile` ki PRIMARY KEY banana (ek alag surrogate id plus ek plain FK ke bajaye) matlab SAME employee ke liye ek doosri profile row existing row ki primary key se collide karti hai. Yahi structurally one-to-one cardinality guarantee karta hai — ek plain, non-unique foreign key ne doosri row ko chupchaap allow kar diya hota.',
      },
    ],

    mistakes: [
      {
        wrong: `-- modeling many-to-many as one-to-many with a single FK column
CREATE TABLE student (id int PRIMARY KEY, current_course_id int REFERENCES course(id));
-- a student who is enrolled in TWO courses at once has nowhere to put the second one`,
        right: `CREATE TABLE enrollment (student_id int REFERENCES student(id),
                         course_id int REFERENCES course(id),
                         PRIMARY KEY (student_id, course_id));
-- a junction table lets a student have any number of courses, and vice versa`,
        why: 'A single foreign key column on student can point to only one course at a time, which is exactly a one-to-many relationship, one student to one current course. If a student can genuinely be enrolled in multiple courses simultaneously, the relationship is many-to-many, and no single column on either side can express it: student cannot hold multiple course ids without violating first normal form, comma-separated or otherwise, and course cannot hold a single student id either, since many students take it. The junction table is the only design that lets both sides have unlimited multiplicity at once, and its composite key naturally enforces that a given pairing is recorded at most once.',
        whyHi: '`student` par ek single foreign key column ek waqt sirf ek course ki taraf point kar sakta hai, jo theek ek one-to-many relationship hai. Agar ek student genuinely ek saath kई courses mein enrolled ho sakta hai, relationship many-to-many hai, aur koi bhi single column ise express nahi kar sakta. Junction table ek matra design hai jo dono sides ko ek saath unlimited multiplicity deता hai.',
      },
      {
        wrong: `-- one-to-one with no uniqueness enforced -- it's secretly one-to-many
CREATE TABLE employee (id int PRIMARY KEY);
CREATE TABLE employee_profile (id int PRIMARY KEY, employee_id int REFERENCES employee(id));
-- nothing stops TWO profile rows from referencing the SAME employee_id`,
        right: `CREATE TABLE employee_profile (employee_id int PRIMARY KEY REFERENCES employee(id));
-- making employee_id itself the primary key guarantees at most one profile per employee`,
        why: 'A foreign key by itself only guarantees that the referenced employee exists; it says nothing about how many profile rows may point at the same employee. Giving employee_profile its own separate surrogate id and a plain, non-unique foreign key column means the relationship is actually one-to-many in disguise, allowing multiple profile rows for the same employee even though the design intent was one profile per employee. Making the foreign key column itself the primary key of the child table is the standard fix: a primary key is inherently unique, so it becomes structurally impossible to insert a second profile for the same employee, and the design now genuinely enforces one-to-one.',
        whyHi: 'Ek foreign key apne aap mein sirf ye guarantee karta hai ki referenced employee exist karta hai; ye kuch nahi kehta ki kितnी profile rows usी employee ki taraf point kar sakti hain. `employee_profile` ko apni alag surrogate id aur ek plain, non-unique foreign key column dena matlab relationship asal mein disguise mein one-to-many hai. Foreign key column ko khud child table ki primary key banana standard fix hai.',
      },
      {
        wrong: `-- self-referencing relationship modeled with no protection against a cycle
CREATE TABLE category (id int PRIMARY KEY, parent_id int REFERENCES category(id));
INSERT INTO category VALUES (1, NULL);
UPDATE category SET parent_id = 1 WHERE id = 1;   -- a category that is its own parent`,
        right: `-- the FK constraint alone cannot forbid this; add an application-level check,
-- or a CHECK constraint comparing id <> parent_id for the direct self-reference case,
-- and validate deeper cycles (a -> b -> a) at the application layer or with a trigger
ALTER TABLE category ADD CONSTRAINT no_self_parent CHECK (id <> parent_id);`,
        why: 'A foreign key constraint only guarantees that parent_id, if not null, matches an existing row\'s id; it has no concept of "existing row" excluding the row currently being written, so nothing stops a row from referencing itself directly, and nothing at all stops a longer cycle, category a pointing to b which points back to a. A simple CHECK constraint comparing the row\'s own id to its parent_id catches the direct self-reference case cheaply. Deeper cycles are a genuinely harder problem: they require either an application-level validation before insert or update, or a trigger that walks the ancestor chain, because a plain constraint cannot express "no cycle of any length" declaratively. This is the schema-level counterpart to the recursive-CTE cycle guard from Module 5.',
        whyHi: 'Ek foreign key constraint sirf ye guarantee karta hai ki `parent_id`, agar null nahi, ek existing row ke `id` se match karta hai; ise "existing row" ka koi concept nahi jo currently likhi ja rahi row ko exclude kare, to kuch bhi ek row ko khud ko directly reference karne se nahi rokта. Ek simple `CHECK` constraint row ke apne `id` ko iske `parent_id` se compare karके direct self-reference case saste mein pakड़ता hai. Deeper cycles genuinely harder problem hain: unhe ya to application-level validation ya ek trigger chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**`order_line(order_id, product_id, qty)` as the many-to-many junction between `orders` and `product`** — with `qty` living on the junction row because it is a fact about that specific pairing.',
        hi: '**`order_line(order_id, product_id, qty)` `orders` aur `product` ke beech many-to-many junction ke roop mein** — `qty` junction row par rehta hai kyunki ye us specific pairing ke baare mein ek fact hai.',
      },
      {
        en: '**`user_settings(user_id PRIMARY KEY REFERENCES user(id))`** split off from a heavily-queried `user` table so rarely-needed preference columns don\'t bloat every ordinary user lookup — a one-to-one relationship used for table-splitting.',
        hi: '**`user_settings(user_id PRIMARY KEY REFERENCES user(id))`** ek heavily-queried `user` table se split ki gayi.',
      },
      {
        en: '**`employee.manager_id REFERENCES employee(id)`** powering both the org-chart recursive CTE (Module 5) and a `CHECK (id <> manager_id)` constraint that blocks the one cycle a plain foreign key cannot.',
        hi: '**`employee.manager_id REFERENCES employee(id)`** org-chart recursive CTE aur ek `CHECK (id <> manager_id)` constraint dono power karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you model a many-to-many relationship in a relational database, and why can\'t a single foreign key column do it?',
        qHi: 'Aap ek relational database mein ek many-to-many relationship kaise model karte ho, aur ek single foreign key column ise kyun nahi kar sakta?',
        a: 'A many-to-many relationship is modeled with a junction table, sometimes called a join or associative table, whose sole purpose is to record pairs: it holds a foreign key to each of the two related tables, and typically the combination of those two foreign keys serves as its own composite primary key. A single foreign key column cannot express this because a foreign key column can only point at one row at a time. If a student can be enrolled in multiple courses simultaneously, and a course can have multiple students, then neither a course id column on student nor a student id column on course can capture the full relationship: whichever side you put the single column on, it caps that side at exactly one match, turning what should be many-to-many into an accidental one-to-many. The junction table solves this because it does not live on either side; it is its own entity whose rows are the pairings themselves, and there is no limit to how many rows can reference a given student or a given course. The composite primary key on the two foreign keys also has a useful side effect: it directly enforces that a given student-course pair is recorded at most once, without needing an application-level check.',
        aHi: 'Ek many-to-many relationship ek junction table se model ki jaati hai, jiska sirf purpose pairs record karna hai: ye do related tables mein se har ek ke liye ek foreign key rakhती hai, aur typically un do foreign keys ka combination iski apni composite primary key ke roop mein kaam karta hai. Ek single foreign key column ise express nahi kar sakta kyunki ek foreign key column ek waqt sirf ek row ki taraf point kar sakta hai. Junction table ise solve karta hai kyunki ye kisi bhi side par nahi rehta; ye apni khud ki entity hai jiski rows khud pairings hain, aur ek diye student ya ek diye course ko kितni bhi rows reference kar sakti hain.',
      },
      {
        q: 'What is the standard pattern for a one-to-one relationship, and why is a plain foreign key not enough?',
        qHi: 'One-to-one relationship ke liye standard pattern kya hai, aur ek plain foreign key kaafi kyun nahi hai?',
        a: 'The standard pattern is to make the foreign key column itself the primary key of the child table, rather than giving the child table its own separate surrogate id alongside a plain foreign key column. A plain, non-unique foreign key only guarantees that the referenced row exists; it says nothing about how many child rows may reference that same parent, so without an additional uniqueness constraint, what looks like a one-to-one relationship is actually a one-to-many relationship that simply happens to have exactly one child today, and nothing prevents a second child row from being inserted for the same parent tomorrow. Making the foreign key column the primary key closes this gap for free, because a primary key is inherently unique: it becomes structurally impossible to insert two rows referencing the same parent, so the database itself enforces the one-to-one cardinality rather than relying on application code to remember to check. This pattern is also common for splitting a wide or rarely-needed set of columns off a heavily-queried table, joining in the extra details table only when they are actually needed.',
        aHi: 'Standard pattern foreign key column ko khud child table ki primary key banана hai, child table ko iski apni alag surrogate id dene ke bajaye ek plain foreign key column ke saath. Ek plain, non-unique foreign key sirf ye guarantee karta hai ki referenced row exist karti hai; ye kuch nahi kehta ki kितni child rows usी parent ko reference kar sakti hain. Foreign key column ko primary key banana ye gap free mein band karta hai, kyunki ek primary key inherently unique hai: usी parent ko reference karने waali do rows insert karna structurally impossible ban jaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Design (in comments, then SQL) a blog: `post`, `tag`, and their many-to-many relationship via a junction table `post_tag(post_id, tag_id)`. Insert 2 posts and 2 tags, associate one post with both tags, and write a query listing each post with its tags using `string_agg` (Module 4).',
        taskHi: 'Ek blog design karo: `post`, `tag`, aur unka many-to-many relationship ek junction table `post_tag(post_id, tag_id)` se. 2 posts aur 2 tags insert karo, ek post ko dono tags se associate karo.',
        hint: '`SELECT p.id, string_agg(t.name, \', \') FROM post p JOIN post_tag pt ON pt.post_id = p.id JOIN tag t ON t.id = pt.tag_id GROUP BY p.id` — recap of Module 4\'s aggregation over a junction join.',
        hintHi: '`SELECT p.id, string_agg(t.name, \', \') FROM post p JOIN post_tag pt ON pt.post_id = p.id JOIN tag t ON t.id = pt.tag_id GROUP BY p.id` — Module 4 ke aggregation ka recap.',
      },
      {
        task: 'Table `user(id int PRIMARY KEY)`. Add a one-to-one `user_address(user_id int PRIMARY KEY REFERENCES user(id), street text)`. Insert one address for a user, then try inserting a second address for the SAME user and confirm it is rejected.',
        taskHi: 'Table `user(id PRIMARY KEY)`. Ek one-to-one `user_address(user_id PRIMARY KEY REFERENCES user(id), street text)` add karo. Ek user ke liye ek address insert karo, phir usi user ke liye doosra insert karne ki koshish karo.',
        hint: 'Because `user_id` is itself the primary key of `user_address`, a second row for the same `user_id` violates the primary key uniqueness — exactly the enforcement a plain (non-PK) foreign key would not give you.',
        hintHi: 'Kyunki `user_id` khud `user_address` ki primary key hai, usi `user_id` ke liye ek doosri row primary key uniqueness violate karti hai.',
      },
      {
        task: 'Table `category(id int PRIMARY KEY, name text, parent_id int REFERENCES category(id))`. Add `CHECK (id <> parent_id)`. Insert a small 2-level tree, then try setting a category\'s `parent_id` to its own `id` and confirm the CHECK constraint rejects it.',
        taskHi: 'Table `category(id, name, parent_id REFERENCES category(id))`. `CHECK (id <> parent_id)` add karo. Ek chhota 2-level tree insert karo, phir ek category ka `parent_id` iske apne `id` par set karne ki koshish karo.',
        hint: 'The FK constraint alone allows a row to be its own parent (it just checks the id exists — and it does, it\'s the row itself). The `CHECK` constraint is the extra guard needed to forbid this specific one-hop cycle.',
        hintHi: 'FK constraint akela ek row ko apna parent hone deta hai. `CHECK` constraint is specific one-hop cycle ko forbid karne ke liye zaroori extra guard hai.',
      },
    ],

    keyTakeaways: [
      'Every relationship reduces to FOUR shapes: one-to-many (FK on the "many" side), many-to-many (a junction table with a FK to each side), one-to-one (a FK PLUS a uniqueness guarantee), self-referencing (a FK pointing back at the same table).',
      'ONE-TO-MANY: the FK column lives on the "many" side (`book.author_id`, not a list of book ids on `author`) — putting it anywhere else means a repeating group (1NF violation, Lesson 3).',
      'MANY-TO-MANY: neither side can hold a single FK to the other. A JUNCTION TABLE (join/associative/bridge table) holds one FK to each side; its COMPOSITE PK (both FKs together) both identifies each pairing and enforces "recorded at most once" for free. Data ABOUT the pairing itself (`enrollment.grade`) lives on the junction row.',
      'ONE-TO-ONE: a FK ALONE only guarantees the referenced row exists — it does NOT limit how many child rows point at the same parent (that\'s secretly one-to-many). Fix: make the FK column ITSELF the child\'s primary key (`employee_id int PRIMARY KEY REFERENCES employee(id)`) — a PK is inherently unique, so a second child row for the same parent is structurally impossible.',
      'SELF-REFERENCING: a table\'s FK points at its OWN primary key (`employee.manager_id REFERENCES employee(id)`) — models hierarchies (org charts, category trees) and same-type relationships (friends, blocks). Can itself be 1:N (many employees, one manager) or M:N (needs its own junction table — e.g. symmetric "friends").',
      'A plain FK CANNOT forbid a row referencing itself or a longer cycle (a->b->a) — add a `CHECK (id <> parent_id)` for the direct case; deeper cycles need application-level validation or a trigger (the schema-level counterpart to Module 5\'s recursive-CTE cycle guard).',
      'DECISION PROCESS: (1) can either side have MULTIPLE matches? neither->1:1, one side->1:N, both->M:N. (2) is it really one entity relating to itself? ->self-referencing. (3) does the relationship ITSELF carry data (a grade, a "since" date)? -> that data belongs on the junction/FK-holding row, not on either entity alone. Getting cardinality wrong is expensive to fix later — decide it at the ER-modeling stage (Lesson 1).',
    ],
    keyTakeawaysHi: [
      'Har relationship CHAAR shapes mein se ek tak reduce hoti hai: one-to-many (FK "many" side par), many-to-many (har side ke liye FK waali ek junction table), one-to-one (ek FK PLUS ek uniqueness guarantee), self-referencing (ek FK usi table ki taraf point karti).',
      'ONE-TO-MANY: FK column "many" side par rehta hai — kahin aur rakhna ek repeating group ban jaata hai (1NF violation).',
      'MANY-TO-MANY: koi bhi side doosre ke liye ek single FK nahi rakh sakta. Ek JUNCTION TABLE har side ke liye ek FK rakhti hai; iski COMPOSITE PK har pairing identify karti hai aur "zyada se zyada ek baar recorded" free mein enforce karti hai. Pairing ke baare mein data junction row par rehta hai.',
      'ONE-TO-ONE: akela ek FK sirf ye guarantee karta hai ki referenced row exist karti hai — ye limit NAHI karta ki kितni child rows usi parent ko point karti hain. Fix: FK column ko KHUD child ki primary key banao — ek PK inherently unique hai.',
      'SELF-REFERENCING: ek table ka FK apni HI primary key ki taraf point karta hai — hierarchies aur same-type relationships model karta hai. Khud 1:N ya M:N ho sakta hai.',
      'Ek plain FK ek row ko khud ko reference karne ya ek lambe cycle se rok NAHI sakta — direct case ke liye `CHECK (id <> parent_id)` add karo; deeper cycles ko application-level validation ya ek trigger chahiye.',
      'DECISION PROCESS: (1) kya koi side MULTIPLE matches rakh sakta hai? (2) kya ye asal mein ek entity khud se related hai? (3) kya relationship KHUD data le jaati hai? Cardinality galat karna baad mein fix karna mehnga hai — ise ER-modeling stage par decide karo (Lesson 1).',
    ],
  },

  {
    slug: 'sql-denormalization-and-schema-patterns',
    title: 'Denormalization & Common Schema Patterns',
    titleHi: 'Denormalization Aur Common Schema Patterns',
    description: 'Normalization eliminates redundancy; denormalization deliberately reintroduces some, trading storage and consistency risk for read speed. This lesson covers when that trade is worth making, plus the recurring schema patterns every real system needs: audit columns, soft delete, status enums, and why EAV is a trap.',
    descriptionHi: 'Normalization redundancy eliminate karta hai; denormalization deliberately kuch reintroduce karta hai, storage aur consistency risk ko read speed ke liye trade karте hue. Ye lesson cover karta hai ki wo trade kab worth hai, plus wo recurring schema patterns jo har real system ko chahiye: audit columns, soft delete, status enums, aur EAV ek trap kyun hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A restaurant keeping a photocopy of a supplier\'s price list pinned in the kitchen, instead of phoning the supplier before every dish.** The single source of truth for a product\'s price lives with the supplier — that is the fully normalized version, one fact, one place. But if the kitchen had to phone the supplier every single time a customer ordered a dish, service would grind to a halt. So the restaurant deliberately keeps a **local copy** pinned by the stove: a small, known redundancy, accepted on purpose, in exchange for speed. The trade only works because the restaurant also has a plan for when the supplier\'s real price changes — someone updates the pinned copy too, on a schedule, and everyone understands the pinned copy might lag the real one by up to a day. That is denormalization: a deliberate, *managed* redundancy for performance, as opposed to the accidental redundancy normalization exists to eliminate. Separately, every restaurant kitchen also has some standing habits regardless of any single dish: a log of who touched which order and when (audit columns), a "86\'d" mark instead of physically erasing a sold-out item from the board (soft delete), and a small fixed set of ticket statuses — ordered, cooking, plated, served — rather than a free-text field anyone can scribble anything into (a status enum).',
      hi: '**Ek restaurant kitchen mein ek supplier ki price list ki photocopy pin karके rakhna, har dish se pehle supplier ko phone karne ke bajaye.** Ek product ki price ka single source of truth supplier ke paas rehta hai — wo fully normalized version hai, ek fact, ek jagah. Par agar kitchen ko har baar jab customer ek dish order karta hai supplier ko phone karna padे, service ruk jaएगी. To restaurant deliberately stove ke paas ek **local copy** pin karके rakhता hai: ek chhoti, known redundancy, jaan-boojhkar accepted, speed ke badle mein. Ye trade sirf isliye kaam karta hai kyunki restaurant ke paas ye bhi ek plan hai ki jab supplier ki real price badalti hai kya hota hai — koi pinned copy bhi update karta hai, ek schedule par, aur sab samajhते hain ki pinned copy real waali se ek din tak lag ho sakti hai. Wahi denormalization hai: performance ke liye ek deliberate, *managed* redundancy, us accidental redundancy ke muकаble jise normalization eliminate karne ke liye exist karta hai. Alag se, har restaurant kitchen ke paas kuch standing habits bhi hain kisi bhi single dish ke bavjood: kisne kaunse order ko kab touch kiya iska ek log (audit columns), board se ek sold-out item ko physically erase karne ke bajaye ek "86\'d" mark (soft delete), aur ticket statuses ka ek chhota fixed set (ek status enum).',
    },

    simple: `**Denormalization: deliberately store a derived/duplicated value for READ speed**

\`\`\`sql
-- normalized: order_total always computed fresh from order_line -- always correct, but a JOIN+SUM every read
SELECT o.id, sum(ol.qty * ol.unit_price) FROM orders o JOIN order_line ol ON ol.order_id = o.id GROUP BY o.id;

-- denormalized: a maintained "cache" column -- fast to read, but must be kept in sync
ALTER TABLE orders ADD COLUMN total_cached numeric;
-- ... updated by a trigger, or recomputed in the same transaction that changes order_line ...
\`\`\`

**Audit columns — who/when, on almost every table**

\`\`\`sql
ALTER TABLE orders ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ADD COLUMN created_by int REFERENCES app_user(id);
\`\`\`

**Soft delete — mark, don't erase**

\`\`\`sql
ALTER TABLE product ADD COLUMN deleted_at timestamptz;   -- NULL = active, non-NULL = "deleted"
UPDATE product SET deleted_at = now() WHERE id = 42;      -- not DELETE FROM product
SELECT * FROM product WHERE deleted_at IS NULL;           -- every query must remember this filter
\`\`\`

**Status as a constrained enum/lookup, not free text**

\`\`\`sql
CREATE TYPE order_status AS ENUM ('pending','paid','shipped','cancelled');
ALTER TABLE orders ADD COLUMN status order_status NOT NULL DEFAULT 'pending';
-- 'shiped' (typo) is REJECTED outright -- a free-text column would silently accept it
\`\`\`

**Why EAV (Entity-Attribute-Value) is a trap**

\`\`\`sql
-- EAV: "flexible" -- any entity can have any attribute
CREATE TABLE eav (entity_id int, attribute text, value text);
-- every query needs a pivot; every value is a string (no real types); no FKs on attribute names;
-- "products with price > 100" requires casting a text column and hoping nobody typo'd "price"
\`\`\``,

    simpleHi: `**Denormalization: READ speed ke liye deliberately ek derived/duplicated value store karo**

\`\`\`sql
-- normalized: order_total hamesha order_line se fresh compute hota hai -- hamesha sahi, par har read par ek JOIN+SUM
SELECT o.id, sum(ol.qty * ol.unit_price) FROM orders o JOIN order_line ol ON ol.order_id = o.id GROUP BY o.id;

-- denormalized: ek maintained "cache" column -- read fast, par sync mein rakhna padta hai
ALTER TABLE orders ADD COLUMN total_cached numeric;
\`\`\`

**Audit columns — kisne/kab, lगभग har table par**

\`\`\`sql
ALTER TABLE orders ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ADD COLUMN created_by int REFERENCES app_user(id);
\`\`\`

**Soft delete — mark karo, erase nahi**

\`\`\`sql
ALTER TABLE product ADD COLUMN deleted_at timestamptz;   -- NULL = active, non-NULL = "deleted"
UPDATE product SET deleted_at = now() WHERE id = 42;      -- DELETE FROM product nahi
SELECT * FROM product WHERE deleted_at IS NULL;           -- har query ko ye filter yaad rakhна hoga
\`\`\`

**Status ek constrained enum/lookup ke roop mein, free text nahi**

\`\`\`sql
CREATE TYPE order_status AS ENUM ('pending','paid','shipped','cancelled');
ALTER TABLE orders ADD COLUMN status order_status NOT NULL DEFAULT 'pending';
-- 'shiped' (typo) seedhe REJECTED hai -- ek free-text column chupchaap accept kar leta
\`\`\`

**EAV (Entity-Attribute-Value) ek trap kyun hai**

\`\`\`sql
-- EAV: "flexible" -- koi bhi entity koi bhi attribute rakh sakta hai
CREATE TABLE eav (entity_id int, attribute text, value text);
-- har query ko ek pivot chahiye; har value ek string hai (koi real types nahi); attribute names par koi FKs nahi
\`\`\``,

    content: `## Denormalization: the deliberate exception to Lessons 3-4

**Denormalization** means deliberately storing redundant or derived data to make reads faster, accepting the write-side cost of keeping it in sync. It is not "forgetting to normalize" — it is a conscious trade-off, made *after* understanding the normalized design, for a specific, measured reason.

The classic case: a frequently-read aggregate (an order's total, a post's comment count, a user's follower count) that would otherwise require a \`JOIN\` + aggregation on **every read**. If that read happens far more often than the underlying data changes, storing a maintained copy can be a large win.

\`\`\`sql
ALTER TABLE post ADD COLUMN comment_count int NOT NULL DEFAULT 0;
-- maintained by a trigger on INSERT/DELETE to "comment", or recomputed in the same
-- transaction that adds/removes a comment -- never left to "eventually" get fixed
\`\`\`

**The cost you are accepting:** the denormalized column can drift out of sync with reality if the maintenance logic has a bug, is skipped by some code path, or a transaction fails partway. Every denormalization decision needs an answer to "what keeps this in sync, and what happens if it doesn't" — a trigger, a scheduled reconciliation job, or acceptance that eventual staleness is fine for this particular field.

**When it's worth it:** read-heavy access patterns where the aggregate is expensive to compute live and slightly-stale or synchronously-maintained values are acceptable; reporting/analytics tables deliberately built as wide, flat, redundant copies of normalized OLTP data (a **star schema**, common in data warehousing) because reporting queries value read speed over write-time normalization; caching a value that comes from a slow or external source. **When it's not worth it:** "premature" denormalization, applied before measuring that the normalized query is actually a bottleneck — normalization's correctness guarantees are free; give them up only for a benefit you have actually confirmed you need.

## Audit columns

Almost every table benefits from recording **who changed it and when**:

\`\`\`sql
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()   -- maintained by a trigger on UPDATE
created_by int REFERENCES app_user(id)
updated_by int REFERENCES app_user(id)
\`\`\`

These support debugging ("when did this row last change and who did it"), auditing/compliance requirements, and simple business features (sorting by recency, "last edited by"). \`updated_at\` needs an explicit trigger or application-level discipline — it does not update itself just because the column exists.

## Soft delete

Instead of \`DELETE FROM table\`, mark a row as deleted with a nullable timestamp (or boolean flag) and filter it out of normal queries:

\`\`\`sql
ALTER TABLE product ADD COLUMN deleted_at timestamptz;   -- NULL = active
UPDATE product SET deleted_at = now() WHERE id = 42;
SELECT * FROM product WHERE deleted_at IS NULL;
\`\`\`

**Why:** preserves history for auditing/compliance, supports "undo", and avoids breaking foreign keys from other tables that still reference the "deleted" row (an order referencing a discontinued product should still be able to show what was ordered). **The cost:** every query against the table must remember the \`WHERE deleted_at IS NULL\` filter (a view, or a default scope in the ORM, usually enforces this), unique constraints get subtler (two "deleted" rows with the same natural key might need to coexist — often solved with a partial unique index, Module 10), and the table grows forever unless a separate archival/purge process exists.

## Status as an enum or lookup table, not free text

A \`status text\` column accepts any string — \`'shiped'\` (typo), \`'Shipped'\` (wrong case), \`'SHIPPED '\` (trailing space) all silently coexist as different values. Two structured alternatives:

\`\`\`sql
-- option A: a native ENUM type -- fixed set, rejected at the type level
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');

-- option B: a lookup table -- an FK constraint enforces membership, and it's queryable/extensible
CREATE TABLE order_status (code text PRIMARY KEY);
INSERT INTO order_status VALUES ('pending'), ('paid'), ('shipped'), ('cancelled');
ALTER TABLE orders ADD COLUMN status text REFERENCES order_status(code);
\`\`\`

\`ENUM\` is simplest for a truly fixed, rarely-changing set; a lookup table is preferable when the set of statuses might grow, needs its own attributes (a display label, a sort order, a color), or must be queried ("list all statuses") without a schema change (Module 8 covers \`ALTER TYPE\` costs).

## Polymorphic association — and its trade-off

Sometimes one child table needs to attach to **several different** parent tables — a \`comment\` that can belong to a \`post\` **or** a \`photo\` **or** a \`video\`. A common but risky pattern is a single \`(commentable_type, commentable_id)\` pair with no real foreign key:

\`\`\`sql
CREATE TABLE comment (id int PRIMARY KEY, commentable_type text, commentable_id int, body text);
-- commentable_id has NO foreign key -- it means different things depending on commentable_type
-- the database cannot enforce "this id actually exists in the referenced table"
\`\`\`

This trades away referential integrity entirely: the database cannot verify \`commentable_id\` points at a real row, because it does not know *which* table to check without inspecting \`commentable_type\` first (which a plain FK cannot express). Safer alternatives: a separate junction/nullable-FK-per-type table (\`comment\` has \`post_id\`, \`photo_id\`, \`video_id\`, all nullable, exactly one non-null, enforced with a \`CHECK\`), or accepting the trade-off consciously when the polymorphism is genuinely central to the design and enforced carefully at the application layer.

## Why EAV (Entity-Attribute-Value) is a trap

EAV models "anything can have any attribute" as a generic three-column table:

\`\`\`sql
CREATE TABLE eav (entity_id int, attribute text, value text);
-- (42, 'color', 'red'), (42, 'weight', '3.2'), (42, 'in_stock', 'true')
\`\`\`

It looks appealingly flexible — no schema change needed to add a new attribute — but it silently gives up nearly everything a relational database provides: **every value is text** (no real numeric/date/boolean types, no range/format constraints), **there is no foreign key possible on the attribute name** (a typo'd \`'colour'\` vs \`'color'\` silently creates a new, disconnected attribute), **every query needs a pivot** to get attributes back into columns (turning a simple \`WHERE price > 100\` into a self-join or a \`CASE\`-heavy pivot), and **indexing is far weaker** (an index on \`value\` serves every attribute equally badly, rather than a targeted index per real column). EAV is occasionally justified for genuinely unbounded, rarely-queried custom fields (and even then, a JSON/JSONB column, Module 11, is usually the better modern answer, since it at least keeps structured querying options). As a general-purpose schema strategy, it should be treated as a smell: if you find yourself reaching for it, the real fix is almost always "model the actual entities properly" (Lesson 1) rather than avoiding schema design altogether.`,

    contentHi: `## Denormalization: Lessons 3-4 ka deliberate exception

**Denormalization** ka matlab deliberately redundant ya derived data store karna hai taaki reads faster ho sakें, isे sync mein rakhne ki write-side cost accept karte hue. Ye "normalize karna bhool jाना" nahi hai — ye ek conscious trade-off hai, normalized design samajhne ke *baad* liya gaya, ek specific, measured reason ke liye.

Classic case: ek frequently-read aggregate (ek order ka total, ek post ka comment count) jise otherwise **har read par** ek \`JOIN\` + aggregation chahiye. Agar wo read us data se badते se kई zyada baar hoता hai, ek maintained copy store karna ek badा win ho sakта hai.

\`\`\`sql
ALTER TABLE post ADD COLUMN comment_count int NOT NULL DEFAULT 0;
-- ek trigger dwara maintained
\`\`\`

**Aap jo cost accept kar rahe ho:** denormalized column reality se sync se bahar drift kar sakta hai agar maintenance logic mein bug hai. Har denormalization decision ko "isе sync mein kya rakhta hai, aur agar nahi rakhता to kya hota hai" ka jawab chahiye.

**Kab worth hai:** read-heavy access patterns jahaan aggregate live compute karna mehnga hai; reporting/analytics tables (ek **star schema**) jaan-boojhkar wide, flat, redundant copies ke roop mein bani. **Kab NAHI worth hai:** "premature" denormalization, normalized query asal mein bottleneck hai ye measure karne se pehle apply ki gayi.

## Audit columns

Lगभग har table ko **kisne kab badla** record karne se faida hoता hai:

\`\`\`sql
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()   -- ek UPDATE trigger dwara maintained
created_by int REFERENCES app_user(id)
\`\`\`

## Soft delete

\`DELETE FROM table\` ke bajaye, ek row ko ek nullable timestamp (ya boolean flag) se deleted mark karo aur ise normal queries se filter karo:

\`\`\`sql
ALTER TABLE product ADD COLUMN deleted_at timestamptz;   -- NULL = active
UPDATE product SET deleted_at = now() WHERE id = 42;
SELECT * FROM product WHERE deleted_at IS NULL;
\`\`\`

**Kyun:** auditing/compliance ke liye history preserve karta hai, "undo" support karta hai, aur doosri tables se foreign keys todне se bachaта hai. **Cost:** har query ko \`WHERE deleted_at IS NULL\` filter yaad rakhна hoga.

## Status ek enum ya lookup table ke roop mein, free text nahi

Ek \`status text\` column koi bhi string accept karta hai — \`'shiped'\` (typo), \`'Shipped'\`, sab chupchaap alag values ke roop mein coexist karte hain. Do structured alternatives:

\`\`\`sql
-- option A: ek native ENUM type
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');
-- option B: ek lookup table
CREATE TABLE order_status (code text PRIMARY KEY);
\`\`\`

## Polymorphic association — aur iska trade-off

Kabhi ek child table ko **kई alag** parent tables se attach hona hoता hai. Ek common par risky pattern ek single \`(commentable_type, commentable_id)\` jodi hai koi real foreign key ke bina:

\`\`\`sql
CREATE TABLE comment (id int PRIMARY KEY, commentable_type text, commentable_id int, body text);
-- commentable_id ka KOI foreign key nahi
\`\`\`

## EAV (Entity-Attribute-Value) ek trap kyun hai

EAV "kuch bhi koi bhi attribute rakh sakta hai" ko ek generic three-column table ke roop mein model karta hai. Ye appealingly flexible dikhता hai par chupchaap lगभग sab kuch chhoड़ deता hai jo ek relational database deता hai: **har value text hai**, **attribute name par koi foreign key possible nahi**, **har query ko ek pivot chahiye**, aur **indexing bahut weaker hai**. EAV ke roop mein istemal se bachne ke liye asli fix lgभग hamesha "actual entities ko theek se model karo" hai.`,

    examples: [
      {
        title: 'Soft delete: the row survives, and every ordinary query must filter it out',
        titleHi: 'Soft delete: row bachti hai, aur har ordinary query ise filter karna padta hai',
        code: `CREATE TABLE product (id int PRIMARY KEY, name text, deleted_at timestamptz);
INSERT INTO product VALUES (1, 'Widget', NULL), (2, 'Gadget', NULL);

-- "deleting" product 2 -- mark it, don't erase it
UPDATE product SET deleted_at = now() WHERE id = 2;

-- every normal listing must remember this filter
SELECT id, name FROM product WHERE deleted_at IS NULL ORDER BY id;`,
        output: ` id | name
----+--------
 1  | Widget
(1 row)`,
        explain: "Product 2 ('Gadget') was soft-deleted via `deleted_at = now()`, but the row itself still physically exists in the table. The listing query explicitly filters `WHERE deleted_at IS NULL`, so only the still-active product ('Widget') appears. Any query against this table that FORGETS this filter would silently include the deleted product in its results.",
        explainHi: "Product 2 ('Gadget') `deleted_at = now()` se soft-deleted hui, par row khud abhi bhi table mein physically exist karti hai. Listing query explicitly `WHERE deleted_at IS NULL` filter karti hai, to sirf abhi bhi active product ('Widget') dikhता hai. Is table ke against koi bhi query jo ye filter BHOOL jaati hai chupchaap deleted product ko apne results mein include kar degi.",
      },
      {
        title: 'A status ENUM rejects a typo that a free-text column would silently accept',
        titleHi: 'Ek status ENUM ek typo reject karta hai jise ek free-text column chupchaap accept karta',
        code: `CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');
CREATE TABLE orders (id int PRIMARY KEY, status order_status NOT NULL DEFAULT 'pending');
INSERT INTO orders VALUES (1, 'paid');

-- a typo'd status value is rejected at the type level, not silently stored
INSERT INTO orders VALUES (2, 'shiped');`,
        output: `[ERROR] invalid input value for enum order_status: "shiped"`,
        explain: "The `ENUM` type defines a FIXED, closed set of valid values (`'pending', 'paid', 'shipped', 'cancelled'`). `'paid'` is accepted because it is in the set; `'shiped'` (a typo) is rejected OUTRIGHT at the type-checking level — `invalid input value for enum order_status`. A plain `text` column would have silently stored the typo as a brand-new, disconnected status value.",
        explainHi: "`ENUM` type ek FIXED, closed set of valid values define karta hai. `'paid'` accepted hai kyunki ye set mein hai; `'shiped'` (ek typo) type-checking level par SEEDHE reject hota hai. Ek plain `text` column ne typo ko ek naya, disconnected status value ke roop mein chupchaap store kar diya hota.",
      },
      {
        title: 'Denormalized aggregate: a maintained count column avoids a JOIN+COUNT on every read',
        titleHi: 'Denormalized aggregate: ek maintained count column har read par JOIN+COUNT se bachata hai',
        code: `CREATE TABLE post (id int PRIMARY KEY, comment_count int NOT NULL DEFAULT 0);
CREATE TABLE comment (id int PRIMARY KEY, post_id int REFERENCES post(id));
INSERT INTO post VALUES (1, 0);
INSERT INTO comment VALUES (10, 1), (11, 1), (12, 1);

-- normally comment_count would be kept in sync by a trigger on comment INSERT/DELETE;
-- here we simulate that maintenance directly to show the cached value matches reality
UPDATE post SET comment_count = (SELECT count(*) FROM comment WHERE post_id = post.id) WHERE id = 1;
SELECT id, comment_count FROM post;`,
        output: ` id | comment_count
----+---------------
 1  | 3
(1 row)`,
        explain: '`comment_count` is a denormalized column: instead of running a `JOIN` + `COUNT` against `comment` on every read, the count is precomputed and stored directly on `post`. Here the maintenance `UPDATE` recomputes it from the real `comment` rows (simulating what a trigger would do automatically), confirming the cached value (`3`) matches reality — but ONLY because something actively kept it in sync.',
        explainHi: '`comment_count` ek denormalized column hai: har read par `comment` ke against ek `JOIN` + `COUNT` chalane ke bajaye, count precompute karके seedhe `post` par store kiya jaata hai. Yahaan maintenance `UPDATE` ise real `comment` rows se recompute karta hai (jo ek trigger automatically karta), confirm karte hue ki cached value (`3`) reality se match karti hai — par SIRF isliye kyunki kuch actively ise sync mein rakhta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- soft delete, but forgot the filter on a report query
CREATE TABLE product (id int PRIMARY KEY, name text, price int, deleted_at timestamptz);
INSERT INTO product VALUES (1,'Widget',100,NULL), (2,'Discontinued',50,now());
-- "average price of our catalog" -- silently includes the discontinued/deleted product
SELECT round(avg(price), 2) FROM product;`,
        right: `SELECT round(avg(price), 2) FROM product WHERE deleted_at IS NULL;
-- or centralize the rule in a view so no query can forget it:
-- CREATE VIEW active_product AS SELECT * FROM product WHERE deleted_at IS NULL;`,
        why: 'Soft delete only works if every query against the table remembers to exclude soft-deleted rows; the database has no built-in concept that deleted_at being non-null means "pretend this row is not here". A report or ad-hoc query that forgets the filter silently includes logically-deleted rows in aggregates, exactly the kind of subtly-wrong number that is hard to catch in review. Because forgetting the filter is so easy and so consequential, teams commonly centralize the rule in a view, an ORM default scope, or a row-level security policy, so the exclusion happens automatically rather than depending on every author remembering to type the WHERE clause correctly every time.',
        whyHi: 'Soft delete sirf tab kaam karta hai jab table ke against har query soft-deleted rows exclude karna yaad rakhe; database ke paas koi built-in concept nahi hai ki `deleted_at` non-null hone ka matlab "is row ko yahaan na hona maano" hai. Ek report ya ad-hoc query jo filter bhool jaati hai chupchaap logically-deleted rows ko aggregates mein include karti hai. Isliye teams aksar niyam ko ek view mein centralize karte hain.',
      },
      {
        wrong: `-- denormalized comment_count with NO mechanism keeping it in sync
CREATE TABLE post (id int PRIMARY KEY, comment_count int DEFAULT 0);
CREATE TABLE comment (id int PRIMARY KEY, post_id int REFERENCES post(id));
INSERT INTO post VALUES (1, 0);
INSERT INTO comment VALUES (10, 1);
-- comment_count is still 0 -- nothing updated it when the comment was inserted
SELECT * FROM post;`,
        right: `-- either maintain it with a trigger on comment INSERT/DELETE, or recompute it in the
-- SAME transaction that inserts/deletes a comment -- denormalization without a sync
-- mechanism is not a performance optimization, it is just a wrong number waiting to happen`,
        why: 'A denormalized column is a promise that its value matches what the normalized query would produce, and that promise is only kept by something actively maintaining it: a trigger, application code running in the same transaction as the write it depends on, or a scheduled reconciliation job. Adding the column with a default and never wiring up anything to update it produces a column that looks authoritative but is simply wrong from the moment the first related row changes. This is the central discipline of denormalization: it is not merely "store a copy for speed", it is "store a copy for speed, and also build and test the mechanism that keeps the copy correct", and skipping the second half turns a performance optimization into a silent data-quality bug.',
        whyHi: 'Ek denormalized column ek promise hai ki iski value wahi hai jo normalized query produce karti. Wo promise sirf tab niभाई jaati hai jab kuch actively use maintain karta hai: ek trigger, ya write ke saath usi transaction mein chalता application code. Column ko ek default ke saath add karna aur kuch bhi update karne ke liye wire na karna ek aisa column banata hai jo authoritative dikhta hai par pehli related row badalne ke pal se galat hai.',
      },
      {
        wrong: `-- a polymorphic "commentable" with no real foreign key, and a typo goes undetected
CREATE TABLE comment (id int PRIMARY KEY, commentable_type text, commentable_id int, body text);
INSERT INTO comment VALUES (1, 'Pots', 42, 'Nice!');   -- typo: "Pots" instead of "Posts"
-- nothing in the database rejects this -- the comment silently points at nothing meaningful`,
        right: `-- safer: one nullable FK column per possible parent type, with a CHECK enforcing
-- exactly one is set
CREATE TABLE comment (id int PRIMARY KEY, body text,
                      post_id int REFERENCES post(id),
                      photo_id int REFERENCES photo(id),
                      CHECK (num_nonnulls(post_id, photo_id) = 1));`,
        why: 'A polymorphic association stored as a type-name string plus a bare integer id has no real foreign key, because a foreign key must name exactly one target table, and here the target table depends on the value of another column at runtime, something a static constraint cannot express. The database therefore cannot verify commentable_id refers to anything real, and a typo in commentable_type, or a value that used to be valid before a table was renamed, produces a comment silently attached to nothing, discoverable only by a bug report. The alternative gives up some flexibility, a fixed, enumerable set of possible parent types rather than an open-ended one, but in exchange gets back real, enforced foreign keys for each type plus a CHECK constraint ensuring exactly one is populated, so the database can once again guarantee every comment is attached to something that actually exists.',
        whyHi: 'Ek type-name string plus ek bare integer id ke roop mein stored ek polymorphic association ka koi real foreign key nahi hai, kyunki ek foreign key ko theek ek target table naam dena hoga, aur yahaan target table runtime par ek doosre column ki value par depend karta hai. Database isliye verify nahi kar sakta ki `commentable_id` kisi real cheez ko refer karta hai. Alternative kuch flexibility chhoड़ता hai par badle mein har type ke liye real, enforced foreign keys wapas paata hai plus ek `CHECK` constraint.',
      },
    ],

    realWorld: [
      {
        en: '**A `follower_count` column on `user`, maintained by a trigger on the `follow` junction table** — reads (profile pages, search results) vastly outnumber writes (a new follow), making the denormalization a clear win.',
        hi: '**`user` par ek `follower_count` column, `follow` junction table par ek trigger dwara maintained** — reads writes se kई zyada hain.',
      },
      {
        en: '**Every table in a schema carrying `created_at`/`updated_at`/`deleted_at` as a project-wide convention**, enforced by a lint rule on new migrations, so soft-delete filtering and audit history are never an afterthought.',
        hi: '**Schema ki har table `created_at`/`updated_at`/`deleted_at` project-wide convention ke roop mein le jaati hai**.',
      },
      {
        en: '**A `notification` table with `notifiable_type`/`notifiable_id` accepted as a deliberate, reviewed exception** to strict referential integrity, because the set of notifiable types is small, closed, and validated in application code with tests covering every type.',
        hi: '**Ek `notification` table `notifiable_type`/`notifiable_id` ke saath ek deliberate, reviewed exception ke roop mein accepted**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is denormalization, and how do you decide when it is worth doing?',
        qHi: 'Denormalization kya hai, aur aap kaise decide karte ho ki ye kab worth hai?',
        a: 'Denormalization is the deliberate reintroduction of redundant or derived data into a schema that would otherwise be fully normalized, done specifically to speed up reads, in exchange for the cost of keeping that redundant copy synchronized and the storage it consumes. The classic case is a frequently read aggregate value, an order total, a comment count, a follower count, that would otherwise require a join and an aggregation on every single read; if that read happens far more often than the underlying rows change, storing a maintained copy of the aggregate can be a large win. Deciding whether it is worth it comes down to two things. First, measure rather than assume: normalization\'s correctness guarantees, no duplicated facts, no update anomalies, are free, so you give them up only after confirming the normalized query is actually a bottleneck for your read pattern, not preemptively. Second, and just as important, denormalization is only safe if you also design the mechanism that keeps the redundant copy correct, a trigger, application code that updates it in the same transaction as the underlying change, or an accepted, bounded staleness window for something like a reporting table. A denormalized column with no maintenance plan is not a performance optimization, it is simply a wrong number waiting to happen the first time the underlying data changes.',
        aHi: 'Denormalization ek schema mein redundant ya derived data ko deliberately reintroduce karna hai, specifically reads speed up karne ke liye, us cost ke bajaye jo us redundant copy ko synchronized rakhne mein lagti hai. Classic case ek frequently read aggregate value hai jise otherwise har single read par ek join aur aggregation chahiye. Ye worth hai ya nahi ye do cheezon par nirbhar karta hai. Pehla, assume karne ke bajaye measure karo: normalization ki correctness guarantees free hain, to unhe sirf confirm karne ke baad chhoड़o ki normalized query asal mein tumhare read pattern ke liye bottleneck hai. Doosra, denormalization sirf tab safe hai jab aap us mechanism ko bhi design karte ho jo redundant copy ko correct rakhta hai.',
      },
      {
        q: 'Why is the Entity-Attribute-Value (EAV) pattern generally considered an anti-pattern?',
        qHi: 'Entity-Attribute-Value (EAV) pattern ko generally ek anti-pattern kyun maana jaata hai?',
        a: 'EAV models arbitrary attributes as rows in a generic three-column table, an entity id, an attribute name, and a value, rather than as columns in a properly typed table. Its appeal is that adding a new attribute requires no schema change, just new rows. The problem is that it quietly discards nearly everything a relational database normally provides. Every value is stored as text or some generic type, so there are no real numeric, date, or boolean types, and no column-level constraints like ranges or formats. There is no way to put a foreign key or check constraint on the attribute name column, so a typo like colour instead of color silently creates a disconnected, orphaned attribute that the database has no way to flag. Every query that wants to treat several attributes as normal columns, such as filtering where price is greater than one hundred, needs to pivot the data back out of rows into columns, typically with self-joins or conditional aggregation, which is both awkward to write and expensive to execute. And indexing is far weaker: an index on the generic value column serves every attribute equally poorly, rather than a targeted index tuned for one real column\'s actual data distribution. EAV can be a reasonable, narrow choice for genuinely unbounded, rarely queried custom fields, and even then a JSON or JSONB column is usually a better modern alternative since it at least supports some structured querying. As a general schema strategy, reaching for EAV is usually a sign that the actual entities in the domain have not been modeled properly, which is the real fix.',
        aHi: 'EAV arbitrary attributes ko ek generic three-column table mein rows ke roop mein model karta hai, ek entity id, ek attribute name, aur ek value, ek theek se typed table mein columns ke bajaye. Iska appeal ye hai ki ek naya attribute add karne ke liye koi schema change nahi chahiye, bस nayi rows. Problem ye hai ki ye chupchaap lगभग sab kuch discard kar deta hai jo ek relational database normally deta hai. Har value text ke roop mein store hoती hai, to koi real numeric, date, ya boolean types nahi. Attribute name column par koi foreign key ya check constraint nahi daala ja sakta, to ek typo chupchaap ek disconnected attribute banата hai. Har query jo kई attributes ko normal columns ki tarah treat karna chahti hai ko data ko rows se columns mein wapas pivot karна hoga. EAV genuinely unbounded, rarely queried custom fields ke liye ek reasonable choice ho sakta hai, aur tab bhi ek JSON column usually ek behtar modern alternative hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `product(id int PRIMARY KEY, name text, price int, deleted_at timestamptz)` with one active and one soft-deleted row. Write `SELECT count(*) FROM product` (includes the deleted row) alongside `SELECT count(*) FROM product WHERE deleted_at IS NULL` (excludes it), and explain in a comment why a report forgetting the filter would silently be wrong.',
        taskHi: 'Table `product(id, name, price, deleted_at)` ek active aur ek soft-deleted row ke saath. `SELECT count(*) FROM product` (deleted row include) aur `SELECT count(*) FROM product WHERE deleted_at IS NULL` (exclude) likho.',
        hint: 'The unfiltered count silently includes logically-deleted rows in any aggregate — the classic soft-delete bug is a report or query that forgets this WHERE clause.',
        hintHi: 'Unfiltered count chupchaap logically-deleted rows ko kisi bhi aggregate mein include karta hai — classic soft-delete bug ek report ya query hai jo ye WHERE clause bhool jaati hai.',
      },
      {
        task: 'Table `orders(id int PRIMARY KEY, status text)` using plain text. Insert a row with `status = \'Paid\'` and another with `\'PAID\'` and note they are silently treated as different values. Redesign with `CREATE TYPE order_status AS ENUM (...)` and confirm an invalid value is now rejected outright.',
        taskHi: 'Table `orders(id, status)` plain text istemal karte hue. Ek row `status = \'Paid\'` aur doosri `\'PAID\'` ke saath insert karo aur dhyan do ki wo chupchaap alag values ke roop mein treat hoti hain. `CREATE TYPE order_status AS ENUM (...)` se redesign karo.',
        hint: 'Free text allows any casing/spelling to silently coexist as distinct values. An `ENUM` (or a lookup table with a FK) rejects anything outside the fixed set at write time.',
        hintHi: 'Free text kisi bhi casing/spelling ko chupchaap alag values ke roop mein coexist hone deta hai. Ek `ENUM` fixed set se bahar kuch bhi write time par reject karta hai.',
      },
      {
        task: 'Table `post(id int PRIMARY KEY, like_count int NOT NULL DEFAULT 0)` and `like_row(id int PRIMARY KEY, post_id int REFERENCES post(id))`. Insert 3 likes for a post, then write the maintenance `UPDATE` that recomputes `like_count` from `like_row` and confirm it matches. Explain in a comment what would need to run this UPDATE automatically in a real system (a trigger).',
        taskHi: 'Table `post(id, like_count)` aur `like_row(id, post_id)`. Ek post ke liye 3 likes insert karo, phir maintenance `UPDATE` likho jo `like_row` se `like_count` recompute karta hai.',
        hint: '`UPDATE post SET like_count = (SELECT count(*) FROM like_row WHERE post_id = post.id)`. In production this would run inside a trigger fired on every INSERT/DELETE to `like_row`, not as a manual one-off.',
        hintHi: '`UPDATE post SET like_count = (SELECT count(*) FROM like_row WHERE post_id = post.id)`. Production mein ye ek trigger ke andar chalega har `like_row` ke `INSERT`/`DELETE` par, ek manual one-off ke roop mein nahi.',
      },
    ],

    keyTakeaways: [
      'DENORMALIZATION = deliberately storing redundant/derived data for READ speed, accepting a write-side sync cost. NOT the same as forgetting to normalize — it\'s a conscious trade-off made AFTER understanding the normalized design, for a MEASURED reason (a frequent read that would otherwise need a `JOIN`+aggregation every time).',
      'Every denormalization decision needs an answer to "what keeps this in sync, and what happens if it doesn\'t" — a trigger, same-transaction maintenance, or an accepted staleness window. A denormalized column with NO sync mechanism is not an optimization, it\'s a wrong number waiting to happen.',
      'AUDIT COLUMNS (`created_at`/`updated_at`/`created_by`/`updated_by`) on almost every table — support debugging, compliance, and "last edited by" features. `updated_at` needs an explicit trigger; it doesn\'t maintain itself.',
      'SOFT DELETE: mark with a nullable `deleted_at` instead of `DELETE FROM`. Preserves history, supports undo, avoids breaking FKs from rows that still reference the "deleted" row. COST: every query must remember `WHERE deleted_at IS NULL` (centralize in a VIEW or ORM default scope) — forgetting it silently includes deleted rows in aggregates.',
      'STATUS as an `ENUM` type or a lookup table (FK-enforced), NOT free text — free text lets typos/case variants (`\'shiped\'`, `\'Shipped\'`, `\'SHIPPED \'`) silently coexist as different values. `ENUM` for a truly fixed set; a lookup table when statuses might grow or need their own attributes.',
      'POLYMORPHIC ASSOCIATION (`commentable_type` + `commentable_id`, no real FK) trades away referential integrity entirely — the DB can\'t verify the id exists because it doesn\'t know which table to check. Safer: one nullable FK column per possible parent type + a `CHECK` ensuring exactly one is set.',
      'EAV (`entity_id, attribute, value` as a generic 3-column table) is a TRAP: every value is text (no real types/constraints), no FK possible on the attribute name (typos create orphaned attributes), every query needs a pivot, indexing is far weaker. Reaching for EAV is usually a sign the real entities were never properly modeled (Lesson 1) — a JSON/JSONB column (Module 11) is the better modern fallback for genuinely unbounded custom fields.',
    ],
    keyTakeawaysHi: [
      'DENORMALIZATION = deliberately redundant/derived data store karna READ speed ke liye, ek write-side sync cost accept karte hue. Normalize karna bhool jaане jaisा NAHI hai — ye ek conscious trade-off hai normalized design samajhne ke BAAD, ek MEASURED reason ke liye.',
      'Har denormalization decision ko "isе sync mein kya rakhta hai" ka jawab chahiye — ek trigger, same-transaction maintenance, ya ek accepted staleness window. Bina sync mechanism ke ek denormalized column ek optimization nahi hai, ye ek galat number hai jo hona hai.',
      'AUDIT COLUMNS (`created_at`/`updated_at`/`created_by`/`updated_by`) lगभग har table par — debugging, compliance support karte hain. `updated_at` ko ek explicit trigger chahiye; ye khud maintain nahi hota.',
      'SOFT DELETE: `DELETE FROM` ke bajaye ek nullable `deleted_at` se mark karo. History preserve karta hai, undo support karta hai. COST: har query ko `WHERE deleted_at IS NULL` yaad rakhна hoga — bhoolna chupchaap deleted rows ko aggregates mein include karta hai.',
      'STATUS ek `ENUM` type ya ek lookup table (FK-enforced) ke roop mein, free text NAHI — free text typos/case variants ko chupchaap alag values ke roop mein coexist hone deta hai.',
      'POLYMORPHIC ASSOCIATION (`commentable_type` + `commentable_id`, koi real FK nahi) referential integrity poori tarah trade karta hai — DB id exist karti hai ye verify nahi kar sakta. Safer: har possible parent type ke liye ek nullable FK column + ek `CHECK`.',
      'EAV ek TRAP hai: har value text hai, attribute name par koi FK possible nahi, har query ko ek pivot chahiye, indexing bahut weaker hai. EAV ke liye pahunchna usually ek sign hai ki real entities kabhi theek se model nahi hue (Lesson 1) — ek JSON/JSONB column (Module 11) genuinely unbounded custom fields ke liye behtar modern fallback hai.',
    ],
  },
];
