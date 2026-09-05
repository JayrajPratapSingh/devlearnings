/**
 * Databases Complete Course — Module 11: PostgreSQL Power Features, lessons 1-3.
 * Part II of the course: PostgreSQL-specific features beyond standard SQL.
 *
 * Lesson 1: JSONB fundamentals — storage, the extraction operators (-> ->> #> #>>),
 *           and the containment/existence operators (@> ? ?| ?&).
 * Lesson 2: JSONB in practice — updating nested paths with jsonb_set, querying with
 *           jsonpath, GIN-indexing JSONB, and JSONB vs a normalized schema.
 * Lesson 3: Arrays — the array type, indexing/slicing, unnest, ANY/ALL, and the
 *           containment/overlap operators.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 11
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_11: CourseLesson[] = [
  {
    slug: 'sql-jsonb-fundamentals',
    title: 'JSONB Fundamentals',
    titleHi: 'JSONB Fundamentals',
    description: 'PostgreSQL can store a JSON document directly in a column, as JSONB — a parsed, indexable binary form — and query into its nested structure with a small family of operators, without ever giving up SQL\'s transactions, joins, and constraints on the rest of the row.',
    descriptionHi: 'PostgreSQL ek JSON document ko seedhe ek column mein store kar sakta hai, JSONB ke roop mein — ek parsed, indexable binary form — aur operators ke ek chhote family se iske nested structure mein query kar sakta hai, row ke baaki hisse par SQL ke transactions, joins, aur constraints chhoड़े bina.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A filing cabinet with normal labeled folders, plus one drawer that holds sealed, variously-shaped envelopes.** Most of a filing cabinet works the way SQL columns always have: a folder for "name," a folder for "hire date," each holding exactly one kind of thing, easy to sort and cross-reference. But some information genuinely does not fit that mold — a customer\'s one-off custom preferences, a webhook payload whose shape changes release to release, a form with optional fields that differ by country. Rather than forcing a rigid folder structure onto data that is inherently irregular, JSONB is like keeping one more drawer in the same cabinet: each envelope inside it can hold whatever shape of document it needs to, nested as deep as it needs to be, and crucially the cabinet still knows how to look INSIDE those envelopes without opening every single one — it keeps a quick index of what is inside the sealed envelope, the "->", "->>", and "@>" operators being different ways of asking that index a question, rather than forcing you to tear open every envelope one at a time to search for something.',
      hi: '**Ek filing cabinet jismein normal labeled folders hain, saath hi ek drawer hai jismein sealed, alag-alag shape ke envelopes hain.** Ek filing cabinet ka zyadатार hissa usī tarah kaam karta hai jaisा SQL columns hamesha se karте hain: "name" ke liye ek folder, "hire date" ke liye ek folder, har ek theek ek tarah ki cheez rakhte hue. Par kuch information genuinely us mould mein fit nahi hoti — ek customer ki ek-baar-ki custom preferences, ek webhook payload jiski shape release-to-release badalti hai. Ek rigid folder structure force karne ke bजाय, JSONB usī cabinet mein ek aur drawer rakhne jaisа hai: iske andar har envelope jo bhi shape ka document rakh sakta hai, aur cabinet abhi bhi jaanта hai un envelopes ke ANDAR kaise dekhна hai — ye ek quick index rakhta hai ki sealed envelope ke andar kya hai, "->", "->>", aur "@>" operators us index se ek sawaal poochne ke alag tarike hain.',
    },

    simple: `**Store a JSON document directly in a column, as \`jsonb\`**

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1,
  '{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}');
\`\`\`

**\`->\` gets a JSON value (stays JSON); \`->>\` gets it as TEXT; \`#>\`/\`#>>\` walk a PATH of keys**

\`\`\`sql
SELECT data->'address'          AS addr,        -- {"city": "Pune", "zip": "411001"}  (jsonb)
       data->>'name'            AS name,        -- Ravi                               (text)
       data#>'{address,city}'   AS city_path,    -- "Pune"                             (jsonb)
       data#>>'{address,city}'  AS city_text     -- Pune                               (text)
FROM docs;
\`\`\`

**\`@>\` containment: "does this document contain this shape/value?"**

\`\`\`sql
SELECT id FROM docs WHERE data @> '{"name": "Ravi"}';   -- matches -- a partial match anywhere IN the document
\`\`\`

**\`?\` / \`?|\` / \`?&\` existence: "does this TOP-LEVEL key exist?"**

\`\`\`sql
SELECT id FROM docs WHERE data ? 'tags';                        -- key "tags" exists at the top level
SELECT id FROM docs WHERE data ?| ARRAY['tags', 'phone'];       -- ANY of these top-level keys exist
SELECT id FROM docs WHERE data ?& ARRAY['name', 'tags'];        -- ALL of these top-level keys exist
\`\`\`

**\`jsonb\` vs \`json\`: \`jsonb\` is parsed & reordered (indexable, slightly slower to write);
\`json\` is stored as literal text (preserves exact formatting/key order, no indexing) —
\`jsonb\` is almost always the right default**`,

    simpleHi: `**Ek JSON document seedhe ek column mein store karo, \`jsonb\` ke roop mein**

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1,
  '{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}');
\`\`\`

**\`->\` ek JSON value leता hai (JSON hi rehтी hai); \`->>\` ise TEXT ke roop mein leता hai; \`#>\`/\`#>>\` keys ka ek PATH chalте hain**

\`\`\`sql
SELECT data->'address'          AS addr,        -- {"city": "Pune", "zip": "411001"}  (jsonb)
       data->>'name'            AS name,        -- Ravi                               (text)
       data#>'{address,city}'   AS city_path,    -- "Pune"                             (jsonb)
       data#>>'{address,city}'  AS city_text     -- Pune                               (text)
FROM docs;
\`\`\`

**\`@>\` containment: "kya ye document is shape/value ko contain karta hai?"**

\`\`\`sql
SELECT id FROM docs WHERE data @> '{"name": "Ravi"}';   -- match karta hai -- document ke ANDAR kahin ek partial match
\`\`\`

**\`?\` / \`?|\` / \`?&\` existence: "kya ye TOP-LEVEL key exist karti hai?"**

\`\`\`sql
SELECT id FROM docs WHERE data ? 'tags';                        -- top level par "tags" key exist karti hai
SELECT id FROM docs WHERE data ?| ARRAY['tags', 'phone'];       -- in top-level keys mein se KOI EK exist karti hai
SELECT id FROM docs WHERE data ?& ARRAY['name', 'tags'];        -- in mein se SABHI top-level keys exist karti hain
\`\`\`

**\`jsonb\` vs \`json\`: \`jsonb\` parsed aur reordered hai (indexable, likhne mein thoда slower);
\`json\` literal text ke roop mein store hota hai (exact formatting/key order preserve karta hai, koi indexing nahi) —
\`jsonb\` lgбхаg hamesha sahi default hai**`,

    content: `## Storing a document inside a column

PostgreSQL has two JSON column types: \`json\`, which stores the exact text you gave it (preserving whitespace and key order, but requiring a re-parse every time you query into it), and \`jsonb\`, which parses the document once at write time into a binary, reorderable form. \`jsonb\` is almost always the right choice: it supports the containment and existence operators below, and it can be indexed (Lesson 2); \`json\` is reserved for the rare case where preserving the exact original text matters more than any of that.

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1,
  '{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}');
\`\`\`

## Extracting values: \`->\`, \`->>\`, \`#>\`, \`#>>\`

\`\`\`sql
SELECT data->'address'          AS addr,
       data->>'name'            AS name,
       data#>'{address,city}'   AS city_path,
       data#>>'{address,city}'  AS city_text
FROM docs;
\`\`\`

- **\`->\`** extracts a single key (or array index) one level deep, and the result is **still \`jsonb\`** — useful when you need to chain further extraction, or when the value genuinely is a nested object or array you want to keep as JSON.
- **\`->>\`** does the same one-level extraction but returns the result as **plain \`text\`** — what you almost always want for a scalar leaf value like a name or a number you intend to compare or display.
- **\`#>\`** takes an array of keys describing a **path** through nested levels (\`'{address,city}'\` means "go into \`address\`, then into \`city\`") and returns \`jsonb\`.
- **\`#>>\`** does the same path traversal but returns **text**, exactly the \`->\`-vs-\`->>\` distinction applied to a multi-level path instead of a single key.

The rule of thumb: use the \`>>\`/\`#>>\` (text-returning) forms when you want the final scalar value to work with directly, and the plain \`->\`/\`#>\` (jsonb-returning) forms only when you need to extract a sub-object or continue navigating further into the document.

## Containment: \`@>\`

\`\`\`sql
SELECT id FROM docs WHERE data @> '{"name": "Ravi"}';
\`\`\`

\`@>\` asks "does the left-hand document contain everything on the right, as a subset, anywhere it matches?" — the right-hand side does not need to be the whole document, just a shape that appears within it. This is the JSONB analogue of Module 10's array-containment discussion, and, like arrays, it is exactly what a GIN index accelerates (Lesson 2).

## Existence: \`?\`, \`?|\`, \`?&\`

\`\`\`sql
SELECT id FROM docs WHERE data ? 'tags';
SELECT id FROM docs WHERE data ?| ARRAY['tags', 'phone'];
SELECT id FROM docs WHERE data ?& ARRAY['name', 'tags'];
\`\`\`

These three ask a narrower question than \`@>\`: do specific **top-level keys** exist, regardless of their values? \`?\` checks a single key; \`?|\` checks whether **any** key in a given array exists (an "or"); \`?&\` checks whether **all** of them do (an "and"). These only look at top-level keys — for existence or containment deeper inside the document, \`@>\` or a jsonpath expression (Lesson 2) is the right tool.

## Why store JSON at all, in a relational database?

The honest answer is: for data whose shape is genuinely irregular or changes over time faster than a migration cycle can keep up — a third-party API's webhook payload, a user-defined custom-fields blob, an audit log of "whatever the request body happened to contain." For anything with a stable, known shape that you query on individually and often, ordinary columns remain the better choice: they are strongly typed, they support foreign keys and check constraints per-field, and a plain B-tree index on a normal column is simpler and often faster than a JSONB containment query. Lesson 2 returns to this trade-off directly.`,

    contentHi: `## Ek column ke andar ek document store karna

PostgreSQL ke paas do JSON column types hain: \`json\`, jo aapne diya theek wahi text store karta hai, aur \`jsonb\`, jo document ko write time par ek baar parse karта hai ek binary, reorderable form mein. \`jsonb\` lgbhag hamesha sahi choice hai: ye neeche waale containment aur existence operators support karta hai, aur ise index kiya ja sakta hai (Lesson 2).

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1,
  '{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}');
\`\`\`

## Values extract karna: \`->\`, \`->>\`, \`#>\`, \`#>>\`

\`\`\`sql
SELECT data->'address'          AS addr,
       data->>'name'            AS name,
       data#>'{address,city}'   AS city_path,
       data#>>'{address,city}'  AS city_text
FROM docs;
\`\`\`

- **\`->\`** ek single key (ya array index) ek level gehरा extract karta hai, aur result **abhi bhi \`jsonb\`** hai.
- **\`->>\`** wahi ek-level extraction karta hai par result ko **plain \`text\`** ke roop mein lautaता hai.
- **\`#>\`** keys ka ek array leта hai jo nested levels ke through ek **path** describe karta hai aur \`jsonb\` lautaता hai.
- **\`#>>\`** wahi path traversal karta hai par **text** lautaता hai.

## Containment: \`@>\`

\`\`\`sql
SELECT id FROM docs WHERE data @> '{"name": "Ravi"}';
\`\`\`

\`@>\` poochta hai "kya left-hand document mein right-hand side ka har cheez, ek subset ke roop mein, kahin match karti hai?" — ye theek Module 10 ke array-containment discussion ka JSONB analogue hai, aur, arrays ki tarah, theek ye wahi hai jise ek GIN index accelerate karta hai (Lesson 2).

## Existence: \`?\`, \`?|\`, \`?&\`

\`\`\`sql
SELECT id FROM docs WHERE data ? 'tags';
SELECT id FROM docs WHERE data ?| ARRAY['tags', 'phone'];
SELECT id FROM docs WHERE data ?& ARRAY['name', 'tags'];
\`\`\`

Ye teenon \`@>\` se ek narrower sawaal poochte hain: kya specific **top-level keys** exist karti hain, unki values chahe jo bhi ho? \`?\` ek single key check karta hai; \`?|\` check karta hai ki diye gaye array mein se **koi ek** key exist karti hai; \`?&\` check karta hai ki **sabhi** exist karti hain.

## JSON bilkul store hi kyun karo, ek relational database mein?

Honest answer ye hai: aisе data ke liye jiski shape genuinely irregular hai ya samay ke saath badalti hai ek migration cycle se zyada tezi se. Ek stable, known shape waale kisī bhi cheez ke liye jise aap individually aur aksar query karte ho, ordinary columns behtar choice rehते hain.`,

    examples: [
      {
        title: 'Extracting values with -> (jsonb), ->> (text), #> and #>> (path)',
        titleHi: '-> (jsonb), ->> (text), #> aur #>> (path) se values extract karna',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1, '{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}');
SELECT data->'address' AS addr, data->>'name' AS name, data#>'{address,city}' AS city_path, data#>>'{address,city}' AS city_text FROM docs;`,
        output: ` addr                           | name | city_path | city_text
--------------------------------+------+-----------+-----------
 {"zip":"411001","city":"Pune"} | Ravi | Pune      | Pune
(1 row)`,
        explain: '`->` on `\'address\'` returns the nested object still as `jsonb` (its own braces and quoting intact); `->>` on `\'name\'` unwraps the string to plain text with no quotes. `#>` walks the `{address,city}` path and returns `jsonb` (`"Pune"`, with quotes); `#>>` walks the same path and returns plain `text` (`Pune`, no quotes) — the same jsonb-vs-text distinction as `->`/`->>`, just applied to a multi-level path.',
        explainHi: '`\'address\'` par `->` nested object ko abhi bhi `jsonb` ke roop mein lautaता hai (apne braces aur quoting intact ke saath); `\'name\'` par `->>` string ko plain text mein unwrap karta hai koi quotes ke bina. `#>` `{address,city}` path chalta hai aur `jsonb` lautaता hai (`"Pune"`, quotes ke saath); `#>>` wahi path chalta hai aur plain `text` lautaता hai (`Pune`, quotes ke bina).',
      },
      {
        title: 'Containment (@>) matches a partial shape anywhere in the document',
        titleHi: 'Containment (@>) document mein kahin bhi ek partial shape match karta hai',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1, '{"name": "Ravi", "tags": ["vip", "new"]}'), (2, '{"name": "Amit", "tags": ["regular"]}');
SELECT id FROM docs WHERE data @> '{"name": "Ravi"}';`,
        output: ` id
----
 1
(1 row)`,
        explain: '`data @> \'{"name": "Ravi"}\'` asks whether each document contains that exact key-value pair anywhere in its structure. Only row 1 matches — its `name` is `"Ravi"` — while row 2\'s `name` is `"Amit"`, so it does not contain the given shape at all.',
        explainHi: '`data @> \'{"name": "Ravi"}\'` poochta hai ki kya har document apne structure mein kahin theek wo key-value pair contain karta hai. Sirf row 1 match karti hai — iska `name` `"Ravi"` hai — jabki row 2 ka `name` `"Amit"` hai, to ye diya gaya shape bilkul contain nahi karti.',
      },
      {
        title: 'Existence operators: ?| matches ANY listed key, ?& requires ALL of them',
        titleHi: 'Existence operators: ?| kisi bhi listed key ko match karta hai, ?& sabhi ki maang karta hai',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1, '{"name": "Ravi", "tags": ["vip", "new"]}'), (2, '{"name": "Amit", "phone": "555"}');
SELECT id FROM docs WHERE data ?| ARRAY['tags', 'phone'];
SELECT id FROM docs WHERE data ?& ARRAY['name', 'tags'];`,
        output: ` id
----
 1
 2
(2 rows)

 id
----
 1
(1 row)`,
        explain: '`?|` checks whether ANY of the listed top-level keys exist — row 1 has `tags` (matches), row 2 has `phone` (also matches), so both rows come back. `?&` checks whether ALL of the listed keys exist — only row 1 has BOTH `name` and `tags` at the top level (row 2 lacks `tags`), so only row 1 matches.',
        explainHi: '`?|` check karta hai ki listed top-level keys mein se KOI EK exist karti hai — row 1 ke paas `tags` hai (match), row 2 ke paas `phone` hai (bhi match), to dono rows wapas aati hain. `?&` check karta hai ki SABHI listed keys exist karti hain — sirf row 1 ke paas top level par `name` AUR `tags` DONO hain, to sirf row 1 match karti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- using -> when you actually want a comparable scalar value
SELECT * FROM docs WHERE data->'name' = 'Ravi';
-- FAILS to match -- data->'name' is jsonb (holding the JSON string "Ravi",
-- quotes included), being compared against a plain SQL text literal`,
        right: `SELECT * FROM docs WHERE data->>'name' = 'Ravi';
-- ->> returns text ("Ravi", no surrounding quotes) -- comparable to a text literal`,
        why: 'The -> operator always returns jsonb, even when the underlying value is a simple string, which means the result still carries its JSON representation, including the quotes around a string value, and is a different type than a plain SQL text literal. Comparing a jsonb value directly against a text literal either fails to match even when the "content" looks the same, or requires an explicit cast to make the comparison meaningful. The ->> operator exists specifically to sidestep this: it returns the extracted value already unwrapped into plain text, which compares directly and naturally against ordinary string literals, which is why ->> rather than -> is almost always the right choice for extracting a scalar value you intend to filter, sort, or display rather than pass along as JSON.',
        whyHi: '`->` operator hamesha `jsonb` lautaता hai, chahe underlying value ek simple string ho, jiska matlab hai result abhi bhi apna JSON representation rakhta hai, string value ke around quotes samet, aur ek plain SQL text literal se alag type hai. Ek jsonb value ko seedhe ek text literal ke against compare karna ya to match karne mein fail hota hai chahe "content" same dikhe, ya isе meaningful banane ke liye ek explicit cast chahiye. `->>` operator theek isi ko sidestep karne ke liye exist karta hai.',
      },
      {
        wrong: `-- using ? or @> interchangeably, assuming they ask the same question
SELECT id FROM docs WHERE data ? 'city';
-- returns NOTHING even for a doc like {"address": {"city": "Pune"}} --
-- "city" is not a TOP-LEVEL key here, it's nested inside "address"`,
        right: `-- for a value nested inside the document, use @> (or a jsonpath expression, Lesson 2):
SELECT id FROM docs WHERE data @> '{"address": {"city": "Pune"}}';
-- or check existence at the correct nesting level:
SELECT id FROM docs WHERE data->'address' ? 'city';`,
        why: 'The ? existence operator only ever inspects the top level of the JSONB value it is applied to; it has no awareness of keys nested further inside the document, and asking it about a key that only exists one or more levels deep will simply never match, silently, with no error. @>, by contrast, checks containment anywhere the given shape appears in the document\'s structure, which is why it succeeds for a nested key when phrased as a nested shape. Alternatively, ? can still be used on a nested value once you have navigated there yourself, since data->\'address\' extracts that nested object as its own jsonb value, and ? then correctly checks its top level. The key lesson is that ? is inherently shallow, one level only, unless you explicitly navigate to the level you mean to check.',
        whyHi: '`?` existence operator hamesha sirf apne JSONB value ke top level ko inspect karta hai; ise document ke andar aur gehरे nested keys ke baare mein koi awareness nahi, aur us se ek aisī key ke baare mein poochна jo sirf ek ya zyada levels gehरी exist karti hai, bas kabhi match nahi karегा, chupchaap, bina kisī error ke. `@>`, iske viparit, containment check karta hai jahaan bhi diya gaya shape document ke structure mein aata hai.',
      },
      {
        wrong: `-- defaulting to json instead of jsonb "because it sounds simpler"
CREATE TABLE docs (id int PRIMARY KEY, data json);
-- data @> '{"name": "Ravi"}'   -- ERROR: operator does not exist for json
-- json cannot be indexed with GIN and doesn't support @>/?/?|/?& at all`,
        right: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
-- jsonb supports every operator this lesson covers, AND can be GIN-indexed (Lesson 2) --
-- reach for plain json only when preserving exact original text/key order matters more`,
        why: 'json and jsonb look similar on the surface but behave very differently under the hood: json stores exactly the text it was given, re-parsing it fresh every time a query touches it, while jsonb parses the document once at write time into a structured, reorderable, indexable binary representation. The containment operator (@>) and the existence operators (?, ?|, ?&) are defined only for jsonb, not json, because they rely on that parsed structure to evaluate efficiently; attempting to use them against a json column produces an outright error rather than a slow-but-working query. Because jsonb also supports GIN indexing, which json cannot, jsonb is the correct default for essentially every practical use case, and json is reserved specifically for situations where preserving the byte-for-byte original text, including whitespace and key ordering, genuinely matters more than any of jsonb\'s querying or indexing capabilities.',
        whyHi: '`json` aur `jsonb` upar se milте-julte dikhte hain par andar se bahut alag behave karte hain: `json` theek wo text store karta hai jo isе diya gaya, har baar jab koi query ise touch karti hai use fresh re-parse karte hue, jabki `jsonb` document ko write time par ek baar parse karта hai ek structured, reorderable, indexable binary representation mein. Containment operator (`@>`) aur existence operators (`?`, `?|`, `?&`) sirf `jsonb` ke liye defined hain, `json` ke liye nahi.',
      },
    ],

    realWorld: [
      {
        en: '**A `webhooks` table storing each provider\'s raw payload as `jsonb`** — the shape varies by event type and changes as the third party ships new API versions, which a fixed set of columns could never track cleanly.',
        hi: '**Ek `webhooks` table jo har provider ke raw payload ko `jsonb` ke roop mein store karta hai** — shape event type ke hisaab se badalti hai aur third party ke naye API versions ship karne par badalti hai.',
      },
      {
        en: '**A `user_preferences jsonb` column** holding per-user, per-feature settings that grow and change constantly without ever requiring a schema migration for a new preference key.',
        hi: '**Ek `user_preferences jsonb` column** jo prati-user, prati-feature settings rakhta hai jo lगातार badhते aur badалते hain kisī bhi naye preference key ke liye kabhi schema migration ki zaroorat ke bina.',
      },
      {
        en: '**A `data @> \'{"status": "failed"}\'` filter on an event-log table** to find every failed event regardless of what other fields that particular event type happens to carry.',
        hi: '**Ek event-log table par `data @> \'{"status": "failed"}\'` filter** har failed event dhoondне ke liye chahe wo particular event type aur kaunse fields rakhta ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between -> and ->>, and when would you use each?',
        qHi: '`->` aur `->>` mein kya antar hai, aur aap har ek kab istemal karоge?',
        a: 'Both operators extract a value from a JSONB document by key or array index, one level deep, but they differ in what type the result comes back as. The -> operator returns the extracted value still as jsonb, preserving its JSON representation, including quotes around a string or the full structure of a nested object or array; this is the right choice when you intend to extract a sub-object or array and either return it as JSON or continue navigating further into it. The ->> operator performs the identical extraction but converts the result to plain SQL text, unwrapping a JSON string into an ordinary string without its surrounding quotes; this is the right choice, and by far the more common one, whenever you want the extracted scalar value to behave like an ordinary column value for comparison, sorting, or display, since comparing a -> result directly against a plain text literal typically fails to match, or requires an explicit and easy-to-forget cast, because the types do not line up.',
        aHi: 'Dono operators ek JSONB document se ek value key ya array index se extract karte hain, ek level gehरा, par ye is mein alag hain ki result kaunse type mein wapas aata hai. `->` operator extracted value ko abhi bhi `jsonb` ke roop mein lautaता hai. `->>` operator wahi identical extraction karta hai par result ko plain SQL text mein convert karta hai.',
      },
      {
        q: 'What is the difference between the @> containment operator and the ? existence operator?',
        qHi: '`@>` containment operator aur `?` existence operator mein kya antar hai?',
        a: 'The @> operator checks whether the entire shape given on its right-hand side is contained somewhere within the left-hand document\'s structure, which means it can match a key-value pair, or even a nested sub-object, at any depth, as long as that exact shape appears within the larger document. The ? operator asks a narrower and shallower question: whether a specific key name exists at the top level of the JSONB value it is applied to, with no regard at all for what that key\'s value actually is, and critically, with no visibility into keys nested one or more levels deeper inside the document. This means @> is the tool for "does this document contain this value, however deep," while ? (along with its ?| and ?& variants for checking multiple keys with an or or an and) is the tool specifically for "does this exact top-level key exist," and reaching for ? when the key you care about is actually nested will silently return no matches rather than erroring, which is a common source of confusion.',
        aHi: '`@>` operator check karta hai ki iski right-hand side par diya gaya poora shape left-hand document ke structure mein kahin contained hai. `?` operator ek narrower aur shallower sawaal poochta hai: kya ek specific key naam us JSONB value ke top level par exist karti hai, iski value kya hai isse koi matlab nahi, aur critically, document ke andar ek ya zyada levels gehरी nested keys mein koi visibility nahi.',
      },
    ],

    exercises: [
      {
        task: 'Table `docs(id int PRIMARY KEY, data jsonb)` with one row holding `{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}`. Write one query selecting `data->\'address\'`, `data->>\'name\'`, `data#>\'{address,city}\'`, and `data#>>\'{address,city}\'` and predict each column\'s exact output before running it.',
        taskHi: 'Table `docs(id, data)` ek row ke saath `{"name": "Ravi", "address": {"city": "Pune", "zip": "411001"}, "tags": ["vip", "new"]}` rakhте hue. Ek query likho jo `data->\'address\'`, `data->>\'name\'`, `data#>\'{address,city}\'`, aur `data#>>\'{address,city}\'` select karti hai.',
        hint: '`->` and `#>` return jsonb (so a string result keeps its quotes); `->>` and `#>>` return plain text (no quotes). `#>`/`#>>` take a path array to reach a nested key in one step.',
        hintHi: '`->` aur `#>` `jsonb` lautaते hain (to ek string result apne quotes rakhta hai); `->>` aur `#>>` plain text lautaते hain (quotes ke bina).',
      },
      {
        task: 'Table `docs(id int PRIMARY KEY, data jsonb)` with two rows: one `{"name": "Ravi", "tags": ["vip", "new"]}`, one `{"name": "Amit", "tags": ["regular"]}`. Write a query using `@>` to find the row where `name` is `"Ravi"`.',
        taskHi: 'Table `docs(id, data)` do rows ke saath: ek `{"name": "Ravi", "tags": ["vip", "new"]}`, ek `{"name": "Amit", "tags": ["regular"]}`. `@>` istemal karте hue ek query likho jo wo row dhoondता hai jahaan `name` `"Ravi"` hai.',
        hint: '`WHERE data @> \'{"name": "Ravi"}\'` — the right-hand side does not need to be the whole document, just a shape that appears within it.',
        hintHi: '`WHERE data @> \'{"name": "Ravi"}\'` — right-hand side ko poora document hone ki zaroorat nahi, bas ek shape jo iske andar aata hai.',
      },
      {
        task: 'Same two rows as above, but row 2 also has `{"phone": "555"}` instead of `tags`. Write one query using `?|` to find rows having EITHER a `tags` OR a `phone` key, and a second using `?&` to find rows having BOTH `name` AND `tags`.',
        taskHi: 'Upar jaisī hi do rows, par row 2 mein `tags` ke bजаय `{"phone": "555"}` bhi hai. `?|` istemal karte hue ek query likho jo un rows ko dhoondти hai jinke paas `tags` YA `phone` key hai, aur `?&` istemal karके doosri jo `name` AUR `tags` dono rakhti hain.',
        hint: '`?|` is an "any of these keys" check (an or); `?&` is an "all of these keys" check (an and). Both only look at TOP-LEVEL keys.',
        hintHi: '`?|` ek "in mein se koi ek key" check hai (ek or); `?&` ek "in sabhi keys" check hai (ek and). Dono sirf TOP-LEVEL keys dekhte hain.',
      },
    ],

    keyTakeaways: [
      '`jsonb` parses a JSON document once at write time into a binary, indexable, reorderable form — almost always the right default over `json` (which stores literal text, no indexing, no containment/existence operators).',
      '`->` extracts one level deep and returns `jsonb` (keeps quotes/structure — chain further or return as JSON). `->>` does the same but returns plain `text` (unwrapped, comparable to an ordinary string literal) — the usual choice for a scalar leaf value.',
      '`#>` / `#>>` are the SAME jsonb-vs-text distinction, but take a PATH ARRAY (e.g. `\'{address,city}\'`) to reach a nested key in one step instead of chaining `->` repeatedly.',
      '`@>` CONTAINMENT: "does this shape appear anywhere within the document\'s structure" — works at ANY depth, the JSONB analogue of array containment (Module 10). This is what a GIN index accelerates (Lesson 2).',
      '`?` / `?|` / `?&` EXISTENCE: check specific TOP-LEVEL key names only, regardless of their values — `?` (one key), `?|` (ANY of a list — an "or"), `?&` (ALL of a list — an "and"). NEVER sees keys nested deeper — for that, use `@>` or navigate there first (`data->\'address\' ? \'city\'`).',
      'Store JSON for data whose SHAPE is genuinely irregular or changes faster than a migration cycle (webhook payloads, custom-fields blobs). For a stable, known, individually-queried shape, ordinary typed columns with real constraints and plain B-tree indexes remain the better default (Lesson 2 returns to this trade-off).',
    ],
    keyTakeawaysHi: [
      '`jsonb` ek JSON document ko write time par ek baar parse karta hai ek binary, indexable, reorderable form mein — `json` (jo literal text store karta hai, koi indexing nahi) par lgbhag hamesha sahi default.',
      '`->` ek level gehरा extract karta hai aur `jsonb` lautaता hai. `->>` wahi karta hai par plain `text` lautaता hai — ek scalar leaf value ke liye usual choice.',
      '`#>` / `#>>` WAHI jsonb-vs-text distinction hai, par ek PATH ARRAY leते hain ek nested key tak ek step mein pahunchne ke liye.',
      '`@>` CONTAINMENT: "kya ye shape document ke structure mein kahin bhi aata hai" — kisi bhi depth par kaam karta hai. Yahi hai jise ek GIN index accelerate karta hai (Lesson 2).',
      '`?` / `?|` / `?&` EXISTENCE: sirf specific TOP-LEVEL key naamon ko check karte hain, unki values se koi matlab nahi. KABHI gehरी nested keys nahi dekhte — uske liye, `@>` istemal karo ya pehle wahaan navigate karo.',
      'Aisе data ke liye JSON store karo jiski SHAPE genuinely irregular hai ya ek migration cycle se zyada tezi se badalti hai. Ek stable, known, individually-query hone waali shape ke liye, ordinary typed columns behtar default rehते hain (Lesson 2 is trade-off par wapas aata hai).',
    ],
  },

  {
    slug: 'sql-jsonb-in-practice',
    title: 'JSONB in Practice: Updates, jsonpath & Indexing',
    titleHi: 'JSONB in Practice: Updates, jsonpath Aur Indexing',
    description: 'Reading a JSONB document is only half the story: jsonb_set updates a value at a nested path without rewriting the whole document by hand, jsonpath expressions answer richer structural questions than the plain operators can, and a GIN index makes containment queries fast at scale.',
    descriptionHi: 'Ek JSONB document padhна sirf aadhी kahani hai: `jsonb_set` poore document ko haath se dobara likhe bina ek nested path par ek value update karta hai, jsonpath expressions plain operators se zyada rich structural sawaal answer karte hain, aur ek GIN index scale par containment queries ko fast banata hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Correcting one line deep inside a long, nested legal contract — versus retyping the whole document.** If a single clause buried three sections deep in a contract needs updating, a competent editor does not retype the entire document from scratch just to change that one line; they navigate precisely to that clause, replace exactly it, and leave everything else byte-for-byte untouched. `jsonb_set` is that precise edit: given a path to the exact nested spot, it replaces only the value there, handing back a whole new document with everything else preserved. A jsonpath expression, similarly, is like a lawyer\'s more sophisticated cross-reference query — not just "find clause 3.2" but "find every clause anywhere in this contract whose penalty exceeds $500," a structural, conditional search rather than a fixed address. And a GIN index over the whole cabinet of contracts is the paralegal\'s master card catalog: without it, answering "which contracts mention a penalty over $500" means reading every contract start to finish; with it, the catalog already lists which contracts contain which terms, and the search skips straight to the right filing cabinet drawer.',
      hi: '**Ek lambe, nested legal contract ke andar ek line theek karna — poora document dobara type karne ke muकаble.** Agar ek contract mein teen sections gehरी dabī ek clause ko update karna hai, ek competent editor poora document scratch se dobara type nahi karta bas us ek line ko badalne ke liye; wo theek us clause tak navigate karta hai, theek use replace karta hai, aur baaki sab byte-for-byte untouched chhoड़ता hai. `jsonb_set` theek wo precise edit hai. Ek jsonpath expression, isī tarah, ek lawyer ke zyada sophisticated cross-reference query jaisа hai — sirf "clause 3.2 dhoondो" nahi balki "poore contract mein har wo clause dhoondо jiska penalty $500 se zyada hai," ek structural, conditional search, ek fixed address nahi. Aur poore contracts ke cabinet par ek GIN index paralegal ka master card catalog hai.',
    },

    simple: `**\`jsonb_set(doc, path, new_value)\` updates ONE nested path, keeping everything else**

\`\`\`sql
UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
-- '{address,city}' is the same path array as #>/#>> -- '"Mumbai"' must be a
-- valid JSON value (quoted, since it's a JSON string)
\`\`\`

**jsonpath (\`jsonb_path_query\`) answers structural questions the plain operators can't**

\`\`\`sql
SELECT jsonb_path_query(data, '$.items[*].price') FROM docs;
-- every "price" inside every element of the "items" array
SELECT jsonb_path_query_array(data, '$.items[*] ? (@.price > 8)') FROM docs;
-- a FILTER inside the path: only items whose price exceeds 8
\`\`\`

**A GIN index makes \`@>\` containment fast, the same way it does for arrays (Module 10)**

\`\`\`sql
CREATE INDEX ON docs USING GIN (data);
ANALYZE docs;
EXPLAIN (COSTS OFF) SELECT * FROM docs WHERE data @> '{"active": true}';
\`\`\`
\`\`\`
Bitmap Heap Scan on docs
  Recheck Cond: (data @> '{"active": true}'::jsonb)
  ->  Bitmap Index Scan on docs_data_idx
        Index Cond: (data @> '{"active": true}'::jsonb)
\`\`\`

**JSONB vs a normalized column: JSONB for genuinely IRREGULAR/CHANGING shapes only**
\`\`\`
a stable, known, individually-queried field  -> a normal typed column + a plain
                                                  B-tree index -- simpler, faster,
                                                  and gets real constraints/FKs
a shape that varies row-to-row or evolves     -> jsonb -- no migration needed for
faster than a migration cycle                    a new optional field
\`\`\``,

    simpleHi: `**\`jsonb_set(doc, path, new_value)\` EK nested path update karta hai, baaki sab rakhте hue**

\`\`\`sql
UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
\`\`\`

**jsonpath (\`jsonb_path_query\`) structural sawaal answer karta hai jo plain operators nahi kar sakte**

\`\`\`sql
SELECT jsonb_path_query(data, '$.items[*].price') FROM docs;
SELECT jsonb_path_query_array(data, '$.items[*] ? (@.price > 8)') FROM docs;
\`\`\`

**Ek GIN index \`@>\` containment ko fast banata hai, arrays ki tarah (Module 10)**

\`\`\`sql
CREATE INDEX ON docs USING GIN (data);
ANALYZE docs;
EXPLAIN (COSTS OFF) SELECT * FROM docs WHERE data @> '{"active": true}';
\`\`\`
\`\`\`
Bitmap Heap Scan on docs
  Recheck Cond: (data @> '{"active": true}'::jsonb)
  ->  Bitmap Index Scan on docs_data_idx
        Index Cond: (data @> '{"active": true}'::jsonb)
\`\`\`

**JSONB vs ek normalized column: JSONB sirf genuinely IRREGULAR/CHANGING shapes ke liye**
\`\`\`
ek stable, known, individually-query hone waala field -> ek normal typed column +
                                                            ek plain B-tree index
ek shape jo row-to-row badalti hai ya ek migration      -> jsonb -- naye optional
cycle se zyada tezi se evolve hoti hai                      field ke liye migration nahi
\`\`\``,

    content: `## Updating a nested value: \`jsonb_set\`

\`\`\`sql
UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
\`\`\`

\`jsonb_set(target, path, new_value)\` takes the same kind of path array Lesson 1's \`#>\`/\`#>>\` used, and returns a **new** JSONB document with the value at that path replaced — everything else in the document is preserved exactly. The replacement value must itself be valid JSON, which is why replacing a string requires the extra quotes (\`'"Mumbai"'\`, a JSON string literal) rather than a bare SQL string. This is the tool for "change one field deep inside a document" without hand-reconstructing the surrounding structure yourself.

## jsonpath: structural queries beyond the plain operators

Lesson 1's operators (\`->\`, \`@>\`, \`?\`) answer simple, fixed questions. **jsonpath** — a small query language embedded as a string — answers richer, structural ones:

\`\`\`sql
SELECT jsonb_path_query(data, '\\$.items[*].price') FROM docs;
SELECT jsonb_path_query_array(data, '\\$.items[*] ? (@.price > 8)') FROM docs;
\`\`\`

\`jsonb_path_query\` returns each matching value as its own row; \`jsonb_path_query_array\` collects all matches into a single JSONB array. \`$\` refers to the document root, \`[*]\` means "every element of this array," and \`? (@.price > 8)\` is a **filter**: \`@\` refers to the current element being examined, so this reads as "every item whose price exceeds 8." jsonpath is where you reach when a question genuinely needs conditions or wildcards across a nested structure — filtering array elements by a sub-field's value, for instance — rather than a single fixed path or a whole-document containment check.

## Indexing JSONB with GIN

Module 10 introduced GIN as the index type for "does this collection contain X," built around arrays and full-text search; JSONB containment is exactly the same shape of question, and GIN indexes it the same way:

\`\`\`sql
CREATE INDEX ON docs USING GIN (data);
ANALYZE docs;
EXPLAIN (COSTS OFF) SELECT * FROM docs WHERE data @> '{"active": true}';
\`\`\`
\`\`\`
Bitmap Heap Scan on docs
  Recheck Cond: (data @> '{"active": true}'::jsonb)
  ->  Bitmap Index Scan on docs_data_idx
        Index Cond: (data @> '{"active": true}'::jsonb)
\`\`\`

A default GIN index on a \`jsonb\` column indexes every key and value pair, supporting \`@>\`, \`?\`, \`?|\`, and \`?&\` all at once, at the cost of a larger index. PostgreSQL also offers a \`jsonb_path_ops\` variant (\`CREATE INDEX ... USING GIN (data jsonb_path_ops)\`) that indexes only what \`@>\` needs, producing a notably smaller index at the cost of no longer supporting the \`?\`/\`?|\`/\`?&\` operators — worth choosing specifically when containment is the only query shape a given column ever needs to serve.

## JSONB vs a normalized schema: the actual trade-off

JSONB is not a replacement for ordinary columns; it is a tool for a specific kind of irregularity. A field genuinely earns a \`jsonb\` column when its shape varies meaningfully from row to row, or evolves faster than your team can comfortably run schema migrations — a third-party webhook payload, a form with country-specific optional fields, a truly free-form "custom attributes" blob. A field that has a stable, known shape and gets queried, filtered, or joined on individually is almost always better as an ordinary typed column: it gets a real data type PostgreSQL enforces, it can carry a foreign key or check constraint scoped to exactly that field, and a plain B-tree index on it (Module 10) is typically simpler and faster than an equivalent JSONB containment query, since the planner has direct type-level statistics to reason about rather than a GIN index's coarser containment view. The common real-world pattern is a mix: known, stable, frequently-queried fields as normal columns, with one \`jsonb\` "extra" column absorbing whatever the schema hasn't (yet, or ever will) fully accommodate.`,

    contentHi: `## Ek nested value update karna: \`jsonb_set\`

\`\`\`sql
UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
\`\`\`

\`jsonb_set(target, path, new_value)\` Lesson 1 ke \`#>\`/\`#>>\` jaisा hi ek path array leта hai, aur us path par value replace ki gayi ek **nayi** JSONB document lautaта hai — document mein baaki sab theek waisा preserve hota hai.

## jsonpath: plain operators se aage structural queries

Lesson 1 ke operators (\`->\`, \`@>\`, \`?\`) simple, fixed sawaal answer karte hain. **jsonpath** — ek chhoti query language jo ek string ke roop mein embed hoti hai — richer, structural sawaal answer karta hai:

\`\`\`sql
SELECT jsonb_path_query(data, '\\$.items[*].price') FROM docs;
SELECT jsonb_path_query_array(data, '\\$.items[*] ? (@.price > 8)') FROM docs;
\`\`\`

\`jsonb_path_query\` har matching value ko apni ek row ke roop mein lautaта hai; \`jsonb_path_query_array\` sabhi matches ko ek single JSONB array mein collect karta hai. \`$\` document root ko refer karta hai, \`[*]\` matlab "is array ka har element," aur \`? (@.price > 8)\` ek **filter** hai.

## GIN se JSONB index karna

Module 10 ne GIN ko "kya ye collection X contain karta hai" ke liye index type ke roop mein introduce kiya; JSONB containment theek wahi shape ka sawaal hai.

\`\`\`sql
CREATE INDEX ON docs USING GIN (data);
ANALYZE docs;
EXPLAIN (COSTS OFF) SELECT * FROM docs WHERE data @> '{"active": true}';
\`\`\`
\`\`\`
Bitmap Heap Scan on docs
  Recheck Cond: (data @> '{"active": true}'::jsonb)
  ->  Bitmap Index Scan on docs_data_idx
        Index Cond: (data @> '{"active": true}'::jsonb)
\`\`\`

Ek default GIN index ek \`jsonb\` column par har key aur value pair index karta hai. PostgreSQL ek \`jsonb_path_ops\` variant bhi deta hai jo sirf wo index karta hai jo \`@>\` ko chahiye, ek notably chhota index produce karte hue.

## JSONB vs ek normalized schema: actual trade-off

JSONB ordinary columns ka replacement nahi hai; ye ek specific tarah ki irregularity ke liye ek tool hai. Ek field genuinely ek \`jsonb\` column kamaता hai jab iski shape row-to-row meaningfully badalti hai. Ek field jiski stable, known shape hai aur jise individually query kiya jaata hai lgbhag hamesha ek ordinary typed column ke roop mein behtar hai.`,

    examples: [
      {
        title: 'jsonb_set replaces a value at a nested path, keeping everything else unchanged',
        titleHi: 'jsonb_set ek nested path par ek value replace karta hai, baaki sab unchanged rakhते hue',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1, '{"name": "Ravi", "address": {"city": "Pune"}}');
UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
SELECT data FROM docs WHERE id = 1;`,
        output: ` data
---------------------------------------------
 {"name":"Ravi","address":{"city":"Mumbai"}}
(1 row)`,
        explain: '`jsonb_set(data, \'{address,city}\', \'"Mumbai"\')` replaces only the value at the nested `address.city` path with the new string `"Mumbai"` — the `name` field and every other part of the document are returned exactly as they were, since `jsonb_set` produces a whole new document with only the targeted path changed.',
        explainHi: '`jsonb_set(data, \'{address,city}\', \'"Mumbai"\')` sirf nested `address.city` path par value ko naye string `"Mumbai"` se replace karta hai — `name` field aur document ka har doosra hissa theek waisा hi lautaya jaata hai jaisа thа, kyunki `jsonb_set` ek bilkul nayi document produce karta hai jismein sirf targeted path badla hai.',
      },
      {
        title: 'jsonpath queries a nested array by structure, with a filter condition',
        titleHi: 'jsonpath structure se ek nested array query karta hai, ek filter condition ke saath',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs VALUES (1, '{"items": [{"price": 10}, {"price": 25}, {"price": 5}]}');
SELECT jsonb_path_query(data, '$.items[*].price') FROM docs;
SELECT jsonb_path_query_array(data, '$.items[*] ? (@.price > 8)') FROM docs;`,
        output: ` jsonb_path_query
------------------
 10
 25
 5
(3 rows)

 jsonb_path_query_array
-----------------------------
 [{"price":10},{"price":25}]
(1 row)`,
        explain: "`jsonb_path_query` walks `$.items[*].price`, returning each item's `price` as its own row — 10, 25, and 5, one per array element. `jsonb_path_query_array` instead applies a FILTER, `? (@.price > 8)`, keeping only items whose price exceeds 8, and collects the two matching whole items (not just their prices) into a single JSONB array.",
        explainHi: '`jsonb_path_query` `$.items[*].price` chalta hai, har item ka `price` apni ek row ke roop mein lautaते hue — 10, 25, aur 5, prati array element ek. `jsonb_path_query_array` iske bजаय ek FILTER apply karta hai, `? (@.price > 8)`, sirf un items ko rakhте hue jinka price 8 se zyada hai, aur do matching poore items (sirf unke prices nahi) ko ek single JSONB array mein collect karta hai.',
      },
      {
        title: 'A GIN index on jsonb serves a containment query on a large, selective table',
        titleHi: 'jsonb par ek GIN index ek large, selective table par ek containment query serve karta hai',
        code: `CREATE TABLE docs (id int PRIMARY KEY, data jsonb);
INSERT INTO docs SELECT g, jsonb_build_object('name', 'user'||g, 'active', (g % 200 = 0)) FROM generate_series(1, 20000) g;
CREATE INDEX ON docs USING GIN (data);
ANALYZE docs;
EXPLAIN (COSTS OFF) SELECT * FROM docs WHERE data @> '{"active": true}';`,
        output: ` QUERY PLAN
---------------------------------------------------------
 Bitmap Heap Scan on docs
   Recheck Cond: (data @> '{"active": true}'::jsonb)
   ->  Bitmap Index Scan on docs_data_idx
         Index Cond: (data @> '{"active": true}'::jsonb)
(4 rows)`,
        explain: 'With 20,000 rows and only 1 in 200 (100 rows) having `active: true`, that condition is selective enough that the GIN index built over `data` is worth using: the plan shows `Bitmap Index Scan on docs_data_idx` finding the matching entries first, then `Bitmap Heap Scan on docs` fetching only those rows — exactly the same containment-query shape Module 10 covered for arrays and full-text search.',
        explainHi: '20,000 rows ke saath aur sirf 200 mein se 1 (100 rows) ka `active: true` hone se, wo condition itni selective hai ki `data` par bana GIN index istemal karne layak hai: plan `Bitmap Index Scan on docs_data_idx` dikhaता hai jo pehle matching entries dhoondта hai, phir `Bitmap Heap Scan on docs` sirf un rows ko fetch karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- forgetting the replacement value for jsonb_set must be JSON, not a bare SQL string
UPDATE docs SET data = jsonb_set(data, '{address,city}', 'Mumbai') WHERE id = 1;
-- ERROR: invalid input syntax for type json -- "Mumbai" (unquoted) isn't valid JSON`,
        right: `UPDATE docs SET data = jsonb_set(data, '{address,city}', '"Mumbai"') WHERE id = 1;
-- the extra quotes make it a valid JSON string literal, not a bare SQL identifier/string`,
        why: 'jsonb_set\'s replacement value argument is itself parsed as JSON, not as a plain SQL string, because the function is designed to accept any JSON value there, an object, an array, a number, a boolean, or a string, and it needs a way to distinguish those cases. A bare SQL string like \'Mumbai\' is not valid JSON on its own; valid JSON requires a string value to be wrapped in double quotes, so the correct argument is the SQL string literal \'"Mumbai"\', where the outer single quotes delimit the SQL string and the inner double quotes make its contents a valid JSON string. Forgetting this distinction is an easy and common mistake specifically because normal SQL string literals never need this extra quoting, but jsonb_set\'s argument is a JSON value, not a SQL string, and needs to look like valid JSON regardless of what type of value is being inserted.',
        whyHi: '`jsonb_set` ka replacement value argument khud JSON ke roop mein parse hota hai, plain SQL string ke roop mein nahi, kyunki function wahaan koi bhi JSON value accept karne ke liye design kiya gaya hai. Ek bare SQL string jaisа \'Mumbai\' apne aap mein valid JSON nahi hai; valid JSON ko ek string value ko double quotes mein wrap karna hota hai, to sahi argument SQL string literal \'"Mumbai"\' hai.',
      },
      {
        wrong: `-- reaching for a full jsonpath expression when a plain operator would do
SELECT jsonb_path_query(data, '$.name') FROM docs;
-- works, but is unnecessarily heavyweight for a single, fixed, one-level key`,
        right: `SELECT data->>'name' FROM docs;   -- simpler, and the idiomatic choice for a fixed single key`,
        why: 'jsonpath is a small embedded query language built for structural questions that the plain extraction and containment operators cannot express on their own, such as applying a filter condition to every element of a nested array, or matching a wildcard across a variable structure. For a simple, fixed, single-level key lookup, the plain -> or ->> operator expresses exactly the same intent more directly and more readably, without requiring anyone reading the query to parse an embedded mini-language just to see "get the name field." Reaching for jsonpath by default, even where a plain operator would do, adds unnecessary cognitive overhead without buying any actual capability, so the discipline is to use the plain operators for simple, direct access and save jsonpath specifically for the structural or conditional questions that genuinely need it.',
        whyHi: 'jsonpath ek chhoti embedded query language hai jo un structural sawaalon ke liye bani hai jinhe plain extraction aur containment operators apne aap express nahi kar sakte, jaisа ek nested array ke har element par ek filter condition apply karna. Ek simple, fixed, single-level key lookup ke liye, plain `->` ya `->>` operator theek wahi intent zyada directly aur zyada readably express karta hai.',
      },
      {
        wrong: `-- using a default GIN index when only containment (@>) queries are ever run
CREATE INDEX ON docs USING GIN (data);   -- indexes keys, values, AND existence-op support
-- larger index than necessary if ?/?|/?& are never actually used against this column`,
        right: `CREATE INDEX ON docs USING GIN (data jsonb_path_ops);
-- indexes only what @> needs -- notably smaller index, same containment-query speed --
-- but no longer supports ?/?|/?& at all, so confirm those are genuinely unused first`,
        why: 'A default GIN index on a jsonb column builds structures supporting the full set of operators from Lesson 1, the containment operator and all three existence operators together, which requires indexing more information than containment alone needs and produces a correspondingly larger index. The jsonb_path_ops variant indexes only what the containment operator requires, producing a measurably smaller index for the same containment-query performance, but as a direct consequence it no longer supports the existence operators at all. Choosing jsonb_path_ops is a genuine optimization specifically when a column\'s actual query patterns are confirmed to only ever use containment, mirroring Module 10\'s broader principle that an index should be shaped by the specific, observed query patterns a column actually serves rather than built defensively to support every operator that theoretically could be used.',
        whyHi: 'Ek `jsonb` column par ek default GIN index Lesson 1 ke poore operators set ko support karne waale structures banata hai — containment operator aur teenon existence operators saath. `jsonb_path_ops` variant sirf wo index karta hai jo containment operator ko chahiye, ek measurably chhota index produce karte hue, par iske ek direct consequence ke roop mein ye existence operators ko bilkul support nahi karta.',
      },
    ],

    realWorld: [
      {
        en: '**A support ticketing system storing dynamic custom fields per organization as `jsonb`, indexed with `jsonb_path_ops`** for fast `data @> \'{"priority": "urgent"}\'` filtering across millions of tickets.',
        hi: '**Ek support ticketing system jo har organization ke dynamic custom fields ko `jsonb` ke roop mein store karta hai, `jsonb_path_ops` se indexed** fast filtering ke liye millions tickets ke across.',
      },
      {
        en: '**A `jsonb_set` call inside an application\'s "update one preference" endpoint**, avoiding a read-modify-write round trip that would otherwise fetch the whole document, mutate it in application code, and write the whole thing back.',
        hi: '**Ek application ke "ek preference update karo" endpoint ke andar ek `jsonb_set` call**, ek read-modify-write round trip se bachte hue.',
      },
      {
        en: '**A jsonpath expression powering a reporting query** like "find every order whose line items include a refunded product," expressed as a single filtered path traversal instead of a client-side loop over fetched rows.',
        hi: '**Ek jsonpath expression jo ek reporting query power karta hai** jaisा "har order dhoondो jiske line items mein ek refunded product shamil hai."',
      },
    ],

    interviewQA: [
      {
        q: 'Why does jsonb_set\'s replacement value need to be quoted as JSON, and what happens if you forget?',
        qHi: '`jsonb_set` ki replacement value ko JSON ke roop mein quote karne ki zaroorat kyun hai, aur bhoolne par kya hota hai?',
        a: 'jsonb_set is designed to accept any kind of JSON value as its replacement, an object, an array, a number, a boolean, or a string, not specifically a string, so the argument it receives is parsed as JSON rather than treated as an already-known SQL type. Because valid JSON represents a string value by wrapping it in double quotes, replacing a nested field with the plain text Mumbai requires passing the SQL string literal that itself contains those quotes, written as \'"Mumbai"\', where the single quotes are ordinary SQL string delimiters and the double quotes inside them make the content a valid JSON string. Forgetting the inner quotes and passing a bare \'Mumbai\' means the function receives something that is not valid JSON at all, since an unquoted word is not a legal JSON value, and PostgreSQL raises an explicit invalid input syntax error rather than silently doing something unintended, which at least makes the mistake immediately visible rather than corrupting data quietly.',
        aHi: '`jsonb_set` ko apni replacement ke roop mein kisī bhi tarah ki JSON value accept karne ke liye design kiya gaya hai, specifically ek string nahi, to jo argument ise milta hai use JSON ke roop mein parse kiya jaata hai. Kyunki valid JSON ek string value ko double quotes mein wrap karके represent karta hai, ek nested field ko plain text Mumbai se replace karne ke liye SQL string literal pass karna hota hai jo khud un quotes ko contain karta hai, \'"Mumbai"\' likhте hue.',
      },
      {
        q: 'What is the trade-off between a default GIN index and a jsonb_path_ops GIN index on a JSONB column?',
        qHi: 'Ek `jsonb` column par ek default GIN index aur ek `jsonb_path_ops` GIN index ke beech trade-off kya hai?',
        a: 'A default GIN index on a jsonb column indexes enough information to support the full family of JSONB operators together, the containment operator and all three existence-checking operators, which means it has to track individual keys and values in a way that serves every one of those query shapes. The jsonb_path_ops variant narrows that scope deliberately: it indexes only the information the containment operator specifically needs, which produces a measurably smaller index and, in practice, often faster containment queries, at the direct cost of no longer being able to serve the existence operators at all if they are ever used against that column. The right choice depends entirely on the column\'s actual, observed query patterns: if every query against it only ever checks containment, jsonb_path_ops is a straightforward win in both size and speed, but if the application genuinely also needs to ask "does this top-level key exist" against the same column, the default GIN index is necessary to serve that need, and choosing jsonb_path_ops would silently break those queries.',
        aHi: 'Ek `jsonb` column par ek default GIN index poore JSONB operators family ko saath support karne ke liye kaafi information index karta hai. `jsonb_path_ops` variant us scope ko jaan-boojhkar narrow karta hai: ye sirf wo information index karta hai jo containment operator ko specifically chahiye, ek measurably chhota index produce karte hue, is direct cost par ki ab ye existence operators ko bilkul serve nahi kar sakta.',
      },
    ],

    exercises: [
      {
        task: 'Table `docs(id int PRIMARY KEY, data jsonb)` with one row `{"name": "Ravi", "address": {"city": "Pune"}}`. Write an `UPDATE` using `jsonb_set` to change the nested `city` to `"Mumbai"`, then select `data` to confirm the rest of the document is unchanged.',
        taskHi: 'Table `docs(id, data)` ek row ke saath `{"name": "Ravi", "address": {"city": "Pune"}}`. `jsonb_set` istemal karте hue ek `UPDATE` likho jo nested `city` ko `"Mumbai"` mein badalta hai.',
        hint: '`jsonb_set(data, \'{address,city}\', \'"Mumbai"\')` — the path array matches `#>`/`#>>`\'s syntax, and the replacement value needs its own JSON quoting.',
        hintHi: '`jsonb_set(data, \'{address,city}\', \'"Mumbai"\')` — path array `#>`/`#>>` ke syntax se match karta hai, aur replacement value ko apna JSON quoting chahiye.',
      },
      {
        task: 'Table `docs(id int PRIMARY KEY, data jsonb)` with one row `{"items": [{"price": 10}, {"price": 25}, {"price": 5}]}`. Write a jsonpath query returning only the items whose `price` exceeds 8, as a single JSONB array.',
        taskHi: 'Table `docs(id, data)` ek row ke saath `{"items": [{"price": 10}, {"price": 25}, {"price": 5}]}`. Ek jsonpath query likho jo sirf un items ko lautaती hai jinka `price` 8 se zyada hai, ek single JSONB array ke roop mein.',
        hint: '`jsonb_path_query_array(data, \'$.items[*] ? (@.price > 8)\')` — `[*]` iterates the array, `? (@.price > 8)` filters each element by its own `price` field.',
        hintHi: '`jsonb_path_query_array(data, \'$.items[*] ? (@.price > 8)\')` — `[*]` array ko iterate karta hai, `? (@.price > 8)` har element ko apne `price` field se filter karta hai.',
      },
      {
        task: 'Table `docs(id int PRIMARY KEY, data jsonb)` with 20,000 rows, each `{"name": "user<N>", "active": <boolean>}`, only 1 in 200 rows `active: true`. Create a GIN index on `data`, `ANALYZE`, and confirm `WHERE data @> \'{"active": true}\'` uses `Bitmap Index Scan`.',
        taskHi: 'Table `docs(id, data)` 20,000 rows ke saath, har ek `{"name": "user<N>", "active": <boolean>}`, sirf 200 mein se 1 row `active: true`. `data` par ek GIN index banao, `ANALYZE`, aur confirm karo `WHERE data @> \'{"active": true}\'` `Bitmap Index Scan` istemal karta hai.',
        hint: 'JSONB containment is exactly the "does this collection contain X" shape GIN is built for (Module 10, Lesson 4) — the rare `active: true` value (0.5% of rows) is selective enough for the index to help.',
        hintHi: 'JSONB containment theek wo "kya ye collection X contain karta hai" shape hai jiske liye GIN bana hai — rare `active: true` value (0.5% rows) index ke madad karne ke liye kaafi selective hai.',
      },
    ],

    keyTakeaways: [
      '`jsonb_set(target, path, new_value)` replaces the value at a nested path (same path-array syntax as `#>`/`#>>`), returning a NEW document with everything else preserved. The replacement value must itself be valid JSON — a string needs its own quotes (`\'"Mumbai"\'`), not a bare SQL string.',
      'jsonpath (`jsonb_path_query` / `jsonb_path_query_array`) answers STRUCTURAL questions plain operators can\'t: `$` = document root, `[*]` = every array element, `? (@.field > x)` = a FILTER on the current element. Reserve it for genuinely structural/conditional queries — a plain `->`/`->>` is simpler and more idiomatic for a single fixed key.',
      'A GIN index on `jsonb` serves `@>`/`?`/`?|`/`?&` together — same "does this collection contain X" shape Module 10 covered for arrays. `jsonb_path_ops` indexes ONLY what `@>` needs — notably smaller, but drops `?`/`?|`/`?&` support entirely — choose it only when containment is confirmed to be the only query shape used.',
      'JSONB vs normalized columns is a real trade-off, not "JSONB is more flexible so use it more": a stable, known, individually-queried field is almost always better as an ordinary typed column (real constraints/FKs, simpler/faster B-tree indexing). JSONB earns its place specifically for shapes that are genuinely irregular or evolve faster than a migration cycle.',
      'The common real-world pattern is a MIX: known, stable, frequently-queried fields as normal columns, plus one `jsonb` "extra"/"custom_fields" column absorbing whatever the fixed schema hasn\'t (or won\'t ever) fully accommodate — not an all-or-nothing choice between the two.',
    ],
    keyTakeawaysHi: [
      '`jsonb_set(target, path, new_value)` ek nested path par value replace karta hai, ek NAYA document lautaते hue jismein baaki sab preserved hai. Replacement value khud valid JSON honi chahiye.',
      'jsonpath (`jsonb_path_query` / `jsonb_path_query_array`) STRUCTURAL sawaal answer karta hai jo plain operators nahi kar sakte: `$` = document root, `[*]` = har array element, `? (@.field > x)` = current element par ek FILTER.',
      '`jsonb` par ek GIN index `@>`/`?`/`?|`/`?&` saath serve karta hai. `jsonb_path_ops` SIRF wo index karta hai jo `@>` ko chahiye — notably chhota, par `?`/`?|`/`?&` support poori tarah drop karta hai.',
      'JSONB vs normalized columns ek real trade-off hai: ek stable, known, individually-query hone waala field lgbhag hamesha ek ordinary typed column ke roop mein behtar hai. JSONB theek un shapes ke liye apni jagah kamaता hai jo genuinely irregular hain.',
      'Common real-world pattern ek MIX hai: known, stable, frequently-queried fields normal columns ke roop mein, plus ek `jsonb` "extra" column jo jo bhi fixed schema accommodate nahi karta use absorb karta hai — dono ke beech ek all-or-nothing choice nahi.',
    ],
  },

  {
    slug: 'sql-arrays',
    title: 'Arrays',
    titleHi: 'Arrays',
    description: 'PostgreSQL columns can hold an array of values directly — indexed and sliced like any array, expanded into rows with unnest, tested for membership with ANY/ALL, and compared for containment or overlap much like the JSONB operators from the last two lessons.',
    descriptionHi: 'PostgreSQL columns seedhe values ka ek array rakh sakte hain — kisī bhi array ki tarah indexed aur sliced, `unnest` se rows mein expand kiya gaya, `ANY`/`ALL` se membership test kiya gaya, aur pichhले do lessons ke JSONB operators ki tarah containment ya overlap ke liye compare kiya gaya.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A single mailbox slot that holds a small bundle of letters, rubber-banded together, instead of one letter per slot.** Normally, a mailbox system assumes one item per slot — one column, one value. But some data is naturally a small, ordered bundle that belongs to one row, not a separate table of its own: a customer\'s several phone numbers, a post\'s handful of tags, a schedule\'s few time slots. An array column is that rubber-banded bundle: it lives in one slot, but you can still reach in and grab the third letter specifically (indexing), grab a range of them (slicing), pull the whole bundle apart onto the table one letter at a time when you need to process each individually (`unnest`), or just ask "is this specific letter somewhere in the bundle" (`ANY`) without ever having to separate them permanently into their own mail slots.',
      hi: '**Ek single mailbox slot jismein letters ka ek chhota bundle hai, rubber-band se saath bandha, ek slot mein ek letter ke bजаय.** Normally, ek mailbox system maान leता hai ek slot mein ek item — ek column, ek value. Par kuch data naturally ek chhota, ordered bundle hai jo ek row ka hai, apni ek alag table ka nahi: ek customer ke kई phone numbers, ek post ke kुछ tags. Ek array column wo rubber-banded bundle hai: ye ek slot mein rehта hai, par aap phir bhi andar pahunch ke theek teesरा letter nikaal sakte ho (indexing), unka ek range nikaal sakte ho (slicing), poore bundle ko table par ek-ek letter alag kar sakte ho jab aapको har ek ko individually process karna ho (`unnest`), ya bas pooch sakte ho "kya ye specific letter bundle mein kahin hai" (`ANY`).',
    },

    simple: `**An array column, indexed (1-based!) and sliced**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
SELECT nums[1] AS first_elem, nums[2:3] AS slice, array_length(nums, 1) AS len FROM t;
\`\`\`
\`\`\`
 first_elem | slice   | len
------------+---------+-----
 10         | {20,30} | 3
(1 row)
-- PostgreSQL arrays are 1-INDEXED, not 0-indexed
\`\`\`

**\`unnest\` expands an array into one row per element**

\`\`\`sql
SELECT unnest(nums) AS n FROM t;
\`\`\`
\`\`\`
 n
----
 10
 20
 30
(3 rows)
\`\`\`

**\`ANY\` tests membership -- the array-column equivalent of \`IN\`**

\`\`\`sql
SELECT * FROM t WHERE 20 = ANY(nums);
\`\`\`

**\`@>\` containment and \`&&\` overlap -- array-to-array comparisons**

\`\`\`sql
CREATE TABLE tags (id int PRIMARY KEY, labels text[]);
INSERT INTO tags VALUES (1, ARRAY['a','b','c']), (2, ARRAY['x','y']);
SELECT id FROM tags WHERE labels @> ARRAY['a'];        -- row's array CONTAINS 'a'
SELECT id FROM tags WHERE labels && ARRAY['b','z'];    -- row's array OVERLAPS this set (shares >=1 element)
\`\`\`

**A GIN index accelerates \`@>\`/\`&&\` on arrays exactly like it does for JSONB (Module 10, Lesson 4)**`,

    simpleHi: `**Ek array column, indexed (1-based!) aur sliced**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
SELECT nums[1] AS first_elem, nums[2:3] AS slice, array_length(nums, 1) AS len FROM t;
\`\`\`
\`\`\`
 first_elem | slice   | len
------------+---------+-----
 10         | {20,30} | 3
(1 row)
-- PostgreSQL arrays 1-INDEXED hain, 0-indexed nahi
\`\`\`

**\`unnest\` ek array ko prati-element ek row mein expand karta hai**

\`\`\`sql
SELECT unnest(nums) AS n FROM t;
\`\`\`
\`\`\`
 n
----
 10
 20
 30
(3 rows)
\`\`\`

**\`ANY\` membership test karta hai -- array-column ka \`IN\` equivalent**

\`\`\`sql
SELECT * FROM t WHERE 20 = ANY(nums);
\`\`\`

**\`@>\` containment aur \`&&\` overlap -- array-to-array comparisons**

\`\`\`sql
CREATE TABLE tags (id int PRIMARY KEY, labels text[]);
INSERT INTO tags VALUES (1, ARRAY['a','b','c']), (2, ARRAY['x','y']);
SELECT id FROM tags WHERE labels @> ARRAY['a'];        -- row ka array 'a' CONTAIN karta hai
SELECT id FROM tags WHERE labels && ARRAY['b','z'];    -- row ka array is set se OVERLAP karta hai
\`\`\`

**Ek GIN index arrays par \`@>\`/\`&&\` ko theek waise accelerate karta hai jaisा ye JSONB ke liye karta hai (Module 10, Lesson 4)**`,

    content: `## Storing an array directly in a column

PostgreSQL lets any column type be declared as an array of that type — \`int[]\`, \`text[]\`, and so on — holding an ordered, variable-length list of values in a single row, without a separate table.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
\`\`\`

## Indexing and slicing

\`\`\`sql
SELECT nums[1] AS first_elem, nums[2:3] AS slice, array_length(nums, 1) AS len FROM t;
\`\`\`

PostgreSQL arrays are **1-indexed**, not 0-indexed as in most programming languages — \`nums[1]\` is the first element. A slice \`nums[2:3]\` returns elements 2 through 3 inclusive, as a smaller array. \`array_length(nums, 1)\` reports the length of the array's first dimension (arrays can technically be multi-dimensional, though a single flat list is by far the common case).

## \`unnest\`: turning an array into rows

\`\`\`sql
SELECT unnest(nums) AS n FROM t;
\`\`\`

\`unnest\` is a **set-returning function**: given one array value, it produces one output row per element. This is the array analogue of a join — it is how you process each element of an array individually with ordinary row-based SQL, aggregate across elements from many rows at once, or join an array's elements against another table.

## \`ANY\` and \`ALL\`: membership tests

\`\`\`sql
SELECT * FROM t WHERE 20 = ANY(nums);
\`\`\`

\`x = ANY(array)\` asks "is \`x\` equal to any element of this array" — the array-column equivalent of \`x IN (...)\` against a literal list, except the list lives inside a single row's column rather than being written out in the query. \`ALL\` is the corresponding "matches every element" check, less commonly needed but following the same pattern (\`x > ALL(array)\` means \`x\` exceeds every element).

## Containment and overlap: \`@>\` and \`&&\`

\`\`\`sql
CREATE TABLE tags (id int PRIMARY KEY, labels text[]);
INSERT INTO tags VALUES (1, ARRAY['a','b','c']), (2, ARRAY['x','y']);
SELECT id FROM tags WHERE labels @> ARRAY['a'];
SELECT id FROM tags WHERE labels && ARRAY['b','z'];
\`\`\`

\`@>\` (the same operator symbol as JSONB containment, Lesson 1) asks "does this row's array contain every element of the given array" — here, does \`labels\` contain \`'a'\`. \`&&\` asks a looser question: "do these two arrays share at least one element in common" (overlap) — row 1's \`labels\` (\`{a,b,c}\`) overlaps \`{b,z}\` because they share \`'b'\`, even though \`labels\` does not contain \`'z'\`.

## Indexing arrays

Just as with JSONB, a GIN index accelerates exactly these containment and overlap queries at scale (Module 10, Lesson 4 covered this from the index side): \`CREATE INDEX ON tags USING GIN (labels)\` builds an entry per distinct array element, each pointing back at every row whose array contains it, turning "does this array contain X" from a row-by-row scan into a direct lookup.

## When an array column is (and isn't) the right choice

An array column is a good fit for a small, unordered-or-simply-ordered, bounded collection that genuinely belongs to one row and is rarely queried by its individual elements' own attributes — tags, a handful of phone numbers, tokens. It becomes the wrong choice once the elements themselves need their own attributes (a phone number with a "type" and a "verified" flag), need to be individually referenced by foreign key from elsewhere, or the collection can grow large and unbounded — at that point, a proper child table with a foreign key back to the parent row is the more scalable, more queryable design, exactly the normalization discipline Module 7 covered.`,

    contentHi: `## Ek array seedhe ek column mein store karna

PostgreSQL kisī bhi column type ko us type ke ek array ke roop mein declare hone deta hai — \`int[]\`, \`text[]\`, waagаirah.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
\`\`\`

## Indexing aur slicing

\`\`\`sql
SELECT nums[1] AS first_elem, nums[2:3] AS slice, array_length(nums, 1) AS len FROM t;
\`\`\`

PostgreSQL arrays **1-indexed** hain, zyadатार programming languages ki tarah 0-indexed nahi — \`nums[1]\` pehla element hai. Ek slice \`nums[2:3]\` elements 2 se 3 tak inclusive lautaता hai, ek chhote array ke roop mein.

## \`unnest\`: ek array ko rows mein badalna

\`\`\`sql
SELECT unnest(nums) AS n FROM t;
\`\`\`

\`unnest\` ek **set-returning function** hai: ek array value diye jaane par, ye prati-element ek output row produce karta hai.

## \`ANY\` aur \`ALL\`: membership tests

\`\`\`sql
SELECT * FROM t WHERE 20 = ANY(nums);
\`\`\`

\`x = ANY(array)\` poochta hai "kya \`x\` is array ke kisī element ke barabar hai" — ek literal list ke against \`x IN (...)\` ka array-column equivalent.

## Containment aur overlap: \`@>\` aur \`&&\`

\`\`\`sql
CREATE TABLE tags (id int PRIMARY KEY, labels text[]);
INSERT INTO tags VALUES (1, ARRAY['a','b','c']), (2, ARRAY['x','y']);
SELECT id FROM tags WHERE labels @> ARRAY['a'];
SELECT id FROM tags WHERE labels && ARRAY['b','z'];
\`\`\`

\`@>\` (JSONB containment jaisа hi operator symbol, Lesson 1) poochta hai "kya is row ka array diye gaye array ka har element contain karta hai." \`&&\` ek looser sawaal poochta hai: "kya ye do arrays kam se kam ek common element share karte hain" (overlap).

## Arrays index karna

JSONB ki tarah hi, ek GIN index theek in containment aur overlap queries ko scale par accelerate karta hai (Module 10, Lesson 4).

## Kab ek array column sahi hai (aur kab nahi)

Ek array column ek chhote, unordered-ya-simply-ordered, bounded collection ke liye achhi fit hai jo genuinely ek row ki hai. Ye galat choice ban jaata hai jab elements ko khud apne attributes chahiye hon, ya collection bade aur unbounded ho sakта ho — us point par, ek proper child table (Module 7 ka normalization) zyada scalable design hai.`,

    examples: [
      {
        title: 'Array indexing (1-based), slicing, and length',
        titleHi: 'Array indexing (1-based), slicing, aur length',
        code: `CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
SELECT nums[1] AS first_elem, nums[2:3] AS slice, array_length(nums, 1) AS len FROM t;`,
        output: ` first_elem | slice   | len
------------+---------+-----
 10         | [20,30] | 3
(1 row)`,
        explain: "`nums[1]` returns the FIRST element (`10`) — PostgreSQL arrays are 1-indexed, not 0-indexed. `nums[2:3]` slices elements 2 through 3 inclusive, returning them as a smaller array `{20,30}`. `array_length(nums, 1)` reports the array's first-dimension length, `3`.",
        explainHi: '`nums[1]` PEHLA element lautaта hai (`10`) — PostgreSQL arrays 1-indexed hain, 0-indexed nahi. `nums[2:3]` elements 2 se 3 tak inclusive slice karta hai, unhe ek chhote array `{20,30}` ke roop mein lautाते hue. `array_length(nums, 1)` array ki first-dimension length report karta hai, `3`.',
      },
      {
        title: 'unnest expands an array into one row per element; ANY tests membership',
        titleHi: 'unnest ek array ko prati-element ek row mein expand karta hai; ANY membership test karta hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, nums int[]);
INSERT INTO t VALUES (1, ARRAY[10,20,30]);
SELECT unnest(nums) AS n FROM t;
SELECT * FROM t WHERE 20 = ANY(nums);`,
        output: ` n
----
 10
 20
 30
(3 rows)

 id | nums
----+------------
 1  | [10,20,30]
(1 row)`,
        explain: '`unnest(nums)` expands the single array `{10,20,30}` into three separate rows, one per element, in order. `20 = ANY(nums)` then asks whether `20` is a member of that same array on the original, un-expanded row — it is, so the row is returned intact.',
        explainHi: '`unnest(nums)` single array `{10,20,30}` ko teen alag rows mein expand karta hai, prati-element ek, order mein. `20 = ANY(nums)` phir poochta hai ki kya `20` original, un-expanded row par usī array ka member hai — ye hai, to row intact wapas ki jaati hai.',
      },
      {
        title: 'Array containment (@>) versus overlap (&&)',
        titleHi: 'Array containment (@>) versus overlap (&&)',
        code: `CREATE TABLE tags (id int PRIMARY KEY, labels text[]);
INSERT INTO tags VALUES (1, ARRAY['a','b','c']), (2, ARRAY['x','y']);
SELECT id FROM tags WHERE labels @> ARRAY['a'];
SELECT id FROM tags WHERE labels && ARRAY['b','z'];`,
        output: ` id
----
 1
(1 row)

 id
----
 1
(1 row)`,
        explain: "`labels @> ARRAY['a']` requires the row's array to contain every element on the right — only row 1's `{a,b,c}` contains `'a'`, so only row 1 matches. `labels && ARRAY['b','z']` only requires at least one shared element — row 1's `{a,b,c}` shares `'b'` with `{b,z}` (even though it lacks `'z'`), so it matches too; row 2's `{x,y}` shares nothing with either array and matches neither query.",
        explainHi: "`labels @> ARRAY['a']` ki maang hai ki row ka array right-hand side ka har element contain kare — sirf row 1 ka `{a,b,c}` `'a'` contain karta hai, to sirf row 1 match karti hai. `labels && ARRAY['b','z']` ko sirf kam se kam ek shared element chahiye — row 1 ka `{a,b,c}` `{b,z}` ke saath `'b'` share karta hai, to ye bhi match karti hai; row 2 ka `{x,y}` kisī se bhi kuch share nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming PostgreSQL arrays are 0-indexed, like most programming languages
SELECT nums[0] FROM t;   -- expecting the FIRST element
-- returns NULL -- there is no index 0 in a default PostgreSQL array`,
        right: `SELECT nums[1] FROM t;   -- PostgreSQL arrays are 1-indexed -- this is the first element`,
        why: 'PostgreSQL array indexing starts at 1 by default, a deliberate departure from the 0-based indexing convention used by most general-purpose programming languages, inherited from SQL\'s broader convention of 1-based ordinal positions (the same convention behind referring to "the first column" as column 1 elsewhere in SQL). Indexing with 0, expecting it to mean "the first element" the way it would in JavaScript, Python, or C, does not raise an error; it simply accesses a position that is out of the array\'s default bounds and returns NULL, which can silently produce wrong results rather than an obvious failure. Developers coming from an off-by-one-at-zero background need to consciously remember this convention every time they index into a PostgreSQL array directly.',
        whyHi: 'PostgreSQL array indexing default se 1 se shuru hoती hai, zyadатार general-purpose programming languages ke 0-based indexing convention se ek deliberate departure. `0` se index karna, ye expect karte hue ki iska matlab "pehla element" hai jaisा JavaScript, Python, ya C mein hota, error nahi deта; ye bas array ke default bounds ke bahar ek position access karta hai aur `NULL` lautaта hai.',
      },
      {
        wrong: `-- confusing containment (@>) with overlap (&&)
SELECT id FROM tags WHERE labels @> ARRAY['b', 'z'];
-- expecting this to mean "shares at least one of b or z" -- but @> requires ALL
-- of them to be present, so row 1 ({a,b,c}) does NOT match (it lacks 'z')`,
        right: `SELECT id FROM tags WHERE labels && ARRAY['b', 'z'];
-- && (overlap) is the "shares at least one element" check -- this matches row 1`,
        why: 'The @> containment operator requires every element of the right-hand array to be present in the left-hand row\'s array; it is an "all of these" check, not an "any of these" check, so passing a multi-element array to @> and expecting a match on partial overlap is a category error about what the operator actually means. The && overlap operator is the operator that specifically asks "do these two arrays share at least one element in common," which is the "any of these" question. Choosing between them comes down to precisely which question is being asked: whether a row\'s array must contain everything on the right (@>) or merely intersect with it at all (&&), and conflating the two produces queries that quietly return fewer rows than intended.',
        whyHi: '`@>` containment operator ki maang hai ki right-hand array ka har element left-hand row ke array mein maujood ho; ye ek "in sabhi ka" check hai, "in mein se koi ek" check nahi. `&&` overlap operator specifically wo operator hai jo poochta hai "kya ye do arrays kam se kam ek common element share karte hain."',
      },
      {
        wrong: `-- reaching for an array column when elements genuinely need their own attributes
CREATE TABLE contacts (id int PRIMARY KEY, phones text[]);
-- but each phone actually needs a "type" (mobile/work/home) AND a "verified" flag --
-- there's nowhere to put those on an individual array element`,
        right: `-- a proper child table models per-element attributes cleanly (Module 7):
CREATE TABLE contact_phones (
  id int PRIMARY KEY,
  contact_id int REFERENCES contacts(id),
  phone text,
  phone_type text,
  verified boolean
);`,
        why: 'An array column stores a bare list of scalar values; there is no way to attach additional attributes to an individual element the way a row in its own table naturally can, because an array element is just a value, not a row with its own columns. When the actual requirement turns out to be "each phone number also needs a type and a verified flag," an array of plain text values has nowhere to hold that information, forcing awkward workarounds like encoding multiple attributes into one string or maintaining several parallel arrays that have to stay in sync by position. A proper child table with its own columns and a foreign key back to the parent is the design that scales to this requirement cleanly, which is exactly the normalization reasoning Module 7 covered: reach for an array only when the collection\'s elements are genuinely bare, uniform values, and reach for a child table the moment individual elements need their own structured attributes.',
        whyHi: 'Ek array column scalar values ki ek bare list store karta hai; ek individual element par additional attributes attach karne ka koi tarika nahi hai, kyunki ek array element bas ek value hai, apni columns waali ek row nahi. Ek proper child table apni columns aur parent tak wapas ek foreign key ke saath wo design hai jo is requirement tak cleanly scale karta hai — theek Module 7 ka normalization reasoning.',
      },
    ],

    realWorld: [
      {
        en: '**A `posts.tags text[]` column** powering a "find posts tagged X" query via `tags @> ARRAY[\'postgresql\']`, simpler than a separate tags-junction table for a feature that never needs per-tag metadata.',
        hi: '**Ek `posts.tags text[]` column** jo `tags @> ARRAY[\'postgresql\']` ke through ek "X tagged posts dhoondो" query power karta hai.',
      },
      {
        en: '**`role text[]` on a `users` row storing a small, fixed set of role names**, checked with `\'admin\' = ANY(role)`, for a system where roles are simple strings with no additional per-role data.',
        hi: '**Ek `users` row par `role text[]` jo role names ka ek chhota, fixed set store karta hai**, `\'admin\' = ANY(role)` se check kiya jaata hai.',
      },
      {
        en: '**`unnest(array_column)` joined against a lookup table** to validate every element of a submitted array against a set of allowed values in one query, instead of looping over the array in application code.',
        hi: '**`unnest(array_column)` ek lookup table ke against join kiya gaya** ek submitted array ke har element ko ek query mein validate karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between the @> (containment) and && (overlap) array operators?',
        qHi: '`@>` (containment) aur `&&` (overlap) array operators mein kya antar hai?',
        a: 'The @> operator checks whether every element of the array on its right-hand side is present somewhere in the array on its left-hand side, which makes it an "all of these elements must be present" check; a row\'s array only matches if it contains the complete set given on the right, not merely some of them. The && operator instead checks whether the two arrays share at least one element in common, an "any of these elements" or overlap check, which succeeds even if only a single element intersects between the two arrays and the rest are entirely different. Confusing the two is a common source of subtly wrong queries: someone expecting "match if this row has any of these tags" will get too few results using @> with a multi-element array, since @> silently demands all of them rather than any of them, when && is the operator that actually expresses that intent.',
        aHi: '`@>` operator check karta hai ki iski right-hand side ke array ka har element left-hand side ke array mein kahin maujood hai, jo ise ek "in sabhi elements ka maujood hona zaroori hai" check banata hai. `&&` operator iske bजаय check karta hai ki do arrays kam se kam ek common element share karte hain, ek "in mein se koi bhi element" ya overlap check.',
      },
      {
        q: 'When is an array column the right design choice, and when should you use a separate child table instead?',
        qHi: 'Ek array column kab sahi design choice hai, aur aapको ek alag child table kab istemal karna chahiye?',
        a: 'An array column is a reasonable choice when a collection genuinely belongs entirely to one row, holds simple scalar values with no additional structure of their own, and is not expected to grow without bound, common examples being a handful of tags, a small set of role names, or a few phone numbers with no per-number metadata. It becomes the wrong choice the moment any of those assumptions breaks: if an individual element needs its own attributes, such as a phone number that also needs a type and a verified flag, there is simply nowhere on a bare array element to attach that information, since an element is just a value, not a row with columns. It is also the wrong choice if elements need to be referenced individually from elsewhere in the schema via a foreign key, since foreign keys point at rows, not at positions inside an array, or if the collection could grow arbitrarily large, since a child table scales far more gracefully than an ever-growing array value. In any of those cases, a proper child table with its own columns and a foreign key back to the parent row is the design that scales cleanly, which is exactly the normalization reasoning from Module 7 applied to this specific decision.',
        aHi: 'Ek array column ek reasonable choice hai jab ek collection genuinely poori tarah ek row ki hai, simple scalar values rakhती hai apni koi additional structure ke bina, aur unbounded badhne ki ummeed nahi hai. Ye galat choice ban jaata hai jaise hi in mein se koi bhi assumption toot jaata hai: agar ek individual element ko apne attributes chahiye, to ek bare array element par wo information attach karne ki koi jagah nahi hai. Aisे kisī bhi case mein, apni columns aur parent row tak wapas ek foreign key waali ek proper child table wo design hai jo cleanly scale karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, nums int[])` with one row holding `ARRAY[10,20,30]`. Write a query selecting the first element, a slice of elements 2 through 3, and the array\'s length, all in one `SELECT`.',
        taskHi: 'Table `t(id, nums)` ek row ke saath jo `ARRAY[10,20,30]` rakhती hai. Ek query likho jo pehla element, elements 2 se 3 tak ka ek slice, aur array ki length select karti hai.',
        hint: 'PostgreSQL arrays are 1-indexed: `nums[1]` is the first element (not `nums[0]`). `nums[2:3]` slices elements 2 through 3 inclusive. `array_length(nums, 1)` gives the first dimension\'s length.',
        hintHi: 'PostgreSQL arrays 1-indexed hain: `nums[1]` pehla element hai (`nums[0]` nahi). `nums[2:3]` elements 2 se 3 tak inclusive slice karta hai.',
      },
      {
        task: 'Same table as above. Write a query using `unnest` to turn the array into one row per element, and a second query using `ANY` to check whether `20` is a member of the array.',
        taskHi: 'Upar jaisī hi table. `unnest` istemal karte hue ek query likho jo array ko prati-element ek row mein badalti hai, aur `ANY` istemal karके ek doosri jo check karti hai ki `20` array ka member hai ya nahi.',
        hint: '`SELECT unnest(nums) AS n FROM t` produces one row per array element. `SELECT * FROM t WHERE 20 = ANY(nums)` is the array-column equivalent of `IN`.',
        hintHi: '`SELECT unnest(nums) AS n FROM t` prati array element ek row produce karta hai. `SELECT * FROM t WHERE 20 = ANY(nums)` array-column ka `IN` equivalent hai.',
      },
      {
        task: 'Table `tags(id int PRIMARY KEY, labels text[])` with row 1 holding `{a,b,c}` and row 2 holding `{x,y}`. Write one query using `@>` to find rows whose array contains `\'a\'`, and a second using `&&` to find rows whose array overlaps `{b,z}`.',
        taskHi: 'Table `tags(id, labels)` row 1 mein `{a,b,c}` aur row 2 mein `{x,y}` rakhте hue. `@>` istemal karte hue ek query likho jo un rows ko dhoondti hai jinka array `\'a\'` contain karta hai, aur `&&` istemal karके ek doosri jo `{b,z}` se overlap karti hai.',
        hint: '`WHERE labels @> ARRAY[\'a\']` requires containment (all listed elements present). `WHERE labels && ARRAY[\'b\', \'z\']` only requires at least one shared element — row 1 matches via `\'b\'` even though it lacks `\'z\'`.',
        hintHi: '`WHERE labels @> ARRAY[\'a\']` ko containment chahiye. `WHERE labels && ARRAY[\'b\', \'z\']` ko sirf kam se kam ek shared element chahiye — row 1 `\'b\'` ke through match karti hai chahe iske paas `\'z\'` na ho.',
      },
    ],

    keyTakeaways: [
      'A column can be declared as an array of any type (`int[]`, `text[]`, ...) — an ordered, variable-length list living inside one row, no separate table needed.',
      'PostgreSQL arrays are 1-INDEXED (`nums[1]` is the first element, NOT `nums[0]`) — a deliberate SQL convention, different from most programming languages. `nums[2:3]` slices a range; `array_length(nums, 1)` reports length.',
      '`unnest(array)` is a SET-RETURNING function: turns one array value into one row per element — the tool for processing/joining/aggregating over an array\'s elements with ordinary row-based SQL.',
      '`x = ANY(array)` tests membership — the array-column equivalent of `x IN (...)` against a literal list. `ALL` is the corresponding "matches every element" check.',
      '`@>` CONTAINMENT requires ALL of the right-hand array\'s elements to be present ("all of these"). `&&` OVERLAP requires only AT LEAST ONE shared element ("any of these") — confusing the two is the #1 mistake; same operator symbol (`@>`) as JSONB containment (Lesson 1), same underlying idea.',
      'A GIN index accelerates `@>`/`&&` on arrays exactly as it does for JSONB (Module 10, Lesson 4) — one entry per distinct element, pointing back at every row containing it.',
      'Array column = right choice for a small, bounded, uniform-scalar-value collection genuinely belonging to one row (tags, a few phone numbers). WRONG choice once elements need their OWN attributes, need individual foreign-key references, or the collection is unbounded — a proper child table (Module 7\'s normalization) is the design that scales there.',
    ],
    keyTakeawaysHi: [
      'Ek column ko kisī bhi type ke array ke roop mein declare kiya ja sakta hai — ek ordered, variable-length list jo ek row ke andar rehti hai, koi alag table zaroori nahi.',
      'PostgreSQL arrays 1-INDEXED hain (`nums[1]` pehla element hai, `nums[0]` NAHI). `nums[2:3]` ek range slice karta hai; `array_length(nums, 1)` length report karta hai.',
      '`unnest(array)` ek SET-RETURNING function hai: ek array value ko prati-element ek row mein badalta hai.',
      '`x = ANY(array)` membership test karta hai — array-column ka `x IN (...)` equivalent. `ALL` corresponding "har element match karta hai" check hai.',
      '`@>` CONTAINMENT ko right-hand array ke SABHI elements maujood hone chahiye. `&&` OVERLAP ko sirf KAM SE KAM EK shared element chahiye — dono ko confuse karna #1 mistake hai.',
      'Ek GIN index arrays par `@>`/`&&` ko theek waise accelerate karta hai jaisа JSONB ke liye karta hai (Module 10, Lesson 4).',
      'Array column = ek chhote, bounded, uniform-scalar-value collection ke liye sahi choice jo genuinely ek row ki hai. GALAT choice jaise hi elements ko apne ATTRIBUTES chahiye, individual foreign-key references chahiye, ya collection unbounded hai — ek proper child table (Module 7 ka normalization) wahaan scale karne waala design hai.',
    ],
  },
];
