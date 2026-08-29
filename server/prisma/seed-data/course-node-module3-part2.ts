/**
 * Node.js Complete Course — Module 3: Data & Persistence, lesson 2.
 *
 * SQL injection: why building queries via string concatenation is
 * dangerous, and why parameterized queries are the actual fix, not merely a
 * style preference. The broken example is a login route built with template-
 * literal string concatenation, vulnerable to the classic
 * ' OR '1'='1' -- authentication-bypass payload — demonstrated as a real,
 * reproducible attack, not a hypothetical. Fixed with parameterized queries
 * (introduced in the previous lesson, now explained at the mechanism level:
 * WHY the fix works, not just that it does).
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

export const NODE_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'sql-injection-prevention',
    title: 'SQL Injection: Why String Concatenation in Queries Is Dangerous',
    titleHi: 'SQL Injection: Queries Mein String Concatenation Kyun Khatarnaak Hai',
    description: 'Typing a password of exactly `\' OR \'1\'=\'1` into a login form — and logging in as literally any user in the database, no password required.',
    descriptionHi: 'Login form mein bilkul `\' OR \'1\'=\'1` password type karna — aur database mein literally kisi bhi user ki tarah login ho jaana, koi password zaruri nahi.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A librarian who reads a request card aloud exactly as written, versus one who fills in a form where only the blanks can ever be trusted as data.** Building a SQL query by directly inserting a user\'s raw input into a string is like a librarian who, instead of using a structured request form, simply reads aloud whatever is written on a card a stranger hands them, treating the ENTIRE card as a spoken instruction — if the stranger writes "Fetch book number 42," the librarian fetches book 42, which seems to work fine. But if the stranger instead writes "Fetch book number 42; also, while you\'re back there, hand over every book in the archive and burn the checkout records," the librarian, having no way to distinguish "data the requester provided" from "instructions to follow," reads and obeys the entire thing verbatim — the malicious continuation was never meant as data, but because it was simply concatenated into the same spoken instruction with no boundary between the two, the librarian cannot tell them apart. A librarian using a proper form instead — one with a single blank clearly labeled "book number," filled in with whatever the requester wrote — never reads what goes in that blank AS an instruction at all, no matter what is written there; "42; also hand over every book" would just be treated as a (nonsensical, harmless) book number to look up, not as additional commands to follow, because the form\'s own structure keeps "the instruction" and "the data filled into it" as two separate, uncombinable things.',
      hi: '**Ek librarian jo ek request card ko bilkul jaisa likha hai waisa hi zor se padhta hai, versus ek jo ek form bharta hai jismein sirf khaali jagahon ko hi kabhi data ki tarah bharosa kiya ja sakta hai.** Ek user ke raw input ko seedha ek string mein daalkar SQL query banaana aisa hai jaise ek librarian, ek structured request form use karne ke bajaye, bas jo bhi ek ajnabi unhe ek card par likha thamaata hai use zor se padh de, POORE card ko ek boli hui hidaayat ki tarah treat karte hue — agar ajnabi likhta hai "Book number 42 laao," librarian book 42 laata hai, jo theek kaam karta lagta hai. Par agar ajnabi iske bajaye likhta hai "Book number 42 laao; aur, jab tak tum wahan ho, archive ki har book de do aur checkout records jala do," librarian, jiske paas "requester ne diya data" ko "follow karne ki hidaayaton" se alag karne ka koi tarika nahi, poori cheez ko bilkul waisa hi padhta aur maanta hai — nuksaandayak continuation kabhi data ki tarah maana hi nahi tha, par kyunki wo bas usi boli hui hidaayat mein jod diya gaya bina dono ke beech koi seema ke, librarian unhe alag nahi kar sakta. Ek librarian jo iske bajaye ek theek form use karta hai — ek jismein ek akeli khaali jagah saaf "book number" ki tarah labeled hai, jo bhi requester ne likha use bhara hua — kabhi us khaali jagah mein jo aata hai use ek hidaayat ki tarah bilkul nahi padhta, chahe wahan kuch bhi likha ho; "42; aur har book de do" bas ek (bemaani, harmless) book number ki tarah treat hoga dhoondhne ke liye, follow karne ki additional commands ki tarah nahi, kyunki form ki apni sanrachna "hidaayat" aur "usme bhari data" ko do alag, na-milaaye ja sakne wali cheezein rakhti hai.',
    },

    simple: `**Start broken.** A login route building its SQL query by directly concatenating user input into a string:

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Send a completely ordinary login attempt — a real email, the correct password — and it works exactly as expected. Now send this instead: leave \`email\` as any known user\'s email, but for \`password\`, send the literal string \`' OR '1'='1\`. The query that Node.js actually sends to the database, after the template literal substitutes in that exact string, becomes:

\`\`\`sql
SELECT * FROM users WHERE email = 'victim@example.com' AND password = '' OR '1'='1'
\`\`\`

This is now a completely different, and completely valid, SQL query — not a typo, not a crash, a query the database happily executes exactly as written. \`password = ''\` is very likely false (the real password is not an empty string), but \`OR '1'='1'\` is a condition that is ALWAYS true, for every single row in the entire \`users\` table, regardless of the \`email\` or \`password\` columns\' actual values — SQL evaluates \`WHERE\` conditions with normal boolean logic, and \`(false) OR (always true)\` is always true. The query effectively becomes "return every user where email matches OR just always return them anyway," and \`result.rows.length === 0\` is false, so the login succeeds — as the actual victim, with zero knowledge of their real password. The user\'s raw input was never meant to be part of the SQL query\'s STRUCTURE at all — it was meant to be plain data, a value to compare against — but because it was directly concatenated into the query string with no boundary between "instruction" and "data," the database has no way to tell the difference, and simply executes whatever the final combined string says.

**The fix: parameterized queries, where user input can never become part of the query\'s structure**

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

The query STRING itself — \`"SELECT * FROM users WHERE email = $1 AND password = $2"\` — is fixed, written once by the developer, and never has any user input inserted into it at all. \`$1\` and \`$2\` are placeholders; the actual values (\`email\`, \`password\`) are sent to the database SEPARATELY, as a distinct array argument, not woven into the query text itself. The database driver and the database server communicate using a protocol specifically designed around this separation: the query\'s STRUCTURE (what columns, what conditions, what logic) is transmitted and parsed first, completely fixed and known in advance, and only afterward are the actual parameter VALUES substituted in — as pure data, always, no matter what characters they contain. Sending \`' OR '1'='1\` as the \`password\` parameter now means the database looks for a row whose password column literally equals the fourteen-character string \`' OR '1'='1\` — a password nobody actually has — because the parameter is never re-interpreted as part of the query\'s logic. The attack payload is not neutralized by cleverly detecting and blocking dangerous-looking characters; it is structurally impossible for it to work at all, since user input is never in a position where it COULD become part of the query\'s own structure.`,

    simpleHi: `**Toote hue se shuru.** Ek login route jo apni SQL query user input ko seedha ek string mein jodkar banaata hai:

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek poori tarah aam login koshish bhejo — ek asli email, sahi password — aur ye bilkul ummeed ke hisaab se kaam karta hai. Ab iske bajaye ye bhejo: \`email\` ko kisi jaane-pehchaane user ki email rehne do, par \`password\` ke liye, literal string \`' OR '1'='1\` bhejo. Wo query jo Node.js asal mein database ko bhejta hai, template literal us bilkul string ko substitute karne ke baad, ban jaati hai:

\`\`\`sql
SELECT * FROM users WHERE email = 'victim@example.com' AND password = '' OR '1'='1'
\`\`\`

Ye ab ek poori tarah alag, aur poori tarah valid, SQL query hai — koi typo nahi, koi crash nahi, ek query jise database khushi-khushi bilkul jaisi likhi hai waisi chalata hai. \`password = ''\` bahut sambhaavit taur par false hai (asli password khaali string nahi hai), par \`OR '1'='1'\` ek condition hai jo HAMESHA sach hai, poore \`users\` table ki har akeli row ke liye, \`email\` ya \`password\` columns ki asli values se bekhabar — SQL \`WHERE\` conditions ko normal boolean logic se evaluate karta hai, aur \`(false) OR (hamesha sach)\` hamesha sach hai. Query asar mein "har user lautaao jahan email milta hai YA bas hamesha unhe waise hi lautaao" ban jaati hai, aur \`result.rows.length === 0\` false hai, isliye login safal hota hai — asli victim ki tarah, unke asli password ki zero jaankaari ke saath. User ka raw input SQL query ki SANRACHNA ka hissa bilkul kabhi nahi hona chahiye tha — ye saadha data hona chahiye tha, compare karne ke liye ek value — par chunki ye seedha query string mein jodi gayi thi "hidaayat" aur "data" ke beech koi seema ke bina, database ke paas fark batane ka koi tarika nahi, aur ye bas jo bhi aakhri milaayi hui string kehti hai wo chalata hai.

**Fix: parameterized queries, jahan user input kabhi query ki sanrachna ka hissa nahi ban sakta**

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Query STRING khud — \`"SELECT * FROM users WHERE email = $1 AND password = $2"\` — fixed hai, developer dwara ek baar likhi gayi, aur usme kabhi koi user input daala hi nahi jaata. \`$1\` aur \`$2\` placeholders hain; asli values (\`email\`, \`password\`) database ko ALAG SE bheji jaati hain, ek alag array argument ki tarah, query text mein bunni nahi jaati. Database driver aur database server ek protocol use karke baat karte hain jo khaas taur par is alag-karne ke aas-paas design kiya gaya hai: query ki SANRACHNA (kaunse columns, kaunsi conditions, kaunsi logic) pehle transmit aur parse hoti hai, poori tarah fixed aur pehle se jaani, aur sirf uske baad asli parameter VALUES andar substitute hoti hain — hamesha poore data ki tarah, chahe unme koi bhi characters hon. \`' OR '1'='1\` ko \`password\` parameter ki tarah bhejna ab matlab hai database ek aisi row dhoondhta hai jiska password column literally chaudah-akshar wali string \`' OR '1'='1\` ke barabar ho — ek password jo kisi ke paas asal mein hai hi nahi — kyunki parameter ko kabhi query ki logic ke hisse ki tarah dobara-interpret nahi kiya jaata. Attack payload ko khatarnaak-dikhte characters chatur tarike se pakadkar aur rokakar khatam nahi kiya jaata; ye structurally namumkin hai ki wo bilkul kaam kare, kyunki user input kabhi aisi sthiti mein hai hi nahi jahan wo query ki apni sanrachna ka hissa BAN SAKE.`,

    content: `## Why "sanitizing" or "escaping" special characters is a weaker, incomplete fix

\`\`\`js
// A tempting but fundamentally incomplete approach: manually escaping single quotes
const safeEmail = email.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE email = '\${safeEmail}'\`;
\`\`\`

A common first instinct is to try to "clean" user input before concatenating it — escaping characters that have special meaning in SQL (like turning a single quote \`'\` into \`''\`, SQL\'s own escaped-quote syntax), attempting to prevent input from breaking out of its intended string context. This approach is genuinely fragile: it requires the developer to correctly anticipate and handle every character or pattern with special meaning across every database engine\'s specific SQL dialect (different databases have different escaping rules and edge cases), for every single place user input might be concatenated into a query, forever, without ever making a mistake — a single missed case, an unusual encoding, or a database-specific quirk the developer did not know about is enough to reopen the exact same vulnerability. Parameterized queries do not have this fragility because they do not rely on correctly anticipating and neutralizing dangerous characters at all — the separation between query structure and data is enforced by the database protocol itself, not by pattern-matching against known attack patterns.

## SQL injection is not limited to logins: any concatenated user input is at risk

\`\`\`js
// Also vulnerable — a search feature, not a login form
app.get("/search", async (req, res, next) => {
  const { q } = req.query;
  const result = await pool.query(\`SELECT * FROM products WHERE name LIKE '%\${q}'\`);
  res.json(result.rows);
});
// A malicious "q" like: %'; DROP TABLE products; --
// produces: SELECT * FROM products WHERE name LIKE '%%'; DROP TABLE products; --'
\`\`\`

The login-bypass example is the most commonly cited illustration specifically because it demonstrates a clear, memorable consequence (unauthorized access), but the underlying vulnerability applies to ANY route that concatenates user-controlled input into a SQL string — a search box, a filter parameter, a URL query parameter, a route parameter, anything a client controls. Depending on the specific database and how it handles multiple statements in one query, a sufficiently crafted input can, in the worst case, delete or modify data entirely unrelated to what the vulnerable route was ever meant to do — \`DROP TABLE\` is the canonical, maximally destructive example, but reading unrelated data, modifying other users\' records, or bypassing application-level authorization checks entirely are all realistic outcomes of the same underlying flaw.

## Parameterized queries with an ORM: the same principle, different syntax

\`\`\`js
// Raw SQL with pg — parameterized
await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// Prisma (an ORM) — parameterizes automatically, even though it looks like a plain function call
await prisma.user.findFirst({ where: { email } });

// Prisma's own raw-query escape hatch — STILL needs explicit parameterization
await prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`;   // Prisma's tagged template DOES parameterize this safely
\`\`\`

An ORM (Object-Relational Mapper, like Prisma, covered in more depth in this course\'s later data-modeling content) generally protects against SQL injection automatically for its own standard query methods (\`.findFirst\`, \`.create\`, and similar) — the ORM itself constructs parameterized queries behind the scenes, so a developer using its normal API rarely needs to think about this explicitly. The risk resurfaces specifically when an ORM offers an escape hatch for writing raw SQL directly (for a query too complex or unusual for the ORM\'s standard API to express) — some raw-query escape hatches parameterize safely by design (Prisma\'s own tagged-template \`$queryRaw\`, shown correctly used above), while others accept a plain string that must be manually parameterized exactly as covered in this lesson, reintroducing the exact same risk if a developer concatenates user input into it directly instead.

## TypeScript: this vulnerability is entirely outside what the type system checks

\`\`\`ts
const query: string = \`SELECT * FROM users WHERE email = '\${email}'\`;   // a perfectly valid string
await pool.query(query);   // a perfectly valid function call
\`\`\`

Every part of the vulnerable code above is completely valid, correctly-typed TypeScript — \`email\` is a \`string\`, template literal interpolation into a string produces a \`string\`, and \`pool.query\` genuinely accepts a \`string\` as its first argument. TypeScript\'s type system verifies the SHAPE of values (is this a string, is this a number) — it has no concept of, and cannot verify, the SEMANTIC safety of how a string is subsequently used, such as whether a particular string happens to be a SQL query built in a way that is safe or unsafe against injection. This is a genuinely important limitation to internalize: type safety and security are different concerns, and a codebase can be perfectly type-safe while remaining seriously vulnerable — preventing SQL injection is a discipline of always using parameterized queries, not something TypeScript\'s compiler can catch or enforce on its own.`,

    contentHi: `## Khaas characters ko "saaf karna" ya "escape karna" ek kamzor, adhoora fix kyun hai

\`\`\`js
// Ek lubhaawana par buniyaadi taur par adhoora tarika: haath se single quotes escape karna
const safeEmail = email.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE email = '\${safeEmail}'\`;
\`\`\`

Ek aam pehli soch user input ko concatenate karne se pehle "saaf" karne ki koshish karna hai — SQL mein khaas matlab rakhte characters ko escape karna (jaise ek single quote \`'\` ko \`''\` mein badalna, SQL ka apna escaped-quote syntax), input ko apne maane hue string context se bahar nikalne se rokne ki koshish karte hue. Ye tarika sach mein nazuk hai: isse developer ko har database engine ke khaas SQL dialect mein khaas matlab rakhte har character ya pattern ko sahi tarike se pehchaanna aur sambhaalna zaruri hai (alag-alag databases ke escaping rules aur edge cases alag hote hain), har akeli jagah ke liye jahan user input query mein joda ja sakta hai, hamesha ke liye, kabhi galti kiye bina — ek chhoota case, ek anokha encoding, ya ek database-khaas ajeebiyat jo developer nahi jaanta tha bilkul wahi vulnerability dobara khol dene ke liye kaafi hai. Parameterized queries mein ye nazukta nahi hai kyunki wo khatarnaak characters ko sahi tarike se pehchaanne aur bekaar-asar-wala karne par bilkul bharosa nahi karte — query sanrachna aur data ke beech alag karna database protocol khud lagu karta hai, jaani-pehchaani attack patterns se milaan karke nahi.

## SQL injection sirf logins tak seemit nahi hai: koi bhi concatenated user input khatre mein hai

\`\`\`js
// Ye bhi vulnerable — ek search feature, koi login form nahi
app.get("/search", async (req, res, next) => {
  const { q } = req.query;
  const result = await pool.query(\`SELECT * FROM products WHERE name LIKE '%\${q}'\`);
  res.json(result.rows);
});
// Ek nuksaandayak "q" jaisa: %'; DROP TABLE products; --
// paida karta hai: SELECT * FROM products WHERE name LIKE '%%'; DROP TABLE products; --'
\`\`\`

Login-bypass example sabse aksar udaharan ki tarah cite hoti hai khaas taur par isliye kyunki ye ek saaf, yaad rehne laayak nateeja dikhaati hai (anadhikrit access), par underlying vulnerability KISI BHI aise route par lagu hoti hai jo user-controlled input ko ek SQL string mein jodta hai — ek search box, ek filter parameter, ek URL query parameter, ek route parameter, kuch bhi jo client control karta hai. Khaas database aur wo ek query mein kai statements kaise sambhaalta hai uske hisaab se, ek kaafi sochi-samjhi input, sabse bure case mein, us data ko poori tarah hata ya badal sakti hai jo vulnerable route kabhi karne ke liye thi hi nahi — \`DROP TABLE\` canonical, sabse zyada nuksaandayak udaharan hai, par na-judi data padhna, doosre users ke records badalna, ya application-level authorization checks poori tarah bypass karna sab isi underlying kami ke haqeeqi nateeje hain.

## Ek ORM ke saath parameterized queries: wahi principle, alag syntax

\`\`\`js
// pg ke saath raw SQL — parameterized
await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// Prisma (ek ORM) — apne aap parameterize karta hai, chahe ye ek saadhe function call jaisa dikhe
await prisma.user.findFirst({ where: { email } });

// Prisma ka apna raw-query escape hatch — ABHI BHI explicit parameterization chahiye
await prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`;   // Prisma ka tagged template ISE surakshit tarike se parameterize karta HAI
\`\`\`

Ek ORM (Object-Relational Mapper, jaise Prisma, is course ke baad wale data-modeling content mein zyada gehraayi se cover hoga) aam taur par apne standard query methods (\`.findFirst\`, \`.create\`, aur waise hi) ke liye apne aap SQL injection se bachaata hai — ORM khud peeche parameterized queries banaata hai, isliye ek developer jo uski normal API use karta hai use ye explicitly sochne ki shaayad hi zarurat pade. Khatra khaas taur par tab wapas dikhta hai jab ek ORM raw SQL seedha likhne ke liye ek escape hatch deta hai (ek query ke liye jo ORM ki standard API ke darzha karne ke liye bahut complex ya anokhi hai) — kuch raw-query escape hatches design se surakshit tarike se parameterize karte hain (Prisma ka apna tagged-template \`$queryRaw\`, upar sahi tarike se use hua dikhaaya gaya), jabki doosre ek saadhi string accept karte hain jise haath se bilkul is lesson mein cover hue tarike se parameterize karna chahiye, wahi khatra dobara laate hue agar developer iske bajaye seedha usmein user input jodta hai.

## TypeScript: ye vulnerability poori tarah us se bahar hai jo type system check karta hai

\`\`\`ts
const query: string = \`SELECT * FROM users WHERE email = '\${email}'\`;   // ek bilkul valid string
await pool.query(query);   // ek bilkul valid function call
\`\`\`

Upar wale vulnerable code ka har hissa poori tarah valid, sahi-typed TypeScript hai — \`email\` ek \`string\` hai, string mein template literal interpolation ek \`string\` paida karta hai, aur \`pool.query\` sach mein apne pehle argument ki tarah ek \`string\` accept karta hai. TypeScript ka type system values ki SHAPE verify karta hai (kya ye ek string hai, kya ye ek number hai) — iske paas is baat ka koi concept nahi hai, aur ye verify nahi kar sakta, ki ek string ka baad mein istemal SEMANTICALLY surakshit hai ya nahi, jaise kya koi khaas string ek SQL query hai jo injection ke khilaaf surakshit ya asurakshit tarike se banaayi gayi hai. Ye ek sach mein zaruri seema hai jise samajhna chahiye: type safety aur security alag chintaayen hain, aur ek codebase poori tarah type-safe ho sakta hai jabki gambhir taur par vulnerable rehta hai — SQL injection rokna hamesha parameterized queries use karne ka anushasan hai, koi aisi cheez nahi jise TypeScript ka compiler khud pakad ya lagu kar sake.`,

    examples: [
      {
        title: 'Broken: string concatenation allows authentication bypass',
        titleHi: 'Toota: string concatenation authentication bypass allow karta hai',
        code: `const result = await pool.query(
  \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
);
// password = "' OR '1'='1" bypasses the check entirely`,
        codeJs: `app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
// email: "victim@example.com", password: "' OR '1'='1"
// -> actual query: ...WHERE email = 'victim@example.com' AND password = '' OR '1'='1'
// -> logs in as victim@example.com with no real password knowledge`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
// TypeScript does not catch this — every value is correctly typed as
// a string. This is a security vulnerability, entirely outside what
// the type system checks.`,
        output: `A completely normal login (real email, real password) works correctly.
Sending password = "' OR '1'='1" for ANY known email logs in
successfully AS that user, without knowing their actual password —
reproducible, not hypothetical.`,
        explain: 'The attacker needs no special tools or database access — this works from an ordinary login form, using only a specifically crafted piece of text typed into the password field exactly like any other password attempt.',
        explainHi: 'Attacker ko koi khaas tools ya database access nahi chahiye — ye ek aam login form se kaam karta hai, sirf ek khaas taur par socha hua text istemal karte hue jo password field mein type kiya jaata hai bilkul kisi bhi doosri password koshish jaisa.',
      },
      {
        title: 'Fixed: parameterized queries make the payload harmless data',
        titleHi: 'Theek: parameterized queries payload ko bekaar-asar-wala data banaate hain',
        code: `const result = await pool.query(
  "SELECT * FROM users WHERE email = $1 AND password = $2",
  [email, password]
);`,
        codeJs: `app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});
// Same malicious password "' OR '1'='1" now searches for a password
// column literally equal to that 14-character string — no such user
// exists, login correctly fails.`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The exact same "' OR '1'='1" input, sent as the password parameter,
now correctly results in 401 Unauthorized — the database looked for a
row where password literally equals that string, found none, and the
login attempt correctly fails.`,
        outputTs: `// Identical behaviour. The fix required no new types, no additional
// validation library, and no character-escaping logic — only changing
// HOW the query and its values are sent to pool.query.`,
        explain: 'The malicious input is not rejected, filtered, or specially detected — it is simply treated as an ordinary, if incorrect, password value, exactly the same way a real user\'s honestly mistyped password would be.',
        explainHi: 'Nuksaandayak input ko reject, filter, ya khaas taur par pakda nahi jaata — use bas ek aam, chahe galat hi sahi, password value ki tarah treat kiya jaata hai, bilkul wahi tarike se jaise ek asli user ka imaandaari se galat type kiya password hota.',
      },
      {
        title: 'The vulnerability is not limited to login forms',
        titleHi: 'Vulnerability login forms tak seemit nahi hai',
        code: `const result = await pool.query(\`SELECT * FROM products WHERE name LIKE '%\${q}'\`);
// a malicious "q" can affect data far beyond what /search was meant to touch`,
        codeJs: `// Broken: same pattern, a completely different route
app.get("/search", async (req, res, next) => {
  const { q } = req.query;
  try {
    const result = await pool.query(\`SELECT * FROM products WHERE name LIKE '%\${q}'\`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Fixed: identical principle as the login route
app.get("/search", async (req, res, next) => {
  const { q } = req.query;
  try {
    const result = await pool.query("SELECT * FROM products WHERE name LIKE $1", [\`%\${q}\`]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { q } = req.query;
  try {
    const result = await pool.query("SELECT * FROM products WHERE name LIKE $1", [\`%\${q}\`]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// The "%" wildcard is safely built into the parameter VALUE here
// (\`%\${q}\`), not into the query STRUCTURE — this remains safe because
// the entire resulting string is still passed as one parameter, never
// re-interpreted as SQL syntax.`,
        outputJs: `A search route, which has nothing to do with authentication, is
equally vulnerable in its concatenated form and equally protected once
parameterized — the underlying flaw and fix are identical regardless
of which specific route or feature the concatenation happens in.`,
        outputTs: `// Identical behaviour. Note that even the wildcard "%" is safely
// included as PART OF the parameter's data value — it is still just
// data being compared against, not something re-parsed as query
// syntax.`,
        explain: 'This example is included specifically to correct the common misconception that SQL injection is "a login thing" — the vulnerability is about HOW a query string is built, completely independent of what the route is conceptually for.',
        explainHi: 'Ye example khaas taur par is aam galatfehmi ko theek karne ke liye shaamil hai ki SQL injection "login wali cheez" hai — vulnerability is baare mein hai ki query string KAISE banti hai, route concept mein kis liye hai us se poori tarah bekhabar.',
      },
    ],

    mistakes: [
      {
        wrong: `const result = await pool.query(
  \`SELECT * FROM users WHERE email = '\${email}'\`
);
// user input directly concatenated into the query string`,
        right: `const result = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
// user input passed as a separate parameter, never part of the query string`,
        why: 'Directly concatenating user input into a SQL query string lets that input become part of the query\'s own structure, not just its data — a crafted input can genuinely change what the query does, up to and including bypassing authentication or destroying data.',
        whyHi: 'User input ko seedha ek SQL query string mein jodna us input ko query ki apni sanrachna ka hissa ban ne deta hai, sirf uska data nahi — ek socha hua input sach mein badal sakta hai query kya karti hai, authentication bypass karne ya data nasht karne tak.',
      },
      {
        wrong: `const safeInput = userInput.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE name = '\${safeInput}'\`;
// manually escaping quotes — fragile, easy to miss an edge case`,
        right: `await pool.query("SELECT * FROM users WHERE name = $1", [userInput]);
// parameterized — structurally safe, no escaping logic to get wrong`,
        why: 'Manual character escaping requires correctly anticipating every special character and edge case across a database\'s specific SQL dialect, forever, without ever making a mistake — parameterized queries do not rely on correctly anticipating anything, since the database protocol itself enforces the structure/data separation.',
        whyHi: 'Manual character escaping ke liye zaruri hai ek database ke khaas SQL dialect mein har khaas character aur edge case ko sahi tarike se pehchaanna, hamesha ke liye, kabhi galti kiye bina — parameterized queries kuch bhi sahi tarike se pehchaanne par bharosa nahi karte, kyunki database protocol khud sanrachna/data ka alag hona lagu karta hai.',
      },
      {
        wrong: `await prisma.$queryRawUnsafe(\`SELECT * FROM users WHERE email = '\${email}'\`);
// "Unsafe" in the method name is a real, explicit warning — string concatenation here is just as vulnerable`,
        right: `await prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`;
// Prisma's tagged template literal parameterizes this safely, despite looking similar`,
        why: 'An ORM\'s raw-query escape hatch is not automatically safe just because it belongs to a generally-safe ORM — some raw-query methods (like Prisma\'s $queryRawUnsafe, whose name says so directly) accept a plain string requiring the same manual parameterization discipline as raw SQL.',
        whyHi: 'Ek ORM ka raw-query escape hatch apne aap surakshit nahi hai sirf isliye kyunki ye aam taur par surakshit ORM ka hissa hai — kuch raw-query methods (jaise Prisma ka \`$queryRawUnsafe\`, jiska naam seedha ye kehta hai) ek saadhi string accept karte hain jise raw SQL jaisi hi manual parameterization anushasan chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**SQL injection has been listed in the OWASP Top 10 (the most widely referenced web application security risk list) for essentially its entire history**, and remains, decades after being first identified, one of the most commonly exploited real vulnerabilities in production web applications — a well-understood problem that continues to occur specifically because the fix (always parameterize) is a discipline, not a one-time patch.',
        hi: '**SQL injection lagbhag apni poori history mein OWASP Top 10 (sabse badi taur par reference ki jaane wali web application security risk list) mein list hui hai**, aur, pehli baar pehchaane jaane ke dashakon baad bhi, production web applications mein sabse aksar exploit hui asli vulnerabilities mein se ek bani hui hai — ek achhi tarah samjhi hui samasya jo khaas taur par isliye hoti rehti hai kyunki fix (hamesha parameterize karo) ek anushasan hai, ek-baar wala patch nahi.',
      },
      {
        en: '**Real, publicly documented data breaches — including some of the largest on record — have been directly caused by SQL injection vulnerabilities in production applications**, making this specifically not a theoretical or academic-only concern, but one with genuine, demonstrated financial and reputational consequences.',
        hi: '**Asli, saarvajanik roop se documented data breaches — record par kuch sabse badon sameet — production applications mein SQL injection vulnerabilities se seedha hue hain**, ise khaas taur par koi kalpaniya ya sirf-academic chinta nahi banaate, balki ek jiske asli, dikhaaye gaye financial aur reputational nateeje hain.',
      },
      {
        en: '**Every mainstream database driver and ORM in the Node.js ecosystem (pg, mysql2, Prisma, TypeORM, Sequelize) supports parameterized queries as its standard, default way of accepting values** — the vulnerable, concatenated pattern this lesson demonstrated requires actively working around this default, not merely failing to opt into a special feature.',
        hi: '**Node.js ecosystem ka har mukhyadhaara database driver aur ORM (pg, mysql2, Prisma, TypeORM, Sequelize) parameterized queries ko values accept karne ke apne standard, default tarike ki tarah support karta hai** — is lesson ne dikhaaya vulnerable, concatenated pattern is default ke aas-paas sakriya taur par kaam karna maangta hai, sirf ek khaas feature opt-in karne mein na-safal hona nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does sending "\' OR \'1\'=\'1" as a password value bypass authentication in a query built by string concatenation, but not in a parameterized query?',
        qHi: '\'"\' OR \'1\'=\'1"\' ko ek password value ki tarah bhejna string concatenation se bani query mein authentication bypass kyun karta hai, par ek parameterized query mein nahi?',
        a: 'In a query built by string concatenation, the value of the password variable is inserted directly into the SQL text before that text is sent to the database — the database has no way to know which parts of the final string were "originally" a fixed part of the query and which parts came from user input; it simply receives and parses one complete SQL statement. When the concatenated password value happens to contain SQL syntax of its own (a closing quote, followed by "OR \'1\'=\'1\'"), that syntax is interpreted by the database as genuine, additional SQL logic, not as a literal password value to compare against — the resulting WHERE clause becomes a condition that is always true regardless of the actual password, causing the query to match and return a row (the victim\'s account) even without knowing their real password. In a parameterized query, the query\'s text and its parameter values are sent to the database through two entirely separate channels, using a protocol specifically designed to keep them apart: the database receives the fixed query structure first, with placeholders, and only afterward receives the actual parameter values, which it treats purely as literal data being compared against, never re-parsing them as SQL syntax regardless of what characters they contain. The identical "\' OR \'1\'=\'1" string, sent as a parameter, is simply compared, character for character, against the password column\'s actual value — it is never given the opportunity to be interpreted as anything other than a literal string.',
        aHi: 'String concatenation se bani query mein, password variable ki value seedha SQL text mein daali jaati hai us se pehle ki wo text database ko bheja jaaye — database ke paas ye jaanne ka koi tarika nahi ki aakhri string ke kaunse hisse "asal mein" query ka fixed hissa the aur kaunse hisse user input se aaye — ye bas ek poora SQL statement paata aur parse karta hai. Jab concatenated password value samyog se apna khud ka SQL syntax rakhta hai (ek band karti quote, uske baad "OR \'1\'=\'1\'"), us syntax ko database dwara asli, additional SQL logic ki tarah interpret kiya jaata hai, compare karne laayak ek literal password value ki tarah nahi — nateeja hua \`WHERE\` clause ek aisi condition ban jaati hai jo asli password se bekhabar hamesha sach hai, query ko ek row (victim ka account) match aur lautaane cause karti hai unka asli password jaane bina bhi. Ek parameterized query mein, query ka text aur uski parameter values database ko poori tarah do alag channels se bheji jaati hain, ek protocol use karte hue jo khaas taur par unhe alag rakhne ke liye design hua hai: database pehle fixed query sanrachna paata hai, placeholders ke saath, aur sirf baad mein asli parameter values paata hai, jinhe wo poori tarah literal data ki tarah treat karta hai jiski tulna hoti hai, unhe kabhi SQL syntax ki tarah dobara-parse na karte hue chahe unme koi bhi characters hon. Wahi "\' OR \'1\'=\'1" string, ek parameter ki tarah bhejna, bas character-dar-character password column ki asli value se compare hoti hai — use kabhi ek literal string se alag kisi cheez ki tarah interpret hone ka mauka milta hi nahi.',
      },
      {
        q: 'Why is manually escaping special characters (like turning a single quote into two single quotes) considered a weaker, incomplete defense compared to parameterized queries?',
        qHi: 'Khaas characters ko haath se escape karna (jaise ek single quote ko do single quotes mein badalna) parameterized queries ke muqable ek kamzor, adhoora bachaav kyun maana jaata hai?',
        a: 'Manual escaping works by attempting to transform potentially dangerous characters into a form that no longer has special meaning within SQL syntax before concatenating the (now supposedly safe) value into the query string — but this approach requires the developer to correctly and completely enumerate every character or character sequence that has special meaning across the specific SQL dialect of whichever database is being used, and to apply that escaping correctly at every single point in the codebase where user input might be concatenated into a query, indefinitely into the future as the codebase grows and changes. Different database engines have different escaping rules, different character encodings can introduce edge cases a simple escaping function might not account for, and a single missed location anywhere in a large codebase reopens the exact same vulnerability. Parameterized queries do not depend on the developer correctly anticipating and handling dangerous input at all — the separation between a query\'s fixed structure and its actual data values is enforced by the database communication protocol itself, a mechanism that works correctly regardless of what characters a parameter\'s value happens to contain, without requiring any character-specific logic to be written or maintained.',
        aHi: 'Manual escaping SQL syntax ke andar khaas matlab rakhte mumkin taur par khatarnaak characters ko ek aise roop mein badalne ki koshish karke kaam karta hai jiska ab koi khaas matlab na ho us se pehle ki (ab manaa jaata surakshit) value ko query string mein jodo — par is tarike ke liye zaruri hai ki developer jis bhi database ka istemal ho raha hai uske khaas SQL dialect mein khaas matlab rakhte har character ya character sequence ko sahi aur poori tarah gine, aur us escaping ko codebase mein har akeli jagah sahi tarike se lagu kare jahan user input ek query mein jodi ja sakti hai, aage bhavishya mein hamesha jaise codebase badhta aur badalta hai. Alag-alag database engines ke alag-alag escaping rules hain, alag character encodings aise edge cases la sakti hain jo ek saadha escaping function shaayad na sambhaale, aur ek badi codebase mein kahin bhi ek chhooti jagah bilkul wahi vulnerability dobara khol deti hai. Parameterized queries developer ke khatarnaak input ko sahi tarike se pehchaanne aur sambhaalne par bilkul nirbhar nahi karte — ek query ki fixed sanrachna aur uski asli data values ke beech alag karna database communication protocol khud lagu karta hai, ek mechanism jo sahi tarike se kaam karta hai chahe ek parameter ki value mein koi bhi characters hon, kisi bhi character-khaas logic likhne ya maintain karne ki zarurat bina.',
      },
      {
        q: 'Why is TypeScript entirely unable to catch a SQL injection vulnerability, even though it is a genuinely serious bug?',
        qHi: 'TypeScript SQL injection vulnerability poori tarah pakadne mein kyun asamarth hai, chahe ye ek sach mein gambhir bug ho?',
        a: 'TypeScript\'s type checker verifies the structural SHAPE of values as code executes — confirming, for instance, that a given variable is genuinely a string, that a function is called with arguments of the expected types, and that a returned value is used in ways consistent with its declared type. A SQL injection vulnerability exists entirely at a different, semantic level: the query string being sent to the database is, from TypeScript\'s perspective, a completely ordinary, correctly-typed string, built through operations (template literal interpolation, string concatenation) that are all individually valid and correctly typed on their own. TypeScript has no way to reason about what that string MEANS once it leaves the program and is interpreted as SQL by a separate database system, nor any concept of "this particular string happens to represent a query built in a way that is safe or unsafe against a specific class of attack" — that kind of semantic, security-relevant property of a value is simply outside what a type system is designed to check. This is precisely why avoiding SQL injection is a discipline requiring deliberate practice (always using parameterized queries) rather than something achievable purely through stricter typing or better compile-time tooling — type safety and this specific category of security safety are answers to genuinely different questions.',
        aHi: 'TypeScript ka type checker code chalte waqt values ki structural SHAPE verify karta hai — jaise, confirm karte hue ki ek diya gaya variable sach mein ek string hai, ek function ummeed kiye types ke arguments ke saath bulaaya jaata hai, aur ek lautaayi hui value ko uske declared type ke saath sangat tarikon se istemal kiya jaata hai. Ek SQL injection vulnerability poori tarah ek alag, semantic star par maujood hai: database ko bheji jaa rahi query string, TypeScript ke nazariye se, ek poori tarah aam, sahi-typed string hai, aise operations (template literal interpolation, string concatenation) se banti hui jo sab akele-akele valid aur sahi typed hain. TypeScript ke paas ye soch-samajhne ka koi tarika nahi ki wo string program se bahar jaane aur ek alag database system dwara SQL ki tarah interpret hone ke baad kya MATLAB rakhti hai, na hi "ye khaas string samyog se ek query darzha karti hai jo ek khaas attack kism ke khilaaf surakshit ya asurakshit tarike se banaayi gayi hai" wala koi concept — ek value ki us kism ki semantic, security-relevant property poori tarah us se bahar hai jo ek type system check karne ke liye design hua hai. Bilkul isi wajah se SQL injection se bachna ek anushasan hai jise jaan-boojhkar practice chahiye (hamesha parameterized queries use karna) na ki koi aisi cheez jo poori tarah sakht typing ya behtar compile-time tooling se haasil ho sake — type safety aur security ki ye khaas kism poori tarah alag sawaalon ke jawaab hain.',
      },
      {
        q: 'Why is it a mistake to assume an ORM automatically protects against SQL injection in every situation, including when using its raw-query features?',
        qHi: 'Ye maan lena galti kyun hai ki ek ORM har sthiti mein apne aap SQL injection se bachaata hai, uski raw-query features use karte waqt bhi?',
        a: 'An ORM\'s standard, primary API — the normal methods used for the vast majority of everyday queries, such as finding, creating, updating, or deleting records through the ORM\'s own object-oriented interface — generally constructs parameterized queries automatically behind the scenes, which is genuinely one of the practical benefits of using an ORM; a developer using only this standard API rarely needs to think explicitly about parameterization. However, essentially every ORM also provides some escape hatch for writing raw SQL directly, intended for queries too complex, too performance-sensitive, or too unusual for the ORM\'s standard API to conveniently express — and these raw-query features vary in how they handle safety. Some are explicitly designed to still parameterize safely despite accepting what looks like a raw query (a tagged template literal that automatically extracts interpolated values as separate parameters, for instance); others accept a genuinely plain string with no built-in protection at all, sometimes with a name deliberately signaling this (a method explicitly called something like "Unsafe"). Assuming that "this is part of an ORM, therefore it is automatically safe" without checking which specific raw-query mechanism is being used, and how that specific mechanism actually handles values, can reintroduce the exact same concatenation-based vulnerability this lesson covered, entirely by relying on a false assumption about the ORM\'s blanket safety.',
        aHi: 'Ek ORM ki standard, mukhya API — aam roz-marra ki queries ki bahut badi tadaad ke liye use hone wale aam methods, jaise ORM ki apni object-oriented interface se records dhoondhna, banaana, update karna, ya hataana — aam taur par peeche apne aap parameterized queries banaati hai, jo sach mein ORM use karne ke practical faayde mein se ek hai; sirf is standard API ka istemal karta developer explicitly parameterization ke baare mein shaayad hi sochta hai. Halaanki, lagbhag har ORM raw SQL seedha likhne ke liye kuch escape hatch bhi deta hai, un queries ke liye jo ORM ki standard API ke suvidhajanak roop se darzha karne ke liye bahut complex, bahut performance-sensitive, ya bahut anokhi hain — aur ye raw-query features safety kaise sambhaalte hain isme farak rakhte hain. Kuch explicitly design kiye gaye hain ki wo ek raw query jaisi dikhti cheez accept karne ke bawajood abhi bhi surakshit tarike se parameterize karein (ek tagged template literal jo interpolated values ko apne aap alag parameters ki tarah nikaalta hai, misal ke taur par); doosre ek sach mein saadhi string accept karte hain bilkul koi built-in protection bina, kabhi-kabhi ek naam ke saath jo jaan-boojhkar ye ishara karta hai (ek method jise explicitly "Unsafe" jaisa kuch kaha jaata hai). Ye maan lena "ye ORM ka hissa hai, isliye ye apne aap surakshit hai" bina check kiye ki kaunsa khaas raw-query mechanism use ho raha hai, aur wo khaas mechanism values ko asal mein kaise sambhaalta hai, bilkul wahi concatenation-based vulnerability dobara la sakta hai jo is lesson ne cover ki, poori tarah ORM ki blanket safety ke baare mein ek galat maanyata par bharosa karte hue.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken login route with string-concatenated SQL. Create a test user, then attempt to log in as them using their correct email but the password "\' OR \'1\'=\'1" and confirm you are logged in without knowing their real password.',
        taskHi: 'String-concatenated SQL wala toota login route banao. Ek test user banao, phir unke sahi email se login karne ki koshish karo par password "\' OR \'1\'=\'1" ke saath aur confirm karo aap unka asli password jaane bina login ho jaate ho.',
        hint: 'Log the exact final query string (after interpolation) to the console right before it is sent to the database, to see precisely what SQL is actually being executed.',
        hintHi: 'Bilkul aakhri query string (interpolation ke baad) ko console mein log karo us se theek pehle ki wo database ko bheji jaaye, seedha dekhne ke liye ki asal mein kaunsa SQL chal raha hai.',
      },
      {
        task: 'Fix it with a parameterized query. Repeat the exact same attack attempt and confirm it now correctly fails with 401 Unauthorized.',
        taskHi: 'Ek parameterized query se theek karo. Bilkul wahi attack koshish dohraao aur confirm karo ye ab sahi tarike se 401 Unauthorized ke saath fail hota hai.',
        hint: 'Try the same attack payload against a few OTHER fields in different routes (a search box, a comment field) to directly confirm the vulnerability is not specific to login forms.',
        hintHi: 'Wahi attack payload alag routes mein kuch DOOSRI fields ke khilaaf try karo (ek search box, ek comment field) seedha confirm karne ke liye ki vulnerability login forms tak khaas nahi hai.',
      },
      {
        task: 'Build the vulnerable /search route from the third example. Try a destructive-looking payload (like "%\'; DROP TABLE products; --") against both the broken and fixed versions, in a disposable test database, and confirm the difference in outcome.',
        taskHi: 'Teesre example wala vulnerable /search route banao. Ek nuksaandayak-dikhta payload (jaise "%\'; DROP TABLE products; --") try karo toote aur theek dono versions ke khilaaf, ek phenkne-laayak test database mein, aur nateeje ka fark confirm karo.',
        hint: 'Only ever run a genuinely destructive payload against a disposable test database you can freely recreate, never against any database holding real or important data.',
        hintHi: 'Kabhi bhi ek sach mein nuksaandayak payload sirf ek phenkne-laayak test database ke khilaaf chalaao jise aap khule aam dobara bana sako, kisi bhi database ke khilaaf kabhi nahi jismein asli ya zaruri data ho.',
      },
    ],

    keyTakeaways: [
      'Directly concatenating user input into a SQL query string lets that input become part of the query\'s own structure, not just its data — a crafted value like "\' OR \'1\'=\'1" can genuinely change what the query does, including bypassing authentication.',
      'Parameterized queries keep a query\'s fixed structure and its actual parameter values entirely separate at the protocol level — a parameter value is always treated as literal data being compared against, never re-interpreted as SQL syntax, regardless of what characters it contains.',
      'Manually escaping special characters is a fragile, incomplete defense requiring correct handling of every dangerous character across a database\'s specific SQL dialect, forever, without ever missing a case — parameterized queries do not rely on correctly anticipating anything.',
      'SQL injection is not limited to login forms or authentication — any route concatenating user-controlled input (search boxes, filters, any client-supplied value) into a SQL string carries the same risk.',
      'An ORM\'s standard API generally parameterizes automatically, but its raw-query escape hatches vary — some parameterize safely by design, others accept a plain string requiring the exact same manual discipline as raw SQL.',
      'TypeScript\'s type system verifies the structural shape of values, not the semantic safety of how a string is used as a database query — a codebase can be perfectly type-safe while remaining seriously vulnerable to SQL injection.',
    ],
    keyTakeawaysHi: [
      'User input ko seedha ek SQL query string mein jodna us input ko query ki apni sanrachna ka hissa ban ne deta hai, sirf uska data nahi — "\' OR \'1\'=\'1" jaisi ek socha hui value sach mein badal sakti hai query kya karti hai, authentication bypass karna sameet.',
      'Parameterized queries ek query ki fixed sanrachna aur uski asli parameter values ko protocol level par poori tarah alag rakhte hain — ek parameter value hamesha literal data ki tarah treat hoti hai jiski tulna hoti hai, kabhi SQL syntax ki tarah dobara-interpret nahi hoti, chahe usmein koi bhi characters hon.',
      'Khaas characters ko haath se escape karna ek nazuk, adhoora bachaav hai jise database ke khaas SQL dialect mein har khatarnaak character ka sahi sambhaalna chahiye, hamesha ke liye, kabhi ek case chhoote bina — parameterized queries kuch bhi sahi tarike se pehchaanne par bharosa nahi karte.',
      'SQL injection login forms ya authentication tak seemit nahi hai — koi bhi route jo user-controlled input (search boxes, filters, koi bhi client-diya value) ko ek SQL string mein jodta hai wahi khatra rakhta hai.',
      'Ek ORM ki standard API aam taur par apne aap parameterize karti hai, par uski raw-query escape hatches badalti rehti hain — kuch design se surakshit tarike se parameterize karti hain, doosre ek saadhi string accept karti hain jise raw SQL jaisi hi manual anushasan chahiye.',
      'TypeScript ka type system values ki structural shape verify karta hai, ek string ko database query ki tarah istemal karne ki semantic safety nahi — ek codebase poori tarah type-safe ho sakta hai jabki SQL injection ke liye gambhir taur par vulnerable rehta hai.',
    ],
  },
];
