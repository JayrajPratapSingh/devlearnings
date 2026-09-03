/**
 * Django Complete Course — Module 8: Large Data & Background Work, lessons 1-3.
 *
 * Lesson 1: streaming responses — StreamingHttpResponse (a generator, no .content),
 *           FileResponse, Content-Disposition, what breaks streaming (buffering
 *           middleware, ATOMIC_REQUESTS holding a transaction, WSGI worker occupancy),
 *           when NOT to stream.
 * Lesson 2: iterator() & large querysets — the QuerySet result cache loads every row +
 *           model instance into memory; .iterator(chunk_size=) bypasses the cache and
 *           (on Postgres) uses a server-side cursor; .values()/.values_list() skip model
 *           instantiation; never call len()/count() in a loop; batching writes.
 * Lesson 3: large CSV exports — combine 1 + 2: StreamingHttpResponse over a generator
 *           that pulls rows from .iterator(); the Echo() writer trick for csv.writer;
 *           when the export is too big for a request at all -> hand it to Celery
 *           (lesson 6) and email a link.
 *
 * Conventions: see course-django-module7.ts header. Backticks inside simple/simpleHi/
 * content/contentHi are \`; \${ for $+{. Example output is ASCII-only, run with the
 * auto-detected python. DRF/APIClient examples need "django.contrib.auth" in INSTALLED_APPS.
 * Multi-DB examples use file-backed sqlite via tempfile.mkdtemp() (":memory:" aliases are
 * separate connections). Scan for Devanagari/Cyrillic in en/code. tsc --noEmit from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_8: CourseLesson[] = [
  {
    slug: 'dj-streaming-responses',
    title: 'Streaming Responses: `StreamingHttpResponse` & `FileResponse`',
    titleHi: 'Streaming Responses: `StreamingHttpResponse` & `FileResponse`',
    description: 'A normal view builds the entire response body in memory before sending a byte. For a 500 MB export or a live log feed that means the request holds half a gigabyte of RAM (times every concurrent request) and the client waits with a blank screen. `StreamingHttpResponse` sends the body in pieces from a generator — constant memory, first byte immediately.',
    descriptionHi: 'Ek normal view ek byte bhejne se pehle poori response body memory mein banata hai. Ek 500 MB export ya ek live log feed ke liye iska matlab request aadha gigabyte RAM rakhti hai (har concurrent request guna) aur client ek blank screen ke saath intezaar karta hai. `StreamingHttpResponse` body ko ek generator se tukdon mein bhejta hai — constant memory, pehla byte turant.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A restaurant that plates every dish for a 200-person banquet before carrying anything out, versus one that sends each plate the moment it is ready.** The normal `HttpResponse` is the first kitchen: nothing leaves until the last plate is done, so you need counter space for 200 plates at once (memory), the guests sit hungry for an hour (latency), and if one dish burns the whole service is delayed. `StreamingHttpResponse` is the second kitchen — a `yield` per plate. The runner carries out plate 1 while plate 2 is still cooking; the kitchen only ever holds a few plates at a time (constant memory) and the first guest eats within minutes (first byte fast). The trade-offs are real, though: the runner (the WSGI worker) is walking back and forth for the entire meal instead of making one trip, so with only a few runners a few slow banquets block everyone else; and once plate 1 has left the kitchen you cannot recall it if plate 50 catches fire (you have already sent `200 OK` and some rows — you cannot switch to a `500` page).',
      hi: '**Ek restaurant jo 200-vyakti ke banquet ke liye har dish plate karta hai kuch bhi bahar le jaane se pehle, badle ek jo har plate us pal bhejta hai jab wo taiyaar hai.** Normal `HttpResponse` pehli kitchen hai: aakhri plate hone tak kuch nahi jaata, toh aapko ek saath 200 plates ke liye counter space chahiye (memory), guests ek ghanta bhookhe baithte hain (latency), aur agar ek dish jal jaaye toh poori service delay. `StreamingHttpResponse` doosri kitchen hai — prati plate ek `yield`. Runner plate 1 le jaata hai jab plate 2 abhi bhi pak rahi hai; kitchen kabhi bhi ek samay kuch hi plates rakhti hai (constant memory) aur pehla guest minute-bhar mein khaata hai. Trade-offs asli hain: runner (WSGI worker) poore khaane ke liye aage-peeche chal raha hai ek trip ke badle; aur ek baar plate 1 kitchen se nikal gayi aap ise wapas nahi bula sakte agar plate 50 mein aag lag jaaye (aap pehle hi `200 OK` bhej chuke).',
    },

    simple: `**A normal response builds everything, then sends**

\`\`\`python
def report(request):
    rows = Sale.objects.all()                       # 2M rows
    body = "\\n".join(f"{r.id},{r.amount}" for r in rows)   # the WHOLE string in RAM
    return HttpResponse(body, content_type="text/plain")    # nothing sent until now
\`\`\`

**\`StreamingHttpResponse\` — a generator, sent piece by piece**

\`\`\`python
from django.http import StreamingHttpResponse

def report(request):
    def rows():
        for r in Sale.objects.values_list("id", "amount").iterator(chunk_size=2000):
            yield f"{r[0]},{r[1]}\\n"                # one line at a time, constant memory
    return StreamingHttpResponse(rows(), content_type="text/plain")
\`\`\`

\`\`\`
HttpResponse           .content is the full body (bytes). Buffered. Good for pages / small JSON.
StreamingHttpResponse  .streaming_content is an iterator. NO .content attribute (AttributeError).
                       The generator runs as the WSGI server pulls chunks.
FileResponse           a StreamingHttpResponse subclass for file objects -- sets Content-Length,
                       Content-Type, Content-Disposition, handles Range requests, closes the file.
\`\`\`

**\`FileResponse\` for files on disk / in storage**

\`\`\`python
from django.http import FileResponse

def download(request, pk):
    doc = get_object_or_404(Document.objects.filter(owner=request.user), pk=pk)
    return FileResponse(doc.file.open("rb"), as_attachment=True, filename="report.pdf")
    # as_attachment=True -> Content-Disposition: attachment (browser saves, does not render)
\`\`\`

**What breaks streaming**

\`\`\`
GZipMiddleware              buffers the whole body to compress it -> streaming is defeated.
                           (Django skips it for StreamingHttpResponse, but a custom compressor may not.)
Any middleware that reads response.content   -> forces the generator to run fully, in memory.
ATOMIC_REQUESTS = True      the request's transaction stays open until the LAST chunk is sent
                           -> a 30-second download holds a DB transaction for 30 seconds.
WSGI worker model          the worker is busy for the whole stream. 4 workers + 4 slow downloads
                           = the site is down for everyone else. Use more workers, async, or a CDN.
Template rendering         render_to_string builds the whole string -- you cannot stream a template
                           the normal way (there is StreamingHttpResponse(TemplateResponse... but rare).
\`\`\`

**When NOT to stream**

- The body is small (a page, a normal JSON API response) — buffering is simpler and lets middleware work.
- You might need to change the status code based on something that happens late — once the first chunk is sent, the status line is gone.
- The work is genuinely heavy (minutes, or gigabytes): do not stream from a request at all — enqueue a background job (lesson 6), write the file to storage, and email or notify a download link.`,

    simpleHi: `**Ek normal response sab kuch banata hai, phir bhejta hai**

\`\`\`python
def report(request):
    rows = Sale.objects.all()                       # 2M rows
    body = "\\n".join(f"{r.id},{r.amount}" for r in rows)   # POORI string RAM mein
    return HttpResponse(body, content_type="text/plain")    # ab tak kuch nahi bheja
\`\`\`

**\`StreamingHttpResponse\` — ek generator, tukda-tukda bheja**

\`\`\`python
from django.http import StreamingHttpResponse

def report(request):
    def rows():
        for r in Sale.objects.values_list("id", "amount").iterator(chunk_size=2000):
            yield f"{r[0]},{r[1]}\\n"                # ek line ek baar mein, constant memory
    return StreamingHttpResponse(rows(), content_type="text/plain")
\`\`\`

\`\`\`
HttpResponse           .content poori body hai (bytes). Buffered. Pages / chhote JSON ke liye achha.
StreamingHttpResponse  .streaming_content ek iterator hai. koi .content attribute NAHI (AttributeError).
                       Generator tab chalta hai jab WSGI server chunks pull karta hai.
FileResponse           file objects ke liye ek StreamingHttpResponse subclass -- Content-Length,
                       Content-Type, Content-Disposition set karta hai, Range requests handle karta hai.
\`\`\`

**\`FileResponse\` disk / storage par files ke liye**

\`\`\`python
from django.http import FileResponse

def download(request, pk):
    doc = get_object_or_404(Document.objects.filter(owner=request.user), pk=pk)
    return FileResponse(doc.file.open("rb"), as_attachment=True, filename="report.pdf")
    # as_attachment=True -> Content-Disposition: attachment (browser save karta hai, render nahi)
\`\`\`

**Streaming ko kya todta hai**

\`\`\`
GZipMiddleware              compress karne ko poori body buffer karta hai -> streaming haar gaya.
                           (Django ise StreamingHttpResponse ke liye skip karta hai, par custom nahi.)
Koi bhi middleware jo response.content padhta hai   -> generator ko poora chalne pe majboor karta hai.
ATOMIC_REQUESTS = True      request ka transaction AAKHRI chunk bhejne tak khula rehta hai
                           -> ek 30-second download ek DB transaction 30 second rakhta hai.
WSGI worker model          worker poore stream ke liye busy. 4 workers + 4 dheeme downloads
                           = site sab ke liye down. Zyada workers, async, ya ek CDN istemal karo.
Template rendering         render_to_string poori string banata hai -- aap ek template normal
                           tareeke se stream nahi kar sakte.
\`\`\`

**Kab stream NAHI karna**

- Body chhoti hai (ek page, ek normal JSON API response) — buffering saral hai aur middleware kaam karne deta hai.
- Aapko der se hone waali kisi cheez par status code badalne ki zaroorat pad sakti hai — ek baar pehla chunk bhej diya, status line chali gayi.
- Kaam sach mein bhaari hai (minute, ya gigabytes): ek request se stream mat karo — ek background job enqueue karo (lesson 6), file storage mein likho, aur ek download link email/notify karo.`,

    content: `## Buffered vs streamed

\`HttpResponse\` holds \`response.content\` — the complete body as a \`bytes\` object. Django builds it fully, middleware can inspect and rewrite it, and then the WSGI server sends it. Simple, and correct for the 99% case of pages and small API payloads.

\`StreamingHttpResponse\` holds \`response.streaming_content\` — an **iterator**. It has **no \`.content\` attribute at all** (accessing it raises \`AttributeError\`). Django hands the iterator to the WSGI/ASGI server, which pulls one chunk, writes it to the socket, pulls the next, and so on. Your generator function runs incrementally as the client consumes the response. Peak memory is one chunk, not the whole body, and the client's first byte arrives as soon as the first \`yield\` fires.

## \`FileResponse\`

A \`StreamingHttpResponse\` subclass specialised for file-like objects. Pass it an open binary file (from the filesystem, from \`default_storage\`, from \`FieldFile.open("rb")\`) and it:

- sets \`Content-Type\` from the filename,
- sets \`Content-Length\` when the size is known,
- sets \`Content-Disposition: attachment; filename="..."\` when \`as_attachment=True\` (the browser downloads instead of rendering),
- supports HTTP \`Range\` requests (resumable downloads, video seeking),
- closes the file when the response is finished.

Always scope the lookup — \`get_object_or_404(Document.objects.filter(owner=request.user), pk=pk)\` — so a user cannot download someone else's file by guessing an id (the IDOR pattern from Module 4).

## What defeats streaming

The streaming only works if nothing downstream materialises the whole body:

- **\`GZipMiddleware\`** needs the full body to compute a compressed blob, so it would break streaming. Django's version **skips \`StreamingHttpResponse\`** automatically — but that means streamed responses are not compressed; compress at the reverse proxy / CDN instead, or accept the size.
- **Any middleware that touches \`response.content\`** (a custom minifier, an ETag-from-body middleware, some APM instrumentation) forces the iterator to run fully and buffers it — silently undoing everything.
- **\`ATOMIC_REQUESTS = True\`** wraps the whole request in a transaction that commits only after the response is fully sent. A streamed response is "fully sent" only when the last chunk leaves — so the database transaction (and its connection) is held for the entire duration of the download. For a large export, that is a long-lived transaction blocking \`VACUUM\` and holding a pooled connection. Disable \`ATOMIC_REQUESTS\` for streaming views, or run them without a wrapping transaction.
- **The WSGI worker model.** A synchronous worker (gunicorn sync, uWSGI) is occupied for the entire lifetime of the stream. With \`workers = 4\`, four concurrent slow downloads mean zero capacity for anyone else. Mitigations: many more workers, an async worker class (\`gunicorn -k uvicorn.workers.UvicornWorker\` with an async view), or — best — put large static exports behind a CDN / object storage and never stream them from Django at all.

## Streaming needs a lazy source

\`yield\`-ing from \`Sale.objects.all()\` directly still loads all rows — the QuerySet cache fills on the first iteration (Module 3). You must pair streaming with a **lazy row source**: \`.iterator(chunk_size=N)\` (lesson 2), \`.values_list(...)\` to avoid model instantiation, or reading an external file in chunks. Streaming a response whose generator internally builds a big list defeats the point.

## The status-code trap

An HTTP response sends its status line and headers **first**, before any body. Once your generator has yielded its first chunk, the client already has \`200 OK\`. If chunk 4,000 hits an exception, you cannot retroactively send a \`500\` — the client gets a truncated \`200\` response with no clean way to know it failed. For exports where partial output is dangerous, either validate everything up front before the first \`yield\`, or generate to a file, verify it, then serve the finished file.

## When the job is too big for a request

Streaming solves *memory* and *first-byte latency*. It does not solve *duration*. If generating the export takes minutes, a streamed request still ties up a worker for minutes and any proxy timeout (nginx \`proxy_read_timeout\`, a load balancer's 60s idle limit) will kill it mid-stream. The right shape for genuinely heavy work: accept the request, enqueue a Celery task (lesson 6), return \`202 Accepted\` immediately, have the task write the file to object storage, and notify the user with a link when it is done.`,

    contentHi: `## Buffered vs streamed

\`HttpResponse\` \`response.content\` rakhta hai — poori body ek \`bytes\` object ke roop mein. Django ise poora banata hai, middleware ise inspect aur rewrite kar sakta hai, phir WSGI server ise bhejta hai. Saral, aur pages aur chhote API payloads ke 99% case ke liye sahi.

\`StreamingHttpResponse\` \`response.streaming_content\` rakhta hai — ek **iterator**. Iske paas **koi \`.content\` attribute nahi** (ise access karna \`AttributeError\` raise karta hai). Django iterator ko WSGI/ASGI server ko deta hai, jo ek chunk pull karta hai, ise socket par likhta hai, agla pull karta hai. Aapka generator function client ke response consume karne ke saath incrementally chalta hai. Peak memory ek chunk hai, poori body nahi.

## \`FileResponse\`

File-jaise objects ke liye ek \`StreamingHttpResponse\` subclass. Ise ek open binary file do aur ye: filename se \`Content-Type\` set karta hai, size pata ho toh \`Content-Length\`, \`as_attachment=True\` par \`Content-Disposition: attachment\` (browser download karta hai render nahi), HTTP \`Range\` requests support karta hai (resumable downloads, video seeking), aur response khatam hone par file close karta hai.

Lookup hamesha scope karo — \`get_object_or_404(Document.objects.filter(owner=request.user), pk=pk)\` — taaki ek user kisi aur ki file ek id guess karke download na kar sake (Module 4 ka IDOR pattern).

## Streaming ko kya haraata hai

Streaming tabhi kaam karta hai jab downstream kuch bhi poori body materialise na kare:

- **\`GZipMiddleware\`** ko ek compressed blob compute karne ko poori body chahiye. Django ka version \`StreamingHttpResponse\` ko automatically **skip karta hai** — par iska matlab streamed responses compressed nahi hote; reverse proxy / CDN par compress karo.
- **Koi bhi middleware jo \`response.content\` ko chhoota hai** iterator ko poora chalne pe majboor karta hai aur ise buffer karta hai — chupchaap sab kuch undo karke.
- **\`ATOMIC_REQUESTS = True\`** poore request ko ek transaction mein wrap karta hai jo response poori tarah bhejne ke baad hi commit hota hai. Ek streamed response "poori tarah bheja" tabhi hai jab aakhri chunk nikalta hai — toh database transaction (aur iska connection) poore download ki avdhi ke liye held hai. Streaming views ke liye \`ATOMIC_REQUESTS\` disable karo.
- **WSGI worker model.** Ek synchronous worker poore stream ke jeevan-kaal ke liye occupied hai. \`workers = 4\` ke saath, chaar concurrent dheeme downloads ka matlab kisi aur ke liye zero capacity. Upaay: bahut zyada workers, ek async worker class, ya — sabse achha — bade static exports ko ek CDN / object storage ke peeche daalo.

## Streaming ko ek lazy source chahiye

\`Sale.objects.all()\` se seedhe \`yield\` karna abhi bhi saari rows load karta hai — QuerySet cache pehli iteration par bhar jaata hai (Module 3). Aapko streaming ko ek **lazy row source** ke saath pair karna hi hai: \`.iterator(chunk_size=N)\` (lesson 2), model instantiation se bachne ko \`.values_list(...)\`, ya ek external file ko chunks mein padhna.

## Status-code trap

Ek HTTP response apni status line aur headers **pehle** bhejta hai, kisi body se pehle. Ek baar aapke generator ne apna pehla chunk yield kar diya, client ke paas pehle se \`200 OK\` hai. Agar chunk 4,000 par ek exception aata hai, aap retroactively ek \`500\` nahi bhej sakte — client ko ek truncated \`200\` milta hai. Aise exports ke liye jahaan partial output khatarnak hai, ya sab kuch pehle validate karo, ya ek file mein generate karke, verify karke, phir finished file serve karo.

## Jab job ek request ke liye bahut badi hai

Streaming *memory* aur *first-byte latency* solve karta hai. Ye *duration* solve nahi karta. Agar export generate karne mein minute lagte hain, ek streamed request abhi bhi ek worker ko minuton ke liye baandhta hai aur koi bhi proxy timeout ise beech-stream maar dega. Sach mein bhaari kaam ke liye sahi shape: request accept karo, ek Celery task enqueue karo (lesson 6), turant \`202 Accepted\` return karo, task file ko object storage mein likhe, aur ho jaane par user ko ek link se notify karo.`,

    examples: [
      {
        title: 'StreamingHttpResponse: no .content, the generator runs as chunks are pulled',
        titleHi: 'StreamingHttpResponse: koi .content nahi, generator chunks pull hone par chalta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.http import StreamingHttpResponse, HttpResponse
from django.urls import path
from django.test import Client

PRODUCED = []

def big_export(request):
    def rows():
        for i in range(5):
            PRODUCED.append(i)          # records WHEN each chunk is generated
            yield f"row-{i}\\n"
    return StreamingHttpResponse(rows(), content_type="text/plain")

urlpatterns = [path("export/", big_export)]
c = Client()

r = c.get("/export/")
print("status:", r.status_code)
print("is streaming:", r.streaming)
print("produced so far (generator not consumed yet):", PRODUCED)

try:
    r.content
except AttributeError as e:
    print("r.content ->", type(e).__name__)

body = b"".join(r.streaming_content)
print("produced after consuming:", PRODUCED)
print("body:", " | ".join(body.decode().split()))

# a normal response for contrast
r2 = HttpResponse("small body")
print("HttpResponse has .content:", r2.content)`,
        output: `status: 200
is streaming: True
produced so far (generator not consumed yet): []
r.content -> AttributeError
produced after consuming: [0, 1, 2, 3, 4]
body: row-0 | row-1 | row-2 | row-3 | row-4
HttpResponse has .content: b'small body'`,
        explain: 'The GET returns a response object, but PRODUCED is still empty -- the generator body has not run at all yet, because a StreamingHttpResponse only executes its iterator as something consumes it. Accessing r.content raises AttributeError, since a streaming response has no in-memory body; the data is only available through r.streaming_content. Joining that iterator finally drives the generator, and now PRODUCED is [0,1,2,3,4] -- proof the rows were produced lazily, one at a time, as they were pulled. The plain HttpResponse for contrast has a normal .content attribute holding the full body.',
        explainHi: 'GET ek response object return karta hai, par PRODUCED abhi bhi khali hai -- generator body bilkul nahi chala, kyunki ek StreamingHttpResponse apna iterator sirf tab execute karta hai jab kuch ise consume karta hai. r.content access karna AttributeError raise karta hai, kyunki ek streaming response ki koi in-memory body nahi; data sirf r.streaming_content ke zariye available hai. Us iterator ko join karna aakhirkar generator ko drive karta hai, aur ab PRODUCED [0,1,2,3,4] hai -- saboot ki rows lazily banIn, ek samay ek. Contrast ke liye plain HttpResponse ke paas ek normal .content attribute hai.',
      },
      {
        title: 'FileResponse: Content-Disposition, Content-Length, and it closes the file',
        titleHi: 'FileResponse: Content-Disposition, Content-Length, aur ye file close karta hai',
        code: `import django, tempfile, os
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.http import FileResponse
from django.urls import path
from django.test import Client

tmp = tempfile.mkdtemp()
path_pdf = os.path.join(tmp, "report.pdf")
with open(path_pdf, "wb") as f:
    f.write(b"%PDF-1.4 fake pdf bytes " * 10)       # 24 bytes x 10 = 240

handles = {}

def download(request):
    fh = open(path_pdf, "rb")
    handles["dl"] = fh
    return FileResponse(fh, as_attachment=True, filename="quarterly.pdf")

def inline(request):
    return FileResponse(open(path_pdf, "rb"))          # no as_attachment -> browser may render

urlpatterns = [path("dl/", download), path("view/", inline)]
c = Client()

r = c.get("/dl/")
print("status:", r.status_code)
print("Content-Type:", r["Content-Type"])
print("Content-Disposition:", r["Content-Disposition"])
print("Content-Length:", r["Content-Length"])
b"".join(r.streaming_content)
r.close()                                             # FileResponse closes its file on response close
print("file closed after response closed:", handles["dl"].closed)

r2 = c.get("/view/")
print("inline disposition:", r2["Content-Disposition"])`,
        output: `status: 200
Content-Type: application/pdf
Content-Disposition: attachment; filename="quarterly.pdf"
Content-Length: 240
file closed after response closed: True
inline disposition: inline; filename="report.pdf"`,
        explain: 'FileResponse infers Content-Type from the filename (.pdf -> application/pdf), sets Content-Length from the file size (24 bytes x 10 = 240), and with as_attachment=True writes Content-Disposition: attachment so the browser saves rather than renders; without it the disposition is inline. Crucially, FileResponse registers the file handle to be closed when the response is closed -- after joining streaming_content and calling r.close(), the underlying handle reports .closed is True. You never manage the file lifecycle yourself, which is why FileResponse is preferred over hand-rolling a StreamingHttpResponse for files.',
        explainHi: 'FileResponse filename se Content-Type infer karta hai (.pdf -> application/pdf), file size se Content-Length set karta hai (24 bytes x 10 = 240), aur as_attachment=True ke saath Content-Disposition: attachment likhta hai taaki browser render ke bajaye save kare; iske bina disposition inline hai. Mahatvapoorn roop se, FileResponse file handle ko response close hone par band karne ke liye register karta hai -- join aur r.close() ke baad, underlying handle .closed True report karta hai. Aapko kabhi file lifecycle khud manage nahi karna padta.',
      },
      {
        title: 'A lazy generator streams in constant memory; a list-building one does not',
        titleHi: 'Ek lazy generator constant memory mein stream karta hai; ek list-banane wala nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.http import StreamingHttpResponse
from django.urls import path
from django.test import Client

MAX_BUFFER = {"lazy": 0, "eager": 0}

def lazy_view(request):
    def gen():
        for i in range(1000):
            # at any moment only this one string exists
            MAX_BUFFER["lazy"] = max(MAX_BUFFER["lazy"], 1)
            yield f"{i}\\n"
    return StreamingHttpResponse(gen(), content_type="text/plain")

def eager_view(request):
    def gen():
        buf = [f"{i}\\n" for i in range(1000)]     # WHOLE thing in memory before the first yield
        MAX_BUFFER["eager"] = len(buf)
        for line in buf:
            yield line
    return StreamingHttpResponse(gen(), content_type="text/plain")

urlpatterns = [path("lazy/", lazy_view), path("eager/", eager_view)]
c = Client()

n_lazy = len(b"".join(c.get("/lazy/").streaming_content).splitlines())
n_eager = len(b"".join(c.get("/eager/").streaming_content).splitlines())
print("lazy  : rows =", n_lazy, "| peak items buffered =", MAX_BUFFER["lazy"])
print("eager : rows =", n_eager, "| peak items buffered =", MAX_BUFFER["eager"])
print("same output, wildly different memory profile")`,
        output: `lazy  : rows = 1000 | peak items buffered = 1
eager : rows = 1000 | peak items buffered = 1000
same output, wildly different memory profile`,
        explain: 'Both views produce the exact same 1000 lines of output, because they yield the same strings in the same order. The difference is purely memory shape. The lazy generator constructs each line inside the loop and yields it immediately, so at any instant only one string exists -- peak buffered is 1. The eager generator first builds the entire list of 1000 strings before its first yield, so the whole dataset is resident in memory before a single byte is sent -- peak buffered is 1000. Scale that to millions of rows and the eager version is an out-of-memory crash while the lazy one stays flat. Streaming only helps if the generator itself is lazy.',
        explainHi: 'Dono views bilkul same 1000 lines output produce karte hain, kyunki wo same strings same order mein yield karte hain. Antar puri tarah memory shape mein hai. Lazy generator har line loop ke andar banata hai aur turant yield karta hai, toh kisi bhi pal sirf ek string exist karti hai -- peak buffered 1 hai. Eager generator pehle 1000 strings ki poori list banata hai apne pehle yield se pehle, toh poora dataset memory mein resident hai ek byte bhejne se pehle -- peak buffered 1000. Ise millions of rows tak scale karo aur eager version ek OOM crash hai jabki lazy flat rehta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def export(request):
    def rows():
        for r in Sale.objects.all():          # QuerySet cache fills on first iteration
            yield f"{r.id},{r.amount}\\n"
    return StreamingHttpResponse(rows(), content_type="text/csv")
# the response streams, but Sale.objects.all() already loaded all 2M rows + model instances`,
        right: `def export(request):
    def rows():
        for id, amount in Sale.objects.values_list("id", "amount").iterator(chunk_size=2000):
            yield f"{id},{amount}\\n"
    return StreamingHttpResponse(rows(), content_type="text/csv")`,
        why: 'Streaming the response body is only half the job — the row source has to be lazy too. Iterating `Sale.objects.all()` triggers the QuerySet result cache, which loads every row and builds a full model instance for each, so peak memory is the entire table before the first chunk is even yielded. `.iterator(chunk_size=N)` bypasses the cache and fetches in batches (a server-side cursor on PostgreSQL), and `.values_list()` skips model instantiation entirely. Now both ends are streaming.',
        whyHi: 'Response body stream karna kaam ka aadha hi hai — row source ko bhi lazy hona chahiye. `Sale.objects.all()` iterate karna QuerySet result cache trigger karta hai, jo har row load karta hai aur har ek ke liye ek poora model instance banata hai, toh peak memory poori table hai pehla chunk yield hone se pehle. `.iterator(chunk_size=N)` cache bypass karta hai aur batches mein fetch karta hai (PostgreSQL par ek server-side cursor), aur `.values_list()` model instantiation poori tarah skip karta hai.',
      },
      {
        wrong: `# settings.py
DATABASES["default"]["ATOMIC_REQUESTS"] = True

def big_download(request):                      # streams for 45 seconds
    return StreamingHttpResponse(generate_huge_csv(), content_type="text/csv")
# a DB transaction stays open for the full 45 seconds of every download`,
        right: `from django.db import transaction

@transaction.non_atomic_requests            # opt this view out of ATOMIC_REQUESTS
def big_download(request):
    return StreamingHttpResponse(generate_huge_csv(), content_type="text/csv")`,
        why: 'Under `ATOMIC_REQUESTS`, the per-request transaction commits only when the response has been *fully sent*. For a streamed response that is when the last chunk leaves — so a 45-second download holds an open transaction (and its pooled DB connection) for 45 seconds. Long transactions block `VACUUM`, pin the connection, and can exhaust a small pool. `@transaction.non_atomic_requests` opts the view out; the generator then runs its queries in autocommit, which is what you want for a read-only export.',
        whyHi: '`ATOMIC_REQUESTS` ke tahat, per-request transaction tabhi commit hota hai jab response *poori tarah bhej diya gaya*. Ek streamed response ke liye wo tab hai jab aakhri chunk nikalta hai — toh ek 45-second download ek open transaction (aur iska pooled DB connection) 45 second rakhta hai. Lambe transactions `VACUUM` block karte hain aur ek chhote pool ko khatam kar sakte hain. `@transaction.non_atomic_requests` view ko opt out karta hai; generator phir apni queries autocommit mein chalata hai.',
      },
      {
        wrong: `def export(request):
    def rows():
        yield header_line()
        for r in qs.iterator():
            if r.corrupt:
                raise ValueError("bad row")     # chunk 900 -- but 899 rows already sent as 200 OK
            yield format_row(r)
    return StreamingHttpResponse(rows(), content_type="text/csv")`,
        right: `def export(request):
    if qs.filter(corrupt=True).exists():          # validate BEFORE the first yield
        return HttpResponseBadRequest("dataset has corrupt rows")
    def rows():
        yield header_line()
        for r in qs.iterator():
            yield format_row(r)
    return StreamingHttpResponse(rows(), content_type="text/csv")`,
        why: 'The status line and headers are sent before the body. Once the generator yields its first chunk the client has `200 OK`; an exception on a later chunk cannot change that — the client receives a truncated `200` response and has no reliable signal that the export is incomplete. Anything that could fail the whole export must be checked up front, before the first `yield`. If validity can only be known mid-stream, generate to a temp file, verify it, and then serve the finished file (or hand the job to a background task).',
        whyHi: 'Status line aur headers body se pehle bheje jaate hain. Ek baar generator apna pehla chunk yield kar deta hai client ke paas `200 OK` hai; ek baad ke chunk par exception ise badal nahi sakta — client ek truncated `200` response paata hai aur uske paas koi reliable signal nahi ki export adhoora hai. Kuch bhi jo poore export ko fail kar sakta hai pehle `yield` se pehle check hona chahiye. Agar validity sirf beech-stream pata chal sakti hai, ek temp file mein generate karke, verify karke, phir finished file serve karo.',
      },
    ],

    realWorld: [
      {
        en: '**A CSV/NDJSON export endpoint that streams from `.values_list().iterator()`** — a few hundred lines of memory regardless of table size, first byte in milliseconds, and `@transaction.non_atomic_requests` so it does not hold a transaction. Behind it, a hard row-count ceiling that redirects to the async-export flow (lesson 6) for anything truly large.',
        hi: '**Ek CSV/NDJSON export endpoint jo `.values_list().iterator()` se stream karta hai** — table size chahe jo ho kuch sau lines memory, milliseconds mein pehla byte, aur `@transaction.non_atomic_requests`. Iske peeche, ek hard row-count ceiling jo kisi bhi sach mein bade ke liye async-export flow (lesson 6) par redirect karta hai.',
      },
      {
        en: '**`FileResponse(storage.open(key, "rb"), as_attachment=True)` for user document downloads** — with the lookup scoped to `owner=request.user`, `Range` support for resumable large-file downloads, and the file handle auto-closed. For public/static assets the same files are served straight from S3/CloudFront and never touch Django.',
        hi: '**User document downloads ke liye `FileResponse(storage.open(key, "rb"), as_attachment=True)`** — lookup `owner=request.user` par scoped, resumable large-file downloads ke liye `Range` support, aur file handle auto-closed. Public/static assets ke liye wahi files seedhe S3/CloudFront se serve hoti hain aur kabhi Django ko nahi chhooti.',
      },
      {
        en: '**A Server-Sent Events (`text/event-stream`) endpoint on an async view** — `async def` + `StreamingHttpResponse` with an async generator + `gunicorn -k uvicorn.workers.UvicornWorker`, so thousands of idle SSE connections do not each pin a sync worker. Progress bars for long jobs and live dashboards use this.',
        hi: '**Ek async view par ek Server-Sent Events (`text/event-stream`) endpoint** — `async def` + `StreamingHttpResponse` ek async generator ke saath + `gunicorn -k uvicorn.workers.UvicornWorker`, taaki hazaaron idle SSE connections har ek ek sync worker pin na karein. Lambe jobs ke progress bars aur live dashboards ise istemal karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `HttpResponse` and `StreamingHttpResponse`, and what has to be true for streaming to actually help?',
        qHi: '`HttpResponse` aur `StreamingHttpResponse` mein kya antar hai, aur streaming ke sach mein madad karne ke liye kya sach hona chahiye?',
        a: 'HttpResponse has a content attribute holding the complete response body as bytes. The view builds the whole body, middleware can read and rewrite it, and then the server sends it in one go. That is correct and simplest for pages and small API responses. StreamingHttpResponse instead has a streaming_content attribute that is an iterator, and it has no content attribute at all — accessing content raises AttributeError. Django gives the iterator to the WSGI or ASGI server, which pulls one chunk, writes it to the socket, pulls the next, and so on, so your generator runs incrementally as the client consumes the response. The benefits are constant peak memory — one chunk instead of the whole body — and the first byte reaching the client as soon as the first yield fires. For that to actually help, several things have to hold. First, the data source inside the generator must also be lazy: yielding from QuerySet.all() still loads every row because the result cache fills on first iteration, so you need iterator with a chunk_size, or values_list to skip model instances. Second, nothing downstream can materialise the body: GZipMiddleware buffers to compress, though Django skips it for streaming responses; any custom middleware that reads response.content forces the whole generator to run and buffers it. Third, if ATOMIC_REQUESTS is on, the per-request transaction stays open until the last chunk is sent, so a long download holds a DB transaction and connection the whole time — you opt the view out with transaction.non_atomic_requests. Fourth, a synchronous WSGI worker is occupied for the entire stream, so a handful of slow downloads can starve the site; you need many workers, an async worker, or a CDN.',
        aHi: 'HttpResponse ke paas ek content attribute hai jo poori response body bytes ke roop mein rakhta hai. View poori body banata hai, middleware ise padh aur rewrite kar sakta hai, phir server ise ek saath bhejta hai. Ye pages aur chhote API responses ke liye sahi aur sabse saral hai. StreamingHttpResponse ke paas badle ek streaming_content attribute hai jo ek iterator hai, aur iske paas koi content attribute nahi — content access karna AttributeError raise karta hai. Django iterator ko WSGI ya ASGI server ko deta hai, jo ek chunk pull karta hai, socket par likhta hai, agla pull karta hai, toh aapka generator client ke response consume karne ke saath incrementally chalta hai. Fayde constant peak memory hain — poori body ke badle ek chunk — aur pehla byte pehle yield ke fire hote hi client tak pahunchna. Iske sach mein madad karne ke liye kई cheezein sach honi chahiye. Pehla, generator ke andar data source bhi lazy hona chahiye: QuerySet.all() se yield karna abhi bhi har row load karta hai, toh aapko chunk_size ke saath iterator chahiye, ya model instances skip karne ko values_list. Doosra, downstream kuch bhi body ko materialise nahi kar sakta. Teesra, agar ATOMIC_REQUESTS on hai, per-request transaction aakhri chunk bhejne tak khula rehta hai. Chautha, ek synchronous WSGI worker poore stream ke liye occupied hai.',
      },
      {
        q: 'A user wants to download a 2 GB export that takes 3 minutes to generate. Walk through why streaming from the request is still the wrong answer, and what you would do.',
        qHi: 'Ek user ek 2 GB export download karna chahta hai jo generate karne mein 3 minute lagta hai. Bataiye ki request se stream karna abhi bhi galat jawab kyun hai, aur aap kya karenge.',
        a: 'Streaming fixes two things: memory, because you only hold one chunk at a time instead of 2 GB, and time to first byte, because the client starts receiving immediately. It does not fix duration. The request still takes 3 minutes end to end, and during those 3 minutes a synchronous worker is fully occupied doing nothing but feeding this one download — with a small worker pool, a few of these and the site is unavailable. Worse, almost every layer in front of Django has an idle or total timeout: nginx proxy_read_timeout defaults to 60 seconds, load balancers commonly cut connections at 60 seconds of no data or a few minutes total, and the browser itself may give up. So the download is likely to be killed mid-stream, and because the status line already said 200 OK the client cannot cleanly tell it got a truncated file. The right shape is to make it asynchronous. The request handler validates the parameters, creates an Export row with status pending, enqueues a Celery task with the export id, and returns 202 Accepted with a URL to poll or a promise to notify. The Celery worker generates the file — it can itself stream row batches from iterator to keep memory flat — and writes it directly to object storage like S3. When done it updates the Export row to ready with the storage key and sends the user an email or in-app notification with a time-limited signed download URL. The actual file download is then either a direct S3 pre-signed URL, so it never touches Django, or a FileResponse streaming from storage. Retries, progress, and failure handling all become tractable because the work is a tracked job rather than an HTTP request.',
        aHi: 'Streaming do cheezein theek karta hai: memory, kyunki aap 2 GB ke badle ek samay ek chunk rakhte ho, aur time to first byte, kyunki client turant receive karna shuru karta hai. Ye duration theek nahi karta. Request abhi bhi end to end 3 minute leta hai, aur un 3 minuton mein ek synchronous worker poori tarah occupied hai sirf is ek download ko feed karne mein — ek chhote worker pool ke saath, inme se kuch aur site unavailable. Aur bura, Django ke aage lगbhag har layer ka ek idle ya total timeout hai: nginx proxy_read_timeout default 60 second, load balancers aksar 60 second bina data ya kuch minute total par connections kaat dete hain. Toh download beech-stream maara jaane ki sambhavna hai, aur kyunki status line pehle hi 200 OK keh chuki client saaf-saaf nahi bata sakta ki use ek truncated file mili. Sahi shape ise asynchronous banana hai. Request handler parameters validate karta hai, status pending ke saath ek Export row banata hai, export id ke saath ek Celery task enqueue karta hai, aur poll karne ke URL ke saath 202 Accepted return karta hai. Celery worker file generate karta hai — wo khud memory flat rakhne ko iterator se row batches stream kar sakta hai — aur ise seedhe S3 jaise object storage mein likhta hai. Ho jaane par ye Export row ko ready update karta hai aur user ko ek time-limited signed download URL ke saath email bhejta hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django, `MIDDLEWARE=[]`. A view `big_export` returning `StreamingHttpResponse` over a generator that appends the index to a module-level `PRODUCED` list and yields `f"row-{i}\\n"` for `i` in `range(5)`. With `django.test.Client`: `GET /export/` -> assert `response.streaming` is `True`, assert `PRODUCED == []` immediately after the GET (generator not consumed), assert accessing `response.content` raises `AttributeError`, then `b"".join(response.streaming_content)` and assert `PRODUCED == [0,1,2,3,4]` and the body has 5 lines.',
        taskHi: 'Standalone Django, `MIDDLEWARE=[]`. Ek view `big_export` jo `StreamingHttpResponse` return kare ek generator ke upar jo index ko module-level `PRODUCED` list mein append kare aur `f"row-{i}\\n"` yield kare. `Client` se: `GET` -> `response.streaming` `True`, GET ke turant baad `PRODUCED == []`, `response.content` -> `AttributeError`, phir consume karke `PRODUCED == [0,1,2,3,4]`.',
        hint: '`from django.http import StreamingHttpResponse`. The generator body does not run until something iterates `response.streaming_content`. `try: response.content / except AttributeError`.',
        hintHi: '`from django.http import StreamingHttpResponse`. Generator body tab tak nahi chalta jab tak kuch `response.streaming_content` iterate na kare. `try: response.content / except AttributeError`.',
      },
      {
        task: 'Write a temp PDF-ish file with `tempfile.mkdtemp()` + `open(path, "wb")`. A view returning `FileResponse(open(path, "rb"), as_attachment=True, filename="q.pdf")`. With `Client`: `GET` -> assert `Content-Type` is `application/pdf`, `Content-Disposition` starts with `attachment; filename="q.pdf"`, and `Content-Length` equals the file size. Grab `response.file_to_stream`, consume `response.streaming_content`, and assert the handle is now `.closed`.',
        taskHi: '`tempfile.mkdtemp()` + `open(path, "wb")` se ek temp PDF-ish file likho. Ek view jo `FileResponse(open(path, "rb"), as_attachment=True, filename="q.pdf")` return kare. `Client` se: `Content-Type` `application/pdf`, `Content-Disposition` `attachment; filename="q.pdf"` se shuru, `Content-Length` = file size. `response.file_to_stream` lo, consume karo, phir `.closed` assert karo.',
        hint: '`from django.http import FileResponse`. `FileResponse` infers `Content-Type` from the `filename`. `response.file_to_stream` is the underlying file object; it is closed when the response is fully consumed / closed.',
        hintHi: '`from django.http import FileResponse`. `FileResponse` `filename` se `Content-Type` infer karta hai. `response.file_to_stream` underlying file object hai.',
      },
      {
        task: 'Two streaming views. `lazy_view`\'s generator yields `f"{i}\\n"` for `i` in `range(1000)` one at a time. `eager_view`\'s generator first builds `buf = [f"{i}\\n" for i in range(1000)]`, records `len(buf)` into a dict, then yields from `buf`. With `Client`, consume both and assert: same 1000 lines of output from each, but the recorded "peak buffered" is `1` for lazy and `1000` for eager. Write one sentence in a comment on why the output is identical but the memory is not.',
        taskHi: 'Do streaming views. `lazy_view` ka generator `f"{i}\\n"` ek baar mein yield kare. `eager_view` ka generator pehle `buf = [...]` banaye, `len(buf)` ek dict mein record kare, phir `buf` se yield kare. `Client` se dono consume karo: same 1000 lines, par "peak buffered" lazy ke liye `1` aur eager ke liye `1000`. Ek comment mein ek vakya likho kyun output same par memory nahi.',
        hint: 'Both produce the same bytes because the same strings are yielded in the same order. The difference is *when* they exist: lazy holds one string at a time; eager materialises the whole list before the first `yield`, so peak memory is the entire dataset.',
        hintHi: 'Dono same bytes produce karte hain kyunki same strings same order mein yield hote hain. Antar *kab* wo exist karte hain: lazy ek samay ek string rakhta hai; eager pehle `yield` se pehle poori list materialise karta hai.',
      },
    ],

    keyTakeaways: [
      '`HttpResponse` = `.content` is the full body in memory; middleware can rewrite it; sent in one go. Correct for pages + small JSON. `StreamingHttpResponse` = `.streaming_content` is an iterator, NO `.content` (AttributeError); the generator runs as the server pulls chunks -> constant memory, fast first byte.',
      '`FileResponse` (a `StreamingHttpResponse` subclass) for file objects: sets `Content-Type`/`Content-Length`, `Content-Disposition: attachment` with `as_attachment=True`, supports `Range` requests, and CLOSES the file when done. Always scope the lookup (`owner=request.user`) — IDOR.',
      'Streaming needs a LAZY source: `yield`-ing from `qs.all()` still fills the QuerySet cache (all rows + model instances). Pair with `.iterator(chunk_size=N)` + `.values_list(...)`.',
      '`GZipMiddleware` would break streaming, so Django SKIPS it for `StreamingHttpResponse` (streamed responses are uncompressed — compress at the CDN). Any custom middleware reading `response.content` forces the whole generator to run and buffers it.',
      '`ATOMIC_REQUESTS = True` keeps the request transaction open until the LAST chunk is sent -> a long download holds a DB transaction + connection. Opt streaming views out with `@transaction.non_atomic_requests`.',
      'A sync WSGI worker is occupied for the ENTIRE stream. 4 workers + 4 slow downloads = site down. Mitigate with many workers, async worker class + `async def`, or a CDN.',
      'Status line + headers go FIRST. Once the first chunk is yielded the client has `200 OK` — a later exception cannot become a `500`, the client just gets a truncated `200`. Validate everything BEFORE the first `yield`.',
      'Streaming fixes MEMORY + first-byte latency, NOT DURATION. If generating takes minutes, a proxy timeout kills it mid-stream and a worker is pinned the whole time -> enqueue a Celery task (lesson 6), write to object storage, notify a signed link.',
    ],
    keyTakeawaysHi: [
      '`HttpResponse` = `.content` poori body memory mein; middleware ise rewrite kar sakta hai; ek saath bheja. Pages + chhote JSON ke liye sahi. `StreamingHttpResponse` = `.streaming_content` ek iterator, koi `.content` NAHI (AttributeError); generator tab chalta hai jab server chunks pull karta hai -> constant memory, tez pehla byte.',
      '`FileResponse` (ek `StreamingHttpResponse` subclass) file objects ke liye: `Content-Type`/`Content-Length` set karta hai, `as_attachment=True` ke saath `Content-Disposition: attachment`, `Range` requests support, aur ho jaane par file CLOSE karta hai. Lookup hamesha scope karo (`owner=request.user`) — IDOR.',
      'Streaming ko ek LAZY source chahiye: `qs.all()` se `yield` karna abhi bhi QuerySet cache bharta hai. `.iterator(chunk_size=N)` + `.values_list(...)` ke saath pair karo.',
      '`GZipMiddleware` streaming todega, toh Django ise `StreamingHttpResponse` ke liye SKIP karta hai (streamed responses uncompressed — CDN par compress karo). Koi bhi custom middleware jo `response.content` padhta hai poore generator ko chalne pe majboor karta hai.',
      '`ATOMIC_REQUESTS = True` request transaction ko AAKHRI chunk bhejne tak khula rakhta hai -> ek lamba download ek DB transaction + connection rakhta hai. Streaming views ko `@transaction.non_atomic_requests` se opt out karo.',
      'Ek sync WSGI worker POORE stream ke liye occupied hai. 4 workers + 4 dheeme downloads = site down. Zyada workers, async worker class + `async def`, ya ek CDN se mitigate karo.',
      'Status line + headers PEHLE jaate hain. Ek baar pehla chunk yield ho gaya client ke paas `200 OK` hai — ek baad ka exception `500` nahi ban sakta. Sab kuch pehle `yield` se PEHLE validate karo.',
      'Streaming MEMORY + first-byte latency theek karta hai, DURATION NAHI. Agar generate karne mein minute lagte hain, ek proxy timeout ise beech-stream maar deta hai -> ek Celery task enqueue karo (lesson 6), object storage mein likho, ek signed link notify karo.',
    ],
  },

  {
    slug: 'dj-iterator-and-large-querysets',
    title: '`iterator()`, `chunk_size` & Processing Large QuerySets',
    titleHi: '`iterator()`, `chunk_size` & Bade QuerySets Process Karna',
    description: 'The moment you iterate a QuerySet, Django loads **every matching row** into memory and builds a full model instance for each — then keeps them all in the result cache. For a 5-million-row backfill that is an out-of-memory crash. `.iterator()` streams the rows in batches and never caches them.',
    descriptionHi: 'Jis pal aap ek QuerySet iterate karte hain, Django **har matching row** memory mein load karta hai aur har ek ke liye ek poora model instance banata hai — phir unhe sab result cache mein rakhta hai. Ek 5-million-row backfill ke liye wo ek out-of-memory crash hai. `.iterator()` rows ko batches mein stream karta hai aur unhe kabhi cache nahi karta.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Reading a warehouse inventory: photocopying every page and stacking the copies on your desk, versus walking the aisles with a clipboard one shelf at a time.** A plain `for row in Model.objects.all()` is the photocopier — Django pulls the entire result set from the database, builds a Python object per row, and stacks the whole pile on your desk (the result cache) so you can flip back to any page later. Fine for 200 rows; for 5 million the desk collapses. `.iterator()` is the clipboard walk: you fetch a batch of shelves (`chunk_size` rows), note what you need, then throw that page away and fetch the next batch. Your desk only ever holds one clipboard page. The cost is that you cannot flip back — iterate the queryset a second time and you walk the whole warehouse again — and you cannot ask "how many shelves total" from your notes; you would have to do a separate counting lap. On PostgreSQL the clipboard walk is backed by a real server-side cursor so the database itself streams rather than buffering the whole result.',
      hi: '**Ek warehouse inventory padhna: har page photocopy karke copies apne desk par dher lagana, badle aisles mein ek clipboard ke saath ek shelf ek baar mein chalna.** Ek saada `for row in Model.objects.all()` photocopier hai — Django database se poora result set kheenchta hai, prati row ek Python object banata hai, aur poora dher aapke desk par lagata hai (result cache) taaki aap baad mein kisi bhi page par wapas palat sakein. 200 rows ke liye theek; 5 million ke liye desk dhah jaata hai. `.iterator()` clipboard walk hai: aap shelves ka ek batch fetch karte ho (`chunk_size` rows), zaroori note karte ho, phir wo page phenk kar agla batch fetch karte ho. Aapka desk kabhi bhi ek clipboard page rakhta hai. Cost ye hai ki aap wapas nahi palat sakte — queryset ko doosri baar iterate karo aur aap poora warehouse phir chalte ho — aur aap apne notes se "kul kitni shelves" nahi pooch sakte. PostgreSQL par clipboard walk ek asli server-side cursor se backed hai.',
    },

    simple: `**A plain loop loads and caches everything**

\`\`\`python
for user in User.objects.all():          # 1) one query fetches ALL rows
    process(user)                        # 2) a full User instance built for each
# 3) every instance stays in user_qs._result_cache -- iterate again = free, but all in RAM
\`\`\`

**\`.iterator()\` streams in batches, caches nothing**

\`\`\`python
for user in User.objects.all().iterator(chunk_size=2000):
    process(user)
# fetches 2000 rows, yields them, discards them, fetches the next 2000.
# qs._result_cache stays None. Iterating the qs again re-runs the whole query.
\`\`\`

\`\`\`
plain iteration     ALL rows + ALL model instances in memory, kept in _result_cache
.iterator()         one chunk_size batch at a time, nothing cached
.iterator(chunk_size=N)   N = rows per fetch (default 2000). Bigger = fewer round trips, more RAM/batch.
PostgreSQL          .iterator() uses a server-side (named) cursor -> the DB streams too
SQLite / MySQL      no server-side cursor -> the driver may still buffer; chunk_size caps Python-side memory
\`\`\`

**Skip building model instances entirely**

\`\`\`python
# .values() -> dicts, .values_list() -> tuples, .values_list(flat=True) -> scalars
for id, email in User.objects.values_list("id", "email").iterator(chunk_size=5000):
    ...
# no User.__init__, no descriptors, no signals wiring -- just the columns you asked for
\`\`\`

**Never call \`count()\` / \`len()\` / re-filter inside a loop**

\`\`\`python
# BAD: a COUNT query every iteration
for u in qs.iterator():
    if Order.objects.filter(user=u).count() > 0:   # N queries
        ...

# GOOD: annotate once, read the attribute
for u in qs.annotate(n=Count("orders")).iterator():
    if u.n > 0:
        ...
\`\`\`

**Batched writes for a backfill**

\`\`\`python
from django.db import transaction

batch = []
for row in Legacy.objects.values_list("id", "raw").iterator(chunk_size=5000):
    batch.append(New(legacy_id=row[0], parsed=parse(row[1])))
    if len(batch) >= 1000:
        New.objects.bulk_create(batch)            # one INSERT per 1000
        batch.clear()
if batch:
    New.objects.bulk_create(batch)
\`\`\`

\`\`\`
read side:   .values_list(...).iterator(chunk_size=5000)   -- stream, no instances
write side:  accumulate -> bulk_create / bulk_update in batches of ~500-2000
wrap each write batch (not the whole job) in transaction.atomic() so a failure is resumable
bulk_create / bulk_update / update() skip save(), signals, auto_now (Module 3)
\`\`\``,

    simpleHi: `**Ek saada loop sab kuch load aur cache karta hai**

\`\`\`python
for user in User.objects.all():          # 1) ek query SAARI rows fetch karti hai
    process(user)                        # 2) har ek ke liye ek poora User instance bana
# 3) har instance user_qs._result_cache mein rehta hai -- phir iterate = muft, par sab RAM mein
\`\`\`

**\`.iterator()\` batches mein stream karta hai, kuch cache nahi**

\`\`\`python
for user in User.objects.all().iterator(chunk_size=2000):
    process(user)
# 2000 rows fetch karta hai, yield karta hai, discard karta hai, agli 2000 fetch karta hai.
# qs._result_cache None rehta hai. qs phir iterate karna poori query dobara chalata hai.
\`\`\`

\`\`\`
saada iteration     SAARI rows + SAARE model instances memory mein, _result_cache mein rakhe
.iterator()         ek samay ek chunk_size batch, kuch cache nahi
.iterator(chunk_size=N)   N = prati fetch rows (default 2000). Bada = kam round trips, zyada RAM/batch.
PostgreSQL          .iterator() ek server-side (named) cursor istemal karta hai -> DB bhi stream karta hai
SQLite / MySQL      koi server-side cursor nahi -> driver abhi bhi buffer kar sakta hai; chunk_size Python-side memory cap karta hai
\`\`\`

**Model instances banana poori tarah skip karo**

\`\`\`python
# .values() -> dicts, .values_list() -> tuples, .values_list(flat=True) -> scalars
for id, email in User.objects.values_list("id", "email").iterator(chunk_size=5000):
    ...
# koi User.__init__ nahi, koi descriptors nahi -- sirf wo columns jo aapne maange
\`\`\`

**Loop ke andar kabhi \`count()\` / \`len()\` / re-filter mat karo**

\`\`\`python
# BAD: har iteration ek COUNT query
for u in qs.iterator():
    if Order.objects.filter(user=u).count() > 0:   # N queries
        ...

# GOOD: ek baar annotate karo, attribute padho
for u in qs.annotate(n=Count("orders")).iterator():
    if u.n > 0:
        ...
\`\`\`

**Ek backfill ke liye batched writes**

\`\`\`python
from django.db import transaction

batch = []
for row in Legacy.objects.values_list("id", "raw").iterator(chunk_size=5000):
    batch.append(New(legacy_id=row[0], parsed=parse(row[1])))
    if len(batch) >= 1000:
        New.objects.bulk_create(batch)            # prati 1000 ek INSERT
        batch.clear()
if batch:
    New.objects.bulk_create(batch)
\`\`\`

\`\`\`
read side:   .values_list(...).iterator(chunk_size=5000)   -- stream, koi instances nahi
write side:  jamaa karo -> ~500-2000 ke batches mein bulk_create / bulk_update
har write batch (poora job nahi) ko transaction.atomic() mein wrap karo taaki ek failure resumable ho
bulk_create / bulk_update / update() save(), signals, auto_now skip karte hain (Module 3)
\`\`\``,

    content: `## The result cache

When you first iterate a QuerySet, Django runs the SQL, reads **the entire result set**, constructs a model instance for every row, and stores the list on \`qs._result_cache\` (Module 3). Every subsequent use of that same QuerySet object — a second loop, \`len()\`, \`bool()\` — reads the cache for free. This is a deliberate optimisation for the normal case: a view fetches 25 rows, renders them, done.

It is a disaster for large data. \`for row in BigTable.objects.all()\` on a 5-million-row table:

1. issues one query that returns all 5M rows,
2. builds 5M \`BigTable\` instances (each with \`__dict__\`, deferred-field machinery, the works),
3. holds all of them in \`_result_cache\` for the lifetime of the QuerySet.

Peak memory is gigabytes, and it is allocated *before your loop body runs once*.

## \`.iterator()\`

\`qs.iterator(chunk_size=2000)\` changes the strategy:

- it does **not** populate \`_result_cache\` — the rows are yielded and then dropped;
- it fetches in batches of \`chunk_size\` rows (default 2000), so Python-side peak memory is one batch, not the whole table;
- on **PostgreSQL** it opens a **server-side named cursor**, so the *database* also streams the result instead of buffering it and shipping it all at once (this is why \`DISABLE_SERVER_SIDE_CURSORS\` matters behind transaction-pooled pgbouncer — Module 7);
- on **SQLite and MySQL** there is no server-side cursor; the driver may still buffer the full result, but \`chunk_size\` still bounds how many model instances exist in Python at once.

The trade-off: the QuerySet is now single-use for that iteration. Iterating it again re-executes the query. You also cannot \`len()\` it — use \`.count()\` as a separate query if you need the number.

## \`.values()\` / \`.values_list()\`

Model instantiation is a large part of the per-row cost. If you only need a few columns and do not need model methods:

- \`.values("id", "email")\` yields \`dict\`s,
- \`.values_list("id", "email")\` yields \`tuple\`s,
- \`.values_list("email", flat=True)\` yields the scalar.

Combine with \`.iterator()\`: \`qs.values_list("id", "email").iterator(chunk_size=5000)\` streams tuples with no \`Model.__init__\`, no descriptor protocol, no deferred-loading hooks. For a pure read-and-transform pass this is several times faster and much lighter.

## The hidden N+1 inside the loop

The classic large-data mistake is doing per-row queries in the loop body:

\`\`\`python
for u in User.objects.iterator():
    orders = Order.objects.filter(user=u)          # a query per user
    if orders.exists():                            # ANOTHER query per user
        send_summary(u, orders.count())            # and another
\`\`\`

\`.iterator()\` disables the result-cache benefit but does nothing about queries you issue yourself. \`select_related\` / \`prefetch_related\` still work with \`.iterator()\` (prefetch is done per chunk). Better still, push the computation into the query: \`.annotate(n_orders=Count("orders"))\` and read \`u.n_orders\`.

Note: **\`prefetch_related\` with plain \`.iterator()\` used to be disallowed**; modern Django performs the prefetch once per chunk, so it works but issues one extra query per chunk — size \`chunk_size\` accordingly.

## Batched writes

The write side of a backfill mirrors the read side. Accumulate transformed objects and flush in batches:

\`\`\`python
from django.db import transaction

def backfill():
    buf = []
    src = Legacy.objects.values_list("id", "payload").iterator(chunk_size=5000)
    for legacy_id, payload in src:
        buf.append(Record(legacy_id=legacy_id, data=transform(payload)))
        if len(buf) == 1000:
            with transaction.atomic():
                Record.objects.bulk_create(buf, ignore_conflicts=True)
            buf.clear()
    if buf:
        with transaction.atomic():
            Record.objects.bulk_create(buf, ignore_conflicts=True)
\`\`\`

- **Wrap each batch, not the whole job**, in \`transaction.atomic()\` — a crash at row 3M leaves the first 3M committed and the backfill resumable, instead of rolling back hours of work.
- Make it **idempotent** — \`ignore_conflicts=True\`, or an \`update_or_create\` keyed on a stable id, or a \`WHERE not-yet-processed\` filter — so a re-run after a failure is safe.
- Remember \`bulk_create\` / \`bulk_update\` / \`QuerySet.update()\` **skip \`save()\`, signals, and \`auto_now\`** (Module 3) — set timestamps explicitly if you need them.
- This is exactly the pattern for a data migration's \`RunPython\` (Module 2) and for a management command doing a backfill (Module 1).`,

    contentHi: `## Result cache

Jab aap pehli baar ek QuerySet iterate karte hain, Django SQL chalata hai, **poora result set** padhta hai, har row ke liye ek model instance banata hai, aur list ko \`qs._result_cache\` par store karta hai (Module 3). Us same QuerySet object ka har agla upyog — ek doosra loop, \`len()\`, \`bool()\` — cache ko muft padhta hai. Ye normal case ke liye ek jaan-boojhkar optimisation hai: ek view 25 rows fetch karta hai, render karta hai, ho gaya.

Ye bade data ke liye ek aapda hai. Ek 5-million-row table par \`for row in BigTable.objects.all()\`:

1. ek query issue karta hai jo saari 5M rows lautati hai,
2. 5M \`BigTable\` instances banata hai,
3. un sabko QuerySet ke jeevan-kaal ke liye \`_result_cache\` mein rakhta hai.

Peak memory gigabytes hai, aur ye *aapka loop body ek baar chalne se pehle* allocate hoti hai.

## \`.iterator()\`

\`qs.iterator(chunk_size=2000)\` strategy badalta hai:

- ye \`_result_cache\` ko **populate nahi karta** — rows yield hoti hain phir drop;
- ye \`chunk_size\` rows ke batches mein fetch karta hai (default 2000), toh Python-side peak memory ek batch hai;
- **PostgreSQL** par ye ek **server-side named cursor** kholta hai, toh *database* bhi result stream karta hai (isiliye transaction-pooled pgbouncer ke peeche \`DISABLE_SERVER_SIDE_CURSORS\` maayne rakhta hai — Module 7);
- **SQLite aur MySQL** par koi server-side cursor nahi; driver abhi bhi poora result buffer kar sakta hai, par \`chunk_size\` abhi bhi baandhta hai ki ek samay Python mein kitne model instances exist karte hain.

Trade-off: QuerySet ab us iteration ke liye single-use hai. Ise phir iterate karna query dobara execute karta hai. Aap ise \`len()\` bhi nahi kar sakte — number chahiye toh ek alag query ke roop mein \`.count()\` istemal karo.

## \`.values()\` / \`.values_list()\`

Model instantiation prati-row cost ka ek bada hissa hai. Agar aapko sirf kuch columns chahiye aur model methods nahi chahiye:

- \`.values("id", "email")\` \`dict\`s yield karta hai,
- \`.values_list("id", "email")\` \`tuple\`s,
- \`.values_list("email", flat=True)\` scalar.

\`.iterator()\` ke saath combine karo: \`qs.values_list("id", "email").iterator(chunk_size=5000)\` bina \`Model.__init__\` ke tuples stream karta hai. Ek pure read-and-transform pass ke liye ye kई guna tez aur bahut halka hai.

## Loop ke andar chhupa N+1

Classic bade-data ki galti loop body mein prati-row queries karna hai. \`.iterator()\` result-cache benefit disable karta hai par aapki khud ki issue ki queries ke baare mein kuch nahi karta. \`select_related\` / \`prefetch_related\` abhi bhi \`.iterator()\` ke saath kaam karte hain (prefetch prati chunk hota hai). Aur behtar, computation ko query mein dhakelo: \`.annotate(n_orders=Count("orders"))\`.

## Batched writes

Ek backfill ka write side read side ko mirror karta hai. Transformed objects jamaa karo aur batches mein flush karo:

- **Har batch ko wrap karo, poora job nahi**, \`transaction.atomic()\` mein — row 3M par ek crash pehle 3M ko committed chhodta hai aur backfill resumable, ghanton ka kaam roll back karne ke badle.
- Ise **idempotent** banao — \`ignore_conflicts=True\`, ya ek stable id par \`update_or_create\`, ya ek \`WHERE not-yet-processed\` filter.
- Yaad rakho \`bulk_create\` / \`bulk_update\` / \`QuerySet.update()\` **\`save()\`, signals, aur \`auto_now\` skip karte hain** (Module 3).
- Ye theek ek data migration ke \`RunPython\` (Module 2) aur ek backfill karne wale management command (Module 1) ke liye pattern hai.`,

    examples: [
      {
        title: '.iterator() leaves _result_cache empty; a plain loop fills it',
        titleHi: '.iterator() _result_cache khali chhodta hai; ek saada loop ise bharta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Widget(models.Model):
    name = models.CharField(max_length=20)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Widget)
Widget.objects.bulk_create([Widget(name=f"w{i}") for i in range(100)])

# --- plain iteration: fills the result cache ---
qs1 = Widget.objects.all()
with CaptureQueriesContext(connection) as ctx1:
    total1 = sum(1 for _ in qs1)          # query runs
    again = sum(1 for _ in qs1)           # served from cache -> NO query
print("plain: first pass", total1, "| second pass", again)
print("plain: queries for two passes =", len(ctx1.captured_queries))
print("plain: _result_cache populated =", qs1._result_cache is not None)

# --- .iterator(): caches nothing ---
qs2 = Widget.objects.all()
with CaptureQueriesContext(connection) as ctx2:
    total2 = sum(1 for _ in qs2.iterator(chunk_size=25))
    total3 = sum(1 for _ in qs2.iterator(chunk_size=25))   # re-runs the query
print("iterator: first pass", total2, "| second pass", total3)
print("iterator: queries for two passes =", len(ctx2.captured_queries))
print("iterator: _result_cache populated =", qs2._result_cache is not None)`,
        output: `plain: first pass 100 | second pass 100
plain: queries for two passes = 1
plain: _result_cache populated = True
iterator: first pass 100 | second pass 100
iterator: queries for two passes = 2
iterator: _result_cache populated = False`,
        explain: 'A plain QuerySet iterated twice runs one query: the first pass fills _result_cache and the second pass reads that cache -- no second SQL, but every row and model instance stays resident. .iterator() is the opposite: it never touches _result_cache (it stays None), so the two passes are two separate queries, and neither pass holds more than one chunk_size batch of rows in memory at a time. That is the trade -- .iterator() gives up free re-iteration and the len()-ability of the cache in exchange for flat memory, which is right when the result set is large and you only walk it once.',
        explainHi: 'Ek plain QuerySet do baar iterate ek query chalata hai: pehla pass _result_cache bharta hai aur doosra pass us cache ko padhta hai -- koi doosra SQL nahi, par har row aur model instance resident rehta hai. .iterator() ulta hai: ye kabhi _result_cache ko nahi chhoota (ye None rehta hai), toh do passes do alag queries hain, aur na koi pass ek samay ek chunk_size batch se zyada rows memory mein rakhta hai. Yahi trade hai -- .iterator() free re-iteration aur cache ki len()-ability chhodta hai flat memory ke badle.',
      },
      {
        title: 'values_list().iterator() vs building model instances in a loop',
        titleHi: 'values_list().iterator() vs loop mein model instances banana',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Person(models.Model):
    first = models.CharField(max_length=20)
    last = models.CharField(max_length=20)
    age = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Person)
Person.objects.bulk_create([Person(first=f"F{i}", last=f"L{i}", age=20 + i % 50) for i in range(200)])

# model instances -- full objects, all attributes, can call methods
oldest_name = None
oldest_age = -1
for p in Person.objects.all().iterator(chunk_size=50):
    if p.age > oldest_age:
        oldest_age, oldest_name = p.age, f"{p.first} {p.last}"
print("via instances:", oldest_name, oldest_age)
print("  type yielded:", type(Person.objects.all().iterator().__next__()).__name__)

# values_list -- just the columns, tuples, no Person.__init__
oldest = ("", -1)
for first, last, age in Person.objects.values_list("first", "last", "age").iterator(chunk_size=50):
    if age > oldest[1]:
        oldest = (f"{first} {last}", age)
print("via values_list:", oldest[0], oldest[1])
gen = Person.objects.values_list("first", "last", "age").iterator()
print("  type yielded:", type(next(gen)).__name__)

# flat=True for a single column
ages = Person.objects.values_list("age", flat=True).iterator(chunk_size=50)
print("distinct-ish sample:", sorted(set(list(ages)))[:5], "...")`,
        output: `via instances: F49 L49 69
  type yielded: Person
via values_list: F49 L49 69
  type yielded: tuple
distinct-ish sample: [20, 21, 22, 23, 24] ...`,
        explain: 'Both loops find the same oldest person and age, because they read the same three columns. But .iterator() over the model queryset yields full Person instances -- every attribute, model methods available, __init__ and descriptor machinery run per row. .values_list("first", "last", "age").iterator() yields plain tuples: just those three values, no Person.__init__, no descriptors. For a read-and-transform pass over a large table that skips a large fraction of the per-row cost, and .values_list(flat=True) does the same for a single column, yielding scalars.',
        explainHi: 'Dono loops same sabse boode vyakti aur same age dhoondhte hain, kyunki wo same teen columns padhte hain. Par model queryset par .iterator() poore Person instances yield karta hai -- har attribute, model methods available, __init__ aur descriptor machinery prati row chalti hai. .values_list("first", "last", "age").iterator() plain tuples yield karta hai: sirf wo teen values, koi Person.__init__ nahi. Ek bade table par ek read-and-transform pass ke liye ye prati-row cost ka ek bada hissa skip karta hai.',
      },
      {
        title: 'A backfill: stream reads, batched idempotent writes, per-batch transaction',
        titleHi: 'Ek backfill: stream reads, batched idempotent writes, prati-batch transaction',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, transaction
from django.test.utils import CaptureQueriesContext

class Legacy(models.Model):
    raw = models.CharField(max_length=40)
    class Meta:
        app_label = "__main__"

class Parsed(models.Model):
    legacy_id = models.IntegerField(unique=True)
    value = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Legacy)
    se.create_model(Parsed)
Legacy.objects.bulk_create([Legacy(raw=f"item-{i}-{i * 3}") for i in range(2500)])

def backfill(batch_size=1000):
    buf, batches = [], 0
    src = Legacy.objects.values_list("id", "raw").iterator(chunk_size=500)
    for legacy_id, raw in src:
        buf.append(Parsed(legacy_id=legacy_id, value=int(raw.rsplit("-", 1)[1])))
        if len(buf) == batch_size:
            with transaction.atomic():
                Parsed.objects.bulk_create(buf, ignore_conflicts=True)   # idempotent
            batches += 1
            buf.clear()
    if buf:
        with transaction.atomic():
            Parsed.objects.bulk_create(buf, ignore_conflicts=True)
        batches += 1
    return batches

n = backfill()
print("write batches:", n)
print("parsed rows:", Parsed.objects.count())
print("sample:", list(Parsed.objects.values_list("legacy_id", "value").order_by("legacy_id")[:3]))

# re-run is safe (ignore_conflicts) -- no duplicates, no crash
before = Parsed.objects.count()
backfill()
print("after re-run, rows unchanged:", Parsed.objects.count() == before)`,
        output: `write batches: 3
parsed rows: 2500
sample: [(1, 0), (2, 3), (3, 6)]
after re-run, rows unchanged: True`,
        explain: 'The backfill streams the source table with values_list().iterator() so the reads never materialise the whole table, accumulates transformed Parsed objects in a buffer, and every batch_size rows opens a short transaction.atomic() and bulk_creates that batch with ignore_conflicts=True. Three batches for 2500 rows. Because each batch commits on its own, a crash mid-run leaves earlier batches committed and the job resumable. And ignore_conflicts plus the unique legacy_id constraint makes a second full run a no-op -- the row count is unchanged -- instead of an IntegrityError, so re-running after a partial failure is safe.',
        explainHi: 'Backfill source table ko values_list().iterator() se stream karta hai taaki reads kabhi poori table materialise na karein, transformed Parsed objects ko ek buffer mein jamaa karta hai, aur har batch_size rows ek chhota transaction.atomic() kholta hai aur us batch ko ignore_conflicts=True ke saath bulk_create karta hai. 2500 rows ke liye teen batches. Kyunki har batch apne aap commit hota hai, ek crash mid-run pehle batches ko committed chhodta hai aur job resumable. Aur ignore_conflicts plus unique legacy_id constraint ek doosre full run ko ek no-op banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `total = User.objects.all()
print(f"processing {len(total)} users")          # loads and caches ALL users just for the count
for u in total.iterator():                        # ...then iterator() re-queries anyway
    process(u)`,
        right: `qs = User.objects.all()
print(f"processing {qs.count()} users")            # a cheap SELECT COUNT(*), caches nothing
for u in qs.iterator(chunk_size=2000):
    process(u)`,
        why: '`len(qs)` forces the full result cache to populate — every row, every model instance — which is the exact memory blow-up `.iterator()` exists to avoid. And it is wasted, because `.iterator()` on the next line ignores the cache and runs the query again. Use `qs.count()` for the number: it compiles to `SELECT COUNT(*)`, transfers one integer, and caches nothing. Never mix a cache-populating operation (`len`, `bool`, list slicing, a plain loop) with `.iterator()` on the same intent.',
        whyHi: '`len(qs)` poore result cache ko populate hone pe majboor karta hai — har row, har model instance — jo theek wo memory blow-up hai jise avoid karne ke liye `.iterator()` maujood hai. Aur ye vyarth hai, kyunki agli line par `.iterator()` cache ignore karke query dobara chalata hai. Number ke liye `qs.count()` istemal karo: ye `SELECT COUNT(*)` mein compile hota hai, ek integer transfer karta hai, aur kuch cache nahi karta.',
      },
      {
        wrong: `with transaction.atomic():                         # ONE transaction around the whole backfill
    for row in Huge.objects.iterator(chunk_size=5000):
        New.objects.create(**transform(row))          # 5M individual INSERTs, one giant txn
# if it crashes at row 4,000,000 the whole thing rolls back -- hours lost, nothing resumable`,
        right: `buf = []
for row in Huge.objects.values_list(...).iterator(chunk_size=5000):
    buf.append(New(**transform(row)))
    if len(buf) == 1000:
        with transaction.atomic():                    # a small txn per batch
            New.objects.bulk_create(buf, ignore_conflicts=True)
        buf.clear()
# a crash leaves earlier batches committed; re-running skips them (ignore_conflicts)`,
        why: 'A single transaction around millions of writes is a triple problem: it holds locks and a connection for the entire run, it forces the database to keep the whole undo log, and a failure anywhere rolls back everything — so a crash 90% through means starting over. Batching the writes into small per-batch transactions makes the job resumable (committed batches stay committed) and keeps each transaction short. Pair it with idempotency (`ignore_conflicts`, `update_or_create`, or a not-yet-done filter) so a re-run after a partial failure is safe. `bulk_create` also collapses the per-row `create()` INSERTs into one statement per batch.',
        whyHi: 'Millions of writes ke around ek single transaction ek tehra problem hai: ye poore run ke liye locks aur ek connection rakhta hai, ye database ko poora undo log rakhne pe majboor karta hai, aur kahin bhi ek failure sab kuch roll back karti hai — toh 90% par ek crash ka matlab dobara shuru. Writes ko chhote prati-batch transactions mein batch karna job ko resumable banata hai (committed batches committed rehte hain). Ise idempotency ke saath pair karo taaki ek partial failure ke baad re-run surakshit ho.',
      },
      {
        wrong: `for order in Order.objects.iterator(chunk_size=2000):
    customer = order.customer                      # a query PER ORDER (FK not fetched)
    country = order.customer.address.country       # and another, and another
    tally[country] += order.total`,
        right: `qs = (Order.objects
      .select_related("customer__address")          # JOINs -- 0 extra queries per row
      .values_list("customer__address__country", "total")
      .iterator(chunk_size=2000))
for country, total in qs:
    tally[country] += total`,
        why: '`.iterator()` controls how *the queryset itself* is fetched; it does nothing about queries your loop body triggers. Accessing `order.customer` on an instance that did not `select_related` it is a fresh query — over 2M orders that is 2M+ extra queries, and the streaming was pointless. `select_related` still works with `.iterator()` (the JOIN is part of the one streamed query), and pushing the whole thing through `.values_list("customer__address__country", "total")` means no model instances at all — just the two values you actually use.',
        whyHi: '`.iterator()` control karta hai ki *queryset khud* kaise fetch hota hai; ye aapke loop body ki trigger ki queries ke baare mein kuch nahi karta. Ek aise instance par `order.customer` access karna jisne ise `select_related` nahi kiya ek fresh query hai — 2M orders par wo 2M+ extra queries hai. `select_related` abhi bhi `.iterator()` ke saath kaam karta hai (JOIN ek streamed query ka hissa hai), aur poori cheez ko `.values_list(...)` se guzaarne ka matlab koi model instances nahi.',
      },
    ],

    realWorld: [
      {
        en: '**A nightly management command that recomputes a denormalised field** — `Model.objects.values_list("id", ...).iterator(chunk_size=5000)`, transform in Python, `bulk_update(objs, ["field"], batch_size=1000)` inside a per-batch `atomic()`, with a `--since` flag so it only touches rows changed since the last run.',
        hi: '**Ek nightly management command jo ek denormalised field recompute karta hai** — `Model.objects.values_list("id", ...).iterator(chunk_size=5000)`, Python mein transform, ek prati-batch `atomic()` ke andar `bulk_update(objs, ["field"], batch_size=1000)`, ek `--since` flag ke saath.',
      },
      {
        en: '**A data migration `RunPython` backfilling a new column on a 20M-row table** — `apps.get_model(...)` historical model, `.iterator()` read, batched `bulk_update`, `elidable=True`, and the schema split into add-nullable / backfill / add-constraint migrations (lesson 4 of Module 2, and zero-downtime in Module 10).',
        hi: '**Ek data migration `RunPython` jo ek 20M-row table par ek naya column backfill karta hai** — `apps.get_model(...)` historical model, `.iterator()` read, batched `bulk_update`, `elidable=True`, aur schema add-nullable / backfill / add-constraint migrations mein split.',
      },
      {
        en: '**An export/analytics job that scans the whole events table** — `.values_list(...).iterator()` feeding an aggregation in Python (or better, pushed into a `.values().annotate()` GROUP BY), run off a read replica (lesson 5) so the scan does not compete with production write traffic.',
        hi: '**Ek export/analytics job jo poori events table scan karta hai** — `.values_list(...).iterator()` jo Python mein ek aggregation feed karta hai (ya behtar, ek `.values().annotate()` GROUP BY mein dhakela gaya), ek read replica se chalaya gaya (lesson 5).',
      },
    ],

    interviewQA: [
      {
        q: 'What exactly does `.iterator()` change about how a QuerySet is executed, and what do you give up by using it?',
        qHi: '`.iterator()` ek QuerySet ke execute hone ke baare mein theek kya badalta hai, aur ise istemal karke aap kya chhodte hain?',
        a: 'Normally, the first time you iterate a QuerySet, Django runs the SQL, reads the entire result set, builds a model instance for every row, and stores that list on the queryset\'s internal result cache. Every later use of the same queryset object — a second loop, calling len or bool on it, slicing it — reads from that cache without hitting the database. That is great for a view showing 25 rows and terrible for five million, because the whole table plus five million Python objects sits in memory before your loop body runs once. iterator changes two things. It does not populate the result cache, so rows are yielded and then become garbage, and peak Python memory is one batch rather than the whole table. And it fetches in batches of chunk_size rows, default 2000; on PostgreSQL specifically it opens a server-side named cursor so the database itself streams the result rather than buffering all of it, while on SQLite and MySQL there is no server-side cursor but chunk_size still bounds how many instances Python holds. What you give up is the cache: the queryset becomes single-use for that iteration, so iterating it again re-executes the query, and you cannot call len on it — you use a separate count query if you need the number. You also have to be careful that chunk_size interacts with prefetch_related, which modern Django runs once per chunk, adding a query per chunk.',
        aHi: 'Normal roop se, pehli baar jab aap ek QuerySet iterate karte ho, Django SQL chalata hai, poora result set padhta hai, har row ke liye ek model instance banata hai, aur us list ko queryset ke internal result cache par store karta hai. Us same queryset object ka har baad ka upyog — ek doosra loop, ispar len ya bool, ise slice karna — us cache se padhta hai bina database ko chhue. Ye 25 rows dikhaane wale view ke liye badhiya aur 50 lakh ke liye bhayanak hai, kyunki poori table plus 50 lakh Python objects memory mein baithte hain aapke loop body ke ek baar chalne se pehle. iterator do cheezein badalta hai. Ye result cache populate nahi karta, toh rows yield hoti hain phir garbage ban jaati hain, aur peak Python memory ek batch hai poori table ke badle. Aur ye chunk_size rows ke batches mein fetch karta hai, default 2000; khaas PostgreSQL par ye ek server-side named cursor kholta hai taaki database khud result stream kare. Aap jo chhodte ho wo cache hai: queryset us iteration ke liye single-use ban jaata hai, toh ise phir iterate karna query dobara execute karta hai, aur aap ispar len nahi kar sakte.',
      },
      {
        q: 'You have to backfill a new column on a 20-million-row table in production. Describe the shape of the job.',
        qHi: 'Aapko production mein ek 20-million-row table par ek naya column backfill karna hai. Job ki shape bataiye.',
        a: 'The job has to be memory-flat, resumable, idempotent, and gentle on the database. Memory-flat: read with values_list of just the id and the columns needed for the computation, and iterator with a chunk_size around 2000 to 5000, so neither Django nor the driver holds the whole table. Resumable: do not wrap the whole job in one transaction — that holds locks and a connection for hours and rolls back everything on any failure. Instead accumulate transformed rows into a buffer and, every 500 to 2000 rows, open a short transaction.atomic and bulk_update that batch, then clear the buffer. A crash then leaves all earlier batches committed, and you can restart. Idempotent: so a restart is safe, either filter the read to rows not yet done — where new_column is null — or use update_or_create semantics, or ignore_conflicts on inserts. Gentle: run it off a read replica if the read scan is heavy, add a small sleep between batches if replication lag or IO on the primary becomes a problem, and schedule it for a low-traffic window. Remember bulk_update skips save, signals, and auto_now, so set any timestamps explicitly. If this is part of adding a non-nullable column, split it into three migrations: add the column as nullable, backfill it with this job as a RunPython or a separate command, then add the not-null constraint — so no single migration locks the table while it rewrites 20 million rows.',
        aHi: 'Job ko memory-flat, resumable, idempotent, aur database par narm hona chahiye. Memory-flat: sirf id aur computation ke liye zaroori columns ke values_list se padho, aur chunk_size 2000 se 5000 ke aas-paas ke saath iterator. Resumable: poore job ko ek transaction mein wrap mat karo — wo ghanton ke liye locks rakhta hai aur kisi bhi failure par sab kuch roll back karta hai. Badle transformed rows ko ek buffer mein jamaa karo aur, har 500 se 2000 rows, ek chhota transaction.atomic kholo aur us batch ko bulk_update karo, phir buffer clear karo. Ek crash phir saare pehle batches ko committed chhodta hai, aur aap restart kar sakte ho. Idempotent: read ko un rows par filter karo jo abhi tak nahi hui — jahaan new_column null hai. Narm: agar read scan bhaari hai toh ise ek read replica se chalao, agar replication lag problem ban jaaye toh batches ke beech ek chhota sleep daalo, aur ise ek low-traffic window ke liye schedule karo. Yaad rakho bulk_update save, signals, aur auto_now skip karta hai. Agar ye ek non-nullable column add karne ka hissa hai, ise teen migrations mein split karo: column ko nullable add karo, is job se ise backfill karo, phir not-null constraint add karo.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (SQLite). Model `Widget` (`name`), seed 100. (a) Take `qs1 = Widget.objects.all()`, iterate it fully twice inside a `CaptureQueriesContext`, and assert only **1** query ran and `qs1._result_cache is not None`. (b) Take `qs2 = Widget.objects.all()`, iterate `qs2.iterator(chunk_size=25)` twice inside a `CaptureQueriesContext`, and assert **2** queries ran and `qs2._result_cache is None`.',
        taskHi: 'Standalone Django (SQLite). `Widget` (`name`) model, 100 seed. (a) `qs1 = Widget.objects.all()`, ise ek `CaptureQueriesContext` mein poora do baar iterate karo, assert **1** query aur `qs1._result_cache is not None`. (b) `qs2`, `qs2.iterator(chunk_size=25)` do baar iterate karo, assert **2** queries aur `qs2._result_cache is None`.',
        hint: '`from django.test.utils import CaptureQueriesContext`. A plain second loop over the same qs object is a cache hit (0 queries); `.iterator()` never reads or writes `_result_cache`.',
        hintHi: '`from django.test.utils import CaptureQueriesContext`. Same qs object par ek saada doosra loop ek cache hit hai (0 queries); `.iterator()` kabhi `_result_cache` nahi padhta ya likhta.',
      },
      {
        task: 'Model `Person` (`first`, `last`, `age`), seed 200 with varying ages. Find the oldest person\'s full name two ways: (a) looping `Person.objects.all().iterator(chunk_size=50)` and reading `p.age` / `p.first` / `p.last` off the instance; (b) looping `Person.objects.values_list("first", "last", "age").iterator(chunk_size=50)` over tuples. Assert both give the same name+age. Also print `type(next(...))` for each to show one yields `Person` and the other yields `tuple`.',
        taskHi: '`Person` (`first`, `last`, `age`) model, badalti ages ke saath 200 seed. Sabse boode vyakti ka poora naam do tareeke se dhoondo: (a) `.iterator(chunk_size=50)` loop karke `p.age` padho; (b) `values_list(...).iterator()` tuples par loop karke. Assert dono same naam+age dete hain. Har ke liye `type(next(...))` bhi print karo.',
        hint: '`values_list("first", "last", "age")` yields `(first, last, age)` tuples — unpack them in the `for`. No `Person.__init__` runs, so it is lighter; the result is identical because you only used those three columns anyway.',
        hintHi: '`values_list("first", "last", "age")` `(first, last, age)` tuples yield karta hai — unhe `for` mein unpack karo. Koi `Person.__init__` nahi chalta.',
      },
      {
        task: 'Models `Legacy` (`raw` like `"item-5-15"`) seeded 2500, and `Parsed` (`legacy_id` unique, `value` int). Write `backfill(batch_size=1000)`: stream `Legacy.objects.values_list("id", "raw").iterator(chunk_size=500)`, build `Parsed(legacy_id=id, value=int(raw.rsplit("-",1)[1]))`, and every `batch_size` rows do `bulk_create(buf, ignore_conflicts=True)` inside `transaction.atomic()`; flush the remainder. Return the batch count. Assert: 3 batches, `Parsed.objects.count() == 2500`, and calling `backfill()` a second time leaves the count unchanged (idempotent).',
        taskHi: '`Legacy` (`raw` jaise `"item-5-15"`) 2500 seed, aur `Parsed` (`legacy_id` unique, `value`). `backfill(batch_size=1000)` likho: `values_list(...).iterator(chunk_size=500)` stream karo, `Parsed(...)` banao, har `batch_size` rows par `transaction.atomic()` ke andar `bulk_create(buf, ignore_conflicts=True)`; baaki flush karo. Batch count return karo. Assert: 3 batches, count 2500, doosri baar `backfill()` call karne par count unchanged.',
        hint: '`raw.rsplit("-", 1)[1]` grabs the last segment. `ignore_conflicts=True` + the `unique` constraint on `legacy_id` is what makes the re-run a no-op instead of an `IntegrityError`.',
        hintHi: '`raw.rsplit("-", 1)[1]` aakhri segment leta hai. `ignore_conflicts=True` + `legacy_id` par `unique` constraint hi re-run ko `IntegrityError` ke badle ek no-op banata hai.',
      },
    ],

    keyTakeaways: [
      'Iterating a QuerySet loads EVERY matching row + builds a model instance for each + keeps them in `_result_cache`. Great for 25 rows in a view; an OOM crash for millions — and the memory is allocated BEFORE your loop body runs once.',
      '`.iterator(chunk_size=N)` (default 2000): does NOT populate `_result_cache`, fetches N rows at a time. On PostgreSQL it opens a SERVER-SIDE cursor (DB streams too); on SQLite/MySQL no server-side cursor but `chunk_size` still bounds Python-side instances.',
      'Cost of `.iterator()`: the queryset is single-use for that pass (iterating again re-runs the query), and you cannot `len()` it — use `.count()` (a separate `SELECT COUNT(*)`) for the number. NEVER put `len(qs)` before `.iterator()`.',
      '`.values("a","b")` (dicts) / `.values_list("a","b")` (tuples) / `.values_list("a", flat=True)` (scalars) skip `Model.__init__` entirely. Combine: `qs.values_list(...).iterator(chunk_size=5000)` — much lighter + faster for a read-transform pass.',
      '`.iterator()` does nothing about queries your LOOP BODY issues. `order.customer` on a non-`select_related`ed instance = a query per row. `select_related`/`prefetch_related` still work with `.iterator()` (prefetch runs once per chunk); better, `.annotate(Count(...))` and read the attribute.',
      'Backfill read side: `.values_list(...).iterator(chunk_size=5000)`. Write side: accumulate -> `bulk_create`/`bulk_update` in batches of ~500-2000.',
      'Wrap EACH write batch (not the whole job) in `transaction.atomic()` -> a crash leaves earlier batches committed and the job resumable. One giant transaction rolls back hours of work and holds locks + a connection the whole time.',
      'Make backfills IDEMPOTENT: `ignore_conflicts=True` / `update_or_create` / a `WHERE not-yet-done` filter, so a re-run after a partial failure is safe. Remember `bulk_*`/`update()` skip `save()`, signals, `auto_now` (Module 3).',
    ],
    keyTakeawaysHi: [
      'Ek QuerySet iterate karna HAR matching row load karta hai + har ek ke liye ek model instance banata hai + unhe `_result_cache` mein rakhta hai. Ek view mein 25 rows ke liye badhiya; millions ke liye ek OOM crash — aur memory aapke loop body ke ek baar chalne se PEHLE allocate hoti hai.',
      '`.iterator(chunk_size=N)` (default 2000): `_result_cache` populate NAHI karta, ek samay N rows fetch karta hai. PostgreSQL par ek SERVER-SIDE cursor kholta hai; SQLite/MySQL par koi server-side cursor nahi par `chunk_size` abhi bhi Python-side instances baandhta hai.',
      '`.iterator()` ki cost: queryset us pass ke liye single-use hai (phir iterate = query dobara), aur aap ise `len()` nahi kar sakte — number ke liye `.count()`. `.iterator()` se PEHLE `len(qs)` KABHI mat rakho.',
      '`.values("a","b")` / `.values_list("a","b")` / `.values_list("a", flat=True)` `Model.__init__` poori tarah skip karte hain. Combine: `qs.values_list(...).iterator(chunk_size=5000)` — read-transform pass ke liye bahut halka + tez.',
      '`.iterator()` aapke LOOP BODY ki queries ke baare mein kuch nahi karta. Ek non-`select_related`ed instance par `order.customer` = prati row ek query. `select_related`/`prefetch_related` abhi bhi kaam karte hain (prefetch prati chunk); behtar, `.annotate(Count(...))`.',
      'Backfill read side: `.values_list(...).iterator(chunk_size=5000)`. Write side: jamaa karo -> ~500-2000 ke batches mein `bulk_create`/`bulk_update`.',
      'HAR write batch ko (poora job nahi) `transaction.atomic()` mein wrap karo -> ek crash pehle batches ko committed chhodta hai aur job resumable. Ek vishaal transaction ghanton ka kaam roll back karta hai.',
      'Backfills ko IDEMPOTENT banao: `ignore_conflicts=True` / `update_or_create` / ek `WHERE not-yet-done` filter. Yaad rakho `bulk_*`/`update()` `save()`, signals, `auto_now` skip karte hain (Module 3).',
    ],
  },

  {
    slug: 'dj-large-csv-exports',
    title: 'Large Exports: Streaming CSV & When to Go Async',
    titleHi: 'Bade Exports: Streaming CSV & Kab Async Jaana',
    description: 'Combine the last two lessons into the single most common "big data" feature: a CSV download. A streamed response over `.values_list().iterator()` handles tables of any size in constant memory. But past a certain point even that is wrong — the request takes too long, and the job belongs in a background worker.',
    descriptionHi: 'Pichhle do lessons ko sabse aam "big data" feature mein jodo: ek CSV download. `.values_list().iterator()` ke upar ek streamed response kisi bhi size ki tables ko constant memory mein handle karta hai. Par ek point ke baad wo bhi galat hai — request bahut lamba leta hai, aur job ek background worker mein hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: '**Filling out a tax return: for a normal year you do it at the counter while the clerk waits; for a corporation with 40,000 transactions you drop off a box and they mail you the finished return.** A small export — a few thousand rows — you generate right there in the request and stream it back; the user waits a second or two, fine. A big export streamed from the request is still "at the counter": the clerk (the web worker) stands there for the full ten minutes it takes, the queue behind builds up, and if the office closes at 5 (a proxy timeout) your half-done return is thrown away. Past a threshold you switch to drop-off: the request just takes the order and hands back a ticket, a back-office worker (Celery) does the work on its own time, files the finished document in a cabinet (object storage), and sends you a pickup slip (a signed download link). The counter stays free for everyone else.',
      hi: '**Ek tax return bharna: ek normal saal ke liye aap ise counter par karte ho jab clerk intezaar karta hai; 40,000 transactions waali ek corporation ke liye aap ek box chhod jaate ho aur wo aapko finished return mail karte hain.** Ek chhota export — kuch hazaar rows — aap ise wahin request mein generate karke wapas stream karte ho; user ek-do second intezaar karta hai, theek. Ek bada export jo request se stream hota hai abhi bhi "counter par" hai: clerk (web worker) poore das minute wahaan khada rehta hai, peeche queue badhti hai, aur agar office 5 baje band ho jaaye (ek proxy timeout) aapka aadha return phenk diya jaata hai. Ek threshold ke baad aap drop-off par switch karte ho: request bas order leta hai aur ek ticket wapas deta hai, ek back-office worker (Celery) apne samay par kaam karta hai, finished document ek cabinet (object storage) mein file karta hai, aur aapko ek pickup slip (ek signed download link) bhejta hai.',
    },

    simple: `**Streaming CSV — the standard pattern**

\`\`\`python
import csv
from django.http import StreamingHttpResponse

class Echo:
    """A file-like object whose write() just returns the value (csv.writer needs a writer)."""
    def write(self, value):
        return value

def export_sales(request):
    writer = csv.writer(Echo())
    rows = Sale.objects.values_list("id", "date", "amount").iterator(chunk_size=2000)

    def stream():
        yield writer.writerow(["id", "date", "amount"])       # header
        for row in rows:
            yield writer.writerow(row)

    resp = StreamingHttpResponse(stream(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="sales.csv"'
    return resp
\`\`\`

\`\`\`
Echo().write(v) -> v        csv.writer calls writer.write(line); we capture the formatted line
                            and yield it instead of writing it to a real file.
csv.writer output           lines end with \\r\\n (RFC 4180). Excel is happy.
.values_list().iterator()   constant memory regardless of row count
@transaction.non_atomic_requests   so a long stream does not hold a transaction
\`\`\`

**Excel / BOM note**

\`\`\`python
# Excel on Windows misreads UTF-8 without a BOM. Prepend one for spreadsheet users:
def stream():
    yield "\\ufeff"                       # UTF-8 BOM
    yield writer.writerow([...])
# content_type="text/csv; charset=utf-8"
\`\`\`

**When streaming from the request is still wrong**

\`\`\`
row count / time         approach
------------------------ ------------------------------------------------------------
up to ~10^5 rows / <5s   stream from the request (pattern above)
bigger / slower / joins  enqueue a Celery task (lesson 6):
                           1. view creates Export(status="pending"), returns 202 + poll URL
                           2. task streams rows -> writes CSV to object storage (S3)
                           3. task sets Export(status="ready", url=...), notifies the user
                           4. user downloads via a short-lived signed URL (never touches Django)
\`\`\`

**Why the request breaks down for big exports**

- A sync worker is pinned for the whole generation time — a few concurrent big exports starve the site.
- Reverse-proxy / load-balancer timeouts (nginx \`proxy_read_timeout\` 60s, ELB idle 60s) kill the connection mid-stream.
- No retry: a blip at row 2M and the user starts over.
- The status code is already \`200\` — a late failure produces a silently truncated file.`,

    simpleHi: `**Streaming CSV — standard pattern**

\`\`\`python
import csv
from django.http import StreamingHttpResponse

class Echo:
    """Ek file-jaisa object jiska write() bas value return karta hai (csv.writer ko ek writer chahiye)."""
    def write(self, value):
        return value

def export_sales(request):
    writer = csv.writer(Echo())
    rows = Sale.objects.values_list("id", "date", "amount").iterator(chunk_size=2000)

    def stream():
        yield writer.writerow(["id", "date", "amount"])       # header
        for row in rows:
            yield writer.writerow(row)

    resp = StreamingHttpResponse(stream(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="sales.csv"'
    return resp
\`\`\`

\`\`\`
Echo().write(v) -> v        csv.writer writer.write(line) call karta hai; hum formatted line
                            capture karke ise ek real file mein likhne ke badle yield karte hain.
csv.writer output           lines \\r\\n se khatam hoti hain (RFC 4180). Excel khush.
.values_list().iterator()   row count chahe jo ho constant memory
@transaction.non_atomic_requests   taaki ek lamba stream ek transaction na rakhe
\`\`\`

**Excel / BOM note**

\`\`\`python
# Windows par Excel BOM ke bina UTF-8 galat padhta hai. Spreadsheet users ke liye ek prepend karo:
def stream():
    yield "\\ufeff"                       # UTF-8 BOM
    yield writer.writerow([...])
# content_type="text/csv; charset=utf-8"
\`\`\`

**Jab request se stream karna abhi bhi galat hai**

\`\`\`
row count / time         approach
------------------------ ------------------------------------------------------------
~10^5 rows tak / <5s     request se stream karo (upar wala pattern)
bada / dheema / joins    ek Celery task enqueue karo (lesson 6):
                           1. view Export(status="pending") banata hai, 202 + poll URL return
                           2. task rows stream karta hai -> CSV object storage (S3) mein likhta hai
                           3. task Export(status="ready", url=...) set karta hai, user ko notify
                           4. user ek short-lived signed URL se download karta hai (kabhi Django nahi)
\`\`\`

**Bade exports ke liye request kyun toot jaata hai**

- Ek sync worker poore generation time ke liye pinned hai — kuch concurrent bade exports site ko starve karte hain.
- Reverse-proxy / load-balancer timeouts (nginx \`proxy_read_timeout\` 60s, ELB idle 60s) connection ko beech-stream maar dete hain.
- Koi retry nahi: row 2M par ek blip aur user dobara shuru karta hai.
- Status code pehle se \`200\` hai — ek der se failure ek chupchaap truncated file produce karta hai.`,

    content: `## The streaming CSV pattern

This is the single most-requested "large data" feature, and it composes the previous two lessons exactly:

\`\`\`python
import csv
from django.http import StreamingHttpResponse
from django.db import transaction

class Echo:
    def write(self, value):
        return value                       # don't store -- just hand the line back

@transaction.non_atomic_requests
def export(request):
    writer = csv.writer(Echo())
    qs = (Report.objects
          .filter(owner=request.user)               # scope it
          .values_list("id", "created", "total")    # no model instances
          .iterator(chunk_size=2000))               # stream, don't cache

    def rows():
        yield writer.writerow(["id", "created", "total"])
        for r in qs:
            yield writer.writerow(r)

    resp = StreamingHttpResponse(rows(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="report.csv"'
    return resp
\`\`\`

### The \`Echo\` trick

\`csv.writer\` needs an object with a \`.write()\` method — it is designed to write into a file. But we do not want a file; we want each formatted line as a string to \`yield\`. \`Echo.write(value)\` just returns \`value\`, so \`writer.writerow([...])\` returns the fully-formatted CSV line (correct quoting, escaping, \`\\r\\n\` terminator) and we \`yield\` that. No file, no buffer.

### Details that bite

- **Line endings.** \`csv.writer\` emits \`\\r\\n\` per RFC 4180. That is correct; do not "fix" it.
- **Excel + UTF-8.** Excel on Windows assumes the system codepage unless the file starts with a UTF-8 BOM (\`\\ufeff\`). If your users open exports in Excel, \`yield "\\ufeff"\` first and set \`content_type="text/csv; charset=utf-8"\`.
- **\`ATOMIC_REQUESTS\`.** Decorate with \`@transaction.non_atomic_requests\` (lesson 1) so the export does not hold a transaction for its whole duration.
- **Scope the queryset.** \`filter(owner=request.user)\` — an export endpoint is just as vulnerable to IDOR as a detail view.
- **Formats.** The same shape works for NDJSON (\`yield json.dumps(obj) + "\\n"\`), which streams better than a JSON array (no need to hold the array or manage commas/brackets). True \`.xlsx\` cannot be streamed row-by-row (it is a zip archive) — generate it in a task.

## The ceiling

Streaming gives you constant memory and a fast first byte. It does **not** give you:

- **Bounded duration.** The request runs for as long as the generation takes. A 10-million-row export at 50k rows/second is over three minutes — during which one sync worker does nothing else.
- **Timeout safety.** nginx \`proxy_read_timeout\` (default 60s), a load balancer's idle timeout, Cloudflare's 100s limit — any of these cuts the connection mid-stream. The client gets a truncated file and a \`200\` status.
- **Retries.** A transient DB error at row 8M aborts the whole download; the user re-triggers from zero.
- **Progress.** The user sees a browser download spinner with no ETA and no way to know if it stalled.

## Going async

Past a threshold — a row count, an estimated duration, or "it touches more than one big table" — the export should be a **background job**:

1. **The request** validates parameters, creates an \`Export\` row (\`status="pending"\`, the filter params, \`requested_by\`), enqueues a Celery task with the export id, and returns **\`202 Accepted\`** with a URL the client can poll (or nothing, if you notify by email).
2. **The task** (lesson 6) streams rows with \`.iterator()\` exactly as above, but writes them to a file in **object storage** (\`default_storage.save(...)\`, or stream straight to S3). It can take as long as it needs, retry on transient failures, and update \`Export.progress\`.
3. **On completion** the task sets \`status="ready"\` and a storage key, then notifies the user — an email with a link, a websocket push, or the poll endpoint starts returning the URL.
4. **The download** is a short-lived **pre-signed URL** to object storage, so the bytes never flow through Django at all; or a small \`FileResponse\` view that streams from storage with the ownership check.

This shape makes the export observable (a row you can inspect), resumable (re-run the task), and cheap (the web tier just enqueues). It is the same request/response discipline as any other "this takes too long for a request" problem — file processing, report generation, bulk email, third-party sync.`,

    contentHi: `## Streaming CSV pattern

Ye sabse zyada maanga jaane wala "large data" feature hai, aur ye pichhle do lessons ko theek compose karta hai:

\`\`\`python
import csv
from django.http import StreamingHttpResponse
from django.db import transaction

class Echo:
    def write(self, value):
        return value                       # store mat karo -- bas line wapas do

@transaction.non_atomic_requests
def export(request):
    writer = csv.writer(Echo())
    qs = (Report.objects
          .filter(owner=request.user)               # scope karo
          .values_list("id", "created", "total")    # koi model instances nahi
          .iterator(chunk_size=2000))               # stream, cache mat karo

    def rows():
        yield writer.writerow(["id", "created", "total"])
        for r in qs:
            yield writer.writerow(r)

    resp = StreamingHttpResponse(rows(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="report.csv"'
    return resp
\`\`\`

### \`Echo\` trick

\`csv.writer\` ko ek \`.write()\` method waala object chahiye — ye ek file mein likhne ke liye design kiya gaya hai. Par hume file nahi chahiye; hume har formatted line ek string ke roop mein \`yield\` karne ke liye chahiye. \`Echo.write(value)\` bas \`value\` return karta hai, toh \`writer.writerow([...])\` poori-formatted CSV line return karta hai (sahi quoting, escaping, \`\\r\\n\` terminator) aur hum wo \`yield\` karte hain.

### Details jo kaatti hain

- **Line endings.** \`csv.writer\` RFC 4180 ke hisaab se \`\\r\\n\` emit karta hai. Wo sahi hai; ise "fix" mat karo.
- **Excel + UTF-8.** Windows par Excel system codepage maanta hai jab tak file ek UTF-8 BOM (\`\\ufeff\`) se shuru na ho. Agar aapke users Excel mein exports kholte hain, pehle \`yield "\\ufeff"\` aur \`content_type="text/csv; charset=utf-8"\` set karo.
- **\`ATOMIC_REQUESTS\`.** \`@transaction.non_atomic_requests\` se decorate karo (lesson 1).
- **Queryset scope karo.** \`filter(owner=request.user)\` — ek export endpoint ek detail view jitna hi IDOR ke liye vulnerable hai.
- **Formats.** Wahi shape NDJSON ke liye kaam karta hai (\`yield json.dumps(obj) + "\\n"\`), jo ek JSON array se behtar stream karta hai. Sacha \`.xlsx\` row-by-row stream nahi kiya ja sakta (ye ek zip archive hai) — ise ek task mein generate karo.

## Ceiling

Streaming aapko constant memory aur ek tez pehla byte deta hai. Ye aapko **nahi** deta:

- **Bounded duration.** Request tab tak chalta hai jitna generation leta hai. 50k rows/second par ek 10-million-row export teen minute se zyada hai.
- **Timeout safety.** nginx \`proxy_read_timeout\` (default 60s), ek load balancer ka idle timeout, Cloudflare ki 100s limit — inme se koi bhi connection ko beech-stream kaat deta hai.
- **Retries.** Row 8M par ek transient DB error poore download ko abort karta hai.
- **Progress.** User bina ETA ke ek browser download spinner dekhta hai.

## Async jaana

Ek threshold ke baad — ek row count, ek anumaanit duration, ya "ye ek se zyada badi table ko chhoota hai" — export ek **background job** hona chahiye:

1. **Request** parameters validate karta hai, ek \`Export\` row banata hai (\`status="pending"\`), export id ke saath ek Celery task enqueue karta hai, aur ek poll URL ke saath **\`202 Accepted\`** return karta hai.
2. **Task** (lesson 6) rows ko \`.iterator()\` se stream karta hai theek jaise upar, par unhe **object storage** mein ek file mein likhta hai. Ye jitna zaroori utna le sakta hai, transient failures par retry kar sakta hai, aur \`Export.progress\` update kar sakta hai.
3. **Completion par** task \`status="ready"\` aur ek storage key set karta hai, phir user ko notify karta hai.
4. **Download** object storage ka ek short-lived **pre-signed URL** hai, toh bytes kabhi Django se nahi behte; ya ek chhota \`FileResponse\` view jo ownership check ke saath storage se stream karta hai.

Ye shape export ko observable (ek row jise aap inspect kar sakte ho), resumable (task dobara chalao), aur sasta (web tier bas enqueue karta hai) banata hai.`,

    examples: [
      {
        title: 'The Echo() writer: csv.writer formats a line, we yield it',
        titleHi: 'Echo() writer: csv.writer ek line format karta hai, hum ise yield karte hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, INSTALLED_APPS=[], USE_TZ=True)
django.setup()

import csv

class Echo:
    def write(self, value):
        return value            # csv.writer calls this; we hand the formatted string back

writer = csv.writer(Echo())

line1 = writer.writerow(["id", "name", "note"])
line2 = writer.writerow([1, "Ada", 'has, a comma'])          # needs quoting
line3 = writer.writerow([2, 'quote " inside', "plain"])       # needs escaped quote

print(repr(line1))
print(repr(line2))
print(repr(line3))
print("line endings are CRLF:", line1.endswith("\\r\\n"))

# compare: writing to a real StringIO buffer gives the same bytes, but holds them all
import io
buf = io.StringIO()
w2 = csv.writer(buf)
for row in [["id", "name"], [1, "Ada"], [2, "Bo"]]:
    w2.writerow(row)
print("buffered equivalent:", repr(buf.getvalue()))`,
        output: `'id,name,note\\r\\n'
'1,Ada,"has, a comma"\\r\\n'
'2,"quote "" inside",plain\\r\\n'
line endings are CRLF: True
buffered equivalent: 'id,name\\r\\n1,Ada\\r\\n2,Bo\\r\\n'`,
        explain: "csv.writer is designed to write into a file object -- it calls the object's write() with each formatted line. Echo.write simply returns its argument, so writer.writerow(row) returns the fully formatted CSV line instead of writing it anywhere: correct RFC 4180 quoting for a value containing a comma (wrapped in double quotes) or a literal double quote (doubled to two), and a carriage-return-newline terminator. That returned string is what a streaming view yields. The StringIO comparison shows the same bytes, but a real buffer accumulates them all; Echo holds nothing.",
        explainHi: 'csv.writer ek file object mein likhne ke liye design kiya gaya hai -- ye object ke write() ko har formatted line ke saath call karta hai. Echo.write bas apna argument return karta hai, toh writer.writerow(row) poori formatted CSV line return karta hai ise kahin likhne ke bajaye: ek comma waali value ke liye sahi RFC 4180 quoting, aur ek carriage-return-newline terminator. Wo returned string wo hai jo ek streaming view yield karta hai. StringIO comparison same bytes dikhata hai, par ek real buffer un sabko jamaa karta hai.',
      },
      {
        title: 'A full streaming CSV export: one query, constant memory, scoped',
        titleHi: 'Ek poora streaming CSV export: ek query, constant memory, scoped',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, MIDDLEWARE=[])
django.setup()

import csv
from django.db import models, connection
from django.http import StreamingHttpResponse
from django.urls import path
from django.test import Client
from django.test.utils import CaptureQueriesContext

class Sale(models.Model):
    region = models.CharField(max_length=10)
    amount = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Sale)
Sale.objects.bulk_create([Sale(region="NA" if i % 2 else "EU", amount=i) for i in range(1, 1001)])

class Echo:
    def write(self, value):
        return value

def export(request):
    region = request.GET.get("region")
    qs = Sale.objects.all()
    if region:
        qs = qs.filter(region=region)
    rows = qs.values_list("id", "region", "amount").iterator(chunk_size=250)
    writer = csv.writer(Echo())
    def stream():
        yield writer.writerow(["id", "region", "amount"])
        for r in rows:
            yield writer.writerow(r)
    resp = StreamingHttpResponse(stream(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="sales.csv"'
    return resp

urlpatterns = [path("export/", export)]
c = Client()

with CaptureQueriesContext(connection) as ctx:
    r = c.get("/export/?region=EU")
    body = b"".join(r.streaming_content).decode()
lines = body.splitlines()
print("status:", r.status_code, "| disposition:", r["Content-Disposition"])
print("header:", lines[0])
print("data lines:", len(lines) - 1, "(500 EU sales)")
print("first row:", lines[1])
print("DB queries for the whole export:", len(ctx.captured_queries))`,
        output: `status: 200 | disposition: attachment; filename="sales.csv"
header: id,region,amount
data lines: 500 (500 EU sales)
first row: 2,EU,2
DB queries for the whole export: 1`,
        explain: 'The whole export is a single StreamingHttpResponse driven by a generator: it yields the header row, then loops the queryset -- filtered to region=EU, projected with values_list to skip model instances, and streamed with .iterator(chunk_size=250) -- yielding one csv.writer-formatted line per row. CaptureQueriesContext shows the entire export is one SQL query (SQLite has no server-side cursor, so it is one statement, but chunk_size still bounds Python-side memory). 500 EU rows out of 1000, plus the header. The queryset is scoped, exactly as a detail view would be.',
        explainHi: 'Poora export ek single StreamingHttpResponse hai jo ek generator dwara driven hai: ye header row yield karta hai, phir queryset loop karta hai -- region=EU par filtered, model instances skip karne ko values_list se projected, aur .iterator(chunk_size=250) se streamed -- prati row ek csv.writer-formatted line yield karke. CaptureQueriesContext dikhata hai poora export ek SQL query hai. 1000 me se 500 EU rows, plus header. Queryset scoped hai, theek jaise ek detail view hoti.',
      },
      {
        title: 'Streaming NDJSON instead of a JSON array (no brackets/commas to manage)',
        titleHi: 'Ek JSON array ke badle streaming NDJSON (koi brackets/commas manage nahi)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, MIDDLEWARE=[])
django.setup()

import json
from django.db import models, connection
from django.http import StreamingHttpResponse
from django.urls import path
from django.test import Client

class Row(models.Model):
    k = models.CharField(max_length=10)
    v = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Row)
Row.objects.bulk_create([Row(k=f"k{i}", v=i * i) for i in range(5)])

def export_ndjson(request):
    rows = Row.objects.values("k", "v").iterator(chunk_size=2)
    def stream():
        for obj in rows:
            yield json.dumps(obj) + "\\n"        # one self-contained JSON doc per line
    return StreamingHttpResponse(stream(), content_type="application/x-ndjson")

urlpatterns = [path("export.ndjson", export_ndjson)]
c = Client()

body = b"".join(c.get("/export.ndjson").streaming_content).decode()
print(body, end="")
print("---")
parsed = [json.loads(line) for line in body.splitlines()]
print("parsed back:", parsed[:2], "...")
print("each line is valid JSON on its own -- no need to buffer an array or track commas")`,
        output: `{"k": "k0", "v": 0}
{"k": "k1", "v": 1}
{"k": "k2", "v": 4}
{"k": "k3", "v": 9}
{"k": "k4", "v": 16}
---
parsed back: [{'k': 'k0', 'v': 0}, {'k': 'k1', 'v': 1}] ...
each line is valid JSON on its own -- no need to buffer an array or track commas
`,
        explain: 'NDJSON -- newline-delimited JSON -- writes one complete JSON document per line. The generator yields json.dumps(obj) plus a newline for each row, streamed from .iterator(). Compared with returning a JSON array, this is strictly simpler to stream: you never hold the array, and you never have to emit the opening bracket, the inter-element commas, and the closing bracket in the right places while streaming. Each line parses independently, so a consumer can process the stream row by row without waiting for the end. It is the standard format for large data exports and log pipelines.',
        explainHi: 'NDJSON -- newline-delimited JSON -- prati line ek poora JSON document likhta hai. Generator har row ke liye json.dumps(obj) plus ek newline yield karta hai, .iterator() se streamed. Ek JSON array return karne ke muqable, ye stream karne mein bilkul saral hai: aap kabhi array nahi rakhte, aur aapko kabhi brackets aur inter-element commas sahi jagah emit nahi karne padte. Har line swतंtra roop se parse hoti hai. Ye bade data exports aur log pipelines ke liye standard format hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def export(request):
    rows = Sale.objects.values_list("id", "amount")
    lines = ["id,amount"]
    for r in rows:
        lines.append(f"{r[0]},{r[1]}")              # whole file assembled in a list
    return HttpResponse("\\n".join(lines), content_type="text/csv")`,
        right: `@transaction.non_atomic_requests
def export(request):
    writer = csv.writer(Echo())
    rows = Sale.objects.values_list("id", "amount").iterator(chunk_size=2000)
    def stream():
        yield writer.writerow(["id", "amount"])
        for r in rows:
            yield writer.writerow(r)
    resp = StreamingHttpResponse(stream(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="sales.csv"'
    return resp`,
        why: 'Building the CSV as a `list` and joining it holds every line in memory *and* loads the whole queryset (no `.iterator()`), so peak memory is roughly two copies of the entire table. It also hand-rolls CSV formatting, which is wrong the moment a value contains a comma, a quote, or a newline. `csv.writer` + the `Echo` trick handles quoting correctly and yields one line at a time; `.iterator()` keeps the DB side streaming. Same output for 100 rows, survivable for 100 million.',
        whyHi: 'CSV ko ek `list` ke roop mein banana aur ise join karna har line memory mein rakhta hai *aur* poora queryset load karta hai (koi `.iterator()` nahi), toh peak memory lगbhag poori table ki do copies hai. Ye CSV formatting bhi hand-roll karta hai, jo galat hai jis pal ek value mein ek comma, ek quote, ya ek newline hota hai. `csv.writer` + `Echo` trick quoting sahi handle karta hai aur ek samay ek line yield karta hai.',
      },
      {
        wrong: `# a 5-million-row export, streamed straight from the request
def export_everything(request):
    return StreamingHttpResponse(generate_csv(Everything.objects.all()),
                                 content_type="text/csv")
# runs for 4 minutes; nginx proxy_read_timeout (60s) kills it; user gets a truncated file`,
        right: `def request_export(request):
    exp = Export.objects.create(user=request.user, status="pending", params=request.GET.dict())
    build_export.delay(exp.id)                       # Celery task (lesson 6)
    return JsonResponse({"export_id": exp.id, "status_url": f"/exports/{exp.id}/"}, status=202)
# the task writes the CSV to S3 and emails a signed link when done`,
        why: 'Streaming fixes memory and first-byte latency but not duration. A multi-minute export streamed from a request pins a sync worker for those minutes and will be killed by the first proxy or load-balancer timeout it crosses — and since the response already sent `200`, the user just gets a silently truncated file. Past a size/duration threshold, the export must be a background job: the request enqueues and returns `202`, a Celery worker generates the file into object storage on its own schedule (with retries), and the user gets a signed download link. The web tier stays responsive.',
        whyHi: 'Streaming memory aur first-byte latency theek karta hai par duration nahi. Ek request se stream kiya gaya multi-minute export un minuton ke liye ek sync worker pin karta hai aur jo pehla proxy ya load-balancer timeout ye cross karta hai usse maara jaayega — aur kyunki response pehle hi `200` bhej chuka, user ko bas ek chupchaap truncated file milti hai. Ek size/duration threshold ke baad, export ek background job hona chahiye: request enqueue karke `202` return karta hai, ek Celery worker file ko object storage mein generate karta hai.',
      },
      {
        wrong: `def export(request):
    # no scoping -- any logged-in user exports the whole table
    rows = Invoice.objects.values_list("id", "customer_id", "total").iterator()
    ...
# GET /export/ returns every customer's invoices`,
        right: `def export(request):
    rows = (Invoice.objects
            .filter(customer=request.user)            # scope to the requester
            .values_list("id", "total")
            .iterator(chunk_size=2000))
    ...`,
        why: 'An export endpoint is a read endpoint, and every read endpoint needs the same authorization as a detail view (Modules 4 and 6). An unscoped `Invoice.objects.all()` in an export means any authenticated user downloads every customer\'s invoices — a bulk IDOR, and a far worse breach than a single-record one because it leaks the entire table in one request. Scope the queryset to `request.user` (or their org/tenant) exactly as `get_queryset` would in a DRF viewset.',
        whyHi: 'Ek export endpoint ek read endpoint hai, aur har read endpoint ko ek detail view jaisi hi authorization chahiye (Modules 4 aur 6). Ek export mein ek unscoped `Invoice.objects.all()` ka matlab koi bhi authenticated user har customer ke invoices download karta hai — ek bulk IDOR, aur ek single-record se kahin bura breach kyunki ye ek request mein poori table leak karta hai. Queryset ko `request.user` par scope karo.',
      },
    ],

    realWorld: [
      {
        en: '**The "Export to CSV" button on every list view** — a shared `stream_csv(queryset, columns, filename)` helper wrapping the `Echo` + `.values_list().iterator()` + `StreamingHttpResponse` pattern, `@transaction.non_atomic_requests`, and a row-count guard that returns `202` + an async job for anything over ~50k rows.',
        hi: '**Har list view par "Export to CSV" button** — ek shared `stream_csv(queryset, columns, filename)` helper jo `Echo` + `.values_list().iterator()` + `StreamingHttpResponse` pattern wrap karta hai, `@transaction.non_atomic_requests`, aur ek row-count guard jo ~50k rows se zyada ke liye `202` + ek async job return karta hai.',
      },
      {
        en: '**A nightly "full data dump" as NDJSON to object storage** — a Celery beat task streams every row of the core tables to gzipped `.ndjson.gz` files in S3 for the data warehouse / BI pipeline to ingest, off a read replica, with each table\'s file written and checksummed independently.',
        hi: '**Ek nightly "full data dump" object storage ko NDJSON ke roop mein** — ek Celery beat task core tables ki har row ko S3 mein gzipped `.ndjson.gz` files mein stream karta hai data warehouse / BI pipeline ke ingest karne ke liye, ek read replica se.',
      },
      {
        en: '**User-requested account exports (GDPR "download my data")** — always async: an `Export` model, a Celery task assembling a zip of JSON/CSV files into storage, an email with a 24-hour signed link, and the `Export` row auto-deleted after expiry. Never streamed from the request because it spans a dozen tables.',
        hi: '**User-requested account exports (GDPR "mera data download karo")** — hamesha async: ek `Export` model, ek Celery task jo storage mein JSON/CSV files ka ek zip assemble karta hai, ek 24-ghante ke signed link ke saath ek email, aur expiry ke baad `Export` row auto-deleted. Kabhi request se stream nahi kiya jaata.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the streaming CSV export pattern. What is the `Echo` class for?',
        qHi: 'Streaming CSV export pattern bataiye. `Echo` class kis liye hai?',
        a: 'The pattern composes streaming responses and lazy querysets. You build a StreamingHttpResponse whose iterator is a generator function. The generator first yields the header row, then loops over the queryset — fetched with values_list to skip model instantiation and iterator with a chunk_size so neither Django nor the driver holds the whole table — and yields one formatted line per row. You set Content-Disposition to attachment with a filename so the browser saves it, and decorate the view with transaction.non_atomic_requests so a long export does not hold a database transaction for its whole duration. You also scope the queryset to the requesting user, because an export is a read endpoint and just as exposed to IDOR as a detail view. The Echo class exists because csv.writer is built to write into a file object — it calls file.write(line) for each row. We do not want a file; we want each formatted line as a string so we can yield it. Echo is a fake file whose write method simply returns its argument instead of storing it, so writer.writerow(row) returns the fully formatted CSV line — correct quoting for values containing commas or quotes, the RFC 4180 carriage-return-newline terminator — and the generator yields that string directly. No buffer, no temp file, constant memory. The reason you use csv.writer at all rather than an f-string is that hand-rolled CSV breaks the moment a field contains a comma, a double quote, or a newline.',
        aHi: 'Pattern streaming responses aur lazy querysets ko compose karta hai. Aap ek StreamingHttpResponse banate ho jiska iterator ek generator function hai. Generator pehle header row yield karta hai, phir queryset par loop karta hai — values_list se fetch kiya model instantiation skip karne ko aur ek chunk_size ke saath iterator taaki na Django na driver poori table rakhe — aur prati row ek formatted line yield karta hai. Aap Content-Disposition ko ek filename ke saath attachment set karte ho taaki browser ise save kare, aur view ko transaction.non_atomic_requests se decorate karte ho. Aap queryset ko requesting user par scope bhi karte ho, kyunki ek export ek read endpoint hai aur ek detail view jitna hi IDOR ke liye exposed. Echo class isliye maujood hai kyunki csv.writer ek file object mein likhne ke liye bana hai — ye har row ke liye file.write(line) call karta hai. Hume file nahi chahiye; hume har formatted line ek string ke roop mein chahiye taaki hum ise yield kar sakein. Echo ek nakli file hai jiska write method apne argument ko store karne ke badle bas return karta hai, toh writer.writerow(row) poori formatted CSV line return karta hai — commas ya quotes waali values ke liye sahi quoting — aur generator wo string seedhe yield karta hai.',
      },
      {
        q: 'At what point does a streaming export stop being the right answer, and what replaces it?',
        qHi: 'Ek streaming export kis point par sahi jawab hona band kar deta hai, aur ise kya replace karta hai?',
        a: 'Streaming gives you constant memory and a fast first byte, but it does not bound the duration of the request. The request runs for exactly as long as generating the file takes, and during that time a synchronous web worker is fully occupied — so a handful of concurrent large exports can consume the whole worker pool and make the site unresponsive. On top of that, almost every layer in front of the app has a timeout: nginx proxy_read_timeout defaults to 60 seconds, load balancers commonly cut idle connections at 60 seconds, Cloudflare caps at around 100. Any export that runs longer than the tightest of those gets its connection killed mid-stream, and because the response already sent a 200 status line the user just receives a silently truncated file with no error. And there is no retry and no progress indication. So once an export is expected to take more than a few seconds, or spans multiple large tables, or has a row count in the hundreds of thousands or more, it should be a background job. The request handler validates the parameters, creates an Export record with status pending, enqueues a Celery task with that record\'s id, and immediately returns 202 Accepted with a URL to poll or a promise to email. The Celery worker runs the same iterator-based streaming generation, but writes the output to object storage rather than an HTTP socket, can retry on transient failures, and updates a progress field. When it finishes it marks the record ready and notifies the user with a short-lived signed download URL that points straight at object storage, so the file bytes never pass through Django. This makes the export observable, resumable, and cheap for the web tier.',
        aHi: 'Streaming aapko constant memory aur ek tez pehla byte deta hai, par ye request ki duration nahi baandhta. Request theek utni der chalta hai jitni file generate karne mein lagti hai, aur us samay ek synchronous web worker poori tarah occupied hai — toh kuch concurrent bade exports poore worker pool ko consume kar sakte hain. Iske upar, app ke aage lगbhag har layer ka ek timeout hai: nginx proxy_read_timeout default 60 second, load balancers aksar 60 second par idle connections kaat dete hain, Cloudflare lगbhag 100 par cap karta hai. Koi bhi export jo unme se sabse tight se lamba chalta hai uska connection beech-stream maara jaata hai, aur kyunki response pehle hi ek 200 status line bhej chuka user ko bas ek chupchaap truncated file milti hai bina error ke. Toh ek baar ek export se kuch second se zyada lagne ki ummeed hai, ya ye kई badi tables span karta hai, ya iska row count laakhon mein hai, ise ek background job hona chahiye. Request handler parameters validate karta hai, status pending ke saath ek Export record banata hai, us record ki id ke saath ek Celery task enqueue karta hai, aur turant ek poll URL ke saath 202 Accepted return karta hai. Celery worker wahi iterator-based streaming generation chalata hai, par output ko ek HTTP socket ke badle object storage mein likhta hai, transient failures par retry kar sakta hai. Ho jaane par ye record ko ready mark karta hai aur user ko ek short-lived signed download URL se notify karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django, `INSTALLED_APPS=[]`. Define `class Echo: def write(self, value): return value`. Make `writer = csv.writer(Echo())`. Call `writer.writerow(["id", "name", "note"])`, `writer.writerow([1, "Ada", "has, a comma"])`, and `writer.writerow([2, \'a "quote"\', "x"])`. Assert each return value is a `str`, ends with `"\\r\\n"`, the comma row is wrapped in quotes, and the quote row doubles the `"`.',
        taskHi: 'Standalone Django, `INSTALLED_APPS=[]`. `class Echo: def write(self, value): return value` define karo. `writer = csv.writer(Echo())`. `writerow` teen baar call karo (header, comma waali row, quote waali row). Assert har return value ek `str` hai, `"\\r\\n"` se khatam hoti hai, comma row quotes mein wrapped hai, quote row `"` ko double karti hai.',
        hint: '`import csv`. `csv.writer(fileobj)` calls `fileobj.write(formatted_line)` and (when `write` returns the line) `writerow` returns it. RFC 4180: fields with `,`/`"`/newline get quoted; a literal `"` becomes `""`.',
        hintHi: '`import csv`. `csv.writer(fileobj)` `fileobj.write(formatted_line)` call karta hai aur `writerow` ise return karta hai. RFC 4180: `,`/`"`/newline waale fields quote hote hain; ek literal `"` `""` ban jaata hai.',
      },
      {
        task: 'Model `Sale` (`region`, `amount`), seed 1000 alternating `"NA"`/`"EU"`. An `export` view: read `request.GET.get("region")`, optionally `.filter(region=...)`, then `.values_list("id","region","amount").iterator(chunk_size=250)`, stream via `Echo`+`csv.writer` with a header row, `StreamingHttpResponse(content_type="text/csv")` + `Content-Disposition`. With `Client` inside `CaptureQueriesContext`: `GET /export/?region=EU`, join `streaming_content`, assert 1 header + 500 data lines and exactly **1** DB query.',
        taskHi: '`Sale` (`region`, `amount`) model, 1000 seed (`"NA"`/`"EU"` alternate). Ek `export` view: `request.GET.get("region")`, optionally `.filter(...)`, phir `.values_list(...).iterator(chunk_size=250)`, `Echo`+`csv.writer` se header row ke saath stream, `StreamingHttpResponse` + `Content-Disposition`. `Client` + `CaptureQueriesContext` se: `GET /export/?region=EU`, join karo, assert 1 header + 500 data lines aur theek **1** DB query.',
        hint: 'The whole export is one `SELECT` — `.iterator()` streams it, but SQLite still does it as a single query (no server-side cursor). `body.splitlines()` -> `[header, *rows]`.',
        hintHi: 'Poora export ek `SELECT` hai — `.iterator()` ise stream karta hai, par SQLite abhi bhi ise ek single query ke roop mein karta hai. `body.splitlines()` -> `[header, *rows]`.',
      },
      {
        task: 'Model `Row` (`k`, `v`), seed 5. An `export_ndjson` view that streams `Row.objects.values("k","v").iterator(chunk_size=2)` as newline-delimited JSON: `yield json.dumps(obj) + "\\n"` per row, `content_type="application/x-ndjson"`. With `Client`, join `streaming_content`, then `json.loads` each line back into a list of dicts. Assert 5 dicts, each with keys `k` and `v`, and that each line independently parses as valid JSON (no array brackets, no trailing comma handling needed).',
        taskHi: '`Row` (`k`, `v`) model, 5 seed. Ek `export_ndjson` view jo `Row.objects.values("k","v").iterator(chunk_size=2)` ko newline-delimited JSON ke roop mein stream kare: prati row `yield json.dumps(obj) + "\\n"`, `content_type="application/x-ndjson"`. `Client` se join karo, phir har line ko `json.loads` karo. Assert 5 dicts, har ek mein `k` aur `v` keys, aur har line swतंtra roop se valid JSON parse karti hai.',
        hint: '`import json`. NDJSON = one JSON value per line. Unlike a JSON array you never hold the whole structure and never manage `[`, `]`, or inter-element commas — each `yield` is complete and independent.',
        hintHi: '`import json`. NDJSON = prati line ek JSON value. Ek JSON array ke vipreet aap kabhi poori structure nahi rakhte aur kabhi `[`, `]`, ya commas manage nahi karte.',
      },
    ],

    keyTakeaways: [
      'Streaming CSV pattern = `StreamingHttpResponse` over a generator that `yield`s the header then loops `qs.values_list(...).iterator(chunk_size=N)` yielding one formatted line each. Constant memory for any table size; 1 DB query.',
      'The `Echo` trick: `csv.writer` wants a file with `.write()`. `class Echo: def write(self, v): return v` makes `writer.writerow(row)` RETURN the fully-formatted line (correct quoting for commas/quotes/newlines, `\\r\\n` terminator) so you can `yield` it — no file, no buffer.',
      'Details: `@transaction.non_atomic_requests` (don\'t hold a txn), `filter(owner=request.user)` (exports are IDOR-exposed reads), `Content-Disposition: attachment; filename=...`, `yield "\\ufeff"` first for Excel/UTF-8.',
      'NDJSON (`yield json.dumps(obj) + "\\n"`) streams better than a JSON array — each line is self-contained, no need to buffer the array or manage brackets/commas. True `.xlsx` CANNOT be streamed (it\'s a zip) — build it in a task.',
      'Streaming fixes MEMORY + first-byte latency. It does NOT fix: duration (request runs the whole generation time), timeout safety (nginx `proxy_read_timeout` 60s / LB idle / Cloudflare 100s kill it mid-stream), retries, or progress.',
      'Past a threshold (~10^5 rows, >5s, multiple big tables): make it a BACKGROUND JOB. Request creates `Export(status="pending")` + enqueues a Celery task + returns `202` + poll URL. Task writes the file to object storage (with retries), then notifies a signed download link.',
      'The async export download is a short-lived PRE-SIGNED URL to object storage — the file bytes never flow through Django. Or a small `FileResponse` view from storage with the ownership check.',
      'This is the same "too long for a request" discipline as report generation, bulk email, file processing, third-party sync — accept, enqueue, return `202`, notify on completion.',
    ],
    keyTakeawaysHi: [
      'Streaming CSV pattern = ek generator ke upar `StreamingHttpResponse` jo header `yield` karta hai phir `qs.values_list(...).iterator(chunk_size=N)` loop karta hai prati row ek formatted line yield karke. Kisi bhi table size ke liye constant memory; 1 DB query.',
      '`Echo` trick: `csv.writer` ko `.write()` waali ek file chahiye. `class Echo: def write(self, v): return v` `writer.writerow(row)` ko poori-formatted line RETURN karwaata hai (commas/quotes/newlines ke liye sahi quoting, `\\r\\n` terminator) taaki aap ise `yield` kar sakein — koi file nahi, koi buffer nahi.',
      'Details: `@transaction.non_atomic_requests`, `filter(owner=request.user)` (exports IDOR-exposed reads hain), `Content-Disposition: attachment; filename=...`, Excel/UTF-8 ke liye pehle `yield "\\ufeff"`.',
      'NDJSON (`yield json.dumps(obj) + "\\n"`) ek JSON array se behtar stream karta hai — har line self-contained hai. Sacha `.xlsx` stream NAHI kiya ja sakta (ek zip hai) — ise ek task mein banao.',
      'Streaming MEMORY + first-byte latency theek karta hai. Ye NAHI theek karta: duration, timeout safety (nginx `proxy_read_timeout` 60s / LB idle / Cloudflare 100s ise beech-stream maar dete hain), retries, ya progress.',
      'Ek threshold ke baad (~10^5 rows, >5s, kई badi tables): ise ek BACKGROUND JOB banao. Request `Export(status="pending")` banata hai + ek Celery task enqueue + `202` + poll URL return. Task file ko object storage mein likhta hai (retries ke saath), phir ek signed download link notify karta hai.',
      'Async export download object storage ka ek short-lived PRE-SIGNED URL hai — file bytes kabhi Django se nahi behte. Ya storage se ek chhota `FileResponse` view ownership check ke saath.',
      'Ye wahi "request ke liye bahut lamba" discipline hai jaise report generation, bulk email, file processing — accept karo, enqueue karo, `202` return karo, completion par notify karo.',
    ],
  },
];
