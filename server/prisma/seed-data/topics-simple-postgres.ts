import type { SimpleExplanation } from './topics-simple';

/** Beginner layer for PostgreSQL. */
export const SIMPLE_POSTGRES: Record<string, SimpleExplanation> = {
  'pg-why-postgres': {
    simple: `**A Swiss Army knife, not just a knife.**

Postgres is a normal SQL database — tables, rows, joins. But it also does a lot of things people install *extra* databases for:

| You want | People install | Postgres already does it |
|---|---|---|
| Flexible fields | MongoDB | \`JSONB\` |
| A list in one column | a whole extra table | \`ARRAY\` |
| Search text properly | Elasticsearch | full-text search |
| Rankings, running totals | wrote it in code | window functions |

So before adding a second database, check whether Postgres already has the feature. Fewer tools = fewer things to break and keep in sync.

**Where it is weak:** connections are expensive (each one is a whole process), and lots of updates leave rubbish behind that needs cleaning. Both have their own topics here.

**Remember:** it is a relational database that quietly does much more.`,
    simpleHi: `**Swiss Army knife, sirf chaaku nahi.**

Postgres ek normal SQL database hai — tables, rows, joins. Par ye wo bahut kuch bhi karta hai jiske liye log *alag* database install kar lete hain:

| Aapko chahiye | Log install karte hain | Postgres pehle se karta hai |
|---|---|---|
| Flexible fields | MongoDB | \`JSONB\` |
| Ek column mein list | poori extra table | \`ARRAY\` |
| Text search theek se | Elasticsearch | full-text search |
| Rankings, running totals | code mein likh liya | window functions |

Isliye doosra database jodne se pehle dekho ki Postgres mein wo feature pehle se hai kya. Kam tools = kam cheezein tootne aur sync karne ko.

**Kahan kamzor hai:** connections mehenge hain (har ek poora process hai), aur bahut updates se kooda peeche reh jata hai jise saaf karna padta hai. Dono ke apne topics yahan hain.

**Yaad rakho:** relational database hai jo chupchaap bahut kuch aur bhi karta hai.`,
  },

  'pg-data-types': {
    simple: `**Pick the right box for the thing.**

Three choices matter more than the rest:

**1. Time → always \`TIMESTAMPTZ\`, never \`TIMESTAMP\`.**
\`TIMESTAMP\` just stores "3 PM" with no idea *whose* 3 PM. Your server in Mumbai and your user in London will disagree about the same row. \`TIMESTAMPTZ\` stores the actual moment and converts for whoever is looking.

**2. Money → always \`NUMERIC\`, never \`FLOAT\`.**
\`FLOAT\` cannot hold 0.1 exactly:
\`\`\`sql
SELECT 0.1::float + 0.2::float;    -- 0.30000000000000004  😱
SELECT 0.1::numeric + 0.2::numeric; -- 0.3                 ✅
\`\`\`
In a payments table those tiny errors add up.

**3. Ids → normally a counter (1, 2, 3), sometimes a UUID.**
A counter is small and fast. But \`/users/5\` invites anyone to try \`/users/6\` — and they can count how many users you have. Use a UUID when the id is public.

**Remember:** TIMESTAMPTZ for time, NUMERIC for money.`,
    simpleHi: `**Har cheez ke liye sahi dabba chuno.**

Teen choices baaki sab se zyada matter karti hain:

**1. Time → hamesha \`TIMESTAMPTZ\`, kabhi \`TIMESTAMP\` nahi.**
\`TIMESTAMP\` bas "3 baje" rakh leta hai, bina jaane *kiske* 3 baje. Mumbai ka server aur London ka user ek hi row par alag baat karenge. \`TIMESTAMPTZ\` asli pal rakhta hai aur dekhne wale ke hisaab se convert karta hai.

**2. Paisa → hamesha \`NUMERIC\`, kabhi \`FLOAT\` nahi.**
\`FLOAT\` 0.1 ko theek se rakh hi nahi sakta:
\`\`\`sql
SELECT 0.1::float + 0.2::float;    -- 0.30000000000000004  😱
SELECT 0.1::numeric + 0.2::numeric; -- 0.3                 ✅
\`\`\`
Payments table mein ye chhoti galtiyan jud kar badi ho jaati hain.

**3. Ids → aksar counter (1, 2, 3), kabhi UUID.**
Counter chhota aur tez hai. Par \`/users/5\` dekh kar koi bhi \`/users/6\` try karega — aur gin lega ki aapke kitne users hain. Id public ho to UUID use karo.

**Yaad rakho:** time ke liye TIMESTAMPTZ, paise ke liye NUMERIC.`,
  },

  'pg-jsonb': {
    simple: `**A drawer inside a filing cabinet.**

Normally every column has a fixed meaning. But sometimes data genuinely differs — a shirt has a size, a laptop has RAM, a book has pages. Making a column for each is silly.

\`JSONB\` is a drawer where you can put a different shape per row:

\`\`\`js
{ "color": "black", "size": "M" }      // shirt
{ "ram": "16GB", "cpu": "M2" }         // laptop
\`\`\`

And unlike a real drawer, you can still **search inside it** — and index it, so searching is fast.

**One thing that trips everyone up:**
\`\`\`sql
attrs -> 'color'    -- gives "black"  (WITH quotes — it is still JSON)
attrs ->> 'color'   -- gives black    (plain text — use this to compare)
\`\`\`
One arrow = JSON. Two arrows = text.

**When NOT to use it:** anything you filter, join or need rules on should be a **real column**. JSONB has no foreign keys, and a typo in a key name fails silently instead of erroring.

**Remember:** JSONB = a flexible drawer, but only for genuinely flexible data.`,
    simpleHi: `**Filing cabinet ke andar ek draaz.**

Normally har column ka ek tay matlab hota hai. Par kabhi data sach mein alag hota hai — shirt ka size hota hai, laptop ki RAM, kitaab ke pages. Har ek ke liye column banana bewakoofi hai.

\`JSONB\` wo draaz hai jahan har row mein alag shakl rakh sakte ho:

\`\`\`js
{ "color": "black", "size": "M" }      // shirt
{ "ram": "16GB", "cpu": "M2" }         // laptop
\`\`\`

Aur asli draaz ke ulat, aap uske **andar search bhi kar sakte ho** — aur index bhi, isliye search tez rehta hai.

**Ek cheez jo sabko fasati hai:**
\`\`\`sql
attrs -> 'color'    -- deta hai "black"  (quotes ke SAATH — abhi bhi JSON hai)
attrs ->> 'color'   -- deta hai black    (plain text — compare ke liye yahi)
\`\`\`
Ek arrow = JSON. Do arrow = text.

**Kab use NAHI karna:** jis par filter, join ya rules chahiye wo **asli column** hona chahiye. JSONB mein foreign keys nahi hoti, aur key ke naam mein typo error dene ki jagah chupchaap fail hota hai.

**Yaad rakho:** JSONB = flexible draaz, par sirf sach mein flexible data ke liye.`,
  },

  'pg-upsert-returning': {
    simple: `**"Add it, or update it if it's already there."**

The obvious way is broken:

\`\`\`js
const found = await findByEmail(email);
if (found) update(); else insert();      // ⚠️ race condition
\`\`\`

Two requests arrive at the same moment. **Both** check, **both** find nothing, **both** insert — and one crashes with a duplicate error. This never happens while you test and always happens under real traffic.

Let the database do it in **one step**:

\`\`\`sql
INSERT INTO users (email, name) VALUES ('jay@x.com', 'Jay')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
\`\`\`

\`EXCLUDED\` means "the new values I was trying to insert".

**Bonus: \`RETURNING\`.** Normally after inserting you run a second query to get the new id. \`RETURNING id\` hands it back immediately — one trip instead of two.

**Remember:** ON CONFLICT = insert-or-update, safely, in one step.`,
    simpleHi: `**"Daal do, ya pehle se hai to badal do."**

Jo tareeka pehle dimaag mein aata hai wo toota hua hai:

\`\`\`js
const found = await findByEmail(email);
if (found) update(); else insert();      // ⚠️ race condition
\`\`\`

Do requests ek hi pal aati hain. **Dono** check karti hain, **dono** ko kuch nahi milta, **dono** insert karti hain — aur ek duplicate error se crash ho jati hai. Test karte waqt ye kabhi nahi hota aur asli traffic par hamesha hota hai.

Database ko **ek hi step mein** karne do:

\`\`\`sql
INSERT INTO users (email, name) VALUES ('jay@x.com', 'Jay')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
\`\`\`

\`EXCLUDED\` matlab "wo nayi values jo main daalne ja raha tha".

**Bonus: \`RETURNING\`.** Normally insert ke baad nayi id lene ke liye doosri query chalani padti hai. \`RETURNING id\` turant wapas de deta hai — do ki jagah ek chakkar.

**Yaad rakho:** ON CONFLICT = insert-ya-update, safely, ek hi step mein.`,
  },

  'pg-window-functions': {
    simple: `**Keep the rows AND get the total.**

\`GROUP BY\` squashes rows together. Ask for "total spend per customer" and you get one line per customer — the individual orders are **gone**.

But often you want both: every order, *and* that customer's running total beside it. That is a **window function**.

\`\`\`sql
SELECT user_id, total,
       SUM(total) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total
FROM orders;
\`\`\`

Read \`OVER (PARTITION BY user_id ORDER BY created_at)\` as *"per customer, in date order"*.

**The classic use:** "the 3 most recent orders **per customer**". Without window functions this is genuinely painful — people fetch everything and slice it in code. With \`ROW_NUMBER()\` it is one query: number each customer's orders 1, 2, 3… then keep rows numbered 3 or less.

**Remember:** GROUP BY loses the rows. A window keeps them.`,
    simpleHi: `**Rows bhi rakho AUR total bhi lo.**

\`GROUP BY\` rows ko dabaa deta hai. "Har customer ka total kharcha" maango to har customer ki ek line milti hai — alag-alag orders **gayab**.

Par aksar dono chahiye: har order, *aur* uske saath us customer ka running total. Yahi **window function** hai.

\`\`\`sql
SELECT user_id, total,
       SUM(total) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total
FROM orders;
\`\`\`

\`OVER (PARTITION BY user_id ORDER BY created_at)\` ko aise padho: *"har customer ke liye, date ke order mein"*.

**Classic use:** "**har customer** ke 3 sabse naye orders". Window functions ke bina ye sach mein takleef deh hai — log sab kuch la kar code mein kaat te hain. \`ROW_NUMBER()\` se ek query: har customer ke orders ko 1, 2, 3… number do, phir 3 ya usse kam wali rows rakho.

**Yaad rakho:** GROUP BY rows kho deta hai. Window unhe rakhta hai.`,
  },

  'pg-indexes-advanced': {
    simple: `**Different index pages for different books.**

A normal index (**B-tree**) is the one at the back of a book — great for "find this exact thing" or "everything between X and Y".

But some questions need a different kind:

- **GIN** — for looking *inside* a column. If \`tags\` holds a list, a normal index cannot search inside it. GIN can.
- **Partial** — index only the rows you actually search. If 2% of orders are "pending" and every query filters on that, index just those 2%. Fiftieth of the size, stays in memory.
- **Expression** — if you search \`WHERE LOWER(email) = ...\`, a normal index on \`email\` is **useless**, because the stored value is not lowercase. Index \`LOWER(email)\` instead.

**Two production rules:**

1. On a live table always use \`CREATE INDEX CONCURRENTLY\`. The plain version **blocks all writes** while it builds — on a big table, that is your site going down.
2. **Postgres does not index foreign keys for you.** It only does primary keys. A missing index there is one of the most common causes of slow joins.

**Remember:** wrapping a column in a function turns its index off.`,
    simpleHi: `**Alag kitaabon ke liye alag index pages.**

Normal index (**B-tree**) wahi hai jo kitaab ke peeche hota hai — "ye exact cheez dhoondho" ya "X se Y ke beech ka sab" ke liye badhiya.

Par kuch sawaalon ko alag tarah ka chahiye:

- **GIN** — column ke *andar* dekhne ke liye. \`tags\` mein list hai to normal index uske andar search nahi kar sakta. GIN kar sakta hai.
- **Partial** — sirf un rows par index jinhe aap sach mein search karte ho. 2% orders "pending" hain aur har query usi par filter karti hai, to sirf un 2% par index banao. Pachaswan hissa, memory mein hi reh jata hai.
- **Expression** — agar aap \`WHERE LOWER(email) = ...\` search karte ho, to \`email\` par normal index **bekaar** hai, kyunki stored value lowercase nahi hai. Uski jagah \`LOWER(email)\` par index banao.

**Do production rules:**

1. Live table par hamesha \`CREATE INDEX CONCURRENTLY\`. Normal wala banne ke poore samay **saari writes rok deta hai** — badi table par matlab site down.
2. **Postgres foreign keys par index khud nahi banata.** Sirf primary keys par. Wahan index na hona dheeme joins ki sabse common wajah hai.

**Yaad rakho:** column ko function mein lapetne se uska index band ho jata hai.`,
  },

  'pg-explain-analyze': {
    simple: `**Ask the database to show its working.**

Your query is slow. Instead of guessing, ask Postgres what it actually did:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
\`\`\`

Two words to look for:

- **Seq Scan** = it read **every single row**. Bad on a big table.
- **Index Scan** = it jumped straight there. Good.

Then look at the two row counts it prints:

\`\`\`
rows=10          ← what Postgres expected
actual rows=411203  ← what actually happened
\`\`\`

A huge gap like that means Postgres planned the whole query on a wrong guess. Usually its statistics are out of date — \`ANALYZE tablename;\` fixes it.

**One nuance:** \`Seq Scan\` is not always wrong. On a tiny table, reading everything genuinely is faster than using an index. It is only a red flag on a big table returning few rows.

**Remember:** EXPLAIN ANALYZE tells you the truth. Guessing does not.`,
    simpleHi: `**Database se poochho usne kiya kya.**

Aapki query dheemi hai. Andaza lagane ki jagah Postgres se poochho ki usne asal mein kya kiya:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
\`\`\`

Do shabd dekhne hain:

- **Seq Scan** = usne **har ek row** padhi. Badi table par bura.
- **Index Scan** = seedha wahan pahuncha. Achha.

Phir jo do row counts chhapte hain unhe dekho:

\`\`\`
rows=10          ← Postgres ne socha tha
actual rows=411203  ← asal mein hua
\`\`\`

Itna bada farq matlab Postgres ne poori query ek galat andaze par banayi. Aksar uski statistics purani hoti hain — \`ANALYZE tablename;\` se theek ho jata hai.

**Ek baareeki:** \`Seq Scan\` hamesha galat nahi hai. Chhoti table par sab padhna sach mein index se tez hota hai. Ye sirf tab red flag hai jab badi table se kam rows aa rahi hon.

**Yaad rakho:** EXPLAIN ANALYZE sach batata hai. Andaza nahi.`,
  },

  'pg-mvcc-vacuum': {
    simple: `**Postgres never rubs anything out.**

When you update a row, Postgres does **not** overwrite it. It writes a **new version** and marks the old one as dead.

Why? So that someone reading right now keeps seeing a consistent picture. This is why **readers never block writers** — a long report does not freeze your app.

**The cost:** those dead versions pile up. Update one row a million times and there are a million dead copies sitting on disk. That is called **bloat**.

**VACUUM** is the cleaner that clears them out. Postgres runs it automatically (autovacuum), so mostly you ignore it — until a very busy table outgrows it.

**Two surprises worth knowing:**

- **\`DELETE\` does not free space.** It only marks rows dead, so a big delete makes the table **bigger** on disk until vacuum runs. To empty a table completely, \`TRUNCATE\` is instant.
- **\`VACUUM FULL\` locks the table.** It genuinely shrinks the file, but nothing can read or write while it runs. Never fire it off casually on production.

**Remember:** updates leave rubbish behind; VACUUM sweeps it up.`,
    simpleHi: `**Postgres kabhi kuch mitata nahi.**

Jab aap row update karte ho, Postgres use **overwrite nahi** karta. Wo **naya version** likhta hai aur purane ko dead mark kar deta hai.

Kyun? Taaki abhi jo padh raha hai use ek consistent tasveer dikhti rahe. Isi wajah se **readers writers ko kabhi nahi rokte** — lambi report aapki app ko jam nahi karti.

**Keemat:** wo dead versions jamaa hote rehte hain. Ek row das lakh baar update karo aur das lakh dead copies disk par padi rehti hain. Ise **bloat** kehte hain.

**VACUUM** wo safai wala hai jo unhe hataata hai. Postgres ise khud chalata hai (autovacuum), isliye aksar aap ise ignore karte ho — jab tak koi bahut busy table usse aage na nikal jaye.

**Do chaunkane wali baatein:**

- **\`DELETE\` jagah khaali nahi karta.** Wo sirf rows dead mark karta hai, isliye bada delete karne par table vacuum tak disk par **aur badi** ho jati hai. Poori table khaali karni ho to \`TRUNCATE\` turant hota hai.
- **\`VACUUM FULL\` table lock kar deta hai.** Wo sach mein file chhoti karta hai, par uske chalte na koi padh sakta hai na likh. Production par ise yun hi kabhi mat chalao.

**Yaad rakho:** updates kooda chhod jaate hain; VACUUM use saaf karta hai.`,
  },

  'pg-connection-pooling': {
    simple: `**Only a few phone lines.**

In Postgres every connection is a **whole separate process** — not a cheap little thread. So the default limit is about **100 connections**, not thousands.

If your app opens a new connection per request, you run out in seconds.

**A pool** is a small set of lines kept open and shared. Ten lines can serve hundreds of requests, because each request only holds one for a few milliseconds.

\`\`\`
Requests ──▶ pool (10 lines) ──▶ Postgres
\`\`\`

**Bigger is not better.** Past a point, more connections means the database spends its time switching between them instead of working. 10–20 is right for most apps.

**The maths people forget:** the pool is **per app instance**. Four servers × 20 = **80** connections, not 20. Multiply before you set the limit.

**Serverless is the classic disaster** — every cold start opens fresh connections and blows past the limit. That is what **PgBouncer** is for: it sits in front and squeezes many clients onto a few real lines.

**Remember:** connections are expensive. Share a few, do not open many.`,
    simpleHi: `**Sirf kuch hi phone lines.**

Postgres mein har connection ek **poora alag process** hai — sasta sa thread nahi. Isliye default limit lagbhag **100 connections** hai, hazaron nahi.

Aapki app har request par nayi connection khole to seconds mein khatam ho jayengi.

**Pool** matlab kuch lines khuli rakh kar share karna. Das lines sau se zyada requests sambhal leti hain, kyunki har request unhe kuch milliseconds hi pakadti hai.

\`\`\`
Requests ──▶ pool (10 lines) ──▶ Postgres
\`\`\`

**Bada matlab behtar nahi.** Ek had ke baad zyada connections matlab database kaam karne ki jagah unke beech switch karta rehta hai. Zyadatar apps ke liye 10–20 sahi hai.

**Wo hisaab jo log bhool jaate hain:** pool **per app instance** hoti hai. Chaar server × 20 = **80** connections, 20 nahi. Limit set karne se pehle guna karo.

**Serverless classic disaster hai** — har cold start nayi connections kholta hai aur limit paar kar deta hai. **PgBouncer** isi ke liye hai: wo aage baith kar bahut saare clients ko thodi asli lines par chala deta hai.

**Yaad rakho:** connections mehenge hain. Kuch share karo, bahut mat kholo.`,
  },

  'pg-migrations-seeding': {
    simple: `**A diary for your database.**

You add a column on your laptop. How does your teammate's database get the same column? And the production server?

**Migrations** are that diary. Each change gets written into a numbered file. Anyone runs them in order and ends up with the identical database.

\`\`\`bash
prisma migrate dev --name add_phone   # write the entry and apply it
prisma migrate deploy                  # apply pending entries (production)
\`\`\`

**Three rules that save teams:**

1. **Commit the migration files.** They are code, not junk.
2. **Never edit a migration someone else has already run.** Their database has ticked it off, so your edit will never run there. Write a new one.
3. **Adding a "cannot be empty" column to a table with existing rows will fail.** What goes in those rows? Do it in three steps: add it as optional → fill it in → then make it required.

**Seeding is different.** A migration changes the **shape** (columns, tables). A seed adds **content** (categories, sample data). Make it safe to run twice — use "insert or update", never a blind insert, or running it again duplicates everything.

**Remember:** migration = shape, seed = content. Both are code, both get committed.`,
    simpleHi: `**Aapke database ki diary.**

Aapne laptop par ek column joda. Aapke teammate ke database mein wahi column kaise aayega? Aur production server mein?

**Migrations** wahi diary hain. Har badlav ek numbered file mein likh jata hai. Koi bhi unhe order mein chalata hai aur bilkul wahi database paata hai.

\`\`\`bash
prisma migrate dev --name add_phone   # entry likho aur lagao
prisma migrate deploy                  # pending entries lagao (production)
\`\`\`

**Teen rules jo teams ko bachate hain:**

1. **Migration files commit karo.** Ye code hain, kachra nahi.
2. **Jo migration koi aur chala chuka hai use kabhi edit mat karo.** Uske database mein wo tick ho chuki hai, isliye aapka badlav wahan kabhi chalega hi nahi. Nayi likho.
3. **Bhare hue table mein "khaali nahi ho sakta" column jodna fail hoga.** Un rows mein kya jayega? Teen step mein karo: optional jodo → bharo → phir required banao.

**Seeding alag hai.** Migration **shakl** badalti hai (columns, tables). Seed **content** daalta hai (categories, sample data). Use do baar chalne layak safe banao — "insert ya update" use karo, andha insert kabhi nahi, warna dobara chalane par sab duplicate ho jayega.

**Yaad rakho:** migration = shakl, seed = content. Dono code hain, dono commit hote hain.`,
  },
};
