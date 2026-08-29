/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 5
 * (final lesson of the module).
 *
 * Rate limiting: why a login route with no limit on attempts lets an
 * attacker try millions of password guesses against a single account with
 * no obstacle at all, even though the password itself is safely bcrypt-
 * hashed (Module 4, lesson 1) and the request itself is otherwise perfectly
 * valid. Broken example: an unlimited /login route, brute-forced with a
 * simple script trying a password list. Fixed with express-rate-limit,
 * capping attempts per IP within a time window. Also covers rate limiting
 * as a broader defense (not just login), where limit state actually lives,
 * and a brief mention of helmet as a related, complementary practice.
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

export const NODE_MODULE_4_PART5: CourseLesson[] = [
  {
    slug: 'rate-limiting',
    title: 'Rate Limiting: Stopping Unlimited Login Attempts and Abuse',
    titleHi: 'Rate Limiting: Anlimited Login Koshishen Aur Durupyog Rokna',
    description: 'A script tries 2 million password guesses against one account overnight — every single request perfectly valid, bcrypt working exactly as designed, and nothing in the way at all.',
    descriptionHi: 'Ek script ek raat mein ek account ke khilaaf 20 lakh password guesses try karta hai — har akeli request bilkul valid, bcrypt bilkul design ke hisaab se kaam karta hua, aur raaste mein bilkul kuch nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A bank vault door that lets anyone standing in front of it try an unlimited number of combinations, one after another, forever, versus one that locks the entire mechanism for fifteen minutes after five wrong attempts.** A login route with no limit on attempts is like a vault door that never objects to how many times someone tries a combination — each individual attempt is handled completely correctly (the door checks the combination, compares it properly, and responds "no" if it is wrong), but nothing about the door itself imposes any cost or delay on trying again immediately afterward. A patient attacker with nothing but time can simply stand there and try combination after combination, for as many hours as it takes, and the vault provides no resistance to this at all beyond the sheer number of possible combinations — which, for a human-chosen password rather than a truly random one, is often far smaller than it should be. A vault designed correctly instead notices the PATTERN of repeated failures, not just any single attempt in isolation: after five wrong combinations within a short window, the entire mechanism locks itself for a fixed cooldown period, refusing to accept ANY combination — even the correct one — until that period passes. This does not make the vault meaningfully less convenient for its actual owner, who rarely mistypes their combination five times in a row, but it makes an attacker\'s brute-force strategy of "just keep trying" fundamentally impractical, turning what would be hours of unobstructed guessing into a process that could take months or years once the cooldown is factored in.',
      hi: '**Ek bank vault door jo apne saamne khade kisi ko bhi ek na-simit tadaad mein combinations try karne deta hai, ek ke baad ek, hamesha ke liye, versus ek jo paanch galat koshishon ke baad poore mechanism ko pandrah minute ke liye lock kar deta hai.** Koshishon par koi seemaa na rakhne wala ek login route ek aise vault door jaisa hai jo kabhi ye aapatti nahi karta ki koi kitni baar ek combination try karta hai — har akeli koshish poori tarah sahi tarike se sambhaali jaati hai (door combination check karta hai, use sahi tarike se compare karta hai, aur "nahi" jawaab deta hai agar galat ho), par door khud kisi bhi cheez par turant baad dobara koshish karne mein koi keemat ya deri nahi lagaata. Ek dhairyavaan attacker jiske paas sirf waqt hai bas wahin khada rehkar combination-dar-combination try kar sakta hai, jitne bhi ghante lagein, aur vault iske khilaaf mumkin combinations ki mahaz tadaad ke alaawa bilkul koi virodh nahi karta — jo, ek insaan-chuni password ke liye ek sach mein random ke bajaye, aksar utna chhota hota hai jitna hona nahi chahiye. Ek sahi tarike se design kiya vault iske bajaye dohraaye jaane wali asafalta ke PATTERN ko notice karta hai, akele mein sirf ek koshish nahi: ek chhoti window mein paanch galat combinations ke baad, poora mechanism khud ko ek fixed cooldown period ke liye lock kar deta hai, KISI BHI combination ko accept karne se mana karte hue — sahi wala bhi — jab tak wo period na guzre. Ye vault ko uske asli maalik ke liye maayne-rakhta kam suvidhaajanak nahi banaata, jo shaayad hi apna combination lagaataar paanch baar galat type kare, par ye ek attacker ki "bas try karte raho" wali brute-force strategy ko buniyaadi taur par gair-vyavhaarik banaata hai, jo ghante bina-rukaawat guessing hoti wo cooldown ko hisaab mein rakhte hue mahine ya saal le sakne wali ek process bana deta hai.',
    },

    simple: `**Start broken.** A login route with no limit at all on how many attempts a single client can make:

\`\`\`js
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
\`\`\`

Every individual line in this route is correct, following every practice covered in this module so far: passwords are bcrypt-hashed and compared with \`bcrypt.compare()\` (never in plain text), SQL is parameterized, a signed JWT is issued only after a successful check. And yet, a simple script — a loop trying every password from a list of a few million common or previously leaked passwords, sending each one to \`POST /login\` with a fixed \`email\`, one after another — faces absolutely no obstacle at all. There is no limit on how many times this route may be called by the same client, in the same short span of time, so the script can send thousands of attempts per minute, all day and all night, with nothing about the route itself slowing it down or refusing to answer. Because bcrypt is deliberately slow (Module 4, lesson 1), each individual guess costs the ATTACKER some real time too — but for a sufficiently weak or common real password, sending a few million guesses across a list of known common passwords remains entirely realistic within hours, especially if the attacker runs many guesses in parallel across multiple connections. Bcrypt protects the password\'s stored HASH from being reversed if the database itself leaks; it does nothing at all to stop someone from simply trying password after password against the live, running login route.

**The fix: express-rate-limit, capping attempts within a time window**

\`\`\`js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per IP per window
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req, res, next) => {
  // ...exact same login logic as before...
});
\`\`\`

\`\`\`ts
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // ...exact same login logic as before...
});
\`\`\`

\`express-rate-limit\`, following the same middleware pattern used throughout this course, tracks how many requests each individual client (identified, by default, by IP address) has made within a rolling time window, and once that count exceeds \`max\`, it responds directly with the configured \`message\` and a \`429 Too Many Requests\` status — the route\'s own actual login logic never even runs for requests over the limit, since the rate limiter is registered as middleware BEFORE the route handler, following the established Express ordering rule. A genuine user who mistypes their password once or twice is barely inconvenienced by a limit of, say, 5 attempts per 15 minutes; an attacker attempting to try millions of guesses is reduced to a pace of 5 attempts per 15 minutes PER IP ADDRESS, turning a brute-force attack that could otherwise complete in hours into one that would take an impractically long time, without ever needing to touch the login logic\'s own correctness.`,

    simpleHi: `**Toote hue se shuru.** Ek login route jismein koi seemaa nahi hai ki ek akela client kitni koshishen kar sakta hai:

\`\`\`js
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
\`\`\`

Is route ki har akeli line sahi hai, ab tak is module mein cover hui har practice ka palan karti hui: passwords bcrypt-hashed hain aur \`bcrypt.compare()\` se compare kiye jaate hain (kabhi plain text mein nahi), SQL parameterized hai, ek signed JWT sirf ek safal check ke baad issue hota hai. Aur phir bhi, ek saadha script — ek loop jo kuch millions aam ya pehle-leak-hue passwords ki ek list mein se har password try karta hai, har ek ko \`POST /login\` ko ek fixed \`email\` ke saath bhejte hue, ek ke baad ek — bilkul koi rukaawat nahi paata. Koi seemaa nahi hai ki ye route wahi client, wahi chhoti waqt ki avdhi mein, kitni baar bulaaya jaa sakta hai, isliye script prati minute hazaaron koshishen bhej sakta hai, din-raat, route khud kuch bhi ise dheema karta ya jawaab dene se mana karta bina. Kyunki bcrypt jaan-boojhkar dheema hai (Module 4, lesson 1), har akeli guess ATTACKER ko bhi kuch asli waqt lagti hai — par ek kaafi kamzor ya aam asli password ke liye, jaane-pehchaane aam passwords ki ek list ke aar-paar kuch millions guesses bhejna ghanton ke andar poori tarah waastavik rehta hai, khaaskar agar attacker kai connections ke aar-paar kai guesses parallel mein chalaata hai. Bcrypt password ke stored HASH ko reverse hone se bachaata hai agar database khud leak ho jaaye; ye kisi ke bhi live, chal rahe login route ke khilaaf bas password-dar-password try karne se rokne ke liye bilkul kuch nahi karta.

**Fix: \`express-rate-limit\`, ek waqt ki window ke andar koshishon ko simit karna**

\`\`\`js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 5,                    // prati IP prati window 5 koshishen
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req, res, next) => {
  // ...bilkul wahi login logic jaisi pehle thi...
});
\`\`\`

\`\`\`ts
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // ...bilkul wahi login logic jaisi pehle thi...
});
\`\`\`

\`express-rate-limit\`, is course mein bhar mein istemal hue usi middleware pattern ka palan karte hue, track karta hai ki har akele client (default taur par, IP address se pehchaana) ne ek chalti waqt ki window mein kitni requests ki hain, aur ek baar wo count \`max\` se aage jaata hai, ye seedha configure kiye \`message\` aur ek \`429 Too Many Requests\` status ke saath jawaab deta hai — route ki apni asli login logic seemaa se oopar requests ke liye kabhi chalti hi nahi, kyunki rate limiter route handler se PEHLE middleware ki tarah register hota hai, sthapit Express ordering rule ka palan karte hue. Ek asli user jo apna password ek ya do baar galat type karta hai ek simaa se, maano 5 koshishen prati 15 minute, mushkil se hi taklif mein aata hai; ek attacker jo millions guesses try karne ki koshish karta hai 5 koshishen prati 15 minute PRATI IP ADDRESS ki raftaar tak ghata diya jaata hai, ek brute-force attack ko jo warna ghanton mein poora ho sakta tha ek aise mein badalte hue jismein gair-vyavhaarik lamba waqt lagega, login logic ki apni sahi-hone ko kabhi chhue bina.`,

    content: `## Where rate limit state actually lives, and why this matters at scale

\`\`\`js
// express-rate-limit's default store is in-memory — fine for a single server instance
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// With multiple server instances behind a load balancer, a shared store is required
const RedisStore = require("rate-limit-redis");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: new RedisStore({ client: redisClient }),
});
\`\`\`

By default, \`express-rate-limit\` tracks each client\'s request count in memory, inside the single running Node.js process — this works correctly and simply for a single server instance, but breaks down the moment an application is scaled across multiple server instances behind a load balancer (a common production setup covered later in this course), because each instance would then keep its OWN separate count, meaning an attacker could effectively multiply their allowed attempts by however many instances happen to be running, since a load balancer might route their requests round-robin across all of them. Production systems handle this by using a shared store — Redis is the most common choice — so that every server instance checks and updates the SAME counter for a given client, correctly enforcing one true limit regardless of how many instances are actually running.

## Rate limiting is a general defense, not only for login routes

\`\`\`js
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", apiLimiter); // a broader, more generous limit across the whole API

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/login", strictLimiter, loginHandler);
app.post("/signup", strictLimiter, signupHandler);
app.post("/forgot-password", strictLimiter, forgotPasswordHandler);
\`\`\`

While a brute-force login attack is this lesson\'s central example, unrestricted request volume is a real problem for essentially any route — an attacker (or simply a buggy client retrying too aggressively) hammering an expensive search endpoint, a signup route being abused to create thousands of fake accounts, or a password-reset route being used to spam a specific email address with reset emails are all separate, realistic problems the exact same tool addresses. It is common, and reasonable, to apply a stricter limit specifically to sensitive routes (login, signup, password reset — anywhere a guessing or spamming attack has an obvious, concrete payoff for an attacker) while applying a more generous, general limit across an entire API purely as a baseline defense against runaway traffic of any kind, whatever its cause.

## Rate limiting complements, but does not replace, the rest of this module\'s protections

\`\`\`js
// Rate limiting slows down brute-forcing, but bcrypt (lesson 1) is still what makes
// a leaked password hash resistant to being reversed at all, and JWT verification
// (lesson 2) is still what prevents a forged identity claim
\`\`\`

It is worth being explicit that rate limiting solves a specific, narrow problem — restricting how FAST or how OFTEN a given client can make requests — and does not substitute for any of the other protections covered earlier in this module: it does nothing to protect a password if the database itself is breached (that is bcrypt\'s job), nothing to verify a request\'s claimed identity (that is JWT verification\'s job), and nothing to stop a request from a legitimate-looking but different client entirely (an attacker distributing their guesses across many different IP addresses, for instance, can partially work around a purely IP-based limit). Rate limiting is best understood as one deliberate LAYER in a broader defense, meaningfully raising the cost and time required for certain classes of attack, rather than a single, complete solution to any one of them on its own.

## A brief, related practice: helmet for baseline HTTP security headers

\`\`\`js
const helmet = require("helmet");
app.use(helmet());
\`\`\`

A commonly paired practice, worth knowing by name even though it is a separate concern from rate limiting itself, is the \`helmet\` middleware — a single line that sets a collection of well-established, broadly recommended HTTP response headers (covering things like preventing a page from being embedded in a malicious iframe, or reducing certain browser-level attack surfaces) that most production Express applications include as an easy, low-effort baseline. It is mentioned here specifically because \`rateLimit()\` and \`helmet()\` are frequently applied together, early in an application\'s middleware chain, as two complementary, broadly applicable pieces of a production security baseline.`,

    contentHi: `## Rate limit state asal mein kahan rehta hai, aur ye scale par kyun maayne rakhta hai

\`\`\`js
// express-rate-limit ka default store in-memory hai — ek akele server instance ke liye theek
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// Ek load balancer ke peeche kai server instances ke saath, ek shared store zaruri hai
const RedisStore = require("rate-limit-redis");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: new RedisStore({ client: redisClient }),
});
\`\`\`

Default taur par, \`express-rate-limit\` har client ka request count memory mein track karta hai, akele chal rahe Node.js process ke andar — ye ek akele server instance ke liye sahi aur saadhe taur par kaam karta hai, par tab toot jaata hai jab ek application ek load balancer ke peeche kai server instances ke aar-paar scale hota hai (is course mein baad mein cover hone wala ek aam production setup), kyunki har instance tab apna KHUD ka alag count rakhega, matlab ek attacker asar mein apni allowed koshishon ko jitni bhi instances chal rahi hon utne se guna kar sakta hai, kyunki ek load balancer unki requests un sabke aar-paar round-robin bhej sakta hai. Production systems ise ek shared store istemal karke sambhaalte hain — Redis sabse aam choice hai — taaki har server instance ek diye gaye client ke liye WAHI counter check aur update kare, sahi tarike se ek asli seemaa lagu karte hue chahe asal mein kitni instances chal rahi hon.

## Rate limiting ek aam bachaav hai, sirf login routes ke liye nahi

\`\`\`js
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", apiLimiter); // poore API ke aar-paar ek zyaada wyaapak, zyaada udaar seemaa

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/login", strictLimiter, loginHandler);
app.post("/signup", strictLimiter, signupHandler);
app.post("/forgot-password", strictLimiter, forgotPasswordHandler);
\`\`\`

Jabki ek brute-force login attack is lesson ka kendriya example hai, na-simit request volume lagbhag kisi bhi route ke liye ek asli samasya hai — ek attacker (ya bas ek buggy client jo bahut aggressively retry karta hai) ek mehenga search endpoint ko peet raha, ek signup route jise hazaaron fake accounts banaane ke liye durupyog kiya jaa raha ho, ya ek password-reset route jise ek khaas email address ko reset emails se spam karne ke liye istemal kiya jaa raha ho sab alag, waastavik samasyaayein hain jinhe bilkul wahi tool sambhaalta hai. Ye aam, aur uchit hai, khaas taur par sensitive routes (login, signup, password reset — kahin bhi jahan ek guessing ya spamming attack ka ek saaf, thos faayda hai ek attacker ke liye) par ek sakht seemaa lagu karna jabki ek poore API ke aar-paar ek zyaada udaar, aam seemaa lagu karna sirf kisi bhi kism ke bhaage-hue traffic ke khilaaf ek baseline bachaav ki tarah, uski wajah jo bhi ho.

## Rate limiting is module ke baaki bachaavon ki poorak hai, unki jagah nahi leta

\`\`\`js
// Rate limiting brute-forcing ko dheema karta hai, par bcrypt (lesson 1) abhi bhi
// wo hai jo ek leak hui password hash ko reverse hone se poori tarah bachaata hai,
// aur JWT verification (lesson 2) abhi bhi wo hai jo ek forge ki hui pehchaan ke
// daave ko rokta hai
\`\`\`

Ye explicit hona kaam ka hai ki rate limiting ek khaas, sankeern samasya solve karta hai — ye simit karna ki ek diya gaya client kitni TEZ ya kitni BAAR requests kar sakta hai — aur is module mein pehle cover hui kisi bhi doosri protection ka substitute nahi banta: ye password ko surakshit karne ke liye kuch nahi karta agar database khud breach ho jaaye (wo bcrypt ka kaam hai), ek request ki daava ki gayi pehchaan verify karne ke liye kuch nahi (wo JWT verification ka kaam hai), aur ek legitimate-dikhte par poori tarah alag client se ek request ko rokne ke liye kuch nahi (ek attacker jo apni guesses kai alag IP addresses mein baant deta hai, misal ke taur par, ek sirf-IP-based seemaa ke aas-paas kuch hisse mein kaam kar sakta hai). Rate limiting ko ek wyaapak bachaav mein ek jaan-boojhkar LAYER ki tarah samajhna sabse achha hai, hamlon ke kuch kisimon ke liye maayne-rakhta keemat aur waqt badhaate hue, akele apne bal par unmein se kisi ek ka poora hal nahi.

## Ek chhota, juda practice: baseline HTTP security headers ke liye helmet

\`\`\`js
const helmet = require("helmet");
app.use(helmet());
\`\`\`

Ek aam taur par jodi jaane wali practice, naam se jaanne kaam ki chahe ye rate limiting khud se ek alag chinta ho, \`helmet\` middleware hai — ek akeli line jo achhi tarah sthaapit, wyaapak taur par sujhaayi jaane wali HTTP response headers ka ek sangrah set karti hai (jismein cheezein shaamil hain jaise ek page ko ek malicious iframe mein embed hone se rokna, ya kuch browser-level attack surfaces ko kam karna) jise zyaadatar production Express applications ek aasaan, kam-koshish wali baseline ki tarah shaamil karti hain. Ye yahan khaas taur par isliye mention kiya gaya hai kyunki \`rateLimit()\` aur \`helmet()\` aksar saath istemal hote hain, ek application ki middleware chain mein jaldi, ek production security baseline ke do poorak, wyaapak taur par lagu ki jaane laayak hisson ki tarah.`,

    examples: [
      {
        title: 'Broken: no limit at all on login attempts',
        titleHi: 'Toota: login koshishon par bilkul koi seemaa nahi',
        code: `app.post("/login", async (req, res, next) => {
  // ...bcrypt.compare() check, correct in isolation...
});
// a script can call this thousands of times per minute with no obstacle`,
        codeJs: `app.post("/login", async (req, res, next) => {
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
});`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
// Correctly typed, completely valid, and follows every practice from
// earlier in this module — the missing piece is entirely about volume,
// not correctness.`,
        output: `A script trying a list of a few million common passwords against one
email address runs to completion within hours, entirely unobstructed
by the route itself — bcrypt slows each individual guess, but nothing
limits how many guesses may be attempted in total.`,
        explain: 'Every line of this route is genuinely correct — the vulnerability is not a logic error, it is the complete absence of any limit on repeated calls.',
        explainHi: 'Is route ki har line sach mein sahi hai — vulnerability koi logic error nahi hai, ye dohraayi jaati calls par kisi bhi seemaa ki poori kami hai.',
      },
      {
        title: 'Fixed: express-rate-limit caps attempts within a time window',
        titleHi: 'Theek: \`express-rate-limit\` ek waqt ki window ke andar koshishon ko simit karta hai',
        code: `const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/login", loginLimiter, async (req, res, next) => { /* unchanged */ });`,
        codeJs: `const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req, res, next) => {
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
});`,
        codeTs: `import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

app.post("/login", loginLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
});`,
        outputJs: `The 6th login attempt from the same IP within a 15-minute window
immediately receives 429 Too Many Requests with the configured message
— the route's own login logic never even runs for that request.`,
        outputTs: `// Identical behaviour. The limiter is registered as middleware BEFORE
// the route handler, so it can reject a request before any database
// query or bcrypt comparison ever happens.`,
        explain: 'The exact same login logic from the broken version is untouched — the fix is entirely about what happens BEFORE that logic ever runs, not a change to the logic itself.',
        explainHi: 'Toote version wali bilkul wahi login logic bina chhue hai — fix poori tarah iske baare mein hai ki us logic ke chalne se PEHLE kya hota hai, khud logic mein koi badlaav nahi.',
      },
      {
        title: 'Applying different limits to different routes',
        titleHi: 'Alag-alag routes par alag-alag seemaayein lagu karna',
        code: `const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", generalLimiter);
app.post("/login", strictLimiter, loginHandler);`,
        codeJs: `const rateLimit = require("express-rate-limit");

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use("/api/", generalLimiter);

app.post("/login", strictLimiter, loginHandler);
app.post("/signup", strictLimiter, signupHandler);
app.post("/forgot-password", strictLimiter, forgotPasswordHandler);`,
        codeTs: `import rateLimit from "express-rate-limit";

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use("/api/", generalLimiter);

app.post("/login", strictLimiter, loginHandler);
app.post("/signup", strictLimiter, signupHandler);
app.post("/forgot-password", strictLimiter, forgotPasswordHandler);`,
        outputJs: `Ordinary API browsing tolerates up to 100 requests per 15 minutes per
IP, while login, signup, and password-reset specifically are held to a
much stricter 5 — reflecting that these particular routes carry a
concrete, obvious payoff for an attacker attempting to guess or spam.`,
        outputTs: `// Identical behaviour. Multiple rateLimit() instances can coexist,
// each independently tracking its own window and count per client.`,
        explain: 'A single blanket limit is rarely the right choice — sensitive, attack-relevant routes generally warrant a stricter limit than ordinary browsing traffic across the rest of an API.',
        explainHi: 'Ek akeli sanaatani seemaa shaayad hi sahi choice hai — sensitive, attack-relevant routes ko aam taur par ek poore API ke baaki hisse ke aam browsing traffic se zyaada sakht seemaa chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `app.post("/login", async (req, res, next) => { /* no rate limiter at all */ });
// a script can attempt unlimited password guesses with no obstacle`,
        right: `const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/login", loginLimiter, async (req, res, next) => { /* ... */ });`,
        why: 'Bcrypt makes each individual guess slow, but nothing stops an attacker from simply making a very large number of individually-slow guesses in parallel unless the number of attempts itself is capped.',
        whyHi: 'Bcrypt har akeli guess ko dheema banaata hai, par kuch bhi ek attacker ko bas parallel mein bahut badi tadaad mein akele-akele-dheemi guesses karne se nahi rokta jab tak koshishon ki tadaad khud simit na ho.',
      },
      {
        wrong: `app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 5 })); // applied globally
// ordinary API browsing gets throttled to the same strict limit meant for login`,
        right: `app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), loginHandler);`,
        why: 'A single strict limit meant for a sensitive route like login is often too restrictive for ordinary API browsing — applying different limits to different routes matches the restriction to each route\'s actual risk.',
        whyHi: 'Login jaise ek sensitive route ke liye maani ek akeli sakht seemaa aam API browsing ke liye aksar bahut zyaada sakht hoti hai — alag-alag routes par alag-alag seemaayein lagu karna rok ko har route ke asli khatre se milaata hai.',
      },
      {
        wrong: `const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }); // default in-memory store
// each of 4 load-balanced server instances tracks its own separate count`,
        right: `const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 5,
  store: new RedisStore({ client: redisClient }),
});
// all instances share one true count via Redis`,
        why: 'The default in-memory store tracks counts separately per server process — across multiple load-balanced instances, an attacker\'s effective limit is multiplied by however many instances happen to be running unless a shared store is used.',
        whyHi: 'Default in-memory store counts ko har server process ke liye alag-alag track karta hai — kai load-balanced instances ke aar-paar, ek attacker ki asli seemaa jitni bhi instances chal rahi hon utne se guna ho jaati hai jab tak ek shared store istemal na ho.',
      },
    ],

    realWorld: [
      {
        en: '**Rate limiting a login route is explicitly listed in OWASP\'s guidance on authentication security as a standard, expected defense against credential-stuffing and brute-force attacks** — this is not an optional hardening measure but a widely agreed-upon baseline for any production login system.',
        hi: '**Ek login route ko rate-limit karna OWASP ki authentication security guidance mein credential-stuffing aur brute-force hamlon ke khilaaf ek standard, ummeed ki jaane wali bachaav ki tarah explicitly list hua hai** — ye koi vaikalpik hardening measure nahi hai balki kisi bhi production login system ke liye ek vyapak taur par sehmat baseline hai.',
      },
      {
        en: '**Nearly every major public API (payment providers, social platforms, cloud services) enforces and documents rate limits, returning a standard 429 status and often explicit "retry after N seconds" headers** — rate limiting is not merely a security tool but a routine, expected part of any API a real business exposes to the public.',
        hi: '**Lagbhag har mukhya saarvajanik API (payment providers, social platforms, cloud services) rate limits lagu aur document karta hai, ek standard 429 status aur aksar explicit "retry after N seconds" headers lautaate hue** — rate limiting sirf ek security tool nahi hai balki kisi bhi API ka ek routine, ummeed kiya hissa hai jise ek asli business saarvajanik taur par expose karta hai.',
      },
      {
        en: '**Real, publicly reported "credential stuffing" attacks (trying passwords leaked from one breached site against many other unrelated sites, betting on password reuse) are among the most common real-world account-takeover techniques** — rate limiting a login route is one direct, practical defense specifically against this widespread, well-documented attack pattern.',
        hi: '**Asli, saarvajanik roop se report hue "credential stuffing" hamle (ek breached site se leak hue passwords ko kai doosri na-judi sites ke khilaaf try karna, password reuse par daanv lagaate hue) sabse aam asli-duniya account-takeover techniques mein se hain** — ek login route ko rate-limit karna is vyapak, achhi tarah documented attack pattern ke khilaaf ek seedha, practical bachaav hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does bcrypt-hashing a password not, by itself, prevent a brute-force attack against a live login route?',
        qHi: 'Ek password ko bcrypt-hash karna, akele mein, ek live login route ke khilaaf ek brute-force attack ko kyun nahi rokta?',
        a: 'Bcrypt-hashing a password protects against a specific, different threat: if the database itself is ever breached, the stored hashes cannot feasibly be reversed back into the original passwords, and bcrypt\'s deliberate slowness makes even offline guessing against the leaked hashes computationally expensive. A brute-force attack against a live login route is a completely different scenario — the attacker never sees the stored hash at all; they simply submit a guessed password to the ordinary, public /login endpoint, exactly as a real user would, and observe whether the response indicates success or failure. Bcrypt still runs during this process (the server must call bcrypt.compare() to check the guess), which does slow down each individual attempt somewhat, but nothing about bcrypt\'s existence limits how many total attempts a client is permitted to make, or over what span of time — an attacker willing to wait, or running many guesses in parallel, faces no additional obstacle from bcrypt beyond the per-guess computational cost, which for a sufficiently common or weak password remains entirely practical to overcome within a realistic timeframe. Stopping this specifically requires limiting the NUMBER of attempts a client may make, which is an entirely separate mechanism from how the password is stored.',
        aHi: 'Ek password ko bcrypt-hash karna ek khaas, alag khatre se bachaata hai: agar database khud kabhi breach ho, stored hashes ko mumkin taur par asli passwords mein wapas reverse nahi kiya jaa sakta, aur bcrypt ki jaan-boojhkar dheemi rafttaar leak hui hashes ke khilaaf offline guessing ko bhi computationally mehenga banaati hai. Ek live login route ke khilaaf ek brute-force attack ek poori tarah alag scenario hai — attacker stored hash ko kabhi dekhta hi nahi; wo bas ek guess kiya password aam, saarvajanik \`/login\` endpoint ko submit karta hai, bilkul jaise ek asli user karega, aur dekhta hai ki kya jawaab safalta ya asafalta zaahir karta hai. Bcrypt is process ke dauraan abhi bhi chalta hai (server ko \`bcrypt.compare()\` bulaana chahiye guess check karne ke liye), jo har akeli koshish ko kuch hisse mein dheema karta hai, par bcrypt ke hone ke baare mein kuch bhi simit nahi karta ki ek client kitni kul koshishen karne ki ijaazat hai, ya kitne waqt mein — ek attacker jo intezaar karne ko taiyaar hai, ya kai guesses parallel mein chalaata hai, bcrypt se per-guess computational keemat se aage koi additional rukaawat nahi paata, jo ek kaafi aam ya kamzor password ke liye ek waastavik samay-simaa ke andar poori tarah vyavhaarik rehti hai. Ise khaas taur par rokne ke liye ek client ke liye ijaazat koshishon ki SANKHYA ko simit karna zaruri hai, jo password kaise store hota hai us se poori tarah alag mechanism hai.',
      },
      {
        q: 'How does adding a rate limiter to a login route actually stop or slow a brute-force attack, given that each individual login attempt is still processed exactly as before?',
        qHi: 'Ek login route mein ek rate limiter jodna ek brute-force attack ko asal mein kaise rokta ya dheema karta hai, jab ki har akeli login koshish abhi bhi bilkul pehle jaisi process hoti hai?',
        a: 'A rate limiter is registered as middleware that runs BEFORE the route\'s own login logic, tracking how many requests a specific client (typically identified by IP address) has made within a defined rolling time window. Once that count exceeds the configured maximum, the rate limiter itself responds with a 429 status and rejects the request immediately — critically, the route\'s actual login logic (looking up the user, calling bcrypt.compare, issuing a JWT) never even executes for requests beyond the limit, since Express runs middleware in the order it is registered and the rate limiter short-circuits the request before passing control onward. This does not change how any single, individual login attempt is processed when it IS allowed through — the fix works entirely by controlling how MANY attempts a given client is permitted within a given span of time, not by altering the login logic itself. For a legitimate user, a limit like 5 attempts per 15 minutes is barely noticeable, since genuine users rarely need more than a couple of tries even accounting for typos; for an attacker attempting to try millions of guesses, the same limit forces an enormous slowdown — reducing an attack that might otherwise complete in hours to one that would take an impractically long span of time, all from the same IP address.',
        aHi: 'Ek rate limiter ek middleware ki tarah register hota hai jo route ki apni login logic se PEHLE chalta hai, track karte hue ki ek khaas client (aam taur par IP address se pehchaana) ne ek tay ki gayi chalti waqt ki window mein kitni requests ki hain. Ek baar wo count configure ki gayi maximum se aage jaata hai, rate limiter khud ek 429 status ke saath jawaab deta hai aur request ko turant reject karta hai — bahut zaruri, route ki asli login logic (user dhoondhna, \`bcrypt.compare\` bulaana, ek JWT issue karna) seemaa se aage requests ke liye kabhi chalti hi nahi, kyunki Express middleware ko us kram mein chalaata hai jismein wo register hue hain aur rate limiter request ko aage badhaane se pehle short-circuit kar deta hai. Ye ise nahi badalta ki kisi ek, akeli login koshish ko kaise process kiya jaata hai jab wo aane diya JAATA hai — fix poori tarah isse kaam karta hai ki ek diye gaye client ko ek diye gaye waqt mein kitni koshishon ki ijaazat hai, khud login logic ko badalkar nahi. Ek legitimate user ke liye, 5 koshishen prati 15 minute jaisi ek seemaa mushkil se hi noticeable hai, kyunki asli users ko shaayad hi typos ka hisaab lagaate hue bhi do-teen koshishon se zyaada chahiye; ek attacker ke liye jo millions guesses try karne ki koshish karta hai, wahi seemaa ek bahut badi dheemi karti hai — ek hamla jo warna ghanton mein poora ho sakta tha use ek aisi mein badalte hue jismein gair-vyavhaarik lamba waqt lagega, sab wahi IP address se.',
      },
      {
        q: 'Why does the default in-memory store used by a rate-limiting library become a problem once an application runs on multiple server instances behind a load balancer?',
        qHi: 'Ek rate-limiting library ka default in-memory store ek samasya kyun banta hai ek baar ek application ek load balancer ke peeche kai server instances par chalta hai?',
        a: 'An in-memory rate-limit store keeps its request counts entirely within the memory of one single, running Node.js process — there is no sharing of this data with any other process, since it is simply a data structure living inside that one process\'s own memory space. When an application is scaled horizontally (multiple separate server instances, each an independent Node.js process, running behind a load balancer that distributes incoming requests across them), each instance maintains its own completely separate in-memory count, with no awareness of what any other instance has recorded. A load balancer commonly distributes requests across instances in a round-robin or similarly distributed fashion, meaning an attacker\'s repeated requests are likely to be spread across multiple different instances rather than landing on just one — and since each instance is independently allowing up to the configured maximum before objecting, the attacker\'s EFFECTIVE total allowed request count becomes roughly the configured limit multiplied by however many instances happen to be running, entirely defeating the intended limit. The fix is to use a shared, external store — commonly Redis — that every instance reads from and writes to, ensuring all instances are checking and incrementing the exact same counter for a given client, so the configured limit is enforced correctly as one true total regardless of how many server instances are actually handling traffic.',
        aHi: 'Ek in-memory rate-limit store apne request counts poori tarah ek akele, chal rahe Node.js process ki memory ke andar rakhta hai — is data ko kisi bhi doosre process ke saath saanjha nahi kiya jaata, kyunki ye bas ek data structure hai jo us ek process ki apni memory space ke andar rehta hai. Jab ek application horizontally scale hota hai (kai alag server instances, har ek ek mustaqil Node.js process, ek load balancer ke peeche chalte hue jo aati requests ko unke aar-paar baantta hai), har instance apna poori tarah alag in-memory count rakhta hai, kisi bhi doosre instance ne kya record kiya iske baare mein bekhabar. Ek load balancer aam taur par requests ko instances ke aar-paar round-robin ya usi tarah baante hue distribute karta hai, matlab ek attacker ki dohraayi jaati requests ke ek se zyaada alag instances mein failne ki sambhaavna hai sirf ek mein aane ke bajaye — aur kyunki har instance mustaqil taur par configure ki gayi maximum tak allow kar raha hai aapatti karne se pehle, attacker ka ASLI kul allowed request count lagbhag configure ki gayi seemaa ko jitni bhi instances chal rahi hon utne se guna karke ban jaata hai, iraade ki seemaa ko poori tarah haraate hue. Fix ek shared, bahari store istemal karna hai — aam taur par Redis — jise har instance padhta aur likhta hai, sunishchit karte hue ki sab instances ek diye gaye client ke liye bilkul wahi counter check aur badhaa rahe hain, taaki configure ki gayi seemaa ek asli kul ki tarah sahi tarike se lagu ho chahe asal mein kitni server instances traffic sambhaal rahi hon.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /login route with no rate limiting. Write a simple script that loops through a small list of guessed passwords for one known account and confirm it can attempt all of them with no obstacle at all.',
        taskHi: 'Rate limiting bina wala toota \`/login\` route banao. Ek saadha script likho jo ek jaane-pehchaane account ke liye guessed passwords ki ek chhoti list ke aar-paar loop kare aur confirm karo ye sabko koi rukaawat bina try kar sakta hai.',
        hint: 'A simple for loop calling fetch or axios against your own local server with a small array of common test passwords is enough to demonstrate this.',
        hintHi: 'Ek saadha \`for\` loop jo aam test passwords ke ek chhote array ke saath tumhaare apne local server ke khilaaf \`fetch\` ya \`axios\` bulaata hai ise dikhaane ke liye kaafi hai.',
      },
      {
        task: 'Fix it with express-rate-limit set to a small max (like 5) and a short window for easy testing. Rerun the exact same script and confirm it starts receiving 429 responses partway through.',
        taskHi: '\`express-rate-limit\` se ek chhoti \`max\` (jaise 5) aur aasaan testing ke liye ek chhoti window set karke theek karo. Bilkul wahi script dobara chalaao aur confirm karo ye beech mein 429 responses paana shuru karta hai.',
        hint: 'Set windowMs to something very short (like 10000 for 10 seconds) during testing so you do not have to wait 15 real minutes to see the window reset.',
        hintHi: 'Testing ke dauraan \`windowMs\` ko kuch bahut chhota set karo (jaise 10 second ke liye 10000) taaki tumhe window reset dekhne ke liye 15 asli minute intezaar na karna pade.',
      },
      {
        task: 'Apply a stricter limiter to /login and a more generous one across /api/ generally. Confirm ordinary browsing across several other routes tolerates far more requests before being limited than login does.',
        taskHi: '\`/login\` par ek sakht limiter aur \`/api/\` ke aar-paar aam taur par ek zyaada udaar wala lagu karo. Confirm karo kai doosre routes ke aar-paar aam browsing limit hone se pehle login se kaafi zyaada requests bardaasht karti hai.',
        hint: 'Try genuinely mistyping your own password a couple of times in a row as a real user would, and confirm the limit does not meaningfully get in the way of normal, honest use.',
        hintHi: 'Ek asli user ki tarah apna khud ka password lagaataar do-teen baar sach mein galat type karne ki koshish karo, aur confirm karo seemaa normal, imaandaar istemal ke raaste mein maayne-rakhta nahi aati.',
      },
    ],

    keyTakeaways: [
      'Bcrypt protects a password\'s stored hash from being reversed if the database is breached, but does nothing on its own to limit how many login attempts a client may make against the live route.',
      'express-rate-limit tracks each client\'s request count within a rolling time window and rejects requests over a configured maximum with 429, before the route\'s own logic ever runs.',
      'A rate limiter is registered as middleware before the route handler — this is why it can reject excess requests without the route\'s login logic being touched or changed at all.',
      'Different routes warrant different limits — sensitive, attack-relevant routes (login, signup, password reset) generally need a stricter limit than ordinary API browsing.',
      'The default in-memory store tracks counts per server process — across multiple load-balanced instances, a shared store like Redis is required for one limit to be correctly enforced overall.',
      'Rate limiting is one layer in a broader defense, not a replacement for bcrypt, JWT verification, or any other protection covered earlier in this module — it specifically controls how fast or how often requests may be made.',
    ],
    keyTakeawaysHi: [
      'Bcrypt ek password ke stored hash ko reverse hone se bachaata hai agar database breach ho, par akele mein kuch nahi karta ye simit karne ke liye ki ek client live route ke khilaaf kitni login koshishen kar sakta hai.',
      '\`express-rate-limit\` har client ka request count ek chalti waqt ki window ke andar track karta hai aur ek configure ki gayi maximum se aage requests ko 429 se reject karta hai, route ki apni logic kabhi chalne se pehle.',
      'Ek rate limiter route handler se pehle middleware ki tarah register hota hai — isi wajah se ye extra requests ko reject kar sakta hai route ki login logic ko chhue ya badle bina.',
      'Alag-alag routes ko alag-alag seemaayein chahiye — sensitive, attack-relevant routes (login, signup, password reset) ko aam taur par aam API browsing se zyaada sakht seemaa chahiye.',
      'Default in-memory store counts ko har server process ke hisaab se track karta hai — kai load-balanced instances ke aar-paar, Redis jaisa ek shared store zaruri hai taaki ek seemaa sahi tarike se poori tarah lagu ho.',
      'Rate limiting ek wyaapak bachaav mein ek layer hai, bcrypt, JWT verification, ya is module mein pehle cover hui kisi bhi doosri protection ka substitute nahi — ye khaas taur par control karta hai ki requests kitni tez ya kitni baar ki jaa sakti hain.',
    ],
  },
];
