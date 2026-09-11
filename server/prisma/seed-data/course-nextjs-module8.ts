/**
 * Next.js Complete Course — Module 8: Authentication, lessons 1-3.
 *
 * Lesson 1: Sessions versus JWTs — the real trade-off, not just syntax.
 * Lesson 2: The credentials provider done safely (hashing, timing attacks).
 * Lesson 3: Middleware-based route protection and role-based access control.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_8: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-sessions-vs-jwt',
    title: 'Sessions vs JWTs — The Real Trade-Off',
    titleHi: 'Sessions vs JWTs — Real Trade-Off',
    description:
      "A session stores the actual login state on the server and hands the visitor only a lookup key; a JWT stores the login state inside the token itself, signed so it can't be forged. The real difference is where the source of truth lives, and that changes what you can and can't do — like instantly revoking access.",
    descriptionHi:
      'Ek session actual login state ko server pe store karta hai aur visitor ko sirf ek lookup key deta hai; ek JWT login state ko khud token ke andar store karta hai, signed taaki ise forge na kiya ja sake. Real farak ye hai ki source of truth kahan rehta hai, aur ye badalta hai ki aap kya kar sakte ho aur kya nahi — jaise instantly access revoke karna.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A coat-check ticket versus a sealed, tamper-proof passport you carry yourself.** A coat-check ticket is just a number — the actual coat (the real data) stays with the coat-check desk, and the desk can refuse to honor a ticket at any moment, for any reason, instantly. A sealed passport carries all your identity details printed directly on it, verifiable by anyone with the right tools to check the seal, without ever calling back to the office that issued it — but if that office decides to revoke your passport, every copy of it still says exactly what it always said, until it physically expires. Sessions are the coat-check ticket; JWTs are the sealed passport.",
      hi: 'Ek coat-check ticket versus ek sealed, tamper-proof passport jo aap khud carry karte ho. Ek coat-check ticket bas ek number hai — actual coat (real data) coat-check desk ke paas rehta hai, aur desk kisi bhi moment, kisi bhi reason se, ek ticket ko honor karne se instantly mana kar sakta hai. Ek sealed passport aapke saare identity details directly usme print kiye hote hain, verifiable kisi ke bhi dwara jiske paas seal check karne ke sahi tools hon, us office ko wapas call kiye bina jisne ise issue kiya. Par agar wo office decide kare aapka passport revoke karne ka, uski har copy abhi bhi exactly wahi kehti hai jo wo hamesha kehti thi, jab tak ye physically expire nahi hoti. Sessions coat-check ticket hain; JWTs sealed passport hain.',
    },

    simple: `**Session-based auth: the server holds the truth, the browser holds a
pointer to it:**

\`\`\`
Login  ->  server creates a session record in a database/store
           ("session abc123 belongs to user 42, expires in 7 days")
        -> browser gets a cookie containing ONLY "abc123"

Every request -> server looks up "abc123" in the session store
              -> finds "belongs to user 42" -> request is authenticated
\`\`\`

**JWT-based auth: the token itself carries the truth, cryptographically
signed so it can't be tampered with:**

\`\`\`
Login  ->  server creates a JWT containing { userId: 42, exp: ... },
           signs it with a secret key
        -> browser gets that entire signed token (often in a cookie)

Every request -> server verifies the SIGNATURE (fast, no database lookup)
              -> if valid, trusts the { userId: 42 } claims INSIDE the token
\`\`\`

**The trade-off that actually matters — instant revocation:**

\`\`\`
Session: "log this user out everywhere, right now" -> delete their
         session record from the store -> every request using that
         session ID is immediately rejected. Trivial, instant.

JWT:     "log this user out everywhere, right now" -> the token is
         still cryptographically VALID until it naturally expires —
         there's no database record to delete, because the token
         carries its own truth. Real solutions exist (a short expiry +
         refresh tokens, or a server-side blocklist that partially
         reintroduces a database lookup) but none is as simple as a
         session's instant delete.
\`\`\`

**The rule this leads to:** sessions are usually the right default for a
typical web app where instant revocation (banning a user, a "log out all
devices" button, immediately reflecting a permission change) matters.
JWTs earn their complexity specifically when you need stateless
verification across services that shouldn't all share one database — a
microservices architecture, or an API consumed by many independent
clients, where avoiding a database round-trip per request is a genuine win.`,

    simpleHi: `**Session-based auth: server truth hold karta hai, browser uski taraf
ek pointer hold karta hai:**

\`\`\`
Login  ->  server ek session record banata hai ek database/store mein
           ("session abc123 belongs to user 42, expires in 7 days")
        -> browser ko ek cookie milta hai jisme SIRF "abc123" hai

Har request -> server "abc123" ko session store mein lookup karta hai
            -> "belongs to user 42" find karta hai -> request authenticated hai
\`\`\`

**JWT-based auth: token khud truth carry karta hai, cryptographically
signed taaki ise tamper na kiya ja sake:**

\`\`\`
Login  ->  server ek JWT banata hai jisme { userId: 42, exp: ... } hai,
           ise ek secret key se sign karta hai
        -> browser ko wo poora signed token milta hai (aksar ek cookie mein)

Har request -> server SIGNATURE verify karta hai (fast, koi database lookup nahi)
            -> agar valid hai, { userId: 42 } claims ko token ke ANDAR trust karta hai
\`\`\`

**Trade-off jo actually matter karta hai — instant revocation:**

\`\`\`
Session: "is user ko har jagah se abhi logout karo" -> unka session
         record store se delete karo -> us session ID ko use karne
         wali har request immediately reject ho jaati hai. Trivial, instant.

JWT:     "is user ko har jagah se abhi logout karo" -> token abhi bhi
         cryptographically VALID hai jab tak ye naturally expire nahi
         hota — koi database record delete karne ke liye nahi hai,
         kyunki token apni khud ki truth carry karta hai. Real solutions
         exist karte hain (ek short expiry + refresh tokens, ya ek
         server-side blocklist jo partially ek database lookup wapas
         introduce karta hai) par koi bhi ek session ke instant delete
         jitna simple nahi hai.
\`\`\`

**Rule jo isse nikalta hai:** sessions usually ek typical web app ke liye
sahi default hain jahan instant revocation (ek user ko ban karna, ek "log
out all devices" button, ek permission change ko immediately reflect
karna) matter karta hai. JWTs apni complexity earn karte hain specifically
jab aapko stateless verification chahiye kai services ke across jinhe ek
database share nahi karna chahiye — ek microservices architecture, ya ek
API jise kai independent clients consume karte hain, jahan per-request ek
database round-trip avoid karna ek genuine win hai.`,

    content: `## Why "which is more secure" is the wrong question

Both mechanisms can be implemented securely or insecurely — a session
cookie without proper flags (httpOnly, secure, sameSite) is just as
vulnerable to theft as a JWT stored somewhere JavaScript can read it. The
meaningful comparison isn't security in the abstract; it's the operational
trade-off around where the source of truth lives, which determines what's
easy versus hard to do later.

## What a session actually needs to work

A session requires a shared store (a database, or an in-memory store like
Redis) that every server instance handling requests can read from. This
is trivial for a single server, and requires a shared, fast data store
(Redis is the common choice) once an app runs across multiple server
instances — but it was never something a JWT needs, since a JWT can be
verified independently by any server holding the signing secret, with no
shared store at all.

## Why revocation is genuinely hard for JWTs, not just annoying

A JWT's whole value proposition is that a server can verify it without
calling back to wherever it was issued — that's precisely what makes
instant revocation structurally difficult. The moment you introduce a
blocklist that every verification must check, you've reintroduced the
shared-store lookup a JWT was meant to avoid, which raises a fair question
about whether a session would have been simpler for that use case in the
first place. The usual practical compromise is a SHORT-lived JWT (minutes)
paired with a longer-lived refresh token that IS checked against a
database — this bounds how long a "revoked" JWT can still be used to
roughly the access token's short lifetime.

## When JWTs genuinely win

A JWT's independent verifiability is a real advantage when multiple
separate services (possibly owned by different teams, or even different
companies, as in third-party API access) need to verify a user's identity
without all sharing access to one central session store. This is the
actual scenario JWTs were designed for — not "logging a user into your own
single web app," which sessions handle just as well with far less
operational complexity.

## Auth.js's actual default, and why

Auth.js (NextAuth) v5 supports both strategies, but defaults to
database-backed sessions specifically because most Next.js apps are a
single application (not a constellation of independently-verifying
services), and the operational simplicity of instant revocation usually
outweighs the marginal cost of a database lookup per request.`,

    contentHi: `## "Kaunsa zyada secure hai" galat sawaal kyun hai

Dono mechanisms securely ya insecurely implement kiye ja sakte hain — ek
session cookie proper flags (httpOnly, secure, sameSite) ke bina utni hi
theft ke liye vulnerable hai jitna ek JWT kahin stored jahan JavaScript
padh sake. Meaningful comparison abstract mein security nahi hai; ye us
operational trade-off ke baare mein hai jo iske around hai ki source of
truth kahan rehta hai, jo determine karta hai ki baad mein kya aasan hai
versus kya mushkil hai.

## Ek session ko actually kaam karne ke liye kya chahiye

Ek session ko ek shared store chahiye (ek database, ya ek in-memory store
jaise Redis) jise har server instance jo requests handle karta hai padh
sake. Ye ek single server ke liye trivial hai, aur ek shared, fast data
store (Redis common choice hai) chahiye jab ek app kai server instances ke
across chalta hai — par ye kabhi aisi cheez nahi thi jo ek JWT ko chahiye,
kyunki ek JWT ko koi bhi server independently verify kar sakta hai jo
signing secret rakhta hai, bina kisi shared store ke.

## Revocation JWTs ke liye genuinely mushkil kyun hai, sirf annoying nahi

Ek JWT ka poora value proposition ye hai ki ek server ise wapas call kiye
bina verify kar sakta hai jahan bhi ye issue hua tha — yahi precisely wo
cheez hai jo instant revocation ko structurally mushkil banati hai. Jis
moment aap ek blocklist introduce karte ho jise har verification check
kare, aapne wahi shared-store lookup wapas introduce kar diya jise ek JWT
avoid karne ke liye tha, jo ek fair sawaal uthata hai ki kya us use case
ke liye pehli jagah ek session simpler hota. Usual practical compromise ek
SHORT-lived JWT (minutes) hai jo ek longer-lived refresh token ke saath
paired hai jo database ke against check hota HAI — ye bound karta hai ki
ek "revoked" JWT roughly kitni der tak abhi bhi use ho sakta hai — access
token ki short lifetime jitna.

## JWTs genuinely kab win karte hain

Ek JWT ki independent verifiability ek real advantage hai jab kai separate
services (shayad alag teams ke owned, ya even alag companies, jaise
third-party API access mein) ek user ki identity verify karni chahiye bina
sab ek central session store tak access share kiye. Ye wahi actual
scenario hai jiske liye JWTs design kiye gaye the — "ek user ko aapke khud
ke single web app mein login karwana" nahi, jise sessions kaafi kam
operational complexity ke saath equally achhe se handle karte hain.

## Auth.js ka actual default, aur kyun

Auth.js (NextAuth) v5 dono strategies support karta hai, par
database-backed sessions ko default karta hai specifically kyunki
zyadatar Next.js apps ek single application hain (independently-verifying
services ka ek constellation nahi), aur instant revocation ki operational
simplicity usually per-request ek database lookup ki marginal cost se
zyada matter karti hai.`,

    examples: [
      {
        title: 'A session-based check versus a JWT-based check, side by side',
        titleHi: 'Ek session-based check versus ek JWT-based check, saath saath',
        codeJs: `// Session-based: the token is meaningless without the server's own record
async function getSessionUser(sessionId) {
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session || session.expiresAt < new Date()) return null;
  return db.user.findUnique({ where: { id: session.userId } });
}
// Revoking access: just delete the session row — done, instantly.
async function revokeSession(sessionId) {
  await db.session.delete({ where: { id: sessionId } });
}

// JWT-based: the token carries its own claims, verified by signature alone
import jwt from 'jsonwebtoken';

function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: payload.userId }; // no database lookup needed at all
  } catch {
    return null; // invalid signature or expired
  }
}
// Revoking access before natural expiry genuinely requires extra
// infrastructure (a blocklist checked on every verification) — there is
// no single row to delete that instantly invalidates the token.`,
        codeTs: `// Session-based: the token is meaningless without the server's own record
async function getSessionUser(sessionId: string) {
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session || session.expiresAt < new Date()) return null;
  return db.user.findUnique({ where: { id: session.userId } });
}
// Revoking access: just delete the session row — done, instantly.
async function revokeSession(sessionId: string) {
  await db.session.delete({ where: { id: sessionId } });
}

// JWT-based: the token carries its own claims, verified by signature alone
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

function getUserFromToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { userId: payload.userId }; // no database lookup needed at all
  } catch {
    return null; // invalid signature or expired
  }
}
// Revoking access before natural expiry genuinely requires extra
// infrastructure (a blocklist checked on every verification) — there is
// no single row to delete that instantly invalidates the token.`,
        code: `async function revokeSession(sessionId) {
  await db.session.delete({ where: { id: sessionId } }); // instant, done
}
function getUserFromToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET); // no revocation hook
  return { userId: payload.userId };
}`,
        output:
          "revokeSession makes the session id immediately useless for every future request. getUserFromToken has no equivalent instant-revoke operation at all — the JWT stays valid, by design, until it naturally expires.",
        explain:
          "The asymmetry is structural, not a missing feature: a session's authority lives in a row you can delete; a JWT's authority lives in a signature you cannot retroactively un-sign. Any 'revoke a JWT' solution has to work around this by reintroducing some form of server-side check.",
        explainHi:
          "Asymmetry structural hai, koi missing feature nahi: ek session ki authority ek row mein rehti hai jise aap delete kar sakte ho; ek JWT ki authority ek signature mein rehti hai jise aap retroactively un-sign nahi kar sakte. Koi bhi 'JWT revoke karo' solution ise kisi form ke server-side check ko reintroduce karke work around karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Choosing JWTs "because they're stateless and modern" for a typical single web app
// ...then discovering there's no simple way to implement "log out all devices"
// or "immediately ban this user" without adding a database-backed blocklist
// anyway — at which point most of the supposed statelessness benefit is gone.`,
        right: `// Choosing sessions for a typical single web app where instant revocation
// (banning, forced logout, immediate permission changes) is a real requirement
// — and reaching for JWTs specifically when multiple independent services
// need to verify identity without sharing one central session store.`,
        why: "Picking JWTs by default, without the actual multi-service use case that justifies them, often means rebuilding the revocation mechanism sessions provide for free — but with more moving parts (a blocklist, refresh token rotation) than a session ever required.",
        whyHi:
          "Default se JWTs choose karna, un actual multi-service use case ke bina jo unhe justify karta hai, aksar matlab hai wo revocation mechanism rebuild karna jo sessions free mein dete hain — par zyada moving parts ke saath (ek blocklist, refresh token rotation) jitne ek session ko kabhi chahiye the.",
      },
    ],

    realWorld: [
      {
        en: "A typical SaaS product with one web app and one database uses database-backed sessions (Auth.js's default) specifically because 'ban this user immediately' and 'sign out all my devices' need to work with a single, simple operation. A company exposing a public API consumed by many third-party developers uses JWTs instead, because those developers' servers can't practically share a session store with the API provider.",
        hi: 'Ek typical SaaS product jisme ek web app aur ek database hai database-backed sessions use karta hai (Auth.js ka default) specifically kyunki \'is user ko abhi ban karo\' aur \'meri saari devices sign out karo\' ko ek single, simple operation ke saath kaam karna chahiye. Ek company jo ek public API expose karti hai jise kai third-party developers consume karte hain uske bajaye JWTs use karti hai, kyunki un developers ke servers practically API provider ke saath ek session store share nahi kar sakte.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental difference between a session and a JWT?',
        qHi: 'Ek session aur ek JWT ke beech fundamental difference kya hai?',
        a: "A session stores the actual authentication state server-side and hands the client only a lookup key; the server must check the key against its own store on every request. A JWT stores the authentication state inside the token itself, cryptographically signed, so a server can verify it without any lookup against a shared store.",
        aHi: 'Ek session actual authentication state ko server-side store karta hai aur client ko sirf ek lookup key deta hai; server ko har request pe key ko apne khud ke store ke against check karna padta hai. Ek JWT authentication state ko khud token ke andar store karta hai, cryptographically signed, taaki ek server ise bina kisi shared store ke against lookup ke verify kar sake.',
      },
      {
        q: "Why is instant revocation structurally harder with JWTs than with sessions?",
        qHi: 'JWTs ke saath instant revocation structurally sessions se zyada mushkil kyun hai?',
        a: "A session's authority lives in a database row, which can simply be deleted to instantly invalidate it. A JWT's authority lives in its cryptographic signature, which remains valid until natural expiry — there's no row to delete, so revoking it early requires additional infrastructure like a server-side blocklist, which partially reintroduces the database lookup JWTs were meant to avoid.",
        aHi: 'Ek session ki authority ek database row mein rehti hai, jise instantly invalidate karne ke liye simply delete kiya ja sakta hai. Ek JWT ki authority uske cryptographic signature mein rehti hai, jo natural expiry tak valid rehta hai — delete karne ke liye koi row nahi hai, isliye ise jaldi revoke karne ke liye additional infrastructure chahiye jaise ek server-side blocklist, jo partially wahi database lookup reintroduce karta hai jise JWTs avoid karne ke liye the.',
      },
    ],

    exercises: [
      {
        task: "A company is building a single internal admin dashboard used only by its own employees. Another company is building a public API that hundreds of independent third-party apps will authenticate against. Decide which one should default to sessions and which to JWTs, and justify each choice.",
        taskHi: 'Ek company ek single internal admin dashboard bana rahi hai jise sirf uske apne employees use karte hain. Ek doosri company ek public API bana rahi hai jise saikdon independent third-party apps authenticate karenge. Decide karo kaunse ko sessions default karna chahiye aur kaunse ko JWTs, aur har choice justify karo.',
        hint: "Consider whether the verifying party in each scenario can practically share a central session store with whoever issues the credential.",
        hintHi: 'Socho ki kya har scenario mein verifying party practically ek central session store share kar sakti hai us se jo credential issue karta hai.',
      },
    ],

    keyTakeaways: [
      "A session keeps the authentication state server-side, giving the client only a lookup key; a JWT embeds the state in the token itself, verified by cryptographic signature rather than a database lookup.",
      "The core operational trade-off is instant revocation: a session can be invalidated by deleting one database row; a JWT remains valid until natural expiry unless extra infrastructure (a blocklist, short-lived tokens with refresh) is added.",
      'Sessions are the right default for a typical single web app where instant revocation matters; JWTs earn their complexity when multiple independent services need to verify identity without sharing a central session store.',
      "Neither mechanism is inherently more secure than the other — both require correct implementation (proper cookie flags for sessions, correct signature verification and expiry handling for JWTs) to be safe.",
    ],
    keyTakeawaysHi: [
      'Ek session authentication state ko server-side rakhta hai, client ko sirf ek lookup key deta hai; ek JWT state ko khud token mein embed karta hai, ek database lookup ke bajaye cryptographic signature se verified.',
      'Core operational trade-off instant revocation hai: ek session ko ek database row delete karke invalidate kiya ja sakta hai; ek JWT natural expiry tak valid rehta hai jab tak extra infrastructure (ek blocklist, refresh ke saath short-lived tokens) add na ho.',
      'Sessions ek typical single web app ke liye sahi default hain jahan instant revocation matter karta hai; JWTs apni complexity earn karte hain jab kai independent services ko ek central session store share kiye bina identity verify karni ho.',
      'Koi bhi mechanism doosre se inherently zyada secure nahi hai — dono ko correct implementation chahiye (sessions ke liye proper cookie flags, JWTs ke liye correct signature verification aur expiry handling) safe hone ke liye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-credentials-auth-safely',
    title: 'The Credentials Provider, Done Safely',
    titleHi: 'Credentials Provider, Safely Kiya Gaya',
    description:
      "Accepting an email and password directly (rather than delegating to Google/GitHub OAuth) means you're responsible for storing passwords safely and comparing them without leaking information through response timing — both are well-understood problems with well-understood fixes, but only if you know to apply them.",
    descriptionHi:
      'Directly ek email aur password accept karna (Google/GitHub OAuth ko delegate karne ke bajaye) matlab hai aap passwords ko safely store karne aur unhe response timing ke through information leak kiye bina compare karne ke liye responsible ho — dono well-understood problems hain well-understood fixes ke saath, par sirf tab agar aapko unhe apply karna pata ho.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A bank vault's combination stored as an actual, readable note versus a one-way meat grinder that only tells you if two things produced the exact same result.** Storing a password in plain text is like writing the vault combination on a sticky note anyone with access to the note can read directly. Password hashing is a meat grinder: you can put a password in and get ground meat out, but there's no way to run the process backward from the ground meat to recover the original password. To check a login attempt, you don't un-grind the stored meat — you grind the ATTEMPT the same way and check if the two piles of ground meat match.",
      hi: 'Ek bank vault ka combination ek actual, readable note ki tarah stored versus ek one-way meat grinder jo sirf ye batata hai ki kya do cheezon ne exact wahi result produce kiya. Ek password ko plain text mein store karna vault combination ko ek sticky note pe likhne jaisa hai jise note tak access wala koi bhi directly padh sakta hai. Password hashing ek meat grinder hai: aap ek password daal sakte ho aur ground meat nikaal sakte ho, par is process ko backward chalane ka koi tareeka nahi hai ground meat se original password recover karne ke liye. Ek login attempt check karne ke liye, aap stored meat ko un-grind nahi karte — aap ATTEMPT ko wahi tarike se grind karte ho aur check karte ho ki kya do ground meat ke piles match karte hain.',
    },

    simple: `**Never store a password itself — store a one-way HASH of it:**

\`\`\`ts
import bcrypt from 'bcrypt';

// At signup: hash the password before storing it. NEVER store the raw password.
async function signup(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12); // 12 = cost factor
  await db.user.create({ data: { email, passwordHash } });
}

// At login: hash the ATTEMPT and compare hashes — never decrypt the stored one
async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
\`\`\`

**Why \`bcrypt.compare\` matters specifically — the timing attack it
prevents:**

\`\`\`ts
// WRONG: a naive string comparison can leak information through timing
if (password === storedPassword) { /* ... */ }
// Comparing character-by-character can return "not equal" faster for a
// wrong first character than for a correct first character + wrong
// second — an attacker measuring response time, many attempts, can
// theoretically infer the password one character at a time.

// bcrypt.compare (and similar constant-time comparison functions) takes
// the SAME amount of time regardless of how much of the input matches —
// there's no timing signal to extract.
\`\`\`

**Why a login endpoint should give the same response for "wrong password"
and "no such user":**

\`\`\`ts
// WRONG: different responses reveal which emails have accounts at all
if (!user) return { error: 'No account with this email' };
if (!valid) return { error: 'Incorrect password' };

// RIGHT: identical response either way — doesn't reveal account existence
if (!user || !valid) return { error: 'Invalid email or password' };
\`\`\`

**The rule underlying all three fixes:** every one of them closes off a
way for an attacker to extract information through something OTHER than
"correctly guessing the password" — timing, or response content
differences. Password authentication is safe only when the attacker's
sole option is guessing, with no side channel to narrow the search.`,

    simpleHi: `**Password khud ko kabhi store mat karo — uska ek one-way HASH store
karo:**

\`\`\`ts
import bcrypt from 'bcrypt';

// Signup pe: password ko store karne se pehle hash karo. Raw password KABHI store mat karo.
async function signup(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12); // 12 = cost factor
  await db.user.create({ data: { email, passwordHash } });
}

// Login pe: ATTEMPT ko hash karo aur hashes compare karo — stored wale ko kabhi decrypt mat karo
async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
\`\`\`

**\`bcrypt.compare\` specifically kyun matter karta hai — jo timing attack
ye prevent karta hai:**

\`\`\`ts
// GALAT: ek naive string comparison timing ke through information leak kar sakta hai
if (password === storedPassword) { /* ... */ }
// Character-by-character compare karna ek galat first character ke liye
// ek correct first character + galat second se "not equal" faster return
// kar sakta hai — ek attacker jo response time measure karta hai, kai
// attempts, theoretically password ko ek time pe ek character infer kar
// sakta hai.

// bcrypt.compare (aur similar constant-time comparison functions) input
// ka kitna hissa match karta hai usse independent SAME amount of time
// leta hai — extract karne ke liye koi timing signal nahi hai.
\`\`\`

**Ek login endpoint ko "galat password" aur "aisa koi user nahi hai" ke
liye wahi response kyun dena chahiye:**

\`\`\`ts
// GALAT: alag responses reveal karte hain ki kaunse emails ke paas accounts hain
if (!user) return { error: 'No account with this email' };
if (!valid) return { error: 'Incorrect password' };

// SAHI: dono tarike se identical response — account existence reveal nahi karta
if (!user || !valid) return { error: 'Invalid email or password' };
\`\`\`

**Rule jo teenon fixes ke underlying hai:** har ek unme se ek attacker ke
liye ek tareeka band karta hai information extract karne ka kisi aisi
cheez se jo "password ko correctly guess karna" ke ALAWA hai — timing, ya
response content differences. Password authentication tabhi safe hai jab
attacker ka sole option guessing ho, koi side channel na ho search ko
narrow karne ke liye.`,

    content: `## Why hashing must be one-way, and why bcrypt specifically

Hashing algorithms designed for passwords (bcrypt, argon2, scrypt) are
deliberately SLOW and deliberately impossible to reverse — you can only
verify a guess by hashing it and comparing, never recover the original
password from the hash. The deliberate slowness (bcrypt's "cost factor,"
the \`12\` in the example) matters because it makes brute-forcing many
guesses against a stolen hash database expensive; a fast, general-purpose
hash like SHA-256, while also one-way, is designed to be FAST, which is
exactly the wrong property for password storage — it makes brute-forcing
millions of guesses per second against a leaked hash database feasible.

## The timing attack, more precisely

A naive equality check on strings (or byte arrays) typically returns as
soon as it finds a mismatched character — meaning a comparison that
matches the first 3 characters before failing takes measurably longer
than one that fails on the very first character. An attacker who can send
many requests and measure response time precisely enough can, in
principle, narrow down a secret one character at a time. \`bcrypt.compare\`
(and dedicated constant-time comparison functions generally) are written
to take the same amount of time regardless of where or whether a mismatch
occurs, eliminating this signal.

## Why user enumeration matters even without a stolen password

Revealing "this email has an account" versus "this email does not" via
different error messages doesn't leak the password itself, but it leaks
something real: which email addresses are registered users of your
service at all. This is called user enumeration, and it matters because
it lets an attacker build a targeted list of valid accounts to attack
elsewhere (password-spraying attacks, phishing campaigns aimed
specifically at confirmed users) — a small leak that meaningfully narrows
an attacker's search space.

## Rate limiting belongs here too, briefly

None of hashing, constant-time comparison, or identical error messages
prevents an attacker from simply trying many passwords against one known
account. That's a separate, necessary layer — rate limiting login attempts
— covered in depth in Module 13's API security hardening, but worth
naming here as the fourth piece of a genuinely safe credentials flow,
alongside the three covered in this lesson.`,

    contentHi: `## Hashing one-way kyun hona chahiye, aur bcrypt specifically kyun

Passwords ke liye design kiye gaye hashing algorithms (bcrypt, argon2,
scrypt) deliberately SLOW hain aur deliberately reverse karna impossible
hain — aap ek guess ko sirf ise hash karke aur compare karke verify kar
sakte ho, hash se original password kabhi recover nahi kar sakte.
Deliberate slowness (bcrypt ka "cost factor," example mein \`12\`) matter
karta hai kyunki ye ek stolen hash database ke against kai guesses
brute-force karna expensive banata hai; ek fast, general-purpose hash
jaise SHA-256, bhi one-way hote hue, FAST hone ke liye design kiya gaya
hai, jo password storage ke liye exactly galat property hai — ye ek leaked
hash database ke against per second millions guesses brute-force karna
feasible banata hai.

## Timing attack, zyada precisely

Strings (ya byte arrays) pe ek naive equality check typically return hota
hai jaise hi ye ek mismatched character find karta hai — matlab ek
comparison jo fail hone se pehle pehle 3 characters match karta hai us se
zyada time leta hai jo bilkul pehle character pe fail hota hai. Ek
attacker jo kai requests bhej sakta hai aur response time itni precisely
measure kar sakta hai, principle mein, ek secret ko ek time pe ek
character narrow down kar sakta hai. \`bcrypt.compare\` (aur generally
dedicated constant-time comparison functions) is tarah likhe jaate hain
ki wo wahi amount of time lein chahe mismatch kahin ho ya bilkul na ho, is
signal ko eliminate karte hue.

## User enumeration ek stolen password ke bina bhi kyun matter karta hai

"Ye email ke paas ek account hai" versus "ye email ke paas nahi hai" alag
error messages se reveal karna khud password leak nahi karta, par ye kuch
real leak karta hai: kaunse email addresses aapki service ke registered
users hain bilkul. Ise user enumeration kehte hain, aur ye matter karta hai
kyunki ye ek attacker ko valid accounts ki ek targeted list build karne
deta hai kahin aur attack karne ke liye (password-spraying attacks,
phishing campaigns specifically confirmed users ke liye aimed) — ek chhota
leak jo meaningfully ek attacker ki search space narrow karta hai.

## Rate limiting bhi yahan belong karta hai, briefly

Hashing, constant-time comparison, ya identical error messages mein se
koi bhi ek attacker ko ek known account ke against simply kai passwords
try karne se nahi rokta. Ye ek separate, necessary layer hai — login
attempts ko rate limit karna — jo Module 13 ki API security hardening mein
depth mein cover hoga, par yahan naam lene layak hai ek genuinely safe
credentials flow ke fourth piece ki tarah, is lesson mein cover kiye gaye
teenon ke saath.`,

    examples: [
      {
        title: 'A safe credentials auth flow with Auth.js',
        titleHi: 'Auth.js ke saath ek safe credentials auth flow',
        codeJs: `// auth.config.js
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authConfig = {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // Compare hashes with bcrypt regardless of whether user exists,
        // using a dummy hash if not — keeps timing consistent either way
        const passwordHash = user?.passwordHash ?? DUMMY_HASH_FOR_TIMING;
        const valid = await bcrypt.compare(credentials.password, passwordHash);

        if (!user || !valid) return null; // identical outcome, no distinction
        return { id: user.id, email: user.email };
      },
    }),
  ],
};

// app/signup/actions.js
'use server';
export async function signup(email, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({ data: { email, passwordHash } });
}`,
        codeTs: `// auth.config.ts
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authConfig = {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Compare hashes with bcrypt regardless of whether user exists,
        // using a dummy hash if not — keeps timing consistent either way
        const passwordHash = user?.passwordHash ?? DUMMY_HASH_FOR_TIMING;
        const valid = await bcrypt.compare(credentials.password as string, passwordHash);

        if (!user || !valid) return null; // identical outcome, no distinction
        return { id: user.id, email: user.email };
      },
    }),
  ],
};

// app/signup/actions.ts
'use server';
export async function signup(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({ data: { email, passwordHash } });
}`,
        code: `async authorize(credentials) {
  const user = await db.user.findUnique({ where: { email: credentials.email } });
  const passwordHash = user?.passwordHash ?? DUMMY_HASH_FOR_TIMING;
  const valid = await bcrypt.compare(credentials.password, passwordHash);
  if (!user || !valid) return null;
  return { id: user.id, email: user.email };
}`,
        output:
          "A login attempt for a non-existent email still runs a full bcrypt.compare against a dummy hash, taking roughly the same time as a real user's failed password check — an attacker measuring response time can't distinguish 'no such account' from 'wrong password.'",
        explain:
          "Using a DUMMY_HASH_FOR_TIMING when no user is found means bcrypt.compare always runs, keeping the response time consistent whether or not the email exists — without this, a missing user would return near-instantly (no bcrypt call at all), which itself leaks account existence through timing.",
        explainHi:
          "Jab koi user na mile to DUMMY_HASH_FOR_TIMING use karna matlab hai bcrypt.compare hamesha chalta hai, response time consistent rakhte hue chahe email exist kare ya nahi — is ke bina, ek missing user near-instantly return hota (bilkul koi bcrypt call nahi), jo khud timing ke through account existence leak karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Storing passwords in plain text, or with a fast general-purpose hash
await db.user.create({ data: { email, password } }); // NEVER — plain text
// or:
const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
// SHA-256 is fast BY DESIGN — great for checksums, terrible for passwords,
// since it makes brute-forcing a stolen hash database cheap and fast.`,
        right: `// Using bcrypt (or argon2/scrypt) — deliberately slow, designed for passwords
import bcrypt from 'bcrypt';
const passwordHash = await bcrypt.hash(password, 12);
await db.user.create({ data: { email, passwordHash } });`,
        why: "Plain text storage means a single database leak exposes every user's actual password directly. A fast general-purpose hash like SHA-256 is technically one-way but was designed for speed, which is precisely the wrong property for password storage — it makes brute-forcing a stolen hash database fast and cheap for an attacker.",
        whyHi:
          "Plain text storage matlab hai ek single database leak har user ka actual password directly expose kar deta hai. SHA-256 jaisa ek fast general-purpose hash technically one-way hai par speed ke liye design kiya gaya, jo password storage ke liye exactly galat property hai — ye ek attacker ke liye ek stolen hash database ko brute-force karna fast aur cheap banata hai.",
      },
    ],

    realWorld: [
      {
        en: "A responsible authentication system's password reset flow always shows the identical message ('If an account exists for this email, we've sent a reset link') regardless of whether the email is actually registered — the alternative (revealing which emails have accounts) is a well-known user enumeration vulnerability that real security audits specifically check for.",
        hi: 'Ek responsible authentication system ka password reset flow hamesha identical message dikhata hai (\'Agar is email ke liye ek account exist karta hai, humne ek reset link bheja hai\') chahe email actually registered ho ya nahi — alternative (kaunse emails ke paas accounts hain reveal karna) ek well-known user enumeration vulnerability hai jise real security audits specifically check karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should you use bcrypt (or argon2/scrypt) instead of a fast hash like SHA-256 for storing passwords?',
        qHi: 'Passwords store karne ke liye SHA-256 jaise ek fast hash ke bajaye bcrypt (ya argon2/scrypt) kyun use karna chahiye?',
        a: "Passwords need a hash that's deliberately slow, so that brute-forcing many guesses against a stolen hash database is expensive and impractical. SHA-256 is one-way but designed to be fast, which is exactly the wrong property — it makes brute-forcing a leaked database of hashes cheap and fast for an attacker.",
        aHi: 'Passwords ko ek aise hash ki zaroorat hai jo deliberately slow ho, taaki ek stolen hash database ke against kai guesses brute-force karna expensive aur impractical ho. SHA-256 one-way hai par fast hone ke liye design kiya gaya, jo exactly galat property hai — ye ek attacker ke liye leaked hashes ke ek database ko brute-force karna cheap aur fast banata hai.',
      },
      {
        q: "Why should a login endpoint return the same error for 'wrong password' and 'no such user'?",
        qHi: "Ek login endpoint ko 'galat password' aur 'aisa koi user nahi' ke liye wahi error kyun return karna chahiye?",
        a: "Returning different messages leaks which email addresses are registered users of the service (user enumeration), even without revealing any password. An attacker can use this to build a list of valid accounts to target with other attacks, like password spraying.",
        aHi: 'Alag messages return karna leak karta hai ki kaunse email addresses service ke registered users hain (user enumeration), kisi bhi password ko reveal kiye bina. Ek attacker ise valid accounts ki ek list banane ke liye use kar sakta hai doosre attacks se target karne ke liye, jaise password spraying.',
      },
    ],

    exercises: [
      {
        task: "A login form currently returns 'Email not found' when the email doesn't exist and 'Wrong password' when it does but the password is incorrect. List every change needed to make this flow safe against both timing attacks and user enumeration.",
        taskHi: "Ek login form currently 'Email not found' return karta hai jab email exist nahi karta aur 'Wrong password' jab ye karta hai par password galat hai. Har change list karo jo chahiye is flow ko dono timing attacks aur user enumeration ke against safe banane ke liye.",
        hint: "Think about what needs to happen even in the 'no such user' branch so its timing matches the 'wrong password' branch, plus what the two error messages need to say.",
        hintHi: "Socho ki 'koi aisa user nahi' branch mein bhi kya hona chahiye taaki uska timing 'galat password' branch se match kare, plus dono error messages ko kya kehna chahiye.",
      },
    ],

    keyTakeaways: [
      "Never store a password directly — store a one-way hash produced by a deliberately slow algorithm designed for passwords (bcrypt, argon2, scrypt), never a fast general-purpose hash like SHA-256.",
      "A constant-time comparison (bcrypt.compare, not a naive === check) prevents an attacker from extracting information about a secret through how long a comparison takes to fail.",
      "A login endpoint should return an identical response for 'wrong password' and 'no such account' to avoid user enumeration — including running a dummy hash comparison even when no user is found, so timing doesn't leak the distinction either.",
      'Rate limiting login attempts is a necessary fourth layer alongside hashing, constant-time comparison, and identical error messages — none of the three prevents simply trying many passwords against one known account.',
    ],
    keyTakeawaysHi: [
      'Ek password ko kabhi directly store mat karo — ek one-way hash store karo jo ek deliberately slow algorithm se produce hua ho jo passwords ke liye design kiya gaya hai (bcrypt, argon2, scrypt), kabhi SHA-256 jaisa ek fast general-purpose hash nahi.',
      'Ek constant-time comparison (bcrypt.compare, ek naive === check nahi) ek attacker ko ek secret ke baare mein information extract karne se rokta hai ye dekh kar ki ek comparison fail hone mein kitna time leta hai.',
      "Ek login endpoint ko 'galat password' aur 'aisa koi account nahi' ke liye ek identical response return karna chahiye user enumeration avoid karne ke liye — jab koi user na mile tab bhi ek dummy hash comparison chalate hue, taaki timing bhi distinction leak na kare.",
      'Login attempts ko rate limit karna hashing, constant-time comparison, aur identical error messages ke saath ek necessary fourth layer hai — inme se koi bhi ek attacker ko ek known account ke against simply kai passwords try karne se nahi rokta.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-middleware-rbac',
    title: 'Middleware Route Protection & Role-Based Access Control',
    titleHi: 'Middleware Route Protection Aur Role-Based Access Control',
    description:
      "Middleware runs before a request reaches any page, making it the natural place to redirect unauthenticated visitors away from protected routes — but middleware alone answers 'who is this,' not 'what are they allowed to do,' which is what role-based access control adds on top.",
    descriptionHi:
      'Middleware ek request ke kisi bhi page tak pahunchne se pehle chalta hai, ise natural jagah banate hue unauthenticated visitors ko protected routes se redirect karne ke liye — par akela middleware "ye kaun hai" jawab deta hai, "wo kya karne ke liye allowed hain" nahi, jo role-based access control uske upar add karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A building's front-door security guard versus a specific floor's keycard reader.** The front-door guard checks one thing only: does this person have ANY valid ID to be in the building at all — turning away anyone with no ID before they even reach an elevator. That's authentication, and it's exactly what middleware is good at, since it runs before every request reaches an actual page. But the guard at the front door doesn't know or care whether this particular visitor is allowed on the 12th-floor executive suite — that's a separate keycard reader at that specific floor, checking a specific permission for a specific place. Confusing the two — assuming the front-door guard's approval means someone can go anywhere — is exactly the mistake role-based access control exists to prevent.",
      hi: 'Ek building ka front-door security guard versus ek specific floor ka keycard reader. Front-door guard sirf ek cheez check karta hai: kya is insaan ke paas building mein bilkul hone ke liye KOI valid ID hai — kisi bhi bina ID wale ko elevator tak pahunchne se pehle hi mana karte hue. Ye authentication hai, aur ye exactly wo hai jisme middleware achha hai, kyunki ye har request ke ek actual page tak pahunchne se pehle chalta hai. Par front door pe guard ye nahi jaanta ya care nahi karta ki kya ye particular visitor 12th-floor executive suite pe allowed hai — wo ek separate keycard reader hai us specific floor pe, ek specific permission ko ek specific jagah ke liye check karte hue. Dono ko confuse karna — assume karna ki front-door guard ka approval matlab koi bhi kahin bhi jaa sakta hai — exactly wahi mistake hai jise role-based access control exist karke prevent karta hai.',
    },

    simple: `**Middleware runs before every matching request, making it the right
place for the FIRST question — is this visitor logged in at all:**

\`\`\`ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // only runs for these routes — cheap and scoped
};
\`\`\`

**This answers "is anyone logged in," but NOT "is THIS logged-in user
allowed to do THIS specific thing":**

\`\`\`ts
// A logged-in user could still be a regular 'member', not an 'admin' —
// middleware alone doesn't know or check this distinction
export default async function AdminPage() {
  const session = await getSession();
  if (session.role !== 'admin') {
    redirect('/unauthorized'); // this check belongs HERE, not in middleware
  }
  return <AdminDashboard />;
}
\`\`\`

**Why the role check usually doesn't live in middleware:** Edge middleware
runs in a constrained runtime, often before the app has a chance to load
full user data from a database — and checking "is this user an admin"
frequently requires exactly that database lookup. It's common (and
reasonable) to use middleware ONLY for the coarse "logged in at all" gate,
and push finer-grained role/permission checks down into the actual page or
Server Action, where full data access is available.

**Combining both correctly:**

\`\`\`
Middleware:  "no session cookie at all" -> redirect to /login
             (fast, edge-level, coarse gate)

Page/Action: "session exists, but role isn't 'admin'" -> redirect to
             /unauthorized, or simply refuse the action
             (fine-grained, checked with full data access)
\`\`\`

**The security principle underneath both layers:** treat middleware as a
convenience redirect for a better UX (don't even show a protected page's
shell to a logged-out visitor), never as the ONLY security boundary — the
actual data-touching code (the page, the Server Action) must independently
verify both identity and permission, the same lesson Module 14 covers in
depth for Server Actions specifically.`,

    simpleHi: `**Middleware har matching request se pehle chalta hai, ise FIRST sawaal
ke liye sahi jagah banate hue — kya ye visitor bilkul logged in hai:**

\`\`\`ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // sirf in routes ke liye chalta hai — cheap aur scoped
};
\`\`\`

**Ye "kya koi logged in hai" jawab deta hai, par "kya YE logged-in user
YE specific cheez karne ke liye allowed hai" nahi:**

\`\`\`ts
// Ek logged-in user abhi bhi ek regular 'member' ho sakta hai, ek 'admin'
// nahi — akela middleware is distinction ko nahi jaanta ya check nahi karta
export default async function AdminPage() {
  const session = await getSession();
  if (session.role !== 'admin') {
    redirect('/unauthorized'); // ye check YAHAN belong karta hai, middleware mein nahi
  }
  return <AdminDashboard />;
}
\`\`\`

**Role check usually middleware mein kyun nahi rehta:** Edge middleware ek
constrained runtime mein chalta hai, aksar app ko database se poora user
data load karne ka chance milne se pehle — aur "kya ye user ek admin hai"
check karna frequently exactly wahi database lookup chahta hai. Ye common
hai (aur reasonable hai) middleware ko SIRF coarse "bilkul logged in hai"
gate ke liye use karna, aur finer-grained role/permission checks ko actual
page ya Server Action mein neeche push karna, jahan full data access
available hai.

**Dono ko correctly combine karna:**

\`\`\`
Middleware:  "koi session cookie bilkul nahi hai" -> /login pe redirect
             (fast, edge-level, coarse gate)

Page/Action: "session exist karta hai, par role 'admin' nahi hai" ->
             /unauthorized pe redirect, ya simply action refuse karo
             (fine-grained, full data access ke saath checked)
\`\`\`

**Dono layers ke neeche security principle:** middleware ko ek better UX
ke liye ek convenience redirect ki tarah treat karo (ek logged-out visitor
ko ek protected page ka shell bhi mat dikhao), kabhi EKMATRA security
boundary ki tarah nahi — actual data-touching code (page, Server Action)
ko independently identity aur permission dono verify karna chahiye, wahi
lesson jo Module 14 depth mein cover karta hai Server Actions ke liye
specifically.`,

    content: `## Why middleware runs where it does, and what that enables and limits

Next.js middleware runs at the edge, before a request is routed to any
specific page or Route Handler — this is what makes it fast (it can
redirect before any page-specific code even starts) and also what limits
it (the Edge runtime doesn't support everything Node.js does, and reaching
for a full database query inside middleware for every single request adds
latency to EVERY request, protected or not, since middleware runs before
route-specific logic decides what's actually needed).

## Why "logged in" and "authorized for this" are genuinely separate checks

Authentication answers "who is this" — a fact about identity that doesn't
change per-route. Authorization answers "is this identity allowed to do
THIS specific thing" — a fact that's inherently tied to the specific
resource or action being attempted. A regular member and an admin are both
equally "authenticated" the moment they log in; only authorization
distinguishes what each is allowed to reach. Conflating the two — treating
"passed the login check" as equivalent to "authorized for everything" — is
a common and serious class of access control bug.

## Where role-based access control (RBAC) actually gets checked

RBAC is typically checked in the code that's about to actually do
something consequential: a page that shows admin-only data, a Server
Action that performs an admin-only mutation. This is deliberately
redundant with any coarse middleware gate — the middleware might already
have ensured "someone is logged in," but the page/action independently
re-checks "and specifically, this someone has the admin role," because
that's the only place with full, reliable access to the user's actual role
data.

## The matcher config keeps middleware scoped and cheap

Without a \`matcher\`, middleware runs on every single request to the
app, including static assets, unrelated public pages, and API routes that
don't need the check — pure wasted work and added latency. Scoping the
\`matcher\` to only the routes that actually need protection
(\`/dashboard/:path*\`, say) keeps the coarse gate fast and limited to where
it's actually needed, which matters because middleware's cost is paid on
literally every matching request.`,

    contentHi: `## Middleware jahan chalta hai wahan kyun chalta hai, aur ye kya enable aur limit karta hai

Next.js middleware edge pe chalta hai, ek request ko kisi specific page ya
Route Handler tak route kiye jaane se pehle — yahi wo cheez hai jo ise fast
banati hai (ye kisi bhi page-specific code shuru hone se pehle hi redirect
kar sakta hai) aur ye bhi jo ise limit karti hai (Edge runtime wo sab
support nahi karta jo Node.js karta hai, aur middleware ke andar har
single request ke liye ek poori database query reach karna HAR request pe
latency add karta hai, protected ho ya na ho, kyunki middleware
route-specific logic decide karne se pehle chalta hai ki actually kya
chahiye).

## "Logged in" aur "iske liye authorized" genuinely separate checks kyun hain

Authentication "ye kaun hai" jawab deta hai — identity ke baare mein ek
fact jo per-route change nahi hota. Authorization "kya ye identity YE
specific cheez karne ke liye allowed hai" jawab deta hai — ek fact jo
inherently specific resource ya action se tied hai jo attempt kiya ja raha
hai. Ek regular member aur ek admin dono equally "authenticated" hain jis
moment wo login karte hain; sirf authorization distinguish karta hai ki
har ek kya tak pahunch sakta hai. Dono ko confuse karna — "login check
pass kiya" ko "sab kuch ke liye authorized" ke equivalent treat karna — ek
common aur serious class ka access control bug hai.

## Role-based access control (RBAC) actually kahan check hota hai

RBAC typically us code mein check hota hai jo actually kuch consequential
karne wala hai: ek page jo admin-only data dikhata hai, ek Server Action
jo ek admin-only mutation perform karta hai. Ye deliberately kisi bhi
coarse middleware gate ke saath redundant hai — middleware ne shayad
already ensure kiya ho "koi logged in hai," par page/action independently
re-check karta hai "aur specifically, ye koi admin role rakhta hai,"
kyunki wahi ekmatra jagah hai jahan user ke actual role data tak full,
reliable access hai.

## Matcher config middleware ko scoped aur cheap rakhta hai

Ek \`matcher\` ke bina, middleware app ki har single request pe chalta hai,
static assets, unrelated public pages, aur API routes samet jinhe check ki
zaroorat nahi — pure wasted kaam aur added latency. \`matcher\` ko sirf un
routes tak scope karna jinhe actually protection chahiye
(\`/dashboard/:path*\`, maan lo) coarse gate ko fast aur wahin tak limited
rakhta hai jahan ye actually zaroori hai, jo matter karta hai kyunki
middleware ki cost literally har matching request pe pay hoti hai.`,

    examples: [
      {
        title: 'Coarse middleware auth gate plus a fine-grained role check in the page',
        titleHi: 'Coarse middleware auth gate plus page mein ek fine-grained role check',
        codeJs: `// middleware.js — coarse gate: is anyone logged in at all
import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

// app/admin/page.js — fine-grained: is THIS logged-in user an admin
export default async function AdminPage() {
  const session = await getSession(); // full user data, including role
  if (session.role !== 'admin') {
    redirect('/unauthorized');
  }
  return <AdminDashboard />;
}

// app/actions.js — the mutation itself independently re-checks too
'use server';
export async function deleteUser(userId) {
  const session = await getSession();
  if (session.role !== 'admin') {
    throw new Error('Not authorized');
  }
  await db.user.delete({ where: { id: userId } });
}`,
        codeTs: `// middleware.ts — coarse gate: is anyone logged in at all
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

// app/admin/page.tsx — fine-grained: is THIS logged-in user an admin
export default async function AdminPage() {
  const session = await getSession(); // full user data, including role
  if (session.role !== 'admin') {
    redirect('/unauthorized');
  }
  return <AdminDashboard />;
}

// app/actions.ts — the mutation itself independently re-checks too
'use server';
export async function deleteUser(userId: string) {
  const session = await getSession();
  if (session.role !== 'admin') {
    throw new Error('Not authorized');
  }
  await db.user.delete({ where: { id: userId } });
}`,
        code: `export function middleware(request) {
  const session = request.cookies.get('session');
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}
// role check happens separately, inside the page/action itself
if (session.role !== 'admin') redirect('/unauthorized');`,
        output:
          "A logged-out visitor hitting /admin is redirected to /login by middleware before the page even starts rendering. A logged-in regular member hitting /admin gets past middleware (they ARE logged in) but is redirected to /unauthorized by the page's own role check.",
        explain:
          "Middleware and the page each answer a different question, and both checks are necessary: middleware alone would let any logged-in member reach the admin page (it only checks for A session, not role), while the page's role check alone (without middleware) would still work correctly but skip the fast, edge-level redirect for the common case of a fully logged-out visitor.",
        explainHi:
          "Middleware aur page har ek ek alag sawaal jawab dete hain, aur dono checks zaroori hain: akela middleware kisi bhi logged-in member ko admin page tak pahunchne dega (ye sirf EK session check karta hai, role nahi), jabki page ka apna role check akela (middleware ke bina) abhi bhi correctly kaam karega par ek poori tarah logged-out visitor ke common case ke liye fast, edge-level redirect skip kar dega.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming middleware's auth check is sufficient for admin-only routes
// middleware.js
export function middleware(request) {
  const session = request.cookies.get('session');
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next(); // any logged-in user passes — including non-admins
}
export const config = { matcher: ['/admin/:path*'] };

// app/admin/page.js — NO role check here, trusting middleware handled "auth"
export default function AdminPage() {
  return <AdminDashboard />; // any logged-in member can reach this
}`,
        right: `// Middleware handles the coarse gate; the page independently checks role
export default async function AdminPage() {
  const session = await getSession();
  if (session.role !== 'admin') {
    redirect('/unauthorized');
  }
  return <AdminDashboard />;
}`,
        why: "Middleware in this example only checks whether A session exists, not what role it belongs to — it treats authentication (who is this) as if it answered authorization (what are they allowed to do). Without the page's own role check, any logged-in member, not just admins, can reach admin-only content.",
        whyHi:
          "Is example mein middleware sirf check karta hai ki kya EK session exist karta hai, ye nahi ki ye kis role ka hai — ye authentication (ye kaun hai) ko treat karta hai jaise ye authorization (wo kya karne ke liye allowed hain) jawab deta ho. Page ke apne role check ke bina, koi bhi logged-in member, sirf admins nahi, admin-only content tak pahunch sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A SaaS product with 'member' and 'admin' roles typically uses middleware only to redirect fully logged-out visitors away from the entire /dashboard section, then checks the specific role inside individual admin-only pages and Server Actions — because middleware alone can't distinguish a member from an admin without adding a database call to every single request the app receives.",
        hi: 'Ek SaaS product jisme \'member\' aur \'admin\' roles hain typically middleware ko sirf poori tarah logged-out visitors ko pure /dashboard section se redirect karne ke liye use karta hai, phir specific role ko individual admin-only pages aur Server Actions ke andar check karta hai — kyunki akela middleware ek member ko ek admin se distinguish nahi kar sakta bina app ki har single request mein ek database call add kiye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is middleware typically the wrong place to check a fine-grained role like "is this user an admin"?',
        qHi: 'Middleware typically ek fine-grained role check karne ke liye galat jagah kyun hai jaise "kya ye user ek admin hai"?',
        a: "Middleware runs in a constrained Edge runtime, often before full user data is loaded, and checking a role usually requires a database lookup. Running that lookup on every single matching request (regardless of route) adds latency broadly; it's more efficient and just as secure to do the coarse 'is anyone logged in' check in middleware and push role-specific checks into the actual page or Server Action.",
        aHi: 'Middleware ek constrained Edge runtime mein chalta hai, aksar full user data load hone se pehle, aur ek role check karne ke liye usually ek database lookup chahiye hota hai. Us lookup ko har single matching request pe (route se independent) chalana broadly latency add karta hai; coarse "kya koi logged in hai" check middleware mein karna aur role-specific checks ko actual page ya Server Action mein push karna zyada efficient hai aur utna hi secure.',
      },
      {
        q: 'Why are authentication and authorization genuinely different checks, not the same check applied twice?',
        qHi: 'Authentication aur authorization genuinely alag checks kyun hain, ek hi check do baar applied nahi?',
        a: "Authentication establishes identity (who is this) and doesn't vary by route. Authorization determines what that specific identity is allowed to do, which is inherently tied to the specific resource or action being attempted — two users can be equally authenticated while having very different authorization.",
        aHi: 'Authentication identity establish karta hai (ye kaun hai) aur route se vary nahi hota. Authorization determine karta hai ki wo specific identity kya karne ke liye allowed hai, jo inherently specific resource ya action se tied hai jo attempt kiya ja raha hai — do users equally authenticated ho sakte hain jabki unki authorization bahut alag ho.',
      },
    ],

    exercises: [
      {
        task: "An app has three roles: guest (not logged in), member, and admin. /profile should be reachable by member and admin. /admin/users should be reachable only by admin. Design where each check (logged-in-at-all, and role-specific) should live.",
        taskHi: 'Ek app mein teen roles hain: guest (logged in nahi), member, aur admin. /profile member aur admin dono ke liye reachable hona chahiye. /admin/users sirf admin ke liye reachable hona chahiye. Design karo har check (bilkul-logged-in, aur role-specific) kahan rehna chahiye.',
        hint: "The coarse 'logged in at all' gate for both routes can live in middleware with a matcher covering both paths; the admin-specific role check for /admin/users needs to happen where full role data is available.",
        hintHi: 'Dono routes ke liye coarse "bilkul logged in" gate middleware mein reh sakta hai ek matcher ke saath jo dono paths cover kare; /admin/users ke liye admin-specific role check wahan hona chahiye jahan full role data available ho.',
      },
    ],

    keyTakeaways: [
      "Middleware runs at the edge before any page-specific code, making it a fast, cheap place for a coarse 'is anyone logged in at all' gate — but it typically can't efficiently check fine-grained roles, which usually require a database lookup.",
      'Authentication (who is this) and authorization (what are they allowed to do) are genuinely separate checks — being logged in does not imply being authorized for any specific action or resource.',
      "Role-based access control belongs in the actual page or Server Action about to do something consequential, where full user data (including role) is reliably available.",
      "A middleware matcher should scope the coarse gate to only the routes that actually need it — an unscoped middleware runs its check on every single request, adding unnecessary latency everywhere.",
    ],
    keyTakeawaysHi: [
      'Middleware edge pe kisi bhi page-specific code se pehle chalta hai, ise ek fast, cheap jagah banate hue ek coarse "kya koi bilkul logged in hai" gate ke liye — par ye typically fine-grained roles efficiently check nahi kar sakta, jinhe usually ek database lookup chahiye.',
      'Authentication (ye kaun hai) aur authorization (wo kya karne ke liye allowed hain) genuinely alag checks hain — logged in hona kisi specific action ya resource ke liye authorized hone ko imply nahi karta.',
      'Role-based access control actual page ya Server Action mein belong karta hai jo kuch consequential karne wala hai, jahan full user data (role samet) reliably available hai.',
      'Ek middleware matcher ko coarse gate ko sirf un routes tak scope karna chahiye jinhe actually iski zaroorat hai — ek unscoped middleware apna check har single request pe chalata hai, har jagah unnecessary latency add karte hue.',
    ],
  },
];
