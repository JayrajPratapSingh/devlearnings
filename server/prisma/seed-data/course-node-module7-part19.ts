/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 19.
 *
 * Multi-tenancy patterns: how a single Node.js codebase and database
 * safely serves many separate customers ("tenants") — each of whom must
 * never be able to see another tenant's data — without running a
 * completely separate deployment per customer. Broken example: a shared
 * database table with a tenant_id column that every query is SUPPOSED to
 * filter by, but one route forgets the filter, and a customer can view
 * another company's private data simply by guessing or incrementing an
 * ID. Fixed by enforcing tenant scoping in more than one place at once —
 * consistently at the application layer via a query-building helper or
 * middleware, and, as true defense-in-depth, at the database layer itself
 * via PostgreSQL row-level security, so a single missed WHERE clause in
 * application code can no longer leak data across tenants.
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

export const NODE_MODULE_7_PART19: CourseLesson[] = [
  {
    slug: 'multi-tenancy-patterns',
    title: 'Multi-Tenancy Patterns: Serving Many Customers From One Codebase',
    titleHi: 'Multi-Tenancy Patterns: Ek Codebase Se Kai Customers Ko Serve Karna',
    description: 'One forgotten WHERE clause in one route, and a customer at Company A can view Company B\'s private invoices simply by changing a number in the URL — a single missing filter is the entire distance between "isolated tenants" and a serious data breach.',
    descriptionHi: 'Ek route mein ek bhoola hua WHERE clause, aur Company A ka ek customer Company B ke private invoices dekh sakta hai bas URL mein ek number badalkar — ek akela gayab filter "alag-thalag tenants" aur ek gambhir data breach ke beech ki poori doori hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 19,

    analogy: {
      en: '**A shared self-storage facility where every customer\'s boxes sit in one giant, open warehouse room, each box merely labeled with a customer name tag, versus one where every customer\'s boxes live behind their own locked, separate room, and staff physically cannot open the wrong room even if they wanted to.** At the open-warehouse facility, staff retrieving a box for a customer are trusted to always check the name tag correctly before handing anything over — and on a normal, unhurried day, this works fine. But the day a new, rushed employee grabs the first box matching a similar description without carefully checking whose name tag is actually on it, a customer walks out with someone else\'s private belongings, and the facility only finds out when the rightful owner complains it\'s missing. Nothing about the building\'s physical structure ever prevented this — the mistake was entirely a matter of a human remembering to check correctly, every single time, with no exceptions. At the separate-locked-rooms facility, by contrast, even a brand-new, rushed employee physically cannot hand Customer A\'s belongings to Customer B, because Customer B\'s key simply does not open Customer A\'s room — the building\'s own physical structure enforces the separation, independent of whether any specific staff member remembers to be careful. A multi-tenant application storing every customer\'s data in one shared database, relying entirely on every single query in the application remembering to filter correctly by a tenant identifier, is the open-warehouse facility: it works until one route forgets, and then it doesn\'t. Enforcing that separation at the database level itself, not just trusting application code to remember, is the locked-rooms facility — the structure itself prevents the mistake, rather than merely hoping no one ever makes it.',
      hi: '**Ek shared self-storage facility jahan har customer ke boxes ek vishaal, khule warehouse room mein rehte hain, har box bas ek customer naam tag se label kiya hua, versus ek jahan har customer ke boxes apne khud ke locked, alag room ke peeche rehte hain, aur staff physically galat room nahi khol sakta chahe wo chaahe.** Khule-warehouse facility mein, ek customer ke liye ek box laane waale staff par bharosa kiya jaata hai ki wo kuch bhi haath mein dene se pehle hamesha naam tag sahi tarike se check karenge — aur ek normal, jaldi-na-hone-waale din, ye theek kaam karta hai. Par jis din ek naya, jaldbaazi mein staff kisi milte-julte varnan waala pehla box uthaa leta hai bina dhyaan se check kiye ki uspar asal mein kiska naam tag hai, ek customer kisi doosre ke private saaman ke saath chala jaata hai, aur facility ko tabhi pata chalta hai jab asli maalik shikaayat karta hai ki ye gayab hai. Building ke physical structure ke baare mein kuch bhi ise kabhi nahi rokta — galti poori tarah ek insaan ke sahi tarike se check karna yaad rakhne ki baat thi, har baar, koi apvaad bina. Alag-locked-rooms facility mein, iske ulta, ek bilkul-naya, jaldbaazi mein staff bhi physically Customer A ka saaman Customer B ko nahi de sakta, kyunki Customer B ki chaabi bas Customer A ka room khol hi nahi sakti — building ka apna khud ka physical structure separation ko lagu karta hai, kisi khaas staff member ke savdhaan rehna yaad rakhne se bekhabar. Ek multi-tenant application jo har customer ka data ek shared database mein store karti hai, poori tarah application ki har akeli query ke ek tenant identifier se sahi tarike se filter karna yaad rakhne par nirbhar, khula-warehouse facility hai: ye tab tak kaam karta hai jab tak ek route bhool nahi jaata, aur phir nahi karta. Us separation ko database star par khud lagu karna, sirf application code par yaad rakhne ka bharosa karne ke bajaye, locked-rooms facility hai — structure khud galti ko rokta hai, sirf umeed karne ke bajaye ki koi kabhi ise karega hi nahi.',
    },

    simple: `**Start broken.** Every query trusted to remember the tenant filter, with nothing enforcing it:

\`\`\`js
app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
    res.json(invoice.rows[0]); // no tenant_id filter — any authenticated user can view any invoice
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route correctly requires the user to be authenticated (\`requireAuth\`, from this course\'s earlier auth lessons), but authentication only proves WHO is asking — it says nothing about whether this specific user\'s COMPANY is allowed to see this specific invoice. Every tenant\'s invoices sit together in one shared \`invoices\` table, distinguished only by a \`tenant_id\` column, and this query never references that column at all. A logged-in user at Company A, simply by changing the \`:id\` in the URL to a number that happens to belong to Company B\'s invoice, retrieves it in full — full amounts, line items, customer names — despite having no legitimate relationship to Company B whatsoever. Nothing about authentication catches this, because the user genuinely is who they say they are; the missing piece is authorization at the TENANT level, and in this broken version, that check simply doesn\'t exist anywhere in the request\'s path.

**The fix: enforce tenant scoping at the application layer, and again at the database layer**

\`\`\`js
// Application layer: every query goes through a helper that
// automatically injects the tenant filter — impossible to forget
async function findInvoiceForTenant(tenantId, invoiceId) {
  const result = await pool.query(
    "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2",
    [invoiceId, tenantId]
  );
  return result.rows[0];
}

app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const invoice = await findInvoiceForTenant(req.tenantId, req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`sql
-- Database layer: PostgreSQL row-level security as a second, independent
-- enforcement point — even a query that forgets the tenant_id filter
-- in application code physically cannot see another tenant's rows
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);
\`\`\`

The application-layer fix wraps every query behind a helper function that always includes the tenant filter, so a developer would have to deliberately bypass the helper to make this specific mistake again — a meaningful improvement, but still ultimately a piece of application code someone could still write incorrectly elsewhere. Row-level security, configured directly in PostgreSQL, is a second, genuinely independent layer of defense: once enabled, the database itself refuses to return rows that don\'t match the current tenant, regardless of what the application\'s SQL actually asked for — even a raw, unfiltered \`SELECT * FROM invoices\` run by mistake would return only the current tenant\'s rows, because the database, not the application code, is the one enforcing the boundary.`,

    simpleHi: `**Toote hue se shuru.** Har query par bharosa kiya jaata hai ki wo tenant filter yaad rakhegi, kuch bhi ise lagu kiye bina:

\`\`\`js
app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
    res.json(invoice.rows[0]); // koi tenant_id filter nahi — koi bhi authenticated user koi bhi invoice dekh sakta hai
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye route sahi tarike se user ko authenticated hone ki maang karta hai (\`requireAuth\`, is course ke pehle wale auth lessons se), par authentication sirf ye saabit karta hai KAUN poochh raha hai — ye kuch nahi kehta ki kya is khaas user ki COMPANY is khaas invoice ko dekhne ki ijaazat rakhti hai. Har tenant ke invoices ek shared \`invoices\` table mein saath rehte hain, sirf ek \`tenant_id\` column se alag kiye jaate hain, aur ye query us column ko kabhi reference hi nahi karti. Company A ka ek logged-in user, bas URL mein \`:id\` ko ek aise number mein badalkar jo Company B ke invoice ka hota hai, ise poori tarah retrieve kar leta hai — poori amounts, line items, customer names — chahe Company B se unka koi vaidh rishta bilkul na ho. Authentication ke baare mein kuch bhi ise nahi pakadta, kyunki user asal mein wahi hai jo wo kehta hai; gayab tukda TENANT star par authorization hai, aur is toote version mein, wo check bas request ke path mein kahin bhi maujood hi nahi hai.

**Fix: application layer par tenant scoping lagu karo, aur dobara database layer par**

\`\`\`js
// Application layer: har query ek aise helper se guzarti hai jo
// automatically tenant filter inject karta hai — bhoolna asambhav hai
async function findInvoiceForTenant(tenantId, invoiceId) {
  const result = await pool.query(
    "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2",
    [invoiceId, tenantId]
  );
  return result.rows[0];
}

app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const invoice = await findInvoiceForTenant(req.tenantId, req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`sql
-- Database layer: PostgreSQL row-level security ek doosre, swatantra
-- enforcement point ki tarah — application code mein tenant_id filter
-- bhool jaane wali query bhi doosre tenant ke rows physically nahi dekh sakti
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);
\`\`\`

Application-layer fix har query ko ek aise helper function ke peeche wrap karta hai jo hamesha tenant filter shaamil karta hai, taaki ek developer ko is khaas galti ko dobara karne ke liye jaan-boojhkar helper ko bypass karna pade — ek maayne-rakhta sudhaar, par phir bhi aakhirkaar application code ka ek tukda jise koi kahin aur galat tarike se likh sakta hai. Row-level security, seedhe PostgreSQL mein configure ki gayi, defense ki ek doosri, sach mein swatantra layer hai: ek baar enabled hone par, database khud un rows ko lautaane se mana kar deta hai jo current tenant se match nahi karte, application ka SQL asal mein kya poochh raha tha us se bekhabar — ek raw, galti se bina-filter \`SELECT * FROM invoices\` bhi sirf current tenant ke rows lautaaega, kyunki database, application code nahi, wo hai jo boundary ko lagu karta hai.`,

    content: `## Three standard multi-tenancy models, and their trade-offs

\`\`\`
1. Shared database, shared schema, tenant_id column
   - Cheapest to operate, one database for everyone
   - Weakest isolation — a single missed filter leaks across tenants

2. Shared database, separate schema per tenant
   - One database, one schema per tenant (postgres "schemas")
   - Stronger isolation, migrations must run against every schema

3. Separate database per tenant
   - Strongest isolation, one tenant's load can't affect another's
   - Most operationally expensive — connection pools, migrations,
     and backups all multiply by the number of tenants
\`\`\`

The shared-database, shared-schema model — one \`invoices\` table with a \`tenant_id\` column, used by this lesson\'s broken and fixed examples — is the cheapest and simplest to operate: one database, one set of migrations, one connection pool serving every customer. Its weakness is exactly what this lesson\'s broken example demonstrates: isolation depends entirely on every query correctly filtering by \`tenant_id\`, and a single mistake anywhere in the application can leak data across tenants. A separate-schema-per-tenant model gives each tenant their own PostgreSQL schema within the same database — stronger isolation, since a query genuinely cannot see another schema\'s tables without explicitly being told to, at the cost of running migrations against potentially hundreds of schemas instead of one. A fully separate database per tenant offers the strongest isolation of all — one tenant\'s data is physically in an entirely different database, and one tenant\'s heavy load or misbehaving query cannot possibly affect another\'s performance — at the highest operational cost, since connection pooling, migrations, and backups must all be managed per-tenant rather than once, centrally.

## Enforcing the tenant filter consistently: a query-scoping helper

\`\`\`js
// Instead of trusting every developer to remember tenant_id everywhere:
function tenantScoped(tenantId) {
  return {
    findInvoice: (id) => pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2", [id, tenantId]
    ),
    findAllInvoices: () => pool.query(
      "SELECT * FROM invoices WHERE tenant_id = $1", [tenantId]
    ),
  };
}

app.use((req, res, next) => {
  req.db = tenantScoped(req.tenantId); // every route uses req.db, never the raw pool directly
  next();
});
\`\`\`

Rather than relying on every individual developer to remember to add \`AND tenant_id = $N\` to every single query, by hand, forever, a consistent pattern is to expose the raw database pool ONLY through a tenant-scoped wrapper created once per request, using the authenticated user\'s known tenant ID. Every route then interacts only with this wrapper (\`req.db\`) rather than the underlying pool directly, making the tenant filter structurally difficult to forget, since the query methods available simply don\'t offer an unscoped alternative. This is the same underlying discipline as this course\'s earlier module-boundaries lesson: rather than trusting every developer to remember a rule, the code itself is shaped so the correct behavior is the easy, natural path and the incorrect one requires deliberately working around the provided abstraction.

## Row-level security: enforcing the same boundary at the database itself

\`\`\`sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);

-- The application sets the current tenant once per connection/request:
SET app.current_tenant = '42';
SELECT * FROM invoices; -- automatically returns only tenant 42's rows,
                         -- even with no WHERE clause written at all
\`\`\`

PostgreSQL\'s row-level security (RLS) moves tenant enforcement out of application code entirely and into the database itself: once an RLS policy is enabled on a table, the database transparently filters every query against that table to only the rows matching the policy\'s condition, regardless of what the query\'s own \`WHERE\` clause does or doesn\'t say. This provides genuine defense-in-depth specifically because it is a second, independent enforcement mechanism — even if a developer writes a completely unscoped query, forgets the helper wrapper entirely, or a bug in the query-scoping logic itself lets an unfiltered query through, the database still refuses to return another tenant\'s rows, because the database is the one drawing the boundary, not the application\'s SQL. This does not replace the application-layer scoping helper — the two together mean a single mistake at either layer alone is not enough to cause a real data leak, since the other layer still catches it.

## Choosing the right model based on genuine isolation and compliance needs

\`\`\`
Small number of large, high-value enterprise customers, each with
strict data-isolation or compliance requirements (finance, healthcare)
→ separate database per tenant is often worth the operational cost.

Large number of small-to-medium customers, cost-sensitivity matters,
strong-but-not-absolute isolation is acceptable
→ shared database with tenant_id + RLS is a common, practical choice.
\`\`\`

The right multi-tenancy model is not a purely technical choice — it depends on the actual number of tenants, their size, and any genuine compliance or contractual requirements around data isolation. A product serving a small number of very large enterprise customers, some of whom may contractually require their data never share physical storage with anyone else\'s, often justifies the operational cost of separate databases per tenant. A product serving thousands of small-to-medium customers, where per-tenant operational overhead would be prohibitive, commonly favors the shared-database model with \`tenant_id\` and row-level security as its primary enforcement, reserving separate databases only for the specific large customers whose contracts genuinely require it — a hybrid approach many real production systems adopt rather than picking one model universally for every tenant.`,

    contentHi: `## Multi-tenancy ke teen standard models, aur unke trade-offs

\`\`\`
1. Shared database, shared schema, tenant_id column
   - Chalaana sabse sasta, sabke liye ek database
   - Sabse kamzor isolation — ek gayab filter tenants ke aar-paar leak karta hai

2. Shared database, prati-tenant alag schema
   - Ek database, prati-tenant ek schema (postgres "schemas")
   - Zyaada mazboot isolation, migrations har schema ke khilaaf chalne chahiye

3. Prati-tenant alag database
   - Sabse mazboot isolation, ek tenant ka load doosre ko asar nahi kar sakta
   - Sabse zyaada operationally mehanga — connection pools, migrations,
     aur backups sab tenants ki tadaad se multiply hote hain
\`\`\`

Shared-database, shared-schema model — ek \`invoices\` table ek \`tenant_id\` column ke saath, is lesson ke toote aur theek examples dwara istemal kiya gaya — chalaana sabse sasta aur saadha hai: ek database, ek set migrations ka, ek connection pool jo har customer ko serve karta hai. Iski kamzori bilkul wahi hai jo is lesson ka toota example dikhaata hai: isolation poori tarah is baat par nirbhar hai ki har query sahi tarike se \`tenant_id\` se filter kare, aur application mein kahin bhi ek akeli galti tenants ke aar-paar data leak kar sakti hai. Ek separate-schema-prati-tenant model har tenant ko usi database ke andar apna khud ka PostgreSQL schema deta hai — zyaada mazboot isolation, kyunki ek query asal mein doosre schema ke tables ko explicitly bataaye bina nahi dekh sakti, ek ke bajaye sambhaavit roop se sainkadon schemas ke khilaaf migrations chalaane ki keemat par. Ek poori tarah alag database prati-tenant sabse mazboot isolation deta hai — ek tenant ka data physically ek poori tarah alag database mein hai, aur ek tenant ka bhaari load ya galat vyavhaar karti query doosre ki performance ko asar nahi kar sakti — sabse oonchi operational keemat par, kyunki connection pooling, migrations, aur backups sab prati-tenant manage kiye jaane chahiye, ek baar, kendriya taur par ke bajaye.

## Tenant filter ko consistently lagu karna: ek query-scoping helper

\`\`\`js
// Har developer par bharosa karne ke bajaye ki wo har jagah tenant_id
// yaad rakhe:
function tenantScoped(tenantId) {
  return {
    findInvoice: (id) => pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2", [id, tenantId]
    ),
    findAllInvoices: () => pool.query(
      "SELECT * FROM invoices WHERE tenant_id = $1", [tenantId]
    ),
  };
}

app.use((req, res, next) => {
  req.db = tenantScoped(req.tenantId); // har route \`req.db\` istemal karta hai, kabhi raw pool seedhe nahi
  next();
});
\`\`\`

Har akele developer par bharosa karne ke bajaye ki wo har akeli query mein haath se, hamesha ke liye, \`AND tenant_id = $N\` jodna yaad rakhe, ek consistent pattern raw database pool ko SIRF ek tenant-scoped wrapper ke through expose karna hai jo prati-request ek baar banaaya jaata hai, authenticated user ki jaani-pehchaani tenant ID istemal karke. Har route phir sirf is wrapper (\`req.db\`) se interact karta hai underlying pool seedhe se nahi, tenant filter ko structurally bhoolna mushkil banaate hue, kyunki upalabdh query methods bas ek unscoped vikalp offer hi nahi karte. Ye is course ke pehle wale module-boundaries lesson jaisa hi buniyaadi anushaasan hai: har developer par ek rule yaad rakhne ka bharosa karne ke bajaye, code khud aise shape kiya jaata hai ki sahi vyavhaar aasaan, prakritik raah ho aur galat wala jaan-boojhkar diye gaye abstraction ke aas-paas kaam karne ki maang kare.

## Row-level security: usi boundary ko database mein khud lagu karna

\`\`\`sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);

-- Application prati-connection/request ek baar current tenant set karta hai:
SET app.current_tenant = '42';
SELECT * FROM invoices; -- automatically sirf tenant 42 ke rows lautaata hai,
                         -- bilkul koi WHERE clause likhe bina bhi
\`\`\`

PostgreSQL ki row-level security (RLS) tenant enforcement ko application code se poori tarah bahar aur database mein khud le jaati hai: ek baar ek table par ek RLS policy enable hone par, database transparently us table ke khilaaf har query ko sirf policy ki sthiti se match karti rows tak filter karta hai, query ka apna \`WHERE\` clause kya kehta hai ya nahi kehta us se bekhabar. Ye asli defense-in-depth deta hai khaas taur par isliye kyunki ye ek doosra, swatantra enforcement mechanism hai — chahe ek developer ek poori tarah unscoped query likhe, helper wrapper ko poori tarah bhool jaaye, ya khud query-scoping logic mein ek bug ek unfiltered query ko guzarne de, database phir bhi doosre tenant ke rows lautaane se mana karta hai, kyunki database, application ka SQL nahi, wo hai jo boundary kheenchta hai. Ye application-layer scoping helper ki jagah nahi leta — dono saath yeh matlab rakhte hain ki kisi bhi ek layer par akeli ek galti ek asli data leak cause karne ke liye kaafi nahi hai, kyunki doosri layer use phir bhi pakad leti hai.

## Asli isolation aur compliance zarooraton ke aadhaar par sahi model chunna

\`\`\`
Bade, oonchi-keemat wale enterprise customers ki chhoti tadaad, har
ek sakht data-isolation ya compliance zarooraton ke saath (finance,
healthcare)
→ prati-tenant alag database aksar operational keemat ke laayak hai.

Chhote-se-madhyam customers ki badi tadaad, keemat-sanvedansheelta
maayne rakhti hai, mazboot-par-poori-tarah-nahi isolation sweekaarya hai
→ shared database \`tenant_id\` + RLS ke saath ek aam, vyavhaarik chunaav hai.
\`\`\`

Sahi multi-tenancy model shuddh roop se ek technical chunaav nahi hai — ye asli tenants ki tadaad, unke size, aur data isolation ke aas-paas kisi bhi asli compliance ya contractual zarooraton par nirbhar hai. Ek product jo bahut kam bade enterprise customers ko serve karta hai, jinmein se kuch contractually maang sakte hain ki unka data kabhi kisi doosre ke saath physical storage share na kare, aksar prati-tenant alag databases ki operational keemat ko justify karta hai. Ek product jo hazaaron chhote-se-madhyam customers ko serve karta hai, jahan prati-tenant operational overhead mana-karne-laayak hoga, aam taur par \`tenant_id\` aur row-level security wale shared-database model ko apne mukhya enforcement ki tarah favour karta hai, sirf un khaas bade customers ke liye alag databases rakhte hue jinke contracts sach mein iski maang karte hain — ek hybrid tarika jise kai asli production systems apnaate hain har tenant ke liye sarvavyaapi roop se ek model chunne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a query with no tenant filter leaks data across companies',
        titleHi: 'Toota: koi tenant filter na wali ek query companies ke aar-paar data leak karti hai',
        code: `app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
  res.json(invoice.rows[0]); // any authenticated user, any company's invoice`,
        codeJs: `app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
    res.json(invoice.rows[0]);
  } catch (err) {
    next(err);
  }
});
// changing :id to any number retrieves that invoice, regardless of tenant`,
        codeTs: `app.get("/invoices/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
    res.json(invoice.rows[0]);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about a missing authorization check, not a type error.`,
        output: `Works fine for a user viewing their own company's invoice. Also
"works" — incorrectly — for a user at a different company who
simply changes the ID in the URL to view someone else's invoice.`,
        explain: 'Authentication proves who the user is, but says nothing about which tenant\'s data they\'re allowed to see — this query never checks that at all.',
        explainHi: 'Authentication saabit karta hai ki user kaun hai, par kuch nahi kehta ki wo kaunse tenant ka data dekhne ki ijaazat rakhte hain — ye query ise bilkul check hi nahi karti.',
      },
      {
        title: 'Fixed: a tenant-scoped query helper makes the filter structurally hard to skip',
        titleHi: 'Theek: ek tenant-scoped query helper filter ko structurally skip karna mushkil banaata hai',
        code: `function tenantScoped(tenantId) {
  return { findInvoice: (id) => pool.query(
    "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2", [id, tenantId]
  )};
}`,
        codeJs: `function tenantScoped(tenantId) {
  return {
    findInvoice: (id) => pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2", [id, tenantId]
    ),
  };
}

app.use((req, res, next) => {
  req.db = tenantScoped(req.tenantId);
  next();
});

app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await req.db.findInvoice(req.params.id);
    if (!result.rows[0]) return res.status(404).json({ error: "Invoice not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface TenantScopedDb {
  findInvoice(id: string): Promise<QueryResult>;
}

function tenantScoped(tenantId: number): TenantScopedDb {
  return {
    findInvoice: (id: string) => pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2", [id, tenantId]
    ),
  };
}

app.get("/invoices/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await req.db.findInvoice(req.params.id);
    if (!result.rows[0]) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A user at Company A changing the ID to Company B's invoice now
receives a 404 — the query itself, via the helper, always includes
the tenant filter, since req.db offers no unscoped alternative.`,
        outputTs: `// Identical behaviour. The TenantScopedDb interface documents that
// every method on it is inherently tenant-scoped by construction.`,
        explain: 'The tenant filter is no longer something a developer has to remember on every query — it\'s baked into the only way routes are allowed to touch the database.',
        explainHi: 'Tenant filter ab kuch aisa nahi hai jo ek developer ko har query par yaad rakhna pade — ye ekmatra tarike mein pakka hai jismein routes database ko chhoone ki ijaazat rakhte hain.',
      },
      {
        title: 'Row-level security as an independent, database-enforced backstop',
        titleHi: 'Row-level security ek swatantra, database-lagu-kiya-gaya backstop ki tarah',
        code: `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::int);`,
        codeJs: `// Node.js sets the current tenant once per request, then queries normally
async function withTenantContext(tenantId, queryFn) {
  const client = await pool.connect();
  try {
    await client.query("SET app.current_tenant = $1", [tenantId]);
    return await queryFn(client);
  } finally {
    client.release();
  }
}

app.get("/invoices/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await withTenantContext(req.tenantId, (client) =>
      client.query("SELECT * FROM invoices WHERE id = $1", [req.params.id])
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `async function withTenantContext<T>(
  tenantId: number,
  queryFn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("SET app.current_tenant = $1", [tenantId]);
    return await queryFn(client);
  } finally {
    client.release();
  }
}`,
        outputJs: `Even though this query has no tenant_id in its WHERE clause at all,
PostgreSQL's row-level security policy silently restricts the result
to only the current tenant's rows — the database enforces it directly.`,
        outputTs: `// Identical behaviour. This is deliberately redundant with the
// application-layer helper — either layer alone catching a mistake
// is what prevents a real cross-tenant data leak.`,
        explain: 'RLS is a second, independent enforcement layer at the database itself — even an unscoped query written by mistake in application code cannot see another tenant\'s rows.',
        explainHi: 'RLS database mein khud ek doosri, swatantra enforcement layer hai — application code mein galti se likhi ek unscoped query bhi doosre tenant ke rows nahi dekh sakti.',
      },
    ],

    mistakes: [
      {
        wrong: `const invoice = await pool.query("SELECT * FROM invoices WHERE id = $1", [id]);
// no tenant_id anywhere — relies entirely on every developer remembering it every time`,
        right: `const invoice = await req.db.findInvoice(id); // tenant filter baked into the only available method`,
        why: 'Trusting every developer to manually add a tenant filter to every query, forever, will eventually be forgotten somewhere — a query-scoping helper makes the correct behavior the only available one.',
        whyHi: 'Har developer par bharosa karna ki wo har query mein manually ek tenant filter jode, hamesha ke liye, aakhirkaar kahin bhool jaayega — ek query-scoping helper sahi vyavhaar ko ekmatra upalabdh banaata hai.',
      },
      {
        wrong: `// Relying only on application-layer scoping, with no database-level backstop
// One bug in the query-scoping logic itself leaks data with nothing else catching it`,
        right: `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices USING (tenant_id = current_setting('app.current_tenant')::int);
// a second, independent layer catches what the first layer misses`,
        why: 'Application-layer scoping alone is still just application code, which can itself contain a bug — row-level security provides a genuinely independent second enforcement point.',
        whyHi: 'Akela application-layer scoping phir bhi bas application code hai, jismein khud ek bug ho sakta hai — row-level security ek sach mein swatantra doosra enforcement point deta hai.',
      },
      {
        wrong: `// A single shared database for 5 enterprise customers who contractually
// require complete physical data isolation from each other
// "It's cheaper this way" — ignoring genuine compliance requirements`,
        right: `// Separate database per tenant for customers with genuine
// contractual or compliance isolation requirements, even at higher
// operational cost`,
        why: 'The right multi-tenancy model depends on actual compliance and contractual requirements, not purely on operational cost — a shared model that violates a genuine isolation requirement is not a valid option regardless of savings.',
        whyHi: 'Sahi multi-tenancy model asli compliance aur contractual zarooraton par nirbhar hai, shuddh roop se operational keemat par nahi — ek shared model jo ek asli isolation zaroorat todta hai bachat se bekhabar ek vaidh vikalp nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**Multi-tenant SaaS data leaks caused by a single missing tenant filter in one query are among the most commonly reported real-world security incidents at B2B software companies**, precisely because a shared-database model concentrates so much risk on one consistently-applied rule.',
        hi: '**Ek query mein ek gayab tenant filter se cause hue multi-tenant SaaS data leaks B2B software companies mein sabse aam taur par report ki jaane waali asli-duniya security incidents mein se hain**, bilkul isliye kyunki ek shared-database model itna zyaada khatra ek consistently-lagu-ki-gayi rule par kendrit karta hai.',
      },
      {
        en: '**PostgreSQL\'s native row-level security feature is a widely documented, standard mechanism specifically recommended for exactly this multi-tenant isolation problem**, used across a broad range of production SaaS platforms as a defense-in-depth layer.',
        hi: '**PostgreSQL ka native row-level security feature ek vyaapak roop se documented, standard mechanism hai jo khaas taur par bilkul isi multi-tenant isolation samasya ke liye recommend kiya jaata hai**, production SaaS platforms ki ek vyaapak range mein ek defense-in-depth layer ki tarah istemal hota hai.',
      },
      {
        en: '**Hybrid multi-tenancy — a shared database for most customers, with dedicated databases carved out specifically for large enterprise customers with contractual isolation requirements — is a commonly cited real-world pattern**, rather than any single model being universally applied to every tenant.',
        hi: '**Hybrid multi-tenancy — zyaadatar customers ke liye ek shared database, contractual isolation zarooraton wale bade enterprise customers ke liye khaas taur par nikaale gaye dedicated databases ke saath — ek aam taur par cite kiya jaane waala asli-duniya pattern hai**, kisi bhi ek model ke har tenant par sarvavyaapi roop se lagu hone ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does authentication alone not prevent the kind of cross-tenant data leak this lesson\'s broken example demonstrates?',
        qHi: 'Akela authentication is lesson ke toote example dwara dikhaaye gaye cross-tenant data leak ki tarah ko kyun nahi rokta?',
        a: 'Authentication answers a specific, narrow question: is the person making this request genuinely who they claim to be, typically verified via a valid session or a correctly signed JWT (following this course\'s earlier auth lessons). This is a real and necessary check, but it says absolutely nothing about a completely separate question: given that this specific, genuinely-authenticated person is who they say they are, are they actually entitled to see this specific piece of data they\'re asking for? In a multi-tenant application, a user is always authenticated as themselves — they never stop being who they are — but the data they\'re requesting might belong to an entirely different tenant (a different company, a different customer account) than the one they\'re associated with, and nothing about proving their own identity has any bearing on whether that particular piece of data is theirs to see. This is precisely the distinction between authentication and authorization this course covered in an earlier lesson, applied specifically to the tenant boundary: a route that checks requireAuth and stops there has verified WHO is asking, but has performed no check at all on WHETHER that specific tenant is allowed to see this specific resource. The broken example\'s query fetches an invoice purely by its ID, with the tenant column never referenced anywhere in the SQL — this means the query would return the exact same row regardless of which tenant\'s user requested it, since the query itself has no concept of tenant boundaries at all, only the concept of "is this user logged in," which every tenant\'s users equally satisfy.',
        aHi: 'Authentication ek khaas, sankuchit sawaal ka jawaab deta hai: kya ye request karne waala vyakti asal mein wahi hai jo wo hone ka daava karta hai, aam taur par ek vaidh session ya sahi tarike se signed JWT ke zariye verify kiya jaata hai (is course ke pehle wale auth lessons ka palan karte hue). Ye ek asli aur zaruri check hai, par ye ek poori tarah alag sawaal ke baare mein bilkul kuch nahi kehta: ye dekhte hue ki ye khaas, asal mein-authenticated vyakti wahi hai jo wo hone ka daava karta hai, kya wo asal mein us khaas data ko dekhne ka haqdar hai jo wo maang raha hai? Ek multi-tenant application mein, ek user hamesha khud ki tarah authenticated hai — wo kabhi wo hona band nahi karte jo wo hain — par jo data wo maang rahe hain shaayad us tenant (ek alag company, ek alag customer account) se poori tarah alag ka ho jisse wo judein hain, aur unki apni pehchaan saabit karne ke baare mein kuch bhi is baat par koi asar nahi rakhta ki kya wo khaas data unka dekhne ke liye hai. Ye bilkul wahi antar hai authentication aur authorization ke beech jo is course ne ek pehle wale lesson mein cover kiya, tenant boundary par khaas taur par lagu kiya gaya: ek route jo \`requireAuth\` check karta hai aur wahin ruk jaata hai ye verify kar chuka hai KAUN poochh raha hai, par bilkul koi check nahi kiya ki KYA wo khaas tenant is khaas resource ko dekhne ki ijaazat rakhta hai. Toote example ki query ek invoice ko sirf uski ID se fetch karti hai, tenant column SQL mein kahin bhi reference kiye bina — iska matlab hai query bilkul wahi row lautaayegi chahe kaunse tenant ke user ne request kiya ho, kyunki query khud tenant boundaries ki koi dhaarna bilkul nahi rakhti, sirf "kya ye user logged in hai" ki dhaarna rakhti hai, jise har tenant ke users samaan roop se poora karte hain.',
      },
      {
        q: 'Why is row-level security valuable specifically as a SECOND enforcement layer, rather than a replacement for tenant-scoping the application code itself?',
        qHi: 'Row-level security khaas taur par ek DOOSRI enforcement layer ki tarah keemti kyun hai, khud application code ko tenant-scope karne ka ek replacement nahi?',
        a: 'The core value of having two separate enforcement mechanisms rather than one is that they fail independently — a mistake that slips past one is very unlikely to also slip past the other, since the two operate through entirely different mechanisms with no shared blind spot. Application-layer tenant scoping (a query-scoping helper, or middleware that constructs queries with a tenant filter always included) prevents most mistakes by making the correct behavior the easy, natural path — but it is still, fundamentally, application code, written by people, and it remains possible for a bug in that scoping logic itself, a new route that bypasses the helper and queries the raw pool directly, or a subtle mistake in how the tenant ID is determined, to produce an unscoped or incorrectly-scoped query that the application layer alone would not catch. Row-level security operates at a genuinely different layer entirely: it is enforced by the database engine itself, independent of what SQL the application happens to send, based on session-level configuration (the current tenant setting) rather than trusting each individual query\'s own WHERE clause to be correct. This means even if every application-layer safeguard fails simultaneously — the helper is bypassed, a bug in the scoping logic ships to production, a brand-new engineer unfamiliar with the pattern writes a raw, unscoped query directly — the database itself still refuses to return rows outside the current tenant\'s boundary, because enforcement does not depend on the application\'s SQL being correct at all. Relying on either layer alone leaves a real, specific way for a mistake to slip through undetected; relying on both together means a single mistake, at either layer, is not suffient on its own to cause an actual cross-tenant data leak, since the remaining layer still catches it.',
        aHi: 'Ek ke bajaye do alag enforcement mechanisms rakhne ki mool keemat ye hai ki wo swatantra roop se fail hote hain — ek galti jo ek ke paas se guzarti hai doosre ke paas se bhi guzarna bahut asambhav hai, kyunki dono poori tarah alag mechanisms se kaam karte hain koi shared blind spot bina. Application-layer tenant scoping (ek query-scoping helper, ya middleware jo hamesha ek tenant filter shaamil karti queries banaata hai) sahi vyavhaar ko aasaan, prakritik raah banaakar zyaadatar galtiyaan rokta hai — par ye phir bhi, buniyaadi taur par, application code hai, logon dwara likha gaya, aur us scoping logic mein khud ek bug, ek naya route jo helper ko bypass karke seedhe raw pool ko query karta hai, ya tenant ID kaise tay hoti hai ismein ek sookshm galti, ek unscoped ya galat-scoped query paida karna mumkin rehta hai jise application layer akele nahi pakadegi. Row-level security ek sach mein poori tarah alag layer par kaam karta hai: ye database engine khud dwara lagu kiya jaata hai, application asal mein kaunsa SQL bhejta hai us se bekhabar, session-star ki configuration (current tenant setting) ke aadhaar par har akeli query ke apne WHERE clause ke sahi hone par bharosa karne ke bajaye. Iska matlab hai chahe har application-layer safeguard ek saath fail ho jaaye — helper bypass ho jaaye, scoping logic mein ek bug production tak ship ho jaaye, pattern se anjaan ek bilkul-naya engineer seedhe ek raw, unscoped query likhe — database khud phir bhi current tenant ki boundary ke baahar rows lautaane se mana karta hai, kyunki enforcement application ka SQL sahi hone par bilkul nirbhar nahi hai. Akeli kisi bhi layer par bharosa karna ek asli, khaas tarika chhodta hai jismein ek galti bina-pakde guzar sake; dono ek saath par bharosa karna matlab hai kisi bhi ek layer par ek akeli galti, khud se, ek asli cross-tenant data leak cause karne ke liye kaafi nahi hai, kyunki bacha hua layer use phir bhi pakad leta hai.',
      },
      {
        q: 'What genuine factors should determine whether a product uses a shared database, separate schemas, or separate databases per tenant?',
        qHi: 'Kaunse asli factors tay karne chahiye ki ek product shared database, alag schemas, ya prati-tenant alag databases istemal kare?',
        a: 'The choice between these models should be grounded in the actual number and nature of tenants, the genuine strength of isolation required, and any real compliance or contractual obligations — not purely on which is simplest to build first. A shared database with a tenant_id column and row-level security is the cheapest to operate at meaningful scale, since a single set of migrations, a single connection pool, and centralized operational tooling serve every tenant simultaneously — well-suited to a product with a large number of small-to-medium customers where per-tenant operational overhead would be prohibitively expensive to manage individually, and where the combination of application-layer scoping and row-level security provides isolation strong enough for the actual risk profile involved. A separate database per tenant provides categorically stronger isolation — one tenant\'s data lives in a physically distinct database, one tenant\'s heavy query load cannot degrade performance for any other tenant, and a catastrophic bug affecting one tenant\'s database cannot possibly touch another\'s — but multiplies operational overhead by the number of tenants, since migrations, backups, connection pooling, and monitoring must all be managed per-database rather than centrally. This tradeoff genuinely matters most for a small number of large, high-value customers, particularly in regulated industries like healthcare or finance, where a customer\'s own compliance obligations may contractually require that their data never physically share storage with any other customer\'s, a requirement a shared-database model cannot satisfy regardless of how well application-layer and row-level security are implemented. Many real production systems adopt a hybrid approach specifically because of this: a shared database serves the bulk of smaller customers cost-effectively, while a small number of large enterprise customers with genuine contractual isolation requirements are carved out into their own dedicated databases, matching the isolation model to each tenant\'s actual, specific requirements rather than forcing every tenant into one universal choice.',
        aHi: 'In models ke beech chunaav asli tenants ki tadaad aur prakriti, chahi gayi isolation ki asli mazbooti, aur kisi bhi asli compliance ya contractual zimmedariyon mein tikaa hona chahiye — shuddh roop se pehle banaane mein kaunsa sabse saadha hai uspar nahi. Ek \`tenant_id\` column aur row-level security wala shared database maayne-rakhta scale par chalaana sabse sasta hai, kyunki migrations ka ek akela set, ek akela connection pool, aur kendriya operational tooling har tenant ko ek saath serve karta hai — chhote-se-madhyam customers ki ek badi tadaad wale product ke liye achhi tarah upyukt jahan prati-tenant operational overhead ko akele manage karna mana-karne-laayak mehanga hoga, aur jahan application-layer scoping aur row-level security ka sanyojan shaamil asli khatre ke profile ke liye kaafi mazboot isolation deta hai. Prati-tenant ek alag database categorically zyaada mazboot isolation deta hai — ek tenant ka data physically ek alag database mein rehta hai, ek tenant ka bhaari query load kisi doosre tenant ke liye performance kharaab nahi kar sakta, aur ek tenant ke database ko asar karta ek vinaashkaari bug doosre ko chhu bhi nahi sakta — par operational overhead ko tenants ki tadaad se multiply karta hai, kyunki migrations, backups, connection pooling, aur monitoring sab prati-database manage kiye jaane chahiye kendriya roop se ke bajaye. Ye tradeoff asal mein sabse zyaada bade, oonchi-keemat wale customers ki chhoti tadaad ke liye maayne rakhta hai, khaas taur par regulated industries jaise healthcare ya finance mein, jahan ek customer ki apni compliance zimmedariyaan contractually maang sakti hain ki unka data kabhi kisi doosre customer ke saath physical storage share na kare, ek zaroorat jise ek shared-database model poora nahi kar sakta chahe application-layer aur row-level security kitni bhi achhi tarah implement ki gayi ho. Kai asli production systems khaas taur par isi wajah se ek hybrid tarika apnaate hain: ek shared database chhote customers ke bade hisse ko keemat-prabhaavi taur par serve karta hai, jabki asli contractual isolation zarooraton wale bade enterprise customers ki ek chhoti tadaad ko unke khud ke dedicated databases mein nikaala jaata hai, isolation model ko har tenant ki asli, khaas zaroorat se milaate hue har tenant ko ek sarvavyaapi chunaav mein daalne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build a small shared-schema multi-tenant setup: one invoices table with a tenant_id column, and a broken route that queries without filtering by it. Confirm you can retrieve another tenant\'s invoice by changing the ID.',
        taskHi: 'Ek chhota shared-schema multi-tenant setup banaao: ek \`invoices\` table ek \`tenant_id\` column ke saath, aur ek toota route jo use filter kiye bina query karta hai. Confirm karo ki tum ID badalkar ek doosre tenant ka invoice retrieve kar sakte ho.',
        hint: 'Seed two rows with different tenant_id values, log in as a user associated with one tenant, and try requesting the other tenant\'s row by ID directly.',
        hintHi: 'Alag \`tenant_id\` values ke saath do rows seed karo, ek tenant se juda ek user ki tarah login karo, aur seedhe ID se doosre tenant ke row ki request karne ki koshish karo.',
      },
      {
        task: 'Add a tenantScoped query helper as shown in this lesson, refactor the route to use it, and confirm the cross-tenant request from the previous exercise now returns a 404 instead of leaking data.',
        taskHi: 'Is lesson mein dikhaaya \`tenantScoped\` query helper jodo, route ko ise istemal karne ke liye refactor karo, aur confirm karo ki pichhle exercise ki cross-tenant request ab data leak karne ke bajaye ek 404 lautaati hai.',
        hint: 'Make sure req.tenantId is set correctly by your auth middleware before the tenantScoped helper is constructed for each request.',
        hintHi: 'Sunishchit karo ki \`req.tenantId\` tumhaare auth middleware dwara sahi tarike se set hai isse pehle ki \`tenantScoped\` helper har request ke liye banaaya jaaye.',
      },
      {
        task: 'Enable PostgreSQL row-level security on the invoices table with a policy matching this lesson\'s example. Deliberately write a raw, unscoped query and confirm it still only returns the current tenant\'s row.',
        taskHi: 'Is lesson ke example se milti ek policy ke saath \`invoices\` table par PostgreSQL row-level security enable karo. Jaan-boojhkar ek raw, unscoped query likho aur confirm karo ki ye phir bhi sirf current tenant ka row lautaati hai.',
        hint: 'Remember to SET app.current_tenant for the current session/connection before running the query — RLS policies rely on that setting being present.',
        hintHi: 'Query chalaane se pehle current session/connection ke liye \`app.current_tenant\` \`SET\` karna yaad rakho — RLS policies us setting ke maujood hone par nirbhar hain.',
      },
    ],

    keyTakeaways: [
      'Authentication proves who a user is; it says nothing about which tenant\'s data they\'re entitled to see — that requires a separate, deliberate tenant-authorization check on every query.',
      'A shared database with a tenant_id column is the cheapest multi-tenancy model but the weakest in isolation — a single missing filter in one query can leak data across tenants.',
      'A query-scoping helper that\'s the only way routes touch the database makes the tenant filter structurally hard to forget, rather than relying on every developer remembering it by hand.',
      'PostgreSQL row-level security enforces tenant isolation at the database itself, independent of the application\'s own SQL — a genuinely second, independent layer of defense.',
      'Application-layer scoping and row-level security are complementary, not redundant: a mistake at either layer alone is not enough to cause a real leak, since the other layer still catches it.',
      'The right multi-tenancy model (shared database, separate schemas, or separate databases) depends on actual tenant count, size, and genuine compliance/contractual requirements — often a hybrid, not one universal choice.',
    ],
    keyTakeawaysHi: [
      'Authentication saabit karta hai ki ek user kaun hai; ye kuch nahi kehta ki wo kaunse tenant ka data dekhne ka haqdar hai — uske liye har query par ek alag, jaan-boojhkar tenant-authorization check chahiye.',
      'Ek \`tenant_id\` column wala shared database sabse sasta multi-tenancy model hai par isolation mein sabse kamzor — ek query mein ek gayab filter tenants ke aar-paar data leak kar sakta hai.',
      'Ek query-scoping helper jo routes ke database chhoone ka ekmatra tarika hai tenant filter ko structurally bhoolna mushkil banaata hai, har developer ke ise haath se yaad rakhne par nirbhar hone ke bajaye.',
      'PostgreSQL row-level security tenant isolation ko database mein khud lagu karta hai, application ke apne SQL se bekhabar — defense ki ek sach mein doosri, swatantra layer.',
      'Application-layer scoping aur row-level security poorak hain, dohraav nahi: kisi bhi ek layer par akeli ek galti ek asli leak cause karne ke liye kaafi nahi hai, kyunki doosri layer use phir bhi pakad leti hai.',
      'Sahi multi-tenancy model (shared database, alag schemas, ya alag databases) asli tenant count, size, aur asli compliance/contractual zarooraton par nirbhar hai — aksar ek hybrid, ek sarvavyaapi chunaav nahi.',
    ],
  },
];
