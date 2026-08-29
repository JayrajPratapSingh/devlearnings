/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 17.
 *
 * Feature flags and progressive rollout: how large teams ship code to
 * production continuously, every day, without waiting for a "big bang"
 * release, and without every incomplete feature living on its own
 * long-lived branch accumulating painful merge conflicts. Broken example:
 * a large feature merged and deployed straight to 100% of users the
 * instant the deploy finishes — if it turns out to be broken, the only
 * way to turn it off is a full code revert and a brand new deployment,
 * which itself takes time and carries its own risk. Fixed by wrapping the
 * new code path in a feature flag: deploying the code turned OFF by
 * default, enabling it first for the team internally, then a small
 * percentage of real users, gradually increasing, with the ability to
 * flip it back off instantly — as a runtime configuration change, not a
 * new deployment — the moment something looks wrong.
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

export const NODE_MODULE_7_PART17: CourseLesson[] = [
  {
    slug: 'feature-flags-and-progressive-rollout',
    title: 'Feature Flags and Progressive Rollout',
    titleHi: 'Feature Flags Aur Progressive Rollout',
    description: 'A new checkout flow ships to every single customer the instant the deploy finishes — and when it turns out to have a bug that only shows up under real traffic, the only way to stop the bleeding is a full revert and a brand new deployment, while orders keep failing in the meantime.',
    descriptionHi: 'Ek naya checkout flow deploy poora hote hi har akele customer ko ship ho jaata hai — aur jab ye pata chalta hai ki ismein ek bug hai jo sirf asli traffic ke neeche dikhta hai, khoon rokne ka ekmatra tarika ek poora revert aur ek bilkul naya deployment hai, jabki is beech orders fail hote rehte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 17,

    analogy: {
      en: '**A restaurant introducing a brand-new dish by first quietly offering it to a handful of regular customers who won\'t mind trying something new, watching closely how it goes, then gradually adding it to more and more tables\' menus over the following weeks — versus a restaurant that prints it into the main menu for all 200 seats on day one, with no way to stop offering it except reprinting the entire menu.** At the cautious restaurant, if the very first few regulars who try the new dish report it\'s too salty, the kitchen fixes the recipe having disappointed only a handful of forgiving regulars, not an entire dining room, and pulling the dish from tonight\'s offering is as simple as telling the servers to stop mentioning it — no reprinting required, no interruption to anything else the restaurant serves. At the reckless restaurant, the exact same salty dish reaches all 200 seats simultaneously on day one; if it\'s bad, the restaurant has already disappointed 200 customers before anyone at the kitchen even realizes there\'s a problem, and un-offering it requires physically reprinting and redistributing an entirely new menu to every table, taking time during which the kitchen keeps serving something it now knows is wrong. A feature flag is exactly the cautious restaurant\'s approach applied to software: a new feature is turned on for a small, controlled group first, watched closely, and can be turned back off instantly — as easily as telling the servers to stop mentioning it — rather than requiring a brand new "menu" (a whole new deployment) just to stop showing something that turned out to be broken.',
      hi: '**Ek restaurant jo ek bilkul-naya dish pesh karta hai pehle use chupke se mutthi bhar regular customers ko offer karke jinhe kuch naya try karne mein koi aitraaz nahi, dhyaan se dekhte hue ye kaisa jaata hai, phir dheere-dheere aane waale hafton mein zyaada-se-zyaada tables ke menus mein jodte hue — versus ek restaurant jo pehle din hi sabhi 200 seats ke liye main menu mein use chhaap deta hai, use offer karna rokne ka koi tarika bina poora menu dobara chhaapne ke.** Savdhaan restaurant mein, agar bilkul pehle kuch regulars jo naya dish try karte hain report karte hain ki ye bahut zyaada namkeen hai, kitchen recipe theek kar deti hai sirf mutthi bhar maafkaar regulars ko nirash karke, poori dining room ko nahi, aur aaj raat ki offering se dish hataana bas servers ko batana jitna aasaan hai ki ise mention karna band karein — koi reprinting zaroori nahi, restaurant jo kuch aur bhi parosta hai use koi rukaawat nahi. Laapervaah restaurant mein, bilkul wahi namkeen dish pehle din ek saath sabhi 200 seats tak pahunchti hai; agar ye bura hai, restaurant pehle se hi 200 customers ko nirash kar chuka hota hai kisi ko kitchen mein bhi ye ehsaas hone se pehle ki koi samasya hai, aur ise wapas na-offer karne ke liye har table ko physically ek poori tarah nayi menu dobara chhaapni aur baantni padti hai, us waqt ke dauraan kitchen kuch aisa parosti rehti hai jo ab use pata hai galat hai. Ek feature flag bilkul savdhaan restaurant ke tarike ka software par lagu kiya jaana hai: ek naya feature pehle ek chhote, niyantrit group ke liye on kiya jaata hai, dhyaan se dekha jaata hai, aur turant wapas off kiya jaa sakta hai — bilkul utna aasaan jitna servers ko batana ki ise mention karna band karein — ek bilkul nayi "menu" (ek poori nayi deployment) ki zaroorat ke bajaye bas kuch dikhaana rokne ke liye jo tootaa hua nikla.',
    },

    simple: `**Start broken.** A new feature ships to 100% of traffic the instant it deploys:

\`\`\`js
app.post("/checkout", async (req, res, next) => {
  try {
    const result = await newCheckoutFlow(req.body); // every single customer gets this immediately
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The moment this deploy finishes, every single customer, all at once, is now going through \`newCheckoutFlow\` — code that may have passed every test in a staging environment but has never actually processed a single real, live transaction under real production conditions (real payment methods, real edge cases in real customers\' data, real traffic volume). If it turns out to have a bug that only manifests under some specific, real-world condition nobody\'s test happened to cover, every customer hitting checkout during the time it takes to notice, diagnose, revert the code, and deploy the revert is affected — and that revert-and-redeploy cycle itself takes real time and carries its own risk of going wrong, all while the original bug continues actively affecting customers.

**The fix: wrap the new code behind a feature flag, roll it out gradually**

\`\`\`js
const flags = require("./featureFlags");

app.post("/checkout", async (req, res, next) => {
  try {
    const result = flags.isEnabled("new-checkout-flow", req.userId)
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import * as flags from "./featureFlags";

app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = flags.isEnabled("new-checkout-flow", req.userId)
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The code for \`newCheckoutFlow\` is deployed to production, but \`isEnabled("new-checkout-flow", req.userId)\` starts out returning \`false\` for everyone — the new code exists in production but genuinely nobody is using it yet, completely decoupling "the code has been deployed" from "customers are actually experiencing this feature." The team can first flip the flag on only for their own internal accounts, then a random 1% of real users, watching error rates and metrics (this course\'s earlier observability lesson) closely, before gradually increasing to 5%, 25%, and eventually 100% — and at any point during this rollout, if something looks wrong, the flag can be flipped back to \`false\` instantly, as a simple configuration change, with no new deployment required at all, immediately restoring every affected user to the known-working \`oldCheckoutFlow\` while the actual bug is investigated calmly.`,

    simpleHi: `**Toote hue se shuru.** Ek naya feature deploy hote hi 100% traffic ko ship ho jaata hai:

\`\`\`js
app.post("/checkout", async (req, res, next) => {
  try {
    const result = await newCheckoutFlow(req.body); // har akela customer ise turant paata hai
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Jis pal ye deploy poora hota hai, har akela customer, ek saath, ab \`newCheckoutFlow\` se guzar raha hai — code jo shaayad staging environment mein har test pass kar chuka ho par asal mein kabhi ek bhi asli, live transaction ko asli production sthitiyon ke neeche process nahi kiya (asli payment methods, asli customers ke data mein asli edge cases, asli traffic volume). Agar ismein ek bug nikalta hai jo sirf kisi khaas, asli-duniya sthiti mein zaahir hota hai jise kisi ki test cover karti hi nahi thi, checkout par pahunchta har customer us waqt ke dauraan asar mein aata hai jo pata lagaane, diagnose karne, code revert karne, aur revert deploy karne mein lagta hai — aur wo revert-aur-redeploy cycle khud asli waqt leta hai aur galat hone ka apna khud ka khatra uthaata hai, is sab ke dauraan asli bug customers ko saqriya taur par asar karta rehta hai.

**Fix: naye code ko ek feature flag ke peeche wrap karo, ise dheere-dheere rollout karo**

\`\`\`js
const flags = require("./featureFlags");

app.post("/checkout", async (req, res, next) => {
  try {
    const result = flags.isEnabled("new-checkout-flow", req.userId)
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import * as flags from "./featureFlags";

app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = flags.isEnabled("new-checkout-flow", req.userId)
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`newCheckoutFlow\` ka code production mein deploy hota hai, par \`isEnabled("new-checkout-flow", req.userId)\` shuru mein sabke liye \`false\` lautaata hai — naya code production mein maujood hai par asal mein abhi tak koi bhi ise istemal nahi kar raha, "code deploy ho chuka hai" ko "customers asal mein ye feature anubhav kar rahe hain" se poori tarah alag karte hue. Team pehle sirf apne internal accounts ke liye flag on kar sakti hai, phir asli users ka ek random 1%, error rates aur metrics (is course ke pehle wale observability lesson) ko dhyaan se dekhte hue, dheere-dheere 5%, 25%, aur aakhirkaar 100% tak badhaane se pehle — aur is rollout ke dauraan kisi bhi point par, agar kuch galat lagta hai, flag ko turant wapas \`false\` par flip kiya jaa sakta hai, ek saadhe configuration badlaav ki tarah, bilkul koi nayi deployment ki zaroorat bina, turant har asar hue user ko jaani-pehchaani-kaam-karti \`oldCheckoutFlow\` par bahaal karte hue jabki asli bug ki shaanti se jaanch ki jaati hai.`,

    content: `## Decoupling "deployed" from "released": the core idea behind feature flags

\`\`\`
Deployed  = the new code exists on production servers and could run.
Released  = real users are actually experiencing the new behavior.

Without a flag: deploying a feature IS releasing it — the two happen
at the exact same instant, for every single user, unconditionally.

With a flag: deploying is separate from releasing — the code exists
in production the moment it's deployed, but who actually experiences
it is controlled independently, afterward, at will.
\`\`\`

The single most important idea behind feature flags is that "the code has been deployed to production" and "real users are experiencing this new behavior" do not have to be the same event. Without any flag, they are inseparable by definition — the instant a deploy finishes, every user hitting that code path gets the new behavior, whether that was actually the intended moment for that or not. A feature flag introduces a deliberate, controllable gap between these two events: the code can sit deployed in production, fully present and ready, while a runtime check decides who, if anyone, actually experiences it — a decision that can be changed instantly, without any new deployment, at any later moment.

## Progressive rollout: expanding exposure gradually while watching for problems

\`\`\`js
function isEnabled(flagName, userId) {
  const rolloutPercentage = getRolloutPercentage(flagName); // e.g. 5, 25, 100
  const bucket = hashUserId(userId) % 100;
  return bucket < rolloutPercentage;
}
\`\`\`

Rather than a flag being a simple all-or-nothing on/off switch, a progressive rollout gradually increases the percentage of real traffic exposed to a new feature — starting at 0% (deployed but off), moving to the internal team only, then perhaps 1% of real users, then 5%, 25%, 50%, and eventually 100%, with each stage held for long enough to genuinely observe error rates and relevant metrics (this course\'s earlier observability lesson) before advancing further. Consistently hashing a stable identifier like a user ID into a percentage bucket ensures the same user reliably lands in or out of the rollout on every request, rather than flickering between old and new behavior from one request to the next, which would itself be a confusing, inconsistent experience.

## The kill switch: turning a broken feature off in seconds, not a deploy cycle

\`\`\`
Broken feature, no flag: revert the code → open a PR → get it merged
→ trigger a new deployment → wait for it to complete → THEN the bug
stops affecting new requests. Minutes to tens of minutes, minimum.

Broken feature, with a flag: flip rolloutPercentage back to 0 in the
feature-flag dashboard or config → takes effect within seconds, no
deployment involved at all.
\`\`\`

This is often the single most valuable property of a feature flag in practice: because the flag\'s state is a runtime configuration value, not something baked into the deployed code itself, turning a misbehaving feature off requires no code change, no pull request, no new deployment — just flipping the flag\'s value, which typically takes effect within seconds. This turns "we shipped a bug" from an incident requiring the full weight of an emergency deploy process into something that can be immediately contained the moment it\'s noticed, buying the team calm, unpressured time to actually diagnose and fix the underlying issue without the bug continuing to affect users in the meantime.

## Trunk-based development: shipping continuously without long-lived feature branches

\`\`\`
Without flags: a large feature lives on its own branch for weeks,
accumulating merge conflicts with everyone else's work, and is only
merged and released as one large, risky, all-at-once event.

With flags: the same feature's code is merged to the main branch
continuously, in small pieces, from day one — always present but
turned off until it's genuinely ready, avoiding weeks of drift.
\`\`\`

A large feature that takes weeks to build does not need to live on its own long-running branch, silently drifting further and further from everyone else\'s ongoing changes to the main branch and accumulating an ever-larger, ever-riskier merge conflict waiting to happen. Feature flags enable a genuinely different workflow, commonly called trunk-based development: the feature\'s code is merged to the main branch in small, incremental pieces continuously, from the very start of development, wrapped behind a flag that keeps it turned off and invisible to real users until the team deliberately decides it\'s ready — at which point turning it on is a configuration change, not a merge. This means the main branch is always deployable, merge conflicts stay small since nobody\'s changes drift far from everyone else\'s for long, and "is this feature done" becomes a separate question from "has this code been merged," decoupled exactly the same way deploying is decoupled from releasing.`,

    contentHi: `## "Deployed" ko "Released" se alag karna: feature flags ke peeche mool dhaarna

\`\`\`
Deployed  = naya code production servers par maujood hai aur chal sakta hai.
Released  = asli users asal mein naya vyavhaar anubhav kar rahe hain.

Flag bina: ek feature deploy karna use RELEASE karna HAI — dono bilkul
usi pal hote hain, har akele user ke liye, bina kisi shart ke.

Flag ke saath: deploy karna release karne se alag hai — code deploy
hote hi production mein maujood hai, par asal mein kaun ise anubhav
karta hai wo alag se, baad mein, marzi se niyantrit hota hai.
\`\`\`

Feature flags ke peeche sabse zyaada zaruri dhaarna ye hai ki "code production mein deploy ho chuka hai" aur "asli users ye naya vyavhaar anubhav kar rahe hain" ek hi event hone ki zaroorat nahi hai. Kisi bhi flag bina, ye definition se ek-doosre se alag-na-kiye-jaane-laayak hain — deploy poora hote hi, us code path ko chhooti har user naya vyavhaar paata hai, chahe ye asal mein us waqt intended tha ya nahi. Ek feature flag in do events ke beech ek jaan-boojhkar, niyantrit-kiya-jaa-sakne-waala gap introduce karta hai: code production mein deploy hokar reh sakta hai, poori tarah maujood aur taiyaar, jabki ek runtime check faisla karta hai ki asal mein kaun, agar koi hai, use anubhav karta hai — ek faisla jise turant, koi nayi deployment bina, kisi bhi baad ke pal badla jaa sakta hai.

## Progressive rollout: exposure ko dheere-dheere badhaana samasyaon ke liye dekhte hue

\`\`\`js
function isEnabled(flagName, userId) {
  const rolloutPercentage = getRolloutPercentage(flagName); // jaise 5, 25, 100
  const bucket = hashUserId(userId) % 100;
  return bucket < rolloutPercentage;
}
\`\`\`

Ek flag ko ek saadha sab-ya-kuch-nahi on/off switch hone ke bajaye, ek progressive rollout dheere-dheere asli traffic ka pratishat badhaata hai jo ek naye feature ko dekhta hai — 0% se shuru hokar (deployed par off), sirf internal team tak jaate hue, phir shaayad asli users ka 1%, phir 5%, 25%, 50%, aur aakhirkaar 100%, har stage ko itni der tak rakhte hue ki sach mein error rates aur mutaalliq metrics (is course ke pehle wale observability lesson) dekhi jaa sakein aage badhne se pehle. Ek sthir identifier jaise user ID ko consistently ek percentage bucket mein hash karna sunishchit karta hai ki wahi user har request par bharosemand taur par rollout ke andar ya baahar aata hai, ek request se doosri tak purane aur naye vyavhaar ke beech flicker karne ke bajaye, jo khud ek confusing, asangat anubhav hota.

## Kill switch: ek toota feature seconds mein band karna, ek deploy cycle mein nahi

\`\`\`
Toota feature, koi flag nahi: code revert karo → ek PR kholo → use
merge karwao → ek nayi deployment trigger karo → poora hone ka
intezaar karo → TABHI bug naye requests ko asar karna band karta
hai. Kam-se-kam minutes se dazanon minutes.

Toota feature, ek flag ke saath: feature-flag dashboard ya config
mein \`rolloutPercentage\` ko wapas 0 par flip karo → seconds ke andar
asar hota hai, koi deployment bilkul shaamil nahi.
\`\`\`

Ye aksar practice mein ek feature flag ki sabse zyaada keemti property hai: kyunki flag ki sthiti ek runtime configuration value hai, khud deployed code mein pakki hui koi cheez nahi, ek bura vyavhaar karte feature ko band karne ke liye koi code badlaav, koi pull request, koi nayi deployment ki zaroorat nahi — bas flag ki value flip karna, jo aam taur par seconds ke andar asar karta hai. Ye "humne ek bug ship kiya" ko ek emergency deploy process ke poore bhaar ki maang karti ek incident se aisi cheez mein badal deta hai jise notice hote hi turant contain kiya jaa sakta hai, team ko shaant, bina-dabaav samay dete hue asli issue ki jaanch aur fix karne ke liye bina bug ke is beech users ko asar karte rehne ke.

## Trunk-based development: lambe-chalte feature branches bina lagaataar ship karna

\`\`\`
Flags bina: ek bada feature hafton tak apni khud ki branch par
rehta hai, baaki sabke chal rahe kaam ke saath merge conflicts jama
karte hue, aur sirf ek bade, khatarnaak, ek-saath-hone-waale event
ki tarah merge aur release hota hai.

Flags ke saath: usi feature ka code main branch mein lagaataar,
chhote tukdon mein, din ek se merge hota hai — hamesha maujood par
tab tak off jab tak ye sach mein taiyaar na ho, hafton ke bhatkaav
se bachte hue.
\`\`\`

Ek bada feature jise banaane mein hafte lagte hain apni khud ki lambi-chalti branch par rehne ki zaroorat nahi rakhta, chupke se main branch ke baaki sabke chal rahe badlaavon se aur aage bhatakte hue aur ek hamesha-badhta, hamesha-zyaada-khatarnaak merge conflict jama karte hue jo hona hai. Feature flags ek sach mein alag workflow ko mumkin banaate hain, aam taur par trunk-based development kahlaata hai: feature ka code main branch mein chhote, badhte hue tukdon mein lagaataar merge hota hai, development ke bilkul shuru se, ek flag ke peeche wrap kiya hua jo ise asli users ke liye tab tak off aur na-dikhta rakhta hai jab tak team jaan-boojhkar faisla nahi karti ki ye taiyaar hai — us point par ise on karna ek merge nahi, ek configuration badlaav hai. Iska matlab hai main branch hamesha deploy-laayak hai, merge conflicts chhote rehte hain kyunki kisi ke badlaav baaki sabse lambe samay tak door nahi bhatakte, aur "kya ye feature poora hai" "kya ye code merge hua hai" se ek alag sawaal ban jaata hai, bilkul usi tarah alag kiya gaya jaise deploy karna release karne se alag kiya jaata hai.`,

    examples: [
      {
        title: 'Broken: a new feature ships to 100% of traffic instantly on deploy',
        titleHi: 'Toota: ek naya feature deploy hote hi 100% traffic ko turant ship hota hai',
        code: `app.post("/checkout", async (req, res, next) => {
  const result = await newCheckoutFlow(req.body); // every customer, immediately
  res.json(result);
});
// a bug here means a full revert-and-redeploy to stop it`,
        codeJs: `app.post("/checkout", async (req, res, next) => {
  try {
    const result = await newCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
// no way to disable this except reverting the code and redeploying`,
        codeTs: `app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await newCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the risk is entirely
// about the all-or-nothing release, not a type or logic error.`,
        output: `Works fine if newCheckoutFlow has no bugs. If it does, every
customer is affected the instant the deploy finishes, and stopping
it requires a full code revert and a brand new deployment cycle.`,
        explain: 'Nothing here separates "this code is deployed" from "every customer is experiencing it right now" — the two happen at exactly the same instant, for everyone, unconditionally.',
        explainHi: 'Yahan kuch bhi "ye code deploy hai" ko "har customer ise abhi anubhav kar raha hai" se alag nahi karta — dono bilkul usi pal hote hain, sabke liye, bina kisi shart ke.',
      },
      {
        title: 'Fixed: a feature flag decouples deploying from releasing',
        titleHi: 'Theek: ek feature flag deploy karne ko release karne se alag karta hai',
        code: `const enabled = flags.isEnabled("new-checkout-flow", req.userId);
const result = enabled ? await newCheckoutFlow(req.body) : await oldCheckoutFlow(req.body);`,
        codeJs: `const flags = require("./featureFlags");

app.post("/checkout", async (req, res, next) => {
  try {
    const enabled = flags.isEnabled("new-checkout-flow", req.userId);
    const result = enabled
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import * as flags from "./featureFlags";

app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enabled = flags.isEnabled("new-checkout-flow", req.userId);
    const result = enabled
      ? await newCheckoutFlow(req.body)
      : await oldCheckoutFlow(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The code deploys with the flag off — nobody sees newCheckoutFlow
yet. The team enables it for themselves, then 1% of real traffic,
watching metrics before increasing further.`,
        outputTs: `// Identical behaviour. If newCheckoutFlow misbehaves at any rollout
// stage, flipping the flag back to off takes effect within seconds,
// no new deployment required.`,
        explain: 'The flag introduces a deliberate gap between "deployed" and "released" — who experiences the new code is a runtime decision, changeable instantly, independent of the deployment itself.',
        explainHi: 'Flag "deployed" aur "released" ke beech ek jaan-boojhkar gap introduce karta hai — kaun naya code anubhav karta hai ye ek runtime faisla hai, turant badla jaa sakta hai, deployment khud se alag.',
      },
      {
        title: 'Consistent percentage-based rollout using a hashed user ID',
        titleHi: 'Ek hash kiye gaye user ID istemal karte hue consistent percentage-based rollout',
        code: `function isEnabled(flagName, userId) {
  const percentage = getRolloutPercentage(flagName);
  return (hashUserId(userId) % 100) < percentage;
}`,
        codeJs: `const crypto = require("crypto");

function hashUserId(userId) {
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  return parseInt(hash.substring(0, 8), 16);
}

function isEnabled(flagName, userId) {
  const percentage = getRolloutPercentage(flagName); // e.g. 25
  return (hashUserId(userId) % 100) < percentage;
}`,
        codeTs: `import * as crypto from "crypto";

function hashUserId(userId: string): number {
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  return parseInt(hash.substring(0, 8), 16);
}

function isEnabled(flagName: string, userId: string): boolean {
  const percentage = getRolloutPercentage(flagName);
  return (hashUserId(userId) % 100) < percentage;
}`,
        outputJs: `A given userId always hashes to the same bucket (0-99), so the same
user consistently sees the same version of the feature across
requests — no flickering between old and new behaviour.`,
        outputTs: `// Identical behaviour, fully typed. Increasing "percentage" from
// 25 to 50 expands the rollout without changing which users at the
// smaller 25% were already in it — they remain included.`,
        explain: 'Hashing a stable identifier ensures rollout membership is deterministic per user rather than randomly re-decided on every request, which would produce a confusing, inconsistent experience.',
        explainHi: 'Ek sthir identifier ko hash karna sunishchit karta hai ki rollout membership prati-user deterministic hai har request par randomly dobara-tay hone ke bajaye, jo ek confusing, asangat anubhav paida karta.',
      },
    ],

    mistakes: [
      {
        wrong: `// A large feature developed on its own branch for six weeks
git checkout -b big-new-feature
// merged all at once at the end, after drifting far from main`,
        right: `// The same feature merged to main continuously, in small pieces,
// wrapped behind a flag that keeps it off until genuinely ready
if (flags.isEnabled("new-checkout-flow", req.userId)) { /* ... */ }`,
        why: 'A long-lived feature branch accumulates an ever-larger merge conflict and delays integration feedback for weeks — feature flags let the same code merge continuously without being visible to real users yet.',
        whyHi: 'Ek lambe samay se chalti feature branch ek hamesha-badhta merge conflict jama karti hai aur integration feedback ko hafton tak dheema karti hai — feature flags usi code ko abhi asli users ko dikhe bina lagaataar merge hone dete hain.',
      },
      {
        wrong: `// A flag exists, but the only way to change it is editing a config
// file and redeploying — defeating the whole point of a runtime flag
const ENABLE_NEW_CHECKOUT = false; // hardcoded, requires a deploy to change`,
        right: `// The flag's value is read from a runtime source (a database,
// a feature-flag service, environment config reloaded without restart)
// that can change without any code deployment
const enabled = await flags.isEnabled("new-checkout-flow", req.userId);`,
        why: 'A flag hardcoded into deployed source code still requires a full deployment to change, losing the instant-kill-switch benefit that is the entire point of a feature flag.',
        whyHi: 'Deployed source code mein hardcoded ek flag badalne ke liye phir bhi ek poori deployment maangta hai, turant-kill-switch fayda kho dete hue jo ek feature flag ka poora maqsad hai.',
      },
      {
        wrong: `// Randomly deciding rollout membership on every single request
const enabled = Math.random() < 0.25; // a user might see old and new behaviour alternately`,
        right: `const enabled = (hashUserId(userId) % 100) < 25; // same user always lands in the same bucket`,
        why: 'Deciding rollout membership randomly per-request rather than deterministically per-user produces an inconsistent, flickering experience for the same real customer across their own requests.',
        whyHi: 'Prati-request randomly rollout membership tay karna prati-user deterministically ke bajaye usi asli customer ke liye unki apni requests ke aar-paar ek asangat, flickering anubhav paida karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Feature flags are one of the most widely cited practices enabling continuous deployment at companies that ship to production many times a day**, explicitly because they decouple the moment code is deployed from the moment it is actually experienced by real users.',
        hi: '**Feature flags un companies mein continuous deployment ko mumkin banaane ke liye sabse vyaapak roop se cite ki jaane waali practices mein se ek hain jo din mein kai baar production ko ship karti hain**, explicitly isliye kyunki wo code deploy hone ke pal ko asal mein asli users dwara anubhav kiye jaane ke pal se alag karte hain.',
      },
      {
        en: '**Dedicated feature-flag platforms (such as LaunchDarkly, Unleash, or a homegrown equivalent) are standard infrastructure at companies operating at real scale**, providing percentage rollouts, targeting rules, and instant kill switches as first-class, purpose-built tooling.',
        hi: '**Dedicated feature-flag platforms (jaise LaunchDarkly, Unleash, ya ek homegrown equivalent) asli scale par chalti companies mein standard infrastructure hain**, percentage rollouts, targeting rules, aur turant kill switches ko first-class, is maqsad ke liye bani tooling ki tarah dete hue.',
      },
      {
        en: '**Trunk-based development, enabled directly by feature flags, is a widely recommended practice for large teams specifically because it avoids the painful, high-risk merges long-lived feature branches otherwise accumulate.**',
        hi: '**Trunk-based development, seedhe feature flags dwara mumkin banaayi gayi, badi teams ke liye ek vyaapak roop se recommend ki jaane waali practice hai khaas taur par isliye kyunki ye us dardnaak, uchch-khatre wale merges se bachati hai jo lambe samay se chalti feature branches iske alaawa jama karti hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why is separating "deploying" a feature from "releasing" it such a significant improvement over the traditional deploy-equals-release model?',
        qHi: 'Ek feature ko "deploy" karne ko use "release" karne se alag karna traditional deploy-barabar-release model se itna bada sudhaar kyun hai?',
        a: 'In the traditional model, the instant a deployment finishes, every single user hitting the affected code path immediately experiences the new behavior, with no intermediate step and no ability to control exposure — deploying and releasing are, by construction, the exact same event. This means the very first real-world exposure any new code ever gets is simultaneously its full-scale exposure to the entire user base, with no opportunity to observe how it behaves under genuine production conditions (real traffic patterns, real edge cases in real data, real concurrent load) at a smaller, safer scale first. If the new code has any bug that only manifests under some real-world condition that testing happened not to cover — which is common, since staging environments and test suites can never perfectly replicate the full diversity of real production traffic — every single user is affected simultaneously, and undoing that exposure requires an entirely new deployment cycle (revert the code, get it through CI, deploy the revert), during which the bug continues actively affecting users. Separating deploying from releasing, via a feature flag, converts this into a fundamentally safer process: the code can exist in production, fully deployed and ready, while a separate, instantly-changeable runtime decision controls who is actually exposed to it, starting from nobody, then internal team members, then a small percentage of real users. This means the first real-world exposure happens at a small, controlled, easily-reversible scale, genuine production behavior can be observed before expanding further, and if something goes wrong, exposure can be reduced back to zero in seconds via a configuration change, rather than requiring the same slow, risky deployment cycle that introduced the problem in the first place.',
        aHi: 'Traditional model mein, deployment poora hote hi, us asar hue code path ko chhooti har akeli user turant naya vyavhaar anubhav karti hai, koi beech ka step nahi aur exposure niyantrit karne ki koi kshamta nahi — deploy karna aur release karna, construction se, bilkul wahi event hain. Iska matlab hai kisi bhi naye code ka bilkul pehla asli-duniya exposure ek saath poore user base ko uska poori-scale ka exposure bhi hai, pehle ek chhoti, surakshit scale par ye dekhne ka koi mauka bina ki ye asli production sthitiyon (asli traffic patterns, asli data mein asli edge cases, asli concurrent load) ke neeche kaisa vyavhaar karta hai. Agar naye code mein koi bhi bug hai jo sirf kisi asli-duniya sthiti mein zaahir hota hai jise testing cover karti hi nahi thi — jo aam hai, kyunki staging environments aur test suites kabhi asli production traffic ki poori vividhata ko perfectly replicate nahi kar sakte — har akeli user ek saath asar mein aati hai, aur us exposure ko wapas lena ek poori nayi deployment cycle maangta hai (code revert karo, use CI se guzaro, revert deploy karo), jiske dauraan bug saqriya taur par users ko asar karta rehta hai. Deploy karne ko release karne se alag karna, ek feature flag ke zariye, ise ek buniyaadi taur par surakshit process mein badal deta hai: code production mein maujood rah sakta hai, poori tarah deployed aur taiyaar, jabki ek alag, turant-badla-jaa-sakne-waala runtime faisla niyantrit karta hai ki asal mein kaun ise expose hota hai, kisi se nahi shuru hokar, phir internal team members, phir asli users ka ek chhota pratishat. Iska matlab hai bilkul pehla asli-duniya exposure ek chhoti, niyantrit, aasaani-se-wapas-le-jaane-laayak scale par hota hai, asli production vyavhaar aage badhne se pehle dekha jaa sakta hai, aur agar kuch galat ho jaaye, exposure ko ek configuration badlaav ke zariye seconds mein wapas zero par kiya jaa sakta hai, us wahi dheeme, khatarnaak deployment cycle ki zaroorat ke bajaye jisne samasya pehli jagah introduce ki.',
      },
      {
        q: 'Why does a feature flag whose value is hardcoded into deployed source code fail to provide the key benefit a feature flag is meant to offer?',
        qHi: 'Ek feature flag jiski value deployed source code mein hardcoded hai flag ke maqsad ka mukhya fayda dene mein kyun fail hoti hai?',
        a: 'The central, most valuable benefit of a feature flag is the ability to change who is exposed to a feature — including turning it off entirely — instantly, as a runtime configuration change, with no new code deployment required at all. This benefit depends entirely on the flag\'s current value being read from somewhere that can be changed independently of the deployed code itself: a database row, a dedicated feature-flag service queried at runtime, or a configuration source that can be updated and take effect without restarting or redeploying the application. If a flag\'s value is instead hardcoded directly into the source code — a plain constant like const ENABLE_NEW_CHECKOUT = false written directly into a file that gets compiled and deployed — changing that value still requires editing the source file, committing the change, getting it through code review and CI, and triggering an entirely new deployment, which is exactly the same slow, multi-step process a feature flag exists specifically to avoid. In this hardcoded form, the flag technically still allows the feature to be conditionally present in the codebase, but it provides none of the actual operational benefit: there is no instant kill switch, no ability to adjust a rollout percentage without a deploy, and no way for someone without deployment access (a product manager, an on-call engineer without deploy permissions) to change exposure themselves. A genuinely useful feature flag\'s value must live in a runtime-changeable location specifically so that the entire point of the mechanism — decoupling changing exposure from the deployment pipeline — actually holds in practice.',
        aHi: 'Ek feature flag ka sabse zyaada keemti fayda ye kshamta hai ki kaun ek feature ko expose hota hai use badal sako — poori tarah band karne sameet — turant, ek runtime configuration badlaav ki tarah, koi nayi code deployment ki zaroorat bilkul bina. Ye fayda poori tarah is baat par nirbhar hai ki flag ki maujooda value kahin se padhi jaati hai jo khud deployed code se alag badla jaa sakta hai: ek database row, ek dedicated feature-flag service jo runtime par query hoti hai, ya ek configuration source jo update ho sakta hai aur application ko restart ya redeploy kiye bina asar kar sakta hai. Agar iske bajaye ek flag ki value seedhe source code mein hardcoded hai — ek saadha constant jaise \`const ENABLE_NEW_CHECKOUT = false\` seedhe ek file mein likha jo compile aur deploy hota hai — us value ko badalna phir bhi source file edit karna, badlaav commit karna, ise code review aur CI se guzaarna, aur ek poori tarah nayi deployment trigger karna maangta hai, jo bilkul wahi dheema, kai-step wala process hai jise avoid karne ke liye khaas taur par ek feature flag maujood hai. Is hardcoded roop mein, flag technically abhi bhi feature ko codebase mein conditionally maujood hone deta hai, par ye asli operational fayde mein se kuch nahi deta: koi turant kill switch nahi, koi rollout percentage ko deploy bina adjust karne ki kshamta nahi, aur deployment access na rakhne waale kisi (ek product manager, deploy permissions bina ek on-call engineer) ke liye khud exposure badalne ka koi tarika nahi. Ek sach mein upyogi feature flag ki value ko ek runtime-badla-jaa-sakne-waali jagah mein rehna chahiye khaas taur par taaki mechanism ka poora maqsad — exposure badalne ko deployment pipeline se alag karna — asal mein practice mein tike.',
      },
      {
        q: 'Why does hashing a stable user identifier matter for a percentage-based rollout, rather than deciding randomly on every request?',
        qHi: 'Ek percentage-based rollout ke liye ek sthir user identifier ko hash karna kyun maayne rakhta hai, har request par randomly faisla karne ke bajaye?',
        a: 'A percentage-based rollout is meant to expose a controlled, gradually increasing fraction of overall traffic to a new feature while it is being validated — but the specific way that fraction is determined has significant consequences for the actual experience of any individual real user. If rollout membership is decided by generating a fresh random number on every single incoming request, independent of anything about the specific user making that request, a given real customer could easily be randomly included in the rollout on one request and excluded on their very next one, moments later — meaning the same person might see the new checkout flow on one visit and the old one immediately afterward, with no consistent, predictable experience at all, which is confusing at best and could actively break a user\'s workflow if the two versions behave differently in ways that matter across their session. Hashing a stable identifier that belongs specifically to that user — a user ID, an account ID, or a persistent session identifier — into a deterministic bucket (commonly via a hash function\'s output modulo 100) instead ensures the exact same input always produces the exact same bucket value for that specific user, every single time it is computed, regardless of which request or how much time has passed. This means a given user\'s rollout membership is decided once, consistently, rather than being re-rolled randomly on every request, so the same real user reliably experiences either the new or the old behavior consistently throughout the rollout, and as the rollout percentage is gradually increased, users who were already included at a smaller percentage remain included rather than potentially being excluded again by a fresh random determination.',
        aHi: 'Ek percentage-based rollout kul traffic ka ek niyantrit, dheere-dheere badhta hissa ek naye feature ko expose karne ke liye hai jabki ye validate kiya jaa raha hai — par wo khaas tarika jismein wo hissa tay kiya jaata hai kisi bhi akele asli user ke asli anubhav ke liye maayne-rakhta natije rakhta hai. Agar rollout membership har akeli aati request par ek taaza random number generate karke tay ki jaati hai, us khaas user se bekhabar jo wo request kar raha hai, ek diya asli customer aasaani se ek request par rollout mein randomly shaamil ho sakta hai aur unki bilkul agli mein, kuch pal baad, bahar. Matlab wahi vyakti ek visit par naya checkout flow dekh sakta hai aur usi ke turant baad purana, koi consistent, anumaanit anubhav bilkul bina, jo acche se acche confusing hai aur ek user ke workflow ko saqriya taur par tod sakta hai agar dono versions un tareekon se alag vyavhaar karte hain jo unke session ke aar-paar maayne rakhte hain. Iske bajaye us user se khaas taur par talluq rakhta ek sthir identifier — ek user ID, ek account ID, ya ek sthaayi session identifier — ko ek deterministic bucket mein hash karna (aam taur par ek hash function ke output modulo 100 ke zariye) sunishchit karta hai ki bilkul wahi input hamesha us khaas user ke liye bilkul wahi bucket value paida karta hai, har baar jab ye calculate hota hai, chahe kaunsi request ho ya kitna waqt guzar gaya ho. Iska matlab hai ek diye user ki rollout membership ek baar, consistently, tay ki jaati hai, har request par randomly dobara-roll hone ke bajaye, taaki wahi asli user bharosemand taur par naya ya purana vyavhaar consistently rollout mein poori tarah anubhav kare, aur jaise-jaise rollout percentage dheere-dheere badhaaya jaata hai, jo users pehle se hi ek chhote pratishat par shaamil the shaamil rehte hain ek taaze random determination dwara dobara bahar hone ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build a simple isEnabled(flagName, userId) function backed by an in-memory object mapping flag names to a rollout percentage. Wrap a route\'s logic in an if/else based on it, defaulting the percentage to 0.',
        taskHi: 'Ek saadha \`isEnabled(flagName, userId)\` function banaao ek in-memory object ke peeche jo flag names ko ek rollout percentage se maps karta hai. Ek route ki logic ko uske aadhaar par ek \`if/else\` mein wrap karo, percentage ko default 0 rakhte hue.',
        hint: 'Start the percentage at 0 for every flag by default, and confirm the "new" code path is genuinely never reached until you explicitly raise it.',
        hintHi: 'Har flag ke liye percentage ko default 0 par shuru karo, aur confirm karo ki "naya" code path sach mein kabhi nahi pahunchta jab tak tum ise explicitly na badhaao.',
      },
      {
        task: 'Implement the hashed-user-ID bucketing shown in this lesson, and write a small script that calls isEnabled for the same 10 user IDs twice, confirming each user consistently lands in the same in/out result both times.',
        taskHi: 'Is lesson mein dikhaaya hashed-user-ID bucketing implement karo, aur ek chhota script likho jo usi 10 user IDs ke liye \`isEnabled\` do baar call kare, confirm karte hue ki har user dono baar consistently usi in/out result mein aata hai.',
        hint: 'If a user\'s result changes between the two calls with the same percentage, the hashing isn\'t actually deterministic — check that hashUserId doesn\'t depend on anything that changes between calls (like the current time).',
        hintHi: 'Agar ek user ka result dono calls ke beech usi percentage ke saath badalta hai, hashing asal mein deterministic nahi hai — check karo ki \`hashUserId\` kisi aisi cheez par nirbhar nahi hai jo calls ke beech badalti hai (jaise current time).',
      },
      {
        task: 'Simulate a "kill switch": set a flag to 100%, then immediately flip it back to 0% and confirm every subsequent request falls back to the old code path with no deployment or restart involved.',
        taskHi: 'Ek "kill switch" simulate karo: ek flag ko 100% set karo, phir turant use wapas 0% par flip karo aur confirm karo ki har agli request purane code path par wapas jaati hai koi deployment ya restart shaamil bina.',
        hint: 'If your flag storage is a plain in-memory JavaScript object, changing it should take effect on the very next request with no process restart required at all.',
        hintHi: 'Agar tumhaari flag storage ek saadha in-memory JavaScript object hai, use badalna bilkul agli request par asar karna chahiye koi process restart bilkul zaroorat bina.',
      },
    ],

    keyTakeaways: [
      'A feature flag decouples "the code has been deployed" from "real users are experiencing this behavior" — without one, the two are, by definition, the exact same event.',
      'Progressive rollout gradually increases the percentage of traffic exposed to a new feature, watching metrics at each stage before expanding further, rather than exposing 100% of users on day one.',
      'The kill switch is the flag\'s most valuable property in practice: turning a broken feature off is a runtime configuration change taking effect in seconds, not a code revert and a new deployment cycle.',
      'A flag\'s value must live somewhere runtime-changeable (a database, a feature-flag service) — a value hardcoded into deployed source code still requires a full deployment to change, losing the entire benefit.',
      'Rollout membership should be decided by hashing a stable identifier like a user ID into a deterministic bucket, not by a fresh random roll per request, so the same user has a consistent experience.',
      'Feature flags enable trunk-based development: large features merge to main continuously in small pieces, wrapped behind a flag, avoiding the painful, high-risk merges long-lived feature branches otherwise accumulate.',
    ],
    keyTakeawaysHi: [
      'Ek feature flag "code deploy ho chuka hai" ko "asli users ye vyavhaar anubhav kar rahe hain" se alag karta hai — kisi ke bina, dono, definition se, bilkul wahi event hain.',
      'Progressive rollout ek naye feature ko dekhti traffic ka pratishat dheere-dheere badhaata hai, har stage par metrics dekhte hue aage badhne se pehle, pehle din 100% users ko expose karne ke bajaye.',
      'Kill switch practice mein flag ki sabse zyaada keemti property hai: ek toota feature band karna ek runtime configuration badlaav hai jo seconds mein asar karta hai, ek code revert aur ek nayi deployment cycle nahi.',
      'Ek flag ki value kahin runtime-badla-jaa-sakne-waali jagah (ek database, ek feature-flag service) mein rehni chahiye — deployed source code mein hardcoded ek value ko badalne ke liye phir bhi ek poori deployment chahiye, poora fayda kho dete hue.',
      'Rollout membership ek sthir identifier jaise user ID ko ek deterministic bucket mein hash karke tay ki jaani chahiye, prati-request ek taaza random roll se nahi, taaki wahi user ka ek consistent anubhav ho.',
      'Feature flags trunk-based development ko mumkin banaate hain: bade features main mein lagaataar chhote tukdon mein merge hote hain, ek flag ke peeche wrap kiye hue, un dardnaak, uchch-khatre wale merges se bachte hue jo lambe samay se chalti feature branches iske alaawa jama karti hain.',
    ],
  },
];
