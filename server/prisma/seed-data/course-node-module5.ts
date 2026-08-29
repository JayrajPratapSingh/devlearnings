/**
 * Node.js Complete Course — Module 5: Real-World Patterns & Architecture,
 * lesson 1.
 *
 * Pagination: why returning an entire table via a single unpaginated
 * SELECT * FROM posts works fine in development and quietly becomes
 * catastrophic once a table holds real production volume. Broken example:
 * a /posts route with no LIMIT at all — response size and query time grow
 * without bound as the table grows. Fixed with LIMIT/OFFSET pagination,
 * then a note on OFFSET's own performance cliff at large offsets and the
 * cursor-based alternative.
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

export const NODE_MODULE_5: CourseLesson[] = [
  {
    slug: 'pagination',
    title: 'Pagination: Why Returning "All the Rows" Does Not Scale',
    titleHi: 'Pagination: "Saari Rows" Lautaana Scale Kyun Nahi Karta',
    description: 'A "/posts" endpoint that works instantly with 20 test rows, then returns a 40MB response and times out once the table holds 2 million real posts.',
    descriptionHi: 'Ek "/posts" endpoint jo 20 test rows ke saath turant kaam karta hai, phir ek 40MB response lautaata hai aur timeout hota hai jab table mein 20 lakh asli posts hote hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A librarian who, asked for "the books on gardening," hands over every single gardening book in the entire library system all at once, versus one who hands over the first 20 and offers to bring the next 20 whenever asked.** A route that returns an entire table with no limit is like a librarian who, when a patron asks to see the gardening section, disappears into the stacks and returns staggering under a cart holding all 4,000 gardening books the library owns — technically a complete and correct answer to what was asked, but something no patron ever actually wanted or could use at once, and something that leaves the librarian unable to help anyone else while hauling that entire cart across the building. With a library that only owns 20 gardening books, this approach is harmless — the librarian fetches all 20 in a few seconds either way, and the difference between "all of them" and "the first 20" is invisible. A librarian who instead reliably hands over a manageable stack of 20 books, along with a small card saying "ask for the next 20 whenever you are ready," gives the patron exactly as much as they can actually look at right now, keeps the trip to the stacks fast regardless of how large the gardening section eventually grows to, and only ever fetches the next batch when and if it is actually requested.',
      hi: '**Ek librarian jo, "gardening ki kitaabein" maangne par, poori library system ki har akeli gardening kitaab ek saath thama deta hai, versus ek jo pehli 20 thamaata hai aur jab bhi maango agli 20 laane ki peshkash karta hai.** Ek route jo bina kisi seemaa ke poora table lautaata hai ek aise librarian jaisa hai jo, jab ek patron gardening section dekhna maangta hai, stacks mein gaayab ho jaata hai aur ek trolley ke neeche ludhakte hue wapas aata hai jismein library ke maalik saari 4,000 gardening kitaabein hain — technically ye jo maanga gaya tha uska ek poora aur sahi jawaab hai, par kuch aisa jo koi bhi patron kabhi asal mein chahta nahi tha ya ek saath istemal kar sakta tha, aur kuch aisa jo librarian ko poori trolley building ke aar-paar dhone ke dauraan kisi aur ki madad karne se asamarth chhod deta hai. Ek library jiske paas sirf 20 gardening kitaabein hain, ye tarika bekhatra hai — librarian dono soorton mein kuch second mein saari 20 laata hai, aur "sabhi" aur "pehli 20" ke beech farak dikhta hi nahi. Ek librarian jo iske bajaye bharosemand taur par 20 kitaabon ka ek sambhaalne-laayak dher thamaata hai, ek chhota card ke saath "jab bhi taiyaar ho agli 20 maango," patron ko theek utna deta hai jitna wo abhi asal mein dekh sakte hain, stacks tak ki trip ko tez rakhta hai chahe gardening section aakhirkaar kitna bhi bada ho jaaye, aur agla batch sirf tabhi laata hai jab aur agar wo asal mein maanga jaata hai.',
    },

    simple: `**Start broken.** A route that returns every single row in the \`posts\` table, no matter how many exist:

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

With 20 test posts seeded locally, this route responds in a few milliseconds with a small, easy-to-read JSON array — it works, it passes every manual test, and there is nothing about the code itself that looks wrong. The problem is entirely one of scale, and it is invisible until the table actually grows: with 2 million real posts in production, this exact same query now asks the database to read, sort, and serialize 2 million rows, and asks Node.js to build and send a response that could easily be tens of megabytes, all for a single incoming HTTP request. Even if the database itself can technically execute the query, the response takes a long time to generate and transmit, consumes a large amount of memory on both the server and the client while it is being processed, and a mobile client on a slow connection may simply time out or run out of memory trying to receive it — none of which was ever the actual intent of whatever frontend feature first asked for "the list of posts," which almost always only needs to display a first page of, say, 20 items at a time.

**The fix: LIMIT and OFFSET, returning one page at a time**

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query<{ id: number; title: string; created_at: Date }>(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`LIMIT\` tells the database to stop after returning a specific number of rows (here, \`pageSize\`, a fixed 20), and \`OFFSET\` tells it how many matching rows to skip before it starts returning results — \`page=1\` skips 0 rows and returns the first 20; \`page=2\` skips 20 rows and returns the next 20; and so on. Regardless of whether the \`posts\` table holds 20 rows or 2 million, this version reads and returns a bounded, predictable number of rows for any single request — the response size and query time no longer grow with however much data happens to exist, which is the actual fix: not making the query faster in some absolute sense, but capping how much work any single request can ever demand, and letting the client explicitly ask for more pages only as it actually needs them.`,

    simpleHi: `**Toote hue se shuru.** Ek route jo \`posts\` table ki har akeli row lautaata hai, chahe kitni bhi maujood hon:

\`\`\`js
app.get("/posts", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Locally seed ki gayi 20 test posts ke saath, ye route ek chhote, padhne-mein-aasaan JSON array ke saath kuch millisecond mein jawaab deta hai — ye kaam karta hai, har manual test paas karta hai, aur code mein khud kuch bhi galat nahi dikhta. Samasya poori tarah scale ki hai, aur ye tab tak dikhti nahi jab tak table asal mein badhta nahi: production mein 20 lakh asli posts ke saath, bilkul yehi query ab database se 20 lakh rows padhne, sort karne, aur serialize karne ko kehti hai, aur Node.js se ek jawaab banaane aur bhejne ko kehti hai jo aasaani se dason megabytes ho sakta hai, sab ek akeli aane wali HTTP request ke liye. Chahe database khud technically query chala sake, jawaab banaane aur bhejne mein lamba waqt lagta hai, process hote waqt server aur client dono par bahut zyaada memory istemal karta hai, aur ek dheeme connection par ek mobile client ise paane ki koshish mein bas timeout ya memory khatam ho sakta hai — inmein se kuch bhi kabhi us frontend feature ka asli iraada nahi tha jisne pehle "posts ki list" maangi, jise lagbhag hamesha sirf ek pehla page dikhaana chahiye, maano ek waqt mein 20 items.

**Fix: \`LIMIT\` aur \`OFFSET\`, ek waqt mein ek page lautaate hue**

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query<{ id: number; title: string; created_at: Date }>(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`LIMIT\` database ko batata hai ki ek khaas tadaad ki rows lautaane ke baad ruk jaao (yahan, \`pageSize\`, ek fixed 20), aur \`OFFSET\` use batata hai ki nateeje lautaane shuru karne se pehle kitni milti rows chhodni hain — \`page=1\` 0 rows chhodta hai aur pehli 20 lautaata hai; \`page=2\` 20 rows chhodta hai aur agli 20 lautaata hai; aur waise hi aage. Chahe \`posts\` table mein 20 rows hon ya 20 lakh, ye version har akeli request ke liye ek seemit, anumaanit tadaad ki rows padhta aur lautaata hai — jawaab ka size aur query ka waqt ab data ki tadaad ke saath badhta nahi, jo asli fix hai: query ko kisi absolute matlab mein tez banaana nahi, balki ye simit karna ki koi bhi akeli request kitna kaam maang sakti hai, aur client ko explicitly aur pages sirf tab maangne dena jab unhe asal mein zarurat ho.`,

    content: `## Total counts and "has more pages": what the client still needs to know

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const [postsResult, countResult] = await Promise.all([
      pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2", [pageSize, offset]),
      pool.query("SELECT COUNT(*) FROM posts"),
    ]);
    const totalCount = Number(countResult.rows[0].count);

    res.json({
      posts: postsResult.rows,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (err) {
    next(err);
  }
});
\`\`\`

A frontend rendering page numbers or a "next page" button typically needs more than just the current page\'s rows — it needs to know the total number of matching rows (\`totalCount\`) and, derived from that, the total number of pages, so it can decide whether to show a "next" button at all or render a specific page-number control. Running a second \`SELECT COUNT(*)\` query alongside the paginated query (executed concurrently with \`Promise.all\`, following the same pattern for independent queries covered in this course\'s connection-pooling lesson) is the straightforward way to provide this — it costs one additional query per request, a reasonable trade for the client not needing to guess how many pages exist.

## OFFSET has its own performance cliff at very large offsets

\`\`\`sql
-- The database must still count past 999,980 skipped rows before returning anything
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 999980;
\`\`\`

\`LIMIT\`/\`OFFSET\` genuinely solves the original problem (an unbounded response), but it introduces a smaller, more specific one of its own: to fulfill a request for, say, page 50,000, the database generally still has to scan through and discard all 999,980 rows that come before the requested offset, even though none of those skipped rows are ever returned — the further into a large table a request pages, the more work the database does for that single page, even though the page size itself never changes. For a table that only ever has a few thousand rows, or an interface where users realistically never page past the first few screens, this is rarely a practical problem — but for a very large table with deep pagination (a user or a bot paging far into millions of rows), \`OFFSET\`-based pagination can become slow specifically at those large offsets, even though \`LIMIT\`/\`OFFSET\` fixed the original unbounded-response problem completely.

## Cursor-based pagination: the alternative for very large or deeply-paged tables

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const cursor = req.query.cursor; // an id or created_at value from the last item on the previous page
  const pageSize = 20;

  try {
    const result = cursor
      ? await pool.query(
          "SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2",
          [cursor, pageSize]
        )
      : await pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1", [pageSize]);

    const nextCursor = result.rows.length === pageSize
      ? result.rows[result.rows.length - 1].created_at
      : null;

    res.json({ posts: result.rows, nextCursor });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Rather than saying "skip N rows" (which requires the database to count past all of them), cursor-based pagination says "give me rows that come after THIS specific point" — using an indexed column\'s actual value (commonly \`created_at\`, or an auto-incrementing \`id\`) from the last row of the previous page as a \`WHERE\` condition, the database can jump directly to the correct starting point using an index, without needing to count or skip anything. This trades away the ability to jump directly to an arbitrary page number (page 50,000 specifically) for consistently fast performance regardless of how deep into the table a client pages — a trade-off well suited to interfaces like an infinite-scrolling feed, where "give me the next batch after what I already have" is a more natural fit than "give me page 50,000" in the first place.

## Always cap pageSize itself — a client-supplied limit is still user input

\`\`\`js
// WRONG — trusting a client-supplied page size with no upper bound
const pageSize = Number(req.query.pageSize) || 20;
// a request for ?pageSize=5000000 recreates the exact original unbounded-response problem

// RIGHT — a hard maximum, regardless of what the client requests
const requestedSize = Number(req.query.pageSize) || 20;
const pageSize = Math.min(requestedSize, 100);
\`\`\`

If a route allows the client to specify its own \`pageSize\` (reasonable, since different frontends may want different page sizes), that value is still ordinary user input and must be capped at a sensible maximum — without an upper bound, a client requesting an enormous \`pageSize\` recreates precisely the unbounded-response problem this lesson set out to fix in the first place, just via a different query parameter instead of no pagination at all.`,

    contentHi: `## Total counts aur "aur pages hain": client ko abhi bhi kya jaanna chahiye

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const [postsResult, countResult] = await Promise.all([
      pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2", [pageSize, offset]),
      pool.query("SELECT COUNT(*) FROM posts"),
    ]);
    const totalCount = Number(countResult.rows[0].count);

    res.json({
      posts: postsResult.rows,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek frontend jo page numbers ya ek "next page" button render karta hai aam taur par sirf abhi ke page ki rows se zyaada chahta hai — use milti rows ki kul tadaad (\`totalCount\`) jaanni chahiye, aur us se nikaali kul pages ki tadaad, taaki wo faisla kar sake ki "next" button dikhaana chahiye ya nahi ya ek khaas page-number control render kare. Paginated query ke saath ek doosri \`SELECT COUNT(*)\` query chalaana (\`Promise.all\` ke saath ek saath, is course ke connection-pooling lesson mein cover hue mustaqil queries wale pattern ka palan karte hue) ise dene ka saadha tarika hai — iski keemat har request ke liye ek additional query hai, ek uchit vinimay client ko ye guess na karna pade ki kitni pages maujood hain.

## \`OFFSET\` ka apna khud ka performance cliff bahut badi offsets par hai

\`\`\`sql
-- Database ko abhi bhi 999,980 chhodi gayi rows ke aage ginana chahiye kuch bhi lautaane se pehle
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 999980;
\`\`\`

\`LIMIT\`/\`OFFSET\` sach mein asli samasya solve karta hai (ek na-simit jawaab), par ye apna khud ka ek chhota, zyaada khaas samasya laata hai: page 50,000 jaisi ek request poori karne ke liye, database ko aam taur par abhi bhi wo saari 999,980 rows scan aur chhodni chahiye jo maangi gayi offset se pehle aati hain, chahe unmein se koi bhi chhodi hui row kabhi lautaayi nahi jaati — ek bade table mein ek request jitna aage page karti hai, database us akeli page ke liye utna hi zyaada kaam karta hai, chahe page size khud kabhi na badle. Ek table ke liye jismein kabhi bhi kuch hazaar rows hon, ya ek interface jahan users waastavik taur par kabhi pehle kuch screens se aage page nahi karte, ye shaayad hi ek practical samasya hai — par ek bahut bade table ke liye jismein gehri pagination ho (ek user ya ek bot lakhon rows mein bahut aage page karta hua), \`OFFSET\`-based pagination khaas taur par un badi offsets par dheema ho sakta hai, chahe \`LIMIT\`/\`OFFSET\` ne asli na-simit-jawaab samasya poori tarah theek kar diya ho.

## Cursor-based pagination: bahut bade ya gehre-page-hue tables ke liye vaikalpik

\`\`\`js
app.get("/posts", async (req, res, next) => {
  const cursor = req.query.cursor; // pichhle page ke aakhri item se ek id ya created_at value
  const pageSize = 20;

  try {
    const result = cursor
      ? await pool.query(
          "SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2",
          [cursor, pageSize]
        )
      : await pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1", [pageSize]);

    const nextCursor = result.rows.length === pageSize
      ? result.rows[result.rows.length - 1].created_at
      : null;

    res.json({ posts: result.rows, nextCursor });
  } catch (err) {
    next(err);
  }
});
\`\`\`

"N rows chhodo" kehne ke bajaye (jise database ko unn sabke aage ginana chahiye), cursor-based pagination kehta hai "mujhe wo rows do jo IS khaas point ke baad aati hain" — pichhle page ki aakhri row se ek indexed column ki asli value (aam taur par \`created_at\`, ya ek auto-incrementing \`id\`) ko ek \`WHERE\` condition ki tarah istemal karte hue, database seedha sahi shuruaati point tak jump kar sakta hai ek index istemal karke, kuch ginne ya chhodne ki zarurat bina. Ye ek manmaani page number (khaas taur par page 50,000) tak seedha jump karne ki kshamta ko chhodne ke badle mein hamesha tez performance deta hai chahe ek client table mein kitna bhi gehra page kare — ek trade-off jo un interfaces ke liye theek baithta hai jaise ek infinite-scrolling feed, jahan "mujhe wo agla batch do jo mere paas pehle se hai uske baad" pehli jagah "mujhe page 50,000 do" se zyaada swaabhavik fit hai.

## Hamesha \`pageSize\` khud ko cap karo — ek client-diya limit abhi bhi user input hai

\`\`\`js
// GALAT — bina kisi upar ki seemaa ke ek client-diye page size par bharosa karna
const pageSize = Number(req.query.pageSize) || 20;
// ek ?pageSize=5000000 wali request bilkul asli na-simit-jawaab samasya dobara paida karti hai

// SAHI — ek sakht maximum, client jo bhi maange uski parwaah kiye bina
const requestedSize = Number(req.query.pageSize) || 20;
const pageSize = Math.min(requestedSize, 100);
\`\`\`

Agar ek route client ko apna khud ka \`pageSize\` batane deta hai (uchit, kyunki alag-alag frontends ko alag-alag page sizes chahiye ho sakti hain), wo value abhi bhi aam user input hai aur ek samajhdaar maximum par cap honi chahiye — bina ek upar ki seemaa ke, ek client jo ek bahut badi \`pageSize\` maangta hai bilkul wahi na-simit-jawaab samasya dobara paida karta hai jise ye lesson pehli jagah theek karne nikla tha, bas bina-pagination-ke ke bajaye ek alag query parameter ke through.`,

    examples: [
      {
        title: 'Broken: no LIMIT at all — response size grows without bound',
        titleHi: 'Toota: bilkul koi \`LIMIT\` nahi — jawaab ka size bina seemaa ke badhta hai',
        code: `const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
res.json(result.rows);
// with 2 million rows, this reads, sorts, and serializes all of them for one request`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the problem is entirely
// about how much data a single request can demand, not a type error.`,
        output: `20 test posts: responds in a few milliseconds with a small array.
2 million real posts: a multi-megabyte response, a slow query, high
memory use on both server and client, and a real risk of a client
timing out or running out of memory.`,
        explain: 'The route is functionally correct at any scale — it genuinely returns every post, in the right order — but nothing bounds how much work a single request can trigger as the table grows.',
        explainHi: 'Route kisi bhi scale par functionally sahi hai — ye sach mein har post lautaata hai, sahi kram mein — par kuch bhi simit nahi karta ki table badhte hi ek akeli request kitna kaam trigger kar sakti hai.',
      },
      {
        title: 'Fixed: LIMIT/OFFSET returns one bounded page at a time',
        titleHi: 'Theek: \`LIMIT\`/\`OFFSET\` ek waqt mein ek seemit page lautaata hai',
        code: `const offset = (page - 1) * pageSize;
const result = await pool.query(
  "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
  [pageSize, offset]
);`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface PostRow {
  id: number;
  title: string;
  created_at: Date;
}

app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const result = await pool.query<PostRow>(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    res.json({ posts: result.rows, page, pageSize });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `20 posts or 2 million posts: every request now returns exactly up to
20 rows, and response size and query time no longer scale with total
table size — the client requests additional pages explicitly via
?page=2, ?page=3, and so on.`,
        outputTs: `// Identical behaviour. PostRow documents the exact shape of each
// returned row, consistent with the typing pattern from the earlier
// connection-pooling lesson.`,
        explain: 'The fix caps how much work any single request can demand, regardless of how large the underlying table grows — this is the actual mechanism, not a faster query in some absolute sense.',
        explainHi: 'Fix simit karta hai ki koi bhi akeli request kitna kaam maang sakti hai, underlying table chahe kitna bhi bada ho jaaye — yehi asli mechanism hai, koi absolute matlab mein tez query nahi.',
      },
      {
        title: 'Alternative: cursor-based pagination avoids OFFSET\'s deep-page slowdown',
        titleHi: 'Vaikalpik: cursor-based pagination \`OFFSET\` ki gehri-page dheemi rafttaar se bachta hai',
        code: `const result = cursor
  ? await pool.query("SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2", [cursor, pageSize])
  : await pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1", [pageSize]);`,
        codeJs: `app.get("/posts", async (req, res, next) => {
  const cursor = req.query.cursor;
  const pageSize = 20;

  try {
    const result = cursor
      ? await pool.query(
          "SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2",
          [cursor, pageSize]
        )
      : await pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1", [pageSize]);

    const nextCursor = result.rows.length === pageSize
      ? result.rows[result.rows.length - 1].created_at
      : null;

    res.json({ posts: result.rows, nextCursor });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface PostRow {
  id: number;
  title: string;
  created_at: Date;
}

app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cursor = req.query.cursor as string | undefined;
  const pageSize = 20;

  try {
    const result = cursor
      ? await pool.query<PostRow>(
          "SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2",
          [cursor, pageSize]
        )
      : await pool.query<PostRow>("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1", [pageSize]);

    const nextCursor = result.rows.length === pageSize
      ? result.rows[result.rows.length - 1].created_at
      : null;

    res.json({ posts: result.rows, nextCursor });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `Fetching deep into a very large table stays consistently fast, since
the database jumps directly to the cursor's position using an index
rather than counting and skipping every preceding row — at the cost of
not being able to jump to an arbitrary page number directly.`,
        outputTs: `// Identical behaviour. Well suited to an infinite-scrolling feed,
// where "the next batch after what I have" is the natural request
// shape rather than an arbitrary page number.`,
        explain: 'Using the last row\'s own indexed column value as the next request\'s starting point lets the database use an index to jump directly there, avoiding OFFSET\'s need to count past every skipped row.',
        explainHi: 'Agli request ka shuruaati point banaane ke liye aakhri row ki apni indexed column value istemal karna database ko ek index istemal karke seedha wahan jump karne deta hai, \`OFFSET\` ki har chhodi row ke aage ginne ki zarurat se bachte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
res.json(result.rows);
// no LIMIT at all — response size grows with the entire table`,
        right: `const result = await pool.query(
  "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
  [pageSize, offset]
);`,
        why: 'Without a LIMIT, a route\'s response size and query time grow directly with however much data happens to exist in the table, which works fine in development and becomes slow or unusable at real production scale.',
        whyHi: 'Bina ek \`LIMIT\` ke, ek route ka jawaab size aur query time seedhe taur par table mein jitna bhi data samyog se maujood hai us se badhta hai, jo development mein theek kaam karta hai aur asli production scale par dheema ya istemal-ke-laayak-nahi ban jaata hai.',
      },
      {
        wrong: `const pageSize = Number(req.query.pageSize) || 20;
// no upper bound — a client can request an arbitrarily large page`,
        right: `const requestedSize = Number(req.query.pageSize) || 20;
const pageSize = Math.min(requestedSize, 100);
// a hard maximum, regardless of what the client requests`,
        why: 'A client-supplied page size is still ordinary user input — without a hard maximum, a request for an enormous page size recreates the exact unbounded-response problem pagination was meant to fix.',
        whyHi: 'Ek client-diya page size abhi bhi aam user input hai — bina ek sakht maximum ke, ek bahut badi page size wali request bilkul wahi na-simit-jawaab samasya dobara paida karti hai jise pagination theek karne ke liye thi.',
      },
      {
        wrong: `// Deep pagination via OFFSET on a very large, frequently-paged table
"SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 999980"
// the database still scans past nearly a million skipped rows every time`,
        right: `// Cursor-based pagination for the same very large, deeply-paged table
"SELECT * FROM posts WHERE created_at < $1 ORDER BY created_at DESC LIMIT 20"
// jumps directly to the cursor's position using an index, no skipping required`,
        why: 'OFFSET requires the database to count past every skipped row even though none of them are returned, which becomes a real performance problem specifically at large offsets on large, frequently-paged tables.',
        whyHi: '\`OFFSET\` database ko har chhodi row ke aage ginne ki maang karta hai chahe unmein se koi bhi lautaayi na jaaye, jo khaas taur par bade, aksar-page-kiye jaate tables par badi offsets par ek asli performance samasya ban jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Essentially every major public API (GitHub, Stripe, Twitter/X, and virtually every other REST or GraphQL API serving lists of resources) implements pagination as a mandatory, non-optional part of any list endpoint** — an unpaginated "return everything" list endpoint is uncommon in serious production APIs specifically because of the exact scaling problem this lesson demonstrates.',
        hi: '**Lagbhag har mukhya saarvajanik API (GitHub, Stripe, Twitter/X, aur lagbhag har doosra REST ya GraphQL API jo resources ki lists deta hai) pagination ko kisi bhi list endpoint ke ek anivaarya, vaikalpik-nahi hisse ki tarah lagu karta hai** — ek na-paginated "sab kuch lautaao" list endpoint gambhir production APIs mein aam nahi hai khaas taur par is lesson mein dikhaayi bilkul isi scaling samasya ki wajah se.',
      },
      {
        en: '**Cursor-based pagination is the specific technique behind virtually every "infinite scroll" feed in real production applications** (social media timelines, chat message history, activity feeds) — it is not a niche or advanced-only technique, but the standard underlying implementation of one of the most common UI patterns in modern software.',
        hi: '**Cursor-based pagination asli production applications mein lagbhag har "infinite scroll" feed ke peeche ki khaas technique hai** (social media timelines, chat message history, activity feeds) — ye koi niche ya sirf-advanced technique nahi hai, balki modern software ke sabse aam UI patterns mein se ek ka standard underlying implementation hai.',
      },
      {
        en: '**Database query planners and monitoring tools commonly flag deep-OFFSET queries as a specific, recognizable performance anti-pattern** in production observability dashboards — this is a well-known, actively monitored-for issue in real systems, not a theoretical edge case.',
        hi: '**Database query planners aur monitoring tools aam taur par gehri-\`OFFSET\` queries ko ek khaas, pehchaanne-laayak performance anti-pattern ki tarah flag karte hain** production observability dashboards mein — ye asli systems mein ek achhi tarah jaana-pehchaana, actively monitor kiya jaane wala issue hai, koi theoretical edge case nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a route with no LIMIT clause work fine in development but become a serious problem in production, given that the query itself is not logically incorrect at any scale?',
        qHi: 'Ek route bina kisi \`LIMIT\` clause ke development mein theek kyun kaam karta hai par production mein ek gambhir samasya ban jaata hai, jab ki query khud kisi bhi scale par logically galat nahi hai?',
        a: 'The query is indeed logically correct at any scale — it genuinely, accurately returns every row in the table, in the requested order, whether that is 20 rows or 2 million. The problem is not correctness but resource cost, and that cost scales directly with however much data happens to exist: reading, sorting, and serializing 20 rows into JSON takes a trivial amount of time and memory, while doing the exact same operations for 2 million rows takes meaningfully longer, consumes far more memory on the server while the response is being built, produces a much larger response that takes longer to transmit over the network, and requires the client to receive, parse, and hold that entire large response in memory as well. In local development, seed data is typically small (a handful to a few hundred rows) specifically because it exists only to exercise the application\'s logic, not to represent realistic production volume — so the exact same code that works instantly in development can become slow, resource-intensive, or entirely impractical once the underlying table grows to genuine production scale, without a single line of the route\'s logic actually changing.',
        aHi: 'Query sach mein kisi bhi scale par logically sahi hai — ye sach mein, sahi tarike se table ki har row lautaata hai, maangi gayi tarteeb mein, chahe wo 20 rows hon ya 20 lakh. Samasya sahi-hone ki nahi hai balki resource keemat ki hai, aur wo keemat seedhe taur par utni hi badhti hai jitna data samyog se maujood hai: 20 rows ko padhna, sort karna, aur JSON mein serialize karna mamuli waqt aur memory leta hai, jabki 20 lakh rows ke liye bilkul wahi operations karne mein maayne-rakhta zyaada waqt lagta hai, jawaab banaate waqt server par kaafi zyaada memory istemal hoti hai, ek kaafi bada jawaab paida hota hai jise network par bhejne mein zyaada waqt lagta hai, aur client ko bhi wo poora bada jawaab paana, parse karna, aur memory mein rakhna chahiye. Local development mein, seed data aam taur par chhota hota hai (mutthi bhar se kuch sau rows) khaas taur par isliye kyunki ye sirf application ki logic exercise karne ke liye maujood hai, waastavik production volume represent karne ke liye nahi — isliye bilkul wahi code jo development mein turant kaam karta hai dheema, resource-intensive, ya poori tarah gair-vyavhaarik ban sakta hai ek baar underlying table asli production scale tak badh jaaye, route ki logic ki ek bhi line asal mein badle bina.',
      },
      {
        q: 'How do LIMIT and OFFSET work together to implement page-based pagination, and why does OFFSET specifically become slower at large values even though LIMIT stays constant?',
        qHi: '\`LIMIT\` aur \`OFFSET\` saath mein page-based pagination lagu karne ke liye kaise kaam karte hain, aur \`OFFSET\` khaas taur par bade values par dheema kyun ban jaata hai chahe \`LIMIT\` constant rahe?',
        a: 'LIMIT tells the database the maximum number of rows to include in the result, and OFFSET tells it how many matching rows, starting from the beginning of the (typically ordered) result set, to skip before it starts actually returning rows — combining a fixed LIMIT (say, 20) with a growing OFFSET (0, then 20, then 40, and so on) implements page-based navigation, since each successive value of OFFSET starts the returned window further into the overall result set. The performance issue specifically with OFFSET is that, in the general case, the database cannot simply jump directly to row number OFFSET+1 in the underlying storage — it typically has to actually process (read and, in the presence of an ORDER BY, sort) all of the rows up through the offset, discard them, and only then start collecting the LIMIT rows to actually return. This means that while LIMIT bounds how many rows are ultimately returned to the client (keeping the response size itself constant regardless of which page is requested), OFFSET does not bound how much internal work the database does to reach that page — a request for a page deep into a large table (a large OFFSET value) requires processing a proportionally large number of rows internally, even though the final returned page is exactly the same size as page one\'s.',
        aHi: '\`LIMIT\` database ko batata hai nateeje mein shaamil karne ke liye rows ki adhiktam tadaad, aur \`OFFSET\` use batata hai ki (aam taur par ordered) result set ki shuruaat se, kitni milti rows chhodni hain asal mein rows lautaana shuru karne se pehle — ek fixed \`LIMIT\` (maano, 20) ko ek badhti \`OFFSET\` (0, phir 20, phir 40, aur waise hi aage) ke saath jodna page-based navigation lagu karta hai, kyunki \`OFFSET\` ki har lagaataar value lautaayi hui window ko poore result set mein aur aage shuru karti hai. \`OFFSET\` ke saath khaas performance issue ye hai ki, aam case mein, database seedha underlying storage mein row number \`OFFSET+1\` par jump nahi kar sakta — use aam taur par asal mein process karna chahiye (padhna aur, \`ORDER BY\` ki maujoodgi mein, sort karna) offset tak ki sab rows ko, unhe chhodna, aur sirf tab asal mein lautaane ke liye \`LIMIT\` rows ikattha karna shuru karna. Iska matlab hai jabki \`LIMIT\` ye simit karta hai ki client ko aakhirkaar kitni rows lautaayi jaati hain (jawaab ka size khud kaunsa page maanga gaya us se bekhabar constant rakhte hue), \`OFFSET\` ye simit nahi karta ki us page tak pahunchne ke liye database andar hi andar kitna kaam karta hai — ek bade table mein gehri ek page ki request (ek badi \`OFFSET\` value) ko andar hi andar anupaat mein badi tadaad ki rows process karni chahiye, chahe aakhri lautaayi gayi page bilkul pehle page ke jaisi hi size ki ho.',
      },
      {
        q: 'What is the core trade-off between OFFSET-based pagination and cursor-based pagination, and what kind of interface is cursor-based pagination especially well suited to?',
        qHi: '\`OFFSET\`-based pagination aur cursor-based pagination ke beech mool trade-off kya hai, aur cursor-based pagination khaas taur par kis kism ke interface ke liye theek baithta hai?',
        a: 'OFFSET-based pagination\'s key strength is that it lets a client jump directly to any arbitrary page number (page 1, page 50, page 50,000) simply by specifying that page\'s corresponding offset, which maps naturally onto a traditional numbered-page interface (1, 2, 3 ... with a way to jump to a specific page). Its weakness, covered earlier in this lesson, is that reaching a large offset requires the database to process a proportionally large number of skipped rows first, making deep pages progressively slower on a large table. Cursor-based pagination gives up the ability to jump directly to an arbitrary page number — there is no way to ask for "page 50,000" directly, only "the next batch after this specific point" — but in exchange, it remains consistently fast no matter how deep into the underlying table a client has already paged, since it uses an indexed column\'s value to jump directly to the correct starting point rather than counting through everything before it. This trade-off maps very naturally onto an infinite-scrolling interface (a social feed, a chat history, an activity log) where users never actually think in terms of page numbers at all — they simply keep scrolling and expect "the next batch of items after what I\'m currently looking at," which is exactly the request shape cursor-based pagination is built around, while a traditional interface with explicit, clickable page numbers is better served by OFFSET-based pagination\'s ability to jump anywhere directly.',
        aHi: '\`OFFSET\`-based pagination ki mukhya taakat ye hai ki ye ek client ko seedha kisi bhi manmaani page number (page 1, page 50, page 50,000) tak jump karne deta hai bas us page ki milti offset batakar, jo ek traditional numbered-page interface (1, 2, 3 ... ek khaas page tak jump karne ke tarike ke saath) par swaabhavik taur par fit baithta hai. Iski kamzori, jo is lesson mein pehle cover hui, ye hai ki ek badi offset tak pahunchne ke liye database ko pehle anupaat mein badi tadaad ki chhodi gayi rows process karni chahiye, ek bade table par gehri pages ko dheere-dheere dheema banaate hue. Cursor-based pagination seedha kisi manmaani page number tak jump karne ki kshamta chhod deta hai — "page 50,000" ke liye seedha poochhne ka koi tarika nahi hai, sirf "is khaas point ke baad agla batch" — par badle mein, ye hamesha tez rehta hai chahe ek client underlying table mein pehle se kitna bhi gehra page kar chuka ho, kyunki ye ek indexed column ki value ka istemal karta hai seedha sahi shuruaati point tak jump karne ke liye us se pehle sab kuch ginne ke bajaye. Ye trade-off ek infinite-scrolling interface (ek social feed, ek chat history, ek activity log) par bahut swaabhavik taur par fit baithta hai jahan users asal mein page numbers ke hisaab se soch te hi nahi — wo bas scroll karte rehte hain aur ummeed karte hain "abhi jo dekh rahe hain uske baad items ka agla batch," jo bilkul wo request shape hai jiske aas-paas cursor-based pagination banaaya gaya hai, jabki ek traditional interface jismein explicit, click-karne-laayak page numbers hon \`OFFSET\`-based pagination ki kahin bhi seedha jump karne ki kshamta se behtar service paata hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /posts route with no LIMIT at all. Seed 5,000 test posts and measure the response time and response size directly, comparing against the same route with only 20 seeded posts.',
        taskHi: 'Bilkul koi \`LIMIT\` na hone wala toota \`/posts\` route banao. 5,000 test posts seed karo aur response time aur response size seedha naapo, sirf 20 seeded posts wale bilkul wahi route se compare karte hue.',
        hint: 'console.time / console.timeEnd around the query, and checking the response body\'s byte length (via a tool like curl -w "%{size_download}"), gives a concrete before/after comparison.',
        hintHi: 'Query ke aas-paas \`console.time\` / \`console.timeEnd\`, aur response body ki byte length check karna (jaise \`curl -w "%{size_download}"\` jaise ek tool se), ek thos pehle/baad ka comparison deta hai.',
      },
      {
        task: 'Fix it with LIMIT/OFFSET-based pagination, including totalCount and totalPages in the response. Confirm requesting ?page=2 and ?page=3 correctly returns different, non-overlapping rows.',
        taskHi: '\`LIMIT\`/\`OFFSET\`-based pagination se theek karo, response mein \`totalCount\` aur \`totalPages\` shaamil karte hue. Confirm karo \`?page=2\` aur \`?page=3\` maangna sahi tarike se alag, na-overlap-hoti rows lautaata hai.',
        hint: 'Also try requesting a page number far beyond the actual data (like ?page=9999) and confirm the route correctly returns an empty array rather than erroring.',
        hintHi: 'Asli data se kaafi aage ek page number (jaise \`?page=9999\`) maangne ki bhi koshish karo aur confirm karo route sahi tarike se ek khaali array lautaata hai error dene ke bajaye.',
      },
      {
        task: 'Implement the cursor-based alternative on the same seeded data. Compare query execution time for a "deep" OFFSET-based page (e.g. offset 4900 out of 5000) against the equivalent cursor-based request.',
        taskHi: 'Wahi seeded data par cursor-based vaikalpik lagu karo. Ek "gehri" \`OFFSET\`-based page (jaise 5000 mein se offset 4900) ke liye query execution time compare karo barabar cursor-based request se.',
        hint: 'For a meaningful comparison, seed enough rows (tens of thousands) that the deep-OFFSET slowdown becomes measurable rather than negligible.',
        hintHi: 'Ek maayne-rakhta comparison ke liye, itni rows seed karo (dason hazaar) ki gehri-\`OFFSET\` dheemi rafttaar naapi jaa sake, mamuli na ho.',
      },
    ],

    keyTakeaways: [
      'A route returning an entire table with no LIMIT works fine with small test data but its response size and query time grow directly with however much data actually exists in production.',
      'LIMIT bounds how many rows a single request returns; OFFSET tells the database how many matching rows to skip before returning results — together they implement page-based navigation.',
      'A total count (via a second, concurrently-run COUNT(*) query) is typically needed alongside the paginated rows so a client can render page numbers or a correct "has more" indicator.',
      'OFFSET has its own performance cliff: the database must generally process past every skipped row to reach a given offset, making very deep pages progressively slower on large tables.',
      'Cursor-based pagination (using an indexed column\'s value from the last row as the next request\'s starting point) avoids OFFSET\'s deep-page slowdown, at the cost of not supporting jumping directly to an arbitrary page number.',
      'A client-supplied pageSize is still ordinary user input and must be capped at a sensible maximum, or a request for an enormous page size recreates the exact unbounded-response problem pagination exists to solve.',
    ],
    keyTakeawaysHi: [
      'Bilkul koi \`LIMIT\` na hone wala ek route jo poora table lautaata hai chhote test data ke saath theek kaam karta hai par uska response size aur query time seedhe taur par utna hi badhta hai jitna production mein asal mein data maujood hai.',
      '\`LIMIT\` simit karta hai ki ek akeli request kitni rows lautaati hai; \`OFFSET\` database ko batata hai ki nateeje lautaane se pehle kitni milti rows chhodni hain — saath mein wo page-based navigation lagu karte hain.',
      'Ek total count (ek doosri, saath-hi-saath chalti \`COUNT(*)\` query se) aam taur par paginated rows ke saath zaruri hai taaki ek client page numbers ya ek sahi "aur hain" indicator render kar sake.',
      '\`OFFSET\` ka apna khud ka performance cliff hai: database ko aam taur par ek di gayi offset tak pahunchne ke liye har chhodi gayi row ke aage process karna chahiye, bade tables par bahut gehri pages ko dheere-dheere dheema banaate hue.',
      'Cursor-based pagination (aakhri row se ek indexed column ki value ko agli request ke shuruaati point ki tarah istemal karte hue) \`OFFSET\` ki gehri-page dheemi rafttaar se bachta hai, ek manmaani page number tak seedha jump support na karne ki keemat par.',
      'Ek client-diya \`pageSize\` abhi bhi aam user input hai aur ek samajhdaar maximum par cap hona chahiye, warna ek bahut badi page size wali request bilkul wahi na-simit-jawaab samasya dobara paida karti hai jise pagination solve karne ke liye maujood hai.',
    ],
  },
];
