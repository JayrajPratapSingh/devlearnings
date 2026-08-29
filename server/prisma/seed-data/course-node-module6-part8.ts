/**
 * Node.js Complete Course — Module 6: Pro, lesson 8.
 *
 * Dead-letter queues and scheduled/recurring jobs: two gaps left open by
 * this course's earlier background-jobs-and-queues lesson. First: that
 * lesson covers retrying a failed job automatically with exponential
 * backoff (BullMQ's attempts option), but never addresses what happens
 * once a job has failed every single retry attempt — by default, it is
 * simply marked "failed" and left in a list nobody is watching, silently
 * losing whatever work that job represented. Fixed with a dead-letter
 * queue: a dedicated place permanently-failed jobs are moved to, paired
 * with active alerting, so failed work is investigated rather than
 * silently lost. Second: recurring, schedule-based work (a nightly
 * cleanup job, a daily digest email) needs to run on a schedule
 * independent of any specific request, and a naive setInterval inside the
 * running application breaks the moment the app is clustered (this
 * course's earlier lesson) across multiple processes, since every
 * process would fire the same "scheduled" task independently. Fixed with
 * BullMQ's own repeatable jobs, which run on a Redis-backed schedule
 * shared across every worker, guaranteeing a task fires once, on
 * schedule, regardless of how many processes are running.
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

export const NODE_MODULE_6_PART8: CourseLesson[] = [
  {
    slug: 'dead-letter-queues-and-scheduled-jobs',
    title: 'Dead-Letter Queues and Scheduled Jobs',
    titleHi: 'Dead-Letter Queues Aur Scheduled Jobs',
    description: 'A welcome email job fails three times because the email provider was briefly down — and after the third retry, it simply vanishes into a "failed" list nobody is watching, with nobody ever finding out that customer never got their email at all.',
    descriptionHi: 'Ek welcome email job teen baar fail hoti hai kyunki email provider thodi der ke liye down tha — aur teesri retry ke baad, ye bas ek "failed" list mein gayab ho jaati hai jise koi nahi dekh raha, kisi ko kabhi pata hi nahi chalta ki us customer ko email mila hi nahi.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 8,

    analogy: {
      en: '**A postal service that, after failing to deliver a letter three times, routes it to a dedicated "dead letter office" staffed by people whose job is to open it, figure out what went wrong, and decide what to do next — versus a postal service that, after the third failed delivery attempt, simply throws the letter in the trash with nobody ever looking at it again.** At the well-run postal service, a letter that could not be delivered after reasonable retries is not treated as something to quietly discard — it is treated as something that needs a HUMAN to look at, since an undeliverable letter might represent something genuinely important (a legal notice, a bill, a birthday card) that the original sender and intended recipient both still care about, even though automated delivery has already been tried and failed. The dead letter office does not attempt further automatic delivery attempts indefinitely — it recognizes that repeated identical attempts have already failed and escalates to a different kind of handling, a person actively investigating, rather than the same automated process trying forever or simply giving up silently. A postal service without any dead letter office instead genuinely destroys undeliverable mail after a few failed attempts, with absolutely no record, no visibility, and no way for anyone — sender, recipient, or postal staff — to ever learn that a specific piece of mail existed and failed to reach its destination. A job queue with no dead-letter handling behaves exactly like the second postal service: once a job exhausts its retry attempts, it is simply marked "failed" in a list nobody actively monitors, and the actual, real-world consequence of that failure (a customer never receiving their welcome email, a payment never actually being reconciled) goes completely unnoticed, exactly like a piece of mail thrown away with nobody ever knowing.',
      hi: '**Ek postal service jo, ek letter ko teen baar deliver karne mein fail hone ke baad, ise ek dedicated "dead letter office" ki taraf route karti hai jahan log kaam karte hain jinka kaam ise kholna, ye pata lagaana ki kya galat hua, aur aage kya karna hai faisla karna hai — versus ek postal service jo, teesri fail hui delivery koshish ke baad, bas letter ko kachre mein phenk deti hai kisi ke ise dobara dekhe bina.** Achhi tarah chalti postal service mein, ek letter jo samajhdaar retries ke baad deliver nahi ho saka use chupke se hataane laayak kuch nahi maana jaata — ise ek aisi cheez maana jaata hai jise ek INSAAN ko dekhne ki zaroorat hai, kyunki ek na-deliver-ho-sakta letter kuch sach mein zaruri darsa sakta hai (ek legal notice, ek bill, ek birthday card) jiski parvaah asli bhejne waala aur maangaaya gaya paane waala dono abhi bhi karte hain, chahe automated delivery pehle se try aur fail ho chuki ho. Dead letter office anant taur par aur automatic delivery koshishon ki koshish nahi karta — ye pehchaanta hai ki dohraayi hui identical koshishein pehle se fail ho chuki hain aur ek alag tarah ki handling ki taraf badhta hai, ek vyakti saqriya taur par jaanch karta hai, wahi automated process hamesha koshish karte rehne ya bas chupke se haar maan lene ke bajaye. Koi bhi dead letter office na rakhne wali ek postal service iske bajaye asal mein na-deliver-hone-laayak mail ko kuch fail hui koshishon ke baad nasht kar deti hai, bilkul koi record bina, koi visibility bina, aur kisi ke liye bhi — bhejne waala, paane waala, ya postal staff — ye jaanne ka koi tarika bina ki ek khaas mail ka tukda maujood tha aur apne destination tak pahunchne mein fail hua. Koi dead-letter handling na rakhta ek job queue bilkul doosri postal service jaisa vyavhaar karta hai: ek baar ek job apni retry koshishein khatam kar deti hai, ye bas ek "failed" list mein maark ho jaati hai jise koi saqriya taur par monitor nahi karta, aur us failure ka asli, asli-duniya natija (ek customer ko kabhi welcome email na milna, ek payment kabhi asal mein reconcile na hona) poori tarah na-dhyaan-mein-aaya rehta hai, bilkul ek mail ke tukde ki tarah jo phenk diya gaya kisi ko kabhi pata chale bina.',
    },

    simple: `**Start broken.** A job that exhausts its retries and simply vanishes:

\`\`\`js
const { Worker } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });
\`\`\`

This course's earlier background-jobs lesson correctly sets \`attempts: 3\`, so a welcome-email job that fails because the email provider is briefly down gets retried automatically, with exponential backoff between attempts, following that lesson's pattern exactly. The gap is what happens if all three attempts fail — perhaps the email provider was down for longer than the retries spanned, or the specific email address is genuinely invalid. By default, BullMQ simply marks the job as \`"failed"\` and moves on; the job's data still technically exists somewhere in Redis, but nothing about this code actively surfaces that failure to a person, logs it somewhere a team actually watches, or does anything at all beyond quietly giving up. That specific customer never receives their welcome email, and unless someone happens to manually inspect BullMQ's internal failed-jobs list — which, realistically, nobody does on any regular basis — nobody on the team ever finds out this happened at all.

**The fix: a "failed" listener that moves permanently-failed jobs somewhere visible**

\`\`\`js
const { Worker, QueueEvents } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const queueEvents = new QueueEvents("emails", { connection: redisConnection });
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterStore.save({ jobId, failedReason, queue: "emails", timestamp: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});
\`\`\`

\`\`\`ts
import { Worker, QueueEvents } from "bullmq";

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const queueEvents = new QueueEvents("emails", { connection: redisConnection });
queueEvents.on("failed", async ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  await deadLetterStore.save({ jobId, failedReason, queue: "emails", timestamp: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});
\`\`\`

The \`"failed"\` event fires once a job has exhausted every configured retry attempt and is genuinely, permanently done retrying — this is the specific, correct moment to treat it as needing a human, rather than silently giving up. Saving the failed job's details to a dedicated, actively-monitored store (a database table, a dedicated Redis list, or a proper dead-letter queue depending on scale) preserves exactly what failed and why, and alerting a real channel a team actually watches ensures a person finds out promptly, rather than the failure sitting invisible until someone happens to go looking for it. This turns "the job failed and quietly vanished" into "the job failed, was preserved for inspection, and a person was told" — the difference between silently losing work and actually knowing about a problem.`,

    simpleHi: `**Toote hue se shuru.** Ek job jo apni retries khatam karti hai aur bas gayab ho jaati hai:

\`\`\`js
const { Worker } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });
\`\`\`

Is course ka pehle wala background-jobs lesson sahi tarike se \`attempts: 3\` set karta hai, taaki ek welcome-email job jo email provider ke thodi der ke liye down hone ki wajah se fail hoti hai automatically retry ho, koshishon ke beech exponential backoff ke saath, us lesson ke pattern ka bilkul palan karte hue. Gap ye hai ki kya hota hai agar sabhi teen koshishein fail ho jaayein — shaayad email provider retries ki avdhi se zyaada der down tha, ya khaas email address sach mein invalid hai. By default, BullMQ bas job ko \`"failed"\` maark karta hai aur aage badh jaata hai; job ka data abhi bhi technically Redis mein kahin maujood hai, par is code ke baare mein kuch bhi us failure ko saqriya taur par ek insaan ko nahi dikhaata, ise kahin log nahi karta jise team asal mein dekhti hai, ya chupke se haar maanne se aage kuch bhi nahi karta. Wo khaas customer kabhi apna welcome email nahi paata, aur jab tak koi manually BullMQ ki internal failed-jobs list nahi dekhta — jo, wastavik roop se, koi bhi niyamit roop se nahi karta — team mein kisi ko kabhi pata hi nahi chalta ki ye hua.

**Fix: ek "failed" listener jo hamesha-ke-liye-fail-hui jobs ko kahin dikhti jagah le jaata hai**

\`\`\`js
const { Worker, QueueEvents } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const queueEvents = new QueueEvents("emails", { connection: redisConnection });
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterStore.save({ jobId, failedReason, queue: "emails", timestamp: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});
\`\`\`

\`\`\`ts
import { Worker, QueueEvents } from "bullmq";

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const queueEvents = new QueueEvents("emails", { connection: redisConnection });
queueEvents.on("failed", async ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  await deadLetterStore.save({ jobId, failedReason, queue: "emails", timestamp: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});
\`\`\`

\`"failed"\` event tab fire hota hai jab ek job ne apni har configure ki gayi retry koshish khatam kar li ho aur sach mein, hamesha ke liye retry karna khatam kar chuki ho — ye bilkul wo khaas, sahi pal hai ise ek insaan ki zaroorat wali cheez ki tarah maanne ka, chupke se haar maanne ke bajaye. Fail hui job ki details ko ek dedicated, saqriya-monitor-ki-jaati store (ek database table, ek dedicated Redis list, ya scale ke aadhaar par ek asli dead-letter queue) mein save karna bilkul preserve karta hai ki kya fail hua aur kyun, aur ek asli channel ko alert karna jise team asal mein dekhti hai sunishchit karta hai ki ek insaan ko turant pata chale, failure kisi ke ise dhoondhne jaane tak na-dikhta baithe rehne ke bajaye. Ye "job fail hui aur chupke se gayab ho gayi" ko "job fail hui, jaanch ke liye preserve ki gayi, aur ek insaan ko bataaya gaya" mein badal deta hai — chupke se kaam kho dene aur asal mein ek samasya ke baare mein jaanne ke beech ka antar.`,

    content: `## Why every retry strategy needs a defined "give up" behavior

\`\`\`
This course's earlier lesson: attempts: 3, backoff: exponential
— retries a job automatically when it fails.

This lesson: what happens on attempt 3's failure — the retries
are genuinely exhausted, and the job needs a DIFFERENT kind of
handling, not a fourth automatic retry.
\`\`\`

Retrying a failed job automatically, with backoff, is the correct response to a TRANSIENT failure — one likely to succeed if simply tried again shortly, such as a brief network blip or a temporarily overloaded downstream service. But not every failure is transient: an email address might be permanently invalid, a payment method might be genuinely declined, or a downstream service might be down for hours rather than seconds — no number of additional automatic retries will ever succeed at these, and retrying forever wastes resources on an attempt that will never work. A complete job-processing strategy needs an explicit answer to "what happens once retries are genuinely exhausted," distinct from "how do we retry a transient failure" — this is exactly the gap a dead-letter queue fills.

## Building a dead-letter queue: preserving failed work for a human to inspect

\`\`\`js
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  const job = await Job.fromId(emailQueue, jobId);
  await deadLetterQueue.add("failed-email", {
    originalData: job.data,
    failedReason,
    failedAt: Date.now(),
    attemptsMade: job.attemptsMade,
  });
});
\`\`\`

A dead-letter queue, at its core, is simply a dedicated place — another queue, a database table, whatever fits the scale involved — that a permanently-failed job's full details are moved to once retries are exhausted: what the job was trying to do, why it ultimately failed, and how many attempts were made. This preserves everything needed to actually investigate and resolve the underlying problem later, rather than the job's data being lost the moment it's marked failed. Critically, this is a genuinely different queue or store from the one the job originally failed in — jobs land here specifically because normal processing has already been tried and given up on, and this queue represents "needs human attention," not "process automatically."

## Alerting: making sure a person actually finds out

\`\`\`js
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("failed-email", { jobId, failedReason });
  if (await deadLetterQueue.count() > ALERT_THRESHOLD) {
    await alertOnCallChannel(\`\${await deadLetterQueue.count()} jobs in dead-letter queue\`);
  }
});
\`\`\`

Simply moving failed jobs to a dead-letter queue solves the "data is preserved" half of the problem, but does nothing on its own to ensure a person actually notices — a dead-letter queue nobody looks at is barely better than no dead-letter queue at all. Pairing dead-letter handling with active alerting (a message to a monitored channel, an entry in the error-tracking or metrics system this course's earlier observability lesson covers) closes this gap, ensuring a permanently-failed job prompts an actual person to investigate within a reasonable time, rather than silently accumulating in a queue that only gets checked when someone happens to remember to look.

## Recurring, schedule-based work: why a naive setInterval breaks under clustering

\`\`\`js
// Broken under clustering: EVERY clustered process runs this independently,
// meaning the "daily" digest is actually sent once per process, per day
setInterval(sendDailyDigest, 24 * 60 * 60 * 1000);
\`\`\`

\`\`\`js
// Fixed: a BullMQ repeatable job, scheduled once, shared across every worker
const { Queue } = require("bullmq");
const digestQueue = new Queue("digest", { connection: redisConnection });
await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } }); // 9 AM daily, cron syntax
\`\`\`

A task that needs to run on a recurring schedule — a nightly cleanup, a daily digest email — independent of any specific incoming request, cannot simply be a \`setInterval\` running inside the application process, for the same reason this course's earlier clustering lesson warns against relying on in-process state: once the application runs as multiple clustered processes (a routine production setup for using all of a machine's CPU cores), every single one of those processes would independently run its own \`setInterval\`, meaning the "once daily" task actually fires once per process, per day, and a customer might receive several duplicate digest emails rather than one. BullMQ's own repeatable jobs solve this the same way its regular jobs solve reliable one-off work: the schedule itself is recorded in Redis, shared across every worker process, and BullMQ guarantees the job fires once per scheduled occurrence regardless of how many worker processes happen to be running — following a standard cron pattern (\`"0 9 * * *"\` for 9 AM daily) rather than requiring a hand-rolled scheduling mechanism.`,

    contentHi: `## Har retry strategy ko ek define kiya gaya "haar maano" vyavhaar kyun chahiye

\`\`\`
Is course ka pehle wala lesson: attempts: 3, backoff: exponential
— ek job ko automatically retry karta hai jab ye fail hoti hai.

Ye lesson: attempt 3 ki failure par kya hota hai — retries sach
mein khatam ho chuki hain, aur job ko ek ALAG tarah ki handling
chahiye, ek chautha automatic retry nahi.
\`\`\`

Ek fail hui job ko automatically retry karna, backoff ke saath, ek TRANSIENT failure ke liye sahi jawaab hai — ek jo shaayad safal ho jaaye agar bas thodi der baad phir se try ki jaaye, jaise ek chhota network blip ya ek asthaayi taur par overloaded downstream service. Par har failure transient nahi hai: ek email address hamesha ke liye invalid ho sakta hai, ek payment method sach mein decline ho sakta hai, ya ek downstream service seconds ke bajaye ghanton ke liye down ho sakta hai — koi bhi additional automatic retries in par kabhi safal nahi honge, aur hamesha retry karna resources ko ek aisi koshish par barbaad karta hai jo kabhi kaam nahi karegi. Ek poori job-processing strategy ko "retries sach mein khatam hone par kya hota hai" ka ek explicit jawaab chahiye, "ek transient failure ko kaise retry karein" se alag — ye bilkul wahi gap hai jise ek dead-letter queue bharti hai.

## Ek dead-letter queue banaana: fail hue kaam ko ek insaan ke jaanchne ke liye preserve karna

\`\`\`js
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  const job = await Job.fromId(emailQueue, jobId);
  await deadLetterQueue.add("failed-email", {
    originalData: job.data,
    failedReason,
    failedAt: Date.now(),
    attemptsMade: job.attemptsMade,
  });
});
\`\`\`

Ek dead-letter queue, apne core mein, bas ek dedicated jagah hai — ek doosri queue, ek database table, jo bhi shaamil scale se milta ho — jahan ek hamesha-ke-liye-fail-hui job ki poori details le jaayi jaati hain ek baar retries khatam ho jaayein: job kya karne ki koshish kar rahi thi, ye aakhirkaar kyun fail hui, aur kitni koshishein ki gayin. Ye baad mein asli samasya ki jaanch aur suljhaane ke liye zaroori sab kuch preserve karta hai, job ka data fail maark hote hi kho jaane ke bajaye. Bahut zaruri, ye ek sach mein alag queue ya store hai jis mein job asli taur par fail hui — jobs yahaan khaas taur par isliye aati hain kyunki normal processing pehle se try aur haar maani jaa chuki hai, aur ye queue darsata hai "insaani dhyaan ki zaroorat hai," "automatically process karo" nahi.

## Alerting: sunishchit karna ki ek insaan ko asal mein pata chale

\`\`\`js
queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("failed-email", { jobId, failedReason });
  if (await deadLetterQueue.count() > ALERT_THRESHOLD) {
    await alertOnCallChannel(\`\${await deadLetterQueue.count()} jobs in dead-letter queue\`);
  }
});
\`\`\`

Fail hui jobs ko bas ek dead-letter queue mein le jaana samasya ke "data preserve hua hai" waale aadhe hisse ko sulajhaata hai, par khud se kuch nahi karta ye sunishchit karne ke liye ki ek insaan asal mein notice kare — ek dead-letter queue jise koi nahi dekhta koi dead-letter queue na hone se mushkil se behtar hai. Dead-letter handling ko saqriya alerting (ek monitored channel ko ek message, is course ke pehle wale observability lesson mein cover ki gayi error-tracking ya metrics system mein ek entry) ke saath jodna is gap ko band karta hai, sunishchit karte hue ki ek hamesha-ke-liye-fail-hui job ek asli insaan ko ek samajhdaar waqt ke andar jaanch karne ko prerit karti hai, chupke se ek aisi queue mein jama hone ke bajaye jise sirf tab check kiya jaata hai jab koi dekhna yaad rakhta hai.

## Recurring, schedule-aadhaarit kaam: ek saadha \`setInterval\` clustering ke neeche kyun tootta hai

\`\`\`js
// Clustering ke neeche toota: HAR clustered process ise swatantra roop se
// chalaata hai, matlab "daily" digest asal mein prati-process, prati-din
// ek baar bheja jaata hai
setInterval(sendDailyDigest, 24 * 60 * 60 * 1000);
\`\`\`

\`\`\`js
// Theek: ek BullMQ repeatable job, ek baar scheduled, har worker mein shared
const { Queue } = require("bullmq");
const digestQueue = new Queue("digest", { connection: redisConnection });
await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } }); // 9 AM daily, cron syntax
\`\`\`

Ek kaam jise ek recurring schedule par chalna hai — ek raat ki safaai, ek daily digest email — kisi bhi khaas aati request se swatantra, bas ek \`setInterval\` nahi ho sakta jo application process ke andar chalta hai, usi wajah se jis wajah se is course ka pehle wala clustering lesson in-process state par nirbhar hone ke khilaaf chetaavni deta hai: ek baar application kai clustered processes ki tarah chalti hai (ek machine ke sabhi CPU cores istemal karne ke liye ek routine production setup), un processes mein se har akela swatantra roop se apna khud ka \`setInterval\` chalaayega, matlab "din mein ek baar" kaam asal mein prati-process, prati-din ek baar fire hota hai, aur ek customer ek ke bajaye kai dohraayi hui digest emails paa sakta hai. BullMQ ke apne repeatable jobs isi tarike se sulajhaate hain jaise iski regular jobs bharosemand ek-baar-ke-kaam ko sulajhaati hain: schedule khud Redis mein record hota hai, har worker process mein shared, aur BullMQ zamanat deta hai ki job har scheduled occurrence ke liye ek baar fire hoti hai chahe kitni bhi worker processes chal rahi hon — ek standard cron pattern (daily 9 AM ke liye \`"0 9 * * *"\`) ka palan karte hue ek haath-se-banaaya scheduling mechanism maangne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a permanently-failed job simply vanishes',
        titleHi: 'Toota: ek hamesha-ke-liye-fail-hui job bas gayab ho jaati hai',
        code: `const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });
// after 3 failures, the job is marked "failed" and nobody ever finds out`,
        codeJs: `const { Worker } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

// no "failed" listener at all — a permanently-failed job is silently lost`,
        codeTs: `import { Worker } from "bullmq";

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });
// Correctly typed, completely valid TypeScript — the gap is entirely
// about missing failure handling, not a type error.`,
        output: `A transient email-provider outage is correctly retried and usually
recovers. A permanently invalid email address exhausts all 3
retries and is never surfaced to anyone on the team.`,
        explain: 'Retrying is the right response to a transient failure, but nothing here defines what happens once retries are genuinely exhausted — the job\'s failure is invisible.',
        explainHi: 'Retry karna ek transient failure ke liye sahi jawaab hai, par yahaan kuch bhi define nahi karta ki retries sach mein khatam hone par kya hota hai — job ki failure na-dikhti hai.',
      },
      {
        title: 'Fixed: a dead-letter queue with active alerting',
        titleHi: 'Theek: saqriya alerting wali ek dead-letter queue',
        code: `queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("failed-email", { jobId, failedReason });
  await alertOnCallChannel(\`Job \${jobId} permanently failed\`);
});`,
        codeJs: `const { Worker, QueueEvents, Queue } = require("bullmq");

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const deadLetterQueue = new Queue("emails-dead-letter", { connection: redisConnection });
const queueEvents = new QueueEvents("emails", { connection: redisConnection });

queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("failed-email", { originalJobId: jobId, failedReason, failedAt: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});`,
        codeTs: `import { Worker, QueueEvents, Queue } from "bullmq";

const worker = new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection: redisConnection, attempts: 3 });

const deadLetterQueue = new Queue("emails-dead-letter", { connection: redisConnection });
const queueEvents = new QueueEvents("emails", { connection: redisConnection });

queueEvents.on("failed", async ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  await deadLetterQueue.add("failed-email", { originalJobId: jobId, failedReason, failedAt: Date.now() });
  await alertOnCallChannel(\`Email job \${jobId} permanently failed: \${failedReason}\`);
});`,
        outputJs: `A permanently-failed job's details are preserved in a dedicated
queue for investigation, and an actual alert notifies a real person
promptly — nothing about the failure goes unnoticed.`,
        outputTs: `// Identical behaviour. Typing the "failed" event's payload documents
// exactly what data is available to act on when a job permanently fails.`,
        explain: 'The dead-letter queue preserves what failed and why; the alert ensures a person actually investigates, rather than the failure sitting invisible in a list nobody checks.',
        explainHi: 'Dead-letter queue preserve karti hai ki kya fail hua aur kyun; alert sunishchit karta hai ki ek insaan asal mein jaanch kare, failure ek aisi list mein na-dikhti baithne ke bajaye jise koi check nahi karta.',
      },
      {
        title: 'A scheduled job using BullMQ\'s repeatable jobs instead of setInterval',
        titleHi: 'Ek scheduled job jo \`setInterval\` ke bajaye BullMQ ki repeatable jobs istemal karti hai',
        code: `const digestQueue = new Queue("digest", { connection: redisConnection });
await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } });`,
        codeJs: `const { Queue, Worker } = require("bullmq");

const digestQueue = new Queue("digest", { connection: redisConnection });

// Scheduled once, at startup — Redis tracks the schedule, shared across every worker
await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } }); // 9 AM daily

const digestWorker = new Worker("digest", async (job) => {
  await sendDailyDigestToAllUsers();
}, { connection: redisConnection });`,
        codeTs: `import { Queue, Worker } from "bullmq";

const digestQueue = new Queue("digest", { connection: redisConnection });

await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } });

const digestWorker = new Worker("digest", async (job): Promise<void> => {
  await sendDailyDigestToAllUsers();
}, { connection: redisConnection });`,
        outputJs: `The digest fires exactly once at 9 AM daily, regardless of whether
the application is running as one process or twenty clustered ones
— the schedule lives in Redis, not in any single process's memory.`,
        outputTs: `// Identical behaviour. This scales to any number of clustered
// worker processes without duplicating the scheduled task even once.`,
        explain: 'Because the schedule is tracked in Redis rather than any one process\'s own setInterval, exactly one worker picks up each scheduled occurrence, regardless of how many processes are running.',
        explainHi: 'Kyunki schedule Redis mein track kiya jaata hai kisi ek process ke apne \`setInterval\` mein nahi, bilkul ek worker har scheduled occurrence uthaata hai, chahe kitni bhi processes chal rahi hon.',
      },
    ],

    mistakes: [
      {
        wrong: `const worker = new Worker("emails", handler, { attempts: 3 });
// no "failed" listener — permanently-failed jobs vanish with no record`,
        right: `queueEvents.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("failed", { jobId, failedReason });
  await alertOnCallChannel(\`Job \${jobId} failed: \${failedReason}\`);
});`,
        why: 'Configuring retries without a defined "give up" behavior means a permanently-failed job\'s data and the fact that it failed at all are both silently lost.',
        whyHi: 'Ek define kiye "haar maano" vyavhaar bina retries configure karna matlab hai ek hamesha-ke-liye-fail-hui job ka data aur ye tathya ki ye bilkul fail hui dono chupke se kho jaate hain.',
      },
      {
        wrong: `// A dead-letter queue that exists but nothing ever alerts on or reviews
await deadLetterQueue.add("failed-email", { jobId, failedReason });
// no alerting, no monitoring — the queue just quietly accumulates`,
        right: `await deadLetterQueue.add("failed-email", { jobId, failedReason });
await alertOnCallChannel(\`Job \${jobId} moved to dead-letter queue\`);
// a person is actively told, not left to remember to check`,
        why: 'A dead-letter queue with no alerting attached solves data preservation but not the actual problem — a person still needs to be actively notified, not left to remember to check it.',
        whyHi: 'Koi alerting attach na hone wali ek dead-letter queue data preservation sulajhaati hai par asli samasya nahi — ek insaan ko phir bhi saqriya taur par bataaya jaana chahiye, use check karna yaad rakhne ke liye chhoda nahi jaana chahiye.',
      },
      {
        wrong: `// A "daily" scheduled task running inside a clustered application
setInterval(sendDailyDigest, 24 * 60 * 60 * 1000);
// every clustered process fires this independently — duplicate emails`,
        right: `await digestQueue.add("send-digest", {}, { repeat: { pattern: "0 9 * * *" } });
// scheduled once in Redis, shared across every clustered process`,
        why: 'A setInterval-based schedule running inside a clustered application fires once per process rather than once total, causing duplicated scheduled work.',
        whyHi: 'Ek clustered application ke andar chalta \`setInterval\`-aadhaarit schedule prati-total ek baar ke bajaye prati-process ek baar fire hota hai, dohraaya hua scheduled kaam cause karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**"Dead-letter queue" is a standard, widely used term across virtually every major message-queue and job-processing system**, reflecting how universally necessary this pattern is considered for handling permanently-failed work reliably.',
        hi: '**"Dead-letter queue" lagbhag har mukhya message-queue aur job-processing system mein ek standard, vyaapak roop se istemal ki jaane waali term hai**, ye darsata hai ki hamesha-ke-liye-fail-hue kaam ko bharosemand taur par sambhaalne ke liye ye pattern kitna sarvavyaapi zaruri maana jaata hai.',
      },
      {
        en: '**BullMQ\'s repeatable jobs, backed by standard cron syntax, are a commonly used, production-proven mechanism for scheduled work in Node.js**, specifically chosen over in-process timers for its correctness under clustering.',
        hi: '**BullMQ ki repeatable jobs, standard cron syntax se backed, Node.js mein scheduled kaam ke liye ek aam taur par istemal hota, production-proven mechanism hain**, khaas taur par clustering ke neeche apni sahihata ke liye in-process timers ke oopar chuni jaati hain.',
      },
      {
        en: '**Silently losing background work — a payment reconciliation job, a notification, a data export — after retries are exhausted is a commonly cited real-world source of quiet, hard-to-detect production incidents**, precisely the failure mode a dead-letter queue with alerting is designed to prevent.',
        hi: '**Retries khatam hone ke baad background kaam — ek payment reconciliation job, ek notification, ek data export — chupke se kho dena chupe, pakadna-mushkil production incidents ka ek aam taur par cite kiya jaane waala asli-duniya source hai**, bilkul wahi fail-hone ka tarika jise alerting wali ek dead-letter queue rokne ke liye design ki gayi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is retrying a failed job with backoff not, by itself, a complete failure-handling strategy?',
        qHi: 'Backoff ke saath ek fail hui job ko retry karna, khud se, ek poori failure-handling strategy kyun nahi hai?',
        a: 'Retrying with backoff is specifically designed to handle TRANSIENT failures — conditions that are temporary in nature and reasonably likely to have resolved by the time a later retry attempt occurs, such as a brief network interruption, a downstream service that was momentarily overloaded, or a temporary rate limit being hit. For this category of failure, retrying genuinely is the correct, complete response, since the underlying cause is expected to no longer be present by the time the retry runs. However, not every failure a job can encounter is transient in this way: an email address might be permanently malformed or simply not exist, a payment might be genuinely and permanently declined by the cardholder\'s bank for a reason that will not change on its own, or a downstream dependency might be down for an extended outage lasting far longer than any reasonable number of retries would span. For this second category of failure, every single retry attempt is doomed to fail for exactly the same underlying reason as the first attempt, and continuing to retry provides no genuine chance of eventual success — it merely delays the moment the job is finally, correctly recognized as failed, while consuming processing resources on attempts that were never going to succeed. A complete failure-handling strategy therefore needs two genuinely distinct components: a retry mechanism for the transient case, which this course\'s earlier background-jobs lesson covers, and an explicit, separate mechanism for the case where retries are exhausted and the failure is accepted as permanent — moving the job\'s data somewhere it can be investigated, and ensuring a person is actually notified, which is exactly what a dead-letter queue paired with alerting provides. Retrying alone answers "what do we do while there\'s still a reasonable chance of success" but leaves "what do we do once that chance is genuinely gone" entirely unaddressed.',
        aHi: 'Backoff ke saath retry karna khaas taur par TRANSIENT failures sambhaalne ke liye design kiya gaya hai — sthitiyaan jo prakriti mein asthaayi hain aur samajhdaari se sambhaavna rakhti hain ki ek baad ki retry koshish tak suljh chuki hongi, jaise ek chhota network interruption, ek downstream service jo pal-bhar ke liye overloaded thi, ya ek asthaayi rate limit hit hona. Is category ki failure ke liye, retry karna sach mein sahi, poora jawaab hai, kyunki underlying kaaran ke retry chalne tak maujood na rehne ki umeed ki jaati hai. Halaanki, har failure jo ek job ko mil sakti hai is tarah transient nahi hai: ek email address hamesha ke liye malformed ho sakta hai ya bas maujood hi nahi ho sakta, ek payment cardholder ke bank dwara sach mein aur hamesha ke liye decline ho sakta hai ek aise kaaran se jo apne aap nahi badlega, ya ek downstream dependency ek lambe outage ke liye down ho sakta hai jo kisi bhi samajhdaar tadaad ki retries se kaafi zyaada der tak chale. Is doosri category ki failure ke liye, har akeli retry koshish bilkul usi underlying kaaran se fail hone ke liye baddha hai jaisa pehli koshish thi, aur retry karte rehna aakhirkaar safalta ka koi asli mauka nahi deta — ye bas us pal ko der karta hai jab job aakhirkaar, sahi tarike se fail ki tarah pehchaani jaati hai, un koshishon par processing resources kharch karte hue jo kabhi safal hone waali thi hi nahi. Ek poori failure-handling strategy ko isliye do sach mein alag components chahiye: transient case ke liye ek retry mechanism, jise is course ka pehle wala background-jobs lesson cover karta hai, aur us case ke liye ek explicit, alag mechanism jahan retries khatam ho chuki hain aur failure ko hamesha-ke-liye maana jaata hai — job ke data ko kahin le jaana jahan ise jaancha jaa sake, aur sunishchit karna ki ek insaan ko asal mein bataaya jaaye, jo bilkul wahi hai jo alerting ke saath jodi ek dead-letter queue deti hai. Akela retry karna "jab tak safalta ka ek samajhdaar mauka hai hum kya karte hain" ka jawaab deta hai par "ek baar wo mauka sach mein chala jaaye hum kya karte hain" poori tarah bina-sambodhit chhod deta hai.',
      },
      {
        q: 'Why is alerting a necessary companion to a dead-letter queue, rather than the dead-letter queue alone being sufficient?',
        qHi: 'Alerting ek dead-letter queue ka ek zaruri saathi kyun hai, akela dead-letter queue kaafi hone ke bajaye?',
        a: 'A dead-letter queue solves one specific, real problem: ensuring a permanently-failed job\'s data — what it was trying to do, why it failed, how many attempts were made — is preserved somewhere accessible, rather than being lost the moment the job is marked failed. This is a genuine and necessary improvement over losing the data entirely, but it solves only the preservation half of the underlying problem, not the equally important discovery half: preserved data that nobody ever looks at provides essentially the same practical outcome as data that was never preserved at all, since either way, the actual real-world consequence of the failure (a customer who never got their welcome email, a payment that was never reconciled) goes unaddressed until someone happens to notice. Realistically, without an active prompt directing attention to it, a dead-letter queue is exactly the kind of thing that gets checked rarely, if ever, in the ordinary course of day-to-day work, especially once a team is not actively thinking about this specific failure mode on any given day. Pairing the dead-letter queue with active alerting — a message sent to a channel a team genuinely monitors, an entry in an error-tracking or metrics system that surfaces prominently, a threshold-based alert if the dead-letter queue\'s size grows unexpectedly — closes this remaining gap by ensuring a person is actively prompted to look, at a time close to when the failure actually occurred, rather than depending on someone independently remembering that a dead-letter queue exists and choosing to go check it. The combination of preservation (the dead-letter queue) and active notification (alerting) together is what actually guarantees a permanently-failed job\'s underlying problem gets investigated, rather than merely being recorded somewhere in principle.',
        aHi: 'Ek dead-letter queue ek khaas, asli samasya sulajhaati hai: sunishchit karna ki ek hamesha-ke-liye-fail-hui job ka data — ye kya karne ki koshish kar rahi thi, ye kyun fail hui, kitni koshishein ki gayin — kahin access-laayak preserve kiya jaata hai, job ke fail maark hote hi kho jaane ke bajaye. Ye data poori tarah kho dene se ek asli aur zaruri sudhaar hai, par ye sirf underlying samasya ke preservation waale aadhe hisse ko sulajhaati hai, discovery waale utne hi zaruri aadhe hisse ko nahi: preserved data jise koi kabhi nahi dekhta asar mein wahi vyavhaarik natija deta hai jo data kabhi preserve hi nahi hua, kyunki dono tarah se, failure ka asli asli-duniya natija (ek customer jise kabhi welcome email nahi mila, ek payment jo kabhi reconcile nahi hui) bina-sambodhit rehta hai jab tak koi notice na kare. Wastavik roop se, iski taraf dhyaan nirdesit karta ek saqriya prompt bina, ek dead-letter queue bilkul aisi cheez hai jise kam hi check kiya jaata hai, agar kabhi bhi, aam roz-marra ke kaam ke dauraan, khaas taur par ek baar team kisi bhi diye din is khaas failure mode ke baare mein saqriya taur par soch nahi rahi. Dead-letter queue ko saqriya alerting ke saath jodna — ek channel ko bheja gaya message jise team sach mein monitor karti hai, ek error-tracking ya metrics system mein ek entry jo prominently ujaagar hoti hai, ek threshold-aadhaarit alert agar dead-letter queue ka size apratyaashit roop se badhta hai — is bache hue gap ko band karta hai ye sunishchit karke ki ek insaan ko saqriya taur par dekhne ko prompt kiya jaata hai, us waqt ke kareeb jab failure asal mein hui, kisi ke swatantra roop se yaad rakhne par nirbhar hone ke bajaye ki ek dead-letter queue maujood hai aur ise check karne jaana chunna. Preservation (dead-letter queue) aur saqriya notification (alerting) ka sanyojan saath yahi hai jo asal mein zamanat deta hai ki ek hamesha-ke-liye-fail-hui job ki underlying samasya ki jaanch hoti hai, siddhaant mein bas kahin record hone ke bajaye.',
      },
      {
        q: 'Why does an in-process setInterval fail to correctly implement a "run once daily" scheduled task once an application is clustered across multiple processes?',
        qHi: 'Ek application kai processes mein clustered hone ke baad ek in-process \`setInterval\` "din mein ek baar chalao" scheduled task ko sahi tarike se implement karne mein kyun fail hota hai?',
        a: 'A setInterval call schedules a callback to run repeatedly within the specific process that called it, based entirely on that one process\'s own internal timer state — it has no inherent awareness of, or coordination with, any other process that might also be running the exact same application code. When an application runs as a single process, this is not a problem, since there is only one setInterval instance in existence, and it fires exactly once per interval as intended. Clustering (this course\'s earlier lesson) deliberately runs multiple, entirely independent copies of the same application code simultaneously, typically one per available CPU core, specifically to make full use of a machine\'s hardware — and critically, each of those clustered processes executes the exact same application startup code, including any setInterval call written into it. This means a setInterval intended to fire "once daily" does not actually run once across the application as a conceptual whole; it runs once daily WITHIN EACH CLUSTERED PROCESS INDEPENDENTLY, with no process aware that any of the others exist or are running the identical schedule. If an application is clustered across four processes, a "daily" digest email task actually fires four separate times each day, each one entirely oblivious to the other three, resulting in each recipient receiving four duplicate emails instead of one. BullMQ\'s repeatable jobs solve this by moving the schedule itself out of any individual process\'s memory and into Redis, a shared store every clustered process can see and coordinate through — BullMQ\'s own internal logic ensures that for each scheduled occurrence, exactly one worker among however many are running actually picks up and processes that specific occurrence, regardless of how many worker processes happen to be active at the time, which is precisely the coordination a plain in-process setInterval has no way to provide.',
        aHi: 'Ek \`setInterval\` call ek callback ko us khaas process ke andar baar-baar chalne ke liye schedule karta hai jisne ise call kiya, poori tarah us ek process ki apni internal timer state ke aadhaar par — ise kisi bhi doosri process ke baare mein koi buniyaadi jaagrukta ya coordination nahi hai jo shaayad bilkul wahi application code bhi chala rahi ho. Jab ek application ek akele process ki tarah chalti hai, ye koi samasya nahi hai, kyunki maujood mein sirf ek \`setInterval\` instance hai, aur ye iraade ke hisaab se prati-interval bilkul ek baar fire hota hai. Clustering (is course ka pehle wala lesson) jaan-boojhkar usi application code ki kai, poori tarah swatantra copies ek saath chalaata hai, aam taur par har upalabdh CPU core ke liye ek, khaas taur par ek machine ke hardware ka poora istemal karne ke liye — aur bahut zaruri, un clustered processes mein se har ek bilkul wahi application startup code chalaata hai, usmein likha gaya koi bhi \`setInterval\` call sameet. Iska matlab hai ek \`setInterval\` jiska iraada "din mein ek baar" fire hona hai asal mein poori application ke ek conceptual saboot ki tarah ek baar nahi chalta; ye HAR CLUSTERED PROCESS KE ANDAR SWATANTRA ROOP SE din mein ek baar chalta hai, koi process ye jaante bina ki baaki koi bhi maujood hai ya identical schedule chala raha hai. Agar ek application chaar processes mein clustered hai, ek "daily" digest email task asal mein har din chaar alag baar fire hota hai, har ek baaki teen se poori tarah bekhabar, har recipient ko ek ke bajaye chaar dohraayi hui emails milte hue. BullMQ ki repeatable jobs ise schedule ko khud kisi bhi akele process ki memory se baahar aur Redis mein le jaakar sulajhaati hain, ek shared store jise har clustered process dekh aur uske through coordinate kar sakta hai — BullMQ ka apna internal logic sunishchit karta hai ki har scheduled occurrence ke liye, jitni bhi chal rahi hon unmein se bilkul ek worker asal mein us khaas occurrence ko uthaata aur process karta hai, chahe us waqt kitni bhi worker processes saqriya hon, jo bilkul wahi coordination hai jo ek saadha in-process \`setInterval\` dene ka koi tarika nahi rakhta.',
      },
    ],

    exercises: [
      {
        task: 'Build the background-jobs email worker from this course\'s earlier lesson with attempts: 3. Force every attempt to fail deliberately (e.g. always throw), and confirm that after the third failure, the job simply disappears from active monitoring with no record anywhere.',
        taskHi: 'Is course ke pehle wale lesson se \`attempts: 3\` wala background-jobs email worker banaao. Jaan-boojhkar har koshish ko fail hone majboor karo (jaise hamesha throw karo), aur confirm karo ki teesri failure ke baad, job bas active monitoring se gayab ho jaati hai kahin bhi koi record bina.',
        hint: 'Add a console.log inside the job handler each time it runs, so you can watch it fire exactly 3 times before the job is marked failed and nothing further happens.',
        hintHi: 'Job handler ke andar har baar chalne par ek \`console.log\` jodo, taaki tum ise bilkul 3 baar fire hote dekh sako job fail maark hone se pehle aur uske baad kuch aur na ho.',
      },
      {
        task: 'Add a "failed" listener via QueueEvents that moves the job\'s data into a dedicated dead-letter queue, following this lesson\'s fixed example. Confirm the failed job\'s original data is now inspectable in the new queue.',
        taskHi: 'Is lesson ke theek example ka palan karte hue \`QueueEvents\` ke zariye ek "failed" listener jodo jo job ke data ko ek dedicated dead-letter queue mein le jaata hai. Confirm karo ki fail hui job ka asli data ab nayi queue mein jaancha jaa sakta hai.',
        hint: 'Log the dead-letter queue\'s contents after the original job fails to confirm the original data (userId, the failure reason) is genuinely preserved there.',
        hintHi: 'Asli job fail hone ke baad dead-letter queue ke contents log karo ye confirm karne ke liye ki asli data (\`userId\`, failure reason) sach mein wahaan preserve hai.',
      },
      {
        task: 'Build a BullMQ repeatable job scheduled to run every minute (using a cron pattern) instead of daily, for faster testing. Start two worker processes simultaneously and confirm the job still fires only once per scheduled minute, not twice.',
        taskHi: 'Tez testing ke liye daily ke bajaye har minute chalne ke liye scheduled ek BullMQ repeatable job banaao (ek cron pattern istemal karte hue). Do worker processes ek saath shuru karo aur confirm karo ki job phir bhi har scheduled minute mein sirf ek baar fire hoti hai, do baar nahi.',
        hint: 'A cron pattern of "* * * * *" runs every minute — log a timestamp each time the job runs and confirm only one log line appears per minute despite two workers running.',
        hintHi: 'Ek cron pattern \`"* * * * *"\` har minute chalta hai — job har baar chalne par ek timestamp log karo aur confirm karo ki do workers chalne ke bawajood prati-minute sirf ek log line dikhti hai.',
      },
    ],

    keyTakeaways: [
      'Retrying with backoff correctly handles transient failures, but every job-processing strategy also needs an explicit answer to what happens once retries are genuinely exhausted.',
      'A dead-letter queue preserves a permanently-failed job\'s data (what it tried to do, why it failed, how many attempts were made) somewhere accessible, rather than losing it the moment the job is marked failed.',
      'A dead-letter queue alone is insufficient — it must be paired with active alerting, since a preserved failure nobody looks at produces the same practical outcome as one that was never preserved.',
      'BullMQ\'s "failed" event fires once a job has exhausted every configured retry attempt — the correct, specific moment to move it to a dead-letter queue rather than attempting yet another automatic retry.',
      'A setInterval-based schedule breaks under clustering: every clustered process runs its own independent timer, causing a "daily" task to fire once per process rather than once total.',
      'BullMQ\'s repeatable jobs solve scheduling correctly by storing the schedule in Redis, shared across every worker process, guaranteeing each scheduled occurrence is picked up exactly once regardless of how many processes are running.',
    ],
    keyTakeawaysHi: [
      'Backoff ke saath retry karna transient failures ko sahi tarike se sambhaalta hai, par har job-processing strategy ko is baat ka bhi ek explicit jawaab chahiye ki retries sach mein khatam hone par kya hota hai.',
      'Ek dead-letter queue ek hamesha-ke-liye-fail-hui job ka data (ye kya karne ki koshish kar rahi thi, ye kyun fail hui, kitni koshishein ki gayin) kahin access-laayak preserve karti hai, job fail maark hote hi use kho dene ke bajaye.',
      'Akeli ek dead-letter queue kaafi nahi hai — ise saqriya alerting ke saath jodaa jaana chahiye, kyunki ek preserved failure jise koi nahi dekhta wahi vyavhaarik natija deti hai jo kabhi preserve hi nahi hui.',
      'BullMQ ka \`"failed"\` event tab fire hota hai jab ek job ne apni har configure ki gayi retry koshish khatam kar li ho — ise ek chautha automatic retry karne ke bajaye ek dead-letter queue mein le jaane ka sahi, khaas pal.',
      'Ek \`setInterval\`-aadhaarit schedule clustering ke neeche tootta hai: har clustered process apna khud ka swatantra timer chalaata hai, ek "daily" task ko ek ke bajaye prati-process ek baar fire karwaate hue.',
      'BullMQ ki repeatable jobs schedule ko Redis mein store karke scheduling ko sahi tarike se sulajhaati hain, har worker process mein shared, sunishchit karte hue ki har scheduled occurrence bilkul ek baar uthaayi jaati hai chahe kitni bhi processes chal rahi hon.',
    ],
  },
];
