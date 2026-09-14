/**
 * Generative AI Complete Course — Module 13: Rate Limiting & Abuse Prevention for AI Endpoints, lessons 1-3.
 *
 * Lesson 1: Why AI endpoints need cost-based, not request-count, rate limiting.
 * Lesson 2: Detecting AI-specific abuse patterns (prompt-stuffing, automated scraping via chat).
 * Lesson 3: Per-user/per-tier quotas and the different rate-limiting math this requires.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-cost-based-rate-limiting',
    title: 'Why AI Endpoints Need Cost-Based, Not Request-Count, Rate Limiting',
    titleHi: 'AI Endpoints Ko Cost-Based Rate Limiting Kyun Chahiye, Request-Count Nahi',
    description:
      "A normal API's rate limit (100 requests/minute) assumes every request costs roughly the same. Module 2 established that an AI request's cost varies wildly by input/output size — this lesson covers why that difference requires a genuinely different rate-limiting unit: tokens or dollars, not request count.",
    descriptionHi:
      "Ek normal API ka rate limit (100 requests/minute) assume karta hai ki har request roughly wahi cost karta hai. Module 2 ne establish kiya ki ek AI request ki cost input/output size ke hisaab se wildly vary karti hai — ye lesson cover karta hai ki wo difference kyun ek genuinely alag rate-limiting unit chahta hai: tokens ya dollars, request count nahi.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A toll booth that charges every vehicle the identical flat fee, versus one that charges by actual vehicle weight because a loaded cargo truck genuinely costs the road system far more wear than a bicycle.** A flat per-vehicle toll makes sense when every vehicle crossing genuinely imposes roughly similar wear on the road — but the moment vehicles range from bicycles to fully-loaded cargo trucks, a flat per-vehicle fee badly mismatches actual cost: ten bicycles crossing cost the road system almost nothing, while a single overloaded truck can cause more actual damage than a hundred bicycles combined. A toll system that charges by weight (or some other measure that actually tracks real cost) correctly limits the thing that actually matters — cumulative wear — rather than merely counting vehicles as if they were interchangeable. A normal API's request-count rate limit is the flat per-vehicle toll — reasonable when every request costs roughly the same. An AI endpoint's requests are the mixed fleet of bicycles and cargo trucks: a request with a 50-word prompt and a request with a 50,000-word document pasted into it are utterly different in actual cost (Module 2's token math), so limiting by REQUEST COUNT alone completely fails to limit the thing that actually matters — cumulative token spend.",
      hi: 'Ek toll booth jo har vehicle se identical flat fee charge karta hai, versus ek jo actual vehicle weight se charge karta hai kyunki ek loaded cargo truck genuinely road system ko ek bicycle se kaafi zyada wear cost karta hai. Ek flat per-vehicle toll sense banata hai jab har vehicle cross karna genuinely road pe roughly similar wear impose karta hai — par jis moment vehicles bicycles se fully-loaded cargo trucks tak range karte hain, ek flat per-vehicle fee badly actual cost se mismatch karti hai: das bicycles cross karna road system ko almost kuch cost nahi karta, jabki ek single overloaded truck sau bicycles combined se zyada actual damage cause kar sakta hai. Ek toll system jo weight se charge karta hai (ya kuch aur measure jo actually real cost track karta hai) correctly us cheez ko limit karta hai jo actually matter karti hai — cumulative wear — sirf vehicles ko count karne ke bajaye jaise wo interchangeable ho. Ek normal API ka request-count rate limit wo flat per-vehicle toll hai — reasonable jab har request roughly wahi cost karta hai. Ek AI endpoint ki requests bicycles aur cargo trucks ka mixed fleet hai: ek 50-word prompt wali request aur ek 50,000-word document paste ki gayi wali request actual cost mein poori tarah alag hain (Module 2 ka token math), isliye sirf REQUEST COUNT se limit karna us cheez ko limit karne mein poori tarah fail hota hai jo actually matter karti hai — cumulative token spend.',
    },

    simple: `**Why request-count rate limiting (a normal API's default) breaks
down for AI endpoints:**

\`\`\`ts
// A traditional rate limiter — counts requests, assumes each costs the same
const rateLimiter = new RequestCountLimiter({ maxRequests: 100, windowMs: 60000 });

// Request A: a 20-word question, cheap (Module 2's cost math)
await callModel('What time zone is Tokyo in?');

// Request B: a 40,000-word document pasted in, genuinely expensive
await callModel(\`Summarize this: \${veryLongDocument}\`);

// BOTH count as "1 request" against the same limit — a user sending
// 100 tiny questions and a user sending 100 requests each with a huge
// document attached are treated IDENTICALLY by request-count limiting,
// despite the second user's actual cost being orders of magnitude higher
\`\`\`

**Cost-based rate limiting — tracking the actual resource that
matters, tokens (or their dollar equivalent):**

\`\`\`ts
class TokenBucketRateLimiter {
  constructor(maxTokensPerWindow, windowMs) {
    this.maxTokensPerWindow = maxTokensPerWindow;
    this.windowMs = windowMs;
    this.usage = new Map(); // userId -> { tokensUsed, windowStart }
  }

  checkAndRecord(userId, estimatedTokens) {
    const now = Date.now();
    let record = this.usage.get(userId);

    if (!record || now - record.windowStart > this.windowMs) {
      record = { tokensUsed: 0, windowStart: now };
    }

    if (record.tokensUsed + estimatedTokens > this.maxTokensPerWindow) {
      return { allowed: false, reason: 'Token budget exceeded for this window' };
    }

    record.tokensUsed += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

const limiter = new TokenBucketRateLimiter(100000, 60000); // 100k tokens/minute

async function handleRequest(userId, prompt) {
  const estimatedTokens = estimateTokens(prompt) + 500; // input + expected output
  const check = limiter.checkAndRecord(userId, estimatedTokens);
  if (!check.allowed) {
    throw new Error(check.reason);
  }
  return await callModel(prompt);
}
\`\`\`

**Why this genuinely changes what gets limited, and why that's
correct:** under cost-based limiting, a user sending 100 tiny questions
and a user sending 3 requests each with a huge document can both be
allowed or both be blocked, correctly, based on their ACTUAL resource
consumption — not an arbitrary count of how many times they happened to
hit the API. This directly extends Module 2's cost-math lesson: if a
feature's real cost is measured in tokens, not requests, then protecting
that cost from abuse has to be measured in the same unit, or the
protection doesn't actually correspond to the thing being protected.

**Why estimating BEFORE the call, not just measuring after, matters:**
checking a request's estimated cost before making the expensive model
call (rather than only recording actual usage afterward) prevents an
already-over-budget user's request from being sent to the model at all
— catching the problem before incurring the cost, not just tracking it
retroactively after the money's already spent. This mirrors Module 10,
Lesson 1's discipline of estimating cost before committing to an action,
applied here at the individual-request level rather than the
feature-design level.`,

    simpleHi: `**Request-count rate limiting (ek normal API ka default) AI
endpoints ke liye kyun break hota hai:**

\`\`\`ts
// Ek traditional rate limiter — requests count karta hai, assume karta
// hai ki har ek wahi cost karta hai
const rateLimiter = new RequestCountLimiter({ maxRequests: 100, windowMs: 60000 });

// Request A: ek 20-word question, cheap (Module 2 ka cost math)
await callModel('What time zone is Tokyo in?');

// Request B: ek 40,000-word document paste kiya gaya, genuinely expensive
await callModel(\`Summarize this: \${veryLongDocument}\`);

// DONO "1 request" ki tarah wahi limit ke against count hote hain — ek
// user jo 100 chhote questions bhejta hai aur ek user jo 100 requests
// bhejta hai har ek mein ek bada document attached ke saath request-
// count limiting dwara IDENTICALLY treat kiye jaate hain, doosre user
// ki actual cost orders of magnitude higher hone ke bawajood
\`\`\`

**Cost-based rate limiting — actual resource track karna jo matter
karta hai, tokens (ya unka dollar equivalent):**

\`\`\`ts
class TokenBucketRateLimiter {
  constructor(maxTokensPerWindow, windowMs) {
    this.maxTokensPerWindow = maxTokensPerWindow;
    this.windowMs = windowMs;
    this.usage = new Map(); // userId -> { tokensUsed, windowStart }
  }

  checkAndRecord(userId, estimatedTokens) {
    const now = Date.now();
    let record = this.usage.get(userId);

    if (!record || now - record.windowStart > this.windowMs) {
      record = { tokensUsed: 0, windowStart: now };
    }

    if (record.tokensUsed + estimatedTokens > this.maxTokensPerWindow) {
      return { allowed: false, reason: 'Token budget exceeded for this window' };
    }

    record.tokensUsed += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

const limiter = new TokenBucketRateLimiter(100000, 60000); // 100k tokens/minute

async function handleRequest(userId, prompt) {
  const estimatedTokens = estimateTokens(prompt) + 500; // input + expected output
  const check = limiter.checkAndRecord(userId, estimatedTokens);
  if (!check.allowed) {
    throw new Error(check.reason);
  }
  return await callModel(prompt);
}
\`\`\`

**Ye genuinely kya limit hota hai use kyun badalta hai, aur ye correct
kyun hai:** cost-based limiting ke under, ek user jo 100 chhote questions
bhejta hai aur ek user jo 3 requests bhejta hai har ek mein ek bada
document ke saath dono correctly allow ya block ho sakte hain, unki
ACTUAL resource consumption ke basis pe — kitni baar wo API hit karte
hain uska ek arbitrary count nahi. Ye directly Module 2 ke cost-math
lesson ko extend karta hai: agar ek feature ki real cost tokens mein
measure hoti hai, requests mein nahi, to us cost ko abuse se protect
karna wahi unit mein measure hona chahiye, warna protection actually us
cheez se correspond nahi karta jise protect kiya ja raha hai.

**Actual model call se PEHLE estimate karna, sirf baad mein measure
karna nahi, kyun matter karta hai:** ek request ki estimated cost ko
expensive model call karne se pehle check karna (sirf baad mein actual
usage record karne ke bajaye) ek already-over-budget user ki request ko
model tak bhejna se bilkul rokta hai — problem ko cost incur karne se
pehle catch karte hue, sirf ise retroactively track karne ke bajaye
paisa already spend ho jaane ke baad. Ye Module 10, Lesson 1 ki
discipline ko mirror karta hai ek action commit karne se pehle cost
estimate karne ki, yahan individual-request level pe applied feature-
design level ke bajaye.`,

    content: `## Why request-count limiting's core assumption fails specifically
for AI endpoints

Request-count rate limiting implicitly assumes every request imposes
roughly similar cost on the system — a reasonable assumption for many
traditional APIs, where a request's processing cost is relatively
uniform. Module 2 established that this assumption is straightforwardly
false for AI endpoints: a request's actual cost scales with its input
and output token count, which can vary by several orders of magnitude
between a short question and a request with a large document attached.
Limiting by request count when the actual cost driver is token volume
means the limit doesn't correspond to the resource actually being
protected — a user can stay well within a request-count limit while
consuming vastly more actual cost than the limit was designed to bound.

## Why the rate-limiting unit must match the actual cost unit

A rate limit's entire purpose is bounding a specific resource from being
consumed too quickly or excessively. For this to work, the unit being
limited has to correspond to the unit actually driving cost — Module
2's lesson established that unit is tokens (or their direct dollar
equivalent), not requests. A cost-based (token-bucket style) limiter
tracks and bounds this correct unit directly, which is why it correctly
treats "100 tiny requests" and "3 requests with huge documents attached"
according to their actual resource consumption rather than an arbitrary
count that happens to be identical between the two cases.

## Why estimating cost before the call, not just recording it after,
is the correct implementation detail

A rate limiter that only records actual token usage after a call
completes can still let an over-budget request through, since the
check happens after the expensive resource has already been consumed —
by the time the system "notices" the budget was exceeded, the cost has
already been incurred. Estimating a request's likely token cost before
making the call (using the same estimation technique Module 10, Lesson
1 established for feature-level cost planning, now applied per-request)
allows the system to reject an over-budget request BEFORE incurring any
cost at all, which is the only way rate limiting actually prevents
excess spend rather than merely measuring it after the fact.

## How this sets up Lesson 2 and Lesson 3

This lesson establishes the correct unit (tokens/cost) for limiting
legitimate usage from growing unboundedly expensive. Lesson 2 covers a
related but distinct concern: usage patterns that indicate deliberate
abuse rather than simply heavy legitimate use, which cost-based limiting
alone doesn't fully address (a sophisticated abuser can stay within a
token budget while still behaving abusively in other detectable ways).
Lesson 3 extends this lesson's per-window token bucket into a full
per-user/per-tier quota system, the production shape a real product
actually needs rather than a single global limit.`,

    contentHi: `## Request-count limiting ka core assumption specifically AI endpoints ke liye kyun fail hota hai

Request-count rate limiting implicitly assume karta hai ki har request
system pe roughly similar cost impose karta hai — kai traditional APIs
ke liye ek reasonable assumption, jahan ek request ka processing cost
relatively uniform hota hai. Module 2 ne establish kiya ki ye assumption
AI endpoints ke liye straightforwardly false hai: ek request ki actual
cost uske input aur output token count ke saath scale karti hai, jo ek
short question aur ek bade document attached wali request ke beech kai
orders of magnitude se vary kar sakti hai. Request count se limit karna
jab actual cost driver token volume hai matlab hai limit us resource se
correspond nahi karta jo actually protect kiya ja raha hai — ek user ek
request-count limit ke andar well within reh sakta hai jabki us limit
se kaafi zyada actual cost consume kar raha ho jise wo limit bound karne
ke liye design ki gayi thi.

## Rate-limiting unit ko actual cost unit se match kyun karna chahiye

Ek rate limit ka poora purpose ek specific resource ko bahut jaldi ya
excessively consume hone se bound karna hai. Iske liye kaam karne ke
liye, jo unit limit ki ja rahi hai use actually cost drive karne wali
unit se correspond karna chahiye — Module 2 ka lesson establish karta
hai ki wo unit tokens hai (ya unka direct dollar equivalent), requests
nahi. Ek cost-based (token-bucket style) limiter directly is correct
unit ko track aur bound karta hai, yahi wajah hai ye correctly "100
chhoti requests" aur "3 requests bade documents attached ke saath" ko
unki actual resource consumption ke hisaab se treat karta hai ek
arbitrary count ke bajaye jo dono cases mein identical hone ka happen
hota hai.

## Call se pehle cost estimate karna, sirf baad mein record karna nahi, correct implementation detail kyun hai

Ek rate limiter jo sirf ek call complete hone ke baad actual token usage
record karta hai abhi bhi ek over-budget request ko through jaane de
sakta hai, kyunki check expensive resource already consume hone ke baad
hota hai — jab tak system "notice" karta hai ki budget exceed ho gaya,
cost already incur ho chuki hai. Call karne se pehle ek request ki
likely token cost estimate karna (wahi estimation technique use karte
hue jo Module 10, Lesson 1 ne feature-level cost planning ke liye
establish ki, ab per-request applied) system ko ek over-budget request
ko reject karne deta hai kisi bhi cost incur karne se PEHLE, jo ekmatra
tareeka hai jispe rate limiting actually excess spend prevent karti hai
sirf ise baad mein measure karne ke bajaye.

## Ye Lesson 2 aur Lesson 3 ko kaise set up karta hai

Ye lesson correct unit (tokens/cost) establish karta hai legitimate
usage ko unboundedly expensive hone se limit karne ke liye. Lesson 2 ek
related par distinct concern cover karta hai: usage patterns jo
deliberate abuse indicate karte hain sirf heavy legitimate use ke
bajaye, jise akela cost-based limiting poori tarah address nahi karti
(ek sophisticated abuser ek token budget ke andar reh sakta hai jabki
abhi bhi doosre detectable tareekon se abusively behave kar raha ho).
Lesson 3 is lesson ke per-window token bucket ko ek poore per-user/
per-tier quota system tak extend karta hai, wo production shape jo ek
real product actually chahta hai ek single global limit ke bajaye.`,

    examples: [
      {
        title: 'Comparing request-count and token-based rate limiting against the identical usage pattern',
        titleHi: 'Wahi identical usage pattern ke against request-count aur token-based rate limiting compare karna',
        codeJs: `// Request-count limiting — misses the actual cost problem entirely
class RequestCountLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.counts = new Map();
  }
  checkAndRecord(userId) {
    const now = Date.now();
    const record = this.counts.get(userId) ?? { count: 0, windowStart: now };
    if (now - record.windowStart > this.windowMs) {
      record.count = 0;
      record.windowStart = now;
    }
    if (record.count >= this.maxRequests) return { allowed: false };
    record.count++;
    this.counts.set(userId, record);
    return { allowed: true };
  }
}

// Token-based limiting — correctly tracks actual cost
class TokenLimiter {
  constructor(maxTokens, windowMs) {
    this.maxTokens = maxTokens;
    this.windowMs = windowMs;
    this.usage = new Map();
  }
  checkAndRecord(userId, estimatedTokens) {
    const now = Date.now();
    const record = this.usage.get(userId) ?? { tokens: 0, windowStart: now };
    if (now - record.windowStart > this.windowMs) {
      record.tokens = 0;
      record.windowStart = now;
    }
    if (record.tokens + estimatedTokens > this.maxTokens) return { allowed: false };
    record.tokens += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

// The SAME usage pattern: 5 requests, each with a 30,000-token document
const requestCountLimiter = new RequestCountLimiter(100, 60000); // "100 requests/min" — generous-sounding
const tokenLimiter = new TokenLimiter(100000, 60000); // "100k tokens/min"

for (let i = 0; i < 5; i++) {
  console.log('Request-count check:', requestCountLimiter.checkAndRecord('user1'));
  // { allowed: true } every time — nowhere near the 100-request limit
  console.log('Token check:', tokenLimiter.checkAndRecord('user1', 30000));
  // Blocks after ~3 requests — 90,000+ tokens already consumed,
  // correctly reflecting the actual, substantial cost incurred
}`,
        codeTs: `interface UsageRecord { windowStart: number; }
interface CountRecord extends UsageRecord { count: number; }
interface TokenRecord extends UsageRecord { tokens: number; }

// Request-count limiting — misses the actual cost problem entirely
class RequestCountLimiter {
  private counts = new Map<string, CountRecord>();
  constructor(private maxRequests: number, private windowMs: number) {}

  checkAndRecord(userId: string): { allowed: boolean } {
    const now = Date.now();
    const record = this.counts.get(userId) ?? { count: 0, windowStart: now };
    if (now - record.windowStart > this.windowMs) {
      record.count = 0;
      record.windowStart = now;
    }
    if (record.count >= this.maxRequests) return { allowed: false };
    record.count++;
    this.counts.set(userId, record);
    return { allowed: true };
  }
}

// Token-based limiting — correctly tracks actual cost
class TokenLimiter {
  private usage = new Map<string, TokenRecord>();
  constructor(private maxTokens: number, private windowMs: number) {}

  checkAndRecord(userId: string, estimatedTokens: number): { allowed: boolean } {
    const now = Date.now();
    const record = this.usage.get(userId) ?? { tokens: 0, windowStart: now };
    if (now - record.windowStart > this.windowMs) {
      record.tokens = 0;
      record.windowStart = now;
    }
    if (record.tokens + estimatedTokens > this.maxTokens) return { allowed: false };
    record.tokens += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

// The SAME usage pattern: 5 requests, each with a 30,000-token document
const requestCountLimiter = new RequestCountLimiter(100, 60000); // "100 requests/min" — generous-sounding
const tokenLimiter = new TokenLimiter(100000, 60000); // "100k tokens/min"

for (let i = 0; i < 5; i++) {
  console.log('Request-count check:', requestCountLimiter.checkAndRecord('user1'));
  // { allowed: true } every time — nowhere near the 100-request limit
  console.log('Token check:', tokenLimiter.checkAndRecord('user1', 30000));
  // Blocks after ~3 requests — 90,000+ tokens already consumed,
  // correctly reflecting the actual, substantial cost incurred
}`,
        code: `// Same 5 requests, each with a 30,000-token document:
requestCountLimiter.checkAndRecord('user1'); // always { allowed: true } — only 5 of 100
tokenLimiter.checkAndRecord('user1', 30000); // blocks after ~3 — 90k+ of 100k tokens used`,
        output:
          "The request-count limiter allows all 5 requests without hesitation, since 5 is far below its 100-request limit. The token limiter blocks the 4th request, having correctly detected that 90,000+ tokens (nearly the full 100,000-token budget) were already consumed by just 3 requests — the request-count limiter completely failed to protect against the actual cost this usage pattern represents.",
        explain:
          "This demonstrates the lesson's core claim concretely: identical usage produces a dangerously false sense of safety under request-count limiting (5 of 100 requests looks fine) while the token limiter correctly identifies the actual resource consumption as the real constraint that matters.",
        explainHi:
          "Ye lesson ke core claim ko concretely demonstrate karta hai: identical usage request-count limiting ke under ek dangerously false sense of safety produce karta hai (100 mein se 5 requests theek dikhti hain) jabki token limiter correctly actual resource consumption ko us real constraint ki tarah identify karta hai jo matter karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Rate limiting an AI endpoint purely by request count, treating
// every request as equally expensive
const limiter = new RequestCountLimiter(1000, 3600000); // "1000 requests/hour"

app.post('/api/chat', async (req, res) => {
  const check = limiter.checkAndRecord(req.userId);
  if (!check.allowed) return res.status(429).send('Rate limited');
  const response = await callModel(req.body.message); // no cost awareness at all
  res.json(response);
  // A user sending 1000 requests each with a massive pasted document
  // stays perfectly within this limit while consuming a genuinely
  // enormous, unbounded amount of actual token cost
});`,
        right: `// Rate limiting by estimated token cost, the unit that actually
// tracks resource consumption
const limiter = new TokenLimiter(2_000_000, 3600000); // "2M tokens/hour"

app.post('/api/chat', async (req, res) => {
  const estimatedTokens = estimateTokens(req.body.message) + 500;
  const check = limiter.checkAndRecord(req.userId, estimatedTokens);
  if (!check.allowed) return res.status(429).send('Token budget exceeded for this hour');
  const response = await callModel(req.body.message);
  res.json(response);
  // A user's actual resource consumption is what's bounded, regardless
  // of how many individual requests it happened to arrive in
});`,
        why: "Request-count limiting assumes uniform per-request cost, an assumption Module 2 established as false for AI endpoints. A user can send many requests each with a huge document attached and stay comfortably within a request-count limit while consuming vastly more actual cost than the limit was intended to bound — token-based limiting correctly tracks the resource that actually matters.",
        whyHi:
          "Request-count limiting uniform per-request cost assume karti hai, ek assumption jise Module 2 ne AI endpoints ke liye false establish kiya. Ek user kai requests bhej sakta hai har ek mein ek bada document attached ke saath aur ek request-count limit ke andar comfortably reh sakta hai jabki us limit se kaafi zyada actual cost consume karta hai jise wo limit bound karne ke liye intended thi — token-based limiting correctly us resource ko track karti hai jo actually matter karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production AI writing assistant switched from a request-count rate limit to a token-based one after discovering that a small number of users pasting extremely long documents (tens of thousands of tokens each) into a small number of requests were consuming a disproportionate share of total API cost while staying comfortably under any reasonable per-minute request-count limit.",
        hi: 'Ek production AI writing assistant ek request-count rate limit se ek token-based wale pe switch hua ye discover karne ke baad ki users ki ek chhoti sankhya jo extremely long documents (har ek mein tens of thousands of tokens) ko requests ki ek chhoti sankhya mein paste kar rahi thi total API cost ka ek disproportionate share consume kar rahi thi jabki kisi bhi reasonable per-minute request-count limit ke under comfortably rehte hue.',
      },
    ],

    interviewQA: [
      {
        q: "Why does a standard request-count rate limit fail to protect an AI endpoint's actual cost?",
        qHi: 'Ek standard request-count rate limit ek AI endpoint ki actual cost ko protect karne mein kyun fail hoti hai?',
        a: "It assumes every request imposes roughly similar cost, which Module 2 established is false for AI endpoints — a request's cost scales with its input/output token count, which can vary by orders of magnitude. A user can send few requests each with a huge document and stay well within a request-count limit while consuming vastly more actual cost than intended.",
        aHi: 'Ye assume karta hai ki har request roughly similar cost impose karta hai, jise Module 2 ne AI endpoints ke liye false establish kiya — ek request ki cost uske input/output token count ke saath scale karti hai, jo orders of magnitude se vary kar sakti hai. Ek user kam requests bhej sakta hai har ek mein ek bada document ke saath aur ek request-count limit ke andar well within reh sakta hai jabki intended se kaafi zyada actual cost consume karta hai.',
      },
      {
        q: 'Why should a rate limiter estimate a request\'s token cost BEFORE making the model call, rather than only recording actual usage afterward?',
        qHi: 'Ek rate limiter ko model call karne se PEHLE ek request ki token cost estimate karni chahiye, sirf baad mein actual usage record karne ke bajaye kyun?',
        a: "Recording usage only after a call completes means the expensive resource has already been consumed by the time an over-budget condition is detected — the cost is already incurred. Estimating cost before the call allows the system to reject an over-budget request before any cost is spent at all, which is the only way rate limiting actually prevents excess spend rather than merely measuring it retroactively.",
        aHi: 'Usage ko sirf ek call complete hone ke baad record karna matlab hai expensive resource already consume ho chuka hai jab tak ek over-budget condition detect hoti hai — cost already incur ho chuki hai. Call se pehle cost estimate karna system ko kisi bhi cost spend hone se pehle ek over-budget request ko reject karne deta hai, jo ekmatra tareeka hai jispe rate limiting actually excess spend prevent karti hai sirf ise retroactively measure karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A team's AI feature has a rate limit of '50 requests per hour per user' and they're confused why their monthly API bill varies wildly even though total request counts stay roughly constant month to month. Using this lesson's reasoning, explain the likely cause and the fix.",
        taskHi: 'Ek team ke AI feature ki ek rate limit hai \'50 requests per hour per user\' aur wo confused hain ki unka monthly API bill wildly kyun vary karta hai chahe total request counts month to month roughly constant rehte hain. Is lesson ki reasoning use karke, likely cause aur fix explain karo.',
        hint: "Consider what request-count limiting fails to account for, and what could vary month to month even while the number of requests stays the same.",
        hintHi: 'Consider karo ki request-count limiting kya account karne mein fail hoti hai, aur kya month to month vary kar sakta hai chahe requests ki number wahi rahe.',
      },
    ],

    keyTakeaways: [
      "Request-count rate limiting assumes every request costs roughly the same, which Module 2 established is false for AI endpoints — cost scales with token count, which varies by orders of magnitude between requests.",
      "Cost-based (token-bucket style) rate limiting tracks the unit that actually drives cost, correctly bounding a user's real resource consumption regardless of how many individual requests it arrives in.",
      "Estimating a request's likely token cost BEFORE the model call, not just recording actual usage after, is necessary for rate limiting to actually prevent excess spend rather than merely measure it after the fact.",
      "This lesson establishes the correct unit for limiting legitimate usage; Lesson 2 covers detecting deliberate abuse patterns, and Lesson 3 extends this into a full per-user/per-tier quota system.",
    ],
    keyTakeawaysHi: [
      'Request-count rate limiting assume karti hai ki har request roughly wahi cost karta hai, jise Module 2 ne AI endpoints ke liye false establish kiya — cost token count ke saath scale karti hai, jo requests ke beech orders of magnitude se vary karti hai.',
      'Cost-based (token-bucket style) rate limiting us unit ko track karti hai jo actually cost drive karti hai, ek user ki real resource consumption ko correctly bound karte hue chahe ye kitni bhi individual requests mein aaye.',
      'Ek request ki likely token cost model call se PEHLE estimate karna, sirf baad mein actual usage record karne ke bajaye, zaroori hai rate limiting ke actually excess spend prevent karne ke liye sirf ise baad mein measure karne ke bajaye.',
      'Ye lesson legitimate usage limit karne ke liye correct unit establish karta hai; Lesson 2 deliberate abuse patterns detect karna cover karta hai, aur Lesson 3 ise ek poore per-user/per-tier quota system tak extend karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-detecting-ai-specific-abuse-patterns',
    title: 'Detecting AI-Specific Abuse Patterns',
    titleHi: 'AI-Specific Abuse Patterns Detect Karna',
    description:
      "Lesson 1 covered limiting legitimate usage from growing too expensive. This lesson covers a related but distinct concern: recognizing usage patterns specific to AI features — prompt-stuffing and automated scraping via chat — that indicate deliberate abuse a cost budget alone won't catch.",
    descriptionHi:
      'Lesson 1 ne legitimate usage ko bahut expensive hone se limit karna cover kiya. Ye lesson ek related par distinct concern cover karta hai: AI features ke liye specific usage patterns recognize karna — prompt-stuffing aur chat ke through automated scraping — jo deliberate abuse indicate karte hain jise akela ek cost budget catch nahi karega.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: "**A library that limits how many books a member can check out per day (a fair usage cap that stops legitimate over-borrowing), versus a librarian who separately notices someone systematically photographing every single page of every reference book in a specific section, clearly not to read them but to rebuild an entire copy of the collection elsewhere.** A checkout limit is a genuine, useful control on ordinary usage volume — but it says nothing about WHAT someone is doing with each individual visit. A librarian trained to notice a specific pattern (someone camping at a photocopier for hours, working through an entire shelf systematically rather than browsing) catches a fundamentally different kind of problem than a checkout-count limit ever could — not \"too much borrowing,\" but \"a specific behavior pattern that reveals a different underlying intent than normal reading.\" Cost-based rate limiting (Lesson 1) is the checkout limit — it correctly bounds a legitimate user's volume. Abuse-pattern detection is the observant librarian: recognizing that a request pattern — systematically extracting a knowledge base's entire content through many carefully-crafted questions, or stuffing a prompt with adversarial content designed to manipulate output — reveals a different underlying intent than ordinary use, something a pure volume/cost cap can't distinguish on its own.",
      hi: 'Ek library jo limit karti hai ki ek member per day kitni books checkout kar sakta hai (ek fair usage cap jo legitimate over-borrowing rokti hai), versus ek librarian jo separately notice karta hai ki koi systematically ek specific section ki har reference book ke har single page ko photograph kar raha hai, clearly unhe padhne ke liye nahi balki kahin aur poori collection ki ek copy rebuild karne ke liye. Ek checkout limit ordinary usage volume pe ek genuine, useful control hai — par ye kuch nahi kehta ki koi har individual visit mein KYA kar raha hai. Ek librarian jo ek specific pattern notice karne ke liye trained hai (koi ek photocopier pe hours ke liye camping kar raha hai, browsing ke bajaye systematically ek poore shelf ke through kaam kar raha hai) ek fundamentally alag kism ki problem catch karta hai jo ek checkout-count limit kabhi nahi kar sakta — "bahut zyada borrowing" nahi, balki "ek specific behavior pattern jo normal reading se ek alag underlying intent reveal karta hai." Cost-based rate limiting (Lesson 1) checkout limit hai — ye correctly ek legitimate user ke volume ko bound karta hai. Abuse-pattern detection wo observant librarian hai: recognize karna ki ek request pattern — kai carefully-crafted questions ke through ek knowledge base ka poora content systematically extract karna, ya ek prompt ko adversarial content se stuff karna jo output manipulate karne ke liye design kiya gaya — ordinary use se ek alag underlying intent reveal karta hai, kuch aisa jo ek pure volume/cost cap apne aap distinguish nahi kar sakta.',
    },

    simple: `**Prompt-stuffing — attempting to overwhelm or manipulate a model
with an unusually structured, adversarial-looking input:**

\`\`\`ts
function detectPromptStuffing(userMessage) {
  const signals = {
    // An unusually large number of repeated, near-identical phrases —
    // a pattern legitimate questions rarely produce
    excessiveRepetition: (userMessage.match(/(.{20,})\\1{3,}/g) ?? []).length > 0,

    // A suspiciously high ratio of special characters/tokens designed
    // to confuse parsing or exploit formatting (a known adversarial pattern)
    highSpecialCharRatio: (userMessage.match(/[<>{}[\\]\\\\]/g)?.length ?? 0) / userMessage.length > 0.1,

    // An unusually long input for what's nominally a simple, short-
    // seeming request type (context-dependent — a chat message that's
    // 10x longer than typical for this specific feature)
    anomalousLength: userMessage.length > EXPECTED_MAX_LENGTH_FOR_THIS_FEATURE,
  };
  return Object.values(signals).some(Boolean);
}
\`\`\`

**Automated scraping via chat — systematically extracting an entire
knowledge base through many crafted questions, rather than genuinely
asking questions:**

\`\`\`ts
function detectScrapingPattern(userId, recentQueries) {
  // A real user asks varied, topically-scattered questions over time.
  // A scraper systematically works through content in a suspiciously
  // exhaustive, methodical way — e.g., alphabetically enumerating
  // every product name, or asking about every FAQ entry in sequence
  const queryVelocity = recentQueries.length / TIME_WINDOW_MINUTES;
  const isUnusuallyFast = queryVelocity > NORMAL_HUMAN_QUERY_RATE;

  const isSystematicSequence = detectsSequentialEnumerationPattern(recentQueries);
  // e.g., queries for "product A details", "product B details",
  // "product C details"... in suspiciously perfect alphabetical order,
  // arriving faster than a human could plausibly type and read

  return isUnusuallyFast && isSystematicSequence;
}
\`\`\`

**Why cost-based limiting (Lesson 1) alone doesn't catch these
patterns:** a sophisticated abuser can stay comfortably within a
reasonable token budget while still engaging in exactly this kind of
abuse — prompt-stuffing and systematic scraping don't necessarily
require an enormous amount of tokens per request; they require a
specific PATTERN of requests that a pure volume/cost cap has no
mechanism to recognize, since cost-based limiting only tracks HOW MUCH
is being consumed, not WHAT SHAPE the consumption takes.

**Why detecting these patterns requires looking across requests over
time, not evaluating any single request in isolation:** a single
question that happens to be the 50th item in an attacker's systematic
enumeration looks completely unremarkable on its own — the suspicious
signal only emerges from the PATTERN across many requests (unusually
high velocity, suspiciously systematic sequencing, content that
methodically covers an entire knowledge base rather than reflecting
genuine curiosity). This is why abuse detection needs to track recent
request history per user, the same underlying need Lesson 1's rate
limiter tracks per-window usage, applied to pattern recognition instead
of pure volume.

**The practical response once a pattern is flagged — rarely an
immediate hard block:** because pattern-based detection produces
probabilistic signals rather than certainties, a reasonable response is
often graduated — additional friction (a CAPTCHA-style challenge,
temporarily reduced rate limits, flagging for human review) rather than
an immediate, irreversible ban, since a false positive (a genuinely
enthusiastic legitimate user who happens to trigger a pattern signal)
should have a lower-cost path to being confirmed as legitimate rather
than being permanently and incorrectly locked out.`,

    simpleHi: `**Prompt-stuffing — ek model ko ek unusually structured,
adversarial-looking input se overwhelm ya manipulate karne ki
koshish:**

\`\`\`ts
function detectPromptStuffing(userMessage) {
  const signals = {
    // Repeated, near-identical phrases ki ek unusually badi number —
    // ek pattern jo legitimate questions rarely produce karte hain
    excessiveRepetition: (userMessage.match(/(.{20,})\\1{3,}/g) ?? []).length > 0,

    // Special characters/tokens ka ek suspiciously high ratio jo
    // parsing ko confuse karne ya formatting exploit karne ke liye
    // design kiye gaye hain (ek known adversarial pattern)
    highSpecialCharRatio: (userMessage.match(/[<>{}[\\]\\\\]/g)?.length ?? 0) / userMessage.length > 0.1,

    // Ek unusually long input un cheezon ke liye jo nominally ek
    // simple, short-seeming request type hai (context-dependent — ek
    // chat message jo is specific feature ke liye typical se 10x
    // lamba hai)
    anomalousLength: userMessage.length > EXPECTED_MAX_LENGTH_FOR_THIS_FEATURE,
  };
  return Object.values(signals).some(Boolean);
}
\`\`\`

**Automated scraping via chat — kai crafted questions ke through ek
poori knowledge base ko systematically extract karna, genuinely
questions poochne ke bajaye:**

\`\`\`ts
function detectScrapingPattern(userId, recentQueries) {
  // Ek real user time ke saath varied, topically-scattered questions
  // poochta hai. Ek scraper content ke through ek suspiciously
  // exhaustive, methodical tareeke se kaam karta hai — jaise,
  // alphabetically har product name enumerate karna, ya har FAQ entry
  // ke baare mein sequence mein poochna
  const queryVelocity = recentQueries.length / TIME_WINDOW_MINUTES;
  const isUnusuallyFast = queryVelocity > NORMAL_HUMAN_QUERY_RATE;

  const isSystematicSequence = detectsSequentialEnumerationPattern(recentQueries);
  // jaise, "product A details", "product B details", "product C
  // details" ke liye queries... suspiciously perfect alphabetical
  // order mein, ek human ke plausibly type aur padh sakne se faster
  // aate hue

  return isUnusuallyFast && isSystematicSequence;
}
\`\`\`

**Cost-based limiting (Lesson 1) akela in patterns ko kyun catch nahi
karti:** ek sophisticated abuser ek reasonable token budget ke andar
comfortably reh sakta hai jabki abhi bhi exactly is kism ka abuse
engage kar raha ho — prompt-stuffing aur systematic scraping ko
necessarily per request bahut zyada tokens ki zaroorat nahi hoti; unhe
requests ka ek specific PATTERN chahiye jise ek pure volume/cost cap
recognize karne ka koi mechanism nahi rakhta, kyunki cost-based limiting
sirf track karti hai KITNA consume ho raha hai, consumption KIS SHAPE
mein hai nahi.

**In patterns ko detect karne ke liye time ke saath requests ke across
dekhna kyun zaroori hai, kisi single request ko isolation mein evaluate
karna nahi:** ek single question jo ek attacker ke systematic
enumeration mein 50th item hone ka happen hota hai apne aap mein poori
tarah unremarkable dikhta hai — suspicious signal sirf kai requests ke
across PATTERN se emerge hota hai (unusually high velocity, suspiciously
systematic sequencing, content jo genuine curiosity reflect karne ke
bajaye methodically ek poori knowledge base cover karta hai). Yahi
wajah hai abuse detection ko per user recent request history track
karni chahiye, wahi underlying need jo Lesson 1 ka rate limiter per-
window usage ke liye track karta hai, pattern recognition pe applied
pure volume ke bajaye.

**Practical response ek baar ek pattern flag ho jaaye — rarely ek
immediate hard block:** kyunki pattern-based detection probabilistic
signals produce karti hai certainties nahi, ek reasonable response aksar
graduated hota hai — additional friction (ek CAPTCHA-style challenge,
temporarily reduced rate limits, human review ke liye flagging) ek
immediate, irreversible ban ke bajaye, kyunki ek false positive (ek
genuinely enthusiastic legitimate user jo ek pattern signal trigger
karne ka happen hota hai) ko legitimate confirm hone ka ek lower-cost
path hona chahiye permanently aur incorrectly locked out hone ke
bajaye.`,

    content: `## Why cost-based limiting (Lesson 1) and abuse-pattern detection
address genuinely different threats

Lesson 1's token-bucket limiting correctly bounds how much resource ANY
user — legitimate or not — can consume in a given window, protecting
against runaway cost regardless of intent. But a sophisticated abuser
can deliberately stay within a generous token budget while still
extracting disproportionate value through a specific pattern of
requests — systematically scraping an entire knowledge base's content
one carefully-crafted question at a time, or attempting to manipulate a
model's behavior through adversarially-structured input. Neither of
these necessarily requires enough tokens per request to trip a
cost-based limit; they require recognizing the SHAPE of the usage
pattern, which is a fundamentally different signal than volume alone.

## Why prompt-stuffing signals are about structural anomaly, not
just length

A prompt attempting to overwhelm or manipulate a model's behavior often
has structural characteristics distinguishable from genuine, organic
user input — excessive repetition, an unusual density of special
characters or formatting artifacts, or a length dramatically out of
proportion to what a given feature's typical, legitimate requests look
like. None of these signals alone proves malicious intent (a genuinely
verbose, technically-detailed legitimate question could trigger a
length signal), which is why detection typically combines multiple
signals and treats a match as worth flagging for further scrutiny
rather than treating any single signal as conclusive proof.

## Why scraping detection fundamentally requires looking across
multiple requests over time

A single request in an attacker's systematic scraping sequence is
indistinguishable, in isolation, from a genuine user's single question —
the signal that reveals scraping specifically is the PATTERN across many
requests: unusually high request velocity (faster than a human
plausibly types and reads responses), suspiciously systematic content
coverage (methodically working through an entire catalog rather than
following genuine, organic curiosity), or a sequence that correlates
too perfectly with some external ordering (alphabetical, by ID) that a
genuinely curious human would have no reason to follow so precisely.
This is why abuse-pattern detection, unlike Lesson 1's per-request rate
check, necessarily requires tracking and analyzing a user's recent
request history as a sequence, not evaluating any single request on its
own.

## Why the response to a flagged pattern should typically be
graduated, not an immediate hard block

Pattern-based detection produces probabilistic signals, not certainties
— a genuinely enthusiastic, unusually active legitimate user can
occasionally trigger the same signals a real abuser would. Treating
every flagged pattern as grounds for an immediate, permanent block risks
a real cost: locking out genuine users based on a false positive with
no path to correction. A graduated response (additional friction, a
temporary rate reduction, flagging for human review) provides a
lower-cost way to distinguish a false positive from genuine abuse before
taking an irreversible action, the same underlying "assume you can be
wrong and design for correction" discipline Module 11 established for
this course's reliability patterns, applied here to security decisions
instead of technical failures.`,

    contentHi: `## Cost-based limiting (Lesson 1) aur abuse-pattern detection genuinely alag threats kyun address karte hain

Lesson 1 ki token-bucket limiting correctly bound karti hai ki KOI BHI
user — legitimate ya nahi — ek given window mein kitna resource consume
kar sakta hai, intent se independently runaway cost ke against protect
karte hue. Par ek sophisticated abuser deliberately ek generous token
budget ke andar reh sakta hai jabki abhi bhi requests ke ek specific
pattern ke through disproportionate value extract kar raha ho —
systematically ek poori knowledge base ke content ko ek time pe ek
carefully-crafted question se scrape karna, ya adversarially-structured
input ke through ek model ke behavior ko manipulate karne ki koshish
karna. In mein se koi bhi necessarily itne tokens per request ki
zaroorat nahi rakhta ki ek cost-based limit trip ho jaaye; unhe usage
pattern ka SHAPE recognize karna chahiye, jo akele volume se ek
fundamentally alag signal hai.

## Prompt-stuffing signals sirf length ke bajaye structural anomaly ke baare mein kyun hain

Ek prompt jo ek model ke behavior ko overwhelm ya manipulate karne ki
koshish karta hai aksar structural characteristics rakhta hai genuine,
organic user input se distinguishable — excessive repetition, special
characters ya formatting artifacts ka ek unusual density, ya ek length
jo ek given feature ki typical, legitimate requests dramatically out of
proportion hai. In mein se koi bhi akela malicious intent prove nahi
karta (ek genuinely verbose, technically-detailed legitimate question
ek length signal trigger kar sakta hai), yahi wajah hai detection
typically multiple signals combine karta hai aur ek match ko further
scrutiny ke liye flag karne layak treat karta hai kisi single signal
ko conclusive proof treat karne ke bajaye.

## Scraping detection fundamentally kai requests ke across time mein dekhne ki zaroorat kyun rakhta hai

Ek attacker ki systematic scraping sequence mein ek single request,
isolation mein, ek genuine user ke single question se indistinguishable
hai — wo signal jo specifically scraping reveal karta hai kai requests
ke across PATTERN hai: unusually high request velocity (ek human ke
plausibly type karne aur responses padhne se faster), suspiciously
systematic content coverage (genuine, organic curiosity follow karne
ke bajaye methodically ek poore catalog ke through kaam karna), ya ek
sequence jo kisi external ordering (alphabetical, by ID) ke saath bahut
zyada perfectly correlate karta hai jise ek genuinely curious human ke
paas itna precisely follow karne ki koi wajah na ho. Yahi wajah hai
abuse-pattern detection, Lesson 1 ke per-request rate check ke unlike,
necessarily ek user ki recent request history ko ek sequence ki tarah
track aur analyze karna chahta hai, kisi single request ko apne aap mein
evaluate karna nahi.

## Ek flagged pattern ka response typically graduated kyun hona chahiye, ek immediate hard block nahi

Pattern-based detection probabilistic signals produce karti hai,
certainties nahi — ek genuinely enthusiastic, unusually active
legitimate user occasionally wahi signals trigger kar sakta hai jo ek
real abuser karega. Har flagged pattern ko ek immediate, permanent block
ke liye grounds ki tarah treat karna ek real cost rakhta hai: genuine
users ko ek false positive ke basis pe lock out karna correction ke
liye koi path ke bina. Ek graduated response (additional friction, ek
temporary rate reduction, human review ke liye flagging) ek lower-cost
tareeka provide karta hai ek false positive ko genuine abuse se
distinguish karne ke liye ek irreversible action lene se pehle, wahi
underlying "assume karo ki tum galat ho sakte ho aur correction ke liye
design karo" discipline jo Module 11 ne is course ke reliability
patterns ke liye establish ki, yahan security decisions pe applied
technical failures ke bajaye.`,

    examples: [
      {
        title: 'A combined prompt-stuffing and scraping detector with a graduated response',
        titleHi: 'Ek combined prompt-stuffing aur scraping detector ek graduated response ke saath',
        codeJs: `function detectPromptStuffing(message) {
  const hasExcessiveRepetition = /(.{20,})\\1{3,}/.test(message);
  const specialCharRatio = (message.match(/[<>{}[\\]\\\\]/g)?.length ?? 0) / message.length;
  const isAnomalouslyLong = message.length > 4000; // this feature's typical max is ~500

  return hasExcessiveRepetition || specialCharRatio > 0.1 || isAnomalouslyLong;
}

async function detectScrapingPattern(userId) {
  const recentQueries = await getRecentQueries(userId, { minutes: 10 });
  if (recentQueries.length < 15) return false; // too few to judge a pattern

  const queriesPerMinute = recentQueries.length / 10;
  const isSuspiciouslyFast = queriesPerMinute > 3; // faster than plausible human reading pace

  const isSequential = checkForSequentialEnumeration(recentQueries); // e.g. alphabetical product names

  return isSuspiciouslyFast && isSequential;
}

async function handleChatRequest(userId, message) {
  if (detectPromptStuffing(message)) {
    logSecurityEvent('prompt_stuffing_suspected', { userId, messageLength: message.length });
    // Graduated response — not an immediate ban
    return { requiresChallenge: true, reason: 'Please verify you are not a bot' };
  }

  if (await detectScrapingPattern(userId)) {
    logSecurityEvent('scraping_pattern_suspected', { userId });
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
    // Still allowed to continue, but at a fraction of normal throughput
  }

  return await processMessageNormally(userId, message);
}`,
        codeTs: `function detectPromptStuffing(message: string): boolean {
  const hasExcessiveRepetition = /(.{20,})\\1{3,}/.test(message);
  const specialCharRatio = (message.match(/[<>{}[\\]\\\\]/g)?.length ?? 0) / message.length;
  const isAnomalouslyLong = message.length > 4000; // this feature's typical max is ~500

  return hasExcessiveRepetition || specialCharRatio > 0.1 || isAnomalouslyLong;
}

async function detectScrapingPattern(userId: string): Promise<boolean> {
  const recentQueries = await getRecentQueries(userId, { minutes: 10 });
  if (recentQueries.length < 15) return false; // too few to judge a pattern

  const queriesPerMinute = recentQueries.length / 10;
  const isSuspiciouslyFast = queriesPerMinute > 3; // faster than plausible human reading pace

  const isSequential = checkForSequentialEnumeration(recentQueries); // e.g. alphabetical product names

  return isSuspiciouslyFast && isSequential;
}

async function handleChatRequest(userId: string, message: string) {
  if (detectPromptStuffing(message)) {
    logSecurityEvent('prompt_stuffing_suspected', { userId, messageLength: message.length });
    // Graduated response — not an immediate ban
    return { requiresChallenge: true, reason: 'Please verify you are not a bot' };
  }

  if (await detectScrapingPattern(userId)) {
    logSecurityEvent('scraping_pattern_suspected', { userId });
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
    // Still allowed to continue, but at a fraction of normal throughput
  }

  return await processMessageNormally(userId, message);
}`,
        code: `if (detectPromptStuffing(message)) {
  return { requiresChallenge: true, reason: 'Please verify you are not a bot' };
}
if (await detectScrapingPattern(userId)) {
  await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
}`,
        output:
          "A message with unusual repetition or suspicious structure triggers a graduated challenge rather than an outright block, while a user whose last 10 minutes show 20+ suspiciously sequential queries has their rate limit temporarily reduced to 10% of normal — both responses are reversible and proportionate to a probabilistic signal, not a certainty.",
        explain:
          "Neither detector alone claims certainty — they flag patterns worth additional scrutiny (a challenge, a temporary throttle) rather than triggering an immediate, irreversible ban, correctly treating pattern detection as probabilistic evidence rather than proof, exactly this lesson's point about graduated responses.",
        explainHi:
          "Koi bhi detector akela certainty claim nahi karta — wo un patterns ko flag karte hain jo additional scrutiny (ek challenge, ek temporary throttle) ke layak hain ek immediate, irreversible ban trigger karne ke bajaye, correctly pattern detection ko probabilistic evidence ki tarah treat karte hue proof ke bajaye, exactly is lesson ka graduated responses ke baare mein point.",
      },
    ],

    mistakes: [
      {
        wrong: `// Relying only on cost-based rate limiting, assuming it catches all abuse
async function handleRequest(userId, message) {
  const estimatedTokens = estimateTokens(message);
  const check = tokenLimiter.checkAndRecord(userId, estimatedTokens);
  if (!check.allowed) return { error: 'Rate limited' };
  return await callModel(message);
  // A scraper systematically extracting the entire knowledge base one
  // small, cheap question at a time never trips this limit at all —
  // each individual request is well within budget
}`,
        right: `// Combining cost-based limiting with pattern-based abuse detection
async function handleRequest(userId, message) {
  const estimatedTokens = estimateTokens(message);
  const costCheck = tokenLimiter.checkAndRecord(userId, estimatedTokens);
  if (!costCheck.allowed) return { error: 'Rate limited' };

  if (await detectScrapingPattern(userId)) {
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
  }

  return await callModel(message);
}`,
        why: "Cost-based limiting bounds volume, not intent — a scraper can stay comfortably within a generous token budget by keeping individual requests small while still systematically extracting an entire knowledge base over many requests. Only pattern-based detection, looking across a user's request history, catches this specific category of abuse.",
        whyHi:
          "Cost-based limiting volume ko bound karti hai, intent ko nahi — ek scraper ek generous token budget ke andar comfortably reh sakta hai individual requests ko chhota rakhte hue jabki abhi bhi kai requests ke across systematically ek poori knowledge base extract kar raha ho. Sirf pattern-based detection, ek user ki request history ke across dekhte hue, is specific category ke abuse ko catch karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production knowledge-base chat feature detected a competitor systematically extracting its entire product catalog by noticing that a single account's queries, over a few hours, methodically covered every product name in alphabetical order at a query rate far exceeding plausible human reading speed — a pattern invisible to cost-based rate limiting alone, since each individual query was small and cheap.",
        hi: 'Ek production knowledge-base chat feature ne ek competitor ko apna poora product catalog systematically extract karte hue detect kiya ye notice karke ki ek single account ki queries, kuch hours ke over, methodically har product name ko alphabetical order mein cover karti thi ek query rate pe jo plausible human reading speed se kaafi zyada thi — ek pattern jo akela cost-based rate limiting ke liye invisible tha, kyunki har individual query chhoti aur cheap thi.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't cost-based rate limiting (Lesson 1) alone catch systematic scraping via chat or prompt-stuffing attacks?",
        qHi: 'Cost-based rate limiting (Lesson 1) akela chat ke through systematic scraping ya prompt-stuffing attacks ko kyun catch nahi kar sakti?',
        a: "These attacks don't necessarily require enough tokens per request to trip a cost-based limit — a scraper can extract an entire knowledge base one small, cheap question at a time. What reveals the abuse is the SHAPE of the request pattern (velocity, systematic sequencing, structural anomalies), a signal cost-based limiting, which only tracks volume, has no mechanism to recognize.",
        aHi: 'In attacks ko necessarily ek cost-based limit trip karne ke liye kaafi tokens per request ki zaroorat nahi — ek scraper ek poori knowledge base ko ek time pe ek chhoti, cheap question se extract kar sakta hai. Jo abuse reveal karta hai wo request pattern ka SHAPE hai (velocity, systematic sequencing, structural anomalies), ek signal jise cost-based limiting, jo sirf volume track karti hai, recognize karne ka koi mechanism nahi rakhti.',
      },
      {
        q: 'Why should a flagged abuse pattern typically trigger a graduated response rather than an immediate permanent block?',
        qHi: 'Ek flagged abuse pattern ko typically ek graduated response trigger karna chahiye ek immediate permanent block ke bajaye kyun?',
        a: "Pattern-based detection produces probabilistic signals, not certainties — a genuinely enthusiastic legitimate user can occasionally trigger the same signals a real abuser would. A graduated response (a challenge, a temporary throttle) provides a lower-cost way to distinguish a false positive from genuine abuse, rather than permanently and incorrectly locking out a legitimate user.",
        aHi: 'Pattern-based detection probabilistic signals produce karti hai, certainties nahi — ek genuinely enthusiastic legitimate user occasionally wahi signals trigger kar sakta hai jo ek real abuser karega. Ek graduated response (ek challenge, ek temporary throttle) ek false positive ko genuine abuse se distinguish karne ka ek lower-cost tareeka provide karta hai, ek legitimate user ko permanently aur incorrectly lock out karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A team's cost-based rate limiter shows a specific user comfortably within their token budget every single day, yet the team's analytics reveal this user's queries have, over two weeks, systematically covered every single entry in their internal knowledge base in near-perfect sequential order. Using this lesson's reasoning, explain what's happening and what additional detection should be added.",
        taskHi: 'Ek team ka cost-based rate limiter har single din ek specific user ko unke token budget ke andar comfortably dikhata hai, phir bhi team ki analytics reveal karti hai ki is user ki queries ne, do hafton ke over, systematically unke internal knowledge base ki har single entry ko near-perfect sequential order mein cover kiya hai. Is lesson ki reasoning use karke, explain karo ki kya ho raha hai aur kaunsi additional detection add ki jaani chahiye.',
        hint: "Consider what signal is present in this user's behavior that a pure token/cost check would never see, since it only looks at volume within a single window rather than the shape of a pattern across time.",
        hintHi: 'Consider karo ki is user ke behavior mein kaunsa signal present hai jise ek pure token/cost check kabhi nahi dekhega, kyunki ye sirf ek single window ke andar volume dekhta hai time ke across ek pattern ke shape ko nahi.',
      },
    ],

    keyTakeaways: [
      "Cost-based rate limiting (Lesson 1) bounds volume regardless of intent, but a sophisticated abuser can stay within a generous token budget while still abusing a system through a specific request PATTERN.",
      "Prompt-stuffing detection looks for structural anomalies (excessive repetition, unusual special-character density, anomalous length) that distinguish adversarial input from genuine, organic requests.",
      "Scraping detection requires looking across a user's recent request history over time, since a single request in a systematic extraction sequence is indistinguishable from a genuine question in isolation.",
      "A flagged pattern should typically trigger a graduated response (a challenge, a temporary throttle, human review) rather than an immediate permanent block, since pattern detection produces probabilistic signals, not certainties.",
    ],
    keyTakeawaysHi: [
      'Cost-based rate limiting (Lesson 1) intent se independently volume bound karti hai, par ek sophisticated abuser ek generous token budget ke andar reh sakta hai jabki abhi bhi ek specific request PATTERN ke through ek system abuse kar raha ho.',
      'Prompt-stuffing detection structural anomalies dhundhta hai (excessive repetition, unusual special-character density, anomalous length) jo adversarial input ko genuine, organic requests se distinguish karte hain.',
      'Scraping detection ko time ke saath ek user ki recent request history ke across dekhne ki zaroorat hai, kyunki ek systematic extraction sequence mein ek single request isolation mein ek genuine question se indistinguishable hai.',
      'Ek flagged pattern ko typically ek graduated response trigger karna chahiye (ek challenge, ek temporary throttle, human review) ek immediate permanent block ke bajaye, kyunki pattern detection probabilistic signals produce karti hai, certainties nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-per-user-quotas-and-rate-limiting-math',
    title: 'Per-User/Per-Tier Quotas & the Different Rate-Limiting Math',
    titleHi: 'Per-User/Per-Tier Quotas Aur Alag Rate-Limiting Math',
    description:
      "Closing this module: extending Lesson 1's single token bucket into a full production quota system with per-tier limits, and the practical unit-economics math (Module 10) that determines what a sustainable quota actually looks like for a real business.",
    descriptionHi:
      'Is module ko close karte hue: Lesson 1 ke single token bucket ko ek poore production quota system tak extend karna per-tier limits ke saath, aur practical unit-economics math (Module 10) jo determine karta hai ki ek sustainable quota ek real business ke liye actually kaisa dikhta hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A gym with a single membership tier and identical access for everyone, versus one offering a free trial with limited hours, a standard membership with normal access, and a premium tier with 24/7 access and extra services — each tier's actual cost of service genuinely differing, and each priced or limited accordingly.** A gym with one identical tier for everyone has to pick a single limit that's either too generous for casual users (wasting capacity) or too restrictive for serious ones (losing their business) — there's no way to serve genuinely different usage patterns well with one fixed policy. A gym with real tiers matches each member's actual usage pattern and the real cost of serving them to an appropriate limit and price — a free trial member gets meaningfully less than someone paying for unlimited premium access, and this isn't unfair, it's the gym correctly matching what it provides to what each tier's membership actually costs to deliver. An AI product needs exactly this tiered structure: Lesson 1's single token bucket is the one-size-fits-all gym membership — a reasonable start, but a real product with free, paid, and enterprise tiers needs per-tier quotas that correctly reflect each tier's actual unit economics (Module 10), not one arbitrary number applied uniformly to users with genuinely different usage patterns and different amounts they're paying for the privilege.",
      hi: 'Ek gym ek single membership tier ke saath aur sabke liye identical access, versus ek jo ek free trial offer karta hai limited hours ke saath, ek standard membership normal access ke saath, aur ek premium tier 24/7 access aur extra services ke saath — har tier ka actual cost of service genuinely alag, aur har ek accordingly priced ya limited. Ek gym jiska sabke liye ek identical tier hai use ek single limit choose karna padta hai jo ya to casual users ke liye bahut generous hai (capacity waste karte hue) ya serious users ke liye bahut restrictive (unka business kho dete hue) — genuinely alag usage patterns ko ek fixed policy se achhi tarah serve karne ka koi tareeka nahi hai. Real tiers wala ek gym har member ke actual usage pattern aur unhe serve karne ke real cost ko ek appropriate limit aur price se match karta hai — ek free trial member ko meaningfully kam milta hai us se jo unlimited premium access ke liye pay kar raha hai, aur ye unfair nahi hai, ye gym ka correctly match karna hai ki ye kya provide karta hai us se jo har tier ki membership actually deliver karne mein cost karti hai. Ek AI product ko exactly ye tiered structure chahiye: Lesson 1 ka single token bucket wo one-size-fits-all gym membership hai — ek reasonable start, par ek real product jiske paas free, paid, aur enterprise tiers hain use per-tier quotas chahiye jo har tier ki actual unit economics (Module 10) ko correctly reflect karein, ek arbitrary number nahi jo uniformly un users pe applied ho jinke genuinely alag usage patterns aur is privilege ke liye alag amounts pay karne hain.',
    },

    simple: `**Extending Lesson 1's single bucket into per-tier quotas — the
production shape a real product needs:**

\`\`\`ts
const TIER_QUOTAS = {
  free: { tokensPerDay: 50_000, requestsPerMinute: 5 },
  pro: { tokensPerDay: 2_000_000, requestsPerMinute: 60 },
  enterprise: { tokensPerDay: 50_000_000, requestsPerMinute: 500 },
};

class TieredTokenLimiter {
  constructor() {
    this.usage = new Map(); // userId -> { tokensUsedToday, dayStart }
  }

  checkAndRecord(userId, userTier, estimatedTokens) {
    const quota = TIER_QUOTAS[userTier];
    const now = Date.now();
    let record = this.usage.get(userId);

    if (!record || !isSameDay(record.dayStart, now)) {
      record = { tokensUsedToday: 0, dayStart: now };
    }

    if (record.tokensUsedToday + estimatedTokens > quota.tokensPerDay) {
      return { allowed: false, reason: \`Daily token quota exceeded for \${userTier} tier\` };
    }

    record.tokensUsedToday += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}
\`\`\`

**Why per-tier limits need to be derived from Module 10's unit
economics, not picked arbitrarily:**

\`\`\`
A quota isn't just "a number that sounds reasonable" — it's a direct
lever on Module 10's cost math:

  Free tier: 50,000 tokens/day * (input+output blended cost per token)
  = a concrete daily cost ceiling PER FREE USER, which needs to be
  weighed against the free tier's actual business value (conversion to
  paid, brand goodwill) the same way Module 10, Lesson 1 weighed any
  feature's cost against its value

  Pro tier: priced to cover its own actual token cost (Module 10,
  Lesson 1's estimation) plus margin — a quota set too generously
  relative to the subscription price genuinely loses money per heavy
  user, while one set too restrictively drives paying customers away
\`\`\`

**Why free-tier quotas specifically need the tightest scrutiny:** a
free tier has no direct revenue offsetting its cost — every token
consumed by a free user is a pure cost the business absorbs, hoping for
indirect value (future conversion, word-of-mouth, brand presence). This
makes the free tier's quota the most directly exposed to Module 10's
cost-vs-value tradeoff, and the tier most likely to be targeted by abuse
(Lesson 2) specifically because it requires no payment method,
lowering the cost of creating many abusive accounts.

**Why this quota system needs to combine everything from this module,
not just token counts:**

\`\`\`ts
async function handleTieredRequest(userId, userTier, message) {
  const estimatedTokens = estimateTokens(message) + 500;

  // LESSON 1 — cost-based check, now per-tier
  const quotaCheck = tieredLimiter.checkAndRecord(userId, userTier, estimatedTokens);
  if (!quotaCheck.allowed) return { error: quotaCheck.reason };

  // LESSON 2 — pattern-based abuse detection, same for every tier
  // (abuse doesn't become acceptable just because someone is paying)
  if (detectPromptStuffing(message)) {
    return { requiresChallenge: true };
  }
  if (await detectScrapingPattern(userId)) {
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
  }

  return await callModel(message);
}
\`\`\`

**How this closes the module's arc:** Lesson 1 established the correct
unit (tokens, not requests); Lesson 2 established detecting deliberate
abuse patterns a pure volume check misses; this lesson assembles both
into the actual production shape — per-tier quotas grounded in Module
10's real unit economics, with Lesson 2's abuse detection applied
uniformly across every tier, since a paying customer engaging in
scraping or prompt-stuffing is exactly as much of a problem as a free
one, just with different financial stakes attached to how the situation
gets resolved.`,

    simpleHi: `**Lesson 1 ke single bucket ko per-tier quotas tak extend karna —
production shape jo ek real product chahta hai:**

\`\`\`ts
const TIER_QUOTAS = {
  free: { tokensPerDay: 50_000, requestsPerMinute: 5 },
  pro: { tokensPerDay: 2_000_000, requestsPerMinute: 60 },
  enterprise: { tokensPerDay: 50_000_000, requestsPerMinute: 500 },
};

class TieredTokenLimiter {
  constructor() {
    this.usage = new Map(); // userId -> { tokensUsedToday, dayStart }
  }

  checkAndRecord(userId, userTier, estimatedTokens) {
    const quota = TIER_QUOTAS[userTier];
    const now = Date.now();
    let record = this.usage.get(userId);

    if (!record || !isSameDay(record.dayStart, now)) {
      record = { tokensUsedToday: 0, dayStart: now };
    }

    if (record.tokensUsedToday + estimatedTokens > quota.tokensPerDay) {
      return { allowed: false, reason: \`Daily token quota exceeded for \${userTier} tier\` };
    }

    record.tokensUsedToday += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}
\`\`\`

**Per-tier limits ko Module 10 ki unit economics se kyun derive karna
chahiye, arbitrarily pick karne ke bajaye:**

\`\`\`
Ek quota sirf "ek number jo reasonable lagta hai" nahi hai — ye Module
10 ke cost math pe ek direct lever hai:

  Free tier: 50,000 tokens/day * (input+output blended cost per token)
  = ek concrete daily cost ceiling PER FREE USER, jise free tier ki
  actual business value (paid mein conversion, brand goodwill) ke
  against weigh karna chahiye wahi tarike se jaise Module 10, Lesson 1
  ne kisi bhi feature ki cost ko uski value ke against weigh kiya

  Pro tier: apni actual token cost (Module 10, Lesson 1 ka estimation)
  plus margin cover karne ke liye priced — ek quota jo subscription
  price ke against bahut zyada generously set kiya gaya genuinely
  per heavy user paisa kho deta hai, jabki ek jo bahut restrictively
  set kiya gaya paying customers ko door bhaga deta hai
\`\`\`

**Free-tier quotas ko specifically sabse tightest scrutiny kyun
chahiye:** ek free tier ke paas uski cost offset karne ke liye koi
direct revenue nahi hai — ek free user dwara consume kiya gaya har
token ek pure cost hai jise business absorb karta hai, indirect value
ki umeed karte hue (future conversion, word-of-mouth, brand presence).
Ye free tier ke quota ko Module 10 ke cost-vs-value tradeoff ke liye
sabse directly exposed banata hai, aur us tier ko abuse (Lesson 2) se
target hone ki sabse zyada likelihood wala banata hai specifically
kyunki isko koi payment method ki zaroorat nahi, kai abusive accounts
banane ki cost ko kam karte hue.

**Ye quota system ko is module se sab kuch combine karne ki zaroorat
kyun hai, sirf token counts nahi:**

\`\`\`ts
async function handleTieredRequest(userId, userTier, message) {
  const estimatedTokens = estimateTokens(message) + 500;

  // LESSON 1 — cost-based check, ab per-tier
  const quotaCheck = tieredLimiter.checkAndRecord(userId, userTier, estimatedTokens);
  if (!quotaCheck.allowed) return { error: quotaCheck.reason };

  // LESSON 2 — pattern-based abuse detection, har tier ke liye wahi
  // (abuse acceptable nahi ban jaata sirf isliye kyunki koi pay kar raha hai)
  if (detectPromptStuffing(message)) {
    return { requiresChallenge: true };
  }
  if (await detectScrapingPattern(userId)) {
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
  }

  return await callModel(message);
}
\`\`\`

**Ye module ke arc ko kaise close karta hai:** Lesson 1 ne correct unit
establish ki (tokens, requests nahi); Lesson 2 ne deliberate abuse
patterns detect karna establish kiya jise ek pure volume check miss
karta hai; ye lesson dono ko actual production shape mein assemble
karta hai — per-tier quotas jo Module 10 ki real unit economics mein
grounded hain, Lesson 2 ki abuse detection ke saath har tier ke across
uniformly applied, kyunki ek paying customer jo scraping ya prompt-
stuffing mein engage kar raha hai exactly utni hi problem hai jitna ek
free wala, bas alag financial stakes ke saath ki situation kaise resolve
hoti hai.`,

    content: `## Why a single global rate limit is a reasonable starting point
but not a production-shaped solution

Lesson 1's token-bucket limiter demonstrated the correct unit for
limiting AI usage, using one shared limit for simplicity. A real product
almost always has genuinely different classes of user — free trial
users, paying subscribers, enterprise customers with negotiated
contracts — whose appropriate usage limits and actual cost tolerance
differ substantially. Applying one uniform limit across all of them
forces an unwinnable tradeoff: a limit generous enough for enterprise
needs is far too permissive for free-tier cost control, while a limit
tight enough to control free-tier cost frustrates paying customers who
have every reason to expect more.

## Why per-tier quotas must be derived from Module 10's unit
economics rather than picked arbitrarily

A tier's quota is not merely a UX decision about "how much access feels
fair" — it's a direct, quantifiable lever on the cost math Module 10,
Lesson 1 established. A free tier's daily token quota, multiplied by the
per-token cost and the number of free users, is a real, ongoing expense
with no direct revenue offsetting it; this number needs to be
consciously weighed against the free tier's actual business value
(conversion funnel, brand presence), the same value-versus-cost judgment
Module 10 applied to any feature. A paid tier's quota needs to be set
so the tier's price genuinely covers its expected cost plus a sustainable
margin — setting it without this analysis risks a tier that quietly
loses money on its heaviest users.

## Why the free tier specifically warrants the tightest scrutiny of
both cost and abuse

The free tier combines two of this module's biggest risk factors: zero
direct revenue offsetting its actual cost (making Module 10's
cost-vs-value tradeoff the most exposed at this tier), and typically no
payment method required to sign up (which lowers the cost of an
attacker creating many abusive accounts, making Lesson 2's abuse
patterns most likely to concentrate here). A production system
reasonably applies its tightest quotas and most vigilant abuse detection
specifically to this tier, not because free users are inherently
suspect, but because this is exactly where the module's two central
risks — uncontrolled cost and undetected abuse — compound most severely.

## How this lesson assembles the module's complete arc

Lesson 1 established that the correct rate-limiting unit is cost
(tokens), not request count. Lesson 2 established that cost-based
limiting alone doesn't catch deliberate abuse patterns, which require
looking across a user's request history over time. This lesson combines
both into the actual production architecture a real system needs:
per-tier quotas correctly grounded in each tier's real unit economics
(Module 10), with abuse-pattern detection applied uniformly across every
tier regardless of payment status, since a paying customer's abuse is
exactly as real a problem as a free user's — the underlying threat this
module identifies doesn't care whether the account attached to it is
generating revenue.`,

    contentHi: `## Ek single global rate limit ek reasonable starting point kyun hai par ek production-shaped solution nahi

Lesson 1 ka token-bucket limiter simplicity ke liye ek shared limit use
karte hue AI usage limit karne ke liye correct unit demonstrate karta
hai. Ek real product mein almost hamesha genuinely alag classes of user
hote hain — free trial users, paying subscribers, negotiated contracts
wale enterprise customers — jinki appropriate usage limits aur actual
cost tolerance substantially alag hote hain. In sab pe ek uniform limit
apply karna ek unwinnable tradeoff force karta hai: ek limit jo
enterprise needs ke liye generous hai free-tier cost control ke liye
bahut zyada permissive hai, jabki ek limit jo free-tier cost control
karne ke liye tight hai paying customers ko frustrate karti hai jinke
paas zyada expect karne ki har wajah hai.

## Per-tier quotas Module 10 ki unit economics se kyun derive kiye jaane chahiye arbitrarily pick karne ke bajaye

Ek tier ka quota sirf "kitni access fair lagti hai" ke baare mein ek
UX decision nahi hai — ye Module 10, Lesson 1 ne establish ki us cost
math pe ek direct, quantifiable lever hai. Ek free tier ka daily token
quota, per-token cost aur free users ki number se multiplied, koi direct
revenue offset kiye bina ek real, ongoing expense hai; is number ko
consciously free tier ki actual business value (conversion funnel,
brand presence) ke against weigh karna chahiye, wahi value-versus-cost
judgment jo Module 10 ne kisi bhi feature pe apply kiya. Ek paid tier ka
quota is tarike se set kiya jaana chahiye ki tier ki price genuinely
uski expected cost plus ek sustainable margin cover kare — is analysis
ke bina ise set karna ek tier ka risk rakhta hai jo apne heaviest users
pe quietly paisa khota hai.

## Free tier ko specifically dono cost aur abuse ki tightest scrutiny kyun deserve karti hai

Free tier is module ke do sabse bade risk factors ko combine karta hai:
uski actual cost ko offset karne wala zero direct revenue (Module 10 ke
cost-vs-value tradeoff ko is tier pe sabse zyada exposed banate hue),
aur typically sign up karne ke liye koi payment method ki zaroorat nahi
(jo ek attacker ke kai abusive accounts banane ki cost kam karta hai,
Lesson 2 ke abuse patterns ko yahan concentrate hone ki sabse zyada
likelihood banate hue). Ek production system reasonably apne tightest
quotas aur sabse vigilant abuse detection specifically is tier pe apply
karta hai, is wajah se nahi ki free users inherently suspect hain,
balki is wajah se ki yahi exactly wo jagah hai jahan module ke do
central risks — uncontrolled cost aur undetected abuse — sabse zyada
severely compound hote hain.

## Ye lesson module ke complete arc ko kaise assemble karta hai

Lesson 1 ne establish kiya ki correct rate-limiting unit cost hai
(tokens), request count nahi. Lesson 2 ne establish kiya ki akela
cost-based limiting deliberate abuse patterns catch nahi karti, jinhe
time ke saath ek user ki request history ke across dekhne ki zaroorat
hai. Ye lesson dono ko actual production architecture mein combine
karta hai jo ek real system chahta hai: per-tier quotas jo har tier ki
real unit economics (Module 10) mein correctly grounded hain, har tier
ke across uniformly applied Lesson 2 ki abuse-pattern detection ke saath
payment status se independently, kyunki ek paying customer ka abuse
exactly utni hi real problem hai jitna ek free user ka — is module ka
identify kiya underlying threat parwah nahi karta ki usse attached
account revenue generate kar raha hai ya nahi.`,

    examples: [
      {
        title: 'A complete tiered quota system combining Module 10\'s cost math with Lesson 2\'s abuse detection',
        titleHi: 'Ek complete tiered quota system jo Module 10 ke cost math ko Lesson 2 ki abuse detection ke saath combine karta hai',
        codeJs: `// Tier limits derived from Module 10's actual unit economics, not
// picked arbitrarily
const PRICING = { inputPerM: 3, outputPerM: 15 }; // $ per million tokens

const TIER_QUOTAS = {
  // Free: capped low specifically because there's no revenue to offset
  // the cost — the daily ceiling represents a conscious, bounded
  // "acquisition cost" the business accepts
  free: { tokensPerDay: 50_000 }, // ~$0.50-0.75/day max cost per free user

  // Pro: priced at $20/month; quota set so a typical user's actual
  // cost leaves a sustainable margin under that price
  pro: { tokensPerDay: 2_000_000 }, // ~$20-30/day worst case — priced with margin in mind

  enterprise: { tokensPerDay: 50_000_000 }, // negotiated contract, custom pricing
};

class TieredTokenLimiter {
  constructor() { this.usage = new Map(); }

  checkAndRecord(userId, tier, estimatedTokens) {
    const quota = TIER_QUOTAS[tier];
    const now = Date.now();
    let record = this.usage.get(userId) ?? { tokensUsedToday: 0, dayStart: now };
    if (!isSameDay(record.dayStart, now)) record = { tokensUsedToday: 0, dayStart: now };

    if (record.tokensUsedToday + estimatedTokens > quota.tokensPerDay) {
      return { allowed: false, reason: \`\${tier} tier daily quota exceeded\` };
    }
    record.tokensUsedToday += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

const limiter = new TieredTokenLimiter();

async function handleRequest(userId, tier, message) {
  const estimatedTokens = estimateTokens(message) + 500;
  const quotaCheck = limiter.checkAndRecord(userId, tier, estimatedTokens);
  if (!quotaCheck.allowed) return { error: quotaCheck.reason };

  // Abuse detection applies EQUALLY regardless of tier — a paying
  // enterprise customer's account being used for scraping is just as
  // real a problem as a free user's
  if (detectPromptStuffing(message)) return { requiresChallenge: true };
  if (await detectScrapingPattern(userId)) {
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
  }

  return await callModel(message);
}`,
        codeTs: `// Tier limits derived from Module 10's actual unit economics, not
// picked arbitrarily
const PRICING = { inputPerM: 3, outputPerM: 15 }; // $ per million tokens

const TIER_QUOTAS: Record<string, { tokensPerDay: number }> = {
  // Free: capped low specifically because there's no revenue to offset
  // the cost — the daily ceiling represents a conscious, bounded
  // "acquisition cost" the business accepts
  free: { tokensPerDay: 50_000 }, // ~$0.50-0.75/day max cost per free user

  // Pro: priced at $20/month; quota set so a typical user's actual
  // cost leaves a sustainable margin under that price
  pro: { tokensPerDay: 2_000_000 }, // ~$20-30/day worst case — priced with margin in mind

  enterprise: { tokensPerDay: 50_000_000 }, // negotiated contract, custom pricing
};

interface UsageRecord { tokensUsedToday: number; dayStart: number; }

class TieredTokenLimiter {
  private usage = new Map<string, UsageRecord>();

  checkAndRecord(userId: string, tier: string, estimatedTokens: number): { allowed: boolean; reason?: string } {
    const quota = TIER_QUOTAS[tier];
    const now = Date.now();
    let record = this.usage.get(userId) ?? { tokensUsedToday: 0, dayStart: now };
    if (!isSameDay(record.dayStart, now)) record = { tokensUsedToday: 0, dayStart: now };

    if (record.tokensUsedToday + estimatedTokens > quota.tokensPerDay) {
      return { allowed: false, reason: \`\${tier} tier daily quota exceeded\` };
    }
    record.tokensUsedToday += estimatedTokens;
    this.usage.set(userId, record);
    return { allowed: true };
  }
}

const limiter = new TieredTokenLimiter();

async function handleRequest(userId: string, tier: string, message: string) {
  const estimatedTokens = estimateTokens(message) + 500;
  const quotaCheck = limiter.checkAndRecord(userId, tier, estimatedTokens);
  if (!quotaCheck.allowed) return { error: quotaCheck.reason };

  // Abuse detection applies EQUALLY regardless of tier — a paying
  // enterprise customer's account being used for scraping is just as
  // real a problem as a free user's
  if (detectPromptStuffing(message)) return { requiresChallenge: true };
  if (await detectScrapingPattern(userId)) {
    await temporarilyReduceRateLimit(userId, { factor: 0.1, durationMinutes: 30 });
  }

  return await callModel(message);
}`,
        code: `const TIER_QUOTAS = {
  free: { tokensPerDay: 50_000 },       // ~$0.50-0.75/day max cost — a bounded acquisition cost
  pro: { tokensPerDay: 2_000_000 },     // priced with margin relative to subscription price
  enterprise: { tokensPerDay: 50_000_000 }, // negotiated
};
// Abuse detection (Lesson 2) applies identically across every tier`,
        output:
          "A free user hits their 50,000-token daily quota after a handful of substantial conversations, correctly bounding the business's per-free-user cost exposure. A pro subscriber has 40x that quota, reflecting both their higher expected usage and the fact that their subscription revenue covers the cost. An enterprise account flagged for a scraping pattern gets its rate temporarily reduced exactly like a free account would — payment status doesn't exempt anyone from abuse detection.",
        explain:
          "The comments alongside each tier's quota make explicit that these numbers trace back to real cost math (Module 10) rather than being arbitrary round numbers, and the abuse-detection call is identical regardless of which tier's code path it's reached from — demonstrating this lesson's point that Lesson 2's protections aren't a free-tier-only concern.",
        explainHi:
          "Har tier ke quota ke saath comments explicitly batate hain ki ye numbers real cost math (Module 10) tak wapas trace hote hain arbitrary round numbers hone ke bajaye, aur abuse-detection call identical hai chahe ye kisi bhi tier ke code path se reach hui ho — is lesson ke point ko demonstrate karte hue ki Lesson 2 ki protections sirf ek free-tier concern nahi hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Picking a quota number arbitrarily, without deriving it from actual cost math
const TIER_QUOTAS = {
  free: { tokensPerDay: 1_000_000 }, // "sounds generous enough"
  pro: { tokensPerDay: 5_000_000 },  // "5x the free tier feels fair"
};
// No connection to actual per-token pricing, the free tier's lack of
// revenue, or whether the pro tier's subscription price actually
// covers 5,000,000 tokens' worth of real cost per day`,
        right: `// Deriving each tier's quota from Module 10's actual cost math
const PRICING = { inputPerM: 3, outputPerM: 15 };
const FREE_TIER_MAX_DAILY_COST = 0.75; // a conscious, bounded acquisition-cost decision
const freeTierTokenQuota = Math.floor(
  (FREE_TIER_MAX_DAILY_COST / ((PRICING.inputPerM + PRICING.outputPerM) / 2)) * 1_000_000,
);

const PRO_SUBSCRIPTION_PRICE = 20; // $/month
const PRO_TARGET_MARGIN = 0.6; // 60% margin target
const proTierMonthlyTokenBudget = Math.floor(
  ((PRO_SUBSCRIPTION_PRICE * (1 - PRO_TARGET_MARGIN)) / ((PRICING.inputPerM + PRICING.outputPerM) / 2)) * 1_000_000,
);
// Every quota traces back to an explicit cost/value decision, not a
// round number chosen for how it sounds`,
        why: "A quota that isn't grounded in actual per-token cost math is essentially a guess about the business's real cost exposure — it can silently lose money on heavy users (too generous) or frustrate paying customers (too restrictive) without anyone realizing why, since the number was never actually connected to Module 10's cost/value framework in the first place.",
        whyHi:
          "Ek quota jo actual per-token cost math mein grounded nahi hai essentially business ki real cost exposure ke baare mein ek guess hai — ye silently heavy users pe paisa kho sakta hai (bahut generous) ya paying customers ko frustrate kar sakta hai (bahut restrictive) bina kisi ke ye realize kiye ki kyun, kyunki number kabhi actually Module 10 ke cost/value framework se connected tha hi nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production AI SaaS product explicitly ties its free-tier daily token quota to a target maximum acquisition cost per free signup (a figure their finance team set based on expected conversion rates), and separately sets each paid tier's quota so that tier's subscription price maintains a target margin even for a customer who fully utilizes their daily allowance — both numbers traceable directly to Module 10's cost math, not chosen for how they sound.",
        hi: 'Ek production AI SaaS product apne free-tier daily token quota ko explicitly per free signup ek target maximum acquisition cost se tie karta hai (ek figure jo unki finance team ne expected conversion rates ke basis pe set kiya), aur separately har paid tier ka quota is tarike se set karta hai ki wo tier ki subscription price ek target margin maintain kare even ek customer ke liye jo apna daily allowance poori tarah use karta hai — dono numbers directly Module 10 ke cost math tak traceable hain, ye kaise sound karte hain iske liye choose nahi kiye gaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a real product need per-tier rate limit quotas rather than one single global limit for everyone?',
        qHi: 'Ek real product ko sabke liye ek single global limit ke bajaye per-tier rate limit quotas kyun chahiye?',
        a: "A real product has genuinely different classes of user (free, paid, enterprise) with substantially different appropriate usage levels and cost tolerance. One uniform limit forces an unwinnable tradeoff: generous enough for enterprise needs is far too permissive for free-tier cost control, while tight enough to control free-tier cost frustrates paying customers who reasonably expect more for their subscription.",
        aHi: 'Ek real product ke paas genuinely alag classes of user hain (free, paid, enterprise) substantially alag appropriate usage levels aur cost tolerance ke saath. Ek uniform limit ek unwinnable tradeoff force karta hai: enterprise needs ke liye generous free-tier cost control ke liye bahut zyada permissive hai, jabki free-tier cost control karne ke liye tight paying customers ko frustrate karta hai jo apni subscription ke liye reasonably zyada expect karte hain.',
      },
      {
        q: "Why does the free tier specifically warrant the tightest scrutiny of both cost and abuse detection?",
        qHi: 'Free tier ko specifically dono cost aur abuse detection ki tightest scrutiny kyun deserve karti hai?',
        a: "The free tier has zero direct revenue offsetting its actual cost, making Module 10's cost-vs-value tradeoff most exposed here, and typically requires no payment method to sign up, lowering the cost of creating many abusive accounts and concentrating Lesson 2's abuse risks at this tier specifically.",
        aHi: 'Free tier ke paas uski actual cost offset karne wala zero direct revenue hai, Module 10 ke cost-vs-value tradeoff ko yahan sabse zyada exposed banate hue, aur typically sign up karne ke liye koi payment method ki zaroorat nahi hoti, kai abusive accounts banane ki cost kam karte hue aur Lesson 2 ke abuse risks ko specifically is tier pe concentrate karte hue.',
      },
    ],

    exercises: [
      {
        task: "A team sets their free tier's daily quota to 500,000 tokens because '500k felt like a nice round number,' with no connection to actual token pricing or expected conversion rates. Using this lesson's reasoning, describe the analysis they should do instead to set this number correctly.",
        taskHi: 'Ek team apne free tier ka daily quota 500,000 tokens set karti hai kyunki \'500k ek nice round number lagta tha,\' actual token pricing ya expected conversion rates se koi connection ke bina. Is lesson ki reasoning use karke, us analysis describe karo jo unhe iske bajaye ye number correctly set karne ke liye karni chahiye.',
        hint: "Connect this back to Module 10, Lesson 1's cost estimation and the value-versus-cost comparison it required — what would the free tier's actual daily cost be at this quota, and what business value would need to justify that cost?",
        hintHi: 'Ise wapas Module 10, Lesson 1 ke cost estimation aur value-versus-cost comparison se connect karo jo ise chahiye thi — is quota pe free tier ki actual daily cost kya hogi, aur kaunsi business value us cost ko justify karne ke liye chahiye hogi?',
      },
    ],

    keyTakeaways: [
      "A single global rate limit is a reasonable starting point but not production-shaped — a real product's genuinely different user classes (free, paid, enterprise) need per-tier quotas reflecting their different appropriate usage and cost tolerance.",
      "Per-tier quotas must be derived from Module 10's actual unit economics, not picked as arbitrary round numbers — each tier's limit is a direct, quantifiable lever on real cost math.",
      "The free tier warrants the tightest scrutiny because it combines this module's two central risks most severely: zero revenue offsetting its cost, and typically no payment method required, concentrating abuse risk.",
      "Abuse-pattern detection (Lesson 2) must apply identically across every tier regardless of payment status — a paying customer's abuse is exactly as real a problem as a free user's.",
    ],
    keyTakeawaysHi: [
      'Ek single global rate limit ek reasonable starting point hai par production-shaped nahi — ek real product ke genuinely alag user classes (free, paid, enterprise) ko per-tier quotas chahiye jo unki alag appropriate usage aur cost tolerance reflect karein.',
      'Per-tier quotas ko Module 10 ki actual unit economics se derive kiya jaana chahiye, arbitrary round numbers ki tarah pick nahi kiya jaana chahiye — har tier ki limit real cost math pe ek direct, quantifiable lever hai.',
      'Free tier ko sabse tightest scrutiny deserve karti hai kyunki ye is module ke do central risks ko sabse severely combine karta hai: uski cost offset karne wala zero revenue, aur typically koi payment method ki zaroorat nahi, abuse risk ko concentrate karte hue.',
      'Abuse-pattern detection (Lesson 2) ko har tier ke across identically apply karna chahiye payment status se independently — ek paying customer ka abuse exactly utni hi real problem hai jitna ek free user ka.',
    ],
  },
];
