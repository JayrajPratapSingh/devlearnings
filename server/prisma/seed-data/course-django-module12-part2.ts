/**
 * Django Complete Course — Module 12: Realtime with Channels, lesson 3.
 *
 * Lesson 3: testing, deploying & scaling Channels, plus choosing the right realtime
 *           transport — WebsocketCommunicator patterns, ChannelsLiveServerTestCase,
 *           deploying Daphne/Uvicorn behind nginx, scaling the channel layer, WebSocket
 *           vs SSE vs long-poll, and the standard patterns (chat, per-user notifications,
 *           live dashboard) with their security controls (origin check, auth ticket,
 *           per-connection rate limiting, message size caps).
 *
 * Verified against Channels 4.3.2 (WebsocketCommunicator connect/send_json_to/
 * receive_json_from/receive_nothing/disconnect; InMemoryChannelLayer for tests).
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_12_PART2: CourseLesson[] = [
  {
    slug: 'dj-channels-testing-scaling-and-patterns',
    title: 'Channels: Testing, Deployment, Scaling & Transport Choice',
    titleHi: 'Channels: Testing, Deployment, Scaling Aur Transport Choice',
    description: 'How to test a consumer without a browser (`WebsocketCommunicator`), how to deploy an ASGI server (Daphne/Uvicorn behind nginx, WebSocket-aware), how the channel layer scales and where it breaks, and how to decide between WebSocket, Server-Sent Events, and plain polling for a given feature.',
    descriptionHi: 'Ek consumer ko ek browser ke bina kaise test karें (`WebsocketCommunicator`), ek ASGI server kaise deploy karें (nginx ke peeche Daphne/Uvicorn, WebSocket-aware), channel layer kaise scale karता hai aur kahan tutता hai, aur ek diye feature ke liye WebSocket, Server-Sent Events, aur plain polling ke beech kaise faisla karें.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Rehearsing, staging, and choosing the venue for a live broadcast.** You do not test a live show by going on air — you run a **rehearsal** with a stand-in reading the cues off-camera and checking every response lands (`WebsocketCommunicator`: no browser, drive the consumer directly, assert on frames). For a full dress rehearsal you build the actual set and have people walk through it (`ChannelsLiveServerTestCase`: a real ASGI server, a real client). Then the venue: a live broadcast needs a building wired for it — power, satellite uplink, the works (an **ASGI server**, and an nginx that knows how to hold a socket open rather than buffering it like a normal page). And the format question: not every announcement needs a two-way broadcast. A back-and-forth interview is a **WebSocket**. A one-way ticker crawl — scores, prices, a build log — is **Server-Sent Events**, simpler and it reconnects itself. And "check the noticeboard every few minutes" — a status that changes rarely — is just **polling**, no live infrastructure at all. Reaching for a WebSocket when an SSE or a poll would do is renting a satellite truck to post a flyer.',
      hi: '**Ek live broadcast ke liye rehearsal, staging, aur venue chunna.** Aap ek live show ko on air jaकर test nahi karते — aap ek **rehearsal** chalाते ho ek stand-in ke saath jо off-camera cues padhता hai aur check karता hai har response land hoता hai (`WebsocketCommunicator`: koi browser nahi, consumer ko seedhे drive karो, frames par assert karो). Ek poore dress rehearsal ke liye aap asli set banाते ho aur log ise walk through karते hain (`ChannelsLiveServerTestCase`: ek real ASGI server, ek real client). Phir venue: ek live broadcast ko iske liye wired ek building chahिए — power, satellite uplink (ek **ASGI server**, aur ek nginx jо ek socket khula rakhना jaanता hai ise ek normal page ki tarah buffer karne ke bजाy). Aur format sawaal: har announcement ko ek two-way broadcast ki zaroorat nahi. Ek back-and-forth interview ek **WebSocket** hai. Ek one-way ticker crawl — scores, prices, ek build log — **Server-Sent Events** hai, saral aur ye khud reconnect karता hai. Aur "har kuch minute noticeboard check karो" — ek status jо shायद hi badalता hai — bस **polling** hai.',
    },

    simple: `**Testing: \`WebsocketCommunicator\` (no browser, no server)**

\`\`\`python
import pytest
from channels.testing import WebsocketCommunicator
from myproject.asgi import application            # or the consumer directly

@pytest.mark.asyncio
async def test_chat_broadcast():
    a = WebsocketCommunicator(application, "/ws/chat/general/")
    b = WebsocketCommunicator(application, "/ws/chat/general/")
    assert (await a.connect())[0] is True
    assert (await b.connect())[0] is True

    await a.send_json_to({"text": "hello"})
    assert (await b.receive_json_from())["text"] == "hello"     # b hears a's message

    await a.disconnect()
    await b.disconnect()
\`\`\`

\`\`\`
communicator API:
  await comm.connect()            -> (accepted: bool, close_code_or_subprotocol)
  await comm.send_json_to(obj)    /  send_to(text_data=...)
  await comm.receive_json_from()  /  receive_from()        (raises if nothing arrives)
  await comm.receive_nothing(timeout=0.1)  -> True if the consumer sent nothing
  await comm.disconnect()

pytest needs:  pytest-asyncio  + @pytest.mark.asyncio  (or asyncio_mode = auto)
DB in a consumer test:  @pytest.mark.django_db(transaction=True)   (threads + commits)
channel layer for tests:  CHANNEL_LAYERS -> InMemoryChannelLayer   (override in test settings)
\`\`\`

**Deployment: an ASGI server, WebSocket-aware proxy**

\`\`\`
gunicorn myproject.wsgi          <-- WSGI, cannot serve WebSocket. replace/supplement with:
daphne  -b 0.0.0.0 -p 8001 myproject.asgi:application
uvicorn myproject.asgi:application --host 0.0.0.0 --port 8001 --workers 4
# or gunicorn with a uvicorn worker class:
gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4
\`\`\`

\`\`\`nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;      # the WebSocket handshake
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;                    # don't kill idle sockets at 60s
}
\`\`\`

**Redis is now infrastructure**

\`\`\`
CHANNEL_LAYERS -> RedisChannelLayer  (shared by every daphne/uvicorn worker + Celery)
one Redis for cache, one logical DB (or instance) for the channel layer -- keep them separate
Redis down  ->  group_send fails  ->  wrap broadcasts so a realtime outage != a 500 on the view
\`\`\`

**Transport choice**

\`\`\`
need                                  use
----------------------------------    --------------------------------------------
client<->server, low latency, 2-way   WebSocket (Channels)
server->client only, text events      Server-Sent Events (an async view, StreamingHttpResponse)
state changes every few minutes       poll a normal JSON endpoint (+ ETag)
one big fan-out, mostly read          SSE from cache, or a hosted pub/sub, not per-conn Redis
\`\`\``,

    simpleHi: `**Testing: \`WebsocketCommunicator\` (koi browser nahi, koi server nahi)**

\`\`\`python
import pytest
from channels.testing import WebsocketCommunicator
from myproject.asgi import application

@pytest.mark.asyncio
async def test_chat_broadcast():
    a = WebsocketCommunicator(application, "/ws/chat/general/")
    b = WebsocketCommunicator(application, "/ws/chat/general/")
    assert (await a.connect())[0] is True
    assert (await b.connect())[0] is True

    await a.send_json_to({"text": "hello"})
    assert (await b.receive_json_from())["text"] == "hello"     # b, a ka message sunता hai

    await a.disconnect()
    await b.disconnect()
\`\`\`

\`\`\`
communicator API:
  await comm.connect()            -> (accepted: bool, close_code_or_subprotocol)
  await comm.send_json_to(obj)    /  send_to(text_data=...)
  await comm.receive_json_from()  /  receive_from()        (kuch na aane par raise)
  await comm.receive_nothing(timeout=0.1)  -> True agar consumer ne kuch nahi bheja
  await comm.disconnect()

pytest ko chahिए:  pytest-asyncio  + @pytest.mark.asyncio
Ek consumer test mein DB:  @pytest.mark.django_db(transaction=True)
tests ke liye channel layer:  CHANNEL_LAYERS -> InMemoryChannelLayer
\`\`\`

**Deployment: ek ASGI server, WebSocket-aware proxy**

\`\`\`
gunicorn myproject.wsgi          <-- WSGI, WebSocket serve nahi kar sakta. iske saath:
daphne  -b 0.0.0.0 -p 8001 myproject.asgi:application
uvicorn myproject.asgi:application --host 0.0.0.0 --port 8001 --workers 4
gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4
\`\`\`

\`\`\`nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;      # WebSocket handshake
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;                    # 60s par idle sockets mat maarो
}
\`\`\`

**Redis ab infrastructure hai**

\`\`\`
CHANNEL_LAYERS -> RedisChannelLayer  (har daphne/uvicorn worker + Celery dwara shared)
cache ke liye ek Redis, channel layer ke liye ek logical DB -- unhe alag rakhो
Redis down  ->  group_send fail  ->  broadcasts wrap karो taaki ek realtime outage != view par ek 500
\`\`\`

**Transport choice**

\`\`\`
zaroorat                              istemal
----------------------------------    --------------------------------------------
client<->server, low latency, 2-way   WebSocket (Channels)
server->client sirf, text events      Server-Sent Events (ek async view)
state har kuch minute badalता hai      ek normal JSON endpoint poll karो (+ ETag)
ek bada fan-out, mostly read           cache se SSE, ya ek hosted pub/sub
\`\`\``,

    content: `## Testing consumers

**\`WebsocketCommunicator\`** is the consumer equivalent of DRF's \`APIClient\` — it drives a consumer in-process, no browser, no running server, no network. You give it the ASGI application (or a single consumer via \`.as_asgi()\`) and a path, then:

- \`await comm.connect()\` returns \`(accepted, code)\` — \`(True, None)\` on \`accept()\`, \`(False, 4001)\` on \`close(code=4001)\`.
- \`await comm.send_json_to(obj)\` / \`send_to(text_data=...)\` — send a client frame.
- \`await comm.receive_json_from()\` / \`receive_from()\` — read the next server frame; **raises \`asyncio.TimeoutError\` if none arrives** within the timeout, so it doubles as an assertion that *something* was sent.
- \`await comm.receive_nothing(timeout=0.1)\` — returns \`True\` if the consumer sent nothing, the way to assert a client did **not** get a message.
- \`await comm.disconnect()\` — triggers \`disconnect\`.

To test broadcasting, open two communicators, send on one, assert the other receives. Test setup:

- **pytest:** \`pytest-asyncio\`, and mark tests \`@pytest.mark.asyncio\` (or set \`asyncio_mode = auto\`).
- **Channel layer:** override \`CHANNEL_LAYERS\` to \`InMemoryChannelLayer\` in test settings — deterministic, no Redis. (\`@override_settings\` per test also works.)
- **Database:** a consumer that writes needs \`@pytest.mark.django_db(transaction=True)\` because \`database_sync_to_async\` runs in a thread and real commits must be visible; with plain \`django_db\` the wrapped thread sees an empty DB.
- **The routing:** import your real \`application\` from \`asgi.py\` to also exercise the middleware stack (auth, origin), or the bare consumer to isolate its logic.

**\`ChannelsLiveServerTestCase\`** spins up a real Daphne server and is for end-to-end tests with a real browser driver (Selenium/Playwright) — slower, use sparingly for the critical happy path. It requires \`daphne\` installed and does not run under SQLite in-memory.

## Deploying an ASGI application

WSGI servers (\`gunicorn myproject.wsgi\`, \`mod_wsgi\`) **cannot serve WebSocket** — they have no concept of a connection that outlives a request. You need an **ASGI server**:

- **Daphne** — the Channels reference server. \`daphne -b 0.0.0.0 -p 8001 myproject.asgi:application\`.
- **Uvicorn** — fast, widely used. \`uvicorn myproject.asgi:application --workers 4\`.
- **Gunicorn + Uvicorn worker** — \`gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4\` — keeps Gunicorn's process management with ASGI support.

A common production shape: run the ASGI server for everything, or run **WSGI (Gunicorn) for HTTP and ASGI (Daphne) only for \`/ws/\`**, with nginx routing \`/ws/\` to Daphne and the rest to Gunicorn. Either works; a single ASGI server is simpler, split lets you tune and scale them independently.

**nginx (or any proxy) must be told about the upgrade:**

\`\`\`nginx
location /ws/ {
    proxy_pass http://asgi_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;      # default 60s would drop idle sockets
    proxy_send_timeout 3600s;
}
\`\`\`

Also: load balancers need a long idle timeout (AWS ALB default 60 s), and **sticky sessions are not required** if the channel layer is Redis — any worker can serve any socket because groups are shared. Send periodic pings (Channels can, or the client every ~30 s) to keep intermediaries from dropping idle connections.

## Scaling the channel layer

Once you deploy, the channel layer is real infrastructure:

- **Redis is a hard dependency for correctness**, not just performance — with multiple workers, \`InMemoryChannelLayer\` silently loses cross-worker messages.
- **Capacity:** \`group_send\` to *N* members is *N* Redis operations. Model your worst case: (subscribers per group) × (messages per second) × (groups). A live sports app with 50k users in one match group at 10 events/second is 500k ops/s — that needs a plan (Redis cluster, \`RedisPubSubChannelLayer\`, or sharding groups).
- **Message size:** \`channels_redis\` caps a channel-layer message at ~1 MB and errors above it. Broadcast IDs and deltas, not documents.
- **Redis failure:** if Redis is down, \`group_send\` raises. A broadcast that follows a successful HTTP write should not turn that 200 into a 500 — wrap the broadcast in \`try/except\` (and log), or enqueue it, so a realtime hiccup degrades to "the page updates on next refresh" instead of a user-facing error.
- **Separate Redis logical DBs / instances** for cache vs channel layer vs Celery broker — a \`FLUSHDB\` on the cache should not wipe live connection state, and their load profiles differ.
- **Connection limits:** each ASGI worker holds file descriptors for its sockets; raise \`ulimit -n\`, and size workers × connections against RAM (each idle async connection is cheap but not free).

## WebSocket vs SSE vs polling

Reach for the **least** machinery that meets the need:

| requirement | transport | why |
|---|---|---|
| Two-way, low latency (chat, collaborative editing, games, live cursors) | **WebSocket** (Channels) | only option for true bidirectional realtime |
| Server → client only, text (notifications, a live log, progress, a price feed, "someone commented") | **Server-Sent Events** | one-way; runs over plain HTTP/2; the browser \`EventSource\` **auto-reconnects**; no channel layer needed for a single stream, though you can still \`group_send\` into an SSE view |
| Data changes every few minutes; "eventually" is fine (dashboard tiles, a status badge, unread count) | **polling** a JSON endpoint | zero persistent connections, zero new infra, an \`ETag\` makes the steady state a cheap 304 |
| One stream fanned to 10k–1M mostly-read viewers (public ticker, live results) | **SSE from a cache** or a hosted pub/sub (Pusher/Ably) or a CDN | per-connection Redis fan-out gets expensive; a cached stream or a purpose-built service scales better |

SSE in Django is an \`async\` view returning a \`StreamingHttpResponse\` (or \`ASGI\` streaming) that yields \`data: {...}\\n\\n\` lines. It still needs an ASGI server and a proxy that does not buffer, but it is far less code and less operational surface than WebSocket. **Default to SSE for one-way, WebSocket only when the client must talk back frequently.**

## The standard patterns

- **Chat / rooms:** one group per room (\`chat_{room_id}\`); \`connect\` validates membership then \`group_add\`; \`receive_json\` persists the message (\`database_sync_to_async\`) then \`group_send\`; a \`chat_message\` handler forwards to each client. Add \`chat.typing\` and \`presence.join\`/\`presence.leave\` as separate event types.
- **Per-user notifications:** one group per user (\`user_{id}\`), joined by every tab/device. Anything in the app — a view, a signal, a Celery task — does \`async_to_sync(layer.group_send)(f"user_{id}", {...})\` after \`transaction.on_commit\`. The consumer is tiny: join on connect, one handler that forwards.
- **Live dashboard:** one group (\`dashboard\`). A Celery **beat** task computes the snapshot on a fixed interval and \`group_send\`s it — the consumers do no per-client work, so viewer count does not multiply query load.

## Security controls for consumers

- **Origin check:** wrap the WebSocket branch in \`AllowedHostsOriginValidator\` (or \`OriginValidator([...])\`). A browser sends the user's cookies with a cross-site WebSocket handshake, so without this an attacker's page can open an authenticated socket to your server (cross-site WebSocket hijacking).
- **Authenticate in \`connect\`:** \`AuthMiddlewareStack\` for cookie sessions; a short-lived query-string **ticket** + tiny middleware for token clients. Reject with \`close(code=...)\` — never accept-then-hope.
- **Authorize every action:** \`connect\` checks the user may join *this* room; \`receive_json\` re-checks the user may post *this* message. A socket that is authenticated is not authorized for everything.
- **Rate-limit per connection:** track timestamps on \`self\` and drop or \`close\` a client sending hundreds of frames a second — one abusive socket can \`group_send\` a storm to a whole room.
- **Cap message size / validate shape:** reject frames over a few KB and validate \`content\` against a schema before acting; never \`group_send\` raw client input straight through.
- **Don't leak via groups:** never put a user in a group they should not receive from; group names derived from IDs must be checked against permissions, not just parsed from the path.`,

    contentHi: `## Consumers testing

**\`WebsocketCommunicator\`** DRF ke \`APIClient\` ka consumer samतुल्य hai — ye ek consumer ko in-process drive karता hai, koi browser nahi, koi running server nahi, koi network nahi. Aap ise ASGI application (ya \`.as_asgi()\` ke through ek single consumer) aur ek path dete ho, phir:

- \`await comm.connect()\` \`(accepted, code)\` return karता hai — \`accept()\` par \`(True, None)\`, \`close(code=4001)\` par \`(False, 4001)\`.
- \`await comm.send_json_to(obj)\` / \`send_to(text_data=...)\` — ek client frame bhejो.
- \`await comm.receive_json_from()\` / \`receive_from()\` — agla server frame padhो; **koi na aane par \`asyncio.TimeoutError\` raise karता hai**, to ye ek assertion ka double kaam karता hai ki *kuch* bheja gaya.
- \`await comm.receive_nothing(timeout=0.1)\` — \`True\` return karता hai agar consumer ne kuch nahi bheja.
- \`await comm.disconnect()\` — \`disconnect\` trigger karता hai.

Broadcasting test karne ke liye, do communicators kholो, ek par bhejो, assert karो doosra receive karता hai. Test setup:

- **pytest:** \`pytest-asyncio\`, aur tests ko \`@pytest.mark.asyncio\` mark karो.
- **Channel layer:** test settings mein \`CHANNEL_LAYERS\` ko \`InMemoryChannelLayer\` override karो — deterministic, koi Redis nahi.
- **Database:** ek consumer jо likhता hai use \`@pytest.mark.django_db(transaction=True)\` chahिए kyunki \`database_sync_to_async\` ek thread mein chalता hai aur asli commits dikhने chahिए.
- **Routing:** middleware stack (auth, origin) bhi exercise karne ke liye \`asgi.py\` se apna asli \`application\` import karो.

**\`ChannelsLiveServerTestCase\`** ek asli Daphne server spin up karता hai aur ek real browser driver ke saath end-to-end tests ke liye hai — slower, critical happy path ke liye kam istemal karो.

## Ek ASGI application deploy karना

WSGI servers (\`gunicorn myproject.wsgi\`) **WebSocket serve nahi kar sakte**. Aapको ek **ASGI server** chahिए:

- **Daphne** — Channels reference server.
- **Uvicorn** — fast, widely used.
- **Gunicorn + Uvicorn worker** — \`gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4\`.

Ek aam production shape: har cheez ke liye ASGI server chalाओ, ya **HTTP ke liye WSGI (Gunicorn) aur sirf \`/ws/\` ke liye ASGI (Daphne)**, nginx \`/ws/\` ko Daphne par route karता hua.

**nginx ko upgrade ke baare mein batाया jाना chahिए:**

\`\`\`nginx
location /ws/ {
    proxy_pass http://asgi_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;      # default 60s idle sockets drop karega
}
\`\`\`

Load balancers ko ek long idle timeout chahिए, aur **sticky sessions zaroori nahi** agar channel layer Redis hai. Periodic pings bhejो.

## Channel layer scaling

- **Redis correctness ke liye ek hard dependency hai**, sirf performance nahi.
- **Capacity:** *N* members ko \`group_send\` *N* Redis operations hai. Apna worst case model karो: (prati group subscribers) × (prati second messages) × (groups).
- **Message size:** \`channels_redis\` ~1 MB par cap karता hai. IDs aur deltas broadcast karो.
- **Redis failure:** agar Redis down hai, \`group_send\` raise karता hai. Ek broadcast jо ek safal HTTP write ke baad aata hai use us 200 ko 500 mein nahi badalना chahिए — broadcast ko \`try/except\` mein wrap karो.
- **Alag Redis logical DBs** cache vs channel layer vs Celery broker ke liye.
- **Connection limits:** har ASGI worker apni sockets ke liye file descriptors rakhता hai; \`ulimit -n\` badhाओ.

## WebSocket vs SSE vs polling

Zaroorat ko poora karne waali **sabse kam** machinery ke liye pahunचो:

| zaroorat | transport | kyun |
|---|---|---|
| Two-way, low latency (chat, collaborative editing, games) | **WebSocket** (Channels) | true bidirectional realtime ke liye ekmatra option |
| Server -> client sirf, text (notifications, ek live log, progress, ek price feed) | **Server-Sent Events** | one-way; plain HTTP par chalता hai; browser \`EventSource\` **auto-reconnect** karता hai; ek single stream ke liye koi channel layer nahi chahिए |
| Data har kuch minute badalता hai; "eventually" theek hai | **polling** ek JSON endpoint | zero persistent connections, zero new infra, ek \`ETag\` steady state ko ek saste 304 banाता hai |
| Ek stream 10k-1M mostly-read viewers ko fanned | **cache se SSE** ya ek hosted pub/sub ya ek CDN | per-connection Redis fan-out mehnga ho jaता hai |

Django mein SSE ek \`async\` view hai jо ek \`StreamingHttpResponse\` return karता hai jо \`data: {...}\\n\\n\` lines yield karता hai. **One-way ke liye SSE default karो, WebSocket sirf jab client ko baar-baar wapas baat karना ho.**

## Standard patterns

- **Chat / rooms:** prati room ek group; \`connect\` membership validate karता hai phir \`group_add\`; \`receive_json\` message persist karता hai phir \`group_send\`.
- **Per-user notifications:** prati user ek group (\`user_{id}\`), har tab dwara joined. App mein kuch bhi \`transaction.on_commit\` ke baad \`async_to_sync(layer.group_send)(f"user_{id}", {...})\` karता hai.
- **Live dashboard:** ek group (\`dashboard\`). Ek Celery **beat** task snapshot ko ek fixed interval par compute karके \`group_send\` karता hai — consumers prati-client kaam nahi karते.

## Consumers ke liye security controls

- **Origin check:** WebSocket branch ko \`AllowedHostsOriginValidator\` mein wrap karो. Ek browser cross-site WebSocket handshake ke saath user ki cookies bhejता hai, to iske bina ek attacker ka page aapke server ko ek authenticated socket khol sakta hai.
- **\`connect\` mein authenticate karो:** cookie sessions ke liye \`AuthMiddlewareStack\`; token clients ke liye ek short-lived query-string **ticket** + tiny middleware. \`close(code=...)\` se reject karो.
- **Har action authorize karो:** \`connect\` check karता hai user *is* room mein join kar sakta hai; \`receive_json\` re-check karता hai user *is* message ko post kar sakta hai.
- **Prati connection rate-limit karो:** \`self\` par timestamps track karो aur ek client jо prati second sैkड़ों frames bhejता hai use drop ya \`close\` karो.
- **Message size cap karो / shape validate karो:** kuch KB se bade frames reject karो. Kabhi raw client input ko seedhे \`group_send\` mat karो.`,

    examples: [
      {
        title: 'A pytest-style consumer test: two communicators, assert a broadcast lands',
        titleHi: 'Ek pytest-style consumer test: do communicators, assert ek broadcast land hota hai',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.group = "room_1"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()
    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.group,
            {"type": "chat.message", "text": content["text"]})
    async def chat_message(self, event):
        await self.send_json({"text": event["text"]})
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

async def test_broadcast():          # body of what would be an @pytest.mark.asyncio test
    a = WebsocketCommunicator(RoomConsumer.as_asgi(), "/ws/room/1/")
    b = WebsocketCommunicator(RoomConsumer.as_asgi(), "/ws/room/1/")
    assert (await a.connect())[0] is True
    assert (await b.connect())[0] is True

    await a.send_json_to({"text": "ping"})
    assert (await b.receive_json_from())["text"] == "ping"
    assert await a.receive_nothing(timeout=0.1) is False   # a also hears its own broadcast

    await a.disconnect(); await b.disconnect()
    print("test_broadcast: PASS")

asyncio.run(test_broadcast())`,
        output: `test_broadcast: PASS`,
        explain: 'This is the shape of a real `@pytest.mark.asyncio` test: two communicators join room 1, one sends, and the assertion is that the *other* one receives the broadcast. The extra check -- `receive_nothing` is `False` for the sender -- documents that `group_send` reaches every member including the originator, which is why chat UIs usually render their own messages from the echoed broadcast rather than optimistically.',
        explainHi: 'Ye ek asli `@pytest.mark.asyncio` test ka shape hai: do communicators room 1 join karते hain, ek bhejता hai, aur assertion ye hai ki *doosra* broadcast receive karता hai. Extra check -- sender ke liye `receive_nothing` `False` hai -- document karता hai ki `group_send` originator samet har member tak pahunchता hai, isiliye chat UIs aam taur par apne messages ko echoed broadcast se render karते hain.',
      },
      {
        title: 'Origin/auth rejection is testable: connect() returns (False, code)',
        titleHi: 'Origin/auth rejection testable hai: connect() (False, code) return karta hai',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator

class SecureConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # stand-in for: self.scope["user"].is_authenticated and can_join(user, room)
        qs = self.scope["query_string"].decode()
        if "ticket=valid" not in qs:
            await self.close(code=4401)      # unauthenticated
            return
        await self.accept()
        await self.send_json({"ok": True})

async def main():
    good = WebsocketCommunicator(SecureConsumer.as_asgi(), "/ws/?ticket=valid")
    bad  = WebsocketCommunicator(SecureConsumer.as_asgi(), "/ws/?ticket=forged")
    print("good:", await good.connect(), "->", await good.receive_json_from())
    print("bad: ", await bad.connect())
    await good.disconnect()

asyncio.run(main())`,
        output: `good: (True, None) -> {'ok': True}
bad:  (False, 4401)`,
        explain: 'The consumer reads the ticket from `scope["query_string"]` (the only place a browser `WebSocket` can carry a credential, since it cannot set headers) and rejects with `close(code=4401)` when it is missing or wrong. The test asserts on the `connect()` tuple: `(True, None)` for the valid ticket, `(False, 4401)` for the forged one -- auth is fully testable without a browser.',
        explainHi: 'Consumer ticket ko `scope["query_string"]` se padhता hai (ekmatra jagah jahaan ek browser `WebSocket` ek credential le ja sakta hai, kyunki ye headers set nahi kar sakta) aur ise missing ya galat hone par `close(code=4401)` se reject karता hai. Test `connect()` tuple par assert karता hai: valid ticket ke liye `(True, None)`, forged ke liye `(False, 4401)` -- auth bina ek browser ke poori tarah testable hai.',
      },
      {
        title: 'Per-connection rate limiting: the consumer drops a client that floods it',
        titleHi: 'Prati-connection rate limiting: consumer ek client ko drop karta hai jo ise flood karta hai',
        code: `import asyncio, time, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator

class ThrottledConsumer(AsyncJsonWebsocketConsumer):
    MAX_PER_WINDOW = 3
    async def connect(self):
        self.hits = []
        await self.accept()
    async def receive_json(self, content, **kwargs):
        now = time.monotonic()
        self.hits = [t for t in self.hits if now - t < 1.0]   # 1-second window
        self.hits.append(now)
        if len(self.hits) > self.MAX_PER_WINDOW:
            await self.close(code=4029)                        # "too many requests"
            return
        await self.send_json({"n": len(self.hits)})

async def main():
    c = WebsocketCommunicator(ThrottledConsumer.as_asgi(), "/ws/")
    await c.connect()
    for i in range(5):
        await c.send_json_to({})
    for i in range(3):
        print("frame:", await c.receive_json_from())
    print("closed after flood:", await c.receive_output(timeout=0.2))

asyncio.run(main())`,
        output: `frame: {'n': 1}
frame: {'n': 2}
frame: {'n': 3}
closed after flood: {'type': 'websocket.close', 'code': 4029}`,
        explain: "The consumer keeps message timestamps on `self` and trims them to a 1-second window on each frame. The first three frames are within the limit and get a reply; the fourth pushes the count over `MAX_PER_WINDOW`, so the consumer calls `close(code=4029)`. `receive_output` shows the raw ASGI event -- `{'type': 'websocket.close', 'code': 4029}` -- proving one abusive socket is cut off before it can flood a group.",
        explainHi: "Consumer message timestamps ko `self` par rakhता hai aur unhe har frame par ek 1-second window mein trim karता hai. Pehle teen frames limit ke andar hain aur ek reply paate hain; chautha count ko `MAX_PER_WINDOW` ke upar dhakelता hai, to consumer `close(code=4029)` call karता hai. `receive_output` raw ASGI event dikhाता hai -- `{'type': 'websocket.close', 'code': 4029}` -- saabit karके ki ek abusive socket ek group ko flood karne se pehle kaat diya jaता hai.",
      },
    ],

    mistakes: [
      {
        wrong: `# deploy config unchanged from the WSGI days
web:  gunicorn myproject.wsgi:application
# WebSocket clients get HTTP 400 / "Upgrade Required" -- gunicorn's sync
# workers cannot speak the WebSocket protocol at all`,
        right: `# run an ASGI server (all traffic):
web:  gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4
# or keep WSGI for HTTP and add ASGI just for /ws/, with nginx routing /ws/ -> daphne
ws:   daphne -b 0.0.0.0 -p 8001 myproject.asgi:application`,
        why: 'A WSGI server has no representation for a connection that outlives a single request-response, so it literally cannot perform the WebSocket upgrade handshake — the client gets a 400 or 426 and the socket never opens. Channels works only behind an ASGI server: Daphne, Uvicorn, or Gunicorn with the Uvicorn worker class. You either move all traffic to the ASGI server, or run both and have the proxy send /ws/ to the ASGI process and everything else to the WSGI process. Whichever you choose, asgi.py (not wsgi.py) must be the entrypoint for WebSocket, and ASGI_APPLICATION must point at it.',
        whyHi: 'Ek WSGI server ke paas ek connection ka koi representation nahi hai jо ek single request-response se aage jeeता hai, to ye literally WebSocket upgrade handshake nahi kar sakta — client ko ek 400 ya 426 milता hai aur socket kabhi nahi khulта. Channels sirf ek ASGI server ke peeche kaam karता hai: Daphne, Uvicorn, ya Uvicorn worker class ke saath Gunicorn. Aap ya to sारा traffic ASGI server par le jaते ho, ya dono chalाते ho aur proxy \`/ws/\` ko ASGI process par bhejता hai.',
      },
      {
        wrong: `location / {
    proxy_pass http://127.0.0.1:8001;
    # no Upgrade/Connection headers, default 60s proxy_read_timeout
}
# handshake sometimes works, then every socket dies at exactly 60 seconds idle`,
        right: `location /ws/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
# plus: raise the load balancer idle timeout, and send app-level pings`,
        why: 'The WebSocket handshake is an HTTP request with Upgrade: websocket and Connection: Upgrade headers. A proxy that does not forward those (and does not use HTTP/1.1 upstream) turns the handshake back into a plain request and the upgrade fails. Even when the handshake succeeds, proxies and load balancers close connections they consider idle — nginx defaults to 60 seconds, AWS ALB to 60 seconds — so a chat that is quiet for a minute silently drops every user. Fix both: forward the upgrade headers with proxy_http_version 1.1, raise the read/send timeouts well above your expected quiet periods, raise the LB idle timeout, and send a heartbeat frame every 20-30 seconds so intermediaries never see the connection as idle.',
        whyHi: 'WebSocket handshake ek HTTP request hai Upgrade: websocket aur Connection: Upgrade headers ke saath. Ek proxy jо unhe forward nahi karता handshake ko wapas ek plain request mein badal deता hai aur upgrade fail hota hai. Jab handshake safal bhi hoता hai, proxies aur load balancers un connections ko band karते hain jinhe wo idle maanते hain — nginx default 60 seconds — to ek chat jо ek minute ke liye shaant hai chupchaap har user ko drop karता hai. Dono theek karो: upgrade headers forward karो, timeouts badhाओ, aur har 20-30 seconds ek heartbeat frame bhejो.',
      },
      {
        wrong: `# team decides "we need realtime" -> builds a full Channels + Redis stack
# for a feature that shows an unread-count badge that changes a few times an hour`,
        right: `# an unread badge that changes rarely: poll a tiny endpoint
setInterval(() => fetch("/api/unread/").then(r => r.json()).then(update), 60000)
# GET /api/unread/  ->  {"count": 3}  with an ETag; steady state is a 304
# reserve Channels for chat / live editing / anything genuinely two-way + low-latency`,
        why: 'WebSocket via Channels brings real operational weight: an ASGI server, a Redis channel layer as a correctness dependency, proxy and load-balancer tuning, connection-count capacity planning, and a new class of tests. That is worth it for chat, collaborative editing, or a high-frequency live feed. It is not worth it for data that changes a few times an hour and where a minute of staleness is fine — a 60-second poll of a cached JSON endpoint with an ETag costs almost nothing and needs zero new infrastructure. For one-way server-to-client streams that do need immediacy (a progress bar, a notification toast), Server-Sent Events sit in between: they run over normal HTTP, the browser reconnects automatically, and you skip most of the WebSocket operational surface.',
        whyHi: 'Channels ke through WebSocket asli operational weight lाता hai: ek ASGI server, ek correctness dependency ke roop mein ek Redis channel layer, proxy aur load-balancer tuning, connection-count capacity planning, aur tests ka ek naya class. Wo chat, collaborative editing ke liye iske layak hai. Ye us data ke liye iske layak nahi hai jо ek ghante mein kuch baar badalता hai — ek cached JSON endpoint ka ek 60-second poll ek ETag ke saath lगbhag kuch nahi kharch karता. One-way server-to-client streams ke liye jinhe immediacy chahिए, Server-Sent Events beech mein baithते hain.',
      },
    ],

    realWorld: [
      {
        en: '**A CI test suite where every consumer has `WebsocketCommunicator` tests against the real `asgi.application`** — connect accepted/rejected, a broadcast reaching a second client, an unauthorized action closing the socket — with `CHANNEL_LAYERS` overridden to `InMemoryChannelLayer` and `django_db(transaction=True)` for the ones that persist.',
        hi: '**Ek CI test suite jahaan har consumer ke asli `asgi.application` ke against `WebsocketCommunicator` tests hain** — `CHANNEL_LAYERS` ko `InMemoryChannelLayer` override kiya aur persist karne waalon ke liye `django_db(transaction=True)`.',
      },
      {
        en: '**nginx routing `/ws/` to a Daphne upstream with `proxy_read_timeout 3600s` and the upgrade headers, everything else to Gunicorn** — plus a 25-second client ping and the ALB idle timeout raised to 300 s, so idle chat rooms survive.',
        hi: '**nginx `/ws/` ko ek Daphne upstream par route karता hua `proxy_read_timeout 3600s` aur upgrade headers ke saath, baaki sab Gunicorn ko** — plus ek 25-second client ping.',
      },
      {
        en: '**A notification feature that started as SSE** (`EventSource` on `/stream/notifications/`, an async view that `group_send`s into the stream) — one-way, auto-reconnecting, no client-to-server channel needed — and only moved to WebSocket when read-receipts made it genuinely two-way.',
        hi: '**Ek notification feature jо SSE ke roop mein shuru hua** (`/stream/notifications/` par `EventSource`) — one-way, auto-reconnecting — aur sirf tab WebSocket par gaya jab read-receipts ne ise genuinely two-way banाya.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you test a Channels consumer, and what deployment changes does adding Channels require?',
        qHi: 'Aap ek Channels consumer kaise test karते ho, aur Channels joडने se kya deployment changes chahिए?',
        a: 'You test consumers with WebsocketCommunicator from channels dot testing, which is the WebSocket analogue of DRF\'s APIClient: it drives a consumer in-process with no browser, server, or network. You construct it with the ASGI application or a single consumer and a path, then await connect, which returns a tuple of accepted-boolean and close-code; await send_json_to to send a client frame; await receive_json_from to read the next server frame, which raises on timeout so it also asserts that something was sent; await receive_nothing to assert the client got nothing; and await disconnect. To test a broadcast you open two communicators, send on one, and assert the other receives. Setup: pytest-asyncio with the async marker, CHANNEL_LAYERS overridden to InMemoryChannelLayer for determinism, and django_db with transaction True for consumers that write, because database_sync_to_async runs in a thread and needs real commits to be visible. Importing the real application from asgi.py also exercises the auth and origin middleware. On deployment: a WSGI server cannot do WebSocket at all, so you need an ASGI server — Daphne, Uvicorn, or Gunicorn with the Uvicorn worker — either for all traffic or just for the ws path with the proxy splitting them. The reverse proxy must forward the Upgrade and Connection headers over HTTP 1.1 and have its read timeout raised well above 60 seconds, and the load balancer idle timeout too, with app-level pings to keep intermediaries from dropping idle sockets. And the channel layer must be Redis-backed, because with more than one process the in-memory layer silently loses cross-worker messages; that Redis is now a correctness dependency, so broadcasts should be wrapped so a Redis blip does not turn a successful write into a 500.',
        aHi: 'Aap consumers ko channels dot testing se WebsocketCommunicator se test karते ho, jо DRF ke APIClient ka WebSocket analogue hai: ye ek consumer ko in-process drive karता hai bina browser, server, ya network ke. Aap ise ASGI application ya ek single consumer aur ek path ke saath construct karते ho, phir connect await karते ho, jо accepted-boolean aur close-code ka ek tuple return karता hai; send_json_to; receive_json_from jо timeout par raise karता hai; receive_nothing; aur disconnect. Ek broadcast test karne ke liye do communicators kholो. Setup: pytest-asyncio, CHANNEL_LAYERS ko InMemoryChannelLayer override, aur likhne waale consumers ke liye django_db transaction True. Deployment par: ek WSGI server WebSocket bilkul nahi kar sakta, to aapको ek ASGI server chahिए. Reverse proxy ko Upgrade aur Connection headers forward karना chahिए aur iska read timeout badhाya. Aur channel layer Redis-backed hona chahिए.',
      },
      {
        q: 'WebSocket, SSE, or polling — how do you choose, and what does SSE give you that WebSocket does not?',
        qHi: 'WebSocket, SSE, ya polling — aap kaise chunते ho, aur SSE aapको kya deता hai jо WebSocket nahi?',
        a: 'Pick the least infrastructure that meets the requirement. If the client and server both need to send messages with low latency — chat, collaborative editing, multiplayer, live cursors — you need a WebSocket, and Channels is how you do that in Django. If the flow is server-to-client only — notifications, a live log, a progress indicator, a price feed, "someone just commented" — Server-Sent Events are usually the better fit: they run over ordinary HTTP with no upgrade, they are far less code, and crucially the browser\'s EventSource reconnects automatically when the connection drops, which with raw WebSocket you have to build yourself. You can still push into an SSE stream from the rest of the app the same way, via the channel layer, if you want. If the data only changes every few minutes and a little staleness is acceptable — a dashboard tile, an unread badge, a status — then just poll a JSON endpoint on an interval; add an ETag and the steady state is a cheap 304, and you have added zero persistent connections and zero new infrastructure. The one case where you go the other way is very large fan-out of a mostly-read stream, tens of thousands of viewers on one feed: per-connection Redis fan-out gets expensive, and a cached SSE stream or a hosted pub/sub service scales better than either DIY option. So: WebSocket when it must be two-way, SSE for one-way push, polling when "eventually" is fine.',
        aHi: 'Zaroorat ko poora karne waali sabse kam infrastructure chunо. Agar client aur server dono ko low latency ke saath messages bhejने chahिए — chat, collaborative editing, multiplayer — aapको ek WebSocket chahिए, aur Channels wo hai jaise aap Django mein wo karते ho. Agar flow server-to-client sirf hai — notifications, ek live log, ek progress indicator — Server-Sent Events aam taur par behtar fit hain: wo ordinary HTTP par chalते hain bina upgrade ke, wo bahut kam code hain, aur mahatvapoorna roop se browser ka EventSource automatically reconnect karता hai jab connection drop hoता hai, jо raw WebSocket ke saath aapको khud banाना padता hai. Agar data sirf har kuch minute badalता hai — ek dashboard tile, ek unread badge — to bस ek JSON endpoint ko ek interval par poll karो; ek ETag add karो aur steady state ek saste 304 hai. Ek case jahaan aap doosri taraf jaते ho wo ek mostly-read stream ka bahut bada fan-out hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a consumer test the pytest way (run the coroutine with `asyncio.run` to simulate). Consumer: joins group `"g"`, `receive_json` -> `group_send({"type": "e.msg", "v": content["v"]})`, handler `e_msg` -> `send_json({"v": event["v"]})`. Open two `WebsocketCommunicator`s, send `{"v": 42}` on one, assert BOTH receive `{"v": 42}` and then both are idle (`receive_nothing` -> True).',
        taskHi: 'Ek consumer test pytest tareeke se likho. Consumer `"g"` join karता hai, `receive_json` -> `group_send`, handler `e_msg`. Do `WebsocketCommunicator`s kholो, ek par `{"v": 42}` bhejो, assert DONO receive karte hain aur phir dono idle hain.',
        hint: '`e.msg` -> method `e_msg`. `(await comm.connect())[0]` is the accepted bool. After reading the one expected frame, `await comm.receive_nothing()` should be True.',
        hintHi: '`e.msg` -> method `e_msg`. `(await comm.connect())[0]` accepted bool hai. Ek expected frame padhने ke baad, `receive_nothing()` True hona chahिए.',
      },
      {
        task: 'Model the transport decision as a function. Write `choose_transport(two_way: bool, changes_per_minute: float, viewers: int) -> str` returning `"websocket"` if `two_way`, else `"polling"` if `changes_per_minute < 0.5`, else `"sse-from-cache"` if `viewers > 10000`, else `"sse"`. Assert: chat editor `(True, 30, 5)` -> websocket; status badge `(False, 0.1, 50)` -> polling; notifications `(False, 4, 200)` -> sse; public results `(False, 20, 80000)` -> sse-from-cache.',
        taskHi: 'Transport decision ko ek function ke roop mein model karो. `choose_transport(two_way, changes_per_minute, viewers) -> str` likho. Assert 4 cases.',
        hint: 'Just an if/elif ladder in the stated order. This is the mental checklist from the lesson turned into code.',
        hintHi: 'Bस bताye order mein ek if/elif ladder. Ye lesson ka mental checklist code mein badal gaya.',
      },
      {
        task: 'Test an auth ticket. Consumer `connect`: decode `self.scope["query_string"]`, accept only if it contains `token=` followed by a value present in a module-level `VALID = {"abc", "def"}` set, else `close(code=4401)`. Assert `/ws/?token=abc` connects, `/ws/?token=zzz` gives `(False, 4401)`, and `/ws/` (no token) gives `(False, 4401)`.',
        taskHi: 'Ek auth ticket test karो. Consumer `connect`: `self.scope["query_string"]` decode karो, sirf tab accept karो jab `token=` ke baad ek value ho jо ek `VALID` set mein hai. Assert 3 cases.',
        hint: '`self.scope["query_string"]` is raw `bytes` -> `.decode()`. `urllib.parse.parse_qs` splits it, or a simple substring check works for the test.',
        hintHi: '`self.scope["query_string"]` raw `bytes` hai -> `.decode()`. `urllib.parse.parse_qs` ise split karता hai.',
      },
    ],

    keyTakeaways: [
      '`WebsocketCommunicator` = the consumer\'s `APIClient`: in-process, no browser/server/network. `await comm.connect()` -> `(accepted, code)`; `send_json_to`/`send_to`; `receive_json_from`/`receive_from` (RAISES `TimeoutError` if nothing -> doubles as "something was sent"); `receive_nothing(timeout)` -> asserts NOTHING was sent; `disconnect()`. Two communicators = test a broadcast.',
      'Test setup: `pytest-asyncio` + `@pytest.mark.asyncio`; override `CHANNEL_LAYERS` -> `InMemoryChannelLayer`; `@pytest.mark.django_db(transaction=True)` for consumers that write (`database_sync_to_async` runs in a THREAD, needs real commits visible). Import the real `asgi.application` to also test auth/origin middleware. `ChannelsLiveServerTestCase` = real Daphne + browser driver, use sparingly.',
      'A WSGI server (`gunicorn wsgi:application`) CANNOT serve WebSocket at all (client gets 400/426). Need an ASGI server: Daphne, Uvicorn, or `gunicorn asgi:application -k uvicorn.workers.UvicornWorker -w 4`. Either all traffic on ASGI, or WSGI for HTTP + ASGI just for `/ws/` with the proxy splitting.',
      'The proxy MUST forward the upgrade: `proxy_http_version 1.1` + `proxy_set_header Upgrade $http_upgrade` + `Connection "upgrade"`. AND raise `proxy_read_timeout`/`proxy_send_timeout` far above 60s (+ LB idle timeout) + app-level pings every ~25s — otherwise idle sockets die at 60s. Sticky sessions NOT needed with a Redis channel layer.',
      'The channel layer is now CORRECTNESS infra: `RedisChannelLayer` mandatory with >1 process. Capacity = (subscribers/group) x (msgs/s) x (groups) Redis ops. Message cap ~1MB. Redis down -> `group_send` raises -> WRAP broadcasts so a realtime blip != a 500 on the HTTP write. Separate Redis DBs for cache / channel layer / Celery.',
      'TRANSPORT CHOICE — least machinery that works: two-way + low-latency (chat, editing, games) -> WebSocket. Server->client only (notifications, logs, progress, price feed) -> SSE (plain HTTP, `EventSource` AUTO-RECONNECTS, far less code; can still `group_send` into it). Changes every few min, staleness OK -> POLL a JSON endpoint + ETag (zero infra). Huge mostly-read fan-out -> SSE-from-cache / hosted pub-sub.',
      'PATTERNS: chat = one group per room, validate membership in `connect`, persist then `group_send` in `receive_json`. Per-user notifications = `user_{id}` group joined by every tab, `async_to_sync(layer.group_send)` after `transaction.on_commit` from anywhere. Live dashboard = one `dashboard` group, a Celery BEAT task computes the snapshot and `group_send`s it (viewers add zero query load).',
      'CONSUMER SECURITY: `AllowedHostsOriginValidator` around the WS branch (browser sends cookies with cross-site WS handshakes -> hijacking risk). Authenticate in `connect` (`AuthMiddlewareStack` or a short-lived query-string ticket + middleware), `close(code=)` to reject. AUTHORIZE every action (`connect` = may join this room; `receive_json` = may post this). Rate-limit per connection (timestamps on `self`). Cap frame size + validate shape; never `group_send` raw client input.',
    ],
    keyTakeawaysHi: [
      '`WebsocketCommunicator` = consumer ka `APIClient`: in-process, koi browser/server/network nahi. `connect()` -> `(accepted, code)`; `send_json_to`; `receive_json_from` (kuch nahi to `TimeoutError` RAISE); `receive_nothing(timeout)` -> assert KUCH nahi bheja; `disconnect()`. Do communicators = ek broadcast test.',
      'Test setup: `pytest-asyncio` + `@pytest.mark.asyncio`; `CHANNEL_LAYERS` -> `InMemoryChannelLayer` override; likhne waale consumers ke liye `django_db(transaction=True)` (`database_sync_to_async` ek THREAD mein chalता hai). Asli `asgi.application` import karके auth/origin middleware bhi test karो.',
      'Ek WSGI server WebSocket bilkul serve NAHI kar sakta (client ko 400/426). Ek ASGI server chahिए: Daphne, Uvicorn, ya `gunicorn asgi:application -k uvicorn.workers.UvicornWorker`. Ya sारा traffic ASGI par, ya HTTP ke liye WSGI + sirf `/ws/` ke liye ASGI.',
      'Proxy ko upgrade forward karना CHAHIYE: `proxy_http_version 1.1` + `Upgrade`/`Connection` headers. AUR `proxy_read_timeout` ko 60s se bahut upar badhाओ (+ LB idle timeout) + ~25s par app pings — warna idle sockets 60s par marte hain. Redis channel layer ke saath sticky sessions ZAROORI nahi.',
      'Channel layer ab CORRECTNESS infra hai: `RedisChannelLayer` >1 process ke saath anivारya. Capacity = (subscribers/group) x (msgs/s) x (groups) Redis ops. Message cap ~1MB. Redis down -> `group_send` raise -> broadcasts WRAP karो. Cache / channel layer / Celery ke liye alag Redis DBs.',
      'TRANSPORT CHOICE: two-way + low-latency -> WebSocket. Server->client sirf -> SSE (plain HTTP, `EventSource` AUTO-RECONNECT, bahut kam code). Har kuch min badalता hai, staleness OK -> ek JSON endpoint POLL karो + ETag. Bada mostly-read fan-out -> SSE-from-cache / hosted pub-sub.',
      'PATTERNS: chat = prati room ek group, `connect` mein membership validate, `receive_json` mein persist phir `group_send`. Per-user notifications = `user_{id}` group har tab dwara joined. Live dashboard = ek `dashboard` group, ek Celery BEAT task snapshot compute karके `group_send` karता hai.',
      'CONSUMER SECURITY: WS branch ke aas-paas `AllowedHostsOriginValidator`. `connect` mein authenticate karो, `close(code=)` se reject. Har action AUTHORIZE karो. Prati connection rate-limit karो. Frame size cap + shape validate; kabhi raw client input `group_send` mat karो.',
    ],
  },
];
