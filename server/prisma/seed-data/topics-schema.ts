import type { SeedCategory } from './topics-shared';

/**
 * Data modelling and schema design.
 *
 * The SQL and MongoDB categories teach the mechanics — how to write a JOIN, how
 * to embed a document. This category is about the decisions: what the tables
 * should be in the first place, which patterns exist for the awkward cases, and
 * what each one costs.
 *
 * These are the choices that are cheap on day one and expensive to reverse on
 * day four hundred, which is exactly why they are worth thinking about early
 * and why they come up in senior interviews.
 */
export const schemaCategory: SeedCategory = {
  slug: 'data-modelling',
  name: 'Schema & Data Modelling',
  description:
    'Designing the data itself — relationships, keys, history, multi-tenancy and the patterns for cases that do not fit neatly.',
  icon: 'layers',
  group: 'data',
  topics: [
    {
      slug: 'schema-how-to-model',
      title: 'How to design a schema from scratch',
      difficulty: 'EASY',
      summary: 'Find the nouns, find the relationships, then decide what the database must guarantee. Structure first, columns later.',
      summaryHi: 'Sangya dhoondho, rishte dhoondho, phir tay karo ki database ko kya guarantee karna hai. Pehle dhaancha, columns baad mein.',
      content: `**The process, in order**

**1. Find the nouns.** Read the requirements and underline every thing that exists in its own right. *"Customers place orders for products"* → \`customers\`, \`orders\`, \`products\`. Those are your tables.

**2. Find the relationships and their direction.**
- A customer has many orders → the **order** holds \`customer_id\`
- An order has many products, a product is in many orders → a **join table**

The foreign key always lives on the **many** side. That single rule resolves most beginner confusion about which table gets the column.

**3. Decide what must be true, and make the database enforce it.**
- An order must have a customer → \`NOT NULL REFERENCES\`
- Total cannot be negative → \`CHECK\`
- Emails are unique → \`UNIQUE\`

Every rule you push into the schema is a rule your application cannot accidentally skip — and there are more ways into the database than you think.

**4. Only now, pick types.** Money is \`NUMERIC\`, time is \`TIMESTAMPTZ\`, and everything gets a primary key.

**Two questions that catch design problems early**

**"What happens when this changes?"** A product's price changes. If the order references the product's current price, every historical invoice silently rewrites itself. So the order stores the price **at the time of sale** — that is not denormalisation for speed, it is correctness.

**"Can I represent something impossible?"** If a row can be in two contradictory states at once, the schema permits a bug. Tighten it so the invalid state cannot be written.

**Model the domain, not the screen.** A schema shaped around today's UI breaks when the UI changes — and the UI changes constantly while the underlying business rarely does.

**Where beginners go wrong**

- **Too few tables.** Cramming everything into \`users\` with thirty nullable columns, most meaningless for most rows.
- **Too many tables.** Splitting one concept across five tables so every query needs four joins.
- **Comma-separated lists in a column.** \`tags = "a,b,c"\` cannot be indexed, joined or constrained. Use a real relationship.

**The test that works:** try to write the five queries your app will actually run. If they are painful, the model is wrong, and it is far cheaper to find that out now than after there is data in it.`,
      contentHi: `**Tareeka, kram se**

**1. Sangya dhoondho.** Zarooratein padho aur har us cheez ko rekhankit karo jo apne aap mein maujood hai. *"Customers products ke liye orders dete hain"* → \`customers\`, \`orders\`, \`products\`. Yahi aapki tables hain.

**2. Rishte aur unki disha dhoondho.**
- Ek customer ke kai orders → \`customer_id\` **order** par
- Ek order mein kai products, ek product kai orders mein → **join table**

Foreign key hamesha **kai** wali taraf rehti hai. Yahi ek niyam zyadatar shuruaati uljhan hal kar deta hai ki column kis table mein jaye.

**3. Tay karo kya sach hona chahiye, aur database se lagu karwao.**
- Order ka customer hona zaroori → \`NOT NULL REFERENCES\`
- Total negative nahi ho sakta → \`CHECK\`
- Emails alag hon → \`UNIQUE\`

Har wo niyam jo aap schema mein daalte ho, wo niyam hai jise aapki application galti se chhod hi nahi sakti — aur database tak pahunchne ke raste aapke andaze se zyada hain.

**4. Ab jaakar types chuno.** Paisa \`NUMERIC\`, samay \`TIMESTAMPTZ\`, aur har cheez ki ek primary key.

**Do sawaal jo design ki samasya jaldi pakadte hain**

**"Ye badle to kya hoga?"** Product ka daam badalta hai. Agar order product ke maujooda daam ko reference karta hai, to har purana invoice chupchaap khud ko dobara likh leta hai. Isliye order **bikri ke waqt ka** daam rakhta hai — ye raftaar ke liye denormalisation nahi, ye sahi hona hai.

**"Kya main kuch namumkin likh sakta hoon?"** Agar ek row ek saath do virodhi haalaton mein ho sakti hai, to schema ek bug ki ijazat de raha hai. Ise itna kaso ki galat haalat likhi hi na ja sake.

**Domain model karo, screen nahi.** Aaj ke UI ki shakal par bana schema UI badalte hi toot ta hai — aur UI lagatar badalta hai jabki neeche ka business shayad hi badalta ho.

**Shuruaat mein log kahan galat karte hain**

- **Bahut kam tables.** Sab kuch \`users\` mein tees nullable columns ke saath thoons dena, jinme se zyadatar rows ke liye zyadatar bemaani hain.
- **Bahut zyada tables.** Ek hi vichaar ko paanch tables mein baant dena taaki har query mein chaar join lagein.
- **Column mein comma se alag list.** \`tags = "a,b,c"\` na index ho sakti hai, na join, na constraint. Asli rishta banao.

**Wo jaanch jo chalti hai:** wo paanch queries likhne ki koshish karo jo aapki app sach mein chalayegi. Wo takleef dein, to model galat hai — aur ye abhi pata chal jana usse kahin sasta hai jab usme data aa chuka ho.`,
      codeExample: `-- Nouns become tables, the foreign key sits on the "many" side
CREATE TABLE customers (
  id    BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status      TEXT NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING','PAID','SHIPPED','CANCELLED')),
  placed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Many-to-many needs its own table, and it is a good place for extra facts
CREATE TABLE order_items (
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),

  -- The price AT THE TIME OF SALE. Not a denormalisation for speed —
  -- without it, changing a product price rewrites every historical invoice.
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),

  PRIMARY KEY (order_id, product_id)
);`,
      commonMistakes: [
        'Storing a comma-separated list in a column instead of a real relationship — it cannot be indexed, joined or constrained.',
        'Referencing a product\'s current price from an order, so changing a price silently rewrites history.',
        'Modelling the current screen rather than the domain, so the schema breaks whenever the UI changes.',
        'One wide table with thirty nullable columns, most meaningless for most rows.',
      ],
      interviewQuestions: [
        'Walk me through designing a schema for an e-commerce order system.',
        'Which side of a one-to-many relationship holds the foreign key, and why?',
        'Why does an order store the price rather than referencing the product\'s price?',
        'How do you decide what belongs in a constraint versus application code?',
      ],
      practiceQuestions: [
        'Design tables for a blog with users, posts, comments and tags.',
        'Take an existing schema and find one impossible state it currently allows.',
      ],
      tags: ['schema', 'database', 'design', 'must-know'],
    },

    {
      slug: 'schema-keys-and-ids',
      title: 'Choosing primary keys',
      difficulty: 'MEDIUM',
      summary: 'Auto-increment, UUID or ULID — each leaks something, costs something, or breaks something. The choice is harder to reverse than most.',
      summaryHi: 'Auto-increment, UUID ya ULID — har ek kuch bata deta hai, kuch kharch karta hai, ya kuch todta hai. Ye chunaav zyadatar se kahin mushkil se palta hai.',
      content: `**Auto-increment integers (\`BIGSERIAL\`)**

- **Good:** small (8 bytes), fast to index, naturally ordered by creation, readable in logs
- **Bad:** **enumerable and guessable.** \`/orders/41\` tells anyone there are at least 41 orders, and invites them to try 42. It also leaks business volume — a competitor can sign up twice a month and measure your growth from the id gap.
- **Also bad:** ids collide when merging databases, and the client cannot generate one

**UUID v4 (random)**

- **Good:** unguessable, generated anywhere including on the client, no collisions when merging
- **Bad:** 16 bytes, and — the important one — **random order destroys index locality.** Every insert lands in a random place in the B-tree, causing page splits and a much larger index. On a write-heavy table this is a real, measurable cost.

**UUID v7 / ULID — the modern compromise**

Time-ordered but still unguessable. You get random-looking ids that **insert sequentially**, so index locality is preserved.

This is usually the right default for a new system: the security property of UUIDs without the write penalty.

**Natural keys — use with care**

Using \`email\` or an ISBN as the primary key seems tidy until the value changes. People change email addresses, countries change codes, "unique" identifiers turn out not to be. Then every foreign key referencing it must change too.

**The rule:** use a **surrogate** key (a meaningless id) as the primary key, and put a \`UNIQUE\` constraint on the natural key. You get both the stability and the guarantee.

**Composite keys** are correct for join tables — \`PRIMARY KEY (order_id, product_id)\` expresses "a product appears once per order" directly in the schema, which is better than a separate id plus a unique constraint.

**The public/internal split**

A common pattern, and worth knowing: keep a fast \`BIGSERIAL\` internally for joins, and expose a separate unguessable public id in URLs and APIs. You get index performance and no enumeration.

The cost is a second column, an extra index, and remembering which id you are holding — which is a real source of bugs, so name them clearly (\`id\` and \`public_id\`).

**Whatever you choose, decide early.** Changing a primary key type after there is data means rewriting every foreign key in every table that references it, and doing it without downtime is genuinely difficult.`,
      contentHi: `**Auto-increment integers (\`BIGSERIAL\`)**

- **Achha:** chhota (8 bytes), index karne mein tez, banne ke kram mein, logs mein padha ja sakta hai
- **Bura:** **gine ja sakte hain aur anuman layak hain.** \`/orders/41\` kisi ko bhi bata deta hai ki kam se kam 41 orders hain, aur 42 aazmane ka nyota deta hai. Ye business ka paimana bhi bata deta hai — pratispardhi mahine mein do baar sign up karke id ke antar se aapki growth naap sakta hai.
- **Ye bhi bura:** databases jodte waqt ids takraati hain, aur client ek bana nahi sakta

**UUID v4 (random)**

- **Achha:** anuman se bahar, kahin bhi bane, client par bhi, jodte waqt takraar nahi
- **Bura:** 16 bytes, aur — zaroori baat — **random kram index ki locality tod deta hai.** Har insert B-tree mein kisi bhi jagah girta hai, jisse page splits hote hain aur index kaafi bada ho jata hai. Write-heavy table par ye asli, naapa ja sakne wala kharch hai.

**UUID v7 / ULID — aaj ka beech ka rasta**

Samay ke kram mein par phir bhi anuman se bahar. Aapko random dikhne wale ids milte hain jo **kram se insert** hote hain, isliye index ki locality bachi rehti hai.

Naye system ke liye aam taur par yahi sahi default hai: UUID ka suraksha gun, bina write ki keemat ke.

**Natural keys — sambhal kar**

\`email\` ya ISBN ko primary key banana saaf lagta hai jab tak wo value badal na jaye. Log email badalte hain, desh code badalte hain, "unique" pehchaan unique nikalti hi nahi. Phir use reference karti har foreign key bhi badalni padti hai.

**Niyam:** primary key **surrogate** rakho (ek bemaani id), aur natural key par \`UNIQUE\` constraint lagao. Sthirta bhi milti hai aur guarantee bhi.

**Composite keys** join tables ke liye sahi hain — \`PRIMARY KEY (order_id, product_id)\` seedha schema mein kehta hai ki "ek product ek order mein ek baar aata hai", jo alag id aur unique constraint se behtar hai.

**Public/internal batwara**

Ek aam pattern, jaanne layak: joins ke liye andar tez \`BIGSERIAL\` rakho, aur URL aur API mein alag anuman-se-bahar public id dikhao. Index ka faayda bhi aur ginne ka rasta bhi band.

Keemat ek doosra column, ek extra index, aur ye yaad rakhna ki aapke haath mein kaunsi id hai — jo sach mein bug ki wajah banta hai, isliye naam saaf rakho (\`id\` aur \`public_id\`).

**Jo bhi chuno, jaldi chuno.** Data aane ke baad primary key ka type badalna matlab har us table ki har foreign key dobara likhna jo use reference karti hai, aur ise bina downtime ke karna sach mein mushkil hai.`,
      codeExample: `-- Modern default: time-ordered and unguessable
CREATE TABLE orders (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),   -- v7/ULID if available
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Natural key as a constraint, surrogate key as the identity.
-- Email changes; the id never does, so foreign keys stay stable.
CREATE TABLE users (
  id    BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE          -- guaranteed, but not the identity
);

-- Composite key states the rule directly: one product per order, once
CREATE TABLE order_items (
  order_id   BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  PRIMARY KEY (order_id, product_id)
);

-- The split: fast integer inside, unguessable id outside
CREATE TABLE invoices (
  id        BIGSERIAL PRIMARY KEY,                        -- joins use this
  public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()-- URLs use this
);`,
      commonMistakes: [
        'Sequential ids in public URLs, which leak record counts and invite enumeration.',
        'Random UUID v4 as the primary key on a write-heavy table, fragmenting the index for no security benefit over v7.',
        'Using email as a primary key, then discovering that people change their email.',
        'Deciding late — changing a key type after there is data means rewriting every referencing foreign key.',
      ],
      interviewQuestions: [
        'Trade-offs between auto-increment and UUID primary keys?',
        'Why does a random UUID hurt insert performance more than a sequential id?',
        'What is a surrogate key and why prefer it to a natural key?',
        'What does a sequential id in a URL leak?',
      ],
      practiceQuestions: [
        'Insert a million rows with BIGSERIAL and with UUID v4, and compare index size and insert time.',
        'Add a public_id to a table and migrate URLs to it without breaking existing links.',
      ],
      tags: ['schema', 'database', 'keys', 'must-know'],
    },

    {
      slug: 'schema-advanced-relational-patterns',
      title: 'Advanced relational patterns',
      difficulty: 'HARD',
      summary: 'Polymorphic associations, single-table inheritance, EAV and trees — the patterns for cases that do not fit, and what each one costs.',
      summaryHi: 'Polymorphic associations, single-table inheritance, EAV aur trees — un cases ke patterns jo seedhe nahi baithte, aur har ek ki keemat.',
      content: `**Polymorphic associations — "a comment belongs to a post *or* a photo"**

The tempting approach stores \`commentable_type\` and \`commentable_id\`. It works, and it **cannot have a foreign key**, because the target table varies. You have given up referential integrity — the database can no longer stop a comment pointing at a post that does not exist.

Better alternatives:

- **Separate tables** — \`post_comments\`, \`photo_comments\`. More tables, full integrity, and honestly fine when there are two or three.
- **Exclusive arc** — one nullable FK per target plus a \`CHECK\` that exactly one is set. Keeps integrity; gets awkward past four targets.
- **A shared parent** — a \`commentable\` table that posts and photos both reference. Correct, and one more join.

**Single-table inheritance (STI)** — all subtypes in one table with a \`type\` column and columns that only apply to some rows.

Cheap and quick. The cost is nullable columns everywhere and no way to make a column required for only one subtype — the database cannot express "\`salary\` is required when \`type = 'employee'\`" without a conditional CHECK, and past a couple of subtypes that becomes unreadable.

**Class-table inheritance** — a shared base table plus one table per subtype. Clean and fully constrained, at the price of a join per read.

**EAV (entity-attribute-value)** — a table of \`entity, attribute, value\` rows for fully dynamic fields.

Maximum flexibility, and you have effectively rebuilt a database inside your database: no types, no constraints, and every read becomes a pivot. Use JSONB instead — it is the modern answer to the same problem and at least it can be indexed. **EAV is almost always the wrong choice**, and it is worth being able to say why.

**Trees and hierarchies** — categories, org charts, comment threads.

| Pattern | Read a subtree | Move a node |
|---|---|---|
| **Adjacency list** (\`parent_id\`) | recursive CTE | trivial |
| **Materialised path** (\`/1/4/9/\`) | one \`LIKE\` — fast | rewrite descendants |
| **Nested sets** | very fast | expensive |
| **Closure table** | fast | moderate |

Start with an adjacency list plus \`WITH RECURSIVE\`. It is simple, and Postgres handles it well. Reach for a closure table only when subtree reads are genuinely hot.

**The judgement running through all of these:** each pattern trades **integrity** for **flexibility**. The database can only enforce what you let it see, so every time you make the schema more dynamic, you move a guarantee from the database into your application — where it will eventually be forgotten.`,
      contentHi: `**Polymorphic associations — "comment ya to post ka hai *ya* photo ka"**

Lubhavana tareeka \`commentable_type\` aur \`commentable_id\` rakhta hai. Ye chalta hai, aur ismein **foreign key ho hi nahi sakti**, kyunki target table badalti hai. Aapne referential integrity chhod di — database ab us comment ko nahi rok sakta jo aise post par ishara kare jo hai hi nahi.

Behtar vikalp:

- **Alag tables** — \`post_comments\`, \`photo_comments\`. Zyada tables, poori integrity, aur do-teen ho to imaandari se theek hai.
- **Exclusive arc** — har target ke liye ek nullable FK aur ek \`CHECK\` ki theek ek set ho. Integrity bachti hai; chaar se aage ajeeb ho jata hai.
- **Saanjha parent** — ek \`commentable\` table jise posts aur photos dono reference karein. Sahi, aur ek join zyada.

**Single-table inheritance (STI)** — saare subtypes ek table mein, ek \`type\` column ke saath aur aise columns jo kuch hi rows par lagte hain.

Sasta aur jaldi. Keemat hai har jagah nullable columns aur ye ki kisi column ko sirf ek subtype ke liye zaroori banaya hi nahi ja sakta — database "\`salary\` tab zaroori hai jab \`type = 'employee'\`" ko bina conditional CHECK ke keh hi nahi sakta, aur do-teen subtypes ke baad wo padha nahi jata.

**Class-table inheritance** — ek saanjhi base table aur har subtype ki apni table. Saaf aur poori tarah constrained, keemat mein har read par ek join.

**EAV (entity-attribute-value)** — poori tarah dynamic fields ke liye \`entity, attribute, value\` rows wali table.

Sabse zyada lachak, aur aapne asal mein apne database ke andar ek database bana liya: na types, na constraints, aur har read ek pivot ban jati hai. Iski jagah JSONB use karo — wo usi samasya ka aaj ka jawab hai aur kam se kam index to ho sakta hai. **EAV lagbhag hamesha galat chunaav hai**, aur ye bata paana ki kyun, kaam ka hai.

**Trees aur hierarchies** — categories, org charts, comment threads.

| Pattern | Subtree padhna | Node hilana |
|---|---|---|
| **Adjacency list** (\`parent_id\`) | recursive CTE | bahut aasan |
| **Materialised path** (\`/1/4/9/\`) | ek \`LIKE\` — tez | vanshaj dobara likhne padte hain |
| **Nested sets** | bahut tez | mehnga |
| **Closure table** | tez | theek-thaak |

Adjacency list aur \`WITH RECURSIVE\` se shuru karo. Ye simple hai, aur Postgres ise achhe se sambhalta hai. Closure table tabhi uthao jab subtree reads sach mein garam hon.

**In sabme chalta hua faisla:** har pattern **integrity** ko **lachak** ke badle deta hai. Database sirf wahi lagu kar sakta hai jo aap use dikhate ho, isliye jab bhi aap schema ko zyada dynamic banate ho, ek guarantee database se nikal kar aapki application mein aa jati hai — jahan wo kabhi na kabhi bhula di jayegi.`,
      codeExample: `-- Exclusive arc: polymorphism WITHOUT losing foreign keys
CREATE TABLE comments (
  id       BIGSERIAL PRIMARY KEY,
  body     TEXT NOT NULL,
  post_id  BIGINT REFERENCES posts(id)  ON DELETE CASCADE,
  photo_id BIGINT REFERENCES photos(id) ON DELETE CASCADE,

  -- exactly one parent, enforced by the database
  CHECK (num_nonnulls(post_id, photo_id) = 1)
);

-- Trees: adjacency list is the right default
CREATE TABLE categories (
  id        BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name      TEXT NOT NULL
);

-- Read a whole subtree with a recursive CTE
WITH RECURSIVE subtree AS (
  SELECT id, parent_id, name, 1 AS depth
  FROM categories WHERE id = 4
  UNION ALL
  SELECT c.id, c.parent_id, c.name, s.depth + 1
  FROM categories c JOIN subtree s ON c.parent_id = s.id
)
SELECT * FROM subtree ORDER BY depth;`,
      commonMistakes: [
        'Polymorphic type+id columns, which silently give up referential integrity — nothing stops a dangling reference.',
        'Reaching for EAV when JSONB would give the same flexibility and can at least be indexed.',
        'Single-table inheritance past two or three subtypes, leaving a table of mostly-null columns nobody can constrain.',
        'Nested sets for a tree that changes often — reads are fast and every move rewrites large parts of the table.',
      ],
      interviewQuestions: [
        'What is a polymorphic association and what do you give up by using one?',
        'When is single-table inheritance acceptable and when does it break down?',
        'Why is EAV usually the wrong answer, and what replaced it?',
        'Compare adjacency list, materialised path and closure table for storing a tree.',
      ],
      practiceQuestions: [
        'Model comments that can belong to posts or photos, keeping foreign keys intact.',
        'Store a category tree and write a recursive CTE returning a full subtree.',
      ],
      tags: ['schema', 'database', 'patterns', 'advanced'],
    },

    {
      slug: 'schema-history-and-audit',
      title: 'History, audit trails and soft deletes',
      difficulty: 'HARD',
      summary: 'Most business questions are about the past. Deciding early whether you keep history is far cheaper than reconstructing it later.',
      summaryHi: 'Zyadatar business sawaal ateet ke baare mein hote hain. Itihaas rakhna hai ya nahi, ye jaldi tay karna use baad mein banane se kahin sasta hai.',
      content: `A plain \`UPDATE\` destroys information. Once you overwrite a status, *"when did this order ship?"* and *"who changed the price?"* become unanswerable — and someone will ask both.

**Four approaches, increasing in power and cost**

**1. Soft delete** — a \`deleted_at\` column instead of removing the row.

Simple and recoverable. The cost is that **every** query must remember \`WHERE deleted_at IS NULL\`, and forgetting it in one place makes deleted records reappear. Use a view or a query-builder default rather than relying on discipline. Note it also breaks \`UNIQUE\` constraints — a soft-deleted user still occupies their email address, so you need a partial unique index.

**2. Audit log** — an append-only table recording who changed what, when.

Answers "who did this" without complicating the main table. A database trigger is more reliable than application code, because it catches changes made by scripts and consoles too. Keep it append-only: an audit log that can be edited proves nothing.

**3. Versioned rows (SCD Type 2)** — every version is a row, with \`valid_from\` and \`valid_to\`.

Lets you reconstruct the state at any point in time — *"what was this price on 1 March?"* The cost is that every query now needs a validity filter, and "the current row" requires a partial index to find quickly.

**4. Event sourcing** — store the events, derive the state.

The events are the truth; the current state is a projection you can rebuild. Complete history, time travel, and full auditability.

The cost is high and often underestimated: no simple \`UPDATE\`, projections to maintain, event schema versioning forever, and every developer needing to understand the model. **It is right for genuinely event-shaped domains** — ledgers, order lifecycles — and a large mistake for a CRUD application.

**The practical middle ground**

Most applications want: soft delete on things users can restore, an audit log on anything sensitive, and versioned rows only where the business genuinely asks about the past — prices, contracts, permissions.

**Two things worth knowing regardless**

**Immutable records are not denormalisation.** An invoice must store the customer's name, address and the price *at the time of sale*. If it referenced current values, reprinting a two-year-old invoice would show today's address — which is wrong, and in many jurisdictions illegal.

**Retention and privacy pull against history.** A user asking for deletion conflicts with an audit trail that records their actions. The usual resolution is anonymising the actor while keeping the event, so the history stays intact and the person does not.`,
      contentHi: `Simple \`UPDATE\` jaankari mita deta hai. Status overwrite hote hi *"ye order kab bheja gaya?"* aur *"daam kisne badla?"* ke jawab nahi bachte — aur koi na koi dono poochhega.

**Chaar tareeke, badhti taakat aur badhti keemat ke saath**

**1. Soft delete** — row hataane ki jagah \`deleted_at\` column.

Simple aur wapas laane layak. Keemat ye ki **har** query ko \`WHERE deleted_at IS NULL\` yaad rakhna padta hai, aur ek jagah bhoolne par mit i hui records wapas dikhne lagti hain. Anushasan par nirbhar rehne ki jagah view ya query-builder ka default use karo. Dhyan do ye \`UNIQUE\` constraints bhi todta hai — soft-delete kiya user ab bhi apna email ghere baitha hai, isliye partial unique index chahiye.

**2. Audit log** — sirf jodne wali table jo likhti hai ki kisne kya, kab badla.

"Ye kisne kiya" ka jawab deti hai bina main table ko uljhaye. Database trigger application code se zyada bharosemand hai, kyunki wo scripts aur console se hue badlav bhi pakadta hai. Ise sirf jodne layak rakho: jis audit log ko badla ja sake wo kuch sabit nahi karta.

**3. Versioned rows (SCD Type 2)** — har version ek row, \`valid_from\` aur \`valid_to\` ke saath.

Isse kisi bhi samay ki haalat dobara banayi ja sakti hai — *"1 March ko is cheez ka daam kya tha?"* Keemat ye ki ab har query mein validity ka filter chahiye, aur "maujooda row" jaldi dhoondhne ke liye partial index.

**4. Event sourcing** — events jama karo, state nikalo.

Events hi sach hain; maujooda state ek projection hai jise dobara banaya ja sakta hai. Poora itihaas, samay mein peeche jaana, aur poori jawabdehi.

Keemat zyada hai aur aksar kam aanki jati hai: simple \`UPDATE\` nahi, projections sambhalni padti hain, event schema ka versioning hamesha ke liye, aur har developer ko ye model samajhna padta hai. **Ye un domains ke liye sahi hai jo sach mein event jaise hain** — ledgers, order lifecycle — aur CRUD application ke liye badi galti.

**Practical beech ka rasta**

Zyadatar applications ko chahiye: jinhe users wapas la sakte hain un par soft delete, sanvedansheel har cheez par audit log, aur versioned rows sirf wahan jahan business sach mein ateet ke baare mein poochhta hai — daam, contracts, permissions.

**Do baatein jo har haal mein jaanne layak hain**

**Na badalne wale records denormalisation nahi hain.** Invoice mein customer ka naam, pata aur daam *bikri ke waqt ka* hona chahiye. Wo maujooda values reference karta, to do saal purana invoice dobara chhaapne par aaj ka pata dikhta — jo galat hai, aur kai jagah gair-kanooni.

**Retention aur privacy itihaas ke khilaf khinchte hain.** Mitane ki maang karta user us audit trail se takraata hai jo uske kaam likhti hai. Aam hal ye hai ki karne wale ko anonymise kar do aur event rakh lo, taaki itihaas bacha rahe aur insaan nahi.`,
      codeExample: `-- Soft delete breaks UNIQUE: a deleted user still holds their email.
-- A partial index applies the constraint only to live rows.
CREATE TABLE users (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX users_email_live
  ON users (email) WHERE deleted_at IS NULL;

-- Audit via trigger, so console and script changes are captured too
CREATE TABLE audit_log (
  id         BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id  TEXT NOT NULL,
  action     TEXT NOT NULL,
  old_data   JSONB,
  new_data   JSONB,
  actor_id   BIGINT,
  at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Versioned rows: reconstruct any point in time
CREATE TABLE product_prices (
  product_id BIGINT NOT NULL REFERENCES products(id),
  price      NUMERIC(10,2) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_to   TIMESTAMPTZ                          -- NULL = current
);
-- Finding "the current price" needs its own index
CREATE UNIQUE INDEX product_price_current
  ON product_prices (product_id) WHERE valid_to IS NULL;

-- "What was the price on 1 March?"
SELECT price FROM product_prices
WHERE product_id = 7
  AND valid_from <= '2026-03-01'
  AND (valid_to IS NULL OR valid_to > '2026-03-01');`,
      commonMistakes: [
        'Soft delete without a partial unique index, so a deleted user permanently blocks their own email address.',
        'Forgetting `WHERE deleted_at IS NULL` in one query, making deleted records reappear in one screen.',
        'Choosing event sourcing for a CRUD application, paying a large permanent cost for history nobody asked for.',
        'Referencing current values from historical records, so reprinting an old invoice shows today\'s prices.',
      ],
      interviewQuestions: [
        'What breaks when you add soft delete to a table with a unique constraint?',
        'When is event sourcing the right choice, and when is it a mistake?',
        'How would you answer "what was this product\'s price six months ago"?',
        'How do you reconcile an audit trail with a deletion request?',
      ],
      practiceQuestions: [
        'Add soft delete to a table with a unique email and fix the constraint correctly.',
        'Design versioned pricing and write the query for a price on a given date.',
      ],
      tags: ['schema', 'database', 'audit', 'advanced'],
    },

    {
      slug: 'schema-multi-tenancy',
      title: 'Multi-tenancy',
      difficulty: 'HARD',
      summary: 'One application, many customers whose data must never mix. Three approaches, and the one bug that ends the company.',
      summaryHi: 'Ek application, kai customers jinka data kabhi milna nahi chahiye. Teen tareeke, aur wo ek bug jo company khatam kar deta hai.',
      content: `**Three models**

**1. Shared database, shared schema** — every table has a \`tenant_id\`.

- **Cheapest** to run and to operate. One database, one migration, one connection pool.
- **Riskiest.** One forgotten \`WHERE tenant_id = ?\` shows one customer another customer's data. That is not a bug you recover from reputationally.
- **Right for:** most SaaS, especially with many small tenants.

**2. Shared database, schema per tenant** — one Postgres schema each.

- Stronger isolation, still one database.
- Migrations now run N times, and N grows. At a few hundred tenants this becomes an operational burden; at a few thousand it is unmanageable.

**3. Database per tenant**

- **Strongest isolation.** Easy per-tenant backup, restore and data residency, and a noisy tenant cannot affect others.
- **Most expensive** in cost and operations. Connection pooling gets genuinely hard.
- **Right for:** few large enterprise customers, or a regulatory requirement.

**The failure that matters more than the rest**

With a shared schema, **every single query must filter by tenant.** One missed filter in one endpoint is a cross-tenant data leak, and it is exactly the kind of thing that passes review because the query looks correct.

Do not rely on remembering. Enforce it:

- **Row-Level Security** in Postgres — the database itself refuses to return other tenants' rows, regardless of what the query says. This is the strongest available answer, and it means a forgotten filter returns nothing rather than everything.
- A **repository layer** that requires a tenant context, so a query without one does not compile.
- **Never let \`tenant_id\` come from the request body** — derive it from the authenticated session. Otherwise a user simply sends a different one.

**Other things that bite**

- **Noisy neighbours.** One tenant running a huge report slows everyone. Per-tenant rate limits and query timeouts.
- **Per-tenant customisation.** Custom fields per tenant push you toward JSONB — which works, and gives up constraints.
- **Tenant-scoped uniqueness.** An email unique *per tenant* rather than globally means \`UNIQUE (tenant_id, email)\`, not \`UNIQUE (email)\`. Getting this wrong stops two tenants having the same customer.
- **Onboarding and offboarding.** Creating a tenant and *deleting* one both need to be routine. Deletion in a shared schema means finding every table with a \`tenant_id\`.

**The pragmatic default:** shared schema with Row-Level Security, moving heavy or regulated tenants to their own database when there is a specific reason. Start simple, and make the isolation something the database enforces rather than something you remember.`,
      contentHi: `**Teen model**

**1. Saanjha database, saanjha schema** — har table mein \`tenant_id\`.

- **Sabse sasta** chalane aur sambhalne mein. Ek database, ek migration, ek connection pool.
- **Sabse khatarnaak.** Ek bhoola hua \`WHERE tenant_id = ?\` ek customer ko doosre ka data dikha deta hai. Saakh ke hisaab se ye wo bug hai jisse ubra nahi jata.
- **Kiske liye sahi:** zyadatar SaaS, khaaskar jab bahut se chhote tenants hon.

**2. Saanjha database, har tenant ka apna schema** — har ek ka ek Postgres schema.

- Behtar alagav, phir bhi ek database.
- Migrations ab N baar chalti hain, aur N badhta hai. Kuch sau tenants par ye bojh ban jata hai; kuch hazaar par sambhalta hi nahi.

**3. Har tenant ka apna database**

- **Sabse mazboot alagav.** Har tenant ka backup, restore aur data residency aasan, aur ek shor machaata tenant baaki ko chhu nahi sakta.
- **Sabse mehnga** kharch aur operations dono mein. Connection pooling sach mein mushkil ho jati hai.
- **Kiske liye sahi:** kuch bade enterprise customers, ya koi kanooni zaroorat.

**Wo nakaami jo baaki sabse zyada matter karti hai**

Saanjhe schema mein **har ek query ko tenant se filter karna hoga.** Ek endpoint mein ek chhoota filter cross-tenant data leak hai, aur ye theek wo cheez hai jo review mein nikal jati hai kyunki query dekhne mein sahi lagti hai.

Yaad rakhne par mat chhodo. Lagu karo:

- Postgres mein **Row-Level Security** — database khud doosre tenants ki rows dena mana kar deta hai, chahe query kuch bhi kahe. Ye sabse mazboot uplabdh jawab hai, aur iska matlab hai ki bhoola hua filter sab kuch nahi, kuch bhi nahi lauta ta.
- Aisi **repository parat** jise tenant context chahiye hi, taaki uske bina query compile hi na ho.
- **\`tenant_id\` ko request body se kabhi mat lo** — use authenticated session se nikalo. Warna user bas doosra bhej dega.

**Aur bhi cheezein jo kaat ti hain**

- **Shor machaate padosi.** Ek tenant ki badi report sabko dheema kar deti hai. Har tenant ke liye rate limits aur query timeouts.
- **Har tenant ki apni customisation.** Tenant-wise custom fields aapko JSONB ki taraf le jate hain — jo chalta hai, aur constraints chhod deta hai.
- **Tenant ke andar uniqueness.** Email *har tenant mein* unique ho, poori duniya mein nahi, to \`UNIQUE (tenant_id, email)\` chahiye, \`UNIQUE (email)\` nahi. Ise galat karne se do tenants ke paas ek hi customer nahi ho sakta.
- **Onboarding aur offboarding.** Tenant banana aur *hatana* dono rozmarra ka kaam hona chahiye. Saanjhe schema mein hatane ka matlab hai har wo table dhoondhna jisme \`tenant_id\` hai.

**Practical default:** Row-Level Security ke saath saanjha schema, aur khaas wajah hone par bhaari ya niyamon se bandhe tenants ko unka apna database. Simple se shuru karo, aur alagav ko wo cheez banao jise database lagu kare, na ki wo jo aapko yaad rakhni pade.`,
      codeExample: `-- Shared schema: the database enforces isolation, not your memory
CREATE TABLE orders (
  id        BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  total     NUMERIC(10,2) NOT NULL
);

-- Uniqueness is per tenant, not global — otherwise two customers
-- can never share an email address across different tenants
CREATE UNIQUE INDEX users_email_per_tenant ON users (tenant_id, email);

-- Row-Level Security: a forgotten WHERE returns NOTHING, not everything
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::BIGINT);

-- Set once per request, from the SESSION — never from the request body
-- await prisma.$executeRaw\`SELECT set_config('app.tenant_id', \${session.tenantId}, true)\`;
--
-- Now this query is safe even though it never mentions tenant_id:
--   SELECT * FROM orders WHERE id = 42;
-- It returns nothing if order 42 belongs to another tenant.`,
      commonMistakes: [
        'Relying on every developer remembering the tenant filter, instead of enforcing it in the database.',
        'Taking tenant_id from the request body, letting a user simply send someone else\'s.',
        'Global unique constraints where uniqueness should be per tenant, so two tenants cannot have the same customer email.',
        'Schema-per-tenant at scale, where every migration runs hundreds of times and one failure leaves tenants inconsistent.',
      ],
      interviewQuestions: [
        'Compare the three multi-tenancy models and when each is appropriate.',
        'How do you guarantee a query cannot return another tenant\'s data?',
        'What is Row-Level Security and what failure does it convert into a safe one?',
        'Why must tenant_id come from the session rather than the request?',
      ],
      practiceQuestions: [
        'Add RLS to a table and verify that a query without a tenant filter returns nothing.',
        'Write the deletion routine for offboarding a tenant from a shared schema.',
      ],
      tags: ['schema', 'multi-tenancy', 'security', 'advanced'],
    },

    {
      slug: 'schema-nosql-modelling',
      title: 'Modelling for document databases',
      difficulty: 'MEDIUM',
      summary: 'Relational modelling starts from the data. Document modelling starts from the queries — and the two produce different, both-correct answers.',
      summaryHi: 'Relational modelling data se shuru hoti hai. Document modelling queries se — aur dono alag, dono sahi jawab dete hain.',
      content: `**The inversion**

In SQL you normalise first — model the data properly — and then work out how to query it. Joins make that affordable.

In a document database there are no cheap joins, so you go the other way: **look at your queries first, then shape the documents to serve them.** Duplication is a legitimate tool rather than a mistake.

Both are correct. They are different trade-offs, not different skill levels.

**Embed or reference**

**Embed** when the child is always read *with* the parent, is bounded, and does not change independently. An address inside a user. Line items inside an order.

**Reference** when the child is large, shared between parents, or unbounded. A user's posts. A product referenced by thousands of orders.

**Say it:** *read together, store together.*

**The hard limit that decides many cases**

A document is capped at **16 MB**, and an update rewrites the document. Embedding comments in a post looks fine at five and is catastrophic at fifty thousand — long before the cap, every update is moving a large document.

**Never embed an unbounded array.** That single rule prevents most document-modelling disasters.

**The extended reference pattern**

The pragmatic middle: reference the child, but copy the two or three fields you always display.

An order stores \`product_id\` *and* \`product_name\` and \`price\`. You avoid a lookup on every render, and — as in SQL — storing the price at the time of sale is correct rather than merely faster.

The cost is that duplicated display fields can go stale. Decide deliberately: a product *name* on a historical order arguably **should** be frozen. A user's current avatar copied into a thousand comments should not.

**The bucket pattern** — for time-series and high-volume writes, group many readings into one document per hour or per day rather than one document per event. Far fewer documents, far smaller indexes.

**Schema design still exists**

"Schemaless" means the database does not enforce a schema. Your application still has one — it is just written in your code instead. That is why Mongoose exists, and why validation at the boundary matters just as much here as in SQL.

**When to admit it should have been relational**

If you find yourself doing \`$lookup\` everywhere, needing multi-document transactions constantly, or hand-maintaining consistency between duplicated copies — the data was relational. That is a schema smell, not a database limitation, and recognising it early is worth far more than defending the original choice.`,
      contentHi: `**Ulta tareeka**

SQL mein aap pehle normalise karte ho — data theek se model karte ho — aur phir sochte ho ki query kaise karein. Joins ise sasta bana dete hain.

Document database mein saste joins hain hi nahi, isliye aap ulta chalte ho: **pehle apni queries dekho, phir documents ko unke hisaab se shakal do.** Duplication yahan jayaz auzaar hai, galti nahi.

Dono sahi hain. Ye alag saude hain, alag darje nahi.

**Embed karein ya reference**

**Embed** tab jab bachcha hamesha parent ke *saath* padha jaye, uski seema ho, aur wo alag se na badle. User ke andar pata. Order ke andar line items.

**Reference** tab jab bachcha bada ho, kai parents mein saanjha ho, ya uski koi seema na ho. User ke posts. Wo product jise hazaaron orders reference karte hain.

**Bolo:** *saath padhte ho to saath rakho.*

**Wo pakki seema jo kai faisle tay kar deti hai**

Document ki had **16 MB** hai, aur update poora document dobara likhta hai. Post mein comments embed karna paanch par theek lagta hai aur pachas hazaar par tabaahi hai — had se bahut pehle hi har update ek bada document hila raha hota hai.

**Bina seema wali array kabhi embed mat karo.** Yahi ek niyam document-modelling ki zyadatar tabaahiyan rok deta hai.

**Extended reference pattern**

Practical beech ka rasta: bachche ko reference karo, par wo do-teen fields copy kar lo jo hamesha dikhate ho.

Order \`product_id\` *aur* \`product_name\` aur \`price\` rakhta hai. Har render par lookup bach jati hai, aur — SQL ki tarah — bikri ke waqt ka daam rakhna sahi hai, sirf tez nahi.

Keemat ye ki copy kiye display fields purane ho sakte hain. Soch kar tay karo: purane order par product ka *naam* shayad jama hona hi **chahiye**. User ka maujooda avatar hazaar comments mein copy nahi hona chahiye.

**Bucket pattern** — time-series aur bahut zyada writes ke liye, har event ka ek document banane ki jagah kai readings ko ghante ya din ke ek document mein jodo. Bahut kam documents, bahut chhote indexes.

**Schema design ab bhi hai**

"Schemaless" ka matlab hai database schema lagu nahi karta. Aapki application ka schema phir bhi hai — bas wo aapke code mein likha hai. Isiliye Mongoose hai, aur isiliye boundary par validation yahan bhi utni hi zaroori hai jitni SQL mein.

**Kab maan lena chahiye ki ye relational hona chahiye tha**

Agar aap har jagah \`$lookup\` kar rahe ho, baar-baar multi-document transactions chahiye, ya copy kiye hisson ke beech consistency haath se sambhal rahe ho — to data relational tha. Ye schema ki badboo hai, database ki kami nahi, aur ise jaldi pehchan lena pehle chunaav ko bachane se kahin zyada keemti hai.`,
      codeExample: `// Embed: bounded, always read with the parent, does not change alone
{
  _id: ObjectId("..."),
  email: "asha@example.com",
  address: { line1: "12 MG Road", city: "Pune", pin: "411001" },   // embed
  // comments: [...]   ← NEVER. Unbounded, and 16 MB is a hard cap.
}

// Extended reference: reference the product, copy what you always show.
// The price is frozen deliberately — a later price change must not
// rewrite this order's history.
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  items: [
    { productId: ObjectId("..."), name: "Chair", unitPrice: 2499, qty: 1 },
  ],
  total: 2499,
  placedAt: ISODate("2026-08-22T10:00:00Z"),
}

// Bucket pattern: one document per hour, not per reading
{
  sensorId: "s-1",
  hour: ISODate("2026-08-22T10:00:00Z"),
  readings: [ { t: 0, v: 21.4 }, { t: 60, v: 21.6 } ],   // 60 per document
  count: 60,
}`,
      commonMistakes: [
        'Embedding an unbounded array — it looks fine in development and dies in production well before the 16 MB cap.',
        'Copying mutable display fields everywhere and then hand-maintaining consistency across thousands of documents.',
        'Normalising a document database like a relational one, then using $lookup for every read.',
        'Treating "schemaless" as "no schema" — the schema still exists, it is just unenforced.',
      ],
      interviewQuestions: [
        'How do you decide between embedding and referencing?',
        'Why does the 16 MB document limit matter before you reach it?',
        'What is the extended reference pattern and what does it cost?',
        'What signs suggest your document model should have been relational?',
      ],
      practiceQuestions: [
        'Model a blog with posts and comments for a document database, and justify each embed or reference.',
        'Take a relational schema and redesign it around three specific queries.',
      ],
      tags: ['schema', 'mongodb', 'nosql', 'design'],
    },
  ],
};
