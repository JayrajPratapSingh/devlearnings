/**
 * Generative AI Complete Course — Module 4: Streaming AI UI in a Web App, lessons 1-3.
 *
 * Lesson 1: The Vercel AI SDK's useChat/useCompletion hooks and the server route behind them.
 * Lesson 2: Handling partial/incomplete JSON while a structured response is still streaming.
 * Lesson 3: Abort/cancel and building the optimistic, responsive feel of a real chat interface.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_4: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-vercel-ai-sdk-usechat',
    title: 'The Vercel AI SDK — useChat and the Server Route Behind It',
    titleHi: 'Vercel AI SDK — useChat Aur Iske Peeche Ka Server Route',
    description:
      "Module 2 covered streaming at the raw SDK level — receiving deltas in a Node script. This lesson builds the actual web feature: a Next.js route that streams a model's response, and the Vercel AI SDK's useChat hook that consumes it, handling the SSE parsing and re-rendering automatically.",
    descriptionHi:
      "Module 2 ne streaming ko raw SDK level pe cover kiya — ek Node script mein deltas receive karna. Ye lesson actual web feature banata hai: ek Next.js route jo ek model ke response ko stream karta hai, aur Vercel AI SDK ka useChat hook jo ise consume karta hai, SSE parsing aur re-rendering automatically handle karte hue.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A live sports broadcast versus building your own antenna, tuner, and decoder from scratch to receive the same signal.** Module 2's raw streaming (a for-await loop over SDK events) is technically capable of receiving the same information a browser needs, the same way you could theoretically build your own radio receiver from raw components — but a broadcaster and a consumer television exist specifically so nobody has to rebuild that decoding logic themselves every time. The Vercel AI SDK's useChat hook is the television: it already knows how to tune into a streaming response, handle the connection dropping, manage the growing list of messages, and re-render as new content arrives, so a developer building a chat UI writes application-specific logic instead of re-solving \"how do I consume Server-Sent Events reliably in a React component\" from first principles every single time.",
      hi: 'Ek live sports broadcast versus wahi signal receive karne ke liye apna khud ka antenna, tuner, aur decoder scratch se banana. Module 2 ki raw streaming (SDK events ke upar ek for-await loop) technically wahi information receive karne mein capable hai jo ek browser ko chahiye, wahi tarike se jaise aap theoretically apna khud ka radio receiver raw components se bana sakte ho — par ek broadcaster aur ek consumer television specifically isliye exist karte hain taaki kisi ko har baar khud us decoding logic ko rebuild na karna pade. Vercel AI SDK ka useChat hook wo television hai: ise pehle se pata hai ki ek streaming response ko kaise tune karna hai, connection drop hone ko kaise handle karna hai, messages ki badhti hui list ko manage karna hai, aur naya content aane pe re-render karna hai, taaki ek chat UI banane wala developer application-specific logic likhe "main React component mein Server-Sent Events ko reliably kaise consume karoon" ko first principles se har single baar re-solve karne ke bajaye.',
    },

    simple: `**The two halves of a streaming chat feature — a server route that
streams, and a client hook that consumes:**

\`\`\`ts
// app/api/chat/route.ts — the server side: streams the model's response
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    messages, // the exact role-tagged array from Module 2, Lesson 1
  });

  return result.toDataStreamResponse(); // handles the SSE formatting
}
\`\`\`

\`\`\`tsx
// app/chat/page.tsx — the client side: consumes the stream
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}><strong>{m.role}:</strong> {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
\`\`\`

**What useChat is actually doing under the hood, mapped directly to
concepts already covered:**

\`\`\`
1. handleSubmit appends the new user message to an internal messages
   array (Module 2, Lesson 1's message-array shape) and POSTs the FULL
   array to your route — the server has no memory, so the client must
   resend everything, exactly as established.

2. The route calls the model with streaming (Module 2, Lesson 2) and
   returns a Server-Sent Events response.

3. useChat parses those SSE events as they arrive and incrementally
   updates the LAST message in its messages array, token by token —
   this is why the UI shows text appearing progressively rather than
   all at once.

4. Once the stream ends, the completed assistant message is finalized
   in the array, ready to be included in the NEXT request's history.
\`\`\`

**Why this hook exists instead of every team hand-rolling the same
SSE-parsing and state-management code:** the mechanics of consuming a
streaming response in a React component — parsing incremental events,
updating state without janky re-renders, handling a dropped connection,
managing loading/error states — are the same for almost every chat
feature. This is the same "don't repeat yourself" reasoning behind any
shared library or framework hook: the underlying streaming mechanism
(Module 2) doesn't change, only how much of its plumbing a developer has
to write by hand.

**Why the server route still matters, even with a hook doing the
client work:** the API key that authenticates with Anthropic/OpenAI
must never reach the browser (a browser-exposed key can be extracted and
abused by anyone). The route runs server-side, holds the real API key in
an environment variable, and the browser only ever talks to YOUR route
— this is the same secrets-never-reach-the-client discipline this
platform's own security modules established for any other credential.`,

    simpleHi: `**Ek streaming chat feature ke do halves — ek server route jo
stream karta hai, aur ek client hook jo consume karta hai:**

\`\`\`ts
// app/api/chat/route.ts — server side: model ke response ko stream karta hai
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    messages, // Module 2, Lesson 1 wala exact role-tagged array
  });

  return result.toDataStreamResponse(); // SSE formatting handle karta hai
}
\`\`\`

\`\`\`tsx
// app/chat/page.tsx — client side: stream ko consume karta hai
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}><strong>{m.role}:</strong> {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
\`\`\`

**useChat under the hood actually kya kar raha hai, already cover kiye
concepts se directly mapped:**

\`\`\`
1. handleSubmit naye user message ko ek internal messages array (Module 2,
   Lesson 1 wali message-array shape) mein append karta hai aur POORE
   array ko aapke route pe POST karta hai — server ke paas koi memory
   nahi hai, isliye client ko sab kuch resend karna hoga, exactly jaise
   established kiya gaya.

2. Route model ko streaming (Module 2, Lesson 2) ke saath call karta hai
   aur ek Server-Sent Events response return karta hai.

3. useChat un SSE events ko parse karta hai jaise wo aate hain aur
   apne messages array mein LAST message ko incrementally update karta
   hai, token by token — yahi wajah hai ki UI text ko progressively
   appear hote dikhata hai ek saath nahi.

4. Ek baar stream khatam ho jaaye, completed assistant message array
   mein finalize ho jata hai, NEXT request ki history mein include hone
   ke liye ready.
\`\`\`

**Ye hook har team ke hisse ke SSE-parsing aur state-management code ko
hand-roll karne ke bajaye kyun exist karta hai:** ek React component
mein ek streaming response consume karne ki mechanics — incremental
events parse karna, janky re-renders ke bina state update karna, ek
dropped connection handle karna, loading/error states manage karna —
almost har chat feature ke liye wahi hain. Ye wahi "don't repeat
yourself" reasoning hai kisi bhi shared library ya framework hook ke
peeche: underlying streaming mechanism (Module 2) nahi badalta, sirf ye
badalta hai ki ek developer ko kitna plumbing hand se likhna padta hai.

**Server route abhi bhi kyun matter karta hai, client work karne wale
ek hook ke saath bhi:** wo API key jo Anthropic/OpenAI ke saath
authenticate karti hai kabhi browser tak nahi pahunchni chahiye (ek
browser-exposed key ko extract kiya ja sakta hai aur koi bhi ise abuse
kar sakta hai). Route server-side chalta hai, real API key ko ek
environment variable mein hold karta hai, aur browser sirf kabhi AAPKE
route se baat karta hai — ye wahi secrets-never-reach-the-client
discipline hai jo is platform ke apne security modules ne kisi bhi
doosre credential ke liye establish ki.`,

    content: `## Why a chat feature needs both a server route and a client hook,
not just one or the other

The server route exists because the model call must happen where the
API key lives — server-side, never in browser-shipped code. The client
hook exists because consuming a streaming response and managing an
evolving conversation's UI state (Module 2's message array, growing
with every turn) involves genuine, non-trivial plumbing that's
identical across nearly every chat feature. Neither piece can be
skipped: putting the model call client-side would leak the API key;
skipping the hook and hand-rolling SSE parsing in every component would
mean re-solving the same problem repeatedly.

## Why understanding useChat's internals matters even though the hook
handles them automatically

A developer who understands that useChat is, underneath, doing exactly
what Module 2 described — resending the full message array, parsing
incremental SSE deltas, updating the last message progressively — can
correctly debug it when something goes wrong (a message not updating,
a connection dropping mid-stream) instead of treating the hook as an
opaque black box. This mirrors a judgment call this course has made
before: understanding attention's consequence (Module 1) without
needing its matrix math, or understanding SSE without needing to
hand-write a parser — the abstraction is a legitimate convenience once
its underlying mechanism is understood, not something to blindly trust
without that understanding.

## Why the API key's location is a genuine security boundary, not an
implementation detail

If the streamText() call happened directly in a client component, the
API key would need to be embedded in JavaScript shipped to every
visitor's browser — trivially extractable by opening browser
devtools, after which anyone could make requests billed to that key
without limit. Keeping the model call in a server route, with the key
only ever present in a server-side environment variable, is the same
"secrets never reach the client" principle this platform's earlier
security-focused modules established for database credentials, signing
keys, and any other sensitive value — an AI provider's API key is not a
special exception to that rule.

## How this sets up the rest of the module

This lesson establishes the basic request/response shape of a streaming
chat feature. Lesson 2 covers a specific complication this same
streaming mechanism introduces once you want STRUCTURED (not just plain
text) output mid-stream; Lesson 3 covers cancellation and the perceived-
responsiveness techniques (optimistic UI) that make a chat interface
feel genuinely fast, building directly on the request/response
foundation this lesson establishes.`,

    contentHi: `## Ek chat feature ko dono server route aur client hook kyun chahiye, sirf ek ya doosra nahi

Server route isliye exist karta hai kyunki model call wahin hona
chahiye jahan API key rehti hai — server-side, kabhi browser-shipped
code mein nahi. Client hook isliye exist karta hai kyunki ek streaming
response consume karna aur ek evolving conversation ka UI state manage
karna (Module 2 ka message array, har turn ke saath badhta hua) genuine,
non-trivial plumbing involve karta hai jo almost har chat feature ke
across identical hai. Koi bhi piece skip nahi ho sakta: model call ko
client-side rakhna API key leak karega; hook skip karke har component
mein SSE parsing hand-roll karna matlab hoga wahi problem baar baar
re-solve karna.

## useChat ke internals ko samajhna kyun matter karta hai chahe hook unhe automatically handle karta hai

Ek developer jo samajhta hai ki useChat, niche, exactly wahi kar raha hai
jo Module 2 ne describe kiya — poora message array resend karna,
incremental SSE deltas parse karna, last message ko progressively
update karna — jab kuch galat ho toh use correctly debug kar sakta hai
(ek message update na hona, ek connection mid-stream drop hona) hook ko
ek opaque black box treat karne ke bajaye. Ye ek judgment call ko mirror
karta hai jo is course ne pehle bhi kiya hai: attention ke consequence
(Module 1) ko samajhna uske matrix math ki zaroorat ke bina, ya SSE ko
samajhna ek parser hand-write karne ki zaroorat ke bina — abstraction
ek legitimate convenience hai ek baar iska underlying mechanism samajh
liya jaaye, kuch aisa nahi jise us understanding ke bina blindly trust
kiya jaaye.

## API key ki location ek genuine security boundary kyun hai, ek implementation detail nahi

Agar streamText() call directly ek client component mein hoti, API key
ko har visitor ke browser ko ship ki gayi JavaScript mein embed karna
padta — browser devtools khol kar trivially extractable, jiske baad
koi bhi bina kisi limit ke us key pe billed requests bana sakta tha.
Model call ko ek server route mein rakhna, key ko sirf ek server-side
environment variable mein present rakhte hue, wahi "secrets never reach
the client" principle hai jo is platform ke earlier security-focused
modules ne database credentials, signing keys, aur kisi bhi doosre
sensitive value ke liye establish kiya — ek AI provider ki API key us
rule ka koi special exception nahi hai.

## Ye baaki module ko kaise set up karta hai

Ye lesson ek streaming chat feature ka basic request/response shape
establish karta hai. Lesson 2 ek specific complication cover karta hai
jise wahi streaming mechanism introduce karta hai ek baar aapko
STRUCTURED (sirf plain text nahi) output mid-stream chahiye; Lesson 3
cancellation aur perceived-responsiveness techniques (optimistic UI)
cover karta hai jo ek chat interface ko genuinely fast feel karati hain,
directly is lesson ke establish kiye request/response foundation pe
build karte hue.`,

    examples: [
      {
        title: 'A complete minimal streaming chat feature — server route and client component',
        titleHi: 'Ek complete minimal streaming chat feature — server route aur client component',
        codeJs: `// app/api/chat/route.js
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: 'You are a helpful assistant that answers concisely.',
    messages,
  });

  return result.toDataStreamResponse();
}

// app/chat/page.jsx
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}><strong>{m.role}:</strong> {m.content}</p>
      ))}
      {isLoading && <p>Thinking…</p>}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask something…" />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}`,
        codeTs: `// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { CoreMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: 'You are a helpful assistant that answers concisely.',
    messages,
  });

  return result.toDataStreamResponse();
}

// app/chat/page.tsx
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}><strong>{m.role}:</strong> {m.content}</p>
      ))}
      {isLoading && <p>Thinking…</p>}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask something…" />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}`,
        code: `// Server
const result = streamText({ model: anthropic('claude-sonnet-4-5'), messages });
return result.toDataStreamResponse();

// Client
const { messages, input, handleInputChange, handleSubmit } = useChat();`,
        output:
          "Typing a message and submitting shows the user's message immediately, then the assistant's reply appears progressively, word by word, as the stream arrives — with `isLoading` true for the duration, letting the UI show a 'Thinking…' indicator and disable the input.",
        explain:
          "Every piece maps to a previously established concept: the route's `messages` parameter is Module 2's role-tagged array, `toDataStreamResponse()` is the SSE mechanism from Module 2, and useChat's incremental updates are the client-side consumption of that same stream — nothing here is a new fundamental idea, just an assembled, production-shaped version of concepts already covered.",
        explainHi:
          "Har piece ek previously established concept se maps karta hai: route ka `messages` parameter Module 2 ka role-tagged array hai, `toDataStreamResponse()` Module 2 ka SSE mechanism hai, aur useChat ke incremental updates wahi stream ka client-side consumption hain — yahan kuch bhi naya fundamental idea nahi hai, sirf already cover kiye concepts ka ek assembled, production-shaped version hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Calling the model directly from a client component — leaks the API key
'use client';
import Anthropic from '@anthropic-ai/sdk';

// NEXT_PUBLIC_ prefix ships this value to every visitor's browser
const anthropic = new Anthropic({ apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY });

export default function ChatPage() {
  async function send(text) {
    // This request, and the API key used to authenticate it, is fully
    // visible in the browser's network tab and shipped JS bundle.
    const response = await anthropic.messages.create({ /* ... */ });
  }
  // ...
}`,
        right: `// Keeping the model call in a server route; the client only calls YOUR route
// app/api/chat/route.ts — server-side, key stays in a non-public env var
import { anthropic } from '@ai-sdk/anthropic';
const model = anthropic('claude-sonnet-4-5'); // uses ANTHROPIC_API_KEY server-side

// app/chat/page.tsx — client-side, never sees the real API key
'use client';
import { useChat } from 'ai/react';
export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat(); // POSTs to /api/chat
  // ...
}`,
        why: "Any environment variable prefixed NEXT_PUBLIC_ (or otherwise bundled into client-side JavaScript) is fully visible to anyone who opens browser devtools — an AI provider's API key exposed this way can be extracted and used by anyone, with charges billed to the original owner. The model call must stay server-side.",
        whyHi:
          "NEXT_PUBLIC_ prefix wali (ya otherwise client-side JavaScript mein bundled) koi bhi environment variable kisi ke liye bhi poori tarah visible hai jo browser devtools kholta hai — is tarike se exposed ek AI provider ki API key extract ki ja sakti hai aur koi bhi use kar sakta hai, charges original owner ko billed hote hue. Model call server-side rehna chahiye.",
      },
    ],

    realWorld: [
      {
        en: "Every production Next.js AI chat feature (customer support widgets, in-app assistants) follows this exact split — a server route holding the API key and calling the model, a client hook (useChat or an equivalent) managing the conversational UI state — specifically because the API key must never be shipped to the browser, the same principle applied to any other server-side secret.",
        hi: 'Har production Next.js AI chat feature (customer support widgets, in-app assistants) exactly yahi split follow karta hai — ek server route jo API key hold karta hai aur model call karta hai, ek client hook (useChat ya ek equivalent) jo conversational UI state manage karta hai — specifically kyunki API key ko kabhi browser ko ship nahi kiya jaana chahiye, wahi principle jo kisi bhi doosre server-side secret pe applied hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't a chat feature call an AI provider's API directly from a client-side React component?",
        qHi: 'Ek chat feature ek AI provider ka API directly ek client-side React component se kyun call nahi kar sakta?',
        a: "The call requires an API key, and any value present in client-side JavaScript is fully visible to anyone inspecting the browser's network requests or bundled code. A server route keeps the model call — and the API key — entirely server-side, with the browser only ever communicating with your own route, never directly with the AI provider.",
        aHi: 'Call ke liye ek API key chahiye, aur client-side JavaScript mein present koi bhi value kisi ke liye bhi poori tarah visible hai jo browser ki network requests ya bundled code inspect karta hai. Ek server route model call ko — aur API key ko — poori tarah server-side rakhta hai, browser sirf kabhi aapke apne route se communicate karta hai, directly AI provider se kabhi nahi.',
      },
      {
        q: "What is useChat actually doing, mechanically, in terms of concepts already established in Module 2?",
        qHi: 'useChat actually kya kar raha hai, mechanically, un concepts ke terms mein jo already Module 2 mein establish kiye gaye?',
        a: "It resends the full growing message array (Module 2's role-tagged shape) with every submission, sends it to a server route that streams the model's response (Module 2's streaming mechanism via Server-Sent Events), and incrementally updates the last message in its state as SSE deltas arrive — the same underlying request/response and streaming mechanics, wrapped in a hook so a developer doesn't rebuild that plumbing by hand.",
        aHi: 'Ye poore badhte hue message array (Module 2 ki role-tagged shape) ko har submission ke saath resend karta hai, ise ek server route pe bhejta hai jo model ke response ko stream karta hai (Server-Sent Events ke through Module 2 ka streaming mechanism), aur apne state mein last message ko incrementally update karta hai jaise SSE deltas aate hain — wahi underlying request/response aur streaming mechanics, ek hook mein wrapped taaki ek developer us plumbing ko hand se rebuild na kare.',
      },
    ],

    exercises: [
      {
        task: "A junior developer suggests putting the Anthropic API key directly in a client component to 'simplify the code and skip building a separate route.' Explain, using this lesson's reasoning, exactly what would go wrong in production if this were shipped.",
        taskHi: 'Ek junior developer suggest karta hai Anthropic API key ko directly ek client component mein daalne ke liye "code simplify karne aur ek separate route banane se bachne ke liye." Is lesson ki reasoning use karke exactly explain karo ki agar ye ship kiya jaata to production mein kya galat hota.',
        hint: "Think about who can see the contents of client-side JavaScript, and what someone with the API key could then do with it.",
        hintHi: 'Socho ki client-side JavaScript ke contents kaun dekh sakta hai, aur API key ke saath koi phir uske saath kya kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "A streaming chat feature needs both a server route (holding the API key, calling the model) and a client hook (consuming the stream, managing UI state) — neither can be skipped without either leaking credentials or re-solving already-solved plumbing.",
      "useChat resends the full message array (Module 2) with every submission and incrementally updates the UI as SSE deltas (Module 2's streaming mechanism) arrive — it's an abstraction over concepts already established, not a new fundamental mechanism.",
      "An AI provider's API key must never reach client-side JavaScript (including via a NEXT_PUBLIC_ prefix) — the same secrets-never-reach-the-client discipline this platform applies to any other credential.",
      "Understanding what a convenience hook does underneath lets a developer debug it correctly when something goes wrong, rather than treating it as an untrustworthy black box.",
    ],
    keyTakeawaysHi: [
      'Ek streaming chat feature ko dono ek server route (API key hold karte hue, model call karte hue) aur ek client hook (stream consume karte hue, UI state manage karte hue) chahiye — koi bhi credentials leak kiye ya already-solved plumbing re-solve kiye bina skip nahi kiya ja sakta.',
      'useChat poore message array (Module 2) ko har submission ke saath resend karta hai aur UI ko incrementally update karta hai jaise SSE deltas (Module 2 ka streaming mechanism) aate hain — ye already established concepts ke upar ek abstraction hai, ek naya fundamental mechanism nahi.',
      'Ek AI provider ki API key kabhi client-side JavaScript tak nahi pahunchni chahiye (NEXT_PUBLIC_ prefix ke through samet) — wahi secrets-never-reach-the-client discipline jo ye platform kisi bhi doosre credential pe apply karta hai.',
      'Ye samajhna ki ek convenience hook niche kya karta hai ek developer ko ise correctly debug karne deta hai jab kuch galat ho, ise ek untrustworthy black box treat karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-partial-json-while-streaming',
    title: 'Handling Partial JSON While Streaming',
    titleHi: 'Streaming Ke Dauran Partial JSON Handle Karna',
    description:
      "Combining Module 3's structured output with streaming creates a specific new problem: at any moment mid-stream, the JSON received so far is genuinely incomplete and won't parse — this lesson covers the actual techniques for handling that gracefully in a UI.",
    descriptionHi:
      'Module 3 ke structured output ko streaming ke saath combine karna ek specific naya problem create karta hai: mid-stream kisi bhi moment pe, ab tak receive hua JSON genuinely incomplete hai aur parse nahi hoga — ye lesson us cheez ko ek UI mein gracefully handle karne ke actual techniques cover karta hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "**Watching a house being built from a live construction camera versus waiting for a single \"house complete\" photo at the end.** If you check the construction camera partway through, you see a foundation and half-built walls — genuinely useful, real progress, but if someone asked you \"is this a complete, livable house\" based on that half-finished view, the honest answer is no, not yet. Trying to treat a half-built structure as if it must already satisfy every requirement of a finished house is the wrong question at that moment; the right question is \"is progress happening correctly toward the final shape.\" A structured JSON response streaming in behaves exactly like the half-built house: at any point mid-stream, \`{\"name\": \"Priya\", \"emai\` is genuinely not valid, parseable JSON — that's not a bug, it's the expected state of an in-progress structure, and the correct handling is treating it as a real, growing partial state rather than repeatedly trying to force-parse it as if it should already be complete.",
      hi: 'Ek ghar ko ek live construction camera se bante hue dekhna versus end mein ek single "ghar complete" photo ka wait karna. Agar aap construction camera ko beech mein check karte ho, aapko ek foundation aur half-built walls dikhti hain — genuinely useful, real progress, par agar koi aapse poochhe "kya ye ek complete, livable house hai" us half-finished view ke basis pe, honest answer hai nahi, abhi nahi. Ek half-built structure ko treat karna jaise ise already ek finished house ki har requirement satisfy karni chahiye us moment pe galat question hai; sahi question hai "kya progress correctly ho raha hai final shape ki taraf." Ek structured JSON response jo stream ho raha hai exactly half-built house ki tarah behave karta hai: mid-stream kisi bhi point pe, \`{"name": "Priya", "emai\` genuinely valid, parseable JSON nahi hai — ye ek bug nahi hai, ye ek in-progress structure ki expected state hai, aur correct handling ise ek real, growing partial state ki tarah treat karna hai use repeatedly force-parse karne ki koshish karne ke bajaye jaise ise already complete hona chahiye.',
    },

    simple: `**The specific problem — structured output (Module 3) plus
streaming (Module 2) means genuinely incomplete JSON at every
intermediate moment:**

\`\`\`
Time T1: {"name": "Priya"
Time T2: {"name": "Priya", "emai
Time T3: {"name": "Priya", "email": "p@example.
Time T4: {"name": "Priya", "email": "p@example.com", "age": 2
Time T5: {"name": "Priya", "email": "p@example.com", "age": 28}

JSON.parse() on T1 through T4 THROWS — this is expected, correct
behavior of a genuinely incomplete string, not a bug to work around.
\`\`\`

**Approach 1 — wait for the full stream, then parse once (simplest,
loses the live-updating feel):**

\`\`\`ts
import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const schema = z.object({ name: z.string(), email: z.string(), age: z.number() });

const result = streamObject({
  model: anthropic('claude-sonnet-4-5'),
  schema,
  prompt: 'Extract the person\\'s info: "Priya, p@example.com, 28 years old"',
});

// Waits for the object to be fully valid before using it
const finalObject = await result.object; // { name: 'Priya', email: '...', age: 28 }
\`\`\`

**Approach 2 — use a partial-JSON-aware parser, updating the UI as
fields genuinely become available (the more common production
pattern):**

\`\`\`ts
const result = streamObject({
  model: anthropic('claude-sonnet-4-5'),
  schema,
  prompt: 'Extract the person\\'s info: "Priya, p@example.com, 28 years old"',
});

// partialObjectStream yields progressively more-complete PARTIAL
// objects — fields that have finished streaming are present and typed,
// fields still in progress are simply absent, not malformed
for await (const partial of result.partialObjectStream) {
  console.log(partial);
  // { name: 'Priya' }
  // { name: 'Priya', email: 'p@example.com' }
  // { name: 'Priya', email: 'p@example.com', age: 28 }
}
\`\`\`

**Why the SDK's built-in partial-object streaming is the right tool,
rather than hand-parsing incomplete JSON string fragments:** the naive
approach — repeatedly calling JSON.parse() on a growing string and
catching the inevitable errors — works by accident some of the time and
produces genuinely wrong results other times (a string field that LOOKS
complete because a quote happened to close, but is actually still
growing). A dedicated partial-JSON parser understands JSON's actual
grammar well enough to know which fields are genuinely complete versus
still in progress, which hand-rolled try/catch parsing cannot reliably
distinguish.

**When to use which approach:** wait-for-the-full-object (Approach 1)
when the object is small and the delay before showing anything is
acceptable, or when partial data would be actively misleading (a partial
financial calculation, a partially-generated confirmation ID); use
partial-object streaming (Approach 2) when the object has multiple
independent fields and showing them as they individually complete
genuinely improves perceived responsiveness — a form auto-filling from
an uploaded document, for instance, where each field becoming visible as
soon as it's ready feels responsive rather than confusing.`,

    simpleHi: `**Specific problem — structured output (Module 3) plus streaming
(Module 2) ka matlab hai genuinely incomplete JSON har intermediate
moment pe:**

\`\`\`
Time T1: {"name": "Priya"
Time T2: {"name": "Priya", "emai
Time T3: {"name": "Priya", "email": "p@example.
Time T4: {"name": "Priya", "email": "p@example.com", "age": 2
Time T5: {"name": "Priya", "email": "p@example.com", "age": 28}

T1 se T4 tak JSON.parse() THROW karta hai — ye expected, correct
behavior hai ek genuinely incomplete string ka, koi bug nahi jise work
around karna hai.
\`\`\`

**Approach 1 — poore stream ka wait karo, phir ek baar parse karo
(simplest, live-updating feel khota hai):**

\`\`\`ts
import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const schema = z.object({ name: z.string(), email: z.string(), age: z.number() });

const result = streamObject({
  model: anthropic('claude-sonnet-4-5'),
  schema,
  prompt: 'Extract the person\\'s info: "Priya, p@example.com, 28 years old"',
});

// Object ke poori tarah valid hone ka wait karta hai use karne se pehle
const finalObject = await result.object; // { name: 'Priya', email: '...', age: 28 }
\`\`\`

**Approach 2 — ek partial-JSON-aware parser use karo, UI ko update
karte hue jaise fields genuinely available hoti hain (zyada common
production pattern):**

\`\`\`ts
const result = streamObject({
  model: anthropic('claude-sonnet-4-5'),
  schema,
  prompt: 'Extract the person\\'s info: "Priya, p@example.com, 28 years old"',
});

// partialObjectStream progressively zyada-complete PARTIAL objects
// yield karta hai — fields jo stream hoke finish ho chuki hain present
// aur typed hain, fields jo abhi bhi in progress hain simply absent
// hain, malformed nahi
for await (const partial of result.partialObjectStream) {
  console.log(partial);
  // { name: 'Priya' }
  // { name: 'Priya', email: 'p@example.com' }
  // { name: 'Priya', email: 'p@example.com', age: 28 }
}
\`\`\`

**SDK ka built-in partial-object streaming sahi tool kyun hai,
incomplete JSON string fragments ko hand-parse karne ke bajaye:** naive
approach — ek badhte hue string pe repeatedly JSON.parse() call karna
aur inevitable errors ko catch karna — kabhi kabhi accident se kaam
karta hai aur kabhi kabhi genuinely galat results produce karta hai (ek
string field jo COMPLETE dikhti hai kyunki ek quote close ho gaya, par
actually abhi bhi badh raha hai). Ek dedicated partial-JSON parser JSON
ke actual grammar ko itni achhi tarah samajhta hai ki jaane ki kaunse
fields genuinely complete hain versus abhi bhi in progress, jise
hand-rolled try/catch parsing reliably distinguish nahi kar sakta.

**Kaunsa approach kab use karna hai:** wait-for-the-full-object
(Approach 1) jab object chhota ho aur kuch dikhane se pehle delay
acceptable ho, ya jab partial data actively misleading ho sakta hai
(ek partial financial calculation, ek partially-generated confirmation
ID); partial-object streaming (Approach 2) use karo jab object ke paas
multiple independent fields hon aur unhe individually complete hote
hue dikhana genuinely perceived responsiveness improve karta hai — ek
form jo ek uploaded document se auto-fill hota hai, jaise, jahan har
field ready hote hi visible hona confusing ke bajaye responsive feel
karta hai.`,

    content: `## Why partial JSON is the expected, correct state during
streaming, not an error condition

This is a direct consequence of combining two things this course
already established: streaming delivers content incrementally (Module
2), and structured output specifies an exact JSON shape (Module 3) —
combining them means the JSON string genuinely does not exist in valid
form until the very last token of the structure has arrived. Treating a
mid-stream parse failure as a bug to catch and retry misunderstands the
actual state of the system; the string isn't malformed, it's simply
not yet finished, and the correct mental model is "a growing, valid
prefix of an eventually-complete structure," not "a broken attempt at a
complete structure."

## Why hand-rolled incomplete-JSON parsing is genuinely unreliable

A naive approach of repeatedly attempting JSON.parse() and catching
failures can produce a specific class of wrong result: a string value
that happens to have its closing quote appear before the field is
actually semantically complete looks parseable but isn't representing
the model's actual final intent yet, and other structural ambiguities
(is this array finished, or is there another element coming?) can't be
resolved by a simple try/catch. A parser that understands JSON's actual
grammar deeply enough to track exactly which parts of the structure are
provably complete versus still open is required to handle this
correctly — which is exactly what the AI SDK's partial-object streaming
provides, rather than something worth re-implementing per project.

## Why the choice between waiting-for-complete and streaming-partial
values is a genuine design decision, not a default to always make the
same way

Some data is meaningfully useful in partial form (a form auto-filling
field by field, a live-updating outline as sections are drafted); other
data is actively misleading if shown incomplete (a financial total that
looks final but is still being computed, a confirmation code that
appears complete but has more digits coming). The right choice depends
on whether a visitor seeing a genuinely partial value could reasonably
misinterpret it as final — the same category of judgment call Module 2
raised for choosing streaming vs. non-streaming in general, applied
specifically to structured data.

## How this connects forward to tool calling and RAG

Module 5's tool calling involves the model producing structured
arguments for a tool call, which streams through this exact same
partial-JSON problem before the arguments are complete enough to safely
execute the tool — a tool must never be invoked with genuinely
incomplete arguments, which is why Module 5 waits for a tool call's
arguments to be fully streamed before executing it, even in an otherwise
fully-streaming interface. Understanding this lesson's distinction
(partial values safe to show vs. values that must be complete before
use) is exactly the judgment Module 5 depends on.`,

    contentHi: `## Partial JSON streaming ke dauran expected, correct state kyun hai, ek error condition nahi

Ye is course ne already establish ki do cheezon ko combine karne ka ek
direct consequence hai: streaming content ko incrementally deliver
karta hai (Module 2), aur structured output ek exact JSON shape specify
karta hai (Module 3) — dono ko combine karna matlab hai JSON string
genuinely valid form mein exist hi nahi karta jab tak structure ka
bilkul last token arrive na ho jaaye. Ek mid-stream parse failure ko ek
bug ki tarah treat karna jise catch aur retry karna hai system ki actual
state ko misunderstand karta hai; string malformed nahi hai, ye simply
abhi finished nahi hai, aur correct mental model "ek eventually-complete
structure ka ek growing, valid prefix" hai, "ek complete structure ki ek
broken attempt" nahi.

## Hand-rolled incomplete-JSON parsing genuinely unreliable kyun hai

JSON.parse() ko repeatedly attempt karne aur failures ko catch karne ka
ek naive approach ek specific class ka galat result produce kar sakta
hai: ek string value jiska closing quote field ke actually
semantically complete hone se pehle appear ho jata hai parseable dikhti
hai par model ke actual final intent ko abhi represent nahi kar rahi, aur
doosri structural ambiguities (kya ye array finished hai, ya ek aur
element aana baaki hai?) ek simple try/catch se resolve nahi ki ja
sakti. Ek parser jo JSON ke actual grammar ko itna deeply samajhta hai
ki track kare exactly kaunse parts of structure provably complete hain
versus abhi bhi open hain ise correctly handle karne ke liye zaroori
hai — jo exactly wo hai jo AI SDK ka partial-object streaming provide
karta hai, per project re-implement karne layak kuch nahi.

## Waiting-for-complete aur streaming-partial values ke beech choice ek genuine design decision kyun hai, hamesha wahi tareeke se karne wala ek default nahi

Kuch data meaningfully useful hai partial form mein (ek form jo field by
field auto-fill hota hai, ek live-updating outline jaise sections draft
hote hain); doosra data actively misleading hai agar incomplete dikhaya
jaaye (ek financial total jo final dikhta hai par abhi bhi compute ho
raha hai, ek confirmation code jo complete dikhta hai par aur digits
aana baaki hai). Sahi choice is baat pe depend karti hai ki kya ek
visitor jo ek genuinely partial value dekh raha hai use reasonably final
ki tarah misinterpret kar sakta hai — wahi category ka judgment call jo
Module 2 ne general mein streaming vs. non-streaming choose karne ke
liye raise kiya, specifically structured data pe applied.

## Ye forward tool calling aur RAG se kaise connect karta hai

Module 5 ka tool calling model ko ek tool call ke liye structured
arguments produce karne mein involve karta hai, jo exactly wahi
partial-JSON problem se stream hota hai arguments ke poore tarah stream
hone se pehle taaki safely tool execute ki ja sake — ek tool ko kabhi
genuinely incomplete arguments ke saath invoke nahi kiya jaana chahiye,
yahi wajah hai Module 5 ek tool call ke arguments ke poore tarah stream
hone ka wait karta hai use execute karne se pehle, ek otherwise fully-
streaming interface mein bhi. Is lesson ki distinction (partial values
jo dikhane ke liye safe hain vs. values jo use se pehle complete hone
chahiye) exactly wo judgment hai jispe Module 5 depend karta hai.`,

    examples: [
      {
        title: 'Streaming a structured object into a form UI that fills in field by field as each becomes complete',
        titleHi: 'Ek structured object ko ek form UI mein stream karna jo har field complete hote hi field by field fill hota hai',
        codeJs: `import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  invoiceNumber: z.string(),
  totalAmount: z.number(),
});

async function extractInvoiceFields(invoiceText, onUpdate) {
  const result = streamObject({
    model: anthropic('claude-sonnet-4-5'),
    schema: invoiceSchema,
    prompt: \`Extract invoice fields from this text:\n\n\${invoiceText}\`,
  });

  // Each yielded value is a PARTIAL object — fields present are
  // genuinely complete and correctly typed; absent fields are simply
  // still being generated, not malformed
  for await (const partial of result.partialObjectStream) {
    onUpdate(partial); // e.g. re-render a form, filling fields as ready
  }

  return await result.object; // the final, fully-validated object
}

await extractInvoiceFields(rawInvoiceText, (partial) => {
  console.log('Form now shows:', partial);
  // { vendorName: 'Acme Corp' }
  // { vendorName: 'Acme Corp', invoiceNumber: 'INV-2024-88' }
  // { vendorName: 'Acme Corp', invoiceNumber: 'INV-2024-88', totalAmount: 1250 }
});`,
        codeTs: `import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const invoiceSchema = z.object({
  vendorName: z.string(),
  invoiceNumber: z.string(),
  totalAmount: z.number(),
});

type Invoice = z.infer<typeof invoiceSchema>;

async function extractInvoiceFields(
  invoiceText: string,
  onUpdate: (partial: Partial<Invoice>) => void,
): Promise<Invoice> {
  const result = streamObject({
    model: anthropic('claude-sonnet-4-5'),
    schema: invoiceSchema,
    prompt: \`Extract invoice fields from this text:\n\n\${invoiceText}\`,
  });

  // Each yielded value is a PARTIAL object — fields present are
  // genuinely complete and correctly typed; absent fields are simply
  // still being generated, not malformed
  for await (const partial of result.partialObjectStream) {
    onUpdate(partial); // e.g. re-render a form, filling fields as ready
  }

  return await result.object; // the final, fully-validated object
}

await extractInvoiceFields(rawInvoiceText, (partial) => {
  console.log('Form now shows:', partial);
  // { vendorName: 'Acme Corp' }
  // { vendorName: 'Acme Corp', invoiceNumber: 'INV-2024-88' }
  // { vendorName: 'Acme Corp', invoiceNumber: 'INV-2024-88', totalAmount: 1250 }
});`,
        code: `const result = streamObject({ model: anthropic('claude-sonnet-4-5'), schema: invoiceSchema, prompt });
for await (const partial of result.partialObjectStream) {
  onUpdate(partial); // fields appear as they genuinely complete
}
const final = await result.object;`,
        output:
          "A form's vendorName field appears filled in first, then invoiceNumber, then totalAmount — each appearing at the moment it's genuinely complete, never showing a half-typed number or a truncated string, because partialObjectStream only ever yields fields that are provably finished.",
        explain:
          "This is meaningfully different from hand-parsing a growing raw string: the SDK's partial-object stream guarantees every field present in a yielded partial is genuinely complete and correctly typed (a number is a real number, not a string still being typed out), which a naive try/catch JSON.parse() loop cannot guarantee.",
        explainHi:
          "Ye ek badhte hue raw string ko hand-parse karne se meaningfully alag hai: SDK ka partial-object stream guarantee karta hai ki ek yielded partial mein present har field genuinely complete aur correctly typed hai (ek number ek real number hai, ek string nahi jo abhi type ho rahi hai), jo ek naive try/catch JSON.parse() loop guarantee nahi kar sakta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Hand-rolling incomplete-JSON parsing with repeated try/catch
let accumulated = '';
for await (const chunk of rawTextStream) {
  accumulated += chunk;
  try {
    const parsed = JSON.parse(accumulated);
    updateUI(parsed); // DANGEROUS: a string field whose closing quote
                       // happened to appear won't throw, but may not
                       // represent the model's actual final intent yet
  } catch {
    // silently ignored — but some "successful" parses above are
    // actually still-incomplete data that merely looked valid
  }
}`,
        right: `// Using the SDK's dedicated partial-object streaming
import { streamObject } from 'ai';

const result = streamObject({ model, schema, prompt });
for await (const partial of result.partialObjectStream) {
  updateUI(partial); // guaranteed: every present field is genuinely
                      // complete and correctly typed, per the schema
}
const final = await result.object; // fully validated final object`,
        why: "A naive try/catch JSON.parse() loop can produce a false positive: a partially-generated string field whose closing quote happens to land at a particular streaming boundary parses successfully but doesn't represent the model's actual completed intent. A dedicated partial-JSON parser understands the grammar deeply enough to only surface genuinely complete fields.",
        whyHi:
          "Ek naive try/catch JSON.parse() loop ek false positive produce kar sakta hai: ek partially-generated string field jiska closing quote ek particular streaming boundary pe land ho jata hai successfully parse ho jata hai par model ke actual completed intent ko represent nahi karta. Ek dedicated partial-JSON parser grammar ko itna deeply samajhta hai ki sirf genuinely complete fields ko hi surface kare.",
      },
    ],

    realWorld: [
      {
        en: "A document-processing SaaS feature extracting structured fields (vendor, date, line items, total) from an uploaded invoice uses partial-object streaming so a reviewer sees fields populate one by one as they're confidently extracted, rather than staring at a blank form for the several seconds the full extraction takes.",
        hi: 'Ek document-processing SaaS feature jo ek uploaded invoice se structured fields (vendor, date, line items, total) extract karta hai partial-object streaming use karta hai taaki ek reviewer fields ko ek ek karke populate hote dekhe jaise wo confidently extract hoti hain, un several seconds ke liye ek blank form ko ghoorne ke bajaye jo poori extraction leti hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does JSON.parse() throwing on a mid-stream structured response represent expected, correct behavior rather than a bug?",
        qHi: 'JSON.parse() ka mid-stream structured response pe throw karna expected, correct behavior kyun represent karta hai ek bug ke bajaye?',
        a: "Combining streaming (delivering content incrementally) with structured output (an exact JSON shape) means the JSON string genuinely doesn't become valid until the last token of the structure arrives. A mid-stream parse failure reflects the actual, correct state of a not-yet-finished string — it isn't malformed, it's simply incomplete.",
        aHi: 'Streaming (content ko incrementally deliver karna) ko structured output (ek exact JSON shape) ke saath combine karna matlab hai JSON string genuinely valid nahi banta jab tak structure ka last token arrive na ho. Ek mid-stream parse failure ek not-yet-finished string ki actual, correct state ko reflect karta hai — ye malformed nahi hai, ye simply incomplete hai.',
      },
      {
        q: "Why is a naive try/catch loop around JSON.parse() an unreliable way to handle a streaming structured response?",
        qHi: 'JSON.parse() ke around ek naive try/catch loop ek streaming structured response handle karne ka ek unreliable tareeka kyun hai?',
        a: "It can produce false positives — a string field whose closing quote happens to appear at a particular streaming boundary will parse successfully, but the value may not represent the model's actual completed intent yet. A dedicated partial-JSON parser understands JSON's grammar deeply enough to distinguish genuinely complete fields from ones that merely happen to look complete.",
        aHi: 'Ye false positives produce kar sakta hai — ek string field jiska closing quote ek particular streaming boundary pe appear ho jata hai successfully parse ho jayega, par value shayad abhi model ke actual completed intent ko represent na kare. Ek dedicated partial-JSON parser JSON ke grammar ko itna deeply samajhta hai ki genuinely complete fields ko un se distinguish kare jo sirf complete dikhte hain.',
      },
    ],

    exercises: [
      {
        task: "A feature streams a structured object with a `totalPrice` field into a checkout summary UI, showing the partial value as soon as any digits appear. A user reports seeing '$1' briefly flash before the real total '$125' appears, and worries the price was wrong. Using this lesson's reasoning, explain what happened and how to fix the UX.",
        taskHi: 'Ek feature ek `totalPrice` field wale ek structured object ko ek checkout summary UI mein stream karta hai, jaise hi koi digits appear hote hain partial value dikhate hue. Ek user report karta hai ki \'$1\' briefly flash hote dekha real total \'$125\' appear hone se pehle, aur worry karta hai ki price galat thi. Is lesson ki reasoning use karke, explain karo ki kya hua aur UX kaise fix karein.',
        hint: "Revisit this lesson's guidance on when partial values are safe to show versus actively misleading, and think about which category a price field falls into.",
        hintHi: 'Is lesson ki guidance revisit karo ki partial values kab dikhane ke liye safe hain versus actively misleading, aur socho ki ek price field kaunsi category mein aata hai.',
      },
    ],

    keyTakeaways: [
      "Combining streaming (Module 2) with structured output (Module 3) means JSON is genuinely invalid at every intermediate point mid-stream — this is expected, correct behavior, not a bug to catch and retry.",
      "Hand-rolled try/catch JSON.parse() loops are unreliable because they can produce false positives — a value that parses successfully but doesn't yet represent the model's actual completed intent.",
      "The AI SDK's partial-object streaming (streamObject / partialObjectStream) understands JSON's grammar deeply enough to only surface genuinely complete fields, which is the correct tool rather than hand-parsing fragments.",
      'Whether to show partial values or wait for the complete object is a genuine design decision — partial data is useful when it can\'t be misread as final (a form filling field by field) and harmful when it can (a still-computing total).',
    ],
    keyTakeawaysHi: [
      'Streaming (Module 2) ko structured output (Module 3) ke saath combine karna matlab hai JSON genuinely invalid hai mid-stream har intermediate point pe — ye expected, correct behavior hai, koi bug nahi jise catch aur retry karna hai.',
      'Hand-rolled try/catch JSON.parse() loops unreliable hain kyunki wo false positives produce kar sakte hain — ek value jo successfully parse hoti hai par abhi model ke actual completed intent ko represent nahi karti.',
      'AI SDK ka partial-object streaming (streamObject / partialObjectStream) JSON ke grammar ko itna deeply samajhta hai ki sirf genuinely complete fields ko surface kare, jo correct tool hai fragments ko hand-parse karne ke bajaye.',
      'Partial values dikhane hain ya complete object ka wait karna hai ek genuine design decision hai — partial data useful hai jab ise final ki tarah misread nahi kiya ja sakta (ek form field by field fill hote hue) aur harmful hai jab kiya ja sakta hai (ek abhi bhi compute ho raha total).',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-abort-cancel-and-optimistic-chat-ui',
    title: 'Abort/Cancel & Building a Genuinely Responsive Chat Interface',
    titleHi: 'Abort/Cancel Aur Genuinely Responsive Chat Interface Banana',
    description:
      "The final piece of a production-grade streaming chat feature: letting a visitor cancel a response they no longer want (stopping real, billed generation), and the optimistic-UI techniques that make an interface feel instant even before the model has responded at all.",
    descriptionHi:
      'Ek production-grade streaming chat feature ka final piece: ek visitor ko ek response cancel karne dena jo unhe ab nahi chahiye (real, billed generation ko rokte hue), aur optimistic-UI techniques jo ek interface ko instant feel karati hain model ke bilkul respond karne se pehle bhi.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A restaurant kitchen that keeps cooking a dish even after a customer has walked out, versus one that stops the moment a cancellation is confirmed.** A kitchen with no way to signal \"stop, they left\" keeps using ingredients and stove time on a dish nobody will eat — genuinely wasted resources for zero benefit. A kitchen with a clear cancellation signal stops immediately, freeing that burner and those ingredients for the next order. An AI generation a visitor navigated away from or explicitly stopped is exactly the wasted dish: Module 2 established that generation costs real tokens (real money) whether or not anyone is still watching, so a cancelled request that keeps generating in the background is pure waste — both of money and of server/API capacity that could serve someone else's actual request.",
      hi: 'Ek restaurant kitchen jo ek dish cook karta rehta hai chahe ek customer walk out ho gaya ho, versus ek jo turant rukta hai jab ek cancellation confirm ho jaata hai. Ek kitchen jiske paas "ruko, wo chale gaye" signal karne ka koi tareeka nahi hai ingredients aur stove time use karta rehta hai ek dish pe jise koi khaayega hi nahi — genuinely wasted resources zero benefit ke liye. Ek clear cancellation signal wala ek kitchen turant rukta hai, us burner aur un ingredients ko agle order ke liye free karte hue. Ek AI generation jisse ek visitor navigate away ho gaya ya explicitly stop kar diya exactly wo wasted dish hai: Module 2 ne establish kiya ki generation real tokens (real paisa) cost karta hai chahe koi abhi bhi dekh raha ho ya nahi, isliye ek cancelled request jo background mein generate hoti rehti hai pure waste hai — dono paisa ka aur server/API capacity ka jo kisi doosre ke actual request ko serve kar sakti thi.',
    },

    simple: `**Aborting an in-progress generation — stopping real, billed work,
not just hiding it in the UI:**

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat();

  return (
    <div>
      {messages.map((m) => <p key={m.id}>{m.content}</p>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        {isLoading ? (
          <button type="button" onClick={stop}>Stop generating</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}
\`\`\`

\`\`\`
Calling stop() closes the underlying connection to the streaming
response — the SAME AbortController mechanism used to cancel any
long-running fetch. Critically, this doesn't just stop UPDATING the UI;
it terminates the actual HTTP connection to your server route, which
(if implemented correctly) propagates to stopping the model provider
from continuing to generate and bill for tokens no one will ever see.
\`\`\`

**Why a cancelled request that keeps running server-side is a real
production bug, not just a minor inefficiency:** Module 2's cost math
applies per token generated, regardless of whether a visitor is still
watching — a chat feature that doesn't properly propagate cancellation
to the actual model call keeps paying for (and consuming rate-limit
budget for) output that will never be seen or used, at real, non-trivial
scale across many visitors closing tabs or clicking stop.

**Optimistic UI — making the interface feel instant even before the
model has responded at all:**

\`\`\`tsx
// useChat's default behavior already does this: the user's own message
// appears in the messages array and renders IMMEDIATELY on submit,
// well before any response streams back
const { messages, handleSubmit } = useChat();
// A visitor sees their own message appear instantly — the interface
// never waits on a round-trip just to show what they typed
\`\`\`

\`\`\`
This is the SAME principle Module 2 established for streaming's
perceived-latency benefit, applied one layer earlier: showing the
user's own input immediately (before any server round-trip at all)
removes an entire category of perceived delay — the visitor's own
action is reflected instantly, and the streaming response (Module 4,
Lesson 1) then arrives progressively on top of that already-responsive
foundation.
\`\`\`

**Putting it together — the full production-shaped feel this module
has been building toward:** a visitor's message appears instantly
(optimistic UI), the assistant's reply streams in progressively (Module
4, Lesson 1's streaming), any structured data within it fills in field
by field as it genuinely completes (Lesson 2's partial-JSON handling),
and the whole thing can be stopped mid-flight with a real, propagated
cancellation (this lesson) rather than continuing to generate and cost
money after a visitor has lost interest — every one of these is a direct
application of a mechanism this course established, not an independent
trick.`,

    simpleHi: `**Ek in-progress generation ko abort karna — real, billed work ko
rokna, sirf ise UI mein chhupana nahi:**

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat();

  return (
    <div>
      {messages.map((m) => <p key={m.id}>{m.content}</p>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        {isLoading ? (
          <button type="button" onClick={stop}>Stop generating</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}
\`\`\`

\`\`\`
stop() call karna streaming response ke underlying connection ko close
karta hai — WAHI AbortController mechanism jo kisi bhi long-running
fetch ko cancel karne ke liye use hota hai. Critically, ye sirf UI ko
UPDATE karna nahi rokta; ye actual HTTP connection ko aapke server route
tak terminate karta hai, jo (agar correctly implement kiya gaya) model
provider ko un tokens ke liye generate aur bill karna jaari rakhne se
rokne tak propagate hota hai jise koi kabhi dekhega hi nahi.
\`\`\`

**Ek cancelled request jo server-side chalti rehti hai ek real
production bug kyun hai, sirf ek minor inefficiency nahi:** Module 2 ka
cost math per token generated apply hota hai, chahe koi visitor abhi
bhi dekh raha ho ya nahi — ek chat feature jo properly cancellation ko
actual model call tak propagate nahi karta us output ke liye pay karta
rehta hai (aur rate-limit budget consume karta hai) jise koi kabhi
dekhega ya use karega nahi, kai visitors ke tabs close karne ya stop
click karne ke across real, non-trivial scale pe.

**Optimistic UI — interface ko instant feel karana model ke bilkul
respond karne se pehle bhi:**

\`\`\`tsx
// useChat ka default behavior already yahi karta hai: user ka apna
// message messages array mein appear hota hai aur IMMEDIATELY submit
// pe render hota hai, kisi bhi response ke stream back hone se kaafi
// pehle
const { messages, handleSubmit } = useChat();
// Ek visitor apna message instantly appear hote dekhta hai — interface
// kabhi ek round-trip ka wait nahi karta sirf ye dikhane ke liye ki
// unhone kya type kiya
\`\`\`

\`\`\`
Ye WAHI principle hai jo Module 2 ne streaming ke perceived-latency
benefit ke liye establish kiya, ek layer pehle applied: user ke apne
input ko immediately dikhana (kisi bhi server round-trip se bilkul
pehle) perceived delay ki ek poori category ko hatata hai — visitor ka
apna action instantly reflect hota hai, aur streaming response (Module
4, Lesson 1) phir us already-responsive foundation ke upar progressively
aata hai.
\`\`\`

**Sab kuch ek saath rakhna — poora production-shaped feel jise ye
module ki taraf build kar raha hai:** ek visitor ka message instantly
appear hota hai (optimistic UI), assistant ka reply progressively
stream hota hai (Module 4, Lesson 1 ki streaming), uske andar koi bhi
structured data field by field fill hota hai jaise ye genuinely complete
hoti hai (Lesson 2 ka partial-JSON handling), aur poori cheez mid-flight
ek real, propagated cancellation ke saath (ye lesson) roki ja sakti hai
generate aur cost karte rehne ke bajaye jab ek visitor ne interest kho
diya ho — inme se har ek is course ne establish kiye ek mechanism ka
direct application hai, ek independent trick nahi.`,

    content: `## Why hiding a cancelled response in the UI without actually
stopping the request is a real production bug

If a "stop" button only clears the UI's own display of an in-progress
message without terminating the underlying connection, the model
provider keeps generating tokens (Module 2's cost math applies fully),
the visitor's browser keeps an unnecessary connection open, and any
server-side resource tied to that request (a database transaction, a
tool call in progress) keeps running for no purpose. Correct
cancellation must propagate all the way down to the actual streaming
connection — this is exactly what the standard AbortController mechanism
is designed for, and why the AI SDK's stop() function is wired to
actually terminate the request, not just the local display of it.

## Why optimistic UI's benefit is genuinely earlier in the timeline
than streaming's

Module 2 established that streaming improves perceived latency by
showing the FIRST piece of the model's response as soon as it's
available, rather than waiting for the whole thing. Optimistic UI
applies the identical underlying idea one step earlier: there's no
reason to wait for ANY server round-trip before showing a visitor their
own message, since that content is already fully known the instant they
submit it. Chaining these together — instant display of the user's own
input, then progressive streaming of the response — removes waiting at
every point in the interaction where waiting isn't actually necessary.

## Why every technique in this module is a direct application, not an
independent trick

Streaming (Lesson 1) is Module 2's SSE mechanism wrapped in a
production-shaped hook. Partial-JSON handling (Lesson 2) is a direct,
specific consequence of combining Module 2's streaming with Module 3's
structured output. Optimistic UI and proper cancellation (this lesson)
apply the same perceived-latency and real-resource-cost principles
Module 2 established, just at the UI layer rather than the raw API
layer. Nothing in this entire module introduces a new fundamental
mechanism — it's the same handful of ideas from Modules 1-3, assembled
into an actual, shippable web feature.

## How this connects forward to tool calling and agents

Module 5's tool calling and Module 9's agents both involve
longer-running, multi-step AI interactions where a visitor may
similarly want to cancel mid-flight (stopping an agent partway through
a multi-step task, not just a single response) — the same
AbortController-based cancellation principle from this lesson extends
directly to those more complex cases, and the same "don't keep paying
for work nobody will use" reasoning applies with even higher stakes,
since a multi-step agent loop can accumulate real cost across many
individual model calls if not properly cancellable.`,

    contentHi: `## Ek cancelled response ko UI mein chhupana bina actually request roke ek real production bug kyun hai

Agar ek "stop" button sirf UI ke apne in-progress message ke display ko
clear karta hai bina underlying connection terminate kiye, model
provider tokens generate karta rehta hai (Module 2 ka cost math poori
tarah apply hota hai), visitor ka browser ek unnecessary connection
khula rakhta hai, aur us request se tied koi bhi server-side resource
(ek database transaction, ek in-progress tool call) bina kisi purpose
ke chalta rehta hai. Correct cancellation ko poori tarah niche actual
streaming connection tak propagate karna chahiye — ye exactly wo hai
jiske liye standard AbortController mechanism design kiya gaya hai, aur
yahi wajah hai ki AI SDK ka stop() function actually request ko
terminate karne ke liye wired hai, sirf uske local display ko nahi.

## Optimistic UI ka benefit genuinely timeline mein streaming se pehle kyun hai

Module 2 ne establish kiya ki streaming perceived latency ko improve
karta hai model ke response ke FIRST piece ko dikhake jaise hi ye
available hota hai, poori cheez ka wait karne ke bajaye. Optimistic UI
wahi underlying idea ko ek step pehle apply karta hai: kisi bhi server
round-trip ka wait karne ki koi wajah nahi hai ek visitor ko unka apna
message dikhane se pehle, kyunki wo content already poori tarah known
hai us instant jab wo ise submit karte hain. Inhe chain karna — user ke
apne input ka instant display, phir response ka progressive streaming —
interaction ke har us point pe wait karna hatata hai jahan wait karna
actually zaroori nahi hai.

## Is module ki har technique ek direct application kyun hai, ek independent trick nahi

Streaming (Lesson 1) Module 2 ka SSE mechanism hai ek production-shaped
hook mein wrapped. Partial-JSON handling (Lesson 2) Module 2 ki
streaming ko Module 3 ke structured output ke saath combine karne ka ek
direct, specific consequence hai. Optimistic UI aur proper cancellation
(ye lesson) wahi perceived-latency aur real-resource-cost principles
apply karte hain jo Module 2 ne establish kiye, sirf UI layer pe raw API
layer ke bajaye. Is poore module mein kuch bhi ek naya fundamental
mechanism introduce nahi karta — ye Modules 1-3 se wahi kuch ideas hain,
ek actual, shippable web feature mein assembled.

## Ye forward tool calling aur agents se kaise connect karta hai

Module 5 ka tool calling aur Module 9 ke agents dono longer-running,
multi-step AI interactions involve karte hain jahan ek visitor similarly
mid-flight cancel karna chahega (ek multi-step task ke beech mein ek
agent ko rokna, sirf ek single response nahi) — is lesson ka wahi
AbortController-based cancellation principle directly un zyada complex
cases tak extend hota hai, aur wahi "koi aisa kaam ke liye pay karte
rehna mat jise koi use nahi karega" reasoning aur bhi higher stakes ke
saath apply hoti hai, kyunki ek multi-step agent loop kai individual
model calls ke across real cost accumulate kar sakta hai agar properly
cancellable na ho.`,

    examples: [
      {
        title: 'A complete chat UI with optimistic message display, streaming response, and a working stop button',
        titleHi: 'Ek complete chat UI optimistic message display, streaming response, aur ek working stop button ke saath',
        codeJs: `'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map((m) => (
        // The user's OWN message (role: 'user') renders instantly on
        // submit — no round-trip needed to show what they just typed.
        // The assistant's message renders progressively as it streams.
        <p key={m.id}><strong>{m.role}:</strong> {m.content}</p>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        {isLoading ? (
          // stop() closes the actual streaming connection — the model
          // provider stops billing for tokens no one will see
          <button type="button" onClick={stop}>Stop generating</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}`,
        codeTs: `'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map((m) => (
        // The user's OWN message (role: 'user') renders instantly on
        // submit — no round-trip needed to show what they just typed.
        // The assistant's message renders progressively as it streams.
        <p key={m.id}><strong>{m.role}:</strong> {m.content}</p>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        {isLoading ? (
          // stop() closes the actual streaming connection — the model
          // provider stops billing for tokens no one will see
          <button type="button" onClick={stop}>Stop generating</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}`,
        code: `const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat();
// User's message renders instantly on submit (optimistic UI)
// stop() terminates the real streaming connection, not just the display`,
        output:
          "Submitting a message shows it in the UI immediately — before any network response — then the assistant's reply appears progressively. Clicking 'Stop generating' mid-response immediately halts both the visible text and the underlying connection, so no further tokens are generated or billed for that request.",
        explain:
          "The optimistic display of the user's own message and the properly-propagated stop() both trace back to the same principle: don't make a visitor wait for, or pay for, anything that doesn't genuinely require it — the user's input is already known instantly, and generation nobody wants shouldn't continue running.",
        explainHi:
          "User ke apne message ka optimistic display aur properly-propagated stop() dono wahi principle tak wapas trace hote hain: ek visitor ko kisi aisi cheez ke liye wait ya pay mat karwao jise genuinely uski zaroorat nahi hai — user ka input already instantly known hai, aur wo generation jise koi nahi chahta chalta nahi rehna chahiye.",
      },
    ],

    mistakes: [
      {
        wrong: `// A "stop" button that only hides the response in the UI without
// actually cancelling the underlying request
function StopButton({ setDisplayedText }) {
  return (
    <button onClick={() => setDisplayedText('')}>
      Stop
    </button>
  );
  // The fetch/stream to the server route is still running in the
  // background — the model keeps generating and being billed for
  // tokens that will never be shown to anyone.
}`,
        right: `// A stop button wired to the SDK's actual cancellation mechanism
import { useChat } from 'ai/react';

function ChatWithStop() {
  const { stop, isLoading } = useChat();
  return isLoading ? (
    <button onClick={stop}>Stop</button>
    // Calls the real AbortController-based cancellation, terminating
    // the actual connection to the streaming response
  ) : null;
}`,
        why: "Generation costs real tokens (Module 2's cost math) whether or not the visitor is still watching. A stop mechanism that only clears the local UI display, without terminating the underlying connection, leaves the model provider generating and billing for output that serves no purpose.",
        whyHi:
          "Generation real tokens (Module 2 ka cost math) cost karti hai chahe visitor abhi bhi dekh raha ho ya nahi. Ek stop mechanism jo sirf local UI display clear karta hai, underlying connection terminate kiye bina, model provider ko us output ke liye generate aur bill karte rehne deta hai jiska koi purpose nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production chat product's 'stop generating' button is wired through the same AbortController mechanism used to cancel any other long-running browser request, specifically because a visitor closing a tab or navigating away mid-generation must actually terminate the connection to the model provider, not just stop updating a UI nobody is looking at anymore.",
        hi: 'Ek production chat product ka \'stop generating\' button wahi AbortController mechanism ke through wired hai jo kisi bhi doosre long-running browser request ko cancel karne ke liye use hota hai, specifically kyunki ek visitor jo mid-generation ek tab close karta hai ya navigate away hota hai use actually model provider se connection terminate karna chahiye, sirf ek UI update karna band karna nahi jise ab koi dekh hi nahi raha.',
      },
    ],

    interviewQA: [
      {
        q: "Why is it insufficient for a 'stop' button to only clear a chat message from the UI, without also cancelling the underlying network request?",
        qHi: 'Ek \'stop\' button ke liye ye insufficient kyun hai ki ye sirf ek chat message ko UI se clear kare, underlying network request ko bhi cancel kiye bina?',
        a: "Generation costs real tokens whether or not the visitor is still watching (Module 2). If the underlying connection isn't actually terminated, the model provider keeps generating and billing for output that will never be seen, and server-side resources tied to the request keep running for no purpose. The cancellation must propagate all the way to the real connection, typically via AbortController.",
        aHi: 'Generation real tokens cost karti hai chahe visitor abhi bhi dekh raha ho ya nahi (Module 2). Agar underlying connection actually terminate nahi hoti, model provider us output ke liye generate aur bill karta rehta hai jise kabhi dekha nahi jaayega, aur request se tied server-side resources bina kisi purpose ke chalte rehte hain. Cancellation ko poori tarah real connection tak propagate hona chahiye, typically AbortController ke through.',
      },
      {
        q: "How does optimistic UI in a chat interface relate to the perceived-latency reasoning Module 2 introduced for streaming?",
        qHi: 'Ek chat interface mein optimistic UI Module 2 ke perceived-latency reasoning se kaise related hai jo streaming ke liye introduce ki gayi?',
        a: "It's the same underlying idea (don't make a visitor wait for something that's already available) applied one step earlier in the timeline. Streaming shows the first piece of the model's response as soon as it's ready rather than waiting for the whole thing; optimistic UI shows the visitor's own submitted message instantly, since that content is already fully known and doesn't require any server round-trip to display.",
        aHi: 'Ye wahi underlying idea hai (ek visitor ko kisi aisi cheez ke liye wait mat karwao jo already available hai) timeline mein ek step pehle applied. Streaming model ke response ka first piece dikhata hai jaise hi ye ready hota hai poori cheez ka wait karne ke bajaye; optimistic UI visitor ke apne submitted message ko instantly dikhata hai, kyunki wo content already poori tarah known hai aur dikhane ke liye kisi bhi server round-trip ki zaroorat nahi.',
      },
    ],

    exercises: [
      {
        task: "A team implements their chat's stop button by simply setting a React state variable to hide the in-progress assistant message, without calling any cancellation function on the underlying stream. A month later, their AI provider bill is unexpectedly high. Diagnose the likely cause using this lesson's reasoning.",
        taskHi: 'Ek team apne chat ka stop button simply ek React state variable set karke implement karti hai in-progress assistant message ko chhupane ke liye, underlying stream pe koi cancellation function call kiye bina. Ek mahine baad, unka AI provider bill unexpectedly high hai. Is lesson ki reasoning use karke likely cause diagnose karo.',
        hint: "Think about what continues happening server-side, and being billed for, when only the client-side display is changed.",
        hintHi: 'Socho ki server-side kya hota rehta hai, aur uske liye bill kiya jata hai, jab sirf client-side display badla jaata hai.',
      },
    ],

    keyTakeaways: [
      "A cancellation mechanism must terminate the actual underlying connection (typically via AbortController), not just hide content in the UI — generation costs real tokens (Module 2) regardless of whether anyone is still watching.",
      "Optimistic UI applies the same perceived-latency principle Module 2 established for streaming, one step earlier: showing a visitor's own submitted message instantly, since it requires no server round-trip to know.",
      "Every technique across this module (streaming, partial-JSON handling, optimistic UI, cancellation) is a direct, traceable application of mechanisms established in Modules 1-3 — nothing here is an independent trick.",
      'The same cancellation principle extends directly to longer-running, multi-step AI interactions (tool calling, agents) covered in later modules, with even higher stakes since more can be wasted if not properly cancellable.',
    ],
    keyTakeawaysHi: [
      'Ek cancellation mechanism ko actual underlying connection terminate karna chahiye (typically AbortController ke through), sirf UI mein content chhupana nahi — generation real tokens (Module 2) cost karta hai chahe koi abhi bhi dekh raha ho ya nahi.',
      'Optimistic UI wahi perceived-latency principle apply karta hai jo Module 2 ne streaming ke liye establish kiya, ek step pehle: ek visitor ke apne submitted message ko instantly dikhana, kyunki ise jaanne ke liye koi server round-trip ki zaroorat nahi.',
      'Is poore module ki har technique (streaming, partial-JSON handling, optimistic UI, cancellation) Modules 1-3 mein establish kiye mechanisms ka ek direct, traceable application hai — yahan kuch bhi ek independent trick nahi hai.',
      'Wahi cancellation principle directly longer-running, multi-step AI interactions (tool calling, agents) tak extend hota hai jo baad ke modules mein cover kiye gaye, even higher stakes ke saath kyunki agar properly cancellable na ho to zyada waste ho sakta hai.',
    ],
  },
];
