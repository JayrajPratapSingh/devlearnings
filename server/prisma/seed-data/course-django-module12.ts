/**
 * Django Complete Course — Module 12: Realtime with Channels, lessons 1-2.
 *
 * Lesson 1: ASGI & consumers — sync WSGI vs async ASGI, ProtocolTypeRouter / URLRouter,
 *           WebsocketConsumer vs AsyncWebsocketConsumer vs AsyncJsonWebsocketConsumer,
 *           connect/receive/disconnect, the scope, accepting vs rejecting, path kwargs,
 *           AuthMiddlewareStack and scope["user"], database_sync_to_async.
 * Lesson 2: groups & channel layers — the channel layer, InMemory vs Redis, channel_name,
 *           group_add / group_discard / group_send, the type->handler-method dispatch,
 *           broadcasting from a view or Celery task via get_channel_layer + async_to_sync,
 *           presence, and the cost model.
 *
 * Verified against Channels 4.3.2 / Django 6.1 with channels.testing.WebsocketCommunicator
 * and channels.layers.InMemoryChannelLayer (see ch_probe.py / ch_probe2.py).
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_12: CourseLesson[] = [
  {
    slug: 'dj-channels-asgi-and-consumers',
    title: 'Channels: ASGI, Routing & Consumers',
    titleHi: 'Channels: ASGI, Routing Aur Consumers',
    description: 'A normal Django view answers one HTTP request and is done. A WebSocket stays open for minutes or hours, pushing messages both ways. Channels adds an ASGI layer where long-lived connections are handled by a **consumer** — an object with `connect`, `receive`, and `disconnect` methods — routed by URL just like views.',
    descriptionHi: 'Ek normal Django view ek HTTP request ka jawab deता hai aur khatm. Ek WebSocket minuton ya ghanton ke liye khula rehта hai, dono taraf messages push karता hai. Channels ek ASGI layer joडता hai jahaan long-lived connections ek **consumer** dwara handle hote hain — `connect`, `receive`, aur `disconnect` methods waala ek object — views ki tarah URL se routed.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A phone call versus a letter.** A normal Django view is the postal service: a letter arrives (the request), a clerk reads it, writes one reply, seals it, sends it back (the response), and the exchange is over — WSGI, one request in, one response out, connection closed. A WebSocket is a phone call. Someone dials in; an operator decides whether to **accept** the call or hang up (`connect`); once connected the line stays open and either side can speak at any moment (`receive` for what the caller says, `self.send` for what you say back); and eventually someone hangs up (`disconnect`). You cannot run a phone switchboard on a postal worker who handles one letter and goes home — you need staff who can hold many open lines at once without blocking. That is **ASGI** and the **async consumer**: one worker juggling thousands of open calls, each represented by a small object that remembers who is on the line (the **scope**: the path they dialed, who they are, the room they asked for).',
      hi: '**Ek phone call bनाम ek letter.** Ek normal Django view postal service hai: ek letter aata hai (request), ek clerk ise padhता hai, ek reply likhता hai, seal karता hai, wapas bhejता hai (response), aur exchange khatm — WSGI, ek request andar, ek response bahar, connection closed. Ek WebSocket ek phone call hai. Koi dial karता hai; ek operator tय karता hai ki call **accept** kare ya hang up (`connect`); ek baar connected line khuli rehती hai aur koi bhi taraf kisi bhi pal bol sakti hai (`receive` jо caller kehta hai uske liye, `self.send` jо aap wapas kehte ho); aur aakhir mein koi hang up karता hai (`disconnect`). Aap ek phone switchboard ek postal worker par nahi chalा sakte jо ek letter handle karता hai aur ghar chala jaता hai — aapको staff chahिए jо ek saath kई khuli lines rok sake. Wo **ASGI** aur **async consumer** hai: ek worker hazaron khuli calls juggle karता hai, har ek ek chhote object dwara represented jо yाd rakhता hai kaun line par hai (**scope**: jо path unhone dial kiya, wo kaun hain, jо room unhone maanga).',
    },

    simple: `**WSGI (normal Django) vs ASGI (Channels)**

\`\`\`
WSGI:  HTTP request  ->  view function  ->  HTTP response          (then the connection closes)
ASGI:  the same for HTTP, PLUS long-lived protocols:
       WebSocket handshake  ->  consumer.connect()  ->  (stays open)
       client message       ->  consumer.receive()  ->  consumer.send() ... repeat
       socket closes        ->  consumer.disconnect()
\`\`\`

**The project wiring**

\`\`\`python
# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django_asgi_app = get_asgi_application()          # HTTP still handled by Django

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(       # reject cross-origin WS
        AuthMiddlewareStack(                          # -> scope["user"]
            URLRouter(chat.routing.websocket_urlpatterns)
        )
    ),
})
\`\`\`

\`\`\`python
# settings.py
ASGI_APPLICATION = "myproject.asgi.application"

# chat/routing.py
from django.urls import path
from . import consumers
websocket_urlpatterns = [
    path("ws/chat/<str:room>/", consumers.ChatConsumer.as_asgi()),
]
\`\`\`

**A consumer**

\`\`\`python
# chat/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]   # from the path
        user = self.scope["user"]                                # from AuthMiddlewareStack
        if not user.is_authenticated:
            await self.close(code=4001)                          # reject
            return
        await self.accept()                                      # accept the socket
        await self.send_json({"type": "system", "msg": f"welcome to {self.room}"})

    async def receive_json(self, content, **kwargs):             # a client message arrived
        await self.save_message(content["text"])
        await self.send_json({"type": "ack"})

    async def disconnect(self, code):                            # socket closed
        pass

    @database_sync_to_async                                      # ORM = sync -> wrap it
    def save_message(self, text):
        Message.objects.create(room=self.room, user=self.scope["user"], text=text)
\`\`\`

**The three consumer base classes**

\`\`\`
WebsocketConsumer          sync;  self.receive(text_data), self.send(text_data)
AsyncWebsocketConsumer     async; await self.receive(...), await self.send(text_data=...)
AsyncJsonWebsocketConsumer async; await self.receive_json(content), await self.send_json(obj)
\`\`\`
Prefer the async ones -- a WebSocket that blocks a worker on a slow query starves every other socket that worker holds.`,

    simpleHi: `**WSGI (normal Django) vs ASGI (Channels)**

\`\`\`
WSGI:  HTTP request  ->  view function  ->  HTTP response          (phir connection band)
ASGI:  HTTP ke liye wahi, PLUS long-lived protocols:
       WebSocket handshake  ->  consumer.connect()  ->  (khula rehта hai)
       client message       ->  consumer.receive()  ->  consumer.send() ... repeat
       socket band          ->  consumer.disconnect()
\`\`\`

**Project wiring**

\`\`\`python
# myproject/asgi.py
django_asgi_app = get_asgi_application()          # HTTP abhi bhi Django dwara handled

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(       # cross-origin WS reject karो
        AuthMiddlewareStack(                          # -> scope["user"]
            URLRouter(chat.routing.websocket_urlpatterns)
        )
    ),
})
\`\`\`

\`\`\`python
# settings.py
ASGI_APPLICATION = "myproject.asgi.application"

# chat/routing.py
websocket_urlpatterns = [
    path("ws/chat/<str:room>/", consumers.ChatConsumer.as_asgi()),
]
\`\`\`

**Ek consumer**

\`\`\`python
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]   # path se
        user = self.scope["user"]                                # AuthMiddlewareStack se
        if not user.is_authenticated:
            await self.close(code=4001)                          # reject
            return
        await self.accept()                                      # socket accept karो
        await self.send_json({"type": "system", "msg": f"welcome to {self.room}"})

    async def receive_json(self, content, **kwargs):             # ek client message aaya
        await self.save_message(content["text"])
        await self.send_json({"type": "ack"})

    async def disconnect(self, code):                            # socket band
        pass

    @database_sync_to_async                                      # ORM = sync -> wrap karो
    def save_message(self, text):
        Message.objects.create(room=self.room, user=self.scope["user"], text=text)
\`\`\`

**Teen consumer base classes**

\`\`\`
WebsocketConsumer          sync;  self.receive(text_data), self.send(text_data)
AsyncWebsocketConsumer     async; await self.receive(...), await self.send(text_data=...)
AsyncJsonWebsocketConsumer async; await self.receive_json(content), await self.send_json(obj)
\`\`\`
Async waale prefer karो -- ek WebSocket jо ek slow query par ek worker block karता hai us worker ki har doosri socket ko starve karता hai.`,

    content: `## WSGI is a dead end for realtime

The classic Django stack is **WSGI**: the server hands your app one HTTP request, your view returns one response, the connection closes. There is no way for the server to *push* anything to a browser later, and a view that "waits" for an event holds a worker hostage the whole time. Polling (\`setInterval(() => fetch('/updates'))\`) works but is wasteful and laggy.

**ASGI** is the async successor. It speaks HTTP *and* long-lived protocols — WebSocket, and Server-Sent Events — and it is built on \`async\`/\`await\` so one process can hold thousands of open connections, each parked on \`await\` until something happens. **Channels** is the library that gives Django an ASGI story: routing, consumers, authentication, and the channel layer (Lesson 2).

## The ASGI application and \`ProtocolTypeRouter\`

\`asgi.py\` builds one **ASGI application** — a callable the server (Daphne, Uvicorn) invokes for every connection. \`ProtocolTypeRouter\` is the top of the tree: it dispatches by protocol.

\`\`\`python
application = ProtocolTypeRouter({
    "http":      django_asgi_app,                # normal Django handles all HTTP
    "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(ws_patterns))),
})
\`\`\`

- **\`"http"\`** keeps going to \`get_asgi_application()\` — your views, DRF, admin, everything, unchanged.
- **\`"websocket"\`** goes through a **middleware stack** (origin check, auth) into a **\`URLRouter\`** that maps WebSocket paths to consumers, exactly like \`urls.py\` maps HTTP paths to views. Path converters work: \`path("ws/chat/<str:room>/", ...)\` puts \`room\` in \`scope["url_route"]["kwargs"]\`.

\`ASGI_APPLICATION = "myproject.asgi.application"\` in settings points \`runserver\` (and \`daphne\`) at it.

## The consumer lifecycle

A **consumer** is to a WebSocket what a view is to a request — except it lives for the whole connection and has multiple entry points. For \`AsyncJsonWebsocketConsumer\`:

1. **\`async def connect(self)\`** — the browser opened a socket. You inspect \`self.scope\`, then **must** call \`await self.accept()\` to complete the handshake, or \`await self.close(code=...)\` to reject. Not calling either leaves the socket hanging. This is where you join groups (Lesson 2).
2. **\`async def receive_json(self, content, **kwargs)\`** — the client sent a text frame; \`content\` is the parsed JSON. (\`AsyncWebsocketConsumer\` gives you \`receive(self, text_data=None, bytes_data=None)\` with the raw payload instead.)
3. **\`async def disconnect(self, code)\`** — the socket closed (client navigated away, network dropped, or you closed it). Leave groups, update presence. **Not guaranteed to run** on a hard crash — do not rely on it for critical cleanup.

To push to *this one* client, \`await self.send_json({...})\`. To push to *many* clients, you need the channel layer and groups — Lesson 2.

## The scope

\`self.scope\` is a dict describing the connection, filled in before \`connect\` by the middleware:

| key | from | contains |
|---|---|---|
| \`scope["type"]\` | protocol router | \`"websocket"\` |
| \`scope["path"]\` | the client | \`"/ws/chat/general/"\` |
| \`scope["url_route"]["kwargs"]\` | \`URLRouter\` | \`{"room": "general"}\` |
| \`scope["user"]\` | \`AuthMiddlewareStack\` | the \`User\` or \`AnonymousUser\` |
| \`scope["headers"]\` | the client | list of \`(name, value)\` byte tuples |
| \`scope["query_string"]\` | the client | raw bytes, e.g. \`b"token=abc"\` |
| \`scope["session"]\` | \`SessionMiddlewareStack\` | the session dict |

The scope is the consumer's *context* — it persists for the connection, so \`self.room = self.scope[...]["room"]\` in \`connect\` is available in every later \`receive_json\`.

## Authentication

**\`AuthMiddlewareStack\`** reads the session cookie sent with the WebSocket handshake and sets \`scope["user"]\`. Then in \`connect\`:

\`\`\`python
user = self.scope["user"]
if not user.is_authenticated:
    await self.close(code=4001)
    return
\`\`\`

Because a browser \`WebSocket\` cannot send \`Authorization\` headers, **token auth over WebSocket** is usually done by passing the token in the query string (\`ws://.../?token=...\`) and writing a small custom middleware that validates it and sets \`scope["user"]\` — never put a long-lived secret in a URL that gets logged; use a short-lived ticket. \`DRF\`'s token/JWT classes do not apply to consumers.

## The ORM is synchronous — \`database_sync_to_async\`

Consumer methods are \`async\`, but the Django ORM is sync. Calling \`Message.objects.create(...)\` directly from an async consumer raises \`SynchronousOnlyOperation\`. Wrap DB work:

\`\`\`python
from channels.db import database_sync_to_async

@database_sync_to_async
def save_message(self, text):
    return Message.objects.create(room=self.room, user=self.scope["user"], text=text)

# in the async method:
msg = await self.save_message(content["text"])
\`\`\`

\`database_sync_to_async\` runs the function in a thread pool **and** closes the DB connection afterwards so you do not leak connections per message. Keep these functions small and query-focused; do not put \`await\` logic inside them.

## Sync vs async consumers

\`WebsocketConsumer\` (sync) is simpler to write — no \`await\`, call the ORM directly — but every method call **blocks the event loop / worker** for its duration. One socket doing a 200 ms query freezes every other socket on that worker for 200 ms. \`AsyncWebsocketConsumer\` yields on every \`await\`, so thousands of mostly-idle sockets share one worker cheaply. For anything beyond a toy, **write async consumers** and wrap the unavoidable sync bits with \`database_sync_to_async\` / \`sync_to_async\`.`,

    contentHi: `## Realtime ke liye WSGI ek dead end hai

Classic Django stack **WSGI** hai: server aapke app ko ek HTTP request deता hai, aapका view ek response return karता hai, connection band. Server ke liye baad mein ek browser ko kuch *push* karne ka koi tareeka nahi hai. Polling kaam karता hai par wasteful aur laggy hai.

**ASGI** async successor hai. Ye HTTP *aur* long-lived protocols bolता hai — WebSocket, aur Server-Sent Events — aur ye \`async\`/\`await\` par bana hai to ek process hazaron khule connections rok sakta hai, har ek \`await\` par parked jab tak kuch na ho. **Channels** wo library hai jо Django ko ek ASGI story deती hai.

## ASGI application aur \`ProtocolTypeRouter\`

\`asgi.py\` ek **ASGI application** banाता hai — ek callable jise server (Daphne, Uvicorn) har connection ke liye invoke karता hai. \`ProtocolTypeRouter\` tree ka top hai: ye protocol se dispatch karता hai.

- **\`"http"\`** \`get_asgi_application()\` par jाता rehता hai — aapke views, DRF, admin, sab kuch, unchanged.
- **\`"websocket"\`** ek **middleware stack** (origin check, auth) se ek **\`URLRouter\`** mein jाता hai jо WebSocket paths ko consumers se map karता hai, bilkul jaise \`urls.py\` HTTP paths ko views se map karता hai. Path converters kaam karते hain: \`path("ws/chat/<str:room>/", ...)\` \`room\` ko \`scope["url_route"]["kwargs"]\` mein rakhता hai.

## Consumer lifecycle

Ek **consumer** ek WebSocket ke liye wahi hai jо ek view ek request ke liye — sivाy iske ki ye poore connection ke liye jeeता hai aur iske kई entry points hain. \`AsyncJsonWebsocketConsumer\` ke liye:

1. **\`async def connect(self)\`** — browser ne ek socket khola. Aap \`self.scope\` inspect karते ho, phir handshake poora karne ke liye \`await self.accept()\` call karना **zaroori** hai, ya reject karne ke liye \`await self.close(code=...)\`. Dono mein se koi nahi call karna socket ko latakता chhodता hai. Yahan aap groups join karते ho (Lesson 2).
2. **\`async def receive_json(self, content, **kwargs)\`** — client ne ek text frame bheja; \`content\` parsed JSON hai. (\`AsyncWebsocketConsumer\` aapको iske bजाy raw payload ke saath \`receive(self, text_data=None, bytes_data=None)\` deता hai.)
3. **\`async def disconnect(self, code)\`** — socket band hua. Groups chhodो, presence update karो. Ek hard crash par chalने ki **guarantee nahi** — critical cleanup ke liye ispar bharosa mat karो.

*Is ek* client ko push karne ke liye, \`await self.send_json({...})\`. *Kई* clients ko push karne ke liye, aapको channel layer aur groups chahिए — Lesson 2.

## Scope

\`self.scope\` connection ka varnन karने waala ek dict hai, \`connect\` se pehle middleware dwara bhara:

| key | se | contains |
|---|---|---|
| \`scope["path"]\` | client | \`"/ws/chat/general/"\` |
| \`scope["url_route"]["kwargs"]\` | \`URLRouter\` | \`{"room": "general"}\` |
| \`scope["user"]\` | \`AuthMiddlewareStack\` | \`User\` ya \`AnonymousUser\` |
| \`scope["query_string"]\` | client | raw bytes, e.g. \`b"token=abc"\` |
| \`scope["session"]\` | \`SessionMiddlewareStack\` | session dict |

Scope consumer ka *context* hai — ye connection ke liye persist karता hai, to \`connect\` mein \`self.room = self.scope[...]["room"]\` har baad ke \`receive_json\` mein available hai.

## Authentication

**\`AuthMiddlewareStack\`** WebSocket handshake ke saath bheja session cookie padhता hai aur \`scope["user"]\` set karता hai. Phir \`connect\` mein:

\`\`\`python
user = self.scope["user"]
if not user.is_authenticated:
    await self.close(code=4001)
    return
\`\`\`

Kyunki ek browser \`WebSocket\` \`Authorization\` headers nahi bhej sakta, **WebSocket par token auth** aksar token ko query string mein pass karके (\`ws://.../?token=...\`) aur ek chhota custom middleware likhकर kiya jaता hai jо ise validate karता hai aur \`scope["user"]\` set karता hai — ek URL mein jо log hota hai kabhi ek long-lived secret mat daalो; ek short-lived ticket istemal karो. DRF ke token/JWT classes consumers par lागू nahi hote.

## ORM synchronous hai — \`database_sync_to_async\`

Consumer methods \`async\` hain, par Django ORM sync hai. Ek async consumer se seedhे \`Message.objects.create(...)\` call karna \`SynchronousOnlyOperation\` raise karता hai. DB work wrap karो:

\`\`\`python
from channels.db import database_sync_to_async

@database_sync_to_async
def save_message(self, text):
    return Message.objects.create(room=self.room, user=self.scope["user"], text=text)

msg = await self.save_message(content["text"])
\`\`\`

\`database_sync_to_async\` function ko ek thread pool mein chalाता hai **aur** baad mein DB connection band karता hai taaki aap prati message connections leak na karो.

## Sync vs async consumers

\`WebsocketConsumer\` (sync) likhना aasान hai — koi \`await\` nahi, ORM seedhे call karो — par har method call apni duration ke liye **event loop / worker block karता hai**. Ek socket 200 ms query karता hua us worker ki har doosri socket ko 200 ms ke liye freeze karता hai. \`AsyncWebsocketConsumer\` har \`await\` par yield karता hai, to hazaron mostly-idle sockets ek worker saste mein share karते hain. Ek toy se aage kisi bhi cheez ke liye, **async consumers likhो** aur unavoidable sync bits ko \`database_sync_to_async\` se wrap karो.`,

    examples: [
      {
        title: 'The full consumer lifecycle: connect (accept), receive_json (echo), disconnect',
        titleHi: 'Poora consumer lifecycle: connect (accept), receive_json (echo), disconnect',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator

class EchoConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send_json({"type": "welcome", "msg": "connected"})

    async def receive_json(self, content, **kwargs):
        await self.send_json({"type": "echo", "you_sent": content})

    async def disconnect(self, code):
        pass

async def main():
    comm = WebsocketCommunicator(EchoConsumer.as_asgi(), "/ws/echo/")
    connected, subprotocol = await comm.connect()
    print("connected:", connected)
    print("first frame:", await comm.receive_json_from())
    await comm.send_json_to({"hi": "there"})
    print("echo reply:", await comm.receive_json_from())
    print("idle now?:", await comm.receive_nothing(timeout=0.1))
    await comm.disconnect()

asyncio.run(main())`,
        output: `connected: True
first frame: {'type': 'welcome', 'msg': 'connected'}
echo reply: {'type': 'echo', 'you_sent': {'hi': 'there'}}
idle now?: True`,
        explain: '`WebsocketCommunicator` drives the consumer with no browser or server. `connect()` returns `(True, None)` because the consumer called `accept()`; the consumer then pushed a `welcome` frame unprompted, which `receive_json_from()` reads. After the round-trip echo, `receive_nothing()` confirms the consumer is not sending anything on its own -- it only speaks when spoken to.',
        explainHi: '`WebsocketCommunicator` consumer ko bina browser ya server ke drive karता hai. `connect()` `(True, None)` return karता hai kyunki consumer ne `accept()` call kiya; consumer ne phir bina poochे ek `welcome` frame push kiya, jise `receive_json_from()` padhता hai. Round-trip echo ke baad, `receive_nothing()` confirm karता hai consumer khud kuch nahi bhej raha.',
      },
      {
        title: 'connect() can reject: close before accept -> the handshake fails',
        titleHi: 'connect() reject kar sakta hai: accept se pehle close -> handshake fail',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.testing import WebsocketCommunicator

class GuardedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # imagine: self.scope["user"] is AnonymousUser
        authenticated = False
        if not authenticated:
            await self.close(code=4001)     # reject with an app-specific code
            return
        await self.accept()

async def main():
    comm = WebsocketCommunicator(GuardedConsumer.as_asgi(), "/ws/guarded/")
    connected, close_code = await comm.connect()
    print("connected:", connected)
    print("close code:", close_code)

asyncio.run(main())`,
        output: `connected: False
close code: 4001`,
        explain: "The handshake only completes if `connect` calls `accept()`. Here it calls `close(code=4001)` instead, so `connect()` returns `(False, 4001)` -- the tuple is `(accepted, close_code)`. In a browser this surfaces as the `WebSocket` firing `onclose` with code 4001 and never `onopen`. Codes in the 4000-4999 range are yours to define for application-level reasons like 'not authenticated'.",
        explainHi: 'Handshake sirf tab poora hota hai jab `connect` `accept()` call karता hai. Yahan ye iske bजाy `close(code=4001)` call karता hai, to `connect()` `(False, 4001)` return karता hai -- tuple `(accepted, close_code)` hai. Ek browser mein ye `WebSocket` ke code 4001 ke saath `onclose` fire karne aur kabhi `onopen` nahi ke roop mein surface hota hai. 4000-4999 range ke codes application-level kaaranon ke liye aapke define karne ke liye hain.',
      },
      {
        title: 'URL kwargs land in the scope; database_sync_to_async wraps the ORM',
        titleHi: 'URL kwargs scope mein aate hain; database_sync_to_async ORM wrap karta hai',
        code: `import asyncio, os, django
from django.conf import settings
os.path.exists("ex3.sqlite3") and os.remove("ex3.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "channels"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "ex3.sqlite3"}},
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from django.core.management import call_command
from django.urls import path
from django.contrib.auth.models import User
from channels.routing import URLRouter
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator

call_command("migrate", run_syncdb=True, verbosity=0)
User.objects.create_user("alice"); User.objects.create_user("bob")

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        await self.accept()
        await self.send(text_data=f"joined {self.room}; users={await self.user_count()}")

    @database_sync_to_async
    def user_count(self):
        return User.objects.count()

app = URLRouter([path("ws/chat/<str:room>/", RoomConsumer.as_asgi())])

async def main():
    comm = WebsocketCommunicator(app, "/ws/chat/general/")
    ok, _ = await comm.connect()
    print("connected:", ok)
    print(await comm.receive_from())
    await comm.disconnect()

asyncio.run(main())`,
        output: `connected: True
joined general; users=2`,
        explain: '`URLRouter` matched `path("ws/chat/<str:room>/", ...)` and put `room` into `self.scope["url_route"]["kwargs"]`, exactly like a URL kwarg in a view. `User.objects.count()` cannot be called directly from the async method, so it is wrapped in `@database_sync_to_async`, which runs it in a thread and returns `2` -- the two users created before the event loop started.',
        explainHi: '`URLRouter` ne `path("ws/chat/<str:room>/", ...)` match kiya aur `room` ko `self.scope["url_route"]["kwargs"]` mein daala, bilkul ek view mein ek URL kwarg ki tarah. `User.objects.count()` async method se seedhे call nahi ho sakta, to ye `@database_sync_to_async` mein wrapped hai, jо ise ek thread mein chalाता hai aur `2` return karता hai -- event loop shuru hone se pehle bane do users.',
      },
    ],

    mistakes: [
      {
        wrong: `class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        # forgot to call self.accept() or self.close()
    async def receive_json(self, content, **kwargs):
        await self.send_json({"echo": content})
# the browser's WebSocket sits in CONNECTING forever, then times out`,
        right: `class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        await self.accept()          # <-- completes the handshake
    async def receive_json(self, content, **kwargs):
        await self.send_json({"echo": content})`,
        why: 'The WebSocket handshake is not complete until the consumer explicitly accepts it. If connect() returns without calling self.accept() (to proceed) or self.close() (to reject), the socket is left half-open: the browser stays in readyState CONNECTING, never fires onopen, and eventually errors out on a timeout — with no error on the server side, because from Django\'s view nothing went wrong. Every connect() method must end by either accepting or closing on every code path. A common variant is accepting only inside an if branch and falling through silently on the else.',
        whyHi: 'WebSocket handshake tab tak poora nahi hota jab tak consumer explicitly ise accept nahi karता. Agar connect() self.accept() (aage badhने ke liye) ya self.close() (reject karne ke liye) call kiye bina return karता hai, socket half-open chhoड diya jaता hai: browser readyState CONNECTING mein rehта hai, kabhi onopen fire nahi karता, aur aakhir mein ek timeout par error karता hai — server side par koi error nahi. Har connect() method ko har code path par ya to accept ya close karके khatm hona chahिए.',
      },
      {
        wrong: `class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def receive_json(self, content, **kwargs):
        # direct ORM call from an async method
        Message.objects.create(room=self.room, text=content["text"])
        # -> django.core.exceptions.SynchronousOnlyOperation`,
        right: `from channels.db import database_sync_to_async

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def receive_json(self, content, **kwargs):
        await self.persist(content["text"])

    @database_sync_to_async
    def persist(self, text):
        Message.objects.create(room=self.room, text=text)`,
        why: 'Django blocks synchronous ORM calls inside a running event loop with SynchronousOnlyOperation, because a blocking database call would stall the loop and freeze every other connection the worker holds. database_sync_to_async (or asgiref\'s sync_to_async) moves the call to a thread and, importantly, cleans up the thread\'s database connection afterwards so you do not accumulate one connection per message. Keep the wrapped function a thin data-access method; do not await inside it or call other async code from it.',
        whyHi: 'Django ek running event loop ke andar synchronous ORM calls ko SynchronousOnlyOperation ke saath block karता hai, kyunki ek blocking database call loop ko stall karegी aur worker ki har doosri connection freeze karegी. database_sync_to_async (ya asgiref ka sync_to_async) call ko ek thread mein le jाता hai aur, mahatvapoorna roop se, baad mein thread ka database connection saaf karता hai taaki aap prati message ek connection jama na karो. Wrapped function ko ek patla data-access method rakhो.',
      },
      {
        wrong: `# every consumer is a plain sync WebsocketConsumer with heavy work in receive()
class FeedConsumer(WebsocketConsumer):
    def receive(self, text_data):
        data = expensive_aggregation()      # 300 ms of ORM + Python
        self.send(json.dumps(data))
# 50 clients on one worker -> each message freezes the other 49 for 300 ms`,
        right: `class FeedConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data=None, bytes_data=None):
        data = await database_sync_to_async(expensive_aggregation)()
        await self.send(text_data=json.dumps(data))
# or: precompute the aggregation on a schedule and push it to a group (Lesson 2)`,
        why: 'A sync WebsocketConsumer runs each handler to completion before the worker can touch any other socket. That is fine for trivial handlers, but any real work — an aggregation query, an external API call, image processing — blocks every other connection on that worker for its full duration, and WebSocket workers typically hold hundreds of connections. Async consumers yield control on every await, so idle sockets cost almost nothing and slow work only delays itself. When the work is genuinely expensive, do not do it per-message at all: compute it on a timer or a Celery beat task and broadcast the result.',
        whyHi: 'Ek sync WebsocketConsumer har handler ko poora chalाता hai iske pehle ki worker kisi doosri socket ko chhu sake. Ye trivial handlers ke liye theek hai, par koi asli kaam — ek aggregation query, ek external API call — us worker ki har doosri connection ko iski poori duration ke liye block karता hai, aur WebSocket workers aam taur par sैkड़ों connections rakhते hain. Async consumers har await par control yield karते hain. Jab kaam asal mein expensive hai, ise prati-message bilkul mat karो: ise ek timer ya ek Celery beat task par compute karके result broadcast karो.',
      },
    ],

    realWorld: [
      {
        en: '**A `TokenAuthMiddleware` wrapping `URLRouter`** — reads a short-lived ticket from `scope["query_string"]` (the browser cannot set WS headers), validates it against a cache key the login view wrote, sets `scope["user"]`, and the consumer\'s `connect` rejects with code `4001` if `is_authenticated` is false.',
        hi: '**`URLRouter` ko wrap karता ek `TokenAuthMiddleware`** — `scope["query_string"]` se ek short-lived ticket padhता hai, ise validate karता hai, `scope["user"]` set karता hai, aur consumer ka `connect` code `4001` se reject karता hai.',
      },
      {
        en: '**Every consumer async, with a single `@database_sync_to_async` helper module** — `get_room`, `save_message`, `mark_read` — each a one-query function, so the consumers stay non-blocking and the DB access is easy to find and test.',
        hi: '**Har consumer async, ek single `@database_sync_to_async` helper module ke saath** — `get_room`, `save_message`, `mark_read` — har ek ek-query function, to consumers non-blocking rehते hain.',
      },
      {
        en: '**`AllowedHostsOriginValidator` in front of the WebSocket branch** — so a WebSocket handshake from a page on `evil.com` (which the browser *will* send with the user\'s cookies) is rejected before it reaches auth, closing the cross-site WebSocket hijacking hole.',
        hi: '**WebSocket branch ke aage `AllowedHostsOriginValidator`** — to `evil.com` par ek page se ek WebSocket handshake auth tak pahunchने se pehle reject hota hai, cross-site WebSocket hijacking hole band karके.',
      },
    ],

    interviewQA: [
      {
        q: 'What does Channels add on top of Django, and walk through the consumer lifecycle.',
        qHi: 'Channels Django ke upar kya joडता hai, aur consumer lifecycle se guzarो.',
        a: 'Plain Django runs on WSGI: one HTTP request in, one response out, connection closed, and no way for the server to push to the client afterwards. Channels adds an ASGI layer so the same project can also serve long-lived async protocols, chiefly WebSocket. You build an ASGI application in asgi.py with a ProtocolTypeRouter at the top: the http key still routes to the normal Django application, and the websocket key routes through a middleware stack — an origin validator and AuthMiddlewareStack — into a URLRouter that maps WebSocket paths to consumers, mirroring how urls.py maps paths to views. A consumer is the WebSocket equivalent of a view but it lives for the whole connection and has three main entry points. connect runs when the browser opens the socket; you examine self.scope, and you must finish by calling accept to complete the handshake or close to reject it — if you do neither, the browser hangs in CONNECTING until it times out. receive, or receive_json on the JSON consumer, runs each time the client sends a frame. disconnect runs when the socket closes, and is where you leave groups and update presence, though it is not guaranteed on a hard crash. Throughout, self.scope is the persistent per-connection context — the path, the URL kwargs, scope of user from the auth middleware, the session — so something you set on self in connect is available in every later receive. To push to the one connected client you call send or send_json; to reach many clients you need groups and the channel layer.',
        aHi: 'Plain Django WSGI par chalता hai: ek HTTP request andar, ek response bahar, connection band, aur server ke liye baad mein client ko push karne ka koi tareeka nahi. Channels ek ASGI layer joडता hai taaki wahi project long-lived async protocols bhi serve kar sake, mukhya roop se WebSocket. Aap asgi.py mein ek ASGI application banाते ho jiske top par ek ProtocolTypeRouter hai: http key abhi bhi normal Django application par route karता hai, aur websocket key ek middleware stack — ek origin validator aur AuthMiddlewareStack — se ek URLRouter mein route karता hai jо WebSocket paths ko consumers se map karता hai. Ek consumer ek view ka WebSocket samतुल्य hai par ye poore connection ke liye jeeता hai aur iske teen mukhya entry points hain. connect tab chalता hai jab browser socket kholता hai; aapको accept ya close call karके khatm karना zaroori hai. receive har baar chalता hai jab client ek frame bhejता hai. disconnect tab chalता hai jab socket band hoता hai. Poore mein, self.scope persistent per-connection context hai.',
      },
      {
        q: 'Why must you use `database_sync_to_async` in an async consumer, and when would you pick a sync consumer instead?',
        qHi: 'Ek async consumer mein aapको `database_sync_to_async` kyun istemal karना chahिए, aur aap ek sync consumer kab chunोge?',
        a: 'The Django ORM is synchronous. If you call it directly from an async consumer method, Django raises SynchronousOnlyOperation, on purpose: a blocking database call inside the event loop would stall the loop and freeze every other WebSocket connection that worker is holding, which for a WebSocket worker can be hundreds. database_sync_to_async, from channels dot db, runs the wrapped function in a thread pool so the event loop keeps turning, and it also closes that thread\'s database connection when the call finishes, so you do not leak one connection per message. You keep the wrapped functions small — a single query or write — and you do not await inside them. As for sync consumers: WebsocketConsumer lets you write ordinary synchronous code and call the ORM directly, which is simpler, but every handler call blocks the worker for its whole duration. That is acceptable only when the handlers are trivial and the expected connection count per worker is low — an internal tool, a prototype, a low-traffic feature. For anything with real concurrency or non-trivial work per message, you write async consumers and wrap the unavoidable sync pieces. And when the work per message is genuinely expensive, the better answer is not to do it per message at all: precompute on a schedule and broadcast the result to a group.',
        aHi: 'Django ORM synchronous hai. Agar aap ise ek async consumer method se seedhे call karते ho, Django SynchronousOnlyOperation raise karता hai, jान-boojhkar: event loop ke andar ek blocking database call loop ko stall karegी aur us worker ki har doosri WebSocket connection freeze karegी, jо ek WebSocket worker ke liye sैkड़ों ho sakti hain. database_sync_to_async wrapped function ko ek thread pool mein chalाता hai taaki event loop ghूमता rahे, aur ye us thread ka database connection bhi band karता hai jab call khatm hoती hai. Aap wrapped functions ko chhota rakhते ho. Sync consumers ke baare mein: WebsocketConsumer aapको ordinary synchronous code likhने aur ORM ko seedhे call karne deता hai, jо aasान hai, par har handler call worker ko iski poori duration ke liye block karता hai. Wo sirf tab acceptable hai jab handlers trivial hain aur prati worker expected connection count kam hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django + Channels (InMemoryChannelLayer). Write an `AsyncJsonWebsocketConsumer` whose `connect` accepts and sends `{"n": 0}`, and whose `receive_json` keeps a running counter on `self` and replies `{"n": <count>}`. Drive it with a `WebsocketCommunicator`: connect, read the `0` frame, send two messages, assert you get `{"n": 1}` then `{"n": 2}` (state persists on `self` for the connection).',
        taskHi: 'Standalone Django + Channels. Ek `AsyncJsonWebsocketConsumer` likho jiska `connect` accept karke `{"n": 0}` bhejता hai, aur jiska `receive_json` `self` par ek running counter rakhता hai. Ek `WebsocketCommunicator` se drive karo; assert `{"n": 1}` phir `{"n": 2}`.',
        hint: 'In `connect` set `self.count = 0` before `accept`. `WebsocketCommunicator(Consumer.as_asgi(), "/ws/")`, then `await comm.connect()`, `await comm.receive_json_from()`, `await comm.send_json_to({})`.',
        hintHi: '`connect` mein `accept` se pehle `self.count = 0` set karो. `WebsocketCommunicator(Consumer.as_asgi(), "/ws/")`, phir `await comm.connect()`, `receive_json_from()`, `send_json_to({})`.',
      },
      {
        task: 'Write a consumer that rejects unless the path kwarg `room` equals `"public"`. In `connect`: read `self.scope["url_route"]["kwargs"]["room"]`; if it is not `"public"`, `await self.close(code=4404)` and return; else `accept`. Route it with `URLRouter([path("ws/<str:room>/", C.as_asgi())])`. Assert connecting to `/ws/public/` gives `(True, ...)` and `/ws/secret/` gives `(False, 4404)`.',
        taskHi: 'Ek consumer likho jо reject karता hai jab tak path kwarg `room` `"public"` na ho. `URLRouter([path("ws/<str:room>/", C.as_asgi())])` se route karो. Assert `/ws/public/` -> `(True, ...)` aur `/ws/secret/` -> `(False, 4404)`.',
        hint: '`await comm.connect()` returns `(accepted: bool, code_or_subprotocol)`. On rejection the second item is your close code.',
        hintHi: '`await comm.connect()` `(accepted: bool, code_or_subprotocol)` return karता hai. Rejection par doosra item aapка close code hai.',
      },
      {
        task: 'Demonstrate the async/ORM rule. With a file-backed sqlite DB and `django.contrib.auth` migrated, write an `AsyncWebsocketConsumer` whose `connect` tries `User.objects.count()` directly (no wrapper) inside a `try/except` and sends either `count=<n>` or `error=<ExceptionClassName>`. Then write a second consumer that uses `@database_sync_to_async`. Assert the first sends `error=SynchronousOnlyOperation` and the second sends `count=0`.',
        taskHi: 'Async/ORM niyam dikhाओ. Ek `AsyncWebsocketConsumer` likho jiska `connect` seedhे `User.objects.count()` try karता hai (koi wrapper nahi) ek `try/except` mein. Phir ek doosra jо `@database_sync_to_async` istemal karता hai. Assert pehla `error=SynchronousOnlyOperation` bhejता hai aur doosra `count=0`.',
        hint: '`type(exc).__name__` gives the class name. Use a real file for `NAME` (not `:memory:`) so the wrapped-in-a-thread version sees the migrated schema.',
        hintHi: '`type(exc).__name__` class name deता hai. `NAME` ke liye ek asli file istemal karो (`:memory:` nahi) taaki thread-mein-wrapped version migrated schema dekhे.',
      },
    ],

    keyTakeaways: [
      'WSGI = one HTTP request -> one response -> closed, no server push. ASGI = async, speaks HTTP + long-lived protocols (WebSocket, SSE); one process holds thousands of connections parked on `await`. CHANNELS is the library that gives Django ASGI: routing, consumers, auth, the channel layer.',
      '`asgi.py` builds one ASGI app: `ProtocolTypeRouter({"http": django_asgi_app, "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(ws_patterns)))})`. HTTP is unchanged; WebSocket paths route to consumers via `URLRouter` (path converters -> `scope["url_route"]["kwargs"]`). Set `ASGI_APPLICATION`.',
      'A CONSUMER : WebSocket :: a view : request, but lives for the whole connection. `async def connect(self)` -> inspect `self.scope`, then MUST `await self.accept()` OR `await self.close(code=)` on every path (neither = browser hangs in CONNECTING). `receive_json(self, content)` per client frame. `disconnect(self, code)` on close (NOT guaranteed on hard crash).',
      '`self.scope` = the persistent per-connection context, filled by middleware before `connect`: `["type"]`, `["path"]`, `["url_route"]["kwargs"]`, `["user"]` (from `AuthMiddlewareStack`), `["query_string"]` (raw bytes), `["session"]`, `["headers"]`. Set `self.x` in `connect` -> available in every later `receive`.',
      'AUTH: `AuthMiddlewareStack` reads the session cookie -> `scope["user"]`; reject in `connect` with `if not user.is_authenticated: await self.close(code=4001)`. Browser WS can\'t send `Authorization` headers -> token auth = short-lived ticket in the query string + a tiny custom middleware. DRF auth classes do NOT apply to consumers.',
      'The ORM is SYNC. A direct `Model.objects...` call in an async consumer raises `SynchronousOnlyOperation`. Wrap with `@database_sync_to_async` (from `channels.db`) — runs in a thread pool AND closes the DB connection after (no per-message leak). Keep wrapped fns tiny, no `await` inside.',
      'Base classes: `WebsocketConsumer` (sync; `self.receive(text_data)`/`self.send(text_data)`), `AsyncWebsocketConsumer` (async; raw `receive(text_data=, bytes_data=)`), `AsyncJsonWebsocketConsumer` (async; `receive_json(content)`/`send_json(obj)`). PREFER async — a sync handler blocks the worker (and its hundreds of other sockets) for its full duration.',
      'When per-message work is genuinely expensive (an aggregation, an API call): don\'t do it per message — precompute on a timer / Celery beat and broadcast the result to a group (Lesson 2).',
    ],
    keyTakeawaysHi: [
      'WSGI = ek HTTP request -> ek response -> closed, koi server push nahi. ASGI = async, HTTP + long-lived protocols bolता hai; ek process hazaron connections `await` par parked rakhता hai. CHANNELS wo library hai jо Django ko ASGI deती hai.',
      '`asgi.py` ek ASGI app banाता hai: `ProtocolTypeRouter({"http": ..., "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(...)))})`. HTTP unchanged; WebSocket paths `URLRouter` se consumers par route. `ASGI_APPLICATION` set karो.',
      'Ek CONSUMER : WebSocket :: ek view : request, par poore connection ke liye jeeता hai. `async def connect(self)` -> `self.scope` inspect karो, phir har path par `await self.accept()` YA `await self.close(code=)` zaroori (koi nahi = browser CONNECTING mein latakता hai). `receive_json(self, content)` prati frame. `disconnect(self, code)` close par (hard crash par guarantee NAHI).',
      '`self.scope` = persistent per-connection context, `connect` se pehle middleware dwara bhara: `["url_route"]["kwargs"]`, `["user"]`, `["query_string"]`, `["session"]`. `connect` mein `self.x` set karो -> har baad ke `receive` mein available.',
      'AUTH: `AuthMiddlewareStack` session cookie padhता hai -> `scope["user"]`; `connect` mein reject: `if not user.is_authenticated: await self.close(code=4001)`. Browser WS `Authorization` headers nahi bhej sakta -> token auth = query string mein short-lived ticket + ek chhota custom middleware. DRF auth classes consumers par lागू NAHI.',
      'ORM SYNC hai. Ek async consumer mein seedhा `Model.objects...` call `SynchronousOnlyOperation` raise karता hai. `@database_sync_to_async` (`channels.db` se) se wrap karो — ek thread pool mein chalता hai AUR baad mein DB connection band karता hai. Wrapped fns chhote rakhो.',
      'Base classes: `WebsocketConsumer` (sync), `AsyncWebsocketConsumer` (async; raw `receive`), `AsyncJsonWebsocketConsumer` (async; `receive_json`/`send_json`). Async PREFER karो — ek sync handler worker ko (aur iski sैkड़ों doosri sockets ko) iski poori duration ke liye block karता hai.',
      'Jab prati-message kaam asal mein expensive hai: ise prati message mat karो — ek timer / Celery beat par precompute karके result ek group ko broadcast karो (Lesson 2).',
    ],
  },

  {
    slug: 'dj-channels-groups-and-channel-layers',
    title: 'Groups & the Channel Layer: Broadcasting to Many Clients',
    titleHi: 'Groups Aur Channel Layer: Kई Clients Ko Broadcast Karna',
    description: 'A consumer can only `send` to its own socket. To push one event to every client in a chat room — or from a view or a Celery task to a live dashboard — you need the **channel layer**: a shared message bus (Redis in production) where consumers join named **groups** and anything can `group_send` to all members.',
    descriptionHi: 'Ek consumer sirf apni socket ko `send` kar sakta hai. Ek event ko ek chat room ke har client ko push karne ke liye — ya ek view ya ek Celery task se ek live dashboard ko — aapको **channel layer** chahिए: ek shared message bus (production mein Redis) jahaan consumers named **groups** join karते hain aur kuch bhi sabhi members ko `group_send` kar sakta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A radio dispatch system for a taxi fleet.** Each driver has a radio with a unique call sign — that is a consumer\'s **channel name**, a private address for that one connection. But dispatch does not usually call one cab; it calls a **zone**: "all cars in the airport zone, pickup at terminal 2". Drivers **tune into** the zones they are working (`group_add`) and **drop** them at end of shift (`group_discard`). When dispatch broadcasts to a zone (`group_send`), every radio currently tuned to it hears the same call, and each driver decides what to do with it (the consumer\'s handler method). The dispatch console itself is not a driver — it is back at the office, and it can key the mic for any zone at any time. That console is a **view or a Celery task** reaching the fleet through the same radio network (`get_channel_layer()` + `async_to_sync(group_send)`). And the radio network — the tower, the repeaters — is **Redis**: without it, each office would only reach its own drivers, which is exactly what happens when you run multiple server processes without a shared channel layer.',
      hi: '**Ek taxi fleet ke liye ek radio dispatch system.** Har driver ke paas ek unique call sign waala radio hai — wo ek consumer ka **channel name** hai, us ek connection ke liye ek private address. Par dispatch aam taur par ek cab ko call nahi karता; ye ek **zone** ko call karता hai: "airport zone ki sabhi cars, terminal 2 par pickup". Drivers un zones mein **tune** karते hain jinme wo kaam kar rahe hain (`group_add`) aur shift ke ant mein unhe **drop** karते hain (`group_discard`). Jab dispatch ek zone ko broadcast karता hai (`group_send`), us par tune har radio wahi call sunता hai, aur har driver tय karता hai iska kya karna (consumer ka handler method). Dispatch console khud ek driver nahi hai — ye office mein wapas hai, aur ye kisi bhi zone ke liye kisi bhi samay mic key kar sakta hai. Wo console ek **view ya ek Celery task** hai jо usi radio network se fleet tak pahunchता hai. Aur radio network — tower, repeaters — **Redis** hai: iske bina, har office sirf apne drivers tak pahunchएga.',
    },

    simple: `**channel name vs group**

\`\`\`
self.channel_name   a unique auto-generated address for THIS one connection
                    (e.g. "specific.abcdef123!xyz") -- send here to reach one client
a group             a named set of channel names -- "chat_general", "user_42", "dashboard"
                    send to the group to reach every member
\`\`\`

**Join a group in connect, leave it in disconnect**

\`\`\`python
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        self.group = f"chat_{self.room}"
        await self.channel_layer.group_add(self.group, self.channel_name)     # tune in
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name) # drop out

    async def receive_json(self, content, **kwargs):
        # fan the message out to everyone in the room
        await self.channel_layer.group_send(self.group, {
            "type": "chat.message",          # <-- dotted 'type' -> handler method name
            "text": content["text"],
            "sender": self.scope["user"].username,
        })

    async def chat_message(self, event):     # <-- 'chat.message' dispatches HERE
        await self.send_json({"text": event["text"], "sender": event["sender"]})
\`\`\`

\`\`\`
group_send({"type": "chat.message", ...})   ->   Channels calls  chat_message(self, event)
                                                 on EVERY consumer in the group.
the '.' in the type becomes '_' in the method name. no method -> error in that consumer.
\`\`\`

**Broadcast from a view or Celery task (not a consumer)**

\`\`\`python
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def close_poll(request, poll_id):
    poll = ...                                    # do the normal work
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(              # sync view -> wrap in async_to_sync
        f"poll_{poll_id}",
        {"type": "poll.closed", "results": poll.results()},
    )
    return redirect("poll-detail", poll_id)

# in an async context (async view, Celery with async), just: await layer.group_send(...)
\`\`\`

**Settings: InMemory for tests, Redis for real**

\`\`\`python
# tests / single-process dev
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}

# production -- REQUIRED once you run more than one process
CHANNEL_LAYERS = {"default": {
    "BACKEND": "channels_redis.core.RedisChannelLayer",
    "CONFIG": {"hosts": [("redis", 6379)]},
}}
\`\`\`
InMemory does NOT cross processes: with Redis, a message sent by worker A reaches a client held by worker B.`,

    simpleHi: `**channel name vs group**

\`\`\`
self.channel_name   IS ek connection ke liye ek unique auto-generated address
                    -- yahan send karके ek client tak pahuncho
ek group            channel names ka ek named set -- "chat_general", "user_42", "dashboard"
                    group ko send karके har member tak pahuncho
\`\`\`

**connect mein ek group join karो, disconnect mein ise chhodो**

\`\`\`python
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        self.group = f"chat_{self.room}"
        await self.channel_layer.group_add(self.group, self.channel_name)     # tune in
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name) # drop out

    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.group, {
            "type": "chat.message",          # <-- dotted 'type' -> handler method name
            "text": content["text"],
            "sender": self.scope["user"].username,
        })

    async def chat_message(self, event):     # <-- 'chat.message' YAHAN dispatch hota hai
        await self.send_json({"text": event["text"], "sender": event["sender"]})
\`\`\`

\`\`\`
group_send({"type": "chat.message", ...})   ->   Channels  chat_message(self, event)  call karта hai
                                                 group ke HAR consumer par.
type mein '.' method name mein '_' ban jaता hai. koi method nahi -> us consumer mein error.
\`\`\`

**Ek view ya Celery task se broadcast karो (ek consumer nahi)**

\`\`\`python
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def close_poll(request, poll_id):
    poll = ...
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(              # sync view -> async_to_sync mein wrap karो
        f"poll_{poll_id}",
        {"type": "poll.closed", "results": poll.results()},
    )
    return redirect("poll-detail", poll_id)

# ek async context mein, bस: await layer.group_send(...)
\`\`\`

**Settings: tests ke liye InMemory, asli ke liye Redis**

\`\`\`python
# tests / single-process dev
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}

# production -- ek se zyada process chalाne par ZAROORI
CHANNEL_LAYERS = {"default": {
    "BACKEND": "channels_redis.core.RedisChannelLayer",
    "CONFIG": {"hosts": [("redis", 6379)]},
}}
\`\`\`
InMemory processes ke paar NAHI jाता: Redis ke saath, worker A dwara bheja ek message worker B dwara rakha ek client tak pahunchता hai.`,

    content: `## Why one consumer cannot do it alone

Each WebSocket connection is one consumer instance with one \`self.send\`. There is no shared list of "all consumers" you could loop over — they may be spread across threads, processes, even machines. To send one event to many clients you route it through the **channel layer**: a message-passing backend that every consumer process connects to.

## Channels and groups

- **A channel** is a named mailbox. Every consumer has \`self.channel_name\` — a unique, auto-generated address for its own connection. Send a message to that name and only that one consumer receives it.
- **A group** is a named set of channel names. \`group_add(group, channel)\` puts a channel in the set; \`group_discard\` removes it; \`group_send(group, message)\` delivers the message to **every channel currently in the set**. Groups are cheap and created on demand — \`"chat_general"\`, \`"user_42"\` (all of one user\'s tabs), \`"dashboard"\`, \`"order_5091"\`.

The standard pattern:

\`\`\`python
async def connect(self):
    self.group = f"chat_{self.scope['url_route']['kwargs']['room']}"
    await self.channel_layer.group_add(self.group, self.channel_name)
    await self.accept()

async def disconnect(self, code):
    await self.channel_layer.group_discard(self.group, self.channel_name)
\`\`\`

Join in \`connect\`, leave in \`disconnect\`. If \`disconnect\` does not run (hard crash), the channel layer expires the membership after a timeout (\`group_expiry\`, default 86400 s) — so a dead channel eventually stops receiving, but stale members can briefly linger.

## The \`type\` → handler dispatch

\`group_send(group, message)\` requires the message dict to have a **\`"type"\"** key. When the message reaches a consumer, Channels looks for a **method whose name is the type with dots replaced by underscores** and calls it with the message:

\`\`\`python
await self.channel_layer.group_send("chat_general", {"type": "chat.message", "text": "hi"})
# -> Channels calls  async def chat_message(self, event)  on every consumer in "chat_general"
#    event == {"type": "chat.message", "text": "hi"}
\`\`\`

Inside that handler you decide what the client sees — usually \`await self.send_json(...)\`, but a handler can also update \`self\` state, ignore the event for this user, or send a different shape. If a consumer in the group has **no matching method**, that delivery raises inside that consumer (you will see it in logs) — every member of a group must implement every event type sent to it. A common convention: prefix event types per feature (\`chat.message\`, \`chat.typing\`, \`presence.join\`) and give the consumer one handler each.

## Broadcasting from outside a consumer

The channel layer is not consumer-only. A **view**, a **Celery task**, a **management command**, a **signal handler** — anything — can push to a group:

\`\`\`python
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

layer = get_channel_layer()                       # the configured default layer

# from SYNC code (a normal view, a sync Celery task):
async_to_sync(layer.group_send)("dashboard", {"type": "metrics.update", "data": snapshot})

# from ASYNC code (an async view, async task):
await layer.group_send("dashboard", {"type": "metrics.update", "data": snapshot})
\`\`\`

This is how the pieces connect: an HTTP \`POST /orders/\` handler does its normal work, then \`group_send("order_5091", {...})\` so the customer\'s open order page updates live. A Celery task finishing a slow export \`group_send(f"user_{uid}", {"type": "export.ready", "url": ...})\`. Pair it with \`transaction.on_commit\` so you never broadcast a row that then rolls back:

\`\`\`python
transaction.on_commit(
    lambda: async_to_sync(layer.group_send)(f"order_{order.id}", {"type": "order.updated", ...})
)
\`\`\`

## \`InMemoryChannelLayer\` vs \`RedisChannelLayer\`

- **\`InMemoryChannelLayer\`** keeps groups in a Python dict in the process. Perfect for tests and single-process \`runserver\`. It **does not cross process boundaries**: if you run 2+ ASGI workers (or Daphne + a Celery worker), a \`group_send\` from one only reaches consumers in the *same* process. Symptoms: "messages work locally, half of them vanish in production."
- **\`RedisChannelLayer\`** (\`channels_redis\`) stores group membership and routes messages through Redis, so every worker process shares one view of every group. **This is mandatory** the moment you have more than one process, which in production you always do. Configure \`hosts\`, and for HA use \`RedisPubSubChannelLayer\` or a Redis cluster.

## The cost model

- \`group_send\` to a group of *N* members is *N* individual deliveries through Redis. A 10,000-member group getting 50 messages/second is 500,000 Redis operations/second — size groups and message rates accordingly.
- Do not put large payloads in \`group_send\` — the message is copied to every member. Send an ID or a small delta and let clients fetch detail, or send the minimal changed fields.
- Very high-fan-out broadcast (a stock ticker to 100k viewers) is often better served by a dedicated pub/sub CDN or SSE from a cache, not per-connection Redis fan-out.
- \`group_add\` / \`discard\` are writes to Redis on every connect/disconnect — a reconnect storm (deploy, network blip) is a load spike.`,

    contentHi: `## Ek consumer akele kyun nahi kar sakta

Har WebSocket connection ek \`self.send\` waala ek consumer instance hai. "sabhi consumers" ki koi shared list nahi hai jispar aap loop kar sako — wo threads, processes, machines ke paar failе ho sakte hain. Ek event ko kई clients ko bhejने ke liye aap ise **channel layer** se route karते ho: ek message-passing backend jismें har consumer process connect karता hai.

## Channels aur groups

- **Ek channel** ek named mailbox hai. Har consumer ke paas \`self.channel_name\` hai — apne connection ke liye ek unique, auto-generated address. Us name ko ek message bhejो aur sirf wahi ek consumer receive karता hai.
- **Ek group** channel names ka ek named set hai. \`group_add(group, channel)\` ek channel ko set mein daalता hai; \`group_discard\` ise hataता hai; \`group_send(group, message)\` message ko **set mein har channel** tak deliver karता hai. Groups saste hain aur demand par bane — \`"chat_general"\`, \`"user_42"\` (ek user ke sabhi tabs), \`"dashboard"\`.

Standard pattern: \`connect\` mein join, \`disconnect\` mein leave. Agar \`disconnect\` nahi chalता (hard crash), channel layer ek timeout ke baad membership expire karता hai (\`group_expiry\`, default 86400 s).

## \`type\` -> handler dispatch

\`group_send(group, message)\` ke liye message dict mein ek **\`"type"\"** key zaroori hai. Jab message ek consumer tak pahunchता hai, Channels ek **method dhoondhता hai jiska naam type hai dots ko underscores se replace karके** aur ise message ke saath call karता hai:

\`\`\`python
await self.channel_layer.group_send("chat_general", {"type": "chat.message", "text": "hi"})
# -> Channels  async def chat_message(self, event)  call karता hai "chat_general" ke har consumer par
\`\`\`

Us handler ke andar aap tय karते ho client kya dekhता hai — aam taur par \`await self.send_json(...)\`. Agar group mein ek consumer ke paas **koi matching method nahi hai**, wo delivery us consumer ke andar raise karता hai — group ke har member ko iske bheja har event type implement karna chahिए.

## Ek consumer ke bahar se broadcasting

Channel layer consumer-only nahi hai. Ek **view**, ek **Celery task**, ek **management command**, ek **signal handler** — kuch bhi — ek group ko push kar sakta hai:

\`\`\`python
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

layer = get_channel_layer()

# SYNC code se (ek normal view, ek sync Celery task):
async_to_sync(layer.group_send)("dashboard", {"type": "metrics.update", "data": snapshot})

# ASYNC code se:
await layer.group_send("dashboard", {"type": "metrics.update", "data": snapshot})
\`\`\`

Aise tukdे connect hote hain: ek HTTP \`POST /orders/\` handler apna normal kaam karता hai, phir \`group_send("order_5091", {...})\` taaki customer ka khula order page live update ho. Ise \`transaction.on_commit\` ke saath pair karो taaki aap kabhi ek row broadcast na karो jо phir rollback ho jaए.

## \`InMemoryChannelLayer\` vs \`RedisChannelLayer\`

- **\`InMemoryChannelLayer\`** groups ko process mein ek Python dict mein rakhता hai. Tests aur single-process \`runserver\` ke liye perfect. Ye **process boundaries ke paar nahi jाता**: agar aap 2+ ASGI workers chalाते ho, ek se \`group_send\` sirf *usi* process ke consumers tak pahunchता hai. Symptoms: "messages locally kaam karते hain, aadhे production mein gायab ho jaते hain."
- **\`RedisChannelLayer\`** (\`channels_redis\`) group membership store karता hai aur messages Redis se route karता hai, to har worker process har group ka ek view share karता hai. **Ye anivाrya hai** jis pal aapke paas ek se zyada process hai, jо production mein aap hamesha rakhते ho.

## Cost model

- *N* members ke ek group ko \`group_send\` Redis se *N* individual deliveries hai. 50 messages/second paता ek 10,000-member group 500,000 Redis operations/second hai.
- \`group_send\` mein bade payloads mat daalो — message har member ko copy hota hai. Ek ID ya ek chhota delta bhejो.
- Bahut high-fan-out broadcast aksar ek dedicated pub/sub CDN ya cache se SSE dwara behtar serve hota hai.
- \`group_add\` / \`discard\` har connect/disconnect par Redis ko writes hain — ek reconnect storm ek load spike hai.`,

    examples: [
      {
        title: 'Two clients in one group: one sends, both receive (type -> chat_message)',
        titleHi: 'Ek group mein do clients: ek bhejता hai, dono receive karते hain',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.group = "room_lobby"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def receive_json(self, content, **kwargs):
        await self.channel_layer.group_send(self.group,
            {"type": "chat.message", "text": content["text"]})

    async def chat_message(self, event):
        await self.send_json({"text": event["text"]})

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

async def main():
    a = WebsocketCommunicator(RoomConsumer.as_asgi(), "/ws/room/")
    b = WebsocketCommunicator(RoomConsumer.as_asgi(), "/ws/room/")
    await a.connect(); await b.connect()
    await a.send_json_to({"text": "hello room"})
    print("A receives:", await a.receive_json_from())
    print("B receives:", await b.receive_json_from())
    await a.disconnect(); await b.disconnect()

asyncio.run(main())`,
        output: `A receives: {'text': 'hello room'}
B receives: {'text': 'hello room'}`,
        explain: 'Both communicators join the same group `"room_lobby"` in `connect`. When A sends a frame, its `receive_json` calls `group_send` with `type` `"chat.message"`, which Channels dispatches to the `chat_message` method of *every* consumer in the group -- including A itself. So both A and B receive the identical `{\'text\': \'hello room\'}`.',
        explainHi: 'Dono communicators `connect` mein wahi group `"room_lobby"` join karते hain. Jab A ek frame bhejता hai, iska `receive_json` `type` `"chat.message"` ke saath `group_send` call karता hai, jise Channels group ke *har* consumer ke `chat_message` method par dispatch karता hai -- A khud samet. To A aur B dono identical `{\'text\': \'hello room\'}` receive karते hain.',
      },
      {
        title: 'Broadcast into a group from plain code via get_channel_layer',
        titleHi: 'get_channel_layer se plain code se ek group mein broadcast',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer

class DashboardConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("dashboard", self.channel_name)
        await self.accept()

    async def metrics_update(self, event):        # <- "metrics.update"
        await self.send_json({"metrics": event["data"]})

    async def disconnect(self, code):
        await self.channel_layer.group_discard("dashboard", self.channel_name)

async def main():
    viewer = WebsocketCommunicator(DashboardConsumer.as_asgi(), "/ws/dashboard/")
    await viewer.connect()

    # somewhere else entirely -- a Celery beat task, a management command, a signal:
    layer = get_channel_layer()
    await layer.group_send("dashboard", {"type": "metrics.update",
                                         "data": {"active_users": 1280, "rps": 47}})

    print("viewer got:", await viewer.receive_json_from())
    await viewer.disconnect()

asyncio.run(main())`,
        output: `viewer got: {'metrics': {'active_users': 1280, 'rps': 47}}`,
        explain: '`get_channel_layer()` returns the same configured layer the consumers use, so code that is not a consumer at all -- a Celery beat task, a management command, a signal handler -- can `group_send` into `"dashboard"` and reach every connected viewer. The `metrics.update` type is dispatched to the consumer\'s `metrics_update` handler, which forwards the payload to its client.',
        explainHi: '`get_channel_layer()` wahi configured layer return karता hai jise consumers istemal karते hain, to code jо bilkul ek consumer nahi hai -- ek Celery beat task, ek management command, ek signal handler -- `"dashboard"` mein `group_send` kar sakta hai aur har connected viewer tak pahunch sakta hai. `metrics.update` type consumer ke `metrics_update` handler par dispatch hota hai, jо payload ko iske client ko forward karता hai.',
      },
      {
        title: 'group_discard stops delivery: a client that left the group hears nothing',
        titleHi: 'group_discard delivery rokता hai: ek client jо group chhod gaya kuch nahi sunता',
        code: `import asyncio, django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=["channels"],
    CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
django.setup()

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer

class ToggleConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("g", self.channel_name)
        await self.accept()

    async def receive_json(self, content, **kwargs):
        if content.get("action") == "leave":
            await self.channel_layer.group_discard("g", self.channel_name)
            await self.send_json({"left": True})

    async def ping(self, event):
        await self.send_json({"ping": event["n"]})

async def main():
    c = WebsocketCommunicator(ToggleConsumer.as_asgi(), "/ws/g/")
    await c.connect()
    layer = get_channel_layer()

    await layer.group_send("g", {"type": "ping", "n": 1})
    print("before leave:", await c.receive_json_from())

    await c.send_json_to({"action": "leave"})
    print("leave ack:", await c.receive_json_from())

    await layer.group_send("g", {"type": "ping", "n": 2})
    print("after leave, idle?:", await c.receive_nothing(timeout=0.15))
    await c.disconnect()

asyncio.run(main())`,
        output: `before leave: {'ping': 1}
leave ack: {'left': True}
after leave, idle?: True`,
        explain: 'The first `ping` broadcast arrives because the channel is still in group `"g"`. After the client sends `{"action": "leave"}`, the consumer calls `group_discard`, removing its channel from the set. The second `group_send` for the same group now delivers to nobody the client can see -- `receive_nothing` returns `True`, confirming a discarded channel stops receiving group messages.',
        explainHi: 'Pehla `ping` broadcast aata hai kyunki channel abhi bhi group `"g"` mein hai. Client ke `{"action": "leave"}` bhejने ke baad, consumer `group_discard` call karता hai, apni channel ko set se hataकर. Wahi group ke liye doosra `group_send` ab kisi ko deliver nahi karता jise client dekh sake -- `receive_nothing` `True` return karता hai, confirm karके ki ek discarded channel group messages receive karना band kar deता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# production runs 4 Daphne workers behind a load balancer
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}
# chat "mostly works" -- but two users in the same room served by different
# workers never see each other's messages`,
        right: `CHANNEL_LAYERS = {"default": {
    "BACKEND": "channels_redis.core.RedisChannelLayer",
    "CONFIG": {"hosts": [("redis", 6379)]},
}}
# now group membership and group_send go through Redis, shared by all 4 workers`,
        why: 'InMemoryChannelLayer stores every group in a plain dict inside one Python process. It is only meant for tests and single-process development. The instant you run more than one ASGI process — multiple Daphne/Uvicorn workers, or an ASGI server plus a separate Celery worker that also broadcasts — each process has its own private set of groups. A group_send in process A reaches only the consumers whose sockets are held by process A. The classic symptom is a chat or notification feature that passes every local test and then, in production, delivers messages to roughly 1/N of the intended recipients at random. RedisChannelLayer (from channels_redis) puts the group registry and the message routing in Redis so all processes share one coherent view.',
        whyHi: 'InMemoryChannelLayer har group ko ek Python process ke andar ek plain dict mein store karता hai. Ye sirf tests aur single-process development ke liye hai. Jis pal aap ek se zyada ASGI process chalाते ho, har process ke paas apne private groups ka set hoता hai. Process A mein ek group_send sirf un consumers tak pahunchता hai jinki sockets process A rakhता hai. Classic symptom ek chat ya notification feature hai jо har local test pass karता hai aur phir, production mein, messages ko intended recipients ke lगbhag 1/N tak random mein deliver karता hai. RedisChannelLayer group registry aur message routing ko Redis mein rakhता hai.',
      },
      {
        wrong: `async def connect(self):
    await self.channel_layer.group_add(self.group, self.channel_name)
    await self.accept()
# ...but no disconnect() method, or it forgets group_discard
async def disconnect(self, code):
    pass`,
        right: `async def disconnect(self, code):
    await self.channel_layer.group_discard(self.group, self.channel_name)
# every group_add in connect needs a matching group_discard in disconnect`,
        why: 'If you add the channel to a group on connect but never discard it, the channel layer keeps trying to deliver group_send messages to a channel whose socket is gone. With Redis this means wasted deliveries and slowly growing group sets until the group_expiry timeout (default one day) garbage-collects dead members. In the meantime, counts derived from group membership (a naive "users online" figure) are inflated, and every broadcast does more work than it should. The rule is symmetry: each group_add in connect has a matching group_discard in disconnect. Note disconnect is still not guaranteed on a hard crash — the expiry is the backstop — but skipping it entirely makes every ungraceful and graceful disconnect leak.',
        whyHi: 'Agar aap connect par channel ko ek group mein add karते ho par kabhi discard nahi karते, channel layer ek aisी channel ko group_send messages deliver karne ki koshish karता rehता hai jiski socket chali gayi. Redis ke saath iska matlab wasted deliveries aur dheere-dheere badhते group sets hai jab tak group_expiry timeout (default ek din) dead members ko garbage-collect na kare. Is beech, group membership se nikalे counts inflate hote hain. Niyam symmetry hai: connect mein har group_add ka disconnect mein ek matching group_discard hai.',
      },
      {
        wrong: `async def receive_json(self, content, **kwargs):
    await self.channel_layer.group_send(self.group, {
        "type": "chat.message",
        "message": content,
        "full_user": UserSerializer(self.scope["user"]).data,
        "room_history": [...],          # the last 200 messages, on every send
    })`,
        right: `async def receive_json(self, content, **kwargs):
    msg = await self.save_message(content["text"])   # write once
    await self.channel_layer.group_send(self.group, {
        "type": "chat.message",
        "id": msg.id, "text": msg.text, "user": self.scope["user"].username,
    })                                                # small, flat payload`,
        why: 'group_send delivers a full copy of the message dict to every member of the group through Redis. A 5 KB payload sent to a 500-person room is 2.5 MB per message crossing Redis, serialized and deserialized 500 times. Large or redundant fields — a serialized user object, room history, anything the client already has or can fetch — multiply the cost of every broadcast and can saturate Redis under load. Send the minimum: an id and the changed fields, or just an id and let clients request detail. This also keeps the channel layer message under its size limit (channels_redis defaults to 1 MB and will error above it).',
        whyHi: 'group_send message dict ki ek poori copy group ke har member ko Redis se deliver karता hai. Ek 500-vyakti room ko bheja ek 5 KB payload prati message 2.5 MB hai Redis paar karता hua, 500 baar serialize aur deserialize. Bade ya redundant fields har broadcast ki cost ko multiply karते hain aur load ke tahat Redis ko saturate kar sakte hain. Minimum bhejो: ek id aur badalे fields. Ye channel layer message ko iski size limit ke neeche bhi rakhता hai (channels_redis default 1 MB).',
      },
    ],

    realWorld: [
      {
        en: '**A per-user group `f"user_{uid}"` that every one of that user\'s tabs/devices joins** — a notification created anywhere in the app does `async_to_sync(layer.group_send)(f"user_{uid}", {...})` and every open tab updates, no matter which worker holds each socket.',
        hi: '**Ek per-user group `f"user_{uid}"` jise us user ka har tab join karता hai** — kahin bhi banाya ek notification `group_send(f"user_{uid}", {...})` karता hai aur har khula tab update hota hai.',
      },
      {
        en: '**A Celery beat task that computes the ops dashboard snapshot every 5 s and `group_send`s it to `"dashboard"`** — the consumers do zero work per tick, just forward the payload, so 200 dashboard viewers cost one aggregation query, not 200.',
        hi: '**Ek Celery beat task jо har 5 s ops dashboard snapshot compute karता hai aur ise `"dashboard"` ko `group_send` karता hai** — consumers prati tick zero kaam karते hain, to 200 viewers ek aggregation query kharch karते hain, 200 nahi.',
      },
      {
        en: '**`transaction.on_commit` wrapping every `group_send` that follows a DB write** — the order-status broadcast fires only after the status change is actually committed, so a rolled-back transaction never shows the customer a state that does not exist.',
        hi: '**Har `group_send` ke aage `transaction.on_commit` jо ek DB write ke baad aata hai** — order-status broadcast sirf tab fire hota hai jab status change asal mein commit ho jाता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain channels, groups, and the channel layer. How does `group_send` reach a consumer method?',
        qHi: 'Channels, groups, aur channel layer samjhाओ. `group_send` ek consumer method tak kaise pahunchता hai?',
        a: 'A consumer can only send on its own socket, and there is no in-process list of all consumers because they are spread across processes and machines. The channel layer is a shared message bus, Redis in production, that every consumer process connects to. Within it, a channel is a unique auto-generated address for one connection, available as self dot channel_name. A group is a named set of channel names: group_add puts a channel in it, group_discard removes it, and group_send delivers a message to every channel currently in the set. You join the relevant group in connect and leave it in disconnect. group_send takes a dict that must contain a type key. When that message arrives at a consumer, Channels translates the type into a method name by replacing dots with underscores — type chat dot message calls the method chat_message — and invokes it with the message dict as the event argument, on every consumer in the group. Inside that handler the consumer decides what the client sees, typically calling send_json. Every consumer that is a member of a group must implement a handler for every event type that gets sent to that group, or the delivery raises inside that consumer. The important operational detail is that the channel layer must be RedisChannelLayer once you run more than one process; InMemoryChannelLayer is per-process and will silently drop cross-worker messages in production.',
        aHi: 'Ek consumer sirf apni socket par send kar sakta hai, aur sabhi consumers ki koi in-process list nahi hai kyunki wo processes aur machines ke paar failе hain. Channel layer ek shared message bus hai, production mein Redis, jismें har consumer process connect karता hai. Iske andar, ek channel ek connection ke liye ek unique auto-generated address hai, self dot channel_name ke roop mein. Ek group channel names ka ek named set hai: group_add ek channel ko isme daalता hai, group_discard hataता hai, aur group_send ek message ko set mein har channel ko deliver karता hai. Aap connect mein relevant group join karते ho aur disconnect mein chhodते ho. group_send ek dict leता hai jismें ek type key zaroori hai. Jab wo message ek consumer par aata hai, Channels type ko ek method name mein translate karता hai dots ko underscores se replace karके — type chat dot message method chat_message call karता hai. Har consumer jо ek group ka member hai use har event type ke liye ek handler implement karना chahिए. Mahatvapoorna: channel layer RedisChannelLayer hona chahिए jab aap ek se zyada process chalाते ho.',
      },
      {
        q: 'How do you push a WebSocket update from a normal HTTP view or a Celery task, and what should you watch out for?',
        qHi: 'Aap ek normal HTTP view ya ek Celery task se ek WebSocket update kaise push karते ho, aur aapको kis cheez ka dhyaan rakhना chahिए?',
        a: 'You get the channel layer with get_channel_layer from channels dot layers, which returns the configured default layer, and you call group_send on it with the target group name and a message dict that has a type key. From synchronous code — an ordinary view, a normal Celery task — you wrap the call in async_to_sync from asgiref, because group_send is a coroutine. From asynchronous code you just await it. The consumers in that group receive the message and their type-named handler forwards it to their clients. That is the bridge that lets a POST handler update everyone looking at an order, or a finished export task notify the user who requested it. Things to watch: first, wrap the broadcast in transaction dot on_commit when it follows a database write, so you never announce a state change that then rolls back. Second, keep the payload small — group_send copies the message to every member through Redis, so send an id and the changed fields, not a serialized object graph or history. Third, remember the channel layer must be Redis-backed in production or the message only reaches consumers in the same process. Fourth, be aware of fan-out cost: a broadcast to an N-member group is N deliveries, so very large groups with high message rates need capacity planning, and extreme fan-out may belong on a different technology.',
        aHi: 'Aap channels dot layers se get_channel_layer se channel layer leते ho, jо configured default layer return karता hai, aur aap ispar target group name aur ek type key waale message dict ke saath group_send call karते ho. Synchronous code se — ek ordinary view, ek normal Celery task — aap call ko asgiref se async_to_sync mein wrap karते ho, kyunki group_send ek coroutine hai. Asynchronous code se aap bस ise await karते ho. Us group ke consumers message receive karते hain aur unka type-named handler ise unke clients ko forward karता hai. Dhyaan dेने ki cheezein: pehle, broadcast ko transaction dot on_commit mein wrap karो jab ye ek database write ke baad aata hai. Doosra, payload chhota rakhо. Teesra, yाd rakhो channel layer production mein Redis-backed hona chahिए. Chautha, fan-out cost ke prati sajग raho: ek N-member group ko ek broadcast N deliveries hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django + Channels (InMemory). Build a `NotifyConsumer` that in `connect` joins the group `f"user_{self.scope[\'url_route\'][\'kwargs\'][\'uid\']}"` and accepts, and has a handler `notify(self, event)` that does `send_json({"note": event["note"]})`. Route `path("ws/<int:uid>/", ...)`. Connect two communicators as uid 7 and one as uid 9. `group_send("user_7", {"type": "notify", "note": "hi 7"})`. Assert both uid-7 sockets get it and the uid-9 socket stays idle.',
        taskHi: 'Standalone Django + Channels. Ek `NotifyConsumer` banao jо `connect` mein `f"user_{uid}"` group join karता hai. Do communicators uid 7 aur ek uid 9 connect karo. `group_send("user_7", ...)`. Assert dono uid-7 sockets ise paate hain aur uid-9 idle rehта hai.',
        hint: 'Get the layer in the test via `get_channel_layer()` (the configured default). `await comm.receive_nothing(timeout=0.1)` checks idleness.',
        hintHi: 'Test mein layer `get_channel_layer()` (configured default) se lo. `receive_nothing(timeout=0.1)` idleness check karता hai.',
      },
      {
        task: 'Show the `type` -> method mapping. Consumer joins group `"g"`, accepts, and defines `async def price_tick(self, event)` -> `send_json({"price": event["p"]})`. Connect one communicator. `group_send("g", {"type": "price.tick", "p": 101})` -> assert the client receives `{"price": 101}`. Then `group_send("g", {"type": "price.missing", "p": 0})` and assert it raises (catch the exception from the layer/consumer) or leaves the client idle — document which in a comment.',
        taskHi: '`type` -> method mapping dikhाओ. Consumer `"g"` join karता hai aur `async def price_tick(self, event)` define karता hai. `group_send("g", {"type": "price.tick", "p": 101})` -> assert `{"price": 101}`. Phir `"price.missing"` bhejो aur document karो kya hota hai.',
        hint: '`price.tick` -> `price_tick`. A missing handler surfaces as a `ValueError`/exception when the communicator processes the frame — wrap the `receive` in try/except to observe it.',
        hintHi: '`price.tick` -> `price_tick`. Ek missing handler ek exception ke roop mein surface hota hai jab communicator frame process karता hai.',
      },
      {
        task: 'Prove InMemory does not cross "layers". Create TWO separate `InMemoryChannelLayer()` instances directly (simulating two processes). `await layer1.group_add("room", "chan1")`, then `await layer2.group_send("room", {"type": "x"})`. Assert `layer1.receive("chan1")` times out / receives nothing — the send on layer2 never reached layer1\'s group. Write a comment: this is why production needs Redis.',
        taskHi: 'Saabit karo InMemory "layers" ke paar nahi jाता. DO alag `InMemoryChannelLayer()` instances banao. `layer1.group_add("room", "chan1")`, phir `layer2.group_send("room", {"type": "x"})`. Assert `layer1` ko kuch nahi milता. Comment: isiliye production ko Redis chahिए.',
        hint: 'Use `asyncio.wait_for(layer1.receive("chan1"), timeout=0.2)` and expect `asyncio.TimeoutError`. Two instances = two isolated in-process registries, exactly like two Daphne workers.',
        hintHi: '`asyncio.wait_for(layer1.receive("chan1"), timeout=0.2)` istemal karो aur `asyncio.TimeoutError` expect karो. Do instances = do isolated registries, bilkul do Daphne workers jaise.',
      },
    ],

    keyTakeaways: [
      '`self.channel_name` = a unique auto-generated address for ONE connection. A GROUP = a named set of channel names (`"chat_general"`, `"user_42"`, `"dashboard"`), created on demand. `self.send`/`send_json` reaches one client; the channel layer + groups reach many.',
      'STANDARD PATTERN: `await self.channel_layer.group_add(self.group, self.channel_name)` in `connect` (before/after `accept`), `await self.channel_layer.group_discard(self.group, self.channel_name)` in `disconnect`. Every `group_add` needs a matching `group_discard` (symmetry) — else stale members until `group_expiry` (default 86400s).',
      '`group_send(group, msg)` -> `msg` MUST have a `"type"` key -> Channels calls the method named `type` with `.`->`_` on EVERY consumer in the group: `"chat.message"` -> `async def chat_message(self, event)`. No matching method in a member -> that delivery RAISES in that consumer. Every group member must handle every event type sent to it.',
      'BROADCAST FROM OUTSIDE a consumer (view, Celery task, command, signal): `layer = get_channel_layer()`, then SYNC code -> `async_to_sync(layer.group_send)(group, {"type": ..., ...})`; ASYNC code -> `await layer.group_send(...)`. Wrap in `transaction.on_commit(lambda: ...)` when it follows a DB write.',
      '`InMemoryChannelLayer` = groups in a per-process dict. TESTS + single-process dev ONLY. Does NOT cross processes -> with 2+ workers, a `group_send` reaches only same-process consumers ("works locally, half vanish in prod").',
      '`RedisChannelLayer` (`channels_redis`, `CONFIG: {"hosts": [("redis", 6379)]}`) = MANDATORY in production (you always run >1 process). Group registry + routing live in Redis, shared by all workers.',
      'COST: `group_send` to N members = N Redis deliveries, each a full copy of the message. Send an ID + changed fields, NOT a serialized object / history (channels_redis message cap ~1MB). High fan-out (100k viewers) -> consider SSE-from-cache / a pub-sub CDN instead.',
      'Reduce per-message work: precompute expensive data on a Celery beat timer and `group_send` the snapshot to a group — 200 dashboard viewers then cost 1 query, not 200. `group_add`/`discard` are Redis writes -> a reconnect storm (deploy) is a load spike.',
    ],
    keyTakeawaysHi: [
      '`self.channel_name` = EK connection ke liye ek unique auto-generated address. Ek GROUP = channel names ka ek named set, demand par bana. `self.send` ek client tak pahunchता hai; channel layer + groups kई tak.',
      'STANDARD PATTERN: `connect` mein `group_add(self.group, self.channel_name)`, `disconnect` mein `group_discard(...)`. Har `group_add` ko ek matching `group_discard` chahिए — warna `group_expiry` (default 86400s) tak stale members.',
      '`group_send(group, msg)` -> `msg` mein `"type"` key ZAROORI -> Channels `type` naam ka method (`.`->`_`) group ke HAR consumer par call karता hai. Ek member mein koi matching method nahi -> wo delivery RAISE karता hai.',
      'EK CONSUMER KE BAHAR SE BROADCAST (view, Celery task): `layer = get_channel_layer()`, phir SYNC -> `async_to_sync(layer.group_send)(...)`; ASYNC -> `await layer.group_send(...)`. DB write ke baad `transaction.on_commit` mein wrap karो.',
      '`InMemoryChannelLayer` = per-process dict mein groups. SIRF TESTS + single-process dev. Processes ke paar NAHI -> 2+ workers ke saath, ek `group_send` sirf same-process consumers tak.',
      '`RedisChannelLayer` (`channels_redis`) = production mein ANIVARYA. Group registry + routing Redis mein, sabhi workers dwara shared.',
      'COST: N members ko `group_send` = N Redis deliveries, har ek message ki poori copy. Ek ID + badalे fields bhejो, ek serialized object nahi (~1MB cap).',
      'Prati-message kaam kam karो: expensive data ek Celery beat timer par precompute karके snapshot ko group ko `group_send` karो — 200 viewers phir 1 query kharch karते hain.',
    ],
  },
];
