/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 2.
 *
 * JWT (JSON Web Token) authentication: why trusting a client-supplied user
 * ID directly is equivalent to no authentication at all, and how a signed
 * token lets a stateless server verify a request's identity without
 * re-checking the database or holding session state in memory. Broken
 * example: a route that trusts req.headers["x-user-id"] directly — any
 * client can claim to be any user by simply changing a header. Fixed with
 * jwt.sign() at login and a jwt.verify() auth middleware on protected
 * routes. Also covers JWTs being signed-but-readable (never put secrets in
 * the payload), expiration, and where JWT_SECRET lives.
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

export const NODE_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'jwt-authentication',
    title: 'JWT Authentication: Proving Identity Without Trusting the Client',
    titleHi: 'JWT Authentication: Client Par Bharosa Kiye Bina Pehchaan Saabit Karna',
    description: 'A "delete my account" route that trusts whatever user ID the request claims to be — so anyone can delete anyone else\'s account just by changing one header.',
    descriptionHi: 'Ek "delete my account" route jo bhi request jis user ID hone ka daava kare us par bharosa karta hai — isliye koi bhi kisi aur ka account delete kar sakta hai bas ek header badalkar.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**An office building where an employee simply announces their own name to enter a secure area, versus one where every employee wears an ID badge issued and digitally signed by building security itself.** Trusting a client-supplied user identifier directly is like a security desk that lets anyone walk up and enter the building\'s secure records room simply by saying "I\'m Priya from Accounting" — the desk has absolutely no way to verify that claim, so anyone who happens to know a real employee\'s name can simply say it and walk straight in. This obviously does not provide any real security at all; it is, at best, a formality that only stops someone who has not bothered to learn anyone\'s name. A building that does this correctly instead issues every employee an ID badge at the front desk, once, after checking real identification — and that badge is embossed with an official building seal that is extremely difficult to forge convincingly. From that point on, a guard at any secure door does not need to know Priya personally, or re-verify her identity from scratch, or call Accounting to check — the guard simply examines the badge for the official seal; if the seal is genuine, whoever is holding that specific badge is trusted to be exactly who the badge claims, because forging a convincing seal is impractically difficult, while checking for one is fast and requires no ongoing relationship with the person being checked.',
      hi: '**Ek office building jahan ek employee bas apna khud ka naam bol kar ek secure area mein ghus jaata hai, versus ek jahan har employee ek ID badge pehnta hai jo building security dwara khud issue aur digitally sign kiya gaya ho.** Client-diya user identifier ko seedha bharosa karna ek aise security desk jaisa hai jo kisi ko bhi building ke secure records room mein ghusne deta hai sirf ye kehkar "main Priya hoon Accounting se" — desk ke paas us daave ko verify karne ka bilkul koi tarika nahi hai, isliye koi bhi jo ek asli employee ka naam jaanta hai bas use bol kar seedha andar chala jaata hai. Ye saaf-saaf koi asli security bilkul nahi deta; ye, sabse achha, ek formality hai jo sirf usi ko rokti hai jisne kisi ka naam seekhne ki taklif hi nahi ki. Ek building jo ise sahi tarike se karta hai iske bajaye har employee ko front desk par ek baar, asli identification check karne ke baad, ek ID badge deta hai — aur wo badge ek official building seal se embossed hota hai jise convincingly forge karna bahut mushkil hai. Us pal se, kisi bhi secure door par ek guard ko Priya ko personally jaanne ki zarurat nahi, ya uski pehchaan shuru se dobara verify karne ki, ya check karne ke liye Accounting ko call karne ki — guard bas badge ko official seal ke liye jaanchta hai; agar seal asli hai, jo bhi wo khaas badge pakde hue hai use bharosa kiya jaata hai ki wo bilkul wahi hai jo badge daava karta hai, kyunki ek convincing seal forge karna mushkil hai, jabki ek check karna tez hai aur us insaan ke saath koi chalti judaai nahi chahiye jise check kiya jaa raha hai.',
    },

    simple: `**Start broken.** A "delete account" route that trusts a client-supplied user ID with no verification at all:

\`\`\`js
app.delete("/account", async (req, res, next) => {
  const userId = req.headers["x-user-id"];

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

The route works correctly when a legitimate client sends its own genuine user ID in the \`x-user-id\` header — the right account gets deleted, exactly as intended. The catastrophic flaw is that the server has absolutely no way to verify that the ID in this header actually belongs to whoever is making the request; the header is nothing more than a plain, unsigned, trivially editable piece of text the CLIENT chooses to send, and nothing prevents an attacker from sending any other user\'s ID instead of their own. Using a browser\'s developer tools, a command-line tool like \`curl\`, or any HTTP client at all, anyone can send \`x-user-id: 4topping-victim-account-id\` and delete an account that is not theirs, with no login, no password, no proof of identity whatsoever required — the route is not merely weakly protected, it provides no actual authentication at all, since it simply believes whatever the request claims about itself.

**The fix: a signed JWT issued at login, verified on every protected route**

\`\`\`js
const jwt = require("jsonwebtoken");

// At login, after verifying the password with bcrypt.compare() (previous lesson):
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
res.json({ token });
\`\`\`

\`\`\`ts
import jwt from "jsonwebtoken";

const token: string = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);
res.json({ token });
\`\`\`

A JWT (JSON Web Token) is a compact string, made of three parts separated by dots, that encodes a payload (here, \`{ userId: user.id }\`) along with a cryptographic SIGNATURE computed from that payload and a secret key the server alone knows (\`process.env.JWT_SECRET\`, following the pattern from the earlier \`process.env\` lesson). The critical property this provides: anyone can freely READ a JWT\'s payload (it is only base64-encoded, not encrypted — covered in more depth below), but no one who does not know the server\'s secret key can produce a VALID signature for a modified payload — attempting to change the \`userId\` inside the token invalidates the signature, because the signature is mathematically tied to the exact, unmodified payload it was created from. This is the digital equivalent of the building badge\'s official seal: the token is issued once, at login, after the server has already verified the user\'s identity properly (via the bcrypt-checked password), and from that point on, any route can trust the \`userId\` inside a token as genuinely belonging to whoever the server originally issued it to — PROVIDED the signature checks out.

**Verifying the token: an auth middleware that runs before the protected route**

\`\`\`js
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.delete("/account", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`jwt.verify()\` recomputes the signature from the token\'s payload using the server\'s own secret key and checks whether it matches the signature embedded in the token — if the token was never issued by this server (forged), or was issued but its payload was tampered with afterward, or has simply expired past its \`expiresIn\` window, verification fails and \`err\` is set, at which point the middleware correctly rejects the request before the route handler ever runs. Only once verification succeeds does the middleware attach the now-trusted \`userId\` onto \`req\` and call \`next()\` — the crucial architectural shift from the broken version is that \`req.userId\` inside the actual route handler is no longer something the CLIENT gets to freely claim; it is something the SERVER has cryptographically confirmed, extracted from a token only the server itself could have originally issued.`,

    simpleHi: `**Toote hue se shuru.** Ek "delete account" route jo ek client-diye user ID par bilkul koi verification ke bina bharosa karta hai:

\`\`\`js
app.delete("/account", async (req, res, next) => {
  const userId = req.headers["x-user-id"];

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Route theek kaam karta hai jab ek legitimate client apna khud ka asli user ID \`x-user-id\` header mein bhejta hai — sahi account delete hota hai, bilkul jaisa iraada tha. Vinaashak kami ye hai ki server ke paas bilkul koi tarika nahi hai ye verify karne ka ki is header mein ID asal mein us se hai jo request bana raha hai; header bas ek saadha, unsigned, aasaani se badla ja sakne wala text hai jise CLIENT bhejne ka faisla karta hai, aur kuch bhi ek attacker ko apne bajaye kisi doosre user ki ID bhejne se nahi rokta. Browser ke developer tools, ek command-line tool jaisa \`curl\`, ya koi bhi HTTP client istemal karke, koi bhi \`x-user-id: kisi-victim-account-id\` bhej sakta hai aur ek aisa account delete kar sakta hai jo unka nahi hai, koi login nahi, koi password nahi, pehchaan ka koi saboot bilkul chahiye nahi — route sirf kamzor-taur-par-surakshit nahi hai, ye koi asli authentication deta hi nahi, kyunki ye bas jo bhi request apne baare mein daava karti hai use maan leta hai.

**Fix: login par issue hua ek signed JWT, har surakshit route par verify hua**

\`\`\`js
const jwt = require("jsonwebtoken");

// Login par, password ko bcrypt.compare() se verify karne ke baad (pichhla lesson):
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
res.json({ token });
\`\`\`

\`\`\`ts
import jwt from "jsonwebtoken";

const token: string = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);
res.json({ token });
\`\`\`

Ek JWT (JSON Web Token) ek chhota string hai, teen hisson ka bana hua dots se alag, jo ek payload (yahan, \`{ userId: user.id }\`) ko us payload aur ek secret key se calculate ki gayi ek cryptographic SIGNATURE ke saath encode karta hai jo sirf server jaanta hai (\`process.env.JWT_SECRET\`, pehle wale \`process.env\` lesson ke pattern ka palan karte hue). Zaruri property jo ye deta hai: koi bhi ek JWT ka payload khule aam PADH sakta hai (ye sirf base64-encoded hai, encrypted nahi — neeche zyaada gehraayi se cover hua), par koi bhi jo server ki secret key nahi jaanta ek badle hue payload ke liye ek VALID signature paida nahi kar sakta — token ke andar \`userId\` badalne ki koshish signature ko invalid kar deti hai, kyunki signature mathematically us bilkul, na-badle payload se juda hota hai jis se ye banaaya gaya tha. Ye building badge ke official seal ka digital barabar hai: token ek baar issue hota hai, login par, us baad jab server pehle se user ki pehchaan sahi tarike se verify kar chuka hota hai (bcrypt-checked password ke through), aur us pal se, koi bhi route token ke andar \`userId\` ko sach mein us se belong karta bharosa kar sakta hai jise server ne asal mein issue kiya tha — AGAR signature theek nikle.

**Token verify karna: ek auth middleware jo surakshit route se pehle chalta hai**

\`\`\`js
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.delete("/account", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`jwt.verify()\` token ke payload se signature ko server ki apni secret key ka istemal karte hue dobara calculate karta hai aur check karta hai ki kya ye token mein embed signature se milti hai — agar token kabhi is server dwara issue hi nahi hua tha (forged), ya issue hua tha par uska payload baad mein tamper kiya gaya, ya bas apni \`expiresIn\` window ke baad expire ho gaya, verification fail hota hai aur \`err\` set hota hai, us pal middleware sahi tarike se request ko reject kar deta hai us se pehle ki route handler kabhi chale. Sirf verification safal hone par hi middleware ab-bharosemand \`userId\` ko \`req\` par attach karta hai aur \`next()\` bulaata hai — toote version se zaruri architectural badlaav ye hai ki asli route handler ke andar \`req.userId\` ab wo cheez nahi hai jise CLIENT khule aam daava kar sake; ye wo cheez hai jise SERVER ne cryptographically confirm kiya hai, ek aise token se nikaala jo sirf server khud asal mein issue kar sakta tha.`,

    content: `## JWTs are signed, not encrypted — never put secrets inside the payload

\`\`\`js
// A JWT's payload is base64-encoded, NOT encrypted — anyone can decode and read it
const token = jwt.sign({ userId: 42, creditCardNumber: "4111111111111111" }, secret);
// atob(token.split(".")[1]) instantly reveals { userId: 42, creditCardNumber: "..." }
// to ANYONE who has the token, with no secret key needed at all
\`\`\`

A genuinely common and dangerous misunderstanding is treating a JWT\'s payload as if it were confidential simply because the token as a whole is "signed" — signing and encrypting are different operations with different purposes. The signature proves the payload has not been TAMPERED WITH since the server created it (integrity), but it does nothing to hide the payload\'s CONTENTS (confidentiality) — the payload is only base64-encoded, a reversible encoding, not an encryption, and anyone holding the token (including the client the token was issued to, and anyone the client shares it with, intentionally or via a leak) can trivially decode and read every field inside it without knowing the server\'s secret at all. The rule this leads to: a JWT payload should only ever contain information that is safe for the token\'s holder, and anyone who might intercept it, to read directly — an ID, a role, an expiration time — never a password, a credit card number, or any other genuinely sensitive value.

## Expiration and refresh: why a token should not live forever

\`\`\`js
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
\`\`\`

The \`expiresIn\` option embeds an expiration timestamp directly into the token\'s payload, and \`jwt.verify()\` automatically checks this timestamp and rejects an expired token even if its signature is otherwise perfectly valid. This matters because a JWT, once issued, cannot be individually "revoked" the way a traditional server-side session can (covered in the next lesson\'s comparison) — the server does not keep a record of which tokens it has issued, so there is no simple "delete this one session" operation; a JWT remains valid for anyone holding it until it naturally expires. Keeping the expiration window relatively short (an hour is a common starting point) limits how long a stolen or leaked token remains useful to an attacker, at the cost of requiring the user to log in again once it expires — production systems commonly address this trade-off with a second, longer-lived "refresh token," used specifically to obtain a new short-lived access token without requiring the user to re-enter their password, a pattern this course revisits in more depth later.

## Where JWT_SECRET comes from, and why it must never be guessable or hardcoded

\`\`\`js
// WRONG — a hardcoded, easily-guessable, or committed-to-source-control secret
const token = jwt.sign(payload, "secret123");

// RIGHT — a long, random value loaded from the environment, per the process.env lesson
const token = jwt.sign(payload, process.env.JWT_SECRET);
\`\`\`

The entire security guarantee a JWT provides rests on \`JWT_SECRET\` being something only the legitimate server knows — anyone who obtains this exact value can forge perfectly valid, correctly-signed tokens for any \`userId\` they choose, completely bypassing authentication as thoroughly as the original broken \`x-user-id\` header did. This is why \`JWT_SECRET\` follows the exact same handling rules covered in this course\'s earlier \`process.env\` lesson: a long, randomly generated value (not a memorable word or short phrase, which could be guessed or brute-forced), stored in a gitignored \`.env\` file locally and as a securely configured environment variable in production, never hardcoded directly into source code, and never committed to version control.

## The middleware pattern: authentication as a reusable gate, not repeated per-route logic

\`\`\`js
router.delete("/account", requireAuth, deleteAccountController);
router.get("/profile", requireAuth, getProfileController);
router.post("/posts", requireAuth, createPostController);
\`\`\`

Following the Express middleware and router patterns covered earlier in this course, \`requireAuth\` is written once and then applied to every route that needs a verified identity, simply by listing it as an additional argument before the route\'s actual handler — Express runs middleware functions in the order they are listed, so \`requireAuth\` always completes (attaching a trusted \`req.userId\`, or rejecting the request outright) before the route\'s own logic ever executes. This keeps the "is this request genuinely authenticated" concern entirely separate from each individual route\'s actual business logic (deleting an account, returning a profile, creating a post), and ensures the exact same, carefully-reasoned-about verification logic protects every route that uses it, rather than each route handler needing to reimplement — and potentially get subtly wrong — its own copy of the same check.`,

    contentHi: `## JWTs signed hote hain, encrypted nahi — payload ke andar kabhi secrets mat daalo

\`\`\`js
// Ek JWT ka payload base64-encoded hai, ENCRYPTED nahi — koi bhi ise decode aur padh sakta hai
const token = jwt.sign({ userId: 42, creditCardNumber: "4111111111111111" }, secret);
// atob(token.split(".")[1]) turant { userId: 42, creditCardNumber: "..." } zaahir karta hai
// KISI BHI ko jiske paas token hai, bina koi secret key chahiye
\`\`\`

Ek sach mein aam aur khatarnaak galatfehmi ye hai ki JWT ke payload ko aise treat karna jaise ye confidential ho sirf isliye kyunki poora token "signed" hai — signing aur encrypting alag operations hain alag maqsad ke saath. Signature saabit karta hai ki payload ke saath tampering nahi hui hai server ke use banaane ke baad se (integrity), par ye payload ke CONTENTS ko chhupaane ke liye kuch nahi karta (confidentiality) — payload sirf base64-encoded hai, ek reversible encoding, encryption nahi, aur token pakde koi bhi (client sameet jise token issue hua tha, aur koi bhi jise client use share kare, jaan-boojhkar ya ek leak se) aasaani se ismein har field decode aur padh sakta hai server ka secret jaane bina bhi. Isse nikalta rule ye hai: ek JWT payload mein sirf wo jaankaari honi chahiye jo token ke holder ke liye, aur kisi ke liye bhi jo use intercept kare, seedha padhna surakshit hai — ek ID, ek role, ek expiration time — kabhi ek password, ek credit card number, ya koi doosri sach mein sensitive value nahi.

## Expiration aur refresh: ek token hamesha ke liye kyun nahi jeena chahiye

\`\`\`js
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
\`\`\`

\`expiresIn\` option seedha token ke payload mein ek expiration timestamp embed karta hai, aur \`jwt.verify()\` apne aap is timestamp ko check karta hai aur ek expire hue token ko reject karta hai chahe uska signature aur sab tarah se poori tarah valid ho. Ye maayne rakhta hai kyunki ek JWT, ek baar issue hone ke baad, akele "revoke" nahi kiya jaa sakta jaise ek traditional server-side session ho sakta hai (agle lesson ke comparison mein cover hoga) — server iska record nahi rakhta ki usne kaunse tokens issue kiye hain, isliye koi saadha "is akele session ko delete karo" operation nahi hai; ek JWT jo bhi use pakde uske liye valid rehta hai jab tak wo naisargik taur par expire nahi hota. Expiration window ko taulnaatmak taur par chhota rakhna (ek ghanta ek aam shuruaati point hai) simit karta hai ki ek churaaya ya leak hua token attacker ke liye kitni der kaam ka rehta hai, is keemat par ki user ko ek baar expire hone ke baad dobara login karna pade — production systems is trade-off ko aam taur par ek doosre, lambi-umar wale "refresh token" se sambhaalte hain, khaas taur par istemal hota hai user ko apna password dobara daale bina ek naya chhoti-umar wala access token paane ke liye, ek pattern jise ye course baad mein zyaada gehraayi se dobara dekhta hai.

## \`JWT_SECRET\` kahan se aata hai, aur ye kabhi guess-karne-laayak ya hardcoded kyun nahi hona chahiye

\`\`\`js
// GALAT — ek hardcoded, aasaani se guess-hone-laayak, ya source control mein commit kiya secret
const token = jwt.sign(payload, "secret123");

// SAHI — ek lamba, random value environment se load kiya hua, process.env lesson ke hisaab se
const token = jwt.sign(payload, process.env.JWT_SECRET);
\`\`\`

Poori security guarantee jo ek JWT deta hai isi par tiki hai ki \`JWT_SECRET\` kuch aisa ho jise sirf legitimate server jaanta hai — koi bhi jo bilkul yehi value paata hai kisi bhi \`userId\` ke liye poori tarah valid, sahi-signed tokens forge kar sakta hai jo apni marzi se chune, authentication ko poori tarah bypass karte hue bilkul asli toote \`x-user-id\` header ki tarah. Bilkul isi wajah se \`JWT_SECRET\` is course ke pehle wale \`process.env\` lesson mein cover hue bilkul wahi handling rules follow karta hai: ek lamba, randomly banaaya gaya value (koi yaad-rakhne-laayak shabd ya chhota vaakya nahi, jise guess ya brute-force kiya ja sake), locally ek gitignored \`.env\` file mein aur production mein ek surakshit taur par configure ki gayi environment variable ki tarah stored, kabhi seedha source code mein hardcoded nahi, aur kabhi version control mein commit nahi hua.

## Middleware pattern: authentication ek dobara-istemal-hone-laayak gate ki tarah, har-route-ke-liye dohraayi logic nahi

\`\`\`js
router.delete("/account", requireAuth, deleteAccountController);
router.get("/profile", requireAuth, getProfileController);
router.post("/posts", requireAuth, createPostController);
\`\`\`

Is course mein pehle cover hue Express middleware aur router patterns ka palan karte hue, \`requireAuth\` ek baar likha jaata hai aur phir har route par lagu hota hai jise ek verify hui pehchaan chahiye, bas use route ke asli handler se pehle ek additional argument ki tarah list karke — Express middleware functions ko wahi kram mein chalaata hai jismein wo list hue hain, isliye \`requireAuth\` hamesha poora hota hai (ek bharosemand \`req.userId\` attach karte hue, ya request ko seedha reject karte hue) us se pehle ki route ki apni logic kabhi chale. Ye "kya ye request sach mein authenticated hai" wali chinta ko har akele route ki asli business logic (ek account delete karna, ek profile lautaana, ek post banaana) se poori tarah alag rakhta hai, aur sunishchit karta hai ki bilkul wahi, dhyaan-se-socha-hua verification logic har us route ko surakshit karta hai jo ise istemal karta hai, har route handler ko apni khud ki usi check ki copy dobara lagu karne ki zarurat ke bajaye — aur samyog se use thoda galat karne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a plain client-supplied header is trusted directly',
        titleHi: 'Toota: ek saadha client-diya header seedha bharosa hota hai',
        code: `const userId = req.headers["x-user-id"];
await pool.query("DELETE FROM users WHERE id = $1", [userId]);
// anyone can send any userId — no proof of identity required`,
        codeJs: `app.delete("/account", async (req, res, next) => {
  const userId = req.headers["x-user-id"];
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.delete("/account", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.headers["x-user-id"];
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — req.headers values are
// always strings (or undefined), which this code compiles fine against.
// The vulnerability is entirely about trust, not types.`,
        output: `curl -X DELETE http://localhost:3000/account -H "x-user-id: 4"
successfully deletes user 4's account — with no login, no password,
no token, regardless of who is actually running the request.`,
        explain: 'This route provides no authentication at all — it simply believes whatever identity the incoming request claims for itself, with no mechanism to verify that claim.',
        explainHi: 'Ye route bilkul koi authentication deta hi nahi — ye bas jo bhi pehchaan aane wali request apne baare mein daava karti hai use maan leta hai, us daave ko verify karne ka koi mechanism nahi.',
      },
      {
        title: 'Fixed: sign a JWT at login, verify it with a reusable auth middleware',
        titleHi: 'Theek: login par ek JWT sign karo, use ek dobara-istemal-hone-laayak auth middleware se verify karo',
        code: `const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// ...later, on a protected route...
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.status(401).json({ error: "Invalid or expired token" });
  req.userId = decoded.userId;
});`,
        codeJs: `const jwt = require("jsonwebtoken");

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT id, password FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}

app.delete("/account", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import jwt from "jsonwebtoken";

interface AuthedRequest extends Request {
  userId?: number;
}

app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const result = await pool.query<{ id: number; password: string }>(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    req.userId = decoded.userId as number;
    next();
  });
}

app.delete("/account", requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The same curl attempt sending an arbitrary x-user-id header no longer
works at all — the route now requires a valid Authorization: Bearer
<token> header containing a token this exact server issued, with a
signature that has not been tampered with and has not yet expired.`,
        outputTs: `// Identical behaviour. AuthedRequest extends Express's Request type
// to add the userId field the middleware attaches, giving downstream
// route handlers compile-time awareness that req.userId exists after
// requireAuth runs.`,
        explain: 'req.userId is now something the server itself derived from a cryptographically verified token, never something the client gets to directly claim through a header or body field.',
        explainHi: '\`req.userId\` ab wo cheez hai jise server ne khud ek cryptographically verify hue token se nikaala, kabhi wo cheez nahi jise client ek header ya body field ke through seedha daava kar sake.',
      },
      {
        title: 'JWT payloads are readable, not secret — only the signature is protected',
        titleHi: 'JWT payloads padhne-laayak hain, secret nahi — sirf signature surakshit hai',
        code: `const parts = token.split(".");
console.log(JSON.parse(Buffer.from(parts[1], "base64").toString()));
// { userId: 42, iat: ..., exp: ... } — fully readable, no secret needed`,
        codeJs: `// Demonstration only — never do this with a real user's token in production code
const token = jwt.sign({ userId: 42 }, process.env.JWT_SECRET, { expiresIn: "1h" });
const [, payloadBase64] = token.split(".");
const decodedPayload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
console.log(decodedPayload);
// { userId: 42, iat: 1735689600, exp: 1735693200 } — readable without JWT_SECRET`,
        codeTs: `const token: string = jwt.sign({ userId: 42 }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
const [, payloadBase64] = token.split(".");
const decodedPayload: unknown = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
console.log(decodedPayload);
// { userId: 42, iat: 1735689600, exp: 1735693200 } — readable without JWT_SECRET`,
        outputJs: `The payload decodes and prints in full with no knowledge of
JWT_SECRET at all — proving the payload was never hidden, only signed.
Any sensitive value placed in a JWT payload is exposed to anyone
holding the token.`,
        outputTs: `// Identical behaviour. This is exactly why sensitive data (passwords,
// card numbers, anything genuinely confidential) must never be placed
// inside a JWT payload, regardless of how the token itself is typed.`,
        explain: 'Decoding a JWT payload requires no secret key at all — base64 is an encoding, not encryption, and this step is completely reversible by anyone.',
        explainHi: 'Ek JWT payload decode karne ke liye bilkul koi secret key nahi chahiye — base64 ek encoding hai, encryption nahi, aur ye step kisi ke liye bhi poori tarah reversible hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const userId = req.headers["x-user-id"];
await pool.query("DELETE FROM users WHERE id = $1", [userId]);
// trusting a plain, client-editable header as proof of identity`,
        right: `jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  req.userId = decoded.userId; // only trusted after cryptographic verification
});`,
        why: 'A plain header or body field is nothing more than text the client chooses to send — it provides no proof of identity at all, and anyone can set it to any value they want.',
        whyHi: 'Ek saadha header ya body field bas text hai jise client bhejne ka faisla karta hai — ye pehchaan ka bilkul koi saboot nahi deta, aur koi bhi ise koi bhi value set kar sakta hai jo wo chaahe.',
      },
      {
        wrong: `const token = jwt.sign(
  { userId: user.id, creditCardNumber: user.cardNumber },
  process.env.JWT_SECRET
);
// sensitive data placed inside a readable payload`,
        right: `const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
// only non-sensitive identifiers in the payload`,
        why: 'A JWT payload is base64-encoded, not encrypted — anyone holding the token can decode and read every field inside it without knowing the server\'s secret, so genuinely sensitive data must never be placed there.',
        whyHi: 'Ek JWT payload base64-encoded hai, encrypted nahi — token pakde koi bhi server ka secret jaane bina ismein har field decode aur padh sakta hai, isliye sach mein sensitive data kabhi wahan nahi rakhna chahiye.',
      },
      {
        wrong: `const token = jwt.sign(payload, "my-secret-key");
// a short, guessable, hardcoded secret directly in source code`,
        right: `const token = jwt.sign(payload, process.env.JWT_SECRET);
// a long, random value loaded from the environment, never committed to source control`,
        why: 'Anyone who obtains the exact JWT_SECRET value can forge perfectly valid, correctly-signed tokens for any user they choose — a short, guessable, or hardcoded-and-committed secret defeats the entire security guarantee JWTs provide.',
        whyHi: 'Koi bhi jo bilkul \`JWT_SECRET\` value paata hai kisi bhi user ke liye poori tarah valid, sahi-signed tokens forge kar sakta hai jo wo chune — ek chhota, guess-hone-laayak, ya hardcoded-aur-committed secret JWTs ki poori security guarantee ko haraata hai.',
      },
    ],

    realWorld: [
      {
        en: '**JWTs are an open, RFC-standardized format (RFC 7519), which is why the exact same token format and verification logic works identically across essentially any backend language or framework** — a token issued by a Node.js server can be verified by a completely different service written in another language, as long as both share the same secret (or, in more advanced setups, a public/private key pair).',
        hi: '**JWTs ek khula, RFC-standardized format hain (RFC 7519), isi wajah se bilkul wahi token format aur verification logic lagbhag kisi bhi backend language ya framework mein ek-jaisa kaam karta hai** — ek Node.js server dwara issue kiya token ek poori tarah alag service dwara verify kiya ja sakta hai jo kisi doosri language mein likhi hai, jab tak dono wahi secret share karte hain (ya, zyaada advanced setups mein, ek public/private key jodi).',
      },
      {
        en: '**Every major authentication-as-a-service platform (Auth0, Clerk, Firebase Authentication, AWS Cognito) issues JWTs as its standard token format** — understanding how to sign, verify, and correctly reason about a JWT\'s security properties directly transfers to working with any of these services, not just to a hand-built jsonwebtoken-based system.',
        hi: '**Har mukhya authentication-as-a-service platform (Auth0, Clerk, Firebase Authentication, AWS Cognito) JWTs ko apne standard token format ki tarah issue karta hai** — ye samajhna ki ek JWT ki security properties ko kaise sign, verify, aur sahi tarike se soch-samajh kar samjha jaaye seedha in mein se kisi bhi service ke saath kaam karne mein transfer hota hai, sirf ek haath-se-bane \`jsonwebtoken\`-based system tak seemit nahi.',
      },
      {
        en: '**Stolen or leaked JWTs (through browser XSS, a compromised device, or accidentally logged tokens) are a genuine, commonly discussed real-world attack vector**, which is exactly why keeping the token\'s lifetime short via expiresIn, storing it carefully on the client, and never exposing JWT_SECRET are treated as production-critical practices rather than optional hardening.',
        hi: '**Churaaye ya leak hue JWTs (browser XSS, ek compromise hua device, ya samyog se log hue tokens ke through) ek asli, aam taur par discuss hone waala real-world attack vector hain**, bilkul isi wajah se \`expiresIn\` ke through token ki lifetime ko chhota rakhna, use client par dhyaan se store karna, aur \`JWT_SECRET\` ko kabhi expose na karna production-critical practices ki tarah treat kiye jaate hain, vaikalpik hardening nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does trusting a client-supplied header like x-user-id provide no real authentication, even though it appears to identify the user correctly?',
        qHi: '\`x-user-id\` jaisa ek client-diya header bharosa karna asli authentication kyun nahi deta, chahe ye user ko sahi tarike se pehchaanta dikhe?',
        a: 'A header sent by the client is, structurally, just a piece of plain text the client freely chooses to include in its request — the server receiving it has no built-in way to distinguish "a header genuinely reflecting the requester\'s real identity" from "a header the requester simply typed in, true or not." Since HTTP clients (browsers via developer tools, curl, any programmatic HTTP request) allow the sender to set arbitrary header values with no restriction, an attacker can trivially send any x-user-id value they like, including another real user\'s ID, and the server, having no mechanism to verify the claim, processes the request exactly as if it genuinely came from that user. Genuine authentication requires the server to possess some way of confirming a claim of identity that the client alone cannot fabricate — a password only the real user knows (checked once, at login, via bcrypt), or, for every subsequent request, a token cryptographically signed by the server itself using a secret the client never has access to, which is precisely the gap a JWT-based approach closes and a plain header does not.',
        aHi: 'Client dwara bheja gaya ek header, sanrachnaatmak taur par, bas plain text ka ek tukda hai jise client apni request mein azaad taur par shaamil karne ka faisla karta hai — use paane wale server ke paas "ek header jo requester ki asli pehchaan sach mein zaahir karta hai" ko "ek header jo requester ne bas type kar diya, sach ho ya jhoot" se alag karne ka koi built-in tarika nahi hai. Kyunki HTTP clients (browsers developer tools se, curl, koi bhi programmatic HTTP request) sender ko bina kisi rok-tok ke manmaani header values set karne dete hain, ek attacker aasaani se koi bhi \`x-user-id\` value bhej sakta hai jo wo chaahe, kisi doosre asli user ki ID sameet, aur server, daave ko verify karne ka koi mechanism na rakhte hue, request ko bilkul aise process karta hai jaise ye sach mein us user se aayi ho. Asli authentication ke liye server ko koi tarika chahiye pehchaan ka ek daava confirm karne ka jise akela client fabricate nahi kar sakta — ek password jo sirf asli user jaanta hai (ek baar check hua, login par, bcrypt ke through), ya, har baad wali request ke liye, ek token jo server khud ek secret ka istemal karke cryptographically sign karta hai jise client ke paas kabhi access nahi — bilkul isi kami ko ek JWT-based tarika band karta hai aur ek saadha header nahi.',
      },
      {
        q: 'What does it actually mean for a JWT to be "signed but not encrypted," and why does that distinction matter for what should and should not go inside its payload?',
        qHi: 'Ek JWT ke "signed par encrypted nahi" hone ka asal matlab kya hai, aur ye farak iske payload mein kya jaana chahiye aur kya nahi is baat ke liye kyun maayne rakhta hai?',
        a: 'A JWT\'s payload is encoded using base64, which is a reversible, publicly known encoding scheme — converting data between a binary or JSON representation and a text-safe string, with no secret key involved in either direction. This means the payload of any JWT can be decoded and read in full by anyone who has the token, using nothing more than a standard base64-decoding function, entirely without needing to know the server\'s JWT_SECRET. What DOES require the server\'s secret is the signature (the third, final part of the token) — it is a cryptographic value computed from the header, the payload, and the secret key together, and it is this signature that jwt.verify() recomputes and checks to confirm the payload has not been altered since the server originally created the token. "Signed" therefore means "tamper-evident" — any modification to the payload after signing produces a signature mismatch, which verification will catch — while "not encrypted" means "not hidden" — the payload\'s actual contents remain fully visible to anyone holding the token. Because of this, a JWT payload should only ever contain information that is acceptable for the token\'s holder (and anyone who might intercept it) to read directly — identifiers, roles, expiration data — and never passwords, financial details, or any other information that must remain genuinely confidential.',
        aHi: 'Ek JWT ka payload base64 ka istemal karke encode kiya jaata hai, jo ek reversible, saarvajanik taur par jaana-pehchaana encoding scheme hai — data ko binary ya JSON representation aur ek text-safe string ke beech badalna, kisi bhi disha mein koi secret key shaamil hue bina. Iska matlab hai kisi bhi JWT ka payload kisi ke bhi dwara poori tarah decode aur padha jaa sakta hai jiske paas token hai, ek standard base64-decoding function se zyaada kuch istemal kiye bina, server ka \`JWT_SECRET\` jaane ki zarurat bilkul bina. Jo cheez server ke secret ki maang KARTI hai wo signature hai (token ka teesra, aakhri hissa) — ye ek cryptographic value hai jo header, payload, aur secret key teenon se milkar calculate hota hai, aur bilkul yehi signature hai jise \`jwt.verify()\` dobara calculate karta hai aur check karta hai ye confirm karne ke liye ki payload mein badlaav nahi hua hai server ke asal mein token banaane ke baad se. "Signed" isliye matlab hai "tamper-evident" — payload mein signing ke baad koi bhi badlaav ek signature mismatch paida karta hai, jise verification pakad legi — jabki "encrypted nahi" matlab hai "chhupa nahi" — payload ki asli cheezein poori tarah dikhaayi deti rehti hain kisi ke liye bhi jiske paas token hai. Isi wajah se, ek JWT payload mein kabhi bhi sirf wo jaankaari honi chahiye jo token ke holder ke liye (aur kisi ke liye bhi jo use intercept kare) seedha padhna swikaarya ho — identifiers, roles, expiration data — aur kabhi passwords, financial details, ya koi doosri jaankaari nahi jise sach mein confidential rehna chahiye.',
      },
      {
        q: 'Why does a JWT need to include an expiration, and what limitation does this partially address given that a JWT cannot be individually revoked the way a server-side session can?',
        qHi: 'Ek JWT ko expiration shaamil karne ki zarurat kyun hai, aur ye kaunsi seemaa ko aadha-sambhaalta hai isliye ki ek JWT ko akele revoke nahi kiya jaa sakta jaise ek server-side session ho sakta hai?',
        a: 'A traditional server-side session is tracked by the server itself — the server maintains a record (often in a database or an in-memory store) of which sessions are currently valid, which means a single specific session can be immediately invalidated at any time simply by removing or marking that record, such as when a user explicitly logs out or an administrator needs to force-terminate a compromised session. A JWT, by contrast, is deliberately stateless from the server\'s perspective — the server does not keep a list of "currently valid tokens" at all, and instead simply re-verifies each token\'s signature on every request, which means there is no straightforward way to invalidate one specific, already-issued token before it would naturally expire; a JWT, once issued, remains valid for anyone holding it for as long as its signature checks out and it has not yet expired. Building in a relatively short expiresIn window directly addresses this gap: even though a compromised or leaked token cannot be individually revoked, its usefulness to an attacker is bounded by time — once the expiration passes, jwt.verify() will reject it regardless of whether the signature is otherwise perfectly valid, limiting the damage window a stolen token can cause. This is also the underlying motivation for the refresh-token pattern this course revisits later: pairing a short-lived access token (limiting exposure) with a longer-lived refresh token used to obtain new access tokens, balancing security against the inconvenience of requiring frequent re-logins.',
        aHi: 'Ek traditional server-side session server khud track karta hai — server ek record rakhta hai (aksar ek database ya ek in-memory store mein) ki abhi kaunse sessions valid hain, jiska matlab hai ek khaas session kabhi bhi turant invalidate kiya jaa sakta hai bas us record ko hataakar ya nishaan lagaakar, jaise jab ek user explicitly logout karta hai ya ek administrator ko ek compromise hue session ko zabardasti khatam karna chahiye. Ek JWT, iske ulta, server ke nazariye se jaan-boojhkar stateless hai — server "abhi valid tokens" ki koi list bilkul nahi rakhta, aur iske bajaye bas har request par har token ka signature dobara verify karta hai, jiska matlab hai ek khaas, pehle-se-issue-hua token ko us se pehle invalidate karne ka koi seedha tarika nahi hai jab tak wo naisargik taur par expire na ho; ek JWT, ek baar issue hone ke baad, jo bhi use pakde uske liye valid rehta hai jab tak uska signature theek nikalta hai aur wo abhi tak expire nahi hua. Ek taulnaatmak taur par chhota \`expiresIn\` window banaana seedha is kami ko sambhaalta hai: chahe ek compromise hua ya leak hua token akele revoke nahi kiya jaa sakta, iska attacker ke liye kaam-ka-hona waqt se seemit hai — expiration guzarne ke baad, \`jwt.verify()\` use reject karega chahe signature aur sab tarah se poori tarah valid ho, ek churaaye token ka nuksaan-window seemit karte hue. Ye bhi refresh-token pattern ka underlying prerna hai jise ye course baad mein dobara dekhta hai: ek chhoti-umar wale access token (exposure seemit karte hue) ko ek lambi-umar wale refresh token ke saath jodna jo naye access tokens paane ke liye istemal hota hai, security ko baar-baar dobara-login karne ki taklif ke khilaaf santulit karte hue.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /account route trusting x-user-id directly. Using curl, delete a test account whose ID you did not "log in" as — confirm the attack works as described.',
        taskHi: '\`x-user-id\` par seedha bharosa karta toota \`/account\` route banao. curl istemal karke, ek test account delete karo jiski ID mein tumne "login" nahi kiya — confirm karo attack bilkul jaisa bataaya gaya kaam karta hai.',
        hint: 'curl -X DELETE http://localhost:3000/account -H "x-user-id: <any-id>" is all it takes — no login step at all.',
        hintHi: '\`curl -X DELETE http://localhost:3000/account -H "x-user-id: <koi-bhi-id>"\` bas itna hi chahiye — koi login step bilkul nahi.',
      },
      {
        task: 'Fix it with jwt.sign() at login and a requireAuth middleware verifying jwt.verify() before the route runs. Confirm the same curl attack from exercise 1 now correctly fails with 401.',
        taskHi: 'Login par \`jwt.sign()\` aur route chalne se pehle \`jwt.verify()\` verify karta ek \`requireAuth\` middleware se theek karo. Confirm karo exercise 1 wala wahi curl attack ab sahi tarike se 401 ke saath fail hota hai.',
        hint: 'Log in through the /login route first to obtain a real token, then send it correctly as "Authorization: Bearer <token>" to confirm the legitimate path still works.',
        hintHi: 'Pehle \`/login\` route se login karke ek asli token pao, phir use sahi tarike se "Authorization: Bearer <token>" ki tarah bhejo confirm karne ke liye ki legitimate raasta abhi bhi kaam karta hai.',
      },
      {
        task: 'Decode a real, valid token\'s payload manually (Buffer.from(token.split(".")[1], "base64").toString()) without touching JWT_SECRET at all, and confirm you can read the userId and expiration directly.',
        taskHi: 'Ek asli, valid token ka payload haath se decode karo (\`Buffer.from(token.split(".")[1], "base64").toString()\`) bilkul \`JWT_SECRET\` chhue bina, aur confirm karo tum seedha \`userId\` aur expiration padh sakte ho.',
        hint: 'Try this with a JWT debugger website too, pasting a real token to see the same decoded payload — a useful way to internalize that the payload was never actually hidden.',
        hintHi: 'Ise ek JWT debugger website ke saath bhi try karo, ek asli token paste karke wahi decoded payload dekhne ke liye — ye samajhne ka ek kaam ka tarika ki payload asal mein kabhi chhupa hi nahi tha.',
      },
    ],

    keyTakeaways: [
      'Trusting a plain, client-supplied field (a header, a body value) as proof of identity provides no real authentication — the client can set it to any value with no verification possible.',
      'A JWT is a signed token: jwt.sign() creates it using a server-only secret, and jwt.verify() recomputes and checks the signature, rejecting any token that was forged, tampered with, or has expired.',
      'A JWT is signed but NOT encrypted — its payload is only base64-encoded and fully readable by anyone holding the token, so genuinely sensitive data must never be placed inside it.',
      'expiresIn bounds how long a token remains valid — since an individual JWT cannot be selectively revoked the way a server-side session can, a short expiration limits the damage window of a stolen token.',
      'JWT_SECRET must be a long, random, environment-loaded value, never hardcoded or committed to source control — anyone who obtains it can forge valid tokens for any user.',
      'An auth middleware (like requireAuth) written once and applied to every protected route keeps authentication logic centralized and consistent, rather than reimplemented per route.',
    ],
    keyTakeawaysHi: [
      'Ek saadha, client-diya field (ek header, ek body value) ko pehchaan ke saboot ki tarah bharosa karna asli authentication nahi deta — client ise koi bhi value set kar sakta hai koi verification mumkin nahi.',
      'Ek JWT ek signed token hai: \`jwt.sign()\` ise ek server-only secret ka istemal karke banaata hai, aur \`jwt.verify()\` signature ko dobara calculate aur check karta hai, kisi bhi token ko reject karte hue jo forge hua ho, tamper hua ho, ya expire ho chuka ho.',
      'Ek JWT signed hai par ENCRYPTED nahi — iska payload sirf base64-encoded hai aur token pakde kisi bhi ke liye poori tarah padhne-laayak hai, isliye sach mein sensitive data kabhi ismein nahi rakhna chahiye.',
      '\`expiresIn\` simit karta hai ki ek token kitni der valid rehta hai — kyunki ek akela JWT chunkar revoke nahi kiya jaa sakta jaise ek server-side session ho sakta hai, ek chhota expiration ek churaaye token ka nuksaan-window seemit karta hai.',
      '\`JWT_SECRET\` ek lamba, random, environment-se-load-hua value hona chahiye, kabhi hardcoded ya source control mein commit nahi — koi bhi jo ise paata hai kisi bhi user ke liye valid tokens forge kar sakta hai.',
      'Ek auth middleware (jaise \`requireAuth\`) ek baar likha jaata hai aur har surakshit route par lagu hota hai, authentication logic ko kendrit aur sangat rakhte hue, har route mein dobara lagu karne ke bajaye.',
    ],
  },
];
