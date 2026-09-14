/**
 * Next.js Complete Course — Module 22: Background Jobs, Email & Internationalization, lessons 1-3.
 *
 * Lesson 1: Why work outside the request/response cycle needs a real background-job system.
 * Lesson 2: Transactional email done correctly.
 * Lesson 3: Internationalized routing for a genuinely multi-language app.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_22: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-background-jobs-queues',
    title: 'Background Jobs — Why a Slow Server Action Is the Wrong Tool',
    titleHi: 'Background Jobs — Ek Slow Server Action Galat Tool Kyun Hai',
    description:
      "A visitor waiting on a Server Action to finish is waiting on a real HTTP request that has to complete within a time limit. Work that genuinely takes minutes — generating a large report, resizing a batch of images, retrying a flaky third-party call — needs to happen somewhere that isn't tied to a visitor's browser waiting for a response.",
    descriptionHi:
      'Ek visitor jo ek Server Action ke finish hone ka wait kar raha hai wo ek real HTTP request ka wait kar raha hai jise ek time limit ke andar complete hona chahiye. Wo kaam jise genuinely minutes lagte hain — ek bada report generate karna, images ka ek batch resize karna, ek flaky third-party call retry karna — kahin aisi jagah hona chahiye jo ek visitor ke browser ke response ka wait karne se tied na ho.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A fast-food counter taking your order versus a restaurant's kitchen actually preparing a slow-cooked dish — and why the person at the counter doesn't make you stand there until the dish is done.** The counter's whole job is a quick interaction: take the order, hand you a ticket, tell you it's being made. If the counter clerk personally stood frozen at the register until a three-hour slow-cooked dish finished, every other customer behind you would be stuck waiting for something that has nothing to do with THEIR order. A well-run kitchen instead takes the ticket, hands it to a back station that works independently, and lets the counter immediately move to the next customer — the ticket (and eventually a notification when the dish is ready) is the connection between the fast interaction and the slow work, not a wait. A Server Action or Route Handler is the counter; a background job system is the back-of-house station that does slow work independently, without the visitor's request sitting frozen the whole time.",
      hi: 'Ek fast-food counter jo aapka order leta hai versus ek restaurant ka kitchen jo actually ek slow-cooked dish prepare karta hai — aur counter pe insaan aapko wahan tab tak khada kyun nahi rakhta jab tak dish taiyaar nahi ho jaati. Counter ka poora kaam ek quick interaction hai: order lo, aapko ek ticket do, batao ki ye ban rahi hai. Agar counter clerk personally register pe frozen khada rehta jab tak ek teen-ghante wali slow-cooked dish khatam na ho, aapke peeche har doosra customer ek aisi cheez ka wait karne mein stuck ho jata jiska UNKE order se koi lena-dena nahi. Ek well-run kitchen iske bajaye ticket leta hai, use ek back station ko de deta hai jo independently kaam karta hai, aur counter ko turant agle customer ki taraf move karne deta hai — ticket (aur eventually ek notification jab dish ready ho) fast interaction aur slow work ke beech connection hai, ek wait nahi. Ek Server Action ya Route Handler counter hai; ek background job system back-of-house station hai jo slow work independently karta hai, visitor ki request ko poore time frozen baithe bina.',
    },

    simple: `**Why a Server Action can't just "run longer" for genuinely slow
work:** every serverless platform (and Module 17's Edge runtime
specifically) enforces a maximum execution duration per request — a
Server Action or Route Handler that runs past this limit is simply
killed, regardless of how close it was to finishing. This isn't a
configuration you can raise indefinitely; it's a structural property of
request/response infrastructure being built around "fast interactions,"
the same reasoning Module 11 used for why serverless can't hold a
WebSocket open.

**What genuinely belongs in a background job instead of a Server
Action:**

\`\`\`
- Generating a large report or export (could take minutes)
- Resizing/processing many uploaded images or videos
- Sending a batch of emails (Lesson 2) to thousands of recipients
- Retrying a flaky third-party API call with backoff, across minutes
  or hours, not a single request's lifetime
- Any scheduled/recurring task (a nightly cleanup, a weekly digest)
\`\`\`

**The pattern — a Server Action enqueues a job and returns immediately;
the actual work happens elsewhere, on its own schedule:**

\`\`\`ts
// app/actions.ts
'use server';
import { inngest } from '@/lib/inngest';

export async function requestReportExport(reportId: string) {
  // This returns in milliseconds — it does NOT wait for the report
  // to actually be generated
  await inngest.send({ name: 'report/export.requested', data: { reportId } });
  return { status: 'queued' };
}
\`\`\`

\`\`\`ts
// A separate background function, defined once, runs independently —
// NOT triggered by, or tied to the lifetime of, any single HTTP request
import { inngest } from '@/lib/inngest';

export const generateReport = inngest.createFunction(
  { id: 'generate-report' },
  { event: 'report/export.requested' },
  async ({ event, step }) => {
    // This can genuinely take minutes — there is no request waiting on it
    const data = await step.run('fetch-data', () => fetchAllReportData(event.data.reportId));
    const pdf = await step.run('generate-pdf', () => renderReportPdf(data));
    await step.run('notify-user', () => sendReportReadyEmail(event.data.reportId, pdf.url));
  },
);
\`\`\`

**The key architectural shift this requires:** the visitor's browser
gets an IMMEDIATE response ("your report is being generated"), and finds
out the work is done later — via a notification, an email (Lesson 2), or
by polling/checking back — rather than the browser's own request staying
open for however long the work takes. This is the same "streaming instead
of waiting for everything" mindset Module 3 taught for slow page loads,
applied to work that can't even fit inside one request's lifetime at all.`,

    simpleHi: `**Ek Server Action bas genuinely slow work ke liye "longer chal" kyun
nahi sakta:** har serverless platform (aur Module 17 ka Edge runtime
specifically) ek maximum execution duration per request enforce karta hai
— ek Server Action ya Route Handler jo is limit se aage chalta hai simply
kill ho jata hai, chahe ye finish hone ke kitna bhi close tha. Ye koi
configuration nahi hai jise aap indefinitely raise kar sakte ho; ye
request/response infrastructure ki ek structural property hai "fast
interactions" ke around banayi gayi, wahi reasoning jo Module 11 ne use
ki ki serverless ek WebSocket open kyun nahi hold kar sakta.

**Ek Server Action ke bajaye genuinely ek background job mein kya belong
karta hai:**

\`\`\`
- Ek bada report ya export generate karna (minutes lag sakte hain)
- Kai uploaded images ya videos ko resize/process karna
- Hazaron recipients ko ek batch of emails bhejna (Lesson 2)
- Ek flaky third-party API call ko backoff ke saath retry karna, minutes
  ya hours ke across, ek single request ki lifetime nahi
- Koi bhi scheduled/recurring task (ek nightly cleanup, ek weekly digest)
\`\`\`

**Pattern — ek Server Action ek job enqueue karta hai aur turant return
karta hai; actual kaam kahin aur hota hai, apne khud ke schedule pe:**

\`\`\`ts
// app/actions.ts
'use server';
import { inngest } from '@/lib/inngest';

export async function requestReportExport(reportId: string) {
  // Ye milliseconds mein return hota hai — ye report ke actually
  // generate hone ka wait NAHI karta
  await inngest.send({ name: 'report/export.requested', data: { reportId } });
  return { status: 'queued' };
}
\`\`\`

\`\`\`ts
// Ek separate background function, ek baar defined, independently chalta hai —
// kisi bhi single HTTP request se triggered, ya uski lifetime se tied NAHI
import { inngest } from '@/lib/inngest';

export const generateReport = inngest.createFunction(
  { id: 'generate-report' },
  { event: 'report/export.requested' },
  async ({ event, step }) => {
    // Ise genuinely minutes lag sakte hain — koi request iska wait nahi kar raha
    const data = await step.run('fetch-data', () => fetchAllReportData(event.data.reportId));
    const pdf = await step.run('generate-pdf', () => renderReportPdf(data));
    await step.run('notify-user', () => sendReportReadyEmail(event.data.reportId, pdf.url));
  },
);
\`\`\`

**Key architectural shift jo ise chahiye:** visitor ke browser ko ek
IMMEDIATE response milta hai ("aapka report generate ho raha hai"), aur
baad mein pata chalta hai ki kaam ho gaya — ek notification ke through, ek
email (Lesson 2), ya wapas check karke — browser ki apni request ke jitna
bhi time kaam le use khula rehne ke bajaye. Ye wahi "streaming instead of
waiting for everything" mindset hai jo Module 3 ne slow page loads ke
liye sikhaya, us kaam pe applied jo ek request ki lifetime ke andar bilkul
fit hi nahi ho sakta.`,

    content: `## Why this constraint is fundamental, not a limit to work around

Module 17's Edge runtime lesson and Module 11's WebSocket lesson both
established the same underlying principle from different angles:
request/response infrastructure is built around short-lived, fast
interactions, and genuinely long-running work needs a fundamentally
different execution model, not a longer timeout setting. A serverless
platform charges for and schedules resources assuming most invocations
finish in seconds — an execution that runs for ten minutes ties up
resources in a way the whole platform's economics and scaling model
isn't designed for, which is exactly why these limits exist and aren't
meant to be raised away.

## What a background job system actually provides

A system like Inngest or BullMQ provides durable, independently-scheduled
execution: a job is enqueued (often via a lightweight message, as shown),
persisted somewhere durable (so it survives a server restart), and
executed by a worker process that isn't tied to any specific incoming
HTTP request's lifetime. This also typically includes automatic retries
with backoff for a step that fails (a third-party API being briefly
down), and the ability to break one long job into smaller, individually
retryable steps — none of which a Server Action's simple "run to
completion or fail" model provides.

## Why "just await it slower" inside a Server Action doesn't work, even
as a temporary hack

It's tempting to think a report generation feature could ship faster by
just letting the Server Action take longer, planning to "fix it properly
later." This doesn't actually work even temporarily — the platform's
hard execution limit kills the request regardless of intent, and even on
a platform without a hard limit, a visitor's browser holding one HTTP
request open for minutes is fragile (a dropped connection, a closed tab,
a mobile network hiccup all abandon the work entirely, with no record it
was ever attempted). A background job's durability (surviving exactly
these failure modes) isn't a performance nicety — it's the actual
correctness property that makes "generate a report" a reliable feature
rather than something that silently fails under real-world conditions.

## How this connects to the request/response flow a visitor actually
experiences

The visitor-facing pattern is enqueue-then-notify: a Server Action
returns almost instantly with "your request has been queued," and the
actual completion is communicated later — via a real-time update
(Module 11's WebSocket/SSE patterns), a transactional email (Lesson 2),
or simply the visitor checking back on a status page. This is a genuinely
different UX shape than the synchronous request/response pattern most of
this course covered, and recognizing which category a given feature
belongs to — fast enough for a normal Server Action, or genuinely
long-running and needing this pattern — is the practical skill this
lesson builds.`,

    contentHi: `## Ye constraint fundamental kyun hai, koi limit nahi jise work around karna hai

Module 17 ke Edge runtime lesson aur Module 11 ke WebSocket lesson dono
ne alag angles se wahi underlying principle establish kiya: request/
response infrastructure short-lived, fast interactions ke around banaya
gaya hai, aur genuinely long-running kaam ko ek fundamentally alag
execution model chahiye, koi lamba timeout setting nahi. Ek serverless
platform charge karta hai aur resources schedule karta hai ye assume
karte hue ki zyadatar invocations seconds mein khatam hote hain — ek
execution jo das minutes chalti hai resources ko ek aise tarike se tie up
karti hai jiske liye poore platform ka economics aur scaling model design
nahi kiya gaya, yahi exactly wajah hai ki ye limits exist karte hain aur
unhe raise karke hatane ke liye meant nahi hain.

## Ek background job system actually kya provide karta hai

Inngest ya BullMQ jaisa ek system durable, independently-scheduled
execution provide karta hai: ek job enqueue hota hai (aksar ek lightweight
message ke through, jaisa dikhaya gaya), kahin durable store kiya jata hai
(taaki ye ek server restart survive kare), aur ek worker process dwara
execute hota hai jo kisi bhi specific incoming HTTP request ki lifetime
se tied nahi hai. Isme typically ek step ke liye automatic retries with
backoff bhi shamil hai jo fail hota hai (ek third-party API jo briefly
down hai), aur ek lambe job ko chhote, individually retryable steps mein
todne ki ability — inme se kuch bhi ek Server Action ka simple "run to
completion or fail" model provide nahi karta.

## "Bas ise Server Action ke andar slower await karo" temporary hack ki tarah bhi kyun kaam nahi karta

Ye tempting hai sochna ki ek report generation feature Server Action ko
lamba chalne dete hue faster ship ho sakta hai, "baad mein properly fix"
karne ka plan karte hue. Ye actually temporarily bhi kaam nahi karta —
platform ka hard execution limit request ko kill kar deta hai intent se
independently, aur ek platform pe bhi bina hard limit ke, ek visitor ke
browser ka ek HTTP request ko minutes tak khula rakhna fragile hai (ek
dropped connection, ek closed tab, ek mobile network hiccup sab kaam ko
poori tarah abandon kar dete hain, bina kisi record ke ki ye kabhi attempt
kiya gaya tha). Ek background job ki durability (exactly in failure modes
ko survive karna) ek performance nicety nahi hai — ye actual correctness
property hai jo "ek report generate karo" ko ek reliable feature banata
hai us cheez ke bajaye jo real-world conditions ke under silently fail ho
jaaye.

## Ye ek visitor actually experience karne wale request/response flow se kaise connect karta hai

Visitor-facing pattern enqueue-then-notify hai: ek Server Action almost
instantly return karta hai "aapka request queue ho gaya hai," aur actual
completion baad mein communicate hoti hai — ek real-time update ke through
(Module 11 ke WebSocket/SSE patterns), ek transactional email (Lesson 2),
ya simply visitor ka ek status page pe wapas check karna. Ye ek genuinely
alag UX shape hai us synchronous request/response pattern se jo is course
ka zyadatar hissa cover karta hai, aur ye recognize karna ki ek given
feature kaunsi category mein belong karta hai — ek normal Server Action
ke liye kaafi fast, ya genuinely long-running aur is pattern ki zaroorat
wala — wo practical skill hai jise ye lesson build karta hai.`,

    examples: [
      {
        title: 'A batch image-processing job that would genuinely time out as a Server Action',
        titleHi: 'Ek batch image-processing job jo genuinely ek Server Action ki tarah timeout ho jaayega',
        codeJs: `// app/actions.js — enqueues the work, returns almost instantly
'use server';
import { inngest } from '@/lib/inngest';

export async function processUploadedGallery(galleryId, imageUrls) {
  await inngest.send({
    name: 'gallery/process.requested',
    data: { galleryId, imageUrls },
  });
  return { status: 'processing', count: imageUrls.length };
  // A visitor uploading 200 images sees this response in milliseconds,
  // not after 200 images have actually finished resizing
}

// A separate background function — genuinely independent of any request
import { inngest } from '@/lib/inngest';

export const processGallery = inngest.createFunction(
  { id: 'process-gallery', retries: 3 }, // automatic retry on failure
  { event: 'gallery/process.requested' },
  async ({ event, step }) => {
    for (const url of event.data.imageUrls) {
      // Each image is its own retryable step — one failure doesn't
      // restart the whole batch from scratch
      await step.run(\`resize-\${url}\`, () => resizeAndStoreImage(url));
    }
    await step.run('mark-complete', () => markGalleryReady(event.data.galleryId));
  },
);`,
        codeTs: `// app/actions.ts — enqueues the work, returns almost instantly
'use server';
import { inngest } from '@/lib/inngest';

export async function processUploadedGallery(galleryId: string, imageUrls: string[]) {
  await inngest.send({
    name: 'gallery/process.requested',
    data: { galleryId, imageUrls },
  });
  return { status: 'processing', count: imageUrls.length };
  // A visitor uploading 200 images sees this response in milliseconds,
  // not after 200 images have actually finished resizing
}

// A separate background function — genuinely independent of any request
import { inngest } from '@/lib/inngest';

export const processGallery = inngest.createFunction(
  { id: 'process-gallery', retries: 3 }, // automatic retry on failure
  { event: 'gallery/process.requested' },
  async ({ event, step }) => {
    for (const url of event.data.imageUrls) {
      // Each image is its own retryable step — one failure doesn't
      // restart the whole batch from scratch
      await step.run(\`resize-\${url}\`, () => resizeAndStoreImage(url));
    }
    await step.run('mark-complete', () => markGalleryReady(event.data.galleryId));
  },
);`,
        code: `export async function processUploadedGallery(galleryId, imageUrls) {
  await inngest.send({ name: 'gallery/process.requested', data: { galleryId, imageUrls } });
  return { status: 'processing', count: imageUrls.length };
}`,
        output:
          "Uploading a 200-image gallery returns 'processing' to the visitor's browser in milliseconds. The actual resizing of all 200 images happens over the following minutes in a background worker, with each image as its own retryable step — a single failed image doesn't restart the other 199.",
        explain:
          "Breaking the work into per-image steps (rather than one giant step processing all 200) means a transient failure on image #150 only retries that one step, not the entire batch — this granular retry behavior is specifically what a background job system provides that a single long-running Server Action call could not.",
        explainHi:
          "Kaam ko per-image steps mein todna (ek giant step ke bajaye jo saare 200 process kare) matlab hai image #150 pe ek transient failure sirf us ek step ko retry karta hai, poore batch ko nahi — ye granular retry behavior specifically wo hai jo ek background job system provide karta hai jo ek single long-running Server Action call nahi kar sakta tha.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trying to do genuinely long-running work inside a Server Action
'use server';
export async function generateAnnualReport(companyId) {
  const data = await fetchFiveYearsOfData(companyId); // could take minutes
  const pdf = await renderComplexPdf(data); // could take another minute
  await uploadToStorage(pdf);
  return { url: pdf.url };
  // This request is likely killed by the platform's execution time
  // limit before it finishes, and even if it doesn't, the visitor's
  // browser sits frozen the entire time with no feedback.
}`,
        right: `// Enqueueing the work and returning immediately
'use server';
export async function requestAnnualReport(companyId) {
  await inngest.send({ name: 'report/annual.requested', data: { companyId } });
  return { status: 'queued' };
  // The visitor gets an immediate response; the actual report generation
  // happens in a background job with no execution-time pressure, and
  // the visitor is notified (Lesson 2's email, or a real-time update)
  // once it's genuinely done.
}`,
        why: "Work that genuinely takes minutes will either be killed by the platform's hard execution limit or leave the visitor's browser holding an open connection that's fragile to any network interruption. Enqueueing the work and returning immediately removes both problems — the actual work happens with no time pressure, independent of any single request's lifetime.",
        whyHi:
          "Kaam jise genuinely minutes lagte hain ya to platform ki hard execution limit se kill ho jaayega ya visitor ke browser ko ek open connection hold karwaega jo kisi bhi network interruption ke liye fragile hai. Kaam ko enqueue karna aur immediately return karna dono problems hatata hai — actual kaam bina kisi time pressure ke hota hai, kisi bhi single request ki lifetime se independent.",
      },
    ],

    realWorld: [
      {
        en: "A SaaS analytics product's 'export as CSV' feature for a dataset with millions of rows universally uses a background job — the user clicks export, sees 'preparing your download,' and receives an email with a download link minutes later, rather than the browser tab hanging while millions of rows are queried and formatted synchronously.",
        hi: 'Ek SaaS analytics product ka \'export as CSV\' feature ek dataset ke liye jisme millions rows hain universally ek background job use karta hai — user export click karta hai, \'aapka download taiyaar ho raha hai\' dekhta hai, aur minutes baad ek download link ke saath ek email receive karta hai, browser tab ke hang hone ke bajaye jabki millions rows synchronously query aur format hoti hain.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't a serverless platform's execution time limit for a Server Action just be raised to accommodate genuinely long-running work?",
        qHi: 'Ek serverless platform ki Server Action ke liye execution time limit ko genuinely long-running kaam accommodate karne ke liye bas raise kyun nahi kiya ja sakta?',
        a: "The limit reflects the platform's fundamental resource model — serverless infrastructure is built around short, fast invocations that free up resources quickly for reuse across many requests. An execution running for minutes ties up resources in a way that resource model isn't designed for, which is a structural constraint, not an arbitrary configuration value.",
        aHi: 'Limit platform ke fundamental resource model ko reflect karti hai — serverless infrastructure short, fast invocations ke around banaya gaya hai jo resources ko jaldi free kar dete hain kai requests ke across reuse ke liye. Ek execution jo minutes tak chalta hai resources ko ek aise tarike se tie up karta hai jiske liye wo resource model design nahi kiya gaya, jo ek structural constraint hai, ek arbitrary configuration value nahi.',
      },
      {
        q: 'What does a background job system provide that a long-running Server Action call, even without a time limit, genuinely would not?',
        qHi: 'Ek background job system kya provide karta hai jo ek long-running Server Action call, execution time limit ke bina bhi, genuinely nahi karega?',
        a: "Durability against real-world failures — a visitor's dropped connection, a closed tab, or a network hiccup abandons a long-running Server Action entirely with no record it was attempted. A background job persists independently of any single request, and typically provides automatic per-step retries, neither of which a synchronous Server Action call provides on its own.",
        aHi: 'Real-world failures ke against durability — ek visitor ka dropped connection, ek closed tab, ya ek network hiccup ek long-running Server Action ko poori tarah abandon kar deta hai bina kisi record ke ki ye attempt kiya gaya tha. Ek background job kisi bhi single request se independently persist karta hai, aur typically automatic per-step retries provide karta hai, inme se koi bhi ek synchronous Server Action call apne aap provide nahi karta.',
      },
    ],

    exercises: [
      {
        task: "For each of these, decide whether it belongs in a normal Server Action or a background job, and justify based on expected duration and failure tolerance: (1) updating a user's display name, (2) sending a password reset email to one user, (3) re-indexing a company's entire product catalog for search after a bulk import.",
        taskHi: 'In sab mein se har ek ke liye, decide karo ki ye ek normal Server Action mein belong karta hai ya ek background job mein, aur expected duration aur failure tolerance ke basis pe justify karo: (1) ek user ka display name update karna, (2) ek user ko ek password reset email bhejna, (3) ek bulk import ke baad search ke liye ek company ke poore product catalog ko re-index karna.',
        hint: "Think about roughly how long each operation genuinely takes and what happens to the user experience if it's interrupted partway through.",
        hintHi: 'Socho ki har operation ko roughly kitna time genuinely lagta hai aur agar ye beech mein interrupt ho jaaye to user experience ka kya hota hai.',
      },
    ],

    keyTakeaways: [
      "Serverless platforms (and the Edge runtime specifically) enforce a hard maximum execution duration per request — this is a structural resource-model constraint, not a setting to raise for genuinely long-running work.",
      'A background job system (Inngest, BullMQ) provides durable, independently-scheduled execution that survives server restarts and dropped visitor connections, typically with automatic per-step retries.',
      "The correct pattern is enqueue-then-notify: a Server Action enqueues the work and returns almost instantly, and the visitor learns of completion later via email, a real-time update, or checking back.",
      "Attempting genuinely long-running work inside a Server Action fails in two ways: the platform's execution limit may kill it outright, and even without that limit, a visitor's browser holding one open connection for minutes is fragile to any network interruption.",
    ],
    keyTakeawaysHi: [
      'Serverless platforms (aur specifically Edge runtime) per request ek hard maximum execution duration enforce karte hain — ye ek structural resource-model constraint hai, koi setting nahi jise genuinely long-running kaam ke liye raise kiya jaaye.',
      'Ek background job system (Inngest, BullMQ) durable, independently-scheduled execution provide karta hai jo server restarts aur dropped visitor connections survive karta hai, typically automatic per-step retries ke saath.',
      'Correct pattern enqueue-then-notify hai: ek Server Action kaam enqueue karta hai aur almost instantly return karta hai, aur visitor ko completion baad mein pata chalta hai email, ek real-time update, ya wapas check karne ke through.',
      'Genuinely long-running kaam ko ek Server Action ke andar attempt karna do tareeke se fail hota hai: platform ki execution limit ise outright kill kar sakti hai, aur us limit ke bina bhi, ek visitor ke browser ka ek open connection minutes tak hold karna kisi bhi network interruption ke liye fragile hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-transactional-email',
    title: 'Transactional Email Done Correctly',
    titleHi: 'Transactional Email Correctly Kiya Gaya',
    description:
      "Sending an email is easy to prototype and genuinely hard to get right in production — deliverability, templating, and treating a send as a real side effect that needs the same idempotency and error-handling discipline as any other mutation this course has covered.",
    descriptionHi:
      'Ek email bhejna prototype karna aasan hai aur production mein sahi karna genuinely mushkil — deliverability, templating, aur ek send ko ek real side effect ki tarah treat karna jise wahi idempotency aur error-handling discipline chahiye jo is course ne kisi bhi doosre mutation ke liye cover ki hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**Handing a letter directly to a random stranger on the street and hoping they deliver it, versus using an actual postal service with a return address, tracking, and a reputation the destination trusts.** Handing a letter to a stranger might work occasionally, but the recipient's mailroom has no reason to trust that stranger, no way to know if it's spam, and no track record to go on — it might get thrown away without ever being read. An established postal service has a verified sending reputation, a real return address, and a track record the receiving system trusts enough to actually deliver the letter to the right mailbox instead of the trash. A transactional email service (Resend, SendGrid, Postmark) is that postal service: it maintains sender reputation and domain authentication so email providers (Gmail, Outlook) trust it enough to actually deliver mail to an inbox rather than silently dropping it in spam.",
      hi: 'Ek letter ko directly street pe ek random stranger ko dena aur umeed karna ki wo deliver karega, versus ek actual postal service use karna ek return address, tracking, aur ek reputation ke saath jise destination trust karta hai. Ek stranger ko ek letter dena occasionally kaam kar sakta hai, par recipient ke mailroom ke paas us stranger ko trust karne ki koi wajah nahi hai, ye jaanne ka koi tareeka nahi hai ki ye spam hai ya nahi, aur koi track record nahi hai jispe jaaye — ise bina kabhi padhe fenka ja sakta hai. Ek established postal service ke paas ek verified sending reputation, ek real return address, aur ek track record hai jise receiving system itna trust karta hai ki actually letter ko sahi mailbox tak deliver kare trash ke bajaye. Ek transactional email service (Resend, SendGrid, Postmark) wahi postal service hai: ye sender reputation aur domain authentication maintain karta hai taaki email providers (Gmail, Outlook) ise itna trust karein ki actually mail ko ek inbox tak deliver karein spam mein silently drop karne ke bajaye.',
    },

    simple: `**Why "just call an SMTP library directly" is the prototype version,
not the production one:** an email sent from an arbitrary server, with
no established sending reputation and no domain authentication, is
exactly what spam filters are designed to catch — the email might send
successfully from your code's perspective while never actually reaching
the recipient's inbox.

**A transactional email service, used correctly:**

\`\`\`ts
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  const { error } = await resend.emails.send({
    from: 'Acme <onboarding@acme.com>', // a domain YOU'VE verified with the service
    to,
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={name} />, // a real React component, rendered to email-safe HTML
  });
  if (error) {
    throw new Error(\`Failed to send welcome email: \${error.message}\`);
  }
}
\`\`\`

**Domain authentication (SPF/DKIM/DMARC) — why this is not optional:**

\`\`\`
Without domain authentication: an email claiming to be from
"you@yourcompany.com" could have been sent by ANYONE, since there's no
verifiable proof it actually came from your systems — this is exactly
what spam filters (correctly) treat with suspicion.

With domain authentication (DNS records the email service walks you
through adding): receiving mail servers can cryptographically verify
the email genuinely originated from a system you authorized — this is
the single highest-impact factor in whether transactional email actually
reaches an inbox instead of spam.
\`\`\`

**Treating an email send as a real side effect, connecting back to
Module 9's transactions and Module 10's idempotency:**

\`\`\`ts
// A signup flow — the database write and the email send have DIFFERENT
// correctness requirements, so they're handled differently
export async function signup(email: string, password: string) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });
  // If the email fails, the signup itself should NOT be undone — a
  // created account with a failed welcome email is a minor, recoverable
  // problem; a rolled-back signup because of an EMAIL PROVIDER outage
  // would be a much worse user experience for an unrelated failure
  await sendWelcomeEmail(user.email, user.name).catch((err) => {
    logEvent('welcome_email_failed', { userId: user.id, error: err.message }); // Module 19's structured logging
  });
  return user;
}
\`\`\`

**The rule this establishes:** a failed email send is almost never a
reason to fail or roll back the operation that triggered it (Module 9's
lesson on what genuinely belongs in one transaction applies directly
here) — it's logged and, for anything user-critical (like an actual
password reset, where the email IS the entire feature), retried via a
background job (Lesson 1) rather than assumed to have silently succeeded.`,

    simpleHi: `**"Bas ek SMTP library directly call karo" prototype version kyun hai,
production wala nahi:** ek arbitrary server se bheja gaya email, koi
established sending reputation aur koi domain authentication ke bina,
exactly wo hai jise spam filters catch karne ke liye design kiye gaye
hain — email aapke code ke perspective se successfully send ho sakta hai
jabki actually kabhi recipient ke inbox tak pahunchta hi nahi.

**Ek transactional email service, correctly use ki gayi:**

\`\`\`ts
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  const { error } = await resend.emails.send({
    from: 'Acme <onboarding@acme.com>', // ek domain jise AAPNE service ke saath verify kiya
    to,
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={name} />, // ek real React component, email-safe HTML mein rendered
  });
  if (error) {
    throw new Error(\`Failed to send welcome email: \${error.message}\`);
  }
}
\`\`\`

**Domain authentication (SPF/DKIM/DMARC) — ye optional kyun nahi hai:**

\`\`\`
Domain authentication ke bina: ek email jo claim karta hai "you@yourcompany.com"
se hai KISI KE BHI dwara bheja gaya ho sakta hai, kyunki koi verifiable
proof nahi hai ki ye actually aapke systems se aaya — ye exactly wahi hai
jise spam filters (correctly) suspicion se treat karte hain.

Domain authentication ke saath (DNS records jinke through email service
aapko walk karta hai add karne ke liye): receiving mail servers
cryptographically verify kar sakte hain ki email genuinely ek system se
originate hui jise aapne authorize kiya — ye single highest-impact factor
hai is baat mein ki kya transactional email actually ek inbox tak
pahunchti hai spam ke bajaye.
\`\`\`

**Ek email send ko ek real side effect ki tarah treat karna, Module 9 ke
transactions aur Module 10 ke idempotency se wapas connect karte hue:**

\`\`\`ts
// Ek signup flow — database write aur email send ki ALAG correctness
// requirements hain, isliye unhe alag tarike se handle kiya jata hai
export async function signup(email: string, password: string) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });
  // Agar email fail hoti hai, khud signup ko UNDO NAHI hona chahiye —
  // ek created account jiski welcome email fail hui ek minor, recoverable
  // problem hai; ek rolled-back signup ek EMAIL PROVIDER outage ki wajah
  // se ek unrelated failure ke liye kaafi zyada bura user experience hoga
  await sendWelcomeEmail(user.email, user.name).catch((err) => {
    logEvent('welcome_email_failed', { userId: user.id, error: err.message }); // Module 19 ki structured logging
  });
  return user;
}
\`\`\`

**Rule jo ye establish karta hai:** ek failed email send almost kabhi
operation ko fail ya rollback karne ki wajah nahi hai jisne ise trigger
kiya (Module 9 ka lesson ki kya genuinely ek transaction mein belong
karta hai directly yahan apply hota hai) — ise log kiya jata hai aur,
kisi bhi user-critical cheez ke liye (jaise ek actual password reset,
jahan email HI poora feature hai), ek background job (Lesson 1) ke
through retry kiya jata hai silently succeed hone ko assume karne ke
bajaye.`,

    content: `## Why sending an email is genuinely harder than it looks

The mechanics of sending an email (constructing a message, connecting to
a mail server) are simple enough to prototype in a few lines — the actual
difficulty is entirely in what happens AFTER the send succeeds from your
code's perspective. Email deliverability (whether the message actually
reaches an inbox rather than spam, or is silently dropped) depends on
factors invisible to a simple send call: the sending domain's reputation,
whether the receiving server can cryptographically verify the sender's
identity, and the sending IP's history. A transactional email service's
real value is managing all of this infrastructure so an application
developer doesn't have to become an email-deliverability expert.

## Why domain authentication is the single highest-leverage step

SPF, DKIM, and DMARC are DNS records that let a receiving mail server
cryptographically verify a message genuinely came from a system the
domain owner authorized — without them, literally anyone could send an
email claiming to be from your domain, which is exactly the pattern spam
and phishing rely on, and exactly why unauthenticated domains are treated
with suspicion by every major email provider. Configuring these (a
one-time setup most transactional email services walk you through) is
consistently the highest-impact factor in whether a legitimate
transactional email actually reaches an inbox.

## Why an email send should rarely be allowed to fail an entire operation

This directly extends Module 9's transaction lesson: the question isn't
"are signup and the welcome email related" (they clearly are) but
"would the email failing leave the DATABASE in a genuinely wrong state."
It wouldn't — a user account that exists without having received a
welcome email is a minor, independently-fixable problem (the email can be
resent), whereas rolling back a successful signup because an unrelated
email provider had a brief outage would punish the user for a failure
that has nothing to do with their actual request. The one exception:
emails that ARE the entire point of an operation (a password reset email,
where failing to send it means the feature genuinely didn't work) need
their failure treated as a real error, typically retried via a background
job (Lesson 1) rather than silently logged and ignored.

## Why templating matters beyond just making emails look nice

Rendering an email from an actual React component (as most modern
transactional email services support) rather than a hand-built HTML
string gets the same benefits Module 1's component model provides for a
website: reusable pieces (a header, a footer, a button style) shared
across every email type, and a single place to fix a rendering issue
rather than hunting through many copy-pasted HTML strings. Email HTML
has its own well-known quirks (limited CSS support across different email
clients) that a templating library built specifically for email handles,
rather than assuming ordinary web CSS behaves identically in an inbox.`,

    contentHi: `## Ek email bhejna genuinely dikhne se zyada mushkil kyun hai

Ek email bhejne ki mechanics (ek message construct karna, ek mail server
se connect karna) chhoti kuch lines mein prototype karne ke liye kaafi
simple hain — actual difficulty poori tarah is baat mein hai ki send
succeed hone ke baad aapke code ke perspective se KYA hota hai. Email
deliverability (kya message actually ek inbox tak pahunchta hai spam ke
bajaye, ya silently drop ho jata hai) un factors pe depend karta hai jo
ek simple send call se invisible hain: sending domain ki reputation, kya
receiving server sender ki identity ko cryptographically verify kar sakta
hai, aur sending IP ki history. Ek transactional email service ki real
value is poori infrastructure ko manage karna hai taaki ek application
developer ko email-deliverability expert banna na pade.

## Domain authentication single highest-leverage step kyun hai

SPF, DKIM, aur DMARC DNS records hain jo ek receiving mail server ko
cryptographically verify karne dete hain ki ek message genuinely ek
aise system se aaya jise domain owner ne authorize kiya — inke bina,
literally koi bhi ek email bhej sakta hai claim karte hue ki ye aapke
domain se hai, jo exactly wo pattern hai jispe spam aur phishing rely
karte hain, aur exactly wajah hai ki unauthenticated domains ko har major
email provider suspicion se treat karta hai. Inhe configure karna (ek
one-time setup jiske through zyadatar transactional email services aapko
walk karte hain) consistently highest-impact factor hai is baat mein ki
kya ek legitimate transactional email actually ek inbox tak pahunchti
hai.

## Ek email send ko shayad hi ek poore operation ko fail karne diya jaana chahiye

Ye directly Module 9 ke transaction lesson ko extend karta hai: sawaal
"kya signup aur welcome email related hain" nahi hai (wo clearly hain)
balki "kya email fail hone se DATABASE ek genuinely galat state mein
reh jaayega." Ye nahi rahega — ek user account jo bina welcome email
receive kiye exist karta hai ek minor, independently-fixable problem hai
(email resend ki ja sakti hai), jabki ek successful signup ko rollback
karna kyunki ek unrelated email provider ka ek brief outage hua user ko
ek failure ke liye punish karega jiska unki actual request se koi lena-
dena nahi. Ek exception: emails jo poore operation ka POINT HAIN (ek
password reset email, jahan ise bhejne mein fail hona matlab hai feature
genuinely kaam nahi kiya) ki failure ko ek real error ki tarah treat
karna chahiye, typically ek background job (Lesson 1) ke through retry
kiya jaana chahiye silently logged aur ignored hone ke bajaye.

## Templating sirf emails ko achha dikhane se pare kyun matter karta hai

Ek email ko ek actual React component se render karna (jaise zyadatar
modern transactional email services support karte hain) ek hand-built
HTML string ke bajaye Module 1 ke component model se wahi benefits paata
hai jo ye ek website ke liye provide karta hai: reusable pieces (ek
header, ek footer, ek button style) har email type ke across shared, aur
ek single jagah ek rendering issue fix karne ke liye kai copy-pasted HTML
strings ke through hunt karne ke bajaye. Email HTML ki apni khud ki
well-known quirks hain (alag email clients ke across limited CSS support)
jise ek templating library specifically email ke liye banayi gayi handle
karti hai, ye assume karne ke bajaye ki ordinary web CSS ek inbox mein
identically behave karega.`,

    examples: [
      {
        title: 'A signup flow where email failure is logged but never rolls back the account, plus a password reset that treats email failure as a real error',
        titleHi: 'Ek signup flow jahan email failure log hoti hai par account ko kabhi rollback nahi karti, plus ek password reset jo email failure ko ek real error ki tarah treat karta hai',
        codeJs: `// app/actions.js
'use server';
import { Resend } from 'resend';
import { logEvent } from '@/lib/logger'; // Module 19's structured logging

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signup(email, password) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });

  // The welcome email is NOT critical — failure is logged, not fatal
  await resend.emails.send({
    from: 'Acme <onboarding@acme.com>',
    to: user.email,
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={user.name} />,
  }).catch((err) => {
    logEvent('welcome_email_failed', { userId: user.id, error: err.message });
  });

  return user; // succeeds regardless of the email's outcome
}

export async function requestPasswordReset(email) {
  const token = generateResetToken();
  await db.passwordResetToken.create({ data: { email, token } });

  // The reset email IS the entire feature — a failure here means the
  // feature genuinely didn't work, so it's treated as a real error
  const { error } = await resend.emails.send({
    from: 'Acme <security@acme.com>',
    to: email,
    subject: 'Reset your password',
    react: <PasswordResetEmail token={token} />,
  });
  if (error) {
    throw new Error(\`Failed to send password reset email: \${error.message}\`);
  }
}`,
        codeTs: `// app/actions.ts
'use server';
import { Resend } from 'resend';
import { logEvent } from '@/lib/logger'; // Module 19's structured logging

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signup(email: string, password: string) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });

  // The welcome email is NOT critical — failure is logged, not fatal
  await resend.emails.send({
    from: 'Acme <onboarding@acme.com>',
    to: user.email,
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={user.name} />,
  }).catch((err: Error) => {
    logEvent('welcome_email_failed', { userId: user.id, error: err.message });
  });

  return user; // succeeds regardless of the email's outcome
}

export async function requestPasswordReset(email: string) {
  const token = generateResetToken();
  await db.passwordResetToken.create({ data: { email, token } });

  // The reset email IS the entire feature — a failure here means the
  // feature genuinely didn't work, so it's treated as a real error
  const { error } = await resend.emails.send({
    from: 'Acme <security@acme.com>',
    to: email,
    subject: 'Reset your password',
    react: <PasswordResetEmail token={token} />,
  });
  if (error) {
    throw new Error(\`Failed to send password reset email: \${error.message}\`);
  }
}`,
        code: `await resend.emails.send({ from: 'Acme <onboarding@acme.com>', to: user.email, subject: 'Welcome', react: <WelcomeEmail /> })
  .catch((err) => logEvent('welcome_email_failed', { userId: user.id, error: err.message }));
return user; // signup succeeds regardless`,
        output:
          "If Resend has a brief outage during signup, the account is still created successfully, the failure is logged for later investigation, and the user can request the welcome email be resent. If the SAME outage happens during a password reset request, the function throws — because an unsent reset email means the visitor genuinely cannot reset their password, which is a real failure, not a cosmetic one.",
        explain:
          "The two functions treat an identical failure (the email provider being down) completely differently, because the underlying question from Module 9 gives different answers: does a failed send leave anything in a genuinely wrong state? For signup, no (the account is still valid). For password reset, yes (the visitor has no way to complete the task they came to do).",
        explainHi:
          "Dono functions ek identical failure (email provider ka down hona) ko poori tarah alag treat karte hain, kyunki Module 9 se underlying sawaal alag jawab deta hai: kya ek failed send kisi cheez ko genuinely galat state mein chhod deta hai? Signup ke liye, nahi (account abhi bhi valid hai). Password reset ke liye, haan (visitor ke paas wo task complete karne ka koi tareeka nahi hai jiske liye wo aaye the).",
      },
    ],

    mistakes: [
      {
        wrong: `// Rolling back a successful signup because the welcome email failed
export async function signup(email, password) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });
  try {
    await sendWelcomeEmail(user.email);
  } catch (err) {
    await db.user.delete({ where: { id: user.id } }); // WRONG — punishes the user
    throw new Error('Signup failed');                  // for an unrelated email outage
  }
  return user;
}`,
        right: `// Letting a non-critical email failure be logged, not fatal
export async function signup(email, password) {
  const user = await db.user.create({ data: { email, passwordHash: await hash(password) } });
  await sendWelcomeEmail(user.email).catch((err) => {
    logEvent('welcome_email_failed', { userId: user.id, error: err.message });
  });
  return user; // the account remains valid regardless of the email's outcome
}`,
        why: "A welcome email failing doesn't leave the database in a genuinely wrong state — the account is still perfectly valid. Rolling back the signup because of an unrelated email provider outage punishes the visitor for a failure that has nothing to do with the actual thing they were trying to do (create an account).",
        whyHi:
          "Ek welcome email ka fail hona database ko ek genuinely galat state mein nahi chhodta — account abhi bhi poori tarah valid hai. Ek unrelated email provider outage ki wajah se signup ko rollback karna visitor ko ek aisi failure ke liye punish karta hai jiska unke actual kaam se (ek account banana) koi lena-dena nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS product's password-reset email is one of the very few emails treated as a hard failure if it doesn't send successfully (often with an automatic retry via a background job), while the same product's 'a new comment was added to your document' notification email is best-effort — logged on failure, but never blocking or retrying aggressively, since missing one notification email is a minor inconvenience rather than a broken feature.",
        hi: 'Ek production SaaS product ka password-reset email un bahut kam emails mein se ek hai jise ek hard failure ki tarah treat kiya jata hai agar ye successfully send nahi hota (aksar ek background job ke through ek automatic retry ke saath), jabki wahi product ka \'aapke document mein ek naya comment add hua\' notification email best-effort hai — failure pe logged, par kabhi block ya aggressively retry nahi hota, kyunki ek notification email miss hona ek minor inconvenience hai ek broken feature ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a transactional email service (like Resend or SendGrid) matter beyond just providing an easier API for sending email?',
        qHi: 'Ek transactional email service (jaise Resend ya SendGrid) email bhejne ke liye ek easier API provide karne se pare kyun matter karta hai?',
        a: "Its real value is managing sender reputation and domain authentication (SPF/DKIM/DMARC) — factors that determine whether an email actually reaches an inbox rather than being filtered as spam. An email sent via a raw SMTP call with no established reputation or authentication is exactly the pattern spam filters are designed to catch, regardless of how simple the sending code itself is.",
        aHi: 'Iski real value sender reputation aur domain authentication (SPF/DKIM/DMARC) manage karna hai — factors jo determine karte hain ki kya ek email actually ek inbox tak pahunchta hai spam ki tarah filter hone ke bajaye. Ek raw SMTP call ke through bheja gaya email bina kisi established reputation ya authentication ke exactly wo pattern hai jise spam filters catch karne ke liye design kiye gaye hain, chahe sending code khud kitna bhi simple ho.',
      },
      {
        q: "Why should a failed welcome email during signup typically not roll back the account creation, while a failed password-reset email typically should be treated as a real error?",
        qHi: 'Signup ke dauran ek failed welcome email typically account creation ko kyun rollback nahi karna chahiye, jabki ek failed password-reset email typically ek real error ki tarah treat kiya jaana chahiye?',
        a: "The test is whether the failure leaves anything in a genuinely wrong state (Module 9's transaction principle). A failed welcome email leaves a perfectly valid account with a missing, resendable email — not a correctness problem. A failed password-reset email means the visitor has no way to complete the task they came to do, which is a real failure of the feature itself.",
        aHi: 'Test ye hai ki kya failure kisi cheez ko genuinely galat state mein chhodta hai (Module 9 ka transaction principle). Ek failed welcome email ek poori tarah valid account chhodta hai ek missing, resendable email ke saath — koi correctness problem nahi. Ek failed password-reset email ka matlab hai visitor ke paas wo task complete karne ka koi tareeka nahi hai jiske liye wo aaye the, jo feature khud ki ek real failure hai.',
      },
    ],

    exercises: [
      {
        task: "A 'invite a teammate' feature sends an invitation email containing a signup link. Decide whether a failure to send this specific email should be treated like the welcome-email case or the password-reset case, and justify your choice.",
        taskHi: 'Ek \'teammate invite karo\' feature ek signup link rakhne wala ek invitation email bhejta hai. Decide karo ki is specific email ko bhejne mein ek failure ko welcome-email case ki tarah treat karna chahiye ya password-reset case ki tarah, aur apni choice justify karo.',
        hint: "Ask the same question this lesson used for the other two cases: without this email actually arriving, can the person it was meant for accomplish what the feature promised at all?",
        hintHi: 'Wahi sawaal poochho jo is lesson ne doosre do cases ke liye use kiya: is email ke actually arrive kiye bina, kya wo insaan jiske liye ye tha wo kar sakta hai jo feature ne promise kiya bilkul?',
      },
    ],

    keyTakeaways: [
      "A transactional email service's real value is managing sender reputation and domain authentication (SPF/DKIM/DMARC) — the factors that actually determine inbox deliverability, not just providing a simpler sending API.",
      'Domain authentication is the single highest-leverage step for deliverability, since it lets receiving mail servers cryptographically verify a message genuinely came from an authorized system.',
      "Whether a failed email send should fail the triggering operation follows Module 9's transaction principle directly: does the failure leave anything in a genuinely wrong state, or is it an independently-recoverable problem (a resendable email)?",
      'Rendering emails from real components (as most modern services support) provides the same reuse and maintainability benefits component-based UI provides elsewhere, adapted for email HTML\'s specific quirks.',
    ],
    keyTakeawaysHi: [
      'Ek transactional email service ki real value sender reputation aur domain authentication (SPF/DKIM/DMARC) manage karna hai — wo factors jo actually inbox deliverability determine karte hain, sirf ek simpler sending API provide karna nahi.',
      'Domain authentication deliverability ke liye single highest-leverage step hai, kyunki ye receiving mail servers ko cryptographically verify karne deta hai ki ek message genuinely ek authorized system se aaya.',
      'Kya ek failed email send trigger karne wale operation ko fail karna chahiye Module 9 ke transaction principle ko directly follow karta hai: kya failure kisi cheez ko genuinely galat state mein chhodta hai, ya ye ek independently-recoverable problem hai (ek resendable email)?',
      'Real components se emails render karna (jaise zyadatar modern services support karte hain) wahi reuse aur maintainability benefits provide karta hai jo component-based UI kahin aur provide karta hai, email HTML ki specific quirks ke liye adapted.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-internationalized-routing',
    title: 'Internationalized Routing for a Multi-Language App',
    titleHi: 'Ek Multi-Language App Ke Liye Internationalized Routing',
    description:
      "A genuinely multi-language production app needs the visitor's language reflected in the URL itself (yourapp.com/fr/pricing), consistent locale detection and switching, and translated content organized so adding a new language doesn't mean hunting through scattered strings across the whole codebase.",
    descriptionHi:
      'Ek genuinely multi-language production app ko visitor ki language khud URL mein reflect honi chahiye (yourapp.com/fr/pricing), consistent locale detection aur switching, aur translated content is tarike se organized ho ki ek naya language add karna poori codebase mein scattered strings ke through dhundhne ka matlab na ho.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A hotel with a single, fixed sign at the entrance for every guest regardless of language, versus one where the entrance and every directional sign genuinely change based on which country's guests are expected there.** A hotel with one fixed-language sign works fine as long as every guest happens to read that language — and completely fails a guest who doesn't, with no way for them to even find their room without help. A hotel that puts guests through a specific, clearly-marked entrance for their language, with every subsequent sign in that same language throughout their stay, means language isn't something bolted on as an afterthought — it's structural to how the whole building is navigated. Internationalized routing (locale segments in the URL) is exactly this: the language isn't a setting hidden in a cookie somewhere, it's a structural part of the address itself, the same way a hotel's language-specific entrance is structural to the building.",
      hi: 'Ek hotel jiska entrance pe ek single, fixed sign hai har guest ke liye chahe unki language kuch bhi ho, versus ek jahan entrance aur har directional sign genuinely badalta hai us basis pe ki kis country ke guests wahan expected hain. Ek hotel ek fixed-language sign ke saath theek kaam karta hai jab tak har guest wo language padh sakta hai — aur poori tarah fail hota hai ek guest ke liye jo nahi padh sakta, unke liye apna room dhundhne ka bhi koi tareeka nahi hota bina help ke. Ek hotel jo guests ko unki language ke liye ek specific, clearly-marked entrance se guzarta hai, unke stay ke dauran har subsequent sign wahi language mein hai, matlab hai language koi aisi cheez nahi hai jo ek afterthought ki tarah bolt ki gayi ho — ye poori building ke navigate hone ke tarike ke liye structural hai. Internationalized routing (URL mein locale segments) exactly yahi hai: language kahin ek cookie mein hidden ek setting nahi hai, ye khud address ka ek structural hissa hai, wahi tarike se jaise ek hotel ka language-specific entrance building ke liye structural hai.',
    },

    simple: `**Locale-prefixed routing — the language is part of the URL itself,
not hidden in a cookie:**

\`\`\`
yourapp.com/en/pricing   -> English pricing page
yourapp.com/fr/pricing   -> French pricing page
yourapp.com/hi/pricing   -> Hindi pricing page
\`\`\`

**Why this specific structure, rather than a cookie-only approach:** a
URL-visible locale means the page is genuinely shareable and bookmarkable
IN a specific language (sending a French colleague \`/fr/pricing\`
guarantees they see it in French, regardless of their own browser
settings), and it's directly crawlable/indexable by search engines per
language (Module 20's SEO lesson) — a cookie-only approach hides the
language entirely from both of these.

**Structuring the App Router for this — a dynamic \`[locale]\` segment
wrapping the whole app:**

\`\`\`
app/
  [locale]/
    layout.tsx        -> receives params.locale, sets up translations
    page.tsx           -> the homepage, for ANY locale
    pricing/
      page.tsx         -> /en/pricing, /fr/pricing, etc. — same file
  middleware.ts        -> detects a visitor's preferred locale and
                          redirects '/' to '/en' or '/fr' accordingly
\`\`\`

\`\`\`tsx
// middleware.ts — detecting locale and redirecting to a locale-prefixed URL
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'hi'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname.startsWith(\`/\${l}\`));
  if (hasLocale) return NextResponse.next();

  const preferred = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  const locale = locales.includes(preferred ?? '') ? preferred : 'en';
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}
\`\`\`

**Organizing translated content — one source of truth per string, not
scattered copies:**

\`\`\`ts
// messages/en.json
{ "pricing": { "title": "Simple, transparent pricing" } }

// messages/fr.json
{ "pricing": { "title": "Tarification simple et transparente" } }
\`\`\`

\`\`\`tsx
// app/[locale]/pricing/page.tsx — reads the CURRENT locale's messages
import { getTranslations } from 'next-intl/server';

export default async function PricingPage() {
  const t = await getTranslations('pricing');
  return <h1>{t('title')}</h1>; // automatically the right language, no scattered if/else
}
\`\`\`

**Why this is a genuinely different problem than this course's own EN/HI
toggle:** this course's bilingual content toggles between two fixed
translations stored directly alongside each lesson. A production
internationalization setup needs to scale to many languages, needs the
language reflected in the URL for sharing/SEO, and typically needs
translations managed as a separate, organized resource (files per
locale, or a translation-management service) rather than inline
duplication — the same underlying need (showing the right language) at a
genuinely larger, more structured scale.`,

    simpleHi: `**Locale-prefixed routing — language khud URL ka hissa hai, ek cookie
mein hidden nahi:**

\`\`\`
yourapp.com/en/pricing   -> English pricing page
yourapp.com/fr/pricing   -> French pricing page
yourapp.com/hi/pricing   -> Hindi pricing page
\`\`\`

**Ye specific structure kyun, ek cookie-only approach ke bajaye:** ek
URL-visible locale ka matlab hai page genuinely shareable aur bookmarkable
hai EK specific language mein (ek French colleague ko \`/fr/pricing\`
bhejna guarantee karta hai ki wo ise French mein dekhte hain, unki apni
browser settings se independently), aur ye directly crawlable/indexable
hai search engines dwara per language (Module 20 ka SEO lesson) — ek
cookie-only approach language ko in dono se poori tarah chhupa deta hai.

**Iske liye App Router ko structure karna — ek dynamic \`[locale]\`
segment poori app ko wrap karte hue:**

\`\`\`
app/
  [locale]/
    layout.tsx        -> params.locale receive karta hai, translations setup karta hai
    page.tsx           -> homepage, KISI BHI locale ke liye
    pricing/
      page.tsx         -> /en/pricing, /fr/pricing, etc. — wahi file
  middleware.ts        -> ek visitor ki preferred locale detect karta hai aur
                          '/' ko accordingly '/en' ya '/fr' pe redirect karta hai
\`\`\`

\`\`\`tsx
// middleware.ts — locale detect karna aur ek locale-prefixed URL pe redirect karna
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'hi'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname.startsWith(\`/\${l}\`));
  if (hasLocale) return NextResponse.next();

  const preferred = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  const locale = locales.includes(preferred ?? '') ? preferred : 'en';
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}
\`\`\`

**Translated content organize karna — per string ek source of truth,
scattered copies nahi:**

\`\`\`ts
// messages/en.json
{ "pricing": { "title": "Simple, transparent pricing" } }

// messages/fr.json
{ "pricing": { "title": "Tarification simple et transparente" } }
\`\`\`

\`\`\`tsx
// app/[locale]/pricing/page.tsx — CURRENT locale ke messages padhta hai
import { getTranslations } from 'next-intl/server';

export default async function PricingPage() {
  const t = await getTranslations('pricing');
  return <h1>{t('title')}</h1>; // automatically sahi language, koi scattered if/else nahi
}
\`\`\`

**Ye is course ke apne EN/HI toggle se genuinely alag problem kyun hai:**
is course ka bilingual content do fixed translations ke beech toggle
karta hai jo directly har lesson ke saath stored hain. Ek production
internationalization setup ko kai languages tak scale karna chahiye,
sharing/SEO ke liye language ko URL mein reflect karna chahiye, aur
typically translations ko ek separate, organized resource ki tarah
manage karna chahiye (per locale files, ya ek translation-management
service) inline duplication ke bajaye — wahi underlying need (sahi
language dikhana) ek genuinely bade, zyada structured scale pe.`,

    content: `## Why the locale belongs in the URL, structurally

A cookie-based or browser-setting-based approach to language can only
ever describe what one specific visitor's browser currently prefers — it
has no way to make a specific page shareable in a specific language, and
search engines indexing the site have no reliable way to know that
\`/pricing\` in French and \`/pricing\` in English are different pages that
should both be discoverable. Putting the locale directly in the URL path
(\`/fr/pricing\`) makes language a first-class, structural part of the
site's addressing — the same URL always means the same content in the
same language, to anyone, including a search engine crawler.

## Why middleware is the right place for locale detection and redirection

Detecting a visitor's preferred language and redirecting them to the
correct locale-prefixed URL needs to happen before any page-specific
rendering occurs — the same coarse-gate, runs-before-everything-else
shape Module 17 established for auth gates, geolocation, and A/B
bucketing. A visitor hitting the bare domain (\`yourapp.com/\`) with no
locale in the URL yet needs that decision made and applied via a redirect
before any specific page's content is even considered.

## Why translations belong in a separate, organized resource rather than
inline in each component

Storing each string's translations in per-locale files (or a dedicated
translation-management tool) rather than scattering inline
if-locale-is-French-show-this-else-show-that logic throughout components
means adding a new supported language is adding one new file/resource,
not hunting through the entire codebase for every place text is
rendered. This mirrors the general lesson from Module 20's SEO/structured
content — organizing information as data that drives rendering, rather
than duplicating logic throughout the UI layer, scales to more content
(here, more languages) without a linear increase in code complexity.

## How this differs from, and relates to, this course's own bilingual
content

This course's EN/HI toggle (visible throughout every lesson) solves a
related but genuinely smaller problem: two fixed languages, content
authored and stored together, switched via a simple preference toggle
rather than reflected in the URL. A production app supporting genuinely
many languages, needing each to be independently shareable, bookmarkable,
and indexable, needs the additional structure this lesson covers —
locale-prefixed routing and a dedicated translation-management approach —
because the two-language, toggle-only approach doesn't scale to that
requirement. Recognizing which scale a given app's needs actually sit at
(two toggled languages versus many URL-distinct ones) is the practical
judgment call this lesson enables.`,

    contentHi: `## Locale structurally URL mein kyun belong karta hai

Language ke liye ek cookie-based ya browser-setting-based approach sirf
ye describe kar sakta hai ki ek specific visitor ka browser currently kya
prefer karta hai — iske paas ek specific page ko ek specific language mein
shareable banane ka koi tareeka nahi hai, aur site ko index karne wale
search engines ke paas ye jaanne ka koi reliable tareeka nahi hai ki
French mein \`/pricing\` aur English mein \`/pricing\` alag pages hain jo dono
discoverable hone chahiye. Locale ko directly URL path mein daalna
(\`/fr/pricing\`) language ko site ki addressing ka ek first-class,
structural hissa banata hai — wahi URL hamesha wahi content wahi language
mein matlab rakhta hai, kisi ke liye bhi, ek search engine crawler samet.

## Middleware locale detection aur redirection ke liye sahi jagah kyun hai

Ek visitor ki preferred language detect karna aur unhe correct
locale-prefixed URL pe redirect karna kisi bhi page-specific rendering
hone se pehle hona chahiye — wahi coarse-gate, runs-before-everything-else
shape jo Module 17 ne auth gates, geolocation, aur A/B bucketing ke liye
establish ki. Ek visitor jo bare domain (\`yourapp.com/\`) ko hit karta hai
URL mein abhi tak koi locale ke bina use ye decision chahiye jo banaya
aur ek redirect ke through apply kiya jaaye kisi bhi specific page ke
content ko bhi consider kiye jaane se pehle.

## Translations har component mein inline ke bajaye ek separate, organized resource mein kyun belong karte hain

Har string ki translations ko per-locale files mein (ya ek dedicated
translation-management tool mein) store karna scattered
if-locale-is-French-show-this-else-show-that logic ko components mein
poore across chhodne ke bajaye matlab hai ek naya supported language add
karna ek naya file/resource add karna hai, poori codebase mein har us
jagah dhundhne ke bajaye jahan text render hota hai. Ye Module 20 ke SEO/
structured content ke general lesson ko mirror karta hai — information ko
data ki tarah organize karna jo rendering ko drive karta hai, UI layer
ke across logic duplicate karne ke bajaye, zyada content tak scale karta
hai (yahan, zyada languages) code complexity mein ek linear increase ke
bina.

## Ye is course ke apne bilingual content se kaise alag hai, aur kaise related hai

Is course ka EN/HI toggle (har lesson mein visible) ek related par
genuinely chhoti problem solve karta hai: do fixed languages, content
authored aur saath stored, ek simple preference toggle ke through switch
kiya gaya URL mein reflect kiye bina. Ek production app jo genuinely kai
languages support karta hai, jise har ek independently shareable,
bookmarkable, aur indexable hona chahiye, use ye additional structure
chahiye jo ye lesson cover karta hai — locale-prefixed routing aur ek
dedicated translation-management approach — kyunki two-language,
toggle-only approach us requirement tak scale nahi karta. Ye recognize
karna ki ek given app ki needs actually kis scale pe baithti hain (do
toggled languages versus kai URL-distinct wale) wo practical judgment
call hai jise ye lesson enable karta hai.`,

    examples: [
      {
        title: 'A locale-aware layout and page, with middleware handling detection and redirection',
        titleHi: 'Ek locale-aware layout aur page, middleware detection aur redirection handle karte hue',
        codeJs: `// middleware.js
import { NextResponse } from 'next/server';

const locales = ['en', 'fr', 'hi'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname.startsWith(\`/\${l}\`));
  if (hasLocale) return NextResponse.next();

  const preferred = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  const locale = locales.includes(preferred) ? preferred : defaultLocale;
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}

export const config = { matcher: ['/((?!_next|api|favicon.ico).*)'] };

// app/[locale]/layout.js
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = (await import(\`@/messages/\${locale}.json\`)).default;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// app/[locale]/pricing/page.js — the SAME file serves every locale
import { getTranslations } from 'next-intl/server';

export default async function PricingPage() {
  const t = await getTranslations('pricing');
  return <h1>{t('title')}</h1>;
}`,
        codeTs: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'hi'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname.startsWith(\`/\${l}\`));
  if (hasLocale) return NextResponse.next();

  const preferred = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  const locale = locales.includes(preferred ?? '') ? preferred! : defaultLocale;
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}

export const config = { matcher: ['/((?!_next|api|favicon.ico).*)'] };

// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = (await import(\`@/messages/\${locale}.json\`)).default;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// app/[locale]/pricing/page.tsx — the SAME file serves every locale
import { getTranslations } from 'next-intl/server';

export default async function PricingPage() {
  const t = await getTranslations('pricing');
  return <h1>{t('title')}</h1>;
}`,
        code: `const hasLocale = locales.some((l) => pathname.startsWith(\`/\${l}\`));
if (hasLocale) return NextResponse.next();
const preferred = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));`,
        output:
          "A first-time French-browser visitor to yourapp.com/pricing is redirected to yourapp.com/fr/pricing automatically. Sharing that exact French URL with anyone, regardless of their own browser language, always shows the French version — the language is now part of the address, not a per-visitor guess.",
        explain:
          "The same page.tsx file serves every locale — it never contains locale-specific logic itself, only calling getTranslations() for whatever locale the URL segment specifies. Adding a new supported language means adding one new messages/xx.json file and one entry to the locales array, not touching any page component.",
        explainHi:
          "Wahi page.tsx file har locale ko serve karta hai — ye khud kabhi locale-specific logic contain nahi karta, sirf getTranslations() call karta hai jo bhi locale URL segment specify karta hai uske liye. Ek naya supported language add karna matlab hai ek naya messages/xx.json file add karna aur locales array mein ek entry, kisi bhi page component ko touch kiye bina.",
      },
    ],

    mistakes: [
      {
        wrong: `// Storing the visitor's language preference only in a cookie, never in the URL
export default function PricingPage() {
  const locale = cookies().get('locale')?.value ?? 'en';
  const content = locale === 'fr' ? frenchContent : englishContent;
  return <h1>{content.title}</h1>;
  // The URL is always /pricing regardless of language — the page can't
  // be shared or bookmarked in a specific language, and a search engine
  // sees only one indexable version, not one per language.
}`,
        right: `// The locale lives in the URL itself
// app/[locale]/pricing/page.tsx
export default async function PricingPage() {
  const t = await getTranslations('pricing');
  return <h1>{t('title')}</h1>;
  // /en/pricing and /fr/pricing are genuinely different, shareable,
  // independently-indexable URLs`,
        why: "A cookie-only approach makes the language invisible to anyone sharing a link, bookmarking a page, or a search engine crawling the site — there's no way to distinguish or independently reference the French version versus the English version, since they share the exact same URL.",
        whyHi:
          "Ek cookie-only approach language ko kisi ke liye bhi invisible bana deta hai jo ek link share kar raha hai, ek page bookmark kar raha hai, ya site crawl kar raha hai ek search engine. French version versus English version ko distinguish ya independently reference karne ka koi tareeka nahi hai, kyunki wo exact wahi URL share karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A global SaaS product serving customers across Europe typically uses locale-prefixed URLs (app.com/de/dashboard, app.com/fr/dashboard) specifically so each language's version is independently indexed by search engines and independently shareable — a customer support agent in Germany can send a German colleague a link that's guaranteed to render in German, not whatever language that colleague's browser happens to be set to.",
        hi: 'Ek global SaaS product jo Europe ke across customers ko serve karta hai typically locale-prefixed URLs use karta hai (app.com/de/dashboard, app.com/fr/dashboard) specifically taaki har language ka version independently search engines dwara indexed ho aur independently shareable ho — Germany mein ek customer support agent ek German colleague ko ek link bhej sakta hai jise guarantee hai German mein render hoga, jo bhi language us colleague ka browser set hai wo nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is putting the locale in the URL path (rather than a cookie) the standard approach for internationalized routing?',
        qHi: 'Locale ko URL path mein daalna (ek cookie ke bajaye) internationalized routing ke liye standard approach kyun hai?',
        a: "A cookie-based approach only describes one visitor's current preference — it can't make a specific page shareable or bookmarkable in a specific language, and search engines can't independently discover and index each language's version, since they'd all share the same URL. A URL-visible locale makes language a structural, addressable part of the site.",
        aHi: 'Ek cookie-based approach sirf ek visitor ki current preference describe karta hai — ye ek specific page ko ek specific language mein shareable ya bookmarkable nahi bana sakta, aur search engines har language ka version independently discover aur index nahi kar sakte, kyunki wo sab wahi URL share karenge. Ek URL-visible locale language ko site ka ek structural, addressable hissa banata hai.',
      },
      {
        q: 'Why should translated strings live in per-locale files rather than inline conditional logic in each component?',
        qHi: 'Translated strings har component mein inline conditional logic ke bajaye per-locale files mein kyun rehne chahiye?',
        a: "Storing translations as organized data (files per locale) means adding a new supported language is adding one new resource file, not hunting through every component in the codebase for scattered if-locale-is-X logic. This scales to more languages without a corresponding increase in code complexity throughout the UI layer.",
        aHi: 'Translations ko organized data ki tarah store karna (per locale files) matlab hai ek naya supported language add karna ek naya resource file add karna hai, codebase ke har component mein scattered if-locale-is-X logic dhundhne ke bajaye. Ye zyada languages tak scale karta hai UI layer ke across code complexity mein ek corresponding increase ke bina.',
      },
    ],

    exercises: [
      {
        task: "A team currently supports only English and stores UI strings inline in each component (e.g. <button>Submit</button> hardcoded directly). They now need to add French and Spanish. Describe the structural changes needed, referencing this lesson's routing and translation-organization patterns.",
        taskHi: 'Ek team currently sirf English support karti hai aur UI strings ko har component mein inline store karti hai (jaise <button>Submit</button> directly hardcoded). Unhe ab French aur Spanish add karna hai. Structural changes describe karo jo chahiye, is lesson ke routing aur translation-organization patterns ko reference karte hue.',
        hint: "Consider both what needs to change about the URL structure and how the hardcoded strings need to be reorganized before any new language can be added at all.",
        hintHi: 'Socho ki URL structure ke baare mein kya badalna chahiye aur hardcoded strings ko kaise reorganize karna chahiye kisi bhi naye language ko bilkul add karne se pehle.',
      },
    ],

    keyTakeaways: [
      "Putting the locale directly in the URL path (/fr/pricing) makes language a structural, shareable, independently-indexable part of the site's addressing, unlike a cookie-only approach.",
      'Middleware is the right place to detect a visitor\'s preferred locale and redirect to the correct locale-prefixed URL, following the same coarse-gate pattern Module 17 established for other cross-cutting concerns.',
      'Translated strings belong in organized, per-locale resources (files, or a translation-management tool) rather than inline conditional logic scattered across components, so adding a new language scales without a corresponding increase in code complexity.',
      "This is a genuinely larger-scale version of the same underlying need this course's own EN/HI toggle addresses — the right tool depends on how many languages, and whether URL-level shareability/SEO per language, are actually required.",
    ],
    keyTakeawaysHi: [
      'Locale ko directly URL path mein daalna (/fr/pricing) language ko site ki addressing ka ek structural, shareable, independently-indexable hissa banata hai, ek cookie-only approach ke unlike.',
      'Middleware ek visitor ki preferred locale detect karne aur correct locale-prefixed URL pe redirect karne ke liye sahi jagah hai, wahi coarse-gate pattern follow karte hue jo Module 17 ne doosre cross-cutting concerns ke liye establish kiya.',
      'Translated strings organized, per-locale resources mein belong karte hain (files, ya ek translation-management tool) components mein scattered inline conditional logic ke bajaye, taaki ek naya language add karna code complexity mein ek corresponding increase ke bina scale kare.',
      'Ye is course ke apne EN/HI toggle ke address karne wali wahi underlying need ka ek genuinely larger-scale version hai — sahi tool is baat pe depend karta hai ki kitni languages, aur kya per language URL-level shareability/SEO actually chahiye.',
    ],
  },
];
