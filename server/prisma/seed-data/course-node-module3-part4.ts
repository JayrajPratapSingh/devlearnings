/**
 * Node.js Complete Course — Module 3: Data & Persistence, lesson 4 (final).
 *
 * The N+1 query problem: fetching a list of N parent records, then looping
 * over them and running one additional query per record to fetch related
 * data — 1 query becomes N+1 queries, and the route's response time grows
 * linearly with however much data happens to exist, invisible in local
 * testing with a handful of rows, catastrophic in production with thousands.
 * Fixed with a single batched query (WHERE ... = ANY($1) / IN (...)) that
 * fetches all related rows in one round trip, then grouped in memory.
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

export const NODE_MODULE_3_PART4: CourseLesson[] = [
  {
    slug: 'n-plus-one-query-problem',
    title: 'The N+1 Query Problem: When One List Fetch Becomes Hundreds of Queries',
    titleHi: 'N+1 Query Problem: Jab Ek List Fetch Sainkdon Queries Ban Jaati Hai',
    description: 'A "blog posts" endpoint that works instantly with 5 test posts locally, then takes 8 seconds and hammers the database in production with 2,000 real posts.',
    descriptionHi: 'Ek "blog posts" endpoint jo local mein 5 test posts ke saath turant kaam karta hai, phir production mein 2,000 asli posts ke saath 8 second leta hai aur database ko peet-peet kar dubaata hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A single trip to the grocery store with one complete shopping list, versus a separate trip back to the store for every individual item on that list.** Fetching a list of parent records and then, for each one, running a separate additional query to fetch its related data, is like reading a shopping list of twenty items at home and then, instead of going to the store once and picking up all twenty items in one trip, driving back to the store, parking, walking to one specific aisle, buying exactly ONE item, and driving all the way home again — twenty separate round trips for twenty items that could have all been collected in a single visit. With a shopping list of three or four items, this obviously wasteful approach barely matters; the extra trips are quick, the inefficiency goes unnoticed. But the same approach applied to a shopping list of two thousand items becomes absurd — two thousand separate round trips to the store, each one paying the same fixed cost of driving there and back, when a single trip with a shopping cart would have accomplished the exact same result in a fraction of the time. A shopper who instead reads the entire list once, then makes ONE trip, filling the cart with everything on the list before returning home a single time, does the same total amount of "getting items," but pays the fixed cost of a round trip exactly once, no matter how long the list grows.',
      hi: '**Ek complete shopping list ke saath grocery store ki ek akeli trip, versus us list ke har akele item ke liye store tak ek alag trip.** Parent records ki ek list fetch karna aur phir, har ek ke liye, uska juda data fetch karne ke liye ek alag additional query chalaana, aise hai jaise ghar par bees items ki ek shopping list padhna aur phir, ek baar store jaakar ek hi trip mein sab bees items lene ke bajaye, wapas store tak drive karna, park karna, ek khaas aisle tak chalna, bilkul EK item khareedna, aur poora wapas ghar drive karna — bees alag round trips bees items ke liye jo sab ek akeli visit mein ikattha kiye ja sakte the. Teen ya chaar items ki ek shopping list ke saath, ye saaf-saaf faaltu tarika mushkil se hi maayne rakhta hai; extra trips jaldi hoti hain, na-kushalta kisi ko dikhti nahi. Par wahi tarika do hazaar items ki shopping list par lagu hone par bemaani ban jaata hai — do hazaar alag round trips store tak, har ek wahi fixed keemat chukaate hue wahan jaane aur wapas aane ki, jabki ek trolley ke saath ek akeli trip ne bilkul wahi nateeja kaafi kam waqt mein poora kar diya hota. Ek shopper jo iske bajaye poori list ek baar padhta hai, phir EK trip karta hai, list ki har cheez se trolley bharte hue ek akeli baar ghar wapas aane se pehle, "items lena" ki wahi kul tadaad karta hai, par round trip ki fixed keemat bilkul ek baar chukaata hai, chahe list kitni bhi badhe.',
    },

    simple: `**Start broken.** A route that returns a list of blog posts together with each post\'s author name — fetched with one query per post inside a loop:

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    // One additional query PER POST, run inside the loop
    for (const post of posts) {
      const authorResult = await pool.query(
        "SELECT name FROM users WHERE id = $1",
        [post.author_id]
      );
      post.authorName = authorResult.rows[0]?.name ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});
\`\`\`

With a handful of test posts — say, 5 — this route runs 1 query to fetch the posts, then 5 more queries inside the loop, one per post: 6 total queries, each one fast, the whole route responding in a few milliseconds. It works, it passes every manual test, and nothing about it looks obviously wrong reading the code — the loop is simple, each individual query inside it is simple and correctly written. The problem only becomes visible at a scale most local development never reaches: with 2,000 real posts in production, this exact same route now runs 1 query to fetch the posts, followed by 2,000 more queries inside the loop — 2,001 total queries for a single incoming HTTP request. Each individual query might still be fast in isolation, but 2,000 separate round trips to the database, each carrying its own network latency and connection-pool overhead, add up: a route that took a few milliseconds with 5 posts can easily take several seconds with 2,000, and under real concurrent traffic (multiple users loading this route at once), the sheer VOLUME of queries can itself become a bottleneck, competing for the pool\'s limited connections (covered two lessons ago) and slowing down every other route sharing that same pool. This pattern has a name specifically because it is common and easy to write by accident: fetching a list of N parent records, then running one additional query per record for related data, is "the N+1 query problem" — 1 initial query plus N additional ones, where N is however many rows the first query happened to return.

**The fix: one batched query for ALL the related data, joined together in a single round trip**

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postsResult = await pool.query<{ id: number; title: string; author_name: string }>(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

A SQL \`JOIN\` asks the database to combine matching rows from two tables (\`posts\` and \`users\`, matched on \`users.id = posts.author_id\`) and return the result as a single set of rows, all in one query, resolved entirely within the database engine itself — which is specifically built to perform exactly this kind of matching efficiently, generally using indexes on the join columns to avoid scanning every row. Whether the route returns 5 posts or 2,000, this version runs exactly ONE query, every time — the total number of queries is now completely independent of how many rows happen to exist, which is the actual fix: not making each individual query faster, but eliminating the linear relationship between the amount of data and the number of round trips to the database.`,

    simpleHi: `**Toote hue se shuru.** Ek route jo blog posts ki ek list lautaata hai har post ke author ke naam ke saath — ek loop ke andar har post ke liye ek query fetch kiya hua:

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    // Loop ke andar, HAR POST ke liye ek additional query
    for (const post of posts) {
      const authorResult = await pool.query(
        "SELECT name FROM users WHERE id = $1",
        [post.author_id]
      );
      post.authorName = authorResult.rows[0]?.name ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Mutthi bhar test posts ke saath — maano, 5 — ye route posts fetch karne ke liye 1 query chalata hai, phir loop ke andar 5 aur queries, har post ke liye ek: kul 6 queries, har ek tez, poora route kuch millisecond mein jawab deta hai. Ye kaam karta hai, har manual test paas karta hai, aur code padhte hue kuch bhi saaf-saaf galat nahi dikhta — loop saadha hai, uske andar har akeli query saadhi aur sahi tarike se likhi hui hai. Samasya sirf us scale par dikhti hai jahan zyaadatar local development kabhi pahunchta hi nahi: production mein 2,000 asli posts ke saath, bilkul yehi route ab posts fetch karne ke liye 1 query chalaata hai, uske baad loop ke andar 2,000 aur queries — ek aane wale HTTP request ke liye kul 2,001 queries. Har akeli query akele mein abhi bhi tez ho sakti hai, par database tak 2,000 alag round trips, har ek apna khud ka network latency aur connection-pool overhead uthaate hue, jud jaate hain: ek route jo 5 posts ke saath kuch millisecond leta tha 2,000 ke saath aasaani se kai second le sakta hai, aur asli concurrent traffic ke neeche (kai users ek saath ye route load karte hue), queries ki bilkul VOLUME khud ek bottleneck ban sakti hai, pool ke seemit connections (do lesson pehle cover hue) ke liye competition karte hue aur har doosre route ko dheema karte hue jo wahi pool share karta hai. Is pattern ka ek naam hai khaas taur par isliye kyunki ye aam hai aur galti se likhna aasaan hai: N parent records ki ek list fetch karna, phir juda data ke liye har record ke liye ek additional query chalaana, "N+1 query problem" hai — 1 shuruaati query plus N additional, jahan N jitni bhi rows pehli query ne lautaayi hon utna hi hai.

**Fix: SAARE juda data ke liye ek batched query, ek akele round trip mein saath jodi hui**

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postsResult = await pool.query<{ id: number; title: string; author_name: string }>(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek SQL \`JOIN\` database se maang karta hai ki wo do tables (\`posts\` aur \`users\`, \`users.id = posts.author_id\` par milaaye) se milti rows ko jode aur nateeja ek akeli set of rows ki tarah lautaaye, sab ek query mein, poori tarah database engine ke andar hi resolve hota hua — jo khaas taur par bilkul is kism ka milaan kushalta se karne ke liye bana hai, aam taur par join columns par indexes ka istemal karte hue har row scan karne se bachne ke liye. Chahe route 5 posts lautaaye ya 2,000, ye version bilkul EK query chalaata hai, har baar — queries ki kul tadaad ab poori tarah is baat se bekhabar hai ki kitni rows maujood hain, jo asli fix hai: har akeli query ko tez banaana nahi, balki data ki tadaad aur database tak round trips ki tadaad ke beech ke linear rishte ko khatam karna.`,

    content: `## Why the loop version "works" but hides its own cost

\`\`\`js
for (const post of posts) {
  const authorResult = await pool.query("SELECT name FROM users WHERE id = $1", [post.author_id]);
  post.authorName = authorResult.rows[0]?.name ?? "Unknown";
}
\`\`\`

There is nothing incorrect about any individual line in this loop — the query is valid SQL, correctly parameterized (following the previous lesson\'s SQL-injection lesson), and correctly retrieves the right author for each post. This is precisely what makes the N+1 pattern easy to write by accident and hard to catch in casual code review: every statement, read in isolation, is completely reasonable, and the bug is not a logic error at all — it is a PERFORMANCE characteristic that only reveals itself as an actual problem once the amount of data grows, something a quick glance at correct-looking code will not surface, and something a local development database seeded with a handful of rows will never demonstrate.

## Batching with WHERE ... = ANY($1): fetching many rows by ID in a single query

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    const authorIds = [...new Set(posts.map((p) => p.author_id))];
    const authorsResult = await pool.query(
      "SELECT id, name FROM users WHERE id = ANY($1)",
      [authorIds]
    );

    const authorsById = new Map(authorsResult.rows.map((a) => [a.id, a.name]));
    for (const post of posts) {
      post.authorName = authorsById.get(post.author_id) ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The \`JOIN\` version shown in the broken/fixed pair above is the cleanest fix when the goal is simply to combine two related tables\' data into one flat result. A second, equally valid batching approach — useful when the related data needs to stay as a separate, distinctly-shaped structure, or when a JOIN would awkwardly duplicate parent rows — is to collect all the needed foreign-key IDs first (\`author_id\` from every post, de-duplicated with \`new Set\`), then run exactly ONE additional query using \`WHERE id = ANY($1)\` (PostgreSQL\'s array-matching syntax, roughly equivalent to SQL\'s standard \`IN (...)\`) to fetch every needed author row in a single round trip, and finally match posts back to their authors in plain JavaScript using a \`Map\` for fast lookup. This is still exactly 2 queries total, regardless of how many posts exist — the same fundamental fix (eliminating the linear relationship between row count and query count) expressed slightly differently, useful specifically in cases where a straight SQL \`JOIN\` is not the most natural shape for the data the route needs to return.

## The N+1 problem is a general pattern, not specific to raw SQL or to "posts and authors"

\`\`\`js
// The exact same shape of bug with a completely different domain:
for (const order of orders) {
  const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
  order.items = items.rows;
}
\`\`\`

This lesson\'s examples use blog posts and authors specifically because the relationship is easy to follow, but the underlying pattern — fetch a list, then loop over it running one more query per item — appears in any one-to-many or many-to-one relationship: orders and their line items, comments and their authors, products and their categories, anything at all where a list of parent records each needs some related data attached. ORMs (Object-Relational Mappers) are not automatically immune to this either — many ORMs will, by default, execute exactly this same N+1 pattern under the hood if a developer accesses a related field inside a loop over the parent records without explicitly telling the ORM to "eagerly load" or "include" the related data upfront; Prisma\'s \`include\` option on a query (covered in this course\'s later data-modeling content) exists specifically to tell the ORM to batch the related data in the same round trip, rather than lazily fetching it one record at a time as the loop accesses it.

## How this is typically caught in practice: counting actual queries, not just eyeballing code

Because the N+1 pattern is invisible from casually reading correct-looking code, and invisible in local testing with only a handful of rows, it is typically caught in one of two ways in real teams: either through query logging or an APM (Application Performance Monitoring) tool that reports how many database queries a single request actually triggered — a route reporting "1 query" versus "347 queries" for the same conceptual operation is an immediate, concrete red flag — or through deliberately seeding a local or staging database with a realistically large amount of data (hundreds or thousands of rows, not five) specifically to surface performance characteristics that only emerge at scale, before the route ever reaches production traffic.`,

    contentHi: `## Loop version "kaam" kyun karta hai par apni khud ki keemat chupaata hai

\`\`\`js
for (const post of posts) {
  const authorResult = await pool.query("SELECT name FROM users WHERE id = $1", [post.author_id]);
  post.authorName = authorResult.rows[0]?.name ?? "Unknown";
}
\`\`\`

Is loop mein kisi bhi akeli line mein kuch galat nahi hai — query valid SQL hai, sahi tarike se parameterized hai (pichhle SQL-injection lesson ka palan karte hue), aur har post ke liye sahi author sahi tarike se laata hai. Bilkul yehi cheez N+1 pattern ko galti se likhna aasaan aur aam code review mein pakadna mushkil banaati hai: har statement, akela dekha jaaye, poori tarah samajhdaari bhara hai, aur bug bilkul koi logic error nahi hai — ye ek PERFORMANCE khaasiyat hai jo khud ko ek asli samasya ki tarah sirf tab dikhaati hai jab data ki tadaad badhti hai, kuch jo sahi-dikhte code par ek jaldi nazar dikhaayegi nahi, aur kuch jo mutthi bhar rows se seed kiya gaya local development database kabhi nahi dikhaayega.

## \`WHERE ... = ANY($1)\` se batching: ek akeli query mein kai rows ID se fetch karna

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    const authorIds = [...new Set(posts.map((p) => p.author_id))];
    const authorsResult = await pool.query(
      "SELECT id, name FROM users WHERE id = ANY($1)",
      [authorIds]
    );

    const authorsById = new Map(authorsResult.rows.map((a) => [a.id, a.name]));
    for (const post of posts) {
      post.authorName = authorsById.get(post.author_id) ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Upar toote/theek jode mein dikhaaya \`JOIN\` version sabse saaf fix hai jab maqsad bas do judi tables ka data ek flat nateeje mein jodna hai. Ek doosra, barabar valid batching tarika — kaam ka jab juda data ek alag, alag-shape wali sanrachna ki tarah rehna chahiye, ya jab ek \`JOIN\` awkward tarike se parent rows ko duplicate kar de — pehle sab zaruri foreign-key IDs ikattha karna hai (\`author_id\` har post se, \`new Set\` se de-duplicated), phir bilkul EK additional query \`WHERE id = ANY($1)\` (PostgreSQL ka array-milaan syntax, mota-maati SQL ke standard \`IN (...)\` ke barabar) use karke chalaana har zaruri author row ko ek akele round trip mein fetch karne ke liye, aur aakhir mein posts ko unke authors se saadhe JavaScript mein wapas milaana ek \`Map\` se tez lookup ke liye. Ye abhi bhi bilkul kul 2 queries hai, chahe kitne bhi posts maujood hon — wahi mool fix (row count aur query count ke beech linear rishta khatam karna) thodi alag tarike se express hua, khaas taur par un cases mein kaam ka jahan ek seedha SQL \`JOIN\` route ko lautaana chahiye data ke liye sabse swaabhavik shape nahi hai.

## N+1 samasya ek aam pattern hai, raw SQL ya "posts aur authors" tak khaas nahi

\`\`\`js
// Bilkul wahi bug ki shape ek poori tarah alag domain ke saath:
for (const order of orders) {
  const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
  order.items = items.rows;
}
\`\`\`

Is lesson ke examples blog posts aur authors ka istemal khaas taur par isliye karte hain kyunki rishta samajhna aasaan hai, par underlying pattern — ek list fetch karo, phir uske aar-paar loop karo har item ke liye ek aur query chalaate hue — kisi bhi one-to-many ya many-to-one rishte mein dikhta hai: orders aur unke line items, comments aur unke authors, products aur unki categories, kuch bhi jahan parent records ki ek list mein har ek ko kuch juda data attach chahiye. ORMs (Object-Relational Mappers) bhi apne aap ismein immune nahi hain — kai ORMs default taur par bilkul yehi N+1 pattern peeche chalaayenge agar ek developer parent records ke aar-paar ek loop ke andar ek juda field access karta hai bina ORM ko explicitly "eagerly load" ya "include" karne ke liye kahe juda data pehle hi — Prisma ke \`include\` option ek query par (is course ke baad wale data-modeling content mein cover hoga) khaas taur par isliye maujood hai taaki ORM ko batch karne ke liye kaha jaaye juda data ko usi round trip mein, use lazily ek-ek record fetch karne ke bajaye jab loop use access karta hai.

## Ye practice mein aam taur par kaise pakda jaata hai: sach mein queries ginna, sirf code dekh lena nahi

Kyunki N+1 pattern sahi-dikhte code ko aam taur par padhne se dikhta nahi hai, aur mutthi bhar rows ke saath local testing mein dikhta nahi hai, ye asli teams mein aam taur par do tarikon se pakda jaata hai: ya to query logging ya ek APM (Application Performance Monitoring) tool se jo report karta hai ki ek akela request sach mein kitni database queries chalaata hai — ek route jo ek hi conceptual operation ke liye "1 query" versus "347 queries" report karta hai ek turant, thos red flag hai — ya jaan-boojhkar ek local ya staging database ko ek waastavik-taur-par-badi tadaad ke data ke saath seed karke (sainkdon ya hazaaron rows, paanch nahi) khaas taur par un performance khaasiyaton ko dikhaane ke liye jo sirf scale par ubharti hain, us se pehle ki route kabhi production traffic tak pahunche.`,

    examples: [
      {
        title: 'Broken: one query per post inside a loop — 1 becomes N+1',
        titleHi: 'Toota: loop ke andar har post ke liye ek query — 1, N+1 ban jaata hai',
        code: `const posts = (await pool.query("SELECT id, title, author_id FROM posts")).rows;
for (const post of posts) {
  const author = await pool.query("SELECT name FROM users WHERE id = $1", [post.author_id]);
  post.authorName = author.rows[0]?.name ?? "Unknown";
}`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    for (const post of posts) {
      const authorResult = await pool.query(
        "SELECT name FROM users WHERE id = $1",
        [post.author_id]
      );
      post.authorName = authorResult.rows[0]?.name ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface PostRow {
  id: number;
  title: string;
  author_id: number;
  authorName?: string;
}

app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postsResult = await pool.query<PostRow>("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    for (const post of posts) {
      const authorResult = await pool.query<{ name: string }>(
        "SELECT name FROM users WHERE id = $1",
        [post.author_id]
      );
      post.authorName = authorResult.rows[0]?.name ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});`,
        output: `5 test posts: 6 total queries, responds in a few milliseconds — looks
completely fine. 2,000 production posts: 2,001 total queries for one
request — the exact same code, now taking several seconds and putting
heavy load on the connection pool.`,
        explain: 'The number of queries this route runs is directly proportional to the number of posts returned — a relationship that is invisible reading the code, only visible by actually counting queries or measuring response time at realistic scale.',
        explainHi: 'Ye route jitni queries chalaata hai wo seedhe taur par lautaaye gaye posts ki tadaad ke anupaat mein hai — ek rishta jo code padhte hue dikhta nahi, sirf sach mein queries ginkar ya waastavik scale par response time naapkar dikhta hai.',
      },
      {
        title: 'Fixed: a single JOIN fetches everything in one round trip',
        titleHi: 'Theek: ek akela JOIN sab kuch ek round trip mein fetch karta hai',
        code: `const result = await pool.query(
  \`SELECT posts.id, posts.title, users.name AS author_name
   FROM posts JOIN users ON users.id = posts.author_id\`
);`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface PostWithAuthor {
  id: number;
  title: string;
  author_name: string;
}

app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postsResult = await pool.query<PostWithAuthor>(
      \`SELECT posts.id, posts.title, users.name AS author_name
       FROM posts
       JOIN users ON users.id = posts.author_id\`
    );
    res.json(postsResult.rows);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `5 posts or 2,000 posts: exactly 1 query, every time — response time
now scales with how much data the database itself needs to read and
join internally (which it is specifically optimized for), not with a
growing number of separate round trips from Node.js.`,
        outputTs: `// Identical behaviour. The PostWithAuthor interface documents the
// exact shape of each joined row, including the aliased author_name
// column — pool.query<T>() remains a compile-time-only assertion, as
// covered in the connection-pooling lesson.`,
        explain: 'The query count is now a constant (1), completely decoupled from the number of rows — this is the actual fix: not making the loop faster, but removing the loop\'s query entirely.',
        explainHi: 'Query count ab ek constant hai (1), rows ki tadaad se poori tarah alag — ye asli fix hai: loop ko tez banaana nahi, balki loop ki query ko poori tarah hataana.',
      },
      {
        title: 'Alternative fix: batch with WHERE id = ANY($1) when a JOIN does not fit',
        titleHi: 'Vaikalpik fix: \`WHERE id = ANY($1)\` se batch karo jab ek \`JOIN\` fit na baithe',
        code: `const authorIds = [...new Set(posts.map((p) => p.author_id))];
const authors = await pool.query("SELECT id, name FROM users WHERE id = ANY($1)", [authorIds]);
const authorsById = new Map(authors.rows.map((a) => [a.id, a.name]));`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  try {
    const postsResult = await pool.query("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    const authorIds = [...new Set(posts.map((p) => p.author_id))];
    const authorsResult = await pool.query(
      "SELECT id, name FROM users WHERE id = ANY($1)",
      [authorIds]
    );

    const authorsById = new Map(authorsResult.rows.map((a) => [a.id, a.name]));
    for (const post of posts) {
      post.authorName = authorsById.get(post.author_id) ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface PostRow {
  id: number;
  title: string;
  author_id: number;
  authorName?: string;
}

app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postsResult = await pool.query<PostRow>("SELECT id, title, author_id FROM posts");
    const posts = postsResult.rows;

    const authorIds = [...new Set(posts.map((p) => p.author_id))];
    const authorsResult = await pool.query<{ id: number; name: string }>(
      "SELECT id, name FROM users WHERE id = ANY($1)",
      [authorIds]
    );

    const authorsById = new Map(authorsResult.rows.map((a) => [a.id, a.name]));
    for (const post of posts) {
      post.authorName = authorsById.get(post.author_id) ?? "Unknown";
    }

    res.json(posts);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `Exactly 2 queries total, regardless of how many posts exist — one for
posts, one batched query for every distinct author needed, matched
back together in memory with a Map instead of the database.`,
        outputTs: `// Identical behaviour. Useful specifically when the related data
// should stay as its own distinctly-shaped structure rather than
// being flattened into the parent row by a JOIN.`,
        explain: 'De-duplicating author IDs with new Set before the batched query avoids asking the database for the same author multiple times when several posts share one author.',
        explainHi: 'Batched query se pehle \`new Set\` se author IDs ko de-duplicate karna database se ek hi author baar-baar maangne se bachaata hai jab kai posts ek author share karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `for (const post of posts) {
  const author = await pool.query("SELECT name FROM users WHERE id = $1", [post.author_id]);
  post.authorName = author.rows[0]?.name;
}
// 1 query becomes N+1 queries, N = number of posts`,
        right: `const result = await pool.query(
  "SELECT posts.id, posts.title, users.name AS author_name FROM posts JOIN users ON users.id = posts.author_id"
);
// always exactly 1 query, regardless of how many posts exist`,
        why: 'Running one additional query per row inside a loop makes the total number of queries grow linearly with the amount of data — fine with a handful of test rows, a serious performance and connection-pool problem at production scale.',
        whyHi: 'Ek loop ke andar har row ke liye ek additional query chalaana queries ki kul tadaad ko data ki tadaad ke saath linear taur par badhaata hai — mutthi bhar test rows ke saath theek, production scale par ek gambhir performance aur connection-pool samasya.',
      },
      {
        wrong: `for (const post of posts) {
  const author = await pool.query("SELECT name FROM users WHERE id = $1", [post.author_id]);
}
// even with de-duplicate-able author_ids, still one query per post`,
        right: `const authorIds = [...new Set(posts.map((p) => p.author_id))];
const authors = await pool.query("SELECT id, name FROM users WHERE id = ANY($1)", [authorIds]);
// one query for ALL needed authors, de-duplicated first`,
        why: 'Even without a JOIN, batching every needed ID into a single query with ANY($1)/IN(...) keeps the query count constant — collecting IDs first and de-duplicating them avoids asking for the same row more than once.',
        whyHi: 'Ek \`JOIN\` ke bina bhi, har zaruri ID ko ek akeli query mein \`ANY($1)\`/\`IN(...)\` se batch karna query count ko constant rakhta hai — pehle IDs ikattha karke unhe de-duplicate karna ek row ko ek se zyaada baar maangne se bachaata hai.',
      },
      {
        wrong: `// Assuming an ORM automatically avoids this
for (const post of await prisma.post.findMany()) {
  console.log(post.author.name); // may trigger one query PER post under the hood
}`,
        right: `const posts = await prisma.post.findMany({ include: { author: true } });
for (const post of posts) {
  console.log(post.author.name); // author already loaded in the same batched query
}`,
        why: 'ORMs are not automatically immune to the N+1 pattern — accessing a related field inside a loop without explicitly requesting it upfront (Prisma\'s include, or the equivalent in another ORM) can silently trigger the exact same one-query-per-row pattern under the hood.',
        whyHi: 'ORMs apne aap N+1 pattern se immune nahi hain — ek juda field ko ek loop ke andar bina pehle se explicitly maange access karna (Prisma ka \`include\`, ya kisi doosre ORM mein uske barabar) chupke se bilkul wahi ek-query-per-row pattern peeche chala sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**The N+1 query problem is one of the most commonly cited real-world backend performance bugs, specifically because it is invisible in code review and invisible in typical local development**, where seed data rarely reaches the row counts needed to make its cost noticeable — teams frequently discover it only after a feature has already shipped and slowed down under real production data volume.',
        hi: '**N+1 query problem sabse aksar cite hone waala asli-duniya backend performance bug hai, khaas taur par isliye kyunki ye code review mein aur aam local development mein dikhta hi nahi**, jahan seed data shaayad hi kabhi un row counts tak pahunchta hai jo uski keemat noticeable banaane ke liye chahiye — teams aksar ise sirf tab discover karti hain jab ek feature pehle se ship ho chuka hota hai aur asli production data volume ke neeche dheema ho jaata hai.',
      },
      {
        en: '**Most major ORMs (Prisma, TypeORM, Sequelize, ActiveRecord in Ruby, Django\'s ORM in Python) explicitly document their own "eager loading" feature specifically to prevent this pattern** — the fact that this feature exists, and is documented prominently, in essentially every major ORM across every backend language is itself strong evidence of how common and how costly this specific bug is in practice.',
        hi: '**Zyaadatar mukhya ORMs (Prisma, TypeORM, Sequelize, Ruby ka ActiveRecord, Python mein Django ka ORM) apna khud ka "eager loading" feature khaas taur par is pattern ko rokne ke liye explicitly document karte hain** — is baat ka hona ki ye feature maujood hai, aur lagbhag har mukhya ORM mein har backend language ke aar-paar prominently document hua hai, khud isi baat ka strong saboot hai ki ye khaas bug practice mein kitna aam aur kitna mehenga hai.',
      },
      {
        en: '**Query-count and query-time monitoring (via an APM tool, or simply logging every query a request triggers in development) is a standard, widely recommended practice specifically to catch N+1 patterns before they reach production**, precisely because the bug cannot be reliably caught by reading code alone.',
        hi: '**Query-count aur query-time monitoring (ek APM tool ke through, ya bas development mein har query jo ek request chalaata hai use log karke) ek standard, vyapak taur par sujhaayi jaane wali practice hai khaas taur par production tak pahunchne se pehle N+1 patterns pakadne ke liye**, theek isliye kyunki ye bug akele code padhkar bharosemand taur par pakda nahi ja sakta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the N+1 query problem, and why does it typically go unnoticed until an application reaches production scale?',
        qHi: 'N+1 query problem kya hai, aur ye aam taur par tab tak kyun dhyaan mein nahi aata jab tak ek application production scale tak nahi pahunchta?',
        a: 'The N+1 query problem occurs when code fetches a list of N parent records with one query, then loops over that list and runs one additional query per record to fetch related data — the total number of queries becomes 1 (for the initial list) plus N (one per record), rather than a small, constant number. It typically goes unnoticed for two related reasons: first, every individual line of code involved is completely correct in isolation — the initial query is valid, and each per-record query inside the loop is valid, correctly parameterized SQL — so there is no logic error a code reviewer reading the code would flag, only a performance characteristic that is invisible from the code\'s structure alone. Second, and more practically, local development and casual manual testing typically involve a tiny number of seed or test records — five or ten rows, not thousands — so even though the query count technically scales as N+1, with a small N the absolute number of queries and the resulting response time remain small enough that nothing about the route\'s behavior feels wrong. The problem only becomes visibly, measurably serious once the amount of real data grows to a scale most local testing never reaches, which is precisely why it is commonly discovered only after a feature has already reached production.',
        aHi: 'N+1 query problem tab hoti hai jab code N parent records ki ek list ek query se fetch karta hai, phir us list ke aar-paar loop karta hai aur juda data fetch karne ke liye har record ke liye ek additional query chalaata hai — queries ki kul tadaad 1 (shuruaati list ke liye) plus N (har record ke liye ek) ban jaati hai, ek chhoti, constant tadaad ke bajaye. Ye aam taur par do jude wajahon se dhyaan mein nahi aata: pehla, ismein shaamil har akeli line of code akele mein poori tarah sahi hai — shuruaati query valid hai, aur loop ke andar har record-ke-hisaab-se query valid, sahi tarike se parameterized SQL hai — isliye koi logic error nahi hai jise ek code reviewer code padhte hue flag kare, sirf ek performance khaasiyat jo code ki sanrachna se akele dikhti nahi. Doosra, aur zyaada practical taur par, local development aur aam manual testing mein aam taur par thodi tadaad ke seed ya test records shaamil hote hain — paanch ya das rows, hazaaron nahi — isliye chahe query count technically N+1 ki tarah scale ho, ek chhote N ke saath queries ki poori tadaad aur nateeja response time itne chhote rehte hain ki route ke vyavhaar mein kuch bhi galat nahi lagta. Samasya sirf tab dikhaayi dene laayak, naapi jaa sakne laayak gambhir banti hai jab asli data ki tadaad us scale tak badhti hai jahan zyaadatar local testing kabhi pahunchta hi nahi, aur bilkul isliye ye aam taur par sirf tab discover hoti hai jab ek feature pehle se production tak pahunch chuka hota hai.',
      },
      {
        q: 'How does using a SQL JOIN fix the N+1 query problem, and why does the fix work the same way regardless of how many rows exist?',
        qHi: 'Ek SQL \`JOIN\` istemal karna N+1 query problem ko kaise theek karta hai, aur ye fix wahi tarike se kyun kaam karta hai chahe kitni bhi rows maujood hon?',
        a: 'A JOIN asks the database engine itself to combine matching rows from two (or more) tables and return the combined result as a single set of rows, all resolved within one query sent to the database — rather than the application asking for the parent rows first, and then separately asking for each related row one at a time. Because the entire matching process (finding, for each post, its corresponding author row) happens inside the database in one operation, the number of round trips between the Node.js application and the database drops to exactly one, regardless of how many posts or authors are involved — the database itself does the work that the N+1 version was previously doing across many separate network round trips, and database engines are specifically built and optimized (often using indexes on the joined columns) to perform this kind of matching efficiently in bulk. This is the essential nature of the fix: it does not make each individual query run faster, it eliminates the linear relationship between the amount of data and the number of separate queries the application needs to issue — one query handles all rows, whether that is 5 or 2 million.',
        aHi: 'Ek \`JOIN\` database engine se khud maang karta hai ki wo do (ya zyaada) tables se milti rows ko jode aur milaa hua nateeja ek akeli set of rows ki tarah lautaaye, sab database ko bheji ek query ke andar resolve hota hua — application dwara pehle parent rows maangne, phir alag se har juda row ek-ek karke maangne ke bajaye. Kyunki poora milaan process (har post ke liye, uska juda author row dhoondhna) database ke andar ek operation mein hota hai, Node.js application aur database ke beech round trips ki tadaad bilkul ek tak gir jaati hai, chahe kitne bhi posts ya authors shaamil hon — database khud wo kaam karta hai jo N+1 version pehle kai alag network round trips ke aar-paar kar raha tha, aur database engines khaas taur par bane aur optimize kiye gaye hain (aksar joined columns par indexes use karte hue) is kism ka milaan bulk mein kushalta se karne ke liye. Yehi fix ka mool swaroop hai: ye har akeli query ko tez nahi chalaata, ye data ki tadaad aur application ko chalaani chahiye alag queries ki tadaad ke beech ke linear rishte ko khatam karta hai — ek query sab rows sambhaalta hai, chahe wo 5 ho ya 20 lakh.',
      },
      {
        q: 'Why are ORMs not automatically immune to the N+1 query problem, and what feature do most ORMs provide specifically to prevent it?',
        qHi: 'ORMs N+1 query problem se apne aap immune kyun nahi hain, aur zyaadatar ORMs ise khaas taur par rokne ke liye kaunsa feature dete hain?',
        a: 'An ORM\'s standard query methods (fetching a list of records, for instance) generally run a single, efficient query for that specific call — the risk arises specifically in how the application code subsequently accesses each record\'s related data. If a developer loops over the fetched parent records and, inside that loop, accesses a related field (an order\'s items, a post\'s author) that the ORM did not already fetch as part of the original query, many ORMs will, by default, "lazily" run a separate query at the exact moment that related field is first accessed — which, inside a loop over N parent records, produces exactly the same one-query-per-record pattern as hand-written N+1 code, just hidden one layer beneath the ORM\'s abstraction rather than being visible in the application\'s own explicit query calls. To prevent this, essentially every major ORM provides an explicit "eager loading" mechanism — Prisma\'s include option, for instance — that tells the ORM, at the time of the original query, to fetch the related data upfront, batched together in the same round trip (or a small constant number of additional batched queries), rather than lazily one record at a time as a loop happens to access each one. Using an ORM does not eliminate the need to understand this pattern; it shifts the responsibility to explicitly opting into eager loading wherever related data will be accessed across a list of records.',
        aHi: 'Ek ORM ke standard query methods (jaise records ki ek list fetch karna) aam taur par us khaas call ke liye ek akeli, kushal query chalaate hain — khatra khaas taur par isme uthta hai ki application code baad mein har record ka juda data kaise access karta hai. Agar ek developer fetched parent records ke aar-paar loop karta hai aur, us loop ke andar, ek juda field access karta hai (ek order ke items, ek post ka author) jise ORM ne asli query ke hisse ki tarah pehle se fetch nahi kiya tha, kai ORMs default taur par, "lazily" ek alag query chalaayenge theek us pal jab wo juda field pehli baar access hota hai — jo, N parent records ke aar-paar ek loop ke andar, bilkul wahi ek-query-per-record pattern paida karta hai jo haath se likha N+1 code karta, bas ORM ke abstraction ke ek layer neeche chupa hua application ki apni explicit query calls mein dikhne ke bajaye. Ise rokne ke liye, lagbhag har mukhya ORM ek explicit "eager loading" mechanism deta hai — Prisma ka \`include\` option, misal ke taur par — jo ORM ko batata hai, asli query ke waqt, juda data pehle hi fetch karne ke liye, usi round trip mein saath batched (ya thodi constant tadaad ki additional batched queries), lazily ek-ek record loop ke access karte hi ke bajaye. Ek ORM istemal karna is pattern ko samajhne ki zarurat khatam nahi karta; ye zimmedaari ko explicitly eager loading opt-in karne mein badalta hai jahan bhi juda data records ki ek list ke aar-paar access hoga.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /posts route with a per-post query inside a loop. Add a temporary counter that increments on every pool.query() call, and log the total after the route finishes, with 5 seed posts.',
        taskHi: 'Loop ke andar har-post-ke-liye query wala toota \`/posts\` route banao. Ek asthaayi counter jodo jo har \`pool.query()\` call par badhe, aur route poora hone ke baad total log karo, 5 seed posts ke saath.',
        hint: 'A simple module-level "let queryCount = 0" incremented right before every pool.query() call works fine for this quick experiment.',
        hintHi: 'Is jaldi prayog ke liye ek saadha module-level "let queryCount = 0" jo har \`pool.query()\` call se theek pehle badhta hai theek kaam karta hai.',
      },
      {
        task: 'Seed 200 test posts across a handful of authors, run the same query-counting experiment, and confirm the count scales to roughly 201 — directly observing the N+1 relationship rather than just reading about it.',
        taskHi: '200 test posts seed karo mutthi bhar authors ke aar-paar, wahi query-ginne wala prayog chalaao, aur confirm karo count lagbhag 201 tak scale hota hai — N+1 rishte ko seedha dekhte hue, bas uske baare mein padhne ke bajaye.',
        hint: 'A simple loop-based seeding script inserting posts with a randomly chosen author_id from a small fixed set of author IDs is enough.',
        hintHi: 'Ek saadha loop-based seeding script jo ek chhote fixed set ke author IDs mein se randomly chuna hua \`author_id\` ke saath posts insert kare kaafi hai.',
      },
      {
        task: 'Fix the route using a JOIN, rerun the same 200-post query-counting experiment, and confirm the count is now exactly 1 regardless of post count. Then implement the WHERE id = ANY($1) alternative and confirm it is exactly 2.',
        taskHi: 'Ek \`JOIN\` se route theek karo, wahi 200-post query-ginne wala prayog dobara chalaao, aur confirm karo count ab bilkul 1 hai chahe post count kuch bhi ho. Phir \`WHERE id = ANY($1)\` vaikalpik tarika lagu karo aur confirm karo ye bilkul 2 hai.',
        hint: 'Try scaling the seed data up to 2,000 posts for both the broken and fixed versions and compare actual response times directly, to see the real-world impact rather than just the query count.',
        hintHi: 'Seed data ko dono toote aur theek versions ke liye 2,000 posts tak badhaane ki koshish karo aur asli response times ko seedha compare karo, sirf query count ke bajaye waastavik-duniya asar dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'The N+1 query problem occurs when fetching a list of N records is followed by one additional query per record inside a loop — the total query count becomes 1 + N instead of a small constant number.',
      'Every individual line inside an N+1 loop is typically correct SQL — the bug is a performance characteristic invisible from reading the code, not a logic error.',
      'The pattern is invisible in typical local testing (a handful of seed rows) and only becomes seriously costly at production scale (hundreds or thousands of rows), which is why it commonly ships unnoticed.',
      'A SQL JOIN fixes the problem by resolving the matching between related tables entirely inside the database in one query, making the total query count constant regardless of row count.',
      'WHERE id = ANY($1) (or IN (...)) is an equally valid batching alternative when the related data needs to stay as its own distinctly-shaped structure rather than being flattened by a JOIN — collect and de-duplicate the needed IDs first, then fetch them all in one query.',
      'ORMs are not automatically immune — accessing a related field inside a loop without explicitly requesting eager loading (Prisma\'s include, or the equivalent) can silently trigger the same one-query-per-row pattern under the hood.',
    ],
    keyTakeawaysHi: [
      'N+1 query problem tab hoti hai jab N records ki ek list fetch karne ke baad loop ke andar har record ke liye ek additional query aati hai — kul query count ek chhoti constant tadaad ke bajaye 1 + N ban jaata hai.',
      'Ek N+1 loop ke andar har akeli line aam taur par sahi SQL hoti hai — bug ek performance khaasiyat hai jo code padhne se dikhti nahi, koi logic error nahi.',
      'Pattern aam local testing mein (mutthi bhar seed rows) dikhta nahi aur sirf production scale par (sainkdon ya hazaaron rows) gambhir taur par mehenga banta hai, isi wajah se ye aam taur par bina dhyaan diye ship ho jaata hai.',
      'Ek SQL \`JOIN\` samasya ko theek karta hai judi tables ke beech milaan ko poori tarah database ke andar ek query mein resolve karke, kul query count ko row count se bekhabar constant banaate hue.',
      '\`WHERE id = ANY($1)\` (ya \`IN (...)\`) ek barabar valid batching vaikalpik hai jab juda data apni khud ki alag-shape wali sanrachna ki tarah rehna chahiye ek \`JOIN\` se flatten hone ke bajaye — pehle zaruri IDs ikattha aur de-duplicate karo, phir sabko ek query mein fetch karo.',
      'ORMs apne aap ismein immune nahi hain — ek juda field ko ek loop ke andar bina explicitly eager loading maange access karna (Prisma ka \`include\`, ya uske barabar) chupke se wahi ek-query-per-row pattern peeche chala sakta hai.',
    ],
  },
];
