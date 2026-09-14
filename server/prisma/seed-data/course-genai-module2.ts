/**
 * Generative AI Complete Course — Module 2: Talking to a Model via API, lessons 1-3.
 *
 * Lesson 1: The Anthropic/OpenAI Node SDKs and the actual shape of a chat completion request.
 * Lesson 2: Streaming vs non-streaming responses.
 * Lesson 3: Generation parameters (temperature/top_p/max_tokens) and basic token/cost math.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-chat-completions-shape-of-a-request',
    title: 'Chat Completions — The Actual Shape of a Request',
    titleHi: 'Chat Completions — Ek Request Ki Actual Shape',
    description:
      "Module 1 explained the mechanism; this lesson covers the concrete API shape every production AI feature is built on — an array of role-tagged messages, not a single string, sent through the Anthropic or OpenAI Node SDK, and what the system/user/assistant roles genuinely control.",
    descriptionHi:
      'Module 1 ne mechanism explain kiya; ye lesson concrete API shape cover karta hai jispe har production AI feature built hai — role-tagged messages ka ek array, ek single string nahi, Anthropic ya OpenAI Node SDK ke through bheja gaya, aur system/user/assistant roles genuinely kya control karte hain.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: "**A courtroom transcript handed to a judge who's only just walked in, versus a single unlabeled paragraph of speech.** If you handed a judge one giant unlabeled block of text containing everything said in a hearing so far, they'd have no way to tell who said what, or which parts were instructions from the court versus testimony from a witness. A proper transcript instead labels every line with WHO said it — Judge, Witness, Attorney — so the reader can correctly weigh each statement's authority and intent. A chat completion request is exactly this transcript: instead of sending a model one blob of text, you send an array of labeled turns, each tagged with its role, so the model has the same clarity a judge reading a proper transcript has about who is instructing (system), who is asking (user), and what's already been said in response (assistant).",
      hi: 'Ek courtroom transcript ek judge ko diya gaya jo abhi abhi andar aaya hai, versus speech ka ek single unlabeled paragraph. Agar aap ek judge ko ek giant unlabeled block of text de dete jisme ek hearing mein ab tak jo bhi kaha gaya wo sab ho, unke paas ye batane ka koi tareeka nahi hota ki kisne kya kaha, ya kaunse parts court se instructions the versus ek witness se testimony. Ek proper transcript iske bajaye har line ko label karta hai ki YE kisne kaha — Judge, Witness, Attorney — taaki reader correctly weigh kar sake ki har statement ki authority aur intent kya hai. Ek chat completion request exactly yahi transcript hai: model ko text ka ek blob bhejne ke bajaye, aap labeled turns ka ek array bhejte ho, har ek apne role ke saath tagged, taaki model ke paas wahi clarity ho jo ek proper transcript padhne wale judge ke paas hoti hai ki kaun instruct kar raha hai (system), kaun pooch raha hai (user), aur response mein already kya kaha ja chuka hai (assistant).',
    },

    simple: `**The actual request shape — an array of role-tagged messages, not
a single string:**

\`\`\`ts
// This is the ENTIRE input the model reasons from (Module 1, Lesson 1)
{
  system: "You are a helpful assistant that answers concisely.",
  messages: [
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
}
\`\`\`

**What each role genuinely controls:**

\`\`\`
system  — instructions that shape HOW the model behaves across the
          whole conversation (tone, constraints, persona). Sent once,
          applies to every turn. Not a message FROM anyone — it's
          configuration for the model's behavior.

user    — what an actual person (or your application, on their behalf)
          is asking or saying. This is the content the model is
          "responding to."

assistant — the model's own PRIOR responses, included so the model can
          see what it already said (Module 1's "no memory between
          calls" — this is HOW that illusion of memory works: the
          conversation history, roles and all, is resent every time).
\`\`\`

**Making the actual call — Anthropic Node SDK:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  system: 'You are a helpful assistant that answers concisely.',
  messages: [
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
});

console.log(response.content[0].text); // "About 2.1 million (city proper)."
\`\`\`

**OpenAI's Node SDK — nearly identical shape, one structural
difference worth knowing:**

\`\`\`ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant that answers concisely.' },
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
});

console.log(response.choices[0].message.content);
// OpenAI puts the system instruction INSIDE the messages array as a
// 'system'-role message; Anthropic takes it as a separate top-level
// field. Same concept (an instruction that shapes the whole
// conversation), different place to put it in the two SDKs' shapes.
\`\`\`

**Why understanding this shape matters before anything else in this
course:** every technique from here forward — few-shot examples
(Module 3, added as extra user/assistant pairs), tool results (Module
5, appended as their own message type), RAG context (Module 7-8,
injected into a user message or system prompt) — is really just a
strategy for what to put into this one array. There's no other API
surface to learn; it's this same shape, used more elaborately.`,

    simpleHi: `**Actual request shape — role-tagged messages ka ek array, ek
single string nahi:**

\`\`\`ts
// Ye POORA input hai jisse model reason karta hai (Module 1, Lesson 1)
{
  system: "You are a helpful assistant that answers concisely.",
  messages: [
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
}
\`\`\`

**Har role genuinely kya control karta hai:**

\`\`\`
system  — instructions jo model ke behavior ko poori conversation ke
          across shape karte hain (tone, constraints, persona). Ek baar
          bheja jata hai, har turn pe apply hota hai. Kisi se ek message
          nahi hai — ye model ke behavior ke liye configuration hai.

user    — jo ek actual insaan (ya aapka application, unki taraf se)
          pooch raha hai ya keh raha hai. Ye wo content hai jispe model
          "respond kar raha hai."

assistant — model ke apne PRIOR responses, include kiye gaye taaki model
          dekh sake ki isne pehle kya kaha (Module 1 ka "calls ke beech
          koi memory nahi" — ye HAI ki memory ka wo illusion kaise kaam
          karta hai: conversation history, roles aur sab kuch, har baar
          resend hota hai).
\`\`\`

**Actual call karna — Anthropic Node SDK:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  system: 'You are a helpful assistant that answers concisely.',
  messages: [
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
});

console.log(response.content[0].text); // "About 2.1 million (city proper)."
\`\`\`

**OpenAI ka Node SDK — almost identical shape, ek structural
difference jaanne layak:**

\`\`\`ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant that answers concisely.' },
    { role: 'user', content: 'What is the capital of France?' },
    { role: 'assistant', content: 'Paris.' },
    { role: 'user', content: 'And its population?' },
  ],
});

console.log(response.choices[0].message.content);
// OpenAI system instruction ko messages array ke ANDAR daalta hai ek
// 'system'-role message ki tarah; Anthropic ise ek separate top-level
// field ki tarah leta hai. Same concept (ek instruction jo poori
// conversation ko shape karta hai), do SDKs ki shapes mein use rakhne
// ki alag jagah.
\`\`\`

**Kisi bhi doosri cheez se pehle is shape ko samajhna is course mein
kyun matter karta hai:** yahan se aage har technique — few-shot
examples (Module 3, extra user/assistant pairs ki tarah add kiye
gaye), tool results (Module 5, apne khud ke message type ki tarah
appended), RAG context (Module 7-8, ek user message ya system prompt
mein injected) — actually sirf ek strategy hai us ek array mein kya
daalna hai iske liye. Seekhne ke liye koi doosri API surface nahi hai;
ye wahi shape hai, zyada elaborately use ki gayi.`,

    content: `## Why the message-array shape, rather than a single string, is the
correct design

If an API accepted a single string, there would be no reliable way to
distinguish "an instruction about how to behave" from "a question being
asked" from "something the model already said" — a single string forces
all of that to be inferred from phrasing alone, which is fragile.
Structuring the request as an array of role-tagged turns makes this
distinction explicit and mechanical rather than something the model has
to guess at from context, which directly improves reliability for
anything beyond the simplest single-turn use case.

## Why the system role is genuinely different from a user message,
not just a naming convention

A system prompt shapes the model's behavior for the ENTIRE conversation
— tone, persona, constraints, refusal behavior — and is typically
weighted by the underlying training process to be followed more
consistently than an arbitrary user instruction buried mid-conversation.
This is why "you are a helpful assistant that only answers questions
about cooking" belongs in the system role rather than as the first user
message: it's establishing standing behavior, not making a one-off
request the way a user turn does.

## Why resending the assistant's own prior turns is necessary, not
redundant

Since Module 1 established that a model has no memory between separate
API calls, the only way a multi-turn conversation can feel coherent is
by explicitly including every prior turn — both what the user said and
what the model itself said — in every subsequent call. This looks
redundant from a "the model should just remember" intuition, but it's
the entire mechanism: there is no other channel through which prior
context reaches the model.

## Why the two major providers structure the system prompt differently,
and why that detail matters practically

Anthropic's API treats the system prompt as a distinct top-level field,
separate from the messages array; OpenAI's API instead represents it as
a message with role 'system' inside the same array. Both encode the
identical underlying concept — a standing instruction that shapes the
whole conversation — but a developer switching between providers, or
building an abstraction that supports both (common in a production
system that wants provider flexibility for Module 11's fallback
chains), needs to know this isn't just a naming difference; it's a
structural one that affects how a request object is actually built.`,

    contentHi: `## Message-array shape, ek single string ke bajaye, correct design kyun hai

Agar ek API ek single string accept karti, "behave kaise karna hai iske
baare mein ek instruction" ko "poocha ja raha ek sawaal" se "model
already jo keh chuka" se distinguish karne ka koi reliable tareeka nahi
hota — ek single string is sab ko sirf phrasing se infer karne ke liye
force karta hai, jo fragile hai. Request ko role-tagged turns ke ek
array ki tarah structure karna is distinction ko explicit aur mechanical
banata hai kisi aisi cheez ke bajaye jise model ko context se guess
karna pade, jo directly simplest single-turn use case se pare kisi bhi
cheez ke liye reliability improve karta hai.

## System role ek user message se genuinely alag kyun hai, sirf ek naming convention nahi

Ek system prompt model ke behavior ko POORI conversation ke liye shape
karta hai — tone, persona, constraints, refusal behavior — aur typically
underlying training process dwara weighted hota hai ki ise ek arbitrary
user instruction jo conversation ke beech mein buried hai se zyada
consistently follow kiya jaaye. Yahi wajah hai ki "you are a helpful
assistant that only answers questions about cooking" system role mein
belong karta hai first user message ki tarah nahi: ye standing behavior
establish kar raha hai, ek one-off request nahi bana raha jaise ek user
turn karta hai.

## Assistant ke apne prior turns ko resend karna zaroori kyun hai, redundant nahi

Kyunki Module 1 ne establish kiya ki ek model ke paas separate API calls
ke beech koi memory nahi hai, ekmatra tareeka jisse ek multi-turn
conversation coherent feel kar sakti hai har prior turn ko explicitly
include karke hai — dono jo user ne kaha aur jo model ne khud kaha — har
subsequent call mein. Ye redundant dikhta hai "model ko bas remember
karna chahiye" wali intuition se, par ye poora mechanism hai: koi doosra
channel nahi hai jiske through prior context model tak pahunchti hai.

## Do major providers system prompt ko alag tarike se kyun structure karte hain, aur ye detail practically kyun matter karta hai

Anthropic ka API system prompt ko ek distinct top-level field ki tarah
treat karta hai, messages array se separate; OpenAI ka API iske bajaye
ise wahi array ke andar role 'system' wale ek message ki tarah represent
karta hai. Dono identical underlying concept encode karte hain — ek
standing instruction jo poori conversation ko shape karta hai — par ek
developer jo providers ke beech switch kar raha hai, ya ek abstraction
bana raha hai jo dono support karta hai (ek production system mein
common jise Module 11 ke fallback chains ke liye provider flexibility
chahiye), ise jaanna chahiye ki ye sirf ek naming difference nahi hai;
ye ek structural hai jo affect karta hai ki ek request object actually
kaise build hota hai.`,

    examples: [
      {
        title: 'A multi-turn conversation built by explicitly accumulating messages across calls',
        titleHi: 'Ek multi-turn conversation jo calls ke across explicitly messages accumulate karke banaya gaya',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The application owns and grows this array — the model never does
let conversation = [];

async function sendTurn(userText) {
  conversation.push({ role: 'user', content: userText });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: 'You are a helpful assistant that answers concisely.',
    messages: conversation, // the FULL history, every single call
  });

  const reply = response.content[0].text;
  conversation.push({ role: 'assistant', content: reply }); // grow it
  return reply;
}

console.log(await sendTurn('What is the capital of France?')); // "Paris."
console.log(await sendTurn('And its population?'));
// The second call's request includes BOTH prior turns — this is the
// only reason the model can resolve "its" as referring to Paris.`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The application owns and grows this array — the model never does
let conversation: MessageParam[] = [];

async function sendTurn(userText: string): Promise<string> {
  conversation.push({ role: 'user', content: userText });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: 'You are a helpful assistant that answers concisely.',
    messages: conversation, // the FULL history, every single call
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  conversation.push({ role: 'assistant', content: block.text }); // grow it
  return block.text;
}

console.log(await sendTurn('What is the capital of France?')); // "Paris."
console.log(await sendTurn('And its population?'));
// The second call's request includes BOTH prior turns — this is the
// only reason the model can resolve "its" as referring to Paris.`,
        code: `let conversation = [];
async function sendTurn(userText) {
  conversation.push({ role: 'user', content: userText });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5', max_tokens: 500, messages: conversation,
  });
  conversation.push({ role: 'assistant', content: response.content[0].text });
  return response.content[0].text;
}`,
        output:
          "First call returns 'Paris.' Second call, sent with both prior turns included, correctly resolves 'its' as referring to Paris and returns the city's population — purely because the application resent the growing array, not because anything persisted inside the model between calls.",
        explain:
          "The `conversation` array is owned entirely by the application, not the API — every property of a coherent multi-turn conversation (resolving pronouns, remembering earlier facts) comes from this array growing correctly and being resent in full, exactly as Module 1 established.",
        explainHi:
          "`conversation` array poori tarah application ke paas hai, API ke paas nahi — ek coherent multi-turn conversation ki har property (pronouns resolve karna, earlier facts yaad rakhna) is array ke correctly badhne aur poori tarah resend hone se aati hai, exactly jaise Module 1 ne establish kiya.",
      },
    ],

    mistakes: [
      {
        wrong: `// Putting an instruction meant to shape the WHOLE conversation as a
// one-off user message instead of the system role
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  messages: [
    { role: 'user', content: 'From now on, only answer in French. What is 2+2?' },
  ],
});
// This can work initially, but standing behavioral instructions mixed
// into user turns are less reliably honored across a long conversation
// than the same instruction placed in the system role.`,
        right: `// Placing standing behavioral instructions in the system role, where
// they belong and are weighted to be followed consistently
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  system: 'Answer only in French, regardless of what language the user writes in.',
  messages: [
    { role: 'user', content: 'What is 2+2?' },
  ],
});`,
        why: "The system role exists specifically for instructions meant to govern behavior across an entire conversation, and models are typically trained to weight it more consistently than an equivalent instruction buried in a user turn. Using the wrong role for a standing instruction doesn't cause an error, but it does reduce reliability, especially over a long conversation.",
        whyHi:
          "System role specifically un instructions ke liye exist karta hai jo ek poori conversation ke across behavior govern karne ke liye meant hain, aur models typically iske ise ek equivalent instruction se zyada consistently weight karne ke liye trained hote hain jo ek user turn mein buried hai. Ek standing instruction ke liye galat role use karna ek error cause nahi karta, par ye reliability kam karta hai, especially ek lambi conversation ke over.",
      },
    ],

    realWorld: [
      {
        en: "A customer support chatbot's system prompt ('You represent Acme Corp, only discuss Acme products, escalate billing disputes rather than resolving them yourself') is set once and applies to every single message in a conversation, while the actual back-and-forth (the customer's questions, the bot's answers) accumulates as user/assistant turns in the messages array — exactly the separation this lesson establishes.",
        hi: 'Ek customer support chatbot ka system prompt (\'Aap Acme Corp represent karte ho, sirf Acme products discuss karo, billing disputes khud resolve karne ke bajaye escalate karo\') ek baar set hota hai aur conversation ke har single message pe apply hota hai, jabki actual back-and-forth (customer ke questions, bot ke answers) messages array mein user/assistant turns ki tarah accumulate hota hai — exactly wo separation jo ye lesson establish karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a chat completion API structured as an array of role-tagged messages rather than accepting a single string of text?',
        qHi: 'Ek chat completion API role-tagged messages ke ek array ki tarah structured kyun hai text ki ek single string accept karne ke bajaye?',
        a: "A single string would force the model to infer purely from phrasing whether a given piece of text was an instruction about behavior, a question being asked, or something already said — fragile and ambiguous. Explicit roles (system/user/assistant) make this distinction mechanical and reliable, which matters increasingly as a conversation grows more complex.",
        aHi: 'Ek single string model ko purely phrasing se infer karne ke liye force karega ki text ka ek given piece behavior ke baare mein ek instruction tha, ek poocha gaya sawaal tha, ya kuch already kaha gaya tha — fragile aur ambiguous. Explicit roles (system/user/assistant) is distinction ko mechanical aur reliable banate hain, jo increasingly matter karta hai jaise ek conversation zyada complex hoti jaati hai.',
      },
      {
        q: "If a model has no memory between API calls, how does a multi-turn chat conversation appear coherent to the user?",
        qHi: 'Agar ek model ke paas API calls ke beech koi memory nahi hai, ek multi-turn chat conversation user ko coherent kaise dikhti hai?',
        a: "The application resends the entire growing conversation history — every prior user and assistant turn — as part of the messages array on every single new call. The appearance of memory is entirely a property of this resending, not of anything the model itself retains between requests.",
        aHi: 'Application poori badhti hui conversation history — har prior user aur assistant turn — ko messages array ke hisse ki tarah resend karta hai har single naye call pe. Memory ka appearance poori tarah is resending ki ek property hai, kisi aisi cheez ki nahi jo model khud requests ke beech retain karta hai.',
      },
    ],

    exercises: [
      {
        task: "A developer wants a chatbot to always respond in a pirate-themed voice, no matter what the conversation is about. Decide whether this instruction belongs in the system role or as part of the first user message, and justify your choice using this lesson's explanation of what each role controls.",
        taskHi: 'Ek developer chahta hai ek chatbot hamesha ek pirate-themed voice mein respond kare, chahe conversation kisi bhi baare mein ho. Decide karo ki ye instruction system role mein belong karta hai ya first user message ke hisse ki tarah, aur apni choice ko justify karo is lesson ki explanation use karke ki har role kya control karta hai.',
        hint: "Consider whether this is a one-off request specific to a single turn, or a standing behavior meant to apply across the entire conversation.",
        hintHi: 'Consider karo ki kya ye ek single turn ke liye specific ek one-off request hai, ya ek standing behavior jo poori conversation ke across apply hone ke liye meant hai.',
      },
    ],

    keyTakeaways: [
      "A chat completion request is an array of role-tagged messages (system/user/assistant), not a single string — this makes the distinction between behavioral instructions, questions, and prior responses explicit and mechanical rather than inferred from phrasing.",
      'The system role shapes behavior across the WHOLE conversation and is typically weighted to be followed more consistently than an equivalent instruction in a user turn.',
      "Multi-turn conversational coherence comes entirely from the application resending the full growing history (both user and assistant turns) on every call — nothing persists inside the model itself between requests.",
      "Anthropic and OpenAI structure the system instruction differently (a separate top-level field vs. a role inside the messages array) — the same underlying concept, a structurally different place to put it.",
    ],
    keyTakeawaysHi: [
      'Ek chat completion request role-tagged messages (system/user/assistant) ka ek array hai, ek single string nahi — ye behavioral instructions, questions, aur prior responses ke beech distinction ko explicit aur mechanical banata hai phrasing se infer karne ke bajaye.',
      'System role poori conversation ke across behavior ko shape karta hai aur typically ek equivalent instruction se zyada consistently follow kiye jaane ke liye weighted hota hai jo ek user turn mein hai.',
      'Multi-turn conversational coherence poori tarah application ke poori badhti hui history (dono user aur assistant turns) ko har call pe resend karne se aati hai — model ke andar khud requests ke beech kuch bhi persist nahi hota.',
      'Anthropic aur OpenAI system instruction ko alag tarike se structure karte hain (ek separate top-level field vs. messages array ke andar ek role) — wahi underlying concept, ise rakhne ki ek structurally alag jagah.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-streaming-vs-non-streaming',
    title: 'Streaming vs Non-Streaming Responses',
    titleHi: 'Streaming vs Non-Streaming Responses',
    description:
      "Given Module 1's mechanism (one token generated at a time), a non-streaming call still waits for EVERY token before returning anything — streaming exposes that same underlying process token-by-token as it happens, which matters enormously for how an AI feature actually feels to use.",
    descriptionHi:
      'Module 1 ke mechanism ko dekhte hue (ek time pe ek token generate hota hai), ek non-streaming call abhi bhi kuch bhi return karne se pehle HAR token ka wait karti hai — streaming wahi underlying process ko token-by-token expose karta hai jaise ye hota hai, jo ye matter karta hai ki ek AI feature actually use karne mein kaisa feel karta hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 2,

    analogy: {
      en: "**Waiting for an entire meal to be fully plated and carried out before anything reaches your table, versus a live cooking show where you watch each ingredient go into the pan as it happens.** In the first case, everything happens behind a closed kitchen door — the dish could take two minutes or twenty, and from where you sit, nothing observably happens until the finished plate arrives all at once. In the second, you see the process unfold in real time: the oil going in, the vegetables added, the sauce reducing — even though the total cooking time is identical, watching it happen continuously feels completely different from staring at a closed door for the same duration. A non-streaming API call is the closed kitchen door: the model is generating tokens one at a time exactly as Module 1 described, but you receive nothing until the very last one is done. Streaming opens that door — you receive each token as it's generated, which is the same total generation time, but a radically different experience of waiting for it.",
      hi: 'Ek poore meal ka fully plated hoke bahar aane ka wait karna kisi cheez ke aapki table tak pahunchne se pehle, versus ek live cooking show jahan aap dekhte ho har ingredient pan mein jaate hue jaise ye hota hai. Pehle case mein, sab kuch ek closed kitchen door ke peeche hota hai — dish do minutes le sakti hai ya twenty, aur jahan aap baithe ho wahan se, kuch bhi observably nahi hota jab tak finished plate ek saath nahi aati. Doosre mein, aap process ko real time mein unfold hote dekhte ho: oil daala ja raha hai, vegetables add kiye ja rahe hain, sauce reduce ho raha hai — chahe total cooking time identical ho, ise continuously hote dekhna ek closed door ko wahi duration ke liye ghoorne se poori tarah alag feel karta hai. Ek non-streaming API call wahi closed kitchen door hai: model tokens ek time pe ek generate kar raha hai exactly jaise Module 1 ne describe kiya, par aapko kuch nahi milta jab tak bilkul last wala done na ho. Streaming us door ko khol deta hai — aapko har token milta hai jaise ye generate hota hai, jo wahi total generation time hai, par iske wait karne ka ek radically alag experience.',
    },

    simple: `**Non-streaming — wait for the whole response, then get it all at
once:**

\`\`\`ts
// The model generates every token internally, one at a time, but the
// SDK only hands you the result after the LAST token is done
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a 500-word essay on rivers.' }],
});
console.log(response.content[0].text); // nothing until the FULL essay is ready
\`\`\`

**Streaming — receive each token (or small chunk) as it's generated:**

\`\`\`ts
const stream = anthropic.messages.stream({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a 500-word essay on rivers.' }],
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text); // prints as EACH piece arrives
  }
}
\`\`\`

**Why streaming genuinely changes perceived latency, not just actual
latency:**

\`\`\`
Total generation time for a 500-word essay: ~8 seconds either way — the
model does the same amount of work regardless of whether you stream it.

Non-streaming: visitor sees NOTHING for 8 seconds, then the full essay
               appears at once. Feels slow, and a visitor has no signal
               the system is even working.

Streaming: visitor sees the FIRST word within ~300ms, then a steady
           flow of text for the remaining ~8 seconds. Feels fast and
           alive, even though the LAST word arrives at the same moment
           either way.
\`\`\`

**The mechanism underneath streaming — Server-Sent Events (SSE):**

\`\`\`
A streaming response is transmitted as a sequence of small, individually
parseable events over a single long-lived HTTP connection — each event
typically containing one small piece of generated text ("delta"). This
is the SAME transport mechanism Module 4's Vercel AI SDK section builds
on for streaming AI output into a browser UI, and the SAME general
streaming/Suspense idea this platform's own Next.js course (Module 3)
covered for a completely different reason (sending a page before all
its data has arrived) — the underlying "start sending before everything
is ready" idea shows up in both contexts because it solves the same
category of latency-perception problem.
\`\`\`

**When non-streaming is still the right choice:** a background job
(processing many requests where no human is watching in real time), a
case where you need the complete response before doing anything with it
(e.g., parsing it as a single JSON object — Module 6), or a simple
internal script — streaming's UX benefit only matters when a human is
actually watching the response arrive.`,

    simpleHi: `**Non-streaming — poore response ka wait karo, phir sab kuch ek
saath milta hai:**

\`\`\`ts
// Model internally har token generate karta hai, ek time pe ek, par
// SDK aapko result sirf LAST token done hone ke baad handta hai
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a 500-word essay on rivers.' }],
});
console.log(response.content[0].text); // kuch nahi jab tak FULL essay ready na ho
\`\`\`

**Streaming — har token (ya chhota chunk) receive karo jaise ye
generate hota hai:**

\`\`\`ts
const stream = anthropic.messages.stream({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a 500-word essay on rivers.' }],
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text); // print hota hai jaise EACH piece aata hai
  }
}
\`\`\`

**Streaming genuinely perceived latency kyun badalta hai, sirf actual
latency nahi:**

\`\`\`
Ek 500-word essay ke liye total generation time: ~8 seconds dono
tareeke se — model wahi amount of work karta hai chahe aap ise stream
karo ya nahi.

Non-streaming: visitor ko 8 seconds ke liye KUCH nahi dikhta, phir poora
               essay ek saath appear hota hai. Slow feel karta hai, aur
               visitor ke paas koi signal nahi hai ki system kaam bhi
               kar raha hai.

Streaming: visitor ko pehla word ~300ms ke andar dikhta hai, phir
           baaki ~8 seconds ke liye text ka ek steady flow. Fast aur
           alive feel karta hai, chahe LAST word dono tareeke se wahi
           moment pe pahunchta hai.
\`\`\`

**Streaming ke niche ka mechanism — Server-Sent Events (SSE):**

\`\`\`
Ek streaming response chhote, individually parseable events ki ek
sequence ki tarah transmit hoti hai ek single long-lived HTTP connection
ke upar — har event typically generated text ka ek chhota piece
("delta") contain karta hai. Ye WAHI transport mechanism hai jispe
Module 4 ka Vercel AI SDK section browser UI mein AI output stream
karne ke liye build karta hai, aur WAHI general streaming/Suspense idea
jo is platform ka apna Next.js course (Module 3) ek poori tarah alag
wajah se cover karta hai (ek page bhejna isse pehle ki uska poora data
aa chuka ho) — underlying "sab kuch ready hone se pehle bhejna shuru
karo" idea dono contexts mein dikhta hai kyunki ye latency-perception
problem ki wahi category solve karta hai.
\`\`\`

**Kab non-streaming abhi bhi sahi choice hai:** ek background job (kai
requests process karna jahan koi insaan real time mein watch nahi kar
raha), ek case jahan aapko kuch bhi karne se pehle complete response
chahiye (jaise, ise ek single JSON object ki tarah parse karna — Module
6), ya ek simple internal script — streaming ka UX benefit sirf tab
matter karta hai jab koi insaan actually response ko arrive hote
dekh raha ho.`,

    content: `## Why streaming and non-streaming have identical total generation
time, but radically different perceived experiences

Module 1 established that generation is inherently sequential — one
token predicted at a time. Non-streaming doesn't change that mechanism
at all; it simply withholds every token from the caller until the very
last one is produced, bundling them all into a single response object.
Streaming exposes the exact same sequential process to the caller as it
happens. The total wall-clock time to produce the full response is the
same either way — what differs entirely is when the FIRST useful
content reaches whoever's waiting, which is the single biggest lever on
perceived responsiveness for anything that takes more than an instant.

## Why Server-Sent Events specifically, and what that means
practically

A streaming AI response is delivered as a sequence of discrete,
individually-parseable events over one long-lived HTTP connection —
each event usually carrying one small increment of newly generated text
(a "delta"). This is the same general mechanism (a single connection,
a sequence of server-pushed events, no need for the client to poll) this
platform's own Next.js course covered for React's Suspense-based
streaming (sending page content as it becomes ready, rather than waiting
for everything). The same underlying "start sending before everything
is finished" idea recurs because it solves a structurally identical
problem: something takes a while to fully complete, and the wait feels
better broken into a continuous flow than experienced as one long silence.

## Why this choice is a UX decision, not a correctness one

Streaming and non-streaming produce the identical final content — the
same tokens, generated by the identical process, just delivered
differently. Choosing between them is purely about who's consuming the
response and how: a human watching a chat interface benefits enormously
from streaming's improved perceived latency; a background job or a
process that needs the complete response before it can do anything
useful (parsing it as one JSON object, as Module 6 covers) gains nothing
from streaming and adds unneeded complexity by using it.

## Why this sets up Module 4's actual UI implementation

This lesson covers streaming at the API/SDK level — receiving deltas in
a Node script. Module 4 builds directly on this same mechanism through
the Vercel AI SDK's higher-level hooks (\`useChat\`, \`useCompletion\`),
which handle the SSE parsing, partial-state management, and re-rendering
automatically for a React UI — but the underlying reason any of it
exists is exactly the perceived-latency argument this lesson makes.`,

    contentHi: `## Streaming aur non-streaming ka identical total generation time kyun hai, par radically alag perceived experiences

Module 1 ne establish kiya ki generation inherently sequential hai — ek
time pe ek token predicted. Non-streaming us mechanism ko bilkul nahi
badalta; ye simply caller se har token ko withhold karta hai jab tak
bilkul last wala produce na ho jaaye, sab ko ek single response object
mein bundle karte hue. Streaming caller ko wahi exact sequential process
expose karta hai jaise ye hota hai. Poore response ko produce karne ka
total wall-clock time dono tareeke se wahi hai — jo poori tarah alag hai
wo hai ki jo bhi wait kar raha hai use FIRST useful content kab pahunchti
hai, jo kisi bhi cheez ke liye perceived responsiveness pe single sabse
bada lever hai jise ek instant se zyada time lagta hai.

## Specifically Server-Sent Events kyun, aur practically iska kya matlab hai

Ek streaming AI response discrete, individually-parseable events ki ek
sequence ki tarah deliver hoti hai ek single long-lived HTTP connection
ke upar — har event usually newly generated text ka ek chhota increment
carry karta hai (ek "delta"). Ye wahi general mechanism hai (ek single
connection, server-pushed events ki ek sequence, client ke liye poll
karne ki zaroorat nahi) jo is platform ka apna Next.js course React ke
Suspense-based streaming ke liye cover karta hai (page content bhejna
jaise ye ready hota hai, sab kuch ke liye wait karne ke bajaye). Wahi
underlying "sab kuch finish hone se pehle bhejna shuru karo" idea
recur hota hai kyunki ye ek structurally identical problem solve karta
hai: kisi cheez ko poori tarah complete hone mein time lagta hai, aur
wait ek continuous flow mein tode jaane pe ek lambi silence ki tarah
experience hone se better feel karta hai.

## Ye choice ek UX decision kyun hai, ek correctness wala nahi

Streaming aur non-streaming identical final content produce karte hain
— wahi tokens, identical process dwara generate kiye gaye, sirf
differently delivered. In dono ke beech choose karna purely is baat ke
baare mein hai ki response kaun consume kar raha hai aur kaise: ek
insaan jo ek chat interface dekh raha hai streaming ke improved
perceived latency se enormously benefit karta hai; ek background job ya
ek process jise kuch bhi useful karne se pehle complete response chahiye
(ise ek single JSON object ki tarah parse karna, jaise Module 6 cover
karta hai) streaming se kuch nahi paata aur ise use karke unneeded
complexity add karta hai.

## Ye Module 4 ke actual UI implementation ko kaise set up karta hai

Ye lesson streaming ko API/SDK level pe cover karta hai — ek Node script
mein deltas receive karna. Module 4 directly wahi mechanism ke upar
Vercel AI SDK ke higher-level hooks (\`useChat\`, \`useCompletion\`) ke
through build karta hai, jo ek React UI ke liye SSE parsing,
partial-state management, aur re-rendering automatically handle karte
hain — par inme se kuch bhi exist karne ka underlying reason exactly wo
perceived-latency argument hai jo ye lesson banata hai.`,

    examples: [
      {
        title: 'Streaming a response and accumulating the full text, showing both the incremental and final result',
        titleHi: 'Ek response ko stream karna aur poora text accumulate karna, dono incremental aur final result dikhate hue',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function streamAnswer(question) {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: question }],
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text); // shown to a human, incrementally
      fullText += event.delta.text;            // accumulated for later use
    }
  }
  return fullText; // available once the stream ends, identical to a
                    // non-streaming call's final result
}

const answer = await streamAnswer('Explain photosynthesis in two sentences.');`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function streamAnswer(question: string): Promise<string> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: question }],
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text); // shown to a human, incrementally
      fullText += event.delta.text;            // accumulated for later use
    }
  }
  return fullText; // available once the stream ends, identical to a
                    // non-streaming call's final result
}

const answer: string = await streamAnswer('Explain photosynthesis in two sentences.');`,
        code: `const stream = anthropic.messages.stream({ model: 'claude-sonnet-4-5', max_tokens: 500, messages });
let fullText = '';
for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    fullText += event.delta.text;
  }
}`,
        output:
          "Text prints to the console word-by-word (or a few characters at a time) as it's generated, giving immediate visible progress; `fullText` ends up containing the exact same complete answer a non-streaming call would have returned all at once.",
        explain:
          "This demonstrates that streaming and non-streaming are genuinely equivalent in final content — the only difference is that this version surfaces each piece as it's produced (useful for a human watching), while also accumulating the identical full text a non-streaming call would return directly.",
        explainHi:
          "Ye demonstrate karta hai ki streaming aur non-streaming final content mein genuinely equivalent hain — ekmatra difference ye hai ki ye version har piece ko surface karta hai jaise ye produce hota hai (ek insaan ke dekhne ke liye useful), jabki wahi identical full text bhi accumulate karta hai jo ek non-streaming call directly return karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using streaming for a background job where nothing is watching in real time
async function classifyThousandsOfTickets(tickets) {
  for (const ticket of tickets) {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 50,
      messages: [{ role: 'user', content: \`Classify: \${ticket.text}\` }],
    });
    let result = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        result += event.delta.text;
      }
    }
    await saveClassification(ticket.id, result);
  }
  // Streaming adds parsing complexity here for ZERO benefit — nothing
  // is watching the incremental output; only the final result matters.
}`,
        right: `// Using a plain non-streaming call for a background job
async function classifyThousandsOfTickets(tickets) {
  for (const ticket of tickets) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 50,
      messages: [{ role: 'user', content: \`Classify: \${ticket.text}\` }],
    });
    await saveClassification(ticket.id, response.content[0].text);
  }
  // Simpler code, identical result, since no human is watching this
  // run in real time — streaming's entire benefit is unused here.
}`,
        why: "Streaming's value is entirely about improving perceived latency for a human watching a response arrive in real time. A background job with no real-time observer gets zero benefit from streaming and pays for it in extra parsing and state-management complexity for no reason.",
        whyHi:
          "Streaming ki value poori tarah is baat ke baare mein hai ki ek insaan jo ek response ko real time mein arrive hote dekh raha hai uske liye perceived latency improve karna. Ek background job jiska koi real-time observer nahi hai streaming se zero benefit paata hai aur bina kisi reason ke extra parsing aur state-management complexity ke liye pay karta hai.",
      },
    ],

    realWorld: [
      {
        en: "Every production chat interface (ChatGPT, Claude.ai) uses streaming specifically because a visitor watching a response type out feels the system is responsive within milliseconds, while a batch classification pipeline processing millions of support tickets overnight uses plain non-streaming calls, since no one is watching any individual response arrive.",
        hi: 'Har production chat interface (ChatGPT, Claude.ai) specifically streaming use karta hai kyunki ek visitor jo ek response ko type hote dekh raha hai feel karta hai ki system milliseconds ke andar responsive hai, jabki ek batch classification pipeline jo overnight millions of support tickets process karti hai plain non-streaming calls use karti hai, kyunki koi bhi kisi individual response ko arrive hote nahi dekh raha.',
      },
    ],

    interviewQA: [
      {
        q: 'Does streaming reduce the total time it takes a model to generate a complete response? If not, what does it actually improve?',
        qHi: 'Kya streaming ek model ke complete response generate karne mein lagne wale total time ko reduce karti hai? Agar nahi, ye actually kya improve karti hai?',
        a: "No — the total generation time is identical, since the model still produces tokens one at a time either way. What streaming improves is when the first useful content reaches whoever's waiting, which dramatically improves perceived responsiveness for a human watching in real time, without changing the actual total duration at all.",
        aHi: 'Nahi — total generation time identical hai, kyunki model abhi bhi tokens ko ek time pe ek produce karta hai dono tareeke se. Streaming jo improve karti hai wo ye hai ki jo bhi wait kar raha hai use first useful content kab pahunchti hai, jo real time mein dekhte hue ek insaan ke liye perceived responsiveness ko dramatically improve karti hai, bina actual total duration ko bilkul badle.',
      },
      {
        q: 'When is non-streaming the better choice than streaming, and why?',
        qHi: 'Non-streaming streaming se better choice kab hai, aur kyun?',
        a: "When there's no real-time human observer — a background job processing many requests, or a case where the complete response is needed before doing anything useful with it (like parsing it as a single JSON object). In both cases, streaming's entire benefit (improved perceived latency for a watcher) doesn't apply, and it only adds unnecessary parsing and state-management complexity.",
        aHi: 'Jab koi real-time human observer nahi hai — ek background job jo kai requests process karta hai, ya ek case jahan kuch bhi useful karne se pehle complete response chahiye (jaise ise ek single JSON object ki tarah parse karna). Dono cases mein, streaming ka poora benefit (ek watcher ke liye improved perceived latency) apply nahi hota, aur ye sirf unnecessary parsing aur state-management complexity add karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team is building two features: (1) a customer-facing chat assistant, and (2) a nightly job that summarizes every support ticket closed that day for an internal report. Decide which should use streaming and which shouldn't, and justify each choice.",
        taskHi: 'Ek team do features bana rahi hai: (1) ek customer-facing chat assistant, aur (2) ek nightly job jo us din close hui har support ticket ko ek internal report ke liye summarize karti hai. Decide karo kaunse ko streaming use karni chahiye aur kaunse ko nahi, aur har choice ko justify karo.',
        hint: "Ask, for each feature, whether there's a real-time human watching the response arrive, or whether only the final, complete result actually matters.",
        hintHi: 'Har feature ke liye poochho, kya koi real-time human hai jo response ko arrive hote dekh raha hai, ya sirf final, complete result actually matter karta hai.',
      },
    ],

    keyTakeaways: [
      'Streaming and non-streaming produce identical content in identical total time — the model generates tokens sequentially either way (Module 1); the only difference is when the first content reaches the caller.',
      "Streaming dramatically improves PERCEIVED latency for a human watching a response arrive in real time, without changing the actual generation duration at all.",
      'A streaming response is delivered as Server-Sent Events over one long-lived connection — the same general "start sending before everything is ready" mechanism this platform\'s Next.js course used for a different purpose (React Suspense streaming).',
      "Non-streaming remains the right choice whenever there's no real-time observer — background jobs, or any case where only the complete final response matters (such as parsing it as structured JSON, Module 6).",
    ],
    keyTakeawaysHi: [
      'Streaming aur non-streaming identical content produce karte hain identical total time mein — model dono tareeke se sequentially tokens generate karta hai (Module 1); ekmatra difference ye hai ki first content caller tak kab pahunchta hai.',
      'Streaming ek insaan ke liye jo ek response ko real time mein arrive hote dekh raha hai PERCEIVED latency ko dramatically improve karti hai, actual generation duration ko bilkul badle bina.',
      'Ek streaming response Server-Sent Events ki tarah ek single long-lived connection ke upar deliver hoti hai — wahi general "sab kuch ready hone se pehle bhejna shuru karo" mechanism jo is platform ke Next.js course ne ek alag purpose ke liye use kiya (React Suspense streaming).',
      'Non-streaming sahi choice rehta hai jab bhi koi real-time observer nahi hai — background jobs, ya koi bhi case jahan sirf complete final response matter karta hai (jaise ise structured JSON ki tarah parse karna, Module 6).',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-generation-parameters-and-cost-math',
    title: 'Generation Parameters, Token Counting & Cost Math',
    titleHi: 'Generation Parameters, Token Counting Aur Cost Math',
    description:
      "The knobs that actually change how a model generates (temperature, top_p, max_tokens) and what they control mechanically, plus the token-counting and pricing math every production AI feature needs to budget for before Module 10 turns it into a full production concern.",
    descriptionHi:
      'Wo knobs jo actually badalte hain ki ek model kaise generate karta hai (temperature, top_p, max_tokens) aur ye mechanically kya control karte hain, plus token-counting aur pricing math jo har production AI feature ko Module 10 ke ise ek poore production concern mein badalne se pehle budget karna hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A chef choosing, for a given dish, how strictly to follow the highest-rated version of a recipe versus how much to improvise with less common but still plausible ingredient choices.** Given the same recipe, a chef cooking with strict discipline reaches for the single most conventional choice at every step, producing something safe and predictable every time. A chef given more creative license will sometimes reach for a less obvious but still reasonable ingredient, producing something more varied and occasionally more interesting — but also occasionally a genuinely odd combination. Neither approach is \"wrong\" — it depends entirely on whether you want the tenth attempt at a dish to taste identical to the first, or whether some variation and willingness to take a less predictable path is actually desirable. A model's temperature setting is exactly this dial: low temperature reaches for the single most probable next token almost every time (consistent, predictable, sometimes repetitive); higher temperature allows less probable but still plausible tokens to occasionally be selected (more varied, more creative, occasionally stranger).",
      hi: 'Ek chef jo, ek given dish ke liye, choose kar raha hai ki ek recipe ke highest-rated version ko kitna strictly follow kare versus kitna improvise kare less common par abhi bhi plausible ingredient choices ke saath. Wahi recipe dekhte hue, strict discipline ke saath cook karne wala ek chef har step pe single most conventional choice ke liye reach karta hai, har baar kuch safe aur predictable produce karta hai. Zyada creative license diya gaya ek chef kabhi kabhi ek less obvious par abhi bhi reasonable ingredient ke liye reach karega, kuch zyada varied aur occasionally zyada interesting produce karte hue — par occasionally ek genuinely odd combination bhi. Koi bhi approach "galat" nahi hai — ye poori tarah is baat pe depend karta hai ki kya aap chahte ho ek dish ki dasvin attempt bilkul pehli jaisi taste kare, ya kuch variation aur ek less predictable path lene ki willingness actually desirable hai. Ek model ka temperature setting exactly yahi dial hai: low temperature almost har baar single most probable agla token ke liye reach karta hai (consistent, predictable, kabhi kabhi repetitive); higher temperature less probable par abhi bhi plausible tokens ko occasionally select hone deta hai (zyada varied, zyada creative, occasionally stranger).',
    },

    simple: `**temperature — how much randomness enters the "pick a token"
step:**

\`\`\`ts
// Low temperature — near-deterministic, picks the most likely token
// almost every time. Good for: factual Q&A, classification, code
// generation, anything where consistency matters more than variety.
await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  temperature: 0.1,
  messages: [{ role: 'user', content: 'What is 12 * 8?' }],
});

// Higher temperature — allows less-likely-but-plausible tokens to be
// selected sometimes. Good for: creative writing, brainstorming,
// varied example generation — anywhere sameness is undesirable.
await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  temperature: 0.9,
  messages: [{ role: 'user', content: 'Write a quirky opening line for a short story.' }],
});
\`\`\`

**top_p — a related but distinct way of controlling the same
randomness (only one is typically adjusted at a time):**

\`\`\`
Rather than scaling ALL probabilities (what temperature does), top_p
restricts selection to only the smallest set of most-likely tokens
whose combined probability reaches a threshold (e.g. top_p: 0.9 means
"only consider tokens that together make up the top 90% of probability
mass, ignore the unlikely long tail entirely").

In practice: pick ONE of temperature or top_p to tune deliberately, and
leave the other at its default — adjusting both at once makes the
combined effect hard to reason about.
\`\`\`

**max_tokens — a hard ceiling on the response length, not a
suggestion:**

\`\`\`
max_tokens: 100 means the model will be cut off mid-generation if its
response would otherwise exceed 100 tokens — this can produce a
response that stops mid-sentence. It's a safety/cost limit, not a
target length; a model asked for "a one-sentence answer" with
max_tokens: 1000 will still (usually) produce roughly one sentence,
guided by the PROMPT, not by the ceiling.
\`\`\`

**Token counting and basic cost math — the numbers behind Module 10's
production concern:**

\`\`\`
Pricing is per token, and INPUT and OUTPUT tokens are typically priced
differently (output usually costs more per token than input).

Rough estimate: ~4 characters of English text per token.

Example (illustrative numbers, not current pricing — check your
provider's actual rates):
  Input: "Summarize this 2,000-word article" + the article itself
         ≈ 2,700 tokens
  Output: a 150-word summary ≈ 200 tokens

  If input costs $3 per million tokens and output costs $15 per
  million tokens:
    Input cost:  2,700 / 1,000,000 * $3  ≈ $0.0081
    Output cost:   200 / 1,000,000 * $15 ≈ $0.0030
    Total for this one request: ≈ $0.011

  At 10,000 requests like this per day: ≈ $110/day — a number that
  matters enormously for a product's unit economics, which is exactly
  why Module 10 treats this as a first-class design concern, not an
  afterthought to check once deployed.
\`\`\`

**Why this lesson closes out the module:** temperature/top_p/max_tokens
are the actual dials on the mechanism Module 1 described, and token
counting is the actual unit that mechanism's cost is measured in — every
concrete decision made in this course from here forward (which model,
how much context to include, whether to stream) has a real, calculable
cost and behavior consequence traceable directly to these parameters.`,

    simpleHi: `**temperature — "ek token pick karo" step mein kitni randomness
enter karti hai:**

\`\`\`ts
// Low temperature — near-deterministic, almost har baar most likely
// token pick karta hai. Achha hai: factual Q&A, classification, code
// generation, kisi bhi cheez ke liye jahan consistency variety se
// zyada matter karti hai.
await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  temperature: 0.1,
  messages: [{ role: 'user', content: 'What is 12 * 8?' }],
});

// Higher temperature — less-likely-but-plausible tokens ko kabhi kabhi
// select hone deta hai. Achha hai: creative writing, brainstorming,
// varied example generation — jahan bhi sameness undesirable hai.
await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  temperature: 0.9,
  messages: [{ role: 'user', content: 'Write a quirky opening line for a short story.' }],
});
\`\`\`

**top_p — wahi randomness ko control karne ka ek related par distinct
tareeka (typically ek time pe sirf ek adjust kiya jata hai):**

\`\`\`
Saari probabilities scale karne ke bajaye (jo temperature karta hai),
top_p selection ko sirf most-likely tokens ke sabse chhote set tak
restrict karta hai jinki combined probability ek threshold tak pahunchti
hai (jaise top_p: 0.9 ka matlab hai "sirf un tokens ko consider karo jo
saath mein top 90% probability mass banate hain, unlikely long tail ko
poori tarah ignore karo").

Practically: temperature ya top_p mein se EK ko deliberately tune karo,
aur doosre ko default pe chhod do — dono ko ek saath adjust karna
combined effect ko reason karna mushkil banata hai.
\`\`\`

**max_tokens — response length pe ek hard ceiling, ek suggestion nahi:**

\`\`\`
max_tokens: 100 ka matlab hai model mid-generation cut off ho jaayega
agar uska response otherwise 100 tokens exceed kare — ye ek aisa
response produce kar sakta hai jo mid-sentence rukta hai. Ye ek
safety/cost limit hai, ek target length nahi; ek model se poocha gaya
"ek-sentence ka answer" max_tokens: 1000 ke saath abhi bhi (usually)
roughly ek sentence produce karega, PROMPT dwara guided, ceiling dwara
nahi.
\`\`\`

**Token counting aur basic cost math — Module 10 ke production concern
ke peeche numbers:**

\`\`\`
Pricing per token hoti hai, aur INPUT aur OUTPUT tokens typically
differently priced hote hain (output usually input se zyada cost karta
hai per token).

Rough estimate: ~4 characters of English text per token.

Example (illustrative numbers, current pricing nahi — apne provider ki
actual rates check karo):
  Input: "Summarize this 2,000-word article" + article khud
         ≈ 2,700 tokens
  Output: ek 150-word summary ≈ 200 tokens

  Agar input $3 per million tokens cost karta hai aur output $15 per
  million tokens:
    Input cost:  2,700 / 1,000,000 * $3  ≈ $0.0081
    Output cost:   200 / 1,000,000 * $15 ≈ $0.0030
    Is ek request ke liye total: ≈ $0.011

  Din mein aise 10,000 requests pe: ≈ $110/day — ek number jo ek
  product ki unit economics ke liye enormously matter karta hai, yahi
  exactly wajah hai ki Module 10 ise ek first-class design concern ki
  tarah treat karta hai, deploy hone ke baad ek baar check karne wala
  afterthought nahi.
\`\`\`

**Ye lesson module ko kyun close karta hai:** temperature/top_p/
max_tokens Module 1 ne describe kiye mechanism pe actual dials hain,
aur token counting wo actual unit hai jismein us mechanism ka cost
measure hota hai — yahan se aage is course mein liya gaya har concrete
decision (kaunsa model, kitna context include karna hai, stream karna
hai ya nahi) ka ek real, calculable cost aur behavior consequence hai
jo directly in parameters tak traceable hai.`,

    content: `## Why temperature is best understood as controlling randomness in
selection, not "creativity" as a vague concept

Mechanically, temperature scales the probability distribution Module 1
described the model as computing for the next token — a lower
temperature sharpens that distribution toward the single most likely
token (approaching fully deterministic selection as it goes toward
zero), while a higher temperature flattens it, giving less-likely tokens
a genuinely higher chance of being selected. "Creativity" is a reasonable
plain-language description of the RESULT, but understanding the actual
mechanism (reshaping a probability distribution before sampling from it)
is what lets you reason correctly about when a given temperature setting
will help versus hurt a specific task — a math problem doesn't benefit
from "creative" token selection, it benefits from consistently picking
the most probable (and, ideally, correct) continuation.

## Why max_tokens is a hard resource limit, and confusing it with a
length instruction causes real bugs

A common mistake is treating max_tokens as if it tells the model "aim
for about this length" — it doesn't; it's a hard ceiling enforced by the
API regardless of whether the model's response was actually finished.
Setting max_tokens too low for a task that genuinely needs a longer
response produces a response cut off mid-sentence, which is a real,
recurring production bug category, especially for tasks like structured
JSON output (Module 6) where a truncated response is often not just
incomplete but genuinely invalid as a parseable document. The actual
lever for response length is the prompt itself ("answer in one
sentence"), with max_tokens set generously enough to never be the actual
constraint under normal conditions.

## Why token-level cost math needs to be a first-class part of
feature design, not something checked after deployment

Because pricing scales directly with tokens processed (both input and
output, usually at different rates), a feature's design decisions —
how much context to include in every request, which model tier to use,
whether to cache repeated context — directly determine its ongoing
operating cost at a per-request level that then multiplies by real
usage volume. A feature designed without this math in mind can
technically work correctly while being commercially unviable at scale,
which is exactly the gap Module 10 exists to close by treating cost as
a genuine design constraint alongside correctness and latency.

## How this lesson's three concepts connect directly to what's ahead

Temperature and top_p resurface directly in Module 14's evaluation
discussion (a non-deterministic system is harder to test, and
temperature is the literal dial controlling how non-deterministic a
given call is); max_tokens resurfaces in Module 6's structured-output
lesson (a truncated JSON response is a specific, common failure mode to
guard against); and the token-cost math here is the exact foundation
Module 10 builds its full cost/latency/model-selection framework on top
of.`,

    contentHi: `## Temperature ko selection mein randomness control karne ki tarah samajhna kyun best hai, ek vague concept ki tarah "creativity" nahi

Mechanically, temperature us probability distribution ko scale karta hai
jise Module 1 ne describe kiya ki model agle token ke liye compute karta
hai — ek lower temperature us distribution ko single most likely token
ki taraf sharpen karta hai (zero ki taraf jaate hue fully deterministic
selection ke paas pahunchte hue), jabki ek higher temperature ise
flatten karta hai, less-likely tokens ko genuinely select hone ka ek
higher chance dete hue. "Creativity" RESULT ka ek reasonable plain-
language description hai, par actual mechanism ko samajhna (isse sample
karne se pehle ek probability distribution ko reshape karna) wo hai jo
aapko correctly reason karne deta hai ki ek given temperature setting
kab ek specific task ko help karegi versus hurt karegi — ek math problem
"creative" token selection se benefit nahi karta, ye consistently most
probable (aur, ideally, correct) continuation pick karne se benefit
karta hai.

## max_tokens ek hard resource limit kyun hai, aur ise ek length instruction se confuse karna real bugs cause karta hai

Ek common mistake max_tokens ko is tarah treat karna hai jaise ye model
ko batata hai "roughly is length ke liye aim karo" — ye nahi karta; ye
API dwara enforce ki gayi ek hard ceiling hai chahe model ka response
actually finished tha ya nahi. Ek task ke liye max_tokens ko bahut kam
set karna jise genuinely ek lambe response ki zaroorat hai ek response
produce karta hai jo mid-sentence cut off hota hai, jo ek real, recurring
production bug category hai, especially structured JSON output (Module
6) jaisi tasks ke liye jahan ek truncated response aksar sirf incomplete
nahi balki genuinely ek parseable document ki tarah invalid hota hai.
Response length ke liye actual lever prompt khud hai ("ek sentence mein
answer do"), max_tokens ko itna generously set kiya gaya ki ye normal
conditions ke under kabhi actual constraint na ho.

## Token-level cost math ko feature design ka ek first-class hissa kyun hona chahiye, deployment ke baad check ki jaane wali cheez nahi

Kyunki pricing directly process kiye gaye tokens ke saath scale karti hai
(dono input aur output, usually alag rates pe), ek feature ke design
decisions — har request mein kitna context include karna hai, kaunsa
model tier use karna hai, repeated context ko cache karna hai ya nahi —
directly iske ongoing operating cost ko ek per-request level pe
determine karte hain jo phir real usage volume se multiply hota hai. Ek
feature jo is math ko dhyaan mein rakhe bina design kiya gaya technically
correctly kaam kar sakta hai jabki scale par commercially unviable ho —
yahi exactly wo gap hai jise Module 10 close karne ke liye exist karta
hai cost ko correctness aur latency ke saath ek genuine design constraint
ki tarah treat karke.

## Ye lesson ke teen concepts directly aage kya hai se kaise connect karte hain

Temperature aur top_p directly Module 14 ki evaluation discussion mein
resurface hote hain (ek non-deterministic system test karna zyada
mushkil hai, aur temperature literal dial hai jo control karta hai ki
ek given call kitna non-deterministic hai); max_tokens Module 6 ke
structured-output lesson mein resurface hota hai (ek truncated JSON
response ek specific, common failure mode hai jiske against guard karna
hai); aur yahan ka token-cost math exact foundation hai jispe Module 10
apna poora cost/latency/model-selection framework build karta hai.`,

    examples: [
      {
        title: 'A simple token-and-cost estimator function used to budget a feature before shipping it',
        titleHi: 'Ek simple token-and-cost estimator function jo ek feature ko ship karne se pehle budget karne ke liye use kiya jata hai',
        codeJs: `// A rough pre-flight cost estimate — NOT exact token counts (use the
// provider's own tokenizer for that), but close enough to budget with
function estimateTokens(text) {
  return Math.ceil(text.length / 4); // ~4 chars per token, English
}

function estimateCost({ inputText, expectedOutputTokens, inputPricePerM, outputPricePerM }) {
  const inputTokens = estimateTokens(inputText);
  const inputCost = (inputTokens / 1_000_000) * inputPricePerM;
  const outputCost = (expectedOutputTokens / 1_000_000) * outputPricePerM;
  return {
    inputTokens,
    outputTokens: expectedOutputTokens,
    totalCost: inputCost + outputCost,
  };
}

const article = '... a 2000-word article ...'; // imagine full text here
const estimate = estimateCost({
  inputText: \`Summarize this article:\n\n\${article}\`,
  expectedOutputTokens: 200,
  inputPricePerM: 3,
  outputPricePerM: 15,
});

console.log(estimate);
// { inputTokens: ~2700, outputTokens: 200, totalCost: ~0.0111 }
console.log('Cost per 10,000 requests/day: $' + (estimate.totalCost * 10000).toFixed(2));`,
        codeTs: `// A rough pre-flight cost estimate — NOT exact token counts (use the
// provider's own tokenizer for that), but close enough to budget with
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4); // ~4 chars per token, English
}

interface CostEstimateInput {
  inputText: string;
  expectedOutputTokens: number;
  inputPricePerM: number;
  outputPricePerM: number;
}

function estimateCost({
  inputText,
  expectedOutputTokens,
  inputPricePerM,
  outputPricePerM,
}: CostEstimateInput): { inputTokens: number; outputTokens: number; totalCost: number } {
  const inputTokens = estimateTokens(inputText);
  const inputCost = (inputTokens / 1_000_000) * inputPricePerM;
  const outputCost = (expectedOutputTokens / 1_000_000) * outputPricePerM;
  return {
    inputTokens,
    outputTokens: expectedOutputTokens,
    totalCost: inputCost + outputCost,
  };
}

const article = '... a 2000-word article ...'; // imagine full text here
const estimate = estimateCost({
  inputText: \`Summarize this article:\n\n\${article}\`,
  expectedOutputTokens: 200,
  inputPricePerM: 3,
  outputPricePerM: 15,
});

console.log(estimate);
// { inputTokens: ~2700, outputTokens: 200, totalCost: ~0.0111 }
console.log('Cost per 10,000 requests/day: $' + (estimate.totalCost * 10000).toFixed(2));`,
        code: `function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}
function estimateCost({ inputText, expectedOutputTokens, inputPricePerM, outputPricePerM }) {
  const inputTokens = estimateTokens(inputText);
  const inputCost = (inputTokens / 1_000_000) * inputPricePerM;
  const outputCost = (expectedOutputTokens / 1_000_000) * outputPricePerM;
  return { inputTokens, outputTokens: expectedOutputTokens, totalCost: inputCost + outputCost };
}`,
        output:
          "{ inputTokens: ~2700, outputTokens: 200, totalCost: ~$0.0111 } — and at 10,000 requests/day, roughly $111/day, a concrete number a team can weigh against the feature's actual business value before shipping it.",
        explain:
          "This simple estimator turns an abstract 'AI features cost money per call' awareness into a concrete number that scales with real usage — exactly the kind of pre-flight budgeting Module 10 argues should happen at design time, not be discovered from a surprising bill after launch.",
        explainHi:
          "Ye simple estimator ek abstract 'AI features per call paisa cost karte hain' awareness ko ek concrete number mein badalta hai jo real usage ke saath scale karta hai — exactly wo kism ki pre-flight budgeting jo Module 10 argue karta hai design time pe honi chahiye, launch ke baad ek surprising bill se discover na ki jaaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Setting max_tokens as if it were a target length instruction
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 20, // "I want a short answer, so I'll set this low"
  messages: [{ role: 'user', content: 'Explain the causes of World War I.' }],
});
// The response is CUT OFF mid-sentence at 20 tokens — a genuinely
// complex topic can't fit, and max_tokens doesn't "know" to summarize
// more tightly; it just truncates whatever was being generated.`,
        right: `// Using the prompt to control length, and max_tokens as a generous safety ceiling
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500, // generous — won't be the actual constraint here
  messages: [{ role: 'user', content: 'Explain the causes of World War I in exactly two sentences.' }],
});
// The PROMPT'S instruction ("exactly two sentences") is what actually
// controls length; max_tokens just prevents a runaway response.`,
        why: "max_tokens is a hard ceiling enforced regardless of whether generation was logically complete — it will truncate mid-sentence rather than producing a shorter, complete answer. The prompt itself, not max_tokens, is the correct lever for controlling response length.",
        whyHi:
          "max_tokens ek hard ceiling hai jo enforce ki jaati hai chahe generation logically complete thi ya nahi — ye mid-sentence truncate karega ek chhota, complete answer produce karne ke bajaye. Prompt khud, max_tokens nahi, response length control karne ke liye correct lever hai.",
      },
    ],

    realWorld: [
      {
        en: "A production code-generation feature typically runs at a low temperature (e.g. 0.0-0.2) because consistent, syntactically-correct code matters far more than creative variety, while a marketing-copy brainstorming tool for the same company runs the same underlying model at a much higher temperature (e.g. 0.8-1.0) specifically because varied, less-predictable output is the actual goal.",
        hi: 'Ek production code-generation feature typically ek low temperature pe chalti hai (jaise 0.0-0.2) kyunki consistent, syntactically-correct code creative variety se kaafi zyada matter karta hai, jabki wahi company ke liye ek marketing-copy brainstorming tool wahi underlying model ko ek bahut higher temperature pe chalata hai (jaise 0.8-1.0) specifically kyunki varied, less-predictable output actual goal hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does the temperature parameter actually change about how a model generates text, mechanically?',
        qHi: 'Temperature parameter mechanically ek model ke text generate karne ke baare mein actually kya badalta hai?',
        a: "It scales the probability distribution the model computes over possible next tokens before one is sampled — lower temperature sharpens the distribution toward the single most likely token (more deterministic, consistent output), while higher temperature flattens it, giving less-likely-but-plausible tokens a genuinely higher chance of selection (more varied output).",
        aHi: 'Ye us probability distribution ko scale karta hai jo model possible next tokens ke upar compute karta hai ek sample hone se pehle — lower temperature distribution ko single most likely token ki taraf sharpen karta hai (zyada deterministic, consistent output), jabki higher temperature ise flatten karta hai, less-likely-but-plausible tokens ko genuinely selection ka ek higher chance dete hue (zyada varied output).',
      },
      {
        q: "Why is max_tokens described as a hard ceiling rather than a length target, and what problem does confusing the two cause?",
        qHi: 'max_tokens ko ek length target ke bajaye ek hard ceiling ki tarah kyun describe kiya jata hai, aur do ko confuse karna kya problem cause karta hai?',
        a: "The API enforces max_tokens as an absolute limit regardless of whether the model's response was logically complete — it truncates mid-generation rather than producing a shorter, coherent answer. Setting it too low for a task that needs more tokens produces a response cut off mid-sentence; the actual lever for controlling length is the prompt's own instructions, not this parameter.",
        aHi: 'API max_tokens ko ek absolute limit ki tarah enforce karti hai chahe model ka response logically complete tha ya nahi — ye mid-generation truncate karta hai ek chhota, coherent answer produce karne ke bajaye. Ek task ke liye ise bahut kam set karna jise zyada tokens chahiye ek response produce karta hai jo mid-sentence cut off hota hai; length control karne ke liye actual lever prompt ke apne instructions hain, ye parameter nahi.',
      },
    ],

    exercises: [
      {
        task: "Given a provider charging $3 per million input tokens and $15 per million output tokens, estimate the daily cost of a feature that runs 50,000 requests/day, each with roughly 1,500 input tokens and 300 output tokens. Show your calculation.",
        taskHi: 'Ek provider ko dekhte hue jo $3 per million input tokens aur $15 per million output tokens charge karta hai, ek feature ki daily cost estimate karo jo 50,000 requests/day chalata hai, har ek mein roughly 1,500 input tokens aur 300 output tokens. Apni calculation dikhao.',
        hint: "Compute input cost and output cost separately per request, sum them, then multiply by the daily request volume — following the exact structure of this lesson's worked example.",
        hintHi: 'Input cost aur output cost ko separately per request compute karo, unhe sum karo, phir daily request volume se multiply karo — is lesson ke worked example ki exact structure follow karte hue.',
      },
    ],

    keyTakeaways: [
      "Temperature scales the probability distribution over the next token before sampling — low temperature is near-deterministic and consistent, higher temperature allows more varied, less-predictable selection.",
      "max_tokens is a hard ceiling enforced by the API, not a length instruction — a response that would exceed it is truncated mid-generation; the prompt itself is the correct lever for controlling actual response length.",
      'Pricing is per token, usually at different rates for input vs. output, with roughly 4 characters of English per token — this scales directly with usage volume and needs to be estimated at design time, not discovered after launch.',
      "These three parameters are the literal, concrete dials on the mechanism Module 1 described — every later module's techniques (evaluation, cost optimization, structured output) trace back to controlling one of these.",
    ],
    keyTakeawaysHi: [
      'Temperature agle token ke upar probability distribution ko sample hone se pehle scale karta hai — low temperature near-deterministic aur consistent hai, higher temperature zyada varied, less-predictable selection allow karta hai.',
      'max_tokens API dwara enforce ki gayi ek hard ceiling hai, ek length instruction nahi — ek response jo ise exceed karega mid-generation truncate ho jaata hai; actual response length control karne ke liye correct lever prompt khud hai.',
      'Pricing per token hoti hai, usually input vs. output ke liye alag rates pe, roughly English ke 4 characters per token ke saath — ye directly usage volume ke saath scale karta hai aur design time pe estimate kiya jaana chahiye, launch ke baad discover nahi kiya jaana chahiye.',
      'Ye teen parameters Module 1 ne describe kiye mechanism pe literal, concrete dials hain — har baad wale module ki techniques (evaluation, cost optimization, structured output) in mein se ek ko control karne tak wapas trace hoti hain.',
    ],
  },
];
