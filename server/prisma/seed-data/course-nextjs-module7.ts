/**
 * Next.js Complete Course — Module 7: File Uploads & Media, lessons 1-3.
 *
 * Lesson 1: Presigned URLs — never proxying large files through your own server.
 * Lesson 2: next/image optimization and how it actually works.
 * Lesson 3: Video and large-asset delivery via a CDN.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-presigned-upload-urls',
    title: 'Presigned URLs — Never Proxy Big Files Through Your Server',
    titleHi: 'Presigned URLs — Bade Files Ko Kabhi Apne Server Se Proxy Mat Karo',
    description:
      "Routing a large file upload through your own Next.js server means that server holds the entire file in memory or on disk while forwarding it — an approach that doesn't scale. A presigned URL lets the browser upload directly to storage (S3 or similar), with your server only ever issuing a short-lived permission slip.",
    descriptionHi:
      'Ek bade file upload ko apne khud ke Next.js server se route karna matlab hai wo server poori file ko memory ya disk pe hold karta hai use forward karte hue — ek approach jo scale nahi karta. Ek presigned URL browser ko storage (S3 ya similar) pe directly upload karne deta hai, aapka server sirf ek short-lived permission slip issue karta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A hotel giving a guest a temporary keycard for one specific room, versus a bellhop personally carrying every guest's luggage through the lobby to their room.** A bellhop carrying every bag himself becomes the bottleneck the moment ten guests check in at once — he can only carry so much, so fast. A keycard, by contrast, lets each guest walk directly to their own room, using a temporary permission the front desk generated in a fraction of a second. A presigned URL is that keycard: the server spends almost no effort generating it, and the actual heavy lifting (the file transfer) happens directly between the browser and storage, bypassing the server entirely.",
      hi: 'Ek hotel ek guest ko ek specific room ke liye ek temporary keycard deta hai, versus ek bellhop jo har guest ka luggage personally lobby se hokar unke room tak le jata hai. Ek bellhop jo har bag khud carry karta hai bottleneck ban jata hai jis moment das guests ek saath check in karte hain — wo sirf itna hi carry kar sakta hai, itni fast. Ek keycard, iske contrast mein, har guest ko directly apne khud ke room tak walk karne deta hai, ek temporary permission use karte hue jo front desk ne ek second ke fraction mein generate kiya. Ek presigned URL wahi keycard hai: server ise generate karne mein almost koi effort nahi lagata, aur actual heavy lifting (file transfer) directly browser aur storage ke beech hota hai, server ko poori tarah bypass karte hue.',
    },

    simple: `**The wrong shape: the file travels browser → your server → storage:**

\`\`\`
Browser --(uploads file)--> Next.js server --(forwards file)--> S3
                              ^ holds the ENTIRE file in memory/disk
                                while this forwarding happens
\`\`\`

**The right shape: your server issues a short-lived PERMISSION, and the
file travels directly browser → storage:**

\`\`\`
1. Browser asks YOUR server: "I want to upload photo.jpg"
2. Your server asks S3 for a presigned URL (a temporary, scoped
   permission slip) — this is a tiny, fast request, no file involved
3. Your server sends that URL back to the browser
4. Browser uploads the actual file DIRECTLY to S3, using that URL
   — your server is completely out of the picture for this part
\`\`\`

\`\`\`ts
// app/api/upload-url/route.ts — issues the permission, never touches the file
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'ap-south-1' });

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();
  const key = \`uploads/\${crypto.randomUUID()}-\${filename}\`;

  const command = new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes

  return Response.json({ uploadUrl, key });
}
\`\`\`

\`\`\`tsx
// Client-side: upload directly to S3, bypassing your server for the file itself
async function uploadFile(file: File) {
  const { uploadUrl, key } = await fetch('/api/upload-url', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  }).then((r) => r.json());

  await fetch(uploadUrl, { method: 'PUT', body: file }); // straight to S3
  return key; // save this key in your database as the file's reference
}
\`\`\`

**Why this scales where the proxy approach doesn't:** your server's work
per upload is now a tiny, fast request (generate a signed URL) instead of
holding potentially gigabytes of file data in memory while relaying it —
100 simultaneous large uploads cost your server almost nothing, because
the actual data never passes through it.`,

    simpleHi: `**Galat shape: file travel karti hai browser → aapka server → storage:**

\`\`\`
Browser --(file upload karta hai)--> Next.js server --(file forward karta hai)--> S3
                              ^ POORI file ko memory/disk mein hold karta hai
                                jabki ye forwarding hota hai
\`\`\`

**Sahi shape: aapka server ek short-lived PERMISSION issue karta hai, aur
file directly travel karti hai browser → storage:**

\`\`\`
1. Browser AAPKE server se poochhta hai: "Mujhe photo.jpg upload karna hai"
2. Aapka server S3 se ek presigned URL maangta hai (ek temporary, scoped
   permission slip) — ye ek chhota, fast request hai, koi file involved nahi
3. Aapka server wo URL browser ko wapas bhejta hai
4. Browser actual file ko DIRECTLY S3 pe upload karta hai, us URL ko use
   karte hue — aapka server is part ke liye poori tarah picture se bahar hai
\`\`\`

\`\`\`ts
// app/api/upload-url/route.ts — permission issue karta hai, kabhi file touch nahi karta
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'ap-south-1' });

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();
  const key = \`uploads/\${crypto.randomUUID()}-\${filename}\`;

  const command = new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes

  return Response.json({ uploadUrl, key });
}
\`\`\`

\`\`\`tsx
// Client-side: directly S3 pe upload karo, khud file ke liye apne server ko bypass karte hue
async function uploadFile(file: File) {
  const { uploadUrl, key } = await fetch('/api/upload-url', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  }).then((r) => r.json());

  await fetch(uploadUrl, { method: 'PUT', body: file }); // seedha S3 tak
  return key; // is key ko apne database mein file ke reference ki tarah save karo
}
\`\`\`

**Ye kyun scale karta hai jahan proxy approach nahi karta:** aapke server
ka kaam per upload ab ek chhota, fast request hai (ek signed URL generate
karna) potentially gigabytes ka file data memory mein hold karke use relay
karne ke bajaye — 100 simultaneous bade uploads aapke server ko almost
kuch bhi cost nahi karte, kyunki actual data kabhi uske through pass hi
nahi hota.`,

    content: `## Why proxying through your own server doesn't scale

A Next.js server (or any application server) forwarding a file it
received is doing genuinely expensive work: holding the file in memory
(or streaming it to disk) while it arrives, and again while it's forwarded
onward. Multiply this by many simultaneous uploads, and a server that
would otherwise handle thousands of lightweight API requests per second
gets bottlenecked by a handful of large file transfers competing for the
same memory and network bandwidth. On serverless platforms specifically,
this is often not just slow but actually broken — many serverless function
runtimes cap request/response body size and execution duration in ways
that make forwarding a large file impossible regardless of how the code is
written.

## What a presigned URL actually is

A presigned URL is a normal storage-service URL (S3, Cloudflare R2,
Google Cloud Storage all support this) with a cryptographic signature
embedded in its query string, generated using your server's private
credentials but requiring no further server involvement to use. The
signature proves to the storage service that someone with valid
credentials authorized this specific action (uploading to this specific
key, say) within this specific time window. Anyone holding the URL can
perform exactly that one authorized action — nothing more — until it
expires.

## Why the URL must be short-lived and narrowly scoped

A presigned URL that never expired, or one valid for uploading to ANY key
in the bucket rather than one specific key, would be a serious security
risk if it ever leaked (appeared in browser history, a server log, a
network proxy's cache). Scoping it to one specific object key and a short
expiry window (minutes, not hours) limits the blast radius of any leak to
"one specific upload, briefly" rather than "unrestricted access to the
entire bucket, indefinitely."

## Validating what actually got uploaded

Because the upload itself bypasses your server, your server never sees
the file's real content — only what the CLIENT claimed it was (filename,
content type) when it requested the presigned URL. A thorough
implementation validates the uploaded object's actual size and, ideally,
its real content type AFTER the upload completes (via a webhook from the
storage service, or a follow-up HEAD request), rather than trusting the
client's claims as if they were validated data — the client-declared
content type is a hint the browser and storage service use, not a
security guarantee.`,

    contentHi: `## Apne khud ke server se proxy karna scale kyun nahi karta

Ek Next.js server (ya koi bhi application server) jo ek file forward
karta hai jo usne receive ki genuinely expensive kaam kar raha hai: file
ko memory mein (ya disk pe stream karte hue) hold karna jabki ye aati hai,
aur phir se jabki ye aage forward hoti hai. Ise kai simultaneous uploads
se multiply karo, aur ek server jo warna har second hazaron lightweight
API requests handle karta wo bottlenecked ho jata hai muththi bhar bade
file transfers se jo wahi memory aur network bandwidth ke liye compete
karte hain. Serverless platforms pe specifically, ye aksar sirf slow nahi
balki actually broken hota hai — kai serverless function runtimes
request/response body size aur execution duration ko cap karte hain aise
tareeke se jo ek bade file ko forward karna impossible bana dete hain
chahe code kaise bhi likha ho.

## Ek presigned URL actually kya hota hai

Ek presigned URL ek normal storage-service URL hai (S3, Cloudflare R2,
Google Cloud Storage sab ise support karte hain) uske query string mein
ek cryptographic signature embedded ke saath, jo aapke server ke private
credentials use karke generate kiya jata hai par use karne ke liye kisi
further server involvement ki zaroorat nahi. Signature storage service ko
prove karta hai ki valid credentials wale kisi ne is specific action ko
(is specific key pe upload karna, maan lo) is specific time window ke
andar authorize kiya. Jo bhi URL rakhta hai wo exactly wahi ek authorized
action perform kar sakta hai — kuch aur nahi — jab tak ye expire nahi
hota.

## URL ko short-lived aur narrowly scoped kyun hona chahiye

Ek presigned URL jo kabhi expire nahi hota, ya jo bucket mein KISI BHI key
pe upload karne ke liye valid hota ek specific key ke bajaye, agar ye
kabhi leak ho (browser history mein appear hoga, ek server log, ek network
proxy ka cache) ek serious security risk hota. Ise ek specific object key
aur ek short expiry window (minutes, hours nahi) tak scope karna kisi bhi
leak ke blast radius ko limit karta hai "ek specific upload, briefly" tak
"poore bucket tak unrestricted access, indefinitely" ke bajaye.

## Actually kya upload hua ise validate karna

Kyunki upload khud aapke server ko bypass karta hai, aapka server kabhi
file ka real content nahi dekhta — sirf wo jo CLIENT ne claim kiya
(filename, content type) jab usne presigned URL request kiya. Ek thorough
implementation uploaded object ke actual size ko aur, ideally, uske real
content type ko upload complete hone ke BAAD validate karta hai (storage
service se ek webhook ke through, ya ek follow-up HEAD request), client
ke claims ko trust karne ke bajaye jaise wo validated data hon — client-
declared content type ek hint hai jo browser aur storage service use
karte hain, ek security guarantee nahi.`,

    examples: [
      {
        title: 'A complete presigned-upload flow with post-upload verification',
        titleHi: 'Ek complete presigned-upload flow post-upload verification ke saath',
        codeJs: `// app/actions.js
'use server';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'ap-south-1' });
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function getUploadUrl(filename, contentType) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const key = \`uploads/\${session.userId}/\${crypto.randomUUID()}-\${filename}\`;
  const command = new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key };
}

export async function confirmUpload(key) {
  // After the client uploads directly to S3, verify what actually landed there
  const head = await s3.send(new HeadObjectCommand({ Bucket: 'my-app-uploads', Key: key }));
  if (head.ContentLength > MAX_SIZE) {
    throw new Error('File exceeds maximum allowed size');
  }
  await db.file.create({ data: { key, size: head.ContentLength } });
}`,
        codeTs: `// app/actions.ts
'use server';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'ap-south-1' });
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function getUploadUrl(filename: string, contentType: string) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const key = \`uploads/\${session.userId}/\${crypto.randomUUID()}-\${filename}\`;
  const command = new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key };
}

export async function confirmUpload(key: string) {
  // After the client uploads directly to S3, verify what actually landed there
  const head = await s3.send(new HeadObjectCommand({ Bucket: 'my-app-uploads', Key: key }));
  if ((head.ContentLength ?? 0) > MAX_SIZE) {
    throw new Error('File exceeds maximum allowed size');
  }
  await db.file.create({ data: { key, size: head.ContentLength ?? 0 } });
}`,
        code: `export async function getUploadUrl(filename, contentType) {
  const key = \`uploads/\${crypto.randomUUID()}-\${filename}\`;
  const command = new PutObjectCommand({ Bucket: 'my-app-uploads', Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key };
}`,
        output:
          "getUploadUrl issues a URL valid for exactly 5 minutes, scoped to one specific key under the requesting user's own folder. After the browser uploads directly to S3, confirmUpload independently checks the REAL uploaded size via a HeadObject call rather than trusting whatever size the client claimed beforehand.",
        explain:
          "The key is scoped per-user (uploads/{userId}/...), the URL expires quickly, and confirmUpload re-verifies the actual file size against the storage service directly — none of the three security-relevant facts (who can upload, for how long, what actually got uploaded) rely on trusting the client.",
        explainHi:
          "Key per-user scoped hai (uploads/{userId}/...), URL jaldi expire hota hai, aur confirmUpload actual file size ko directly storage service ke against re-verify karta hai — teenon security-relevant facts (kaun upload kar sakta hai, kitni der ke liye, actually kya upload hua) mein se koi bhi client ko trust karne pe rely nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Proxying the entire file through the Next.js server
export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file'); // the WHOLE file is now in this server's memory
  const buffer = await file.arrayBuffer();
  await s3.send(new PutObjectCommand({ Bucket: 'uploads', Key: file.name, Body: buffer }));
  return Response.json({ ok: true });
}`,
        right: `// Issuing a presigned URL — the file never touches this server
export async function POST(request) {
  const { filename, contentType } = await request.json();
  const command = new PutObjectCommand({ Bucket: 'uploads', Key: filename, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return Response.json({ uploadUrl });
  // The client uploads directly to uploadUrl — this endpoint never sees file bytes.
}`,
        why: "Proxying the file means this server's memory usage scales with the size of every concurrent upload — a handful of large simultaneous uploads can exhaust available memory or hit a serverless platform's body-size limit outright. Issuing a presigned URL keeps this endpoint's work constant regardless of file size, since the actual bytes travel directly between the browser and storage.",
        whyHi:
          "File ko proxy karna matlab hai is server ka memory usage har concurrent upload ke size ke saath scale karta hai — muththi bhar bade simultaneous uploads available memory khatam kar sakte hain ya ek serverless platform ki body-size limit ko outright hit kar sakte hain. Ek presigned URL issue karna is endpoint ke kaam ko file size se independent constant rakhta hai, kyunki actual bytes directly browser aur storage ke beech travel karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A video-sharing platform accepting multi-gigabyte uploads universally uses presigned URLs (often with S3 multipart upload for files large enough to benefit from parallel chunked uploads) — proxying gigabyte-scale files through an application server would be both impossibly slow and prohibitively expensive at any real scale.",
        hi: 'Ek video-sharing platform jo multi-gigabyte uploads accept karta hai universally presigned URLs use karta hai (aksar S3 multipart upload ke saath un files ke liye jo parallel chunked uploads se benefit karne jitni badi hon) — gigabyte-scale files ko ek application server se proxy karna kisi bhi real scale pe dono impossibly slow aur prohibitively expensive hota.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does proxying a file upload through your own application server not scale?',
        qHi: 'Ek file upload ko apne khud ke application server se proxy karna scale kyun nahi karta?',
        a: "Because the server must hold the entire file in memory (or stream it to disk) while receiving and again while forwarding it — this cost scales with both file size and the number of concurrent uploads, and can exhaust server memory or exceed serverless platform body-size limits entirely.",
        aHi: 'Kyunki server ko poori file ko memory mein (ya disk pe stream karte hue) hold karna padta hai receive karte waqt aur phir forward karte waqt bhi — ye cost file size aur concurrent uploads ki number dono ke saath scale karti hai, aur server memory khatam kar sakti hai ya serverless platform ki body-size limits ko poori tarah exceed kar sakti hai.',
      },
      {
        q: 'What two properties should a presigned upload URL always have, and why?',
        qHi: 'Ek presigned upload URL mein hamesha kaunse do properties honi chahiye, aur kyun?',
        a: "A short expiry window and a narrow scope (one specific object key, not the whole bucket). Together these limit the damage if the URL ever leaks — to one specific upload, for a brief window, rather than unrestricted long-lived access to the entire storage bucket.",
        aHi: 'Ek short expiry window aur ek narrow scope (ek specific object key, poora bucket nahi). Saath mein ye damage ko limit karte hain agar URL kabhi leak ho — ek specific upload tak, ek brief window ke liye, poore storage bucket tak unrestricted long-lived access ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A profile-picture upload feature lets a user upload a JPEG under 5MB. Design the presigned-URL flow, including what your server should verify BEFORE issuing the URL and what it should verify AFTER the upload completes.",
        taskHi: 'Ek profile-picture upload feature ek user ko 5MB se kam ka ek JPEG upload karne deta hai. Presigned-URL flow design karo, is mein include karte hue ki aapke server ko URL issue karne se PEHLE kya verify karna chahiye aur upload complete hone ke BAAD kya verify karna chahiye.',
        hint: "Before: is the user authenticated, and are they authorized to update their own profile picture. After: does the actual uploaded object's size and content type match what was expected, independent of what the client claimed.",
        hintHi: 'Pehle: kya user authenticated hai, aur kya wo apni khud ki profile picture update karne ke liye authorized hain. Baad mein: kya actual uploaded object ka size aur content type wahi hai jo expected tha, client ne kya claim kiya usse independent.',
      },
    ],

    keyTakeaways: [
      "Proxying a file upload through your own server means that server holds the entire file while forwarding it — this cost scales with file size and concurrency, and can hit serverless body-size limits outright.",
      'A presigned URL is a cryptographically signed permission slip your server generates (a fast, tiny operation) that lets the browser upload directly to storage, bypassing your server for the actual file transfer.',
      'A presigned URL should be short-lived and scoped to one specific object key, limiting the damage if it ever leaks.',
      "Because the upload bypasses your server, it never sees the real file — validate the actual uploaded object's size and content type via a follow-up check (HeadObject, or a webhook) rather than trusting whatever the client claimed when requesting the URL.",
    ],
    keyTakeawaysHi: [
      'Ek file upload ko apne khud ke server se proxy karna matlab hai wo server poori file ko hold karta hai use forward karte hue — ye cost file size aur concurrency ke saath scale karti hai, aur serverless body-size limits ko outright hit kar sakti hai.',
      'Ek presigned URL ek cryptographically signed permission slip hai jo aapka server generate karta hai (ek fast, chhota operation) jo browser ko directly storage pe upload karne deta hai, actual file transfer ke liye aapke server ko bypass karte hue.',
      'Ek presigned URL short-lived aur ek specific object key tak scoped hona chahiye, damage ko limit karte hue agar ye kabhi leak ho.',
      'Kyunki upload aapke server ko bypass karta hai, ye kabhi real file nahi dekhta — actual uploaded object ke size aur content type ko ek follow-up check (HeadObject, ya ek webhook) ke through validate karo client ne URL request karte waqt jo bhi claim kiya usse trust karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-image-optimization',
    title: 'next/image — What It Actually Does For You',
    titleHi: 'next/image — Ye Actually Aapke Liye Kya Karta Hai',
    description:
      "A plain <img> tag serves the exact same file to a phone on a slow connection and a 4K monitor on fiber. next/image automatically resizes, converts format, and lazy-loads images so each visitor downloads only what their actual device and connection need.",
    descriptionHi:
      'Ek plain <img> tag ek phone ko slow connection pe aur ek 4K monitor ko fiber pe exact wahi file serve karta hai. next/image automatically images ko resize karta hai, format convert karta hai, aur lazy-load karta hai taaki har visitor sirf wo download kare jo unke actual device aur connection ko chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A tailor making one-size-fits-all garments, versus one who measures each customer and cuts fabric to fit.** Serving the same full-resolution image file to every visitor is the one-size-fits-all garment — it technically covers everyone, but wastes enormous fabric (bandwidth) on the customer who only needed a small size (a phone screen). A tailor who measures first and cuts exactly enough fabric for each customer wastes nothing and still fits perfectly. next/image is that measuring tailor: it generates and serves an image sized and formatted specifically for the requesting device, not a single one-size file for everyone.",
      hi: 'Ek tailor jo one-size-fits-all garments banata hai, versus ek jo har customer ko measure karta hai aur fabric ko fit karne ke liye kaatta hai. Har visitor ko wahi full-resolution image file serve karna one-size-fits-all garment hai — ye technically sab ko cover karta hai, par enormous fabric (bandwidth) waste karta hai us customer pe jise sirf ek chhota size chahiye tha (ek phone screen). Ek tailor jo pehle measure karta hai aur har customer ke liye exactly utna fabric kaatta hai kuch waste nahi karta aur phir bhi perfectly fit karta hai. next/image wahi measuring tailor hai: ye ek image generate aur serve karta hai specifically requesting device ke liye sized aur formatted, sabke liye ek single one-size file nahi.',
    },

    simple: `**A plain \`<img>\` sends the SAME file to everyone, regardless of their
device or screen size:**

\`\`\`html
<!-- Every visitor downloads this exact 3000x2000px file, even on a phone -->
<img src="/hero.jpg" alt="Product hero" />
\`\`\`

**\`next/image\` requests device-appropriate sizes and modern formats
automatically:**

\`\`\`tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Product hero"
      width={1200}
      height={800}
      priority // for above-the-fold images: skip lazy-loading, load immediately
    />
  );
}
\`\`\`

**What actually happens behind this one component:**

\`\`\`
1. Next.js generates several RESIZED versions of hero.jpg at build/request
   time (e.g. 640px, 1080px, 1920px wide)
2. It converts to a modern format (WebP or AVIF) when the visitor's
   browser supports it — smaller files, same visual quality
3. The browser's own responsive-image mechanism (srcset) picks the
   smallest version that's actually large enough for that visitor's
   screen and pixel density
4. Every <Image> below the fold is lazy-loaded by default — it isn't
   even requested until the visitor scrolls near it
\`\`\`

**\`width\`/\`height\` are required for a reason:** they let the browser
reserve the correct space for the image BEFORE it loads, preventing the
page's layout from jumping around as images arrive — this is a direct,
measurable improvement to Core Web Vitals' Cumulative Layout Shift score
(Module 15 covers Core Web Vitals in depth).`,

    simpleHi: `**Ek plain \`<img>\` sabko WAHI file bhejta hai, unke device ya screen
size se independent:**

\`\`\`html
<!-- Har visitor ye exact 3000x2000px file download karta hai, ek phone pe bhi -->
<img src="/hero.jpg" alt="Product hero" />
\`\`\`

**\`next/image\` automatically device-appropriate sizes aur modern formats
request karta hai:**

\`\`\`tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Product hero"
      width={1200}
      height={800}
      priority // above-the-fold images ke liye: lazy-loading skip karo, turant load karo
    />
  );
}
\`\`\`

**Is ek component ke peeche actually kya hota hai:**

\`\`\`
1. Next.js hero.jpg ke kai RESIZED versions build/request time pe
   generate karta hai (jaise 640px, 1080px, 1920px wide)
2. Ye ek modern format (WebP ya AVIF) mein convert karta hai jab
   visitor ka browser use support karta hai — chhoti files, wahi
   visual quality
3. Browser ka apna responsive-image mechanism (srcset) sabse chhota
   version choose karta hai jo actually us visitor ki screen aur pixel
   density ke liye kaafi bada ho
4. Fold ke neeche har <Image> default se lazy-loaded hai — ise tab tak
   request bhi nahi kiya jata jab tak visitor uske near scroll na kare
\`\`\`

**\`width\`/\`height\` ek wajah se required hain:** wo browser ko image ke
liye correct space reserve karne dete hain uske load hone se PEHLE,
images ke aane par page ke layout ko jump karne se rokte hue — ye Core Web
Vitals ke Cumulative Layout Shift score mein ek direct, measurable
improvement hai (Module 15 Core Web Vitals ko depth mein cover karta hai).`,

    content: `## Why "just compress the images once" isn't equivalent

It might seem like manually compressing a hero image once and serving
that single compressed file would achieve something similar. It doesn't,
for a specific reason: a single compressed file is still one fixed size
and one fixed format for every visitor. A phone on a 3G connection and a
4K monitor on fiber both need genuinely different files to get an optimal
experience — the phone needs a small file that still looks sharp on its
smaller screen; the 4K monitor needs a larger file to avoid looking
blurry when stretched. next/image generates and serves the RIGHT file per
visitor, not one compromise file for everyone.

## Format conversion happens per-browser automatically

AVIF and WebP produce meaningfully smaller files than JPEG or PNG at
equivalent visual quality, but not every browser supports every format.
next/image inspects the requesting browser's capabilities (via the
\`Accept\` header) and serves the best format that browser actually
supports — you author images as ordinary JPEGs or PNGs, and never have to
manually maintain WebP/AVIF copies yourself.

## Why lazy-loading is the default, and when to override it with \`priority\`

Loading every image on a page immediately, including ones far below the
fold that a visitor may never scroll to, wastes bandwidth and delays the
loading of images that ARE immediately visible. next/image defers loading
any image until it's about to enter the viewport — except for images
marked \`priority\`, which is meant specifically for above-the-fold content
(a hero image, a logo) where waiting for a scroll-triggered lazy-load
would actually hurt perceived performance rather than help it.

## The \`width\`/\`height\` requirement is about layout stability, not aesthetics

Without knowing an image's dimensions ahead of time, a browser can't
reserve space for it before the actual image data arrives — so the
surrounding content initially renders as if the image weren't there, then
jumps to make room the instant it loads. This visible jump (layout shift)
is jarring and is directly measured by Core Web Vitals. Supplying
\`width\`/\`height\` (or using \`fill\` with a sized parent container) lets the
browser reserve the correct space immediately, so nothing around the
image needs to move once it arrives.`,

    contentHi: `## "Bas images ko ek baar compress karo" equivalent kyun nahi hai

Ye lag sakta hai ki manually ek hero image ko ek baar compress karna aur
wahi ek compressed file serve karna kuch similar achieve karega. Ye nahi
karta, ek specific wajah se: ek single compressed file abhi bhi har
visitor ke liye ek fixed size aur ek fixed format hai. Ek 3G connection pe
ek phone aur fiber pe ek 4K monitor dono ko genuinely alag files chahiye
ek optimal experience paane ke liye — phone ko ek chhoti file chahiye jo
uski chhoti screen pe sharp dikhe; 4K monitor ko ek badi file chahiye jo
stretch hone par blurry na dikhe. next/image har visitor ke liye SAHI
file generate aur serve karta hai, sabke liye ek compromise file nahi.

## Format conversion per-browser automatically hota hai

AVIF aur WebP equivalent visual quality pe JPEG ya PNG se meaningfully
chhoti files produce karte hain, par har browser har format support nahi
karta. next/image requesting browser ki capabilities inspect karta hai
(\`Accept\` header ke through) aur best format serve karta hai jo wo browser
actually support karta hai — aap images ko ordinary JPEGs ya PNGs ki tarah
author karte ho, aur kabhi manually WebP/AVIF copies khud maintain nahi
karni padti.

## Lazy-loading default kyun hai, aur \`priority\` se override kab karna hai

Page pe har image ko turant load karna, un images samet jo fold se kaafi
neeche hain jinhe visitor kabhi scroll hi na kare, bandwidth waste karta
hai aur un images ke loading ko delay karta hai jo IMMEDIATELY visible
HAIN. next/image kisi bhi image ka loading tab tak defer karta hai jab tak
ye viewport mein enter hone wala na ho — un images ko chhodkar jo
\`priority\` marked hain, jo specifically above-the-fold content ke liye hai
(ek hero image, ek logo) jahan ek scroll-triggered lazy-load ka wait karna
actually perceived performance ko help karne ke bajaye hurt karega.

## \`width\`/\`height\` requirement layout stability ke baare mein hai, aesthetics ke nahi

Ek image ke dimensions ko pehle se jaane bina, ek browser uske liye space
reserve nahi kar sakta actual image data aane se pehle — isliye
surrounding content initially aise render hota hai jaise image wahan hai
hi nahi, phir room banane ke liye jump karta hai jis instant ye load hota
hai. Ye visible jump (layout shift) jarring hai aur Core Web Vitals dwara
directly measure kiya jata hai. \`width\`/\`height\` supply karna (ya ek
sized parent container ke saath \`fill\` use karna) browser ko correct
space immediately reserve karne deta hai, taaki image ke around kuch bhi
move na ho jab ye arrive kare.`,

    examples: [
      {
        title: 'Above-the-fold priority image versus a lazy-loaded gallery',
        titleHi: 'Above-the-fold priority image versus ek lazy-loaded gallery',
        codeJs: `// app/products/[slug]/page.js
import Image from 'next/image';

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Above the fold — load immediately, skip lazy-loading */}
      <Image
        src={product.heroImage}
        alt={product.name}
        width={1200}
        height={800}
        priority
      />

      {/* Below the fold — lazy-load by default, no priority needed */}
      <div className="gallery">
        {product.galleryImages.map((img) => (
          <Image key={img.id} src={img.url} alt={img.alt} width={400} height={300} />
        ))}
      </div>
    </div>
  );
}`,
        codeTs: `// app/products/[slug]/page.tsx
import Image from 'next/image';

interface ProductPageProps {
  product: {
    heroImage: string;
    name: string;
    galleryImages: { id: string; url: string; alt: string }[];
  };
}

export default function ProductPage({ product }: ProductPageProps) {
  return (
    <div>
      {/* Above the fold — load immediately, skip lazy-loading */}
      <Image
        src={product.heroImage}
        alt={product.name}
        width={1200}
        height={800}
        priority
      />

      {/* Below the fold — lazy-load by default, no priority needed */}
      <div className="gallery">
        {product.galleryImages.map((img) => (
          <Image key={img.id} src={img.url} alt={img.alt} width={400} height={300} />
        ))}
      </div>
    </div>
  );
}`,
        code: `<Image src={product.heroImage} alt={product.name} width={1200} height={800} priority />
{product.galleryImages.map((img) => (
  <Image key={img.id} src={img.url} alt={img.alt} width={400} height={300} />
))}`,
        output:
          "The hero image loads immediately as part of the initial page render. Each gallery image below it is only requested once the visitor scrolls near it — a visitor who never scrolls down never triggers those downloads at all.",
        explain:
          "priority is reserved for the one or two images most critical to the initial view — marking everything priority would defeat the purpose of lazy-loading entirely, since every image would then load immediately regardless of whether the visitor ever sees it.",
        explainHi:
          "priority un ek ya do images ke liye reserved hai jo initial view ke liye sabse critical hain — sab kuch priority mark karna lazy-loading ke poore purpose ko defeat kar dega, kyunki har image tab immediately load hogi chahe visitor use kabhi dekhe ya nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Marking every image priority — defeats lazy-loading entirely
<Image src={hero} alt="Hero" width={1200} height={800} priority />
<Image src={galleryImg1} alt="Gallery 1" width={400} height={300} priority />
<Image src={galleryImg2} alt="Gallery 2" width={400} height={300} priority />
{/* ...20 more gallery images, all marked priority */}
// Every single one now loads immediately, regardless of scroll position`,
        right: `// Only the genuinely above-the-fold image gets priority
<Image src={hero} alt="Hero" width={1200} height={800} priority />
<Image src={galleryImg1} alt="Gallery 1" width={400} height={300} />
<Image src={galleryImg2} alt="Gallery 2" width={400} height={300} />
{/* gallery images lazy-load as the visitor scrolls to them */}`,
        why: "priority disables lazy-loading for that specific image, telling Next.js to load it immediately regardless of scroll position. Marking many images priority means all of them compete for bandwidth on initial page load, which is exactly the wasted-bandwidth problem lazy-loading exists to prevent.",
        whyHi:
          "priority us specific image ke liye lazy-loading disable karta hai, Next.js ko batate hue ki ise immediately load karo scroll position se independent. Kai images ko priority mark karna matlab hai wo sab initial page load pe bandwidth ke liye compete karte hain, jo exactly wahi wasted-bandwidth problem hai jise lazy-loading rokne ke liye exist karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A product catalog page with 50 thumbnail images typically marks none of them priority (they're all below an initial hero section) and relies entirely on next/image's default lazy-loading — a visitor who only views the first 6 products before leaving never triggers downloads for the other 44.",
        hi: 'Ek product catalog page 50 thumbnail images ke saath typically unme se kisi ko bhi priority mark nahi karta (wo sab ek initial hero section ke neeche hain) aur poori tarah next/image ke default lazy-loading pe rely karta hai — ek visitor jo sirf pehle 6 products dekhta hai jaane se pehle baaki 44 ke liye kabhi downloads trigger nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: "What does next/image actually do differently from a plain <img> tag?",
        qHi: 'next/image actually ek plain <img> tag se differently kya karta hai?',
        a: "It generates and serves device-appropriate resized versions of the image, automatically converts to modern formats (WebP/AVIF) when the browser supports them, and lazy-loads any image not marked priority so it isn't downloaded until the visitor scrolls near it.",
        aHi: 'Ye image ke device-appropriate resized versions generate aur serve karta hai, automatically modern formats (WebP/AVIF) mein convert karta hai jab browser unhe support karta hai, aur kisi bhi image ko lazy-load karta hai jo priority marked nahi hai taaki ye tab tak download na ho jab tak visitor uske near scroll na kare.',
      },
      {
        q: "Why does next/image require width and height props?",
        qHi: 'next/image ko width aur height props kyun chahiye?',
        a: "So the browser can reserve the correct amount of space for the image before it actually loads, preventing surrounding content from jumping around once the image arrives — this directly improves the Cumulative Layout Shift component of Core Web Vitals.",
        aHi: 'Taaki browser image ke actual load hone se pehle uske liye correct amount ka space reserve kar sake, surrounding content ko image aane par idhar-udhar jump karne se rokte hue — ye directly Core Web Vitals ke Cumulative Layout Shift component ko improve karta hai.',
      },
    ],

    exercises: [
      {
        task: "A page has a large hero banner at the top, followed by a 100-item infinite-scrolling image feed below it. Decide which image(s), if any, should get the priority prop, and justify your answer.",
        taskHi: 'Ek page ke top pe ek bada hero banner hai, uske neeche ek 100-item infinite-scrolling image feed hai. Decide karo kaunse image(s), agar koi hon, ko priority prop milna chahiye, aur apna jawab justify karo.',
        hint: "Only content visible without scrolling benefits from skipping lazy-load — think about how many images that realistically is on this page.",
        hintHi: 'Sirf wo content jo bina scroll kiye visible hai lazy-load skip karne se benefit karta hai — socho ki is page pe realistically kitni images ye hain.',
      },
    ],

    keyTakeaways: [
      "A plain <img> serves the identical file to every visitor regardless of device or connection; next/image generates and serves device-appropriate sizes and modern formats automatically.",
      'Format conversion (to WebP/AVIF where supported) and responsive sizing both happen without maintaining separate image files yourself — you author ordinary JPEGs or PNGs.',
      "Images are lazy-loaded by default (not requested until near the viewport); the priority prop should be reserved for genuinely above-the-fold content, since marking too many images priority defeats the purpose.",
      'width and height props let the browser reserve layout space before the image loads, directly improving Cumulative Layout Shift — a real Core Web Vitals metric, not just a code requirement.',
    ],
    keyTakeawaysHi: [
      'Ek plain <img> har visitor ko identical file serve karta hai unke device ya connection se independent; next/image automatically device-appropriate sizes aur modern formats generate aur serve karta hai.',
      'Format conversion (supported hone par WebP/AVIF mein) aur responsive sizing dono bina khud alag image files maintain kiye hote hain — aap ordinary JPEGs ya PNGs author karte ho.',
      'Images default se lazy-loaded hoti hain (viewport ke near hone tak request nahi hoti); priority prop genuinely above-the-fold content ke liye reserved hona chahiye, kyunki zyada images ko priority mark karna purpose defeat kar deta hai.',
      'width aur height props browser ko image load hone se pehle layout space reserve karne dete hain, directly Cumulative Layout Shift ko improve karte hue — ek real Core Web Vitals metric, sirf ek code requirement nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-video-large-asset-cdn-delivery',
    title: 'Video & Large-Asset Delivery via a CDN',
    titleHi: 'CDN Ke Through Video Aur Large-Asset Delivery',
    description:
      "Video and other large media files are wrong for the same reasons big uploads are: they shouldn't pass through your application server. Serving them from a CDN edge location physically close to each visitor, with adaptive bitrate for video, is what makes large media feel fast at any real scale.",
    descriptionHi:
      'Video aur doosri large media files un hi wajahon se galat hain jin wajahon se bade uploads galat hain: unhe aapke application server se guzarna nahi chahiye. Unhe ek CDN edge location se serve karna jo har visitor ke physically close ho, video ke liye adaptive bitrate ke saath, wahi hai jo large media ko kisi bhi real scale pe fast feel karwata hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A single national warehouse shipping every order across the whole country, versus regional warehouses near each customer.** A single warehouse in one city means every order, no matter where the customer lives, travels the same long distance — slow and expensive for anyone far from it. A CDN is the network of regional warehouses: the same product is stocked in many locations near actual customers, and each order ships from whichever warehouse is physically closest, making delivery fast everywhere instead of fast only near the one central warehouse.",
      hi: 'Ek single national warehouse jo poore desh mein har order ship karta hai, versus har customer ke near regional warehouses. Ek single warehouse ek city mein matlab hai har order, customer kahin bhi rehta ho, wahi lambi distance travel karta hai — kisi ke liye bhi jo usse dur hai slow aur expensive. Ek CDN regional warehouses ka network hai: wahi product kai locations mein stock kiya jata hai actual customers ke near, aur har order jahan bhi physically closest warehouse hai wahan se ship hota hai, delivery ko har jagah fast banate hue, sirf ek central warehouse ke near fast banane ke bajaye.',
    },

    simple: `**Serving a video file directly from your own server means every
visitor, no matter where they are in the world, downloads it from that
one physical location:**

\`\`\`
Visitor in Mumbai  --(video streams from)-->  Server in ap-south-1 (close, fast)
Visitor in Brazil  --(video streams from)-->  Server in ap-south-1 (very far, slow)
\`\`\`

**A CDN (Content Delivery Network) caches the same file across many
physical locations worldwide, and routes each visitor to the nearest
one:**

\`\`\`
Visitor in Mumbai  --(video streams from)-->  CDN edge in Mumbai
Visitor in Brazil  --(video streams from)-->  CDN edge in São Paulo
\`\`\`

**In practice, this usually means uploading to a service that IS a CDN
(or fronts your storage with one) rather than building CDN logic
yourself:**

\`\`\`tsx
// A video hosted on a CDN-backed service — the <video> tag itself is
// unremarkable; the CDN happens entirely at the URL/infrastructure level
export default function ProductVideo() {
  return (
    <video controls width={800} poster="/video-poster.jpg">
      <source src="https://cdn.example.com/videos/demo.mp4" type="video/mp4" />
    </video>
  );
}
\`\`\`

**Adaptive bitrate streaming (HLS/DASH) goes one step further than a
plain CDN-hosted file:** instead of one fixed-quality video file, the
video is encoded at multiple quality levels, and the player automatically
switches between them in real time based on the visitor's current
connection speed — starting at a lower quality that plays instantly, then
stepping up if the connection proves fast enough, and stepping back down
automatically if it doesn't, rather than a visitor on a slow connection
being stuck buffering a fixed high-quality file.`,

    simpleHi: `**Ek video file directly apne khud ke server se serve karna matlab hai
har visitor, duniya mein kahin bhi ho, use us ek physical location se
download karta hai:**

\`\`\`
Mumbai mein visitor  --(video stream hota hai)-->  Server ap-south-1 mein (close, fast)
Brazil mein visitor  --(video stream hota hai)-->  Server ap-south-1 mein (bahut dur, slow)
\`\`\`

**Ek CDN (Content Delivery Network) wahi file kai physical locations pe
worldwide cache karta hai, aur har visitor ko nearest wale pe route karta
hai:**

\`\`\`
Mumbai mein visitor  --(video stream hota hai)-->  Mumbai mein CDN edge
Brazil mein visitor  --(video stream hota hai)-->  São Paulo mein CDN edge
\`\`\`

**Practically, iska usually matlab hai ek aise service pe upload karna jo
khud ek CDN HAI (ya aapke storage ko ek se front karta hai) khud CDN logic
banane ke bajaye:**

\`\`\`tsx
// Ek video jo ek CDN-backed service pe hosted hai — <video> tag khud
// unremarkable hai; CDN poori tarah URL/infrastructure level pe hota hai
export default function ProductVideo() {
  return (
    <video controls width={800} poster="/video-poster.jpg">
      <source src="https://cdn.example.com/videos/demo.mp4" type="video/mp4" />
    </video>
  );
}
\`\`\`

**Adaptive bitrate streaming (HLS/DASH) ek plain CDN-hosted file se ek
step aage jata hai:** ek fixed-quality video file ke bajaye, video kai
quality levels pe encode kiya jata hai, aur player automatically real time
mein unke beech switch karta hai visitor ki current connection speed ke
basis par — ek lower quality se shuru karte hue jo turant play hoti hai,
phir step up karte hue agar connection kaafi fast prove hoti hai, aur
automatically step back down karte hue agar nahi karti, ek visitor ko
slow connection pe ek fixed high-quality file buffer karne mein stuck
hone ke bajaye.`,

    content: `## Why "just put it on a fast server" doesn't solve the real problem

A single server, however powerful, is physically located somewhere — and
the speed of light imposes a real, unavoidable delay for any visitor far
from that location. No amount of server-side optimization removes the
literal distance data has to travel; the only fix for distance is having
the data available closer to the visitor in the first place, which is
exactly what a CDN's distributed edge locations provide.

## What actually happens at a CDN edge

A CDN edge location is a cache: the first request for a given file from a
region triggers the edge to fetch it once from your origin (your S3
bucket, say) and store a copy; every subsequent request from that region
is served directly from the edge's cached copy, without touching your
origin at all. This means your origin server's load stays roughly
constant regardless of how many visitors request the same popular video
worldwide — the CDN absorbs the repeated-request traffic.

## Why video specifically benefits from adaptive bitrate, beyond just CDN caching

A CDN solves the distance problem, but a visitor's actual last-mile
connection speed still varies enormously (fiber versus a congested mobile
network). A single fixed-quality video file is either too large for a
slow connection (constant buffering) or unnecessarily low-quality for a
fast one. Adaptive bitrate streaming solves this orthogonally to CDN
distance: the SAME video exists as multiple quality-level files, and the
player continuously measures actual download speed and switches between
them, so the visitor always gets close to the best quality their current,
real-time connection can sustain without stalling.

## Where this actually gets implemented in a Next.js app

In practice, teams rarely hand-build CDN routing or adaptive-bitrate
encoding themselves — dedicated services (a CDN provider fronting S3, or
a video platform like Mux/Cloudflare Stream that handles encoding,
multiple quality levels, and CDN delivery as one product) do this well
already. The Next.js-specific work is usually just: upload the source
file via a presigned URL (Lesson 1), let the service handle encoding and
delivery, and embed the resulting player or \`<video>\`/\`<source>\` URL it
gives back.`,

    contentHi: `## "Bas ise ek fast server pe daal do" real problem kyun solve nahi karta

Ek single server, chahe kitna bhi powerful ho, physically kahin located
hai — aur speed of light us location se dur kisi bhi visitor ke liye ek
real, unavoidable delay impose karti hai. Server-side optimization ki
koi bhi amount us literal distance ko nahi hataati jo data ko travel
karna padta hai; distance ka ekmatra fix pehli jagah visitor ke closer
data available hona hai, jo exactly wahi hai jo ek CDN ke distributed
edge locations provide karte hain.

## Ek CDN edge pe actually kya hota hai

Ek CDN edge location ek cache hai: ek region se ek given file ke liye
pehli request edge ko ise ek baar aapke origin se (aapka S3 bucket, maan
lo) fetch karne ke liye trigger karti hai aur ek copy store karti hai; us
region se har subsequent request directly edge ki cached copy se serve
hoti hai, aapke origin ko bilkul touch kiye bina. Iska matlab hai aapke
origin server ka load roughly constant rehta hai chahe kitne bhi visitors
worldwide wahi popular video request karein — CDN repeated-request
traffic ko absorb karta hai.

## Video specifically CDN caching se aage adaptive bitrate se kyun benefit karta hai

Ek CDN distance problem solve karta hai, par ek visitor ka actual
last-mile connection speed abhi bhi enormously vary karta hai (fiber
versus ek congested mobile network). Ek single fixed-quality video file
ya to ek slow connection ke liye zyada badi hai (constant buffering) ya
ek fast connection ke liye unnecessarily low-quality hai. Adaptive
bitrate streaming ise CDN distance se orthogonally solve karta hai: WAHI
video multiple quality-level files ki tarah exist karti hai, aur player
continuously actual download speed measure karta hai aur unke beech
switch karta hai, taaki visitor hamesha unki current, real-time
connection jitna sustain kar sake usse close best quality paaye bina
stall kiye.

## Ye actually ek Next.js app mein kahan implement hota hai

Practically, teams shayad hi khud CDN routing ya adaptive-bitrate encoding
hand-build karte hain — dedicated services (ek CDN provider jo S3 ko
front karta hai, ya ek video platform jaise Mux/Cloudflare Stream jo
encoding, multiple quality levels, aur CDN delivery ko ek product ki
tarah handle karta hai) ye already achhe se karte hain. Next.js-specific
kaam usually bas ye hai: source file ko ek presigned URL (Lesson 1) ke
through upload karo, service ko encoding aur delivery handle karne do,
aur resulting player ya \`<video>\`/\`<source>\` URL embed karo jo ye wapas
deta hai.`,

    examples: [
      {
        title: 'Embedding a CDN-delivered, adaptive-bitrate video',
        titleHi: 'Ek CDN-delivered, adaptive-bitrate video embed karna',
        codeJs: `// A video hosted on a service that provides adaptive bitrate + CDN delivery
// (using HLS — HTTP Live Streaming — via a lightweight player library)
'use client';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function AdaptiveVideoPlayer({ hlsUrl, posterUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl); // .m3u8 manifest listing multiple quality levels
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl; // native HLS support (Safari)
    }
  }, [hlsUrl]);

  return <video ref={videoRef} controls poster={posterUrl} width={800} />;
}`,
        codeTs: `// A video hosted on a service that provides adaptive bitrate + CDN delivery
// (using HLS — HTTP Live Streaming — via a lightweight player library)
'use client';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface AdaptiveVideoPlayerProps {
  hlsUrl: string;
  posterUrl: string;
}

export function AdaptiveVideoPlayer({ hlsUrl, posterUrl }: AdaptiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl); // .m3u8 manifest listing multiple quality levels
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl; // native HLS support (Safari)
    }
  }, [hlsUrl]);

  return <video ref={videoRef} controls poster={posterUrl} width={800} />;
}`,
        code: `export function AdaptiveVideoPlayer({ hlsUrl, posterUrl }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(videoRef.current);
    return () => hls.destroy();
  }, [hlsUrl]);
  return <video ref={videoRef} controls poster={posterUrl} width={800} />;
}`,
        output:
          "The video starts playing quickly at a lower quality level while hls.js measures the visitor's actual bandwidth, then automatically switches to a higher quality level if the connection sustains it — all served from the nearest CDN edge to that visitor.",
        explain:
          "The .m3u8 manifest referenced by hlsUrl lists multiple pre-encoded quality levels; hls.js (or the browser's native HLS support in Safari) handles the real-time switching between them based on measured throughput, and the CDN in front of these files ensures each visitor pulls from a geographically nearby edge.",
        explainHi:
          "hlsUrl ke through referenced .m3u8 manifest multiple pre-encoded quality levels list karta hai; hls.js (ya Safari mein browser ka native HLS support) unke beech real-time switching handle karta hai measured throughput ke basis par, aur in files ke saamne CDN ensure karta hai ki har visitor ek geographically nearby edge se pull kare.",
      },
    ],

    mistakes: [
      {
        wrong: `// Serving a large video file directly from the Next.js app's own storage/server
export default function ProductVideo() {
  return <video controls src="/videos/product-demo.mp4" width={800} />;
  // Every visitor worldwide downloads this from the SAME server location,
  // and gets exactly one fixed quality regardless of their connection.
}`,
        right: `// Serving via a CDN-backed URL, with adaptive quality
export default function ProductVideo({ hlsUrl }) {
  return <AdaptiveVideoPlayer hlsUrl={hlsUrl} posterUrl="/poster.jpg" />;
  // Each visitor streams from a nearby CDN edge, at a quality level
  // their own connection can actually sustain.
}`,
        why: "A video served directly from the app's own origin has no distance advantage for distant visitors and no adaptability for varying connection speeds — every visitor, everywhere, gets identical treatment regardless of how far they are or how fast their connection is, which is precisely what a CDN and adaptive bitrate exist to fix.",
        whyHi:
          "Ek video jo app ke apne origin se directly serve hota hai dur ke visitors ke liye koi distance advantage nahi rakhta aur varying connection speeds ke liye koi adaptability nahi rakhta — har visitor, har jagah, identical treatment paata hai chahe wo kitna bhi dur ho ya unki connection kitni bhi fast ho, jo precisely wahi hai jise fix karne ke liye ek CDN aur adaptive bitrate exist karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A global online course platform typically uploads source video once, through a service like Mux or Cloudflare Stream, which handles encoding into multiple quality levels and serves every learner worldwide from a geographically nearby CDN edge — a learner in Australia and one in Germany both get fast, smooth playback despite the origin upload happening in one single location.",
        hi: 'Ek global online course platform typically source video ko ek baar upload karta hai, Mux ya Cloudflare Stream jaisi ek service ke through, jo multiple quality levels mein encoding handle karta hai aur duniya bhar ke har learner ko ek geographically nearby CDN edge se serve karta hai — Australia mein ek learner aur Germany mein ek dono ko fast, smooth playback milta hai chahe origin upload ek single location mein hua ho.',
      },
    ],

    interviewQA: [
      {
        q: "Why does a CDN help a visitor far from your server, when the video file itself doesn't change?",
        qHi: 'Ek CDN aapke server se dur ek visitor ki help kyun karta hai, jab video file khud change nahi hoti?',
        a: "A CDN caches copies of the same file across many geographically distributed edge locations, so a distant visitor's request is served from a nearby edge instead of traveling all the way to your single origin server — reducing the physical distance the data has to travel, and therefore latency.",
        aHi: 'Ek CDN wahi file ki copies kai geographically distributed edge locations ke across cache karta hai, isliye ek dur ke visitor ki request ek nearby edge se serve hoti hai aapke single origin server tak poora safar karne ke bajaye — data ko travel karni padne wali physical distance kam karte hue, aur isliye latency.',
      },
      {
        q: 'What problem does adaptive bitrate streaming solve that CDN caching alone does not?',
        qHi: 'Adaptive bitrate streaming kaunsi problem solve karta hai jo akela CDN caching nahi karta?',
        a: "CDN caching addresses geographic distance, but a visitor's last-mile connection speed still varies independently of distance (a fast connection near a slow edge, or a slow connection near a fast edge). Adaptive bitrate encodes the video at multiple quality levels and switches between them in real time based on measured connection speed, regardless of where the CDN edge is.",
        aHi: 'CDN caching geographic distance address karta hai, par ek visitor ki last-mile connection speed abhi bhi distance se independently vary karti hai (ek slow edge ke near ek fast connection, ya ek fast edge ke near ek slow connection). Adaptive bitrate video ko multiple quality levels pe encode karta hai aur unke beech real time mein switch karta hai measured connection speed ke basis par, CDN edge kahan hai usse independent.',
      },
    ],

    exercises: [
      {
        task: "A company has one office in Mumbai and serves an internal training video library only to its own employees, all located in that same office. Discuss whether a CDN would provide meaningful benefit here, and why the calculus differs from a public, globally-distributed video platform.",
        taskHi: 'Ek company ka Mumbai mein ek office hai aur ek internal training video library sirf apne khud ke employees ko serve karta hai, sab usi office mein located. Discuss karo ki kya ek CDN yahan meaningful benefit dega, aur calculus ek public, globally-distributed video platform se kyun alag hai.',
        hint: "CDN benefit comes specifically from reducing distance between visitor and server — think about whether that distance is actually large in this specific scenario.",
        hintHi: 'CDN benefit specifically visitor aur server ke beech distance kam karne se aata hai — socho ki kya wo distance actually is specific scenario mein bada hai.',
      },
    ],

    keyTakeaways: [
      "A single server has a fixed physical location, so distant visitors always face real latency from the speed of light and network distance — no server-side optimization removes this, only serving content from a location closer to the visitor does.",
      'A CDN caches the same file across many geographically distributed edge locations and routes each visitor to the nearest one, keeping origin server load roughly constant regardless of total traffic.',
      "Adaptive bitrate streaming solves connection-speed variance, orthogonal to CDN distance: the same video exists as multiple quality-level files, and the player switches between them in real time based on the visitor's actual measured bandwidth.",
      'In practice, CDN delivery and adaptive-bitrate encoding for video are almost always handled by a dedicated service rather than hand-built — the Next.js-specific work is usually just uploading the source and embedding the resulting player/URL.',
    ],
    keyTakeawaysHi: [
      'Ek single server ki ek fixed physical location hoti hai, isliye dur ke visitors hamesha speed of light aur network distance se real latency face karte hain — koi server-side optimization ise nahi hataata, sirf visitor ke closer ek location se content serve karna hataata hai.',
      'Ek CDN wahi file ko kai geographically distributed edge locations ke across cache karta hai aur har visitor ko nearest wale pe route karta hai, origin server load ko total traffic se independent roughly constant rakhte hue.',
      'Adaptive bitrate streaming connection-speed variance solve karta hai, CDN distance se orthogonal: wahi video multiple quality-level files ki tarah exist karti hai, aur player unke beech real time mein switch karta hai visitor ki actual measured bandwidth ke basis par.',
      'Practically, video ke liye CDN delivery aur adaptive-bitrate encoding almost hamesha ek dedicated service dwara handle kiye jaate hain hand-built hone ke bajaye — Next.js-specific kaam usually bas source upload karna aur resulting player/URL embed karna hai.',
    ],
  },
];
