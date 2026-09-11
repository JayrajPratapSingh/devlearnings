/**
 * Next.js Complete Course — Module 13: API & Auth Security Hardening, lessons 1-3.
 *
 * Lesson 1: Rate limiting — what it protects against, and where to put it.
 * Lesson 2: CORS done correctly, and IDOR.
 * Lesson 3: Session fixation and the OWASP Top 10 mapped onto Next.js.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-rate-limiting',
    title: 'Rate Limiting — What It Protects Against, and Where',
    titleHi: 'Rate Limiting — Ye Kya Protect Karta Hai, Aur Kahan',
    description:
      "Without a limit on how many requests one client can make in a given window, a login endpoint can be brute-forced, a search endpoint can be scraped at scale, and a free-tier API can be abused into a large hosting bill. Rate limiting bounds all of these, but where you put the limit — at the edge or at your origin — changes what it actually protects.",
    descriptionHi:
      'Bina kisi limit ke ki ek client ek given window mein kitni requests kar sakta hai, ek login endpoint ko brute-force kiya ja sakta hai, ek search endpoint ko scale pe scrape kiya ja sakta hai, aur ek free-tier API ko abuse karke ek bada hosting bill banaya ja sakta hai. Rate limiting in sab ko bound karta hai, par aap limit kahan lagate ho — edge pe ya apne origin pe — ye badalta hai ki ye actually kya protect karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A nightclub bouncer checking IDs at the door, versus a bartender who only notices someone's had too many drinks after they've already been served twenty rounds.** A bouncer at the door can turn someone away before they ever get inside, using minimal effort — checking an ID takes a few seconds, and a refused entry costs the club nothing. A bartender noticing a problem only after twenty drinks have already been poured has let the cost happen already; refusing the twenty-first drink doesn't undo the twenty already served. Rate limiting at the edge, before a request reaches your actual application, is the bouncer at the door — cheap, and it stops the cost before it's incurred. Rate limiting only deep inside your application, after expensive work has already run, is the bartender noticing too late.",
      hi: 'Ek nightclub bouncer jo darwaze pe IDs check karta hai, versus ek bartender jo kisi ke bahut zyada drinks pee lene ko sirf tab notice karta hai jab unhe already bees rounds serve ho chuke hon. Ek bouncer darwaze pe kisi ko andar aane se pehle hi mana kar sakta hai, minimal effort use karte hue — ek ID check karna kuch seconds leta hai, aur ek refused entry club ko kuch cost nahi karti. Ek bartender jo ek problem sirf tab notice karta hai jab bees drinks already daale ja chuke hain us cost ko already hone diya. Bees-ekiswan drink refuse karna pehle bees ko undo nahi karta. Edge pe rate limiting, aapki actual application tak request pahunchne se pehle, wo darwaze pe bouncer hai — cheap, aur ye cost ko incur hone se pehle rokta hai. Sirf aapki application ke andar deep rate limiting, expensive kaam already chalne ke baad, wo bartender hai jo bahut der se notice karta hai.',
    },

    simple: `**Three genuinely different problems rate limiting solves, each with a
different "correct" limit:**

\`\`\`
Login endpoint       -> stop brute-force password guessing
                        -> limit: a handful of ATTEMPTS PER ACCOUNT
                           per time window (e.g. 5 per 15 minutes)

Public search API    -> stop scraping / abuse at scale
                        -> limit: requests PER IP or PER API KEY
                           (e.g. 100 per minute)

Paid third-party API  -> stop a runaway bug or attack from generating
you call per-request     a massive, unexpected bill
                        -> limit: YOUR OWN app's total call volume to
                           that API, independent of any single user
\`\`\`

**A basic rate limiter, using a shared store (Redis) so the count works
correctly across multiple server instances:**

\`\`\`ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
});

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const { success } = await ratelimit.limit(\`login:\${email}\`); // keyed per account
  if (!success) {
    return { error: 'Too many attempts. Try again later.' };
  }
  // ... proceed with actual login logic
}
\`\`\`

**Why an in-memory counter (a plain JavaScript variable) doesn't work
correctly once an app runs on multiple server instances:** each
serverless function instance (Module 9's topic) would have its OWN
separate counter, meaning an attacker distributed across enough
instances could exceed the intended limit many times over, since no
single instance ever sees the full request count. A shared store like
Redis — the same infrastructure a connection pooler often uses — gives
every instance a consistent, correct view of how many requests have
actually occurred.

**Where to put the limit — edge versus origin:** limiting at the EDGE
(before a request reaches your application at all, often provided by
your hosting platform or a CDN) is cheaper and stops abuse before your
own server does any work at all. Limiting at your ORIGIN (inside your own
Route Handler or Server Action, as shown above) is necessary for
per-account or per-user logic that the edge often can't evaluate (since
it typically doesn't know which specific account a request is targeting
before your application code runs). Real production systems commonly use
both: a coarse edge limit for blunt abuse, and a precise origin limit for
account-specific rules like login attempts.`,

    simpleHi: `**Rate limiting jo teen genuinely alag problems solve karta hai, har ek
ki apni "correct" limit:**

\`\`\`
Login endpoint       -> brute-force password guessing rokna
                        -> limit: ek time window mein PER ACCOUNT
                           muththi bhar ATTEMPTS (jaise 15 minutes mein 5)

Public search API    -> scale pe scraping / abuse rokna
                        -> limit: PER IP ya PER API KEY requests
                           (jaise ek minute mein 100)

Paid third-party API  -> ek runaway bug ya attack ko ek massive,
jise aap per-request      unexpected bill generate karne se rokna
call karte ho            -> limit: aapke KHUD ke app ka us API tak total
                           call volume, kisi bhi single user se independent
\`\`\`

**Ek basic rate limiter, ek shared store (Redis) use karte hue taaki
count multiple server instances ke across correctly kaam kare:**

\`\`\`ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 15 minutes mein 5 requests
});

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const { success } = await ratelimit.limit(\`login:\${email}\`); // per account keyed
  if (!success) {
    return { error: 'Too many attempts. Try again later.' };
  }
  // ... actual login logic ke saath aage badho
}
\`\`\`

**Ek in-memory counter (ek plain JavaScript variable) ek baar app kai
server instances pe chalne ke baad correctly kyun kaam nahi karta:** har
serverless function instance (Module 9 ka topic) ka apna SEPARATE counter
hota, matlab hai ek attacker kaafi instances ke across distributed ho kar
intended limit ko kai guna exceed kar sakta hai, kyunki koi single
instance kabhi poora request count nahi dekhta. Redis jaisa ek shared
store — wahi infrastructure jo ek connection pooler aksar use karta hai —
har instance ko ek consistent, correct view deta hai ki actually kitni
requests hui hain.

**Limit kahan lagayein — edge versus origin:** EDGE pe limit karna (ek
request aapki application tak bilkul pahunchne se pehle, aksar aapke
hosting platform ya ek CDN dwara provide kiya jata hai) cheaper hai aur
abuse ko rokta hai aapke apne server ke koi bhi kaam karne se pehle.
Aapke ORIGIN pe limit karna (aapke apne Route Handler ya Server Action ke
andar, upar dikhaya gaya) per-account ya per-user logic ke liye zaroori
hai jise edge aksar evaluate nahi kar sakta (kyunki ye typically nahi
jaanta ki ek request kaunse specific account ko target kar raha hai
aapke application code chalne se pehle). Real production systems
commonly dono use karte hain: blunt abuse ke liye ek coarse edge limit,
aur account-specific rules jaise login attempts ke liye ek precise origin
limit.`,

    content: `## Why "add a rate limit" isn't a single, uniform fix

The right rate-limiting rule depends entirely on what you're protecting
against. A login endpoint's real threat is credential-guessing against a
SPECIFIC account, so the limit must be keyed per-account (or per-email),
not per-IP — an attacker using many different IP addresses against the
same account is still the same threat, and a per-IP-only limit wouldn't
catch it. A public search API's real threat is aggregate scraping/abuse,
so per-IP or per-API-key limiting is the right granularity. Conflating
these — applying one generic rate limit everywhere — either under-protects
the specific case (login) or over-restricts the general case (search).

## Why a shared store is not optional once an app runs on more than one
instance

A rate limiter's entire job is counting requests accurately over a time
window. If that count lives in a plain in-process variable, each
serverless function instance (or each server process, in a
multi-instance deployment) maintains its own independent count — an
attacker's requests get spread across instances, and no single instance
ever sees enough of them to trigger the limit. This is the same
underlying issue Module 9 covered for database connections: anything
that needs to be consistent ACROSS instances needs a shared store, not
local state.

## The economic argument for rate limiting third-party API calls

Beyond protecting against malicious abuse, rate limiting your OWN calls to
a metered third-party API (an AI provider billed per token, a geocoding
service billed per lookup) protects against a much more mundane risk: a
bug in your own code causing a retry loop, or a feature becoming
unexpectedly popular, generating far more calls than anticipated and a
correspondingly large bill. This is defensive engineering against your
own code's failure modes, not just against attackers.

## Edge versus origin rate limiting, more precisely

Edge-level limiting (via your hosting platform, a CDN, or middleware
running before your application logic) is cheap because it rejects
requests before they cost your application anything — no database
lookup, no business logic execution, nothing beyond checking a counter.
It's naturally suited to coarse, IP-based or path-based limits. Limits
that depend on WHO is making the request in a business-logic sense (this
specific user account, this specific API key tied to a specific
customer) generally need to happen after at least minimal
identification has occurred — inside your application's own code, even
if that's still relatively early (a Server Action, a Route Handler)
rather than deep inside business logic.`,

    contentHi: `## "Ek rate limit add karo" ek single, uniform fix kyun nahi hai

Sahi rate-limiting rule poori tarah is baat pe depend karta hai ki aap
kis cheez ke against protect kar rahe ho. Ek login endpoint ka real
threat ek SPECIFIC account ke against credential-guessing hai, isliye
limit per-account (ya per-email) keyed honi chahiye, per-IP nahi — ek
attacker jo wahi account ke against kai alag IP addresses use karta hai
abhi bhi wahi threat hai, aur ek sirf-per-IP limit ise catch nahi karegi.
Ek public search API ka real threat aggregate scraping/abuse hai, isliye
per-IP ya per-API-key limiting sahi granularity hai. Inhe confuse karna —
har jagah ek generic rate limit apply karna — ya to specific case
(login) ko under-protect karta hai ya general case (search) ko
over-restrict karta hai.

## Ek app ke ek se zyada instance pe chalne ke baad ek shared store kyun optional nahi hai

Ek rate limiter ka poora kaam requests ko ek time window ke over
accurately count karna hai. Agar wo count ek plain in-process variable
mein rehta hai, har serverless function instance (ya har server process,
ek multi-instance deployment mein) apna khud ka independent count
maintain karta hai — ek attacker ki requests instances ke across spread
ho jaati hain, aur koi single instance kabhi unme se itni nahi dekhta ki
limit trigger ho. Ye wahi underlying issue hai jo Module 9 database
connections ke liye cover kiya: koi bhi cheez jise instances ke ACROSS
consistent hona chahiye use ek shared store chahiye, local state nahi.

## Third-party API calls ko rate limit karne ka economic argument

Malicious abuse ke against protect karne se pare, ek metered third-party
API (ek AI provider jo per token bill karta hai, ek geocoding service jo
per lookup bill karta hai) ko aapki KHUD ki calls rate limit karna ek
kaafi zyada mundane risk ke against protect karta hai: aapke khud ke code
mein ek bug jo ek retry loop cause karta hai, ya ek feature jo
unexpectedly popular ban jata hai, anticipated se kaafi zyada calls
generate karte hue aur ek correspondingly bada bill. Ye aapke khud ke
code ke failure modes ke against defensive engineering hai, sirf
attackers ke against nahi.

## Edge versus origin rate limiting, zyada precisely

Edge-level limiting (aapke hosting platform, ek CDN, ya aapke application
logic se pehle chalne wale middleware ke through) cheap hai kyunki ye
requests ko unke aapki application ko kuch bhi cost karne se pehle
reject karta hai — koi database lookup nahi, koi business logic
execution nahi, ek counter check karne se pare kuch nahi. Ye naturally
coarse, IP-based ya path-based limits ke liye suited hai. Limits jo is
baat pe depend karte hain ki KAUN request kar raha hai ek business-logic
sense mein (ye specific user account, ye specific API key ek specific
customer se tied) generally at least minimal identification hone ke
baad honi chahiye — aapki application ke apne code ke andar, chahe ye
abhi bhi relatively early ho (ek Server Action, ek Route Handler) deep
business logic ke andar ke bajaye.`,

    examples: [
      {
        title: 'Per-account rate limiting for login, and a separate per-IP limit for a public API',
        titleHi: 'Login ke liye per-account rate limiting, aur ek public API ke liye ek separate per-IP limit',
        codeJs: `// app/actions.js — per-account limiting for login attempts
'use server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const loginLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per account per 15 min
});

export async function login(formData) {
  const email = formData.get('email');
  const { success } = await loginLimiter.limit(\`login:\${email}\`);
  if (!success) {
    return { error: 'Too many login attempts. Try again in a few minutes.' };
  }
  // ... verify credentials
}

// app/api/search/route.js — per-IP limiting for a public, unauthenticated API
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const searchLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per IP per minute
});

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await searchLimiter.limit(\`search:\${ip}\`);
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  // ... perform the search
}`,
        codeTs: `// app/actions.ts — per-account limiting for login attempts
'use server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const loginLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per account per 15 min
});

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const { success } = await loginLimiter.limit(\`login:\${email}\`);
  if (!success) {
    return { error: 'Too many login attempts. Try again in a few minutes.' };
  }
  // ... verify credentials
}

// app/api/search/route.ts — per-IP limiting for a public, unauthenticated API
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const searchLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per IP per minute
});

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await searchLimiter.limit(\`search:\${ip}\`);
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  // ... perform the search
}`,
        code: `const loginLimiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '15 m') });
const { success } = await loginLimiter.limit(\`login:\${email}\`);
if (!success) return { error: 'Too many login attempts.' };`,
        output:
          "An attacker trying many passwords against one specific account is blocked after 5 attempts within 15 minutes, regardless of how many different IP addresses they use. A separate, much higher per-IP limit on the search endpoint allows normal usage while still capping scraping-scale abuse.",
        explain:
          "The login limiter's key includes the email being targeted (login:${email}), not the requester's IP — this correctly catches an attacker distributing their guesses across many IPs against one account, which a per-IP-only limit would miss entirely.",
        explainHi:
          "Login limiter ki key us email ko include karti hai jise target kiya ja raha hai (login:${email}), requester ki IP nahi — ye correctly ek aise attacker ko catch karta hai jo apne guesses ko kai IPs ke across ek account ke against distribute karta hai, jise ek sirf-per-IP limit poori tarah miss kar dega.",
      },
    ],

    mistakes: [
      {
        wrong: `// An in-memory counter — breaks the instant the app runs on more than one instance
let loginAttempts = {}; // lives in ONE function instance's memory only

export async function login(formData) {
  const email = formData.get('email');
  loginAttempts[email] = (loginAttempts[email] || 0) + 1;
  if (loginAttempts[email] > 5) {
    return { error: 'Too many attempts' };
  }
  // On serverless, a different instance handling the next request has
  // its OWN separate loginAttempts object — the count never actually
  // accumulates correctly across an attacker's many requests.
}`,
        right: `// A shared store (Redis) — the count is correct regardless of which
// instance handles any given request
const { success } = await ratelimit.limit(\`login:\${email}\`); // Redis-backed
if (!success) {
  return { error: 'Too many attempts' };
}`,
        why: "An in-process variable is local to a single running instance. On serverless (or any multi-instance deployment), different requests may be handled by entirely different instances, each with its own separate copy of that variable — the actual total request count across all instances is never correctly tracked, letting an attacker's requests slip through under separate, uncoordinated counters.",
        whyHi:
          "Ek in-process variable ek single running instance tak local hai. Serverless pe (ya kisi bhi multi-instance deployment pe), alag requests poori tarah alag instances dwara handle ho sakti hain, har ek us variable ki apni khud ki separate copy ke saath — sab instances ke across actual total request count kabhi correctly track nahi hota, ek attacker ki requests ko separate, uncoordinated counters ke under slip through hone deta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS app typically applies a coarse, edge-level rate limit (via its CDN or hosting platform) to absorb blunt, high-volume abuse cheaply, AND a separate, precise per-account limit on its login endpoint using a Redis-backed limiter — the two operate at different layers, protecting against different threats.",
        hi: 'Ek production SaaS app typically ek coarse, edge-level rate limit apply karta hai (apne CDN ya hosting platform ke through) blunt, high-volume abuse ko cheaply absorb karne ke liye, AUR ek separate, precise per-account limit apne login endpoint pe ek Redis-backed limiter use karke — dono alag layers pe operate karte hain, alag threats ke against protect karte hain.',
      },
    ],

    interviewQA: [
      {
        q: "Why should a login endpoint's rate limit be keyed by account/email rather than by IP address?",
        qHi: 'Ek login endpoint ki rate limit account/email se keyed kyun honi chahiye IP address se nahi?',
        a: "Because the real threat is credential-guessing against a specific account, and a determined attacker can distribute their guesses across many different IP addresses. A per-IP-only limit would fail to catch this distributed attack, since no single IP would exceed the threshold — keying by account catches the actual threat regardless of how many IPs the attacker uses.",
        aHi: 'Kyunki real threat ek specific account ke against credential-guessing hai, aur ek determined attacker apne guesses ko kai alag IP addresses ke across distribute kar sakta hai. Ek sirf-per-IP limit is distributed attack ko catch karne mein fail hogi, kyunki koi single IP threshold exceed nahi karegi — account se keying actual threat ko catch karta hai chahe attacker kitni bhi IPs use kare.',
      },
      {
        q: 'Why does an in-memory rate limit counter fail on a serverless deployment?',
        qHi: 'Ek in-memory rate limit counter ek serverless deployment pe kyun fail hota hai?',
        a: "Serverless platforms can route different requests to entirely different function instances, each with its own separate memory. An in-process counter variable exists only within one instance, so an attacker's requests spread across many instances never accumulate into a single count that could trigger the limit.",
        aHi: 'Serverless platforms alag requests ko poori tarah alag function instances tak route kar sakte hain, har ek apni khud ki separate memory ke saath. Ek in-process counter variable sirf ek instance ke andar exist karta hai, isliye ek attacker ki requests jo kai instances ke across spread hoti hain kabhi ek single count mein accumulate nahi hoti jo limit trigger kar sake.',
      },
    ],

    exercises: [
      {
        task: "A Next.js app has three endpoints needing rate limits: a login form, a public 'contact us' form (to prevent spam), and a Server Action that calls a paid, per-request AI API. For each, decide the appropriate key (per-account, per-IP, or app-wide) and justify it.",
        taskHi: 'Ek Next.js app mein teen endpoints hain jinhe rate limits chahiye: ek login form, ek public \'contact us\' form (spam rokne ke liye), aur ek Server Action jo ek paid, per-request AI API call karta hai. Har ek ke liye, appropriate key decide karo (per-account, per-IP, ya app-wide) aur ise justify karo.',
        hint: "Think about what the real threat is in each case, and whether an attacker could route around a per-IP limit specifically for that threat.",
        hintHi: 'Socho ki har case mein real threat kya hai, aur kya ek attacker specifically us threat ke liye ek per-IP limit ke around route kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "The correct rate-limiting key (per-account, per-IP, per-API-key, or app-wide) depends on the actual threat being protected against — a login endpoint needs per-account limiting since an attacker can distribute guesses across many IPs.",
      'A rate limit\'s count must live in a shared store (like Redis) rather than in-process memory, since serverless and multi-instance deployments can spread an attacker\'s requests across many separate instances with independent local state.',
      'Rate limiting a paid third-party API call protects against your own code\'s failure modes (bugs causing retry loops, unexpected popularity) as much as against malicious external abuse.',
      "Edge-level rate limiting is cheap and stops coarse abuse before it costs your application anything; origin-level (in-application) rate limiting is necessary for account- or user-specific rules that require identifying the requester first.",
    ],
    keyTakeawaysHi: [
      'Correct rate-limiting key (per-account, per-IP, per-API-key, ya app-wide) actual threat pe depend karta hai jiske against protect kiya ja raha hai — ek login endpoint ko per-account limiting chahiye kyunki ek attacker guesses ko kai IPs ke across distribute kar sakta hai.',
      'Ek rate limit ka count ek shared store (jaise Redis) mein rehna chahiye in-process memory ke bajaye, kyunki serverless aur multi-instance deployments ek attacker ki requests ko kai separate instances ke across independent local state ke saath spread kar sakte hain.',
      'Ek paid third-party API call ko rate limit karna aapke khud ke code ke failure modes ke against protect karta hai (bugs jo retry loops cause karte hain, unexpected popularity) jitna malicious external abuse ke against.',
      'Edge-level rate limiting cheap hai aur coarse abuse ko aapki application ko kuch bhi cost karne se pehle rokta hai; origin-level (in-application) rate limiting account- ya user-specific rules ke liye zaroori hai jinhe pehle requester ko identify karna chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-cors-idor',
    title: 'CORS Done Correctly, and IDOR',
    titleHi: 'CORS Correctly Kiya Gaya, Aur IDOR',
    description:
      "CORS is a browser-enforced permission slip your API grants to other origins, and getting it wrong in either direction is a real problem — too permissive leaks data to sites that shouldn't have it, too restrictive breaks legitimate integrations. IDOR is a separate, often more damaging mistake: trusting an id in a request without checking the requester actually owns that resource.",
    descriptionHi:
      'CORS ek browser-enforced permission slip hai jo aapka API doosre origins ko deta hai, aur ise kisi bhi direction mein galat karna ek real problem hai — bahut permissive data un sites ko leak karta hai jinhe nahi hona chahiye, bahut restrictive legitimate integrations tod deta hai. IDOR ek separate, aksar zyada damaging mistake hai: ek request mein ek id ko trust karna bina check kiye ki requester actually us resource ka owner hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A hotel's front desk deciding which OTHER hotels' guests are allowed to charge things to a room, versus a hotel that hands out room access based solely on someone reciting a room number out loud.** CORS is like a hotel maintaining a list of partner hotels whose guests are allowed certain cross-hotel privileges — the browser (acting like hotel security) checks that list before allowing a request from a different origin, and getting that list wrong either lets in partners who shouldn't have access or blocks legitimate ones. IDOR is a completely different failure: a front desk that hands over a room's contents to anyone who simply says 'I'm room 402' out loud, without ever checking their key card actually matches. The fix for IDOR has nothing to do with the partner-hotel list — it's about verifying identity against the specific thing being accessed, every single time.",
      hi: 'Ek hotel ka front desk decide kar raha hai ki kaunse DOOSRE hotels ke guests ek room pe cheezein charge karne ke liye allowed hain, versus ek hotel jo room access sirf iske basis pe deta hai ki koi ek room number zor se bol de. CORS ek hotel jaisa hai jo partner hotels ki ek list maintain karta hai jinke guests ko kuch cross-hotel privileges allowed hain — browser (hotel security ki tarah act karte hue) us list ko check karta hai ek alag origin se ek request allow karne se pehle, aur us list ko galat karna ya to un partners ko andar aane deta hai jinhe access nahi hona chahiye ya legitimate wale ko block kar deta hai. IDOR ek poori tarah alag failure hai: ek front desk jo ek room ka contents kisi ko bhi de deta hai jo simply zor se \'main room 402 hoon\' bol de, bina kabhi unka key card actually match karta hai check kiye. IDOR ka fix partner-hotel list se kuch lena-dena nahi rakhta — ye identity ko us specific cheez ke against verify karne ke baare mein hai jise access kiya ja raha hai, har single baar.',
    },

    simple: `**CORS: a browser-enforced rule about which OTHER origins may read a
response your API sends back — it does not protect your server from
receiving a request at all, only whether the BROWSER lets the calling
page's JavaScript read the result:**

\`\`\`ts
// app/api/public-data/route.ts
export async function GET() {
  const data = await getPublicData();
  return Response.json(data, {
    headers: {
      // Only requests originating from THIS specific origin may read the response
      'Access-Control-Allow-Origin': 'https://trusted-partner.com',
    },
  });
}
\`\`\`

**Getting CORS wrong in the permissive direction — a common, dangerous
shortcut:**

\`\`\`ts
// DANGEROUS: allows ANY website's JavaScript to read this response
headers: { 'Access-Control-Allow-Origin': '*' }
// Fine for genuinely public data with no user-specific content.
// A serious problem if this endpoint ever returns anything tied to
// the logged-in user's identity or private data.
\`\`\`

**IDOR (Insecure Direct Object Reference): trusting an id in a request
without verifying the requester actually owns or is authorized to access
that specific resource:**

\`\`\`ts
// VULNERABLE: returns whatever invoice matches the id — no ownership check
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  return Response.json(invoice);
  // Any logged-in user can view ANY invoice by guessing or incrementing
  // ids in the URL — /api/invoices/1042, /api/invoices/1043, etc.
}

// FIXED: verifies the invoice actually belongs to the requesting user
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  if (!invoice || invoice.userId !== session.userId) {
    return new Response('Not found', { status: 404 }); // don't reveal it exists
  }
  return Response.json(invoice);
}
\`\`\`

**The key distinction between these two topics:** CORS is about which
ORIGINS (websites) may read a response — a browser-level, cross-site
concern. IDOR is about whether the SPECIFIC USER making a request, from
any origin, actually has permission to access the SPECIFIC RESOURCE being
requested — an authorization concern, entirely independent of CORS.
Getting CORS right does nothing to prevent IDOR, and fixing IDOR does
nothing about CORS — they're unrelated failure modes that happen to both
live in the "API security" category.`,

    simpleHi: `**CORS: ek browser-enforced rule ki kaunse DOOSRE origins ek response
padh sakte hain jo aapka API wapas bhejta hai — ye aapke server ko ek
request receive karne se bilkul nahi rokta, sirf ye ki kya BROWSER calling
page ki JavaScript ko result padhne deta hai:**

\`\`\`ts
// app/api/public-data/route.ts
export async function GET() {
  const data = await getPublicData();
  return Response.json(data, {
    headers: {
      // Sirf IS specific origin se originate hone wali requests response padh sakti hain
      'Access-Control-Allow-Origin': 'https://trusted-partner.com',
    },
  });
}
\`\`\`

**CORS ko permissive direction mein galat karna — ek common, dangerous
shortcut:**

\`\`\`ts
// DANGEROUS: kisi bhi website ki JavaScript ko ye response padhne deta hai
headers: { 'Access-Control-Allow-Origin': '*' }
// Genuinely public data ke liye theek hai jisme koi user-specific content nahi.
// Ek serious problem hai agar ye endpoint kabhi bhi kuch return kare jo
// logged-in user ki identity ya private data se tied ho.
\`\`\`

**IDOR (Insecure Direct Object Reference): ek request mein ek id ko trust
karna bina verify kiye ki requester actually us specific resource ka
owner hai ya use access karne ke liye authorized hai:**

\`\`\`ts
// VULNERABLE: jo bhi invoice id se match karta hai use return karta hai — koi ownership check nahi
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  return Response.json(invoice);
  // Koi bhi logged-in user KOI BHI invoice dekh sakta hai URL mein ids
  // guess ya increment karke — /api/invoices/1042, /api/invoices/1043, etc.
}

// FIXED: verify karta hai ki invoice actually requesting user ka hai
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const invoice = await db.invoice.findUnique({ where: { id: params.id } });
  if (!invoice || invoice.userId !== session.userId) {
    return new Response('Not found', { status: 404 }); // reveal mat karo ki ye exist karta hai
  }
  return Response.json(invoice);
}
\`\`\`

**In do topics ke beech key distinction:** CORS iske baare mein hai ki
kaunse ORIGINS (websites) ek response padh sakte hain — ek browser-level,
cross-site concern. IDOR iske baare mein hai ki kya SPECIFIC USER jo
request kar raha hai, kisi bhi origin se, actually us SPECIFIC RESOURCE ko
access karne ki permission rakhta hai jo request kiya ja raha hai — ek
authorization concern, CORS se poori tarah independent. CORS ko sahi
karna IDOR ko prevent karne mein kuch nahi karta, aur IDOR ko fix karna
CORS ke baare mein kuch nahi karta — wo unrelated failure modes hain jo
dono "API security" category mein rehte hain.`,

    content: `## What CORS actually is, mechanically

CORS (Cross-Origin Resource Sharing) is a BROWSER-enforced restriction —
by default, a browser blocks a page's JavaScript from reading the
response of a request it made to a different origin, unless that
response explicitly includes headers granting permission
(\`Access-Control-Allow-Origin\` and related headers). Crucially, this
restriction applies to what the browser lets the calling PAGE's script
read — the actual HTTP request still reaches your server and your server
still does whatever work it would normally do; CORS doesn't stop the
request from arriving, it only controls whether the browser-side
JavaScript is allowed to see the result. This is why CORS is not a
security boundary against your server RECEIVING unwanted requests — a
tool like curl, or a server-to-server request, is entirely unaffected by
CORS, since CORS is a browser-specific enforcement mechanism.

## Why \`Access-Control-Allow-Origin: *\` is dangerous specifically for
user-specific data

A wildcard origin means ANY website's JavaScript can read this endpoint's
response if it can get a visitor's browser to make the request — for
genuinely public, non-personalized data, this is harmless. For anything
that varies based on WHO is logged in (a user's own profile, their
private messages), a wildcard means any malicious site the victim happens
to visit (while also logged into your site) could read their private data
via a cross-origin request. The fix is scoping \`Access-Control-Allow-Origin\`
to only the specific origins that genuinely need access, never a blanket
wildcard for anything user-specific.

## Why IDOR is often more damaging in practice than a CORS
misconfiguration

IDOR requires no cross-origin trickery at all — the attacker is simply an
authenticated user of your OWN application, making an ordinary request to
your OWN API, with a resource id they changed. It's often trivially
discoverable (sequential or guessable ids in a URL) and directly exposes
other users' actual private data, rather than requiring a victim to visit
a malicious page first. This is precisely why IDOR is a perennial entry on
security vulnerability rankings — it's simple to introduce (forgetting one
ownership check) and simple to exploit (changing one number in a URL).

## The general fix pattern for IDOR

Every endpoint that accepts a resource identifier from the request (a URL
param, a request body field) and looks that resource up must independently
verify the CURRENT authenticated user is actually authorized to access
THAT SPECIFIC resource — not just that a resource with that id exists.
This check belongs in the same place authorization checks generally
belong (Module 8's lesson on middleware versus fine-grained checks): as
close as possible to the actual data access, using the real, verified
identity of the current session, never trusting a client-supplied id as
implicitly validating ownership.`,

    contentHi: `## CORS actually mechanically kya hai

CORS (Cross-Origin Resource Sharing) ek BROWSER-enforced restriction hai
— default se, ek browser ek page ki JavaScript ko ek doosre origin ko ki
gayi request ke response ko padhne se block karta hai, jab tak wo
response explicitly permission grant karne wale headers include na kare
(\`Access-Control-Allow-Origin\` aur related headers). Crucially, ye
restriction is baat pe apply hoti hai ki browser calling PAGE ke script
ko kya padhne deta hai — actual HTTP request abhi bhi aapke server tak
pahunchti hai aur aapka server abhi bhi wahi kaam karta hai jo ye normally
karta — CORS request ko pahunchne se nahi rokta, ye sirf control karta hai
ki kya browser-side JavaScript ko result dekhne ki permission hai. Yahi
wajah hai ki CORS aapke server ko unwanted requests RECEIVE karne ke
against ek security boundary nahi hai — curl jaisa ek tool, ya ek
server-to-server request, CORS se poori tarah unaffected hai, kyunki CORS
ek browser-specific enforcement mechanism hai.

## \`Access-Control-Allow-Origin: *\` specifically user-specific data ke liye dangerous kyun hai

Ek wildcard origin ka matlab hai KISI BHI website ki JavaScript is
endpoint ke response ko padh sakti hai agar ye ek visitor ke browser ko
request banane pe convince kar sake — genuinely public, non-personalized
data ke liye, ye harmless hai. Kisi bhi aisi cheez ke liye jo is baat pe
vary karti hai ki KAUN logged in hai (ek user ka apna profile, unke
private messages), ek wildcard ka matlab hai koi bhi malicious site jise
victim visit karta hai (jabki wo aapki site pe bhi logged in hai) unka
private data ek cross-origin request ke through padh sakti hai. Fix
\`Access-Control-Allow-Origin\` ko sirf un specific origins tak scope karna
hai jinhe genuinely access chahiye, kabhi kisi bhi user-specific cheez ke
liye ek blanket wildcard nahi.

## IDOR practically ek CORS misconfiguration se aksar zyada damaging kyun hai

IDOR ko bilkul koi cross-origin trickery nahi chahiye — attacker simply
aapki KHUD ki application ka ek authenticated user hai, aapke KHUD ke API
ko ek ordinary request bana raha hai, ek resource id ke saath jise usne
badla. Ye aksar trivially discoverable hai (ek URL mein sequential ya
guessable ids) aur directly doosre users ka actual private data expose
karta hai, ek victim ko pehle ek malicious page visit karne ki zaroorat
ke bina. Yahi precisely wajah hai ki IDOR security vulnerability rankings
pe ek perennial entry hai — ye introduce karna simple hai (ek ownership
check bhoolna) aur exploit karna simple hai (ek URL mein ek number badalna).

## IDOR ke liye general fix pattern

Har endpoint jo request se ek resource identifier accept karta hai (ek
URL param, ek request body field) aur us resource ko lookup karta hai use
independently verify karna chahiye ki CURRENT authenticated user actually
US SPECIFIC resource ko access karne ke liye authorized hai — sirf ye
nahi ki us id ke saath ek resource exist karta hai. Ye check wahin belong
karta hai jahan authorization checks generally belong karte hain (Module
8 ka lesson middleware versus fine-grained checks pe): actual data access
ke jitna close ho sake, current session ki real, verified identity use
karte hue, kabhi ek client-supplied id ko implicitly ownership validate
karta hue trust na karte hue.`,

    examples: [
      {
        title: 'A correctly scoped CORS header, and a fixed IDOR vulnerability',
        titleHi: 'Ek correctly scoped CORS header, aur ek fixed IDOR vulnerability',
        codeJs: `// app/api/widget-data/route.js — a public, non-personalized endpoint
// used by a specific known partner's embedded widget
export async function GET() {
  const data = await getPublicWidgetData(); // no user-specific content at all
  return Response.json(data, {
    headers: { 'Access-Control-Allow-Origin': 'https://partner-site.com' },
  });
}

// app/api/orders/[id]/route.js — IDOR fixed with an ownership check
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    // Same response whether the order doesn't exist OR belongs to someone
    // else — doesn't reveal which case it is
    return new Response('Not found', { status: 404 });
  }
  return Response.json(order);
}`,
        codeTs: `// app/api/widget-data/route.ts — a public, non-personalized endpoint
// used by a specific known partner's embedded widget
export async function GET() {
  const data = await getPublicWidgetData(); // no user-specific content at all
  return Response.json(data, {
    headers: { 'Access-Control-Allow-Origin': 'https://partner-site.com' },
  });
}

// app/api/orders/[id]/route.ts — IDOR fixed with an ownership check
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    // Same response whether the order doesn't exist OR belongs to someone
    // else — doesn't reveal which case it is
    return new Response('Not found', { status: 404 });
  }
  return Response.json(order);
}`,
        code: `const order = await db.order.findUnique({ where: { id: params.id } });
if (!order || order.userId !== session.userId) {
  return new Response('Not found', { status: 404 });
}
return Response.json(order);`,
        output:
          "The widget-data endpoint's response is only readable by JavaScript running on partner-site.com — any other origin attempting to read it via fetch is blocked by the browser. The orders endpoint returns a 404 both when an order genuinely doesn't exist and when it belongs to a different user, revealing nothing about other users' order ids to an attacker probing sequential ids.",
        explain:
          "Returning an identical 404 for 'doesn't exist' and 'exists but isn't yours' (rather than a distinguishing 403) avoids leaking which ids correspond to real orders at all — this mirrors the user-enumeration principle from Module 8's authentication lesson, applied here to resource ids instead of email addresses.",
        explainHi:
          "'Exist nahi karta' aur 'exist karta hai par tumhara nahi hai' ke liye ek identical 404 return karna (ek distinguishing 403 ke bajaye) ye leak karne se bachta hai ki kaunse ids real orders se correspond karte hain bilkul — ye Module 8 ke authentication lesson se user-enumeration principle ko mirror karta hai, yahan email addresses ke bajaye resource ids pe applied.",
      },
    ],

    mistakes: [
      {
        wrong: `// IDOR: trusting the id without verifying the requester owns the resource
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // Confirms the user is LOGGED IN, but never checks they own THIS order
  const order = await db.order.findUnique({ where: { id: params.id } });
  return Response.json(order); // returns ANY order, to ANY logged-in user
}`,
        right: `// Verifying ownership of the specific resource, not just authentication
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(order);
}`,
        why: "Checking that a session exists confirms authentication (someone is logged in) but says nothing about authorization for this specific resource. Without comparing order.userId to session.userId, any authenticated user can view any other user's order simply by changing the id in the URL.",
        whyHi:
          "Ye check karna ki ek session exist karta hai authentication confirm karta hai (koi logged in hai) par is specific resource ke liye authorization ke baare mein kuch nahi kehta. order.userId ko session.userId se compare kiye bina, koi bhi authenticated user kisi bhi doosre user ka order dekh sakta hai simply URL mein id badal kar.",
      },
    ],

    realWorld: [
      {
        en: "A real, widely-reported IDOR vulnerability class involves invoice or document download URLs like /invoices/1042.pdf — if the server only checks that the requester is logged in (not that they specifically own invoice 1042), simply incrementing the number in the URL lets any customer download every other customer's invoices.",
        hi: 'Ek real, widely-reported IDOR vulnerability class invoice ya document download URLs involve karta hai jaise /invoices/1042.pdf — agar server sirf check karta hai ki requester logged in hai (ye nahi ki wo specifically invoice 1042 ka owner hai), simply URL mein number increment karna kisi bhi customer ko har doosre customer ke invoices download karne deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Does CORS protect a server from receiving unwanted or malicious requests?',
        qHi: 'Kya CORS ek server ko unwanted ya malicious requests receive karne se protect karta hai?',
        a: "No. CORS is enforced by the BROWSER, controlling whether the calling page's JavaScript is allowed to read the response — the actual HTTP request still reaches the server regardless. Tools like curl, or server-to-server requests, are entirely unaffected by CORS since it's a browser-specific mechanism.",
        aHi: 'Nahi. CORS BROWSER dwara enforce hota hai, control karte hue ki kya calling page ki JavaScript ko response padhne ki permission hai — actual HTTP request abhi bhi server tak pahunchti hai chahe kuch bhi ho. curl jaise tools, ya server-to-server requests, CORS se poori tarah unaffected hain kyunki ye ek browser-specific mechanism hai.',
      },
      {
        q: 'What is IDOR, and why is checking authentication alone insufficient to prevent it?',
        qHi: 'IDOR kya hai, aur akela authentication check karna ise prevent karne ke liye insufficient kyun hai?',
        a: "IDOR (Insecure Direct Object Reference) is trusting a resource id from a request without verifying the current user is actually authorized to access that specific resource. Checking authentication only confirms someone is logged in — it says nothing about whether THIS user owns or has permission for THIS particular resource, which requires an explicit ownership/authorization check.",
        aHi: 'IDOR (Insecure Direct Object Reference) ek request se ek resource id ko trust karna hai bina verify kiye ki current user actually us specific resource ko access karne ke liye authorized hai. Authentication check karna sirf confirm karta hai ki koi logged in hai — ye kuch nahi kehta ki kya IS user ke paas IS particular resource ke liye ownership ya permission hai, jise ek explicit ownership/authorization check chahiye.',
      },
    ],

    exercises: [
      {
        task: "An API endpoint GET /api/users/[id]/settings returns a user's account settings after checking that a valid session exists. Identify the specific missing check that makes this IDOR-vulnerable, and write the fix.",
        taskHi: 'Ek API endpoint GET /api/users/[id]/settings ek user ki account settings return karta hai ek valid session exist karne ka check karne ke baad. Us specific missing check ko identify karo jo ise IDOR-vulnerable banata hai, aur fix likho.',
        hint: "Confirming a session exists proves authentication — what additional comparison is needed to prove this specific session is authorized for this specific [id]?",
        hintHi: 'Ek session exist karta hai confirm karna authentication prove karta hai — is specific [id] ke liye is specific session ko authorized prove karne ke liye kaunsa additional comparison chahiye?',
      },
    ],

    keyTakeaways: [
      "CORS is a browser-enforced restriction on which origins' JavaScript may read a response — it does not stop a server from receiving a request at all, and tools outside a browser (curl, server-to-server calls) are entirely unaffected by it.",
      "Access-Control-Allow-Origin: * is fine for genuinely public, non-personalized data but dangerous for any endpoint returning user-specific content, since it lets any website's script read the response.",
      "IDOR is trusting a resource id from a request without verifying the current authenticated user actually owns or is authorized to access that specific resource — checking authentication alone (is someone logged in) is not the same as checking authorization (is this specific user allowed here).",
      'CORS and IDOR are unrelated failure modes — fixing one does nothing for the other, and both need to be considered independently when securing an API.',
    ],
    keyTakeawaysHi: [
      'CORS ek browser-enforced restriction hai ki kaunse origins ki JavaScript ek response padh sakti hai — ye ek server ko ek request receive karne se bilkul nahi rokta, aur browser ke bahar ke tools (curl, server-to-server calls) isse poori tarah unaffected hain.',
      'Access-Control-Allow-Origin: * genuinely public, non-personalized data ke liye theek hai par kisi bhi endpoint ke liye dangerous hai jo user-specific content return karta hai, kyunki ye kisi bhi website ki script ko response padhne deta hai.',
      'IDOR ek request se ek resource id ko trust karna hai bina verify kiye ki current authenticated user actually us specific resource ka owner hai ya use access karne ke liye authorized hai — akela authentication check karna (kya koi logged in hai) authorization check karne jaisa nahi hai (kya ye specific user yahan allowed hai).',
      'CORS aur IDOR unrelated failure modes hain — ek ko fix karna doosre ke liye kuch nahi karta, aur dono ko ek API secure karte waqt independently consider karna chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-session-fixation-owasp-top-10',
    title: 'Session Fixation & the OWASP Top 10 on Next.js',
    titleHi: 'Session Fixation Aur Next.js Pe OWASP Top 10',
    description:
      "Session fixation is a subtle attack where a victim is tricked into using a session id the attacker already knows, before the victim even logs in. Mapping the OWASP Top 10 — the industry's standard list of the most critical web risks — onto concrete Next.js mechanisms closes the loop on this module's security coverage.",
    descriptionHi:
      'Session fixation ek subtle attack hai jahan ek victim ko trick kiya jata hai ek session id use karne ke liye jo attacker already jaanta hai, victim ke login karne se pehle hi. OWASP Top 10 ko — industry ki standard list sabse critical web risks ki — concrete Next.js mechanisms pe map karna is module ki security coverage ko close karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A hotel that lets a guest specify their OWN room key number before checking in, rather than issuing a fresh one at check-in.** If a hotel let anyone hand over a room key labeled '204' and simply activate that exact key for whoever checks into room 204 next, an attacker could pre-make a key labeled '204', wait for a victim to book that room, and use their pre-made key the moment the victim checks in — the key was 'fixed' before the legitimate guest ever arrived. A well-run hotel always issues a brand-new key at the moment of check-in, discarding any previous key that number was associated with. Session fixation is exactly the pre-made key: an attacker gets a victim to authenticate using a session identifier the attacker already possesses, rather than a fresh one generated at the moment of actual login.",
      hi: "Ek hotel jo ek guest ko apna KHUD ka room key number specify karne deta hai check in karne se pehle, ek fresh wala check-in pe issue karne ke bajaye. Agar ek hotel kisi ko bhi ek room key '204' label kiya hua hand over karne deta aur simply us exact key ko activate kar deta jo bhi agla 204 room mein check in kare, ek attacker ek key '204' label ki hui pre-make kar sakta tha, ek victim ke us room ko book karne ka wait karta, aur apni pre-made key use karta jis moment victim check in karta — key legitimate guest ke kabhi arrive karne se pehle hi 'fixed' thi. Ek well-run hotel hamesha check-in ke moment pe ek bilkul nayi key issue karta hai, kisi bhi previous key ko discard karte hue jo us number se associated thi. Session fixation exactly wahi pre-made key hai: ek attacker ek victim ko ek session identifier use karke authenticate karwata hai jo attacker already possess karta hai, ek fresh wale ke bajaye jo actual login ke moment pe generate hota hai.",
    },

    simple: `**The attack: an attacker sets a session id in the victim's browser
BEFORE the victim logs in, then uses that same id after the victim
authenticates:**

\`\`\`
1. Attacker visits the site, gets (or crafts) a session id: "abc123"
2. Attacker tricks the victim into using that SAME session id (e.g. via
   a link like https://site.com/?sessionid=abc123, if the app naively
   accepts a session id from a URL parameter)
3. Victim logs in — if the app keeps using "abc123" as the session id
   rather than issuing a NEW one at login, the victim is now
   authenticated under session "abc123"
4. Attacker, who already knows "abc123", is now ALSO authenticated as
   the victim — no password or credential theft required at all
\`\`\`

**The fix: always issue a brand-new session id at the moment of
successful login, discarding whatever session id (if any) existed
before:**

\`\`\`ts
export async function login(formData: FormData) {
  const user = await verifyCredentials(formData);
  if (!user) return { error: 'Invalid credentials' };

  // Regenerate the session id HERE, at the moment of authentication —
  // never reuse whatever session id the browser happened to arrive with
  const newSessionId = crypto.randomUUID();
  await db.session.create({ data: { id: newSessionId, userId: user.id } });
  cookies().set('session', newSessionId, { httpOnly: true, secure: true });
}
\`\`\`

**Well-established auth libraries (Auth.js/NextAuth) handle this
correctly by default** — this is one more reason Module 8 recommended
reaching for an established library rather than hand-rolling session
logic; session fixation is exactly the kind of subtle, easy-to-miss detail
a mature library already accounts for.

**The OWASP Top 10, mapped onto what this course has already covered:**

\`\`\`
A01 Broken Access Control       -> Module 8's RBAC, this module's IDOR
A02 Cryptographic Failures      -> Module 8's bcrypt/hashing lesson
A03 Injection                   -> Prisma's parameterized queries (avoided
                                    by default, unlike hand-written SQL)
A04 Insecure Design              -> this course's "ask what could go wrong"
                                    approach throughout, not a single fix
A05 Security Misconfiguration    -> this lesson's headers/CSP, env var hygiene
A06 Vulnerable Components         -> Module 12's dependency auditing
A07 Auth Failures                 -> Module 8 entirely, plus session fixation
A08 Data Integrity Failures       -> Module 10's webhook signature verification
A09 Logging/Monitoring Failures   -> Module 19 (Observability), later in the course
A10 Server-Side Request Forgery   -> validating any server-side fetch to a
                                    user-supplied URL before making the request
\`\`\`

**Why this mapping matters as a closing exercise:** the OWASP Top 10 isn't
a checklist to memorize in the abstract — it's a description of where real
vulnerabilities cluster across real applications. Seeing that this
course's Modules 8, 10, and 12-13 already map onto 7 of the 10 categories
is confirmation that security isn't a separate module bolted on at the
end — it's been the throughline of every feature this course has built.`,

    simpleHi: `**Attack: ek attacker victim ke browser mein ek session id set karta
hai victim ke login karne se PEHLE, phir wahi id use karta hai victim ke
authenticate hone ke baad:**

\`\`\`
1. Attacker site visit karta hai, ek session id paata hai (ya craft
   karta hai): "abc123"
2. Attacker victim ko trick karta hai WAHI session id use karne ke liye
   (jaise ek link jaisa https://site.com/?sessionid=abc123, agar app
   naively ek URL parameter se ek session id accept karta hai)
3. Victim login karta hai — agar app "abc123" ko session id ki tarah use
   karte rehta hai ek NAYA issue karne ke bajaye login pe, victim ab
   session "abc123" ke under authenticated hai
4. Attacker, jo already "abc123" jaanta hai, ab ALSO victim ki tarah
   authenticated hai — koi password ya credential theft bilkul zaroori
   nahi
\`\`\`

**Fix: hamesha successful login ke moment pe ek bilkul naya session id
issue karo, jo bhi session id (agar koi hai) pehle exist karti thi use
discard karte hue:**

\`\`\`ts
export async function login(formData: FormData) {
  const user = await verifyCredentials(formData);
  if (!user) return { error: 'Invalid credentials' };

  // Session id ko YAHAN regenerate karo, authentication ke moment pe —
  // jo bhi session id browser ke saath aayi thi use kabhi reuse mat karo
  const newSessionId = crypto.randomUUID();
  await db.session.create({ data: { id: newSessionId, userId: user.id } });
  cookies().set('session', newSessionId, { httpOnly: true, secure: true });
}
\`\`\`

**Well-established auth libraries (Auth.js/NextAuth) ise default se
correctly handle karte hain** — ye ek aur wajah hai ki Module 8 ne ek
established library reach karne ki recommend ki hand-rolling session
logic ke bajaye; session fixation exactly wahi subtle, easy-to-miss
detail hai jise ek mature library already account karti hai.

**OWASP Top 10, is course ne pehle se jo cover kiya hai uspe mapped:**

\`\`\`
A01 Broken Access Control       -> Module 8 ka RBAC, is module ka IDOR
A02 Cryptographic Failures      -> Module 8 ka bcrypt/hashing lesson
A03 Injection                   -> Prisma ki parameterized queries (default
                                    se avoided, hand-written SQL ke unlike)
A04 Insecure Design              -> is course ka "kya galat ho sakta hai
                                    poochho" approach throughout, ek single fix nahi
A05 Security Misconfiguration    -> is lesson ke headers/CSP, env var hygiene
A06 Vulnerable Components         -> Module 12 ka dependency auditing
A07 Auth Failures                 -> Module 8 poori tarah, plus session fixation
A08 Data Integrity Failures       -> Module 10 ka webhook signature verification
A09 Logging/Monitoring Failures   -> Module 19 (Observability), course mein baad mein
A10 Server-Side Request Forgery   -> koi bhi server-side fetch validate karna
                                    ek user-supplied URL ko request karne se pehle
\`\`\`

**Ye mapping ek closing exercise ki tarah kyun matter karta hai:** OWASP
Top 10 abstract mein memorize karne ke liye ek checklist nahi hai — ye ek
description hai ki real vulnerabilities real applications ke across kahan
cluster karti hain. Ye dekhna ki is course ke Modules 8, 10, aur 12-13
already 10 mein se 7 categories pe map karte hain confirmation hai ki
security ek separate module nahi hai jo ant mein bolt kiya gaya — ye is
course ne banaye har feature ka throughline raha hai.`,

    content: `## Why session fixation is easy to miss without knowing to look for it

The vulnerability doesn't look like a bug in the login logic itself — the
password check, the database lookup, all of it can be entirely correct.
The gap is specifically in NOT generating a fresh session identifier at
the moment authentication succeeds, silently continuing to use whatever
identifier the request happened to already carry. This is precisely the
kind of subtle omission that's easy to miss in code review unless someone
specifically knows to check for it, which is exactly why it's worth
naming explicitly rather than assuming "the login flow works, so it must
be fine."

## Why an app accepting a session id from a URL parameter is a red flag
on its own

Beyond fixation specifically, a session identifier should only ever
travel via an \`httpOnly\` cookie the browser manages automatically — never
as a URL parameter, form field, or anything a page's own JavaScript or an
attacker's crafted link could set directly. An application design that
allows a session id to arrive via a URL is already exposed to fixation
(among other risks, like the session id leaking via browser history,
referrer headers, or server logs) regardless of whether the login flow
regenerates it afterward.

## Why the OWASP Top 10 is worth mapping explicitly, not just knowing by
name

Many developers can recite that "XSS and SQL injection are OWASP Top 10
risks" without a concrete sense of which specific patterns in their own
stack correspond to each category, or which their framework already
mitigates by default versus which still require explicit developer
attention. Prisma's parameterized queries make classic SQL injection
(A03) largely a non-issue by default, for instance — but this doesn't mean
"injection" as a category is irrelevant to a Next.js app; it means the
SPECIFIC mitigation already exists in the tooling, and a developer's
attention is better spent elsewhere (like IDOR or session fixation, which
have no equivalent automatic mitigation).

## Why security is presented as a throughline, not a single module

The fact that this course's earlier modules (authentication, payments,
data fetching) turn out to map onto 7 of 10 OWASP categories without this
module having introduced anything from Modules 8 or 10 is a deliberate
demonstration: real application security isn't a checklist applied once
at the end of a project, it's a property of how every individual feature
was built along the way. A team that treats "security" as a phase that
happens after building features has usually already made most of the
mistakes this course flagged as they went.`,

    contentHi: `## Session fixation isse dhundhna jaante bina miss karna aasan kyun hai

Vulnerability login logic khud mein ek bug jaisa nahi dikhta — password
check, database lookup, sab kuch poori tarah correct ho sakta hai. Gap
specifically YE NAHI karne mein hai ki authentication succeed hone ke
moment pe ek fresh session identifier generate kiya jaaye, silently jo bhi
identifier request ke saath already thi use karte rehne mein. Ye
precisely wo tarah ka subtle omission hai jise code review mein miss
karna aasan hai jab tak koi specifically ise check karna na jaanta ho,
yahi exactly wajah hai ki ise explicitly naam lena worth hai "login flow
kaam karta hai, isliye ye theek hoga" assume karne ke bajaye.

## Ek app ka URL parameter se ek session id accept karna khud mein ek red flag kyun hai

Fixation specifically se pare, ek session identifier ko sirf ek
\`httpOnly\` cookie ke through travel karna chahiye jise browser
automatically manage karta hai — kabhi ek URL parameter, form field, ya
kisi bhi cheez ki tarah nahi jise ek page ki apni JavaScript ya ek
attacker ka crafted link directly set kar sake. Ek application design jo
ek session id ko ek URL ke through aane deta hai already fixation ke
against exposed hai (baaki risks samet, jaise session id ka browser
history, referrer headers, ya server logs ke through leak hona) chahe
login flow ise baad mein regenerate kare ya na kare.

## OWASP Top 10 ko explicitly map karna kyun worth hai, sirf naam se jaanna nahi

Kai developers recite kar sakte hain ki "XSS aur SQL injection OWASP Top
10 risks hain" bina ek concrete sense ke ki unke apne stack mein kaunse
specific patterns har category se correspond karte hain, ya kaunse unka
framework already default se mitigate karta hai versus kaunse ko abhi bhi
explicit developer attention chahiye. Prisma ki parameterized queries
classic SQL injection (A03) ko largely default se ek non-issue banati
hain, misaal ke taur pe — par iska matlab ye nahi hai ki "injection" ek
category ki tarah ek Next.js app ke liye irrelevant hai; iska matlab hai
SPECIFIC mitigation already tooling mein exist karta hai, aur ek
developer ka attention kahin aur better spend hota hai (jaise IDOR ya
session fixation, jinke paas koi equivalent automatic mitigation nahi hai).

## Security ko ek throughline ki tarah kyun present kiya gaya, ek single module nahi

Ye fact ki is course ke earlier modules (authentication, payments, data
fetching) 10 mein se 7 OWASP categories pe map ho jaate hain bina is
module ne Modules 8 ya 10 se kuch introduce kiye, ek deliberate
demonstration hai: real application security ek checklist nahi hai jo ek
project ke ant mein ek baar apply hota hai, ye is baat ki ek property hai
ki har individual feature raaste mein kaise banaya gaya. Ek team jo
"security" ko ek phase ki tarah treat karti hai jo features banane ke
baad hoti hai usually already zyadatar wo mistakes kar chuki hoti hai jo
ye course flag kar chuka hai jaise wo aage badhte hain.`,

    examples: [
      {
        title: 'Regenerating the session id at login to prevent fixation',
        titleHi: 'Fixation ko prevent karne ke liye login pe session id regenerate karna',
        codeJs: `// app/actions.js
'use server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function login(formData) {
  const user = await verifyCredentials(
    formData.get('email'),
    formData.get('password'),
  );
  if (!user) return { error: 'Invalid credentials' };

  // Whatever session id (if any) existed BEFORE login is discarded here —
  // a fresh, unpredictable id is generated at the moment of authentication
  const newSessionId = crypto.randomUUID();
  await db.session.create({
    data: { id: newSessionId, userId: user.id, expiresAt: /* ... */ },
  });

  const cookieStore = await cookies();
  cookieStore.set('session', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return { success: true };
}`,
        codeTs: `// app/actions.ts
'use server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function login(formData: FormData) {
  const user = await verifyCredentials(
    formData.get('email') as string,
    formData.get('password') as string,
  );
  if (!user) return { error: 'Invalid credentials' };

  // Whatever session id (if any) existed BEFORE login is discarded here —
  // a fresh, unpredictable id is generated at the moment of authentication
  const newSessionId = crypto.randomUUID();
  await db.session.create({
    data: { id: newSessionId, userId: user.id, expiresAt: new Date(Date.now() + 7 * 86400_000) },
  });

  const cookieStore = await cookies();
  cookieStore.set('session', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return { success: true };
}`,
        code: `const newSessionId = crypto.randomUUID();
await db.session.create({ data: { id: newSessionId, userId: user.id } });
cookieStore.set('session', newSessionId, { httpOnly: true, secure: true });`,
        output:
          "Even if an attacker somehow got the victim's browser to carry a pre-known session id before login, that id is never used post-login — a brand-new, attacker-unknown id replaces it the moment authentication succeeds, making the attacker's pre-known id worthless.",
        explain:
          "The critical detail is WHEN the new id is generated: at the moment of successful authentication, not reused from whatever the request arrived with. This timing is the entire fix — generating a random id elsewhere in the app, but still reusing the pre-login session id after authentication, would not prevent fixation.",
        explainHi:
          "Critical detail ye hai ki naya id KAB generate hota hai: successful authentication ke moment pe, request jis id ke saath aayi thi use reuse karne ke bajaye. Ye timing hi poora fix hai — app mein kahin aur ek random id generate karna, par abhi bhi authentication ke baad pre-login session id reuse karna, fixation ko prevent nahi karega.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reusing whatever session id already existed, even after successful login
export async function login(formData) {
  const user = await verifyCredentials(formData);
  if (!user) return { error: 'Invalid credentials' };

  // Whatever session id the browser arrived with (possibly attacker-set
  // before this login even happened) is simply upgraded to authenticated
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get('session')?.value;
  await db.session.update({
    where: { id: existingSessionId },
    data: { userId: user.id }, // now "logged in" under the SAME id
  });
}`,
        right: `// Always generating a fresh session id at the moment of authentication
export async function login(formData) {
  const user = await verifyCredentials(formData);
  if (!user) return { error: 'Invalid credentials' };

  const newSessionId = crypto.randomUUID();
  await db.session.create({ data: { id: newSessionId, userId: user.id } });
  const cookieStore = await cookies();
  cookieStore.set('session', newSessionId, { httpOnly: true, secure: true });
}`,
        why: "Upgrading a pre-existing session id to authenticated status, rather than issuing a fresh one, means any session id an attacker managed to plant in the victim's browser before login becomes a valid, authenticated session the instant the victim logs in — exactly the session fixation attack.",
        whyHi:
          "Ek pre-existing session id ko authenticated status tak upgrade karna, ek fresh wala issue karne ke bajaye, matlab hai koi bhi session id jise ek attacker victim ke browser mein login se pehle plant karne mein successful hua ek valid, authenticated session ban jaata hai jis instant victim login karta hai — exactly session fixation attack.",
      },
    ],

    realWorld: [
      {
        en: "Established auth libraries like Auth.js/NextAuth generate a fresh session token on every successful sign-in by default, specifically to close off session fixation without requiring the application developer to remember this detail — one of many reasons hand-rolling session management from scratch is discouraged for production applications.",
        hi: 'Established auth libraries jaise Auth.js/NextAuth default se har successful sign-in pe ek fresh session token generate karti hain, specifically session fixation ko band karne ke liye bina application developer ko is detail ko yaad rakhne ki zaroorat ke — un kai wajahon mein se ek jinse production applications ke liye scratch se session management hand-roll karna discourage kiya jata hai.',
      },
    ],

    interviewQA: [
      {
        q: "What is session fixation, and what is the core fix?",
        qHi: 'Session fixation kya hai, aur core fix kya hai?',
        a: "Session fixation is an attack where a victim is tricked into authenticating using a session identifier the attacker already knows, letting the attacker share that now-authenticated session. The fix is always generating a brand-new, unpredictable session id at the moment authentication succeeds, discarding whatever id (if any) the request arrived with, rather than upgrading a pre-existing id to authenticated status.",
        aHi: 'Session fixation ek attack hai jahan ek victim ko trick kiya jata hai ek session identifier use karke authenticate hone ke liye jo attacker already jaanta hai, attacker ko us ab-authenticated session ko share karne dete hue. Fix hamesha authentication succeed hone ke moment pe ek bilkul naya, unpredictable session id generate karna hai, jo bhi id (agar koi hai) request ke saath aayi use discard karte hue, ek pre-existing id ko authenticated status tak upgrade karne ke bajaye.',
      },
      {
        q: "Why is it useful to map the OWASP Top 10 onto specific mechanisms in a framework, rather than just memorizing the category names?",
        qHi: 'OWASP Top 10 ko ek framework mein specific mechanisms pe map karna kyun useful hai, sirf category names memorize karne ke bajaye?',
        a: "Because it clarifies which categories a framework or library already mitigates by default (like Prisma's parameterized queries largely handling injection) versus which still require explicit developer attention (like IDOR or session fixation, which have no automatic framework-level fix) — this focuses real effort where it's actually needed.",
        aHi: 'Kyunki ye clarify karta hai ki kaunsi categories ek framework ya library already default se mitigate karti hai (jaise Prisma ki parameterized queries largely injection handle karti hain) versus kaunse ko abhi bhi explicit developer attention chahiye (jaise IDOR ya session fixation, jinke paas koi automatic framework-level fix nahi hai) — ye real effort ko wahan focus karta hai jahan actually zaroorat hai.',
      },
    ],

    exercises: [
      {
        task: "An app currently accepts a session identifier via a query parameter (?sid=...) as a fallback for browsers with cookies disabled, and reuses whatever sid was present after a successful login. Identify every distinct security problem with this design, not just session fixation.",
        taskHi: 'Ek app currently ek session identifier ko ek query parameter (?sid=...) ke through accept karta hai un browsers ke liye fallback ki tarah jinme cookies disabled hain, aur jo bhi sid present tha use successful login ke baad reuse karta hai. Is design ke saath har distinct security problem identify karo, sirf session fixation nahi.',
        hint: "Consider everywhere a URL (and therefore anything embedded in it) tends to leak — browser history, referrer headers sent to third-party resources, server access logs.",
        hintHi: 'Har jagah socho jahan ek URL (aur isliye ise embed kiya gaya koi bhi cheez) leak hone ki tendency rakhta hai — browser history, third-party resources ko bheje gaye referrer headers, server access logs.',
      },
    ],

    keyTakeaways: [
      "Session fixation tricks a victim into authenticating with a session identifier the attacker already possesses — the fix is always generating a fresh, unpredictable session id at the moment of successful authentication, never reusing a pre-existing one.",
      'A session identifier should only ever travel via an httpOnly cookie the browser manages automatically — accepting it via a URL parameter or form field is a red flag independent of fixation specifically.',
      "Established auth libraries handle session regeneration correctly by default, which is one more reason to prefer them over hand-rolled session management for production applications.",
      "This course's earlier modules already map onto 7 of the OWASP Top 10 categories (access control, cryptographic failures, security misconfiguration, vulnerable components, auth failures, data integrity failures) — security has been a throughline of every feature built, not a separate final topic.",
    ],
    keyTakeawaysHi: [
      'Session fixation ek victim ko ek session identifier ke saath authenticate hone ke liye trick karta hai jo attacker already possess karta hai — fix hamesha successful authentication ke moment pe ek fresh, unpredictable session id generate karna hai, ek pre-existing wale ko kabhi reuse na karte hue.',
      'Ek session identifier ko sirf ek httpOnly cookie ke through travel karna chahiye jise browser automatically manage karta hai — ise ek URL parameter ya form field ke through accept karna ek red flag hai specifically fixation se independent.',
      'Established auth libraries session regeneration ko default se correctly handle karti hain, jo ek aur wajah hai unhe production applications ke liye hand-rolled session management se prefer karne ki.',
      'Is course ke earlier modules already OWASP Top 10 categories mein se 7 pe map ho jaate hain (access control, cryptographic failures, security misconfiguration, vulnerable components, auth failures, data integrity failures) — security har banaye gaye feature ka ek throughline raha hai, ek separate final topic nahi.',
    ],
  },
];
