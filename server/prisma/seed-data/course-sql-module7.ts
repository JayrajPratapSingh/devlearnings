/**
 * Databases Complete Course — Module 7: Data Modeling & Normalization, lessons 1-3.
 *
 * Lesson 1: Entities, keys & ER modeling — entities/attributes/relationships, natural
 *           vs surrogate vs composite keys, choosing a primary key, ER diagram basics.
 * Lesson 2: Foreign keys & referential actions — the FK constraint, ON DELETE/UPDATE
 *           CASCADE/RESTRICT/SET NULL/NO ACTION, orphan rows, why FKs matter even with
 *           an ORM.
 * Lesson 3: First & Second Normal Form — 1NF (atomic values, no repeating groups), 2NF
 *           (no partial dependency on a composite key), functional dependencies, and
 *           the insert/update/delete anomalies each form removes.
 *
 * Examples use CREATE TABLE + INSERT + a query/anomaly, verified against real
 * PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 7
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_7: CourseLesson[] = [
  {
    slug: 'sql-entities-keys-and-er-modeling',
    title: 'Entities, Keys & ER Modeling',
    titleHi: 'Entities, Keys Aur ER Modeling',
    description: 'Data modeling starts before a single `CREATE TABLE`: identify the entities (the "things" you track), their attributes, and the relationships between them. Then choose a primary key for each entity — natural, surrogate, or composite — a decision that shapes every join you will ever write against that table.',
    descriptionHi: 'Data modeling ek bhi `CREATE TABLE` se pehle shuru hoती hai: entities (wo "cheezें" jo aap track karte ho), unke attributes, aur unke beech relationships identify karo. Phir har entity ke liye ek primary key chuno — natural, surrogate, ya composite — ek decision jo us table ke against aap jitne bhi joins likhoge unhe shape karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Designing a filing system for a school before you buy a single folder.** Before you decide what goes on each folder\'s label, you first work out *what kinds of things* the school needs to track — students, teachers, courses, classrooms — those are your **entities**. For each kind, you list the facts worth recording — a student has a name, a date of birth, an enrollment year; those are **attributes**. Then you notice that these things connect to each other: a student *takes* a course, a teacher *teaches* a course, a course *happens in* a classroom — those connections are **relationships**. Only after all of that do you ask the practical filing question: "what single fact will I write on the folder\'s label so I can always find the *right* folder, never two folders for the same student, never confusion between two Adas?" That label is the **primary key** — a student ID number stamped on enrollment (a **surrogate** key, invented for the purpose) is more reliable than the student\'s name (a **natural** key, which two students might share) or their national ID (natural, but the school may never see it and it changes format across countries).',
      hi: '**Ek school ke liye ek filing system design karna ek bhi folder khareedne se pehle.** Ye decide karne se pehle ki har folder ke label par kya jaega, aap pehle ye pata karte ho ki school ko *kis tarah ki cheezें* track karni hain — students, teachers, courses, classrooms — wo aapki **entities** hain. Har type ke liye, aap dhyan dene layak facts list karte ho — ek student ka ek naam hai, ek date of birth, ek enrollment year; wo **attributes** hain. Phir aap notice karte ho ki ye cheezें ek doosre se connect hoती hain: ek student ek course *leta* hai, ek teacher ek course *padhाता* hai — wo connections **relationships** hain. Sab kuch ke baad hi aap practical filing sawaal poochте ho: "main folder ke label par kaunसा single fact likhूं taaki main hamesha *sahi* folder dhoond sakूं?" Wo label **primary key** hai — enrollment par stamp kiya ek student ID number (ek **surrogate** key) student ke naam (ek **natural** key, jise do students share kar sakते hain) se zyada reliable hai.',
    },

    simple: `**Three modeling concepts, before any SQL**

\`\`\`
ENTITY       -- a "thing" worth tracking: Student, Course, Teacher, Classroom
ATTRIBUTE    -- a fact about an entity: Student.name, Student.enrolled_on
RELATIONSHIP -- how entities connect: Student TAKES Course, Teacher TEACHES Course
\`\`\`

Each entity usually becomes a table; each attribute a column; each relationship a foreign key (or a junction table — Lesson 5).

**Three kinds of primary key**

\`\`\`sql
-- NATURAL key: a real-world attribute that happens to be unique
CREATE TABLE country (iso_code char(2) PRIMARY KEY, name text);   -- 'US', 'IN'

-- SURROGATE key: a meaningless id invented just to identify rows
CREATE TABLE customer (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text);

-- COMPOSITE key: two or more columns together are the identifier
CREATE TABLE enrollment (student_id int, course_id int, grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

**Why surrogate keys are the common default**

\`\`\`
natural key risk: the "unique" real-world fact turns out not to be
  (two customers share an email typo; a country code gets reassigned)
surrogate key: NEVER changes, NEVER collides, joins are a plain integer/UUID compare
\`\`\`

**A primary key must be**

\`\`\`
UNIQUE       -- no two rows share it
NOT NULL     -- every row has one
STABLE       -- it should not need to change after the row is created
MINIMAL      -- no more columns than necessary to guarantee uniqueness
\`\`\`

**ER diagram shorthand (Module 7 uses this notation throughout)**

\`\`\`
Student ---< TAKES >--- Course      -- many-to-many (Lesson 5)
Teacher ---<  TEACHES  --- Course   -- one-to-many: one teacher, many courses
Employee ---< REPORTS_TO --- Employee  -- self-referencing (Lesson 5)
\`\`\``,

    simpleHi: `**Teen modeling concepts, kisi bhi SQL se pehle**

\`\`\`
ENTITY       -- ek "cheez" jo track karne layak hai: Student, Course, Teacher
ATTRIBUTE    -- entity ke baare mein ek fact: Student.name, Student.enrolled_on
RELATIONSHIP -- entities kaise connect hoती hain: Student TAKES Course
\`\`\`

Har entity aksar ek table ban jaता hai; har attribute ek column; har relationship ek foreign key (ya ek junction table — Lesson 5).

**Teen tarah ki primary key**

\`\`\`sql
-- NATURAL key: ek real-world attribute jo unique nikалती hai
CREATE TABLE country (iso_code char(2) PRIMARY KEY, name text);   -- 'US', 'IN'

-- SURROGATE key: rows identify karne ke liye invent kiya ek meaningless id
CREATE TABLE customer (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text);

-- COMPOSITE key: do ya zyada columns milке identifier hain
CREATE TABLE enrollment (student_id int, course_id int, grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

**Surrogate keys common default kyun hain**

\`\`\`
natural key risk: "unique" real-world fact nikлता hai ki hai hi nahi
surrogate key: KABHI nahi badalta, KABHI collide nahi karta
\`\`\`

**Ek primary key ko hona chahिए**

\`\`\`
UNIQUE       -- koi do rows ise share na karें
NOT NULL     -- har row ke paas ek ho
STABLE       -- row create hone ke baad badalna na pade
MINIMAL      -- uniqueness guarantee karne ke liye zaroorat se zyada columns nahi
\`\`\`

**ER diagram shorthand (Module 7 mein istemal)**

\`\`\`
Student ---< TAKES >--- Course      -- many-to-many (Lesson 5)
Teacher ---<  TEACHES  --- Course   -- one-to-many
Employee ---< REPORTS_TO --- Employee  -- self-referencing (Lesson 5)
\`\`\``,

    content: `## Entities, attributes, relationships

**Data modeling** is the step before schema design: deciding *what* you are tracking, before deciding *how* to store it in tables. Three vocabulary words carry the whole discipline:

- **Entity** — a distinct kind of thing worth tracking on its own: a \`Student\`, a \`Course\`, an \`Order\`, a \`Product\`. Usually becomes a table.
- **Attribute** — a fact about one entity: a \`Student\`'s \`name\`, \`date_of_birth\`, \`enrolled_on\`. Usually becomes a column.
- **Relationship** — how two entities connect: a \`Student\` **TAKES** a \`Course\`; an \`Order\` **BELONGS TO** a \`Customer\`. Usually becomes a foreign key (one-to-many) or a junction table (many-to-many — Lesson 5).

An **entity-relationship (ER) diagram** is just a picture of these three things: boxes for entities, lines for relationships, and a mark on each line end for **cardinality** — "one" or "many". Sketching this before writing DDL catches design mistakes on paper, where they cost nothing, rather than in a migration, where they cost a lot.

## Choosing a primary key

Every table needs exactly one **primary key**: a column (or set of columns) that uniquely, permanently identifies each row. Three flavours:

### Natural key

A real-world attribute that happens to be unique: an ISO country code, an email address, a national tax ID, a product SKU.

- **Pro:** meaningful on its own; no extra column; a lookup by the natural key needs no join.
- **Con:** real-world "uniqueness" often turns out to be an assumption, not a guarantee — emails get typo'd and reused, SKUs get reassigned after a product is discontinued, people share the same name. If the assumption breaks, the primary key of every dependent row is wrong.

### Surrogate key

A value invented purely to identify rows — an auto-incrementing integer (\`GENERATED ALWAYS AS IDENTITY\` / \`SERIAL\`) or a UUID — with no business meaning.

- **Pro:** never changes, never collides, is a fast fixed-width comparison for joins, and is completely insulated from business-rule changes (a customer changing their email does not touch their primary key).
- **Con:** meaningless by itself; you always need at least one \`UNIQUE\` constraint on the "real" identifying attribute anyway (e.g. \`UNIQUE (email)\` alongside the surrogate \`id\`) so duplicates are still caught.

**Surrogate keys are the default recommendation** for exactly this reason: they decouple "how do I identify this row internally" from "what does the business currently consider unique", which can and does change.

### Composite key

Two or more columns together form the key — common when a row's identity **is** the combination, especially in junction tables (Lesson 5): \`(student_id, course_id)\` uniquely identifies one enrollment.

- **Pro:** no extra surrogate column needed when the natural composite is exactly what you want to prevent duplicating (e.g. "a student can only enroll in a given course once").
- **Con:** every foreign key referencing this table must carry the whole composite, which multiplies column count in child tables — often cheaper to add a surrogate id even here and enforce the composite uniqueness with a separate \`UNIQUE\` constraint.

## The four properties a good primary key has

1. **Unique** — the whole point.
2. **Not null** — every row must have one; a key that can be missing cannot identify anything.
3. **Stable** — should essentially never need to change. If a "unique" attribute is edited often (a display name, a phone number), it is a poor key even if unique today.
4. **Minimal** — no more columns than necessary; a 4-column composite key where 2 columns would already guarantee uniqueness needlessly widens every foreign key.

## ER modeling as a design step, not a diagram-drawing exercise

The value of ER modeling is not the picture — it is the **questions it forces you to answer before the schema exists**:

- What are the *nouns* in this domain? (entities)
- What facts does each noun carry? (attributes)
- How does each noun relate to the others, and is that relationship one-to-one, one-to-many, or many-to-many? (Lesson 5)
- What uniquely identifies one instance of each noun? (the primary key)

Skipping this step and writing \`CREATE TABLE\` directly from a UI mockup is how schemas end up with repeating-group columns (\`tag1, tag2, tag3\`), ambiguous relationships, and primary keys that turn out not to be unique after all — the exact problems normalization (Lessons 3-4) exists to fix.`,

    contentHi: `## Entities, attributes, relationships

**Data modeling** schema design se pehle ka step hai: decide karna ki aap *kya* track kar rahe ho, iske pehle ki decide karो ki tables mein *kaise* store karें. Teen vocabulary words poori discipline le jाते hain:

- **Entity** — apne aap track karne layak ek distinct tarah ki cheez: ek \`Student\`, ek \`Course\`, ek \`Order\`. Aksar ek table ban jaता hai.
- **Attribute** — ek entity ke baare mein ek fact: ek \`Student\` ka \`name\`. Aksar ek column ban jaता hai.
- **Relationship** — do entities kaise connect hoती hain: ek \`Student\` ek \`Course\` **TAKES** karta hai. Aksar ek foreign key (one-to-many) ya ek junction table (many-to-many — Lesson 5) ban jaता hai.

Ek **entity-relationship (ER) diagram** in teen cheezों ki ek picture hai: entities ke liye boxes, relationships ke liye lines, aur har line end par **cardinality** ke liye ek mark. DDL likhne se pehle ise sketch karna design mistakes ko kागaz par pakड़ता hai, jahaan wo kuch cost nahi karti, ek migration mein nahi, jahaan wo bahut cost karti hain.

## Ek primary key chunना

Har table ko theek ek **primary key** chahिए: ek column (ya columns ka set) jo har row ko uniquely, permanently identify karता hai. Teen flavours:

### Natural key

Ek real-world attribute jo unique nikालती hai: ek ISO country code, ek email address, ek product SKU.
- **Pro:** apne aap mein meaningful; koi extra column nahi.
- **Con:** real-world "uniqueness" aksar ek assumption nikалती hai, guarantee nahi — emails typo hoti hain aur reuse hoती hain, SKUs reassign hote hain.

### Surrogate key

Ek value jo sirf rows identify karne ke liye invent ki gayi — ek auto-incrementing integer ya ek UUID — koi business meaning nahi.
- **Pro:** kabhi nahi badalta, kabhi collide nahi karta, joins ke liye ek fast fixed-width comparison hai.
- **Con:** apne aap mein meaningless; aapको hamesha kam se kam ek \`UNIQUE\` constraint "real" identifying attribute par bhi chahिए.

**Surrogate keys default recommendation hain** theek isी wajah se: wo "main is row ko internally kaise identify karूं" ko "business abhi kya unique maanti hai" se decouple karте hain.

### Composite key

Do ya zyada columns milke key banते hain — junction tables mein common (Lesson 5): \`(student_id, course_id)\` ek enrollment ko uniquely identify karता hai.
- **Pro:** koi extra surrogate column nahi chahिए.
- **Con:** is table ko reference karne waali har foreign key ko poora composite le jाna hoga.

## Ek achhी primary key ke chaar properties

1. **Unique** — poora point.
2. **Not null** — har row ke paas ek hona chahिए.
3. **Stable** — essentially kabhi badalne ki zaroorat na ho.
4. **Minimal** — zaroorat se zyada columns nahi.

## ER modeling ek design step, ek diagram-drawing exercise nahi

ER modeling ka value picture nahi hai — wo **sawaal hain jo ye schema banne se pehle poochne par majboor karता hai**: is domain mein *nouns* kya hain? Har noun kaunसे facts le jaता hai? Har noun doosron se kaise related hai? Har noun ke ek instance ko uniquely kya identify karता hai? Is step ko skip karna aur seedhे \`CREATE TABLE\` likhна wo tarika hai jisse schemas repeating-group columns ke saath khatm hote hain — theek wo problems jo normalization (Lessons 3-4) fix karne ke liye hai.`,

    examples: [
      {
        title: 'Natural key vs surrogate key: what happens when the "unique" fact turns out not to be',
        titleHi: 'Natural key vs surrogate key: jab "unique" fact nikalta hai ki hai hi nahi',
        code: `-- natural key: email as primary key
CREATE TABLE customer_natural (email text PRIMARY KEY, name text);
INSERT INTO customer_natural VALUES ('ada@example.com', 'Ada');

-- a second person accidentally reuses (or types) the same email -> rejected outright,
-- and there is no way to keep both people as distinct customers under this design
INSERT INTO customer_natural VALUES ('ada@example.com', 'Adam');`,
        output: `[ERROR] duplicate key value violates unique constraint "customer_natural_pkey"`,
        explain: "`email` is the primary key here, so a second row with the SAME email is rejected outright — `duplicate key value violates unique constraint`. There is no way to keep 'Ada' and 'Adam' as two distinct customers if they share this email; the natural key's assumed uniqueness has broken, and the whole row is rejected, not just the conflicting field.",
        explainHi: "Yahaan `email` primary key hai, to SAME email waali ek doosri row seedhے reject ho jaati hai — `duplicate key value violates unique constraint`. Agar 'Ada' aur 'Adam' ye email share karte hain unhe do distinct customers ke roop mein rakhne ka koi tarika nahi hai; natural key ki assumed uniqueness toot gayi, aur poori row reject hoti hai, sirf conflicting field nahi.",
      },
      {
        title: 'Surrogate key: the same collision becomes a business-rule violation, not a primary-key crisis',
        titleHi: 'Surrogate key: wahi collision ek business-rule violation ban jaata hai, ek primary-key crisis nahi',
        code: `CREATE TABLE customer_surrogate (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                  email text UNIQUE, name text);
INSERT INTO customer_surrogate (email, name) VALUES ('ada@example.com', 'Ada');

-- the duplicate email is still caught (by the separate UNIQUE constraint) --
-- but the customer's IDENTITY (id) was never at risk of colliding with anyone else's
INSERT INTO customer_surrogate (email, name) VALUES ('ada@example.com', 'Adam');`,
        output: `[ERROR] duplicate key value violates unique constraint "customer_surrogate_email_key"`,
        explain: 'Here `id` is a surrogate key and `email` is a SEPARATE `UNIQUE` column. The duplicate email is still caught — `duplicate key value violates unique constraint "customer_surrogate_email_key"` — but the error names the EMAIL constraint, not the primary key. Each customer\'s core identity (`id`) was never at risk; only the business rule "emails must be unique" fired, which is exactly what should happen.',
        explainHi: 'Yahaan `id` ek surrogate key hai aur `email` ek ALAG `UNIQUE` column hai. Duplicate email abhi bhi pakड़ा jaता hai — par error EMAIL constraint ko name karta hai, primary key ko nahi. Har customer ki core identity (`id`) kabhi risk mein nahi thi; sirf business rule "emails unique hone chahiye" fire hua, jo theek wahi hai jo hona chahiye.',
      },
      {
        title: 'A composite key: the combination of two columns is the identity',
        titleHi: 'Ek composite key: do columns ka combination hi identity hai',
        code: `CREATE TABLE enrollment (student_id int, course_id int, grade text,
                         PRIMARY KEY (student_id, course_id));
INSERT INTO enrollment VALUES (1, 101, 'A'), (1, 102, 'B'), (2, 101, 'A');

-- student 1 cannot enroll in course 101 a second time -- the composite key forbids it
INSERT INTO enrollment VALUES (1, 101, 'C');`,
        output: `[ERROR] duplicate key value violates unique constraint "enrollment_pkey"`,
        explain: '`(student_id, course_id)` together are the primary key, so this composite uniquely identifies one enrollment. Student 1 has already enrolled in course 101 once; a second attempt at the SAME pair violates the composite key\'s uniqueness — `duplicate key value violates unique constraint "enrollment_pkey"` — directly enforcing "a student can enroll in a given course at most once" with no application code needed.',
        explainHi: '`(student_id, course_id)` milkar primary key hain, to ye composite ek enrollment ko uniquely identify karta hai. Student 1 pehle se course 101 mein ek baar enroll ho chuka hai; SAME jodi ka doosra attempt composite key ki uniqueness violate karta hai — seedhے "ek student ek diye course mein zyada se zyada ek baar enroll ho sakta hai" enforce karte hue bina kisi application code ke.',
      },
    ],

    mistakes: [
      {
        wrong: `-- using a mutable, user-editable attribute as the primary key
CREATE TABLE account (username text PRIMARY KEY, display_name text);
CREATE TABLE post (id int PRIMARY KEY, author_username text REFERENCES account(username));
-- the user renames their account -> author_username must change EVERYWHERE it is referenced`,
        right: `CREATE TABLE account (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                      username text UNIQUE, display_name text);
CREATE TABLE post (id int PRIMARY KEY, author_id bigint REFERENCES account(id));
-- the username can change freely; author_id never does`,
        why: 'A username is a natural key that users expect to be able to change, and a primary key should be stable because every foreign key referencing it, and every place that key was ever exported or cached, depends on it staying the same. Making username the primary key means a rename becomes a cascading update across every table that referenced it, and any external system that stored the old username silently breaks. A surrogate id is immune to this because it carries no business meaning the user could ever want to change; the username stays a UNIQUE column for lookups and login, but the identity used internally by every foreign key never moves.',
        whyHi: 'Ek username ek natural key hai jise users badalna chahते hain, aur ek primary key stable honi chahिए kyunki ise reference karने waali har foreign key iske same rehne par nirbhar karती hai. username ko primary key banana ek rename ko har table ke across ek cascading update banaता hai. Ek surrogate id iske immune hai kyunki ye koi business meaning nahi le jaती jise user kabhi badalna chahे.',
      },
      {
        wrong: `-- no primary key at all, "just append rows"
CREATE TABLE event_log (event_type text, occurred_at timestamptz, payload text);
-- duplicate inserts (a retried request, a replayed message) create indistinguishable rows`,
        right: `CREATE TABLE event_log (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        event_type text, occurred_at timestamptz, payload text);
-- every row has a stable, unique identity -- a retry can be de-duplicated by checking for it first`,
        why: 'Skipping a primary key because "it is just a log" removes any way to refer to a specific row later: you cannot update it, delete it, or detect that the same logical event was inserted twice, because two otherwise-identical rows are indistinguishable. A surrogate identity column costs almost nothing and gives every row a handle. It also enables idempotency patterns later, such as storing a client-supplied request id as a unique column and checking it before insert, which is not possible if rows have no stable identity to check against in the first place.',
        whyHi: '"Ye bस ek log hai" kehkar ek primary key skip karna baad mein ek specific row ko refer karne ka koi tarika hataता hai: aap ise update, delete nahi kar sakte, ya detect nahi kar sakte ki wahi logical event do baar insert hua, kyunki do otherwise-identical rows indistinguishable hain. Ek surrogate identity column lगभग kuch cost nahi karता aur har row ko ek handle deता hai.',
      },
      {
        wrong: `-- a composite key with more columns than necessary
CREATE TABLE ticket (event_id int, seat_row text, seat_number int, holder_email text,
                     PRIMARY KEY (event_id, seat_row, seat_number, holder_email));
-- adding holder_email to the key means the SAME seat can be "sold" to two different emails`,
        right: `CREATE TABLE ticket (event_id int, seat_row text, seat_number int, holder_email text,
                     PRIMARY KEY (event_id, seat_row, seat_number));
-- (event, row, seat) alone already uniquely identifies a physical seat at an event`,
        why: 'A key should be minimal: no more columns than are needed to guarantee uniqueness of the thing being identified. Here the physical seat, identified by the event, row, and seat number, is what must be unique per sale, one holder per seat. Including holder_email in the key actually breaks the intended constraint, because it lets the same physical seat be inserted twice under two different emails, which is exactly the double-booking the key was supposed to prevent. Adding a column to a composite key that is not needed for uniqueness does not just add noise, it can silently widen what the constraint allows.',
        whyHi: 'Ek key minimal honi chahिए: identify ki jaने waali cheez ki uniqueness guarantee karne ke liye zaroorat se zyada columns nahi. Yahaan physical seat, event, row, aur seat number se identify, wo hai jo prati sale unique hona chahिए. Key mein holder_email include karna asal mein intended constraint ko todता hai, kyunki ye usी physical seat ko do alag emails ke under do baar insert hone deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every table in a production schema getting a `BIGINT GENERATED ALWAYS AS IDENTITY` surrogate `id` plus separate `UNIQUE` constraints on the "real" identifying columns** (email, SKU, ISO code) — the team-wide default.',
        hi: '**Production schema mein har table ko ek `BIGINT GENERATED ALWAYS AS IDENTITY` surrogate `id` plus alag `UNIQUE` constraints milna** — team-wide default.',
      },
      {
        en: '**An ER sketch reviewed in a design doc before any migration is written** — catching a missed many-to-many relationship (a product can have multiple suppliers) on paper instead of in a hotfix.',
        hi: '**Koi migration likhne se pehle ek design doc mein review ki gayi ek ER sketch** — kagaz par ek missed many-to-many relationship pakड़ना.',
      },
      {
        en: '**A junction table `(order_id, product_id)` as a composite primary key** enforcing "a product appears at most once per order" without an application-level check.',
        hi: '**Ek junction table `(order_id, product_id)` ek composite primary key ke roop mein** "ek order mein ek product zyada se zyada ek baar" enforce karते hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a natural key and a surrogate key, and why do most teams default to surrogate keys?',
        qHi: 'Ek natural key aur ek surrogate key mein kya antar hai, aur zyadатार teams surrogate keys ko default kyun banाते hain?',
        a: 'A natural key is an attribute that already exists in the real world and happens to be unique, like an email address, a national id, or a product SKU. A surrogate key is a value invented purely to identify a row, typically an auto-incrementing integer or a UUID, carrying no business meaning at all. The reason surrogate keys are the common default is stability. A natural key\'s uniqueness is often an assumption about the real world that later turns out to be false or that changes, emails get reused or corrected, SKUs get reassigned after discontinuation, and when that assumption breaks, every foreign key referencing that value across the schema is affected, potentially requiring a cascading update or leaving orphaned or ambiguous references. A surrogate key never needs to change for business reasons because it has no business meaning to begin with, so it decouples the internal notion of row identity from whatever the business currently considers unique. You still enforce the real-world uniqueness with a separate UNIQUE constraint on the natural attribute, so duplicates are still caught, but the primary key used by every foreign key stays untouched even if that business rule or the value itself changes.',
        aHi: 'Ek natural key ek attribute hai jo pehle se real world mein exist karta hai aur unique nikалता hai, jaise ek email address. Ek surrogate key ek value hai jo sirf ek row identify karne ke liye invent ki gayi, typically ek auto-incrementing integer, koi business meaning nahi le jाती. Surrogate keys common default hone ka kaaran stability hai. Ek natural key ki uniqueness aksar real world ke baare mein ek assumption hai jo baad mein galat nikалती hai. Jab wo assumption toतti hai, poore schema mein us value ko reference karने waali har foreign key affected hoती hai. Ek surrogate key ko kabhi business reasons se badalne ki zaroorat nahi kyunki ise koi business meaning hai hi nahi.',
      },
      {
        q: 'What makes a good primary key, and what is wrong with using a mutable attribute like a username as one?',
        qHi: 'Ek achhी primary key kya banaती hai, aur ek username jaisा mutable attribute ise banane mein kya galat hai?',
        a: 'A good primary key has four properties. It must be unique, so no two rows can be mistaken for each other. It must be not null, since a row with no key value cannot be identified at all. It should be stable, meaning it essentially never needs to change once assigned, because every foreign key elsewhere in the schema, and every external system that stored a reference to it, depends on that value staying put. And it should be minimal, using no more columns than are actually required to guarantee uniqueness of the thing being identified. A username fails the stability test: it is exactly the kind of attribute users reasonably expect to be able to change, for a rebrand, a marriage, a preference. If it is the primary key, a rename becomes a cascading update across every table with a foreign key to it, and any external system that cached the old value silently breaks. The fix is to keep username as a UNIQUE column for lookup and login purposes, while using a surrogate id, with no business meaning and therefore no reason to ever change, as the actual primary key that other tables reference.',
        aHi: 'Ek achhी primary key ke chaar properties hain. Ye unique honi chahिए. Ye not null honi chahिए. Ye stable honi chahिए, matlab assign hone ke baad essentially kabhi badalne ki zaroorat na ho. Aur ye minimal honi chahिए. Ek username stability test fail karta hai: ye theek wahi tarah ka attribute hai jise users reasonably badalna chahते hain. Agar ye primary key hai, ek rename iske foreign key waali har table mein ek cascading update ban jaता hai. Fix username ko lookup ke liye ek UNIQUE column rakhна hai, jabki ek surrogate id, koi business meaning na rakhते hue, asli primary key ke roop mein istemal karна hai jise doosri tables reference karti hain.',
      },
    ],

    exercises: [
      {
        task: 'Design (on paper / in a comment, no SQL needed) the entities, attributes, and relationships for a small library system: books, authors, members, loans. List each entity\'s attributes and identify one many-to-many and one one-to-many relationship.',
        taskHi: 'Ek chhote library system ke liye entities, attributes, aur relationships design karो (kagaz par / ek comment mein): books, authors, members, loans.',
        hint: 'Author-Book is many-to-many (an author writes several books, a book can have co-authors). Member-Loan is one-to-many (a member has many loans, each loan belongs to one member).',
        hintHi: 'Author-Book many-to-many hai. Member-Loan one-to-many hai (ek member ke kई loans, har loan ek member ka).',
      },
      {
        task: 'Table `product(sku text PRIMARY KEY, name text)` using the SKU as a natural key. Insert two rows with the same SKU and observe the error. Then redesign with a surrogate `id` and `sku` as a separate `UNIQUE` column, and confirm the same duplicate is still caught.',
        taskHi: 'Table `product(sku PRIMARY KEY, name)` SKU ko natural key ke roop mein istemal karke. Do rows same SKU ke saath insert karo aur error dekho. Phir surrogate `id` ke saath redesign karo.',
        hint: 'Both designs reject the duplicate SKU, but only the surrogate design lets you keep the row\'s internal identity (`id`) stable if the SKU itself ever needs correcting.',
        hintHi: 'Dono designs duplicate SKU reject karte hain, par sirf surrogate design row ki internal identity (`id`) ko stable rakhne deta hai agar SKU khud kabhi correct karna pade.',
      },
      {
        task: 'Table `favorite(user_id int, product_id int, PRIMARY KEY (user_id, product_id))`. Insert a few rows, then try inserting a duplicate `(user_id, product_id)` pair and confirm it is rejected. Explain in a comment why a composite key is the natural choice here rather than a separate surrogate `id`.',
        taskHi: 'Table `favorite(user_id, product_id, PRIMARY KEY (user_id, product_id))`. Kuch rows insert karo, phir ek duplicate pair insert karne ki koshish karo.',
        hint: 'The composite key directly enforces "a user can favorite a given product at most once" — the constraint IS the business rule, with no application-side check needed.',
        hintHi: 'Composite key seedhe "ek user ek diye product ko zyada se zyada ek baar favorite kar sakta hai" enforce karta hai — constraint HI business rule hai.',
      },
    ],

    keyTakeaways: [
      'Data modeling precedes schema design: identify ENTITIES ("things" — Student, Course), their ATTRIBUTES (facts about one entity), and RELATIONSHIPS between entities, before writing `CREATE TABLE`. Entity -> table, attribute -> column, relationship -> foreign key or junction table (Lesson 5).',
      'THREE kinds of primary key. NATURAL: a real-world unique attribute (email, ISO code) — meaningful, but "uniqueness" can turn out to be an assumption that breaks. SURROGATE: an invented, meaningless id (auto-increment / UUID) — never changes, never collides, decoupled from business rules. COMPOSITE: 2+ columns together are the key — common for junction tables.',
      'SURROGATE KEYS ARE THE DEFAULT because stability matters more than meaning: a natural key\'s real-world uniqueness can break (reused emails, reassigned SKUs), forcing a cascading update everywhere it\'s referenced. A surrogate id has no business meaning to ever need changing — enforce the natural uniqueness separately with a `UNIQUE` constraint.',
      'A good primary key is: UNIQUE (no two rows share it), NOT NULL (every row has one), STABLE (should not need to change), MINIMAL (no more columns than needed for uniqueness). A mutable attribute like `username` fails STABLE — use it as a `UNIQUE` column, not the PK.',
      'A composite key with an EXTRA unnecessary column doesn\'t just add noise — it can silently WIDEN what the constraint allows (e.g. adding `holder_email` to a `(event, row, seat)` key lets the same physical seat be double-booked under two emails).',
      'ER modeling\'s value is the QUESTIONS it forces before the schema exists: what are the nouns (entities)? what facts does each carry (attributes)? how do they relate, and at what cardinality (Lesson 5)? what uniquely identifies each (the key)? Skipping this leads to the exact problems normalization (Lessons 3-4) exists to fix.',
    ],
    keyTakeawaysHi: [
      'Data modeling schema design se pehle aata hai: ENTITIES ("cheezें"), unke ATTRIBUTES, aur entities ke beech RELATIONSHIPS identify karo, `CREATE TABLE` likhne se pehle. Entity -> table, attribute -> column, relationship -> foreign key ya junction table.',
      'TEEN tarah ki primary key. NATURAL: ek real-world unique attribute — meaningful, par "uniqueness" ek assumption nikал sakti hai jo tootती hai. SURROGATE: ek invented, meaningless id — kabhi nahi badalta. COMPOSITE: 2+ columns milkar key hain.',
      'SURROGATE KEYS DEFAULT HAIN kyunki stability meaning se zyada maayne rakhती hai: ek natural key ki real-world uniqueness toot sakti hai, har jagah ek cascading update force karте hue. Ek surrogate id ko kabhi badalne ki business zaroorat nahi.',
      'Ek achhी primary key: UNIQUE, NOT NULL, STABLE, MINIMAL. Ek mutable attribute jaisा `username` STABLE fail karta hai — ise `UNIQUE` column ke roop mein istemal karो, PK nahi.',
      'Ek EXTRA unnecessary column waali composite key sirf noise add nahi karti — ye chupchaap WIDEN kar sakti hai ki constraint kya allow karta hai.',
      'ER modeling ka value un SAWAALON mein hai jo ye schema banne se pehle poochne par majboor karता hai: nouns kya hain? har ek kya facts le jaता hai? wo kaise related hain? har ek ko uniquely kya identify karta hai? Ise skip karna theek un problems tak le jaता hai jo normalization fix karta hai.',
    ],
  },

  {
    slug: 'sql-foreign-keys-and-referential-actions',
    title: 'Foreign Keys & Referential Actions',
    titleHi: 'Foreign Keys Aur Referential Actions',
    description: 'A foreign key constraint guarantees a column\'s value matches a row that actually exists in another table — no orphaned references. `ON DELETE`/`ON UPDATE` say what happens to the child rows when the parent is deleted or its key changes: `CASCADE`, `RESTRICT`, `SET NULL`, `NO ACTION`.',
    descriptionHi: 'Ek foreign key constraint guarantee karta hai ki ek column ki value ek row se match karti hai jo doosri table mein asal mein exist karti hai — koi orphaned references nahi. `ON DELETE`/`ON UPDATE` bataते hain ki jab parent delete hoता hai ya iska key badalta hai to child rows ka kya hoता hai: `CASCADE`, `RESTRICT`, `SET NULL`, `NO ACTION`.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A library\'s "book belongs to this shelf" tag, and the rulebook for what happens when a shelf is removed.** Every book in the library has a tag pointing to the shelf it lives on. The librarian will not let you write a tag pointing to shelf 47 if there is no shelf 47 — that check is the foreign key constraint, and it makes an "orphaned" book (pointing to a shelf that does not exist) impossible. Now suppose a whole shelf is being decommissioned. What happens to the books on it depends on a rule the library decided in advance: **CASCADE** means "throw out every book on that shelf too" (delete the children with the parent) — right for records that make no sense without their parent, like order line items when the order itself is cancelled. **RESTRICT** means "you may not remove this shelf while it still has books on it" — right when the child records are too important to lose silently, and a human should deal with them first. **SET NULL** means "the books stay, but their shelf tag is wiped blank" — right when the child can meaningfully exist without that particular parent, like an employee whose department was dissolved but who is still employed. Choosing which rule applies to which relationship is a design decision, not an afterthought.',
      hi: '**Ek library ka "ye book is shelf ka hai" tag, aur ek shelf hataye jane par kya hota hai iska rulebook.** Library ki har book ke paas ek tag hai jo us shelf ki taraf point karta hai jahaan ye rehti hai. Librarian aapko shelf 47 ki taraf point karta tag likhne nahi dega agar shelf 47 hai hi nahi — wo check foreign key constraint hai, aur ye ek "orphaned" book (ek shelf ki taraf point karti jo exist nahi karti) ko impossible banata hai. Ab maान lo ek poori shelf decommission ho rahi hai. Ispar ki books ka kya hoga ye ek rule par nirbhar karta hai jo library ne pehle decide kiya: **CASCADE** ka matlab hai "us shelf ki har book bhi phenk do" — un records ke liye sahi jo apne parent ke bina koi matlab nahi rakhte. **RESTRICT** ka matlab hai "aap is shelf ko hataa nahi sakte jab tak ispar books hain" — jab child records itne important hain ki chupchaap khoye na jaayen. **SET NULL** ka matlab hai "books rehती hain, par unka shelf tag blank ho jaта hai" — jab child apne particular parent ke bina meaningfully exist kar sakta hai.',
    },

    simple: `**The FK constraint: you cannot point to a row that does not exist**

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));

INSERT INTO book VALUES (1, 999);
-- ERROR: insert or update on table "book" violates foreign key constraint
--        (there is no author with id 999)
\`\`\`

**\`ON DELETE\` says what happens to children when the parent row is deleted**

\`\`\`sql
-- CASCADE: delete the children too
author_id int REFERENCES author(id) ON DELETE CASCADE

-- RESTRICT (the default-ish behaviour): refuse the delete while children exist
author_id int REFERENCES author(id) ON DELETE RESTRICT

-- SET NULL: keep the children, blank out the reference
author_id int REFERENCES author(id) ON DELETE SET NULL
\`\`\`

**\`ON DELETE CASCADE\` — the children go with the parent**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- every book with author_id = 1 is ALSO deleted -- no orphans, but also no warning
\`\`\`

**\`ON DELETE RESTRICT\` — the delete is refused while a child exists**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- ERROR: update or delete ... violates ... RESTRICT ... foreign key constraint
-- you must delete/reassign the books FIRST
\`\`\`

**\`ON DELETE SET NULL\` — children survive, the link is cleared**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- the book row still exists; book.author_id is now NULL
\`\`\`

**Choosing the action**

\`\`\`
child is meaningless without the parent (order_line without order)  -> CASCADE
child must survive and someone must decide what to do (invoice)     -> RESTRICT
child can meaningfully exist with "no parent" (employee, dept gone)  -> SET NULL
\`\`\``,

    simpleHi: `**FK constraint: aap ek aisi row ki taraf point nahi kar sakte jo exist nahi karti**

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));

INSERT INTO book VALUES (1, 999);
-- ERROR: insert or update on table "book" violates foreign key constraint
\`\`\`

**\`ON DELETE\` batata hai ki parent row delete hone par children ka kya hota hai**

\`\`\`sql
-- CASCADE: children ko bhi delete karo
author_id int REFERENCES author(id) ON DELETE CASCADE

-- RESTRICT: children maujood hone par delete refuse karo
author_id int REFERENCES author(id) ON DELETE RESTRICT

-- SET NULL: children rakho, reference blank karो
author_id int REFERENCES author(id) ON DELETE SET NULL
\`\`\`

**\`ON DELETE CASCADE\` — children parent ke saath jaate hain**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- author_id = 1 waali har book BHI delete ho jaati hai -- koi orphans nahi, koi warning bhi nahi
\`\`\`

**\`ON DELETE RESTRICT\` — child maujood hone par delete refuse**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- ERROR: ... RESTRICT ... foreign key constraint
-- pehle books delete/reassign karni hongi
\`\`\`

**\`ON DELETE SET NULL\` — children bachte hain, link clear**

\`\`\`sql
DELETE FROM author WHERE id = 1;
-- book row abhi bhi exist karti hai; book.author_id ab NULL hai
\`\`\`

**Action chunना**

\`\`\`
child parent ke bina meaningless hai (order_line bina order)     -> CASCADE
child bachna chahiye aur koi decide kare (invoice)                -> RESTRICT
child "no parent" ke saath meaningfully exist kar sakta hai       -> SET NULL
\`\`\``,

    content: `## What a foreign key guarantees

A **foreign key (FK)** constraint on a column says: every non-null value in this column **must equal** the value of some row's primary/unique key in the referenced table. It is the database-level enforcement of a relationship (Lesson 1):

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (
  id int PRIMARY KEY,
  author_id int REFERENCES author(id),   -- FK: author_id must match an existing author.id
  title text
);
\`\`\`

Attempting \`INSERT INTO book VALUES (1, 999, 'X')\` when no author has \`id = 999\` fails immediately: \`insert or update on table "book" violates foreign key constraint\`. This is exactly the guard that prevents **orphan rows** — child records pointing at a parent that does not exist.

## Why this matters even with an ORM

Application code (an ORM, a service layer) usually maintains these relationships correctly during normal operation. FK constraints are still worth having because they catch the cases application code does not: a bulk import script with a typo, a manual \`UPDATE\` run by an operator, a bug in a rarely-hit code path, a race condition between two services. **A constraint enforced by the database is enforced for every writer, forever — not just the ones you remembered to code a check into.**

## Referential actions: what happens on delete/update

By default, deleting (or changing the key of) a referenced row **fails** if child rows still reference it — this is the implicit \`RESTRICT\`/\`NO ACTION\` behaviour. You can instead specify what should happen:

| clause | on \`DELETE\` of the parent row |
|---|---|
| \`ON DELETE CASCADE\` | delete every child row that referenced it too |
| \`ON DELETE RESTRICT\` | refuse the delete while any child row still references it |
| \`ON DELETE NO ACTION\` | like \`RESTRICT\`, but checked at the end of the statement/transaction (matters for self-referencing or deferred constraints) |
| \`ON DELETE SET NULL\` | keep the child row; set its FK column to \`NULL\` |
| \`ON DELETE SET DEFAULT\` | keep the child row; set its FK column to its declared \`DEFAULT\` |

The same five options exist for \`ON UPDATE\` (triggered when the *referenced* key value changes — rare with surrogate keys, since they never change, but relevant if the parent's key is natural).

## Choosing the right action

- **\`CASCADE\`** — for a genuine **composition**: the child has no independent existence. Order line items when the order is deleted; comments when the post is deleted; a shopping cart's items when the cart is deleted. Deleting the parent *should* mean deleting the whole thing.
- **\`RESTRICT\` / \`NO ACTION\`** — for records too significant to disappear silently. Refusing to delete a \`customer\` who has \`invoices\` forces a human decision (archive the invoices first? refuse the deletion entirely?) rather than quietly cascading away financial records.
- **\`SET NULL\`** — for an **optional** association where the child is meaningful on its own. An \`employee.department_id\` when a department is dissolved: the employee still exists, just temporarily unassigned. Requires the FK column to be nullable.
- **\`SET DEFAULT\`** — rarer; useful when there is a sensible fallback value (e.g. reassign orphaned rows to an "Unassigned" category row) rather than \`NULL\`.

**\`CASCADE\` is not automatically "the safe default"** — it is the most *destructive* option, silently deleting data with no confirmation. Use it deliberately for true parent-owns-child relationships, not as a way to make FK errors go away.

## Self-referencing foreign keys

A table can reference itself — the employee/manager pattern (Module 3, Module 5):

\`\`\`sql
CREATE TABLE employee (
  id int PRIMARY KEY,
  name text,
  manager_id int REFERENCES employee(id)   -- points to another row in the SAME table
);
\`\`\`

The FK still enforces the same guarantee: \`manager_id\`, if not \`NULL\`, must match an existing \`employee.id\`. This is how Module 5's recursive-CTE org chart is *validated* at the schema level, not just queried.

## Indexes on foreign key columns

PostgreSQL does **not** automatically create an index on a foreign key column (unlike the primary/unique key it references, which is always indexed). Every \`ON DELETE\`/\`ON UPDATE\` check, and every join against the parent, scans the child table for matching rows — without an index on the FK column, that is a full scan. **Always index foreign key columns explicitly** (Module 10 covers this in the indexing context).`,

    contentHi: `## Ek foreign key kya guarantee karta hai

Ek column par ek **foreign key (FK)** constraint kehta hai: is column mein har non-null value **theek** referenced table ke kisi row ki primary/unique key ke barabar honi chahिए. Ye relationship (Lesson 1) ka database-level enforcement hai:

\`\`\`sql
CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (
  id int PRIMARY KEY,
  author_id int REFERENCES author(id),   -- FK: author_id ko ek existing author.id se match karна hoga
  title text
);
\`\`\`

\`author.id = 999\` na hone par \`INSERT INTO book VALUES (1, 999, 'X')\` turant fail hoता hai. Ye theek wo guard hai jo **orphan rows** ko roकता hai.

## ORM ke saath bhi ye kyun maayne rakhta hai

Application code aksar in relationships ko theek se maintain karta hai. FK constraints phir bhi rakhne layak hain kyunki wo un cases ko pakड़te hain jo application code nahi: ek typo waala bulk import script, ek operator dwara chalाया manual \`UPDATE\`, ek race condition. **Database dwara enforce ki gayi ek constraint har writer ke liye hamesha enforce hoती hai.**

## Referential actions: delete/update par kya hota hai

Default se, ek referenced row ko delete karna (ya iski key badalna) **fail** hota hai agar child rows abhi bhi reference karti hain — ye implicit \`RESTRICT\`/\`NO ACTION\` behaviour hai.

| clause | parent row ke \`DELETE\` par |
|---|---|
| \`ON DELETE CASCADE\` | har child row bhi delete karo jo reference karti thi |
| \`ON DELETE RESTRICT\` | jab tak koi child row reference karti hai delete refuse karo |
| \`ON DELETE NO ACTION\` | RESTRICT jaisा, par statement/transaction ke end mein check |
| \`ON DELETE SET NULL\` | child row rakho; iska FK column \`NULL\` set karो |
| \`ON DELETE SET DEFAULT\` | child row rakho; iska FK column iske declared \`DEFAULT\` par set karो |

## Sahi action chunना

- **\`CASCADE\`** — genuine **composition** ke liye: child ka koi independent existence nahi.
- **\`RESTRICT\` / \`NO ACTION\`** — un records ke liye jo chupchaap gayab hone ke liye bahut significant hain.
- **\`SET NULL\`** — ek **optional** association ke liye jahaan child apne aap mein meaningful hai.
- **\`SET DEFAULT\`** — rarer; jab ek sensible fallback value ho.

**\`CASCADE\` automatically "safe default" NAHI hai** — ye sabse *destructive* option hai. Ise deliberately true parent-owns-child relationships ke liye istemal karो.

## Self-referencing foreign keys

Ek table khud ko reference kar sakti hai — employee/manager pattern:

\`\`\`sql
CREATE TABLE employee (
  id int PRIMARY KEY, name text,
  manager_id int REFERENCES employee(id)
);
\`\`\`

## Foreign key columns par indexes

PostgreSQL ek foreign key column par automatically ek index create NAHI karta. Har \`ON DELETE\`/\`ON UPDATE\` check, aur parent ke against har join, child table ko matching rows ke liye scan karta hai — index ke bina, wo ek full scan hai. **Hamesha foreign key columns ko explicitly index karो.**`,

    examples: [
      {
        title: 'ON DELETE CASCADE: deleting the parent deletes the children too',
        titleHi: 'ON DELETE CASCADE: parent delete karna children ko bhi delete karta hai',
        code: `CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY,
                   author_id int REFERENCES author(id) ON DELETE CASCADE, title text);
INSERT INTO author VALUES (1, 'Ada');
INSERT INTO book VALUES (10, 1, 'Notes'), (11, 1, 'Letters');

DELETE FROM author WHERE id = 1;
SELECT * FROM book;`,
        output: ` id | author_id | title
----+-----------+-------
(0 rows)`,
        explain: "Deleting the author with `id = 1` triggers `ON DELETE CASCADE`, which also deletes every `book` row whose `author_id` referenced that author. Both of Ada's books (`Notes` and `Letters`) are gone along with her — `SELECT * FROM book` returns zero rows. CASCADE treats the child rows as belonging entirely to the parent: no parent, no children.",
        explainHi: '`id = 1` waale author ko delete karna `ON DELETE CASCADE` trigger karta hai, jo us author ko reference karne waali har `book` row bhi delete kar deta hai. Ada ki dono books (`Notes` aur `Letters`) uske saath gayab ho jaati hain — `SELECT * FROM book` zero rows lautata hai. CASCADE child rows ko poori tarah parent ki maankar treat karta hai: koi parent nahi, koi children nahi.',
      },
      {
        title: 'ON DELETE RESTRICT: the parent cannot be deleted while a child references it',
        titleHi: 'ON DELETE RESTRICT: parent delete nahi ho sakta jab tak ek child reference karti hai',
        code: `CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY,
                   author_id int REFERENCES author(id) ON DELETE RESTRICT, title text);
INSERT INTO author VALUES (1, 'Ada');
INSERT INTO book VALUES (10, 1, 'Notes');

DELETE FROM author WHERE id = 1;`,
        output: `[ERROR] update or delete on table "author" violates RESTRICT setting of foreign key constraint "book_author_id_fkey" on table "book"`,
        explain: '`ON DELETE RESTRICT` means the database REFUSES the delete while any child row still references the parent. Ada has one book, so deleting her author row fails: `violates RESTRICT setting of foreign key constraint`. Someone must explicitly delete or reassign the book first — the constraint forces a deliberate decision rather than silently losing data.',
        explainHi: '`ON DELETE RESTRICT` ka matlab database delete REFUSE karta hai jab tak koi child row abhi bhi parent ko reference karti hai. Ada ki ek book hai, to uski author row delete karna fail hota hai: `violates RESTRICT setting of foreign key constraint`. Kisi ko pehle book explicitly delete ya reassign karni hogi — constraint chupchaap data khone ke bajaye ek deliberate decision force karta hai.',
      },
      {
        title: 'ON DELETE SET NULL: the child row survives, its reference is cleared',
        titleHi: 'ON DELETE SET NULL: child row bachti hai, iska reference clear ho jaata hai',
        code: `CREATE TABLE author (id int PRIMARY KEY, name text);
CREATE TABLE book (id int PRIMARY KEY,
                   author_id int REFERENCES author(id) ON DELETE SET NULL, title text);
INSERT INTO author VALUES (1, 'Ada');
INSERT INTO book VALUES (10, 1, 'Notes');

DELETE FROM author WHERE id = 1;
SELECT * FROM book;`,
        output: ` id | author_id | title
----+-----------+-------
 10 | NULL      | Notes
(1 row)`,
        explain: "`ON DELETE SET NULL` keeps the child row alive but clears its reference: after deleting the author, the `book` row still exists (`id = 10`, `title = 'Notes'`), but `author_id` is now `NULL` rather than pointing at a deleted author. This is only possible because `author_id` was declared nullable — `SET NULL` cannot fire on a `NOT NULL` column.",
        explainHi: '`ON DELETE SET NULL` child row ko zinda rakhta hai par iska reference clear kar deta hai: author delete karne ke baad, `book` row abhi bhi exist karti hai, par `author_id` ab `NULL` hai, ek deleted author ki taraf point karne ke bajaye. Ye sirf isliye possible hai kyunki `author_id` nullable declare ki gayi thi — `SET NULL` ek `NOT NULL` column par fire nahi ho sakta.',
      },
    ],

    mistakes: [
      {
        wrong: `-- deleting a customer with orders, using ON DELETE CASCADE "for convenience"
CREATE TABLE customer (id int PRIMARY KEY, name text);
CREATE TABLE orders (id int PRIMARY KEY,
                     customer_id int REFERENCES customer(id) ON DELETE CASCADE, total int);
-- an operator deletes a duplicate customer row -- and silently loses their ENTIRE order history`,
        right: `CREATE TABLE customer (id int PRIMARY KEY, name text);
CREATE TABLE orders (id int PRIMARY KEY,
                     customer_id int REFERENCES customer(id) ON DELETE RESTRICT, total int);
-- deleting a customer with orders now FAILS -- forcing a deliberate decision
-- (archive the orders, reassign them, or confirm the deletion is really intended)`,
        why: 'CASCADE is convenient in the moment because it makes foreign key errors disappear, but it means every delete of the parent silently deletes an unbounded amount of child data with no confirmation and no way to notice a mistake before it happens. Financial records, order history, anything with legal, auditing, or simply high business value should not evaporate because someone deleted the wrong row. RESTRICT turns that same mistake into an error message, forcing a human to explicitly decide what should happen to the orders before the customer can be removed, whether that is archiving them, reassigning them, or confirming the deletion really should take everything with it.',
        whyHi: 'CASCADE tatkал convenient hai kyunki ye foreign key errors ko gायab kar deता hai, par iska matlab parent ka har delete chupchaap child data ki ek unbounded sankhya delete karta hai bina kisi confirmation ke. Financial records, order history, kuch bhi jiski high business value hai, kisi ke galat row delete karne se gायab nahi hona chahिए. RESTRICT usी galti ko ek error message mein badalता hai, ek insaan ko explicitly decide karne par majboor karte hue ki orders ka kya hona chahिए.',
      },
      {
        wrong: `-- an "optional department" that isn't nullable -- SET NULL can't work
CREATE TABLE department (id int PRIMARY KEY);
CREATE TABLE employee (id int PRIMARY KEY,
                       department_id int NOT NULL REFERENCES department(id) ON DELETE SET NULL);
-- ERROR when you try to delete a department with employees: the column can't be NULL`,
        right: `CREATE TABLE department (id int PRIMARY KEY);
CREATE TABLE employee (id int PRIMARY KEY,
                       department_id int REFERENCES department(id) ON DELETE SET NULL);
-- department_id must be NULLABLE for SET NULL to have anywhere to put the NULL`,
        why: 'ON DELETE SET NULL is a promise the column can actually keep: when the referenced row disappears, the foreign key column is set to NULL, which is only possible if that column allows NULL in the first place. Declaring the column NOT NULL and also SET NULL is a direct contradiction, and PostgreSQL will refuse the delete with a not-null violation the moment the action tries to fire. If department really can be optional for an employee, the column must be nullable; if it genuinely cannot be optional, SET NULL is the wrong action, and RESTRICT or CASCADE is what the business rule actually calls for.',
        whyHi: '`ON DELETE SET NULL` ek promise hai jo column asal mein rakh sakta hai: jab referenced row gायab hoती hai, foreign key column `NULL` set hoता hai, jo sirf tab possible hai jab wo column pehle `NULL` allow karta ho. Column ko `NOT NULL` declare karna aur saath `SET NULL` bhi ek direct contradiction hai. Agar department ek employee ke liye sach mein optional ho sakta hai, column nullable hona chahिए; agar ye genuinely optional nahi ho sakta, `SET NULL` galat action hai.',
      },
      {
        wrong: `-- a foreign key column with no index -- every delete on the parent scans the whole child table
CREATE TABLE author (id int PRIMARY KEY);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
-- no index on book.author_id -- ON DELETE CASCADE / RESTRICT checks do a full table scan of book`,
        right: `CREATE TABLE author (id int PRIMARY KEY);
CREATE TABLE book (id int PRIMARY KEY, author_id int REFERENCES author(id));
CREATE INDEX ON book (author_id);
-- now the FK check (and any join to author) can use an index scan instead of a full scan`,
        why: 'PostgreSQL automatically indexes a primary or unique key because uniqueness must be checked on every insert, but it does not automatically index the foreign key column on the referencing side, because there is no such requirement there. Every time a parent row is deleted or updated with an ON DELETE or ON UPDATE action, and every time a query joins from the parent to the child, the database must find all matching rows in the child table by that foreign key value; without an index, that is a full scan of the child table every time. On a small table this is invisible, but on a large one it turns every delete of a parent row, and every join, into a slow operation. Indexing foreign key columns is a standard, almost mechanical step whenever one is declared.',
        whyHi: 'PostgreSQL automatically ek primary ya unique key ko index karta hai kyunki uniqueness ko har insert par check karna hoता hai, par ye referencing side par foreign key column ko automatically index nahi karta. Jab bhi ek parent row delete ya update hoती hai ek `ON DELETE` ya `ON UPDATE` action ke saath, aur jab bhi ek query parent se child tak join karti hai, database ko us foreign key value se child table mein sabhi matching rows dhoondni hoti hain; bina index ke, ye har baar child table ka ek full scan hai.',
      },
    ],

    realWorld: [
      {
        en: '**`ON DELETE CASCADE` on `order_line -> orders`** (line items make no sense without their order) **but `ON DELETE RESTRICT` on `invoice -> customer`** (a customer with unpaid invoices cannot simply vanish).',
        hi: '**`order_line -> orders` par `ON DELETE CASCADE`** par **`invoice -> customer` par `ON DELETE RESTRICT`**.',
      },
      {
        en: '**A migration checklist item: "every new foreign key column gets an index in the same migration"** — added after a production incident where an unindexed FK made a routine parent delete take minutes.',
        hi: '**Ek migration checklist item: "har naya foreign key column usi migration mein ek index paata hai"** — ek production incident ke baad add kiya gaya.',
      },
      {
        en: '**`employee.department_id ON DELETE SET NULL`** so dissolving a department does not delete or block deletion of its employees — they simply become temporarily unassigned, pending reassignment.',
        hi: '**`employee.department_id ON DELETE SET NULL`** taaki ek department dissolve karna iske employees ko delete ya block na kare.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a foreign key constraint guarantee, and why keep it even when application code already manages the relationship?',
        qHi: 'Ek foreign key constraint kya guarantee karta hai, aur application code pehle se relationship manage karti ho tab bhi ise kyun rakhein?',
        a: 'A foreign key constraint guarantees that every non-null value in the constrained column matches the primary or unique key of some row that actually exists in the referenced table, at all times, for every writer. It is the mechanism that makes an orphaned reference, a child row pointing at a parent that does not exist, impossible rather than merely unlikely. The reason to keep it even when an ORM or service layer already maintains the relationship correctly during normal application flow is that the constraint is enforced at the database level for every path that writes to the table, not just the ones the application code anticipated. A bulk import script with a typo in a foreign key value, a manual UPDATE run directly against the database by an operator during an incident, a bug in a rarely exercised code path, or a race between two services writing concurrently can all introduce an orphan that application-level logic alone would miss. The database constraint is the one guarantee that holds regardless of which piece of code, or which human, made the write.',
        aHi: 'Ek foreign key constraint guarantee karta hai ki constrained column mein har non-null value referenced table mein asal mein exist karne waali kisi row ki primary ya unique key se match karti hai, hamesha, har writer ke liye. Ye wo mechanism hai jo ek orphaned reference ko impossible banata hai, sirf unlikely nahi. Ise rakhne ka kaaran, ek ORM ise pehle se manage karta ho tab bhi, ye hai ki constraint database level par har path ke liye enforce hoती hai jo table mein likhta hai, sirf wo nahi jo application code ne anticipate kiya. Ek galti waala bulk import script, ek manual UPDATE, ek race condition sab ek orphan introduce kar sakte hain jise sirf application-level logic miss kar deती.',
      },
      {
        q: 'When would you choose `ON DELETE CASCADE` versus `RESTRICT` versus `SET NULL`?',
        qHi: 'Aap `ON DELETE CASCADE` versus `RESTRICT` versus `SET NULL` kab choose karте ho?',
        a: 'The choice follows what the child record means in relation to its parent. CASCADE is right for true composition, where the child has no independent meaning apart from the parent: order line items when the order is deleted, comments when the post is deleted. Deleting the parent should reasonably mean deleting the whole structure beneath it. RESTRICT, which refuses the delete while any child still references the row, is right when the child records are too significant to disappear silently, financial records, invoices, anything where an accidental or careless delete of the parent should not be allowed to quietly take valuable data with it; it forces a human to make an explicit decision, archiving or reassigning the children, before the parent can go. SET NULL is right for a genuinely optional association, where the child is meaningful on its own even without that particular parent, an employee whose department was dissolved but who still exists and is still employed, just temporarily unassigned. It requires the foreign key column to be nullable, since that is literally what gets set. CASCADE is often reached for simply because it makes the foreign key error go away, but it is the most destructive of the options and should be chosen deliberately for genuine parent-owns-child relationships, not as a default to silence constraint violations.',
        aHi: 'Choice is baat par nirbhar karta hai ki child record apne parent ke sambandh mein kya matlab rakhता hai. CASCADE true composition ke liye sahi hai, jahaan child ka parent se alag koi independent meaning nahi. RESTRICT, jo kisi child ke abhi bhi row reference karne par delete refuse karta hai, tab sahi hai jab child records itne significant hain ki chupchaap gायab nahi honi chahिए, financial records, invoices. SET NULL ek genuinely optional association ke liye sahi hai, jahaan child us particular parent ke bina bhi apne aap mein meaningful hai. CASCADE aksar sirf isliye chuna jaता hai kyunki ye foreign key error gायab kar deता hai, par ye options mein sabse destructive hai.',
      },
    ],

    exercises: [
      {
        task: 'Tables `cart(id int PRIMARY KEY)` and `cart_item(id int PRIMARY KEY, cart_id int REFERENCES cart(id) ON DELETE CASCADE, product text)`. Insert a cart with 2 items, delete the cart, and confirm the items are gone too. Explain in a comment why `CASCADE` is appropriate here (a cart item has no meaning without its cart).',
        taskHi: 'Tables `cart(id PRIMARY KEY)` aur `cart_item(id PRIMARY KEY, cart_id REFERENCES cart(id) ON DELETE CASCADE, product)`. Ek cart 2 items ke saath insert karo, cart delete karo.',
        hint: 'A `cart_item` cannot exist independently of its `cart` — it has no meaning on its own. `CASCADE` is the right choice for composition relationships like this.',
        hintHi: 'Ek `cart_item` apne `cart` ke bina independently exist nahi kar sakta. `CASCADE` aise composition relationships ke liye sahi choice hai.',
      },
      {
        task: 'Tables `category(id int PRIMARY KEY)` and `product(id int PRIMARY KEY, category_id int REFERENCES category(id) ON DELETE RESTRICT)`. Insert a category with one product, try to delete the category, and observe the error. Then delete the product first, and confirm the category can now be deleted.',
        taskHi: 'Tables `category(id PRIMARY KEY)` aur `product(id PRIMARY KEY, category_id REFERENCES category(id) ON DELETE RESTRICT)`. Ek category ek product ke saath insert karo, category delete karne ki koshish karo.',
        hint: 'RESTRICT blocks the category delete while any product still references it. You must delete or reassign the product first — the constraint forces that explicit step.',
        hintHi: 'RESTRICT category delete ko block karta hai jab tak koi product ise reference karta hai. Aapko pehle product delete ya reassign karna hoga.',
      },
      {
        task: 'Tables `team(id int PRIMARY KEY)` and `player(id int PRIMARY KEY, team_id int REFERENCES team(id) ON DELETE SET NULL)`. Insert a team with 2 players, delete the team, and confirm the player rows still exist with `team_id` now `NULL`. Then try making `team_id` `NOT NULL` and observe why `SET NULL` then fails on delete.',
        taskHi: 'Tables `team(id PRIMARY KEY)` aur `player(id PRIMARY KEY, team_id REFERENCES team(id) ON DELETE SET NULL)`. Ek team 2 players ke saath insert karo, team delete karo.',
        hint: 'With `team_id NOT NULL`, `SET NULL` cannot satisfy both constraints — the delete will raise a not-null violation. `SET NULL` requires a nullable column.',
        hintHi: '`team_id NOT NULL` ke saath, `SET NULL` dono constraints satisfy nahi kar sakta — delete ek not-null violation raise karega. `SET NULL` ko ek nullable column chahiye.',
      },
    ],

    keyTakeaways: [
      'A FOREIGN KEY constraint guarantees every non-null value in the column matches an EXISTING row\'s key in the referenced table — makes ORPHAN ROWS impossible. `INSERT`/`UPDATE` violating it fails immediately: `violates foreign key constraint`.',
      'Keep FK constraints EVEN WITH an ORM: application code handles the normal path, but a database constraint is enforced for EVERY writer — bulk imports, manual operator `UPDATE`s, rare code paths, races between services.',
      'REFERENTIAL ACTIONS (`ON DELETE`/`ON UPDATE`): `CASCADE` (delete/update children too), `RESTRICT` (refuse while children exist), `NO ACTION` (like RESTRICT, checked at statement/transaction end), `SET NULL` (children survive, FK column -> `NULL`), `SET DEFAULT` (FK column -> its `DEFAULT`).',
      'CHOOSING: `CASCADE` for true COMPOSITION (child meaningless without parent — order_line/orders, comment/post). `RESTRICT`/`NO ACTION` for records too significant to vanish silently (invoice/customer) — forces a human decision. `SET NULL` for a genuinely OPTIONAL association where the child stands alone (employee/department) — requires the FK column to be NULLABLE.',
      '`CASCADE` is NOT automatically "the safe default" — it is the MOST DESTRUCTIVE option, silently deleting an unbounded amount of child data with no confirmation. Choose it deliberately, not as a way to make FK errors disappear.',
      'A table CAN reference itself (self-referencing FK) — `employee.manager_id REFERENCES employee(id)` — enforcing the same "must point to an existing row" guarantee for hierarchies (Module 3/5\'s org-chart recursive CTEs).',
      'PostgreSQL does NOT auto-index a foreign key column (unlike the PK/unique key it references, which IS always indexed). Every `ON DELETE`/`ON UPDATE` check and every join to the parent scans the child table for matches — ALWAYS index FK columns explicitly (`CREATE INDEX ON child (fk_column)`), or it\'s a full scan every time (Module 10).',
    ],
    keyTakeawaysHi: [
      'Ek FOREIGN KEY constraint guarantee karta hai ki column mein har non-null value referenced table mein ek EXISTING row ki key se match karti hai — ORPHAN ROWS ko impossible banata hai. Isko violate karne waala `INSERT`/`UPDATE` turant fail hota hai.',
      'ORM ke SAATH BHI FK constraints rakho: application code normal path handle karti hai, par ek database constraint HAR writer ke liye enforce hoti hai — bulk imports, manual operator `UPDATE`s, races.',
      'REFERENTIAL ACTIONS (`ON DELETE`/`ON UPDATE`): `CASCADE` (children bhi delete), `RESTRICT` (children maujood hone par refuse), `NO ACTION` (RESTRICT jaisa), `SET NULL` (children bachte hain, FK column -> `NULL`), `SET DEFAULT` (FK column -> `DEFAULT`).',
      'CHOOSING: true COMPOSITION ke liye `CASCADE`. Bahut significant records ke liye `RESTRICT`/`NO ACTION` — human decision force karta hai. Genuinely OPTIONAL association ke liye `SET NULL` — FK column NULLABLE hona chahiye.',
      '`CASCADE` automatically "safe default" NAHI hai — ye SABSE DESTRUCTIVE option hai. Ise deliberately choose karo, FK errors gayab karne ke tarike ke roop mein nahi.',
      'Ek table KHUD ko reference kar sakti hai (self-referencing FK) — hierarchies ke liye wahi "existing row ki taraf point karna chahiye" guarantee enforce karte hue.',
      'PostgreSQL ek foreign key column ko auto-index NAHI karta. Har `ON DELETE`/`ON UPDATE` check aur parent tak har join child table ko matches ke liye scan karta hai — HAMESHA FK columns ko explicitly index karo.',
    ],
  },

  {
    slug: 'sql-first-and-second-normal-form',
    title: 'First & Second Normal Form',
    titleHi: 'First Aur Second Normal Form',
    description: '**1NF**: every column holds a single, atomic value — no repeating groups, no comma-separated lists. **2NF**: builds on 1NF, and additionally every non-key column depends on the WHOLE primary key, not just part of it — relevant only when the key is composite.',
    descriptionHi: '**1NF**: har column ek single, atomic value rakhta hai — koi repeating groups nahi, koi comma-separated lists nahi. **2NF**: 1NF par banता hai, aur additionally har non-key column POORI primary key par depend karta hai, sirf iske hisse par nahi — sirf tab relevant jab key composite ho.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**One index card per fact, and every card fully explained by the whole label on its drawer, not just half the label.** Imagine a card catalogue where a librarian, in a hurry, writes "Widget, Gadget, Gizmo" on a single card under one order number, instead of three separate cards. To find every order containing "Gadget", you would have to read every card\'s messy paragraph and search inside the text — that clumsy single-card-many-facts habit is exactly what **1NF** forbids: it demands one fact per card (an atomic value per column), so "does order 5 contain Gadget" is a lookup, not a text search. Now imagine the catalogue is filed under a two-part drawer label, "student, course" — because a student\'s grade in a course genuinely needs both parts to make sense. But someone also writes the course\'s full name on every one of those cards. That name has nothing to do with *which student* — it is explained by the "course" half of the label alone, not the whole label. **2NF** is the rule that catches this: every fact on a card must depend on the *entire* drawer label, not just part of it. The course name belongs on its own card, filed under "course" alone.',
      hi: '**Prati fact ek index card, aur har card iske drawer ke poore label se poori tarah explained, sirf aadhe label se nahi.** Ek card catalogue socho jahaan ek librarian, jaldi mein, ek order number ke andar ek single card par "Widget, Gadget, Gizmo" likhता hai, teen alag cards ke bजाy. "Gadget" waale har order ko dhoondne ke liye, aapको har card ka messy paragraph padhна hoगा — wo clumsy single-card-many-facts habit theek wahi hai jo **1NF** forbid karta hai: ye prati card ek fact maangta hai (prati column ek atomic value), to "kya order 5 mein Gadget hai" ek lookup hai, ek text search nahi. Ab socho catalogue ek two-part drawer label, "student, course" ke under filed hai — kyunki ek course mein ek student ka grade genuinely dono parts ki zaroorat rakhta hai matlab banane ke liye. Par koi course ka poora naam bhi har us card par likhता hai. Wo naam is baat se koi lena-dena nahi rakhta ki *kaunसा student* — ye label ke "course" hisse akele se explained hai, poore label se nahi. **2NF** wo niyam hai jo ise pakड़ता hai: ek card ka har fact *poore* drawer label par depend karna chahिए, sirf iske hisse par nahi.',
    },

    simple: `**1NF violation: a comma-separated repeating group in one column**

\`\`\`sql
CREATE TABLE bad_order (id int, items text);
INSERT INTO bad_order VALUES (1, 'Widget,Gadget,Gizmo');
-- "which orders contain Gadget" needs string parsing -- LIKE '%Gadget%', fragile and slow
SELECT * FROM bad_order WHERE items LIKE '%Gadget%';
\`\`\`

**1NF fix: one row per fact — atomic values**

\`\`\`sql
CREATE TABLE order_item (order_id int, item text);
INSERT INTO order_item VALUES (1,'Widget'), (1,'Gadget'), (1,'Gizmo');
SELECT * FROM order_item WHERE item = 'Gadget';   -- an ordinary, indexable equality lookup
\`\`\`

**2NF violation: a column depends on only PART of a composite key**

\`\`\`sql
-- PK is (student_id, course_id) -- but course_name only depends on course_id
CREATE TABLE enroll_bad (student_id int, course_id int, course_name text, grade text,
                         PRIMARY KEY (student_id, course_id));
-- renaming a course means updating it on EVERY enrollment row -- an update anomaly
UPDATE enroll_bad SET course_name = 'Databases 101' WHERE course_id = 101;
\`\`\`

**2NF fix: split off the partially-dependent column into its own table**

\`\`\`sql
CREATE TABLE course (course_id int PRIMARY KEY, course_name text);
CREATE TABLE enrollment (student_id int, course_id int REFERENCES course(course_id), grade text,
                         PRIMARY KEY (student_id, course_id));
-- renaming a course is now ONE row, not N
UPDATE course SET course_name = 'Databases 101' WHERE course_id = 101;
\`\`\`

**The anomalies normalization removes**

\`\`\`
INSERT anomaly  -- can't record a fact without also recording an unrelated one
                --  (can't add a course with no students enrolled, if course_name lives on enroll_bad)
UPDATE anomaly  -- one logical fact requires updating many rows -- risk of partial update
DELETE anomaly  -- deleting the "last" row also deletes a fact that should have survived
                --  (deleting the last enrollment in a course loses the course's name entirely)
\`\`\``,

    simpleHi: `**1NF violation: ek column mein ek comma-separated repeating group**

\`\`\`sql
CREATE TABLE bad_order (id int, items text);
INSERT INTO bad_order VALUES (1, 'Widget,Gadget,Gizmo');
-- "Gadget waale orders kaunse hain" ko string parsing chahiye -- fragile aur slow
SELECT * FROM bad_order WHERE items LIKE '%Gadget%';
\`\`\`

**1NF fix: prati fact ek row — atomic values**

\`\`\`sql
CREATE TABLE order_item (order_id int, item text);
INSERT INTO order_item VALUES (1,'Widget'), (1,'Gadget'), (1,'Gizmo');
SELECT * FROM order_item WHERE item = 'Gadget';   -- ek ordinary, indexable equality lookup
\`\`\`

**2NF violation: ek column composite key ke sirf HISSE par depend karta hai**

\`\`\`sql
-- PK (student_id, course_id) hai -- par course_name sirf course_id par depend karta hai
CREATE TABLE enroll_bad (student_id int, course_id int, course_name text, grade text,
                         PRIMARY KEY (student_id, course_id));
-- ek course rename karna matlab HAR enrollment row par update -- ek update anomaly
UPDATE enroll_bad SET course_name = 'Databases 101' WHERE course_id = 101;
\`\`\`

**2NF fix: partially-dependent column ko apni table mein split karo**

\`\`\`sql
CREATE TABLE course (course_id int PRIMARY KEY, course_name text);
CREATE TABLE enrollment (student_id int, course_id int REFERENCES course(course_id), grade text,
                         PRIMARY KEY (student_id, course_id));
-- ek course rename karna ab EK row hai, N nahi
UPDATE course SET course_name = 'Databases 101' WHERE course_id = 101;
\`\`\`

**Anomalies jo normalization hataता hai**

\`\`\`
INSERT anomaly  -- ek unrelated fact record kiye bina ek fact record nahi kar sakte
UPDATE anomaly  -- ek logical fact ke liye kई rows update karni padti hain -- partial update ka risk
DELETE anomaly  -- "aakhri" row delete karna ek fact bhi delete kar deta hai jo bachna chahiye tha
\`\`\``,

    content: `## What normalization is for

**Normalization** is a sequence of design rules ("normal forms") that eliminate redundancy by ensuring each fact is stored **exactly once**, in the table where it logically belongs. The payoff is avoiding three classic **anomalies**:

- **Insert anomaly** — you cannot record a fact without also recording an unrelated one (e.g. you cannot add a new course to the catalog until at least one student enrolls in it, if the course's name only lives inside enrollment rows).
- **Update anomaly** — a single logical fact is duplicated across many rows, so changing it means updating all of them, and missing even one leaves the data **inconsistent** (two rows disagreeing about the same course's name).
- **Delete anomaly** — deleting one row accidentally destroys a fact that had nothing to do with the reason for the delete (deleting the only student enrolled in a course erases the course's name entirely, if that name lived nowhere else).

Each normal form is a stricter rule than the last; **1NF ⊂ 2NF ⊂ 3NF** (Lesson 4) **⊂ BCNF** (Lesson 4) — a table in 3NF is automatically in 2NF and 1NF too.

## First Normal Form (1NF)

A table is in 1NF when:

1. Every column holds a single, **atomic** value — no lists, no comma-separated strings, no arrays standing in for a relationship.
2. There are no **repeating groups** — no \`item1, item2, item3\` columns for "however many items this order has".
3. Each row is uniquely identifiable (there is a primary key).

\`\`\`sql
-- violates 1NF: items is not atomic; searching/joining on one item is painful
CREATE TABLE bad_order (id int, items text);   -- 'Widget,Gadget,Gizmo'

-- 1NF: one row per (order, item) fact
CREATE TABLE order_item (order_id int, item text);
\`\`\`

The comma-separated column *looks* efficient (one row instead of three) but breaks every relational operation: you cannot \`JOIN\` on an individual item, cannot \`COUNT\` items with plain SQL, cannot enforce "no duplicate item per order" with a constraint, and \`WHERE items LIKE '%Gadget%'\` cannot use a normal index and will also match \`'Gadget2'\`. The fix — one row per atomic fact — is the essence of the relational model itself.

## Functional dependencies — the concept 2NF and 3NF are built on

A **functional dependency** \`A → B\` ("A determines B") means: for any two rows with the same value of \`A\`, they must also have the same value of \`B\`. \`course_id → course_name\` is a functional dependency — knowing the course id tells you the course name unambiguously. Every column's normal-form status is really a question about which functional dependencies exist and whether they point at the *whole* key or only *part* of it.

## Second Normal Form (2NF)

A table is in 2NF when it is in 1NF **and** every non-key column depends on the **entire** primary key — not on just some subset of it. This rule is only meaningful for tables with a **composite** primary key; a table with a single-column key automatically satisfies 2NF once it satisfies 1NF (there is no "part of the key" to partially depend on).

\`\`\`sql
-- PK = (student_id, course_id). course_name depends ONLY on course_id -- a PARTIAL dependency.
CREATE TABLE enroll_bad (student_id int, course_id int, course_name text, grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

\`course_name\` is a fact about the *course*, not about the *enrollment* (the student+course pair). Storing it here means it is duplicated once per student enrolled in that course, producing exactly the anomalies above: renaming a course requires an \`UPDATE\` touching every enrollment row (update anomaly); the course cannot exist in the catalog before its first student enrolls (insert anomaly); deleting the last enrollment in a course erases the course's name forever (delete anomaly).

**The 2NF fix:** move the partially-dependent column to a table keyed by the part of the composite key it actually depends on:

\`\`\`sql
CREATE TABLE course (course_id int PRIMARY KEY, course_name text);
CREATE TABLE enrollment (student_id int, course_id int REFERENCES course(course_id), grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

Now \`course_name\` is stored exactly once per course, \`grade\` (which genuinely depends on the *whole* student+course pair — a student's grade in one course is unrelated to their grade in another) stays in \`enrollment\`, and the FK ties them together.

## When to stop worrying about 2NF

If every table you design has a single-column surrogate primary key (Lesson 1's default recommendation), 2NF is **automatically satisfied** — the "partial dependency on a composite key" problem cannot arise when there is no composite key to begin with. 2NF becomes a live concern specifically in **junction tables** (Lesson 5) and any other table you deliberately key by more than one column.`,

    contentHi: `## Normalization kis liye hai

**Normalization** design rules ("normal forms") ka ek sequence hai jo redundancy ko eliminate karta hai ye ensure karके ki har fact **theek ek baar** store hoता hai, us table mein jahaan wo logically belong karta hai. Payoff teen classic **anomalies** avoid karna hai:

- **Insert anomaly** — aap ek unrelated fact record kiye bina ek fact record nahi kar sakte.
- **Update anomaly** — ek single logical fact kई rows mein duplicated hai, to ise badalne ka matlab sabko update karna hai, aur ek bhi miss karna data ko **inconsistent** chhodता hai.
- **Delete anomaly** — ek row delete karna accidentally ek fact destroy kar deta hai jiska delete ki wajah se koi lena-dena nahi.

Har normal form pichli se ek strict niyam hai; **1NF ⊂ 2NF ⊂ 3NF** (Lesson 4) **⊂ BCNF** (Lesson 4).

## First Normal Form (1NF)

Ek table 1NF mein hai jab:
1. Har column ek single, **atomic** value rakhta hai — koi lists nahi.
2. Koi **repeating groups** nahi.
3. Har row uniquely identifiable hai.

\`\`\`sql
-- 1NF violate karta hai: items atomic nahi hai
CREATE TABLE bad_order (id int, items text);

-- 1NF: prati (order, item) fact ek row
CREATE TABLE order_item (order_id int, item text);
\`\`\`

Comma-separated column *efficient* dikhता hai par har relational operation todता hai: aap ek individual item par \`JOIN\` nahi kar sakte, plain SQL se items \`COUNT\` nahi kar sakte, "prati order koi duplicate item nahi" ek constraint se enforce nahi kar sakte. Fix — prati atomic fact ek row — relational model ka essence hai.

## Functional dependencies — wo concept jispar 2NF aur 3NF bante hain

Ek **functional dependency** \`A → B\` ("A determines B") ka matlab: same \`A\` value waali kisi bhi do rows ka same \`B\` value hona chahिए. \`course_id → course_name\` ek functional dependency hai.

## Second Normal Form (2NF)

Ek table 2NF mein hai jab ye 1NF mein hai **aur** har non-key column **poori** primary key par depend karta hai. Ye niyam sirf **composite** primary key waali tables ke liye meaningful hai.

\`\`\`sql
-- PK = (student_id, course_id). course_name SIRF course_id par depend karta hai -- ek PARTIAL dependency.
CREATE TABLE enroll_bad (student_id int, course_id int, course_name text, grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

\`course_name\` *course* ke baare mein ek fact hai, *enrollment* ke baare mein nahi. Ise yahaan store karna matlab ye prati student ek baar duplicated hai.

**2NF fix:** partially-dependent column ko us table mein le jाओ jo iske actual depend hone waale key ke hisse se keyed hai:

\`\`\`sql
CREATE TABLE course (course_id int PRIMARY KEY, course_name text);
CREATE TABLE enrollment (student_id int, course_id int REFERENCES course(course_id), grade text,
                         PRIMARY KEY (student_id, course_id));
\`\`\`

## 2NF ke baare mein chinta karna kab band karें

Agar aap jo bhi table design karte ho uski ek single-column surrogate primary key hai, 2NF **automatically satisfy** hota hai. 2NF khaas taur par **junction tables** (Lesson 5) mein ek live concern banता hai.`,

    examples: [
      {
        title: '1NF violation: a repeating group makes item-level queries fragile',
        titleHi: '1NF violation: ek repeating group item-level queries ko fragile banata hai',
        code: `CREATE TABLE bad_order (id int, items text);
INSERT INTO bad_order VALUES (1, 'Widget,Gadget,Gizmo');

-- fragile string match -- also matches "Gadget2" or "MegaGadget"
SELECT * FROM bad_order WHERE items LIKE '%Gadget%';

-- 1NF fix: atomic values, one row per (order, item) fact
CREATE TABLE order_item (order_id int, item text);
INSERT INTO order_item VALUES (1,'Widget'), (1,'Gadget'), (1,'Gizmo');
SELECT * FROM order_item WHERE item = 'Gadget';`,
        output: ` id | items
----+---------------------
 1  | Widget,Gadget,Gizmo
(1 row)

 order_id | item
----------+--------
 1        | Gadget
(1 row)`,
        explain: "The comma-separated `items` column stores three facts in one value — a 1NF violation. Finding orders containing 'Gadget' needs a fragile `LIKE '%Gadget%'` pattern match that also matches unrelated names like 'MegaGadget'. The fixed design, `order_item` with one row per (order, item) fact, turns the same question into an ordinary, exact, indexable equality lookup.",
        explainHi: "Comma-separated `items` column ek value mein teen facts store karta hai — ek 1NF violation. 'Gadget' waale orders dhoondne ke liye ek fragile `LIKE '%Gadget%'` pattern match chahiye jo 'MegaGadget' jaise unrelated names bhi match karta hai. Fixed design, `order_item` prati (order, item) fact ek row ke saath, wahi sawaal ko ek ordinary, exact, indexable equality lookup mein badal deta hai.",
      },
      {
        title: '2NF violation: renaming a course requires updating every enrollment row',
        titleHi: '2NF violation: ek course rename karne ke liye har enrollment row update karni padti hai',
        code: `CREATE TABLE enroll_bad (student_id int, course_id int, course_name text, grade text,
                         PRIMARY KEY (student_id, course_id));
INSERT INTO enroll_bad VALUES (1, 101, 'SQL 101', 'A'), (2, 101, 'SQL 101', 'B');

-- one logical rename touches BOTH rows -- an update anomaly waiting to happen
UPDATE enroll_bad SET course_name = 'Databases 101' WHERE course_id = 101;
SELECT * FROM enroll_bad ORDER BY student_id;`,
        output: ` student_id | course_id | course_name   | grade
------------+-----------+---------------+-------
 1          | 101       | Databases 101 | A
 2          | 101       | Databases 101 | B
(2 rows)`,
        explain: 'The primary key is `(student_id, course_id)`, but `course_name` depends ONLY on `course_id` — a partial dependency, since it has nothing to do with WHICH student. Both students share course 101, so `course_name` is duplicated across both rows. Renaming the course means updating it on EVERY enrollment row sharing that course_id — an update anomaly waiting to strike if even one row is missed.',
        explainHi: 'Primary key `(student_id, course_id)` hai, par `course_name` SIRF `course_id` par depend karta hai — ek partial dependency, kyunki iska is baat se koi lena-dena nahi ki KAUNSA student. Dono students course 101 share karte hain, to `course_name` dono rows mein duplicated hai. Course rename karna matlab us course_id share karne waali HAR enrollment row update karna — ek update anomaly jo ek row miss hone par hamla karti hai.',
      },
      {
        title: '2NF fix: course_name moves to its own table, renaming is one row',
        titleHi: '2NF fix: course_name apni table mein jaata hai, rename ek row hai',
        code: `CREATE TABLE course (course_id int PRIMARY KEY, course_name text);
CREATE TABLE enrollment (student_id int, course_id int REFERENCES course(course_id), grade text,
                         PRIMARY KEY (student_id, course_id));
INSERT INTO course VALUES (101, 'SQL 101');
INSERT INTO enrollment VALUES (1,101,'A'), (2,101,'B');

-- ONE row changes, no matter how many students are enrolled
UPDATE course SET course_name = 'Databases 101' WHERE course_id = 101;

SELECT e.student_id, c.course_name, e.grade
FROM enrollment e JOIN course c ON c.course_id = e.course_id
ORDER BY e.student_id;`,
        output: ` student_id | course_name   | grade
------------+---------------+-------
 1          | Databases 101 | A
 2          | Databases 101 | B
(2 rows)`,
        explain: 'Splitting `course_name` into its own `course` table, keyed by `course_id` alone, fixes the partial dependency: now the name is stored exactly ONCE per course. Renaming touches a single row in `course`, regardless of how many students are enrolled, and the `JOIN` reassembles the same information for every student — no duplication, no risk of one row being missed.',
        explainHi: '`course_name` ko apni `course` table mein split karna, sirf `course_id` se keyed, partial dependency fix karta hai: ab naam prati course THEEK EK BAAR stored hai. Rename karna `course` mein ek single row touch karta hai, chahe kितne bhi students enrolled hon, aur `JOIN` har student ke liye wahi information reassemble karta hai — koi duplication nahi, ek row miss hone ka koi risk nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `-- "a product can have up to 3 tags" -- modeled as repeating columns
CREATE TABLE product (id int PRIMARY KEY, name text, tag1 text, tag2 text, tag3 text);
-- what about a 4th tag? and "find all products tagged 'sale'" needs 3 separate comparisons`,
        right: `CREATE TABLE product (id int PRIMARY KEY, name text);
CREATE TABLE product_tag (product_id int REFERENCES product(id), tag text,
                          PRIMARY KEY (product_id, tag));
-- any number of tags, and "find products tagged 'sale'" is a single equality lookup`,
        why: 'Numbered columns like tag1, tag2, tag3 are a repeating group in disguise, the same 1NF violation as a comma-separated list, just spread across columns instead of packed into one. It hardcodes an arbitrary limit, three tags, that will eventually be wrong, and it makes every tag-related query awkward: finding products tagged sale requires checking tag1 equals sale or tag2 equals sale or tag3 equals sale, and counting how many tags a product has requires counting non-null columns rather than counting rows. A separate product_tag table with one row per (product, tag) pair removes the arbitrary limit, lets a normal index support the lookup, and lets a composite primary key enforce no duplicate tag per product for free.',
        whyHi: 'Numbered columns jaisा `tag1, tag2, tag3` ek disguise mein repeating group hai, same 1NF violation jo ek comma-separated list hai, bस columns ke across spread hai ek mein pack hone ke bजाy. Ye ek arbitrary limit, teen tags, hardcode karta hai jo aakhirkar galat hogа, aur ye har tag-related query ko awkward banata hai. Ek alag `product_tag` table prati (product, tag) pair ek row ke saath arbitrary limit hataता hai, ek normal index ko lookup support karने deता hai.',
      },
      {
        wrong: `-- (order_id, product_id) composite key, but product_name and product_price stored here too
CREATE TABLE order_line (order_id int, product_id int, product_name text, product_price int, qty int,
                         PRIMARY KEY (order_id, product_id));
-- product_name and product_price depend ONLY on product_id, not on (order_id, product_id)`,
        right: `CREATE TABLE product (id int PRIMARY KEY, name text, price int);
CREATE TABLE order_line (order_id int, product_id int REFERENCES product(id), qty int,
                         PRIMARY KEY (order_id, product_id));
-- product facts live once in "product"; order_line only holds facts about the ORDERING of it`,
        why: 'The primary key here is the pair, order and product, but product_name and product_price are facts about the product alone, unrelated to which order it appears in: that is a partial dependency, exactly what second normal form forbids. Storing them in order_line means the same product\'s name and price are copied into every order line that includes it, so a price change requires updating every historical order line rather than the one product row, and worse, it silently rewrites what price was actually charged on past orders, which is usually the opposite of what you want. The fix separates facts about the product, which belong in a product table keyed by product id alone, from facts about the act of ordering it, quantity, which genuinely depends on the whole composite key.',
        whyHi: 'Yahaan primary key jodi hai, order aur product, par `product_name` aur `product_price` sirf product ke baare mein facts hain, is baat se unrelated ki ye kaunse order mein aata hai: wo ek partial dependency hai, theek wo jo second normal form forbid karta hai. Unhe `order_line` mein store karna matlab wahi product ka name aur price har order line mein copy hota hai jisme ye include hai, to ek price change ko har historical order line update karni padegi ek product row ke bजाy.',
      },
      {
        wrong: `-- "fixing" 1NF by using a JSON array instead of a comma-separated string -- still a repeating group
CREATE TABLE bad_order2 (id int, items jsonb);
INSERT INTO bad_order2 VALUES (1, '["Widget","Gadget","Gizmo"]');
-- still can't JOIN on an item, still can't put a UNIQUE constraint on "no duplicate item"`,
        right: `CREATE TABLE order_item (order_id int, item text, PRIMARY KEY (order_id, item));
-- a real relational table -- joinable, indexable, constrainable`,
        why: 'Switching from a comma-separated string to a JSON array is a cosmetic improvement, not a structural one: the column still holds a repeating group of values rather than one atomic value, so it still cannot be joined on directly, still cannot have a uniqueness constraint enforced per item without an application-level check, and still requires a JSON-aware query for anything item-specific rather than an ordinary indexed equality lookup. JSON columns have legitimate uses for genuinely semi-structured or schema-flexible data (Module 11), but using one to avoid designing a proper child table for what is really a one-to-many relationship reintroduces the same 1NF problems in a more modern-looking wrapper.',
        whyHi: 'Comma-separated string se JSON array par switch karna ek cosmetic improvement hai, structural nahi: column abhi bhi values ka ek repeating group rakhता hai, ek atomic value nahi, to isे abhi bhi seedhे join nahi kiya ja sakta, abhi bhi prati item ek uniqueness constraint bina application-level check ke enforce nahi kiya ja sakta. JSON columns genuinely semi-structured data ke liye legitimate uses rakhते hain (Module 11), par ek real one-to-many relationship ke liye ek proper child table design karne se bachne ke liye ek istemal karna wahi 1NF problems ko ek modern-dikhने waale wrapper mein reintroduce karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A migration that split a legacy `orders.item_list` comma-separated column into a proper `order_item` table** — enabling a "top-selling item" report that was previously impossible without parsing every row in application code.',
        hi: '**Ek migration jo ek legacy `orders.item_list` comma-separated column ko ek proper `order_item` table mein split karta hai** — ek "top-selling item" report enable karte hue.',
      },
      {
        en: '**A schema review flagging `product_name` duplicated across every `order_line` row** as a 2NF violation, moved into a `product` table referenced by `product_id` — protecting historical order prices from silent rewrites.',
        hi: '**Ek schema review jo har `order_line` row mein duplicated `product_name` ko flag karta hai** ek 2NF violation ke roop mein.',
      },
      {
        en: '**A junction table `enrollment(student_id, course_id, grade)`** where `grade` genuinely depends on the whole pair, while `student.name` and `course.title` correctly live in their own single-key tables.',
        hi: '**Ek junction table `enrollment(student_id, course_id, grade)`** jahaan `grade` genuinely poori jodi par depend karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does First Normal Form require, and why does a comma-separated list column violate it?',
        qHi: 'First Normal Form kya maangta hai, aur ek comma-separated list column ise kyun violate karta hai?',
        a: 'First normal form requires that every column hold a single atomic value, that there be no repeating groups, columns like item one, item two, item three standing in for an unknown number of related facts, and that every row be uniquely identifiable. A column holding a comma-separated string, such as a list of item names for an order, violates this directly: it is packing what should be several facts, one per item, into a single value. The practical consequences are what make this a real problem rather than a stylistic one. You cannot join on an individual item, because the relational join mechanism operates on whole column values, not substrings within one. You cannot enforce a constraint like no duplicate item per order, because the database has no concept of the individual items inside that string. Counting items requires string manipulation rather than counting rows. And searching for a specific item means a pattern match like LIKE percent Gadget percent, which cannot use a normal index efficiently and will incorrectly match a different item whose name happens to contain the same substring, like Gadget2. The fix is a separate table with one row per order and item pair, which restores all of the ordinary relational operations: joins, constraints, counts, and indexed lookups.',
        aHi: 'First normal form maangta hai ki har column ek single atomic value rakhe, koi repeating groups na hon, aur har row uniquely identifiable ho. Ek comma-separated string rakhne waala column, jaise ek order ke item names ki list, ise seedhे violate karta hai: ye wo pack kar raha hai jo kई facts hone chahiye, prati item ek, ek single value mein. Practical consequences: aap ek individual item par join nahi kar sakte, aap "prati order koi duplicate item nahi" jaisa ek constraint enforce nahi kar sakte, items count karne ke liye string manipulation chahiye. Fix ek alag table hai prati order-aur-item jodi ek row ke saath.',
      },
      {
        q: 'What is a functional dependency, and how does it explain the Second Normal Form rule?',
        qHi: 'Ek functional dependency kya hai, aur ye Second Normal Form niyam ko kaise explain karta hai?',
        a: 'A functional dependency, written A determines B, means that for any two rows sharing the same value of A, they must also share the same value of B, so knowing A tells you B unambiguously. Course id determines course name is a functional dependency: given a course id, the course name is fixed. Second normal form builds directly on this idea. It says a table, already in first normal form, must have every non-key column depend on the entire primary key, not on just part of it, and this rule only has teeth when the primary key is composite, made of more than one column. If a table is keyed by student id and course id together, and it also stores course name, that column depends only on course id, one part of the key, not on the student id half at all; that is called a partial dependency, and it is exactly what second normal form forbids. The practical symptom is duplication: course name gets copied once for every student enrolled in that course, which is what produces the classic insert, update, and delete anomalies. The fix is always the same shape: move the partially-dependent column into a table keyed by just the part of the composite key it actually depends on, here a separate course table keyed by course id alone.',
        aHi: 'Ek functional dependency, A determines B likhी gayi, ka matlab hai ki same A value share karने waali kisi bhi do rows ko same B value bhi share karна chahiye, to A jaanna aapko B batata hai unambiguously. Second normal form seedhे is idea par banta hai. Ye kehta hai ki ek table, pehle se first normal form mein, ka har non-key column poori primary key par depend karna chahiye, sirf iske hisse par nahi, aur ye niyam sirf tab maayne rakhta hai jab primary key composite ho. Practical symptom duplication hai: course name us course mein enrolled har student ke liye ek baar copy hota hai. Fix hamesha wahi shape hai: partially-dependent column ko us table mein le jाओ jo composite key ke us hisse se keyed hai jispar ye asal mein depend karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `student_bad(id int, name text, phone_numbers text)` storing phones as `\'555-1234,555-5678\'`. Redesign as `student(id, name)` and `student_phone(student_id, phone)`. Insert 2 phones for one student in the new design and write a query finding the student with phone `555-5678`.',
        taskHi: 'Table `student_bad(id, name, phone_numbers)` phones ko `\'555-1234,555-5678\'` ke roop mein store karte hue. `student(id, name)` aur `student_phone(student_id, phone)` ke roop mein redesign karo.',
        hint: 'The redesign lets `WHERE phone = \'555-5678\'` be an ordinary indexed equality lookup instead of a `LIKE` pattern match over the whole comma-separated string.',
        hintHi: 'Redesign `WHERE phone = \'555-5678\'` ko ek ordinary indexed equality lookup banata hai, poore comma-separated string par ek `LIKE` pattern match ke bajaye.',
      },
      {
        task: 'Table `order_line_bad(order_id int, product_id int, product_name text, qty int, PRIMARY KEY (order_id, product_id))` where `product_name` repeats for every order containing that product. Identify the functional dependency causing the 2NF violation, then redesign into `product(id, name)` + `order_line(order_id, product_id, qty)`.',
        taskHi: 'Table `order_line_bad(order_id, product_id, product_name, qty, PRIMARY KEY (order_id, product_id))` jahaan `product_name` har order ke liye repeat hota hai. 2NF violation ka kaaran functional dependency identify karo.',
        hint: '`product_id -> product_name` is the partial dependency: `product_name` depends only on `product_id`, not on the whole `(order_id, product_id)` key. Move it to a `product` table keyed by `product_id` alone.',
        hintHi: '`product_id -> product_name` partial dependency hai: `product_name` sirf `product_id` par depend karta hai, poori `(order_id, product_id)` key par nahi.',
      },
      {
        task: 'Table `enroll_bad(student_id, course_id, course_name, instructor_name, grade, PRIMARY KEY (student_id, course_id))`. Identify TWO columns with a partial dependency on `course_id` alone, and redesign into a `course` table holding both, plus a slim `enrollment(student_id, course_id, grade)`.',
        taskHi: 'Table `enroll_bad(student_id, course_id, course_name, instructor_name, grade, PRIMARY KEY (student_id, course_id))`. `course_id` par partial dependency waale DO columns identify karo.',
        hint: 'Both `course_name` and `instructor_name` depend only on `course_id`, not on `student_id`. Both move to the `course` table; only `grade` (which depends on the whole student+course pair) stays in `enrollment`.',
        hintHi: '`course_name` aur `instructor_name` dono sirf `course_id` par depend karte hain, `student_id` par nahi. Dono `course` table mein jaate hain; sirf `grade` `enrollment` mein rehta hai.',
      },
    ],

    keyTakeaways: [
      'NORMALIZATION eliminates redundancy by storing each fact EXACTLY ONCE, avoiding: INSERT anomaly (can\'t record a fact without an unrelated one), UPDATE anomaly (one logical change = many rows to update, risk of inconsistency), DELETE anomaly (deleting one row destroys an unrelated fact). Forms nest: `1NF ⊂ 2NF ⊂ 3NF ⊂ BCNF`.',
      '1NF: every column holds a SINGLE ATOMIC value (no comma-separated lists, no numbered `tag1/tag2/tag3` columns — a repeating group in disguise), no repeating groups, rows uniquely identifiable. A comma-list or JSON-array column both fail this — neither can be joined on, constrained per-element, or indexed for an exact-item lookup.',
      'FUNCTIONAL DEPENDENCY `A -> B`: any two rows sharing the same `A` must share the same `B` (`course_id -> course_name`). 2NF and 3NF (Lesson 4) are really questions about which FDs exist and whether they target the WHOLE key or only PART of it.',
      '2NF: (1NF) + every non-key column depends on the ENTIRE primary key, not just part of it. ONLY relevant for COMPOSITE keys — a single-column key table satisfies 2NF automatically once it satisfies 1NF (no "part of the key" to partially depend on).',
      'A PARTIAL DEPENDENCY (e.g. `course_name` depending only on `course_id`, not the full `(student_id, course_id)` key) means that column is duplicated once per row sharing that partial key — the classic symptom, and the direct cause of the three anomalies.',
      '2NF FIX: move the partially-dependent column to a table keyed by just the part of the composite key it actually depends on (`course_name` -> a `course` table keyed by `course_id` alone); keep in the original table only columns that depend on the WHOLE key (`grade` depends on student+course together).',
      '2NF becomes a LIVE CONCERN specifically for JUNCTION TABLES (Lesson 5) and any table deliberately keyed by 2+ columns — with the surrogate-single-column-PK default (Lesson 1), 2NF is automatic.',
    ],
    keyTakeawaysHi: [
      'NORMALIZATION redundancy ko eliminate karta hai har fact ko THEEK EK BAAR store karke, avoid karte hue: INSERT anomaly, UPDATE anomaly, DELETE anomaly. Forms nest karte hain: `1NF ⊂ 2NF ⊂ 3NF ⊂ BCNF`.',
      '1NF: har column ek SINGLE ATOMIC value rakhta hai, koi repeating groups nahi, rows uniquely identifiable. Ek comma-list ya JSON-array column dono ise fail karte hain — na koi join, na constrain, na indexed lookup.',
      'FUNCTIONAL DEPENDENCY `A -> B`: same `A` share karne waali koi bhi do rows same `B` share karti hain. 2NF aur 3NF (Lesson 4) asal mein sawaal hain ki kaunse FDs exist karte hain aur wo POORI key ya sirf HISSE ko target karte hain.',
      '2NF: (1NF) + har non-key column POORI primary key par depend karta hai, sirf iske hisse par nahi. SIRF COMPOSITE keys ke liye relevant.',
      'Ek PARTIAL DEPENDENCY (jaise `course_name` sirf `course_id` par depend karta) ka matlab wo column us partial key share karne waali prati row duplicated hai — classic symptom.',
      '2NF FIX: partially-dependent column ko us table mein le jao jo composite key ke us hisse se keyed hai jispar ye asal mein depend karta hai; original table mein sirf wo columns rakho jo POORI key par depend karte hain.',
      '2NF specifically JUNCTION TABLES (Lesson 5) aur 2+ columns se keyed kisi bhi table ke liye ek LIVE CONCERN banta hai — surrogate-single-column-PK default ke saath, 2NF automatic hai.',
    ],
  },
];
