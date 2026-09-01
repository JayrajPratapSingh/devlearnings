/**
 * Python Complete Course — Module 10: Concurrency, Performance & the Runtime, lessons 4-6.
 *
 * Lesson 4: asyncio basics — the event loop, coroutines, async/await,
 *           `asyncio.run`, `gather`, `create_task`, why one blocking call
 *           freezes everything.
 * Lesson 5: async patterns & pitfalls — `TaskGroup` (3.11), timeouts,
 *           cancellation, async context managers / iterators, `asyncio.to_thread`,
 *           the sync-in-async trap, mixing models.
 * Lesson 6: performance, GC & profiling — measure first (`timeit`, `perf_counter`,
 *           `cProfile`/`pstats`, `tracemalloc`), reference counting + cycle
 *           collector, the `gc` module, concrete speedups, when to reach for
 *           C / NumPy.
 *
 * NOTE for future editors: same rules as the rest of this course. Every backtick
 * inside simple/simpleHi/content/contentHi is `\`` (inline code inside ``` blocks
 * included). Escape `$` before `{` inside template literals as `\${`. Keep example
 * OUTPUT ASCII-only. `examples` use `code` + `output`; run every sample with
 * `python`. Timing examples use WIDE margins and print BOOLEANS, never raw seconds.
 * Profiling examples print only DETERMINISTIC parts (call counts, not times).
 * Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .` from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'py-asyncio-basics',
    title: 'asyncio: The Event Loop, Coroutines, and async/await',
    titleHi: 'asyncio: Event Loop, Coroutines, Aur async/await',
    description: 'Ten thousand simultaneous network connections would be ten thousand threads — gigabytes of stack, and a scheduler thrashing. asyncio runs them all on one thread: each task is a coroutine that voluntarily hands control back at every `await`, so while one waits on the network, thousands of others make progress.',
    descriptionHi: 'Dus hazaar ek saath network connections dus hazaar threads honge — gigabytes stack, aur ek scheduler thrash karता. asyncio unhe sab ek thread par chalाता hai: har task ek coroutine hai jо har `await` par swेchha se control wapas deता hai, toh jabki ek network par wait karता hai, hazaaron doosre pragati karते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**One extremely organised receptionist versus a hall full of clerks.** The threaded model is a hall of clerks: each handles one visitor start to finish, and if the visitor is waiting on a document from the archive, that clerk just sits idle until it arrives. Hire enough clerks and the room is full, the payroll is huge, and the manager spends all day deciding whose turn it is. The async model is one hyper-competent receptionist. They start visitor A\'s request, and the instant A says "I need to wait for the archive", the receptionist says `await` and immediately turns to visitor B, then C, then D. When the archive delivers A\'s document, the receptionist picks A\'s request back up exactly where it paused. Because the switching only happens at explicit `await` points — never mid-sentence — the receptionist never loses their place and never needs a lock. The catch: the whole system depends on everyone saying "I\'ll wait" politely with `await`. If one visitor grabs the receptionist and makes them personally walk to the archive (a blocking call), every other visitor in the queue is frozen until they get back.',
      hi: '**Ek behद vyavasthित receptionist versus clerks se bhara hall.** Threaded model clerks ka ek hall hai: har ek ek visitor ko shuru se ant tak handle karता hai, aur agar visitor archive se ek document ka wait kar raha hai, wo clerk bस idle baithता hai. Async model ek hyper-competent receptionist hai. Wo visitor A ka request shuru karते hain, aur jis pal A kahता hai "mujhe archive ka wait karna hai", receptionist kahता hai `await` aur turant visitor B ki taraf mudता hai, phir C, phir D. Jab archive A ka document deता hai, receptionist A ka request wapas uthाता hai bilkul wahaan se jahaan wo ruka. Kyunki switching sirf explicit `await` points par hoती hai, receptionist kabhi apni jagah nahi khoता aur kabhi lock ki zaroorat nahi. Pech: agar ek visitor receptionist ko pakadता hai aur unhe khud archive tak chalाता hai (ek blocking call), queue mein har doosra visitor tab tak jamा rehता hai.',
    },

    simple: `**A coroutine: a function defined with \`async def\`**

\`\`\`python
import asyncio

async def greet(name):            # calling greet(...) returns a COROUTINE, does not run it
    print(f"hello {name}")
    await asyncio.sleep(1)         # 'await' = "pause me here, run other tasks, resume when ready"
    print(f"bye {name}")

asyncio.run(greet("Ada"))         # asyncio.run() starts the event loop and runs the coroutine
\`\`\`

**Running things concurrently**

\`\`\`python
async def main():
    # sequential: 3 seconds total
    await greet("A")
    await greet("B")
    await greet("C")

    # concurrent: ~1 second total -- all three run "at once" on one thread
    await asyncio.gather(greet("A"), greet("B"), greet("C"))

asyncio.run(main())
\`\`\`

**\`await\` vs \`create_task\`**

\`\`\`python
# await runs it NOW and waits for the result:
result = await fetch(url)

# create_task schedules it to run concurrently; await the task later:
task = asyncio.create_task(fetch(url))      # starts running in the background
... do other work ...
result = await task                          # collect the result when you need it

# gather = create several tasks + await them all, results in order:
a, b, c = await asyncio.gather(fetch(u1), fetch(u2), fetch(u3))
\`\`\`

**The rule: never block the loop**

\`\`\`python
async def bad():
    time.sleep(5)                 # BLOCKS the entire event loop for 5s -- every task frozen
    data = requests.get(url)      # BLOCKS -- synchronous library
    result = heavy_cpu_computation()   # BLOCKS -- no await point

async def good():
    await asyncio.sleep(5)                          # yields to the loop
    async with httpx.AsyncClient() as c:            # async HTTP library
        data = await c.get(url)
    result = await asyncio.to_thread(heavy_cpu_computation)   # offload blocking work
\`\`\`

\`\`\`
async def fn(): ...          defines a coroutine function; fn() returns a coroutine object
await X                      X must be awaitable (coroutine, Task, Future); pauses until X is done
asyncio.run(coro)            entry point: makes a loop, runs coro to completion, closes the loop
asyncio.create_task(coro)    schedule coro concurrently -> Task (a Future); await it later
asyncio.gather(*coros)       run many concurrently, return results as a list IN ORDER
asyncio.sleep(secs)          non-blocking sleep -- the ONLY way to "wait" without freezing the loop
asyncio.to_thread(fn, *a)    run a blocking sync function in a thread, await the result

CANNOT: call a coroutine without await (it just creates an unused coroutine + a warning)
CANNOT: use await outside an async def
MUST NOT: call blocking code (time.sleep, requests, open().read(), heavy loops) in a coroutine
\`\`\``,

    simpleHi: `**Ek coroutine: \`async def\` se define kiya function**

\`\`\`python
import asyncio

async def greet(name):            # greet(...) call karna ek COROUTINE lautाता hai, ise chalाता nahi
    print(f"hello {name}")
    await asyncio.sleep(1)         # 'await' = "mujhe yahaan pause karo, doosre tasks chalाओ, ready hone par resume"
    print(f"bye {name}")

asyncio.run(greet("Ada"))         # asyncio.run() event loop shuru karता hai aur coroutine chalाता hai
\`\`\`

**Cheezein concurrently chalाना**

\`\`\`python
async def main():
    # sequential: 3 seconds total
    await greet("A")
    await greet("B")

    # concurrent: ~1 second total -- teeno ek thread par "ek saath" chalते hain
    await asyncio.gather(greet("A"), greet("B"), greet("C"))

asyncio.run(main())
\`\`\`

**\`await\` vs \`create_task\`**

\`\`\`python
# await ise ABHI chalाता hai aur result ka wait karता hai:
result = await fetch(url)

# create_task ise concurrently chalाने ko schedule karता hai; task ko baad mein await karो:
task = asyncio.create_task(fetch(url))      # background mein chalна shuru
result = await task                          # jab zaroorat ho result collect karो

# gather = kai tasks create karो + sabko await karो, results kram mein:
a, b, c = await asyncio.gather(fetch(u1), fetch(u2), fetch(u3))
\`\`\`

**Niyam: loop ko kabhi block mat karो**

\`\`\`python
async def bad():
    time.sleep(5)                 # poore event loop ko 5s ke liye BLOCK karता hai
    data = requests.get(url)      # BLOCK -- synchronous library

async def good():
    await asyncio.sleep(5)                          # loop ko yield karता hai
    async with httpx.AsyncClient() as c:
        data = await c.get(url)
    result = await asyncio.to_thread(heavy_cpu_computation)   # blocking kaam offload karो
\`\`\`

\`\`\`
async def fn(): ...          ek coroutine function define karता hai; fn() ek coroutine object lautाता hai
await X                      X awaitable hona chahiye; X khatam hone tak pause karता hai
asyncio.run(coro)            entry point: ek loop banाता hai, coro chalाता hai, loop band karता hai
asyncio.create_task(coro)    coro ko concurrently schedule karो -> Task; ise baad mein await karो
asyncio.gather(*coros)       kai concurrently chalाओ, results ek list mein KRAM MEIN
asyncio.sleep(secs)          non-blocking sleep -- loop ko freeze kiye bina "wait" karne ka EKMAATr tarika
asyncio.to_thread(fn, *a)    ek blocking sync function ko ek thread mein chalाओ, result await karो

NAHI KAR SAKTA: bina await ek coroutine call karna
NAHI KAR SAKTA: ek async def ke baahar await istemal karna
NAHI KARNA CHAHIYE: ek coroutine mein blocking code (time.sleep, requests, heavy loops) call karna
\`\`\``,

    content: `## The event loop

\`asyncio\` runs on a single thread that spins an **event loop**: a scheduler that keeps a list of ready tasks and a set of things being waited on (timers, sockets). It runs one task until that task hits an \`await\` on something not yet ready, at which point the task is suspended and the loop picks the next ready task. When an awaited operation completes (the timer fires, the socket has data), its task becomes ready again and the loop resumes it exactly where it paused.

Because there is only one thread and control only moves at \`await\` points, **you never need a lock** for in-memory state — no other task can run in the middle of your non-await code.

## Coroutines and \`await\`

\`\`\`python
async def fetch(url):        # a coroutine FUNCTION
    ...

c = fetch("...")             # calling it returns a COROUTINE OBJECT -- nothing has run yet
\`\`\`

A coroutine does nothing until it is *driven* by \`await\`, \`asyncio.run\`, or being wrapped in a task. \`await c\` runs \`c\` to completion and gives you its return value, suspending the current coroutine while \`c\` waits on I/O.

\`await\` requires an **awaitable**: another coroutine, a \`Task\`, or a \`Future\`. You cannot \`await\` a plain value or a normal function call.

## \`asyncio.run\` — the entry point

\`\`\`python
async def main():
    ...

asyncio.run(main())          # creates a fresh event loop, runs main() to completion, closes the loop
\`\`\`

Call \`asyncio.run\` **once**, at the top level of your program. Do not call it inside a coroutine, and do not create loops by hand in normal code.

## Sequential vs concurrent

\`await\` one thing at a time is sequential:

\`\`\`python
a = await fetch(u1)          # wait for this...
b = await fetch(u2)          # ...then start this  -> total = t1 + t2
\`\`\`

To overlap them, create tasks or use \`gather\`:

\`\`\`python
# gather: schedule all, wait for all, results in argument order
a, b, c = await asyncio.gather(fetch(u1), fetch(u2), fetch(u3))    # total ~= max(t1, t2, t3)

# create_task: fine-grained control
t1 = asyncio.create_task(fetch(u1))      # begins running now
t2 = asyncio.create_task(fetch(u2))
# ... other work happens while they run ...
a = await t1
b = await t2
\`\`\`

\`create_task\` is what actually schedules a coroutine to run concurrently. A bare \`fetch(u1)\` with no \`await\` and no task never runs at all (and you get a "coroutine was never awaited" warning).

## The cardinal rule: do not block the loop

The single thread runs everyone. Any operation that does not \`await\` — and takes real time — stalls **every** task:

- \`time.sleep(n)\` -> use \`await asyncio.sleep(n)\`
- \`requests.get\`, \`urllib\`, a synchronous DB driver -> use \`httpx.AsyncClient\`, \`aiohttp\`, \`asyncpg\`, \`redis.asyncio\`
- \`open(path).read()\` for large files -> \`aiofiles\`, or accept it for small config reads
- a heavy CPU loop -> \`await asyncio.to_thread(fn)\` (offload to a thread) or a process pool for real CPU work

\`\`\`python
# offload a blocking call so the loop keeps serving other tasks:
result = await asyncio.to_thread(blocking_function, arg1, arg2)

# for CPU-bound work, hand it to a process pool via the loop:
loop = asyncio.get_running_loop()
result = await loop.run_in_executor(process_pool, cpu_heavy, data)
\`\`\`

## Getting results as they finish

\`\`\`python
tasks = [asyncio.create_task(fetch(u)) for u in urls]

# in order, wait for all:
results = await asyncio.gather(*tasks)

# as each completes:
for coro in asyncio.as_completed(tasks):
    result = await coro
    handle(result)
\`\`\`

## \`gather\` and errors

By default, if one coroutine in \`gather\` raises, that exception propagates out of \`gather\` and the others keep running (unawaited). \`return_exceptions=True\` instead collects exceptions as results:

\`\`\`python
results = await asyncio.gather(*tasks, return_exceptions=True)
for r in results:
    if isinstance(r, Exception):
        ...
\`\`\`

The next lesson covers \`TaskGroup\` (3.11+), which handles failure and cancellation more cleanly.`,

    contentHi: `## Event loop

\`asyncio\` ek single thread par chalता hai jо ek **event loop** ghumाता hai: ek scheduler jо ready tasks ki ek list rakhता hai. Ye ek task chalाता hai jab tak wo task kisi cheez par \`await\` na maare jо abhi ready nahi, jis point par task suspend hoता hai aur loop agला ready task uthाता hai. Jab ek awaited operation poora hoता hai, iska task phir ready ho jाता hai aur loop ise bilkul wahaan resume karता hai jahaan wo ruka.

Kyunki sirf ek thread hai aur control sirf \`await\` points par move karता hai, **aapko kabhi ek lock ki zaroorat nahi** in-memory state ke liye.

## Coroutines aur \`await\`

\`\`\`python
async def fetch(url):        # ek coroutine FUNCTION
    ...

c = fetch("...")             # ise call karna ek COROUTINE OBJECT lautाता hai -- abhi kuch nahi chala
\`\`\`

Ek coroutine kuch nahi karता jab tak ise \`await\`, \`asyncio.run\`, ya ek task mein wrap karके *drive* na kiya jाए.

## \`asyncio.run\` — entry point

\`\`\`python
async def main():
    ...

asyncio.run(main())          # ek fresh event loop banाता hai, main() chalाता hai, loop band karता hai
\`\`\`

\`asyncio.run\` ko **ek baar** call karो, apne program ke top level par.

## Sequential vs concurrent

\`\`\`python
a = await fetch(u1)          # iska wait karो...
b = await fetch(u2)          # ...phir ise shuru karो  -> total = t1 + t2
\`\`\`

Unhe overlap karne ke liye, tasks create karो ya \`gather\` istemal karो:

\`\`\`python
a, b, c = await asyncio.gather(fetch(u1), fetch(u2), fetch(u3))    # total ~= max(t1, t2, t3)

t1 = asyncio.create_task(fetch(u1))      # ab chalна shuru
t2 = asyncio.create_task(fetch(u2))
a = await t1
b = await t2
\`\`\`

\`create_task\` wo hai jо asal mein ek coroutine ko concurrently chalाने ko schedule karता hai.

## Mukhya niyam: loop ko block mat karो

Single thread sabko chalाता hai. Koi bhi operation jо \`await\` nahi karता — aur asli samay leता hai — **har** task ko stall karता hai:

- \`time.sleep(n)\` -> \`await asyncio.sleep(n)\` istemal karो
- \`requests.get\`, synchronous DB driver -> \`httpx.AsyncClient\`, \`aiohttp\`, \`asyncpg\`
- ek heavy CPU loop -> \`await asyncio.to_thread(fn)\`

\`\`\`python
result = await asyncio.to_thread(blocking_function, arg1, arg2)

loop = asyncio.get_running_loop()
result = await loop.run_in_executor(process_pool, cpu_heavy, data)
\`\`\`

## Results jaise wo khatam hote hain

\`\`\`python
tasks = [asyncio.create_task(fetch(u)) for u in urls]

results = await asyncio.gather(*tasks)                 # kram mein, sabka wait

for coro in asyncio.as_completed(tasks):               # jaise har ek poora hoता hai
    result = await coro
\`\`\`

## \`gather\` aur errors

Default roop se, agar \`gather\` mein ek coroutine raise karता hai, wo exception \`gather\` se bahar propagate hoता hai. \`return_exceptions=True\` iske bजaय exceptions ko results ki tarah collect karता hai:

\`\`\`python
results = await asyncio.gather(*tasks, return_exceptions=True)
\`\`\``,

    examples: [
      {
        title: 'Sequential await vs concurrent gather',
        titleHi: 'Sequential await vs concurrent gather',
        code: `import asyncio, time

async def task(name, secs):
    await asyncio.sleep(secs)
    return f"{name} done"

async def main():
    # sequential: 0.2 + 0.2 + 0.2 = ~0.6s
    t0 = time.perf_counter()
    r1 = await task("A", 0.2)
    r2 = await task("B", 0.2)
    r3 = await task("C", 0.2)
    seq = time.perf_counter() - t0

    # concurrent: all three sleeps overlap -> ~0.2s
    t0 = time.perf_counter()
    results = await asyncio.gather(task("A", 0.2), task("B", 0.2), task("C", 0.2))
    con = time.perf_counter() - t0

    print("sequential ~0.6s? ", 0.5 < seq < 0.9)
    print("concurrent  <0.4s?", con < 0.4)
    print("gather keeps order:", results == ["A done", "B done", "C done"])
    print("sequential results:", [r1, r2, r3])

asyncio.run(main())`,
        output: `sequential ~0.6s?  True
concurrent  <0.4s? True
gather keeps order: True
sequential results: ['A done', 'B done', 'C done']
`,
        explain: 'Three `await task(...)` in a row is sequential — each `await` fully completes before the next begins, so the sleeps stack to ~0.6 s. `asyncio.gather(task(...), task(...), task(...))` schedules all three as tasks and suspends `main` until all finish; the three `asyncio.sleep` calls overlap on the one thread, so wall time is ~0.2 s. `gather` returns results in the order the coroutines were passed, not the order they completed.',
        explainHi: 'Lagataar teen `await task(...)` sequential hai — har `await` agle ke shuru hone se pehle poori tarah poora hoता hai, toh sleeps ~0.6 s tak stack hote hain. `asyncio.gather(...)` teeno ko tasks ki tarah schedule karता hai aur `main` ko suspend karता hai jab tak sab khatam na ho; teen `asyncio.sleep` calls ek thread par overlap karते hain. `gather` results us kram mein lautाता hai jismें coroutines pass kiye gaye.',
      },
      {
        title: 'create_task starts work in the background; a blocking call freezes everything',
        titleHi: 'create_task background mein kaam shuru karता hai; ek blocking call sab kuch freeze karता hai',
        code: `import asyncio, time

log = []

async def ticker():
    for i in range(5):
        await asyncio.sleep(0.1)
        log.append(f"tick {i}")

async def good_worker():
    await asyncio.sleep(0.25)
    log.append("good_worker done")

async def bad_worker():
    time.sleep(0.25)                  # BLOCKING -- no await -> the loop cannot run ticker
    log.append("bad_worker done")

async def main_good():
    log.clear()
    t = asyncio.create_task(ticker())      # runs concurrently
    await good_worker()
    await t
    return list(log)

async def main_bad():
    log.clear()
    t = asyncio.create_task(ticker())
    await bad_worker()                     # blocks the whole loop for 0.25s
    await t
    return list(log)

good = asyncio.run(main_good())
bad = asyncio.run(main_bad())

# with good_worker, ticks interleave with the worker:
print("good: ticks happen during the worker:", good.index("good_worker done") > 0)
print("good tick count:", sum(1 for x in good if x.startswith("tick")))
# with bad_worker, time.sleep froze the loop -> no ticks until it returned:
print("bad: bad_worker done before any tick:", bad.index("bad_worker done") == 0)`,
        output: `good: ticks happen during the worker: True
good tick count: 5
bad: bad_worker done before any tick: True
`,
        explain: '`ticker` is scheduled with `create_task` so it runs concurrently with the worker. With `good_worker` (which `await asyncio.sleep`s), control returns to the loop during the wait, so several `tick` entries land before `good_worker done`. With `bad_worker` (which calls the blocking `time.sleep`), there is no `await` — the single event-loop thread is stuck inside `time.sleep` for 0.25 s and `ticker` cannot run at all, so `bad_worker done` is logged before any tick. One blocking call freezes every task.',
        explainHi: '`ticker` `create_task` se schedule hua toh ye worker ke saath concurrently chalता hai. `good_worker` ke saath (jо `await asyncio.sleep` karता hai), wait ke dauraan control loop ko wapas jाता hai, toh kai `tick` entries `good_worker done` se pehle land karती hain. `bad_worker` ke saath (jо blocking `time.sleep` call karता hai), koi `await` nahi — single event-loop thread `time.sleep` ke andar 0.25 s ke liye phas jाता hai aur `ticker` bilkul nahi chal sakta.',
      },
      {
        title: 'Offloading a blocking function with asyncio.to_thread',
        titleHi: 'asyncio.to_thread se ek blocking function offload karna',
        code: `import asyncio, time

log = []

def blocking_hash(n):                      # a synchronous, blocking function
    time.sleep(0.2)                        # pretend this is slow I/O or CPU work
    return f"hash-{n}"

async def heartbeat():
    for i in range(4):
        await asyncio.sleep(0.1)
        log.append(f"beat {i}")

async def main():
    hb = asyncio.create_task(heartbeat())

    # WITHOUT to_thread this would freeze the heartbeat for 0.6s.
    # WITH to_thread each blocking call runs on a worker thread; the loop stays free.
    results = await asyncio.gather(
        asyncio.to_thread(blocking_hash, 1),
        asyncio.to_thread(blocking_hash, 2),
        asyncio.to_thread(blocking_hash, 3),
    )

    await hb
    return results, list(log)

results, beats = asyncio.run(main())
print("results:", results)
print("heartbeat kept beating during the blocking work:", beats == ["beat 0", "beat 1", "beat 2", "beat 3"])`,
        output: `results: ['hash-1', 'hash-2', 'hash-3']
heartbeat kept beating during the blocking work: True
`,
        explain: '`blocking_hash` uses `time.sleep` — calling it directly in a coroutine would stall the loop. `asyncio.to_thread(blocking_hash, n)` runs it on a `ThreadPoolExecutor` thread and gives back an awaitable; the event loop is free to run `heartbeat` while the three hashes compute in parallel threads (the GIL is released during `time.sleep`). All four heartbeats fire on schedule. This is the bridge for using synchronous libraries from async code without blocking.',
        explainHi: '`blocking_hash` `time.sleep` istemal karता hai — ise ek coroutine mein seedhe call karna loop ko stall karता. `asyncio.to_thread(blocking_hash, n)` ise ek `ThreadPoolExecutor` thread par chalाता hai aur ek awaitable wapas deता hai; event loop `heartbeat` chalाने ke liye free hai jabki teen hashes parallel threads mein compute hote hain. Ye async code se synchronous libraries istemal karne ka bridge hai.',
      },
    ],

    mistakes: [
      {
        wrong: `async def process_all(urls):
    for url in urls:
        await fetch(url)          # each await fully completes before the next -> SEQUENTIAL
    # 100 urls x 50ms each = 5 seconds, on a tool built for concurrency`,
        right: `async def process_all(urls):
    tasks = [asyncio.create_task(fetch(url)) for url in urls]
    return await asyncio.gather(*tasks)      # all 100 in flight at once -> ~50ms
    # or in 3.11+:  async with asyncio.TaskGroup() as tg: for u in urls: tg.create_task(fetch(u))`,
        why: 'A `for` loop with `await` inside runs the iterations one after another — it is just sequential code with pauses. The whole point of asyncio is overlapping the waits. Create all the tasks first (which schedules them), then `await asyncio.gather` (or a `TaskGroup`) to wait for the batch. That is the difference between 5 seconds and 50 milliseconds.',
        whyHi: 'Ek `for` loop jismein `await` andar hai iterations ek ke baad ek chalाता hai — ye bस pauses ke saath sequential code hai. asyncio ka poora point waits overlap karna hai. Pehle saare tasks create karो (jо unhe schedule karता hai), phir `await asyncio.gather`. Wo 5 seconds aur 50 milliseconds ka antar hai.',
      },
      {
        wrong: `async def get_data():
    fetch(url)                    # coroutine created but never awaited -> never runs
    return "done"                 # returns immediately; RuntimeWarning: coroutine never awaited`,
        right: `async def get_data():
    result = await fetch(url)     # actually runs it and gets the value
    return result`,
        why: 'Calling a coroutine function returns a coroutine object; it does not execute anything until it is awaited or scheduled as a task. `fetch(url)` on its own line does nothing but create (and leak) an unstarted coroutine, and Python emits `RuntimeWarning: coroutine "fetch" was never awaited`. Every coroutine call must be `await`ed, passed to `create_task`, or collected by `gather`.',
        whyHi: 'Ek coroutine function call karna ek coroutine object lautाता hai; ye kuch execute nahi karता jab tak ise await ya ek task ki tarah schedule na kiya jाए. Apni line par `fetch(url)` ek unstarted coroutine banाने (aur leak karne) ke alावा kuch nahi karता, aur Python `RuntimeWarning: coroutine "fetch" was never awaited` deता hai.',
      },
      {
        wrong: `import asyncio, requests    # requests is SYNCHRONOUS

async def fetch(url):
    return requests.get(url).json()   # blocks the event loop for the whole request

async def main():
    await asyncio.gather(*[fetch(u) for u in urls])   # NOT concurrent -- one at a time, loop frozen each time`,
        right: `import asyncio, httpx           # httpx has an async client

async def fetch(client, url):
    resp = await client.get(url)
    return resp.json()

async def main():
    async with httpx.AsyncClient() as client:
        await asyncio.gather(*[fetch(client, u) for u in urls])   # genuinely concurrent`,
        why: 'Wrapping a synchronous call in `async def` does not make it non-blocking. `requests.get` holds the single event-loop thread for the entire HTTP round-trip, so the "concurrent" `gather` actually runs the requests one at a time with the loop frozen during each. You need an async-native HTTP library (`httpx`, `aiohttp`) whose `get` is a real `await` point — or offload `requests` calls via `asyncio.to_thread`.',
        whyHi: 'Ek synchronous call ko `async def` mein wrap karna ise non-blocking nahi banाता. `requests.get` poore HTTP round-trip ke liye single event-loop thread ko hold karता hai, toh "concurrent" `gather` asal mein requests ek samay ek chalाता hai loop har ek ke dauraan frozen. Aapko ek async-native HTTP library chahiye (`httpx`, `aiohttp`).',
      },
    ],

    realWorld: [
      {
        en: '**FastAPI, Starlette, aiohttp, and Sanic are async web frameworks** — an `async def` endpoint that `await`s an async DB driver (`asyncpg`, `databases`) and an async HTTP client handles thousands of concurrent requests on a few threads. The rule bites in production: one accidental synchronous DB call in a hot endpoint and p99 latency collapses under load.',
        hi: '**FastAPI, Starlette, aiohttp async web frameworks hain** — ek `async def` endpoint jо ek async DB driver aur ek async HTTP client `await` karता hai kuch threads par hazaaron concurrent requests handle karता hai. Niyam production mein katता hai: ek galti se synchronous DB call aur p99 latency load mein girती hai.',
      },
      {
        en: '**Scrapers, crawlers, and API-aggregation backends use `asyncio` + `httpx`/`aiohttp`** with a `Semaphore` to cap concurrency (be nice to the target), `gather`/`TaskGroup` to fan out, and `asyncio.as_completed` to stream results. Thousands of in-flight requests on one process, where the threaded equivalent would need thousands of threads.',
        hi: '**Scrapers, crawlers, aur API-aggregation backends `asyncio` + `httpx`/`aiohttp` istemal karते hain** ek `Semaphore` ke saath concurrency cap karne ke liye, `gather`/`TaskGroup` fan out karne ke liye. Ek process par hazaaron in-flight requests.',
      },
      {
        en: '**Discord/Telegram bots, websocket servers, and real-time pipelines are asyncio-native** — long-lived connections that are mostly idle, occasionally bursting. `discord.py`, `websockets`, `aiokafka`, `redis.asyncio` are all built around the event loop. CPU-heavy handlers offload via `run_in_executor` to a process pool so the loop stays responsive.',
        hi: '**Discord/Telegram bots, websocket servers asyncio-native hain** — long-lived connections jо zyादातर idle hain. `discord.py`, `websockets`, `redis.asyncio` sab event loop ke aas-paas bane hain. CPU-heavy handlers `run_in_executor` ke zariye offload karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the asyncio model: the event loop, coroutines, and why one blocking call is catastrophic.',
        qHi: 'asyncio model samjhाओ: event loop, coroutines, aur ek blocking call vinaashkaari kyun hai.',
        a: 'asyncio runs on a single thread that runs an event loop — a scheduler holding a queue of tasks that are ready to run and a registry of things being waited on, like timers and socket readiness. The loop picks a ready task and runs its code until the task reaches an await on something that is not yet ready. At that point the task suspends, giving control back to the loop, which picks the next ready task. When a pending operation completes — a timer expires, a socket has data — the loop marks the waiting task ready and, when its turn comes, resumes it from exactly the line where it awaited. A coroutine is a function defined with async def; calling it does not run it, it produces a coroutine object that must be driven by await, by asyncio dot run, or by being wrapped in a task. await needs an awaitable — another coroutine, a Task, or a Future — and it means "pause this coroutine until that finishes, and let the loop do other work meanwhile". Because there is exactly one thread and control only ever transfers at an await point, no two pieces of your code run at once, so shared in-memory state needs no locks — a huge simplification over threads. Now the blocking-call problem. The entire system\'s concurrency depends on every task politely yielding at await whenever it would otherwise wait. If a coroutine calls something synchronous that takes real time — time dot sleep, a synchronous HTTP library like requests, a synchronous database driver, a heavy CPU loop with no await — that call does not yield. The single event-loop thread is stuck executing it, and every other task, no matter how ready, cannot run until it returns. So one slow synchronous database query in one request handler freezes every other request being served. The fixes are to use async-native libraries whose operations are real await points, or to push the blocking work off the loop with asyncio dot to_thread for I/O-ish blocking calls or loop dot run_in_executor with a process pool for CPU-bound work.',
        aHi: 'asyncio ek single thread par chalता hai jо ek event loop chalाता hai — ek scheduler jо ready-to-run tasks ki ek queue rakhता hai aur wait ki jा rahi cheezon ka ek registry. Loop ek ready task uthाता hai aur iska code chalाता hai jab tak task kisi cheez par await na maare jо abhi ready nahi. Us point par task suspend hoता hai, control loop ko wapas deता hai. Jab ek pending operation poora hoता hai, loop waiting task ko ready mark karता hai aur ise bilkul us line se resume karता hai jahaan usne await kiya. Ek coroutine async def se define kiya function hai; ise call karna ise chalाता nahi, ye ek coroutine object banाता hai jise await, asyncio dot run, ya ek task se drive karna hoga. Kyunki bilkul ek thread hai aur control sirf await point par transfer hoता hai, aapke code ke koi do hisse ek saath nahi chalते, toh shared in-memory state ko locks nahi chahiye. Blocking-call samasya: agar ek coroutine kuch synchronous call karता hai jо asli samay leता hai, wo call yield nahi karता. Single event-loop thread ise execute karne mein phas jाता hai, aur har doosra task nahi chal sakta jab tak ye return na kare. Fixes async-native libraries istemal karna ya asyncio dot to_thread se blocking kaam loop se hataना hai.',
      },
      {
        q: 'What is the difference between `await fetch()`, `asyncio.create_task(fetch())`, and `asyncio.gather(...)`?',
        qHi: '`await fetch()`, `asyncio.create_task(fetch())`, aur `asyncio.gather(...)` ke beech kya antar hai?',
        a: 'await fetch of something takes the coroutine, runs it to completion now, and gives you its return value, while suspending the current coroutine until it is done. If you write three of these in a row, they happen strictly one after another — the second fetch does not begin until the first has fully returned. That is sequential, and for independent I/O it wastes the concurrency asyncio exists to provide. asyncio dot create_task of a coroutine wraps it in a Task and schedules it on the event loop to start running immediately, concurrently with whatever you do next. It returns the Task object right away without waiting. The coroutine makes progress whenever the current code yields at an await. Later, when you need the result, you await the task, which returns its value or raises its exception. Creating several tasks and then awaiting them is how you overlap independent operations: they are all in flight at once, and the total time is roughly the slowest one rather than the sum. A subtlety is that if you create a task and never await it, and it fails, the exception can be swallowed or only surface as a warning at garbage-collection time. asyncio dot gather is a convenience that takes multiple coroutines or tasks, schedules them all to run concurrently, waits for all of them to finish, and returns their results as a list in the same order you passed them — regardless of the order they actually completed. By default, if any of them raises, that exception propagates out of gather and the rest continue running unawaited; with return_exceptions set to true, exceptions are placed into the results list instead of being raised, so you can inspect each outcome. In modern code, 3.11 and later, asyncio dot TaskGroup is often preferred over gather because it guarantees that if one task fails, the others are cancelled and the group waits for that cancellation cleanly, avoiding orphaned tasks.',
        aHi: 'await fetch coroutine ko leता hai, ise ab poora chalाता hai, aur iski return value deता hai, current coroutine ko suspend karते hue jab tak wo khatam na ho. Agar aap lगातार teen likhते ho, wo strictly ek ke baad ek hote hain — doosra fetch pehle ke poori tarah return hone tak shuru nahi hoता. Wo sequential hai. asyncio dot create_task ise ek Task mein wrap karता hai aur ise event loop par turant chalна shuru karne ko schedule karता hai, concurrently. Ye Task object turant lautाता hai bina wait kiye. Baad mein, jab aapko result chahiye, aap task ko await karते ho. Kai tasks create karके phir unhe await karna aise aap swतंत्r operations overlap karते ho. Ek sookshmता ye hai ki agar aap ek task create karते ho aur ise kabhi await nahi karते, aur ye fail hoता hai, exception nigal jाega. asyncio dot gather ek convenience hai jо kai coroutines leता hai, sabko concurrently schedule karता hai, sabke khatam hone ka wait karता hai, aur unke results ek list mein usi kram mein lautाता hai jismें aapne pass kiye. Default roop se, agar koi raise karता hai, wo exception gather se bahar propagate hoता hai; return_exceptions true ke saath, exceptions results list mein daale jाते hain.',
      },
    ],

    exercises: [
      {
        task: 'Write `async def work(name, secs)` that `await asyncio.sleep(secs)` and returns `name.upper()`. In `main()`, run `work("a", 0.2)`, `work("b", 0.2)`, `work("c", 0.2)` first sequentially (time it, ~0.6s) then via `asyncio.gather` (time it, ~0.2s). Print the two elapsed-under-threshold booleans and that `gather` returned `["A", "B", "C"]`.',
        taskHi: '`async def work(name, secs)` likhо jо `await asyncio.sleep(secs)` kare aur `name.upper()` lautае. `main()` mein, `work` ko pehle sequentially chalाओ (~0.6s) phir `asyncio.gather` ke zariye (~0.2s).',
        hint: 'Sequential: `r1 = await work("a", 0.2); r2 = await work("b", 0.2); ...`. Concurrent: `results = await asyncio.gather(work("a", 0.2), work("b", 0.2), work("c", 0.2))`. Wrap timing in `time.perf_counter()`. End with `asyncio.run(main())`.',
        hintHi: 'Sequential: `r1 = await work("a", 0.2); ...`. Concurrent: `results = await asyncio.gather(work("a", 0.2), work("b", 0.2), work("c", 0.2))`. `asyncio.run(main())` se ant karो.',
      },
      {
        task: 'Demonstrate the blocking trap. Write `async def counter()` that appends to a list every `await asyncio.sleep(0.05)` for 5 iterations. Run it as a task alongside (a) `await asyncio.sleep(0.3)` and (b) `time.sleep(0.3)`. Show that case (a) lets the counter reach 5 entries interleaved, but case (b) blocks it (0 entries until sleep returns).',
        taskHi: 'Blocking trap dikhाओ. `async def counter()` likhо jо har `await asyncio.sleep(0.05)` par ek list mein append kare, 5 iterations. Ise ek task ki tarah chalाओ (a) `await asyncio.sleep(0.3)` aur (b) `time.sleep(0.3)` ke saath.',
        hint: '`t = asyncio.create_task(counter())` then `await asyncio.sleep(0.3)` (good) vs `time.sleep(0.3)` (bad). After the bad one, `len(log)` is 0 because the loop never got control back during `time.sleep`. Clear the log between runs.',
        hintHi: '`t = asyncio.create_task(counter())` phir `await asyncio.sleep(0.3)` (achha) vs `time.sleep(0.3)` (bura). Bure ke baad, `len(log)` 0 hai. Runs ke beech log clear karो.',
      },
      {
        task: 'Use `asyncio.to_thread`. Write a blocking `slow_double(n)` that does `time.sleep(0.15)` and returns `n*2`. In `main()`, run a `heartbeat()` task that logs every 0.05s, and concurrently `await asyncio.gather(*[asyncio.to_thread(slow_double, n) for n in range(4)])`. Print the results `[0, 2, 4, 6]` and that the heartbeat kept firing (>= 3 beats).',
        taskHi: '`asyncio.to_thread` istemal karो. Ek blocking `slow_double(n)` likhो jо `time.sleep(0.15)` kare aur `n*2` lautае. `main()` mein, ek `heartbeat()` task chalाओ aur concurrently `await asyncio.gather(*[asyncio.to_thread(slow_double, n) for n in range(4)])`.',
        hint: '`asyncio.to_thread(slow_double, n)` returns an awaitable that runs `slow_double` on a thread pool thread — `time.sleep` there releases the GIL, so the loop keeps running `heartbeat`. `gather` collects `[0, 2, 4, 6]` in order.',
        hintHi: '`asyncio.to_thread(slow_double, n)` ek awaitable lautाता hai jо `slow_double` ko ek thread pool thread par chalाता hai — wahaan `time.sleep` GIL release karता hai. `gather` `[0, 2, 4, 6]` kram mein collect karता hai.',
      },
    ],

    keyTakeaways: [
      'asyncio = ONE thread running an EVENT LOOP. It runs a task until an `await` on something not ready, suspends it, runs the next ready task, resumes the first when its wait completes. Control only moves at `await` -> no locks needed for in-memory state.',
      '`async def` defines a coroutine FUNCTION; calling it returns a coroutine OBJECT that does NOTHING until awaited / `run` / wrapped in a task. `await X` needs an awaitable (coroutine, Task, Future).',
      '`asyncio.run(main())` is the entry point — call it ONCE at the top level, never inside a coroutine.',
      'Sequential: `a = await f(); b = await g()` (total = ta + tb). Concurrent: `asyncio.gather(f(), g())` or `create_task` (total ~= max). `gather` returns results IN ARGUMENT ORDER.',
      '`asyncio.create_task(coro)` schedules `coro` to run concurrently NOW and returns a Task; `await` it later. A bare `coro()` with no await/task never runs ("coroutine was never awaited").',
      'CARDINAL RULE: never run blocking code in a coroutine — `time.sleep` (use `asyncio.sleep`), `requests`/sync DB drivers (use `httpx`/`aiohttp`/`asyncpg`), heavy CPU loops. One blocking call freezes EVERY task.',
      '`await asyncio.to_thread(fn, *args)` offloads a blocking sync function to a thread; `loop.run_in_executor(process_pool, fn, ...)` sends CPU-bound work to processes.',
      '`gather` default: one exception propagates out, others keep running. `return_exceptions=True` collects exceptions as result entries. `asyncio.as_completed(tasks)` yields results as they finish.',
    ],
    keyTakeawaysHi: [
      'asyncio = EK thread jо ek EVENT LOOP chalाता hai. Ye ek task chalाता hai jab tak kisi cheez par `await` na maare jо ready nahi, ise suspend karता hai, agला ready task chalाता hai, pehle ko resume karता hai jab iska wait poora hoता hai. Control sirf `await` par move karता hai -> in-memory state ke liye koi locks nahi.',
      '`async def` ek coroutine FUNCTION define karता hai; ise call karna ek coroutine OBJECT lautाता hai jо KUCH NAHI karता jab tak await / `run` / task mein wrap na ho. `await X` ko ek awaitable chahiye.',
      '`asyncio.run(main())` entry point hai — ise EK BAAR top level par call karो, kabhi ek coroutine ke andar nahi.',
      'Sequential: `a = await f(); b = await g()` (total = ta + tb). Concurrent: `asyncio.gather(f(), g())` ya `create_task` (total ~= max). `gather` results ARGUMENT KRAM MEIN lautाता hai.',
      '`asyncio.create_task(coro)` `coro` ko ABHI concurrently chalाने ko schedule karता hai aur ek Task lautाता hai; ise baad mein `await` karो. Bina await/task ek bare `coro()` kabhi nahi chalता.',
      'MUKHYA NIYAM: ek coroutine mein kabhi blocking code mat chalाओ — `time.sleep` (`asyncio.sleep` istemal karो), `requests`/sync DB drivers, heavy CPU loops. Ek blocking call HAR task ko freeze karता hai.',
      '`await asyncio.to_thread(fn, *args)` ek blocking sync function ko ek thread par offload karता hai; `loop.run_in_executor(process_pool, fn, ...)` CPU-bound kaam processes ko bhejता hai.',
      '`gather` default: ek exception bahar propagate hoता hai, doosre chalते rehते hain. `return_exceptions=True` exceptions ko result entries ki tarah collect karता hai. `asyncio.as_completed(tasks)` results jaise wo khatam hote hain yield karता hai.',
    ],
  },

  {
    slug: 'py-async-patterns-and-pitfalls',
    title: 'async Patterns: TaskGroups, Timeouts, Cancellation, Bridging',
    titleHi: 'async Patterns: TaskGroups, Timeouts, Cancellation, Bridging',
    description: 'Once you have coroutines running concurrently, the hard questions start: what happens when one of five tasks fails, how do you put a deadline on an await, how do you cancel work cleanly, and how do you call your one synchronous library from async code without freezing the loop.',
    descriptionHi: 'Jab aapke paas coroutines concurrently chal rahe hain, kathin sawaal shuru hote hain: jab paanch tasks mein se ek fail hoता hai kya hoता hai, ek await par deadline kaise lगाओ, kaam kaise saaf cancel karो, aur async code se apni ek synchronous library kaise call karो bina loop freeze kiye.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A group expedition with a strict trip leader.** `asyncio.gather` is a loose group hike: everyone sets off, and if one person twists an ankle, the leader hears about it but the others are already scattered up the trail — you have to chase them down yourself. `asyncio.TaskGroup` is a proper roped team: the leader starts everyone, and the instant one climber is in trouble, the leader recalls the entire team, waits for everyone to regroup safely, and only then reports what went wrong. Nobody is left wandering. A **timeout** is the leader\'s watch: "we turn around at 2pm no matter where we are" — the attempt is abandoned at the deadline and raises. **Cancellation** is that recall signal itself: a task being cancelled gets a `CancelledError` raised inside it at its next `await`, which it should let propagate after doing quick cleanup — you do not get to just ignore the recall. **`to_thread`** is sending a runner back to base for a supply while the team keeps climbing: the blocking errand happens off the critical path.',
      hi: '**Ek sakht trip leader ke saath ek group expedition.** `asyncio.gather` ek dheela group hike hai: sab nikalते hain, aur agar ek vyakti ka takhna murता hai, leader sunता hai par doosre pehle se trail par bikhre hain. `asyncio.TaskGroup` ek proper roped team hai: leader sabko shuru karता hai, aur jis pal ek climber mushkil mein hai, leader poori team ko wapas bulाता hai, sabke surakshit regroup hone ka wait karता hai, aur tabhi report karता hai kya galat hua. Ek **timeout** leader ki ghadी hai: "hum 2pm par mudते hain chahe kahin bhi hon". **Cancellation** wo recall signal khud hai: ek task jise cancel kiya jा raha hai use iske agle `await` par ek `CancelledError` milता hai. **`to_thread`** ek runner ko base wapas bhejna hai ek supply ke liye jabki team chadhती rehती hai.',
    },

    simple: `**\`asyncio.TaskGroup\` (Python 3.11+) — the modern way to run tasks**

\`\`\`python
async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(fetch("a"))
        tg.create_task(fetch("b"))
        tg.create_task(fetch("c"))
    # on exit: waits for ALL tasks.
    # if ANY task raises: the rest are CANCELLED, then an ExceptionGroup is raised.
\`\`\`

vs the older \`gather\`:

\`\`\`python
results = await asyncio.gather(*coros)                      # one raise -> others keep running
results = await asyncio.gather(*coros, return_exceptions=True)   # collect errors as results
\`\`\`

**Timeouts**

\`\`\`python
# 3.11+: context manager, cancels the block at the deadline
async with asyncio.timeout(5):
    data = await slow_operation()          # raises TimeoutError after 5s

# any version: wrap a single awaitable
data = await asyncio.wait_for(slow_operation(), timeout=5)
\`\`\`

**Cancellation**

\`\`\`python
task = asyncio.create_task(long_job())
task.cancel()                              # requests cancellation
try:
    await task
except asyncio.CancelledError:
    ...                                    # the task was cancelled

# inside a coroutine, handle cleanup but RE-RAISE:
async def long_job():
    try:
        await work()
    except asyncio.CancelledError:
        await cleanup()                    # quick cleanup only
        raise                              # do NOT swallow it
\`\`\`

**Bridging sync <-> async**

\`\`\`python
# blocking sync function from async code -> offload to a thread:
result = await asyncio.to_thread(blocking_db_query, sql)

# CPU-bound work from async code -> offload to a process pool:
loop = asyncio.get_running_loop()
result = await loop.run_in_executor(pool, cpu_heavy, data)

# calling async code from sync code -> asyncio.run (top level only):
result = asyncio.run(async_main())
\`\`\`

**Limiting concurrency**

\`\`\`python
sem = asyncio.Semaphore(10)               # at most 10 concurrent
async def fetch_limited(url):
    async with sem:
        return await fetch(url)
await asyncio.gather(*[fetch_limited(u) for u in thousands_of_urls])
\`\`\`

\`\`\`
asyncio.TaskGroup()          3.11+  async with; waits for all; one failure cancels the rest -> ExceptionGroup
asyncio.timeout(secs)        3.11+  async with; raises TimeoutError at the deadline
asyncio.wait_for(aw, timeout) wrap one awaitable with a timeout
task.cancel()                request cancellation; CancelledError is raised inside the task at its next await
asyncio.CancelledError       catch ONLY to clean up, then re-raise -- never swallow
asyncio.to_thread(fn, *a)    3.9+  run blocking sync fn on a thread, await result
loop.run_in_executor(ex, fn) send work to a Thread/Process pool
asyncio.Semaphore(n)         async with sem:  -- cap concurrent tasks
async for / async with       async iterators and context managers (__aiter__/__anext__, __aenter__/__aexit__)
\`\`\``,

    simpleHi: `**\`asyncio.TaskGroup\` (Python 3.11+) — tasks chalाने ka modern tarika**

\`\`\`python
async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(fetch("a"))
        tg.create_task(fetch("b"))
    # exit par: SAARE tasks ka wait karता hai.
    # agar KOI task raise karता hai: baaki CANCEL hote hain, phir ek ExceptionGroup raise hoता hai.
\`\`\`

purane \`gather\` vs:

\`\`\`python
results = await asyncio.gather(*coros)                      # ek raise -> doosre chalते rehते hain
results = await asyncio.gather(*coros, return_exceptions=True)   # errors ko results ki tarah collect
\`\`\`

**Timeouts**

\`\`\`python
# 3.11+: context manager, deadline par block cancel karता hai
async with asyncio.timeout(5):
    data = await slow_operation()          # 5s ke baad TimeoutError raise karता hai

# koi bhi version: ek single awaitable wrap karो
data = await asyncio.wait_for(slow_operation(), timeout=5)
\`\`\`

**Cancellation**

\`\`\`python
task = asyncio.create_task(long_job())
task.cancel()                              # cancellation request karता hai
try:
    await task
except asyncio.CancelledError:
    ...

# ek coroutine ke andar, cleanup handle karो par RE-RAISE karो:
async def long_job():
    try:
        await work()
    except asyncio.CancelledError:
        await cleanup()                    # sirf quick cleanup
        raise                              # ise NIGAL mat karो
\`\`\`

**Sync <-> async bridging**

\`\`\`python
result = await asyncio.to_thread(blocking_db_query, sql)

loop = asyncio.get_running_loop()
result = await loop.run_in_executor(pool, cpu_heavy, data)

result = asyncio.run(async_main())         # sync code se async (sirf top level)
\`\`\`

**Concurrency limit karna**

\`\`\`python
sem = asyncio.Semaphore(10)               # zyada se zyada 10 concurrent
async def fetch_limited(url):
    async with sem:
        return await fetch(url)
\`\`\`

\`\`\`
asyncio.TaskGroup()          3.11+  async with; sabka wait; ek failure baaki cancel karता hai -> ExceptionGroup
asyncio.timeout(secs)        3.11+  async with; deadline par TimeoutError raise karता hai
asyncio.wait_for(aw, timeout) ek awaitable ko timeout ke saath wrap karो
task.cancel()                cancellation request; CancelledError task ke andar iske agle await par raise hoता hai
asyncio.CancelledError       SIRF cleanup ke liye catch karो, phir re-raise -- kabhi nigal mat karो
asyncio.to_thread(fn, *a)    3.9+  blocking sync fn ek thread par chalाओ
asyncio.Semaphore(n)         async with sem:  -- concurrent tasks cap karो
async for / async with       async iterators aur context managers
\`\`\``,

    content: `## \`TaskGroup\` — structured concurrency

\`gather\` has a design flaw: if one coroutine raises, the others are left running with nobody awaiting them (they become "orphan" tasks that may log errors much later or never finish). \`TaskGroup\` (3.11+) fixes this with **structured concurrency** — every task started in the group is guaranteed to be finished (completed or cancelled) by the time the \`async with\` block exits.

\`\`\`python
async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("a"))
        t2 = tg.create_task(fetch("b"))
        t3 = tg.create_task(fetch("c"))
    # here: all three are done. Access results via t1.result() etc.

    print(t1.result(), t2.result(), t3.result())
\`\`\`

If any task raises, the group **cancels all the others**, waits for them to unwind, and then raises an \`ExceptionGroup\` containing every error that occurred. Handle it with \`except*\`:

\`\`\`python
try:
    async with asyncio.TaskGroup() as tg:
        for url in urls:
            tg.create_task(fetch(url))
except* httpx.HTTPError as eg:
    for exc in eg.exceptions:
        log.warning("fetch failed: %s", exc)
except* ValueError as eg:
    ...
\`\`\`

## Timeouts

\`\`\`python
# 3.11+ -- applies to a whole block, cancels it at the deadline:
try:
    async with asyncio.timeout(2.0):
        page = await fetch(url)
        data = await parse(page)
except TimeoutError:
    data = None

# absolute deadline instead of relative:
async with asyncio.timeout_at(loop.time() + 10):
    ...

# single awaitable, any version:
data = await asyncio.wait_for(fetch(url), timeout=2.0)   # raises TimeoutError
\`\`\`

A timeout works **by cancelling** the coroutine inside it — which only takes effect at the next \`await\`. A block with no \`await\` points cannot be timed out.

## Cancellation

Cancellation is cooperative. \`task.cancel()\` schedules a \`CancelledError\` to be raised **inside** the task at its next \`await\`. The task can catch it to clean up but **must re-raise** — swallowing \`CancelledError\` breaks timeouts and \`TaskGroup\`:

\`\`\`python
async def worker():
    conn = await open_connection()
    try:
        await do_work(conn)
    except asyncio.CancelledError:
        # quick cleanup ONLY -- do not await slow things here
        raise
    finally:
        await conn.close()          # finally runs on cancellation too
\`\`\`

- \`CancelledError\` inherits from \`BaseException\` (not \`Exception\`) in 3.8+, so a bare \`except Exception\` does **not** catch it — good.
- To protect a critical section from cancellation, wrap it in \`asyncio.shield(coro)\` — but use sparingly.
- On \`asyncio.run\` shutdown, remaining tasks are cancelled and given a chance to clean up.

## Async context managers and iterators

\`\`\`python
async with httpx.AsyncClient() as client:      # __aenter__ / __aexit__
    ...

async for row in db.stream("SELECT ..."):      # __aiter__ / __anext__
    process(row)

# defining one:
class Resource:
    async def __aenter__(self): ...
    async def __aexit__(self, *exc): ...
\`\`\`

Use them whenever setup or teardown is itself I/O (opening a pooled connection, closing a session).

## Bridging sync and async

\`\`\`python
# 1. blocking I/O-ish call from async -> a thread (GIL released during the blocking wait):
rows = await asyncio.to_thread(cursor.execute, sql)

# 2. CPU-bound call from async -> a process pool (real parallelism, no loop stall):
from concurrent.futures import ProcessPoolExecutor
pool = ProcessPoolExecutor()
loop = asyncio.get_running_loop()
result = await loop.run_in_executor(pool, cpu_heavy_function, payload)

# 3. async code from a sync context -> asyncio.run, ONCE, at the top:
def cli_command():
    return asyncio.run(async_implementation())

# 4. NEVER: asyncio.run() inside a running loop -> RuntimeError
#    NEVER: loop.run_until_complete() from within a coroutine
\`\`\`

## Limiting concurrency

Unbounded \`gather\` over 10,000 URLs opens 10,000 sockets at once — you will hit file-descriptor limits or hammer the target. Gate with a semaphore:

\`\`\`python
sem = asyncio.Semaphore(20)

async def fetch_one(url):
    async with sem:                 # at most 20 coroutines past this line at a time
        return await client.get(url)

async with asyncio.TaskGroup() as tg:
    for url in urls:
        tg.create_task(fetch_one(url))
\`\`\``,

    contentHi: `## \`TaskGroup\` — structured concurrency

\`gather\` mein ek design flaw hai: agar ek coroutine raise karता hai, doosre chalte rehते hain jinhe koi await nahi karता (wo "orphan" tasks ban jाते hain). \`TaskGroup\` (3.11+) ise **structured concurrency** se theek karता hai — group mein shuru kiya har task guarantee hai ki \`async with\` block exit hone tak khatam (poora ya cancel) ho jाega.

\`\`\`python
async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("a"))
        t2 = tg.create_task(fetch("b"))
    # yahaan: teeno done. t1.result() etc. se results.
\`\`\`

Agar koi task raise karता hai, group **baaki sabko cancel karता hai**, unke unwind hone ka wait karता hai, phir har error waala ek \`ExceptionGroup\` raise karता hai. Ise \`except*\` se handle karो:

\`\`\`python
try:
    async with asyncio.TaskGroup() as tg:
        for url in urls:
            tg.create_task(fetch(url))
except* httpx.HTTPError as eg:
    for exc in eg.exceptions:
        log.warning("fetch failed: %s", exc)
\`\`\`

## Timeouts

\`\`\`python
try:
    async with asyncio.timeout(2.0):
        page = await fetch(url)
        data = await parse(page)
except TimeoutError:
    data = None

data = await asyncio.wait_for(fetch(url), timeout=2.0)   # TimeoutError raise karता hai
\`\`\`

Ek timeout coroutine ko **cancel karके** kaam karता hai — jо sirf agle \`await\` par asar karता hai.

## Cancellation

Cancellation cooperative hai. \`task.cancel()\` ek \`CancelledError\` ko task ke **andar** iske agle \`await\` par raise hone ko schedule karता hai. Task ise cleanup ke liye catch kar sakta hai par **re-raise karna chahiye**:

\`\`\`python
async def worker():
    conn = await open_connection()
    try:
        await do_work(conn)
    except asyncio.CancelledError:
        raise
    finally:
        await conn.close()
\`\`\`

- \`CancelledError\` 3.8+ mein \`BaseException\` se inherit karता hai (\`Exception\` se nahi), toh ek bare \`except Exception\` ise catch **nahi** karता.
- Ek critical section ko cancellation se bachाने ke liye, ise \`asyncio.shield(coro)\` mein wrap karो.

## Async context managers aur iterators

\`\`\`python
async with httpx.AsyncClient() as client:      # __aenter__ / __aexit__
    ...

async for row in db.stream("SELECT ..."):      # __aiter__ / __anext__
    process(row)
\`\`\`

## Sync aur async bridging

\`\`\`python
rows = await asyncio.to_thread(cursor.execute, sql)

loop = asyncio.get_running_loop()
result = await loop.run_in_executor(pool, cpu_heavy_function, payload)

def cli_command():
    return asyncio.run(async_implementation())

# KABHI NAHI: asyncio.run() ek chalte loop ke andar -> RuntimeError
\`\`\`

## Concurrency limit karna

10,000 URLs par unbounded \`gather\` ek saath 10,000 sockets kholता hai. Ek semaphore se gate karो:

\`\`\`python
sem = asyncio.Semaphore(20)

async def fetch_one(url):
    async with sem:
        return await client.get(url)
\`\`\``,

    examples: [
      {
        title: 'TaskGroup: one failure cancels the siblings and raises an ExceptionGroup',
        titleHi: 'TaskGroup: ek failure siblings ko cancel karता hai aur ek ExceptionGroup raise karता hai',
        code: `import asyncio

events = []

async def good(name, secs):
    try:
        await asyncio.sleep(secs)
        events.append(f"{name} completed")
        return name
    except asyncio.CancelledError:
        events.append(f"{name} cancelled")
        raise

async def bad():
    await asyncio.sleep(0.1)
    events.append("bad raising")
    raise ValueError("bad failed")

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(good("A", 0.05))     # finishes before bad raises
            tg.create_task(good("B", 1.0))      # still running when bad raises -> cancelled
            tg.create_task(bad())
    except* ValueError as eg:
        events.append(f"caught ExceptionGroup with {len(eg.exceptions)} error(s)")

asyncio.run(main())
for e in events:
    print(e)`,
        output: `A completed
bad raising
B cancelled
caught ExceptionGroup with 1 error(s)`,
        explain: '`A` sleeps only 0.05 s, so it logs "A completed" before anything fails. `bad` sleeps 0.1 s then raises `ValueError`. The `TaskGroup` reacts by cancelling every still-running task: `B` is mid-`await asyncio.sleep(1.0)`, so a `CancelledError` is raised there, `B` logs "B cancelled" and re-raises. Only once all tasks have finished unwinding does the `async with` block exit by raising an `ExceptionGroup` bundling the one `ValueError`, which `except* ValueError` catches. No orphan tasks are left running — that is the structured-concurrency guarantee.',
        explainHi: '`A` sirf 0.05 s sleep karता hai, toh ye kisi cheez ke fail hone se pehle "A completed" log karता hai. `bad` 0.1 s sleep karता hai phir `ValueError` raise karता hai. `TaskGroup` har abhi-chalte task ko cancel karके react karता hai: `B` `await asyncio.sleep(1.0)` ke beech mein hai, toh wahaan ek `CancelledError` raise hoता hai, `B` "B cancelled" log karता hai aur re-raise karता hai. Sirf jab saare tasks unwind ho jाते hain tabhi `async with` block ek `ExceptionGroup` raise karके exit karता hai jо `except* ValueError` pakadता hai. Koi orphan tasks chalte nahi rehते.',
      },
      {
        title: 'Timeouts with asyncio.timeout and asyncio.wait_for',
        titleHi: 'asyncio.timeout aur asyncio.wait_for ke saath timeouts',
        code: `import asyncio

async def slow(secs, value):
    await asyncio.sleep(secs)
    return value

async def main():
    # 1. block-level timeout (3.11+): the awaited op is cancelled at the deadline
    try:
        async with asyncio.timeout(0.1):
            await slow(1.0, "never")
        result1 = "completed"
    except TimeoutError:
        result1 = "timed out"

    # 2. it does NOT time out if the work finishes first
    async with asyncio.timeout(1.0):
        result2 = await slow(0.05, "in time")

    # 3. wait_for wraps a single awaitable
    try:
        result3 = await asyncio.wait_for(slow(1.0, "never"), timeout=0.1)
    except TimeoutError:
        result3 = "wait_for timed out"

    print("1:", result1)
    print("2:", result2)
    print("3:", result3)

asyncio.run(main())`,
        output: `1: timed out
2: in time
3: wait_for timed out
`,
        explain: '`async with asyncio.timeout(0.1)` starts a 0.1 s timer; when it fires, it cancels whatever is running in the block, and the `CancelledError` is translated into a `TimeoutError` that propagates out of the context manager. If the block finishes first (case 2), the timer is cancelled and nothing happens. `asyncio.wait_for(aw, timeout=)` is the single-awaitable form and works on every version. Both rely on cancellation, so both need an `await` inside to take effect.',
        explainHi: '`async with asyncio.timeout(0.1)` ek 0.1 s timer shuru karता hai; jab ye fire hoता hai, ye block mein jо bhi chal raha hai use cancel karता hai, aur `CancelledError` ek `TimeoutError` mein translate hoता hai jо context manager se bahar propagate hoता hai. Agar block pehle khatam hoता hai (case 2), timer cancel ho jाता hai. Dono cancellation par nirbhar karते hain.',
      },
      {
        title: 'Cancellation done right: clean up in finally, re-raise CancelledError',
        titleHi: 'Cancellation sahi se: finally mein cleanup, CancelledError re-raise',
        code: `import asyncio

log = []

async def job():
    log.append("job: started")
    try:
        await asyncio.sleep(10)                 # will be cancelled here
        log.append("job: finished normally")    # never reached
    except asyncio.CancelledError:
        log.append("job: got CancelledError")
        raise                                    # MUST re-raise
    finally:
        log.append("job: cleanup in finally")    # runs on cancellation

async def main():
    task = asyncio.create_task(job())
    await asyncio.sleep(0.1)                      # let job start
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        log.append("main: task confirmed cancelled")

asyncio.run(main())
for line in log:
    print(line)`,
        output: `job: started
job: got CancelledError
job: cleanup in finally
main: task confirmed cancelled
`,
        explain: 'When `task.cancel()` is called, a `CancelledError` is raised inside `job` at its current `await` (the `sleep(10)`). `job` catches it, does minimal logging, and `raise`s it again — this is required, because timeouts and `TaskGroup` rely on cancellation actually propagating. The `finally` block always runs, so it is the right place for cleanup (closing connections, releasing resources). Back in `main`, `await task` re-raises the `CancelledError`, confirming the task stopped.',
        explainHi: 'Jab `task.cancel()` call hoता hai, ek `CancelledError` `job` ke andar iske current `await` (`sleep(10)`) par raise hoता hai. `job` ise catch karता hai, minimal logging karता hai, aur ise phir `raise` karता hai — ye zaroori hai, kyunki timeouts aur `TaskGroup` cancellation ke asal mein propagate hone par nirbhar karते hain. `finally` block hamesha chalता hai, toh ye cleanup ke liye sahi jagah hai.',
      },
    ],

    mistakes: [
      {
        wrong: `async def worker():
    try:
        await long_running_thing()
    except asyncio.CancelledError:
        pass              # swallowed! -- timeouts and TaskGroup now silently do not work
    except Exception:
        log.error(...)`,
        right: `async def worker():
    try:
        await long_running_thing()
    except asyncio.CancelledError:
        await quick_cleanup()
        raise             # ALWAYS re-raise CancelledError
    except Exception:
        log.error(...)`,
        why: 'Cancellation in asyncio works by raising `CancelledError` inside the task; the machinery (timeouts, `TaskGroup`, shutdown) assumes it will propagate. Catching and swallowing it means `asyncio.timeout` never actually stops the task, a `TaskGroup` hangs waiting for a task that refuses to die, and `asyncio.run` cannot shut down cleanly. Catch it only to run fast cleanup, then re-raise — always.',
        whyHi: 'asyncio mein cancellation task ke andar `CancelledError` raise karके kaam karता hai; machinery (timeouts, `TaskGroup`, shutdown) maanती hai ki ye propagate hoga. Ise catch karके nigal jाना matlab `asyncio.timeout` kabhi asal mein task nahi rokта, ek `TaskGroup` hang hoता hai. Ise sirf fast cleanup ke liye catch karो, phir re-raise karो — hamesha.',
      },
      {
        wrong: `def get_user_sync(id):
    return asyncio.run(fetch_user(id))     # called from inside a request handler
# inside an already-running event loop -> RuntimeError: asyncio.run() cannot be called
# from a running event loop`,
        right: `# if you are already in async code, just await:
async def handler(id):
    return await fetch_user(id)

# asyncio.run is ONLY for the top-level sync entry point:
def main():
    asyncio.run(app_main())`,
        why: '`asyncio.run` creates a new event loop, runs a coroutine, and closes the loop. You cannot nest it — calling it while a loop is already running (inside any coroutine, an async web handler, a Jupyter cell) raises `RuntimeError`. From async code, use `await`. `asyncio.run` belongs exactly once, at the boundary between your synchronous \`main\`/CLI and your async code.',
        whyHi: '`asyncio.run` ek naya event loop banाता hai, ek coroutine chalाता hai, aur loop band karता hai. Aap ise nest nahi kar sakte — ise tab call karna jab ek loop pehle se chal raha hai (kisi bhi coroutine ke andar, ek async web handler) `RuntimeError` raise karता hai. Async code se, `await` istemal karो.',
      },
      {
        wrong: `# fan out to 50,000 URLs with no limit
async with asyncio.TaskGroup() as tg:
    for url in fifty_thousand_urls:
        tg.create_task(fetch(url))
# 50k sockets at once -> "Too many open files", the target server rate-limits or falls over`,
        right: `sem = asyncio.Semaphore(50)                      # tune to the target's tolerance

async def fetch_limited(url):
    async with sem:
        return await fetch(url)

async with asyncio.TaskGroup() as tg:
    for url in fifty_thousand_urls:
        tg.create_task(fetch_limited(url))`,
        why: 'Coroutines are cheap, so it is easy to create tens of thousands at once — but each in-flight request still holds a real socket / file descriptor, and the remote server has its own limits. Unbounded fan-out causes `OSError: Too many open files`, connection-pool exhaustion, or getting rate-limited / IP-banned. An `asyncio.Semaphore` caps how many are actually active at any moment.',
        whyHi: 'Coroutines saste hain, toh ek saath dus-hazaaron banाना aasaan hai — par har in-flight request ek asli socket / file descriptor hold karता hai, aur remote server ki apni limits hain. Unbounded fan-out `OSError: Too many open files` ya rate-limiting/IP-ban का kaaran banता hai. Ek `asyncio.Semaphore` cap karता hai kितने asal mein active hain.',
      },
    ],

    realWorld: [
      {
        en: '**`TaskGroup` + `except*` is the current best practice for concurrent fan-out** — fetch from N services, and if any fails, the rest are cancelled and you get one `ExceptionGroup` to handle instead of orphaned tasks logging errors minutes later. Web frameworks and job runners on 3.11+ are moving from `gather` to `TaskGroup`.',
        hi: '**`TaskGroup` + `except*` concurrent fan-out ke liye current best practice hai** — N services se fetch karो, aur agar koi fail hoता hai, baaki cancel hote hain aur aapko orphaned tasks ke bजaay handle karne ko ek `ExceptionGroup` milता hai.',
      },
      {
        en: '**`asyncio.timeout` / `wait_for` wrap every external call in a service** — a hard deadline on each DB query, HTTP call, and cache lookup so one slow dependency cannot pile up requests and exhaust the connection pool. Combined with retries and circuit breakers, this is standard resilience plumbing.',
        hi: '**`asyncio.timeout` / `wait_for` ek service mein har external call wrap karते hain** — har DB query, HTTP call par ek hard deadline taaki ek dhीmी dependency requests pile up na kare. Retries aur circuit breakers ke saath, ye standard resilience plumbing hai.',
      },
      {
        en: '**`asyncio.to_thread` / `run_in_executor` bridge the async world to sync libraries** — calling `boto3`, a synchronous DB driver, Pillow, or a legacy SDK from a FastAPI handler without blocking the loop. `run_in_executor` with a `ProcessPoolExecutor` is how an async service does occasional CPU-heavy work (PDF generation, image processing) without stalling.',
        hi: '**`asyncio.to_thread` / `run_in_executor` async duniya ko sync libraries se bridge karते hain** — ek FastAPI handler se `boto3`, ek synchronous DB driver call karna bina loop block kiye. `ProcessPoolExecutor` ke saath `run_in_executor` aise ek async service kabhi-kabhi CPU-heavy kaam karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `asyncio.TaskGroup` give you over `asyncio.gather`, and what is structured concurrency?',
        qHi: '`asyncio.TaskGroup` `asyncio.gather` par aapko kya deता hai, aur structured concurrency kya hai?',
        a: 'gather takes a set of coroutines, runs them concurrently, and returns their results in order. Its weakness is failure handling. By default, if one coroutine raises, gather propagates that one exception immediately, but the other coroutines are still running and now nobody is awaiting them — they become orphan tasks that may finish silently, log an error much later, or leak resources. Passing return_exceptions true avoids the propagation but then you must inspect every result to find failures, and the siblings still all run to completion even when the overall operation is already doomed. TaskGroup, added in 3.11, implements structured concurrency: the principle that concurrent tasks have a clear scope, and no task outlives the block that started it. You use it as an async context manager, create tasks on the group inside the block, and when the block exits, it is guaranteed that every task has finished — completed or cancelled. If any task raises, the group immediately cancels all the other tasks, waits for them to unwind their cleanup, and then raises an ExceptionGroup collecting every exception that occurred, which you handle with except-star. So there are no orphans, cleanup is deterministic, and a failure in one branch tears down the whole group instead of leaving half of it running. The mental model is that concurrency becomes a nested, block-scoped thing like a function call or a with statement, rather than fire-and-forget tasks floating around with independent lifetimes. For new code on 3.11 or later, TaskGroup is the default choice; gather is still fine for simple cases where you genuinely want all results and independent failure is acceptable.',
        aHi: 'gather coroutines ka ek set leता hai, unhe concurrently chalाता hai, aur unke results kram mein lautाता hai. Iski kamzori failure handling hai. Default roop se, agar ek coroutine raise karता hai, gather wo ek exception turant propagate karता hai, par doosre coroutines abhi bhi chal rahe hain aur ab koi unhe await nahi kar raha — wo orphan tasks ban jाते hain. TaskGroup, 3.11 mein joda, structured concurrency implement karта hai: siddhaant ki concurrent tasks ka ek spasht scope hai, aur koi task us block ko outlive nahi karता jisne ise shuru kiya. Aap ise ek async context manager ki tarah istemal karते ho, block ke andar group par tasks create karते ho, aur jab block exit hoता hai, guarantee hai ki har task khatam ho gaya. Agar koi task raise karता hai, group turant baaki saare tasks cancel karता hai, unke cleanup ka wait karता hai, phir ek ExceptionGroup raise karता hai. Toh koi orphans nahi, cleanup deterministic hai. 3.11+ par naye code ke liye, TaskGroup default chunaव hai.',
      },
      {
        q: 'How does cancellation work in asyncio, and why must you re-raise `CancelledError`?',
        qHi: 'asyncio mein cancellation kaise kaam karता hai, aur aapko `CancelledError` re-raise kyun karna chahiye?',
        a: 'Cancellation is cooperative and works through the exception system. When you call cancel on a task, asyncio does not forcibly kill it — it arranges for a CancelledError to be raised inside that task at the point where it is currently suspended, which is always an await. The next time the event loop resumes that task, the await expression raises CancelledError, and it propagates up through the coroutine like any exception: finally blocks run, context managers exit, and if nothing catches it, the task ends in the cancelled state. This is also the mechanism behind timeouts — asyncio dot timeout and wait_for cancel the coroutine when the deadline passes and convert the resulting CancelledError into a TimeoutError at the boundary. Because the whole system is built on that exception propagating, a coroutine that catches CancelledError and does not re-raise it breaks the contract. If you swallow it, the task keeps running as if nothing happened: a timeout silently fails to stop the work, a TaskGroup trying to shut down after a sibling failed hangs forever waiting for this task to finish cancelling, and asyncio dot run cannot cleanly cancel outstanding tasks at shutdown. So the rule is: you may catch CancelledError, but only to perform fast, non-blocking cleanup — and then you must raise it again. Anything slow or awaitable in that cleanup path is itself risky because it too can be cancelled. Note also that since Python 3.8 CancelledError inherits from BaseException rather than Exception, so a broad except Exception does not accidentally catch it, which is deliberate — it makes accidental swallowing less likely. The clean pattern is to put resource cleanup in a finally block, which runs on cancellation automatically, and only catch CancelledError explicitly when you have something specific and quick to do before re-raising.',
        aHi: 'Cancellation cooperative hai aur exception system ke zariye kaam karता hai. Jab aap ek task par cancel call karते ho, asyncio ise zabrदस्ती nahi maarता — ye ek CancelledError ko us task ke andar us point par raise hone ka intezaam karता hai jahaan wo abhi suspended hai, jо hamesha ek await hai. Agli baar jab event loop us task ko resume karता hai, await expression CancelledError raise karता hai, aur ye coroutine ke upar propagate hoता hai kisi bhi exception ki tarah: finally blocks chalते hain, context managers exit karते hain. Ye timeouts ke peeche bhi mechanism hai. Kyunki poora system us exception ke propagate hone par bana hai, ek coroutine jо CancelledError catch karता hai aur ise re-raise nahi karता contract todता hai. Agar aap ise nigal jाते ho, task chalता rehता hai jaise kuch hua hi nahi: ek timeout chupchaap kaam rokने mein fail hoता hai, ek TaskGroup hamesha ke liye hang hoता hai. Toh niyam: aap CancelledError catch kar sakte ho, par sirf tez, non-blocking cleanup ke liye — aur phir aapko ise phir raise karna chahiye. Saaf pattern resource cleanup ko ek finally block mein rakhna hai.',
      },
    ],

    exercises: [
      {
        task: 'Use `asyncio.TaskGroup`. Create three tasks: two that `await asyncio.sleep` and return a value, one that sleeps briefly then `raise RuntimeError("boom")`. Wrap the group in `try / except* RuntimeError as eg` and print `len(eg.exceptions)` and a message. Confirm the two good tasks got cancelled (have them log "cancelled" in an `except asyncio.CancelledError: ...; raise`).',
        taskHi: '`asyncio.TaskGroup` istemal karो. Teen tasks banाओ: do jо `await asyncio.sleep` karें aur ek value lautाएं, ek jо thodी der sleep kare phir `raise RuntimeError("boom")`. Group ko `try / except* RuntimeError as eg` mein wrap karो.',
        hint: '`async with asyncio.TaskGroup() as tg: tg.create_task(good("A", 1.0)); tg.create_task(good("B", 1.0)); tg.create_task(bad())`. `bad` sleeps 0.1s then raises. The group cancels A and B; catch `except* RuntimeError as eg`.',
        hintHi: '`async with asyncio.TaskGroup() as tg: tg.create_task(good("A", 1.0)); ...; tg.create_task(bad())`. `bad` 0.1s sleep karता hai phir raise. Group A aur B cancel karता hai.',
      },
      {
        task: 'Show three timeout behaviours: (a) `async with asyncio.timeout(0.1): await asyncio.sleep(1)` -> catch `TimeoutError`, print "timed out"; (b) same but `await asyncio.sleep(0.01)` -> completes, print "ok"; (c) `await asyncio.wait_for(asyncio.sleep(1), timeout=0.1)` -> catch `TimeoutError`. Print all three outcomes.',
        taskHi: 'Teen timeout behaviours dikhाओ: (a) `async with asyncio.timeout(0.1): await asyncio.sleep(1)` -> `TimeoutError` catch karो; (b) wahi par `await asyncio.sleep(0.01)` -> poora hoता hai; (c) `await asyncio.wait_for(asyncio.sleep(1), timeout=0.1)`.',
        hint: 'All three raise `asyncio.TimeoutError` (which is `TimeoutError`, the builtin, on 3.11+). The context-manager form applies to a whole block; `wait_for` wraps one awaitable. Both cancel the inner coroutine at the deadline.',
        hintHi: 'Teeno `asyncio.TimeoutError` raise karते hain (jо 3.11+ par builtin `TimeoutError` hai). Context-manager form ek poore block par lागू hoता hai; `wait_for` ek awaitable wrap karता hai.',
      },
      {
        task: 'Write `async def fetch_limited(url, sem)` that does `async with sem:` then `await asyncio.sleep(0.1)` and records the *current* number of coroutines inside the semaphore (track with a shared counter incremented/decremented around the sleep). Run 20 of them with `asyncio.Semaphore(5)` via a `TaskGroup`. Print the max concurrent count observed — it must be `<= 5`.',
        taskHi: '`async def fetch_limited(url, sem)` likhо jо `async with sem:` phir `await asyncio.sleep(0.1)` kare aur semaphore ke andar coroutines ki *current* sankhya record kare. 20 ko `asyncio.Semaphore(5)` ke saath ek `TaskGroup` ke zariye chalाओ. Dekha gaya max concurrent count print karो — `<= 5` hona chahiye.',
        hint: 'A module-level `active = 0` and `max_seen = 0`. Inside `async with sem:` do `active += 1; max_seen = max(max_seen, active)`, then `await asyncio.sleep(0.1)`, then `active -= 1`. No lock needed — one thread, and no `await` between the `+=` and the `max`.',
        hintHi: 'Ek module-level `active = 0` aur `max_seen = 0`. `async with sem:` ke andar `active += 1; max_seen = max(max_seen, active)`, phir `await asyncio.sleep(0.1)`, phir `active -= 1`. Koi lock nahi chahiye — ek thread.',
      },
    ],

    keyTakeaways: [
      '`asyncio.TaskGroup` (3.11+) = structured concurrency: `async with` waits for ALL tasks; if one raises, the rest are CANCELLED and an `ExceptionGroup` is raised (handle with `except*`). Prefer it over `gather` for new code.',
      '`gather` default: one exception propagates out, siblings keep running unawaited (orphans). `gather(..., return_exceptions=True)` collects exceptions as result entries.',
      'Timeouts: `async with asyncio.timeout(secs):` (3.11+, whole block) or `await asyncio.wait_for(aw, timeout=secs)` (any version, one awaitable). Both raise `TimeoutError` and work BY cancelling — need an `await` inside to take effect.',
      'Cancellation is cooperative: `task.cancel()` raises `CancelledError` inside the task at its next `await`. Catch it ONLY for fast cleanup, then ALWAYS `raise` — swallowing it breaks timeouts, `TaskGroup`, and shutdown.',
      '`CancelledError` inherits from `BaseException` (not `Exception`) since 3.8 — `except Exception` won\'t catch it. Put resource cleanup in `finally` (runs on cancellation).',
      'Bridge sync->async: `await asyncio.to_thread(blocking_fn, *args)` for blocking I/O, `loop.run_in_executor(process_pool, cpu_fn, ...)` for CPU work. Bridge async->sync: `asyncio.run()` ONCE at the top — never inside a running loop (`RuntimeError`).',
      'Async protocols: `async with` (`__aenter__`/`__aexit__`) for I/O setup/teardown, `async for` (`__aiter__`/`__anext__`) for streaming.',
      'Cap fan-out with `asyncio.Semaphore(n)` + `async with sem:` — unbounded `gather`/`TaskGroup` over thousands of URLs exhausts file descriptors and hammers the target.',
    ],
    keyTakeawaysHi: [
      '`asyncio.TaskGroup` (3.11+) = structured concurrency: `async with` SAARE tasks ka wait karता hai; agar ek raise karता hai, baaki CANCEL hote hain aur ek `ExceptionGroup` raise hoता hai (`except*` se handle karो). Naye code ke liye ise `gather` par prefer karो.',
      '`gather` default: ek exception bahar propagate hoता hai, siblings unawaited chalते rehते hain (orphans). `gather(..., return_exceptions=True)` exceptions ko result entries ki tarah collect karता hai.',
      'Timeouts: `async with asyncio.timeout(secs):` (3.11+, poora block) ya `await asyncio.wait_for(aw, timeout=secs)` (koi version, ek awaitable). Dono `TimeoutError` raise karते hain aur cancel karके kaam karते hain.',
      'Cancellation cooperative hai: `task.cancel()` task ke andar iske agle `await` par `CancelledError` raise karता hai. Ise SIRF fast cleanup ke liye catch karो, phir HAMESHA `raise` karो — ise nigalна timeouts, `TaskGroup`, aur shutdown todता hai.',
      '`CancelledError` 3.8 se `BaseException` se inherit karता hai (`Exception` se nahi) — `except Exception` ise catch nahi karega. Resource cleanup `finally` mein rakhо.',
      'Sync->async bridge: blocking I/O ke liye `await asyncio.to_thread(blocking_fn, *args)`, CPU kaam ke liye `loop.run_in_executor(process_pool, cpu_fn, ...)`. Async->sync bridge: `asyncio.run()` EK BAAR top par — kabhi ek chalte loop ke andar nahi (`RuntimeError`).',
      'Async protocols: I/O setup/teardown ke liye `async with`, streaming ke liye `async for`.',
      'Fan-out ko `asyncio.Semaphore(n)` + `async with sem:` se cap karो — hazaaron URLs par unbounded `gather`/`TaskGroup` file descriptors khatam karता hai aur target ko hammer karता hai.',
    ],
  },

  {
    slug: 'py-performance-gc-profiling',
    title: 'Performance: Measure First, the GC, and Real Speedups',
    titleHi: 'Performance: Pehle Measure Karो, GC, Aur Asli Speedups',
    description: 'The instinct on "this is slow" is to guess — cache this, rewrite that in C, add threads. The professional move is to measure: `timeit` for micro-comparisons, `cProfile` to find the actual hot function, `tracemalloc` for memory. Nine times out of ten the bottleneck is not where you thought.',
    descriptionHi: '"Ye slow hai" par pravृtti anumaan lगाना hai — ise cache karो, use C mein rewrite karो, threads jodो. Professional kaदम measure karna hai: micro-comparisons ke liye `timeit`, asli hot function dhoondhने ke liye `cProfile`, memory ke liye `tracemalloc`. Das mein se nau baar bottleneck wahaan nahi jahaan aapne socha.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Fixing traffic by standing at the actual jam, not the one you assume.** A city that "feels congested" does not widen a random road — it puts sensors on every junction for a week, finds that 80% of the delay is one badly-timed light, and fixes that one thing. Guessing would have spent the whole budget repaving a road that was already flowing. Profiling is those sensors: `cProfile` counts how many times each function is called and how much total time is spent inside it, so you find the one light causing the jam. `timeit` is a stopwatch for a single manoeuvre repeated many times, to fairly compare two ways of doing one small thing. `tracemalloc` is the parking survey — where is all the memory actually being held. The **garbage collector** is the street-cleaning crew: Python frees most objects the instant their last reference goes away (reference counting), and a separate periodic sweep (`gc`) catches the harder cases — groups of objects that all reference each other in a ring so none of their counts ever hit zero, even though nothing outside points at the ring.',
      hi: '**Traffic theek karna asli jam par khadे hokर, us par nahi jise aap maanते ho.** Ek shehar jо "congested feel karता hai" ek random road chaudा nahi karता — ye har junction par ek hafte sensors lगाता hai, paता hai ki 80% delay ek kharaab-timed light hai, aur us ek cheez ko theek karता hai. Profiling wo sensors hain: `cProfile` ginता hai ki har function kितनी baar call hua aur iske andar kितna total samay bitा. `timeit` ek single manoeuvre ke liye ek stopwatch hai jо kai baar repeat hoता hai. `tracemalloc` parking survey hai. **Garbage collector** street-cleaning crew hai: Python adhikaansh objects ko us pal free karता hai jab unka aakhri reference chala jाता hai (reference counting), aur ek alag periodic sweep (`gc`) kathin cases pakadता hai — objects ke groups jо sab ek ring mein ek doosre ko reference karते hain.',
    },

    simple: `**Rule 0: measure before you optimise**

\`\`\`python
# timeit -- fair micro-benchmark (many runs, best-of, disables GC noise)
import timeit
t_list = timeit.timeit("[i*i for i in range(1000)]", number=10_000)
t_map  = timeit.timeit("list(map(lambda i: i*i, range(1000)))", number=10_000)

# perf_counter -- time a real block once
import time
start = time.perf_counter()
do_the_thing()
print(f"{time.perf_counter() - start:.3f}s")
\`\`\`

**cProfile -- find the actual hot spot**

\`\`\`python
import cProfile, pstats

cProfile.run("main()", "profile.out")
stats = pstats.Stats("profile.out")
stats.sort_stats("cumulative").print_stats(10)   # top 10 by cumulative time

# or from the shell:  python -m cProfile -s tottime myscript.py
\`\`\`

\`\`\`
   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
     1000    2.100    0.002    3.400    0.003 app.py:42(parse_row)      <- the hot one
    50000    0.800    0.000    0.800    0.000 {method 'split' of 'str'}
\`\`\`

**tracemalloc -- where memory goes**

\`\`\`python
import tracemalloc
tracemalloc.start()
build_big_structure()
current, peak = tracemalloc.get_traced_memory()
print(f"current={current/1e6:.1f}MB  peak={peak/1e6:.1f}MB")
for stat in tracemalloc.take_snapshot().statistics("lineno")[:5]:
    print(stat)
\`\`\`

**Reference counting + the cycle collector**

\`\`\`python
import sys, gc

x = []
print(sys.getrefcount(x))       # count (transiently +1 for the argument)

# most objects: freed IMMEDIATELY when the last reference goes away (no GC pause)
# cycles: a <-> b reference each other -> refcount never hits 0 -> the gc module collects them
a = {}; b = {}; a["b"] = b; b["a"] = a
del a, b
gc.collect()                    # reclaims the cycle
\`\`\`

**Concrete speedups (after profiling says so)**

\`\`\`
- right data structure: set/dict membership O(1) vs list O(n); collections.deque for queues
- don't build strings with += in a loop -> "".join(parts)
- hoist attribute/global lookups out of hot loops into locals
- comprehension / generator > manual append loop
- functools.lru_cache on pure expensive functions
- bisect for sorted-list search/insert
- batch I/O and DB calls (one query, not N)
- for arrays of numbers: NumPy (vectorised, releases the GIL, C speed)
- only then: Cython / C extension / PyPy / Rust (pyo3)
\`\`\``,

    simpleHi: `**Niyam 0: optimise karne se pehle measure karो**

\`\`\`python
# timeit -- fair micro-benchmark
import timeit
t_list = timeit.timeit("[i*i for i in range(1000)]", number=10_000)
t_map  = timeit.timeit("list(map(lambda i: i*i, range(1000)))", number=10_000)

# perf_counter -- ek asli block ek baar time karो
import time
start = time.perf_counter()
do_the_thing()
print(f"{time.perf_counter() - start:.3f}s")
\`\`\`

**cProfile -- asli hot spot dhoondhो**

\`\`\`python
import cProfile, pstats

cProfile.run("main()", "profile.out")
stats = pstats.Stats("profile.out")
stats.sort_stats("cumulative").print_stats(10)

# ya shell se:  python -m cProfile -s tottime myscript.py
\`\`\`

\`\`\`
   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
     1000    2.100    0.002    3.400    0.003 app.py:42(parse_row)      <- hot wala
\`\`\`

**tracemalloc -- memory kahaan jाता hai**

\`\`\`python
import tracemalloc
tracemalloc.start()
build_big_structure()
current, peak = tracemalloc.get_traced_memory()
print(f"current={current/1e6:.1f}MB  peak={peak/1e6:.1f}MB")
\`\`\`

**Reference counting + cycle collector**

\`\`\`python
import sys, gc

# adhikaansh objects: aakhri reference jaate hi TURANT free (koi GC pause nahi)
# cycles: a <-> b ek doosre ko reference karते hain -> refcount kabhi 0 nahi -> gc module unhe collect karता hai
a = {}; b = {}; a["b"] = b; b["a"] = a
del a, b
gc.collect()                    # cycle reclaim karता hai
\`\`\`

**Concrete speedups (profiling ke kehne ke baad)**

\`\`\`
- sahi data structure: set/dict membership O(1) vs list O(n); queues ke liye collections.deque
- ek loop mein += se strings mat banाओ -> "".join(parts)
- hot loops se attribute/global lookups locals mein hoist karो
- comprehension / generator > manual append loop
- pure mehngे functions par functools.lru_cache
- sorted-list search/insert ke liye bisect
- I/O aur DB calls batch karो (ek query, N nahi)
- numbers ke arrays ke liye: NumPy (vectorised, GIL release, C speed)
- tabhi: Cython / C extension / PyPy / Rust (pyo3)
\`\`\``,

    content: `## The optimisation process

1. **Confirm it is actually too slow** — against a real requirement, with realistic data. "Feels slow" is not a number.
2. **Profile to find the hot spot** — \`cProfile\` on the whole run, or \`timeit\` to compare two candidate snippets. Do not trust your intuition about which line is slow.
3. **Fix the top one or two items** — usually an algorithm or data-structure change, not micro-tweaks.
4. **Re-measure** — confirm the fix helped and did not move the bottleneck somewhere worse.
5. **Stop when it is fast enough** — not when it is maximally fast.

## \`timeit\`

\`\`\`python
import timeit

# string form (runs in a fresh namespace; use setup= for imports/data):
timeit.timeit("f(x)", setup="from __main__ import f, x", number=100_000)

# callable form:
timeit.timeit(lambda: f(x), number=100_000)

# repeat gives you several samples -- take the MIN (least noise), not the mean:
min(timeit.repeat("f(x)", setup=..., repeat=5, number=100_000))
\`\`\`

\`timeit\` disables the cycle GC during the run and picks a sensible loop count. Compare *relative* numbers; absolute times vary by machine.

## \`cProfile\` + \`pstats\`

\`\`\`bash
python -m cProfile -s tottime myscript.py      # sort by time IN the function itself
python -m cProfile -s cumtime -o out.prof myscript.py
\`\`\`

\`\`\`python
import cProfile, pstats

with cProfile.Profile() as pr:
    main()
pstats.Stats(pr).sort_stats("cumulative").print_stats(15)
\`\`\`

Columns:
- **ncalls** — how many times it was called
- **tottime** — total time spent *in this function*, excluding sub-calls (find the real work)
- **cumtime** — total time in this function *including* everything it called (find the expensive call trees)

Sort by \`tottime\` to find where CPU actually goes; sort by \`cumtime\` to find which high-level operation is expensive. For line-level detail use the third-party \`line_profiler\` (\`@profile\` + \`kernprof\`).

## \`tracemalloc\`

\`\`\`python
import tracemalloc
tracemalloc.start()

snapshot1 = tracemalloc.take_snapshot()
run_suspect_code()
snapshot2 = tracemalloc.take_snapshot()

for stat in snapshot2.compare_to(snapshot1, "lineno")[:10]:
    print(stat)          # shows +N KiB at file:line -- the lines that allocated
\`\`\`

The standard tool for finding memory growth and leaks (usually a cache or list that is never trimmed).

## How Python manages memory

**Reference counting** is the primary mechanism. Every object has a counter of how many references point to it. \`x = []\` -> count 1. \`y = x\` -> count 2. \`del x\` -> count 1. When it reaches 0, the object is freed **immediately** — no waiting for a GC pass. This makes memory use predictable and pauses rare.

**The cycle collector** (\`gc\` module) handles what refcounting cannot: **reference cycles**. If \`a\` references \`b\` and \`b\` references \`a\`, then even after you \`del a, b\` from the outside, each still has a refcount of 1 (from the other), so neither is freed. The \`gc\` runs periodically, finds groups of objects that reference only each other and are unreachable from the program, and frees them.

\`\`\`python
import gc

gc.collect()             # force a collection now -> returns the number of objects freed
gc.disable()             # turn off the cyclic collector (refcounting still works)
gc.freeze()              # move current objects out of GC's view (call after startup/import)
gc.get_count()           # (gen0, gen1, gen2) allocation counters
\`\`\`

**When to touch \`gc\`:** almost never. Two real cases: (1) in a latency-sensitive service, \`gc.disable()\` plus manual \`gc.collect()\` at idle moments removes unpredictable pauses (you must be sure you have no leaking cycles); (2) \`gc.freeze()\` right after imports, before forking workers, keeps the shared pages clean (copy-on-write friendliness). Avoid cycles instead: use \`weakref\` for back-references (parent/child, observer, caches).

## Concrete speedups, in rough order of payoff

\`\`\`python
# 1. algorithm / data structure -- the big wins
if x in big_list:          # O(n)   ->   if x in big_set:            # O(1)
result = []                              from collections import deque
for ...: result.insert(0, x)   # O(n)  ->  dq.appendleft(x)          # O(1)
repeatedly search sorted data  ->  bisect.bisect_left / insort

# 2. don't do obviously wasteful work
s = ""
for p in parts: s += p     # O(n^2) copies   ->   s = "".join(parts)
json.loads once, not per-row; compile a regex once; one DB query, not N (the N+1 problem)

# 3. cache pure expensive calls
from functools import lru_cache
@lru_cache(maxsize=1024)
def expensive(key): ...

# 4. micro: hoist lookups in a hot loop
append = result.append       # local, not result.append each iteration
_sqrt = math.sqrt

# 5. numeric arrays -> NumPy (C speed, vectorised, releases the GIL)
import numpy as np
arr = np.array(data); arr = arr * 2 + 1        # no Python loop

# 6. last resort: Cython, a C/Rust extension, PyPy, a process pool
\`\`\``,

    contentHi: `## Optimisation prakriya

1. **Confirm karो ki ye sachmuch bahut slow hai** — ek asli requirement ke khilaaf, realistic data ke saath.
2. **Hot spot dhoondhने ke liye profile karो** — poore run par \`cProfile\`, ya do candidate snippets compare karne ke liye \`timeit\`.
3. **Top ek ya do items theek karो** — aksar ek algorithm ya data-structure badlaav.
4. **Phir se measure karो** — confirm karो ki fix ne madad ki.
5. **Ruk jाओ jab ye kaafi tez hai** — jab ye maximally tez hai tab nahi.

## \`timeit\`

\`\`\`python
import timeit

timeit.timeit("f(x)", setup="from __main__ import f, x", number=100_000)
timeit.timeit(lambda: f(x), number=100_000)

# repeat kai samples deता hai -- MIN lो (sabse kam noise), mean nahi:
min(timeit.repeat("f(x)", setup=..., repeat=5, number=100_000))
\`\`\`

## \`cProfile\` + \`pstats\`

\`\`\`bash
python -m cProfile -s tottime myscript.py
python -m cProfile -s cumtime -o out.prof myscript.py
\`\`\`

Columns:
- **ncalls** — kितनी baar call hua
- **tottime** — *is function mein* bitा total samay, sub-calls chhodकर
- **cumtime** — is function mein total samay jо iske dwara call kiya sab *shaamil karके*

\`tottime\` se sort karो CPU kahaan jाता hai dhoondhने ko; \`cumtime\` se sort karो kaunsा high-level operation mehnga hai.

## \`tracemalloc\`

\`\`\`python
import tracemalloc
tracemalloc.start()

snapshot1 = tracemalloc.take_snapshot()
run_suspect_code()
snapshot2 = tracemalloc.take_snapshot()

for stat in snapshot2.compare_to(snapshot1, "lineno")[:10]:
    print(stat)
\`\`\`

## Python memory kaise manage karता hai

**Reference counting** primary mechanism hai. Har object ke paas ek counter hai kितने references ise point karते hain. \`x = []\` -> count 1. \`del x\` -> count 0 -> object **turant** free hoता hai — koi GC pass ka wait nahi.

**Cycle collector** (\`gc\` module) wo handle karता hai jо refcounting nahi kar sakta: **reference cycles**. Agar \`a\` \`b\` ko reference karता hai aur \`b\` \`a\` ko, toh \`del a, b\` ke baad bhi, har ek ka refcount 1 hai (doosre se), toh koi free nahi hoता. \`gc\` samay-samay par chalता hai.

\`\`\`python
import gc

gc.collect()             # ab ek collection force karो -> free kiye objects ki sankhya
gc.disable()             # cyclic collector band karो (refcounting abhi bhi kaam karता hai)
gc.freeze()              # current objects ko GC ke view se bahar move karो
\`\`\`

**\`gc\` ko kab chhuना:** lगbhag kabhi nahi. Do asli cases: (1) ek latency-sensitive service mein, \`gc.disable()\` + manual \`gc.collect()\` idle par unpredictable pauses hataता hai; (2) imports ke turant baad \`gc.freeze()\`, workers fork karne se pehle. Iske bजाय cycles se bachо: back-references ke liye \`weakref\` istemal karो.

## Concrete speedups, payoff ke mote kram mein

\`\`\`python
# 1. algorithm / data structure -- badे jeet
if x in big_list:          # O(n)   ->   if x in big_set:            # O(1)
for ...: result.insert(0, x)   # O(n)  ->  dq.appendleft(x)          # O(1)

# 2. spasht roop se barbaad kaam mat karो
for p in parts: s += p     # O(n^2)   ->   s = "".join(parts)
ek DB query, N nahi (N+1 samasya)

# 3. pure mehngे calls cache karो
from functools import lru_cache
@lru_cache(maxsize=1024)
def expensive(key): ...

# 4. micro: ek hot loop mein lookups hoist karो
append = result.append

# 5. numeric arrays -> NumPy (C speed, vectorised, GIL release)

# 6. last resort: Cython, ek C/Rust extension, PyPy, ek process pool
\`\`\``,

    examples: [
      {
        title: 'timeit: comparing approaches fairly',
        titleHi: 'timeit: approaches ko fairly compare karna',
        code: `import timeit

setup = "data = list(range(2000))"

# four ways to build a list of squares
loop = min(timeit.repeat(
    "out = []\\nfor x in data: out.append(x*x)", setup=setup, repeat=5, number=2000))
comp = min(timeit.repeat(
    "[x*x for x in data]", setup=setup, repeat=5, number=2000))
mp = min(timeit.repeat(
    "list(map(lambda x: x*x, data))", setup=setup, repeat=5, number=2000))

# string building: += vs join
setup2 = "parts = [str(i) for i in range(2000)]"
plus = min(timeit.repeat(
    "s = ''\\nfor p in parts: s += p", setup=setup2, repeat=5, number=2000))
join = min(timeit.repeat(
    "''.join(parts)", setup=setup2, repeat=5, number=2000))

print("comprehension faster than manual loop?", comp < loop)
print("comprehension faster than map+lambda?  ", comp < mp)
print("''.join faster than += in a loop?      ", join < plus)
print("join speedup is large (>3x)?           ", plus / join > 3)`,
        output: `comprehension faster than manual loop? True
comprehension faster than map+lambda?   True
''.join faster than += in a loop?       True
join speedup is large (>3x)?            True
`,
        explain: 'A list comprehension beats an explicit `append` loop (no repeated attribute lookup, optimised bytecode) and beats `map` with a `lambda` (the lambda adds a Python-level call per item). For strings, `+=` in a loop is O(n^2) because each concatenation copies the whole accumulated string, while `"".join(parts)` sizes the buffer once and copies each part once — reliably several times faster and the gap widens with size. `timeit.repeat(..., repeat=5)` then `min(...)` reports the least-noisy sample.',
        explainHi: 'Ek list comprehension ek explicit `append` loop ko harाता hai (koi repeated attribute lookup nahi) aur `lambda` ke saath `map` ko harाता hai. Strings ke liye, ek loop mein `+=` O(n^2) hai kyunki har concatenation poori accumulated string copy karता hai, jabki `"".join(parts)` buffer ek baar size karता hai. `timeit.repeat(..., repeat=5)` phir `min(...)` sabse kam-noisy sample report karता hai.',
      },
      {
        title: 'cProfile: the hot function is not always the obvious one',
        titleHi: 'cProfile: hot function hamesha spasht wala nahi hoता',
        code: `import cProfile, pstats

def cheap_but_frequent(x):
    return x % 7

def expensive_but_rare(data):
    return sorted(data, reverse=True)[:5]

def process(rows):
    total = 0
    for r in rows:
        for _ in range(200):
            total += cheap_but_frequent(r)     # called 200 * len(rows) times
    top = expensive_but_rare(list(rows))        # called once per process()
    return total, top

pr = cProfile.Profile()
pr.enable()
for _ in range(50):
    process(list(range(500)))
pr.disable()

# read the stats dict directly (deterministic) instead of the formatted text:
# each value is (primitive_calls, total_calls, tottime, cumtime, callers)
counts = {}
for (fname, lineno, func), value in pstats.Stats(pr).stats.items():
    if func in ("cheap_but_frequent", "expensive_but_rare"):
        counts[func] = value[1]

print("cheap_but_frequent ncalls:", counts["cheap_but_frequent"])
print("expensive_but_rare ncalls:", counts["expensive_but_rare"])
print("cheap called 100000x more often?",
      counts["cheap_but_frequent"] == counts["expensive_but_rare"] * 100_000)`,
        output: `cheap_but_frequent ncalls: 5000000
expensive_but_rare ncalls: 50
cheap called 100000x more often? True
`,
        explain: '`cheap_but_frequent` does almost nothing — one modulo — but the profiler counted 5,000,000 calls (200 x 500 x 50), so it dominates `tottime` (time spent in the function itself). `expensive_but_rare` does more work per call but runs only 50 times, so it barely registers. This is the classic profiling lesson: total cost = per-call cost x call count, and the call count is the part you usually underestimate. Reading `pstats.Stats(pr).stats` directly — a dict keyed by `(file, line, func)` with `(cc, nc, tottime, cumtime, callers)` values — avoids parsing the human-formatted table. The fix here is to cut the number of calls (vectorise the inner loop), not to speed up the one-line body.',
        explainHi: '`cheap_but_frequent` lगbhag kuch nahi karता — ek modulo — par profiler ne 5,000,000 calls gine (200 x 500 x 50), toh ye `tottime` par haावी hai. `expensive_but_rare` prati call zyada kaam karता hai par sirf 50 baar chalता hai. Classic profiling sabak: total cost = per-call cost x call count, aur call count wo hissa hai jise aap aksar kam aankते ho. `pstats.Stats(pr).stats` ko seedhe padhna — ek dict jiski keys `(file, line, func)` aur values `(cc, nc, tottime, cumtime, callers)` hain — human-formatted table parse karne se bachता hai.',
      },
      {
        title: 'Reference counting frees immediately; cycles need gc.collect()',
        titleHi: 'Reference counting turant free karता hai; cycles ko gc.collect() chahiye',
        code: `import gc, weakref

# 1. no cycle: the object is freed the instant the last reference goes
freed = []
class Tracked:
    def __init__(self, tag): self.tag = tag
    def __del__(self): freed.append(self.tag)

obj = Tracked("A")
ref = obj
del obj
print("after del obj (ref still holds it):", freed)   # []
del ref
print("after del ref (refcount now 0):    ", freed)    # ['A'] -- freed immediately, no gc call

# 2. a reference cycle: refcount never reaches 0 on its own
gc.collect()                        # clean slate
a = Tracked("cycle-a")
b = Tracked("cycle-b")
a.partner = b
b.partner = a                       # a <-> b
del a, b
print("after del a, b (cycle):        ", [f for f in freed if "cycle" in f])   # [] -- still alive!
collected = gc.collect()            # the cyclic collector reclaims them
print("after gc.collect():            ", sorted(f for f in freed if "cycle" in f))

# 3. weakref avoids keeping the target alive
target = Tracked("weak-target")
w = weakref.ref(target)
print("weakref alive?", w() is not None)
del target
print("weakref dead after del?", w() is None)`,
        output: `after del obj (ref still holds it): []
after del ref (refcount now 0):     ['A']
after del a, b (cycle):         []
after gc.collect():             ['cycle-a', 'cycle-b']
weakref alive? True
weakref dead after del? True
`,
        explain: 'Case 1: `obj` and `ref` both point at the same `Tracked("A")`. `del obj` drops the count to 1, so nothing is freed and `__del__` has not run. `del ref` drops it to 0 and the object is deallocated *immediately and synchronously* — `__del__` appends `"A"` right there, with no garbage-collector involvement. Case 2: `a` and `b` reference each other, so after `del a, b` each still has a refcount of 1 (held by the other) — the objects are unreachable but refcounting alone cannot free them, and `freed` stays empty. `gc.collect()` runs the cyclic collector, which detects the unreachable `a`<->`b` cycle and frees both. Case 3: `weakref.ref(target)` does not raise the target\'s refcount, so `del target` frees it and `w()` returns `None` — the idiomatic way to hold a reference without keeping the object alive.',
        explainHi: 'Case 1: `obj` aur `ref` dono ek hi `Tracked("A")` ko point karते hain. `del obj` count ko 1 par le jाता hai, toh kuch free nahi hoता. `del ref` ise 0 par le jाता hai aur object *turant aur synchronously* deallocate hoता hai — `__del__` wahीं `"A"` append karता hai, bina kisi garbage-collector ke. Case 2: `a` aur `b` ek doosre ko reference karते hain, toh `del a, b` ke baad har ek ka abhi bhi refcount 1 hai (doosre dwara) — objects unreachable hain par sirf refcounting unhe free nahi kar sakti. `gc.collect()` cyclic collector chalाता hai jо unreachable `a`<->`b` cycle detect karता hai aur dono free karता hai. Case 3: `weakref.ref(target)` target ka refcount nahi badhाता, toh `del target` ise free karता hai aur `w()` `None` lautाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "the loop is slow, I'll rewrite the math in C"
def process(items):
    result = []
    for x in items:
        if x in already_seen_list:     # <-- O(n) scan, called for every item -> O(n^2)
            continue
        already_seen_list.append(x)
        result.append(transform(x))
    return result`,
        right: `def process(items):
    result = []
    already_seen = set()               # O(1) membership
    for x in items:
        if x in already_seen:
            continue
        already_seen.add(x)
        result.append(transform(x))
    return result`,
        why: 'Before reaching for C, profile — the bottleneck is almost always an algorithm or data-structure problem, not the language. Here `x in already_seen_list` is a linear scan on every iteration, making the whole function quadratic. Switching the membership check to a `set` makes it linear overall, typically a far bigger speedup than any micro-optimisation or C rewrite, for one line changed.',
        whyHi: 'C ke liye pahुँchने se pehle, profile karो — bottleneck lगbhag hamesha ek algorithm ya data-structure samasya hai, bhaasha nahi. Yahaan `x in already_seen_list` har iteration par ek linear scan hai, poore function ko quadratic banाता hai. Membership check ko ek `set` par switch karna ise overall linear banाता hai.',
      },
      {
        wrong: `import gc
gc.disable()          # "GC is slow, turn it off" -- added globally, forgotten
# ... app creates reference cycles (linked structures, caches with back-refs) ...
# -> memory grows without bound because cycles are never collected`,
        right: `# leave GC enabled unless you have MEASURED a pause problem AND verified no leaking cycles.
# to reduce cycles, use weakref for back-references:
import weakref
class Node:
    def __init__(self, parent=None):
        self._parent = weakref.ref(parent) if parent else None   # does not create a cycle
    @property
    def parent(self):
        return self._parent() if self._parent else None`,
        why: 'Disabling the cyclic GC does not stop memory management — reference counting still frees the vast majority of objects immediately. But any object that participates in a reference cycle (a tree with parent pointers, an observer holding a reference back to its subject, an lru_cache of objects that reference the cache) will now never be freed, and memory grows forever. Only disable GC with a specific measured reason and confidence that your code creates no uncollected cycles; otherwise use `weakref` to break cycles at the source.',
        whyHi: 'Cyclic GC disable karna memory management nahi rokта — reference counting abhi bhi adhikaansh objects turant free karता hai. Par koi bhi object jо ek reference cycle mein bhaag leता hai ab kabhi free nahi hoga, aur memory hamesha ke liye badhती hai. GC ko sirf ek specific measured kaaran ke saath disable karो; warna cycles ko source par todне ke liye `weakref` istemal karो.',
      },
      {
        wrong: `# optimising by vibes -- no measurement
def slow_report():
    data = load()                  # actually 95% of the time (a slow query)
    summary = summarise(data)       # 3%
    return format_html(summary)     # 2%

# ...spends a week making format_html 2x faster. Total improvement: 1%.`,
        right: `import cProfile, pstats
with cProfile.Profile() as pr:
    slow_report()
pstats.Stats(pr).sort_stats("cumulative").print_stats(10)
# -> load() is 95% -> fix the query (add an index, select fewer columns, cache)`,
        why: 'Optimising without profiling means optimising the wrong thing. Amdahl\'s law: if a part is 2% of the runtime, making it infinitely fast saves 2%. The profile almost always shows the cost concentrated in one or two places you did not expect (a query, a serialisation, an accidental N+1, a regex). Measure, fix the top item, re-measure.',
        whyHi: 'Bina profiling optimise karna matlab galat cheez optimise karna. Amdahl ka niyam: agar ek hissa runtime ka 2% hai, ise anant tez banाना 2% bachाता hai. Profile lगbhag hamesha dikhाता hai ki cost ek ya do jagah केंद्रित hai jinki aapne ummeed nahi ki. Measure karो, top item theek karो, phir se measure karो.',
      },
    ],

    realWorld: [
      {
        en: '**`cProfile` + `snakeviz` (or `py-spy` for a running process) is the standard first step on any "why is this slow" ticket** — profile the real workload, read the flame graph, find that 80% is in one function or one query. `py-spy` attaches to a live production process with no code change and no restart.',
        hi: '**`cProfile` + `snakeviz` (ya ek chalte process ke liye `py-spy`) kisi bhi "ye slow kyun hai" ticket par standard pehla kaदम hai** — asli workload profile karो, flame graph padhо, paता hai ki 80% ek function ya ek query mein hai. `py-spy` bina code badlaav ek live production process se attach hoता hai.',
      },
      {
        en: '**`functools.lru_cache` and the right data structure are the two most common real fixes** — memoising a pure parsing/validation/lookup function, swapping a repeated `list` membership test for a `set`, using `dict` for grouping instead of nested loops, `collections.Counter` / `defaultdict` to remove manual accumulation. Usually 10–100x for a few lines.',
        hi: '**`functools.lru_cache` aur sahi data structure do sabse aam asli fixes hain** — ek pure parsing/validation function memoise karna, ek repeated `list` membership test ko `set` se badalna, grouping ke liye `dict` istemal karna. Aksar kuch lines ke liye 10–100x.',
      },
      {
        en: '**NumPy / pandas / Polars for anything that is a loop over numbers** — replacing a Python `for` loop doing arithmetic with a vectorised array operation is routinely 50–200x and releases the GIL so a thread pool can stack more speedup. Data teams reach for this before any C-level work; `numba`\'s `@njit` is the next step for loops that do not vectorise cleanly.',
        hi: '**NumPy / pandas / Polars kisi bhi cheez ke liye jо numbers par ek loop hai** — arithmetic karता ek Python `for` loop ko ek vectorised array operation se badalna routinely 50–200x hai aur GIL release karता hai. Data teams kisi bhi C-level kaam se pehle iske liye pahुँchते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Python manage memory — reference counting vs the garbage collector — and when would you touch the `gc` module?',
        qHi: 'Python memory kaise manage karता hai — reference counting vs garbage collector — aur aap `gc` module ko kab chhuोge?',
        a: 'CPython uses two mechanisms. The primary one is reference counting: every object carries a count of how many references currently point to it. Binding it to a name, putting it in a list, passing it as an argument all increment the count; rebinding, del, leaving a scope, removing it from a container all decrement it. The instant the count hits zero, the object is deallocated immediately and its own references are decremented in turn, possibly freeing more objects in a cascade. This is why Python memory usage is fairly predictable and why there are usually no noticeable collection pauses — most garbage is reclaimed the moment it becomes unreachable, synchronously. Reference counting has one blind spot: cycles. If object A holds a reference to B and B holds one back to A, then even when nothing else in the program refers to either, each still has a nonzero count because of the other, so neither is ever freed by refcounting alone. That is what the second mechanism, the cyclic garbage collector in the gc module, exists for. It runs periodically, triggered by allocation counts, and it is generational — new objects are checked often, objects that survive several collections are checked less. It finds groups of objects that reference only each other and are unreachable from the program roots, and frees them. As for touching the gc module: the honest answer is almost never in application code. The two legitimate cases are, first, a latency-sensitive service where you have measured that GC pauses cause tail-latency spikes — there you might call gc dot disable and instead trigger gc dot collect manually during idle periods, but only after verifying your code does not accumulate uncollected cycles, or the process will leak. Second, calling gc dot freeze right after imports and before forking worker processes, so that the interpreter\'s startup objects are moved out of the GC\'s consideration and stay on shared copy-on-write pages rather than being dirtied by a collection in each child. The better habit is to not create cycles in the first place: use weakref for parent pointers, observer back-references, and caches, so the structures stay collectable by refcounting.',
        aHi: 'CPython do mechanisms istemal karता hai. Primary reference counting hai: har object ek count rakhता hai kितne references abhi ise point karते hain. Ise ek naam se bind karna, ek list mein daalна, ek argument ki tarah pass karna sab count badhाते hain; rebind, del, ek scope chhodना sab ise ghटाते hain. Jis pal count zero par pahुँchता hai, object turant deallocate hoता hai. Isiliye Python memory usage kaafi predictable hai aur aksar koi noticeable collection pauses nahi. Reference counting ka ek blind spot hai: cycles. Agar A B ko reference karता hai aur B wapas A ko, toh jab kuch aur dono ko reference nahi karता, har ek ka abhi bhi nonzero count hai. Yahi doosra mechanism, gc module mein cyclic garbage collector, ke liye hai. Ye samay-samay par chalता hai, generational hai. gc module ko chhuना: imaandaar jawaab lगbhag kabhi nahi. Do vaidh cases: pehla, ek latency-sensitive service jahaan aapne maapा hai ki GC pauses tail-latency spikes ka kaaran hain; doosra, imports ke turant baad gc dot freeze call karna workers fork karne se pehle. Behtar aadat cycles bilkul na banाna hai: weakref istemal karो.',
      },
      {
        q: 'Walk through how you would investigate and fix a function that is "too slow".',
        qHi: 'Ek function jо "bahut slow" hai use kaise investigate aur fix karोge, ise samjhाओ.',
        a: 'First I would establish that it is actually a problem: what is the requirement, how slow is it against realistic input, and does it matter — a function that runs once at startup taking 200 milliseconds is not worth optimising. Then I profile rather than guess. For a whole request or job I run cProfile, either from the command line with the script or by wrapping the call in a Profile context manager, and I look at the stats sorted two ways: by tottime, which is time spent in the function itself excluding callees, to see where the CPU actually goes, and by cumtime, which includes callees, to see which high-level operation is expensive. Very often the result is surprising — the cost is concentrated in something like a database call made in a loop, a JSON parse repeated per row, an accidental N-plus-one, a regex recompiled every call, or a linear membership scan inside a loop making the whole thing quadratic. For comparing two specific implementations of a small piece I use timeit with repeat, taking the minimum sample to reduce noise. If memory is the concern I use tracemalloc, taking snapshots before and after and comparing to see which lines allocated. Once the profile points at the hot spot, the fix is usually algorithmic, not micro-optimisation: change an O of n-squared pattern to O of n with a set or dict, replace repeated string concatenation with join, batch N queries into one, add an index, memoise a pure expensive function with lru_cache, or move a numeric loop to a vectorised NumPy operation. Then I re-measure to confirm the fix helped and that the bottleneck did not just move somewhere worse. I stop when it meets the requirement, not when it is theoretically optimal. Only if profiling shows the time genuinely spread across pure-Python computation with no algorithmic slack — which is rare — do I consider Cython, a compiled extension, PyPy, or parallelism with a process pool.',
        aHi: 'Pehle main sthापित karूंga ki ye sachmuch ek samasya hai: requirement kya hai, realistic input ke khilaaf ye kितna slow hai, aur kya ye maayne rakhता hai. Phir main anumaan ke bजaay profile karता hूं. Ek poore request ke liye main cProfile chalाता hूं aur stats do tarikon se sorted dekhता hूं: tottime se, jо function mein khud bitा samay hai, ye dekhने ko CPU kahaan jाता hai, aur cumtime se, jismें callees shaamil hain. Aksar parinaam ascharyajanak hoता hai — cost kisi cheez mein केंद्रित hai jaise ek loop mein ki gayी database call, prati row repeat kiya JSON parse, ek accidental N-plus-one. Do specific implementations compare karne ke liye main timeit repeat ke saath istemal karता hूं, minimum sample lekar. Agar memory chinta hai toh tracemalloc. Jab profile hot spot par ishaara karता hai, fix aksar algorithmic hai: ek O of n-squared pattern ko O of n mein badalна ek set se, repeated string concatenation ko join se replace karna, N queries ko ek mein batch karna, lru_cache se memoise karna. Phir main phir se measure karता hूं. Main tab rukता hूं jab ye requirement poori karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Use `timeit.repeat` (repeat=5, take the min) to compare, for a list of 3000 ints: (a) a manual `for`+`append` loop building squares vs a list comprehension; (b) `s = ""; s += p` in a loop vs `"".join(parts)` for 3000 strings. Print which is faster in each pair and the join speedup ratio (expect > 3x).',
        taskHi: '`timeit.repeat` (repeat=5, min lो) istemal karके compare karो, 3000 ints ki ek list ke liye: (a) ek manual `for`+`append` loop vs ek list comprehension; (b) ek loop mein `s += p` vs `"".join(parts)` 3000 strings ke liye.',
        hint: 'Pass code as strings with `setup="data = list(range(3000))"`. `min(timeit.repeat(stmt, setup=setup, repeat=5, number=1000))`. The comprehension and `join` win; `join` is O(n) vs `+=` being O(n^2).',
        hintHi: 'Code ko strings ki tarah pass karो `setup="data = list(range(3000))"` ke saath. `min(timeit.repeat(stmt, setup=setup, repeat=5, number=1000))`. Comprehension aur `join` jeetते hain.',
      },
      {
        task: 'Profile with `cProfile.Profile()`. Write `hot(n)` that returns `n & 1`, `cold(xs)` that returns `sorted(xs)[:3]`, and `run()` that calls `hot` 100000 times in a loop and `cold` once. Enable the profiler around 20 `run()` calls, build `pstats.Stats`, and print the `ncalls` for `hot` and `cold`. Confirm `hot` has ~2,000,000 calls and dominates.',
        taskHi: '`cProfile.Profile()` se profile karो. `hot(n)` likhо jо `n & 1` lautае, `cold(xs)` jо `sorted(xs)[:3]` lautае, aur `run()` jо `hot` ko ek loop mein 100000 baar call kare aur `cold` ek baar. Profiler ko 20 `run()` calls ke aas-paas enable karो.',
        hint: '`pr = cProfile.Profile(); pr.enable(); [run() for _ in range(20)]; pr.disable()`. `pstats.Stats(pr, stream=io.StringIO())` then `print_stats("hot|cold")`, or use `stats.stats` dict keyed by `(file, line, func)` and read `ncalls` (index 0 of the value tuple).',
        hintHi: '`pr = cProfile.Profile(); pr.enable(); [run() for _ in range(20)]; pr.disable()`. `pstats.Stats(pr, stream=io.StringIO())` phir `print_stats("hot|cold")`.',
      },
      {
        task: 'Demonstrate reference-counting vs cycles. Make a `class Node` with `__del__` appending its tag to a module list. (a) Create a node, bind a second name, `del` both — show it is freed only after the second `del`. (b) Create two nodes referencing each other, `del` both names — show the list is still empty, then call `gc.collect()` and show they are freed. (c) Use `weakref.ref` to a node and show `w()` becomes `None` after `del`.',
        taskHi: 'Reference-counting vs cycles dikhाओ. Ek `class Node` banाओ jiska `__del__` iska tag ek module list mein append kare. (a) Ek node banाओ, doosra naam bind karो, dono `del` karो. (b) Do nodes jо ek doosre ko reference karें, dono naam `del` karो, phir `gc.collect()`. (c) Ek node ko `weakref.ref`.',
        hint: 'Refcount case: `freed` stays `[]` until the LAST reference is gone, then `__del__` fires synchronously — no `gc` needed. Cycle case: `a.other = b; b.other = a` -> `del a, b` leaves refcount 1 each -> `gc.collect()` returns > 0 and `__del__` fires. `weakref.ref(x)()` is `x` until `x` dies, then `None`.',
        hintHi: 'Refcount case: `freed` `[]` rehта hai jab tak AAKHRI reference na jाए, phir `__del__` synchronously fire hoता hai. Cycle case: `a.other = b; b.other = a` -> `del a, b` -> `gc.collect()`. `weakref.ref(x)()` `x` hai jab tak `x` na mare.',
      },
    ],

    keyTakeaways: [
      'MEASURE FIRST. Confirm it is too slow against a real requirement, then profile — never optimise by intuition. Fix the top 1–2 items, re-measure, stop when fast enough (not maximally fast).',
      '`timeit` (`timeit.repeat(..., repeat=5)` then take the `min`) for fair micro-comparisons of small snippets; `time.perf_counter()` to time a real block once. Compare relative numbers.',
      '`cProfile` (`python -m cProfile -s tottime script.py` or `with cProfile.Profile() as pr:`): `tottime` = time in the function itself (where CPU goes), `cumtime` = including callees (which call tree is costly), `ncalls` = call count. Total cost = per-call cost x call count.',
      '`tracemalloc` (snapshot, run, snapshot, `compare_to`) finds memory growth — usually an untrimmed cache or list.',
      'Memory: REFERENCE COUNTING frees an object IMMEDIATELY when its count hits 0 (no pause). The CYCLIC GC (`gc` module) handles reference cycles (`a`<->`b`) that refcounting cannot; it runs periodically and is generational.',
      'Touch `gc` almost never. Valid cases: `gc.disable()` + manual `gc.collect()` in a latency-sensitive service (only if no leaking cycles); `gc.freeze()` after imports before forking. Better: use `weakref` for back-references to avoid cycles.',
      'Real speedups in order of payoff: (1) algorithm / data structure — `set`/`dict` O(1) membership, `deque` for queue ops, `bisect` for sorted data; (2) stop wasteful work — `"".join` not `+=`, one query not N; (3) `functools.lru_cache` on pure expensive fns; (4) hoist lookups into locals; (5) NumPy for numeric loops; (6) last: Cython / C ext / PyPy.',
      'Amdahl\'s law: optimising a part that is 2% of runtime saves at most 2%. The profile shows where the other 98% actually is.',
    ],
    keyTakeawaysHi: [
      'PEHLE MEASURE KARो. Ek asli requirement ke khilaaf confirm karो ki ye slow hai, phir profile karो — kabhi intuition se optimise mat karो. Top 1–2 items theek karो, phir se measure karो, kaafi tez hone par ruko.',
      '`timeit` (`timeit.repeat(..., repeat=5)` phir `min` lो) chhote snippets ke fair micro-comparisons ke liye; `time.perf_counter()` ek asli block ek baar time karne ke liye.',
      '`cProfile`: `tottime` = function mein khud samay (CPU kahaan jाता hai), `cumtime` = callees sहित (kaunsा call tree mehnga hai), `ncalls` = call count. Total cost = per-call cost x call count.',
      '`tracemalloc` (snapshot, run, snapshot, `compare_to`) memory growth dhoondhता hai — aksar ek untrimmed cache ya list.',
      'Memory: REFERENCE COUNTING ek object ko TURANT free karता hai jab iska count 0 par pahुँchता hai (koi pause nahi). CYCLIC GC (`gc` module) reference cycles (`a`<->`b`) handle karता hai jо refcounting nahi kar sakta.',
      '`gc` ko lगbhag kabhi mat chhuो. Vaidh cases: ek latency-sensitive service mein `gc.disable()` + manual `gc.collect()`; imports ke baad forking se pehle `gc.freeze()`. Behtar: cycles se bachने ke liye `weakref` istemal karो.',
      'Asli speedups payoff ke kram mein: (1) algorithm / data structure — `set`/`dict` O(1) membership, queue ops ke liye `deque`, sorted data ke liye `bisect`; (2) barbaad kaam roko — `"".join` na ki `+=`, ek query N nahi; (3) pure mehngे fns par `functools.lru_cache`; (4) lookups locals mein hoist karो; (5) numeric loops ke liye NumPy; (6) aakhri: Cython / C ext / PyPy.',
      'Amdahl ka niyam: runtime ke 2% waale hisse ko optimise karna zyada se zyada 2% bachाता hai. Profile dikhाता hai baaki 98% asal mein kahaan hai.',
    ],
  },
];
