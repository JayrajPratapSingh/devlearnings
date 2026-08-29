/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 6.
 *
 * Payment webhooks and signature verification: why blindly trusting a
 * POST to a "/webhooks/stripe"-style endpoint lets anyone on the internet
 * forge a fake "payment succeeded" event and get goods or access for free,
 * and why verifying a webhook's signature requires the exact RAW request
 * body bytes, not the parsed JSON object express.json() produces. Broken
 * example: a webhook handler that reads req.body.type === "payment.succeeded"
 * and marks an order paid with no verification at all — an attacker curls
 * the same shape of request directly and gets a free order. Fixed by
 * computing an HMAC over the raw body with the shared webhook secret and
 * comparing it to the signature header before trusting anything in the
 * payload, using express.raw() specifically for that route. Also covers
 * why webhooks must be handled idempotently (the same event can be
 * delivered more than once) and why the handler should acknowledge quickly
 * and do slow work asynchronously.
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

export const NODE_MODULE_7_PART6: CourseLesson[] = [
  {
    slug: 'payment-webhooks-signature-verification',
    title: 'Payment Webhooks: Why Trusting the Payload Alone Is Dangerous',
    titleHi: 'Payment Webhooks: Sirf Payload Par Bharosa Karna Khatarnaak Kyun Hai',
    description: 'A single curl command, sent by anyone on the internet who guesses the right endpoint, marks a real order as "paid" — because the webhook handler never checked whether the request actually came from the payment provider.',
    descriptionHi: 'Ek akela \'curl\' command, internet par kisi ke bhi dwara bheja gaya jo sahi endpoint guess kare, ek asli order ko "paid" mark kar deta hai — kyunki webhook handler ne kabhi check hi nahi kiya ki request asal mein payment provider se aayi thi ya nahi.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A warehouse manager who releases goods the instant any fax arrives claiming to say "payment confirmed," without ever checking whether that fax genuinely came from the bank\'s own fax machine — versus one who checks a special watermark only the bank\'s machine can produce before releasing anything.** Trusting a webhook\'s payload without verifying where it actually came from is like a warehouse manager who has agreed with the bank that whenever a payment clears, the bank will send a fax saying so, and who then releases the corresponding goods the instant any fax arrives with that exact wording — without ever checking whether the fax genuinely came from the bank\'s own machine, or from literally anyone else with access to a fax machine and knowledge of the expected wording. A dishonest customer who simply learns what the bank\'s confirmation fax typically says can send an identical-looking fax themselves, from any machine, and the warehouse releases real goods for a payment that never actually happened. A manager who does this correctly instead relies on the bank\'s fax machine stamping every genuine confirmation with a special watermark, generated using a method only the bank and the warehouse know, that cannot be reproduced by anyone else — before releasing anything, the manager checks specifically for that watermark, not merely for wording that sounds right, and a forged fax without it is rejected immediately no matter how convincing its text looks.',
      hi: '**Ek warehouse manager jo turant goods release kar deta hai jis pal koi bhi fax aata hai jismein "payment confirm ho gaya" likha ho, ye kabhi check kiye bina ki wo fax sach mein bank ki apni fax machine se aaya tha — versus ek jo kuch bhi release karne se pehle ek khaas watermark check karta hai jo sirf bank ki machine bana sakti hai.** Webhook ke payload par bharosa karna ye check kiye bina ki wo asal mein kahan se aaya ek aise warehouse manager jaisa hai jo bank ke saath ye tay kar chuka hai ki jab bhi ek payment clear ho, bank ek fax bhejega ye kehte hue — aur jo phir turant milte-julte goods release kar deta hai jis pal koi bhi fax bilkul us wording ke saath aata hai — ye kabhi check kiye bina ki wo fax sach mein bank ki apni machine se aaya, ya literally kisi aur se jiske paas ek fax machine ka access hai aur ummeed ki gayi wording ki jaankaari. Ek beimaan customer jo bas ye seekh leta hai ki bank ka confirmation fax aam taur par kya kehta hai khud ek identical-dikhta fax bhej sakta hai, kisi bhi machine se, aur warehouse asli goods release kar deta hai ek aise payment ke liye jo asal mein kabhi hua hi nahi. Ek manager jo ise sahi tarike se karta hai iske bajaye bank ki fax machine har asli confirmation par ek khaas watermark laganeko bharosa karta hai, ek tarike se banaaya gaya jise sirf bank aur warehouse jaante hain, jise koi aur dobara paida nahi kar sakta — kuch bhi release karne se pehle, manager khaas taur par us watermark ke liye check karta hai, sirf sahi lagti wording ke liye nahi, aur ek forge kiya fax uske bina turant reject ho jaata hai chahe uska text kitna bhi convincing dikhe.',
    },

    simple: `**Start broken.** A webhook handler that trusts a payment provider\'s claimed event with no verification at all:

\`\`\`js
app.post("/webhooks/payment", express.json(), async (req, res, next) => {
  const event = req.body;

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route works correctly whenever the real payment provider genuinely sends a genuine event — an order gets marked paid, exactly as intended. The catastrophic flaw is that this route has no way whatsoever to distinguish a genuine event, sent by the actual payment provider after actually confirming a real charge, from a request crafted by literally anyone who simply knows (or guesses) the URL and the expected JSON shape. Using nothing more than \`curl\`, an attacker can send \`{"type": "payment.succeeded", "data": {"orderId": 42}}\` directly to this exact endpoint, and the route — having no way to check where the request actually came from — marks order 42 as paid, releasing real goods or services for a payment that never happened at all. This is not a hypothetical edge case: this specific endpoint\'s URL is not meaningfully secret (it is often visible in provider dashboards, network logs, or simply guessable), and the entire vulnerability exists purely because the route trusts the CONTENT of a request without ever verifying its SOURCE.

**The fix: verify a cryptographic signature over the raw body before trusting anything**

\`\`\`js
const crypto = require("crypto");

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(req.body) // the RAW, unparsed request body — exactly what the provider signed
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import crypto from "crypto";

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const signature = req.headers["x-webhook-signature"] as string | undefined;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
    .update(req.body as Buffer)
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const event = JSON.parse((req.body as Buffer).toString());

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

A payment provider computes an HMAC (Hash-based Message Authentication Code) over the exact bytes of the request body, using a secret key ONLY the provider and this application know (\`WEBHOOK_SECRET\`, following this course\'s earlier \`process.env\` lesson), and sends the result as a header alongside the request. Because computing a correct HMAC requires knowing that shared secret, and an attacker sending a forged request has no way to obtain it, an attacker can produce a request with the right-looking JSON shape but has no way to produce a signature that will match — the route recomputes the same HMAC independently using its own copy of the secret, and if the two values do not match exactly, the request is rejected before any of its content is ever trusted or acted on. Critically, \`express.raw()\` is used specifically for this route instead of \`express.json()\`, because the signature was computed over the exact original bytes the provider sent — parsing the body into a JavaScript object and later re-serializing it (as \`express.json()\` effectively requires) can produce a byte sequence that differs subtly (whitespace, key ordering) from the original, which would cause even a genuine, correctly-signed request to fail verification.`,

    simpleHi: `**Toote hue se shuru.** Ek webhook handler jo ek payment provider ke daave kiye event par bilkul koi verification ke bina bharosa karta hai:

\`\`\`js
app.post("/webhooks/payment", express.json(), async (req, res, next) => {
  const event = req.body;

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye route theek kaam karta hai jab bhi asli payment provider sach mein ek asli event bhejta hai — ek order paid mark ho jaata hai, bilkul jaisa iraada tha. Vinaashak kami ye hai ki is route ke paas bilkul koi tarika nahi hai ek asli event, jo asli payment provider dwara ek asli charge confirm karne ke baad bheja gaya, ko us request se alag karne ka jo literally koi bhi bana sakta hai jo bas URL aur ummeed ki gayi JSON shape jaanta ho (ya guess karta ho). \`curl\` se zyaada kuch istemal kiye bina, ek attacker seedha \`{"type": "payment.succeeded", "data": {"orderId": 42}}\` is bilkul endpoint ko bhej sakta hai, aur route — ye check karne ka koi tarika na rakhte hue ki request asal mein kahan se aayi — order 42 ko paid mark kar deta hai, asli goods ya services ek aise payment ke liye release karte hue jo kabhi hua hi nahi. Ye koi kalpaniya edge case nahi hai: is khaas endpoint ka URL maayne-rakhta secret nahi hai (ye aksar provider dashboards, network logs mein dikhta hai, ya bas guess-hone-laayak hai), aur poori vulnerability poori tarah isliye maujood hai kyunki route ek request ki CONTENT par bharosa karta hai uska SOURCE kabhi verify kiye bina.

**Fix: kuch bhi bharosa karne se pehle raw body ke oopar ek cryptographic signature verify karo**

\`\`\`js
const crypto = require("crypto");

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(req.body) // asli, na-parse-hui request body — bilkul wahi jo provider ne sign ki
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import crypto from "crypto";

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const signature = req.headers["x-webhook-signature"] as string | undefined;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
    .update(req.body as Buffer)
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const event = JSON.parse((req.body as Buffer).toString());

  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek payment provider ek HMAC (Hash-based Message Authentication Code) calculate karta hai request body ke bilkul bytes ke oopar, ek secret key istemal karte hue jise SIRF provider aur ye application jaanti hai (\`WEBHOOK_SECRET\`, is course ke pehle wale \`process.env\` lesson ka palan karte hue), aur nateeja ek header ki tarah request ke saath bhejta hai. Kyunki ek sahi HMAC calculate karne ke liye wo shared secret jaanna zaruri hai, aur ek attacker jo ek forge ki gayi request bhejta hai use paane ka koi tarika nahi hai, ek attacker sahi-dikhti JSON shape wali ek request bana sakta hai par ek aisa signature paida karne ka koi tarika nahi hai jo milega — route apni khud secret ki copy istemal karke wahi HMAC mustaqil taur par dobara calculate karta hai, aur agar do values bilkul na milein, request ko us se pehle reject kar diya jaata hai ki uski koi content kabhi bharosa ki jaaye ya usme kaam kiya jaaye. Bahut zaruri, \`express.raw()\` khaas taur par is route ke liye istemal hota hai \`express.json()\` ke bajaye, kyunki signature asli bhejе gaye bilkul bytes par calculate hua tha — body ko ek JavaScript object mein parse karna aur use baad mein dobara-serialize karna (jaisa \`express.json()\` asar mein maang karta hai) ek byte sequence paida kar sakta hai jo asli se subtly alag hai (whitespace, key ordering), jo ek asli, sahi-signed request ko bhi verification mein fail karwa sakta hai.`,

    content: `## Idempotent webhook processing: the same event can arrive more than once

\`\`\`js
app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  // ...signature verification as shown above...
  const event = JSON.parse(req.body);

  try {
    const existing = await pool.query(
      "SELECT id FROM processed_webhook_events WHERE event_id = $1",
      [event.id]
    );
    if (existing.rows.length > 0) {
      return res.status(200).json({ received: true }); // already handled, acknowledge without redoing work
    }

    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }

    await pool.query("INSERT INTO processed_webhook_events (event_id) VALUES ($1)", [event.id]);
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Following this course\'s earlier idempotency lesson, most payment providers explicitly document that a given webhook event may be delivered more than once — a network retry on the provider\'s side, a slow acknowledgment from the application, or the provider\'s own infrastructure occasionally resending an event it is not certain was received. Each event carries its own unique event ID, and checking whether that specific ID has already been processed (recording it once handling succeeds) before acting on an event is exactly the idempotency-key pattern this course covered earlier, applied here to inbound events instead of outbound client requests — without it, a legitimately re-delivered "payment succeeded" event could, depending on what the handler does, cause the same side effect (sending a duplicate confirmation email, incrementing a counter twice) to happen more than once for one real payment.

## Acknowledge fast, do slow work asynchronously

\`\`\`js
app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  // ...signature verification...
  const event = JSON.parse(req.body);

  try {
    await eventQueue.add("process-payment-event", event); // enqueue, following this course's background-jobs lesson
    res.status(200).json({ received: true }); // acknowledge immediately
  } catch (err) {
    next(err);
  }
});
\`\`\`

Payment providers typically expect a webhook endpoint to respond quickly (often within a few seconds) and will treat a slow or timed-out response as a delivery failure, triggering a retry — even though the event may have actually been received and even fully processed by the time the provider gives up waiting. Following this course\'s background-jobs lesson, a webhook handler performing any genuinely slow work (sending emails, updating multiple related records, calling other internal services) is often better structured to verify the signature, durably enqueue the event for a separate worker to process, and respond \`200\` immediately — decoupling "confirming the event was safely received" from "finishing all the work that event ultimately triggers," for exactly the same reasons this course\'s background-jobs lesson gave for not making a user wait on a slow, non-essential email send.

## Constant-time comparison: why signature !== expectedSignature has a subtle issue

\`\`\`js
// Subtly risky — a plain === comparison can leak timing information
if (signature !== expectedSignature) { /* ... */ }

// More robust — a comparison specifically designed to take the same time regardless of where strings differ
const isValid = crypto.timingSafeEqual(
  Buffer.from(signature, "hex"),
  Buffer.from(expectedSignature, "hex")
);
\`\`\`

A detail worth knowing at a professional level: a plain \`!==\` string comparison typically returns as soon as it finds the first differing character, meaning the time it takes can vary very slightly depending on how many leading characters happen to match — in principle, an attacker capable of measuring extremely precise timing differences over many, many attempts could exploit this to guess a correct signature one character at a time (a "timing attack"). \`crypto.timingSafeEqual()\` is specifically designed to always take the same amount of time regardless of where or whether two buffers differ, closing this theoretical gap — production payment integrations commonly use it (or an equivalent the specific provider\'s own SDK provides) for exactly this reason, even though exploiting a plain comparison in practice requires a very sophisticated, high-precision attack.`,

    contentHi: `## Idempotent webhook processing: wahi event ek se zyaada baar aa sakta hai

\`\`\`js
app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  // ...upar dikhaayi signature verification...
  const event = JSON.parse(req.body);

  try {
    const existing = await pool.query(
      "SELECT id FROM processed_webhook_events WHERE event_id = $1",
      [event.id]
    );
    if (existing.rows.length > 0) {
      return res.status(200).json({ received: true }); // pehle se sambhaala, kaam dobara kiye bina acknowledge karo
    }

    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }

    await pool.query("INSERT INTO processed_webhook_events (event_id) VALUES ($1)", [event.id]);
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Is course ke pehle wale idempotency lesson ka palan karte hue, zyaadatar payment providers explicitly document karti hain ki ek diya webhook event ek se zyaada baar deliver ho sakta hai — provider ki taraf se ek network retry, application se ek dheema acknowledgment, ya provider ka apna infrastructure kabhi-kabhi ek event dobara bhejna jise wo sure nahi tha ki mila. Har event apna khud ka unique event ID rakhta hai, aur ye check karna ki kya wo khaas ID pehle se process ho chuki hai (ise handling safal hote hi record karte hue) ek event par kaam karne se pehle bilkul wahi idempotency-key pattern hai jo ye course pehle cover kar chuka hai, yahan aati events par lagu hua client-shuru-ki outbound requests ke bajaye — is bina, ek legitimate taur par dobara-deliver hua "payment succeeded" event, is baat par nirbhar karte hue ki handler kya karta hai, wahi side effect (ek duplicate confirmation email bhejna, ek counter do baar badhaana) ek se zyaada baar ek asli payment ke liye kar sakta hai.

## Jaldi acknowledge karo, dheema kaam asynchronously karo

\`\`\`js
app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  // ...signature verification...
  const event = JSON.parse(req.body);

  try {
    await eventQueue.add("process-payment-event", event); // enqueue karo, is course ke background-jobs lesson ka palan karte hue
    res.status(200).json({ received: true }); // turant acknowledge karo
  } catch (err) {
    next(err);
  }
});
\`\`\`

Payment providers aam taur par ummeed karte hain ki ek webhook endpoint jaldi jawaab de (aksar kuch seconds ke andar) aur ek dheeme ya timeout hue jawaab ko ek delivery asafalta ki tarah treat karengi, ek retry trigger karte hue — chahe event asal mein mil chuka ho aur poori tarah process ho chuka ho jab tak provider intezaar karna chhode. Is course ke background-jobs lesson ka palan karte hue, ek webhook handler jo koi sach mein dheema kaam karta hai (emails bhejna, kai judi records update karna, doosri internal services ko bulaana) aksar behtar tarike se structure hota hai signature verify karne, event ko ek alag worker ke process karne ke liye durably enqueue karne, aur turant \`200\` jawaab dene ke liye — "event ko surakshit taur par paana confirm karna" ko "wo event aakhirkaar jo saara kaam trigger karta hai poora karna" se alag karte hue, bilkul unhi wajahon se jo is course ke background-jobs lesson ne di thi ek user ko ek dheeme, ghair-zaruri email send ka intezaar na karwaane ke liye.

## Constant-time comparison: \`signature !== expectedSignature\` mein ek subtle issue kyun hai

\`\`\`js
// Subtly khatarnaak — ek saadha === comparison timing jaankaari leak kar sakta hai
if (signature !== expectedSignature) { /* ... */ }

// Zyaada mazboot — ek comparison khaas taur par design hua hai bilkul wahi waqt lene ke liye chahe strings kahin bhi alag hon
const isValid = crypto.timingSafeEqual(
  Buffer.from(signature, "hex"),
  Buffer.from(expectedSignature, "hex")
);
\`\`\`

Ek detail jo professional star par jaanna kaam ka hai: ek saadha \`!==\` string comparison aam taur par pehla alag character milte hi wapas aa jaata hai, matlab isme lagne wala waqt bahut halke se badal sakta hai is baat par nirbhar karte hue ki kitne shuruaati characters mile — sidhaant mein, ek attacker jo bahut sateek timing farak kai-kai koshishon mein naap sakta hai iska istemal ek sahi signature ko ek waqt mein ek character guess karne ke liye kar sakta hai (ek "timing attack"). \`crypto.timingSafeEqual()\` khaas taur par isliye design hua hai ki hamesha wahi tadaad ka waqt le chahe do buffers kahin alag hon ya na hon, is theoretical kami ko band karte hue — production payment integrations aam taur par ise (ya khaas provider ke apne SDK ka barabar) bilkul isi wajah se istemal karti hain, chahe practice mein ek saadha comparison exploit karne ke liye ek bahut sophisticated, high-precision attack chahiye.`,

    examples: [
      {
        title: 'Broken: any request claiming to be a webhook is trusted',
        titleHi: 'Toota: webhook hone ka daava karti koi bhi request bharosa ki jaati hai',
        code: `app.post("/webhooks/payment", express.json(), async (req, res, next) => {
  if (req.body.type === "payment.succeeded") {
    await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [req.body.data.orderId]);
  }
  res.status(200).json({ received: true });
});
// curl -X POST .../webhooks/payment -d '{"type":"payment.succeeded","data":{"orderId":42}}'`,
        codeJs: `app.post("/webhooks/payment", express.json(), async (req, res, next) => {
  const event = req.body;
  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/webhooks/payment", express.json(), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const event = req.body as { type: string; data: { orderId: number } };
  try {
    if (event.type === "payment.succeeded") {
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE id = $1",
        [event.data.orderId]
      );
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about trusting the request's source, not its shape.`,
        output: `A genuine payment event correctly marks the order paid. A forged curl
request with the same JSON shape, sent by anyone who knows the
endpoint, ALSO marks the order paid — with no real payment ever having
occurred.`,
        explain: 'The route has no way to distinguish a genuine provider-sent event from an identical-looking forged request, since it only ever inspects the content, never the source.',
        explainHi: 'Route ke paas ek asli provider-bheji event ko ek identical-dikhti forge hui request se alag karne ka koi tarika nahi hai, kyunki ye kabhi sirf content check karta hai, source kabhi nahi.',
      },
      {
        title: 'Fixed: HMAC signature verification over the raw body',
        titleHi: 'Theek: raw body ke oopar HMAC signature verification',
        code: `const expectedSignature = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(req.body).digest("hex");
if (signature !== expectedSignature) return res.status(400).json({ error: "Invalid signature" });`,
        codeJs: `const crypto = require("crypto");

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);
  try {
    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import crypto from "crypto";

app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const signature = req.headers["x-webhook-signature"] as string | undefined;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
    .update(req.body as Buffer)
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const event = JSON.parse((req.body as Buffer).toString());
  try {
    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same forged curl request now fails signature verification and
receives 400, never reaching the order-update logic at all. Only a
request signed with the real, shared WEBHOOK_SECRET succeeds.`,
        outputTs: `// Identical behaviour. express.raw() delivers req.body as a Buffer of
// the exact original bytes, which is what the HMAC must be computed
// over to match what the provider signed.`,
        explain: 'The forged request has the right JSON shape but no way to produce a matching signature without knowing the shared secret — signature verification, not content inspection, is what actually distinguishes genuine events.',
        explainHi: 'Forge hui request ki JSON shape sahi hai par shared secret jaane bina ek milta signature paida karne ka koi tarika nahi — signature verification, content inspection nahi, asal mein asli events ko alag karta hai.',
      },
      {
        title: 'Handling a duplicate webhook delivery idempotently',
        titleHi: 'Ek duplicate webhook delivery ko idempotent taur par sambhaalna',
        code: `const existing = await pool.query("SELECT id FROM processed_webhook_events WHERE event_id = $1", [event.id]);
if (existing.rows.length > 0) return res.status(200).json({ received: true });
// ...only a genuinely new event ID reaches the actual update...`,
        codeJs: `app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);
  try {
    const existing = await pool.query(
      "SELECT id FROM processed_webhook_events WHERE event_id = $1",
      [event.id]
    );
    if (existing.rows.length > 0) {
      return res.status(200).json({ received: true });
    }

    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }
    await pool.query("INSERT INTO processed_webhook_events (event_id) VALUES ($1)", [event.id]);
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const signature = req.headers["x-webhook-signature"] as string | undefined;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
    .update(req.body as Buffer)
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const event = JSON.parse((req.body as Buffer).toString());
  try {
    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM processed_webhook_events WHERE event_id = $1",
      [event.id]
    );
    if (existing.rows.length > 0) {
      res.status(200).json({ received: true });
      return;
    }

    if (event.type === "payment.succeeded") {
      await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [event.data.orderId]);
    }
    await pool.query("INSERT INTO processed_webhook_events (event_id) VALUES ($1)", [event.id]);
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The exact same genuine event, delivered twice (simulating a provider
retry), results in the order being marked paid exactly once — the
second delivery is acknowledged with 200 but performs no further work.`,
        outputTs: `// Identical behaviour. This is the same idempotency-key pattern from
// the earlier idempotency lesson, applied to inbound webhook event IDs
// instead of outbound client-generated keys.`,
        explain: 'A payment provider re-delivering the same event is expected, normal behavior, not an attack — the handler must tolerate it without performing the same side effect more than once.',
        explainHi: 'Ek payment provider ka wahi event dobara-deliver karna ummeed kiya, normal vyavhaar hai, koi attack nahi — handler ko ise sambhaalna chahiye wahi side effect ek se zyaada baar kiye bina.',
      },
    ],

    mistakes: [
      {
        wrong: `app.post("/webhooks/payment", express.json(), async (req, res) => {
  if (req.body.type === "payment.succeeded") { /* trust it directly */ }
});
// anyone who knows the endpoint URL can forge this exact request`,
        right: `const expectedSignature = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
if (signature !== expectedSignature) return res.status(400).json({ error: "Invalid signature" });
// only a request signed with the shared secret is trusted`,
        why: 'A webhook endpoint\'s URL is not meaningfully secret — without verifying a cryptographic signature, anyone who discovers or guesses the URL can forge events and trigger real side effects like marking an order paid.',
        whyHi: 'Ek webhook endpoint ka URL maayne-rakhta secret nahi hai — ek cryptographic signature verify kiye bina, koi bhi jo URL dhoondh le ya guess kar le events forge kar sakta hai aur ek order paid mark karne jaise asli side effects trigger kar sakta hai.',
      },
      {
        wrong: `app.use(express.json()); // parses the body globally before the webhook route ever sees it
app.post("/webhooks/payment", async (req, res) => {
  const expected = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex");
  // re-serialized JSON may not byte-for-byte match what was actually signed`,
        right: `app.post("/webhooks/payment", express.raw({ type: "application/json" }), async (req, res) => {
  const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
  // the exact original bytes, matching what the provider actually signed
});`,
        why: 'Signature verification must use the exact original request body bytes — parsing to JSON and re-serializing can subtly change whitespace or key order, causing even a genuinely valid signature to fail verification.',
        whyHi: 'Signature verification ko bilkul asli request body bytes istemal karne chahiye — JSON mein parse karna aur dobara-serialize karna subtly whitespace ya key order badal sakta hai, ek sach mein valid signature ko bhi verification mein fail karwate hue.',
      },
      {
        wrong: `if (event.type === "payment.succeeded") {
  await sendConfirmationEmail(event.data.orderId); // runs again on every re-delivery of the same event
}`,
        right: `const existing = await pool.query(lookupByEventId, [event.id]);
if (existing.rows.length > 0) return res.status(200).json({ received: true });
// duplicate deliveries are acknowledged but never re-trigger side effects`,
        why: 'Payment providers commonly redeliver the same event more than once — without checking whether a specific event ID was already processed, a legitimate redelivery can trigger the same side effect (a duplicate email, a duplicate action) multiple times.',
        whyHi: 'Payment providers aam taur par wahi event ek se zyaada baar dobara-deliver karti hain — ye check kiye bina ki kya ek khaas event ID pehle se process hui hai, ek legitimate redelivery wahi side effect (ek duplicate email, ek duplicate action) kai baar trigger kar sakti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every major payment provider (Stripe, PayPal, Square, and others) explicitly documents webhook signature verification as a mandatory, non-optional security step**, with official SDK helper functions specifically provided to do this correctly rather than leaving it to be hand-rolled.',
        hi: '**Har mukhya payment provider (Stripe, PayPal, Square, aur doosre) explicitly webhook signature verification ko ek anivaarya, vaikalpik-nahi security step ki tarah document karta hai**, khaas taur par diye gaye official SDK helper functions ke saath ise sahi tarike se karne ke liye, use haath se banaane ke liye chhodne ke bajaye.',
      },
      {
        en: '**Unverified or improperly verified webhook endpoints are a real, commonly cited category of production security vulnerability in e-commerce and SaaS applications**, directly leading to free goods, unauthorized account upgrades, or other real financial loss when discovered and exploited.',
        hi: '**Verify-na-hue ya galat tarike se verify hue webhook endpoints e-commerce aur SaaS applications mein ek asli, aam taur par cite hoti production security vulnerability ki kism hain**, seedha muft goods, anadhikrit account upgrades, ya doosre asli financial nuksaan ki taraf le jaate hain jab dhoondhe aur exploit kiye jaate hain.',
      },
      {
        en: '**Stripe\'s own webhook documentation explicitly discusses handling duplicate event delivery and recommends using the event\'s unique ID for deduplication** — the idempotent-processing pattern this lesson covers mirrors the payment industry\'s own stated best practice directly.',
        hi: '**Stripe ki apni webhook documentation explicitly duplicate event delivery sambhaalne ki charcha karti hai aur deduplication ke liye event ki unique ID istemal karne ki sifarish karti hai** — is lesson mein cover hua idempotent-processing pattern payment industry ke apne bataaye best practice ko seedha darzhaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it dangerous to trust a webhook\'s payload based solely on its content, without verifying where the request actually came from?',
        qHi: 'Ek webhook ke payload par sirf uski content ke aadhaar par bharosa karna khatarnaak kyun hai, ye verify kiye bina ki request asal mein kahan se aayi?',
        a: 'A webhook endpoint is, at the HTTP level, indistinguishable from any other route the application exposes — it accepts incoming POST requests, and by default has no built-in way to confirm the specific identity of whoever sent a given request. A route that only inspects the CONTENT of the request body (checking whether it says event.type === "payment.succeeded", for instance) is making a security decision — whether to mark a real order as paid, in this lesson\'s example — based purely on a claim contained within the request itself, with no independent verification of who actually made that claim. Because the request body\'s content is not a secret (an attacker can trivially construct a JSON object matching the expected shape simply by knowing or guessing what a legitimate event looks like), and the endpoint\'s URL is not meaningfully secret either, anyone capable of sending an HTTP request to that URL can produce a payload that looks identical to a genuine one. Trusting the payload\'s content alone therefore means the application\'s security boundary for this specific, consequential action rests entirely on an attacker not knowing something that is often not particularly hard to discover or guess — a fundamentally weak foundation for a decision with real financial or business consequences, compared to requiring proof (a cryptographic signature) that only the genuine, trusted party could have produced.',
        aHi: 'Ek webhook endpoint, HTTP level par, application ke expose kiye kisi bhi doosre route se alag-nahi-pehchaani-jaane-laayak hai — ye aati \`POST\` requests accept karta hai, aur default taur par jisne bhi ek di gayi request bheji uski khaas pehchaan confirm karne ka koi built-in tarika nahi hai. Ek route jo sirf request body ki CONTENT check karta hai (check karte hue ki kya ye kehta hai \`event.type === "payment.succeeded"\`, misal ke taur par) ek security faisla le raha hai — kya ek asli order ko paid mark karna hai, is lesson ke example mein — poori tarah ek daave ke aadhaar par jo request ke andar hai hi, jisne wo daava kiya uski koi mustaqil verification bina. Kyunki request body ki content koi secret nahi hai (ek attacker aasaani se ek JSON object bana sakta hai jo ummeed ki gayi shape se milta hai bas ye jaankar ya guess karke ki ek legitimate event kaisa dikhta hai), aur endpoint ka URL bhi maayne-rakhta secret nahi hai, koi bhi jo us URL ko ek HTTP request bhej sakta hai ek aisa payload bana sakta hai jo ek asli jaisa dikhe. Sirf payload ki content par bharosa karna isliye matlab hai application ki security boundary is khaas, nateeja-wale action ke liye poori tarah isi par tiki hai ki attacker kuch aisa na jaane jo aksar dhoondhna ya guess karna khaas mushkil nahi hai — ek buniyaadi taur par kamzor buniyaad ek aise faisle ke liye jiske asli financial ya business nateeje hain, us saboot ki maang karne ke muqable (ek cryptographic signature) jo sirf asli, bharosemand party paida kar sakti thi.',
      },
      {
        q: 'How does HMAC signature verification actually prevent a forged webhook request from being accepted, and why does it specifically require the raw, unparsed request body?',
        qHi: 'HMAC signature verification ek forge ki gayi webhook request ko accept hone se asal mein kaise rokta hai, aur ye khaas taur par raw, na-parse-hui request body ki maang kyun karta hai?',
        a: 'An HMAC is computed by combining a specific message (here, the request body) with a secret key using a cryptographic algorithm, producing a fixed-length output that depends on BOTH the exact message content and the exact secret key — changing either one, even slightly, produces a completely different HMAC output. The payment provider computes this HMAC using the secret key it shares privately with the application, and sends the resulting value as a header alongside the request. When the application receives a request, it independently recomputes the same HMAC using its own copy of that same shared secret, applied to the request body it actually received, and compares its own computed result against the value the request claims. An attacker attempting to forge a request has no access to the shared secret at all — they can freely choose whatever body content they want, but without knowing the secret key, they have no way to compute the specific HMAC value that would correctly correspond to that content, meaning any signature they include will fail to match what the application independently computes. This is precisely why the raw, unparsed body is required for verification: the HMAC was computed by the provider over the EXACT sequence of bytes it sent, and if the application instead parses those bytes into a JavaScript object and later reconstructs a JSON string from that object (as would happen if express.json() were used and the resulting object were re-stringified), the reconstructed bytes can differ subtly from the original — different whitespace, different key ordering — which would cause the application\'s independently recomputed HMAC to differ from the provider\'s original one even for a completely genuine, legitimately signed request, causing verification to incorrectly fail.',
        aHi: 'Ek HMAC ek khaas message (yahan, request body) ko ek secret key ke saath ek cryptographic algorithm istemal karke jodkar calculate hota hai, ek fixed-length output paida karte hue jo BOTH bilkul message content aur bilkul secret key par nirbhar karta hai — kisi ek ko bhi badalna, chahe thoda sa, ek poori tarah alag HMAC output paida karta hai. Payment provider is HMAC ko us secret key ka istemal karke calculate karta hai jise wo application ke saath privately share karta hai, aur nateeja value ko request ke saath ek header ki tarah bhejta hai. Jab application ek request paata hai, ye mustaqil taur par wahi HMAC ko apni khud wahi shared secret ki copy istemal karke dobara calculate karta hai, us request body par lagu karte hue jo usne asal mein paayi, aur apna khud calculate kiya nateeja us value se compare karta hai jo request daava karti hai. Ek attacker jo ek request forge karne ki koshish karta hai shared secret tak bilkul koi access nahi rakhta — wo azaadi se jo bhi body content chaahe chun sakta hai, par secret key jaane bina, uske paas wo khaas HMAC value calculate karne ka koi tarika nahi hai jo us content se sahi tarike se milega, matlab jo bhi signature wo shaamil karega application ke mustaqil calculate kiye se milne mein fail hoga. Bilkul isi wajah se verification ke liye raw, na-parse-hui body zaruri hai: HMAC provider ne bilkul us bytes ke sequence par calculate kiya tha jo usne bheja, aur agar application iske bajaye un bytes ko ek JavaScript object mein parse karta hai aur baad mein us object se ek JSON string dobara banaata hai (jaisa hoga agar \`express.json()\` istemal ho aur nateeja object dobara-stringify ho), dobara-banaaye bytes asli se subtly alag ho sakte hain — alag whitespace, alag key ordering — jo application ke mustaqil dobara-calculate kiye HMAC ko provider ke asli se alag banaayega ek poori tarah asli, legitimate taur par signed request ke liye bhi, verification ko galat tarike se fail karwaate hue.',
      },
      {
        q: 'Why must a webhook handler be written to tolerate the same event being delivered more than once, rather than assuming each event arrives exactly once?',
        qHi: 'Ek webhook handler ko wahi event ek se zyaada baar deliver hone ko sehne ke liye kyun likha jaana chahiye, ye maan lene ke bajaye ki har event bilkul ek baar aata hai?',
        a: 'Most payment providers explicitly design their webhook delivery systems around an "at-least-once" guarantee rather than an "exactly-once" one — this means the provider guarantees a given event will be delivered at least one time, but does not guarantee it will be delivered exactly one time, since doing so would require the provider to have perfect, instantaneous knowledge of whether its previous delivery attempt was successfully received and processed, which is not reliably possible over a real network. In practice, this means a provider may redeliver the same event if it does not receive an acknowledgment quickly enough (even if the original delivery actually succeeded and the acknowledgment was simply delayed or lost), if its own internal systems retry due to a transient issue on the provider\'s side, or for various other operational reasons. A webhook handler that assumes each event arrives exactly once and performs its action unconditionally every time it receives a request (updating a database row, sending a confirmation email, incrementing a counter) will, whenever a legitimate redelivery of an already-processed event actually occurs, perform that same action a second time for what was really only one underlying real-world event — this can produce duplicate emails, double-counted metrics, or other side effects the business did not intend, entirely because the application incorrectly assumed a delivery guarantee stronger than the one the provider actually offers. Explicitly checking whether a given event\'s unique ID has already been processed before acting on it, exactly as this course\'s earlier idempotency lesson demonstrated for outbound requests, is what correctly accounts for the provider\'s actual at-least-once delivery model.',
        aHi: 'Zyaadatar payment providers apne webhook delivery systems ko khaas taur par ek "at-least-once" guarantee ke aas-paas design karte hain ek "exactly-once" wali ke bajaye — iska matlab hai provider guarantee karta hai ki ek diya event kam se kam ek baar deliver hoga, par ye guarantee nahi karta ki ye bilkul ek baar deliver hoga, kyunki aisa karne ke liye provider ko poora, turant gyaan chahiye hoga ki kya uski pichhli delivery koshish safaltapoorvak mili aur process hui, jo ek asli network par bharosemand taur par mumkin nahi hai. Practice mein, iska matlab hai ek provider wahi event dobara-deliver kar sakta hai agar use jaldi kaafi ek acknowledgment na mile (chahe asli delivery asal mein safal hui ho aur acknowledgment bas deri ya kho gaya ho), agar uske apne internal systems provider ki taraf ek asthaayi issue ki wajah se retry karein, ya doosre operational wajahon se. Ek webhook handler jo maanta hai har event bilkul ek baar aata hai aur apna action bina shart har baar karta hai jab ye ek request paata hai (ek database row update karna, ek confirmation email bhejna, ek counter badhaana) jab bhi ek pehle-se-process-hue event ki ek legitimate redelivery asal mein hoti hai, wahi action doosri baar karega us cheez ke liye jo asal mein sirf ek underlying asli-duniya event thi — ye duplicate emails, do-baar-gini metrics, ya doosre side effects paida kar sakta hai jo business ne iraada nahi kiya tha, poori tarah isliye kyunki application ne galat tarike se ek aisi delivery guarantee maan li jo provider asal mein deta hai us se zyaada mazboot. Ye explicitly check karna ki kya ek diye event ki unique ID pehle se process ho chuki hai us par kaam karne se pehle, bilkul jaisa is course ke pehle wale idempotency lesson ne outbound requests ke liye dikhaaya, wahi hai jo provider ke asli at-least-once delivery model ko sahi tarike se sambhaalta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /webhooks/payment route trusting the payload directly. Using curl, send a forged request with the expected JSON shape but no signature header, and confirm it successfully marks a test order as paid.',
        taskHi: 'Toota \`/webhooks/payment\` route banao jo seedha payload par bharosa kare. \`curl\` istemal karke, ek forge ki hui request bhejo ummeed ki gayi JSON shape ke saath par koi signature header bina, aur confirm karo ye safaltapoorvak ek test order ko paid mark karta hai.',
        hint: 'This forged request needs nothing more than the endpoint URL and knowledge of the expected JSON shape — no special tools or access required, which is exactly the point this exercise demonstrates.',
        hintHi: 'Is forge hui request ko endpoint URL aur ummeed ki gayi JSON shape ki jaankaari se zyaada kuch nahi chahiye — koi khaas tools ya access zaruri nahi, jo bilkul wo point hai jo ye exercise dikhaata hai.',
      },
      {
        task: 'Fix it with HMAC signature verification using express.raw(). Write a small script that correctly computes a valid signature using the shared secret and confirm only that signed request succeeds, while the same forged request from exercise 1 now correctly fails with 400.',
        taskHi: '\`express.raw()\` istemal karte HMAC signature verification se theek karo. Ek chhota script likho jo shared secret istemal karke sahi tarike se ek valid signature calculate kare aur confirm karo sirf wo signed request safal hoti hai, jabki exercise 1 wali wahi forge hui request ab sahi tarike se \`400\` ke saath fail hoti hai.',
        hint: 'Deliberately change a single character in the request body after computing the signature, and confirm verification now correctly fails — this directly demonstrates the signature is tied to the exact body content.',
        hintHi: 'Signature calculate karne ke baad request body mein jaan-boojhkar ek akela character badalo, aur confirm karo verification ab sahi tarike se fail hoti hai — ye seedha dikhaata hai signature bilkul body content se judi hai.',
      },
      {
        task: 'Add the processed_webhook_events table and idempotent handling. Send the exact same valid, signed event twice in a row and confirm the order is marked paid only once, with the second delivery acknowledged but performing no further work.',
        taskHi: '\`processed_webhook_events\` table aur idempotent handling jodo. Bilkul wahi valid, signed event lagaataar do baar bhejo aur confirm karo order sirf ek baar paid mark hota hai, doosri delivery acknowledge hoti hai par koi aage kaam nahi karti.',
        hint: 'Add a temporary console.log inside the "already processed" branch to directly confirm it is reached on the second delivery, rather than just checking the final database state.',
        hintHi: 'Ek asthaayi \`console.log\` "pehle se process hui" branch ke andar jodo seedha confirm karne ke liye ki ye doosri delivery par pahunchti hai, sirf aakhri database sthiti check karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'A webhook endpoint\'s URL is not meaningfully secret — trusting a request\'s payload without verifying its source lets anyone who discovers or guesses the URL forge events and trigger real side effects.',
      'An HMAC signature, computed over the request body using a secret only the provider and application share, lets the application verify a request genuinely came from the provider — an attacker without the secret cannot produce a matching signature.',
      'Signature verification must use the exact raw, unparsed request body bytes (express.raw(), not express.json()) — parsing and re-serializing JSON can subtly change the bytes, causing even a genuine signature to fail verification.',
      'Payment providers typically guarantee "at-least-once" delivery, not "exactly-once" — a webhook handler must tolerate the same event arriving more than once without repeating its side effects.',
      'Checking whether a specific event ID has already been processed before acting on it (recording it once handled) is the same idempotency-key pattern this course covered for outbound requests, applied to inbound webhook events.',
      'A webhook handler should acknowledge quickly (verify the signature, enqueue any slow work) rather than performing lengthy processing inline, since a provider that times out waiting for a response will treat it as a failed delivery and retry.',
    ],
    keyTakeawaysHi: [
      'Ek webhook endpoint ka URL maayne-rakhta secret nahi hai — ek request ke payload par bharosa karna uska source verify kiye bina koi bhi jo URL dhoondh le ya guess kar le events forge karne aur asli side effects trigger karne deta hai.',
      'Ek HMAC signature, request body par calculate hua ek secret istemal karke jise sirf provider aur application share karti hain, application ko verify karne deta hai ki ek request sach mein provider se aayi — secret ke bina ek attacker ek milta signature paida nahi kar sakta.',
      'Signature verification ko bilkul raw, na-parse-hui request body bytes istemal karne chahiye (\`express.raw()\`, \`express.json()\` nahi) — JSON parse aur dobara-serialize karna subtly bytes badal sakta hai, ek asli signature ko bhi verification mein fail karwate hue.',
      'Payment providers aam taur par "at-least-once" delivery guarantee karti hain, "exactly-once" nahi — ek webhook handler ko wahi event ek se zyaada baar aane ko sehna chahiye apne side effects dohraaye bina.',
      'Ye check karna ki kya ek khaas event ID pehle se process ho chuki hai us par kaam karne se pehle (handle hote hi ise record karte hue) bilkul wahi idempotency-key pattern hai jo ye course outbound requests ke liye cover kar chuka hai, aati webhook events par lagu hua.',
      'Ek webhook handler ko jaldi acknowledge karna chahiye (signature verify karo, koi bhi dheema kaam enqueue karo) inline lambi processing karne ke bajaye, kyunki ek provider jo jawaab ka intezaar karte-karte timeout hota hai ise ek fail hui delivery ki tarah treat karega aur retry karega.',
    ],
  },
];
