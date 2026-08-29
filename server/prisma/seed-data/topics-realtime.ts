import type { SeedCategory } from './topics-shared';

/**
 * Real-time: WebSockets and Socket.IO.
 *
 * Same Users / Products / Orders world as everything else — the running example
 * is order status updates and a support chat, because those are the two things
 * people actually build first.
 */
export const realtimeCategory: SeedCategory = {
  slug: 'websockets',
  name: 'WebSockets & Socket.IO',
  description: 'Real-time two-way communication — when HTTP is not enough, and what it costs.',
  icon: 'bolt',
  group: 'backend',
  topics: [
    {
      slug: 'ws-why-not-http',
      title: 'Why HTTP is not enough',
      difficulty: 'EASY',
      summary: 'HTTP only lets the client ask. The server can never speak first — so live updates need something else.',
      summaryHi: 'HTTP mein sirf client poochh sakta hai. Server kabhi pehle bol nahi sakta — isliye live updates ke liye kuch aur chahiye.',
      content: `HTTP is strictly **request → response**. The client asks, the server answers, the connection closes. The server has **no way to start a conversation**.

So how do you show a live order status, or a message arriving in chat?

**Polling** — ask every few seconds. Simple, works everywhere, and wasteful: 99% of requests come back "nothing new", and your update is stale by up to the poll interval.

**Long polling** — ask, and the server holds the request open until it *has* something. Fewer wasted requests, but each waiting client occupies a connection.

**Server-Sent Events (SSE)** — one long-lived connection, server pushes whenever it wants. Simple, auto-reconnects, works over plain HTTP. But it is **one-way only**.

**WebSockets** — one connection, **both sides** can send at any time, staying open.

The decision is usually simpler than people expect:
- Client only needs to *receive* updates → **SSE** is lighter and easier
- Both sides send frequently (chat, multiplayer, collaborative editing) → **WebSockets**
- Updates every 30s+ and you want zero infrastructure → **polling is genuinely fine**

Reaching for WebSockets when polling would do is a common over-engineering trap.`,
      contentHi: `HTTP sakhti se **request → response** hai. Client poochhta hai, server jawab deta hai, connection band. Server ke paas **baat shuru karne ka koi tareeka hi nahi**.

To live order status ya chat mein aata hua message kaise dikhaoge?

**Polling** — har kuch second poochhte raho. Simple, har jagah chalta hai, aur fizool: 99% requests "kuch naya nahi" laut ti hain, aur aapka update poll interval jitna purana ho sakta hai.

**Long polling** — poochho, aur server request ko tab tak khuli rakhta hai jab tak uske paas kuch *ho*. Kam fizool requests, par har wait karta client ek connection ghere rehta hai.

**Server-Sent Events (SSE)** — ek lambi chalne wali connection, server jab chahe push kare. Simple, khud reconnect karta hai, plain HTTP par chalta hai. Par **sirf ek taraf**.

**WebSockets** — ek connection, **dono taraf** kabhi bhi bhej sakte hain, khuli rehti hai.

Faisla aksar utna mushkil nahi jitna log samajhte hain:
- Client ko sirf updates *lene* hain → **SSE** halka aur aasan hai
- Dono taraf se baar-baar bhejna hai (chat, multiplayer, saath mein editing) → **WebSockets**
- Update har 30s+ par aur zero infrastructure chahiye → **polling sach mein theek hai**

Jahan polling kaafi thi wahan WebSockets uthana aam over-engineering trap hai.`,
      codeExample: `// Polling — simple, wasteful
setInterval(() => fetch('/api/orders/5/status'), 3000);

// SSE — one-way push, plain HTTP, auto-reconnects
const es = new EventSource('/api/orders/5/stream');
es.onmessage = (e) => setStatus(JSON.parse(e.data));

// WebSocket — two-way
const ws = new WebSocket('wss://api.example.com/orders');
ws.onmessage = (e) => setStatus(JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'subscribe', orderId: 5 }));`,
      commonMistakes: [
        'Using WebSockets where polling every 30 seconds would have been fine, then owning connection state forever.',
        'Using WebSockets when only the server ever sends — SSE is simpler and reconnects for free.',
        'Polling every second and calling it real-time. It is a load generator with delay built in.',
      ],
      interviewQuestions: [
        'Why can HTTP not push data to the client?',
        'Polling vs long polling vs SSE vs WebSockets?',
        'When would you deliberately choose SSE over WebSockets?',
      ],
      practiceQuestions: ['Implement a live order status three ways — polling, SSE, WebSocket — and compare the request counts.'],
      tags: ['websockets', 'realtime', 'http', 'must-know'],
    },

    {
      slug: 'ws-how-it-works',
      title: 'How a WebSocket connection works',
      difficulty: 'MEDIUM',
      summary: 'It starts as an HTTP request that asks to "upgrade". After the handshake, the same TCP connection carries messages both ways.',
      summaryHi: 'Ye ek HTTP request se shuru hota hai jo "upgrade" maangti hai. Handshake ke baad wahi TCP connection dono taraf messages le kar chalti hai.',
      content: `A WebSocket does not bypass HTTP — it **begins** with HTTP.

\`\`\`
Client → GET /socket HTTP/1.1
         Upgrade: websocket
         Connection: Upgrade
         Sec-WebSocket-Key: <random>

Server → 101 Switching Protocols
         Upgrade: websocket
         Sec-WebSocket-Accept: <hash of the key>

… same TCP connection, now speaking the WebSocket protocol …
\`\`\`

That \`101\` is the moment the connection stops being request/response and becomes a two-way pipe.

Why start with HTTP at all? Because it travels through existing infrastructure — proxies, firewalls, load balancers all understand port 80/443. A brand-new protocol on a strange port would be blocked everywhere.

**Use \`wss://\`, never \`ws://\`.** Plain \`ws://\` is unencrypted, and browsers refuse it from an HTTPS page anyway.

**What it means for your server:** an HTTP request is done in milliseconds and the memory is freed. A WebSocket **stays**. 10,000 users means 10,000 open connections held in memory, and it is why scaling real-time is a different problem from scaling REST.`,
      contentHi: `WebSocket HTTP ko bypass nahi karta — wo HTTP se hi **shuru** hota hai.

\`\`\`
Client → GET /socket HTTP/1.1
         Upgrade: websocket
         Connection: Upgrade
         Sec-WebSocket-Key: <random>

Server → 101 Switching Protocols
         Upgrade: websocket
         Sec-WebSocket-Accept: <key ka hash>

… wahi TCP connection, ab WebSocket protocol bol rahi hai …
\`\`\`

Wo \`101\` wahi pal hai jab connection request/response hona chhod kar do-tarfa pipe ban jati hai.

HTTP se shuru hi kyun? Kyunki wo maujuda infrastructure se guzar jata hai — proxies, firewalls, load balancers sab port 80/443 samajhte hain. Kisi ajeeb port par bilkul naya protocol har jagah block ho jata.

**\`wss://\` use karo, \`ws://\` kabhi nahi.** Plain \`ws://\` unencrypted hai, aur browsers HTTPS page se use waise bhi mana kar dete hain.

**Aapke server ke liye iska matlab:** HTTP request milliseconds mein khatam ho jati hai aur memory free ho jati hai. WebSocket **ruka rehta hai**. 10,000 users matlab 10,000 khuli connections memory mein — isiliye real-time scale karna REST scale karne se alag problem hai.`,
      codeExample: `// Raw WebSocket server (the 'ws' package)
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4002 });

wss.on('connection', (socket, req) => {
  socket.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());   // it arrives as bytes
    socket.send(JSON.stringify({ echo: msg }));
  });

  socket.on('close', () => {
    // ALWAYS clean up here — this is where leaks come from
  });
});`,
      commonMistakes: [
        'Using ws:// in production — unencrypted, and blocked from HTTPS pages.',
        'Forgetting messages are raw bytes/strings; you serialise and parse yourself.',
        'Not cleaning up on close, so disconnected users stay in your rooms and maps forever.',
        'Assuming the connection is free — every open socket costs memory for its whole lifetime.',
      ],
      interviewQuestions: [
        'How does a WebSocket connection start?',
        'What does HTTP 101 mean?',
        'Why does the handshake use HTTP at all?',
        'ws:// vs wss://?',
      ],
      practiceQuestions: ['Build a raw WebSocket echo server and watch the handshake in the browser network tab.'],
      tags: ['websockets', 'protocol', 'handshake'],
    },

    {
      slug: 'ws-socketio',
      title: 'Socket.IO — what it adds',
      difficulty: 'MEDIUM',
      summary: 'Reconnection, rooms, named events, acknowledgements and a fallback. It is not a WebSocket — it is a library that uses one.',
      summaryHi: 'Reconnection, rooms, named events, acknowledgements aur fallback. Ye WebSocket nahi hai — ye ek library hai jo WebSocket use karti hai.',
      content: `Raw WebSockets give you a pipe and nothing else. Everything below, you would otherwise write yourself:

| Socket.IO gives you | Why you would need it |
|---|---|
| **Auto-reconnect** with backoff | Wifi drops constantly on mobile |
| **Rooms** | "send to everyone watching order 5" |
| **Named events** | \`socket.on('order:updated')\` beats parsing a \`type\` field |
| **Acknowledgements** | know the other side actually received it |
| **Fallback** to HTTP long-polling | some corporate proxies still block WebSockets |
| **Adapter** for multiple servers | see the scaling topic |

**The catch people forget:** a Socket.IO client can only talk to a Socket.IO server. It has its own handshake and message format on top of the WebSocket protocol, so you cannot connect a plain \`new WebSocket()\` to it — a very common first-day confusion.

**Rooms** are the concept worth learning properly. A room is just a named group of sockets. Joining is one line, and broadcasting to a room is one line — no bookkeeping of your own.`,
      contentHi: `Raw WebSockets sirf ek pipe dete hain, aur kuch nahi. Neeche ka sab kuch aapko khud likhna padta:

| Socket.IO deta hai | Zarurat kyun padti |
|---|---|
| **Auto-reconnect** backoff ke saath | Mobile par wifi lagatar toot ti hai |
| **Rooms** | "order 5 dekh rahe sabko bhejo" |
| **Named events** | \`socket.on('order:updated')\` \`type\` field parse karne se behtar |
| **Acknowledgements** | pata chale ki doosri taraf sach mein mila |
| HTTP long-polling par **fallback** | kuch corporate proxies aaj bhi WebSockets rokte hain |
| kai servers ke liye **Adapter** | scaling wala topic dekho |

**Jo baat log bhool jaate hain:** Socket.IO client sirf Socket.IO server se hi baat kar sakta hai. Uska apna handshake aur message format hai WebSocket protocol ke upar, isliye plain \`new WebSocket()\` usse connect nahi hoga — pehle din ki bahut common confusion.

**Rooms** wo concept hai jo theek se seekhna chahiye. Room bas sockets ka ek naam wala group hai. Join karna ek line, room ko broadcast karna ek line — koi apna hisaab-kitaab nahi.`,
      codeExample: `// server
io.on('connection', (socket) => {
  socket.on('order:watch', (orderId) => {
    socket.join(\`order:\${orderId}\`);          // room = named group
  });

  socket.on('chat:send', (text, ack) => {
    io.to('support').emit('chat:message', { text, at: Date.now() });
    ack?.({ ok: true });                       // acknowledgement
  });
});

// elsewhere, when an order actually changes
io.to(\`order:\${id}\`).emit('order:updated', { status: 'shipped' });

// client
socket.emit('order:watch', 5);
socket.on('order:updated', (data) => setStatus(data.status));`,
      commonMistakes: [
        'Trying to connect a plain WebSocket client to a Socket.IO server — the protocols differ.',
        'Mismatched major versions between client and server; they refuse each other.',
        'Broadcasting with io.emit (everyone) when you meant socket.broadcast or a room.',
        'Adding Socket.IO for a one-way feed, where SSE needs no library at all.',
      ],
      interviewQuestions: [
        'What does Socket.IO add over raw WebSockets?',
        'Can a plain WebSocket client connect to Socket.IO?',
        'What is a room?',
        'io.emit vs socket.emit vs socket.broadcast.emit?',
      ],
      practiceQuestions: [
        'Build a support chat with rooms per conversation.',
        'Push live order status to only the users watching that order.',
      ],
      tags: ['socket.io', 'websockets', 'realtime', 'must-know'],
    },

    {
      slug: 'ws-auth-and-security',
      title: 'Authenticating and securing a socket',
      difficulty: 'HARD',
      summary: 'Authenticate during the handshake, re-check permissions on every event, and never trust the room id the client sends.',
      summaryHi: 'Handshake ke waqt authenticate karo, har event par permission dobara check karo, aur client ka bheja room id kabhi bharose mat lo.',
      content: `A WebSocket authenticates **once**, at connection time — then stays open for hours. That changes the security picture.

**1. Authenticate at the handshake.** Send the token in the connection payload, verify it in middleware, and attach the user to the socket. Reject before the connection is established, not after.

**2. Do not put the token in the URL.** Query strings land in server logs and proxy logs. Use the auth payload.

**3. Re-check authorisation on every event.** Being connected proved *who* they are, once. It did not prove they may join \`order:99\`. A client can emit any event with any arguments — treat every payload as untrusted input, exactly like an HTTP body.

**4. The room-id trap.** \`socket.join(room)\` with a room name straight from the client lets anyone join any room and receive other people's data. Always derive or verify the room server-side.

**5. Handle expiry.** A 15-minute token on a 4-hour connection is a problem: either re-verify periodically and disconnect, or accept that the socket outlives the token and design for it deliberately.

**6. Rate limit.** \`while(true) socket.emit(...)\` is trivial to write. HTTP rate limiters do not see socket events.

**7. Check the origin.** WebSockets are **not** protected by the browser's same-origin policy the way fetch is — CORS does not apply. Verify the \`Origin\` header yourself, or any site can open a socket to your server with the user's cookies.`,
      contentHi: `WebSocket **ek baar** authenticate hota hai, connect hote waqt — phir ghanton khula rehta hai. Isse security ki tasveer badal jati hai.

**1. Handshake par authenticate karo.** Token connection payload mein bhejo, middleware mein verify karo, aur user ko socket se jodo. Connection banne se pehle reject karo, baad mein nahi.

**2. Token URL mein mat daalo.** Query strings server logs aur proxy logs mein pahunch jaati hain. Auth payload use karo.

**3. Har event par authorisation dobara check karo.** Connected hona ek baar ye sabit karta hai ki wo *kaun* hai. Ye nahi ki wo \`order:99\` join kar sakta hai. Client koi bhi event kisi bhi argument ke saath bhej sakta hai — har payload ko untrusted input maano, bilkul HTTP body ki tarah.

**4. Room-id ka trap.** Client se aaye naam ke saath \`socket.join(room)\` karne par koi bhi kisi bhi room mein ghus kar doosron ka data le sakta hai. Room hamesha server par banao ya verify karo.

**5. Expiry sambhalo.** 4 ghante ki connection par 15 minute ka token problem hai: ya to beech-beech mein verify karke disconnect karo, ya maan lo ki socket token se zyada jeeta hai aur uske hisaab se design karo.

**6. Rate limit lagao.** \`while(true) socket.emit(...)\` likhna bahut aasan hai. HTTP rate limiters ko socket events dikhte hi nahi.

**7. Origin check karo.** WebSockets ko browser ki same-origin policy usse nahi bachati jaise fetch ko bachati hai — CORS yahan lagta hi nahi. \`Origin\` header khud verify karo, warna koi bhi site user ki cookies ke saath aapke server par socket khol sakti hai.`,
      codeExample: `// authenticate once, at the handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;   // NOT the query string
  if (!token) return next(new Error('unauthorised'));
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.data.userId = payload.sub;
    next();
  } catch {
    next(new Error('unauthorised'));
  }
});

io.on('connection', (socket) => {
  socket.on('order:watch', async (orderId) => {
    // Connected ≠ allowed. Check ownership on EVERY event.
    const owns = await ordersRepo.belongsTo(orderId, socket.data.userId);
    if (!owns) return;                          // never join a client-named room blindly
    socket.join(\`order:\${orderId}\`);
  });
});`,
      commonMistakes: [
        'Authenticating on connect and never checking permissions again.',
        'socket.join() with a room name taken straight from the client.',
        'Putting the JWT in the query string, where it lands in logs.',
        'Assuming CORS protects WebSockets — it does not. Check Origin yourself.',
        'No rate limiting on events, because the HTTP limiter never sees them.',
      ],
      interviewQuestions: [
        'How do you authenticate a WebSocket connection?',
        'Why re-check permissions per event?',
        'Does CORS apply to WebSockets?',
        'What happens when the token expires mid-connection?',
      ],
      practiceQuestions: ['Add JWT auth plus per-event ownership checks to a Socket.IO server.'],
      tags: ['websockets', 'socket.io', 'security', 'auth', 'must-know'],
    },

    {
      slug: 'ws-scaling',
      title: 'Scaling real-time across servers',
      difficulty: 'HARD',
      summary: 'Sockets are stateful, so a second server breaks broadcasting. A Redis adapter lets servers relay events to each other.',
      summaryHi: 'Sockets stateful hote hain, isliye doosra server aate hi broadcasting toot jati hai. Redis adapter servers ko ek doosre tak events pahunchane deta hai.',
      content: `This is the question that separates people who have shipped real-time from people who have read about it.

**The problem.** A REST server is stateless — any instance can serve any request. A socket server is not: the connection **lives on one specific machine**. Add a second server behind a load balancer and:

- Alice connects to **server A**, Bob connects to **server B**
- Alice sends a message; server A broadcasts to its room
- **Bob never receives it** — he is not on server A

Everything works perfectly on your laptop with one process, and breaks the moment you scale.

**The fix: an adapter.** With the Redis adapter, each server publishes emits to Redis and subscribes to the others. Server A broadcasts, Redis relays, server B delivers to Bob. It is roughly two lines.

**Sticky sessions.** Socket.IO's HTTP long-polling fallback sends several requests during the handshake, and they must all reach the *same* server. So the load balancer needs \`sticky: true\` — otherwise you get random handshake failures that look like flaky network. Pure-WebSocket transport does not need it, but the fallback does.

**Other things that bite at scale:**
- Every connection holds memory for its whole life — connection count, not request rate, is your capacity limit
- A deploy disconnects **everyone** at once, and they all reconnect together; make sure reconnection has backoff and jitter
- Presence ("who is online") must live in shared storage, not in one server's memory`,
      contentHi: `Yahi wo sawaal hai jo real-time ship kar chuke logon ko sirf padhe hue logon se alag karta hai.

**Problem.** REST server stateless hai — koi bhi instance koi bhi request sambhal le. Socket server nahi: connection **ek khaas machine par rehti hai**. Load balancer ke peeche doosra server lagao aur:

- Alice **server A** se judi, Bob **server B** se
- Alice message bhejti hai; server A apne room mein broadcast karta hai
- **Bob ko kabhi milta hi nahi** — wo server A par hai hi nahi

Aapke laptop par ek process mein sab perfect chalta hai, aur scale karte hi toot jata hai.

**Ilaaj: adapter.** Redis adapter ke saath har server apne emits Redis par publish karta hai aur doosron ko subscribe karta hai. Server A broadcast karta hai, Redis aage pahunchata hai, server B Bob ko de deta hai. Ye lagbhag do line ka kaam hai.

**Sticky sessions.** Socket.IO ka HTTP long-polling fallback handshake ke dauraan kai requests bhejta hai, aur un sabko *usi* server par pahunchna hota hai. Isliye load balancer par \`sticky: true\` chahiye — warna random handshake failures aate hain jo flaky network jaise dikhte hain. Pure-WebSocket transport ko iski zarurat nahi, par fallback ko hai.

**Scale par aur kya kaatta hai:**
- Har connection apni poori umar memory ghere rehti hai — aapki capacity request rate nahi, connection count se tay hoti hai
- Deploy karte hi **sabki** connection tootti hai aur sab ek saath reconnect karte hain; reconnection mein backoff aur jitter zaroori hai
- Presence ("kaun online hai") shared storage mein hona chahiye, ek server ki memory mein nahi`,
      codeExample: `import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pub = createClient({ url: process.env.REDIS_URL });
const sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);

// Now io.to(room).emit() reaches clients on EVERY server, not just this one.
io.adapter(createAdapter(pub, sub));`,
      commonMistakes: [
        'Scaling to two instances without an adapter — broadcasts silently reach only half your users.',
        'No sticky sessions, so the long-polling handshake fails intermittently.',
        'Keeping presence or room state in a local Map, which is wrong the moment there are two servers.',
        'Reconnect storms after a deploy because every client retries at the same instant.',
      ],
      interviewQuestions: [
        'What breaks when you run two WebSocket servers?',
        'What does the Redis adapter do?',
        'Why are sticky sessions needed?',
        'How do you track who is online across servers?',
      ],
      practiceQuestions: ['Run two Socket.IO instances behind a load balancer and prove broadcasts fail, then fix it with the Redis adapter.'],
      tags: ['websockets', 'socket.io', 'scaling', 'redis', 'system-design'],
    },
  ],
};
