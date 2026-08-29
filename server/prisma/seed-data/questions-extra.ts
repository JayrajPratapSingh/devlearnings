import type { SeedQuestion } from './questions';

/**
 * PostgreSQL and WebSockets questions.
 *
 * Both categories had topics but no questions, which meant the interview-track
 * links to "recall: PostgreSQL" landed on an empty list. Content gaps like that
 * are invisible until something links to them.
 */
export const extraQuestions: SeedQuestion[] = [
  /* ─────────────────────────────── PostgreSQL ─────────────────────────────── */
  {
    slug: 'pg-timestamptz-q',
    category: 'PostgreSQL',
    question: 'TIMESTAMP or TIMESTAMPTZ — which do you use and why?',
    shortAnswer: 'Always TIMESTAMPTZ. It stores an absolute moment; TIMESTAMP stores wall-clock text with no idea which timezone it meant.',
    shortAnswerHi: 'Hamesha TIMESTAMPTZ. Wo ek absolute pal store karta hai; TIMESTAMP sirf wall-clock text rakhta hai bina jaane wo kis timezone ka tha.',
    detailedAnswer: 'The name misleads people: TIMESTAMPTZ does not store a timezone. It converts the input to UTC on write and back to the session timezone on read, so it always refers to one unambiguous instant. TIMESTAMP stores "2026-08-22 15:00" as text — two servers in different regions will interpret the same row differently, and daylight saving makes some values ambiguous or impossible. This is the most common Postgres schema mistake, and it stays invisible until you have users or servers in a second timezone, at which point every historical row is already wrong.',
    detailedAnswerHi: 'Naam dhokha deta hai: TIMESTAMPTZ timezone store nahi karta. Wo likhte waqt input ko UTC mein badal deta hai aur padhte waqt session timezone mein wapas — isliye wo hamesha ek hi saaf pal batata hai. TIMESTAMP "2026-08-22 15:00" ko text ki tarah rakhta hai — alag regions ke do server usi row ka alag matlab nikalenge, aur daylight saving se kuch values ambiguous ya impossible ho jaati hain. Ye Postgres schema ki sabse common galti hai, aur tab tak chhupi rehti hai jab tak doosre timezone mein users ya servers na aayein — aur tab tak har purani row galat ho chuki hoti hai.',
    followUps: ['Why is FLOAT wrong for money?', 'What does now() return?', 'How do you store a date with no time?'],
    difficulty: 'MEDIUM',
    tags: ['postgresql', 'types', 'must-know'],
  },
  {
    slug: 'pg-jsonb-q',
    category: 'PostgreSQL',
    question: 'JSON vs JSONB, and when should a field NOT be in JSONB?',
    shortAnswer: 'JSONB is parsed binary — slower to write, far faster to query, and indexable. Anything you filter, join or constrain on should be a real column instead.',
    shortAnswerHi: 'JSONB parsed binary hai — likhne mein dheema, query mein kaafi tez, aur indexable. Jis par filter, join ya constraint lagta hai wo asli column hona chahiye.',
    detailedAnswer: 'JSON keeps the original text including whitespace and key order; JSONB parses it once into a binary form, which is what makes GIN indexes and containment queries possible. Use JSONB unless you genuinely need byte-for-byte fidelity. The real question is what belongs there at all: JSONB has no foreign keys, no NOT NULL on inner keys, and a typo in a key name fails silently rather than erroring. So it is right for genuinely variable data — per-category product attributes, webhook payloads stored as received — and wrong as a dumping ground for fields you did not model. One practical trap: -> returns JSON, so it yields "Delhi" with quotes; use ->> when comparing to a string.',
    detailedAnswerHi: 'JSON asli text rakhta hai, whitespace aur key order samet; JSONB use ek baar parse karke binary bana deta hai, aur isi se GIN indexes aur containment queries possible hote hain. Jab tak byte-dar-byte wahi text na chahiye, JSONB hi use karo. Asli sawaal ye hai ki usme jana kya chahiye: JSONB mein foreign keys nahi, andar ki keys par NOT NULL nahi, aur key ke naam mein typo error dene ki jagah chupchaap fail hota hai. Isliye ye sach mein badalte data ke liye sahi hai — per-category product attributes, jaise aaye waise rakhe webhook payloads — aur un fields ke kooda-ghar ke liye galat jinhe aapne model nahi kiya. Ek practical trap: -> JSON deta hai, matlab "Delhi" quotes ke saath; string se compare karna ho to ->> use karo.',
    codeExample: `CREATE INDEX idx_attrs ON products USING GIN (attrs);
SELECT * FROM products WHERE attrs @> '{"color":"black"}';
SELECT attrs ->> 'brand' FROM products;   -- ->> for text`,
    followUps: ['How do you index JSONB?', 'Difference between -> and ->>?', 'Does this replace MongoDB?'],
    difficulty: 'MEDIUM',
    tags: ['postgresql', 'jsonb'],
  },
  {
    slug: 'pg-upsert-q',
    category: 'PostgreSQL',
    question: 'How do you write an upsert, and why is check-then-insert wrong?',
    shortAnswer: 'ON CONFLICT … DO UPDATE. Check-then-insert is a race: two requests both find nothing and both insert.',
    shortAnswerHi: 'ON CONFLICT … DO UPDATE. Check-phir-insert ek race hai: do requests dono ko kuch nahi milta aur dono insert kar deti hain.',
    detailedAnswer: 'Between your SELECT and your INSERT another request can insert the same row, so one of them fails on a duplicate key. It never happens in testing and reliably happens under load. ON CONFLICT makes it a single atomic statement and lets the database resolve the race. EXCLUDED refers to the row that would have been inserted, which is how you reach the incoming values inside the update. It requires a unique constraint or unique index on the conflict column — without one there is nothing for Postgres to detect. The related habit worth having is RETURNING: INSERT … RETURNING id gives you the generated id in the same round trip instead of a second query.',
    detailedAnswerHi: 'Aapke SELECT aur INSERT ke beech doosri request wahi row daal sakti hai, isliye ek duplicate key par fail ho jati hai. Testing mein ye kabhi nahi hota aur load par pakka hota hai. ON CONFLICT ise ek atomic statement bana deta hai aur race database sambhal leta hai. EXCLUDED wo row hai jo insert hone wali thi — update ke andar aane wali values wahin se milti hain. Iske liye conflict column par unique constraint ya unique index chahiye — uske bina Postgres ko pakadne ko kuch hai hi nahi. Isse judi ek achhi aadat RETURNING hai: INSERT … RETURNING id usi round trip mein nayi id de deta hai, doosri query nahi chalani padti.',
    codeExample: `INSERT INTO users (email, name) VALUES ($1, $2)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
RETURNING id;`,
    followUps: ['What does EXCLUDED mean?', 'What does ON CONFLICT require?', 'What is RETURNING good for?'],
    difficulty: 'MEDIUM',
    tags: ['postgresql', 'concurrency', 'must-know'],
  },
  {
    slug: 'pg-explain-q',
    category: 'PostgreSQL',
    question: 'A query is slow. Walk me through diagnosing it.',
    shortAnswer: 'EXPLAIN ANALYZE, then compare estimated rows against actual. A Seq Scan on a big table returning few rows, or a large estimate gap, tells you most of it.',
    shortAnswerHi: 'EXPLAIN ANALYZE chalao, phir estimated aur actual rows compare karo. Badi table par Seq Scan jo kam rows laut a raha ho, ya estimate ka bada farq — inhi se zyadatar pata chal jata hai.',
    detailedAnswer: 'EXPLAIN shows the plan; EXPLAIN ANALYZE actually runs it and reports real timings, so only the second tells the truth. Read it inside-out. The scan type matters: Index Only Scan is best, then Index Scan, then Bitmap Heap Scan, and a Seq Scan is a red flag only when a large table returns few rows — on a small table it is the correct plan. The single most useful signal is the gap between rows= and actual rows=: if Postgres estimated 10 and got 400,000, every downstream decision was made on a wrong assumption, usually because statistics are stale, and ANALYZE tablename fixes it. Also look at Rows Removed by Filter (fetched a lot and discarded it) and Sort Method: external merge Disk (the sort spilled to disk).',
    detailedAnswerHi: 'EXPLAIN plan dikhata hai; EXPLAIN ANALYZE use sach mein chala kar asli timings deta hai, isliye sach sirf doosra batata hai. Ise andar se bahar padho. Scan type matter karta hai: Index Only Scan sabse achha, phir Index Scan, phir Bitmap Heap Scan, aur Seq Scan tabhi red flag hai jab badi table se kam rows aa rahi hon — chhoti table par wahi sahi plan hai. Sabse kaam ka signal rows= aur actual rows= ka farq hai: Postgres ne 10 socha aur 4,00,000 mile, to aage ke saare faisle galat maan kar hue, aksar purani statistics ki wajah se, aur ANALYZE tablename se theek ho jata hai. Rows Removed by Filter (bahut laaye aur phenk diya) aur Sort Method: external merge Disk (sort disk par gir gaya) bhi dekho.',
    followUps: ['When is a Seq Scan correct?', 'What does a big estimate gap mean?', 'Index Scan vs Index Only Scan?'],
    difficulty: 'HARD',
    tags: ['postgresql', 'performance', 'must-know'],
  },
  {
    slug: 'pg-mvcc-q',
    category: 'PostgreSQL',
    question: 'What is MVCC, and why can DELETE make a table bigger?',
    shortAnswer: 'Postgres writes a new row version instead of overwriting, marking the old one dead. DELETE only marks rows dead, so space is not freed until VACUUM runs.',
    shortAnswerHi: 'Postgres overwrite karne ki jagah nayi row version likhta hai aur purani ko dead mark karta hai. DELETE sirf dead mark karta hai, isliye jagah VACUUM chalne tak khaali nahi hoti.',
    detailedAnswer: 'Multi-Version Concurrency Control means every UPDATE creates a new version and marks the previous one dead, so each transaction sees a consistent snapshot from when it started. The payoff is that readers never block writers and writers never block readers — a long analytics query cannot hold up your writes. The cost is dead rows accumulating, which is bloat: they occupy disk and the planner must skip past them. VACUUM reclaims that space for reuse, and autovacuum normally handles it, though it can fall behind on very write-heavy tables. Two things surprise people: plain VACUUM does not shrink the file (VACUUM FULL does, but takes an exclusive lock, so never casually in production), and DELETE marks rather than frees, so a large delete temporarily grows the table on disk.',
    detailedAnswerHi: 'Multi-Version Concurrency Control ka matlab hai ki har UPDATE naya version banata hai aur pichhle ko dead mark karta hai, isliye har transaction ko wahi snapshot dikhta hai jo uske shuru hone par tha. Fayda ye ki readers writers ko nahi rokte aur writers readers ko nahi — lambi analytics query aapki writes nahi rok sakti. Keemat hai dead rows ka jamaa hona, yani bloat: wo disk gherte hain aur planner ko unhe laangna padta hai. VACUUM us jagah ko dobara istemal ke liye chhod deta hai, aur autovacuum ise normally sambhal leta hai, halanki bahut write-heavy tables par peeche reh sakta hai. Do baatein chaunkati hain: simple VACUUM file chhoti nahi karta (VACUUM FULL karta hai par exclusive lock leta hai, isliye production mein yun hi kabhi nahi), aur DELETE mark karta hai khaali nahi karta, isliye bada delete table ko kuch der ke liye disk par bada kar deta hai.',
    followUps: ['VACUUM vs VACUUM FULL?', 'How do you empty a table properly?', 'What is autovacuum falling behind?'],
    difficulty: 'HARD',
    tags: ['postgresql', 'mvcc', 'internals'],
  },
  {
    slug: 'pg-pooling-q',
    category: 'PostgreSQL',
    question: 'Why do Postgres connections need pooling, and what breaks in serverless?',
    shortAnswer: 'Each connection is a separate OS process, so the default cap is ~100. Serverless opens fresh connections per cold start and exhausts that, which is what PgBouncer solves.',
    shortAnswerHi: 'Har connection ek alag OS process hai, isliye default limit lagbhag 100 hai. Serverless har cold start par nayi connections kholta hai aur wo limit khatam kar deta hai — PgBouncer isi ka hal hai.',
    detailedAnswer: 'Unlike databases that use threads, Postgres forks a process per connection, so each costs real memory. A pool keeps a small set open and lends them out; ten connections comfortably serve hundreds of concurrent requests because each is held for milliseconds. Sizing is counter-intuitive — past roughly twice the core count, more connections means more context switching and less throughput, so 10 to 20 is right for most apps. The maths people miss is that the pool is per process: four instances with a pool of 20 is 80 connections, not 20. Serverless breaks this completely because every cold start opens new connections, so you need an external pooler like PgBouncer between the app and Postgres. In transaction mode PgBouncer does not support prepared statements, which is why Prisma needs pgbouncer=true in the URL.',
    detailedAnswerHi: 'Un databases ke ulat jo threads use karte hain, Postgres har connection ke liye ek process fork karta hai, isliye har ek asli memory leta hai. Pool kuch connections khuli rakh kar udhaar deta hai; das connections aaram se sau se zyada concurrent requests sambhal lete hain kyunki har ek sirf milliseconds pakadti hai. Size ka hisaab ulta hai — cores ke lagbhag dugne ke baad zyada connections matlab zyada context switching aur kam throughput, isliye zyadatar apps ke liye 10 se 20 sahi hai. Jo hisaab log bhool jaate hain wo ye ki pool per process hoti hai: 20 wale chaar instances matlab 80 connections, 20 nahi. Serverless ise poori tarah tod deta hai kyunki har cold start nayi connections kholta hai, isliye app aur Postgres ke beech PgBouncer jaisa external pooler chahiye. Transaction mode mein PgBouncer prepared statements support nahi karta, isiliye Prisma ko URL mein pgbouncer=true chahiye.',
    followUps: ['How do you size a pool?', 'What breaks in PgBouncer transaction mode?', 'Why is bigger not better?'],
    difficulty: 'MEDIUM',
    tags: ['postgresql', 'scaling', 'production'],
  },

  /* ─────────────────────────────── WebSockets ─────────────────────────────── */
  {
    slug: 'ws-vs-http-q',
    category: 'WebSockets',
    question: 'Why can HTTP not push data, and when would you choose SSE over WebSockets?',
    shortAnswer: 'HTTP is request-response — the server can never speak first. Choose SSE when only the server sends; WebSockets when both sides do.',
    shortAnswerHi: 'HTTP request-response hai — server kabhi pehle bol hi nahi sakta. SSE tab chuno jab sirf server bhejta ho; WebSockets jab dono bhejte hon.',
    detailedAnswer: 'Every HTTP exchange is started by the client, so live updates need something else. Polling asks repeatedly and wastes most requests on "nothing new". Long polling holds the request open until there is something, which reduces waste but ties up a connection per waiting client. Server-Sent Events keep one long-lived connection where the server pushes whenever it likes — simple, reconnects automatically, works over plain HTTP, but one-way only. WebSockets upgrade the connection so both sides can send at any time. The honest answer includes when not to reach for them: if the client only receives, SSE is lighter and needs no library, and if updates are every thirty seconds, polling is genuinely fine. Reaching for WebSockets when polling would do means owning connection state forever.',
    detailedAnswerHi: 'Har HTTP baat-cheet client shuru karta hai, isliye live updates ke liye kuch aur chahiye. Polling baar-baar poochhta hai aur zyadatar requests "kuch naya nahi" par barbaad hoti hain. Long polling request ko tab tak khuli rakhta hai jab tak kuch na ho, isse barbaadi kam hoti hai par har wait karte client ka ek connection ghira rehta hai. Server-Sent Events ek lambi connection rakhte hain jahan server jab chahe push kare — simple, khud reconnect karta hai, plain HTTP par chalta hai, par sirf ek tarfa. WebSockets connection upgrade kar dete hain taaki dono taraf kabhi bhi bhej sakein. Imaandar jawab mein ye bhi hai ki inhe kab nahi uthana: agar client sirf receive karta hai to SSE halka hai aur library ki zarurat nahi, aur agar update har tees second par hai to polling sach mein theek hai. Jahan polling kaafi thi wahan WebSockets lena matlab hamesha ke liye connection state sambhalna.',
    followUps: ['What is HTTP 101?', 'Why does the handshake use HTTP?', 'When is polling the right answer?'],
    difficulty: 'MEDIUM',
    tags: ['websockets', 'realtime', 'must-know'],
  },
  {
    slug: 'ws-auth-q',
    category: 'WebSockets',
    question: 'How do you secure a WebSocket connection?',
    shortAnswer: 'Authenticate in the handshake, re-check permissions on every event, never join a client-named room, and check Origin yourself — CORS does not apply.',
    shortAnswerHi: 'Handshake mein authenticate karo, har event par permission dobara check karo, client ke bataye room mein kabhi join mat karao, aur Origin khud check karo — CORS yahan lagta hi nahi.',
    detailedAnswer: 'A socket authenticates once and then stays open for hours, which changes the threat model. Verify the token in connection middleware and attach the user to the socket, sending it in the auth payload rather than the query string, since query strings land in server and proxy logs. Then re-check authorisation per event: being connected proved who they are once, not that they may join order 99. The specific trap is socket.join with a room name taken straight from the client, which lets anyone receive someone else\'s data. Two more: CORS does not protect WebSockets the way it protects fetch, so you must verify the Origin header yourself or any site can open a socket with the user\'s cookies; and HTTP rate limiters never see socket events, so a client can emit in a loop unless you limit them separately.',
    detailedAnswerHi: 'Socket ek baar authenticate hota hai aur phir ghanton khula rehta hai, isse khatra badal jata hai. Token connection middleware mein verify karo aur user ko socket se jodo, aur use auth payload mein bhejo query string mein nahi, kyunki query strings server aur proxy logs mein pahunchti hain. Phir har event par authorisation dobara check karo: connected hona ek baar ye sabit karta hai ki wo kaun hai, ye nahi ki wo order 99 join kar sakta hai. Khaas trap hai socket.join mein client ka diya room naam, jisse koi bhi doosre ka data le sakta hai. Do aur: CORS WebSockets ko waise nahi bachata jaise fetch ko bachata hai, isliye Origin header khud verify karna padega warna koi bhi site user ki cookies ke saath socket khol legi; aur HTTP rate limiters ko socket events dikhte hi nahi, isliye client loop mein emit kar sakta hai jab tak aap alag se limit na lagao.',
    followUps: ['Does CORS apply to WebSockets?', 'What happens when the token expires mid-connection?', 'Why re-check per event?'],
    difficulty: 'HARD',
    tags: ['websockets', 'security', 'auth', 'must-know'],
  },
  {
    slug: 'ws-scaling-q',
    category: 'WebSockets',
    question: 'What breaks when you run two WebSocket servers behind a load balancer?',
    shortAnswer: 'Broadcasts only reach clients on the same server. You need an adapter — usually Redis — so servers relay events to each other.',
    shortAnswerHi: 'Broadcast sirf usi server ke clients tak pahunchta hai. Adapter chahiye — aksar Redis — taaki servers ek doosre ko events pahunchayein.',
    detailedAnswer: 'A REST server is stateless so any instance can serve any request, but a socket connection lives on one specific machine. If Alice is on server A and Bob on server B, a broadcast from server A never reaches Bob — and everything works perfectly on one process locally, so this appears only after you scale. The fix is an adapter: with the Redis adapter each server publishes emits to Redis and subscribes to the others, so a broadcast crosses instances. Sticky sessions matter too, because Socket.IO\'s HTTP long-polling fallback sends several handshake requests that must all reach the same server; without stickiness you get intermittent failures that look like a flaky network. Beyond that, capacity is measured in concurrent connections rather than requests per second, presence must live in shared storage, and a deploy disconnects everyone at once, so reconnection needs backoff and jitter.',
    detailedAnswerHi: 'REST server stateless hai isliye koi bhi instance koi bhi request sambhal le, par socket connection ek khaas machine par rehti hai. Alice server A par hai aur Bob server B par, to server A ka broadcast Bob tak kabhi nahi pahunchta — aur local par ek process mein sab perfect chalta hai, isliye ye sirf scale karne ke baad dikhta hai. Ilaaj adapter hai: Redis adapter ke saath har server apne emits Redis par publish karta hai aur doosron ko subscribe karta hai, isliye broadcast instances ke paar chala jata hai. Sticky sessions bhi matter karti hain, kyunki Socket.IO ka HTTP long-polling fallback kai handshake requests bhejta hai jinhe usi server par pahunchna hota hai; stickiness ke bina beech-beech mein failures aate hain jo flaky network jaise lagte hain. Iske alawa capacity requests per second se nahi balki ek saath judi connections se naapi jati hai, presence shared storage mein hona chahiye, aur deploy karte hi sab ek saath disconnect hote hain, isliye reconnection mein backoff aur jitter chahiye.',
    followUps: ['What does the Redis adapter actually do?', 'Why are sticky sessions needed?', 'How do you track who is online across servers?'],
    difficulty: 'HARD',
    tags: ['websockets', 'scaling', 'system-design'],
  },
  {
    slug: 'ws-socketio-q',
    category: 'WebSockets',
    question: 'What does Socket.IO add over raw WebSockets?',
    shortAnswer: 'Auto-reconnect, rooms, named events, acknowledgements and an HTTP fallback. It is a library on top of WebSockets, not a WebSocket.',
    shortAnswerHi: 'Auto-reconnect, rooms, naam wale events, acknowledgements aur HTTP fallback. Ye WebSockets ke upar ek library hai, khud WebSocket nahi.',
    detailedAnswer: 'Raw WebSockets give you a byte pipe and nothing else, so you end up writing reconnection with backoff, a grouping mechanism, message-type routing and delivery confirmation yourself. Socket.IO provides all of those, plus a fallback to HTTP long polling for networks that block WebSockets, and an adapter interface for running multiple servers. Rooms are the concept worth learning: a room is just a named group of sockets, so joining and broadcasting to a subset are each one line with no bookkeeping. The catch people hit on day one is that Socket.IO has its own handshake and message format layered on the protocol, so a plain new WebSocket() cannot connect to a Socket.IO server — both ends must use it, and mismatched major versions refuse each other.',
    detailedAnswerHi: 'Raw WebSockets sirf ek byte pipe dete hain, isliye reconnection with backoff, grouping ka tareeka, message-type routing aur delivery confirmation aapko khud likhna padta hai. Socket.IO ye sab deta hai, saath mein un networks ke liye HTTP long polling par fallback jahan WebSockets block hain, aur kai servers chalane ke liye adapter interface. Rooms wo concept hai jo seekhna chahiye: room bas sockets ka ek naam wala group hai, isliye join karna aur kisi hisse ko broadcast karna dono ek-ek line hain, koi hisaab-kitaab nahi. Pehle din jo baat sabko fasati hai wo ye ki Socket.IO ka apna handshake aur message format protocol ke upar hai, isliye plain new WebSocket() Socket.IO server se connect nahi ho sakta — dono taraf wahi chahiye, aur alag major versions ek doosre ko mana kar dete hain.',
    codeExample: `socket.join('order:5');
io.to('order:5').emit('order:updated', { status: 'shipped' });`,
    followUps: ['Can a plain WebSocket client connect to Socket.IO?', 'What is a room?', 'io.emit vs socket.broadcast.emit?'],
    difficulty: 'MEDIUM',
    tags: ['websockets', 'socket.io'],
  },
];
