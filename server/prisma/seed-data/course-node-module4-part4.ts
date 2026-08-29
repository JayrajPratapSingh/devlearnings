/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 4.
 *
 * Sessions vs. tokens: why a stateless JWT, on its own, cannot be
 * individually revoked before it naturally expires, and what this means in
 * practice. Broken example: an admin bans a user (is_banned = true in the
 * database), but every route only checks the JWT's signature and expiry —
 * the banned user's still-unexpired token keeps working everywhere until it
 * naturally expires, regardless of the ban. Fixed with two real options:
 * (1) a lightweight per-request revocation check (a tokenVersion / banned
 * flag looked up per request) layered on top of JWTs, or (2) traditional
 * server-side sessions, which are inherently and immediately revocable
 * because the server holds the authoritative record. Frames the actual
 * trade-off: statelessness/scalability (JWT) vs. instant revocability
 * (sessions), not "one is simply better."
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

export const NODE_MODULE_4_PART4: CourseLesson[] = [
  {
    slug: 'sessions-vs-tokens',
    title: 'Sessions vs. Tokens: Why a Banned User Can Keep Working',
    titleHi: 'Sessions vs. Tokens: Ek Banned User Kaam Karna Kyun Jaari Rakh Sakta Hai',
    description: 'An admin bans an abusive user, the database is updated instantly — and the user keeps posting for another 59 minutes, because their JWT was never told about the ban.',
    descriptionHi: 'Ek admin ek abusive user ko ban karta hai, database turant update hota hai — aur user agle 59 minute tak post karta rehta hai, kyunki unke JWT ko ban ke baare mein kabhi bataaya hi nahi gaya.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A nightclub that stamps a guest\'s hand with ink good until closing time, versus one that gives every guest a numbered wristband checked against a list at the door\'s security desk every single time they re-enter.** A JWT-only authentication scheme is like a hand stamp: once a bouncer stamps a guest\'s hand at the door, that stamp alone is what every other staff member inside checks for the rest of the night — a bartender glances at the ink, sees it looks genuine, and serves a drink, with no need to radio the front door or check any list. This is wonderfully fast and requires no ongoing communication between staff members, but it has one unavoidable consequence: if that same guest starts a fight ten minutes after entering and management decides to ban them immediately, there is no way to "un-stamp" a hand already inked — every staff member for the rest of the night keeps honoring that same stamp exactly as before, because none of them were ever told the ban happened; the guest can only truly be stopped by physically finding and removing them, not by the stamp itself becoming invalid. A club using numbered wristbands checked against a live list instead pays a real cost — every single re-entry now requires walking to the desk and having someone check the guest\'s number against the current list, extra time and staffing at literally every checkpoint — but gains something the stamp fundamentally cannot provide: the instant management crosses a banned guest\'s number off the list, every subsequent check, everywhere in the club, immediately and correctly refuses them, with no delay and no need to physically track them down.',
      hi: '**Ek nightclub jo ek guest ke haath par ek ink stamp lagaata hai jo closing time tak valid hai, versus ek jo har guest ko ek numbered wristband deta hai jo har baar unke dobara andar aane par door ke security desk par ek list se check hota hai.** Ek sirf-JWT authentication scheme ek hand stamp ki tarah hai: ek baar jab ek bouncer door par ek guest ka haath stamp karta hai, wo akela stamp hi hai jise raat ke baaki hisse mein har doosra staff member check karta hai — ek bartender ink ko dekhta hai, dekhta hai ki wo asli lagta hai, aur ek drink serve karta hai, front door ko radio karne ya koi list check karne ki zarurat bina. Ye khoobsoorati se tez hai aur staff members ke beech koi chalti communication nahi maangta, par iska ek na-taalne-laayak nateeja hai: agar wahi guest andar aane ke das minute baad ek larai shuru kar de aur management turant unhe ban karne ka faisla kare, ek pehle se stamped haath ko "un-stamp" karne ka koi tarika nahi hai — raat ke baaki hisse mein har staff member bilkul wahi stamp honor karta rehta hai jaisa pehle, kyunki unmein se kisi ko kabhi ban hone ke baare mein bataaya hi nahi gaya; guest ko sach mein sirf physically dhoondh kar aur hataakar hi roka ja sakta hai, stamp khud invalid ho jaane se nahi. Ek club jo iske bajaye numbered wristbands ek live list ke khilaaf check karta hai iske bajaye ek asli keemat chukaata hai — har akeli dobara-entry ab desk tak chalna aur kisi ko guest ka number maujooda list ke khilaaf check karwaana maangti hai, literally har checkpoint par extra waqt aur staffing — par kuch aisa paata hai jo stamp buniyaadi taur par nahi de sakta: jis pal management ek banned guest ka number list se hata deti hai, har baad ka check, club mein kahin bhi, turant aur sahi tarike se unhe mana kar deta hai, koi deri nahi aur unhe physically dhoondhne ki zarurat nahi.',
    },

    simple: `**Start broken.** An admin route that bans a user, paired with a protected route that only checks the JWT itself:

\`\`\`js
// Admin bans a user — this part works exactly as intended
app.post("/admin/ban/:userId", requireAdmin, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [req.params.userId]);
    res.json({ message: "User banned" });
  } catch (err) {
    next(err);
  }
});

// Every protected route only checks the JWT — never the database's current ban status
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}

app.post("/posts", requireAuth, async (req, res, next) => {
  await pool.query("INSERT INTO posts (author_id, body) VALUES ($1, $2)", [req.userId, req.body.body]);
  res.status(201).json({ message: "Posted" });
});
\`\`\`

The \`/admin/ban/:userId\` route updates the database instantly and correctly — querying \`users\` directly confirms \`is_banned\` is now \`true\` for that account, immediately. And yet, the banned user can keep calling \`POST /posts\` successfully, for as long as their existing JWT remains unexpired (recall the previous lesson: a common \`expiresIn\` might be an hour), because \`requireAuth\` only checks two things about the token — is its signature valid, and has it not yet expired — neither of which changed the instant the ban was applied. The token was completely genuine when it was issued, before the ban, and a JWT\'s entire design (covered in the previous lesson) is to let a server verify a request\'s identity WITHOUT needing to re-check the database on every single request — which is exactly the property working against the admin\'s intent here: nothing about the ban touches the token itself, so \`jwt.verify()\` keeps succeeding, oblivious to a decision made after the token was issued.

**Fix, option 1: a lightweight per-request revocation check layered on top of JWT**

\`\`\`js
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    const result = await pool.query("SELECT is_banned FROM users WHERE id = $1", [decoded.userId]);
    if (result.rows[0]?.is_banned) {
      return res.status(403).json({ error: "Account banned" });
    }

    req.userId = decoded.userId;
    next();
  });
}
\`\`\`

\`\`\`ts
function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const result = await pool.query<{ is_banned: boolean }>(
      "SELECT is_banned FROM users WHERE id = $1",
      [decoded.userId as number]
    );
    if (result.rows[0]?.is_banned) {
      res.status(403).json({ error: "Account banned" });
      return;
    }

    req.userId = decoded.userId as number;
    next();
  });
}
\`\`\`

Adding one small, targeted database check inside the auth middleware — specifically checking a live, mutable piece of state (\`is_banned\`) that the server can flip at any moment — restores instant revocability for exactly the cases that need it, while keeping the rest of JWT\'s stateless design intact (the token itself is still not individually "deleted" anywhere; the middleware simply now also asks "does the database currently say this user\'s access should be denied?" on top of verifying the signature). This is a deliberate, narrow trade-off: it reintroduces one database query per authenticated request, giving up a little of JWT\'s "no database lookup needed" appeal, specifically in exchange for the one guarantee pure JWTs cannot provide on their own.

**Fix, option 2: traditional server-side sessions, which are inherently revocable**

\`\`\`js
// At login: the server creates and stores a session record itself
const sessionId = crypto.randomUUID();
await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [
  sessionId, user.id, new Date(Date.now() + 60 * 60 * 1000),
]);
res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });

// On every request: look the session up directly — banning is just one row update away
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  pool.query(
    \`SELECT sessions.user_id, users.is_banned FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > NOW()\`,
    [sessionId]
  ).then((result) => {
    const row = result.rows[0];
    if (!row || row.is_banned) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    req.userId = row.user_id;
    next();
  });
}
\`\`\`

A traditional session-based approach stores the actual, authoritative record of "who is currently logged in" on the SERVER (in a database table, or a fast in-memory store like Redis), rather than inside a self-contained token the client carries around. The client only holds a session ID (commonly in an \`httpOnly\` cookie), a value meaningless on its own — every request requires the server to look that ID up against its own live records, which is precisely why a ban, a forced logout, or revoking one specific device\'s access is always just an ordinary database update, taking effect on the very next request, with no waiting for anything to expire. The cost is symmetric to the JWT-plus-database-check approach: sessions always require a lookup per request (there was never a "stateless" option to give up in the first place), and that lookup\'s storage (rows in a database, or entries in an in-memory store) has to be provisioned and scaled as the number of active users grows, unlike a pure JWT\'s design, which needs none of that.`,

    simpleHi: `**Toote hue se shuru.** Ek admin route jo ek user ko ban karta hai, ek surakshit route ke saath jode jo sirf JWT ko check karta hai:

\`\`\`js
// Admin ek user ko ban karta hai — ye hissa bilkul iraade ke hisaab se kaam karta hai
app.post("/admin/ban/:userId", requireAdmin, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [req.params.userId]);
    res.json({ message: "User banned" });
  } catch (err) {
    next(err);
  }
});

// Har surakshit route sirf JWT check karta hai — database ki abhi ki ban sthiti kabhi nahi
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}

app.post("/posts", requireAuth, async (req, res, next) => {
  await pool.query("INSERT INTO posts (author_id, body) VALUES ($1, $2)", [req.userId, req.body.body]);
  res.status(201).json({ message: "Posted" });
});
\`\`\`

\`/admin/ban/:userId\` route database ko turant aur sahi tarike se update karta hai — \`users\` ko seedha query karna confirm karta hai \`is_banned\` ab us account ke liye turant \`true\` hai. Aur phir bhi, banned user \`POST /posts\` ko safaltapoorvak bulaate rehta hai, jab tak unka maujooda JWT expire nahi hota (pichhla lesson yaad karo: ek aam \`expiresIn\` ek ghanta ho sakta hai), kyunki \`requireAuth\` token ke baare mein sirf do cheezein check karta hai — kya uska signature valid hai, aur kya wo abhi tak expire nahi hua — jinmein se koi bhi ban lagu hote hi nahi badla. Token bilkul asli tha jab wo issue hua, ban se pehle, aur ek JWT ka poora design (pichhle lesson mein cover hua) ek server ko ek request ki pehchaan verify karne dena hai har akeli request par database ko dobara check kiye BINA — jo bilkul yahan admin ke iraade ke khilaaf kaam kar rahi property hai: ban ke baare mein kuch bhi token ko khud chhuta nahi, isliye \`jwt.verify()\` safal hota rehta hai, token issue hone ke baad liye gaye faisle se bekhabar.

**Fix, option 1: JWT ke oopar ek halka per-request revocation check**

\`\`\`js
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    const result = await pool.query("SELECT is_banned FROM users WHERE id = $1", [decoded.userId]);
    if (result.rows[0]?.is_banned) {
      return res.status(403).json({ error: "Account banned" });
    }

    req.userId = decoded.userId;
    next();
  });
}
\`\`\`

\`\`\`ts
function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const result = await pool.query<{ is_banned: boolean }>(
      "SELECT is_banned FROM users WHERE id = $1",
      [decoded.userId as number]
    );
    if (result.rows[0]?.is_banned) {
      res.status(403).json({ error: "Account banned" });
      return;
    }

    req.userId = decoded.userId as number;
    next();
  });
}
\`\`\`

Auth middleware ke andar ek chhota, khaas database check jodna — khaas taur par ek live, badal-sakne-laayak state (\`is_banned\`) check karte hue jise server kisi bhi pal palat sakta hai — bilkul un cases ke liye turant revocability bahaal karta hai jinhe iski zarurat hai, jabki JWT ke stateless design ka baaki hissa barkaraar rakhte hue (token khud abhi bhi kahin akela "delete" nahi hua hai; middleware bas ab signature verify karne ke saath-saath ye bhi poochta hai "kya database abhi keh raha hai ki is user ki access mana honi chahiye?"). Ye ek jaan-boojhkar, sankeern trade-off hai: ye har authenticated request ke liye ek database query dobara laata hai, JWT ki "koi database lookup zaruri nahi" wali khoobi ka thoda hissa chhodte hue, khaas taur par us ek guarantee ke badle jo akele JWTs khud nahi de sakte.

**Fix, option 2: traditional server-side sessions, jo buniyaadi taur par revocable hain**

\`\`\`js
// Login par: server khud ek session record banaata aur store karta hai
const sessionId = crypto.randomUUID();
await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [
  sessionId, user.id, new Date(Date.now() + 60 * 60 * 1000),
]);
res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });

// Har request par: session ko seedha dhoondho — ban karna bas ek row update door hai
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  pool.query(
    \`SELECT sessions.user_id, users.is_banned FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > NOW()\`,
    [sessionId]
  ).then((result) => {
    const row = result.rows[0];
    if (!row || row.is_banned) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    req.userId = row.user_id;
    next();
  });
}
\`\`\`

Ek traditional session-based tarika "abhi kaun logged in hai" ka asli, adhikrit record SERVER par store karta hai (ek database table mein, ya Redis jaisa ek tez in-memory store), ek self-contained token ke andar nahi jise client apne saath le kar chalta hai. Client sirf ek session ID rakhta hai (aam taur par ek \`httpOnly\` cookie mein), ek value jo apne aap mein bemaani hai — har request server ko us ID ko apne live records ke khilaaf dhoondhne ki maang karti hai, jo bilkul isi wajah se ek ban, ek zabardasti logout, ya ek khaas device ki access revoke karna hamesha ek aam database update hai, agli hi request par lagu hota hua, kuch bhi expire hone ka intezaar kiye bina. Keemat JWT-plus-database-check tarike se symmetric hai: sessions ko hamesha har request ke liye ek lookup chahiye (yahan pehli jagah koi "stateless" option chhodne ke liye tha hi nahi), aur us lookup ki storage (ek database mein rows, ya ek in-memory store mein entries) ko provision aur scale karna hai jaise-jaise active users ki tadaad badhti hai, ek pure JWT ke design ke ulta, jise inmein se kuch bhi nahi chahiye.`,

    content: `## The core trade-off, stated plainly: statelessness vs. instant revocability

\`\`\`
Pure JWT:        no per-request database lookup, but cannot be individually revoked before it expires
JWT + DB check:  per-request database lookup, revocable via any flag the check reads
Sessions:        per-request database (or Redis) lookup, inherently and immediately revocable
\`\`\`

Every approach covered in this lesson sits on the same underlying spectrum, and no option is simply "the correct one" in the abstract — a pure, unadorned JWT scales exceptionally well specifically because verifying a request requires no database access at all, purely mathematical signature verification, which matters a great deal at very high request volumes; the price for that is exactly what this lesson\'s broken example demonstrated. Adding a database check to JWT-based auth, or switching to sessions entirely, both reintroduce a per-request lookup in exchange for the ability to immediately and precisely control who is currently allowed in — the real engineering decision is not "which of these is secure" (both fixed versions are equally capable of stopping a banned user instantly), but which trade-off suits a given system\'s actual scale and requirements.

## Sessions are not "old" or "worse" — they remain the standard choice for many real systems

\`\`\`js
// A common, production-grade pattern: express-session backed by Redis
const session = require("express-session");
const RedisStore = require("connect-redis").default;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  cookie: { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 },
}));
\`\`\`

It is a common misconception that JWTs are a strict, modern upgrade over sessions and that sessions are an outdated approach — in reality, traditional web applications (a server rendering HTML pages, rather than a separate frontend calling a JSON API) very commonly still use session-based auth today, often via a library like \`express-session\` backed by a fast store like Redis specifically to keep the per-request lookup cheap. Sessions remain an excellent default whenever instant revocability genuinely matters (banking, admin panels, anything where "log this user out everywhere, right now" needs to actually mean right now) and the traffic volume does not demand avoiding a lookup at any cost — the JWT-heavy pattern this course has otherwise emphasized is especially well suited to APIs serving many independent clients (mobile apps, third-party integrations, microservices calling each other) where a single shared secret and stateless verification meaningfully simplify the architecture.

## A hybrid pattern seen in real production systems: short-lived JWT + revocable refresh token

\`\`\`js
// Short-lived JWT: fast, no per-request DB check, but a narrow exposure window
const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

// Long-lived refresh token: stored server-side, individually revocable, checked only when refreshing
const refreshToken = crypto.randomUUID();
await pool.query("INSERT INTO refresh_tokens (token, user_id, revoked) VALUES ($1, $2, false)", [refreshToken, user.id]);
\`\`\`

A pattern many real systems settle on takes a middle path: issue a genuinely short-lived JWT (minutes, not an hour) for the actual per-request authentication — accepting that a banned user\'s access does not disappear until that short window naturally elapses, a far smaller exposure than the broken example\'s hour-long window — paired with a separate, longer-lived "refresh token," which IS stored server-side and IS individually revocable, used only occasionally to obtain a fresh short-lived JWT rather than on every single request. This keeps the vast majority of requests fast and database-lookup-free (verifying the short-lived JWT), while still giving administrators a genuine, if slightly delayed, way to cut off a specific user\'s ability to obtain any further access, by revoking their refresh token the moment a ban is issued.

## Recognizing this as an interview-style system design question, not just a code pattern

The distinction covered in this lesson is a genuinely common interview topic specifically because it has no single universally correct answer — a strong response identifies the actual trade-off (stateless scalability vs. instant revocability) rather than declaring one option categorically superior, and reasons about which side of that trade-off a given system\'s real requirements (traffic volume, how urgently a ban or forced logout needs to take effect, how many independent services need to verify identity) actually call for.`,

    contentHi: `## Mool trade-off, saaf taur par: statelessness vs. turant revocability

\`\`\`
Pure JWT:        koi per-request database lookup nahi, par expire hone se pehle akele revoke nahi ho sakta
JWT + DB check:  per-request database lookup, jo bhi flag check padhta hai uske through revocable
Sessions:        per-request database (ya Redis) lookup, buniyaadi taur par aur turant revocable
\`\`\`

Is lesson mein cover hua har tarika ek hi underlying spectrum par baitha hai, aur koi bhi option abstract mein bas "sahi wala" nahi hai — ek pure, saadha JWT bahut achhi tarah scale karta hai khaas taur par isliye kyunki ek request verify karne ke liye bilkul koi database access nahi chahiye, sirf mathematical signature verification, jo bahut oonchi request volumes par bahut maayne rakhta hai; uski keemat bilkul wahi hai jo is lesson ka toota example dikhaata hai. JWT-based auth mein ek database check jodna, ya poori tarah sessions mein badalna, dono ek per-request lookup dobara laate hain us kshamta ke badle jo turant aur bilkul control kare ki abhi kaun andar aane diya jaaye — asli engineering faisla "inmein se kaunsa surakshit hai" nahi hai (dono theek versions banned user ko turant rokne ki barabar kshamta rakhte hain), balki ye ki kaunsa trade-off ek diye gaye system ki asli scale aur zaruraton ke liye theek baithta hai.

## Sessions "purane" ya "kamzor" nahi hain — wo aaj bhi kai asli systems ka standard choice hain

\`\`\`js
// Ek aam, production-grade pattern: Redis se supported express-session
const session = require("express-session");
const RedisStore = require("connect-redis").default;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  cookie: { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 },
}));
\`\`\`

Ye ek aam galatfehmi hai ki JWTs sessions se ek sakht, modern upgrade hain aur sessions ek purana tarika hai — asal mein, traditional web applications (ek server jo HTML pages render karta hai, ek alag frontend ke bajaye jo ek JSON API bulaata hai) aaj bhi bahut aam taur par session-based auth istemal karte hain, aksar \`express-session\` jaisi ek library se, Redis jaise ek tez store se supported, khaas taur par per-request lookup ko sasta rakhne ke liye. Sessions ek behtareen default rehte hain jab bhi turant revocability sach mein maayne rakhti hai (banking, admin panels, kuch bhi jahan "is user ko hamesha ke liye, abhi, har jagah se logout karo" ka asal mein abhi hi matlab hona chahiye) aur traffic volume kisi bhi keemat par ek lookup se bachne ki maang nahi karta — JWT-heavy pattern jise ye course otherwise zor deta aaya hai khaas taur par un APIs ke liye theek baithta hai jo kai mustaqil clients (mobile apps, third-party integrations, ek-doosre ko bulaate microservices) ko service dete hain jahan ek shared secret aur stateless verification architecture ko maayne rakhta saadha banaate hain.

## Ek hybrid pattern jo asli production systems mein dekha jaata hai: chhoti-umar wala JWT + revocable refresh token

\`\`\`js
// Chhoti-umar wala JWT: tez, koi per-request DB check nahi, par ek sankeern exposure window
const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

// Lambi-umar wala refresh token: server-side stored, akele revocable, sirf refresh karte waqt check hota hai
const refreshToken = crypto.randomUUID();
await pool.query("INSERT INTO refresh_tokens (token, user_id, revoked) VALUES ($1, $2, false)", [refreshToken, user.id]);
\`\`\`

Kai asli systems jis pattern par tay hote hain wo ek beech ka raasta leta hai: asli per-request authentication ke liye ek sach mein chhoti-umar wala JWT (minutes, ek ghanta nahi) issue karo — ye maan lete hue ki ek banned user ki access tab tak gaayab nahi hoti jab tak wo chhoti window naisargik taur par na guzre, toote example ke ghante-lambe window se kaafi chhota exposure — ek alag, lambi-umar wale "refresh token" ke saath jode hue, jo server-side STORED hai aur akele REVOCABLE hai, sirf kabhi-kabhi istemal hota hai ek taaza chhoti-umar wala JWT paane ke liye har akeli request par nahi. Ye zyaadatar requests ko tez aur database-lookup-se-mukt rakhta hai (chhoti-umar wale JWT ko verify karte hue), jabki administrators ko abhi bhi ek asli, chahe thoda deri se, tarika deta hai ek khaas user ki koi bhi aur access paane ki kshamta katam karne ka, unka refresh token revoke karte hue jis pal ek ban issue hota hai.

## Ise ek interview-style system design sawaal ki tarah pehchaanna, sirf ek code pattern nahi

Is lesson mein cover hua farak ek sach mein aam interview topic hai khaas taur par isliye kyunki iska koi ek sarvavyaapi sahi jawaab nahi hai — ek mazboot jawaab asli trade-off ko pehchaanta hai (stateless scalability vs. turant revocability) ek option ko categorically behtar declare karne ke bajaye, aur soch-samajh kar samajhta hai ki ek diye gaye system ki asli zaruraten (traffic volume, ek ban ya zabardasti logout ko kitni jaldi lagu hona chahiye, kitni mustaqil services ko pehchaan verify karni chahiye) us trade-off ke kis taraf maang karti hain.`,

    examples: [
      {
        title: 'Broken: a ban updates the database but never reaches the JWT-only auth check',
        titleHi: 'Toota: ek ban database update karta hai par kabhi sirf-JWT auth check tak pahunchta nahi',
        code: `await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [userId]);
// but requireAuth only checks jwt.verify() — never the ban flag
// the banned user's still-unexpired token keeps working everywhere`,
        codeJs: `app.post("/admin/ban/:userId", requireAdmin, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [req.params.userId]);
    res.json({ message: "User banned" });
  } catch (err) {
    next(err);
  }
});

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = decoded.userId;
    next();
  });
}

app.post("/posts", requireAuth, async (req, res, next) => {
  await pool.query("INSERT INTO posts (author_id, body) VALUES ($1, $2)", [req.userId, req.body.body]);
  res.status(201).json({ message: "Posted" });
});`,
        codeTs: `app.post("/admin/ban/:userId", requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query("UPDATE users SET is_banned = true WHERE id = $1", [req.params.userId]);
    res.json({ message: "User banned" });
  } catch (err) {
    next(err);
  }
});

interface AuthedRequest extends Request {
  userId?: number;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
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

app.post("/posts", requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  await pool.query("INSERT INTO posts (author_id, body) VALUES ($1, $2)", [req.userId, req.body.body]);
  res.status(201).json({ message: "Posted" });
});`,
        output: `The ban is applied to the database instantly and correctly. The
banned user's existing JWT (issued before the ban) keeps working on
every route for as long as it remains unexpired — potentially another
full hour with a common expiresIn setting.`,
        explain: 'The token was completely genuine when issued — nothing about the ban touches the token itself, so signature verification keeps succeeding, unaware of any decision made after the token was created.',
        explainHi: 'Token issue hone par bilkul asli tha — ban ke baare mein kuch bhi token ko khud chhuta nahi, isliye signature verification safal hota rehta hai, token banne ke baad liye gaye kisi bhi faisle se bekhabar.',
      },
      {
        title: 'Fixed, option 1: a database check layered on top of JWT verification',
        titleHi: 'Theek, option 1: JWT verification ke oopar ek database check',
        code: `jwt.verify(token, secret, async (err, decoded) => {
  if (err) return res.status(401).json({ error: "Invalid" });
  const { rows } = await pool.query("SELECT is_banned FROM users WHERE id = $1", [decoded.userId]);
  if (rows[0]?.is_banned) return res.status(403).json({ error: "Account banned" });
  req.userId = decoded.userId;
  next();
});`,
        codeJs: `function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    const result = await pool.query("SELECT is_banned FROM users WHERE id = $1", [decoded.userId]);
    if (result.rows[0]?.is_banned) {
      return res.status(403).json({ error: "Account banned" });
    }

    req.userId = decoded.userId;
    next();
  });
}`,
        codeTs: `function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const result = await pool.query<{ is_banned: boolean }>(
      "SELECT is_banned FROM users WHERE id = $1",
      [decoded.userId as number]
    );
    if (result.rows[0]?.is_banned) {
      res.status(403).json({ error: "Account banned" });
      return;
    }

    req.userId = decoded.userId as number;
    next();
  });
}`,
        outputJs: `The banned user's next request, even with their still-unexpired JWT,
now correctly receives 403 Forbidden — the ban takes effect
immediately, on the very next request, rather than waiting for
expiry.`,
        outputTs: `// Identical behaviour. This reintroduces exactly one database query
// per authenticated request — a deliberate, narrow trade-off in
// exchange for instant revocability.`,
        explain: 'The token itself is never modified or individually invalidated — the middleware simply now also asks the database whether this specific user\'s access should currently be denied.',
        explainHi: 'Token khud kabhi modify ya akele invalidate nahi hota — middleware bas ab database se ye bhi poochta hai ki kya is khaas user ki access abhi mana honi chahiye.',
      },
      {
        title: 'Fixed, option 2: server-side sessions, inherently and immediately revocable',
        titleHi: 'Theek, option 2: server-side sessions, buniyaadi taur par aur turant revocable',
        code: `const sessionId = crypto.randomUUID();
await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [sessionId, user.id, expiresAt]);
res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });
// banning is now just: DELETE FROM sessions WHERE user_id = $1`,
        codeJs: `app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT id, password FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [sessionId, user.id, expiresAt]);
  res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });
  res.json({ message: "Logged in" });
});

function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  pool.query(
    \`SELECT sessions.user_id, users.is_banned FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > NOW()\`,
    [sessionId]
  ).then((result) => {
    const row = result.rows[0];
    if (!row || row.is_banned) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    req.userId = row.user_id;
    next();
  }).catch(next);
}`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await pool.query<{ id: number; password: string }>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [sessionId, user.id, expiresAt]);
  res.cookie("sessionId", sessionId, { httpOnly: true, secure: true });
  res.json({ message: "Logged in" });
});

interface AuthedRequest extends Request {
  userId?: number;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const sessionId = req.cookies.sessionId as string | undefined;
  pool.query<{ user_id: number; is_banned: boolean }>(
    \`SELECT sessions.user_id, users.is_banned FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > NOW()\`,
    [sessionId]
  ).then((result) => {
    const row = result.rows[0];
    if (!row || row.is_banned) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    req.userId = row.user_id;
    next();
  }).catch(next);
}`,
        outputJs: `Banning a user (or deleting all of their session rows directly) takes
effect on their very next request, immediately — there is no token
anywhere holding stale, unrevocable state, because the server's
database row IS the authoritative source of truth.`,
        outputTs: `// Identical behaviour. Every authenticated request now requires a
// database round trip by design — sessions never had a "stateless"
// mode to give up.`,
        explain: 'The client only carries a meaningless session ID — every request re-derives the actual authorization state from the server\'s own live records, which is exactly why revocation is instant.',
        explainHi: 'Client sirf ek bemaani session ID rakhta hai — har request server ke apne live records se asli authorization state dobara nikaalti hai, jo bilkul isi wajah se revocation turant hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `jwt.verify(token, secret, (err, decoded) => {
  if (err) return res.status(401).json({ error: "Invalid" });
  req.userId = decoded.userId; // never checks current database state
  next();
});`,
        right: `jwt.verify(token, secret, async (err, decoded) => {
  if (err) return res.status(401).json({ error: "Invalid" });
  const { rows } = await pool.query("SELECT is_banned FROM users WHERE id = $1", [decoded.userId]);
  if (rows[0]?.is_banned) return res.status(403).json({ error: "Account banned" });
  req.userId = decoded.userId;
  next();
});`,
        why: 'A pure JWT check only confirms the token was genuinely issued and has not expired — it says nothing about whatever has happened to the account since the token was issued, such as a ban.',
        whyHi: 'Ek pure JWT check sirf confirm karta hai ki token sach mein issue hua tha aur abhi tak expire nahi hua — ye us account ke saath token issue hone ke baad jo bhi hua uske baare mein kuch nahi kehta, jaise ek ban.',
      },
      {
        wrong: `const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });
// a week-long exposure window if this account needs to be banned or revoked`,
        right: `const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" });
// paired with a separately revocable refresh token for obtaining new short-lived tokens`,
        why: 'A long-lived JWT with no revocation mechanism means any ban, forced logout, or compromised-account response is delayed by the token\'s entire remaining lifetime — a shorter expiration, or a database check, narrows this exposure.',
        whyHi: 'Ek lambi-umar wala JWT bina kisi revocation mechanism ke matlab hai koi bhi ban, zabardasti logout, ya compromise-hue-account ka jawaab token ki poori baaki umar se deri se aata hai — ek chhota expiration, ya ek database check, is exposure ko sankeern karta hai.',
      },
      {
        wrong: `// Assuming sessions are simply "outdated" and always replacing them with JWT
app.use(session({ /* ... */ })); // removed entirely in favor of JWT
// even for a system where instant revocability is a hard requirement`,
        right: `// Choosing based on actual requirements: sessions where instant revocability matters,
// JWT (with or without a revocation check) where stateless scale matters more`,
        why: 'Neither approach is categorically superior — the right choice depends on whether a given system needs instant revocability (favoring sessions or JWT-plus-database-check) or needs to avoid a per-request database lookup at scale (favoring pure JWT).',
        whyHi: 'Koi bhi tarika categorically behtar nahi hai — sahi choice is baat par nirbhar hai ki kya ek diya gaya system turant revocability chahta hai (sessions ya JWT-plus-database-check ke haq mein) ya scale par ek per-request database lookup se bachna chahta hai (pure JWT ke haq mein).',
      },
    ],

    realWorld: [
      {
        en: '**Nearly every real production authentication system that uses JWTs also implements some form of revocation mechanism** (a database check, a token blocklist, or a short-lived-access-token-plus-revocable-refresh-token pattern) — a genuinely pure, unadorned JWT with no revocation path at all is uncommon in serious production systems specifically because of the exact gap this lesson demonstrates.',
        hi: '**Lagbhag har asli production authentication system jo JWTs istemal karta hai kisi na kisi tarah ka revocation mechanism bhi lagu karta hai** (ek database check, ek token blocklist, ya ek chhoti-umar-access-token-plus-revocable-refresh-token pattern) — ek sach mein pure, saadha JWT bina kisi revocation raaste ke gambhir production systems mein aam nahi hai khaas taur par is lesson mein dikhaayi bilkul isi kami ki wajah se.',
      },
      {
        en: '**Session-based authentication remains the standard, default approach for most traditional server-rendered web applications** (as opposed to a separate frontend calling a JSON API), and libraries like express-session backed by Redis are extremely widely used in production today — this is not a legacy pattern being phased out, but an actively maintained, commonly chosen approach.',
        hi: '**Session-based authentication zyaadatar traditional server-rendered web applications ke liye standard, default tarika bana hua hai** (ek alag frontend jo ek JSON API bulaata hai uske ulta), aur Redis se supported \`express-session\` jaisi libraries aaj production mein bahut vyapak taur par istemal hoti hain — ye koi legacy pattern nahi hai jo phase-out ho raha ho, balki ek actively maintained, aam taur par chuna gaya tarika hai.',
      },
      {
        en: '**"Log out of all devices" or "force logout this specific session," a common real-world feature request in production applications, is trivial with server-side sessions (delete the relevant session rows) but requires deliberately designed extra machinery with JWTs** (a blocklist, a tokenVersion counter, or short expirations) — a concrete illustration of the trade-off this lesson covers, not an abstract concern.',
        hi: '**"Sabhi devices se logout karo" ya "is khaas session ko zabardasti logout karo," production applications mein ek aam asli-duniya feature request, server-side sessions ke saath mamuli hai (judi session rows delete karo) par JWTs ke saath jaan-boojhkar design ki extra machinery maangta hai** (ek blocklist, ek \`tokenVersion\` counter, ya chhoti expirations) — is lesson mein cover hue trade-off ka ek thos udaharan, koi abstract chinta nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a JWT-based auth system not immediately stop a banned user from making authenticated requests, even though the ban is applied to the database instantly?',
        qHi: 'Ek JWT-based auth system ek banned user ko authenticated requests karne se turant kyun nahi rok sakta, chahe ban database mein turant lagu ho jaaye?',
        a: 'A JWT verification check, at its core, confirms exactly two things: that the token\'s signature is genuinely valid (meaning it was issued by this specific server and has not been tampered with since), and that the token has not yet passed its embedded expiration time. Neither of these two checks involves looking at the current state of the user\'s account in the database at all — the entire design goal of a JWT is to let the server verify a request\'s identity using only the token itself, without needing to consult any external, mutable record for the common case. This means that once a token has been issued, it remains just as validly signed and just as unexpired after a ban is applied as it was before — the ban changed a row in the database, but it did not, and structurally could not, reach into an already-issued token and alter anything about it, since the token exists entirely independently of the database from the moment it is created. The user therefore keeps passing the exact same two checks the auth middleware performs, for as long as the token remains unexpired, regardless of any decision the application makes afterward.',
        aHi: 'Ek JWT verification check, apne mool mein, bilkul do cheezein confirm karta hai: ki token ka signature sach mein valid hai (matlab ye bilkul is server dwara issue hua tha aur us se baad tamper nahi hua), aur ki token abhi tak apne embed hue expiration time se aage nahi guzra. Inmein se koi bhi check database mein user ke account ki abhi ki sthiti ko dekhna shaamil nahi karta — ek JWT ka poora design lakshya server ko ek request ki pehchaan sirf token khud se verify karne dena hai, aam case ke liye kisi bahari, badal-sakne-laayak record se poochhe bina. Iska matlab hai ek baar token issue hone ke baad, ye ek ban lagu hone ke baad utna hi validly signed aur utna hi na-expire hua rehta hai jitna pehle tha — ban ne database mein ek row badla, par isne ek pehle-se-issue-hue token mein ghuskar kuch bhi nahi badla, aur sanrachnaatmak taur par kar hi nahi sakta tha, kyunki token banne ke pal se database se poori tarah mustaqil maujood hai. User isliye bilkul wahi do checks paas karta rehta hai jo auth middleware karta hai, jab tak token expire nahi hota, application baad mein jo bhi faisla le uski parwaah kiye bina.',
      },
      {
        q: 'What is the actual trade-off between using a pure JWT and adding a database check (or switching to sessions) for authentication?',
        qHi: 'Authentication ke liye ek pure JWT istemal karne aur ek database check jodne (ya sessions mein badalne) ke beech asli trade-off kya hai?',
        a: 'A pure JWT\'s core advantage is that verifying a request requires no database (or any other external storage) access at all — signature verification is a self-contained, purely computational check, which matters significantly at high request volumes or when many independent services need to verify identity without all sharing access to one central database. The cost of this advantage is that a JWT, once issued, cannot be individually invalidated before its embedded expiration — there is no record anywhere for the server to consult and update to "turn off" one specific already-issued token. Adding a database check inside the auth middleware (looking up a ban flag, a token-version counter, or similar) restores the ability to immediately deny a specific user\'s access, at the cost of reintroducing exactly one database query per authenticated request, giving back some of the pure-JWT scalability advantage in exchange for revocability. Switching to traditional server-side sessions makes this trade explicit and total: sessions never had a "no lookup needed" mode to give up in the first place, since the server\'s own record is the only source of truth from the very first request — the benefit is that any change to that record (a ban, a forced logout of one specific session, revoking one device\'s access) takes effect on the very next request, with no delay and no extra revocation machinery required beyond the ordinary lookup the system already performs.',
        aHi: 'Ek pure JWT ka mool faayda ye hai ki ek request verify karne ke liye bilkul koi database (ya kisi bhi doosri bahari storage) access nahi chahiye — signature verification ek self-contained, poori tarah computational check hai, jo oonchi request volumes par ya jab kai mustaqil services ko ek kendriya database tak sab ka access saanjha kiye bina pehchaan verify karni chahiye tab maayne rakhta hai. Is faayde ki keemat ye hai ki ek JWT, ek baar issue hone ke baad, apni embed hui expiration se pehle akele invalidate nahi ho sakta — kahin koi record nahi hai jise server poochhe aur update kare ek khaas pehle-se-issue-hue token ko "band" karne ke liye. Auth middleware ke andar ek database check jodna (ek ban flag, ek token-version counter, ya waisa hi dhoondhte hue) ek khaas user ki access turant mana karne ki kshamta bahaal karta hai, har authenticated request ke liye bilkul ek database query dobara laane ki keemat par, pure-JWT scalability faayde ka kuch hissa revocability ke badle mein wapas dete hue. Traditional server-side sessions mein badalna is trade ko explicit aur poora banaata hai: sessions ke paas pehli jagah koi "koi lookup zaruri nahi" mode tha hi nahi, kyunki server ka apna record pehli request se hi asli source of truth hai — faayda ye hai ki us record mein koi bhi badlaav (ek ban, ek khaas session ka zabardasti logout, ek device ki access revoke karna) agli hi request par lagu hota hai, koi deri nahi aur koi extra revocation machinery zaruri nahi us aam lookup ke bahar jo system pehle se karta hai.',
      },
      {
        q: 'Describe the short-lived-access-token-plus-refresh-token hybrid pattern, and explain what problem it is specifically trying to balance.',
        qHi: 'Chhoti-umar-access-token-plus-refresh-token hybrid pattern describe karo, aur samjhaao ye khaas taur par kaunsi samasya ko santulit karne ki koshish kar raha hai?',
        a: 'This pattern issues two different tokens at login rather than one. The first, an "access token," is a genuinely short-lived JWT (commonly on the order of minutes) used for the actual per-request authentication on most routes — it is verified purely via signature and expiry, with no database lookup, keeping the vast majority of requests fast and stateless in exactly the way a pure JWT is designed to be. The second, a "refresh token," is a longer-lived credential that IS stored server-side (in a database) and IS individually revocable, but it is used only occasionally — specifically, to obtain a brand-new access token once the short-lived one expires, rather than being sent with every single request. This balances the core trade-off this lesson covers directly: the access token\'s short lifetime means that if an account needs to be banned or a login needs to be forcibly revoked, the exposure window before that decision fully takes effect is bounded by a small number of minutes (however long the access token\'s remaining lifetime happens to be) rather than a much longer window, while the vast majority of ordinary requests still avoid a database lookup entirely, since the refresh token\'s server-side check only happens on the comparatively rare occasions a new access token is being issued, not on every request.',
        aHi: 'Ye pattern login par ek ke bajaye do alag tokens issue karta hai. Pehla, ek "access token," ek sach mein chhoti-umar wala JWT hai (aam taur par minutes ke aas-paas) jo zyaadatar routes par asli per-request authentication ke liye istemal hota hai — ye sirf signature aur expiry se verify hota hai, koi database lookup nahi, zyaadatar requests ko bilkul us tarike se tez aur stateless rakhte hue jaise ek pure JWT design kiya gaya hai. Doosra, ek "refresh token," ek lambi-umar wala credential hai jo server-side STORED hai (ek database mein) aur akele REVOCABLE hai, par ye sirf kabhi-kabhi istemal hota hai — khaas taur par, ek bilkul-naya access token paane ke liye ek baar chhoti-umar wala expire ho jaaye, har akeli request ke saath bheje jaane ke bajaye. Ye is lesson mein cover hue mool trade-off ko seedha santulit karta hai: access token ki chhoti umar ka matlab hai ki agar ek account ban ya ek login zabardasti revoke karna chahiye, us faisle ke poori tarah lagu hone se pehle exposure window minutes ki ek chhoti tadaad tak seemit hai (access token ki jitni bhi baaki umar samyog se ho) ek kaafi lambi window ke bajaye, jabki zyaadatar aam requests abhi bhi ek database lookup poori tarah se bachti hain, kyunki refresh token ka server-side check sirf taulnaatmak taur par kam maukon par hota hai jab ek naya access token issue ho raha hota hai, har request par nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken system: an admin ban route updating is_banned, and a JWT-only requireAuth. Log in as a test user, note their token, have an admin ban them, and confirm the exact same token still works on a protected route.',
        taskHi: 'Toota system banao: ek admin ban route jo \`is_banned\` update kare, aur ek JWT-only \`requireAuth\`. Ek test user ki tarah login karo, unka token note karo, ek admin se unhe ban karwaao, aur confirm karo bilkul wahi token abhi bhi ek surakshit route par kaam karta hai.',
        hint: 'Save the token from the login response in a variable or a scratch file so you can reuse the exact same one after the ban, rather than logging in fresh.',
        hintHi: 'Login response se token ko ek variable ya ek scratch file mein save karo taaki tum ban ke baad bilkul wahi dobara istemal kar sako, taaza login karne ke bajaye.',
      },
      {
        task: 'Fix it by adding an is_banned check inside requireAuth. Repeat the exact same test and confirm the previously-working token now correctly receives 403.',
        taskHi: '\`requireAuth\` ke andar ek \`is_banned\` check jodkar theek karo. Bilkul wahi test dohraao aur confirm karo pehle-kaam-karta token ab sahi tarike se 403 paata hai.',
        hint: 'Try un-banning the user afterward and confirm the exact same token starts working again immediately, without needing a fresh login — this directly demonstrates the check reads live state, not the token itself.',
        hintHi: 'Baad mein user ko un-ban karne ki koshish karo aur confirm karo bilkul wahi token turant dobara kaam karna shuru karta hai, taaza login ki zarurat bina — ye seedha dikhaata hai check live state padhta hai, token khud nahi.',
      },
      {
        task: 'Implement the alternative sessions-based version (a sessions table, a cookie holding just the session ID). Confirm banning a user by deleting their session row immediately blocks their next request, with no token involved anywhere.',
        taskHi: 'Vaikalpik sessions-based version lagu karo (ek sessions table, ek cookie jo sirf session ID rakhe). Confirm karo ek user ki session row delete karke ban karna unki agli request turant block karta hai, kahin koi token shaamil bina.',
        hint: 'Compare the two fixed approaches side by side on the same small project — build both, and discuss which one you would choose for a hypothetical high-traffic public API versus a hypothetical internal admin dashboard.',
        hintHi: 'Dono theek tarikon ko ek hi chhote project par saath-saath compare karo — dono banao, aur charcha karo ki tum kaunsa chunoge ek kalpaniya high-traffic public API ke liye versus ek kalpaniya internal admin dashboard ke liye.',
      },
    ],

    keyTakeaways: [
      'A pure JWT check only verifies the token\'s signature and expiration — it says nothing about the current state of the account, so a ban applied after the token was issued does not affect it until it naturally expires.',
      'Adding a database check (a ban flag, a token-version counter) inside the auth middleware restores instant revocability at the cost of one database query per authenticated request.',
      'Traditional server-side sessions store the authoritative "who is logged in" record on the server itself — banning or forcing a logout is always just an ordinary database update, taking effect on the very next request.',
      'The trade-off is real and symmetric: pure JWTs avoid a per-request database lookup entirely but cannot be individually revoked; sessions (and JWT-plus-database-check) require a lookup but are instantly revocable.',
      'Sessions are not an outdated pattern — they remain the standard choice for many production systems, especially traditional server-rendered applications, often backed by Redis for speed.',
      'A common hybrid pattern pairs a genuinely short-lived JWT access token with a longer-lived, server-side, individually revocable refresh token, balancing mostly-stateless speed against a bounded revocation delay.',
    ],
    keyTakeawaysHi: [
      'Ek pure JWT check sirf token ka signature aur expiration verify karta hai — ye account ki abhi ki sthiti ke baare mein kuch nahi kehta, isliye token issue hone ke baad lagu hua ek ban use tab tak asar nahi karta jab tak wo naisargik taur par expire na ho.',
      'Auth middleware ke andar ek database check jodna (ek ban flag, ek token-version counter) turant revocability bahaal karta hai har authenticated request ke liye ek database query ki keemat par.',
      'Traditional server-side sessions "kaun logged in hai" ka adhikrit record server par hi store karte hain — ban karna ya zabardasti logout karna hamesha bas ek aam database update hai, agli hi request par lagu hota hua.',
      'Trade-off asli aur symmetric hai: pure JWTs poori tarah ek per-request database lookup se bachte hain par akele revoke nahi ho sakte; sessions (aur JWT-plus-database-check) ek lookup maangte hain par turant revocable hain.',
      'Sessions koi purana pattern nahi hain — wo kai production systems ke liye standard choice bane hue hain, khaaskar traditional server-rendered applications ke liye, aksar speed ke liye Redis se supported.',
      'Ek aam hybrid pattern ek sach mein chhoti-umar wale JWT access token ko ek lambi-umar wale, server-side, akele revocable refresh token ke saath jodta hai, zyaadatar-stateless speed ko ek seemit revocation deri ke khilaaf santulit karte hue.',
    ],
  },
];
