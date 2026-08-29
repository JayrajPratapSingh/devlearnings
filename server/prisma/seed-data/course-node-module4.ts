/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 1.
 *
 * Password hashing with bcrypt: why storing plaintext passwords is
 * catastrophic on any database breach, why a fast general-purpose hash
 * (SHA-256, MD5) is still dangerously weak for passwords specifically, and
 * why bcrypt's deliberate slowness plus built-in per-password salt is the
 * actual fix. Broken example: a signup route storing req.body.password
 * directly in the users table. Second broken/fixed pair: a fast unsalted
 * SHA-256 hash (crackable via GPU brute force / rainbow tables) versus
 * bcrypt.hash() with a cost factor.
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

export const NODE_MODULE_4: CourseLesson[] = [
  {
    slug: 'password-hashing-bcrypt',
    title: 'Password Hashing: Why Plaintext and Fast Hashes Both Fail',
    titleHi: 'Password Hashing: Plaintext Aur Tez Hashes Dono Kyun Fail Hote Hain',
    description: 'A database breach exposes a "users" table — and every single password in it, exactly as the user typed it, because it was stored as plain text.',
    descriptionHi: 'Ek database breach ek "users" table expose kar deta hai — aur usme har akela password, bilkul jaisa user ne type kiya tha, kyunki wo plain text ki tarah store kiya gaya tha.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A hotel that writes every guest\'s exact suitcase-lock combination on a sticky note kept in a filing cabinet, versus one that has guests set their own combination on a lock the hotel never sees or records at all.** Storing a password as plain text is like a hotel that, when a guest sets a combination on their suitcase lock, writes that exact combination down on a sticky note and files it away "for reference" — completely unnecessary for the hotel\'s actual job (letting the guest lock and unlock their own suitcase), but done anyway. If a thief ever breaks into the filing cabinet, they walk away with the ACTUAL combination to every single guest\'s suitcase, all at once — and because most people reuse the same lock combination on their luggage, their front door, and their office desk, that one stolen note compromises far more than just the suitcase it was meant to protect. A hotel using a fast, generic "note-taking" system instead of a proper vault is only marginally better: writing the combination in a barely-disguised code that any thief with a common decoder ring can unscramble in seconds is still effectively the same failure, just with one extra, trivially removed step. A hotel that gets this right never writes down the actual combination at all — instead, when the guest sets their lock, the hotel runs it through a deliberately slow, one-way scrambling process and files away ONLY the scrambled result, something that cannot be unscrambled back into the original combination even by the hotel itself. When the guest returns and enters their combination again, the hotel runs THAT through the identical slow scrambling process and simply checks whether the two scrambled results match — confirming the guest knows the right combination without the hotel ever needing to know, store, or be capable of reconstructing what that combination actually is.',
      hi: '**Ek hotel jo har guest ke suitcase-lock ka theek combination ek sticky note par likhta hai jo ek filing cabinet mein rakha jaata hai, versus ek jo guests ko apna khud ka combination set karne deta hai ek lock par jise hotel kabhi dekhta ya record karta hi nahi.** Ek password ko plain text ki tarah store karna aise hai jaise ek hotel, jab ek guest apne suitcase lock par ek combination set karta hai, wo bilkul wahi combination ek sticky note par likh deta hai aur use "reference ke liye" file kar deta hai — hotel ke asli kaam ke liye poori tarah faaltu (guest ko apna suitcase lock aur unlock karne dena), par phir bhi kiya jaata hai. Agar koi chor kabhi filing cabinet mein ghus jaaye, wo har akele guest ke suitcase ka ASLI combination lekar chala jaata hai, sab ek saath — aur kyunki zyaadatar log wahi lock combination apne luggage, apne front door, aur apne office desk par dobara istemal karte hain, wo ek churaayi hui note us suitcase se kaafi zyaada compromise karti hai jise bachaane ke liye wo thi. Ek hotel jo iske bajaye ek theek vault ke bajaye ek tez, generic "note-taking" system istemal karta hai sirf thoda sa behtar hai: combination ko ek mushkil-se-chhupaayi hui code mein likhna jise koi bhi chor ek aam decoder ring se seconds mein sulzha sakta hai abhi bhi asar mein wahi nakaami hai, bas ek extra, aasaani se hataayi jaa sakti step ke saath. Ek hotel jo ise sahi karta hai kabhi asli combination likhta hi nahi — iske bajaye, jab guest apna lock set karta hai, hotel use ek jaan-boojhkar dheeme, ek-taraf scrambling process se guzaarta hai aur SIRF scramble kiye nateeje ko file karta hai, kuch aisa jise wapas asli combination mein unscramble nahi kiya ja sakta khud hotel se bhi. Jab guest wapas aata hai aur apna combination dobara daalta hai, hotel USE bhi bilkul waisi hi dheemi scrambling process se guzaarta hai aur bas check karta hai ki kya do scrambled nateeje milte hain — ye confirm karte hue ki guest sahi combination jaanta hai bina hotel ko kabhi jaanne, store karne, ya wo combination asal mein kya hai use dobara bana sakne ki zarurat ke.',
    },

    simple: `**Start broken.** A signup route that stores the password exactly as the user submitted it:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route works perfectly for signup and, paired with a login route comparing \`req.body.password === user.password\`, works perfectly for login too — every manual test passes. The catastrophe is entirely dormant until the moment the database is ever compromised, through any means: a leaked backup file, a misconfigured access rule, a compromised employee credential, an unrelated vulnerability elsewhere in the stack, or a direct attack on the database itself. The instant that happens, an attacker does not need to "crack" anything at all — every single user\'s actual password is sitting right there in the \`password\` column, in plain readable text, exactly as each person typed it. Because a large fraction of people reuse the same password across multiple unrelated sites, this single breach frequently compromises far more than just the one application — email accounts, banking logins, and anywhere else that password happens to also be used.

**First fix, still incomplete: a fast general-purpose hash**

\`\`\`js
const crypto = require("crypto");

const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

Hashing the password before storing it — running it through a one-way function that turns it into a fixed-length string the original cannot be mathematically reversed from — is a real improvement over plain text, but SHA-256 (and similarly, MD5) were designed to be GENERAL-PURPOSE hash functions, prized specifically for being extremely fast, useful for things like verifying a downloaded file was not corrupted. That exact speed is a serious liability for password hashing specifically: modern hardware, especially GPUs built for parallel computation, can compute billions of SHA-256 hashes per second, meaning an attacker who obtains the hashed passwords can simply try guessing millions of common passwords per second until one produces a matching hash (a "brute-force" attack), or use a precomputed "rainbow table" — a massive, pre-built lookup table mapping common passwords to their SHA-256 hashes — to instantly reverse a huge fraction of real-world passwords with no computation at all.

**The actual fix: bcrypt, deliberately slow and automatically salted**

\`\`\`js
const bcrypt = require("bcrypt");

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

\`\`\`ts
import bcrypt from "bcrypt";

const saltRounds = 12;
const hashedPassword: string = await bcrypt.hash(password, saltRounds);
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

\`bcrypt\` is a hashing algorithm designed SPECIFICALLY for passwords, with two properties that directly address SHA-256\'s weaknesses. First, it is deliberately, tunably slow — the \`saltRounds\` argument (also called the "cost factor") controls exactly how slow, with each increment roughly doubling the computation time; a value like 12 might take on the order of a couple hundred milliseconds per hash, utterly negligible for a real user logging in once, but devastating for an attacker who needs to try millions or billions of guesses. Second, bcrypt automatically generates a random "salt" — extra random data mixed into the password before hashing — for every single password, and embeds that salt directly inside its own output string, so no two identical passwords ever produce the same stored hash, which defeats rainbow tables entirely, since a precomputed table would need a separate entry for every possible salt value, an astronomically larger table than is feasible to build.`,

    simpleHi: `**Toote hue se shuru.** Ek signup route jo password ko bilkul waisa store karta hai jaisa user ne submit kiya:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye route signup ke liye bilkul theek kaam karta hai, aur \`req.body.password === user.password\` compare karte ek login route ke saath jode, login ke liye bhi bilkul theek kaam karta hai — har manual test paas hota hai. Aafat poori tarah tab tak so'i rehti hai jab tak database kabhi compromise nahi hota, kisi bhi tarike se: ek leak hui backup file, ek galat-configure kiya access rule, ek compromise hua employee credential, stack mein kahin aur ek na-judi vulnerability, ya database par khud ek seedha attack. Jis pal ye hota hai, ek attacker ko kuch bhi "crack" karne ki zarurat nahi hai — har akele user ka asli password bilkul wahin baitha hai \`password\` column mein, plain padhne-laayak text mein, bilkul jaisa har insaan ne type kiya tha. Kyunki logon ka ek bada hissa wahi password kai na-judi sites mein dobara istemal karta hai, ye akela breach aksar sirf ek application se kaafi zyaada compromise karta hai — email accounts, banking logins, aur kahin aur bhi jahan wo password samyog se istemal hota hai.

**Pehla fix, abhi bhi adhoora: ek tez general-purpose hash**

\`\`\`js
const crypto = require("crypto");

const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

Password ko store karne se pehle hash karna — use ek-taraf function se guzaarna jo use ek fixed-length string mein badal deta hai jisse asli ko mathematically wapas nahi paaya ja sakta — plain text se ek asli sudhaar hai, par SHA-256 (aur usi tarah, MD5) GENERAL-PURPOSE hash functions ki tarah design hue the, khaas taur par bahut tez hone ke liye pasand kiye gaye, un cheezon ke liye kaam ke jaise ye verify karna ki ek download ki hui file kharab nahi hui. Wahi khaas tezi password hashing ke liye khaas taur par ek gambhir kamzori hai: modern hardware, khaaskar parallel computation ke liye bane GPUs, prati second arbon SHA-256 hashes calculate kar sakte hain, matlab ek attacker jo hashed passwords paata hai bas lakhon aam passwords guess karne ki koshish kar sakta hai prati second jab tak koi ek milta hash na de ("brute-force" attack), ya ek pehle se banaayi hui "rainbow table" istemal kar sakta hai — ek bahut badi, pehle se banaayi hui lookup table jo aam passwords ko unke SHA-256 hashes se map karti hai — bina kisi computation ke turant asli-duniya passwords ke ek bade hisse ko ulta karne ke liye.

**Asli fix: bcrypt, jaan-boojhkar dheema aur apne aap salted**

\`\`\`js
const bcrypt = require("bcrypt");

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

\`\`\`ts
import bcrypt from "bcrypt";

const saltRounds = 12;
const hashedPassword: string = await bcrypt.hash(password, saltRounds);
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
\`\`\`

\`bcrypt\` ek hashing algorithm hai jo passwords ke liye KHAAS taur par design hua hai, do properties ke saath jo seedhe taur par SHA-256 ki kamzoriyon ko sambhaalte hain. Pehla, ye jaan-boojhkar, tune-karne-laayak dheema hai — \`saltRounds\` argument (jise "cost factor" bhi kaha jaata hai) bilkul control karta hai ki kitna dheema, har increment lagbhag computation time double karte hue; 12 jaisa ek value ek hash ke liye lagbhag kuch sau milliseconds le sakta hai, ek asli user ke ek baar login karne ke liye poori tarah mamuli, par ek attacker ke liye vinaashak jise lakhon ya arbon guesses try karne chahiye. Doosra, bcrypt apne aap ek random "salt" banaata hai — extra random data jo hashing se pehle password mein mix hota hai — har akele password ke liye, aur us salt ko seedha apne output string ke andar embed karta hai, isliye do identical passwords kabhi wahi stored hash nahi paida karte, jo rainbow tables ko poori tarah haraata hai, kyunki ek pehle se banaayi table ko har mumkin salt value ke liye ek alag entry chahiye hogi, ek astronomically badi table jo banaana mumkin nahi hai.`,

    content: `## Login: bcrypt.compare(), never re-hash and re-check equality by hand

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Verifying a login attempt does not mean re-hashing the submitted password and comparing it as a plain string to the stored hash with \`===\` — because bcrypt embeds a random, different salt inside every hash it produces, hashing the same password twice, independently, produces two DIFFERENT-looking output strings, even though both represent the same underlying password. \`bcrypt.compare(plainPassword, storedHash)\` handles this correctly: it reads the salt back out of the stored hash itself, re-runs the exact same hashing process using that same salt against the freshly submitted plain-text password, and only then compares the two results — this is the only correct way to check a password against a bcrypt hash, and it is why bcrypt is always used as a matched pair of functions (\`hash\` for storing, \`compare\` for verifying), never as \`hash\` alone with manual string comparison.

## Choosing a cost factor: a real trade-off between security and login latency

\`\`\`js
// A higher saltRounds value is more resistant to brute-force, but slower for every real login
await bcrypt.hash(password, 10);  // faster, lower cost — a common minimum
await bcrypt.hash(password, 12);  // a common, more conservative default as of this writing
await bcrypt.hash(password, 14);  // noticeably slower per hash, meaningfully more resistant
\`\`\`

The \`saltRounds\` value is not an arbitrary number — it is a genuine trade-off knob between two competing concerns: a higher value means an attacker attempting to brute-force a stolen hash needs proportionally more computation per guess (each increment roughly doubles the work), but it also means every single legitimate login on the application takes proportionally longer, since the exact same slow computation runs for a real user typing their correct password. Because computing hardware gets faster over time, a cost factor considered adequately slow today may become inadequate in the future purely because attackers\' hardware has caught up — this is precisely why the value is configurable rather than fixed, and why security guidance around an appropriate minimum tends to shift upward gradually over the years.

## bcrypt is not the only option: understanding the broader category

\`\`\`js
// argon2 — a newer, also widely recommended password-hashing algorithm
import argon2 from "argon2";
const hash = await argon2.hash(password);
const matches = await argon2.verify(hash, password);
\`\`\`

bcrypt is an extremely common, well-established choice, but it belongs to a broader category of algorithms specifically designed to be slow and resistant to specialized cracking hardware — \`scrypt\` (also memory-intensive, making it costlier to attack with GPUs specifically) and \`argon2\` (the winner of a public password-hashing algorithm competition, and increasingly recommended as a modern default) are two other names in the same category, each with a slightly different API but the exact same core idea: deliberately expensive, one-way, uniquely salted per password. The specific choice of bcrypt versus argon2 versus scrypt matters less for a beginner\'s understanding than internalizing the category itself — a fast general-purpose hash function (SHA-256, MD5) is fundamentally the wrong tool for passwords, regardless of which specific slow, purpose-built algorithm replaces it.

## Never log, return, or expose the hash — treat it as sensitive as the plaintext would be

\`\`\`js
// WRONG — the hashed password should never appear in an API response, even hashed
res.status(201).json(result.rows[0]);  // if result.rows[0] includes the "password" column, this leaks it

// RIGHT — explicitly select or strip out the password column before responding
const result = await pool.query(
  "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
  [email, hashedPassword]
);
\`\`\`

Even though a bcrypt hash cannot be feasibly reversed back into the original password, it should still never be included in an API response, a log line, or anywhere else outside the database and the authentication logic that needs it — exposing the hash gives an attacker material to brute-force offline (using the same GPU-based attacks discussed earlier, just aimed at the hash directly rather than needing to first steal it from the database), and there is no legitimate reason any part of the application outside the login/signup logic itself ever needs to see it. The \`RETURNING id, email\` clause in the signup example above is a deliberate habit worth adopting broadly: explicitly listing which columns a query returns, rather than reflexively returning an entire row, forces a moment of consideration about whether every field being sent back is actually meant to leave the server.`,

    contentHi: `## Login: \`bcrypt.compare()\`, kabhi haath se re-hash aur equality check mat karo

\`\`\`js
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek login koshish verify karne ka matlab submitted password ko dobara hash karke stored hash se \`===\` se ek plain string ki tarah compare karna nahi hai — kyunki bcrypt har hash ke andar jo wo banaata hai ek random, alag salt embed karta hai, wahi password ko do baar, alag-alag, hash karna do ALAG-dikhte output strings paida karta hai, chahe dono wahi underlying password represent karte hon. \`bcrypt.compare(plainPassword, storedHash)\` ise sahi tarike se sambhaalta hai: ye stored hash se hi salt wapas padhta hai, us hi salt ka istemal karte hue bilkul wahi hashing process taaza submit hue plain-text password ke khilaaf dobara chalaata hai, aur sirf tab dono nateejon ko compare karta hai — ye ek bcrypt hash ke khilaaf ek password check karne ka aikela sahi tarika hai, aur isi wajah se bcrypt hamesha functions ke ek jode ki tarah istemal hota hai (\`hash\` store karne ke liye, \`compare\` verify karne ke liye), kabhi \`hash\` akela manual string comparison ke saath nahi.

## Ek cost factor chunna: security aur login latency ke beech ek asli trade-off

\`\`\`js
// Ek zyaada oonchi saltRounds value brute-force ke khilaaf zyaada resistant hai, par har asli login ke liye dheemi
await bcrypt.hash(password, 10);  // tez, kam cost — ek aam minimum
await bcrypt.hash(password, 12);  // ek aam, zyaada rakshaatmak default is likhne ke waqt
await bcrypt.hash(password, 14);  // pratyek hash ke liye kaafi dheema, maayne-rakhta zyaada resistant
\`\`\`

\`saltRounds\` value koi manmaani sankhya nahi hai — ye do pratispardhi chintaon ke beech ek asli trade-off knob hai: ek zyaada oonchi value ka matlab hai ek attacker jo ek churaayi hui hash ko brute-force karne ki koshish kar raha hai use har guess ke liye anupaat mein zyaada computation chahiye (har increment lagbhag kaam double karta hai), par iska matlab ye bhi hai ki application par har akela asli login anupaat mein zyaada waqt leta hai, kyunki bilkul wahi dheemi computation ek asli user ke apna sahi password type karne ke liye bhi chalti hai. Kyunki computing hardware waqt ke saath tez hota jaata hai, ek cost factor jo aaj kaafi dheema maana jaata hai bhavishya mein anupaat mein kam ho sakta hai sirf isliye kyunki attackers ka hardware pakad chuka hai — bilkul isi wajah se value fixed ke bajaye configurable hai, aur isi wajah se ek theek minimum ke aas-paas security margdarshan saalon mein dheere-dheere oopar badhta hai.

## bcrypt aikela vikalp nahi hai: badi category samajhna

\`\`\`js
// argon2 — ek nayi, bhi vyapak taur par sujhaayi jaane wali password-hashing algorithm
import argon2 from "argon2";
const hash = await argon2.hash(password);
const matches = await argon2.verify(hash, password);
\`\`\`

bcrypt ek bahut aam, achhi tarah sthaapit choice hai, par ye algorithms ki ek badi category ka hissa hai jo khaas taur par dheema aur khaas cracking hardware ke khilaaf resistant hone ke liye design hui hai — \`scrypt\` (bhi memory-intensive, jo use GPUs se khaas taur par attack karna mehenga banaata hai) aur \`argon2\` (ek saarvajanik password-hashing algorithm competition ka vijeta, aur badhte taur par ek modern default ki tarah sujhaaya jaata hai) usi category mein do aur naam hain, har ek thodi alag API ke saath par bilkul wahi mool socch: jaan-boojhkar mehenga, ek-taraf, har password ke liye alag-alag salted. bcrypt versus argon2 versus scrypt ki khaas choice ek shuruaati ke samajhne ke liye utni maayne nahi rakhti jitna khud us category ko andar-hi-andar samajhna — ek tez general-purpose hash function (SHA-256, MD5) passwords ke liye buniyaadi taur par galat aujaar hai, chahe koi bhi khaas dheema, khaas-taur-par-bana algorithm use replace kare.

## Kabhi hash ko log, return, ya expose mat karo — use utna hi sensitive treat karo jitna plaintext hota

\`\`\`js
// GALAT — hashed password kabhi ek API response mein nahi dikhna chahiye, hashed hote hue bhi
res.status(201).json(result.rows[0]);  // agar result.rows[0] mein "password" column shaamil hai, ye use leak karta hai

// SAHI — password column ko explicitly select ya strip karo jawaab dene se pehle
const result = await pool.query(
  "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
  [email, hashedPassword]
);
\`\`\`

Chahe ek bcrypt hash asli password mein wapas mumkin taur par reverse na kiya jaa sake, use abhi bhi kabhi ek API response, ek log line, ya database aur authentication logic ke bahar kahin aur shaamil nahi hona chahiye jise iski zarurat hai — hash expose karna ek attacker ko offline brute-force karne ke liye saamagri deta hai (upar charcha kiye gaye wahi GPU-based attacks istemal karte hue, bas seedha hash ko nishaana banaate hue pehle database se churaane ke bajaye), aur koi legitimate wajah nahi hai ki application ka koi bhi hissa login/signup logic ke bahar ise kabhi dekhne ki zarurat rakhe. Upar signup example mein \`RETURNING id, email\` clause ek jaan-boojhkar aadat hai jise vyapak taur par apnaana kaam ka hai: explicitly ye list karna ki ek query kaunse columns lautaati hai, ek poori row ko reflexively lautaane ke bajaye, ek pal ka soch-vichaar force karta hai ki kya har field jo wapas bheja jaa raha hai asal mein server se bahar jaane ke liye hai.`,

    examples: [
      {
        title: 'Broken: signup stores the password exactly as submitted',
        titleHi: 'Toota: signup password ko bilkul submit hue jaisa store karta hai',
        code: `await pool.query(
  "INSERT INTO users (email, password) VALUES ($1, $2)",
  [email, password]
);
// a database breach exposes every user's actual password, unmodified`,
        codeJs: `app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about WHAT is stored, not any type mismatch.`,
        output: `Signup and a naive "password === user.password" login both work
correctly for every manual test. On any database breach, every user's
real password is exposed as plain, readable text.`,
        explain: 'Nothing about this route is functionally broken for a normal user — the danger is dormant until the database is compromised through any means, at which point it is catastrophic and immediate.',
        explainHi: 'Is route mein ek aam user ke liye functionally kuch bhi toota nahi hai — khatra tab tak so\'a hai jab tak database kisi bhi tarike se compromise nahi hota, us pal ye vinaashak aur turant hota hai.',
      },
      {
        title: 'Still weak: a fast, unsalted hash (SHA-256) is brute-forceable',
        titleHi: 'Abhi bhi kamzor: ek tez, un-salted hash (SHA-256) brute-force ho sakta hai',
        code: `const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
// billions of guesses per second on modern GPU hardware`,
        codeJs: `const crypto = require("crypto");

app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import crypto from "crypto";

app.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const hashedPassword: string = crypto.createHash("sha256").update(password).digest("hex");
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        output: `A database breach no longer exposes the exact original password
directly, but SHA-256's speed lets an attacker brute-force or use a
precomputed rainbow table to recover a large fraction of real-world
passwords with relatively little effort.`,
        explain: 'SHA-256 is a real improvement over plain text, but it was designed for speed, not for resisting attackers — the exact property that makes it useful elsewhere (fast computation) is the property that makes it weak here.',
        explainHi: 'SHA-256 plain text se ek asli sudhaar hai, par ye speed ke liye design hua tha, attackers ka virodh karne ke liye nahi — bilkul wo property jo ise kahin aur kaam ka banaati hai (tez computation) wahi property ise yahan kamzor banaati hai.',
      },
      {
        title: 'Fixed: bcrypt.hash() on signup, bcrypt.compare() on login',
        titleHi: 'Theek: signup par bcrypt.hash(), login par bcrypt.compare()',
        code: `const hashedPassword = await bcrypt.hash(password, 12);
// ...later, on login...
const matches = await bcrypt.compare(submittedPassword, storedHash);`,
        codeJs: `const bcrypt = require("bcrypt");

app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import bcrypt from "bcrypt";

app.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const hashedPassword: string = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const result = await pool.query<{ id: number; email: string; password: string }>(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ message: "Logged in", userId: user.id });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A database breach now exposes only bcrypt hashes — deliberately slow
to compute and uniquely salted per password, making both brute-force
and rainbow-table attacks impractical at scale.`,
        outputTs: `// Identical behaviour. bcrypt.hash and bcrypt.compare are both
// Promise-based, correctly typed as returning Promise<string> and
// Promise<boolean> respectively.`,
        explain: 'bcrypt.compare handles re-extracting the salt from the stored hash internally — it is never correct to manually re-hash and compare with === for the reasons covered in this lesson.',
        explainHi: '\`bcrypt.compare\` stored hash se salt andar hi andar dobara nikaalna sambhaalta hai — manually dobara hash karke \`===\` se compare karna is lesson mein cover ki gayi wajahon se kabhi sahi nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
// storing the raw, submitted password directly`,
        right: `const hashedPassword = await bcrypt.hash(password, 12);
await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
// storing a bcrypt hash, never the original password`,
        why: 'Plain-text passwords turn any database breach, through any cause, into an immediate, total exposure of every user\'s actual password — a risk made worse by widespread password reuse across sites.',
        whyHi: 'Plain-text passwords kisi bhi wajah se ek database breach ko har user ke asli password ka ek turant, poora exposure bana dete hain — ek khatra jo sites ke aar-paar vyapak password reuse se aur bhi bura ban jaata hai.',
      },
      {
        wrong: `const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
// fast, unsalted, brute-forceable with modern GPU hardware`,
        right: `const hashedPassword = await bcrypt.hash(password, 12);
// deliberately slow, uniquely salted per password`,
        why: 'General-purpose hash functions like SHA-256 are designed for speed, the opposite of what password hashing needs — an attacker with the stolen hashes can compute billions of guesses per second, and unsalted hashes are vulnerable to precomputed rainbow tables.',
        whyHi: 'SHA-256 jaise general-purpose hash functions speed ke liye design hue hain, jo password hashing ki zarurat ke bilkul ulta hai — churaayi hui hashes wala ek attacker prati second arbon guesses calculate kar sakta hai, aur un-salted hashes rainbow tables ke aage vulnerable hain.',
      },
      {
        wrong: `const hashedAttempt = await bcrypt.hash(submittedPassword, 12);
if (hashedAttempt === user.password) { /* ... */ }
// re-hashing and comparing strings directly — will almost always fail`,
        right: `const matches = await bcrypt.compare(submittedPassword, user.password);
if (matches) { /* ... */ }
// bcrypt.compare correctly re-uses the salt embedded in the stored hash`,
        why: 'bcrypt embeds a different random salt in every hash it produces, so hashing the same password twice independently produces two different-looking strings — bcrypt.compare is the only correct way to verify a password against a stored bcrypt hash.',
        whyHi: 'bcrypt har hash mein jo wo banaata hai ek alag random salt embed karta hai, isliye wahi password ko do baar alag-alag hash karna do alag-dikhte strings paida karta hai — \`bcrypt.compare\` ek stored bcrypt hash ke khilaaf ek password verify karne ka aikela sahi tarika hai.',
      },
    ],

    realWorld: [
      {
        en: '**Real, publicly reported data breaches involving plain-text or weakly-hashed passwords have exposed hundreds of millions of user accounts across major companies** — this is not a hypothetical, academic risk, but one with a long, well-documented history of genuinely happening to real production systems.',
        hi: '**Asli, saarvajanik roop se report hue data breaches jinmein plain-text ya kamzor-hash kiye passwords shaamil the, badi companies mein sainkdon millions user accounts expose kar chuke hain** — ye koi kalpaniya, academic khatra nahi hai, balki ek lambi, achhi tarah documented history hai jo asal mein real production systems ke saath hoti hai.',
      },
      {
        en: '**OWASP\'s official password storage guidance explicitly recommends bcrypt, scrypt, or argon2 and explicitly warns against general-purpose hash functions like SHA-256 or MD5 for passwords** — this is settled, widely agreed-upon industry guidance, not a matter of personal preference.',
        hi: '**OWASP ki official password storage guidance explicitly bcrypt, scrypt, ya argon2 ki sifarish karti hai aur passwords ke liye SHA-256 ya MD5 jaise general-purpose hash functions ke khilaaf explicitly chetaavani deti hai** — ye tay, vyapak taur par sehmat industry guidance hai, personal pasand ka maamla nahi.',
      },
      {
        en: '**Authentication-as-a-service platforms (Auth0, Clerk, Firebase Authentication, and similar) handle password hashing internally using exactly this same category of algorithm** — a team choosing to build its own auth instead of using such a service takes on the responsibility of getting this specific detail right, which is exactly why this lesson exists.',
        hi: '**Authentication-as-a-service platforms (Auth0, Clerk, Firebase Authentication, aur waise hi) password hashing ko andar hi andar bilkul isi kism ke algorithm ka istemal karke sambhaalte hain** — ek team jo aisi service istemal karne ke bajaye apna khud ka auth banaane ka faisla leti hai wo is khaas detail ko sahi karne ki zimmedaari uthaati hai, jo bilkul isi wajah se ye lesson maujood hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is storing a password as plain text dangerous even if the database itself is never directly attacked by an outsider?',
        qHi: 'Ek password ko plain text ki tarah store karna khatarnaak kyun hai chahe database khud kabhi seedha ek bahari dwara attack na ho?',
        a: 'A database can be exposed through many routes that have nothing to do with a direct attack on the database itself — a misconfigured backup that ends up in a publicly accessible storage bucket, an employee\'s compromised laptop or credentials granting unintended access, a vulnerability in a completely different, unrelated part of the application stack that happens to grant broader access than intended, or a third-party service the application integrates with being compromised and leaking credentials that in turn expose the database. Plain-text password storage means that ANY of these unrelated failure modes, however it happens, immediately and completely exposes every user\'s actual password with zero additional work required from whoever gains access — there is no cracking, no computation, no delay, just direct readable exposure. This is precisely why password hashing is treated as a mandatory baseline rather than an optional hardening step: it specifically protects against the password itself being useful to an attacker even after some other, entirely separate security failure has already occurred and given them access to the stored data.',
        aHi: 'Ek database kai raaston se expose ho sakta hai jinka database par khud ek seedha attack se koi lena-dena nahi — ek galat-configure hui backup jo ek saarvajanik-taur-par-access-hone-laayak storage bucket mein khatam ho jaati hai, ek employee ka compromise hua laptop ya credentials jo anaay-koshit access de dete hain, application stack ke ek poori tarah alag, na-jude hisse mein ek vulnerability jo samyog se soche gaye se zyaada wyaapak access deti hai, ya ek third-party service jise application integrate karta hai compromise ho jaana aur credentials leak karna jo badle mein database expose karte hain. Plain-text password storage ka matlab hai ki INMEIN SE KOI BHI na-judi failure mode, jaise bhi ho, turant aur poori tarah har user ka asli password expose kar deta hai bina us kisi ke se koi extra kaam chahiye jo access paata hai — koi cracking nahi, koi computation nahi, koi deri nahi, bas seedha padhne-laayak exposure. Bilkul isi wajah se password hashing ko ek anivaarya baseline ki tarah treat kiya jaata hai, ek vaikalpik hardening step ke bajaye: ye khaas taur par password ko khud attacker ke liye kaam ka hone se bachaata hai chahe koi doosra, poori tarah alag security failure pehle se ho chuka ho aur unhe stored data tak access de chuka ho.',
      },
      {
        q: 'Why is a fast, general-purpose hash function like SHA-256 considered dangerously weak for hashing passwords specifically, even though it is a real, mathematically one-way hash function?',
        qHi: 'SHA-256 jaisa ek tez, general-purpose hash function khaas taur par passwords hash karne ke liye khatarnaak kamzor kyun maana jaata hai, chahe ye ek asli, mathematically ek-taraf hash function ho?',
        a: 'SHA-256 genuinely is a one-way function in the sense that there is no direct mathematical formula to reverse a hash back into its original input — but password cracking in practice does not rely on mathematically reversing the hash function at all. Instead, an attacker who has obtained a set of hashed passwords simply tries hashing a very large number of GUESSES (common passwords, dictionary words, previously leaked passwords from other breaches) and checks whether any guess\'s hash matches one of the stolen hashes. SHA-256\'s core design goal is raw computational speed, useful for things like checksums, and modern hardware — particularly GPUs, which are built for exactly this kind of massively parallel, repetitive computation — can compute billions of SHA-256 hashes per second, letting an attacker try an enormous number of guesses in a short amount of time. A hashing algorithm specifically designed for passwords, like bcrypt, is deliberately, tunably slow to compute — the same billions-of-guesses-per-second approach that works against SHA-256 becomes computationally infeasible against bcrypt, because each individual guess now costs meaningfully more time and computing resources to check, even though bcrypt is, in the same mathematical sense, no more "reversible" than SHA-256 is.',
        aHi: 'SHA-256 sach mein ek-taraf function hai is matlab mein ki ek hash ko wapas uske asli input mein ulta karne ka koi seedha mathematical formula nahi hai — par practice mein password cracking hash function ko mathematically ulta karne par bharosa karta hi nahi. Iske bajaye, ek attacker jise hashed passwords ka ek set mila hai bas bahut badi tadaad ke GUESSES (aam passwords, dictionary words, doosre breaches se pehle leak hue passwords) hash karne ki koshish karta hai aur check karta hai ki kya kisi guess ka hash churaayi hui hashes mein se kisi se milta hai. SHA-256 ka mool design lakshya raw computational speed hai, checksums jaisi cheezon ke liye kaam ka, aur modern hardware — khaaskar GPUs, jo bilkul isi kism ke bade-paimaane-par-parallel, dohraaye jaane wale computation ke liye bane hain — prati second arbon SHA-256 hashes calculate kar sakte hain, ek attacker ko thodi der mein bahut zyaada guesses try karne dete hue. Ek hashing algorithm jo khaas taur par passwords ke liye design hui hai, jaise bcrypt, jaan-boojhkar, tune-karne-laayak dheemi hai calculate karna — wahi arbon-guesses-prati-second tarika jo SHA-256 ke khilaaf kaam karta hai bcrypt ke khilaaf computationally namumkin ban jaata hai, kyunki ab har akela guess check karne mein maayne-rakhta zyaada waqt aur computing resources lagte hain, chahe bcrypt, usi mathematical matlab mein, SHA-256 se zyaada "reversible" na ho.',
      },
      {
        q: 'Why does bcrypt.compare() need to be used to verify a login, instead of simply hashing the submitted password again and comparing it with === to the stored hash?',
        qHi: 'Ek login verify karne ke liye \`bcrypt.compare()\` ka istemal kyun karna chahiye, submit hue password ko dobara hash karke stored hash se \`===\` se compare karne ke bajaye?',
        a: 'bcrypt generates a fresh, random "salt" — extra random data — every single time it hashes a password, and embeds that salt directly within its own output string alongside the actual hash. This means hashing the exact same password twice, independently, with two separate bcrypt.hash() calls, produces two different-looking output strings, since each call generates its own random salt. If a login route naively re-hashed the submitted password with a new call to bcrypt.hash() and compared the result to the stored hash with ===, the comparison would essentially always fail, even when the submitted password is genuinely correct, because the newly generated salt would almost certainly differ from the salt embedded in the originally stored hash. bcrypt.compare(submittedPassword, storedHash) solves this correctly by first extracting the salt that is already embedded inside the stored hash, then re-running bcrypt\'s hashing process on the submitted password using that SAME salt, and only then comparing the two resulting hashes — this reconstructs the exact conditions under which the original hash was produced, making a correct comparison possible, which is precisely why bcrypt.hash() and bcrypt.compare() must always be used together as a matched pair rather than substituting a second bcrypt.hash() call plus manual string equality.',
        aHi: 'bcrypt har akeli baar jab ye ek password hash karta hai ek taaza, random "salt" — extra random data — banaata hai, aur us salt ko seedha apne output string ke andar asli hash ke saath embed karta hai. Iska matlab hai wahi password ko do baar, alag-alag, do alag \`bcrypt.hash()\` calls se hash karna do alag-dikhte output strings paida karta hai, kyunki har call apna khud ka random salt banaata hai. Agar ek login route bhola-bhaala submit hue password ko \`bcrypt.hash()\` ke ek nayi call se dobara hash karta aur nateeje ko stored hash se \`===\` se compare karta, comparison asar mein hamesha fail hota, chahe submit kiya password sach mein sahi ho, kyunki naya banaaya salt lagbhag hamesha asli stored hash mein embed kiye salt se alag hoga. \`bcrypt.compare(submittedPassword, storedHash)\` ise sahi tarike se solve karta hai pehle wo salt nikaalte hue jo pehle se stored hash ke andar embed hai, phir bcrypt ka hashing process submit hue password par us hi SALT ka istemal karte hue dobara chalaate hue, aur sirf tab do nateeja hue hashes ko compare karte hue — ye bilkul un sthiti ko dobara banaata hai jinme asli hash paida hua tha, ek sahi comparison mumkin banaate hue, jo bilkul isi wajah se \`bcrypt.hash()\` aur \`bcrypt.compare()\` ko hamesha ek jode ki tarah saath istemal karna chahiye, dusri \`bcrypt.hash()\` call plus manual string equality ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken signup route storing plain-text passwords. Sign up a test user, query the database directly, and confirm the password column contains the exact text typed.',
        taskHi: 'Plain-text passwords store karne wala toota signup route banao. Ek test user signup karo, database ko seedha query karo, aur confirm karo password column mein bilkul wahi text hai jo type kiya gaya tha.',
        hint: 'Use any database client or a quick pool.query("SELECT * FROM users") in a scratch script to look at the raw stored row.',
        hintHi: 'Koi bhi database client istemal karo ya raw stored row dekhne ke liye ek scratch script mein ek jaldi \`pool.query("SELECT * FROM users")\`.',
      },
      {
        task: 'Fix it with bcrypt.hash() on signup and bcrypt.compare() on login. Confirm login succeeds with the correct password and fails with an incorrect one, and confirm the stored hash looks nothing like the original password.',
        taskHi: 'Signup par \`bcrypt.hash()\` aur login par \`bcrypt.compare()\` se theek karo. Confirm karo login sahi password se safal hota hai aur galat se fail hota hai, aur confirm karo stored hash asli password jaisa bilkul nahi dikhta.',
        hint: 'Sign up the same password twice under two different emails, and confirm the two stored hashes look completely different from each other despite being the same password — direct evidence of the random salt.',
        hintHi: 'Wahi password do baar do alag emails ke neeche signup karo, aur confirm karo do stored hashes ek-doosre se poori tarah alag dikhte hain wahi password hone ke bawajood — random salt ka seedha saboot.',
      },
      {
        task: 'Time how long bcrypt.hash() takes with saltRounds of 8, 12, and 14. Observe the roughly-doubling pattern and discuss what cost factor you would pick for a real production login route, and why.',
        taskHi: '\`saltRounds\` 8, 12, aur 14 ke saath \`bcrypt.hash()\` kitna waqt leta hai naapo. Lagbhag-double-hone wala pattern dekho aur charcha karo ki ek asli production login route ke liye tum kaunsa cost factor chunoge, aur kyun.',
        hint: 'console.time("hash") / console.timeEnd("hash") wrapped directly around the await bcrypt.hash(...) call is the simplest way to measure this.',
        hintHi: '\`console.time("hash")\` / \`console.timeEnd("hash")\` seedha \`await bcrypt.hash(...)\` call ke aas-paas lapeta hua ise naapne ka sabse saadha tarika hai.',
      },
    ],

    keyTakeaways: [
      'Storing a password as plain text means any database breach, through any cause, immediately and completely exposes every user\'s actual password with zero additional attacker effort.',
      'Fast general-purpose hash functions like SHA-256 or MD5 are dangerously weak for passwords specifically — modern hardware can compute billions of guesses per second, and unsalted hashes are vulnerable to precomputed rainbow tables.',
      'bcrypt is designed specifically for passwords: it is deliberately, tunably slow (via the saltRounds cost factor) and automatically embeds a unique random salt in every hash, defeating both brute-force speed and rainbow tables.',
      'bcrypt.compare(submittedPassword, storedHash) is the only correct way to verify a login — it extracts the salt already embedded in the stored hash and re-hashes the submission with that same salt before comparing.',
      'The saltRounds cost factor is a genuine trade-off between brute-force resistance and real-user login latency — higher values are more secure but slow down every legitimate login too.',
      'A password hash, even though it cannot be feasibly reversed, should never appear in an API response, log line, or anywhere outside the authentication logic that needs it.',
    ],
    keyTakeawaysHi: [
      'Ek password ko plain text ki tarah store karna matlab hai koi bhi database breach, kisi bhi wajah se, turant aur poori tarah har user ka asli password expose kar deta hai bina attacker ke koi extra koshish ke.',
      'SHA-256 ya MD5 jaise tez general-purpose hash functions khaas taur par passwords ke liye khatarnaak kamzor hain — modern hardware prati second arbon guesses calculate kar sakta hai, aur un-salted hashes precomputed rainbow tables ke aage vulnerable hain.',
      'bcrypt khaas taur par passwords ke liye design hua hai: ye jaan-boojhkar, tune-karne-laayak dheema hai (\`saltRounds\` cost factor ke through) aur apne aap har hash mein ek unique random salt embed karta hai, brute-force speed aur rainbow tables dono ko haraate hue.',
      '\`bcrypt.compare(submittedPassword, storedHash)\` ek login verify karne ka aikela sahi tarika hai — ye stored hash mein pehle se embed salt nikaalta hai aur compare karne se pehle submission ko usi salt se dobara hash karta hai.',
      '\`saltRounds\` cost factor brute-force resistance aur asli-user login latency ke beech ek asli trade-off hai — oonchi values zyaada surakshit hain par har legitimate login ko bhi dheema karti hain.',
      'Ek password hash, chahe use mumkin taur par reverse na kiya jaa sake, kabhi ek API response, log line, ya authentication logic ke bahar kahin bhi nahi dikhna chahiye jise iski zarurat hai.',
    ],
  },
];
