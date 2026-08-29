/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 5 (final lesson of the module).
 *
 * Idempotency and resilience: why a client that never received a response
 * (a network timeout, a dropped connection) cannot safely assume its
 * request failed and simply retry — the original request may have already
 * succeeded on the server, and a naive retry of a payment/order-creation
 * route double-charges a real customer. Broken example: POST /orders
 * charges a card and creates an order; a network blip after the server
 * finishes processing but before the response reaches the client causes
 * the client to retry, resulting in two charges and two orders for one
 * purchase. Fixed with an idempotency key: the client sends a unique key
 * with the request, the server records which keys it has already fully
 * processed and returns the ORIGINAL stored result for a repeated key
 * instead of re-executing the charge. Also covers exponential backoff for
 * retrying flaky downstream calls safely, and the circuit breaker pattern
 * for failing fast against a downstream service that is clearly down
 * rather than piling up hung requests.
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

export const NODE_MODULE_7_PART5: CourseLesson[] = [
  {
    slug: 'idempotency-and-resilience',
    title: 'Idempotency and Resilience: Making Retries Safe',
    titleHi: 'Idempotency Aur Resilience: Retries Ko Surakshit Banaana',
    description: 'A customer\'s payment succeeds on the server, but their phone loses signal right as the response is coming back — so their app retries the exact same purchase, and the customer is charged twice for one order.',
    descriptionHi: 'Ek customer ka payment server par safal hota hai, par unke phone ka signal theek us waqt chala jaata hai jab response wapas aa raha hota hai — isliye unka app bilkul wahi purchase dobara try karta hai, aur customer se ek order ke liye do baar charge liya jaata hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A cashier who, after successfully ringing up and charging a customer\'s card, has the receipt printer jam right as it prints — so when the customer, unsure whether the sale actually went through, asks "did that work?", the cashier simply rings up and charges the exact same order all over again to be safe, rather than checking the register\'s own record of what already happened.** A retried request that re-executes a payment from scratch is like a cashier who has no way to check whether a specific sale already went through, and so treats every "did that work?" as a brand-new transaction to process from zero — the customer\'s card, which was already correctly charged the first time, gets charged again, for a purchase that was already completely valid and finished. From the customer\'s side, nothing outwardly seemed wrong: their card reader beeped, the receipt printer jammed, and they reasonably asked the cashier to try again, having no way of knowing the sale had already gone through before the jam. A cashier trained to handle this correctly instead writes down a specific reference number on every receipt the moment a sale is rung up, and before ever charging a card again for what might be a repeat of an earlier sale, checks the register\'s own log for that same reference number — if it is already there, marked complete, the cashier simply hands over a duplicate printed receipt for the SAME original sale, charging nothing further, regardless of how many times the same confused customer asks "did that go through?"',
      hi: '**Ek cashier jo, ek customer ke card ko safaltapoorvak ring up aur charge karne ke baad, receipt printer ko theek us waqt atakta paata hai jab wo print karta hai — isliye jab customer, ye sure na hote hue ki sale asal mein hui ya nahi, poochhta hai "kya wo kaam kiya?", cashier bas surakshit rehne ke liye bilkul wahi order dobara ring up aur charge kar deta hai, register ke apne record ko check karne ke bajaye ki kya pehle se hua tha.** Ek retry ki gayi request jo shuru se ek payment dobara execute karti hai ek aise cashier jaisa hai jise ye check karne ka koi tarika nahi ki kya ek khaas sale pehle se ho chuki thi, aur isliye har "kya wo kaam kiya?" ko zero se process karne wali ek bilkul nayi transaction ki tarah treat karta hai — customer ka card, jo pehli baar sahi tarike se charge ho chuka tha, dobara charge ho jaata hai, ek aisi purchase ke liye jo pehle se poori tarah valid aur khatam thi. Customer ki taraf se, upar se kuch bhi galat nahi laga: unka card reader beep hua, receipt printer atak gaya, aur unhone samajhdaari se cashier se dobara try karne ko kaha, ye jaanne ka koi tarika bina ki sale atakne se pehle hi ho chuki thi. Ek cashier jise ise sahi tarike se sambhaalne ki training di gayi hai iske bajaye ek sale ring up hote hi har receipt par ek khaas reference number likhta hai, aur ek card ko dobara charge karne se pehle jo shaayad ek pehle ki sale ka dohraav ho sakta hai, register ke apne log mein wahi reference number check karta hai — agar wo pehle se wahaan hai, poora nishaan laga hai, cashier bas usi asli sale ke liye ek duplicate printed receipt thama deta hai, aage kuch bhi charge kiye bina, chahe wahi bhramit customer kitni bhi baar poochhe "kya wo kaam kiya?"',
    },

    simple: `**Start broken.** An order-creation route that charges a customer\'s card and creates the order, with no protection against a retried request:

\`\`\`js
app.post("/orders", async (req, res, next) => {
  const { cardToken, amount, items } = req.body;

  try {
    const charge = await paymentGateway.charge(cardToken, amount); // a real, external call
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    res.status(201).json({ orderId: order.rows[0].id, chargeId: charge.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route works correctly in the ordinary case: the card is charged, the order is created, and the response confirms both. The genuinely dangerous scenario is what happens when the RESPONSE itself never reaches the client — the card charge and the database insert both complete successfully on the server, but a network blip, a dropped mobile connection, or a client-side timeout means the client never actually receives that success response. From the client\'s point of view, this is indistinguishable from the request having failed entirely — no response arrived, so a reasonable client (or a reasonable user tapping "try again") retries the exact same request. The server, having no way to know this specific request is a retry of one it already fully processed, treats it as a brand-new order: it charges the card a SECOND time and creates a SECOND order row, for what the customer experienced as one single purchase. The client did nothing wrong — retrying a request that appears to have failed is entirely reasonable behavior — but the server\'s lack of any way to recognize "I have already done this exact thing" turns an ordinary network hiccup into a real, customer-facing billing error.

**The fix: an idempotency key the server uses to recognize a repeated request**

\`\`\`js
app.post("/orders", async (req, res, next) => {
  const idempotencyKey = req.headers["idempotency-key"];
  const { cardToken, amount, items } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header is required" });
  }

  try {
    const existing = await pool.query(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return res.status(201).json(existing.rows[0].response_body); // the SAME result as the original
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.post("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const { cardToken, amount, items } = req.body as { cardToken: string; amount: number; items: unknown[] };

  if (!idempotencyKey) {
    res.status(400).json({ error: "Idempotency-Key header is required" });
    return;
  }

  try {
    const existing = await pool.query<{ response_body: string }>(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      res.status(201).json(JSON.parse(existing.rows[0].response_body));
      return;
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query<{ id: number }>(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The client generates a unique idempotency key ONCE, when the user first initiates the purchase (commonly a UUID), and sends that exact same key with the original request AND with any retry of that same request — the key represents "this one specific purchase attempt," not "this one specific HTTP request." Before doing anything else, the route checks whether this key has been seen and fully processed before; if so, it returns the exact SAME response that was generated the first time, without charging the card or creating an order a second time. Only on a genuinely new key does the route perform the actual charge and insert, then records that key alongside the response it produced. A client retrying after a lost response now gets back the identical result the original, successful request already produced — the card is charged exactly once, regardless of how many times the same logical request is retried.`,

    simpleHi: `**Toote hue se shuru.** Ek order-banaane wala route jo customer ka card charge karta hai aur order banaata hai, ek retry ki gayi request ke khilaaf koi protection bina:

\`\`\`js
app.post("/orders", async (req, res, next) => {
  const { cardToken, amount, items } = req.body;

  try {
    const charge = await paymentGateway.charge(cardToken, amount); // ek asli, bahari call
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    res.status(201).json({ orderId: order.rows[0].id, chargeId: charge.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye route aam case mein sahi tarike se kaam karta hai: card charge hota hai, order banta hai, aur jawaab dono confirm karta hai. Sach mein khatarnaak scenario ye hai ki kya hota hai jab RESPONSE khud client tak kabhi pahunchta hi nahi — card charge aur database insert dono server par safaltapoorvak poore hote hain, par ek network blip, ek tooti mobile connection, ya ek client-side timeout matlab hai client asal mein wo safalta wala response kabhi paata hi nahi. Client ke nazariye se, ye us request se alag-nahi-pehchaani-jaane-laayak hai jo poori tarah fail hui ho — koi jawaab nahi aaya, isliye ek samajhdaar client (ya ek samajhdaar user jo "dobara try karo" tap karta hai) bilkul wahi request dobara try karta hai. Server, jise pehchaanne ka koi tarika nahi ki ye khaas request ek aisi ki retry hai jise wo pehle se poori tarah process kar chuka hai, ise ek bilkul-naye order ki tarah treat karta hai: ye card ko DOOSRI BAAR charge karta hai aur ek DOOSRI order row banaata hai, ek aisi cheez ke liye jise customer ne ek akeli purchase ki tarah anubhav kiya. Client ne kuch bhi galat nahi kiya — ek request ko dobara try karna jo fail hui dikhti hai poori tarah samajhdaar vyavhaar hai — par server ke paas "maine ye bilkul cheez pehle se ki hai" pehchaanne ka koi tarika na hona ek aam network hichki ko ek asli, customer-saamne-aati billing error mein badal deta hai.

**Fix: ek idempotency key jise server ek dohraayi request pehchaanne ke liye istemal karta hai**

\`\`\`js
app.post("/orders", async (req, res, next) => {
  const idempotencyKey = req.headers["idempotency-key"];
  const { cardToken, amount, items } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header is required" });
  }

  try {
    const existing = await pool.query(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return res.status(201).json(existing.rows[0].response_body); // asli jaisa hi nateeja
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
app.post("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const { cardToken, amount, items } = req.body as { cardToken: string; amount: number; items: unknown[] };

  if (!idempotencyKey) {
    res.status(400).json({ error: "Idempotency-Key header is required" });
    return;
  }

  try {
    const existing = await pool.query<{ response_body: string }>(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      res.status(201).json(JSON.parse(existing.rows[0].response_body));
      return;
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query<{ id: number }>(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Client ek unique idempotency key EK BAAR banaata hai, jab user pehli baar purchase shuru karta hai (aam taur par ek UUID), aur bhejta hai bilkul wahi key asli request ke SAATH AUR us request ki kisi bhi retry ke saath — key darzhaata hai "ye ek khaas purchase koshish," "ye ek khaas HTTP request" nahi. Kuch aur karne se pehle, route check karta hai ki kya ye key pehle dekhi gayi aur poori tarah process ki gayi hai; agar haan, ye bilkul WAHI jawaab lautaata hai jo pehli baar banaaya gaya tha, card charge kiye ya ek order doosri baar banaaye bina. Sirf ek sach mein nayi key par route asli charge aur insert karta hai, phir us key ko us response ke saath record karta hai jo usne paida kiya. Ek client jo ek khoye jawaab ke baad retry karta hai ab wahi nateeja wapas paata hai jo asli, safal request pehle se paida kar chuki thi — card bilkul ek baar charge hota hai, chahe wahi logical request kitni bhi baar retry ki jaaye.`,

    content: `## Idempotency is not automatic: GET requests get it for free, POST requests do not

\`\`\`
GET /orders/42 — running this once or ten times produces the same
observable result each time (returning the same order); this is naturally
idempotent, with no special handling required.

POST /orders — running this once creates one order; naively running it
twice creates two orders. POST is NOT naturally idempotent, and requires
deliberate handling (like this lesson's idempotency key) to make retrying
it safe.
\`\`\`

An operation is called "idempotent" when performing it multiple times produces the same end result as performing it once — a plain \`GET\` request (fetching data, changing nothing) is naturally idempotent, since reading the same data repeatedly never changes anything about the world regardless of how many times it happens, which is precisely why this course\'s earlier lessons never needed special handling for retrying a \`GET\`. A \`POST\` that creates a new resource (a new order, a new charge) is fundamentally NOT naturally idempotent — each execution, by design, creates something new, so running it twice genuinely produces two of whatever it creates. This is exactly why idempotency for a \`POST\` route needs to be deliberately engineered (via an explicit key, as this lesson demonstrates) rather than assumed — the HTTP method itself provides no such guarantee automatically.

## Where the idempotency key itself must be generated, and why

\`\`\`js
// Client-side: generated ONCE per logical purchase attempt, reused across any retries
const idempotencyKey = crypto.randomUUID();

async function submitOrder() {
  try {
    const res = await fetch("/orders", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(orderData),
    });
    // ...
  } catch (err) {
    // on a network failure, RETRY using the exact same idempotencyKey
    return submitOrder();
  }
}
\`\`\`

The idempotency key must be generated by the CLIENT, once, at the moment a specific purchase attempt begins — not regenerated on each individual network attempt, and not generated by the server, since the server has no way to know two separate incoming requests represent the same logical attempt unless the client itself provides that continuity. If the client instead generated a fresh key for every retry, each retry would look like an entirely new, distinct request to the server, and the entire mechanism would provide no protection at all — the key\'s entire value comes from it staying constant across every attempt to complete the same one logical operation, however many times the client actually has to try.

## Retrying safely: exponential backoff for flaky downstream calls

\`\`\`js
async function chargeWithRetry(cardToken, amount, attempt = 1) {
  try {
    return await paymentGateway.charge(cardToken, amount);
  } catch (err) {
    if (attempt >= 3) throw err;
    const delay = 1000 * Math.pow(2, attempt - 1); // 1s, then 2s, then 4s
    await new Promise((resolve) => setTimeout(resolve, delay));
    return chargeWithRetry(cardToken, amount, attempt + 1);
  }
}
\`\`\`

Following the same exponential-backoff idea this course\'s background-jobs lesson covered for retrying a failed job, a server making its OWN outbound call to a flaky third-party service (a payment gateway briefly overloaded, a momentary network blip) can similarly retry that specific call a limited number of times, waiting progressively longer between attempts, rather than giving up immediately on the first failure or retrying instantly in a tight loop that could make an already-struggling downstream service\'s situation worse. This is a genuinely separate concern from the idempotency key covered above — the idempotency key protects against the CLIENT retrying the same overall request; backoff-based retrying is about the SERVER giving its own downstream call to another service a reasonable chance to succeed before giving up.

## Circuit breakers: failing fast once a downstream dependency is clearly down

\`\`\`
Closed (normal): calls to the payment gateway proceed as usual, failures are counted.

Open (tripped): after enough recent failures, the circuit "opens" — new
calls fail IMMEDIATELY, without even attempting to contact the gateway,
for a cooldown period.

Half-open (testing): after the cooldown, a small number of calls are
allowed through to test whether the gateway has recovered, before fully
closing the circuit again.
\`\`\`

If a downstream dependency (a payment gateway, any external API) is genuinely down rather than merely occasionally flaky, retrying with backoff still means every single incoming request waits out the full retry sequence (potentially several seconds) before eventually failing anyway — under real traffic, this can pile up an enormous number of slow, doomed requests simultaneously, exhausting connections and resources for no benefit, since none of them were ever going to succeed. A circuit breaker tracks a downstream call\'s recent failure rate and, once it crosses a threshold, "opens" — for a cooldown period, new calls to that dependency fail immediately, without even attempting the network call at all, protecting the application\'s own resources and giving the struggling downstream service room to recover without being hit by a continuous flood of doomed retries. After the cooldown, the circuit allows a small number of test calls through (a "half-open" state) to check whether the dependency has actually recovered before fully resuming normal traffic — libraries such as \`opossum\` implement this pattern directly for Node.js applications, rather than requiring it to be hand-built from scratch.`,

    contentHi: `## Idempotency apne aap nahi hoti: \`GET\` requests ko ye muft milta hai, \`POST\` requests ko nahi

\`\`\`
GET /orders/42 — ise ek baar ya das baar chalaana har baar wahi
dekhaayi-dene-laayak nateeja paida karta hai (wahi order lautaate hue); ye
naisargik taur par idempotent hai, koi khaas handling zaruri nahi.

POST /orders — ise ek baar chalaana ek order banaata hai; ise bhole-bhaale
do baar chalaana do orders banaata hai. POST naisargik taur par idempotent
NAHI hai, aur ise surakshit retry karne ke liye jaan-boojhkar handling
chahiye (jaise is lesson ki idempotency key).
\`\`\`

Ek operation "idempotent" kehlaata hai jab ise kai baar karna wahi aakhri nateeja paida karta hai jo ise ek baar karna karta — ek saadha \`GET\` request (data fetch karna, kuch na badalna) naisargik taur par idempotent hai, kyunki wahi data baar-baar padhna duniya ke baare mein kuch bhi nahi badalta chahe ye kitni bhi baar ho, bilkul isi wajah se is course ke pehle wale lessons ko kabhi ek \`GET\` retry karne ke liye khaas handling ki zarurat nahi padi. Ek \`POST\` jo ek naya resource banaata hai (ek naya order, ek nayi charge) buniyaadi taur par naisargik taur par idempotent NAHI hai — har execution, design se, kuch naya banaata hai, isliye ise do baar chalaana sach mein wo do cheezein banaata hai jo ye banaata hai. Bilkul isi wajah se ek \`POST\` route ke liye idempotency ko jaan-boojhkar engineer karna chahiye (ek explicit key se, jaisa ye lesson dikhaata hai) maan lene ke bajaye — HTTP method khud aisi koi guarantee apne aap nahi deta.

## Idempotency key khud kahan banni chahiye, aur kyun

\`\`\`js
// Client-side: EK BAAR banaayi ek logical purchase koshish ke liye, kisi bhi retries mein dobara istemal
const idempotencyKey = crypto.randomUUID();

async function submitOrder() {
  try {
    const res = await fetch("/orders", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(orderData),
    });
    // ...
  } catch (err) {
    // ek network failure par, bilkul wahi idempotencyKey istemal karte hue RETRY karo
    return submitOrder();
  }
}
\`\`\`

Idempotency key CLIENT dwara banni chahiye, ek baar, us pal jab ek khaas purchase koshish shuru hoti hai — har akeli network koshish par dobara na banaayi jaaye, aur server dwara na banaayi jaaye, kyunki server ke paas ye jaanne ka koi tarika nahi ki do alag aati requests wahi logical koshish darzhaati hain jab tak client khud wo chalti judaai na de. Agar client iske bajaye har retry ke liye ek taaza key banaata, har retry server ko ek poori tarah nayi, alag request ki tarah dikhta, aur poora mechanism bilkul koi protection nahi deta — key ka poora maulya isse aata hai ki ye wahi ek logical operation poora karne ki har koshish mein constant rehti hai, client ko chahe kitni bhi baar asal mein try karna pade.

## Surakshit taur par retry karna: flaky downstream calls ke liye exponential backoff

\`\`\`js
async function chargeWithRetry(cardToken, amount, attempt = 1) {
  try {
    return await paymentGateway.charge(cardToken, amount);
  } catch (err) {
    if (attempt >= 3) throw err;
    const delay = 1000 * Math.pow(2, attempt - 1); // 1s, phir 2s, phir 4s
    await new Promise((resolve) => setTimeout(resolve, delay));
    return chargeWithRetry(cardToken, amount, attempt + 1);
  }
}
\`\`\`

Is course ke background-jobs lesson ne ek fail hui job retry karne ke liye jo exponential-backoff socch cover ki thi usi ka palan karte hue, ek server jo ek flaky third-party service ko apni KHUD ki bahari call karta hai (ek payment gateway thodi der ke liye overloaded, ek pal ka network blip) usi tarike se us khaas call ko ek seemit tadaad tak retry kar sakta hai, koshishon ke beech dheere-dheere zyaada intezaar karte hue, pehli asafalta par turant haar maanne ya ek tight loop mein turant retry karne ke bajaye jo pehle se struggle kar rahi downstream service ki sthiti ko bura bana sakta hai. Ye upar cover hui idempotency key se ek sach mein alag chinta hai — idempotency key CLIENT ko wahi poori request retry karne se bachaati hai; backoff-based retrying iske baare mein hai ki SERVER apni khud ki downstream call ko doosri service ko ek uchit mauka de haar maanne se pehle safal hone ka.

## Circuit breakers: ek baar downstream dependency saaf taur par down ho jaaye to jaldi fail hona

\`\`\`
Closed (normal): payment gateway ko calls aam taur par aage badhti hain, failures ginti hain.

Open (trip hua): kaafi haal ki failures ke baad, circuit "khulta" hai — nayi
calls TURANT fail hoti hain, gateway ko contact karne ki koshish kiye bina bhi,
ek cooldown period ke liye.

Half-open (test karna): cooldown ke baad, thodi tadaad ki calls ko guzarne
diya jaata hai ye test karne ke liye ki kya gateway recover hua hai, poori
tarah circuit dobara band karne se pehle.
\`\`\`

Agar ek downstream dependency (ek payment gateway, koi bahari API) sach mein down hai kabhi-kabhi flaky hone ke bajaye, backoff ke saath retry karna abhi bhi matlab hai har akeli aati request poori retry sequence (mumkin taur par kai seconds) ka intezaar karti hai aakhirkaar phir bhi fail hone se pehle — asli traffic ke neeche, ye ek saath ek bahut badi tadaad dheemi, barbaad-hone-wali requests jama kar sakta hai, connections aur resources khatam karte hue koi faayde ke bina, kyunki unmein se koi bhi kabhi safal hone wali thi hi nahi. Ek circuit breaker ek downstream call ki haal ki asafalta ki dar track karta hai aur, ek baar ye ek threshold paar karti hai, "khulta hai" — ek cooldown period ke liye, us dependency ko nayi calls turant fail hoti hain, network call ki koshish kiye bina bhi, application ke apne resources ko surakshit karte hue aur struggle kar rahi downstream service ko doomed retries ki ek lagaataar baadh se maara jaane bina recover karne ki jagah dete hue. Cooldown ke baad, circuit thodi tadaad ki test calls ko guzarne deta hai ("half-open" sthiti) ye check karne ke liye ki kya dependency asal mein recover hui hai poori tarah aam traffic dobara shuru karne se pehle — \`opossum\` jaisi libraries is pattern ko seedha Node.js applications ke liye lagu karti hain, ise shuru se haath se banaane ki maang karne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a lost response causes a retry that double-charges the customer',
        titleHi: 'Toota: ek khoya jawaab ek retry cause karta hai jo customer ko double-charge karta hai',
        code: `const charge = await paymentGateway.charge(cardToken, amount);
const order = await pool.query(insertOrder, [charge.id, amount, items]);
res.status(201).json({ orderId: order.rows[0].id, chargeId: charge.id });
// if this response never reaches the client, a retry charges the card again`,
        codeJs: `app.post("/orders", async (req, res, next) => {
  const { cardToken, amount, items } = req.body;
  try {
    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    res.status(201).json({ orderId: order.rows[0].id, chargeId: charge.id });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cardToken, amount, items } = req.body as { cardToken: string; amount: number; items: unknown[] };
  try {
    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query<{ id: number }>(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    res.status(201).json({ orderId: order.rows[0].id, chargeId: charge.id });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about what happens when a client retries, not a code defect.`,
        output: `Ordinary case: the customer is charged once and one order is created.
Lost-response case: the charge and order both succeed server-side, the
client never sees the response, retries, and the customer is charged
twice with two orders created for one purchase.`,
        explain: 'The server has no way to recognize a retried request as the same logical purchase attempt — every incoming request is treated as brand new, regardless of whether it is a genuine retry.',
        explainHi: 'Server ke paas ek retry ki gayi request ko wahi logical purchase koshish ki tarah pehchaanne ka koi tarika nahi hai — har aati request ko bilkul-nayi ki tarah treat kiya jaata hai, chahe ye ek asli retry ho ya nahi.',
      },
      {
        title: 'Fixed: an idempotency key makes a retry return the original result',
        titleHi: 'Theek: ek idempotency key ek retry ko asli nateeja lautaane deti hai',
        code: `const existing = await pool.query(lookupByKey, [idempotencyKey]);
if (existing.rows.length > 0) return res.status(201).json(existing.rows[0].response_body);
// ...only a genuinely new key reaches the actual charge...`,
        codeJs: `app.post("/orders", async (req, res, next) => {
  const idempotencyKey = req.headers["idempotency-key"];
  const { cardToken, amount, items } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header is required" });
  }

  try {
    const existing = await pool.query(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return res.status(201).json(existing.rows[0].response_body);
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const { cardToken, amount, items } = req.body as { cardToken: string; amount: number; items: unknown[] };

  if (!idempotencyKey) {
    res.status(400).json({ error: "Idempotency-Key header is required" });
    return;
  }

  try {
    const existing = await pool.query<{ response_body: string }>(
      "SELECT response_body FROM processed_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      res.status(201).json(JSON.parse(existing.rows[0].response_body));
      return;
    }

    const charge = await paymentGateway.charge(cardToken, amount);
    const order = await pool.query<{ id: number }>(
      "INSERT INTO orders (charge_id, amount, items) VALUES ($1, $2, $3) RETURNING id",
      [charge.id, amount, JSON.stringify(items)]
    );
    const responseBody = { orderId: order.rows[0].id, chargeId: charge.id };

    await pool.query(
      "INSERT INTO processed_requests (idempotency_key, response_body) VALUES ($1, $2)",
      [idempotencyKey, JSON.stringify(responseBody)]
    );

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same lost-response scenario now results in exactly one charge and
one order — the retry, carrying the same idempotency key, receives the
original response directly, without the charge or insert running a
second time.`,
        outputTs: `// Identical behaviour. The idempotency key is checked and recorded as
// part of the same logical flow, ensuring a repeated key can never
// reach the actual charge a second time.`,
        explain: 'The key represents "this one purchase attempt," not "this one HTTP request" — the server can now tell a genuine retry apart from a brand-new order.',
        explainHi: 'Key "ye ek purchase koshish" darzhaati hai, "ye ek HTTP request" nahi — server ab ek asli retry ko ek bilkul-naye order se alag bata sakta hai.',
      },
      {
        title: 'Backoff and a circuit breaker for a flaky downstream payment gateway',
        titleHi: 'Ek flaky downstream payment gateway ke liye backoff aur ek circuit breaker',
        code: `async function chargeWithRetry(cardToken, amount, attempt = 1) {
  try {
    return await paymentGateway.charge(cardToken, amount);
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)));
    return chargeWithRetry(cardToken, amount, attempt + 1);
  }
}`,
        codeJs: `async function chargeWithRetry(cardToken, amount, attempt = 1) {
  try {
    return await paymentGateway.charge(cardToken, amount);
  } catch (err) {
    if (attempt >= 3) throw err;
    const delay = 1000 * Math.pow(2, attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return chargeWithRetry(cardToken, amount, attempt + 1);
  }
}

// A circuit breaker (using a library like opossum) wraps the same call,
// failing fast once the gateway is clearly down rather than retrying forever
const CircuitBreaker = require("opossum");
const breaker = new CircuitBreaker(chargeWithRetry, { errorThresholdPercentage: 50, resetTimeout: 30000 });`,
        codeTs: `async function chargeWithRetry(cardToken: string, amount: number, attempt = 1): Promise<Charge> {
  try {
    return await paymentGateway.charge(cardToken, amount);
  } catch (err) {
    if (attempt >= 3) throw err;
    const delay = 1000 * Math.pow(2, attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return chargeWithRetry(cardToken, amount, attempt + 1);
  }
}

import CircuitBreaker from "opossum";
const breaker = new CircuitBreaker(chargeWithRetry, { errorThresholdPercentage: 50, resetTimeout: 30000 });`,
        outputJs: `A single transient failure is retried up to 3 times with increasing
delay and often succeeds. If the gateway is genuinely down, the
circuit breaker opens after enough failures, and subsequent calls fail
immediately instead of each one waiting through the full retry
sequence.`,
        outputTs: `// Identical behaviour. Charge is a type describing the payment
// gateway's own response shape, following the same typing pattern used
// throughout this course.`,
        explain: 'Backoff gives a momentarily struggling service a fair chance to succeed on retry; the circuit breaker recognizes when a service is not momentarily struggling but genuinely down, and stops wasting resources on doomed attempts.',
        explainHi: 'Backoff ek pal ke liye struggle kar rahi service ko retry par safal hone ka ek uchit mauka deta hai; circuit breaker pehchaanta hai jab ek service pal ke liye struggle nahi kar rahi balki sach mein down hai, aur doomed koshishon par resources barbaad karna band kar deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const charge = await paymentGateway.charge(cardToken, amount);
// no idempotency key — a retried request charges the card again`,
        right: `const existing = await pool.query(lookupByKey, [idempotencyKey]);
if (existing.rows.length > 0) return res.json(existing.rows[0].response_body);
// only a genuinely new key can reach the charge`,
        why: 'A client that never received a response cannot distinguish "my request failed" from "my request succeeded but the response was lost" — without an idempotency key, its reasonable retry double-charges a customer.',
        whyHi: 'Ek client jise kabhi jawaab nahi mila "meri request fail hui" ko "meri request safal hui par jawaab kho gaya" se alag nahi kar sakta — bina ek idempotency key ke, uski samajhdaar retry ek customer ko double-charge karti hai.',
      },
      {
        wrong: `const idempotencyKey = crypto.randomUUID(); // generated fresh on every single request attempt
fetch("/orders", { headers: { "Idempotency-Key": idempotencyKey } });`,
        right: `const idempotencyKey = crypto.randomUUID(); // generated ONCE per purchase, reused across retries
async function submitOrder() {
  return fetch("/orders", { headers: { "Idempotency-Key": idempotencyKey } });
}`,
        why: 'Generating a new key on every retry defeats the entire mechanism — the server can only recognize a repeated request if the same key is reused across every attempt to complete the same logical operation.',
        whyHi: 'Har retry par ek nayi key banaana poora mechanism haraata hai — server sirf ek dohraayi request tab pehchaan sakta hai jab wahi key wahi logical operation poora karne ki har koshish mein dobara istemal ho.',
      },
      {
        wrong: `while (true) {
  try { return await paymentGateway.charge(cardToken, amount); }
  catch (err) { /* retry immediately, forever, even if the gateway is completely down */ }
}`,
        right: `// Bounded retries with exponential backoff, plus a circuit breaker
// that stops trying entirely once the gateway is clearly down`,
        why: 'Retrying immediately and indefinitely against a genuinely down dependency wastes resources on attempts that were never going to succeed and can make the downstream service\'s own recovery harder.',
        whyHi: 'Ek sach mein down dependency ke khilaaf turant aur hamesha ke liye retry karna un koshishon par resources barbaad karta hai jo kabhi safal hone wali thi hi nahi aur downstream service ki apni recovery ko aur mushkil bana sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Idempotency keys are explicitly documented, standard practice for essentially every major payment API (Stripe, PayPal, and others)**, specifically because double-charging a real customer due to a network retry is a well-known, seriously consequential real-world failure mode these APIs are designed to prevent.',
        hi: '**Idempotency keys explicitly documented, standard practice hain lagbhag har mukhya payment API ke liye (Stripe, PayPal, aur doosre)**, khaas taur par isliye kyunki ek asli customer ko ek network retry ki wajah se double-charge karna ek achhi tarah jaana-pehchaana, gambhir nateeje wala real-world fail-hone ka tarika hai jise ye APIs rokne ke liye design hui hain.',
      },
      {
        en: '**The circuit breaker pattern is a widely documented, standard resilience pattern in distributed systems design**, popularized specifically for handling exactly this class of "a downstream dependency is down, stop hammering it" problem across many production systems, not a niche or unusual technique.',
        hi: '**Circuit breaker pattern distributed systems design mein ek vyapak taur par documented, standard resilience pattern hai**, khaas taur par bilkul is kism ki "ek downstream dependency down hai, use peetna band karo" samasya sambhaalne ke liye kai production systems mein popular hua, koi niche ya asaadhaaran technique nahi.',
      },
      {
        en: '**Exponential backoff is the standard, widely recommended retry strategy across essentially every distributed system and API client library** — AWS SDKs, Google Cloud client libraries, and most HTTP client libraries with built-in retry support all implement some form of it by default.',
        hi: '**Exponential backoff lagbhag har distributed system aur API client library mein standard, vyapak taur par sujhaayi jaane wali retry strategy hai** — AWS SDKs, Google Cloud client libraries, aur zyaadatar built-in retry support wali HTTP client libraries sab default taur par iska kuch roop lagu karti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a lost response indistinguishable from a failed request from the client\'s perspective, and why does this make naive retrying dangerous for a POST request specifically?',
        qHi: 'Ek khoya jawaab client ke nazariye se ek fail hui request se alag-nahi-pehchaani-jaane-laayak kyun hai, aur ye bhola-bhaala retry karna khaas taur par ek POST request ke liye khatarnaak kyun banaata hai?',
        a: 'From a client\'s perspective, a request can fail to produce a visible response for two entirely different underlying reasons that look identical from the outside: either the server genuinely never processed the request at all (a real failure), or the server processed the request completely successfully but the resulting response was lost somewhere on its way back to the client (a network blip, a dropped connection, a client-side timeout that gave up waiting). The client has no way to distinguish between these two cases just from the absence of a response — both look exactly like "I sent a request and got nothing back." For a GET request, this ambiguity is harmless: retrying a GET that already silently succeeded simply re-fetches the same data with no side effects, since reading data does not change anything. For a POST request that creates something new (an order, a charge), this ambiguity becomes genuinely dangerous specifically because the two possible underlying truths call for two different, opposite actions — if the request truly failed, retrying is exactly the right thing to do; if the request actually succeeded and only the response was lost, retrying performs the exact same creation a second time, producing a duplicate the user never intended and, in a payment scenario, charging them twice for what they experienced as one single purchase. Naive retrying assumes the first case without any way to verify it, which is precisely the assumption that breaks down whenever the second case is actually what happened.',
        aHi: 'Ek client ke nazariye se, ek request do poori tarah alag underlying wajahon se ek dikhaayi-dene-laayak jawaab paida karne mein fail ho sakti hai jo bahar se identical dikhti hain: ya to server ne asal mein request ko kabhi process kiya hi nahi (ek asli asafalta), ya server ne request ko poori tarah safaltapoorvak process kiya par nateeja jawaab kahin client tak wapas aane ke raaste mein kho gaya (ek network blip, ek tooti connection, ek client-side timeout jisne intezaar karna chhod diya). Client ke paas sirf jawaab ki gairhaazri se in do cases ke beech farak karne ka koi tarika nahi hai — dono bilkul "maine ek request bheji aur kuch wapas nahi mila" jaise dikhte hain. Ek \`GET\` request ke liye, ye asaspashtta harmless hai: ek \`GET\` retry karna jo chupke se pehle se safal ho chuki thi bas wahi data dobara fetch karta hai koi side effects bina, kyunki data padhna kuch bhi nahi badalta. Ek \`POST\` request ke liye jo kuch naya banaata hai (ek order, ek charge), ye asaspashtta sach mein khatarnaak ban jaati hai khaas taur par isliye kyunki do mumkin underlying sachaayiyaan do alag, ulte actions ki maang karti hain — agar request sach mein fail hui, retry karna bilkul sahi kaam hai; agar request asal mein safal hui aur sirf jawaab khoya, retry karna bilkul wahi banaana doosri baar karta hai, ek duplicate paida karte hue jo user ne kabhi iraada nahi kiya aur, ek payment scenario mein, unse do baar charge lete hue us cheez ke liye jise unhone ek akeli purchase ki tarah anubhav kiya. Bhola-bhaala retry karna pehla case maan leta hai bina use verify karne ke koi tarika, jo bilkul wo maanyata hai jo tootti hai jab bhi doosra case asal mein hota hai.',
      },
      {
        q: 'Why must the idempotency key be generated once by the client rather than regenerated on each retry attempt, and why can it not be generated by the server instead?',
        qHi: 'Idempotency key client dwara ek baar kyun banni chahiye har retry koshish par dobara na banaayi jaaye, aur ye iske bajaye server dwara kyun nahi banaayi jaa sakti?',
        a: 'The entire purpose of an idempotency key is to let the server recognize that two or more separate incoming HTTP requests actually represent the same single logical operation the client is attempting — the server\'s only way to know this is if those separate requests carry the exact same key value. If the client generated a brand-new key for every individual attempt (including retries), each retry would arrive at the server carrying a different key than the original attempt did, and the server\'s lookup for "have I seen this key before" would correctly find nothing for every single attempt, since from the server\'s perspective each one genuinely does have a key it has never seen — the mechanism would provide no protection at all, since it depends entirely on the key staying the same across retries to work. This is also exactly why the server cannot generate the key itself: the server has no way to know, before receiving a request, that request is a retry of an earlier one it may or may not have already processed — that knowledge only exists on the client\'s side, since the client is the one that knows it already tried once, did not receive a response, and is now trying again for the same underlying purchase. Only the client is in a position to maintain that continuity by generating the key once and deliberately reusing it across every attempt to complete the same operation, which is precisely why generating it client-side, once per logical operation, is the only way the mechanism functions as intended.',
        aHi: 'Ek idempotency key ka poora maqsad ye hai ki server ye pehchaan sake ki do ya zyaada alag aati HTTP requests asal mein wahi ek logical operation darzhaati hain jo client koshish kar raha hai — server ka isse jaanne ka aikela tarika ye hai ki wo alag requests bilkul wahi key value le kar aayein. Agar client har akeli koshish ke liye (retries sameet) ek bilkul-nayi key banaata, har retry server tak asli koshish se alag ek key le kar pahunchti, aur "kya maine ye key pehle dekhi hai" server ka lookup har akeli koshish ke liye sahi tarike se kuch nahi paata, kyunki server ke nazariye se har ek sach mein ek key rakhti hai jise usne kabhi dekha hi nahi — mechanism bilkul koi protection nahi dega, kyunki ye poori tarah isi par nirbhar hai ki key retries ke aar-paar wahi rahe kaam karne ke liye. Bilkul isi wajah se server khud key nahi bana sakta: server ke paas, ek request paane se pehle, ye jaanne ka koi tarika nahi hai ki wo request ek pehle wali ki retry hai jise usne shaayad pehle se process kiya ho ya na kiya ho — wo jaankaari sirf client ki taraf maujood hai, kyunki client hi wo hai jo jaanta hai usne pehle se ek baar koshish ki, koi jawaab nahi mila, aur ab wahi underlying purchase ke liye dobara koshish kar raha hai. Sirf client us sthiti mein hai us chalti judaai ko maintain karne ki key ek baar banaakar aur jaan-boojhkar usi operation ko poora karne ki har koshish mein use dobara istemal karke, bilkul isi wajah se client-side, prati-logical-operation ek baar banaana aikela tarika hai jismein mechanism iraade ke hisaab se kaam karta hai.',
      },
      {
        q: 'How does a circuit breaker differ from simple retrying with backoff, and why is a circuit breaker\'s "fail fast" behavior actually beneficial rather than a worse user experience?',
        qHi: 'Ek circuit breaker saadha backoff wala retrying karne se kaise alag hai, aur ek circuit breaker ka "jaldi fail hona" vyavhaar asal mein faayde-mand kyun hai ek bura user experience nahi?',
        a: 'Simple retrying with backoff operates entirely at the level of a single call: when that specific call fails, it waits a bit and tries again, up to some limited number of attempts, with no memory of how other, separate calls to the same dependency have been faring recently. This works well for a momentarily flaky dependency, where each individual failure is largely independent and likely to succeed on a subsequent try. A circuit breaker operates at a different level: it tracks the aggregate failure rate of calls to a specific dependency ACROSS MANY separate requests over time, and once that failure rate crosses a threshold, it concludes the dependency is not merely occasionally flaky but is currently broadly unavailable, and deliberately stops even attempting new calls to it for a cooldown period, having every new request fail immediately without ever reaching the network at all. This might initially seem like a worse experience, since a user\'s request now fails immediately rather than the server spending several seconds retrying on their behalf — but consider what actually happens without the circuit breaker in that same fully-down scenario: every single incoming request would still individually retry with backoff, each one taking several seconds to exhaust its retries before ultimately failing anyway, meaning the user experiences the SAME eventual failure, just after waiting considerably longer for it, while the server simultaneously ties up its own limited resources (connections, memory, worker threads) on a large number of requests that were all doomed to fail regardless. The circuit breaker\'s fail-fast behavior delivers the same honest outcome (the dependency is down, this cannot succeed right now) without wasting the user\'s time waiting for a foregone conclusion, and without the server exhausting its own capacity on calls that could never have succeeded — both the user and the server\'s own health benefit from failing fast once it is genuinely known that succeeding is not currently possible.',
        aHi: 'Backoff ke saath saadha retrying poori tarah ek akeli call ke star par kaam karta hai: jab wo khaas call fail hoti hai, ye thoda intezaar karta hai aur dobara try karta hai, kuch seemit tadaad ki koshishon tak, koi yaad bina ki usi dependency ko doosri, alag calls haal mein kaisi lagi hain. Ye ek pal ke liye flaky dependency ke liye achha kaam karta hai, jahan har akeli asafalta kaafi hisse mein mustaqil hai aur baad ki koshish mein safal hone ki sambhaavna rakhti hai. Ek circuit breaker ek alag star par kaam karta hai: ye ek khaas dependency ki calls ki aggregate asafalta dar KAI ALAG REQUESTS ke aar-paar waqt ke saath track karta hai, aur ek baar wo asafalta dar ek threshold paar karti hai, ye nateeja nikaalta hai ki dependency sirf kabhi-kabhi flaky nahi balki abhi wyaapak taur par upalabdh-nahi hai, aur jaan-boojhkar use nayi calls ki koshish karna bhi band kar deta hai ek cooldown period ke liye, har nayi request ko turant fail hone dete hue network tak kabhi pahunche bina. Ye shuru mein ek bura anubhav lag sakta hai, kyunki ek user ki request ab turant fail hoti hai server ke unki taraf se kai second retry karne mein bitane ke bajaye — par socho ki asal mein bina circuit breaker ke us hi poori-tarah-down scenario mein kya hota: har akeli aati request abhi bhi akele-akele backoff ke saath retry karti, har ek apni retries khatam karne mein kai second lagaate hue aakhirkaar phir bhi fail hote hue, matlab user WAHI aakhirkaar asafalta anubhav karta hai, bas kaafi zyaada intezaar karne ke baad, jabki server ek saath apne khud ke seemit resources (connections, memory, worker threads) ek badi tadaad ki requests par baandhta hai jo sab chahe kuch bhi ho fail hone ke liye doomed thi. Circuit breaker ka fail-fast vyavhaar wahi imaandaar nateeja deta hai (dependency down hai, ye abhi safal nahi ho sakta) user ka waqt ek tay nateeje ka intezaar karne mein barbaad kiye bina, aur server ki apni kshamta un calls par khatam kiye bina jo kabhi safal ho hi nahi sakti thin — user aur server ki apni sehat dono ko faayda hota hai jaldi fail hone se ek baar sach mein jaan liya jaaye ki safal hona abhi mumkin nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /orders route with no idempotency protection, using a fake paymentGateway.charge() that simply logs and returns a fake charge ID. Simulate a lost response by calling the route twice in a row with the same body and confirm two charges and two orders result.',
        taskHi: 'Bina idempotency protection ke toota \`/orders\` route banao, ek fake \`paymentGateway.charge()\` istemal karte hue jo bas log karta hai aur ek fake charge ID lautaata hai. Ek khoya jawaab simulate karo route ko wahi body ke saath lagaataar do baar bulaakar aur confirm karo do charges aur do orders ka nateeja aata hai.',
        hint: 'Log every call to the fake paymentGateway.charge() to a console.log or an in-memory array so you can directly count how many times it was actually invoked.',
        hintHi: 'Fake \`paymentGateway.charge()\` ki har call ko ek \`console.log\` ya ek in-memory array mein log karo taaki tum seedha gin sako ye asal mein kitni baar bulaaya gaya.',
      },
      {
        task: 'Fix it with an idempotency key and a processed_requests table. Repeat the same "call twice with the same body" test, this time also sending the same Idempotency-Key header both times, and confirm only one charge occurs.',
        taskHi: 'Ek idempotency key aur ek \`processed_requests\` table se theek karo. Wahi "wahi body ke saath do baar bulaao" test dohraao, is baar dono baar wahi \`Idempotency-Key\` header bhi bhejte hue, aur confirm karo sirf ek charge hoti hai.',
        hint: 'Also test sending two DIFFERENT idempotency keys with otherwise identical request bodies, and confirm this correctly results in two separate charges — the key, not the body, is what determines uniqueness.',
        hintHi: 'Do ALAG idempotency keys bhejne ka bhi test karo warna identical request bodies ke saath, aur confirm karo ye sahi tarike se do alag charges mein nateeja hota hai — key, body nahi, uniqueness tay karti hai.',
      },
      {
        task: 'Implement chargeWithRetry with exponential backoff against a fake payment gateway function that fails a configurable number of times before succeeding. Confirm it succeeds after retrying, and confirm it correctly gives up and throws after exceeding the maximum attempts.',
        taskHi: '\`chargeWithRetry\` ko exponential backoff ke saath ek fake payment gateway function ke khilaaf lagu karo jo safal hone se pehle ek configure-hone-laayak tadaad tak fail karta hai. Confirm karo ye retry karne ke baad safal hota hai, aur confirm karo ye adhiktam koshishon se aage jaane ke baad sahi tarike se haar maanta hai aur throw karta hai.',
        hint: 'Log a timestamp before each attempt to directly observe the increasing delay between retries (1s, then 2s, then 4s) rather than just trusting the code is correct.',
        hintHi: 'Har koshish se pehle ek timestamp log karo seedha retries ke beech badhti deri dekhne ke liye (1s, phir 2s, phir 4s) bas ye bharosa karne ke bajaye ki code sahi hai.',
      },
    ],

    keyTakeaways: [
      'A client that never received a response cannot distinguish "my request failed" from "my request succeeded but the response was lost" — its reasonable retry can double-execute a POST that creates something new.',
      'An idempotency key, generated once by the client per logical operation and reused across every retry, lets the server recognize a repeated request and return the original result instead of re-executing it.',
      'GET requests are naturally idempotent (repeating them changes nothing); POST requests that create resources are not, and require deliberate idempotency handling to make retrying them safe.',
      'Exponential backoff retries a specific failing call a limited number of times with increasing delay, giving a momentarily struggling dependency a fair chance to recover before giving up.',
      'A circuit breaker tracks a dependency\'s aggregate failure rate and, once it is clearly down, fails new calls immediately for a cooldown period — protecting the application\'s own resources rather than piling up doomed, slow retries.',
      'Idempotency keys and retry/circuit-breaker logic solve different problems: the key protects against the client retrying the same request; backoff and circuit breakers govern how the server itself retries its own outbound calls.',
    ],
    keyTakeawaysHi: [
      'Ek client jise kabhi jawaab nahi mila "meri request fail hui" ko "meri request safal hui par jawaab kho gaya" se alag nahi kar sakta — uski samajhdaar retry ek \`POST\` ko double-execute kar sakti hai jo kuch naya banaata hai.',
      'Ek idempotency key, jo client dwara prati logical operation ek baar banayi jaati hai aur har retry mein dobara istemal hoti hai, server ko ek dohraayi request pehchaanne deti hai aur ise dobara execute karne ke bajaye asli nateeja lautaane deti hai.',
      '\`GET\` requests naisargik taur par idempotent hain (unhe dohraana kuch nahi badalta); resources banaate \`POST\` requests nahi hain, aur unhe surakshit taur par retry karne ke liye jaan-boojhkar idempotency handling chahiye.',
      'Exponential backoff ek khaas fail hoti call ko badhti deri ke saath seemit tadaad tak retry karta hai, ek pal ke liye struggle kar rahi dependency ko haar maanne se pehle recover hone ka ek uchit mauka dete hue.',
      'Ek circuit breaker ek dependency ki aggregate asafalta dar track karta hai aur, ek baar wo saaf taur par down hai, nayi calls ko ek cooldown period ke liye turant fail karta hai — application ke apne resources ko surakshit karte hue doomed, dheemi retries jama karne ke bajaye.',
      'Idempotency keys aur retry/circuit-breaker logic alag samasyaayein solve karte hain: key client ko wahi request retry karne se bachaati hai; backoff aur circuit breakers tay karte hain ki server khud apni bahari calls ko kaise retry karta hai.',
    ],
  },
];
