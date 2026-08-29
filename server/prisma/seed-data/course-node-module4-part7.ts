/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 7.
 *
 * Token blacklisting: why a "logout" button that only deletes a JWT on the
 * client side does nothing to stop that exact same token from continuing
 * to work if a copy of it was ever stolen (XSS, a shared computer, a
 * compromised device) — the token itself remains cryptographically valid,
 * completely unaware the user ever clicked "log out," until it naturally
 * expires. This is a narrower, distinct problem from the sessions-vs-tokens
 * lesson's user-level is_banned flag: banning invalidates EVERY token a
 * user holds; this lesson covers revoking ONE SPECIFIC token (this one
 * device's session, or a token known to be stolen) without touching any of
 * that same user's other valid sessions. Fixed by giving every JWT a unique
 * jti (JWT ID) claim, and on logout/revocation, storing that specific jti
 * in Redis with a TTL set to exactly the token's own remaining lifetime —
 * so the blacklist entry costs nothing to store forever and disappears
 * naturally the moment the token itself would have expired anyway.
 * requireAuth then checks the blacklist as a third condition alongside
 * signature and expiry.
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

export const NODE_MODULE_4_PART7: CourseLesson[] = [
  {
    slug: 'token-blacklisting',
    title: 'Token Blacklisting: Revoking One Specific Token, Not the Whole User',
    titleHi: 'Token Blacklisting: Poore User Ko Nahi, Ek Khaas Token Ko Revoke Karna',
    description: 'A user clicks "log out" on a shared library computer — but the exact same JWT, if anyone copied it in the minute before, keeps working perfectly for a full hour afterward, completely unaware anyone ever clicked anything.',
    descriptionHi: 'Ek user ek shared library computer par "log out" click karta hai — par bilkul wahi JWT, agar kisi ne use ek minute pehle copy kiya ho, uske baad poore ek ghante tak bilkul theek kaam karta rehta hai, poori tarah bekhabar ki kisi ne kuch bhi click kiya.',
    difficulty: 'HARD',
    duration: 22,
    order: 7,

    analogy: {
      en: '**A guest who returns their hotel room key card to the front desk when checking out — but a copy of that same key card, cut by someone else the day before, still opens the room door perfectly for however long the original card was valid, since the door lock itself never actually learned the guest checked out.** A "logout" button that only deletes a JWT from the browser is like a hotel guest who, wanting to make sure nobody can get into their room after they leave, hands their OWN key card back to the front desk clerk — a completely genuine, well-intentioned act. But if someone had secretly made a duplicate of that exact card the day before (a copy the guest never knew existed), handing back the original card does absolutely nothing to that duplicate — the duplicate still opens the door exactly as well as it did five minutes ago, because the door lock itself has no way of knowing the original card was ever returned; the lock only knows "does the card presented to me match a valid pattern," and the duplicate matches that pattern just as well as the original did, right up until the lock\'s own separate, scheduled re-keying happens to occur regardless of who returned what. A hotel that instead maintains a specific list of individually revoked card numbers, checked by every door on every single use, closes this gap completely: the moment the front desk marks THIS SPECIFIC card\'s number as revoked, every door in the hotel — including whichever one the duplicate is presented to — refuses it immediately, regardless of whether it is the original card or a secretly-made copy, because the check no longer depends on the lock somehow knowing the card was returned; it depends on that card\'s specific number being on the revoked list.',
      hi: '**Ek guest jo checkout karte waqt apna hotel room key card front desk ko wapas karta hai — par us hi key card ki ek copy, jo kisi doosre ne ek din pehle kaati thi, poori tarah room ka darwaaza kholti rehti hai jitni der tak asli card valid tha, kyunki door lock ne khud kabhi seekha hi nahi ki guest checkout ho chuka hai.** Ek "logout" button jo sirf browser se ek JWT delete karta hai ek aise hotel guest jaisa hai jo, ye sunishchit karna chahte hue ki koi bhi unke jaane ke baad unke room mein na aa sake, apna KHUD ka key card front desk clerk ko wapas de deta hai — ek poori tarah asli, achhi-niyat wala action. Par agar kisi ne chupke se us bilkul card ki ek duplicate banaayi thi ek din pehle (ek copy jo guest ko kabhi pata nahi thi maujood hai), asli card wapas dena us duplicate par bilkul kuch nahi karta — duplicate abhi bhi darwaaza utni hi achhi tarah kholta hai jitna wo paanch minute pehle karta tha, kyunki door lock ke paas ye jaanne ka koi tarika nahi ki asli card kabhi wapas kiya gaya tha; lock sirf jaanta hai "kya mujhe dikhaaya gaya card ek valid pattern se milta hai," aur duplicate us pattern se utna hi achhi tarah milta hai jitna asli milta tha, theek us waqt tak jab lock ki apni alag, scheduled re-keying hoti hai kaun kya wapas karta hai us se bekhabar. Ek hotel jo iske bajaye individually revoke kiye card numbers ki ek khaas list maintain karta hai, har akele istemal par har darwaaze se check ki gayi, is kami ko poori tarah band karta hai: jis pal front desk IS KHAAS card ke number ko revoked mark karta hai, hotel ka har darwaaza — jis bhi ek ko duplicate dikhaaya jaaye sameet — use turant mana kar deta hai, chahe ye asli card ho ya ek chupke se banaayi copy, kyunki check ab is baat par nirbhar nahi karta ki lock kisi tarah jaanta hai card wapas hua tha; ye is baat par nirbhar karta hai ki us khaas card ka number revoked list mein hai.',
    },

    simple: `**Start broken.** A logout that only ever deletes the JWT on the client side, doing nothing to the token itself:

\`\`\`js
// Client — "logging out" simply forgets the token locally
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
\`\`\`

\`\`\`js
// Server — the same requireAuth from this module's JWT lesson, checking only signature and expiry
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}
\`\`\`

Clicking "log out" correctly removes the token from the CURRENT browser\'s storage — that specific browser tab genuinely can no longer make authenticated requests, since it no longer has a token to send at all. But the actual JWT string itself — the exact sequence of characters that made up that token — was never told anything at all; it remains, structurally, a perfectly valid, correctly-signed, unexpired token for as long as its original \`expiresIn\` window lasts, completely unaware that the specific browser it came from just "logged out." If anyone else obtained a copy of that exact token BEFORE the logout happened — through a cross-site scripting vulnerability capturing it, a shared or public computer where it was never fully cleared, a compromised device, or a security incident of any kind — that copy keeps working perfectly, passing \`requireAuth\`\'s signature and expiry checks with complete success, for however long remains of the token\'s original lifetime, entirely regardless of the fact that the legitimate user believes they have safely logged out. \`requireAuth\` has no mechanism whatsoever to distinguish "the original owner\'s browser, which genuinely logged out" from "a stolen copy of the exact same token, still being used by someone else" — both present an identical, validly-signed, unexpired token, and the code above accepts either one.

**The fix: blacklist this one specific token\'s ID until it would have expired anyway**

\`\`\`js
const { v4: uuidv4 } = require("uuid");

// At login: give every token a unique ID
const token = jwt.sign(
  { userId: user.id, jti: uuidv4() },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
\`\`\`

\`\`\`js
// On logout: blacklist this one specific token's jti, for exactly as long as it would have remained valid
app.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const remainingSeconds = req.tokenExp - Math.floor(Date.now() / 1000);
    await redisClient.setEx(\`blacklist:\${req.tokenJti}\`, remainingSeconds, "1");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`js
// requireAuth now checks the blacklist too, alongside signature and expiry
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) return res.status(401).json({ error: "Token has been revoked" });

    req.userId = decoded.userId;
    req.tokenJti = decoded.jti;
    req.tokenExp = decoded.exp;
    next();
  });
}
\`\`\`

\`\`\`ts
import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
const redisClient = createClient();

interface AuthedRequest extends Request {
  userId?: number;
  tokenJti?: string;
  tokenExp?: number;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) {
      res.status(401).json({ error: "Token has been revoked" });
      return;
    }

    req.userId = decoded.userId as number;
    req.tokenJti = decoded.jti as string;
    req.tokenExp = decoded.exp as number;
    next();
  });
}
\`\`\`

Every token now carries its own unique \`jti\` (JWT ID) claim, generated fresh at login — a value with no meaning of its own beyond uniquely identifying THIS SPECIFIC ISSUED TOKEN, distinct from every other token, including other tokens issued to the exact same user on other devices. On logout, the server stores that specific \`jti\` in Redis as a blacklist entry, with a TTL set to precisely however many seconds remain until that exact token\'s own \`exp\` (expiry) timestamp — meaning the blacklist entry costs storage for no longer than the token itself could possibly still be valid, and disappears from Redis automatically the instant it would have become irrelevant anyway (the token expiring naturally makes the blacklist check moot). \`requireAuth\` now checks three things instead of two: is the signature genuinely valid, has it not yet expired, AND is this specific token\'s \`jti\` absent from the blacklist — a stolen copy of a token whose legitimate owner has since logged out now fails this third check immediately, even though its signature and expiry are both still perfectly valid, closing exactly the gap client-side-only logout left wide open.`,

    simpleHi: `**Toote hue se shuru.** Ek logout jo sirf client side par JWT delete karta hai, token khud ke saath kuch bhi na karte hue:

\`\`\`js
// Client — "logout hona" bas token ko locally bhool jaata hai
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
\`\`\`

\`\`\`js
// Server — is module ke JWT lesson wala wahi requireAuth, sirf signature aur expiry check karte hue
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}
\`\`\`

"Log out" click karna sahi tarike se ABHI ke browser ki storage se token hataata hai — wo khaas browser tab sach mein ab authenticated requests nahi kar sakta, kyunki uske paas bhejne ke liye bilkul koi token nahi bacha. Par asli JWT string khud — characters ka bilkul sequence jisne wo token banaaya tha — use kabhi kuch bhi bataaya hi nahi gaya; ye, sanrachnaatmak taur par, ek poori tarah valid, sahi-signed, na-expire-hua token banaa rehta hai jab tak uski asli \`expiresIn\` window chalti hai, poori tarah bekhabar ki jis khaas browser se ye aaya wo abhi "logout" hua. Agar kisi aur ne logout hone se PEHLE us bilkul token ki ek copy paayi — ek cross-site scripting vulnerability jisne ise pakada, ek shared ya public computer jahan ye kabhi poori tarah saaf nahi hua, ek compromise hua device, ya kisi bhi kism ka ek security incident — wo copy poori tarah kaam karti rehti hai, \`requireAuth\` ki signature aur expiry checks poori safalta se paas karti hui, token ki asli umar ka jitna bhi bacha hai us waqt tak, poori tarah is baat se bekhabar ki legitimate user maanta hai ki wo surakshit taur par logout ho chuka hai. \`requireAuth\` ke paas "asli maalik ka browser, jo sach mein logout hua" ko "bilkul wahi token ki ek churaayi hui copy, jo abhi bhi kisi aur dwara istemal ho rahi hai" se alag karne ka bilkul koi mechanism nahi hai — dono ek identical, validly-signed, na-expire-hua token pesh karte hain, aur upar wala code inmein se ya to accept karta hai.

**Fix: is ek khaas token ki ID ko tab tak blacklist karo jab tak wo warna expire hoti**

\`\`\`js
const { v4: uuidv4 } = require("uuid");

// Login par: har token ko ek unique ID do
const token = jwt.sign(
  { userId: user.id, jti: uuidv4() },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
\`\`\`

\`\`\`js
// Logout par: is ek khaas token ka jti blacklist karo, bilkul utni der ke liye jitni der wo valid rehta
app.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const remainingSeconds = req.tokenExp - Math.floor(Date.now() / 1000);
    await redisClient.setEx(\`blacklist:\${req.tokenJti}\`, remainingSeconds, "1");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`js
// requireAuth ab blacklist bhi check karta hai, signature aur expiry ke saath-saath
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) return res.status(401).json({ error: "Token has been revoked" });

    req.userId = decoded.userId;
    req.tokenJti = decoded.jti;
    req.tokenExp = decoded.exp;
    next();
  });
}
\`\`\`

\`\`\`ts
import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
const redisClient = createClient();

interface AuthedRequest extends Request {
  userId?: number;
  tokenJti?: string;
  tokenExp?: number;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) {
      res.status(401).json({ error: "Token has been revoked" });
      return;
    }

    req.userId = decoded.userId as number;
    req.tokenJti = decoded.jti as string;
    req.tokenExp = decoded.exp as number;
    next();
  });
}
\`\`\`

Har token ab apna khud ka unique \`jti\` (JWT ID) claim rakhta hai, login par taaza banaaya gaya — ek value jiska apna koi matlab nahi hai IS BILKUL ISSUE HUI TOKEN ko uniquely pehchaanne se aage, har doosre token se alag, usi user ko doosre devices par issue hue doosre tokens sameet. Logout par, server us khaas \`jti\` ko Redis mein ek blacklist entry ki tarah store karta hai, ek TTL ke saath jo bilkul utne seconds set hai jitne us bilkul token ki apni \`exp\` (expiry) timestamp tak bache hain — matlab blacklist entry us se zyaada der ke liye storage ki keemat nahi leti jitni der token khud mumkin taur par valid ho sakta tha, aur Redis se apne aap gaayab ho jaati hai theek us pal jab ye warna bekaam ho jaati (token naisargik taur par expire hona blacklist check ko bemaani banaata hai). \`requireAuth\` ab do ki jagah teen cheezein check karta hai: kya signature sach mein valid hai, kya ye abhi tak expire nahi hua, AUR kya is khaas token ka \`jti\` blacklist mein na-maujood hai — ek stolen copy ek token ki jiska legitimate maalik tab se logout ho chuka hai ab is teesri check mein turant fail hoti hai, chahe uska signature aur expiry dono abhi bhi poori tarah valid hon, bilkul us kami ko band karte hue jise sirf-client-side logout ne khula chhod diya tha.`,

    content: `## Blacklisting one token vs. banning the whole user: two different tools for two different problems

\`\`\`
Sessions-vs-tokens lesson's is_banned flag: invalidates EVERY token this
user holds, on every device, everywhere — the right tool when the ENTIRE
ACCOUNT needs to be shut down (a ban, a compromised account being locked
down entirely).

This lesson's token blacklist: invalidates ONE SPECIFIC token — the right
tool for "log out this one device" or "this one specific token is known
to have been stolen," while every other valid session that same user
holds on other devices keeps working completely undisturbed.
\`\`\`

This course\'s earlier sessions-vs-tokens lesson solved a related but genuinely broader problem: a user\'s account being banned needs to invalidate ALL of that user\'s access, everywhere, immediately, which the \`is_banned\` database flag correctly achieves — every request from that user, regardless of which specific token or device it comes from, is rejected once the flag is set. Token blacklisting solves a narrower, distinct problem: a specific, individual token needing to stop working — because that specific browser session logged out, or because that one specific token is suspected to have been exposed — while every OTHER valid token that same user holds (a session on a different device, a different browser) should keep working completely normally. Confusing these two tools would either be far too broad (banning an entire user\'s account just because they clicked "log out" on one device) or far too narrow (only checking a user-level flag when a specific device\'s token specifically needs individual revocation) — recognizing which of the two problems is actually being solved determines which mechanism is the right fit.

## Why the blacklist entry\'s TTL should exactly match the token\'s own remaining lifetime

\`\`\`js
// WRONG — blacklisting forever means the entry never gets cleaned up, growing unboundedly
await redisClient.set(\`blacklist:\${jti}\`, "1"); // no TTL at all

// RIGHT — the entry exists only as long as the token itself could possibly still be valid
const remainingSeconds = tokenExp - Math.floor(Date.now() / 1000);
await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
\`\`\`

A blacklisted token\'s entry only ever needs to exist for as long as the underlying token itself remains within its own \`expiresIn\` window — once the token has naturally expired, \`requireAuth\`\'s own expiry check (\`jwt.verify\`) already rejects it regardless of whether it is on the blacklist at all, making a blacklist entry for an already-expired token entirely redundant. Deliberately setting the blacklist entry\'s own TTL to match the token\'s remaining lifetime means Redis automatically discards each entry the instant it becomes unnecessary, keeping the blacklist\'s total size bounded by however many tokens are CURRENTLY both blacklisted and still within their original validity window — typically a small, manageable number — rather than growing forever as more and more tokens are blacklisted over the lifetime of an application with no corresponding cleanup.

## Why Redis specifically, and why this must be a fast lookup

\`\`\`js
const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
// this check runs on EVERY authenticated request — it must be fast
\`\`\`

Following this course\'s caching lesson, the blacklist check runs as part of \`requireAuth\`, meaning it executes on literally every single authenticated request an application receives — this makes Redis (an in-memory store built specifically for extremely fast key-based lookups) a natural fit, since adding a slow lookup here would meaningfully degrade the response time of every authenticated route in the entire application, not just the logout route itself. This is structurally similar to the rate-limiting lesson\'s use of Redis for the same underlying reason: a piece of state that needs to be checked on nearly every request benefits enormously from living in a store optimized for fast reads, rather than adding a comparatively slower query against the primary relational database for this specific, high-frequency check.

## Logging out "all other devices": the same jti pattern, applied per session

\`\`\`js
// Track a jti per issued token in a lightweight table or Redis set per user,
// then blacklist every jti except the current one when a user chooses
// "log out of all other devices"
const otherSessionJtis = await getActiveSessionJtisExcept(userId, currentJti);
for (const jti of otherSessionJtis) {
  await redisClient.setEx(\`blacklist:\${jti}\`, remainingSecondsFor(jti), "1");
}
\`\`\`

A common real-world feature — "log out of all other devices," commonly offered in account security settings — is a direct extension of this exact same jti-blacklist mechanism: rather than blacklisting only the one token being actively used for the logout request, the application blacklists every OTHER currently-valid \`jti\` known to belong to that same user, leaving only the current session\'s own token untouched. This requires tracking which \`jti\` values are currently associated with a given user (commonly in a small database table or a Redis set updated at login), but the underlying revocation mechanism — blacklisting a specific token by its \`jti\`, until it would have expired anyway — remains exactly the same pattern this lesson introduces for the single-token case.`,

    contentHi: `## Ek token blacklist karna vs. poore user ko ban karna: do alag samasyaon ke liye do alag tools

\`\`\`
Sessions-vs-tokens lesson ka is_banned flag: is user ke paas jo bhi HAR
token hai use invalid karta hai, har device par, har jagah — sahi tool jab
POORE ACCOUNT ko poori tarah band karna chahiye (ek ban, ek compromise
hua account poori tarah lock ho raha).

Is lesson ka token blacklist: EK KHAAS token invalid karta hai — sahi tool
"is ek device se logout karo" ya "ye ek khaas token stolen hone ka shak
hai" ke liye, jabki wahi user doosre devices par jo bhi doosri valid
sessions rakhta hai wo poori tarah bina kisi rukaawat ke kaam karti rehti
hain.
\`\`\`

Is course ka pehle wala sessions-vs-tokens lesson ek juda par sach mein zyaada wyaapak samasya solve karta hai: ek user ka account ban hona un user ki HAR access ko invalid karna chahiye, har jagah, turant, jo \`is_banned\` database flag sahi tarike se haasil karta hai — us user se har request, chahe wo kisi bhi khaas token ya device se aaye, ek baar flag set hone ke baad reject hoti hai. Token blacklisting ek sankeern, alag samasya solve karta hai: ek khaas, akela token kaam karna band karna chahiye — kyunki wo khaas browser session logout hui, ya kyunki us ek khaas token ke expose hone ka shak hai — jabki wahi user jo bhi DOOSRA valid token rakhta hai (ek doosre device par ek session, ek alag browser) poori tarah normal taur par kaam karta rehna chahiye. In do tools ko mila dena ya to bahut zyaada wyaapak hoga (ek poore user ka account ban karna sirf isliye kyunki unhone ek device par "log out" click kiya) ya bahut sankeern (sirf ek user-level flag check karna jab ek khaas device ka token khaas taur par individual revocation maangta hai) — ye pehchaanna ki asal mein do samasyaon mein se kaunsi solve ho rahi hai tay karta hai kaunsa mechanism sahi fit hai.

## Blacklist entry ka TTL bilkul token ki apni baaki umar se kyun milna chahiye

\`\`\`js
// GALAT — hamesha ke liye blacklist karna matlab entry kabhi saaf nahi hoti, na-simit taur par badhti hui
await redisClient.set(\`blacklist:\${jti}\`, "1"); // bilkul koi TTL nahi

// SAHI — entry sirf utni der maujood hai jitni der token khud mumkin taur par valid ho sakta tha
const remainingSeconds = tokenExp - Math.floor(Date.now() / 1000);
await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
\`\`\`

Ek blacklist ki gayi token ki entry ko sirf utni der maujood hona chahiye jitni der underlying token khud apni \`expiresIn\` window ke andar rehta hai — ek baar token naisargik taur par expire ho jaaye, \`requireAuth\` ka apna expiry check (\`jwt.verify\`) pehle se use reject karta hai chahe wo blacklist mein ho ya na ho, ek pehle-se-expire-hue token ke liye ek blacklist entry ko poori tarah bemaani banaate hue. Jaan-boojhkar blacklist entry ki apni TTL ko token ki baaki umar se milaana matlab hai Redis har entry ko apne aap hataata hai jis pal ye zaruri hona band ho jaati hai, blacklist ki kul size ko utne tak seemit rakhte hue jitne tokens ABHI dono blacklisted hain aur abhi bhi apni asli validity window ke andar hain — aam taur par ek chhoti, sambhaalne-laayak tadaad — hamesha ke liye badhne ke bajaye jaise-jaise application ki umar mein zyaada se zyaada tokens blacklist hote hain koi barabar cleanup bina.

## Khaas taur par Redis kyun, aur ye ek tez lookup kyun hona chahiye

\`\`\`js
const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
// ye check HAR authenticated request ke hisse ki tarah chalta hai — ye tez hona chahiye
\`\`\`

Is course ke caching lesson ka palan karte hue, blacklist check \`requireAuth\` ke hisse ki tarah chalta hai, matlab ye literally ek application ko milti har akeli authenticated request par chalta hai — ye Redis (ek in-memory store jo khaas taur par bahut tez key-based lookups ke liye bana hai) ko ek naisargik fit banaata hai, kyunki yahan ek dheemi lookup jodna poori application mein har authenticated route ke response time ko maayne-rakhta taur par kharaab karega, sirf logout route ko nahi. Ye sanrachnaatmak taur par rate-limiting lesson ke Redis istemal karne jaisa hai bilkul usi underlying wajah se: sthiti ka ek tukda jise lagbhag har request par check karna chahiye tez reads ke liye optimize kiye ek store mein rehne se bahut faayda uthaata hai, is khaas, oonchi-frequency wali check ke liye asli relational database ke khilaaf ek taulnaatmak taur par dheemi query jodne ke bajaye.

## "Sab doosre devices se logout karo": wahi jti pattern, prati session lagu

\`\`\`js
// Ek halke table ya prati-user Redis set mein prati issue hue token ek jti track karo,
// phir ek user ke "sab doosre devices se logout karo" chunne par abhi wale ke bajaye
// har jti blacklist karo
const otherSessionJtis = await getActiveSessionJtisExcept(userId, currentJti);
for (const jti of otherSessionJtis) {
  await redisClient.setEx(\`blacklist:\${jti}\`, remainingSecondsFor(jti), "1");
}
\`\`\`

Ek aam asli-duniya feature — "sab doosre devices se logout karo," aam taur par account security settings mein diya jaata hai — bilkul isi jti-blacklist mechanism ka ek seedha vistaar hai: sirf logout request ke liye actively istemal ho rahe ek token ko blacklist karne ke bajaye, application usi user ka jo bhi doosra abhi-valid \`jti\` jaana jaata hai use blacklist karta hai, sirf abhi ki session ka apna token na chhue chhodte hue. Ise track karna chahiye ki kaunse \`jti\` values abhi ek diye user se jude hain (aam taur par ek chhote database table ya login par update hote ek Redis set mein), par underlying revocation mechanism — ek khaas token ko uske \`jti\` se blacklist karna, jab tak wo warna expire hota — bilkul wahi pattern rehta hai jise ye lesson akele-token case ke liye introduce karta hai.`,

    examples: [
      {
        title: 'Broken: client-side logout does nothing to a stolen copy of the same token',
        titleHi: 'Toota: client-side logout usi token ki ek stolen copy par kuch nahi karta',
        code: `function logout() {
  localStorage.removeItem("token");
}
// the actual JWT string remains valid until it naturally expires`,
        codeJs: `// Client
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

// Server — checks only signature and expiry
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}`,
        codeTs: `// Client
function logout(): void {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

// Server
function requireAuth(req: Request & { userId?: number }, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    req.userId = decoded.userId as number;
    next();
  });
}
// Correctly typed, completely valid TypeScript — the gap is entirely
// about the token itself never being told it was logged out, not a
// type or logic error.`,
        output: `A user logs out on their own device — that device correctly can no
longer make requests. A copy of the exact same token, obtained by
anyone before the logout, keeps working perfectly for the remainder of
its original expiresIn window.`,
        explain: 'requireAuth only ever checks the token\'s own signature and expiry — it has no concept of "this specific token was told to stop working early," so a stolen copy is indistinguishable from a legitimately still-active one.',
        explainHi: '\`requireAuth\` kabhi sirf token ke apne signature aur expiry check karta hai — iske paas "is khaas token ko jaldi kaam karna band karne ko kaha gaya" ka koi concept nahi hai, isliye ek stolen copy ek legitimate taur par abhi bhi active se alag-nahi-pehchaani-jaane-laayak hai.',
      },
      {
        title: 'Fixed: a jti-based blacklist checked on every authenticated request',
        titleHi: 'Theek: har authenticated request par check hua ek jti-based blacklist',
        code: `await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
// requireAuth now also checks: const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);`,
        codeJs: `const { v4: uuidv4 } = require("uuid");
const redisClient = require("redis").createClient();

// At login
const token = jwt.sign({ userId: user.id, jti: uuidv4() }, process.env.JWT_SECRET, { expiresIn: "1h" });

// On logout
app.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const remainingSeconds = req.tokenExp - Math.floor(Date.now() / 1000);
    await redisClient.setEx(\`blacklist:\${req.tokenJti}\`, remainingSeconds, "1");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

// requireAuth, updated
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) return res.status(401).json({ error: "Token has been revoked" });
    req.userId = decoded.userId;
    req.tokenJti = decoded.jti;
    req.tokenExp = decoded.exp;
    next();
  });
}`,
        codeTs: `import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
const redisClient = createClient();

interface AuthedRequest extends Request {
  userId?: number;
  tokenJti?: string;
  tokenExp?: number;
}

const token: string = jwt.sign(
  { userId: user.id, jti: uuidv4() },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);

app.post("/logout", requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const remainingSeconds = (req.tokenExp as number) - Math.floor(Date.now() / 1000);
    await redisClient.setEx(\`blacklist:\${req.tokenJti}\`, remainingSeconds, "1");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    const isBlacklisted = await redisClient.get(\`blacklist:\${decoded.jti}\`);
    if (isBlacklisted) {
      res.status(401).json({ error: "Token has been revoked" });
      return;
    }
    req.userId = decoded.userId as number;
    req.tokenJti = decoded.jti as string;
    req.tokenExp = decoded.exp as number;
    next();
  });
}`,
        outputJs: `After logout, the exact same token — even a stolen copy, even though
its signature and expiry are still perfectly valid — is now correctly
rejected with 401, because its specific jti is present in the
blacklist.`,
        outputTs: `// Identical behaviour. AuthedRequest carries tokenJti and tokenExp
// forward so the logout route has exactly what it needs to compute
// the correct blacklist TTL.`,
        explain: 'The blacklist check adds a third condition alongside signature and expiry — a token can be perfectly validly signed and unexpired and still be correctly rejected because it was specifically told to stop working early.',
        explainHi: 'Blacklist check signature aur expiry ke saath ek teesri sharton jodta hai — ek token bilkul validly signed aur na-expire-hua ho sakta hai aur phir bhi sahi tarike se reject ho sakta hai kyunki use khaas taur par jaldi kaam karna band karne ko kaha gaya tha.',
      },
      {
        title: 'The blacklist entry disappears naturally, requiring no manual cleanup',
        titleHi: 'Blacklist entry naisargik taur par gaayab ho jaati hai, koi manual cleanup zaruri nahi',
        code: `const remainingSeconds = tokenExp - Math.floor(Date.now() / 1000);
await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
// Redis automatically discards this key once remainingSeconds elapses`,
        codeJs: `// Token expires in 1 hour, logout happens 45 minutes in — only 15 minutes remain
const token = jwt.sign({ userId: user.id, jti }, process.env.JWT_SECRET, { expiresIn: "1h" });
// ...45 minutes later...
const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000); // ≈ 900 (15 minutes)
await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");`,
        codeTs: `const remainingSeconds: number = (decoded.exp as number) - Math.floor(Date.now() / 1000);
await redisClient.setEx(\`blacklist:\${decoded.jti as string}\`, remainingSeconds, "1");`,
        outputJs: `The blacklist entry exists in Redis for exactly 15 more minutes — the
same amount of time the token itself would have remained valid — then
Redis removes it automatically, with no cron job or manual cleanup
process required.`,
        outputTs: `// Identical behaviour. This is why the blacklist's total size stays
// bounded: it only ever holds entries for tokens that are both
// blacklisted AND still within their original validity window.`,
        explain: 'A blacklist entry for an already-expired token would be redundant anyway, since jwt.verify\'s own expiry check already rejects it — matching the TTL to the token\'s remaining lifetime avoids storing anything longer than necessary.',
        explainHi: 'Ek pehle-se-expire-hue token ke liye ek blacklist entry waise bhi bemaani hogi, kyunki \`jwt.verify\` ka apna expiry check use pehle se reject karta hai — TTL ko token ki baaki umar se milaana zarurat se zyaada der kuch bhi store karne se bachaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `localStorage.removeItem("token");
// the actual token remains cryptographically valid — a stolen copy keeps working`,
        right: `await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
// requireAuth checks the blacklist, correctly rejecting even a stolen copy`,
        why: 'Deleting a token client-side has no effect on the token string itself — anyone else holding a copy of that exact token can keep using it until it naturally expires, unless the server has a way to revoke that specific token.',
        whyHi: 'Ek token ko client-side delete karna token string khud par bilkul koi asar nahi karta — koi bhi doosra jiske paas us bilkul token ki copy hai use naisargik taur par expire hone tak istemal karta reh sakta hai, jab tak server ke paas us khaas token ko revoke karne ka koi tarika na ho.',
      },
      {
        wrong: `await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [userId]);
// banning the entire user just to log out one specific device`,
        right: `await redisClient.setEx(\`blacklist:\${thisDeviceJti}\`, remainingSeconds, "1");
// revoking only this one specific token, leaving other devices' sessions untouched`,
        why: 'Banning an entire user account invalidates every session on every device, which is far too broad a response for simply logging out of one specific device — a jti-based blacklist targets exactly the one token that needs to stop working.',
        whyHi: 'Ek poore user account ko ban karna har device par har session invalid karta hai, jo sirf ek khaas device se logout karne ke liye kaafi zyaada wyaapak jawaab hai — ek jti-based blacklist bilkul us ek token ko nishaana banaata hai jise kaam karna band karna chahiye.',
      },
      {
        wrong: `await redisClient.set(\`blacklist:\${jti}\`, "1"); // no TTL at all
// blacklist entries accumulate forever, with no automatic cleanup`,
        right: `const remainingSeconds = tokenExp - Math.floor(Date.now() / 1000);
await redisClient.setEx(\`blacklist:\${jti}\`, remainingSeconds, "1");
// the entry expires automatically once the token itself would have`,
        why: 'Without a TTL matching the token\'s own remaining lifetime, the blacklist grows unboundedly over the application\'s lifetime, since entries for already-expired tokens (which no longer need blacklisting at all) never get removed.',
        whyHi: 'Token ki apni baaki umar se milte TTL bina, blacklist application ki poori umar mein na-simit taur par badhti hai, kyunki pehle-se-expire-hue tokens ke liye entries (jinhe ab bilkul blacklisting ki zarurat nahi) kabhi hataayi nahi jaatin.',
      },
    ],

    realWorld: [
      {
        en: '**A "log out of all other devices" security feature, offered by nearly every major platform (Google, GitHub, banking apps), is a direct real-world application of exactly this jti-based blacklist mechanism**, extended to blacklist every session except the current one.',
        hi: '**"Sab doosre devices se logout karo" security feature, jo lagbhag har mukhya platform (Google, GitHub, banking apps) deta hai, bilkul isi jti-based blacklist mechanism ka ek seedha asli-duniya lagu hona hai**, current ke alaawa har session ko blacklist karne ke liye badhaaya gaya.',
      },
      {
        en: '**Storing a revocation list with a TTL matching each entry\'s natural expiry is a widely recognized pattern specifically for JWTs**, since it directly addresses JWTs\' well-known revocation limitation (covered in this course\'s sessions-vs-tokens lesson) without requiring the revocation list to grow forever.',
        hi: '**Ek revocation list ko ek TTL ke saath store karna jo har entry ki naisargik expiry se milta ho JWTs ke liye khaas taur par ek vyapak taur par pehchaana gaya pattern hai**, kyunki ye seedha JWTs ki achhi tarah jaani-pehchaani revocation seemaa (is course ke sessions-vs-tokens lesson mein cover hui) ko sambhaalta hai revocation list ko hamesha ke liye badhne ki maang kiye bina.',
      },
      {
        en: '**Redis is the overwhelmingly common choice for implementing exactly this kind of fast, TTL-based revocation check**, precisely because a slow lookup here would degrade the response time of every single authenticated request an application handles.',
        hi: '**Redis bilkul is kism ki tez, TTL-based revocation check lagu karne ke liye bahut aam choice hai**, theek isliye kyunki yahan ek dheemi lookup ek application ki har akeli authenticated request ke response time ko kharaab karega.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does deleting a JWT from the client (localStorage or a cookie) not actually revoke that token, and what real risk does this leave open?',
        qHi: '\'client (\`localStorage\` ya ek cookie) se ek JWT delete karna asal mein us token ko revoke kyun nahi karta, aur ye kaunsa asli khatra khula chhodta hai?',
        a: 'A JWT is, at its core, simply a string of characters that encodes a payload and a signature — deleting a copy of that string from one specific location (a particular browser\'s local storage, for instance) does absolutely nothing to the string itself, since the string\'s validity is determined entirely by whether its signature can be independently verified by the server, not by whether any particular copy of it happens to still exist somewhere. The server, when later verifying an incoming token, has no way to know or care where that specific string came from or whether the client that originally received it still possesses a copy — it simply checks whether the presented string is a genuinely, correctly signed, unexpired token, and that check passes or fails purely based on the string\'s own cryptographic properties, entirely independent of any deletion that may have happened on some client somewhere. This leaves open a genuine, meaningful risk: if a copy of a specific token was ever obtained by anyone else before the legitimate user deleted their own copy — through a cross-site scripting vulnerability that captured it, a shared or public computer where it was not fully cleared from browser storage, a compromised device, or any other means — that other copy remains just as fully valid and usable as it was before the deletion, for however long remains of the token\'s original expiration window, with the legitimate user\'s belief that they have "logged out" having no actual bearing on whether that other copy still works.',
        aHi: 'Ek JWT, apne mool mein, bas characters ki ek string hai jo ek payload aur ek signature encode karti hai — us string ki ek copy ko ek khaas jagah se delete karna (ek khaas browser ki local storage, misal ke taur par) us string khud par bilkul kuch nahi karta, kyunki string ki validity poori tarah is baat se tay hoti hai ki kya uska signature server dwara mustaqil taur par verify kiya jaa sakta hai, is baat se nahi ki uski koi khaas copy kahin abhi bhi maujood hai ya nahi. Server, baad mein ek aati token verify karte waqt, ye jaanne ya parwaah karne ka koi tarika nahi rakhta ki wo khaas string kahan se aayi ya kya client jise ye asal mein mili thi abhi bhi uski ek copy rakhta hai — ye bas check karta hai ki pesh ki gayi string sach mein, sahi tarike se signed, na-expire-hui token hai, aur wo check poori tarah string ke apne cryptographic properties ke aadhaar par paas ya fail hota hai, kisi bhi deletion se poori tarah mustaqil jo kahin kisi client par hua ho. Ye ek asli, maayne-rakhta khatra khula chhodta hai: agar ek khaas token ki ek copy kabhi kisi doosre ne paayi legitimate user ke apni copy delete karne se pehle — ek cross-site scripting vulnerability se jisne ise pakada, ek shared ya public computer se jahan ye browser storage se poori tarah saaf nahi hui, ek compromise hue device se, ya kisi bhi doosre tarike se — wo doosri copy utni hi poori tarah valid aur istemal-hone-laayak rehti hai jitni deletion se pehle thi, token ki asli expiration window ka jitna bhi bacha hai us waqt tak, legitimate user ki maanyata ki wo "logout" ho chuke hain isse koi asli farak nahi padta ki kya wo doosri copy abhi bhi kaam karti hai.',
      },
      {
        q: 'Why is a jti-based token blacklist a different, narrower solution than the is_banned user flag this course\'s sessions-vs-tokens lesson already covered?',
        qHi: 'Ek jti-based token blacklist is course ke sessions-vs-tokens lesson mein pehle cover hue \`is_banned\` user flag se ek alag, sankeern solution kyun hai?',
        a: 'The is_banned flag operates at the level of the USER as a whole — a single check against that one flag, performed for every incoming request regardless of which specific token presents it, correctly invalidates every single token that user holds, on every device, everywhere, the instant the flag is set. This is exactly the right granularity for a scenario where the entire account genuinely needs to be shut down — a ban, a compromised account being locked down completely — since the goal in that case is specifically to deny that user access everywhere, without exception. A jti-based blacklist operates at a fundamentally finer granularity: the level of one SPECIFIC, individual token, identified by its own unique jti value, entirely independent of any other token the same user might simultaneously hold. This is the right tool for a genuinely different goal: revoking access from one specific device or session (a user choosing to log out of their phone while remaining logged in on their laptop, or a specific token known to have been individually compromised) while deliberately leaving every OTHER token that same user holds completely unaffected. Using the user-level flag for this narrower goal would be far too blunt an instrument — it would incorrectly log the user out of every device, not just the one they intended, while using only a jti-based check for the broader ban scenario would require individually blacklisting every single token that specific user has ever been issued, an unnecessarily indirect way to achieve what a single user-level flag accomplishes directly and immediately.',
        aHi: '\`is_banned\` flag poore USER ke star par kaam karta hai — us ek flag ke khilaaf ek akela check, har aati request ke liye kiya gaya chahe koi bhi khaas token ise pesh kare, us user ke paas jo bhi HAR token hai use sahi tarike se invalid karta hai, har device par, har jagah, flag set hote hi. Ye bilkul sahi baariki hai ek aise scenario ke liye jahan poora account sach mein band hona chahiye — ek ban, ek compromise hua account poori tarah lock ho raha — kyunki us case mein lakshya khaas taur par us user ki access har jagah mana karna hai, koi apvaad bina. Ek jti-based blacklist buniyaadi taur par ek zyaada baarik star par kaam karta hai: ek KHAAS, akele token ka star, uski apni unique jti value se pehchaana gaya, wahi user kisi bhi doosre token ko ek saath rakh sakta hai us se poori tarah mustaqil. Ye ek sach mein alag lakshya ke liye sahi tool hai: ek khaas device ya session se access revoke karna (ek user apne phone se logout hona chunte hue apne laptop par login rehte hue, ya ek khaas token jise individually compromise hone ke liye jaana jaata hai) jabki jaan-boojhkar wahi user ke paas jo bhi DOOSRA token hai use poori tarah bekhabar chhodte hue. Is sankeern lakshya ke liye user-level flag istemal karna ek bahut hi bhonda tool hoga — ye galat tarike se user ko har device se logout kar dega, sirf unka iraada kiya hua nahi, jabki badhe ban scenario ke liye sirf ek jti-based check istemal karna us khaas user ko kabhi issue hue har akele token ko individually blacklist karne ki maang karega, ek na-zaruri taur par indirect tarika jo ek akela user-level flag seedha aur turant haasil karta hai.',
      },
      {
        q: 'Why should a blacklist entry\'s TTL be set to the token\'s remaining lifetime rather than a fixed value or no expiration at all?',
        qHi: 'Ek blacklist entry ka TTL token ki baaki umar se kyun set hona chahiye ek fixed value ya bilkul koi expiration ke bajaye?',
        a: 'A blacklist entry for a specific token only ever serves a purpose while that underlying token could still otherwise pass its own signature and expiry checks — once the token has naturally expired, jwt.verify itself already rejects it on that basis alone, making a blacklist entry for it entirely redundant from that point onward, since there is no longer any scenario in which the blacklist check would be the deciding factor. Setting the blacklist entry\'s TTL with no expiration at all means Redis retains that entry indefinitely, long after it has become functionally pointless, and doing this for every token ever blacklisted over an application\'s entire lifetime causes the blacklist\'s total size to grow without bound, consuming increasing memory for entries that provide no ongoing benefit. Using some other fixed TTL value (an arbitrary round number like 24 hours, say, regardless of the specific token\'s own actual expiration) risks either expiring the blacklist entry too early (if the token\'s own expiresIn happens to be longer than the fixed value, leaving a window where the entry is gone but the token itself would still otherwise be considered valid) or unnecessarily late (if the token\'s own window was much shorter than the fixed value, keeping a now-redundant entry around far longer than needed). Calculating the TTL specifically as however many seconds remain until that exact token\'s own expiration timestamp ensures the blacklist entry exists for precisely as long as it could possibly still be relevant, and disappears automatically the instant it stops being relevant — keeping the blacklist\'s total size naturally bounded by only the tokens that are both currently blacklisted and still within their own original validity window.',
        aHi: 'Ek khaas token ke liye ek blacklist entry sirf tab tak ek maqsad poori karti hai jab tak wo underlying token abhi bhi warna apne signature aur expiry checks paas kar sakta ho — ek baar token naisargik taur par expire ho jaaye, \`jwt.verify\` khud use bilkul isi aadhaar par pehle se reject karta hai, us pal se aage uske liye ek blacklist entry ko poori tarah bemaani banaate hue, kyunki ab koi aisi sthiti nahi hai jismein blacklist check faisla lene wala factor hoga. Blacklist entry ki TTL ko bilkul koi expiration bina set karna matlab hai Redis us entry ko hamesha ke liye rakhta hai, us se kaafi der baad jab ye functionally bekaar ho chuki, aur ek application ki poori umar mein kabhi bhi blacklist hue har token ke liye aisa karna blacklist ki kul size ko bina seemaa ke badhaata hai, un entries ke liye badhti memory istemal karte hue jo koi chalta faayda nahi deti. Koi doosra fixed TTL value istemal karna (ek manmaani gol sankhya jaisa 24 ghante, chahe khaas token ki apni asli expiration kuch bhi ho) ya to blacklist entry ko bahut jaldi expire karne ka khatra rakhta hai (agar token ka apna \`expiresIn\` fixed value se lamba samyog se ho, ek window chhodte hue jahan entry chali gayi hai par token khud abhi bhi warna valid maana jaata) ya na-zaruri taur par bahut der se (agar token ki apni window fixed value se kaafi chhoti thi, ab-bemaani entry ko zarurat se zyaada der rakhte hue). TTL ko khaas taur par utne seconds ki tarah calculate karna jitne us bilkul token ki apni expiration timestamp tak bache hain sunishchit karta hai ki blacklist entry bilkul utni der maujood hai jitni der wo mumkin taur par abhi bhi maayne-rakhta ho sakti thi, aur apne aap gaayab ho jaati hai jis pal ye maayne-rakhta hona band ho jaati hai — blacklist ki kul size ko naisargik taur par sirf un tokens tak seemit rakhte hue jo abhi dono blacklisted hain aur abhi bhi apni asli validity window ke andar hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken logout that only clears the client-side token. Log in, copy the exact token value, log out, then manually send a request using the copied token (via curl or Postman) and confirm it still succeeds.',
        taskHi: 'Toota logout banao jo sirf client-side token clear kare. Login karo, bilkul token value copy karo, logout karo, phir copy ki hui token istemal karke haath se ek request bhejo (\`curl\` ya Postman se) aur confirm karo ye abhi bhi safal hoti hai.',
        hint: 'Save the token to a scratch file right after logging in, so you have the exact string available to reuse manually after the "logout" happens.',
        hintHi: 'Login karte hi token ko ek scratch file mein save karo, taaki tumhaare paas "logout" hone ke baad haath se dobara istemal karne ke liye bilkul string upalabdh ho.',
      },
      {
        task: 'Add jti generation at login and the blacklist check in requireAuth. Repeat the same test — log in, copy the token, log out, then retry the copied token — and confirm it now correctly receives 401.',
        taskHi: 'Login par \`jti\` generation aur \`requireAuth\` mein blacklist check jodo. Wahi test dohraao — login karo, token copy karo, logout karo, phir copy ki hui token retry karo — aur confirm karo ise ab sahi tarike se \`401\` milta hai.',
        hint: 'Directly inspect the Redis key created on logout (using redis-cli GET and TTL commands) to confirm both the value and the remaining expiration time are what you expect.',
        hintHi: 'Logout par banaayi gayi Redis key seedha dekho (\`redis-cli\` ke \`GET\` aur \`TTL\` commands istemal karke) confirm karne ke liye ki value aur baaki expiration time dono wahi hain jo tum ummeed karte ho.',
      },
      {
        task: 'Log in twice as the same user (simulating two devices, two separate tokens with two separate jtis). Log out using only one of the two tokens, and confirm the OTHER token still works correctly afterward.',
        taskHi: 'Wahi user ki tarah do baar login karo (do devices simulate karte hue, do alag tokens do alag jtis ke saath). Sirf do mein se ek token istemal karke logout karo, aur confirm karo DOOSRA token uske baad abhi bhi sahi tarike se kaam karta hai.',
        hint: 'This exercise directly demonstrates the distinction from the is_banned approach — confirm the untouched token\'s requests succeed exactly as if nothing happened.',
        hintHi: 'Ye exercise seedha \`is_banned\` tarike se farak dikhaata hai — confirm karo na-chhue token ki requests bilkul waisi hi safal hoti hain jaise kuch hua hi na ho.',
      },
    ],

    keyTakeaways: [
      'Deleting a JWT client-side has no effect on the token string itself — anyone else holding a copy of that exact token can keep using it until it naturally expires, since the server never learns the token was "logged out."',
      'Giving every token a unique jti claim, and storing a specific jti in a fast store (Redis) on logout, lets requireAuth reject that one specific token even though its signature and expiry remain perfectly valid.',
      'Token blacklisting is narrower than the sessions-vs-tokens lesson\'s is_banned flag: blacklisting revokes ONE specific token; is_banned revokes every token a user holds, everywhere — different tools for different scopes of revocation.',
      'A blacklist entry\'s TTL should be set to exactly the token\'s own remaining lifetime, since a blacklist entry for an already-expired token is redundant (jwt.verify already rejects it) — this keeps the blacklist\'s size naturally bounded.',
      'The blacklist check runs on every authenticated request, making a fast, in-memory store like Redis the right fit — a slow lookup here would degrade every route\'s response time, not just the logout route.',
      '"Log out of all other devices" is the same jti-blacklist mechanism generalized: blacklisting every jti known to belong to a user except the current session\'s own token.',
    ],
    keyTakeawaysHi: [
      'Ek JWT ko client-side delete karna token string khud par bilkul koi asar nahi karta — koi bhi doosra jiske paas us bilkul token ki copy hai use naisargik taur par expire hone tak istemal karta reh sakta hai, kyunki server ko kabhi pata nahi chalta token "logout" hui thi.',
      'Har token ko ek unique \`jti\` claim dena, aur logout par ek khaas \`jti\` ko ek tez store (Redis) mein store karna, \`requireAuth\` ko us ek khaas token ko reject karne deta hai chahe uska signature aur expiry poori tarah valid rahen.',
      'Token blacklisting sessions-vs-tokens lesson wale \`is_banned\` flag se sankeern hai: blacklisting EK khaas token revoke karta hai; \`is_banned\` ek user ke paas jo bhi har token hai use har jagah revoke karta hai — revocation ke alag scopes ke liye alag tools.',
      'Ek blacklist entry ki TTL bilkul token ki apni baaki umar se set honi chahiye, kyunki ek pehle-se-expire-hue token ke liye ek blacklist entry bemaani hai (\`jwt.verify\` pehle se use reject karta hai) — ye blacklist ki size ko naisargik taur par seemit rakhta hai.',
      'Blacklist check har authenticated request par chalta hai, Redis jaise ek tez, in-memory store ko sahi fit banaate hue — yahan ek dheemi lookup har route ka response time kharaab karegi, sirf logout route ka nahi.',
      '"Sab doosre devices se logout karo" wahi jti-blacklist mechanism general kiya hua hai: ek user se jude jaane jaate har jti ko blacklist karna abhi ki session ke apne token ke alaawa.',
    ],
  },
];
