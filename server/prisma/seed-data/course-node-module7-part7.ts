/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 7.
 *
 * Secrets management beyond .env: why the .env pattern this course
 * established back in Module 1 (gitignored file, never committed) is
 * correct as far as it goes, but breaks down specifically once a real
 * secret needs to be revoked or rotated across a real team. Broken
 * narrative: a startup's only secrets-sharing mechanism is copy-pasting
 * .env values into Slack DMs and a wiki page for onboarding — when an
 * engineer leaves, nobody can say with confidence every place those exact
 * values were copied to, so nobody can be sure revoking their laptop
 * access actually revoked their access to production. Fixed by introducing
 * a centralized secrets manager: the application fetches secrets via an
 * authenticated API call at startup rather than reading a static file,
 * access is centrally granted/revoked per person, and rotation updates one
 * source of truth instead of requiring a human to redistribute new values
 * to every teammate's local .env file.
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

export const NODE_MODULE_7_PART7: CourseLesson[] = [
  {
    slug: 'secrets-management',
    title: 'Secrets Management: Why .env Alone Breaks Down at Team Scale',
    titleHi: 'Secrets Management: Team Scale Par \'.env\' Akela Kyun Toot Jaata Hai',
    description: 'An engineer who left the company six months ago can still, in principle, log into production — because their .env file was copy-pasted into a Slack DM for onboarding, and nobody can say for certain every place that exact value ended up.',
    descriptionHi: 'Ek engineer jo chhe mahine pehle company chhod chuka hai abhi bhi, sidhaant mein, production mein login kar sakta hai — kyunki uski \'.env\' file onboarding ke liye ek Slack DM mein copy-paste ki gayi thi, aur koi bhi pakke taur par nahi keh sakta ki wo bilkul value kahan-kahan pahunchi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 7,

    analogy: {
      en: '**A company that changes its office door lock only by cutting a physical spare key for every new employee and having them keep it forever, with no master log of who has a copy — versus one using an electronic keycard system where any single card can be individually deactivated the instant someone leaves, with a complete log of who accessed what and when.** Relying purely on .env files, copy-pasted from person to person as a team grows, is like a company that, for years, has handled every new employee\'s office access by having someone cut them a physical spare key from the one original — a key that, once handed over, is entirely outside the company\'s control: the employee can make their own copies, leave it in a drawer, or simply keep it after they leave, and the company has no log anywhere of exactly how many keys exist or who currently holds one. This works fine for a single founder working alone — there is only one key, held by only one person, and nothing about "sharing" it is ever actually necessary. The moment the company grows to a dozen employees, each having received their own cut copy over the years, a departing employee handing back "their" key proves nothing at all about how many OTHER copies of that same cut might still be floating around, and the only way to be genuinely certain the office is secure again is the drastic, disruptive step of re-keying the entire lock and redistributing brand-new keys to everyone still employed. A company using an electronic keycard system instead can deactivate one specific employee\'s card the instant they leave, instantly and with complete confidence, verified by an actual access log the system itself keeps — with no need to physically hunt down every copy of a key that could theoretically exist anywhere.',
      hi: '**Ek company jo apne office ke darwaaze ka lock sirf har naye employee ke liye ek physical spare chaabi kaatkar aur unhe use hamesha ke liye rakhne dekar badalti hai, koi master log bina ki kiske paas copy hai — versus ek jo ek electronic keycard system istemal karti hai jahan koi bhi ek akela card us pal individually deactivate ho sakta hai jab koi jaata hai, ek poora log ke saath ki kisne kya aur kab access kiya.** Sirf \'.env\' files par bharosa karna, ek team badhte hue insaan-dar-insaan copy-paste ki gayi, ek aisi company jaisi hai jo, saalon se, har naye employee ka office access ise sambhaalti aayi hai kisi se unke liye ek physical spare chaabi asli se kaatkar — ek chaabi jo, ek baar de diye jaane ke baad, company ke control se poori tarah bahar hai: employee apni khud ki copies bana sakta hai, use ek drawer mein chhod sakta hai, ya bas jaane ke baad rakh sakta hai, aur company ke paas kahin bhi log nahi hai ki bilkul kitni chaabiyaan maujood hain ya abhi kiske paas ek hai. Ye ek akele founder ke liye theek kaam karta hai jo akela kaam karta hai — sirf ek chaabi hai, sirf ek insaan ke paas, aur "share" karne ke baare mein kuch bhi asal mein zaruri hota hi nahi. Jis pal company ek dazan employees tak badhti hai, har ek ne saalon mein apni kaati hui copy paayi hai, ek jaata hua employee "unki" chaabi wapas dena bilkul kuch bhi saabit nahi karta is baare mein ki wahi kaat ki kitni AUR copies abhi bhi kahin ghoom rahi ho sakti hain, aur asal mein pakka rehne ka aikela tarika office dobara surakshit hai poore lock ko re-key karne aur abhi kaam kar rahe har insaan ko bilkul-nayi chaabiyaan dobara bataane ka natakiya, disruptive kadam hai. Ek company jo iske bajaye ek electronic keycard system istemal karti hai ek khaas employee ke card ko us pal deactivate kar sakti hai jab wo jaate hain, turant aur poori confidence ke saath, ek asli access log se verify kiya hua jo system khud rakhta hai — kahin bhi maujood ho sakti kisi chaabi ki har copy physically dhoondhne ki zarurat bina.',
    },

    simple: `**Start broken.** A small team\'s entire approach to secrets: put them in \`.env\`, and share \`.env\` however is convenient at the time.

\`\`\`bash
# .env — gitignored, following this course's earlier configuration lesson
DATABASE_URL=postgres://prod_user:SuperSecret123@prod-db.example.com/app
JWT_SECRET=f3a9c8b1d2e47a6f9c8b1d2e47a6f9c8
STRIPE_SECRET_KEY=sk_live_51H8x...
\`\`\`

\`\`\`
Slack DM, sent to a new engineer during onboarding:
"here's the .env file you need, just save this as .env in the project root"
[.env file attached]
\`\`\`

Following this course\'s Module 1 lesson, \`.env\` is correctly gitignored — it is never committed to source control, which genuinely prevents the specific risk that lesson addressed. But as a small team grows, a real, practical question arises that a gitignored file alone does not solve: how does a NEW engineer actually get these values onto their own machine? In practice, this frequently happens exactly as shown above — the current \`.env\` file, containing genuinely live production secrets, gets copy-pasted into a Slack message, attached to an email, or pasted into a shared team wiki page "for convenience." Each of these channels now holds a permanent, searchable copy of the real production database password, the real JWT signing secret, and the real Stripe key — Slack message history, email archives, and wiki page revision histories are not designed to be secure, temporary channels; they are designed to be searchable and persistent, precisely the opposite of what a secret needs. Months later, when that same engineer leaves the company, the team faces a genuinely uncomfortable question: is it safe to assume their access is fully revoked? Nobody can honestly answer yes with confidence — the exact secret values are still sitting, unchanged, in that old Slack DM, that email, that wiki page, and on that engineer\'s own laptop, completely outside anything the company can directly control or verify.

**The fix: a centralized secrets manager, granting and revoking access to secrets themselves, not distributing copies of their values**

\`\`\`js
// AWS Secrets Manager example — the application fetches the secret at startup,
// using its own IAM role identity, never a copy-pasted value in a file
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function loadSecrets() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return JSON.parse(response.SecretString).DATABASE_URL;
}

const databaseUrl = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });
\`\`\`

\`\`\`ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function loadSecrets(): Promise<string> {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return (JSON.parse(response.SecretString as string) as { DATABASE_URL: string }).DATABASE_URL;
}

const databaseUrl: string = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });
\`\`\`

A secrets manager (AWS Secrets Manager, HashiCorp Vault, or an equivalent) stores every real secret in exactly ONE authoritative place, and instead of a human copying its value into a file that then gets copied again to reach each new machine, the application itself fetches the actual value at startup through an authenticated API call — authenticated not with another secret typed into a file, but typically via an identity the deployment platform itself already manages (an AWS IAM role attached to the running server, for instance). Access to the secrets manager is granted and revoked per PERSON or per SERVICE, centrally, in one place — when an engineer leaves, revoking their specific access to the secrets manager immediately and verifiably cuts them off from ever being able to fetch that secret\'s value again, with no need to hunt down or worry about how many other copies of the raw value might exist elsewhere, since the actual secret was never handed to them as a portable file to begin with.`,

    simpleHi: `**Toote hue se shuru.** Ek chhoti team ka secrets ke liye poora tarika: unhe \`.env\` mein daalo, aur \`.env\` ko jaise bhi us waqt suvidhaajanak ho share karo.

\`\`\`bash
# .env — gitignored, is course ke pehle wale configuration lesson ka palan karte hue
DATABASE_URL=postgres://prod_user:SuperSecret123@prod-db.example.com/app
JWT_SECRET=f3a9c8b1d2e47a6f9c8b1d2e47a6f9c8
STRIPE_SECRET_KEY=sk_live_51H8x...
\`\`\`

\`\`\`
Slack DM, ek naye engineer ko onboarding ke dauraan bheja gaya:
"ye raha .env file jo tumhe chahiye, bas ise project root mein .env ki tarah save karo"
[.env file attach ki gayi]
\`\`\`

Is course ke Module 1 lesson ka palan karte hue, \`.env\` sahi tarike se gitignored hai — ye kabhi source control mein commit nahi hoti, jo sach mein us khaas khatre ko rokti hai jise us lesson ne sambhaala tha. Par jaise ek chhoti team badhti hai, ek asli, practical sawaal uthta hai jise akeli gitignored file solve nahi karti: ek NAYA engineer asal mein ye values apni khud machine par kaise paata hai? Practice mein, ye aksar bilkul upar dikhaaye jaisa hota hai — maujooda \`.env\` file, jismein sach mein live production secrets hain, ek Slack message mein copy-paste hoti hai, ek email se attach hoti hai, ya "suvidha ke liye" ek shared team wiki page mein paste hoti hai. Inmein se har channel ab asli production database password, asli JWT signing secret, aur asli Stripe key ki ek sthaayi, search-hone-laayak copy rakhta hai — Slack message history, email archives, aur wiki page revision histories surakshit, asthaayi channels hone ke liye design nahi hue hain; wo search-hone-laayak aur sthaayi hone ke liye design hue hain, ek secret ko jo chahiye uska bilkul ulta. Mahinon baad, jab wahi engineer company chhod deta hai, team ek sach mein asuvidhaajanak sawaal ka saamna karti hai: kya ye maan lena surakshit hai ki unki access poori tarah revoke ho chuki hai? Koi bhi imandaari se "haan" confidence ke saath nahi keh sakta — bilkul wahi secret values abhi bhi baithi hain, na-badli, us purani Slack DM mein, us email mein, us wiki page mein, aur us engineer ki apni laptop par, poori tarah kisi bhi cheez se bahar jise company seedha control ya verify kar sake.

**Fix: ek kendriya secrets manager, secrets tak khud access dena aur revoke karna, unki values ki copies distribute karne ke bajaye**

\`\`\`js
// AWS Secrets Manager example — application startup par secret fetch karta hai,
// apni khud IAM role pehchaan istemal karte hue, ek file mein copy-paste ki gayi value kabhi nahi
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function loadSecrets() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return JSON.parse(response.SecretString).DATABASE_URL;
}

const databaseUrl = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });
\`\`\`

\`\`\`ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function loadSecrets(): Promise<string> {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return (JSON.parse(response.SecretString as string) as { DATABASE_URL: string }).DATABASE_URL;
}

const databaseUrl: string = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });
\`\`\`

Ek secrets manager (AWS Secrets Manager, HashiCorp Vault, ya barabar) har asli secret ko bilkul EK adhikrit jagah store karta hai, aur ek insaan ke uski value ko ek file mein copy karne ke bajaye jo phir har nayi machine tak pahunchne ke liye dobara copy hoti hai, application khud startup par asli value ko ek authenticated API call ke through fetch karta hai — authenticated koi doosri secret file mein type ki hui se nahi, balki aam taur par ek pehchaan se jise deployment platform khud pehle se manage karta hai (jaise chalte server se juda ek AWS IAM role). Secrets manager tak access PRATI INSAAN ya PRATI SERVICE, kendriya taur par, ek jagah diya aur revoke kiya jaata hai — jab ek engineer jaata hai, unki khaas secrets manager tak access revoke karna turant aur verify-hone-laayak taur par unhe us secret ki value dobara kabhi fetch karne ke kaabil hone se kaat deta hai, ye chinta kiye bina ki raw value ki kitni aur copies kahin aur maujood ho sakti hain, kyunki asli secret unhe shuru mein ek portable file ki tarah kabhi diya hi nahi gaya tha.`,

    content: `## Rotation: changing a secret's value without redistributing it by hand

\`\`\`
Without a secrets manager: rotating a compromised database password means
manually generating a new one, then messaging every teammate and every
running server to update their own copy of .env — a slow, error-prone,
high-stakes scramble many teams simply avoid doing at all.

With a secrets manager: the secrets manager itself rotates the underlying
credential and updates the one authoritative record — every application
instance simply fetches the current value the next time it starts or
refreshes, with no human needing to manually redistribute anything.
\`\`\`

"Rotation" means periodically or reactively changing a secret\'s actual value — a genuinely important practice specifically because a secret that never changes remains equally useful to anyone who has ever obtained a copy of it, for as long as it exists. Without a centralized secrets manager, rotating a value requires a human to generate the new value and then somehow ensure every place that had a copy of the old one (every teammate\'s local \`.env\`, every running server) gets updated to the new one — a process so disruptive and easy to get wrong (miss one server, and it silently keeps trying to authenticate with the now-invalid old value) that many teams simply avoid rotating secrets at all, even ones they suspect may have been exposed. A secrets manager\'s built-in rotation support (some services, like AWS RDS databases integrated with AWS Secrets Manager, can rotate the actual underlying database password automatically on a schedule) means the application code itself does not need to change at all — it always fetches "the current value of this secret" at startup, and the secrets manager is responsible for that current value actually being correct and up to date.

## Least privilege: not every service needs access to every secret

\`\`\`
A payment-processing service needs the Stripe secret key, but has no
genuine need to access the JWT signing secret used for user sessions.

A reporting service that only reads aggregate data needs read-only
database access, not the same credentials used for writing orders.
\`\`\`

A secrets manager naturally supports granting access to specific secrets individually, rather than an all-or-nothing model where anyone with any access effectively has access to everything — this makes it practical to follow the principle of "least privilege": each specific service or person is granted access only to the specific secrets it genuinely needs to function, not to every secret the organization happens to have. With a single shared \`.env\` file copied wholesale to every server and every teammate, this kind of fine-grained separation is awkward to maintain in practice — everyone effectively ends up with a copy of everything, whether they need it or not, which means a compromise of any one piece (a single laptop, a single server) potentially exposes every secret the organization has, rather than only the ones that specific compromised system genuinely needed.

## This does not replace .env\'s core lesson — it extends it for team and production scale

\`\`\`js
// Local development: .env remains a perfectly reasonable, low-stakes choice —
// following Module 1's lesson, gitignored, never committed, containing
// development-only credentials that are not genuinely sensitive at scale.

// Production, or any credential shared across a real team: a secrets manager
// addresses what .env alone cannot — centralized revocation and rotation.
\`\`\`

This lesson does not contradict this course\'s earlier \`.env\` lesson — for a solo developer working locally, or for genuinely low-stakes development credentials, a correctly gitignored \`.env\` file remains a perfectly reasonable, low-friction choice, and nothing about this lesson suggests otherwise. The gap this lesson addresses specifically opens up once a real secret is shared across MULTIPLE people or systems over time, particularly for production credentials — at that point, the core weakness is not that \`.env\` is committed to git (the original lesson already prevents that), but that a plain file has no concept of "who currently has a copy" or "revoke this one person\'s access without touching anyone else\'s," which is precisely the gap a centralized secrets manager is built to close.`,

    contentHi: `## Rotation: ek secret ki value ko haath se dobara-distribute kiye bina badalna

\`\`\`
Secrets manager ke bina: ek compromise hue database password ko rotate
karna matlab hai haath se ek naya banaana, phir har teammate aur har chalte
server ko message karna apni \`.env\` ki copy update karne ke liye — ek
dheema, galti-hone-mein-aasaan, oonchi-daanv wali jaldbaazi jise kai teams
bas karna hi avoid karti hain.

Ek secrets manager ke saath: secrets manager khud underlying credential
rotate karta hai aur ek adhikrit record update karta hai — har application
instance bas agli baar shuru hote ya refresh karte waqt abhi ki value fetch
karta hai, kisi insaan ko haath se kuch dobara-distribute karne ki zarurat bina.
\`\`\`

"Rotation" ka matlab hai niyamit taur par ya react karte hue ek secret ki asli value badalna — ek sach mein zaruri practice khaas taur par isliye kyunki ek secret jo kabhi nahi badalta jab tak wo maujood hai us kisi ke bhi liye barabar kaam ka rehta hai jisne kabhi uski copy paayi ho. Ek kendriya secrets manager bina, ek value rotate karne ke liye ek insaan ko naya value banaana chahiye aur phir kisi tarike se sunishchit karna chahiye ki purane wale ki jo bhi copy thi wo naye tak update ho (har teammate ki local \`.env\`, har chalta server) — ek process jo itni disruptive aur galat hone mein aasaan hai (ek server chhoot jaaye, aur ye chupke se ab-invalid purani value se authenticate karne ki koshish karta rehta hai) ki kai teams secrets rotate karna bilkul avoid karti hain, un secrets ke liye bhi jinke expose hone ka unhe shak ho. Ek secrets manager ki built-in rotation support (kuch services, jaise AWS RDS databases jo AWS Secrets Manager ke saath integrated hain, apne aap asli underlying database password ko ek schedule par rotate kar sakte hain) matlab hai application code khud bilkul badalne ki zarurat nahi — ye hamesha startup par "is secret ki abhi ki value" fetch karta hai, aur secrets manager us abhi ki value ke sahi aur update hone ke liye zimmedaar hai.

## Least privilege: har service ko har secret tak access nahi chahiye

\`\`\`
Ek payment-processing service ko Stripe secret key chahiye, par JWT signing
secret ko access karne ki koi asli zarurat nahi jo user sessions ke liye
istemal hota hai.

Ek reporting service jo sirf aggregate data padhti hai use read-only
database access chahiye, wahi credentials nahi jo orders likhne ke liye
istemal hote hain.
\`\`\`

Ek secrets manager naisargik taur par khaas secrets ko akele-akele access dena support karta hai, ek sab-ya-kuch-nahi model ke bajaye jahan kisi bhi access rakhte insaan ke paas asar mein sab kuch ka access hai — ye "least privilege" ke principle ka palan karna practical banaata hai: har khaas service ya insaan ko sirf un khaas secrets tak access diya jaata hai jinki use sach mein kaam karne ke liye zarurat hai, organization ke paas jo bhi har secret hai unmein se har ek nahi. Har server aur har teammate ko bilkul copy ki gayi ek akeli shared \`.env\` file ke saath, is kism ka bareek alag-karna practice mein maintain karna awkward hai — har koi asar mein sab kuch ki copy le kar khatam hota hai, chahe unhe zarurat ho ya na ho, jiska matlab hai kisi ek tukde ka compromise (ek akeli laptop, ek akela server) mumkin taur par organization ke paas har secret expose kar sakta hai, sirf unhi ko nahi jinki us khaas compromise hue system ko sach mein zarurat thi.

## Ye \`.env\` ke mool lesson ki jagah nahi leta — ise team aur production scale ke liye badhaata hai

\`\`\`js
// Local development: .env abhi bhi ek poori tarah uchit, kam-daanv wala choice hai —
// Module 1 ke lesson ka palan karte hue, gitignored, kabhi commit nahi hui,
// development-only credentials rakhti hui jo scale par sach mein sensitive nahi hain.

// Production, ya koi bhi credential jo ek asli team ke aar-paar share hoti hai:
// ek secrets manager us cheez ko sambhaalta hai jo akela .env nahi kar sakta —
// kendriya revocation aur rotation.
\`\`\`

Ye lesson is course ke pehle wale \`.env\` lesson se virodh nahi karta — ek akele developer ke liye jo locally kaam karta hai, ya sach mein kam-daanv wale development credentials ke liye, ek sahi tarike se gitignored \`.env\` file abhi bhi ek poori tarah uchit, kam-friction wala choice hai, aur is lesson mein kuch bhi iske ulta ishara nahi karta. Ye lesson jo kami sambhaalta hai wo khaas taur par tab khulti hai jab ek asli secret waqt ke saath MULTIPLE logon ya systems ke aar-paar share hoti hai, khaas taur par production credentials ke liye — us point par, mool kamzori ye nahi hai ki \`.env\` git mein commit hui hai (asli lesson pehle se ise rokta hai), balki ye hai ki ek saadhi file mein "abhi kiske paas ek copy hai" ya "sirf is ek insaan ki access revoke karo baaki kisi ko chhue bina" ka koi concept nahi hai, jo bilkul wo kami hai jise ek kendriya secrets manager band karne ke liye bana hai.`,

    examples: [
      {
        title: 'Broken: a production secret copy-pasted into Slack for onboarding',
        titleHi: 'Toota: onboarding ke liye Slack mein copy-paste hua ek production secret',
        code: `# Slack DM: "here's the .env you need"
DATABASE_URL=postgres://prod_user:SuperSecret123@prod-db.example.com/app
// this exact value now sits, unchanged, in permanent Slack history`,
        codeJs: `// server.js — reads whatever value happens to be in the local .env file,
// with no way to know how many other copies of that value exist elsewhere
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });`,
        codeTs: `import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
// Correctly typed, completely valid TypeScript — the risk is entirely
// about how the value was distributed to reach this machine, not a
// code defect here.`,
        output: `The application connects successfully using the value from .env. Six
months later, when the engineer who received this exact value in a
Slack DM leaves the company, that same message — and that same
password — is still sitting in Slack history, unchanged.`,
        explain: 'A gitignored .env file correctly keeps the secret out of source control, but says nothing about how many other places (chat history, email, a wiki page) ended up holding a copy of the same value.',
        explainHi: 'Ek gitignored \`.env\` file sahi tarike se secret ko source control se bahar rakhti hai, par ye iske baare mein kuch nahi kehti ki kitni aur jagahon (chat history, email, ek wiki page) ne wahi value ki copy pakadi.',
      },
      {
        title: 'Fixed: the application fetches secrets from a centralized manager at startup',
        titleHi: 'Theek: application startup par ek kendriya manager se secrets fetch karta hai',
        code: `const response = await client.send(new GetSecretValueCommand({ SecretId: "prod/app/database-url" }));
const databaseUrl = JSON.parse(response.SecretString).DATABASE_URL;
const pool = new Pool({ connectionString: databaseUrl });`,
        codeJs: `const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function loadSecrets() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return JSON.parse(response.SecretString).DATABASE_URL;
}

const databaseUrl = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });`,
        codeTs: `import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

async function loadSecrets(): Promise<string> {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return (JSON.parse(response.SecretString as string) as { DATABASE_URL: string }).DATABASE_URL;
}

const databaseUrl: string = await loadSecrets();
const pool = new Pool({ connectionString: databaseUrl });`,
        outputJs: `No secret value is ever typed into a file, chat message, or wiki page
that could persist beyond the company's control. When the same
engineer leaves, revoking their access to the secrets manager
immediately and verifiably prevents them from ever fetching this value
again.`,
        outputTs: `// Identical behaviour. The authentication needed to call the secrets
// manager itself is typically the server's own managed identity (an
// IAM role), not another static secret that would recreate the same
// problem one level up.`,
        explain: 'Access is granted and revoked at the level of "can this identity call the secrets manager" rather than "does this file still exist somewhere," which is the actual gap a centralized manager closes.',
        explainHi: 'Access "kya ye pehchaan secrets manager ko bula sakti hai" ke star par diya aur revoke ki jaati hai, "kya ye file abhi bhi kahin maujood hai" ke bajaye, jo asal mein wo kami hai jise ek kendriya manager band karta hai.',
      },
      {
        title: 'Rotation without manually redistributing a new value to every teammate',
        titleHi: 'Har teammate ko haath se ek naya value dobara-distribute kiye bina rotation',
        code: `// The secrets manager rotates the underlying credential itself.
// Application code is unchanged — it always fetches "the current value".
const databaseUrl = await loadSecrets();`,
        codeJs: `// No application code changes at all when a secret is rotated —
// the next time the app starts (or re-fetches on a schedule), it
// automatically receives whatever the current value now is
async function loadSecrets() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return JSON.parse(response.SecretString).DATABASE_URL;
}`,
        codeTs: `async function loadSecrets(): Promise<string> {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "prod/app/database-url" })
  );
  return (JSON.parse(response.SecretString as string) as { DATABASE_URL: string }).DATABASE_URL;
}`,
        outputJs: `After the secrets manager rotates the database password on its own
schedule (or in response to a suspected compromise), every application
instance picks up the new value the next time it fetches, with no
human needing to message anyone or manually edit a single .env file.`,
        outputTs: `// Identical behaviour. This is precisely the capability a plain,
// manually-copied .env file has no equivalent of — rotation there
// requires manually reaching every machine holding an old copy.`,
        explain: 'The application code never hardcodes or caches the secret\'s value long-term — it always asks the secrets manager for the current value, which is what makes rotation transparent to the application.',
        explainHi: 'Application code kabhi secret ki value ko hardcode ya lambe samay ke liye cache nahi karta — ye hamesha secrets manager se abhi ki value poochta hai, jo rotation ko application ke liye transparent banaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// Sharing a real production .env file via Slack, email, or a wiki page "for onboarding"
[.env file attached to a Slack DM]`,
        right: `// Granting the new engineer access to the secrets manager itself,
// scoped to only the specific secrets their role genuinely needs
await secretsManager.grantAccess(newEngineerId, ["prod/app/database-url"]);`,
        why: 'Chat messages, emails, and wiki pages are designed to be searchable and persistent, not secure or temporary — a secret copy-pasted into one of them remains recoverable indefinitely, entirely outside the company\'s control.',
        whyHi: 'Chat messages, emails, aur wiki pages search-hone-laayak aur sthaayi hone ke liye design hue hain, surakshit ya asthaayi nahi — ek secret jo inmein se kisi mein copy-paste hui hamesha ke liye paayi jaa sakti hai, company ke control se poori tarah bahar.',
      },
      {
        wrong: `// Every service and every teammate shares one identical .env file with every secret in it
DATABASE_URL=...
JWT_SECRET=...
STRIPE_SECRET_KEY=...`,
        right: `// Each service or person is granted access only to the specific secrets it needs
await secretsManager.grantAccess(paymentServiceId, ["prod/app/stripe-key"]);
await secretsManager.grantAccess(authServiceId, ["prod/app/jwt-secret"]);`,
        why: 'A single shared file containing every secret means compromising any one system or person effectively exposes everything — least privilege limits how much a single compromise can expose.',
        whyHi: 'Ek akeli shared file jismein har secret hai matlab hai kisi bhi ek system ya insaan ka compromise asar mein sab kuch expose karta hai — least privilege simit karta hai ki ek akela compromise kitna expose kar sakta hai.',
      },
      {
        wrong: `// A suspected-compromised secret is never rotated because doing so means
// manually messaging every teammate to update their local .env file
// "we'll deal with it later"`,
        right: `// The secrets manager rotates the value in one place; every instance
// picks up the new value automatically on its next fetch
await secretsManager.rotate("prod/app/database-url");`,
        why: 'Without centralized rotation, changing a secret is disruptive enough that many teams simply avoid doing it, even for values they suspect may already be exposed — leaving a known risk unaddressed indefinitely.',
        whyHi: 'Kendriya rotation ke bina, ek secret badalna itna disruptive hai ki kai teams bas ise karna avoid karti hain, un values ke liye bhi jinke pehle se expose hone ka unhe shak hai — ek jaani-pehchaani khatra hamesha ke liye na-sambhaali chhodte hue.',
      },
    ],

    realWorld: [
      {
        en: '**AWS Secrets Manager, HashiCorp Vault, Google Secret Manager, and Azure Key Vault are among the most widely adopted secrets-management platforms in production use across companies of every size** — this is standard, expected infrastructure for any team operating beyond a single-developer project, not a niche or advanced-only tool.',
        hi: '**AWS Secrets Manager, HashiCorp Vault, Google Secret Manager, aur Azure Key Vault har size ki companies mein production istemal mein sabse vyapak taur par apnaaye gaye secrets-management platforms mein se hain** — ye ek akele-developer project se aage kaam kar rahi kisi bhi team ke liye standard, ummeed kiya infrastructure hai, koi niche ya sirf-advanced tool nahi.',
      },
      {
        en: '**Secrets accidentally exposed via chat tools, shared documents, or committed configuration files are a real, commonly cited category of production security incident**, distinct from but closely related to the risks this course\'s earlier lessons on plaintext passwords and hardcoded configuration addressed.',
        hi: '**Chat tools, shared documents, ya commit hui configuration files ke through galti se expose hue secrets ek asli, aam taur par cite hoti production security incident ki kism hain**, un khatron se alag par unse gehraayi se juda jinhe is course ke pehle wale plaintext passwords aur hardcoded configuration wale lessons ne sambhaala.',
      },
      {
        en: '**Cloud providers commonly integrate identity-based access (like AWS IAM roles) directly with their secrets-management services**, letting a running server authenticate to fetch its own secrets using an identity the platform itself manages, rather than requiring yet another static credential to be distributed.',
        hi: '**Cloud providers aam taur par identity-based access (jaise AWS IAM roles) ko seedha apni secrets-management services ke saath integrate karte hain**, ek chalte server ko apni khud secrets fetch karne ke liye ek pehchaan istemal karke authenticate karne dete hue jise platform khud manage karta hai, ek aur static credential distribute karne ki maang karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a correctly gitignored .env file still leave a real gap once a secret needs to be shared across a growing team, even though it successfully keeps that secret out of source control?',
        qHi: 'Ek sahi tarike se gitignored \`.env\` file abhi bhi ek asli kami kyun chhodti hai jab ek secret ko ek badhti team ke aar-paar share karna zaruri ho, chahe ye us secret ko source control se safaltapoorvak bahar rakhti ho?',
        a: 'A gitignored .env file successfully solves one specific problem: preventing a secret from being permanently recorded in a project\'s version control history, where it would be visible to anyone with repository access, indefinitely, as part of the codebase itself. This is a genuinely important protection, but it says nothing at all about a separate, equally real problem: once more than one person needs access to that same secret value, that value has to somehow travel from wherever it currently exists to each new person\'s own machine — and a plain file has no built-in mechanism for this at all. In practice, this gap gets filled by whatever channel happens to be convenient at the time (a chat message, an email, a shared document), each of which creates its own separate, persistent copy of the secret that exists entirely outside the .env file\'s own gitignore protection and outside the awareness of whoever originally set the secret. The original .env lesson\'s protection (keeping it out of git) and this lesson\'s concern (keeping track of every place a copy has ended up, and being able to revoke access to it) are two genuinely different problems — solving the first does not automatically solve the second, and a team that has only solved the first can still end up with a real secret scattered across an unknown number of chat histories, inboxes, and old laptops with no reliable way to account for all of them.',
        aHi: 'Ek gitignored \`.env\` file ek khaas samasya safaltapoorvak solve karti hai: ek secret ko project ki version control history mein hamesha ke liye record hone se rokna, jahan ye kisi bhi repository access wale ko dikhta, hamesha ke liye, codebase ke hisse ki tarah. Ye ek sach mein zaruri protection hai, par ye ek alag, barabar asli samasya ke baare mein bilkul kuch nahi kehti: ek baar jab ek se zyaada insaan ko wahi secret value tak access chahiye, us value ko kisi tarike se abhi kahan maujood hai wahan se har naye insaan ki apni machine tak jaana chahiye — aur ek saadhi file mein iske liye bilkul koi built-in mechanism nahi hai. Practice mein, ye kami jo bhi channel us waqt suvidhaajanak hota hai us se bharti hai (ek chat message, ek email, ek shared document), jinmein se har ek secret ki apni alag, sthaayi copy banaata hai jo \`.env\` file ke apne gitignore protection se poori tarah bahar maujood hai aur us insaan ki jaankaari se bhi bahar jisne asal mein secret set kiya tha. Asli \`.env\` lesson ki protection (ise git se bahar rakhna) aur is lesson ki chinta (har jagah ka hisaab rakhna jahan ek copy pahunchi ho, aur uski access revoke kar sakna) do sach mein alag samasyaayein hain — pehli solve karna doosri ko apne aap solve nahi karta, aur ek team jisne sirf pehli solve ki hai abhi bhi ek asli secret ke saath khatam ho sakti hai kisi na-jaane tadaad ki chat histories, inboxes, aur purane laptops mein bikhri, sab ka hisaab rakhne ka koi bharosemand tarika bina.',
      },
      {
        q: 'How does a centralized secrets manager actually solve the "who still has a copy" problem that a manually shared .env file cannot?',
        qHi: 'Ek kendriya secrets manager asal mein "kiske paas abhi bhi ek copy hai" wali samasya kaise solve karta hai jo ek manually shared \`.env\` file nahi kar sakti?',
        a: 'The fundamental shift a secrets manager introduces is that a person or a service is never actually handed a durable, portable copy of the secret\'s raw value at all — instead, they are granted permission to ASK the secrets manager for the current value, at the moment they genuinely need it (typically at application startup), through an authenticated request the secrets manager itself verifies. This means the actual secret value never needs to leave the secrets manager\'s own controlled storage in a form that could persist somewhere else outside its control — there is no file to lose track of, no chat message containing the real value, because the application simply asks for it fresh each time rather than being given a copy to keep and carry around. Because access is modeled as "can this specific identity currently ask the secrets manager for this specific secret" rather than "does this specific identity currently hold a copy of the value," revoking access becomes a single, centrally-enforced action: removing that one identity\'s permission to make that request. From that moment forward, that identity\'s future requests to the secrets manager for that secret are simply denied, regardless of whether they previously saw the value at some past point — there is no need to hunt down or account for every place a portable copy might exist, because a portable copy meant to persist indefinitely was never created or distributed as part of normal operation in the first place.',
        aHi: 'Buniyaadi badlaav jo ek secrets manager introduce karta hai ye hai ki ek insaan ya ek service ko kabhi secret ki raw value ki ek sthaayi, portable copy asal mein thamaayi hi nahi jaati — iske bajaye, unhe secrets manager se abhi ki value POOCHHNE ki ijaazat di jaati hai, us pal jab unhe sach mein zarurat hai (aam taur par application startup par), ek authenticated request ke through jise secrets manager khud verify karta hai. Iska matlab hai asli secret value ko secrets manager ki apni control ki hui storage se kabhi bahar jaane ki zarurat nahi kisi aise roop mein jo kahin aur bahar rehti — koi file nahi hai jiska hisaab kho jaaye, koi chat message nahi jismein asli value ho, kyunki application bas har baar taaza poochhta hai ek copy rakhne aur saath le jaane ke bajaye. Kyunki access ko "kya ye khaas pehchaan abhi is khaas secret ke liye secrets manager se poochh sakti hai" ki tarah model kiya jaata hai "kya ye khaas pehchaan abhi value ki ek copy rakhti hai" ke bajaye, access revoke karna ek akela, kendriya-taur-par-lagu action ban jaata hai: us ek pehchaan ki wo request karne ki ijaazat hataana. Us pal se aage, us pehchaan ki us secret ke liye secrets manager se aati requests bas mana kar di jaati hain, chahe unhone pehle kisi ateet pal mein value dekhi ho — kisi bhi jagah ka hisaab rakhne ya dhoondhne ki zarurat nahi jahan ek portable copy maujood ho sakti hai, kyunki hamesha ke liye rehne wali ek portable copy pehli jagah normal operation ke hisse ki tarah banaayi ya distribute ki hi nahi gayi.',
      },
      {
        q: 'Why is rotating a secret genuinely difficult and often skipped without a centralized secrets manager, and how does a secrets manager make it practical?',
        qHi: 'Ek secrets manager ke bina ek secret rotate karna sach mein mushkil aur aksar skip kyun hoti hai, aur ek secrets manager ise practical kaise banaata hai?',
        a: 'Rotating a secret means changing its actual value to a new one — genuinely important because a value that never changes remains equally usable by anyone who has ever obtained a copy, for as long as that value continues to be accepted. Without a centralized secrets manager, every place holding a copy of the old value (every teammate\'s local .env file, every running server\'s configuration) needs to be individually tracked down and updated to the new value, and this has to happen in a carefully coordinated way — updating some copies before others risks a window where some servers are trying to authenticate with the now-invalid old value while others expect the new one, potentially causing real service disruption during the transition itself. Correctly identifying every single place holding a copy, in an environment where those copies were distributed informally (a chat message here, a wiki page there) is itself genuinely difficult to do with confidence, which is exactly why many teams end up simply avoiding rotation altogether, even for secrets they have specific reason to suspect may have been exposed. A secrets manager removes this coordination burden because there is only ever one authoritative value to update — the secrets manager itself changes it in its single central store, and every application instance, rather than holding a static copy, fetches "the current value" fresh (typically at startup, or via a periodic refresh), meaning the very next time any given instance asks, it automatically receives the newly rotated value with no human needing to individually track down and update anything.',
        aHi: 'Ek secret rotate karna matlab hai uski asli value ko ek nayi mein badalna — sach mein zaruri kyunki ek value jo kabhi nahi badalti kisi ke bhi liye barabar istemal-hone-laayak rehti hai jisne kabhi uski copy paayi ho, jab tak wo value accept hoti rehti hai. Ek kendriya secrets manager ke bina, har jagah jo purani value ki copy rakhti hai (har teammate ki local \`.env\` file, har chalte server ki configuration) ko individually dhoondh kar naye value tak update karna chahiye, aur ise dhyaan se coordinate kiye tarike se hona chahiye — kuch copies ko doosron se pehle update karna ek window ka khatra rakhta hai jahan kuch servers ab-invalid purani value se authenticate karne ki koshish kar rahe hain jabki doosre naye ki ummeed karte hain, mumkin taur par transition ke dauraan asli service disruption cause karte hue. Har akeli jagah sahi tarike se pehchaanna jo ek copy rakhti hai, ek environment mein jahan wo copies aanaupcharik taur par distribute hui thin (yahan ek chat message, wahan ek wiki page) khud sach mein confidence ke saath karna mushkil hai, bilkul isi wajah se kai teams bas rotation poori tarah avoid karke khatam hoti hain, un secrets ke liye bhi jinke expose hone ka unhe khaas wajah se shak hai. Ek secrets manager ye coordination bojh hataata hai kyunki hamesha sirf ek adhikrit value update karne ke liye hoti hai — secrets manager khud ise apne akele kendriya store mein badalta hai, aur har application instance, ek static copy rakhne ke bajaye, "abhi ki value" taaza fetch karta hai (aam taur par startup par, ya ek periodic refresh ke through), matlab agli hi baar jab koi bhi diya instance poochhta hai, ye apne aap naya rotate hua value paata hai kisi insaan ko kuch individually dhoondhne aur update karne ki zarurat bina.',
      },
    ],

    exercises: [
      {
        task: 'List every place a real secret in a small project you\'ve worked on (or a hypothetical one) has ever been shared — chat messages, emails, wiki pages, screen-shares. For each one, honestly assess whether you could confidently say that copy no longer exists or is no longer accessible.',
        taskHi: 'Har jagah list karo jahan ek asli secret ek chhote project mein jispe tumne kaam kiya hai (ya ek kalpaniya) kabhi share hui hai — chat messages, emails, wiki pages, screen-shares. Har ek ke liye, imaandaari se assess karo ki kya tum confidence se keh sakte ho wo copy ab maujood nahi ya access-hone-laayak nahi.',
        hint: 'This exercise is meant to be uncomfortable — most real teams, when they actually do this exercise honestly, discover at least one place they cannot confidently account for.',
        hintHi: 'Ye exercise asuvidhaajanak hone ke liye hai — zyaadatar asli teams, jab wo asal mein ye exercise imaandaari se karti hain, kam se kam ek jagah dhoondhti hain jiska wo confidence se hisaab nahi rakh sakti.',
      },
      {
        task: 'Set up a free-tier AWS Secrets Manager secret (or a local HashiCorp Vault dev server) holding a fake database URL, and write a small script that fetches it using the AWS SDK (or Vault\'s API) instead of reading it from a .env file.',
        taskHi: 'Ek free-tier AWS Secrets Manager secret set up karo (ya ek local HashiCorp Vault dev server) ek fake database URL rakhte hue, aur ek chhota script likho jo ise AWS SDK (ya Vault ke API) istemal karke fetch kare \`.env\` file se padhne ke bajaye.',
        hint: 'AWS offers a genuinely usable free tier for Secrets Manager for learning purposes — no real production secret needs to be involved to complete this exercise meaningfully.',
        hintHi: 'AWS Secrets Manager ke liye seekhne ke maqsad se ek sach mein istemal-hone-laayak free tier deta hai — is exercise ko maayne-rakhta taur par poora karne ke liye koi asli production secret shaamil hone ki zarurat nahi.',
      },
      {
        task: 'Simulate rotation: change the secret\'s value directly in the secrets manager (not in any local file), rerun your fetch script, and confirm it automatically receives the new value with no code change required.',
        taskHi: 'Rotation simulate karo: secret ki value seedha secrets manager mein badlo (kisi local file mein nahi), apna fetch script dobara chalaao, aur confirm karo ye apne aap naya value paata hai bina kisi code badlaav ke.',
        hint: 'Run the fetch script once before changing the value and once after, printing the fetched value each time, to directly see the difference without needing to touch the script itself.',
        hintHi: 'Value badalne se pehle ek baar aur baad mein ek baar fetch script chalaao, har baar fetch ki gayi value print karte hue, seedha farak dekhne ke liye script ko khud chhue bina.',
      },
    ],

    keyTakeaways: [
      'A gitignored .env file correctly keeps a secret out of source control, but says nothing about how many other places (chat messages, emails, wiki pages) a copy of that value ends up as a team grows and shares it informally.',
      'A centralized secrets manager stores every real secret in one authoritative place, and the application fetches the current value via an authenticated API call rather than reading a static, portable file.',
      'Access is granted and revoked per person or per service at the secrets manager level — revoking one identity\'s access immediately and verifiably prevents it from ever fetching that value again, with no need to hunt down other copies.',
      'Rotation (changing a secret\'s actual value) becomes practical with a secrets manager, since there is only one authoritative value to update — without one, rotation requires manually reaching every place holding an old copy, which many teams simply avoid.',
      'Least privilege — granting each service or person access only to the specific secrets it genuinely needs — is naturally supported by a secrets manager and awkward to maintain with one shared file containing everything.',
      'This does not replace the earlier .env lesson\'s guidance for solo/local development — it addresses the specific gap that opens up once a real secret is shared across multiple people or systems over time, particularly in production.',
    ],
    keyTakeawaysHi: [
      'Ek gitignored \`.env\` file sahi tarike se ek secret ko source control se bahar rakhti hai, par ye iske baare mein kuch nahi kehti ki jaise team badhti hai aur ise aanaupcharik taur par share karti hai kitni aur jagahon (chat messages, emails, wiki pages) mein us value ki copy pahunchti hai.',
      'Ek kendriya secrets manager har asli secret ko ek adhikrit jagah store karta hai, aur application ek authenticated API call se abhi ki value fetch karta hai ek static, portable file padhne ke bajaye.',
      'Access secrets manager star par prati insaan ya prati service diya aur revoke kiya jaata hai — ek pehchaan ki access revoke karna turant aur verify-hone-laayak taur par use us value ko dobara kabhi fetch karne se rokta hai, doosri copies dhoondhne ki zarurat bina.',
      'Rotation (ek secret ki asli value badalna) ek secrets manager ke saath practical ban jaata hai, kyunki sirf ek adhikrit value hoti hai update karne ke liye — ek ke bina, rotation ko har jagah tak haath se pahunchna chahiye jo ek purani copy rakhti hai, jise kai teams bas avoid karti hain.',
      'Least privilege — har service ya insaan ko sirf un khaas secrets tak access dena jinki use sach mein zarurat hai — ek secrets manager dwara naisargik taur par support hota hai aur sab kuch rakhti ek shared file ke saath maintain karna awkward hai.',
      'Ye pehle wale \`.env\` lesson ki guidance ko akele/local development ke liye replace nahi karta — ye us khaas kami ko sambhaalta hai jo khulti hai jab ek asli secret waqt ke saath kai logon ya systems ke aar-paar share hoti hai, khaas taur par production mein.',
    ],
  },
];
