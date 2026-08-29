/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 15.
 *
 * Module boundaries and lightweight domain-driven design: why a codebase
 * organized correctly into routes/controllers/services/models (this
 * course's earlier file-structure lesson) can STILL turn into an
 * unmaintainable tangle as it grows past what one small team can hold in
 * their heads, if nothing governs which modules are allowed to import
 * from which other modules. Broken example: an "orders" service directly
 * importing internals from a "users" service and a "billing" service,
 * and vice versa, so that changing any one of the three risks silently
 * breaking either of the other two. Fixed by drawing explicit boundaries
 * around each business domain, deciding a clear allowed direction of
 * dependency between them, and exposing only a small, deliberate public
 * interface from each — enforced with lint rules rather than left as an
 * unwritten convention everyone is trusted to remember.
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

export const NODE_MODULE_7_PART15: CourseLesson[] = [
  {
    slug: 'module-boundaries-and-domain-driven-design',
    title: 'Module Boundaries and Lightweight Domain-Driven Design',
    titleHi: 'Module Boundaries Aur Lightweight Domain-Driven Design',
    description: 'A codebase that started clean with routes, controllers, and services slowly turns into a web where the orders module reaches into billing\'s internals, billing reaches into users\', and changing any one of the three now risks silently breaking either of the other two.',
    descriptionHi: 'Ek codebase jo routes, controllers, aur services ke saath saaf shuru hui thi dheere-dheere ek aisi jaal ban jaati hai jahan orders module billing ke internals mein pahunchta hai, billing users ke andar pahunchta hai, aur inmein se kisi ek ko badalna ab chupke se doosre do mein se kisi ko todne ka khatra uthaata hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 15,

    analogy: {
      en: '**An apartment building where every unit\'s wiring, plumbing, and load-bearing walls are freely shared and modified by whichever resident happens to need something, versus one where each unit has its own clearly defined utilities, and any resident wanting a change to something shared must go through the building\'s official, agreed process rather than just cutting into a wall themselves.** In the first building, a resident on the third floor who wants brighter kitchen lighting simply reroutes wiring that happens to run through their unit — wiring that, unknown to them, also feeds the second floor\'s refrigerator. The lights get brighter, and elsewhere in the building, a stranger\'s food quietly starts spoiling, with no way for either resident to have seen this coming, since nothing about the building\'s structure made clear which wiring belonged to whom or was safe to touch. In the second building, every unit exposes only its own light switches and outlets to its resident — the building\'s shared electrical trunk lines are not something any individual unit ever reaches into directly, and if a change to those shared lines is genuinely needed, it goes through the building\'s management with a clear, deliberate process, precisely because everyone understands that shared infrastructure cannot be safely modified by whoever happens to be nearby at the time. A codebase without clear module boundaries is the first building: any file can reach into any other file\'s internals, and a change made for one perfectly good reason can silently break something in a completely unrelated part of the system, discovered only when it breaks. A codebase with deliberate module boundaries is the second: each domain exposes a small, explicit public interface, keeps its own internals private, and changes to shared behavior go through an agreed, visible path rather than a silent, direct reach into someone else\'s walls.',
      hi: '**Ek apartment building jahan har unit ki wiring, plumbing, aur load-bearing walls jo bhi resident ko kuch chahiye ho uske dwara azaadi se share aur badli jaati hain, versus ek jahan har unit ki apni saaf taur par define ki gayi utilities hain, aur koi bhi resident jo kisi shared cheez mein badlaav chaahta hai use building ke official, sehmat kiye gaye process se guzarna padta hai khud deewaar kaatne ke bajaye.** Pehli building mein, teesri manzil ka ek resident jo apni kitchen mein zyaada tez roshni chaahta hai bas wiring reroute kar deta hai jo unki unit se guzarti hai — wiring jo, unhe pata nahi, doosri manzil ke refrigerator ko bhi feed karti hai. Lights zyaada tez ho jaate hain, aur building mein kahin aur, ek ajnabi ka khaana chupke se kharaab hona shuru ho jaata hai, na to koi resident ise pehle se dekh sakta tha, kyunki building ke structure mein kuch bhi saaf nahi karta tha ki kaunsi wiring kiski thi ya chhoona surakshit tha. Doosri building mein, har unit apne resident ko sirf apne khud ke light switches aur outlets expose karti hai — building ki shared electrical trunk lines kuch aisa nahi hai jismein koi bhi akeli unit kabhi seedhe pahunchti hai, aur agar un shared lines mein sach mein ek badlaav zaroori hai, ye building management ke through ek saaf, jaan-boojhkar process se guzarta hai, bilkul isliye kyunki har koi samajhta hai ki shared infrastructure ko jo bhi us waqt aas-paas ho use surakshit taur par nahi badla jaa sakta. Saaf module boundaries wali ek codebase pehli building hai: koi bhi file kisi bhi doosri file ke internals mein pahunch sakti hai, aur ek perfect achhi wajah se kiya gaya badlaav chupke se system ke ek poori tarah na-jude hisse mein kuch tod sakta hai, sirf tab pata chalta hai jab ye tootta hai. Jaan-boojhkar module boundaries wali codebase doosri hai: har domain ek chhota, explicit public interface expose karta hai, apne internals private rakhta hai, aur shared behavior mein badlaav ek sehmat, dikhti hui raah se guzarte hain kisi doosre ki deewaaron mein ek chupka, seedha pahunch ke bajaye.',
    },

    simple: `**Start broken.** Three domains reaching directly into each other\'s internals:

\`\`\`js
// src/orders/service.js
const { userDb } = require("../users/db");        // reaches straight into users\' internal db module
const { chargeCard } = require("../billing/stripe"); // reaches straight into billing\'s internal Stripe client

async function createOrder(userId, items) {
  const user = await userDb.query("SELECT * FROM users WHERE id = $1", [userId]); // orders now knows users\' exact table shape
  const charge = await chargeCard(user.rows[0].stripeCustomerId, total(items));    // orders now knows billing\'s exact Stripe usage
  return { orderId: 123, charge };
}
\`\`\`

Each individual file here looks completely reasonable in isolation — \`orders\` genuinely does need to know about the user placing the order and genuinely does need to charge them. The problem is HOW it reaches that information: by importing \`users\`\' own internal database module directly, and calling \`billing\`\'s own internal Stripe client directly, rather than going through anything either domain deliberately exposes for this purpose. This means \`orders\` now has silent, invisible knowledge of \`users\`\' exact database table shape and \`billing\`\'s exact Stripe integration details — knowledge that was never meant to be public, and that nobody working on \`users\` or \`billing\` necessarily knows \`orders\` is relying on. The day someone refactors \`users\`\' database schema, or \`billing\` switches away from calling Stripe\'s client directly in favor of a queued job, \`orders\` breaks — not because anyone touched \`orders\`\' own code, but because it was quietly depending on internals it was never supposed to know about, entangling three domains that should have been able to change independently.

**The fix: each domain exposes a small, explicit public interface, and internals stay private**

\`\`\`js
// src/users/index.js — the ONLY file other domains are allowed to import from
async function getUserForBilling(userId) {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}
module.exports = { getUserForBilling };

// src/billing/index.js — the ONLY file other domains are allowed to import from
async function chargeCustomer(stripeCustomerId, amount) {
  return chargeCard(stripeCustomerId, amount);
}
module.exports = { chargeCustomer };

// src/orders/service.js — only ever imports the other domains\' public index.js
const users = require("../users");
const billing = require("../billing");

async function createOrder(userId, items) {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}
\`\`\`

\`\`\`ts
// src/users/index.ts
export async function getUserForBilling(userId: string): Promise<{ userId: string; stripeCustomerId: string }> {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}

// src/billing/index.ts
export async function chargeCustomer(stripeCustomerId: string, amount: number): Promise<Charge> {
  return chargeCard(stripeCustomerId, amount);
}

// src/orders/service.ts
import * as users from "../users";
import * as billing from "../billing";

export async function createOrder(userId: string, items: Item[]): Promise<Order> {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}
\`\`\`

Now \`users\` and \`billing\` can each change their own internal database schema, table structure, or third-party integration however they need to, as long as their small public function (\`getUserForBilling\`, \`chargeCustomer\`) keeps returning the same shape — \`orders\` never has to change, because it never knew about those internals to begin with. The boundary is not a suggestion left to memory; it is enforced by which file physically exists to be imported: only \`users/index.js\` and \`billing/index.js\` are ever imported by code outside their own domain, and anything else inside those folders is understood to be private implementation detail.`,

    simpleHi: `**Toote hue se shuru.** Teen domains seedhe ek doosre ke internals mein pahunchte hue:

\`\`\`js
// src/orders/service.js
const { userDb } = require("../users/db");        // seedhe users ke internal db module mein pahunchta hai
const { chargeCard } = require("../billing/stripe"); // seedhe billing ke internal Stripe client mein pahunchta hai

async function createOrder(userId, items) {
  const user = await userDb.query("SELECT * FROM users WHERE id = $1", [userId]); // orders ab users ki bilkul table shape jaanta hai
  const charge = await chargeCard(user.rows[0].stripeCustomerId, total(items));    // orders ab billing ka bilkul Stripe istemal jaanta hai
  return { orderId: 123, charge };
}
\`\`\`

Yahan har akeli file akele mein poori tarah samajhdaari-bhari dikhti hai — \`orders\` ko sach mein order lagaane wale user ke baare mein jaanna hai aur sach mein unse charge karna hai. Samasya ye hai ki YE jaankaari kaise paata hai: \`users\` ke apne internal database module ko seedhe import karke, aur \`billing\` ke apne internal Stripe client ko seedhe call karke, kisi aise cheez ke through jaane ke bajaye jise ya to domain jaan-boojhkar is maqsad ke liye expose karta hai. Iska matlab hai \`orders\` ke paas ab \`users\` ki bilkul database table shape aur \`billing\` ke bilkul Stripe integration details ki chupi, na-dikhti jaankaari hai — jaankaari jo kabhi public hone ke liye nahi thi, aur jise \`users\` ya \`billing\` par kaam kar rahe kisi ko zaroori nahi pata ki \`orders\` iss par nirbhar hai. Jis din koi \`users\` ka database schema refactor karta hai, ya \`billing\` seedhe Stripe client call karne ke bajaye ek queued job ki taraf badalta hai, \`orders\` toot jaata hai — is liye nahi ki kisi ne \`orders\` ka apna khud ka code chhua, balki isliye kyunki ye chupke se un internals par nirbhar tha jinke baare mein use kabhi jaanna hi nahi tha, teen domains ko uljhaate hue jinhe akele-akele badal paana chahiye tha.

**Fix: har domain ek chhota, explicit public interface expose karta hai, aur internals private rehte hain**

\`\`\`js
// src/users/index.js — ekmatra file jise doosre domains import karne ki ijaazat hai
async function getUserForBilling(userId) {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}
module.exports = { getUserForBilling };

// src/billing/index.js — ekmatra file jise doosre domains import karne ki ijaazat hai
async function chargeCustomer(stripeCustomerId, amount) {
  return chargeCard(stripeCustomerId, amount);
}
module.exports = { chargeCustomer };

// src/orders/service.js — sirf doosre domains ke public index.js hi kabhi import karta hai
const users = require("../users");
const billing = require("../billing");

async function createOrder(userId, items) {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}
\`\`\`

\`\`\`ts
// src/users/index.ts
export async function getUserForBilling(userId: string): Promise<{ userId: string; stripeCustomerId: string }> {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}

// src/billing/index.ts
export async function chargeCustomer(stripeCustomerId: string, amount: number): Promise<Charge> {
  return chargeCard(stripeCustomerId, amount);
}

// src/orders/service.ts
import * as users from "../users";
import * as billing from "../billing";

export async function createOrder(userId: string, items: Item[]): Promise<Order> {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}
\`\`\`

Ab \`users\` aur \`billing\` dono apna internal database schema, table structure, ya third-party integration jaise bhi zaroorat ho badal sakte hain, jab tak unka chhota public function (\`getUserForBilling\`, \`chargeCustomer\`) wahi shape lautaata rehta hai — \`orders\` ko kabhi badalna nahi padta, kyunki ise us internals ke baare mein pata hi nahi tha shuru se. Boundary yaad rakhne ke liye chhodi gayi ek sujhaav nahi hai; ye is baat se lagu ki jaati hai ki kaunsi file physically import hone ke liye maujood hai: sirf \`users/index.js\` aur \`billing/index.js\` ko hi apne domain se baahar ke code dwara kabhi import kiya jaata hai, aur un folders ke andar kuch bhi aur private implementation detail samjha jaata hai.`,

    content: `## Why routes/controllers/services alone stops being enough as a codebase grows

\`\`\`
This course's earlier file-structure lesson separates HOW a request
flows through one domain (route → controller → service → model).

This lesson separates WHICH domains are allowed to know about
each other's internals at all — a genuinely different question that
matters more as the number of domains, and the number of engineers
working on them, grows.
\`\`\`

The layered routes/controllers/services/models structure this course covered earlier solves a real problem: it organizes the code WITHIN a single domain so any one piece of logic has one predictable home. But it says nothing about the relationship BETWEEN domains — nothing stops an \`orders\` service from importing directly from \`billing\`\'s model layer, or a \`users\` controller from reaching into \`orders\`\' internal service functions. In a small application with one or two domains and one team, this rarely causes visible pain, since everyone touching the code holds the whole system in their head. As the number of domains grows into the dozens, and the number of engineers grows past what can informally coordinate by memory alone, undisciplined cross-domain imports silently accumulate into a dependency graph nobody fully understands, where changing almost anything risks breaking something in an entirely unrelated area.

## Bounded contexts: giving each domain a small, explicit public interface

\`\`\`
src/
  orders/
    index.js       ← the ONLY file other domains may import from
    service.js     ← private, internal implementation
    model.js       ← private, internal implementation
  billing/
    index.js       ← the ONLY file other domains may import from
    service.js     ← private
    stripe.js      ← private
\`\`\`

A "bounded context," borrowed from domain-driven design, is simply a deliberate boundary drawn around one coherent business area — orders, billing, users, inventory — inside which the team working on it is free to organize and change internals however makes sense, as long as the small, explicit public interface it exposes to the rest of the application keeps behaving the same way. This does not require adopting the full weight of formal domain-driven design terminology or process; the practical, load-bearing idea for a Node.js codebase is simply: each domain gets exactly one file (commonly \`index.js\`, or an explicitly named public module) that everything else is allowed to import, and every other file inside that domain\'s folder is treated as a private implementation detail nobody outside the domain should ever import directly.

## Choosing and enforcing a direction of dependency between domains

\`\`\`
Allowed:   orders  →  users   (orders may call users' public interface)
Allowed:   orders  →  billing (orders may call billing's public interface)
NOT allowed: users  →  orders  (a lower-level domain reaching "up" into
             a domain that depends on it creates a circular dependency)
\`\`\`

Beyond simply hiding internals, a large codebase benefits from an explicit, agreed-upon DIRECTION of dependency between domains — deciding, for instance, that \`orders\` may depend on \`users\` and \`billing\`, but \`users\` and \`billing\` may never depend on \`orders\`, since they represent more fundamental concerns that many other domains rely on. Without this agreement, it becomes easy to accidentally introduce a circular dependency — \`orders\` importing from \`users\`, and later, someone adding a seemingly small feature that has \`users\` importing something back from \`orders\` — which makes both domains impossible to understand, test, or deploy independently of each other, since neither can genuinely be reasoned about without the other. Writing this direction down explicitly (even just as a comment or a short document) turns an implicit expectation nobody remembers into a concrete rule that can be checked.

## Enforcing boundaries with lint rules, not just trust

\`\`\`js
// .eslintrc — using eslint-plugin-boundaries or similar
{
  "rules": {
    "boundaries/no-private-imports": "error",   // blocks importing another domain's internals
    "boundaries/element-types": ["error", {
      "default": "disallow",
      "rules": [
        { "from": "orders", "allow": ["users", "billing"] },
        { "from": "users", "allow": [] }
      ]
    }]
  }
}
\`\`\`

A convention that lives only as a verbal agreement or a line in documentation is a convention that WILL eventually be violated, not out of malice but simply because a large team has many people, under deadline pressure, who never read that document or forgot it existed. Lint rules (via plugins like \`eslint-plugin-boundaries\` or a custom rule) turn "please don\'t import another domain\'s internals" into something a pull request\'s CI pipeline actively rejects, the same way this course\'s earlier lessons rely on automated tests and type-checking rather than trusting every developer to manually remember every rule. This is the difference between a boundary that exists in principle and one that actually holds as a codebase and team scale well past what any single person can hold in their head.`,

    contentHi: `## Routes/controllers/services akele kaafi kyun nahi rehte jab codebase badhti hai

\`\`\`
Is course ke pehle wale file-structure lesson ye alag karta hai ki
ek request EK domain ke andar kaise chalti hai (route → controller
→ service → model).

Ye lesson ye alag karta hai ki KAUNSE domains ek doosre ke internals
ke baare mein bilkul jaanne ki ijaazat rakhte hain — ek sach mein
alag sawaal jo zyaada maayne rakhta hai jaise-jaise domains ki
tadaad, aur unpar kaam kar rahe engineers ki tadaad, badhti hai.
\`\`\`

Layered routes/controllers/services/models structure jo is course ne pehle cover kiya ek asli samasya sulajhaata hai: ye ek akele domain KE ANDAR code organize karta hai taaki koi bhi ek logic ka tukda ek anumaanit ghar rakhe. Par ye domains KE BEECH rishte ke baare mein kuch nahi kehta — kuch bhi ek \`orders\` service ko seedhe \`billing\` ke model layer se import karne se nahi rokta, ya ek \`users\` controller ko \`orders\` ke internal service functions mein pahunchne se nahi rokta. Ek chhoti application mein ek ya do domains aur ek team ke saath, ye kam hi dikhta hua dard cause karta hai, kyunki code chhoone waala har koi poore system ko apne dimaag mein rakhta hai. Jaise-jaise domains ki tadaad dazanon tak badhti hai, aur engineers ki tadaad us se aage badhti hai jo akele yaad se informally coordinate kar sake, na-anushaasit cross-domain imports chupke se ek dependency graph mein jama ho jaate hain jise koi bhi poori tarah nahi samajhta, jahan lagbhag kuch bhi badalna kisi poori tarah na-jude ilaake mein kuch todne ka khatra uthaata hai.

## Bounded contexts: har domain ko ek chhota, explicit public interface dena

\`\`\`
src/
  orders/
    index.js       ← ekmatra file jise doosre domains import kar sakte hain
    service.js     ← private, internal implementation
    model.js       ← private, internal implementation
  billing/
    index.js       ← ekmatra file jise doosre domains import kar sakte hain
    service.js     ← private
    stripe.js      ← private
\`\`\`

Ek "bounded context," domain-driven design se udhaar liya gaya, bas ek jaan-boojhkar boundary hai jo ek coherent business area ke aas-paas kheenchi jaati hai — orders, billing, users, inventory — jiske andar us par kaam kar rahi team jaisa bhi samajh mein aaye internals ko organize aur badal sakti hai, jab tak jo chhota, explicit public interface ye baaki application ko expose karta hai wahi tarike se vyavhaar karta rehta hai. Ise poori tarah formal domain-driven design terminology ya process apnaane ki zaroorat nahi hai; ek Node.js codebase ke liye vyavhaarik, bhaar-uthaati dhaarna bas ye hai: har domain ko bilkul ek file milti hai (aam taur par \`index.js\`, ya ek explicitly named public module) jise baaki sab kuch import karne ki ijaazat hai, aur us domain ke folder ke andar har doosri file ek private implementation detail maani jaati hai jise domain ke baahar kisi ko kabhi seedhe import nahi karna chahiye.

## Domains ke beech dependency ki ek disha chunna aur lagu karna

\`\`\`
Ijaazat: orders  →  users   (orders users ke public interface ko call kar sakta hai)
Ijaazat: orders  →  billing (orders billing ke public interface ko call kar sakta hai)
Ijaazat NAHI: users  →  orders  (ek nichle-star ki domain "upar" ek aisi
              domain mein pahunchna jo uspar nirbhar hai ek circular
              dependency banaata hai)
\`\`\`

Sirf internals chhipaane se aage, ek badi codebase domains ke beech ek explicit, sehmat DISHA se fayda uthaati hai — faisla karna, misal ke taur par, ki \`orders\` \`users\` aur \`billing\` par nirbhar ho sakta hai, par \`users\` aur \`billing\` kabhi \`orders\` par nirbhar nahi ho sakte, kyunki wo zyaada buniyaadi chintaon ko darsate hain jinpar kai doosre domains nirbhar hain. Is sehmati ke bina, galti se ek circular dependency introduce karna aasaan ho jaata hai — \`orders\` \`users\` se import karta hai, aur baad mein, koi ek dikhta hua chhota feature jodta hai jismein \`users\` \`orders\` se kuch wapas import karta hai — jo dono domains ko ek doosre se alag samajhna, test karna, ya deploy karna asambhav bana deta hai, kyunki na koi bhi ek doosre bina sach mein samjha jaa sakta hai. Ye disha explicitly likhna (chahe bas ek comment ya ek chhoti document ki tarah) ek implicit umeed jise koi yaad nahi rakhta ko ek concrete rule mein badal deta hai jise check kiya jaa sake.

## Boundaries ko lint rules se lagu karna, sirf bharose se nahi

\`\`\`js
// .eslintrc — eslint-plugin-boundaries ya isi tarah ka istemal karte hue
{
  "rules": {
    "boundaries/no-private-imports": "error",   // doosri domain ke internals import karna block karta hai
    "boundaries/element-types": ["error", {
      "default": "disallow",
      "rules": [
        { "from": "orders", "allow": ["users", "billing"] },
        { "from": "users", "allow": [] }
      ]
    }]
  }
}
\`\`\`

Ek convention jo sirf ek zubaani sehmati ya documentation ki ek line mein rehta hai ek aisa convention hai jo AAKHIRKAAR toda jaayega, badniyati se nahi balki bas isliye kyunki ek badi team mein kai log hain, deadline ke dabaav mein, jinhon ne wo document kabhi padha hi nahi ya bhool gaye ki ye maujood tha. Lint rules (\`eslint-plugin-boundaries\` jaise plugins ya ek custom rule ke zariye) "kripya doosre domain ke internals import mat karo" ko kuch aisa banaate hain jise ek pull request ki CI pipeline saqriya taur par reject karti hai, bilkul waise jaise is course ke pehle wale lessons automated tests aur type-checking par nirbhar hain har developer par bharosa karne ke bajaye ki wo har rule haath se yaad rakhega. Ye antar hai ek boundary ke jo siddhaant mein maujood hai aur ek jo asal mein tikti hai jaise-jaise codebase aur team us se kaafi aage badhte hain jo koi bhi ek akela vyakti apne dimaag mein rakh sake.`,

    examples: [
      {
        title: 'Broken: orders reaches directly into billing and users internals',
        titleHi: 'Toota: orders seedhe billing aur users ke internals mein pahunchta hai',
        code: `const { userDb } = require("../users/db");
const { chargeCard } = require("../billing/stripe");
// orders now silently depends on both domains' exact internal shape`,
        codeJs: `const { userDb } = require("../users/db");
const { chargeCard } = require("../billing/stripe");

async function createOrder(userId, items) {
  const user = await userDb.query("SELECT * FROM users WHERE id = $1", [userId]);
  const charge = await chargeCard(user.rows[0].stripeCustomerId, total(items));
  return { orderId: 123, charge };
}`,
        codeTs: `import { userDb } from "../users/db";
import { chargeCard } from "../billing/stripe";

async function createOrder(userId: string, items: Item[]): Promise<Order> {
  const user = await userDb.query("SELECT * FROM users WHERE id = $1", [userId]);
  const charge = await chargeCard(user.rows[0].stripeCustomerId, total(items));
  return { orderId: 123, charge };
}
// Correctly typed, completely valid TypeScript — the risk is
// organizational coupling, not a type error.`,
        output: `Works today. The day users' database schema changes, or billing
switches its Stripe integration approach, this file breaks — even
though nobody touched a single line inside orders/ itself.`,
        explain: 'Reaching into another domain\'s db.js or stripe.js directly means orders now silently depends on internals that were never meant to be a stable, public contract.',
        explainHi: 'Ek doosri domain ke \`db.js\` ya \`stripe.js\` mein seedhe pahunchna matlab hai orders ab chupke se un internals par nirbhar hai jo kabhi ek sthir, public contract hone ke liye nahi the.',
      },
      {
        title: 'Fixed: each domain exposes one small public interface',
        titleHi: 'Theek: har domain ek chhota public interface expose karta hai',
        code: `// users/index.js and billing/index.js are the ONLY files
// other domains are allowed to import from
const users = require("../users");
const billing = require("../billing");`,
        codeJs: `// src/users/index.js
async function getUserForBilling(userId) {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}
module.exports = { getUserForBilling };

// src/orders/service.js
const users = require("../users");
const billing = require("../billing");

async function createOrder(userId, items) {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}`,
        codeTs: `// src/users/index.ts
export async function getUserForBilling(userId: string): Promise<{ userId: string; stripeCustomerId: string }> {
  const user = await userDb.query("SELECT id, stripe_customer_id FROM users WHERE id = $1", [userId]);
  return { userId: user.rows[0].id, stripeCustomerId: user.rows[0].stripe_customer_id };
}

// src/orders/service.ts
import * as users from "../users";
import * as billing from "../billing";

export async function createOrder(userId: string, items: Item[]): Promise<Order> {
  const user = await users.getUserForBilling(userId);
  const charge = await billing.chargeCustomer(user.stripeCustomerId, total(items));
  return { orderId: 123, charge };
}`,
        outputJs: `users can now change its database schema freely, as long as
getUserForBilling keeps returning { userId, stripeCustomerId } —
orders never has to change.`,
        outputTs: `// Identical behaviour. TypeScript's exported function signature
// (Promise<{ userId: string; stripeCustomerId: string }>) documents
// the stable contract explicitly.`,
        explain: 'orders now depends only on a small, deliberate public function — the two domains can each change their own internals freely without breaking the other.',
        explainHi: 'orders ab sirf ek chhote, jaan-boojhkar public function par nirbhar hai — dono domains apne-apne internals doosre ko toda bina azaadi se badal sakte hain.',
      },
      {
        title: 'Enforcing the boundary with an ESLint rule, not just a convention',
        titleHi: 'Boundary ko ek ESLint rule se lagu karna, sirf ek convention se nahi',
        code: `// .eslintrc
"rules": {
  "no-restricted-imports": ["error", {
    "patterns": ["**/users/db", "**/billing/stripe"]
  }]
}`,
        codeJs: `// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["**/users/db", "**/users/service"], "message": "Import from users/index.js instead" },
        { "group": ["**/billing/stripe", "**/billing/service"], "message": "Import from billing/index.js instead" }
      ]
    }]
  }
}`,
        codeTs: `// .eslintrc.json — identical rule, works the same for a TypeScript
// codebase since it operates on import paths, not on JS vs TS syntax
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["**/users/db", "**/users/service"], "message": "Import from users/index instead" },
        { "group": ["**/billing/stripe", "**/billing/service"], "message": "Import from billing/index instead" }
      ]
    }]
  }
}`,
        outputJs: `A pull request that imports users/db.js directly now fails CI's
lint step immediately, with a clear message pointing to the correct
public interface to use instead.`,
        outputTs: `// Identical behaviour, catching the same violation before it ever
// reaches code review, regardless of whether the violating import
// was written in JavaScript or TypeScript.`,
        explain: 'A rule enforced by CI does not rely on every developer remembering or reading a document — the boundary holds even under deadline pressure, with a large team, months after the original convention was agreed.',
        explainHi: 'CI dwara lagu ki gayi ek rule har developer ke kisi document yaad rakhne ya padhne par nirbhar nahi hoti — boundary deadline ke dabaav mein bhi tikti hai, ek badi team ke saath, asli convention sehmat hone ke mahinon baad.',
      },
    ],

    mistakes: [
      {
        wrong: `const { userDb } = require("../users/db"); // reaching into another domain's private internals`,
        right: `const users = require("../users"); // importing only the domain's small, public index.js`,
        why: 'Importing another domain\'s internal files directly creates a hidden dependency on implementation details that were never meant to be a stable contract, breaking silently when those internals change.',
        whyHi: 'Ek doosri domain ki internal files seedhe import karna implementation details par ek chupi dependency banaata hai jo kabhi ek sthir contract hone ke liye nahi the, chupke se toot jaate hue jab wo internals badalte hain.',
      },
      {
        wrong: `// users/service.js
const { createOrder } = require("../orders/service"); // a "lower" domain importing a "higher" one — circular risk`,
        right: `// Keep the agreed direction: orders may depend on users, never the reverse.
// If users genuinely needs order data, expose it through an event or a
// dedicated read model instead of a direct import.`,
        why: 'A dependency in the wrong direction risks a circular dependency between domains, making both impossible to reason about, test, or deploy independently of each other.',
        whyHi: 'Galat disha mein ek dependency domains ke beech ek circular dependency ka khatra uthaati hai, dono ko ek doosre se alag samajhna, test karna, ya deploy karna asambhav banaate hue.',
      },
      {
        wrong: `// A boundary convention only written in a wiki page nobody reads
// "Please don't import billing's internals directly" — trusted to memory`,
        right: `// .eslintrc enforces it in CI — a pull request violating it fails
// the build automatically, regardless of whether anyone remembered the wiki page`,
        why: 'A boundary that exists only as an unenforced convention will eventually be violated under deadline pressure by someone who never read or forgot about it — enforcement in CI is what makes it actually hold.',
        whyHi: 'Ek boundary jo sirf ek na-lagu convention ki tarah maujood hai aakhirkaar deadline ke dabaav mein kisi aise dwara toda jaayega jisne ise kabhi padha nahi ya bhool gaya — CI mein enforcement hi ise asal mein tikaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Domain-driven design\'s concept of "bounded contexts" is a widely referenced, standard vocabulary for reasoning about module boundaries in large systems**, used across many languages and frameworks well beyond Node.js specifically.',
        hi: '**Domain-driven design ka "bounded contexts" concept badi systems mein module boundaries ke baare mein soche-samjhe tarike se reasoning karne ke liye ek vyaapak roop se reference ki jaane waali, standard vocabulary hai**, Node.js se aage kai languages aur frameworks mein istemal hoti hai.',
      },
      {
        en: '**Lint plugins that enforce module-boundary rules directly in CI (such as eslint-plugin-boundaries or similar dependency-cruiser tooling) are a commonly adopted practice at companies with large, multi-team Node.js codebases**, specifically to catch boundary violations before they ever reach code review.',
        hi: '**Lint plugins jo module-boundary rules ko seedhe CI mein lagu karte hain (jaise \`eslint-plugin-boundaries\` ya isi tarah ki dependency-cruiser tooling) badi, multi-team Node.js codebases wali companies mein ek aam taur par apnaayi jaane waali practice hai**, khaas taur par boundary violations ko code review tak pahunchne se pehle pakadne ke liye.',
      },
      {
        en: '**A tangled, undisciplined dependency graph between modules — often called a "big ball of mud" — is one of the most commonly cited architectural failure patterns in large, long-lived production codebases**, precisely the failure mode module boundaries are designed to prevent.',
        hi: '**Modules ke beech ek uljha hua, na-anushaasit dependency graph — aksar "big ball of mud" kahlaata hai — badi, lambe samay se chal rahi production codebases mein sabse aam taur par cite kiya jaane waala architectural failure pattern hai**, bilkul wahi fail-hone ka tarika jise module boundaries rokne ke liye design ki jaati hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the routes/controllers/services/models structure this course covered earlier not, by itself, prevent a large codebase from becoming an unmaintainable tangle?',
        qHi: 'Is course ne pehle cover kiya routes/controllers/services/models structure khud se ek badi codebase ko ek unmaintainable tangle banne se kyun nahi rokta?',
        a: 'The layered routes/controllers/services/models structure governs the organization WITHIN a single domain — it establishes that, for any one business area, an HTTP route delegates to a controller, which delegates to a service holding the actual business logic, which delegates to a model for data access. This makes it predictable where a given piece of logic lives inside that one domain\'s folder. What this structure says nothing about, however, is the relationship BETWEEN separate domains — nothing about having orders, billing, and users each internally organized into routes/controllers/services/models prevents an engineer from having the orders domain\'s service file directly import billing\'s internal Stripe client, or users\' internal database module, reaching straight past the layered structure of those other domains entirely. In a small application maintained by one or two engineers who hold the entire system in their heads, this gap rarely causes visible harm, since informal memory can substitute for an explicit rule. As the number of distinct business domains grows into the dozens, and the number of engineers grows past what can coordinate purely through shared memory and verbal agreement, these undisciplined cross-domain imports accumulate silently into a dependency graph nobody has full visibility into, where a change made for a good reason in one domain can unexpectedly break behavior in an entirely unrelated one, discovered only once it actually breaks in production or in a hard-to-trace test failure. Preventing this requires a second, orthogonal discipline layered on top of the routes/controllers/services structure: deciding which domains are allowed to depend on which others, and enforcing that only a small, deliberate public interface is ever exposed across that boundary.',
        aHi: 'Layered routes/controllers/services/models structure ek akele domain KE ANDAR organization ko niyantrit karta hai — ye sthaapit karta hai ki, kisi bhi ek business area ke liye, ek HTTP route ek controller ko delegate karta hai, jo ek service ko delegate karta hai jismein asli business logic hoti hai, jo data access ke liye ek model ko delegate karta hai. Ye anumaanit banaata hai ki koi diya logic ka tukda us ek domain ke folder ke andar kahaan rehta hai. Par ye structure alag domains KE BEECH rishte ke baare mein kuch nahi kehta — orders, billing, aur users ka har ek internally routes/controllers/services/models mein organize hona kisi engineer ko orders domain ki service file se seedhe billing ke internal Stripe client, ya users ke internal database module ko import karne se nahi rokta, seedhe un doosre domains ki layered structure ko poori tarah paar karte hue. Ek chhoti application mein jo ek ya do engineers dwara maintain ki jaati hai jo poore system ko apne dimaag mein rakhte hain, ye gap kam hi dikhta hua nuksaan cause karta hai, kyunki informal yaad ek explicit rule ki jagah le sakti hai. Jaise-jaise alag business domains ki tadaad dazanon tak badhti hai, aur engineers ki tadaad us se aage badhti hai jo shuddh shared yaad aur zubaani sehmati se coordinate kar sake, ye na-anushaasit cross-domain imports chupke se ek dependency graph mein jama ho jaate hain jispar kisi ki poori visibility nahi hoti, jahan ek achhi wajah se ek domain mein kiya gaya badlaav apratyaashit roop se ek poori tarah na-jude domain mein vyavhaar tod sakta hai, sirf ek baar pata chalta hai jab ye asal mein production mein ya ek mushkil-track-karne-laayak test failure mein tootta hai. Ise rokne ke liye routes/controllers/services structure ke oopar ek doosri, orthogonal anushaasan chahiye: faisla karna ki kaunse domains kaunse doosron par nirbhar ho sakte hain, aur lagu karna ki us boundary ke aar-paar sirf ek chhota, jaan-boojhkar public interface hi kabhi expose hota hai.',
      },
      {
        q: 'Why is choosing and enforcing a specific direction of dependency between domains important, and what goes wrong without it?',
        qHi: 'Domains ke beech dependency ki ek khaas disha chunna aur lagu karna zaruri kyun hai, aur iske bina kya galat hota hai?',
        a: 'Simply hiding each domain\'s internals behind a small public interface prevents one specific problem — accidentally depending on unstable implementation details — but it does not by itself prevent a second, equally serious problem: two domains ending up depending on EACH OTHER, directly or through a chain of intermediate domains, forming a circular dependency. If, for instance, orders imports from users\' public interface to look up who placed an order, and separately, someone later adds a feature where users imports from orders\' public interface to show a customer their order history directly within the users domain, these two domains now depend on each other in both directions. This matters practically because it becomes impossible to reason about, test, or deploy either domain in true isolation from the other — understanding what users does now requires also understanding what orders does, and vice versa, since a change to either one\'s behavior can ripple into the other and back again in ways that are difficult to trace. It can also create outright technical problems, such as circular imports in a module system causing one of the two modules to receive a partially initialized, incomplete version of the other during startup. Deciding explicitly, in advance, which domains are allowed to depend on which others — for instance, agreeing that orders may depend on users and billing, since it represents a higher-level business process built on top of more foundational concerns, while users and billing may never depend on orders — establishes an unambiguous direction that, once written down and ideally enforced through lint tooling, prevents this kind of circular entanglement from ever being introduced in the first place, rather than needing to be untangled after the fact once it has already caused confusion or a production incident.',
        aHi: 'Har domain ke internals ko ek chhote public interface ke peeche chhipaana ek khaas samasya rokta hai — galti se ashaant implementation details par nirbhar hona — par ye khud se ek doosri, utni hi gambhir samasya nahi rokta: do domains ka aakhirkaar EK DOOSRE par nirbhar ho jaana, seedhe ya beech ke domains ki ek chain ke through, ek circular dependency banaate hue. Agar, misal ke taur par, orders users ke public interface se import karta hai ye dekhne ke liye ki order kisne lagaaya, aur alag se, koi baad mein ek feature jodta hai jahan users orders ke public interface se import karta hai ek customer ko unki order history seedhe users domain ke andar dikhaane ke liye, ye do domains ab dono dishaon mein ek doosre par nirbhar hain. Ye vyavhaarik taur par maayne rakhta hai kyunki ye asambhav ho jaata hai kisi ek domain ko doosre se sach mein alag samajhna, test karna, ya deploy karna — ye samajhna ki \`users\` ab kya karta hai \`orders\` kya karta hai ye bhi samajhna maang leta hai, aur ulta bhi, kyunki ek ke vyavhaar mein badlaav doosre mein aur wapas un tareekon se failna sakta hai jo track karna mushkil hai. Ye asli technical samasyaayein bhi paida kar sakta hai, jaise ek module system mein circular imports jo startup ke dauraan do modules mein se ek ko doosre ka ek aadha-initialize, adhoora version paane ka kaaran banate hain. Explicitly, pehle se, faisla karna ki kaunse domains kaunse doosron par nirbhar ho sakte hain — misal ke taur par, sehmat hona ki orders users aur billing par nirbhar ho sakta hai, kyunki ye ek zyaada-buniyaadi chintaon ke oopar bana ek oonchi-star ka business process darsata hai, jabki users aur billing kabhi orders par nirbhar nahi ho sakte — ek asandigdh disha sthaapit karta hai jo, ek baar likh di jaaye aur aadarsh roop se lint tooling ke zariye lagu ki jaaye, is tarah ki circular uljhan ko shuru se hi introduce hone se rokta hai, baad mein ise suljhaane ki zaroorat ke bajaye ek baar ye pehle se hi confusion ya production incident cause kar chuka ho.',
      },
      {
        q: 'Why is a lint rule a more reliable way to enforce module boundaries than documenting the convention and trusting the team to follow it?',
        qHi: 'Module boundaries lagu karne ka ek lint rule convention ko document karke aur team par palan karne ka bharosa karne se zyaada bharosemand tarika kyun hai?',
        a: 'A boundary rule that exists only as documentation — a wiki page, a comment in a README, a verbal agreement made in a meeting — depends entirely on every single engineer who might ever touch the codebase having read that documentation, correctly remembered it at the exact moment they are writing new code, and chosen to follow it even under the pressure of an approaching deadline. In any team beyond a very small one, and across any codebase that persists for more than a few months, this chain of assumptions reliably breaks somewhere: a new engineer joins without ever having been shown the relevant document, an existing engineer forgets a rule they read once many months ago, or someone under time pressure decides a quick, direct import is faster than finding and using the proper public interface just this once. Each individual violation might seem harmless in isolation, but they accumulate over time into exactly the tangled, undisciplined dependency graph this lesson\'s broken example demonstrates, since nothing about the tooling itself ever stopped a violation from being written and merged. A lint rule enforced in the project\'s CI pipeline changes this entirely: it does not rely on any individual remembering anything, because a pull request that violates the boundary is mechanically rejected by the build itself, with a clear error message, before a human reviewer even needs to notice the problem manually. This converts the boundary from an aspiration that individual engineers are trusted to uphold into an actual, structural property of the codebase that holds reliably regardless of team size, deadline pressure, or how long ago the original convention was agreed upon and by whom.',
        aHi: 'Ek boundary rule jo sirf documentation ki tarah maujood hai — ek wiki page, ek README mein comment, ek meeting mein kiya gaya zubaani samjhauta — poori tarah is baat par nirbhar hai ki har akela engineer jo kabhi codebase ko chhu sakta hai us documentation ko padh chuka ho, use bilkul us pal sahi tarike se yaad rakhe jab wo naya code likh raha ho, aur ek aati deadline ke dabaav mein bhi ise palan karna chune. Ek bahut chhoti se aage kisi bhi team mein, aur kai mahinon se zyaada tikti kisi bhi codebase mein, ye maanyata ki chain kahin na kahin bharosemand taur par tootti hai: ek naya engineer bina kabhi wo document dikhaaye jud jaata hai, ek maujooda engineer ek rule bhool jaata hai jo unhone kai mahine pehle ek baar padhi thi, ya koi samay ke dabaav mein faisla karta hai ki ek tez, seedha import sirf is ek baar sahi public interface dhoondhne aur istemal karne se tez hai. Har akela ullanghan akele mein hanikaarak-na-lagu-hone-laayak lag sakta hai, par wo waqt ke saath jama hokar bilkul wahi uljha, na-anushaasit dependency graph banaate hain jo is lesson ka toota example dikhaata hai, kyunki tooling khud kuch bhi kabhi ek ullanghan ko likhe aur merge hone se nahi rokta. CI pipeline mein lagu kiya gaya ek lint rule ise poori tarah badalta hai: ye kisi bhi akele ke kuch yaad rakhne par nirbhar nahi hai, kyunki ek pull request jo boundary todta hai build khud dwara mechanically reject kiya jaata hai, ek saaf error message ke saath, ek insaan reviewer ko samasya manually notice karne ki zaroorat se pehle. Ye boundary ko ek aakaanksha se jise akele engineers par bharosa kiya jaata hai palan karne ke liye codebase ki ek asli, structural property mein badal deta hai jo team size, deadline dabaav, ya asli convention kab aur kisse sehmat hui us se bekhabar bharosemand taur par tikti hai.',
      },
    ],

    exercises: [
      {
        task: 'Take an existing small application with two or three domains (or design one on paper: orders, users, billing). Identify every place one domain currently imports directly from another domain\'s internal files rather than a small public interface.',
        taskHi: 'Ek maujooda chhoti application lo do ya teen domains ke saath (ya kaagaz par ek design karo: orders, users, billing). Har wo jagah pehchaano jahan ek domain abhi doosre domain ki internal files se seedhe import karta hai ek chhote public interface ke bajaye.',
        hint: 'Grep for require() or import statements that reach more than one folder deep into another domain (e.g. ../billing/stripe rather than ../billing) as a quick way to find likely violations.',
        hintHi: '\`require()\` ya \`import\` statements ke liye grep karo jo doosri domain mein ek folder se zyaada gehraai mein pahunchte hain (jaise \`../billing/stripe\` \`../billing\` ke bajaye) sambhaavit ullanghan jaldi dhoondhne ke ek tarike ki tarah.',
      },
      {
        task: 'For each domain, create a single index.js (or index.ts) exposing only the small set of functions other domains genuinely need, and update every cross-domain import found in the previous exercise to go through it instead.',
        taskHi: 'Har domain ke liye, ek akela \`index.js\` (ya \`index.ts\`) banaao jo sirf un functions ka chhota set expose karta hai jo doosre domains ko sach mein chahiye, aur pichhle exercise mein mila har cross-domain import ise iske through jaane ke liye update karo.',
        hint: 'If a domain\'s public interface ends up needing many functions to satisfy every caller, that can be a signal the domain boundary itself is drawn in the wrong place.',
        hintHi: 'Agar ek domain ke public interface ko har caller ko santusht karne ke liye kai functions ki zaroorat padti hai, ye ek sanket ho sakta hai ki domain boundary khud galat jagah kheenchi gayi hai.',
      },
      {
        task: 'Add a lint rule (no-restricted-imports, or eslint-plugin-boundaries if available) that fails the build if any file imports another domain\'s internals directly. Confirm it correctly fails on a deliberately reintroduced direct import.',
        taskHi: 'Ek lint rule jodo (\`no-restricted-imports\`, ya \`eslint-plugin-boundaries\` agar upalabdh ho) jo build ko fail kare agar koi file doosri domain ke internals seedhe import karti hai. Confirm karo ki ye ek jaan-boojhkar dobara jode gaye seedhe import par sahi tarike se fail hota hai.',
        hint: 'Temporarily revert one file back to a direct internal import to verify the lint rule actually catches it, then restore the fix.',
        hintHi: 'Ek file ko asthaayi taur par ek seedhe internal import par wapas le jaao ye verify karne ke liye ki lint rule ise asal mein pakadta hai, phir fix wapas laao.',
      },
    ],

    keyTakeaways: [
      'Routes/controllers/services organizes code WITHIN one domain; module boundaries govern what different domains are allowed to know about each other — a genuinely separate concern that matters more as a codebase and team grow.',
      'Each domain should expose exactly one small, deliberate public interface (commonly an index.js/index.ts), treating every other file inside its folder as private implementation detail.',
      'Choosing and writing down an explicit direction of dependency between domains prevents circular dependencies, where two domains end up depending on each other and can no longer be reasoned about, tested, or deployed independently.',
      'A boundary documented only in a wiki page or verbal agreement will eventually be violated under deadline pressure or by someone who never saw it — this is a reliability gap, not a hypothetical one.',
      'Lint rules (such as no-restricted-imports or eslint-plugin-boundaries) enforce boundaries mechanically in CI, rejecting a violating pull request automatically rather than relying on a human reviewer to catch it.',
      'This is not about adopting the full formal weight of domain-driven design — the practical, load-bearing idea is simply: small public interfaces, private internals, and an agreed, enforced direction of dependency.',
    ],
    keyTakeawaysHi: [
      'Routes/controllers/services EK domain KE ANDAR code organize karta hai; module boundaries niyantrit karte hain ki alag domains ek doosre ke baare mein kya jaanne ki ijaazat rakhte hain — ek sach mein alag chinta jo codebase aur team badhne par zyaada maayne rakhti hai.',
      'Har domain ko bilkul ek chhota, jaan-boojhkar public interface expose karna chahiye (aam taur par ek \`index.js\`/\`index.ts\`), apne folder ke andar har doosri file ko private implementation detail maante hue.',
      'Domains ke beech dependency ki ek explicit disha chunna aur likhna circular dependencies rokta hai, jahan do domains aakhirkaar ek doosre par nirbhar ho jaate hain aur ab akele-akele samjhe, test kiye, ya deploy nahi kiye jaa sakte.',
      'Ek boundary jo sirf ek wiki page ya zubaani samjhauta mein documented hai aakhirkaar deadline ke dabaav mein ya kisi aise dwara toda jaayega jisne ise kabhi dekha hi nahi — ye ek bharosemandi ka gap hai, ek kalpaniya nahi.',
      'Lint rules (jaise \`no-restricted-imports\` ya \`eslint-plugin-boundaries\`) boundaries ko CI mein mechanically lagu karte hain, ek ullanghan karti pull request ko automatically reject karte hue ek insaan reviewer par pakadne ke liye nirbhar hone ke bajaye.',
      'Ye domain-driven design ka poora formal bhaar apnaane ke baare mein nahi hai — vyavhaarik, bhaar-uthaati dhaarna bas ye hai: chhote public interfaces, private internals, aur dependency ki ek sehmat, lagu ki gayi disha.',
    ],
  },
];
