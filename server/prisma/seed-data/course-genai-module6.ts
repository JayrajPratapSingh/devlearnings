/**
 * Generative AI Complete Course — Module 6: Structured Outputs at Scale, lessons 1-3.
 *
 * Lesson 1: JSON-schema-constrained generation vs. plain JSON mode.
 * Lesson 2: Tool-calling as a structured-output mechanism vs. a dedicated response_format API.
 * Lesson 3: Parsing reliably and retry-on-invalid-output strategies.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-json-schema-constrained-generation',
    title: 'JSON-Schema-Constrained Generation vs Plain JSON Mode',
    titleHi: 'JSON-Schema-Constrained Generation vs Plain JSON Mode',
    description:
      "Module 3 previewed asking a model to respond in JSON. This lesson covers the real spectrum of how strictly that request can actually be enforced — from a soft instruction the model might not follow exactly, to schema-level constraints that make an invalid response structurally impossible.",
    descriptionHi:
      'Module 3 ne ek model ko JSON mein respond karne ke liye poochne ka preview diya. Ye lesson us real spectrum ko cover karta hai ki us request ko actually kitna strictly enforce kiya ja sakta hai — ek soft instruction se jise model exactly follow na kare, un schema-level constraints tak jo ek invalid response ko structurally impossible bana dete hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Asking a guest to \"please dress formally\" versus handing them a specific uniform that physically cannot be worn incorrectly.** A verbal request for formal dress is a strong signal, and most guests will comply reasonably well — but \"formal\" is still subject to interpretation, and someone might show up in something that technically isn't quite what you meant. Handing someone an actual uniform with a specific number of buttons, a specific collar, a specific fit removes that interpretation gap entirely — the garment's own physical structure enforces compliance, not just the guest's good-faith effort to follow an instruction. Plain \"respond in JSON\" prompting (Module 3's preview) is the verbal request — usually followed, occasionally not exactly. JSON-schema-constrained generation is the uniform: the generation process itself is mechanically restricted to only ever produce tokens that keep the output validly matching the schema, making a structurally invalid response not just unlikely, but genuinely impossible to produce.",
      hi: 'Ek guest se poochna "please formally dress karo" versus unhe ek specific uniform de dena jise physically incorrectly pehna hi nahi ja sakta. Formal dress ke liye ek verbal request ek strong signal hai, aur zyadatar guests reasonably well comply karenge — par "formal" abhi bhi interpretation ke subject hai, aur koi aisi cheez pehen kar aa sakta hai jo technically bilkul wo nahi hai jo aapka matlab tha. Kisi ko ek actual uniform dena jiske specific number of buttons hain, ek specific collar hai, ek specific fit hai us interpretation gap ko poori tarah hatata hai — garment ki apni physical structure compliance enforce karti hai, sirf guest ki ek instruction follow karne ki good-faith koshish nahi. Plain "respond in JSON" prompting (Module 3 ka preview) wo verbal request hai — usually followed, occasionally exactly nahi. JSON-schema-constrained generation wo uniform hai: generation process khud mechanically restricted hai sirf un tokens produce karne ke liye jo output ko schema se validly matching rakhte hain, ek structurally invalid response ko sirf unlikely nahi, genuinely impossible produce karne ke liye banate hue.',
    },

    simple: `**Plain JSON prompting (Module 3's preview) — a strong but soft
signal:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  messages: [{ role: 'user', content:
    'Respond with ONLY valid JSON: {"name": string, "age": number}. Extract from: "Priya is 28 years old."'
  }],
});
// Usually works. But nothing MECHANICALLY prevents the model from
// occasionally adding a leading "Here's the JSON:" sentence, using
// single quotes instead of double, or producing age as a string "28"
// instead of a number — the instruction is a strong signal, not an
// enforced constraint.
\`\`\`

**Schema-constrained generation — the provider enforces the shape at
the generation level itself:**

\`\`\`ts
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: personSchema,
  prompt: 'Extract from: "Priya is 28 years old."',
});

console.log(object); // { name: 'Priya', age: 28 } — GUARANTEED to match
                      // the schema's types, or the call throws/retries
                      // (Lesson 3) — never a malformed shape silently
                      // returned
\`\`\`

**Why this is a genuinely different guarantee, not just "better
prompting":**

\`\`\`
Plain JSON prompting: the model is STRONGLY influenced to produce valid
  JSON matching a described shape, but the generation process itself has
  no structural awareness of "must be valid JSON" — it's just producing
  the most plausible next token given an instruction, same as any other
  text (Module 1).

Schema-constrained generation: the provider's generation process
  ITSELF is restricted, at each token, to only continue in ways that
  keep the output on a path toward validly matching the schema — a
  mechanism operating BELOW the level of "the model chose to comply,"
  closer to how a fill-in-the-blank form structurally can't produce a
  free-form essay no matter what's typed into it.
\`\`\`

**When the difference actually matters practically:** for a low-stakes,
occasional extraction where a human might glance at the result, plain
JSON prompting combined with a parse-and-retry strategy (Lesson 3) is
often sufficient and simpler. For a pipeline processing thousands of
requests unattended, where even a small failure rate compounds into a
real, recurring problem, schema-constrained generation's structural
guarantee is worth its (typically modest) additional complexity — the
same "does this failure mode actually matter at this scale" judgment
call this course has applied to other reliability tradeoffs.`,

    simpleHi: `**Plain JSON prompting (Module 3 ka preview) — ek strong par soft
signal:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  messages: [{ role: 'user', content:
    'Respond with ONLY valid JSON: {"name": string, "age": number}. Extract from: "Priya is 28 years old."'
  }],
});
// Usually kaam karta hai. Par kuch bhi MECHANICALLY model ko occasionally
// ek leading "Here's the JSON:" sentence add karne se, double ke
// bajaye single quotes use karne se, ya age ko number ke bajaye ek
// string "28" ki tarah produce karne se nahi rokta — instruction ek
// strong signal hai, ek enforced constraint nahi.
\`\`\`

**Schema-constrained generation — provider khud generation level pe
shape enforce karta hai:**

\`\`\`ts
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: personSchema,
  prompt: 'Extract from: "Priya is 28 years old."',
});

console.log(object); // { name: 'Priya', age: 28 } — GUARANTEED schema
                      // ke types se match karega, ya call throw/retry
                      // karta hai (Lesson 3) — kabhi bhi ek malformed
                      // shape silently return nahi hoti
\`\`\`

**Ye ek genuinely alag guarantee kyun hai, sirf "better prompting" nahi:**

\`\`\`
Plain JSON prompting: model ko STRONGLY influence kiya jata hai ek
  described shape se match karne wali valid JSON produce karne ke liye,
  par generation process khud ke paas "must be valid JSON" ka koi
  structural awareness nahi hai — ye sirf ek instruction ko dekhkar
  sabse plausible agla token produce kar raha hai, kisi bhi doosre text
  ki tarah (Module 1).

Schema-constrained generation: provider ka generation process KHUD
  restricted hai, har token pe, sirf un tareekon mein continue karne ke
  liye jo output ko schema se validly match karne ki taraf ek path pe
  rakhte hain — ek mechanism jo "model ne comply karne ka choice kiya"
  level se NICHE operate karta hai, us tarike ke zyada close jaise ek
  fill-in-the-blank form structurally ek free-form essay produce nahi
  kar sakta chahe usme kuch bhi type kiya jaaye.
\`\`\`

**Difference actually practically kab matter karta hai:** ek low-stakes,
occasional extraction ke liye jahan ek insaan result glance kar sakta
hai, plain JSON prompting ek parse-and-retry strategy (Lesson 3) ke
saath combined aksar sufficient aur simpler hai. Ek pipeline ke liye jo
hazaron requests unattended process karta hai, jahan ek chhoti failure
rate bhi ek real, recurring problem mein compound ho jaati hai,
schema-constrained generation ki structural guarantee apni (typically
modest) additional complexity deserve karti hai — wahi "kya ye failure
mode actually is scale pe matter karta hai" judgment call jo is course
ne doosre reliability tradeoffs pe apply ki hai.`,

    content: `## Why plain JSON prompting is fundamentally a request, not a
constraint

Module 1 established that a model produces the most plausible next
token given a sequence, and Module 5, Lesson 3 established that a
model's output — including a request to produce JSON — is generated
content, not verified against ground truth. Asking for JSON in plain
prose is an instruction the generation process is strongly influenced
by, but the underlying mechanism has no built-in awareness of JSON's
actual grammar; it's simply predicting plausible tokens given an
instruction that happens to describe a format. This is why plain JSON
prompting occasionally fails in specific, recognizable ways — an
explanatory sentence before the JSON, inconsistent quoting, a number
represented as a string — failures that are individually rare but
non-zero at scale.

## Why schema-constrained generation is a mechanistically different
guarantee

Schema-constrained generation (as implemented by \`generateObject\` and
similar provider-level features) operates the generation process itself
under a structural restriction: at each token, only continuations that
keep the output on a valid path toward matching the schema are
considered eligible. This is a genuinely different category of
guarantee from "the model was instructed to and usually complies" — it's
closer to Module 1's tokenization lesson in spirit: just as a token is a
structural fact about how the model processes text, this constraint
operates at a structural level below the model's own "decision" to
follow an instruction, making certain invalid outputs mechanically
impossible to produce rather than merely unlikely.

## Why the choice between the two isn't "always use the stronger
guarantee"

Schema-constrained generation typically comes with tradeoffs — provider
support varies, it can slightly constrain the model's ability to express
uncertainty or explain a partial result, and it adds a small amount of
integration complexity compared to a plain prompt. For low-stakes,
occasional, or human-reviewed use cases, plain JSON prompting combined
with the retry-on-invalid strategy Lesson 3 covers is often the more
pragmatic choice — the stronger guarantee is worth reaching for
specifically when failure compounds at scale (an unattended pipeline
processing thousands of requests) or when a malformed output has real
downstream consequences (feeding directly into another system with no
human review).

## How this connects forward to tool calling and RAG

Module 5's tool calling is, structurally, a specific application of
schema-constrained generation — a tool's parameter schema constrains the
model's tool_use output the same way a response schema constrains
generateObject's output, which is why the two mechanisms share so much
underlying logic. Module 7-8's RAG pipelines frequently combine
retrieval with structured extraction (pulling specific fields out of
retrieved documents), making this lesson's distinction between soft and
hard structural guarantees directly relevant to how reliably that
extraction step can be trusted downstream.`,

    contentHi: `## Plain JSON prompting fundamentally ek request kyun hai, ek constraint nahi

Module 1 ne establish kiya ki ek model ek sequence ko dekhkar sabse
plausible agla token produce karta hai, aur Module 5, Lesson 3 ne
establish kiya ki ek model ka output — JSON produce karne ki request
samet — generated content hai, ground truth ke against verified nahi.
Plain prose mein JSON maangna ek instruction hai jise generation
process strongly influenced hota hai, par underlying mechanism ke paas
JSON ke actual grammar ka koi built-in awareness nahi hai; ye simply ek
instruction dekhkar plausible tokens predict kar raha hai jo ek format
describe karta hai. Yahi wajah hai plain JSON prompting occasionally
specific, recognizable tareekon se fail hota hai — JSON se pehle ek
explanatory sentence, inconsistent quoting, ek number jo ek string ki
tarah represent hota hai — failures jo individually rare hain par scale
pe non-zero.

## Schema-constrained generation ek mechanistically alag guarantee kyun hai

Schema-constrained generation (jaise \`generateObject\` aur similar
provider-level features dwara implement kiya gaya) generation process
khud ko ek structural restriction ke under operate karata hai: har
token pe, sirf wo continuations eligible consider kiye jaate hain jo
output ko schema se match karne ki taraf ek valid path pe rakhte hain.
Ye "model ko instruct kiya gaya tha aur usually comply karta hai" se ek
genuinely alag category ka guarantee hai — ye Module 1 ke tokenization
lesson ke spirit mein zyada close hai: bilkul jaise ek token ek
structural fact hai ki model text ko kaise process karta hai, ye
constraint model ke apne "decision" se instruction follow karne ke level
se niche operate karta hai, certain invalid outputs ko sirf unlikely
nahi, mechanically impossible to produce banate hue.

## In dono ke beech choice "hamesha stronger guarantee use karo" kyun nahi hai

Schema-constrained generation typically tradeoffs ke saath aata hai —
provider support vary karta hai, ye model ki ek partial result explain
ya uncertainty express karne ki ability ko slightly constrain kar sakta
hai, aur ek plain prompt ke comparison mein thodi integration
complexity add karta hai. Low-stakes, occasional, ya human-reviewed use
cases ke liye, plain JSON prompting retry-on-invalid strategy (Lesson
3 cover karta hai) ke saath combined aksar zyada pragmatic choice hai —
stronger guarantee specifically tab reach karne layak hai jab failure
scale pe compound hoti hai (ek unattended pipeline jo hazaron requests
process karti hai) ya jab ek malformed output ke real downstream
consequences hain (kisi doosre system mein directly feed hote hue bina
kisi human review ke).

## Ye forward tool calling aur RAG se kaise connect karta hai

Module 5 ka tool calling, structurally, schema-constrained generation
ka ek specific application hai — ek tool ka parameter schema model ke
tool_use output ko constrain karta hai wahi tarike se jaise ek response
schema generateObject ke output ko constrain karta hai, yahi wajah hai
ki do mechanisms itna underlying logic share karte hain. Module 7-8 ke
RAG pipelines aksar retrieval ko structured extraction ke saath combine
karte hain (retrieved documents se specific fields pull karte hue), is
lesson ki soft aur hard structural guarantees ke beech distinction ko
directly relevant banate hue ki wo extraction step downstream kitna
reliably trust kiya ja sakta hai.`,

    examples: [
      {
        title: 'Comparing plain JSON prompting\'s occasional failure against generateObject\'s structural guarantee',
        titleHi: 'Plain JSON prompting ke occasional failure ko generateObject ki structural guarantee ke against compare karna',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import { generateObject } from 'ai';
import { anthropic as aiSdkAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Approach 1 — plain JSON prompting, requires manual parsing and
// defensive handling of occasional non-conforming output
async function extractPlain(text) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content:
      \`Respond with ONLY valid JSON: {"name": string, "age": number}. Extract from: "\${text}"\`
    }],
  });
  const raw = response.content[0].text;
  return JSON.parse(raw); // can throw if the model added stray text,
                           // used markdown code fences, etc.
}

// Approach 2 — schema-constrained generation, structurally guaranteed
const personSchema = z.object({ name: z.string(), age: z.number() });

async function extractConstrained(text) {
  const { object } = await generateObject({
    model: aiSdkAnthropic('claude-sonnet-4-5'),
    schema: personSchema,
    prompt: \`Extract from: "\${text}"\`,
  });
  return object; // guaranteed to match personSchema's shape and types
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import { generateObject } from 'ai';
import { anthropic as aiSdkAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Approach 1 — plain JSON prompting, requires manual parsing and
// defensive handling of occasional non-conforming output
async function extractPlain(text: string): Promise<unknown> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content:
      \`Respond with ONLY valid JSON: {"name": string, "age": number}. Extract from: "\${text}"\`
    }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return JSON.parse(block.text); // can throw if the model added stray
                                   // text, used markdown code fences, etc.
}

// Approach 2 — schema-constrained generation, structurally guaranteed
const personSchema = z.object({ name: z.string(), age: z.number() });
type Person = z.infer<typeof personSchema>;

async function extractConstrained(text: string): Promise<Person> {
  const { object } = await generateObject({
    model: aiSdkAnthropic('claude-sonnet-4-5'),
    schema: personSchema,
    prompt: \`Extract from: "\${text}"\`,
  });
  return object; // guaranteed to match personSchema's shape and types
}`,
        code: `// Plain: requires manual JSON.parse() and defensive handling
const raw = response.content[0].text;
return JSON.parse(raw);

// Constrained: structurally guaranteed
const { object } = await generateObject({ model, schema: personSchema, prompt });
return object;`,
        output:
          "extractPlain works correctly most of the time but can throw on the rare occasion the model prefixes its JSON with an explanatory sentence or uses a markdown code fence. extractConstrained never produces a shape that fails to match personSchema — the generation process itself is restricted to prevent it.",
        explain:
          "The difference isn't in how carefully the prompt is worded — it's in WHERE the guarantee comes from: extractPlain's reliability depends on the model choosing to comply with an instruction, while extractConstrained's reliability comes from a structural restriction on the generation process itself, a mechanistically stronger guarantee.",
        explainHi:
          "Difference is baat mein nahi hai ki prompt kitni carefully worded hai — ye is baat mein hai ki guarantee KAHAN se aati hai: extractPlain ki reliability is baat pe depend karti hai ki model ek instruction comply karne ka choice karta hai, jabki extractConstrained ki reliability generation process pe khud ek structural restriction se aati hai, ek mechanistically stronger guarantee.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming plain JSON prompting is "basically the same" as schema-constrained generation
async function extractCustomerData(text) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: \`Respond with JSON only: \${text}\` }],
  });
  // No try/catch, no validation, no retry — assuming this NEVER fails
  const data = JSON.parse(response.content[0].text);
  await db.customer.create({ data }); // directly trusting an unvalidated shape
}`,
        right: `// Using schema-constrained generation for a pipeline where malformed
// output has real downstream consequences (writing to a database)
import { generateObject } from 'ai';
import { z } from 'zod';

const customerSchema = z.object({ name: z.string(), email: z.string().email() });

async function extractCustomerData(text) {
  const { object } = await generateObject({
    model: aiSdkAnthropic('claude-sonnet-4-5'),
    schema: customerSchema,
    prompt: text,
  });
  await db.customer.create({ data: object }); // structurally guaranteed to match
}`,
        why: "Plain JSON prompting's reliability is a strong signal, not a guarantee — an unattended pipeline writing directly to a database on the assumption that JSON.parse() will always succeed and always produce the exact expected shape will eventually fail on a malformed response. Schema-constrained generation removes this specific risk at the source.",
        whyHi:
          "Plain JSON prompting ki reliability ek strong signal hai, ek guarantee nahi — ek unattended pipeline jo is assumption pe directly ek database mein likhti hai ki JSON.parse() hamesha succeed karega aur hamesha exact expected shape produce karega eventually ek malformed response pe fail hoga. Schema-constrained generation is specific risk ko source pe hi hatata hai.",
      },
    ],

    realWorld: [
      {
        en: "A production data-pipeline extracting structured fields from thousands of unattended customer emails uses schema-constrained generation specifically because a single malformed extraction feeding directly into a downstream billing system, unreviewed, could cause a real financial error — the stronger structural guarantee is worth the integration cost at that scale and stakes.",
        hi: 'Ek production data-pipeline jo hazaron unattended customer emails se structured fields extract karta hai schema-constrained generation specifically isliye use karta hai kyunki ek single malformed extraction jo directly ek downstream billing system mein feed hoti hai, unreviewed, ek real financial error cause kar sakti hai — us scale aur stakes pe stronger structural guarantee integration cost deserve karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental mechanistic difference between plain JSON prompting and schema-constrained generation?',
        qHi: 'Plain JSON prompting aur schema-constrained generation ke beech fundamental mechanistic difference kya hai?',
        a: "Plain JSON prompting is an instruction the generation process is strongly influenced by, with no structural awareness of JSON's grammar built into the mechanism — the model is simply predicting plausible tokens given an instruction. Schema-constrained generation restricts the generation process itself at each token to only continuations that keep the output on a valid path toward the schema, making an invalid shape mechanically impossible rather than merely unlikely.",
        aHi: 'Plain JSON prompting ek instruction hai jise generation process strongly influenced hota hai, mechanism mein built-in JSON ke grammar ka koi structural awareness ke bina — model simply ek instruction dekhkar plausible tokens predict kar raha hai. Schema-constrained generation generation process ko khud har token pe restrict karta hai sirf un continuations tak jo output ko schema ki taraf ek valid path pe rakhte hain, ek invalid shape ko mechanically impossible banate hue sirf unlikely ke bajaye.',
      },
      {
        q: 'When would you choose plain JSON prompting over schema-constrained generation, given the latter\'s stronger guarantee?',
        qHi: 'Plain JSON prompting ko schema-constrained generation ke upar kab choose karoge, dusre ki stronger guarantee ko dekhte hue?',
        a: "For low-stakes, occasional, or human-reviewed use cases, where a small failure rate is acceptable and simplicity is valued — plain JSON prompting combined with parse-and-retry is often sufficient and avoids the integration overhead and potential expressiveness constraints of schema-constrained generation. The stronger guarantee earns its cost specifically at scale, or when a malformed output has real, unreviewed downstream consequences.",
        aHi: 'Low-stakes, occasional, ya human-reviewed use cases ke liye, jahan ek chhoti failure rate acceptable hai aur simplicity valued hai — plain JSON prompting parse-and-retry ke saath combined aksar sufficient hai aur schema-constrained generation ke integration overhead aur potential expressiveness constraints se bachta hai. Stronger guarantee apna cost specifically scale pe, ya jab ek malformed output ke real, unreviewed downstream consequences hon tab earn karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team building an internal tool where a human reviews every AI-generated summary before it's used debates whether to invest in schema-constrained generation or stick with plain JSON prompting plus manual retry. Using this lesson's reasoning, recommend an approach and justify it.",
        taskHi: 'Ek team jo ek internal tool bana rahi hai jahan ek human har AI-generated summary review karta hai isse pehle ki use kiya jaaye debate karti hai ki schema-constrained generation mein invest kare ya plain JSON prompting plus manual retry pe stick kare. Is lesson ki reasoning use karke, ek approach recommend karo aur ise justify karo.',
        hint: "Consider the stakes: is there a human reviewing every output before it's used, and does a small, occasional failure rate compound into a real problem at this scale?",
        hintHi: 'Stakes consider karo: kya ek human har output ko review karta hai use hone se pehle, aur kya ek chhoti, occasional failure rate is scale pe ek real problem mein compound hoti hai?',
      },
    ],

    keyTakeaways: [
      "Plain JSON prompting is an instruction the generation process is strongly influenced by — it can still occasionally produce non-conforming output since the underlying mechanism has no built-in awareness of JSON's grammar.",
      'Schema-constrained generation restricts the generation process itself at each token, making an invalid shape mechanically impossible to produce rather than merely unlikely — a genuinely stronger guarantee, not just better prompting.',
      "The choice between the two is a judgment call based on stakes and scale: plain JSON prompting plus retry is often sufficient for low-stakes or human-reviewed cases; schema-constrained generation earns its cost when failure compounds at scale or feeds unreviewed downstream systems.",
      "Tool calling (Module 5) is structurally a specific application of schema-constrained generation — a tool's parameter schema constrains output the same way a response schema does.",
    ],
    keyTakeawaysHi: [
      'Plain JSON prompting ek instruction hai jise generation process strongly influenced hota hai — ye abhi bhi occasionally non-conforming output produce kar sakta hai kyunki underlying mechanism mein JSON ke grammar ka koi built-in awareness nahi hai.',
      'Schema-constrained generation generation process ko khud har token pe restrict karta hai, ek invalid shape ko produce karna mechanically impossible banate hue sirf unlikely ke bajaye — ek genuinely stronger guarantee, sirf better prompting nahi.',
      'In dono ke beech choice stakes aur scale ke basis pe ek judgment call hai: plain JSON prompting plus retry aksar low-stakes ya human-reviewed cases ke liye sufficient hai; schema-constrained generation apna cost tab earn karta hai jab failure scale pe compound hoti hai ya unreviewed downstream systems ko feed karti hai.',
      'Tool calling (Module 5) structurally schema-constrained generation ka ek specific application hai — ek tool ka parameter schema output ko wahi tarike se constrain karta hai jaise ek response schema karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-tool-calling-vs-response-format',
    title: 'Tool-Calling as Structured Output vs a Dedicated response_format API',
    titleHi: 'Tool-Calling Structured Output Ki Tarah vs Ek Dedicated response_format API',
    description:
      "Two genuinely different provider-level mechanisms accomplish the same goal (a guaranteed output shape): borrowing Module 5's tool-calling protocol as a structured-output trick, versus a purpose-built response_format/schema API. This lesson covers when each is the more natural fit.",
    descriptionHi:
      'Do genuinely alag provider-level mechanisms wahi goal (ek guaranteed output shape) achieve karte hain: Module 5 ke tool-calling protocol ko ek structured-output trick ki tarah borrow karna, versus ek purpose-built response_format/schema API. Ye lesson cover karta hai ki har ek kab zyada natural fit hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: "**Using a shipping company's package-tracking form as a general-purpose data-entry form (technically works — it has labeled fields) versus using a form actually designed for the data you're collecting.** A shipping company's tracking-number form has structured, labeled fields (sender, recipient, weight, dimensions) — if you genuinely needed to collect similar-shaped data for something unrelated to shipping, you COULD repurpose that form, and it would technically capture structured data reliably. But a form actually designed for your specific purpose, from scratch, tends to be a more natural fit — no leftover fields that don't quite apply, no conceptual mismatch between what the form was built for and what you're actually using it for. Tool calling (Module 5) can be, and often is, repurposed purely as a structured-output mechanism — define a single \"tool\" that isn't meant to be executed at all, just used to force a specific output shape — and it works reliably. A dedicated response_format/schema API is the form built specifically for structured output from the start, without borrowing a mechanism designed for a different original purpose.",
      hi: 'Ek shipping company ke package-tracking form ko ek general-purpose data-entry form ki tarah use karna (technically kaam karta hai — iske paas labeled fields hain) versus ek form use karna jo actually us data ke liye design kiya gaya hai jise aap collect kar rahe ho. Ek shipping company ke tracking-number form ke paas structured, labeled fields hain (sender, recipient, weight, dimensions) — agar aapko genuinely shipping se unrelated kisi cheez ke liye similar-shaped data collect karna hai, aap us form ko repurpose KAR SAKTE HO, aur ye technically structured data ko reliably capture karega. Par ek form jo actually aapke specific purpose ke liye scratch se design kiya gaya hai zyada natural fit hota hai — koi leftover fields nahi jo quite apply nahi karte, form kis liye banaya gaya aur aap actually kis liye use kar rahe ho ke beech koi conceptual mismatch nahi. Tool calling (Module 5) ko purely ek structured-output mechanism ki tarah repurpose kiya ja sakta hai, aur aksar kiya jaata hai — ek single "tool" define karo jo execute hone ke liye bilkul meant nahi hai, bas ek specific output shape force karne ke liye use kiya jaata hai — aur ye reliably kaam karta hai. Ek dedicated response_format/schema API wo form hai jo specifically structured output ke liye shuru se banaya gaya, ek doosre original purpose ke liye design kiye gaye mechanism ko borrow kiye bina.',
    },

    simple: `**Approach 1 — repurposing tool calling for structured output (a
common, pragmatic pattern):**

\`\`\`ts
// Defining a "tool" that will never actually be executed — its only
// purpose is forcing the model to produce a specific output shape
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  tools: [{
    name: 'record_analysis',
    description: 'Record the structured analysis of the review.',
    input_schema: {
      type: 'object',
      properties: {
        sentiment: { type: 'string', enum: ['positive', 'negative', 'mixed'] },
        summary: { type: 'string' },
      },
      required: ['sentiment', 'summary'],
    },
  }],
  tool_choice: { type: 'tool', name: 'record_analysis' }, // FORCE this tool
  messages: [{ role: 'user', content: 'Analyze: "Great food, slow service."' }],
});

// The tool_use block's "input" IS the structured output — no execution
// ever happens, "record_analysis" is never a real function
const toolUse = response.content.find((b) => b.type === 'tool_use');
console.log(toolUse.input); // { sentiment: 'mixed', summary: '...' }
\`\`\`

**Approach 2 — a dedicated structured-output API (\`generateObject\`,
Lesson 1) built specifically for this purpose:**

\`\`\`ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'mixed']),
    summary: z.string(),
  }),
  prompt: 'Analyze: "Great food, slow service."',
});
console.log(object); // { sentiment: 'mixed', summary: '...' } — direct,
                      // no tool-call indirection needed
\`\`\`

**Why both approaches genuinely work, and what actually differs:**

\`\`\`
Both rely on the SAME underlying schema-constrained generation
mechanism (Lesson 1) — a tool's input_schema and generateObject's
schema are both, fundamentally, constraints on the shape of generated
output. The difference is API SURFACE and INTENT SIGNALING:

- Tool-calling-as-structured-output is a pragmatic reuse of a mechanism
  that already exists for a different primary purpose (Module 5's real
  tool execution) — useful when you're ALREADY using tools in a
  conversation and want one MORE structured output alongside them, or
  when your provider doesn't yet have a dedicated structured-output API.

- A dedicated response_format/schema API is a more direct, purpose-built
  fit when structured output is the ENTIRE point of the call — no real
  tool execution involved at all, just "give me data in this shape."
\`\`\`

**The practical decision this lesson teaches:** if a request already
involves real tool calls (Module 5) and you also need one piece of
structured output, adding another "tool" definition that's never
executed can be simpler than mixing two different API patterns in one
request. If a request's ENTIRE purpose is structured extraction with no
tool execution involved, a dedicated schema API is the more direct,
conceptually cleaner fit — the same "use the tool actually built for
this job" reasoning as the analogy above.`,

    simpleHi: `**Approach 1 — structured output ke liye tool calling ko repurpose
karna (ek common, pragmatic pattern):**

\`\`\`ts
// Ek "tool" define karna jo kabhi actually execute nahi hoga — iska
// ekmatra purpose model ko ek specific output shape produce karne ke
// liye force karna hai
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  tools: [{
    name: 'record_analysis',
    description: 'Record the structured analysis of the review.',
    input_schema: {
      type: 'object',
      properties: {
        sentiment: { type: 'string', enum: ['positive', 'negative', 'mixed'] },
        summary: { type: 'string' },
      },
      required: ['sentiment', 'summary'],
    },
  }],
  tool_choice: { type: 'tool', name: 'record_analysis' }, // Ise FORCE karo
  messages: [{ role: 'user', content: 'Analyze: "Great food, slow service."' }],
});

// tool_use block ka "input" HI structured output hai — koi execution
// kabhi nahi hota, "record_analysis" kabhi ek real function nahi hai
const toolUse = response.content.find((b) => b.type === 'tool_use');
console.log(toolUse.input); // { sentiment: 'mixed', summary: '...' }
\`\`\`

**Approach 2 — ek dedicated structured-output API (\`generateObject\`,
Lesson 1) specifically iske liye banaya gaya:**

\`\`\`ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'mixed']),
    summary: z.string(),
  }),
  prompt: 'Analyze: "Great food, slow service."',
});
console.log(object); // { sentiment: 'mixed', summary: '...' } — direct,
                      // koi tool-call indirection zaroori nahi
\`\`\`

**Dono approaches genuinely kaam kyun karte hain, aur actually kya
alag hai:**

\`\`\`
Dono wahi underlying schema-constrained generation mechanism (Lesson 1)
pe rely karte hain — ek tool ka input_schema aur generateObject ka
schema dono, fundamentally, generated output ki shape pe constraints
hain. Difference API SURFACE aur INTENT SIGNALING hai:

- Tool-calling-as-structured-output ek mechanism ka ek pragmatic reuse
  hai jo already ek doosre primary purpose ke liye exist karta hai
  (Module 5 ka real tool execution) — useful hai jab aap ALREADY ek
  conversation mein tools use kar rahe ho aur unke saath ek AUR
  structured output chahte ho, ya jab aapke provider ke paas abhi tak
  ek dedicated structured-output API nahi hai.

- Ek dedicated response_format/schema API ek zyada direct, purpose-built
  fit hai jab structured output call ka POORA point hai — koi real tool
  execution bilkul involved nahi, bas "mujhe is shape mein data do."
\`\`\`

**Practical decision jo ye lesson sikhata hai:** agar ek request
already real tool calls involve karti hai (Module 5) aur aapko ek piece
of structured output bhi chahiye, ek aur "tool" definition add karna jo
kabhi execute nahi hoti ek request mein do alag API patterns mix karne
se simpler ho sakta hai. Agar ek request ka POORA purpose structured
extraction hai bina kisi tool execution involved ke, ek dedicated
schema API zyada direct, conceptually cleaner fit hai — wahi "us kaam ke
liye actually banaya gaya tool use karo" reasoning jo upar ki analogy
mein hai.`,

    content: `## Why both mechanisms rest on the same underlying capability

Lesson 1 established that schema-constrained generation restricts the
generation process at the token level to only produce output matching a
given shape. Both tool-calling's input_schema and a dedicated
response_format/schema API's schema are, mechanistically, the exact same
kind of constraint applied at that level — a tool's parameters are
simply a schema the generation process is constrained to match, and a
generateObject-style call's schema is the identical constraint applied
without the tool-execution framing around it. Neither is more
"powerful" than the other in the guarantee it provides; they differ in
API shape and conceptual framing, not underlying mechanism.

## Why repurposing tool calling for structured output is a genuinely
reasonable pattern, not a hack

Because the schema-constraint mechanism underneath both approaches is
identical, using a "tool" purely to force a specific output shape — with
no intention of ever executing it — is not an abuse of the mechanism,
it's a direct application of the same underlying capability through an
API surface that happens to already be in use. This is particularly
natural when a single request already involves real tool calls (Module
5) and also needs one piece of guaranteed-shape output: reusing the
existing tools array avoids introducing a second, differently-shaped API
pattern into the same request.

## Why a dedicated structured-output API is the more natural fit for
the "no execution involved" case

When a call's entire purpose is producing a specific data shape, with no
real function ever being executed, framing it as a tool call adds a
layer of tool-execution vocabulary and response parsing (finding a
tool_use block, handling a tool_choice parameter) that doesn't map onto
what's actually happening. A dedicated schema API expresses the intent
directly — "give me data matching this shape" — without borrowing
concepts (tool names, execution semantics) that don't genuinely apply.

## How this choice connects to Module 5 and forward to RAG

Because tool calling and structured output share the same underlying
mechanism, a system combining Module 5's real tool use with Module 7-8's
RAG-based extraction often ends up using both patterns in the same
codebase — real tools for actions with actual side effects, and either
a forced "recording" tool or a dedicated schema call for pure data
shaping, chosen based on which framing fits a given call's actual
purpose. Recognizing that the choice is about fit and clarity rather
than capability is the practical skill this lesson develops.`,

    contentHi: `## Dono mechanisms wahi underlying capability pe kyun rest karte hain

Lesson 1 ne establish kiya ki schema-constrained generation generation
process ko token level pe restrict karta hai sirf ek given shape se
match karne wala output produce karne ke liye. Dono tool-calling ka
input_schema aur ek dedicated response_format/schema API ka schema,
mechanistically, exactly wahi kism ka constraint hain us level pe
applied — ek tool ke parameters simply ek schema hain jise generation
process match karne ke liye constrained hai, aur ek generateObject-style
call ka schema wahi identical constraint hai tool-execution framing ke
bina applied. Koi bhi ek doosre se "zyada powerful" nahi hai jo guarantee
ye provide karte hain; wo API shape aur conceptual framing mein alag
hain, underlying mechanism mein nahi.

## Structured output ke liye tool calling repurpose karna ek genuinely reasonable pattern kyun hai, ek hack nahi

Kyunki dono approaches ke niche schema-constraint mechanism identical
hai, ek "tool" ko purely ek specific output shape force karne ke liye
use karna — ise kabhi execute karne ke intention ke bina — mechanism ka
ek abuse nahi hai, ye wahi underlying capability ka ek direct
application hai ek API surface ke through jo already use mein hai. Ye
particularly natural hai jab ek single request already real tool calls
involve karti hai (Module 5) aur ek piece of guaranteed-shape output bhi
chahiye: existing tools array ko reuse karna wahi request mein ek
doosra, alag-shaped API pattern introduce karne se bachta hai.

## "Koi execution involved nahi" wale case ke liye ek dedicated structured-output API zyada natural fit kyun hai

Jab ek call ka poora purpose ek specific data shape produce karna hai,
bina kisi real function ke kabhi execute hue, ise ek tool call ki tarah
frame karna tool-execution vocabulary aur response parsing (ek tool_use
block dhundhna, ek tool_choice parameter handle karna) ki ek layer add
karta hai jo actually kya ho raha hai usse map nahi hoti. Ek dedicated
schema API intent ko directly express karta hai — "mujhe is shape se
match karne wala data do" — un concepts (tool names, execution
semantics) ko borrow kiye bina jo genuinely apply nahi hote.

## Ye choice Module 5 se aur forward RAG se kaise connect hoti hai

Kyunki tool calling aur structured output wahi underlying mechanism
share karte hain, ek system jo Module 5 ke real tool use ko Module 7-8
ke RAG-based extraction ke saath combine karta hai aksar wahi codebase
mein dono patterns use karte hue end up hota hai — actual side effects
wali actions ke liye real tools, aur pure data shaping ke liye ya to ek
forced "recording" tool ya ek dedicated schema call, is basis pe choose
kiya gaya ki kaunsi framing ek given call ke actual purpose ko fit karti
hai. Ye recognize karna ki choice capability ke baare mein nahi balki
fit aur clarity ke baare mein hai practical skill hai jise ye lesson
develop karta hai.`,

    examples: [
      {
        title: 'A single request combining a real tool call with a forced "recording" tool for structured output',
        titleHi: 'Ek single request jo ek real tool call ko structured output ke liye ek forced "recording" tool ke saath combine karta hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [
  {
    // A REAL tool — genuinely executed, has an actual side effect
    name: 'get_weather',
    description: 'Get the current weather for a city.',
    input_schema: {
      type: 'object',
      properties: { city: { type: 'string' } },
      required: ['city'],
    },
  },
  {
    // A tool that is NEVER executed — its only purpose is forcing a
    // structured summary once the real work is done
    name: 'record_trip_summary',
    description: 'Record a structured summary of the trip recommendation.',
    input_schema: {
      type: 'object',
      properties: {
        recommendedCity: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['recommendedCity', 'reason'],
    },
  },
];

// After the tool loop (Module 5, Lesson 2) resolves the real weather
// lookups, the model is guided to call record_trip_summary as its
// FINAL structured output — reusing the existing tools mechanism
// rather than introducing a second, differently-shaped API call`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    // A REAL tool — genuinely executed, has an actual side effect
    name: 'get_weather',
    description: 'Get the current weather for a city.',
    input_schema: {
      type: 'object',
      properties: { city: { type: 'string' } },
      required: ['city'],
    },
  },
  {
    // A tool that is NEVER executed — its only purpose is forcing a
    // structured summary once the real work is done
    name: 'record_trip_summary',
    description: 'Record a structured summary of the trip recommendation.',
    input_schema: {
      type: 'object',
      properties: {
        recommendedCity: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['recommendedCity', 'reason'],
    },
  },
];

// After the tool loop (Module 5, Lesson 2) resolves the real weather
// lookups, the model is guided to call record_trip_summary as its
// FINAL structured output — reusing the existing tools mechanism
// rather than introducing a second, differently-shaped API call`,
        code: `const tools = [
  { name: 'get_weather', description: '...', input_schema: { /* real */ } },
  { name: 'record_trip_summary', description: '...', input_schema: { /* structured output only */ } },
];`,
        output:
          "The model first calls get_weather (a real, executed action returning genuine data), then, once it has enough information, calls record_trip_summary with a well-formed { recommendedCity, reason } object — the second call is never executed as a function, only its structured input is used.",
        explain:
          "Both tools share the exact same schema-constrained generation mechanism (Lesson 1) — the difference is entirely in how the calling application treats each tool_use block afterward: one triggers real code, the other's input is simply read as the final structured result. This avoids mixing a tool-based conversation with a separate, differently-shaped structured-output API call.",
        explainHi:
          "Dono tools wahi exact schema-constrained generation mechanism (Lesson 1) share karte hain — difference poori tarah is baat mein hai ki calling application baad mein har tool_use block ko kaise treat karta hai: ek real code trigger karta hai, doosre ka input simply final structured result ki tarah padha jata hai. Ye ek tool-based conversation ko ek separate, differently-shaped structured-output API call ke saath mix karne se bachta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Mixing two different structured-output patterns awkwardly in one flow
const toolResponse = await anthropic.messages.create({
  model: 'claude-sonnet-4-5', max_tokens: 500, tools: [getWeatherTool], messages,
});
// ... resolve the real tool call, get weather data ...

// Then AWKWARDLY switching to a completely different API pattern just
// to get a structured summary, requiring a second, separate call and
// re-supplying context the model already has
const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: tripSummarySchema,
  prompt: \`Given this weather data: \${JSON.stringify(weatherData)}, summarize the trip.\`,
});`,
        right: `// Staying within one consistent tool-based flow for both real
// execution and the final structured output
const tools = [getWeatherTool, recordTripSummaryTool]; // the second never executes
// ... run the Module 5 tool loop until record_trip_summary is called ...
// its .input IS the structured summary — no second API call, no
// re-supplying context the model already has in its own conversation`,
        why: "Switching API patterns mid-flow means starting a fresh call that has to re-supply all relevant context, when the model already has that context in the ongoing tool-based conversation. Adding a second, non-executed tool to the SAME flow keeps the whole interaction in one consistent pattern.",
        whyHi:
          "Mid-flow API patterns switch karna matlab hai ek fresh call start karna jise saara relevant context re-supply karna padta hai, jab model ke paas already wo context ongoing tool-based conversation mein hai. SAME flow mein ek second, non-executed tool add karna poore interaction ko ek consistent pattern mein rakhta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production travel-planning assistant that both calls real flight/hotel search APIs (Module 5's real tools) and needs to produce a final structured itinerary summary uses a single tool-based conversation for both — the search tools genuinely execute, while a final 'finalize_itinerary' tool is never executed and exists purely to force the model's closing response into a guaranteed, parseable shape.",
        hi: 'Ek production travel-planning assistant jo dono real flight/hotel search APIs call karta hai (Module 5 ke real tools) aur ek final structured itinerary summary produce karne ki zaroorat hai dono ke liye ek single tool-based conversation use karta hai — search tools genuinely execute hote hain, jabki ek final \'finalize_itinerary\' tool kabhi execute nahi hota aur purely model ke closing response ko ek guaranteed, parseable shape mein force karne ke liye exist karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why can a tool that's never actually executed still be a legitimate way to get structured output from a model?",
        qHi: 'Ek tool jo kabhi actually execute nahi hota abhi bhi ek model se structured output paane ka ek legitimate tareeka kyun ho sakta hai?',
        a: "Because a tool's input_schema and a dedicated structured-output API's schema rest on the exact same underlying schema-constrained generation mechanism (Lesson 1). Using a tool purely to force a specific output shape isn't misusing the mechanism — it's applying that same underlying capability through an API surface that may already be in use for real tool calls in the same conversation.",
        aHi: 'Kyunki ek tool ka input_schema aur ek dedicated structured-output API ka schema exactly wahi underlying schema-constrained generation mechanism (Lesson 1) pe rest karte hain. Ek tool ko purely ek specific output shape force karne ke liye use karna mechanism ko misuse karna nahi hai — ye wahi underlying capability ko ek API surface ke through apply karna hai jo shayad already wahi conversation mein real tool calls ke liye use mein hai.',
      },
      {
        q: 'When is a dedicated structured-output API (like generateObject) a more natural fit than repurposing tool calling?',
        qHi: 'Ek dedicated structured-output API (jaise generateObject) tool calling ko repurpose karne se zyada natural fit kab hai?',
        a: "When a call's entire purpose is producing a specific data shape with no real function ever being executed — framing it as a tool call in that case adds unnecessary tool-execution vocabulary and response parsing that doesn't map onto what's actually happening. A dedicated schema API expresses the intent (\"give me data in this shape\") directly.",
        aHi: 'Jab ek call ka poora purpose ek specific data shape produce karna hai bina kisi real function ke kabhi execute hue — us case mein ise ek tool call ki tarah frame karna unnecessary tool-execution vocabulary aur response parsing add karta hai jo actually kya ho raha hai usse map nahi hota. Ek dedicated schema API intent ("mujhe is shape mein data do") ko directly express karta hai.',
      },
    ],

    exercises: [
      {
        task: "A system needs to (1) call a real database-lookup tool and (2) produce a final structured recommendation based on the lookup's result, all within one conversation. Describe which approach from this lesson fits better and why, versus a system whose ONLY job is extracting structured fields from a static block of text with no tool execution at all.",
        taskHi: 'Ek system ko (1) ek real database-lookup tool call karna hai aur (2) lookup ke result ke basis pe ek final structured recommendation produce karna hai, sab ek conversation ke andar. Describe karo ki is lesson se kaunsa approach zyada better fit karta hai aur kyun, versus ek system jiska EKMATRA kaam static block of text se structured fields extract karna hai bina kisi tool execution ke.',
        hint: "Consider whether real tool execution is already part of the flow, and whether introducing a second, differently-shaped API call would require re-supplying context the model already has.",
        hintHi: 'Consider karo ki kya real tool execution already flow ka hissa hai, aur kya ek second, differently-shaped API call introduce karna us context ko re-supply karega jo model ke paas already hai.',
      },
    ],

    keyTakeaways: [
      "Tool-calling's input_schema and a dedicated structured-output API's schema both rest on the same underlying schema-constrained generation mechanism (Lesson 1) — neither offers a stronger guarantee than the other.",
      "Repurposing tool calling for structured output (a tool that's never executed) is a legitimate, common pattern, especially when a request already involves real tool calls and needs one more piece of guaranteed-shape output.",
      "A dedicated structured-output API is the more natural fit when a call's entire purpose is data shaping with no real tool execution involved — it avoids borrowing tool-execution concepts that don't genuinely apply.",
      'The choice between the two approaches is about API fit and conceptual clarity, not capability — both mechanisms provide the identical structural guarantee.',
    ],
    keyTakeawaysHi: [
      'Tool-calling ka input_schema aur ek dedicated structured-output API ka schema dono wahi underlying schema-constrained generation mechanism (Lesson 1) pe rest karte hain — koi bhi doosre se stronger guarantee offer nahi karta.',
      'Structured output ke liye tool calling repurpose karna (ek tool jo kabhi execute nahi hota) ek legitimate, common pattern hai, especially jab ek request already real tool calls involve karti hai aur ek aur piece of guaranteed-shape output chahiye.',
      'Ek dedicated structured-output API zyada natural fit hai jab ek call ka poora purpose data shaping hai bina kisi real tool execution ke involved — ye tool-execution concepts borrow karne se bachta hai jo genuinely apply nahi hote.',
      'In dono approaches ke beech choice API fit aur conceptual clarity ke baare mein hai, capability ke baare mein nahi — dono mechanisms identical structural guarantee provide karte hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-parsing-reliably-and-retry-strategies',
    title: 'Parsing Reliably & Retry-on-Invalid-Output Strategies',
    titleHi: 'Reliably Parse Karna Aur Retry-on-Invalid-Output Strategies',
    description:
      "Closing this module: even schema-constrained generation can occasionally fail validation (a value outside a business rule's range, a genuinely malformed edge case), and even without it, a real system needs a concrete, bounded strategy for what happens when a structured response doesn't validate.",
    descriptionHi:
      'Is module ko close karte hue: schema-constrained generation bhi occasionally validation fail kar sakta hai (ek value jo ek business rule ki range se bahar hai, ek genuinely malformed edge case), aur uske bina bhi, ek real system ko ek concrete, bounded strategy chahiye ki jab ek structured response validate nahi hota to kya hota hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A quality-control inspector at the end of a production line who has a clear, predetermined procedure for a defective item, rather than being surprised each time one appears.** A factory that has never once planned for what happens when an item fails inspection is running on hope, not process — the moment a defective item genuinely appears (and eventually, one always does), the line stops in confusion because nobody decided in advance what to actually do. A well-run line has a clear, bounded procedure: send it back for rework once, and if it fails a second time, pull it aside for a human to look at, rather than sending a bad item to a customer OR looping it through rework indefinitely. A production AI feature's response validation needs exactly this predetermined procedure: what happens on the first invalid response (usually: retry, often with the validation error fed back to the model), what happens if it fails again (a second retry, or falling back to a simpler/more constrained approach), and where the bounded process ends (surfacing a clear error rather than looping forever or silently passing through bad data).",
      hi: 'Ek quality-control inspector ek production line ke end pe jiske paas ek defective item ke liye ek clear, predetermined procedure hai, har baar ek appear hone pe surprised hone ke bajaye. Ek factory jisne kabhi ek baar bhi plan nahi kiya ki jab ek item inspection fail karta hai to kya hota hai hope pe chal rahi hai, process pe nahi — jis moment ek defective item genuinely appear hota hai (aur eventually, ek hamesha hota hai), line confusion mein ruk jaati hai kyunki kisi ne advance mein decide nahi kiya actually kya karna hai. Ek well-run line ke paas ek clear, bounded procedure hai: ise ek baar rework ke liye wapas bhejo, aur agar ye doosri baar fail hota hai, ise ek side pe pull karo ek human ke dekhne ke liye, ek bad item ko customer ko bhejne YA use indefinitely rework ke through loop karne ke bajaye. Ek production AI feature ke response validation ko exactly ye predetermined procedure chahiye: pehle invalid response pe kya hota hai (usually: retry, aksar model ko validation error wapas feed karte hue), agar ye phir fail hota hai to kya hota hai (ek second retry, ya ek simpler/more constrained approach pe fall back karna), aur bounded process kahan khatam hoti hai (hamesha ke liye loop karne ya silently bad data pass through karne ke bajaye ek clear error surface karna).',
    },

    simple: `**The baseline pattern — validate, and on failure, retry with the
error fed back to the model:**

\`\`\`ts
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  totalCents: z.number().int().positive(),
});

async function extractWithRetry(text, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: attempt === 1
          ? \`Extract invoice fields from: \${text}\`
          // On retry, feed the SPECIFIC error back — the model can
          // often self-correct given concrete feedback, the same
          // "explicit intermediate information helps" principle from
          // Module 3's chain-of-thought lesson
          : \`Extract invoice fields from: \${text}\n\nYour previous attempt failed validation: \${lastError}. Please correct this.\`,
      });
      return object; // success — return immediately
    } catch (err) {
      lastError = err.message;
      if (attempt === maxAttempts) throw new Error(\`Extraction failed after \${maxAttempts} attempts: \${lastError}\`);
    }
  }
}
\`\`\`

**Why even schema-constrained generation (Lesson 1) still needs this:**
a JSON schema enforces STRUCTURE (correct types, required fields) but
can't always enforce every BUSINESS RULE — a schema can say "amount
must be a positive integer" but might not fully capture something like
"the sum of line items must equal the stated total." A structurally
valid object can still fail a business-rule-level check performed
separately, which needs the same retry discipline as a structural
parse failure.

**Why the retry loop needs a hard limit, echoing Module 5's tool-loop
lesson:** an unbounded retry loop is the exact same category of risk
Module 5 warned about for tool loops — each attempt is a real, billed
model call (Module 2), and a task the model genuinely cannot complete
correctly (an ambiguous source document, a fundamentally unclear
request) would otherwise retry forever, silently consuming cost with no
possibility of success. A bounded attempt count, with a clear final
error when exhausted, turns an open-ended risk into a detectable,
handleable failure.

**Why feeding the actual validation error back to the model (not just
"try again") measurably improves retry success:** this is a direct
application of Module 3's chain-of-thought principle — giving the model
concrete, specific information about what went wrong ("totalCents was
negative") is present in the sequence attention can act on, versus a
vague "that didn't work, try again" that provides no more information
than the model already implicitly had.

**The three-tier decision this lesson establishes for a production
system:** (1) retry with specific error feedback, a small bounded number
of times; (2) if that's exhausted, consider falling back to a simpler
prompt, a different model, or a narrower schema that's more likely to
succeed; (3) if that also fails, surface a clear, specific error to
whatever called this function — never silently return malformed data,
and never retry indefinitely.`,

    simpleHi: `**Baseline pattern — validate karo, aur failure pe, model ko error
wapas feed karke retry karo:**

\`\`\`ts
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  totalCents: z.number().int().positive(),
});

async function extractWithRetry(text, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: attempt === 1
          ? \`Extract invoice fields from: \${text}\`
          // Retry pe, SPECIFIC error wapas feed karo — model aksar
          // concrete feedback diye jaane pe self-correct kar sakta hai,
          // wahi "explicit intermediate information helps" principle
          // Module 3 ke chain-of-thought lesson se
          : \`Extract invoice fields from: \${text}\n\nYour previous attempt failed validation: \${lastError}. Please correct this.\`,
      });
      return object; // success — turant return karo
    } catch (err) {
      lastError = err.message;
      if (attempt === maxAttempts) throw new Error(\`Extraction failed after \${maxAttempts} attempts: \${lastError}\`);
    }
  }
}
\`\`\`

**Even schema-constrained generation (Lesson 1) ko bhi ye kyun chahiye:**
ek JSON schema STRUCTURE enforce karta hai (correct types, required
fields) par ye hamesha har BUSINESS RULE enforce nahi kar sakta — ek
schema keh sakta hai "amount ek positive integer hona chahiye" par shayad
poori tarah kuch capture na kare jaise "line items ka sum stated total
ke barabar hona chahiye." Ek structurally valid object abhi bhi ek
business-rule-level check fail kar sakta hai jo separately perform kiya
gaya, jise wahi retry discipline chahiye jo ek structural parse failure
ko chahiye.

**Retry loop ko ek hard limit kyun chahiye, Module 5 ke tool-loop
lesson ko echo karte hue:** ek unbounded retry loop exactly wahi category
ka risk hai jiske baare mein Module 5 ne tool loops ke liye warn kiya —
har attempt ek real, billed model call hai (Module 2), aur ek task jise
model genuinely correctly complete nahi kar sakta (ek ambiguous source
document, ek fundamentally unclear request) otherwise hamesha ke liye
retry karega, silently cost consume karte hue bina success ki koi
possibility ke. Ek bounded attempt count, exhausted hone pe ek clear
final error ke saath, ek open-ended risk ko ek detectable, handleable
failure mein badalta hai.

**Actual validation error ko model ko wapas feed karna (sirf "phir try
karo" nahi) retry success ko measurably kyun improve karta hai:** ye
Module 3 ke chain-of-thought principle ka ek direct application hai —
model ko concrete, specific information dena ki kya galat hua
("totalCents negative tha") us sequence mein present hai jispe attention
act kar sakta hai, ek vague "wo kaam nahi kiya, phir try karo" versus jo
utni information nahi deta jitni model ke paas already implicitly thi.

**Three-tier decision jise ye lesson ek production system ke liye
establish karta hai:** (1) specific error feedback ke saath retry karo,
ek chhoti bounded number of times; (2) agar wo exhausted ho jaaye, ek
simpler prompt, ek alag model, ya ek narrower schema pe fall back karna
consider karo jo succeed hone ki zyada likely ho; (3) agar wo bhi fail
ho, jisne bhi is function ko call kiya use ek clear, specific error
surface karo — kabhi silently malformed data return mat karo, aur kabhi
indefinitely retry mat karo.`,

    content: `## Why schema-constrained generation doesn't eliminate the need
for retry logic entirely

Lesson 1 established that schema-constrained generation guarantees
structural conformance — correct types, required fields present. It
cannot, by itself, guarantee conformance to arbitrary BUSINESS rules
that go beyond structure: a schema can constrain a field to be a
positive number, but validating that several fields are mutually
consistent (a sum matching a stated total, a date falling within an
expected range) typically requires a separate validation step performed
after generation. A structurally valid object that fails this secondary,
business-rule-level validation needs the exact same retry discipline as
a structural parse failure — the guarantee schema-constrained generation
provides is strong, but it doesn't cover every category of "wrong."

## Why an unbounded retry loop is the same risk category as Module 5's
unbounded tool loop

Both are structurally identical failure modes: a process that keeps
consuming real, billed model calls (Module 2) with no guaranteed
termination if the underlying task genuinely cannot succeed. Module 5
addressed this for tool loops with a hard iteration cap; the identical
reasoning applies here — a bounded retry count with a clear, specific
final error when exhausted converts an open-ended cost and reliability
risk into a detectable, handleable one that a calling system can respond
to sensibly (alerting a human, falling back to a different approach,
returning a clear error to an end user).

## Why feeding the specific validation error back to the model,
rather than a generic "try again," measurably helps

This directly applies Module 3's chain-of-thought reasoning: a model's
next attempt is generated conditioned on everything in the sequence so
far, including whatever feedback about the previous failure is present.
A specific error ("the sum of line items didn't match totalCents")
gives the model concrete information to correct against; a vague retry
prompt provides no more actionable information than the model already
implicitly had, making a repeat of the same mistake more likely rather
than less.

## Why this three-tier strategy (retry, fallback, surface an error) is
the mature version of this module's core theme

This module's throughline has been that structured output requires a
genuine engineering strategy, not just a well-crafted prompt: Lesson 1
established the structural guarantee mechanism, Lesson 2 covered
choosing the right API shape for that guarantee, and this lesson closes
with what happens in the (rare, but real) cases where even a strong
guarantee doesn't produce a usable result. A production-grade AI
feature treats this three-tier strategy — bounded retry with specific
feedback, a sensible fallback, and a clear terminal error — as a
required part of the design, not a corner case to handle if there's
time left over.`,

    contentHi: `## Schema-constrained generation retry logic ki zaroorat ko poori tarah kyun eliminate nahi karta

Lesson 1 ne establish kiya ki schema-constrained generation structural
conformance guarantee karta hai — correct types, required fields
present. Ye, apne aap mein, arbitrary BUSINESS rules ke conformance ko
guarantee nahi kar sakta jo structure se pare jaate hain: ek schema ek
field ko positive number hone ke liye constrain kar sakta hai, par ye
validate karna ki kai fields mutually consistent hain (ek sum jo stated
total se match karta hai, ek date jo ek expected range mein aati hai)
typically generation ke baad perform kiya gaya ek separate validation
step chahta hai. Ek structurally valid object jo is secondary,
business-rule-level validation ko fail karta hai use exactly wahi retry
discipline chahiye jo ek structural parse failure ko chahiye — schema-
constrained generation jo guarantee provide karta hai strong hai, par
ye "galat" ki har category cover nahi karta.

## Ek unbounded retry loop Module 5 ke unbounded tool loop jaisi hi risk category kyun hai

Dono structurally identical failure modes hain: ek process jo real,
billed model calls (Module 2) consume karta rehta hai bina kisi
guaranteed termination ke agar underlying task genuinely succeed nahi
ho sakta. Module 5 ne isse tool loops ke liye ek hard iteration cap se
address kiya; identical reasoning yahan apply hoti hai — ek bounded
retry count exhausted hone pe ek clear, specific final error ke saath
ek open-ended cost aur reliability risk ko ek detectable, handleable
wale mein convert karta hai jise ek calling system sensibly respond kar
sakta hai (ek human ko alert karna, ek alag approach pe fall back karna,
ek end user ko ek clear error return karna).

## Model ko specific validation error wapas feed karna, ek generic "phir try karo" ke bajaye, measurably kyun help karta hai

Ye directly Module 3 ke chain-of-thought reasoning ko apply karta hai:
ek model ka agla attempt ab tak ki sequence mein sab kuch pe conditioned
generate hota hai, previous failure ke baare mein jo bhi feedback
present hai samet. Ek specific error ("line items ka sum totalCents se
match nahi hua") model ko correct karne ke against concrete information
deta hai; ek vague retry prompt utni actionable information nahi deta
jitni model ke paas already implicitly thi, wahi mistake ka repeat kam
ke bajaye zyada likely banate hue.

## Ye three-tier strategy (retry, fallback, ek error surface karna) is module ke core theme ka mature version kyun hai

Is module ka throughline ye raha hai ki structured output ko ek genuine
engineering strategy chahiye, sirf ek well-crafted prompt nahi: Lesson 1
ne structural guarantee mechanism establish kiya, Lesson 2 ne us
guarantee ke liye sahi API shape choose karna cover kiya, aur ye lesson
un (rare, par real) cases ke saath close hota hai jahan ek strong
guarantee bhi ek usable result produce nahi karta. Ek production-grade
AI feature is three-tier strategy — specific feedback ke saath bounded
retry, ek sensible fallback, aur ek clear terminal error — ko design ka
ek required hissa treat karta hai, ek corner case nahi jise handle karna
hai agar time bacha ho.`,

    examples: [
      {
        title: 'A complete three-tier strategy: bounded retry with error feedback, a fallback, then a clear terminal error',
        titleHi: 'Ek complete three-tier strategy: error feedback ke saath bounded retry, ek fallback, phir ek clear terminal error',
        codeJs: `import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  lineItems: z.array(z.object({ description: z.string(), amountCents: z.number().int() })),
  totalCents: z.number().int().positive(),
}).refine(
  (data) => data.lineItems.reduce((sum, item) => sum + item.amountCents, 0) === data.totalCents,
  { message: 'Sum of line items must equal totalCents' }, // a BUSINESS rule schema alone can't fully enforce
);

async function extractInvoice(text) {
  let lastError = null;

  // TIER 1 — bounded retry with the specific error fed back
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: lastError
          ? \`Extract invoice fields from: \${text}\n\nPrevious attempt failed: \${lastError}\`
          : \`Extract invoice fields from: \${text}\`,
      });
      return object;
    } catch (err) {
      lastError = err.message;
    }
  }

  // TIER 2 — fall back to a simpler, more constrained ask
  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-5'),
      schema: invoiceSchema.pick({ vendorName: true, totalCents: true }), // narrower
      prompt: \`Just extract the vendor name and total amount from: \${text}\`,
    });
    return { ...object, lineItems: [] }; // a degraded but usable result
  } catch (err) {
    // TIER 3 — surface a clear, specific terminal error
    throw new Error(\`Could not extract invoice data after retries and fallback: \${err.message}\`);
  }
}`,
        codeTs: `import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  lineItems: z.array(z.object({ description: z.string(), amountCents: z.number().int() })),
  totalCents: z.number().int().positive(),
}).refine(
  (data) => data.lineItems.reduce((sum, item) => sum + item.amountCents, 0) === data.totalCents,
  { message: 'Sum of line items must equal totalCents' }, // a BUSINESS rule schema alone can't fully enforce
);

type Invoice = z.infer<typeof invoiceSchema>;

async function extractInvoice(text: string): Promise<Partial<Invoice>> {
  let lastError: string | null = null;

  // TIER 1 — bounded retry with the specific error fed back
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: lastError
          ? \`Extract invoice fields from: \${text}\n\nPrevious attempt failed: \${lastError}\`
          : \`Extract invoice fields from: \${text}\`,
      });
      return object;
    } catch (err) {
      lastError = (err as Error).message;
    }
  }

  // TIER 2 — fall back to a simpler, more constrained ask
  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-5'),
      schema: invoiceSchema.pick({ vendorName: true, totalCents: true }), // narrower
      prompt: \`Just extract the vendor name and total amount from: \${text}\`,
    });
    return { ...object, lineItems: [] }; // a degraded but usable result
  } catch (err) {
    // TIER 3 — surface a clear, specific terminal error
    throw new Error(\`Could not extract invoice data after retries and fallback: \${(err as Error).message}\`);
  }
}`,
        code: `for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const { object } = await generateObject({ model, schema: invoiceSchema, prompt: buildPrompt(lastError) });
    return object;
  } catch (err) { lastError = err.message; }
}
// then fallback tier, then a clear terminal error`,
        output:
          "For a genuinely tricky invoice, attempt 1 might fail the .refine() business rule (line items don't sum correctly), attempt 2 (with the specific error fed back) succeeds. For a genuinely malformed source document where all 3 retries fail, the fallback tier extracts just vendorName and totalCents successfully, returning a degraded but usable result rather than a hard failure.",
        explain:
          "The .refine() check demonstrates Lesson 1's point directly: invoiceSchema's base structure (types, required fields) is enforced by schema-constrained generation, but the cross-field business rule (line items summing to the total) needs a separate check — exactly the category of failure this lesson's retry strategy exists to handle.",
        explainHi:
          "`.refine()` check directly Lesson 1 ka point demonstrate karta hai: invoiceSchema ka base structure (types, required fields) schema-constrained generation dwara enforce hota hai, par cross-field business rule (line items ka total tak sum hona) ek separate check chahta hai — exactly wo category ki failure jise handle karne ke liye ye lesson ki retry strategy exist karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Retrying without any limit, and without feeding back what actually failed
async function extractInvoice(text) {
  while (true) { // no bound — a genuine cost and reliability risk
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: \`Extract invoice fields from: \${text}\`, // SAME prompt every time — no new information
      });
      return object;
    } catch {
      // silently retry forever with no new information to correct against
    }
  }
}`,
        right: `// Bounded retry, with the specific failure fed back each time
async function extractInvoice(text) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: invoiceSchema,
        prompt: lastError
          ? \`Extract invoice fields from: \${text}\n\nPrevious attempt failed: \${lastError}\`
          : \`Extract invoice fields from: \${text}\`,
      });
      return object;
    } catch (err) {
      lastError = err.message;
    }
  }
  throw new Error(\`Failed after 3 attempts: \${lastError}\`);
}`,
        why: "An unbounded retry with an unchanged prompt gives the model no new information to correct against on each attempt, making a repeat of the same failure likely, and each attempt is a real, billed call (Module 2) with no guaranteed termination if the task genuinely cannot succeed.",
        whyHi:
          "Ek unbounded retry ek unchanged prompt ke saath model ko har attempt pe correct karne ke against koi nayi information nahi deta, wahi failure ka repeat likely banate hue, aur har attempt ek real, billed call hai (Module 2) bina kisi guaranteed termination ke agar task genuinely succeed nahi ho sakta.",
      },
    ],

    realWorld: [
      {
        en: "A production document-processing pipeline retries a failed structured extraction up to three times with the specific validation error fed back each time, falls back to a narrower schema requesting only the most critical fields if all three fail, and finally routes the document to a human review queue with the specific failure reason attached — never silently dropping a document or looping indefinitely.",
        hi: 'Ek production document-processing pipeline ek failed structured extraction ko teen baar tak retry karta hai har baar specific validation error wapas feed karte hue, sab teen fail hone pe ek narrower schema pe fall back karta hai jo sirf sabse critical fields request karta hai, aur finally document ko ek human review queue mein route karta hai specific failure reason attached ke saath — kabhi bhi silently ek document drop nahi karta ya indefinitely loop nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: "Why can a structurally valid, schema-conforming object still need to be rejected and retried?",
        qHi: 'Ek structurally valid, schema-conforming object ko abhi bhi reject aur retry karne ki zaroorat kyun ho sakti hai?',
        a: "Schema-constrained generation guarantees structural conformance (correct types, required fields) but cannot, by itself, enforce arbitrary business rules that span multiple fields — like a sum matching a stated total. A structurally valid object can still fail this kind of business-rule validation, which requires the same bounded retry discipline as a structural failure.",
        aHi: 'Schema-constrained generation structural conformance (correct types, required fields) guarantee karta hai par ye, apne aap mein, arbitrary business rules ko enforce nahi kar sakta jo multiple fields ke across span karte hain — jaise ek sum jo stated total se match karta hai. Ek structurally valid object abhi bhi is kism ki business-rule validation fail kar sakta hai, jise wahi bounded retry discipline chahiye jo ek structural failure ko chahiye.',
      },
      {
        q: "Why does feeding the specific validation error back to the model on retry improve the odds of success, compared to a generic 'try again' prompt?",
        qHi: 'Retry pe specific validation error ko model ko wapas feed karna success ke odds ko kyun improve karta hai, ek generic \'try again\' prompt ke comparison mein?',
        a: "A model's next attempt is generated conditioned on everything in the sequence, including whatever feedback is present about the previous failure (Module 3's chain-of-thought principle applied here). A specific error gives the model concrete information to correct against; a generic retry prompt provides no more actionable information than the model already had, making a repeat mistake more likely.",
        aHi: 'Ek model ka agla attempt sequence mein sab kuch pe conditioned generate hota hai, previous failure ke baare mein jo bhi feedback present hai samet (Module 3 ka chain-of-thought principle yahan applied). Ek specific error model ko correct karne ke against concrete information deta hai; ek generic retry prompt utni actionable information nahi deta jitni model ke paas already thi, ek repeat mistake ko zyada likely banate hue.',
      },
    ],

    exercises: [
      {
        task: "A team's structured-extraction feature currently retries indefinitely with the exact same prompt on every attempt whenever validation fails. Redesign their retry logic following this lesson's three-tier strategy, and explain what each tier accomplishes that the current approach doesn't.",
        taskHi: 'Ek team ka structured-extraction feature currently indefinitely retry karta hai har attempt pe exact same prompt ke saath jab bhi validation fail hoti hai. Unki retry logic ko is lesson ki three-tier strategy follow karte hue redesign karo, aur explain karo ki har tier kya achieve karta hai jo current approach nahi karta.',
        hint: "Identify what's missing from the current approach at each of the three tiers: bounded retry with feedback, a fallback, and a clear terminal error.",
        hintHi: 'Identify karo ki current approach mein teenon tiers mein se har ek se kya missing hai: feedback ke saath bounded retry, ek fallback, aur ek clear terminal error.',
      },
    ],

    keyTakeaways: [
      "Schema-constrained generation (Lesson 1) guarantees structural conformance but not arbitrary business rules — a structurally valid object can still fail a separate, cross-field validation check and need retry.",
      "An unbounded retry loop is the same risk category as Module 5's unbounded tool loop: each attempt is a real, billed call, and a genuinely unsolvable task would otherwise retry forever with no possibility of success.",
      "Feeding the specific validation error back to the model on retry (rather than a generic prompt) measurably improves success odds — a direct application of Module 3's chain-of-thought principle.",
      "A production system needs a three-tier strategy: bounded retry with specific feedback, a sensible fallback if retries are exhausted, and a clear terminal error if even the fallback fails — never silent bad data or infinite retry.",
    ],
    keyTakeawaysHi: [
      'Schema-constrained generation (Lesson 1) structural conformance guarantee karta hai par arbitrary business rules nahi — ek structurally valid object abhi bhi ek separate, cross-field validation check fail kar sakta hai aur retry chahiye.',
      'Ek unbounded retry loop wahi risk category hai jo Module 5 ka unbounded tool loop hai: har attempt ek real, billed call hai, aur ek genuinely unsolvable task otherwise hamesha ke liye retry karega bina success ki koi possibility ke.',
      'Retry pe model ko specific validation error wapas feed karna (ek generic prompt ke bajaye) success odds ko measurably improve karta hai — Module 3 ke chain-of-thought principle ka ek direct application.',
      'Ek production system ko ek three-tier strategy chahiye: specific feedback ke saath bounded retry, agar retries exhausted ho jaayein ek sensible fallback, aur agar fallback bhi fail ho ek clear terminal error — kabhi silent bad data ya infinite retry nahi.',
    ],
  },
];
