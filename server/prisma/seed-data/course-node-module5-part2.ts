/**
 * Node.js Complete Course — Module 5: Real-World Patterns & Architecture,
 * lesson 2.
 *
 * File uploads: why saving an uploaded file to disk using the client's own
 * supplied filename, with no size or type restriction, is a real path-
 * traversal and arbitrary-file-upload vulnerability, not merely sloppy code.
 * Broken example: an avatar-upload route that trusts req.files.avatar.name
 * directly as the destination path and accepts any file type or size.
 * Fixed with multer: a server-generated filename (never the client's own),
 * an explicit file-type allowlist, and a hard size limit.
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

export const NODE_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'file-uploads',
    title: 'File Uploads: Why Trusting a Client-Supplied Filename Is Dangerous',
    titleHi: 'File Uploads: Client-Diye Filename Par Bharosa Karna Khatarnaak Kyun Hai',
    description: 'An avatar upload named "../../../../etc/passwd" — because the server saved the file exactly where the client\'s own filename told it to.',
    descriptionHi: 'Ek avatar upload jiska naam "../../../../etc/passwd" hai — kyunki server ne file bilkul wahin save ki jahan client ke apne filename ne use bataaya.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A hotel mail room that files incoming packages into whatever slot the sender wrote on the label, versus one that assigns every package its own tracking number and stores it accordingly, regardless of what the sender wrote.** Saving an uploaded file using the name the client provided is like a mail room clerk who, receiving a package labeled "put this in slot: manager\'s-personal-safe," simply does exactly that without ever questioning whether the sender should have any say in where their own package ends up — the label was meant to be a friendly suggestion, at most, not an instruction the clerk should blindly obey. A sender with bad intentions can write literally anything on that label, including a path that walks the mail room\'s own internal directory structure right out of the "packages" area entirely and into somewhere far more sensitive, like "../../manager\'s-office/safe-combination-book" — and a clerk with no independent judgment about where things are allowed to go will file it exactly there, having no concept that a label is not the same thing as actual authorization. A properly run mail room instead assigns its OWN tracking number to every incoming package the instant it arrives — completely ignoring whatever the sender wrote as a label — and files it into a slot the mail room itself controls, based on that internal number; the sender\'s label might still be kept as a note of what the package claims to contain, but it is never, ever used to decide WHERE the package physically goes.',
      hi: '**Ek hotel mail room jo aane wale packages ko jis bhi slot mein sender ne label par likha hai us mein file karta hai, versus ek jo har package ko apna khud ka tracking number deta hai aur uske hisaab se store karta hai, sender ne jo bhi likha ho uski parwaah kiye bina.** Ek upload ki hui file ko client ne diye naam se save karna ek mail room clerk jaisa hai jo, ek package paate hue jismein label likha hai "ise slot mein daalo: manager-ki-personal-safe," bilkul wahi karta hai bina kabhi ye poochhe ki sender ko is baat mein kuch bhi kehna chahiye ki unka khud ka package kahan khatam hota hai — label sabse zyaada ek dostana sujhaav hona chahiye tha, ek hidaayat nahi jise clerk ko andhe taur par maanna chahiye. Bure iraade wala ek sender us label par literally kuch bhi likh sakta hai, ek raasta sameet jo mail room ki apni internal directory sanrachna ko chalte hue "packages" area se poori tarah bahar aur kahin zyaada sensitive jagah tak jaata hai, jaise "../../manager-ka-office/safe-combination-book" — aur ek clerk jiske paas ye faisla karne ki koi mustaqil samajh nahi hai ki cheezein kahan jaane ki ijaazat hai bilkul wahin file karega, ye samajhe bina ki ek label wahi cheez nahi hai jo asli adhikaar. Ek theek tarike se chalaaya mail room iske bajaye har aane wale package ko us pal apna KHUD ka tracking number deta hai jab wo pahunchta hai — sender ne label ki tarah jo bhi likha ho use poori tarah nazarandaaz karte hue — aur use ek slot mein file karta hai jise mail room khud control karta hai, us internal number ke aadhaar par; sender ka label shaayad ab bhi ek note ki tarah rakha jaaye jismein likha ho package kya hone ka daava karta hai, par ise kabhi, kabhi bhi ye faisla karne ke liye istemal nahi kiya jaata ki package physically KAHAN jaata hai.',
    },

    simple: `**Start broken.** An avatar upload route that saves the file directly using the client\'s own supplied filename, with no restriction on type or size:

\`\`\`js
app.post("/avatar", (req, res, next) => {
  const file = req.files.avatar;
  const uploadPath = \`./uploads/\${file.name}\`;

  file.mv(uploadPath, (err) => {
    if (err) return next(err);
    res.json({ message: "Avatar uploaded", path: uploadPath });
  });
});
\`\`\`

For an ordinary user uploading a genuine photo named \`profile.jpg\`, this route works exactly as intended — the file lands in \`./uploads/profile.jpg\`, and everything appears to function correctly. The catastrophic flaw is that \`file.name\` is entirely client-controlled — it comes directly from the upload request, and the server does nothing at all to validate, sanitize, or restrict it before using it to construct a real filesystem path. An attacker can set the uploaded file\'s name to something like \`../../../../etc/passwd\` (on a Linux server) or a path targeting any other file the running Node.js process has permission to write to — the \`../\` sequences are a standard filesystem convention meaning "go up one directory," and nothing in this code strips or rejects them, so \`file.mv()\` faithfully writes the uploaded content to wherever that constructed path actually resolves to, potentially overwriting a genuinely sensitive system file, another user\'s existing upload, or even the application\'s own source code. Separately, and just as seriously, this route places no restriction on the FILE\'S OWN TYPE or SIZE at all — an attacker can upload a multi-gigabyte file (exhausting the server\'s disk space) or a file that is not an image at all, such as an executable script, which becomes a serious additional risk if the \`uploads\` folder is ever served as static, publicly accessible content.

**The fix: multer, with a server-generated filename, a type allowlist, and a size limit**

\`\`\`js
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = \`\${crypto.randomUUID()}\${ext}\`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req, res) => {
  res.json({ message: "Avatar uploaded", filename: req.file.filename });
});
\`\`\`

\`\`\`ts
import multer from "multer";
import crypto from "crypto";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = \`\${crypto.randomUUID()}\${ext}\`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req: Request, res: Response): void => {
  res.json({ message: "Avatar uploaded", filename: req.file?.filename });
});
\`\`\`

Three separate, deliberate changes fix three separate problems. First, the destination filename is generated entirely by the SERVER (\`crypto.randomUUID()\`, following the same pattern used for session IDs earlier in this course) — the client\'s original filename is used only to read its extension, never as any part of the actual save path, which makes a path-traversal payload in the original filename structurally irrelevant, since it never reaches the actual file-writing step at all. Second, \`fileFilter\` checks the file\'s reported MIME type against an explicit allowlist before accepting it, rejecting anything that is not genuinely one of the expected image types. Third, \`limits.fileSize\` caps how large any single upload may be, rejecting anything larger before it can exhaust server disk space. None of these three fixes make the route\'s core purpose — accepting an avatar image — any different from a legitimate user\'s point of view; they only remove the specific ways the original code let an attacker\'s input control something it should never have been able to control.`,

    simpleHi: `**Toote hue se shuru.** Ek avatar upload route jo file ko seedha client ke diye naam se save karta hai, type ya size par koi rok bina:

\`\`\`js
app.post("/avatar", (req, res, next) => {
  const file = req.files.avatar;
  const uploadPath = \`./uploads/\${file.name}\`;

  file.mv(uploadPath, (err) => {
    if (err) return next(err);
    res.json({ message: "Avatar uploaded", path: uploadPath });
  });
});
\`\`\`

Ek aam user ke liye \`profile.jpg\` naam se ek asli photo upload karte hue, ye route bilkul iraade ke hisaab se kaam karta hai — file \`./uploads/profile.jpg\` mein pahunchti hai, aur sab kuch sahi tarike se kaam karta dikhta hai. Vinaashak kami ye hai ki \`file.name\` poori tarah client-controlled hai — ye seedha upload request se aata hai, aur server ise ek asli filesystem path banaane ke liye istemal karne se pehle validate, sanitize, ya simit karne ke liye bilkul kuch nahi karta. Ek attacker upload ki hui file ka naam kuch aisa set kar sakta hai jaise \`../../../../etc/passwd\` (ek Linux server par) ya ek path jo kisi bhi doosri file ko nishaana banaata hai jise chal raha Node.js process likhne ki ijaazat rakhta hai — \`../\` sequences ek standard filesystem convention hain jinka matlab hai "ek directory oopar jaao," aur is code mein kuch bhi unhe hataata ya reject nahi karta, isliye \`file.mv()\` imandaari se upload hue content ko wahin likhta hai jahan wo banaaya gaya path asal mein resolve hota hai, mumkin taur par ek sach mein sensitive system file, ek doosre user ki maujooda upload, ya application ke apne source code ko bhi overwrite karte hue. Alag se, aur utna hi gambhir taur par, ye route FILE KI APNI KISM ya SIZE par bilkul koi rok nahi rakhta — ek attacker ek multi-gigabyte file upload kar sakta hai (server ki disk space khatam karte hue) ya ek aisi file jo bilkul koi image nahi hai, jaise ek executable script, jo ek gambhir additional khatra ban jaata hai agar \`uploads\` folder kabhi static, saarvajanik-taur-par-access-hone-laayak content ki tarah serve hota hai.

**Fix: multer, ek server-generated filename, ek type allowlist, aur ek size limit ke saath**

\`\`\`js
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = \`\${crypto.randomUUID()}\${ext}\`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req, res) => {
  res.json({ message: "Avatar uploaded", filename: req.file.filename });
});
\`\`\`

\`\`\`ts
import multer from "multer";
import crypto from "crypto";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = \`\${crypto.randomUUID()}\${ext}\`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req: Request, res: Response): void => {
  res.json({ message: "Avatar uploaded", filename: req.file?.filename });
});
\`\`\`

Teen alag, jaan-boojhkar badlaav teen alag samasyaayein theek karte hain. Pehla, destination filename poori tarah SERVER dwara banaaya jaata hai (\`crypto.randomUUID()\`, is course mein pehle session IDs ke liye istemal hue usi pattern ka palan karte hue) — client ka asli filename sirf uska extension padhne ke liye istemal hota hai, kabhi asli save path ka hissa nahi, jo asli filename mein ek path-traversal payload ko sanrachnaatmak taur par bemaani banaata hai, kyunki ye kabhi asli file-likhne wale step tak pahunchta hi nahi. Doosra, \`fileFilter\` file ki batayi hui MIME type ko ek explicit allowlist ke khilaaf check karta hai use accept karne se pehle, kisi bhi cheez ko reject karte hue jo sach mein ummeed ki gayi image types mein se ek nahi hai. Teesra, \`limits.fileSize\` simit karta hai ki koi bhi akeli upload kitni badi ho sakti hai, kisi bhi bade cheez ko server disk space khatam karne se pehle reject karte hue. Inmein se koi bhi teen fixes route ke mool maqsad ko — ek avatar image accept karna — ek legitimate user ke nazariye se kuch bhi alag nahi banaate; wo sirf un khaas tarikon ko hataate hain jinse asli code ek attacker ke input ko kuch aisa control karne diya jo use kabhi control karne ki ijaazat honi hi nahi chahiye thi.`,

    content: `## Why the client's original filename must be used only as data, never as a path

\`\`\`js
// WRONG — the client's filename becomes part of a real filesystem path
const uploadPath = \`./uploads/\${file.name}\`;

// RIGHT — the original filename is read only for its extension, never used as a path
const ext = path.extname(file.originalname);
const safeName = \`\${crypto.randomUUID()}\${ext}\`;
\`\`\`

The deeper principle behind this lesson\'s fix is the same one covered in the SQL-injection lesson earlier in this course: user-controlled input must never be allowed to become part of a system\'s STRUCTURE (a SQL query\'s logic there, a filesystem path here) — it must only ever be treated as plain DATA. \`path.extname()\` extracts only the file extension portion of the client\'s filename (\`.jpg\`, \`.png\`), which is then appended to a server-generated random identifier — even if an attacker\'s filename contains a malicious path like \`../../../../etc/passwd.jpg\`, only the harmless \`.jpg\` extension is ever extracted and used; the directory-traversal portion is discarded entirely, because it was never given the opportunity to be interpreted as part of a path in the first place.

## Validating by MIME type is a real defense, but not an absolute one

\`\`\`js
fileFilter: (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
  cb(null, true);
},
\`\`\`

\`file.mimetype\` is reported by the CLIENT as part of the upload request (typically derived from the file\'s extension or the browser\'s own detection), which means, like any other client-supplied value, it can in principle be spoofed by a deliberately malicious client sending a fabricated MIME type alongside genuinely different file content. Checking it is still a meaningfully useful first layer of defense — it correctly rejects the overwhelming majority of accidental or casual misuse (a user\'s browser correctly reporting a non-image file) — but for an application with a serious need to verify a file\'s TRUE type regardless of what the client claims, a more thorough approach involves inspecting the file\'s actual binary content after upload (checking for a known "magic number" signature specific to genuine image formats) rather than trusting the client-reported MIME type alone; this deeper verification is a natural next step for a production system handling untrusted uploads at serious scale, beyond this lesson\'s introductory scope.

## Where uploaded files should be served from, and why "inside the app\'s own served static folder" is often unwise

\`\`\`js
// Risky pattern: uploads land in a folder also served as static, executable-adjacent content
app.use(express.static("./public"));
// if uploads also land in ./public, an uploaded .html or .svg file could execute as a page

// Safer: a separate, non-executable-serving location, or a dedicated object storage service
\`\`\`

Beyond validating type and size on the way in, it is worth briefly noting where accepted files end up being served FROM afterward — if uploaded files are placed inside the same directory Express serves as static content via \`express.static()\`, a file that passed validation as "an accepted type" (an SVG image can itself contain embedded script content, for instance) may still be served back to other users\' browsers in a way that executes unwanted behavior, a concern beyond this lesson\'s immediate filename/size scope but directly related to it. Production systems commonly address this by uploading to a separate object storage service (like Amazon S3) specifically configured to serve files without treating any of them as executable content, rather than saving directly alongside the application\'s own served static assets — a pattern this course\'s later deployment content revisits in more depth.

## multer\'s error-handling shape: a specific error class to check for

\`\`\`js
app.post("/avatar", upload.single("avatar"), (req, res, next) => {
  res.json({ message: "Avatar uploaded", filename: req.file.filename });
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});
\`\`\`

Following this course\'s earlier centralized-error-handling lesson, multer-specific failures (a file exceeding \`limits.fileSize\`, or a \`fileFilter\` rejection) are surfaced as an instance of \`multer.MulterError\` (or a plain \`Error\` from a custom \`fileFilter\` rejection), which can be checked for specifically to return a clean, appropriate \`400\` response — distinct from an unrelated \`500\`-level server error — following the same \`AppError\`-style pattern this course has used for other categories of expected, recoverable failure.`,

    contentHi: `## Client ka asli filename sirf data ki tarah kyun istemal hona chahiye, kabhi ek path ki tarah nahi

\`\`\`js
// GALAT — client ka filename ek asli filesystem path ka hissa ban jaata hai
const uploadPath = \`./uploads/\${file.name}\`;

// SAHI — asli filename sirf uska extension padhne ke liye padha jaata hai, kabhi path ki tarah istemal nahi
const ext = path.extname(file.originalname);
const safeName = \`\${crypto.randomUUID()}\${ext}\`;
\`\`\`

Is lesson ke fix ke peeche gehra principle wahi hai jo is course mein pehle SQL-injection lesson mein cover hua: user-controlled input ko kabhi ek system ki SANRACHNA ka hissa banne nahi dena chahiye (wahan ek SQL query ki logic, yahan ek filesystem path) — ise hamesha sirf plain DATA ki tarah treat kiya jaana chahiye. \`path.extname()\` client ke filename ka sirf extension hissa nikaalta hai (\`.jpg\`, \`.png\`), jo phir ek server-generated random identifier mein jode jaata hai — chahe ek attacker ka filename ek malicious path rakhta ho jaisa \`../../../../etc/passwd.jpg\`, sirf harmless \`.jpg\` extension hi kabhi nikaala aur istemal hota hai; directory-traversal hissa poori tarah chhod diya jaata hai, kyunki use kabhi ek path ke hisse ki tarah interpret hone ka mauka mila hi nahi.

## MIME type se validate karna ek asli bachaav hai, par ek absolute nahi

\`\`\`js
fileFilter: (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
  cb(null, true);
},
\`\`\`

\`file.mimetype\` upload request ke hisse ki tarah CLIENT dwara report kiya jaata hai (aam taur par file ke extension ya browser ki apni detection se nikaala jaata hai), jiska matlab hai, kisi bhi doosre client-diye value ki tarah, ise sidhaant mein ek jaan-boojhkar malicious client dwara spoof kiya ja sakta hai poori tarah alag file content ke saath ek fabricate ki gayi MIME type bhejte hue. Ise check karna abhi bhi bachaav ki ek maayne-rakhta kaam ki pehli layer hai — ye sahi tarike se galti se ya casual durupyog ki bahut badi tadaad ko reject karta hai (ek user ka browser sahi tarike se ek non-image file report karta hai) — par ek application ke liye jise client jo bhi daava kare uski parwaah kiye bina ek file ki ASLI kism verify karne ki gambhir zarurat hai, ek zyaada poori tarah tarika upload ke baad file ki asli binary content check karne mein shaamil hai (asli image formats ke liye khaas ek jaana-pehchaana "magic number" signature check karte hue) sirf client-reported MIME type par bharosa karne ke bajaye; ye gehri verification ek production system ke liye ek swaabhavik agla kadam hai jo gambhir scale par na-bharosemand uploads sambhaalta hai, is lesson ke shuruaati daayre se aage.

## Upload ki gayi files kahan se serve honi chahiye, aur "app ke apne served static folder ke andar" aksar samajhdaari-bhara kyun nahi hai

\`\`\`js
// Khatarnaak pattern: uploads ek aise folder mein pahunchti hain jo static, executable-jaisi content bhi serve karta hai
app.use(express.static("./public"));
// agar uploads bhi ./public mein pahunchti hain, ek upload ki hui .html ya .svg file ek page ki tarah execute ho sakti hai

// Zyaada surakshit: ek alag, executable-na-serve-karti jagah, ya ek dedicated object storage service
\`\`\`

Type aur size ko andar aate waqt validate karne se aage, ye note karna kaam ka hai ki accept hui files baad mein KAHAN SE serve hoti hain — agar upload ki gayi files bilkul us directory ke andar rakhi jaati hain jise Express \`express.static()\` ke through static content ki tarah serve karta hai, ek file jo "ek accepted kism" ki tarah validation paas kar chuki hai (ek SVG image khud embedded script content rakh sakta hai, misal ke taur par) abhi bhi doosre users ke browsers ko wapas ek aise tarike se serve ho sakti hai jo na-chaahi gayi vyavhaar execute kare, ek chinta jo is lesson ke turant filename/size daayre se aage hai par seedhe taur par us se judi hai. Production systems ise aam taur par ek alag object storage service (jaise Amazon S3) par upload karke sambhaalte hain jo khaas taur par configure kiya gaya hai files ko unmein se kisi ko bhi executable content ki tarah treat kiye bina serve karne ke liye, application ki apni served static assets ke saath seedha save karne ke bajaye — ek pattern jise is course ka baad wala deployment content zyaada gehraayi se dobara dekhta hai.

## multer ki error-handling shape: check karne ke liye ek khaas error class

\`\`\`js
app.post("/avatar", upload.single("avatar"), (req, res, next) => {
  res.json({ message: "Avatar uploaded", filename: req.file.filename });
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});
\`\`\`

Is course ke pehle wale centralized-error-handling lesson ka palan karte hue, multer-khaas asafaltayen (ek file jo \`limits.fileSize\` se aage jaati hai, ya ek \`fileFilter\` rejection) \`multer.MulterError\` ke ek instance ki tarah zaahir hoti hain (ya ek custom \`fileFilter\` rejection se ek saadha \`Error\`), jise khaas taur par check kiya jaa sakta hai ek saaf, uchit \`400\` response lautaane ke liye — ek na-jude \`500\`-level server error se alag, is course ne doosri kisimon ki ummeed ki gayi, sambhaalne-laayak asafalta ke liye istemal hue usi \`AppError\`-style pattern ka palan karte hue.`,

    examples: [
      {
        title: 'Broken: the client\'s own filename is used directly as the save path',
        titleHi: 'Toota: client ka apna filename seedha save path ki tarah istemal hota hai',
        code: `const uploadPath = \`./uploads/\${file.name}\`;
file.mv(uploadPath, callback);
// file.name = "../../../../etc/passwd" writes anywhere the process can reach`,
        codeJs: `app.post("/avatar", (req, res, next) => {
  const file = req.files.avatar;
  const uploadPath = \`./uploads/\${file.name}\`;

  file.mv(uploadPath, (err) => {
    if (err) return next(err);
    res.json({ message: "Avatar uploaded", path: uploadPath });
  });
});`,
        codeTs: `app.post("/avatar", (req: Request, res: Response, next: NextFunction): void => {
  const file = (req.files as { avatar: { name: string; mv: (path: string, cb: (err: Error | null) => void) => void } }).avatar;
  const uploadPath = \`./uploads/\${file.name}\`;

  file.mv(uploadPath, (err) => {
    if (err) return next(err);
    res.json({ message: "Avatar uploaded", path: uploadPath });
  });
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about trusting client-controlled data as a filesystem path.`,
        output: `An ordinary "profile.jpg" upload works fine. An upload with the file
renamed to "../../../../etc/passwd" (or any other reachable path)
writes the uploaded content to that exact location instead, with no
restriction on file type or size either.`,
        explain: 'The client\'s filename is treated as part of the actual filesystem path, structurally identical to the SQL-injection lesson\'s mistake of treating user input as part of a query\'s structure rather than as plain data.',
        explainHi: 'Client ka filename asli filesystem path ka hissa treat hota hai, sanrachnaatmak taur par SQL-injection lesson ki us galti jaisa hi jismein user input ko ek query ki sanrachna ka hissa treat kiya gaya tha, plain data ke bajaye.',
      },
      {
        title: 'Fixed: a server-generated filename, a type allowlist, and a size limit',
        titleHi: 'Theek: ek server-generated filename, ek type allowlist, aur ek size limit',
        code: `const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, \`\${crypto.randomUUID()}\${path.extname(file.originalname)}\`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });`,
        codeJs: `const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, \`\${crypto.randomUUID()}\${ext}\`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req, res) => {
  res.json({ message: "Avatar uploaded", filename: req.file.filename });
});`,
        codeTs: `import multer from "multer";
import crypto from "crypto";
import path from "path";
import { Request, Response } from "express";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, \`\${crypto.randomUUID()}\${ext}\`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/avatar", upload.single("avatar"), (req: Request, res: Response): void => {
  res.json({ message: "Avatar uploaded", filename: req.file?.filename });
});`,
        outputJs: `The same "../../../../etc/passwd"-named upload now saves as something
like "a1b2c3d4-....jpg" inside ./uploads regardless — the malicious
filename never reaches the actual save path at all. A non-image file
or an oversized file is rejected before being written to disk.`,
        outputTs: `// Identical behaviour. req.file (singular) is multer's typed
// representation of the one uploaded file when using upload.single().`,
        explain: 'The original filename is read only for its extension — the actual save location is entirely determined by the server, making a path-traversal payload structurally unable to reach the filesystem.',
        explainHi: 'Asli filename sirf uska extension padhne ke liye padha jaata hai — asli save location poori tarah server dwara tay hota hai, ek path-traversal payload ko sanrachnaatmak taur par filesystem tak pahunchne mein asamarth banaate hue.',
      },
      {
        title: 'Handling multer-specific errors cleanly',
        titleHi: 'multer-khaas errors ko saaf tarike se sambhaalna',
        code: `if (err instanceof multer.MulterError) {
  return res.status(400).json({ error: err.message });
}
next(err);`,
        codeJs: `app.post(
  "/avatar",
  upload.single("avatar"),
  (req, res) => {
    res.json({ message: "Avatar uploaded", filename: req.file.filename });
  },
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
);`,
        codeTs: `import { Request, Response, NextFunction } from "express";

app.post(
  "/avatar",
  upload.single("avatar"),
  (req: Request, res: Response): void => {
    res.json({ message: "Avatar uploaded", filename: req.file?.filename });
  },
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
);`,
        outputJs: `An upload exceeding the 5MB limit, or one rejected by fileFilter,
returns a clean 400 with a specific message, rather than an unhandled
500-level server error.`,
        outputTs: `// Identical behaviour. Following this course's earlier centralized
// error-handling lesson, this 4-parameter middleware is recognized by
// Express as error-handling middleware based on its arity.`,
        explain: 'Distinguishing an expected, recoverable failure (a rejected upload) from an unrelated server error follows the exact same AppError-style pattern established earlier in this course.',
        explainHi: 'Ek ummeed ki gayi, sambhaalne-laayak asafalta (ek reject hui upload) ko ek na-judi server error se alag karna is course mein pehle sthapit hue \`AppError\`-style pattern ka bilkul palan karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const uploadPath = \`./uploads/\${file.name}\`;
file.mv(uploadPath, callback);
// the client's own filename is used directly as a real filesystem path`,
        right: `const safeName = \`\${crypto.randomUUID()}\${path.extname(file.originalname)}\`;
// the client's filename is read only for its extension, never used as a path`,
        why: 'A client-supplied filename can contain path-traversal sequences like ../ — using it directly to construct a save path lets an attacker write the upload anywhere the server process can reach.',
        whyHi: 'Ek client-diya filename \`../\` jaise path-traversal sequences rakh sakta hai — ise seedha ek save path banaane ke liye istemal karna ek attacker ko upload kahin bhi likhne deta hai jahan server process pahunch sake.',
      },
      {
        wrong: `const upload = multer({ storage });
// no fileFilter and no limits — any file type, any size is accepted`,
        right: `const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
// a type allowlist and a hard size cap`,
        why: 'With no fileFilter or size limit, an attacker can upload a non-image file, or a file large enough to exhaust the server\'s disk space, regardless of how the filename issue is handled.',
        whyHi: 'Bina \`fileFilter\` ya size limit ke, ek attacker ek non-image file, ya server ki disk space khatam karne jitni badi file upload kar sakta hai, filename issue kaise bhi sambhaala jaaye.',
      },
      {
        wrong: `app.use(express.static("./uploads"));
// uploaded files served from the same location, with no further checks`,
        right: `// Serve uploads from a separate location or a dedicated object storage
// service specifically configured not to execute file content`,
        why: 'A file that passes a basic type check (an SVG can contain embedded script) can still cause harm if served back to other users\' browsers as if it were ordinary static content.',
        whyHi: 'Ek file jo ek basic type check paas karti hai (ek SVG embedded script rakh sakta hai) abhi bhi nuksaan pahuncha sakti hai agar wo doosre users ke browsers ko wapas aise serve ho jaise wo aam static content ho.',
      },
    ],

    realWorld: [
      {
        en: '**Path traversal via an uploaded or user-supplied filename (often referenced as CWE-22 in vulnerability databases) is a well-documented, commonly exploited real vulnerability class**, not a theoretical concern — it appears regularly in real-world vulnerability disclosures across many kinds of applications that handle file uploads.',
        hi: '**Ek upload ki gayi ya user-diye filename ke through path traversal (vulnerability databases mein aksar CWE-22 ki tarah reference hoti hai) ek achhi tarah documented, aam taur par exploit hoti asli vulnerability class hai**, koi kalpaniya chinta nahi — ye kai kism ki applications ke asli-duniya vulnerability disclosures mein niyamit taur par dikhti hai jo file uploads sambhaalti hain.',
      },
      {
        en: '**Nearly every major cloud storage provider (Amazon S3, Google Cloud Storage, Cloudinary) exists specifically to let applications avoid saving user-uploaded files onto the application server\'s own disk at all**, sidestepping both the path-safety and the disk-exhaustion concerns this lesson covers by design.',
        hi: '**Lagbhag har mukhya cloud storage provider (Amazon S3, Google Cloud Storage, Cloudinary) khaas taur par isliye maujood hai taaki applications user-uploaded files ko application server ki apni disk par bilkul save karne se bach sakein**, is lesson mein cover hue path-safety aur disk-exhaustion dono chintaaon ko design se avoid karte hue.',
      },
      {
        en: '**multer is the standard, overwhelmingly most-used file-upload middleware in the Express ecosystem**, and its diskStorage filename callback pattern (generating a safe name rather than trusting the client\'s) is the documented, recommended approach in its own official guidance.',
        hi: '**multer Express ecosystem mein standard, bahut zyaada istemal hone waala file-upload middleware hai**, aur uska \`diskStorage\` filename callback pattern (client ka bharosa karne ke bajaye ek surakshit naam banaana) uski apni official guidance mein documented, sujhaaya gaya tarika hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does saving an uploaded file using the client\'s own filename directly create a path-traversal vulnerability?',
        qHi: 'Ek upload ki gayi file ko client ke apne filename se seedha save karna ek path-traversal vulnerability kyun paida karta hai?',
        a: 'A file\'s reported "name" as part of an upload request is nothing more than a string the client includes alongside the actual file content — the server has no built-in guarantee that this string is a simple, harmless filename rather than something crafted to manipulate how the server interprets it. When this string is directly concatenated into a real filesystem path (such as joining it onto an "uploads" directory to determine where to write the file), any special meaning that string happens to carry as a PATH — rather than as a plain label — is interpreted literally by the filesystem. The sequence ../ is a standard, universally recognized filesystem convention meaning "move up one directory level," and a filename containing repeated ../ sequences, followed by a target like etc/passwd, effectively instructs the write operation to walk back out of the intended uploads directory entirely and write to a completely different, potentially far more sensitive location instead. Because the server performed no validation or restriction on this client-supplied string before using it to construct an actual path, it has no way to distinguish an honest filename from one deliberately crafted to escape the intended directory — the vulnerability exists precisely because user-controlled data was allowed to influence the STRUCTURE of a filesystem operation rather than being treated as inert data.',
        aHi: 'Ek upload request ke hisse ki tarah ek file ka batayaa "naam" bas ek string hai jise client asli file content ke saath shaamil karta hai — server ke paas koi built-in guarantee nahi hai ki ye string ek saadha, harmless filename hai kisi aisi cheez ke bajaye jo iske server ke interpretation ko manipulate karne ke liye banaayi gayi ho. Jab ye string seedha ek asli filesystem path mein jodi jaati hai (jaise ek "uploads" directory par jodkar ye tay karna ki file kahan likhni hai), koi bhi khaas matlab jo wo string ek PATH ki tarah rakhti hai — ek saadhe label ke bajaye — filesystem dwara literally interpret hota hai. \`../\` sequence ek standard, saarvavyaapi taur par jaana-pehchaana filesystem convention hai jiska matlab hai "ek directory level oopar jaao," aur ek filename jismein dohraaye \`../\` sequences hon, uske baad \`etc/passwd\` jaisa ek nishaana ho, asar mein write operation ko poori tarah maani gayi uploads directory se bahar nikalne aur iske bajaye ek poori tarah alag, mumkin taur par kaafi zyaada sensitive jagah likhne ki hidaayat deta hai. Kyunki server ne is client-diye string par koi validation ya rok nahi lagaayi thi use ek asli path banaane ke liye istemal karne se pehle, uske paas ek imaandaar filename ko ek aise se alag karne ka koi tarika nahi hai jo jaan-boojhkar maani gayi directory se bahar nikalne ke liye banaaya gaya ho — vulnerability bilkul isliye maujood hai kyunki user-controlled data ko ek filesystem operation ki SANRACHNA ko asar karne diya gaya, use bekaar data ki tarah treat karne ke bajaye.',
      },
      {
        q: 'Why is generating the save filename on the server (rather than deriving it from the client\'s filename) the actual fix, rather than simply trying to detect and strip dangerous characters from the client\'s filename?',
        qHi: 'Save filename ko server par banaana (client ke filename se nikaalne ke bajaye) asli fix kyun hai, sirf client ke filename se khatarnaak characters pakadne aur hataane ki koshish karne ke bajaye?',
        a: 'Attempting to detect and strip dangerous patterns from a client-supplied filename (removing ../ sequences, rejecting certain characters) is a defense that depends on correctly anticipating every way such a filename could be crafted to cause harm — different operating systems and filesystems have different path conventions and edge cases, encoding tricks can sometimes represent the same dangerous sequence in a form a naive filter fails to recognize, and a single overlooked case reopens the exact same vulnerability. This mirrors the same lesson learned in this course\'s SQL-injection material regarding manual escaping: any approach that depends on recognizing and neutralizing dangerous input, one pattern at a time, is inherently fragile and incomplete. Generating the destination filename entirely on the server\'s own side — using a value the server itself creates (such as a random UUID), with the client\'s original filename consulted only to extract its extension — sidesteps the entire problem rather than attempting to solve it: it does not matter what dangerous content the client\'s filename might contain, because that filename is never used to construct the actual save path at all. There is no pattern-matching to get right or wrong, because the vulnerable operation (client input determining a filesystem path) simply does not happen in the first place.',
        aHi: 'Ek client-diye filename se khatarnaak patterns pakadne aur hataane ki koshish karna (\`../\` sequences hataana, kuch characters reject karna) ek bachaav hai jo is baat par nirbhar karta hai ki har tarika sahi tarike se pehchaana jaaye jismein aisa filename nuksaan pahunchaane ke liye banaaya jaa sakta hai — alag-alag operating systems aur filesystems ke alag-alag path conventions aur edge cases hain, encoding tricks kabhi-kabhi wahi khatarnaak sequence ek aise roop mein represent kar sakte hain jise ek bhola filter pehchaanne mein na-safal ho, aur ek chhooti hui case bilkul wahi vulnerability dobara khol deti hai. Ye is course ke SQL-injection material mein manual escaping ke baare mein seekhe usi lesson ko darzha karta hai: koi bhi tarika jo khatarnaak input ko pehchaanne aur bekaar-asar-wala karne par nirbhar hai, ek pattern ek waqt mein, buniyaadi taur par nazuk aur adhoora hai. Destination filename ko poori tarah server ke apni taraf se banaana — ek value istemal karte hue jo server khud banaata hai (jaise ek random UUID), client ka asli filename sirf uska extension nikaalne ke liye poochha jaata hai — poori samasya ko solve karne ki koshish karne ke bajaye ise poori tarah bypass kar deta hai: koi farak nahi padta client ke filename mein kaunsa khatarnaak content ho sakta hai, kyunki wo filename kabhi asli save path banaane ke liye istemal hota hi nahi. Sahi ya galat karne ke liye koi pattern-matching hai hi nahi, kyunki vulnerable operation (client input ek filesystem path tay karta hai) pehli jagah hoti hi nahi.',
      },
      {
        q: 'Why is checking a file\'s client-reported MIME type via fileFilter a real but incomplete defense, and what does a more thorough approach look like?',
        qHi: '\`fileFilter\` ke through ek file ki client-reported MIME type check karna ek asli par adhoora bachaav kyun hai, aur ek zyaada poori tarah tarika kaisa dikhta hai?',
        a: 'A file\'s MIME type, as reported in an upload request, is typically derived by the client (the browser or whatever tool constructed the request) based on things like the file\'s extension or its own inspection of the content — but this value is still fundamentally a claim included in the request by the client, not an independently verified fact established by the server. A legitimate user\'s browser reporting this value correctly is the overwhelmingly common case, which is why checking it against an allowlist is a genuinely useful first layer of defense, correctly rejecting the vast majority of accidental or casual attempts to upload an unintended file type. However, a deliberately malicious client is free to construct an upload request claiming any MIME type it wants, entirely independent of what the actual file content is — nothing about the fileFilter check as described prevents a client from labeling a file as "image/png" while the actual bytes are something else entirely. A more thorough verification, appropriate for an application with a genuine need to confirm a file\'s type regardless of client claims, involves inspecting the file\'s actual binary content after it has been received — checking for a "magic number," a specific sequence of bytes at the start of a file that reliably indicates its true format regardless of what the client reported — rather than relying solely on the client-supplied MIME type string.',
        aHi: 'Ek file ki MIME type, jaisa ek upload request mein report hoti hai, aam taur par client (browser ya jo bhi tool ne request banaayi) dwara nikaali jaati hai file ke extension jaisi cheezon ke aadhaar par ya content ki apni jaanch — par ye value abhi bhi buniyaadi taur par ek daava hai jo client dwara request mein shaamil kiya gaya hai, koi mustaqil taur par server dwara sthaapit verify kiya gaya tathya nahi. Ek legitimate user ka browser is value ko sahi tarike se report karna bahut hi aam case hai, isi wajah se ise ek allowlist ke khilaaf check karna bachaav ki ek sach mein kaam ki pehli layer hai, ek an-iraade file kism upload karne ki galti se ya casual koshishon ki bahut badi tadaad ko sahi tarike se reject karte hue. Halaanki, ek jaan-boojhkar malicious client ek upload request banaane ke liye azaad hai jo koi bhi MIME type daava kare jo wo chaahe, asli file content kya hai us se poori tarah mustaqil — jaisa describe kiya gaya \`fileFilter\` check ke baare mein kuch bhi ek client ko ek file ko "image/png" ki tarah label karne se nahi rokta jabki asli bytes kuch aur hon poori tarah. Ek zyaada poori tarah verification, ek application ke liye uchit jise client ke daavon se bekhabar ek file ki kism confirm karne ki asli zarurat hai, file paane ke baad uski asli binary content check karna shaamil karti hai — ek "magic number" check karte hue, ek file ki shuruaat mein bytes ka ek khaas sequence jo bharosemand taur par uska asli format zaahir karta hai client ne kya report kiya us se bekhabar — sirf client-diye MIME type string par bharosa karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /avatar route trusting the client\'s filename directly. Using a tool that lets you set an arbitrary filename in a multipart upload (or a quick script), upload a file named with a path-traversal sequence targeting a harmless test file outside the uploads folder, and confirm it lands there instead.',
        taskHi: 'Client ke filename par seedha bharosa karta toota \`/avatar\` route banao. Ek tool istemal karke jo tumhe ek multipart upload mein ek manmaana filename set karne de (ya ek jaldi script), ek file upload karo jiska naam ek path-traversal sequence rakhe jo uploads folder ke bahar ek harmless test file ko nishaana banaaye, aur confirm karo ye wahin pahunchti hai iske bajaye.',
        hint: 'Create a throwaway test file (like a scratch.txt with harmless content) outside the uploads directory first, so you have something safe and disposable to target and verify against.',
        hintHi: 'Pehle ek phenkne-laayak test file banaao (jaise harmless content wala ek \`scratch.txt\`) uploads directory ke bahar, taaki tumhaare paas nishaana banaane aur verify karne ke liye kuch surakshit aur phenkne-laayak ho.',
      },
      {
        task: 'Fix it with multer, generating the filename server-side via crypto.randomUUID(). Repeat the same path-traversal upload attempt and confirm the target file outside uploads is untouched, with the upload instead landing safely inside uploads under a random name.',
        taskHi: 'multer se theek karo, filename server-side \`crypto.randomUUID()\` ke through banaate hue. Wahi path-traversal upload koshish dohraao aur confirm karo uploads ke bahar wali nishaana file na-chhui hai, upload iske bajaye ek random naam ke neeche surakshit taur par uploads ke andar pahunchti hai.',
        hint: 'Also try uploading a plain .txt file and a file larger than your configured fileSize limit, confirming both are correctly rejected by fileFilter and limits respectively.',
        hintHi: 'Ek saadhi \`.txt\` file aur apni configure ki gayi \`fileSize\` limit se badi ek file upload karne ki bhi koshish karo, confirm karte hue ki dono sahi tarike se \`fileFilter\` aur \`limits\` dwara reject hoti hain.',
      },
      {
        task: 'Add the error-handling middleware checking for multer.MulterError, and confirm an oversized upload now receives a clean 400 response with a specific message instead of an unhandled server error.',
        taskHi: '\`multer.MulterError\` check karta error-handling middleware jodo, aur confirm karo ek bahut badi upload ab ek saaf 400 response paati hai ek khaas message ke saath, na ki ek na-sambhaali server error.',
        hint: 'Temporarily set fileSize to something very small (like 100 bytes) during testing to make triggering the size-limit error quick and easy.',
        hintHi: 'Testing ke dauraan asthaayi taur par \`fileSize\` ko kuch bahut chhota set karo (jaise 100 bytes) size-limit error trigger karna jaldi aur aasaan banaane ke liye.',
      },
    ],

    keyTakeaways: [
      'Using a client-supplied filename directly to construct a save path lets an attacker write uploaded content anywhere the server process can reach, via path-traversal sequences like ../.',
      'The fix is to generate the destination filename entirely on the server (e.g., crypto.randomUUID()), consulting the client\'s original filename only to extract its extension — never to build the actual path.',
      'A fileFilter checking the file\'s reported MIME type against an explicit allowlist is a real but client-reported, and therefore spoofable, first layer of defense — not an absolute guarantee of true file type.',
      'A hard fileSize limit prevents an attacker from exhausting server disk space with an arbitrarily large upload, independent of the filename or type issue.',
      'Where accepted files are later served from matters too — serving uploads from the same location as the application\'s own static assets can let a technically "valid" file type (like an SVG with embedded script) execute unwanted behavior in another user\'s browser.',
      'multer-specific failures surface as multer.MulterError, checkable in error-handling middleware to return a clean 400, following the same expected-failure pattern established in this course\'s centralized-error-handling lesson.',
    ],
    keyTakeawaysHi: [
      'Ek client-diye filename ko seedha ek save path banaane ke liye istemal karna ek attacker ko upload ki gayi content kahin bhi likhne deta hai jahan server process pahunch sake, \`../\` jaise path-traversal sequences ke through.',
      'Fix ye hai ki destination filename poori tarah server par banaao (jaise \`crypto.randomUUID()\`), client ke asli filename se sirf uska extension nikaalne ke liye poochho — kabhi asli path banaane ke liye nahi.',
      'Ek \`fileFilter\` jo file ki batayi MIME type ko ek explicit allowlist ke khilaaf check karta hai bachaav ki ek asli par client-reported, aur isliye spoof-hone-laayak, pehli layer hai — asli file kism ki koi absolute guarantee nahi.',
      'Ek sakht \`fileSize\` limit ek attacker ko server disk space ek manmaani badi upload se khatam karne se rokti hai, filename ya type issue se mustaqil.',
      'Accept hui files baad mein kahan se serve hoti hain ye bhi maayne rakhta hai — uploads ko application ki apni static assets wali jagah se serve karna ek technically "valid" file kism (jaise embedded script wala ek SVG) ko doosre user ke browser mein na-chaahi vyavhaar execute karne de sakta hai.',
      'multer-khaas asafaltayen \`multer.MulterError\` ki tarah zaahir hoti hain, error-handling middleware mein check-karne-laayak ek saaf 400 lautaane ke liye, is course ke centralized-error-handling lesson mein sthapit hue usi ummeed-ki-gayi-asafalta pattern ka palan karte hue.',
    ],
  },
];
