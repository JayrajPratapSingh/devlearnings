/**
 * Generative AI Complete Course — Module 18: Observability for AI Features, lessons 1-3.
 *
 * Lesson 1: Tracing prompts and completions — why an AI feature needs a different observability shape.
 * Lesson 2: Drift detection — noticing when a model's real-world behavior quietly changes.
 * Lesson 3: A/B testing prompts and models, and cost dashboards as a first-class observability signal.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_18: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-tracing-prompts-and-completions',
    title: 'Tracing Prompts & Completions — Why AI Features Need a Different Observability Shape',
    titleHi: 'Tracing Prompts & Completions — AI Features Ko Ek Different Observability Shape Kyun Chahiye',
    description:
      "Traditional observability (logs, metrics, traces) was designed around deterministic code paths — an AI feature's actual behavior lives in the prompt and completion content itself, which standard request logging typically never captures.",
    descriptionHi:
      'Traditional observability (logs, metrics, traces) deterministic code paths ke around design ki gayi thi — ek AI feature ka actual behavior prompt aur completion content mein khud rehta hai, jise standard request logging typically kabhi capture nahi karti.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: "**A restaurant's kitchen logbook that records exactly which order ticket came in and when the dish left the pass, versus one that also records the actual recipe variations the chef improvised for that specific dish that night.** A kitchen that only logs \"order #47 received at 7:14pm, dish served at 7:26pm\" can tell you the restaurant is running normally from a pure timing standpoint — but if a customer complains the dish tasted wrong, that log tells you nothing about WHY, because it never recorded what the chef actually did differently that night (swapped an ingredient, adjusted a seasoning on the fly, was asked to make it milder). A kitchen that also logs the chef's actual real-time decisions for each dish — not just the timing of when it went out — can actually diagnose a quality complaint, because the content of what happened, not just whether it happened on schedule, is where the actual variability and actual problems live. Traditional software observability is like the first logbook: it excellently answers \"did the request complete, and how fast\" for code whose behavior is fully determined by its inputs and its unchanging logic. An AI feature is like the kitchen where the chef improvises: the same code path can produce meaningfully different actual behavior every single time depending on the model's specific output, which is why observability for AI features must capture the actual prompt and completion CONTENT, not just whether and how fast a request completed.",
      hi: 'ek restaurant ka kitchen logbook jo exactly record karta hai kaunsa order ticket aaya aur kab dish pass se nikli, versus ek jo bhi actual recipe variations record karta hai jo chef ne us specific dish ke liye us raat improvise kiye. Ek kitchen jo sirf log karti hai "order #47 received at 7:14pm, dish served at 7:26pm" aapko bata sakti hai ki restaurant normally chal raha hai pure timing standpoint se — par agar ek customer complain karta hai ki dish ka taste galat tha, wo log aapko WHY ke baare mein kuch nahi batata, kyunki isne kabhi record nahi kiya ki chef ne actually us raat kya alag kiya (ek ingredient swap kiya, ek seasoning fly pe adjust kiya, milder banane ke liye kaha gaya tha). Ek kitchen jo bhi chef ke actual real-time decisions ko har dish ke liye log karti hai — sirf timing nahi jab ye gaya — actually ek quality complaint diagnose kar sakti hai, kyunki jo hua uska content, sirf ye nahi ki wo schedule pe hua, wahan hai jahan actual variability aur actual problems rehte hain. Traditional software observability pehle logbook jaisi hai: ye excellently answer karti hai "kya request complete hui, aur kitni fast" us code ke liye jiska behavior poori tarah uske inputs aur uske unchanging logic se determined hai. Ek AI feature us kitchen jaisa hai jahan chef improvise karta hai: wahi code path meaningfully different actual behavior produce kar sakta hai har single baar model ke specific output pe depend karte hue, yahi wajah hai AI features ke liye observability ko actual prompt aur completion CONTENT capture karna chahiye, sirf ye nahi ki kya aur kitni fast ek request complete hui.',
    },

    simple: `**Why standard request logging — timing, status codes, error
rates — is necessary but genuinely insufficient for an AI feature:**

\`\`\`
Standard observability (Module-level concepts from typical backend
work: request duration, HTTP status, error rate) tells you WHETHER a
request to an LLM API succeeded and HOW LONG it took — this is still
necessary and should absolutely be collected. But it tells you NOTHING
about whether the actual completion content was good, appropriate, or
correct — a request can succeed in 200ms with a 200 status code and
still return a badly hallucinated or unhelpful response.
\`\`\`

**A concrete tracing pattern — capturing the full prompt/completion
pair, not just the metadata around the call:**

\`\`\`ts
interface AiCallTrace {
  requestId: string;
  timestamp: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  completion: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  // Metadata connecting this AI call back to the broader application
  // context — which feature, which user flow, triggered this call
  featureContext: string;
}

async function tracedAnthropicCall(params: {
  systemPrompt: string;
  userMessage: string;
  featureContext: string;
}): Promise<{ completion: string; trace: AiCallTrace }> {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: params.systemPrompt,
    messages: [{ role: 'user', content: params.userMessage }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  const trace: AiCallTrace = {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    model: 'claude-sonnet-4-5',
    systemPrompt: params.systemPrompt,
    userMessage: params.userMessage,
    completion,
    latencyMs: Date.now() - start,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    featureContext: params.featureContext,
  };

  await logAiCallTrace(trace); // persisted for later inspection —
  // this is what makes a specific bad output DEBUGGABLE after the fact
  return { completion, trace };
}
\`\`\`

**Why capturing the actual content is what makes debugging a specific
bad output possible after the fact, rather than only detectable
through user complaints:**

\`\`\`
Without a persisted record of the exact prompt sent and the exact
completion received, a report that "the AI gave a wrong answer
yesterday" is nearly undiagnosable — there's no way to inspect what
the model actually saw and actually produced. With tracing in place,
a specific requestId or timestamp lets a team retrieve the EXACT
prompt/completion pair and reason about what went wrong, connecting
directly to Module 11's reliability discipline (you can't fix or even
fully understand a failure you can't inspect).
\`\`\`

**Why this connects directly to Module 12's security discipline — a
trace log itself becomes sensitive data that needs its own handling
policy:**

\`\`\`
Since a full trace captures the actual prompt and completion content,
it may contain personally identifiable information, proprietary
business data, or other sensitive content that was part of the
original request — meaning trace storage itself needs the same
data-handling discipline (access control, retention limits, potential
redaction) Module 12 established for any system handling sensitive
data, not an exemption because "it's just a debug log."
\`\`\`

**A practical, structured logging approach that balances debuggability
against storage cost and sensitivity:**

\`\`\`ts
function shouldLogFullContent(trace: AiCallTrace): boolean {
  // A common practical pattern: log full content for a sampled
  // percentage of requests (enough for debugging and quality
  // monitoring) plus 100% of requests that errored or were flagged,
  // rather than either 100% of everything (cost/sensitivity concern)
  // or 0% (undebuggable)
  const sampleRate = 0.05;
  return Math.random() < sampleRate || trace.wasError || trace.wasFlagged;
}
\`\`\`

**How this lesson opens Module 18:** the rest of this module (Lesson
2: drift detection, Lesson 3: A/B testing and cost dashboards) assumes
this lesson's foundational capability — that raw prompt/completion
data is actually being captured and stored — since none of those later
capabilities are possible without the underlying trace data this
lesson establishes as the first, necessary layer of AI observability.`,

    simpleHi: `**Standard request logging — timing, status codes, error rates —
necessary par genuinely insufficient kyun hai ek AI feature ke liye:**

\`\`\`
Standard observability (typical backend work se Module-level concepts:
request duration, HTTP status, error rate) aapko batati hai ki KYA ek
LLM API ko request succeed hui aur KITNI DER lagi — ye abhi bhi
necessary hai aur absolutely collect kiya jaana chahiye. Par ye aapko
KUCH NAHI batata is baare mein ki kya actual completion content achhi,
appropriate, ya correct thi — ek request 200ms mein 200 status code
ke saath succeed ho sakti hai aur abhi bhi ek badly hallucinated ya
unhelpful response return kar sakti hai.
\`\`\`

**Ek concrete tracing pattern — full prompt/completion pair capture
karna, sirf call ke around metadata nahi:**

\`\`\`ts
interface AiCallTrace {
  requestId: string;
  timestamp: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  completion: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  // Metadata jo is AI call ko broader application context se connect
  // karta hai — kaunsa feature, kaunsa user flow, is call ko trigger kiya
  featureContext: string;
}

async function tracedAnthropicCall(params: {
  systemPrompt: string;
  userMessage: string;
  featureContext: string;
}): Promise<{ completion: string; trace: AiCallTrace }> {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: params.systemPrompt,
    messages: [{ role: 'user', content: params.userMessage }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  const trace: AiCallTrace = {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    model: 'claude-sonnet-4-5',
    systemPrompt: params.systemPrompt,
    userMessage: params.userMessage,
    completion,
    latencyMs: Date.now() - start,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    featureContext: params.featureContext,
  };

  await logAiCallTrace(trace); // baad mein inspection ke liye persist
  // kiya gaya — yahi wo hai jo ek specific bad output ko baad mein
  // DEBUGGABLE banata hai
  return { completion, trace };
}
\`\`\`

**Actual content capture karna kyun wo hai jo baad mein ek specific
bad output ko debug karna possible banata hai, sirf user complaints
ke through detectable hone ke bajaye:**

\`\`\`
Exact bheja gaya prompt aur exact receive ki gayi completion ke ek
persisted record ke bina, ek report ki "AI ne kal ek wrong answer
diya" almost undiagnosable hai — inspect karne ka koi tareeka nahi hai
ki model ne actually kya dekha aur actually kya produce kiya. Tracing
in place hone ke saath, ek specific requestId ya timestamp ek team ko
EXACT prompt/completion pair retrieve karne deta hai aur reason karne
deta hai ki kya galat hua, directly Module 11 ke reliability discipline
se connect karte hue (aap ek failure ko fix ya even poori tarah samajh
nahi sakte jise aap inspect nahi kar sakte).
\`\`\`

**Ye directly Module 12 ke security discipline se kaise connect karta
hai — ek trace log khud sensitive data ban jaata hai jise apni khud ki
handling policy chahiye:**

\`\`\`
Kyunki ek full trace actual prompt aur completion content capture
karta hai, isme personally identifiable information, proprietary
business data, ya doosra sensitive content ho sakta hai jo original
request ka part tha — matlab trace storage khud ko wahi data-handling
discipline chahiye (access control, retention limits, potential
redaction) jise Module 12 ne kisi bhi system ke liye establish kiya jo
sensitive data handle karta hai, koi exemption nahi is wajah se ki
"ye sirf ek debug log hai."
\`\`\`

**Ek practical, structured logging approach jo debuggability ko
storage cost aur sensitivity ke against balance karta hai:**

\`\`\`ts
function shouldLogFullContent(trace: AiCallTrace): boolean {
  // Ek common practical pattern: requests ka ek sampled percentage
  // ke liye full content log karo (debugging aur quality monitoring
  // ke liye kaafi) plus 100% requests jo errored ya flagged hue,
  // ya to 100% everything (cost/sensitivity concern) ya 0%
  // (undebuggable) ke bajaye
  const sampleRate = 0.05;
  return Math.random() < sampleRate || trace.wasError || trace.wasFlagged;
}
\`\`\`

**Ye lesson Module 18 ko kaise open karta hai:** is module ka baaki
hissa (Lesson 2: drift detection, Lesson 3: A/B testing aur cost
dashboards) is lesson ki foundational capability ko assume karta hai —
ki raw prompt/completion data actually capture aur store ki ja rahi
hai — kyunki in later capabilities mein se koi bhi possible nahi hai
us underlying trace data ke bina jise ye lesson AI observability ki
pehli, necessary layer ki tarah establish karta hai.`,

    content: `## Why traditional observability's core assumption breaks down for
AI features specifically

Traditional software observability (request duration, status codes,
error rates, structured logs) was built around code whose behavior is
fully determined by its inputs and its logic — given the same inputs,
the same code produces the same output, and observability's job is
tracking whether the system is performing correctly and quickly along
that deterministic path. An AI feature breaks this assumption at its
core: the same prompt sent twice can produce two meaningfully different
completions, and a request can succeed in every traditional sense
(fast, 200 status, no exception thrown) while still producing output
that is wrong, unhelpful, or actively harmful. This is why AI
observability requires an additional layer traditional tooling doesn't
provide by default: visibility into the actual content of what was
sent and what was received, not just whether the round-trip succeeded.

## Why capturing full prompt/completion pairs is what makes a
specific bad output debuggable after the fact

Without a persisted trace of the exact prompt and exact completion for
a specific request, a report that a particular interaction produced a
bad or wrong answer is nearly impossible to investigate — there's
nothing to inspect. With tracing in place, a specific request can be
retrieved and examined directly: what exactly was in the system
prompt, what exactly the user sent, what exactly the model produced —
turning a vague "something went wrong yesterday" into a concrete,
inspectable artifact. This is a direct extension of Module 11's
reliability principle that failures need to be understood, not just
detected, and understanding a specific AI failure requires the actual
content, not just metadata about the call.

## Why a trace log itself inherits Module 12's data-sensitivity
obligations rather than being exempt as "just debugging data"

Because a full trace captures the actual prompt and completion content,
it can contain exactly the same sensitive information (personal data,
proprietary business details) that was present in the original
request — meaning the trace storage system itself is now handling
sensitive data and needs the same access control, retention policy, and
potential redaction discipline Module 12 established for any system
touching sensitive information. Treating trace logs as exempt from
this discipline because they're "just for debugging" creates a genuine
security and privacy gap that undermines the very data-handling
principles the rest of the application is expected to follow.

## Why sampling is a practical, necessary compromise rather than an
all-or-nothing choice between full logging and no logging

Logging full prompt/completion content for every single request at
scale creates real storage cost and expands the sensitive-data surface
area unnecessarily. A practical middle ground — full-content logging
for a sampled percentage of all requests, plus unconditional full
logging for any request that errored or was flagged as low-quality —
preserves debuggability for the cases that actually need investigation
while controlling cost and limiting sensitive-data exposure for the
large volume of routine, successful requests that don't need this level
of scrutiny.

## How this lesson sets up the rest of Module 18

Drift detection (Lesson 2) requires comparing model behavior over time,
which is only possible if that behavior was actually captured and
stored in the first place. A/B testing prompts and models, and cost
dashboards (Lesson 3), similarly depend on having structured, queryable
records of actual AI calls to analyze. This lesson's tracing discipline
is the foundational data layer the rest of this module's capabilities
are built on top of — without it, drift detection and rigorous A/B
comparison simply aren't possible.`,

    contentHi: `## Traditional observability ki core assumption specifically AI features ke liye kyun break down hoti hai

Traditional software observability (request duration, status codes,
error rates, structured logs) us code ke around banaya gaya tha jiska
behavior poori tarah uske inputs aur uski logic se determined hai —
wahi inputs diye jaane pe, wahi code wahi output produce karta hai, aur
observability ka kaam ye track karna hai ki system us deterministic
path ke saath correctly aur quickly perform kar raha hai ya nahi. Ek
AI feature is assumption ko apne core mein break karta hai: wahi
prompt do baar bheja gaya do meaningfully different completions
produce kar sakta hai, aur ek request har traditional sense mein
succeed ho sakti hai (fast, 200 status, koi exception nahi) jabki
abhi bhi aisa output produce karte hue jo galat, unhelpful, ya
actively harmful hai. Yahi wajah hai AI observability ko ek additional
layer chahiye jise traditional tooling default se provide nahi karti:
kya bheja gaya aur kya receive kiya gaya iski actual content mein
visibility, sirf ye nahi ki round-trip succeed hua ya nahi.

## Full prompt/completion pairs capture karna kyun wo hai jo ek specific bad output ko baad mein debuggable banata hai

Ek specific request ke liye exact prompt aur exact completion ke ek
persisted trace ke bina, ek report ki ek particular interaction ne ek
bad ya wrong answer produce kiya almost investigate karna impossible
hai — inspect karne ke liye kuch nahi hai. Tracing in place hone ke
saath, ek specific request directly retrieve aur examine ki ja sakti
hai: system prompt mein exactly kya tha, user ne exactly kya bheja,
model ne exactly kya produce kiya — ek vague "kal kuch galat hua"
ko ek concrete, inspectable artifact mein badalte hue. Ye Module 11 ke
reliability principle ka ek direct extension hai ki failures ko
samjhna chahiye, sirf detect nahi karna, aur ek specific AI failure ko
samajhne ke liye actual content chahiye, sirf call ke baare mein
metadata nahi.

## Ek trace log khud Module 12 ke data-sensitivity obligations kyun inherit karta hai "sirf debugging data" ki tarah exempt hone ke bajaye

Kyunki ek full trace actual prompt aur completion content capture
karta hai, isme exactly wahi sensitive information ho sakti hai
(personal data, proprietary business details) jo original request
mein present thi — matlab trace storage system khud ab sensitive data
handle kar raha hai aur use wahi access control, retention policy, aur
potential redaction discipline chahiye jise Module 12 ne kisi bhi
system ke liye establish kiya jo sensitive information ko touch karta
hai. Trace logs ko is discipline se exempt treat karna is wajah se ki
wo "sirf debugging ke liye hain" ek genuine security aur privacy gap
create karta hai jo un data-handling principles ko undermine karta hai
jinhe baaki application follow karne ki expect ki jaati hai.

## Sampling ek practical, necessary compromise kyun hai full logging aur no logging ke beech ek all-or-nothing choice ke bajaye

Scale pe har single request ke liye full prompt/completion content log
karna real storage cost create karta hai aur sensitive-data surface
area ko unnecessarily expand karta hai. Ek practical middle ground —
sab requests ke ek sampled percentage ke liye full-content logging,
plus kisi bhi request ke liye unconditional full logging jo errored ya
low-quality flagged hui — un cases ke liye debuggability preserve
karta hai jinhe actually investigation chahiye jabki cost control
karte hue aur routine, successful requests ke bade volume ke liye
sensitive-data exposure limit karte hue jinhe is level ki scrutiny
nahi chahiye.

## Ye lesson Module 18 ke baaki hisse ko kaise set up karta hai

Drift detection (Lesson 2) ko time ke across model behavior compare
karna chahiye, jo sirf tab possible hai jab wo behavior actually
capture aur store ki gayi ho pehli jagah. Prompts aur models ka A/B
testing, aur cost dashboards (Lesson 3), similarly actual AI calls ke
structured, queryable records analyze karne ke liye depend karte hain.
Is lesson ki tracing discipline wo foundational data layer hai jispe
is module ki baaki capabilities build ki gayi hain — iske bina, drift
detection aur rigorous A/B comparison simply possible nahi hain.`,

    examples: [
      {
        title: 'A production-shaped tracing wrapper with sampling logic applied around a real Anthropic call',
        titleHi: 'Ek production-shaped tracing wrapper sampling logic ke saath ek real Anthropic call ke around applied',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function tracedAnthropicCall({ systemPrompt, userMessage, featureContext }) {
  const start = Date.now();
  let response, error;

  try {
    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });
  } catch (err) {
    error = err;
  }

  const trace = {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    model: 'claude-sonnet-4-5',
    systemPrompt,
    userMessage,
    completion: response?.content[0]?.type === 'text' ? response.content[0].text : null,
    latencyMs: Date.now() - start,
    inputTokens: response?.usage?.input_tokens ?? null,
    outputTokens: response?.usage?.output_tokens ?? null,
    featureContext,
    wasError: Boolean(error),
  };

  // Sample 5% of successful traces fully, but ALWAYS log full content
  // for errors — the cases most likely to need investigation
  const shouldLogFull = trace.wasError || Math.random() < 0.05;
  await persistTrace(trace, { logFullContent: shouldLogFull });

  if (error) throw error;
  return trace.completion;
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface AiCallTrace {
  requestId: string;
  timestamp: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  completion: string | null;
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  featureContext: string;
  wasError: boolean;
}

async function tracedAnthropicCall({
  systemPrompt,
  userMessage,
  featureContext,
}: {
  systemPrompt: string;
  userMessage: string;
  featureContext: string;
}): Promise<string | null> {
  const start = Date.now();
  let response: Awaited<ReturnType<typeof anthropic.messages.create>> | undefined;
  let error: unknown;

  try {
    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });
  } catch (err) {
    error = err;
  }

  const completion = response?.content[0]?.type === 'text' ? response.content[0].text : null;

  const trace: AiCallTrace = {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    model: 'claude-sonnet-4-5',
    systemPrompt,
    userMessage,
    completion,
    latencyMs: Date.now() - start,
    inputTokens: response?.usage?.input_tokens ?? null,
    outputTokens: response?.usage?.output_tokens ?? null,
    featureContext,
    wasError: Boolean(error),
  };

  // Sample 5% of successful traces fully, but ALWAYS log full content
  // for errors — the cases most likely to need investigation
  const shouldLogFull = trace.wasError || Math.random() < 0.05;
  await persistTrace(trace, { logFullContent: shouldLogFull });

  if (error) throw error;
  return completion;
}`,
        code: `const shouldLogFull = trace.wasError || Math.random() < 0.05;
await persistTrace(trace, { logFullContent: shouldLogFull });
// errors always get full content logged; successes are sampled at 5%`,
        output:
          "Every call produces a trace record with timing and token metadata, while full prompt/completion content is persisted for 100% of errors and a 5% random sample of successes — balancing debuggability for problem cases against storage cost and sensitive-data exposure for the large volume of routine, successful calls.",
        explain:
          "This example makes both of the lesson's core points concrete in one function: tracing captures the actual content (not just metadata) that makes a specific bad output debuggable, while the sampling logic directly addresses the cost and sensitivity concerns of logging everything at full fidelity.",
        explainHi:
          "Ye example lesson ke dono core points ko ek function mein concrete banata hai: tracing actual content capture karti hai (sirf metadata nahi) jo ek specific bad output ko debuggable banata hai, jabki sampling logic directly cost aur sensitivity concerns ko address karti hai sab kuch full fidelity pe log karne ke.",
      },
    ],

    mistakes: [
      {
        wrong: `// Logging only standard request metadata — the traditional
// observability shape — with no visibility into actual AI content
async function callModelWrong(prompt) {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  // Only logs timing and status — if this specific response was
  // wrong or harmful, there's NOTHING to inspect after the fact
  console.log(\`Request completed in \${Date.now() - start}ms\`);
  return response.content[0].text;
}`,
        right: `// Logging the actual prompt and completion content alongside
// standard timing metadata — making the specific interaction debuggable
async function callModelRight(prompt, featureContext) {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  await persistTrace({
    prompt,
    completion,
    latencyMs: Date.now() - start,
    featureContext,
    timestamp: new Date().toISOString(),
  });

  return completion;
}`,
        why: "Logging only timing and status metadata, in the traditional observability shape, provides zero ability to investigate a specific bad output after the fact — since an AI feature's actual failures live in the completion content itself, not in whether the call technically succeeded, observability that omits content is observability that can't diagnose the failures that actually matter.",
        whyHi:
          "Sirf timing aur status metadata log karna, traditional observability shape mein, ek specific bad output ko baad mein investigate karne ki zero ability provide karta hai — kyunki ek AI feature ke actual failures completion content mein khud rehte hain, is baat mein nahi ki call technically succeed hui ya nahi, observability jo content omit karti hai wo observability hai jo un failures ko diagnose nahi kar sakti jo actually matter karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A production customer-support AI feature was unable to investigate a spike in user complaints about 'strange responses' for three days because the team's logging only captured request duration and status codes — after adding full prompt/completion tracing, a similar complaint spike was diagnosed within an hour by directly inspecting the traced completions that triggered it.",
        hi: 'Ek production customer-support AI feature \'strange responses\' ke baare mein user complaints mein ek spike investigate karne mein teen din tak unable tha kyunki team ki logging sirf request duration aur status codes capture karti thi — full prompt/completion tracing add karne ke baad, ek similar complaint spike ek ghante ke andar diagnose kiya gaya directly un traced completions ko inspect karke jinhone ise trigger kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is traditional observability (timing, status codes, error rates) necessary but insufficient for AI features specifically?',
        qHi: 'Traditional observability (timing, status codes, error rates) specifically AI features ke liye necessary par insufficient kyun hai?',
        a: "Traditional observability assumes behavior is fully determined by code and inputs, tracking whether a deterministic path performed correctly and quickly. An AI feature's actual quality depends on the model's generated content, which can vary between identical requests and can be wrong or harmful even when the call succeeds in every traditional sense (fast, 200 status). This is why AI observability requires an additional layer: capturing the actual prompt and completion content.",
        aHi: 'Traditional observability assume karti hai ki behavior poori tarah code aur inputs se determined hai, track karte hue ki ek deterministic path correctly aur quickly perform hua ya nahi. Ek AI feature ki actual quality model ke generated content pe depend karti hai, jo identical requests ke beech vary kar sakta hai aur galat ya harmful ho sakta hai even jab call har traditional sense mein succeed karti hai (fast, 200 status). Yahi wajah hai AI observability ko ek additional layer chahiye: actual prompt aur completion content capture karna.',
      },
      {
        q: "Why does a trace log storing AI prompt/completion content inherit the same data-sensitivity obligations as the application's primary data store?",
        qHi: 'AI prompt/completion content store karne wala ek trace log application ke primary data store jaisi wahi data-sensitivity obligations kyun inherit karta hai?',
        a: "Because a full trace captures the actual content sent to and received from the model, it can contain exactly the same sensitive information (personal data, proprietary details) present in the original request. This means the trace storage system is itself now handling sensitive data and needs the same access control, retention, and redaction discipline as any other system touching that data — it's not exempt just because it's used for debugging.",
        aHi: 'Kyunki ek full trace model ko bheja gaya aur usse receive kiya gaya actual content capture karti hai, isme exactly wahi sensitive information ho sakti hai (personal data, proprietary details) jo original request mein present thi. Iska matlab hai trace storage system khud ab sensitive data handle kar raha hai aur use wahi access control, retention, aur redaction discipline chahiye jo kisi bhi doosre system ko us data ko touch karte hue chahiye — ye exempt nahi hai sirf is wajah se ki ye debugging ke liye use kiya jaata hai.',
      },
    ],

    exercises: [
      {
        task: "A team's AI feature logs request duration, HTTP status codes, and error counts, but a user reports the assistant gave factually incorrect pricing information three days ago and the team has no way to investigate what actually happened. Using this lesson's framework, identify the specific gap in their observability setup and propose the minimum change needed to make this kind of report investigable going forward.",
        taskHi: 'Ek team ka AI feature request duration, HTTP status codes, aur error counts log karta hai, par ek user report karta hai ki assistant ne teen din pehle factually incorrect pricing information di aur team ke paas investigate karne ka koi tareeka nahi hai ki actually kya hua. Is lesson ke framework use karke, unke observability setup mein specific gap identify karo, aur minimum change propose karo jo is kism ke report ko aage jaate hue investigable banaye.',
        hint: "Think about what specific piece of data would need to have been captured at the time of the original request for anyone to be able to inspect what the model actually saw and actually said.",
        hintHi: 'Socho ki kaunsa specific piece of data original request ke time pe capture kiya jaana chahiye tha kisi ke liye bhi inspect karne ke liye ki model ne actually kya dekha aur actually kya kaha.',
      },
    ],

    keyTakeaways: [
      "Traditional observability (timing, status, error rate) tells you whether a request succeeded but nothing about whether the actual AI-generated content was good — a request can succeed technically while producing wrong or harmful output.",
      "Tracing the full prompt/completion pair, not just call metadata, is what makes a specific bad output debuggable after the fact rather than only detectable through complaints.",
      "A trace log capturing real prompt/completion content inherits the same data-sensitivity obligations (access control, retention, redaction) as any system handling sensitive data — it's not exempt as 'just debugging.'",
      "Sampling (full logging for errors/flagged content, a percentage sample of routine successes) is a practical middle ground between undebuggable minimal logging and costly, sensitivity-expanding full logging of everything.",
    ],
    keyTakeawaysHi: [
      'Traditional observability (timing, status, error rate) aapko batati hai ki kya ek request succeed hui par ye baat nahi ki kya actual AI-generated content achhi thi — ek request technically succeed ho sakti hai jabki galat ya harmful output produce karte hue.',
      'Full prompt/completion pair ko trace karna, sirf call metadata nahi, wo hai jo ek specific bad output ko baad mein debuggable banata hai sirf complaints ke through detectable hone ke bajaye.',
      "Real prompt/completion content capture karne wala ek trace log wahi data-sensitivity obligations (access control, retention, redaction) inherit karta hai jo kisi bhi system ko sensitive data handle karte hue chahiye — ye 'sirf debugging' ki tarah exempt nahi hai.",
      'Sampling (errors/flagged content ke liye full logging, routine successes ka ek percentage sample) undebuggable minimal logging aur costly, sensitivity-expanding sab kuch ki full logging ke beech ek practical middle ground hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-drift-detection-over-time',
    title: 'Drift Detection — Noticing When Model Behavior Quietly Changes',
    titleHi: 'Drift Detection — Ye Notice Karna Ki Model Behavior Quietly Kab Badalta Hai',
    description:
      "A model's behavior on the exact same category of input can genuinely shift over time — through provider-side model updates, subtle input distribution changes, or silent upstream prompt changes — and without deliberate monitoring, this drift is invisible until it becomes a serious quality problem.",
    descriptionHi:
      'Ek model ka behavior wahi exact category of input pe genuinely time ke saath shift ho sakta hai — provider-side model updates, subtle input distribution changes, ya silent upstream prompt changes ke through — aur deliberate monitoring ke bina, ye drift invisible rehta hai jab tak ye ek serious quality problem nahi ban jaata.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A thermostat that's never recalibrated slowly reading temperatures less and less accurately over months, with the room's actual comfort level degrading so gradually that nobody notices until a guest remarks the house feels distinctly too warm.** A thermostat's sensor can drift out of calibration slowly, a fraction of a degree at a time — each individual day's reading is close enough to the previous day's that no single measurement looks obviously wrong, and the household adapts unconsciously as the actual temperature creeps upward in tiny increments. It's only when someone from OUTSIDE the household's slow adaptation — a guest, or a fresh comparison against a properly calibrated reference thermometer — actually notices the accumulated drift, because they're comparing against a stable reference point rather than against yesterday's already-slightly-drifted reading. An AI model's behavior can drift in exactly this way: a provider's backend model update, a subtle shift in the kinds of inputs users are actually sending over time, or an unnoticed change somewhere upstream in a prompt template can each cause behavior to shift gradually enough that no single day's output looks obviously wrong compared to the day before — but compared to a genuinely stable, fixed reference point (the same evaluation set run consistently over time, exactly the discipline Module 14 established), the accumulated drift becomes clearly visible, the same way comparing against a properly calibrated thermometer reveals a drift that comparing consecutive days never would.",
      hi: 'ek thermostat jo kabhi recalibrate nahi kiya jaata slowly temperatures ko kam aur kam accurately padhta hai months ke across, room ke actual comfort level ke itni gradually degrade hone ke saath ki koi notice nahi karta jab tak ek guest remark nahi karta ki ghar distinctly bahut warm feel karta hai. Ek thermostat ka sensor slowly calibration se bahar drift ho sakta hai, ek time pe ek degree ka fraction — har individual din ki reading pichhle din ke itni close hoti hai ki koi single measurement obviously wrong nahi dikhta, aur household unconsciously adapt karta hai jaise actual temperature tiny increments mein creep upward karta hai. Ye sirf tab hota hai jab household ke slow adaptation se OUTSIDE koi — ek guest, ya ek properly calibrated reference thermometer ke against ek fresh comparison — actually accumulated drift ko notice karta hai, kyunki wo ek stable reference point ke against compare kar raha hai kal ki already-slightly-drifted reading ke against nahi. Ek AI model ka behavior exactly is tarike se drift kar sakta hai: ek provider ka backend model update, users actually kis kism ke inputs bhej rahe hain isme ek subtle shift time ke saath, ya kahin upstream ek prompt template mein ek unnoticed change har ek behavior ko itni gradually shift kara sakta hai ki koi single din ka output pichhle din ke comparison mein obviously wrong nahi dikhta — par ek genuinely stable, fixed reference point ke against compare karte hue (wahi evaluation set consistently time ke saath run kiya gaya, exactly wo discipline jo Module 14 ne establish ki), accumulated drift clearly visible ban jaata hai, wahi tarike se jaise ek properly calibrated thermometer ke against compare karna ek drift reveal karta hai jo consecutive days compare karna kabhi nahi karega.',
    },

    simple: `**The three genuinely distinct sources of model drift — each with
a different underlying cause worth diagnosing separately:**

\`\`\`
1. PROVIDER-SIDE MODEL UPDATES: a cloud provider updates the model
   version behind an API endpoint (sometimes silently, sometimes
   announced) — the model itself has genuinely changed, even though
   your code and prompts haven't.

2. INPUT DISTRIBUTION SHIFT: the actual population of real user inputs
   gradually changes over time (new user demographics, a product
   feature change altering what users ask about) — the model hasn't
   changed, but what it's being asked is subtly different than what
   it was evaluated against originally.

3. UPSTREAM PROMPT/CONTEXT CHANGES: a seemingly unrelated code change
   elsewhere in the system (a RAG retrieval step returning different
   content, a system prompt edited for an unrelated reason) silently
   alters what the model actually receives.
\`\`\`

**Why comparing against a STABLE reference point, not against
yesterday, is the only way to actually detect drift — directly
extending Module 14's golden-dataset discipline:**

\`\`\`ts
interface DriftCheckResult {
  date: string;
  goldenSetAccuracy: number;
  baselineAccuracy: number; // the accuracy this SAME golden set achieved when first established
  driftDetected: boolean;
}

async function checkForDrift(goldenDataset, currentModel, baselineAccuracy) {
  // The golden dataset is the SAME stable set used in Module 14 —
  // never modified, run consistently over time as the fixed reference
  // point that makes drift actually visible
  const results = await runEval(goldenDataset, currentModel);

  const driftMagnitude = baselineAccuracy - results.accuracy;
  const driftDetected = driftMagnitude > 0.05; // a meaningful, not
  // noise-level, degradation threshold

  return {
    date: new Date().toISOString(),
    goldenSetAccuracy: results.accuracy,
    baselineAccuracy,
    driftDetected,
  };
}
\`\`\`

**Why running this check on a SCHEDULE, not just once at launch, is
what actually catches drift — a monitoring discipline, not a one-time
evaluation:**

\`\`\`ts
// A scheduled drift check — run daily/weekly against the stable
// golden dataset, tracking accuracy over time as a genuine time series
async function scheduledDriftCheck() {
  const result = await checkForDrift(GOLDEN_DATASET, currentModelId, BASELINE_ACCURACY);
  await recordDriftMetric(result); // appended to a time series, NOT
  // overwriting previous results — the trend over time is the signal

  if (result.driftDetected) {
    await alertTeam(\`Drift detected: accuracy dropped from \${result.baselineAccuracy} to \${result.goldenSetAccuracy}\`);
  }
}
\`\`\`

**A concrete pattern for distinguishing WHICH of the three drift
sources is responsible, once drift is detected — diagnosis, not just
detection:**

\`\`\`ts
function diagnoseDriftSource({ modelVersionChanged, inputDistributionChanged, upstreamPromptChanged }) {
  if (modelVersionChanged) return 'Provider updated the underlying model — verify against release notes';
  if (upstreamPromptChanged) return 'Check recent commits to prompt templates or RAG retrieval logic';
  if (inputDistributionChanged) return 'Compare recent real user inputs against the golden dataset\\'s original inputs for a mismatch';
  return 'Drift detected but source unclear — investigate all three categories';
}
\`\`\`

**Why this connects directly to Module 14's evaluation discipline and
Module 1's Lesson 1's ongoing point:** the golden dataset's core
property — staying fixed and untouched — is precisely what makes it
useful as a drift detector; a dataset that changes over time can't
distinguish "the model changed" from "the test changed," which is why
Module 14's stability requirement isn't just about fair before/after
comparison at launch time, it's the same property that makes ongoing
drift monitoring possible at all.`,

    simpleHi: `**Model drift ke teen genuinely distinct sources — har ek ke saath
ek different underlying cause jo separately diagnose karne layak hai:**

\`\`\`
1. PROVIDER-SIDE MODEL UPDATES: ek cloud provider ek API endpoint ke
   peeche model version update karta hai (kabhi silently, kabhi
   announced) — model khud genuinely badal gaya hai, chahe aapka
   code aur prompts na badle hon.

2. INPUT DISTRIBUTION SHIFT: real user inputs ki actual population
   gradually time ke saath badalti hai (naye user demographics, ek
   product feature change jo users kya poochte hain use badalta hai)
   — model badla nahi hai, par isse kya poocha ja raha hai subtly
   alag hai us se jo ye originally evaluate kiya gaya tha.

3. UPSTREAM PROMPT/CONTEXT CHANGES: system mein kahin ek seemingly
   unrelated code change (ek RAG retrieval step alag content return
   karta hai, ek system prompt kisi unrelated reason ke liye edited)
   silently badalta hai ki model actually kya receive karta hai.
\`\`\`

**Ek STABLE reference point ke against compare karna, kal ke against
nahi, drift ko actually detect karne ka ekmatra tareeka kyun hai —
directly Module 14 ke golden-dataset discipline ko extend karte hue:**

\`\`\`ts
interface DriftCheckResult {
  date: string;
  goldenSetAccuracy: number;
  baselineAccuracy: number; // wahi golden set ne first establish hone pe kaunsi accuracy achieve ki thi
  driftDetected: boolean;
}

async function checkForDrift(goldenDataset, currentModel, baselineAccuracy) {
  // Golden dataset Module 14 mein use ki gayi WAHI stable set hai —
  // kabhi modify nahi ki gayi, time ke saath consistently run ki
  // gayi ek fixed reference point ki tarah jo drift ko actually
  // visible banata hai
  const results = await runEval(goldenDataset, currentModel);

  const driftMagnitude = baselineAccuracy - results.accuracy;
  const driftDetected = driftMagnitude > 0.05; // ek meaningful, noise-
  // level nahi, degradation threshold

  return {
    date: new Date().toISOString(),
    goldenSetAccuracy: results.accuracy,
    baselineAccuracy,
    driftDetected,
  };
}
\`\`\`

**Is check ko ek SCHEDULE pe run karna, sirf launch pe ek baar nahi,
actually drift ko kyun catch karta hai — ek monitoring discipline, ek
one-time evaluation nahi:**

\`\`\`ts
// Ek scheduled drift check — daily/weekly run kiya gaya stable golden
// dataset ke against, time ke saath accuracy ko ek genuine time series
// ki tarah track karte hue
async function scheduledDriftCheck() {
  const result = await checkForDrift(GOLDEN_DATASET, currentModelId, BASELINE_ACCURACY);
  await recordDriftMetric(result); // ek time series mein appended,
  // previous results ko overwrite NAHI karte hue — time ke saath trend
  // signal hai

  if (result.driftDetected) {
    await alertTeam(\`Drift detected: accuracy dropped from \${result.baselineAccuracy} to \${result.goldenSetAccuracy}\`);
  }
}
\`\`\`

**Ek baar drift detect hone ke baad, teen drift sources mein se KAUNSA
responsible hai distinguish karne ka ek concrete pattern — diagnosis,
sirf detection nahi:**

\`\`\`ts
function diagnoseDriftSource({ modelVersionChanged, inputDistributionChanged, upstreamPromptChanged }) {
  if (modelVersionChanged) return 'Provider updated the underlying model — verify against release notes';
  if (upstreamPromptChanged) return 'Check recent commits to prompt templates or RAG retrieval logic';
  if (inputDistributionChanged) return 'Compare recent real user inputs against the golden dataset\\'s original inputs for a mismatch';
  return 'Drift detected but source unclear — investigate all three categories';
}
\`\`\`

**Ye directly Module 14 ke evaluation discipline aur Module 1's
Lesson 1 ke ongoing point se kaise connect karta hai:** golden dataset
ki core property — fixed aur untouched rehna — exactly wo hai jo ise
ek drift detector ki tarah useful banata hai; ek dataset jo time ke
saath badalta hai "model badla" ko "test badla" se distinguish nahi kar
sakta, yahi wajah hai Module 14 ki stability requirement sirf launch
time pe fair before/after comparison ke baare mein nahi hai, ye wahi
property hai jo ongoing drift monitoring ko bilkul possible banati
hai.`,

    content: `## Why drift is invisible without deliberate, stable-reference
monitoring, and dangerous specifically because of that invisibility

A model's behavior can shift gradually enough that no single day's
output looks meaningfully different from the day before — each
individual comparison (today versus yesterday) shows negligible
change, while the accumulated shift over weeks or months can be
substantial. This is precisely why comparing consecutive time periods
against each other fails to catch drift: the comparison needs to be
against a genuinely fixed, unchanging reference point (Module 14's
golden dataset, run consistently over time) rather than against a
recent baseline that has itself already partially drifted.

## Why the three sources of drift require genuinely different
diagnostic approaches, rather than a single generic "something
changed" response

A provider-side model update is diagnosable by checking the provider's
release notes and model version identifiers — the fix might be
re-validating prompts against the new model version or pinning to a
specific model snapshot if the provider supports it. Input distribution
shift is diagnosable by comparing the actual characteristics of recent
real user inputs against the golden dataset's original inputs, and the
fix may be updating the golden dataset to reflect the current real
distribution (a deliberate update, tracked and reasoned about, unlike
uncontrolled drift). Upstream prompt or context changes are diagnosable
through the same version-control and code-review practices used for
any other code change, since these changes are visible in the
codebase's own history — the fix is usually straightforward once the
specific change is identified. Treating all drift as one undifferentiated
problem obscures which of these genuinely different diagnostic paths
actually applies.

## Why running drift checks on a schedule, not just once at launch, is
what makes this a monitoring practice rather than a one-time
evaluation

Module 14 established rigorous evaluation as essential before declaring
a launch successful — but drift is a phenomenon that emerges over time,
specifically because it wasn't present when a system was first
evaluated. Running the same golden-dataset evaluation on a recurring
schedule (daily, weekly, whatever cadence matches the actual rate of
change a specific system might experience) converts a one-time
snapshot into a genuine time series, which is what actually allows a
gradual, otherwise-invisible degradation to be caught before it becomes
severe enough that users notice and complain.

## How this lesson's drift-detection discipline is a direct
extension, not a separate technique, of Module 14's evaluation
framework

The golden dataset's defining property — that it stays fixed and
untouched across comparisons — is precisely what makes it useful for
both of its purposes: fair before/after comparison at launch time
(Module 14's original framing) and ongoing drift detection (this
lesson's extension). A dataset that changes between measurements can't
distinguish whether an accuracy change reflects the model actually
getting worse or the test itself becoming different — which is why
this lesson's drift-detection practice depends entirely on Module 14's
stability requirement being genuinely honored over the long term, not
just at the moment of initial evaluation.`,

    contentHi: `## Drift deliberate, stable-reference monitoring ke bina invisible kyun hai, aur specifically us invisibility ki wajah se dangerous

Ek model ka behavior itna gradually shift kar sakta hai ki koi single
din ka output pichhle din se meaningfully different nahi dikhta — har
individual comparison (aaj versus kal) negligible change dikhata hai,
jabki hafton ya months ke across accumulated shift substantial ho
sakta hai. Yahi exactly wajah hai consecutive time periods ko ek doosre
ke against compare karna drift catch karne mein fail hota hai:
comparison ko ek genuinely fixed, unchanging reference point ke
against hona chahiye (Module 14 ka golden dataset, time ke saath
consistently run kiya gaya) ek recent baseline ke against nahi jo khud
already partially drift ho chuki hai.

## Drift ke teen sources genuinely different diagnostic approaches kyun maangte hain, ek single generic "kuch badla" response ke bajaye

Ek provider-side model update provider ke release notes aur model
version identifiers check karke diagnose ki ja sakti hai — fix nayi
model version ke against prompts ko re-validate karna ho sakta hai ya
ek specific model snapshot pe pin karna agar provider support karta
hai. Input distribution shift recent real user inputs ki actual
characteristics ko golden dataset ke original inputs ke against
compare karke diagnose ki ja sakti hai, aur fix golden dataset ko
current real distribution reflect karne ke liye update karna ho sakta
hai (ek deliberate update, tracked aur reasoned about, uncontrolled
drift ke unlike). Upstream prompt ya context changes wahi
version-control aur code-review practices se diagnose ki ja sakti hain
jo kisi bhi doosre code change ke liye use ki jaati hain, kyunki ye
changes codebase ki apni history mein visible hain — fix usually
straightforward hai ek baar specific change identify ho jaaye. Sab
drift ko ek undifferentiated problem ki tarah treat karna obscure
karta hai ki in genuinely different diagnostic paths mein se kaunsa
actually apply hota hai.

## Drift checks ko ek schedule pe run karna, sirf launch pe ek baar nahi, ise ek monitoring practice kyun banata hai ek one-time evaluation ke bajaye

Module 14 ne rigorous evaluation ko essential establish kiya ek launch
ko successful declare karne se pehle — par drift ek phenomenon hai jo
time ke saath emerge karta hai, specifically is wajah se ki ye tab
present nahi tha jab ek system pehli baar evaluate ki gayi thi. Wahi
golden-dataset evaluation ko ek recurring schedule pe run karna
(daily, weekly, jo bhi cadence ek specific system ke actual rate of
change ko match kare) ek one-time snapshot ko ek genuine time series
mein convert karta hai, jo actually ek gradual, otherwise-invisible
degradation ko catch hone deta hai ise itna severe hone se pehle ki
users notice karein aur complain karein.

## Ye lesson ka drift-detection discipline Module 14 ke evaluation framework ka ek direct extension kaise hai, ek separate technique nahi

Golden dataset ki defining property — ki ye comparisons ke across
fixed aur untouched rehta hai — exactly wo hai jo ise dono uske
purposes ke liye useful banata hai: launch time pe fair before/after
comparison (Module 14 ka original framing) aur ongoing drift detection
(is lesson ka extension). Ek dataset jo measurements ke beech badalta
hai distinguish nahi kar sakta ki kya ek accuracy change model ke
actually worse hone ko reflect karta hai ya test khud different ban
gaya — yahi wajah hai is lesson ki drift-detection practice poori
tarah Module 14 ki stability requirement pe depend karti hai jise
long term ke across genuinely honor kiya jaana chahiye, sirf initial
evaluation ke moment pe nahi.`,

    examples: [
      {
        title: 'A scheduled drift-monitoring job with source diagnosis, built on Module 14\'s golden dataset',
        titleHi: 'Ek scheduled drift-monitoring job source diagnosis ke saath, Module 14 ke golden dataset pe built',
        codeJs: `async function checkForDrift(goldenDataset, currentModel, baselineAccuracy) {
  const results = await runEval(goldenDataset, currentModel);
  const driftMagnitude = baselineAccuracy - results.accuracy;
  const driftDetected = driftMagnitude > 0.05;

  return {
    date: new Date().toISOString(),
    goldenSetAccuracy: results.accuracy,
    baselineAccuracy,
    driftMagnitude,
    driftDetected,
  };
}

function diagnoseDriftSource({ modelVersionChanged, inputDistributionChanged, upstreamPromptChanged }) {
  if (modelVersionChanged) return 'Check provider release notes — the underlying model likely changed';
  if (upstreamPromptChanged) return 'Review recent commits to prompt templates or RAG retrieval logic';
  if (inputDistributionChanged) return 'Compare recent real inputs against golden dataset inputs for mismatch';
  return 'Source unclear — investigate all three categories';
}

async function scheduledDriftCheck() {
  const result = await checkForDrift(GOLDEN_DATASET, CURRENT_MODEL_ID, BASELINE_ACCURACY);
  await recordDriftMetric(result); // appended to a time series

  if (result.driftDetected) {
    const diagnosis = diagnoseDriftSource(await gatherDiagnosticSignals());
    await alertTeam(
      \`Drift detected: \${result.baselineAccuracy} -> \${result.goldenSetAccuracy}. Likely cause: \${diagnosis}\`
    );
  }
}`,
        codeTs: `interface DriftCheckResult {
  date: string;
  goldenSetAccuracy: number;
  baselineAccuracy: number;
  driftMagnitude: number;
  driftDetected: boolean;
}

async function checkForDrift(
  goldenDataset: unknown,
  currentModel: string,
  baselineAccuracy: number,
): Promise<DriftCheckResult> {
  const results = await runEval(goldenDataset, currentModel);
  const driftMagnitude = baselineAccuracy - results.accuracy;
  const driftDetected = driftMagnitude > 0.05;

  return {
    date: new Date().toISOString(),
    goldenSetAccuracy: results.accuracy,
    baselineAccuracy,
    driftMagnitude,
    driftDetected,
  };
}

interface DiagnosticSignals {
  modelVersionChanged: boolean;
  inputDistributionChanged: boolean;
  upstreamPromptChanged: boolean;
}

function diagnoseDriftSource({ modelVersionChanged, inputDistributionChanged, upstreamPromptChanged }: DiagnosticSignals): string {
  if (modelVersionChanged) return 'Check provider release notes — the underlying model likely changed';
  if (upstreamPromptChanged) return 'Review recent commits to prompt templates or RAG retrieval logic';
  if (inputDistributionChanged) return 'Compare recent real inputs against golden dataset inputs for mismatch';
  return 'Source unclear — investigate all three categories';
}

async function scheduledDriftCheck(): Promise<void> {
  const result = await checkForDrift(GOLDEN_DATASET, CURRENT_MODEL_ID, BASELINE_ACCURACY);
  await recordDriftMetric(result); // appended to a time series

  if (result.driftDetected) {
    const diagnosis = diagnoseDriftSource(await gatherDiagnosticSignals());
    await alertTeam(
      \`Drift detected: \${result.baselineAccuracy} -> \${result.goldenSetAccuracy}. Likely cause: \${diagnosis}\`
    );
  }
}`,
        code: `const driftMagnitude = baselineAccuracy - results.accuracy;
const driftDetected = driftMagnitude > 0.05;
// comparison is against a FIXED baseline, not yesterday's result —
// this is what makes gradual drift actually detectable`,
        output:
          "Running on a recurring schedule, the function compares current performance against the same fixed golden dataset and baseline accuracy established at launch, accumulating a genuine time series — a gradual decline that would be invisible day-to-day becomes visible as a trend, and when drift crosses the threshold, the diagnostic function narrows down which of the three known causes is most likely responsible.",
        explain:
          "This example directly implements the lesson's two core requirements: comparison against a stable, unchanging reference point (not a recent, possibly-already-drifted baseline) to make drift visible at all, and a structured diagnostic step to distinguish between the three genuinely different underlying causes once drift is detected.",
        explainHi:
          "Ye example lesson ki do core requirements ko directly implement karta hai: ek stable, unchanging reference point ke against comparison (ek recent, possibly-already-drifted baseline nahi) drift ko bilkul visible banane ke liye, aur ek structured diagnostic step teen genuinely different underlying causes ke beech distinguish karne ke liye ek baar drift detect ho jaaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Comparing today's accuracy against yesterday's, rather than
// against a genuinely fixed, stable reference point
async function checkQualityWrong() {
  const todayAccuracy = await runEval(RECENT_SAMPLE_OF_TODAYS_REQUESTS, currentModel);
  const yesterdayAccuracy = await getYesterdaysAccuracy();

  // If drift is GRADUAL, yesterday's accuracy has ALSO already
  // drifted somewhat — this comparison will show negligible change
  // even as the true, accumulated drift from the original baseline grows
  return todayAccuracy - yesterdayAccuracy;
}`,
        right: `// Comparing against the SAME fixed golden dataset and ORIGINAL
// baseline accuracy every time — a stable reference point that never
// itself drifts
async function checkQualityRight() {
  const currentAccuracy = await runEval(GOLDEN_DATASET, currentModel); // never changes
  const originalBaselineAccuracy = BASELINE_ACCURACY; // fixed at launch, never updated

  // This comparison reveals the TRUE accumulated drift, since neither
  // side of the comparison has itself drifted
  return originalBaselineAccuracy - currentAccuracy;
}`,
        why: "Comparing against a recent baseline (yesterday) that has itself already partially drifted masks gradual degradation, since each day-over-day comparison shows only the small, recent increment rather than the true accumulated drift from the original, stable reference point — this is precisely why Module 14's fixed golden dataset is essential for drift detection, not just for launch-time comparison.",
        whyHi:
          "Ek recent baseline (kal) ke against compare karna jo khud already partially drift ho chuka hai gradual degradation ko mask karta hai, kyunki har day-over-day comparison sirf small, recent increment dikhata hai true accumulated drift ke bajaye original, stable reference point se — yahi exactly wajah hai Module 14 ka fixed golden dataset drift detection ke liye essential hai, sirf launch-time comparison ke liye nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production AI feature's quality gradually degraded over three months following a provider's undisclosed backend model update, going unnoticed because the team only compared week-over-week accuracy — after adopting a fixed golden-dataset comparison against the original launch baseline, the true magnitude of the drift became visible immediately, and the team pinned their integration to a specific model version to prevent recurrence.",
        hi: 'Ek production AI feature ki quality gradually teen mahino ke across degrade hui ek provider ke undisclosed backend model update ke baad, unnoticed jaate hue kyunki team sirf week-over-week accuracy compare karti thi — original launch baseline ke against ek fixed golden-dataset comparison adopt karne ke baad, drift ki true magnitude immediately visible ban gayi, aur team ne apni integration ko ek specific model version pe pin kiya recurrence prevent karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does comparing model accuracy against a recent baseline (like yesterday) fail to catch gradual drift, while comparing against a fixed golden dataset succeeds?',
        qHi: 'Model accuracy ko ek recent baseline (jaise kal) ke against compare karna gradual drift catch karne mein kyun fail hota hai, jabki ek fixed golden dataset ke against compare karna succeed karta hai?',
        a: "If drift is gradual, a recent baseline has itself already partially drifted, so day-over-day comparisons show only the small recent increment rather than the true accumulated drift from the original state. A fixed, never-updated golden dataset and baseline accuracy provide a genuinely stable reference point that reveals the full accumulated drift, regardless of how gradually it occurred.",
        aHi: 'Agar drift gradual hai, ek recent baseline khud already partially drift ho chuka hai, isliye day-over-day comparisons sirf small recent increment dikhate hain true accumulated drift se original state se nahi. Ek fixed, kabhi-update-na-hua golden dataset aur baseline accuracy ek genuinely stable reference point provide karte hain jo poore accumulated drift ko reveal karta hai, chahe ye kitna bhi gradually hua ho.',
      },
      {
        q: "What are the three genuinely distinct sources of model drift, and why does distinguishing between them matter for fixing the problem?",
        qHi: 'Model drift ke teen genuinely distinct sources kya hain, aur inke beech distinguish karna problem fix karne ke liye kyun matter karta hai?',
        a: "Provider-side model updates (the model itself changed), input distribution shift (real user inputs changed even though the model didn't), and upstream prompt/context changes (a code change elsewhere altered what the model receives). Each requires a different diagnostic approach and fix — checking provider release notes, comparing input characteristics, or reviewing recent code changes respectively — so treating all drift as one undifferentiated problem obscures which specific fix actually applies.",
        aHi: 'Provider-side model updates (model khud badla), input distribution shift (real user inputs badle chahe model na badla ho), aur upstream prompt/context changes (kahin ek code change ne badal diya ki model kya receive karta hai). Har ek ko ek different diagnostic approach aur fix chahiye — respectively provider release notes check karna, input characteristics compare karna, ya recent code changes review karna — isliye sab drift ko ek undifferentiated problem ki tarah treat karna obscure karta hai ki kaunsa specific fix actually apply hota hai.',
      },
    ],

    exercises: [
      {
        task: "A team notices their AI feature's quality has degraded, but their only historical data is week-over-week accuracy comparisons, which have shown only tiny, seemingly-insignificant declines each week for the past four months. Using this lesson's drift-detection framework, explain why this weekly comparison approach likely understated the true problem, and calculate what the total accumulated drift might actually be if each of 16 weekly comparisons showed a 1% decline.",
        taskHi: 'Ek team notice karti hai ki unke AI feature ki quality degrade hui hai, par unka ekmatra historical data week-over-week accuracy comparisons hai, jinhone pichhle chaar mahino ke har hafte sirf tiny, seemingly-insignificant declines dikhaye hain. Is lesson ke drift-detection framework use karke, explain karo ki ye weekly comparison approach likely true problem ko kyun understate karta hai, aur calculate karo total accumulated drift actually kya ho sakta hai agar 16 weekly comparisons mein se har ek ne ek 1% decline dikhaya.',
        hint: "Each week's comparison was against the PREVIOUS week (which had already drifted), not against the original baseline. What does compounding a roughly 1% decline across 16 weeks suggest about the true gap versus the original starting point?",
        hintHi: 'Har hafte ka comparison PREVIOUS week ke against tha (jo already drift ho chuki thi), original baseline ke against nahi. Roughly ek 1% decline ko 16 weeks ke across compound karna true gap ke baare mein kya suggest karta hai original starting point ke versus?',
      },
    ],

    keyTakeaways: [
      "Model behavior can drift through three genuinely distinct sources: provider-side model updates, input distribution shift, and upstream prompt/context changes — each requiring a different diagnostic approach.",
      "Comparing against a recent baseline (like yesterday) fails to catch gradual drift, since that baseline has itself already partially drifted — only comparison against a genuinely fixed, stable reference point reveals true accumulated drift.",
      "This directly extends Module 14's golden-dataset discipline: the same stability property that enables fair before/after comparison at launch is what makes ongoing drift monitoring possible.",
      "Drift checks must run on a recurring schedule, building a genuine time series, rather than being a one-time evaluation — this is what converts an invisible gradual decline into a visible, actionable trend.",
    ],
    keyTakeawaysHi: [
      'Model behavior teen genuinely distinct sources se drift kar sakta hai: provider-side model updates, input distribution shift, aur upstream prompt/context changes — har ek ko ek different diagnostic approach chahiye.',
      'Ek recent baseline (jaise kal) ke against compare karna gradual drift catch karne mein fail hota hai, kyunki wo baseline khud already partially drift ho chuka hai — sirf ek genuinely fixed, stable reference point ke against comparison true accumulated drift reveal karta hai.',
      'Ye directly Module 14 ke golden-dataset discipline ko extend karta hai: wahi stability property jo launch pe fair before/after comparison enable karti hai wo hai jo ongoing drift monitoring ko possible banata hai.',
      'Drift checks ko ek recurring schedule pe run karna chahiye, ek genuine time series build karte hue, ek one-time evaluation hone ke bajaye — yahi wo hai jo ek invisible gradual decline ko ek visible, actionable trend mein convert karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-ab-testing-and-cost-dashboards',
    title: 'A/B Testing Prompts & Models, and Cost Dashboards',
    titleHi: 'A/B Testing Prompts & Models, Aur Cost Dashboards',
    description:
      "Closing this module: A/B testing gives a genuine, statistically grounded answer to whether a prompt or model change actually improved things, and cost dashboards turn Module 10's cost-estimation discipline into an ongoing, first-class observability signal rather than a one-time calculation.",
    descriptionHi:
      'Is module ko close karte hue: A/B testing ek genuine, statistically grounded answer deta hai is baat ka ki kya ek prompt ya model change ne actually cheezein improve kiye, aur cost dashboards Module 10 ke cost-estimation discipline ko ek ongoing, first-class observability signal mein badalte hain ek one-time calculation ke bajaye.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A restaurant genuinely testing whether a new recipe is better by serving it to a randomly selected subset of customers and comparing feedback against the existing recipe served to everyone else, versus just asking the head chef whether they personally prefer the new version.** Asking the head chef which recipe they personally prefer produces an opinion, not evidence — the chef might genuinely like the new recipe better while actual customers, on average, don't, or vice versa, and there's no way to know which is true without actually testing it against a real, comparable population. A restaurant that randomly serves the new recipe to a genuine subset of customers over the same period, under the same conditions, and compares actual customer feedback (or reorder rates, or plate-return rates) between the two groups gets a real answer grounded in what actual customers actually experienced, not what one person's palate prefers. This exact distinction is why A/B testing a prompt or model change matters: a developer's subjective sense that a new prompt \"feels better\" after reading a few example outputs is closer to the head chef's opinion than to genuine evidence — a real A/B test, splitting genuine user traffic between the old and new version and measuring actual outcomes, is what turns a developer's hunch into an evidence-backed decision.",
      hi: 'ek restaurant genuinely test kar raha hai ki kya ek nayi recipe behtar hai use ek randomly selected subset of customers ko serve karke aur unka feedback existing recipe se compare karke jo baaki sabko serve ki gayi, versus sirf head chef se poochna ki unhe personally naya version pasand hai ya nahi. Head chef se poochna ki unhe kaunsi recipe personally pasand hai ek opinion produce karta hai, evidence nahi — chef ko genuinely naya recipe zyada pasand aa sakta hai jabki actual customers, average pe, nahi, ya vice versa, aur ise actually ek real, comparable population ke against test kiye bina jaanne ka koi tareeka nahi hai ki kaunsa sach hai. Ek restaurant jo randomly nayi recipe ko customers ke ek genuine subset ko serve karta hai wahi period ke dauran, wahi conditions ke under, aur actual customer feedback (ya reorder rates, ya plate-return rates) ko do groups ke beech compare karta hai ek real answer paata hai jo actual customers ne actually experience kiya us mein grounded, ek insaan ka palate kya prefer karta hai us mein nahi. Ye exact distinction hai jo batata hai ek prompt ya model change ko A/B test karna kyun matter karta hai: ek developer ka subjective sense ki ek naya prompt kuch example outputs padhne ke baad "behtar feel karta hai" head chef ki opinion se genuine evidence ke zyada close hai — ek real A/B test, purani aur nayi version ke beech genuine user traffic ko split karte hue aur actual outcomes measure karte hue, wo hai jo ek developer ke hunch ko ek evidence-backed decision mein badalta hai.',
    },

    simple: `**Why "the new prompt feels better to me" is an opinion, not
evidence — and what makes an A/B test genuine evidence instead:**

\`\`\`
A developer reading a handful of example outputs and forming an
impression is subject to every bias Module 4's course covered
(confirmation bias especially — if you expect the new prompt to be
better, you'll likely notice confirming examples more readily). A
genuine A/B test splits REAL user traffic between two versions under
IDENTICAL conditions and measures ACTUAL outcomes at a scale large
enough to distinguish a real effect from random noise.
\`\`\`

**A concrete A/B test implementation for comparing two prompt
versions:**

\`\`\`ts
function assignVariant(userId: string): 'control' | 'treatment' {
  // Consistent hashing ensures the SAME user always gets the SAME
  // variant across their session — a genuine requirement for valid
  // A/B testing, not an implementation detail
  const hash = hashString(userId);
  return hash % 100 < 50 ? 'control' : 'treatment';
}

async function handleUserQuery(userId: string, query: string) {
  const variant = assignVariant(userId);
  const systemPrompt = variant === 'control' ? CONTROL_PROMPT_V1 : TREATMENT_PROMPT_V2;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: query }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  // Recording the variant alongside the outcome is what makes the
  // eventual comparison possible — connects directly to Lesson 1's
  // tracing discipline
  await recordAbTestEvent({ userId, variant, query, completion, timestamp: new Date().toISOString() });

  return completion;
}
\`\`\`

**Why statistical significance — not just "treatment looked better"
— is required before declaring a winner, extending Module 14's
evaluation rigor to live A/B comparisons:**

\`\`\`ts
function isDifferenceSignificant(controlResults, treatmentResults) {
  // A simplified illustration of the underlying principle: with a
  // small sample size, an apparent difference between groups can
  // easily be random noise rather than a genuine effect — a proper
  // statistical test (e.g., a chi-squared or t-test, depending on
  // the metric) is needed before concluding the difference is real
  const minimumSampleSize = 1000; // illustrative — real analysis
  // determines this from the expected effect size and desired confidence
  if (controlResults.length < minimumSampleSize || treatmentResults.length < minimumSampleSize) {
    return { conclusive: false, reason: 'Sample size too small to distinguish signal from noise' };
  }
  // A real implementation runs an actual statistical test here
  return runStatisticalTest(controlResults, treatmentResults);
}
\`\`\`

**Why cost dashboards deserve first-class observability status, not
a one-time calculation done at launch — directly extending Module
10's cost-estimation discipline into an ongoing signal:**

\`\`\`ts
interface CostMetric {
  date: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  costPerRequest: number;
  featureBreakdown: Record<string, number>; // cost attributed per feature
}

async function computeDailyCostMetrics(traces: AiCallTrace[]): Promise<CostMetric> {
  const totalInputTokens = traces.reduce((sum, t) => sum + t.inputTokens, 0);
  const totalOutputTokens = traces.reduce((sum, t) => sum + t.outputTokens, 0);
  const totalCostUsd = calculateCost(totalInputTokens, totalOutputTokens); // Module 10's cost math

  const featureBreakdown: Record<string, number> = {};
  for (const trace of traces) {
    const cost = calculateCost(trace.inputTokens, trace.outputTokens);
    featureBreakdown[trace.featureContext] = (featureBreakdown[trace.featureContext] ?? 0) + cost;
  }

  return {
    date: new Date().toISOString().split('T')[0],
    totalInputTokens,
    totalOutputTokens,
    totalCostUsd,
    costPerRequest: totalCostUsd / traces.length,
    featureBreakdown, // reveals WHICH feature is actually driving cost —
    // the practical, actionable output of ongoing cost observability
  };
}
\`\`\`

**Why a cost dashboard catches problems a one-time launch estimate
structurally cannot — connecting directly to Lesson 2's drift
discipline:**

\`\`\`
A cost estimate made once, at launch, reflects the usage pattern and
model pricing AT THAT MOMENT. A gradual increase in average prompt
length, a usage pattern shift toward a more expensive model tier, or a
provider pricing change can each cause actual cost to drift
substantially from the original estimate — exactly the same kind of
gradual, easy-to-miss change Lesson 2 covered for behavior, applied to
cost specifically. An ongoing dashboard, not a one-time estimate, is
what catches this.
\`\`\`

**How this lesson closes Module 18:** Lesson 1 established the
foundational tracing data every subsequent capability depends on.
Lesson 2 showed how to detect quiet, gradual behavior changes against
a stable reference. This lesson completes the module by applying the
same rigor to two remaining, first-class observability needs:
genuinely evidence-based comparison between prompt/model versions (not
developer intuition), and cost as an ongoing, trackable signal rather
than a one-time launch calculation — both built directly on Lesson 1's
trace data and Module 14's evaluation and golden-dataset discipline.`,

    simpleHi: `**"Naya prompt mujhe behtar feel karta hai" ek opinion kyun hai,
evidence nahi — aur ek A/B test ko genuine evidence kya banata hai
uske bajaye:**

\`\`\`
Ek developer jo kuch example outputs padhta hai aur ek impression
banata hai Module 4 ke course ne cover kiye har bias ke subject hai
(confirmation bias especially — agar aap expect karte ho naya prompt
behtar hoga, aap likely confirming examples ko zyada readily notice
karoge). Ek genuine A/B test REAL user traffic ko do versions ke beech
split karta hai IDENTICAL conditions ke under aur ACTUAL outcomes ko
ek scale pe measure karta hai jo ek real effect ko random noise se
distinguish karne ke liye kaafi bada hai.
\`\`\`

**Do prompt versions compare karne ke liye ek concrete A/B test
implementation:**

\`\`\`ts
function assignVariant(userId: string): 'control' | 'treatment' {
  // Consistent hashing ensure karta hai ki WAHI user hamesha WAHI
  // variant paata hai unke session ke across — ek genuine requirement
  // valid A/B testing ke liye, ek implementation detail nahi
  const hash = hashString(userId);
  return hash % 100 < 50 ? 'control' : 'treatment';
}

async function handleUserQuery(userId: string, query: string) {
  const variant = assignVariant(userId);
  const systemPrompt = variant === 'control' ? CONTROL_PROMPT_V1 : TREATMENT_PROMPT_V2;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: query }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  // Variant ko outcome ke saath record karna wo hai jo eventual
  // comparison ko possible banata hai — directly Lesson 1 ki tracing
  // discipline se connect karta hai
  await recordAbTestEvent({ userId, variant, query, completion, timestamp: new Date().toISOString() });

  return completion;
}
\`\`\`

**Statistical significance — sirf "treatment behtar dikha" nahi — ek
winner declare karne se pehle kyun required hai, Module 14 ki
evaluation rigor ko live A/B comparisons tak extend karte hue:**

\`\`\`ts
function isDifferenceSignificant(controlResults, treatmentResults) {
  // Underlying principle ka ek simplified illustration: ek chhoti
  // sample size ke saath, groups ke beech ek apparent difference
  // aasani se random noise ho sakta hai ek genuine effect ke bajaye —
  // ek proper statistical test (jaise, ek chi-squared ya t-test,
  // metric pe depend karte hue) chahiye ye conclude karne se pehle ki
  // difference real hai
  const minimumSampleSize = 1000; // illustrative — real analysis
  // ise expected effect size aur desired confidence se determine karta hai
  if (controlResults.length < minimumSampleSize || treatmentResults.length < minimumSampleSize) {
    return { conclusive: false, reason: 'Sample size too small to distinguish signal from noise' };
  }
  // Ek real implementation yahan ek actual statistical test run karta hai
  return runStatisticalTest(controlResults, treatmentResults);
}
\`\`\`

**Cost dashboards first-class observability status kyun deserve karte
hain, launch pe kiya gaya ek one-time calculation nahi — directly
Module 10 ke cost-estimation discipline ko ek ongoing signal mein
extend karte hue:**

\`\`\`ts
interface CostMetric {
  date: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  costPerRequest: number;
  featureBreakdown: Record<string, number>; // per feature attributed cost
}

async function computeDailyCostMetrics(traces: AiCallTrace[]): Promise<CostMetric> {
  const totalInputTokens = traces.reduce((sum, t) => sum + t.inputTokens, 0);
  const totalOutputTokens = traces.reduce((sum, t) => sum + t.outputTokens, 0);
  const totalCostUsd = calculateCost(totalInputTokens, totalOutputTokens); // Module 10 ka cost math

  const featureBreakdown: Record<string, number> = {};
  for (const trace of traces) {
    const cost = calculateCost(trace.inputTokens, trace.outputTokens);
    featureBreakdown[trace.featureContext] = (featureBreakdown[trace.featureContext] ?? 0) + cost;
  }

  return {
    date: new Date().toISOString().split('T')[0],
    totalInputTokens,
    totalOutputTokens,
    totalCostUsd,
    costPerRequest: totalCostUsd / traces.length,
    featureBreakdown, // reveal karta hai KAUNSA feature actually cost
    // drive kar raha hai — ongoing cost observability ka practical,
    // actionable output
  };
}
\`\`\`

**Ek cost dashboard un problems ko kyun catch karta hai jo ek one-time
launch estimate structurally nahi kar sakta — directly Lesson 2 ke
drift discipline se connect karte hue:**

\`\`\`
Ek cost estimate jo ek baar, launch pe, banaya gaya, usage pattern aur
model pricing ko US MOMENT PE reflect karta hai. Average prompt length
mein ek gradual increase, ek zyada expensive model tier ki taraf ek
usage pattern shift, ya ek provider pricing change har ek actual cost
ko original estimate se substantially drift kara sakta hai — exactly
wahi kism ka gradual, easy-to-miss change jise Lesson 2 ne behavior ke
liye cover kiya, specifically cost pe applied. Ek ongoing dashboard,
ek one-time estimate nahi, wo hai jo ise catch karta hai.
\`\`\`

**Ye lesson Module 18 ko kaise close karta hai:** Lesson 1 ne
foundational tracing data establish ki jispe har subsequent capability
depend karti hai. Lesson 2 ne dikhaya ki ek stable reference ke against
quiet, gradual behavior changes ko kaise detect kiya jaaye. Ye lesson
module ko complete karta hai wahi rigor ko do remaining, first-class
observability needs pe apply karke: prompt/model versions ke beech
genuinely evidence-based comparison (developer intuition nahi), aur
cost ko ek ongoing, trackable signal ki tarah ek one-time launch
calculation ke bajaye — dono directly Lesson 1 ke trace data aur Module
14 ke evaluation aur golden-dataset discipline pe built.`,

    content: `## Why a developer's subjective sense that a new prompt "feels
better" is systematically unreliable, connecting directly to Module
4's confirmation bias coverage

Reading a handful of example outputs and forming an impression is
exactly the kind of judgment Module 4's confirmation-bias lesson
identified as unreliable: a developer who expects a new prompt to be
better is likely to notice and weight confirming examples more readily
than disconfirming ones, arriving at a sincere but genuinely biased
conclusion. A real A/B test sidesteps this entirely by comparing actual
outcomes across genuine user traffic under identical conditions, which
is why it counts as evidence in a way a developer's impression,
however sincerely held, does not.

## Why consistent variant assignment (the same user always getting the
same version) is a genuine methodological requirement, not an
implementation nicety

If a single user could receive different prompt versions across
different requests within the same session, the comparison would be
contaminated — any behavioral difference observed could reflect
within-session inconsistency rather than a genuine difference between
the two versions. Consistent hashing ensures each user is durably
assigned to one variant for the duration of the test, which is what
makes a subsequent comparison between the control and treatment groups
methodologically valid rather than confounded by inconsistent exposure.

## Why statistical significance, not just an observed difference, is
required before declaring a winner — directly extending Module 14's
evaluation rigor to live experiments

With a small enough sample size, an apparent difference between two
groups can easily be random noise rather than a genuine effect of the
prompt or model change being tested — this is why declaring "treatment
performed better" based on a handful of observations, without checking
whether the sample size and effect size support a statistically
meaningful conclusion, produces the same kind of unreliable, potentially
misleading result Module 14 warned against for evaluation more broadly.
A rigorous A/B test applies an appropriate statistical test and
requires a sufficient sample size before treating an observed
difference as real.

## Why cost dashboards deserve the same ongoing, first-class
observability treatment as behavioral drift, rather than remaining a
one-time launch estimate

Module 10 established cost estimation as an essential pre-launch
discipline, but an estimate made once, at launch, reflects only the
usage pattern and pricing in effect at that moment. Average prompt
length can grow over time, usage can shift toward more expensive
model tiers, and provider pricing itself can change — each of these
can cause actual cost to drift substantially from the original
estimate, in exactly the same gradual, easy-to-miss way Lesson 2
described for behavioral drift, but applied to cost specifically. An
ongoing cost dashboard, broken down by feature (revealing which
specific feature is actually driving spend), is what catches this kind
of drift before it becomes a significant, surprising line item.

## How this lesson completes Module 18's overall arc

Lesson 1 established the foundational tracing capability every
subsequent capability in this module depends on — without captured
prompt/completion data, neither A/B testing nor cost analysis would
have anything to analyze. Lesson 2 showed how to detect quiet,
gradual behavioral drift against a stable reference point. This lesson
closes the module by applying that same rigor to two remaining
observability needs: turning subjective impressions about prompt or
model changes into genuine, statistically grounded evidence, and
turning a one-time cost estimate into an ongoing, actionable signal —
both, like drift detection, built directly on Lesson 1's trace data
and Module 14's broader evaluation discipline.`,

    contentHi: `## Ek developer ka subjective sense ki ek naya prompt "behtar feel karta hai" systematically unreliable kyun hai, directly Module 4 ki confirmation bias coverage se connect karte hue

Kuch example outputs padhna aur ek impression banana exactly wo kism
ka judgment hai jise Module 4 ke confirmation-bias lesson ne unreliable
identify kiya: ek developer jo expect karta hai ek naya prompt behtar
hoga likely confirming examples ko zyada readily notice aur weight
karega disconfirming ones se, ek sincere par genuinely biased
conclusion pe pahunchte hue. Ek real A/B test ise poori tarah sidestep
karta hai actual outcomes ko genuine user traffic ke across identical
conditions ke under compare karke, yahi wajah hai ye evidence ki tarah
count hota hai ek tarike se jaise ek developer ki impression, chahe
kitni bhi sincerely held ho, nahi karti.

## Consistent variant assignment (wahi user hamesha wahi version paata hai) ek genuine methodological requirement kyun hai, ek implementation nicety nahi

Agar ek single user wahi session ke andar different requests ke across
different prompt versions paa sakta, comparison contaminated ho jaata
— koi bhi observed behavioral difference within-session
inconsistency reflect kar sakta tha do versions ke beech ek genuine
difference nahi. Consistent hashing ensure karta hai ki har user
durably ek variant ko test ki duration ke liye assigned hai, jo agle
comparison ko control aur treatment groups ke beech methodologically
valid banata hai inconsistent exposure se confounded hone ke bajaye.

## Statistical significance, sirf ek observed difference nahi, ek winner declare karne se pehle kyun required hai — directly Module 14 ke evaluation rigor ko live experiments tak extend karte hue

Ek sufficiently chhoti sample size ke saath, do groups ke beech ek
apparent difference aasani se random noise ho sakta hai test kiye ja
rahe prompt ya model change ka ek genuine effect nahi — yahi wajah hai
"treatment ne behtar perform kiya" declare karna kuch observations ke
basis pe, ye check kiye bina ki kya sample size aur effect size ek
statistically meaningful conclusion support karte hain, wahi kism ka
unreliable, potentially misleading result produce karta hai jise
Module 14 ne evaluation ke liye broadly warn kiya. Ek rigorous A/B
test ek appropriate statistical test apply karta hai aur ek observed
difference ko real treat karne se pehle ek sufficient sample size
maangta hai.

## Cost dashboards behavioral drift jitna hi ongoing, first-class observability treatment kyun deserve karte hain, ek one-time launch estimate rehne ke bajaye

Module 10 ne cost estimation ko ek essential pre-launch discipline
establish kiya, par ek estimate jo ek baar, launch pe, banaya gaya,
sirf us moment pe effect mein usage pattern aur pricing ko reflect
karta hai. Average prompt length time ke saath grow kar sakti hai,
usage zyada expensive model tiers ki taraf shift kar sakta hai, aur
provider pricing khud badal sakti hai — inme se har ek actual cost ko
original estimate se substantially drift kara sakta hai, exactly wahi
gradual, easy-to-miss tarike se jise Lesson 2 ne behavioral drift ke
liye describe kiya, specifically cost pe applied. Ek ongoing cost
dashboard, feature ke hisaab se broken down (reveal karte hue ki
kaunsa specific feature actually spend drive kar raha hai), wo hai jo
is kism ki drift ko catch karta hai ise ek significant, surprising
line item banne se pehle.

## Ye lesson Module 18 ke overall arc ko kaise complete karta hai

Lesson 1 ne foundational tracing capability establish ki jispe is
module ki har subsequent capability depend karti hai — captured
prompt/completion data ke bina, na A/B testing na cost analysis ke
paas analyze karne ke liye kuch hoga. Lesson 2 ne dikhaya ki ek stable
reference point ke against quiet, gradual behavioral drift ko kaise
detect kiya jaaye. Ye lesson module ko wahi rigor ko do remaining
observability needs pe apply karke close karta hai: prompt ya model
changes ke baare mein subjective impressions ko genuine, statistically
grounded evidence mein badalna, aur ek one-time cost estimate ko ek
ongoing, actionable signal mein badalna — dono, drift detection ki
tarah, directly Lesson 1 ke trace data aur Module 14 ke broader
evaluation discipline pe built.`,

    examples: [
      {
        title: 'A complete A/B test flow with variant assignment, event recording, and a cost-breakdown dashboard function',
        titleHi: 'Ek complete A/B test flow variant assignment, event recording, aur ek cost-breakdown dashboard function ke saath',
        codeJs: `function assignVariant(userId) {
  const hash = hashString(userId);
  return hash % 100 < 50 ? 'control' : 'treatment';
}

async function handleUserQueryWithAbTest(userId, query) {
  const variant = assignVariant(userId);
  const systemPrompt = variant === 'control' ? CONTROL_PROMPT_V1 : TREATMENT_PROMPT_V2;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: query }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  await recordAbTestEvent({
    userId,
    variant,
    query,
    completion,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    timestamp: new Date().toISOString(),
  });

  return completion;
}

async function computeCostBreakdown(traces) {
  const featureBreakdown = {};
  let totalCostUsd = 0;

  for (const trace of traces) {
    const cost = calculateCost(trace.inputTokens, trace.outputTokens);
    totalCostUsd += cost;
    featureBreakdown[trace.featureContext] = (featureBreakdown[trace.featureContext] ?? 0) + cost;
  }

  return {
    totalCostUsd,
    costPerRequest: totalCostUsd / traces.length,
    featureBreakdown, // shows exactly which feature is driving spend
  };
}`,
        codeTs: `function assignVariant(userId: string): 'control' | 'treatment' {
  const hash = hashString(userId);
  return hash % 100 < 50 ? 'control' : 'treatment';
}

async function handleUserQueryWithAbTest(userId: string, query: string): Promise<string> {
  const variant = assignVariant(userId);
  const systemPrompt = variant === 'control' ? CONTROL_PROMPT_V1 : TREATMENT_PROMPT_V2;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: query }],
  });
  const completion = response.content[0].type === 'text' ? response.content[0].text : '';

  await recordAbTestEvent({
    userId,
    variant,
    query,
    completion,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    timestamp: new Date().toISOString(),
  });

  return completion;
}

interface CostTrace {
  inputTokens: number;
  outputTokens: number;
  featureContext: string;
}

interface CostBreakdown {
  totalCostUsd: number;
  costPerRequest: number;
  featureBreakdown: Record<string, number>;
}

async function computeCostBreakdown(traces: CostTrace[]): Promise<CostBreakdown> {
  const featureBreakdown: Record<string, number> = {};
  let totalCostUsd = 0;

  for (const trace of traces) {
    const cost = calculateCost(trace.inputTokens, trace.outputTokens);
    totalCostUsd += cost;
    featureBreakdown[trace.featureContext] = (featureBreakdown[trace.featureContext] ?? 0) + cost;
  }

  return {
    totalCostUsd,
    costPerRequest: totalCostUsd / traces.length,
    featureBreakdown, // shows exactly which feature is driving spend
  };
}`,
        code: `const featureBreakdown = {};
for (const trace of traces) {
  const cost = calculateCost(trace.inputTokens, trace.outputTokens);
  featureBreakdown[trace.featureContext] = (featureBreakdown[trace.featureContext] ?? 0) + cost;
}
// reveals which feature is actually driving cost, not just a single total`,
        output:
          "The A/B test consistently assigns each user to one variant and records enough data (query, completion, tokens, variant) to later run a rigorous statistical comparison. The cost breakdown function produces a per-feature cost attribution, revealing that, for example, a RAG-heavy search feature is consuming 70% of total AI spend — an actionable insight a single aggregate cost number would have hidden.",
        explain:
          "This example ties together the lesson's two closing capabilities: the A/B test infrastructure records exactly what Lesson 1's tracing discipline established is necessary for later rigorous comparison, and the cost breakdown directly extends Module 10's cost math into an ongoing, per-feature observability signal rather than a single aggregate number.",
        explainHi:
          "Ye example lesson ki do closing capabilities ko saath tie karta hai: A/B test infrastructure exactly wo record karta hai jise Lesson 1 ki tracing discipline ne baad mein rigorous comparison ke liye necessary establish kiya, aur cost breakdown directly Module 10 ke cost math ko ek ongoing, per-feature observability signal mein extend karta hai ek single aggregate number ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Declaring an A/B test winner based on a small sample without
// checking statistical significance
async function declareWinnerWrong(controlResults, treatmentResults) {
  const controlAvg = average(controlResults);
  const treatmentAvg = average(treatmentResults);

  // With only, say, 30 samples per group, this difference could
  // easily be random noise — declaring a winner here is premature
  return treatmentAvg > controlAvg ? 'treatment wins' : 'control wins';
}`,
        right: `// Requiring a sufficient sample size and an actual statistical test
// before declaring a result conclusive
async function declareWinnerRight(controlResults, treatmentResults) {
  const minimumSampleSize = 1000; // determined by expected effect size
                                    // and desired statistical confidence
  if (controlResults.length < minimumSampleSize || treatmentResults.length < minimumSampleSize) {
    return { conclusive: false, reason: 'Insufficient sample size — continue the test' };
  }

  const testResult = runStatisticalTest(controlResults, treatmentResults);
  if (!testResult.significant) {
    return { conclusive: false, reason: 'Difference not statistically significant' };
  }
  return { conclusive: true, winner: testResult.higherPerformingVariant };
}`,
        why: "With a small sample size, an observed difference between two groups is often indistinguishable from random noise — declaring a winner without checking sample size and statistical significance risks shipping a change based on an effect that isn't actually real, undermining the entire purpose of running an A/B test in the first place.",
        whyHi:
          "Ek chhoti sample size ke saath, do groups ke beech ek observed difference aksar random noise se indistinguishable hoti hai — sample size aur statistical significance check kiye bina ek winner declare karna ek change ship karne ka risk leta hai ek effect ke basis pe jo actually real nahi hai, pehli jagah ek A/B test run karne ke poore purpose ko undermine karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A production team's initial prompt-change decision, based on a developer's confidence that the new version 'felt more natural,' was reversed after a proper A/B test with sufficient sample size revealed the original prompt actually performed measurably better on the team's real success metric — a direct illustration of why subjective impression and rigorous evidence can disagree.",
        hi: 'Ek production team ka initial prompt-change decision, ek developer ke confidence ke basis pe ki naya version \'more natural feel karta hai,\' reverse kar diya gaya ek proper A/B test ke baad sufficient sample size ke saath ye reveal karne ke baad ki original prompt actually measurably behtar perform kar raha tha team ke real success metric pe — is baat ka ek direct illustration ki subjective impression aur rigorous evidence disagree kyun kar sakte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is consistent variant assignment (the same user always receiving the same prompt/model version) a genuine methodological requirement for A/B testing, not just an implementation convenience?',
        qHi: 'Consistent variant assignment (wahi user hamesha wahi prompt/model version receive karta hai) A/B testing ke liye ek genuine methodological requirement kyun hai, sirf ek implementation convenience nahi?',
        a: "If a single user could receive different versions across requests within the same session, any observed behavioral difference could reflect within-session inconsistency rather than a genuine difference between the versions being tested — contaminating the comparison. Consistent hashing durably assigns each user to one variant for the test's duration, which is what makes the eventual comparison methodologically valid.",
        aHi: 'Agar ek single user wahi session ke andar different requests ke across different versions receive kar sakta, koi bhi observed behavioral difference within-session inconsistency reflect kar sakta tha test kiye ja rahe versions ke beech ek genuine difference nahi — comparison ko contaminate karte hue. Consistent hashing durably har user ko test ki duration ke liye ek variant assign karti hai, jo eventual comparison ko methodologically valid banata hai.',
      },
      {
        q: "Why does a cost dashboard need to be an ongoing, first-class observability signal rather than a one-time estimate made at launch?",
        qHi: 'Ek cost dashboard ko ongoing, first-class observability signal kyun hona chahiye, launch pe banaya gaya ek one-time estimate nahi?',
        a: "A launch-time estimate reflects only the usage pattern and pricing in effect at that moment. Average prompt length can grow, usage can shift toward more expensive model tiers, and provider pricing can change — each causing actual cost to drift from the original estimate in a gradual, easy-to-miss way similar to behavioral drift. An ongoing, per-feature cost dashboard catches this before it becomes a significant surprise.",
        aHi: 'Ek launch-time estimate sirf us moment pe effect mein usage pattern aur pricing ko reflect karta hai. Average prompt length grow kar sakti hai, usage zyada expensive model tiers ki taraf shift ho sakta hai, aur provider pricing badal sakti hai — har ek actual cost ko original estimate se drift kara sakta hai ek gradual, easy-to-miss tarike se behavioral drift jaisa. Ek ongoing, per-feature cost dashboard ise ek significant surprise banne se pehle catch karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team runs an A/B test comparing two prompts for 50 users total (25 per variant) and observes the treatment variant has a 3-percentage-point higher success rate, then immediately rolls it out to 100% of users. Using this lesson's framework, explain what's methodologically wrong with this decision and what should have been checked first.",
        taskHi: 'Ek team ek A/B test run karti hai do prompts compare karte hue 50 users ke liye total (25 per variant) aur observe karti hai ki treatment variant ki success rate 3-percentage-point zyada hai, phir immediately ise 100% users ko rollout kar deti hai. Is lesson ke framework use karke, explain karo ki is decision mein methodologically kya galat hai aur pehle kya check kiya jaana chahiye tha.',
        hint: "Think about whether 25 samples per group is enough to distinguish a real 3-percentage-point effect from random chance, and what statistical concept this lesson introduced for exactly this situation.",
        hintHi: 'Socho ki kya 25 samples per group kaafi hain ek real 3-percentage-point effect ko random chance se distinguish karne ke liye, aur is lesson ne exactly is situation ke liye kaunsa statistical concept introduce kiya.',
      },
    ],

    keyTakeaways: [
      "A developer's subjective sense that a prompt 'feels better' is subject to confirmation bias (Module 4) and is not evidence — a genuine A/B test comparing real outcomes across actual user traffic is required.",
      "Consistent variant assignment (the same user always gets the same version) is a genuine methodological requirement, not an implementation detail — inconsistent exposure contaminates the comparison.",
      "Statistical significance, not just an observed difference, must be checked before declaring an A/B test winner — small sample sizes can easily produce differences that are actually random noise.",
      "Cost dashboards deserve ongoing, first-class observability status (broken down by feature) rather than remaining a one-time launch estimate, since actual cost drifts over time just as behavior does.",
    ],
    keyTakeawaysHi: [
      "Ek developer ka subjective sense ki ek prompt 'behtar feel karta hai' confirmation bias (Module 4) ke subject hai aur evidence nahi hai — ek genuine A/B test jo real outcomes ko actual user traffic ke across compare karta hai chahiye.",
      'Consistent variant assignment (wahi user hamesha wahi version paata hai) ek genuine methodological requirement hai, ek implementation detail nahi — inconsistent exposure comparison ko contaminate karti hai.',
      'Statistical significance, sirf ek observed difference nahi, ek A/B test winner declare karne se pehle check ki jaani chahiye — small sample sizes aasani se aise differences produce kar sakte hain jo actually random noise hain.',
      'Cost dashboards ongoing, first-class observability status deserve karte hain (feature ke hisaab se broken down) ek one-time launch estimate rehne ke bajaye, kyunki actual cost time ke saath drift karta hai wahi tarike se jaise behavior karta hai.',
    ],
  },
];
