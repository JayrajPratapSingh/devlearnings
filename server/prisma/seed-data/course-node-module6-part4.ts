/**
 * Node.js Complete Course — Module 6: Pro, lesson 4.
 *
 * WebRTC: why routing live video/audio through the same server-relayed
 * model that correctly serves chat messages (the previous lesson's
 * WebSockets) becomes a severe bandwidth and latency problem the instant
 * media streaming is involved, and why WebRTC's actual design routes media
 * directly between browsers instead. Broken example: a video call feature
 * built by piping raw audio/video data through the Socket.io/WebSocket
 * server exactly like chat messages — every byte of every stream now
 * transits the server twice (upload + download) per call, multiplying
 * server bandwidth cost with each additional call and adding an extra
 * network hop of latency. Fixed with WebRTC: the server is used only for
 * lightweight "signaling" (exchanging connection metadata via the existing
 * Socket.io connection) to help two browsers find each other, after which
 * actual audio/video/data flows directly peer-to-peer, with STUN/TURN
 * covered as the NAT-traversal mechanism that makes a direct connection
 * possible (or, as a fallback, relayed) between two browsers on different
 * networks.
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

export const NODE_MODULE_6_PART4: CourseLesson[] = [
  {
    slug: 'webrtc-peer-to-peer',
    title: 'WebRTC: Why Video Calls Cannot Be Built Like Chat Messages',
    titleHi: 'WebRTC: Video Calls Chat Messages Jaisi Kyun Nahi Banaayi Jaa Saktin',
    description: 'A video call feature that routes every frame of audio and video through the same server that handles chat — and the server\'s bandwidth bill multiplies with every single call, while both callers hear each other with a noticeable extra delay.',
    descriptionHi: 'Ek video call feature jo audio aur video ke har frame ko usi server se guzaarta hai jo chat sambhaalta hai — aur server ka bandwidth bill har akeli call ke saath guna hota hai, jabki dono callers ek doosre ko ek noticeable extra deri ke saath sunte hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Two people standing in the same room, wanting to talk to each other, but required by house rules to speak only through a telephone operator sitting between them — every single word first travels to the operator, and only then gets relayed onward to the other person — versus simply being allowed to speak directly, face to face, once someone has pointed out where in the room the other person is standing.** Routing live audio and video through a central server, the same way chat messages are correctly routed through it, is like two people in the same room being forced to route every sentence through an operator sitting at a switchboard between them — the operator hears "hello, how are you," repeats it word for word to the second person, then hears that person\'s reply and repeats it back, and so on, for the entire conversation. This works, technically, but it means the operator personally handles literally every word of every conversation happening in the building at once, and every conversation is now slower and more strained than a normal one, because everything must detour through a third party who was never actually part of the conversation\'s content. A building manager who instead simply has a receptionist point two people toward each other once ("she\'s over by the window") and then lets them speak directly gets something categorically better for an actual conversation: the two people talk face to face, at full natural speed, and the receptionist\'s only remaining job — pointing people toward each other — takes a fraction of a second and does not need to be repeated for every single word exchanged afterward.',
      hi: '**Do log ek hi kamre mein khade hain, ek-doosre se baat karna chahte hain, par house rules ke hisaab se sirf ek telephone operator ke through baat karni chahiye jo unke beech baitha hai — har akela shabd pehle operator tak jaata hai, aur sirf tab doosre insaan tak aage relay hota hai — versus bas seedha, aamne-saamne baat karne diya jaana, ek baar kisi ne bata diya ki doosra insaan kamre mein kahan khada hai.** Live audio aur video ko ek kendriya server se guzaarna, bilkul usi tarike se jaise chat messages sahi tarike se usse guzarte hain, aise hai jaise ek hi kamre mein do log ek operator se guzaarne majboor hon jo unke beech ek switchboard par baitha hai — operator "hello, kaise ho" sunta hai, use shabd-dar-shabd doosre insaan ko dohraata hai, phir un insaan ka jawaab sunta hai aur use wapas dohraata hai, aur waise hi poori baatcheet ke liye. Ye technically kaam karta hai, par iska matlab hai operator personally building mein ek saath ho rahi har baatcheet ka literally har shabd sambhaalta hai, aur har baatcheet ab ek normal se dheemi aur zyaada tanaao-bhari hai, kyunki sab kuch ek teesre insaan ke through ghoomna chahiye jo asal mein kabhi baatcheet ki content ka hissa tha hi nahi. Ek building manager jo iske bajaye bas ek receptionist se do logon ko ek baar ek-doosre ki taraf ishara karwaata hai ("wo window ke paas hai") aur phir unhe seedha baat karne deta hai ek asli baatcheet ke liye kuch categorically behtar paata hai: do log aamne-saamne baat karte hain, poori swaabhavik raftaar par, aur receptionist ka baaki bacha akela kaam — logon ko ek-doosre ki taraf ishara karna — ek second ke hisse mein hota hai aur baad mein exchange hue har akele shabd ke liye dohraane ki zarurat nahi.',
    },

    simple: `**Start broken.** A video call feature built by treating audio/video exactly like the previous lesson\'s chat messages — every frame relayed through the same Socket.io server:

\`\`\`js
// Client A: sends every captured audio/video chunk through the existing Socket.io connection
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
const recorder = new MediaRecorder(stream);

recorder.ondataavailable = (event) => {
  socket.emit("media-chunk", event.data); // every single chunk goes through the server
};
recorder.start(100); // a new chunk every 100ms
\`\`\`

\`\`\`js
// Server: relays every chunk to the other participant, exactly like a chat message
io.on("connection", (socket) => {
  socket.on("media-chunk", (chunk) => {
    socket.broadcast.emit("media-chunk", chunk); // re-sent to every other connected client
  });
});
\`\`\`

This works for a small demo between two people on a fast local network — video and audio genuinely arrive at the other side. The problem becomes severe the moment this is examined at any real scale: unlike a chat message, sent occasionally and typically a few dozen bytes, a live video/audio stream is continuous and substantial, easily hundreds of kilobits per second, sent constantly for the entire duration of a call. Because this data is routed through the server exactly like the previous lesson\'s chat messages, the server must receive EVERY byte from the sending participant (using upload bandwidth) and then send EVERY byte back out to the receiving participant (using an equal amount of download bandwidth) — for one call between two people, the server\'s bandwidth cost is roughly DOUBLE the size of the actual call itself, and this cost scales directly with the number of simultaneous calls, quickly becoming enormously expensive and a genuine bottleneck under real usage, in a way that never happened with lightweight, occasional chat messages. Separately, every piece of audio and video now takes an extra hop — participant A\'s browser, to the server, to participant B\'s browser — adding real, noticeable latency to what should be a live, natural-feeling conversation, exactly like the earlier analogy\'s operator relaying every word instead of letting two people speak directly.

**The fix: WebRTC — the server only helps two browsers find each other, then gets out of the way**

\`\`\`js
// Step 1: the server is used ONLY for lightweight "signaling" — exchanging connection metadata,
// reusing the exact same Socket.io connection from the previous lesson
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event) => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer); // small metadata, sent once, not the actual media
\`\`\`

\`\`\`js
// Step 2: once signaling completes, audio/video flows DIRECTLY between the two browsers —
// the server is no longer involved in the media stream at all
peerConnection.ontrack = (event) => {
  remoteVideoElement.srcObject = event.streams[0]; // arriving directly from the other browser
};
\`\`\`

\`\`\`ts
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent): void => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer);

peerConnection.ontrack = (event: RTCTrackEvent): void => {
  remoteVideoElement.srcObject = event.streams[0];
};
\`\`\`

WebRTC (Web Real-Time Communication) is a browser API specifically designed to establish a DIRECT connection between two browsers, so that actual media (or arbitrary data) flows peer-to-peer, never touching the application\'s own server at all once the connection is established. The server\'s role shrinks to exactly one small, lightweight job — called "signaling" — helping two browsers exchange the small amount of metadata (an \`offer\`/\`answer\` describing what each browser is capable of, and \`ice-candidate\` messages describing possible network paths) needed to find and connect directly to each other; this signaling step reuses the previous lesson\'s existing WebSocket connection, since it is a small, occasional exchange, well suited to exactly the tool the last lesson introduced. Once this brief signaling handshake completes, the actual audio and video stream directly from one participant\'s browser to the other\'s, with the server\'s bandwidth and CPU no longer involved in carrying a single byte of the media itself — the server\'s cost per call becomes small and roughly constant (the tiny signaling exchange), rather than scaling directly with the size and duration of the media stream itself.`,

    simpleHi: `**Toote hue se shuru.** Ek video call feature jo audio/video ko bilkul pichhle lesson ke chat messages ki tarah treat karke banaaya gaya — har frame usi Socket.io server se relay hua:

\`\`\`js
// Client A: har capture ki gayi audio/video chunk ko maujooda Socket.io connection se bhejta hai
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
const recorder = new MediaRecorder(stream);

recorder.ondataavailable = (event) => {
  socket.emit("media-chunk", event.data); // har akeli chunk server se guzarti hai
};
recorder.start(100); // har 100ms mein ek nayi chunk
\`\`\`

\`\`\`js
// Server: har chunk ko doosre participant ko relay karta hai, bilkul ek chat message jaisa
io.on("connection", (socket) => {
  socket.on("media-chunk", (chunk) => {
    socket.broadcast.emit("media-chunk", chunk); // har doosre connected client ko dobara bheja
  });
});
\`\`\`

Ye ek tez local network par do logon ke beech ek chhote demo ke liye kaam karta hai — video aur audio sach mein doosri taraf pahunchte hain. Samasya us pal gambhir ban jaati hai jab ise kisi bhi asli scale par jaancha jaata hai: ek chat message ke ulta, kabhi-kabhi bheja gaya aur aam taur par kuch dazan bytes, ek live video/audio stream lagaataar aur kaafi bhaari hai, aasaani se sainkdon kilobits prati second, poori call ki poori avdhi ke liye lagaataar bheja jaata hai. Kyunki ye data server se bilkul pichhle lesson ke chat messages ki tarah route hota hai, server ko bhejne wale participant se HAR byte paana chahiye (upload bandwidth istemal karte hue) aur phir HAR byte paane wale participant ko wapas bhejna chahiye (barabar tadaad ka download bandwidth istemal karte hue) — do logon ke beech ek call ke liye, server ki bandwidth keemat asli call ki hi tadaad se lagbhag DOUBLE hai, aur ye keemat ek saath ho rahi calls ki tadaad ke saath seedhe taur par scale hoti hai, asli istemal ke neeche jaldi hi bahut mehengi aur ek asli bottleneck ban jaati hai, ek aise tarike se jo halke, kabhi-kabhi chat messages ke saath kabhi nahi hua. Alag se, audio aur video ka har tukda ab ek extra hop leta hai — participant A ka browser, server tak, participant B ke browser tak — ek live, swaabhavik-mehsoos-hoti baatcheet mein asli, noticeable deri jodте hue, bilkul pehle wale analogy ke operator jaisa jo har shabd relay karta hai do logon ko seedha baat karne dene ke bajaye.

**Fix: WebRTC — server sirf do browsers ko ek-doosre ko dhoondhne mein madad karta hai, phir raaste se hat jaata hai**

\`\`\`js
// Kadam 1: server SIRF halke "signaling" ke liye istemal hota hai — connection metadata exchange karna,
// pichhle lesson wale usi Socket.io connection ko dobara istemal karte hue
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event) => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer); // chhota metadata, ek baar bheja, asli media nahi
\`\`\`

\`\`\`js
// Kadam 2: ek baar signaling poori hone ke baad, audio/video SEEDHA dono browsers ke beech behta hai —
// server ab media stream mein bilkul shaamil nahi hai
peerConnection.ontrack = (event) => {
  remoteVideoElement.srcObject = event.streams[0]; // seedha doosre browser se aata hua
};
\`\`\`

\`\`\`ts
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent): void => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer);

peerConnection.ontrack = (event: RTCTrackEvent): void => {
  remoteVideoElement.srcObject = event.streams[0];
};
\`\`\`

WebRTC (Web Real-Time Communication) ek browser API hai jo khaas taur par do browsers ke beech ek SEEDHA connection sthaapit karne ke liye design hui hai, taaki asli media (ya manmaana data) peer-to-peer bahe, connection sthaapit hone ke baad application ke apne server ko bilkul kabhi chhue bina. Server ka role ek chhote, halke kaam tak simit ho jaata hai — jise "signaling" kehte hain — do browsers ko thodi si metadata exchange karne mein madad karna (ek \`offer\`/\`answer\` jo describe karta hai har browser kya kar sakta hai, aur \`ice-candidate\` messages jo mumkin network paths describe karte hain) ek-doosre ko dhoondhne aur seedha connect karne ke liye zaruri; ye signaling step pichhle lesson wali maujooda WebSocket connection ko dobara istemal karta hai, kyunki ye ek chhota, kabhi-kabhi hone waala exchange hai, bilkul us tool ke liye theek jise pichhle lesson ne introduce kiya. Ek baar ye chhota signaling handshake poora ho jaaye, asli audio aur video seedha ek participant ke browser se doosre tak stream hoti hai, server ki bandwidth aur CPU media ke ek bhi byte le jaane mein bilkul shaamil nahi rehte — server ki prati-call keemat chhoti aur lagbhag constant ban jaati hai (chhota signaling exchange), media stream khud ke size aur avdhi se seedhe taur par scale hone ke bajaye.`,

    content: `## Signaling: what small piece of information actually needs the server

\`\`\`js
// Server: a signaling relay, using the exact same Socket.io connection from the previous lesson —
// note it never touches the actual audio/video data at all
io.on("connection", (socket) => {
  socket.on("call-offer", (offer) => socket.broadcast.emit("call-offer", offer));
  socket.on("call-answer", (answer) => socket.broadcast.emit("call-answer", answer));
  socket.on("ice-candidate", (candidate) => socket.broadcast.emit("ice-candidate", candidate));
});
\`\`\`

The server\'s ONLY remaining job in a WebRTC-based call is relaying three small, occasional pieces of metadata between the two browsers, reusing the exact WebSocket mechanism the previous lesson introduced: an \`offer\` (one browser describing what audio/video formats and network options it supports), an \`answer\` (the other browser\'s corresponding response), and a series of \`ice-candidate\` messages (each browser\'s best guesses at how it might be reachable over the network). None of this is the actual audio or video content — it is comparable in size and frequency to the kind of small, occasional message a chat feature sends, which is exactly why the previous lesson\'s WebSocket connection is a perfectly natural fit for it, even though the resulting media itself will not flow through that connection at all.

## STUN and TURN: why finding a direct path between two browsers is not automatic

\`\`\`js
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },       // helps discover a usable public address
    { urls: "turn:turnserver.example.com:3478", username: "user", credential: "pass" }, // a fallback relay
  ],
});
\`\`\`

Most real devices sit behind a home router or a corporate firewall performing NAT (Network Address Translation), meaning a device\'s address on the wider internet is not simply its own local network address — establishing a genuinely direct connection first requires each browser to discover what its actual, externally-reachable address looks like. A STUN server\'s entire job is answering exactly this one question ("what does my connection look like from outside my own network?"), letting each browser include an accurate, externally-usable address among the \`ice-candidate\` information exchanged during signaling — for the substantial majority of real-world network configurations, this is enough information for the two browsers to establish a genuinely direct connection. Some network configurations (particularly certain restrictive corporate firewalls) make a direct connection genuinely impossible no matter what address information is exchanged — for exactly this remaining case, a TURN server acts as a last-resort relay, actually forwarding the media between the two participants (paying the same bandwidth cost this lesson\'s broken example paid for every call) — but critically, this is the FALLBACK path, used only when a direct connection cannot be established, not the default, universal behavior WebRTC relies on.

## What WebRTC is for, and when the previous lesson\'s plain WebSockets remain the right tool

\`\`\`
WebSockets (previous lesson): small, occasional messages between a client
and the SERVER — chat text, notifications, live updates to a shared feed.

WebRTC (this lesson): substantial, continuous media or data directly
BETWEEN two (or more) browsers — video/audio calls, screen sharing,
low-latency peer-to-peer data (some multiplayer games).
\`\`\`

It would be a mistake to conclude that WebRTC is simply a stronger replacement for WebSockets — the two solve genuinely different problems. WebSockets remain the right tool for exactly the case the previous lesson covered: relatively small, occasional pieces of data that legitimately need to reach or originate from the server itself (a chat message the server needs to store, a notification the server needs to decide to send). WebRTC is specifically for the narrower case where two end users need to exchange something substantial and continuous DIRECTLY with each other, and where routing that substantial stream through the server would be genuinely wasteful or add unacceptable latency — precisely the video/audio scenario this lesson\'s broken example demonstrated. Building an ordinary chat feature with WebRTC would be needless complexity for no benefit, in the same way building a video call feature by relaying every frame through a WebSocket server, as this lesson\'s broken example did, is a genuine, costly mistake.

## A brief note on complexity: WebRTC is commonly used through a higher-level library

\`\`\`js
// Real production applications commonly use a library built on top of raw WebRTC
// (Twilio, Daily, LiveKit, and similar) rather than hand-managing signaling,
// STUN/TURN configuration, and connection-recovery logic directly.
\`\`\`

The raw WebRTC APIs shown in this lesson\'s examples are genuinely more involved than the WebSocket code from the previous lesson — correctly handling signaling for more than two participants, gracefully recovering from a dropped connection, and reliably configuring TURN servers for every network condition real users might have is substantial, easy-to-get-subtly-wrong work. This is precisely why many real production video/audio features are built on top of a managed service or a higher-level library that handles these details, in a similar spirit to how this course\'s earlier lessons favored well-tested libraries (bcrypt, the cors package, express-rate-limit) over hand-rolling equivalent logic from scratch — understanding the underlying mechanism this lesson covers is what makes using any of those higher-level tools correctly and confidently possible.`,

    contentHi: `## Signaling: server ko asal mein kaunsi chhoti jaankaari chahiye

\`\`\`js
// Server: ek signaling relay, pichhle lesson wale usi Socket.io connection ka istemal karte hue —
// note karo ye asli audio/video data ko bilkul kabhi nahi chhuta
io.on("connection", (socket) => {
  socket.on("call-offer", (offer) => socket.broadcast.emit("call-offer", offer));
  socket.on("call-answer", (answer) => socket.broadcast.emit("call-answer", answer));
  socket.on("ice-candidate", (candidate) => socket.broadcast.emit("ice-candidate", candidate));
});
\`\`\`

Ek WebRTC-based call mein server ka SIRF baaki bacha kaam do browsers ke beech teen chhoti, kabhi-kabhi hone waali metadata ki cheezein relay karna hai, pichhle lesson ne introduce kiya bilkul wahi WebSocket mechanism dobara istemal karte hue: ek \`offer\` (ek browser describe kar raha hai ki wo kaunse audio/video formats aur network options support karta hai), ek \`answer\` (doosre browser ka jawaab), aur ek series ki \`ice-candidate\` messages (har browser ka behtareen andaaza ki wo network par kaise reachable ho sakta hai). Inmein se kuch bhi asli audio ya video content nahi hai — ye size aur frequency mein us kism ki chhoti, kabhi-kabhi hone waali message se milta-julta hai jo ek chat feature bhejta hai, bilkul isi wajah se pichhle lesson wali WebSocket connection iske liye poori tarah swaabhavik fit hai, chahe nateeja hui media khud us connection se bilkul na guzre.

## STUN aur TURN: do browsers ke beech ek seedha raasta dhoondhna apne aap kyun nahi hota

\`\`\`js
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },       // ek istemal-hone-laayak public address dhoondhne mein madad karta hai
    { urls: "turn:turnserver.example.com:3478", username: "user", credential: "pass" }, // ek fallback relay
  ],
});
\`\`\`

Zyaadatar asli devices ek ghar ke router ya ek corporate firewall ke peeche baithe hain jo NAT (Network Address Translation) karta hai, matlab ek device ka wider internet par address bas uska apna local network address nahi hai — ek sach mein seedha connection sthaapit karne ke liye pehle har browser ko ye dhoondhna chahiye ki uska asli, bahari-taur-par-reachable address kaisa dikhta hai. Ek STUN server ka poora kaam bilkul isi ek sawaal ka jawaab dena hai ("apne network se bahar se mera connection kaisa dikhta hai?"), har browser ko signaling ke dauraan exchange hui \`ice-candidate\` jaankaari mein ek sahi, bahar-se-istemal-hone-laayak address shaamil karne dete hue — asli-duniya network configurations ke bade hisse ke liye, ye do browsers ke liye ek sach mein seedha connection sthaapit karne ke liye kaafi jaankaari hai. Kuch network configurations (khaaskar kuch pratibandhaatmak corporate firewalls) ek seedha connection sach mein namumkin banaate hain chahe koi bhi address jaankaari exchange ho — bilkul isi bache case ke liye, ek TURN server ek aakhri-upaay relay ki tarah kaam karta hai, media ko do participants ke beech asal mein aage bhejte hue (wahi bandwidth keemat chukaate hue jo is lesson ka toota example har call ke liye chukaata tha) — par bahut zaruri, ye FALLBACK raasta hai, sirf tab istemal hota hai jab ek seedha connection sthaapit nahi ho sakta, WebRTC jis par bharosa karta hai us default, saarvavyaapi vyavhaar ki tarah nahi.

## WebRTC kis ke liye hai, aur pichhle lesson wale saadhe WebSockets kab sahi tool rehte hain

\`\`\`
WebSockets (pichhla lesson): ek client aur SERVER ke beech chhoti,
kabhi-kabhi hone waali messages — chat text, notifications, ek shared
feed mein live updates.

WebRTC (ye lesson): kaafi bhaari, lagaataar media ya data seedha
do (ya zyaada) browsers KE BEECH — video/audio calls, screen sharing,
kam-latency peer-to-peer data (kuch multiplayer games).
\`\`\`

Ye nateeja nikaalna ek galti hogi ki WebRTC bas WebSockets ka ek zyaada mazboot replacement hai — dono sach mein alag samasyaayein solve karte hain. WebSockets bilkul us case ke liye sahi tool rehte hain jo pichhle lesson ne cover kiya: taulnaatmak taur par chhoti, kabhi-kabhi ki data ki cheezein jinhe legitimate taur par server tak pahunchna ya server se shuru hona chahiye (ek chat message jise server ko store karna chahiye, ek notification jise server ko bhejne ka faisla lena chahiye). WebRTC khaas taur par us sankeern case ke liye hai jahan do end users ko kuch bhaari aur lagaataar SEEDHA ek-doosre ke saath exchange karna chahiye, aur jahan us bhaari stream ko server se route karna sach mein faaltu hoga ya asweekaarya latency jodega — theek wahi video/audio scenario jo is lesson ka toota example dikhaata hai. Ek aam chat feature ko WebRTC se banaana koi faayde ke bina bekaar complexity hogi, usi tarike se jaise ek video call feature ko har frame ek WebSocket server se relay karke banaana, jaisa is lesson ka toota example karta hai, ek asli, mehengi galti hai.

## Complexity par ek chhota note: WebRTC aam taur par ek oonchi-star wali library ke through istemal hota hai

\`\`\`js
// Asli production applications aam taur par raw WebRTC ke oopar bani ek library istemal karti hain
// (Twilio, Daily, LiveKit, aur waise hi) signaling, STUN/TURN configuration, aur
// connection-recovery logic seedha haath se sambhaalne ke bajaye.
\`\`\`

Is lesson ke examples mein dikhaaye raw WebRTC APIs sach mein pichhle lesson ke WebSocket code se zyaada shaamil hain — do se zyaada participants ke liye signaling sahi tarike se sambhaalna, ek toote connection se khoobsoorati se recover karna, aur har network sthiti ke liye jo asli users ke paas ho sakti hai bharosemand taur par TURN servers configure karna kaafi, subtle-taur-par-galat-hone-laayak kaam hai. Bilkul isi wajah se kai asli production video/audio features ek managed service ya ek oonchi-star wali library ke oopar banaaye jaate hain jo ye details sambhaalti hai, ek jaisi socch mein jaisa is course ke pehle wale lessons ne well-tested libraries (bcrypt, \`cors\` package, \`express-rate-limit\`) ko haath se barabar logic dobara banaane ke bajaye pasand kiya — is lesson mein cover hue underlying mechanism ko samajhna hi hai jo un oonchi-star wale tools mein se kisi ko bhi sahi tarike se aur bharose se istemal karna mumkin banaata hai.`,

    examples: [
      {
        title: 'Broken: video call media routed through the server like a chat message',
        titleHi: 'Toota: video call media server se ek chat message ki tarah route hota hai',
        code: `recorder.ondataavailable = (event) => {
  socket.emit("media-chunk", event.data); // constant, substantial data through the server
};
// server bandwidth cost is roughly double the call size, for every single call`,
        codeJs: `// Client
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
const recorder = new MediaRecorder(stream);
recorder.ondataavailable = (event) => {
  socket.emit("media-chunk", event.data);
};
recorder.start(100);

// Server
io.on("connection", (socket) => {
  socket.on("media-chunk", (chunk) => {
    socket.broadcast.emit("media-chunk", chunk);
  });
});`,
        codeTs: `// Client
const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
const recorder = new MediaRecorder(stream);
recorder.ondataavailable = (event: BlobEvent): void => {
  socket.emit("media-chunk", event.data);
};
recorder.start(100);

// Server
io.on("connection", (socket) => {
  socket.on("media-chunk", (chunk: Blob) => {
    socket.broadcast.emit("media-chunk", chunk);
  });
});
// Correctly typed, completely valid TypeScript — the problem is entirely
// about bandwidth and latency, not a type or logic error.`,
        output: `Works for a small demo on a fast local network. Under real usage, the
server's bandwidth cost roughly doubles the size of every ongoing call
(receiving and re-sending every chunk), scaling directly with the
number of simultaneous calls, and every frame takes an extra hop
through the server, adding noticeable latency.`,
        explain: 'Live media is continuous and substantial, unlike an occasional chat message — routing it through the server the same way multiplies server bandwidth cost and adds a real extra hop of latency.',
        explainHi: 'Live media lagaataar aur bhaari hai, ek kabhi-kabhi ki chat message ke ulta — use bhi server se usi tarike se route karna server bandwidth keemat ko guna karta hai aur latency ka ek asli extra hop jodta hai.',
      },
      {
        title: 'Fixed: WebRTC signaling through the server, media flows directly',
        titleHi: 'Theek: server se WebRTC signaling, media seedha behta hai',
        code: `const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
peerConnection.ontrack = (event) => { remoteVideo.srcObject = event.streams[0]; };`,
        codeJs: `// Client
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event) => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

peerConnection.ontrack = (event) => {
  remoteVideoElement.srcObject = event.streams[0];
};

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer);

// Server — signaling only, never touches the actual media
io.on("connection", (socket) => {
  socket.on("call-offer", (offer) => socket.broadcast.emit("call-offer", offer));
  socket.on("ice-candidate", (candidate) => socket.broadcast.emit("ice-candidate", candidate));
});`,
        codeTs: `// Client
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent): void => {
  if (event.candidate) socket.emit("ice-candidate", event.candidate);
};

peerConnection.ontrack = (event: RTCTrackEvent): void => {
  remoteVideoElement.srcObject = event.streams[0];
};

const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call-offer", offer);

// Server — signaling only, never touches the actual media
io.on("connection", (socket) => {
  socket.on("call-offer", (offer: RTCSessionDescriptionInit) => socket.broadcast.emit("call-offer", offer));
  socket.on("ice-candidate", (candidate: RTCIceCandidate) => socket.broadcast.emit("ice-candidate", candidate));
});`,
        outputJs: `The server relays only a handful of small metadata messages once, at
the start of the call. From that point on, audio and video flow
directly between the two browsers — server bandwidth cost per call
becomes small and roughly constant, no longer scaling with the size or
duration of the media itself.`,
        outputTs: `// Identical behaviour. RTCSessionDescriptionInit and RTCIceCandidate
// are the browser's own built-in WebRTC types, describing exactly the
// small metadata exchanged during signaling.`,
        explain: 'The server\'s job shrinks to relaying a handful of small, one-time messages — the substantial, continuous part (the actual media) never touches it at all once the direct connection is established.',
        explainHi: 'Server ka kaam mutthi bhar chhoti, ek-baar ki messages relay karne tak simit ho jaata hai — bhaari, lagaataar hissa (asli media) use ek baar seedha connection sthaapit hone ke baad bilkul kabhi nahi chhuta.',
      },
      {
        title: 'STUN and TURN: why a direct connection is usually possible but not guaranteed',
        titleHi: 'STUN aur TURN: ek seedha connection aam taur par mumkin kyun hai par guaranteed nahi',
        code: `const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "turn:turnserver.example.com:3478", username: "user", credential: "pass" },
  ],
});`,
        codeJs: `const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "turn:turnserver.example.com:3478", username: "user", credential: "pass" },
  ],
});
// WebRTC automatically tries a direct (STUN-assisted) path first,
// falling back to the TURN relay only if a direct path is not possible`,
        codeTs: `const iceServers: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "turn:turnserver.example.com:3478", username: "user", credential: "pass" },
];

const peerConnection = new RTCPeerConnection({ iceServers });
// WebRTC automatically tries a direct (STUN-assisted) path first,
// falling back to the TURN relay only if a direct path is not possible`,
        outputJs: `For most real-world network configurations, STUN alone provides enough
information for a genuinely direct connection. On a restrictive
network where direct connection is impossible, the call still works
via the TURN relay — at the cost of that one call's media now passing
through a server, exactly like the broken example, but only for the
specific calls that genuinely need it.`,
        outputTs: `// Identical behaviour. RTCIceServer is the browser's built-in type
// for describing a STUN or TURN server configuration entry.`,
        explain: 'STUN and TURN address a real, separate problem from this lesson\'s core fix — they determine HOW two browsers manage to actually reach each other over real-world networks, not WHETHER media should be routed through the server by default.',
        explainHi: 'STUN aur TURN is lesson ke mool fix se ek asli, alag samasya sambhaalte hain — wo tay karte hain ki do browsers asal-duniya networks par ek-doosre tak KAISE pahunchte hain, ye nahi ki media default taur par server se route hona chahiye ya nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `recorder.ondataavailable = (event) => socket.emit("media-chunk", event.data);
// routing continuous, substantial media through the server, like a chat message`,
        right: `stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
// media flows directly between browsers once WebRTC signaling completes`,
        why: 'Live audio/video is continuous and substantial, unlike an occasional chat message — routing it through the server the same way roughly doubles server bandwidth cost per call and adds a real extra network hop of latency.',
        whyHi: 'Live audio/video lagaataar aur bhaari hai, ek kabhi-kabhi ki chat message ke ulta — use bhi server se usi tarike se route karna prati-call server bandwidth keemat ko lagbhag double karta hai aur latency ka ek asli extra network hop jodta hai.',
      },
      {
        wrong: `const peerConnection = new RTCPeerConnection({ iceServers: [] });
// no STUN server configured — many real network configurations cannot connect at all`,
        right: `const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});
// a STUN server lets each browser discover its actual externally-reachable address`,
        why: 'Most real devices sit behind NAT and do not know their own externally-reachable address without help — without a STUN server, many otherwise-connectable browser pairs would fail to establish a direct connection.',
        whyHi: 'Zyaadatar asli devices NAT ke peeche baithe hain aur bina madad ke apna bahari-taur-par-reachable address nahi jaante — bina ek STUN server ke, kai aise browser jode jo warna connect ho sakte the ek seedha connection sthaapit karne mein fail ho jaate.',
      },
      {
        wrong: `// Building an ordinary chat feature on top of raw WebRTC peer connections
const peerConnection = new RTCPeerConnection();
peerConnection.createDataChannel("chat");`,
        right: `// An ordinary chat feature is already well served by the previous lesson's WebSockets
socket.emit("send-message", text);
socket.on("new-message", displayMessage);`,
        why: 'WebRTC earns its complexity specifically for substantial, continuous peer-to-peer media or data — an ordinary chat feature gains nothing from it and is better served by the simpler WebSocket approach already covered.',
        whyHi: 'WebRTC apni complexity khaas taur par bhaari, lagaataar peer-to-peer media ya data ke liye kamaata hai — ek aam chat feature ise kuch nahi paata aur ise pehle cover hue saadhe WebSocket tarike se behtar sambhaala jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**WebRTC is the underlying technology behind essentially every major browser-based video calling product** (Google Meet, and many others build directly on it), specifically because peer-to-peer media routing is what makes video calling viable at real scale without prohibitive server bandwidth costs.',
        hi: '**WebRTC lagbhag har mukhya browser-based video calling product ke peeche wali underlying technology hai** (Google Meet, aur kai doosre seedha ispar bante hain), khaas taur par isliye kyunki peer-to-peer media routing hi hai jo video calling ko asli scale par asal mein mumkin banaata hai bina bhaari-mahengi server bandwidth costs ke.',
      },
      {
        en: '**Managed WebRTC platforms (Twilio Video, Daily, LiveKit, Agora, and similar) are a substantial, well-established category of production infrastructure** specifically because correctly handling signaling, STUN/TURN, and connection recovery at scale is genuinely involved work most teams prefer not to build entirely from scratch.',
        hi: '**Managed WebRTC platforms (Twilio Video, Daily, LiveKit, Agora, aur waise hi) production infrastructure ki ek thos, achhi tarah sthaapit category hain** khaas taur par isliye kyunki signaling, STUN/TURN, aur connection recovery ko scale par sahi tarike se sambhaalna sach mein shaamil kaam hai jise zyaadatar teams poori tarah shuru se banaana pasand nahi karti.',
      },
      {
        en: '**STUN and TURN are standardized, RFC-defined protocols** (not specific to WebRTC or to any one company), which is why the same STUN/TURN infrastructure and configuration approach works consistently across different WebRTC implementations and different browsers.',
        hi: '**STUN aur TURN standardized, RFC-defined protocols hain** (WebRTC ya kisi ek company tak khaas nahi), isi wajah se wahi STUN/TURN infrastructure aur configuration tarika alag-alag WebRTC implementations aur alag-alag browsers ke aar-paar sangat taur par kaam karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does routing live audio/video through a server the same way a chat message is routed create a bandwidth problem that chat messages never cause?',
        qHi: 'Live audio/video ko ek server se usi tarike se route karna jaise ek chat message route hoti hai ek bandwidth samasya kyun paida karta hai jo chat messages kabhi nahi karti?',
        a: 'A chat message is small (typically a few dozen to a few hundred bytes) and sent only occasionally — whenever a user actually decides to type and send something, which even in an active conversation happens far less often than continuously. Relaying such a message through a server costs the server a correspondingly small, occasional amount of bandwidth. Live audio and video, by contrast, are continuous streams — data is generated and must be transmitted constantly, for the entire duration a call is active, at a substantial rate (commonly hundreds of kilobits per second or more per participant, even at modest quality). When this continuous stream is relayed through a server exactly like a chat message — received from the sending participant, then re-sent to the receiving participant — the server must handle both directions of this substantial, ongoing data rate for the entire call: incoming bandwidth from whoever is speaking, and an equal amount of outgoing bandwidth to whoever is receiving it. This means the server\'s bandwidth cost for one call is roughly double the call\'s own data rate, sustained for the call\'s entire duration, and this cost scales linearly with the number of simultaneous calls — a fundamentally different, and far more severe, cost profile than the small, occasional bandwidth a chat feature\'s messages require, which is precisely why the same server-relay pattern that works perfectly well for chat becomes a genuine bottleneck the moment it is applied to continuous media instead.',
        aHi: 'Ek chat message chhota hai (aam taur par kuch dazan se kuch sau bytes) aur sirf kabhi-kabhi bheja jaata hai — jab bhi ek user asal mein kuch type karke bhejne ka faisla leta hai, jo ek active baatcheet mein bhi lagaataar hone se kaafi kam baar hota hai. Aisi ek message ko ek server se relay karna server ko utni hi chhoti, kabhi-kabhi ki bandwidth ki keemat deta hai. Live audio aur video, iske ulta, lagaataar streams hain — data lagaataar paida hota hai aur transmit hona chahiye, poori avdhi ke liye jab ek call active hai, ek bhaari rate par (aam taur par prati participant, madhyam quality mein bhi, sainkdon kilobits prati second ya zyaada). Jab ye lagaataar stream ek server se bilkul ek chat message ki tarah relay hoti hai — bhejne wale participant se paai jaati hai, phir paane wale participant ko dobara bheji jaati hai — server ko is bhaari, chalti data rate ki dono disha poori call ki avdhi ke liye sambhaalni chahiye: jo bol raha hai us se aati bandwidth, aur jo pa raha hai use jaati barabar bandwidth. Iska matlab hai ek call ke liye server ki bandwidth keemat call ki apni data rate se lagbhag double hai, poori call ki avdhi ke liye barkaraar, aur ye keemat ek saath ho rahi calls ki tadaad ke saath linearly scale hoti hai — ek buniyaadi taur par alag, aur kaafi zyaada gambhir, keemat profile chat feature ki messages ko chahiye chhoti, kabhi-kabhi ki bandwidth se, bilkul isi wajah se wahi server-relay pattern jo chat ke liye poori tarah theek kaam karta hai us pal ek asli bottleneck ban jaata hai jab ise iske bajaye lagaataar media par lagu kiya jaata hai.',
      },
      {
        q: 'What is "signaling" in WebRTC, and why does it make sense for signaling to reuse the same WebSocket connection covered in the previous lesson, even though the actual media will not travel over that connection?',
        qHi: 'WebRTC mein "signaling" kya hai, aur signaling ke liye pichhle lesson mein cover ki gayi wahi WebSocket connection dobara istemal karna maayne kyun rakhta hai, chahe asli media us connection par kabhi nahi jaayegi?',
        a: 'Signaling is the process by which two browsers exchange the specific information needed to locate and connect directly to each other — an offer and answer describing each side\'s supported audio/video formats and connection capabilities, and a series of ICE candidates describing each browser\'s possible network addresses (assisted by STUN, as covered in this lesson). Crucially, none of this signaling information is the actual audio or video content itself — it is a small amount of metadata, exchanged only a handful of times at the start of a call (and occasionally afterward if network conditions change), not a continuous stream. This makes it a genuinely good fit for the previous lesson\'s WebSocket connection specifically because that connection already exists (if the application also has a chat feature or other real-time functionality) and is already well suited to exactly this kind of small, occasional, bidirectional message exchange — reusing it for signaling avoids needing to build or maintain a completely separate communication channel just to exchange a handful of small setup messages. The key distinction that makes this consistent rather than contradictory is that signaling and the actual media are two entirely separate concerns: the small, occasional signaling messages reasonably go through the server via WebSockets, while the substantial, continuous media stream itself is specifically routed to avoid the server entirely, flowing directly between the two browsers once signaling has done its job.',
        aHi: 'Signaling wo process hai jismein do browsers wo khaas jaankaari exchange karte hain jo ek-doosre ko dhoondhne aur seedha connect karne ke liye zaruri hai — ek offer aur answer jo har taraf ke supported audio/video formats aur connection capabilities describe karte hain, aur ek series ki ICE candidates jo har browser ke mumkin network addresses describe karti hain (STUN se madad-praapt, jaisa is lesson mein cover hua). Bahut zaruri, is signaling jaankaari mein se kuch bhi asli audio ya video content nahi hai — ye thodi si metadata hai, ek call ki shuruaat mein sirf mutthi bhar baar exchange hoti hai (aur kabhi-kabhi baad mein agar network sthiti badal jaaye), koi lagaataar stream nahi. Ye ise pichhle lesson wali WebSocket connection ke liye ek sach mein achha fit banaata hai khaas taur par isliye kyunki wo connection pehle se maujood hai (agar application mein ek chat feature ya doosri real-time functionality bhi hai) aur pehle se bilkul is kism ke chhote, kabhi-kabhi ke, bidirectional message exchange ke liye theek baithti hai — signaling ke liye ise dobara istemal karna ek poori tarah alag communication channel banaane ya maintain karne se bachaata hai bas mutthi bhar chhoti setup messages exchange karne ke liye. Zaruri farak jo ise sangat banaata hai, virodhaabhaasi nahi, ye hai ki signaling aur asli media do poori tarah alag chintaayen hain: chhoti, kabhi-kabhi ki signaling messages uchit taur par server se WebSockets ke through jaati hain, jabki bhaari, lagaataar media stream khud khaas taur par server se bachne ke liye route hoti hai, signaling apna kaam poora karte hi seedha do browsers ke beech behti hui.',
      },
      {
        q: 'Why is a TURN server described as a "fallback" rather than the normal way WebRTC media is delivered, and what does this reveal about when a direct peer-to-peer connection is and is not possible?',
        qHi: 'Ek TURN server ko WebRTC media deliver hone ka normal tarika nahi balki ek "fallback" kyun kaha jaata hai, aur ye zaahir karta hai ki ek seedha peer-to-peer connection kab mumkin hai aur kab nahi?',
        a: 'WebRTC\'s entire design goal is establishing a genuinely direct connection between two browsers so that media never needs to pass through a third-party server at all, which is what gives it its meaningful bandwidth and latency advantages over server-relayed approaches. A STUN server supports this goal without itself being in the media path at all — it simply helps each browser discover an accurate, externally-reachable address to include in its connection information, after which the two browsers attempt to connect using that address information directly. For the substantial majority of real-world network setups, this direct-connection attempt succeeds, and media genuinely never touches any server. However, certain network configurations — particularly some restrictive corporate or institutional firewalls specifically designed to block unusual or unrecognized direct connections between machines — can make a genuinely direct connection between two specific browsers impossible no matter what address information is exchanged. For exactly this narrower, less common case, a TURN server exists as a relay of last resort: it actually receives and re-forwards the media between the two participants, exactly like the broken server-relay pattern this lesson opened with, paying that same bandwidth cost, but only for the specific calls where a direct connection genuinely could not be established. Describing TURN as a fallback rather than the default reflects this reality accurately: the goal and the common case is a direct connection with no server involved in the media at all, and TURN exists specifically to handle the narrower set of situations where that goal cannot actually be achieved.',
        aHi: 'WebRTC ka poora design lakshya do browsers ke beech ek sach mein seedha connection sthaapit karna hai taaki media ko kabhi bhi kisi third-party server se guzarne ki zarurat na pade, jo ise server-relayed tarikon se apna maayne-rakhta bandwidth aur latency faayda deta hai. Ek STUN server is lakshya ko support karta hai khud media path mein bilkul hue bina — ye bas har browser ko ek sahi, bahar-se-reachable address dhoondhne mein madad karta hai apni connection jaankaari mein shaamil karne ke liye, jiske baad do browsers us address jaankaari ka istemal karke seedha connect karne ki koshish karte hain. Asli-duniya network setups ke bade hisse ke liye, ye seedha-connection koshish safal hoti hai, aur media sach mein kabhi kisi server ko chhuta nahi. Halaanki, kuch network configurations — khaaskar kuch pratibandhaatmak corporate ya institutional firewalls jo khaas taur par machines ke beech asaadhaaran ya na-pehchaani seedhi connections ko block karne ke liye design hue hain — do khaas browsers ke beech ek sach mein seedha connection namumkin bana sakte hain chahe koi bhi address jaankaari exchange ho. Bilkul isi sankeern, kam aam case ke liye, ek TURN server ek aakhri-upaay relay ki tarah maujood hai: ye asal mein media do participants ke beech paata aur dobara aage bhejta hai, bilkul is lesson ne jis toote server-relay pattern se shuru kiya usi ki tarah, wahi bandwidth keemat chukaate hue, par sirf un khaas calls ke liye jahan ek seedha connection sach mein sthaapit nahi ho paaya. TURN ko default ke bajaye ek fallback ki tarah describe karna is haqeeqat ko sahi tarike se darzha karta hai: lakshya aur aam case ek seedha connection hai media mein bilkul koi server shaamil na hue, aur TURN khaas taur par un sankeern sthitiyon ko sambhaalne ke liye maujood hai jahan wo lakshya asal mein haasil nahi ho paata.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken version routing recorded media chunks through Socket.io between two browser tabs. Using browser dev tools\' network tab, observe the volume of data flowing through the server\'s WebSocket connection while the "call" is active.',
        taskHi: 'Do browser tabs ke beech Socket.io se record ki gayi media chunks route karta toota version banao. Browser dev tools ke network tab ka istemal karke, "call" active hote waqt server ki WebSocket connection se guzarte data ki volume dekho.',
        hint: 'Compare the data volume shown in dev tools against what you would expect to see if the media were instead flowing directly between the two tabs.',
        hintHi: 'Dev tools mein dikhi data volume ko us se compare karo jo tum dekhne ki ummeed karte agar media iske bajaye do tabs ke beech seedha behti.',
      },
      {
        task: 'Fix it with a basic WebRTC peer connection (RTCPeerConnection, getUserMedia, signaling reused through your existing Socket.io connection). Confirm video/audio now displays correctly between two tabs, and confirm the server\'s WebSocket traffic is now limited to a handful of small signaling messages.',
        taskHi: 'Ek basic WebRTC peer connection se theek karo (\`RTCPeerConnection\`, \`getUserMedia\`, signaling apni maujooda Socket.io connection se dobara istemal karte hue). Confirm karo video/audio ab do tabs ke beech sahi tarike se dikhta hai, aur confirm karo server ka WebSocket traffic ab mutthi bhar chhoti signaling messages tak simit hai.',
        hint: 'Testing between two tabs on the same machine (rather than two different devices) is the simplest way to try this locally, since both can access the same local getUserMedia camera/microphone permissions.',
        hintHi: 'Ek hi machine par do tabs ke beech testing (do alag devices ke bajaye) ise locally try karne ka sabse saadha tarika hai, kyunki dono ek hi local \`getUserMedia\` camera/microphone permissions access kar sakte hain.',
      },
      {
        task: 'Research what happens if you deliberately omit the STUN server from the iceServers configuration, and, if you have access to two devices on genuinely different networks (not just two tabs on one machine), test whether a connection can still be established.',
        taskHi: 'Research karo ki kya hota hai agar tum jaan-boojhkar \`iceServers\` configuration se STUN server hataa do, aur, agar tumhaare paas do genuinely alag networks par do devices ka access hai (sirf ek machine par do tabs nahi), test karo ki kya ek connection abhi bhi sthaapit ho sakta hai.',
        hint: 'This exercise is meant to make STUN\'s role concrete rather than purely theoretical — if you cannot test across two real networks, reasoning through what dev tools would show (connection state stuck in "checking" or "failed") is a reasonable substitute.',
        hintHi: 'Ye exercise STUN ke role ko poori tarah theoretical ke bajaye thos banaane ke liye hai — agar tum do asli networks ke aar-paar test nahi kar sakte, ye soch-samajh kar samajhna ki dev tools kya dikhaayenge (connection state "checking" ya "failed" mein atka hua) ek uchit substitute hai.',
      },
    ],

    keyTakeaways: [
      'Live audio/video is continuous and substantial, unlike an occasional chat message — routing it through a server the same way a chat message is routed roughly doubles server bandwidth cost per call and adds real latency.',
      'WebRTC establishes a genuinely direct connection between two browsers, so media flows peer-to-peer, never touching the application\'s own server once the connection is established.',
      'Signaling — exchanging a small offer/answer and ICE candidates — is the only part of a WebRTC call that touches the server, and it reuses the same WebSocket mechanism from the previous lesson.',
      'STUN helps each browser discover its actual externally-reachable address (needed because most devices sit behind NAT), making a genuinely direct connection possible for most real-world network configurations.',
      'TURN is a fallback relay used only when a direct connection genuinely cannot be established — not the default path — and it does pay the same bandwidth cost as routing media through a server.',
      'WebRTC and WebSockets solve different problems: WebSockets suit small, occasional client-server messages (chat, notifications); WebRTC suits substantial, continuous peer-to-peer media or data (calls, screen sharing).',
    ],
    keyTakeawaysHi: [
      'Live audio/video lagaataar aur bhaari hai, ek kabhi-kabhi ki chat message ke ulta — use bhi ek server se usi tarike se route karna jaise ek chat message route hoti hai prati-call server bandwidth keemat ko lagbhag double karta hai aur asli latency jodta hai.',
      'WebRTC do browsers ke beech ek sach mein seedha connection sthaapit karta hai, taaki media peer-to-peer bahe, connection sthaapit hone ke baad application ke apne server ko kabhi bilkul na chhue.',
      'Signaling — ek chhota offer/answer aur ICE candidates exchange karna — WebRTC call ka wo akela hissa hai jo server ko chhuta hai, aur ye pichhle lesson wale usi WebSocket mechanism ko dobara istemal karta hai.',
      'STUN har browser ko apna asli bahar-se-reachable address dhoondhne mein madad karta hai (zaruri kyunki zyaadatar devices NAT ke peeche baithe hain), zyaadatar asli-duniya network configurations ke liye ek sach mein seedha connection mumkin banaate hue.',
      'TURN ek fallback relay hai jo sirf tab istemal hota hai jab ek seedha connection sach mein sthaapit nahi ho sakta — default raasta nahi — aur ye wahi bandwidth keemat chukaata hai jo media ko ek server se route karna chukaata.',
      'WebRTC aur WebSockets alag samasyaayein solve karte hain: WebSockets chhoti, kabhi-kabhi ki client-server messages (chat, notifications) ke liye theek baithte hain; WebRTC bhaari, lagaataar peer-to-peer media ya data (calls, screen sharing) ke liye theek baithta hai.',
    ],
  },
];
