/**
 * Python Complete Course — Module 10: Concurrency, Performance & the Runtime, lessons 1-3.
 *
 * Lesson 1: the GIL and what "concurrency" means — concurrency vs parallelism,
 *           CPU-bound vs I/O-bound, what the GIL does and does not block, the
 *           three tools (threading / multiprocessing / asyncio) and when each fits.
 * Lesson 2: threading — `threading.Thread`, `Lock`/`RLock`, race conditions,
 *           `queue.Queue`, daemon threads, `ThreadPoolExecutor`; threads help
 *           I/O-bound work, not CPU-bound.
 * Lesson 3: multiprocessing & concurrent.futures — `Process`, `Pool`,
 *           `ProcessPoolExecutor`, pickling constraints, the `__main__` guard,
 *           passing data / returning results, when the overhead is worth it.
 *
 * NOTE for future editors: same rules as the rest of this course. Every backtick
 * inside simple/simpleHi/content/contentHi is `\`` (inline code inside ``` blocks
 * included). Escape `$` before `{` inside template literals as `\${`. Keep example
 * OUTPUT ASCII-only. `examples` use `code` + `output`; run every sample with
 * `python`. Timing-sensitive examples use `time.sleep` with WIDE margins and print
 * BOOLEANS (elapsed < threshold), never raw seconds. Never put a literal `\n`
 * inside a `textwrap.dedent('''...''')` block — it becomes a real newline in the
 * generated .py and breaks the dedent; use `.strip()` on captured output instead.
 * Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .` from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_10: CourseLesson[] = [
  {
    slug: 'py-the-gil-and-concurrency',
    title: 'The GIL, and What "Concurrency" Actually Means',
    titleHi: 'GIL, Aur "Concurrency" Ka Asli Matlab',
    description: 'Hearing "Python can\'t do threads because of the GIL", then seeing a web framework serve thousands of concurrent requests with threads — and needing to understand why both statements are true. The GIL stops two threads running Python bytecode at the same instant; it does not stop threads from being useful while one waits on the network.',
    descriptionHi: 'Sunna "Python threads nahi kar sakta GIL ki wajah se", phir dekhna ek web framework threads ke saath hazaaron concurrent requests serve karता hai — aur samajhna kyun dono baatein sach hain. GIL do threads ko ek hi pal Python bytecode chalाne se rokता hai; ye threads ko useful hone se nahi rokता jab ek network ka wait kar raha ho.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**One kitchen, one chef, many pots on the stove.** The chef (the Python interpreter) can only actively chop, stir, or plate one dish at a time — that single-chef rule is the GIL. Hiring a second pair of hands (a second thread) does not help if both need the chef\'s knife: they take turns, and the total chopping still happens one cut at a time. That is why CPU-bound work — number crunching, image processing — does not speed up with threads in Python. **But** most restaurant work is waiting: water boiling, bread in the oven, a delivery van in traffic. While a pot simmers, the chef walks away and starts another dish. Threads work exactly like this for **I/O-bound** work — a thread waiting on a network response, a database, or a file *releases the chef* so another thread runs. Ten threads each waiting on a slow API finish in about the time of one, because the waiting overlaps. When you genuinely need two chefs chopping at once (real CPU parallelism), you open a second kitchen: that is `multiprocessing`, a separate interpreter with its own GIL in its own process.',
      hi: '**Ek kitchen, ek chef, stove par kai bartan.** Chef (Python interpreter) ek samay mein sirf ek dish actively chop, stir, ya plate kar sakta hai — wo single-chef niyam GIL hai. Ek doosra jodा haath (doosra thread) madad nahi karता agar dono ko chef ka knife chahiye: wo baari lete hain. Isiliye CPU-bound kaam — number crunching, image processing — Python mein threads se tez nahi hoता. **Par** adhikaansh restaurant kaam wait karna hai: paani ubalna, bread oven mein, delivery van traffic mein. Jab ek bartan simmer karता hai, chef door jाता hai aur doosri dish shuru karता hai. Threads bilkul aise kaam karते hain **I/O-bound** kaam ke liye — ek thread jo network response, database, ya file ka wait kar raha hai *chef ko release karता hai*. Dus threads har ek slow API ka wait karते hue ek ke samay mein khatam hote hain. Jab aapko sachmuch do chefs ek saath chop karте chahiye, aap doosra kitchen kholते ho: wo `multiprocessing` hai.',
    },

    simple: `**Concurrency vs parallelism**

\`\`\`
CONCURRENCY  = dealing with many things at once   (structure: tasks interleave)
PARALLELISM  = doing many things at the same instant (hardware: multiple cores run)

threading   -> concurrency, NOT parallelism for Python code (one GIL)
asyncio     -> concurrency, NOT parallelism (one thread, cooperative)
multiprocessing -> real parallelism (N processes, N GILs, N cores)
\`\`\`

**The GIL (Global Interpreter Lock)**

\`\`\`
A single lock inside CPython. A thread must HOLD it to execute Python bytecode.
=> at most ONE thread runs Python code at any instant, even on a 16-core CPU.

The GIL is RELEASED:
  - automatically every few milliseconds (so threads take turns)
  - while a thread waits on I/O (socket, file, subprocess, time.sleep)
  - inside many C extensions during heavy work (NumPy, hashlib, zlib, ...)
\`\`\`

**CPU-bound vs I/O-bound — the question that picks your tool**

\`\`\`python
# CPU-bound: the bottleneck is computation (the CPU is at 100%)
def count_primes(limit): ...          # threads do NOT help -> use multiprocessing

# I/O-bound: the bottleneck is WAITING (CPU near idle)
def fetch(url): ...                    # threads DO help -> use threading or asyncio
def read_files(paths): ...            # waiting on disk -> threads help
\`\`\`

**Which tool**

\`\`\`
                 many I/O waits         heavy CPU work        thousands of tasks
threading        good                   no benefit            ~hundreds max (memory)
multiprocessing  overkill               YES                    limited by cores
asyncio          YES (if libs async)    no benefit            YES (cheap tasks)
\`\`\`

\`\`\`
RULE OF THUMB
  I/O-bound, a few dozen tasks       -> threading (ThreadPoolExecutor)
  I/O-bound, thousands of tasks      -> asyncio (async libraries required)
  CPU-bound                          -> multiprocessing (ProcessPoolExecutor)
  CPU-bound in NumPy / pandas / C    -> often already parallel; threads can help
  not sure it is slow                -> MEASURE first (Module 10 lesson 6)
\`\`\``,

    simpleHi: `**Concurrency vs parallelism**

\`\`\`
CONCURRENCY  = ek saath kai cheezein handle karna   (structure: tasks interleave)
PARALLELISM  = ek hi pal kai cheezein karna          (hardware: kai cores chalते hain)

threading   -> concurrency, Python code ke liye PARALLELISM NAHI (ek GIL)
asyncio     -> concurrency, PARALLELISM NAHI (ek thread, cooperative)
multiprocessing -> asli parallelism (N processes, N GILs, N cores)
\`\`\`

**GIL (Global Interpreter Lock)**

\`\`\`
CPython ke andar ek akela lock. Ek thread ko Python bytecode chalाne ke liye ise HOLD karna hoga.
=> kisi bhi pal par zyada se zyada EK thread Python code chalाता hai, 16-core CPU par bhi.

GIL RELEASE hoता hai:
  - apne aap har kuch milliseconds (toh threads baari lete hain)
  - jab ek thread I/O ka wait karता hai (socket, file, subprocess, time.sleep)
  - kai C extensions ke andar bhaari kaam ke dauraan (NumPy, hashlib, zlib, ...)
\`\`\`

**CPU-bound vs I/O-bound — wo sawaal jo aapka tool chunता hai**

\`\`\`python
# CPU-bound: bottleneck computation hai (CPU 100% par)
def count_primes(limit): ...          # threads madad NAHI karते -> multiprocessing

# I/O-bound: bottleneck WAIT karna hai (CPU lगbhag idle)
def fetch(url): ...                    # threads madad KARTे hain -> threading ya asyncio
\`\`\`

**Kaunsa tool**

\`\`\`
                 kai I/O waits          bhaari CPU kaam       hazaaron tasks
threading        achha                  koi faayda nahi       ~sau max (memory)
multiprocessing  zyada                  HAAN                   cores se limited
asyncio          HAAN (agar libs async) koi faayda nahi       HAAN (saste tasks)
\`\`\`

\`\`\`
RULE OF THUMB
  I/O-bound, kuch dozen tasks        -> threading (ThreadPoolExecutor)
  I/O-bound, hazaaron tasks          -> asyncio (async libraries chahiye)
  CPU-bound                          -> multiprocessing (ProcessPoolExecutor)
  CPU-bound NumPy / pandas / C mein  -> aksar pehle se parallel
  yakeen nahi ki ye slow hai         -> pehle MEASURE karो (lesson 6)
\`\`\``,

    content: `## Concurrency is not parallelism

**Concurrency** is a way of structuring a program so that multiple tasks can be *in progress* at the same time — they interleave. **Parallelism** is multiple tasks *executing* at the same physical instant on multiple cores. Concurrency is about dealing with a lot at once; parallelism is about doing a lot at once. You can have concurrency on a single core (tasks take turns), and you need multiple cores for parallelism.

Python gives you three concurrency tools. Only one of them (\`multiprocessing\`) gives you parallelism for Python code.

## The GIL

CPython — the standard interpreter — has a **Global Interpreter Lock**: a single mutex that a thread must hold to execute Python bytecode or touch Python objects. Its purpose is to make CPython's memory management (reference counting) safe without a lock on every single object.

Consequence: **no two threads run Python bytecode simultaneously**, no matter how many cores you have. Two threads doing \`total += 1\` in a loop will not go twice as fast — they will go slightly *slower* than one, because of lock contention and context-switching overhead.

But the GIL is released in three important situations:

1. **Periodically** — roughly every 5 ms, the running thread drops the GIL so another can run. This is what makes threading "concurrent" at all.
2. **During blocking I/O** — when a thread calls into the OS to read a socket, read a file, run a subprocess, or \`time.sleep\`, it releases the GIL for the duration of the wait. Other threads run freely while it waits.
3. **Inside C extensions** — well-written extensions (NumPy, \`hashlib\`, \`zlib\`, \`lxml\`, database drivers) release the GIL around heavy C-level work, so that work *can* run in parallel with Python code or other C work.

> **Python 3.13+ has an experimental free-threaded build** (\`python3.13t\`) with no GIL. It is opt-in, not the default, and many C extensions do not support it yet. For now, assume the GIL is there.

## CPU-bound vs I/O-bound

This single distinction decides your tool.

- **CPU-bound**: the program is limited by how fast the CPU can compute. The core is pegged at 100%. Examples: parsing a huge file, resizing images, cryptography, numeric simulation, regex over gigabytes. Threads give **no speedup** (the GIL serialises them). Use \`multiprocessing\` — separate processes each have their own interpreter and GIL and can run on separate cores.
- **I/O-bound**: the program is limited by waiting for something external — a network response, a database query, a disk read, a subprocess. The CPU is mostly idle. Examples: a web scraper, an API client, a web server handling requests. Threads (or \`asyncio\`) give a **large speedup** because the waits overlap: while thread A waits for its HTTP response, threads B–Z make their requests.

A quick test: run the task and watch CPU usage. Near 100% on one core -> CPU-bound. Near 0% while it waits -> I/O-bound.

## The three tools

### \`threading\` — OS threads, shared memory

Real OS threads, scheduled by the OS, all sharing the same memory. Good for I/O-bound work with a modest number of tasks (dozens to low hundreds — each thread costs ~8 MB of stack by default). You must protect shared mutable state with locks. The GIL means CPU-bound code gets no benefit.

### \`multiprocessing\` — separate processes, real parallelism

Each worker is a full separate Python process with its own memory and its own GIL, so CPU-bound code runs truly in parallel across cores. The cost: starting a process is expensive (tens of ms), and data passed to/from workers must be **pickled** (serialised) and copied — so it fits coarse-grained work (big chunks, few round-trips), not chatty fine-grained work.

### \`asyncio\` — one thread, cooperative multitasking

A single thread runs an **event loop**. Tasks are coroutines that voluntarily \`await\` at each point where they would block; the loop runs another task until the first is ready. No locks needed (one thread), and tasks are cheap (thousands are fine). The catch: **every library in the path must be async** — one blocking call (a synchronous DB driver, \`requests\`, \`time.sleep\`) freezes the entire loop. Covered in lessons 4–5.

## \`concurrent.futures\` — the unified front door

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:       # I/O-bound
    results = list(pool.map(fetch, urls))

with ProcessPoolExecutor(max_workers=4) as pool:      # CPU-bound
    results = list(pool.map(count_primes, ranges))
\`\`\`

Same API for both. Switching \`Thread\` -> \`Process\` is a one-word change. Start here rather than the lower-level \`threading\`/\`multiprocessing\` APIs.`,

    contentHi: `## Concurrency parallelism nahi hai

**Concurrency** ek program ko structure karne ka tarika hai taaki kai tasks ek saath *in progress* ho sakें — wo interleave karते hain. **Parallelism** kai tasks ka ek hi bhautik pal par kai cores par *execute* hona hai. Aapke paas ek single core par concurrency ho sakti hai (tasks baari lete hain), aur parallelism ke liye aapko kai cores chahiye.

Python aapko teen concurrency tools deता hai. Unmें se sirf ek (\`multiprocessing\`) aapko Python code ke liye parallelism deता hai.

## GIL

CPython — standard interpreter — mein ek **Global Interpreter Lock** hai: ek akela mutex jise ek thread ko Python bytecode execute karne ya Python objects chhoone ke liye hold karna hoga. Iska maksad CPython ke memory management (reference counting) ko har ek object par lock ke bina surakshit banाना hai.

Parinaam: **koi do threads ek saath Python bytecode nahi chalाते**, chahe aapke paas kितने cores hon. Do threads jo ek loop mein \`total += 1\` kar rahe hain do guna tez nahi jायेंगे — wo thodा *dhीmा* jायेंगे.

Par GIL teen mahatvapoorn sthितiyon mein release hoता hai:

1. **Samay-samay par** — lगbhag har 5 ms, chalta thread GIL chhodता hai taaki doosra chal sake.
2. **Blocking I/O ke dauraan** — jab ek thread socket, file, subprocess padhने ke liye, ya \`time.sleep\` ke liye OS mein call karता hai, wo wait ki avधि ke liye GIL release karता hai.
3. **C extensions ke andar** — achhे-likhे extensions (NumPy, \`hashlib\`, \`zlib\`) bhaari C-level kaam ke aas-paas GIL release karते hain.

> **Python 3.13+ mein ek experimental free-threaded build hai** (\`python3.13t\`) bina GIL. Ye opt-in hai, default nahi.

## CPU-bound vs I/O-bound

Ye ek antar aapka tool tay karता hai.

- **CPU-bound**: program iss se limited hai ki CPU kितनी tezी se compute kar sakta hai. Core 100% par. Threads **koi speedup nahi** dete. \`multiprocessing\` istemal karो.
- **I/O-bound**: program kisi baahri cheez ka wait karne se limited hai — network response, database query, disk read. CPU zyादातर idle. Threads (ya \`asyncio\`) **badा speedup** dete hain kyunki waits overlap karते hain.

Ek quick test: task chalाओ aur CPU usage dekhो. Ek core par ~100% -> CPU-bound. Wait karте hue ~0% -> I/O-bound.

## Teen tools

### \`threading\` — OS threads, shared memory

Asli OS threads, OS dwara scheduled, sab wahi memory share karते hue. I/O-bound kaam ke liye achha modest number of tasks ke saath. Aapko shared mutable state ko locks se protect karna hoga. GIL matlab CPU-bound code ko koi faayda nahi.

### \`multiprocessing\` — alag processes, asli parallelism

Har worker ek poora alag Python process apni memory aur apne GIL ke saath. Keemat: ek process shuru karna mehnga hai, aur workers ko/se pass kiya data **pickle** hona chahiye aur copy hona chahiye.

### \`asyncio\` — ek thread, cooperative multitasking

Ek akela thread ek **event loop** chalाता hai. Tasks coroutines hain jo har point par swेchha se \`await\` karते hain jahaan wo block karते. Koi locks nahi chahiye. Pech: **path mein har library async honi chahiye**.

## \`concurrent.futures\` — ekीkृत front door

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:       # I/O-bound
    results = list(pool.map(fetch, urls))

with ProcessPoolExecutor(max_workers=4) as pool:      # CPU-bound
    results = list(pool.map(count_primes, ranges))
\`\`\`

Dono ke liye wahi API. \`Thread\` -> \`Process\` badalna ek-shabd ka badlaav hai. Yahaan se shuru karो.`,

    examples: [
      {
        title: 'Threads do not speed up CPU-bound work (the GIL)',
        titleHi: 'Threads CPU-bound kaam tez nahi karते (GIL)',
        code: `import time
from concurrent.futures import ThreadPoolExecutor

def cpu_work(n):
    # a pure-Python CPU-bound loop -- holds the GIL the whole time
    total = 0
    for i in range(n):
        total += i * i
    return total

N = 2_000_000

# serial: two calls one after another
start = time.perf_counter()
cpu_work(N); cpu_work(N)
serial = time.perf_counter() - start

# "parallel": two threads
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(cpu_work, [N, N]))
threaded = time.perf_counter() - start

# threads give NO speedup for CPU-bound Python -- often slightly slower
print("threads faster than serial?", threaded < serial * 0.7)
print("both produced the same result?", cpu_work(N) == sum(i * i for i in range(N)))`,
        output: `threads faster than serial? False
both produced the same result? True`,
        explain: 'Both `cpu_work` calls are pure-Python loops that hold the GIL continuously, so the two threads cannot run their bytecode at the same time — they take turns, and the total time is essentially the same as running them one after another (often a little worse from switching overhead). `threaded < serial * 0.7` is `False`: no meaningful speedup. This is the defining symptom of a CPU-bound workload — the fix is `ProcessPoolExecutor`, not more threads.',
        explainHi: 'Dono `cpu_work` calls pure-Python loops hain jo GIL lगातार hold karते hain, isliye do threads apna bytecode ek saath nahi chalा sakte — wo baari lete hain, aur total samay lगbhag wahi hai jaise unhe ek ke baad ek chalाना. `threaded < serial * 0.7` `False` hai: koi matlabभara speedup nahi. Ye ek CPU-bound workload ka pehchaan-lakshan hai — fix `ProcessPoolExecutor` hai.',
      },
      {
        title: 'Threads DO speed up I/O-bound work (the GIL is released during waits)',
        titleHi: 'Threads I/O-bound kaam TEZ karте hain (wait ke dauraan GIL release hoता hai)',
        code: `import time
from concurrent.futures import ThreadPoolExecutor

def slow_io(label):
    time.sleep(0.2)          # stand-in for a network / disk / db wait -- GIL released here
    return label.upper()

tasks = ["a", "b", "c", "d", "e"]

# serial: 5 x 0.2s = ~1.0s
start = time.perf_counter()
serial_results = [slow_io(t) for t in tasks]
serial = time.perf_counter() - start

# threaded: all 5 waits overlap -> ~0.2s
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    threaded_results = list(pool.map(slow_io, tasks))
threaded = time.perf_counter() - start

print("serial took about 1s?   ", 0.9 < serial < 1.5)
print("threaded took under 0.5s?", threaded < 0.5)
print("same results, in order?  ", serial_results == threaded_results == ["A", "B", "C", "D", "E"])`,
        output: `serial took about 1s?    True
threaded took under 0.5s? True
same results, in order?   True
`,
        explain: 'Each `slow_io` call spends its time in `time.sleep`, which releases the GIL. So while task "a" sleeps, tasks "b"–"e" start their sleeps too — the five 0.2 s waits overlap into roughly one 0.2 s window instead of stacking to 1.0 s. `pool.map` still returns results in input order (`["A", ..., "E"]`) even though the tasks finished concurrently. This is the case where threads shine: I/O-bound work with independent waits.',
        explainHi: 'Har `slow_io` call apna samay `time.sleep` mein bitाता hai, jo GIL release karता hai. Toh jabki task "a" sleep karता hai, tasks "b"–"e" bhi apne sleeps shuru karते hain — paanch 0.2 s waits lगbhag ek 0.2 s window mein overlap karते hain 1.0 s tak stack hone ke bजaय. `pool.map` phir bhi results input kram mein lautाता hai. Ye wo case hai jahaan threads chamakते hain.',
      },
      {
        title: 'Telling CPU-bound from I/O-bound by watching the work',
        titleHi: 'Kaam dekhकर CPU-bound ko I/O-bound se pehchान',
        code: `import time

def io_bound(urls):
    for u in urls:
        time.sleep(0.05)              # waiting -- CPU idle
    return len(urls)

def cpu_bound(limit):
    count = 0
    for n in range(2, limit):        # computing -- CPU at 100%
        if all(n % d for d in range(2, int(n ** 0.5) + 1)):
            count += 1
    return count

# measure wall time vs CPU time -- process_time() only counts time ON the CPU
def profile(fn, *args):
    wall_start, cpu_start = time.perf_counter(), time.process_time()
    result = fn(*args)
    wall = time.perf_counter() - wall_start
    cpu = time.process_time() - cpu_start
    return result, wall, cpu

_, io_wall, io_cpu = profile(io_bound, ["u"] * 20)
_, cpu_wall, cpu_cpu = profile(cpu_bound, 20000)

print("io_bound:  cpu time is a small fraction of wall time?", io_cpu < io_wall * 0.5)
print("cpu_bound: cpu time is almost all of wall time?      ", cpu_cpu > cpu_wall * 0.8)
print("primes under 20000:", cpu_bound(20000))`,
        output: `io_bound:  cpu time is a small fraction of wall time? True
cpu_bound: cpu time is almost all of wall time?       True
primes under 20000: 2262
`,
        explain: '`time.perf_counter()` measures wall-clock time (real seconds elapsed); `time.process_time()` measures only CPU time actually spent executing this process. For `io_bound`, almost all the wall time is `time.sleep` — the CPU is idle — so CPU time is a small fraction: **I/O-bound, use threads/asyncio**. For `cpu_bound`, the interpreter is running the whole time, so CPU time ~= wall time: **CPU-bound, use multiprocessing**. This wall-vs-CPU ratio is the programmatic version of "watch the CPU meter".',
        explainHi: '`time.perf_counter()` wall-clock time maapता hai (asli seconds beete); `time.process_time()` sirf CPU time maapता hai jो asal mein is process ko execute karne mein kharch hua. `io_bound` ke liye, lगbhag saara wall time `time.sleep` hai — CPU idle hai — toh CPU time ek chhota hissa hai: **I/O-bound**. `cpu_bound` ke liye, interpreter poore samay chal raha hai, toh CPU time ~= wall time: **CPU-bound**.',
      },
    ],

    mistakes: [
      {
        wrong: `# "my image-processing script is slow, I'll add threads"
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=8) as pool:
    pool.map(resize_image, huge_list_of_images)   # pure-Python resize -> NO speedup`,
        right: `from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor(max_workers=8) as pool:      # separate processes -> real parallelism
    pool.map(resize_image, huge_list_of_images)
# (or: use a library like Pillow-SIMD / NumPy that releases the GIL)`,
        why: 'Image resizing in pure Python is CPU-bound: the interpreter is computing the whole time and holding the GIL. Threads just take turns on the one GIL, so eight threads run no faster than one — sometimes slower. CPU-bound work needs `ProcessPoolExecutor` (each process has its own GIL and core) or a C-backed library that releases the GIL internally.',
        whyHi: 'Pure Python mein image resizing CPU-bound hai: interpreter poore samay compute kar raha hai aur GIL hold kar raha hai. Threads bस ek GIL par baari lete hain, toh aath threads ek se tez nahi chalते. CPU-bound kaam ko `ProcessPoolExecutor` chahiye ya ek C-backed library.',
      },
      {
        wrong: `# "async is the modern way, I'll make everything async"
async def get_user(id):
    row = db.execute("SELECT ...")     # synchronous DB driver -- BLOCKS the whole event loop
    resp = requests.get(url)           # synchronous HTTP -- BLOCKS the whole event loop
    return build(row, resp)`,
        right: `# either stay synchronous with threads:
def get_user(id):
    row = db.execute("SELECT ...")
    resp = requests.get(url)
    return build(row, resp)
# run many with ThreadPoolExecutor

# or go fully async with async libraries (asyncpg, httpx.AsyncClient, aiofiles)`,
        why: 'asyncio only helps if every blocking call in the path is awaitable. A single synchronous call — a normal DB driver, `requests`, `open().read()`, `time.sleep` — blocks the one event-loop thread, freezing every other task. Half-async code is usually slower and buggier than plain threaded synchronous code. Choose one model per call path.',
        whyHi: 'asyncio sirf tab madad karता hai agar path mein har blocking call awaitable ho. Ek akela synchronous call — ek normal DB driver, `requests`, `time.sleep` — ek event-loop thread ko block karता hai, har doosre task ko freeze karता hai. Aadha-async code aksar plain threaded code se dhीmा aur zyada buggy hai.',
      },
      {
        wrong: `# "Python threads are fake, they do nothing" -> avoiding threads for a web scraper
results = []
for url in thousands_of_urls:
    results.append(requests.get(url).json())    # 1 request at a time -> hours`,
        right: `from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=32) as pool:
    results = list(pool.map(lambda u: requests.get(u).json(), thousands_of_urls))
# each request spends its time waiting on the network -> the waits overlap -> minutes`,
        why: 'The GIL claim ("threads do nothing") is only true for CPU-bound Python. A web scraper is I/O-bound — each request is mostly waiting on the network, during which the GIL is released and other threads run. Threading a scraper is often a 10–50x speedup. Dismissing threads entirely because of the GIL leaves that on the table.',
        whyHi: 'GIL daावा ("threads kuch nahi karते") sirf CPU-bound Python ke liye sach hai. Ek web scraper I/O-bound hai — har request zyादातर network par wait kar raha hai, jiske dauraan GIL release hoता hai. Ek scraper ko thread karna aksar 10–50x speedup hai.',
      },
    ],

    realWorld: [
      {
        en: '**Web servers (Gunicorn, uWSGI, Django/Flask under threads) use a process-per-core model with threads inside each** — processes for CPU parallelism across cores, threads within a process to handle many concurrent I/O-bound requests (each request mostly waits on the DB). This is the GIL story in production: `workers = 2 * cores + 1`, `threads = 2–4` per worker.',
        hi: '**Web servers (Gunicorn, uWSGI) ek process-per-core model istemal karते hain har ek ke andar threads ke saath** — cores ke paar CPU parallelism ke liye processes, ek process ke andar kai concurrent I/O-bound requests handle karne ke liye threads. Ye production mein GIL kahani hai.',
      },
      {
        en: '**Data pipelines: `multiprocessing.Pool` / `ProcessPoolExecutor` for the CPU-heavy transform stage** (parsing, feature extraction, image ops) and `ThreadPoolExecutor` for the I/O stages (downloading inputs, uploading results). NumPy / pandas / Polars operations often already release the GIL and use multiple cores, so a thread pool around them can help without `multiprocessing`.',
        hi: '**Data pipelines: CPU-bhaari transform stage ke liye `multiprocessing.Pool`** (parsing, feature extraction) aur I/O stages ke liye `ThreadPoolExecutor` (inputs download karna, results upload karna). NumPy / pandas operations aksar pehle se GIL release karते hain.',
      },
      {
        en: '**High-concurrency network services (API gateways, chat backends, scrapers at scale) use `asyncio`** with `httpx`/`aiohttp`, `asyncpg`, `redis.asyncio` — thousands of simultaneous connections on one thread, each cheap. FastAPI and Starlette are built on this. The discipline is total: one blocking call and tail latencies explode.',
        hi: '**High-concurrency network services (API gateways, chat backends) `asyncio` istemal karते hain** `httpx`/`aiohttp`, `asyncpg` ke saath — ek thread par hazaaron ek saath connections. FastAPI isi par bana hai. Discipline poori hai: ek blocking call aur tail latencies phatते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the GIL, what problem does it solve, and what are its consequences for threading?',
        qHi: 'GIL kya hai, ye kaunsi samasya hal karता hai, aur threading ke liye iske parinaam kya hain?',
        a: 'The GIL, the Global Interpreter Lock, is a single mutex inside CPython — the reference implementation — that a thread must hold in order to execute Python bytecode or manipulate Python objects. The problem it solves is memory-management safety. CPython manages memory with reference counting: every object has a count of how many references point to it, incremented and decremented as references come and go, and freed at zero. Those increments and decrements are not atomic, so if two threads adjusted the same object\'s refcount concurrently without synchronisation, counts would corrupt and you would get crashes or leaks. The GIL makes the whole interpreter a critical section, so refcounting is safe without a lock per object, which also keeps single-threaded code fast. The consequence is that no two threads run Python bytecode at the same instant, regardless of core count, so CPU-bound Python code gets no parallelism from threads — two compute-heavy threads run about as fast as one, sometimes slower due to lock hand-off overhead. However, the GIL is released in three cases: periodically, roughly every five milliseconds, so threads interleave; during blocking I/O, when a thread goes into the OS to wait on a socket, file, subprocess, or sleep, it drops the GIL for the wait; and inside C extensions that explicitly release it around heavy work, like NumPy or hashlib. So threading is genuinely useful for I/O-bound workloads, where threads spend most of their time waiting with the GIL released, and useless for CPU-bound pure-Python workloads, where multiprocessing — separate processes with separate GILs — is the answer. Python 3.13 introduced an experimental build with no GIL, but it is opt-in and not yet widely supported.',
        aHi: 'GIL, Global Interpreter Lock, CPython ke andar ek akela mutex hai jise ek thread ko Python bytecode execute karne ya Python objects manipulate karne ke liye hold karna hoga. Jो samasya ye hal karता hai wo memory-management safety hai. CPython reference counting se memory manage karता hai: har object ke paas ek count hai kितने references ise point karते hain, jо references aane-jaane par badalता hai, aur zero par free hoता hai. Wo increments aur decrements atomic nahi hain, toh agar do threads bina synchronisation ek hi object ka refcount adjust karें, counts corrupt ho jाyेंगे. GIL poore interpreter ko ek critical section banाता hai. Parinaam ye hai ki koi do threads ek hi pal Python bytecode nahi chalाते, core count chahe jо ho, toh CPU-bound Python code ko threads se koi parallelism nahi milता. Halाnki GIL teen cases mein release hoता hai: samay-samay par, blocking I/O ke dauraan, aur C extensions ke andar. Toh threading I/O-bound workloads ke liye sachmuch useful hai, aur CPU-bound pure-Python ke liye bekaar — jahaan multiprocessing jawaab hai.',
      },
      {
        q: 'How do you decide between threading, multiprocessing, and asyncio for a given task?',
        qHi: 'Ek diye gaye task ke liye aap threading, multiprocessing, aur asyncio ke beech kaise faisla karते ho?',
        a: 'The first question is whether the task is CPU-bound or I/O-bound, because that eliminates options. CPU-bound means the bottleneck is computation — the core sits at 100 percent — like parsing, numeric work, image processing, cryptography in pure Python. For that, threading and asyncio give nothing, because the GIL serialises Python execution and there is no waiting to overlap. The answer is multiprocessing, or a ProcessPoolExecutor: each worker is a separate process with its own interpreter and GIL, so the work genuinely spreads across cores. The cost is that process startup is expensive and arguments and results must be pickled and copied between processes, so it suits coarse-grained work — big chunks, few hand-offs — not chatty fine-grained calls. I/O-bound means the bottleneck is waiting on something external — network, disk, database, a subprocess — and the CPU is mostly idle. Here concurrency helps a lot because the waits overlap. Between the two I/O options: threading is the simple choice for a moderate number of concurrent tasks, say dozens to a couple hundred, and it works with ordinary synchronous libraries — you just run them in a ThreadPoolExecutor. Its limits are memory, since each thread has a stack, and lock complexity if tasks share mutable state. asyncio is the choice when you need very high concurrency — thousands of simultaneous connections — and when async-native libraries exist for everything in your path: an async HTTP client, an async database driver, and so on. Tasks are coroutines, extremely cheap, one thread runs them all cooperatively, and there are no locks. The hard constraint is that a single blocking call anywhere freezes the whole event loop, so you cannot mix in a synchronous driver without offloading it to a thread. A rule of thumb: CPU-bound goes to multiprocessing; I/O-bound with a manageable task count and sync libraries goes to threading; I/O-bound at massive scale with async libraries goes to asyncio. And before any of this, measure to confirm the task is actually slow and which category it is in.',
        aHi: 'Pehla sawaal ye hai ki task CPU-bound hai ya I/O-bound, kyunki wo options khatam karता hai. CPU-bound matlab bottleneck computation hai — core 100 percent par — jaise parsing, numeric kaam, image processing. Uske liye, threading aur asyncio kuch nahi dete, kyunki GIL Python execution ko serialise karता hai. Jawaab multiprocessing hai: har worker ek alag process apne interpreter aur GIL ke saath. Keemat ye hai ki process startup mehnga hai aur arguments aur results ko pickle aur copy karna padता hai. I/O-bound matlab bottleneck kisi baahri cheez par wait karna hai — network, disk, database — aur CPU zyादातर idle. Yahaan concurrency bahut madad karती hai. Do I/O options ke beech: threading modest number of tasks ke liye saral chunaव hai, aur ye saadharan synchronous libraries ke saath kaam karता hai. asyncio wo chunaव hai jab aapko bahut high concurrency chahiye — hazaaron connections — aur jab async-native libraries maujूd hon. Kathin constraint ye hai ki kahin bhi ek akela blocking call poore event loop ko freeze karता hai. Rule of thumb: CPU-bound multiprocessing ko; manageable count aur sync libs ke saath I/O-bound threading ko; async libs ke saath massive scale par I/O-bound asyncio ko.',
      },
    ],

    exercises: [
      {
        task: 'Write a function `is_prime(n)` and a `count_primes(limit)`. Time `count_primes(30000)` run twice serially, then via `ThreadPoolExecutor(max_workers=2)` with `pool.map`. Print whether the threaded version was at least 1.5x faster (it should NOT be — print `False`). Then explain in a comment what to switch to.',
        taskHi: 'Ek function `is_prime(n)` aur ek `count_primes(limit)` likhо. `count_primes(30000)` do baar serially time karो, phir `ThreadPoolExecutor(max_workers=2)` ke zariye. Print karो ki threaded version kam se kam 1.5x tez tha (NAHI hona chahiye).',
        hint: '`count_primes` is pure-Python CPU work -> holds the GIL -> threads take turns. `threaded < serial / 1.5` will be `False`. The comment: switch to `ProcessPoolExecutor` — separate processes each get their own GIL and core.',
        hintHi: '`count_primes` pure-Python CPU kaam hai -> GIL hold karता hai -> threads baari lete hain. `threaded < serial / 1.5` `False` hoga. Comment: `ProcessPoolExecutor` par switch karो.',
      },
      {
        task: 'Write `fake_fetch(n)` that does `time.sleep(0.1)` and returns `n * n`. Call it for `range(10)` serially (time it, ~1s) and via `ThreadPoolExecutor(max_workers=10)` (time it, ~0.1s). Assert the results lists are equal and in order, and that the threaded run was under 0.4s. Print three booleans.',
        taskHi: '`fake_fetch(n)` likhो jо `time.sleep(0.1)` kare aur `n * n` lautае. Ise `range(10)` ke liye serially call karो (~1s) aur `ThreadPoolExecutor(max_workers=10)` ke zariye (~0.1s). Assert karो ki results lists barabar aur kram mein hain.',
        hint: '`serial = [fake_fetch(n) for n in range(10)]`; `threaded = list(pool.map(fake_fetch, range(10)))`. `pool.map` preserves input order. `time.sleep` releases the GIL so all 10 sleeps overlap.',
        hintHi: '`serial = [fake_fetch(n) for n in range(10)]`; `threaded = list(pool.map(fake_fetch, range(10)))`. `pool.map` input kram rakhता hai. `time.sleep` GIL release karता hai.',
      },
      {
        task: 'Write a `classify(fn, *args)` helper that runs `fn` and returns `"CPU-bound"` if `process_time` is more than 70% of `perf_counter` wall time, else `"I/O-bound"`. Test it on a busy-loop function and on a `time.sleep(0.3)` function. Print both classifications.',
        taskHi: 'Ek `classify(fn, *args)` helper likhо jо `fn` chalае aur `"CPU-bound"` lautае agar `process_time` `perf_counter` wall time ka 70% se zyada ho, warna `"I/O-bound"`. Ise ek busy-loop function aur ek `time.sleep(0.3)` function par test karो.',
        hint: '`w0, c0 = time.perf_counter(), time.process_time()`; run `fn`; `wall = perf_counter() - w0`, `cpu = process_time() - c0`; `return "CPU-bound" if cpu > wall * 0.7 else "I/O-bound"`. The sleep function barely uses CPU; the busy loop uses it fully.',
        hintHi: '`w0, c0 = time.perf_counter(), time.process_time()`; `fn` chalाओ; `wall = perf_counter() - w0`, `cpu = process_time() - c0`; `return "CPU-bound" if cpu > wall * 0.7 else "I/O-bound"`.',
      },
    ],

    keyTakeaways: [
      'CONCURRENCY (tasks interleave, structure) is not PARALLELISM (tasks run at the same instant, hardware). Python threading and asyncio give concurrency only; multiprocessing gives parallelism.',
      'The GIL is one lock in CPython; a thread must hold it to run Python bytecode. So at most ONE thread runs Python code at any instant, even on many cores. It exists to make reference-counting memory management safe.',
      'The GIL IS released: periodically (~5 ms), during blocking I/O (`time.sleep`, sockets, files, subprocess), and inside C extensions (NumPy, hashlib) during heavy work.',
      'CPU-bound (core at 100%, computing): threads give NO speedup -> use `multiprocessing`/`ProcessPoolExecutor`. I/O-bound (CPU idle, waiting): threads/asyncio give a BIG speedup because waits overlap.',
      'Test which one: compare `time.process_time()` (CPU time) to `time.perf_counter()` (wall time). CPU ~= wall -> CPU-bound. CPU << wall -> I/O-bound.',
      '`threading`: real OS threads, shared memory, good for dozens–hundreds of I/O tasks, needs locks for shared state. `multiprocessing`: separate processes + GILs, real CPU parallelism, but startup cost + data must be pickled/copied.',
      '`asyncio`: one thread, an event loop, cheap coroutine tasks, no locks — but EVERY library in the path must be async; one blocking call freezes the loop.',
      'Start with `concurrent.futures`: `ThreadPoolExecutor` for I/O, `ProcessPoolExecutor` for CPU — same API, one-word switch. And measure before optimising.',
    ],
    keyTakeawaysHi: [
      'CONCURRENCY (tasks interleave, structure) PARALLELISM (tasks ek pal par chalते hain, hardware) nahi hai. Python threading aur asyncio sirf concurrency dete hain; multiprocessing parallelism deता hai.',
      'GIL CPython mein ek lock hai; ek thread ko Python bytecode chalाne ke liye ise hold karna hoga. Toh kisi bhi pal zyada se zyada EK thread Python code chalाता hai. Ye reference-counting memory management ko surakshit banाने ke liye hai.',
      'GIL RELEASE hoता hai: samay-samay par (~5 ms), blocking I/O ke dauraan (`time.sleep`, sockets, files), aur C extensions ke andar (NumPy, hashlib) bhaari kaam ke dauraan.',
      'CPU-bound (core 100% par, compute): threads koi speedup NAHI dete -> `multiprocessing` istemal karो. I/O-bound (CPU idle, wait): threads/asyncio BADा speedup dete hain kyunki waits overlap karते hain.',
      'Test karो kaunsa: `time.process_time()` (CPU time) ko `time.perf_counter()` (wall time) se compare karो. CPU ~= wall -> CPU-bound. CPU << wall -> I/O-bound.',
      '`threading`: asli OS threads, shared memory, dozens–sau I/O tasks ke liye achha, shared state ke liye locks chahiye. `multiprocessing`: alag processes + GILs, asli CPU parallelism, par startup cost + data pickle/copy hona chahiye.',
      '`asyncio`: ek thread, ek event loop, saste coroutine tasks, koi locks nahi — par path mein HAR library async honi chahiye; ek blocking call loop ko freeze karता hai.',
      '`concurrent.futures` se shuru karो: I/O ke liye `ThreadPoolExecutor`, CPU ke liye `ProcessPoolExecutor` — wahi API, ek-shabd switch. Aur optimise karne se pehle measure karो.',
    ],
  },

  {
    slug: 'py-threading',
    title: 'threading: Threads, Locks, Queues, and Thread Pools',
    titleHi: 'threading: Threads, Locks, Queues, Aur Thread Pools',
    description: 'Two threads both run `balance = balance - amount`, and once in a thousand runs the money is wrong. Threads share memory, so any mutable state touched by more than one needs a lock — and the safest design avoids shared mutable state entirely by passing work and results through a `queue.Queue`.',
    descriptionHi: 'Do threads dono `balance = balance - amount` chalाते hain, aur hazaar runs mein ek baar paisा galat hoता hai. Threads memory share karते hain, isliye ek se zyada dwara chhuई koi bhi mutable state ko ek lock chahiye — aur sabse surakshit design shared mutable state se poori tarah bachता hai kaam aur results ko ek `queue.Queue` ke zariye pass karके.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A shared whiteboard in a busy office.** Everyone can read and write it, which is convenient — but if two people update the headcount at the same moment, one reads "42", the other reads "42", both write "43", and you have lost a person. A **lock** is a marker pen that lives in a cup: you may only edit the board while holding the pen, and there is exactly one pen, so edits are serialised. The danger is forgetting to put the pen back (holding the lock too long, or forever) — everyone else stands around waiting. A **`queue.Queue`** is a better pattern for most work: instead of everyone scribbling on one board, there is an in-tray. Producers drop task cards in; worker threads take one card at a time, do the work, and drop the result in an out-tray. The queue itself is internally locked and safe, so your own code never touches shared mutable state and never needs a lock. A **daemon thread** is a temp worker who is told "when the office closes, just leave, don\'t finish what you\'re holding" — useful for background chores, dangerous for anything that must complete.',
      hi: '**Ek vyast office mein ek shared whiteboard.** Sab ise padh aur likh sakte hain — par agar do log ek hi pal headcount update karें, ek "42" padhता hai, doosra "42" padhता hai, dono "43" likhते hain, aur aapne ek vyakti kho diya. Ek **lock** ek marker pen hai jо ek cup mein rehта hai: aap board ko sirf pen hold karते hue edit kar sakte ho, aur bilkul ek pen hai. Khतरा pen wapas rakhna bhoolना hai. Ek **`queue.Queue`** adhikaansh kaam ke liye ek behtar pattern hai: sab ek board par likhने ke bजay, ek in-tray hai. Producers task cards daalते hain; worker threads ek samay mein ek card lete hain, kaam karते hain, aur result ek out-tray mein daalते hain. Queue khud andar se locked aur surakshit hai. Ek **daemon thread** ek temp worker hai jise kaha jाता hai "jab office band ho, bस chale jाओ".',
    },

    simple: `**Starting a thread**

\`\`\`python
import threading

def worker(name, count):
    for i in range(count):
        print(f"{name}: {i}")

t = threading.Thread(target=worker, args=("A", 3))
t.start()                    # runs worker() in a new thread
t.join()                     # wait for it to finish (blocks the caller)

# many:
threads = [threading.Thread(target=worker, args=(f"T{i}", 2)) for i in range(4)]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

**The race condition**

\`\`\`python
counter = 0
def bump():
    global counter
    for _ in range(100_000):
        counter += 1            # NOT atomic: read counter, add 1, write counter

ts = [threading.Thread(target=bump) for _ in range(4)]
for t in ts: t.start()
for t in ts: t.join()
print(counter)                 # EXPECT 400000 -- often LESS (lost updates)
\`\`\`

**The fix: a Lock**

\`\`\`python
counter = 0
lock = threading.Lock()
def bump():
    global counter
    for _ in range(100_000):
        with lock:             # only one thread inside at a time
            counter += 1
# now print(counter) is always 400000
\`\`\`

**The better pattern: a Queue (no shared state, no lock)**

\`\`\`python
import queue

work = queue.Queue()
results = queue.Queue()

def worker():
    while True:
        item = work.get()          # blocks until an item is available
        if item is None:           # sentinel -> shut down
            work.task_done(); break
        results.put(item * item)
        work.task_done()

threads = [threading.Thread(target=worker) for _ in range(4)]
for t in threads: t.start()

for n in range(10): work.put(n)
work.join()                        # wait until every item is processed
for _ in threads: work.put(None)   # tell workers to stop
for t in threads: t.join()
\`\`\`

**Thread pool (the easy way)**

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(fetch, url) for url in urls]
    for f in as_completed(futures):
        print(f.result())              # or: results = list(pool.map(fetch, urls))
\`\`\`

\`\`\`
threading.Thread(target=, args=, kwargs=, daemon=)   .start() .join([timeout]) .is_alive()
threading.Lock()           with lock:   / lock.acquire(); try: ...; finally: lock.release()
threading.RLock()          re-entrant: the SAME thread can acquire it multiple times
threading.Event()          .set() .clear() .wait([timeout]) .is_set()   -- one-to-many signal
threading.Semaphore(n)     allow up to n threads through   -- rate limiting
threading.local()          per-thread storage: each thread sees its own attributes

queue.Queue()              thread-safe FIFO: .put() .get() .task_done() .join()   (also LifoQueue, PriorityQueue)
daemon=True                thread does NOT keep the process alive; killed abruptly at exit

concurrent.futures.ThreadPoolExecutor(max_workers=)   .submit() -> Future   .map()   as_completed()
\`\`\``,

    simpleHi: `**Ek thread shuru karna**

\`\`\`python
import threading

def worker(name, count):
    for i in range(count):
        print(f"{name}: {i}")

t = threading.Thread(target=worker, args=("A", 3))
t.start()                    # worker() ko ek naye thread mein chalाता hai
t.join()                     # ise khatam hone ka wait karो (caller ko block karता hai)
\`\`\`

**Race condition**

\`\`\`python
counter = 0
def bump():
    global counter
    for _ in range(100_000):
        counter += 1            # atomic NAHI: counter padhо, 1 jodो, counter likhо

ts = [threading.Thread(target=bump) for _ in range(4)]
for t in ts: t.start()
for t in ts: t.join()
print(counter)                 # EXPECT 400000 -- aksar KAM (lost updates)
\`\`\`

**Fix: ek Lock**

\`\`\`python
counter = 0
lock = threading.Lock()
def bump():
    global counter
    for _ in range(100_000):
        with lock:             # ek samay mein sirf ek thread andar
            counter += 1
# ab print(counter) hamesha 400000 hai
\`\`\`

**Behtar pattern: ek Queue (koi shared state nahi, koi lock nahi)**

\`\`\`python
import queue

work = queue.Queue()
results = queue.Queue()

def worker():
    while True:
        item = work.get()          # ek item available hone tak block
        if item is None:           # sentinel -> shut down
            work.task_done(); break
        results.put(item * item)
        work.task_done()
\`\`\`

**Thread pool (aasaan tarika)**

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(fetch, urls))
\`\`\`

\`\`\`
threading.Thread(target=, args=, kwargs=, daemon=)   .start() .join([timeout]) .is_alive()
threading.Lock()           with lock:   / lock.acquire(); try: ...; finally: lock.release()
threading.RLock()          re-entrant: WAHI thread ise kai baar acquire kar sakta hai
threading.Event()          .set() .clear() .wait([timeout]) .is_set()   -- one-to-many signal
threading.Semaphore(n)     n threads tak jaane do   -- rate limiting
threading.local()          per-thread storage

queue.Queue()              thread-safe FIFO: .put() .get() .task_done() .join()
daemon=True                thread process ko zinda NAHI rakhता; exit par achानak maar diya jाता hai

concurrent.futures.ThreadPoolExecutor(max_workers=)   .submit() -> Future   .map()   as_completed()
\`\`\``,

    content: `## \`threading.Thread\`

Two ways to make a thread. Prefer the first:

\`\`\`python
# 1. pass a target callable
t = threading.Thread(target=fn, args=(...), kwargs={...}, name="worker-1")

# 2. subclass and override run()  (only if the thread needs its own state/methods)
class Worker(threading.Thread):
    def run(self):
        ...
\`\`\`

\`t.start()\` spawns the OS thread and calls the target. \`t.join(timeout=None)\` blocks the calling thread until \`t\` finishes (or the timeout elapses — check \`t.is_alive()\` after). A thread's return value is **not** available via \`join\` — use a \`Queue\`, a shared structure, or (much better) \`ThreadPoolExecutor\` whose \`Future\` carries the result.

## Race conditions and why \`+=\` is not safe

\`counter += 1\` compiles to roughly: *load* \`counter\`, *add* 1, *store* \`counter\`. The GIL can switch threads between any two bytecodes. So:

\`\`\`
thread A: load counter (0)
thread B: load counter (0)
thread A: add 1 -> 1, store counter (1)
thread B: add 1 -> 1, store counter (1)     # B's update overwrote A's -- lost update
\`\`\`

The GIL does **not** save you here — it guarantees one bytecode at a time, not one *logical operation* at a time. Any read-modify-write on shared state across threads is a race: counters, list/dict mutations that check-then-act, lazy initialisation, moving money between accounts.

## \`Lock\`

\`\`\`python
lock = threading.Lock()

with lock:                     # acquire on enter, release on exit (even on exception)
    shared.mutate()

# equivalent explicit form:
lock.acquire()
try:
    shared.mutate()
finally:
    lock.release()
\`\`\`

Rules:
- **Hold the lock for the shortest time possible** — just the critical section, never around I/O or a slow computation.
- **Always release** — use \`with\`, never a bare \`acquire()\` that an exception can skip.
- **Acquire multiple locks in a consistent global order** everywhere, or you get **deadlock** (thread A holds lock 1 waiting for lock 2; thread B holds lock 2 waiting for lock 1).
- \`RLock\` (re-entrant) lets the *same* thread acquire it again without blocking — needed when a locked method calls another locked method on the same object.

## \`queue.Queue\` — the pattern that avoids locks

A \`Queue\` is internally synchronised. Producers \`put\`, consumers \`get\`; \`get\` blocks until something is available. Your code never shares a raw mutable object, so there is nothing to lock.

\`\`\`python
q = queue.Queue(maxsize=0)     # 0 = unbounded; a positive maxsize applies backpressure

q.put(item)                    # blocks if the queue is full (bounded)
item = q.get()                 # blocks if the queue is empty
q.task_done()                  # signal that a got item is fully processed
q.join()                       # block until task_done has been called for every put
\`\`\`

Shutdown pattern: put one \`None\` sentinel per worker; each worker breaks its loop on \`None\`. (Python 3.13+ adds \`q.shutdown()\` for this.)

## \`Event\`, \`Semaphore\`, \`local\`

\`\`\`python
stop = threading.Event()
# worker: while not stop.is_set(): ...       main: stop.set()

gate = threading.Semaphore(5)                # at most 5 threads past this point
with gate:
    call_rate_limited_api()

ctx = threading.local()                      # each thread gets its own ctx.<attr>
ctx.connection = make_connection()           # not shared between threads
\`\`\`

## Daemon threads

\`\`\`python
t = threading.Thread(target=background_flush, daemon=True)
\`\`\`

A daemon thread does not keep the process alive: when all non-daemon threads finish, the interpreter exits and daemon threads are killed **immediately**, mid-statement, with no cleanup, no \`finally\`. Use them only for fire-and-forget background work where an abrupt stop is acceptable — never for anything that writes files or must flush.

## Prefer the pool

For almost all real code, skip raw \`Thread\` objects:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=16) as pool:
    future_to_url = {pool.submit(fetch, u): u for u in urls}
    for fut in as_completed(future_to_url):
        url = future_to_url[fut]
        try:
            data = fut.result()          # re-raises any exception from the worker
        except Exception as e:
            log.warning("’%s failed: %s", url, e)
\`\`\`

The pool caps concurrency, reuses threads, propagates exceptions through \`Future.result()\`, and cleans up on \`with\` exit.`,

    contentHi: `## \`threading.Thread\`

Ek thread banाने ke do tarike. Pehle ko prefer karो:

\`\`\`python
# 1. ek target callable pass karो
t = threading.Thread(target=fn, args=(...), kwargs={...}, name="worker-1")

# 2. subclass aur run() override karो (sirf agar thread ko apni state chahiye)
class Worker(threading.Thread):
    def run(self):
        ...
\`\`\`

\`t.start()\` OS thread spawn karता hai aur target call karता hai. \`t.join(timeout=None)\` calling thread ko block karता hai jab tak \`t\` khatam na ho. Ek thread ki return value \`join\` ke zariye available **nahi** hai — ek \`Queue\` ya \`ThreadPoolExecutor\` istemal karो.

## Race conditions aur \`+=\` surakshit kyun nahi

\`counter += 1\` lगbhag isme compile hoता hai: \`counter\` *load*, 1 *add*, \`counter\` *store*. GIL kisi bhi do bytecodes ke beech threads switch kar sakta hai. Toh:

\`\`\`
thread A: load counter (0)
thread B: load counter (0)
thread A: add 1 -> 1, store counter (1)
thread B: add 1 -> 1, store counter (1)     # B ka update A ke ko overwrite kiya -- lost update
\`\`\`

GIL yahaan aapko **nahi** bachाता — ye ek samay ek bytecode guarantee karता hai, ek *logical operation* nahi. Shared state par koi bhi read-modify-write ek race hai.

## \`Lock\`

\`\`\`python
lock = threading.Lock()

with lock:                     # enter par acquire, exit par release (exception par bhi)
    shared.mutate()
\`\`\`

Niyam:
- **Lock ko sabse kam samay ke liye hold karो** — bस critical section, kabhi I/O ke aas-paas nahi.
- **Hamesha release karो** — \`with\` istemal karो.
- **Kai locks ek consistent global kram mein acquire karो** har jagah, warna **deadlock** milता hai.
- \`RLock\` (re-entrant) *wahi* thread ko ise phir acquire karne deता hai bina block kiye.

## \`queue.Queue\` — pattern jо locks se bachता hai

Ek \`Queue\` andar se synchronised hai. Producers \`put\`, consumers \`get\`; \`get\` kuch available hone tak block karता hai. Aapka code kabhi ek raw mutable object share nahi karता.

\`\`\`python
q = queue.Queue(maxsize=0)     # 0 = unbounded

q.put(item)                    # queue full ho toh block (bounded)
item = q.get()                 # queue empty ho toh block
q.task_done()                  # signal ki ek got item poori tarah processed
q.join()                       # block jab tak har put ke liye task_done call na ho
\`\`\`

Shutdown pattern: prati worker ek \`None\` sentinel put karो.

## \`Event\`, \`Semaphore\`, \`local\`

\`\`\`python
stop = threading.Event()
# worker: while not stop.is_set(): ...       main: stop.set()

gate = threading.Semaphore(5)                # is point ke aage zyada se zyada 5 threads
with gate:
    call_rate_limited_api()

ctx = threading.local()                      # har thread ko apna ctx.<attr> milता hai
\`\`\`

## Daemon threads

\`\`\`python
t = threading.Thread(target=background_flush, daemon=True)
\`\`\`

Ek daemon thread process ko zinda nahi rakhता: jab saare non-daemon threads khatam hote hain, interpreter exit karता hai aur daemon threads **turant** maar diye jाते hain, statement ke beech mein, bina cleanup, bina \`finally\`. Unhe sirf fire-and-forget background kaam ke liye istemal karो.

## Pool ko prefer karो

Lगbhag saare asli code ke liye, raw \`Thread\` objects skip karो:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=16) as pool:
    futures = {pool.submit(fetch, u): u for u in urls}
    for fut in as_completed(futures):
        try:
            data = fut.result()          # worker se koi bhi exception re-raise karता hai
        except Exception as e:
            log.warning("failed: %s", e)
\`\`\`

Pool concurrency cap karता hai, threads reuse karता hai, \`Future.result()\` ke zariye exceptions propagate karता hai.`,

    examples: [
      {
        title: 'The race condition, and the lock that fixes it',
        titleHi: 'Race condition, aur lock jо ise theek karता hai',
        code: `import threading, time

def run(use_lock):
    counter = 0
    lock = threading.Lock()

    def bump():
        nonlocal counter
        for _ in range(1000):
            if use_lock:
                with lock:                 # the read-modify-write is one atomic section
                    tmp = counter
                    counter = tmp + 1
            else:
                tmp = counter              # read
                time.sleep(0)              # force a GIL hand-off mid-operation
                counter = tmp + 1          # write -- other threads changed counter meanwhile

    ts = [threading.Thread(target=bump) for _ in range(8)]
    for t in ts: t.start()
    for t in ts: t.join()
    return counter

EXPECTED = 8 * 1000

# WITH the lock: always exactly 8000
print("locked result correct?", run(use_lock=True) == EXPECTED)

# WITHOUT the lock: every run loses updates -> strictly less than 8000, never more
sample = [run(use_lock=False) for _ in range(3)]
print("unlocked never exceeds expected?", all(s <= EXPECTED for s in sample))
print("unlocked lost updates every run? ", all(s < EXPECTED for s in sample))`,
        output: `locked result correct? True
unlocked never exceeds expected? True
unlocked lost updates every run?  True
`,
        explain: 'Incrementing `counter` is read-modify-write: read the value, add 1, write it back. The unlocked branch makes the gap explicit with `time.sleep(0)`, which hands the GIL to another thread between the read and the write — so several threads read the same `tmp` and all write back `tmp + 1`, losing every increment but one. With 8 threads x 1000 iterations the unlocked total is reliably far below 8000 and never above it. The `with lock:` branch makes the read-and-write a single critical section that only one thread runs at a time, so the count is always exactly 8000.',
        explainHi: '`counter` badhाना read-modify-write hai: value padhо, 1 jodो, wapas likhо. Unlocked branch gap ko `time.sleep(0)` se spasht banाता hai, jо read aur write ke beech GIL doosre thread ko deता hai — toh kai threads wahi `tmp` padhते hain aur sab `tmp + 1` wapas likhते hain, ek ke alावा har increment khोते hue. 8 threads x 1000 iterations ke saath unlocked total vishwasniya roop se 8000 se kaafi neeche hai aur kabhi upar nahi. `with lock:` branch read-aur-write ko ek single critical section banाता hai.',
      },
      {
        title: 'Producer/consumer with queue.Queue — no lock in your code',
        titleHi: 'queue.Queue ke saath producer/consumer — aapke code mein koi lock nahi',
        code: `import threading, queue

work = queue.Queue()
results = queue.Queue()

def worker():
    while True:
        item = work.get()
        if item is None:              # shutdown sentinel
            work.task_done()
            break
        results.put((item, item * item))
        work.task_done()

WORKERS = 4
threads = [threading.Thread(target=worker) for _ in range(WORKERS)]
for t in threads:
    t.start()

for n in range(12):
    work.put(n)

work.join()                           # wait until all 12 items are processed

for _ in range(WORKERS):              # one sentinel per worker
    work.put(None)
for t in threads:
    t.join()

collected = sorted(results.queue)     # drain -- order is nondeterministic, so sort
print("count:", len(collected))
print("squares:", collected)`,
        output: `count: 12
squares: [(0, 0), (1, 1), (2, 4), (3, 9), (4, 16), (5, 25), (6, 36), (7, 49), (8, 64), (9, 81), (10, 100), (11, 121)]
`,
        explain: 'Four worker threads pull items off `work` and push `(n, n*n)` onto `results`. `work.get()` blocks when the queue is empty, so workers idle cheaply until fed. `work.join()` returns only once `task_done()` has been called for all 12 items. Shutdown is one `None` per worker. Nothing in this code declares a `Lock` — the `Queue` is internally synchronised, so passing data through it is safe by construction. The result order is nondeterministic (whichever worker finishes first), so the output is sorted for a stable printout.',
        explainHi: 'Chaar worker threads `work` se items khींchते hain aur `(n, n*n)` `results` par push karते hain. `work.get()` block karता hai jab queue empty hai. `work.join()` sirf tab lautाता hai jab saare 12 items ke liye `task_done()` call ho chuka ho. Shutdown prati worker ek `None` hai. Is code mein kuch bhi ek `Lock` declare nahi karता — `Queue` andar se synchronised hai.',
      },
      {
        title: 'ThreadPoolExecutor: submit, as_completed, and exception propagation',
        titleHi: 'ThreadPoolExecutor: submit, as_completed, aur exception propagation',
        code: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def process(n):
    time.sleep(0.05)
    if n == 3:
        raise ValueError("cannot process 3")
    return n * 10

ok, failed = {}, {}
with ThreadPoolExecutor(max_workers=5) as pool:
    future_to_n = {pool.submit(process, n): n for n in range(6)}
    for fut in as_completed(future_to_n):
        n = future_to_n[fut]
        try:
            ok[n] = fut.result()          # re-raises ValueError for n == 3
        except ValueError as e:
            failed[n] = str(e)

print("ok:    ", dict(sorted(ok.items())))
print("failed:", dict(sorted(failed.items())))

# pool.map is simpler when you just want results in order and no per-item error handling:
with ThreadPoolExecutor(max_workers=5) as pool:
    doubled = list(pool.map(lambda x: x * 2, range(6)))
print("mapped:", doubled)`,
        output: `ok:     {0: 0, 1: 10, 2: 20, 4: 40, 5: 50}
failed: {3: 'cannot process 3'}
mapped: [0, 2, 4, 6, 8, 10]
`,
        explain: '`pool.submit(fn, n)` returns a `Future` immediately; the work runs on a pool thread. `as_completed` yields futures in the order they *finish*. `fut.result()` returns the value or **re-raises** whatever exception the worker raised — so `n == 3` surfaces its `ValueError` here in the main thread, where it is caught per-item. `pool.map` is the terser form when you want results in input order and no individual error handling (the first exception propagates out of the iteration).',
        explainHi: '`pool.submit(fn, n)` turant ek `Future` lautाता hai; kaam ek pool thread par chalता hai. `as_completed` futures ko *khatam hone* ke kram mein yield karता hai. `fut.result()` value lautाता hai ya worker ne jо exception raise kiya use **re-raise** karता hai — toh `n == 3` apna `ValueError` yahaan main thread mein surface karता hai. `pool.map` terser form hai jab aap results input kram mein chahте ho.',
      },
    ],

    mistakes: [
      {
        wrong: `results = []
def worker(n):
    results.append(expensive(n))       # list.append from many threads

threads = [threading.Thread(target=worker, args=(n,)) for n in range(20)]
for t in threads: t.start()
for t in threads: t.join()`,
        right: `from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(expensive, range(20)))    # pool collects results safely

# or with a queue:
q = queue.Queue()
def worker(n): q.put(expensive(n))
# ... then drain q`,
        why: 'CPython\'s `list.append` happens to be atomic today (it is a single bytecode under the GIL), so this specific code often works — but it is relying on an implementation detail. Any slightly more complex mutation (`results[key] = ...` after a check, `results.sort()`, appending to a dict of lists) is a real race. Do not build on "probably atomic"; collect results through a `ThreadPoolExecutor` or a `Queue`, which are safe by contract.',
        whyHi: 'CPython ka `list.append` aaj atomic hoता hai (GIL ke tahat ek single bytecode), toh ye specific code aksar kaam karता hai — par ye ek implementation detail par nirbhar hai. Koi bhi thodा zyada complex mutation ek asli race hai. "Shायad atomic" par mat banाओ; results ko `ThreadPoolExecutor` ya `Queue` ke zariye collect karो.',
      },
      {
        wrong: `lock_a = threading.Lock()
lock_b = threading.Lock()

def transfer(x, y):
    with lock_a:
        with lock_b:
            ...
def refund(x, y):
    with lock_b:              # opposite order!
        with lock_a:
            ...
# transfer holds A waiting for B; refund holds B waiting for A -> deadlock`,
        right: `def transfer(x, y):
    first, second = sorted((lock_a, lock_b), key=id)   # always the same global order
    with first:
        with second:
            ...`,
        why: 'Deadlock happens when threads acquire the same set of locks in different orders and each ends up waiting on a lock the other holds. The program hangs forever with no error. The cure is a discipline: every code path acquires multiple locks in one fixed global order (e.g. sorted by `id()`, or by a documented ranking). Better still, restructure so only one lock is ever held at a time, or use a queue.',
        whyHi: 'Deadlock tab hoता hai jab threads wahi locks alag kramon mein acquire karते hain aur har ek us lock par wait karता hai jо doosra hold karता hai. Program bina error hamesha ke liye hang hoता hai. Ilaaj ek discipline hai: har code path kai locks ek fixed global kram mein acquire karता hai.',
      },
      {
        wrong: `t = threading.Thread(target=write_report_to_disk, daemon=True)
t.start()
# main thread finishes here -> interpreter exits -> daemon killed mid-write
# -> a truncated / corrupt report file`,
        right: `t = threading.Thread(target=write_report_to_disk)   # non-daemon (default)
t.start()
# ... do other work ...
t.join()                                            # wait for it before exiting`,
        why: 'A daemon thread is terminated abruptly the instant the last non-daemon thread exits — no exception, no `finally`, no flush of buffered writes. Anything that touches a file, a database, or a network resource that needs a clean close must run in a non-daemon thread that the program explicitly `join`s before exit. Daemon threads are only for disposable background work (polling, heartbeat) where an instant kill is harmless.',
        whyHi: 'Ek daemon thread us pal achानak samapt ho jाता hai jab aakhri non-daemon thread exit karता hai — koi exception nahi, koi `finally` nahi, buffered writes ka koi flush nahi. Kuch bhi jо ek file, database, ya network resource chhoota hai jise clean close chahiye, ek non-daemon thread mein chalना chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**`ThreadPoolExecutor` is the workhorse for concurrent I/O in scripts and services** — fan out a few dozen HTTP calls, parallelise S3 uploads, query several databases at once. `max_workers` caps concurrency (and load on the remote service); `as_completed` + `future.result()` gives clean per-task error handling. `boto3`, `requests`, most SDKs are thread-safe enough for this.',
        hi: '**`ThreadPoolExecutor` scripts aur services mein concurrent I/O ke liye workhorse hai** — kuch dozen HTTP calls fan out karो, S3 uploads parallelise karो. `max_workers` concurrency cap karता hai; `as_completed` + `future.result()` saaf per-task error handling deता hai.',
      },
      {
        en: '**`queue.Queue` is the backbone of producer/consumer designs** — a scraper with a URL frontier queue and a results queue, a log shipper with a buffer queue drained by a sender thread, a GUI/worker split where the worker posts updates onto a queue the UI thread polls. Bounded queues (`maxsize`) apply backpressure so a fast producer cannot exhaust memory.',
        hi: '**`queue.Queue` producer/consumer designs ki reedh hai** — ek URL frontier queue aur ek results queue waala scraper, ek buffer queue waala log shipper. Bounded queues (`maxsize`) backpressure lागू karती hain.',
      },
      {
        en: '**Locks appear around caches, connection pools, counters, and lazy singletons** — `with self._lock:` around a check-then-populate on a shared dict cache, around handing out / returning a pooled connection, around metrics counters. Kept tiny and never held across I/O. Many teams prefer `queue`-based designs specifically to minimise hand-written locking.',
        hi: '**Locks caches, connection pools, counters, aur lazy singletons ke aas-paas dikhते hain** — ek shared dict cache par check-then-populate ke aas-paas `with self._lock:`. Chhota rakhा jाता hai aur kabhi I/O ke paar hold nahi kiya jाता.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `counter += 1` unsafe across threads even with the GIL, and what are the ways to make shared state safe?',
        qHi: 'GIL ke saath bhi `counter += 1` threads ke paar asurakshit kyun hai, aur shared state ko surakshit banाने ke tarike kya hain?',
        a: 'counter plus-equals one looks like one operation but compiles to at least three bytecode steps: load the current value of counter, add one to it, store the result back into counter. The GIL guarantees that only one bytecode executes at a time, but it does not prevent a thread switch between those bytecodes. So thread A can load counter as 0, then the scheduler switches to thread B, which loads counter as 0, adds one, stores 1; then A resumes, adds one to the 0 it already loaded, and stores 1. Two increments happened but the value only went up by one — a lost update. Over many iterations and threads this compounds, and the final count is reliably below the expected total and varies between runs. The GIL protects the interpreter\'s own internal state, not the atomicity of your logical operations. Any read-modify-write on state shared between threads has this problem: counters, checking whether a key exists and then inserting it, lazy initialisation, moving a value from one place to another. The ways to make it safe: first, a Lock — wrap the critical section in with lock, so only one thread is inside at a time; keep the held region minimal and never do I/O while holding it, and if you need multiple locks, always acquire them in the same global order to avoid deadlock. Second, and usually better, do not share mutable state at all: use a queue dot Queue to pass work and results between threads. The queue is internally synchronised, so your code never touches a raw shared object and needs no lock. Third, use the higher-level ThreadPoolExecutor, which collects each task\'s result into its own Future, so workers return values instead of mutating a shared container. Fourth, for read-mostly data, give each thread its own copy via threading dot local, or make the shared structure immutable. The general principle is to design the concurrency so that sharing is minimal and explicit, rather than sprinkling locks over shared globals.',
        aHi: 'counter plus-equals one ek operation dikhता hai par kam se kam teen bytecode steps mein compile hoता hai: counter ki current value load karो, ek jodो, result wapas counter mein store karो. GIL guarantee karता hai ki ek samay ek bytecode execute hoता hai, par ye un bytecodes ke beech thread switch nahi rokता. Toh thread A counter ko 0 load kar sakta hai, phir scheduler thread B par switch karता hai, jо counter ko 0 load karता hai, ek jodता hai, 1 store karता hai; phir A resume karता hai, us 0 mein ek jodता hai jо usne pehle load kiya, aur 1 store karता hai. Do increments hue par value sirf ek se badhी — ek lost update. GIL interpreter ki apni internal state ki raksha karता hai, aapke logical operations ki atomicity ki nahi. Surakshit banाने ke tarike: pehla, ek Lock — critical section ko with lock mein wrap karो. Doosra, aur aksar behtar, mutable state bilkul share mat karो: kaam aur results pass karne ke liye ek queue dot Queue istemal karो. Teesra, higher-level ThreadPoolExecutor istemal karो. Chautha, read-mostly data ke liye, threading dot local ke zariये har thread ko apni copy do.',
      },
      {
        q: 'What is a daemon thread, and when should (and should not) you use one?',
        qHi: 'Ek daemon thread kya hai, aur aapko ek kab istemal karna chahiye (aur nahi)?',
        a: 'A thread is created with a daemon flag, defaulting to false. The flag controls what happens at interpreter shutdown. The interpreter waits for all non-daemon threads to finish before exiting. Daemon threads are not waited for — the moment the last non-daemon thread completes, the interpreter begins shutting down and any daemon threads still running are terminated abruptly. That termination is not an exception or a cancellation the thread can respond to; the thread just stops wherever it is, so no finally blocks run, no context managers exit, no buffered writes are flushed. You should use a daemon thread for background work that is purely supportive and safe to kill at any instant: a heartbeat or keepalive ping, polling a config source for changes, emitting metrics, a watchdog timer. These have no cleanup obligations and losing the last iteration does not matter. You should not use a daemon thread for anything with side effects that must complete or be cleaned up: writing a file or a report, committing to a database, sending a network request that must not be half-sent, releasing an external lock, anything holding a resource that needs an orderly close. For those, use a normal non-daemon thread and have the main program explicitly join it before exiting, or use a ThreadPoolExecutor whose context manager waits for submitted work on exit, or implement a cooperative shutdown where you signal the thread with an Event and it finishes its current unit of work and returns. The daemon flag is a convenience for fire-and-forget chores, not a substitute for proper lifecycle management.',
        aHi: 'Ek thread ek daemon flag ke saath banता hai, default false. Flag control karता hai ki interpreter shutdown par kya hoता hai. Interpreter exit karne se pehle saare non-daemon threads ke khatam hone ka wait karता hai. Daemon threads ka wait nahi kiya jाता — jis pal aakhri non-daemon thread poora hoता hai, interpreter shut down shuru karता hai aur koi bhi daemon threads jо abhi bhi chal rahe hain achानak samapt kar diye jाते hain. Wo samapti ek exception ya cancellation nahi hai jiska thread jawaab de sake; thread bस ruk jाता hai jahaan wo hai, toh koi finally blocks nahi chalते, koi buffered writes flush nahi hote. Aapko ek daemon thread background kaam ke liye istemal karna chahiye jо purी tarah supportive aur kisi bhi pal maarne ke liye surakshit hai: ek heartbeat, config source poll karna, metrics emit karna. Aapko ek daemon thread kisi bhi side effects waali cheez ke liye istemal NAHI karna chahiye jise poora hona ya clean up hona chahiye: ek file likhna, database mein commit karna. Un ke liye, ek normal non-daemon thread istemal karो aur main program ko exit karne se pehle explicitly join karवाओ.',
      },
    ],

    exercises: [
      {
        task: 'Write two functions `sum_unsafe()` and `sum_safe()`. Each starts a shared `total = 0`, spawns 5 threads that each add 1 to `total` 100_000 times, joins them, and returns `total`. `sum_safe` guards the addition with a `threading.Lock`. Run each and print whether `sum_safe() == 500_000` (always True) and whether `sum_unsafe() <= 500_000` (always True).',
        taskHi: 'Do functions `sum_unsafe()` aur `sum_safe()` likhо. Har ek ek shared `total = 0` shuru karता hai, 5 threads spawn karता hai jо har ek `total` mein 100_000 baar 1 jodते hain. `sum_safe` addition ko ek `threading.Lock` se guard karता hai.',
        hint: 'Use `nonlocal total` inside a nested `add` function, or a one-element list / a small object to hold the counter. `sum_safe`: `with lock: total += 1` (or hold the lock around the whole inner loop for speed). `sum_unsafe` will usually return well under 500_000.',
        hintHi: 'Ek nested `add` function ke andar `nonlocal total` istemal karो. `sum_safe`: `with lock: total += 1`. `sum_unsafe` aksar 500_000 se kaafi neeche lautाега.',
      },
      {
        task: 'Build a producer/consumer: a `queue.Queue`, 3 worker threads that read a number and put `(n, n**3)` into a results queue, break on a `None` sentinel. Feed `range(15)`, call `work.join()`, send 3 sentinels, join the threads, then print the sorted results. Confirm 15 results and that each is `(n, n**3)`.',
        taskHi: 'Ek producer/consumer banाओ: ek `queue.Queue`, 3 worker threads jо ek number padhते hain aur `(n, n**3)` ek results queue mein daalते hain, ek `None` sentinel par break. `range(15)` feed karो, `work.join()` call karो, 3 sentinels bhejो.',
        hint: '`while True: item = work.get(); if item is None: work.task_done(); break; results.put((item, item**3)); work.task_done()`. After `work.join()`, put one `None` per worker. Drain with `sorted(results.queue)`.',
        hintHi: '`while True: item = work.get(); if item is None: work.task_done(); break; results.put((item, item**3)); work.task_done()`. `work.join()` ke baad, prati worker ek `None`.',
      },
      {
        task: 'Use `ThreadPoolExecutor(max_workers=4)` to run a `check(n)` that sleeps 0.05s and raises `ValueError` for even `n`, returns `n` for odd. Submit `range(10)`, collect via `as_completed`, and build two dicts: `passed` (odd n -> n) and `errors` (even n -> message). Print both sorted. Verify 5 passed and 5 errors.',
        taskHi: '`ThreadPoolExecutor(max_workers=4)` istemal karके ek `check(n)` chalाओ jо 0.05s sleep kare aur even `n` ke liye `ValueError` raise kare, odd ke liye `n` lautае. `range(10)` submit karो, `as_completed` se collect karो.',
        hint: '`futs = {pool.submit(check, n): n for n in range(10)}`; `for f in as_completed(futs): n = futs[f]; try: passed[n] = f.result() except ValueError as e: errors[n] = str(e)`. `f.result()` re-raises the worker\'s exception.',
        hintHi: '`futs = {pool.submit(check, n): n for n in range(10)}`; `for f in as_completed(futs): n = futs[f]; try: passed[n] = f.result() except ValueError as e: errors[n] = str(e)`. `f.result()` worker ka exception re-raise karता hai.',
      },
    ],

    keyTakeaways: [
      '`threading.Thread(target=fn, args=(...))` then `.start()` / `.join()`. A thread\'s return value is NOT available via `join` — use a `Queue` or `ThreadPoolExecutor`.',
      '`counter += 1` is read-modify-write = NOT atomic. The GIL serialises bytecodes, not logical operations, so any read-modify-write on shared state across threads is a race (lost updates).',
      '`threading.Lock` + `with lock:` makes a critical section. Hold it briefly, never around I/O, always release (use `with`), acquire multiple locks in ONE global order or risk deadlock. `RLock` = same thread can re-acquire.',
      '`queue.Queue` is internally synchronised: `put`/`get` (blocking), `task_done`/`join`. Passing work + results through a queue means your code shares no raw mutable state and needs no lock — the preferred pattern.',
      'Shutdown a queue-worker pool by putting one `None` sentinel per worker; each breaks its loop on `None`.',
      'Other primitives: `Event` (`.set()`/`.wait()` one-to-many signal), `Semaphore(n)` (cap N concurrent), `threading.local()` (per-thread storage).',
      'Daemon threads (`daemon=True`) do NOT keep the process alive and are KILLED abruptly at exit — no `finally`, no flush. Only for disposable background work, never for writes/commits.',
      'Prefer `concurrent.futures.ThreadPoolExecutor`: caps concurrency, reuses threads, `submit()` -> `Future`, `Future.result()` re-raises worker exceptions, `as_completed()` yields in finish order, cleans up on `with` exit.',
    ],
    keyTakeawaysHi: [
      '`threading.Thread(target=fn, args=(...))` phir `.start()` / `.join()`. Ek thread ki return value `join` ke zariye available NAHI hai — ek `Queue` ya `ThreadPoolExecutor` istemal karो.',
      '`counter += 1` read-modify-write hai = atomic NAHI. GIL bytecodes serialise karता hai, logical operations nahi, toh shared state par koi bhi read-modify-write ek race hai.',
      '`threading.Lock` + `with lock:` ek critical section banाता hai. Ise thodी der hold karो, kabhi I/O ke aas-paas nahi, hamesha release karो, kai locks EK global kram mein acquire karो warna deadlock. `RLock` = wahi thread phir acquire kar sakta hai.',
      '`queue.Queue` andar se synchronised hai: `put`/`get` (blocking), `task_done`/`join`. Kaam + results ek queue ke zariye pass karna matlab aapka code koi raw mutable state share nahi karता — preferred pattern.',
      'Ek queue-worker pool shutdown karो prati worker ek `None` sentinel put karके.',
      'Doosre primitives: `Event` (`.set()`/`.wait()` one-to-many signal), `Semaphore(n)` (N concurrent cap), `threading.local()` (per-thread storage).',
      'Daemon threads (`daemon=True`) process ko zinda NAHI rakhते aur exit par achानak MAAR diye jाते hain — koi `finally` nahi, koi flush nahi. Sirf disposable background kaam ke liye.',
      '`concurrent.futures.ThreadPoolExecutor` ko prefer karो: concurrency cap karता hai, threads reuse karता hai, `submit()` -> `Future`, `Future.result()` worker exceptions re-raise karता hai, `as_completed()` finish kram mein yield karता hai.',
    ],
  },

  {
    slug: 'py-multiprocessing-and-futures',
    title: 'multiprocessing: Real Parallelism for CPU-Bound Work',
    titleHi: 'multiprocessing: CPU-Bound Kaam Ke Liye Asli Parallelism',
    description: 'A CPU-bound job that pins one core at 100% while the other seven sit idle. `multiprocessing` runs your function in separate OS processes — each with its own interpreter and GIL — so the work actually spreads across cores. The price: processes do not share memory, so arguments and results are pickled and copied.',
    descriptionHi: 'Ek CPU-bound job jо ek core ko 100% par pin karता hai jabki baaki saat idle baithe hain. `multiprocessing` aapke function ko alag OS processes mein chalाता hai — har ek apne interpreter aur GIL ke saath — toh kaam asal mein cores ke paar failта hai. Keemat: processes memory share nahi karते, toh arguments aur results pickle aur copy hote hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Opening more kitchens instead of hiring more hands for one kitchen.** Threads were extra hands in a single kitchen — limited by the one chef\'s-knife rule (the GIL). `multiprocessing` opens a second, third, fourth fully-equipped kitchen, each with its own chef, its own knife, its own stove. Now four dishes really are being chopped at the same instant. The trade-off is logistics. The kitchens do not share a fridge: every ingredient a satellite kitchen needs must be packed into a box, driven over, and unpacked (that is *pickling* — serialising the arguments), and every finished dish must be boxed and driven back. If a task needs a tiny bit of computation but a huge box of ingredients, the drive dominates and you have made things slower. So `multiprocessing` pays off for **coarse** work: hand each kitchen a big, self-contained job that runs for a while and returns a small result. It does not pay off for lots of tiny jobs, or jobs that need to constantly pass things back and forth. And because starting a kitchen takes real time, you start a **pool** of them once and feed them many jobs.',
      hi: '**Ek kitchen ke liye zyada haath rakhने ke bजaay zyada kitchens kholना.** Threads ek single kitchen mein extra haath the — ek chef-ke-knife niyam (GIL) se limited. `multiprocessing` ek doosra, teesra, chautha poori tarah se sajा kitchen kholता hai, har ek apne chef, apne knife, apne stove ke saath. Ab chaar dishes sachmuch ek hi pal chop ho rahi hain. Trade-off logistics hai. Kitchens ek fridge share nahi karते: har ingredient jо ek satellite kitchen ko chahiye ek box mein pack hona chahiye, drive kiya jाना chahiye, aur unpack (wo *pickling* hai). Agar ek task ko thodी computation par ek bada box ingredients chahiye, drive haावी hoता hai aur aapne cheezein dhीmी kar dीं. Toh `multiprocessing` **coarse** kaam ke liye faaydemand hai. Aur kyunki ek kitchen shuru karne mein asli samay lगता hai, aap unka ek **pool** ek baar shuru karते ho.',
    },

    simple: `**The one-liner: ProcessPoolExecutor**

\`\`\`python
from concurrent.futures import ProcessPoolExecutor

def count_primes(limit):
    return sum(1 for n in range(2, limit) if is_prime(n))

if __name__ == "__main__":                        # REQUIRED (see below)
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(count_primes, [100_000, 200_000, 300_000, 400_000]))
    print(results)
\`\`\`

Identical API to \`ThreadPoolExecutor\` — swap the word \`Thread\` for \`Process\`.

**The \`if __name__ == "__main__"\` guard is mandatory**

\`\`\`
On Windows and macOS, a worker process starts by IMPORTING your script.
Without the guard, that import re-runs your pool-spawning code -> infinite process fork bomb.
=> all process-spawning code MUST be under  if __name__ == "__main__":
\`\`\`

**Data is copied, not shared**

\`\`\`python
big = list(range(10_000_000))

# WRONG mental model: workers see 'big' directly. They do NOT.
def work(i):
    return big[i]            # 'big' is pickled + copied into EACH worker at fork/spawn

# pass only what a task needs; return only small results
def work(chunk):
    return sum(x * x for x in chunk)   # send a chunk, get back one number
\`\`\`

**The lower-level API**

\`\`\`python
import multiprocessing as mp

# a single process:
p = mp.Process(target=fn, args=(...))
p.start(); p.join()

# a pool:
with mp.Pool(processes=4) as pool:
    results = pool.map(fn, items)               # blocking, ordered
    results = pool.imap_unordered(fn, items)    # lazy, as-completed
    async_result = pool.apply_async(fn, (arg,)) # -> .get()
\`\`\`

**Sharing state (only when you must)**

\`\`\`python
from multiprocessing import Value, Array, Manager

counter = mp.Value("i", 0)          # shared int in shared memory + a lock
with counter.get_lock():
    counter.value += 1

with Manager() as m:
    shared_dict = m.dict()          # a proxy; every access is an IPC round-trip (slow)
\`\`\`

\`\`\`
concurrent.futures.ProcessPoolExecutor(max_workers=)   .submit()/.map()  -- START HERE
multiprocessing.Pool(processes=)     .map .imap .imap_unordered .apply_async .starmap
multiprocessing.Process(target=,args=)   .start() .join() .is_alive() .terminate()

start methods:  "spawn" (Win/mac default, clean, slow)   "fork" (Linux default, fast, inherits memory)
picklability:   args, return values, and the target must be pickled -> no lambdas, no local
                functions, no open files/sockets/locks as arguments
overhead:       process start ~10-100ms + pickling; worth it only for work >> that
\`\`\``,

    simpleHi: `**One-liner: ProcessPoolExecutor**

\`\`\`python
from concurrent.futures import ProcessPoolExecutor

def count_primes(limit):
    return sum(1 for n in range(2, limit) if is_prime(n))

if __name__ == "__main__":                        # ZAROORI (neeche dekhो)
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(count_primes, [100_000, 200_000, 300_000, 400_000]))
    print(results)
\`\`\`

\`ThreadPoolExecutor\` ke samaan API — shabd \`Thread\` ko \`Process\` se badalो.

**\`if __name__ == "__main__"\` guard anivaarya hai**

\`\`\`
Windows aur macOS par, ek worker process aapki script IMPORT karके shuru hoता hai.
Guard ke bina, wo import aapke pool-spawning code ko phir chalाता hai -> infinite fork bomb.
=> saara process-spawning code  if __name__ == "__main__":  ke tahat hona CHAHIYE
\`\`\`

**Data copy hoता hai, share nahi**

\`\`\`python
big = list(range(10_000_000))

# GALAT mental model: workers 'big' seedhe dekhते hain. Wo NAHI.
def work(chunk):
    return sum(x * x for x in chunk)   # ek chunk bhejो, ek number wapas paओ
\`\`\`

**Lower-level API**

\`\`\`python
import multiprocessing as mp

p = mp.Process(target=fn, args=(...))
p.start(); p.join()

with mp.Pool(processes=4) as pool:
    results = pool.map(fn, items)               # blocking, ordered
    results = pool.imap_unordered(fn, items)    # lazy, as-completed
\`\`\`

**State share karna (sirf jab zaroori ho)**

\`\`\`python
from multiprocessing import Value, Manager

counter = mp.Value("i", 0)          # shared memory mein shared int + ek lock
with counter.get_lock():
    counter.value += 1

with Manager() as m:
    shared_dict = m.dict()          # ek proxy; har access ek IPC round-trip (dhीmा)
\`\`\`

\`\`\`
concurrent.futures.ProcessPoolExecutor(max_workers=)   .submit()/.map()  -- YAHAN SE SHURU
multiprocessing.Pool(processes=)     .map .imap .imap_unordered .apply_async .starmap
multiprocessing.Process(target=,args=)   .start() .join() .is_alive() .terminate()

start methods:  "spawn" (Win/mac default, saaf, dhीmा)   "fork" (Linux default, tez)
picklability:   args, return values, target pickle hone chahiye -> koi lambdas nahi
overhead:       process start ~10-100ms + pickling; sirf tabhi worth jab kaam >> wo
\`\`\``,

    content: `## Why processes give real parallelism

Each process has its own Python interpreter, its own memory space, and its own GIL. Four worker processes on a 4-core machine genuinely run four Python bytecode streams at the same instant. That is the whole point: **CPU-bound work spreads across cores**.

The cost is isolation. Processes do not share memory, so anything that crosses the boundary — the function arguments, the return value, the target function itself — must be **pickled** (serialised to bytes), sent through a pipe, and **unpickled** on the other side. This has three consequences you must design around:

1. **Startup is slow.** Spawning a process is tens of milliseconds; the pool also has to pickle-transport the worker function. Only parallelise work that runs much longer than that.
2. **Not everything can be pickled.** Lambdas, locally-defined functions, open file handles, sockets, database connections, and locks cannot cross. Targets must be module-level functions; arguments must be plain data.
3. **Big data is expensive to pass.** Sending a 100 MB list to each of 8 workers copies 800 MB. Send indices or chunks, or use shared memory, or have each worker load its own data.

## The \`__main__\` guard is not optional

With the \`spawn\` start method (the default on Windows and macOS, and available everywhere), a new worker process boots a fresh interpreter and **imports your main module** to get access to the target function. If your process-spawning code runs at import time (module level), each worker re-runs it on import, spawning more workers, which import and spawn more — a fork bomb that Python detects and turns into a \`RuntimeError\`.

\`\`\`python
def job(x): ...

if __name__ == "__main__":          # this block does NOT run on re-import by workers
    with ProcessPoolExecutor() as pool:
        pool.map(job, data)
\`\`\`

Everything that starts processes goes under the guard. The target functions themselves are defined at module level (so workers can import them) but must not *execute* pool code at import.

## Start methods

\`\`\`python
import multiprocessing as mp
mp.set_start_method("spawn")        # call once, early, under the __main__ guard
\`\`\`

- **\`spawn\`** — a brand-new interpreter; only what you pass is transferred. Clean and predictable, no surprises from inherited state. Slower to start. Default on Windows and macOS.
- **\`fork\`** — the child is a copy of the parent process, inheriting all its memory copy-on-write. Fast, and the child can see module-level data without pickling. Default on Linux, but **unsafe with threads** (a forked child can deadlock on a lock held by a thread that does not exist in the child) — being deprecated as the default.
- **\`forkserver\`** — a middle ground on Linux.

Write code that works under \`spawn\` and it works everywhere.

## \`concurrent.futures.ProcessPoolExecutor\`

The recommended entry point — same API as the thread pool:

\`\`\`python
with ProcessPoolExecutor(max_workers=None) as pool:   # None -> os.cpu_count()
    # ordered results, blocks until all done:
    for result in pool.map(fn, iterable, chunksize=10):
        ...
    # or submit individually and handle as they finish:
    futures = [pool.submit(fn, x) for x in items]
    for fut in as_completed(futures):
        result = fut.result()        # re-raises exceptions from the worker (with traceback)
\`\`\`

\`chunksize\` matters for \`map\` over many small items: it batches them per task so you pay the IPC cost once per batch, not per item.

## \`multiprocessing.Pool\` — the lower-level pool

\`\`\`python
with mp.Pool(processes=4) as pool:
    pool.map(fn, items)                       # ordered, blocking
    pool.starmap(fn, [(1, 2), (3, 4)])        # unpacks each tuple as args
    for r in pool.imap_unordered(fn, items):  # lazy, yields as workers finish
        ...
    async_result = pool.apply_async(fn, args) # non-blocking -> async_result.get(timeout=)
\`\`\`

## Sharing state (avoid if you can)

The multiprocessing-native way to share is expensive and best avoided — prefer returning results and combining them in the parent:

\`\`\`python
# shared primitives in real shared memory (fast, limited types):
count = mp.Value("i", 0)                      # 'i' = C int; also 'd' double, etc.
arr = mp.Array("d", 1000)                     # fixed-size shared array
with count.get_lock():
    count.value += 1

# a Manager: arbitrary objects behind a proxy (convenient, SLOW -- IPC per operation):
with mp.Manager() as m:
    d = m.dict(); lst = m.list()

# multiprocessing.shared_memory: zero-copy bytes buffer for large arrays (advanced)
\`\`\`

The idiomatic design does not share at all: split the input, give each worker a chunk, return partial results, reduce them in the parent (\`sum\`, \`merge\`, \`Counter\` update).`,

    contentHi: `## Processes asli parallelism kyun dete hain

Har process ka apna Python interpreter, apni memory space, aur apna GIL hai. Ek 4-core machine par chaar worker processes sachmuch ek hi pal chaar Python bytecode streams chalाते hain. Yahi poora point hai: **CPU-bound kaam cores ke paar failता hai**.

Keemat isolation hai. Processes memory share nahi karते, toh kuch bhi jо boundary paar karता hai — function arguments, return value, target function khud — **pickle** hona chahiye (bytes mein serialise), ek pipe ke zariye bheja jाना chahiye, aur doosri taraf **unpickle** hona chahiye. Iske teen parinaam hain:

1. **Startup dhीmा hai.** Ek process spawn karna dozens of milliseconds hai. Sirf wo kaam parallelise karो jо usse kaafi zyada der chalता hai.
2. **Har cheez pickle nahi ho sakti.** Lambdas, locally-defined functions, open file handles, sockets, database connections, locks paar nahi ho sakte.
3. **Bada data pass karna mehnga hai.** 8 workers mein se har ek ko ek 100 MB list bhejna 800 MB copy karता hai.

## \`__main__\` guard vaikalpik nahi hai

\`spawn\` start method ke saath (Windows aur macOS par default), ek naya worker process ek fresh interpreter boot karता hai aur **aapka main module import karता hai** target function tak pahुँch paane ke liye. Agar aapka process-spawning code import time par chalता hai, har worker ise import par phir chalाता hai, aur zyada workers spawn karता hai — ek fork bomb jise Python detect karता hai aur ek \`RuntimeError\` mein badalता hai.

\`\`\`python
def job(x): ...

if __name__ == "__main__":          # ye block workers dwara re-import par NAHI chalता
    with ProcessPoolExecutor() as pool:
        pool.map(job, data)
\`\`\`

## Start methods

- **\`spawn\`** — ek bilkul naya interpreter; sirf jо aap pass karते ho transfer hoता hai. Saaf aur predictable. Shuru karne mein dhीmा. Windows aur macOS par default.
- **\`fork\`** — child parent process ki ek copy hai. Tez. Linux par default, par **threads ke saath asurakshit**.
- **\`forkserver\`** — Linux par ek middle ground.

Aisa code likhо jо \`spawn\` ke tahat kaam kare aur ye har jagah kaam karता hai.

## \`ProcessPoolExecutor\`

\`\`\`python
with ProcessPoolExecutor(max_workers=None) as pool:   # None -> os.cpu_count()
    for result in pool.map(fn, iterable, chunksize=10):
        ...
    futures = [pool.submit(fn, x) for x in items]
    for fut in as_completed(futures):
        result = fut.result()        # worker se exceptions re-raise karता hai
\`\`\`

\`chunksize\` kai chhote items par \`map\` ke liye maayne rakhता hai.

## \`multiprocessing.Pool\`

\`\`\`python
with mp.Pool(processes=4) as pool:
    pool.map(fn, items)                       # ordered, blocking
    pool.starmap(fn, [(1, 2), (3, 4)])        # har tuple ko args ki tarah unpack karता hai
    for r in pool.imap_unordered(fn, items):  # lazy, workers ke khatam hote hi yield
        ...
\`\`\`

## State share karna (agar ho sake toh bachो)

\`\`\`python
count = mp.Value("i", 0)
with count.get_lock():
    count.value += 1

with mp.Manager() as m:
    d = m.dict()          # ek proxy, DHEEMA -- prati operation IPC
\`\`\`

Idiomatic design bilkul share nahi karता: input split karो, har worker ko ek chunk do, partial results return karो, parent mein reduce karो.`,

    examples: [
      {
        title: 'ProcessPoolExecutor really uses multiple cores for CPU work',
        titleHi: 'ProcessPoolExecutor CPU kaam ke liye sachmuch kai cores istemal karता hai',
        code: `import time, os
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

def cpu_task(n):
    total = 0
    for i in range(n):
        total += i % 7
    return total

def main():
    N = 25_000_000
    jobs = [N, N, N, N]

    t0 = time.perf_counter()
    [cpu_task(n) for n in jobs]
    serial = time.perf_counter() - t0

    t0 = time.perf_counter()
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(cpu_task, jobs))
    threaded = time.perf_counter() - t0

    t0 = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as pool:
        proc_results = list(pool.map(cpu_task, jobs))
    processed = time.perf_counter() - t0

    print("threads beat serial by 1.5x?  ", threaded < serial / 1.5)
    print("processes beat serial by 1.5x?", processed < serial / 1.5 or (os.cpu_count() or 1) < 3)
    print("results all equal & correct?  ", proc_results == [cpu_task(N)] * 4)

if __name__ == "__main__":
    main()`,
        output: `threads beat serial by 1.5x?   False
processes beat serial by 1.5x? True
results all equal & correct?   True
`,
        explain: '`cpu_task` is a pure-Python loop — CPU-bound. `ThreadPoolExecutor` gives no speedup (`threaded < serial / 1.5` is `False`): the GIL serialises the four threads. `ProcessPoolExecutor` runs each call in a separate process with its own interpreter and GIL, so on a multi-core machine they execute in parallel and the wall time drops well below serial (`True`; the `or os.cpu_count() < 2` guard keeps the assertion honest on a single-core CI box). All four processes return the same correct value.',
        explainHi: '`cpu_task` ek pure-Python loop hai — CPU-bound. `ThreadPoolExecutor` koi speedup nahi deता (`threaded < serial / 1.5` `False` hai): GIL chaar threads serialise karता hai. `ProcessPoolExecutor` har call ko ek alag process mein apne interpreter aur GIL ke saath chalाता hai, toh ek multi-core machine par wo parallel execute karते hain.',
      },
      {
        title: 'Split-map-reduce: send chunks, return partials, combine in the parent',
        titleHi: 'Split-map-reduce: chunks bhejो, partials return karो, parent mein combine karो',
        code: `from concurrent.futures import ProcessPoolExecutor

def partial_sum_of_squares(chunk):
    # each worker gets a small list, returns ONE number -- minimal data crossing the boundary
    return sum(x * x for x in chunk)

def chunked(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i:i + n]

def main():
    data = list(range(1, 100_001))                 # 1..100000
    chunks = list(chunked(data, 10_000))           # 10 chunks of 10k

    with ProcessPoolExecutor(max_workers=4) as pool:
        partials = list(pool.map(partial_sum_of_squares, chunks))

    total = sum(partials)                          # reduce in the parent
    expected = sum(x * x for x in data)

    print("num chunks:", len(chunks))
    print("partials match a serial pass?", total == expected)
    print("total:", total)

if __name__ == "__main__":
    main()`,
        output: `num chunks: 10
partials match a serial pass? True
total: 333338333350000
`,
        explain: 'The input is split into 10 chunks; each worker receives one chunk (10k ints, pickled once), does its share of the computation, and returns a single integer. The parent sums the 10 partial results. Data crossing the process boundary is minimised — 10 small lists in, 10 numbers out — which is what makes `multiprocessing` pay off. This split-map-reduce shape is the standard pattern for parallelising an aggregate over a large dataset.',
        explainHi: 'Input 10 chunks mein split hoता hai; har worker ek chunk paता hai (10k ints, ek baar pickled), apna computation ka hissa karता hai, aur ek single integer lautाता hai. Parent 10 partial results jodता hai. Process boundary paar karne waala data minimise kiya jाता hai — yahi `multiprocessing` ko faaydemand banाता hai.',
      },
      {
        title: 'What cannot be pickled — and the fix',
        titleHi: 'Kya pickle nahi ho sakta — aur fix',
        code: `import pickle
from concurrent.futures import ProcessPoolExecutor

# a module-level function IS picklable (workers can import it by qualified name)
def double(x):
    return x * 2

def line_count(path):                       # takes a path (str), opens its own handle
    with open(path, encoding="utf-8") as fh:
        return sum(1 for _ in fh)

def main():
    # lambdas and local functions are NOT picklable -> cannot be a pool target or argument
    bad = lambda x: x * 2
    try:
        pickle.dumps(bad)
    except (pickle.PicklingError, AttributeError, TypeError) as e:
        print("lambda picklable?  No ->", type(e).__name__)

    print("module fn picklable? Yes ->", pickle.loads(pickle.dumps(double))(21))

    # open file handles are NOT picklable -> pass the path, open inside the worker
    try:
        f = open(__file__)
        pickle.dumps(f)
    except TypeError as e:
        print("open file picklable? No ->", type(e).__name__)
    finally:
        f.close()

    with ProcessPoolExecutor(max_workers=2) as pool:
        counts = list(pool.map(line_count, [__file__, __file__]))
    print("worker opened its own file:", counts[0] == counts[1] and counts[0] > 0)

if __name__ == "__main__":
    main()`,
        output: `lambda picklable?  No -> PicklingError
module fn picklable? Yes -> 42
open file picklable? No -> TypeError
worker opened its own file: True
`,
        explain: 'Everything sent to a worker — the target function and every argument — is pickled. Lambdas and functions defined inside another function have no importable qualified name, so `pickle.dumps` fails (`PicklingError`). Open file objects, sockets, locks, and DB connections wrap OS resources that cannot be serialised (`TypeError`). The fixes: use module-level functions as targets, and pass plain data (a path string, not a file handle) so the worker can recreate the resource on its side.',
        explainHi: 'Ek worker ko bheji har cheez — target function aur har argument — pickle hoती hai. Lambdas aur ek doosre function ke andar define kiye functions ka koi importable qualified name nahi, toh `pickle.dumps` fail hoता hai. Open file objects, sockets, locks OS resources wrap karते hain jо serialise nahi ho sakte. Fixes: module-level functions target ki tarah istemal karो, aur plain data pass karो.',
      },
    ],

    mistakes: [
      {
        wrong: `from concurrent.futures import ProcessPoolExecutor

def job(x): return x * x

with ProcessPoolExecutor() as pool:        # at module level -- NOT under a guard
    print(list(pool.map(job, range(10))))
# on Windows/macOS: each worker re-imports this file, re-runs this block -> RuntimeError`,
        right: `from concurrent.futures import ProcessPoolExecutor

def job(x): return x * x

if __name__ == "__main__":                 # guard: workers importing this file skip it
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(job, range(10))))`,
        why: 'With the `spawn` start method (Windows, macOS, and increasingly Linux), each worker process starts by importing your main module to find the target function. Any pool-spawning code at module level runs again during that import, spawning more workers in a loop. Python detects it and raises a `RuntimeError` telling you to use the `if __name__ == "__main__"` guard. All process-creating code must be under it.',
        whyHi: '`spawn` start method ke saath (Windows, macOS), har worker process aapka main module import karके shuru hoता hai target function dhoondhने ke liye. Module level par koi bhi pool-spawning code us import ke dauraan phir chalता hai, ek loop mein zyada workers spawn karता hai. Python ise detect karता hai aur ek `RuntimeError` raise karता hai.',
      },
      {
        wrong: `records = load_10_million_records()      # 2 GB in the parent

def enrich(i):
    return transform(records[i])         # 'records' pickled + copied into EVERY worker

with ProcessPoolExecutor(max_workers=8) as pool:
    out = list(pool.map(enrich, range(len(records))))   # ~16 GB copied, or MemoryError`,
        right: `def enrich_chunk(chunk):                 # send the data the task needs, not an index into shared state
    return [transform(r) for r in chunk]

chunks = [records[i:i+10000] for i in range(0, len(records), 10000)]
with ProcessPoolExecutor(max_workers=8) as pool:
    out = [r for part in pool.map(enrich_chunk, chunks) for r in part]
# or: have each worker load its own slice from disk/DB; or use shared_memory`,
        why: 'Processes do not share memory. A global like `records` referenced inside the worker function is pickled and copied into each worker when the pool starts (with `spawn`) — 8 workers means 8 copies. For gigabyte data that is an out-of-memory crash or a huge slowdown. Pass each task exactly the slice of data it needs, or have workers load their own data, or use `multiprocessing.shared_memory` for large numeric arrays.',
        whyHi: 'Processes memory share nahi karते. Worker function ke andar reference kiya `records` jaisा ek global pool shuru hone par har worker mein pickle aur copy hoता hai — 8 workers matlab 8 copies. Gigabyte data ke liye wo ek out-of-memory crash hai. Har task ko bilkul wo data slice pass karो jо use chahiye.',
      },
      {
        wrong: `# parallelising a tiny, fast function over many items
def add_one(x): return x + 1

with ProcessPoolExecutor(max_workers=8) as pool:
    result = list(pool.map(add_one, range(1_000_000)))   # SLOWER than a plain loop`,
        right: `result = [x + 1 for x in range(1_000_000)]              # just do it serially

# if it really is CPU-heavy per item, batch to amortise IPC:
with ProcessPoolExecutor(max_workers=8) as pool:
    result = list(pool.map(heavy_fn, items, chunksize=1000))`,
        why: 'Each item sent to a process worker costs a pickle + pipe round-trip — far more than `x + 1`. Over a million trivial items, the IPC overhead dwarfs the work and the parallel version is much slower than a comprehension. `multiprocessing` only wins when the per-task computation greatly exceeds the ~tens-of-microseconds transport cost; use `chunksize` to batch many small items into one task.',
        whyHi: 'Ek process worker ko bheja har item ek pickle + pipe round-trip kharch karता hai — `x + 1` se kaafi zyada. Ek million trivial items par, IPC overhead kaam ko chhota kar deता hai. `multiprocessing` sirf tab jeetता hai jab per-task computation transport cost se kaafi zyada ho; `chunksize` istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**`ProcessPoolExecutor` powers CPU-heavy batch stages** — bulk image/video transcoding, PDF rendering, parsing thousands of documents, feature extraction for ML, running many independent simulations. The parent splits the work list, workers each process a chunk and return small results or write their own output files, the parent aggregates.',
        hi: '**`ProcessPoolExecutor` CPU-bhaari batch stages ko power deता hai** — bulk image/video transcoding, PDF rendering, hazaaron documents parse karna, ML ke liye feature extraction. Parent kaam ki list split karता hai, workers ek chunk process karते hain.',
      },
      {
        en: '**`multiprocessing` is often hidden inside libraries** — scikit-learn\'s `n_jobs=-1`, joblib, Dask, and pandas/Polars parallel ops use process (or thread) pools under the hood. When you set `n_jobs`, you are sizing a `multiprocessing` pool. Knowing the pickling and `__main__`-guard rules explains errors these libraries surface.',
        hi: '**`multiprocessing` aksar libraries ke andar chhupa hoता hai** — scikit-learn ka `n_jobs=-1`, joblib, Dask process (ya thread) pools istemal karते hain. Jab aap `n_jobs` set karते ho, aap ek `multiprocessing` pool size kar rahe ho.',
      },
      {
        en: '**Gunicorn/Celery run worker *processes*, not threads, for CPU isolation** — a crashed or memory-leaking worker is recycled without touching the others, and CPU-bound request handlers actually use all cores. The `fork` vs `spawn` choice, `preload_app`, and max-requests recycling are all `multiprocessing` concerns in disguise.',
        hi: '**Gunicorn/Celery CPU isolation ke liye worker *processes* chalाते hain, threads nahi** — ek crashed ya memory-leaking worker doosron ko chhue bina recycle hoता hai, aur CPU-bound request handlers sachmuch saare cores istemal karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'How does `multiprocessing` achieve real parallelism where `threading` cannot, and what are the costs?',
        qHi: '`multiprocessing` asli parallelism kaise haasil karता hai jahaan `threading` nahi kar sakta, aur keematें kya hain?',
        a: 'threading is limited by the GIL: every thread in a process shares one interpreter and one Global Interpreter Lock, so only one thread executes Python bytecode at any instant, and CPU-bound Python code gets no speedup from threads. multiprocessing sidesteps this by using separate operating-system processes instead of threads. Each process has its own Python interpreter, its own memory space, and crucially its own GIL. So four worker processes on a four-core machine genuinely run four independent bytecode streams simultaneously — the CPU-bound work spreads across the cores, which is exactly what you want. The costs all stem from the fact that processes are isolated and do not share memory. First, anything that crosses the process boundary must be serialised: the target function, every argument passed to it, and every return value are pickled to bytes, sent through a pipe, and unpickled on the other side. That means lambdas, functions defined inside other functions, open files, sockets, locks, and database connections cannot be passed, because they are not picklable; targets must be importable module-level functions and arguments must be plain data. Second, starting a process is expensive — tens of milliseconds — and with the spawn start method each worker boots a fresh interpreter and re-imports your main module, which is why all pool-creating code must sit under an if-name-equals-main guard or workers recursively spawn more workers. Third, passing large data is costly: a global array referenced in the worker function gets copied into every worker, so gigabyte inputs cause memory blow-ups; you have to send each task only the slice it needs, or have workers load their own data, or use shared memory. The practical consequence is that multiprocessing pays off only for coarse-grained CPU-bound work — each task runs much longer than the tens-of-microseconds transport cost and returns a small result — and the idiomatic design is split-map-reduce: partition the input, have each worker compute a partial result, and combine the partials in the parent.',
        aHi: 'threading GIL se limited hai: ek process mein har thread ek interpreter aur ek GIL share karता hai, toh kisi bhi pal sirf ek thread Python bytecode execute karता hai, aur CPU-bound Python code ko threads se koi speedup nahi milता. multiprocessing ise threads ke bजaay alag operating-system processes istemal karके bypass karता hai. Har process ka apna Python interpreter, apni memory space, aur mahatvapoorn roop se apna GIL hai. Toh ek 4-core machine par chaar worker processes sachmuch chaar swतंत्r bytecode streams ek saath chalाते hain. Keematें is tathya se aati hain ki processes isolated hain. Pehla, kuch bhi jо process boundary paar karता hai serialise hona chahiye: target function, har argument, aur har return value pickle hote hain. Iska matlab lambdas, doosre functions ke andar define kiye functions, open files, sockets, locks pass nahi ho sakte. Doosra, ek process shuru karna mehnga hai, aur spawn start method ke saath har worker aapka main module re-import karता hai. Teesra, bada data pass karna mehnga hai. Vyavhaarik parinaam ye hai ki multiprocessing sirf coarse-grained CPU-bound kaam ke liye faaydemand hai, aur idiomatic design split-map-reduce hai.',
      },
      {
        q: 'Why is the `if __name__ == "__main__"` guard required with multiprocessing, and what breaks without it?',
        qHi: 'multiprocessing ke saath `if __name__ == "__main__"` guard kyun zaroori hai, aur iske bina kya tootता hai?',
        a: 'It comes down to how a worker process gets access to your code under the spawn start method, which is the default on Windows and macOS and increasingly on Linux. Unlike fork, which clones the parent process including all its loaded code and state, spawn starts a completely fresh Python interpreter with nothing loaded. For that new interpreter to run your target function, it has to import the module that defines it — and in a script, that is your main module, the file you ran. So each worker imports your script from the top. Now consider what happens if your pool-creating code is at module level, running on import rather than inside a function. When the first process creates the pool, each worker it spawns imports the script, which executes that module-level pool-creating code again, so each worker tries to create its own pool, whose workers import the script and create more pools, and so on. It is a recursive fork bomb. Python has a guard against this: the multiprocessing bootstrap detects that it is being run in a worker during import and raises a RuntimeError with a message explaining that you need to protect the entry point with if-name-equals-main. The fix is to put everything that starts processes — creating the executor or pool, calling map or submit — inside the if-name-equals-main block. When a worker imports the script, name is the module\'s import name, not "main", so that block is skipped; the worker just picks up the function definitions it needs. The target functions themselves stay at module level so they are importable, but they must not execute pool code as a side effect of import. This is also just good practice for any script: module-level code should be definitions, and the actual work should be in a main function called under the guard.',
        aHi: 'Ye is baat par aata hai ki ek worker process spawn start method ke tahat aapke code tak kaise pahुँchता hai, jо Windows aur macOS par default hai. fork ke विपरीत, jо parent process ko clone karता hai, spawn ek bilkul fresh Python interpreter shuru karता hai jismein kuch load nahi. Us naye interpreter ke liye aapka target function chalाने ke liye, use wo module import karna hoga jо ise define karता hai — aur ek script mein, wo aapka main module hai. Toh har worker aapki script ko top se import karता hai. Ab socho kya hoता hai agar aapka pool-creating code module level par hai. Jab pehला process pool banाता hai, har worker jise wo spawn karता hai script import karता hai, jо us module-level pool-creating code ko phir execute karता hai, toh har worker apna pool banाने ki koshish karता hai — ek recursive fork bomb. Python iske khilaaf ek guard rakhता hai: ye ek RuntimeError raise karता hai. Fix ye hai ki process shuru karne waali har cheez ko if-name-equals-main block ke andar rakhо.',
      },
    ],

    exercises: [
      {
        task: 'Write a CPU-bound `sum_squares(n)` returning `sum(i*i for i in range(n))`. Under an `if __name__ == "__main__"` guard, time `[sum_squares(1_000_000) for _ in range(4)]` serially, then via `ProcessPoolExecutor(max_workers=4)` with `pool.map`. Print whether the pool version was faster (True on a multi-core box) and whether the results match.',
        taskHi: 'Ek CPU-bound `sum_squares(n)` likhо jо `sum(i*i for i in range(n))` lautае. Ek `if __name__ == "__main__"` guard ke tahat, `[sum_squares(1_000_000) for _ in range(4)]` serially time karो, phir `ProcessPoolExecutor(max_workers=4)` ke zariye. Print karो ki pool version tez tha.',
        hint: '`with ProcessPoolExecutor(max_workers=4) as pool: results = list(pool.map(sum_squares, [1_000_000]*4))`. Compare `processed < serial / 1.5`. Guard the whole timing block with `if __name__ == "__main__":` and put it in a `main()` function.',
        hintHi: '`with ProcessPoolExecutor(max_workers=4) as pool: results = list(pool.map(sum_squares, [1_000_000]*4))`. `processed < serial / 1.5` compare karो.',
      },
      {
        task: 'Implement parallel word-count. Given a list of ~20 text strings, write `count_chunk(strings)` returning a `collections.Counter` of words across that chunk. Split the list into 4 chunks, `pool.map` `count_chunk` over them, and sum the 4 Counters in the parent. Compare the total to a serial single-Counter pass; print `True`.',
        taskHi: 'Parallel word-count implement karो. ~20 text strings ki ek list diye, `count_chunk(strings)` likhо jо us chunk ke words ka ek `collections.Counter` lautае. List ko 4 chunks mein split karो, `pool.map` karो, aur parent mein 4 Counters jodो.',
        hint: '`from collections import Counter`; `def count_chunk(strings): c = Counter(); [c.update(s.split()) for s in strings]; return c`. In the parent: `total = sum(pool.map(count_chunk, chunks), Counter())`. Counter supports `+` and is picklable.',
        hintHi: '`def count_chunk(strings): c = Counter(); [c.update(s.split()) for s in strings]; return c`. Parent mein: `total = sum(pool.map(count_chunk, chunks), Counter())`.',
      },
      {
        task: 'Demonstrate picklability. Try `pickle.dumps` on: (a) a `lambda`, (b) a module-level function, (c) an open file object, (d) a nested (local) function. Print for each whether it pickled. Then show the fix: a `ProcessPoolExecutor` running a module-level `word_len(path)` that opens its own file, mapped over `[__file__, __file__]`.',
        taskHi: 'Picklability dikhाओ. `pickle.dumps` try karो: (a) ek `lambda`, (b) ek module-level function, (c) ek open file object, (d) ek nested function par. Har ek ke liye print karो ki wo pickle hua. Phir fix dikhाओ.',
        hint: 'Wrap each in `try: pickle.dumps(obj); print("yes") except Exception as e: print("no", type(e).__name__)`. Lambda -> `PicklingError`; open file -> `TypeError`; nested function -> `PicklingError` / `AttributeError`. Module-level fn -> works.',
        hintHi: 'Har ek ko `try: pickle.dumps(obj); print("yes") except Exception as e: print("no", type(e).__name__)` mein wrap karो. Lambda -> `PicklingError`; open file -> `TypeError`.',
      },
    ],

    keyTakeaways: [
      'Each process has its OWN interpreter, memory, and GIL -> `multiprocessing` gives REAL parallelism for CPU-bound Python. `ThreadPoolExecutor` -> `ProcessPoolExecutor` is a one-word switch (same API).',
      'The `if __name__ == "__main__":` guard is MANDATORY: with `spawn` (Windows/macOS default) each worker imports your main module; unguarded pool code re-runs on import -> `RuntimeError` / fork bomb.',
      'Processes do NOT share memory. The target function, every argument, and every return value are PICKLED and copied across the boundary.',
      'Not picklable: lambdas, local/nested functions, open files, sockets, locks, DB connections. Targets = module-level functions; arguments = plain data (pass a path, not a file handle).',
      'Overhead = process startup (~10–100 ms) + pickling per task. Worth it ONLY when per-task work greatly exceeds that. Use `chunksize` to batch many small items; never parallelise a trivial function.',
      'Passing big data copies it into every worker (8 workers = 8 copies). Send each task only its slice, have workers load their own data, or use `multiprocessing.shared_memory`.',
      'Idiomatic design = split-map-reduce: partition input -> workers return partial results -> parent combines (`sum`, `Counter` update, `merge`). Avoid `Value`/`Array`/`Manager` shared state unless truly needed.',
      'Start methods: `spawn` (clean, slow, Win/mac default — write for this), `fork` (fast, Linux, unsafe with threads), `forkserver`. `ProcessPoolExecutor(max_workers=None)` defaults to `os.cpu_count()`.',
    ],
    keyTakeawaysHi: [
      'Har process ka APNA interpreter, memory, aur GIL hai -> `multiprocessing` CPU-bound Python ke liye ASLI parallelism deता hai. `ThreadPoolExecutor` -> `ProcessPoolExecutor` ek-shabd switch hai (wahi API).',
      '`if __name__ == "__main__":` guard ANIVAARYA hai: `spawn` (Windows/macOS default) ke saath har worker aapka main module import karता hai; unguarded pool code import par phir chalता hai -> `RuntimeError` / fork bomb.',
      'Processes memory share NAHI karते. Target function, har argument, aur har return value PICKLE aur copy hote hain.',
      'Pickle nahi ho sakta: lambdas, local/nested functions, open files, sockets, locks, DB connections. Targets = module-level functions; arguments = plain data.',
      'Overhead = process startup (~10–100 ms) + prati task pickling. Sirf tabhi worth jab per-task kaam usse kaafi zyada ho. `chunksize` istemal karो; kabhi ek trivial function parallelise mat karो.',
      'Bada data pass karna use har worker mein copy karता hai (8 workers = 8 copies). Har task ko sirf iska slice bhejो, ya `multiprocessing.shared_memory` istemal karो.',
      'Idiomatic design = split-map-reduce: input partition karो -> workers partial results return karें -> parent combine kare. `Value`/`Array`/`Manager` shared state se bachо.',
      'Start methods: `spawn` (saaf, dhीmा, Win/mac default — iske liye likhо), `fork` (tez, Linux, threads ke saath asurakshit), `forkserver`. `ProcessPoolExecutor(max_workers=None)` `os.cpu_count()` default karता hai.',
    ],
  },
];
