/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 3.
 *
 * Safe production migrations: why running a schema change directly against
 * a live production database with real data can either fail outright or,
 * worse, silently lock the entire table and take the application down for
 * every user while it runs. Broken example: adding a NOT NULL column with a
 * default directly to a "users" table holding millions of real rows —
 * postgres must rewrite every existing row to populate the new column,
 * holding a lock that blocks all reads and writes on that table for the
 * entire duration, a routine change in a small dev database becoming a
 * multi-minute full outage in production. Fixed by tracking schema changes
 * as versioned migration files (Prisma Migrate) applied identically in
 * every environment, and by splitting a NOT NULL column addition into safe
 * steps: add nullable, backfill in batches, then add the constraint once
 * every row already has a value.
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

export const NODE_MODULE_7_PART3: CourseLesson[] = [
  {
    slug: 'safe-production-migrations',
    title: 'Safe Migrations: Why "It Ran Fine in Dev" Can Take Production Down',
    titleHi: 'Surakshit Migrations: "Dev Mein To Theek Chala" Production Ko Kyun Gira Sakta Hai',
    description: 'A one-line ALTER TABLE that runs instantly against a 200-row development database locks the entire "users" table for four full minutes in production — and every single request touching that table fails during the lock.',
    descriptionHi: 'Ek ek-line ka \'ALTER TABLE\' jo 200-row wale development database ke khilaaf turant chalta hai production mein poore "users" table ko poore 4 minute ke liye lock kar deta hai — aur us table ko chhuti har akeli request lock ke dauraan fail hoti hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A librarian who decides to add a new field to every single index card in the catalog, and does it by locking the entire card catalog cabinet and personally rewriting all four million cards, one at a time, before letting anyone touch the cabinet again — versus one who adds the field gradually, card by card, in small batches, while the catalog stays open and usable the whole time.** Running a schema change that requires touching every existing row directly against a live production database is like a librarian who, needing to add a "last checked out" field to every card in a four-million-card catalog, decides the only proper way to do this is to lock the entire cabinet, forbid anyone from looking anything up, and personally go through and rewrite all four million cards from the very first to the very last, one at a time, only reopening the cabinet once every single card has been updated. With a small test catalog of two hundred cards, this "lock everything and rewrite it all" approach finishes in under a second — nobody waiting to look something up even notices the cabinet was briefly closed. With the real four-million-card catalog, the exact same approach means the cabinet stays locked, and every patron in the library is turned away empty-handed, for however long it genuinely takes to individually rewrite four million cards — which could be minutes, during which the library is functionally closed for lookups. A librarian who instead updates cards in small batches — a few hundred at a time, briefly locking only that small batch rather than the whole cabinet, and stepping back to let patrons through between batches — achieves the exact same end result, a fully updated catalog, without ever fully closing the library to anyone for more than a brief moment at a time.',
      hi: '**Ek librarian jo catalog ke har akele index card mein ek naya field jodne ka faisla karta hai, aur ise poore card catalog cabinet ko lock karke aur sab chaar million cards ko personally, ek-ek karke, dobara likhkar karta hai, kisi ko bhi cabinet ko dobara chhune dene se pehle — versus ek jo field ko dheere-dheere, card-dar-card, chhote batches mein jodta hai, jabki catalog poori der khula aur istemal-ke-laayak rehta hai.** Ek schema change jise har maujooda row chhuna chahiye seedha ek live production database ke khilaaf chalaana ek aise librarian jaisa hai jo, chaar-million-card catalog mein har card mein "last checked out" field jodne ki zarurat mein, faisla leta hai ki iska aikela sahi tarika poora cabinet lock karna hai, kisi ko bhi kuch dhoondhne se mana karna hai, aur personally sab chaar million cards ko bilkul pehle se bilkul aakhri tak, ek-ek karke, dobara likhna hai, cabinet ko sirf tab dobara kholte hue jab bilkul har akela card update ho chuka ho. Do sau cards wale ek chhote test catalog ke saath, ye "sab kuch lock karo aur dobara likho" tarika ek second se kam mein poora ho jaata hai — koi bhi kuch dhoondhne ka intezaar karta insaan bhi notice nahi karta ki cabinet thodi der ke liye band tha. Asli chaar-million-card catalog ke saath, bilkul wahi tarika matlab hai cabinet locked rehta hai, aur library ka har patron khaali-haath wapas bheja jaata hai, jitna bhi waqt chaar million cards ko akele-akele dobara likhne mein sach mein lagta hai — jo minutes ho sakta hai, jis dauraan library functionally lookups ke liye band hai. Ek librarian jo iske bajaye cards ko chhote batches mein update karta hai — ek waqt mein kuch sau, sirf us chhote batch ko thodi der ke liye lock karte hue poore cabinet ke bajaye, aur batches ke beech patrons ko guzarne dene ke liye peeche hatte hue — bilkul wahi aakhri nateeja haasil karta hai, ek poori tarah update ka hua catalog, kabhi library ko kisi ke liye ek waqt mein ek chhote pal se zyaada poori tarah band kiye bina.',
    },

    simple: `**Start broken.** A one-line migration that seems perfectly reasonable, tested against a small local database:

\`\`\`sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
\`\`\`

Against a local development database holding 200 test users, this command completes in a fraction of a second — the column is added, every existing row gets the default empty string, and the developer moves on, having genuinely tested the change and confirmed it works. The exact same command, run directly against the production database holding 8 million real user rows, behaves very differently: in many database engines (notably older PostgreSQL versions, and it remains a common gotcha across engines more broadly), adding a column with a \`DEFAULT\` value forces the database to go back and rewrite every single EXISTING row to actually store that default value in the new column — this is not a fast, instantaneous metadata change, but a genuine, row-by-row data rewrite across the entire table. While this rewrite is in progress, the database holds an exclusive lock on the \`users\` table, meaning every other query trying to read from or write to \`users\` — every login attempt, every profile lookup, every signup, across the entire application — must wait for the migration to finish before it can even begin. With 8 million rows, this rewrite can genuinely take several minutes, during which the application is functionally down for anything touching that table, even though nothing about the actual application code changed, and the exact same migration command "worked perfectly" moments earlier against the small development database.

**The fix: split the change into safe, non-locking steps**

\`\`\`sql
-- Step 1: add the column as nullable — fast, no data rewrite required at all
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- Step 2: backfill existing rows in small batches, not one giant transaction
UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id BETWEEN 1 AND 10000;
UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id BETWEEN 10001 AND 20000;
-- ...repeated in batches across the whole table, run as separate, short transactions...

-- Step 3: only once every row has a value, add the constraint
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;
\`\`\`

\`\`\`ts
// A small script that performs the batched backfill programmatically
async function backfillPhoneNumbers(): Promise<void> {
  let processed = 0;
  while (true) {
    const result = await pool.query(
      "UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id IN (SELECT id FROM users WHERE phone_number IS NULL LIMIT 10000)"
    );
    if (result.rowCount === 0) break;
    processed += result.rowCount;
    console.log(\`Backfilled \${processed} rows so far\`);
    await new Promise((resolve) => setTimeout(resolve, 100)); // a brief pause between batches
  }
}
\`\`\`

Adding the column WITHOUT a default (\`ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);\`, with no \`NOT NULL\` and no \`DEFAULT\`) is a fast, metadata-only change in most database engines — it does not require touching a single existing row, since existing rows simply get \`NULL\` for the new column, which requires no rewrite. Backfilling actual values happens SEPARATELY, in small batches (a few thousand rows per \`UPDATE\`, each its own short transaction) rather than one enormous \`UPDATE\` touching all 8 million rows at once — each individual batch holds its lock only briefly, and the application remains fully responsive between batches, since no single operation ever holds a table-wide lock for more than a moment. Only once every row genuinely has a value (confirmed by checking that no rows remain with \`phone_number IS NULL\`) does the final step add the actual \`NOT NULL\` constraint — a check the database can now perform quickly, since it is only verifying existing data rather than rewriting it. The exact same end state is reached — every row has a non-null \`phone_number\` — without ever taking the application down while getting there.`,

    simpleHi: `**Toote hue se shuru.** Ek ek-line ki migration jo poori tarah samajhdaari-bhari lagti hai, ek chhote local database ke khilaaf test ki gayi:

\`\`\`sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
\`\`\`

200 test users wale ek local development database ke khilaaf, ye command ek second ke hisse mein poora hota hai — column jud jaata hai, har maujooda row ko default khaali string milta hai, aur developer aage badh jaata hai, badlaav ko sach mein test karke aur confirm karke ki ye kaam karta hai. Bilkul wahi command, seedha 80 lakh asli user rows wale production database ke khilaaf chalaayi jaaye, bahut alag vyavhaar karti hai: kai database engines mein (khaas taur par purane PostgreSQL versions, aur ye engines mein zyaada vyapak taur par ek aam gotcha bana rehta hai), ek \`DEFAULT\` value wala column jodna database ko wapas jaakar har akeli MAUJOODA row ko dobara likhne majboor karta hai us default value ko naye column mein asal mein store karne ke liye — ye ek tez, turant metadata badlaav nahi hai, balki poore table ke aar-paar ek asli, row-dar-row data rewrite hai. Jab tak ye rewrite chal raha hai, database \`users\` table par ek exclusive lock rakhta hai, matlab har doosri query jo \`users\` se padhne ya likhne ki koshish kar rahi hai — har login koshish, har profile lookup, har signup, poori application mein — migration khatam hone ka intezaar karna chahiye us se pehle ki ye shuru bhi ho sake. 80 lakh rows ke saath, ye rewrite sach mein kai minute le sakta hai, jis dauraan application us table ko chhuti kisi bhi cheez ke liye functionally band hai, chahe application code mein kuch bhi na badla ho, aur bilkul wahi migration command kuch pal pehle chhote development database ke khilaaf "poori tarah kaam kar gaya."

**Fix: badlaav ko surakshit, non-locking steps mein baanto**

\`\`\`sql
-- Step 1: column ko nullable ki tarah jodo — tez, koi data rewrite bilkul zaruri nahi
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- Step 2: maujooda rows ko chhote batches mein backfill karo, ek vishaal transaction nahi
UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id BETWEEN 1 AND 10000;
UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id BETWEEN 10001 AND 20000;
-- ...poore table ke aar-paar batches mein dohraaya, alag, chhoti transactions ki tarah chalaaya...

-- Step 3: sirf ek baar har row mein ek value ho, constraint jodo
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;
\`\`\`

\`\`\`ts
// Ek chhota script jo batched backfill programmatically karta hai
async function backfillPhoneNumbers(): Promise<void> {
  let processed = 0;
  while (true) {
    const result = await pool.query(
      "UPDATE users SET phone_number = '' WHERE phone_number IS NULL AND id IN (SELECT id FROM users WHERE phone_number IS NULL LIMIT 10000)"
    );
    if (result.rowCount === 0) break;
    processed += result.rowCount;
    console.log(\`Backfilled \${processed} rows so far\`);
    await new Promise((resolve) => setTimeout(resolve, 100)); // batches ke beech ek chhoti pause
  }
}
\`\`\`

Column ko BINA default ke jodna (\`ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);\`, koi \`NOT NULL\` nahi aur koi \`DEFAULT\` nahi) zyaadatar database engines mein ek tez, sirf-metadata badlaav hai — ise ek bhi maujooda row chhune ki zarurat nahi, kyunki maujooda rows ko naye column ke liye bas \`NULL\` mil jaata hai, jise kisi rewrite ki zarurat nahi. Asli values backfill karna ALAG SE hota hai, chhote batches mein (ek \`UPDATE\` prati kuch hazaar rows, har ek apni chhoti transaction) ek vishaal \`UPDATE\` ke bajaye jo sab 80 lakh rows ko ek saath chhue — har akela batch apna lock sirf thodi der ke liye rakhta hai, aur application batches ke beech poori tarah responsive rehta hai, kyunki koi bhi akela operation kabhi ek pal se zyaada table-wide lock nahi rakhta. Sirf ek baar har row sach mein ek value rakhe (check karke confirm hote hue ki koi rows \`phone_number IS NULL\` ke saath nahi bachi), aakhri step asli \`NOT NULL\` constraint jodta hai — ek check jise database ab jaldi kar sakta hai, kyunki ye sirf maujooda data verify kar raha hai use dobara likhne ke bajaye. Bilkul wahi aakhri sthiti tak pahuncha jaata hai — har row ka ek non-null \`phone_number\` hai — application ko wahan tak pahunchne ke dauraan kabhi nahi giraaye bina.`,

    content: `## Migration tools: tracking schema changes as versioned, ordered files

\`\`\`
prisma/migrations/
  20260110120000_add_phone_number/
    migration.sql
  20260115093000_add_orders_table/
    migration.sql
\`\`\`

\`\`\`bash
npx prisma migrate dev --name add_phone_number
npx prisma migrate deploy   # applied identically in production
\`\`\`

Following this course\'s earlier note that manually SSH-ing into a server and running ad-hoc commands leads to unstated, drifting environment assumptions (the clustering and Docker lessons), running schema changes as one-off manual SQL commands has the same underlying problem: nobody has a reliable record of exactly what changes were applied, in what order, or whether every environment (a teammate\'s laptop, staging, production) is actually in the same schema state. A migration tool like Prisma Migrate tracks every schema change as its own versioned, timestamped file, checked into the project\'s own source control alongside the application code — \`prisma migrate dev\` creates and applies a new migration file locally during development, and \`prisma migrate deploy\` applies any migrations not yet run, in the exact same order, against any other environment, including production. This makes the database schema itself something the team can review, discuss, and reproduce identically everywhere, in the same way version control already does for the application\'s own code.

## Why "it worked instantly in dev" is not evidence a migration is safe

\`\`\`
Development database: 200 rows — a table rewrite touching every row
finishes in a few milliseconds, indistinguishable from an instant,
metadata-only change.

Production database: 8 million rows — the exact same table rewrite
takes minutes, and the exclusive lock it holds blocks every other
query on that table for the entire duration.
\`\`\`

A migration that requires rewriting every existing row (adding a column with a default, changing a column\'s type, adding certain kinds of constraints) has a cost that is directly proportional to the number of rows already in the table — with a small development database, this cost is so small it is effectively imperceptible, which is precisely why it is easy to conclude a migration is "safe" purely from having run it successfully in development. The same migration against a production table with real, large-scale volume pays that same per-row cost multiplied by a number of rows that may be many orders of magnitude larger, turning an imperceptible local delay into a genuinely long-running, lock-holding operation. This is a direct continuation of this course\'s earlier lessons on things that "work fine with a handful of test rows" and only reveal their real cost at production scale (the N+1 query problem, the unbounded-pagination lesson) — migrations are subject to the exact same principle.

## Recognizing which migrations are risky before running them

\`\`\`sql
-- Generally fast, metadata-only, safe even on a large table:
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);          -- no default, nullable
CREATE INDEX CONCURRENTLY idx_users_phone ON users (phone_number); -- built without locking writes

-- Generally requires a full table rewrite, risky on a large table without splitting into steps:
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE users ALTER COLUMN age TYPE BIGINT;                  -- changing an existing column's type
\`\`\`

Recognizing which category a specific migration falls into before running it against production is the core professional skill this lesson builds toward — adding a column with no default and no \`NOT NULL\` constraint is typically fast regardless of table size; adding one WITH a default, changing an existing column\'s data type, or adding certain constraints typically requires touching every row and should be treated with the batching approach this lesson demonstrates. Note also that even building an index (this course\'s earlier indexing lesson) can itself lock a large table by default — PostgreSQL\'s \`CREATE INDEX CONCURRENTLY\` (a slower but non-locking way to build the same index) exists specifically to build a new index on a large, actively-used production table without blocking other queries in the meantime, following the same underlying "avoid holding a long lock on a big table" principle as the batched-backfill approach.

## Migrations must be reversible: what happens if a deploy needs to roll back

\`\`\`sql
-- migration.sql (up)
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- rollback.sql (down) — the corresponding undo, ready if this deploy needs reverting
ALTER TABLE users DROP COLUMN phone_number;
\`\`\`

A production deploy occasionally needs to be rolled back — a bug discovered shortly after release, an unrelated failure requiring a quick revert — and a schema migration bundled with that deploy needs a corresponding way to be undone cleanly if that happens. Thinking through a migration\'s reverse operation at the time it is written (rather than improvising one under pressure during an actual incident) is a standard part of writing a production-safe migration, and most migration tools support defining or generating this "down" migration alongside the "up" one.`,

    contentHi: `## Migration tools: schema changes ko versioned, ordered files ki tarah track karna

\`\`\`
prisma/migrations/
  20260110120000_add_phone_number/
    migration.sql
  20260115093000_add_orders_table/
    migration.sql
\`\`\`

\`\`\`bash
npx prisma migrate dev --name add_phone_number
npx prisma migrate deploy   # production mein bhi bilkul waisa hi lagu hota hai
\`\`\`

Is course ke pehle wale note ka palan karte hue ki server mein manually SSH karna aur ad-hoc commands chalaana na-kahi gayi, drift hoti environment maanyaton ki taraf le jaata hai (clustering aur Docker lessons), schema changes ko ek-baar wale manual SQL commands ki tarah chalaana wahi underlying samasya rakhta hai: kisi ke paas ek bharosemand record nahi hai ki bilkul kaunse badlaav lagu hue, kis kram mein, ya kya har environment (ek teammate ka laptop, staging, production) asal mein wahi schema sthiti mein hai. Prisma Migrate jaisa ek migration tool har schema badlaav ko apni versioned, timestamped file ki tarah track karta hai, project ke apne source control mein application code ke saath check-in ki gayi — \`prisma migrate dev\` development ke dauraan locally ek nayi migration file banaata aur lagu karta hai, aur \`prisma migrate deploy\` kisi bhi abhi tak na-chali migrations ko lagu karta hai, bilkul wahi kram mein, kisi bhi doosre environment ke khilaaf, production sameet. Ye database schema ko khud kuch aisa banaata hai jise team review, discuss, aur har jagah identical taur par reproduce kar sakti hai, usi tarike se jaise version control pehle se application ke apne code ke liye karta hai.

## "Dev mein turant kaam kiya" ye saboot kyun nahi hai ki ek migration surakshit hai

\`\`\`
Development database: 200 rows — ek table rewrite jo har row chhuti hai
kuch millisecond mein poori hoti hai, ek turant, sirf-metadata badlaav se
alag-nahi-pehchaani-jaane-laayak.

Production database: 80 lakh rows — bilkul wahi table rewrite minutes
leta hai, aur us par rakha exclusive lock us table par poori avdhi ke
liye har doosri query ko rokta hai.
\`\`\`

Ek migration jise har maujooda row dobara likhni chahiye (ek default wala column jodna, ek column ki kism badalna, kuch kism ki constraints jodna) ki keemat table mein pehle se rows ki tadaad ke seedhe anupaat mein hai — ek chhote development database ke saath, ye keemat itni chhoti hai ki asar mein adrishya hai, bilkul isi wajah se ye nateeja nikaalna aasaan hai ki ek migration "surakshit" hai sirf development mein safaltapoorvak chalaane se. Asli, bade-paimaane ki volume wale ek production table ke khilaaf wahi migration wahi prati-row keemat chukaati hai kai order-of-magnitude badi rows ki tadaad se guna karke, ek adrishya local deri ko ek sach mein lambi-chalti, lock-rakhti operation mein badalte hue. Ye is course ke pehle wale lessons ka ek seedha jaari raakhna hai un cheezon ke baare mein jo "mutthi bhar test rows ke saath theek kaam karti hain" aur sirf production scale par apni asli keemat zaahir karti hain (N+1 query problem, unbounded-pagination lesson) — migrations bilkul isi principle ke adheen hain.

## Kaunsi migrations khatarnaak hain ye unhe chalaane se pehle pehchaanna

\`\`\`sql
-- Aam taur par tez, sirf-metadata, ek bade table par bhi surakshit:
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);          -- koi default nahi, nullable
CREATE INDEX CONCURRENTLY idx_users_phone ON users (phone_number); -- writes ko lock kiye bina bana

-- Aam taur par ek poori table rewrite chahiye, ek bade table par steps mein baante bina khatarnaak:
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE users ALTER COLUMN age TYPE BIGINT;                  -- ek maujooda column ki kism badalna
\`\`\`

Ye pehchaanna ki ek khaas migration production ke khilaaf chalaane se pehle kaunsi category mein aati hai is lesson ki mool professional skill hai jise ye banaata hai — bina default aur bina \`NOT NULL\` constraint ke ek column jodna aam taur par table size se bekhabar tez hota hai; ek default ke SAATH jodna, ek maujooda column ki data kism badalna, ya kuch constraints jodna aam taur par har row chhune ki maang karta hai aur ise is lesson mein dikhaaye batching tarike se treat karna chahiye. Note karo bhi ki ek index banaana bhi (is course ka pehle wala indexing lesson) khud default taur par ek bade table ko lock kar sakta hai — PostgreSQL ka \`CREATE INDEX CONCURRENTLY\` (wahi index banaane ka ek dheema par na-lock-karne wala tarika) khaas taur par isliye maujood hai taaki ek bade, actively-istemal-hote production table par ek naya index bina beech mein doosri queries block kiye banaaya jaa sake, batched-backfill tarike ke usi underlying "ek bade table par ek lambi lock rakhne se bacho" principle ka palan karte hue.

## Migrations reversible hone chahiye: kya hota hai agar ek deploy ko rollback karna pade

\`\`\`sql
-- migration.sql (up)
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- rollback.sql (down) — barabar undo, taiyaar agar ye deploy revert karni pade
ALTER TABLE users DROP COLUMN phone_number;
\`\`\`

Ek production deploy ko kabhi-kabhi rollback karna zaruri hai — release ke thodi der baad dhoondha gaya ek bug, ek na-judi asafalta jise jaldi revert karna chahiye — aur us deploy ke saath bundle ki gayi ek schema migration ko agar aisa ho to saaf tarike se undo hone ka ek barabar tarika chahiye. Ek migration ki reverse operation likhne ke waqt hi soch lena (ek asli incident ke dauraan dabaav mein ek banaane ke bajaye) ek production-safe migration likhne ka ek standard hissa hai, aur zyaadatar migration tools "up" ke saath "down" migration define ya generate karna support karte hain.`,

    examples: [
      {
        title: 'Broken: an ALTER TABLE with a default locks a large production table',
        titleHi: 'Toota: ek default wala \`ALTER TABLE\` ek bade production table ko lock karta hai',
        code: `ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
-- fast against 200 dev rows, but rewrites all 8 million production rows,
-- holding an exclusive lock the entire time`,
        codeJs: `// migration.sql — run directly against production
// ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';

// Meanwhile, every other route touching "users" is blocked for the
// entire duration of the rewrite:
app.post("/login", async (req, res, next) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
  // this query queues behind the migration's table-wide lock
});`,
        codeTs: `// migration.sql — run directly against production
// ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';

app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [req.body.email]
  );
  // Correctly typed, completely valid TypeScript — the outage comes
  // entirely from the migration's lock, not from any application code.
});`,
        output: `Development (200 rows): completes in milliseconds. Production (8
million rows): the ALTER TABLE takes several minutes, and every login,
signup, and profile lookup queues behind its exclusive lock for the
entire duration.`,
        explain: 'The migration\'s cost scales directly with the number of existing rows — a change that is imperceptible in development can become a genuine, multi-minute outage at real production scale.',
        explainHi: 'Migration ki keemat maujooda rows ki tadaad ke saath seedhe taur par scale karti hai — ek badlaav jo development mein adrishya hai asli production scale par ek asli, kai-minute ki outage ban sakta hai.',
      },
      {
        title: 'Fixed: add nullable, backfill in batches, then constrain',
        titleHi: 'Theek: nullable jodo, batches mein backfill karo, phir constraint karo',
        code: `ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
-- backfill in small batches, each a short, separate transaction
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;`,
        codeJs: `// Step 1 — fast, no rewrite
// ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

// Step 2 — a script backfilling in batches
async function backfillPhoneNumbers(pool) {
  while (true) {
    const result = await pool.query(
      \`UPDATE users SET phone_number = ''
       WHERE id IN (SELECT id FROM users WHERE phone_number IS NULL LIMIT 10000)\`
    );
    if (result.rowCount === 0) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Step 3 — fast now, since every row already has a value
// ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;`,
        codeTs: `import { Pool } from "pg";

async function backfillPhoneNumbers(pool: Pool): Promise<void> {
  while (true) {
    const result = await pool.query(
      \`UPDATE users SET phone_number = ''
       WHERE id IN (SELECT id FROM users WHERE phone_number IS NULL LIMIT 10000)\`
    );
    if (result.rowCount === 0) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
// Step 3, once backfillPhoneNumbers completes:
// ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;`,
        outputJs: `The application remains fully responsive throughout — each batch's
brief lock releases before the next begins, and login/signup/profile
routes continue serving normally the entire time the backfill runs in
the background.`,
        outputTs: `// Identical behaviour. The same end state — every row has a non-null
// phone_number — is reached without ever holding a long, table-wide
// lock at any single point.`,
        explain: 'No single step ever touches the whole table at once — the total work is the same, but it is spread across many short operations instead of one long one holding a lock the whole time.',
        explainHi: 'Koi bhi akela step kabhi poore table ko ek saath nahi chhuta — kul kaam wahi hai, par ye kai chhoti operations mein phaila hua hai ek lambe operation ke bajaye jo poori der ek lock rakhta.',
      },
      {
        title: 'Recognizing a risky migration before running it',
        titleHi: 'Ek khatarnaak migration ko chalaane se pehle pehchaanna',
        code: `ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);          -- safe: no default
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) DEFAULT ''; -- risky: rewrites every row`,
        codeJs: `// Safe on a large table — no existing row needs to be touched
// ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

// Risky on a large table — every existing row must be rewritten to
// store the default value
// ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) DEFAULT '';

// Safe way to build an index without blocking other queries
// CREATE INDEX CONCURRENTLY idx_users_phone ON users (phone_number);`,
        codeTs: `// The distinction here is entirely at the SQL/schema level — there is
// no TypeScript code difference between a safe and risky migration,
// which is exactly why this recognition skill has to be learned
// deliberately rather than caught by any compiler.`,
        outputJs: `Recognizing which category a migration falls into BEFORE running it
against production is the actual skill — the safe version completes
in milliseconds regardless of table size; the risky version's cost
scales with the table's row count.`,
        outputTs: `// No code output difference — this distinction lives entirely in how
// the database processes the migration, not in anything a type
// checker could flag.`,
        explain: 'The same surface-level change (adding a column) can be either free or genuinely expensive depending on one detail — whether it includes a default value — which is easy to overlook without knowing to look for it.',
        explainHi: 'Wahi upar-se-dikhta badlaav (ek column jodna) ya to muft ho sakta hai ya sach mein mehenga, ek detail par nirbhar karte hue — kya isme ek default value shaamil hai — jise dhoondhna jaane bina nazarandaaz karna aasaan hai.',
      },
    ],

    mistakes: [
      {
        wrong: `ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '';
// runs directly against production, rewriting every existing row while holding a lock`,
        right: `ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
-- backfill in batches, then --
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;
// no single step ever locks the whole table for long`,
        why: 'Adding a column with a default forces the database to rewrite every existing row while holding a lock — on a large production table this can take minutes, blocking every other query on that table the entire time.',
        whyHi: 'Ek default wala column jodna database ko ek lock rakhte hue har maujooda row dobara likhne majboor karta hai — ek bade production table par ye minutes le sakta hai, us table par har doosri query ko poori der rokte hue.',
      },
      {
        wrong: `ssh production && psql -c "ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);"
// an ad-hoc, unrecorded manual change`,
        right: `npx prisma migrate deploy
// applies versioned migration files tracked in source control, in the same order everywhere`,
        why: 'An ad-hoc manual schema change leaves no reliable record of what changed or when — a migration tool tracks every change as a versioned file, keeping every environment\'s schema state known and reproducible.',
        whyHi: 'Ek ad-hoc manual schema badlaav koi bharosemand record nahi chhodta ki kya badla ya kab — ek migration tool har badlaav ko ek versioned file ki tarah track karta hai, har environment ki schema sthiti jaani-pehchaani aur reproduce-hone-laayak rakhte hue.',
      },
      {
        wrong: `UPDATE users SET phone_number = '';
// one giant UPDATE touching all 8 million rows in a single transaction`,
        right: `// A loop updating 10,000 rows at a time, each its own short transaction
UPDATE users SET phone_number = '' WHERE id IN (SELECT id FROM users WHERE phone_number IS NULL LIMIT 10000);`,
        why: 'A single enormous UPDATE holds its lock for as long as the entire operation takes — batching the same total work into many short transactions keeps any single lock brief, letting other queries interleave between batches.',
        whyHi: 'Ek akela vishaal \`UPDATE\` apna lock utni der ke liye rakhta hai jitni poori operation leti hai — usi kul kaam ko kai chhoti transactions mein batching karna kisi bhi akele lock ko chhota rakhta hai, batches ke beech doosri queries ko guzarne dete hue.',
      },
    ],

    realWorld: [
      {
        en: '**A schema migration silently locking a production table is one of the most commonly cited causes of unexpected production outages during a routine deploy**, precisely because the migration itself passes every test locally without revealing the lock behavior that only appears at real data volume.',
        hi: '**Ek schema migration jo chupke se ek production table lock kar deti hai ek routine deploy ke dauraan anaay-koshit production outages ke sabse aam cite hone waale wajahon mein se ek hai**, theek isliye kyunki migration khud locally har test paas karti hai us lock vyavhaar ko zaahir kiye bina jo sirf asli data volume par dikhta hai.',
      },
      {
        en: '**PostgreSQL\'s own official documentation explicitly discusses which ALTER TABLE operations require a full table rewrite versus which are fast, metadata-only changes**, and this exact distinction is a standard, expected topic in production database operations guidance.',
        hi: '**PostgreSQL ki apni official documentation explicitly discuss karti hai ki kaunse \`ALTER TABLE\` operations ko ek poori table rewrite chahiye versus kaunse tez, sirf-metadata badlaav hain**, aur bilkul yehi farak production database operations guidance mein ek standard, ummeed ki jaane wali topic hai.',
      },
      {
        en: '**Prisma Migrate, along with equivalents in other ecosystems (Rails migrations, Django migrations, Flyway, Liquibase), is the standard, widely adopted approach to tracking schema changes as versioned files across essentially every serious backend framework.**',
        hi: '**Prisma Migrate, doosre ecosystems mein barabar tools ke saath (Rails migrations, Django migrations, Flyway, Liquibase), lagbhag har gambhir backend framework mein schema changes ko versioned files ki tarah track karne ka standard, vyapak taur par apnaaya gaya tarika hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why can the exact same ALTER TABLE command run almost instantly in development but take several minutes and lock the table in production, given that the SQL itself never changed?',
        qHi: 'Bilkul wahi \`ALTER TABLE\` command development mein lagbhag turant kyun chal sakta hai par production mein kai minute le sakta hai aur table lock kar sakta hai, jab ki SQL khud kabhi nahi badla?',
        a: 'Certain schema changes — specifically, adding a column with a default value, changing an existing column\'s data type, or adding certain kinds of constraints — require the database to physically rewrite every existing row in the table, not merely update metadata about the table\'s structure. The amount of work this rewrite requires is directly proportional to how many rows already exist in the table at the moment the migration runs. In a development database with a small number of test rows, this rewrite genuinely happens, but the total work involved is small enough to complete in an imperceptible fraction of a second, indistinguishable in practice from an instantaneous, metadata-only change. Against a production table holding millions of real rows, the exact same underlying operation — rewriting every row — now involves proportionally far more actual work, and completing it genuinely takes measurably longer, on the order of minutes rather than milliseconds. While this rewrite is in progress, most databases hold an exclusive lock on the table to maintain consistency, which means every other query attempting to read from or write to that table must wait for the migration to finish. The SQL command itself is identical in both cases — the difference in behavior comes entirely from the difference in how much data actually exists at the moment the command runs, not from anything about the command\'s text.',
        aHi: 'Kuch khaas schema changes — khaas taur par, ek default value wala column jodna, ek maujooda column ki data kism badalna, ya kuch kism ki constraints jodna — database ko table mein har maujooda row physically dobara likhne ki maang karte hain, sirf table ki sanrachna ke baare mein metadata update karna nahi. Is rewrite ke liye zaruri kaam ki tadaad us pal table mein pehle se maujood rows ki tadaad ke seedhe anupaat mein hai jab migration chalti hai. Thodi tadaad ki test rows wale ek development database mein, ye rewrite sach mein hota hai, par ismein shaamil kul kaam itna chhota hai ki ye ek second ke adrishya hisse mein poora ho jaata hai, practice mein ek turant, sirf-metadata badlaav se alag-nahi-pehchaani-jaane-laayak. Lakhon asli rows rakhte ek production table ke khilaaf, bilkul wahi underlying operation — har row dobara likhna — ab anupaat mein kaafi zyaada asli kaam shaamil karta hai, aur ise poora karna sach mein naapi jaa sakne laayak zyaada waqt leta hai, milliseconds ke bajaye minutes ke order mein. Jab tak ye rewrite chal raha hai, zyaadatar databases sangatta banaaye rakhne ke liye table par ek exclusive lock rakhte hain, matlab har doosri query jo us table se padhne ya likhne ki koshish karti hai use migration khatam hone ka intezaar karna chahiye. SQL command khud dono cases mein identical hai — vyavhaar mein farak poori tarah is farak se aata hai ki command chalte waqt asal mein kitna data maujood hai, command ke text ke baare mein kuch se nahi.',
      },
      {
        q: 'Why does splitting a NOT NULL column addition into three separate steps (add nullable, backfill in batches, add the constraint) avoid the table-locking problem the single-step version has?',
        qHi: 'Ek \`NOT NULL\` column addition ko teen alag steps mein baantna (nullable jodo, batches mein backfill karo, constraint jodo) ek-step wale version ki table-locking samasya se kyun bachta hai?',
        a: 'Adding a column with no default value and no NOT NULL constraint is typically a fast, metadata-only operation regardless of table size, because existing rows simply receive NULL for the new column — there is nothing to compute or write into each existing row, so no row-by-row rewrite is required at all. This is why step one completes quickly even on a table with millions of rows. The actual data-population work — giving every row a real, non-null value — is then performed separately, in step two, using many small UPDATE statements each touching only a limited number of rows (a few thousand at a time) rather than one single UPDATE touching every row in the table at once. Each of these smaller UPDATEs is its own separate, short-lived transaction, holding its lock only for the brief time that specific small batch takes to process, and releasing it before the next batch begins — this means any other query needing to access the table can proceed normally in the gaps between batches, rather than being forced to wait for one single operation spanning the entire table\'s row count. Only in step three, once every row already has a real value (confirmed before this step runs), does adding the actual NOT NULL constraint happen — and this final check is fast specifically because it only needs to verify that no NULL values remain, which the database can typically confirm quickly using existing information, without needing to rewrite any row\'s data at that point. The total amount of underlying work across all three steps is roughly the same as the single-step version, but it is distributed across many brief operations instead of concentrated into one operation that holds a lock for the entire duration.',
        aHi: 'Bina default value aur bina \`NOT NULL\` constraint ke ek column jodna aam taur par table size se bekhabar ek tez, sirf-metadata operation hai, kyunki maujooda rows ko naye column ke liye bas \`NULL\` milta hai — har maujooda row mein calculate ya likhne ke liye kuch nahi hai, isliye koi row-dar-row rewrite bilkul zaruri nahi. Bilkul isi wajah se pehla step lakhon rows wale ek table par bhi jaldi poora hota hai. Asli data-population kaam — har row ko ek asli, non-null value dena — phir alag se, doosre step mein, kai chhote \`UPDATE\` statements istemal karke kiya jaata hai har ek sirf simit tadaad ki rows chhuta hua (ek waqt mein kuch hazaar) ek akele \`UPDATE\` ke bajaye jo table ki har row ek saath chhuta. Inmein se har chhota \`UPDATE\` apni alag, chhoti transaction hai, apna lock sirf us khaas chhote batch ko process karne mein lagne wale thode waqt ke liye rakhte hue, aur agla batch shuru hone se pehle use release karte hue — iska matlab hai koi bhi doosri query jise table access karna chahiye batches ke beech ke gaps mein normal taur par aage badh sakti hai, poore table ki row count par phaili ek akeli operation ka intezaar karne majboor hone ke bajaye. Sirf teesre step mein, ek baar har row pehle se ek asli value rakhe (ye step chalne se pehle confirm kiya gaya), asli \`NOT NULL\` constraint jodna hota hai — aur ye aakhri check tez hai khaas taur par isliye kyunki ise sirf ye verify karna hai ki koi \`NULL\` values bachi nahi hain, jise database aam taur par jaldi confirm kar sakta hai maujooda jaankaari istemal karke, us point par kisi bhi row ka data dobara likhe bina. Teeno steps mein kul underlying kaam ki tadaad lagbhag ek-step version jitni hi hai, par ye kai chhoti operations mein baanti hui hai us ek operation mein concentrate hone ke bajaye jo poori avdhi ke liye ek lock rakhti hai.',
      },
      {
        q: 'Why is tracking schema changes through a migration tool (like Prisma Migrate) preferable to running ad-hoc SQL commands directly against each environment?',
        qHi: 'Schema changes ko ek migration tool (jaise Prisma Migrate) ke through track karna har environment ke khilaaf seedha ad-hoc SQL commands chalaane se behtar kyun hai?',
        a: 'Running schema changes as one-off manual SQL commands means there is no reliable, centralized record of exactly which changes have been applied to which environment, in what order, or by whom — a developer\'s local database, a teammate\'s local database, a staging environment, and production could each end up in subtly or significantly different schema states over time, with no straightforward way to know for certain, since the only evidence of what happened lives in whoever\'s memory or scattered notes, if anywhere at all. A migration tool addresses this by representing every schema change as its own explicit, timestamped file, checked into the same source control repository the application code itself lives in — this means the sequence of schema changes becomes something the whole team can review (in the same way code changes are reviewed), reproduce identically on any machine by simply running the same migration files in the same order, and reliably determine the exact current state of by checking which migrations have and have not yet been applied to a given environment. This directly parallels the reasoning behind this course\'s earlier Docker lesson: an ad-hoc, manually-performed process depends on someone correctly remembering and repeating every step exactly, in every environment, indefinitely, whereas an explicit, versioned, automatically-applied process removes that dependency on memory and manual repetition entirely, making the resulting state predictable and reproducible by design rather than by discipline alone.',
        aHi: 'Schema changes ko ek-baar wale manual SQL commands ki tarah chalaana matlab hai kisi bharosemand, kendriya record ka na hona ki bilkul kaunse badlaav kis environment mein lagu hue hain, kis kram mein, ya kiski taraf se — ek developer ka local database, ek teammate ka local database, ek staging environment, aur production har ek waqt ke saath subtly ya kaafi alag schema sthitiyon mein khatam ho sakte hain, ye pakka jaanne ka koi seedha tarika bina, kyunki kya hua uska aikela saboot jiski bhi yaad ya bikhri notes mein rehta hai, agar kahin hai bhi. Ek migration tool ise sambhaalta hai har schema badlaav ko apni explicit, timestamped file ki tarah darzhaakar, wahi source control repository mein check-in ki hui jismein application code khud rehta hai — iska matlab hai schema changes ka sequence kuch aisa ban jaata hai jise poori team review kar sakti hai (usi tarike se jaise code changes review hote hain), kisi bhi machine par identical taur par bilkul wahi migration files bilkul wahi kram mein chalaakar reproduce kar sakti hai, aur bharosemand taur par ek diye environment tak yeh check karke tay kar sakti hai ki kaunsi migrations abhi tak lagu hui hain aur kaunsi nahi. Ye seedha is course ke pehle wale Docker lesson ke peeche ki soch ko darzhaata hai: ek ad-hoc, manually-kiya process kisi ke sahi tarike se yaad rakhne aur har step ko bilkul dohraane par nirbhar karta hai, har environment mein, hamesha — jabki ek explicit, versioned, apne-aap-lagu-hone-wala process yaad aur manual dohraaav par wo nirbharta poori tarah hataata hai, nateeja sthiti ko design se anumaanit aur reproduce-hone-laayak banaate hue, akele anushasan se nahi.',
      },
    ],

    exercises: [
      {
        task: 'Seed a users table with a few hundred thousand rows. Run ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT \'\' and time exactly how long it takes.',
        taskHi: 'Ek users table seed karo kuch lakh rows ke saath. \`ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT \'\'\` chalaao aur bilkul napo isme kitna waqt lagta hai.',
        hint: 'While this migration is running, try sending a query to the same table from a second connection and observe it hang until the migration completes.',
        hintHi: 'Jab ye migration chal rahi ho, ek doosre connection se usi table ko ek query bhejne ki koshish karo aur dekho ye migration poora hone tak latak jaati hai.',
      },
      {
        task: 'Undo that column, then perform the same end result using the three-step approach (add nullable, backfill in batches, add the constraint). Confirm the same second-connection query no longer hangs during the process.',
        taskHi: 'Us column ko undo karo, phir teen-step tarike se wahi aakhri nateeja poora karo (nullable jodo, batches mein backfill karo, constraint jodo). Confirm karo wahi doosri-connection query ab process ke dauraan latakti nahi.',
        hint: 'Run the backfill script and the second connection\'s query at the same time to directly observe the second query succeeding immediately, unlike in the broken version.',
        hintHi: 'Backfill script aur doosri connection ki query ek saath chalaao seedha dekhne ke liye ki doosri query turant safal hoti hai, toote version ke ulta.',
      },
      {
        task: 'Set up Prisma Migrate on a small project and create a migration for this same schema change. Confirm running npx prisma migrate deploy a second time (with no new changes) correctly does nothing, rather than re-applying anything.',
        taskHi: 'Ek chhote project par Prisma Migrate set up karo aur is bilkul schema badlaav ke liye ek migration banao. Confirm karo \`npx prisma migrate deploy\` ko doosri baar chalaana (koi naya badlaav bina) sahi tarike se kuch nahi karta, kuch bhi dobara-lagu karne ke bajaye.',
        hint: 'Inspect the generated migration.sql file directly to see exactly what SQL Prisma decided to run for the schema change you described.',
        hintHi: 'Banaayi gayi \`migration.sql\` file ko seedha dekho bilkul dekhne ke liye ki tumne describe kiya schema badlaav ke liye Prisma ne kya SQL chalaane ka faisla kiya.',
      },
    ],

    keyTakeaways: [
      'A schema change can be either fast and metadata-only, or require rewriting every existing row — the second kind\'s cost scales directly with table size, invisible in development and severe at production scale.',
      'Adding a column WITH a default value (or changing an existing column\'s type) typically requires a full table rewrite; adding one with no default is typically fast regardless of table size.',
      'Splitting a risky schema change into steps (add nullable, backfill in small batches, then add the constraint) spreads the same total work across many brief locks instead of one long one, keeping the application responsive throughout.',
      'A migration tool (Prisma Migrate and equivalents) tracks every schema change as a versioned file checked into source control, applied identically and in the same order in every environment.',
      'CREATE INDEX CONCURRENTLY builds a new index on a large table without holding the same blocking lock a plain CREATE INDEX would, following the same avoid-long-locks principle as batched backfilling.',
      'A production-safe migration should have a known, working reverse ("down") operation, thought through in advance rather than improvised during an actual incident requiring a rollback.',
    ],
    keyTakeawaysHi: [
      'Ek schema badlaav ya to tez aur sirf-metadata ho sakta hai, ya har maujooda row dobara likhne ki maang kar sakta hai — doosri kism ki keemat seedhe taur par table size ke saath scale karti hai, development mein adrishya aur production scale par gambhir.',
      'Ek default value ke SAATH ek column jodna (ya ek maujooda column ki kism badalna) aam taur par ek poori table rewrite ki maang karta hai; bina default ke ek jodna aam taur par table size se bekhabar tez hota hai.',
      'Ek khatarnaak schema badlaav ko steps mein baantna (nullable jodo, chhote batches mein backfill karo, phir constraint jodo) wahi kul kaam ko kai chhoti locks mein phailaata hai ek lambi ke bajaye, application ko poori der responsive rakhte hue.',
      'Ek migration tool (Prisma Migrate aur barabar) har schema badlaav ko source control mein check-in ki ek versioned file ki tarah track karta hai, har environment mein identical taur par aur usi kram mein lagu hua.',
      '\`CREATE INDEX CONCURRENTLY\` ek bade table par ek naya index banaata hai wahi blocking lock rakhe bina jo ek saadha \`CREATE INDEX\` rakhega, batched backfilling ke usi lambi-locks-se-bacho principle ka palan karte hue.',
      'Ek production-safe migration ke paas ek jaani-pehchaani, kaam karti reverse ("down") operation honi chahiye, pehle se soch li hui ek asli incident ke dauraan improvise karne ke bajaye jise rollback chahiye.',
    ],
  },
];
