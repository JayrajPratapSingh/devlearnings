/**
 * Node.js Complete Course — Module 6: Pro, lesson 3.
 *
 * WebSockets and Socket.io: why polling a REST endpoint every few seconds
 * for "new messages" is both wasteful (the server does real work on every
 * poll even when nothing changed) and never actually real-time (a message
 * can sit for up to the full poll interval before the recipient sees it).
 * Broken example: a chat feature polling GET /messages every 2 seconds from
 * every connected client, regardless of whether anyone sent anything.
 * Fixed with Socket.io: a single persistent connection per client, over
 * which the server pushes a new message the instant it happens, with no
 * polling at all — genuinely eliminating both the wasted load and the
 * delay.
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

export const NODE_MODULE_6_PART3: CourseLesson[] = [
  {
    slug: 'websockets-socketio',
    title: 'WebSockets: Why Polling Every Few Seconds Is Not Real-Time',
    titleHi: 'WebSockets: Har Kuch Second Mein Poll Karna Real-Time Kyun Nahi Hai',
    description: 'A chat app that asks the server "any new messages?" every 2 seconds, for every user, forever — even during the 3am hours when nobody is typing anything at all.',
    descriptionHi: 'Ek chat app jo server se "koi naya message?" har 2 second mein poochta hai, har user ke liye, hamesha — subah 3 baje bhi jab koi kuch type nahi kar raha hota.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Calling a friend on the phone every single minute to ask "do you have anything new to tell me?", forever, versus simply staying on one open phone line where they speak up the instant they actually have something to say.** Polling a server for new messages every few seconds is like a person who, wanting to stay updated on a friend\'s news, hangs up after every call and redials exactly sixty seconds later to ask the same question again — "anything new?" — receiving "no, nothing" the overwhelming majority of the time, and occasionally catching genuine news, but only whenever the next scheduled call happens to land after the news occurred, meaning a piece of exciting news shared the moment after a call ends sits completely undelivered for up to a full sixty seconds before the next call reaches it. Making and hanging up a phone call has a real cost each time — dialing, connecting, a few seconds of "hello, anything new? No? Okay, bye" — repeated relentlessly, all day, whether or not the friend ever actually has anything to report, which is wasteful specifically because the vast majority of those calls accomplish nothing at all. A person who instead simply stays on one continuously open phone line pays the cost of establishing the connection exactly once, and from that point on, their friend can speak up the INSTANT they have real news — with no artificial waiting for a next scheduled call, and no repeated redialing during the long stretches when there is nothing new to report at all.',
      hi: '**Ek dost ko phone par har akeli minute call karna ye poochne ke liye "tumhaare paas kuch naya batane ke liye hai?", hamesha ke liye, versus bas ek khuli phone line par rehna jahan wo bolte hain jis pal unke paas asal mein kuch kehne ke liye ho.** Naye messages ke liye ek server ko har kuch second mein poll karna ek aise insaan jaisa hai jo, ek dost ki khabar se updated rehna chahte hue, har call ke baad phone rakh deta hai aur bilkul saath sekend baad wahi sawaal poochne ke liye dobara dial karta hai — "kuch naya?" — zyaadatar waqt "nahi, kuch nahi" paate hue, aur kabhi-kabhi asli khabar pakadte hue, par sirf jab bhi agli scheduled call khabar hone ke baad pahunchti hai, matlab ek khushi ki khabar jo ek call khatam hone ke turant baad share hui poori tarah na-di gayi baithi rehti hai agli call use pahunchane tak poore saath sekend ke liye. Ek phone call karna aur rakh dena har baar ek asli keemat rakhta hai — dial karna, connect hona, "hello, kuch naya? Nahi? Achha, bye" ke kuch second — bina thake dohraaya jaata, poora din, chahe dost ke paas kabhi report karne ke liye kuch ho ya na ho, jo khaas taur par isliye faaltu hai kyunki un calls ka bahut bada hissa bilkul kuch haasil nahi karta. Ek insaan jo iske bajaye bas ek lagaataar khuli phone line par rehta hai connection sthaapit karne ki keemat bilkul ek baar chukaata hai, aur us pal se, unka dost jis pal unke paas asli khabar ho bol sakta hai — koi kritrim intezaar agli scheduled call ka bina, aur koi dohraaya redialing un lambe hisson ke dauraan jab report karne ke liye kuch naya hai hi nahi.',
    },

    simple: `**Start broken.** A chat feature that polls the server every two seconds, from every connected client, regardless of whether anything actually changed:

\`\`\`js
// Client: asks the server for new messages, every 2 seconds, forever
setInterval(async () => {
  const res = await fetch("/api/messages?since=" + lastMessageTimestamp);
  const newMessages = await res.json();
  newMessages.forEach(displayMessage);
}, 2000);
\`\`\`

\`\`\`js
// Server: an ordinary REST route, doing real work on every single poll
app.get("/api/messages", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE created_at > $1 ORDER BY created_at",
      [req.query.since]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Every single connected user\'s browser sends a real HTTP request to this route every two seconds, forever, for as long as the chat page remains open — with 500 users chatting, that is 250 real requests PER SECOND hitting this route, each one requiring a full HTTP request/response cycle and a genuine database query, even during the overwhelming majority of polls where absolutely nothing new has happened since the last check. This is wasteful specifically because the server does real, non-trivial work (a network round trip, a database query) on every single poll, whether or not there is actually anything to report — at 3am, with nobody typing anything at all, this exact same load continues indefinitely, for no benefit whatsoever. Just as importantly, this is never genuinely real-time: if a message is sent one second after a given client\'s last poll, that client does not see it until its NEXT scheduled poll, up to a full two seconds later — a real, structural delay baked directly into how often the client happens to ask, not into how quickly the server could actually deliver the message if it were able to push it immediately.

**The fix: Socket.io, a single persistent connection the server can push through instantly**

\`\`\`js
// Server
const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-message", async (text) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]); // pushed to every connected client, instantly
  });
});
\`\`\`

\`\`\`js
// Client: no polling at all — the server pushes new messages the instant they happen
const socket = io();
socket.on("new-message", displayMessage);

function sendMessage(text) {
  socket.emit("send-message", text);
}
\`\`\`

\`\`\`ts
// Server
import { Server } from "socket.io";
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-message", async (text: string) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]);
  });
});
\`\`\`

\`\`\`ts
// Client
import { io } from "socket.io-client";
const socket = io();
socket.on("new-message", displayMessage);

function sendMessage(text: string): void {
  socket.emit("send-message", text);
}
\`\`\`

A WebSocket connection (which Socket.io builds on and manages) is established ONCE per client, as a genuinely persistent, open connection between that client\'s browser and the server — unlike an ordinary HTTP request, this connection stays open indefinitely, allowing either side to send data to the other AT ANY TIME, with no need to open a new connection for each piece of data. The moment a new message is inserted into the database, the server calls \`io.emit()\` once, and Socket.io immediately pushes that exact message to every currently connected client over their already-open connections — no client needs to ask, no client needs to wait for a next scheduled check, and the server performs real work (a database query) only when a message actually needs to be sent, not on a fixed, wasteful schedule regardless of activity. This is the actual fix on both fronts at once: the server\'s workload now scales with how many messages are ACTUALLY sent, rather than with how many clients are connected multiplied by how often they poll, and delivery genuinely happens the instant a message exists, with no artificial delay baked into a polling interval.`,

    simpleHi: `**Toote hue se shuru.** Ek chat feature jo server ko har do second mein poll karta hai, har connected client se, chahe asal mein kuch bhi na badla ho:

\`\`\`js
// Client: server se naye messages maangta hai, har 2 second mein, hamesha
setInterval(async () => {
  const res = await fetch("/api/messages?since=" + lastMessageTimestamp);
  const newMessages = await res.json();
  newMessages.forEach(displayMessage);
}, 2000);
\`\`\`

\`\`\`js
// Server: ek aam REST route, har akeli poll par asli kaam karta hua
app.get("/api/messages", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE created_at > $1 ORDER BY created_at",
      [req.query.since]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Har akele connected user ka browser is route ko ek asli HTTP request bhejta hai har do second mein, hamesha, jab tak chat page khula rehta hai — 500 users chat karte hue, ye is route ko hit karti prati SECOND 250 asli requests hain, har ek ko ek poora HTTP request/response cycle aur ek asli database query chahiye, chahe zyaadatar polls mein bilkul kuch naya na hua ho pichhle check ke baad se. Ye khaas taur par isliye faaltu hai kyunki server har akeli poll par asli, maayne-rakhta kaam karta hai (ek network round trip, ek database query), chahe report karne ke liye asal mein kuch ho ya na ho — subah 3 baje, jab koi kuch type nahi kar raha, bilkul yehi load hamesha jaari rehta hai, kisi bhi faayde ke bina. Utna hi zaruri, ye kabhi sach mein real-time nahi hai: agar ek message ek khaas client ki aakhri poll ke ek second baad bheja jaata hai, wo client use tab tak nahi dekhta jab tak uski AGLI scheduled poll na aaye, poore do second baad tak — ek asli, sanrachnaatmak deri jo seedha isme baked hai ki client kitni baar poochta hai, isme nahi ki server asal mein kitni jaldi message deliver kar sakta agar wo use turant push kar paata.

**Fix: Socket.io, ek akela persistent connection jise server turant push kar sake**

\`\`\`js
// Server
const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-message", async (text) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]); // har connected client ko turant push hua
  });
});
\`\`\`

\`\`\`js
// Client: bilkul koi polling nahi — server naye messages hote hi turant push karta hai
const socket = io();
socket.on("new-message", displayMessage);

function sendMessage(text) {
  socket.emit("send-message", text);
}
\`\`\`

\`\`\`ts
// Server
import { Server } from "socket.io";
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-message", async (text: string) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]);
  });
});
\`\`\`

\`\`\`ts
// Client
import { io } from "socket.io-client";
const socket = io();
socket.on("new-message", displayMessage);

function sendMessage(text: string): void {
  socket.emit("send-message", text);
}
\`\`\`

Ek WebSocket connection (jise Socket.io ke oopar banaata aur sambhaalta hai) prati client EK BAAR sthaapit hota hai, us client ke browser aur server ke beech ek sach mein persistent, khula connection ki tarah — ek aam HTTP request ke ulta, ye connection hamesha ke liye khula rehta hai, kisi bhi taraf ko doosre ko KISI BHI WAQT data bhejne dete hue, har data ke tukde ke liye ek nayi connection kholne ki zarurat bina. Jis pal ek naya message database mein daala jaata hai, server \`io.emit()\` ek baar bulaata hai, aur Socket.io turant wo bilkul message har abhi connected client ko unki pehle-se-khuli connections ke through push karta hai — kisi client ko poochhna nahi padta, kisi client ko agle scheduled check ka intezaar nahi karna padta, aur server asli kaam (ek database query) sirf tab karta hai jab ek message asal mein bhejni ho, ek fixed, faaltu schedule par nahi chahe activity kuch bhi ho. Yehi asli fix hai dono mor par ek saath: server ka workload ab is baat se scale hota hai ki asal mein kitne messages BHEJE gaye, ye baat se nahi ki kitne clients connected hain kitni baar wo poll karte hain se guna karke, aur delivery sach mein us pal hoti hai jab ek message maujood hota hai, koi kritrim deri ek polling interval mein baked hue bina.`,

    content: `## WebSockets are bidirectional: either side can send, at any time

\`\`\`js
// The SERVER can push data to a client with no request from that client at all
io.to(socket.id).emit("notification", { text: "You have a new follower" });

// The CLIENT can also send data at any time, without a traditional request/response
socket.emit("typing", { userId: currentUser.id });
\`\`\`

An ordinary HTTP request/response cycle (covered from the very first Express lesson in this course onward) is fundamentally one-directional per exchange: a client sends a request, and the server sends back exactly one response, after which that particular exchange is over. A WebSocket connection is genuinely bidirectional and persistent — once established, either side can send a message to the other at any moment, without waiting to be asked, and the connection itself remains open for the entire duration a client stays connected (typically as long as a browser tab remains open). This is precisely why WebSockets suit scenarios where the SERVER itself needs to initiate sending data (a chat message from another user, a live notification, a stock price update) rather than only ever responding to something the client explicitly asked for.

## When WebSockets are the right tool, and when ordinary REST remains correct

\`\`\`
Ordinary REST (this course's earlier lessons): a client explicitly asks,
the server responds once — correct for the vast majority of typical
requests (fetching a profile, submitting a form, loading a list of posts).

WebSockets (this lesson): the server needs to push data the client did not
just ask for, the instant it becomes available — chat, live notifications,
collaborative editing, live dashboards, multiplayer game state.
\`\`\`

It would be a mistake to conclude from this lesson that WebSockets are simply a universal upgrade over REST — the vast majority of ordinary requests (a user viewing their profile, submitting a signup form, loading a paginated list of posts, covered throughout this course) are a genuinely correct fit for the traditional request/response model this entire course has built on, since the client is the one initiating the need for data at a specific moment. WebSockets earn their added complexity specifically in scenarios where data needs to reach a client without that client asking first, and where that data\'s timing genuinely matters (a chat message arriving seconds late is a real, noticeable problem; a user\'s own profile page loading half a second slower rarely is) — reaching for a persistent WebSocket connection for an ordinary CRUD-style feature adds real complexity (connection management, a different mental model for request/response) for no actual benefit over the REST patterns this course has already covered.

## Socket.io vs. the raw WebSocket API: what Socket.io adds

\`\`\`js
// The raw browser/Node WebSocket API — no automatic reconnection, no event names, no rooms
const ws = new WebSocket("ws://localhost:3000");
ws.send(JSON.stringify({ type: "message", text: "hello" }));

// Socket.io — automatic reconnection, named events, and built-in "rooms"
socket.emit("send-message", "hello");
socket.join("room-42"); // broadcast only to clients in this specific room
\`\`\`

Node.js and browsers both provide a lower-level, raw WebSocket API directly, and Socket.io is a library built on top of it (falling back to older techniques automatically for environments that cannot use WebSockets directly) that adds several genuinely practical conveniences: automatic reconnection if a client\'s connection drops and comes back, named events (\`"send-message"\`, \`"new-message"\`) rather than manually parsing and routing raw string or binary data, and a built-in concept of "rooms" — letting the server broadcast a message only to a specific subset of connected clients (everyone in one specific chat channel, for instance) rather than every single connected client indiscriminately. This is why Socket.io, rather than the raw WebSocket API directly, is the far more common choice for real applications, in the same way Express is commonly chosen over Node\'s raw \`http\` module for typical REST APIs.

## Scaling WebSockets across multiple clustered processes: a real, non-obvious complication

\`\`\`js
// A message received by worker 3 must still reach a client connected to worker 5 —
// this requires a shared adapter (commonly Redis-backed) so io.emit() broadcasts
// across ALL cluster workers, not just the one that received the triggering event.
const { createAdapter } = require("@socket.io/redis-adapter");
io.adapter(createAdapter(pubClient, subClient));
\`\`\`

Combining this lesson\'s WebSockets with the previous lesson\'s clustering introduces a genuine complication worth knowing about even at an introductory level: if an application runs as multiple separate cluster worker processes, a client\'s WebSocket connection is held by whichever ONE specific worker process it happened to connect to — a message received and processed by worker 3 does not automatically reach a client connected to worker 5\'s socket, since (following this course\'s clustering lesson) separate worker processes do not share memory or connections. Production Socket.io deployments running across multiple clustered processes commonly use a shared adapter (frequently backed by Redis, the same tool this course has used elsewhere for shared state) specifically so that an \`io.emit()\` call on any one worker correctly reaches clients connected to every other worker as well.`,

    contentHi: `## WebSockets bidirectional hain: koi bhi taraf kisi bhi waqt bhej sakti hai

\`\`\`js
// SERVER ek client ko data push kar sakta hai bilkul us client se koi request bina
io.to(socket.id).emit("notification", { text: "You have a new follower" });

// CLIENT bhi kisi bhi waqt data bhej sakta hai, ek traditional request/response ke bina
socket.emit("typing", { userId: currentUser.id });
\`\`\`

Ek aam HTTP request/response cycle (is course ke bilkul pehle Express lesson se aage cover hua) buniyaadi taur par har exchange ke liye ek-taraf hai: ek client ek request bhejta hai, aur server bilkul ek jawaab wapas bhejta hai, jiske baad wo khaas exchange khatam ho jaata hai. Ek WebSocket connection sach mein bidirectional aur persistent hai — ek baar sthaapit hone ke baad, koi bhi taraf doosre ko kisi bhi pal ek message bhej sakta hai, poochhe jaane ka intezaar kiye bina, aur connection khud poore waqt khula rehta hai jab tak ek client connected rehta hai (aam taur par jab tak browser tab khula rehta hai). Bilkul isi wajah se WebSockets un scenarios ke liye theek baithte hain jahan SERVER khud ko data bhejna shuru karna hai (ek doosre user se ek chat message, ek live notification, ek stock price update) sirf kisi cheez ka jawaab dene ke bajaye jo client ne explicitly maangi ho.

## WebSockets sahi tool kab hain, aur aam REST kab sahi rehta hai

\`\`\`
Aam REST (is course ke pehle lessons): ek client explicitly poochta hai,
server ek baar jawaab deta hai — zyaadatar aam requests ke liye sahi
(ek profile fetch karna, ek form submit karna, posts ki ek list load karna).

WebSockets (ye lesson): server ko wo data push karna hai jo client ne
bas nahi maanga, jis pal wo upalabdh hota hai — chat, live notifications,
collaborative editing, live dashboards, multiplayer game state.
\`\`\`

Is lesson se ye nateeja nikaalna galti hogi ki WebSockets bas REST se ek saarvavyaapi upgrade hain — zyaadatar aam requests (ek user apni profile dekh raha, ek signup form submit kar raha, posts ki ek paginated list load kar raha, is poore course mein cover hui) traditional request/response model ke liye ek sach mein sahi fit hain jis par ye poora course bana hai, kyunki client hi wo hai jo ek khaas pal par data ki zarurat shuru karta hai. WebSockets apni jodi hui complexity khaas taur par un scenarios mein kamaate hain jahan data ko ek client tak pahunchna chahiye us client ke pehle poochhe bina, aur jahan us data ka timing sach mein maayne rakhta hai (ek chat message seconds late aana ek asli, noticeable samasya hai; ek user ka apna profile page aadhe second dheeme load hona shaayad hi kabhi hota hai) — ek aam CRUD-style feature ke liye ek persistent WebSocket connection ki taraf pahunchna asli complexity jodta hai (connection management, request/response ke liye ek alag mental model) is course ne pehle se cover kiye REST patterns se koi asli faayde ke bina.

## Socket.io vs. raw WebSocket API: Socket.io kya jodta hai

\`\`\`js
// Raw browser/Node WebSocket API — koi apne aap reconnection nahi, koi event names nahi, koi rooms nahi
const ws = new WebSocket("ws://localhost:3000");
ws.send(JSON.stringify({ type: "message", text: "hello" }));

// Socket.io — apne aap reconnection, naam-liye events, aur built-in "rooms"
socket.emit("send-message", "hello");
socket.join("room-42"); // sirf is khaas room ke clients ko broadcast
\`\`\`

Node.js aur browsers dono seedha ek nichli-star, raw WebSocket API dete hain, aur Socket.io iske oopar bani ek library hai (un environments ke liye apne aap purane tarikon par wapas jaate hue jo seedha WebSockets istemal nahi kar sakte) jo kai sach mein practical suvidhaayen jodti hai: agar ek client ki connection toot jaaye aur wapas aaye to apne aap reconnection, naam-liye events (\`"send-message"\`, \`"new-message"\`) haath se raw string ya binary data parse aur route karne ke bajaye, aur "rooms" ka ek built-in concept — server ko ek message sirf connected clients ke ek khaas hisse ko broadcast karne dete hue (ek khaas chat channel mein sabko, misal ke taur par) har akele connected client ko andhaadhundh nahi. Bilkul isi wajah se Socket.io, raw WebSocket API seedha ke bajaye, asli applications ke liye kaafi zyaada aam choice hai, usi tarike se jaise Express aam CRUD-style REST APIs ke liye Node ke raw \`http\` module se zyaada aam taur par chuna jaata hai.

## Kai clustered processes ke aar-paar WebSockets scale karna: ek asli, na-saaf complication

\`\`\`js
// Worker 3 dwara paaya gaya ek message abhi bhi worker 5 se judi ek client tak pahunchna chahiye —
// isko ek shared adapter chahiye (aam taur par Redis-backed) taaki io.emit() SAB
// cluster workers ke aar-paar broadcast kare, sirf us ek ke bajaye jisne trigger karta event paaya.
const { createAdapter } = require("@socket.io/redis-adapter");
io.adapter(createAdapter(pubClient, subClient));
\`\`\`

Is lesson ke WebSockets ko pichhle lesson ke clustering ke saath jodna ek asli complication introduce karta hai jise ek shuruaati star par bhi jaanna kaam ka hai: agar ek application kai alag cluster worker processes ki tarah chalta hai, ek client ka WebSocket connection us EK khaas worker process ke paas hota hai jise wo samyog se juda tha — worker 3 dwara paaya aur process kiya gaya ek message worker 5 ke socket se judi ek client tak apne aap nahi pahunchta, kyunki (is course ke clustering lesson ka palan karte hue) alag worker processes memory ya connections share nahi karte. Kai clustered processes ke aar-paar chalte production Socket.io deployments aam taur par ek shared adapter istemal karte hain (aksar Redis-backed, wahi tool jo is course ne kahin aur shared state ke liye istemal kiya) khaas taur par isliye taaki kisi bhi ek worker par ek \`io.emit()\` call sahi tarike se har doosre worker se judi clients tak bhi pahunche.`,

    examples: [
      {
        title: 'Broken: every client polls every 2 seconds, regardless of activity',
        titleHi: 'Toota: har client har 2 second mein poll karta hai, activity se bekhabar',
        code: `setInterval(async () => {
  const res = await fetch("/api/messages?since=" + lastMessageTimestamp);
  const newMessages = await res.json();
  newMessages.forEach(displayMessage);
}, 2000);
// with 500 connected users, this is 250 real HTTP requests PER SECOND`,
        codeJs: `// Client
setInterval(async () => {
  const res = await fetch("/api/messages?since=" + lastMessageTimestamp);
  const newMessages = await res.json();
  newMessages.forEach(displayMessage);
}, 2000);

// Server
app.get("/api/messages", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE created_at > $1 ORDER BY created_at",
      [req.query.since]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `// Client
setInterval(async () => {
  const res = await fetch("/api/messages?since=" + lastMessageTimestamp);
  const newMessages: Message[] = await res.json();
  newMessages.forEach(displayMessage);
}, 2000);

// Server
app.get("/api/messages", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE created_at > $1 ORDER BY created_at",
      [req.query.since]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the problem is entirely
// about workload and delay, not a type or logic error.`,
        output: `500 concurrent users produce 250 real requests per second to this
route, continuously, even during long stretches with no new messages
at all. A message sent one second after a client's last poll is not
seen by that client for up to another full second.`,
        explain: 'The server performs real, non-trivial work (a database query) on every single poll regardless of whether anything actually happened — the load is driven by how many clients are polling, not by how much real activity exists.',
        explainHi: 'Server har akeli poll par asli, maayne-rakhta kaam karta hai (ek database query) chahe asal mein kuch bhi hua ho ya nahi — load is baat se chalta hai ki kitne clients poll kar rahe hain, itni asli activity maujood hai us se nahi.',
      },
      {
        title: 'Fixed: Socket.io pushes new messages instantly, with no polling at all',
        titleHi: 'Theek: Socket.io naye messages turant push karta hai, bilkul koi polling nahi',
        code: `io.on("connection", (socket) => {
  socket.on("send-message", async (text) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]);
  });
});`,
        codeJs: `// Server
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-message", async (text) => {
    const result = await pool.query(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]);
  });
});

httpServer.listen(3000);

// Client
const socket = io();
socket.on("new-message", displayMessage);
function sendMessage(text) {
  socket.emit("send-message", text);
}`,
        codeTs: `// Server
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

interface MessageRow {
  id: number;
  text: string;
  created_at: Date;
}

io.on("connection", (socket) => {
  socket.on("send-message", async (text: string) => {
    const result = await pool.query<MessageRow>(
      "INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *",
      [text]
    );
    io.emit("new-message", result.rows[0]);
  });
});

httpServer.listen(3000);

// Client
import { io } from "socket.io-client";
const socket = io();
socket.on("new-message", displayMessage);
function sendMessage(text: string): void {
  socket.emit("send-message", text);
}`,
        outputJs: `With 500 connected users and no messages being sent, the server does
essentially no work at all for this feature — no polling requests, no
repeated queries. The instant someone sends a message, every other
connected client receives it immediately, with no delay.`,
        outputTs: `// Identical behaviour. MessageRow documents the exact shape of the
// inserted row, consistent with the typing pattern established in this
// course's database lessons.`,
        explain: 'The server\'s workload now scales with how many messages are actually sent, not with how many clients happen to be connected multiplied by a fixed polling frequency.',
        explainHi: 'Server ka workload ab is baat se scale hota hai ki asal mein kitne messages bheje gaye, isse nahi ki kitne clients connected hain ek fixed polling frequency se guna karke.',
      },
      {
        title: 'Wrong reflex: reaching for WebSockets for an ordinary REST-shaped feature',
        titleHi: 'Galat jhatka: ek aam REST-shape wale feature ke liye WebSockets ki taraf jaana',
        code: `// Unnecessary — a user's own profile page has no need to be "pushed"
socket.emit("get-profile", userId);
socket.on("profile-data", displayProfile);`,
        codeJs: `// Unnecessary complexity for a simple, client-initiated request
socket.emit("get-profile", userId);
socket.on("profile-data", displayProfile);

// Correct — an ordinary REST request is a genuinely better fit here
const res = await fetch(\`/api/users/\${userId}\`);
const profile = await res.json();
displayProfile(profile);`,
        codeTs: `// Unnecessary complexity for a simple, client-initiated request
socket.emit("get-profile", userId);
socket.on("profile-data", displayProfile);

// Correct — an ordinary REST request is a genuinely better fit here
const res = await fetch(\`/api/users/\${userId}\`);
const profile: Profile = await res.json();
displayProfile(profile);`,
        outputJs: `Both versions eventually display the same profile, but the WebSocket
version adds real complexity (connection setup, event naming, a
different mental model) for a request the client itself initiated at a
known moment — exactly what ordinary REST already handles well.`,
        outputTs: `// Identical behaviour. There is no server-initiated push happening
// here at all — the client asked, once, for a specific piece of data,
// which is precisely what a normal HTTP request/response is for.`,
        explain: 'WebSockets earn their complexity specifically when the server needs to push data the client did not just ask for — an ordinary, client-initiated request has no such need and is better served by REST.',
        explainHi: 'WebSockets apni complexity khaas taur par tab kamaate hain jab server ko wo data push karna hai jo client ne bas nahi maanga — ek aam, client-shuru-ki request ko aisi zarurat nahi hai aur ise REST behtar sambhaalta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `setInterval(() => fetch("/api/messages?since=" + last), 2000);
// every client polls on a fixed schedule, regardless of actual activity`,
        right: `socket.on("new-message", displayMessage);
// the server pushes exactly when a message actually exists`,
        why: 'Polling makes server load scale with (number of clients × poll frequency) regardless of real activity, and bakes in a structural delay of up to one full poll interval — pushing eliminates both.',
        whyHi: 'Polling server load ko (clients ki tadaad × poll frequency) ke hisaab se scale karta hai chahe asli activity kuch bhi ho, aur ek poore poll interval tak ki sanrachnaatmak deri baked karta hai — pushing dono khatam karta hai.',
      },
      {
        wrong: `socket.emit("get-profile", userId);
socket.on("profile-data", displayProfile);
// using a persistent connection for a simple, client-initiated one-time request`,
        right: `const res = await fetch(\`/api/users/\${userId}\`);
const profile = await res.json();
// ordinary REST, which this exact scenario is already well suited to`,
        why: 'WebSockets add real complexity (connection management, event-based flow) specifically to enable server-initiated pushes — an ordinary client-initiated request gains nothing from this and is better served by REST.',
        whyHi: 'WebSockets asli complexity jodte hain (connection management, event-based flow) khaas taur par server-shuru-ki pushes ko mumkin banaane ke liye — ek aam client-shuru-ki request ise kuch nahi paati aur ise REST behtar sambhaalta hai.',
      },
      {
        wrong: `io.emit("new-message", message); // on one cluster worker only
// a client connected to a different worker never receives this event`,
        right: `io.adapter(createAdapter(pubClient, subClient)); // a shared Redis-backed adapter
io.emit("new-message", message); // now reaches clients on every worker`,
        why: 'Across multiple clustered processes, a client\'s connection is held by only one specific worker — without a shared adapter, an emit on one worker never reaches clients connected to a different one.',
        whyHi: 'Kai clustered processes ke aar-paar, ek client ki connection sirf ek khaas worker ke paas hoti hai — ek shared adapter ke bina, ek worker par ek emit kabhi ek alag worker se judi clients tak nahi pahunchta.',
      },
    ],

    realWorld: [
      {
        en: '**Socket.io is one of the most widely used real-time libraries in the entire Node.js ecosystem**, and essentially every major chat application, live collaboration tool, and live-notification feature in production software relies on WebSockets or an equivalent persistent-connection technology, not polling.',
        hi: '**Socket.io poore Node.js ecosystem mein sabse vyapak taur par istemal hone waali real-time libraries mein se ek hai**, aur lagbhag har mukhya chat application, live collaboration tool, aur live-notification feature production software mein WebSockets ya ek barabar persistent-connection technology par bharosa karta hai, polling par nahi.',
      },
      {
        en: '**Polling a server on a fixed interval is a well-documented anti-pattern specifically flagged in production performance and scalability guidance** once an application reaches meaningful concurrent user counts — this lesson\'s broken example is a textbook case of a pattern that works fine at small scale and becomes a genuine load problem as usage grows.',
        hi: '**Ek fixed interval par ek server ko poll karna ek achhi tarah documented anti-pattern hai jo khaas taur par production performance aur scalability guidance mein flag hoti hai** ek baar application maayne-rakhta concurrent user counts tak pahunchti hai — is lesson ka toota example ek classic case hai ek pattern ka jo chhote scale par theek kaam karta hai aur usage badhte hi ek asli load samasya ban jaata hai.',
      },
      {
        en: '**Real-time collaborative tools (shared document editing, live cursors, multiplayer games, live dashboards showing constantly updating data) are among the most commonly cited real-world use cases specifically requiring WebSockets rather than ordinary request/response**, precisely because the server needs to push updates the client never explicitly asked for.',
        hi: '**Real-time collaborative tools (shared document editing, live cursors, multiplayer games, hamesha update hoti data dikhaate live dashboards) un sabse aam cite hone waale real-world use cases mein se hain jinhe khaas taur par WebSockets chahiye aam request/response ke bajaye**, theek isliye kyunki server ko wo updates push karne chahiye jo client ne kabhi explicitly maange hi nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is polling a server every few seconds for new data fundamentally never truly "real-time," even if the poll interval is made very short?',
        qHi: 'Naye data ke liye har kuch second mein ek server ko poll karna buniyaadi taur par kabhi sach mein "real-time" kyun nahi hai, chahe poll interval bahut chhota banaaya jaaye?',
        a: 'Polling works by the client repeatedly asking, on a fixed schedule, "has anything changed since I last checked?" — this means any new data that becomes available strictly BETWEEN two scheduled polls sits completely undelivered until the next poll happens to occur, no matter how quickly the server itself could have delivered it if it had a way to push data proactively. The delay a specific piece of data experiences is therefore bounded by the poll interval itself, not by how fast the underlying system could actually move — a message created one millisecond after a poll just completed still waits for the ENTIRE next interval to elapse before the next poll has a chance to discover it. Shortening the poll interval reduces the maximum possible delay, but it does so by making the client ask more often, which directly increases server load proportionally — this is a real trade-off, not a solution, since the two goals (lower delay, lower load) pull in opposite directions as long as data delivery remains dependent on the client asking at fixed intervals rather than the server being able to push data the instant it becomes available. True real-time delivery requires eliminating this asking-on-a-schedule model entirely, which is precisely what a persistent, bidirectional connection like a WebSocket enables — the server can push data the exact instant it exists, with no dependency on when a next poll happens to be scheduled.',
        aHi: 'Polling is tarike se kaam karta hai ki client baar-baar, ek fixed schedule par, poochta hai "kya kuch badla hai jab se maine aakhri baar check kiya?" — iska matlab hai koi bhi naya data jo bilkul do scheduled polls ke BEECH upalabdh hota hai poori tarah na-di gayi baitha rehta hai jab tak agli poll na ho, chahe server khud kitni bhi jaldi use deliver kar sakta agar uske paas data proactively push karne ka koi tarika hota. Ek khaas data ka anubhav kiya deri isliye poll interval se hi bandhi hai, underlying system asal mein kitni tez chal sakta hai us se nahi — ek message jo ek poll poora hone ke ek millisecond baad banaaya jaata hai abhi bhi POORE agle interval ke guzarne ka intezaar karta hai us se pehle ki agli poll use dhoondhne ka mauka paaye. Poll interval ko chhota karna zyaada-se-zyaada mumkin deri ko kam karta hai, par ye client se zyaada baar poochva kar karta hai, jo seedha server load ko anupaat mein badhaata hai — ye ek asli trade-off hai, koi solution nahi, kyunki do lakshya (kam deri, kam load) alag disha mein khinchte hain jab tak data delivery client ke fixed intervals mein poochne par nirbhar rehta hai server ke data upalabdh hote hi push kar sakne ke bajaye. Asli real-time delivery ke liye is poochne-ek-schedule-par model ko poori tarah khatam karna zaruri hai, jo bilkul wahi hai jo ek WebSocket jaisa ek persistent, bidirectional connection mumkin banaata hai — server data ko bilkul us pal push kar sakta hai jab wo maujood hota hai, agli poll kab scheduled hai us par koi nirbharta bina.',
      },
      {
        q: 'Why does a WebSocket-based approach reduce server load compared to polling, given that both approaches eventually need to deliver the same messages to the same clients?',
        qHi: 'Ek WebSocket-based tarika polling ke muqable server load kyun kam karta hai, jab ki dono tarikon ko aakhirkaar wahi messages wahi clients tak pahunchane chahiye?',
        a: 'With polling, the server does real, non-trivial work (handling a full HTTP request, typically querying a database) once per scheduled poll, for every single connected client, regardless of whether there is actually anything new for that specific client. This means the total server workload scales with the product of (number of connected clients) and (how frequently each one polls) — a quantity that keeps growing even during long stretches where no new messages exist at all, since every client keeps asking on schedule regardless. With a WebSocket-based push approach, the server does not perform any repeated "checking" work at all — a connected client simply holds an open connection, consuming comparatively minimal ongoing resources, and the server performs actual work (querying or processing something, then sending data) only at the specific moment a real event occurs that needs to be delivered, such as a message actually being sent. This means the total server workload scales with how much genuine activity is actually happening, not with how many clients happen to be connected multiplied by an arbitrary polling frequency — during quiet periods with little real activity, a WebSocket-based system does dramatically less work than a polling-based one serving the same number of connected clients, precisely because it is not repeatedly asking "did anything happen?" on a fixed schedule regardless of the actual answer.',
        aHi: 'Polling ke saath, server asli, maayne-rakhta kaam karta hai (ek poora HTTP request sambhaalte hue, aam taur par ek database query karte hue) ek baar prati scheduled poll, har akele connected client ke liye, chahe us khaas client ke liye asal mein kuch naya ho ya na ho. Iska matlab hai kul server workload (connected clients ki tadaad) aur (har ek kitni baar poll karta hai) ke guna se scale hota hai — ek maatra jo lambe hisson ke dauraan bhi badhti rehti hai jab bilkul koi naya message maujood hi nahi, kyunki har client schedule ke hisaab se poochta rehta hai chahe kuch bhi ho. Ek WebSocket-based push tarike ke saath, server bilkul koi dohraaya "check karna" wala kaam nahi karta — ek connected client bas ek khuli connection rakhta hai, taulnaatmak taur par kam chalti resources istemal karte hue, aur server asli kaam (kuch query ya process karna, phir data bhejna) sirf us khaas pal karta hai jab ek asli event hota hai jise deliver karna chahiye, jaise ek message asal mein bheji jaana. Iska matlab hai kul server workload is baat se scale hota hai ki asal mein kitni asli activity ho rahi hai, isse nahi ki kitne clients connected hain ek manmaani polling frequency se guna karke — shaant periods ke dauraan thodi asli activity ke saath, ek WebSocket-based system utne hi connected clients serve karte hue ek polling-based system se bahut kam kaam karta hai, theek isliye kyunki ye baar-baar "kuch hua kya?" nahi poochta ek fixed schedule par asli jawaab kuch bhi ho.',
      },
      {
        q: 'Why does combining WebSockets with clustering (running multiple Node.js processes) introduce a complication that a single-process application does not have?',
        qHi: 'WebSockets ko clustering ke saath jodna (kai Node.js processes chalaana) ek aisi complication kyun laata hai jo ek akele-process wale application mein nahi hai?',
        a: 'A client establishing a WebSocket connection connects to exactly one specific server process at the moment the connection is made, and that connection is held open by that one particular process for as long as the client stays connected — following this course\'s clustering lesson, each worker process is a genuinely separate operating-system process with its own separate memory, meaning a connection object living inside worker 3\'s memory is completely invisible to and unreachable from worker 5. If an event occurs that needs to be broadcast to every connected client (a new chat message that should reach everyone in a channel, for instance) and that event happens to be handled or triggered by code running on worker 3, a plain io.emit() call on worker 3 only has direct knowledge of, and can only directly push to, the specific client connections that ARE currently held by worker 3 itself — clients whose WebSocket connections happen to be held by any of the other worker processes (4, 5, and so on) are entirely unreachable from worker 3\'s own emit call, since there is no shared memory linking the workers\' individual sets of open connections together. Solving this requires an explicit, shared coordination mechanism external to any single worker\'s own memory — commonly a Redis-backed adapter — that all workers publish to and subscribe from, ensuring an emit issued on any one worker is correctly relayed to and delivered by whichever other worker actually holds each intended recipient\'s connection.',
        aHi: 'Ek client jo ek WebSocket connection sthaapit karta hai bilkul us pal ek khaas server process se judta hai jab connection banti hai, aur wo connection us ek khaas process dwara khuli rakhi jaati hai jab tak client connected rehta hai — is course ke clustering lesson ka palan karte hue, har worker process apni alag memory wali ek sach mein alag operating-system process hai, matlab worker 3 ki memory ke andar rehta ek connection object worker 5 se poori tarah adrishya aur na-pahunch-hone-laayak hai. Agar ek event hota hai jise har connected client ko broadcast karna chahiye (ek naya chat message jo ek channel mein sabko pahunchna chahiye, misal ke taur par) aur wo event samyog se worker 3 par chalte code dwara handle ya trigger hota hai, worker 3 par ek saadha \`io.emit()\` call sirf un khaas client connections ka seedha gyaan rakhta hai, aur sirf unhi ko seedha push kar sakta hai, jo abhi worker 3 khud ke paas hain — un clients jinke WebSocket connections samyog se kisi doosri worker process (4, 5, aur waise hi) ke paas hain worker 3 ki apni \`emit\` call se poori tarah na-pahunch-hone-laayak hain, kyunki koi shared memory workers ke akele khule connections ke sets ko saath nahi jodti. Ise solve karne ke liye ek explicit, shared coordination mechanism chahiye kisi bhi akele worker ki apni memory se bahar — aam taur par ek Redis-backed adapter — jise sab workers publish aur subscribe karte hain, ye sunishchit karte hue ki kisi bhi ek worker par jaari ek \`emit\` sahi tarike se us doosre worker tak relay aur deliver hoti hai jo asal mein har iraade kiye receiver ki connection rakhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken polling-based chat feature. Using browser dev tools\' network tab, confirm a request to /api/messages fires every 2 seconds, indefinitely, even with no new messages ever sent.',
        taskHi: 'Toota polling-based chat feature banao. Browser dev tools ke network tab ka istemal karke, confirm karo \`/api/messages\` ko ek request har 2 second mein aati hai, hamesha, chahe koi naya message kabhi na bheja gaya ho.',
        hint: 'Leave the page open and idle for a full minute without sending anything, and count exactly how many requests fired during that time versus how many messages were actually sent (zero).',
        hintHi: 'Page ko ek poore minute ke liye khula aur idle chhod do kuch bhi bheje bina, aur bilkul ginno us waqt mein kitni requests aayi versus asal mein kitne messages bheje gaye (zero).',
      },
      {
        task: 'Fix it with Socket.io. Confirm no requests fire while idle, and confirm a message sent from one browser tab appears in a second tab with no perceptible delay.',
        taskHi: 'Socket.io se theek karo. Confirm karo idle rehte koi requests nahi aatin, aur confirm karo ek browser tab se bheja gaya message ek doosre tab mein bina kisi mehsoos hone laayak deri ke dikhta hai.',
        hint: 'Open the browser\'s network tab and filter for the WebSocket connection specifically (usually labeled "WS") to directly observe the single persistent connection rather than repeated separate requests.',
        hintHi: 'Browser ka network tab kholo aur khaas taur par WebSocket connection ke liye filter karo (aam taur par "WS" labeled) seedha akele persistent connection ko dekhne ke liye, dohraayi alag requests ke bajaye.',
      },
      {
        task: 'Deliberately run the fixed version as two separate Node.js processes on two different ports (simulating clustering) with no shared adapter, and confirm a message sent by a client connected to one process does not reach a client connected to the other.',
        taskHi: 'Jaan-boojhkar theek version ko do alag Node.js processes ki tarah do alag ports par chalaao (clustering simulate karte hue) koi shared adapter bina, aur confirm karo ek process se judi client dwara bheja gaya message doosri process se judi client tak nahi pahunchta.',
        hint: 'This exercise is meant to make the clustering complication concrete and visible before reading about the fix — you do not need to implement the Redis adapter fix itself to complete it.',
        hintHi: 'Ye exercise fix ke baare mein padhne se pehle clustering complication ko thos aur dikhaayi-dene-laayak banaane ke liye hai — ise poora karne ke liye tumhe Redis adapter fix khud lagu karne ki zarurat nahi.',
      },
    ],

    keyTakeaways: [
      'Polling makes the server perform real work on a fixed schedule for every connected client regardless of actual activity, and bakes in a structural delay of up to one full poll interval before new data is seen.',
      'A WebSocket connection is a single, persistent, bidirectional connection per client — either side can send data at any time, with no need to open a new connection for each exchange.',
      'Socket.io pushes data the instant an event actually occurs (io.emit()), meaning server workload scales with real activity rather than with (number of clients × poll frequency).',
      'WebSockets are the right tool specifically when the server needs to push data the client did not just ask for (chat, live notifications, collaborative editing) — an ordinary client-initiated request is still better served by REST.',
      'Socket.io adds automatic reconnection, named events, and "rooms" on top of the raw WebSocket API, which is why it is the far more common choice for real applications over the raw API directly.',
      'Combining WebSockets with clustering requires a shared adapter (commonly Redis-backed) since a client\'s connection is held by only one specific worker process, and a plain emit on one worker cannot reach clients connected to another.',
    ],
    keyTakeawaysHi: [
      'Polling server ko ek fixed schedule par har connected client ke liye asli kaam karne majboor karta hai chahe asli activity kuch bhi ho, aur naya data dikhne se pehle ek poore poll interval tak ki sanrachnaatmak deri baked karta hai.',
      'Ek WebSocket connection prati client ek akela, persistent, bidirectional connection hai — koi bhi taraf kisi bhi waqt data bhej sakta hai, har exchange ke liye ek nayi connection kholne ki zarurat bina.',
      'Socket.io data ko us pal push karta hai jab ek event asal mein hota hai (\`io.emit()\`), matlab server workload asli activity se scale hota hai, (clients ki tadaad × poll frequency) se nahi.',
      'WebSockets sahi tool khaas taur par tab hain jab server ko wo data push karna hai jo client ne bas nahi maanga (chat, live notifications, collaborative editing) — ek aam client-shuru-ki request abhi bhi REST se behtar sambhaali jaati hai.',
      'Socket.io raw WebSocket API ke oopar apne aap reconnection, naam-liye events, aur "rooms" jodta hai, isi wajah se ye asli applications ke liye raw API seedha se kaafi zyaada aam choice hai.',
      'WebSockets ko clustering ke saath jodne ke liye ek shared adapter chahiye (aam taur par Redis-backed) kyunki ek client ki connection sirf ek khaas worker process ke paas hoti hai, aur ek worker par ek saadha \`emit\` ek doosre se judi clients tak nahi pahunch sakta.',
    ],
  },
];
