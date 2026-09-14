/**
 * Generative AI Complete Course — Module 5: Tool Calling & Function Calling, lessons 1-3.
 *
 * Lesson 1: Defining tool schemas and the actual request/response loop.
 * Lesson 2: Executing tools and multi-turn tool loops.
 * Lesson 3: Validating model-produced arguments — the untrusted-input discipline.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-defining-tool-schemas',
    title: 'Defining Tool Schemas — Giving a Model Something It Can Actually Call',
    titleHi: 'Tool Schemas Define Karna — Model Ko Aisi Cheez Dena Jise Ye Actually Call Kar Sake',
    description:
      "A model can only ever produce text (Module 1) — it cannot literally execute code. Tool calling is the mechanism that bridges this: the model produces a structured request to call a named function with specific arguments, and YOUR application actually executes it. This lesson covers the schema that makes that request well-formed.",
    descriptionHi:
      'Ek model kabhi sirf text produce kar sakta hai (Module 1) — ye literally code execute nahi kar sakta. Tool calling wo mechanism hai jo ise bridge karta hai: model ek named function ko specific arguments ke saath call karne ke liye ek structured request produce karta hai, aur AAPKA application ise actually execute karta hai. Ye lesson us schema ko cover karta hai jo us request ko well-formed banata hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A radio dispatcher who can only speak instructions over the radio to field units — they never personally drive to a scene, arrest anyone, or turn a valve themselves.** A dispatcher's entire output is speech: \"Unit 12, proceed to 5th and Main.\" That instruction is precise and actionable specifically because it follows a known format the field units understand — a unit number, a clear action, a specific location — not a vague, rambling description. The dispatcher never personally performs the action; a real officer, hearing the structured instruction, is the one who actually drives there. A model producing a tool call is exactly the dispatcher: it can only ever generate text (Module 1) — output describing \"call the function getWeather with argument city='Tokyo'\" — and it is entirely YOUR application, playing the role of the field unit, that receives this structured instruction and actually executes the corresponding code. The tool schema is what makes the dispatcher's instructions precise enough for the field unit to act on without having to guess at intent.",
      hi: 'Ek radio dispatcher jo sirf field units ko radio pe instructions bol sakta hai — wo kabhi personally ek scene tak drive nahi karta, kisi ko arrest nahi karta, ya khud ek valve nahi ghumata. Ek dispatcher ka poora output speech hai: "Unit 12, proceed to 5th and Main." Wo instruction precise aur actionable hai specifically kyunki ye ek known format follow karta hai jise field units samajhte hain — ek unit number, ek clear action, ek specific location — ek vague, rambling description nahi. Dispatcher kabhi personally action perform nahi karta; ek real officer, structured instruction sunkar, wo hai jo actually wahan drive karta hai. Ek model jo ek tool call produce karta hai exactly dispatcher hai: ye kabhi sirf text generate kar sakta hai (Module 1) — output jo describe karta hai "function getWeather ko argument city=\'Tokyo\' ke saath call karo" — aur ye poori tarah AAPKA application hai, field unit ka role play karte hue, jo is structured instruction ko receive karta hai aur actually corresponding code execute karta hai. Tool schema wo hai jo dispatcher ke instructions ko field unit ke liye act karne ke liye kaafi precise banata hai intent guess kiye bina.',
    },

    simple: `**The fundamental constraint this entire lesson exists to solve:**
Module 1 established that a model produces text, one token at a time —
it has no ability to literally reach out and call a real function,
query a database, or send an email. Tool calling is a protocol layered
on top of plain text generation that lets a model's OUTPUT be
interpreted, by your application, as a structured request to run a
specific piece of code — the model never executes anything itself.

**Defining a tool — telling the model exactly what it can "ask for"
and in what shape:**

\`\`\`ts
import { z } from 'zod';

// This schema is BOTH documentation for the model (what this tool does,
// what arguments it needs) AND a contract your code can validate against
const getWeatherTool = {
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  parameters: z.object({
    city: z.string().describe('The city name, e.g. "Tokyo" or "New York"'),
    unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
};
\`\`\`

**Passing tools to the model — the request now includes what's
available to call:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get the current weather for a specific city.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'The city name' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['city'],
    },
  }],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});
\`\`\`

**What the model's response actually looks like when it decides to use
a tool:**

\`\`\`ts
// response.content contains a tool_use block instead of (or alongside) text:
// {
//   type: 'tool_use',
//   id: 'toolu_01A...',
//   name: 'get_weather',
//   input: { city: 'Tokyo', unit: 'celsius' }
// }

// This is STILL just text/structured-data the model generated — Module
// 1's mechanism hasn't changed. The model produced tokens that, when
// interpreted according to the tool-calling protocol, describe a
// specific function call. NOTHING has actually been executed yet —
// that's your application's job (Lesson 2).
\`\`\`

**Why the schema/description matters as much as the prompt itself:** a
poorly-described tool ("weather thing" with an unclear parameter name)
gives the model the same kind of ambiguous target Module 3 warned about
for zero-shot prompting — it has to guess at exactly what's expected. A
clearly named tool, with a clear description and clearly typed
parameters, gives the model a concrete, well-specified target to
produce a correctly-shaped call for, the same underlying principle as
few-shot prompting making an implicit pattern explicit.`,

    simpleHi: `**Fundamental constraint jise solve karne ke liye ye poora lesson
exist karta hai:** Module 1 ne establish kiya ki ek model text produce
karta hai, ek time pe ek token — iske paas literally bahar reach karke
ek real function call karne, ek database query karne, ya ek email
bhejne ki koi ability nahi hai. Tool calling ek protocol hai jo plain
text generation ke upar layered hai jo ek model ke OUTPUT ko, aapke
application dwara, ek specific piece of code chalane ke liye ek
structured request ki tarah interpret hone deta hai — model khud kabhi
kuch execute nahi karta.

**Ek tool define karna — model ko exactly batana ki ye kya "maang"
sakta hai aur kis shape mein:**

\`\`\`ts
import { z } from 'zod';

// Ye schema model ke liye documentation HAI (ye tool kya karta hai,
// isko kaunse arguments chahiye) AUR ek contract jise aapka code
// validate kar sakta hai
const getWeatherTool = {
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  parameters: z.object({
    city: z.string().describe('The city name, e.g. "Tokyo" or "New York"'),
    unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
};
\`\`\`

**Model ko tools pass karna — request mein ab wo shamil hai jo call
karne ke liye available hai:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get the current weather for a specific city.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'The city name' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['city'],
    },
  }],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});
\`\`\`

**Model ka response actually kaisa dikhta hai jab ye ek tool use karne
ka decide karta hai:**

\`\`\`ts
// response.content mein ek tool_use block hota hai (ya text ke saath):
// {
//   type: 'tool_use',
//   id: 'toolu_01A...',
//   name: 'get_weather',
//   input: { city: 'Tokyo', unit: 'celsius' }
// }

// Ye ABHI BHI sirf text/structured-data hai jo model ne generate ki —
// Module 1 ka mechanism nahi badla. Model ne tokens produce kiye jo,
// tool-calling protocol ke hisaab se interpret kiye jaane pe, ek
// specific function call describe karte hain. ABHI KUCH BHI actually
// execute nahi hua hai — wo aapke application ka kaam hai (Lesson 2).
\`\`\`

**Schema/description prompt khud jitna kyun matter karta hai:** ek
badly-described tool ("weather thing" ek unclear parameter name ke
saath) model ko wahi kism ka ambiguous target deta hai jiske baare mein
Module 3 ne zero-shot prompting ke liye warn kiya — ise guess karna
padta hai exactly kya expected hai. Ek clearly named tool, ek clear
description aur clearly typed parameters ke saath, model ko ek concrete,
well-specified target deta hai jiske liye ek correctly-shaped call
produce kare, wahi underlying principle jo few-shot prompting ka hai ek
implicit pattern ko explicit banana.`,

    content: `## Why tool calling is a protocol on top of text, not a new
generation mechanism

Module 1's mechanism doesn't change for tool calling — the model still
only ever produces tokens, predicted one at a time from the sequence so
far. What tool calling adds is a SHARED CONVENTION: tools are described
to the model in a specific format (name, description, parameter schema),
and the model is trained to recognize when a task calls for one, then
produce its response in a specific structured shape (a tool_use block)
rather than plain prose. Nothing about the underlying next-token
prediction changes; what changes is that both sides — the model and
your application — agree on how to interpret a particular kind of
output.

## Why the schema is simultaneously documentation and a contract

A tool's name, description, and parameter schema serve two audiences at
once: they tell the MODEL what the tool does and what shape of input it
expects (functioning like a clear, well-labeled instruction the model
can pattern-match against, similar to how a clear prompt reduces
ambiguity in Module 3), and they give YOUR application a concrete
contract to validate an incoming tool call's arguments against before
ever executing anything (a theme this module's third lesson develops in
full, treating model-produced arguments as untrusted input). A vague
tool description serves neither audience well: the model has to guess at
intent, and your application has no clear specification to validate
against.

## Why "the model called a tool" doesn't mean anything has actually
happened yet

This is the single most important distinction in this lesson: a
tool_use block in a model's response is still just generated
output — the model describing, in a structured format, what it thinks
should happen next. No database was queried, no email was sent, no code
ran, until YOUR application explicitly reads that structured description
and chooses to execute the corresponding function. This separation is
what makes tool calling safe to build real functionality around: your
application retains complete control over whether, and how, a requested
action is actually carried out, which Lesson 3 covers in depth from a
security perspective.

## How this sets up the rest of the module

This lesson establishes the request side of tool calling: describing
tools, and recognizing what a tool_use response actually represents.
Lesson 2 covers the other half — actually executing the requested
function and returning its result back into the conversation, plus the
multi-turn loop this creates when a task needs several tool calls in
sequence. Lesson 3 covers the security discipline this mechanism
demands: since a tool's arguments are produced by the model (itself
possibly influenced by untrusted content, as Module 12 covers in depth),
they need exactly the validation rigor any other untrusted input
requires.`,

    contentHi: `## Tool calling text ke upar ek protocol kyun hai, ek naya generation mechanism nahi

Module 1 ka mechanism tool calling ke liye nahi badalta — model abhi bhi
sirf tokens produce karta hai, ek time pe ek predicted ab tak ki sequence
se. Tool calling jo add karta hai wo ek SHARED CONVENTION hai: tools ko
model ko ek specific format mein describe kiya jata hai (name,
description, parameter schema), aur model ise recognize karne ke liye
trained hai ki kab ek task ko ek ki zaroorat hai, phir apna response ek
specific structured shape mein produce karta hai (ek tool_use block)
plain prose ke bajaye. Underlying next-token prediction ke baare mein
kuch bhi nahi badalta; jo badalta hai wo ye hai ki dono sides — model aur
aapka application — is baat pe agree karte hain ki ek particular kism
ke output ko kaise interpret karna hai.

## Schema simultaneously documentation aur ek contract kyun hai

Ek tool ka name, description, aur parameter schema ek saath do audiences
serve karte hain: wo MODEL ko batate hain ki tool kya karta hai aur kis
shape ka input ye expect karta hai (ek clear, well-labeled instruction
ki tarah function karte hue jise model pattern-match kar sakta hai, isi
tarah jaise ek clear prompt Module 3 mein ambiguity kam karta hai), aur
wo AAPKE application ko ek concrete contract dete hain ek incoming tool
call ke arguments ko validate karne ke liye kuch bhi execute karne se
pehle (ek theme jise is module ka teesra lesson poori tarah develop
karta hai, model-produced arguments ko untrusted input ki tarah treat
karte hue). Ek vague tool description kisi bhi audience ko achhi tarah
serve nahi karta: model ko intent guess karna padta hai, aur aapke
application ke paas validate karne ke liye koi clear specification nahi
hai.

## "Model ne ek tool call kiya" ka matlab kyun nahi hai ki abhi kuch bhi actually hua hai

Ye is lesson ka single sabse important distinction hai: ek model ke
response mein ek tool_use block abhi bhi sirf generated output hai —
model describe kar raha hai, ek structured format mein, ki iske hisaab
se aage kya hona chahiye. Koi database query nahi hui, koi email nahi
bheji gayi, koi code nahi chala, jab tak AAPKA application explicitly us
structured description ko padhta nahi aur corresponding function ko
execute karne ka choice nahi karta. Ye separation wo hai jo tool calling
ko real functionality ke around build karne ke liye safe banata hai:
aapka application poora control retain karta hai ki kya, aur kaise, ek
requested action actually carry out kiya jaata hai, jise Lesson 3 poori
depth mein ek security perspective se cover karta hai.

## Ye baaki module ko kaise set up karta hai

Ye lesson tool calling ka request side establish karta hai: tools
describe karna, aur recognize karna ki ek tool_use response actually
kya represent karta hai. Lesson 2 doosra half cover karta hai — actually
requested function execute karna aur uska result wapas conversation mein
return karna, plus multi-turn loop jise ye create karta hai jab ek task
ko sequence mein kai tool calls chahiye. Lesson 3 us security discipline
ko cover karta hai jo ye mechanism demand karta hai: kyunki ek tool ke
arguments model dwara produce kiye jaate hain (khud possibly untrusted
content se influenced, jaise Module 12 poori depth mein cover karta
hai), unhe exactly wahi validation rigor chahiye jo kisi bhi doosre
untrusted input ki zaroorat hai.`,

    examples: [
      {
        title: 'Defining a tool with Zod and inspecting the model\'s structured tool-call response',
        titleHi: 'Zod ke saath ek tool define karna aur model ke structured tool-call response ko inspect karna',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Define the tool's shape once with Zod — reused for both the
// provider's schema format AND later validation (Lesson 3)
const getWeatherParams = z.object({
  city: z.string().describe('The city name, e.g. "Tokyo"'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
});

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get the current weather for a specific city.',
    input_schema: zodToJsonSchema(getWeatherParams),
  }],
  messages: [{ role: 'user', content: "What's the weather like in Tokyo right now?" }],
});

// Find the tool_use block in the response — the model's STRUCTURED
// REQUEST, not an executed result
const toolUse = response.content.find((block) => block.type === 'tool_use');
console.log(toolUse);
// { type: 'tool_use', id: 'toolu_01...', name: 'get_weather', input: { city: 'Tokyo', unit: 'celsius' } }
// Nothing has been executed yet — this is still just generated output`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Define the tool's shape once with Zod — reused for both the
// provider's schema format AND later validation (Lesson 3)
const getWeatherParams = z.object({
  city: z.string().describe('The city name, e.g. "Tokyo"'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
});

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get the current weather for a specific city.',
    input_schema: zodToJsonSchema(getWeatherParams) as Anthropic.Tool.InputSchema,
  }],
  messages: [{ role: 'user', content: "What's the weather like in Tokyo right now?" }],
});

// Find the tool_use block in the response — the model's STRUCTURED
// REQUEST, not an executed result
const toolUse = response.content.find(
  (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
);
console.log(toolUse);
// { type: 'tool_use', id: 'toolu_01...', name: 'get_weather', input: { city: 'Tokyo', unit: 'celsius' } }
// Nothing has been executed yet — this is still just generated output`,
        code: `const getWeatherParams = z.object({
  city: z.string().describe('The city name'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
});
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5', max_tokens: 1024,
  tools: [{ name: 'get_weather', description: '...', input_schema: zodToJsonSchema(getWeatherParams) }],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});
const toolUse = response.content.find((block) => block.type === 'tool_use');`,
        output:
          "{ type: 'tool_use', id: 'toolu_01...', name: 'get_weather', input: { city: 'Tokyo', unit: 'celsius' } } — a structured description of a function call the model believes would help answer the question, with no actual weather lookup having happened yet.",
        explain:
          "Reusing the same Zod schema (getWeatherParams) both to generate the provider's tool schema AND to later validate the model's returned arguments (Lesson 3) means the 'contract' the tool description made to the model and the runtime check your code performs are guaranteed to match — no risk of the two silently drifting apart the way Module 3's duplicated-prompt mistake illustrated for prompts.",
        explainHi:
          "Wahi Zod schema (getWeatherParams) ko reuse karna dono provider ka tool schema generate karne ke liye AUR baad mein model ke returned arguments validate karne ke liye (Lesson 3) matlab hai wo 'contract' jo tool description ne model ko diya aur wo runtime check jo aapka code perform karta hai guaranteed match karte hain — dono ke silently drift apart hone ka koi risk nahi, wahi tarike se jaise Module 3 ki duplicated-prompt mistake ne prompts ke liye illustrate kiya.",
      },
    ],

    mistakes: [
      {
        wrong: `// A vague tool description that leaves the model guessing at intent
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'do_thing',
    description: 'Does a thing with data.',
    input_schema: { type: 'object', properties: { x: { type: 'string' } } },
  }],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});
// The model has no clear idea what "do_thing" does, what "x" should
// contain, or when this tool is even appropriate to use.`,
        right: `// A clearly named, described, and typed tool
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get the current weather conditions for a specific city, including temperature and conditions.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'The city name, e.g. "Tokyo" or "New York"' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['city'],
    },
  }],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});`,
        why: "A vague name, description, or parameter schema gives the model the same kind of ambiguous target Module 3 identified with under-specified zero-shot prompts — it has to guess at intent instead of matching against a clear, concrete specification, which measurably reduces the reliability of correctly-shaped tool calls.",
        whyHi:
          "Ek vague name, description, ya parameter schema model ko wahi kism ka ambiguous target deta hai jise Module 3 ne under-specified zero-shot prompts ke saath identify kiya — ise intent guess karna padta hai ek clear, concrete specification ke against match karne ke bajaye, jo correctly-shaped tool calls ki reliability ko measurably kam karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production customer-support AI that can look up an order status defines its lookup tool with a precise description ('Look up the current status and estimated delivery date for an order, given its order ID') and a strictly typed orderId parameter — precise enough that the model reliably produces a correctly-shaped call rather than sometimes passing a customer's name or email by mistake.",
        hi: 'Ek production customer-support AI jo ek order status lookup kar sakta hai apna lookup tool ek precise description ke saath define karta hai (\'Ek order ki current status aur estimated delivery date lookup karo, uski order ID diye jaane pe\') aur ek strictly typed orderId parameter, itna precise ki model reliably ek correctly-shaped call produce karta hai kabhi kabhi galti se customer ka naam ya email pass karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "When a model's response contains a tool_use block, has the corresponding function actually been executed?",
        qHi: 'Jab ek model ke response mein ek tool_use block hota hai, kya corresponding function actually execute ho chuka hai?',
        a: "No. A tool_use block is still just generated output — text/structured data the model produced, following the tool-calling protocol, describing what it believes should happen next. Nothing is actually executed until the calling application explicitly reads that description and chooses to run the corresponding code.",
        aHi: 'Nahi. Ek tool_use block abhi bhi sirf generated output hai — text/structured data jo model ne produce kiya, tool-calling protocol follow karte hue, describe karte hue ki iske hisaab se aage kya hona chahiye. Kuch bhi actually execute nahi hota jab tak calling application explicitly us description ko padhta nahi aur corresponding code chalane ka choice nahi karta.',
      },
      {
        q: "Why does a tool's schema (name, description, parameters) matter as much as the schema of a normal prompt?",
        qHi: 'Ek tool ka schema (name, description, parameters) ek normal prompt ke schema jitna kyun matter karta hai?',
        a: "A vague or poorly-specified tool gives the model an ambiguous target, forcing it to guess at intent — the same underlying problem Module 3 identified with under-specified zero-shot prompts. A precise name, description, and typed parameters give the model a concrete target to match against, and simultaneously give your application a clear contract to validate returned arguments against.",
        aHi: 'Ek vague ya poorly-specified tool model ko ek ambiguous target deta hai, ise intent guess karne ke liye force karte hue — wahi underlying problem jo Module 3 ne under-specified zero-shot prompts ke saath identify kiya. Ek precise name, description, aur typed parameters model ko ek concrete target dete hain match karne ke liye, aur simultaneously aapke application ko returned arguments ke against validate karne ke liye ek clear contract dete hain.',
      },
    ],

    exercises: [
      {
        task: "A tool named 'search' with the description 'Searches for stuff' and a single untyped 'query' string parameter is producing inconsistent, sometimes malformed calls from the model. Rewrite the tool's name, description, and schema to be well-specified, and explain why each change should improve reliability.",
        taskHi: 'Ek tool jiska naam \'search\' hai description \'Searches for stuff\' ke saath aur ek single untyped \'query\' string parameter model se inconsistent, kabhi kabhi malformed calls produce kar raha hai. Tool ke name, description, aur schema ko well-specified hone ke liye rewrite karo, aur explain karo ki har change reliability ko kyun improve karega.',
        hint: "Apply the same reasoning Module 3 used for turning an ambiguous zero-shot instruction into a clear, concrete one — what specifically is missing that leaves the model guessing?",
        hintHi: 'Wahi reasoning apply karo jo Module 3 ne ek ambiguous zero-shot instruction ko ek clear, concrete wale mein badalne ke liye use ki — specifically kya missing hai jo model ko guess karne deta hai?',
      },
    ],

    keyTakeaways: [
      "Tool calling is a protocol layered on top of plain text generation (Module 1's mechanism doesn't change) — it lets a model's output be interpreted by your application as a structured request to run specific code.",
      "A tool's schema (name, description, parameters) serves two audiences: it's a pattern for the model to match its output against, and a contract your application can validate returned arguments against.",
      "A tool_use block in a model's response is still just generated output — nothing is actually executed until the calling application explicitly reads it and chooses to run the corresponding code.",
      "A vague or under-specified tool produces the same reliability problems as an ambiguous zero-shot prompt (Module 3) — precise naming, description, and typing give the model a concrete target.",
    ],
    keyTakeawaysHi: [
      'Tool calling plain text generation ke upar ek layered protocol hai (Module 1 ka mechanism nahi badalta) — ye ek model ke output ko aapke application dwara ek specific code chalane ke liye ek structured request ki tarah interpret hone deta hai.',
      'Ek tool ka schema (name, description, parameters) do audiences serve karta hai: ye model ke liye apne output ko match karne ke liye ek pattern hai, aur aapke application ke liye returned arguments ke against validate karne ke liye ek contract.',
      'Ek model ke response mein ek tool_use block abhi bhi sirf generated output hai — kuch bhi actually execute nahi hota jab tak calling application explicitly ise padhta nahi aur corresponding code chalane ka choice nahi karta.',
      'Ek vague ya under-specified tool wahi reliability problems produce karta hai jo ek ambiguous zero-shot prompt (Module 3) karta hai — precise naming, description, aur typing model ko ek concrete target dete hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-executing-tools-and-multi-turn-loops',
    title: 'Executing Tools & Multi-Turn Tool Loops',
    titleHi: 'Tools Execute Karna Aur Multi-Turn Tool Loops',
    description:
      "Lesson 1 covered the model requesting a tool call; this lesson covers the other half of the loop — your application actually running the function, feeding its result back into the conversation, and repeating this cycle for tasks that genuinely need several tool calls in sequence.",
    descriptionHi:
      'Lesson 1 ne model ke ek tool call request karne ko cover kiya; ye lesson loop ka doosra half cover karta hai — aapka application actually function chalata hai, uske result ko wapas conversation mein feed karta hai, aur is cycle ko un tasks ke liye repeat karta hai jinhe genuinely sequence mein kai tool calls chahiye.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A relay race where each runner reports back to the coach before the coach decides who runs next, versus assuming the whole race plan was fixed before the starting gun.** A coach who plans the entire race in advance — \"runner A goes 100m, then B, then C\" — can't actually know in advance whether runner A's leg reveals new information that should change the plan (a runner getting injured, an unexpectedly fast pace suggesting a different strategy). A coach who has each runner report back immediately after their leg, then decides the next step based on that actual result, can adapt the plan as real information arrives. A multi-turn tool loop works exactly this way: the model doesn't plan all its tool calls upfront in one shot — after each tool executes and its REAL result comes back, the model sees that actual result and decides, based on it, whether it needs another tool call, a different one, or has enough information to answer.",
      hi: 'Ek relay race jahan har runner coach ko wapas report karta hai isse pehle ki coach decide kare ki agla kaun daure, versus assume karna ki poora race plan starting gun se pehle fixed tha. Ek coach jo poori race ko advance mein plan karta hai — "runner A 100m jaata hai, phir B, phir C" — actually advance mein nahi jaan sakta ki kya runner A ka leg naya information reveal karega jo plan badalna chahiye (ek runner injured ho jaana, ek unexpectedly fast pace jo ek alag strategy suggest kare). Ek coach jiska har runner apne leg ke turant baad report karta hai, phir us actual result ke basis pe agla step decide karta hai, real information aane ke saath plan ko adapt kar sakta hai. Ek multi-turn tool loop exactly is tarah kaam karta hai: model apne saare tool calls ko upfront ek shot mein plan nahi karta — har tool execute hone aur uska REAL result wapas aane ke baad, model us actual result ko dekhta hai aur decide karta hai, uske basis pe, ki kya ise ek aur tool call chahiye, ek alag wala, ya answer dene ke liye kaafi information hai.',
    },

    simple: `**The full loop — request, execute, feed back, repeat until done:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [{
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  input_schema: {
    type: 'object',
    properties: { city: { type: 'string' } },
    required: ['city'],
  },
}];

// Your ACTUAL function — this is what real code execution looks like,
// completely separate from anything the model does
async function getWeather({ city }) {
  const res = await fetch(\`https://api.weather.example/v1?city=\${encodeURIComponent(city)}\`);
  return res.json(); // e.g. { tempC: 18, conditions: 'Cloudy' }
}

async function chatWithTools(userMessage) {
  let messages = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      tools,
      messages,
    });

    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) {
      // No tool call — the model has enough information to answer
      return response.content.find((b) => b.type === 'text')?.text;
    }

    // EXECUTE the real function — the model never did this itself
    const result = await getWeather(toolUse.input);

    // Feed the REAL result back as a new turn — a specific message type
    // (tool_result), extending Module 2's role-tagged message array
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }],
    });
    // Loop again — the model sees the real weather data and can now
    // either answer, or decide it needs ANOTHER tool call
  }
}
\`\`\`

**Why this is a LOOP, not a single extra round-trip:** a task might
genuinely need several tool calls in sequence — "compare the weather in
Tokyo and Paris" requires two separate get_weather calls, and the model
only knows it needs the second one after seeing the first's actual
result. The loop continues exactly as long as the model keeps
requesting tools, and terminates naturally when it produces a plain-text
response instead — there's no fixed number of steps decided in advance.

**Why the tool RESULT is a new kind of message, not just appended
text:** Module 2 established messages as role-tagged turns (system/
user/assistant). Tool calling adds a specific structured content type
— a tool_result — that's associated with a specific prior tool_use by
its ID, so the model can correctly connect "here's the result of the
SPECIFIC call I made" rather than an ambiguous new piece of information.
This is the same underlying message-array mechanism from Module 2,
extended with a new content shape for this specific purpose.

**Why the model deciding "do I need another tool call" is genuinely
adaptive, not scripted:** the model isn't following a pre-written
script of which tools to call in what order — at each iteration of the
loop, it's making a fresh decision based on everything in the sequence
so far, including the real results of any tools already executed
(Module 1's mechanism, applied here). This is what makes tool loops
capable of handling tasks whose exact steps can't be known in advance.`,

    simpleHi: `**Poora loop — request, execute, feed back, repeat until done:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [{
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  input_schema: {
    type: 'object',
    properties: { city: { type: 'string' } },
    required: ['city'],
  },
}];

// Aapka ACTUAL function — ye hai ki real code execution kaisa dikhta
// hai, model jo bhi karta hai usse poori tarah separate
async function getWeather({ city }) {
  const res = await fetch(\`https://api.weather.example/v1?city=\${encodeURIComponent(city)}\`);
  return res.json(); // e.g. { tempC: 18, conditions: 'Cloudy' }
}

async function chatWithTools(userMessage) {
  let messages = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      tools,
      messages,
    });

    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) {
      // Koi tool call nahi — model ke paas answer dene ke liye kaafi information hai
      return response.content.find((b) => b.type === 'text')?.text;
    }

    // Real function EXECUTE karo — model ne ye khud kabhi nahi kiya
    const result = await getWeather(toolUse.input);

    // REAL result ko ek naye turn ki tarah wapas feed karo — ek specific
    // message type (tool_result), Module 2 ke role-tagged message array
    // ko extend karte hue
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }],
    });
    // Phir se loop karo — model real weather data dekhta hai aur ab ya
    // to answer de sakta hai, ya decide kar sakta hai ki use AUR ek
    // tool call chahiye
  }
}
\`\`\`

**Ye ek LOOP kyun hai, ek single extra round-trip nahi:** ek task ko
genuinely sequence mein kai tool calls chahiye ho sakte hain —
"Tokyo aur Paris ke weather compare karo" ko do separate get_weather
calls chahiye, aur model ko sirf pehle wale ka actual result dekhne ke
baad pata chalta hai ki use doosri wali chahiye. Loop exactly utni der
tak chalta hai jab tak model tools request karta rehta hai, aur
naturally terminate hota hai jab ye iske bajaye ek plain-text response
produce karta hai — advance mein decide kiya gaya koi fixed number of
steps nahi hai.

**Tool RESULT ek naye kism ka message kyun hai, sirf appended text
nahi:** Module 2 ne messages ko role-tagged turns (system/user/
assistant) ki tarah establish kiya. Tool calling ek specific structured
content type add karta hai — ek tool_result — jo apni ID se ek specific
prior tool_use se associated hai, taaki model correctly connect kar
sake "yahan mere kiye us SPECIFIC call ka result hai" ek ambiguous naye
information piece ke bajaye. Ye Module 2 ka wahi underlying
message-array mechanism hai, is specific purpose ke liye ek naye content
shape ke saath extended.

**Model ka "kya mujhe ek aur tool call chahiye" decide karna genuinely
adaptive kyun hai, scripted nahi:** model ek pre-written script follow
nahi kar raha ki kaunse tools kis order mein call karne hain — loop ki
har iteration pe, ye ab tak ki sequence mein sab kuch ke basis pe ek
fresh decision le raha hai, kisi bhi already-executed tools ke real
results samet (Module 1 ka mechanism, yahan applied). Yahi wo hai jo
tool loops ko un tasks handle karne mein capable banata hai jinke exact
steps advance mein nahi jaane ja sakte.`,

    content: `## Why executing a tool and feeding its result back is a genuinely
distinct step from the model's tool_use request

Lesson 1 established that a tool_use block is still just generated
output describing what the model believes should happen — the actual
execution is a separate, deliberate action your application takes,
running real code that queries a real database, calls a real API, or
performs a real calculation. Feeding that REAL result back into the
conversation (as a tool_result message) is what lets subsequent
generation condition on genuinely new, external information the model
couldn't have produced on its own — this is the actual mechanism by
which tool calling extends what a model can do beyond what it learned
during training.

## Why this forms a loop rather than a single request/response/
request cycle

A task's tool requirements often can't be known until a prior tool's
actual result is seen — comparing two cities' weather genuinely requires
seeing the first city's result before the model can decide it needs a
second call, and a task might need three, five, or zero tool calls
depending entirely on what's actually discovered along the way. The loop
terminates naturally when the model, having seen everything gathered so
far, produces a plain-text response instead of another tool_use — there
is no separate "done" signal beyond the model no longer requesting
another tool.

## Why tool_result is a distinct message type, not just concatenated
text

Associating a tool's result with the specific tool_use that requested
it (via a shared ID) lets the model correctly track which result answers
which request, especially important when a single turn requests
multiple tools at once. This extends Module 2's message-array mechanism
with a purpose-built content type rather than requiring the calling
application to awkwardly encode this association into plain prose,
which would be far more fragile and ambiguous for the model to parse
correctly.

## Why this is the mechanism this course previewed conceptually in
Module 1 as a way models can access information beyond their training

Module 1 established that a model's knowledge is fixed by whatever it
learned during training, and that a fixed context window limits how
much external information can be provided directly. Tool calling
(alongside RAG, Modules 7-8) is one of the two primary mechanisms for
overcoming this: rather than a model needing to have "known" a fact
during training, it can request a tool that fetches a genuinely current,
external fact (today's weather, a specific database record, a live
stock price) and reason from that real result. This is the practical
foundation Module 9's agents build directly on top of — an agent is,
mechanically, this same tool loop run for more steps and more
autonomously.`,

    contentHi: `## Ek tool execute karna aur uska result wapas feed karna model ki tool_use request se genuinely alag step kyun hai

Lesson 1 ne establish kiya ki ek tool_use block abhi bhi sirf generated
output hai jo describe karta hai ki model ke hisaab se kya hona chahiye
— actual execution ek separate, deliberate action hai jo aapka
application leta hai, real code chalate hue jo ek real database query
karta hai, ek real API call karta hai, ya ek real calculation perform
karta hai. Us REAL result ko wapas conversation mein feed karna (ek
tool_result message ki tarah) wo hai jo subsequent generation ko
genuinely naye, external information pe condition karne deta hai jise
model apne aap produce nahi kar sakta tha — ye actual mechanism hai
jiske through tool calling ek model ke training ke dauran seekhi cheezon
se pare kya kar sakta hai use extend karta hai.

## Ye ek single request/response/request cycle ke bajaye ek loop kyun banata hai

Ek task ki tool requirements aksar pata nahi chal sakti jab tak ek prior
tool ka actual result na dekha jaaye — do cities ka weather compare
karne ke liye genuinely pehli city ka result dekhna padta hai isse pehle
ki model decide kare ki use ek doosri call chahiye, aur ek task ko teen,
paanch, ya zero tool calls chahiye ho sakte hain poori tarah is baat pe
depend karte hue ki raaste mein actually kya discover hota hai. Loop
naturally terminate hota hai jab model, ab tak collect ki har cheez
dekhkar, ek plain-text response produce karta hai ek aur tool_use ke
bajaye — model ke ek aur tool request na karne ke alawa koi separate
"done" signal nahi hai.

## tool_result ek distinct message type kyun hai, sirf concatenated text nahi

Ek tool ke result ko us specific tool_use se associate karna jisne ise
request kiya (ek shared ID ke through) model ko correctly track karne
deta hai ki kaunsa result kaunsi request ka answer hai, especially
important jab ek single turn ek saath multiple tools request karta hai.
Ye Module 2 ke message-array mechanism ko ek purpose-built content type
ke saath extend karta hai calling application ko is association ko
awkwardly plain prose mein encode karne ki zaroorat ke bajaye, jo model
ke liye correctly parse karne ke liye kaafi zyada fragile aur ambiguous
hoga.

## Ye wo mechanism kyun hai jise is course ne Module 1 mein conceptually preview kiya ki models training se pare information kaise access kar sakte hain

Module 1 ne establish kiya ki ek model ka knowledge fix hai us cheez se
jo isne training ke dauran seekha, aur ek fixed context window limit
karta hai ki kitna external information directly provide kiya ja sakta
hai. Tool calling (RAG ke saath, Modules 7-8) do primary mechanisms mein
se ek hai ise overcome karne ke liye: ek model ko training ke dauran ek
fact "jaana" hona chahiye ke bajaye, ye ek tool request kar sakta hai jo
ek genuinely current, external fact fetch karta hai (aaj ka weather, ek
specific database record, ek live stock price) aur us real result se
reason kar sakta hai. Ye practical foundation hai jispe Module 9 ke
agents directly build karte hain — ek agent, mechanically, wahi tool
loop hai jo zyada steps aur zyada autonomously chalta hai.`,

    examples: [
      {
        title: 'A complete multi-turn tool loop that resolves a task needing two sequential tool calls',
        titleHi: 'Ek complete multi-turn tool loop jo do sequential tool calls chahne wale ek task ko resolve karta hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [{
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  input_schema: {
    type: 'object',
    properties: { city: { type: 'string' } },
    required: ['city'],
  },
}];

async function getWeather({ city }) {
  // A real, external call — genuinely new information the model
  // couldn't have known during training
  const conditions = { Tokyo: 'Cloudy, 18°C', Paris: 'Sunny, 22°C' };
  return conditions[city] ?? 'Unknown city';
}

async function runToolLoop(userMessage) {
  let messages = [{ role: 'user', content: userMessage }];
  let iterations = 0;

  while (iterations++ < 5) { // a safety cap — never loop unboundedly
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      tools,
      messages,
    });
    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;

    const result = await getWeather(toolUse.input);
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
    });
  }
  throw new Error('Tool loop exceeded maximum iterations');
}

const answer = await runToolLoop('Compare the weather in Tokyo and Paris — which is nicer today?');
// The loop runs TWICE (once per city) before the model has enough real
// data to answer — it decided this adaptively, not from a fixed script`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [{
  name: 'get_weather',
  description: 'Get the current weather for a specific city.',
  input_schema: {
    type: 'object',
    properties: { city: { type: 'string' } },
    required: ['city'],
  },
}];

async function getWeather({ city }: { city: string }): Promise<string> {
  // A real, external call — genuinely new information the model
  // couldn't have known during training
  const conditions: Record<string, string> = { Tokyo: 'Cloudy, 18°C', Paris: 'Sunny, 22°C' };
  return conditions[city] ?? 'Unknown city';
}

async function runToolLoop(userMessage: string): Promise<string | undefined> {
  let messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];
  let iterations = 0;

  while (iterations++ < 5) { // a safety cap — never loop unboundedly
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      tools,
      messages,
    });
    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );
    if (!toolUse) {
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === 'text',
      );
      return textBlock?.text;
    }

    const result = await getWeather(toolUse.input as { city: string });
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
    });
  }
  throw new Error('Tool loop exceeded maximum iterations');
}

const answer = await runToolLoop('Compare the weather in Tokyo and Paris — which is nicer today?');
// The loop runs TWICE (once per city) before the model has enough real
// data to answer — it decided this adaptively, not from a fixed script`,
        code: `while (iterations++ < 5) {
  const response = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 1024, tools, messages });
  messages.push({ role: 'assistant', content: response.content });
  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;
  const result = await getWeather(toolUse.input);
  messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }] });
}`,
        output:
          "The loop calls get_weather for Tokyo, receives 'Cloudy, 18°C', loops again (the model still needs Paris's data to compare), calls get_weather for Paris, receives 'Sunny, 22°C', and on the third iteration produces a plain-text comparison — no tool_use block, so the loop exits and returns that text.",
        explain:
          "The safety cap (iterations++ < 5) is a real production concern this example previews for Module 9's agents lesson: an unbounded tool loop, especially if a tool call's result somehow keeps prompting further tool calls, could run indefinitely and accumulate real cost (Module 2) with no natural stopping point — a hard iteration limit is a simple, necessary guardrail.",
        explainHi:
          "Safety cap (iterations++ < 5) ek real production concern hai jo ye example Module 9 ke agents lesson ke liye preview karta hai: ek unbounded tool loop, especially agar ek tool call ka result kisi tarah aur tool calls ko prompt karta rahe, indefinitely chal sakta hai aur real cost (Module 2) accumulate kar sakta hai bina kisi natural stopping point ke — ek hard iteration limit ek simple, zaroori guardrail hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Looping without any iteration limit — a genuine production risk
async function runToolLoop(userMessage) {
  let messages = [{ role: 'user', content: userMessage }];
  while (true) { // no safety cap
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5', max_tokens: 1024, tools, messages,
    });
    messages.push({ role: 'assistant', content: response.content });
    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;
    const result = await runTool(toolUse);
    messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }] });
  }
  // If the model, for any reason, keeps requesting tools indefinitely
  // (a bug in tool design, a confusing result triggering repeated
  // re-attempts), this runs — and bills — forever.
}`,
        right: `// Looping with a hard iteration cap
async function runToolLoop(userMessage) {
  let messages = [{ role: 'user', content: userMessage }];
  let iterations = 0;
  while (iterations++ < 8) { // a sensible, explicit ceiling
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5', max_tokens: 1024, tools, messages,
    });
    messages.push({ role: 'assistant', content: response.content });
    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;
    const result = await runTool(toolUse);
    messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }] });
  }
  throw new Error('Tool loop exceeded maximum iterations — investigate why');
}`,
        why: "Because each loop iteration is a real, billed model call (Module 2's cost math), an unbounded loop is a genuine financial and reliability risk if the model ever gets stuck requesting tools repeatedly without converging on an answer. A hard iteration cap turns an unbounded failure mode into a bounded, detectable one.",
        whyHi:
          "Kyunki har loop iteration ek real, billed model call hai (Module 2 ka cost math), ek unbounded loop ek genuine financial aur reliability risk hai agar model kabhi stuck ho jaaye repeatedly tools request karte hue bina ek answer pe converge kiye. Ek hard iteration cap ek unbounded failure mode ko ek bounded, detectable wale mein badalta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production travel-booking assistant handling 'find me a flight and hotel for a trip to Tokyo next month' runs a genuine multi-turn tool loop — searching flights, then searching hotels based on the chosen flight's dates, then possibly checking a loyalty-program balance — with an explicit iteration cap and cost monitoring, since the number of tool calls genuinely needed varies request to request.",
        hi: 'Ek production travel-booking assistant jo \'agle mahine Tokyo ke trip ke liye mujhe ek flight aur hotel dhundho\' handle karta hai ek genuine multi-turn tool loop chalata hai — flights search karte hue, phir chosen flight ki dates ke basis pe hotels search karte hue, phir possibly ek loyalty-program balance check karte hue — ek explicit iteration cap aur cost monitoring ke saath, kyunki genuinely chahiye tool calls ki number request se request vary karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is tool calling implemented as a loop rather than a single request/response with an extra step for the tool result?',
        qHi: 'Tool calling ek loop ki tarah kyun implement kiya jata hai ek single request/response versus tool result ke liye ek extra step ke bajaye?',
        a: "Because a task's actual tool requirements often can't be known until a prior tool's real result is seen — the model may need zero, one, or several tool calls depending entirely on what's discovered along the way. The loop continues as long as the model keeps requesting tools and terminates naturally when it produces a plain-text response instead.",
        aHi: 'Kyunki ek task ki actual tool requirements aksar pata nahi chal sakti jab tak ek prior tool ka real result na dekha jaaye — model ko zero, ek, ya kai tool calls chahiye ho sakte hain poori tarah is baat pe depend karte hue ki raaste mein kya discover hota hai. Loop tab tak chalta hai jab tak model tools request karta rehta hai aur naturally terminate hota hai jab ye iske bajaye ek plain-text response produce karta hai.',
      },
      {
        q: "Why does a production tool loop need a hard iteration limit, even though the loop's termination condition (a plain-text response) is already defined?",
        qHi: 'Ek production tool loop ko ek hard iteration limit kyun chahiye, chahe loop ki termination condition (ek plain-text response) already defined ho?',
        a: "Each iteration is a real, billed model call. If the model ever gets stuck in a pattern of repeatedly requesting tools without converging on a final answer (due to a tool design issue or a confusing result), an unbounded loop would run — and bill — indefinitely. A hard cap turns this into a bounded, detectable failure rather than an open-ended cost risk.",
        aHi: 'Har iteration ek real, billed model call hai. Agar model kabhi ek pattern mein stuck ho jaaye repeatedly tools request karte hue bina ek final answer pe converge kiye (ek tool design issue ya ek confusing result ki wajah se), ek unbounded loop indefinitely chalega — aur bill karega. Ek hard cap ise ek bounded, detectable failure mein badalta hai ek open-ended cost risk ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A task asks an AI assistant to 'find the cheapest flight from three different airlines and book the cheapest one.' Describe, step by step, what a tool loop handling this would likely do, and explain why the exact number of tool calls can't be hardcoded in advance.",
        taskHi: 'Ek task ek AI assistant se poochta hai \'teen alag airlines se sabse sasti flight dhundho aur sabse sasti wali book karo.\' Step by step describe karo ki ise handle karne wala ek tool loop likely kya karega, aur explain karo ki exact number of tool calls advance mein hardcode kyun nahi ki ja sakti.',
        hint: "Consider that the model can't know which airline's search result requires a follow-up action (a booking call) until it's actually seen the comparison of all three prices.",
        hintHi: 'Consider karo ki model ye nahi jaan sakta ki kaunse airline ke search result ko ek follow-up action (ek booking call) chahiye jab tak ye actually teenon prices ka comparison na dekh le.',
      },
    ],

    keyTakeaways: [
      "Tool execution is a genuinely distinct step from the model's request: your application runs the real code, and feeding the real result back (as a tool_result message) is what lets the model condition on genuinely new external information.",
      "Tool calling forms a loop, not a single extra round-trip, because a task's actual tool requirements often can't be known until a prior tool's real result is seen — the model decides adaptively at each step.",
      "tool_result is a distinct message content type (associated with a specific tool_use by ID), extending Module 2's role-tagged message array rather than requiring the association to be encoded ambiguously in plain text.",
      "A production tool loop needs a hard iteration cap — since each iteration is a real, billed model call, an unbounded loop is a genuine cost and reliability risk if the model ever fails to converge on a final answer.",
    ],
    keyTakeawaysHi: [
      'Tool execution model ki request se genuinely alag step hai: aapka application real code chalata hai, aur real result ko wapas feed karna (ek tool_result message ki tarah) wo hai jo model ko genuinely naye external information pe condition karne deta hai.',
      'Tool calling ek loop banata hai, ek single extra round-trip nahi, kyunki ek task ki actual tool requirements aksar pata nahi chal sakti jab tak ek prior tool ka real result na dekha jaaye — model har step pe adaptively decide karta hai.',
      'tool_result ek distinct message content type hai (ek specific tool_use se ID dwara associated), Module 2 ke role-tagged message array ko extend karte hue is association ko plain text mein ambiguously encode karne ki zaroorat ke bajaye.',
      'Ek production tool loop ko ek hard iteration cap chahiye — kyunki har iteration ek real, billed model call hai, ek unbounded loop ek genuine cost aur reliability risk hai agar model kabhi ek final answer pe converge karne mein fail ho.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-validating-tool-arguments',
    title: "Validating Tool Arguments — Treating the Model's Output as Untrusted Input",
    titleHi: "Tool Arguments Validate Karna — Model Ke Output Ko Untrusted Input Ki Tarah Treat Karna",
    description:
      "A tool's arguments are produced by a generative process (Module 1), not a trusted client you control — this lesson establishes why they need exactly the same validation discipline as any other untrusted input, before this course's security modules (12-13) develop the full threat model.",
    descriptionHi:
      'Ek tool ke arguments ek generative process (Module 1) dwara produce kiye jaate hain, koi trusted client nahi jise aap control karte ho — ye lesson establish karta hai ki unhe exactly wahi validation discipline kyun chahiye jo kisi bhi doosre untrusted input ko chahiye, is course ke security modules (12-13) poora threat model develop karne se pehle.',
    difficulty: 'HARD',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A bank teller who processes a withdrawal slip exactly as filled out, versus one trained to verify the account number and available balance before handing over any cash, regardless of how official the slip looks.** A teller who blindly trusts a slip's contents because it's formatted correctly and handed over with confidence is one social-engineering trick away from a serious loss — the slip LOOKING correct says nothing about whether the withdrawal is actually valid or safe to execute. A properly trained teller treats every slip's specific numbers as claims to verify, not facts to act on directly, checking them against the actual account records before any money moves. A model's tool call is exactly this slip: it can be well-formatted, confident, and even genuinely well-intentioned, but the SPECIFIC VALUES it contains are a generative process's output, not a verified fact — and your application, playing the trained teller, must check those values against real constraints (permissions, valid ranges, business rules) before executing anything with real consequences, regardless of how correctly-shaped the request looks.",
      hi: 'Ek bank teller jo ek withdrawal slip ko exactly jaise fill kiya gaya waise process karta hai, versus ek jo account number aur available balance verify karne ke liye trained hai kisi bhi cash handover karne se pehle, chahe slip kitna bhi official dikhe. Ek teller jo blindly ek slip ke contents trust karta hai kyunki ye correctly formatted hai aur confidence ke saath handed over kiya gaya, ek social-engineering trick door hai ek serious loss se — slip ka CORRECT DIKHNA kuch nahi kehta is baat ke baare mein ki kya withdrawal actually valid ya safe to execute hai. Ek properly trained teller har slip ke specific numbers ko verify karne layak claims ki tarah treat karta hai, directly act karne layak facts nahi, unhe actual account records ke against check karte hue kisi bhi paise move hone se pehle. Ek model ka tool call exactly ye slip hai: ye well-formatted, confident, aur genuinely well-intentioned bhi ho sakta hai, par ismein jo SPECIFIC VALUES hain wo ek generative process ka output hain, ek verified fact nahi — aur aapka application, trained teller ka role play karte hue, un values ko real constraints (permissions, valid ranges, business rules) ke against check karna chahiye kisi bhi real consequences wali cheez execute karne se pehle, chahe request kitni bhi correctly-shaped dikhe.',
    },

    simple: `**Why "the model produced it" is not a reason to trust a tool
argument:** Module 1 established that a model generates the most
plausible continuation given a sequence — plausible, not verified. A
tool call's arguments are generated text, subject to the exact same
lack of ground-truth-checking as any other model output (Module 1,
Lesson 3's hallucination lesson applies directly here). Treating a
tool's arguments as automatically safe because they came from a
well-formed tool_use block confuses "correctly formatted" with
"safe and valid to act on" — two genuinely different properties.

**The validation this lesson establishes — the same schema from
Lesson 1, now enforced at execution time:**

\`\`\`ts
import { z } from 'zod';

const transferFundsParams = z.object({
  toAccountId: z.string().uuid(),
  amountCents: z.number().int().positive().max(1_000_000), // a real business rule
});

async function executeTransferFundsTool(rawInput, currentUserId) {
  // VALIDATE the shape and constraints — never trust the model's
  // output just because it parsed as an object
  const parsed = transferFundsParams.safeParse(rawInput);
  if (!parsed.success) {
    return { error: 'Invalid arguments', details: parsed.error.format() };
  }

  const { toAccountId, amountCents } = parsed.data;

  // AUTHORIZE — a check that has NOTHING to do with the model at all;
  // this is a real security boundary, not a formatting check
  const canTransfer = await currentUserOwnsAccount(currentUserId, toAccountId);
  if (!canTransfer) {
    return { error: 'Not authorized to transfer to this account' };
  }

  // Only NOW, after both validation and authorization, execute the
  // real action
  return await performTransfer(toAccountId, amountCents);
}
\`\`\`

**Two genuinely different failure modes this validation catches:**

\`\`\`
1. Malformed/nonsensical arguments — the model, due to a confusing
   prompt or an edge case, produces a negative amount, a malformed
   account ID, or a missing required field. Zod's schema validation
   (the same z.object shape from Lesson 1) catches this category.

2. Well-formed but UNAUTHORIZED arguments — the model produces a
   perfectly valid-looking transfer to an account the CURRENT USER
   doesn't actually own or have permission to transfer to (possibly
   because a visitor tricked it into this via a prompt injection —
   Module 12 covers this attack in depth). Schema validation alone
   does NOT catch this — it requires a genuine authorization check
   against your actual business rules, completely independent of
   whatever the model produced.
\`\`\`

**Why this connects directly to Module 12's security track:** this
lesson establishes the baseline discipline (never execute unvalidated,
unauthorized tool arguments); Module 12 develops the full threat model
this discipline defends against — specifically, that a visitor
(or content the model reads, like a webpage or document) might
deliberately try to manipulate the model into producing a tool call
that serves an attacker's purpose rather than the legitimate user's.
The validation and authorization checks this lesson establishes are the
concrete mechanism that defense relies on.`,

    simpleHi: `**"Model ne ise produce kiya" ek tool argument ko trust karne ki
wajah kyun nahi hai:** Module 1 ne establish kiya ki ek model ek sequence
ko dekhkar sabse plausible continuation generate karta hai — plausible,
verified nahi. Ek tool call ke arguments generated text hain, exactly
wahi lack of ground-truth-checking ke subject jo kisi bhi doosre model
output ko hai (Module 1, Lesson 3 ka hallucination lesson directly yahan
apply hota hai). Ek tool ke arguments ko automatically safe treat karna
kyunki wo ek well-formed tool_use block se aaye "correctly formatted" ko
"safe and valid to act on" se confuse karta hai — do genuinely alag
properties.

**Validation jise ye lesson establish karta hai — Lesson 1 wala wahi
schema, ab execution time pe enforce kiya gaya:**

\`\`\`ts
import { z } from 'zod';

const transferFundsParams = z.object({
  toAccountId: z.string().uuid(),
  amountCents: z.number().int().positive().max(1_000_000), // ek real business rule
});

async function executeTransferFundsTool(rawInput, currentUserId) {
  // Shape aur constraints ko VALIDATE karo — model ke output ko kabhi
  // trust mat karo sirf isliye kyunki ye ek object ki tarah parse hua
  const parsed = transferFundsParams.safeParse(rawInput);
  if (!parsed.success) {
    return { error: 'Invalid arguments', details: parsed.error.format() };
  }

  const { toAccountId, amountCents } = parsed.data;

  // AUTHORIZE — ek check jiska model se BILKUL koi lena-dena nahi;
  // ye ek real security boundary hai, ek formatting check nahi
  const canTransfer = await currentUserOwnsAccount(currentUserId, toAccountId);
  if (!canTransfer) {
    return { error: 'Not authorized to transfer to this account' };
  }

  // Sirf AB, dono validation aur authorization ke baad, real action
  // execute karo
  return await performTransfer(toAccountId, amountCents);
}
\`\`\`

**Do genuinely alag failure modes jinhe ye validation catch karta hai:**

\`\`\`
1. Malformed/nonsensical arguments — model, ek confusing prompt ya ek
   edge case ki wajah se, ek negative amount, ek malformed account ID,
   ya ek missing required field produce karta hai. Zod ka schema
   validation (Lesson 1 wala wahi z.object shape) is category ko catch
   karta hai.

2. Well-formed par UNAUTHORIZED arguments — model ek perfectly
   valid-looking transfer produce karta hai ek aise account ko jise
   CURRENT USER actually own nahi karta ya transfer karne ki permission
   nahi rakhta (possibly kyunki ek visitor ne ise ek prompt injection ke
   through trick kiya — Module 12 is attack ko poori depth mein cover
   karta hai). Schema validation akela ISE catch NAHI karta — ise ek
   genuine authorization check chahiye aapke actual business rules ke
   against, model ne jo bhi produce kiya usse poori tarah independent.
\`\`\`

**Ye directly Module 12 ke security track se kaise connect karta hai:**
ye lesson baseline discipline establish karta hai (kabhi unvalidated,
unauthorized tool arguments execute mat karo); Module 12 poora threat
model develop karta hai jise ye discipline defend karta hai — specifically,
ki ek visitor (ya content jise model padhta hai, jaise ek webpage ya
document) deliberately model ko manipulate karne ki koshish kar sakta hai
ek aisa tool call produce karne ke liye jo legitimate user ke bajaye ek
attacker ke purpose ko serve kare. Is lesson ke establish kiye validation
aur authorization checks concrete mechanism hain jispe wo defense rely
karta hai.`,

    content: `## Why "produced by the model" is precisely the reason to distrust,
not trust, a tool argument's specific values

Module 1 established generation as producing the most plausible
continuation given a sequence, with no mechanism for verifying that
continuation against ground truth. A tool call's arguments are exactly
this kind of output — plausible-looking, often correct, but with no
guarantee tying them to anything true or authorized. The well-formed
JSON shape of a tool call (Lesson 1's schema) proves only that the
model's OUTPUT matches the expected structure; it says nothing about
whether the specific values inside that structure are safe, correct, or
something the requesting user is actually permitted to have executed.

## Why schema validation and authorization are two genuinely separate
checks, both necessary

Schema validation (does this look like a well-formed request — correct
types, required fields present, values within a sensible range) catches
malformed or nonsensical arguments, the kind of failure Module 3's
structured-output lesson already covered from a data-quality angle.
Authorization (is the CURRENT, ACTUAL user of this request actually
permitted to have this specific action performed) is a completely
independent check that has nothing to do with the model at all — it's
the same access-control discipline any application needs for any
user-triggered action, regardless of whether an AI model or a plain web
form produced the request. A tool call passing schema validation proves
nothing about authorization, and vice versa; both checks are required,
and neither substitutes for the other.

## Why this lesson exists before Module 12's full security treatment

This lesson establishes the baseline discipline — validate structure,
then authorize the actual action — as a general engineering practice
that applies even in a scenario with no adversary at all (a legitimate
user, an honestly-behaving model that simply makes an occasional
mistake). Module 12 builds directly on top of this foundation to cover
the adversarial case: a malicious actor deliberately trying to manipulate
a model (via a crafted prompt, or malicious content the model reads
during RAG or tool use) into producing a tool call that serves the
attacker's interest. The validation and authorization discipline this
lesson establishes is the actual mechanism that defense depends on —
Module 12 doesn't introduce a new technique so much as it explains why
this lesson's discipline is non-negotiable once an adversary is assumed.

## How this connects forward to agents and RAG

Module 9's agents execute tool loops (Lesson 2) with even less direct
human oversight per individual action, making rigorous per-call
validation and authorization even more load-bearing than in a
single-tool-call scenario — an agent making a chain of decisions with
no human reviewing each one needs every single action gated by real
checks, not just the first. Module 7-8's RAG introduces another
wrinkle this lesson's discipline anticipates: content retrieved from a
knowledge base and fed into a model's context is, itself, a form of
input that ends up influencing what the model produces — including,
potentially, what tool calls it decides to make — which is exactly why
Module 12 treats "indirect" prompt injection via retrieved content as a
genuine, distinct threat.`,

    contentHi: `## "Model dwara produce kiya gaya" precisely ek tool argument ke specific values ko distrust karne ki wajah kyun hai, trust karne ki nahi

Module 1 ne establish kiya ki generation ek sequence ko dekhkar sabse
plausible continuation produce karta hai, us continuation ko ground
truth ke against verify karne ke liye koi mechanism ke bina. Ek tool
call ke arguments exactly is kism ka output hain — plausible-looking,
aksar correct, par unhe kisi bhi sach ya authorized cheez se tie karne
ki koi guarantee ke bina. Ek tool call ki well-formed JSON shape
(Lesson 1 ka schema) sirf ye prove karti hai ki model ka OUTPUT expected
structure se match karta hai; ye kuch nahi kehta ki kya us structure ke
andar ke specific values safe, correct, ya kuch aisa hain jise requesting
user actually execute karwane ki permission rakhta hai.

## Schema validation aur authorization do genuinely separate checks kyun hain, dono zaroori

Schema validation (kya ye ek well-formed request jaisa dikhta hai —
correct types, required fields present, values ek sensible range mein)
malformed ya nonsensical arguments catch karta hai, wo kism ka failure
jo Module 3 ka structured-output lesson already ek data-quality angle se
cover kar chuka hai. Authorization (kya is request ka CURRENT, ACTUAL
user actually ye specific action perform karwane ki permission rakhta
hai) ek poori tarah independent check hai jiska model se bilkul koi
lena-dena nahi — ye wahi access-control discipline hai jo kisi bhi
application ko kisi bhi user-triggered action ke liye chahiye, chahe ek
AI model ya ek plain web form ne request produce ki ho. Ek tool call jo
schema validation pass karta hai authorization ke baare mein kuch nahi
prove karta, aur vice versa; dono checks zaroori hain, aur koi bhi
doosre ko substitute nahi karta.

## Ye lesson Module 12 ke poore security treatment se pehle kyun exist karta hai

Ye lesson baseline discipline establish karta hai — structure validate
karo, phir actual action authorize karo — ek general engineering
practice ki tarah jo bina kisi bhi adversary ke ek scenario mein bhi
apply hoti hai (ek legitimate user, ek honestly-behaving model jo simply
kabhi kabhi ek mistake karta hai). Module 12 directly is foundation ke
upar build karta hai adversarial case cover karne ke liye: ek malicious
actor deliberately ek model ko manipulate karne ki koshish karta hai (ek
crafted prompt ke through, ya malicious content jise model RAG ya tool
use ke dauran padhta hai) ek aisa tool call produce karne ke liye jo
attacker ke interest ko serve kare. Is lesson ka establish kiya validation
aur authorization discipline actual mechanism hai jispe wo defense
depend karta hai — Module 12 ek naya technique itna introduce nahi karta
jitna ye explain karta hai ki ek adversary assume kiye jaane ke baad ye
lesson ka discipline non-negotiable kyun hai.

## Ye forward agents aur RAG se kaise connect karta hai

Module 9 ke agents tool loops (Lesson 2) execute karte hain per
individual action even less direct human oversight ke saath, rigorous
per-call validation aur authorization ko ek single-tool-call scenario se
bhi zyada load-bearing banate hue — ek agent jo decisions ki ek chain
banata hai bina kisi human ke har ek review kiye, use har single action
ko real checks se gate karna chahiye, sirf first ko nahi. Module 7-8 ka
RAG ek aur wrinkle introduce karta hai jise ye lesson ka discipline
anticipate karta hai: ek knowledge base se retrieved content jo ek
model ke context mein feed hota hai, khud, input ka ek form hai jo
ultimately affect karta hai ki model kya produce karta hai — potentially
samet, ki ye kaunse tool calls karne ka decide karta hai — yahi exactly
wajah hai Module 12 "indirect" prompt injection ko retrieved content ke
through ek genuine, distinct threat ki tarah treat karta hai.`,

    examples: [
      {
        title: 'A tool executor enforcing both schema validation and independent authorization before any real action',
        titleHi: 'Ek tool executor jo kisi bhi real action se pehle dono schema validation aur independent authorization enforce karta hai',
        codeJs: `import { z } from 'zod';

const deleteFileParams = z.object({
  fileId: z.string().uuid(),
});

async function executeDeleteFileTool(rawInput, requestingUserId) {
  // STEP 1: schema validation — is this even well-formed?
  const parsed = deleteFileParams.safeParse(rawInput);
  if (!parsed.success) {
    return { error: 'Invalid tool arguments', details: parsed.error.format() };
  }
  const { fileId } = parsed.data;

  // STEP 2: authorization — a check with NOTHING to do with the model.
  // Even a perfectly well-formed fileId must be checked against who's
  // actually allowed to delete it right now.
  const file = await db.file.findUnique({ where: { id: fileId } });
  if (!file) {
    return { error: 'File not found' };
  }
  if (file.ownerId !== requestingUserId) {
    return { error: 'You do not have permission to delete this file' };
  }

  // STEP 3: only now, after BOTH checks pass, perform the real action
  await db.file.delete({ where: { id: fileId } });
  return { success: true, deletedFileId: fileId };
}`,
        codeTs: `import { z } from 'zod';

const deleteFileParams = z.object({
  fileId: z.string().uuid(),
});

async function executeDeleteFileTool(
  rawInput: unknown,
  requestingUserId: string,
): Promise<{ error: string; details?: unknown } | { success: true; deletedFileId: string }> {
  // STEP 1: schema validation — is this even well-formed?
  const parsed = deleteFileParams.safeParse(rawInput);
  if (!parsed.success) {
    return { error: 'Invalid tool arguments', details: parsed.error.format() };
  }
  const { fileId } = parsed.data;

  // STEP 2: authorization — a check with NOTHING to do with the model.
  // Even a perfectly well-formed fileId must be checked against who's
  // actually allowed to delete it right now.
  const file = await db.file.findUnique({ where: { id: fileId } });
  if (!file) {
    return { error: 'File not found' };
  }
  if (file.ownerId !== requestingUserId) {
    return { error: 'You do not have permission to delete this file' };
  }

  // STEP 3: only now, after BOTH checks pass, perform the real action
  await db.file.delete({ where: { id: fileId } });
  return { success: true, deletedFileId: fileId };
}`,
        code: `const parsed = deleteFileParams.safeParse(rawInput);
if (!parsed.success) return { error: 'Invalid tool arguments' };
const file = await db.file.findUnique({ where: { id: parsed.data.fileId } });
if (!file || file.ownerId !== requestingUserId) return { error: 'Not authorized' };
await db.file.delete({ where: { id: parsed.data.fileId } });`,
        output:
          "A tool call with a well-formed fileId belonging to a DIFFERENT user is rejected with 'You do not have permission,' even though it passed schema validation cleanly — demonstrating that a syntactically perfect tool call is not automatically a safe one to execute.",
        explain:
          "This example deliberately separates the two check categories this lesson establishes: schema validation (STEP 1) verifies structure, and authorization (STEP 2) verifies the actual user's real-world permission — a well-formed request that fails authorization is stopped just as reliably as a malformed one, because neither check alone is sufficient.",
        explainHi:
          "Ye example deliberately un do check categories ko separate karta hai jise ye lesson establish karta hai: schema validation (STEP 1) structure verify karta hai, aur authorization (STEP 2) actual user ki real-world permission verify karta hai — ek well-formed request jo authorization fail karti hai utni hi reliably roki jaati hai jitni ek malformed wali, kyunki koi bhi check akela sufficient nahi hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Executing a tool call as soon as it passes schema validation,
// with no separate authorization check
async function executeDeleteFileTool(rawInput) {
  const parsed = deleteFileParams.safeParse(rawInput);
  if (!parsed.success) return { error: 'Invalid arguments' };

  // WRONG — schema validation alone says NOTHING about whether the
  // requesting user is allowed to delete THIS specific file
  await db.file.delete({ where: { id: parsed.data.fileId } });
  return { success: true };
}`,
        right: `// Requiring an independent authorization check, regardless of
// how well-formed the schema-validated arguments are
async function executeDeleteFileTool(rawInput, requestingUserId) {
  const parsed = deleteFileParams.safeParse(rawInput);
  if (!parsed.success) return { error: 'Invalid arguments' };

  const file = await db.file.findUnique({ where: { id: parsed.data.fileId } });
  if (!file || file.ownerId !== requestingUserId) {
    return { error: 'Not authorized' }; // stops here, regardless of schema validity
  }

  await db.file.delete({ where: { id: parsed.data.fileId } });
  return { success: true };
}`,
        why: "Schema validation only confirms a request's SHAPE is well-formed — it has no concept of who the requesting user is or what they're permitted to do. A perfectly valid-looking fileId belonging to someone else's file must still be rejected by a separate, genuine authorization check.",
        whyHi:
          "Schema validation sirf confirm karta hai ki ek request ki SHAPE well-formed hai — iske paas koi concept nahi hai ki requesting user kaun hai ya wo kya karne ki permission rakhte hain. Ek perfectly valid-looking fileId jo kisi doosre ki file ki hai abhi bhi ek separate, genuine authorization check dwara reject kiya jaana chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A production AI assistant capable of modifying a company's CRM records validates every tool call's arguments against a strict schema AND separately checks the requesting employee's actual CRM permissions before any write — specifically because a well-formed tool call requesting a change to a record the requesting user isn't authorized to touch must be rejected regardless of how correctly the model formatted the request.",
        hi: 'Ek production AI assistant jo ek company ke CRM records modify kar sakta hai har tool call ke arguments ko ek strict schema ke against validate karta hai AUR separately requesting employee ki actual CRM permissions check karta hai kisi bhi write se pehle — specifically kyunki ek well-formed tool call jo ek record mein ek change request karta hai jise requesting user touch karne ki authorized nahi hai reject kiya jaana chahiye chahe model ne request kitni bhi correctly format ki ho.',
      },
    ],

    interviewQA: [
      {
        q: "Why isn't passing schema validation sufficient reason to execute a tool call's action?",
        qHi: 'Schema validation pass karna ek tool call ke action ko execute karne ke liye sufficient reason kyun nahi hai?',
        a: "Schema validation only confirms the arguments are well-formed (correct types, required fields present) — it has no concept of authorization, meaning whether the specific user who triggered this request is actually permitted to have this specific action performed. A well-formed but unauthorized request (e.g., a valid file ID belonging to a different user) must still be rejected by a separate, independent authorization check.",
        aHi: 'Schema validation sirf confirm karta hai ki arguments well-formed hain (correct types, required fields present) — iske paas authorization ka koi concept nahi hai, matlab kya wo specific user jisne ye request trigger ki actually ye specific action perform karwane ki permission rakhta hai. Ek well-formed par unauthorized request (jaise, ek doosre user ki ek valid file ID) ko abhi bhi ek separate, independent authorization check dwara reject kiya jaana chahiye.',
      },
      {
        q: "How does this lesson's validation discipline relate to Module 1's hallucination lesson?",
        qHi: 'Is lesson ka validation discipline Module 1 ke hallucination lesson se kaise related hai?',
        a: "Module 1 established that a model's generation process produces the most plausible continuation with no mechanism for verifying it against ground truth — the same reasoning applies directly to a tool call's arguments, which are generated text subject to the same lack of truth-checking. A well-formed tool call proves the output matches expected structure, not that its specific values are correct, safe, or authorized.",
        aHi: 'Module 1 ne establish kiya ki ek model ka generation process sabse plausible continuation produce karta hai ise ground truth ke against verify karne ke liye koi mechanism ke bina — wahi reasoning directly ek tool call ke arguments pe apply hoti hai, jo generated text hain wahi lack of truth-checking ke subject. Ek well-formed tool call sirf ye prove karta hai ki output expected structure se match karta hai, ye nahi ki uske specific values correct, safe, ya authorized hain.',
      },
    ],

    exercises: [
      {
        task: "An AI assistant with a `send_email` tool validates that the recipient field is a well-formed email address before sending, but doesn't check whether the requesting user is actually permitted to send email as the sender address the model chose. Identify the missing check category from this lesson, and describe a concrete scenario where its absence causes a real problem.",
        taskHi: 'Ek AI assistant jiske paas ek `send_email` tool hai validate karta hai ki recipient field ek well-formed email address hai bhejne se pehle, par check nahi karta ki kya requesting user actually us sender address se email bhejne ki permission rakhta hai jo model ne choose ki. Is lesson se missing check category identify karo, aur ek concrete scenario describe karo jahan iski absence ek real problem cause karti hai.',
        hint: "Distinguish between checking that the arguments are well-formed and checking that the requesting user is actually allowed to trigger this specific action.",
        hintHi: 'Ye check karne ke beech distinguish karo ki arguments well-formed hain aur ye check karne ke beech ki requesting user actually is specific action ko trigger karne ki allowed hai.',
      },
    ],

    keyTakeaways: [
      "A tool call's arguments are generated output (Module 1) — plausible, not verified — so a well-formed tool call proves only that its structure matches the expected schema, not that its specific values are safe or correct.",
      "Schema validation and authorization are two genuinely separate, both-required checks: schema validation catches malformed arguments, while authorization (independent of the model entirely) verifies the actual requesting user is permitted to have this specific action performed.",
      "This baseline discipline (validate, then authorize) applies even without an adversary — Module 12 builds on top of it to address a deliberate attacker trying to manipulate a model into producing a harmful tool call.",
      "The stakes for rigorous per-call validation and authorization increase directly with Module 9's agents (longer tool loops, less per-step human oversight) and Module 7-8's RAG (retrieved content that can influence what tool calls a model decides to make).",
    ],
    keyTakeawaysHi: [
      'Ek tool call ke arguments generated output hain (Module 1) — plausible, verified nahi — isliye ek well-formed tool call sirf ye prove karta hai ki uska structure expected schema se match karta hai, ye nahi ki uske specific values safe ya correct hain.',
      'Schema validation aur authorization do genuinely separate, dono-required checks hain: schema validation malformed arguments catch karta hai, jabki authorization (model se poori tarah independent) verify karta hai ki actual requesting user is specific action ko perform karwane ki permission rakhta hai.',
      'Ye baseline discipline (validate, phir authorize) bina kisi adversary ke bhi apply hoti hai — Module 12 iske upar build karta hai ek deliberate attacker ko address karne ke liye jo ek model ko ek harmful tool call produce karwane ke liye manipulate karne ki koshish karta hai.',
      'Rigorous per-call validation aur authorization ke stakes directly Module 9 ke agents (longer tool loops, kam per-step human oversight) aur Module 7-8 ke RAG (retrieved content jo affect kar sakta hai ki model kaunse tool calls karne ka decide karta hai) ke saath badhte hain.',
    ],
  },
];
