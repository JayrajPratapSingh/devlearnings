/**
 * Next.js Complete Course — Module 11: WebSockets & Real-time, lessons 1-3.
 *
 * Lesson 1: Why Next.js's serverless functions can't hold a persistent connection.
 * Lesson 2: Server-Sent Events as the simpler alternative to WebSockets.
 * Lesson 3: Presence, live cursors, and real-time plus optimistic UI together.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-why-serverless-cant-hold-websockets',
    title: "Why Serverless Functions Can't Hold a WebSocket Open",
    titleHi: 'Serverless Functions WebSocket Ko Open Kyun Nahi Rakh Sakte',
    description:
      "A WebSocket is fundamentally a long-lived, open connection — the opposite of what a serverless function is designed for, which is spinning up quickly, doing a small amount of work, and shutting back down. Real-time features in a Next.js app need a genuinely different piece of infrastructure, not a clever Route Handler.",
    descriptionHi:
      'Ek WebSocket fundamentally ek long-lived, open connection hai — bilkul opposite us cheez ka jiske liye ek serverless function design kiya gaya hai, jo hai jaldi spin up hona, thoda sa kaam karna, aur wapas shutdown ho jana. Ek Next.js app mein real-time features ko genuinely ek alag piece ki infrastructure chahiye, koi clever Route Handler nahi.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A phone call that stays connected for an hour, versus a mail slot designed only for dropping off one letter and immediately closing.** A mail slot is built for a single, quick transaction — a letter goes in, the slot's job is done, and it's ready for the next unrelated letter moments later. Trying to hold an hour-long phone conversation through a mail slot doesn't just work poorly, it's a fundamentally different kind of interaction the slot was never built for. A serverless function is that mail slot: optimized for handling one request and returning a response quickly, then disappearing. A WebSocket needs the phone call — a connection that stays open and lets both sides talk back and forth for as long as the conversation lasts.",
      hi: 'Ek phone call jo ek ghante tak connected rehta hai, versus ek mail slot jo sirf ek letter drop karne aur turant band hone ke liye design kiya gaya hai. Ek mail slot ek single, quick transaction ke liye banaya gaya hai — ek letter andar jata hai, slot ka kaam ho jata hai, aur ye kuch moments baad agle unrelated letter ke liye ready hota hai. Ek ghante-lambi phone conversation ko ek mail slot ke through hold karne ki koshish sirf poorly kaam nahi karti, ye ek fundamentally alag tarah ka interaction hai jiske liye slot kabhi banaya hi nahi gaya. Ek serverless function wahi mail slot hai: ek request handle karne aur jaldi ek response return karne ke liye optimized, phir gayab ho jana. Ek WebSocket ko phone call chahiye — ek connection jo open rehta hai aur dono sides ko back aur forth baat karne deta hai jab tak conversation chalta hai.',
    },

    simple: `**What a serverless function is actually optimized for:**

\`\`\`
Request arrives -> function instance spins up (or reuses a "warm" one)
-> does a small, bounded amount of work -> returns a response ->
instance may be frozen or destroyed shortly after, to free resources
for other work
\`\`\`

**What a WebSocket fundamentally needs:**

\`\`\`
Client connects -> the connection STAYS OPEN, indefinitely, as long as
both sides want it -> either side can send a message to the other AT
ANY TIME, without a new "request" being made -> the connection only
ends when explicitly closed
\`\`\`

**Why these are incompatible, not just "harder to combine":** a
serverless platform's entire economic and scaling model depends on
function instances being short-lived and interchangeable — this is what
lets it run thousands of instances cheaply and scale them up and down in
seconds. A function holding one WebSocket connection open for hours would
have to stay alive for those entire hours, unable to be reused for
anything else, defeating the exact efficiency serverless platforms are
built around. Some serverless platforms simply forbid this outright (a
hard connection-duration limit); others technically allow it but make it
prohibitively expensive at any real scale.

**What this means practically for a Next.js app:** real-time features
(live chat, live notifications, collaborative editing) need a SEPARATE
piece of infrastructure specifically designed to hold many long-lived
connections — a small dedicated Node.js server running Socket.IO, or a
managed real-time service (Pusher, Ably, Supabase Realtime) — that your
Next.js app talks to, rather than trying to implement the real-time layer
inside a Route Handler or Server Action.

**The rule going forward for this module:** don't reach for "how do I do
WebSockets in Next.js" as the first question — ask "does this feature
genuinely need a persistent connection, or would a simpler mechanism
work," which Lesson 2's Server-Sent Events answers for a large share of
real-time use cases without needing separate WebSocket infrastructure at all.`,

    simpleHi: `**Ek serverless function actually kis cheez ke liye optimized hai:**

\`\`\`
Request aati hai -> function instance spin up hota hai (ya ek "warm" ko
reuse karta hai) -> ek chhota, bounded amount ka kaam karta hai -> ek
response return karta hai -> instance shortly baad freeze ya destroy ho
sakta hai, resources ko doosre kaam ke liye free karne ke liye
\`\`\`

**Ek WebSocket ko fundamentally kya chahiye:**

\`\`\`
Client connect karta hai -> connection OPEN REHTA hai, indefinitely, jab
tak dono sides chahte hain -> koi bhi side doosre ko KISI BHI TIME ek
message bhej sakta hai, bina ek naye "request" ke -> connection sirf tab
khatam hota hai jab explicitly close kiya jaaye
\`\`\`

**Ye incompatible kyun hain, sirf "combine karna mushkil" nahi:** ek
serverless platform ka poora economic aur scaling model is baat pe depend
karta hai ki function instances short-lived aur interchangeable hon — yahi
wo hai jo ise thousands instances cheaply chalane deta hai aur unhe
seconds mein up aur down scale karne deta hai. Ek function jo ek WebSocket
connection ko ghanton tak open rakhta hai use un poore ghanton tak alive
rehna padega, kisi aur cheez ke liye reuse hone mein asamarth, exact
efficiency ko defeat karte hue jiske around serverless platforms banaye
gaye hain. Kuch serverless platforms ise bilkul outright forbid karte hain
(ek hard connection-duration limit); doosre technically ise allow karte
hain par kisi bhi real scale pe prohibitively expensive bana dete hain.

**Ye practically ek Next.js app ke liye kya matlab rakhta hai:** real-time
features (live chat, live notifications, collaborative editing) ko ek
SEPARATE piece ki infrastructure chahiye specifically kai long-lived
connections hold karne ke liye design kiya gaya — ek chhota dedicated
Node.js server jo Socket.IO chala raha hai, ya ek managed real-time
service (Pusher, Ably, Supabase Realtime) — jisse aapka Next.js app baat
karta hai, real-time layer ko ek Route Handler ya Server Action ke andar
implement karne ki koshish karne ke bajaye.

**Is module ke liye aage badhne wali rule:** "Next.js mein WebSockets kaise
karu" ko pehle sawaal ki tarah mat reach karo — poochho "kya is feature
ko genuinely ek persistent connection chahiye, ya ek simpler mechanism
kaam karega," jo Lesson 2 ke Server-Sent Events real-time use cases ke ek
bade share ke liye jawab deta hai bina bilkul separate WebSocket
infrastructure ki zaroorat ke.`,

    content: `## Why "just use a longer timeout" isn't a real fix

It might seem like the problem is simply that serverless functions have a
timeout that's too short, and a longer timeout would solve it. This
misunderstands the actual constraint: even a serverless platform allowing
very long execution times still charges (and architecturally optimizes)
per-invocation, based on the assumption that most invocations are short.
An open WebSocket held by one function instance for hours means that
instance's resources are unavailable for anything else during that entire
time — this isn't a configuration limit to raise, it's the fundamental
resource model serverless computing is built on.

## What actually needs to change: the infrastructure, not the code style

The fix isn't a cleverer way to write a Route Handler — it's recognizing
that a persistent-connection feature needs a persistent-connection SERVER,
which is architecturally different from the serverless functions the rest
of a Next.js app can run on. This server can be:

1. **A small, dedicated Node.js process** you deploy separately (on a
   traditional VM, a container, or a platform explicitly supporting
   long-running processes), running something like Socket.IO.
2. **A managed real-time service** (Pusher, Ably, Supabase Realtime) that
   handles the actual connection-holding infrastructure for you — your
   Next.js app's serverless functions just make short API calls to trigger
   messages, never holding a connection themselves.

## Why this genuinely isn't a Next.js limitation

This constraint isn't specific to Next.js — any application built on
serverless functions (AWS Lambda directly, other frameworks deployed the
same way) faces the identical problem, because it comes from the
serverless execution MODEL itself, not from anything Next.js does or
doesn't support. A Next.js app deployed to a traditional, always-running
Node.js server (rather than serverless functions) actually CAN hold
WebSocket connections directly — the constraint is about the deployment
target's execution model, not the framework.

## Setting up Lesson 2 and 3

Given this constraint, the practical question becomes: how much of what
"feels like" a WebSocket requirement can actually be satisfied by a
simpler, serverless-compatible mechanism? Server-Sent Events (Lesson 2)
answers this for the very common case of one-directional server-to-client
updates, without needing separate real-time infrastructure at all — and
genuinely bidirectional needs (live cursors, collaborative editing,
Lesson 3) are where a dedicated WebSocket service actually earns its
complexity.`,

    contentHi: `## "Bas ek lamba timeout use karo" real fix kyun nahi hai

Ye lag sakta hai ki problem simply ye hai ki serverless functions ka
timeout bahut chhota hai, aur ek lamba timeout ise solve kar dega. Ye
actual constraint ko misunderstand karta hai: ek serverless platform bhi
jo bahut lambe execution times allow karta hai phir bhi per-invocation
charge karta hai (aur architecturally optimize karta hai), is assumption
ke basis par ki zyadatar invocations short hote hain. Ek open WebSocket
jise ek function instance ghanton tak hold karta hai matlab hai us
instance ke resources us poore time ke liye kisi aur cheez ke liye
unavailable hain — ye ek configuration limit nahi hai jise raise kiya
jaaye, ye fundamental resource model hai jispar serverless computing
banaya gaya hai.

## Actually kya badalna chahiye: infrastructure, code style nahi

Fix ek Route Handler likhne ka ek cleverer tareeka nahi hai — ye recognize
karna hai ki ek persistent-connection feature ko ek persistent-connection
SERVER chahiye, jo architecturally alag hai un serverless functions se
jinpe Next.js app ka baaki hissa chal sakta hai. Ye server ho sakta hai:

1. **Ek chhota, dedicated Node.js process** jise aap separately deploy
   karte ho (ek traditional VM pe, ek container mein, ya ek platform jo
   explicitly long-running processes support karta hai), kuch Socket.IO
   jaisa chalate hue.
2. **Ek managed real-time service** (Pusher, Ably, Supabase Realtime) jo
   actual connection-holding infrastructure aapke liye handle karta hai —
   aapke Next.js app ke serverless functions bas short API calls karte
   hain messages trigger karne ke liye, khud kabhi ek connection hold
   nahi karte.

## Ye genuinely Next.js ki limitation kyun nahi hai

Ye constraint Next.js ke liye specific nahi hai — koi bhi application jo
serverless functions pe banaya gaya hai (AWS Lambda directly, doosre
frameworks jo isi tarah deployed hain) identical problem face karti hai,
kyunki ye serverless execution MODEL se hi aata hai, kisi aisi cheez se
nahi jo Next.js karta ya nahi karta. Ek Next.js app jo ek traditional,
hamesha-chalne wale Node.js server pe deployed hai (serverless functions
ke bajaye) actually directly WebSocket connections hold KAR SAKTA HAI —
constraint deployment target ke execution model ke baare mein hai,
framework ke baare mein nahi.

## Lesson 2 aur 3 ke liye setup karna

Is constraint ko dekhte hue, practical sawaal ye ban jata hai: jo "ek
WebSocket requirement jaisa feel" hota hai uska kitna hissa actually ek
simpler, serverless-compatible mechanism se satisfy ho sakta hai?
Server-Sent Events (Lesson 2) is very common case ka jawab deta hai
one-directional server-to-client updates ka, bilkul bina separate
real-time infrastructure ki zaroorat ke — aur genuinely bidirectional
needs (live cursors, collaborative editing, Lesson 3) wo jagah hain jahan
ek dedicated WebSocket service actually apni complexity earn karta hai.`,

    examples: [
      {
        title: 'What holding a WebSocket in a serverless function actually looks like, and why it fails',
        titleHi: 'Ek serverless function mein ek WebSocket hold karna actually kaisa dikhta hai, aur ye kyun fail hota hai',
        codeJs: `// app/api/socket/route.js — this DOES NOT work reliably on serverless platforms
export async function GET(request) {
  // Attempting to "upgrade" this request to a WebSocket and hold it open
  // requires the underlying function instance to stay alive for the
  // ENTIRE lifetime of the connection — potentially hours.
  //
  // On a serverless platform, this instance may be forcibly terminated
  // after a maximum execution duration (often seconds to a few minutes),
  // silently dropping every connection it was holding.
  //
  // This is not a code bug to fix — it's the wrong infrastructure for
  // the requirement.
}

// The actual fix: a SEPARATE, dedicated long-running process
// server.js — deployed on its own, NOT as a serverless function
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: process.env.APP_URL } });

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data); // broadcast to all connected clients
  });
});

httpServer.listen(4001); // this process stays running indefinitely, by design`,
        codeTs: `// app/api/socket/route.ts — this DOES NOT work reliably on serverless platforms
export async function GET(request: Request) {
  // Attempting to "upgrade" this request to a WebSocket and hold it open
  // requires the underlying function instance to stay alive for the
  // ENTIRE lifetime of the connection — potentially hours.
  //
  // On a serverless platform, this instance may be forcibly terminated
  // after a maximum execution duration (often seconds to a few minutes),
  // silently dropping every connection it was holding.
  //
  // This is not a code bug to fix — it's the wrong infrastructure for
  // the requirement.
  return new Response('Use a dedicated real-time server instead', { status: 501 });
}

// The actual fix: a SEPARATE, dedicated long-running process
// server.ts — deployed on its own, NOT as a serverless function
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: process.env.APP_URL } });

io.on('connection', (socket) => {
  socket.on('message', (data: string) => {
    io.emit('message', data); // broadcast to all connected clients
  });
});

httpServer.listen(4001); // this process stays running indefinitely, by design`,
        code: `// server.ts — a SEPARATE, always-running process, not a serverless function
const httpServer = createServer();
const io = new Server(httpServer);
io.on('connection', (socket) => {
  socket.on('message', (data) => io.emit('message', data));
});
httpServer.listen(4001);`,
        output:
          "The Route Handler approach appears to work in local development (where there's no real serverless execution-time limit) but drops connections unpredictably in production on a real serverless platform. The dedicated Socket.IO server, run as its own always-on process, holds connections reliably because it was built for exactly that.",
        explain:
          "The core lesson is architectural, not syntactic: the dedicated server in the second example isn't a clever Next.js pattern — it's an entirely separate deployment (its own process, its own hosting) that your Next.js app's client-side code connects to directly, bypassing Next.js's own serverless functions for this specific feature.",
        explainHi:
          "Core lesson architectural hai, syntactic nahi: doosre example mein dedicated server koi clever Next.js pattern nahi hai — ye ek poori tarah separate deployment hai (apna khud ka process, apna khud ka hosting) jisse aapke Next.js app ka client-side code directly connect karta hai, is specific feature ke liye Next.js ke apne serverless functions ko bypass karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Believing a longer function timeout setting solves the WebSocket problem
// vercel.json
{
  "functions": {
    "app/api/socket/route.js": { "maxDuration": 300 } // still fundamentally wrong
  }
}
// Even a generous timeout is bounded — a real chat feature needs
// connections open for HOURS, and every instance is still a scarce,
// billed resource meant to be reused across many short-lived requests.`,
        right: `// Recognizing the feature needs different infrastructure entirely
// - A dedicated Socket.IO server, deployed as an always-running process
// - OR a managed real-time service (Pusher, Ably) that handles the
//   connection-holding for you
// The Next.js app's serverless functions call out to trigger events,
// never holding the persistent connection themselves.`,
        why: "Increasing a timeout treats this as a configuration problem when it's actually an architectural mismatch — serverless functions are built around being short-lived and reusable, and no timeout setting changes that fundamental resource model enough to make hours-long connections practical or affordable at scale.",
        whyHi:
          "Ek timeout badhana ise ek configuration problem ki tarah treat karta hai jabki ye actually ek architectural mismatch hai — serverless functions short-lived aur reusable hone ke around banaye gaye hain, aur koi bhi timeout setting us fundamental resource model ko itna nahi badalti ki ghanton-lambi connections scale pe practical ya affordable ho jaayein.",
      },
    ],

    realWorld: [
      {
        en: "A production Next.js app deployed on Vercel's serverless platform, needing live chat, typically runs a separate small Node.js service (often on a platform like Fly.io, Railway, or a plain EC2 instance) specifically to hold the WebSocket connections, while the rest of the app's pages and API routes continue running as ordinary serverless functions.",
        hi: 'Ek production Next.js app jo Vercel ke serverless platform pe deployed hai, jise live chat chahiye, typically ek separate chhota Node.js service chalata hai (aksar Fly.io, Railway, ya ek plain EC2 instance jaise platform pe) specifically WebSocket connections hold karne ke liye, jabki app ke baaki pages aur API routes ordinary serverless functions ki tarah chalte rehte hain.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't a serverless function typically hold a WebSocket connection open reliably?",
        qHi: 'Ek serverless function typically ek WebSocket connection ko reliably open kyun nahi hold kar sakta?',
        a: "A serverless function is optimized to spin up quickly, do a small bounded amount of work, and shut down — its whole economic and scaling model depends on instances being short-lived and reusable. A WebSocket needs a connection to stay open indefinitely, which would require the holding function instance to stay alive for that entire duration, defeating the resource model serverless platforms are built on. Many platforms explicitly cap execution duration for exactly this reason.",
        aHi: 'Ek serverless function jaldi spin up hone, ek chhota bounded amount ka kaam karne, aur shutdown hone ke liye optimized hai — uska poora economic aur scaling model is baat pe depend karta hai ki instances short-lived aur reusable hon. Ek WebSocket ko ek connection ki zaroorat hai jo indefinitely open rahe, jise holding function instance ko us poori duration ke liye alive rehna padega, us resource model ko defeat karte hue jispe serverless platforms banaye gaye hain. Kai platforms exactly isi wajah se explicitly execution duration cap karte hain.',
      },
      {
        q: "What's the general fix for adding a real-time (WebSocket) feature to an app deployed on serverless functions?",
        qHi: 'Serverless functions pe deployed ek app mein ek real-time (WebSocket) feature add karne ka general fix kya hai?',
        a: "Use separate infrastructure specifically designed to hold long-lived connections — either a small dedicated, always-running server (e.g. a Node.js process running Socket.IO) or a managed real-time service (Pusher, Ably). The serverless functions handle everything else and only make short API calls to trigger real-time events, never holding the connection themselves.",
        aHi: 'Alag infrastructure use karo specifically long-lived connections hold karne ke liye design ki gayi — ya to ek chhota dedicated, hamesha-chalne wala server (jaise Socket.IO chala raha ek Node.js process) ya ek managed real-time service (Pusher, Ably). Serverless functions baaki sab handle karte hain aur sirf short API calls karte hain real-time events trigger karne ke liye, khud kabhi connection hold nahi karte.',
      },
    ],

    exercises: [
      {
        task: "A team wants to add a 'live typing indicator' (showing when another user is typing in a chat) to their Next.js app deployed entirely on serverless functions. Explain what infrastructure decision this requires before writing any feature code.",
        taskHi: 'Ek team apne Next.js app mein ek \'live typing indicator\' add karna chahti hai (dikhate hue jab ek doosra user chat mein type kar raha ho) jo poori tarah serverless functions pe deployed hai. Explain karo is ke liye kaunsa infrastructure decision chahiye kisi bhi feature code likhne se pehle.',
        hint: "A typing indicator needs to notify other connected users the instant someone starts typing, without polling — think about whether that's genuinely a persistent-connection requirement.",
        hintHi: 'Ek typing indicator ko doosre connected users ko notify karna hai us instant jab koi type karna shuru kare, bina polling ke — socho ki kya ye genuinely ek persistent-connection requirement hai.',
      },
    ],

    keyTakeaways: [
      "A serverless function is optimized for short-lived, bounded work and reused/discarded instances — the opposite of what a WebSocket needs, which is a single connection staying open indefinitely.",
      'This is a fundamental resource-model mismatch, not a configuration problem — no timeout setting makes hours-long connections practical on infrastructure designed around short, interchangeable invocations.',
      "The fix is separate infrastructure built for long-lived connections: a dedicated always-running server (Socket.IO on its own Node.js process) or a managed real-time service (Pusher, Ably) — not a clever Route Handler.",
      'This constraint applies to any serverless-deployed application, not something specific to Next.js — a Next.js app deployed on a traditional always-running server can hold WebSocket connections directly.',
    ],
    keyTakeawaysHi: [
      'Ek serverless function short-lived, bounded kaam aur reused/discarded instances ke liye optimized hai — bilkul opposite us cheez ka jo ek WebSocket ko chahiye, jo ek single connection ka indefinitely open rehna hai.',
      'Ye ek fundamental resource-model mismatch hai, ek configuration problem nahi — koi timeout setting ghanton-lambi connections ko us infrastructure pe practical nahi banati jo short, interchangeable invocations ke around design ki gayi hai.',
      'Fix long-lived connections ke liye banaya gaya separate infrastructure hai: ek dedicated hamesha-chalne wala server (apne khud ke Node.js process pe Socket.IO) ya ek managed real-time service (Pusher, Ably) — koi clever Route Handler nahi.',
      'Ye constraint kisi bhi serverless-deployed application pe apply hota hai, Next.js ke liye specific kuch nahi — ek Next.js app jo ek traditional hamesha-chalne wale server pe deployed hai directly WebSocket connections hold kar sakta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-server-sent-events',
    title: 'Server-Sent Events — The Simpler Alternative',
    titleHi: 'Server-Sent Events — Simpler Alternative',
    description:
      "A large share of what feels like a WebSocket requirement is really just one-directional server-to-client updates — a live notification count, a progress bar, a live score. Server-Sent Events deliver exactly that, over a plain HTTP connection, without a separate real-time server or a new protocol.",
    descriptionHi:
      'Jo ek WebSocket requirement jaisa feel hota hai uska ek bada hissa really sirf one-directional server-to-client updates hain — ek live notification count, ek progress bar, ek live score. Server-Sent Events exactly wahi deliver karte hain, ek plain HTTP connection ke over, bina ek separate real-time server ya ek naye protocol ke.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A one-way radio broadcast versus a two-way walkie-talkie.** A radio station broadcasts continuously to anyone tuned in — listeners can't talk back over the same channel, and don't need to, because the format is fundamentally one-directional: station to listener. A walkie-talkie, by contrast, is built for both sides to actively transmit. Most 'real-time' features are really a radio broadcast in disguise — a server has updates and wants to push them out, and the client's only job is to listen and react — which is exactly what Server-Sent Events are: a broadcast channel, without the two-way infrastructure a full WebSocket walkie-talkie requires.",
      hi: 'Ek one-way radio broadcast versus ek two-way walkie-talkie. Ek radio station kisi bhi tuned-in insaan ko continuously broadcast karta hai — listeners wahi channel pe wapas baat nahi kar sakte, aur unhe zaroorat bhi nahi hai, kyunki format fundamentally one-directional hai: station se listener tak. Ek walkie-talkie, iske contrast mein, dono sides ke actively transmit karne ke liye banaya gaya hai. Zyadatar \'real-time\' features really ek disguise mein radio broadcast hain — ek server ke paas updates hain aur wo unhe push karna chahta hai, aur client ka sirf kaam hai sunna aur react karna — jo exactly Server-Sent Events hain: ek broadcast channel, ek poore WebSocket walkie-talkie ko chahiye wo two-way infrastructure ke bina.',
    },

    simple: `**The key insight: most "real-time" needs are one-directional (server
pushes updates; client just listens) — Server-Sent Events (SSE) handle
this over plain HTTP, with no separate protocol or infrastructure:**

\`\`\`ts
// app/api/notifications/route.ts — a Route Handler that streams events
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const count = await getUnreadNotificationCount();
        const event = \`data: \${JSON.stringify({ count })}\\n\\n\`;
        controller.enqueue(encoder.encode(event));
      }, 5000); // check every 5 seconds and push if there's something new

      // Clean up when the client disconnects
      // (request.signal, not shown here for brevity, should trigger this)
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
\`\`\`

\`\`\`tsx
// Client-side: the browser's native EventSource API, no library needed
'use client';
import { useEffect, useState } from 'react';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data.count);
    };
    return () => eventSource.close(); // clean up on unmount
  }, []);

  return <span>{count} unread</span>;
}
\`\`\`

**Why SSE avoids the Module 11 Lesson 1 problem, at least partially:** an
SSE connection is still a long-lived HTTP response, so it faces a
version of the same serverless duration-limit issue — but it's simpler
infrastructure than a full WebSocket setup (no separate protocol, no
separate server needed for many hosting setups that support streaming
responses), and the browser's built-in \`EventSource\` automatically
reconnects if the connection drops, which you'd otherwise have to
implement yourself for a WebSocket.

**When SSE is the right choice, and when it isn't:** SSE is right when the
SERVER needs to push updates and the client never needs to send anything
back over that same channel (notification counts, live scores, a
progress indicator, streaming an AI response token by token). It's the
wrong tool when the client also needs to send frequent messages back
(a live cursor position, a chat message) — that genuinely bidirectional
case is where Lesson 3's WebSocket-based approach earns its complexity.`,

    simpleHi: `**Key insight: zyadatar "real-time" needs one-directional hoti hain
(server updates push karta hai; client bas sunta hai) — Server-Sent
Events (SSE) ise plain HTTP ke over handle karte hain, bina kisi separate
protocol ya infrastructure ke:**

\`\`\`ts
// app/api/notifications/route.ts — ek Route Handler jo events stream karta hai
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const count = await getUnreadNotificationCount();
        const event = \`data: \${JSON.stringify({ count })}\\n\\n\`;
        controller.enqueue(encoder.encode(event));
      }, 5000); // har 5 seconds mein check karo aur push karo agar kuch naya hai

      // Client disconnect karne pe cleanup karo
      // (request.signal, brevity ke liye yahan nahi dikhaya, ise trigger karna chahiye)
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
\`\`\`

\`\`\`tsx
// Client-side: browser ka native EventSource API, koi library nahi chahiye
'use client';
import { useEffect, useState } from 'react';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data.count);
    };
    return () => eventSource.close(); // unmount pe cleanup karo
  }, []);

  return <span>{count} unread</span>;
}
\`\`\`

**SSE Module 11 Lesson 1 ki problem ko kyun avoid karta hai, at least
partially:** ek SSE connection abhi bhi ek long-lived HTTP response hai,
isliye ye usi serverless duration-limit issue ka ek version face karta
hai — par ye ek poore WebSocket setup se simpler infrastructure hai (koi
separate protocol nahi, kai hosting setups ke liye koi separate server
nahi chahiye jo streaming responses support karte hain), aur browser ka
built-in \`EventSource\` automatically reconnect karta hai agar connection
drop ho jaaye, jo aapko warna ek WebSocket ke liye khud implement karna
padta.

**SSE sahi choice kab hai, aur kab nahi:** SSE sahi hai jab SERVER ko
updates push karne hain aur client ko kabhi wahi channel ke over kuch
wapas bhejne ki zaroorat nahi (notification counts, live scores, ek
progress indicator, ek AI response ko token by token streaming). Ye galat
tool hai jab client ko bhi frequent messages wapas bhejne hain (ek live
cursor position, ek chat message) — wo genuinely bidirectional case hai
jahan Lesson 3 ka WebSocket-based approach apni complexity earn karta hai.`,

    content: `## Why SSE is genuinely simpler than a WebSocket, mechanically

A WebSocket requires an initial HTTP handshake that then "upgrades" the
connection to a completely different protocol — after the upgrade, it's
no longer HTTP at all. Server-Sent Events are, by contrast, just a
regular HTTP response that never finishes sending — the server keeps the
response stream open and writes new chunks of data to it over time,
formatted in a simple, specific text format (\`data: ...\\n\\n\`). This means
SSE works through ordinary HTTP infrastructure (proxies, load balancers)
without any special handling, whereas a WebSocket sometimes requires
specific infrastructure support for the protocol upgrade.

## What EventSource gives you for free

The browser's native \`EventSource\` API automatically handles reconnection
if the connection drops — including exponential backoff between retry
attempts — entirely without you writing any reconnection logic yourself.
A WebSocket client, by contrast, requires you to write your own
reconnection handling (listening for a close event, deciding when and how
to retry) since the raw WebSocket API doesn't do this automatically. This
is a genuine, practical advantage for the specific use cases SSE fits.

## Streaming an LLM response is a real, common SSE use case

The token-by-token streaming familiar from AI chat interfaces is
frequently implemented as Server-Sent Events under the hood: the server
receives tokens from a language model as they're generated and forwards
each one to the client immediately via the same open response stream,
rather than waiting for the complete response before sending anything.
This is one-directional (server pushes tokens; the client doesn't need to
send anything back mid-stream), making it a natural fit for SSE rather
than a full WebSocket.

## Where SSE's one-directional nature becomes a real limitation

If a feature genuinely needs the client to send frequent messages back
over the same real-time channel — not an occasional unrelated API call,
but tightly coupled back-and-forth (a live cursor's constantly-updating
position, a collaborative document's edits from multiple people) — SSE's
one-way design becomes a real constraint, not just an inconvenience. This
is precisely the boundary Lesson 3 explores: presence and live-cursor
features are the genuinely bidirectional case where a WebSocket-based
service is the right tool, not a workaround-shaped use of SSE.`,

    contentHi: `## SSE mechanically genuinely ek WebSocket se simpler kyun hai

Ek WebSocket ko ek initial HTTP handshake chahiye jo phir connection ko
ek poori tarah alag protocol mein "upgrade" karta hai — upgrade ke baad,
ye bilkul HTTP nahi rehta. Server-Sent Events, iske contrast mein, bas ek
regular HTTP response hai jo kabhi bhejna finish nahi karta — server
response stream ko open rakhta hai aur time ke saath usme data ke naye
chunks likhta hai, ek simple, specific text format mein formatted
(\`data: ...\\n\\n\`). Iska matlab hai SSE ordinary HTTP infrastructure
(proxies, load balancers) ke through kaam karta hai bina kisi special
handling ke, jabki ek WebSocket ko kabhi-kabhi protocol upgrade ke liye
specific infrastructure support chahiye hota hai.

## EventSource aapko free mein kya deta hai

Browser ka native \`EventSource\` API automatically reconnection handle
karta hai agar connection drop hoti hai — retry attempts ke beech
exponential backoff samet — poori tarah bina aapke khud koi reconnection
logic likhe. Ek WebSocket client, iske contrast mein, aapko apna khud ka
reconnection handling likhna padta hai (ek close event sunna, decide karna
kab aur kaise retry karna hai) kyunki raw WebSocket API ye automatically
nahi karta. Ye ek genuine, practical advantage hai un specific use cases
ke liye jo SSE fit karte hain.

## Ek LLM response stream karna ek real, common SSE use case hai

AI chat interfaces se familiar token-by-token streaming aksar under the
hood Server-Sent Events ki tarah implement hoti hai: server ek language
model se tokens receive karta hai jaise wo generate hote hain aur har ek
ko turant client ko forward karta hai wahi open response stream ke
through, complete response ka wait karne ke bajaye kuch bhejne se pehle.
Ye one-directional hai (server tokens push karta hai; client ko mid-stream
kuch wapas bhejne ki zaroorat nahi), ise ek naturally SSE ke liye fit
banate hue ek poore WebSocket ke bajaye.

## SSE ki one-directional nature genuinely ek limitation kab ban jaati hai

Agar ek feature ko genuinely client ko wahi real-time channel ke over
frequent messages wapas bhejne chahiye — ek occasional unrelated API call
nahi, balki tightly coupled back-and-forth (ek live cursor ki constantly-
updating position, ek collaborative document ke edits kai logon se), SSE
ka one-way design ek real constraint ban jata hai, sirf ek inconvenience
nahi. Ye precisely wo boundary hai jise Lesson 3 explore karta hai:
presence aur live-cursor features wo genuinely bidirectional case hain
jahan ek WebSocket-based service sahi tool hai, SSE ka ek workaround-shaped
use nahi.`,

    examples: [
      {
        title: 'Streaming an AI response token by token via Server-Sent Events',
        titleHi: 'Server-Sent Events ke through ek AI response ko token by token stream karna',
        codeJs: `// app/api/chat/route.js
export async function POST(request) {
  const { prompt } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const aiStream = await getAiCompletionStream(prompt); // yields tokens
      for await (const token of aiStream) {
        const event = \`data: \${JSON.stringify({ token })}\\n\\n\`;
        controller.enqueue(encoder.encode(event));
      }
      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}

// Client-side: rendering tokens as they arrive, not waiting for the full response
'use client';
export function ChatResponse({ prompt }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(\`/api/chat?prompt=\${encodeURIComponent(prompt)}\`);
    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') { eventSource.close(); return; }
      const { token } = JSON.parse(event.data);
      setText((prev) => prev + token);
    };
    return () => eventSource.close();
  }, [prompt]);

  return <p>{text}</p>;
}`,
        codeTs: `// app/api/chat/route.ts
export async function POST(request: Request) {
  const { prompt } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const aiStream = await getAiCompletionStream(prompt); // yields tokens
      for await (const token of aiStream) {
        const event = \`data: \${JSON.stringify({ token })}\\n\\n\`;
        controller.enqueue(encoder.encode(event));
      }
      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}

// Client-side: rendering tokens as they arrive, not waiting for the full response
'use client';
import { useEffect, useState } from 'react';

export function ChatResponse({ prompt }: { prompt: string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(\`/api/chat?prompt=\${encodeURIComponent(prompt)}\`);
    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') { eventSource.close(); return; }
      const { token } = JSON.parse(event.data);
      setText((prev) => prev + token);
    };
    return () => eventSource.close();
  }, [prompt]);

  return <p>{text}</p>;
}`,
        code: `const stream = new ReadableStream({
  async start(controller) {
    for await (const token of aiStream) {
      controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ token })}\\n\\n\`));
    }
    controller.close();
  },
});
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });`,
        output:
          "The client sees text appear incrementally, token by token, as the AI generates them — rather than a blank screen followed by the entire response appearing all at once once generation completes.",
        explain:
          "This is a textbook one-directional use case for SSE: the server has a continuous stream of data (AI tokens) to push, and the client's only job is to receive and render them — no back-and-forth is needed over this channel, which is exactly what SSE is built for.",
        explainHi:
          "Ye SSE ke liye ek textbook one-directional use case hai: server ke paas push karne ke liye data (AI tokens) ka ek continuous stream hai, aur client ka sirf kaam hai unhe receive aur render karna — is channel ke over koi back-and-forth ki zaroorat nahi, jo exactly wahi hai jiske liye SSE banaya gaya hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reaching for a full WebSocket setup for a purely one-directional feature
// (a live "X people viewing this page" counter that only the server updates)
// — setting up Socket.IO, a separate server, and client-side connection
// management for something that never needs the client to send anything back.`,
        right: `// Using Server-Sent Events instead — simpler, no separate server needed
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const count = await getCurrentViewerCount();
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ count })}\\n\\n\`));
      }, 3000);
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
}`,
        why: "Setting up a full WebSocket infrastructure (a separate server, a bidirectional protocol) for a feature that only ever pushes data one direction adds real infrastructure and maintenance cost for capability the feature doesn't need — SSE delivers the same one-directional update over plain HTTP with far less complexity.",
        whyHi:
          "Ek poora WebSocket infrastructure setup karna (ek separate server, ek bidirectional protocol) ek aise feature ke liye jo sirf ek direction mein data push karta hai real infrastructure aur maintenance cost add karta hai us capability ke liye jo feature ko chahiye hi nahi — SSE wahi one-directional update plain HTTP pe deliver karta hai kaafi kam complexity ke saath.",
      },
    ],

    realWorld: [
      {
        en: "Most AI chat products (ChatGPT's web interface among them) stream their responses using Server-Sent Events specifically because the interaction is genuinely one-directional during generation — the server has tokens to push, and the client only needs to render them, with no back-and-forth needed over that same channel.",
        hi: 'Zyadatar AI chat products (ChatGPT ka web interface unme se ek) apne responses stream karte hain Server-Sent Events use karte hue specifically kyunki interaction genuinely one-directional hai generation ke dauran — server ke paas push karne ke liye tokens hain, aur client ko sirf unhe render karna hai, wahi channel ke over koi back-and-forth ki zaroorat nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What makes Server-Sent Events a simpler choice than a WebSocket for many real-time features?',
        qHi: 'Server-Sent Events ko kai real-time features ke liye ek WebSocket se simpler choice kya banata hai?',
        a: "SSE is just a regular HTTP response that stays open and streams data over time, using ordinary HTTP infrastructure without a protocol upgrade — and the browser's native EventSource API handles automatic reconnection for you. A WebSocket requires an HTTP-to-WebSocket protocol upgrade and manual reconnection handling.",
        aHi: 'SSE bas ek regular HTTP response hai jo open rehta hai aur time ke saath data stream karta hai, ordinary HTTP infrastructure use karte hue bina ek protocol upgrade ke — aur browser ka native EventSource API automatic reconnection aapke liye handle karta hai. Ek WebSocket ko ek HTTP-to-WebSocket protocol upgrade aur manual reconnection handling chahiye.',
      },
      {
        q: 'When is Server-Sent Events the wrong tool, even though it handles many real-time cases well?',
        qHi: 'Server-Sent Events kab galat tool hai, chahe ye kai real-time cases ko achhe se handle karta ho?',
        a: "When the client genuinely needs to send frequent messages back over the same channel — SSE is fundamentally one-directional (server to client only). A live cursor position or a collaborative editing feature, where both sides constantly send updates, needs a genuinely bidirectional mechanism like a WebSocket.",
        aHi: 'Jab client ko genuinely wahi channel ke over frequent messages wapas bhejne hain — SSE fundamentally one-directional hai (sirf server se client). Ek live cursor position ya ek collaborative editing feature, jahan dono sides constantly updates bhejte hain, ek genuinely bidirectional mechanism chahiye jaise ek WebSocket.',
      },
    ],

    exercises: [
      {
        task: "For each of these, decide whether SSE is sufficient or a genuinely bidirectional mechanism is needed: (1) a live stock price ticker, (2) a live multiplayer cursor showing where other users' mice are on a shared canvas, (3) a build pipeline's live log output streamed to a dashboard.",
        taskHi: 'In sab mein se har ek ke liye, decide karo ki kya SSE sufficient hai ya ek genuinely bidirectional mechanism chahiye: (1) ek live stock price ticker, (2) ek live multiplayer cursor jo dikhata hai doosre users ke mouse ek shared canvas pe kahan hain, (3) ek build pipeline ka live log output ek dashboard tak streamed.',
        hint: "Ask, for each: does the client ever need to send frequent updates back over the SAME channel, or does it only ever receive and display?",
        hintHi: 'Har ek ke liye poochho: kya client ko kabhi WAHI channel ke over frequent updates wapas bhejne ki zaroorat hai, ya ye sirf receive aur display karta hai?',
      },
    ],

    keyTakeaways: [
      "A large share of 'real-time' feature requirements are genuinely one-directional — the server pushes updates, and the client only listens — which is exactly what Server-Sent Events (SSE) handle.",
      'SSE is a regular, long-lived HTTP response streaming text-formatted events over time, requiring no protocol upgrade and no separate real-time server for many hosting setups.',
      "The browser's native EventSource API automatically handles reconnection, which a raw WebSocket client would require you to implement yourself.",
      "SSE is the wrong tool specifically when the client needs to send frequent messages back over the same channel — that genuinely bidirectional need is where a WebSocket-based approach (Lesson 3) is the right choice.",
    ],
    keyTakeawaysHi: [
      "'Real-time' feature requirements ka ek bada share genuinely one-directional hota hai — server updates push karta hai, aur client bas sunta hai — jo exactly wahi hai jo Server-Sent Events (SSE) handle karte hain.",
      'SSE ek regular, long-lived HTTP response hai jo time ke saath text-formatted events stream karta hai, koi protocol upgrade nahi chahiye aur kai hosting setups ke liye koi separate real-time server nahi chahiye.',
      'Browser ka native EventSource API automatically reconnection handle karta hai, jo ek raw WebSocket client mein aapko khud implement karna padta.',
      'SSE galat tool hai specifically jab client ko wahi channel ke over frequent messages wapas bhejne hain — wo genuinely bidirectional need hai jahan ek WebSocket-based approach (Lesson 3) sahi choice hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-presence-live-cursors-realtime-optimistic',
    title: 'Presence, Live Cursors & Real-Time Plus Optimistic UI',
    titleHi: 'Presence, Live Cursors Aur Real-Time Plus Optimistic UI',
    description:
      "Genuinely bidirectional real-time features — who's currently online, where each collaborator's cursor is right now — need a real WebSocket-based service. Combining that real-time layer with the optimistic UI from Module 5 is what makes collaborative apps feel instant for the person acting, not just for everyone watching.",
    descriptionHi:
      'Genuinely bidirectional real-time features — kaun currently online hai, har collaborator ka cursor abhi kahan hai — ko ek real WebSocket-based service chahiye. Us real-time layer ko Module 5 ke optimistic UI ke saath combine karna wahi hai jo collaborative apps ko instant feel karwata hai us insaan ke liye jo act kar raha hai, sirf dekhne walon ke liye nahi.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A shared office whiteboard where everyone can see who's currently in the room AND watch each other's pen move in real time, versus a suggestion box where you drop in a note and wait for someone to read it later.** Presence and live cursors are the whiteboard: you see a colleague's avatar appear the moment they walk in, and watch their pen move across the board as they draw, live. This needs a genuinely two-way channel — every participant is both a sender (their own movements) and a receiver (everyone else's) at the same time. A suggestion box is the one-directional case from Lesson 2: you drop something in, nobody needs to watch you do it in real time.",
      hi: 'Ek shared office whiteboard jahan har koi dekh sakta hai ki kaun currently room mein hai AUR ek doosre ka pen real time mein move hote dekh sakta hai, versus ek suggestion box jahan aap ek note daalte ho aur baad mein koi ise padhne ka wait karta hai. Presence aur live cursors whiteboard hain: aap ek colleague ka avatar dekhte ho jis moment wo andar aata hai, aur unka pen board ke across move hote dekhte ho jaise wo draw karte hain, live. Isko ek genuinely two-way channel chahiye — har participant ek saath sender (apne khud ke movements) aur receiver (baaki sabke) dono hai. Ek suggestion box Lesson 2 ka one-directional case hai: aap kuch daalte ho, kisi ko aapko real time mein aisa karte dekhne ki zaroorat nahi.',
    },

    simple: `**Presence: knowing who else is currently connected, in real time:**

\`\`\`ts
// A real-time service (Pusher/Ably-style API) tracking who's in a "room"
const channel = pusher.subscribe(\`presence-document-\${docId}\`);

channel.bind('pusher:member_added', (member) => {
  showUserJoined(member.info); // someone else just connected
});
channel.bind('pusher:member_removed', (member) => {
  showUserLeft(member.info); // someone disconnected
});
\`\`\`

**Live cursors: a genuinely bidirectional, high-frequency stream — every
participant sends AND receives constantly:**

\`\`\`tsx
'use client';
function CollaborativeCanvas({ docId }) {
  const channel = usePresenceChannel(\`presence-document-\${docId}\`);

  function handleMouseMove(e) {
    channel.trigger('client-cursor-move', { x: e.clientX, y: e.clientY });
    // sent constantly, many times per second, to every other participant
  }

  useEffect(() => {
    channel.bind('client-cursor-move', (data, memberId) => {
      updateOtherUserCursor(memberId, data.x, data.y);
    });
  }, [channel]);

  return <canvas onMouseMove={handleMouseMove} />;
}
\`\`\`

**Combining real-time with optimistic UI (from Module 5) — why both
matter together:** in a collaborative to-do list, when YOU check off an
item, you want to see it checked instantly (optimistic UI, no waiting for
a round-trip) — but everyone ELSE watching needs to see your change too,
which requires the real-time layer to broadcast it to them:

\`\`\`tsx
async function handleCheck(itemId) {
  addOptimisticUpdate(itemId, { checked: true }); // instant, for the person clicking
  await updateItemOnServer(itemId, { checked: true }); // persists it
  channel.trigger('client-item-updated', { itemId, checked: true }); // tells everyone else
}
\`\`\`

**The pattern this reveals:** optimistic UI (Module 5) makes an action
feel instant for the PERSON PERFORMING it; the real-time layer makes that
same change appear promptly for EVERYONE ELSE watching. A genuinely good
collaborative feature needs both — optimistic UI alone leaves other
participants stale until their next full data refresh, and a real-time
layer alone still makes the acting user wait for a round-trip before
seeing their own change reflected.`,

    simpleHi: `**Presence: real time mein jaanna ki baaki kaun currently connected hai:**

\`\`\`ts
// Ek real-time service (Pusher/Ably-style API) track kar raha hai kaun ek "room" mein hai
const channel = pusher.subscribe(\`presence-document-\${docId}\`);

channel.bind('pusher:member_added', (member) => {
  showUserJoined(member.info); // koi doosra abhi connect hua
});
channel.bind('pusher:member_removed', (member) => {
  showUserLeft(member.info); // koi disconnect hua
});
\`\`\`

**Live cursors: ek genuinely bidirectional, high-frequency stream — har
participant constantly bhejta AUR receive karta hai:**

\`\`\`tsx
'use client';
function CollaborativeCanvas({ docId }) {
  const channel = usePresenceChannel(\`presence-document-\${docId}\`);

  function handleMouseMove(e) {
    channel.trigger('client-cursor-move', { x: e.clientX, y: e.clientY });
    // constantly bheja jata hai, per second kai baar, har doosre participant ko
  }

  useEffect(() => {
    channel.bind('client-cursor-move', (data, memberId) => {
      updateOtherUserCursor(memberId, data.x, data.y);
    });
  }, [channel]);

  return <canvas onMouseMove={handleMouseMove} />;
}
\`\`\`

**Real-time ko optimistic UI (Module 5 se) ke saath combine karna — dono
saath kyun matter karte hain:** ek collaborative to-do list mein, jab AAP
ek item check off karte ho, aap use instantly checked dekhna chahte ho
(optimistic UI, ek round-trip ka wait kiye bina) — par jo bhi ise dekh
raha hai BAAKI sabko bhi aapka change dikhna chahiye, jise real-time layer
ki zaroorat hai use unhe broadcast karne ke liye:

\`\`\`tsx
async function handleCheck(itemId) {
  addOptimisticUpdate(itemId, { checked: true }); // instant, click karne wale ke liye
  await updateItemOnServer(itemId, { checked: true }); // ise persist karta hai
  channel.trigger('client-item-updated', { itemId, checked: true }); // baaki sabko batata hai
}
\`\`\`

**Ye pattern jo reveal karta hai:** optimistic UI (Module 5) ek action ko
PERFORM KARNE WALE INSAAN ke liye instant feel karwata hai; real-time
layer wahi change ko BAAKI SAB dekhne walon ke liye promptly appear karwata
hai. Ek genuinely achha collaborative feature ko dono chahiye — akela
optimistic UI baaki participants ko unke agle poore data refresh tak
stale chhod deta hai, aur akela ek real-time layer bhi acting user ko
apna khud ka change reflect hote dekhne se pehle ek round-trip ka wait
karwata hai.`,

    content: `## Why presence and live cursors are the genuinely bidirectional case

Every participant in a shared, collaborative surface is simultaneously
producing updates (their own cursor position, their own edits) and
consuming everyone else's — there's no meaningful "server" and "client"
role distinction in the way SSE assumes; every connected browser is both.
This symmetric, many-to-many communication pattern is exactly what a
WebSocket-based service (Lesson 1's dedicated server, or a managed service
like Pusher/Ably) is built for, and exactly what SSE's one-directional
design can't express.

## Why managed real-time services are common for this specific need

Building and correctly scaling your own WebSocket infrastructure — connection
management, presence tracking, message fan-out to potentially thousands
of simultaneous participants across many "rooms" — is genuinely
substantial engineering work. Managed services (Pusher, Ably, and similar)
handle this infrastructure as a product, giving your application a
simpler API (subscribe to a channel, trigger an event, listen for events)
while they manage the actual connection-holding servers, scaling, and
reliability. This mirrors the Stripe pattern from Module 10: outsourcing
genuinely hard infrastructure to a specialized provider rather than
building it in-house, for exactly the same reason.

## Why optimistic UI and real-time are complementary, not redundant

It's tempting to think "if the real-time layer will broadcast my change to
everyone, doesn't that include me too?" In practice, round-tripping your
own action through the real-time service before showing it to yourself
adds a delay for the one person whose experience matters most in that
moment — the person actively interacting. Applying optimistic UI locally
for your own action, while relying on the real-time layer specifically to
inform OTHER participants, gives the best of both: instant feedback for
the actor, and prompt (not instant, but fast) updates for everyone else.

## Handling conflicting simultaneous edits, briefly

Once real-time collaboration allows multiple people to change the same
data nearly simultaneously, a genuine question arises: what happens when
two people's changes conflict? Full conflict resolution (operational
transformation, CRDTs) is a deep, specialized topic beyond this lesson's
scope, but it's worth naming explicitly: real-time infrastructure alone
doesn't resolve conflicting edits for you — for features involving true
concurrent editing of the same data (not just independent cursors or
presence), a purpose-built collaborative editing library or service is
usually the practical answer rather than building conflict resolution
from scratch.`,

    contentHi: `## Presence aur live cursors genuinely bidirectional case kyun hain

Ek shared, collaborative surface mein har participant simultaneously
updates produce kar raha hai (apna khud ka cursor position, apne khud ke
edits) aur baaki sab ke consume kar raha hai — koi meaningful "server" aur
"client" role distinction nahi hai us tarah jaise SSE assume karta hai;
har connected browser dono hai. Ye symmetric, many-to-many communication
pattern exactly wahi hai jiske liye ek WebSocket-based service (Lesson 1
ka dedicated server, ya Pusher/Ably jaisi ek managed service) banaya gaya
hai, aur exactly wo hai jise SSE ka one-directional design express nahi
kar sakta.

## Managed real-time services is specific need ke liye common kyun hain

Apna khud ka WebSocket infrastructure banana aur correctly scale karna —
connection management, presence tracking, potentially hazaron
simultaneous participants ko kai "rooms" ke across message fan-out —
genuinely substantial engineering kaam hai. Managed services (Pusher,
Ably, aur similar) is infrastructure ko ek product ki tarah handle karte
hain, aapki application ko ek simpler API dete hue (ek channel subscribe
karo, ek event trigger karo, events suno) jabki wo actual
connection-holding servers, scaling, aur reliability manage karte hain.
Ye Module 10 se Stripe pattern ko mirror karta hai: genuinely hard
infrastructure ko ek specialized provider ko outsource karna in-house
banane ke bajaye, exactly usi wajah se.

## Optimistic UI aur real-time complementary kyun hain, redundant nahi

Ye tempting hai sochna "agar real-time layer mera change sab ko broadcast
karega, kya isme main bhi shamil nahi?" Practically, apne khud ke action
ko real-time service ke through round-trip karna khud ko dikhane se pehle
us ek insaan ke liye ek delay add karta hai jiska experience us moment
sabse zyada matter karta hai — wo insaan jo actively interact kar raha
hai. Apne khud ke action ke liye locally optimistic UI apply karna, jabki
real-time layer pe specifically BAAKI participants ko inform karne ke
liye rely karna, dono ka best deta hai: actor ke liye instant feedback,
aur baaki sab ke liye prompt (instant nahi, par fast) updates.

## Conflicting simultaneous edits handle karna, briefly

Ek baar real-time collaboration kai logon ko wahi data almost
simultaneously change karne deta hai, ek genuine sawaal uthta hai: kya
hota hai jab do logon ke changes conflict karte hain? Poora conflict
resolution (operational transformation, CRDTs) ek deep, specialized topic
hai is lesson ke scope se pare, par ise explicitly naam lena worth hai:
real-time infrastructure akela conflicting edits aapke liye resolve nahi
karta — un features ke liye jo true concurrent editing involve karte hain
wahi data ka (sirf independent cursors ya presence nahi), ek purpose-built
collaborative editing library ya service usually practical jawab hai
scratch se conflict resolution banane ke bajaye.`,

    examples: [
      {
        title: 'A collaborative task list combining optimistic UI for the actor with real-time broadcast for everyone else',
        titleHi: 'Ek collaborative task list jo actor ke liye optimistic UI ko baaki sab ke liye real-time broadcast ke saath combine karta hai',
        codeJs: `'use client';
import { useOptimistic } from 'react';
import { usePusherChannel } from '@/lib/realtime';

export function CollaborativeTaskList({ taskListId, initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [optimisticTasks, addOptimisticUpdate] = useOptimistic(
    tasks,
    (current, { taskId, checked }) =>
      current.map((t) => (t.id === taskId ? { ...t, checked } : t)),
  );
  const channel = usePusherChannel(\`presence-tasklist-\${taskListId}\`);

  // Listen for OTHER participants' changes, broadcast over the real-time channel
  useEffect(() => {
    channel.bind('client-task-updated', ({ taskId, checked }) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, checked } : t)));
    });
  }, [channel]);

  async function handleCheck(taskId, checked) {
    addOptimisticUpdate({ taskId, checked });        // instant, for THIS user
    await updateTaskOnServer(taskId, checked);        // persists it
    channel.trigger('client-task-updated', { taskId, checked }); // tells everyone else
  }

  return (
    <ul>
      {optimisticTasks.map((task) => (
        <TaskRow key={task.id} task={task} onCheck={handleCheck} />
      ))}
    </ul>
  );
}`,
        codeTs: `'use client';
import { useOptimistic, useEffect, useState } from 'react';
import { usePusherChannel } from '@/lib/realtime';

interface Task {
  id: string;
  checked: boolean;
}

export function CollaborativeTaskList({
  taskListId,
  initialTasks,
}: {
  taskListId: string;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [optimisticTasks, addOptimisticUpdate] = useOptimistic(
    tasks,
    (current, { taskId, checked }: { taskId: string; checked: boolean }) =>
      current.map((t) => (t.id === taskId ? { ...t, checked } : t)),
  );
  const channel = usePusherChannel(\`presence-tasklist-\${taskListId}\`);

  // Listen for OTHER participants' changes, broadcast over the real-time channel
  useEffect(() => {
    channel.bind('client-task-updated', ({ taskId, checked }: { taskId: string; checked: boolean }) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, checked } : t)));
    });
  }, [channel]);

  async function handleCheck(taskId: string, checked: boolean) {
    addOptimisticUpdate({ taskId, checked });        // instant, for THIS user
    await updateTaskOnServer(taskId, checked);        // persists it
    channel.trigger('client-task-updated', { taskId, checked }); // tells everyone else
  }

  return (
    <ul>
      {optimisticTasks.map((task) => (
        <TaskRow key={task.id} task={task} onCheck={handleCheck} />
      ))}
    </ul>
  );
}`,
        code: `async function handleCheck(taskId, checked) {
  addOptimisticUpdate({ taskId, checked });
  await updateTaskOnServer(taskId, checked);
  channel.trigger('client-task-updated', { taskId, checked });
}`,
        output:
          "The user who clicks the checkbox sees it check instantly (optimistic UI), with no perceptible delay. Every other participant currently viewing the same task list sees the checkbox update within a fraction of a second, via the real-time channel — not instantly, but far faster than waiting for their next full page refresh.",
        explain:
          "The optimistic update and the real-time broadcast serve two different audiences: addOptimisticUpdate is purely local, making the UI feel instant for the person clicking, while channel.trigger is what makes the change visible to everyone else — removing either one leaves a real gap in the experience for one of those two audiences.",
        explainHi:
          "Optimistic update aur real-time broadcast do alag audiences ko serve karte hain: addOptimisticUpdate purely local hai, UI ko click karne wale ke liye instant feel karwata hai, jabki channel.trigger wo hai jo change ko baaki sab ke liye visible banata hai — dono mein se kisi ek ko hatana un do audiences mein se ek ke experience mein ek real gap chhod deta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Only relying on optimistic UI, with no real-time broadcast to other viewers
async function handleCheck(taskId, checked) {
  addOptimisticUpdate({ taskId, checked }); // instant for me
  await updateTaskOnServer(taskId, checked); // persists it
  // No broadcast — other viewers only see this change on their NEXT full reload
}`,
        right: `// Optimistic UI for the actor, PLUS a real-time broadcast for everyone else
async function handleCheck(taskId, checked) {
  addOptimisticUpdate({ taskId, checked });
  await updateTaskOnServer(taskId, checked);
  channel.trigger('client-task-updated', { taskId, checked }); // tells other viewers now
}`,
        why: "Optimistic UI only affects the local component state of the person who performed the action — it has no mechanism to notify other browsers currently viewing the same data. Without an explicit real-time broadcast, other participants see a stale view until they happen to refresh or re-fetch, defeating the purpose of a 'collaborative' feature.",
        whyHi:
          "Optimistic UI sirf us insaan ke local component state ko affect karta hai jisne action perform kiya — iske paas doosre browsers ko notify karne ka koi mechanism nahi hai jo currently wahi data dekh rahe hain. Ek explicit real-time broadcast ke bina, doosre participants ek stale view dekhte hain jab tak wo refresh ya re-fetch na karein, ek 'collaborative' feature ke purpose ko defeat karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A collaborative design tool (in the style of Figma) uses presence to show which teammates are currently viewing a file, live cursors to show exactly where each person's pointer is on the canvas in real time, and optimistic UI so that the person actively dragging a shape sees it move instantly rather than waiting for a server round-trip on every pixel of movement.",
        hi: 'Ek collaborative design tool (Figma ke style mein) presence use karta hai ye dikhane ke liye ki kaunse teammates currently ek file dekh rahe hain, live cursors ye dikhane ke liye ki har insaan ka pointer canvas pe real time mein exactly kahan hai, aur optimistic UI taaki jo insaan actively ek shape drag kar raha hai wo ise instantly move hote dekhe har pixel ke movement pe server round-trip ka wait karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "Why are presence and live-cursor features genuinely bidirectional, unlike the SSE use cases from the previous lesson?",
        qHi: 'Presence aur live-cursor features genuinely bidirectional kyun hain, pichhle lesson ke SSE use cases ke unlike?',
        a: "Every connected participant is simultaneously producing updates (their own presence, their own cursor movements) and consuming everyone else's — there's no fixed server-pushes/client-listens role. This symmetric, many-to-many pattern needs a real WebSocket-based channel, which SSE's one-directional design cannot express.",
        aHi: 'Har connected participant simultaneously updates produce kar raha hai (apni khud ki presence, apne khud ke cursor movements) aur baaki sab ke consume kar raha hai — koi fixed server-pushes/client-listens role nahi hai. Ye symmetric, many-to-many pattern ko ek real WebSocket-based channel chahiye, jise SSE ka one-directional design express nahi kar sakta.',
      },
      {
        q: 'Why does a collaborative feature need both optimistic UI and a real-time broadcast, rather than just one?',
        qHi: 'Ek collaborative feature ko optimistic UI aur ek real-time broadcast dono kyun chahiye, sirf ek nahi?',
        a: "Optimistic UI makes the change feel instant for the person performing the action, but only affects their own local state — it doesn't notify anyone else. A real-time broadcast informs other participants of the change, but without optimistic UI, even the acting user would have to wait for a round-trip before seeing their own action reflected.",
        aHi: 'Optimistic UI action perform karne wale insaan ke liye change ko instant feel karwata hai, par sirf unke apne local state ko affect karta hai — ye kisi aur ko notify nahi karta. Ek real-time broadcast baaki participants ko change ke baare mein inform karta hai, par optimistic UI ke bina, acting user ko bhi apna khud ka action reflect hote dekhne se pehle ek round-trip ka wait karna padega.',
      },
    ],

    exercises: [
      {
        task: "A collaborative whiteboard app shows other users' live cursors but doesn't yet use optimistic UI for the local user's own drawing actions — drawing feels laggy for the person actually drawing. Explain what to add and why it specifically fixes that laggy feeling.",
        taskHi: 'Ek collaborative whiteboard app doosre users ke live cursors dikhata hai par abhi tak local user ke apne drawing actions ke liye optimistic UI use nahi karta — drawing us insaan ke liye laggy feel karta hai jo actually draw kar raha hai. Explain karo kya add karna hai aur ye specifically us laggy feeling ko kaise fix karta hai.',
        hint: "Consider what path the local user's own drawing strokes are currently taking before appearing on their own screen versus what path they could take instead.",
        hintHi: 'Socho ki local user ke apne drawing strokes currently kaunsa path lete hain apne khud ke screen pe appear hone se pehle versus wo iske bajaye kaunsa path le sakte hain.',
      },
    ],

    keyTakeaways: [
      "Presence and live cursors are genuinely bidirectional — every participant simultaneously produces and consumes updates — which needs a real WebSocket-based channel, not SSE's one-directional model.",
      'Managed real-time services (Pusher, Ably) handle the substantial infrastructure work of connection management, presence tracking, and message fan-out, the same outsourcing pattern as using Stripe for payments.',
      "Optimistic UI (making an action feel instant for the person performing it) and real-time broadcast (informing everyone else of the change) are complementary, not redundant — a genuinely good collaborative feature needs both.",
      'Real-time infrastructure alone does not resolve conflicting simultaneous edits to the same data — true concurrent editing typically needs a purpose-built collaborative editing library or service.',
    ],
    keyTakeawaysHi: [
      'Presence aur live cursors genuinely bidirectional hain — har participant simultaneously updates produce aur consume karta hai — jise ek real WebSocket-based channel chahiye, SSE ka one-directional model nahi.',
      'Managed real-time services (Pusher, Ably) connection management, presence tracking, aur message fan-out ke substantial infrastructure kaam ko handle karte hain, wahi outsourcing pattern jo payments ke liye Stripe use karne mein hai.',
      'Optimistic UI (ek action ko us insaan ke liye instant feel karwana jo ise perform kar raha hai) aur real-time broadcast (baaki sab ko change ke baare mein inform karna) complementary hain, redundant nahi — ek genuinely achhe collaborative feature ko dono chahiye.',
      'Akela real-time infrastructure wahi data ke conflicting simultaneous edits resolve nahi karta — true concurrent editing ko typically ek purpose-built collaborative editing library ya service chahiye.',
    ],
  },
];
