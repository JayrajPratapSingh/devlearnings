import type { SeedCategory } from './topics-shared';

/**
 * PostgreSQL specifically, as opposed to the generic SQL category.
 *
 * Everything here is something Postgres does that plain SQL knowledge does not
 * cover — JSONB, window functions, MVCC, upserts, the planner. Same Users /
 * Products / Orders domain as the rest of the app.
 */
export const postgresCategory: SeedCategory = {
  slug: 'postgresql',
  name: 'PostgreSQL',
  description: 'JSONB, window functions, upserts, MVCC and reading query plans — what Postgres gives you beyond plain SQL.',
  icon: 'postgres',
  group: 'data',
  topics: [
    {
      slug: 'pg-why-postgres',
      title: 'What makes Postgres different',
      difficulty: 'EASY',
      summary: 'A relational database that also does JSON, arrays, full-text search and window functions — often removing the need for a second datastore.',
      summaryHi: 'Aisa relational database jo JSON, arrays, full-text search aur window functions bhi karta hai — aksar doosre datastore ki zarurat hi khatam kar deta hai.',
      content: `Postgres is relational, but it stopped being *only* relational a long time ago.

| Want | Postgres answer | What people reach for instead |
|---|---|---|
| Flexible fields | \`JSONB\` (indexable) | MongoDB |
| A list in one column | native \`ARRAY\` | a join table |
| Search text | full-text search, \`pg_trgm\` | Elasticsearch |
| Ranking, running totals | window functions | doing it in application code |
| Queue-ish work | \`SKIP LOCKED\` | Redis |
| Vector search | \`pgvector\` | a vector database |

That table is the argument: a very large number of apps that "needed" a second database only needed a Postgres feature they had not met yet. Fewer moving parts means fewer things to keep in sync and fewer things to operate.

**Versus MySQL**, the practical differences that come up: Postgres has stricter typing and will refuse silently-wrong data that MySQL historically accepted; it has real \`CHECK\` constraints, proper \`JSONB\`, window functions that arrived far earlier, and transactional DDL — you can wrap \`ALTER TABLE\` in a transaction and roll it back.

**Where Postgres is genuinely weak:** connections are expensive (each is an OS process, not a thread), and heavy write-and-delete churn creates bloat that needs vacuuming. Both have their own topics here.`,
      contentHi: `Postgres relational hai, par bahut pehle hi *sirf* relational hona chhod chuka hai.

| Chahiye | Postgres ka jawab | Log iski jagah kya uthate hain |
|---|---|---|
| Flexible fields | \`JSONB\` (indexable) | MongoDB |
| Ek column mein list | native \`ARRAY\` | join table |
| Text search | full-text search, \`pg_trgm\` | Elasticsearch |
| Ranking, running totals | window functions | application code mein karna |
| Queue jaisa kaam | \`SKIP LOCKED\` | Redis |
| Vector search | \`pgvector\` | vector database |

Yahi table poori dalil hai: bahut saare aise apps jinhe "doosra database chahiye tha", unhe asal mein Postgres ka ek aisa feature chahiye tha jo unhone dekha hi nahi tha. Kam parts matlab kam cheezein sync mein rakhni aur kam cheezein chalani.

**MySQL ke muqable** jo practical farq aate hain: Postgres ki typing sakht hai aur wo chupchaap galat data reject kar deta hai jo MySQL historically maan leta tha; usme asli \`CHECK\` constraints, sahi \`JSONB\`, bahut pehle aaye window functions, aur transactional DDL hai — aap \`ALTER TABLE\` ko transaction mein lapet kar roll back kar sakte ho.

**Postgres sach mein kahan kamzor hai:** connections mehenge hain (har ek OS process hai, thread nahi), aur bahut write-delete hone par bloat banta hai jise vacuum karna padta hai. Dono ke apne topics yahan hain.`,
      commonMistakes: [
        'Adding MongoDB alongside Postgres purely for "flexible fields", when JSONB already does that and can be indexed.',
        'Doing ranking and running totals in application code because window functions were never learned.',
        'Assuming MySQL habits transfer exactly — Postgres is stricter about types and quoting.',
      ],
      interviewQuestions: [
        'Why choose Postgres over MySQL?',
        'When would you still add a second datastore?',
        'What is transactional DDL?',
      ],
      practiceQuestions: ['List the features of your current stack that Postgres could absorb.'],
      tags: ['postgresql', 'database', 'basics'],
    },

    {
      slug: 'pg-data-types',
      title: 'Types that matter: UUID, TIMESTAMPTZ, NUMERIC, ARRAY',
      difficulty: 'MEDIUM',
      summary: 'Pick TIMESTAMPTZ over TIMESTAMP, NUMERIC over FLOAT for money, and know when a UUID beats a serial id.',
      summaryHi: 'TIMESTAMP ki jagah TIMESTAMPTZ, paise ke liye FLOAT ki jagah NUMERIC, aur jaano ki UUID kab serial id se behtar hai.',
      content: `**Time. Always \`TIMESTAMPTZ\`.**
Despite the name, \`TIMESTAMPTZ\` does not store a timezone — it stores an absolute moment (UTC) and converts on the way in and out. \`TIMESTAMP\` stores wall-clock text with no idea what it means, so two servers in different regions will disagree about the same row. This is the single most common Postgres schema mistake, and it only reveals itself once you have users in a second timezone.

**Money. Always \`NUMERIC\`.**
\`FLOAT\` is binary and cannot represent 0.1 exactly. \`SELECT 0.1::float + 0.2::float\` gives \`0.30000000000000004\`. In a payments table that is a bug that compounds.

**Ids: \`BIGSERIAL\` or \`UUID\`?**

| | serial / identity | UUID |
|---|---|---|
| Size | 8 bytes | 16 bytes |
| Guessable | yes — \`/users/5\` invites \`/users/6\` | no |
| Generated by | the database | anyone, offline |
| Index locality | sequential, tight | random writes scatter the B-tree |

Use a serial by default. Use UUID when clients generate ids offline, when you merge data from multiple systems, or when a guessable id leaks information. **UUIDv7** is worth knowing: it is time-ordered, so it keeps UUID's uniqueness without UUIDv4's index fragmentation.

**\`ARRAY\` and \`ENUM\`** are genuinely useful — \`text[]\` for tags avoids a join table entirely, and it can be indexed with GIN. The catch with \`ENUM\` is that removing a value requires rewriting the type, so a \`CHECK\` constraint on text is often more flexible.`,
      contentHi: `**Time. Hamesha \`TIMESTAMPTZ\`.**
Naam ke bawajood \`TIMESTAMPTZ\` timezone store nahi karta — wo ek absolute pal (UTC) store karta hai aur aate-jaate convert karta hai. \`TIMESTAMP\` sirf wall-clock text rakhta hai bina jaane uska matlab kya hai, isliye alag regions ke do server ek hi row ke baare mein alag baat karenge. Ye Postgres schema ki sabse common galti hai, aur ye tabhi dikhti hai jab doosre timezone mein users aate hain.

**Paisa. Hamesha \`NUMERIC\`.**
\`FLOAT\` binary hai aur 0.1 ko theek se rakh hi nahi sakta. \`SELECT 0.1::float + 0.2::float\` \`0.30000000000000004\` deta hai. Payments table mein ye aisa bug hai jo badhta jata hai.

**Ids: \`BIGSERIAL\` ya \`UUID\`?**

| | serial / identity | UUID |
|---|---|---|
| Size | 8 bytes | 16 bytes |
| Andaza lagana | aasan — \`/users/5\` dekh kar \`/users/6\` | nahi |
| Banata kaun | database | koi bhi, offline |
| Index locality | sequential, tight | random writes B-tree bikher dete hain |

Default serial rakho. UUID tab jab clients offline ids banate hon, jab kai systems ka data milana ho, ya jab andaza lagne layak id se jaankari leak hoti ho. **UUIDv7** jaanne layak hai: wo time-ordered hai, isliye UUID ki uniqueness deta hai bina UUIDv4 wali index fragmentation ke.

**\`ARRAY\` aur \`ENUM\`** sach mein kaam ke hain — tags ke liye \`text[]\` poori join table bacha deta hai, aur GIN se index bhi ho jata hai. \`ENUM\` ki dikkat ye hai ki value hataane ke liye type dobara likhna padta hai, isliye text par \`CHECK\` constraint aksar zyada flexible hota hai.`,
      codeExample: `CREATE TABLE orders (
  id          BIGGENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- modern serial
  public_id   UUID NOT NULL DEFAULT gen_random_uuid(),      -- safe to expose
  user_id     BIGINT NOT NULL REFERENCES users(id),
  total       NUMERIC(10,2) NOT NULL CHECK (total >= 0),    -- money: never FLOAT
  tags        TEXT[] DEFAULT '{}',                          -- no join table
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','paid','shipped')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()            -- never TIMESTAMP
);`,
      expectedOutput: `-- why FLOAT is wrong for money
SELECT 0.1::float   + 0.2::float;    -- 0.30000000000000004
SELECT 0.1::numeric + 0.2::numeric;  -- 0.3`,
      commonMistakes: [
        'TIMESTAMP instead of TIMESTAMPTZ — silently wrong the moment a second timezone appears.',
        'FLOAT or REAL for money.',
        'Exposing sequential ids in URLs, so anyone can walk /users/1, /users/2 and count your users.',
        'UUIDv4 as a primary key on a write-heavy table, fragmenting the index.',
        'ENUM for something that will gain and lose values — altering it is painful.',
      ],
      interviewQuestions: [
        'TIMESTAMP vs TIMESTAMPTZ?',
        'Why never FLOAT for money?',
        'serial vs UUID for primary keys?',
        'What problem does UUIDv7 solve?',
      ],
      practiceQuestions: ['Review a schema and list every column whose type is subtly wrong.'],
      relatedProblemSlugs: [],
      tags: ['postgresql', 'types', 'schema', 'must-know'],
    },

    {
      slug: 'pg-jsonb',
      title: 'JSONB — flexible fields without leaving SQL',
      difficulty: 'MEDIUM',
      summary: 'JSONB stores JSON in a binary form you can query and index. Use it for genuinely variable data, not as an excuse to skip schema design.',
      summaryHi: 'JSONB, JSON ko binary roop mein rakhta hai jise query aur index kar sakte ho. Ise sach mein badalti hui data ke liye use karo, schema design se bachne ke bahane ke liye nahi.',
      content: `\`JSON\` stores the raw text. \`JSONB\` parses it into a binary form: slightly slower to write, far faster to query, and **indexable**. Use \`JSONB\` unless you need to preserve key order and whitespace exactly.

Operators worth memorising:

| Operator | Means | Example |
|---|---|---|
| \`->\` | get, as JSON | \`meta -> 'address'\` |
| \`->>\` | get, as **text** | \`meta ->> 'city'\` |
| \`#>>\` | deep get, as text | \`meta #>> '{address,city}'\` |
| \`@>\` | contains | \`meta @> '{"plan":"pro"}'\` |
| \`?\` | has this key | \`meta ? 'phone'\` |

The \`->\` vs \`->>\` distinction is the one that trips everyone: \`->\` returns JSON (so \`"Delhi"\` **with quotes**), \`->>\` returns plain text. Compare with \`->>\` when you want a string.

**Indexing.** A plain B-tree cannot help inside JSONB. Use **GIN**, which indexes the whole document for containment queries — that is what makes \`@>\` fast. For one specific hot field, an expression index on \`(meta ->> 'city')\` is smaller and faster than a GIN over everything.

**When JSONB is right:** genuinely variable data — per-product attributes, webhook payloads you store as received, feature flags, settings.

**When it is wrong:** as a dumping ground for fields you could not be bothered to model. Anything you filter, join or constrain on should be a real column. JSONB has no foreign keys, no NOT NULL on inner keys, and a typo in a key name fails silently instead of erroring.`,
      contentHi: `\`JSON\` raw text store karta hai. \`JSONB\` use binary roop mein parse karta hai: likhne mein thoda dheema, query mein kaafi tez, aur **indexable**. Jab tak key order aur whitespace bilkul waise hi na chahiye, \`JSONB\` hi use karo.

Yaad rakhne layak operators:

| Operator | Matlab | Example |
|---|---|---|
| \`->\` | lo, JSON ke roop mein | \`meta -> 'address'\` |
| \`->>\` | lo, **text** ke roop mein | \`meta ->> 'city'\` |
| \`#>>\` | gehra lo, text mein | \`meta #>> '{address,city}'\` |
| \`@>\` | ismein hai | \`meta @> '{"plan":"pro"}'\` |
| \`?\` | ye key hai | \`meta ? 'phone'\` |

\`->\` vs \`->>\` sabko fasata hai: \`->\` JSON deta hai (matlab \`"Delhi"\` **quotes ke saath**), \`->>\` plain text. String se compare karna ho to \`->>\` use karo.

**Indexing.** Plain B-tree JSONB ke andar madad nahi karta. **GIN** use karo, jo poore document ko containment queries ke liye index karta hai — isi se \`@>\` tez hota hai. Kisi ek khaas hot field ke liye \`(meta ->> 'city')\` par expression index chhota aur tez hota hai.

**JSONB kab sahi hai:** sach mein badalta hua data — per-product attributes, webhook payloads jo jaise aaye waise rakhe, feature flags, settings.

**Kab galat hai:** un fields ka kooda-ghar bana dena jinhe model karne ka mann nahi kiya. Jis par filter, join ya constraint lagta hai wo asli column hona chahiye. JSONB mein na foreign keys hain, na andar ki keys par NOT NULL, aur key ke naam mein typo error dene ki jagah chupchaap fail hota hai.`,
      codeExample: `-- product attributes genuinely differ per category
ALTER TABLE products ADD COLUMN attrs JSONB NOT NULL DEFAULT '{}';

-- containment: needs GIN
CREATE INDEX idx_products_attrs ON products USING GIN (attrs);
SELECT * FROM products WHERE attrs @> '{"color":"black"}';

-- one hot field: expression index is smaller and faster
CREATE INDEX idx_products_brand ON products ((attrs ->> 'brand'));
SELECT * FROM products WHERE attrs ->> 'brand' = 'Acme';

-- ->  gives JSON  ("black" WITH quotes)
-- ->> gives text  (black)
SELECT attrs -> 'color', attrs ->> 'color' FROM products LIMIT 1;`,
      commonMistakes: [
        'Using -> and comparing to a string — it returns JSON, so "Delhi" never equals Delhi.',
        'Filtering on a JSONB key with no GIN or expression index; every row gets parsed.',
        'Putting user_id or status in JSONB, losing foreign keys and constraints.',
        'Choosing JSON over JSONB and then wondering why it cannot be indexed.',
        'Typos in key names failing silently instead of erroring.',
      ],
      interviewQuestions: [
        'JSON vs JSONB?',
        'Difference between -> and ->>?',
        'How do you index a JSONB column?',
        'When should a field NOT be in JSONB?',
      ],
      practiceQuestions: [
        'Store per-category product attributes in JSONB and index the two you filter on.',
        'Rewrite a query that scans JSONB so it uses an index.',
      ],
      tags: ['postgresql', 'jsonb', 'indexes', 'must-know'],
    },

    {
      slug: 'pg-upsert-returning',
      title: 'UPSERT with ON CONFLICT, and RETURNING',
      difficulty: 'MEDIUM',
      summary: 'ON CONFLICT does insert-or-update atomically. RETURNING gets the row back without a second query.',
      summaryHi: 'ON CONFLICT insert-ya-update atomically karta hai. RETURNING row wapas de deta hai, doosri query ki zarurat nahi.',
      content: `The naive upsert is a race condition:

\`\`\`js
const existing = await findByEmail(email);   // two requests both find nothing
if (existing) await update(...);
else await insert(...);                       // both insert → duplicate key error
\`\`\`

Between the check and the insert, another request can insert the same row. Under load this fails in production and never in testing.

\`ON CONFLICT\` makes it one atomic statement — the database resolves the race, not your code:

\`\`\`sql
INSERT INTO users (email, name)
VALUES ('jay@x.com', 'Jay')
ON CONFLICT (email) DO UPDATE
  SET name = EXCLUDED.name, updated_at = now()
RETURNING id, email;
\`\`\`

\`EXCLUDED\` is the row that *would* have been inserted — that is how you reach the incoming values inside the update.

\`ON CONFLICT DO NOTHING\` is the other form: insert if new, silently skip if it exists. Useful for seeding and for idempotent event handling.

**\`RETURNING\` is the underrated half.** \`INSERT … RETURNING id\` gives you the generated id in the same round trip. It works on \`UPDATE\` and \`DELETE\` too, which makes "delete and tell me what you deleted" a single statement. Prisma exposes this as the return value of \`create\`.

One requirement: \`ON CONFLICT (col)\` needs a unique constraint or unique index on that column. Without one Postgres has no way to detect the conflict.`,
      contentHi: `Simple upsert ek race condition hai:

\`\`\`js
const existing = await findByEmail(email);   // do requests, dono ko kuch nahi milta
if (existing) await update(...);
else await insert(...);                       // dono insert → duplicate key error
\`\`\`

Check aur insert ke beech doosri request wahi row daal sakti hai. Load par ye production mein fail hota hai aur testing mein kabhi nahi.

\`ON CONFLICT\` ise ek atomic statement bana deta hai — race database sambhalta hai, aapka code nahi:

\`\`\`sql
INSERT INTO users (email, name)
VALUES ('jay@x.com', 'Jay')
ON CONFLICT (email) DO UPDATE
  SET name = EXCLUDED.name, updated_at = now()
RETURNING id, email;
\`\`\`

\`EXCLUDED\` wo row hai jo insert *hone wali thi* — update ke andar aane wali values isi se milti hain.

\`ON CONFLICT DO NOTHING\` doosra roop hai: naya ho to insert, pehle se ho to chupchaap chhod do. Seeding aur idempotent event handling ke liye kaam ka.

**\`RETURNING\` kam aanka gaya aadha hissa hai.** \`INSERT … RETURNING id\` usi round trip mein bani hui id de deta hai. Ye \`UPDATE\` aur \`DELETE\` par bhi chalta hai, isliye "delete karo aur batao kya delete hua" ek hi statement ban jata hai. Prisma ise \`create\` ke return value ke roop mein deta hai.

Ek shart: \`ON CONFLICT (col)\` ke liye us column par unique constraint ya unique index chahiye. Uske bina Postgres conflict pehchan hi nahi sakta.`,
      codeExample: `-- upsert a daily counter: one statement, no race
INSERT INTO study_sessions (user_id, day, minutes)
VALUES ($1, current_date, $2)
ON CONFLICT (user_id, day) DO UPDATE
  SET minutes = study_sessions.minutes + EXCLUDED.minutes
RETURNING minutes;

-- idempotent seeding
INSERT INTO topics (slug, title) VALUES ('js-closures', 'Closures')
ON CONFLICT (slug) DO NOTHING;

-- know what you deleted
DELETE FROM sessions WHERE expires_at < now() RETURNING id;`,
      commonMistakes: [
        'SELECT-then-INSERT in application code — a race that only fails under load.',
        'ON CONFLICT without a unique constraint on that column; nothing can conflict.',
        'Using the target table name instead of EXCLUDED to reach the incoming values.',
        'A second SELECT after INSERT just to get the id, when RETURNING already had it.',
      ],
      interviewQuestions: [
        'What is an upsert and why is check-then-insert wrong?',
        'What does EXCLUDED refer to?',
        'What does RETURNING save you?',
        'What does ON CONFLICT require?',
      ],
      practiceQuestions: ['Turn a check-then-insert into a single ON CONFLICT statement.'],
      tags: ['postgresql', 'upsert', 'concurrency', 'must-know'],
    },

    {
      slug: 'pg-window-functions',
      title: 'Window functions — ranking and running totals',
      difficulty: 'HARD',
      summary: 'Aggregate across related rows without collapsing them. GROUP BY loses the rows; a window keeps them.',
      summaryHi: 'Judi hui rows par aggregate karo bina unhe simeṭe. GROUP BY rows kho deta hai; window unhe rakhta hai.',
      content: `\`GROUP BY\` collapses many rows into one. A **window function** computes across a group but **keeps every row** — which is exactly what you need for "each order, plus that customer's running total".

The shape is always \`function() OVER (PARTITION BY … ORDER BY …)\`:
- \`PARTITION BY\` — the group, like GROUP BY but non-destructive
- \`ORDER BY\` — the order *within* the group, which is what makes running totals and \`LAG\` meaningful

The ones worth knowing:

| Function | Gives you |
|---|---|
| \`ROW_NUMBER()\` | 1, 2, 3 — ties broken arbitrarily |
| \`RANK()\` | 1, 2, 2, **4** — ties share, then a gap |
| \`DENSE_RANK()\` | 1, 2, 2, **3** — ties share, no gap |
| \`LAG/LEAD(col)\` | the previous / next row's value |
| \`SUM(x) OVER (ORDER BY …)\` | running total |

**The classic use: "top N per group".** Getting the 3 most recent orders *per user* is genuinely awkward without window functions — people write correlated subqueries or fetch everything and slice it in application code. With \`ROW_NUMBER()\` it is one query.

Note you cannot filter on a window function in \`WHERE\` — windows are computed after \`WHERE\`. Wrap it in a subquery or CTE and filter outside.

\`LAG\` is the other everyday one: comparing each row to the previous (day-over-day change, time between events) without a self-join.`,
      contentHi: `\`GROUP BY\` kai rows ko ek mein simeṭ deta hai. **Window function** group par calculate karta hai par **har row rakhta hai** — aur "har order, saath mein us customer ka running total" ke liye yahi chahiye.

Shakl hamesha \`function() OVER (PARTITION BY … ORDER BY …)\` hoti hai:
- \`PARTITION BY\` — group, GROUP BY jaisa par rows mitaye bina
- \`ORDER BY\` — group ke *andar* ka order, jisse running total aur \`LAG\` ka matlab banta hai

Jaanne layak:

| Function | Kya deta hai |
|---|---|
| \`ROW_NUMBER()\` | 1, 2, 3 — tie manmarzi se toota |
| \`RANK()\` | 1, 2, 2, **4** — tie share, phir gap |
| \`DENSE_RANK()\` | 1, 2, 2, **3** — tie share, gap nahi |
| \`LAG/LEAD(col)\` | pichhli / agli row ki value |
| \`SUM(x) OVER (ORDER BY …)\` | running total |

**Classic use: "har group ke top N".** Har user ke 3 sabse naye orders nikalna window functions ke bina sach mein takleef deh hai — log correlated subqueries likhte hain ya sab kuch la kar application code mein kaat te hain. \`ROW_NUMBER()\` se ye ek query hai.

Dhyan do: window function par \`WHERE\` mein filter nahi kar sakte — windows \`WHERE\` ke baad calculate hote hain. Use subquery ya CTE mein lapet kar bahar filter karo.

\`LAG\` doosra rozmarra ka hai: har row ko pichhli se compare karna (din-ba-din badlav, events ke beech ka time) bina self-join ke.`,
      codeExample: `-- 3 most recent orders per user, in one query
SELECT * FROM (
  SELECT o.*,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders o
) t
WHERE rn <= 3;          -- must filter OUTSIDE, windows run after WHERE

-- running total per user, keeping every row
SELECT user_id, created_at, total,
       SUM(total) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total
FROM orders;

-- change since the previous order — no self-join
SELECT created_at, total,
       total - LAG(total) OVER (ORDER BY created_at) AS change
FROM orders;`,
      commonMistakes: [
        'Filtering on a window result in WHERE — it does not exist yet; use a subquery or CTE.',
        'Using RANK when you meant DENSE_RANK (or ROW_NUMBER) and getting unexpected gaps.',
        'Omitting ORDER BY inside OVER for a running total, which then is not running at all.',
        'Fetching every row and computing ranks in application code.',
      ],
      interviewQuestions: [
        'GROUP BY vs a window function?',
        'ROW_NUMBER vs RANK vs DENSE_RANK?',
        'How do you get the top N rows per group?',
        'Why can you not use a window function in WHERE?',
      ],
      practiceQuestions: [
        'Write "each user\'s 3 most recent orders" with ROW_NUMBER.',
        'Compute a running total of daily revenue.',
      ],
      tags: ['postgresql', 'sql', 'window-functions', 'advanced'],
    },

    {
      slug: 'pg-indexes-advanced',
      title: 'Index types: B-tree, GIN, partial and expression',
      difficulty: 'HARD',
      summary: 'B-tree for comparisons, GIN for arrays/JSONB/full-text, partial for a hot subset, expression for computed values.',
      summaryHi: 'Comparisons ke liye B-tree, arrays/JSONB/full-text ke liye GIN, kisi hot subset ke liye partial, aur computed values ke liye expression.',
      content: `**B-tree** is the default and handles \`=\`, \`<\`, \`>\`, \`BETWEEN\`, \`ORDER BY\` and \`LIKE 'abc%'\`. Almost every index you create is one.

**GIN** indexes values *inside* a column — array elements, JSONB keys, full-text lexemes. This is what makes \`tags @> ARRAY['sql']\` or \`attrs @> '{"color":"black"}'\` fast. B-tree cannot do this.

**Partial** — index only the rows you actually query:

\`\`\`sql
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';
\`\`\`

If 2% of orders are pending and every dashboard query filters on that, this index is a fiftieth of the size and stays in memory. Very underused.

**Expression** — index the computed value you actually filter on:

\`\`\`sql
CREATE INDEX idx_users_lower_email ON users (LOWER(email));
-- now WHERE LOWER(email) = $1 can use an index
\`\`\`

Without it, wrapping a column in a function **disables the index**, because the stored value is not what you are comparing.

**Two production rules:**

Always \`CREATE INDEX CONCURRENTLY\` on a live table. A plain \`CREATE INDEX\` takes a lock that blocks writes for the whole build — on a large table that is an outage. Concurrently is slower and cannot run inside a transaction, but it does not block.

And check for unused indexes. Every index slows every write. \`pg_stat_user_indexes\` shows scan counts; an index with \`idx_scan = 0\` after weeks of traffic is pure cost.

**Postgres does not index foreign keys automatically.** It indexes primary keys and unique constraints only. A missing index on the FK side is one of the most common causes of slow joins and slow cascading deletes.`,
      contentHi: `**B-tree** default hai aur \`=\`, \`<\`, \`>\`, \`BETWEEN\`, \`ORDER BY\` aur \`LIKE 'abc%'\` sambhalta hai. Aap jo bhi index banate ho lagbhag wahi hota hai.

**GIN** column ke *andar* ki values index karta hai — array elements, JSONB keys, full-text lexemes. Isi se \`tags @> ARRAY['sql']\` ya \`attrs @> '{"color":"black"}'\` tez hota hai. B-tree ye kar hi nahi sakta.

**Partial** — sirf un rows par index jinhe aap sach mein query karte ho:

\`\`\`sql
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';
\`\`\`

Agar 2% orders pending hain aur har dashboard query usi par filter karti hai, to ye index pachaswan hisse ka hai aur memory mein hi rehta hai. Bahut kam use hota hai.

**Expression** — us computed value par index jispar aap sach mein filter karte ho:

\`\`\`sql
CREATE INDEX idx_users_lower_email ON users (LOWER(email));
-- ab WHERE LOWER(email) = $1 index use kar sakta hai
\`\`\`

Iske bina column ko function mein lapetna **index band kar deta hai**, kyunki stored value wahi nahi hai jisse aap compare kar rahe ho.

**Do production rules:**

Live table par hamesha \`CREATE INDEX CONCURRENTLY\`. Simple \`CREATE INDEX\` poore build ke dauraan writes rok dene wala lock leta hai — badi table par ye outage hai. Concurrently dheema hai aur transaction ke andar nahi chal sakta, par rokta nahi.

Aur unused indexes check karo. Har index har write ko dheema karta hai. \`pg_stat_user_indexes\` scan counts dikhata hai; hafton ke traffic ke baad bhi \`idx_scan = 0\` wala index sirf kharcha hai.

**Postgres foreign keys par apne aap index nahi banata.** Wo sirf primary keys aur unique constraints par banata hai. FK wali taraf index na hona dheeme joins aur dheeme cascading deletes ki sabse common wajah hai.`,
      codeExample: `-- never blocks writes on a live table
CREATE INDEX CONCURRENTLY idx_orders_user_created
  ON orders (user_id, created_at DESC);

-- inside arrays and JSONB
CREATE INDEX idx_products_tags ON products USING GIN (tags);

-- only the rows you query
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- find indexes nobody uses
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY relname;`,
      commonMistakes: [
        'CREATE INDEX without CONCURRENTLY on a live table — writes block for the whole build.',
        'Assuming foreign keys are indexed. Postgres does not do that.',
        'Wrapping a column in a function in WHERE without an expression index.',
        'Indexing everything, so writes crawl and half the indexes are never scanned.',
        'Reaching for a full index where a partial one would be a fraction of the size.',
      ],
      interviewQuestions: [
        'When would you use GIN instead of B-tree?',
        'What is a partial index good for?',
        'Why does LOWER(email) stop using the index?',
        'Why CONCURRENTLY?',
        'Does Postgres index foreign keys automatically?',
      ],
      practiceQuestions: ['Find unused indexes in a database and work out which are safe to drop.'],
      tags: ['postgresql', 'indexes', 'performance', 'must-know'],
    },

    {
      slug: 'pg-explain-analyze',
      title: 'Reading a query plan with EXPLAIN ANALYZE',
      difficulty: 'HARD',
      summary: 'EXPLAIN shows the plan; ANALYZE actually runs it and shows real timings. Compare estimated rows against actual — a big gap explains most bad plans.',
      summaryHi: 'EXPLAIN plan dikhata hai; ANALYZE use sach mein chala kar asli timings deta hai. Estimated aur actual rows compare karo — bade farq se hi zyadatar bure plans samajh aate hain.',
      content: `\`EXPLAIN\` shows what Postgres *intends* to do. \`EXPLAIN ANALYZE\` actually executes it and reports what happened. Only the second tells you the truth.

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) SELECT … ;
\`\`\`

**Read it inside-out and bottom-up** — the innermost, most indented node runs first.

Scan types, worst to best for a selective query:
- **Seq Scan** — reads the whole table. Correct for small tables or when returning most rows; a red flag on a large table returning few
- **Index Scan** — walks the index, then fetches rows
- **Index Only Scan** — the index had everything; the table was never touched. The best case
- **Bitmap Heap Scan** — an in-between for medium selectivity

Join types: **Nested Loop** is great when one side is tiny and terrible when it is not; **Hash Join** suits large unsorted sets; **Merge Join** suits pre-sorted input.

**The single most useful signal** is the gap between \`rows=\` (estimated) and \`actual rows=\`. Estimate 10, actual 400,000, and the planner made every downstream choice on a wrong assumption — typically because statistics are stale. \`ANALYZE tablename;\` refreshes them.

Other things to look for:
- \`Filter\` with a large \`Rows Removed by Filter\` — you fetched a lot and threw it away; the index is not selective enough
- \`Sort\` with \`Sort Method: external merge Disk\` — the sort spilled to disk, so \`work_mem\` is too small or the query returns too much
- \`BUFFERS\` showing huge \`read\` versus \`hit\` — the data is not cached`,
      contentHi: `\`EXPLAIN\` dikhata hai Postgres kya karne *ka iraada* rakhta hai. \`EXPLAIN ANALYZE\` use sach mein chala kar batata hai kya hua. Sach sirf doosra batata hai.

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) SELECT … ;
\`\`\`

**Ise andar se bahar aur neeche se upar padho** — sabse andar wala, sabse zyada indented node pehle chalta hai.

Scan types, selective query ke liye bure se achhe:
- **Seq Scan** — poori table padhta hai. Chhoti tables ya zyadatar rows lautane par sahi; badi table se kam rows par red flag
- **Index Scan** — index par chalta hai, phir rows laata hai
- **Index Only Scan** — index mein hi sab kuch tha; table chhui hi nahi. Sabse achha
- **Bitmap Heap Scan** — beech ki selectivity ke liye

Join types: **Nested Loop** tab badhiya jab ek taraf bahut chhoti ho aur warna bahut bura; **Hash Join** badi unsorted sets ke liye; **Merge Join** pehle se sorted input ke liye.

**Sabse kaam ka signal** hai \`rows=\` (estimated) aur \`actual rows=\` ke beech ka farq. Estimate 10, actual 4,00,000 — matlab planner ne aage ke saare faisle galat maan kar liye, aksar isliye ki statistics purani hain. \`ANALYZE tablename;\` unhe refresh karta hai.

Aur kya dekhna hai:
- \`Filter\` ke saath bada \`Rows Removed by Filter\` — aap bahut kuch laaye aur phenk diya; index kaafi selective nahi hai
- \`Sort\` mein \`Sort Method: external merge Disk\` — sort disk par gir gaya, matlab \`work_mem\` chhota hai ya query bahut kuch laut a rahi hai
- \`BUFFERS\` mein \`read\` bahut zyada aur \`hit\` kam — data cached nahi hai`,
      codeExample: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;

-- BAD
Seq Scan on orders  (cost=0..18500 rows=10 width=64)
                    (actual time=0.2..142.6 rows=411203 loops=1)
  Filter: (user_id = 42)
  Rows Removed by Filter: 588797     ← read 1M rows to return 20

-- GOOD, after CREATE INDEX ON orders (user_id, created_at DESC)
Index Scan using idx_orders_user_created  (actual time=0.03..0.09 rows=20 loops=1)`,
      commonMistakes: [
        'Running EXPLAIN without ANALYZE and trusting the estimates as facts.',
        'Ignoring the estimated-versus-actual gap, which is the clue to a stale-statistics problem.',
        'Treating every Seq Scan as bad — on a small table it is the right plan.',
        'Optimising a query nobody runs, instead of the one in the slow log.',
      ],
      interviewQuestions: [
        'EXPLAIN vs EXPLAIN ANALYZE?',
        'What does a big estimated/actual row gap mean?',
        'Index Scan vs Index Only Scan?',
        'When is a Seq Scan correct?',
      ],
      practiceQuestions: ['Take a slow query, read its plan, add an index, and compare the two plans.'],
      tags: ['postgresql', 'performance', 'explain', 'must-know'],
    },

    {
      slug: 'pg-mvcc-vacuum',
      title: 'MVCC, dead rows and VACUUM',
      difficulty: 'HARD',
      summary: 'Postgres never overwrites a row — it writes a new version and marks the old dead. VACUUM reclaims them; without it, tables bloat.',
      summaryHi: 'Postgres row ko kabhi overwrite nahi karta — wo naya version likhta hai aur purane ko dead mark karta hai. VACUUM unhe wapas leta hai; uske bina tables bloat karti hain.',
      content: `**MVCC — Multi-Version Concurrency Control.** An \`UPDATE\` does not change a row in place. Postgres writes a **new version** and marks the old one dead. Every transaction sees the versions that were valid when it started.

The payoff is the property people quote without knowing why: **readers never block writers, and writers never block readers.** A long analytics query does not hold up your writes.

The cost is **dead rows**. Update the same row a million times and the table holds a million dead versions taking up disk, which the planner must skip past. That is **bloat**.

**VACUUM** reclaims dead rows for reuse. **Autovacuum** runs it automatically, and mostly you leave it alone — but it can fall behind on very write-heavy tables, and then the table grows while its live row count does not.

\`\`\`sql
-- how much of this table is dead?
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;
\`\`\`

Two things worth knowing:

**\`VACUUM\` vs \`VACUUM FULL\`.** Plain \`VACUUM\` marks space reusable but does not shrink the file; it is safe and online. \`VACUUM FULL\` rewrites the table and returns disk to the OS, but takes an **exclusive lock** — nothing can read or write meanwhile. Never run it casually on production.

**\`ANALYZE\` is different.** It updates the statistics the planner uses to estimate row counts. Stale statistics are behind a large share of "the query was fast yesterday" mysteries.

**\`DELETE\` does not free space** — it only marks rows dead, so a big delete makes the table larger on disk until vacuumed. To empty a table entirely, \`TRUNCATE\` is instant and reclaims the space.`,
      contentHi: `**MVCC — Multi-Version Concurrency Control.** \`UPDATE\` row ko jagah par nahi badalta. Postgres **naya version** likhta hai aur purane ko dead mark karta hai. Har transaction wo versions dekhti hai jo uske shuru hone par valid the.

Fayda wahi property hai jo log bina wajah jaane bolte hain: **readers writers ko nahi rokte, aur writers readers ko nahi.** Lambi analytics query aapki writes nahi rokti.

Keemat hai **dead rows**. Ek hi row das lakh baar update karo aur table mein das lakh dead versions disk ghere baithe rehte hain, jinhe planner ko laangna padta hai. Yahi **bloat** hai.

**VACUUM** dead rows ki jagah dobara istemal ke liye chhod deta hai. **Autovacuum** ye khud chalata hai, aur aksar aap use chhod dete ho — par bahut write-heavy tables par wo peeche reh sakta hai, aur phir table badhti jati hai jabki live rows nahi.

\`\`\`sql
-- is table ka kitna hissa dead hai?
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;
\`\`\`

Do baatein jaanne layak:

**\`VACUUM\` vs \`VACUUM FULL\`.** Simple \`VACUUM\` jagah dobara use karne layak bana deta hai par file chhoti nahi karta; ye safe aur online hai. \`VACUUM FULL\` table dobara likhta hai aur disk OS ko lauta deta hai, par **exclusive lock** leta hai — us dauraan na koi padh sakta hai na likh. Production par ise yun hi kabhi mat chalao.

**\`ANALYZE\` alag cheez hai.** Wo planner ki statistics update karta hai jinse row counts ka andaza lagta hai. "Kal to query tez thi" wali gutthiyon ka bada hissa purani statistics hi hoti hain.

**\`DELETE\` jagah khaali nahi karta** — wo sirf rows dead mark karta hai, isliye bada delete karne par table vacuum hone tak disk par aur badi ho jati hai. Poori table khaali karni ho to \`TRUNCATE\` turant hota hai aur jagah wapas kar deta hai.`,
      commonMistakes: [
        'Running VACUUM FULL on production and locking the table for everyone.',
        'Expecting DELETE to free disk space immediately — it does the opposite until vacuumed.',
        'Ignoring n_dead_tup on a write-heavy table until queries slow down.',
        'Confusing VACUUM (reclaims space) with ANALYZE (refreshes statistics).',
      ],
      interviewQuestions: [
        'What is MVCC and what does it buy you?',
        'Why do dead rows accumulate?',
        'VACUUM vs VACUUM FULL?',
        'Why can DELETE make a table bigger?',
      ],
      practiceQuestions: ['Check dead tuple counts on the busiest table and see when autovacuum last ran.'],
      tags: ['postgresql', 'mvcc', 'vacuum', 'internals', 'advanced'],
    },

    {
      slug: 'pg-connection-pooling',
      title: 'Connections and pooling',
      difficulty: 'MEDIUM',
      summary: 'Each Postgres connection is an OS process, so they are expensive. Pool them, and be careful with serverless.',
      summaryHi: 'Har Postgres connection ek OS process hai, isliye mehenge hain. Unhe pool karo, aur serverless mein dhyan rakho.',
      content: `In Postgres, a connection is a **separate operating-system process**, not a lightweight thread. Each takes memory and a fork. That is why the default \`max_connections\` is around 100, not 10,000 — and why opening a connection per request falls over immediately.

**A pool** keeps a small set of connections open and lends them out. Ten pooled connections comfortably serve hundreds of concurrent requests, because each request only holds one for milliseconds.

\`\`\`
Requests ──▶ pool (10 connections) ──▶ Postgres
\`\`\`

Sizing is counter-intuitive: **bigger is not better.** Past roughly \`(2 × cores) + effective_spindles\`, more connections means more context switching and *less* throughput. A pool of 10–20 is right for most single-instance apps.

**The maths people miss:** the pool size is **per process**. Four app instances with a pool of 20 each is 80 connections, not 20. Multiply before you set \`max_connections\`.

**Serverless is the classic disaster.** Every cold start opens new connections, and a hundred concurrent invocations exhausts \`max_connections\` in seconds. The fix is an external pooler — **PgBouncer** or a provider's built-in one (Supabase, Neon, RDS Proxy) — which sits between your app and Postgres and multiplexes many clients onto few real connections.

One caveat: PgBouncer in **transaction mode** does not support prepared statements or session state, which is why ORMs including Prisma need \`pgbouncer=true\` in the connection string.

**Prisma specifically** manages its own pool, sized via \`connection_limit\` in the URL. Its default is \`(cores × 2) + 1\`, which is fine on one server and far too much across ten.`,
      contentHi: `Postgres mein connection ek **alag operating-system process** hai, halka thread nahi. Har ek memory aur ek fork leta hai. Isiliye default \`max_connections\` lagbhag 100 hai, 10,000 nahi — aur isiliye har request par connection kholna turant bikhar jata hai.

**Pool** kuch connections khuli rakhta hai aur udhaar deta hai. Das pooled connections aaram se sau se zyada concurrent requests sambhal lete hain, kyunki har request unhe sirf milliseconds ke liye pakadti hai.

\`\`\`
Requests ──▶ pool (10 connections) ──▶ Postgres
\`\`\`

Size ka hisaab ulta lagta hai: **bada matlab behtar nahi.** Lagbhag \`(2 × cores) + effective_spindles\` ke baad zyada connections matlab zyada context switching aur *kam* throughput. Zyadatar single-instance apps ke liye 10–20 ka pool sahi hai.

**Wo hisaab jo log bhool jaate hain:** pool size **per process** hoti hai. 20 wale pool ke chaar app instances matlab 80 connections, 20 nahi. \`max_connections\` set karne se pehle guna karo.

**Serverless classic disaster hai.** Har cold start nayi connections kholta hai, aur sau concurrent invocations seconds mein \`max_connections\` khatam kar dete hain. Ilaaj hai external pooler — **PgBouncer** ya provider ka apna (Supabase, Neon, RDS Proxy) — jo aapki app aur Postgres ke beech baith kar kai clients ko thodi asli connections par chalata hai.

Ek shart: **transaction mode** wala PgBouncer prepared statements aur session state support nahi karta, isiliye Prisma samet ORMs ko connection string mein \`pgbouncer=true\` chahiye.

**Prisma khaas taur par** apna pool khud chalata hai, jiska size URL mein \`connection_limit\` se set hota hai. Uska default \`(cores × 2) + 1\` hai, jo ek server par theek hai aur das par bahut zyada.`,
      codeExample: `# one app instance: a small pool is correct
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"

# behind PgBouncer in transaction mode
DATABASE_URL="postgresql://user:pass@pooler:6432/db?pgbouncer=true&connection_limit=1"`,
      commonMistakes: [
        'Opening a connection per request instead of using a pool.',
        'Setting a huge pool "for performance" — past a point it reduces throughput.',
        'Forgetting the pool is per process, then exhausting max_connections after scaling out.',
        'Serverless without an external pooler.',
        'PgBouncer transaction mode without pgbouncer=true, which breaks prepared statements.',
      ],
      interviewQuestions: [
        'Why are Postgres connections expensive?',
        'How do you size a pool?',
        'Why does serverless need PgBouncer?',
        'What breaks in PgBouncer transaction mode?',
      ],
      practiceQuestions: ['Work out the total connections your app opens across all instances at peak.'],
      tags: ['postgresql', 'pooling', 'scaling', 'production'],
    },

    {
      slug: 'pg-migrations-seeding',
      title: 'Migrations, seeding and safe schema changes',
      difficulty: 'MEDIUM',
      summary: 'A migration is a recorded, repeatable schema change. Seeding fills a database with starting data. Both are code, and both get committed.',
      summaryHi: 'Migration ek record ki hui, dobara chalne wali schema change hai. Seeding database mein shuruaati data bharti hai. Dono code hain, aur dono commit hote hain.',
      content: `**A migration is a diary entry for your database.** You add a column, and instead of clicking around in a GUI, you write the change to a file. Your teammate runs it and gets the identical database. So does the production server.

Without migrations you get the classic disaster: it works on your machine, and nobody can reproduce why.

\`\`\`bash
prisma migrate dev --name add_phone_to_user   # write the entry AND apply it
prisma migrate deploy                          # apply pending entries (production)
prisma db push                                 # no history — prototyping only
\`\`\`

**\`migrate\` versus \`db push\`** is the distinction people get wrong. \`db push\` shoves your schema at the database and records nothing — fast for solo prototyping, useless for a team, because there is no history to replay. \`migrate\` writes a numbered SQL file that anyone can run in order. Use \`db push\` while a schema is still molten; switch to \`migrate\` the moment anyone else depends on it.

**Rules that keep a team out of trouble:**

1. **Commit migrations.** They are source code.
2. **Never edit a migration others have already run.** Their database has recorded it as applied, so your edit will never execute there. Write a new one.
3. **Read the SQL before production.** \`prisma migrate diff\` or \`sqlmigrate\` shows exactly what will run.
4. **Migrations should be forward-only in production.** "Roll back" in practice means writing a new migration that undoes it.

**The dangerous change: adding a NOT NULL column to a table that already has rows.** What goes in the existing rows? The safe shape is three deploys — add the column nullable, backfill it, then add the constraint. One deploy that does all three locks the table and fails on any real data.

**Seeding** is different from migrating. A migration changes *shape*; a seed adds *content* — reference data, and sample data for development. Make it **idempotent** (upsert on a natural key, not blind insert) so running it twice is safe. That is exactly how this app's seed works: it upserts on slug, so re-running after editing content updates rows without touching your progress.

**Never seed fake users into production.** Keep reference data (categories, plans) separate from development fixtures.`,
      contentHi: `**Migration aapke database ki diary entry hai.** Aap ek column jodte ho, aur GUI mein click karne ki jagah wo badlav file mein likh dete ho. Aapka teammate use chalata hai aur bilkul wahi database paata hai. Production server bhi.

Migrations ke bina classic disaster hota hai: aapki machine par chalta hai, aur koi dobara bana nahi paata ki kyun.

\`\`\`bash
prisma migrate dev --name add_phone_to_user   # entry likho AUR lagao
prisma migrate deploy                          # pending entries lagao (production)
prisma db push                                 # koi history nahi — sirf prototyping
\`\`\`

**\`migrate\` vs \`db push\`** wahi farq hai jo log galat samajhte hain. \`db push\` aapka schema database par thopta hai aur kuch record nahi karta — akele prototyping ke liye tez, team ke liye bekaar, kyunki dobara chalane ko history hai hi nahi. \`migrate\` ek numbered SQL file likhta hai jise koi bhi order mein chala sakta hai. Jab tak schema pighla hua hai \`db push\` chalao; jis din koi aur uspar depend kare, \`migrate\` par aa jao.

**Team ko bachane wale rules:**

1. **Migrations commit karo.** Ye source code hain.
2. **Jo migration doosre chala chuke hain use kabhi edit mat karo.** Unke database mein wo applied likha hai, isliye aapka badlav wahan kabhi chalega hi nahi. Nayi likho.
3. **Production se pehle SQL padho.** \`prisma migrate diff\` ya \`sqlmigrate\` dikha deta hai ki kya chalega.
4. **Production mein migrations aage hi jaati hain.** "Roll back" ka practical matlab hai nayi migration likhna jo use undo kare.

**Khatarnak badlav: bhare hue table mein NOT NULL column jodna.** Purani rows mein kya jayega? Safe tareeka teen deploy hai — column nullable jodo, backfill karo, phir constraint lagao. Ek hi deploy mein teeno karne par table lock hoti hai aur asli data par fail ho jati hai.

**Seeding** migrating se alag hai. Migration *shakl* badalti hai; seed *content* daalti hai — reference data, aur development ke liye sample data. Use **idempotent** banao (natural key par upsert, andha insert nahi) taaki dobara chalana safe ho. Is app ka seed bilkul aise hi kaam karta hai: wo slug par upsert karta hai, isliye content badal kar dobara chalane par rows update hoti hain par aapka progress nahi chhua jata.

**Production mein nakli users kabhi seed mat karo.** Reference data (categories, plans) aur development fixtures alag rakho.`,
      codeExample: `-- ❌ one deploy: locks the table and fails if any rows exist
ALTER TABLE users ADD COLUMN phone TEXT NOT NULL;

-- ✅ three deploys, no lock, no failure
-- 1
ALTER TABLE users ADD COLUMN phone TEXT;
-- 2  (backfill in batches so you never lock the whole table)
UPDATE users SET phone = '' WHERE phone IS NULL;
-- 3
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;`,
      commonMistakes: [
        'Putting migrations in .gitignore, so nobody else can rebuild the schema.',
        'Editing a migration teammates have already applied — it will never run on their database.',
        'db push on a shared project, leaving no history to replay.',
        'Adding a NOT NULL column with no default to a populated table.',
        'A seed that blindly inserts, so running it twice duplicates everything.',
        'Seeding development fixtures into production.',
      ],
      interviewQuestions: [
        'What is a database migration and why not just change the database directly?',
        'migrate vs db push?',
        'How do you add a NOT NULL column to a table that already has data?',
        'How do you roll back a migration in production?',
        'What makes a seed script idempotent?',
      ],
      practiceQuestions: [
        'Write a three-step migration that adds a required column to a populated table.',
        'Make a seed script safe to run twice.',
      ],
      tags: ['postgresql', 'migrations', 'seeding', 'prisma', 'must-know'],
    },
  ],
};
