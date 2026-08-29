/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 8.
 *
 * Server-Sent Events (SSE): why reaching for full WebSockets (covered in
 * Module 6) for a feature that only ever needs the SERVER to push updates
 * — a live job-progress indicator, a notification feed — adds real
 * complexity (a client library, a bidirectional protocol, connection
 * object management) for a capability the feature never actually needed
 * in the other direction. Broken example: a "video processing progress"
 * feature built with Socket.io even though the client never sends
 * anything back after the initial request. Fixed with SSE: a plain HTTP
 * response kept open with Content-Type: text/event-stream, the server
 * writing "data: ...\n\n" chunks over time, and the browser's built-in
 * EventSource API on the client — no library, automatic reconnection
 * built into the browser itself, and it works over plain HTTP with no
 * special server upgrade at all.
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

export const NODE_MODULE_7_PART8: CourseLesson[] = [
  {
    slug: 'server-sent-events',
    title: 'Server-Sent Events: A Simpler Tool for One-Way Live Updates',
    titleHi: 'Server-Sent Events: One-Way Live Updates Ke Liye Ek Saadha Tool',
    description: 'A "video processing progress" bar is built with a full WebSocket library — even though the client only ever listens, and never once sends anything back over that connection.',
    descriptionHi: 'Ek "video processing progress" bar ek poori WebSocket library se banaayi jaati hai — chahe client sirf hamesha sunta hai, aur us connection par kabhi kuch bhi wapas nahi bhejta.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 8,

    analogy: {
      en: '**Installing a full two-way intercom system, with a microphone and speaker on both ends, just so someone downstairs can occasionally shout progress updates up a staircase — versus simply leaving the basement door open so the sound naturally carries up on its own.** Using a full bidirectional WebSocket connection purely to let a server push periodic progress updates to a client is like installing a complete two-way intercom system — wiring, a microphone and speaker at both ends, a control panel — specifically to solve the much narrower problem of a person in the basement occasionally needing to call out "still working on it... halfway done... almost there" up to someone waiting on the floor above, who never once needs to respond back down through that same system. The intercom genuinely works for this, but it is a disproportionate amount of installed equipment and ongoing complexity for a need that was only ever one person occasionally speaking in one direction. Someone solving this correctly instead simply leaves the basement door propped open — sound carries up naturally and continuously the whole time work is happening below, using nothing more than what the house already has, with no wiring, no control panel, and no capability (or need) for the person upstairs to speak back down through that same open door. The moment the actual need becomes a real back-and-forth conversation between both floors, the two-way intercom earns its complexity — but for simply keeping someone informed of progress, leaving a door open is the simpler, sufficient, and more appropriate solution for what the situation actually calls for.',
      hi: '**Ek poora do-taraf intercom system lagaana, dono taraf ek microphone aur speaker ke saath, sirf isliye taaki neeche koi kabhi-kabhi seedhiyon se upar progress updates chilla sake — versus bas basement ka darwaaza khula chhodna taaki awaaz apne aap upar pahunche.** Ek poora bidirectional WebSocket connection sirf isliye istemal karna taaki ek server periodic progress updates ek client ko push kar sake ek poora do-taraf intercom system lagaane jaisa hai — wiring, dono taraf ek microphone aur speaker, ek control panel — khaas taur par us kaafi sankeern samasya ko solve karne ke liye ki basement mein koi kabhi-kabhi "abhi kaam kar raha hoon... aadha ho gaya... lagbhag ho gaya" bolna chahta hai upar wale floor par intezaar kar rahe kisi tak, jise us hi system se kabhi neeche jawaab dene ki zarurat nahi. Intercom sach mein iske liye kaam karta hai, par ye ek asaman tadaad ka lagaaya gaya samaan aur chalti complexity hai ek zarurat ke liye jo hamesha sirf ek insaan ka kabhi-kabhi ek disha mein bolna thi. Koi jo ise sahi tarike se solve karta hai iske bajaye bas basement ka darwaaza khula rakhta hai — awaaz naisargik taur par aur lagaataar upar aati hai jab tak neeche kaam ho raha hai, ghar mein pehle se maujood se zyaada kuch istemal kiye bina, koi wiring nahi, koi control panel nahi, aur upar wale insaan ke liye us hi khule darwaaze se wapas neeche bolne ki koi kshamta (ya zarurat) nahi. Jis pal asli zarurat dono floors ke beech ek asli aage-peeche baatcheet ban jaati hai, do-taraf intercom apni complexity kamaata hai — par bas kisi ko progress ki jaankaari dete rehne ke liye, ek darwaaza khula chhodna zyaada saadha, kaafi, aur uchit solution hai jo sthiti asal mein maangti hai.',
    },

    simple: `**Start unnecessarily complex.** A video-processing progress feature built with full Socket.io, even though the client only ever listens:

\`\`\`js
// Server
const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("watch-progress", (jobId) => {
    const interval = setInterval(async () => {
      const job = await getJobStatus(jobId);
      socket.emit("progress-update", { percent: job.percent });
      if (job.percent >= 100) clearInterval(interval);
    }, 1000);
  });
});
\`\`\`

\`\`\`js
// Client
const socket = io();
socket.emit("watch-progress", jobId);
socket.on("progress-update", (data) => updateProgressBar(data.percent));
\`\`\`

This works, and following this course\'s earlier WebSockets lesson, it is a completely valid way to push server-side updates to a client. But look closely at what this feature actually needs: the client asks to watch one specific job once, and from that point on, only the SERVER ever sends anything — a stream of progress percentages — for as long as that job runs. The client never sends anything else back over this connection; there is no genuine two-way conversation happening at all, only a one-directional trickle of updates flowing server-to-client. Using Socket.io here means installing and shipping a client-side library (\`socket.io-client\`) to the browser, running a genuinely bidirectional protocol capable of the client sending arbitrary events back at any time, and managing a persistent connection object — real, ongoing complexity that this specific feature never actually exercises in the direction it was built to support.

**The fix: Server-Sent Events — a plain HTTP response the server keeps writing to over time**

\`\`\`js
app.get("/jobs/:id/progress", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);

    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval)); // stop working if the client disconnects
});
\`\`\`

\`\`\`js
// Client — no library at all, just the browser's own built-in EventSource
const eventSource = new EventSource(\`/jobs/\${jobId}/progress\`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.percent);
};
\`\`\`

\`\`\`ts
app.get("/jobs/:id/progress", async (req: Request, res: Response): Promise<void> => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);

    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval));
});
\`\`\`

An SSE response is, at its core, an ordinary HTTP response that the server simply never fully closes right away — setting \`Content-Type: text/event-stream\` and then repeatedly calling \`res.write()\` sends each new chunk of data down the exact same already-open connection, formatted as plain text lines starting with \`data:\` and separated by a blank line. On the client, the browser\'s own built-in \`EventSource\` API (no library to install at all) opens this connection and fires its \`onmessage\` handler every time a new chunk arrives — critically, \`EventSource\` also automatically attempts to reconnect on its own if the connection drops, a capability this course\'s WebSockets lesson noted Socket.io provides as an added feature, here built directly into the browser platform itself for free. For a feature that only ever needs the server to push updates in one direction, this is dramatically simpler on both ends — no client library, no bidirectional protocol to manage, just a long-lived, ordinary HTTP response.`,

    simpleHi: `**Na-zaruri taur par complex se shuru.** Ek video-processing progress feature poori Socket.io se banaayi gayi, chahe client sirf hamesha sunta hai:

\`\`\`js
// Server
const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("watch-progress", (jobId) => {
    const interval = setInterval(async () => {
      const job = await getJobStatus(jobId);
      socket.emit("progress-update", { percent: job.percent });
      if (job.percent >= 100) clearInterval(interval);
    }, 1000);
  });
});
\`\`\`

\`\`\`js
// Client
const socket = io();
socket.emit("watch-progress", jobId);
socket.on("progress-update", (data) => updateProgressBar(data.percent));
\`\`\`

Ye kaam karta hai, aur is course ke pehle wale WebSockets lesson ka palan karte hue, ye server-side updates ko ek client tak push karne ka ek poori tarah valid tarika hai. Par dhyaan se dekho ye feature asal mein kya chahta hai: client ek khaas job dekhne ki maang ek baar karta hai, aur us pal se, sirf SERVER kuch bhejta hai — progress percentages ki ek stream — jab tak wo job chalti hai. Client is connection se kabhi kuch aur wapas nahi bhejta; koi asli do-taraf baatcheet ho hi nahi rahi, sirf ek-disha wali updates ki ek trickle server-to-client bahti hai. Yahan Socket.io istemal karna matlab hai browser mein ek client-side library (\`socket.io-client\`) install aur ship karna, ek sach mein bidirectional protocol chalaana jo client ko kisi bhi waqt manmaane events wapas bhejne ke kaabil banaata hai, aur ek persistent connection object manage karna — asli, chalti complexity jise ye khaas feature asal mein us disha mein kabhi exercise nahi karta jise support karne ke liye ye banaayi gayi thi.

**Fix: Server-Sent Events — ek saadha HTTP response jise server waqt ke saath likhta rehta hai**

\`\`\`js
app.get("/jobs/:id/progress", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);

    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval)); // client disconnect hote hi kaam rokna
});
\`\`\`

\`\`\`js
// Client — bilkul koi library nahi, sirf browser ka apna built-in EventSource
const eventSource = new EventSource(\`/jobs/\${jobId}/progress\`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.percent);
};
\`\`\`

\`\`\`ts
app.get("/jobs/:id/progress", async (req: Request, res: Response): Promise<void> => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);

    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval));
});
\`\`\`

Ek SSE response, apne mool mein, ek aam HTTP response hai jise server bas turant poori tarah band nahi karta — \`Content-Type: text/event-stream\` set karna aur phir baar-baar \`res.write()\` bulaana har naya data ka tukda bilkul usi pehle-se-khuli connection se neeche bhejta hai, plain text lines ki tarah format kiya hua jo \`data:\` se shuru hote hain aur ek khaali line se alag hote hain. Client par, browser ka apna built-in \`EventSource\` API (bilkul koi library install nahi karni) is connection ko kholta hai aur apna \`onmessage\` handler har baar fire karta hai jab ek naya tukda aata hai — bahut zaruri, \`EventSource\` bhi apne aap dobara connect karne ki koshish karta hai agar connection toot jaaye, ek kshamta jo is course ke WebSockets lesson ne note ki thi ki Socket.io ek jodi hui feature ki tarah deta hai, yahan seedha browser platform ke andar hi muft mein banayi hui. Ek feature ke liye jise sirf server ko ek disha mein updates push karni hain, ye dono taraf naatakiya taur par saadha hai — koi client library nahi, koi bidirectional protocol manage karne ke liye nahi, bas ek lambi-chalti, aam HTTP response.`,

    content: `## Recognizing when SSE fits and when WebSockets are genuinely needed instead

\`\`\`
SSE fits: server-to-client only, ordinary text/JSON data — live notifications,
a progress bar, a live-updating dashboard, a stock ticker, a activity feed.

WebSockets are needed: the client also needs to send data back over the
same connection — chat (this course's WebSockets lesson), collaborative
editing, multiplayer game state, or anything needing binary data.
\`\`\`

The deciding question, directly following this course\'s WebSockets lesson, is simple: does the CLIENT ever need to send data back to the server over this same persistent connection, or does only the server ever push anything? A live notification feed, a progress indicator, a dashboard of constantly-updating numbers, and an activity feed are all naturally one-directional — the server has updates, the client only ever receives them. SSE is purpose-built for exactly this shape of problem and is meaningfully simpler to implement and reason about when it fits. The moment a feature genuinely needs the client to send messages back over the same channel (this course\'s chat example, collaborative cursors, multiplayer game moves), SSE cannot support that at all — WebSockets\' bidirectional design is what that specific shape of problem actually requires, and reaching for SSE there would mean building a separate, second mechanism (an ordinary HTTP POST) just for the client-to-server direction, adding its own complexity rather than avoiding it.

## The SSE wire format: what "data: ...\\n\\n" actually means

\`\`\`
data: {"percent": 25}

data: {"percent": 50}

data: {"percent": 100}

\`\`\`

The Server-Sent Events specification defines a simple, plain-text wire format: each individual message is one or more lines starting with \`data:\`, followed by a blank line marking the end of that message — the browser\'s \`EventSource\` parses this format automatically, delivering each complete message to the \`onmessage\` handler as its \`event.data\` string. Beyond the basic \`data:\` field, the format also supports an optional \`event:\` line (letting the client listen for specifically named event types via \`addEventListener\`, rather than only the generic \`onmessage\`) and an \`id:\` line (letting the browser automatically tell the server, on reconnection, the last event ID it successfully received via a \`Last-Event-ID\` header) — features that exist specifically to support the automatic-reconnection behavior mentioned above without losing track of what has already been delivered.

## A real limitation: SSE is one-directional and text-only

\`\`\`js
// SSE cannot send binary data directly, and the client cannot reply over the same connection —
// a feature needing either of these genuinely needs WebSockets instead
\`\`\`

SSE\'s simplicity comes with two genuine, deliberate limitations worth knowing clearly: the data field is fundamentally text (JSON, commonly, exactly as shown in this lesson\'s examples, but not raw binary data), and the connection is fundamentally one-directional — a client wanting to send anything back must do so through a completely separate, ordinary HTTP request, not through the same SSE connection. Neither of these is a flaw so much as a direct consequence of SSE solving a deliberately narrower problem than WebSockets do — recognizing which of these two genuinely different tools an actual feature\'s requirements call for, rather than defaulting to whichever is more familiar, is the real skill this lesson and the earlier WebSockets lesson together are meant to build.

## Browser connection limits: a real, practical consideration

\`\`\`
Older HTTP/1.1 browsers commonly limit the number of simultaneous
connections to a single domain (historically around 6) — opening several
separate SSE connections to the same origin can hit this limit. HTTP/2,
now widely supported, removes this specific constraint by multiplexing
many streams over a single underlying connection.
\`\`\`

A detail worth knowing at a professional level: because each open \`EventSource\` connection is, at the protocol level, an ordinary HTTP connection kept open, browsers historically enforced a limit on how many simultaneous connections a page could hold open to one single origin — opening many separate SSE connections to the same domain could exhaust this limit and prevent other requests from proceeding. Modern HTTP/2 (now the default for most production deployments behind a modern reverse proxy or CDN) resolves this specific concern by multiplexing many logical streams over one shared underlying connection, making this less of a practical constraint than it once was — but it remains a reasonable detail to be aware of when a page might need several independent SSE connections open simultaneously.`,

    contentHi: `## Pehchaanna ki SSE kab fit baithta hai aur kab sach mein WebSockets chahiye

\`\`\`
SSE fit baithta hai: sirf server-se-client, aam text/JSON data — live
notifications, ek progress bar, ek live-update-hota dashboard, ek stock
ticker, ek activity feed.

WebSockets chahiye: client ko bhi bilkul usi connection se data wapas bhejna
chahiye — chat (is course ka WebSockets lesson), collaborative editing,
multiplayer game state, ya kuch bhi jise binary data chahiye.
\`\`\`

Faisla lene wala sawaal, is course ke WebSockets lesson ka seedha palan karte hue, saadha hai: kya CLIENT ko kabhi bilkul isi persistent connection se data wapas bhejna chahiye, ya sirf server hi kuch push karta hai? Ek live notification feed, ek progress indicator, hamesha-badalti numbers ka ek dashboard, aur ek activity feed sab naisargik taur par ek-disha wale hain — server ke paas updates hain, client sirf unhe paata hai. SSE bilkul is kism ki samasya ke liye khaas taur par bana hai aur maayne-rakhta taur par lagu karna aur samajhna saadha hai jab ye fit baithta hai. Jis pal ek feature ko sach mein client bilkul usi channel se messages wapas bhejna chahiye (is course ka chat example, collaborative cursors, multiplayer game moves), SSE ise bilkul support nahi kar sakta — WebSockets ka bidirectional design wo hai jo us khaas kism ki samasya asal mein maangti hai, aur wahan SSE ki taraf pahunchna matlab hoga ek alag, doosra mechanism banaana (ek aam HTTP POST) sirf client-se-server disha ke liye, complexity bachaane ke bajaye jodте hue.

## SSE ka wire format: \`"data: ...\\n\\n"\` asal mein kya matlab rakhta hai

\`\`\`
data: {"percent": 25}

data: {"percent": 50}

data: {"percent": 100}

\`\`\`

Server-Sent Events specification ek saadha, plain-text wire format define karti hai: har akeli message \`data:\` se shuru hoti ek ya zyaada lines hai, uske baad ek khaali line jo us message ka aakhir chihnit karti hai — browser ka \`EventSource\` is format ko apne aap parse karta hai, har poori message ko \`onmessage\` handler tak uske \`event.data\` string ki tarah pahunchate hue. Basic \`data:\` field se aage, format ek vaikalpik \`event:\` line ko bhi support karta hai (client ko khaas naam-liye event types ke liye \`addEventListener\` ke through sunne dete hue, sirf aam \`onmessage\` ke bajaye) aur ek \`id:\` line (browser ko dobara-connect hote waqt apne aap server ko aakhri event ID batane dete hue jo usne safaltapoorvak paayi thi \`Last-Event-ID\` header ke through) — features jo khaas taur par upar mention hui apne-aap-reconnection vyavhaar ko support karne ke liye maujood hain bina ye track khoye ki kya pehle se deliver ho chuka hai.

## Ek asli seemaa: SSE ek-disha wali aur sirf-text hai

\`\`\`js
// SSE seedha binary data nahi bhej sakta, aur client bilkul usi connection se jawaab nahi de sakta —
// ek feature jise inmein se koi bhi chahiye use sach mein iske bajaye WebSockets chahiye
\`\`\`

SSE ki saadgi ke saath do asli, jaan-boojhkar seemaayein aati hain jo saaf jaanna kaam ka hai: data field buniyaadi taur par text hai (JSON, aam taur par, bilkul jaisa is lesson ke examples dikhaate hain, raw binary data nahi), aur connection buniyaadi taur par ek-disha wala hai — ek client jo kuch bhi wapas bhejna chahta hai use ek poori tarah alag, aam HTTP request ke through karna chahiye, wahi SSE connection se nahi. Inmein se koi bhi ek kami itni nahi hai jitna SSE ke WebSockets se jaan-boojhkar ek sankeern samasya solve karne ka seedha nateeja — ye pehchaanna ki inmein se kaunsa do sach mein alag tools ek asli feature ki zaruraten maangti hain, jo bhi zyaada jaana-pehchaana hai us par default hone ke bajaye, wo asli skill hai jise ye lesson aur pehle wala WebSockets lesson saath banaane ke liye maane gaye hain.

## Browser connection limits: ek asli, practical baat

\`\`\`
Purane HTTP/1.1 browsers aam taur par ek akele domain ke liye ek saath
connections ki tadaad simit karte the (historically lagbhag 6) — usi
origin ko kai alag SSE connections kholna is seemaa ko chhoo sakta hai.
HTTP/2, ab vyapak taur par supported, kai streams ko ek shared underlying
connection par multiplex karke is khaas rok ko hataata hai.
\`\`\`

Ek detail jo professional star par jaanna kaam ka hai: kyunki har khula \`EventSource\` connection, protocol level par, ek aam khuli rakhi hui HTTP connection hai, browsers historically ek seemaa lagu karte the ki ek page ek akele origin ke liye kitni ek saath connections khuli rakh sakta hai — usi domain ko kai alag SSE connections kholna is seemaa ko khatam kar sakta hai aur doosri requests ko aage badhne se rok sakta hai. Modern HTTP/2 (ab zyaadatar production deployments ke liye default jo ek modern reverse proxy ya CDN ke peeche hain) is khaas chinta ko resolve karta hai kai logical streams ko ek shared underlying connection par multiplex karke, ise pehle se kam practical rok banaate hue — par ye ek uchit detail hai jaanna kaam ka jab ek page ko shaayad ek saath kai mustaqil SSE connections khule chaahiye.`,

    examples: [
      {
        title: 'Unnecessarily complex: full Socket.io for a one-way progress update',
        titleHi: 'Na-zaruri taur par complex: ek-disha wale progress update ke liye poora Socket.io',
        code: `io.on("connection", (socket) => {
  socket.on("watch-progress", (jobId) => {
    const interval = setInterval(async () => {
      socket.emit("progress-update", { percent: (await getJobStatus(jobId)).percent });
    }, 1000);
  });
});
// the client never sends anything else back over this connection`,
        codeJs: `const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("watch-progress", (jobId) => {
    const interval = setInterval(async () => {
      const job = await getJobStatus(jobId);
      socket.emit("progress-update", { percent: job.percent });
      if (job.percent >= 100) clearInterval(interval);
    }, 1000);
  });
});

// Client — requires installing and shipping socket.io-client
const socket = io();
socket.emit("watch-progress", jobId);
socket.on("progress-update", (data) => updateProgressBar(data.percent));`,
        codeTs: `import { Server } from "socket.io";
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("watch-progress", (jobId: string) => {
    const interval = setInterval(async () => {
      const job = await getJobStatus(jobId);
      socket.emit("progress-update", { percent: job.percent });
      if (job.percent >= 100) clearInterval(interval);
    }, 1000);
  });
});
// Correctly typed, completely valid TypeScript — the issue is entirely
// about using a bidirectional tool for a one-directional need, not a
// code defect.`,
        output: `Works correctly, but requires a client-side library, a bidirectional
protocol handshake, and connection object management — none of which
this specific one-way feature ever actually uses in the client-to-
server direction.`,
        explain: 'The feature only ever needs the server to push data — the client never sends anything back, meaning the bidirectional capability WebSockets provide is never actually exercised here.',
        explainHi: 'Feature ko sirf server ko data push karna chahiye — client kabhi kuch wapas nahi bhejta, matlab bidirectional kshamta jo WebSockets deta hai yahan kabhi asal mein istemal hi nahi hoti.',
      },
      {
        title: 'Fixed: Server-Sent Events, no client library needed',
        titleHi: 'Theek: Server-Sent Events, koi client library zaruri nahi',
        code: `res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);
// client: new EventSource("/jobs/123/progress")`,
        codeJs: `app.get("/jobs/:id/progress", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);
    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval));
});

// Client — no library at all
const eventSource = new EventSource(\`/jobs/\${jobId}/progress\`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.percent);
};`,
        codeTs: `app.get("/jobs/:id/progress", async (req: Request, res: Response): Promise<void> => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(async () => {
    const job = await getJobStatus(req.params.id);
    res.write(\`data: \${JSON.stringify({ percent: job.percent })}\\n\\n\`);
    if (job.percent >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval));
});`,
        outputJs: `Identical end-user experience — the progress bar updates live — with
no client-side library, no bidirectional protocol, and automatic
reconnection handled natively by the browser's own EventSource
implementation.`,
        outputTs: `// Identical behaviour. req.on("close", ...) stops the server from
// continuing to do work (querying job status) once the client has
// actually disconnected, avoiding a resource leak.`,
        explain: 'The entire mechanism is an ordinary HTTP response kept open — no special server upgrade, no client library, matching the actual one-directional shape of the feature.',
        explainHi: 'Poora mechanism ek aam khuli rakhi HTTP response hai — koi khaas server upgrade nahi, koi client library nahi, feature ki asli ek-disha wali shape se milta hua.',
      },
      {
        title: 'Recognizing when WebSockets are genuinely needed instead of SSE',
        titleHi: 'Pehchaanna jab SSE ke bajaye sach mein WebSockets chahiye',
        code: `// Chat requires the client to send messages back — SSE cannot support this at all
socket.emit("send-message", text); // WebSockets, not SSE, is the right tool here`,
        codeJs: `// A one-way notification feed: SSE fits well
app.get("/notifications/stream", (req, res) => {
  res.set({ "Content-Type": "text/event-stream" });
  // ...push notifications as they occur...
});

// A chat feature: the client must ALSO send messages — SSE cannot do this,
// so this genuinely needs the bidirectional WebSockets approach instead
io.on("connection", (socket) => {
  socket.on("send-message", (text) => io.emit("new-message", text));
});`,
        codeTs: `// A one-way notification feed: SSE fits well
app.get("/notifications/stream", (req: Request, res: Response): void => {
  res.set({ "Content-Type": "text/event-stream" });
  // ...push notifications as they occur...
});

// A chat feature: genuinely needs WebSockets, since the client must also send data
io.on("connection", (socket) => {
  socket.on("send-message", (text: string) => io.emit("new-message", text));
});`,
        outputJs: `Both features are "real-time," but only one of them is genuinely
one-directional — recognizing which is which determines whether SSE's
simplicity fits or WebSockets' bidirectional capability is actually
required.`,
        outputTs: `// Identical behaviour. This is the same distinction this course's
// WebSockets lesson relies on, applied in the opposite direction: not
// every real-time feature needs a bidirectional connection.`,
        explain: 'The deciding factor is not "is this real-time" but "does the client ever need to send data back over this same connection" — SSE only handles features where the answer is no.',
        explainHi: 'Faisla lene wala factor "kya ye real-time hai" nahi hai balki "kya client ko kabhi bilkul isi connection se data wapas bhejna chahiye" — SSE sirf un features ko sambhaalta hai jahan jawaab nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const socket = io();
socket.on("progress-update", displayProgress);
// full Socket.io for a feature that never sends anything client-to-server`,
        right: `const eventSource = new EventSource("/jobs/123/progress");
eventSource.onmessage = (event) => displayProgress(JSON.parse(event.data));
// no library needed, matching the feature's actual one-directional shape`,
        why: 'Using a bidirectional protocol and its client library for a feature that only ever needs server-to-client updates adds real complexity (a dependency, connection management) for a capability never actually exercised.',
        whyHi: 'Ek bidirectional protocol aur uski client library istemal karna ek aise feature ke liye jise sirf server-se-client updates chahiye asli complexity jodta hai (ek dependency, connection management) ek kshamta ke liye jo kabhi asal mein exercise hi nahi hoti.',
      },
      {
        wrong: `res.write(data); // no Content-Type header set at all
// the browser has no way to know this response is an SSE stream`,
        right: `res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
res.write(\`data: \${data}\\n\\n\`);
// correctly formatted per the SSE specification`,
        why: 'Without the correct Content-Type header and the "data: ...\\n\\n" formatting, the browser\'s EventSource cannot correctly parse the stream, and a plain HTTP client wrapper library may buffer the response instead of delivering it incrementally.',
        whyHi: 'Sahi \`Content-Type\` header aur \`"data: ...\\n\\n"\` formatting ke bina, browser ka \`EventSource\` stream ko sahi tarike se parse nahi kar sakta, aur ek saadha HTTP client wrapper library response ko incrementally dene ke bajaye buffer kar sakta hai.',
      },
      {
        wrong: `const interval = setInterval(async () => {
  res.write(\`data: \${JSON.stringify(await getJobStatus(id))}\\n\\n\`);
}, 1000);
// no cleanup when the client disconnects — the server keeps polling forever`,
        right: `req.on("close", () => clearInterval(interval));
// stops doing work the instant the client is no longer listening`,
        why: 'Without cleanup tied to the request\'s close event, the server keeps querying and writing to a connection nobody is listening to anymore, wasting resources indefinitely for every client that navigates away.',
        whyHi: 'Request ke close event se judi cleanup ke bina, server ek aisi connection ko query aur likhta rehta hai jise ab koi sun hi nahi raha, har us client ke liye hamesha ke liye resources barbaad karte hue jo kahin aur chala jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Server-Sent Events are a formally standardized W3C/WHATWG specification, with EventSource built directly into every major browser** — this is not an informal convention but a genuine web platform feature with the same standing as WebSockets themselves.',
        hi: '**Server-Sent Events ek formal taur par standardized W3C/WHATWG specification hain, \`EventSource\` har mukhya browser mein seedha built hua hai** — ye koi anaupcharik convention nahi hai balki ek asli web platform feature hai jiska WebSockets ke barabar hi maqaam hai.',
      },
      {
        en: '**Many real production features — live notification bells, order/delivery tracking status updates, CI/CD pipeline progress indicators, AI chat response streaming — commonly use SSE specifically because they are naturally one-directional.**',
        hi: '**Kai asli production features — live notification bells, order/delivery tracking status updates, CI/CD pipeline progress indicators, AI chat response streaming — aam taur par SSE istemal karte hain khaas taur par isliye kyunki wo naisargik taur par ek-disha wale hain.**',
      },
      {
        en: '**Popular AI chat interfaces commonly stream a model\'s response token-by-token using exactly this SSE-style mechanism** (a long-lived response the server keeps writing to) — a widely encountered, concrete real-world example of this exact pattern in production use today.',
        hi: '**Popular AI chat interfaces aam taur par ek model ka response token-dar-token stream karte hain bilkul isi SSE-style mechanism ka istemal karke** (ek lambi-chalti response jise server likhta rehta hai) — is bilkul pattern ka ek vyapak taur par mila asli-duniya udaharan jo aaj production istemal mein hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the deciding factor for choosing Server-Sent Events over WebSockets for a given real-time feature?',
        qHi: 'Ek diye real-time feature ke liye WebSockets ke oopar Server-Sent Events chunne ka faisla lene wala factor kya hai?',
        a: 'The deciding factor is not whether a feature is "real-time" in a general sense — both SSE and WebSockets are genuinely real-time technologies — but specifically whether the client ever needs to send data back to the server over that same persistent connection, in addition to receiving updates from it. If the answer is that only the server ever pushes data, and the client\'s role is purely to receive and display it (a live notification feed, a progress indicator, a dashboard of continuously updating numbers), then SSE is a correctly-scoped, simpler match for that shape of requirement, since it is specifically designed around a one-directional, server-to-client data flow and requires no client-side library, running instead on the browser\'s own built-in EventSource API over an ordinary HTTP connection. If the feature genuinely requires the client to also send messages back over that same channel — a chat application where a user both sends and receives messages, a collaborative editor where multiple participants\' changes need to reach each other, a multiplayer game where each player\'s actions need to reach the others — then SSE cannot support this at all, since its underlying design has no mechanism for the client side of the connection to transmit data; WebSockets\' genuinely bidirectional design is what such a feature actually requires. Choosing between them, then, comes down entirely to whether the actual data flow the feature needs is one-directional or two-directional, not to which technology sounds more modern or capable in the abstract.',
        aHi: 'Faisla lene wala factor ye nahi hai ki kya ek feature aam taur par "real-time" hai — SSE aur WebSockets dono sach mein real-time technologies hain — balki khaas taur par ye ki kya client ko kabhi bilkul usi persistent connection se server ko data wapas bhejna chahiye, usse updates paane ke saath-saath. Agar jawaab ye hai ki sirf server hi kabhi data push karta hai, aur client ka role poori tarah use paana aur dikhaana hai (ek live notification feed, ek progress indicator, lagaataar update hote numbers ka ek dashboard), to SSE us kism ki zarurat ke liye ek sahi-taur-par-simit, saadha milaan hai, kyunki ye khaas taur par ek-disha wale, server-se-client data flow ke aas-paas design hua hai aur koi client-side library nahi maangta, iske bajaye browser ke apne built-in \`EventSource\` API par ek aam HTTP connection ke oopar chalta hai. Agar feature ko sach mein client ko bhi bilkul usi channel se messages wapas bhejna chahiye — ek chat application jahan ek user dono messages bhejta aur paata hai, ek collaborative editor jahan kai participants ke badlaav ek-doosre tak pahunchne chahiye, ek multiplayer game jahan har player ki actions doosron tak pahunchni chahiye — to SSE ise bilkul support nahi kar sakta, kyunki uske underlying design mein connection ke client side ke liye data transmit karne ka koi mechanism nahi hai; WebSockets ka sach mein bidirectional design wo hai jo aisa feature asal mein maangta hai. Inke beech chunna, phir, poori tarah is baat par nirbhar karta hai ki feature ko asal mein chahiye data flow ek-disha wala hai ya do-disha wala, ye baat par nahi ki kaunsi technology sidhaant mein zyaada modern ya kaabil lagti hai.',
      },
      {
        q: 'Why does an SSE-based feature not require any client-side library, while a WebSocket-based feature commonly does (Socket.io)?',
        qHi: 'Ek SSE-based feature ko koi client-side library kyun nahi chahiye, jabki ek WebSocket-based feature aam taur par chahti hai (Socket.io)?',
        a: 'An SSE connection is, at the protocol level, nothing more than an ordinary HTTP response that the server simply keeps open and continues writing to over time, formatted according to a simple, publicly specified plain-text convention (lines beginning with "data:", separated by blank lines). Because this is a formally standardized part of the web platform itself, every major browser has built native, direct support for consuming exactly this format into its own JavaScript engine, in the form of the EventSource constructor — there is nothing this connection requires that the browser does not already understand and handle natively, so no additional code needs to be downloaded or installed to make use of it. A raw WebSocket connection is also natively supported by browsers at a low level (via the WebSocket constructor), but Socket.io specifically is a separate, third-party library built ON TOP OF that native capability, adding a range of conveniences the raw WebSocket API does not itself provide — automatic reconnection with configurable retry behavior, named custom events rather than only raw message strings, and the concept of "rooms" for broadcasting to a subset of connected clients, among others. These conveniences are not part of the browser\'s native WebSocket support, so using them requires downloading and running Socket.io\'s own client-side code in the browser — the library exists specifically to add capability beyond what the browser\'s raw WebSocket implementation offers on its own, which is exactly the additional layer SSE\'s simpler, fully browser-native design does not need.',
        aHi: 'Ek SSE connection, protocol level par, bas ek aam HTTP response hai jise server khula rakhta hai aur waqt ke saath likhta rehta hai, ek saadhe, saarvajanik-taur-par-specify ki gayi plain-text convention ke hisaab se format hua ("data:" se shuru hoti lines, khaali lines se alag). Kyunki ye web platform ka khud ek formal-taur-par-standardized hissa hai, har mukhya browser ne bilkul isi format ko consume karne ke liye apne khud JavaScript engine mein native, seedha support banaaya hai, \`EventSource\` constructor ke roop mein — is connection ko kuch bhi aisa nahi chahiye jo browser pehle se na samajhta ho aur native taur par sambhaalta ho, isliye iska istemal karne ke liye koi additional code download ya install karne ki zarurat nahi. Ek raw WebSocket connection bhi browsers dwara ek nichli star par native taur par supported hai (\`WebSocket\` constructor ke through), par Socket.io khaas taur par ek alag, third-party library hai jo us native kshamta ke OOPAR bani hai, kai suvidhaayen jodte hue jo raw WebSocket API khud nahi deta — configurable retry vyavhaar ke saath apne aap reconnection, sirf raw message strings ke bajaye naam-liye custom events, aur connected clients ke ek hisse ko broadcast karne ke liye "rooms" ka concept, aur bhi. Ye suvidhaayen browser ke native WebSocket support ka hissa nahi hain, isliye inhe istemal karne ke liye browser mein Socket.io ka apna client-side code download aur chalaana zaruri hai — library khaas taur par isliye maujood hai kshamta jodne ke liye browser ke raw WebSocket implementation apne aap se jo deta hai us se aage, jo bilkul wo additional layer hai jo SSE ka saadha, poori tarah browser-native design nahi maangta.',
      },
      {
        q: 'Why is it important to clean up server-side work (like a setInterval polling a job\'s status) when the client disconnects from an SSE stream?',
        qHi: 'Ek SSE stream se client disconnect hone par server-side kaam (jaise ek job ki sthiti poll karta ek \`setInterval\`) saaf karna kyun zaruri hai?',
        a: 'An SSE connection, being a long-lived HTTP response the server keeps open, can be closed from the client\'s side at any time — a user navigating away from the page, closing the browser tab, or the browser itself deciding to terminate the connection for any reason. If the server-side code driving that connection (a setInterval repeatedly checking a job\'s status and writing an update, in this lesson\'s example) has no way of being notified when this happens, it will continue running indefinitely, on its original schedule, attempting to write further updates to a connection that the client has already abandoned and is no longer listening to. This wastes real server resources — the interval keeps firing, keeps querying whatever data source it checks, and keeps attempting writes — for a client that will never receive or benefit from any of that continued work, and this waste compounds across every client that disconnects without the server ever being informed. Node\'s request object emits a "close" event specifically when the underlying connection is closed, whether by the client explicitly disconnecting or the connection otherwise terminating, and listening for this event to clear the interval (or otherwise stop whatever ongoing work was driving the stream) ensures the server\'s work for a given client genuinely stops the moment that client is actually gone, rather than continuing to run based on the incorrect assumption that the client is still there.',
        aHi: 'Ek SSE connection, ek lambi-chalti HTTP response hote hue jise server khula rakhta hai, kisi bhi waqt client ki taraf se band ki jaa sakti hai — ek user page se kahin aur chala jaana, browser tab band karna, ya browser khud kisi bhi wajah se connection khatam karne ka faisla lena. Agar us connection ko chalaata server-side code (is lesson ke example mein, ek \`setInterval\` jo baar-baar ek job ki sthiti check karta hai aur ek update likhta hai) ke paas ye jaanne ka koi tarika nahi hai ki ye kab hota hai, ye hamesha ke liye apni asli schedule par chalta rahega, ek aisi connection ko aur updates likhne ki koshish karte hue jise client pehle se chhod chuka hai aur ab sun nahi raha. Ye asli server resources barbaad karta hai — interval fire hota rehta hai, jo bhi data source ye check karta hai use query karta rehta hai, aur writes ki koshish karta rehta hai — ek client ke liye jo us chalte kaam mein se kuch bhi kabhi paayega ya faayda uthaayega nahi, aur ye barbaadi har us client ke aar-paar badhti hai jo server ke kabhi jaankaari paaye bina disconnect hota hai. Node ka request object khaas taur par ek "close" event emit karta hai jab underlying connection band hoti hai, chahe client explicitly disconnect kare ya connection kisi aur tarike se khatam ho, aur interval clear karne ke liye is event ko sunna (ya kisi aur tarike se jo bhi chalta kaam stream ko chala raha tha use rokna) sunishchit karta hai ki ek diye client ke liye server ka kaam sach mein us pal rukta hai jab wo client asal mein chala jaata hai, is galat maanyata ke aadhaar par chalte rehne ke bajaye ki client abhi bhi wahin hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a simple job-progress feature using full Socket.io, exactly as shown in the broken example, and confirm it works correctly. Note every piece of setup required on both the client and server that a purely one-directional feature does not actually need.',
        taskHi: 'Poore Socket.io se ek saadha job-progress feature banao, bilkul toote example jaisa, aur confirm karo ye sahi tarike se kaam karta hai. Har setup ka tukda note karo jo client aur server dono par zaruri hai jo ek poori tarah ek-disha wale feature ko asal mein nahi chahiye.',
        hint: 'Count the total lines of setup code (library install, connection handling, event names on both ends) versus what the fixed SSE version below will require.',
        hintHi: 'Setup code ki kul lines ginno (library install, connection handling, dono taraf event names) neeche wale theek kiye SSE version ki maang ke muqable.',
      },
      {
        task: 'Fix it with a plain SSE route (Content-Type: text/event-stream) and the browser\'s built-in EventSource on the client, with no library installed at all. Confirm identical end-user behavior.',
        taskHi: 'Ek saadhe SSE route (\`Content-Type: text/event-stream\`) aur client par browser ke built-in \`EventSource\` se theek karo, koi library bilkul install kiye bina. Identical end-user vyavhaar confirm karo.',
        hint: 'Open the browser\'s network tab and inspect the SSE connection directly — you should see the raw "data: ..." text arriving over time on a single, long-lived request.',
        hintHi: 'Browser ka network tab kholo aur seedha SSE connection ko dekho — tumhe waqt ke saath ek akeli, lambi-chalti request par raw "data: ..." text aata dikhna chahiye.',
      },
      {
        task: 'Add the req.on("close", ...) cleanup, then deliberately close the browser tab mid-stream and confirm (via a temporary console.log or a process monitor) that the server-side interval actually stops rather than continuing to run.',
        taskHi: '\`req.on("close", ...)\` cleanup jodo, phir jaan-boojhkar browser tab ko stream ke beech mein band karo aur confirm karo (ek asthaayi \`console.log\` ya ek process monitor se) ki server-side interval asal mein rukta hai chalta rehne ke bajaye.',
        hint: 'Temporarily remove the cleanup code first, close the tab, and watch the server logs continue for a job that no client is listening to anymore — then add the cleanup back and confirm the difference.',
        hintHi: 'Pehle asthaayi taur par cleanup code hataao, tab band karo, aur server logs ko ek aisi job ke liye chalte dekho jise ab koi client sun hi nahi raha — phir cleanup wapas jodo aur farak confirm karo.',
      },
    ],

    keyTakeaways: [
      'The deciding question between SSE and WebSockets is whether the client ever needs to send data back over the same persistent connection — SSE fits when only the server pushes updates; WebSockets are needed when the client sends messages too.',
      'SSE is an ordinary, long-lived HTTP response (Content-Type: text/event-stream) that the server writes "data: ...\\n\\n" chunks to over time — no special protocol upgrade is required, unlike WebSockets.',
      'The browser\'s built-in EventSource API consumes an SSE stream with no client-side library required, and includes automatic reconnection natively, a capability Socket.io provides as an added feature on top of raw WebSockets.',
      'SSE is text-only and one-directional by design — a feature genuinely needing binary data or client-to-server messages over the same channel requires WebSockets instead.',
      'A server driving an SSE stream must clean up (via the request\'s "close" event) once the client disconnects, or it continues doing wasted work for a connection nobody is listening to anymore.',
      'Reaching for a full bidirectional protocol and its client library for a feature that is naturally one-directional adds real complexity for a capability the feature never actually exercises.',
    ],
    keyTakeawaysHi: [
      'SSE aur WebSockets ke beech faisla lene wala sawaal ye hai ki kya client ko kabhi bilkul isi persistent connection se data wapas bhejna chahiye — SSE tab fit baithta hai jab sirf server updates push karta hai; WebSockets tab chahiye jab client bhi messages bhejta hai.',
      'SSE ek aam, lambi-chalti HTTP response hai (\`Content-Type: text/event-stream\`) jise server waqt ke saath \`"data: ...\\n\\n"\` tukde likhta hai — koi khaas protocol upgrade zaruri nahi, WebSockets ke ulta.',
      'Browser ka built-in \`EventSource\` API ek SSE stream ko koi client-side library zaruri hue bina consume karta hai, aur apne aap reconnection natively shaamil karta hai, ek kshamta jo Socket.io raw WebSockets ke oopar ek jodi hui feature ki tarah deta hai.',
      'SSE design se sirf-text aur ek-disha wala hai — ek feature jise sach mein binary data ya client-se-server messages bilkul usi channel se chahiye use iske bajaye WebSockets chahiye.',
      'Ek SSE stream chalaata server ko client disconnect hote hi cleanup karna chahiye (request ke "close" event ke through), warna ye ek aisi connection ke liye barbaad kaam karta rehta hai jise ab koi sun hi nahi raha.',
      'Ek naisargik taur par ek-disha wale feature ke liye ek poore bidirectional protocol aur uski client library ki taraf pahunchna asli complexity jodta hai ek kshamta ke liye jise feature kabhi asal mein exercise hi nahi karta.',
    ],
  },
];
