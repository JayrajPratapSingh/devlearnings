import type { SeedTopic } from './topics-shared';

/**
 * Beginner entry points for the stacks that did not have one.
 *
 * An audit of difficulty spread found three real holes:
 *   · **authentication** and **system-design** had no EASY topic at all, so the
 *     first thing a beginner met was JWT-vs-sessions or caching strategies.
 *   · **sql** taught SELECT and never taught INSERT, UPDATE or DELETE — you
 *     could read a database with the material but never write to one.
 *   · **rest-api** had two topics for an area that comes up in every interview.
 *
 * These are kept in their own file rather than appended to `topics-data.ts`
 * because they share a voice — each one assumes the reader has never met the
 * subject before — and mixing them into files written for a more experienced
 * reader is how that voice drifts.
 */

/* ═══════════════════════════════ SQL basics ═══════════════════════════════ */

export const SQL_BASICS: SeedTopic[] = [
  {
    slug: 'sql-what-is-a-database',
    title: 'What a database actually is',
    difficulty: 'EASY',
    summary: 'An organised store you can ask questions of. Tables are the sheets, rows are the records, columns are the fields — and unlike a file, many people can use it safely at once.',
    summaryHi: 'Ek vyavasthit store jisse aap sawaal poochh sakte ho. Tables sheets hain, rows records, columns fields — aur file ke ulat, ise kai log ek saath surakshit tareeke se use kar sakte hain.',
    content: `Before any syntax, the shape:

- **Database** — the whole store (one per application, usually)
- **Table** — one kind of thing. \`users\`, \`orders\`, \`products\`
- **Row** — one actual thing. One user. Sometimes called a record.
- **Column** — one piece of information every row has. \`email\`, \`created_at\`

A table is a spreadsheet with rules.

**Why not just use files?**

You could store users in a JSON file. It works until:

- **Two people write at once** and one overwrites the other
- **You want "all orders over ₹500 from last week"** and now you are loading the whole file into memory and filtering by hand
- **The file is 2 GB** and you cannot load it at all
- **The power cuts mid-write** and the file is now corrupt
- **You need the same data from two servers**

A database solves all five. That is the entire pitch.

**Primary key** — the column that uniquely identifies a row. Usually \`id\`. Two users can share a name; they cannot share an id.

**Foreign key** — a column that points at another table's primary key. \`orders.user_id\` points at \`users.id\`. This is what "relational" means: rows in one table refer to rows in another, and the database **enforces** that the target exists.

**SQL** (Structured Query Language) is how you talk to it. It reads almost like English on purpose:

\`\`\`sql
SELECT name FROM users WHERE city = 'Delhi';
\`\`\`

*Get the name, from users, where the city is Delhi.*

**The two families you will hear about**

- **SQL / relational** — Postgres, MySQL. Fixed structure, strong relationships, refuses bad data.
- **NoSQL / document** — MongoDB. Flexible structure, fewer built-in guarantees.

Start with relational. Most applications are relational whether or not their authors admit it.`,
    contentHi: `Kisi bhi syntax se pehle, dhaancha:

- **Database** — poora store (aam taur par ek application ka ek)
- **Table** — ek kism ki cheez. \`users\`, \`orders\`, \`products\`
- **Row** — ek asli cheez. Ek user. Ise record bhi kehte hain.
- **Column** — ek jaankari jo har row mein hoti hai. \`email\`, \`created_at\`

Table matlab niyamon wali spreadsheet.

**Sirf files kyun nahi?**

Aap users ko JSON file mein rakh sakte ho. Ye tab tak chalta hai jab tak:

- **Do log ek saath likhein** aur ek doosre ko mita de
- **Aapko "pichhle hafte ke ₹500 se upar ke saare orders" chahiye** aur ab poori file memory mein laa kar haath se chhaan rahe ho
- **File 2 GB ki ho** aur load hi na ho
- **Likhte waqt bijli jaye** aur file kharab ho jaye
- **Wahi data do servers se chahiye ho**

Database ye paanchon hal karta hai. Poori baat yahi hai.

**Primary key** — wo column jo row ko alag pehchanta hai. Aam taur par \`id\`. Do users ka naam ek ho sakta hai; id nahi.

**Foreign key** — wo column jo doosri table ki primary key par ishara karta hai. \`orders.user_id\` \`users.id\` par ishara karta hai. "Relational" ka matlab yahi hai: ek table ki rows doosri ki rows ko reference karti hain, aur database **lagu karta hai** ki wo target maujood ho.

**SQL** (Structured Query Language) isse baat karne ka tareeka hai. Ye jaan-boojh kar lagbhag English jaisa padha jata hai:

\`\`\`sql
SELECT name FROM users WHERE city = 'Delhi';
\`\`\`

*Naam lao, users se, jahan city Delhi hai.*

**Do parivaar jinke baare mein sunoge**

- **SQL / relational** — Postgres, MySQL. Tay dhaancha, mazboot rishte, kharab data mana kar deta hai.
- **NoSQL / document** — MongoDB. Lachila dhaancha, kam built-in guarantee.

Shuruaat relational se karo. Zyadatar applications relational hoti hain, chahe unke banane wale maanein ya na maanein.`,
    codeExample: `-- A table is a shape. This is how you declare one.
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,      -- unique, auto-numbered
  name       TEXT NOT NULL,           -- must be provided
  email      TEXT NOT NULL UNIQUE,    -- must be provided AND unique
  city       TEXT,                    -- optional
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders point back at users. That pointer is the foreign key.
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total   NUMERIC(10,2) NOT NULL
);

SELECT name FROM users WHERE city = 'Delhi';`,
    commonMistakes: [
      'Storing application data in a JSON file "for now" and discovering the concurrency problem in production.',
      'No primary key, then having no reliable way to refer to a single row.',
      'Skipping foreign keys, so an order can point at a user who does not exist and nothing complains.',
      'Assuming NoSQL is the modern default. Most applications have relationships, and relational databases are built for those.',
    ],
    interviewQuestions: [
      'What is a primary key and why does every table need one?',
      'What does a foreign key enforce?',
      'Why use a database instead of writing to a file?',
      'What does "relational" actually mean?',
    ],
    practiceQuestions: [
      'Design tables for a blog: users, posts and comments, with the right keys between them.',
      'List three things that go wrong if two people write to the same file at once.',
    ],
    tags: ['sql', 'database', 'basics', 'must-know'],
  },

  {
    slug: 'sql-insert-update-delete',
    title: 'Writing data: INSERT, UPDATE, DELETE',
    difficulty: 'EASY',
    summary: 'The three statements that change data — and the missing WHERE clause that has ruined more production databases than any other single mistake.',
    summaryHi: 'Teen statements jo data badalte hain — aur wo chhoota hua WHERE jo kisi bhi ek galti se zyada production databases barbaad kar chuka hai.',
    content: `\`SELECT\` reads. These three write.

**INSERT — add a new row**

\`\`\`sql
INSERT INTO users (name, email) VALUES ('Asha', 'asha@x.com');
\`\`\`

Insert several at once by adding more value groups — one statement is far faster than a loop of statements, because each statement is a round trip.

\`RETURNING\` gives you back the generated id in the same query, saving a second lookup:

\`\`\`sql
INSERT INTO users (name) VALUES ('Asha') RETURNING id;
\`\`\`

**UPDATE — change existing rows**

\`\`\`sql
UPDATE users SET city = 'Mumbai' WHERE id = 7;
\`\`\`

**DELETE — remove rows**

\`\`\`sql
DELETE FROM users WHERE id = 7;
\`\`\`

**The mistake that matters more than all the syntax**

\`\`\`sql
UPDATE users SET city = 'Mumbai';   -- no WHERE → EVERY user now lives in Mumbai
DELETE FROM users;                   -- no WHERE → every user is gone
\`\`\`

There is no confirmation, no undo, and it takes milliseconds. This is the single most famous way to destroy a production database, and it is almost always a \`WHERE\` clause that was going to be typed next.

**The habit that prevents it:** write the \`WHERE\` **first**, or run it as a \`SELECT\` first and look at what comes back. If \`SELECT * FROM users WHERE id = 7\` returns the row you meant, then change \`SELECT *\` to \`DELETE\`.

**Soft delete**

Often you do not want to actually remove data — an order that vanishes takes its history with it. Instead add a \`deleted_at\` column and set it:

\`\`\`sql
UPDATE orders SET deleted_at = now() WHERE id = 7;
\`\`\`

Now every read has to remember \`WHERE deleted_at IS NULL\`, which is the cost. Worth it for anything you might need to recover, audit, or explain to a customer.

**Wrap related writes in a transaction.** If you deduct stock and create an order, both must happen or neither. That is the next topic, and it exists because of exactly this.`,
    contentHi: `\`SELECT\` padhta hai. Ye teen likhte hain.

**INSERT — nayi row jodo**

\`\`\`sql
INSERT INTO users (name, email) VALUES ('Asha', 'asha@x.com');
\`\`\`

Kai ek saath daalne ke liye aur value groups jodo — ek statement loop mein chalti kai statements se kaafi tez hai, kyunki har statement ek chakkar hai.

\`RETURNING\` usi query mein nayi id de deta hai, doosri lookup bach jati hai:

\`\`\`sql
INSERT INTO users (name) VALUES ('Asha') RETURNING id;
\`\`\`

**UPDATE — maujooda rows badlo**

\`\`\`sql
UPDATE users SET city = 'Mumbai' WHERE id = 7;
\`\`\`

**DELETE — rows hatao**

\`\`\`sql
DELETE FROM users WHERE id = 7;
\`\`\`

**Wo galti jo poore syntax se zyada matter karti hai**

\`\`\`sql
UPDATE users SET city = 'Mumbai';   -- WHERE nahi → ab HAR user Mumbai mein rehta hai
DELETE FROM users;                   -- WHERE nahi → har user gayab
\`\`\`

Na pushti, na undo, aur ye milliseconds leta hai. Production database barbaad karne ka sabse mashhoor tareeka yahi hai, aur lagbhag hamesha wo \`WHERE\` hota hai jo agle pal type hone wala tha.

**Wo aadat jo ise rokti hai:** \`WHERE\` **pehle** likho, ya pehle \`SELECT\` ki tarah chala kar dekho kya aata hai. Agar \`SELECT * FROM users WHERE id = 7\` wahi row deta hai jo aapko chahiye thi, tab \`SELECT *\` ko \`DELETE\` bana do.

**Soft delete**

Aksar aap data sach mein hataana nahi chahte — gayab hua order apna itihaas bhi le jata hai. Iski jagah \`deleted_at\` column jodo aur set karo:

\`\`\`sql
UPDATE orders SET deleted_at = now() WHERE id = 7;
\`\`\`

Ab har read ko \`WHERE deleted_at IS NULL\` yaad rakhna padega, aur yahi keemat hai. Jo cheez wapas chahiye ho sakti hai, jiska audit ho sakta hai, ya customer ko samjhani pad sakti hai — uske liye ye keemat theek hai.

**Judi hui writes ko transaction mein lapeto.** Stock kam karke order banate ho to dono hon ya koi na ho. Wo agla topic hai, aur wo theek isi wajah se hai.`,
    codeExample: `-- Always SELECT first to see what you are about to change
SELECT * FROM users WHERE city = 'Dehli';   -- typo: matches nothing

-- Only then turn it into a write
UPDATE users SET city = 'Delhi' WHERE city = 'Dehli';

-- Insert and get the new id back in one round trip
INSERT INTO orders (user_id, total) VALUES (1, 499.00) RETURNING id;

-- Soft delete: the row stays, but reads must filter it out
UPDATE orders SET deleted_at = now() WHERE id = 7;
SELECT * FROM orders WHERE deleted_at IS NULL;`,
    commonMistakes: [
      'UPDATE or DELETE without a WHERE clause. No confirmation, no undo, instant.',
      'Looping inserts one at a time in application code instead of a single multi-row INSERT.',
      'Hard-deleting rows you will later need for an audit, a refund or a support conversation.',
      'Adding soft delete and then forgetting `WHERE deleted_at IS NULL` on half the queries, so deleted rows reappear.',
    ],
    interviewQuestions: [
      'What happens if you run UPDATE without a WHERE clause?',
      'What is soft delete and what does it cost you?',
      'How would you insert 1,000 rows efficiently?',
      'What does RETURNING give you?',
    ],
    practiceQuestions: [
      'Write an UPDATE that fixes a misspelt city name, and prove with a SELECT that it hits only the rows you meant.',
      'Add soft-delete to an orders table and update every read query accordingly.',
    ],
    tags: ['sql', 'basics', 'must-know'],
  },

  {
    slug: 'sql-data-types-and-constraints',
    title: 'Data types and constraints',
    difficulty: 'EASY',
    summary: 'Constraints let the database refuse bad data. Every rule you enforce there is one your application cannot accidentally skip.',
    summaryHi: 'Constraints se database kharab data mana kar deta hai. Jo niyam wahan lagta hai, use aapki application galti se chhod hi nahi sakti.',
    content: `**The common types**

| Type | For |
|---|---|
| \`TEXT\` / \`VARCHAR(n)\` | strings |
| \`INTEGER\` / \`BIGINT\` | whole numbers |
| \`NUMERIC(10,2)\` | **money** — exact decimals |
| \`BOOLEAN\` | true/false |
| \`TIMESTAMPTZ\` | a moment in time |
| \`UUID\` | ids that are not guessable or sequential |
| \`JSONB\` | genuinely variable data |

**Two type choices worth getting right immediately**

**Never use \`FLOAT\` for money.** Binary floating point cannot represent 0.1 exactly, so \`0.1 + 0.2\` is not \`0.3\`. Use \`NUMERIC\`, or store paise as an integer. This causes rounding errors that appear months later in a reconciliation report and are miserable to trace.

**Always use \`TIMESTAMPTZ\`, never \`TIMESTAMP\`.** The plain one stores wall-clock text with no idea which timezone it meant. The moment you have a user or a server in a second timezone, every historical row is ambiguous.

**Constraints — the rules the database enforces**

- **NOT NULL** — this must be provided
- **UNIQUE** — no two rows may share this
- **PRIMARY KEY** — NOT NULL + UNIQUE, and the row's identity
- **REFERENCES** (foreign key) — must point at a row that exists
- **CHECK** — any rule you can express: \`CHECK (total >= 0)\`
- **DEFAULT** — value used when none is given

**Why put rules in the database rather than the application?**

Because the database is the **last line**, and it is the only one everything goes through. Your API validates input, but so does the admin panel, the migration script, the data import, the console session someone opened at 11pm. Application validation can be bypassed. A \`CHECK\` constraint cannot.

Validate in **both** places: in the app for a friendly error message, in the database so it is actually true.

**ON DELETE behaviour** is worth deciding deliberately rather than accepting the default:

- \`ON DELETE CASCADE\` — delete the user, their orders go too
- \`ON DELETE RESTRICT\` — refuse to delete a user who has orders
- \`ON DELETE SET NULL\` — keep the order, forget who placed it

For orders, \`RESTRICT\` is usually right — silently cascading away financial records is rarely what anyone wanted.`,
    contentHi: `**Aam types**

| Type | Kis liye |
|---|---|
| \`TEXT\` / \`VARCHAR(n)\` | strings |
| \`INTEGER\` / \`BIGINT\` | poore numbers |
| \`NUMERIC(10,2)\` | **paisa** — theek decimals |
| \`BOOLEAN\` | sach/jhoot |
| \`TIMESTAMPTZ\` | ek pal |
| \`UUID\` | aisi ids jo anuman se na milein aur kramik na hon |
| \`JSONB\` | sach mein badalta data |

**Do type ke faisle jo turant theek karne layak hain**

**Paise ke liye \`FLOAT\` kabhi nahi.** Binary floating point 0.1 ko theek nahi rakh sakta, isliye \`0.1 + 0.2\` \`0.3\` nahi hota. \`NUMERIC\` use karo, ya paise ko integer mein rakho. Isse rounding ki galtiyan hoti hain jo mahinon baad kisi reconciliation report mein dikhti hain aur dhoondhne mein dukh deti hain.

**Hamesha \`TIMESTAMPTZ\`, kabhi \`TIMESTAMP\` nahi.** Simple wala wall-clock text rakhta hai bina jaane wo kis timezone ka tha. Doosre timezone mein ek bhi user ya server aate hi har purani row ka matlab dhundhla ho jata hai.

**Constraints — wo niyam jo database lagu karta hai**

- **NOT NULL** — ye dena hi hoga
- **UNIQUE** — do rows ise saanjha nahi kar sakti
- **PRIMARY KEY** — NOT NULL + UNIQUE, aur row ki pehchan
- **REFERENCES** (foreign key) — aisi row par ishara karo jo maujood ho
- **CHECK** — koi bhi niyam jo likh sako: \`CHECK (total >= 0)\`
- **DEFAULT** — jab kuch na diya jaye to yahi value

**Niyam application ki jagah database mein kyun?**

Kyunki database **aakhri lakeer** hai, aur wahi ek jagah hai jahan se sab kuch guzarta hai. Aapki API input jaanchti hai, par admin panel bhi, migration script bhi, data import bhi, aur wo console session bhi jo kisi ne raat 11 baje khola tha. Application ki jaanch bypass ho sakti hai. \`CHECK\` constraint nahi.

**Dono** jagah validate karo: app mein achhe error message ke liye, database mein taaki wo sach mein sach ho.

**ON DELETE ka bartaav** default maan lene ki jagah soch kar chunna chahiye:

- \`ON DELETE CASCADE\` — user hatao, uske orders bhi gaye
- \`ON DELETE RESTRICT\` — jis user ke orders hain use hataane se mana
- \`ON DELETE SET NULL\` — order rakho, par kisne diya wo bhool jao

Orders ke liye aksar \`RESTRICT\` sahi hai — chupchaap financial records ka mit jana shayad hi kisi ne chaha ho.`,
    codeExample: `CREATE TABLE orders (
  id       SERIAL PRIMARY KEY,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total    NUMERIC(10,2) NOT NULL CHECK (total >= 0),   -- never FLOAT for money
  status   TEXT NOT NULL DEFAULT 'PENDING'
             CHECK (status IN ('PENDING','PAID','SHIPPED')),
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now()          -- TZ, always
);

-- The database refuses these, no matter which client sent them:
-- INSERT INTO orders (user_id, total) VALUES (999, 10);   -- no such user
-- INSERT INTO orders (user_id, total) VALUES (1, -5);     -- fails CHECK`,
    commonMistakes: [
      'FLOAT for money. Rounding errors surface months later and are painful to trace.',
      'TIMESTAMP instead of TIMESTAMPTZ — invisible until a second timezone appears, by which point history is already ambiguous.',
      'Enforcing rules only in application code, so an import script or a console session writes data the app would have rejected.',
      'Accepting the default ON DELETE behaviour without thinking, then cascading away records someone needed.',
    ],
    interviewQuestions: [
      'Why should money never be stored as a FLOAT?',
      'Why validate in the database when the application already validates?',
      'What is the difference between ON DELETE CASCADE and RESTRICT?',
      'What does a CHECK constraint let you express?',
    ],
    practiceQuestions: [
      'Add constraints to a products table so price cannot be negative and SKU must be unique.',
      'Pick the right ON DELETE behaviour for users→orders and explain the choice.',
    ],
    tags: ['sql', 'database', 'basics', 'must-know'],
  },
];

/* ═══════════════════════════════ REST basics ══════════════════════════════ */

export const API_BASICS: SeedTopic[] = [
  {
    slug: 'rest-what-is-an-api',
    title: 'What an API is',
    difficulty: 'EASY',
    summary: 'A contract between two programs: send this, get that back. The frontend never touches the database — it asks the API, and the API decides.',
    summaryHi: 'Do programs ke beech ka contract: ye bhejo, wo milega. Frontend database ko chhuta hi nahi — wo API se maangta hai, aur API tay karti hai.',
    content: `**API** = Application Programming Interface. A way for one program to ask another program to do something.

**The restaurant version:** you do not walk into the kitchen. You talk to a waiter, using a menu, and food arrives. The menu is the API — it tells you what you may ask for and what you will get. You never learn how the kitchen works, and the kitchen can be completely rebuilt without changing your order.

**Why the frontend cannot just talk to the database**

1. **Security** — the database password would have to live in the browser, where anyone can read it. Everyone would have full access to everything.
2. **Rules** — "you may only see your own orders" has to be enforced somewhere the user cannot edit.
3. **Change** — swap Postgres for something else and every app would break. With an API in between, only the API changes.

So: **browser → API → database**. Always.

**A request has four parts**

- **Method** — what kind of action (\`GET\`, \`POST\`, …)
- **URL** — what you are acting on (\`/users/7\`)
- **Headers** — information about the request (who you are, what format you want)
- **Body** — the data you are sending (only for writes)

**A response has three**

- **Status code** — did it work (\`200\`, \`404\`, \`500\`)
- **Headers** — information about the response
- **Body** — the data, usually JSON

**REST** is a *style* of building APIs, not a technology. Its core idea: URLs name **things** (nouns), and HTTP methods say what to **do** to them (verbs). \`GET /users\` rather than \`POST /getAllUsers\`.

**JSON** is how the data is written — a plain-text format both sides understand, which is why an API written in Node can be called by an app written in Swift with neither side caring.`,
    contentHi: `**API** = Application Programming Interface. Ek program ka doosre program se kuch karwane ka tareeka.

**Restaurant wala roop:** aap rasoi mein nahi ghuste. Aap waiter se, menu ke zariye, baat karte ho aur khana aa jata hai. Menu hi API hai — wo batata hai ki aap kya maang sakte ho aur kya milega. Rasoi kaise chalti hai ye aap kabhi nahi jaante, aur rasoi poori badal jaye to bhi aapka order nahi badalta.

**Frontend seedhe database se baat kyun nahi kar sakta**

1. **Suraksha** — database ka password browser mein rakhna padta, jahan koi bhi use padh sakta hai. Sabke paas har cheez ka poora access hota.
2. **Niyam** — "aap sirf apne orders dekh sakte ho" ko wahan lagu karna hoga jahan user badal na sake.
3. **Badlav** — Postgres ki jagah kuch aur lao aur har app toot jaye. Beech mein API ho to sirf API badalti hai.

Isliye: **browser → API → database**. Hamesha.

**Request ke chaar hisse**

- **Method** — kis tarah ka kaam (\`GET\`, \`POST\`, …)
- **URL** — kis par kaam (\`/users/7\`)
- **Headers** — request ke baare mein jaankari (aap kaun ho, kis format mein chahiye)
- **Body** — bheja ja raha data (sirf likhne wale kaam mein)

**Response ke teen**

- **Status code** — chala ya nahi (\`200\`, \`404\`, \`500\`)
- **Headers** — response ke baare mein jaankari
- **Body** — data, aksar JSON

**REST** API banane ki ek *shaili* hai, koi technology nahi. Iska mool vichaar: URL **cheezon** ka naam (sangya) rakhte hain, aur HTTP methods batate hain ki unke saath **karna kya** hai (kriya). \`POST /getAllUsers\` nahi, \`GET /users\`.

**JSON** wo tareeka hai jisme data likha jata hai — plain text format jise dono taraf samajhti hain, isiliye Node mein likhi API ko Swift mein likhi app bula sakti hai aur dono ko farak nahi padta.`,
    codeExample: `// The four parts of a request, in one call
const res = await fetch('https://api.example.com/orders', {
  method: 'POST',                                  // 1. method
  headers: {                                       // 3. headers
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGci...',
  },
  body: JSON.stringify({ productId: 'p1', qty: 2 }), // 4. body
});                                                // 2. URL was the first argument

console.log(res.status);        // 201
const order = await res.json(); // { id: 42, productId: 'p1', qty: 2 }`,
    expectedOutput: `201
{ id: 42, productId: 'p1', qty: 2 }`,
    commonMistakes: [
      'Putting database credentials in frontend code. Anything in the browser is public, including "hidden" variables.',
      'Verbs in URLs — `/getUsers`, `/createOrder`. The method already says what you are doing.',
      'Enforcing permission rules only in the UI. Hiding a button does not stop anyone calling the endpoint directly.',
      'Assuming REST is a technology you install. It is a set of conventions.',
    ],
    interviewQuestions: [
      'Why can the frontend not talk to the database directly?',
      'What are the parts of an HTTP request?',
      'What does REST actually mean?',
      'Why is JSON used for APIs?',
    ],
    practiceQuestions: [
      'Design the endpoints for a to-do app: list, create, update, delete.',
      'Open a website, watch the Network tab, and identify the method, URL, headers and body of one request.',
    ],
    tags: ['rest', 'api', 'basics', 'must-know'],
  },

  {
    slug: 'rest-http-methods-and-status',
    title: 'HTTP methods and status codes',
    difficulty: 'EASY',
    summary: 'Five methods cover almost everything, and the first digit of a status code tells you whose fault it was.',
    summaryHi: 'Paanch methods lagbhag sab dhak lete hain, aur status code ka pehla ank batata hai ki galti kiski thi.',
    content: `**The methods**

| Method | Means | Has a body? |
|---|---|---|
| \`GET\` | read something | no |
| \`POST\` | create something | yes |
| \`PUT\` | replace something entirely | yes |
| \`PATCH\` | change part of something | yes |
| \`DELETE\` | remove something | usually not |

**\`GET\` must never change anything.** Browsers, proxies and crawlers all assume this — they will happily re-fetch a \`GET\` without asking. An endpoint like \`GET /orders/7/delete\` will eventually be triggered by something that was only trying to be helpful.

**PUT vs PATCH:** \`PUT\` replaces the whole resource — fields you leave out get cleared. \`PATCH\` changes only what you send. Most "edit" endpoints want \`PATCH\`.

**Status codes, by first digit**

- **2xx** — it worked
- **3xx** — look somewhere else
- **4xx** — **you** made a mistake
- **5xx** — **I** made a mistake

That single rule matters more than memorising the list, because it is what you need when deciding what to return.

**The ones you will actually use**

| Code | Meaning |
|---|---|
| **200** | OK |
| **201** | Created — return this from a successful POST |
| **204** | No content — a successful DELETE |
| **400** | Bad input — validation failed |
| **401** | Not authenticated — *who are you?* |
| **403** | Authenticated but not allowed — *I know who you are, and no* |
| **404** | Not found |
| **409** | Conflict — e.g. that email is already registered |
| **422** | Understood the request, but the data is unprocessable |
| **500** | Something broke on the server |

**401 vs 403** is the pair everyone mixes up. 401 is the door — you have not proved who you are. 403 is the bouncer — you have, and you still cannot come in.

**The mistake that makes an API unusable:** returning \`200 OK\` with \`{ "error": "not found" }\` in the body. Now every client has to parse the body to find out whether it worked, monitoring cannot count failures, and retry logic has nothing to work with. Use the status code — that is what it is for.`,
    contentHi: `**Methods**

| Method | Matlab | Body hoti hai? |
|---|---|---|
| \`GET\` | kuch padho | nahi |
| \`POST\` | kuch banao | haan |
| \`PUT\` | poori cheez badlo | haan |
| \`PATCH\` | cheez ka hissa badlo | haan |
| \`DELETE\` | hatao | aksar nahi |

**\`GET\` ko kuch badalna nahi chahiye.** Browsers, proxies aur crawlers sab yahi maante hain — wo bina poochhe \`GET\` dobara chala dete hain. \`GET /orders/7/delete\` jaisa endpoint kabhi na kabhi kisi aisi cheez se chal jayega jo bas madad kar rahi thi.

**PUT aur PATCH:** \`PUT\` poori resource badal deta hai — jo fields chhod do wo khaali ho jati hain. \`PATCH\` sirf wahi badalta hai jo aap bhejo. Zyadatar "edit" endpoints ko \`PATCH\` chahiye.

**Status codes, pehle ank se**

- **2xx** — chal gaya
- **3xx** — kahin aur dekho
- **4xx** — galti **aapki**
- **5xx** — galti **meri**

Ye ek niyam poori list ratne se zyada matter karta hai, kyunki kya lautana hai ye tay karte waqt yahi chahiye.

**Jo sach mein use honge**

| Code | Matlab |
|---|---|
| **200** | OK |
| **201** | Ban gaya — safal POST se yahi lautao |
| **204** | Kuch nahi — safal DELETE |
| **400** | Kharab input — validation fail |
| **401** | Authenticate nahi — *aap kaun ho?* |
| **403** | Authenticate hain par ijazat nahi — *pata hai aap kaun ho, aur nahi* |
| **404** | Mila nahi |
| **409** | Takraar — jaise wo email pehle se registered hai |
| **422** | Request samajh aayi, par data par kaam nahi ho sakta |
| **500** | Server par kuch toota |

**401 aur 403** wahi jodi hai jise sab ghulaate hain. 401 darwaza hai — aapne sabit nahi kiya ki aap kaun ho. 403 bouncer hai — sabit kar diya, phir bhi andar nahi.

**Wo galti jo API ko bekaar bana deti hai:** body mein \`{ "error": "not found" }\` ke saath \`200 OK\` lautana. Ab har client ko body padh kar pata karna padta hai ki chala ya nahi, monitoring failures gin hi nahi sakti, aur retry logic ke paas kuch hai hi nahi. Status code use karo — wo isi ke liye hai.`,
    codeExample: `app.get('/orders/:id', async (req, res) => {
  const order = await service.find(req.params.id);
  if (!order) return res.status(404).json({ error: { message: 'Order not found' } });
  res.json({ order });                                    // 200
});

app.post('/orders', async (req, res) => {
  const order = await service.create(req.body);
  res.status(201).json({ order });                        // 201, not 200
});

app.delete('/orders/:id', async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();                                 // 204, no body
});`,
    commonMistakes: [
      'Returning 200 with an error in the body. Clients, monitoring and retries all rely on the status code.',
      'Using GET for something that changes data — a crawler or prefetcher will eventually trigger it.',
      'Using 200 for a created resource instead of 201, so clients cannot tell creation from a no-op.',
      'Confusing 401 (not authenticated) with 403 (authenticated, not allowed).',
    ],
    interviewQuestions: [
      'Difference between PUT and PATCH?',
      'What is the difference between 401 and 403?',
      'Why must GET be side-effect free?',
      'What status code should a successful POST return?',
    ],
    practiceQuestions: [
      'Take an existing API and check every endpoint returns the right status code.',
      'Write handlers that return 201, 204, 400 and 404 correctly.',
    ],
    tags: ['rest', 'http', 'basics', 'must-know'],
  },

  {
    slug: 'rest-error-handling',
    title: 'Error handling that clients can use',
    difficulty: 'MEDIUM',
    summary: 'One consistent error shape, correct status codes, and never leaking a stack trace to the internet.',
    summaryHi: 'Ek jaisa error dhaancha, sahi status codes, aur stack trace kabhi internet par nahi.',
    content: `Every error your API returns should have the **same shape**. A client that has to handle five different error formats will handle none of them properly.

\`\`\`json
{ "error": { "code": "VALIDATION_ERROR", "message": "Quantity must be positive", "details": [...] } }
\`\`\`

- **code** — a stable string the client can branch on. Never branch on the message; messages get reworded.
- **message** — for a human, safe to display
- **details** — optional, field-level validation errors

**What must never leave the server**

- Stack traces — they reveal file paths, library versions and internal structure
- SQL statements or database errors — they tell an attacker your schema
- "User not found" on a login endpoint — that confirms which emails are registered, which is account enumeration

Log the full detail on the server. Return the safe summary.

**One error handler, at the end**

Do not \`try/catch\` in every route. Throw typed errors and let one middleware translate them:

\`\`\`ts
class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
throw new AppError(404, 'NOT_FOUND', 'Order not found');
\`\`\`

The handler maps known errors to their status and turns everything else into a 500 — because an unrecognised error is, by definition, a bug you did not anticipate.

**Async handlers need wrapping.** An async function passed to Express returns a promise Express ignores, so a rejection becomes an unhandled rejection instead of a 500. Wrap them once and forget it.

**Fail loudly in the logs, quietly in the response.** The user gets "Something went wrong"; you get the stack trace, the request id and the user id.

**Include a request id** in both the log line and the response. When a user reports a problem, that id takes you straight to the exact request instead of a timestamp search.`,
    contentHi: `Aapki API jo bhi error laut aye, uska **dhaancha ek jaisa** hona chahiye. Jis client ko paanch alag error formats sambhalne padein wo kisi ko theek se nahi sambhalega.

\`\`\`json
{ "error": { "code": "VALIDATION_ERROR", "message": "Quantity must be positive", "details": [...] } }
\`\`\`

- **code** — sthir string jis par client shakha bana sake. Message par kabhi nahi; message ke shabd badalte rehte hain.
- **message** — insaan ke liye, dikhane layak
- **details** — optional, field-level validation errors

**Server se kya kabhi nahi nikalna chahiye**

- Stack traces — ye file paths, library versions aur andar ka dhaancha bata dete hain
- SQL statements ya database errors — ye hamlawar ko aapka schema bata dete hain
- Login endpoint par "User not found" — isse pushti ho jati hai ki kaunse email registered hain, yani account enumeration

Poori tafseel server par log karo. Surakshit saaransh lautao.

**Ek error handler, aakhir mein**

Har route mein \`try/catch\` mat karo. Typed errors phenko aur ek middleware unhe badle:

\`\`\`ts
class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
throw new AppError(404, 'NOT_FOUND', 'Order not found');
\`\`\`

Handler jaane-pehchaane errors ko unke status par bhejta hai aur baaki sab ko 500 bana deta hai — kyunki anjaana error parib hasha se wo bug hai jiska aapne soch a hi nahi tha.

**Async handlers ko lapetna padta hai.** Express ko diya async function ek promise lautata hai jise Express dekhta hi nahi, isliye rejection 500 ki jagah unhandled rejection ban jata hai. Ek baar lapeto aur bhool jao.

**Logs mein zor se fail ho, response mein chupchaap.** User ko "Kuch galat ho gaya" milta hai; aapko stack trace, request id aur user id.

**Request id dono jagah rakho** — log line mein bhi aur response mein bhi. Jab user samasya bataye to wo id seedha usi request tak le jati hai, timestamp dhoondhne ki jagah.`,
    codeExample: `class AppError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

// Routes just throw — no try/catch anywhere
app.get('/orders/:id', asyncHandler(async (req, res) => {
  const order = await service.find(req.params.id);
  if (!order) throw new AppError(404, 'NOT_FOUND', 'Order not found');
  res.json({ order });
}));

// One handler translates everything, and it must take FOUR arguments
app.use((err, req, res, _next) => {
  const known = err instanceof AppError;
  if (!known) logger.error({ err, requestId: req.id });   // full detail, server-side only

  res.status(known ? err.status : 500).json({
    error: {
      code: known ? err.code : 'INTERNAL_ERROR',
      message: known ? err.message : 'Something went wrong',
      requestId: req.id,
    },
  });
});`,
    commonMistakes: [
      'Returning the raw error message, leaking stack traces, file paths or SQL to the internet.',
      'A different error shape per endpoint, so clients cannot handle errors generically.',
      'Error middleware written with three arguments — Express then treats it as normal middleware and never sends errors to it.',
      'Saying "user not found" versus "wrong password" on login, which confirms to an attacker which emails exist.',
    ],
    interviewQuestions: [
      'What should an API error response contain?',
      'Why should a client branch on an error code rather than the message?',
      'Why must login say "invalid credentials" rather than which field was wrong?',
      'How do you handle errors thrown in an async Express route?',
    ],
    practiceQuestions: [
      'Add a single error middleware to an API and remove every per-route try/catch.',
      'Audit an API for responses that leak internal details.',
    ],
    tags: ['rest', 'api', 'errors', 'must-know'],
  },

  {
    slug: 'rest-auth-in-apis',
    title: 'Authentication in APIs',
    difficulty: 'MEDIUM',
    summary: 'How a request proves who sent it — bearer tokens, cookies, API keys — and where each belongs.',
    summaryHi: 'Request kaise sabit karti hai ki use kisne bheja — bearer tokens, cookies, API keys — aur har ek kis jagah ke liye hai.',
    content: `HTTP is **stateless**: the server remembers nothing between requests. So every single request must carry proof of who is making it.

**Three ways to carry that proof**

**1. Bearer token in a header**

\`\`\`
Authorization: Bearer eyJhbGciOi...
\`\`\`

The standard for APIs. Works from any client — a mobile app, another server, curl. The catch: the client has to store it somewhere, and \`localStorage\` is readable by any XSS on your page.

**2. Cookie**

The browser attaches it automatically. Set it \`httpOnly\` and JavaScript cannot read it, which defeats XSS token theft. But because it is sent automatically, **it reintroduces CSRF** — hence \`SameSite=Strict\` or \`Lax\`.

Best for a browser app where the API is on your own domain.

**3. API key**

A long random string identifying an *application* rather than a user. For server-to-server calls and third-party integrations. Never for user login, and never in a URL — query strings end up in logs.

**The pattern most real apps use**

A **short-lived access token** (15 minutes, kept in memory) plus a **long-lived refresh token** in an \`httpOnly\` cookie. The access token is fast to verify and expires quickly if stolen; the refresh token is stored server-side, so it can actually be revoked.

**Where auth belongs in the request pipeline**

Middleware, **before** the routes. Verify the token once, attach the user to the request, and let each route check permissions.

Note that authentication (**who are you**) and authorisation (**what may you do**) are different steps. A valid token proves identity; it does not prove you may delete order 99. Check ownership in the handler.

**Two things people get wrong**

- **Never put a token in a URL.** It lands in server logs, proxy logs, browser history and any \`Referer\` header sent to a third party.
- **Never trust an id from the client.** \`DELETE /orders/99\` with a valid token still needs a check that order 99 belongs to *that* user. Skipping it is called an insecure direct object reference, and it is one of the most common real-world API vulnerabilities.`,
    contentHi: `HTTP **stateless** hai: server requests ke beech kuch yaad nahi rakhta. Isliye har ek request ko ye saboot le kar chalna padta hai ki use kaun bhej raha hai.

**Saboot le jaane ke teen tareeke**

**1. Header mein bearer token**

\`\`\`
Authorization: Bearer eyJhbGciOi...
\`\`\`

APIs ka standard. Har client se chalta hai — mobile app, doosra server, curl. Pech: client ko use kahin rakhna padta hai, aur \`localStorage\` ko aapke page par chalne wali koi bhi XSS padh sakti hai.

**2. Cookie**

Browser use khud laga deta hai. \`httpOnly\` set karo aur JavaScript use padh nahi sakta, jisse XSS se token churana khatam. Par khud lagne ki wajah se **CSRF wapas aa jata hai** — isiliye \`SameSite=Strict\` ya \`Lax\`.

Browser app ke liye sabse achha, jab API aapke apne domain par ho.

**3. API key**

Ek lambi random string jo *application* ki pehchan hai, user ki nahi. Server-to-server calls aur third-party integrations ke liye. User login ke liye kabhi nahi, aur URL mein kabhi nahi — query strings logs mein pahunch jati hain.

**Jo pattern zyadatar asli apps use karte hain**

**Chhoti umar ka access token** (15 minute, memory mein) aur **lambi umar ka refresh token** \`httpOnly\` cookie mein. Access token jaanchne mein tez hai aur chori hone par jaldi khatam ho jata hai; refresh token server par jama hai, isliye use sach mein wapas liya ja sakta hai.

**Request pipeline mein auth ki jagah**

Middleware, routes se **pehle**. Token ek baar verify karo, user ko request se jodo, aur har route ijazat khud jaanch le.

Dhyan raho authentication (**aap kaun ho**) aur authorisation (**aap kya kar sakte ho**) alag kadam hain. Sahi token pehchan sabit karta hai; ye nahi ki aap order 99 delete kar sakte ho. Handler mein maalikana jaancho.

**Do cheezein log galat karte hain**

- **Token URL mein kabhi mat rakho.** Wo server logs, proxy logs, browser history aur kisi third party ko jaate \`Referer\` header mein pahunch jata hai.
- **Client se aayi id par kabhi bharosa mat karo.** Sahi token ke saath bhi \`DELETE /orders/99\` par ye jaanchna zaroori hai ki order 99 *usi* user ka hai. Ise chhodna insecure direct object reference kehlata hai, aur ye asli duniya ki sabse aam API kamzoriyon mein se ek hai.`,
    codeExample: `// Auth middleware — runs before routes, proves identity only
function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
  }
}

// Identity is not permission — the route still checks ownership
app.delete('/orders/:id', requireAuth, async (req, res) => {
  const order = await service.find(req.params.id);
  if (!order) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN' } });   // 403, not 401
  }
  await service.remove(order.id);
  res.status(204).send();
});`,
    commonMistakes: [
      'Trusting an id from the URL without checking the resource belongs to the caller — insecure direct object reference.',
      'Putting tokens in query strings, where they land in logs, history and Referer headers.',
      'Storing a token in localStorage without accepting that any XSS on the page can read it.',
      'Treating a valid token as permission. Authentication is identity; authorisation is a separate check.',
    ],
    interviewQuestions: [
      'Where should a token be stored in a browser, and what is the trade-off?',
      'Difference between authentication and authorisation?',
      'What is an insecure direct object reference?',
      'Why use a short access token plus a refresh token?',
    ],
    practiceQuestions: [
      'Add ownership checks to every endpoint that takes a resource id.',
      'Move a token from localStorage to an httpOnly cookie and handle the CSRF consequence.',
    ],
    tags: ['rest', 'api', 'auth', 'security', 'must-know'],
  },

  {
    slug: 'rest-documentation-and-testing',
    title: 'Documenting and testing an API',
    difficulty: 'MEDIUM',
    summary: 'OpenAPI describes the contract; tests prove you kept it. Both stop being useful the moment they drift from the code.',
    summaryHi: 'OpenAPI contract batata hai; tests sabit karte hain ki aapne use nibhaya. Code se alag hote hi dono bekaar ho jate hain.',
    content: `**Documentation**

**OpenAPI** (formerly Swagger) is a machine-readable description of your API: every endpoint, its parameters, its request and response shapes, its error codes. From it you get interactive docs, generated client libraries and request validation.

The critical property: **generate it from the code, not alongside it.** Hand-written API docs are wrong within a month, and wrong documentation is worse than none — people trust it and build against a contract you no longer honour.

If you already define request schemas for validation, generate the docs from those. One source of truth, two outputs.

**Testing, by layer**

- **Unit** — one function, no network, no database. Fast, run constantly.
- **Integration** — a real request through the real routes, usually against a test database. This is where API bugs actually live.
- **Contract** — does the response still match the documented shape? Catches accidental breaking changes.
- **End-to-end** — the whole system. Slow and brittle; keep a handful.

For an API, **integration tests earn their keep the fastest.** The bugs that reach production are rarely "this function returns the wrong number" — they are "this route was never mounted", "the auth guard is on the wrong side of the handler", "the response shape changed and the client broke".

**What is worth asserting**

- The status code, not just the body
- The **absence** of things: no password hash, no internal ids, no stack trace
- Permission boundaries: user A genuinely cannot read user B's order
- Validation: bad input is rejected with 400, not accepted and stored

That third one matters more than people give it credit for. A test that proves an authorisation check works is worth ten tests of a formatting function.

**Keep tests independent.** Each test creates what it needs and cleans up after itself. Tests that depend on running in order fail mysteriously the first time someone runs them in parallel.`,
    contentHi: `**Documentation**

**OpenAPI** (pehle Swagger) aapki API ka machine-readable hulia hai: har endpoint, uske parameters, request aur response ke dhaanche, uske error codes. Isse interactive docs, banaye hue client libraries aur request validation milte hain.

Sabse zaroori baat: **ise code se banao, code ke bagal mein likho nahi.** Haath se likhi API docs mahine bhar mein galat ho jati hain, aur galat documentation na hone se bhi buri hai — log us par bharosa karke aise contract par code likh dete hain jo ab aap nibhate hi nahi.

Agar aap validation ke liye request schemas pehle se banate ho, to docs unhi se banao. Ek sach, do natije.

**Testing, parat ke hisaab se**

- **Unit** — ek function, na network na database. Tez, lagatar chalte hain.
- **Integration** — asli routes se guzarti asli request, aksar test database ke saath. API ke bug yahin rehte hain.
- **Contract** — kya response ab bhi likhe hue dhaanche se milta hai? Galti se hue breaking changes pakadta hai.
- **End-to-end** — poora system. Dheema aur naazuk; ginti ke rakho.

API ke liye **integration tests sabse jaldi apna daam wasool karte hain.** Production tak pahunchne wale bug shayad hi "ye function galat number lautata hai" hote hain — wo "ye route mount hi nahi hua", "auth guard handler ke galat taraf hai", "response ka dhaancha badla aur client toot gaya" hote hain.

**Kya jaanchna kaam ka hai**

- Status code, sirf body nahi
- Cheezon ka **na hona**: password hash nahi, andar ki ids nahi, stack trace nahi
- Ijazat ki seemayein: user A sach mein user B ka order nahi padh sakta
- Validation: kharab input 400 ke saath mana ho, sweekar karke jama na ho

Teesri baat ko log jitna maante hain usse zyada matter karti hai. Jo test sabit kare ki authorisation ki jaanch chalti hai, wo formatting function ke das tests se zyada keemti hai.

**Tests ko aazad rakho.** Har test apni zaroorat ki cheez khud banaye aur khud saaf kare. Jo tests kram par nirbhar hain wo pehli baar samanantar chalate hi ajeeb tareeke se fail hote hain.`,
    codeExample: `// An integration test asserts the contract, including what must NOT appear
describe('GET /orders/:id', () => {
  it('returns the order for its owner', async () => {
    const res = await request(app)
      .get(\`/orders/\${order.id}\`)
      .set('Authorization', \`Bearer \${ownerToken}\`);

    expect(res.status).toBe(200);
    expect(res.body.order.id).toBe(order.id);
    expect(res.text).not.toContain('passwordHash');   // absence matters
  });

  it('refuses a different user', async () => {
    const res = await request(app)
      .get(\`/orders/\${order.id}\`)
      .set('Authorization', \`Bearer \${otherUserToken}\`);

    expect(res.status).toBe(403);                     // the check that matters most
  });

  it('rejects bad input with 400', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', \`Bearer \${ownerToken}\`)
      .send({ qty: -1 });

    expect(res.status).toBe(400);
  });
});`,
    commonMistakes: [
      'Hand-written docs kept beside the code, which drift within weeks and then mislead.',
      'Testing only the happy path, so permission and validation failures ship untested.',
      'Asserting the body but not the status code, so a 500 with the right-looking JSON passes.',
      'Tests that share state and must run in a fixed order — they break the first time someone parallelises them.',
    ],
    interviewQuestions: [
      'Why generate OpenAPI from code rather than writing it by hand?',
      'Which test layer gives the most value for an API, and why?',
      'What should an API test assert besides the response body?',
      'How do you test that a user cannot access another user\'s data?',
    ],
    practiceQuestions: [
      'Write integration tests for one endpoint covering success, unauthorised, forbidden and invalid input.',
      'Generate OpenAPI docs from your existing validation schemas.',
    ],
    tags: ['rest', 'api', 'testing', 'documentation'],
  },
];
