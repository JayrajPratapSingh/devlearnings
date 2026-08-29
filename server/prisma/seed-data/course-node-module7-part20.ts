/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 20.
 *
 * Distributed tracing across service and job boundaries: this course's
 * earlier structured-logging lesson gave every request its own
 * correlation ID, generated and logged consistently WITHIN one service.
 * This lesson extends the same underlying idea across the boundary
 * between separate services (or a web request handing work off to a
 * background job): propagating that identity forward through every hop
 * via a standard HTTP header, and recording enough timing detail at each
 * hop that a single request's ENTIRE path — across multiple services,
 * potentially over several seconds — can be reconstructed and visualized
 * as one connected timeline. Broken example: a request flows from an API
 * gateway to an orders service to a billing service, each logging its own
 * correlation ID independently, but the ID is never actually forwarded in
 * the outbound request between them, so the three services' logs cannot
 * be connected at all — diagnosing a slow or failing request means
 * manually guessing and cross-referencing timestamps across three
 * separate log streams. Fixed with OpenTelemetry: a trace context header
 * (traceparent) is automatically propagated on every outbound call, each
 * service records its own timed "span" against the same shared trace ID,
 * and a tracing backend stitches every span together into one visual,
 * end-to-end timeline showing exactly which hop took how long.
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

export const NODE_MODULE_7_PART20: CourseLesson[] = [
  {
    slug: 'distributed-tracing-across-services',
    title: 'Distributed Tracing Across Service and Job Boundaries',
    titleHi: 'Service Aur Job Boundaries Ke Aar-Paar Distributed Tracing',
    description: 'A checkout request feels slow, and three separate services logged three separate correlation IDs for what should be the same request — none of them forwarded it to the next hop, so reconstructing what actually happened means manually guessing which log lines, across three different files, even belong together.',
    descriptionHi: 'Ek checkout request dheemi mehsoos hoti hai, aur teen alag services ne teen alag correlation IDs log kiye us cheez ke liye jo wahi request honi chahiye — inmein se kisi ne bhi ise agle hop ko forward nahi kiya, taaki ye reconstruct karna ki asal mein kya hua manmaani taur par anumaan lagaana matlab hai ki kaunsi log lines, teen alag files ke aar-paar, ek saath bhi belong karti hain.',
    difficulty: 'HARD',
    duration: 20,
    order: 20,

    analogy: {
      en: '**An international package shipment carrying one single tracking number that gets scanned and logged at every single hand-off point — the origin warehouse, the truck, the sorting facility, the customs checkpoint, the final delivery van — versus a shipment where each facility keeps its own completely separate internal paperwork, with no shared tracking number carried forward from one facility to the next.** With a single tracking number scanned at every checkpoint, anyone can enter that one number into a tracking website and see the package\'s entire journey as one connected timeline — it left the origin warehouse at 2:00 PM, sat at the sorting facility until 6:00 PM, cleared customs by 8:00 PM, and was out for delivery by 9:00 AM the next day — instantly showing exactly which leg of the journey took unusually long. Without a shared tracking number, if a customer complains their package took three extra days, finding out why requires contacting the origin warehouse, the trucking company, the sorting facility, and customs separately, hoping each one kept good-enough internal records, and manually guessing which of their entries, across four entirely separate paperwork systems, might correspond to the same physical package — a slow, error-prone reconstruction that may never actually succeed. Distributed tracing is exactly the shared tracking number applied to a request that travels through multiple services: every service the request touches records its own timed entry against the exact same shared identifier, so the request\'s entire journey — across every service it touched — can be reconstructed and viewed as one connected timeline, immediately showing which specific hop was the slow one, rather than requiring someone to manually cross-reference separate, disconnected logs from every service involved and hope the timestamps happen to line up.',
      hi: '**Ek international package shipment jo ek akela tracking number le kar chalti hai jo har akele hand-off point par scan aur log kiya jaata hai — origin warehouse, truck, sorting facility, customs checkpoint, aakhri delivery van — versus ek shipment jahan har facility apna khud ka poori tarah alag internal paperwork rakhti hai, koi shared tracking number ek facility se agli tak aage na le jaate hue.** Ek akele tracking number ke saath jo har checkpoint par scan hota hai, koi bhi us ek number ko ek tracking website mein daal sakta hai aur package ki poori yatra ek jude hue timeline ki tarah dekh sakta hai — ye origin warehouse se 2:00 PM ko nikla, sorting facility mein 6:00 PM tak baitha raha, 8:00 PM tak customs clear hua, aur agle din 9:00 AM tak delivery ke liye nikal chuka tha — turant bilkul dikhaate hue ki yatra ka kaunsa hissa asaadhaaran roop se lamba laga. Ek shared tracking number bina, agar ek customer shikaayat karta hai ki unka package teen extra din laga, ye pata lagaana ki kyun origin warehouse, trucking company, sorting facility, aur customs se alag-alag sampark karna maangta hai, umeed karte hue ki har ek ne kaafi achhe internal records rakhe, aur manmaani taur par anumaan lagaana ki unke entries mein se kaunsi, chaar poori tarah alag paperwork systems ke aar-paar, wahi physical package se mel khaa sakti hai — ek dheema, galti-prone reconstruction jo shaayad asal mein kabhi safal na ho. Distributed tracing bilkul wahi shared tracking number hai jo ek request par lagu kiya jaata hai jo kai services se guzarti hai: har service jise request chhooti hai apni khud ki timed entry bilkul usi shared identifier ke khilaaf record karti hai, taaki request ki poori yatra — har service jise ye chhoo — reconstruct aur ek jude hue timeline ki tarah dekhi jaa sake, turant dikhaate hue ki khaas taur par kaunsa hop dheema tha, kisi ko shaamil har service se alag, na-jude logs ko manually cross-reference karne aur umeed karne ke bajaye ki timestamps kisi tarah line up ho jaayein.',
    },

    simple: `**Start broken.** A correlation ID exists per service, but is never forwarded to the next one:

\`\`\`js
// API gateway
app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  logger.info("Request received", { correlationId: req.correlationId });
  next();
});

app.post("/checkout", async (req, res) => {
  const order = await axios.post("http://orders-service/orders", req.body); // no correlation ID forwarded!
  res.json(order.data);
});
\`\`\`

This course\'s earlier structured-logging lesson correctly gives every request a correlation ID, logged consistently throughout a single service — but that ID lives entirely inside the API gateway\'s own request object, and the outbound call to \`orders-service\` never includes it anywhere. \`orders-service\` receives this request with no idea a correlation ID even exists for it, so it generates its OWN, entirely unrelated correlation ID for its own logs, and if it in turn calls \`billing-service\`, the exact same disconnect repeats. The result is three services\' worth of logs, each internally well-organized around its own correlation ID, but with absolutely no way to determine which log lines across the three separate log streams actually belong to the same original checkout request — reconstructing what happened during one slow or failing checkout means manually guessing based on approximate timestamps, across three unrelated systems, and hoping the guess is right.

**The fix: propagate a shared trace context on every outbound call**

\`\`\`js
const { trace, context, propagation } = require("@opentelemetry/api");

app.post("/checkout", async (req, res) => {
  const headers = {};
  propagation.inject(context.active(), headers); // injects a "traceparent" header automatically
  const order = await axios.post("http://orders-service/orders", req.body, { headers });
  res.json(order.data);
});
\`\`\`

\`\`\`ts
import { context, propagation } from "@opentelemetry/api";

app.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  const headers: Record<string, string> = {};
  propagation.inject(context.active(), headers);
  const order = await axios.post("http://orders-service/orders", req.body, { headers });
  res.json(order.data);
});
\`\`\`

OpenTelemetry\'s \`propagation.inject\` automatically adds a standard \`traceparent\` header (following the W3C Trace Context specification) to the outbound request, carrying the current trace\'s identity forward. \`orders-service\`, instrumented the same way, automatically reads that incoming \`traceparent\` header and creates its own span as a CHILD of the same trace, rather than starting an unrelated one — and if it calls \`billing-service\` next, the same propagation happens again. Every service\'s spans, all recorded against the same underlying trace ID, are sent to a tracing backend (like Jaeger or a hosted equivalent) that automatically stitches them together into a single, connected, visual timeline — showing the request entering the gateway, then orders-service, then billing-service, with exact timing for each hop, making it immediately obvious which specific service was responsible for a slow or failing request, without ever needing to manually cross-reference separate logs by hand.`,

    simpleHi: `**Toote hue se shuru.** Ek correlation ID prati-service maujood hai, par kabhi agli ko forward nahi kiya jaata:

\`\`\`js
// API gateway
app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  logger.info("Request received", { correlationId: req.correlationId });
  next();
});

app.post("/checkout", async (req, res) => {
  const order = await axios.post("http://orders-service/orders", req.body); // koi correlation ID forward nahi hua!
  res.json(order.data);
});
\`\`\`

Is course ka pehle wala structured-logging lesson sahi tarike se har request ko ek correlation ID deta hai, ek akeli service ke andar consistently log kiya jaata hai — par wo ID poori tarah API gateway ke apne request object ke andar rehta hai, aur \`orders-service\` ko jaati bahari call use kahin bhi shaamil nahi karti. \`orders-service\` is request ko paata hai bina kisi jaankaari ke ki iske liye ek correlation ID maujood bhi hai, isliye ye apne khud ke logs ke liye apni KHUD, poori tarah na-jude correlation ID generate karta hai, aur agar ye badle mein \`billing-service\` ko call karta hai, bilkul wahi disconnect dohraata hai. Nateeja teen services ke logs ka hissa hai, har ek internally apni khud ki correlation ID ke aas-paas achhi tarah organize, par bilkul koi tarika bina ki tay kiya jaaye ki teen alag log streams ke aar-paar kaunsi log lines asal mein wahi asli checkout request se belong karti hain — ye reconstruct karna ki ek dheeme ya fail hote checkout ke dauraan kya hua manmaani taur par lagbhag timestamps ke aadhaar par anumaan lagaana hai, teen na-judi systems ke aar-paar, aur umeed karna ki anumaan sahi hai.

**Fix: har bahari call par ek shared trace context propagate karo**

\`\`\`js
const { trace, context, propagation } = require("@opentelemetry/api");

app.post("/checkout", async (req, res) => {
  const headers = {};
  propagation.inject(context.active(), headers); // automatically ek "traceparent" header inject karta hai
  const order = await axios.post("http://orders-service/orders", req.body, { headers });
  res.json(order.data);
});
\`\`\`

\`\`\`ts
import { context, propagation } from "@opentelemetry/api";

app.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  const headers: Record<string, string> = {};
  propagation.inject(context.active(), headers);
  const order = await axios.post("http://orders-service/orders", req.body, { headers });
  res.json(order.data);
});
\`\`\`

OpenTelemetry ka \`propagation.inject\` automatically bahari request mein ek standard \`traceparent\` header jodta hai (W3C Trace Context specification ka palan karte hue), current trace ki pehchaan aage le jaate hue. \`orders-service\`, usi tarah instrumented, automatically us aate \`traceparent\` header ko padhta hai aur apna khud ka span usi trace ke ek CHILD ki tarah banaata hai, ek na-jude ek shuru karne ke bajaye — aur agar ye \`billing-service\` ko agle call karta hai, wahi propagation dobara hota hai. Har service ke spans, sab wahi underlying trace ID ke khilaaf record kiye gaye, ek tracing backend (jaise Jaeger ya ek hosted equivalent) ko bheje jaate hain jo automatically unhe ek akele, jude hue, visual timeline mein sil deta hai — request ko gateway mein daakhil hote hue dikhaate hue, phir orders-service, phir billing-service, har hop ke liye exact timing ke saath, turant zaahir karte hue ki khaas taur par kaunsi service ek dheemi ya fail hoti request ke liye zimmedaar thi, kabhi manually haath se alag logs cross-reference karne ki zaroorat bina.`,

    content: `## Correlation IDs within a service vs. distributed tracing across services

\`\`\`
This course's structured-logging lesson: one correlation ID, generated
once per request, logged consistently within ONE service's own logs.

This lesson: the SAME underlying identity, propagated forward across
every service boundary the request crosses, with each service adding
its own timed span to the same shared trace.
\`\`\`

The structured-logging lesson this course covered earlier solves a real problem within the boundary of a single service: every log line related to one request carries the same correlation ID, making it possible to filter that one service\'s logs down to exactly the lines belonging to one specific request. Distributed tracing extends the identical underlying idea across a boundary that correlation IDs alone do not cross automatically: when a request causes one service to call another (or to enqueue a background job, per this course\'s earlier job-queue lesson), the SAME shared identity needs to travel forward into that next service or job, so its own logs and timing can be connected back to the very same original request, rather than starting over with an entirely unrelated identifier.

## The W3C Trace Context standard: a shared, portable trace identity

\`\`\`
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  │                                │                │
          version  trace-id (shared across       parent span-id  flags
                    every service in this trace)
\`\`\`

Rather than every team or company inventing its own header format for propagating a request\'s identity across services, the W3C Trace Context specification defines a single, standard \`traceparent\` HTTP header format that OpenTelemetry (and most modern tracing tools) generate and understand automatically. The \`trace-id\` portion stays IDENTICAL across every single service a request passes through — it is the one shared identity every service\'s spans are recorded against — while the \`parent span-id\` changes at each hop, recording which specific operation, in which specific service, directly caused the next one. Because this is a standard, widely-adopted format rather than something proprietary, services written by different teams, using different languages, or built with different tracing libraries can still participate in the same trace correctly, as long as each one properly reads the incoming header and forwards it on its own outbound calls.

## Spans: a timed record of one unit of work, nested to reflect causality

\`\`\`
Trace: "POST /checkout" (total: 340ms)
├─ Span: api-gateway "handle request" (340ms)
│  └─ Span: orders-service "create order" (210ms)
│     └─ Span: billing-service "charge card" (180ms)
│        └─ Span: billing-service "call Stripe" (150ms)
\`\`\`

A "span" is a single, timed unit of work within a trace — a specific operation, with its own start time, end time, and any relevant metadata (which service, which operation, any error that occurred), recorded as one entry among potentially many that together make up the full trace. Spans are nested to reflect actual causality: the \`orders-service\` span exists because the \`api-gateway\` span\'s handling of the request caused it, and the \`call Stripe\` span exists because \`billing-service\`\'s own \`charge card\` operation caused that specific outbound call — this nesting, once visualized by a tracing backend, immediately shows not just how long the overall request took, but exactly which nested operation, at which specific depth in the chain, consumed the bulk of that time (in this example, the outbound call to Stripe itself, at 150ms out of the request\'s total 340ms, is clearly the dominant cost).

## Instrumenting Node.js automatically, and connecting it to a background job

\`\`\`js
// One-time setup, typically at the very top of the application's entry point
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()], // auto-instruments http, express, pg, redis, etc.
});
sdk.start();
\`\`\`

OpenTelemetry\'s auto-instrumentation packages patch common Node.js libraries (Express\'s routing, the built-in \`http\` module, popular database and Redis clients) automatically, creating and propagating spans for incoming requests, outgoing HTTP calls, and database queries without requiring manual span-creation code scattered throughout the application — a small amount of one-time setup at startup covers the overwhelming majority of a typical service\'s traceable operations. The same underlying trace context can also be attached to a background job\'s payload when it\'s enqueued (this course\'s earlier background-jobs lesson) — the worker that eventually processes that job reads the attached trace context and creates its own span as a continuation of the same original trace, so a request that appears to "complete" instantly from the user\'s perspective, but triggers asynchronous work minutes later, still shows up as part of the same connected trace when that background work eventually runs.`,

    contentHi: `## Ek service ke andar correlation IDs vs. services ke aar-paar distributed tracing

\`\`\`
Is course ka structured-logging lesson: ek correlation ID, prati-request
ek baar generate hua, ek AKELI service ke apne logs ke andar
consistently log kiya gaya.

Ye lesson: WAHI underlying pehchaan, har service boundary ke aar-paar
propagate ki gayi jise request paar karti hai, har service usi shared
trace mein apna khud ka timed span jodte hue.
\`\`\`

Is course ne pehle cover kiya structured-logging lesson ek akeli service ki boundary ke andar ek asli samasya sulajhaata hai: ek request se mutaalliq har log line wahi correlation ID le kar chalti hai, us ek service ke logs ko filter karke bilkul un lines tak lana mumkin banaate hue jo ek khaas request se belong karti hain. Distributed tracing bilkul wahi underlying dhaarna ek aisi boundary ke aar-paar badhaata hai jise akele correlation IDs automatically paar nahi karte: jab ek request ek service ko doosri call karwaata hai (ya ek background job enqueue karwaata hai, is course ke pehle wale job-queue lesson ke hisaab se), WAHI shared pehchaan agli service ya job mein aage jaani chahiye, taaki uske apne logs aur timing ko bilkul usi asli request se wapas joda jaa sake, ek poori tarah na-judi identifier se dobara shuru karne ke bajaye.

## W3C Trace Context standard: ek shared, portable trace pehchaan

\`\`\`
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  │                                │                │
          version  trace-id (is trace ki har     parent span-id  flags
                    service ke aar-paar shared)
\`\`\`

Har team ya company ke services ke aar-paar ek request ki pehchaan propagate karne ke liye apna khud ka header format banaane ke bajaye, W3C Trace Context specification ek akela, standard \`traceparent\` HTTP header format define karti hai jise OpenTelemetry (aur zyaadatar modern tracing tools) automatically generate aur samajhte hain. \`trace-id\` hissa har akeli service ke aar-paar IDENTICAL rehta hai jise ek request se guzarti hai — ye ek shared pehchaan hai jiske khilaaf har service ke spans record kiye jaate hain — jabki \`parent span-id\` har hop par badalta hai, ye record karte hue ki khaas taur par kaunsa operation, kaunsi khaas service mein, seedhe agle ka kaaran bana. Kyunki ye ek standard, vyaapak roop se apnaayi gayi format hai kisi proprietary cheez ke bajaye, alag teams dwara likhi, alag languages istemal karti, ya alag tracing libraries ke saath banaayi gayi services phir bhi usi trace mein sahi tarike se hissa le sakti hain, jab tak har ek aate header ko sahi tarike se padhti hai aur apni bahari calls par use aage forward karti hai.

## Spans: kaam ki ek unit ka ek timed record, causality darsaane ke liye nested

\`\`\`
Trace: "POST /checkout" (kul: 340ms)
├─ Span: api-gateway "handle request" (340ms)
│  └─ Span: orders-service "create order" (210ms)
│     └─ Span: billing-service "charge card" (180ms)
│        └─ Span: billing-service "call Stripe" (150ms)
\`\`\`

Ek "span" ek trace ke andar kaam ki ek akeli, timed unit hai — ek khaas operation, apne khud ke start time, end time, aur kisi bhi mutaalliq metadata (kaunsi service, kaunsa operation, koi bhi hua error) ke saath, ek entry ki tarah record ki gayi sambhaavit roop se kai mein se jo saath poora trace banaati hain. Spans asli causality darsaane ke liye nested hote hain: \`orders-service\` span maujood hai kyunki \`api-gateway\` span ke request handle karne ne ise cause kiya, aur \`call Stripe\` span maujood hai kyunki \`billing-service\` ke apne \`charge card\` operation ne us khaas bahari call ko cause kiya — ye nesting, ek baar ek tracing backend dwara visualize hone par, turant sirf ye nahi dikhaati ki poori request mein kitna waqt laga, balki bilkul ye ki kaunsa nested operation, chain mein kis khaas gehraai par, us waqt ka zyaada hissa istemal kiya (is misal mein, Stripe ko khud bahari call, request ke kul 340ms mein se 150ms, saaf taur par pradhan keemat hai).

## Node.js ko automatically instrument karna, aur ise ek background job se jodna

\`\`\`js
// Ek-baar setup, aam taur par application ke entry point ke bilkul oopar
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()], // http, express, pg, redis, etc. ko auto-instrument karta hai
});
sdk.start();
\`\`\`

OpenTelemetry ke auto-instrumentation packages aam Node.js libraries (Express ki routing, built-in \`http\` module, popular database aur Redis clients) ko automatically patch karte hain, aati requests, jaati HTTP calls, aur database queries ke liye spans banaate aur propagate karte hue poori application mein manual span-creation code bikhraaye bina — startup par ek-baar ka thoda setup ek aam service ke traceable operations ke bahut bade hisse ko cover karta hai. Wahi underlying trace context ek background job ke payload se bhi joda jaa sakta hai jab ye enqueue hota hai (is course ke pehle wale background-jobs lesson ke hisaab se) — worker jo aakhirkaar us job ko process karta hai attach kiye gaye trace context ko padhta hai aur usi asli trace ki ek continuation ki tarah apna khud ka span banaata hai, taaki ek request jo user ke nazariye se turant "poori" hoti dikhti hai, par kuch minute baad asynchronous kaam trigger karti hai, phir bhi usi jude hue trace ka hissa dikhti hai jab wo background kaam aakhirkaar chalta hai.`,

    examples: [
      {
        title: 'Broken: correlation ID never forwarded to the next service',
        titleHi: 'Toota: correlation ID kabhi agli service ko forward nahi hua',
        code: `app.post("/checkout", async (req, res) => {
  const order = await axios.post("http://orders-service/orders", req.body);
  res.json(order.data);
});
// orders-service has no idea this call belongs to any specific request`,
        codeJs: `app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  logger.info("Request received", { correlationId: req.correlationId });
  next();
});

app.post("/checkout", async (req, res) => {
  logger.info("Calling orders-service", { correlationId: req.correlationId });
  const order = await axios.post("http://orders-service/orders", req.body); // ID never sent
  res.json(order.data);
});`,
        codeTs: `app.use((req: Request, res: Response, next: NextFunction): void => {
  (req as any).correlationId = crypto.randomUUID();
  next();
});

app.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  const order = await axios.post("http://orders-service/orders", req.body);
  res.json(order.data);
});
// Correctly typed, completely valid TypeScript — the gap is entirely
// about what's forwarded over the wire, not a type error.`,
        output: `gateway.log: correlationId=abc123 "Calling orders-service"
orders-service.log: correlationId=xyz789 "Creating order"
// No way to determine these two log lines belong to the same request`,
        explain: 'The correlation ID lives only in the gateway\'s own request object — nothing about the outbound HTTP call carries it forward to orders-service.',
        explainHi: 'Correlation ID sirf gateway ke apne request object mein rehta hai — bahari HTTP call ke baare mein kuch bhi ise \`orders-service\` tak aage nahi le jaata.',
      },
      {
        title: 'Fixed: OpenTelemetry propagates a shared trace context automatically',
        titleHi: 'Theek: OpenTelemetry ek shared trace context automatically propagate karta hai',
        code: `const headers = {};
propagation.inject(context.active(), headers);
await axios.post("http://orders-service/orders", req.body, { headers });`,
        codeJs: `const { context, propagation } = require("@opentelemetry/api");

app.post("/checkout", async (req, res, next) => {
  try {
    const headers = {};
    propagation.inject(context.active(), headers); // adds "traceparent" automatically
    const order = await axios.post("http://orders-service/orders", req.body, { headers });
    res.json(order.data);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { context, propagation } from "@opentelemetry/api";

app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const headers: Record<string, string> = {};
    propagation.inject(context.active(), headers);
    const order = await axios.post("http://orders-service/orders", req.body, { headers });
    res.json(order.data);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `orders-service (also instrumented) automatically reads the incoming
traceparent header and creates its own span as a child of the same
trace — both services' spans now share one trace ID.`,
        outputTs: `// Identical behaviour. A tracing backend (Jaeger, or a hosted
// equivalent) stitches every span sharing this trace ID into one
// connected, visual timeline automatically.`,
        explain: 'propagation.inject adds the standard traceparent header carrying the current trace\'s identity forward — the receiving service reads it and joins the same trace rather than starting a new, unrelated one.',
        explainHi: '\`propagation.inject\` standard \`traceparent\` header jodta hai jo current trace ki pehchaan aage le jaata hai — receiving service ise padhti hai aur usi trace mein shaamil hoti hai ek naya, na-juda shuru karne ke bajaye.',
      },
      {
        title: 'Auto-instrumenting Node.js with a one-time setup file',
        titleHi: 'Ek-baar ke setup file se Node.js ko auto-instrument karna',
        code: `const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] }).start();`,
        codeJs: `// tracing.js — required before anything else, e.g. via
// node --require ./tracing.js server.js
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();`,
        codeTs: `// tracing.ts — identical setup, TypeScript-typed
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();`,
        outputJs: `Express routes, outbound HTTP calls, and database queries are
automatically wrapped in spans with no manual instrumentation code
scattered throughout the application's actual route handlers.`,
        outputTs: `// Identical behaviour. Auto-instrumentation covers the overwhelming
// majority of a typical service's traceable operations from one
// small, centralized setup file.`,
        explain: 'Auto-instrumentation patches common libraries (Express, http, database clients) to create and propagate spans automatically, avoiding the need to manually add tracing code to every route.',
        explainHi: 'Auto-instrumentation aam libraries (Express, \`http\`, database clients) ko patch karta hai automatically spans banaane aur propagate karne ke liye, har route mein manually tracing code jodne ki zaroorat se bachte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `const order = await axios.post("http://orders-service/orders", req.body);
// no trace context forwarded — orders-service's logs can't be connected back`,
        right: `const headers = {};
propagation.inject(context.active(), headers);
const order = await axios.post("http://orders-service/orders", req.body, { headers });`,
        why: 'A correlation ID or trace context that exists in one service but is never forwarded on outbound calls provides no benefit once a request crosses into a second service.',
        whyHi: 'Ek correlation ID ya trace context jo ek service mein maujood hai par bahari calls par kabhi forward nahi hota koi fayda nahi deta ek baar request doosri service mein chali jaaye.',
      },
      {
        wrong: `// Manually inventing a custom correlation-ID header format per team/service
headers["x-my-custom-trace-id"] = generateId(); // incompatible with other teams' services`,
        right: `// Use the standard traceparent header (W3C Trace Context) that
// OpenTelemetry generates and understands automatically
propagation.inject(context.active(), headers);`,
        why: 'A custom, non-standard trace-propagation format only works if every single service, across every team, agrees to implement it identically — a standard format works across services regardless of team, language, or library.',
        whyHi: 'Ek custom, na-standard trace-propagation format sirf tab kaam karta hai jab har akeli service, har team ke aar-paar, ise identical roop se implement karne ke liye sehmat ho — ek standard format team, language, ya library se bekhabar services ke aar-paar kaam karta hai.',
      },
      {
        wrong: `// A background job enqueued with no trace context attached
queue.add("send-email", { userId, template }); // untraceable once picked up by a worker`,
        right: `const headers = {};
propagation.inject(context.active(), headers);
queue.add("send-email", { userId, template, traceContext: headers });
// the worker reads traceContext and continues the same trace`,
        why: 'A background job enqueued without attaching the current trace context becomes an untraceable island — its eventual processing can no longer be connected back to the request that triggered it.',
        whyHi: 'Ek background job jo current trace context attach kiye bina enqueue hota hai ek na-traceable island ban jaata hai — uska aakhirkaar process hona ab us request se wapas nahi joda jaa sakta jisne ise trigger kiya.',
      },
    ],

    realWorld: [
      {
        en: '**OpenTelemetry is the industry-standard, vendor-neutral framework for distributed tracing, adopted broadly across the industry** specifically so instrumentation code doesn\'t need to be rewritten for every different tracing backend a company might choose.',
        hi: '**OpenTelemetry distributed tracing ke liye industry-standard, vendor-neutral framework hai, jise industry mein vyaapak roop se apnaaya gaya hai** khaas taur par taaki instrumentation code ko har alag tracing backend ke liye dobara likhne ki zaroorat na ho jise ek company chun sakti hai.',
      },
      {
        en: '**The W3C Trace Context specification\'s traceparent header is a formally standardized web specification**, specifically designed so services built by different teams, in different languages, can participate correctly in the same distributed trace.',
        hi: '**W3C Trace Context specification ka \`traceparent\` header ek formally standardized web specification hai**, khaas taur par is tarah design ki gayi ki alag teams dwara, alag languages mein bani services usi distributed trace mein sahi tarike se hissa le sakein.',
      },
      {
        en: '**Distributed tracing is commonly cited as one of the "three pillars of observability" alongside logs and metrics** (this course\'s earlier lessons), specifically because it answers a question neither logs nor metrics alone can: exactly how a single request behaved across every service it touched.',
        hi: '**Distributed tracing ko aam taur par logs aur metrics (is course ke pehle wale lessons) ke saath "observability ke teen stambh" mein se ek ki tarah cite kiya jaata hai**, khaas taur par isliye kyunki ye ek aisa sawaal jawaab deta hai jo akele logs ya akele metrics nahi de sakte: bilkul ki ek akeli request har us service ke aar-paar kaisa vyavhaar karti hai jise ye chhuti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the correlation ID pattern from this course\'s structured-logging lesson stop being sufficient once a single request spans multiple separate services?',
        qHi: 'Is course ke structured-logging lesson ka correlation ID pattern ek akeli request ke kai alag services ke aar-paar phailne par kaafi hona kyun band ho jaata hai?',
        a: 'The correlation ID pattern from the structured-logging lesson solves a specific, narrower problem: within the boundary of one running service, generate an identifier once when a request arrives, and ensure every subsequent log line produced while handling that request includes it, so the service\'s own logs can later be filtered down to exactly the lines belonging to one specific request. This works because the identifier is created and consistently attached to every log call within a single, continuously executing request-handling flow inside one process. The moment that same logical request causes a call to a genuinely separate service — a completely different running process, potentially on a different machine, with its own entirely independent logging setup — the correlation ID generated by the first service has no automatic way to reach the second one at all; nothing about calling another service over HTTP or another transport inherently carries that identifier along unless something in the code deliberately puts it there. Without deliberate propagation, the second service, receiving what looks to it like a perfectly ordinary incoming request, generates its own, entirely separate correlation ID scoped only to its own internal logs, with no relationship whatsoever to the first service\'s ID. The result is that each service\'s own internal logs remain well-organized and useful in isolation, but there exists no way to answer the genuinely important cross-service question — "what happened, across every service touched, for this one specific end-user request" — since nothing links the separate identifiers together at all. Solving this requires an additional mechanism specifically for propagating a shared identity across the service boundary itself, which is exactly the gap distributed tracing and its trace-context propagation are designed to close.',
        aHi: 'Structured-logging lesson ka correlation ID pattern ek khaas, sankuchit samasya sulajhaata hai: ek chalti service ki boundary ke andar, ek identifier ek baar generate karo jab ek request aati hai, aur sunishchit karo ki us request ko handle karte waqt paida hui har agli log line ise shaamil kare, taaki service ke apne logs ko baad mein bilkul un lines tak filter kiya jaa sake jo ek khaas request se belong karti hain. Ye kaam karta hai kyunki identifier ek akele, lagaataar chalte request-handling flow ke andar ek process ke andar banaaya aur har log call ke saath consistently juda jaata hai. Jis pal wahi logical request ek sach mein alag service ko ek call karwaati hai — ek poori tarah alag chalta process, sambhaavit roop se ek alag machine par, apne khud ke poori tarah swatantra logging setup ke saath — pehli service dwara generate ki gayi correlation ID ke paas doosri tak pahunchne ka bilkul koi automatic tarika nahi hai; doosri service ko HTTP ya kisi doosre transport ke zariye call karne ke baare mein kuch bhi buniyaadi taur par us identifier ko saath nahi le jaata jab tak code mein kuch jaan-boojhkar use wahaan na daale. Jaan-boojhkar propagation bina, doosri service, jise ye ek bilkul saadhaaran aati request ki tarah dikhti hai, apni khud, poori tarah alag correlation ID generate karti hai jo sirf apne internal logs tak scoped hai, pehli service ki ID se koi rishta bina. Nateeja ye hai ki har service ke apne internal logs akele mein achhi tarah organize aur upyogi rehte hain, par asli maayne-rakhta cross-service sawaal ka jawaab dene ka koi tarika maujood nahi hai — "is ek khaas end-user request ke liye, chhui gayi har service mein kya hua" — kyunki kuch bhi alag identifiers ko bilkul aapas mein nahi jodta. Ise sulajhaane ke liye khaas taur par service boundary ke aar-paar ek shared pehchaan propagate karne ke liye ek additional mechanism chahiye, jo bilkul wahi gap hai jise distributed tracing aur uska trace-context propagation band karne ke liye design kiya gaya hai.',
      },
      {
        q: 'What is the specific purpose of the W3C Trace Context standard, and why does it matter that trace propagation follows a shared standard rather than each team inventing its own header format?',
        qHi: 'W3C Trace Context standard ka khaas maqsad kya hai, aur trace propagation ka ek shared standard ka palan karna kyun maayne rakhta hai har team ka apna khud ka header format banaane ke bajaye?',
        a: 'The W3C Trace Context specification defines a precise, standardized format for the traceparent HTTP header specifically used to propagate a distributed trace\'s identity — its trace ID, the ID of the specific span that directly caused the current operation, and some basic flags — from one service to the next over an ordinary HTTP request. Its purpose is to give every service participating in a distributed trace a single, unambiguous, universally-understood way to both read an incoming trace context and write an outgoing one, regardless of which specific tracing tool, library, or vendor that particular service happens to use internally. This matters enormously in any real system built from multiple services, because those services are very often built by different teams, sometimes in different programming languages, sometimes using entirely different tracing libraries or observability vendors chosen independently by each team for their own reasons. If trace propagation instead relied on each team inventing and implementing its own custom header format, every single pair of services that need to correctly hand off trace context to one another would require both teams to specifically agree on, implement, and keep synchronized their own bespoke format — a combinatorial coordination problem that becomes increasingly unmanageable as the number of distinct services and teams grows, and one that would break immediately the moment any single team\'s implementation drifted even slightly from another\'s expectations. Adopting the shared, standardized traceparent format instead means any service, written by any team, using any OpenTelemetry-compatible tracing library regardless of vendor, can correctly participate in the exact same distributed trace as any other such service, because they are all reading and writing the identical, formally specified header format rather than a collection of mutually incompatible bespoke ones.',
        aHi: 'W3C Trace Context specification \`traceparent\` HTTP header ke liye ek sateek, standardized format define karti hai jo khaas taur par ek distributed trace ki pehchaan propagate karne ke liye istemal hota hai — uski trace ID, us khaas span ki ID jisne seedhe current operation ko cause kiya, aur kuch buniyaadi flags — ek service se agli tak ek aam HTTP request ke zariye. Iska maqsad ek distributed trace mein hissa le rahi har service ko ek akela, asandigdh, sarvavyaapi-roop-se-samjha-jaane-waala tarika dena hai jismein wo dono ek aati trace context padh sake aur ek jaati likh sake, chahe wo khaas service internally kaunsa tracing tool, library, ya vendor istemal karti ho. Ye kisi bhi asli system mein bahut zyaada maayne rakhta hai jo kai services se bana ho, kyunki wo services aksar alag teams dwara banaayi jaati hain, kabhi-kabhi alag programming languages mein, kabhi-kabhi poori tarah alag tracing libraries ya observability vendors istemal karte hue jo har team ne apni khud ki wajahon se azaad taur par chune hain. Agar trace propagation iske bajaye har team ke apna khud ka custom header format banaane aur implement karne par nirbhar hota, services ka har akela jodaa jise sahi tarike se ek doosre ko trace context sonpna hai dono teams ko khaas taur par apne khud ke banaaye format par sehmat hona, implement karna, aur synchronized rakhna maangta — ek combinatorial coordination samasya jo alag services aur teams ki tadaad badhne ke saath badhti hui na-sambhaalne-laayak ban jaati hai, aur ek jo turant tootegi jis pal kisi bhi ek team ka implementation doosre ki umeedon se thoda bhi bhatak jaaye. Shared, standardized \`traceparent\` format apnaana iske bajaye matlab hai koi bhi service, kisi bhi team dwara likhi, kisi bhi vendor se bekhabar kisi bhi OpenTelemetry-compatible tracing library istemal karti, kisi bhi doosri aisi service jaisi bilkul usi distributed trace mein sahi tarike se hissa le sakti hai, kyunki wo sab identical, formally specified header format padh aur likh rahe hain ek doosre se asangat bespoke formats ke ek sangrah ke bajaye.',
      },
      {
        q: 'Why is it important to attach the current trace context to a background job\'s payload when it\'s enqueued, rather than only propagating trace context between synchronous HTTP calls?',
        qHi: 'Ek background job ke payload mein current trace context ko enqueue hote waqt attach karna zaruri kyun hai, sirf synchronous HTTP calls ke beech trace context propagate karne ke bajaye?',
        a: 'Distributed tracing\'s core value comes from being able to reconstruct the complete, connected journey of one original request across every piece of work that request eventually caused, regardless of how that work is structured or when it actually executes. This course\'s earlier background-jobs lesson established that a web request handling something time-consuming often doesn\'t perform that work directly and synchronously; instead, it enqueues a job describing the work and returns a response to the user quickly, while a separate worker process picks up and actually performs that job at some later point, potentially seconds, minutes, or even longer after the original request completed and its own trace context would otherwise have ended. If the trace context present at the moment the job is enqueued is not deliberately captured and attached to that job\'s own payload, the connection between the original request and the eventual background work is entirely lost the instant the job is placed on the queue — when a worker later picks up and processes that job, it has no information at all connecting its own work back to whichever original request caused it, and any span it creates for that processing starts an entirely new, disconnected trace with no relationship to the original one. This means a slow or failing piece of background processing becomes just as untraceable back to its origin as the earlier example of an un-propagated correlation ID between two synchronous services — an entire category of real, user-impacting problems (a welcome email that never sends, a report that\'s generated incorrectly) becomes effectively invisible in tracing precisely because the connecting thread was silently dropped at the queue boundary. Deliberately capturing the active trace context at the moment of enqueueing, and having the worker read it back out and continue the same trace when it eventually processes the job, closes this gap, ensuring the complete, true, end-to-end path of a request — synchronous and asynchronous portions alike — remains reconstructable as a single connected trace.',
        aHi: 'Distributed tracing ki mool keemat ek asli request ki poori, jude hui yatra ko har us kaam ke aar-paar reconstruct kar paane se aati hai jo us request ne aakhirkaar cause kiya, chahe wo kaam kaise structure kiya gaya ho ya asal mein kab chalta hai. Is course ka pehle wala background-jobs lesson sthaapit karta hai ki koi samay-lene-waali cheez sambhaalti ek web request aksar wo kaam seedhe aur synchronously nahi karti; iske bajaye, ye kaam varnan karta ek job enqueue karti hai aur user ko turant ek response lautaati hai, jabki ek alag worker process baad ke kisi point par us job ko uthaakar asal mein poora karta hai, sambhaavit roop se asli request poori hone ke seconds, minutes, ya us se bhi zyaada baad aur uska apna trace context iske alaawa khatam ho chuka hota. Agar job enqueue hone ke pal maujood trace context ko jaan-boojhkar capture nahi kiya jaata aur us job ke apne payload se attach nahi kiya jaata, asli request aur aakhirkaar background kaam ke beech ka rishta job queue par rakhe jaate hi poori tarah kho jaata hai — jab ek worker baad mein us job ko uthaakar process karta hai, uske paas apne kaam ko us asli request se wapas jodne ki koi jaankaari bilkul nahi hoti jisne ise cause kiya, aur wo us processing ke liye jo bhi span banaata hai ek poori tarah naya, na-juda trace shuru karta hai asli se koi rishta bina. Iska matlab hai background processing ka ek dheema ya fail hota tukda apne origin tak utna hi na-traceable ban jaata hai jitna do synchronous services ke beech ek na-propagate ki gayi correlation ID ka pehle wala misal — asli, user-ko-asar-karti samasyaon ki ek poori category (ek welcome email jo kabhi nahi bhejta, ek report jo galat generate hoti hai) tracing mein asar mein na-dikhti ban jaati hai bilkul isliye kyunki jodta dhaaga queue boundary par chupke se gir gaya. Enqueue hone ke pal saqriya trace context ko jaan-boojhkar capture karna, aur worker ko ise wapas padhkar usi trace ko continue karne dena jab ye aakhirkaar job process karta hai, is gap ko band karta hai, sunishchit karte hue ki ek request ka poora, sahi, end-to-end path — synchronous aur asynchronous hisse dono — ek akele jude hue trace ki tarah reconstruct-laayak rehta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build two small Express services (a gateway and an orders-service) where the gateway calls orders-service over HTTP without forwarding any trace context. Log a correlation ID in each service independently and confirm you cannot tell which log lines correspond to the same request.',
        taskHi: 'Do chhote Express services banaao (ek gateway aur ek orders-service) jahan gateway HTTP ke zariye orders-service ko call karta hai koi trace context forward kiye bina. Har service mein alag se ek correlation ID log karo aur confirm karo ki tum bata nahi sakte kaunsi log lines usi request se mel khaati hain.',
        hint: 'Log the correlation ID alongside a timestamp in both services, and try to manually match up log lines from a single test request just by eyeballing timestamps.',
        hintHi: 'Dono services mein correlation ID ko ek timestamp ke saath log karo, aur ek akeli test request ke log lines ko sirf timestamps dekhkar manually match karne ki koshish karo.',
      },
      {
        task: 'Add basic OpenTelemetry instrumentation to both services (auto-instrumentation for Express and http/axios) and propagate the trace context on the outbound call. Confirm both services\' spans appear connected under the same trace ID.',
        taskHi: 'Dono services mein basic OpenTelemetry instrumentation jodo (Express aur \`http\`/\`axios\` ke liye auto-instrumentation) aur bahari call par trace context propagate karo. Confirm karo ki dono services ke spans usi trace ID ke neeche jude hue dikhte hain.',
        hint: 'A local Jaeger instance (via Docker) with the OTLP exporter is a quick way to visualize the resulting trace without needing a hosted tracing backend.',
        hintHi: 'Ek local Jaeger instance (Docker ke zariye) OTLP exporter ke saath natije trace ko visualize karne ka ek jaldi tarika hai kisi hosted tracing backend ki zaroorat bina.',
      },
      {
        task: 'Extend the setup so orders-service enqueues a background job (using this course\'s earlier job-queue pattern) with the current trace context attached. Have the worker read it back and confirm its own span appears as part of the same original trace.',
        taskHi: 'Setup ko badhaao taaki orders-service current trace context attach kiye hue ek background job enqueue kare (is course ke pehle wale job-queue pattern istemal karte hue). Worker ko ise wapas padhne do aur confirm karo ki uska apna span usi asli trace ke hisse ki tarah dikhta hai.',
        hint: 'Serialize the injected trace-context headers as part of the job payload, and have the worker create its span within that extracted context rather than a fresh one.',
        hintHi: 'Injected trace-context headers ko job payload ke hisse ki tarah serialize karo, aur worker ko us extract kiye gaye context ke andar apna span banaane do ek taaze ke bajaye.',
      },
    ],

    keyTakeaways: [
      'A correlation ID scoped to one service (this course\'s structured-logging lesson) does not automatically cross into a second service — it must be deliberately propagated on every outbound call.',
      'The W3C Trace Context standard\'s traceparent header gives every service, regardless of team, language, or tracing library, a shared, universally-understood format for passing trace identity forward.',
      'A trace is made of nested spans — timed records of individual operations — whose nesting reflects real causality, immediately showing which specific hop consumed the bulk of a request\'s total time.',
      'OpenTelemetry\'s auto-instrumentation patches common libraries (Express, http, database clients) to create and propagate spans automatically, without scattering manual tracing code through every route.',
      'A background job enqueued without attaching the current trace context becomes an untraceable island — the worker that eventually processes it must read that context back out to continue the same trace.',
      'Distributed tracing, logs, and metrics are complementary "three pillars of observability" — tracing specifically answers how one request behaved across every service and job boundary it touched.',
    ],
    keyTakeawaysHi: [
      'Ek service tak scoped ek correlation ID (is course ka structured-logging lesson) automatically doosri service mein nahi jaata — ise har bahari call par jaan-boojhkar propagate karna chahiye.',
      'W3C Trace Context standard ka \`traceparent\` header har service ko, team, language, ya tracing library se bekhabar, trace pehchaan aage bhejne ke liye ek shared, sarvavyaapi-roop-se-samjha-jaane-waala format deta hai.',
      'Ek trace nested spans se bana hota hai — akele operations ke timed records — jinki nesting asli causality darsaati hai, turant dikhaate hue ki kaunsa khaas hop ek request ke kul waqt ka zyaada hissa istemal karta hai.',
      'OpenTelemetry ka auto-instrumentation aam libraries (Express, \`http\`, database clients) ko patch karta hai automatically spans banaane aur propagate karne ke liye, har route mein manual tracing code bikhraaye bina.',
      'Ek background job jo current trace context attach kiye bina enqueue hota hai ek na-traceable island ban jaata hai — worker jo aakhirkaar ise process karta hai wo context wapas padhkar usi trace ko continue karna chahiye.',
      'Distributed tracing, logs, aur metrics "observability ke teen stambh" hain jo ek doosre ke poorak hain — tracing khaas taur par is sawaal ka jawaab deta hai ki ek request ne har us service aur job boundary ke aar-paar kaisa vyavhaar kiya jise ye chhuti hai.',
    ],
  },
];
