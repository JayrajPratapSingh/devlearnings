import type { TopicTricks } from './topics-tricks';

/**
 * Memory hooks — backend core (Node, Express, SQL, PostgreSQL).
 *
 * Same rules as the frontend files. Kept a little tighter than the TypeScript
 * set, because backend material is mostly *procedural* — the reader needs the
 * order of operations, not a re-explanation of the concept.
 *
 * Two spines run through this file, and both are reused rather than re-taught:
 *   · **"One doctor, two queues"** — the event loop image from JavaScript, which
 *     is also the answer to almost every Node concurrency question.
 *   · **"Validate at the door"** — the boundary rule, which covers validation,
 *     SQL injection, auth and env parsing in one idea instead of four.
 */
export const TRICKS_BACKEND: Record<string, TopicTricks> = {
  /* ════════════════════════════════ Node.js ═════════════════════════════════ */

  'node-runtime-and-event-loop': {
    tricks: `### 🍽️ "One waiter, many tables"

Node has **one** thread taking orders. It is not slow, because it never stands and waits — it takes your order, sends it to the kitchen, and immediately serves the next table.

**Say it:** *"One waiter, never waiting."*

That is why Node handles thousands of connections on one thread: almost all of them are waiting on a database or a disk, not on the CPU.

### 🧱 The one thing that ruins it

A **CPU-heavy loop** blocks the single thread, and every other request freezes behind it.

**Picture:** the waiter sat down to peel potatoes. Nobody else gets served.

**Say it:** *"Node is great at waiting, terrible at thinking."*

For real CPU work: a worker thread, a queue, or a different tool.

### 📌 The interview line

*"Node is single-threaded for **your** JavaScript, but I/O is handled by libuv's thread pool underneath."*

**Why this sticks:** it reuses the restaurant image you already built for the event loop. Reused hooks cost almost nothing to store and strengthen both ends of the link.`,
    tricksHi: `### 🍽️ "Ek waiter, kai tables"

Node ke paas order lene ke liye **ek** thread hai. Ye dheema isliye nahi hai kyunki wo khada ho kar intezaar hi nahi karta — order leta hai, rasoi mein bhejta hai, aur turant agli table par.

**Bolo:** *"Ek waiter, kabhi intezaar nahi."*

Isiliye Node ek thread par hazaaron connections sambhal leta hai: unme se lagbhag sab database ya disk ka intezaar kar rahe hote hain, CPU ka nahi.

### 🧱 Ek cheez jo sab bigaad deti hai

**CPU-bhaari loop** us ek thread ko rok deta hai, aur baaki har request uske peeche jam jati hai.

**Tasveer:** waiter aloo chheelne baith gaya. Ab kisi ko khana nahi milta.

**Bolo:** *"Node intezaar mein shandar hai, sochne mein bekaar."*

Asli CPU kaam ke liye: worker thread, queue, ya koi doosra tool.

### 📌 Interview wali line

*"**Aapka** JavaScript single-threaded hai, par I/O neeche libuv ke thread pool se hota hai."*

**Ye kyun tikta hai:** ye wahi restaurant wali tasveer dobara use karta hai jo event loop ke liye banayi thi. Dobara istemal hue hook lagbhag muft jama hote hain aur link ke dono sire mazboot karte hain.`,
  },

  'node-modules-commonjs-esm': {
    tricks: `### 🔄 "require is a phone call. import is a schedule."

- **CommonJS (\`require\`)** — happens **while** the code runs. You can call it inside an \`if\`.
- **ESM (\`import\`)** — resolved **before** anything runs. Must be at the top, always.

**Say it:** *"require asks now, import booked earlier."*

That single difference explains why you cannot conditionally \`import\`, and why \`await import()\` exists for when you genuinely need to.

### 🪤 The error everyone meets

**"Cannot use import statement outside a module"** → your file is being read as CommonJS.

Fix: \`"type": "module"\` in package.json, or rename the file \`.mjs\`.

**Say it:** *"Tell package.json which language you are speaking."*

### 📁 The ESM gotcha in Node

ESM needs the **file extension**: \`import './utils.js'\`, not \`'./utils'\`. Bundlers hide this; Node does not.

**Why this sticks:** phone call vs schedule is a *time-based* contrast, and the actual difference is also about time. When the metaphor's structure matches the fact's structure, you can re-derive the fact instead of recalling it.`,
    tricksHi: `### 🔄 "require ek phone call hai. import ek pehle se bana schedule."

- **CommonJS (\`require\`)** — code chalte **hue** hota hai. Ise \`if\` ke andar bhi bula sakte ho.
- **ESM (\`import\`)** — kuch chalne se **pehle** hi tay ho jata hai. Hamesha upar hona chahiye.

**Bolo:** *"require abhi poochhta hai, import pehle book ho chuka."*

Yahi ek farq samjha deta hai ki \`import\` shart par kyun nahi ho sakta, aur sach mein zaroorat par \`await import()\` kyun hai.

### 🪤 Wo error jo sabko milta hai

**"Cannot use import statement outside a module"** → aapki file CommonJS ki tarah padhi ja rahi hai.

Hal: package.json mein \`"type": "module"\`, ya file ka naam \`.mjs\`.

**Bolo:** *"package.json ko batao aap kaunsi bhasha bol rahe ho."*

### 📁 Node mein ESM ka pech

ESM ko **file extension** chahiye: \`import './utils.js'\`, \`'./utils'\` nahi. Bundlers ise chhupa lete hain; Node nahi.

**Ye kyun tikta hai:** phone call aur schedule ka farq *waqt* ka hai, aur asli farq bhi waqt ka hi hai. Jab upma ka dhaancha fact ke dhanche se milta hai, to fact yaad karne ki jagah dobara nikala ja sakta hai.`,
  },

  'node-streams-buffers': {
    tricks: `### 🥤 "Drink through a straw, do not swallow the bucket"

Reading a 2 GB file into memory crashes your server. Streaming it processes a cup at a time and uses almost no memory.

**Say it:** *"Streams sip. readFile gulps."*

### 🔧 The four types, chunked

- **Readable** — a tap
- **Writable** — a drain
- **Duplex** — a pipe with both (a socket)
- **Transform** — a filter in the middle (gzip)

**Say it:** *"Tap, drain, both, filter."*

### 🚰 Backpressure, in one sentence

If the drain is slower than the tap, the sink overflows. \`.pipe()\` handles this for you — it tells the tap to pause.

**That is the whole reason to use \`.pipe()\` instead of copying data by hand.**

### 📦 Buffer = raw bytes

A \`Buffer\` is bytes before anyone decided they were text. That is why you must say \`.toString('utf8')\` — you are choosing an interpretation.

**Why this sticks:** the sink overflowing is a *physical consequence* you can see. Abstract terms like "backpressure" become obvious the moment they are attached to water, because the intuition is already installed.`,
    tricksHi: `### 🥤 "Straw se piyo, balti mat nigal lo"

2 GB ki file memory mein padhna server crash kar deta hai. Stream karo to ek pyaali ek baar mein chalti hai aur memory lagbhag lagti hi nahi.

**Bolo:** *"Streams ghoont bharte hain. readFile nigalta hai."*

### 🔧 Chaar kism, chunk karke

- **Readable** — nal
- **Writable** — naali
- **Duplex** — dono wala pipe (socket)
- **Transform** — beech mein filter (gzip)

**Bolo:** *"Nal, naali, dono, filter."*

### 🚰 Backpressure, ek line mein

Naali nal se dheemi ho to sink bhar kar bah jata hai. \`.pipe()\` ye aapke liye sambhal leta hai — wo nal se ruk jaane ko kehta hai.

**Haath se data copy karne ki jagah \`.pipe()\` use karne ki poori wajah yahi hai.**

### 📦 Buffer = kachche bytes

\`Buffer\` wo bytes hain jinke baare mein abhi kisi ne tay nahi kiya ki ye text hain. Isiliye \`.toString('utf8')\` kehna padta hai — aap ek matlab chun rahe ho.

**Ye kyun tikta hai:** sink ka bahna ek *dikhne wala natija* hai. "Backpressure" jaise abstract shabd paani se judte hi saaf ho jate hain, kyunki samajh pehle se lagi hui hai.`,
  },

  'express-middleware': {
    tricks: `### 🛂 "Airport security lanes"

A request walks through checkpoint after checkpoint. Each one can:

- wave you through → \`next()\`
- stop you → \`res.send()\`
- hand you to the complaints desk → \`next(err)\`

**Say it:** *"Pass, stop, or complain."*

### 🔢 Order is everything

Middleware runs **top to bottom**. Put your auth check *after* the route and it never runs — the route already answered.

**Say it:** *"Security before the gate, not after."*

### 🪤 The two classic bugs

1. **Forgot \`next()\`** → the request hangs forever. No error, no response, just a spinner. This is the single most common Express bug.
2. **Error middleware needs four arguments** — \`(err, req, res, next)\`. Write three and Express treats it as normal middleware and never sends errors to it.

**Say it:** *"Four arguments or it is not an error handler."*

**Why this sticks:** a hanging request with no error is *maddening*, and frustration is a strong encoder. The rule arrives attached to a feeling.`,
    tricksHi: `### 🛂 "Airport ki security lanes"

Request ek ke baad ek checkpoint se guzarti hai. Har ek ya to:

- aage jaane de → \`next()\`
- rok de → \`res.send()\`
- shikayat counter par bhej de → \`next(err)\`

**Bolo:** *"Jaane do, roko, ya shikayat karo."*

### 🔢 Kram hi sab kuch hai

Middleware **upar se neeche** chalta hai. Auth ki jaanch route ke *baad* rakhi to wo kabhi chalegi hi nahi — route pehle hi jawab de chuka.

**Bolo:** *"Security gate se pehle, baad mein nahi."*

### 🪤 Do classic bug

1. **\`next()\` bhool gaye** → request hamesha ke liye latak jati hai. Na error, na jawab, bas ghoomta spinner. Express ka sabse aam bug yahi hai.
2. **Error middleware ko chaar argument chahiye** — \`(err, req, res, next)\`. Teen likho aur Express use aam middleware maan kar usme errors bhejta hi nahi.

**Bolo:** *"Chaar argument, warna wo error handler nahi."*

**Ye kyun tikta hai:** bina error ke latki hui request *pagal kar deti hai*, aur khijh mazboot encoder hai. Niyam ek ehsaas ke saath judkar aata hai.`,
  },

  'express-layering': {
    tricks: `### 🏢 "Reception → manager → filing cabinet"

Three layers, three jobs, and each only talks to the next:

- **Route/controller** — reception. Reads the request, sends the response. Knows nothing about the database.
- **Service** — the manager. All the business rules live here.
- **Repository** — the filing cabinet. Only knows how to fetch and store.

**Say it:** *"Reception, manager, cabinet."*

### 🎯 The test that tells you it is right

**Could you swap Express for a CLI without touching the service?**

If yes, your layers are clean. If the service reads \`req.body\`, they are not.

**Say it:** *"The manager should not know a website exists."*

### 💡 Why bother

Business logic in a route handler cannot be tested without starting a web server, cannot be reused by a cron job, and gets copy-pasted the moment a second endpoint needs it.

**Why this sticks:** the swap test is a *question you can run*, not a fact to recall. Rules you can test yourself are retained better, because every use is a rehearsal.`,
    tricksHi: `### 🏢 "Reception → manager → file ki almari"

Teen parten, teen kaam, aur har ek sirf agli se baat karti hai:

- **Route/controller** — reception. Request padhta hai, jawab bhejta hai. Database ke baare mein kuch nahi jaanta.
- **Service** — manager. Saare business ke niyam yahin rehte hain.
- **Repository** — file ki almari. Sirf laana aur rakhna jaanti hai.

**Bolo:** *"Reception, manager, almari."*

### 🎯 Wo jaanch jo batati hai ki sahi hai

**Kya aap service ko chhue bina Express ki jagah CLI laga sakte ho?**

Haan, to aapki parten saaf hain. Agar service \`req.body\` padh rahi hai, to nahi.

**Bolo:** *"Manager ko pata hi nahi hona chahiye ki koi website hai."*

### 💡 Faayda kya

Route handler mein pada business logic bina web server chalaye test nahi ho sakta, cron job dobara use nahi kar sakta, aur doosre endpoint ki zaroorat padte hi copy-paste ho jata hai.

**Ye kyun tikta hai:** swap wali jaanch ek *sawaal hai jo aap chala sakte ho*, yaad rakhne wala fact nahi. Jo niyam khud jaanche ja sakein wo behtar tikte hain, kyunki har istemal ek dohraav hai.`,
  },

  'express-validation': {
    tricks: `### 🚪 "Validate at the door. Trust inside the house."

The most important sentence in backend work, and it covers four things at once:

- request bodies
- query strings
- environment variables
- anything from another service

**Everything outside is a stranger. Everything inside has already been searched.**

### 📦 The parcel test

\`req.body as CreateOrder\` is **reading the label** on a stranger's parcel. It proves nothing.

\`Schema.parse(req.body)\` is **opening the box**.

### ✍️ Write it once

\`\`\`ts
const Schema = z.object({ qty: z.number().int().positive() });
type Body = z.infer<typeof Schema>;
\`\`\`

One description does both jobs — the runtime check *and* the type. They can never disagree, because there is only one of them.

**Say it:** *"Schema first, type derived."*

**Why this sticks:** the same parcel image appears in the TypeScript backend topic. Deliberate repetition across topics is *spaced rehearsal* — the same hook met twice, days apart, is what moves it into long-term storage.`,
    tricksHi: `### 🚪 "Darwaze par jaancho. Ghar ke andar bharosa karo."

Backend kaam ka sabse zaroori vaakya, aur ye ek saath chaar cheezein dhak leta hai:

- request bodies
- query strings
- environment variables
- doosri service se aayi har cheez

**Bahar ka sab ajnabi hai. Andar ka sab talashi de chuka hai.**

### 📦 Parcel wali jaanch

\`req.body as CreateOrder\` ajnabi ke parcel par **label padhna** hai. Ye kuch sabit nahi karta.

\`Schema.parse(req.body)\` **dibba kholna** hai.

### ✍️ Ek baar likho

\`\`\`ts
const Schema = z.object({ qty: z.number().int().positive() });
type Body = z.infer<typeof Schema>;
\`\`\`

Ek hulia dono kaam karta hai — runtime jaanch *aur* type. Ye alag ho hi nahi sakte, kyunki hai hi ek.

**Bolo:** *"Schema pehle, type usse."*

**Ye kyun tikta hai:** wahi parcel wali tasveer TypeScript backend topic mein bhi hai. Topics ke beech jaan-boojh kar dohraav *spaced rehearsal* hai — wahi hook do baar, kuch din ke faasle par, isi se lambe samay ki yaad banti hai.`,
  },

  'express-pagination-caching': {
    tricks: `### 📖 "Offset counts pages. Cursor remembers where you stopped."

- **offset/limit** — *"skip 2000 rows, give me 20"*. The database still walks those 2000 rows every time, so page 100 is slow.
- **cursor** — *"give me 20 after id 4051"*. Jumps straight there. Fast at any depth.

**Say it:** *"Offset walks, cursor jumps."*

### 🐛 The bug offset has and cursor does not

Someone inserts a row while the user is reading page 2. Everything shifts down one, and **one item appears twice** while another is never seen.

Cursor pagination cannot do this — it is anchored to a real row, not a count.

### 🗄️ Caching, in one line

**Cache what is read often and changes rarely.**

And the hard part, which is the actual interview question: *"how do you invalidate it?"* If you cannot answer that, you are not ready to add the cache.

**Say it:** *"Adding a cache is easy. Removing stale data is the job."*

**Why this sticks:** "offset walks, cursor jumps" is *rhythmic and physical*. Two verbs of movement encode the performance difference without any numbers to remember.`,
    tricksHi: `### 📖 "Offset page ginta hai. Cursor yaad rakhta hai aap ruke kahan the."

- **offset/limit** — *"2000 rows chhodo, 20 do"*. Database har baar wo 2000 rows chalta hai, isliye page 100 dheema hai.
- **cursor** — *"id 4051 ke baad ke 20 do"*. Seedha wahan kood jata hai. Kitni bhi gehrai par tez.

**Bolo:** *"Offset chalta hai, cursor koodta hai."*

### 🐛 Wo bug jo offset mein hai aur cursor mein nahi

User page 2 padh raha hai aur koi nayi row daal deta hai. Sab ek jagah khisak jate hain, aur **ek cheez do baar** dikhti hai jabki doosri kabhi nahi.

Cursor pagination ye kar hi nahi sakta — wo asli row par tika hai, ginti par nahi.

### 🗄️ Caching, ek line mein

**Jo baar-baar padha jaye aur kam badle, use cache karo.**

Aur mushkil hissa, jo asli interview sawaal hai: *"ise invalidate kaise karoge?"* Iska jawab nahi hai to aap cache jodne ke liye taiyar nahi ho.

**Bolo:** *"Cache jodna aasan hai. Purana data hatana asli kaam hai."*

**Ye kyun tikta hai:** "offset chalta hai, cursor koodta hai" *laydaar aur sharirik* hai. Do harkat wale kriya performance ka farq bina kisi number ke jama kar dete hain.`,
  },

  /* ══════════════════════════════════ SQL ═══════════════════════════════════ */

  'sql-select-where-order': {
    tricks: `### 📜 "SQL runs in a different order than you write it"

You **write**: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT

It **runs**: FROM → WHERE → GROUP BY → HAVING → **SELECT** → ORDER BY → LIMIT

**Notice SELECT is almost last.** That one fact explains two errors that otherwise make no sense:

- You **cannot** use a column alias in \`WHERE\` — \`WHERE\` ran before \`SELECT\` invented it
- You **can** use it in \`ORDER BY\` — that runs after

**Say it:** *"FROM first, SELECT nearly last."*

### 🕳️ NULL is not a value, it is a question mark

\`WHERE status = NULL\` returns **nothing**, ever. Not an error — just silence.

Why: NULL means *unknown*. "Is unknown equal to unknown?" is itself unknown, which is not true, so no row matches.

**Say it:** *"NULL needs IS, not =."*

**Why this sticks:** the execution-order fact is a *hub* — one piece of knowledge that resolves several unrelated-looking errors. Hubs are worth far more per unit of effort than isolated rules.`,
    tricksHi: `### 📜 "SQL us kram mein nahi chalta jis kram mein aap likhte ho"

Aap **likhte ho**: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT

Wo **chalta hai**: FROM → WHERE → GROUP BY → HAVING → **SELECT** → ORDER BY → LIMIT

**Dekho SELECT lagbhag aakhir mein hai.** Yahi ek baat wo do errors samjha deti hai jo warna bemaani lagte hain:

- Aap \`WHERE\` mein column alias **nahi** use kar sakte — \`WHERE\` us se pehle chala jab \`SELECT\` ne wo naam banaya hi nahi tha
- \`ORDER BY\` mein **kar sakte ho** — wo baad mein chalta hai

**Bolo:** *"FROM pehle, SELECT lagbhag aakhir mein."*

### 🕳️ NULL value nahi, sawaaliya nishaan hai

\`WHERE status = NULL\` **kabhi kuch nahi** lautata. Error nahi — bas khamoshi.

Kyun: NULL ka matlab hai *pata nahi*. "Kya pata-nahi, pata-nahi ke barabar hai?" khud pata nahi hai, jo true nahi hai, isliye koi row nahi milti.

**Bolo:** *"NULL ko IS chahiye, = nahi."*

**Ye kyun tikta hai:** execution order ka fact ek *hub* hai — ek jaankari jo kai alag-alag dikhte errors suljha deti hai. Hub ki keemat alag-thalag niyamon se kahin zyada hai.`,
  },

  'sql-joins': {
    tricks: `### 🤝 "INNER keeps matches. LEFT keeps everyone on the left."

That is 90% of joins, in one line.

- **INNER** — only rows that matched
- **LEFT** — every row from the left table, with \`NULL\` where nothing matched
- **RIGHT** — same, mirrored (rare — just flip the tables and use LEFT)
- **FULL** — everything from both sides

**Say it:** *"Inner = intersection. Left = keep my list."*

### 🎯 The question that picks the join for you

*"Do I want customers **with** orders, or **all** customers including those with none?"*

- with → INNER
- all → LEFT

### 🪤 The trap that catches everyone

\`\`\`sql
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'PAID'     -- ← silently becomes an INNER JOIN
\`\`\`

Filtering the right table in \`WHERE\` throws away the \`NULL\` rows — which were the whole point of the LEFT JOIN. Put that condition in the \`ON\` clause instead.

**Say it:** *"Filter the right table in ON, not WHERE."*

**Why this sticks:** this bug is *invisible* — the query runs and returns plausible data. Silent wrongness is worth encoding harder than anything that throws an error, because nothing else will tell you.`,
    tricksHi: `### 🤝 "INNER mel rakhta hai. LEFT baayein wale sabko rakhta hai."

Joins ka 90% yahi ek line hai.

- **INNER** — sirf wo rows jinka mel hua
- **LEFT** — baayein table ki har row, aur jahan mel nahi wahan \`NULL\`
- **RIGHT** — wahi, ulta (kam use hota hai — tables palat kar LEFT hi likh lo)
- **FULL** — dono taraf ka sab

**Bolo:** *"Inner = milan. Left = meri list bachi rahe."*

### 🎯 Wo sawaal jo join khud chun deta hai

*"Mujhe wo customers chahiye **jinke** orders hain, ya **saare** customers un samet jinke koi nahi?"*

- jinke → INNER
- saare → LEFT

### 🪤 Wo trap jo sabko pakadta hai

\`\`\`sql
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'PAID'     -- ← chupchaap INNER JOIN ban gaya
\`\`\`

\`WHERE\` mein daayein table par filter lagane se \`NULL\` rows nikal jati hain — aur LEFT JOIN ka poora maqsad wahi tha. Wo shart \`ON\` mein rakho.

**Bolo:** *"Daayein table ka filter ON mein, WHERE mein nahi."*

**Ye kyun tikta hai:** ye bug *dikhta hi nahi* — query chalti hai aur theek-thaak data deti hai. Chupchaap galat hona kisi bhi error se zyada mazbooti se jama karna chahiye, kyunki aur koi aapko batayega nahi.`,
  },

  'sql-group-by-aggregates': {
    tricks: `### 🗂️ "GROUP BY makes piles. Aggregates measure each pile."

Sort the receipts into piles by customer, then count each pile. That is it.

### ⏰ WHERE vs HAVING — settled by timing

- **WHERE** filters **rows**, *before* the piles are made
- **HAVING** filters **piles**, *after*

**Say it:** *"WHERE before the pile, HAVING after."*

You cannot use \`COUNT(*)\` in \`WHERE\` — nothing has been counted yet. That is not an arbitrary restriction; it is a consequence of the order.

### 🕳️ The NULL trap in COUNT

- \`COUNT(*)\` — counts **rows**
- \`COUNT(column)\` — counts **non-NULL values** in that column

Different answers on the same data, and nobody notices until a report is wrong.

**Say it:** *"Star counts rows, column skips NULLs."*

**Why this sticks:** it *reuses* the SELECT-runs-late idea from the previous topic. Every rule you can derive from one you already know is a rule you do not have to store separately.`,
    tricksHi: `### 🗂️ "GROUP BY dher banata hai. Aggregate har dher naapte hain."

Rasidon ko customer ke hisaab se dheron mein baanto, phir har dher gino. Bas itna.

### ⏰ WHERE aur HAVING — waqt se tay

- **WHERE** **rows** chhaanta hai, dher banne se *pehle*
- **HAVING** **dher** chhaanta hai, *baad mein*

**Bolo:** *"WHERE dher se pehle, HAVING baad mein."*

Aap \`COUNT(*)\` ko \`WHERE\` mein use nahi kar sakte — abhi kuch gina hi nahi gaya. Ye bemaani rok nahi hai; ye kram ka natija hai.

### 🕳️ COUNT mein NULL ka trap

- \`COUNT(*)\` — **rows** ginta hai
- \`COUNT(column)\` — us column ki **non-NULL values** ginta hai

Ek hi data par alag jawab, aur kisi ko pata nahi chalta jab tak koi report galat na nikle.

**Bolo:** *"Star rows ginta hai, column NULL chhod deta hai."*

**Ye kyun tikta hai:** ye pichhle topic ka "SELECT baad mein chalta hai" wala vichaar *dobara* use karta hai. Jo niyam pehle se pata kisi cheez se nikal aaye, use alag se jama karne ki zaroorat hi nahi.`,
  },

  'sql-subqueries-cte': {
    tricks: `### 🪆 "A subquery is a query in brackets. A CTE is one with a name."

Same power. The difference is **readability**, and readability is the reason CTEs won.

\`\`\`sql
WITH paid_orders AS (SELECT ... )
SELECT * FROM paid_orders WHERE ...
\`\`\`

**Say it:** *"WITH turns nesting into steps."*

Three nested subqueries read inside-out and nobody can follow them. Three CTEs read top-to-bottom like a recipe.

### 🐌 The performance trap

A **correlated** subquery — one that references the outer query — runs **once per row**. A thousand rows, a thousand executions.

**Picture:** you looked up one phone number, then walked back to the directory a thousand times instead of copying the page once.

Usually a JOIN does the same job in one pass.

**Say it:** *"Correlated means once per row."*

### 🔁 Recursive CTEs

\`WITH RECURSIVE\` walks trees — org charts, category hierarchies, comment threads. Worth knowing it exists; you will need it about twice a career, and both times you will be glad.

**Why this sticks:** "once per row" is a *count*, and counts are concrete. "Correlated subqueries can be inefficient" is vague and forgettable; "a thousand rows means a thousand runs" is neither.`,
    tricksHi: `### 🪆 "Subquery bracket mein ek query hai. CTE wahi hai naam ke saath."

Taakat barabar. Farq **padhne mein** hai, aur isi wajah se CTE jeete.

\`\`\`sql
WITH paid_orders AS (SELECT ... )
SELECT * FROM paid_orders WHERE ...
\`\`\`

**Bolo:** *"WITH nesting ko kadamon mein badal deta hai."*

Teen nested subquery andar se bahar padhni padti hain aur koi follow nahi kar pata. Teen CTE upar se neeche recipe ki tarah padhi jati hain.

### 🐌 Performance ka trap

**Correlated** subquery — jo bahar wali query ko reference kare — **har row par ek baar** chalti hai. Hazaar rows, hazaar baar.

**Tasveer:** aapne ek phone number dekha, phir panna ek baar copy karne ki jagah hazaar baar directory tak wapas chal kar gaye.

Aksar JOIN wahi kaam ek hi baar mein kar deta hai.

**Bolo:** *"Correlated matlab har row par ek baar."*

### 🔁 Recursive CTE

\`WITH RECURSIVE\` ped chalta hai — org chart, category hierarchy, comment threads. Itna jaanna kaafi hai ki ye hota hai; career mein do baar zaroorat padegi, aur dono baar khushi hogi.

**Ye kyun tikta hai:** "har row par ek baar" ek *ginti* hai, aur ginti thos hoti hai. "Correlated subquery dheemi ho sakti hai" dhundhla aur bhoolne layak hai; "hazaar rows matlab hazaar baar" dono nahi.`,
  },

  'sql-indexes': {
    tricks: `### 📕 "An index is the back of a book"

Without it, finding "photosynthesis" means reading all 800 pages. With it, you check the index and jump straight to page 412.

**Say it:** *"No index, read every page."*

### ⚖️ Why not index everything

Every index must be **updated on every write**, and it takes disk. Ten indexes means ten extra writes per insert.

**Say it:** *"Indexes make reads fast and writes slow."*

### 🔑 The composite-index rule that gets asked

An index on \`(a, b, c)\` can be used for:

- \`a\` ✅
- \`a, b\` ✅
- \`a, b, c\` ✅
- \`b\` alone ❌
- \`b, c\` ❌

**Picture:** it is a phone book sorted by surname, then first name. You can find all the Sharmas. You cannot find all the Rahuls.

**Say it:** *"Left to right, no skipping."*

### 🚫 What kills an index

Wrapping the column in a function: \`WHERE LOWER(email) = ...\` cannot use a plain index on \`email\`. The index stores the original, not the lowercased version.

**Why this sticks:** the phone book makes the left-to-right rule *obvious* rather than memorised. Reconstruct it from the image and you never need the list.`,
    tricksHi: `### 📕 "Index kitaab ke peeche ki suchi hai"

Uske bina "photosynthesis" dhoondhne ke liye 800 panne padhne padenge. Uske saath suchi dekho aur seedha panna 412.

**Bolo:** *"Index nahi, to har panna padho."*

### ⚖️ Har cheez par index kyun nahi

Har index ko **har write par update** karna padta hai, aur wo disk leta hai. Das index matlab har insert par das extra write.

**Bolo:** *"Index padhna tez karte hain, likhna dheema."*

### 🔑 Composite index ka wo niyam jo poochha jata hai

\`(a, b, c)\` par bana index in ke liye chalta hai:

- \`a\` ✅
- \`a, b\` ✅
- \`a, b, c\` ✅
- akela \`b\` ❌
- \`b, c\` ❌

**Tasveer:** ye pehle surname phir first name se sorted phone book hai. Aap saare Sharma dhoondh sakte ho. Saare Rahul nahi.

**Bolo:** *"Baayein se daayein, koodna nahi."*

### 🚫 Index kya maar deta hai

Column ko function mein lapetna: \`WHERE LOWER(email) = ...\` \`email\` par bane simple index ko use nahi kar sakta. Index asli value rakhta hai, lowercase wali nahi.

**Ye kyun tikta hai:** phone book baayein-se-daayein wale niyam ko *saaf* kar deti hai, ratne layak nahi rehta. Tasveer se dobara nikaal lo, list ki zaroorat hi nahi.`,
  },

  'sql-transactions-acid': {
    tricks: `### 💸 "The bank transfer"

Take ₹500 from A, add ₹500 to B. If the power cuts between those two steps, the money **must not vanish**.

That is why transactions exist. One sentence, and everyone already understands the stakes.

### 🔤 ACID, unpacked

- **A**tomic — all of it, or none of it
- **C**onsistent — the rules still hold afterwards
- **I**solated — other transactions do not see your half-finished work
- **D**urable — once committed, it survives a crash

**Say it:** *"All-or-nothing, rules hold, nobody peeks, survives the crash."*

Four beats, in order. Rhythm carries the acronym when the acronym alone will not.

### 👻 The three isolation problems, in order of nastiness

1. **Dirty read** — you saw something that was later rolled back
2. **Non-repeatable read** — you read the same row twice and got different values
3. **Phantom read** — you ran the same query twice and got a different *number of rows*

**Say it:** *"Dirty, changed, extra."*

**Why this sticks:** money is *emotionally weighted*. A transaction failing means someone's ₹500 disappeared, and the brain treats loss as far more significant than gain — so the stakes do the encoding work for you.`,
    tricksHi: `### 💸 "Bank transfer"

A se ₹500 lo, B mein ₹500 daalo. In do kadamon ke beech bijli chali jaye to paisa **gayab nahi hona chahiye**.

Transactions isiliye hain. Ek line, aur khatra sabko pehle se samajh aa jata hai.

### 🔤 ACID, khol kar

- **A**tomic — poora, ya bilkul nahi
- **C**onsistent — baad mein bhi niyam kayam
- **I**solated — doosre transactions aapka aadha kaam nahi dekhte
- **D**urable — commit ho gaya to crash bhi jhel jayega

**Bolo:** *"Poora-ya-kuch-nahi, niyam kayam, koi jhaankta nahi, crash jhelta hai."*

Chaar taal, kram se. Jab akela acronym kaam na kare tab laya use utha leti hai.

### 👻 Teen isolation samasyaayein, kharaabi ke kram mein

1. **Dirty read** — aapne wo dekha jo baad mein rollback ho gaya
2. **Non-repeatable read** — ek hi row do baar padhi aur alag values mili
3. **Phantom read** — ek hi query do baar chalayi aur *rows ki ginti* alag mili

**Bolo:** *"Ganda, badla, extra."*

**Ye kyun tikta hai:** paise ka *bhaavnaatmak wazan* hota hai. Transaction fail matlab kisi ke ₹500 gayab, aur dimaag nuksaan ko faayde se kahin zyada bada maanta hai — isliye khatra khud encoding ka kaam kar deta hai.`,
  },

  'sql-injection': {
    tricks: `### 💀 "Never glue user input into a query"

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");   // catastrophe
db.query('SELECT * FROM users WHERE email = $1', [email]);       // safe
\`\`\`

### 🔑 Why parameters actually work

It is not "escaping the dangerous characters". It is that the query and the data travel on **separate channels**. The database receives the query shape first, then the values — so a value can **never** become part of the command.

**Say it:** *"The query is the sentence. Parameters are never words in it."*

That distinction matters: people who think it is about escaping try to write their own escaping, and get it wrong.

### 🚨 The classic attack

Type \`' OR '1'='1\` into a login box. Glue that in and the WHERE clause becomes always-true — you are logged in as the first user in the table.

### 🛡️ Two more

- An ORM protects you **until** you use its raw-query escape hatch
- \`LIMIT\` and column names cannot be parameterised — use an **allow-list**, never string building

**Why this sticks:** it is a *heist story*. Narrative with a villain and a break-in is one of the strongest retention formats there is, which is why security stories outlive security rules.`,
    tricksHi: `### 💀 "User ka input query mein kabhi mat chipkao"

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");   // tabaahi
db.query('SELECT * FROM users WHERE email = $1', [email]);       // surakshit
\`\`\`

### 🔑 Parameters sach mein kaam kaise karte hain

Ye "khatarnaak akshar escape karna" nahi hai. Baat ye hai ki query aur data **alag raston** se jate hain. Database ko pehle query ka dhaancha milta hai, phir values — isliye koi value hukum ka hissa **kabhi** ban hi nahi sakti.

**Bolo:** *"Query vaakya hai. Parameters usme shabd kabhi nahi bante."*

Ye farq matter karta hai: jo log ise escaping samajhte hain wo apni escaping likhne lagte hain, aur galat karte hain.

### 🚨 Classic hamla

Login box mein \`' OR '1'='1\` likho. Use chipka do aur WHERE hamesha true ho jata hai — aap table ke pehle user ban kar login ho gaye.

### 🛡️ Do aur

- ORM tab tak bachata hai **jab tak** aap uska raw-query wala rasta na lo
- \`LIMIT\` aur column ke naam parameterise nahi ho sakte — **allow-list** use karo, string jodna kabhi nahi

**Ye kyun tikta hai:** ye ek *chori ki kahani* hai. Villain aur sendh wali kahani yaad rakhne ke sabse mazboot formats mein se ek hai, isiliye security ki kahaniyan security ke niyamon se zyada jeeti hain.`,
  },

  'db-normalization': {
    tricks: `### 📝 "Store a fact once"

That is normalisation. The rest is detail.

Put the customer's address in every order row and you have twenty copies. Change it, miss one, and now your database contains two different truths and no way to know which is right.

**Say it:** *"One fact, one place."*

### 🔢 The three forms, chunked into a rhyme

**"The key, the whole key, and nothing but the key."**

- **1NF** — one value per cell (no comma-separated lists)
- **2NF** — every column depends on the **whole** key, not half of it
- **3NF** — no column depends on another **non-key** column

That phrase is decades old, is quoted in interviews, and is genuinely all you need.

### ⚖️ When to deliberately break it

Denormalise for **read speed** — a cached total, a copied product name on an order so the invoice does not change when the price does.

That second one is not a shortcut; it is **correct**. An invoice must record the price *at the time of sale*.

**Say it:** *"Normalise until it hurts, denormalise until it works."*

**Why this sticks:** "the key, the whole key, and nothing but the key" is a *courtroom oath parody* — it rhymes, it escalates, and it is funny. All three are strong retention features.`,
    tricksHi: `### 📝 "Ek baat ek jagah rakho"

Yahi normalisation hai. Baaki sab tafseel hai.

Customer ka pata har order row mein rakho aur bees copies ban gayi. Ek badlo, ek chhoot jaye, aur ab database mein do alag sach hain aur ye jaanne ka koi tareeka nahi ki sahi kaun sa hai.

**Bolo:** *"Ek baat, ek jagah."*

### 🔢 Teen roop, ek tuk mein chunk karke

**"Key, poori key, aur key ke alawa kuch nahi."**

- **1NF** — har khaane mein ek value (comma se alag list nahi)
- **2NF** — har column **poori** key par nirbhar ho, uske aadhe par nahi
- **3NF** — koi column doosre **non-key** column par nirbhar na ho

Ye vaakya dashakon purana hai, interview mein bola jata hai, aur sach mein itna hi kaafi hai.

### ⚖️ Ise jaan-boojh kar kab todein

**Padhne ki raftaar** ke liye denormalise karo — cache kiya total, order par copy kiya product ka naam taaki daam badle to invoice na badle.

Doosra wala shortcut nahi hai; wo **sahi** hai. Invoice mein *bikri ke waqt ka* daam hi hona chahiye.

**Bolo:** *"Normalise karo jab tak dard na ho, denormalise karo jab tak chal na jaye."*

**Ye kyun tikta hai:** "key, poori key, aur key ke alawa kuch nahi" adaalat ki *kasam ki nakal* hai — ismein tuk hai, badhta kram hai, aur ye mazedaar hai. Teeno hi yaad rakhne ki mazboot khoobiyan hain.`,
  },

  /* ═══════════════════════════════ PostgreSQL ═══════════════════════════════ */

  'pg-why-postgres': {
    tricks: `### 🐘 "The elephant that does everything"

Postgres's pitch in one line: **a relational database that also does JSON, full-text search, geospatial, and arrays** — so you often do not need a second database.

**Say it:** *"One database, fewer moving parts."*

### 🆚 vs MySQL, honestly

Postgres is stricter about types, has richer features (window functions, CTEs, JSONB, real constraints), and its query planner is generally better on complex joins. MySQL has historically been simpler to operate and faster on very simple reads.

For a new project in 2025 the default is Postgres, and the honest reason is **fewer surprises**: it refuses bad data rather than quietly coercing it.

**Say it:** *"MySQL guesses, Postgres refuses."*

**Why this sticks:** the elephant is Postgres's actual logo, so the hook is attached to something you will see every time you open the docs — an environmental cue you cannot avoid.`,
    tricksHi: `### 🐘 "Wo haathi jo sab kuch karta hai"

Postgres ki baat ek line mein: **relational database jo JSON, full-text search, geospatial aur arrays bhi karta hai** — isliye aksar doosre database ki zaroorat hi nahi padti.

**Bolo:** *"Ek database, kam jhanjhat."*

### 🆚 MySQL se, imaandari se

Postgres types par zyada sakht hai, features zyada richer hain (window functions, CTE, JSONB, asli constraints), aur mushkil joins par uska planner aam taur par behtar hai. MySQL historically chalane mein simple raha hai aur bahut simple reads par tez.

2025 mein naye project ka default Postgres hai, aur imaandar wajah hai **kam chaunkna**: wo kharab data chupchaap badalne ki jagah mana kar deta hai.

**Bolo:** *"MySQL andaza lagata hai, Postgres mana karta hai."*

**Ye kyun tikta hai:** haathi Postgres ka asli logo hai, isliye hook us cheez se juda hai jo docs kholte hi har baar dikhegi — aisa cue jisse bacha nahi ja sakta.`,
  },

  'pg-data-types': {
    tricks: `### ⏰ "TIMESTAMPTZ, always"

The name lies: it does **not** store a timezone. It converts to UTC on write and back on read, so it always means one unambiguous moment.

Plain \`TIMESTAMP\` stores wall-clock text with no idea which clock. Two servers in different regions read the same row differently.

**Say it:** *"TZ or regret."*

This is the most common Postgres schema mistake, and it stays invisible until you have a user or a server in a second timezone — by which point every historical row is already wrong.

### 💰 Never FLOAT for money

\`0.1 + 0.2 ≠ 0.3\` in binary floating point. Use \`NUMERIC\` (arbitrary precision) or store paise as an integer.

**Say it:** *"Floats are for physics, not for rupees."*

### 📏 VARCHAR(n) vs TEXT

In Postgres they perform **identically**. \`VARCHAR(50)\` is a constraint, not an optimisation — use it when 50 is a real business rule, not to "save space". It saves none.

**Why this sticks:** "TZ or regret" rhymes and threatens. Threat plus rhyme is unusually sticky, and this is a mistake that genuinely cannot be fixed cheaply later.`,
    tricksHi: `### ⏰ "TIMESTAMPTZ, hamesha"

Naam jhoot bolta hai: ye timezone store **nahi** karta. Likhte waqt UTC mein badalta hai aur padhte waqt wapas, isliye iska matlab hamesha ek hi saaf pal hota hai.

Simple \`TIMESTAMP\` wall-clock text rakhta hai bina jaane kis ghadi ka. Alag regions ke do server wahi row alag padhte hain.

**Bolo:** *"TZ ya pachhtava."*

Ye Postgres schema ki sabse aam galti hai, aur tab tak chhupi rehti hai jab tak doosre timezone mein user ya server na aaye — aur tab tak har purani row galat ho chuki hoti hai.

### 💰 Paise ke liye FLOAT kabhi nahi

Binary floating point mein \`0.1 + 0.2 ≠ 0.3\`. \`NUMERIC\` use karo (jitni chahe precision) ya paise ko integer mein rakho.

**Bolo:** *"Float physics ke liye hain, rupaye ke liye nahi."*

### 📏 VARCHAR(n) aur TEXT

Postgres mein dono **bilkul barabar** chalte hain. \`VARCHAR(50)\` ek constraint hai, optimisation nahi — jab 50 asli business rule ho tab use karo, "jagah bachane" ke liye nahi. Wo kuch nahi bachata.

**Ye kyun tikta hai:** "TZ ya pachhtava" mein tuk bhi hai aur dhamki bhi. Dhamki aur tuk ka mel ajeeb tareeke se chipakta hai, aur ye wo galti hai jo baad mein sasta theek hoti hi nahi.`,
  },

  'pg-jsonb': {
    tricks: `### 🗃️ "JSONB is a filing drawer inside a filing cabinet"

Useful for genuinely variable data — per-category product attributes, webhook payloads stored as received.

**The rule that keeps you out of trouble:** anything you **filter, join or constrain on** should be a real column.

**Say it:** *"If you query it, column it."*

JSONB has no foreign keys, no NOT NULL on inner keys, and a typo in a key name **fails silently** instead of erroring. That silence is the danger.

### ➡️ The operator everyone gets wrong once

- \`->\` returns **JSON** → gives you \`"Delhi"\` **with quotes**
- \`->>\` returns **text** → gives you \`Delhi\`

**Say it:** *"Two arrows, no quotes."*

Comparing with \`->\` and wondering why nothing matches is a rite of passage.

### 📇 It is only fast if you index it

\`CREATE INDEX ... USING GIN (attrs)\` plus the containment operator \`@>\`. Without the GIN index, every JSONB query is a full table scan.

**Why this sticks:** "two arrows, no quotes" is *four syllables and rhythmic*, and it maps the visual shape of the operator (more arrows) to the result (less punctuation).`,
    tricksHi: `### 🗃️ "JSONB file ki almari ke andar ek daraz hai"

Sach mein badalte data ke liye kaam ka — per-category product attributes, jaise aaye waise rakhe webhook payloads.

**Wo niyam jo musibat se bachata hai:** jis par bhi **filter, join ya constraint** lage wo asli column hona chahiye.

**Bolo:** *"Query karte ho to column banao."*

JSONB mein foreign keys nahi, andar ki keys par NOT NULL nahi, aur key ke naam ka typo error dene ki jagah **chupchaap fail** hota hai. Wahi khamoshi khatra hai.

### ➡️ Wo operator jo har koi ek baar galat karta hai

- \`->\` **JSON** deta hai → \`"Delhi"\` **quotes ke saath**
- \`->>\` **text** deta hai → \`Delhi\`

**Bolo:** *"Do teer, quotes nahi."*

\`->\` se compare karke ye sochna ki kuch match kyun nahi ho raha, ek rasm hai.

### 📇 Ye tabhi tez hai jab index ho

\`CREATE INDEX ... USING GIN (attrs)\` aur containment operator \`@>\`. GIN index ke bina har JSONB query poori table ka scan hai.

**Ye kyun tikta hai:** "do teer, quotes nahi" *chhota aur laydaar* hai, aur operator ki shakal (zyada teer) ko natije (kam nishaan) se jod deta hai.`,
  },

  'pg-upsert-returning': {
    tricks: `### 🏁 "Check-then-insert is a race you will lose"

\`\`\`sql
-- Two requests both SELECT, both find nothing, both INSERT → one crashes
INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
\`\`\`

**Say it:** *"Two requests, one gap."*

Between your SELECT and your INSERT another request can slip in. It **never** happens in testing and **reliably** happens under load — which is the worst possible combination, because you ship it confidently.

### 🎁 EXCLUDED = "the row that would have been inserted"

That is how you reach the incoming values inside the update half.

**Say it:** *"EXCLUDED is the newcomer."*

### 📮 RETURNING saves a round trip

\`INSERT ... RETURNING id\` gives you the generated id **in the same query**. No second SELECT.

Worth making a habit — it is free, and it also works with UPDATE and DELETE.

**Why this sticks:** "never in testing, always under load" is a *sharp contradiction*, and contradictions are flagged by the brain as needing resolution — which means they get more processing, and more processing means better retention.`,
    tricksHi: `### 🏁 "Check-phir-insert ek race hai jo aap haaroge"

\`\`\`sql
-- Do requests dono SELECT karti hain, dono ko kuch nahi milta, dono INSERT → ek crash
INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
\`\`\`

**Bolo:** *"Do requests, ek gap."*

Aapke SELECT aur INSERT ke beech doosri request ghus sakti hai. Testing mein ye **kabhi** nahi hota aur load par **pakka** hota hai — aur yahi sabse bura mel hai, kyunki aap ise pooray bharose ke saath ship kar dete ho.

### 🎁 EXCLUDED = "wo row jo insert hone wali thi"

Update wale hisse mein aane wali values wahin se milti hain.

**Bolo:** *"EXCLUDED naya aaya hua hai."*

### 📮 RETURNING ek chakkar bachata hai

\`INSERT ... RETURNING id\` nayi id **usi query mein** de deta hai. Doosra SELECT nahi.

Ise aadat bana lo — ye muft hai, aur UPDATE aur DELETE ke saath bhi chalta hai.

**Ye kyun tikta hai:** "testing mein kabhi nahi, load par hamesha" ek *tez virodhabhas* hai, aur virodhabhas ko dimaag suljhane layak mark karta hai — matlab zyada processing, aur zyada processing matlab behtar yaad.`,
  },

  'pg-window-functions': {
    tricks: `### 🪟 "GROUP BY collapses. OVER() keeps every row."

That is the whole distinction, and it is the one interviewers probe.

- \`GROUP BY\` → 100 rows become 5 summary rows
- \`OVER()\` → 100 rows stay 100 rows, each with the summary **beside** it

**Say it:** *"Group crushes, window looks."*

### 🥇 The three ranking functions

Same data, ties handled differently — this is the classic question:

| Function | 100, 100, 90 → |
|---|---|
| \`ROW_NUMBER()\` | 1, 2, 3 — ties broken arbitrarily |
| \`RANK()\` | 1, 1, 3 — **skips** a number |
| \`DENSE_RANK()\` | 1, 1, 2 — no gap |

**Say it:** *"Row always counts, RANK leaves a gap, DENSE closes it."*

### 🎯 What it is genuinely for

Running totals, "top 3 per category", comparing each row to its group's average, month-on-month change.

**"Top N per group" is the interview question**, and window functions are the clean answer.

**Why this sticks:** the 100/100/90 table is a *worked example*, not a definition. Concrete numbers you can replay beat abstract descriptions every time.`,
    tricksHi: `### 🪟 "GROUP BY simet deta hai. OVER() har row rakhta hai."

Poora farq yahi hai, aur interview mein yahi kureda jata hai.

- \`GROUP BY\` → 100 rows se 5 summary rows
- \`OVER()\` → 100 rows 100 hi rehti hain, har ek ke **bagal mein** summary

**Bolo:** *"Group kuchalta hai, window dekhta hai."*

### 🥇 Teen ranking functions

Wahi data, ties alag tareeke se — classic sawaal yahi hai:

| Function | 100, 100, 90 → |
|---|---|
| \`ROW_NUMBER()\` | 1, 2, 3 — tie kaise bhi toota |
| \`RANK()\` | 1, 1, 3 — ek number **chhod deta hai** |
| \`DENSE_RANK()\` | 1, 1, 2 — koi gap nahi |

**Bolo:** *"Row hamesha ginta hai, RANK gap chhodta hai, DENSE use bhar deta hai."*

### 🎯 Ye sach mein kis liye hai

Running totals, "har category ke top 3", har row ko uske group ke average se milana, mahine-dar-mahine badlav.

**"Har group ke top N" interview sawaal hai**, aur window functions uska saaf jawab.

**Ye kyun tikta hai:** 100/100/90 wali table ek *chala hua udaharan* hai, definition nahi. Jin numbers ko aap dobara chala sakte ho wo abstract hulie ko har baar haraate hain.`,
  },

  'pg-indexes-advanced': {
    tricks: `### 🧰 "B-tree unless you have a reason"

- **B-tree** (default) — ranges, equality, sorting. 95% of cases.
- **GIN** — "is this **inside** that?" → JSONB, arrays, full-text search
- **GiST** — geometry and "near to"
- **BRIN** — enormous tables where rows are already in physical order (time-series logs). Tiny index, big win, very narrow use.

**Say it:** *"B-tree by default, GIN for inside-ness."*

### 🎯 Two that punch above their weight

**Partial index** — index only the rows you actually query:

\`\`\`sql
CREATE INDEX ON orders (created_at) WHERE status = 'PENDING';
\`\`\`

If 2% of orders are pending, this index is 2% of the size and far faster.

**Covering index** — include the columns you select, and Postgres never touches the table at all. That is an **Index Only Scan**, the fastest thing in the plan.

### 🚦 Never lock production

\`CREATE INDEX CONCURRENTLY\`. The plain form takes a write lock on the whole table — on a large table in production that is an outage.

**Why this sticks:** "CONCURRENTLY or outage" attaches a *consequence* to a keyword. Consequences are recalled under pressure in a way that syntax alone is not.`,
    tricksHi: `### 🧰 "Wajah na ho to B-tree"

- **B-tree** (default) — range, barabari, sorting. 95% case.
- **GIN** — "kya ye uske **andar** hai?" → JSONB, arrays, full-text search
- **GiST** — geometry aur "aas-paas"
- **BRIN** — bahut badi tables jinme rows pehle se physical kram mein hain (time-series logs). Chhota index, badi jeet, bahut khaas istemal.

**Bolo:** *"Default B-tree, andar-hone ke liye GIN."*

### 🎯 Do jo apne size se zyada kaam karte hain

**Partial index** — sirf un rows par index jinhe aap sach mein query karte ho:

\`\`\`sql
CREATE INDEX ON orders (created_at) WHERE status = 'PENDING';
\`\`\`

Agar 2% orders pending hain, to ye index 2% size ka hai aur kaafi tez.

**Covering index** — jo columns select karte ho unhe include karo, aur Postgres table ko chhuta hi nahi. Yahi **Index Only Scan** hai, plan ki sabse tez cheez.

### 🚦 Production kabhi lock mat karo

\`CREATE INDEX CONCURRENTLY\`. Simple wala poori table par write lock leta hai — production ki badi table par wo outage hai.

**Ye kyun tikta hai:** "CONCURRENTLY warna outage" ek keyword ke saath *natija* jod deta hai. Dabav mein natije yaad aate hain, akela syntax nahi.`,
  },

  'pg-explain-analyze': {
    tricks: `### 🔬 "EXPLAIN guesses. EXPLAIN ANALYZE actually runs it."

Only the second one tells the truth, because only the second one did the work.

### 👀 The one number that matters most

Compare **\`rows=\` (estimated)** against **\`actual rows=\`**.

Postgres estimated 10 and got 400,000? Every decision after that was made on a wrong assumption. Usually the statistics are stale:

\`\`\`sql
ANALYZE tablename;
\`\`\`

**Say it:** *"Estimate versus actual. That gap is the bug."*

### 🚨 Scan types, best to worst

**Index Only** → **Index** → **Bitmap Heap** → **Seq Scan**

But **Seq Scan is only bad when a large table returns few rows**. On a small table it is genuinely the right plan, and "I saw a Seq Scan so I added an index" is how people make things slower.

### 🔍 Two more signals worth knowing

- **Rows Removed by Filter** — fetched a lot, threw most away
- **Sort Method: external merge Disk** — the sort spilled to disk; raise \`work_mem\`

**Why this sticks:** "estimate versus actual" gives you *one place to look first* in a wall of output. Reducing an intimidating task to a single first move is what makes people actually do it.`,
    tricksHi: `### 🔬 "EXPLAIN andaza lagata hai. EXPLAIN ANALYZE sach mein chalata hai."

Sach sirf doosra batata hai, kyunki kaam sirf usne kiya.

### 👀 Sabse zyada matter karne wala ek number

**\`rows=\` (andaza)** ko **\`actual rows=\`** se milao.

Postgres ne 10 socha aur 4,00,000 mile? Uske baad ka har faisla galat maan kar hua. Aksar statistics purani hoti hain:

\`\`\`sql
ANALYZE tablename;
\`\`\`

**Bolo:** *"Andaza bनाम asli. Wahi faasla bug hai."*

### 🚨 Scan types, achhe se bure tak

**Index Only** → **Index** → **Bitmap Heap** → **Seq Scan**

Par **Seq Scan tabhi bura hai jab badi table se kam rows aayein**. Chhoti table par wahi sahi plan hai, aur "Seq Scan dikha to maine index laga diya" isi tarah log cheezein dheemi karte hain.

### 🔍 Do aur signal jaanne layak

- **Rows Removed by Filter** — bahut laaye, zyadatar phenk diya
- **Sort Method: external merge Disk** — sort disk par gir gaya; \`work_mem\` badhao

**Ye kyun tikta hai:** "andaza बनाम asli" output ki deewar mein *pehle dekhne ki ek jagah* de deta hai. Dara dene wale kaam ko ek pehle kadam mein badal dena hi logon se wo kaam karwata hai.`,
  },

  'pg-mvcc-vacuum': {
    tricks: `### 👥 "Postgres never overwrites. It writes a new version."

Every UPDATE creates a new row version and marks the old one dead. Each transaction sees a consistent snapshot from when it started.

**The payoff:** readers never block writers, writers never block readers. A long analytics query cannot hold up your writes.

**Say it:** *"Nobody waits, but the dead pile up."*

### 🧟 Why DELETE can make a table BIGGER

DELETE only **marks** rows dead. The space is not freed until VACUUM runs — so a large delete temporarily grows the table on disk.

That is a genuinely counter-intuitive fact, and it is exactly the kind of thing interviewers use to separate "I have read about Postgres" from "I have operated it".

### 🧹 VACUUM vs VACUUM FULL

- **VACUUM** — marks space reusable. Does **not** shrink the file. Safe, runs automatically.
- **VACUUM FULL** — actually shrinks it, but takes an **exclusive lock**. Never casually in production.

**Say it:** *"VACUUM reuses, FULL rebuilds and locks."*

**Why this sticks:** "DELETE makes it bigger" *violates expectation*, and violated expectations are stored preferentially — this is the same mechanism that makes surprising news memorable.`,
    tricksHi: `### 👥 "Postgres overwrite karta hi nahi. Wo naya version likhta hai."

Har UPDATE nayi row version banata hai aur purani ko dead mark karta hai. Har transaction ko wahi snapshot dikhta hai jo uske shuru hone par tha.

**Faayda:** readers writers ko kabhi nahi rokte, writers readers ko kabhi nahi. Lambi analytics query aapki writes nahi rok sakti.

**Bolo:** *"Koi intezaar nahi karta, par murde jamaa hote hain."*

### 🧟 DELETE table ko BADA kyun kar deta hai

DELETE rows ko sirf dead **mark** karta hai. VACUUM chalne tak jagah khaali nahi hoti — isliye bada delete table ko kuch der ke liye disk par bada kar deta hai.

Ye sach mein ulta lagne wala fact hai, aur interview lene wale isi se "maine Postgres ke baare mein padha hai" aur "maine ise chalaya hai" ka farq nikalte hain.

### 🧹 VACUUM aur VACUUM FULL

- **VACUUM** — jagah dobara istemal layak banata hai. File chhoti **nahi** karta. Surakshit, khud chalta hai.
- **VACUUM FULL** — sach mein chhoti karta hai, par **exclusive lock** leta hai. Production mein yun hi kabhi nahi.

**Bolo:** *"VACUUM dobara istemal, FULL dobara banata hai aur lock karta hai."*

**Ye kyun tikta hai:** "DELETE se bada ho jata hai" *ummeed todta hai*, aur toothi ummeedein pehle jama hoti hain — chaunkane wali khabar isi wajah se yaad rehti hai.`,
  },

  'pg-connection-pooling': {
    tricks: `### 🔌 "Each connection is a whole process, not a thread"

That is why Postgres caps out around 100 connections by default — each one costs real memory.

**Say it:** *"Connections are expensive. Reuse them."*

### 🤏 Smaller is faster (yes, really)

Past roughly **twice the core count**, more connections means more context switching and **less** throughput. Ten connections comfortably serve hundreds of concurrent requests, because each is held for milliseconds.

**Say it:** *"More connections, less throughput."*

### 🧮 The arithmetic people forget

**The pool is per process.** Four instances with a pool of 20 is **80** connections, not 20. Scale horizontally without doing this maths and you exhaust the database.

### ☁️ Why serverless breaks it

Every cold start opens fresh connections and blows straight through the limit. You need an external pooler — **PgBouncer** — between the app and Postgres.

And in transaction mode PgBouncer does **not** support prepared statements, which is exactly why Prisma needs \`?pgbouncer=true\` in the URL.

**Why this sticks:** "4 × 20 = 80, not 20" is *arithmetic you perform*, and the generation effect means a number you calculate is retained far better than one you read.`,
    tricksHi: `### 🔌 "Har connection poora process hai, thread nahi"

Isiliye Postgres default mein lagbhag 100 connections par ruk jata hai — har ek asli memory leta hai.

**Bolo:** *"Connections mehnge hain. Dobara istemal karo."*

### 🤏 Chhota tez hai (haan, sach mein)

Cores ke lagbhag **dugne** ke baad zyada connections matlab zyada context switching aur **kam** throughput. Das connections aaram se sau se zyada concurrent requests sambhal lete hain, kyunki har ek sirf milliseconds pakadti hai.

**Bolo:** *"Zyada connections, kam throughput."*

### 🧮 Wo hisaab jo log bhool jate hain

**Pool per process hoti hai.** 20 wale chaar instances matlab **80** connections, 20 nahi. Ye hisaab kiye bina horizontally scale karo aur database khatam.

### ☁️ Serverless ise kyun todta hai

Har cold start nayi connections kholta hai aur seedha limit paar kar deta hai. App aur Postgres ke beech external pooler chahiye — **PgBouncer**.

Aur transaction mode mein PgBouncer prepared statements support **nahi** karta, isiliye Prisma ko URL mein \`?pgbouncer=true\` chahiye.

**Ye kyun tikta hai:** "4 × 20 = 80, 20 nahi" *aisa hisaab hai jo aap khud karte ho*, aur generation effect ke chalte khud nikala number padhe hue number se kahin behtar tikta hai.`,
  },

  'pg-migrations-seeding': {
    tricks: `### 🧾 "A migration is a receipt. db push is a shrug."

- **\`migrate\`** — writes a numbered SQL file, checked into git, applied in order everywhere. You can see what changed and when.
- **\`db push\`** — just makes the database match the schema. No record, no history.

**Say it:** *"Push for playing, migrate for real."*

Use \`push\` while prototyping locally. Use \`migrate\` the moment anyone else — or production — is involved.

### 🌱 Seeds must be re-runnable

Use \`upsert\` keyed on a stable field (a slug), never plain \`create\`. Then running the seed twice is harmless.

**Say it:** *"A seed you can only run once is a script, not a seed."*

### ⚠️ The rule that saves production

**Never edit a migration that has already been applied.** Write a new one that corrects it.

Editing an applied migration means your machine and production silently disagree about what the schema is, and nothing will tell you until something breaks.

### 🔀 Renaming a column safely

Add new → copy data → deploy code reading both → drop old. Four steps because a rename is a **breaking change** the instant old code is still running.

**Why this sticks:** receipt vs shrug is a *character contrast* — one tool is diligent, the other is careless. Personified tools carry their own usage advice.`,
    tricksHi: `### 🧾 "Migration ek rasid hai. db push kandhe uchkana hai."

- **\`migrate\`** — number wali SQL file likhta hai, git mein jati hai, har jagah kram se lagti hai. Dikhta hai kya badla aur kab.
- **\`db push\`** — bas database ko schema jaisa bana deta hai. Na record, na itihaas.

**Bolo:** *"Khelne ke liye push, asli ke liye migrate."*

Local par prototype karte waqt \`push\`. Jaise hi koi aur — ya production — juda, \`migrate\`.

### 🌱 Seed dobara chalne layak honi chahiye

Kisi sthir field (slug) par \`upsert\` use karo, simple \`create\` kabhi nahi. Phir seed do baar chalane se kuch nahi bigadta.

**Bolo:** *"Jo seed sirf ek baar chal sakti hai wo script hai, seed nahi."*

### ⚠️ Wo niyam jo production bachata hai

**Jo migration lag chuki hai use kabhi mat badlo.** Use theek karne ke liye nayi likho.

Lagi hui migration badalne ka matlab hai ki aapki machine aur production chupchaap alag-alag schema maan rahe hain, aur kuch tootne tak koi nahi batayega.

### 🔀 Column surakshit tareeke se rename karna

Naya jodo → data copy karo → aisa code deploy karo jo dono padhe → purana hatao. Chaar kadam isliye kyunki purana code chalte hue rename ek **breaking change** hai.

**Ye kyun tikta hai:** rasid aur kandhe uchkana *character ka farq* hai — ek tool mehnati hai, doosra laparwah. Jinhe insaan bana do wo apni salah khud le kar chalte hain.`,
  },
};
