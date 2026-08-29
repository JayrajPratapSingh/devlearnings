/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 11.
 *
 * Cache stampede (thundering herd) protection: why the basic cache-aside
 * pattern this course's caching lesson taught has its own hidden failure
 * mode the instant a popular cache key expires under real traffic — every
 * concurrent request that happens to arrive during the same brief window
 * gets a cache miss simultaneously and independently runs the exact same
 * expensive recomputation at once, potentially hitting the database with
 * hundreds of identical, simultaneous queries for a value that only ever
 * needed to be computed once. Broken example: the trending-products cache
 * from the earlier caching lesson, examined specifically at the moment its
 * TTL expires under heavy concurrent traffic. Fixed with a short-lived
 * Redis lock (single-flight pattern): only the one request that acquires
 * the lock recomputes and repopulates the cache; every other concurrent
 * request waits briefly and reads the freshly repopulated cache instead of
 * independently recomputing the same value.
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

export const NODE_MODULE_7_PART11: CourseLesson[] = [
  {
    slug: 'cache-stampede-protection',
    title: 'Cache Stampede: When a Cache Miss Hits Everyone at Once',
    titleHi: 'Cache Stampede: Jab Ek Cache Miss Sabko Ek Saath Todta Hai',
    description: 'The exact instant a popular cache entry expires, 400 concurrent requests all miss the cache at once and independently run the same expensive query simultaneously — hitting the database harder than if there had been no cache at all.',
    descriptionHi: 'Theek us pal jab ek popular cache entry expire hoti hai, 400 concurrent requests ek saath cache miss karti hain aur independently wahi mehengi query ek saath chalaati hain — database ko us se zyaada zor se marte hue jitna agar bilkul koi cache hi na hota.',
    difficulty: 'HARD',
    duration: 20,
    order: 11,

    analogy: {
      en: '**A single water tank that a whole village shares, refilled by one slow pump — the instant the tank runs completely dry, every single household in the village rushes to start their own separate, competing pump at the exact same moment, instead of one household refilling the shared tank while everyone else simply waits the short time it takes.** The basic cache-aside pattern, examined specifically at the moment a popular entry expires under real traffic, is like a village where every household draws water from one shared tank, refilled periodically by a single slow well pump — while the tank has water, everyone draws from it freely and the well is left alone. The instant the tank runs completely dry, however, if every single household\'s own habit is simply "check the tank, and if it\'s empty, go start up my own pump to refill it," then the moment of running dry causes every household in the village to independently start their own separate pump at the exact same instant — the well itself, which could easily supply one pump running at a time, is suddenly hit by fifty simultaneous, competing demands, straining it far more severely than if there had been no shared tank at all and every household had simply been drawing from the well individually and continuously the whole time. A village that instead agrees on a simple rule — the FIRST household to notice the tank is empty starts the single pump refilling it, while every other household simply waits the short, known time it takes for that one pump to finish and the tank to be full again — draws exactly the same amount of water from the well in total, but the well is only ever asked to run one pump at a time, no matter how many households happen to check the tank in that same brief empty moment.',
      hi: '**Ek akela paani ka tank jise poora gaon share karta hai, ek dheeme pump se dobara bhara jaata hai — jis pal tank bilkul khaali ho jaata hai, gaon ka har akela ghar bilkul usi pal apna khud ka alag, pratispardhi pump chalaana shuru kar deta hai, ek ghar shared tank ko dobara bharne aur baaki sab bas thodi si der intezaar karne ke bajaye.** Basic cache-aside pattern, khaas taur par us pal jaancha jaaye jab ek popular entry asli traffic ke neeche expire hoti hai, ek gaon jaisa hai jahan har ghar ek shared tank se paani nikaalta hai, ek akele dheeme well pump se niyamit taur par dobara bhara jaata hai — jab tak tank mein paani hai, sab isse azaadi se nikaalte hain aur well ko akela chhod diya jaata hai. Theek jis pal tank poori tarah khaali ho jaata hai, halaanki, agar har akele ghar ki apni aadat bas "tank check karo, aur agar khaali hai, apna khud ka pump chalaao ise dobara bharne ke liye" hai, to khaali hone ka pal gaon ke har ghar ko bilkul usi pal apna alag pump mustaqil taur par chalaane cause karta hai — well khud, jo aasaani se ek waqt mein ek pump chalaate hue supply de sakta tha, achaanak pachaas ek-saath, pratispardhi maangon se takraaya jaata hai, use us se kaafi zyaada dabaav daalte hue jitna agar koi shared tank hota hi nahi aur har ghar poori der akele aur lagaataar well se nikaal raha hota. Ek gaon jo iske bajaye ek saadha niyam maanta hai — PEHLA ghar jo notice kare ki tank khaali hai akela pump chalaata hai use dobara bharne ke liye, jabki har doosra ghar bas us chhote, jaane-pehchaane waqt ka intezaar karta hai jab tak wo ek pump khatam hota hai aur tank dobara bhar jaata hai — well se kul mein bilkul utna hi paani nikaalta hai, par well ko kabhi ek waqt mein ek se zyaada pump chalaane ko kaha jaata hi nahi, chahe kitne bhi ghar us bilkul chhote khaali pal mein tank check karein.',
    },

    simple: `**Start broken.** This course\'s earlier caching lesson\'s trending-products route, examined specifically at the exact moment its cache entry expires:

\`\`\`js
app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Under ordinary traffic, this cache-aside pattern (this course\'s earlier caching lesson) works exactly as intended — the very first request after the cache expires recomputes the value, and every subsequent request within the next five minutes reads that cached result directly. The gap this lesson addresses is what happens specifically during the brief window right after the cache entry expires, under real, meaningful concurrent traffic: if this route is receiving, say, 400 requests per second, and the cache entry expires at a specific instant, EVERY one of those requests arriving within the next few milliseconds — potentially dozens or hundreds of them, all essentially simultaneously — independently checks the cache, independently finds nothing there yet (since none of them have completed populating it), and independently proceeds to run the exact same expensive aggregate query at almost the same moment. Rather than one single query running once and everyone else benefiting from its cached result (the entire point of caching), the database is hit with potentially hundreds of duplicate, identical, expensive queries within the same brief instant — a load that can genuinely be far worse than if the route had no cache at all, since a route with no cache spreads its query load evenly over time, one query per request, while this stampede concentrates an enormous burst of identical queries into a single, brief moment.

**The fix: a short-lived lock ensures only one request recomputes per expiration**

\`\`\`js
async function getTrendingProducts() {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached);

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });

  if (lockAcquired) {
    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  // Another request is already recomputing — wait briefly, then read its result
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req, res, next) => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
async function getTrendingProducts(): Promise<TrendingProduct[]> {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached) as TrendingProduct[];

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });

  if (lockAcquired) {
    const result = await pool.query<TrendingProduct>(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`client.set(key, value, { NX: true, EX: 10 })\` sets a value ONLY if that key does not already exist (\`NX\`, "set if Not eXists"), and the operation itself is atomic — Redis guarantees that even if hundreds of requests attempt this exact same command at the same instant, only ONE of them will ever actually succeed in setting the lock key, with every other attempt correctly reporting that the lock was not acquired. The one request that successfully acquires the lock is the only one that proceeds to run the expensive query and repopulate the cache; every other concurrent request that fails to acquire the lock simply waits a brief moment and tries the entire function again, by which point the first request has typically already finished and populated the cache, so the retry finds a genuine cache hit rather than needing to recompute anything itself. The lock\'s own short expiration (\`EX: 10\`, ten seconds) exists specifically as a safety net — if the request holding the lock somehow crashes or hangs before releasing it, the lock itself expires and releases automatically after ten seconds, ensuring the cache does not remain permanently unable to be recomputed due to one failed attempt.`,

    simpleHi: `**Toote hue se shuru.** Is course ke pehle wale caching lesson ka trending-products route, khaas taur par us bilkul pal jaancha jab uski cache entry expire hoti hai:

\`\`\`js
app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Aam traffic ke neeche, ye cache-aside pattern (is course ka pehle wala caching lesson) bilkul iraade ke hisaab se kaam karta hai — cache expire hone ke bilkul baad ki pehli request value dobara calculate karti hai, aur agli paanch minuton ke andar har baad wali request seedha wo cached nateeja padhti hai. Ye lesson jis kami ko sambhaalta hai wo khaas taur par ye hai ki kya hota hai theek cache entry expire hone ke baad wali chhoti window mein, asli, maayne-rakhta concurrent traffic ke neeche: agar ye route, maano, 400 requests prati second paa rahi hai, aur cache entry ek khaas pal expire hoti hai, us agle kuch milliseconds mein aane wali HAR request — mumkin taur par unmein se dazan ya sau, sab lagbhag ek saath — independently cache check karti hai, independently wahaan abhi kuch nahi paati (kyunki inmein se koi bhi ise bharna poora nahi kar chuka), aur independently bilkul wahi mehengi aggregate query lagbhag usi pal chalaana shuru kar deti hai. Ek akeli query ke ek baar chalne aur baaki sab uske cached nateeje se faayda uthaane ke bajaye (caching ka poora point), database ko us bilkul chhoti pal ke andar mumkin taur par sainkdon duplicate, identical, mehengi queries se maara jaata hai — ek load jo sach mein us se kaafi zyaada bura ho sakta hai jitna agar route mein bilkul koi cache na hoti, kyunki bina-cache wala ek route apna query load waqt ke saath samaan taur par phailaata hai, prati request ek query, jabki ye stampede identical queries ki ek vishaal burst ek akeli, chhoti pal mein concentrate karti hai.

**Fix: ek chhoti-umar wala lock sunishchit karta hai ki sirf ek request prati-expiration dobara calculate kare**

\`\`\`js
async function getTrendingProducts() {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached);

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });

  if (lockAcquired) {
    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  // Ek doosri request pehle se dobara calculate kar rahi hai — thodi der intezaar karo, phir uska nateeja padho
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req, res, next) => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
async function getTrendingProducts(): Promise<TrendingProduct[]> {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached) as TrendingProduct[];

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });

  if (lockAcquired) {
    const result = await pool.query<TrendingProduct>(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`client.set(key, value, { NX: true, EX: 10 })\` ek value SIRF tab set karta hai jab wo key pehle se maujood na ho (\`NX\`, "Not eXists ho to set karo"), aur operation khud atomic hai — Redis guarantee karta hai ki chahe sainkdon requests bilkul isi command ki koshish karein usi pal, unmein se sirf EK hi kabhi asal mein lock key set karne mein safal hogi, har doosri koshish sahi tarike se report karegi ki lock nahi mila. Wo ek request jo safaltapoorvak lock paati hai akeli hai jo mehengi query chalaane aur cache dobara bharne ke liye aage badhti hai; har doosri concurrent request jo lock paane mein fail hoti hai bas thodi der intezaar karti hai aur poora function dobara try karti hai, jab tak pehli request aam taur par pehle se poori ho chuki hoti hai aur cache bhar chuki hoti hai, isliye retry ek asli cache hit paati hai khud kuch dobara calculate karne ki zarurat ke bajaye. Lock ki apni chhoti expiration (\`EX: 10\`, das seconds) khaas taur par ek safety net ki tarah maujood hai — agar lock rakhti request kisi tarah crash ya latak jaaye use release karne se pehle, lock khud das seconds baad apne aap expire aur release ho jaata hai, sunishchit karte hue ki cache hamesha ke liye ek fail hui koshish ki wajah se dobara-calculate-na-ho-paane wali sthiti mein na rahe.`,

    content: `## Why this is worse than having no cache at all, specifically at the moment of expiry

\`\`\`
No cache: each request independently runs the query, spread naturally
over time — 400 requests per second means 400 queries per second,
evenly distributed.

Cache with no stampede protection: 399 requests per second read from
cache almost for free — until the exact instant the entry expires,
at which point potentially all 400 requests arriving in that same
brief window run the query simultaneously, concentrated into one instant.
\`\`\`

A route with no caching at all distributes its database load evenly across time — each request pays its own, individual cost, spread naturally as requests arrive. A cached route without stampede protection actually produces a WORSE momentary spike specifically at the instant of expiry than having no cache would: for nearly the entire five-minute TTL window, the database sees almost zero load from this route at all, but the instant the entry expires, every request that happens to arrive in the following few milliseconds — a number that scales directly with how much traffic the route receives — hits the database simultaneously, all running the identical query at once. This concentrated burst, rather than a smoothly distributed load, is precisely what can overwhelm a database far more severely than the uncached, evenly-spread alternative ever would, even though the CACHED version is, on average, doing dramatically less total database work over time.

## Why waiting and retrying, rather than each request computing independently, is the actual fix

\`\`\`js
if (lockAcquired) {
  // compute and cache
} else {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts(); // retry — likely finds a fresh cache hit now
}
\`\`\`

The core insight this lesson\'s fix relies on is that every one of those hundreds of simultaneous requests wants the exact same answer — there is no reason for more than one of them to ever actually perform the computation, since the moment any one of them finishes, the result is equally valid and useful for all the others. The lock ensures exactly one request is designated to do the actual work, and every other request, rather than duplicating that work, simply waits a short, deliberately brief amount of time and checks again — by which point the one working request has typically already finished (the lock\'s existence itself is usually brief, matching how long the actual query takes), and the waiting requests find a freshly populated cache instead of an empty one. This trades a small amount of added latency for the requests that had to wait (roughly one hundred milliseconds in this lesson\'s example) in exchange for reducing the database\'s momentary load from potentially hundreds of simultaneous queries down to exactly one.

## Recognizing which cache keys genuinely need stampede protection

\`\`\`
A cache key read by only a handful of requests per minute is unlikely
to ever have more than one or two concurrent misses at the moment of
expiry — stampede protection adds complexity with little real benefit here.

A cache key read by hundreds or thousands of requests per second (a
homepage's "trending" section, a popular product's details) is exactly
where a stampede becomes a genuine, serious risk worth protecting against.
\`\`\`

Not every cached value needs this lesson\'s lock-based protection — the risk this lesson addresses only becomes serious specifically when a cache key is read by enough concurrent traffic that more than a handful of requests are likely to arrive within the same brief window right after expiry. A lightly-trafficked cache key, read only occasionally, is unlikely to ever have more than one or two requests colliding at the moment of expiry, making the added complexity of a locking mechanism largely unnecessary there — recognizing which specific cache keys carry genuinely high concurrent read volume is what determines where this lesson\'s additional protection is actually worth the complexity it adds.

## A simpler, weaker alternative: staggered expiration to spread out the risk

\`\`\`js
// Add a small random amount to the TTL so many keys set around the same
// time do not all expire at the exact same instant
const jitter = Math.floor(Math.random() * 30); // 0-30 seconds of randomness
await client.setEx("trending-products", 300 + jitter, JSON.stringify(result.rows));
\`\`\`

A simpler, though weaker, complementary technique worth knowing is adding a small amount of random "jitter" to a TTL, so that if many different cache keys all happened to be set around the same time (a deploy that warms several caches at once, for instance), they do not all expire at the exact same later instant, spreading out the risk of a stampede across a wider window rather than concentrating it. This does not solve the stampede problem for a single, individual popular key on its own (which is exactly what this lesson\'s lock-based approach is for), but it is a reasonable, low-effort addition when many keys\' expirations might otherwise cluster together.`,

    contentHi: `## Ye bina-cache-ke se bura kyun hai, khaas taur par expiry ke pal par

\`\`\`
Koi cache nahi: har request independently query chalaati hai, waqt ke
saath naisargik taur par phaili hui — 400 requests prati second matlab
400 queries prati second, samaan taur par baanti hui.

Bina stampede protection wali cache: 399 requests prati second lagbhag
muft cache se padhti hain — jab tak entry bilkul expire nahi hoti,
jis pal us bilkul chhoti window mein aati mumkin taur par sab 400
requests query ek saath chalaati hain, ek pal mein concentrate hui.
\`\`\`

Bilkul koi caching na hone wala ek route apna database load waqt ke saath samaan taur par baantta hai — har request apni khud, akeli keemat chukaati hai, naisargik taur par phaili hui jaise requests aati hain. Bina stampede protection wala ek cached route asal mein khaas taur par expiry ke pal ek BURA pal-bhar wala spike paida karta hai bina-cache wale ke muqable: lagbhag poori paanch-minute wali TTL window ke liye, database is route se lagbhag zero load dekhta hai bilkul, par entry expire hote hi, agle kuch milliseconds mein samyog se aati har request — ek sankhya jo seedhe taur par is baat se scale karti hai ki route ko kitna traffic milta hai — database ko ek saath maarti hai, sab identical query ek saath chalaate hue. Ye concentrate hua burst, ek achhi tarah phaila hua load ke bajaye, bilkul wo hai jo ek database ko us se kaafi zyaada gambhirta se overwhelm kar sakta hai bina-cache, samaan-taur-par-phaile vikalp se kabhi karega, chahe CACHED version, average mein, waqt ke saath naatakiya taur par kam kul database kaam kar raha ho.

## Intezaar aur retry karna, har request ka independently calculate karne ke bajaye, asli fix kyun hai

\`\`\`js
if (lockAcquired) {
  // calculate aur cache karo
} else {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts(); // retry — ab lagbhag ek taaza cache hit paayega
}
\`\`\`

Is lesson ke fix ka mool insight ye hai ki un sainkdon ek-saath requests mein se har ek bilkul wahi jawaab chahti hai — inmein se ek se zyaada ke liye kabhi asal mein calculation karne ki koi wajah nahi, kyunki jis pal unmein se koi bhi poori hoti hai, nateeja baaki sabke liye barabar valid aur kaam ka hai. Lock sunishchit karta hai ki bilkul ek request asli kaam karne ke liye nishaanit hai, aur har doosri request, us kaam ko dohraane ke bajaye, bas ek chhota, jaan-boojhkar sankeern waqt intezaar karti hai aur dobara check karti hai — jab tak wo ek kaam kar rahi request aam taur par pehle se poori ho chuki hoti hai (lock ki maujoodgi khud aam taur par chhoti hoti hai, jitna waqt asli query leti hai us se milti hui), aur intezaar kar rahi requests ek taaza bhari cache paati hain khaali ke bajaye. Ye un requests ke liye jinhe intezaar karna pada (is lesson ke example mein lagbhag sau milliseconds) thoda extra latency ke badle mein database ke pal-bhar load ko mumkin taur par sainkdon ek-saath queries se ghatakar bilkul ek kar deta hai.

## Kaunse cache keys ko sach mein stampede protection chahiye ye pehchaanna

\`\`\`
Ek cache key jo prati minute sirf mutthi bhar requests dwara padhi jaati
hai expiry ke pal ek ya do se zyaada concurrent misses paane ki
sambhaavna kam hai — stampede protection yahan bilkul asli faayde ke
bina complexity jodta hai.

Ek cache key jo prati second sainkdon ya hazaaron requests dwara padhi
jaati hai (ek homepage ka "trending" section, ek popular product ki
details) bilkul wahi jagah hai jahan ek stampede ek asli, gambhir khatra
ban jaata hai jise bachaane laayak hai.
\`\`\`

Har cached value ko is lesson ka lock-based protection nahi chahiye — jo khatra ye lesson sambhaalta hai wo sirf tab gambhir banta hai jab ek cache key itni concurrent traffic dwara padhi jaati hai ki mutthi bhar se zyaada requests expiry ke bilkul baad wali chhoti window mein aane ki sambhaavna rakhti hon. Ek halke-traffic wala cache key, sirf kabhi-kabhi padha jaata hai, expiry ke pal ek ya do se zyaada requests ke takraane ki sambhaavna kam rakhta hai, ek locking mechanism ki jodi hui complexity ko wahaan bahut-taur-par-na-zaruri banaate hue — ye pehchaanna ki kaunse khaas cache keys sach mein oonchi concurrent read volume rakhte hain ye tay karta hai ki is lesson ka additional protection asal mein kahan complexity ke laayak hai jo ye jodta hai.

## Ek saadha, kamzor vikalp: khatre ko phailaane ke liye staggered expiration

\`\`\`js
// TTL mein ek chhoti random tadaad jodo taaki ek jaisa waqt set kiye kai keys
// sab bilkul usi pal expire na hon
const jitter = Math.floor(Math.random() * 30); // 0-30 seconds ki randomness
await client.setEx("trending-products", 300 + jitter, JSON.stringify(result.rows));
\`\`\`

Ek saadha, chahe kamzor, poorak technique jaanne laayak hai ek TTL mein thodi random "jitter" jodna, taaki agar kai alag cache keys sab samyog se lagbhag ek hi waqt set hui hon (ek deploy jo ek saath kai caches warm karta hai, misal ke taur par), wo sab bilkul usi baad wale pal par expire na hon, ek stampede ke khatre ko ek chaudi window mein phailaate hue use ek jagah concentrate karne ke bajaye. Ye stampede samasya ko akele ek khaas popular key ke liye khud solve nahi karta (jiske liye is lesson ka lock-based tarika bilkul hai), par ye ek uchit, kam-koshish wala addition hai jab kai keys ki expirations warna ek saath cluster ho sakti hain.`,

    examples: [
      {
        title: 'Broken: every concurrent request recomputes independently at expiry',
        titleHi: 'Toota: har concurrent request expiry par independently dobara calculate karti hai',
        code: `const cached = await client.get("trending-products");
if (cached) return res.json(JSON.parse(cached));
const result = await pool.query(expensiveAggregateQuery); // every request runs this at once
await client.setEx("trending-products", 300, JSON.stringify(result.rows));`,
        codeJs: `app.get("/trending", async (req, res, next) => {
  try {
    const cached = await client.get("trending-products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface TrendingProduct {
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
    const result = await pool.query<TrendingProduct>(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the stampede is
// entirely about concurrent timing at expiry, not a type or logic error.`,
        output: `Under 400 requests/second, the moment the cache entry expires, dozens
of requests arriving in the same brief window all miss the cache and
independently run the expensive query at nearly the same instant.`,
        explain: 'Every request only ever checks "is there a cached value right now" — none of them have any way to know another request is already in the process of recomputing the exact same value.',
        explainHi: 'Har request bas hamesha check karti hai "abhi koi cached value hai" — inmein se kisi ke paas ye jaanne ka koi tarika nahi ki ek doosri request pehle se bilkul wahi value dobara calculate karne ke process mein hai.',
      },
      {
        title: 'Fixed: a Redis lock ensures only one request recomputes',
        titleHi: 'Theek: ek Redis lock sunishchit karta hai ki sirf ek request dobara calculate kare',
        code: `const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });
if (lockAcquired) { /* recompute and cache */ } else { /* wait briefly, then retry */ }`,
        codeJs: `async function getTrendingProducts() {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached);

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });
  if (lockAcquired) {
    const result = await pool.query(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req, res, next) => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface TrendingProduct {
  id: number;
  name: string;
  order_count: number;
}

async function getTrendingProducts(): Promise<TrendingProduct[]> {
  const cached = await client.get("trending-products");
  if (cached) return JSON.parse(cached) as TrendingProduct[];

  const lockAcquired = await client.set("trending-products:lock", "1", { NX: true, EX: 10 });
  if (lockAcquired) {
    const result = await pool.query<TrendingProduct>(expensiveAggregateQuery);
    await client.setEx("trending-products", 300, JSON.stringify(result.rows));
    await client.del("trending-products:lock");
    return result.rows;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return getTrendingProducts();
}

app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await getTrendingProducts());
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same 400-requests/second burst at expiry now results in exactly
one database query — only the single request that acquires the lock
recomputes; every other concurrent request waits briefly and reads the
freshly populated cache instead.`,
        outputTs: `// Identical behaviour. TrendingProduct documents the exact shape of
// each row, consistent with the typing pattern from the earlier
// caching lesson.`,
        explain: 'The lock\'s atomicity is what makes this work — Redis guarantees that even with hundreds of simultaneous attempts, only one SET NX call can ever succeed, designating exactly one request to do the actual work.',
        explainHi: 'Lock ki atomicity hi hai jo ise kaam karti hai — Redis guarantee karta hai ki sainkdon ek-saath koshishon ke saath bhi, sirf ek \`SET NX\` call kabhi safal ho sakti hai, bilkul ek request ko asli kaam karne ke liye nishaanit karte hue.',
      },
      {
        title: 'Recognizing when stampede protection is worth the added complexity',
        titleHi: 'Pehchaanna jab stampede protection jodi gayi complexity ke laayak hai',
        code: `// A rarely-read cache key: stampede protection is unnecessary complexity
const cached = await client.get("user-preference-summary");

// A heavily-read cache key: stampede protection is genuinely worth it
const cached = await client.get("homepage-trending");`,
        codeJs: `// Low traffic — a simple cache-aside without locking is sufficient
app.get("/user/preferences-summary", async (req, res, next) => {
  const cached = await client.get(\`prefs:\${req.userId}\`);
  if (cached) return res.json(JSON.parse(cached));
  const summary = await computeExpensiveSummary(req.userId);
  await client.setEx(\`prefs:\${req.userId}\`, 300, JSON.stringify(summary));
  res.json(summary);
});

// High traffic, shared across all visitors — worth the lock's added complexity
app.get("/trending", async (req, res, next) => {
  res.json(await getTrendingProducts()); // uses the lock-based function above
});`,
        codeTs: `// Low traffic — a simple cache-aside without locking is sufficient
app.get("/user/preferences-summary", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cached = await client.get(\`prefs:\${req.userId}\`);
  if (cached) {
    res.json(JSON.parse(cached));
    return;
  }
  const summary = await computeExpensiveSummary(req.userId);
  await client.setEx(\`prefs:\${req.userId}\`, 300, JSON.stringify(summary));
  res.json(summary);
});

// High traffic, shared across all visitors — worth the lock's added complexity
app.get("/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.json(await getTrendingProducts());
});`,
        outputJs: `The per-user preferences cache is read at most once per user per
window — collisions at expiry are rare enough that the simpler
cache-aside pattern alone is sufficient. The shared trending cache,
read by every visitor, genuinely needs the lock.`,
        outputTs: `// Identical behaviour. Recognizing the difference in read volume and
// concurrency is what determines where the added complexity of
// stampede protection is actually justified.`,
        explain: 'A cache key\'s realistic concurrent read volume, not a blanket rule, determines whether the added complexity of lock-based stampede protection is actually worth adopting for that specific key.',
        explainHi: 'Ek cache key ki waastavik concurrent read volume, koi blanket rule nahi, tay karti hai ki kya lock-based stampede protection ki jodi hui complexity us khaas key ke liye asal mein apnaane laayak hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const cached = await client.get(key);
if (cached) return JSON.parse(cached);
const result = await expensiveComputation();
// every concurrent request past this point runs the computation independently`,
        right: `const lockAcquired = await client.set(\`\${key}:lock\`, "1", { NX: true, EX: 10 });
if (lockAcquired) { /* recompute */ } else { /* wait and retry */ }
// only one request ever runs the computation per expiration`,
        why: 'Without a lock, every concurrent request that arrives during the same brief window after expiry independently discovers a cache miss and independently recomputes the same value, hitting the database with a burst of duplicate queries.',
        whyHi: 'Bina ek lock ke, har concurrent request jo expiry ke baad usi chhoti window mein aati hai independently ek cache miss dhoondhti hai aur independently wahi value dobara calculate karti hai, database ko duplicate queries ke ek burst se maarte hue.',
      },
      {
        wrong: `await client.set(lockKey, "1"); // no NX flag — this always succeeds, providing no locking at all
if (true) { /* every request thinks it acquired the lock */ }`,
        right: `const lockAcquired = await client.set(lockKey, "1", { NX: true, EX: 10 });
if (lockAcquired) { /* only the genuinely first request proceeds */ }`,
        why: 'Without the NX flag, a plain SET always succeeds regardless of whether the key already exists — every concurrent request would incorrectly believe it acquired the lock, defeating the entire mechanism.',
        whyHi: 'Bina \`NX\` flag ke, ek saadha \`SET\` hamesha safal hota hai chahe key pehle se maujood ho ya na ho — har concurrent request galat tarike se maanegi ki usne lock paa liya, poore mechanism ko haraate hue.',
      },
      {
        wrong: `const lockAcquired = await client.set(lockKey, "1", { NX: true }); // no expiration on the lock itself
// if this request crashes before deleting the lock, it remains forever, blocking all future recomputation`,
        right: `const lockAcquired = await client.set(lockKey, "1", { NX: true, EX: 10 });
// the lock releases automatically after 10 seconds even if the holder crashes`,
        why: 'A lock with no expiration of its own can be left permanently held if the request holding it crashes or hangs before explicitly releasing it, permanently blocking the cache from ever being recomputed again.',
        whyHi: 'Ek lock jiski apni koi expiration nahi hai hamesha ke liye pakda reh sakta hai agar use rakhti request explicitly release karne se pehle crash ya latak jaaye, cache ko hamesha ke liye dobara-calculate-hone se rokte hue.',
      },
    ],

    realWorld: [
      {
        en: '**"Cache stampede" (also called "thundering herd" or "dogpile effect") is a well-documented, widely recognized failure mode in production systems that rely on caching**, commonly cited alongside cache invalidation as one of the genuinely tricky, easy-to-overlook aspects of caching in practice.',
        hi: '**"Cache stampede" (jise "thundering herd" ya "dogpile effect" bhi kehte hain) production systems mein ek achhi tarah documented, vyapak taur par pehchaana gaya fail-hone ka tarika hai jo caching par bharosa karte hain**, aam taur par cache invalidation ke saath cite hota hai caching ke sach mein tricky, chhoot-jaane-mein-aasaan pahluon mein se ek ki tarah.',
      },
      {
        en: '**Popular caching libraries and frameworks across many languages provide built-in "single-flight" or "request coalescing" utilities specifically for this exact problem**, reflecting how commonly production systems at real scale need this specific protection rather than hand-rolling it from scratch every time.',
        hi: '**Kai languages mein popular caching libraries aur frameworks bilkul is khaas samasya ke liye built-in "single-flight" ya "request coalescing" utilities dete hain**, zaahir karte hue ki asli scale par production systems ko ye khaas protection kitni aam taur par chahiye, har baar shuru se haath se banaane ke bajaye.',
      },
      {
        en: '**A cache stampede against a popular news article, a trending social media post, or a viral product page is a commonly cited real-world scenario**, since these are exactly the high-read, TTL-based caching patterns most vulnerable to a stampede the instant they expire under genuine, heavy traffic.',
        hi: '**Ek popular news article, ek trending social media post, ya ek viral product page ke khilaaf ek cache stampede ek aam taur par cite hone waala asli-duniya scenario hai**, kyunki ye bilkul wo oonchi-read, TTL-based caching patterns hain jo asli, bhaari traffic ke neeche expire hote hi ek stampede ke liye sabse zyaada vulnerable hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a cached route, under heavy concurrent traffic, momentarily place MORE load on the database at the instant of cache expiry than an equivalent route with no caching at all?',
        qHi: 'Ek cached route, bhaari concurrent traffic ke neeche, cache expiry ke pal database par kyun pal-bhar ke liye ZYAADA load daal sakta hai ek barabar route se jismein bilkul koi caching nahi hai?',
        a: 'A route with no caching at all sends exactly one database query per incoming request, and since real traffic naturally arrives spread out over time rather than in a single, perfectly simultaneous instant, this produces a roughly steady, evenly distributed rate of database queries matching the request rate itself — the database load at any given moment is proportional to however many requests happen to be arriving right then, with no artificial concentration. A cached route behaves very differently across its lifecycle: for nearly the entire duration of its TTL, it sends the database essentially zero queries at all, since almost every request is served directly from the cache. However, the moment the cache entry\'s TTL expires, every single request that happens to arrive within the following brief window — and the number of such requests scales directly with however much traffic the route receives — independently discovers a cache miss at nearly the same instant, and, without stampede protection, each one independently proceeds to query the database. This means the database, which had been receiving near-zero load from this route for the preceding several minutes, is suddenly hit with a concentrated burst of many identical, simultaneous queries within a span of milliseconds — a momentary spike in load that can be substantially higher than the steady, evenly-distributed rate the equivalent uncached route would have produced across that same brief window, precisely because the cached version had been "storing up" all of that request volume with no corresponding database work until the exact instant it all discharges at once.',
        aHi: 'Bilkul koi caching na hone wala ek route prati aati request bilkul ek database query bhejta hai, aur kyunki asli traffic naisargik taur par waqt ke saath phaila hua aata hai ek akele, poori tarah ek-saath-hue pal ke bajaye, ye lagbhag ek sthir, samaan taur par baanti hui database queries ki dar paida karta hai jo request dar se hi milti hai — kisi bhi diye pal par database load us baat ke anupaat mein hai ki us waqt kitni requests aa rahi hain, koi kritrim concentration bina. Ek cached route apni poori umar mein bahut alag vyavhaar karta hai: apni TTL ki lagbhag poori avdhi ke liye, ye database ko lagbhag zero queries hi bhejta hai, kyunki lagbhag har request seedha cache se serve hoti hai. Halaanki, cache entry ki TTL expire hote hi, agli chhoti window mein aati har akeli request — aur aisi requests ki tadaad seedhe taur par is baat se scale karti hai ki route ko kitna traffic milta hai — independently lagbhag usi pal ek cache miss dhoondhti hai, aur, bina stampede protection ke, har ek independently database ko query karne aage badhti hai. Iska matlab hai database, jise pichhle kai minuton se is route se lagbhag-zero load mil raha tha, achaanak milliseconds ki ek avdhi mein kai identical, ek-saath queries ke ek concentrate hue burst se maara jaata hai — load mein ek pal-bhar ki spike jo barabar bina-cache wale route se us hi chhoti window mein paida hui sthir, samaan-taur-par-phaili dar se kaafi zyaada ho sakti hai, theek isliye kyunki cached version wo poori request volume "jama" kar raha tha koi barabar database kaam ke bina jab tak wo bilkul usi pal ek saath discharge nahi hota.',
      },
      {
        q: 'How does the SET NX Redis command actually guarantee that only one of many simultaneous requests successfully acquires the lock?',
        qHi: '\`SET NX\` Redis command asal mein kaise guarantee karta hai ki kai ek-saath requests mein se sirf ek hi safaltapoorvak lock paati hai?',
        a: 'Redis, in its default configuration, processes commands one at a time, in a single sequential order, even when many separate client requests arrive at essentially the same moment — this is a fundamental property of how Redis itself is designed to operate, ensuring that any single command is always executed atomically, as one indivisible operation, with no possibility of two commands\' effects becoming interleaved or overlapping partway through. The NX flag on a SET command instructs Redis to only actually perform the set operation if the specified key does not currently exist, and to report whether the operation succeeded or was skipped. Because Redis processes this check-and-set operation as a single, atomic unit, and because Redis processes all incoming commands strictly one at a time regardless of how many arrived simultaneously, only the very first SET NX command Redis actually gets around to processing will find the key genuinely absent and succeed in setting it — by the time Redis processes the second, third, and every subsequent SET NX command for that same key, even if all of them arrived at the client library level at virtually the same instant, the key already exists from the first command\'s success, so every one of those later commands correctly fails to set it and reports that the key was already present. This atomic, strictly-ordered processing is precisely what guarantees exactly one request\'s lock-acquisition attempt succeeds no matter how many hundreds of requests attempt the exact same command at what appears, from the requests\' own perspective, to be the same instant.',
        aHi: 'Redis, apni default configuration mein, commands ko ek waqt mein ek, ek akele kramik kram mein process karta hai, chahe kai alag client requests lagbhag usi pal aayein — ye Redis khud ke kaam karne ke tarike ka ek buniyaadi property hai, sunishchit karte hue ki koi bhi akela command hamesha atomically execute hota hai, ek na-todi jaa sakne wali operation ki tarah, do commands ke asaron ke beech mein mile ya overlap hone ka koi mauka bina. \`SET\` command par \`NX\` flag Redis ko hidaayat deta hai ki set operation sirf tab asal mein kare jab batayi gayi key abhi maujood na ho, aur report kare ki operation safal hui ya skip hui. Kyunki Redis is check-and-set operation ko ek akele, atomic unit ki tarah process karta hai, aur kyunki Redis sab aati commands ko sakhti se ek waqt mein ek process karta hai chahe kitne bhi ek saath aayein, sirf pehla \`SET NX\` command jise Redis asal mein process karne ke liye pahunchta hai key ko sach mein absent paayega aur use set karne mein safal hoga — dusra, teesra, aur har baad wala \`SET NX\` command jab tak Redis usi key ke liye process karta hai, chahe wo sab client library level par lagbhag usi pal aaye hon, key pehle se maujood hai pehle command ki safalta se, isliye un baad wale commands mein se har ek sahi tarike se use set karne mein fail hota hai aur report karta hai ki key pehle se maujood thi. Ye atomic, sakhti-se-ordered processing bilkul wahi hai jo guarantee karta hai ki bilkul ek request ki lock-acquisition koshish safal hoti hai chahe kitni bhi sau requests bilkul wahi command try karein jo, requests ke apne nazariye se, bilkul wahi pal lagta hai.',
      },
      {
        q: 'Why is a permanent expiration on the lock itself (as opposed to no expiration at all) a genuinely important safety net, rather than an optional detail?',
        qHi: 'Lock par khud ek sthaayi expiration (bilkul koi expiration na hone ke muqable) ek sach mein zaruri safety net kyun hai, ek vaikalpik detail nahi?',
        a: 'The lock\'s intended lifecycle is short and self-limiting: a specific request acquires it, performs its work, and then explicitly deletes the lock itself once that work is complete, freeing the cache key to be recomputed again the next time it genuinely expires. This intended flow depends entirely on the request that acquired the lock actually reaching the point of explicitly deleting it — but any number of real, unavoidable failure scenarios can prevent that from happening: the process could crash partway through the computation, an unexpected exception could be thrown and not properly handled before reaching the deletion step, or the process could simply hang indefinitely due to some unrelated issue. If the lock key itself had no expiration of its own, any one of these failure scenarios would leave the lock permanently held forever, since nothing would ever delete it — every single subsequent request attempting to recompute this cache value would find the lock already present, conclude another request is already handling it, wait, and retry, only to find the same stuck lock again, indefinitely, meaning the cache value would never be recomputed again for as long as the application continues running, even though the actual value genuinely does need periodic refreshing. Giving the lock its own separate, independent expiration means that even in the worst case, where the request holding it fails to clean it up properly, the lock automatically releases itself after that fixed duration passes, allowing a subsequent request to acquire it fresh and successfully recompute the value — the lock\'s own TTL acts as an automatic recovery mechanism for exactly the failure scenarios that would otherwise leave the system permanently stuck.',
        aHi: 'Lock ka iraada kiya gaya lifecycle chhota aur khud-simit hai: ek khaas request use paati hai, apna kaam karti hai, aur phir wo kaam poora hote hi explicitly lock khud delete karti hai, cache key ko agli baar sach mein expire hone par dobara calculate hone ke liye khaali karte hue. Ye iraada kiya gaya flow poori tarah is baat par nirbhar karta hai ki lock paayi request asal mein use explicitly delete karne ke point tak pahunche — par kitne bhi asli, na-taale-jaa-sakne-waale fail-hone ke scenarios ise hone se rok sakte hain: process computation ke beech mein crash ho sakta hai, ek anaay-koshit exception throw ho sakta hai aur delete karne ke step tak pahunchne se pehle sahi tarike se sambhaala na jaaye, ya process bas kisi na-jude issue ki wajah se hamesha ke liye latak sakta hai. Agar lock key khud ki koi expiration nahi rakhti, in fail-hone ke scenarios mein se koi bhi lock ko hamesha ke liye pakda hua chhod dega, kyunki use kabhi kuch bhi delete nahi karega — is cache value ko dobara calculate karne ki koshish karti har akeli baad wali request lock ko pehle se maujood paayegi, nateeja nikaalegi ki koi doosri request pehle se ise sambhaal rahi hai, intezaar karegi, aur retry karegi, sirf wahi atka hua lock dobara paane ke liye, hamesha ke liye, matlab cache value ko application chalte rehne tak kabhi dobara calculate nahi kiya jaayega, chahe asli value ko sach mein niyamit taazgi chahiye. Lock ko apni alag, mustaqil expiration dena matlab hai ki sabse bure case mein bhi, jahan use rakhti request use sahi tarike se saaf karne mein fail hoti hai, lock apne aap us fixed duration guzarne ke baad khud ko release karta hai, ek baad wali request ko use taaza paane aur value ko safaltapoorvak dobara calculate karne dete hue — lock ka apna TTL bilkul un fail-hone ke scenarios ke liye ek automatic recovery mechanism ki tarah kaam karta hai jo warna system ko hamesha ke liye atka chhod dete.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken trending-products route with a short TTL (5 seconds, to make expiry easy to trigger repeatedly). Send 50 concurrent requests right as the TTL expires and count how many times the expensive query actually runs.',
        taskHi: 'Ek chhote TTL (5 second, expiry ko baar-baar trigger karna aasaan banaane ke liye) wala toota trending-products route banao. TTL expire hote hi 50 concurrent requests bhejo aur ginno mehengi query kitni baar asal mein chalti hai.',
        hint: 'Add a simple counter incremented inside the expensive query function itself, logged to the console, to directly see how many times it actually executes during the burst.',
        hintHi: 'Mehengi query function ke andar hi ek saadha counter jodo jo badhta hai, console mein log hua, seedha dekhne ke liye ye burst ke dauraan kitni baar asal mein chalta hai.',
      },
      {
        task: 'Fix it with the SET NX lock pattern. Repeat the same 50-concurrent-requests-at-expiry test and confirm the expensive query now runs exactly once.',
        taskHi: '\`SET NX\` lock pattern se theek karo. Wahi 50-concurrent-requests-expiry-par test dohraao aur confirm karo mehengi query ab bilkul ek baar chalti hai.',
        hint: 'Log which specific request acquired the lock (vs. which ones waited and retried) to directly observe the coordination happening between concurrent requests.',
        hintHi: 'Log karo kaunsi khaas request ne lock paaya (versus kaunsi intezaar aur retry ki) seedha concurrent requests ke beech ho rahi coordination dekhne ke liye.',
      },
      {
        task: 'Deliberately simulate a crash by throwing an error right after acquiring the lock but before deleting it. Confirm the lock automatically releases after its own EX duration passes, and that a subsequent request can then successfully acquire it and recompute the value.',
        taskHi: 'Jaan-boojhkar ek crash simulate karo ek error throw karke lock paane ke theek baad par use delete karne se pehle. Confirm karo lock apni khud ki \`EX\` duration guzarne ke baad apne aap release hota hai, aur ek baad wali request phir safaltapoorvak use paa sakti hai aur value dobara calculate kar sakti hai.',
        hint: 'Set the lock\'s EX to something short (like 3 seconds) during this specific test so you do not have to wait long to observe the automatic release.',
        hintHi: 'Is khaas test ke dauraan lock ki \`EX\` ko kuch chhota set karo (jaise 3 second) taaki tumhe apne aap release dekhne ke liye lambi der intezaar na karna pade.',
      },
    ],

    keyTakeaways: [
      'The basic cache-aside pattern has a hidden failure mode under real concurrent traffic: every request arriving in the brief window right after a popular key expires independently misses the cache and independently recomputes the same value at once.',
      'This "cache stampede" can momentarily place more load on the database than having no cache at all, since the cached version concentrates a burst of duplicate queries into a single instant rather than spreading them evenly over time.',
      'A short-lived Redis lock (SET with NX and EX) ensures only one request is designated to recompute a value per expiration — every other concurrent request waits briefly and retries, typically finding a freshly populated cache instead.',
      'SET NX is atomic — Redis guarantees only one of many simultaneous attempts to set a not-yet-existing key can ever succeed, which is what makes the lock a genuine, reliable coordination mechanism.',
      'The lock\'s own expiration (EX) is a required safety net, not an optional detail — without it, a crashed or hung request holding the lock would permanently block that cache key from ever being recomputed again.',
      'Not every cache key needs this protection — it is worth the added complexity specifically for keys read by enough concurrent traffic that multiple requests are likely to collide within the same brief window at expiry.',
    ],
    keyTakeawaysHi: [
      'Basic cache-aside pattern mein asli concurrent traffic ke neeche ek chhupi hui fail-hone ki tarah hai: ek popular key expire hone ke theek baad wali chhoti window mein aati har request independently cache miss karti hai aur independently wahi value ek saath dobara calculate karti hai.',
      'Ye "cache stampede" pal-bhar ke liye database par bina-cache-ke se zyaada load daal sakta hai, kyunki cached version duplicate queries ke ek burst ko ek pal mein concentrate karta hai unhe waqt ke saath samaan taur par phailaane ke bajaye.',
      'Ek chhoti-umar wala Redis lock (\`NX\` aur \`EX\` ke saath \`SET\`) sunishchit karta hai ki sirf ek request prati expiration ek value dobara calculate karne ke liye nishaanit hai — har doosri concurrent request thodi der intezaar karti hai aur retry karti hai, aam taur par ek taaza bhari cache paati hui.',
      '\`SET NX\` atomic hai — Redis guarantee karta hai ki ek abhi-tak-na-maujood key set karne ki kai ek-saath koshishon mein se sirf ek hi kabhi safal ho sakti hai, jo lock ko ek asli, bharosemand coordination mechanism banaata hai.',
      'Lock ki apni expiration (\`EX\`) ek zaruri safety net hai, koi vaikalpik detail nahi — bina iske, lock rakhti ek crash hui ya latki request us cache key ko hamesha ke liye dobara-calculate-hone se rokegi.',
      'Har cache key ko is protection ki zarurat nahi — ye khaas taur par un keys ke liye jodi gayi complexity ke laayak hai jinhe itni concurrent traffic padhti hai ki kai requests ke expiry ke bilkul usi chhoti window mein takraane ki sambhaavna ho.',
    ],
  },
];
