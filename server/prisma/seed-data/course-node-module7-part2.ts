/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 2.
 *
 * Caching with Redis: why recomputing the exact same expensive result (a
 * heavy aggregate query) on every single request wastes database capacity
 * that a shared, unchanging answer never needed to consume more than once.
 * Broken example: a "trending products" route running a genuinely
 * expensive aggregate query from scratch on every request, even though the
 * underlying data barely changes minute to minute — thousands of identical
 * requests per minute each independently re-run the same costly query.
 * Fixed with the cache-aside pattern: check Redis first, compute and store
 * with a TTL on a miss, serve directly from Redis on a hit. Also covers why
 * a TTL is mandatory (never-expiring cache = permanently stale data), cache
 * invalidation on write, the stale-vs-unavailable trade-off, and what
 * should never be cached (per-user sensitive data).
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

export const NODE_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'caching-with-redis',
    title: 'Caching with Redis: Not Recomputing the Same Answer Every Time',
    titleHi: 'Redis Se Caching: Wahi Jawaab Baar-Baar Dobara Calculate Na Karna',
    description: 'A "trending products" page recalculates the exact same expensive ranking from scratch for every single visitor — 10,000 times a minute, even though the actual ranking only changes once every few minutes.',
    descriptionHi: 'Ek "trending products" page bilkul wahi mehenga ranking har akele visitor ke liye shuru se dobara calculate karta hai — ek minute mein 10,000 baar, chahe asli ranking sirf kuch minuton mein ek baar badalti ho.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A newsstand that, every single time a customer asks "what\'s today\'s headline?", sends a fresh reporter racing across the city to re-investigate and re-write the entire front page from scratch — versus one that prints the front page once each morning and simply hands a copy to whoever asks.** Recomputing an expensive result from scratch on every request is like a newsstand owner who treats every customer\'s question as if it had never been asked before — a customer walks up, asks what today\'s big story is, and instead of handing over a paper, the owner dispatches a reporter to fully re-investigate and re-write that same story, from the very beginning, taking real time and effort, before finally answering. The story has not changed since the last customer asked five minutes ago, and will not change until this evening\'s news cycle — but the owner has no way of reusing yesterday\'s, or even five-minutes-ago\'s, answer, because nothing about the shop keeps any memory of a story once told. With one customer an hour, this is wasteful but survivable; with a thousand customers an hour, every single one demanding a full re-investigation of an answer that has not changed since the last person asked, the "reporter" is overwhelmed and every customer waits far longer than necessary for information that was already fully known. A newsstand run correctly instead has the reporter investigate and write the story ONCE, prints copies, and simply hands a copy to anyone who asks — re-investigating only when enough time has genuinely passed that the story might actually have changed, or when a genuinely new development means the old story is now known to be out of date.',
      hi: '**Ek newsstand jo, har akeli baar jab ek customer poochhta hai "aaj ki headline kya hai?", ek taaza reporter ko poore shahar mein daudte hue bhejta hai poore front page ko shuru se dobara-investigate aur dobara-likhne ke liye — versus ek jo har subah ek baar front page print karta hai aur bas jo bhi poochhe use ek copy thama deta hai.** Ek mehenga nateeja har request par shuru se dobara calculate karna ek aise newsstand malik jaisa hai jo har customer ke sawaal ko aise treat karta hai jaise ye kabhi pehle poocha hi nahi gaya — ek customer aata hai, poochta hai aaj ki badi khabar kya hai, aur ek paper thamaane ke bajaye, malik ek reporter ko wahi kahaani poori tarah dobara-investigate aur dobara-likhne ke liye bhejta hai, bilkul shuru se, asli waqt aur mehnat lete hue, aakhirkaar jawaab dene se pehle. Kahaani pichhle customer ke paanch minute pehle poochne ke baad se nahi badli, aur aaj shaam ki news cycle tak nahi badlegi — par malik ke paas kal ki, ya paanch-minute-pehle ki bhi, jawaab dobara istemal karne ka koi tarika nahi hai, kyunki shop ke baare mein kuch bhi ek baar bataayi gayi kahaani ki koi yaad nahi rakhta. Ek ghante mein ek customer ke saath, ye faaltu hai par jhela ja sakta hai; ek ghante mein ek hazaar customers ke saath, har akela ek jawaab ki poori dobara-investigation maang raha hai jo pichhle insaan ke poochne ke baad se badla hi nahi, "reporter" overwhelmed ho jaata hai aur har customer us jaankaari ke liye zarurat se kaafi zyaada intezaar karta hai jo pehle se poori tarah jaani-pehchaani thi. Ek sahi tarike se chalaaya newsstand iske bajaye reporter se kahaani ek BAAR investigate aur likhwaata hai, copies print karta hai, aur bas jo bhi poochhe use ek copy thama deta hai — dobara-investigate sirf tab karte hue jab sach mein itna waqt guzar chuka ho ki kahaani asal mein badal sakti hai, ya jab ek sach mein nayi baat ka matlab hai purani kahaani ab purani ho chuki jaani jaati hai.',
    },

    simple: `**Start broken.** A "trending products" route that recomputes an expensive aggregate ranking from scratch on every single request:

\`\`\`js
app.get("/trending", async (req, res, next) => {
  try {
    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

This query is genuinely expensive — joining, filtering, grouping, and sorting across potentially millions of order rows from the last 24 hours — and it produces the exact same result for every single visitor, since "today\'s trending products" is a shared, global answer, not something specific to any one user. With modest traffic, this route responds correctly, if a little slowly. With real traffic — 10,000 visitors hitting the homepage in a single minute, each one triggering this same expensive query independently — the database now performs this identical, costly computation 10,000 times over, for a result that was already fully known after the very first request and does not actually change again until enough new orders accumulate, typically minutes later. Every one of those 9,999 additional queries is pure waste: real database CPU and I/O spent recomputing an answer that a single earlier request had already correctly computed, competing with every other query (including this course\'s earlier connection-pooling lesson\'s concerns) for the same limited pool of database connections.

**The fix: cache-aside — check Redis first, compute and store only on a miss**

\`\`\`js
const redis = require("redis");
const client = redis.createClient();

app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows)); // cache for 5 minutes
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { createClient } from "redis";
const client = createClient();

interface TrendingProduct {
  id: number;
  name: string;
  order_count: number;
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      res.json(JSON.parse(cached) as TrendingProduct[]);
      return;
    }

    const result = await pool.query<TrendingProduct>(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

This pattern, called "cache-aside" (the application itself manages the cache, sitting logically alongside the database), checks Redis first for a previously computed answer under a specific key (\`"trending-products"\`) — if found (a "cache hit"), it is returned immediately, with the database never touched at all for that request. Only on a "cache miss" (nothing cached yet, or a previous entry has expired) does the route fall back to running the actual expensive query, and critically, it then STORES that freshly computed result back into Redis via \`setEx\` before responding, with an explicit expiration (\`300\` seconds, five minutes) — so that the very next request, whether it arrives one second or four minutes later, finds a cache hit instead of needing to recompute anything at all. Under the same 10,000-visitors-in-a-minute load, the expensive query now runs roughly once every five minutes (whenever the cache entry expires and needs refreshing), rather than 10,000 times — the other 9,999+ requests are served directly from Redis, an in-memory store built specifically to answer this kind of key-based lookup extremely fast, at a fraction of the cost of re-running the original query.`,

    simpleHi: `**Toote hue se shuru.** Ek "trending products" route jo har akeli request par ek mehenga aggregate ranking shuru se dobara calculate karta hai:

\`\`\`js
app.get("/trending", async (req, res, next) => {
  try {
    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye query sach mein mehengi hai — pichhle 24 ghanton se mumkin taur par lakhon order rows ke aar-paar joining, filtering, grouping, aur sorting — aur ye har akele visitor ke liye bilkul wahi nateeja paida karta hai, kyunki "aaj ke trending products" ek shared, global jawaab hai, kisi ek user ke liye khaas kuch nahi. Halke traffic ke saath, ye route sahi tarike se jawaab deta hai, chahe thoda dheema. Asli traffic ke saath — 10,000 visitors ek minute mein homepage hit karte hue, har ek is wahi mehengi query mustaqil taur par trigger karta hua — database ab is identical, mehengi computation ko 10,000 baar karta hai, ek aise nateeje ke liye jo pehli hi request ke baad poori tarah jaana ja chuka tha aur asal mein tab tak dobara nahi badalta jab tak kaafi naye orders jama na hon, aam taur par minutes baad. In 9,999 additional queries mein se har ek pure taur par faaltu hai: asli database CPU aur I/O ek aise jawaab ko dobara calculate karne mein kharch hoti hai jise ek pehle wali request pehle se sahi tarike se calculate kar chuki thi, har doosri query se muqaabla karte hue (is course ke pehle wale connection-pooling lesson ki chintaayen sameet) database connections ke usi seemit pool ke liye.

**Fix: cache-aside — pehle Redis check karo, sirf miss par calculate aur store karo**

\`\`\`js
const redis = require("redis");
const client = redis.createClient();

app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows)); // 5 minute ke liye cache karo
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { createClient } from "redis";
const client = createClient();

interface TrendingProduct {
  id: number;
  name: string;
  order_count: number;
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      res.json(JSON.parse(cached) as TrendingProduct[]);
      return;
    }

    const result = await pool.query<TrendingProduct>(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye pattern, jise "cache-aside" kehte hain (application khud cache manage karta hai, database ke saath-saath logically), Redis ko pehle check karta hai ek khaas key (\`"trending-products"\`) ke neeche pehle calculate kiye gaye jawaab ke liye — agar mile (ek "cache hit"), ise turant lautaaya jaata hai, us request ke liye database ko bilkul chhue bina. Sirf ek "cache miss" par (abhi tak kuch cache nahi hua, ya ek pichhli entry expire ho chuki hai) route asli mehengi query chalaane par wapas jaata hai, aur bahut zaruri, ye phir us taaza calculate hue nateeje ko wapas Redis mein STORE karta hai \`setEx\` ke through jawaab dene se pehle, ek explicit expiration ke saath (\`300\` seconds, paanch minute) — taaki agli hi request, chahe wo ek second baad aaye ya chaar minute baad, kuch bhi dobara calculate karne ki zarurat ke bajaye ek cache hit paaye. Usi 10,000-visitors-ek-minute-mein load ke neeche, mehengi query ab lagbhag har paanch minute mein ek baar chalti hai (jab bhi cache entry expire hoti hai aur refresh chahiye), 10,000 baar ke bajaye — baaki 9,999+ requests seedha Redis se serve hoti hain, ek in-memory store jo khaas taur par is kism ki key-based lookup ka jawaab bahut tez dene ke liye bana hai, asli query dobara chalaane ki keemat ke ek chhote hisse par.`,

    content: `## TTL is mandatory, not optional: a cache with no expiration is permanently stale data

\`\`\`js
// WRONG — cached forever, with no way to ever pick up new data
await client.set("trending-products", JSON.stringify(result.rows));

// RIGHT — expires automatically, guaranteeing the data is never more than 5 minutes old
await client.setEx("trending-products", 300, JSON.stringify(result.rows));
\`\`\`

Storing a value in Redis with no expiration at all (a plain \`set\` instead of \`setEx\`) means that value remains cached FOREVER, regardless of how much the real, underlying data changes afterward — every subsequent request would keep receiving that same original snapshot, permanently, unless something else explicitly deletes or overwrites it. A TTL (Time To Live), the \`300\` (seconds) in \`setEx\`, is what makes a cache genuinely usable for data that changes over time rather than a one-time, permanently frozen answer: it tells Redis to automatically discard the cached value once that much time has passed, guaranteeing the cached data is never more than \`TTL\` seconds out of date, and that the next request after expiration will trigger a fresh recomputation. Choosing an appropriate TTL is a genuine, deliberate trade-off — a longer TTL means fewer expensive recomputations but a longer window during which cached data can be stale; a shorter TTL keeps data fresher at the cost of recomputing more often — and the right value depends entirely on how quickly the underlying data actually changes and how tolerant the specific feature is of slightly-out-of-date information.

## Cache invalidation on write: keeping the cache honest when data actually changes

\`\`\`js
app.post("/products/:id/restock", async (req, res, next) => {
  try {
    await pool.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [req.body.quantity, req.params.id]);
    await client.del("trending-products"); // the cached ranking may now be stale — remove it
    res.json({ message: "Restocked" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

A TTL alone handles data that changes gradually over time, but some writes should invalidate a cached value immediately rather than waiting for a TTL to naturally expire — if an operation genuinely changes data a cached value depends on, explicitly deleting (\`client.del\`) that cache entry as part of the same write ensures the next read is forced to recompute a fresh answer, rather than continuing to serve a now-provably-outdated cached value until its TTL happens to run out. Correctly identifying every place that should trigger this invalidation is a genuinely well-known, tricky discipline in real systems — it is often said, only half-jokingly, that cache invalidation is one of the hardest problems in computer science, specifically because it is easy to miss one particular write path that should invalidate a cache entry but does not, leaving a subtly stale value being served without anyone immediately noticing.

## The stale-vs-unavailable trade-off: what a cached response actually promises

\`\`\`
A cached "trending products" response, up to 5 minutes old, being slightly
behind the absolute latest order data is a genuinely acceptable trade-off
for this specific feature — nobody is harmed by seeing yesterday's #7
trending item for a few extra minutes.

A cached ACCOUNT BALANCE being even a few seconds stale could show a user
an incorrect number after a transaction they just made — an entirely
different tolerance for staleness, for a genuinely different kind of data.
\`\`\`

Caching is not a universal, context-free technique to apply to every route — it is fundamentally a decision to accept a small amount of staleness (data that may be slightly out of date) in exchange for a large reduction in load, and whether that trade-off is acceptable depends entirely on what the specific data actually represents. A shared, slowly changing, non-critical ranking like "trending products" tolerates being a few minutes stale with no real consequence to anyone. Data where staleness has a genuine, immediate cost to a specific user — an account balance immediately after a transaction, a payment\'s current status, whether a critical resource is still available in the exact instant a decision is being made — needs to be reasoned about far more carefully, often either avoiding caching entirely for that specific piece of data, or using a much shorter TTL combined with careful, deliberate invalidation.

## What should never be cached this way: per-request, per-user sensitive data

\`\`\`js
// WRONG — caching one user's private profile data under a key any request could theoretically hit
await client.setEx("user-profile", 300, JSON.stringify(userProfile));

// RIGHT — the cache key itself must be scoped to the specific user
await client.setEx(\`user-profile:\${userId}\`, 300, JSON.stringify(userProfile));
\`\`\`

The "trending products" example in this lesson is intentionally a shared, global answer — the exact same response is correct for every single visitor, which is precisely what makes it safe and effective to cache under one single, shared key. Caching genuinely per-user or otherwise sensitive data requires the cache KEY itself to correctly scope each cached value to the specific request or user it belongs to (\`user-profile:42\`, not a single shared \`user-profile\` key) — using a single shared cache key for data that should differ per user is a serious bug (and potentially a serious privacy/security issue) that would serve one user\'s private data back to a completely different user who happens to request the same route next.`,

    contentHi: `## TTL anivaarya hai, vaikalpik nahi: bina expiration wala cache hamesha ke liye purana data hai

\`\`\`js
// GALAT — hamesha ke liye cache hua, naya data kabhi paane ka koi tarika nahi
await client.set("trending-products", JSON.stringify(result.rows));

// SAHI — apne aap expire hota hai, guarantee karta hai data kabhi 5 minute se zyaada purana nahi
await client.setEx("trending-products", 300, JSON.stringify(result.rows));
\`\`\`

Redis mein ek value ko bilkul koi expiration ke bina store karna (\`setEx\` ke bajaye ek saadha \`set\`) matlab hai wo value HAMESHA KE LIYE cached rehti hai, baad mein asli, underlying data chahe kitna bhi badle — har baad wali request wahi asli snapshot paati rahegi, hamesha ke liye, jab tak koi doosri cheez use explicitly delete ya overwrite na kare. Ek TTL (Time To Live), \`setEx\` mein \`300\` (seconds), wo hai jo ek cache ko waqt ke saath badalte data ke liye sach mein istemal-ke-laayak banaata hai ek-baar ki, hamesha ke liye frozen jawaab ke bajaye: ye Redis ko batata hai ki cached value ko apne aap hataa de itna waqt guzarne ke baad, guarantee karte hue ki cached data kabhi \`TTL\` seconds se zyaada purana nahi, aur expiration ke baad agli request ek taaza recomputation trigger karegi. Ek uchit TTL chunna ek asli, jaan-boojhkar trade-off hai — ek lamba TTL matlab kam mehengi recomputations par ek lambi window jismein cached data purana ho sakta hai; ek chhota TTL data ko zyaada taaza rakhta hai zyaada baar recompute karne ki keemat par — aur sahi value poori tarah is baat par nirbhar karti hai ki underlying data asal mein kitni jaldi badalta hai aur khaas feature thodi-purani jaankaari ke liye kitna sehansheel hai.

## Write par cache invalidation: jab data asal mein badle to cache ko imaandaar rakhna

\`\`\`js
app.post("/products/:id/restock", async (req, res, next) => {
  try {
    await pool.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [req.body.quantity, req.params.id]);
    await client.del("trending-products"); // cached ranking ab purani ho sakti hai — hataao
    res.json({ message: "Restocked" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Akela TTL data ko sambhaalta hai jo waqt ke saath dheere-dheere badalta hai, par kuch writes ko turant ek cached value invalidate kar dena chahiye ek TTL ke naisargik taur par expire hone ka intezaar karne ke bajaye — agar ek operation asal mein wo data badalta hai jis par ek cached value nirbhar karta hai, us cache entry ko wahi write ke hisse ki tarah explicitly delete karna (\`client.del\`) sunishchit karta hai agli padhaai ko ek taaza jawaab recompute karne ke liye majboor kiya jaaye, ab-saabit-hui-purani cached value ko us waqt tak serve karte rehne ke bajaye jab tak uska TTL samyog se khatam na ho. Har jagah sahi tarike se pehchaanna jise ye invalidation trigger karna chahiye asli systems mein ek sach mein jaana-pehchaana, tricky anushasan hai — aksar aadha-mazaak mein kaha jaata hai ki cache invalidation computer science ki sabse mushkil samasyaon mein se ek hai, khaas taur par isliye kyunki ek khaas write path chhoot jaana aasaan hai jise ek cache entry invalidate karni chahiye thi par nahi karti, ek subtly purani value serve hoti chhodte hue bina kisi ke turant notice kiye.

## Purana-vs-upalabdh-na-hona trade-off: ek cached response asal mein kya wada karta hai

\`\`\`
Ek cached "trending products" jawaab, 5 minute tak purana, bilkul asli
naye order data se thoda peeche hona is khaas feature ke liye ek sach mein
swikaarya trade-off hai — kisi ko bhi nuksaan nahi hota kal ka #7 trending
item kuch aur minuton ke liye dekhne se.

Ek cached ACCOUNT BALANCE kuch seconds bhi purana hona ek user ko unki abhi
ki gayi ek transaction ke baad ek galat number dikha sakta hai — purane-hone
ke liye poori tarah alag sehanshakti, poori tarah alag kism ke data ke liye.
\`\`\`

Caching koi saarvavyaapi, sandarbh-mukt technique nahi hai jo har route par lagu ki jaaye — ye buniyaadi taur par thoda sa purana-pan (data jo thoda purana ho sakta hai) swikaar karne ka ek faisla hai load mein ek badi kami ke badle mein, aur kya wo trade-off swikaarya hai poori tarah is baat par nirbhar karta hai ki khaas data asal mein kya darzhaata hai. "Trending products" jaisi ek shared, dheere-badalti, ghair-mahatvapoorna ranking kuch minuton purani hone ko kisi ke liye koi asli nateeje bina sehan karti hai. Data jahan purana-pan ek khaas user ke liye ek asli, turant keemat rakhta hai — ek transaction ke turant baad ek account balance, ek payment ka abhi ka status, kya ek zaruri resource bilkul us pal upalabdh hai jab ek faisla liya jaa raha hai — bahut zyaada dhyaan se soch-samjhi jaani chahiye, aksar us khaas data ke liye ya to caching poori tarah avoid karte hue, ya ek kaafi chhoti TTL ka istemal karte hue dhyaan se, jaan-boojhkar invalidation ke saath.

## Is tarike se kya kabhi cache nahi hona chahiye: per-request, per-user sensitive data

\`\`\`js
// GALAT — ek user ka private profile data ek key ke neeche cache karna jo koi bhi request theoretically hit kar sakti hai
await client.setEx("user-profile", 300, JSON.stringify(userProfile));

// SAHI — cache key khud us khaas user ke liye scoped hona chahiye
await client.setEx(\`user-profile:\${userId}\`, 300, JSON.stringify(userProfile));
\`\`\`

Is lesson ka "trending products" example jaan-boojhkar ek shared, global jawaab hai — bilkul wahi jawaab har akele visitor ke liye sahi hai, jo bilkul wahi hai jo ise ek akeli, shared key ke neeche cache karna surakshit aur asarkaari banaata hai. Sach mein per-user ya doosri sensitive data cache karne ke liye cache KEY khud ko sahi tarike se har cached value ko us khaas request ya user ke liye scope karna chahiye jise ye belong karta hai (\`user-profile:42\`, ek akeli shared \`user-profile\` key nahi) — us data ke liye ek akeli shared cache key istemal karna jo har user ke liye alag hona chahiye ek gambhir bug hai (aur mumkin taur par ek gambhir privacy/security issue) jo ek user ka private data ek poori tarah alag user ko wapas serve karega jo samyog se agli baar wahi route maangta hai.`,

    examples: [
      {
        title: 'Broken: an expensive query recomputed on every single request',
        titleHi: 'Toota: ek mehengi query har akeli request par dobara calculate hui',
        code: `app.get("/trending", async (req, res, next) => {
  const result = await pool.query(expensiveAggregateQuery);
  res.json(result.rows);
});
// 10,000 requests per minute = 10,000 identical, expensive recomputations`,
        codeJs: `app.get("/trending", async (req, res, next) => {
  try {
    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the waste is entirely
// about redundant computation, not a type or logic error.`,
        output: `Modest traffic: responds correctly, if a little slowly. 10,000
visitors in one minute: the database performs this same expensive
join/group/sort 10,000 times for a result that was already fully known
after the first request.`,
        explain: 'The query produces an identical result for every visitor, since "today\'s trending products" is a shared, global answer — recomputing it per-request is pure, avoidable waste.',
        explainHi: 'Query har visitor ke liye ek identical nateeja paida karta hai, kyunki "aaj ke trending products" ek shared, global jawaab hai — ise prati-request dobara calculate karna pure, bach-sakne-laayak faaltu hai.',
      },
      {
        title: 'Fixed: cache-aside with Redis, computed once every 5 minutes',
        titleHi: 'Theek: Redis ke saath cache-aside, har 5 minute mein ek baar calculate hua',
        code: `const cached = await client.get("trending-products");
if (cached) return res.json(JSON.parse(cached));
// ...compute the expensive query only on a miss...
await client.setEx("trending-products", 300, JSON.stringify(result.rows));`,
        codeJs: `const redis = require("redis");
const client = redis.createClient();

app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { createClient } from "redis";
const client = createClient();

interface TrendingProduct {
  id: number;
  name: string;
  order_count: number;
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      res.json(JSON.parse(cached) as TrendingProduct[]);
      return;
    }

    const result = await pool.query<TrendingProduct>(\`
      SELECT products.id, products.name, COUNT(orders.id) AS order_count
      FROM products
      JOIN orders ON orders.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 10
    \`);

    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same 10,000-requests-per-minute load now triggers the expensive
query roughly once every 5 minutes — every other request is served
directly from Redis, at a fraction of the database's cost.`,
        outputTs: `// Identical behaviour. TrendingProduct documents the exact shape of
// each cached and returned row, consistent with the typing pattern
// used throughout this course's database lessons.`,
        explain: 'A cache hit never touches the database at all — the fix works by ensuring the expensive computation only genuinely needs to happen once per TTL window, not once per request.',
        explainHi: 'Ek cache hit database ko bilkul kabhi nahi chhuta — fix ye sunishchit karke kaam karta hai ki mehengi computation ko sach mein sirf prati-TTL-window ek baar hona chahiye, prati-request ek baar nahi.',
      },
      {
        title: 'Cache invalidation: forcing a fresh answer when the underlying data changes',
        titleHi: 'Cache invalidation: underlying data badalte hi ek taaza jawaab force karna',
        code: `await pool.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [quantity, id]);
await client.del("trending-products");
// the next /trending request is forced to recompute, not serve a stale value`,
        codeJs: `app.post("/products/:id/restock", async (req, res, next) => {
  try {
    await pool.query(
      "UPDATE products SET stock = stock + $1 WHERE id = $2",
      [req.body.quantity, req.params.id]
    );
    await client.del("trending-products");
    res.json({ message: "Restocked" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/products/:id/restock", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query(
      "UPDATE products SET stock = stock + $1 WHERE id = $2",
      [req.body.quantity, req.params.id]
    );
    await client.del("trending-products");
    res.json({ message: "Restocked" });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `Immediately after a restock, the /trending cache entry is removed —
the very next request recomputes a fresh ranking rather than
potentially serving a value that is now known to be outdated for up to
the remainder of its TTL.`,
        outputTs: `// Identical behaviour. Combining a TTL (for gradual staleness) with
// explicit invalidation (for known, immediate changes) is the standard
// pairing for a cache-aside implementation.`,
        explain: 'Relying on the TTL alone here would mean the cache could keep serving a now-outdated ranking for up to 5 more minutes — explicit invalidation on the specific write that matters closes that gap.',
        explainHi: 'Sirf TTL par bharosa karna yahan matlab hai cache ab-purani ho chuki ranking ko 5 aur minuton tak serve karta reh sakta hai — us khaas write par explicit invalidation jo maayne rakhti hai us kami ko band karti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const result = await pool.query(expensiveAggregateQuery);
res.json(result.rows);
// recomputed from scratch on every single request, regardless of traffic`,
        right: `const cached = await client.get(cacheKey);
if (cached) return res.json(JSON.parse(cached));
// ...compute and cache only on a miss...`,
        why: 'A shared, unchanging-for-minutes answer only genuinely needs to be computed once — recomputing it on every request wastes database capacity on identical, avoidable work.',
        whyHi: 'Ek shared, minuton-tak-na-badalta jawaab sach mein sirf ek baar calculate hona chahiye — ise har request par dobara calculate karna database kshamta ko identical, bach-sakne-laayak kaam par barbaad karta hai.',
      },
      {
        wrong: `await client.set("trending-products", JSON.stringify(data));
// no TTL — this data is cached forever, regardless of how stale it becomes`,
        right: `await client.setEx("trending-products", 300, JSON.stringify(data));
// expires automatically, guaranteeing data is never more than 5 minutes old`,
        why: 'A cache entry with no expiration never automatically refreshes — without a TTL, every subsequent request keeps receiving the exact same snapshot forever, regardless of how much the real data changes.',
        whyHi: 'Bina expiration wali ek cache entry kabhi apne aap refresh nahi hoti — bina ek TTL ke, har baad wali request hamesha ke liye bilkul wahi snapshot paati rehti hai, asli data chahe kitna bhi badle.',
      },
      {
        wrong: `await client.setEx("user-profile", 300, JSON.stringify(userProfile));
// a single shared key for data that should be scoped per user`,
        right: `await client.setEx(\`user-profile:\${userId}\`, 300, JSON.stringify(userProfile));
// the cache key itself is scoped to the specific user`,
        why: 'A cache key that is not scoped per user for per-user data can serve one user\'s private information back to a completely different user who happens to request the same route next.',
        whyHi: 'Ek cache key jo per-user data ke liye per-user scoped nahi hai ek user ki private jaankaari ek poori tarah alag user ko wapas serve kar sakti hai jo samyog se agli baar wahi route maangta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Redis is one of the most widely used in-memory caching technologies in production backend systems**, and the cache-aside pattern this lesson covers is the standard, most commonly reached-for caching strategy across essentially every backend language and framework.',
        hi: '**Redis production backend systems mein sabse vyapak taur par istemal hone waali in-memory caching technologies mein se ek hai**, aur is lesson mein cover hua cache-aside pattern lagbhag har backend language aur framework ke aar-paar standard, sabse aam taur par istemal hoti caching strategy hai.',
      },
      {
        en: '**"Cache invalidation is one of the two hard problems in computer science" (alongside naming things) is a widely known, often-quoted observation in the software industry**, reflecting how genuinely easy it is, in practice, to miss a write path that should invalidate a cached value.',
        hi: '**"Cache invalidation computer science ki do mushkil samasyaon mein se ek hai" (cheezon ka naamkaran karne ke saath) software industry mein ek vyapak taur par jaana-pehchaana, aksar quote hota nirikshan hai**, ye zaahir karte hue ki practice mein ek write path chhootna kitna sach mein aasaan hai jise ek cached value invalidate karni chahiye.',
      },
      {
        en: '**Every major e-commerce, social media, and content platform caches expensive, frequently-requested, shared computations** (trending items, popular posts, aggregate counts) specifically because recomputing them per-request at real scale would be prohibitively expensive — this lesson\'s example is a direct, common real-world pattern, not a contrived teaching scenario.',
        hi: '**Har mukhya e-commerce, social media, aur content platform mehenge, aksar-maange-jaate, shared computations cache karta hai** (trending items, popular posts, aggregate counts) khaas taur par isliye kyunki unhe asli scale par prati-request dobara calculate karna bahut mehenga hoga — is lesson ka example ek seedha, aam asli-duniya pattern hai, koi banaayi hui teaching scenario nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does caching a shared, expensive query result reduce database load so dramatically, given that the query still needs to run occasionally?',
        qHi: 'Ek shared, mehengi query ke nateeje ko cache karna database load ko itna naatakiya taur par kyun kam karta hai, jab ki query ko abhi bhi kabhi-kabhi chalna chahiye?',
        a: 'The core insight is that the query in question produces the exact same answer for every request during a given time window — "today\'s trending products" does not differ from one visitor to the next, and does not change again until enough new underlying data (new orders) has accumulated. Once one single request has computed this shared answer and stored it in the cache, every subsequent request within the cache\'s TTL window can be answered directly from that already-computed result, without needing to independently re-derive it. This means the number of times the expensive query actually runs is decoupled from the number of requests the route receives, and instead becomes tied to how often the TTL expires — with a five-minute TTL, the query runs, at most, roughly once every five minutes, regardless of whether the route receives ten requests or ten million requests during that same five-minute window, since every request beyond the first within that window is served from the cache rather than recomputing anything. This is precisely why the reduction in database load can be so dramatic under high traffic specifically: the ratio between "total requests served" and "actual expensive computations performed" grows enormously as traffic increases, whereas without caching that ratio stays fixed at one computation per request no matter how much traffic there is.',
        aHi: 'Mool samajh ye hai ki us query ka poochha jaana ek diye waqt ki window ke dauraan har request ke liye bilkul wahi jawaab paida karta hai — "aaj ke trending products" ek visitor se doosre tak alag nahi hota, aur tab tak dobara nahi badalta jab tak kaafi naya underlying data (naye orders) jama na ho. Ek baar ek akeli request ne ye shared jawaab calculate kar liya aur cache mein store kar diya, cache ki TTL window ke andar har baad wali request seedha us pehle-se-calculate-hue nateeje se jawaab paa sakti hai, use mustaqil taur par dobara nikaale bina. Iska matlab hai mehengi query kitni baar asal mein chalti hai ye route ko milti requests ki tadaad se alag ho jaata hai, aur iske bajaye TTL kitni baar expire hota hai us se juda ho jaata hai — paanch-minute wale ek TTL ke saath, query zyaada-se-zyaada, lagbhag har paanch minute mein ek baar chalti hai, chahe route us hi paanch-minute window mein das requests paaye ya das million requests, kyunki us window mein pehli se aage har request cache se serve hoti hai kuch bhi dobara calculate karne ke bajaye. Bilkul isi wajah se oonchi traffic ke neeche database load mein kami khaas taur par itni naatakiya ho sakti hai: "kul serve ki gayi requests" aur "asal mein ki gayi mehengi computations" ke beech anupaat traffic badhne ke saath bahut badhta hai, jabki caching ke bina wo anupaat ek computation prati request par fixed rehta hai chahe kitni bhi traffic ho.',
      },
      {
        q: 'Why is setting a TTL on a cached value mandatory rather than optional, even for data that changes relatively infrequently?',
        qHi: 'Ek cached value par ek TTL set karna anivaarya kyun hai vaikalpik nahi, chahe wo data taulnaatmak taur par kam hi badalta ho?',
        a: 'Storing a value in a cache with no expiration means that value remains exactly as it was at the moment it was cached, indefinitely, until something else explicitly removes or replaces it — there is no automatic mechanism that would otherwise cause it to be refreshed. Even for data that changes relatively infrequently, "infrequently" still means it does change eventually, and a cache entry with no TTL provides no guarantee whatsoever about how far out of date the served value might become over time — it could remain the exact same, increasingly stale snapshot for hours, days, or indefinitely, with every request continuing to receive that same original answer regardless of how much the real underlying data has since changed. A TTL converts an otherwise unbounded staleness risk into a known, guaranteed maximum: setting a TTL of five minutes guarantees that the cached value being served is never more than five minutes older than when it was computed, since Redis will automatically discard it after that point, forcing the next request to trigger a fresh computation. Even in scenarios relying primarily on explicit invalidation for known write events (as covered elsewhere in this lesson), a TTL still serves as an essential safety net for any write path that might have been missed or forgotten — without one, a bug in the invalidation logic could leave a stale value being served forever, with no automatic recovery.',
        aHi: 'Ek cache mein bina expiration ke ek value store karna matlab hai wo value bilkul wahi rehti hai jaisi wo cache hone ke pal thi, hamesha ke liye, jab tak koi doosri cheez use explicitly hataaye ya replace na kare — koi automatic mechanism nahi hai jo warna ise refresh karwaaye. Chahe us data ke liye jo taulnaatmak taur par kam hi badalta ho, "kam hi" abhi bhi matlab hai ye aakhirkaar badalta hai, aur bina TTL wali ek cache entry ismein koi guarantee nahi deti ki serve ki gayi value waqt ke saath kitni purani ho sakti hai — ye ghanton, dinon, ya hamesha ke liye bilkul wahi, badhta purana snapshot reh sakti hai, har request wahi asli jawaab paati rehti hai chahe asli underlying data tab se kitna bhi badla ho. Ek TTL ek warna na-simit purane-hone ke khatre ko ek jaani-pehchaani, guaranteed maximum mein badalta hai: paanch-minute ka ek TTL set karna guarantee karta hai ki serve ki jaa rahi cached value kabhi us waqt se paanch minute se zyaada purani nahi hai jab wo calculate hui thi, kyunki Redis usde us point ke baad apne aap hataa dega, agli request ko ek taaza computation trigger karne majboor karte hue. Jaane-pehchaane write events ke liye mukhya taur par explicit invalidation par bharosa karte scenarios mein bhi (is lesson mein kahin aur cover hua), ek TTL abhi bhi kisi bhi write path ke liye ek zaruri safety net ki tarah kaam karta hai jo chhoota ya bhoola gaya ho sakta hai — bina ek ke, invalidation logic mein ek bug ek purani value ko hamesha ke liye serve hone chhod sakta hai, koi automatic recovery bina.',
      },
      {
        q: 'Why is a single, shared cache key appropriate for a "trending products" result but a serious bug for per-user profile data?',
        qHi: '"Trending products" nateeje ke liye ek akeli, shared cache key uchit kyun hai par per-user profile data ke liye ek gambhir bug kyun hai?',
        a: '"Today\'s trending products" is, by its own nature, a single shared answer that is correct for every visitor simultaneously — there is no meaningful sense in which one visitor should see a different trending-products ranking than another visitor at the same moment, since the underlying question ("what is currently trending across all orders") has exactly one correct answer at any given time, regardless of who is asking. This is precisely what makes a single, shared cache key appropriate: every request genuinely wants and deserves the same cached value, so storing and serving one shared entry correctly serves every visitor. Per-user profile data is fundamentally different in kind — the correct answer to "what is this user\'s profile data" genuinely differs from one user to the next, since each user has their own distinct data. If such data were stored under a single shared cache key (rather than a key that incorporates something identifying the specific user, such as their user ID), the cache would have no way to distinguish between different users\' data at all — whichever user\'s request happened to populate the cache first would have their private data served back to every SUBSEQUENT user who requests that same route, entirely regardless of whether that subsequent user is the same person or a completely different one. This is not merely a correctness bug but a genuine privacy and security failure, since it can directly expose one user\'s private data to another — the fix is for the cache key itself to be scoped per user (commonly by including the user\'s ID directly in the key, such as user-profile:42), ensuring each user\'s cached data remains correctly isolated to requests genuinely belonging to that specific user.',
        aHi: '"Aaj ke trending products" apni khud ki prakriti se, ek akela shared jawaab hai jo ek saath har visitor ke liye sahi hai — koi maayne-rakhta matlab nahi hai jismein ek visitor ko ek trending-products ranking doosre visitor se alag dikhni chahiye usi pal, kyunki underlying sawaal ("abhi sab orders ke aar-paar kya trending hai") ka kisi bhi diye waqt par bilkul ek sahi jawaab hai, kaun poochh raha hai us se bekhabar. Bilkul yehi hai jo ek akeli, shared cache key ko uchit banaata hai: har request sach mein wahi cached value chahti hai aur uski haqdaar hai, isliye ek shared entry store aur serve karna sahi tarike se har visitor ki sewa karta hai. Per-user profile data prakriti mein buniyaadi taur par alag hai — "is user ka profile data kya hai" ka sahi jawaab sach mein ek user se doosre tak alag hota hai, kyunki har user ka apna alag data hai. Agar aisa data ek akeli shared cache key ke neeche store hota (ek key ke bajaye jo kuch us khaas user ko pehchaanne wala shaamil karti hai, jaise unki user ID), cache ke paas alag-alag users ke data ke beech bilkul koi farak karne ka tarika nahi hoga — jis bhi user ki request ne pehle cache bhari hogi unka private data har BAAD ki us user ko wapas serve hoga jo wahi route maangta hai, chahe wo baad wala user wahi insaan ho ya poori tarah alag. Ye sirf ek sahi-hone ki bug nahi hai balki ek asli privacy aur security fail-hona hai, kyunki ye seedha ek user ka private data doosre ko expose kar sakta hai — fix ye hai ki cache key khud per-user scoped ho (aam taur par user ki ID seedha key mein shaamil karke, jaise \`user-profile:42\`), sunishchit karte hue ki har user ka cached data sahi tarike se un requests tak seemit rehta hai jo sach mein us khaas user se hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /trending route running the expensive query on every request. Seed enough order data to make the query genuinely slow, and use console.time to measure how long it takes on repeated requests.',
        taskHi: 'Toota \`/trending\` route banao jo har request par mehengi query chalaaye. Query ko sach mein dheema banaane ke liye kaafi order data seed karo, aur \`console.time\` istemal karo dohraayi requests par ye naapne ke liye ki kitna waqt lagta hai.',
        hint: 'Sending 20 requests in a tight loop and summing their total time gives a concrete before/after comparison once the cache is added.',
        hintHi: 'Ek tight loop mein 20 requests bhejna aur unka kul waqt jodna cache jodne ke baad ek thos pehle/baad ka comparison deta hai.',
      },
      {
        task: 'Fix it with Redis cache-aside and a 5-minute TTL. Confirm the first request is slow (a cache miss) and every subsequent request within 5 minutes is dramatically faster (a cache hit).',
        taskHi: 'Redis cache-aside aur ek 5-minute TTL se theek karo. Confirm karo pehli request dheemi hai (ek cache miss) aur 5 minute ke andar har baad wali request naatakiya taur par tez hai (ek cache hit).',
        hint: 'Temporarily set the TTL to something very short (like 5 seconds) during testing so you can observe the cache expiring and the next request recomputing, without waiting a full 5 minutes.',
        hintHi: 'Testing ke dauraan asthaayi taur par TTL ko kuch bahut chhota set karo (jaise 5 second) taaki tum cache expire hote aur agli request dobara calculate karte dekh sako, poore 5 minute intezaar kiye bina.',
      },
      {
        task: 'Add a restock route that invalidates the trending-products cache key. Confirm that immediately after calling it, the next /trending request recomputes rather than serving a stale cached value.',
        taskHi: 'Ek restock route jodo jo \`trending-products\` cache key invalidate kare. Confirm karo ki use bulaane ke turant baad, agli \`/trending\` request dobara calculate karti hai ek purani cached value serve karne ke bajaye.',
        hint: 'Temporarily add a console.log right before the cache check to directly observe whether a given request resulted in a cache hit or a miss.',
        hintHi: 'Cache check se theek pehle asthaayi taur par ek \`console.log\` jodo seedha dekhne ke liye ki ek di gayi request ek cache hit ya miss mein nateeja hui.',
      },
    ],

    keyTakeaways: [
      'A shared, expensive query result that produces the same answer for every request only genuinely needs to be computed once — recomputing it per-request wastes database capacity on identical, avoidable work.',
      'The cache-aside pattern checks the cache first, falls back to computing and storing the result only on a miss, and serves directly from the cache on a hit, decoupling the number of expensive computations from the number of requests.',
      'A TTL is mandatory, not optional — a cache entry with no expiration is permanently stale data, since nothing automatically refreshes it as the underlying real data changes.',
      'Explicit cache invalidation (deleting a cache entry as part of a relevant write) closes the gap a TTL alone leaves open, forcing a fresh computation the moment underlying data genuinely changes.',
      'Caching trades a bounded amount of staleness for reduced load — whether this trade-off is acceptable depends entirely on the data\'s tolerance for being slightly out of date, which varies enormously by feature.',
      'A cache key must be scoped correctly to what it represents — a single shared key is appropriate for a genuinely shared answer, but per-user or otherwise sensitive data requires a key scoped to the specific user or request it belongs to.',
    ],
    keyTakeawaysHi: [
      'Ek shared, mehenga query nateeja jo har request ke liye wahi jawaab paida karta hai sach mein sirf ek baar calculate hona chahiye — ise prati-request dobara calculate karna database kshamta ko identical, bach-sakne-laayak kaam par barbaad karta hai.',
      'Cache-aside pattern pehle cache check karta hai, sirf ek miss par nateeja calculate aur store karne par wapas jaata hai, aur ek hit par seedha cache se serve karta hai, mehengi computations ki tadaad ko requests ki tadaad se alag karte hue.',
      'Ek TTL anivaarya hai, vaikalpik nahi — bina expiration wali ek cache entry hamesha ke liye purana data hai, kyunki kuch bhi ise apne aap refresh nahi karta jaise underlying asli data badalta hai.',
      'Explicit cache invalidation (ek maayne-rakhta write ke hisse ki tarah ek cache entry delete karna) us kami ko band karti hai jo akela TTL khula chhodta hai, underlying data asal mein badalte hi ek taaza computation force karte hue.',
      'Caching ek seemit tadaad ka purana-pan lekar load kam karta hai — kya ye trade-off swikaarya hai poori tarah is baat par nirbhar karta hai ki data thoda purana hone ke liye kitna sehansheel hai, jo feature ke hisaab se bahut alag hota hai.',
      'Ek cache key ko us cheez ke hisaab se sahi tarike se scope hona chahiye jise ye darzhaata hai — ek akeli shared key ek sach mein shared jawaab ke liye uchit hai, par per-user ya doosri sensitive data ko us khaas user ya request ke liye scoped ek key chahiye jise ye belong karta hai.',
    ],
  },
];
