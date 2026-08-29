/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 10.
 *
 * Concurrency limiting and load shedding: why rate limiting (Module 4,
 * throttling ONE client's request rate over time) does nothing to protect
 * a server from a genuine burst of MANY simultaneous, legitimate clients
 * all arriving at once — a traffic spike, a marketing link going out, a
 * feature suddenly going viral. Broken example: a route with no cap on how
 * many requests it processes concurrently — during a sudden burst, Node.js
 * happily accepts and begins processing every single incoming request at
 * once, exhausting the database connection pool (Module 3) and available
 * memory, degrading response times for ALL requests, including the ones
 * that would have succeeded fine under normal load, and often collapsing
 * the whole server rather than serving even a fraction of requests
 * successfully. Fixed by capping how many requests are processed
 * concurrently and immediately rejecting excess requests with 503 (load
 * shedding) rather than accepting unlimited work the server cannot
 * actually handle — serving a bounded, reliable subset of traffic well
 * instead of serving all of it badly.
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

export const NODE_MODULE_7_PART10: CourseLesson[] = [
  {
    slug: 'concurrency-limiting-load-shedding',
    title: 'Concurrency Limiting and Load Shedding: Surviving a Traffic Burst',
    titleHi: 'Concurrency Limiting Aur Load Shedding: Ek Traffic Burst Se Bachna',
    description: 'A marketing email goes out to 50,000 people at once — and within thirty seconds, the entire server grinds to a halt, failing every single request, including the ones from users who would have been served instantly under normal conditions.',
    descriptionHi: 'Ek marketing email ek saath 50,000 logon ko jaati hai — aur tees seconds ke andar, poora server ruk jaata hai, har akeli request fail karte hue, un users ki requests sameet jo normal sthiti mein turant serve ho jaate.',
    difficulty: 'HARD',
    duration: 22,
    order: 10,

    analogy: {
      en: '**A small restaurant kitchen that, the instant a bus of 200 tourists walks in, tries to start cooking all 200 orders simultaneously — versus one that seats the first 30 tables it can actually handle well and politely tells the rest there is a short wait, rather than a table at all right now.** A server accepting and beginning to process every single incoming request the moment it arrives, with no cap on how many it works on at once, is like a kitchen with four burners and two cooks that, faced with 200 orders arriving in the same instant, tries to start all 200 at the same time anyway — every burner is instantly overcommitted many times over, every cook is pulled in 200 directions, ingredients get grabbed and re-grabbed by multiple half-finished dishes, and the result is not 200 slow meals but a kitchen so overwhelmed that NOTHING comes out correctly, including the four or five orders that could have been cooked perfectly if the kitchen had simply started them one batch at a time. A kitchen run correctly instead recognizes its own real capacity — four burners, two cooks, a certain number of dishes it can genuinely have in progress at once — and the moment new orders exceed that capacity, immediately and politely turns additional orders away with "we\'re at capacity, please try again in a few minutes" rather than accepting an order it has no realistic way to actually cook well. This is not the kitchen failing more people than the first approach — it is the kitchen succeeding at exactly as many orders as it is actually capable of, cleanly and correctly, instead of accepting far more work than it can handle and producing a burnt, ruined result for everyone, including the customers who arrived first.',
      hi: '**Ek chhota restaurant kitchen jo, jis pal 200 tourists ki ek bus andar aati hai, koshish karta hai sab 200 orders ek saath pakaana shuru karne ki — versus ek jo pehli 30 tables baithaata hai jinhe wo asal mein achhi tarah handle kar sakta hai aur baaki ko vinamrata se batata hai ki thoda intezaar hai, abhi bilkul koi table nahi.** Ek server jo har aati request ko aate hi accept aur process karna shuru kar deta hai, kitne ek saath kaam karega uspar koi seemaa bina, aise hai jaise ek kitchen jismein chaar burners aur do cooks hain jo, 200 orders ek hi pal aane par, phir bhi sab 200 ko ek saath shuru karne ki koshish karta hai — har burner turant kai guna overcommitted ho jaata hai, har cook 200 disha mein khinch jaata hai, ingredients kai adhoore dishes dwara pakde aur dobara-pakde jaate hain, aur nateeja 200 dheeme meals nahi balki ek aisi kitchen hai jo itni overwhelmed hai ki KUCH BHI sahi tarike se nahi banta, un chaar-paanch orders sameet jo poori tarah pakaaye jaa sakte the agar kitchen ne bas unhe ek batch mein shuru kiya hota. Ek sahi tarike se chalaayi kitchen iske bajaye apni asli kshamta pehchaanta hai — chaar burners, do cooks, ek khaas tadaad jitne dishes sach mein ek saath chal sakte hain — aur jis pal naye orders us kshamta se aage jaate hain, turant aur vinamrata se additional orders ko mana kar deta hai "hum kshamta par hain, kuch minuton mein dobara try karo" ek aisi order accept karne ke bajaye jise wo asal mein achhi tarah pakaane ka koi waastavik tarika nahi rakhta. Ye kitchen ke pehle tarike se zyaada logon ko fail karna nahi hai — ye kitchen ka bilkul utne orders mein safal hona hai jitni uski asli kshamta hai, saaf aur sahi tarike se, us se zyaada kaam accept karne ke bajaye jitna wo sambhaal sakta hai aur sabke liye ek jala, kharaab nateeja paida karne ke bajaye, pehle pahunchte customers sameet.',
    },

    simple: `**Start broken.** A route with no cap on how many requests it processes at the same time:

\`\`\`js
app.get("/products/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Under ordinary traffic — a few dozen requests a second, spread out naturally — this route works perfectly, following this course\'s earlier connection-pooling lesson exactly as intended. The problem is what happens during a genuine BURST: a marketing email lands in 50,000 inboxes at once, a link gets shared on a popular platform, or a feature suddenly goes viral, and a meaningful fraction of those people click through within the same few seconds. Node.js itself places no inherent limit on how many requests it begins processing concurrently — every single one of those thousands of near-simultaneous requests starts running its own copy of this route\'s logic at once, each one requesting a connection from the database pool (which, following this course\'s pooling lesson, has a fixed, limited size — say, 20 connections). With thousands of requests competing for 20 connections, nearly all of them sit waiting, the pool is entirely exhausted, and requests that would have completed in milliseconds under normal load now queue for seconds or fail outright with a pool-timeout error — and critically, this degradation affects EVERY request hitting the pool at that moment, including ones from ordinary, unrelated users browsing the site normally, who have nothing to do with the burst at all. Rate limiting (this course\'s earlier lesson) does not help here at all, since none of these individual clients is exceeding their own personal rate limit — the problem is the AGGREGATE, TOTAL number of simultaneous requests across every client combined, which a per-client limit was never designed to address.

**The fix: cap concurrent processing, and shed excess load immediately with 503**

\`\`\`js
let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req, res, next) {
  if (activeRequests >= MAX_CONCURRENT) {
    return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
  }

  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });

  next();
}

app.use(limitConcurrency);
\`\`\`

\`\`\`ts
let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req: Request, res: Response, next: NextFunction): void {
  if (activeRequests >= MAX_CONCURRENT) {
    res.status(503).json({ error: "Server is at capacity, please try again shortly" });
    return;
  }

  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });

  next();
}

app.use(limitConcurrency);
\`\`\`

This middleware tracks a single, simple running count of how many requests are CURRENTLY being processed at once — not how many a specific client has sent over time (rate limiting\'s concern), but how many are genuinely in flight across the entire application right now. Once that count reaches \`MAX_CONCURRENT\` (a number deliberately chosen based on what the application\'s actual downstream resources, like the 20-connection database pool, can genuinely support without themselves degrading), any additional incoming request is immediately rejected with \`503 Service Unavailable\` — explicitly telling the client the server is temporarily overloaded and to retry shortly, rather than being accepted and left to compete for already-exhausted resources. \`res.on("finish", ...)\` decrements the counter the instant each request actually completes, freeing up capacity for the next one. The result during the same 50,000-email burst: the first 100 concurrent requests are processed normally, at full speed, exactly as they would be under regular traffic, while everything beyond that capacity is turned away instantly and cleanly with a clear "try again shortly" — rather than every single request, including the first 100, being dragged down into a shared, server-wide collapse.`,

    simpleHi: `**Toote hue se shuru.** Ek route jismein koi seemaa nahi hai ki ye ek saath kitni requests process karta hai:

\`\`\`js
app.get("/products/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Aam traffic ke neeche — ek second mein kuch dazan requests, naisargik taur par phaili hui — ye route poori tarah theek kaam karta hai, is course ke pehle wale connection-pooling lesson ka bilkul iraade ke hisaab se palan karte hue. Samasya ye hai ki kya hota hai ek asli BURST ke dauraan: ek marketing email ek saath 50,000 inboxes mein aati hai, ek link ek popular platform par share hota hai, ya ek feature achaanak viral ho jaata hai, aur un logon ka ek maayne-rakhta hissa usi kuch seconds ke andar click karta hai. Node.js khud koi buniyaadi seemaa nahi rakhta ki wo ek saath kitni requests process karna shuru karta hai — un hazaaron lagbhag-ek-saath-hui requests mein se har akeli is route ki logic ki apni copy ek saath chalaana shuru karti hai, har ek database pool se ek connection maangte hue (jo, is course ke pooling lesson ka palan karte hue, ek fixed, seemit size rakhta hai — maano, 20 connections). Hazaaron requests jo 20 connections ke liye competition karti hain ke saath, lagbhag sab intezaar mein baithi rehti hain, pool poori tarah khatam ho jaata hai, aur requests jo normal load ke neeche milliseconds mein poori hoti thi ab seconds tak queue karti hain ya bilkul ek pool-timeout error ke saath fail hoti hain — aur bahut zaruri, ye dheemi rafttaar us pal pool ko chhuti HAR request ko asar karti hai, aam, na-judi users ki requests sameet jo site ko normal taur par browse kar rahe hain, jinka burst se koi lena-dena nahi. Rate limiting (is course ka pehle wala lesson) yahan bilkul madad nahi karta, kyunki inmein se koi bhi khaas client apni khud ki personal rate limit paar nahi kar raha — samasya har client mila kar AGGREGATE, KUL tadaad ki ek saath hui requests ki hai, jise ek prati-client seemaa ko sambhaalne ke liye kabhi design nahi kiya gaya tha.

**Fix: concurrent processing simit karo, aur turant 503 se extra load hataao (load shedding)**

\`\`\`js
let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req, res, next) {
  if (activeRequests >= MAX_CONCURRENT) {
    return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
  }

  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });

  next();
}

app.use(limitConcurrency);
\`\`\`

\`\`\`ts
let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req: Request, res: Response, next: NextFunction): void {
  if (activeRequests >= MAX_CONCURRENT) {
    res.status(503).json({ error: "Server is at capacity, please try again shortly" });
    return;
  }

  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });

  next();
}

app.use(limitConcurrency);
\`\`\`

Ye middleware ek saadha, akela chalta count track karta hai ki ABHI kitni requests ek saath process ho rahi hain — ye nahi ki ek khaas client ne waqt ke saath kitni bheji hain (rate limiting ki chinta), balki abhi poori application mein sach mein kitni in flight hain. Ek baar wo count \`MAX_CONCURRENT\` (ek sankhya jaan-boojhkar chuni gayi is aadhaar par ki application ke asli downstream resources, jaise 20-connection database pool, sach mein khud kharaab hue bina kya support kar sakte hain) tak pahunch jaaye, koi bhi additional aati request turant \`503 Service Unavailable\` se reject hoti hai — explicitly client ko batate hue ki server asthaayi taur par overloaded hai aur thodi der baad retry kare, accept hokar pehle-se-khatam-hue resources ke liye competition karne ke bajaye. \`res.on("finish", ...)\` counter ko turant kam karta hai jab har request asal mein poori hoti hai, agli ke liye kshamta khaali karte hue. Nateeja usi 50,000-email burst ke dauraan: pehli 100 concurrent requests normal taur par process hoti hain, poori raftaar par, bilkul jaise wo aam traffic ke neeche hotin, jabki us kshamta se aage har cheez turant aur saaf taur par ek saaf "thodi der baad try karo" ke saath vaapas bhej di jaati hai — har akeli request ke bajaye, pehli 100 sameet, ek shared, poore-server-wide gir jaane mein khinch jaane ke bajaye.`,

    content: `## Rate limiting vs. concurrency limiting: two genuinely different questions

\`\`\`
Rate limiting (Module 4): "has THIS specific client made too many
requests in a given time window?" — protects against one client abusing
the system (brute-force login, API scraping).

Concurrency limiting (this lesson): "are too many requests, from
ANY combination of clients, being processed AT THIS EXACT MOMENT?" —
protects the server's own finite resources from being overwhelmed,
regardless of which clients or how many different clients are involved.
\`\`\`

Rate limiting asks whether one specific client, identified individually, has exceeded a permitted request count over some window of time — it is fundamentally about an individual client\'s behavior. Concurrency limiting asks a completely different question that has nothing to do with any single client\'s identity at all: regardless of how many different, entirely legitimate clients are involved, is the TOTAL number of requests the server is processing at this exact instant more than its actual downstream resources (database connections, memory, CPU) can genuinely support? A burst of 50,000 different, entirely legitimate users, each making a single, perfectly reasonable request, passes every rate limit check individually — no one client is doing anything wrong — while still being capable of collectively overwhelming a server with finite capacity. This is precisely why concurrency limiting is a necessary, distinct layer of protection that rate limiting alone can never provide.

## Choosing MAX_CONCURRENT based on genuine downstream capacity, not a guess

\`\`\`js
// If the database pool holds a maximum of 20 connections, and each request
// typically uses one connection for its duration, a concurrency limit
// meaningfully higher than 20 provides little real protection for
// database-bound routes specifically
const pool = new Pool({ max: 20 });
const MAX_CONCURRENT = 20; // matched to the actual downstream constraint
\`\`\`

The specific value chosen for a concurrency limit should be grounded in a genuine understanding of what the application\'s actual downstream dependencies can support — following this course\'s connection-pooling lesson, if the database pool itself only supports 20 simultaneous connections, setting \`MAX_CONCURRENT\` to something far higher (500, say) for routes that each need a database connection provides little real protection, since the pool itself becomes the actual bottleneck well before the concurrency limit is ever reached. Different routes with different resource profiles may reasonably warrant different limits — a route doing only in-memory computation with no external dependency can safely tolerate a much higher concurrency limit than one making a slow, resource-intensive call to an external payment gateway.

## Load shedding is a deliberate choice: serving some requests well beats serving all of them badly

\`\`\`
Without concurrency limiting: 50,000 requests all begin processing at
once, the database pool exhausts, EVERY request (including the first
few, which had nothing wrong with them individually) degrades or fails.

With concurrency limiting: the first 100 requests succeed exactly as
they would under normal conditions; the remaining 49,900 receive an
immediate, clear 503 and can retry — a bounded, predictable outcome
instead of an unbounded, unpredictable collapse.
\`\`\`

"Load shedding" is the deliberate practice of intentionally rejecting some fraction of incoming requests, cleanly and immediately, specifically to protect the server\'s ability to correctly serve the requests it does accept. This can initially feel counterintuitive — deliberately saying "no" to a request the server might have technically been able to squeeze in — but the alternative this lesson\'s broken example demonstrates is worse in every practical sense: accepting unlimited work regardless of actual capacity does not mean every request eventually succeeds, slowly; past a certain point, it means every single request, including ones that arrived when the server still had real capacity, gets pulled down into a shared failure, often with the entire process becoming unresponsive rather than merely slow. A server that sheds excess load past its genuine capacity serves a smaller, but reliably successful, fraction of total traffic — a strictly better outcome for the overwhelming majority of users than an unbounded system that ultimately serves close to none of them correctly.

## Client-side handling: 503 with a Retry-After hint

\`\`\`js
if (activeRequests >= MAX_CONCURRENT) {
  res.set("Retry-After", "5"); // suggests waiting 5 seconds before retrying
  return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
}
\`\`\`

A \`503\` response can optionally include a \`Retry-After\` header, a standard HTTP mechanism suggesting how long the client should wait before attempting the same request again — well-behaved clients (and this course\'s earlier idempotency and retry-with-backoff lessons\' patterns) can use this hint to space out their retry, reducing the odds of the exact same burst simply repeating itself moments later as every rejected client retries simultaneously and immediately.`,

    contentHi: `## Rate limiting vs. concurrency limiting: do sach mein alag sawaal

\`\`\`
Rate limiting (Module 4): "kya IS khaas client ne ek diye waqt ki window
mein bahut zyaada requests ki hain?" — ek client ko system durupyog karne
se bachaata hai (brute-force login, API scraping).

Concurrency limiting (ye lesson): "kya bahut zyaada requests, KISI BHI
clients ke milaan se, IS BILKUL PAL par process ho rahi hain?" —
server ke apne seemit resources ko overwhelmed hone se bachaata hai,
kaunse clients ya kitne alag clients shaamil hain us se bekhabar.
\`\`\`

Rate limiting poochta hai kya ek khaas client, individually pehchaana, ek permit ki gayi request count paar kar chuka hai kisi waqt ki window mein — ye buniyaadi taur par ek akele client ke vyavhaar ke baare mein hai. Concurrency limiting ek poori tarah alag sawaal poochta hai jiska kisi akele client ki pehchaan se bilkul koi lena-dena nahi: chahe kitne bhi alag, poori tarah legitimate clients shaamil hon, kya server abhi bilkul is pal jitni requests process kar raha hai wo uske asli downstream resources (database connections, memory, CPU) sach mein support kar sakte hain us se zyaada hai? 50,000 alag, poori tarah legitimate users ka ek burst, har ek ek akela, poori tarah samajhdaari-bhara request kar raha, individually har rate limit check paas karta hai — koi akela client kuch bhi galat nahi kar raha — jabki abhi bhi ek server ko seemit kshamta ke saath milkar overwhelmed karne ki kshamta rakhte hue. Bilkul isi wajah se concurrency limiting protection ki ek zaruri, alag layer hai jise akela rate limiting kabhi nahi de sakta.

## \`MAX_CONCURRENT\` chunna asli downstream kshamta ke aadhaar par, koi guess nahi

\`\`\`js
// Agar database pool zyaada-se-zyaada 20 connections rakhta hai, aur har request
// aam taur par apni avdhi ke liye ek connection istemal karta hai, ek concurrency
// limit jo 20 se maayne-rakhta zyaada oonchi hai khaas taur par database-bound
// routes ke liye thoda hi asli protection deti hai
const pool = new Pool({ max: 20 });
const MAX_CONCURRENT = 20; // asli downstream constraint se milaayi hui
\`\`\`

Ek concurrency limit ke liye chuni khaas value ek sach mein samjhi hui baat par tiki honi chahiye ki application ki asli downstream dependencies kya support kar sakti hain — is course ke connection-pooling lesson ka palan karte hue, agar database pool khud sirf 20 ek-saath connections support karta hai, un routes ke liye \`MAX_CONCURRENT\` ko kuch kaafi zyaada oonchi (500, maano) set karna jinhe har ek ko ek database connection chahiye thoda hi asli protection deta hai, kyunki pool khud asli bottleneck ban jaata hai concurrency limit tak kabhi pahunchne se pehle. Alag resource profiles wale alag routes samajhdaari se alag limits maang sakte hain — ek route jo sirf in-memory computation karta hai koi bahari dependency bina ek zyaada oonchi concurrency limit surakshit taur par sehan kar sakta hai ek aisi ke muqable jo ek dheemi, resource-intensive call ek bahari payment gateway ko karta hai.

## Load shedding ek jaan-boojhkar choice hai: kuch requests ko achhi tarah serve karna sabko bekaar serve karne se behtar hai

\`\`\`
Concurrency limiting bina: 50,000 requests sab ek saath process hona
shuru karti hain, database pool khatam hota hai, HAR request (pehli kuch
sameet, jinmein individually kuch bhi galat nahi tha) kharaab hoti ya
fail hoti hai.

Concurrency limiting ke saath: pehli 100 requests bilkul waise safal
hoti hain jaise wo normal sthiti mein hotin; baaki 49,900 ko ek turant,
saaf \`503\` milta hai aur wo retry kar sakte hain — ek seemit,
anumaanit nateeja ek na-simit, anumaanit-na-hone-laayak girne ke bajaye.
\`\`\`

"Load shedding" jaan-boojhkar kuch hisse ki aati requests ko reject karne ki practice hai, saaf aur turant, khaas taur par server ki un requests ko sahi tarike se serve karne ki kshamta surakshit rakhne ke liye jo wo accept karta hai. Ye shuru mein ulta lag sakta hai — jaan-boojhkar ek request ko "nahi" kehna jise server technically shaayad sambhaal sakta tha — par is lesson ka toota example jo alternative dikhaata hai wo har practical maayne mein bura hai: bina asli kshamta ke, na-simit kaam accept karna iska matlab nahi hai ki har request aakhirkaar safal hoti hai, dheere-dheere; ek khaas point se aage, iska matlab hai har akeli request, un ke sameet jo pahunchi jab server ke paas abhi bhi asli kshamta thi, ek shared asafalta mein khinch jaati hai, aksar poora process bina-jawaab-diye ban jaata hai bas dheema hone ke bajaye. Ek server jo apni asli kshamta se aage extra load hataata hai kul traffic ka ek chhota, par bharosemand taur par safal, hissa serve karta hai — zyaadatar users ke liye ek behtar nateeja ek na-simit system se jo aakhirkaar unmein se lagbhag kisi ko bhi sahi tarike se serve nahi karta.

## Client-side handling: \`Retry-After\` hint ke saath \`503\`

\`\`\`js
if (activeRequests >= MAX_CONCURRENT) {
  res.set("Retry-After", "5"); // 5 second intezaar karne ka sujhaav
  return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
}
\`\`\`

Ek \`503\` response vaikalpik taur par ek \`Retry-After\` header shaamil kar sakta hai, ek standard HTTP mechanism jo sujhaata hai ki client ko wahi request dobara try karne se pehle kitni der intezaar karna chahiye — achhe-vyavhaar wale clients (aur is course ke pehle wale idempotency aur retry-with-backoff lessons ke patterns) is hint ka istemal apni retry ko phailaane ke liye kar sakte hain, is sambhaavna ko kam karte hue ki bilkul wahi burst kuch pal baad khud ko dohraaye jab har reject hui client ek saath aur turant retry kare.`,

    examples: [
      {
        title: 'Broken: no cap on concurrent processing — a burst exhausts the pool',
        titleHi: 'Toota: concurrent processing par koi seemaa nahi — ek burst pool khatam karta hai',
        code: `app.get("/products/:id", async (req, res, next) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
  res.json(result.rows[0]);
});
// 50,000 near-simultaneous requests all begin processing at once`,
        codeJs: `app.get("/products/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
// pool = new Pool({ max: 20 }) — with 50,000 concurrent requests,
// nearly all of them queue for one of only 20 connections`,
        codeTs: `app.get("/products/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the failure is
// entirely about the total concurrent load exceeding downstream
// capacity, not a type or logic error.`,
        output: `Ordinary traffic: fast, correct responses. A 50,000-request burst:
the database pool exhausts almost immediately, response times degrade
into seconds or outright failures, affecting every request hitting the
pool at that moment — including ones from unrelated, ordinary users.`,
        explain: 'Every request individually looks perfectly legitimate and passes any per-client rate limit — the problem is purely the aggregate, total number of requests being processed at the same instant, which nothing in this code bounds.',
        explainHi: 'Har request individually poori tarah legitimate dikhti hai aur kisi bhi prati-client rate limit ko paas karti hai — samasya poori tarah aggregate, us bilkul pal process ho rahi requests ki kul tadaad hai, jise is code mein kuch bhi seemit nahi karta.',
      },
      {
        title: 'Fixed: a concurrency cap sheds excess load with 503',
        titleHi: 'Theek: ek concurrency cap 503 se extra load hataata hai',
        code: `if (activeRequests >= MAX_CONCURRENT) {
  return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
}
activeRequests++;
res.on("finish", () => activeRequests--);`,
        codeJs: `let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req, res, next) {
  if (activeRequests >= MAX_CONCURRENT) {
    return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
  }
  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });
  next();
}

app.use(limitConcurrency);

app.get("/products/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `let activeRequests = 0;
const MAX_CONCURRENT = 100;

function limitConcurrency(req: Request, res: Response, next: NextFunction): void {
  if (activeRequests >= MAX_CONCURRENT) {
    res.status(503).json({ error: "Server is at capacity, please try again shortly" });
    return;
  }
  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });
  next();
}

app.use(limitConcurrency);

app.get("/products/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same 50,000-request burst: the first 100 requests process
normally at full speed, matched to what the 20-connection pool can
genuinely support with headroom; the remaining 49,900 receive an
immediate, clean 503 rather than degrading everyone's experience.`,
        outputTs: `// Identical behaviour. The middleware is registered globally via
// app.use(), applying the same concurrency cap across every route
// that follows it in the middleware chain.`,
        explain: 'The fix does not make the server faster — it bounds how much work it accepts at once, ensuring the requests it does accept are served reliably rather than everyone being dragged into a shared degradation.',
        explainHi: 'Fix server ko tez nahi banaata — ye simit karta hai ki ye ek saath kitna kaam accept karta hai, sunishchit karte hue ki jo requests ye accept karta hai wo bharosemand taur par serve hoti hain, har kisi ko ek shared kharaabi mein khinchne ke bajaye.',
      },
      {
        title: 'Choosing MAX_CONCURRENT to match actual downstream capacity',
        titleHi: '\`MAX_CONCURRENT\` ko asli downstream kshamta se milaakar chunna',
        code: `const pool = new Pool({ max: 20 });
const MAX_CONCURRENT = 20; // matched, not guessed at random`,
        codeJs: `const { Pool } = require("pg");
const pool = new Pool({ max: 20 });

let activeRequests = 0;
const MAX_CONCURRENT = 20; // matches the pool's own actual connection limit

function limitConcurrency(req, res, next) {
  if (activeRequests >= MAX_CONCURRENT) {
    res.set("Retry-After", "5");
    return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
  }
  activeRequests++;
  res.on("finish", () => activeRequests--);
  next();
}`,
        codeTs: `import { Pool } from "pg";
const pool = new Pool({ max: 20 });

let activeRequests = 0;
const MAX_CONCURRENT = 20;

function limitConcurrency(req: Request, res: Response, next: NextFunction): void {
  if (activeRequests >= MAX_CONCURRENT) {
    res.set("Retry-After", "5");
    res.status(503).json({ error: "Server is at capacity, please try again shortly" });
    return;
  }
  activeRequests++;
  res.on("finish", () => activeRequests--);
  next();
}`,
        outputJs: `A concurrency limit that matches the pool's own actual capacity means
requests are shed at exactly the point the database itself would
otherwise start becoming the bottleneck — not an arbitrary, disconnected
guess.`,
        outputTs: `// Identical behaviour. Retry-After tells well-behaved clients (and
// this course's earlier retry-with-backoff pattern) how long to wait
// before retrying, reducing the odds of an immediate repeat burst.`,
        explain: 'Setting the limit based on a genuine understanding of downstream capacity (here, the connection pool size) rather than an arbitrary number ensures the concurrency cap actually protects the resource that would otherwise be exhausted first.',
        explainHi: 'Limit ko downstream kshamta ki ek asli samajh ke aadhaar par set karna (yahan, connection pool size) ek manmaani sankhya ke bajaye sunishchit karta hai ki concurrency cap asal mein us resource ko surakshit karta hai jo warna pehle khatam hota.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/products/:id", async (req, res, next) => { /* no concurrency cap at all */ });
// a burst of legitimate traffic exhausts the database pool for everyone`,
        right: `app.use(limitConcurrency); // caps total simultaneous processing, sheds excess with 503
app.get("/products/:id", async (req, res, next) => { /* unchanged */ });`,
        why: 'Rate limiting alone does not protect against many different, individually legitimate clients arriving at once — only a concurrency cap bounds the total simultaneous load regardless of how many distinct clients are involved.',
        whyHi: 'Akela rate limiting kai alag, individually legitimate clients ke ek saath aane ke khilaaf protection nahi deta — sirf ek concurrency cap kul ek-saath load ko seemit karta hai, kitne alag clients shaamil hain us se bekhabar.',
      },
      {
        wrong: `const MAX_CONCURRENT = 5000; // an arbitrary, disconnected guess
const pool = new Pool({ max: 20 }); // the actual bottleneck is reached long before the concurrency cap`,
        right: `const pool = new Pool({ max: 20 });
const MAX_CONCURRENT = 20; // matched to what downstream resources can genuinely support`,
        why: 'A concurrency limit set far higher than what downstream resources (like the database pool) can support provides little real protection, since the actual resource exhausts well before the concurrency cap is ever reached.',
        whyHi: 'Ek concurrency limit jo downstream resources (jaise database pool) support kar sakte hain us se kaafi oonchi set ki gayi thoda hi asli protection deti hai, kyunki asli resource khatam hota hai concurrency cap tak kabhi pahunchne se kaafi pehle.',
      },
      {
        wrong: `// Silently dropping or hanging excess requests instead of responding at all
if (activeRequests >= MAX_CONCURRENT) {
  return; // never sends any response — the client waits indefinitely with no explanation`,
        right: `if (activeRequests >= MAX_CONCURRENT) {
  return res.status(503).json({ error: "Server is at capacity, please try again shortly" });
}
// clear, immediate, actionable feedback to the client`,
        why: 'A request that is silently dropped or left hanging, rather than explicitly rejected with 503, leaves the client with no clear signal to retry, appearing indistinguishable from a hung or crashed server.',
        whyHi: 'Ek request jise chupke se drop kiya jaaye ya latakne diya jaaye, \`503\` se explicitly reject karne ke bajaye, client ko retry karne ka koi saaf signal nahi deti, ek atke ya crash hue server se alag-nahi-pehchaani-jaane-laayak dikhte hue.',
      },
    ],

    realWorld: [
      {
        en: '**Load shedding is a well-established, standard resilience practice at major technology companies operating at real scale**, commonly cited alongside rate limiting and circuit breakers as one of the core techniques for surviving genuine traffic bursts without a total service collapse.',
        hi: '**Load shedding asli scale par chalti mukhya technology companies mein ek achhi tarah sthaapit, standard resilience practice hai**, aam taur par rate limiting aur circuit breakers ke saath ek asli traffic burst ko poori tarah service collapse ke bina jhelne ki mukhya techniques mein se ek ki tarah cite hoti hai.',
      },
      {
        en: '**A viral social media post, a popular newsletter, or a product launch causing a sudden, massive spike in legitimate traffic is one of the most commonly cited real-world scenarios production teams specifically design concurrency limits and load shedding to survive.**',
        hi: '**Ek viral social media post, ek popular newsletter, ya ek product launch jo legitimate traffic mein ek achaanak, bahut badi spike cause karta hai production teams ke sabse aam cite kiye jaane waale asli-duniya scenarios mein se ek hai jinhe jhelne ke liye wo khaas taur par concurrency limits aur load shedding design karti hain.**',
      },
      {
        en: '**Node.js middleware libraries specifically built for concurrency limiting (rather than rate limiting) are a recognized, distinct category of production tooling** — teams commonly reach for a dedicated library rather than hand-rolling the simple counter shown in this lesson once requirements grow more nuanced (per-route limits, priority queuing).',
        hi: '**Concurrency limiting ke liye khaas taur par bani Node.js middleware libraries (rate limiting ke bajaye) production tooling ki ek pehchaani gayi, alag category hain** — teams aam taur par ek dedicated library ki taraf jaati hain is lesson mein dikhaaya saadha counter haath se banaane ke bajaye ek baar zarooraten zyaada nuanced ban jaayein (prati-route limits, priority queuing).',
      },
    ],

    interviewQA: [
      {
        q: 'Why does rate limiting fail to protect a server from a burst of traffic caused by many different, entirely legitimate clients arriving at the same time?',
        qHi: 'Rate limiting ek server ko kai alag, poori tarah legitimate clients ke ek saath aane se paida hui traffic ki burst se surakshit karne mein kyun fail hota hai?',
        a: 'Rate limiting is fundamentally designed around tracking and constraining a single, specifically identified client\'s behavior over a window of time — it checks whether one particular IP address or account has made more requests than a configured threshold permits within some period, and rejects further requests from that SAME identified source once the threshold is exceeded. When a burst of traffic arrives from many entirely different, distinct clients simultaneously — a marketing email prompting thousands of separate individuals to click a link within the same few seconds, for instance — each individual client, considered in isolation, may be making only a single, entirely reasonable request, well within any per-client rate limit that might be configured. Rate limiting has no mechanism at all for looking across clients or considering the server\'s TOTAL aggregate load at a given moment; it only ever asks the question "has this one specific client exceeded its own limit," and every single client in this burst scenario correctly answers "no" to that question. The actual problem in this scenario is not that any individual client is misbehaving, but that the sheer combined VOLUME of many well-behaved clients, all arriving within the same brief window, exceeds what the server\'s finite downstream resources (database connections, memory, CPU) can genuinely support processing simultaneously — a question about aggregate, total concurrent load across every client combined, which is categorically different from the per-client question rate limiting is built to answer, and requires a separate mechanism (concurrency limiting) specifically designed to address it.',
        aHi: 'Rate limiting buniyaadi taur par ek akele, khaas taur par pehchaane gaye client ke vyavhaar ko waqt ki ek window ke aar-paar track aur seemit karne ke aas-paas design hua hai — ye check karta hai ki kya ek khaas IP address ya account ne kisi period ke andar ek configure ki gayi seemaa se zyaada requests ki hain, aur us seemaa paar hone ke baad us WAHI pehchaane gaye source se aur requests reject karta hai. Jab ek saath kai poori tarah alag, mustaqil clients se traffic ki ek burst aati hai — ek marketing email jo hazaaron alag insaanon ko usi kuch seconds ke andar ek link click karne ko prerit karta hai, misal ke taur par — har akela client, akele socha jaaye, shaayad sirf ek akela, poori tarah samajhdaari-bhara request kar raha ho, kisi bhi configure ki gayi prati-client rate limit ke andar poori tarah. Rate limiting ke paas clients ke aar-paar dekhne ya ek diye pal par server ka KUL aggregate load soch-samajhne ka bilkul koi mechanism nahi hai; ye kabhi sirf ye sawaal poochta hai "kya is ek khaas client ne apni khud ki seemaa paar ki hai," aur is burst scenario mein har akela client sahi tarike se us sawaal ka "nahi" jawaab deta hai. Is scenario mein asli samasya ye nahi hai ki koi akela client galat vyavhaar kar raha hai, balki ye ki kai achhe-vyavhaar wale clients ka bilkul milaayaa hua VOLUME, sab usi chhoti window ke andar aate hue, us se zyaada hai jo server ke seemit downstream resources (database connections, memory, CPU) sach mein ek saath process karna support kar sakte hain — aggregate, sabhi clients milaakar kul concurrent load ke baare mein ek sawaal, jo rate limiting ke sambhaalne ke liye bane prati-client sawaal se categorically alag hai, aur ise sambhaalne ke liye khaas taur par design kiya ek alag mechanism (concurrency limiting) chahiye.',
      },
      {
        q: 'Why is "accepting every request but letting all of them degrade" a worse outcome than "load shedding," deliberately rejecting some requests immediately once a concurrency cap is reached?',
        qHi: '"Har request accept karna par unhe sabko kharaab hone dena" "load shedding" se ek bura nateeja kyun hai, ek concurrency cap tak pahunchte hi jaan-boojhkar kuch requests turant reject karna?',
        a: 'Accepting every incoming request regardless of the server\'s actual capacity to process them means each accepted request begins competing with every other simultaneously accepted request for the same genuinely finite set of resources — database connections, available memory, CPU time. As the number of simultaneously competing requests grows well past what those resources can actually support, the time each individual request takes to complete does not simply grow proportionally; contention itself introduces additional overhead (requests waiting on locks, memory pressure triggering garbage collection pauses, connection pool exhaustion causing further queuing), meaning response times can degrade far more than linearly, and past a certain point, the system can become so overwhelmed that requests stop completing at all, or the process itself becomes unresponsive or crashes entirely. Critically, this degradation is not confined to only the "excess" requests beyond what the server could reasonably handle — it drags down EVERY request currently being processed, including the small number that arrived when the server genuinely did have capacity to serve them well and would have completed successfully if left undisturbed. Load shedding avoids this by drawing an explicit, deliberate line: once genuine capacity is reached, additional requests are rejected immediately and cleanly, at essentially no cost, rather than being accepted and then left to compete for resources that are already fully committed. The requests that are allowed through continue to be served exactly as well as they would be under normal, uncongested conditions, since they are never forced to share resources with more concurrent work than the server can actually support — the total number of requests served successfully may be numerically smaller than a theoretical best case where everything somehow succeeded, but it is dramatically larger, and far more predictable, than what an unbounded system produces once it collapses under genuine overload.',
        aHi: 'Server ki unhe process karne ki asli kshamta se bekhabar har aati request accept karna matlab hai har accept ki gayi request usi sach mein seemit resources ke set ke liye har doosri ek-saath accept hui request se competition karna shuru karti hai — database connections, upalabdh memory, CPU time. Jaise-jaise ek saath compete kar rahi requests ki tadaad us se kaafi zyaada badhti hai jo wo resources asal mein support kar sakte hain, har akeli request ko poora hone mein lagta waqt bas anupaat mein nahi badhta; competition khud additional overhead lele aata hai (locks par intezaar karti requests, memory pressure jo garbage collection pauses trigger karta hai, connection pool khatam hona jo aur queuing cause karta hai), matlab response times linearly se kaafi zyaada kharaab ho sakte hain, aur ek khaas point se aage, system itna overwhelmed ho sakta hai ki requests bilkul poori hona band kar deti hain, ya process khud bina-jawaab-diye ya poori tarah crash ho jaata hai. Bahut zaruri, ye kharaabi sirf "extra" requests tak seemit nahi hai jo server samajhdaari se sambhaal sakta tha us se aage — ye ABHI process ho rahi HAR request ko kheech ke neeche le jaati hai, us chhoti tadaad sameet jo tab aayi thi jab server ke paas sach mein unhe achhi tarah serve karne ki kshamta thi aur agar na chheda jaata to safaltapoorvak poori ho jaati. Load shedding ise ek explicit, jaan-boojhkar rekha kheenchkar bachaata hai: ek baar asli kshamta pahunch jaaye, additional requests turant aur saaf tarike se reject hoti hain, lagbhag koi keemat par nahi, accept hokar phir un resources ke liye compete karne ke bajaye jo pehle se poori tarah committed hain. Jo requests guzarne di jaati hain wo bilkul utni achhi tarah serve hoti rehti hain jitni wo normal, na-congested sthiti mein hotin, kyunki unhe kabhi us se zyaada concurrent kaam ke saath resources share karne majboor nahi kiya jaata jitna server asal mein support kar sakta hai — safaltapoorvak serve hui requests ki kul tadaad ek kalpaniya sabse achhe case se sankhyaatmak taur par chhoti ho sakti hai jahan sab kuch kisi tarah safal hota, par ye naatakiya taur par badi hai, aur kaafi zyaada anumaanit, us se jo ek na-simit system paida karta hai ek baar wo asli overload ke neeche gir jaaye.',
      },
      {
        q: 'Why should a concurrency limit\'s specific value be based on the actual capacity of downstream resources like a database connection pool, rather than an arbitrary large number?',
        qHi: 'Ek concurrency limit ki khaas value database connection pool jaisi asli downstream resources ki kshamta ke aadhaar par kyun hona chahiye, ek manmaani badi sankhya ke bajaye?',
        a: 'A concurrency limit\'s entire purpose is to prevent the server from accepting more simultaneous work than it can genuinely support without its actual resources becoming a bottleneck — this makes the limit\'s effectiveness entirely dependent on how it relates to those specific, real downstream constraints, rather than being a standalone number chosen in isolation. If a concurrency limit is set to a value far higher than what the actual constraining resource can support — allowing, say, 5,000 concurrent requests through while the database connection pool itself only supports 20 simultaneous connections — the concurrency limit provides essentially no real protection at all, because the pool itself becomes fully exhausted and begins causing the exact same degradation this lesson\'s broken example demonstrates, long before the concurrency cap\'s own threshold is ever reached. The concurrency limit, in this case, exists on paper but is functionally irrelevant, since the true bottleneck asserts itself first, unaffected by a limit set too loosely to matter. Setting the concurrency limit specifically in light of what the actual downstream resource can genuinely handle — matching or staying comfortably under the pool\'s own maximum connection count, for instance — ensures the concurrency limit is the mechanism that actually takes effect and prevents overload, rather than an ineffective, disconnected number that never meaningfully constrains anything before the real resource limit is hit regardless.',
        aHi: 'Ek concurrency limit ka poora maqsad server ko us se zyaada ek-saath kaam accept karne se rokna hai jitna wo asal mein apne asli resources ke bottleneck bane bina support kar sakta hai — ye limit ki asarkaarita ko poori tarah is baat par nirbhar banaata hai ki ye un khaas, asli downstream constraints se kaise judti hai, akele socha gaya ek alag sankhya hone ke bajaye. Agar ek concurrency limit ek aisi value par set ki jaati hai jo asli seemit karti resource support kar sakti hai us se kaafi zyaada oonchi hai — maano, 5,000 concurrent requests guzarne dete hue jabki database connection pool khud sirf 20 ek-saath connections support karta hai — concurrency limit asar mein bilkul koi asli protection nahi deti, kyunki pool khud poori tarah khatam ho jaata hai aur bilkul wahi kharaabi cause karna shuru karta hai jo is lesson ka toota example dikhaata hai, concurrency cap ki apni seemaa tak kabhi pahunchne se kaafi pehle. Concurrency limit, is case mein, kaagaz par maujood hai par functionally bemaani hai, kyunki asli bottleneck khud ko pehle zaahir karta hai, ek itni dheeli set ki gayi limit se bekhabar ki wo maayne rakhe. Concurrency limit ko khaas taur par is samajh mein set karna ki asli downstream resource sach mein kya sambhaal sakta hai — pool ki apni adhiktam connection count ke barabar rakhte hue ya aaraam se uske neeche, misal ke taur par — sunishchit karta hai ki concurrency limit wo mechanism hai jo asal mein lagu hota hai aur overload rokta hai, ek asarheen, na-judi sankhya ke bajaye jo asli resource limit chahe kuch bhi ho takraane se pehle kabhi kuch bhi maayne-rakhta seemit karta hi nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /products/:id route with a connection pool of max: 5 (to make exhaustion easy to trigger). Write a script sending 200 concurrent requests using Promise.all, and observe how many fail or time out.',
        taskHi: 'Toota \`/products/:id\` route banao \`max: 5\` wale ek connection pool ke saath (khaatm karna aasaan banaane ke liye). Ek script likho jo \`Promise.all\` istemal karke 200 concurrent requests bheje, aur dekho kitni fail hoti hain ya timeout hoti hain.',
        hint: 'Add a small artificial delay inside the route (a short setTimeout) to make the pool exhaustion window wider and easier to observe clearly.',
        hintHi: 'Route ke andar ek chhoti kritrim deri jodo (ek chhota \`setTimeout\`) pool exhaustion window ko chauda aur saaf dekhne mein aasaan banaane ke liye.',
      },
      {
        task: 'Add the limitConcurrency middleware with MAX_CONCURRENT set to match your pool size. Rerun the same 200-concurrent-request test and confirm the first batch succeeds while the rest receive a clean 503 instead of hanging or failing unpredictably.',
        taskHi: '\`limitConcurrency\` middleware jodo \`MAX_CONCURRENT\` apne pool size se milaate hue set kiya hua. Wahi 200-concurrent-request test dobara chalaao aur confirm karo pehla batch safal hota hai jabki baaki ek saaf \`503\` paate hain latakne ya anumaanit-na-hone-laayak fail hone ke bajaye.',
        hint: 'Count and log how many of the 200 requests received a 200 versus a 503, confirming the count of successful ones roughly matches your MAX_CONCURRENT setting.',
        hintHi: '200 requests mein se kitni \`200\` paati hain versus \`503\` ginno aur log karo, confirm karte hue ki safal hui ki tadaad lagbhag tumhaari \`MAX_CONCURRENT\` setting se milti hai.',
      },
      {
        task: 'Add a Retry-After header to the 503 response, and modify your test script to wait for that duration before retrying a rejected request. Confirm the retried requests now succeed once server load has settled.',
        taskHi: '\`503\` response mein ek \`Retry-After\` header jodo, aur apna test script badlo taaki ek reject hui request retry karne se pehle us duration ka intezaar kare. Confirm karo retry ki gayi requests ab safal hoti hain ek baar server load settle ho jaaye.',
        hint: 'Try retrying immediately (ignoring Retry-After) versus waiting for it, and compare the success rate of each approach.',
        hintHi: '\`Retry-After\` nazarandaaz karte hue turant retry karne ki koshish karo versus uska intezaar karne ki, aur har tarike ki safalta dar compare karo.',
      },
    ],

    keyTakeaways: [
      'Rate limiting protects against one specific client exceeding its own request rate over time; it does nothing to protect against many different, individually legitimate clients arriving simultaneously in a genuine traffic burst.',
      'Concurrency limiting caps the total number of requests being processed at the same instant, regardless of which or how many distinct clients are involved — a genuinely different protection from rate limiting.',
      'The specific concurrency limit chosen should be grounded in the actual capacity of downstream resources (like a database connection pool\'s max size), not an arbitrary number, or the real bottleneck is reached first regardless.',
      'Load shedding — immediately rejecting excess requests with 503 once capacity is reached — serves a smaller but reliably successful fraction of traffic, a strictly better outcome than accepting unlimited work and dragging every request into a shared degradation.',
      'A 503 response should be explicit and immediate, optionally including a Retry-After header, rather than silently dropping or hanging excess requests with no signal to the client.',
      'This is a distinct, necessary layer of resilience alongside rate limiting, caching, circuit breakers, and connection pooling — each protects against a different failure mode a real production system can encounter.',
    ],
    keyTakeawaysHi: [
      'Rate limiting ek khaas client ko waqt ke saath apni khud request rate paar karne se bachaata hai; ye kai alag, individually legitimate clients ke ek asli traffic burst mein ek saath aane se bachaane ke liye kuch nahi karta.',
      'Concurrency limiting us bilkul pal process ho rahi requests ki kul tadaad ko seemit karta hai, kaunse ya kitne alag clients shaamil hain us se bekhabar — rate limiting se ek sach mein alag protection.',
      'Chuni gayi khaas concurrency limit downstream resources ki asli kshamta mein tiki honi chahiye (jaise ek database connection pool ka max size), ek manmaani sankhya nahi, warna asli bottleneck chahe kuch bhi ho pehle pahuncha jaata hai.',
      'Load shedding — kshamta pahunchte hi turant \`503\` se extra requests reject karna — traffic ka ek chhota par bharosemand taur par safal hissa serve karta hai, ek strictly behtar nateeja na-simit kaam accept karne aur har request ko ek shared kharaabi mein kheenchne se.',
      'Ek \`503\` response explicit aur turant hona chahiye, vaikalpik taur par ek \`Retry-After\` header shaamil karte hue, extra requests ko chupke se drop ya latakne dene ke bajaye client ko koi signal bina.',
      'Ye rate limiting, caching, circuit breakers, aur connection pooling ke saath resilience ki ek alag, zaruri layer hai — har ek ek asli production system ko milne wale ek alag fail-hone ke tarike se bachaata hai.',
    ],
  },
];
