/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 6.
 *
 * API documentation with OpenAPI: how a real team keeps documentation
 * genuinely accurate as an API evolves, rather than maintaining a
 * separate, hand-written description of the API that silently drifts out
 * of sync with what the code actually does. Broken example: a hand-written
 * markdown or wiki page describing each endpoint, maintained entirely
 * separately from the route code itself — a field gets renamed in the
 * actual implementation, and the documentation, having no structural
 * connection to the code at all, simply keeps describing the old,
 * no-longer-true behavior indefinitely, actively misleading anyone who
 * trusts it. Fixed by generating an OpenAPI specification directly from
 * the same validation schemas (this course's earlier Zod-based
 * request-validation lesson) that already define and enforce each
 * route's actual request and response shape — the documentation and the
 * enforced behavior share one single source of truth and cannot drift
 * apart, served as an interactive, directly testable page via
 * swagger-ui-express.
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

export const NODE_MODULE_2_PART6: CourseLesson[] = [
  {
    slug: 'api-documentation-openapi',
    title: 'API Documentation with OpenAPI',
    titleHi: 'OpenAPI Ke Saath API Documentation',
    description: 'The wiki page describing the checkout endpoint still says the response includes a "totalPrice" field, three months after a teammate quietly renamed it to "total" — and a new engineer, trusting the docs completely, spends an entire afternoon debugging code that was never actually broken.',
    descriptionHi: 'Checkout endpoint ko describe karta wiki page abhi bhi kehta hai ki response mein ek "totalPrice" field shaamil hai, teen mahine baad jab ek teammate ne chupke se iska naam "total" kar diya — aur ek naya engineer, docs par poori tarah bharosa karte hue, ek poori dophar us code ko debug karne mein bitaata hai jo asal mein kabhi toota hua tha hi nahi.',
    difficulty: 'MEDIUM',
    duration: 16,
    order: 6,

    analogy: {
      en: '**A building whose evacuation map, framed on the wall, was hand-drawn once when the building first opened and never touched again — versus a building whose evacuation map is regenerated directly from the same official blueprint the facilities team actually uses to track every wall, door, and room, updated automatically the instant that blueprint changes.** The hand-drawn map might have been perfectly accurate on the day it was first put up, but as the years pass and the building is renovated — a wall moved, a room repurposed, an exit relocated — nobody\'s job is to remember to also update this specific framed poster, since it has no structural connection to the actual renovation work at all. Eventually the map shows a hallway that no longer exists, or fails to show a wall that was added, and anyone who trusts it during an actual emergency is being actively misled by a document that looks authoritative but has quietly become disconnected from reality. A map regenerated directly from the building\'s real, current blueprint has no equivalent failure mode: the blueprint IS the single source of truth the facilities team already updates as part of doing the actual renovation work, and the map is simply a direct, automatic rendering of whatever that blueprint currently says, meaning the map cannot possibly drift out of sync with the real building, since it was never a separate, independently-maintained thing to begin with. Hand-written API documentation, maintained in a wiki page or a markdown file entirely separate from the actual route code, is the framed poster: accurate on day one, silently wrong forever after, with nothing structurally connecting it to the code it describes. An OpenAPI specification generated directly from the same validation schemas the code actually enforces is the blueprint-derived map: the documentation cannot drift from reality, because it was never a separate document maintained by a separate, easy-to-forget process — it is a direct reflection of the one thing already being kept accurate for an entirely different, unavoidable reason.',
      hi: '**Ek building jiska evacuation map, deewaar par frame kiya hua, ek baar haath se banaaya gaya tha jab building pehli baar khuli thi aur phir kabhi nahi chhua gaya — versus ek building jiska evacuation map seedhe usi official blueprint se dobara generate hota hai jise facilities team asal mein har deewaar, darwaaza, aur kamre ko track karne ke liye istemal karti hai, us blueprint badalte hi automatically update hota hai.** Haath se banaaya gaya map shaayad us din bilkul sateek raha ho jab ye pehli baar lagaaya gaya tha, par jaise-jaise saal guzarte hain aur building mein renovation hoti hai — ek deewaar hilaayi jaati hai, ek kamre ka istemal badal jaata hai, ek exit kahin aur le jaayi jaati hai — kisi ka kaam ye yaad rakhna nahi hai ki wo is khaas framed poster ko bhi update kare, kyunki iska asli renovation kaam se koi structural rishta hi nahi hai. Aakhirkaar map ek aisa gaudaari dikhaata hai jo ab maujood hi nahi, ya ek deewaar dikhaana chhod deta hai jo jodi gayi thi, aur koi bhi jo ek asli emergency ke dauraan ispar bharosa karta hai ek aise document dwara saqriya taur par gumraah kiya jaa raha hai jo pramaanik dikhta hai par chupke se reality se disconnect ho chuka hai. Ek map jo seedhe building ke asli, current blueprint se dobara generate hota hai koi barabar ka fail-hone ka tarika nahi rakhta: blueprint hi wo ekmatra sach ka source hai jise facilities team pehle se asli renovation kaam karne ke hisse ki tarah update karti hai, aur map bas ek seedha, automatic rendering hai jo bhi wo blueprint abhi kehta hai, matlab map asli building se bekhabar hokar drift bilkul nahi kar sakta, kyunki ye shuru se ek alag, swatantra-roop-se-maintain-ki-jaati cheez thi hi nahi. Haath se likhi API documentation, ek wiki page ya ek markdown file mein maintain ki gayi asli route code se poori tarah alag, framed poster hai: din ek par sateek, uske baad hamesha ke liye chupke se galat, kuch bhi ise us code se structurally jodta nahi jise ye darsata hai. Ek OpenAPI specification jo seedhe unhi validation schemas se generate hoti hai jinhe code asal mein lagu karta hai blueprint-se-nikaala map hai: documentation reality se drift nahi kar sakti, kyunki ye kabhi ek alag document nahi thi jise ek alag, bhoolna-aasaan process maintain karta ho — ye ek seedha pratibimb hai us ek cheez ka jo pehle se ek poori tarah alag, na-tale-jaane-laayak wajah se sateek rakhi jaa rahi hai.',
    },

    simple: `**Start broken.** Documentation maintained entirely separately from the actual code:

\`\`\`
// docs/api-reference.md — a hand-written file, edited manually
### POST /checkout
Response:
{
  "orderId": "string",
  "totalPrice": "number"   ← this field was renamed to "total" three months ago
}
\`\`\`

\`\`\`js
// The actual route, evolved independently of the documentation above
app.post("/checkout", async (req, res) => {
  const order = await createOrder(req.body);
  res.json({ orderId: order.id, total: order.total }); // "total", not "totalPrice"
});
\`\`\`

The documentation file and the actual route code live in two completely separate places, maintained by two completely separate processes — a developer editing the route has no structural reason to also remember to open and update the markdown file, and nothing at all checks whether the two ever agree. When a field gets renamed in the actual implementation (a genuinely reasonable, ordinary code change), the documentation simply continues describing the old shape indefinitely, since nothing about renaming a field in route code has any connection to a separate markdown file sitting in a completely different part of the repository. A new engineer, or a third-party developer integrating with this API, who trusts the documentation completely will write code expecting a \`totalPrice\` field that has not existed for months, and will spend real time debugging what looks like a bug in their own code before discovering the actual problem was the documentation lying to them the entire time.

**The fix: generate the specification directly from the same schema that validates requests**

\`\`\`js
const { z } = require("zod");
const { extendZodWithOpenApi, createDocument } = require("zod-openapi");
extendZodWithOpenApi(z);

const checkoutResponseSchema = z.object({
  orderId: z.string(),
  total: z.number(),
}).openapi({ description: "The created order" });

// This same schema is ALSO used to validate the actual response at runtime
// (this course's earlier request-validation lesson) — one schema, two jobs
\`\`\`

\`\`\`js
const document = createDocument({
  openapi: "3.0.0",
  info: { title: "My API", version: "1.0.0" },
  paths: {
    "/checkout": {
      post: { responses: { 200: { content: { "application/json": { schema: checkoutResponseSchema } } } } },
    },
  },
});
\`\`\`

Rather than a human hand-writing a separate description of what the \`/checkout\` response looks like, the exact same Zod schema this course's earlier request-validation lesson already uses to validate the response's actual shape at runtime is reused to automatically generate the OpenAPI specification. This means there is only ONE place that defines what this endpoint's response shape actually is — the schema — and both the runtime validation and the published documentation are simply two different views of that same single source of truth. When a field is genuinely renamed, it is renamed in the schema itself, and both the validation behavior AND the generated documentation update together automatically, since they were never two separate things that could drift apart in the first place.`,

    simpleHi: `**Toote hue se shuru.** Documentation asli code se poori tarah alag maintain ki jaati hai:

\`\`\`
// docs/api-reference.md — ek haath se likhi file, manually edit ki jaati hai
### POST /checkout
Response:
{
  "orderId": "string",
  "totalPrice": "number"   ← ye field teen mahine pehle "total" mein badal di gayi thi
}
\`\`\`

\`\`\`js
// Asli route, upar wali documentation se swatantra roop se vikasit hua
app.post("/checkout", async (req, res) => {
  const order = await createOrder(req.body);
  res.json({ orderId: order.id, total: order.total }); // "total", "totalPrice" nahi
});
\`\`\`

Documentation file aur asli route code do poori tarah alag jagahon mein rehte hain, do poori tarah alag processes dwara maintain kiye jaate hain — ek route edit karta developer ke paas koi structural kaaran nahi hai ki wo markdown file kholna aur update karna bhi yaad rakhe, aur kuch bhi check nahi karta ki dono kabhi sehmat bhi hain ya nahi. Jab asli implementation mein ek field ka naam badalta hai (ek sach mein samajhdaar, saadhaaran code badlaav), documentation bas purani shape ko hamesha ke liye darsaati rehti hai, kyunki route code mein ek field ka naam badalne ke baare mein kuch bhi repository ke ek poori tarah alag hisse mein baithi ek alag markdown file se koi rishta nahi rakhta. Ek naya engineer, ya ek third-party developer jo is API ke saath integrate kar raha hai, jo documentation par poori tarah bharosa karta hai ek \`totalPrice\` field ki umeed karte hue code likhega jo mahinon se maujood hi nahi hai, aur apne khud ke code mein ek bug jaisa dikhta hai use debug karne mein asli waqt bitaayega isse pehle ki asli samasya discover ho ki documentation poore samay unse jhooth bol rahi thi.

**Fix: specification ko seedhe usi schema se generate karo jo requests validate karta hai**

\`\`\`js
const { z } = require("zod");
const { extendZodWithOpenApi, createDocument } = require("zod-openapi");
extendZodWithOpenApi(z);

const checkoutResponseSchema = z.object({
  orderId: z.string(),
  total: z.number(),
}).openapi({ description: "The created order" });

// Yahi schema us course ke pehle wale request-validation lesson ke hisaab se
// asli response ko runtime par bhi validate karne ke liye istemal hoti hai —
// ek schema, do kaam
\`\`\`

\`\`\`js
const document = createDocument({
  openapi: "3.0.0",
  info: { title: "My API", version: "1.0.0" },
  paths: {
    "/checkout": {
      post: { responses: { 200: { content: { "application/json": { schema: checkoutResponseSchema } } } } },
    },
  },
});
\`\`\`

Ek insaan ke haath se \`/checkout\` response kaisa dikhta hai ek alag varnan likhne ke bajaye, bilkul wahi Zod schema jise is course ka pehle wala request-validation lesson pehle se response ki asli shape ko runtime par validate karne ke liye istemal karta hai automatically OpenAPI specification generate karne ke liye dobara istemal ki jaati hai. Iska matlab hai sirf EK jagah hai jo define karti hai ki is endpoint ki response shape asal mein kya hai — schema — aur runtime validation aur publish ki gayi documentation dono bas usi ek sach ke source ke do alag nazariye hain. Jab ek field sach mein naam badalti hai, ise schema mein khud badla jaata hai, aur validation vyavhaar AUR generate hui documentation dono ek saath automatically update hote hain, kyunki wo kabhi do alag cheezein thi hi nahi jo shuru mein alag ho sakein.`,

    content: `## Documentation as a separate artifact vs. documentation as a derived view

\`\`\`
Hand-written docs: a human writes and maintains a SEPARATE description
of the API, with no structural connection to the actual route code.

OpenAPI generated from schemas: the documentation is DERIVED
automatically from the same schema already enforcing request/response
shape at runtime — one source of truth, two outputs.
\`\`\`

The fundamental problem with hand-written API documentation is not that humans are careless — it is that maintaining accurate documentation this way requires a second, entirely separate effort every single time the API changes, with nothing structurally connecting that effort to the actual code change itself. Generating an OpenAPI specification directly from the same validation schemas this course\'s earlier request-validation lesson already uses eliminates this second effort entirely: the schema already has to be accurate, since it is actively enforced at runtime and a wrong schema would cause real validation failures immediately — and once that schema exists, generating documentation from it is a mechanical, automatic step rather than a second, independently-maintained artifact that could ever quietly drift out of sync.

## Serving an interactive, directly testable documentation page

\`\`\`js
const swaggerUi = require("swagger-ui-express");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
\`\`\`

\`swagger-ui-express\` takes a generated OpenAPI document and serves it as a full, interactive web page — not just readable text describing each endpoint, but a page where a developer can see every route\'s expected request and response shape, and directly send a real, live request to the actual running API from within the documentation page itself, seeing the real response come back immediately. This makes the documentation genuinely useful for exploration and testing, not merely a static reference someone reads and then has to separately verify by writing their own test request in a different tool.

## Documenting more than just shape: descriptions, examples, and status codes

\`\`\`js
const orderSchema = z.object({
  orderId: z.string().openapi({ example: "ord_1a2b3c", description: "Unique order identifier" }),
  total: z.number().openapi({ example: 49.99, description: "Total charged, in the account\\'s currency" }),
});
\`\`\`

An OpenAPI specification generated purely from a schema\'s types captures the SHAPE of a request or response correctly, but genuinely useful documentation also needs human-authored context a type alone cannot express: what a field actually represents, a realistic example value, and which specific HTTP status codes a route can return and under what conditions. Most schema-to-OpenAPI tools (including \`zod-openapi\`) support attaching this additional metadata directly onto the schema itself, so descriptions and examples live in exactly the same place as the type definition they annotate, rather than being written separately and risking exactly the same kind of drift this lesson\'s broken example demonstrates for pure shape.

## This lesson pairs directly with this course\'s earlier API-versioning lesson

\`\`\`
paths:
  /v1/users/{id}: { ... }   ← documented, marked deprecated (Deprecation header noted)
  /v2/users/{id}: { ... }   ← documented as the current, active version
\`\`\`

This course\'s earlier lesson on API versioning and deprecation established that a breaking change ships as a new version, with the old one kept running and clearly marked deprecated for a real transition period. An OpenAPI specification is exactly where that distinction should be made visible to every consumer of the API: both versions can be documented side by side, with the deprecated one explicitly marked as such directly in the specification (OpenAPI supports a \`deprecated: true\` flag on any operation), so anyone browsing the documentation immediately sees which version they should actually be building against, rather than that information living only in a Deprecation HTTP header a consumer might never notice.`,

    contentHi: `## Documentation ek alag artifact ki tarah vs. documentation ek derived view ki tarah

\`\`\`
Haath se likhe docs: ek insaan API ka ek ALAG varnan likhta aur
maintain karta hai, asli route code se koi structural rishta bina.

Schemas se generate hui OpenAPI: documentation automatically usi
schema se DERIVE hoti hai jo pehle se runtime par request/response
shape lagu karti hai — ek sach ka source, do outputs.
\`\`\`

Haath se likhi API documentation ke saath buniyaadi samasya ye nahi hai ki insaan laapervaah hain — ye hai ki is tarike se sateek documentation maintain karne ke liye har baar jab API badalta hai ek doosra, poori tarah alag prayaas chahiye, kuch bhi us prayaas ko asli code badlaav se structurally jode bina. Seedhe usi validation schema se ek OpenAPI specification generate karna jise is course ka pehle wala request-validation lesson pehle se istemal karta hai is doosre prayaas ko poori tarah khatam karta hai: schema ko pehle se sateek hona hi hai, kyunki ye runtime par saqriya taur par lagu ki jaati hai aur ek galat schema turant asli validation failures cause karegi — aur ek baar wo schema maujood hai, ussey documentation generate karna ek mechanical, automatic step hai ek doosre, swatantra-roop-se-maintain-ki-jaati artifact ke bajaye jo kabhi chupke se bekhabar ho sake.

## Ek interactive, seedhe-test-kiya-jaa-sakne-laayak documentation page serve karna

\`\`\`js
const swaggerUi = require("swagger-ui-express");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
\`\`\`

\`swagger-ui-express\` ek generate hui OpenAPI document leta hai aur ise ek poore, interactive web page ki tarah serve karta hai — sirf har endpoint ki anumaanit request aur response shape darsaata padhne-laayak text nahi, balki ek page jahan ek developer har route ki anumaanit shape dekh sakta hai, aur seedhe asli chalti API ko documentation page ke andar se hi ek asli, live request bhej sakta hai, asli response turant wapas aate hue dekhte hue. Ye documentation ko exploration aur testing ke liye sach mein upyogi banaata hai, sirf ek static reference nahi jise koi padhta hai aur phir apna khud ka test request ek alag tool mein likhkar alag se verify karna padta hai.

## Sirf shape se zyaada kuch document karna: descriptions, examples, aur status codes

\`\`\`js
const orderSchema = z.object({
  orderId: z.string().openapi({ example: "ord_1a2b3c", description: "Unique order identifier" }),
  total: z.number().openapi({ example: 49.99, description: "Total charged, in the account\\'s currency" }),
});
\`\`\`

Ek OpenAPI specification jo shuddh roop se ek schema ke types se generate hoti hai ek request ya response ki SHAPE ko sahi tarike se capture karti hai, par sach mein upyogi documentation ko human-likhi context bhi chahiye jo akela ek type express nahi kar sakta: ek field asal mein kya darsata hai, ek wastavik example value, aur ek route bilkul kaunse HTTP status codes lauta sakta hai aur kaunsi sthitiyon mein. Zyaadatar schema-se-OpenAPI tools (\`zod-openapi\` sameet) is additional metadata ko seedhe schema par khud attach karne ka support dete hain, taaki descriptions aur examples bilkul usi jagah rahein jahan type definition hai jise wo annotate karte hain, alag se likhe jaane ke bajaye jo shuddh shape ke liye is lesson ka toota example jaisa dikhaata bilkul wahi tarah ka drift risk karta hai.

## Ye lesson is course ke pehle wale API-versioning lesson ke saath seedha jodta hai

\`\`\`
paths:
  /v1/users/{id}: { ... }   ← documented, deprecated maark kiya gaya (Deprecation header note kiya gaya)
  /v2/users/{id}: { ... }   ← current, saqriya version ki tarah documented
\`\`\`

Is course ka pehle wala API versioning aur deprecation lesson sthaapit karta hai ki ek breaking change ek naye version ki tarah ship hota hai, purane ko chalta rakha jaata hai aur saaf taur par ek asli transition avdhi ke liye deprecated maark kiya jaata hai. Ek OpenAPI specification bilkul wahi jagah hai jahan wo antar API ke har consumer ko dikhta banaaya jaana chahiye: dono versions ek saath documented ho sakte hain, deprecated wale ko explicitly aise maark kiya jaata hai seedhe specification mein (OpenAPI kisi bhi operation par ek \`deprecated: true\` flag support karta hai), taaki documentation browse karta koi bhi turant dekh le ki unhe asal mein kaunse version ke khilaaf banaana chahiye, ye jaankaari sirf ek Deprecation HTTP header mein rehne ke bajaye jise ek consumer shaayad kabhi notice hi na kare.`,

    examples: [
      {
        title: 'Broken: hand-written documentation, maintained separately from the code',
        titleHi: 'Toota: haath se likhi documentation, code se alag maintain ki gayi',
        code: `// docs/api-reference.md
### POST /checkout
Response: { "orderId": "string", "totalPrice": "number" }
// the actual code renamed this field to "total" months ago`,
        codeJs: `// The actual route
app.post("/checkout", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.json({ orderId: order.id, total: order.total });
  } catch (err) {
    next(err);
  }
});
// docs/api-reference.md still says "totalPrice" — nothing keeps them in sync`,
        codeTs: `app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await createOrder(req.body);
    res.json({ orderId: order.id, total: order.total });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the drift is entirely
// about the separate documentation file, not a type error.`,
        output: `The API correctly returns { orderId, total }. The documentation
still describes { orderId, totalPrice } — anyone trusting the docs
writes code expecting a field that has not existed for months.`,
        explain: 'The documentation lives in a completely separate file with no structural connection to the route code — renaming a field in the code has no way to also update the markdown.',
        explainHi: 'Documentation ek poori tarah alag file mein rehti hai route code se koi structural rishta bina — code mein ek field ka naam badalna markdown ko bhi update karne ka koi tarika nahi rakhta.',
      },
      {
        title: 'Fixed: OpenAPI generated directly from the same Zod schema',
        titleHi: 'Theek: bilkul usi Zod schema se generate hui OpenAPI',
        code: `const checkoutResponseSchema = z.object({ orderId: z.string(), total: z.number() });
// used for BOTH runtime validation and generating the OpenAPI document`,
        codeJs: `const { z } = require("zod");
const { extendZodWithOpenApi, createDocument } = require("zod-openapi");
extendZodWithOpenApi(z);

const checkoutResponseSchema = z.object({
  orderId: z.string(),
  total: z.number(),
});

app.post("/checkout", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    const response = checkoutResponseSchema.parse({ orderId: order.id, total: order.total });
    res.json(response);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { z } from "zod";
import { extendZodWithOpenApi, createDocument } from "zod-openapi";
extendZodWithOpenApi(z);

const checkoutResponseSchema = z.object({
  orderId: z.string(),
  total: z.number(),
});

app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await createOrder(req.body);
    const response = checkoutResponseSchema.parse({ orderId: order.id, total: order.total });
    res.json(response);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `When the field is renamed in this one schema, both the runtime
validation AND every generated documentation page update together
automatically — there is nothing separate left to fall out of sync.`,
        outputTs: `// Identical behaviour. z.infer<typeof checkoutResponseSchema>
// also gives the response object a precise TypeScript type derived
// from the exact same single definition.`,
        explain: 'The schema is the one place defining the response shape — runtime validation and the OpenAPI document are both simply derived from it, so they cannot drift apart.',
        explainHi: 'Schema wo ek jagah hai jo response shape define karti hai — runtime validation aur OpenAPI document dono bas usse derive hote hain, taaki wo alag na ho sakein.',
      },
      {
        title: 'Serving the generated spec as an interactive page with swagger-ui-express',
        titleHi: '\`swagger-ui-express\` ke saath generate hui spec ko ek interactive page ki tarah serve karna',
        code: `const document = createDocument({ openapi: "3.0.0", info: {...}, paths: {...} });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));`,
        codeJs: `const swaggerUi = require("swagger-ui-express");

const document = createDocument({
  openapi: "3.0.0",
  info: { title: "Checkout API", version: "1.0.0" },
  paths: {
    "/checkout": {
      post: {
        responses: {
          200: { content: { "application/json": { schema: checkoutResponseSchema } } },
        },
      },
    },
  },
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));`,
        codeTs: `import swaggerUi from "swagger-ui-express";

const document = createDocument({
  openapi: "3.0.0",
  info: { title: "Checkout API", version: "1.0.0" },
  paths: {
    "/checkout": {
      post: {
        responses: {
          200: { content: { "application/json": { schema: checkoutResponseSchema } } },
        },
      },
    },
  },
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));`,
        outputJs: `Visiting /api-docs shows an interactive page listing every
documented route, where a developer can send a real request directly
from the browser and see the actual live response.`,
        outputTs: `// Identical behaviour. The same document object could equally be
// served as raw JSON for external tooling, or rendered by swagger-ui-express
// for humans — one generated artifact, multiple consumers.`,
        explain: 'The documentation page is generated from the same live specification, letting anyone verify an endpoint\'s actual behavior directly rather than trusting a static description.',
        explainHi: 'Documentation page usi live specification se generate hota hai, kisi ko bhi ek endpoint ke asli vyavhaar ko seedhe verify karne dete hue ek static varnan par bharosa karne ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `// docs/api-reference.md — a hand-written file, edited manually,
// with no connection to the actual route code whatsoever`,
        right: `// An OpenAPI document generated directly from the same Zod schemas
// already enforcing request/response shape at runtime`,
        why: 'Hand-written documentation maintained separately from the code has no structural mechanism preventing it from silently drifting out of sync the moment the code changes.',
        whyHi: 'Code se alag maintain ki gayi haath se likhi documentation ke paas koi structural mechanism nahi hai jo ise code badalte hi chupke se bekhabar hone se roke.',
      },
      {
        wrong: `// Generating an OpenAPI spec from a schema, but writing the schema
// once and never actually validating requests/responses against it —
// the "documentation" schema drifts from the real code just like a markdown file would`,
        right: `// Use the SAME schema for both runtime validation AND OpenAPI
// generation — the schema being enforced is the same schema being documented`,
        why: 'A schema that only generates documentation but is never actually enforced at runtime can still drift from reality — the protection comes specifically from one schema doing both jobs.',
        whyHi: 'Ek schema jo sirf documentation generate karti hai par kabhi asal mein runtime par lagu nahi ki jaati phir bhi reality se drift kar sakti hai — protection khaas taur par ek schema ke dono kaam karne se aati hai.',
      },
      {
        wrong: `// Documenting a deprecated version with no indication it's deprecated
// in the OpenAPI spec itself — only in a Deprecation HTTP header nobody reads`,
        right: `paths: { "/v1/users/{id}": { get: { deprecated: true, /* ... */ } } }
// visible directly in the documentation anyone actually browses`,
        why: 'Relying solely on an HTTP header to signal deprecation misses the audience most likely to actually read the OpenAPI documentation while deciding which version to integrate against.',
        whyHi: 'Deprecation ka sanket dene ke liye sirf ek HTTP header par bharosa karna us audience ko chhod deta hai jo asal mein OpenAPI documentation padhne ki sabse zyaada sambhaavna rakhti hai jab wo tay kar rahi hai ki kaunse version ke khilaaf integrate karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**OpenAPI (formerly Swagger) is the de facto industry standard specification format for describing REST APIs**, supported by a vast ecosystem of tooling for generating documentation, client libraries, and server stubs from a single specification.',
        hi: '**OpenAPI (pehle Swagger) REST APIs ko describe karne ke liye de facto industry standard specification format hai**, ek vishaal tooling ecosystem dwara supported jo ek akeli specification se documentation, client libraries, aur server stubs generate karta hai.',
      },
      {
        en: '**Deriving an OpenAPI specification directly from the same validation schema used at runtime (rather than writing the spec by hand) is a widely recommended practice** specifically because it structurally prevents documentation and actual behavior from ever disagreeing.',
        hi: '**Ek OpenAPI specification ko seedhe usi validation schema se derive karna jo runtime par istemal hoti hai (spec ko haath se likhne ke bajaye) ek vyaapak roop se recommend ki jaane waali practice hai** khaas taur par isliye kyunki ye structurally documentation aur asli vyavhaar ko kabhi asehmat hone se rokti hai.',
      },
      {
        en: '**swagger-ui-express and similar tools rendering an interactive, directly testable documentation page from an OpenAPI specification is standard practice at nearly every company publishing a REST API**, internally or externally.',
        hi: '**\`swagger-ui-express\` aur isi tarah ke tools jo ek OpenAPI specification se ek interactive, seedhe-test-kiya-jaa-sakne-laayak documentation page render karte hain lagbhag har company mein standard practice hai jo ek REST API publish karti hai**, internally ya externally.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does hand-written API documentation reliably drift out of sync with the actual code over time, regardless of how disciplined a team tries to be?',
        qHi: 'Haath se likhi API documentation waqt ke saath asli code se bharosemand taur par bekhabar kyun ho jaati hai, team chahe kitni bhi anushaasit rehne ki koshish kare?',
        a: 'Hand-written documentation and the actual route code are, structurally, two entirely separate artifacts that happen to describe the same thing, maintained through two entirely separate processes with no mechanism connecting them. When a developer changes a route\'s actual behavior — renaming a field, adding a new required parameter, changing a status code returned under some condition — that change is made directly in the code, and the code change itself is what makes the application actually work differently; nothing about making that change has any structural requirement to also open and edit a separate markdown file or wiki page. This means keeping the documentation accurate depends entirely on every single developer, on every single change that affects an endpoint\'s documented behavior, remembering to perform a completely separate, manual second step — updating the corresponding documentation — with no automated check, compiler error, or test failure ever occurring if that second step is skipped. Even a highly disciplined team faces this problem: a change made under deadline pressure, a change made by a developer unfamiliar with where the documentation lives, or simply the sheer volume of changes across a codebase over months and years means that sooner or later, some change to actual behavior will not be reflected in the separate documentation, and there is no structural mechanism catching that gap when it happens, unlike a compiler catching a type mismatch or a test suite catching a broken behavior. This is fundamentally different from documentation generated directly from the same schema enforced at runtime: in that case, there is only one place defining the behavior, so there is nothing separate left that could ever fall out of sync in the first place, regardless of how careful or careless any individual developer happens to be on any given change.',
        aHi: 'Haath se likhi documentation aur asli route code, structurally, do poori tarah alag artifacts hain jo wahi cheez darsaate hain, do poori tarah alag processes ke through maintain kiye jaate hain koi mechanism unhe jodta bina. Jab ek developer ek route ka asli vyavhaar badalta hai — ek field ka naam badalna, ek naya zaroori parameter jodna, kisi sthiti mein lautaaya jaata status code badalna — wo badlaav seedhe code mein kiya jaata hai, aur code badlaav khud wo hai jo application ko asal mein alag tarike se kaam karwaata hai; wo badlaav karne ke baare mein kuch bhi ek alag markdown file ya wiki page kholne aur edit karne ki koi structural zaroorat nahi rakhta. Iska matlab hai documentation ko sateek rakhna poori tarah is baat par nirbhar hai ki har akela developer, ek endpoint ke documented vyavhaar ko asar karti har akeli badlaav par, ek poori tarah alag, manual doosra step karna yaad rakhe — mutaalliq documentation update karna — koi automated check, compiler error, ya test failure kabhi hoti hi nahi agar wo doosra step chhoot jaaye. Ek bahut anushaasit team bhi is samasya ka saamna karti hai: deadline ke dabaav mein kiya gaya ek badlaav, ek aise developer dwara kiya gaya badlaav jo isse anjaan hai ki documentation kahaan rehti hai, ya bas mahinon aur saalon mein codebase mein badlaavon ki bilkul tadaad ka matlab hai ki der-sabaher, asli vyavhaar mein koi badlaav alag documentation mein pratibimbit nahi hoga, aur jab ye hota hai koi structural mechanism us gap ko nahi pakadta, ek compiler ke ek type mismatch pakadne ya ek test suite ke ek toote vyavhaar ko pakadne ke ulta. Ye buniyaadi taur par usi schema se seedhe generate hui documentation se alag hai jo runtime par lagu ki jaati hai: us case mein, vyavhaar define karne ke liye sirf ek jagah hai, isliye kuch bhi alag bacha nahi hai jo kabhi bekhabar ho sake shuru mein, chahe koi bhi akela developer kisi bhi diye badlaav par kitna bhi savdhaan ya laapervaah ho.',
      },
      {
        q: 'Why does using the same Zod schema for both runtime validation and OpenAPI generation eliminate the drift problem that a separately-written OpenAPI schema would not?',
        qHi: 'Runtime validation aur OpenAPI generation dono ke liye wahi Zod schema istemal karna us drift samasya ko kyun khatam karta hai jo ek alag-se-likhi OpenAPI schema nahi karegi?',
        a: 'Simply using a schema-based tool to generate an OpenAPI specification does not, by itself, guarantee that specification stays accurate — if the schema used to generate the documentation is a separate, independent artifact from whatever actually validates requests and responses at runtime, that documentation-generating schema can just as easily drift out of sync with reality as a hand-written markdown file could, since nothing forces the two to agree with each other either. The specific property that eliminates drift is not "using a schema" in the abstract, but reusing the EXACT SAME schema object for both purposes simultaneously: the identical schema that generates the OpenAPI documentation is also the schema actively called via .parse() or .safeParse() to validate real requests and responses as the application actually runs. This matters because the runtime-validating half of that dual role has a powerful, independent incentive keeping it accurate that pure documentation never has on its own: if the schema does not correctly describe the real, current shape of requests and responses, real requests will genuinely fail validation or real responses will genuinely fail to match, causing actual, visible errors in the running application that someone will need to investigate and fix immediately, regardless of whether anyone was thinking about documentation accuracy at all. Because the documentation is generated from that same schema, keeping the schema accurate for the runtime-validation reason automatically keeps the documentation accurate too, as a direct, structural consequence rather than something anyone has to separately remember to maintain. A schema used only for documentation generation, with a different, separate mechanism actually validating requests, loses this property entirely, since nothing would ever force that documentation-only schema to be corrected if it silently became wrong.',
        aHi: 'Sirf ek OpenAPI specification generate karne ke liye ek schema-based tool istemal karna, khud se, ye zamanat nahi deta ki wo specification sateek rehti hai — agar documentation generate karne ke liye istemal hoti schema ek alag, swatantra artifact hai us cheez se jo asal mein runtime par requests aur responses validate karti hai, wo documentation-generate-karti schema utni hi aasaani se reality se bekhabar ho sakti hai jitni ek haath se likhi markdown file ho sakti thi, kyunki kuch bhi dono ko ek doosre se sehmat hone ke liye majboor nahi karta. Wo khaas property jo drift ko khatam karti hai "ek schema istemal karna" abstract roop mein nahi hai, balki EK JAISI SCHEMA object ko dono maqsad ke liye ek saath dobara istemal karna hai: wahi identical schema jo OpenAPI documentation generate karti hai wo schema bhi hai jise \`.parse()\` ya \`.safeParse()\` ke zariye saqriya taur par call kiya jaata hai asli requests aur responses ko validate karne ke liye jaise application asal mein chalti hai. Ye maayne rakhta hai kyunki us dohari bhoomika ka runtime-validate-karta aadha hissa ek shaktishaali, swatantra protsaahan rakhta hai ise sateek rakhne ka jo shuddh documentation ke paas akele kabhi nahi hota: agar schema requests aur responses ki asli, current shape ko sahi tarike se nahi darsati, asli requests sach mein validation fail karengi ya asli responses sach mein match karne mein fail honge, chalti application mein asli, dikhte errors cause karte hue jinki koi ko turant jaanch aur fix karni padegi, chahe koi documentation accuracy ke baare mein bilkul soch bhi raha ho ya nahi. Kyunki documentation usi schema se generate hoti hai, schema ko runtime-validation ke kaaran sateek rakhna documentation ko bhi automatically sateek rakhta hai, ek seedhe, structural natije ki tarah kisi ko alag se yaad rakhne ki maang karne ke bajaye. Ek schema jo sirf documentation generation ke liye istemal hoti hai, ek alag, doosre mechanism ke asal mein requests validate karte hue, ye property poori tarah kho deti hai, kyunki kuch bhi kabhi us documentation-hi schema ko theek karne ke liye majboor nahi karega agar ye chupke se galat ho jaaye.',
      },
      {
        q: 'Why should the OpenAPI specification, rather than only an HTTP response header, be the place where a deprecated API version is marked?',
        qHi: 'OpenAPI specification, sirf ek HTTP response header ke bajaye, wo jagah kyun honi chahiye jahan ek deprecated API version maark ki jaaye?',
        a: 'This course\'s earlier lesson on API versioning established that a Deprecation HTTP header is a valuable, machine-readable signal — automated tooling monitoring a client\'s own traffic can detect it and alert that client\'s team a dependency they call is being retired. However, a header attached to a live HTTP response is only ever seen by whatever code or tooling is actually inspecting the headers of a response that specific integration already happens to be making — it provides no signal at all to a developer who has not yet integrated with the API, or one who is currently deciding which version to build a brand-new integration against in the first place, since that developer has no existing traffic generating responses with headers to inspect. The OpenAPI specification, by contrast, is precisely the document a developer in that situation actually consults: before writing any integration code at all, a developer exploring what an API offers typically browses its documentation to understand available endpoints and decide which one, and which version, to build against. If a deprecated version is marked as such directly within that specification (via OpenAPI\'s own deprecated field on an operation), that exact information — this version is being phased out, do not build new work against it — is visible to a developer at precisely the moment they are deciding what to integrate with, before any code is written at all, rather than only being discoverable after the fact by inspecting response headers from an integration that has already been built. Marking deprecation in both places serves two genuinely different audiences: the header serves clients who already integrated and need an automated signal within their running system, while the specification serves developers who have not yet integrated and are actively choosing what to build against.',
        aHi: 'Is course ka pehle wala API versioning lesson sthaapit karta hai ki ek \`Deprecation\` HTTP header ek keemti, machine-readable sanket hai — ek client ke apne traffic ko monitor karti automated tooling ise detect kar sakti hai aur us client ki team ko alert kar sakti hai ki jo dependency wo call karte hain retire ki jaa rahi hai. Halaanki, ek live HTTP response se juda ek header sirf us code ya tooling ko dikhta hai jo asal mein us response ke headers ko inspect kar rahi hai jo wo khaas integration pehle se kar raha hai — ye us developer ko koi sanket nahi deta jisne abhi tak API se integrate nahi kiya, ya ek jo abhi tay kar raha hai ki wo bilkul naya integration kaunse version ke khilaaf banaaye, kyunki us developer ke paas koi maujooda traffic nahi hai jo inspect karne ke liye headers wale responses paida kare. OpenAPI specification, iske ulta, bilkul wo document hai jise ek developer us sthiti mein asal mein consult karta hai: koi bhi integration code likhne se pehle, ek developer jo ye explore kar raha hai ki ek API kya offer karta hai aam taur par uski documentation browse karta hai ye samajhne ke liye ki kaunse endpoints upalabdh hain aur kaunse, aur kaunse version, ke khilaaf banaana hai faisla karne ke liye. Agar ek deprecated version ko us specification ke andar seedhe aise maark kiya jaata hai (OpenAPI ke apne \`deprecated\` field ke zariye ek operation par), bilkul wo jaankaari — ye version phase out ho raha hai, iske khilaaf naya kaam mat banao — ek developer ko bilkul us pal dikhti hai jab wo faisla kar raha hai ki kya integrate karna hai, koi code likhe jaane se pehle, response headers ko inspect karke baad mein discover-hone-laayak hone ke bajaye ek aise integration se jo pehle se bana chuka hai. Dono jagah deprecation maark karna do sach mein alag audiences ki seva karta hai: header un clients ki seva karta hai jo pehle se integrate ho chuke hain aur apne chalte system ke andar ek automated sanket chahte hain, jabki specification un developers ki seva karti hai jinhone abhi tak integrate nahi kiya aur saqriya taur par tay kar rahe hain ki kya banaana hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a hand-written markdown description of a simple /profile endpoint\'s response shape. Then change the actual route to rename a field, and confirm the markdown continues describing the old, no-longer-true shape with nothing flagging the mismatch.',
        taskHi: 'Ek saadhe \`/profile\` endpoint ki response shape ka ek haath se likha markdown varnan likho. Phir asli route ko badlo ek field ka naam badalne ke liye, aur confirm karo ki markdown purani, ab-sach-nahi shape darsaana jaari rakhta hai kuch bhi mismatch flag kiye bina.',
        hint: 'This exercise is deliberately meant to demonstrate the failure mode — the point is confirming nothing catches the drift, not preventing it yet.',
        hintHi: 'Ye exercise jaan-boojhkar fail-hone ka tarika dikhaane ke liye hai — point ye confirm karna hai ki kuch bhi drift nahi pakadta, ise abhi rokna nahi.',
      },
      {
        task: 'Define the /profile response shape as a Zod schema, use it to validate the actual response at runtime, and use zod-openapi to generate an OpenAPI document from that same schema. Confirm the generated document matches the actual response shape exactly.',
        taskHi: '\`/profile\` response shape ko ek Zod schema ki tarah define karo, ise asli response ko runtime par validate karne ke liye istemal karo, aur \`zod-openapi\` istemal karke usi schema se ek OpenAPI document generate karo. Confirm karo ki generate hua document asli response shape se bilkul match karta hai.',
        hint: 'Deliberately rename a field in the schema and confirm both the runtime validation and the generated OpenAPI document update together, automatically.',
        hintHi: 'Jaan-boojhkar schema mein ek field ka naam badlo aur confirm karo ki runtime validation aur generate hua OpenAPI document dono ek saath, automatically update hote hain.',
      },
      {
        task: 'Serve the generated OpenAPI document via swagger-ui-express at /api-docs, and use the interactive page to send a real request to the /profile endpoint directly from the browser.',
        taskHi: 'Generate hui OpenAPI document ko \`swagger-ui-express\` ke zariye \`/api-docs\` par serve karo, aur interactive page istemal karke \`/profile\` endpoint ko seedhe browser se ek asli request bhejo.',
        hint: 'Confirm the response shown in the documentation page matches exactly what the actual running server returns for that request.',
        hintHi: 'Confirm karo ki documentation page mein dikhaya gaya response bilkul usse match karta hai jo asli chalta server us request ke liye lautaata hai.',
      },
    ],

    keyTakeaways: [
      'Hand-written documentation maintained separately from the code has no structural mechanism preventing it from silently drifting out of sync the moment the code changes.',
      'Generating an OpenAPI specification from the same Zod (or similar) schema already used for runtime validation gives documentation and enforced behavior one single source of truth that cannot drift apart.',
      'The drift-prevention only works because the SAME schema object serves both roles — a separate schema used only for documentation generation can drift just as easily as a hand-written file.',
      'swagger-ui-express renders the generated specification as an interactive page where a developer can send a real request and see the real response, not just read a static description.',
      'A schema-derived specification should still carry human-authored context (descriptions, realistic examples) that a type alone cannot express, attached directly to the schema itself.',
      'A deprecated API version should be marked directly in the OpenAPI specification (not only via an HTTP header), since it reaches developers deciding what to integrate against before any code or traffic exists.',
    ],
    keyTakeawaysHi: [
      'Code se alag maintain ki gayi haath se likhi documentation ke paas koi structural mechanism nahi hai jo ise code badalte hi chupke se bekhabar hone se roke.',
      'Usi Zod (ya isi tarah ki) schema se ek OpenAPI specification generate karna jo pehle se runtime validation ke liye istemal hoti hai documentation aur lagu kiye gaye vyavhaar ko ek akela sach ka source deta hai jo alag nahi ho sakta.',
      'Drift-prevention sirf isliye kaam karta hai kyunki WAHI schema object dono roles nibhaata hai — sirf documentation generation ke liye istemal hoti ek alag schema utni hi aasaani se bekhabar ho sakti hai jitni ek haath se likhi file.',
      '\`swagger-ui-express\` generate hui specification ko ek interactive page ki tarah render karta hai jahan ek developer ek asli request bhej sakta hai aur asli response dekh sakta hai, sirf ek static varnan padhne ke bajaye.',
      'Ek schema-se-nikaali specification ko phir bhi human-likhi context (descriptions, wastavik examples) le kar chalna chahiye jise akela ek type express nahi kar sakta, seedhe schema par khud attach ki gayi.',
      'Ek deprecated API version ko seedhe OpenAPI specification mein maark kiya jaana chahiye (sirf ek HTTP header ke zariye nahi), kyunki ye un developers tak pahunchta hai jo tay kar rahe hain ki kya integrate karna hai kisi bhi code ya traffic maujood hone se pehle.',
    ],
  },
];
