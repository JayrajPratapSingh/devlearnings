/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 1.
 *
 * Database indexing: why a query that responds instantly with a few
 * thousand test rows can take multiple seconds once a table holds real
 * production volume, even though the query itself never changed. Broken
 * example: a login route's SELECT * FROM users WHERE email = $1 with no
 * index on email — the database must scan every single row to find a
 * match, and this scan's cost grows linearly with table size. Fixed with
 * CREATE INDEX, turning the lookup into something closer to a book's index
 * lookup instead of reading every page. Covers EXPLAIN ANALYZE (Seq Scan
 * vs Index Scan), composite indexes and column order, the write-side cost
 * of an index, and cases where an index does not help (leading wildcard
 * LIKE, functions applied to the column).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_7: CourseLesson[] = [
  {
    slug: 'database-indexing',
    title: 'Database Indexing: Why the Same Query Gets Slower as Data Grows',
    titleHi: 'Database Indexing: Data Badhne Ke Saath Wahi Query Dheemi Kyun Hoti Hai',
    description: 'A login query that responds in 2 milliseconds with 500 test users takes 3 full seconds once the table holds 5 million real ones — and the query itself never changed.',
    descriptionHi: 'Ek login query jo 500 test users ke saath 2 milliseconds mein jawaab deti hai jab table mein 50 lakh asli users hote hain poore 3 second leti hai — aur query khud kabhi nahi badli.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A massive reference book with no index at the back, forcing anyone looking for one specific topic to read every single page from the start, versus the same book with a proper alphabetical index pointing straight to the right page.** A database table with no index on a column being searched is like a thousand-page encyclopedia with no index at all — asked to find the entry on "photosynthesis," the only available method is to start at page one and read every single page in order until the right one happens to turn up. With a small pamphlet of twenty pages, this is barely noticeable — flipping through twenty pages takes a few seconds regardless. With the actual thousand-page encyclopedia, reading every page from the start to find one entry is a genuinely slow, laborious process, and it gets proportionally slower for a even a larger, multi-volume set. A librarian who instead adds a proper index at the back — an alphabetically sorted list of every topic with the exact page number it appears on — changes the entire nature of the search: instead of reading through the whole book, a reader jumps straight to "P" in the index, finds "photosynthesis... page 742," and turns directly there, an operation whose speed barely changes at all whether the book has a thousand pages or a million, because the index itself was built specifically to make finding one specific entry fast, at the one-time cost of maintaining that index whenever a new entry is added to the book.',
      hi: '**Ek bahut badi reference book jiske peeche koi index nahi hai, kisi ko bhi ek khaas topic dhoondhne ke liye shuruaat se har akela page padhne majboor karti hai, versus wahi book ek sahi alphabetical index ke saath jo seedha sahi page tak ishara karta hai.** Ek database table jismein search ho rahi column par koi index nahi hai ek hazaar-page ki encyclopedia jaisa hai jismein bilkul koi index nahi — "photosynthesis" par entry dhoondhne ke liye kaha gaya, akela upalabdh tarika page ek se shuru karke tarteeb mein har akela page padhna hai jab tak sahi wala samyog se aa na jaaye. Bees pages ke ek chhote pamphlet ke saath, ye mushkil se hi noticeable hai — bees pages palatna kuch second leta hai chahe kuch bhi ho. Asli hazaar-page encyclopedia ke saath, ek entry dhoondhne ke liye shuruaat se har page padhna ek sach mein dheema, mehnat-bhara process hai, aur ye ek aur bhi bade, multi-volume set ke liye anupaat mein dheema ban jaata hai. Ek librarian jo iske bajaye peeche ek sahi index jodta hai — har topic ki ek alphabetically sorted list us bilkul page number ke saath jismein wo dikhta hai — poori talaash ki prakriti badal deta hai: poori book padhne ke bajaye, ek padhne wala seedha index mein "P" tak jump karta hai, "photosynthesis... page 742" paata hai, aur seedha wahin palatta hai, ek operation jiski speed mushkil se hi badalti hai chahe book mein hazaar pages hon ya lakh, kyunki index khud khaas taur par ek khaas entry dhoondhna tez banaane ke liye banaaya gaya tha, jab bhi book mein ek nayi entry jodi jaaye us index ko maintain karne ki ek-baar ki keemat par.',
    },

    simple: `**Start broken.** A login route querying \`users\` by email, with no index on that column:

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

With 500 test users seeded locally, this query responds in a couple of milliseconds — genuinely instant, and nothing about testing it locally reveals any problem at all. The \`users\` table has no index specifically covering the \`email\` column, so \`WHERE email = $1\` forces the database to perform a "sequential scan" — reading every single row in the table, one after another, checking each one\'s \`email\` value against the one being searched for, since without an index there is no faster way for the database to know which specific row (if any) matches. With 500 rows, a sequential scan is nearly instantaneous — reading 500 rows takes a negligible amount of time no matter how it is done. With 5 million real users in production, the exact same query now requires scanning through, on average, roughly half of those 5 million rows before finding a match (or all 5 million, if searching for an email that does not exist) — turning what was an imperceptible 2 milliseconds into multiple full seconds, for the exact same query, against the exact same route, with not a single line of application code having changed. Every concurrent login attempt pays this same cost, and the connection pool (covered earlier in this course) fills up with connections all stuck performing slow sequential scans, compounding the problem under real traffic.

**The fix: CREATE INDEX, turning a linear scan into a near-instant lookup**

\`\`\`sql
CREATE UNIQUE INDEX idx_users_email ON users (email);
\`\`\`

\`\`\`js
// The application code itself does not change at all — the fix lives entirely in the database schema
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    // ...unchanged...
  } catch (err) {
    next(err);
  }
});
\`\`\`

An index is a separate, pre-sorted data structure (commonly a B-tree) that the database builds and maintains alongside the actual table data, specifically to let it locate matching rows without reading through every single one. Once \`idx_users_email\` exists, \`WHERE email = $1\` no longer requires a sequential scan at all — the database consults the index (structurally similar to the encyclopedia\'s alphabetical index from the analogy above), which points directly to the exact row\'s location, an operation whose cost barely increases even as the table grows from 5 million rows to 50 million. The application code above is byte-for-byte identical to the broken version — this fix lives entirely in the database schema, not in how the query is written, which is precisely why a query that "used to be fast" and now "mysteriously" is not is so often actually a missing-index problem rather than a logic bug.`,

    simpleHi: `**Toote hue se shuru.** Ek login route jo \`users\` ko email se query karta hai, us column par koi index bina:

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Locally seed ki gayi 500 test users ke saath, ye query kuch millisecond mein jawaab deti hai — sach mein turant, aur ise locally test karne mein kuch bhi koi samasya zaahir nahi karta. \`users\` table mein \`email\` column ko khaas taur par cover karta koi index nahi hai, isliye \`WHERE email = $1\` database ko ek "sequential scan" karne majboor karta hai — table ki har akeli row padhte hue, ek ke baad ek, har ek ki \`email\` value ko jis email ko dhoondha jaa raha hai us se check karte hue, kyunki bina index ke database ke paas ye jaanne ka koi tezaar tarika nahi hai ki kaunsi khaas row (agar koi ho) milti hai. 500 rows ke saath, ek sequential scan lagbhag turant hoti hai — 500 rows padhna mamuli waqt leta hai chahe kaise bhi kiya jaaye. Production mein 50 lakh asli users ke saath, bilkul yehi query ab lagbhag un 50 lakh rows ke aadhe ke aar-paar scan karne ki maang karti hai ek milaan paane se pehle (ya sab 50 lakh, agar ek aisi email dhoondhi jaa rahi ho jo maujood hi nahi), un adrishya 2 milliseconds ko kai poore seconds mein badalte hue, bilkul usi query ke liye, bilkul usi route ke khilaaf, application code ki ek bhi line badle bina. Har concurrent login koshish yehi keemat chukaati hai, aur connection pool (is course mein pehle cover hua) dheeme sequential scans karne mein atki hui connections se bhar jaata hai, asli traffic ke neeche samasya ko aur bura banate hue.

**Fix: \`CREATE INDEX\`, ek linear scan ko ek lagbhag-turant lookup mein badalna**

\`\`\`sql
CREATE UNIQUE INDEX idx_users_email ON users (email);
\`\`\`

\`\`\`js
// Application code khud bilkul nahi badalta — fix poori tarah database schema mein rehta hai
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    // ...na-badla...
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek index ek alag, pehle-se-sorted data structure hai (aam taur par ek B-tree) jise database asli table data ke saath banaata aur maintain karta hai, khaas taur par ise har akeli row padhe bina milti rows dhoondhne dene ke liye. Ek baar \`idx_users_email\` maujood ho, \`WHERE email = $1\` ko bilkul koi sequential scan nahi chahiye — database index se poochhta hai (sanrachnaatmak taur par upar wale analogy ki encyclopedia ke alphabetical index jaisa), jo seedha asli row ki jagah ki taraf ishara karta hai, ek operation jiski keemat mushkil se hi badhti hai chahe table 50 lakh rows se 5 crore tak badhe. Upar ka application code toote version se byte-dar-byte identical hai — ye fix poori tarah database schema mein rehta hai, query kaise likhi jaati hai usme nahi, bilkul isi wajah se ek query jo "pehle tez thi" aur ab "rahasyamayi taur par" nahi hai aksar asal mein ek missing-index samasya hoti hai, koi logic bug nahi.`,

    content: `## EXPLAIN ANALYZE: seeing exactly why a query is slow, not just guessing

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Without an index:
-- Seq Scan on users  (cost=0.00..98523.00 rows=1 width=245) (actual time=812.441..812.442 rows=1 loops=1)
--   Filter: (email = 'user@example.com'::text)
--   Rows Removed by Filter: 4999999

-- With an index:
-- Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=245) (actual time=0.031..0.032 rows=1 loops=1)
--   Index Cond: (email = 'user@example.com'::text)
\`\`\`

\`EXPLAIN ANALYZE\`, run directly against the database, actually executes a query and reports exactly how the database chose to run it, along with real, measured timing — this replaces guessing about why a query is slow with concrete evidence. \`Seq Scan\` in the output confirms the database performed a full sequential scan, and \`Rows Removed by Filter: 4999999\` shows precisely how many rows it had to read and discard before finding the one actual match; \`actual time=812.441..812.442\` reports this took over 800 milliseconds. After adding the index, the exact same query\'s plan changes to \`Index Scan using idx_users_email\`, with \`actual time=0.031..0.032\` — roughly 25,000 times faster, for a query whose text never changed at all. Reaching for \`EXPLAIN ANALYZE\` whenever a query feels unexpectedly slow, rather than guessing, is standard professional practice — it directly shows whether an index is being used at all, and if not, why.

## Composite indexes: covering more than one column, and why order matters

\`\`\`sql
-- A query filtering on two columns together
SELECT * FROM orders WHERE user_id = $1 AND status = 'pending';

-- A composite index covering both, in this specific order
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
\`\`\`

A composite (multi-column) index can efficiently support a query that filters on several columns together, but the ORDER the columns are listed in matters — a B-tree index on \`(user_id, status)\` is efficient for a query filtering on \`user_id\` alone, or on \`user_id\` AND \`status\` together, but it does NOT efficiently support a query filtering on \`status\` alone, without \`user_id\`, since the index is fundamentally sorted by \`user_id\` first, with \`status\` only sorted within each \`user_id\` group. This is directly analogous to a phone book sorted by last name then first name: finding everyone with the last name "Sharma" is fast; finding everyone with the last name "Sharma" whose first name is "Priya" is also fast (a quick scan within the "Sharma" section); but finding everyone whose first name is "Priya," regardless of last name, gets no help from this sorting at all, since the book was never organized by first name. Designing an index\'s column order to match how the application\'s actual, most common queries filter data is a genuine, deliberate design decision, not an arbitrary choice.

## Indexes are not free: the real cost on every write

\`\`\`sql
-- Every INSERT, UPDATE, or DELETE on this table must now also update the index
INSERT INTO users (email, password) VALUES ($1, $2);
-- the database updates the users table AND idx_users_email, not just the table alone
\`\`\`

An index meaningfully speeds up reads, but it is not free — every time a row is inserted, updated (on an indexed column), or deleted, the database must also update every index that covers the affected column, in addition to the underlying table itself. This means adding an index always trades some write performance for read performance, and adding indexes indiscriminately to every column "just in case" genuinely slows down every \`INSERT\`/\`UPDATE\`/\`DELETE\` on that table, while also consuming real additional disk space for each index\'s own separate data structure. The professional discipline this implies: add an index specifically where \`EXPLAIN ANALYZE\` or genuine, observed query patterns justify it (a column frequently used in a \`WHERE\` clause, a \`JOIN\` condition, or an \`ORDER BY\`), not reflexively on every column a table happens to have.

## When an index does not help, even though one exists

\`\`\`sql
-- A leading wildcard prevents the index from being used efficiently
SELECT * FROM users WHERE email LIKE '%example.com';  -- cannot use a standard B-tree index efficiently

-- Applying a function to the indexed column also prevents standard index use
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';  -- needs a separate functional index
\`\`\`

Two common, easy-to-miss cases where a standard B-tree index on \`email\` does NOT help: a \`LIKE\` pattern starting with a wildcard (\`'%example.com'\`) cannot benefit from a B-tree\'s sorted structure, since the index is sorted by each value\'s STARTING characters, and searching for something matching at the END of a value provides no useful starting point within that sorted order (a trailing wildcard, like \`'user@%'\`, generally CAN still use the index, since it does share a known prefix). Similarly, applying a function to the column being filtered (\`LOWER(email) = ...\`) means the database is now comparing the FUNCTION\'S OUTPUT against the search value, not the raw column value the standard index was built on — a separate, deliberately created "functional index" (indexing \`LOWER(email)\` specifically) is required to make this specific pattern fast. \`EXPLAIN ANALYZE\` is exactly how a query that "should" be using an index, but silently is not, gets caught in practice.`,

    contentHi: `## \`EXPLAIN ANALYZE\`: bilkul dekhna ki ek query dheemi kyun hai, sirf guess na karna

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Index ke bina:
-- Seq Scan on users  (cost=0.00..98523.00 rows=1 width=245) (actual time=812.441..812.442 rows=1 loops=1)
--   Filter: (email = 'user@example.com'::text)
--   Rows Removed by Filter: 4999999

-- Index ke saath:
-- Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=245) (actual time=0.031..0.032 rows=1 loops=1)
--   Index Cond: (email = 'user@example.com'::text)
\`\`\`

\`EXPLAIN ANALYZE\`, database ke khilaaf seedha chalaayi jaati hai, asal mein ek query execute karti hai aur bilkul report karti hai ki database ne use kaise chalaane ka faisla kiya, asli, naapi hui timing ke saath — ye ek query dheemi kyun hai iske baare mein guess karne ko thos saboot se badalta hai. Output mein \`Seq Scan\` confirm karta hai database ne ek poori sequential scan ki, aur \`Rows Removed by Filter: 4999999\` bilkul dikhaata hai ki use kitni rows padhni aur chhodni padi ek asli milaan paane se pehle; \`actual time=812.441..812.442\` report karta hai ki isme 800 milliseconds se zyaada laga. Index jodne ke baad, bilkul wahi query ka plan badalkar \`Index Scan using idx_users_email\` ho jaata hai, \`actual time=0.031..0.032\` ke saath — lagbhag 25,000 guna tez, ek aisi query ke liye jiska text kabhi bilkul nahi badla. Jab bhi ek query anaay-koshit dheemi mehsoos ho \`EXPLAIN ANALYZE\` ki taraf pahunchna, guess karne ke bajaye, standard professional practice hai — ye seedha dikhaata hai ki kya ek index istemal ho raha hai, aur agar nahi, kyun.

## Composite indexes: ek se zyaada column cover karna, aur kram kyun maayne rakhta hai

\`\`\`sql
-- Ek query jo do columns par saath filter karti hai
SELECT * FROM orders WHERE user_id = $1 AND status = 'pending';

-- Ek composite index jo dono cover karta hai, is bilkul kram mein
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
\`\`\`

Ek composite (multi-column) index kaayde se ek query ko support kar sakta hai jo kai columns par saath filter karti hai, par jis KRAM mein columns list hue hain wo maayne rakhta hai — \`(user_id, status)\` par ek B-tree index ek query ke liye kushal hai jo akele \`user_id\` par filter karti hai, ya \`user_id\` AUR \`status\` dono par saath, par ye ek query ko kushalta se support NAHI karta jo akele \`status\` par filter karti hai, \`user_id\` ke bina, kyunki index buniyaadi taur par pehle \`user_id\` se sorted hai, \`status\` sirf har \`user_id\` group ke andar sorted hai. Ye seedha ek phone book jaisa hai jo pehle last name phir first name se sorted hai: "Sharma" last name wale sab dhoondhna tez hai; "Sharma" last name wale sab jinka first name "Priya" hai bhi tez hai (Sharma section ke andar ek jaldi scan); par sab jinka first name "Priya" hai, last name se bekhabar, dhoondhna is sorting se bilkul koi madad nahi paata, kyunki book kabhi first name se organize hui hi nahi thi. Ek index ke column kram ko is tarike se design karna ki application ki asli, sabse aam queries data ko kaise filter karti hain se milta ho ek asli, jaan-boojhkar design faisla hai, koi manmaana choice nahi.

## Indexes muft nahi hain: har write par asli keemat

\`\`\`sql
-- Har INSERT, UPDATE, ya DELETE is table par ab index ko bhi update karna chahiye
INSERT INTO users (email, password) VALUES ($1, $2);
-- database users table AUR idx_users_email dono update karta hai, sirf table akela nahi
\`\`\`

Ek index reads ko maayne-rakhta tez karta hai, par ye muft nahi hai — har baar ek row insert hoti hai, update hoti hai (ek indexed column par), ya delete hoti hai, database ko asli table ke saath-saath asar wale column ko cover karta har index bhi update karna chahiye. Iska matlab hai ek index jodna hamesha kuch write performance ko read performance ke badle mein vinimay karta hai, aur har column par "just in case" bina soche-samjhe indexes jodna sach mein us table par har \`INSERT\`/\`UPDATE\`/\`DELETE\` ko dheema karta hai, saath hi har index ki apni alag data structure ke liye asli additional disk space bhi istemal karta hai. Isse zaahir hota professional anushasan: ek index khaas taur par wahin jodo jahan \`EXPLAIN ANALYZE\` ya asli, dekhe gaye query patterns ise uchit thehraate hain (ek column jo aksar ek \`WHERE\` clause, ek \`JOIN\` condition, ya ek \`ORDER BY\` mein istemal hota hai), reflexively har column par nahi jo ek table samyog se rakhta hai.

## Jab ek index madad nahi karta, chahe wo maujood ho

\`\`\`sql
-- Ek shuru mein wildcard index ko kushalta se istemal hone se rokta hai
SELECT * FROM users WHERE email LIKE '%example.com';  -- ek standard B-tree index kushalta se istemal nahi kar sakta

-- Indexed column par ek function lagaana bhi standard index istemal hone se rokta hai
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';  -- ek alag functional index chahiye
\`\`\`

Do aam, chhoot-jaane-mein-aasaan cases jahan \`email\` par ek standard B-tree index MADAD NAHI karta: ek \`LIKE\` pattern jo ek wildcard se shuru hota hai (\`'%example.com'\`) B-tree ki sorted sanrachna se faayda nahi utha sakta, kyunki index har value ke SHURUAATI characters se sorted hai, aur ek value ke AAKHIR mein milte kuch dhoondhna us sorted kram ke andar koi kaam ka shuruaati point nahi deta (ek trailing wildcard, jaisa \`'user@%'\`, aam taur par ABHI BHI index istemal kar SAKTA hai, kyunki ye ek jaana-pehchaana prefix share karta hai). Usi tarah, filter ho rahe column par ek function lagaana (\`LOWER(email) = ...\`) matlab hai database ab FUNCTION KE OUTPUT ko search value se compare kar raha hai, raw column value se nahi jis par standard index bana tha — ek alag, jaan-boojhkar banaayi "functional index" (khaas taur par \`LOWER(email)\` ko index karte hue) is khaas pattern ko tez banaane ke liye zaruri hai. \`EXPLAIN ANALYZE\` bilkul wo tarika hai jismein ek query jo "chahiye" ki ek index istemal kare, par chupke se nahi kar rahi, practice mein pakadi jaati hai.`,

    examples: [
      {
        title: 'Broken: a full sequential scan on every login attempt',
        titleHi: 'Toota: har login koshish par ek poori sequential scan',
        code: `SELECT * FROM users WHERE email = $1;
-- with no index on email, this reads every row until it finds a match`,
        codeJs: `app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const result = await pool.query<{ id: number; password: string }>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the missing index is
// a schema issue, invisible to the type system entirely.`,
        output: `500 test users: responds in ~2ms. 5 million real users, no index on
email: the same query now takes multiple seconds, confirmed via
EXPLAIN ANALYZE showing "Seq Scan" and millions of rows read and
discarded.`,
        explain: 'The application code never changed — the slowdown comes entirely from the database having no faster way to locate a matching row than reading every single one.',
        explainHi: 'Application code kabhi nahi badla — dheemi rafttaar poori tarah isliye aati hai kyunki database ke paas ek milti row dhoondhne ka har akeli padhne se tez koi tarika nahi hai.',
      },
      {
        title: 'Fixed: an index turns the scan into a direct lookup',
        titleHi: 'Theek: ek index scan ko ek seedhe lookup mein badalta hai',
        code: `CREATE UNIQUE INDEX idx_users_email ON users (email);
-- the exact same SELECT now uses an Index Scan instead of a Seq Scan`,
        codeJs: `// migration.sql (or a Prisma migration)
// CREATE UNIQUE INDEX idx_users_email ON users (email);

// server.js — completely unchanged
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `// migration.sql (or a Prisma migration)
// CREATE UNIQUE INDEX idx_users_email ON users (email);

// server.ts — completely unchanged
app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const result = await pool.query<{ id: number; password: string }>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The exact same query, against the exact same 5 million rows, now
responds in about the same couple of milliseconds it did with 500 test
rows — EXPLAIN ANALYZE now shows "Index Scan using idx_users_email"
instead of "Seq Scan".`,
        outputTs: `// Identical behaviour. Note the application source code is byte-for-
// byte unchanged between the broken and fixed versions — the entire
// fix lives in the database schema.`,
        explain: 'A UNIQUE index also enforces that no two users can share an email, doubling as a data-integrity constraint on top of its performance benefit.',
        explainHi: 'Ek \`UNIQUE\` index ye bhi lagu karta hai ki koi do users email share nahi kar sakte, apne performance faayde ke oopar ek data-integrity constraint ki tarah bhi kaam karte hue.',
      },
      {
        title: 'When an index silently does not help: a leading wildcard search',
        titleHi: 'Jab ek index chupke se madad nahi karta: ek shuru-mein-wildcard search',
        code: `SELECT * FROM users WHERE email LIKE '%@gmail.com';
-- idx_users_email exists, but a leading wildcard prevents its efficient use`,
        codeJs: `// Even with idx_users_email in place, this specific query pattern
// cannot use it efficiently — EXPLAIN ANALYZE would still show a Seq Scan
app.get("/admin/users-by-domain", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email LIKE $1",
      [\`%@\${req.query.domain}\`]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.get("/admin/users-by-domain", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email LIKE $1",
      [\`%@\${req.query.domain}\`]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the missing index
// benefit here is entirely about the query PATTERN, not a code defect.`,
        output: `Even with idx_users_email present, EXPLAIN ANALYZE on this specific
query still shows a Seq Scan — a leading '%' wildcard cannot benefit
from a standard B-tree index's sorted-by-prefix structure.`,
        explain: 'Having an index does not automatically mean every query on that column is fast — the query\'s specific shape determines whether the index can actually be used.',
        explainHi: 'Ek index hone ka matlab apne aap ye nahi hai ki us column par har query tez hai — query ki khaas shape tay karti hai ki kya index asal mein istemal ho sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `SELECT * FROM users WHERE email = $1;
// no index on email — a full table scan on every single call`,
        right: `CREATE UNIQUE INDEX idx_users_email ON users (email);
// the same query now uses a fast index lookup instead`,
        why: 'Without an index, the database must read every row to find a match — a cost that grows linearly with table size and eventually turns a fast query into a slow one at real production scale.',
        whyHi: 'Bina ek index ke, database ko ek milaan dhoondhne ke liye har row padhni chahiye — ek keemat jo table size ke saath linearly badhti hai aur aakhirkaar ek tez query ko asli production scale par ek dheemi query mein badal deti hai.',
      },
      {
        wrong: `CREATE INDEX idx_orders_status_user ON orders (status, user_id);
-- but the app always queries WHERE user_id = $1 AND status = $2`,
        right: `CREATE INDEX idx_orders_user_status ON orders (user_id, status);
-- column order matches how the application actually filters data`,
        why: 'A composite index\'s column order determines which query shapes it can efficiently support — an index built in the wrong order provides little to no benefit for the application\'s actual, common query pattern.',
        whyHi: 'Ek composite index ka column kram tay karta hai ye kaunse query shapes ko kushalta se support kar sakta hai — galat kram mein bana ek index application ke asli, aam query pattern ke liye kam ya bilkul faayda nahi deta.',
      },
      {
        wrong: `CREATE INDEX idx1 ON users (first_name);
CREATE INDEX idx2 ON users (last_name);
CREATE INDEX idx3 ON users (created_at);
// indexing every column "just in case", without checking actual query patterns`,
        right: `// Add an index specifically where EXPLAIN ANALYZE or real query
// patterns justify it, weighing the write-performance cost each time`,
        why: 'Every index slows down every INSERT/UPDATE/DELETE on that table and consumes real disk space — indexing indiscriminately trades away write performance for read speedups that may never actually be needed.',
        whyHi: 'Har index us table par har \`INSERT\`/\`UPDATE\`/\`DELETE\` ko dheema karta hai aur asli disk space istemal karta hai — bina soche-samjhe index karna write performance ko un read speedups ke badle mein deta hai jinki shaayad kabhi zarurat hi na pade.',
      },
    ],

    realWorld: [
      {
        en: '**A missing index on a frequently queried column is one of the most commonly cited root causes of "the app suddenly got slow" incidents in real production systems**, precisely because it is invisible in local development with small seed data and only manifests once a table reaches real volume.',
        hi: '**Ek aksar query hoti column par ek missing index asli production systems mein "app achaanak dheema ho gaya" incidents ke sabse aam cite hone waale mool wajahon mein se ek hai**, theek isliye kyunki ye local development mein chhote seed data ke saath adrishya hai aur sirf tab zaahir hota hai jab ek table asli volume tak pahunchta hai.',
      },
      {
        en: '**Every mainstream relational database (PostgreSQL, MySQL, SQL Server, Oracle) provides an EXPLAIN-style command specifically for diagnosing exactly this class of problem**, and reading query plans is considered a foundational, expected skill for any backend or database-adjacent role.',
        hi: '**Har mukhyadhaara relational database (PostgreSQL, MySQL, SQL Server, Oracle) khaas taur par bilkul is kism ki samasya diagnose karne ke liye ek EXPLAIN-style command deta hai**, aur query plans padhna kisi bhi backend ya database-adjacent role ke liye ek buniyaadi, ummeed ki jaane wali skill maani jaati hai.',
      },
      {
        en: '**ORMs like Prisma allow defining indexes directly in the schema file (@@index, @unique)**, which get applied through the same migration workflow used for table structure itself — indexing is a normal, expected part of schema design, not an obscure, separate DBA-only concern.',
        hi: '**Prisma jaise ORMs schema file mein seedha indexes define karne dete hain (\`@@index\`, \`@unique\`)**, jo table sanrachna ke liye istemal hue usi migration workflow ke through lagu hote hain — indexing schema design ka ek aam, ummeed kiya hissa hai, koi anjaan, alag DBA-only chinta nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a query that responds instantly with a small amount of test data become slow once a table holds millions of real rows, without any change to the query or application code?',
        qHi: 'Ek query jo thodi si test data ke saath turant jawaab deti hai ek baar table mein lakhon asli rows hon dheemi kyun ban jaati hai, query ya application code mein koi badlaav bina?',
        a: 'Without an index covering the column being searched, the database must perform a sequential scan to satisfy a WHERE clause — reading every single row in the table, in order, checking whether each one matches the search condition, since there is no faster way to know in advance which rows might match. The amount of work this requires is directly proportional to the number of rows in the table: scanning 500 rows and scanning 5 million rows are the same fundamental operation, differing only in how many times it must repeat. With a small number of test rows, this linear cost is negligible regardless — reading through even a few thousand rows takes a trivial amount of time on modern hardware. As the table grows to genuine production volume, however, that same linear relationship means the scan now involves reading through millions of rows for every single query, and the actual time this takes grows correspondingly, from an imperceptible fraction of a millisecond to multiple full seconds. The query\'s text and the application code executing it never change at all — the slowdown is purely a consequence of the underlying table\'s size growing, combined with the database having no faster mechanism, in the absence of an index, than checking every row one at a time.',
        aHi: 'Search ho rahe column ko cover karta koi index na hone par, database ko ek \`WHERE\` clause santusht karne ke liye ek sequential scan karni chahiye — table ki har akeli row padhte hue, tarteeb mein, check karte hue ki kya har ek search condition se milti hai, kyunki pehle se jaanne ka koi tezaar tarika nahi ki kaunsi rows mil sakti hain. Iske liye zaruri kaam ki tadaad table mein rows ki tadaad ke seedhe anupaat mein hai: 500 rows scan karna aur 50 lakh rows scan karna wahi buniyaadi operation hai, sirf isme farak hai ki isko kitni baar dohraana chahiye. Thodi tadaad ki test rows ke saath, ye linear keemat kisi bhi haal mein mamuli hai — kuch hazaar rows padhna bhi modern hardware par mamuli waqt leta hai. Table asli production volume tak badhte hi, halaanki, wahi linear rishta matlab hai scan ab har akeli query ke liye lakhon rows padhna shaamil karta hai, aur isme lagne wala asli waqt us anupaat mein badhta hai, ek adrishya millisecond ke hisse se kai poore seconds tak. Query ka text aur use chalaata application code bilkul kabhi nahi badalte — dheemi rafttaar poori tarah underlying table ki size badhne ka nateeja hai, database ke paas, index ki gairhaazri mein, har row ek-ek karke check karne se tez koi mechanism na hone ke saath.',
      },
      {
        q: 'How does an index actually make a lookup faster, and why does a composite index\'s column order affect which queries benefit from it?',
        qHi: 'Ek index ek lookup ko asal mein kaise tez banaata hai, aur ek composite index ka column kram kyun asar karta hai ki kaunsi queries use faayda uthaati hain?',
        a: 'An index is a separate data structure, commonly a B-tree, that the database maintains alongside the actual table — it stores the indexed column\'s values in sorted order, along with a pointer to where each corresponding full row actually lives. Because the values are kept sorted, locating a specific value (or a range of values) within a B-tree can be done in a small, predictable number of steps that grows only very slowly as the amount of data grows (logarithmically, rather than linearly like a full scan) — conceptually similar to how looking up a specific word in a sorted dictionary takes only a handful of comparisons regardless of whether the dictionary has one hundred or one hundred thousand pages, because each comparison can immediately eliminate roughly half of the remaining possibilities. A composite index built on multiple columns together is still fundamentally sorted this same way, but by the FIRST column primarily, then by the second column only within groups that share the same first-column value, and so on — this means the index can efficiently support a search that filters on the first column alone, or the first column together with later ones, but provides no useful starting point for a search that filters only on a LATER column without also specifying the first one, since the index\'s sort order was never organized around that later column in isolation. This is precisely why designing a composite index\'s column order to match how an application\'s real queries actually filter data is a genuine, deliberate design decision rather than an arbitrary one.',
        aHi: 'Ek index ek alag data structure hai, aam taur par ek B-tree, jise database asli table ke saath maintain karta hai — ye indexed column ki values ko sorted kram mein store karta hai, ek pointer ke saath ki har mili poori row asal mein kahan rehti hai. Kyunki values sorted rakhi jaati hain, ek khaas value (ya values ki ek range) ek B-tree ke andar dhoondhna ek chhoti, anumaanit tadaad ke steps mein kiya jaa sakta hai jo data ki tadaad badhne ke saath bahut dheere hi badhta hai (logarithmically, ek poori scan ki tarah linearly nahi) — conceptually us tarah jaisa ek sorted dictionary mein ek khaas shabd dhoondhna sirf mutthi bhar comparisons leta hai chahe dictionary mein sau pages hon ya ek lakh, kyunki har comparison lagbhag baaki mumkin cheezon ka aadha turant hata sakta hai. Kai columns par saath bana ek composite index abhi bhi buniyaadi taur par isi tarah sorted hai, par PEHLE column se pramukhta se, phir doosre column se sirf un groups ke andar jo wahi pehla-column value share karte hain, aur waise hi aage — iska matlab hai index ek aisi search ko kushalta se support kar sakta hai jo akele pehle column par filter karti hai, ya pehla column baad walon ke saath, par ek aisi search ke liye koi kaam ka shuruaati point nahi deta jo sirf ek BAAD wale column par filter karti hai pehla batae bina, kyunki index ka sort order kabhi us baad wale column ke aas-paas akele organize hua hi nahi tha. Bilkul isi wajah se ek composite index ke column kram ko is tarike se design karna ki ek application ki asli queries data ko kaise filter karti hain se milta ho ek asli, jaan-boojhkar design faisla hai, manmaana nahi.',
      },
      {
        q: 'Why is it a mistake to add an index to every column of a table "just in case," and what is the actual trade-off being made?',
        qHi: 'Ek table ke har column mein "just in case" ek index jodna galti kyun hai, aur asli trade-off kya hai jo kiya jaa raha hai?',
        a: 'An index genuinely speeds up reads on the column it covers, but this benefit is not free — the database must keep every index in a table perfectly synchronized with the table\'s actual data at all times, which means every INSERT adds a new entry to every relevant index, every UPDATE to an indexed column must update that column\'s index entry, and every DELETE must remove the corresponding entry from every index as well. This means each additional index adds real, ongoing overhead to every write operation on that table, on top of the underlying table modification itself — a table with ten indexes pays ten times the index-maintenance cost on every single insert compared to a table with one. Each index also consumes genuine additional disk space, entirely separate from the table\'s own data, since it is a full, separate data structure of its own. Adding an index to every column indiscriminately, without regard for whether that column is actually used in WHERE clauses, JOIN conditions, or ORDER BY clauses in real queries, means paying this ongoing write-performance and storage cost for indexes that may provide little or no actual read benefit, since an index only helps queries that are actually structured to take advantage of it. The professional discipline is to add indexes deliberately, based on genuine, observed query patterns (often confirmed via EXPLAIN ANALYZE) rather than reflexively, weighing the real write-side cost against the specific read-side benefit each index would provide.',
        aHi: 'Ek index jo column cover karta hai us par sach mein reads ko tez karta hai, par ye faayda muft nahi hai — database ko table mein har index ko table ke asli data ke saath hamesha poori tarah synchronized rakhna chahiye, matlab har \`INSERT\` har maayne-rakhta index mein ek nayi entry jodta hai, ek indexed column ko har \`UPDATE\` us column ki index entry update karna chahiye, aur har \`DELETE\` ko har index se milti entry bhi hataani chahiye. Iska matlab hai har additional index us table par har write operation mein asli, chalta overhead jodta hai, underlying table modification ke oopar — das indexes wala ek table har akele insert par ek wale table ke muqable das guna index-maintenance keemat chukaata hai. Har index bhi asli additional disk space istemal karta hai, table ke apne data se poori tarah alag, kyunki ye apni ek poori, alag data structure hai. Bina soche-samjhe har column mein ek index jodna, is baat ka khayaal kiye bina ki kya wo column asal mein asli queries mein \`WHERE\` clauses, \`JOIN\` conditions, ya \`ORDER BY\` clauses mein istemal hota hai, matlab hai un indexes ke liye ye chalti write-performance aur storage keemat chukaana jo shaayad kam ya bilkul koi asli read faayda na dein, kyunki ek index sirf un queries ki madad karta hai jo asal mein iska faayda uthaane ke liye structured hain. Professional anushasan ye hai ki indexes jaan-boojhkar jodo, asli, dekhe gaye query patterns ke aadhaar par (aksar \`EXPLAIN ANALYZE\` se confirm kiye), reflexively nahi, har index jo asli write-side keemat aur khaas read-side faayda dega use taul kar.',
      },
    ],

    exercises: [
      {
        task: 'Seed a users table with 500,000+ rows (a simple loop generating random emails is enough) and run EXPLAIN ANALYZE on SELECT * FROM users WHERE email = $1 with no index. Note the "Seq Scan" and the actual time reported.',
        taskHi: '500,000+ rows wala ek users table seed karo (random emails banaata ek saadha loop kaafi hai) aur \`SELECT * FROM users WHERE email = $1\` par \`EXPLAIN ANALYZE\` chalaao bina index ke. "Seq Scan" aur report hua actual time note karo.',
        hint: 'Search for an email far down the alphabetically-unsorted table (or one that does not exist at all) to force the worst-case full scan, making the slowdown maximally obvious.',
        hintHi: 'Alphabetically-na-sorted table mein kaafi neeche wali ek email search karo (ya ek jo maujood hi nahi) worst-case poori scan force karne ke liye, dheemi rafttaar ko poori tarah saaf banaate hue.',
      },
      {
        task: 'Add CREATE UNIQUE INDEX idx_users_email ON users (email), rerun the exact same EXPLAIN ANALYZE query, and confirm the plan now shows "Index Scan" with a dramatically lower actual time.',
        taskHi: '\`CREATE UNIQUE INDEX idx_users_email ON users (email)\` jodo, bilkul wahi \`EXPLAIN ANALYZE\` query dobara chalaao, aur confirm karo plan ab "Index Scan" dikhaata hai ek naatakiya taur par kam actual time ke saath.',
        hint: 'Time a real login request through the actual Express route (not just the raw SQL) before and after adding the index, to see the end-to-end difference a real user would experience.',
        hintHi: 'Ek asli login request ko asli Express route ke through (sirf raw SQL nahi) index jodne se pehle aur baad naapo, ek asli user jo anubhav karega wo end-to-end farak dekhne ke liye.',
      },
      {
        task: 'Run EXPLAIN ANALYZE on SELECT * FROM users WHERE email LIKE \'%@gmail.com\' with the index in place, and confirm it still shows a Seq Scan — directly observing that an index does not automatically help every query pattern on that column.',
        taskHi: '\`EXPLAIN ANALYZE\` \`SELECT * FROM users WHERE email LIKE \'%@gmail.com\'\` par chalaao index maujood hote hue, aur confirm karo ye abhi bhi ek Seq Scan dikhaata hai — seedha dekhte hue ki ek index apne aap us column par har query pattern ki madad nahi karta.',
        hint: 'Also try the equivalent trailing-wildcard version (LIKE \'user%\') and compare its EXPLAIN ANALYZE output against the leading-wildcard version to see the difference directly.',
        hintHi: 'Barabar trailing-wildcard version bhi try karo (\`LIKE \'user%\'\`) aur uska \`EXPLAIN ANALYZE\` output leading-wildcard version se compare karo farak seedha dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'Without an index on a searched column, the database must sequentially scan every row to find a match — a cost that grows linearly with table size and is invisible with small local test data.',
      'An index (commonly a B-tree) keeps a column\'s values sorted separately from the table, letting the database locate matches in a small number of steps regardless of table size, instead of scanning every row.',
      'EXPLAIN ANALYZE shows exactly how a query executes (Seq Scan vs Index Scan) with real measured timing, replacing guesswork with concrete evidence when diagnosing a slow query.',
      'A composite index\'s column order matters: it efficiently supports queries filtering on its leading column(s) but provides no benefit for queries filtering only on a later column in isolation.',
      'Indexes are not free — every write (INSERT/UPDATE/DELETE) must also update every relevant index, and each index consumes real disk space, so indexes should be added deliberately based on actual query patterns.',
      'A leading wildcard (LIKE \'%text\') or applying a function to an indexed column (LOWER(email)) prevents a standard index from being used efficiently, even when one exists on that column.',
    ],
    keyTakeawaysHi: [
      'Ek search ho rahe column par index bina, database ko ek milaan dhoondhne ke liye har row sequentially scan karni chahiye — ek keemat jo table size ke saath linearly badhti hai aur chhote local test data ke saath adrishya hai.',
      'Ek index (aam taur par ek B-tree) ek column ki values ko table se alag sorted rakhta hai, database ko har row scan karne ke bajaye thodi tadaad ke steps mein milaan dhoondhne deta hai, table size se bekhabar.',
      '\`EXPLAIN ANALYZE\` bilkul dikhaata hai ki ek query kaise execute hoti hai (Seq Scan vs Index Scan) asli naapi hui timing ke saath, ek dheemi query diagnose karte waqt guesswork ko thos saboot se badalte hue.',
      'Ek composite index ka column kram maayne rakhta hai: ye kushalta se un queries ki madad karta hai jo iske shuruaati column(s) par filter karti hain par un queries ke liye koi faayda nahi deta jo akele ek baad wale column par filter karti hain.',
      'Indexes muft nahi hain — har write (\`INSERT\`/\`UPDATE\`/\`DELETE\`) ko har maayne-rakhta index bhi update karna chahiye, aur har index asli disk space istemal karta hai, isliye indexes jaan-boojhkar asli query patterns ke aadhaar par jodne chahiye.',
      'Ek shuru mein wildcard (\`LIKE \'%text\'\`) ya ek indexed column par ek function lagaana (\`LOWER(email)\`) ek standard index ko kushalta se istemal hone se rokta hai, chahe wo us column par maujood ho.',
    ],
  },
];
