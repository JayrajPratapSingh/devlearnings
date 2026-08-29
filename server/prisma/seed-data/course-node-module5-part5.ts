/**
 * Node.js Complete Course — Module 5: Real-World Patterns & Architecture,
 * lesson 5.
 *
 * Pre-signed URLs and object storage: the production answer this
 * course's earlier file-uploads lesson pointed toward but never actually
 * delivered — how a real application serves and accepts files via a
 * dedicated object storage service (S3-style) without ever routing the
 * actual file bytes through its own Node.js server. Broken example: the
 * application server itself reads a file from disk (or from object
 * storage) and streams it back to the client on every single download,
 * meaning the app server's own CPU, memory, and network bandwidth are
 * consumed by every file transfer, and the same problem in reverse for
 * uploads — the app receiving the full file before forwarding it
 * onward. Fixed by having the application generate a short-lived,
 * cryptographically signed URL granting temporary, direct access to one
 * specific object in storage — the client uploads or downloads directly
 * to/from the object storage service itself, with the application
 * server never touching the file's actual bytes at all.
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

export const NODE_MODULE_5_PART5: CourseLesson[] = [
  {
    slug: 'presigned-urls-and-object-storage',
    title: 'Pre-Signed URLs and Object Storage',
    titleHi: 'Pre-Signed URLs Aur Object Storage',
    description: 'Every single profile picture download routes through the Node.js server itself — reading the file, holding it in memory, and streaming it back out — meaning a suddenly popular post can bring the entire API down under nothing more than image-serving traffic.',
    descriptionHi: 'Har akela profile picture download Node.js server ke through hi route hota hai — file padhte hue, ise memory mein rakhte hue, aur ise wapas stream karte hue — matlab ek achaanak popular post poori API ko sirf image-serving traffic ke neeche gira sakta hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 5,

    analogy: {
      en: '**A private storage warehouse where, every single time a customer wants to pick up one of their own stored boxes, a warehouse employee must personally walk to the shelf, retrieve the exact box, carry it all the way to the front counter, and hand it over — versus a warehouse that instead issues the customer a specific, time-limited claim ticket for that one box, valid for the next fifteen minutes, letting the customer drive around to the loading dock and pick up that exact box directly, with no employee involved in the handoff at all.** At the employee-mediated warehouse, every single retrieval — regardless of how many customers want a box at the same time — consumes one employee\'s time and effort, and if a hundred customers show up wanting their boxes within the same few minutes, the warehouse\'s total capacity to serve anyone is limited by how many employees happen to be on shift, even though the boxes themselves are sitting right there, ready. At the claim-ticket warehouse, the front desk\'s only job is deciding WHO is allowed to have WHICH box, and for how long — a single desk clerk can issue tickets to a hundred customers in a few minutes, since issuing a ticket takes a moment, while the actual, physical retrieval of each box happens directly at the loading dock, in parallel, with no single employee acting as a bottleneck for the whole operation. A Node.js application that reads a file from storage and streams it back to every requesting client itself is the employee-mediated warehouse: the application server\'s own limited capacity becomes the bottleneck for every single file transfer, no matter how many are happening at once. An application that instead issues a pre-signed URL — a specific, time-limited permission slip for one file, valid briefly, that the client uses to talk directly to the object storage service itself — is the claim-ticket warehouse: the application\'s only job is quickly deciding who gets access to what, while the actual, potentially large data transfer happens directly between the client and a service built specifically to handle exactly that at scale.',
      hi: '**Ek private storage warehouse jahan, har baar jab ek customer apne stored boxes mein se ek uthaana chaahta hai, ek warehouse employee ko khud shelf tak chalna padta hai, bilkul wo box nikaalna padta hai, ise poori tarah front counter tak le jaana padta hai, aur sonpna padta hai — versus ek warehouse jo iske bajaye customer ko us ek box ke liye ek khaas, samay-seemit claim ticket jaari karta hai, agle pandrah minute ke liye vaidh, customer ko loading dock tak gaadi chalaakar jaane deta hai aur bilkul wo box seedhe uthaane deta hai, handoff mein koi employee shaamil bina.** Employee-madhyasth warehouse mein, har akeli retrieval — bekhabar ki kitne customers ek saath ek box chaahte hain — ek employee ka waqt aur mehanat kharch karti hai, aur agar sau customers usi kuch minuton mein apne boxes chaahte huye aa jaayein, warehouse ki kisi ko bhi serve karne ki kul kshamta is baat se seemit hai ki shift par kitne employees maujood hain, chahe boxes khud wahin baithe hon, taiyaar. Claim-ticket warehouse mein, front desk ka ekmatra kaam ye faisla karna hai ki KAUN KAUNSA box paane ki ijaazat rakhta hai, aur kitni der ke liye — ek akela desk clerk kuch minuton mein sau customers ko tickets jaari kar sakta hai, kyunki ek ticket jaari karna ek pal leta hai, jabki har box ki asli, physical retrieval seedhe loading dock par hoti hai, parallel mein, koi akela employee poore operation ke liye bottleneck ki tarah kaam kiye bina. Ek Node.js application jo storage se ek file padhti hai aur ise khud har maang karti client ko wapas stream karti hai employee-madhyasth warehouse hai: application server ki apni seemit kshamta har akele file transfer ke liye bottleneck ban jaati hai, chahe ek saath kitne bhi ho rahe hon. Ek application jo iske bajaye ek pre-signed URL jaari karti hai — ek khaas, samay-seemit permission slip ek file ke liye, thodi der ke liye vaidh, jise client seedhe object storage service se baat karne ke liye istemal karta hai — claim-ticket warehouse hai: application ka ekmatra kaam jaldi faisla karna hai ki kise kya access milta hai, jabki asli, sambhaavit roop se badi data transfer seedhe client aur ek service ke beech hoti hai jo khaas taur par bilkul yahi scale par sambhaalne ke liye banaayi gayi hai.',
    },

    simple: `**Start broken.** The application server itself reads and streams every file:

\`\`\`js
app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file); // authorization check (correct)
    const stream = fs.createReadStream(file.diskPath); // but the server reads the actual bytes
    stream.pipe(res); // and streams every byte through itself
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route correctly checks that the requesting user actually owns the file before serving it — that authorization check (this course's earlier lessons) is genuinely necessary and correct. The problem is what happens next: the application server itself reads the file's bytes from disk (or from object storage it fetches on the client's behalf) and streams every single one of them through its own process, for every single download, from every single user. A handful of downloads a minute is completely unremarkable — but the moment one file becomes suddenly popular (a shared image, a viral document), every one of the application server's limited CPU, memory, and network resources gets consumed serving that one file to a flood of simultaneous requesters, competing directly with the exact same server capacity every other route in the entire application depends on to keep working at all.

**The fix: a pre-signed URL grants temporary, direct access to storage itself**

\`\`\`js
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // valid for 5 minutes
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

app.get("/files/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});
\`\`\`

The application still performs the exact same authorization check it always did — confirming this specific user is allowed to access this specific file — but instead of reading and streaming the file's bytes itself, it asks the object storage service to generate a URL that is cryptographically signed to grant temporary access to exactly that one object, valid only for the next five minutes. The client receives this URL and downloads the file directly from the storage service itself — the application server's own CPU, memory, and network capacity are never touched by the actual file transfer at all, regardless of whether one person or ten thousand people download the file in the same minute, since that load now falls entirely on infrastructure built specifically to handle exactly that at scale.`,

    simpleHi: `**Toote hue se shuru.** Application server khud har file ko padhta aur stream karta hai:

\`\`\`js
app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file); // authorization check (sahi)
    const stream = fs.createReadStream(file.diskPath); // par server asli bytes padhta hai
    stream.pipe(res); // aur har byte ko khud ke through stream karta hai
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ye route sahi tarike se check karta hai ki maang karta user asal mein file ka maalik hai use serve karne se pehle — wo authorization check (is course ke pehle wale lessons) sach mein zaruri aur sahi hai. Samasya ye hai ki aage kya hota hai: application server khud disk se (ya client ki taraf se fetch ki gayi object storage se) file ke bytes padhta hai aur unmein se har akele ko apne process ke through stream karta hai, har akele download ke liye, har akele user se. Ek minute mein mutthi bhar downloads bilkul saadhaaran hai — par jis pal ek file achaanak popular ho jaati hai (ek shared image, ek viral document), application server ke seemit CPU, memory, aur network resources mein se har ek us ek file ko simultaneous requesters ki ek baadh ko serve karne mein kharch ho jaata hai, bilkul usi server kshamta se seedhe compete karte hue jispar poori application ka har doosra route bilkul kaam karte rehne ke liye nirbhar hai.

**Fix: ek pre-signed URL khud storage tak asthaayi, seedha access deta hai**

\`\`\`js
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minute ke liye vaidh
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

app.get("/files/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Application phir bhi bilkul wahi authorization check karta hai jo ye hamesha karta tha — confirm karte hue ki ye khaas user is khaas file ko access karne ki ijaazat rakhta hai — par file ke bytes khud padhne aur stream karne ke bajaye, ye object storage service se ek URL generate karne ko kehta hai jo cryptographically signed hai bilkul us ek object tak asthaayi access dene ke liye, sirf agle paanch minute ke liye vaidh. Client ye URL paata hai aur file ko seedhe storage service se khud download karta hai — application server ki apni CPU, memory, aur network kshamta ko asli file transfer kabhi bilkul nahi chhoota, chahe usi minute mein ek vyakti ya das hazaar vyakti file download karein, kyunki wo load ab poori tarah us infrastructure par padta hai jo khaas taur par bilkul isi ko scale par sambhaalne ke liye banaaya gaya hai.`,

    content: `## What "pre-signed" actually means: temporary, cryptographically limited access

\`\`\`
A pre-signed URL is a normal-looking URL with extra query parameters:
https://my-bucket.s3.amazonaws.com/uploads/photo.jpg
  ?X-Amz-Expires=300
  &X-Amz-Signature=a1b2c3...  ← proves this URL was legitimately issued,
                                and hasn't been tampered with
\`\`\`

A "pre-signed" URL is a regular-looking URL that additionally carries a cryptographic signature, generated using credentials only the application server holds, that the object storage service can independently verify without needing to check back with the application server at all. The signature encodes exactly which object it grants access to, and for how long that access remains valid (\`expiresIn: 300\` above means the URL genuinely stops working after five minutes) — anyone possessing the URL before it expires can use it directly, but the object storage service itself rejects the request the instant the expiry time passes, or if any part of the URL (the object it points to, the expiry time) has been tampered with, since that would invalidate the signature.

## Why this scales in a way routing every download through the app server cannot

\`\`\`
Without pre-signed URLs: every file transfer's bandwidth, memory,
and CPU cost is paid by the application server, competing directly
with every other route's capacity.

With pre-signed URLs: the application server's only cost is
generating a signature (a fast, cheap cryptographic operation) —
the actual data transfer happens entirely between the client and
the object storage service.
\`\`\`

This course's earlier lessons on concurrency limiting and connection pooling established that an application server has genuinely finite capacity — a limited number of connections it can handle simultaneously, limited memory, limited network bandwidth. Streaming every file transfer through the application server means that finite capacity is consumed by file transfers just as much as by any other request, and a sudden spike in downloads for one popular file can meaningfully degrade or even overwhelm the server's ability to handle completely unrelated requests at the same time. Generating a pre-signed URL, by contrast, is a fast, lightweight cryptographic operation that costs the application server almost nothing regardless of how large the file actually is — the real data transfer, however large, happens entirely between the client and the object storage service, which is purpose-built infrastructure designed specifically to handle massive amounts of simultaneous data transfer at a scale no ordinary application server would attempt to replicate.

## The same pattern works for uploads, not just downloads

\`\`\`js
const command = new PutObjectCommand({ Bucket: "my-app-files", Key: \`uploads/\${userId}/\${filename}\` });
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
// the client uploads directly to uploadUrl via a PUT request — the file's
// bytes never pass through the application server at all
\`\`\`

The exact same principle applies in reverse for file uploads: rather than the client sending the file to the application server, which then forwards it to object storage (doubling the data transfer and consuming the application server's bandwidth for the upload too), the application can instead generate a pre-signed URL specifically authorizing an UPLOAD to one specific location in storage, and the client uploads directly to that URL. The application's role stays limited to deciding whether this specific user is allowed to upload to this specific location, and for how long that permission remains valid — the actual bytes of even a very large upload never touch the application server's own memory or bandwidth at all.

## Public, unauthenticated assets: a CDN instead of signed URLs

\`\`\`
Private, per-user file (a user's own document, a private photo)
→ pre-signed URL, generated per-request, checking authorization each time

Public, unauthenticated asset (a logo, a public marketing image,
a CSS/JS bundle)
→ no signing needed at all — served directly through a CDN
\`\`\`

Not every file needs the per-request authorization check a pre-signed URL provides — a public asset that every visitor is meant to see regardless of who they are (a logo, a public product image, a static JavaScript bundle) has no meaningful access restriction to enforce in the first place. For genuinely public assets, a Content Delivery Network (CDN) — a geographically distributed network of caching servers — is the more appropriate tool: the asset is cached at a location physically close to each requesting user, served extremely quickly with no per-request signing overhead, and the application server is involved only rarely, when the CDN's cache needs refreshing, rather than on every single request. Recognizing which category a given file falls into — genuinely private and requiring per-request authorization, versus genuinely public and requiring only fast, cached delivery — determines whether pre-signed URLs or a CDN is the right tool for that specific file.`,

    contentHi: `## "Pre-signed" ka asal mein matlab kya hai: asthaayi, cryptographically seemit access

\`\`\`
Ek pre-signed URL ek normal-dikhta URL hai jismein extra query
parameters hote hain:
https://my-bucket.s3.amazonaws.com/uploads/photo.jpg
  ?X-Amz-Expires=300
  &X-Amz-Signature=a1b2c3...  ← saabit karta hai ye URL vaidh roop se
                                jaari kiya gaya, aur isse chheda nahi gaya
\`\`\`

Ek "pre-signed" URL ek aam-dikhta URL hai jo additionally ek cryptographic signature le kar chalta hai, un credentials istemal karke generate hua jo sirf application server ke paas hain, jise object storage service swatantra roop se verify kar sakti hai bilkul application server se dobara check kiye bina. Signature bilkul encode karta hai ki ye kaunse object ko access deta hai, aur ye access kitni der tak vaidh rehta hai (oopar \`expiresIn: 300\` ka matlab hai URL sach mein paanch minute baad kaam karna band kar deta hai) — koi bhi jiske paas expire hone se pehle URL hai use seedhe istemal kar sakta hai, par expiry time guzarte hi object storage service khud request reject kar deti hai, ya agar URL ka koi hissa (jis object ki taraf ye point karta hai, expiry time) chheda gaya ho, kyunki isse signature invalid ho jaata.

## Ye us tarike se scale kyun karta hai jo har download ko app server se route karna nahi kar sakta

\`\`\`
Pre-signed URLs bina: har file transfer ki bandwidth, memory, aur
CPU keemat application server chukaata hai, seedhe har doosre
route ki kshamta se compete karte hue.

Pre-signed URLs ke saath: application server ki ekmatra keemat
ek signature generate karna hai (ek tez, sasta cryptographic
operation) — asli data transfer poori tarah client aur object
storage service ke beech hota hai.
\`\`\`

Is course ke pehle wale concurrency limiting aur connection pooling lessons ne sthaapit kiya ki ek application server ke paas sach mein seemit kshamta hai — ek seemit tadaad connections jo ye ek saath handle kar sakta hai, seemit memory, seemit network bandwidth. Har file transfer ko application server ke through stream karna matlab hai wo seemit kshamta file transfers dwara utni hi kharch hoti hai jitni kisi bhi doosri request dwara, aur ek popular file ke downloads mein ek achaanak spike server ki bilkul na-judi requests handle karne ki kshamta ko maayne-rakhta kharaab ya poori tarah overwhelm kar sakta hai usi waqt. Ek pre-signed URL generate karna, iske ulta, ek tez, halka cryptographic operation hai jo application server ko lagbhag kuch bhi kharch nahi karta chahe file asal mein kitni bhi badi ho — asli data transfer, chahe kitna bhi bada, poori tarah client aur object storage service ke beech hota hai, jo is maqsad ke liye bani infrastructure hai khaas taur par vishaal tadaad ke simultaneous data transfer ko us scale par sambhaalne ke liye design ki gayi jise koi saadhaaran application server replicate karne ki koshish nahi karega.

## Wahi pattern uploads ke liye bhi kaam karta hai, sirf downloads ke liye nahi

\`\`\`js
const command = new PutObjectCommand({ Bucket: "my-app-files", Key: \`uploads/\${userId}/\${filename}\` });
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
// client seedhe uploadUrl par ek PUT request ke zariye upload karta hai — file
// ke bytes application server se kabhi bilkul nahi guzarte
\`\`\`

## Public, unauthenticated assets: signed URLs ke bajaye ek CDN

\`\`\`
Private, prati-user file (ek user ka apna document, ek private photo)
→ pre-signed URL, prati-request generate hui, har baar authorization check karte hue

Public, unauthenticated asset (ek logo, ek public marketing image,
ek CSS/JS bundle)
→ bilkul koi signing zaroorat nahi — seedhe ek CDN ke through serve kiya gaya
\`\`\`

Har file ko us prati-request authorization check ki zaroorat nahi hai jo ek pre-signed URL deta hai — ek public asset jise har visitor ko dekhna hai chahe wo koi bhi ho (ek logo, ek public product image, ek static JavaScript bundle) ke paas lagu karne ke liye koi maayne-rakhta access restriction hai hi nahi shuru mein. Sach mein public assets ke liye, ek Content Delivery Network (CDN) — caching servers ka ek bhaugolik roop se failaa hua network — zyaada upyukt tool hai: asset ek aisi jagah cache ki jaati hai jo har maang karti user ke physically nazdeek ho, koi prati-request signing overhead bina bahut jaldi serve ki jaati hai, aur application server sirf kabhi-kabhi shaamil hota hai, jab CDN ke cache ko refresh karne ki zaroorat ho, har akeli request par nahi. Ye pehchaanna ki ek diya file kaunsi category mein aata hai — sach mein private aur prati-request authorization ki maang karta, versus sach mein public aur sirf tez, cached delivery ki maang karta — tay karta hai ki us khaas file ke liye pre-signed URLs ya ek CDN sahi tool hai.`,

    examples: [
      {
        title: 'Broken: the application server reads and streams every file itself',
        titleHi: 'Toota: application server khud har file padhta aur stream karta hai',
        code: `app.get("/files/:id", requireAuth, async (req, res) => {
  const file = await getFileMetadata(req.params.id);
  fs.createReadStream(file.diskPath).pipe(res); // every byte through the app server`,
        codeJs: `app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);
    fs.createReadStream(file.diskPath).pipe(res);
  } catch (err) {
    next(err);
  }
});
// a popular file consumes the app server's own bandwidth for every download`,
        codeTs: `app.get("/files/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);
    fs.createReadStream(file.diskPath).pipe(res);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the scaling problem
// is architectural, not a type error.`,
        output: `Works fine for occasional downloads. A suddenly popular file being
downloaded by thousands of users simultaneously consumes the app
server's own limited bandwidth and connections for every single one.`,
        explain: 'Every file transfer\'s cost is paid entirely by the application server\'s own finite resources, competing directly with every other route in the application.',
        explainHi: 'Har file transfer ki keemat poori tarah application server ke apne seemit resources dwara chukaayi jaati hai, application mein har doosre route se seedhe compete karte hue.',
      },
      {
        title: 'Fixed: a pre-signed URL for direct download from object storage',
        titleHi: 'Theek: object storage se seedhe download ke liye ek pre-signed URL',
        code: `const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
res.json({ downloadUrl: url });`,
        codeJs: `const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: "us-east-1" });

app.get("/files/:id", requireAuth, async (req, res, next) => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });

app.get("/files/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = await getFileMetadata(req.params.id);
    checkUserOwnsFile(req.userId, file);

    const command = new GetObjectCommand({ Bucket: "my-app-files", Key: file.storageKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl: url });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The application server's cost is a fast signature-generation call.
Regardless of how many users download the file simultaneously, the
actual data transfer never touches the app server's own resources.`,
        outputTs: `// Identical behaviour. The authorization check (checkUserOwnsFile)
// still runs on every request — signing doesn't skip access control,
// it only changes who transfers the actual bytes afterward.`,
        explain: 'The application still enforces authorization on every request, but hands off the actual, potentially expensive data transfer to infrastructure built specifically to handle it at scale.',
        explainHi: 'Application phir bhi har request par authorization lagu karta hai, par asli, sambhaavit roop se mehnga data transfer us infrastructure ko sonp deta hai jo khaas taur par ise scale par sambhaalne ke liye banaayi gayi hai.',
      },
      {
        title: 'The same pattern for direct-to-storage uploads',
        titleHi: 'Seedhe-storage-ko uploads ke liye wahi pattern',
        code: `const command = new PutObjectCommand({ Bucket: "my-app-files", Key: uploadKey });
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
res.json({ uploadUrl });`,
        codeJs: `const { PutObjectCommand } = require("@aws-sdk/client-s3");

app.post("/files/upload-url", requireAuth, async (req, res, next) => {
  try {
    const { filename, contentType } = req.body;
    const uploadKey = \`uploads/\${req.userId}/\${crypto.randomUUID()}-\${filename}\`;

    const command = new PutObjectCommand({
      Bucket: "my-app-files",
      Key: uploadKey,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ uploadUrl, uploadKey });
  } catch (err) {
    next(err);
  }
});
// the client then PUTs the file's bytes directly to uploadUrl`,
        codeTs: `import { PutObjectCommand } from "@aws-sdk/client-s3";

app.post("/files/upload-url", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { filename, contentType } = req.body;
    const uploadKey = \`uploads/\${req.userId}/\${crypto.randomUUID()}-\${filename}\`;

    const command = new PutObjectCommand({
      Bucket: "my-app-files",
      Key: uploadKey,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ uploadUrl, uploadKey });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The client uploads a large file directly to object storage via the
signed URL — the file's bytes never pass through the application
server's own memory or bandwidth at all, even for a very large file.`,
        outputTs: `// Identical behaviour. The application decides WHERE the upload is
// allowed to go (a per-user path) and for how long, without ever
// handling the file's actual content.`,
        explain: 'The application\'s role is limited to authorizing exactly where a specific user may upload and for how long — the actual, potentially large upload happens directly between the client and storage.',
        explainHi: 'Application ka role sirf ise authorize karne tak seemit hai ki ek khaas user kahan upload kar sakta hai aur kitni der tak — asli, sambhaavit roop se badi upload seedhe client aur storage ke beech hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `fs.createReadStream(file.diskPath).pipe(res); // every download consumes app server resources`,
        right: `const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket, Key }), { expiresIn: 300 });
res.json({ downloadUrl: url }); // the app server never touches the actual bytes`,
        why: 'Streaming every file transfer through the application server consumes its finite CPU, memory, and bandwidth for every download, competing with every other route\'s capacity.',
        whyHi: 'Har file transfer ko application server ke through stream karna har download ke liye iski seemit CPU, memory, aur bandwidth kharch karta hai, har doosre route ki kshamta se compete karte hue.',
      },
      {
        wrong: `const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 }); // valid for 7 days`,
        right: `const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // valid for 5 minutes`,
        why: 'An unnecessarily long expiry time on a pre-signed URL extends the window during which anyone who obtains that URL (via a shared link, a browser history, a proxy log) retains access, well beyond what the client genuinely needs.',
        whyHi: 'Ek pre-signed URL par ek bekaar lambi expiry time us window ko badhaata hai jiske dauraan koi bhi jise wo URL milta hai (ek shared link, ek browser history, ek proxy log ke zariye) access rakhta hai, client ko asal mein jitni zaroorat hai us se kaafi zyaada.',
      },
      {
        wrong: `// Making the entire storage bucket publicly readable to avoid dealing with signing at all
{ "Bucket": "my-app-files", "PublicRead": true } // every private file exposed to anyone with the URL`,
        right: `// Keep the bucket private; generate a signed URL per-request, checking
// authorization each time, exactly as this lesson's fixed example does`,
        why: 'Making an entire bucket public to avoid implementing signed URLs removes per-user authorization entirely, exposing every private file to anyone who obtains or guesses its URL.',
        whyHi: 'Signed URLs implement karne se bachne ke liye poori bucket ko public banaana prati-user authorization ko poori tarah hata deta hai, har private file ko kisi ke bhi expose karte hue jo iska URL paata ya anumaan lagaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Pre-signed URLs are a standard, officially documented feature of every major object storage service (Amazon S3, Google Cloud Storage, Azure Blob Storage)**, reflecting how universally this pattern is relied upon for serving and accepting files at scale.',
        hi: '**Pre-signed URLs har mukhya object storage service (Amazon S3, Google Cloud Storage, Azure Blob Storage) ki ek standard, officially documented feature hain**, ye darsata hai ki scale par files serve aur accept karne ke liye ye pattern kitna sarvavyaapi bharosemand hai.',
      },
      {
        en: '**Uploading directly from the client to object storage via a pre-signed URL, bypassing the application server entirely, is a widely recommended practice specifically for large file uploads**, avoiding doubling the data transfer through an intermediate server.',
        hi: '**Client se seedhe ek pre-signed URL ke zariye object storage tak upload karna, application server ko poori tarah bypass karte hue, khaas taur par bade file uploads ke liye ek vyaapak roop se recommend ki jaane waali practice hai**, ek beech ke server ke through data transfer double hone se bachte hue.',
      },
      {
        en: '**CDNs fronting genuinely public, unauthenticated assets, separate from signed-URL-protected private files, is a standard architectural split at nearly every production web application serving both kinds of content.**',
        hi: '**CDNs jo sach mein public, unauthenticated assets ke saamne hote hain, signed-URL-surakshit private files se alag, lagbhag har production web application mein ek standard architectural split hai jo dono tarah ki content serve karti hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does routing every file download through the application server create a scaling problem that generating a pre-signed URL avoids?',
        qHi: 'Har file download ko application server ke through route karna ek scaling samasya kyun paida karta hai jise ek pre-signed URL generate karna avoid karta hai?',
        a: 'An application server, like any running process, has genuinely finite resources available to it at any given moment — a limited number of concurrent connections it can maintain, a limited amount of memory, and a limited amount of network bandwidth it can actually push data through. When the application server itself reads a file\'s bytes and streams them out to a requesting client, that specific transfer occupies a real, measurable share of all three of those finite resources for as long as the transfer takes — one connection is held open, some memory holds the data being streamed, and real network bandwidth is consumed sending it. Under ordinary, modest traffic, this is rarely noticeable, since the total resources consumed by file transfers remain a small fraction of what the server has available. The problem emerges specifically when demand for file transfers spikes — a single file becoming suddenly popular, or simply overall traffic growing — because every one of those simultaneous file transfers competes for the exact same finite pool of connections, memory, and bandwidth that every OTHER route in the application also depends on to function. A flood of file-download requests can genuinely exhaust the server\'s available connections or bandwidth to the point that completely unrelated requests — a login attempt, an API call having nothing to do with file transfer — are delayed or fail, because the underlying resource they need is being consumed by file transfers instead. A pre-signed URL sidesteps this entirely: generating the signed URL itself is a fast, computationally cheap cryptographic operation that consumes a negligible, roughly constant amount of the application server\'s resources regardless of the file\'s actual size, and the real, potentially large data transfer happens directly between the client and the object storage service — infrastructure specifically built and provisioned to handle exactly this kind of massive, simultaneous data transfer at a scale no ordinary application server is designed or provisioned to replicate.',
        aHi: 'Ek application server, kisi bhi chalte process ki tarah, kisi bhi diye pal apne paas sach mein seemit resources upalabdh rakhta hai — ek seemit tadaad concurrent connections jo ye maintain kar sakta hai, ek seemit tadaad memory, aur ek seemit tadaad network bandwidth jise ye asal mein data push kar sakta hai. Jab application server khud ek file ke bytes padhta hai aur unhe ek maang karti client ko stream karta hai, wo khaas transfer un teen seemit resources mein se har ek ka ek asli, naapa-jaane-laayak hissa occupy karta hai jab tak transfer chalta hai — ek connection khula rehta hai, kuch memory stream ho rahe data ko rakhti hai, aur asli network bandwidth ise bhejne mein kharch hoti hai. Aam, madhyam traffic ke neeche, ye kam hi dhyaan-dene-laayak hota hai, kyunki file transfers dwara kharch ki gayi kul resources server ke paas upalabdh se ek chhota hissa rehti hain. Samasya khaas taur par tab zaahir hoti hai jab file transfers ki maang mein spike aata hai — ek akeli file achaanak popular ho jaana, ya bas kul traffic badhna — kyunki un simultaneous file transfers mein se har ek connections, memory, aur bandwidth ke bilkul usi seemit pool ke liye compete karta hai jispar application ka har DOOSRA route bhi kaam karne ke liye nirbhar hai. File-download requests ki ek baadh sach mein server ki upalabdh connections ya bandwidth ko us had tak khatam kar sakti hai ki poori tarah na-judi requests — ek login koshish, ek API call jiska file transfer se koi lena-dena nahi — deri se hoti hain ya fail hoti hain, kyunki jo underlying resource unhe chahiye wo iske bajaye file transfers dwara kharch ki jaa rahi hai. Ek pre-signed URL ise poori tarah avoid karta hai: signed URL khud generate karna ek tez, computationally sasta cryptographic operation hai jo application server ke resources ka ek mamuli, lagbhag sthir tadaad kharch karta hai file ke asli size se bekhabar, aur asli, sambhaavit roop se badi data transfer seedhe client aur object storage service ke beech hoti hai — infrastructure jo khaas taur par bilkul is tarah ki vishaal, simultaneous data transfer ko us scale par sambhaalne ke liye banaayi aur provision ki gayi hai jise koi saadhaaran application server replicate karne ke liye design ya provision nahi kiya gaya hai.',
      },
      {
        q: 'Why does a pre-signed URL\'s expiry time matter, and what goes wrong if it is set too generously long?',
        qHi: 'Ek pre-signed URL ki expiry time kyun maayne rakhti hai, aur agar ise bahut zyaada udaarta se lamba set kiya jaaye to kya galat hota hai?',
        a: 'A pre-signed URL\'s cryptographic signature grants genuine, real access to whatever it points to for as long as it remains valid — anyone who possesses that URL before it expires can use it directly, regardless of whether they are the specific person the application originally intended to grant access to. This means the URL itself functions, for the duration of its validity, as a bearer credential: possession of the URL is sufficient to gain access, similar in spirit to how possessing a physical key grants access to whatever it unlocks, regardless of who is actually holding it. A URL can end up somewhere other than its intended recipient\'s hands in various realistic ways — it might be logged by an intermediate proxy or a browser\'s history, accidentally included in a screenshot or a support ticket, or shared unintentionally when a user copies a page\'s full address to send to someone else. The shorter the URL\'s expiry window, the smaller the window during which any of these realistic ways a URL might leak to an unintended party actually matters, since the URL simply stops granting access once it expires, regardless of who currently possesses it. Setting an unnecessarily long expiry time — far longer than the client genuinely needs to actually initiate and complete the transfer the URL was generated for — needlessly extends this exposure window without providing any corresponding benefit to the legitimate use case, since a client that needs to download or upload a file typically does so within moments of receiving the URL, not hours or days later. The right expiry time should be set based on how long the legitimate operation genuinely takes, with a small amount of reasonable margin, rather than defaulting to a long duration out of convenience or uncertainty about how long is "enough."',
        aHi: 'Ek pre-signed URL ka cryptographic signature asli, waastavik access deta hai jo bhi ye point karta hai use jab tak ye vaidh rehta hai — koi bhi jiske paas expire hone se pehle wo URL hai use seedhe istemal kar sakta hai, chahe wo application ne asal mein jise access dene ka iraada kiya tha wahi khaas vyakti ho ya na ho. Iska matlab hai URL khud, apni vaidhta ki avdhi ke liye, ek bearer credential ki tarah kaam karta hai: URL ka maalik hona access paane ke liye kaafi hai, kuch had tak isi tarah jaise ek physical key ka maalik hona jo bhi ye kholti hai use access deta hai, chahe use asal mein kaun pakde ho. Ek URL kai wastavik tareekon se apne anumaanit paane waale ke haathon ke alaawa kahin aur samaapt ho sakta hai — ye ek beech ke proxy ya ek browser ki history dwara log ho sakta hai, galti se ek screenshot ya ek support ticket mein shaamil ho sakta hai, ya anjaane mein share ho sakta hai jab ek user ek page ka poora address kisi doosre ko bhejne ke liye copy karta hai. URL ki expiry window jitni chhoti hai, wo window utni hi chhoti hai jiske dauraan in wastavik tareekon mein se koi bhi jinse ek URL kisi anapekshit paksh ko leak ho sakta hai asal mein maayne rakhta hai, kyunki URL bas access dena band kar deta hai expire hote hi, chahe abhi kaun ise pakde ho. Ek bekaar lambi expiry time set karna — client ko asal mein jis transfer ke liye URL generate ki gayi thi use shuru aur poora karne ki asal mein zaroorat se kaafi zyaada lambi — vaidh use case ko koi mutaalliq fayda diye bina bekaar mein is exposure window ko badhaata hai, kyunki ek client jise ek file download ya upload karni hai aam taur par URL milne ke kuch pal ke andar aisa karta hai, ghanton ya dinon baad nahi. Sahi expiry time ye set kiya jaana chahiye ki vaidh operation asal mein kitna waqt leta hai uske aadhaar par, thoda samajhdaar margin ke saath, suvidha ya "kitna kaafi hai" ke baare mein anishchitta se bahar ek lambi avdhi ko default karne ke bajaye.',
      },
      {
        q: 'How should a developer decide whether a given file needs a pre-signed URL versus being served through a CDN?',
        qHi: 'Ek developer ko kaise faisla karna chahiye ki ek diya file ko ek pre-signed URL chahiye versus ek CDN ke through serve kiya jaana chahiye?',
        a: 'The genuine deciding factor is whether access to a specific file needs to be restricted based on WHO is requesting it, or whether the file is meant to be equally accessible to anyone regardless of identity. A pre-signed URL\'s entire purpose is enforcing a per-request authorization check before granting temporary access — the application explicitly decides, for each specific request, whether this particular user is allowed to access this particular file, and only then generates a URL granting brief access to exactly that one object. This makes pre-signed URLs the correct tool specifically for files where that per-user distinction genuinely matters: a user\'s own private document, a photo only meant to be visible to a specific set of people, any file where "should this specific requester see this" is a real, meaningful question with a real, non-trivial answer. A CDN, by contrast, is built around the opposite assumption: it caches a copy of a file at many geographically distributed locations specifically so it can be served extremely quickly to ANYONE requesting it, with no per-request authorization check at all, since the entire model assumes the content is equally appropriate to serve to any requester. This makes a CDN the correct tool specifically for genuinely public assets — a company logo, a publicly viewable product photo, a static JavaScript or CSS bundle every visitor\'s browser needs — where there is no meaningful "should this specific person be allowed to see this" question to ask in the first place, since the answer is unconditionally yes for anyone. Attempting to serve a genuinely private file through a CDN would remove the per-request authorization check entirely, since a CDN has no mechanism for it by design; attempting to serve a genuinely public asset through per-request pre-signed URLs adds authorization overhead and per-request signing cost that provides no actual benefit, since there was never a meaningful access restriction to enforce for that file in the first place.',
        aHi: 'Asli faisla karne waala factor ye hai ki kya ek khaas file ka access is aadhaar par seemit hona chahiye ki KAUN maang raha hai, ya kya file pehchaan se bekhabar kisi ke bhi liye samaan roop se access-laayak hone ke liye hai. Ek pre-signed URL ka poora maqsad asthaayi access dene se pehle ek prati-request authorization check lagu karna hai — application explicitly faisla karta hai, har khaas request ke liye, ki kya ye khaas user is khaas file ko access karne ki ijaazat rakhta hai, aur sirf tabhi bilkul us ek object tak thodi der ka access dete hue ek URL generate karta hai. Ye pre-signed URLs ko khaas taur par un files ke liye sahi tool banaata hai jahan wo prati-user antar sach mein maayne rakhta hai: ek user ka apna khud ka private document, ek photo jo sirf logon ke ek khaas set ko dikhne ke liye hai, koi bhi file jahan "kya is khaas maang karne waale ko ye dekhna chahiye" ek asli, maayne-rakhta sawaal hai ek asli, non-trivial jawaab ke saath. Ek CDN, iske ulta, ulti dhaarna ke aas-paas banaaya gaya hai: ye ek file ki ek copy kai bhaugolik roop se failyi hui jagahon par cache karta hai khaas taur par taaki ise KISI KE BHI dwara maangi jaane par bahut jaldi serve kiya jaa sake, koi prati-request authorization check bilkul bina, kyunki poora model ye maanta hai ki content kisi bhi maang karne waale ko serve karne ke liye samaan roop se upyukt hai. Ye CDN ko khaas taur par sach mein public assets ke liye sahi tool banaata hai — ek company logo, ek saarvajanik roop se dekhi jaa sakti product photo, ek static JavaScript ya CSS bundle jo har visitor ke browser ko chahiye — jahan "kya is khaas vyakti ko ye dekhne ki ijaazat honi chahiye" jaisa koi maayne-rakhta sawaal poochne ke liye hai hi nahi, kyunki jawaab kisi ke liye bhi bina-shart haan hai. Ek sach mein private file ko ek CDN ke through serve karne ki koshish karna prati-request authorization check ko poori tarah hata degi, kyunki ek CDN ke paas design se iske liye koi mechanism nahi hai; ek sach mein public asset ko prati-request pre-signed URLs ke through serve karne ki koshish karna authorization overhead aur prati-request signing keemat jodti hai jo koi asli fayda nahi deti, kyunki us file ke liye lagu karne ke liye kabhi koi maayne-rakhta access restriction thi hi nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /files/:id route that reads a file from local disk and streams it directly through the app server. Download the same file with several concurrent requests and observe the server\'s own resource usage climbing.',
        taskHi: 'Ek toota \`/files/:id\` route banao jo local disk se ek file padhta hai aur ise seedhe app server ke through stream karta hai. Wahi file kai concurrent requests ke saath download karo aur server ke apne resource istemal ko badhte hue dekho.',
        hint: 'Use a moderately large test file (a few tens of megabytes) and send 20-50 concurrent download requests to make the resource usage clearly visible.',
        hintHi: 'Ek maamuli badi test file istemal karo (kuch dazan megabytes) aur resource istemal ko saaf dikhne ke liye 20-50 concurrent download requests bhejo.',
      },
      {
        task: 'Using a local S3-compatible tool (such as MinIO or LocalStack) or a real AWS S3 test bucket, refactor the route to generate a pre-signed URL instead, following this lesson\'s fixed example.',
        taskHi: 'Ek local S3-compatible tool (jaise MinIO ya LocalStack) ya ek asli AWS S3 test bucket istemal karke, route ko iske bajaye ek pre-signed URL generate karne ke liye refactor karo, is lesson ke theek example ka palan karte hue.',
        hint: 'MinIO can run locally via Docker and exposes an S3-compatible API, letting you test signed URLs without a real cloud account.',
        hintHi: 'MinIO Docker ke zariye locally chal sakta hai aur ek S3-compatible API expose karta hai, tumhe ek asli cloud account ke bina signed URLs test karne dete hue.',
      },
      {
        task: 'Set the signed URL\'s expiresIn to a short value (e.g. 10 seconds) for testing, and confirm the URL genuinely stops working after that time by waiting and then trying to use it.',
        taskHi: 'Testing ke liye signed URL ka \`expiresIn\` ek chhoti value par set karo (jaise 10 seconds), aur confirm karo ki URL us waqt ke baad sach mein kaam karna band kar deta hai intezaar karke aur phir ise istemal karne ki koshish karke.',
        hint: 'Save the generated URL, wait past its expiry time, then attempt a request against it and confirm the object storage service rejects it.',
        hintHi: 'Generate hua URL save karo, iski expiry time ke baad intezaar karo, phir iske khilaaf ek request ki koshish karo aur confirm karo ki object storage service ise reject karti hai.',
      },
    ],

    keyTakeaways: [
      'Routing every file transfer through the application server consumes its finite CPU, memory, and connection capacity for every download or upload, competing directly with every other route.',
      'A pre-signed URL is a normal URL carrying a cryptographic signature that grants temporary, verifiable access to one specific object in storage, without the storage service needing to check back with the application.',
      'Generating a pre-signed URL is a fast, cheap operation regardless of file size — the actual, potentially large data transfer happens directly between the client and the object storage service.',
      'The same pattern works in reverse for uploads: a pre-signed URL can authorize a client to upload directly to storage, so the file\'s bytes never pass through the application server at all.',
      'A pre-signed URL\'s expiry time should be set as short as the legitimate use case genuinely requires — anyone possessing the URL before it expires can use it, so an unnecessarily long expiry needlessly extends exposure.',
      'Genuinely public, unauthenticated assets don\'t need pre-signed URLs at all — a CDN is the more appropriate tool when there\'s no meaningful per-user access restriction to enforce.',
    ],
    keyTakeawaysHi: [
      'Har file transfer ko application server ke through route karna har download ya upload ke liye iski seemit CPU, memory, aur connection kshamta kharch karta hai, har doosre route se seedhe compete karte hue.',
      'Ek pre-signed URL ek aam URL hai jo ek cryptographic signature le kar chalta hai jo storage mein ek khaas object tak asthaayi, verify-ki-jaa-sakne-laayak access deta hai, storage service ko application se dobara check karne ki zaroorat bina.',
      'Ek pre-signed URL generate karna ek tez, sasta operation hai file size se bekhabar — asli, sambhaavit roop se badi data transfer seedhe client aur object storage service ke beech hoti hai.',
      'Wahi pattern uploads ke liye ulta kaam karta hai: ek pre-signed URL ek client ko seedhe storage tak upload karne ke liye authorize kar sakta hai, taaki file ke bytes application server se kabhi bilkul na guzarein.',
      'Ek pre-signed URL ki expiry time itni chhoti set ki jaani chahiye jitni vaidh use case ko asal mein zaroorat hai — koi bhi jiske paas expire hone se pehle URL hai use istemal kar sakta hai, isliye ek bekaar lambi expiry bekaar mein exposure badhaati hai.',
      'Sach mein public, unauthenticated assets ko pre-signed URLs ki bilkul zaroorat nahi hai — ek CDN zyaada upyukt tool hai jab lagu karne ke liye koi maayne-rakhta prati-user access restriction hai hi nahi.',
    ],
  },
];
