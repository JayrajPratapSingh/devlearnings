/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 5.
 *
 * API versioning and deprecation policy: how a real, long-lived API
 * changes its shape over time — renaming a field, changing a response
 * structure, removing something no longer needed — without breaking
 * every existing client the instant that change ships. Broken example: a
 * field is renamed directly on the existing, already-in-use endpoint,
 * silently breaking every client that was reading the old field name the
 * moment the change deploys, with no warning and no transition period.
 * Fixed by introducing the breaking change as a NEW version (/v2/...)
 * that exists alongside the old one, giving existing clients on /v1/...
 * time to migrate on their own schedule, combined with an explicit
 * Deprecation/Sunset header and a real, communicated timeline before the
 * old version is ever actually removed.
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

export const NODE_MODULE_2_PART5: CourseLesson[] = [
  {
    slug: 'api-versioning-and-deprecation',
    title: 'API Versioning and Deprecation Policy',
    titleHi: 'API Versioning Aur Deprecation Policy',
    description: 'A field gets renamed directly on the live /users endpoint to make the code cleaner — and every mobile app still installed on a customer\'s phone, built against the old field name months ago, silently breaks the instant the change deploys, with no way to fix it except forcing every user to update.',
    descriptionHi: 'Code ko saaf banaane ke liye live \`/users\` endpoint par seedhe ek field ka naam badal diya jaata hai — aur ek customer ke phone par abhi bhi installed har mobile app, jo mahinon pehle purane field name ke khilaaf banaayi gayi thi, badlaav deploy hote hi chupke se toot jaati hai, ise theek karne ka koi tarika bina har user ko update karne majboor karne ke alaawa.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 5,

    analogy: {
      en: '**A power company that changes its electrical outlets\' voltage and shape overnight, with no warning, expecting every household appliance in the entire city to somehow instantly adapt — versus a power company introducing a new outlet standard by running BOTH the old and new wiring in parallel for years, clearly labeling which is which, and only removing the old wiring long after giving every household ample advance notice and time to replace their appliances.** The reckless power company\'s overnight change means every appliance plugged into the old-style outlet — refrigerators, medical equipment, heating systems — stops working the instant the switch happens, with no warning and no way for any household to have prepared, since they had no idea the change was coming or when. The responsible power company instead keeps the existing, proven outlets fully functional exactly as they always were, while introducing the new standard as a genuinely separate, additional option — a household can keep using their old appliances on the old outlets indefinitely, or choose to upgrade to the new ones on their own schedule, and only once the power company has given ample public notice, and a realistic amount of time has passed, does it actually retire the old standard, by which point everyone who needed to migrate has had a real opportunity to do so. An API that changes its existing shape without warning is the reckless power company: every client\'s integration, built against the old shape, breaks the instant the change ships, with no warning and no chance to prepare. Versioning an API — keeping /v1/ running exactly as before while /v2/ exists as a separate, additional option — is the responsible power company\'s approach: existing integrations keep working undisturbed, new integrations can adopt the improved shape, and the old version is only ever retired after a real, communicated, and generous transition period.',
      hi: '**Ek power company jo apne electrical outlets ki voltage aur shape raatorat badal deti hai, koi chetaavni bina, umeed karte hue ki poore shehar ka har ghar ka appliance kisi tarah turant adapt ho jaayega — versus ek power company jo ek naya outlet standard introduce karti hai purani aur nayi wiring dono ko saalon tak parallel chalaate hue, saaf taur par label karte hue ki kaunsi kya hai, aur purani wiring ko sirf tab hataate hue jab har ghar ko poori tarah agli soochana aur apne appliances badalne ka waqt diya jaa chuka ho.** Laapervaah power company ke raatorat badlaav ka matlab hai purane-tarah ke outlets mein plugged har appliance — refrigerators, medical equipment, heating systems — switch hote hi kaam karna band kar deta hai, koi chetaavni bina aur kisi ghar ke taiyaar hone ka koi tarika bina, kyunki unhe pata hi nahi tha ki badlaav aa raha hai ya kab. Zimmedaar power company iske bajaye maujooda, saabit outlets ko poori tarah kaam karta rakhti hai bilkul jaise wo hamesha the, jabki naye standard ko ek sach mein alag, additional vikalp ki tarah introduce karti hai — ek ghar apne purane appliances ko purane outlets par hamesha ke liye istemal karte reh sakta hai, ya apni marzi se naye outlets par upgrade karne ka chunaav kar sakta hai, aur sirf ek baar power company ne poori public soochana de di ho, aur ek wastavik waqt guzar chuka ho, ye asal mein purane standard ko retire karti hai, jis point tak jise bhi migrate karne ki zaroorat thi unhe aisa karne ka ek asli mauka mil chuka hoga. Ek API jo koi chetaavni bina apni maujooda shape badalta hai laapervaah power company hai: har client ka integration, purani shape ke khilaaf bana, badlaav ship hote hi tootta hai, koi chetaavni bina aur taiyaar hone ka koi mauka bina. Ek API ko version karna — \`/v1/\` ko bilkul pehle jaisa chalte rakhna jabki \`/v2/\` ek alag, additional vikalp ki tarah maujood hai — zimmedaar power company ka tarika hai: maujooda integrations bina-chheda kaam karte rehte hain, naye integrations sudhaari hui shape apna sakte hain, aur purana version sirf ek asli, sanchaarit, aur udaar transition avdhi ke baad hi kabhi retire kiya jaata hai.',
    },

    simple: `**Start broken.** A breaking change shipped directly to the existing, live endpoint:

\`\`\`js
// Before: every existing client reads "fullName"
app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

// After: renamed to "name" for "consistency" — deployed directly over the old behavior
app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name }); // every client reading "fullName" now gets undefined
});
\`\`\`

The field rename itself is a reasonable, even well-intentioned improvement — but deploying it directly onto the exact same endpoint every existing client already depends on means every one of those clients, built and shipped months or years ago against the old \`fullName\` field, breaks the instant this deploys. A mobile app already installed on a customer\'s phone cannot be silently, instantly updated the way a web page can be — it keeps calling the same \`/users/:id\` endpoint it always has, now receiving a response shape it was never built to handle, with \`fullName\` simply missing. There was no warning this change was coming, no transition period, and for any client that isn\'t a web frontend the team itself controls, no way to fix the problem except forcing every affected user to install an app update, which may take days or weeks to reach everyone, if they ever update at all.

**The fix: the breaking change becomes a new version, alongside the old one**

\`\`\`js
// /v1/users/:id — completely unchanged, exactly as existing clients expect
app.get("/v1/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

// /v2/users/:id — the new shape, available for clients ready to adopt it
app.get("/v2/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name });
});
\`\`\`

\`\`\`ts
app.get("/v1/users/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

app.get("/v2/users/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name });
});
\`\`\`

\`/v1/users/:id\` continues to exist, entirely unchanged, so every already-shipped client keeps working exactly as it always has, with zero disruption. The improved shape is introduced as a genuinely new, separate route, \`/v2/users/:id\`, which new clients — and existing clients that have chosen, on their own schedule, to migrate — can adopt when they\'re ready. The old version is never simply deleted the moment the new one exists; it stays available for a real, communicated period, giving every client a genuine opportunity to migrate before \`/v1/\` is ever actually retired.`,

    simpleHi: `**Toote hue se shuru.** Ek breaking change seedhe maujooda, live endpoint ko ship kiya jaata hai:

\`\`\`js
// Pehle: har maujooda client "fullName" padhta hai
app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

// Baad mein: "consistency" ke liye "name" mein badla — purane vyavhaar ke oopar seedhe deploy kiya gaya
app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name }); // "fullName" padhta har client ab undefined paata hai
});
\`\`\`

Field rename khud ek samajhdaar, achhi-niyat wala sudhaar hai — par ise bilkul usi endpoint par seedhe deploy karna jispar har maujooda client pehle se nirbhar hai matlab hai un clients mein se har ek, jo mahinon ya saalon pehle purane \`fullName\` field ke khilaaf banaayi aur ship ki gayi thi, ye deploy hote hi tootti hai. Ek customer ke phone par pehle se installed ek mobile app ko chupke se, turant update nahi kiya jaa sakta jaise ek web page ho sakta hai — ye usi \`/users/:id\` endpoint ko call karti rehti hai jo ye hamesha karti thi, ab ek aisi response shape paati hai jise handle karne ke liye ye kabhi banaayi hi nahi gayi thi, \`fullName\` bas gayab hone ke saath. Koi chetaavni nahi thi ki ye badlaav aa raha hai, koi transition avdhi nahi, aur kisi bhi client ke liye jo ek web frontend nahi hai jise team khud niyantrit karti hai, samasya theek karne ka koi tarika nahi hai har asar hue user ko ek app update install karne majboor karne ke alaawa, jise sabtak pahunchne mein din ya hafte lag sakte hain, agar wo kabhi update karein bhi.

**Fix: breaking change ek naya version banta hai, purane ke saath saath**

\`\`\`js
// /v1/users/:id — bilkul na-badla, bilkul jaise maujooda clients umeed karte hain
app.get("/v1/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

// /v2/users/:id — nayi shape, un clients ke liye upalabdh jo ise apnaane taiyaar hain
app.get("/v2/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name });
});
\`\`\`

\`\`\`ts
app.get("/v1/users/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});

app.get("/v2/users/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name });
});
\`\`\`

\`/v1/users/:id\` maujood rehta hai, poori tarah na-badla, taaki har pehle-se-ship-hua client bilkul kaam karta rehta hai jaise hamesha karta tha, bilkul koi rukaawat bina. Behtar shape ek sach mein nayi, alag route ki tarah introduce ki jaati hai, \`/v2/users/:id\`, jise naye clients — aur maujooda clients jinhone apni marzi se migrate karne ka chunaav kiya hai — jab wo taiyaar hon apna sakte hain. Purana version naye ke maujood hote hi kabhi bas delete nahi kiya jaata; ye ek asli, sanchaarit avdhi ke liye upalabdh rehta hai, har client ko migrate karne ka ek asli mauka dete hue isse pehle ki \`/v1/\` kabhi asal mein retire ho.`,

    content: `## Choosing a versioning scheme: URL path vs. header-based

\`\`\`
URL path versioning:    /v1/users/:id, /v2/users/:id
Header-based versioning: GET /users/:id
                         Accept: application/vnd.myapi.v2+json
\`\`\`

The most common, most visible approach is putting the version directly in the URL path (\`/v1/...\`, \`/v2/...\`), which has the practical advantage of being immediately obvious to anyone reading logs, debugging a request, or exploring the API for the first time — there is no ambiguity about which version a given request targeted. Header-based versioning instead keeps a single URL path and lets the client specify the desired version via a request header (commonly \`Accept\` with a custom media type, or a dedicated \`API-Version\` header), which some argue is more "correct" in a strict REST sense, since the resource\'s identity (its URL) doesn\'t change just because its representation does — but it is less visible and easier for a client to get wrong silently by omitting the header entirely. In practice, URL path versioning is the more common, pragmatic default for the large majority of real-world APIs specifically because of its visibility and simplicity, and this course\'s examples use it for that reason.

## Only version when a change is genuinely breaking

\`\`\`
Non-breaking (safe to add to the existing version):
- Adding a new, optional field to a response
- Adding a new endpoint entirely
- Adding a new optional query parameter

Breaking (requires a new version):
- Renaming or removing an existing field
- Changing a field's type or meaning
- Changing a required parameter's behavior
\`\`\`

Not every change to an API requires a new version — a genuinely additive change, one that only adds something new without altering or removing anything an existing client already relies on, can typically be shipped directly to the current version without breaking anyone, since a well-behaved client reads the specific fields it needs and simply ignores fields it doesn\'t recognize. Versioning exists specifically for changes that ARE breaking — where an existing client\'s current behavior would genuinely stop working correctly if the change were applied to the version it\'s already using. Reserving new versions for genuinely breaking changes, rather than creating a new version for every minor addition, keeps the number of versions a team actually has to maintain in parallel from growing unnecessarily.

## Deprecation headers: telling clients a version's retirement is coming

\`\`\`js
app.get("/v1/users/:id", async (req, res) => {
  res.set("Deprecation", "true");
  res.set("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT"); // the date this version stops working
  res.set("Link", '</v2/users/:id>; rel="successor-version"');
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});
\`\`\`

Once a new version exists and clients are expected to eventually migrate, the old version should actively communicate its own upcoming retirement rather than silently continuing to work until the day it\'s abruptly removed. The \`Deprecation\` header signals that this specific version is deprecated; the \`Sunset\` header (a real, standardized HTTP header) gives a specific, concrete date after which the version may stop working entirely; and a \`Link\` header pointing to the successor version helps automated tooling, and developers debugging an integration, discover where to migrate to. This turns "the old version will eventually go away" from an unstated assumption into an explicit, machine-readable signal clients can actually act on — logging a warning, alerting a team, or triggering an automated migration effort well before the actual retirement date arrives.

## Retiring an old version only after a real transition period

\`\`\`
Timeline for retiring /v1/ once /v2/ is available:
1. /v2/ launches, /v1/ continues working unchanged, Deprecation header added to /v1/
2. Monitor actual /v1/ traffic over months — are clients migrating?
3. Directly notify remaining known /v1/ consumers as the Sunset date approaches
4. Only once traffic has genuinely dropped (or the communicated date arrives) —
   remove /v1/
\`\`\`

The entire value of a Deprecation/Sunset header and a communicated timeline is lost if the old version is removed the moment it becomes inconvenient to maintain, regardless of whether clients have actually had a real opportunity to migrate. A genuine deprecation process involves monitoring actual traffic to the old version to see whether migration is actually happening, proactively reaching out to known consumers who haven\'t migrated as the sunset date approaches, and only removing the old version once real, observed usage has dropped to a level where breaking any remaining stragglers is a deliberate, informed decision rather than a surprise — following the same underlying philosophy this course\'s earlier lessons on graceful shutdown and safe migrations apply: change should happen deliberately and safely, never abruptly, for anyone still depending on the thing being changed.`,

    contentHi: `## Ek versioning scheme chunna: URL path vs. header-based

\`\`\`
URL path versioning:    /v1/users/:id, /v2/users/:id
Header-based versioning: GET /users/:id
                         Accept: application/vnd.myapi.v2+json
\`\`\`

Sabse aam, sabse dikhta tarika version ko seedhe URL path mein daalna hai (\`/v1/...\`, \`/v2/...\`), jiska vyavhaarik fayda ye hai ki ye logs padh rahe, ek request debug kar rahe, ya pehli baar API explore kar rahe kisi ke liye turant saaf hai — koi asandigdhta nahi hai ki ek diyi gayi request ne kaunsa version target kiya. Header-based versioning iske bajaye ek akela URL path rakhta hai aur client ko ek header ke zariye chaahe gaya version specify karne deta hai (aam taur par ek custom media type ke saath \`Accept\`, ya ek dedicated \`API-Version\` header), jo kuch log kehte hain ek sakht REST maayne mein zyaada "sahi" hai, kyunki resource ki pehchaan (uska URL) nahi badalta sirf isliye kyunki uska pratinidhitva badalta hai — par ye kam dikhta hai aur ek client ke liye header ko poori tarah chhod kar chupke se galti karna aasaan hai. Practice mein, URL path versioning zyaadatar asli-duniya APIs ke liye zyaada aam, vyavhaarik default hai khaas taur par apni dikhne ki wajah se aur saadgi ki wajah se, aur is course ke examples isliye ise istemal karte hain.

## Sirf tab version karo jab ek badlaav sach mein breaking ho

\`\`\`
Non-breaking (maujooda version mein jodne ke liye surakshit):
- Response mein ek naya, optional field jodna
- Poori tarah ek naya endpoint jodna
- Ek naya optional query parameter jodna

Breaking (ek naye version ki maang karta hai):
- Ek maujooda field ka naam badalna ya hataana
- Ek field ke type ya matlab ko badalna
- Ek zaroori parameter ke vyavhaar ko badalna
\`\`\`

Ek API mein har badlaav ko ek naye version ki zaroorat nahi hai — ek sach mein additive badlaav, ek jo sirf kuch naya jodta hai kisi cheez ko badla ya hataaya bina jispar ek maujooda client pehle se nirbhar hai, aam taur par seedhe current version ko ship kiya jaa sakta hai kisi ko toda bina, kyunki ek achhe-vyavhaar wala client wo khaas fields padhta hai jinki use zaroorat hai aur bas un fields ko nazarandaaz karta hai jinhe wo pehchaanta nahi. Versioning khaas taur par un badlaavon ke liye maujood hai jo BREAKING HAIN — jahan ek maujooda client ka current vyavhaar sach mein kaam karna band kar dega agar badlaav us version par lagu ho jispar ye pehle se istemal ho raha hai. Sach mein breaking badlaavon ke liye naye versions rakhna, har chhoti addition ke liye ek naya version banaane ke bajaye, un versions ki tadaad ko jo ek team ko asal mein ek saath maintain karni padti hai bekaar mein badhne se rokta hai.

## Deprecation headers: clients ko batana ki ek version ka retirement aa raha hai

\`\`\`js
app.get("/v1/users/:id", async (req, res) => {
  res.set("Deprecation", "true");
  res.set("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT"); // wo taareekh jab ye version kaam karna band karega
  res.set("Link", '</v2/users/:id>; rel="successor-version"');
  const user = await getUser(req.params.id);
  res.json({ id: user.id, fullName: user.name });
});
\`\`\`

Ek baar ek naya version maujood hai aur clients se aakhirkaar migrate hone ki umeed ki jaati hai, purane version ko apna aane waala retirement saqriya taur par sanchaarit karna chahiye chupke se kaam karte rehne ke bajaye jab tak jis din ise achaanak hata na diya jaaye. \`Deprecation\` header sanket deta hai ki ye khaas version deprecated hai; \`Sunset\` header (ek asli, standardized HTTP header) ek khaas, concrete taareekh deta hai jiske baad version poori tarah kaam karna band kar sakta hai; aur ek \`Link\` header successor version ki taraf ishaara karta hua automated tooling ko, aur ek integration debug kar rahe developers ko, ye discover karne mein madad karta hai ki kahan migrate karna hai. Ye "purana version aakhirkaar chala jaayega" ko ek na-kahi gayi dhaarna se ek explicit, machine-readable sanket mein badal deta hai jispar clients asal mein kaarvaai kar sakte hain — ek warning log karte hue, ek team ko alert karte hue, ya asli retirement date aane se kaafi pehle ek automated migration effort trigger karte hue.

## Ek purana version sirf ek asli transition avdhi ke baad hi retire karna

\`\`\`
\`/v2/\` upalabdh hone par \`/v1/\` retire karne ke liye timeline:
1. /v2/ launch hota hai, /v1/ na-badla kaam karta rehta hai, /v1/ mein Deprecation header jodaa jaata hai
2. Kai mahinon tak asli /v1/ traffic monitor karo — kya clients migrate ho rahe hain?
3. Sunset date nazdeek aane par bachi hui jaani-pehchaani /v1/ consumers ko seedhe notify karo
4. Sirf ek baar traffic sach mein gir chuka ho (ya sanchaarit taareekh aa jaaye) —
   /v1/ hataao
\`\`\`

Ek Deprecation/Sunset header aur ek sanchaarit timeline ki poori keemat kho jaati hai agar purana version use maintain karna asuvidhajanak hote hi hata diya jaata hai, chahe clients ko asal mein migrate hone ka ek asli mauka mila ho ya nahi. Ek asli deprecation process asli traffic ko purane version ki taraf monitor karna shaamil karta hai ye dekhne ke liye ki kya migration asal mein ho raha hai, sunset date nazdeek aane par jaani-pehchaani consumers ko saqriya taur par sampark karna jinhon ne migrate nahi kiya, aur purane version ko sirf ek baar hataana jab asli, dekha gaya istemal ek aise star tak gir chuka ho jahan kisi bhi bache huon ko todna ek jaan-boojhkar, soochit faisla hai ek surprise ke bajaye — is course ke pehle wale graceful shutdown aur safe migrations lessons jo buniyaadi philosophy lagu karte hain wahi palan karte hue: badlaav jaan-boojhkar aur surakshit taur par hona chahiye, kabhi achaanak nahi, kisi ke liye bhi jo abhi bhi us cheez par nirbhar hai jo badli jaa rahi hai.`,

    examples: [
      {
        title: 'Broken: renaming a field directly on the existing, live endpoint',
        titleHi: 'Toota: maujooda, live endpoint par seedhe ek field ka naam badalna',
        code: `app.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ id: user.id, name: user.name }); // was "fullName" — every existing client breaks`,
        codeJs: `app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, name: user.name }); // renamed with no warning
  } catch (err) {
    next(err);
  }
});
// any client reading response.fullName now gets undefined, instantly, everywhere`,
        codeTs: `app.get("/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the break is entirely
// about the response shape changing for existing clients, not a type error.`,
        output: `Works fine for a brand-new client written against the new shape.
Every existing client built against the old "fullName" field breaks
the instant this deploys, with no warning and no transition period.`,
        explain: 'The response shape changed directly on the same endpoint every existing client already depends on — there was no version boundary to isolate the change behind.',
        explainHi: 'Response shape usi endpoint par seedhe badal gayi jispar har maujooda client pehle se nirbhar hai — badlaav ko peeche isolate karne ke liye koi version boundary nahi thi.',
      },
      {
        title: 'Fixed: the breaking change ships as a new version, old one untouched',
        titleHi: 'Theek: breaking change ek naye version ki tarah ship hota hai, purana na-chheda',
        code: `app.get("/v1/users/:id", async (req, res) => {
  res.json({ id: user.id, fullName: user.name }); // untouched
});
app.get("/v2/users/:id", async (req, res) => {
  res.json({ id: user.id, name: user.name }); // new shape, separate route
});`,
        codeJs: `const router = require("express").Router();

router.get("/v1/users/:id", async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, fullName: user.name });
  } catch (err) {
    next(err);
  }
});

router.get("/v2/users/:id", async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = router;`,
        codeTs: `import { Router, Request, Response, NextFunction } from "express";
const router = Router();

router.get("/v1/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, fullName: user.name });
  } catch (err) {
    next(err);
  }
});

router.get("/v2/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getUser(req.params.id);
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    next(err);
  }
});

export default router;`,
        outputJs: `Existing clients calling /v1/users/:id continue working exactly as
before, with zero disruption. New or migrated clients call /v2/
and receive the improved shape, entirely on their own schedule.`,
        outputTs: `// Identical behaviour. Both versions coexist as genuinely separate
// routes, sharing the same underlying getUser() logic but shaping
// the response differently for each version.`,
        explain: 'The old version is never modified — it continues serving exactly what existing clients expect, while the new version exists as an entirely separate, additional route.',
        explainHi: 'Purana version kabhi modify nahi hota — ye bilkul wahi serve karta rehta hai jo maujooda clients umeed karte hain, jabki naya version ek poori tarah alag, additional route ki tarah maujood hai.',
      },
      {
        title: 'Adding Deprecation and Sunset headers to signal a coming retirement',
        titleHi: 'Aane waale retirement ka sanket dene ke liye Deprecation aur Sunset headers jodna',
        code: `res.set("Deprecation", "true");
res.set("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT");
res.set("Link", '</v2/users/:id>; rel="successor-version"');`,
        codeJs: `router.get("/v1/users/:id", async (req, res, next) => {
  try {
    res.set("Deprecation", "true");
    res.set("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT");
    res.set("Link", '</v2/users/:id>; rel="successor-version"');
    const user = await getUser(req.params.id);
    res.json({ id: user.id, fullName: user.name });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `router.get("/v1/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.set("Deprecation", "true");
    res.set("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT");
    res.set("Link", '</v2/users/:id>; rel="successor-version"');
    const user = await getUser(req.params.id);
    res.json({ id: user.id, fullName: user.name });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `/v1/ continues working exactly as before, but every response now
carries machine-readable signals that this version is deprecated,
has a specific retirement date, and where to migrate to.`,
        outputTs: `// Identical behaviour. These are real, standardized HTTP headers —
// automated client tooling and monitoring dashboards can detect
// and act on them without any custom, one-off convention.`,
        explain: 'The old version keeps working exactly as before, but now actively communicates its own upcoming retirement rather than silently continuing until it\'s abruptly removed.',
        explainHi: 'Purana version bilkul pehle jaisa kaam karta rehta hai, par ab saqriya taur par apna aane waala retirement sanchaarit karta hai chupke se chalte rehne ke bajaye jab tak ise achaanak hata na diya jaaye.',
      },
    ],

    mistakes: [
      {
        wrong: `// Renaming or removing a field directly on the live, already-used endpoint
app.get("/users/:id", (req, res) => res.json({ id: user.id, name: user.name })); // was fullName`,
        right: `app.get("/v1/users/:id", (req, res) => res.json({ id: user.id, fullName: user.name })); // unchanged
app.get("/v2/users/:id", (req, res) => res.json({ id: user.id, name: user.name })); // new version`,
        why: 'A breaking change shipped directly to the version every existing client already uses breaks all of them simultaneously, with no warning and no transition period.',
        whyHi: 'Ek breaking change jo seedhe us version ko ship hoti hai jo har maujooda client pehle se istemal karta hai un sabko ek saath todti hai, koi chetaavni bina aur koi transition avdhi bina.',
      },
      {
        wrong: `// Creating a new version for every tiny, non-breaking addition
app.get("/v7/users/:id", ...); // a new version for adding one optional field`,
        right: `// A purely additive field can go directly on the current version —
// well-behaved clients ignore fields they don't recognize
app.get("/v1/users/:id", (req, res) => res.json({ id: user.id, fullName: user.name, avatarUrl: user.avatar }));`,
        why: 'Creating a new version for every minor, non-breaking addition unnecessarily multiplies the number of versions a team must maintain in parallel, when a purely additive change doesn\'t require one at all.',
        whyHi: 'Har chhoti, non-breaking addition ke liye ek naya version banaana bekaar mein un versions ki tadaad badhaata hai jo ek team ko ek saath maintain karni padti hai, jab ek shuddh additive badlaav ko bilkul ek ki zaroorat nahi hai.',
      },
      {
        wrong: `// Removing the old version the moment the new one launches, with no notice
// /v1/ deleted immediately after /v2/ ships`,
        right: `// /v1/ stays available, with Deprecation/Sunset headers, for a real,
// communicated period before it is ever actually removed`,
        why: 'Removing an old version immediately after a new one launches gives existing clients no real opportunity to migrate, defeating the entire purpose of versioning in the first place.',
        whyHi: 'Naye version ke launch hote hi purane ko turant hataana maujooda clients ko migrate karne ka koi asli mauka nahi deta, versioning ka poora maqsad hi haar dete hue.',
      },
    ],

    realWorld: [
      {
        en: '**URL path versioning (/v1/, /v2/) is the most commonly adopted versioning scheme among major, widely-used public APIs**, valued specifically for how immediately visible and unambiguous it is compared to header-based alternatives.',
        hi: '**URL path versioning (\`/v1/\`, \`/v2/\`) mukhya, vyaapak roop se istemal ki jaane waali public APIs mein sabse aam apnaayi jaane waali versioning scheme hai**, khaas taur par isliye keemti hai ki ye header-based vikalpon ke muqable kitni turant dikhti aur asandigdh hai.',
      },
      {
        en: '**The Deprecation and Sunset HTTP headers are real, standardized headers** (documented in IETF specifications), specifically designed to give clients and automated tooling a machine-readable signal about an API version\'s planned retirement.',
        hi: '**Deprecation aur Sunset HTTP headers asli, standardized headers hain** (IETF specifications mein documented), khaas taur par clients aur automated tooling ko ek API version ke planned retirement ke baare mein ek machine-readable sanket dene ke liye design ki gayi.',
      },
      {
        en: '**Removing a public API version without adequate advance notice is one of the most commonly cited causes of real, publicized integration breakages** for third-party developers, making a communicated deprecation timeline a widely recommended standard practice.',
        hi: '**Poori tarah advance notice bina ek public API version hataana third-party developers ke liye asli, saarvajanik roop se prachaarit integration breakages ke sabse aam taur par cite kiye jaane waale kaaranon mein se ek hai**, ek sanchaarit deprecation timeline ko ek vyaapak roop se recommend ki jaane waali standard practice banaate hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does renaming or removing a field directly on an existing, already-in-use API endpoint pose a fundamentally different risk than making the same change to an internal function or a web frontend the team fully controls?',
        qHi: 'Ek maujooda, pehle-se-istemal-ho-rahe API endpoint par seedhe ek field ka naam badalna ya hataana ek internal function ya ek web frontend jise team poori tarah niyantrit karti hai usi badlaav se buniyaadi taur par alag khatra kyun paida karta hai?',
        a: 'When a team changes an internal function\'s signature or a web frontend\'s own code, the team generally controls every single caller of that function or every deployment of that frontend, and can update all of them simultaneously, or at least within a coordinated, controlled release process — there is no meaningfully independent third party whose behavior the team doesn\'t directly control. An API endpoint that has already been published and adopted by clients is fundamentally different: those clients are often built and deployed entirely independently of the team maintaining the API — a mobile app already installed on thousands or millions of users\' devices, a third-party integration built by a different company, or even a different team within the same organization operating on its own release schedule. The team maintaining the API generally has no ability to instantly, simultaneously update every one of these independent clients the moment the API changes; in the case of an installed mobile app, updating even a single client requires that specific user choosing to install a new app version, which could take anywhere from minutes to weeks or may never happen for some fraction of users at all. This means a breaking change made directly to an endpoint those clients are already calling doesn\'t take effect only once every consumer has had a chance to adapt — it takes effect for every single client simultaneously, the instant the change deploys, regardless of whether any given client is actually ready for it, turning what would be a coordinated, controlled change in an internal-only context into an uncoordinated, simultaneous breakage across every independent consumer of the API.',
        aHi: 'Jab ek team ek internal function ki signature ya ek web frontend ka apna khud ka code badalti hai, team aam taur par us function ke har akele caller ko ya us frontend ki har deployment ko niyantrit karti hai, aur un sabko ek saath, ya kam-se-kam ek coordinated, niyantrit release process ke andar update kar sakti hai — koi maayne-rakhta swatantra third party nahi hai jiske vyavhaar ko team seedhe niyantrit nahi karti. Ek API endpoint jo pehle se publish ho chuka hai aur clients dwara apnaaya gaya hai buniyaadi taur par alag hai: wo clients aksar API maintain kar rahi team se poori tarah swatantra roop se banaaye aur deploy kiye jaate hain — ek mobile app jo hazaaron ya lakhon users ke devices par pehle se installed hai, ek third-party integration jo ek alag company ne banaayi, ya usi organization ke andar bhi ek alag team jo apne khud ke release schedule par kaam kar rahi hai. API maintain kar rahi team ke paas aam taur par in swatantra clients mein se har ek ko turant, ek saath update karne ki kshamta nahi hai jis pal API badalta hai; ek installed mobile app ke maamle mein, ek akele client ko update karne ke liye us khaas user ko ek nayi app version install karne ka chunaav karna maangta hai, jismein minutes se hafton tak lag sakte hain ya kuch users ke ek hisse ke liye kabhi hoga hi nahi. Iska matlab hai us endpoint mein seedhe kiya gaya ek breaking change jise wo clients pehle se call kar rahe hain sirf tab asar nahi karta jab har consumer ko adapt hone ka mauka mil chuka ho — ye har akele client ke liye ek saath, badlaav deploy hote hi asar karta hai, chahe koi bhi diya client asal mein iske liye taiyaar ho ya nahi, ek internal-hi context mein ek coordinated, niyantrit badlaav hone waali cheez ko API ke har swatantra consumer ke aar-paar ek na-coordinated, ek-saath breakage mein badalte hue.',
      },
      {
        q: 'How should a team decide whether a given API change requires a new version, versus being safe to ship directly to the existing one?',
        qHi: 'Ek team ko kaise faisla karna chahiye ki ek diya API badlaav ek naye version ki maang karta hai, versus maujooda ko seedhe ship karna surakshit hai?',
        a: 'The genuine deciding factor is whether the change could cause any existing, already-deployed client\'s current behavior to actually break or misbehave if applied directly to the version that client is already using — not whether the change is significant in effort or whether it "feels" like a big change from the team\'s own perspective. A purely additive change — introducing an entirely new endpoint that didn\'t exist before, or adding a new, optional field to an existing response that wasn\'t there previously — is generally safe to ship directly, because a well-behaved client only reads the specific fields or endpoints it was built to use, and simply has no reason to be affected by the presence of something new it never asked for or expected in the first place; the client\'s existing code continues working exactly as it did, since nothing it currently depends on has changed. A change becomes genuinely breaking, and therefore requires a new version, specifically when it alters or removes something an existing client\'s current behavior actually depends on: renaming or removing a field a client reads, changing a field\'s data type or its meaning in a way that would produce different, unexpected behavior if the client\'s existing code processed it unchanged, or altering how a required parameter is interpreted such that a request the client was already correctly sending would now be handled differently or rejected. The practical test a team can apply to any proposed change is asking specifically: is there a plausible, currently-deployed client, built against the CURRENT version\'s exact behavior, whose existing code would behave differently or incorrectly if this change were applied directly to that same version? If the honest answer is yes, the change is breaking and belongs behind a new version; if the honest answer is genuinely no, shipping it directly to the existing version, without the overhead of maintaining an additional version in parallel, is the appropriate and simpler choice.',
        aHi: 'Asli faisla karne waala factor ye hai ki kya badlaav kisi maujooda, pehle-se-deploy-hue client ke current vyavhaar ko asal mein todne ya galat vyavhaar karne ka kaaran ban sakta hai agar seedhe us version par lagu kiya jaaye jo wo client pehle se istemal kar raha hai — ye nahi ki badlaav mehanat mein maayne-rakhta hai ya team ke apne nazariye se "bada" badlaav lagta hai. Ek shuddh additive badlaav — ek poori tarah naya endpoint introduce karna jo pehle maujood nahi tha, ya ek maujooda response mein ek naya, optional field jodna jo pehle wahaan nahi tha — aam taur par seedhe ship karna surakshit hai, kyunki ek achhe-vyavhaar wala client sirf un khaas fields ya endpoints ko padhta hai jinke liye ye banaaya gaya tha, aur us naye ki maujoodgi se asar hone ka bilkul koi kaaran nahi rakhta jise usne kabhi maanga ya shuru mein umeed nahi ki thi; client ka maujooda code bilkul waise kaam karta rehta hai jaise ye karta tha, kyunki jispar ye abhi nirbhar hai kuch bhi nahi badla. Ek badlaav sach mein breaking ban jaata hai, aur isliye ek naye version ki maang karta hai, khaas taur par jab ye kisi aisi cheez ko badalta ya hataata hai jispar ek maujooda client ka current vyavhaar asal mein nirbhar hai: ek field ka naam badalna ya hataana jise ek client padhta hai, ek field ke data type ya matlab ko is tarah badalna ki client ke maujooda code ne use na-badla process kiya to alag, apratyaashit vyavhaar paida hoga, ya ye badalna ki ek zaroori parameter kaise samjha jaata hai taaki ek request jo client pehle se sahi tarike se bhej raha tha ab alag tarike se handle ya reject ki jaayegi. Vyavhaarik test jo ek team kisi bhi prastaavit badlaav par lagu kar sakti hai khaas taur par poochna hai: kya koi vaastavik, abhi-deployed client hai, CURRENT version ke bilkul vyavhaar ke khilaaf bana, jiska maujooda code alag ya galat tarike se vyavhaar karega agar ye badlaav seedhe usi version par lagu ho? Agar imaandaar jawaab haan hai, badlaav breaking hai aur ek naye version ke peeche hai; agar imaandaar jawaab sach mein nahi hai, ise seedhe maujooda version ko ship karna, ek additional version ko ek saath maintain karne ke overhead bina, upyukt aur saadha chunaav hai.',
      },
      {
        q: 'Why does simply removing the old API version the moment a new one launches defeat the entire purpose of versioning in the first place?',
        qHi: 'Naye ke launch hote hi purane API version ko bas hataana versioning ka poora maqsad hi shuru mein kyun haar deta hai?',
        a: 'The entire reason versioning exists is to give existing, already-deployed clients — many of which the API-maintaining team does not directly control or have the ability to instantly update — a genuine window of time during which they can continue operating unaffected while independently choosing when and how to migrate to a new version on their own schedule, rather than being forced to migrate instantaneously the moment a breaking change is introduced. If the old version is removed the very moment the new one becomes available, this entire benefit is negated: every client still using the old version, which by definition includes every client that has not yet had the opportunity to migrate (which realistically includes most or all existing clients immediately after a new version launches, since migration takes real engineering time on the client\'s side), experiences exactly the same abrupt, simultaneous breakage that versioning was specifically designed to prevent — the only difference is that the breakage happens at the moment of removal rather than the moment of the original change, but the practical impact on unprepared clients is identical either way. This is precisely why a genuine deprecation process requires an actual, meaningful transition period between when a new version becomes available and when the old one is finally removed — a period during which the old version continues functioning exactly as before, existing clients are given active notice via mechanisms like Deprecation and Sunset headers, and the API-maintaining team can observe real traffic patterns to judge whether clients are actually migrating before committing to an actual removal date. Skipping this transition period and removing the old version immediately provides all of the maintenance burden of having briefly supported two versions with essentially none of the actual benefit versioning exists to provide.',
        aHi: 'Versioning ke maujood hone ka poora kaaran maujooda, pehle-se-deploy-hue clients ko — jinmein se kai ko API-maintain-karti team seedhe niyantrit nahi karti ya turant update karne ki kshamta nahi rakhti — waqt ki ek asli window dena hai jiske dauraan wo bina-asar-hue chalte reh sakte hain jabki swatantra roop se ye chunte hain ki kab aur kaise apni marzi se ek naye version mein migrate karna hai, ek breaking change introduce hote hi turant migrate hone majboor hone ke bajaye. Agar naya version upalabdh hote hi purana hataa diya jaata hai, ye poora fayda khatam ho jaata hai: purana version abhi bhi istemal kar raha har client, jismein definition se har wo client shaamil hai jise migrate karne ka mauka abhi tak nahi mila (jismein wastavik roop se naye version ke launch hote hi lagbhag saare maujooda clients shaamil hain, kyunki migration mein client ki taraf se asli engineering waqt lagta hai), bilkul wahi achaanak, ek-saath breakage anubhav karta hai jise rokne ke liye versioning khaas taur par design ki gayi thi — sirf antar ye hai ki breakage hataane ke pal hota hai asli badlaav ke pal ke bajaye, par na-taiyaar clients par vyavhaarik asar dono tarah se identical hai. Bilkul isi wajah se ek asli deprecation process ko ek asli, maayne-rakhta transition avdhi chahiye jab naya version upalabdh hota hai aur jab purana aakhirkaar hataaya jaata hai ke beech — ek avdhi jiske dauraan purana version bilkul pehle jaisa kaam karta rehta hai, maujooda clients ko Deprecation aur Sunset headers jaise mechanisms ke zariye saqriya soochna di jaati hai, aur API-maintain-karti team asli traffic patterns dekh sakti hai ye judge karne ke liye ki kya clients asal mein migrate ho rahe hain ek asli removal date par committed hone se pehle. Is transition avdhi ko skip karna aur purane version ko turant hataana do versions ko thodi der support karne ka poora maintenance bhaar deta hai lagbhag koi asli fayda ke bina jise dene ke liye versioning maujood hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a /v1/users/:id endpoint returning a fullName field. Add a /v2/users/:id endpoint returning name instead, sharing the same underlying getUser logic, and confirm both versions work correctly and independently.',
        taskHi: 'Ek \`/v1/users/:id\` endpoint banaao jo ek \`fullName\` field lautaata hai. Ek \`/v2/users/:id\` endpoint jodo jo iske bajaye \`name\` lautaata hai, usi underlying \`getUser\` logic share karte hue, aur confirm karo dono versions sahi tarike se aur akele-akele kaam karte hain.',
        hint: 'Extract the shared data-fetching logic into one function both route handlers call, so only the response-shaping code differs between v1 and v2.',
        hintHi: 'Shared data-fetching logic ko ek function mein nikaalo jise dono route handlers call karte hain, taaki sirf response-shape karne wala code v1 aur v2 ke beech alag ho.',
      },
      {
        task: 'Add Deprecation, Sunset, and Link headers to the /v1/ endpoint from the previous exercise, following this lesson\'s example. Use curl or a browser\'s network tab to confirm the headers appear correctly in the response.',
        taskHi: 'Pichhle exercise ke \`/v1/\` endpoint mein Deprecation, Sunset, aur Link headers jodo, is lesson ke example ka palan karte hue. \`curl\` ya ek browser ke network tab ka istemal karke confirm karo ki headers response mein sahi tarike se dikhte hain.',
        hint: 'curl -I against your /v1/ endpoint shows only the response headers, making it easy to confirm they\'re present without needing to inspect the full body.',
        hintHi: 'Apne \`/v1/\` endpoint ke khilaaf \`curl -I\` sirf response headers dikhaata hai, poori body inspect kiye bina confirm karna aasaan banaate hue ki wo maujood hain.',
      },
      {
        task: 'Write down (as a comment or a short doc) what would make a hypothetical future change to this API "breaking" versus "safe to add directly." List at least three examples of each based on this lesson\'s distinction.',
        taskHi: 'Likho (ek comment ya ek chhoti doc ki tarah) kya is API mein ek kalpaniya bhavishya ke badlaav ko "breaking" versus "seedhe jodne ke liye surakshit" banaayega. Is lesson ke antar ke aadhaar par har ek ke kam-se-kam teen misalein list karo.',
        hint: 'For each hypothetical change, ask: would an existing client\'s current code behave differently or incorrectly if this were applied directly to the version it\'s already using?',
        hintHi: 'Har kalpaniya badlaav ke liye, poocho: kya ek maujooda client ka current code alag ya galat tarike se vyavhaar karega agar ye seedhe us version par lagu ho jo ye pehle se istemal kar raha hai?',
      },
    ],

    keyTakeaways: [
      'A breaking change shipped directly to an existing, already-in-use endpoint breaks every deployed client simultaneously the instant it deploys, with no warning and no transition period.',
      'URL path versioning (/v1/, /v2/) is the most common, most visible scheme — the version a request targeted is immediately obvious from the URL itself.',
      'Not every change needs a new version — a purely additive change (a new endpoint, a new optional field) is generally safe to ship directly, since well-behaved clients ignore what they don\'t recognize.',
      'A change is genuinely breaking, and needs a new version, specifically when it alters or removes something an existing client\'s current behavior actually depends on.',
      'Deprecation and Sunset headers actively communicate an old version\'s planned retirement, turning an unstated assumption into an explicit, machine-readable signal clients can act on.',
      'An old version should only be retired after a real, communicated transition period with genuinely observed migration — removing it the moment a new one launches defeats the entire purpose of versioning.',
    ],
    keyTakeawaysHi: [
      'Ek maujooda, pehle-se-istemal-ho-rahe endpoint ko seedhe ship hui ek breaking change har deployed client ko ek saath todti hai deploy hote hi, koi chetaavni bina aur koi transition avdhi bina.',
      'URL path versioning (\`/v1/\`, \`/v2/\`) sabse aam, sabse dikhti scheme hai — ek request ne kaunsa version target kiya URL se hi turant saaf hai.',
      'Har badlaav ko ek naye version ki zaroorat nahi hai — ek shuddh additive badlaav (ek naya endpoint, ek naya optional field) aam taur par seedhe ship karna surakshit hai, kyunki achhe-vyavhaar wale clients jo nahi pehchaante use nazarandaaz karte hain.',
      'Ek badlaav sach mein breaking hai, aur ek naye version ki zaroorat hai, khaas taur par jab ye kisi aisi cheez ko badalta ya hataata hai jispar ek maujooda client ka current vyavhaar asal mein nirbhar hai.',
      'Deprecation aur Sunset headers ek purane version ke planned retirement ko saqriya taur par sanchaarit karte hain, ek na-kahi gayi dhaarna ko ek explicit, machine-readable sanket mein badalte hue jispar clients kaarvaai kar sakte hain.',
      'Ek purana version sirf ek asli, sanchaarit transition avdhi ke baad hi retire hona chahiye sach mein dekhe gaye migration ke saath — naye ke launch hote hi ise hataana versioning ka poora maqsad hi haar deta hai.',
    ],
  },
];
