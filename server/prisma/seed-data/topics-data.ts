import type { SeedCategory } from './topics-shared';
import { SQL_BASICS, API_BASICS } from './topics-foundations';
import { AUTH_BASICS, SD_BASICS } from './topics-foundations-2';

export const sqlCategory: SeedCategory = {
  slug: 'sql',
  name: 'SQL',
  description: 'Joins, grouping, window functions, indexes and injection — the queries interviewers ask you to write on a whiteboard.',
  icon: 'sql',
  group: 'data',
  topics: [
    ...SQL_BASICS,
    {
      slug: 'sql-select-where-order',
      title: 'SELECT, WHERE & ORDER BY',
      difficulty: 'EASY',
      summary: 'The clauses run in a fixed logical order, which is why you cannot use a SELECT alias in WHERE.',
      summaryHi: 'Clauses ek tay logical order mein chalte hain — isiliye SELECT ka alias WHERE mein use nahi kar sakte.',
      content: `Logical execution order (not the order you write them):

\`FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT\`

That single fact explains most beginner confusion:
- A **SELECT alias cannot be used in WHERE** (WHERE runs first) but **can** be used in ORDER BY.
- **WHERE filters rows**, **HAVING filters groups** — HAVING runs after GROUP BY.

\`NULL\` is not a value but "unknown", so \`= NULL\` is never true. Use \`IS NULL\` / \`IS NOT NULL\`. Likewise \`NOT IN (subquery)\` returns nothing if the subquery contains a NULL — a genuinely nasty production bug.`,
      contentHi: `Logical execution order (jis order mein aap likhte ho wo nahi):

\`FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT\`

Bas isi ek baat se zyadatar confusion door ho jata hai:
- **SELECT ka alias WHERE mein nahi chalega** (WHERE pehle chalta hai) par **ORDER BY mein chalega**.
- **WHERE rows filter karta hai**, **HAVING groups filter karta hai** — HAVING GROUP BY ke baad chalta hai.

\`NULL\` koi value nahi balki "unknown" hai, isliye \`= NULL\` kabhi true nahi hota. \`IS NULL\` / \`IS NOT NULL\` use karo. Isi tarah agar subquery mein ek bhi NULL ho to \`NOT IN (subquery)\` kuch bhi return nahi karta — production mein ye asli khatarnak bug hai.`,
      codeExample: `SELECT name, price * quantity AS total
FROM order_items
WHERE price * quantity > 100      -- must repeat the expression, alias not allowed here
ORDER BY total DESC               -- alias IS allowed here
LIMIT 10;`,
      commonMistakes: [
        'Using a SELECT alias inside WHERE.',
        'Comparing with = NULL instead of IS NULL.',
        'NOT IN against a subquery that can return NULL.',
        'SELECT * in production code, breaking when columns change.',
      ],
      interviewQuestions: [
        'What is the logical order of SQL clauses?',
        'Why can you use an alias in ORDER BY but not WHERE?',
        'Difference between WHERE and HAVING?',
        'What does NOT IN do when the subquery has a NULL?',
      ],
      practiceQuestions: ['Write a query for the 10 most expensive orders placed in the last 30 days.'],
      tags: ['sql', 'select', 'basics'],
    },

    {
      slug: 'sql-joins',
      title: 'JOINs',
      difficulty: 'MEDIUM',
      summary: 'INNER keeps matches, LEFT keeps every left row, and filtering a LEFT JOIN in WHERE silently turns it into an INNER JOIN.',
      summaryHi: 'INNER sirf matches rakhta hai, LEFT har left row rakhta hai, aur LEFT JOIN ko WHERE mein filter karne par wo chupchaap INNER JOIN ban jata hai.',
      content: `- **INNER JOIN** — rows matching in both tables.
- **LEFT JOIN** — every row from the left table; unmatched right columns are NULL.
- **RIGHT JOIN** — mirror of LEFT (usually rewritten as LEFT).
- **FULL OUTER** — everything from both sides.
- **CROSS JOIN** — cartesian product.
- **SELF JOIN** — a table joined to itself (employee → manager).

The classic trap: putting a condition on the right table in \`WHERE\` after a LEFT JOIN. NULL fails the comparison, the unmatched rows disappear, and you have written an INNER JOIN by accident. Put such conditions in the \`ON\` clause instead.

To find rows *without* a match: \`LEFT JOIN ... WHERE right.id IS NULL\` (the anti-join).`,
      contentHi: `- **INNER JOIN** — wahi rows jo dono tables mein match karein.
- **LEFT JOIN** — left table ki har row; match na hone par right columns NULL.
- **RIGHT JOIN** — LEFT ka ulta (aksar LEFT mein hi likh dete hain).
- **FULL OUTER** — dono taraf ka sab kuch.
- **CROSS JOIN** — cartesian product.
- **SELF JOIN** — table ko khud se join (employee → manager).

Classic trap: LEFT JOIN ke baad right table par condition \`WHERE\` mein lagana. NULL comparison fail karta hai, unmatched rows gayab ho jaati hain, aur galti se INNER JOIN ban jata hai. Aisi conditions \`ON\` clause mein lagao.

Jin rows ka match *nahi* hai unhe dhoondhne ke liye: \`LEFT JOIN ... WHERE right.id IS NULL\` (anti-join).`,
      codeExample: `-- accidentally an INNER JOIN
SELECT u.name, o.id FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid';

-- keeps users with no paid orders
SELECT u.name, o.id FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid';

-- users who never ordered
SELECT u.name FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
      commonMistakes: [
        'Filtering the right table in WHERE after a LEFT JOIN.',
        'Forgetting the ON clause and producing a cartesian product.',
        'Joining without indexes on the join columns.',
        'Using JOIN when EXISTS expresses the intent more cheaply.',
      ],
      interviewQuestions: [
        'Difference between INNER and LEFT JOIN?',
        'Why did my LEFT JOIN behave like an INNER JOIN?',
        'How do you find rows with no matching row in another table?',
        'What is a self join and when is it used?',
      ],
      practiceQuestions: [
        'List every user with their order count, including users with zero orders.',
        'Find employees earning more than their manager using a self join.',
      ],
      tags: ['sql', 'joins', 'must-know'],
    },

    {
      slug: 'sql-group-by-aggregates',
      title: 'GROUP BY, Aggregates & HAVING',
      difficulty: 'MEDIUM',
      summary: 'Aggregates collapse rows into groups. COUNT(*) counts rows, COUNT(col) skips NULLs — and that difference gets asked.',
      summaryHi: 'Aggregates rows ko groups mein simeṭ dete hain. COUNT(*) rows ginta hai, COUNT(col) NULLs chhod deta hai — aur yahi farq poocha jata hai.',
      content: `\`GROUP BY\` collapses rows; every selected column must either be in the GROUP BY or wrapped in an aggregate.

- \`COUNT(*)\` — all rows in the group.
- \`COUNT(col)\` — rows where \`col\` is **not NULL**.
- \`COUNT(DISTINCT col)\` — distinct non-null values.
- \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` ignore NULLs, so \`AVG\` divides by the count of non-null values, not the row count.

\`HAVING\` filters **after** grouping; \`WHERE\` filters **before**. Filtering in WHERE where possible is faster — fewer rows reach the grouping step.

Combining an aggregate with a LEFT JOIN is where \`COUNT(*)\` betrays you: unmatched rows still count as 1. Use \`COUNT(o.id)\` to count actual orders.`,
      contentHi: `\`GROUP BY\` rows ko simeṭ deta hai; har selected column ya to GROUP BY mein hona chahiye ya aggregate ke andar.

- \`COUNT(*)\` — group ki saari rows.
- \`COUNT(col)\` — wo rows jahan \`col\` **NULL nahi** hai.
- \`COUNT(DISTINCT col)\` — distinct non-null values.
- \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` NULLs ko ignore karte hain, isliye \`AVG\` non-null values ke count se divide karta hai, row count se nahi.

\`HAVING\` grouping ke **baad** filter karta hai; \`WHERE\` **pehle**. Jahan ho sake WHERE mein filter karna tez hai — grouping tak kam rows pahunchti hain.

Aggregate ko LEFT JOIN ke saath milane par \`COUNT(*)\` dhokha deta hai: unmatched rows bhi 1 gini jaati hain. Asli orders ginne ke liye \`COUNT(o.id)\` use karo.`,
      codeExample: `SELECT u.id, u.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total), 0) AS spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 2
ORDER BY spent DESC;`,
      commonMistakes: [
        'Using COUNT(*) with a LEFT JOIN and counting non-existent rows.',
        'Selecting a column that is neither grouped nor aggregated.',
        'Putting a row filter in HAVING when WHERE would be cheaper.',
        'Forgetting SUM returns NULL, not 0, when there are no rows.',
      ],
      interviewQuestions: [
        'Difference between COUNT(*) and COUNT(column)?',
        'WHERE vs HAVING?',
        'Why does COUNT(*) overcount with a LEFT JOIN?',
        'What does AVG do with NULLs?',
      ],
      practiceQuestions: ['Report each category with its product count and average price, excluding categories with under 3 products.'],
      tags: ['sql', 'group-by', 'aggregates'],
    },

    {
      slug: 'sql-subqueries-cte',
      title: 'Subqueries & CTEs',
      difficulty: 'MEDIUM',
      summary: 'CTEs name a step and make queries readable; correlated subqueries run per row and are usually the slow option.',
      summaryHi: 'CTEs ek step ko naam dete hain aur query padhne layak banate hain; correlated subqueries har row par chalti hain aur aksar dheemi hoti hain.',
      content: `A **CTE** (\`WITH x AS (...)\`) names an intermediate result. It is the readable way to express multi-step logic and can be **recursive** for hierarchies (org charts, category trees).

A **correlated subquery** references the outer row and therefore runs once per row — fine for small results, quadratic for large ones. A JOIN or window function is usually faster.

\`EXISTS\` vs \`IN\`: \`EXISTS\` short-circuits on the first match and handles NULLs safely; \`IN\` with a large or NULL-containing subquery is the riskier choice.

Note that in PostgreSQL a CTE is no longer an optimisation fence by default (since v12), so readability is now mostly free.`,
      contentHi: `**CTE** (\`WITH x AS (...)\`) ek beech ke result ko naam deta hai. Multi-step logic likhne ka ye sabse padhne layak tareeka hai, aur hierarchies (org chart, category tree) ke liye **recursive** bhi ho sakta hai.

**Correlated subquery** outer row ko refer karti hai, isliye har row par ek baar chalti hai — chhote results ke liye theek, bade ke liye quadratic. JOIN ya window function aksar tez hota hai.

\`EXISTS\` vs \`IN\`: \`EXISTS\` pehle match par hi ruk jata hai aur NULLs safely handle karta hai; badi ya NULL wali subquery ke saath \`IN\` zyada risky hai.

Dhyan raho: PostgreSQL v12 se CTE by default optimisation fence nahi raha, isliye readability ab lagbhag muft hai.`,
      codeExample: `WITH monthly AS (
  SELECT user_id, date_trunc('month', created_at) AS month, SUM(total) AS spent
  FROM orders GROUP BY 1, 2
)
SELECT u.name, m.month, m.spent
FROM monthly m JOIN users u ON u.id = m.user_id
WHERE m.spent > 1000;

-- EXISTS is safe with NULLs and stops at the first match
SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);`,
      commonMistakes: [
        'Correlated subqueries in the SELECT list over large tables.',
        'NOT IN with a nullable subquery column.',
        'Deeply nested subqueries where a CTE would be readable.',
      ],
      interviewQuestions: [
        'What is a CTE and when do you use one?',
        'Difference between a correlated and non-correlated subquery?',
        'EXISTS vs IN — which and why?',
        'How do you query a hierarchy?',
      ],
      practiceQuestions: ['Write a recursive CTE that returns an employee’s full management chain.'],
      tags: ['sql', 'cte', 'subquery'],
    },

    {
      slug: 'sql-indexes',
      title: 'Indexes & Query Plans',
      difficulty: 'HARD',
      summary: 'Indexes make reads fast and writes slower. Column order in a composite index decides whether it is used at all.',
      summaryHi: 'Indexes reads tez karte hain aur writes dheeme. Composite index mein column order hi tay karta hai ki wo use hoga bhi ya nahi.',
      content: `An index is a sorted structure (usually a B-tree) that turns a full scan into a lookup. The cost is real: every INSERT/UPDATE/DELETE must maintain it, and it consumes disk.

**Leftmost prefix rule.** An index on \`(user_id, created_at)\` serves \`WHERE user_id = ?\` and \`WHERE user_id = ? AND created_at > ?\`, but **not** \`WHERE created_at > ?\` alone. Column order is a design decision.

Things that silently disable an index:
- Wrapping the column in a function: \`WHERE LOWER(email) = ?\` (fix with an expression index).
- Leading wildcards: \`LIKE '%term'\`.
- Implicit type casts between the column and the parameter.

Always confirm with \`EXPLAIN ANALYZE\`. "Seq Scan on a big table" in a hot query is your signal.

Index what you filter, join and sort on — not every column.`,
      contentHi: `Index ek sorted structure (aksar B-tree) hai jo full scan ko lookup bana deta hai. Iski keemat asli hai: har INSERT/UPDATE/DELETE ko use maintain karna padta hai aur disk bhi lagti hai.

**Leftmost prefix rule.** \`(user_id, created_at)\` par bana index \`WHERE user_id = ?\` aur \`WHERE user_id = ? AND created_at > ?\` mein chalega, par akele \`WHERE created_at > ?\` mein **nahi**. Column order ek design decision hai.

Jo cheezein chupchaap index band kar deti hain:
- Column ko function mein lapetna: \`WHERE LOWER(email) = ?\` (expression index se theek karo).
- Shuru mein wildcard: \`LIKE '%term'\`.
- Column aur parameter ke beech implicit type cast.

Hamesha \`EXPLAIN ANALYZE\` se confirm karo. Hot query mein "Seq Scan on a big table" hi aapka signal hai.

Jin columns par filter, join aur sort karte ho unhi par index banao — har column par nahi.`,
      codeExample: `CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);

EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;
-- want: Index Scan. If it says Seq Scan, the index is not being used.`,
      commonMistakes: [
        'Indexing every column and slowing down writes.',
        'Wrong column order in a composite index.',
        'Functions or casts on the indexed column in WHERE.',
        'Assuming an index exists because a foreign key does — Postgres does not create one automatically.',
      ],
      interviewQuestions: [
        'How does a B-tree index work?',
        'What is the leftmost prefix rule?',
        'When does an index hurt?',
        'How do you tell whether a query uses an index?',
        'What is a covering index?',
      ],
      practiceQuestions: ['Take a slow query, read its plan, add the right index, and compare the plans.'],
      tags: ['sql', 'indexes', 'performance', 'must-know'],
    },

    {
      slug: 'sql-transactions-acid',
      title: 'Transactions & ACID',
      difficulty: 'HARD',
      summary: 'A transaction is all-or-nothing. Isolation levels trade correctness anomalies against concurrency.',
      summaryHi: 'Transaction ya poora chalta hai ya bilkul nahi. Isolation levels correctness anomalies aur concurrency ke beech trade-off hain.',
      content: `**ACID**: *Atomicity* (all or nothing), *Consistency* (constraints hold), *Isolation* (concurrent transactions do not corrupt each other), *Durability* (committed data survives a crash).

Isolation levels and what each still allows:
| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| READ UNCOMMITTED | yes | yes | yes |
| READ COMMITTED (Postgres default) | no | yes | yes |
| REPEATABLE READ | no | no | yes* |
| SERIALIZABLE | no | no | no |

Rules for real systems: keep transactions **short**, never hold one open across a network call, and always acquire locks in a **consistent order** to avoid deadlocks. Prisma exposes this as \`prisma.$transaction\`.

For "read then write" logic (decrement stock, transfer money), a plain read is not enough — use \`SELECT ... FOR UPDATE\` or an atomic update, or two concurrent requests will both see the old value.`,
      contentHi: `**ACID**: *Atomicity* (sab ya kuch nahi), *Consistency* (constraints bane rahein), *Isolation* (ek saath chalti transactions ek doosre ko kharab na karein), *Durability* (commit hua data crash ke baad bhi rahe).

Isolation levels aur har ek mein kya ab bhi ho sakta hai:
| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| READ UNCOMMITTED | haan | haan | haan |
| READ COMMITTED (Postgres default) | nahi | haan | haan |
| REPEATABLE READ | nahi | nahi | haan* |
| SERIALIZABLE | nahi | nahi | nahi |

Asli systems ke rules: transactions **chhoti** rakho, kisi network call ke aar-paar transaction khuli mat chhodo, aur deadlock se bachne ke liye locks hamesha **ek hi order** mein lo. Prisma mein ye \`prisma.$transaction\` hai.

"Padho phir likho" wali logic (stock ghatana, paisa transfer) mein simple read kaafi nahi — \`SELECT ... FOR UPDATE\` ya atomic update use karo, warna do concurrent requests dono purani value dekh lengi.`,
      codeExample: `-- lost update: both requests read 10, both write 9
BEGIN;
  SELECT stock FROM products WHERE id = 1 FOR UPDATE;   -- lock the row
  UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;

-- or make it atomic and skip the lock entirely
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;`,
      commonMistakes: [
        'Read-modify-write without a lock or atomic update (lost updates).',
        'Holding a transaction open across an external API call.',
        'Acquiring locks in different orders in different code paths, causing deadlocks.',
        'Assuming the default isolation level prevents phantoms.',
      ],
      interviewQuestions: [
        'Explain ACID.',
        'What are dirty, non-repeatable and phantom reads?',
        'What is a deadlock and how do you avoid it?',
        'How would you safely decrement inventory under concurrency?',
      ],
      practiceQuestions: ['Reproduce a lost update, then fix it with FOR UPDATE and again with an atomic update.'],
      tags: ['sql', 'transactions', 'acid', 'concurrency', 'must-know'],
    },

    {
      slug: 'sql-injection',
      title: 'SQL Injection',
      difficulty: 'MEDIUM',
      summary: 'String-concatenated queries let users write SQL. Parameterised queries are the fix; escaping is not.',
      summaryHi: 'String jodkar banayi gayi queries user ko SQL likhne deti hain. Ilaaj parameterised queries hain, escaping nahi.',
      content: `Injection happens when input is concatenated into SQL, so data becomes code:

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");
// email = "' OR '1'='1" returns every user
\`\`\`

The fix is **parameterised queries / prepared statements**. The driver sends the SQL and the values separately, so a parameter can never change the query's structure. An ORM like Prisma parameterises by default — but \`$queryRawUnsafe\` and template concatenation opt you back out.

Escaping by hand is not a fix: it is easy to get wrong per-encoding and per-dialect, and it does not survive refactoring.

Defence in depth: least-privilege database users (the app account should not own DDL), validate input shape, and never return raw database errors to the client — they leak schema.`,
      contentHi: `Injection tab hota hai jab input ko SQL mein jod diya jata hai, aur data hi code ban jata hai:

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");
// email = "' OR '1'='1" har user return kar dega
\`\`\`

Ilaaj hai **parameterised queries / prepared statements**. Driver SQL aur values alag-alag bhejta hai, isliye parameter kabhi query ka structure nahi badal sakta. Prisma jaisa ORM by default parameterise karta hai — par \`$queryRawUnsafe\` aur template concatenation aapko phir se bahar le aate hain.

Haath se escaping ilaaj nahi hai: har encoding aur dialect mein galti hona aasan hai, aur refactor ke baad wo tikti bhi nahi.

Defence in depth: least-privilege database users (app account ke paas DDL na ho), input ka shape validate karo, aur raw database errors client ko kabhi mat bhejo — unse schema leak hota hai.`,
      codeExample: `-- unsafe
SELECT * FROM users WHERE email = '<user input>';

-- safe: value can never become SQL
SELECT * FROM users WHERE email = $1;`,
      commonMistakes: [
        'Building SQL with template literals or string concatenation.',
        'Using $queryRawUnsafe with interpolated user input.',
        'Trusting manual escaping instead of parameters.',
        'Running the app as a superuser database role.',
      ],
      interviewQuestions: [
        'What is SQL injection and how do you prevent it?',
        'Why are prepared statements safe?',
        'Does using an ORM guarantee safety?',
        'How would you handle a dynamic ORDER BY column safely?',
      ],
      practiceQuestions: ['Find and fix an injectable query, including a safely whitelisted dynamic sort column.'],
      tags: ['sql', 'security', 'injection', 'must-know'],
    },

    {
      slug: 'db-normalization',
      title: 'Normalisation & Relationships',
      difficulty: 'MEDIUM',
      summary: 'Normalise to remove duplication, then denormalise deliberately where reads demand it.',
      summaryHi: 'Duplication hataane ke liye normalise karo, phir jahan reads maange wahan soch-samajh kar denormalise karo.',
      content: `- **1NF** — atomic values, no repeating groups (no comma-separated lists in a column).
- **2NF** — no partial dependency on part of a composite key.
- **3NF** — no transitive dependency; non-key columns depend only on the key.

Relationships: **one-to-one** (same table or a shared PK), **one-to-many** (FK on the many side), **many-to-many** (a join table, which is what \`UserProblemProgress\` is in this app).

**Denormalisation** is a deliberate trade: storing \`order_total\` avoids re-aggregating on every read, but now two places can disagree. Only do it when you have measured the read cost and have a plan to keep the copy correct.

Interviewers listen for the trade-off, not a recitation of the normal forms.`,
      contentHi: `- **1NF** — atomic values, repeating groups nahi (column mein comma-separated list nahi).
- **2NF** — composite key ke hisse par partial dependency nahi.
- **3NF** — transitive dependency nahi; non-key columns sirf key par depend karein.

Relationships: **one-to-one** (same table ya shared PK), **one-to-many** (many side par FK), **many-to-many** (join table — is app mein \`UserProblemProgress\` wahi hai).

**Denormalisation** ek soch-samajh kar liya gaya trade hai: \`order_total\` store karne se har read par dobara aggregate nahi karna padta, par ab do jagah ka data alag ho sakta hai. Ye tabhi karo jab read cost maap li ho aur copy ko sahi rakhne ka plan ho.

Interviewer normal forms ratna nahi, trade-off sunna chahta hai.`,
      codeExample: `-- many-to-many via a join table with a natural unique constraint
CREATE TABLE user_problem_progress (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'NOT_STARTED',
  PRIMARY KEY (user_id, problem_id)
);`,
      commonMistakes: [
        'Storing comma-separated ids in a column.',
        'Denormalising early for imagined performance problems.',
        'Missing ON DELETE behaviour, leaving orphan rows.',
        'No unique constraint on a join table, allowing duplicate pairs.',
      ],
      interviewQuestions: [
        'Explain 1NF, 2NF and 3NF.',
        'When would you denormalise?',
        'How do you model a many-to-many relationship?',
        'What does ON DELETE CASCADE do?',
      ],
      practiceQuestions: ['Model a course platform (students, courses, enrolments, grades) to 3NF.'],
      tags: ['database', 'normalization', 'modelling'],
    },
  ],
};

export const apiCategory: SeedCategory = {
  slug: 'rest-api',
  name: 'REST API',
  description: 'Resource design, status codes, idempotency and versioning.',
  icon: 'api',
  group: 'backend',
  topics: [
    ...API_BASICS,
    {
      slug: 'rest-design-principles',
      title: 'REST Design & Status Codes',
      difficulty: 'EASY',
      summary: 'Resources are nouns, HTTP methods are the verbs, and the status code is part of your API contract.',
      summaryHi: 'Resources noun hain, HTTP methods verb, aur status code aapke API contract ka hissa hai.',
      content: `URLs name **resources** (\`/users/42/orders\`), methods express the action. \`/getUser\` is RPC wearing a REST costume.

Status codes people get wrong:
- **200** OK · **201** Created (include a \`Location\`) · **204** No Content (for DELETE)
- **400** malformed · **401** not authenticated · **403** authenticated but not allowed · **404** missing · **409** conflict · **422** semantically invalid
- **429** rate limited · **500** your bug · **503** dependency down

The 401 vs 403 distinction gets asked constantly: 401 means "I do not know who you are", 403 means "I know exactly who you are and you still cannot".

Return a consistent error envelope (\`{ error: { code, message, details } }\`) so clients can branch on \`code\` instead of parsing prose.`,
      contentHi: `URLs **resources** ka naam hote hain (\`/users/42/orders\`), aur action methods se aata hai. \`/getUser\` REST ke bhes mein RPC hai.

Jin status codes mein log galti karte hain:
- **200** OK · **201** Created (\`Location\` bhejo) · **204** No Content (DELETE ke liye)
- **400** malformed · **401** authenticated nahi · **403** authenticated hai par allowed nahi · **404** nahi mila · **409** conflict · **422** semantically invalid
- **429** rate limited · **500** aapka bug · **503** dependency down

401 vs 403 baar-baar poocha jata hai: 401 matlab "mujhe nahi pata aap kaun ho", 403 matlab "mujhe theek se pata hai aap kaun ho, phir bhi allowed nahi".

Ek hi consistent error envelope do (\`{ error: { code, message, details } }\`) taaki clients message padhne ki jagah \`code\` par branch kar sakein.`,
      codeExample: `GET    /api/dsa                → 200 list
GET    /api/dsa/two-sum        → 200 | 404
POST   /api/notes              → 201 + Location
PATCH  /api/notes/:id          → 200 | 403 | 404
DELETE /api/notes/:id          → 204`,
      commonMistakes: [
        'Returning 200 with { success: false } inside.',
        'Using 403 when the user is not logged in at all.',
        'Verbs in URLs (/createUser).',
        'Different error shapes across endpoints.',
      ],
      interviewQuestions: [
        'Difference between 401 and 403?',
        'When do you return 201 vs 200?',
        'PUT vs PATCH?',
        'How do you design a consistent error response?',
      ],
      practiceQuestions: ['Design the endpoints and status codes for a bookmarking feature.'],
      tags: ['rest', 'api-design', 'http', 'must-know'],
    },

    {
      slug: 'rest-idempotency-versioning',
      title: 'Idempotency & Versioning',
      difficulty: 'MEDIUM',
      summary: 'GET, PUT and DELETE are idempotent; POST is not. Version the API before you have external clients, not after.',
      summaryHi: 'GET, PUT aur DELETE idempotent hain; POST nahi. API versioning external clients aane se pehle karo, baad mein nahi.',
      content: `**Idempotent** means repeating the request has the same effect as doing it once. GET, PUT, DELETE are idempotent by spec; POST is not — a retried payment creates two charges.

For unsafe operations over an unreliable network, accept an **\`Idempotency-Key\`** header: store the key with its response, and return the stored response on a repeat instead of re-executing. This is exactly how Stripe handles retries.

**Versioning** options: URL path (\`/api/v1/\`) — most visible and easiest to route; header/content negotiation — cleaner URLs, harder to debug and cache.

Rule: additive changes (new optional field) do not need a version; removing or renaming a field, or changing a type, does. Once a client you do not control depends on the shape, you cannot take anything away.`,
      contentHi: `**Idempotent** ka matlab hai ki request dobara bhejne se wahi asar ho jo ek baar bhejne se hua tha. Spec ke hisaab se GET, PUT, DELETE idempotent hain; POST nahi — retry hui payment do baar charge kar degi.

Unreliable network par unsafe operations ke liye **\`Idempotency-Key\`** header lo: key ke saath response store karo, aur dobara wahi key aane par stored response wapas do, dobara execute mat karo. Stripe bilkul aise hi retries handle karta hai.

**Versioning** ke options: URL path (\`/api/v1/\`) — sabse dikhne wala aur route karne mein aasan; header/content negotiation — URLs saaf, par debug aur cache karna mushkil.

Rule: additive changes (naya optional field) ke liye version nahi chahiye; field hataana, rename karna ya type badalna — inke liye chahiye. Jis din koi aisa client aapke shape par depend karne lage jo aapke control mein nahi, us din se kuch bhi hataana band.`,
      codeExample: `POST /api/payments
Idempotency-Key: 7f3c-2b91-...

// server: if key seen, return the stored response and do not charge again`,
      commonMistakes: [
        'Treating POST as safe to retry.',
        'Breaking response shapes without a version bump.',
        'Versioning individual endpoints inconsistently.',
        'Storing an idempotency key without also storing the response.',
      ],
      interviewQuestions: [
        'Which HTTP methods are idempotent?',
        'How do you make POST safe to retry?',
        'How would you version a public API?',
        'What counts as a breaking change?',
      ],
      practiceQuestions: ['Add idempotency-key support to a payment endpoint.'],
      tags: ['rest', 'idempotency', 'versioning', 'api-design'],
    },
  ],
};

export const authCategory: SeedCategory = {
  slug: 'authentication',
  name: 'Authentication',
  description: 'JWT vs sessions, password storage, refresh token rotation and the OWASP basics.',
  icon: 'lock',
  group: 'backend',
  topics: [
    ...AUTH_BASICS,
    {
      slug: 'auth-jwt-vs-sessions',
      title: 'JWT vs Sessions',
      difficulty: 'MEDIUM',
      summary: 'Sessions are stateful and instantly revocable; JWTs are stateless and cannot be un-issued before they expire.',
      summaryHi: 'Sessions stateful hain aur turant revoke ho sakti hain; JWTs stateless hain aur expire hone se pehle wapas nahi liye ja sakte.',
      content: `**Sessions** — the server stores session state; the cookie holds an opaque id. Revoking is a delete. Cost: shared session storage.

**JWT** — the token carries signed claims; the server verifies the signature and stores nothing. Cost: **you cannot revoke it**. Logging out only deletes the client's copy; the token stays valid until \`exp\`.

The standard resolution, and what this app implements:
- **Short-lived access token** (~15 min) — stateless, cheap to verify.
- **Long-lived refresh token** — stored server-side, revocable, **rotated** on every use so a stolen token is detectable.

Storage: refresh token in an \`httpOnly\`, \`Secure\`, \`SameSite\` cookie so JavaScript cannot read it. \`localStorage\` is readable by any XSS payload on the page.

Never put anything secret in a JWT payload — it is base64, not encrypted, and anyone can read it.`,
      contentHi: `**Sessions** — server session state rakhta hai; cookie mein sirf ek opaque id hoti hai. Revoke karna ek delete hai. Keemat: shared session storage.

**JWT** — token khud signed claims le kar chalta hai; server signature verify karta hai aur kuch store nahi karta. Keemat: **aap use revoke nahi kar sakte**. Logout sirf client ki copy hatata hai; token \`exp\` tak valid rehta hai.

Standard hal, aur yahi is app mein laga hai:
- **Short-lived access token** (~15 min) — stateless, verify karna sasta.
- **Long-lived refresh token** — server par stored, revocable, aur har use par **rotate**, taaki churaya hua token pakda ja sake.

Storage: refresh token \`httpOnly\`, \`Secure\`, \`SameSite\` cookie mein rakho taaki JavaScript use padh na sake. \`localStorage\` page par chalne wale kisi bhi XSS payload ko dikh jata hai.

JWT payload mein kabhi kuch secret mat rakho — wo base64 hai, encrypted nahi, koi bhi padh sakta hai.`,
      codeExample: `res.cookie('refreshToken', token, {
  httpOnly: true,      // invisible to JS — blocks XSS theft
  secure: isProd,      // HTTPS only
  sameSite: 'lax',     // blocks most CSRF
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});`,
      commonMistakes: [
        'Storing JWTs in localStorage where XSS can read them.',
        'Long-lived access tokens with no revocation path.',
        'Putting sensitive data in the JWT payload.',
        'Not rotating refresh tokens, so a stolen one works forever.',
        'Accepting the alg header from the token (the "alg: none" attack).',
      ],
      interviewQuestions: [
        'JWT vs session-based auth — trade-offs?',
        'How do you log out with JWTs?',
        'Where should tokens be stored in the browser?',
        'What is refresh token rotation and what does it detect?',
      ],
      practiceQuestions: ['Implement access + refresh tokens with rotation and reuse detection.'],
      tags: ['auth', 'jwt', 'sessions', 'security', 'must-know'],
    },

    {
      slug: 'auth-password-security',
      title: 'Password Storage & Common Attacks',
      difficulty: 'MEDIUM',
      summary: 'Hash with bcrypt or argon2, never encrypt or SHA-256. Rate limit login and keep error messages identical.',
      summaryHi: 'bcrypt ya argon2 se hash karo, encrypt ya SHA-256 kabhi nahi. Login par rate limit lagao aur error message ek jaisa rakho.',
      content: `Use a **slow, salted hash**: bcrypt (cost ≥ 12) or argon2id. SHA-256 is fast, which is precisely what makes it wrong — a GPU tries billions per second. Encryption is also wrong: it is reversible, so a key leak exposes every password.

Salts (built into bcrypt) stop rainbow tables and ensure two identical passwords hash differently.

Beyond hashing:
- **Identical error messages** for "no such user" and "wrong password", or you have built an account-enumeration oracle.
- **Rate limit** login attempts per account *and* per IP.
- **Constant-time comparison** for tokens (\`crypto.timingSafeEqual\`).
- **Never log** passwords, tokens or full auth headers.

If a hash leaks, users are protected only for as long as the hash is slow — which is the whole argument.`,
      contentHi: `**Dheema, salted hash** use karo: bcrypt (cost ≥ 12) ya argon2id. SHA-256 tez hai, aur yahi use galat banata hai — GPU arbon guesses per second karta hai. Encryption bhi galat hai: wo reversible hai, isliye key leak hote hi saare passwords khul jaate hain.

Salts (bcrypt mein built-in) rainbow tables rokte hain aur ye pakka karte hain ki do ek jaise passwords ka hash alag ho.

Hashing ke alawa:
- "User nahi mila" aur "password galat" ke liye **ek hi error message**, warna aapne account-enumeration oracle bana diya.
- Login attempts par **rate limit** — per account *aur* per IP.
- Tokens ke liye **constant-time comparison** (\`crypto.timingSafeEqual\`).
- Passwords, tokens ya poore auth headers **kabhi log mat karo**.

Hash leak ho jaye to users tabhi tak bache hain jab tak hash dheema hai — poori dalil yahi hai.`,
      codeExample: `const hash = await bcrypt.hash(password, 12);
const ok = await bcrypt.compare(password, user.passwordHash);

// same message either way — no account enumeration
if (!user || !ok) throw Unauthorized('Invalid email or password');`,
      commonMistakes: [
        'Hashing with MD5/SHA-256 or encrypting passwords.',
        'Different errors for unknown email vs wrong password.',
        'No rate limiting on login.',
        'Logging request bodies that contain credentials.',
      ],
      interviewQuestions: [
        'Why bcrypt instead of SHA-256?',
        'What is a salt and what attack does it stop?',
        'Why should login errors be identical?',
        'How do you protect against brute force?',
      ],
      practiceQuestions: ['Add per-account and per-IP rate limiting to a login endpoint.'],
      tags: ['auth', 'password', 'security', 'bcrypt', 'must-know'],
    },

    {
      slug: 'auth-xss-csrf-cors',
      title: 'XSS, CSRF & CORS',
      difficulty: 'HARD',
      summary: 'XSS runs attacker code on your page, CSRF rides the user\'s cookies, and CORS is a browser rule — not a server firewall.',
      summaryHi: 'XSS aapke page par attacker ka code chalata hai, CSRF user ki cookies ka fayda uthata hai, aur CORS ek browser rule hai — server firewall nahi.',
      content: `**XSS** — attacker JavaScript runs in your page and can read anything JS can read, including \`localStorage\`. Defences: escape output (React does by default), never \`dangerouslySetInnerHTML\` with user content, and a strict Content-Security-Policy.

**CSRF** — a third-party site triggers a request to your API and the browser attaches the user's cookies automatically. Defences: \`SameSite=Lax/Strict\` cookies, an anti-CSRF token, and checking Origin. Note: token-in-header auth is not CSRF-prone, because the browser will not attach an \`Authorization\` header for a cross-site form post.

**CORS** is often misunderstood: it does **not** protect your server. It tells the *browser* whether a page from origin A may read a response from origin B. A curl request ignores it entirely. \`Access-Control-Allow-Origin: *\` combined with \`credentials: true\` is invalid and browsers reject it.

The relationship interviewers probe: httpOnly cookies defeat XSS token theft but reintroduce CSRF, which SameSite then handles.`,
      contentHi: `**XSS** — attacker ka JavaScript aapke page par chalta hai aur wo sab padh sakta hai jo JS padh sakta hai, \`localStorage\` samet. Bachav: output escape karo (React by default karta hai), user content ke saath \`dangerouslySetInnerHTML\` kabhi nahi, aur strict Content-Security-Policy.

**CSRF** — koi third-party site aapke API par request trigger karti hai aur browser user ki cookies apne aap laga deta hai. Bachav: \`SameSite=Lax/Strict\` cookies, anti-CSRF token, aur Origin check. Dhyan raho: header wale token auth par CSRF nahi hota, kyunki cross-site form post par browser \`Authorization\` header nahi lagata.

**CORS** ko log aksar galat samajhte hain: ye aapke server ko **nahi** bachata. Ye sirf *browser* ko batata hai ki origin A ka page origin B ka response padh sakta hai ya nahi. curl ise poori tarah ignore karta hai. \`Access-Control-Allow-Origin: *\` aur \`credentials: true\` ek saath invalid hai, browsers reject kar dete hain.

Interviewer jo rishta kuredta hai: httpOnly cookies XSS se token chori rokti hain par CSRF wapas le aati hain, jise phir SameSite sambhalta hai.`,
      codeExample: `app.use(cors({
  origin: env.CLIENT_ORIGIN.split(','),   // never '*' with credentials
  credentials: true,
}));`,
      commonMistakes: [
        'Believing CORS protects the API from non-browser clients.',
        'Using Access-Control-Allow-Origin: * with credentials.',
        'Rendering user HTML with dangerouslySetInnerHTML.',
        'Cookie auth with SameSite=None and no CSRF token.',
      ],
      interviewQuestions: [
        'Difference between XSS and CSRF?',
        'Does CORS make an API secure?',
        'How does SameSite mitigate CSRF?',
        'Why is a token in a header less CSRF-prone than a cookie?',
      ],
      practiceQuestions: ['Configure CORS and cookies correctly for a separate frontend origin.'],
      tags: ['security', 'xss', 'csrf', 'cors', 'must-know'],
    },
  ],
};

export const systemDesignCategory: SeedCategory = {
  slug: 'system-design',
  name: 'System Design',
  description: 'Scaling, caching, queues and the trade-offs you are expected to name out loud.',
  icon: 'network',
  group: 'backend',
  topics: [
    ...SD_BASICS,
    {
      slug: 'sd-scaling-basics',
      title: 'Scaling: Vertical, Horizontal & Load Balancing',
      difficulty: 'MEDIUM',
      summary: 'Scale up until it is expensive, then scale out — which forces you to make the app stateless.',
      summaryHi: 'Pehle scale up karo jab tak mehenga na ho jaye, phir scale out — aur uske liye app ko stateless banana padega.',
      content: `**Vertical** (bigger machine) is simplest and has a ceiling. **Horizontal** (more machines) scales further but demands that servers hold **no local state** — no in-memory sessions, no uploads on local disk, no in-process cache you rely on for correctness.

A **load balancer** distributes traffic (round robin, least connections) and health-checks instances. Sticky sessions are a workaround for statefulness, not a solution: they break failover and skew load.

The usual order of attack:
1. Add indexes and fix N+1 queries — most "we need to scale" is really one bad query.
2. Cache the hot reads.
3. Add read replicas.
4. Move slow work to a queue.
5. Only then shard.

Always say what you would **measure** before each step; that is what separates a real answer from a buzzword list.`,
      contentHi: `**Vertical** (badi machine) sabse simple hai par uski ek limit hai. **Horizontal** (zyada machines) aage tak jaata hai, par shart ye hai ki servers par **koi local state na ho** — na in-memory sessions, na local disk par uploads, na koi in-process cache jispar correctness tiki ho.

**Load balancer** traffic baantta hai (round robin, least connections) aur instances ka health check karta hai. Sticky sessions statefulness ka jugaad hai, hal nahi: isse failover tootta hai aur load asamaan ho jata hai.

Aam tareeke se hamla is order mein:
1. Indexes lagao aur N+1 queries theek karo — "scale chahiye" aksar ek kharab query hoti hai.
2. Hot reads cache karo.
3. Read replicas jodo.
4. Dheema kaam queue par bhejo.
5. Sharding sabse aakhir mein.

Har step se pehle ye zaroor batao ki aap kya **measure** karoge; yahi asli jawab ko buzzword list se alag karta hai.`,
      commonMistakes: [
        'Jumping to microservices or sharding before measuring.',
        'Keeping sessions in process memory and then adding a second instance.',
        'Sticky sessions treated as a scaling strategy.',
        'Scaling the app tier while the database is the bottleneck.',
      ],
      interviewQuestions: [
        'Vertical vs horizontal scaling?',
        'Why must servers be stateless to scale horizontally?',
        'What would you measure before adding a cache?',
        'How does a load balancer decide where to send a request?',
      ],
      practiceQuestions: ['Design the scaling path for an app going from 100 to 100,000 daily users.'],
      tags: ['system-design', 'scaling', 'architecture'],
    },
    {
      slug: 'sd-caching-strategies',
      title: 'Caching Strategies',
      difficulty: 'MEDIUM',
      summary: 'Cache-aside is the default. The hard part is invalidation and what happens when the cache is empty.',
      summaryHi: 'Cache-aside default hai. Mushkil hissa invalidation hai aur ye ki cache khaali hone par kya hota hai.',
      content: `**Cache-aside (lazy loading)** — read cache, miss → read DB → populate cache. Simple, and stale only for the TTL. This is the default choice.
**Write-through** — write to cache and DB together; consistent, slower writes.
**Write-behind** — write to cache, flush to DB async; fast, and you can lose data.

Layers: browser → CDN → application cache (Redis) → database buffer cache. Each has its own invalidation story.

Failure modes worth naming:
- **Stampede** — a hot key expires and 1000 requests hit the DB at once. Fix with a lock/single-flight or jittered TTLs.
- **Penetration** — repeated queries for a key that does not exist bypass the cache entirely. Cache the negative result briefly.

Invalidation options are TTL (simple, eventually consistent), explicit delete on write (accurate, easy to miss a path), or versioned keys (safe, uses more memory).`,
      contentHi: `**Cache-aside (lazy loading)** — cache padho, miss ho to DB padho aur cache bharo. Simple, aur sirf TTL tak stale. Default yahi hai.
**Write-through** — cache aur DB dono mein saath likho; consistent, par writes dheeme.
**Write-behind** — cache mein likho, DB par async flush; tez, par data ja sakta hai.

Layers: browser → CDN → application cache (Redis) → database buffer cache. Har ek ki apni invalidation kahani hai.

Batane layak failure modes:
- **Stampede** — hot key expire hoti hai aur 1000 requests ek saath DB par gir jaati hain. Lock/single-flight ya jittered TTL se theek karo.
- **Penetration** — jo key hai hi nahi uske liye baar-baar query cache ko bypass kar deti hai. Negative result thodi der ke liye cache karo.

Invalidation ke options: TTL (simple, eventually consistent), write par explicit delete (sahi, par koi path chhoot sakta hai), ya versioned keys (safe, memory zyada).`,
      commonMistakes: [
        'Adding a cache without an invalidation plan.',
        'Very long TTLs on data users expect to be fresh.',
        'No protection against stampede on hot keys.',
        'Caching per-user data under a shared key.',
      ],
      interviewQuestions: [
        'Cache-aside vs write-through?',
        'How do you invalidate a cache?',
        'What is a cache stampede and how do you prevent it?',
        'What should never be cached?',
      ],
      practiceQuestions: ['Add Redis cache-aside to a hot endpoint with explicit invalidation on write.'],
      tags: ['system-design', 'caching', 'redis', 'performance'],
    },
    {
      slug: 'sd-queues-async',
      title: 'Queues & Async Processing',
      difficulty: 'MEDIUM',
      summary: 'Move slow or unreliable work off the request path. Assume every job runs at least twice.',
      summaryHi: 'Dheema ya bharosa na karne layak kaam request path se hata do. Maan kar chalo ki har job kam se kam do baar chalega.',
      content: `Anything slow, bursty or dependent on a third party belongs in a queue: emails, image processing, report generation, webhooks — and the code execution in this very app, which is why the execution service has a bounded job queue.

The API returns immediately (\`202 Accepted\` plus a job id) and a worker consumes the queue. This decouples throughput from latency and lets you absorb spikes.

Design rules:
- **Idempotent consumers.** Delivery is usually at-least-once, so a job *will* run twice. Key on a job id and make reprocessing harmless.
- **Bounded retries with backoff**, then a **dead-letter queue** — infinite retries turn one poison message into an outage.
- **Cap concurrency**, or the queue simply moves the overload downstream.
- Decide whether you need ordering; most queues only guarantee it per partition or not at all.`,
      contentHi: `Jo bhi dheema, bursty ya kisi third party par nirbhar ho wo queue mein jaana chahiye: emails, image processing, report generation, webhooks — aur isi app ka code execution, isiliye execution service mein bounded job queue hai.

API turant jawab deta hai (\`202 Accepted\` aur ek job id) aur worker queue se kaam uthata hai. Isse throughput aur latency alag ho jaate hain, aur spikes sambhal jaate hain.

Design rules:
- **Idempotent consumers.** Delivery aksar at-least-once hoti hai, isliye job do baar chalega hi. Job id par key banao aur dobara chalne ko harmless rakho.
- **Bounded retries with backoff**, phir **dead-letter queue** — infinite retries ek poison message ko poora outage bana dete hain.
- **Concurrency cap karo**, warna queue overload ko bas aage khiska deti hai.
- Tay karo ki ordering chahiye ya nahi; zyadatar queues ordering sirf per partition deti hain ya bilkul nahi.`,
      commonMistakes: [
        'Non-idempotent consumers that double-charge or double-send on retry.',
        'Unbounded retries with no dead-letter queue.',
        'Unbounded worker concurrency that overwhelms the database.',
        'Assuming global ordering.',
      ],
      interviewQuestions: [
        'When would you use a message queue?',
        'What does at-least-once delivery imply for your consumer?',
        'What is a dead-letter queue?',
        'How do you handle a job that keeps failing?',
      ],
      practiceQuestions: ['Design an email-sending pipeline that never sends the same email twice.'],
      tags: ['system-design', 'queue', 'async', 'reliability'],
    },
  ],
};

export const toolingCategory: SeedCategory = {
  slug: 'tooling',
  name: 'Git, Docker & Testing',
  description: 'The workflow questions that close out most interviews.',
  icon: 'terminal',
  group: 'practice',
  topics: [
    {
      slug: 'git-branching-and-history',
      title: 'Git: Branching, Merge vs Rebase',
      difficulty: 'EASY',
      summary: 'Merge preserves history, rebase rewrites it into a straight line. Never rebase a branch others have pulled.',
      summaryHi: 'Merge history bachata hai, rebase use seedhi line mein dobara likhta hai. Jo branch doosron ne pull kar li ho use kabhi rebase mat karo.',
      content: `**merge** creates a commit joining two histories — truthful, but the graph gets noisy.
**rebase** replays your commits on top of the target — linear and readable, but it **creates new commit hashes**. Rebasing a shared branch forces everyone else into a painful reconciliation.

The safe convention: rebase your *local, unpushed* work to tidy it; merge anything already shared.

Commands worth actually knowing:
- \`git revert\` — undoes a commit with a new commit. Safe on shared branches.
- \`git reset --hard\` — rewrites local history and **discards uncommitted work**. Local only.
- \`git stash\` — park changes temporarily.
- \`git cherry-pick\` — take one commit onto another branch.
- \`git reflog\` — the safety net; it can recover almost any "lost" commit.

Write commit messages explaining **why**, not what — the diff already shows what.`,
      contentHi: `**merge** do histories ko jodne wala commit banata hai — sach dikhata hai, par graph bhara-bhara ho jata hai.
**rebase** aapke commits ko target ke upar dobara chalata hai — linear aur padhne layak, par isse **naye commit hashes** bante hain. Shared branch rebase karne par baaki sabko takleef bhari reconciliation karni padti hai.

Safe convention: apna *local, bina push kiya* kaam rebase karke saaf karo; jo pehle se shared hai use merge karo.

Sach mein jaanne layak commands:
- \`git revert\` — commit ko naye commit se undo karta hai. Shared branches par safe.
- \`git reset --hard\` — local history dobara likhta hai aur **uncommitted kaam mita deta hai**. Sirf local par.
- \`git stash\` — changes thodi der ke liye rakh do.
- \`git cherry-pick\` — ek commit doosri branch par le jao.
- \`git reflog\` — safety net; lagbhag har "kho gaya" commit wapas mil jata hai.

Commit message mein **kyun** likho, kya nahi — kya to diff already dikha raha hai.`,
      codeExample: `git switch -c feat/editor
git rebase main            # local branch only
git revert <sha>           # safe undo on a shared branch
git reflog                 # find a commit you thought you lost`,
      commonMistakes: [
        'Rebasing or force-pushing a branch teammates have pulled.',
        'git reset --hard with uncommitted work in the tree.',
        'Committing .env files or node_modules.',
        'Commit messages that just say "fix".',
      ],
      interviewQuestions: [
        'Merge vs rebase — when do you use each?',
        'How do you undo a commit that is already pushed?',
        'What does git reflog do?',
        'How do you resolve a merge conflict?',
      ],
      practiceQuestions: ['Recover a commit removed by a hard reset using reflog.'],
      tags: ['git', 'workflow', 'must-know'],
    },

    {
      slug: 'docker-fundamentals',
      title: 'Docker: Images, Containers & Compose',
      difficulty: 'MEDIUM',
      summary: 'An image is a template, a container is a running instance. Layer caching and multi-stage builds decide your build speed and image size.',
      summaryHi: 'Image ek template hai, container uska chalta hua instance. Layer caching aur multi-stage builds hi build speed aur image size tay karte hain.',
      content: `An **image** is an immutable stack of layers; a **container** is an image plus a writable layer and a process. Containers share the host kernel, which is why they start in milliseconds while a VM takes seconds.

Two things that dominate a good Dockerfile:
- **Layer ordering.** Copy \`package.json\` and install *before* copying source, so a code change does not invalidate the dependency layer.
- **Multi-stage builds.** Compile in a build stage, copy only the artefacts into a slim runtime stage. This project's execution service does exactly that, and the runner images strip npm and pip entirely.

Volumes persist data outside the container lifecycle; a container's own filesystem dies with it. Compose wires multiple services, networks and volumes together for local development.

Security basics: run as a non-root user, do not bake secrets into images (they live in the layer history forever), pin base image tags, and keep images minimal — every package you do not install is one you never have to patch.`,
      contentHi: `**Image** layers ka immutable stack hai; **container** ek image plus writable layer plus chalta hua process. Containers host kernel share karte hain, isiliye milliseconds mein start hote hain jabki VM ko seconds lagte hain.

Achhe Dockerfile mein do cheezein sabse zyada matter karti hain:
- **Layer ordering.** \`package.json\` copy karke install *pehle* karo, source baad mein — taaki code badalne se dependency layer invalid na ho.
- **Multi-stage builds.** Build stage mein compile karo, sirf artefacts slim runtime stage mein copy karo. Is project ki execution service yahi karti hai, aur runner images se npm aur pip poori tarah hata diye gaye hain.

Volumes data ko container ke jeevan se bahar rakhte hain; container ka apna filesystem uske saath hi mar jata hai. Compose local development ke liye kai services, networks aur volumes ko jodta hai.

Security basics: non-root user se chalao, secrets image mein mat pakao (wo layer history mein hamesha reh jaate hain), base image tags pin karo, aur images chhoti rakho — jo package install hi nahi kiya, use patch bhi nahi karna padta.`,
      codeExample: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./          # cached unless dependencies change
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
USER node                      # never root
CMD ["node", "dist/index.js"]`,
      commonMistakes: [
        'COPY . . before npm install, busting the cache on every code change.',
        'Baking secrets into an image with ENV or ARG.',
        'Running the container as root.',
        'Using :latest so builds are not reproducible.',
        'Expecting data written inside a container to survive a restart.',
      ],
      interviewQuestions: [
        'Image vs container?',
        'How does Docker layer caching work?',
        'What is a multi-stage build and why use one?',
        'How do you persist data?',
        'How would you isolate untrusted code in a container?',
      ],
      practiceQuestions: [
        'Cut an image size by more than half with a multi-stage build.',
        'Write a compose file for an API, a database and a worker.',
      ],
      tags: ['docker', 'devops', 'containers', 'must-know'],
    },

    {
      slug: 'testing-pyramid',
      title: 'Testing: Unit, Integration & E2E',
      difficulty: 'MEDIUM',
      summary: 'Many fast unit tests, fewer integration tests, a handful of E2E. Test behaviour, not implementation.',
      summaryHi: 'Bahut saare tez unit tests, usse kam integration tests, aur ginti ke E2E. Behaviour test karo, implementation nahi.',
      content: `- **Unit** — one function or module, dependencies faked. Milliseconds. The bulk of your suite.
- **Integration** — several real pieces together (service + real database). Seconds. Catches wiring bugs unit tests cannot.
- **E2E** — a real browser against a running stack. Slow and flaky; keep only critical journeys (sign up, submit code, checkout).

The principle that matters more than the ratios: **test behaviour, not implementation**. A test asserting that an internal helper was called breaks on every refactor while catching no bugs. Assert on the output the caller observes.

Practical guidance: mock at the boundary (network, clock, filesystem), not internal collaborators. Coverage is a smoke detector, not a goal — 100% coverage of assertion-free tests proves nothing. And every bug fix should arrive with the regression test that would have caught it.`,
      contentHi: `- **Unit** — ek function ya module, dependencies fake. Milliseconds. Suite ka zyadatar hissa yahi.
- **Integration** — kai asli hisse ek saath (service + asli database). Seconds. Wo wiring bugs pakadta hai jo unit tests nahi pakad sakte.
- **E2E** — asli browser, chalte hue stack ke saath. Dheema aur flaky; sirf critical journeys rakho (sign up, code submit, checkout).

Ratio se zyada zaroori principle: **behaviour test karo, implementation nahi**. Jo test ye check karta hai ki koi internal helper call hua tha, wo har refactor par tootega aur bug ek bhi nahi pakdega. Us output par assert karo jo caller ko dikhta hai.

Practical baat: boundary par mock karo (network, clock, filesystem), internal collaborators par nahi. Coverage smoke detector hai, target nahi — bina assertions wale tests ka 100% coverage kuch sabit nahi karta. Aur har bug fix ke saath wo regression test aana chahiye jo use pehle pakad leta.`,
      codeExample: `// behaviour, not implementation
it('rejects a duplicate email', async () => {
  await userService.create({ email: 'a@b.com', password: 'secret123' });
  await expect(userService.create({ email: 'a@b.com', password: 'secret123' }))
    .rejects.toThrow(/already exists/);
});`,
      commonMistakes: [
        'Asserting that internal functions were called instead of asserting outcomes.',
        'An E2E-heavy suite that is slow and constantly flaky.',
        'Mocking the database in tests whose entire purpose is the query.',
        'Chasing a coverage number instead of covering risk.',
        'Tests that depend on execution order or share state.',
      ],
      interviewQuestions: [
        'Explain the testing pyramid.',
        'What should you mock and what should you not?',
        'How do you test an async API endpoint?',
        'Is 100% coverage a good goal?',
        'How do you deal with a flaky test?',
      ],
      practiceQuestions: [
        'Write unit tests for a service using a fake repository.',
        'Write an integration test for a protected endpoint including the auth flow.',
      ],
      tags: ['testing', 'quality', 'tdd'],
    },
  ],
};
