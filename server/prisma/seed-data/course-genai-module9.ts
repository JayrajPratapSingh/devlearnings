/**
 * Generative AI Complete Course — Module 9: Agents, lessons 1-3.
 *
 * Lesson 1: The ReAct loop — reason, act, observe.
 * Lesson 2: Multi-step tool use and agent memory (short vs long-term).
 * Lesson 3: When a simple chain beats an agent's open-ended loop.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_9: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-the-react-loop',
    title: 'The ReAct Loop — Reason, Act, Observe',
    titleHi: 'ReAct Loop — Reason, Act, Observe',
    description:
      "An 'agent' isn't a new model capability — it's Module 5's tool loop, run with the model itself deciding, step by step, what to do next based on what it just observed, rather than following a predetermined sequence. This lesson names and formalizes that pattern.",
    descriptionHi:
      "Ek 'agent' koi nayi model capability nahi hai — ye Module 5 ka tool loop hai, model khud decide karte hue chalaya gaya, step by step, ki abhi jo observe kiya uske basis pe aage kya karna hai, ek predetermined sequence follow karne ke bajaye. Ye lesson us pattern ko naam deta hai aur formalize karta hai.",
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A detective solving a genuinely open-ended case versus one following a fixed checklist written before ever visiting the crime scene.** A detective working from a rigid, pre-written checklist — \"interview the neighbor, then check the security camera, then file the report\" — falls apart the moment the neighbor's answer reveals something that makes checking the security camera pointless and instead demands questioning a completely different person first. A real detective instead works in a loop: observe the current evidence, REASON about what it suggests and what to investigate next, ACT by pursuing that specific lead, OBSERVE the new result, and repeat — the next action is always chosen based on what was actually just learned, not a plan fixed before the investigation began. The ReAct loop is exactly this detective's actual working process, formalized: reason about the current situation, act by invoking a tool, observe that tool's real result, and loop back to reasoning again — each cycle's action genuinely depends on what the previous cycle revealed, which is precisely what makes it capable of handling tasks whose steps can't be known in advance.",
      hi: 'Ek detective jo ek genuinely open-ended case solve karta hai versus ek jo crime scene visit karne se pehle likhi gayi ek fixed checklist follow karta hai. Ek rigid, pre-written checklist se kaam karne wala ek detective — "neighbor interview karo, phir security camera check karo, phir report file karo" — us moment fall apart ho jaata hai jab neighbor ka answer kuch aisa reveal karta hai jo security camera check karne ko pointless bana deta hai aur iske bajaye ek poori tarah alag insaan se pehle poochne ki demand karta hai. Ek real detective iske bajaye ek loop mein kaam karta hai: current evidence observe karo, ye REASON karo ki ye kya suggest karta hai aur aage kya investigate karna hai, us specific lead ko pursue karke ACT karo, naya result OBSERVE karo, aur repeat karo — agla action hamesha is basis pe choose kiya jata hai ki actually abhi kya seekha gaya, ek plan nahi jo investigation shuru hone se pehle fix kiya gaya tha. ReAct loop exactly is detective ka actual working process hai, formalize kiya gaya: current situation ke baare mein reason karo, ek tool invoke karke act karo, us tool ka real result observe karo, aur wapas reasoning pe loop karo — har cycle ka action genuinely is baat pe depend karta hai ki previous cycle ne kya reveal kiya, jo exactly wo hai jo ise un tasks handle karne mein capable banata hai jinke steps advance mein nahi jaane ja sakte.',
    },

    simple: `**The ReAct loop, named precisely — this is Module 5's tool loop,
with explicit reasoning made visible at each step:**

\`\`\`
REASON — given everything so far, what does the current situation
  suggest should happen next? (This is just more generated text —
  Module 1's mechanism, nothing new.)
ACT — invoke a specific tool based on that reasoning (Module 5's
  tool-calling mechanism, unchanged).
OBSERVE — receive the tool's REAL result (Module 5, Lesson 2's
  tool_result message).
[loop back to REASON, now with the new observation as part of the
  sequence]
\`\`\`

**Making the reasoning explicit in the prompt — the same
chain-of-thought principle from Module 3, applied to tool selection:**

\`\`\`ts
const systemPrompt = \`You are a research assistant with access to tools.
For each step, first reason about what you know and what you still
need to find out, then decide which tool (if any) to use next. When
you have enough information, provide a final answer.\`;

// The model's own generated text now looks like:
// "Reasoning: I need the current stock price before I can calculate
//  the total value. I'll call get_stock_price for AAPL.
//  [tool call: get_stock_price(symbol: 'AAPL')]"
\`\`\`

**Why making reasoning explicit measurably helps, tracing directly
back to Module 3:** Module 3, Lesson 2 established that writing out
intermediate reasoning steps converts implicit, unchecked reasoning into
explicit tokens that subsequent generation (including the next tool
choice) can condition on. Applied to tool selection specifically, this
means the model's choice of WHICH tool to call next is generated while
conditioned on its own explicit reasoning about why, rather than jumping
directly to a tool call with no explicit justification — the same
accuracy improvement Module 3 demonstrated for multi-step problems,
here applied to multi-step tool use.

**Why this is a formalized NAME for an existing pattern, not a new
mechanism:**

\`\`\`
Everything in the ReAct loop is a mechanism this course already
established:
  - REASON is Module 1's next-token generation, nothing more
  - ACT is Module 5's tool calling
  - OBSERVE is Module 5, Lesson 2's tool_result message
  - The LOOP is Module 5, Lesson 2's multi-turn tool loop, with its
    exact same hard iteration cap requirement (Module 5's cost/
    reliability argument applies identically here)

"Agent" is the name given to a tool loop where the model itself decides
each step based on real observations, rather than following a
predetermined sequence a developer hardcoded in advance.
\`\`\`

**Why this reframing matters practically:** understanding that an agent
is "just" a tool loop with visible reasoning means every discipline
Module 5 established — validating tool arguments (Module 5, Lesson 3),
bounding iterations, authorizing actions — applies to agents with EQUAL
or greater force, not as an afterthought bolted onto a fundamentally
different, more mysterious kind of system.`,

    simpleHi: `**ReAct loop, precisely naam diya gaya — ye Module 5 ka tool loop
hai, har step pe explicit reasoning visible banaya gaya:**

\`\`\`
REASON — ab tak sab kuch dekhte hue, current situation kya suggest karta
  hai ki aage kya hona chahiye? (Ye sirf aur zyada generated text hai —
  Module 1 ka mechanism, kuch naya nahi.)
ACT — us reasoning ke basis pe ek specific tool invoke karo (Module 5
  ka tool-calling mechanism, unchanged).
OBSERVE — tool ka REAL result receive karo (Module 5, Lesson 2 ka
  tool_result message).
[wapas REASON pe loop karo, ab naya observation sequence ka hissa
  hote hue]
\`\`\`

**Reasoning ko prompt mein explicit banana — wahi chain-of-thought
principle Module 3 se, tool selection pe applied:**

\`\`\`ts
const systemPrompt = \`You are a research assistant with access to tools.
For each step, first reason about what you know and what you still
need to find out, then decide which tool (if any) to use next. When
you have enough information, provide a final answer.\`;

// Model ka apna generated text ab aisa dikhta hai:
// "Reasoning: I need the current stock price before I can calculate
//  the total value. I'll call get_stock_price for AAPL.
//  [tool call: get_stock_price(symbol: 'AAPL')]"
\`\`\`

**Reasoning ko explicit banana measurably kyun help karta hai, directly
Module 3 tak wapas trace hote hue:** Module 3, Lesson 2 ne establish
kiya ki intermediate reasoning steps likhna implicit, unchecked
reasoning ko explicit tokens mein convert karta hai jinpe subsequent
generation (next tool choice samet) condition kar sakta hai. Tool
selection pe specifically applied, iska matlab hai model ka ye choice ki
KAUNSA tool agla call karna hai apni khud ki explicit reasoning pe
conditioned generate hota hai ki kyun, directly ek tool call pe jump
karne ke bajaye bina explicit justification ke — wahi accuracy
improvement jo Module 3 ne multi-step problems ke liye demonstrate ki,
yahan multi-step tool use pe applied.

**Ye ek existing pattern ke liye ek formalized NAAM kyun hai, ek naya
mechanism nahi:**

\`\`\`
ReAct loop mein sab kuch ek mechanism hai jo ye course already
establish kar chuka hai:
  - REASON Module 1 ka next-token generation hai, kuch zyada nahi
  - ACT Module 5 ka tool calling hai
  - OBSERVE Module 5, Lesson 2 ka tool_result message hai
  - LOOP Module 5, Lesson 2 ka multi-turn tool loop hai, wahi exact
    hard iteration cap requirement ke saath (Module 5 ka cost/
    reliability argument yahan identically apply hota hai)

"Agent" us tool loop ko diya gaya naam hai jahan model khud har step
decide karta hai real observations ke basis pe, ek predetermined
sequence follow karne ke bajaye jo ek developer ne advance mein
hardcode kiya.
\`\`\`

**Ye reframing practically kyun matter karta hai:** ye samajhna ki ek
agent "sirf" visible reasoning ke saath ek tool loop hai matlab hai har
discipline jo Module 5 ne establish ki — tool arguments validate karna
(Module 5, Lesson 3), iterations bound karna, actions authorize karna —
agents pe EQUAL ya greater force ke saath apply hoti hai, ek afterthought
ki tarah nahi jo ek fundamentally alag, zyada mysterious kism ke system
pe bolt kiya gaya hai.`,

    content: `## Why "agent" describes a control-flow pattern, not a different
kind of model

Nothing about the model itself changes between Module 5's tool loop and
what this lesson calls an agent — it's the same model, producing
tokens via the same mechanism (Module 1), capable of the same tool
calling (Module 5). What changes is how the CALLING APPLICATION
structures the loop: a simple tool-use case might call one or two known
tools in a fixed sequence a developer wrote; an agent's loop instead
lets the model itself determine, at each iteration, which tool (if any)
to call next, based on the actual results observed so far. This is a
difference in how the surrounding system is architected, not a
difference in the underlying generative capability.

## Why explicit reasoning specifically improves tool selection, not
just general-purpose reasoning tasks

Module 3, Lesson 2 established chain-of-thought's mechanism: writing out
intermediate reasoning converts an implicit process into explicit
tokens later generation can condition on. Tool selection is a specific
case of a decision that benefits from this exact mechanism — asking the
model to reason about WHY a particular tool is the right next step
before generating the tool call itself means the tool call is generated
conditioned on that explicit justification, rather than being an
isolated decision with no visible reasoning behind it. This measurably
reduces cases where a model calls a plausible-sounding but ultimately
wrong tool for the actual situation.

## Why the loop's termination and safety properties are identical to
Module 5's, not a new consideration

An agent's ReAct loop terminates the same way Module 5's tool loop
does — when the model produces a final answer instead of another tool
call — and needs the exact same hard iteration cap for the exact same
reason: each iteration is a real, billed model call (Module 2), and an
agent that gets stuck reasoning in circles without converging would
otherwise consume cost indefinitely. Nothing about calling this pattern
"an agent" changes these underlying facts; if anything, an agent's
open-ended, model-directed step count makes the iteration cap MORE
important than in a simpler, developer-scripted tool sequence, since
there's less predictability about how many steps a given task will
actually take.

## How this reframing sets up the rest of this module

Understanding that an agent is a specific application of already-
established mechanisms — rather than a fundamentally new, more
mysterious capability — is what makes Lesson 2's multi-step tool use and
memory concepts, and Lesson 3's judgment call about when an agent is
actually the right tool, tractable rather than mystifying. Every
consideration this module raises (memory, when to use an agent at all)
builds directly on the ReAct loop's mechanics established here, which
in turn rest entirely on Module 1's generation mechanism and Module 5's
tool-calling protocol.`,

    contentHi: `## "Agent" ek control-flow pattern describe karta hai kyun, ek alag kism ka model nahi

Model ke baare mein khud kuch bhi nahi badalta Module 5 ke tool loop aur
is lesson jise agent kehta hai uske beech — ye wahi model hai, wahi
mechanism (Module 1) ke through tokens produce karte hue, wahi tool
calling (Module 5) mein capable. Jo badalta hai wo ye hai ki CALLING
APPLICATION loop ko kaise structure karta hai: ek simple tool-use case
ek ya do known tools ko ek fixed sequence mein call kar sakta hai jo ek
developer ne likha; ek agent ka loop iske bajaye model ko khud determine
karne deta hai, har iteration pe, ki kaunsa tool (agar koi ho) agla
call karna hai, ab tak observe kiye gaye actual results ke basis pe. Ye
is baat mein ek difference hai ki surrounding system kaise architected
hai, underlying generative capability mein ek difference nahi.

## Explicit reasoning specifically tool selection ko kyun improve karta hai, sirf general-purpose reasoning tasks nahi

Module 3, Lesson 2 ne chain-of-thought ka mechanism establish kiya:
intermediate reasoning likhna ek implicit process ko explicit tokens
mein convert karta hai jinpe baad ki generation condition kar sakti hai.
Tool selection ek specific case hai ek decision ka jo exactly is
mechanism se benefit karta hai — model ko ye reason karne ke liye
poochna ki KYUN ek particular tool sahi agla step hai khud tool call
generate karne se pehle matlab hai tool call us explicit justification
pe conditioned generate hota hai, ek isolated decision hone ke bajaye
jiske peeche koi visible reasoning na ho. Ye un cases ko measurably kam
karta hai jahan ek model ek plausible-sounding par ultimately galat tool
call karta hai actual situation ke liye.

## Loop ki termination aur safety properties Module 5 ke jaisi hi kyun hain, ek naya consideration nahi

Ek agent ka ReAct loop wahi tarike se terminate hota hai jaise Module 5
ka tool loop hota hai — jab model ek aur tool call ke bajaye ek final
answer produce karta hai — aur ise exactly wahi hard iteration cap
chahiye exactly wahi wajah se: har iteration ek real, billed model call
hai (Module 2), aur ek agent jo circles mein stuck ho jaata hai bina
converge kiye otherwise indefinitely cost consume karega. Is pattern ko
"ek agent" bulane se in underlying facts mein kuch nahi badalta; agar
kuch hai to, ek agent ka open-ended, model-directed step count iteration
cap ko ek simpler, developer-scripted tool sequence se ZYADA important
banata hai, kyunki is baat ke baare mein kam predictability hai ki ek
given task ko actually kitne steps lagenge.

## Ye reframing baaki module ko kaise set up karta hai

Ye samajhna ki ek agent already-established mechanisms ka ek specific
application hai — ek fundamentally naya, zyada mysterious capability
nahi — wo hai jo Lesson 2 ke multi-step tool use aur memory concepts,
aur Lesson 3 ke judgment call ko ki ek agent kab actually sahi tool hai,
tractable banata hai mystifying ke bajaye. Ye module jo bhi
consideration raise karta hai (memory, ek agent kab bilkul use karna
hai) directly yahan establish ki gayi ReAct loop ki mechanics pe build
karta hai, jo aage poori tarah Module 1 ke generation mechanism aur
Module 5 ke tool-calling protocol pe rest karta hai.`,

    examples: [
      {
        title: 'A ReAct agent with explicit reasoning visible at each step, resolving a task requiring two dependent tool calls',
        titleHi: 'Ek ReAct agent explicit reasoning ke saath har step pe visible, ek task resolve karte hue jise do dependent tool calls chahiye',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [
  {
    name: 'get_stock_price',
    description: 'Get the current stock price for a ticker symbol.',
    input_schema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
  },
  {
    name: 'get_exchange_rate',
    description: 'Get the current USD to another currency exchange rate.',
    input_schema: { type: 'object', properties: { currency: { type: 'string' } }, required: ['currency'] },
  },
];

async function getStockPrice({ symbol }) { return { symbol, priceUsd: 227.5 }; }
async function getExchangeRate({ currency }) { return { currency, rate: 83.2 }; }

const toolFunctions = { get_stock_price: getStockPrice, get_exchange_rate: getExchangeRate };

async function runReActAgent(userQuestion) {
  const systemPrompt = \`You are a financial research assistant with access to
tools. Before each tool call, briefly explain your reasoning for why
that specific tool and input are the right next step.\`;

  let messages = [{ role: 'user', content: userQuestion }];

  for (let step = 0; step < 6; step++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });
    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;

    // OBSERVE — the real result becomes part of the sequence for the
    // NEXT reasoning step
    const result = await toolFunctions[toolUse.name](toolUse.input);
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }],
    });
  }
  throw new Error('Agent exceeded maximum steps');
}

const answer = await runReActAgent(
  "What is Apple's current stock price in Indian Rupees?"
);
// The agent REASONS it needs the USD price first, ACTS by calling
// get_stock_price, OBSERVES $227.50, then REASONS it now needs the
// exchange rate, ACTS by calling get_exchange_rate, OBSERVES the
// rate, and only THEN reasons its way to a final combined answer —
// each step genuinely depends on the previous OBSERVE`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: 'get_stock_price',
    description: 'Get the current stock price for a ticker symbol.',
    input_schema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
  },
  {
    name: 'get_exchange_rate',
    description: 'Get the current USD to another currency exchange rate.',
    input_schema: { type: 'object', properties: { currency: { type: 'string' } }, required: ['currency'] },
  },
];

async function getStockPrice({ symbol }: { symbol: string }) { return { symbol, priceUsd: 227.5 }; }
async function getExchangeRate({ currency }: { currency: string }) { return { currency, rate: 83.2 }; }

const toolFunctions: Record<string, (input: any) => Promise<unknown>> = {
  get_stock_price: getStockPrice,
  get_exchange_rate: getExchangeRate,
};

async function runReActAgent(userQuestion: string): Promise<string | undefined> {
  const systemPrompt = \`You are a financial research assistant with access to
tools. Before each tool call, briefly explain your reasoning for why
that specific tool and input are the right next step.\`;

  let messages: Anthropic.MessageParam[] = [{ role: 'user', content: userQuestion }];

  for (let step = 0; step < 6; step++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
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

    // OBSERVE — the real result becomes part of the sequence for the
    // NEXT reasoning step
    const result = await toolFunctions[toolUse.name](toolUse.input);
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }],
    });
  }
  throw new Error('Agent exceeded maximum steps');
}

const answer = await runReActAgent(
  "What is Apple's current stock price in Indian Rupees?"
);
// The agent REASONS it needs the USD price first, ACTS by calling
// get_stock_price, OBSERVES $227.50, then REASONS it now needs the
// exchange rate, ACTS by calling get_exchange_rate, OBSERVES the
// rate, and only THEN reasons its way to a final combined answer —
// each step genuinely depends on the previous OBSERVE`,
        code: `for (let step = 0; step < 6; step++) {
  const response = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 1024, system: systemPrompt, tools, messages });
  messages.push({ role: 'assistant', content: response.content });
  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse) return response.content.find((b) => b.type === 'text')?.text;
  const result = await toolFunctions[toolUse.name](toolUse.input);
  messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }] });
}`,
        output:
          "The agent resolves the two-step dependency (USD price, then convert using the exchange rate) without either step being hardcoded by the developer — the model itself reasons, at each step, about what it still needs, based on the real result of the previous step, exactly the ReAct loop this lesson describes.",
        explain:
          "Nothing here is new relative to Module 5 — the tools array, the tool_result message, and the iteration cap are identical to Module 5's tool loop. What makes this an 'agent' is that the DEVELOPER never hardcoded 'call get_stock_price, then call get_exchange_rate' — the model itself determined that sequence, step by step, from its own reasoning about the observed results.",
        explainHi:
          "Yahan kuch bhi naya nahi hai Module 5 ke comparison mein — tools array, tool_result message, aur iteration cap Module 5 ke tool loop se identical hain. Ise 'agent' kya banata hai ye hai ki DEVELOPER ne kabhi hardcode nahi kiya 'get_stock_price call karo, phir get_exchange_rate call karo' — model ne khud wo sequence determine ki, step by step, observed results ke baare mein apni khud ki reasoning se.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating "agent" as requiring special new infrastructure or a
// fundamentally different API, rather than Module 5's existing pattern
async function runAgent(question) {
  // "Agents need a special agent framework" — building an elaborate,
  // custom orchestration system from scratch, duplicating Module 5's
  // tool loop under a different name with unnecessary extra complexity
}`,
        right: `// Recognizing an agent as Module 5's tool loop with the model
// itself choosing each step, reusing the exact same mechanism
async function runAgent(question) {
  let messages = [{ role: 'user', content: question }];
  for (let step = 0; step < maxSteps; step++) {
    const response = await anthropic.messages.create({ model, tools, messages });
    messages.push({ role: 'assistant', content: response.content });
    const toolUse = findToolUse(response.content);
    if (!toolUse) return extractFinalAnswer(response.content);
    const result = await executeTool(toolUse); // Module 5's validation/authorization still applies
    messages.push({ role: 'user', content: [toolResultMessage(toolUse.id, result)] });
  }
}`,
        why: "An agent doesn't require a fundamentally different mechanism — it's Module 5's tool loop, with the model itself determining each step based on real observations. Building custom infrastructure from scratch under the assumption that 'agents are different' duplicates a pattern this course already covered and risks skipping the validation/authorization discipline Module 5, Lesson 3 established.",
        whyHi:
          "Ek agent ko ek fundamentally alag mechanism ki zaroorat nahi hai — ye Module 5 ka tool loop hai, model khud har step determine karte hue real observations ke basis pe. Is assumption ke under ki 'agents alag hain' custom infrastructure scratch se banana ek pattern duplicate karta hai jo ye course already cover kar chuka hai aur validation/authorization discipline skip karne ka risk rakhta hai jo Module 5, Lesson 3 ne establish ki.",
      },
    ],

    realWorld: [
      {
        en: "A production research assistant handling open-ended questions like 'compare these three companies' recent earnings' runs a ReAct loop that decides, at each step, which company's data to fetch next and whether it needs additional context — the exact sequence of tool calls varies question to question, which is precisely why a developer-scripted fixed sequence wouldn't work, but a well-bounded agent loop does.",
        hi: 'Ek production research assistant jo open-ended questions handle karta hai jaise \'in teen companies ki recent earnings compare karo\' ek ReAct loop chalata hai jo har step pe decide karta hai ki agla kaunse company ka data fetch karna hai aur kya use additional context chahiye — tool calls ki exact sequence question se question vary karti hai, yahi exactly wajah hai ki ek developer-scripted fixed sequence kaam nahi karegi, par ek well-bounded agent loop karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "What, mechanistically, is different between an 'agent' and the tool loop covered in Module 5?",
        qHi: "'Agent' aur Module 5 mein cover kiya gaya tool loop ke beech mechanistically kya alag hai?",
        a: "Nothing about the underlying model or mechanism changes — an agent IS Module 5's tool loop. The difference is architectural: an agent's calling application lets the model itself determine, at each iteration, which tool (if any) to call next based on real observed results, rather than a developer hardcoding a fixed sequence of tool calls in advance.",
        aHi: 'Underlying model ya mechanism ke baare mein kuch nahi badalta — ek agent HAI Module 5 ka tool loop. Difference architectural hai: ek agent ki calling application model ko khud determine karne deti hai, har iteration pe, ki kaunsa tool (agar koi ho) agla call karna hai real observed results ke basis pe, ek developer ke advance mein tool calls ki ek fixed sequence hardcode karne ke bajaye.',
      },
      {
        q: 'Why does making the reasoning behind each tool choice explicit (rather than jumping directly to a tool call) improve an agent\'s reliability?',
        qHi: 'Har tool choice ke peeche reasoning ko explicit banana (directly ek tool call pe jump karne ke bajaye) ek agent ki reliability ko kyun improve karta hai?',
        a: "This directly applies Module 3's chain-of-thought mechanism: writing out reasoning converts an implicit decision process into explicit tokens that the subsequent tool call is then generated conditioned on. This measurably reduces cases where a model selects a plausible-sounding but ultimately wrong tool, the same accuracy benefit Module 3 demonstrated for multi-step problems in general.",
        aHi: 'Ye directly Module 3 ke chain-of-thought mechanism ko apply karta hai: reasoning likhna ek implicit decision process ko explicit tokens mein convert karta hai jinpe subsequent tool call phir conditioned generate hota hai. Ye un cases ko measurably kam karta hai jahan ek model ek plausible-sounding par ultimately galat tool select karta hai, wahi accuracy benefit jo Module 3 ne general mein multi-step problems ke liye demonstrate kiya.',
      },
    ],

    exercises: [
      {
        task: "A developer building their first agent asks whether they need a completely different validation and authorization approach than what Module 5 covered, since 'agents are a different kind of system.' Using this lesson's reasoning, explain why Module 5's discipline applies unchanged, and if anything, with greater importance.",
        taskHi: 'Ek developer jo apna pehla agent bana raha hai poochta hai ki kya use Module 5 ne cover kiya usse poori tarah alag validation aur authorization approach chahiye, kyunki \'agents ek alag kism ka system hain.\' Is lesson ki reasoning use karke, explain karo ki Module 5 ki discipline unchanged kyun apply hoti hai, aur agar kuch hai to, greater importance ke saath.',
        hint: "Revisit what genuinely changes (who decides the next step) versus what stays exactly the same (the tool-calling mechanism, the need to validate and authorize every action) between a scripted tool sequence and an agent.",
        hintHi: 'Revisit karo ki genuinely kya badalta hai (agla step kaun decide karta hai) versus kya bilkul wahi rehta hai (tool-calling mechanism, har action validate aur authorize karne ki zaroorat) ek scripted tool sequence aur ek agent ke beech.',
      },
    ],

    keyTakeaways: [
      "An 'agent' is not a new model capability — it's Module 5's tool loop, architected so the model itself decides each step based on real observed results rather than a developer-hardcoded sequence.",
      "The ReAct loop (Reason, Act, Observe) names this pattern precisely: REASON is Module 1's generation, ACT is Module 5's tool calling, OBSERVE is Module 5's tool_result message, and the loop is Module 5's multi-turn tool loop.",
      "Making reasoning explicit before each tool call directly applies Module 3's chain-of-thought mechanism to tool selection, measurably improving the reliability of which tool is chosen.",
      "Module 5's safety disciplines (validation, authorization, hard iteration caps) apply to agents with equal or greater force, since an agent's model-directed, unpredictable step count makes these safeguards more important, not less.",
    ],
    keyTakeawaysHi: [
      'Ek "agent" ek nayi model capability nahi hai — ye Module 5 ka tool loop hai, is tarike se architected ki model khud har step decide karta hai real observed results ke basis pe, ek developer-hardcoded sequence ke bajaye.',
      'ReAct loop (Reason, Act, Observe) is pattern ko precisely naam deta hai: REASON Module 1 ka generation hai, ACT Module 5 ka tool calling hai, OBSERVE Module 5 ka tool_result message hai, aur loop Module 5 ka multi-turn tool loop hai.',
      'Har tool call se pehle reasoning ko explicit banana directly Module 3 ke chain-of-thought mechanism ko tool selection pe apply karta hai, kaunsa tool choose hota hai uski reliability ko measurably improve karte hue.',
      'Module 5 ki safety disciplines (validation, authorization, hard iteration caps) agents pe equal ya greater force ke saath apply hoti hain, kyunki ek agent ka model-directed, unpredictable step count in safeguards ko zyada important banata hai, kam nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-multi-step-tool-use-and-agent-memory',
    title: 'Multi-Step Tool Use & Agent Memory',
    titleHi: 'Multi-Step Tool Use Aur Agent Memory',
    description:
      "Extending the ReAct loop to genuinely complex, multi-step tasks, and the two kinds of memory an agent needs to handle them: short-term (within one run, already covered by the growing message array) and long-term (persisted across separate runs, which needs a genuinely different mechanism).",
    descriptionHi:
      'ReAct loop ko genuinely complex, multi-step tasks tak extend karna, aur do kism ki memory jo ek agent ko unhe handle karne ke liye chahiye: short-term (ek run ke andar, jo already growing message array se cover hoti hai) aur long-term (separate runs ke across persisted, jise genuinely ek alag mechanism chahiye).',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A employee's working notes for the task in front of them right now versus their accumulated knowledge from months of experience at the company, written down in a shared team wiki.** While working on today's specific task, an employee keeps informal working notes — what they've tried, what they've learned so far this morning — that are genuinely useful for finishing THIS task but get thrown away once it's done; nobody expects those scratch notes to matter next month. Separately, genuinely important, reusable knowledge (how a particular client prefers to be communicated with, a recurring gotcha in a specific system) gets written into a shared wiki specifically so it survives past today and helps on a completely different task next month. An agent has exactly this same two-tier need: short-term memory is the growing message array within one run (Module 1's sequence, Module 5's tool loop) — genuinely useful for completing the current task, and correctly discarded once it's done. Long-term memory is a genuinely separate mechanism (typically embeddings and retrieval — Modules 7-8's RAG, applied to the agent's own past experience) that persists specific, reusable facts across entirely separate runs, the same way a wiki entry outlives any single day's work.",
      hi: 'Ek employee ke apne saamne wale task ke liye working notes versus company mein months ke experience se accumulated knowledge, ek shared team wiki mein likhi gayi. Aaj ke specific task pe kaam karte waqt, ek employee informal working notes rakhta hai — kya try kiya, is subah ab tak kya seekha — jo IS task ko finish karne ke liye genuinely useful hain par ek baar ho jaane ke baad phenk di jaati hain; koi expect nahi karta ki wo scratch notes agle mahine matter karengi. Separately, genuinely important, reusable knowledge (ek particular client kaise communicate kiye jaane ko prefer karta hai, ek specific system mein ek recurring gotcha) ek shared wiki mein likhi jaati hai specifically taaki ye aaj se pare survive kare aur agle mahine ek poori tarah alag task mein help kare. Ek agent ko exactly yahi two-tier need hai: short-term memory ek run ke andar badhta hua message array hai (Module 1 ki sequence, Module 5 ka tool loop) — current task complete karne ke liye genuinely useful, aur ek baar ho jaane ke baad correctly discarded. Long-term memory ek genuinely separate mechanism hai (typically embeddings aur retrieval — Modules 7-8 ka RAG, agent ke apne past experience pe applied) jo specific, reusable facts ko poori tarah separate runs ke across persist karta hai, wahi tarike se jaise ek wiki entry kisi bhi single din ke kaam se aage jeeti hai.',
    },

    simple: `**Short-term memory — already fully covered, nothing new to
learn:**

\`\`\`ts
// This IS short-term memory — the growing messages array within ONE
// run of the agent (Module 5, Lesson 2's multi-turn tool loop)
let messages = [{ role: 'user', content: userQuestion }];
// ... every reasoning step, tool call, and observation gets appended
// here, and the model conditions on ALL of it (Module 1) ...
// Once the run ends, this array is (correctly) discarded — nothing
// here needs a new mechanism.
\`\`\`

**Long-term memory — a genuinely different mechanism, needed for
information that must survive PAST a single run:**

\`\`\`ts
// A separate storage step: after a run completes, extract and persist
// specific, reusable facts — NOT the entire conversation transcript
async function saveMemory(fact) {
  const embedding = await embed(fact); // Module 7's embedding mechanism
  await pool.query(
    'INSERT INTO agent_memories (fact, embedding) VALUES ($1, $2)',
    [fact, JSON.stringify(embedding)],
  );
}

// At the START of a NEW, separate run, retrieve relevant past memories
// — Module 8's RAG pipeline, applied to the agent's own accumulated
// experience instead of a static document knowledge base
async function loadRelevantMemories(currentTask) {
  const queryEmbedding = await embed(currentTask);
  const { rows } = await pool.query(
    'SELECT fact FROM agent_memories ORDER BY embedding <=> $1 LIMIT 5',
    [JSON.stringify(queryEmbedding)],
  );
  return rows.map((r) => r.fact);
}

async function runAgentWithMemory(userQuestion) {
  const relevantMemories = await loadRelevantMemories(userQuestion);
  const systemPrompt = \`You are an assistant with access to tools.
Relevant facts from past interactions:
\${relevantMemories.join('\\n')}\`;
  // ... the rest of the ReAct loop proceeds as in Lesson 1, now with
  // relevant long-term context available from the very first step
}
\`\`\`

**Why long-term memory genuinely needs Modules 7-8's mechanism, not
just "a longer conversation history":** Module 1 established a hard
context window limit — you cannot simply keep appending every past
run's entire transcript forever and expect it to fit. Long-term memory
instead treats past experience the exact same way Module 7-8 treats any
knowledge base: extract specific, reusable facts, embed them, and
retrieve only the SPECIFIC, relevant ones for the current task — the
identical RAG pattern, just applied to an agent's own history instead of
external documents.

**Why deciding WHAT to persist as long-term memory is a genuine design
decision, not automatic:** naively persisting every detail of every run
(the equivalent of a wiki containing someone's raw, unedited daily
scratch notes) recreates the same problems Module 7's chunking lesson
identified — an unfiltered, undifferentiated memory store is hard to
search precisely and full of irrelevant noise. A well-designed agent
extracts and persists specific, genuinely reusable facts ("this
customer prefers email over phone," not "on Tuesday I called tool X with
argument Y") — the same "meaningful unit, not arbitrary raw content"
principle Module 7 established for chunking, applied here to what's
worth remembering long-term.

**Why multi-step tasks stress-test both memory types together:** a
genuinely complex task (planning a multi-city trip, researching a
multi-part question) might run for many ReAct iterations (Lesson 1),
relying entirely on short-term memory within that run, while also
benefiting from long-term memory established in previous runs (a
returning user's known preferences) informing how the current run's
reasoning unfolds from its very first step.`,

    simpleHi: `**Short-term memory — already poori tarah cover kiya gaya, seekhne
ke liye kuch naya nahi:**

\`\`\`ts
// Ye HAI short-term memory — EK run ke andar badhta hua messages array
// (Module 5, Lesson 2 ka multi-turn tool loop)
let messages = [{ role: 'user', content: userQuestion }];
// ... har reasoning step, tool call, aur observation yahan append ho
// jata hai, aur model in SAB PE condition karta hai (Module 1) ...
// Ek baar run khatam hone ke baad, ye array (correctly) discarded ho
// jata hai — yahan kuch bhi ek naya mechanism nahi chahiye.
\`\`\`

**Long-term memory — ek genuinely alag mechanism, us information ke
liye chahiye jise ek single run se AAGE survive karna hai:**

\`\`\`ts
// Ek separate storage step: ek run complete hone ke baad, specific,
// reusable facts extract aur persist karo — POORI conversation
// transcript NAHI
async function saveMemory(fact) {
  const embedding = await embed(fact); // Module 7 ka embedding mechanism
  await pool.query(
    'INSERT INTO agent_memories (fact, embedding) VALUES ($1, $2)',
    [fact, JSON.stringify(embedding)],
  );
}

// Ek NAYE, separate run ke START pe, relevant past memories retrieve
// karo — Module 8 ka RAG pipeline, agent ke apne accumulated experience
// pe applied ek static document knowledge base ke bajaye
async function loadRelevantMemories(currentTask) {
  const queryEmbedding = await embed(currentTask);
  const { rows } = await pool.query(
    'SELECT fact FROM agent_memories ORDER BY embedding <=> $1 LIMIT 5',
    [JSON.stringify(queryEmbedding)],
  );
  return rows.map((r) => r.fact);
}

async function runAgentWithMemory(userQuestion) {
  const relevantMemories = await loadRelevantMemories(userQuestion);
  const systemPrompt = \`You are an assistant with access to tools.
Relevant facts from past interactions:
\${relevantMemories.join('\\n')}\`;
  // ... baaki ReAct loop Lesson 1 ki tarah proceed karta hai, ab bilkul
  // pehle step se relevant long-term context available ke saath
}
\`\`\`

**Long-term memory ko genuinely Modules 7-8 ka mechanism kyun chahiye,
sirf "ek lambi conversation history" nahi:** Module 1 ne ek hard context
window limit establish kiya — aap simply har past run ka poora
transcript hamesha ke liye append karte nahi ja sakte aur ummid nahi kar
sakte ki ye fit ho jaayega. Long-term memory iske bajaye past experience
ko exactly wahi tarike se treat karta hai jaise Module 7-8 kisi bhi
knowledge base ko treat karta hai: specific, reusable facts extract
karo, unhe embed karo, aur sirf current task ke liye SPECIFIC, relevant
wale retrieve karo — identical RAG pattern, sirf external documents ke
bajaye ek agent ki apni history pe applied.

**Long-term memory ki tarah kya persist karna hai decide karna ek
genuine design decision kyun hai, automatic nahi:** naively har run ki
har detail persist karna (kisi ke raw, unedited daily scratch notes wale
ek wiki ke equivalent) wahi problems recreate karta hai jise Module 7 ke
chunking lesson ne identify kiya — ek unfiltered, undifferentiated
memory store precisely search karna mushkil hai aur irrelevant noise se
bhara hai. Ek well-designed agent specific, genuinely reusable facts
extract aur persist karta hai ("ye customer phone se zyada email
prefer karta hai," "Tuesday ko maine tool X ko argument Y ke saath call
kiya" nahi) — wahi "meaningful unit, arbitrary raw content nahi"
principle jo Module 7 ne chunking ke liye establish kiya, yahan is baat
pe applied ki long-term kya yaad rakhne layak hai.

**Multi-step tasks dono memory types ko saath mein kyun stress-test
karte hain:** ek genuinely complex task (ek multi-city trip plan karna,
ek multi-part question research karna) many ReAct iterations (Lesson 1)
ke liye chal sakta hai, us run ke andar poori tarah short-term memory pe
rely karte hue, jabki previous runs mein established long-term memory
se bhi benefit karte hue (ek returning user ki known preferences) jo
current run ki reasoning ko uske bilkul pehle step se inform karta hai.`,

    content: `## Why short-term memory needs no new mechanism, but is worth
naming explicitly

Module 5, Lesson 2 already established that a tool loop's growing
message array is what gives a multi-turn interaction coherence within
one run. Naming this "short-term memory" in the context of agents
doesn't introduce anything new mechanically — it clarifies scope: this
memory is scoped to one run, correctly discarded afterward, and entirely
sufficient for tasks whose relevant context all originates within that
single run. Recognizing this explicitly prevents a common confusion:
assuming an agent needs a special "memory system" for something Module
5's existing message array already handles completely.

## Why long-term memory is a genuinely different problem, requiring
Modules 7-8's mechanism rather than a bigger context window

Module 1 established the context window as a hard, finite limit — no
amount of context window size lets you simply concatenate every past
run's full transcript and expect it to fit indefinitely as an agent
accumulates more and more history. Long-term memory instead applies
exactly the RAG pattern Modules 7-8 developed: treat accumulated past
experience as a knowledge base, extract and embed specific reusable
facts, and retrieve only the relevant few for the CURRENT task, rather
than attempting to include everything. This is not a new capability;
it's Module 7-8's retrieval mechanism applied to a genuinely different
source — an agent's own history instead of external documents.

## Why deciding what to persist is a genuine design decision that
mirrors Module 7's chunking lesson

Persisting raw, unfiltered detail from every run (full transcripts,
every intermediate reasoning step) recreates the exact problem Module
7, Lesson 3 identified with poorly-chunked documents: an
undifferentiated blob that's hard to search precisely and dilutes
genuinely useful signal with noise. A well-designed long-term memory
system extracts specific, meaningful, reusable facts — closer to a
well-chunked document's coherent units of meaning than a firehose of raw
transcript — which is a deliberate design choice with real consequences
for how useful the memory actually is when retrieved later, not an
automatic byproduct of simply logging everything.

## How this connects to Lesson 3's judgment call about when an agent
is warranted at all

Both memory types add genuine complexity: short-term memory management
means bounding and structuring a growing message array correctly across
potentially many ReAct iterations (Lesson 1); long-term memory means
building and maintaining a genuinely separate retrieval pipeline. Lesson
3 covers when this complexity is actually warranted by the task at hand
versus when a simpler, non-agentic approach would serve the same need
with far less engineering investment — understanding what these memory
mechanisms actually cost to build and maintain is a necessary input to
that judgment call, not a reason to add them reflexively to every
system.`,

    contentHi: `## Short-term memory ko koi naya mechanism kyun nahi chahiye, par ise explicitly naam dena worth kyun hai

Module 5, Lesson 2 ne already establish kiya ki ek tool loop ka badhta
hua message array wo hai jo ek multi-turn interaction ko ek run ke andar
coherence deta hai. Ise agents ke context mein "short-term memory" naam
dena mechanically kuch naya introduce nahi karta — ye scope clarify
karta hai: ye memory ek run tak scoped hai, baad mein correctly
discarded, aur un tasks ke liye poori tarah sufficient hai jinka relevant
context sab wahi single run ke andar originate hota hai. Ise explicitly
recognize karna ek common confusion prevent karta hai: assume karna ki
ek agent ko kisi cheez ke liye ek special "memory system" chahiye jise
Module 5 ka existing message array already poori tarah handle karta
hai.

## Long-term memory ek genuinely alag problem kyun hai, ek bade context window ke bajaye Modules 7-8 ka mechanism chahne wala

Module 1 ne context window ko ek hard, finite limit ki tarah establish
kiya — koi bhi context window size aapko simply har past run ka poora
transcript concatenate karne nahi deta aur ummid karne nahi deta ki ye
indefinitely fit hoga jaise ek agent zyada se zyada history accumulate
karta hai. Long-term memory iske bajaye exactly wo RAG pattern apply
karta hai jise Modules 7-8 ne develop kiya: accumulated past experience
ko ek knowledge base ki tarah treat karo, specific reusable facts
extract aur embed karo, aur CURRENT task ke liye sirf relevant kuch
retrieve karo, sab kuch include karne ki koshish karne ke bajaye. Ye ek
nayi capability nahi hai; ye Module 7-8 ka retrieval mechanism hai ek
genuinely alag source pe applied — ek agent ki apni history external
documents ke bajaye.

## Kya persist karna hai decide karna ek genuine design decision kyun hai jo Module 7 ke chunking lesson ko mirror karta hai

Har run se raw, unfiltered detail persist karna (poore transcripts, har
intermediate reasoning step) exactly wahi problem recreate karta hai
jise Module 7, Lesson 3 ne poorly-chunked documents ke saath identify
kiya: ek undifferentiated blob jo precisely search karna mushkil hai aur
genuinely useful signal ko noise se dilute karta hai. Ek well-designed
long-term memory system specific, meaningful, reusable facts extract
karta hai — ek well-chunked document ke coherent units of meaning ke
zyada close ek raw transcript ke firehose se — jo ek deliberate design
choice hai real consequences ke saath ki memory baad mein retrieve hone
pe actually kitni useful hai, sab kuch log karne ka ek automatic
byproduct nahi.

## Ye Lesson 3 ke judgment call se kaise connect hota hai ki ek agent kab bilkul warranted hai

Dono memory types genuine complexity add karte hain: short-term memory
management ka matlab hai potentially kai ReAct iterations (Lesson 1) ke
across ek badhte hue message array ko correctly bound aur structure
karna; long-term memory ka matlab hai ek genuinely separate retrieval
pipeline build aur maintain karna. Lesson 3 cover karta hai ki ye
complexity actually kab given task se warranted hai versus kab ek
simpler, non-agentic approach wahi need ko kaafi kam engineering
investment ke saath serve karega — ye samajhna ki ye memory mechanisms
actually build aur maintain karne mein kya cost karte hain us judgment
call ke liye ek zaroori input hai, unhe har system mein reflexively add
karne ki wajah nahi.`,

    examples: [
      {
        title: 'An agent using both short-term (within-run) memory and long-term (cross-run) memory together',
        titleHi: 'Ek agent dono short-term (within-run) memory aur long-term (cross-run) memory ko saath use karte hue',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { Pool } from 'pg';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function embed(text) {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

// LONG-TERM memory — persists across separate runs
async function loadRelevantMemories(task, userId) {
  const queryEmbedding = await embed(task);
  const { rows } = await pool.query(
    \`SELECT fact FROM agent_memories WHERE user_id = $1
     ORDER BY embedding <=> $2 LIMIT 5\`,
    [userId, JSON.stringify(queryEmbedding)],
  );
  return rows.map((r) => r.fact);
}

async function saveMemory(fact, userId) {
  const embedding = await embed(fact);
  await pool.query(
    'INSERT INTO agent_memories (user_id, fact, embedding) VALUES ($1, $2, $3)',
    [userId, fact, JSON.stringify(embedding)],
  );
}

async function runAgent(userQuestion, userId) {
  const memories = await loadRelevantMemories(userQuestion, userId);

  // SHORT-TERM memory — the messages array, scoped to THIS run only
  let messages = [{ role: 'user', content: userQuestion }];
  const systemPrompt = \`Relevant facts from past interactions with this
user:\n\${memories.join('\\n')}\`;

  for (let step = 0; step < 8; step++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5', max_tokens: 1024, system: systemPrompt, tools, messages,
    });
    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) {
      const finalAnswer = response.content.find((b) => b.type === 'text')?.text;
      // After the run, extract and persist a NEW long-term memory if warranted
      await saveMemory(\`User asked about: \${userQuestion}. Preference noted: prefers concise answers.\`, userId);
      return finalAnswer;
    }
    const result = await executeTool(toolUse);
    messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }] });
  }
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { Pool } from 'pg';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

// LONG-TERM memory — persists across separate runs
async function loadRelevantMemories(task: string, userId: string): Promise<string[]> {
  const queryEmbedding = await embed(task);
  const { rows } = await pool.query(
    \`SELECT fact FROM agent_memories WHERE user_id = $1
     ORDER BY embedding <=> $2 LIMIT 5\`,
    [userId, JSON.stringify(queryEmbedding)],
  );
  return rows.map((r: { fact: string }) => r.fact);
}

async function saveMemory(fact: string, userId: string): Promise<void> {
  const embedding = await embed(fact);
  await pool.query(
    'INSERT INTO agent_memories (user_id, fact, embedding) VALUES ($1, $2, $3)',
    [userId, fact, JSON.stringify(embedding)],
  );
}

async function runAgent(userQuestion: string, userId: string): Promise<string | undefined> {
  const memories = await loadRelevantMemories(userQuestion, userId);

  // SHORT-TERM memory — the messages array, scoped to THIS run only
  let messages: Anthropic.MessageParam[] = [{ role: 'user', content: userQuestion }];
  const systemPrompt = \`Relevant facts from past interactions with this
user:\n\${memories.join('\\n')}\`;

  for (let step = 0; step < 8; step++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5', max_tokens: 1024, system: systemPrompt, tools, messages,
    });
    messages.push({ role: 'assistant', content: response.content });

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );
    if (!toolUse) {
      const finalAnswer = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === 'text',
      )?.text;
      // After the run, extract and persist a NEW long-term memory if warranted
      await saveMemory(\`User asked about: \${userQuestion}. Preference noted: prefers concise answers.\`, userId);
      return finalAnswer;
    }
    const result = await executeTool(toolUse);
    messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }] });
  }
}`,
        code: `const memories = await loadRelevantMemories(userQuestion, userId); // LONG-TERM
let messages = [{ role: 'user', content: userQuestion }]; // SHORT-TERM, this run only
// ... ReAct loop using both ...
await saveMemory(newFact, userId); // persisted for FUTURE runs`,
        output:
          "A returning user's second conversation, days later, begins with the agent already aware ('prefers concise answers') from the FIRST conversation's persisted memory, while the actual tool-use reasoning within this new conversation builds its own fresh short-term message array from scratch.",
        explain:
          "The two memory types are genuinely independent: `messages` never survives past this function call (short-term, scoped to one run), while `agent_memories` in the database survives indefinitely across completely separate invocations (long-term, retrieved fresh at the start of each new run) — exactly the two-tier structure this lesson establishes.",
        explainHi:
          "Do memory types genuinely independent hain: `messages` is function call se aage kabhi survive nahi karta (short-term, ek run tak scoped), jabki database mein `agent_memories` poori tarah separate invocations ke across indefinitely survive karta hai (long-term, har naye run ke start pe fresh retrieved) — exactly wo two-tier structure jise ye lesson establish karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Persisting the ENTIRE raw conversation transcript as "long-term memory"
async function saveMemory(messages, userId) {
  await pool.query(
    'INSERT INTO agent_memories (user_id, raw_transcript) VALUES ($1, $2)',
    [userId, JSON.stringify(messages)], // the WHOLE conversation, unfiltered
  );
  // Every future run now has to search through an ever-growing pile of
  // raw transcripts to find anything useful — the same undifferentiated-
  // blob problem Module 7 identified with poorly chunked documents
}`,
        right: `// Extracting and persisting specific, reusable facts only
async function saveMemory(userQuestion, finalAnswer, userId) {
  const extractedFact = await summarizeToReusableFact(userQuestion, finalAnswer);
  // e.g. "User prefers metric units" or "User's account is on the Pro plan"
  const embedding = await embed(extractedFact);
  await pool.query(
    'INSERT INTO agent_memories (user_id, fact, embedding) VALUES ($1, $2, $3)',
    [userId, extractedFact, JSON.stringify(embedding)],
  );
}`,
        why: "Persisting entire raw transcripts recreates the same problem Module 7's chunking lesson identified with unstructured content — an undifferentiated store that's hard to search precisely and dilutes genuinely useful, reusable signal with irrelevant noise. Extracting specific, meaningful facts (mirroring good chunking practice) keeps long-term memory actually useful when retrieved later.",
        whyHi:
          "Poore raw transcripts persist karna wahi problem recreate karta hai jise Module 7 ke chunking lesson ne unstructured content ke saath identify kiya — ek undifferentiated store jo precisely search karna mushkil hai aur genuinely useful, reusable signal ko irrelevant noise se dilute karta hai. Specific, meaningful facts extract karna (good chunking practice ko mirror karte hue) long-term memory ko baad mein retrieve hone pe actually useful rakhta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production customer-support agent extracts and persists specific, reusable facts after each conversation ('this customer's account uses SSO, don't suggest password resets'), retrieving only the relevant few facts at the start of a NEW conversation weeks later — rather than replaying the customer's entire previous conversation transcript, which would waste context window budget on mostly-irrelevant detail.",
        hi: 'Ek production customer-support agent har conversation ke baad specific, reusable facts extract aur persist karta hai (\'is customer ka account SSO use karta hai, password resets suggest mat karo\'), hafton baad ek NAYI conversation ke start pe sirf relevant kuch facts retrieve karte hue — customer ki poori previous conversation transcript replay karne ke bajaye, jo mostly-irrelevant detail pe context window budget waste karega.',
      },
    ],

    interviewQA: [
      {
        q: "Why doesn't an agent's short-term memory require any new mechanism beyond what Module 5 already covered?",
        qHi: 'Ek agent ki short-term memory ko Module 5 ne already cover kiye jo hai uske pare koi naya mechanism kyun nahi chahiye?',
        a: "Short-term memory is simply the growing message array within one run of a tool loop, which Module 5, Lesson 2 already established — the model conditions on this entire array (Module 1), and it's correctly discarded once the run ends. Naming it 'short-term memory' in the agent context clarifies scope but doesn't introduce a new mechanism.",
        aHi: 'Short-term memory simply ek tool loop ke ek run ke andar badhta hua message array hai, jo Module 5, Lesson 2 ne already establish kiya — model is poore array pe condition karta hai (Module 1), aur ye run khatam hone ke baad correctly discarded ho jata hai. Ise agent context mein "short-term memory" naam dena scope clarify karta hai par ek naya mechanism introduce nahi karta.',
      },
      {
        q: "Why does long-term memory need Modules 7-8's RAG mechanism specifically, rather than just a larger context window?",
        qHi: 'Long-term memory ko specifically Modules 7-8 ka RAG mechanism kyun chahiye, sirf ek bada context window nahi?',
        a: "Module 1 established the context window as a hard, finite limit — you cannot simply keep appending every past run's full history and expect it to always fit. Long-term memory applies RAG's exact pattern instead: extract and embed specific reusable facts, then retrieve only the relevant few for the current task, rather than including everything, which is the same solution Modules 7-8 developed for any large knowledge base.",
        aHi: 'Module 1 ne context window ko ek hard, finite limit ki tarah establish kiya — aap simply har past run ki poori history append karte nahi ja sakte aur ummid nahi kar sakte ki ye hamesha fit ho. Long-term memory iske bajaye RAG ka exact pattern apply karta hai: specific reusable facts extract aur embed karo, phir current task ke liye sirf relevant kuch retrieve karo, sab kuch include karne ke bajaye, jo wahi solution hai jo Modules 7-8 ne kisi bhi bade knowledge base ke liye develop kiya.',
      },
    ],

    exercises: [
      {
        task: "A team builds an agent that saves its entire raw message transcript to a database after every run, calling this 'long-term memory.' Six months later, retrieval from this memory store is slow and often returns irrelevant results. Diagnose the cause using this lesson's reasoning, and describe the fix.",
        taskHi: 'Ek team ek agent banati hai jo har run ke baad apna poora raw message transcript ek database mein save karta hai, ise \'long-term memory\' bulate hue. Chhe mahine baad, is memory store se retrieval slow hai aur aksar irrelevant results return karta hai. Is lesson ki reasoning use karke cause diagnose karo, aur fix describe karo.',
        hint: "Revisit this lesson's parallel to Module 7's chunking lesson — what happens when a store is filled with undifferentiated, unfiltered raw content rather than specific, meaningful units?",
        hintHi: 'Is lesson ke Module 7 ke chunking lesson se parallel ko revisit karo — kya hota hai jab ek store undifferentiated, unfiltered raw content se bhara hota hai specific, meaningful units ke bajaye?',
      },
    ],

    keyTakeaways: [
      "Short-term memory is simply the growing message array within one agent run (Module 5's tool loop) — it requires no new mechanism, and is correctly discarded once the run ends.",
      "Long-term memory, which must survive across separate runs, cannot rely on an ever-larger context window (Module 1's hard limit) — it instead applies Modules 7-8's RAG mechanism to the agent's own accumulated experience.",
      "Deciding what to persist as long-term memory is a genuine design decision, mirroring Module 7's chunking lesson: extracting specific, meaningful, reusable facts (not raw transcripts) keeps the memory store precisely searchable and useful.",
      "Both memory mechanisms add real engineering complexity, which Lesson 3 weighs against a task's actual needs when deciding whether an agent is warranted at all.",
    ],
    keyTakeawaysHi: [
      'Short-term memory simply ek agent run (Module 5 ka tool loop) ke andar badhta hua message array hai — ise koi naya mechanism nahi chahiye, aur run khatam hone ke baad correctly discarded ho jata hai.',
      'Long-term memory, jise separate runs ke across survive karna hai, ek ever-larger context window (Module 1 ki hard limit) pe rely nahi kar sakta — ye iske bajaye Modules 7-8 ka RAG mechanism agent ke apne accumulated experience pe apply karta hai.',
      'Long-term memory ki tarah kya persist karna hai decide karna ek genuine design decision hai, Module 7 ke chunking lesson ko mirror karte hue: specific, meaningful, reusable facts extract karna (raw transcripts nahi) memory store ko precisely searchable aur useful rakhta hai.',
      'Dono memory mechanisms real engineering complexity add karte hain, jise Lesson 3 ek task ki actual needs ke against weigh karta hai ye decide karte waqt ki kya ek agent bilkul warranted hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-when-a-chain-beats-an-agent',
    title: 'When a Simple Chain Beats an Agent',
    titleHi: 'Ek Simple Chain Ek Agent Se Kab Behtar Hota Hai',
    description:
      "Closing this module with the practical judgment call: an agent's open-ended, model-directed loop is powerful specifically for genuinely unpredictable tasks — and genuinely the wrong, more expensive, less reliable choice for tasks whose steps are actually knowable in advance.",
    descriptionHi:
      'Is module ko practical judgment call ke saath close karte hue: ek agent ka open-ended, model-directed loop specifically un tasks ke liye powerful hai jo genuinely unpredictable hain — aur genuinely galat, zyada expensive, kam reliable choice hai un tasks ke liye jinke steps actually advance mein knowable hain.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**Hiring a skilled, adaptable consultant to figure out a genuinely novel problem from scratch, versus running a well-tested assembly line for a product you make the same way every single day.** A consultant's genuine value is their ability to reason through a problem nobody has precisely solved before, adapting their approach as they learn more — invaluable for a truly novel situation, but a wildly expensive and unpredictable way to, say, assemble the one thousandth identical unit of a product whose exact steps have been known and fixed for years. An assembly line's fixed, predetermined sequence is exactly right for that repeated, well-understood task — faster, cheaper, and more predictable than asking a skilled consultant to reason through \"how should I assemble this\" from first principles every single time, when the answer is always identical. An agent is the consultant: valuable specifically when a task's steps genuinely cannot be known until execution reveals them. A simple, fixed chain of calls (this lesson's alternative) is the assembly line: right when a task's steps ARE knowable in advance, where an agent's flexibility is paying for adaptability nobody actually needs, at a real cost in latency, unpredictability, and token spend.",
      hi: 'Ek skilled, adaptable consultant ko hire karna ek genuinely novel problem ko scratch se figure out karne ke liye, versus ek well-tested assembly line chalana ek product ke liye jise aap har single din wahi tarike se banate ho. Ek consultant ki genuine value unki ability hai ek problem ke through reason karne ki jise pehle kisi ne precisely solve nahi kiya, apna approach adapt karte hue jaise wo zyada seekhte hain — ek truly novel situation ke liye invaluable, par ek wildly expensive aur unpredictable tareeka hai, jaise, ek product ki ek thousandth identical unit assemble karne ka jiske exact steps years se known aur fixed hain. Ek assembly line ki fixed, predetermined sequence exactly right hai us repeated, well-understood task ke liye — ek skilled consultant se "main ise kaise assemble karoon" first principles se reason karwane se faster, cheaper, aur zyada predictable, jab answer hamesha identical hota hai. Ek agent consultant hai: specifically valuable jab ek task ke steps genuinely tab tak nahi jaane ja sakte jab tak execution unhe reveal na kare. Calls ki ek simple, fixed chain (is lesson ka alternative) assembly line hai: sahi jab ek task ke steps advance mein knowable HAIN, jahan ek agent ki flexibility ek aisi adaptability ke liye pay kar rahi hai jo kisi ko actually chahiye hi nahi, latency, unpredictability, aur token spend mein ek real cost pe.',
    },

    simple: `**A simple chain — a fixed, developer-written sequence of calls,
no model-directed branching:**

\`\`\`ts
// The developer already knows EXACTLY what steps this task needs —
// there is no genuine uncertainty for a model to reason through
async function generateWeeklyReport(userId) {
  const salesData = await fetchSalesData(userId);       // step 1, always
  const summary = await summarizeWithModel(salesData);   // step 2, always
  const formattedReport = await formatAsMarkdown(summary); // step 3, always
  await emailReport(userId, formattedReport);             // step 4, always
  // Every run does EXACTLY these four steps, in this exact order —
  // there is nothing for an agent's open-ended loop to figure out
}
\`\`\`

**An agent — warranted specifically when the steps genuinely can't be
known in advance:**

\`\`\`ts
// The actual steps needed genuinely depend on what's discovered along
// the way — a fixed sequence CANNOT be written in advance
async function researchAndAnswer(question) {
  // "Compare the top 3 cloud providers' pricing for my specific
  // workload" — the agent doesn't know in advance which providers'
  // documentation it'll need to check, how many pricing tiers are
  // relevant, or whether it needs to look up current exchange rates —
  // these are only discovered DURING execution
  return await runReActAgent(question); // Lesson 1's loop
}
\`\`\`

**The decision test this lesson establishes:**

\`\`\`
Ask: "Do I, the developer, already know the exact sequence of steps
this task needs, regardless of what any individual run's data turns
out to be?"

YES, I know the fixed sequence -> Use a simple chain
  - Faster (no reasoning-about-what-to-do-next overhead)
  - Cheaper (fewer, more predictable model calls — Module 2's cost math)
  - More reliable (no risk of the model choosing a wrong or unnecessary
    step, or looping past a sensible stopping point)
  - Easier to test and debug (Module 14 covers this) — a fixed
    sequence's behavior is far more predictable to verify

NO, the actual needed steps depend on what's discovered along the way
  -> An agent's open-ended loop is genuinely warranted
  - The flexibility to adapt is what makes the task solvable at all
  - Worth the added cost, latency, and unpredictability BECAUSE a
    fixed chain genuinely couldn't handle this task's real variability
\`\`\`

**Why defaulting to an agent for everything is a real, common mistake,
not a safe choice:** an agent's per-run cost and latency (Module 2's
math, multiplied across however many ReAct iterations a task happens to
take) is genuinely higher than a fixed chain's predictable, minimal call
count, and an agent introduces real unpredictability (Module 5's need
for iteration caps and careful validation) that a fixed sequence simply
doesn't have. Reaching for an agent by default, "just in case," pays
this cost on tasks that never actually needed the flexibility — the
same "match the tool to the actual problem" discipline this course
applied to RAG (Module 7, Lesson 1) and schema-constrained generation
(Module 6).

**How this closes the module and this course's foundational arc:**
Modules 1-9 built, in order, next-token generation, prompting, streaming
UI, tool calling, structured output, and RAG — an agent is simply all of
these mechanisms composed together with the model itself directing the
sequence. Recognizing exactly when that composition earns its
complexity, versus when a simpler, more predictable arrangement of the
same underlying pieces serves the task better, is the practical judgment
this module — and in many ways this course's first half — has been
building toward.`,

    simpleHi: `**Ek simple chain — calls ka ek fixed, developer-written sequence,
koi model-directed branching nahi:**

\`\`\`ts
// Developer ko already EXACTLY pata hai ki is task ko kaunse steps
// chahiye — model ke reason karne ke liye koi genuine uncertainty nahi hai
async function generateWeeklyReport(userId) {
  const salesData = await fetchSalesData(userId);       // step 1, hamesha
  const summary = await summarizeWithModel(salesData);   // step 2, hamesha
  const formattedReport = await formatAsMarkdown(summary); // step 3, hamesha
  await emailReport(userId, formattedReport);             // step 4, hamesha
  // Har run EXACTLY yehi four steps karta hai, isi exact order mein —
  // ek agent ke open-ended loop ke liye figure out karne ke liye kuch
  // nahi hai
}
\`\`\`

**Ek agent — specifically tab warranted hai jab steps genuinely
advance mein jaane nahi ja sakte:**

\`\`\`ts
// Actually chahiye steps genuinely is baat pe depend karte hain ki
// raaste mein kya discover hota hai — ek fixed sequence advance mein
// NAHI likhi ja sakti
async function researchAndAnswer(question) {
  // "Meri specific workload ke liye top 3 cloud providers ki pricing
  // compare karo" — agent ko advance mein nahi pata ki use kaunse
  // providers ki documentation check karni padegi, kitne pricing tiers
  // relevant hain, ya use current exchange rates lookup karni hai ya
  // nahi — ye sirf execution ke DAURAN discover hote hain
  return await runReActAgent(question); // Lesson 1 ka loop
}
\`\`\`

**Decision test jise ye lesson establish karta hai:**

\`\`\`
Poochho: "Kya mujhe, developer ko, already pata hai ki is task ko
kaunse exact sequence of steps chahiye, chahe kisi bhi individual run
ka data kuch bhi nikle?"

HAAN, mujhe fixed sequence pata hai -> Ek simple chain use karo
  - Faster (koi reasoning-about-what-to-do-next overhead nahi)
  - Cheaper (kam, zyada predictable model calls — Module 2 ka cost math)
  - Zyada reliable (model ke galat ya unnecessary step choose karne, ya
    ek sensible stopping point se aage loop karne ka koi risk nahi)
  - Test aur debug karna aasan (Module 14 ise cover karta hai) — ek
    fixed sequence ka behavior verify karne ke liye kaafi zyada
    predictable hai

NAHI, actually chahiye steps is baat pe depend karte hain ki raaste
mein kya discover hota hai -> Ek agent ka open-ended loop genuinely
warranted hai
  - Adapt karne ki flexibility wo hai jo task ko bilkul solvable
    banati hai
  - Added cost, latency, aur unpredictability deserve karta hai
    KYUNKI ek fixed chain genuinely is task ki real variability
    handle nahi kar sakta tha
\`\`\`

**Har cheez ke liye ek agent pe default karna ek real, common mistake
kyun hai, ek safe choice nahi:** ek agent ka per-run cost aur latency
(Module 2 ka math, jo bhi kai ReAct iterations task ko lagte hain unse
multiplied) ek fixed chain ke predictable, minimal call count se
genuinely zyada hai, aur ek agent real unpredictability introduce
karta hai (Module 5 ki iteration caps aur careful validation ki zaroorat)
jo ek fixed sequence ke paas simply nahi hai. "Just in case" default
se ek agent tak reach karna un tasks pe ye cost pay karta hai jinhe
actually kabhi flexibility ki zaroorat nahi thi — wahi "tool ko actual
problem se match karo" discipline jo is course ne RAG (Module 7, Lesson
1) aur schema-constrained generation (Module 6) pe apply ki.

**Ye is module aur is course ke foundational arc ko kaise close karta
hai:** Modules 1-9 ne, order mein, next-token generation, prompting,
streaming UI, tool calling, structured output, aur RAG banaye — ek agent
simply in sab mechanisms ka composed hona hai model khud sequence ko
direct karte hue. Exactly ye recognize karna ki wo composition kab apni
complexity deserve karti hai, versus kab wahi underlying pieces ka ek
simpler, zyada predictable arrangement task ko better serve karta hai,
wo practical judgment hai jise ye module — aur kai tarikon se is course
ka pehla half — build karne ki taraf kaam kar raha tha.`,

    content: `## Why a fixed chain's predictability is a genuine advantage, not
just a limitation

A simple chain's developer-written, fixed sequence means every run's
behavior is known in advance — the same steps, in the same order, every
single time. This makes a chain's cost predictable (Module 2's math
applies to a known, fixed number of calls, not an open-ended count),
its behavior easy to test (Module 14's evaluation challenges around
non-determinism apply far less to a fixed sequence than to a model
choosing its own steps), and its failure modes narrow and well
understood. None of this is a limitation to overcome — it's the correct
choice specifically when the task's actual steps are genuinely knowable
without needing the model's own judgment to discover them.

## Why an agent's flexibility is a genuine requirement, not an
upgrade, for tasks whose steps aren't knowable in advance

An agent's core value — letting the model itself decide each step based
on real observations (Lesson 1) — is only valuable when there's a
genuine decision to make that depends on information not available
until execution. A task like "compare pricing across cloud providers for
this specific, unusual workload" cannot have its exact steps written in
advance, because which providers matter, which pricing tiers apply, and
what follow-up lookups are needed all depend on what's discovered along
the way. For genuinely this kind of task, a fixed chain simply cannot
work — there's no way to write the right sequence without already
knowing the answer, which is precisely the problem the agent is being
asked to solve.

## Why reaching for an agent by default is a real, quantifiable cost,
not a conservative safe choice

An agent's ReAct loop (Lesson 1) makes a variable, often larger, number
of model calls per task compared to a fixed chain's known, minimal
count — this directly multiplies Module 2's per-call cost, and adds
real latency (each loop iteration is a full round trip) that a fixed
chain's straight-line execution avoids. An agent also introduces the
unpredictability and safety considerations Module 5 and this module's
Lesson 2 established (iteration caps, memory management) that a fixed
chain simply doesn't need to think about. Choosing an agent for a task
whose steps were actually already known pays all of this real cost for
zero corresponding benefit.

## How this judgment call closes the arc from Module 1 through Module
9

This course built up, module by module, a specific set of mechanisms:
generation (Module 1), prompting (Module 3), streaming (Module 4), tool
calling (Module 5), structured output (Module 6), and retrieval (Modules
7-8). An agent (Module 9) is not a new, tenth mechanism — it's these
same pieces composed together with the model itself directing which
pieces to use and in what order, warranted specifically when that
direction genuinely can't be predetermined. Recognizing which category
a given task falls into — predetermined steps (a chain) or genuinely
undeterminable steps (an agent) — is the practical synthesis this
module has been building toward, and the judgment call every subsequent
production AI feature in this course ultimately depends on making
correctly.`,

    contentHi: `## Ek fixed chain ki predictability ek genuine advantage kyun hai, sirf ek limitation nahi

Ek simple chain ka developer-written, fixed sequence matlab hai har
run ka behavior advance mein known hai — wahi steps, wahi order mein,
har single baar. Ye ek chain ke cost ko predictable banata hai (Module
2 ka math ek known, fixed number of calls pe apply hota hai, ek
open-ended count pe nahi), uska behavior test karna aasan (Module 14 ki
non-determinism ke around evaluation challenges ek fixed sequence pe
model apne khud ke steps choose karne se kaafi kam apply hoti hain), aur
uske failure modes narrow aur well understood. Isme se kuch bhi overcome
karne layak limitation nahi hai — ye correct choice hai specifically
jab task ke actual steps genuinely knowable hain model ke apne khud ke
judgment ki zaroorat ke bina unhe discover karne ke liye.

## Ek agent ki flexibility un tasks ke liye ek genuine requirement kyun hai, ek upgrade nahi, jinke steps advance mein knowable nahi hain

Ek agent ki core value — model ko khud har step decide karne dena real
observations ke basis pe (Lesson 1) — sirf tab valuable hai jab wahan
ek genuine decision hai jo aisi information pe depend karta hai jo
execution tak available nahi hai. Ek task jaise "is specific, unusual
workload ke liye cloud providers ke across pricing compare karo" ke
exact steps advance mein nahi likhe ja sakte, kyunki kaunse providers
matter karte hain, kaunse pricing tiers apply hote hain, aur kaunse
follow-up lookups chahiye sab is baat pe depend karte hain ki raaste
mein kya discover hota hai. Genuinely is kism ke task ke liye, ek fixed
chain simply kaam nahi kar sakta — sahi sequence likhne ka koi tareeka
nahi hai bina already answer jaane, jo exactly wo problem hai jise agent
solve karne ke liye poocha ja raha hai.

## Default se ek agent tak reach karna ek real, quantifiable cost kyun hai, ek conservative safe choice nahi

Ek agent ka ReAct loop (Lesson 1) per task ek variable, aksar bada,
number of model calls karta hai ek fixed chain ke known, minimal count
ke comparison mein — ye directly Module 2 ke per-call cost ko multiply
karta hai, aur real latency add karta hai (har loop iteration ek poora
round trip hai) jise ek fixed chain ka straight-line execution avoid
karta hai. Ek agent bhi unpredictability aur safety considerations
introduce karta hai jo Module 5 aur is module ke Lesson 2 ne establish
kiye (iteration caps, memory management) jinke baare mein ek fixed
chain ko simply sochne ki zaroorat nahi. Ek task ke liye ek agent choose
karna jiske steps actually already known the ye poora real cost pay
karta hai zero corresponding benefit ke liye.

## Ye judgment call Module 1 se Module 9 tak ke arc ko kaise close karta hai

Is course ne, module by module, mechanisms ka ek specific set build
kiya: generation (Module 1), prompting (Module 3), streaming (Module 4),
tool calling (Module 5), structured output (Module 6), aur retrieval
(Modules 7-8). Ek agent (Module 9) ek naya, tenth mechanism nahi hai —
ye wahi pieces hain model khud direct karte hue ki kaunse pieces use
karne hain aur kis order mein, specifically tab warranted jab wo
direction genuinely predetermine nahi ki ja sakti. Ye recognize karna
ki ek given task kaunsi category mein aata hai — predetermined steps
(ek chain) ya genuinely undeterminable steps (ek agent) — practical
synthesis hai jise ye module — aur kai tarikon se is course ka pehla
half — build karne ki taraf kaam kar raha tha, aur wo judgment call jispe
is course mein baad ka har production AI feature ultimately correctly
banane pe depend karta hai.`,

    examples: [
      {
        title: 'The same underlying task solved correctly as a fixed chain, and incorrectly forced into an unnecessary agent loop',
        titleHi: 'Wahi underlying task ek fixed chain ki tarah correctly solve kiya gaya, aur incorrectly ek unnecessary agent loop mein force kiya gaya',
        codeJs: `// CORRECT — a fixed chain, because every step is genuinely known in advance
async function onboardNewUser(userId) {
  const user = await fetchUser(userId);                    // always step 1
  const welcomeEmail = await generateWelcomeEmail(user);    // always step 2
  await sendEmail(user.email, welcomeEmail);                 // always step 3
  await markOnboardingComplete(userId);                       // always step 4
  // No genuine decision depends on anything discovered along the way —
  // this sequence is identical for every single user, every single time
}

// INCORRECT — forcing the same fully-predetermined task into an agent
async function onboardNewUserAsAgent(userId) {
  const tools = [fetchUserTool, generateEmailTool, sendEmailTool, markCompleteTool];
  return await runReActAgent(
    \`Onboard user \${userId}: fetch their info, generate and send a
welcome email, then mark onboarding complete.\`,
    tools,
  );
  // The model now "reasons" about steps that were NEVER actually in
  // question, paying for extra reasoning tokens, extra latency per
  // step, and introducing a real (if small) risk it skips or
  // reorders a step — for zero benefit, since the sequence was
  // always fixed and known
}`,
        codeTs: `// CORRECT — a fixed chain, because every step is genuinely known in advance
async function onboardNewUser(userId: string): Promise<void> {
  const user = await fetchUser(userId);                    // always step 1
  const welcomeEmail = await generateWelcomeEmail(user);    // always step 2
  await sendEmail(user.email, welcomeEmail);                 // always step 3
  await markOnboardingComplete(userId);                       // always step 4
  // No genuine decision depends on anything discovered along the way —
  // this sequence is identical for every single user, every single time
}

// INCORRECT — forcing the same fully-predetermined task into an agent
async function onboardNewUserAsAgent(userId: string): Promise<string | undefined> {
  const tools = [fetchUserTool, generateEmailTool, sendEmailTool, markCompleteTool];
  return await runReActAgent(
    \`Onboard user \${userId}: fetch their info, generate and send a
welcome email, then mark onboarding complete.\`,
    tools,
  );
  // The model now "reasons" about steps that were NEVER actually in
  // question, paying for extra reasoning tokens, extra latency per
  // step, and introducing a real (if small) risk it skips or
  // reorders a step — for zero benefit, since the sequence was
  // always fixed and known
}`,
        code: `// CORRECT — fixed chain, steps genuinely known in advance
async function onboardNewUser(userId) {
  const user = await fetchUser(userId);
  const welcomeEmail = await generateWelcomeEmail(user);
  await sendEmail(user.email, welcomeEmail);
  await markOnboardingComplete(userId);
}`,
        output:
          "The fixed chain runs in exactly 4 predictable calls every time, with a known, minimal cost and no risk of the model choosing a wrong step order. The agent version runs a variable number of ReAct iterations (typically more than 4, since each includes a reasoning step), costs more per run, and introduces a real, if small, risk of the model deviating from the always-correct fixed sequence.",
        explain:
          "This directly demonstrates the lesson's decision test: since the developer already knows the exact, unchanging sequence this task needs, forcing it through an agent's open-ended reasoning loop adds cost, latency, and risk while providing zero corresponding benefit — the flexibility an agent provides is only valuable when genuine uncertainty about the right next step actually exists.",
        explainHi:
          "Ye directly lesson ke decision test ko demonstrate karta hai: kyunki developer ko already pata hai is task ko kaunsa exact, unchanging sequence chahiye, ise ek agent ke open-ended reasoning loop se guzarna cost, latency, aur risk add karta hai bina kisi corresponding benefit ke — ek agent jo flexibility provide karta hai sirf tab valuable hai jab sahi agle step ke baare mein genuine uncertainty actually exist karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Defaulting to an agent for every AI feature "to be flexible and future-proof"
async function processRefundRequest(orderId, reason) {
  return await runReActAgent(
    \`Process a refund for order \${orderId} because: \${reason}\`,
    [lookupOrderTool, checkRefundEligibilityTool, issueRefundTool, notifyCustomerTool],
  );
  // If this business's refund process ALWAYS follows the same steps
  // (look up order, check eligibility, issue refund, notify), an agent
  // adds cost and unpredictability for a task that never had genuine
  // step-order uncertainty in the first place.
}`,
        right: `// A fixed chain, since the refund process always follows the same steps
async function processRefundRequest(orderId, reason) {
  const order = await lookupOrder(orderId);
  const eligible = await checkRefundEligibility(order, reason);
  if (!eligible) return { status: 'denied', reason: 'Not eligible for refund' };
  const refund = await issueRefund(order);
  await notifyCustomer(order.customerId, refund);
  return { status: 'processed', refund };
}`,
        why: "When a task's actual steps (including simple, known branches like an eligibility check) are fully known in advance, an agent's flexibility to determine steps dynamically provides no benefit — it only adds the real costs (extra tokens for reasoning, more latency, more unpredictability) this lesson identifies, for a decision that was never actually in question.",
        whyHi:
          "Jab ek task ke actual steps (simple, known branches jaise ek eligibility check samet) advance mein poori tarah known hain, ek agent ki dynamically steps determine karne ki flexibility koi benefit provide nahi karti — ye sirf real costs add karti hai (reasoning ke liye extra tokens, zyada latency, zyada unpredictability) jise ye lesson identify karta hai, ek decision ke liye jo actually kabhi question mein thi hi nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production fintech company uses a fixed chain for its standard loan-application processing (the steps — credit check, document verification, approval calculation — are always the same, regulated sequence) but uses a genuine agent for its customer-facing research assistant that answers open-ended questions like 'what's the best loan option for my specific situation,' where the actual information needed genuinely varies question to question.",
        hi: 'Ek production fintech company apni standard loan-application processing ke liye ek fixed chain use karti hai (steps — credit check, document verification, approval calculation — hamesha wahi, regulated sequence hain) par apne customer-facing research assistant ke liye ek genuine agent use karti hai jo open-ended questions answer karta hai jaise \'meri specific situation ke liye best loan option kya hai,\' jahan actually chahiye information genuinely question se question vary karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the practical test for deciding whether a task should be implemented as a fixed chain or an agent?',
        qHi: 'Ye decide karne ka practical test kya hai ki ek task ko ek fixed chain ki tarah implement karna chahiye ya ek agent ki tarah?',
        a: "Ask whether the developer already knows the exact sequence of steps the task needs, regardless of what any individual run's specific data turns out to be. If yes, a fixed chain is faster, cheaper, and more predictable. If the actual needed steps genuinely depend on what's discovered during execution and can't be known in advance, an agent's flexibility is a genuine requirement, not an optional upgrade.",
        aHi: 'Poochho ki kya developer ko already pata hai task ko kaunsa exact sequence of steps chahiye, chahe kisi bhi individual run ka specific data kuch bhi nikle. Agar haan, ek fixed chain faster, cheaper, aur zyada predictable hai. Agar actually chahiye steps genuinely is baat pe depend karte hain ki execution ke dauran kya discover hota hai aur advance mein nahi jaane ja sakte, ek agent ki flexibility ek genuine requirement hai, ek optional upgrade nahi.',
      },
      {
        q: 'Why does defaulting to an agent for every AI feature, "to be safe," actually incur a real, avoidable cost?',
        qHi: 'Har AI feature ke liye ek agent pe default karna, "safe rehne ke liye," actually ek real, avoidable cost kyun incur karta hai?',
        a: "An agent's loop makes a variable, often larger number of model calls than a fixed chain's known, minimal count (multiplying Module 2's per-call cost), adds real per-iteration latency, and introduces unpredictability requiring iteration caps and careful validation (Module 5). When a task's steps are already fully known, none of this flexibility provides any benefit — it's pure added cost and risk for a decision that was never actually uncertain.",
        aHi: 'Ek agent ka loop ek variable, aksar bada number of model calls karta hai ek fixed chain ke known, minimal count se (Module 2 ke per-call cost ko multiply karte hue), real per-iteration latency add karta hai, aur unpredictability introduce karta hai jise iteration caps aur careful validation chahiye (Module 5). Jab ek task ke steps already poori tarah known hain, is flexibility mein se koi bhi koi benefit provide nahi karta — ye pure added cost aur risk hai ek decision ke liye jo actually kabhi uncertain thi hi nahi.',
      },
    ],

    exercises: [
      {
        task: "For each of these, decide whether a fixed chain or an agent is the right choice, and justify using this lesson's decision test: (1) generating a standardized monthly invoice from a customer's usage data, (2) answering 'help me plan a 3-day itinerary for a trip to a city I've never specified constraints for before.'",
        taskHi: 'In dono mein se har ek ke liye, decide karo ki ek fixed chain ya ek agent sahi choice hai, aur is lesson ke decision test ka use karke justify karo: (1) ek customer ke usage data se ek standardized monthly invoice generate karna, (2) \'mujhe ek aise city ke trip ke liye ek 3-din ka itinerary plan karne mein madad karo jiske liye maine pehle kabhi constraints specify nahi kiye\' answer karna.',
        hint: "For each task, ask whether the developer could write down the exact sequence of steps in advance, regardless of the specific input, or whether the actual needed steps genuinely depend on what's discovered along the way.",
        hintHi: 'Har task ke liye, poochho ki kya developer exact sequence of steps advance mein likh sakta hai, specific input se independently, ya kya actually chahiye steps genuinely is baat pe depend karte hain ki raaste mein kya discover hota hai.',
      },
    ],

    keyTakeaways: [
      "A fixed chain's predictability (known cost, easy testing, narrow failure modes) is a genuine advantage, not a limitation — correct when a task's exact steps are knowable in advance regardless of specific run data.",
      "An agent's flexibility is a genuine requirement, not an upgrade, specifically for tasks whose actual needed steps depend on what's discovered during execution and cannot be written down in advance.",
      "Defaulting to an agent for tasks whose steps are already known incurs real, avoidable cost: more model calls, more latency, and more unpredictability than a fixed chain, for zero corresponding benefit.",
      "An agent is not a tenth new mechanism — it's Modules 1-8's mechanisms (generation, prompting, tool calling, structured output, retrieval) composed together with the model itself directing the sequence, warranted specifically when that direction genuinely can't be predetermined.",
    ],
    keyTakeawaysHi: [
      'Ek fixed chain ki predictability (known cost, easy testing, narrow failure modes) ek genuine advantage hai, ek limitation nahi — correct hai jab ek task ke exact steps advance mein knowable hain specific run data se independently.',
      'Ek agent ki flexibility ek genuine requirement hai, ek upgrade nahi, specifically un tasks ke liye jinke actually chahiye steps execution ke dauran discover hui cheez pe depend karte hain aur advance mein likhe nahi ja sakte.',
      'Un tasks ke liye ek agent pe default karna jinke steps already known hain real, avoidable cost incur karta hai: ek fixed chain se zyada model calls, zyada latency, aur zyada unpredictability, zero corresponding benefit ke liye.',
      'Ek agent ek tenth naya mechanism nahi hai — ye Modules 1-8 ke mechanisms (generation, prompting, tool calling, structured output, retrieval) hain model khud sequence ko direct karte hue composed, specifically tab warranted jab wo direction genuinely predetermine nahi ki ja sakti.',
    ],
  },
];
