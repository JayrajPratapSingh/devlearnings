import type { CourseLesson } from './course-js-module1';

// DevOps Module 15 — Observability (part 2 of 2). Lessons 1-3 in course-devops-module15.ts.
// PROSE + realistic hand-written output (dashboards, trace waterfalls, alert rules,
// PromQL). No live telemetry stack; examples carry no `# VERIFY` marker, so
// verify-bash.mjs scans them structurally only.

export const DEVOPS_MODULE_15_PART2: CourseLesson[] = [
  {
    slug: 'ops-red-use-and-the-golden-signals',
    title: 'RED, USE & the Golden Signals',
    titleHi: 'RED, USE Aur Golden Signals',
    description:
      'Three small checklists that tell you what to measure so a dashboard actually answers "is it healthy and if not, where". RED (rate, errors, duration) for anything that serves requests; USE (utilisation, saturation, errors) for any resource; and the four golden signals (latency, traffic, errors, saturation) as the SRE summary. Plus why you look at percentiles not averages, and how to build a dashboard that separates "our fault" from "a dependency\'s fault".',
    descriptionHi:
      'Teen chhoti checklists jo aapko batati hain kya measure karein taaki ek dashboard actually answer kare "kya ye healthy hai aur agar nahi, kahaan". RED (rate, errors, duration) kisi bhi cheez ke liye jo requests serve karti hai; USE (utilisation, saturation, errors) kisi bhi resource ke liye; aur chaar golden signals (latency, traffic, errors, saturation) SRE summary ke roop mein. Plus aap percentiles kyun dekhते ho averages nahi, aur ek dashboard kaise build karein jo "hamari galti" ko "ek dependency ki galti" se separate kare.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A hospital triage board.** For each patient the nurse tracks three things (RED for a service): how many are arriving (rate), how many are critical (errors), how long each is waiting to be seen (duration). For each resource — beds, doctors, the CT scanner — she tracks three different things (USE): how busy it is (utilisation), how long the queue for it is (saturation), and how often it fails mid-use (errors). She looks at the *worst* waits, not the average — an average wait of 20 minutes is meaningless if one patient in twenty is waiting three hours. And when the board goes red she can immediately tell whether it is because too many patients arrived (our load), or because the one CT scanner is down and everything is queued behind it (a dependency).',
      hi: '**Ek hospital triage board.** Har patient ke liye nurse teen cheezein track karती hai (ek service ke liye RED): kitne arrive kar rahe hain (rate), kitne critical hain (errors), har ek kitna wait kar raha hai (duration). Har resource ke liye — beds, doctors, CT scanner — wo teen alag cheezein track karती hai (USE): ye kitna busy hai (utilisation), iske liye queue kitni lambi hai (saturation), aur ye kitni baar mid-use fail hota hai (errors). Wo *worst* waits dekhती hai, average nahi — 20 minute ka ek average wait meaningless hai agar bees mein ek patient teen ghante wait kar raha hai. Aur jab board red jaता hai wo turant bata sakती hai kya ye isliए hai ki bahut zyada patients arrive hue (hamara load), ya isliए ki ek CT scanner down hai.',
    },

    simple: `**RED — for anything that SERVES REQUESTS** (an HTTP service, a gRPC method, a
queue consumer, a Lambda). three metrics per service, per route:
\`\`\`
RATE      requests per second.  sum(rate(http_requests_total[5m])) by (route)
ERRORS    failed requests per second (or as a ratio).
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (route)
DURATION  the LATENCY DISTRIBUTION - p50, p90, p99 (histogram, aggregated).
          histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le, route))
\`\`\`
"is the service healthy?" -> RED answers it: enough traffic, few errors, fast enough.

**USE — for any RESOURCE** (a CPU, a disk, a NIC, a connection pool, a thread
pool, a memory arena, a DB, a queue):
\`\`\`
UTILISATION  the % of time the resource was busy / the fraction of capacity in use.
             CPU %, disk IO %, pool_active/pool_max, memory used/limit.
SATURATION   the extent to which work is QUEUED because the resource is full.
             run-queue length, pool wait time, iowait, queue depth, GC pause time.
             <- saturation is the leading indicator; utilisation can be 100% and fine,
                but rising saturation = you are now falling behind.
ERRORS       errors the resource itself throws: disk read errors, pool timeouts,
             OOM kills, TCP retransmits, "connection refused".
\`\`\`
"WHICH resource is the bottleneck?" -> USE answers it, resource by resource.

**THE FOUR GOLDEN SIGNALS** (Google SRE - the executive summary of RED+USE):
\`\`\`
LATENCY     duration - and split successful vs failed (a fast 500 shouldn't look good)
TRAFFIC     rate - how much demand
ERRORS      error rate - explicit (5xx) AND implicit (200 with a wrong body) AND policy
            (too slow = an error against your SLO)
SATURATION  how full the most constrained resource is; the "how close to falling over"
\`\`\`
if you can only build FOUR graphs for a service, build these.

**PERCENTILES, NOT AVERAGES:**
\`\`\`
avg latency 120ms  can hide:  p50 40ms, p99 3200ms  -> 1 in 100 users waits 3s.
the average is dragged around by outliers and tells you about NOBODY's experience.
ALWAYS chart p50 (typical), p90/p95 (the tail most feel sometimes), p99/p99.9
(the worst, where cascading failures start). alert on the high percentile.
\`\`\`

**A DASHBOARD THAT LOCATES BLAME:**
\`\`\`
row 1  THIS SERVICE (RED): my rate, my error %, my p50/p99   <- am I unhealthy?
row 2  MY DEPENDENCIES: for each downstream call - its rate, its error %, its p99
         AS SEEN BY ME (client-side latency, includes network + their queue)
row 3  MY RESOURCES (USE): CPU, mem, connection pools, GC, disk
=> if row 1 is red but row 3 is calm and ONE cell in row 2 is red -> it's that
   dependency, not me. if row 3 is red (pool saturated) -> it's me / my capacity.
\`\`\``,

    simpleHi: `**RED — kisi bhi cheez ke liye jo REQUESTS SERVE karti hai** (ek HTTP service, ek
gRPC method, ek queue consumer, ek Lambda). per service, per route teen metrics:
\`\`\`
RATE      per second requests.  sum(rate(http_requests_total[5m])) by (route)
ERRORS    per second failed requests (ya ek ratio ke roop mein).
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (route)
DURATION  LATENCY DISTRIBUTION - p50, p90, p99 (histogram, aggregated).
          histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le, route))
\`\`\`
"kya service healthy hai?" -> RED ise answer karता hai.

**USE — kisi bhi RESOURCE ke liye** (ek CPU, ek disk, ek NIC, ek connection pool,
ek thread pool, ek DB, ek queue):
\`\`\`
UTILISATION  % time resource busy tha / capacity ka fraction in use.
             CPU %, disk IO %, pool_active/pool_max, memory used/limit.
SATURATION  wo extent jismें work QUEUED hai kyunki resource full hai.
            run-queue length, pool wait time, iowait, queue depth, GC pause time.
            <- saturation leading indicator hai; utilisation 100% ho sakta hai aur theek,
               par rising saturation = aap ab peeche gir rahe ho.
ERRORS      errors jo resource khud throw karता hai: disk read errors, pool timeouts,
            OOM kills, TCP retransmits, "connection refused".
\`\`\`
"KAUN sा resource bottleneck hai?" -> USE ise answer karता hai, resource by resource.

**CHAAR GOLDEN SIGNALS** (Google SRE - RED+USE ka executive summary):
\`\`\`
LATENCY     duration - aur successful vs failed split karo (ek fast 500 achha nahi dikhना chahिए)
TRAFFIC     rate - kitni demand
ERRORS      error rate - explicit (5xx) AUR implicit (200 wrong body ke saath) AUR policy
            (bahut slow = aapke SLO ke against ek error)
SATURATION  sabse constrained resource kitna full hai; "kitna close to falling over"
\`\`\`
agar aap ek service ke liye sirf CHAAR graphs bana sakte ho, ye banao.

**PERCENTILES, AVERAGES NAHI:**
\`\`\`
avg latency 120ms  chhupा sakta hai:  p50 40ms, p99 3200ms  -> 100 mein 1 user 3s wait karता hai.
average outliers dwara drag hota hai aur aapko KISI ke experience ke baare mein batata hai.
HAMESHA p50 (typical), p90/p95 (tail jo zyadaatar kabhi kabhi feel karते hain), p99/p99.9
(worst, jahaan cascading failures shuru hote hain) chart karo. high percentile par alert karo.
\`\`\`

**EK DASHBOARD JO BLAME LOCATE KARTA HAI:**
\`\`\`
row 1  YE SERVICE (RED): my rate, my error %, my p50/p99   <- kya main unhealthy hoon?
row 2  MY DEPENDENCIES: har downstream call ke liye - iski rate, iska error %, iska p99
         MERE DWARA DEKHA GAYA (client-side latency, network + unki queue include karता hai)
row 3  MY RESOURCES (USE): CPU, mem, connection pools, GC, disk
=> agar row 1 red hai par row 3 calm hai aur row 2 mein EK cell red hai -> ye wo
   dependency hai, main nahi. agar row 3 red hai (pool saturated) -> ye main hoon / meri capacity.
\`\`\``,

    content: `## RED — for request-serving things

The **RED method** says that for anything that handles requests — an HTTP service, a gRPC endpoint, a queue consumer, a scheduled function — you measure three things, broken out per route or operation:

- **Rate**: requests per second. This is your traffic and the denominator for the error ratio.
- **Errors**: failed requests, as a rate or a ratio of the total. "Failed" includes explicit 5xx responses and should also include requests that returned a success status but did the wrong thing, and requests too slow to be useful.
- **Duration**: the latency distribution — p50, p90, p99 — computed from a histogram and aggregated across instances. Not the average.

RED answers "is this service healthy": is it getting the traffic you expect, are almost all requests succeeding, and are they fast enough. It is the right first dashboard for any service, and because the three quantities are standardised you can build one template and apply it to every service.

## USE — for resources

The **USE method** applies to any constrained resource — a CPU, a disk, a network interface, a connection pool, a thread pool, a memory arena, a database, a message queue. For each you measure:

- **Utilisation**: the fraction of the resource\'s capacity in use, or the percentage of time it was busy. CPU percent, disk IO percent, active connections over pool size, memory used over the limit.
- **Saturation**: the degree to which demand exceeds what the resource can serve right now, so work is queued waiting for it. Run-queue length, time spent waiting to acquire a pool connection, iowait, queue depth, garbage-collection pause time. Saturation is the leading indicator: a CPU pinned at one hundred percent utilisation can be completely fine if nothing is waiting, but rising saturation means requests are now backing up and the system is falling behind.
- **Errors**: errors the resource itself produces — disk read errors, connection-pool acquisition timeouts, out-of-memory kills, TCP retransmits, "connection refused".

USE answers "which resource is the bottleneck", checked resource by resource. When RED shows a service is unhealthy, USE tells you which underlying resource is the cause.

## The four golden signals

Google\'s SRE practice distils RED and USE into **four golden signals** to watch for any user-facing system:

- **Latency**: request duration, split between successful and failed requests, because a fast error should not make the latency graph look healthy.
- **Traffic**: demand on the system, usually requests per second.
- **Errors**: the rate of failed requests, counting explicit failures (5xx), implicit ones (a 200 response with a broken body), and policy failures (a request slower than your objective is an error against that objective).
- **Saturation**: how full the most constrained resource is — the measure of how close the system is to falling over.

If you can only build four graphs for a service, build these. They are the executive summary; RED and USE are the drill-down.

## Percentiles, not averages

An average latency conceals the distribution. A mean of a hundred and twenty milliseconds can be a p50 of forty milliseconds and a p99 of three thousand two hundred — one user in a hundred waiting three seconds — and the average, dragged around by the slow tail, describes nobody\'s actual experience. Always chart the percentiles: p50 for what a typical request feels, p90 or p95 for the tail that most users hit occasionally, and p99 or p99.9 for the worst case, which is where cascading failures and timeouts begin. Alert on a high percentile, because by the time the average moves the tail is already severe.

## A dashboard that locates the fault

A service dashboard built to answer "is it us or a dependency" has three rows:

- **This service (RED)**: my request rate, my error percentage, my p50 and p99. This tells you whether the service itself is unhealthy.
- **My dependencies**: for each downstream call the service makes, the rate, error percentage, and p99 **as measured by this service** — client-side, so it includes the network and the dependency\'s own queueing.
- **My resources (USE)**: CPU, memory, connection pools, garbage collection, disk.

Reading it: if row one is red but row three is calm and exactly one cell in row two is red, the fault is that dependency, not you. If row three is red — a connection pool saturated, memory near the limit — the fault is your service or its capacity. This structure turns "the service is slow" into "the payment gateway\'s p99 as we see it went from 80 ms to 4 s at 10:02, and our pool saturated waiting for it" in the time it takes to glance at three rows.`,

    contentHi: `## RED — request-serving cheezon ke liye

**RED method** kehti hai ki kisi bhi cheez ke liye jo requests handle karती hai — ek HTTP service, ek gRPC endpoint, ek queue consumer — aap teen cheezein measure karते ho, per route ya operation broken out:
- **Rate**: per second requests. Ye aapka traffic hai aur error ratio ka denominator.
- **Errors**: failed requests, ek rate ya total ka ek ratio ke roop mein. "Failed" mein explicit 5xx responses shamil hain aur wo requests bhi jinhone ek success status return kiya par galat cheez ki.
- **Duration**: latency distribution — p50, p90, p99 — ek histogram se computed aur instances ke across aggregated. Average nahi.

RED answer karता hai "kya ye service healthy hai". Ye kisi bhi service ke liye sahi first dashboard hai.

## USE — resources ke liye

**USE method** kisi bhi constrained resource par apply hoती hai — ek CPU, ek disk, ek connection pool, ek thread pool, ek database, ek message queue. Har ke liye aap measure karते ho:
- **Utilisation**: resource ki capacity ka fraction in use.
- **Saturation**: wo degree jismें demand se zyada hai jo resource abhi serve kar sakता hai, to work queued hai. Saturation leading indicator hai: ek CPU ek sau percent utilisation par pinned poori tarah theek ho sakта hai agar kuch wait nahi kar raha, par rising saturation ka matlab requests ab back up ho rahi hain.
- **Errors**: errors jo resource khud produce karता hai — disk read errors, connection-pool acquisition timeouts, out-of-memory kills.

USE answer karता hai "kaun sा resource bottleneck hai".

## Chaar golden signals

Google ki SRE practice RED aur USE ko **chaar golden signals** mein distil karती hai:
- **Latency**: request duration, successful aur failed requests ke beech split.
- **Traffic**: system par demand.
- **Errors**: failed requests ki rate.
- **Saturation**: sabse constrained resource kitna full hai.

Agar aap ek service ke liye sirf chaar graphs bana sakte ho, ye banao.

## Percentiles, averages nahi

Ek average latency distribution chhupाती hai. Ek sau bees millisecond ka ek mean ek chalees millisecond ka p50 aur ek teen hazaar do sau ka p99 ho sakता hai — ek sau mein ek user teen second wait karता hua — aur average, slow tail dwara drag, kisi ke actual experience ko describe nahi karता. Hamesha percentiles chart karo: typical request ke liye p50, tail ke liye p90 ya p95, worst case ke liye p99 ya p99.9. Ek high percentile par alert karo.

## Ek dashboard jo fault locate karता hai

Ek service dashboard jo "kya ye hum hain ya ek dependency" answer karne ke liye built hai ke teen rows hain:
- **Ye service (RED)**: meri request rate, mera error percentage, mera p50 aur p99.
- **Meri dependencies**: har downstream call ke liye, rate, error percentage, aur p99 **is service dwara measured** — client-side.
- **Mere resources (USE)**: CPU, memory, connection pools, garbage collection, disk.

Ise padhna: agar row one red hai par row three calm hai aur row two mein exactly ek cell red hai, fault wo dependency hai, aap nahi. Agar row three red hai — ek connection pool saturated — fault aapki service ya iski capacity hai.`,

    examples: [
      {
        title: 'A RED dashboard template applied to every service, and reading it during an incident',
        titleHi: 'Har service par applied ek RED dashboard template, aur ek incident ke dauraan ise padhna',
        code: `# ONE reusable Grafana row, templated by  $service :

  RATE      sum(rate(http_requests_total{service="$service"}[5m])) by (route)
  ERRORS %  sum(rate(http_requests_total{service="$service",status=~"5.."}[5m])) by (route)
            / sum(rate(http_requests_total{service="$service"}[5m])) by (route)
  p50       histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket{service="$service"}[5m])) by (le,route))
  p99       histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="$service"}[5m])) by (le,route))

# INCIDENT 10:05 - "checkout is slow". flip $service = checkout:

  RATE      /checkout   42 req/s   (normal - not a traffic spike)
  ERRORS %  /checkout   0.1% -> 0.2%   (barely moved - it's not erroring, it's SLOW)
  p50       /checkout   90ms -> 140ms   (a bit up)
  p99       /checkout   400ms -> 4100ms   <-- 10x. the tail exploded, the median didn't.

# read: NOT a traffic problem (rate flat), NOT an error problem (0.2%), it's a
#   LATENCY-TAIL problem on /checkout - a subset of requests are hitting something
#   slow. p50 barely moved => it's conditional (a slow path, a slow dependency for
#   some requests, a lock, a cold cache for cache-miss requests).
# next: flip to the DEPENDENCIES row (next example) to find WHICH downstream.
# because the template is identical for all 30 services, the on-call knew exactly
# where to look without learning a bespoke dashboard.`,
        output: `The value of a TEMPLATED RED row is that every service looks the same, so reading
one during an incident is a reflex, not a puzzle. Here: rate flat (not load),
errors flat (not failing), p50 barely up but p99 10x - a conditional slow path,
not a broad slowdown. That reading alone rules out three whole categories of
cause and points straight at "a slow dependency or path for a subset of
requests", which is the next dashboard row.`,
        explain: 'A single Grafana row is defined once with a service name as a variable, producing the rate, error ratio, p50, and p99 for whichever service you select — and the same row is used for all thirty services in the system. During an incident where checkout feels slow, the on-call switches the variable to checkout and reads four numbers. The request rate is normal, so this is not a traffic spike. The error ratio has barely moved, from a tenth of a percent to two tenths, so the service is not failing requests — it is serving them slowly. The p50 has risen only slightly, from ninety to a hundred and forty milliseconds, but the p99 has gone from four hundred milliseconds to over four seconds, a tenfold increase. The shape of that — the tail exploding while the median stays close to normal — means the slowness is conditional: some subset of requests is hitting something slow while most are fine, which points at a slow code path taken by some requests, a slow dependency called only sometimes, lock contention, or a cold cache affecting only cache-miss requests. That single reading eliminates traffic and errors as causes and directs the investigation straight to the dependencies row. The dashboard being identical across every service is what makes this a reflex rather than a puzzle for whichever engineer is on call.',
        explainHi: 'Ek single Grafana row ek baar service name ke saath ek variable ke roop mein define ki jaati hai, jo bhi service aap select karते ho uske liye rate, error ratio, p50, aur p99 produce karती hai — aur wahi row system mein saare tees services ke liye use hoती hai. Ek incident ke dauraan jahaan checkout slow feel karता hai, on-call variable ko checkout par switch karता hai aur chaar numbers padhता hai. Request rate normal hai, to ye ek traffic spike nahi hai. Error ratio barely move hua, to service requests fail nahi kar rahi — ye unhe slowly serve kar rahi hai. p50 sirf thoda risen hai, par p99 chaar sau millisecond se chaar second se zyada tak gaya. Us ka shape — tail exploding jabki median close to normal rahता hai — ka matlab slowness conditional hai.',
      },
      {
        title: 'USE on the resources, and how saturation warns before utilisation looks bad',
        titleHi: 'Resources par USE, aur saturation kaise utilisation ke bura dikhने se pehle warn karता hai',
        code: `# the checkout service's connection pool to the payments DB. pool max = 20.

# --- 09:55 (baseline) ---
  UTILISATION  pool_active / pool_max      = 6 / 20   = 30%    "looks idle"
  SATURATION   pool_acquire_wait_seconds p99 = 0.001s          "no waiting"
  ERRORS       pool_acquire_timeouts_total  rate = 0/s

# --- 10:02 (the payments DB starts responding slowly: 20ms -> 300ms per query) ---
  UTILISATION  pool_active / pool_max      = 20 / 20  = 100%   "now it looks maxed"
  SATURATION   pool_acquire_wait_seconds p99 = 2.4s            <-- THIS is the alarm
  ERRORS       pool_acquire_timeouts_total  rate = 3/s         <-- and now timeouts

# WHY saturation leads: at 09:58 utilisation was already 70-80% and CLIMBING while
# saturation was still ~0. utilisation hitting 100% tells you the pool is FULL;
# saturation (wait time) tells you requests are now QUEUING behind it and the
# service is FALLING BEHIND. by the time utilisation reads 100%, saturation has
# been rising for a minute or two - which is your early warning.

# THE ALERT (on saturation, not utilisation):
  ALERT PoolSaturating
  expr: histogram_quantile(0.99, rate(pool_acquire_wait_seconds_bucket[5m])) > 0.5
  for: 3m
  # "requests are waiting > 500ms to get a DB connection" - actionable + early.
# NOT:  alert on pool_active/pool_max > 0.9  -> fires on every healthy traffic peak.

# and the CAUSE is one row up in USE-land: the payments DB's own
#   query_duration p99  went 20ms -> 300ms  -> that's why 20 connections aren't
#   enough anymore (Little's law: needed_connections = arrival_rate x service_time).`,
        output: `Utilisation (pool 6/20 -> 20/20) only tells you the pool is full - a state a
healthy service reaches at every peak. SATURATION (acquire wait 1ms -> 2.4s) tells
you requests are now QUEUED and the service is falling behind - and it started
rising a minute or two BEFORE utilisation hit 100%, which is the early warning.
Alert on saturation (wait > 500ms for 3m), not utilisation. The root cause is one
level down: the DB's query p99 tripled, so 20 connections stopped being enough.`,
        explain: 'The checkout service holds a pool of twenty connections to the payments database, and the USE method is applied to that pool. At baseline, utilisation is thirty percent — six of twenty connections in use — saturation is negligible with acquisition waits around a millisecond, and there are no errors. When the payments database starts responding slowly, each query holds its connection longer, so connections are not returned to the pool as quickly and utilisation climbs to a hundred percent. But utilisation reaching a hundred percent only tells you the pool is full, which is a state a healthy service reaches at every traffic peak. The signal that matters is saturation: the p99 time a request spends waiting to acquire a connection jumps from a millisecond to two point four seconds, and acquisition timeouts begin. Critically, saturation started rising a minute or two before utilisation hit a hundred percent — while utilisation was at seventy or eighty percent and climbing, the wait time was already increasing — so an alert on saturation gives earlier warning than an alert on utilisation, and an alert on utilisation being high would fire on every normal peak and be ignored. The correct alert is on the acquisition wait time exceeding a threshold for a few minutes. And the root cause is one level down in the USE hierarchy: the database\'s own query duration p99 tripled, and by Little\'s law the number of connections you need is the arrival rate times the service time, so when service time tripled, twenty connections stopped being enough.',
        explainHi: 'Checkout service payments database ke liye bees connections ka ek pool rakhता hai, aur USE method us pool par apply hoती hai. Baseline par, utilisation tees percent hai, saturation negligible hai, aur koi errors nahi hain. Jab payments database slowly respond karना shuru karता hai, har query apna connection lamba hold karता hai, to utilisation ek sau percent tak climb karता hai. Par utilisation ek sau percent tak pahunchna sirf aapko batata hai ki pool full hai, jo ek state hai jo ek healthy service har traffic peak par reach karती hai. Jo signal matter karता hai wo saturation hai: ek connection acquire karने ka wait karता ek request p99 time ek millisecond se do point chaar second tak jump karता hai. Critically, saturation utilisation ke ek sau percent hit karने se ek ya do minute pehle rise karना shuru hua. Aur root cause USE hierarchy mein ek level neeche hai: database ka apna query duration p99 tripled.',
      },
    ],

    mistakes: [
      {
        wrong: `# alerting and dashboarding on AVERAGE latency
  ALERT HighLatency  expr: avg(rate(http_duration_sum[5m]) / rate(http_duration_count[5m])) > 0.5
  # avg latency = 200ms. alert doesn't fire. everything "looks fine".
  # reality: p50 = 60ms, p95 = 180ms, p99 = 6800ms, p99.9 = 24000ms
  # -> 1% of every user's requests take ~7 seconds. the checkout abandonment rate
  #    is up 15%. support tickets about "the site hanging". but the AVERAGE is 200ms
  #    because 99% are fast, so no alert, no dashboard signal, you find out from
  #    the business metrics a week later.`,
        right: `# alert + chart on PERCENTILES from a histogram:
  ALERT HighLatencyP99
  expr: histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le)) > 1.0
  for: 5m
  # and on the dashboard, ALWAYS three lines: p50, p95, p99 (+ p99.9 for critical
  # paths). the gap between p50 and p99 IS the story - a widening gap = a growing
  # tail = something is intermittently slow.
  # also: split latency by outcome. p99 of SUCCESSFUL requests. a batch of fast
  # 500s must not make the latency graph look better.`,
        why: 'An average latency is a single number that summarises the whole distribution, and it is dominated by the bulk of fast requests, so it moves only a little even when the tail becomes severe. A mean of two hundred milliseconds is entirely consistent with a p50 of sixty milliseconds and a p99 of nearly seven seconds, which means one request in a hundred — for every user, many times a day — takes seven seconds, long enough to abandon a checkout or file a support ticket. Because ninety-nine percent of requests are fast, the average barely registers the problem, so an alert threshold on the average does not fire and a dashboard showing the average shows nothing wrong; the impact surfaces only later in business metrics like conversion rate. The correct approach is to alert and chart on percentiles computed from a histogram: p50 for the typical experience, p95 for the tail most users feel occasionally, p99 and p99.9 for the worst case where timeouts and cascading failures begin. The gap between p50 and p99 is itself the diagnostic — a widening gap means a growing tail, something that is intermittently slow. Latency should also be split by outcome, so the p99 you watch is the p99 of successful requests and a burst of fast error responses cannot make the graph look healthier than the system is.',
        whyHi: 'Ek average latency ek single number hai jo poori distribution summarise karता hai, aur ye fast requests ke bulk dwara dominated hai, to ye sirf thoda move karता hai even jab tail severe ban jaता hai. Do sau millisecond ka ek mean saath millisecond ke ek p50 aur lagbhag saat second ke ek p99 ke saath entirely consistent hai, jiska matlab ek sau mein ek request — har user ke liye, din mein kई baar — saat second leता hai. Kyunki navve percent requests fast hain, average barely problem register karता hai. Correct approach ek histogram se computed percentiles par alert aur chart karna hai: typical experience ke liye p50, tail ke liye p95, worst case ke liye p99 aur p99.9. p50 aur p99 ke beech ka gap khud diagnostic hai.',
      },
      {
        wrong: `# building a dashboard that shows "everything is red" but not WHERE the fault is
# a service dashboard with 40 panels in no particular order: some node_exporter
# host metrics, some app counters, a few DB gauges, all mixed together.
# incident: the service is slow. the on-call sees: CPU is a bit up, one DB panel
# is spiky, error rate is up, latency is up, GC looks busy, a queue is growing...
# EVERYTHING correlates with "the service is slow" because it all moves together.
# 30 minutes of "is it the DB? is it GC? is it the upstream?" with no structure.`,
        right: `# structure the dashboard to answer ONE question: is it us, a dependency, or a resource?
#   ROW 1 - THIS SERVICE (RED):  my rate | my error % | my p50 | my p99
#   ROW 2 - DEPENDENCIES (client-side, one column per downstream):
#            payments: rate|err%|p99   inventory: rate|err%|p99   auth: rate|err%|p99
#   ROW 3 - RESOURCES (USE):  cpu | mem | pool_active/max | pool_wait_p99 | gc_pause | disk
# reading order, top to bottom:
#   row 1 red? -> yes, we have a problem. keep going.
#   row 3 has a saturated resource? -> it's us / our capacity. STOP, that's the cause.
#   row 3 calm, row 2 has ONE red column? -> it's that dependency. STOP.
#   row 3 calm, row 2 all calm, row 1 red? -> it's our code (a slow path, a lock,
#     a bad deploy) - go to traces + the deploy log.`,
        why: 'A dashboard that lists many metrics without structure fails during an incident because when a service is slow, nearly everything moves — CPU rises because requests pile up, garbage collection gets busier, database panels spike, queues grow, errors climb — and all of it correlates with the symptom without any of it being distinguished as the cause. The on-call is left cycling through hypotheses with no method: is it the database, is it garbage collection, is it an upstream service. The fix is to structure the dashboard around a single diagnostic question — is the fault our service, a dependency, or a resource — with three rows in a fixed reading order. The first row is this service\'s RED metrics and answers whether there is a problem at all. The third row is the USE metrics for this service\'s resources, and a saturated resource there is the cause. If the resources are calm, the second row shows each dependency\'s rate, error ratio, and p99 as measured client-side by this service, and a single red column there is the culprit dependency. If resources are calm and all dependencies are calm but the service is still red, the fault is in the service\'s own code — a slow path, a lock, a bad deploy — and the next step is traces and the deployment log. The value is not more data but an order of elimination that turns a thirty-minute hunt into a top-to-bottom scan.',
        whyHi: 'Ek dashboard jo bina structure ke kई metrics list karता hai ek incident ke dauraan fail hota hai kyunki jab ek service slow hai, lagbhag sab kuch move karता hai — CPU rise karता hai kyunki requests pile up hoती hain, garbage collection busier hota hai, database panels spike karते hain — aur ye sab symptom ke saath correlate karता hai bina isme se kisi ke cause ke roop mein distinguish hue. Fix dashboard ko ek single diagnostic question ke around structure karna hai — kya fault hamari service, ek dependency, ya ek resource hai — ek fixed reading order mein teen rows ke saath. Pehla row is service ki RED metrics hai. Teesra row is service ke resources ki USE metrics hai, aur wahaan ek saturated resource cause hai. Agar resources calm hain, doosra row har dependency ki rate, error ratio, aur p99 dikhता hai. Agar sab calm hai par service abhi bhi red hai, fault service ke apne code mein hai.',
      },
      {
        wrong: `# measuring only the SERVICE's view and not the DEPENDENCY's view of the same call
# the payments service exposes:  payment_gateway_call_duration p99 = 220ms  "fine"
# but the CHECKOUT service, which CALLS payments, sees:
#   checkout -> payments call: p99 = 5.2s
# why the mismatch? the payments service measures from "request received" to
# "response sent" - it does NOT include: time queued in payments' own thread pool
# before a worker picked it up, TLS handshake, network, and checkout's client-side
# retry (checkout retries once on timeout, so a 3s timeout + a 2.2s retry = 5.2s).
# checkout's users feel 5.2s; the payments dashboard says 220ms; both are "right".`,
        right: `# instrument BOTH ends and know what each includes:
#   SERVER-SIDE (payments): handler duration - what payments' CODE spent. useful for
#     "is our code slow" but NOT "what does our caller experience".
#   CLIENT-SIDE (checkout): the full call as the caller sees it - connect + queue +
#     network + server + retries. THIS is the number that maps to user pain.
#   put the CLIENT-SIDE p99 of each dependency on the caller's dashboard (row 2 of
#     the previous example). that's the "is it this dependency" signal.
#   also expose payments' OWN queue wait (saturation) so payments can see it's
#     accepting more than it can process - the gap between the two views.
# a trace (Lesson 5) shows the whole thing in one picture: the queue wait, the
# handler, the retry - as separate spans.`,
        why: 'A downstream service and the service calling it measure the duration of the same call from different points and include different things, so their numbers legitimately differ, sometimes by an order of magnitude. The server measures from when its handler receives the request to when it sends the response — its own code time. It does not include the time the request spent queued in the server\'s own thread or connection pool before a worker picked it up, the TLS handshake, the network transit in both directions, or anything the client does around the call such as retrying on timeout. So a payments service can correctly report a p99 of two hundred milliseconds for its handler while the checkout service that calls it correctly sees a p99 of five seconds, because checkout\'s number includes a three-second timeout followed by a two-second retry, plus queue and network. Both measurements are accurate; they answer different questions. The fix is to instrument both ends deliberately: the server-side handler duration tells the downstream team whether their code is slow, and the client-side call duration on the caller\'s dashboard tells you what the caller and ultimately the user experiences, which is the number that maps to user pain and the one that belongs in the dependencies row of a service dashboard. Exposing the server\'s own queue-wait metric as well makes the gap between the two views visible, and a trace shows the queue wait, the handler, and the retry as separate spans in a single picture.',
        whyHi: 'Ek downstream service aur use call karने wali service same call ki duration ko different points se measure karती hain aur different cheezein include karती hain, to unke numbers legitimately differ karते hain, kabhi ek order of magnitude se. Server measure karता hai jab iska handler request receive karता hai se jab ye response bhejता hai — iska apna code time. Isme wo time shamil nahi hai jo request server ke apne thread pool mein queued spend kiya, TLS handshake, network transit, ya kuch jo client call ke around karता hai jaise timeout par retry. To ek payments service correctly ek do sau millisecond ka p99 report kar sakti hai jabki checkout service jo use call karती hai correctly ek paanch second ka p99 dekhती hai. Fix dono ends ko deliberately instrument karna hai: server-side handler duration downstream team ko batata hai kya unka code slow hai, aur caller ke dashboard par client-side call duration aapko batata hai caller kya experience karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Average latency hid a 7-second p99** — a team alerted on `avg` latency (~200 ms, always green) while p99 was 6.8 s for 1% of requests. Checkout abandonment was up 15% for a week before anyone connected it. Switched every latency alert + panel to p50/p95/p99 from a histogram.',
        hi: '**Average latency ne ek 7-second p99 chupaya** — ek team ne `avg` latency (~200 ms, hamesha green) par alert kiya jabki p99 1% requests ke liye 6.8 s tha. Checkout abandonment ek hafte 15% up tha. Har latency alert + panel ko histogram se p50/p95/p99 par switch kiya.',
      },
      {
        en: '**40-panel dashboard, 30-minute hunt** — during a slowdown the on-call cycled through "DB? GC? upstream?" for 30 min because every panel moved together. Restructuring to RED / dependencies / USE rows in a fixed reading order cut the "where" phase to under 2 minutes on the next incident.',
        hi: '**40-panel dashboard, 30-minute hunt** — ek slowdown ke dauraan on-call ne 30 min "DB? GC? upstream?" cycle kiya kyunki har panel ek saath move hua. RED / dependencies / USE rows mein restructure karna "kahaan" phase ko 2 minute se kam kar diya.',
      },
      {
        en: '**Server p99 220 ms, client p99 5.2 s** — the payments team insisted their service was healthy (handler p99 220 ms). Checkout users waited 5+ s. The gap was a client-side retry (3 s timeout + 2.2 s retry) plus payments\' own queue wait, which payments wasn\'t measuring. Both metrics were added; a trace made it obvious.',
        hi: '**Server p99 220 ms, client p99 5.2 s** — payments team ne insist kiya unki service healthy thi (handler p99 220 ms). Checkout users 5+ s wait karte the. Gap ek client-side retry plus payments ka apna queue wait tha. Dono metrics add kiye gaye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the RED method, what is the USE method, and when do you apply each?',
        qHi: 'RED method kya hai, USE method kya hai, aur aap har ek kab apply karte ho?',
        a: 'The RED method applies to anything that serves requests — an HTTP service, a gRPC endpoint, a queue consumer, a scheduled function. For each, broken out per route or operation, you measure three things: Rate, the requests per second, which is your traffic and the denominator for the error ratio; Errors, the failed requests as a rate or ratio, counting explicit 5xx failures, requests that returned success but did the wrong thing, and requests too slow to be useful; and Duration, the latency distribution as p50, p90, p99 from a histogram aggregated across instances, never the average. RED answers "is this service healthy". The USE method applies to any constrained resource — a CPU, a disk, a connection pool, a thread pool, a database, a queue. For each you measure Utilisation, the fraction of capacity in use or percent of time busy; Saturation, the degree to which work is queued because the resource is full, which is the leading indicator because a resource at a hundred percent utilisation can be fine if nothing is waiting but rising saturation means the system is falling behind; and Errors, the errors the resource itself throws such as pool timeouts, out-of-memory kills, and disk read errors. USE answers "which resource is the bottleneck". You use RED as the first dashboard for every service to detect that something is wrong, and USE to drill into which underlying resource is the cause. The four golden signals — latency, traffic, errors, saturation — are the executive summary of both.',
        aHi: 'RED method kisi bhi cheez par apply hoती hai jo requests serve karती hai. Har ke liye, per route ya operation broken out, aap teen cheezein measure karते ho: Rate, per second requests; Errors, failed requests ek rate ya ratio ke roop mein; aur Duration, latency distribution p50, p90, p99 ke roop mein ek histogram se instances ke across aggregated, kabhi average nahi. RED answer karता hai "kya ye service healthy hai". USE method kisi bhi constrained resource par apply hoती hai. Har ke liye aap Utilisation measure karते ho, capacity ka fraction in use; Saturation, wo degree jismें work queued hai kyunki resource full hai, jo leading indicator hai; aur Errors, errors jo resource khud throws karता hai. USE answer karता hai "kaun sा resource bottleneck hai". Aap RED har service ke liye first dashboard ke roop mein use karते ho, aur USE ye drill karने ke liye ki kaun sा underlying resource cause hai.',
      },
      {
        q: 'Why do you look at percentiles instead of averages, and what does the gap between p50 and p99 tell you?',
        qHi: 'Aap averages ke bajaay percentiles kyun dekhते ho, aur p50 aur p99 ke beech ka gap aapko kya batata hai?',
        a: 'An average latency is a single number dominated by the bulk of fast requests, so it moves only slightly even when the tail becomes severe. A mean of two hundred milliseconds is entirely consistent with a p50 of sixty milliseconds and a p99 of seven seconds, which means one request in a hundred, for every user many times a day, takes seven seconds — enough to abandon a checkout or open a support ticket — while the average barely registers it because ninety-nine percent of requests are fast. So an alert on the average does not fire and a dashboard of the average shows nothing wrong, and the impact only surfaces later in business metrics. Percentiles describe the actual experience at different points in the distribution: p50 is what a typical request feels, p90 or p95 is the tail most users hit occasionally, p99 and p99.9 are the worst case where timeouts and cascading failures begin. You alert on a high percentile because by the time the average moves the tail is already bad. The gap between p50 and p99 is itself a diagnostic. A small gap means consistent performance. A widening gap means a growing tail — some subset of requests is becoming intermittently slow while the typical request is unaffected, which points at a conditional slow path, a sometimes-slow dependency, lock contention, or a cache-miss penalty. A slowdown that raises both p50 and p99 together is a broad problem; one that raises only p99 is conditional.',
        aHi: 'Ek average latency ek single number hai jo fast requests ke bulk dwara dominated hai, to ye sirf thoda move karता hai even jab tail severe ban jaता hai. Do sau millisecond ka ek mean saath millisecond ke ek p50 aur saat second ke ek p99 ke saath entirely consistent hai. Ek average par ek alert fire nahi karता. Percentiles distribution mein different points par actual experience describe karते hain: p50 wo hai jo ek typical request feel karता hai, p90 ya p95 tail hai jo zyadaatar users kabhi kabhi hit karते hain, p99 aur p99.9 worst case hain. p50 aur p99 ke beech ka gap khud ek diagnostic hai. Ek small gap consistent performance ka matlab hai. Ek widening gap ek growing tail ka matlab hai — kuch subset of requests intermittently slow ban rahi hain. Ek slowdown jo p50 aur p99 dono ko ek saath raise karता hai ek broad problem hai; ek jo sirf p99 raise karता hai conditional hai.',
      },
      {
        q: 'How do you structure a service dashboard so it tells you whether the fault is your service, a dependency, or a resource?',
        qHi: 'Aap ek service dashboard kaise structure karte ho taaki ye aapko bataye ki fault aapki service, ek dependency, ya ek resource hai?',
        a: 'You build it as three rows in a fixed reading order, each answering one part of the diagnostic question. The first row is this service\'s RED metrics — its request rate, error percentage, p50, and p99 — and it tells you whether there is a problem at all and roughly its shape. The second row is one column per downstream dependency, showing the rate, error ratio, and p99 of each call as measured client-side by this service, so it includes the network and the dependency\'s own queueing and any retries — the number that reflects what this service actually experiences from that dependency. The third row is the USE metrics for this service\'s own resources — CPU, memory, connection pool active and wait time, garbage collection pause time, disk. Reading it top to bottom: if row one is red there is a problem. Then check row three — a saturated resource there, a pool at its wait limit or memory near the cap, is the cause and you stop. If resources are calm, check row two — a single red column is the culprit dependency and you stop. If resources are calm and all dependencies are calm but the service is still red, the fault is in the service\'s own code, a slow path or a lock or a bad deploy, and you go to traces and the deployment log. The point is not more panels but an explicit order of elimination that turns "everything correlates with the slowness" into a two-minute scan.',
        aHi: 'Aap ise ek fixed reading order mein teen rows ke roop mein build karते ho, har ek diagnostic question ka ek part answer karता hua. Pehla row is service ki RED metrics hai — iski request rate, error percentage, p50, aur p99. Doosra row per downstream dependency ek column hai, har call ki rate, error ratio, aur p99 dikhता hai jo is service dwara client-side measured hai. Teesra row is service ke apne resources ki USE metrics hai. Ise top to bottom padhna: agar row one red hai ek problem hai. Phir row three check karo — wahaan ek saturated resource cause hai aur aap ruko. Agar resources calm hain, row two check karo — ek single red column culprit dependency hai. Agar resources calm hain aur saari dependencies calm hain par service abhi bhi red hai, fault service ke apne code mein hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define RED and USE (each letter, the query, what it answers), the four golden signals, and how the three combine.',
        taskHi: 'Ek comment mein, RED aur USE define karo.',
        hint: 'RED — for anything that SERVES REQUESTS (HTTP service, gRPC method, queue consumer, Lambda), measured PER ROUTE/OPERATION: RATE = requests/sec (`sum(rate(http_requests_total[5m])) by (route)`) — your traffic + the error-ratio denominator. ERRORS = failed requests as a rate or ratio (`sum(rate(...{status=~"5.."}[5m])) by (route) / sum(rate(...[5m])) by (route)`) — explicit 5xx AND "200 but wrong body" AND "too slow to be useful". DURATION = the LATENCY DISTRIBUTION p50/p90/p99 from a histogram, aggregated (`histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le,route))`) — NEVER the average. RED answers "is this service HEALTHY?" — the first dashboard for every service; templatize it so all N services look identical. USE — for any RESOURCE (CPU, disk, NIC, connection pool, thread pool, memory arena, DB, queue): UTILISATION = fraction of capacity in use / % time busy (`pool_active/pool_max`, CPU %, mem used/limit). SATURATION = the extent work is QUEUED because the resource is full (run-queue length, pool acquire-wait time, iowait, queue depth, GC pause) — the LEADING INDICATOR: a resource at 100% utilisation can be fine if nothing waits, but RISING saturation = you are falling behind; saturation starts climbing a minute or two BEFORE utilisation hits 100%. ERRORS = errors the resource itself throws (pool timeouts, OOM kills, disk read errors, TCP retransmits, "connection refused"). USE answers "WHICH resource is the bottleneck?" — resource by resource. THE FOUR GOLDEN SIGNALS (Google SRE, the executive summary of RED+USE): LATENCY (duration — split successful vs failed so a fast 500 doesn\'t look good), TRAFFIC (rate), ERRORS (explicit + implicit + policy/SLO), SATURATION (how full the most-constrained resource is). If you can build only 4 graphs, build these. HOW THEY COMBINE: RED detects that a service is unhealthy → USE tells you which underlying resource is the cause → the golden signals are the at-a-glance summary you alert on.',
        hintHi: 'RED — kisi bhi cheez ke liye jo REQUESTS SERVE karti hai, PER ROUTE measured: RATE = requests/sec — traffic + error-ratio denominator. ERRORS = failed requests rate/ratio — 5xx AUR "200 wrong body" AUR "bahut slow". DURATION = LATENCY DISTRIBUTION p50/p90/p99 histogram se, aggregated — KABHI average nahi. RED answer karta hai "kya ye service HEALTHY hai?". USE — kisi bhi RESOURCE ke liye: UTILISATION = capacity ka fraction in use. SATURATION = wo extent jismें work QUEUED hai kyunki resource full hai — LEADING INDICATOR: 100% utilisation theek ho sakta hai agar kuch wait nahi karता, par RISING saturation = aap peeche gir rahe ho. ERRORS = errors jo resource khud throws karता hai. USE answer karta hai "KAUN sa resource bottleneck hai?". CHAAR GOLDEN SIGNALS: LATENCY (successful vs failed split), TRAFFIC (rate), ERRORS (explicit + implicit + policy), SATURATION. COMBINE: RED detect karता hai → USE batata hai kaun sa resource → golden signals at-a-glance summary hain.',
      },
      {
        task: 'In a comment, explain why you chart percentiles not averages, what a widening p50↔p99 gap means, and why latency must be split by outcome.',
        taskHi: 'Ek comment mein, aap percentiles kyun chart karte ho samjhao.',
        hint: 'AN AVERAGE LATENCY is a single number DOMINATED by the bulk of fast requests → it moves only slightly even when the tail is severe. `avg = 200ms` is entirely consistent with `p50 = 60ms, p95 = 180ms, p99 = 6800ms, p99.9 = 24000ms` → 1 request in 100, for EVERY user MANY times a day, takes ~7s — enough to abandon a checkout / file a ticket — while the average barely registers it (99% are fast). → an alert on `avg` doesn\'t fire, a dashboard of `avg` shows nothing wrong, and the impact only surfaces a week later in BUSINESS metrics (conversion, abandonment). ALWAYS chart p50 (the TYPICAL experience), p90/p95 (the tail most users hit occasionally), p99/p99.9 (the WORST case, where timeouts + cascading failures begin). ALERT ON A HIGH PERCENTILE — by the time the average moves, the tail is already bad. THE p50↔p99 GAP IS ITSELF A DIAGNOSTIC: a SMALL gap = consistent performance. A WIDENING gap = a GROWING TAIL — some SUBSET of requests is becoming intermittently slow while the typical request is unaffected → points at a CONDITIONAL slow path (a sometimes-taken branch), a sometimes-slow DEPENDENCY, LOCK contention, or a CACHE-MISS penalty. A slowdown that raises BOTH p50 and p99 together = a BROAD problem (everything slower — more load, a slower DB across the board). A slowdown that raises ONLY p99 = CONDITIONAL. SPLIT LATENCY BY OUTCOME: chart the p99 of SUCCESSFUL requests separately — a burst of fast 500s (an upstream failing quickly) would otherwise DRAG THE LATENCY GRAPH DOWN and make the system look healthier than it is, exactly when it\'s failing. "Fast errors" is not "fast".',
        hintHi: 'EK AVERAGE LATENCY ek single number hai jo fast requests ke bulk dwara DOMINATED hai → ye sirf thoda move karता hai even jab tail severe hai. `avg = 200ms` `p50 = 60ms, p99 = 6800ms` ke saath consistent hai → 100 mein 1 request ~7s leता hai. → `avg` par ek alert fire nahi karता, impact ek hafte baad BUSINESS metrics mein surface hota hai. HAMESHA p50 (TYPICAL), p90/p95 (tail), p99/p99.9 (WORST) chart karo. HIGH PERCENTILE PAR ALERT karo. p50↔p99 GAP KHUD DIAGNOSTIC hai: SMALL gap = consistent. WIDENING gap = GROWING TAIL — kuch SUBSET intermittently slow → CONDITIONAL slow path / sometimes-slow DEPENDENCY / LOCK contention / CACHE-MISS. p50 aur p99 DONO raise = BROAD problem. SIRF p99 = CONDITIONAL. OUTCOME SE SPLIT karo: SUCCESSFUL requests ka p99 alag chart karo — fast 500s ka ek burst latency graph ko DOWN drag karता hai.',
      },
      {
        task: 'In a comment, describe the 3-row "locate the fault" dashboard and its reading order, and explain why the server\'s and the caller\'s view of the same call legitimately differ.',
        taskHi: 'Ek comment mein, 3-row "locate the fault" dashboard describe karo.',
        hint: 'THE 3-ROW DASHBOARD, one diagnostic question ("is it us, a dependency, or a resource?"), FIXED reading order: ROW 1 — THIS SERVICE (RED): my rate | my error % | my p50 | my p99 → is there a problem at all + its shape. ROW 2 — DEPENDENCIES (one column per downstream call): for each, the rate | error % | p99 AS MEASURED CLIENT-SIDE BY THIS SERVICE (includes connect + the dependency\'s queue + network + retries). ROW 3 — RESOURCES (USE): cpu | mem | pool_active/max | pool_wait_p99 | gc_pause | disk. READING ORDER top→bottom: (1) row 1 red? → yes, we have a problem, keep going. (2) row 3 has a SATURATED resource (pool at its wait limit, mem near the cap)? → it\'s US / our capacity. STOP, that\'s the cause. (3) row 3 calm, row 2 has exactly ONE red column? → it\'s THAT dependency. STOP. (4) row 3 calm, row 2 all calm, row 1 still red? → it\'s OUR CODE (a slow path, a lock, a bad deploy) → go to traces + the deploy log. The point is an explicit ORDER OF ELIMINATION, not more panels — "everything correlates with the slowness" becomes a 2-minute scan. WHY SERVER vs CALLER VIEW DIFFER (legitimately, sometimes 10×): the SERVER measures from "handler received the request" to "response sent" = its own CODE time. It does NOT include: time the request spent QUEUED in the server\'s own thread/connection pool before a worker picked it up, the TLS handshake, network transit both ways, or anything the CLIENT does around the call (esp. a RETRY — checkout retries once on a 3s timeout → 3s + a 2.2s retry = 5.2s). So payments can correctly report handler p99 = 220ms while checkout correctly sees p99 = 5.2s for the same call. BOTH are right; they answer different questions. FIX: instrument BOTH ends — server-side handler duration ("is our code slow?") AND client-side call duration on the CALLER\'s dashboard ("what does our caller/user experience?" — the number that maps to user pain, belongs in row 2). Also expose the server\'s OWN queue-wait (saturation) so the gap between the two views is visible. A trace shows queue wait + handler + retry as separate spans in one picture.',
        hintHi: '3-ROW DASHBOARD, ek diagnostic question, FIXED reading order: ROW 1 — YE SERVICE (RED): my rate | error % | p50 | p99. ROW 2 — DEPENDENCIES (per downstream ek column): rate | error % | p99 CLIENT-SIDE MEASURED (connect + unki queue + network + retries include). ROW 3 — RESOURCES (USE): cpu | mem | pool_active/max | pool_wait_p99 | gc_pause | disk. READING ORDER: (1) row 1 red? → problem hai. (2) row 3 mein SATURATED resource? → HUM / hamari capacity. STOP. (3) row 3 calm, row 2 mein EK red column? → WO dependency. STOP. (4) sab calm par row 1 red? → HAMARA CODE → traces + deploy log. WHY SERVER vs CALLER DIFFER: SERVER "handler received" se "response sent" tak measure karता hai = apna CODE time. Isme NAHI: queue time server ke pool mein, TLS handshake, network, ya CLIENT ka RETRY (3s timeout + 2.2s retry = 5.2s). DONO right hain. FIX: DONO ends instrument karo + server ka queue-wait expose karo. Ek trace sab ek picture mein dikhता hai.',
      },
    ],

    keyTakeaways: [
      'RED — for anything that SERVES REQUESTS, per route: RATE (req/s), ERRORS (failed as a rate/ratio — explicit + implicit + too-slow), DURATION (the p50/p90/p99 distribution from a histogram, aggregated — NEVER the average). RED answers "is this service healthy". Templatize the RED row so every service looks identical → reading it during an incident is a reflex.',
      'USE — for any RESOURCE (CPU, pool, disk, DB, queue): UTILISATION (fraction of capacity), SATURATION (how much work is QUEUED because it\'s full — the LEADING indicator; it climbs a minute or two BEFORE utilisation hits 100%; alert on saturation, not utilisation), ERRORS (pool timeouts, OOM kills, disk errors). USE answers "which resource is the bottleneck". THE FOUR GOLDEN SIGNALS = latency, traffic, errors, saturation — the executive summary; build these 4 if you build nothing else.',
      'CHART PERCENTILES, NOT AVERAGES. An `avg` of 200 ms hides a p99 of 7 s (1% of every user\'s requests) and never fires an average-based alert — you find out from business metrics a week later. Always show p50 (typical) / p95 (the felt tail) / p99-p99.9 (where cascading failures start); alert on a high percentile. A p50 that stays flat while p99 explodes = a CONDITIONAL slow path; p50 and p99 rising together = a BROAD problem.',
      'Split latency BY OUTCOME — chart the p99 of SUCCESSFUL requests, so a burst of fast 500s can\'t drag the latency graph down and make a failing system look healthy.',
      'STRUCTURE THE DASHBOARD to answer "us, a dependency, or a resource": row 1 = this service (RED); row 2 = each dependency\'s rate/err%/p99 AS MEASURED CLIENT-SIDE; row 3 = my resources (USE). Read top→bottom: row 3 saturated → it\'s us/capacity; else row 2 has one red column → that dependency; else row 1 red with 2+3 calm → our code (→ traces + deploy log). Server-side and client-side views of the same call legitimately differ (queue wait + network + retries) — instrument BOTH.',
    ],
    keyTakeawaysHi: [
      'RED — kisi bhi cheez ke liye jo REQUESTS SERVE karti hai, per route: RATE (req/s), ERRORS (failed rate/ratio — explicit + implicit + bahut-slow), DURATION (histogram se p50/p90/p99 distribution, aggregated — KABHI average nahi). RED answer karता hai "kya ye service healthy hai". RED row templatize karo → har service identical dikhता hai.',
      'USE — kisi bhi RESOURCE ke liye (CPU, pool, disk, DB, queue): UTILISATION (capacity ka fraction), SATURATION (kitna work QUEUED hai kyunki ye full hai — LEADING indicator; ye utilisation ke 100% hit karने se ek-do minute PEHLE climb karता hai; saturation par alert karo, utilisation par nahi), ERRORS (pool timeouts, OOM kills). USE answer karता hai "kaun sa resource bottleneck hai". CHAAR GOLDEN SIGNALS = latency, traffic, errors, saturation.',
      'PERCENTILES CHART KARO, AVERAGES NAHI. Ek `avg` of 200 ms ek p99 of 7 s chupाता hai (har user ke 1% requests) aur kabhi ek average-based alert fire nahi karता. Hamesha p50 (typical) / p95 (felt tail) / p99-p99.9 (jahaan cascading failures shuru hote hain) dikhाओ; ek high percentile par alert karo. Ek p50 jo flat rahता hai jabki p99 explode karता hai = ek CONDITIONAL slow path; p50 aur p99 ek saath rising = ek BROAD problem.',
      'Latency ko OUTCOME SE split karo — SUCCESSFUL requests ka p99 chart karo, taaki fast 500s ka ek burst latency graph ko down drag na kare.',
      'DASHBOARD KO STRUCTURE karo "hum, ek dependency, ya ek resource" answer karne ke liye: row 1 = ye service (RED); row 2 = har dependency ki rate/err%/p99 CLIENT-SIDE MEASURED; row 3 = mere resources (USE). Top→bottom padho: row 3 saturated → hum/capacity; else row 2 mein ek red column → wo dependency; else row 1 red 2+3 calm ke saath → hamara code (→ traces + deploy log). Server-side aur client-side views legitimately differ karते hain — DONO instrument karo.',
    ],
  },

  {
    slug: 'ops-distributed-tracing-and-context-propagation',
    title: 'Distributed Tracing & Context Propagation',
    titleHi: 'Distributed Tracing Aur Context Propagation',
    description:
      'A trace is one request drawn as a tree of timed spans across every service it touched — the single view that shows the critical path, the slow dependency, and the retry storm that logs and metrics only hint at. This lesson covers spans and the trace tree, how trace context propagates across HTTP, queues, and threads, what OpenTelemetry provides, head versus tail sampling, and exemplars that link a metric spike straight to a slow trace.',
    descriptionHi:
      'Ek trace ek request hai jo har service ke across timed spans ke ek tree ke roop mein draw ki gayi jise ye touch kiya — wo single view jo critical path, slow dependency, aur retry storm dikhati hai jinke logs aur metrics sirf hint dete hain. Ye lesson spans aur trace tree cover karta hai, trace context HTTP, queues, aur threads ke across kaise propagate karta hai, OpenTelemetry kya provide karta hai, head versus tail sampling, aur exemplars jo ek metric spike ko seedhे ek slow trace se link karte hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A relay-race baton with a logbook attached.** The first runner starts a stopwatch and writes the race number on the baton. Every time the baton is handed off, the receiving runner notes "received at 10:04:12, from runner 3" and starts their own leg-timer. At the finish you can lay out the whole race: which leg took longest, where a handoff fumbled and cost two seconds, whether runner 4 actually ran or just stood waiting for the baton. Without the baton carrying the race number, you would have five separate stopwatch readings and no way to know they belong to the same race. The race number is the trace ID; each leg-timer is a span; passing the baton is context propagation.',
      hi: '**Ek relay-race baton ek attached logbook ke saath.** Pehla runner ek stopwatch start karता hai aur baton par race number likhता hai. Har baar baton hand off hota hai, receiving runner note karता hai "10:04:12 par received, runner 3 se" aur apna leg-timer start karता hai. Finish par aap poori race lay out kar sakte ho: kaun sा leg sabse lamba laga, kahaan ek handoff fumble hua aur do second cost kiya, kya runner 4 actually daudा ya bas baton ka wait karता khadा raha. Baton ke race number carry kiye bina, aapke paas paanch separate stopwatch readings hote aur jaanne ka koi way nahi ki wo same race ke hain. Race number trace ID hai; har leg-timer ek span hai; baton pass karna context propagation hai.',
    },

    simple: `**A TRACE** = one request, drawn as a tree of SPANS across every service it
touched. **A SPAN** = one timed operation:
\`\`\`
{ trace_id: "7f3a...",           # SAME for every span in this request
  span_id:  "b2c1...",           # unique to this span
  parent_span_id: "a1b0...",     # the span that caused this one (root has none)
  name: "GET /api/checkout",
  start, end, duration_ms: 3204,
  service: "checkout",
  status: "OK" | "ERROR",
  attributes: { http.method:"GET", http.status_code:200, db.system:"postgres",
                customer_id:"8813", ... }   # <- high-cardinality lives HERE, not in metrics
  events: [ {ts, name:"retry", attrs:{attempt:2}}, ... ] }
\`\`\`
rendered as a WATERFALL:
\`\`\`
checkout: GET /api/checkout ................................ 3204ms
 ├─ checkout: auth.verify ......... 12ms
 ├─ checkout: db.query "load cart"  40ms
 ├─ payments: POST /charge ................................. 3100ms   <- 97% of the time
 │   ├─ payments: queue.wait ......... 2850ms  <- WAITING to be processed (saturation!)
 │   └─ payments: gateway.charge ..... 240ms
 └─ checkout: db.update "mark paid"  30ms
\`\`\`
in ~2 seconds you see: it's not checkout, it's not the gateway, it's payments'
INPUT QUEUE - payments is accepting work faster than it can process it.

**WHAT A TRACE SHOWS THAT LOGS + METRICS DON'T:**
\`\`\`
- the CRITICAL PATH: which span's duration actually determines the total (vs work
  that happened in parallel and didn't matter)
- WHERE in a 6-service call the time went, in one picture, without correlating
  6 services' logs by hand
- fan-out / N+1: "this span called the DB 47 times" is obvious in the tree
- a RETRY STORM: 3 identical child spans, each timing out
- a span that's just WAITING (queue, lock, pool) vs a span doing WORK
\`\`\`

**CONTEXT PROPAGATION** — the trace_id + span_id must travel on EVERY hop:
\`\`\`
HTTP        the  traceparent  header (W3C Trace Context standard):
            traceparent: 00-<trace_id>-<parent_span_id>-01
            every service reads it in, creates a child span, passes it out.
QUEUES      put traceparent in a message attribute / header on publish; the consumer
            reads it and continues the trace (the span for "time in queue" is real time).
THREADS / ASYNC   the context lives in a thread-local / contextvar / AsyncLocalStorage
            so a log line or a new span anywhere in the request auto-attaches.
            spawning a thread/goroutine? you must PROPAGATE the context into it.
CROSS-RUNTIME   gRPC metadata, GraphQL, Kafka headers - all have a propagation format.
\`\`\`
break the chain anywhere -> the trace splits into two unconnected traces.

**OPENTELEMETRY (OTel)** — the vendor-neutral standard:
\`\`\`
API         what your code calls: start a span, set an attribute, record an error.
SDK         the implementation: sampling, batching, context management, resource detection.
INSTRUMENTATION  auto-instrument libraries (HTTP servers/clients, DB drivers, queues)
            so most spans are created for you; add manual spans for business logic.
OTLP        the wire protocol: SDK -> COLLECTOR -> your backend (Jaeger/Tempo/
            Honeycomb/Datadog/...). the collector does processing, sampling, fan-out,
            and lets you switch backends without touching app code.
\`\`\`

**SAMPLING** (you can't store every trace):
\`\`\`
HEAD-BASED   decide at the ROOT, before the request runs: keep 1%, propagate the
             decision so all spans agree. cheap, simple. BUT you can't "keep the
             slow ones" because you don't know yet.
TAIL-BASED   buffer all spans of a trace in the collector, decide AFTER it finishes:
             keep 100% of errors + slow traces + a small % of normal ones. much
             more useful, but the collector must hold every in-flight trace (memory + cost).
EXEMPLARS    attach a sample trace_id to a histogram bucket -> click the p99 spike
             on a Grafana panel, jump straight to a trace that was in that bucket.
\`\`\``,

    simpleHi: `**EK TRACE** = ek request, har service ke across SPANS ke ek tree ke roop mein draw
ki gayi jise ye touch kiya. **EK SPAN** = ek timed operation:
\`\`\`
{ trace_id: "7f3a...",           # is request ke har span ke liye SAME
  span_id:  "b2c1...",           # is span ke unique
  parent_span_id: "a1b0...",     # wo span jo ise cause kiya (root ke koi nahi)
  name: "GET /api/checkout",
  start, end, duration_ms: 3204,
  service: "checkout",
  status: "OK" | "ERROR",
  attributes: { http.method:"GET", db.system:"postgres", customer_id:"8813", ... }
  events: [ {ts, name:"retry", attrs:{attempt:2}}, ... ] }
\`\`\`
ek WATERFALL ke roop mein rendered:
\`\`\`
checkout: GET /api/checkout ................................ 3204ms
 ├─ checkout: auth.verify ......... 12ms
 ├─ checkout: db.query "load cart"  40ms
 ├─ payments: POST /charge ................................. 3100ms   <- 97% time
 │   ├─ payments: queue.wait ......... 2850ms  <- process hone ka WAIT (saturation!)
 │   └─ payments: gateway.charge ..... 240ms
 └─ checkout: db.update "mark paid"  30ms
\`\`\`
~2 second mein aap dekhते ho: ye checkout nahi hai, ye gateway nahi hai, ye payments
ki INPUT QUEUE hai - payments process kar sakने se fast work accept kar raha hai.

**EK TRACE KYA DIKHATA HAI JO LOGS + METRICS NAHI:**
\`\`\`
- CRITICAL PATH: kaun se span ki duration actually total determine karती hai
- 6-service call mein time KAHAAN gaya, ek picture mein, bina 6 services ke logs by hand correlate kiye
- fan-out / N+1: "is span ne DB ko 47 baar call kiya" tree mein obvious hai
- ek RETRY STORM: 3 identical child spans, har ek timing out
- ek span jo bas WAIT kar raha hai (queue, lock, pool) vs ek span jo WORK kar raha hai
\`\`\`

**CONTEXT PROPAGATION** — trace_id + span_id ko HAR hop par travel karna chahिए:
\`\`\`
HTTP        traceparent  header (W3C Trace Context standard):
            traceparent: 00-<trace_id>-<parent_span_id>-01
            har service ise read karता hai, ek child span banाता hai, ise out pass karता hai.
QUEUES      publish par traceparent ko ek message attribute mein daalo; consumer ise
            read karता hai aur trace continue karता hai.
THREADS / ASYNC   context ek thread-local / contextvar / AsyncLocalStorage mein rehta hai.
            ek thread/goroutine spawn kar rahe ho? aapko context ise mein PROPAGATE karna hoga.
CROSS-RUNTIME   gRPC metadata, GraphQL, Kafka headers - sab ke ek propagation format hai.
\`\`\`
chain ko kahin bhi break karo -> trace do unconnected traces mein split ho jaता hai.

**OPENTELEMETRY (OTel)** — vendor-neutral standard:
\`\`\`
API         jo aapka code call karता hai: ek span start karo, ek attribute set karo.
SDK         implementation: sampling, batching, context management.
INSTRUMENTATION  libraries auto-instrument karo (HTTP servers/clients, DB drivers, queues).
OTLP        wire protocol: SDK -> COLLECTOR -> aapka backend (Jaeger/Tempo/Honeycomb/...).
            collector processing, sampling, fan-out karता hai.
\`\`\`

**SAMPLING** (aap har trace store nahi kar sakte):
\`\`\`
HEAD-BASED   ROOT par decide karो, request run hone se pehle: 1% rakho, decision
             propagate karो. cheap. PAR aap "slow wale rakho" nahi kar sakte.
TAIL-BASED   collector mein ek trace ke saare spans buffer karो, ye khatam hone ke
             BAAD decide karो: errors + slow traces ka 100% rakho + normal ka chhota %.
EXEMPLARS    ek histogram bucket mein ek sample trace_id attach karो -> p99 spike par
             click karो, seedhे ek trace par jump karो.
\`\`\``,

    content: `## Spans and the trace tree

A **span** is a single timed operation within a request — an incoming HTTP handler, an outbound call, a database query, a chunk of business logic you chose to measure. Each span carries a \`trace_id\` shared by every span in the request, its own \`span_id\`, the \`span_id\` of its parent (the operation that caused it), a name, a start and end time, a status of OK or ERROR, a set of key-value **attributes**, and optionally timestamped **events** within its duration. The spans of a request form a tree rooted at the first span, and rendering that tree as a **waterfall** — each span a horizontal bar positioned and sized by its time — makes the structure of the request visible at a glance.

The high-cardinality dimensions that must never go on a metric label — customer ID, request ID, the exact SQL, feature flags — belong on span attributes, because a tracing backend is built to store and query high-cardinality data.

## What a trace shows that logs and metrics do not

- **The critical path**: which span\'s duration actually determines the total. Work that happened in parallel and finished before the critical path did not contribute to the latency, and a trace shows this directly where a flat log stream does not.
- **Where the time went in a multi-service call**, in one picture, without manually lining up the logs of six services by timestamp.
- **Fan-out and N-plus-one patterns**: a span that made forty-seven child database calls is immediately obvious as forty-seven sibling spans in the tree.
- **A retry storm**: three identical child spans in sequence, each ending in a timeout.
- **Waiting versus working**: a span that represents time spent queued, blocked on a lock, or waiting for a connection looks different in the waterfall from a span doing computation, and telling them apart changes the fix.

## Context propagation

For the spans of one request to share a trace ID and form a tree, the trace context must travel with the request across every boundary it crosses.

- **HTTP**: the W3C Trace Context standard defines a \`traceparent\` header carrying the trace ID and the current span ID. Every service reads it from the incoming request, creates a child span, and writes an updated \`traceparent\` on every outbound call.
- **Queues and streams**: the \`traceparent\` is placed in a message attribute or header when the message is published, and the consumer reads it and continues the trace, so the span representing "time spent in the queue" is real elapsed time between publish and consume.
- **Threads and async**: within a process the context lives in a thread-local, a context variable, or async-local storage, so any log line or new span created anywhere in the request automatically attaches to it. When you spawn a new thread or goroutine, you must explicitly propagate the context into it, or spans created there become orphans.
- **Other runtimes**: gRPC metadata, GraphQL, and Kafka headers all have a defined way to carry the context.

If the chain is broken anywhere — a service that does not forward the header, a queue publish that omits the attribute, a thread spawned without the context — the trace splits into two unconnected traces and the picture is lost across that gap.

## OpenTelemetry

**OpenTelemetry** is the vendor-neutral standard for generating and exporting telemetry, and it has become the default.

- The **API** is what application code calls: start a span, set an attribute, record an exception, add an event.
- The **SDK** is the implementation behind the API: sampling decisions, batching, context management, and detecting resource attributes like the service name and pod.
- **Instrumentation libraries** automatically create spans for common libraries — HTTP servers and clients, database drivers, message queue clients — so the majority of spans exist without you writing span code; you add manual spans only for business logic worth measuring.
- **OTLP** is the wire protocol. The SDK exports over OTLP to a **collector**, a separate process that receives spans, applies processing and sampling, and fans out to one or more backends — Jaeger, Tempo, Honeycomb, Datadog, and others. The collector lets you change sampling policy, add or strip attributes, and switch backends without redeploying the application.

## Sampling

Storing a trace for every request is usually too expensive, so traces are sampled.

- **Head-based sampling** makes the keep-or-drop decision at the root span, before the request has run, and propagates that decision so every service in the request agrees. It is cheap and simple, but because the decision is made before the request executes, you cannot preferentially keep the slow or failed traces — you do not know yet which they will be.
- **Tail-based sampling** buffers all the spans of a trace in the collector until the request finishes, then decides: keep one hundred percent of traces that errored or exceeded a latency threshold, plus a small percentage of normal ones. This produces a far more useful sample, at the cost of the collector holding every in-flight trace in memory, which is significant infrastructure.
- **Exemplars** connect metrics to traces: a histogram bucket carries a sample trace ID of a request that fell into that bucket, so clicking a p99 spike on a dashboard jumps straight to an actual slow trace from that moment, closing the gap between "the metric shows a problem" and "here is a request that had it".`,

    contentHi: `## Spans aur trace tree

Ek **span** ek request ke andar ek single timed operation hai — ek incoming HTTP handler, ek outbound call, ek database query, business logic ka ek chunk jise aapne measure karne ka choose kiya. Har span ek \`trace_id\` carry karता hai jo request mein har span dwara shared hai, iska apna \`span_id\`, iske parent ka \`span_id\`, ek name, ek start aur end time, OK ya ERROR ka ek status, key-value **attributes** ka ek set, aur optionally iski duration ke andar timestamped **events**. Ek request ke spans first span par rooted ek tree banाते hain, aur us tree ko ek **waterfall** ke roop mein render karna request ki structure ko ek nazar mein visible banाता hai.

High-cardinality dimensions jo kabhi ek metric label par nahi jaani chahिए — customer ID, request ID, exact SQL — span attributes par belong karती hain.

## Ek trace kya dikhाता hai jo logs aur metrics nahi

- **Critical path**: kaun se span ki duration actually total determine karती hai.
- **Ek multi-service call mein time kahaan gaya**, ek picture mein, bina six services ke logs ko manually line up kiye.
- **Fan-out aur N-plus-one patterns**: ek span jo saatis child database calls kiye immediately obvious hai.
- **Ek retry storm**: sequence mein teen identical child spans, har ek ek timeout mein end hote hue.
- **Waiting versus working**: ek span jo queued spend kiya time represent karता hai waterfall mein computation karता ek span se different dikhता hai.

## Context propagation

Ek request ke spans ke ek trace ID share karne aur ek tree banाने ke liye, trace context ko request ke saath har boundary ke across travel karna chahिए jise ye cross karता hai.
- **HTTP**: W3C Trace Context standard ek \`traceparent\` header define karता hai jo trace ID aur current span ID carry karता hai.
- **Queues aur streams**: \`traceparent\` ko ek message attribute mein place kiya jaता hai jab message publish hota hai.
- **Threads aur async**: ek process ke andar context ek thread-local mein rehta hai. Jab aap ek naya thread spawn karते ho, aapko explicitly context ise mein propagate karna hoga.

Agar chain kahin bhi broken hai, trace do unconnected traces mein split ho jaता hai.

## OpenTelemetry

**OpenTelemetry** telemetry generate aur export karne ke liye vendor-neutral standard hai.
- **API** wo hai jo application code call karता hai.
- **SDK** API ke peeche implementation hai.
- **Instrumentation libraries** common libraries ke liye automatically spans banाती hain.
- **OTLP** wire protocol hai. SDK OTLP ke over ek **collector** ko export karता hai.

## Sampling

- **Head-based sampling** keep-or-drop decision root span par banाता hai. Ye cheap hai, par aap slow ya failed traces ko preferentially keep nahi kar sakte.
- **Tail-based sampling** collector mein ek trace ke saare spans buffer karता hai jab tak request khatam nahi hoती, phir decide karता hai: errored ya ek latency threshold exceed kiye traces ka ek sau percent rakho.
- **Exemplars** metrics ko traces se connect karते hain: ek histogram bucket ek sample trace ID carry karता hai.`,

    examples: [
      {
        title: 'Reading a trace waterfall to find the bottleneck in a 5-service request',
        titleHi: 'Ek 5-service request mein bottleneck dhoondhne ke liye ek trace waterfall padhna',
        code: `# trace 7f3a2b - a slow "GET /api/product/42" that a user reported. 2.9s total.

GET /api/product/42  [gateway] ..................................... 2870ms  ERROR? no, OK
├─ auth.verify_jwt  [gateway] ......... 8ms
├─ GET /product/42  [catalog] ..................................... 2810ms
│  ├─ db.query "SELECT * FROM products WHERE id=42"  [catalog] .... 12ms
│  ├─ GET /price/42  [pricing] ................................... 190ms
│  ├─ GET /inventory/42  [inventory] ............................. 2600ms   <-- HERE
│  │  ├─ inventory: cache.get "inv:42"  ......... 1ms   (MISS)
│  │  ├─ inventory: db.pool.acquire  ............ 2400ms   <-- 92% of inventory's time
│  │  └─ inventory: db.query "SELECT ... FROM stock_levels WHERE ..."  195ms
│  └─ GET /reviews/42  [reviews] ................................. 240ms
└─ response.serialize  [gateway] ...... 4ms

# READING IT:
# 1. total 2870ms. the critical path is  gateway -> catalog -> inventory -> pool.acquire.
#    pricing (190ms) and reviews (240ms) ran IN PARALLEL with inventory and did NOT
#    matter - optimising them saves nothing.
# 2. inventory is 2600ms of the 2870. within inventory, the db.pool.acquire span is
#    2400ms - inventory is WAITING for a database connection, not running a query
#    (the query itself is 195ms).
# 3. so: inventory's connection pool is saturated. NOT a slow query, NOT the gateway,
#    NOT catalog's own code. the fix is inventory's pool size or whatever is holding
#    connections (a slow query elsewhere, a leak, a traffic spike).
# 4. next: inventory's USE dashboard (Lesson 4) for  pool_active/pool_max  and
#    pool_acquire_wait  over the last hour, + logs filtered to trace_id=7f3a2b.

# a metric would have said "product page p99 is 3s". logs would have been 5 services'
# worth of lines to correlate. the TRACE says "inventory pool.acquire, 2.4s" in
# one screen.`,
        output: `The waterfall makes three things instant that metrics + logs don't: (1) the
CRITICAL PATH is gateway->catalog->inventory->pool.acquire; pricing and reviews ran
in parallel and are irrelevant. (2) inventory owns 2600 of 2870ms. (3) within
inventory, 2400ms is db.pool.acquire - WAITING for a connection, not a slow query.
Conclusion in one screen: inventory's connection pool is saturated. A metric only
said "3s p99"; logs would be 5 services to correlate.`,
        explain: 'A user-reported slow product page produces a trace with a total duration of two thousand eight hundred and seventy milliseconds, drawn as a waterfall across five services. Reading it top down: the gateway calls auth quickly, then calls the catalog service, which takes almost the entire time. Within the catalog call, three downstream calls are made — pricing, inventory, and reviews — and the waterfall shows they overlap, running in parallel. Pricing takes a hundred and ninety milliseconds and reviews takes two hundred and forty, but because they ran concurrently with inventory, which took two thousand six hundred, they are not on the critical path and optimising them would save nothing. Inventory is the problem. Drilling into the inventory span, its own database query took only a hundred and ninety-five milliseconds, but a span called \`db.pool.acquire\` took two thousand four hundred — inventory spent ninety-two percent of its time waiting to obtain a database connection, not running a query. That single observation determines the fix: inventory\'s connection pool is saturated, and the cause is pool size or whatever is holding connections, not a slow query, not the gateway, not the catalog\'s code. The next step is inventory\'s USE dashboard for pool utilisation and acquisition wait over the last hour, plus the logs filtered to this trace ID. A metric would only have said the product page p99 is three seconds; the logs would be five services\' worth of lines to correlate by hand; the trace gives the answer in one screen.',
        explainHi: 'Ek user-reported slow product page ek trace produce karता hai do hazaar aath sau sattar millisecond ki total duration ke saath, paanch services ke across ek waterfall ke roop mein drawn. Ise top down padhna: gateway auth ko jaldi call karता hai, phir catalog service ko call karता hai, jo lagbhag poora time leता hai. Catalog call ke andar, teen downstream calls kiye jaते hain — pricing, inventory, aur reviews — aur waterfall dikhता hai wo overlap karते hain, parallel mein running. Pricing ek sau navve millisecond leता hai aur reviews do sau chalees, par kyunki wo inventory ke saath concurrently daudे, jo do hazaar chhah sau leta, wo critical path par nahi hain. Inventory problem hai. Inventory span mein drill karke, iski apni database query sirf ek sau pichyaanvaan millisecond legi, par ek span jise \`db.pool.acquire\` kaha gaya do hazaar chaar sau leta — inventory ne apna barasi percent time ek database connection obtain karने ka wait karता spend kiya. Wo single observation fix determine karता hai.',
      },
      {
        title: 'A broken propagation chain: one trace becomes two, and the gap that hides',
        titleHi: 'Ek broken propagation chain: ek trace do ban jaता hai, aur wo gap jo chhupता hai',
        code: `# EXPECTED: one trace, order-service -> (SQS) -> fulfillment-worker
order-service: POST /orders  [trace 9a1b] ......... 120ms
 └─ order-service: sqs.publish "order-created"  [trace 9a1b, span x] ... 8ms
    ...message sits in the queue for 40s (a backlog)...
fulfillment-worker: process "order-created"  [trace 9a1b, parent=span x] ... 2100ms
 ├─ fulfillment-worker: db.write  ......... 30ms
 └─ fulfillment-worker: POST /labels (shipping API) ..... 2000ms

# ACTUAL (the publish did NOT put traceparent in the message attributes):
TRACE 9a1b (order-service only):
  POST /orders ......... 120ms
   └─ sqs.publish ....... 8ms                    # ends here. looks fine. 120ms. green.

TRACE c4d2 (fulfillment-worker only, a NEW root - no parent):
  process "order-created" ......... 2100ms
   ├─ db.write ......... 30ms
   └─ POST /labels ..... 2000ms

# WHAT'S LOST:
# - the 40 SECONDS the message spent in the queue is INVISIBLE. neither trace
#   covers "publish -> consume". a customer's "why did my order take 45s to
#   confirm" cannot be answered from traces - the biggest chunk of time is in
#   the gap between two disconnected traces.
# - you can't go from the slow order (trace 9a1b) to the slow fulfillment
#   (trace c4d2) - they share no id. correlation is back to timestamp-guessing.

# THE FIX:
  # publish:
  const carrier = {};
  propagation.inject(context.active(), carrier);   # writes 'traceparent' into carrier
  sqs.send({ MessageBody: body,
             MessageAttributes: { traceparent: { DataType:"String",
                                                 StringValue: carrier.traceparent } } });
  # consume:
  const parentCtx = propagation.extract(context.active(),
                      { traceparent: msg.MessageAttributes.traceparent.StringValue });
  tracer.startActiveSpan("process order-created", { }, parentCtx, span => { ... });
  # now it's ONE trace, and the queue time is a real span between publish.end and
  # process.start.`,
        output: `The publish didn't carry traceparent into the message, so the worker started a
brand-new root trace with no parent. Result: two disconnected traces, and the 40
SECONDS the message spent in the queue - the single largest part of the
end-to-end time - is in the GAP between them, invisible to tracing entirely. The
fix is to inject traceparent into a message attribute on publish and extract it
on consume, making it one trace with the queue wait as a real span.`,
        explain: 'An order flow spans two services connected by a queue: the order service handles the HTTP request and publishes a message, and a fulfilment worker later consumes it and calls a shipping API. When trace context is propagated correctly this is one trace, and the time the message spent sitting in the queue appears as real elapsed time between the publish span ending and the process span starting. But if the publish call does not write the \`traceparent\` into the message attributes, the worker has nothing to continue from and starts a brand-new root trace with no parent. The result is two separate traces that share no identifier: one covering only the order service and looking perfectly healthy at a hundred and twenty milliseconds, and one covering only the worker. The forty seconds the message spent in the queue — which is the single largest component of the end-to-end time and exactly what a customer asking "why did my order take forty-five seconds to confirm" wants explained — falls into the gap between the two disconnected traces and is invisible to tracing entirely. You also cannot pivot from the slow order to the slow fulfilment because they share no trace ID, so correlation drops back to guessing by timestamp. The fix is to inject the trace context into a message attribute when publishing and extract it when consuming, which reconnects the two into one trace with the queue wait represented as a real span.',
        explainHi: 'Ek order flow do services span karता hai jo ek queue se connected hain: order service HTTP request handle karता hai aur ek message publish karता hai, aur ek fulfilment worker baad mein ise consume karता hai aur ek shipping API call karता hai. Jab trace context correctly propagate hota hai ye ek trace hai, aur wo time jo message queue mein baithा spend kiya publish span ke end hone aur process span ke start hone ke beech real elapsed time ke roop mein appear karता hai. Par agar publish call \`traceparent\` ko message attributes mein nahi likhता, worker ke paas continue karne ke liye kuch nahi hai aur ek brand-new root trace start karता hai bina parent ke. Result do separate traces hain jo koi identifier share nahi karते. Wo chalees second jo message queue mein spend kiye — jo end-to-end time ka single largest component hai — do disconnected traces ke beech gap mein fall hota hai aur tracing ke liye poori tarah invisible hai. Fix trace context ko ek message attribute mein inject karna hai publish karते samay.',
      },
    ],

    mistakes: [
      {
        wrong: `# spawning a worker thread / goroutine / task without propagating the context
  # (Python) inside a request handler:
  for item in cart.items:
      threading.Thread(target=reserve_stock, args=(item,)).start()   # <-- new thread
  # reserve_stock() creates spans, but the trace context lives in a contextvar that
  # is NOT copied to the new thread -> those spans have no parent -> they either
  # become orphan root traces (noise) or are dropped. the trace of the request
  # shows the handler as fast and "done" while 6 background threads are still
  # working - the picture is a lie.`,
        right: `# capture the context and re-attach it inside the new thread/task:
  # (Python / OTel)
  from opentelemetry import context as otel_context
  ctx = otel_context.get_current()                 # snapshot HERE, on the request thread
  def run_with_ctx(item):
      token = otel_context.attach(ctx)             # re-attach in the worker thread
      try:
          reserve_stock(item)                      # its spans now parent correctly
      finally:
          otel_context.detach(token)
  for item in cart.items:
      threading.Thread(target=run_with_ctx, args=(item,)).start()
  # better: use a context-propagating executor / structured concurrency that does
  # this for you (many OTel instrumentations wrap ThreadPoolExecutor, asyncio, etc).
  # and: make the parent span WAIT for the children (or record them as span links)
  # so the waterfall reflects reality.`,
        why: 'Trace context inside a process is stored in thread-local or task-local storage — a context variable in Python, async-local storage in Node, a context object passed explicitly in Go — so that any span or log created during a request automatically attaches to the right parent without threading a context argument through every function. That mechanism does not automatically follow when you start a new thread, goroutine, or background task: the new execution unit gets a fresh, empty context. Any spans created there have no parent from the request, so they either become orphan root traces that add noise to the tracing backend or are dropped entirely, and the request\'s own trace shows the handler completing quickly while background work is still running — the waterfall misrepresents what actually happened. The fix is to capture the current context on the originating thread, before spawning, and re-attach it inside the new thread or task so spans created there parent correctly, detaching it when done. Better still is to use a context-propagating executor or the structured-concurrency primitives that many OpenTelemetry instrumentations provide, which wrap thread pools and async task creation to do this automatically. And the parent span should either wait for the children or record them as span links, so the trace reflects that the request was not actually finished when the handler returned.',
        whyHi: 'Ek process ke andar trace context thread-local ya task-local storage mein stored hai — Python mein ek context variable, Node mein async-local storage, Go mein explicitly passed ek context object — taaki ek request ke dauraan banaya gaya koi bhi span ya log automatically right parent se attach ho. Wo mechanism automatically follow nahi karता jab aap ek naya thread, goroutine, ya background task start karते ho: naya execution unit ek fresh, empty context paता hai. Wahaan banaye gaye koi bhi spans ke request se koi parent nahi hai, to wo ya to orphan root traces ban jaते hain jo tracing backend mein noise add karते hain ya poori tarah dropped hain. Fix current context ko originating thread par capture karna hai, spawning se pehle, aur ise naye thread ke andar re-attach karna. Better ek context-propagating executor use karna hai.',
      },
      {
        wrong: `# using head-based sampling at 1% and then wondering why you can't find the slow ones
  # sampler: TraceIdRatioBased(0.01)  -> keep 1% of ALL traces, decided at the root.
  # incident: p99 latency spiked. you open the tracing UI to find a slow trace...
  # and 99% of traces (including almost all the slow ones) were never stored.
  # you have a handful of random 1% traces, most of them fast and boring. the ONE
  # trace that would explain the incident was dropped before the request even ran.`,
        right: `# tail-based sampling in the collector: decide AFTER the trace completes:
  # otel-collector  tail_sampling processor:
  policies:
    - name: keep-all-errors      type: status_code   status_codes: [ERROR]
    - name: keep-slow            type: latency       threshold_ms: 1000
    - name: keep-baseline        type: probabilistic  sampling_percentage: 5
  # now you ALWAYS have: 100% of errored traces, 100% of traces > 1s, + 5% of
  # normal traffic for baseline comparison. the slow trace during the incident
  # IS there.
  # cost: the collector must buffer every in-flight trace for a few seconds
  # (decision_wait) - size it for  peak_traces_per_sec x avg_trace_duration x spans.
  # if you must do head-based: at least keep 100% and reduce retention, or sample
  # by route so critical paths keep more.`,
        why: 'Head-based sampling decides whether to keep a trace at the root span, before the request has executed, and propagates that decision so all services agree. At a one percent rate this means ninety-nine percent of traces are discarded at their very first span, and the decision is blind to how the request turns out — you cannot say "keep it if it is slow or errors" because that is not known yet. During an incident, when you open the tracing tool to find a trace of the slow behaviour, almost all the slow traces were among the ninety-nine percent dropped before they ran, and you are left with a random one percent that is mostly fast and uninformative. Tail-based sampling fixes this by moving the decision into the collector and making it after the trace completes: the collector buffers all of a trace\'s spans for a few seconds, then applies policies — keep every trace that contains an error, keep every trace over a latency threshold, and keep a small percentage of the rest for baseline. This guarantees that the interesting traces are always retained, at the cost of the collector holding every in-flight trace in memory for the decision window, which must be sized for peak throughput times average trace duration. If tail-based sampling is not available, the fallbacks are to keep a much higher percentage with shorter retention, or to sample by route so that critical user paths retain more traces than background chatter.',
        whyHi: 'Head-based sampling decide karता hai ki ek trace ko root span par keep karna hai ya nahi, request execute hone se pehle, aur us decision ko propagate karता hai. Ek ek percent rate par iska matlab navve navve percent traces unke pehle span par discard hote hain, aur decision blind hai ki request kaise turn out hoती hai — aap "agar ye slow hai ya errors to keep karो" nahi keh sakte kyunki wo abhi tak known nahi hai. Ek incident ke dauraan, jab aap slow behaviour ke ek trace ko dhoondhne ke liye tracing tool open karते ho, lagbhag saare slow traces navve navve percent mein the jo run hone se pehle dropped. Tail-based sampling ise fix karता hai decision ko collector mein move karke aur ise trace complete hone ke baad banाकर. Ye guarantee karता hai ki interesting traces hamesha retained hain.',
      },
      {
        wrong: `# instrumenting only your own code and treating third-party libraries as black boxes
  # you add manual spans around your business logic:
  with tracer.start_as_current_span("compute_recommendations"):
      recs = self._rank(candidates)
  # but the HTTP client, the DB driver, the Redis client, the Kafka consumer -
  # none of them are instrumented. so the trace shows:
  #   compute_recommendations ... 1800ms
  #     (a flat 1800ms bar. what's IN it? a DB call? 3 DB calls? a slow HTTP call
  #      to a feature store? you can't tell - it's opaque.)`,
        right: `# enable auto-instrumentation for the common libraries FIRST, then add manual
  # spans for business logic on top:
  #   pip install opentelemetry-instrumentation-{requests,psycopg2,redis,kafka,...}
  #   opentelemetry-instrument python app.py       # or the SDK's auto-init
  # now the SAME code produces:
  #   compute_recommendations ... 1800ms
  #    ├─ GET feature-store/vectors  [http] ..... 1400ms   <-- the actual problem
  #    ├─ redis GET "user:8813:hist"  ........... 2ms
  #    └─ db SELECT ... FROM items WHERE ...  .... 180ms  (x2)
  # the auto-instrumented spans localise the time WITHOUT you writing any span code
  # for I/O. your manual spans add the business-logic structure (which phase,
  # which algorithm) that auto-instrumentation can't know.`,
        why: 'Auto-instrumentation libraries hook the common I/O libraries — HTTP clients and servers, database drivers, cache clients, message queue clients — and create a span for every call through them automatically, capturing the operation, the target, the duration, and the status. If you skip this and only add manual spans around your own business logic, those manual spans become opaque bars: a span named "compute recommendations" showing eighteen hundred milliseconds tells you that phase was slow but not whether the time went into a database call, three database calls, or a slow HTTP request to an external service, because none of the I/O inside it is broken out. The correct order is to enable auto-instrumentation for the common libraries first, which localises the time spent in I/O without writing any span code, and then add manual spans on top for the business-logic structure that auto-instrumentation cannot infer — which processing phase, which algorithm branch, which business operation. With both, the same "compute recommendations" span becomes a subtree showing a fourteen-hundred-millisecond call to a feature store as the actual culprit, a two-millisecond cache hit, and a couple of fast database queries, and the fix is obvious.',
        whyHi: 'Auto-instrumentation libraries common I/O libraries ko hook karती hain — HTTP clients aur servers, database drivers, cache clients, message queue clients — aur unke through har call ke liye automatically ek span banाती hain. Agar aap ise skip karते ho aur sirf apni business logic ke around manual spans add karते ho, wo manual spans opaque bars ban jaते hain: "compute recommendations" naam ka ek span athara sau millisecond dikhता hua aapko batata hai ki phase slow tha par ye nahi ki time ek database call, teen database calls, ya ek external service ko ek slow HTTP request mein gaya. Correct order pehle common libraries ke liye auto-instrumentation enable karna hai, aur phir upar business-logic structure ke liye manual spans add karna.',
      },
    ],

    realWorld: [
      {
        en: '**One trace, one screen, one connection pool** — a 5-service product page was "3s p99" for a week; three engineers had blamed the DB, the gateway, and the CDN in turn. A single trace showed 2.4s in `inventory: db.pool.acquire` — a pool of 10 that needed 40 after a traffic shift. Fixed in an hour once the trace was read.',
        hi: '**Ek trace, ek screen, ek connection pool** — ek 5-service product page ek hafte "3s p99" tha; teen engineers ne DB, gateway, aur CDN ko baari baari blame kiya. Ek single trace ne `inventory: db.pool.acquire` mein 2.4s dikhaya.',
      },
      {
        en: '**The 40-second gap** — customers complained orders took ~45s to confirm; traces showed the order service at 120ms and the worker at 2s, both healthy. The publish wasn\'t carrying `traceparent` into the SQS message, so the 40s of queue backlog was invisible between two disconnected traces. Injecting/extracting the context made the queue wait a visible span.',
        hi: '**40-second gap** — customers ne complain kiya orders ~45s confirm hone lagे; traces ne order service ko 120ms aur worker ko 2s dikhaya, dono healthy. Publish `traceparent` ko SQS message mein carry nahi kar raha tha. Context inject/extract karna queue wait ko ek visible span bana diya.',
      },
      {
        en: '**Head sampling at 0.5%, blind during an incident** — a team ran head-based sampling at 0.5%. During a latency incident the tracing UI had no slow traces to show (they were dropped at the root). Moving tail-sampling into the collector (keep 100% of errors + >1s) meant the next incident had the trace ready.',
        hi: '**0.5% par head sampling, ek incident ke dauraan blind** — ek team ne 0.5% par head-based sampling chalaya. Ek latency incident ke dauraan tracing UI ke paas dikhane ke liye koi slow traces nahi the. Collector mein tail-sampling move karna (errors + >1s ka 100% rakho) agle incident ke liye trace ready banaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a span, what is a trace, and what does a trace show that logs and metrics do not?',
        qHi: 'Ek span kya hai, ek trace kya hai, aur ek trace kya dikhाता hai jo logs aur metrics nahi?',
        a: 'A span is a single timed operation within a request — an incoming handler, an outbound call, a database query, a measured chunk of business logic. Each span carries a trace ID shared by every span in the request, its own span ID, its parent span ID, a name, start and end times, a status, key-value attributes, and optional timestamped events. The spans of one request form a tree rooted at the first span, and that is a trace. Rendered as a waterfall — each span a bar positioned and sized by its time — a trace shows several things logs and metrics cannot. It shows the critical path: which span\'s duration actually determined the total, versus work that ran in parallel and did not matter, so you optimise the right thing. It shows where the time went across a multi-service call in one picture, without lining up six services\' logs by timestamp. It makes fan-out and N-plus-one obvious — forty-seven sibling database spans are visually unmistakable. It reveals a retry storm as three identical timing-out child spans. And it distinguishes a span that is waiting — queued, blocked on a lock, waiting for a connection — from a span doing computation, which changes the fix. High-cardinality dimensions that must never be metric labels — customer ID, the exact query, feature flags — belong on span attributes, because a tracing backend is built for high cardinality.',
        aHi: 'Ek span ek request ke andar ek single timed operation hai — ek incoming handler, ek outbound call, ek database query. Har span ek trace ID carry karता hai jo request mein har span dwara shared hai, iska apna span ID, iska parent span ID, ek name, start aur end times, ek status, key-value attributes. Ek request ke spans first span par rooted ek tree banाते hain, aur wo ek trace hai. Ek waterfall ke roop mein rendered, ek trace kई cheezein dikhता hai jo logs aur metrics nahi kar sakte. Ye critical path dikhता hai: kaun se span ki duration actually total determine kiya. Ye ek multi-service call ke across time kahaan gaya ek picture mein dikhता hai. Ye fan-out aur N-plus-one obvious banाता hai. Ye ek retry storm reveal karता hai. Aur ye ek span jo wait kar raha hai ko ek span jo computation kar raha hai se distinguish karता hai.',
      },
      {
        q: 'What is context propagation, where must it happen, and what breaks if the chain is broken?',
        qHi: 'Context propagation kya hai, ise kahaan hona chahिए, aur agar chain broken hai to kya break hota hai?',
        a: 'Context propagation is carrying the trace context — the trace ID and the current span ID — along with the request across every boundary it crosses, so all the spans of one request share a trace ID and form a single tree. Over HTTP it is the W3C Trace Context traceparent header: each service reads it from the incoming request, creates a child span, and writes an updated traceparent on every outbound call. Over queues and streams the traceparent is placed in a message attribute on publish and read by the consumer, so the span representing time spent in the queue is real elapsed time between publish and consume. Within a process the context lives in thread-local or async-local storage so spans and logs attach automatically, but when you spawn a new thread, goroutine, or background task you must explicitly propagate the context into it or its spans become orphans. gRPC, GraphQL, and Kafka each have a defined propagation format too. If the chain is broken anywhere — a service that does not forward the header, a publish that omits the attribute, a thread spawned without the context — the trace splits into two unconnected traces. The consequence is that the time spent in the gap becomes invisible: if a message sits in a queue for forty seconds and the publish did not carry the context, that forty seconds is in neither trace, and a customer asking why their request was slow cannot be answered from traces. You also lose the ability to pivot from the slow upstream to the slow downstream because they no longer share an ID.',
        aHi: 'Context propagation trace context ko — trace ID aur current span ID — request ke saath har boundary ke across carry karna hai jise ye cross karता hai, taaki ek request ke saare spans ek trace ID share karें aur ek single tree banाें. HTTP ke over ye W3C Trace Context traceparent header hai. Queues aur streams ke over traceparent publish par ek message attribute mein place kiya jaता hai aur consumer dwara read kiya jaता hai. Ek process ke andar context thread-local ya async-local storage mein rehta hai, par jab aap ek naya thread spawn karते ho aapko explicitly context ise mein propagate karना hoga. Agar chain kahin bhi broken hai, trace do unconnected traces mein split ho jaता hai. Consequence ye hai ki gap mein spend kiya time invisible ho jaता hai.',
      },
      {
        q: 'What does OpenTelemetry provide, and what is the difference between head-based and tail-based sampling?',
        qHi: 'OpenTelemetry kya provide karता hai, aur head-based aur tail-based sampling mein kya difference hai?',
        a: 'OpenTelemetry is the vendor-neutral standard for generating and exporting telemetry. It has an API that application code calls to start a span, set an attribute, or record an exception; an SDK that implements sampling, batching, context management, and resource detection; instrumentation libraries that automatically create spans for common libraries like HTTP servers and clients, database drivers, and queue clients, so most spans exist without writing span code; and OTLP, the wire protocol, over which the SDK exports to a collector — a separate process that receives spans, applies processing and sampling, and fans out to backends like Jaeger, Tempo, Honeycomb, or Datadog, letting you change sampling and switch backends without redeploying the app. Head-based sampling makes the keep-or-drop decision at the root span, before the request runs, and propagates it so every service agrees. It is cheap and simple but blind: at one percent, ninety-nine percent of traces are dropped before you know whether they were slow or errored, so during an incident the slow traces you need were mostly discarded at their first span. Tail-based sampling moves the decision into the collector and makes it after the trace completes: the collector buffers all of a trace\'s spans for a few seconds, then keeps one hundred percent of errored traces, one hundred percent over a latency threshold, and a small percentage of normal ones. This guarantees the interesting traces are always kept, at the cost of the collector holding every in-flight trace in memory, sized for peak throughput times average trace duration.',
        aHi: 'OpenTelemetry telemetry generate aur export karne ke liye vendor-neutral standard hai. Iske paas ek API hai jise application code call karता hai; ek SDK jo sampling, batching, context management implement karता hai; instrumentation libraries jo common libraries ke liye automatically spans banाती hain; aur OTLP, wire protocol, jiske over SDK ek collector ko export karता hai. Head-based sampling keep-or-drop decision root span par banाता hai, request run hone se pehle. Ye cheap hai par blind: ek percent par, navve navve percent traces dropped hote hain iske pehle aap jaano ki wo slow the ya errored. Tail-based sampling decision ko collector mein move karता hai aur ise trace complete hone ke baad banाता hai: errored traces ka ek sau percent, ek latency threshold ke over ek sau percent, aur normal ka ek chhota percentage rakhता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define a span (its fields) and a trace, describe the waterfall, and list what a trace shows that logs + metrics cannot.',
        taskHi: 'Ek comment mein, ek span aur ek trace define karo.',
        hint: 'A SPAN = one timed operation within a request (an incoming handler, an outbound call, a DB query, a measured chunk of business logic). FIELDS: `trace_id` (SAME for every span in the request), `span_id` (unique to this span), `parent_span_id` (the span that caused this one — the root has none), `name`, `start`/`end`/`duration_ms`, `service`, `status` (OK | ERROR), `attributes` (key-value — HIGH-CARDINALITY lives HERE: `customer_id`, the exact SQL, feature flags — never on a metric label), `events` (timestamped points within the span, e.g. `{name:"retry", attrs:{attempt:2}}`). A TRACE = the spans of ONE request, forming a TREE rooted at the first span. THE WATERFALL = render each span as a horizontal bar positioned + sized by its time, nested under its parent → the request\'s structure is visible at a glance. WHAT A TRACE SHOWS THAT LOGS + METRICS CAN\'T: (1) the CRITICAL PATH — which span\'s duration actually DETERMINED the total, vs work that ran IN PARALLEL and didn\'t matter (optimising a parallel span saves nothing). (2) WHERE the time went across a 6-service call, in ONE picture, without lining up 6 services\' logs by timestamp. (3) FAN-OUT / N+1 — "this span called the DB 47 times" is visually unmistakable (47 sibling spans). (4) a RETRY STORM — 3 identical child spans in sequence, each ending in a timeout. (5) WAITING vs WORKING — a span that\'s queued / blocked on a lock / waiting for a pool connection LOOKS different from a span doing computation, and telling them apart CHANGES THE FIX (a slow query → optimise it; a 2.4s `db.pool.acquire` → the pool is saturated, not the query).',
        hintHi: 'EK SPAN = ek request ke andar ek timed operation. FIELDS: `trace_id` (request ke har span ke liye SAME), `span_id` (unique), `parent_span_id` (jo span ise cause kiya — root ke koi nahi), `name`, `start`/`end`/`duration_ms`, `service`, `status` (OK | ERROR), `attributes` (HIGH-CARDINALITY YAHAN: `customer_id`, exact SQL, feature flags — kabhi metric label par nahi), `events`. EK TRACE = EK request ke spans, first span par rooted ek TREE. WATERFALL = har span ko ek horizontal bar ke roop mein render karo. TRACE KYA DIKHATA HAI JO LOGS + METRICS NAHI: (1) CRITICAL PATH — kaun se span ki duration actually total DETERMINE kiya. (2) 6-service call mein time KAHAAN gaya, ONE picture mein. (3) FAN-OUT / N+1 — "47 baar DB call" visually unmistakable. (4) RETRY STORM. (5) WAITING vs WORKING — ek 2.4s `db.pool.acquire` → pool saturated, query nahi.',
      },
      {
        task: 'In a comment, explain context propagation across HTTP / queues / threads, what breaks if the chain breaks, and what OpenTelemetry (API/SDK/instrumentation/OTLP/collector) provides.',
        taskHi: 'Ek comment mein, context propagation aur OpenTelemetry samjhao.',
        hint: 'CONTEXT PROPAGATION = carrying `trace_id` + `span_id` with the request across EVERY hop, so all spans of one request share a trace_id and form one tree. HTTP: the W3C Trace Context `traceparent` header (`00-<trace_id>-<parent_span_id>-01`) — every service reads it in, creates a CHILD span, writes an updated `traceparent` on every OUTBOUND call. QUEUES/STREAMS: `propagation.inject()` writes `traceparent` into a message ATTRIBUTE on publish; the consumer `propagation.extract()`s it and continues the trace → the "time in queue" span is REAL elapsed time between publish and consume. THREADS/ASYNC: within a process the context lives in a thread-local / contextvar / AsyncLocalStorage so spans + logs auto-attach; BUT spawning a new thread/goroutine/task gives it a FRESH EMPTY context → you MUST capture the context on the origin thread and re-attach it inside the worker (or use a context-propagating executor). gRPC metadata / Kafka headers / GraphQL each have a propagation format. IF THE CHAIN BREAKS ANYWHERE (a service doesn\'t forward the header, a publish omits the attribute, a thread spawned without the context): the trace SPLITS into TWO UNCONNECTED traces → the time spent IN THE GAP becomes INVISIBLE (a message sitting in a queue 40s, if the publish didn\'t carry context, is in NEITHER trace) → "why was my order slow" can\'t be answered from traces; and you can\'t pivot slow-upstream → slow-downstream (no shared id → back to timestamp-guessing). OPENTELEMETRY (vendor-neutral, the default): API = what your code calls (start a span, set an attribute, record an exception). SDK = the implementation (sampling, batching, context management, resource detection). INSTRUMENTATION LIBRARIES = auto-create spans for common libs (HTTP servers/clients, DB drivers, queue clients) → most spans exist without span code; add MANUAL spans only for business logic. OTLP = the wire protocol: SDK → a COLLECTOR (a separate process: receives spans, applies processing + sampling, fans out to backends — Jaeger/Tempo/Honeycomb/Datadog) → lets you change sampling + switch backends WITHOUT touching app code. Enable auto-instrumentation FIRST (so I/O time is localised without writing span code), THEN add manual spans for business structure on top.',
        hintHi: 'CONTEXT PROPAGATION = `trace_id` + `span_id` ko request ke saath HAR hop par carry karna. HTTP: W3C `traceparent` header — har service ise read karता hai, ek CHILD span banाता hai, out pass karता hai. QUEUES: publish par `traceparent` ko ek message ATTRIBUTE mein inject karo; consumer extract karता hai → "time in queue" span REAL elapsed time hai. THREADS/ASYNC: context ek thread-local mein rehta hai; PAR ek naya thread FRESH EMPTY context paता hai → aapko context capture aur re-attach karna hoga. AGAR CHAIN KAHIN BHI BREAKS: trace do UNCONNECTED traces mein SPLIT → gap mein time INVISIBLE. OPENTELEMETRY: API = jo aapka code call karता hai. SDK = implementation. INSTRUMENTATION = common libs ke liye auto-spans. OTLP = wire protocol: SDK → COLLECTOR → backends. Auto-instrumentation PEHLE enable karo, PHIR manual spans upar.',
      },
      {
        task: 'In a comment, contrast head-based and tail-based sampling (where the decision is made, cost, what each can/can\'t do), and explain exemplars.',
        taskHi: 'Ek comment mein, head-based aur tail-based sampling ka contrast karo.',
        hint: 'You CAN\'T store a trace for every request → traces are SAMPLED. HEAD-BASED sampling: the keep-or-drop decision is made at the ROOT span, BEFORE the request runs, and PROPAGATED so every service in the trace agrees. Cost: CHEAP + SIMPLE (one decision, no buffering). CAN\'T: preferentially keep the slow/errored traces — at the root you don\'t know yet how the request turns out. CONSEQUENCE: at 1%, 99% of traces (including almost all the slow ones) are discarded at their FIRST span → during a latency incident the tracing UI has NO slow trace to show — it was dropped before the request even ran. TAIL-BASED sampling: the collector BUFFERS all spans of a trace for a few seconds (`decision_wait`), then decides AFTER the trace completes, with policies: keep 100% of ERRORED traces + 100% over a LATENCY threshold (e.g. > 1s) + a small % (~5%) of NORMAL traffic for baseline. CAN: guarantee the interesting traces are always retained. Cost: the collector must hold EVERY in-flight trace in memory for the decision window → size it for `peak_traces_per_sec × avg_trace_duration × spans_per_trace` (significant infra). FALLBACK if tail isn\'t available: keep a much higher % with shorter retention, OR sample BY ROUTE so critical user paths keep more than background chatter. EXEMPLARS: attach a sample `trace_id` to a HISTOGRAM BUCKET → on a Grafana panel, click the p99 spike → jump STRAIGHT to an actual slow trace that fell into that bucket at that moment → closes the gap between "the metric shows a problem" and "here is a request that had it".',
        hintHi: 'Aap har request ke liye ek trace store NAHI kar sakte → traces SAMPLED hain. HEAD-BASED: keep-or-drop decision ROOT span par, request run hone se PEHLE, aur PROPAGATED. Cost: CHEAP + SIMPLE. CAN\'T: slow/errored traces preferentially keep — root par aap abhi jaano nahi. CONSEQUENCE: 1% par, 99% traces PEHLE span par discard → ek latency incident ke dauraan tracing UI ke paas dikhane ke liye KOI slow trace nahi. TAIL-BASED: collector saare spans ko kuch second BUFFER karता hai, phir trace complete hone ke BAAD decide karता hai: ERRORED ka 100% + LATENCY threshold ke over 100% + NORMAL ka ~5%. Cost: collector ko HAR in-flight trace memory mein hold karna. FALLBACK: zyada % + shorter retention, YA ROUTE se sample. EXEMPLARS: ek HISTOGRAM BUCKET mein ek sample `trace_id` attach karो → p99 spike par click → SEEDHE ek slow trace par jump.',
      },
    ],

    keyTakeaways: [
      'A SPAN = one timed operation (`trace_id` shared by the request, `span_id`, `parent_span_id`, name, start/end, status, ATTRIBUTES — high-cardinality lives here, never on metric labels — and timestamped EVENTS). A TRACE = the spans of one request as a TREE, rendered as a WATERFALL.',
      'A TRACE SHOWS what logs + metrics can\'t: the CRITICAL PATH (which span\'s duration set the total vs parallel work that didn\'t matter), WHERE the time went across a multi-service call in ONE picture, FAN-OUT / N+1 (47 sibling DB spans), a RETRY STORM (3 identical timing-out children), and WAITING (queue/lock/pool) vs WORKING — a 2.4 s `db.pool.acquire` means the pool is saturated, NOT the query.',
      'CONTEXT PROPAGATION carries `trace_id` + `span_id` across EVERY hop: HTTP via the W3C `traceparent` header, queues via a message attribute (inject on publish, extract on consume — the queue-wait span is real time), threads/async via thread-local storage — but a SPAWNED thread gets a fresh empty context, so you MUST capture + re-attach. Break the chain anywhere → two disconnected traces and the time in the gap is INVISIBLE.',
      'OPENTELEMETRY (the vendor-neutral default): API (your code calls it), SDK (sampling/batching/context), INSTRUMENTATION libraries (auto-spans for HTTP/DB/queue clients — enable these FIRST so I/O time is localised without span code), OTLP → a COLLECTOR (processing, sampling, fan-out to Jaeger/Tempo/Honeycomb/Datadog — switch backends without touching the app).',
      'SAMPLING: HEAD-BASED decides at the root before the request runs — cheap, but you CAN\'T keep the slow ones (you don\'t know yet), so at 1% an incident\'s slow traces were dropped at their first span. TAIL-BASED buffers all spans in the collector and decides AFTER — keep 100% of errors + 100% over a latency threshold + ~5% baseline — far more useful, costs the collector holding every in-flight trace. EXEMPLARS attach a sample `trace_id` to a histogram bucket → click a p99 spike, jump to the actual slow trace.',
    ],
    keyTakeawaysHi: [
      'EK SPAN = ek timed operation (`trace_id` request dwara shared, `span_id`, `parent_span_id`, name, start/end, status, ATTRIBUTES — high-cardinality yahan, kabhi metric labels par nahi — aur timestamped EVENTS). EK TRACE = ek request ke spans ek TREE ke roop mein, ek WATERFALL ke roop mein rendered.',
      'EK TRACE DIKHATA HAI jo logs + metrics nahi: CRITICAL PATH (kaun se span ki duration total set kiya vs parallel work jo matter nahi kiya), ek multi-service call ke across time KAHAAN gaya ONE picture mein, FAN-OUT / N+1 (47 sibling DB spans), ek RETRY STORM, aur WAITING (queue/lock/pool) vs WORKING — ek 2.4 s `db.pool.acquire` ka matlab pool saturated hai, query NAHI.',
      'CONTEXT PROPAGATION `trace_id` + `span_id` ko HAR hop par carry karता hai: HTTP W3C `traceparent` header ke through, queues ek message attribute ke through (publish par inject, consume par extract — queue-wait span real time hai), threads/async thread-local storage ke through — par ek SPAWNED thread ek fresh empty context paता hai, to aapko capture + re-attach karna HOGA. Chain kahin bhi break karो → do disconnected traces aur gap mein time INVISIBLE.',
      'OPENTELEMETRY (vendor-neutral default): API (aapka code call karता hai), SDK (sampling/batching/context), INSTRUMENTATION libraries (HTTP/DB/queue clients ke liye auto-spans — inhe PEHLE enable karो), OTLP → ek COLLECTOR (processing, sampling, fan-out to Jaeger/Tempo/Honeycomb/Datadog).',
      'SAMPLING: HEAD-BASED root par decide karता hai request run hone se pehle — cheap, par aap slow wale KEEP nahi kar sakte, to 1% par ek incident ke slow traces unke pehle span par dropped. TAIL-BASED collector mein saare spans buffer karता hai aur BAAD mein decide karता hai — errors ka 100% + latency threshold ke over 100% + ~5% baseline. EXEMPLARS ek histogram bucket mein ek sample `trace_id` attach karते hain → ek p99 spike par click, actual slow trace par jump.',
    ],
  },

  {
    slug: 'ops-slos-error-budgets-and-alerting',
    title: 'SLOs, Error Budgets & Alerting',
    titleHi: 'SLOs, Error Budgets Aur Alerting',
    description:
      'An SLI is a number that measures user experience; an SLO is the target you hold it to; the error budget is the allowed shortfall, and burning through it is what tells you to slow down and stabilise. This lesson covers how to define good SLIs and SLOs, multi-window multi-burn-rate alerting so you page on real problems and not on noise, the rule of alerting on symptoms not causes, on-call and escalation, the incident lifecycle, blameless postmortems, and runbooks.',
    descriptionHi:
      'Ek SLI ek number hai jo user experience measure karता hai; ek SLO wo target hai jispar aap ise hold karते ho; error budget allowed shortfall hai, aur iske through burn karna wo hai jo aapko slow down aur stabilise karने ko batata hai. Ye lesson cover karता hai acche SLIs aur SLOs kaise define karें, multi-window multi-burn-rate alerting taaki aap real problems par page karें noise par nahi, symptoms par alert karने ka rule causes par nahi, on-call aur escalation, incident lifecycle, blameless postmortems, aur runbooks.',
    difficulty: 'HARD',
    duration: 26,
    order: 6,

    analogy: {
      en: '**A monthly data allowance on a phone plan.** The SLO is "4 GB a month". The error budget is that 4 GB — you are *allowed* to use it, that is the point of having it. If it is the 10th and you have used 500 MB, you are fine; browse freely, try the new video app (ship features). If it is the 10th and you have used 3.8 GB, you are burning far too fast — you throttle yourself now, before you are cut off (freeze risky changes, focus on reliability). And the alarm that matters is not "you used 50 MB in an hour" (normal) — it is "at this rate you will blow the whole month\'s allowance in two days" (a burn rate that projects to exhaustion). You do not get paged for every megabyte; you get paged when the trajectory is bad.',
      hi: '**Ek phone plan par ek monthly data allowance.** SLO "4 GB ek mahine" hai. Error budget wo 4 GB hai — aapko ise use karने ki *allowed* hai, wahi point hai ise rakhne ka. Agar 10 taareekh hai aur aapne 500 MB use kiya, aap theek ho; freely browse karो, naya video app try karो (features ship karो). Agar 10 taareekh hai aur aapne 3.8 GB use kiya, aap bahut fast burn kar rahe ho — aap abhi apne aap ko throttle karो, iske pehle aap cut off ho (risky changes freeze karो). Aur wo alarm jo matter karता hai wo "aapne ek ghante mein 50 MB use kiya" (normal) nahi hai — wo "is rate par aap poore mahine ka allowance do din mein blow kar doge" (ek burn rate jo exhaustion tak project karता hai) hai.',
    },

    simple: `**SLI** (Service Level Indicator) — a number measuring user experience, as a RATIO
of good events to total events:
\`\`\`
AVAILABILITY   good = non-5xx responses.   good_requests / total_requests
LATENCY        good = served under a threshold.  requests_under_300ms / total_requests
CORRECTNESS    good = right answer.  ... / total   (needs a checker)
FRESHNESS      good = data no older than X.  (for pipelines / caches)
measure it AT THE USER'S POV (the load balancer, a synthetic probe, RUM) - not
"was the process up" (that's a cause, not the experience).
\`\`\`

**SLO** (Objective) — the target for an SLI, over a window:
\`\`\`
"99.9% of requests succeed, measured over 28 rolling days"
"99% of requests are served in < 300ms, over 28 days"
pick the number from what USERS need + what's ACHIEVABLE, not "as many 9s as possible".
each extra 9 is ~10x the cost. 99.9% = 43 min/month down. 99.99% = 4.3 min/month.
\`\`\`

**ERROR BUDGET** — the ALLOWED failure = (1 - SLO) x total. it is a resource to SPEND:
\`\`\`
SLO 99.9% over 28d, ~100M requests -> budget = 0.1% = 100,000 failed requests / 28d.
budget REMAINING high  -> ship fast, take risks, do the scary migration.
budget REMAINING low / spent -> FREEZE feature work, fix reliability, no risky deploys
  until the budget recovers (it's a rolling window - it refills as bad days age out).
this is the POINT of an SLO: it turns "how much reliability" from an argument into
a number both dev and ops agree to, and it makes "we're too unstable to ship" objective.
\`\`\`

**BURN RATE** — how fast you're spending the budget. 1x = exactly on track to use
100% of the budget exactly at the end of the window. 10x = you'll exhaust it in
1/10th of the window.
\`\`\`
MULTI-WINDOW MULTI-BURN-RATE ALERTS (the Google SRE pattern - avoids noise + slow response):
  PAGE (fast burn):   burn_rate > 14.4  over 1h  AND  > 14.4 over 5m
                      -> 14.4x burns 2% of a 30d budget in 1h. real, urgent. wake someone.
  PAGE (slower):      burn_rate > 6     over 6h  AND  > 6 over 30m
  TICKET (slow burn): burn_rate > 3     over 24h AND  > 3 over 2h
                      -> not urgent tonight, but trending bad. a ticket, reviewed next day.
  the SHORT window (5m/30m/2h) makes the alert RESOLVE quickly when the problem stops.
  the LONG window makes it not fire on a 2-minute blip.
\`\`\`

**ALERT ON SYMPTOMS, NOT CAUSES:**
\`\`\`
GOOD (symptom, user-facing):  "checkout success rate < 99.5% (SLO burn)"
                              "p99 latency > 1s for 5m"
BAD (cause, may not matter):  "CPU > 80%"  (fine if latency is fine)
                              "a pod restarted"  (k8s handled it)
                              "disk 70% full"  (that's a ticket, not a page)
every PAGE must be: (1) a real user impact or imminent one, (2) ACTIONABLE by the
person paged, (3) linked to a RUNBOOK. if it fails any of these -> it's a ticket
or it's deleted. alert fatigue = people ignore the pager = the one real page is missed.
\`\`\`

**INCIDENT LIFECYCLE:**
\`\`\`
DETECT (alert/report) -> DECLARE (name it, assign an Incident Commander) ->
TRIAGE (severity, comms) -> MITIGATE (stop the bleeding - roll back, scale, failover,
  feature-flag off - BEFORE root-causing) -> RESOLVE -> REVIEW (blameless postmortem)
mitigate first: a rollback that fixes it in 5 min beats a root cause found in 2h.
\`\`\`

**BLAMELESS POSTMORTEM** — assume everyone acted reasonably with the info they had.
Output: a TIMELINE, contributing factors (usually many, systemic), and ACTION ITEMS
with owners + due dates. "who caused it" is the wrong question; "what let a single
mistake become an outage" is the right one. RUNBOOK = the step-by-step for a known
alert/task, linked from the alert, tested (a stale runbook is worse than none).`,

    simpleHi: `**SLI** (Service Level Indicator) — ek number jo user experience measure karता hai,
good events se total events ke ek RATIO ke roop mein:
\`\`\`
AVAILABILITY   good = non-5xx responses.   good_requests / total_requests
LATENCY        good = ek threshold ke neeche served.  requests_under_300ms / total_requests
CORRECTNESS    good = right answer.
FRESHNESS      good = data X se purana nahi.
ise USER KE POV PAR measure karो (load balancer, ek synthetic probe, RUM) - "kya
process up tha" nahi (wo ek cause hai, experience nahi).
\`\`\`

**SLO** (Objective) — ek SLI ke liye target, ek window ke over:
\`\`\`
"99.9% requests succeed, 28 rolling days ke over measured"
"99% requests < 300ms mein served, 28 days ke over"
number USERS ko kya chahिए + kya ACHIEVABLE hai se pick karो, "jitne 9s ho sakें" nahi.
har extra 9 ~10x cost hai. 99.9% = 43 min/month down. 99.99% = 4.3 min/month.
\`\`\`

**ERROR BUDGET** — ALLOWED failure = (1 - SLO) x total. ye SPEND karने ke liye ek resource hai:
\`\`\`
SLO 99.9% 28d ke over, ~100M requests -> budget = 0.1% = 100,000 failed requests / 28d.
budget REMAINING high  -> fast ship karो, risks lो, scary migration karो.
budget REMAINING low / spent -> feature work FREEZE karो, reliability fix karो, koi
  risky deploys nahi jab tak budget recover nahi karता (rolling window - bad days age out hone par refill).
ye ek SLO ka POINT hai: ye "kitni reliability" ko ek argument se ek number mein badalता hai.
\`\`\`

**BURN RATE** — aap budget kitna fast spend kar rahe ho. 1x = window ke end par
exactly 100% budget use karने ke exactly track par. 10x = aap ise window ke 1/10th mein exhaust karoge.
\`\`\`
MULTI-WINDOW MULTI-BURN-RATE ALERTS (Google SRE pattern):
  PAGE (fast burn):   burn_rate > 14.4  over 1h  AND  > 14.4 over 5m
                      -> 14.4x 1h mein 30d budget ka 2% burn karता hai. real, urgent.
  PAGE (slower):      burn_rate > 6     over 6h  AND  > 6 over 30m
  TICKET (slow burn): burn_rate > 3     over 24h AND  > 3 over 2h
  SHORT window alert ko jaldi RESOLVE karता hai jab problem rukता hai.
  LONG window ise ek 2-minute blip par fire na karने deta hai.
\`\`\`

**SYMPTOMS PAR ALERT KARO, CAUSES PAR NAHI:**
\`\`\`
GOOD (symptom, user-facing):  "checkout success rate < 99.5% (SLO burn)"
                              "p99 latency > 1s for 5m"
BAD (cause, matter nahi kar sakта):  "CPU > 80%"  (theek agar latency theek hai)
                              "ek pod restarted"  (k8s ne handle kiya)
                              "disk 70% full"  (wo ek ticket hai, ek page nahi)
har PAGE hona chahिए: (1) ek real user impact ya imminent, (2) paged person dwara
ACTIONABLE, (3) ek RUNBOOK se linked. inme se koi bhi fail -> ek ticket ya deleted.
alert fatigue = log pager ignore karते hain = ek real page missed.
\`\`\`

**INCIDENT LIFECYCLE:**
\`\`\`
DETECT -> DECLARE (name karो, ek Incident Commander assign karो) -> TRIAGE
(severity, comms) -> MITIGATE (bleeding rोko - roll back, scale, failover, feature-flag
  off - root-cause karने se PEHLE) -> RESOLVE -> REVIEW (blameless postmortem)
pehle mitigate karो: ek rollback jo ise 5 min mein fix karता hai 2h mein mile ek root cause se better hai.
\`\`\`

**BLAMELESS POSTMORTEM** — assume karो sabne unke paas jo info thi uske saath reasonably
act kiya. Output: ek TIMELINE, contributing factors (usually kई, systemic), aur ACTION
ITEMS owners + due dates ke saath. "kisne cause kiya" wrong question hai. RUNBOOK = ek
known alert/task ke liye step-by-step, alert se linked, tested.`,

    content: `## SLIs — measuring the experience

A **service level indicator** is a number that quantifies how well users are being served, expressed as a ratio of good events to total events over a window. Common SLIs:

- **Availability**: successful responses over total responses, where "successful" usually means not a 5xx (a 4xx is the client\'s fault, not yours).
- **Latency**: requests served faster than a threshold over total requests — note this is a ratio, not a percentile; "99% of requests under 300 ms" is the same information as a p99 of 300 ms but composes better into an error budget.
- **Correctness**: requests that returned the right answer over total, which requires a checker of some kind.
- **Freshness**: for pipelines and caches, the fraction of reads that got data no older than some bound.

Measure the SLI from the user\'s point of view — at the load balancer, from a synthetic probe, or from real-user monitoring in the browser — not from inside the process. "Was the process up" is a cause, not an experience; a process can be up and returning errors.

## SLOs — the target

A **service level objective** is a target value for an SLI over a stated window: "99.9% of requests succeed, measured over 28 rolling days". Choose the number from what users actually need and what is achievable with reasonable effort, not by maximising the count of nines. Each additional nine costs roughly ten times as much engineering, and the difference is stark: 99.9% allows about forty-three minutes of downtime a month, 99.99% allows about four minutes, and 99.999% allows about twenty-six seconds — a budget you cannot spend on a deploy, a config change, or a dependency\'s bad day. A **service level agreement** is a contractual version with penalties; your internal SLO should be tighter than any SLA so you notice before a customer does.

## The error budget

The **error budget** is the amount of failure the SLO permits: one minus the SLO, times the total. An availability SLO of 99.9% over twenty-eight days on a hundred million requests gives a budget of a tenth of a percent — a hundred thousand failed requests over the window. The budget is not a threshold to avoid; it is a resource to spend. When a lot of budget remains, you ship quickly, take risks, and do the migration you have been putting off. When the budget is nearly spent, feature work freezes, the team focuses on reliability, and no risky deploys happen until the budget recovers — and because the window rolls, the budget refills as bad days age out of it.

This is the entire point of an SLO. It converts "how reliable should we be" from a recurring argument between people who want to ship and people who want stability into a single number both sides agreed to in advance, and it makes "we are too unstable to release right now" an objective statement backed by data rather than a judgement call.

## Burn rate and multi-window alerting

**Burn rate** is how fast the error budget is being consumed relative to the rate that would exhaust it exactly at the end of the window. A burn rate of 1 means you are precisely on track to use one hundred percent of the budget at the window\'s end. A burn rate of 10 means you will exhaust it in a tenth of the window.

Alerting naively on burn rate produces either noise or slow response. The standard solution is **multi-window, multi-burn-rate** alerts, from Google\'s SRE practice:

- A **page for a fast burn**: burn rate above 14.4 over the last hour *and* above 14.4 over the last five minutes. A 14.4x burn consumes two percent of a thirty-day budget in one hour, which is a real and urgent problem worth waking someone for. The one-hour window means it does not fire on a brief blip; the five-minute window means the alert clears quickly once the problem stops.
- A **page for a slower burn**: rate above 6 over six hours and above 6 over thirty minutes.
- A **ticket for a slow burn**: rate above 3 over twenty-four hours and above 3 over two hours — not urgent tonight, but trending badly, so it becomes a ticket reviewed the next working day rather than a page.

The pairing of a long window (does this represent a sustained problem) with a short window (is it still happening) is what makes these alerts both sensitive and quiet.

## Alert on symptoms, not causes

A good alert fires on something a user is experiencing or is about to: "checkout success rate below 99.5%", "p99 latency above one second for five minutes". A bad alert fires on an internal condition that may not matter: "CPU above 80%" is fine if latency is fine, "a pod restarted" was handled by the orchestrator, "disk 70% full" is a ticket not a page. Every page must satisfy three tests: there is real user impact now or imminently, the person paged can actually do something about it, and it links to a runbook. An alert that fails any of these should be downgraded to a ticket or deleted, because the cost of a noisy pager is that people stop trusting it and the one page that matters is missed among the false ones.

## The incident lifecycle

**Detect** — an alert fires or a report comes in. **Declare** — name the incident, and assign an incident commander who coordinates rather than fixes. **Triage** — assign a severity and start communications. **Mitigate** — stop the bleeding by the fastest available means: roll back, scale up, fail over, turn a feature flag off — *before* understanding the root cause. **Resolve** — confirm the impact is over. **Review** — a blameless postmortem. The critical discipline is mitigate before root-cause: a rollback that restores service in five minutes beats a root cause found in two hours while users suffer.

## Blameless postmortems and runbooks

A **blameless postmortem** starts from the assumption that everyone involved acted reasonably given the information they had at the time. Its output is a factual timeline, a set of contributing factors — which are almost always multiple and systemic rather than a single human error — and action items each with an owner and a due date. "Who caused this" is the wrong question because it makes people hide information; "what allowed a single mistake to become an outage" is the right one, and its answers are the guardrails, the tests, the rollback speed, and the review gates that stop the next one.

A **runbook** is the step-by-step procedure for a specific known alert or operational task — how to confirm it is real, how to mitigate, who to escalate to. It is linked directly from the alert that needs it, and it is kept tested, because a runbook that has drifted from reality is worse than none: it sends the responder confidently down a path that no longer works.`,

    contentHi: `## SLIs — experience measure karना

Ek **service level indicator** ek number hai jo quantify karता hai users kitni achhi tarah serve kiye ja rahe hain, good events se total events ke ek ratio ke roop mein ek window ke over. Common SLIs:
- **Availability**: successful responses over total responses.
- **Latency**: ek threshold se fast served requests over total requests — ye ek ratio hai, ek percentile nahi.
- **Correctness**: requests jo right answer return kiye over total.
- **Freshness**: pipelines aur caches ke liye.

SLI ko user ke point of view se measure karो — load balancer par, ek synthetic probe se, ya browser mein real-user monitoring se — process ke andar se nahi.

## SLOs — target

Ek **service level objective** ek SLI ke liye ek stated window ke over ek target value hai: "99.9% requests succeed, 28 rolling days ke over measured". Number wo se pick karो jo users actually chahिए aur kya achievable hai, nines ki count maximise karके nahi. Har additional nine roughly dus times zyada engineering cost karता hai. 99.9% ek mahine lagbhag tੈtालीस minute downtime allow karता hai, 99.99% lagbhag chaar minute.

## Error budget

**Error budget** wo failure ki amount hai jo SLO permit karता hai: ek minus SLO, times total. 99.9% ka ek availability SLO ek sau million requests par ek tenth of a percent ka ek budget deता hai. Budget avoid karने ke liye ek threshold nahi hai; ye spend karने ke liye ek resource hai. Jab bahut budget remains, aap jaldi ship karते ho, risks lete ho. Jab budget lagbhag spent hai, feature work freeze hota hai.

Ye ek SLO ka poora point hai. Ye "hum kitne reliable hone chahिए" ko ek recurring argument se ek single number mein badalता hai.

## Burn rate aur multi-window alerting

**Burn rate** wo hai ki error budget kitna fast consume kiya ja raha hai us rate ke relative jo ise window ke end par exactly exhaust karega. Ek 1 ki burn rate ka matlab aap precisely track par ho. Ek 10 ki burn rate ka matlab aap ise window ke ek tenth mein exhaust karoge.

Standard solution **multi-window, multi-burn-rate** alerts hain:
- Ek **fast burn ke liye page**: pichle ghante ke over 14.4 se upar burn rate aur pichle paanch minute ke over 14.4 se upar.
- Ek **slower burn ke liye page**: chhah ghante ke over 6 se upar rate aur tees minute ke over 6 se upar.
- Ek **slow burn ke liye ticket**: chौbis ghante ke over 3 se upar rate aur do ghante ke over 3 se upar.

Ek long window ki pairing (kya ye ek sustained problem represent karता hai) ek short window ke saath (kya ye abhi bhi ho raha hai) wo hai jo in alerts ko sensitive aur quiet dono banाता hai.

## Symptoms par alert karो, causes par nahi

Ek achha alert kisi cheez par fire karता hai jo ek user experience kar raha hai: "checkout success rate 99.5% ke neeche". Ek bura alert ek internal condition par fire karता hai jo matter nahi kar sakता: "CPU 80% se upar" theek hai agar latency theek hai. Har page teen tests satisfy karना chahिए: abhi ya imminently real user impact hai, paged person actually kuch kar sakता hai, aur ye ek runbook se link karता hai.

## Incident lifecycle

**Detect** — ek alert fire karता hai. **Declare** — incident name karो, ek incident commander assign karो. **Triage** — ek severity assign karो. **Mitigate** — bleeding rोko fastest available means se: roll back, scale up, fail over — root cause samajhने se *pehle*. **Resolve**. **Review** — ek blameless postmortem. Critical discipline root-cause se pehle mitigate karना hai.

## Blameless postmortems aur runbooks

Ek **blameless postmortem** is assumption se shuru hota hai ki har koi involved reasonably act kiya us samay unke paas jo information thi uske saath. Iska output ek factual timeline hai, contributing factors ka ek set, aur action items har ek ek owner aur ek due date ke saath. "Kisne ye cause kiya" wrong question hai.

Ek **runbook** ek specific known alert ya operational task ke liye step-by-step procedure hai. Ye alert se directly linked hai jise ise chahिए, aur ise tested rakhा jaता hai.`,

    examples: [
      {
        title: 'From an SLO to a burn-rate alert: the math and the alert rules',
        titleHi: 'Ek SLO se ek burn-rate alert tak: math aur alert rules',
        code: `# SLO:  99.9% of checkout requests succeed, over a 28-day rolling window.
#   error budget = 0.1% of requests.
#   at ~50 req/s -> ~121M requests / 28d -> budget = ~121,000 failed requests / 28d.

# BURN RATE = (current error ratio) / (SLO error ratio)
#   SLO error ratio = 1 - 0.999 = 0.001
#   if the current 1h error ratio is 1.44%  ->  burn = 0.0144 / 0.001 = 14.4x
#   at 14.4x you spend the ENTIRE 28-day budget in  28d / 14.4 = ~1.9 days.
#   in ONE HOUR at 14.4x you spend  1h / (28d)  x 14.4  = ~2.1% of the budget.

# THE ALERT RULES (Prometheus, the Google SRE multi-window multi-burn pattern):

  # --- fast burn -> PAGE ---
  - alert: CheckoutErrorBudgetFastBurn
    expr: |
      ( sum(rate(http_requests_total{job="checkout",code=~"5.."}[1h]))
        / sum(rate(http_requests_total{job="checkout"}[1h])) ) > (14.4 * 0.001)
      and
      ( sum(rate(http_requests_total{job="checkout",code=~"5.."}[5m]))
        / sum(rate(http_requests_total{job="checkout"}[5m])) ) > (14.4 * 0.001)
    for: 2m
    labels: { severity: page }
    annotations:
      summary: "checkout burning error budget at >14.4x (2% of 28d budget/hour)"
      runbook: "https://runbooks.acme.io/checkout-error-budget"

  # --- slow burn -> TICKET ---
  - alert: CheckoutErrorBudgetSlowBurn
    expr: |
      ( ...error ratio over [24h]... ) > (3 * 0.001)
      and
      ( ...error ratio over [2h]... ) > (3 * 0.001)
    for: 15m
    labels: { severity: ticket }

# WHY THE TWO WINDOWS per alert:
#   the LONG window (1h) = "is this a sustained problem, not a 30-second spike?"
#   the SHORT window (5m) = "is it STILL happening right now?" -> the alert
#     auto-resolves ~5 min after the errors stop, instead of hanging for an hour.`,
        output: `The SLO (99.9% / 28d) becomes an error budget (~121k failed requests) which
becomes a BURN RATE (current error ratio / 0.001). A fast-burn PAGE fires when the
burn is >14.4x over BOTH the last 1h (sustained) AND the last 5m (still
happening); at 14.4x you'd exhaust a 28-day budget in ~2 days, so it's genuinely
urgent. A slow-burn (>3x over 24h + 2h) becomes a TICKET, not a page. The
two-window pairing is what stops both false pages and alerts that hang forever.`,
        explain: 'The service has an availability SLO of 99.9% over a rolling twenty-eight-day window, which at the observed request rate works out to an error budget of about a hundred and twenty-one thousand failed requests. Burn rate is defined as the current error ratio divided by the SLO\'s allowed error ratio of one in a thousand, so if the error ratio over the last hour is 1.44 percent, the burn rate is 14.4 times — and at that rate the entire twenty-eight-day budget is consumed in under two days, while a single hour at that rate spends about two percent of the budget. The alert rule for the fast-burn page requires the burn rate to exceed 14.4 over both a one-hour window and a five-minute window simultaneously. The one-hour window confirms the problem is sustained rather than a brief spike; the five-minute window confirms it is still happening right now, which means the alert automatically clears about five minutes after the errors stop instead of staying firing for an hour after recovery. A parallel slow-burn rule with a lower threshold over longer windows produces a ticket rather than a page — a problem that is trending badly but does not warrant waking someone tonight. The two-window pairing on every alert is the mechanism that makes burn-rate alerting both sensitive to real problems and quiet on transient noise.',
        explainHi: 'Service ke paas ek rolling athais-din window ke over 99.9% ka ek availability SLO hai, jo observed request rate par lagbhag ek sau ikkis hazaar failed requests ke ek error budget par kaam karता hai. Burn rate current error ratio ko SLO ke allowed error ratio ek in a thousand se divided ke roop mein define kiya jaता hai, to agar pichle ghante ke over error ratio 1.44 percent hai, burn rate 14.4 times hai — aur us rate par poora athais-din budget do din se kam mein consume hota hai. Fast-burn page ke liye alert rule ke liye burn rate ko ek one-hour window aur ek five-minute window dono ke over simultaneously 14.4 exceed karना chahिए. One-hour window confirm karता hai problem sustained hai; five-minute window confirm karता hai ye abhi bhi ho raha hai, jiska matlab alert automatically errors rukने ke lagbhag paanch minute baad clear hota hai. Two-window pairing wo mechanism hai jo burn-rate alerting ko real problems ke sensitive aur transient noise par quiet dono banाता hai.',
      },
      {
        title: 'A noisy pager, and the pruning that made the one real page get noticed',
        titleHi: 'Ek noisy pager, aur wo pruning jisne ek real page ko notice hone diya',
        code: `# BEFORE: the checkout team's alert list (page-severity), one on-call week:
  #  Mon 02:14  "node-7 CPU > 85%"                 -> ack, ignored (latency was fine)
  #  Mon 03:40  "pod checkout-abc restarted"       -> ack, ignored (k8s restarted it, healthy)
  #  Tue 09:00  "checkout p99 > 500ms"             -> ack, ignored (it's ALWAYS ~480ms at 9am)
  #  Tue 14:22  "RDS connections > 80"             -> ack, ignored (pool max is 100, fine)
  #  Wed 01:05  "disk /var 72%"                    -> ack, ignored (logs, rotates nightly)
  #  Wed 04:30  "checkout error rate > 0.5%" (SLO) -> ack... ignored. (on-call is now
  #             conditioned to ack-and-ignore. this was the REAL one. 40 min outage.)
  # -> 5 non-actionable pages trained the human to dismiss the 6th.

# AFTER: apply the 3 tests (real impact NOW / actionable / has a runbook):
  DELETE  "CPU > 85%"           -> not user impact. -> a dashboard annotation, not an alert.
  DELETE  "pod restarted"       -> k8s's job. -> if restarts > 3 in 10m, THAT's a ticket.
  RETUNE  "p99 > 500ms"         -> the threshold was below normal. -> SLO-based:
          "latency SLI (frac < 800ms) burning budget at >6x over 6h+30m" -> page.
  DOWNGRADE "RDS connections>80" -> not impact yet. -> ticket at >90 for 15m; page only
          if it CAUSES SLO burn (which the SLO alert already catches).
  DOWNGRADE "disk 72%"          -> ticket at 80%, page at 92% projected-full-in-4h.
  KEEP    "checkout SLO burn"   -> real, actionable, runbook. now it's 1 of ~2 page
          alerts, and it gets a real response.
# result: page volume 5-8/week -> ~1/week. the on-call believes the pager again.`,
        output: `Five of six pages that week were non-actionable (CPU, a self-healed pod, a
normal-for-9am p99, a fine connection count, a rotating disk). By the time the
REAL page fired - the SLO error-rate burn - the on-call was conditioned to
ack-and-ignore, and a 40-minute outage resulted. Applying the 3 tests
(user-impact-now / actionable / has-a-runbook) deleted 2, retuned 1 to be
SLO-based, and downgraded 2 to tickets. Page volume went from ~6/week to ~1, and
the pager became trustworthy again.`,
        explain: 'One on-call week for the checkout team contains six page-severity alerts, and five of them are not actionable. A CPU alert fires while latency is fine, so it is acknowledged and ignored. A pod-restart alert fires for a restart the orchestrator handled and the service stayed healthy, so it is ignored. A p99-latency alert fires because the threshold was set below the normal morning latency, so it fires every day and is ignored. A connection-count alert fires at a level well below the pool maximum, ignored. A disk alert fires for a partition that rotates its logs nightly, ignored. By the time the sixth alert fires — the real one, an error-rate breach that is burning the error budget — the on-call engineer has been conditioned by five false alarms into acknowledging and dismissing without investigating, and a forty-minute outage results. The fix is to apply three tests to every page: is there real user impact now or imminently, can the paged person do something about it, and does it link to a runbook. Two alerts fail all three and are deleted, becoming dashboard annotations. One is retuned from an absolute threshold to an SLO burn-rate condition so it only fires when latency is genuinely degrading the user experience. Two are downgraded to tickets with page thresholds set only at genuinely urgent levels. The result is that page volume drops from six a week to about one, and because almost every page is now real, the on-call engineer responds to it.',
        explainHi: 'Checkout team ke liye ek on-call week mein chhah page-severity alerts hain, aur unme se paanch actionable nahi hain. Ek CPU alert fire karता hai jabki latency theek hai, to ise acknowledge aur ignore kiya jaता hai. Ek pod-restart alert ek restart ke liye fire karता hai jise orchestrator ne handle kiya, to ise ignore kiya jaता hai. Ek p99-latency alert fire karता hai kyunki threshold normal morning latency ke neeche set kiya gaya tha. Jab tak chhatha alert fire karता hai — real wala, ek error-rate breach jo error budget burn kar raha hai — on-call engineer paanch false alarms dwara conditioned ho gaya hai acknowledge aur dismiss karने ko bina investigate kiye, aur ek chालीس-minute outage result hota hai. Fix har page par teen tests apply karना hai: kya abhi real user impact hai, kya paged person kuch kar sakता hai, aur kya ye ek runbook se link karता hai. Result ye hai ki page volume ek hafte chhah se lagbhag ek tak drop hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# setting the SLO to "as many nines as possible" without asking who needs it
  # "we should be 99.999% available" for an internal analytics dashboard.
  # 99.999% = 26 seconds of downtime per month. that means:
  #   - you can't deploy during business hours (a rolling deploy blip > 26s/mo budget)
  #   - a single dependency's 5-minute outage blows a YEAR of budget
  #   - you need multi-region active-active, which for a dashboard is absurd cost
  #   - every tiny wobble is now an SLO-breach incident with a postmortem
  # meanwhile the users would be completely fine with 99.5% (3.6h/month) - it's a
  # dashboard they check a few times a day.`,
        right: `# derive the SLO from the user's actual tolerance + the cost of each nine:
  #   1. what breaks for the user at X% down? for how long is "down" actually noticed?
  #      internal dashboard: 99.5% (a few hours/month, off-hours, is fine)
  #      customer-facing checkout: 99.95% (~22 min/month; lost revenue per minute is real)
  #      a payment ledger's correctness: 99.999% on CORRECTNESS (money must be right)
  #        but maybe only 99.9% on availability (a retry is acceptable)
  #   2. cost check: can we actually hit it? each 9 ~= 10x eng effort + infra.
  #   3. write it down, review quarterly, and let the error budget - not opinion -
  #      decide when to slow down.
  # different SLIs of the SAME service can have very different SLOs.`,
        why: 'An SLO chosen by maximising nines rather than by asking what users need imposes enormous cost for no benefit and makes the system harder to operate. Each additional nine of availability is roughly an order of magnitude more engineering and infrastructure — 99.9% is forty-three minutes of monthly downtime, 99.99% is four minutes, 99.999% is twenty-six seconds — and at the high end a routine rolling deploy, a single dependency\'s brief outage, or any small wobble consumes a large fraction of the budget and becomes an incident with a postmortem. For an internal dashboard that users check a few times a day, 99.5% — several hours of monthly downtime, mostly unnoticed — is entirely adequate, and targeting five nines for it would mean forbidding business-hours deploys and building multi-region active-active infrastructure for something nobody would miss for an afternoon. The correct method is to derive the SLO from the user\'s actual tolerance: what breaks for them at a given level of unavailability, and for how long is the service actually noticed to be down. Then check the cost of hitting that number, write it down, and review it periodically. Different SLIs of the same service legitimately get different SLOs — a payment system might need five nines on correctness because money must be right, but only three nines on availability because a retry is acceptable.',
        whyHi: 'Ek SLO jo nines maximise karके chuna gaya bajaay users ko kya chahिए poochकर enormous cost impose karता hai bina benefit ke aur system ko operate karना harder banाता hai. Har additional nine of availability roughly ek order of magnitude zyada engineering aur infrastructure hai — 99.9% tੈtालीस minute monthly downtime hai, 99.99% chaar minute, 99.999% chhabbis second — aur high end par ek routine rolling deploy, ek single dependency ka brief outage budget ke ek large fraction ko consume karता hai. Ek internal dashboard ke liye jise users din mein kई baar check karते hain, 99.5% entirely adequate hai. Correct method SLO ko user ke actual tolerance se derive karना hai. Same service ke different SLIs legitimately different SLOs paते hain.',
      },
      {
        wrong: `# alerting on a cause and paging on it, so people are woken for non-problems
  - alert: HighCPU
    expr: instance:node_cpu_utilisation:rate5m > 0.80
    for: 5m
    labels: { severity: page }
  # 3am: node CPU hits 82% because a nightly batch job is running. page fires.
  # on-call wakes, checks: latency fine, errors fine, users fine. it's just... busy.
  # goes back to sleep annoyed. this fires ~4 nights a week. the on-call now
  # ROUTINELY ignores CPU pages - so the night CPU actually causes latency, that
  # page is ignored too.`,
        right: `# page on the SYMPTOM (SLO burn / latency / errors); use the cause as CONTEXT:
  - alert: CheckoutSLOFastBurn          # <- the PAGE. user-facing. actionable.
    expr: <burn rate > 14.4 over 1h and 5m>
    labels: { severity: page }
    annotations:
      runbook: "..."
      # the runbook says: "check the dashboard - is CPU/mem/pool/GC/a dependency
      #  the driver? THEN act (scale / roll back / failover / flag-off)."
  - alert: HighCPUSustained             # <- a TICKET. investigate in daylight.
    expr: <cpu > 0.85 for 30m>
    labels: { severity: ticket }
  # now: high CPU alone = a ticket someone looks at Monday. high CPU that's
  # actually hurting users = caught by the SLO page, with CPU as a clue in the runbook.`,
        why: 'Paging on a cause metric like CPU utilisation means being woken whenever that metric crosses a line, regardless of whether users are affected — and most of the time a busy CPU, a restarted pod, or a growing queue is the system working normally under load or recovering on its own. The on-call engineer investigates, finds latency and errors are fine, and goes back to sleep, and after this happens several times they learn to acknowledge and dismiss that class of page without looking. The failure mode is that when the cause genuinely does start hurting users, the page for it is ignored along with all the false ones. The correct structure is to page only on symptoms — the SLO burn rate, latency, error rate, things a user feels — and to treat cause metrics as context that the runbook for the symptom alert tells the responder to check. High CPU on its own becomes a lower-severity ticket that someone reviews during working hours. High CPU that is actually degrading the user experience is caught by the symptom page, and the runbook for that page points at CPU, memory, pools, garbage collection, and dependencies as the things to check to decide what to do. This keeps the pager meaningful and still surfaces the cause when it matters.',
        whyHi: 'Ek cause metric jaise CPU utilisation par page karना ka matlab jab bhi wo metric ek line cross karता hai woken hona hai, regardless of whether users affected hain — aur zyadaatar samay ek busy CPU, ek restarted pod, ya ek growing queue system ka normally load ke tahat kaam karना hai. On-call engineer investigate karता hai, paता hai latency aur errors theek hain, aur wapas so jaता hai, aur ye kई baar hone ke baad wo acknowledge aur dismiss karना seekhते hain bina dekhे. Failure mode ye hai ki jab cause genuinely users ko hurt karना shuru karता hai, iske liye page saare false walon ke saath ignore hota hai. Correct structure sirf symptoms par page karना hai — SLO burn rate, latency, error rate — aur cause metrics ko context ke roop mein treat karना.',
      },
      {
        wrong: `# in the postmortem: "root cause: engineer X deployed a bad config. action item:
  # X will be more careful. remind the team to double-check configs."
  # what this misses:
  #   - WHY did a bad config reach prod? no schema validation? no staging check?
  #   - WHY did it take 40 min to detect? no config-change alert? no canary?
  #   - WHY did it take 25 min to roll back? no one-command rollback? unclear owner?
  #   - "be more careful" is not an action item - it's a wish. the next tired
  #     engineer at 2am makes the same class of mistake.
  #   - and X will now hide their next near-miss instead of reporting it.`,
        right: `# blameless: assume X acted reasonably. ask what the SYSTEM allowed:
  #   TIMELINE:  10:02 deploy | 10:05 first errors | 10:41 alert | 10:44 IC declared
  #              | 11:06 rollback started | 11:09 recovered
  #   CONTRIBUTING FACTORS (systemic, plural):
  #     - config had no schema -> a typo'd key was silently ignored
  #     - no canary stage -> 100% of traffic hit the bad config at once
  #     - the SLO alert window was 15m + the burn threshold too low -> 36m to page
  #     - rollback required editing 3 files + a manual apply -> 20m + tribal knowledge
  #   ACTION ITEMS (owner + date, each removes a factor):
  #     - add a JSON schema + CI validation for this config      @dana  by 09-20
  #     - add a 5%/10min canary stage to the deploy pipeline     @sam   by 09-27
  #     - multi-window burn alert, page at 14.4x/1h              @lee   by 09-16
  #     - one-command 'deploy rollback <sha>'                    @sam   by 09-30`,
        why: 'A postmortem that identifies a person as the root cause and assigns "be more careful" as the fix learns nothing and makes the next incident more likely. It misses that a single mistake became an outage only because of a chain of systemic gaps: the config format had no validation so a typo was silently accepted, there was no canary so the bad config hit all traffic at once, the alerting was slow so detection took forty minutes, and the rollback was a manual multi-step process so recovery took another twenty. "Be more careful" addresses none of these, so the next tired engineer at two in the morning hits the same class of failure. It also teaches the named engineer, and everyone watching, that reporting a mistake or a near-miss leads to blame, so people stop reporting and the organisation loses its early warning of the next problem. A blameless postmortem starts from the assumption that everyone acted reasonably with the information they had, produces a factual timeline and a list of contributing factors that are plural and systemic, and turns each factor into an action item with a named owner and a due date — schema validation, a canary stage, a faster burn-rate alert, a one-command rollback. Each action item removes one link from the chain, so the same initial mistake next time is caught, contained, or recovered from quickly.',
        whyHi: 'Ek postmortem jo ek person ko root cause ke roop mein identify karता hai aur "zyada careful raho" ko fix ke roop mein assign karता hai kuch nahi seekhता aur agle incident ko zyada likely banाता hai. Ye miss karता hai ki ek single mistake ek outage sirf systemic gaps ki ek chain ki wajah se ban gaya: config format ke koi validation nahi tha to ek typo silently accept kiya gaya, koi canary nahi tha to bad config ne saara traffic ek saath hit kiya, alerting slow thi to detection ne chालीस minute liye, aur rollback ek manual multi-step process tha. "Zyada careful raho" inme se kisi ko address nahi karता. Ye named engineer ko bhi sikhाता hai ki ek mistake report karना blame leता hai, to log report karना band karते hain. Ek blameless postmortem is assumption se shuru hota hai ki har koi reasonably act kiya, aur har factor ko ek named owner aur ek due date ke saath ek action item mein badalता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Five nines for a dashboard** — a team set 99.999% on an internal reporting tool. Business-hours deploys were banned, every rolling-update blip was an "incident", and a dependency\'s 6-minute outage blew a year of budget. Repricing the SLO to 99.5% (matching actual user tolerance) removed a whole category of manufactured incidents.',
        hi: '**Ek dashboard ke liye paanch nines** — ek team ne ek internal reporting tool par 99.999% set kiya. Business-hours deploys banned the, har rolling-update blip ek "incident" tha. SLO ko 99.5% par reprice karna ek poori category of manufactured incidents hata di.',
      },
      {
        en: '**The 6th page** — a checkout on-call week had 5 non-actionable pages (CPU, a self-healed pod, a normal p99, a fine pool count, a rotating disk) before the real one — an SLO error-rate burn — fired and was ack-and-ignored out of conditioning. 40-minute outage. Pruning to the 3 tests took page volume 6/week → ~1.',
        hi: '**6th page** — ek checkout on-call week ke 5 non-actionable pages the real wale se pehle — ek SLO error-rate burn — jo fire hua aur conditioning se ack-and-ignore kiya gaya. 40-minute outage. 3 tests par prune karna page volume 6/week → ~1 kar diya.',
      },
      {
        en: '**"Be more careful"** — a postmortem blamed an engineer for a bad config and the action item was a reminder. The same class of failure recurred 6 weeks later. The redone blameless version found 4 systemic factors (no schema, no canary, slow alert, manual rollback); fixing those ended that failure class.',
        hi: '**"Zyada careful raho"** — ek postmortem ne ek engineer ko ek bad config ke liye blame kiya aur action item ek reminder tha. Wahi class of failure 6 hafte baad recur hui. Redone blameless version ne 4 systemic factors paye; unhe fix karna us failure class ko khatam kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What are SLIs, SLOs, and error budgets, and how does an error budget change how a team works?',
        qHi: 'SLIs, SLOs, aur error budgets kya hain, aur ek error budget ek team ke kaam karne ke tarike ko kaise badalता hai?',
        a: 'A service level indicator is a number that measures user experience as a ratio of good events to total events over a window — availability as successful responses over total, latency as requests under a threshold over total, correctness, freshness — measured from the user\'s point of view rather than from inside the process. A service level objective is a target for an SLI over a stated window, such as 99.9 percent of requests succeeding over twenty-eight rolling days, chosen from what users actually need and what is achievable, not by maximising nines, because each additional nine costs roughly ten times the effort. The error budget is the failure the SLO permits: one minus the SLO times the total, so a 99.9 percent SLO on a hundred million requests allows a hundred thousand failures. The budget changes how a team works because it is a resource to spend, not a threshold to avoid. When a lot of budget remains, the team ships quickly and takes risks and does the migration it has been deferring. When the budget is nearly spent, feature work freezes and the team focuses entirely on reliability until the rolling window refills the budget as bad days age out. This converts the recurring argument between shipping fast and staying stable into a single number both sides agreed to in advance, and it makes "we are too unstable to release" an objective, data-backed statement instead of a judgement call.',
        aHi: 'Ek service level indicator ek number hai jo user experience ko good events se total events ke ek ratio ke roop mein ek window ke over measure karता hai — user ke point of view se measured. Ek service level objective ek SLI ke liye ek stated window ke over ek target hai, jaise athais rolling days ke over 99.9 percent requests succeed hone, wo se chuna gaya jo users actually chahिए. Error budget wo failure hai jo SLO permit karता hai. Budget team ke kaam karne ke tarike ko badalता hai kyunki ye spend karने ke liye ek resource hai, avoid karने ke liye ek threshold nahi. Jab bahut budget remains, team jaldi ship karती hai aur risks leती hai. Jab budget lagbhag spent hai, feature work freeze hota hai aur team reliability par focus karती hai. Ye "we are too unstable to release" ko ek objective, data-backed statement banाता hai.',
      },
      {
        q: 'What is a multi-window multi-burn-rate alert, and why do you alert on symptoms rather than causes?',
        qHi: 'Ek multi-window multi-burn-rate alert kya hai, aur aap causes ke bajaay symptoms par kyun alert karते ho?',
        a: 'Burn rate is how fast the error budget is being consumed relative to the rate that would exactly exhaust it at the end of the window — a burn rate of 1 is on track, a burn rate of 10 exhausts the budget in a tenth of the window. Alerting naively on burn rate is either noisy or slow. A multi-window multi-burn-rate alert requires the burn rate to exceed a threshold over both a long window and a short window at the same time, at several threshold-and-window pairs. A fast-burn page fires at burn rate above 14.4 over one hour and over five minutes, which is a rate that would exhaust a thirty-day budget in about two days — genuinely urgent. A slow-burn condition at a lower threshold over twenty-four and two hours produces a ticket instead. The long window confirms the problem is sustained, not a brief spike; the short window confirms it is still happening, so the alert clears within minutes of recovery instead of hanging. You alert on symptoms — the SLO burn, latency, error rate, things the user experiences — rather than causes like CPU, a pod restart, or disk fullness, because a cause metric crossing a line usually does not mean users are affected: a busy CPU or a self-healed pod is often normal. Paging on causes wakes people for non-problems, they learn to acknowledge and ignore that class of alert, and then when the cause genuinely does hurt users the page is ignored too. Causes belong in the runbook as things to check once a symptom alert has fired.',
        aHi: 'Burn rate wo hai ki error budget kitna fast consume kiya ja raha hai us rate ke relative jo ise window ke end par exactly exhaust karega. Ek multi-window multi-burn-rate alert ke liye burn rate ko ek long window aur ek short window dono ke over ek threshold exceed karना chahिए ek hi samay. Ek fast-burn page 14.4 se upar burn rate par ek ghante aur paanch minute ke over fire karता hai, jo ek rate hai jo ek tees-din budget ko lagbhag do din mein exhaust karega. Long window confirm karता hai problem sustained hai; short window confirm karता hai ye abhi bhi ho raha hai. Aap symptoms par alert karते ho — SLO burn, latency, error rate — causes jaise CPU ke bajaay, kyunki ek cause metric ek line cross karना usually iska matlab nahi hai ki users affected hain. Causes par page karना logon ko non-problems ke liye wakeup karता hai, wo acknowledge aur ignore karना seekhते hain.',
      },
      {
        q: 'Walk through the incident lifecycle. Why mitigate before root-causing, and what makes a postmortem blameless?',
        qHi: 'Incident lifecycle walk karo. Root-causing se pehle mitigate kyun, aur ek postmortem ko blameless kya banाता hai?',
        a: 'The lifecycle is: detect, when an alert fires or a report comes in; declare, where you name the incident and assign an incident commander who coordinates rather than fixes; triage, where you set a severity and start communications; mitigate, where you stop the bleeding by the fastest available means — roll back, scale up, fail over, turn a feature flag off; resolve, where you confirm the impact is over; and review, a blameless postmortem. You mitigate before root-causing because the goal during an incident is to end the user impact, not to understand it — a rollback that restores service in five minutes is far better than a root cause found in two hours while users are still failing. Understanding comes in the review. A postmortem is blameless when it starts from the assumption that everyone involved acted reasonably given the information they had at the time. Its output is a factual timeline, a set of contributing factors that are almost always multiple and systemic rather than one person\'s error, and action items each with an owner and a due date. "Who caused this" is the wrong question because it makes people hide information and stop reporting near-misses; "what allowed a single mistake to become an outage" is the right one, and its answers — a missing validation, no canary, a slow alert, a manual rollback — each become an action item that removes one link from the chain so the same initial mistake is caught or contained next time. A runbook, linked from the alert and kept tested, is the step-by-step for handling a known alert quickly.',
        aHi: 'Lifecycle hai: detect, jab ek alert fire karता hai; declare, jahaan aap incident name karते ho aur ek incident commander assign karते ho jo coordinate karता hai fix nahi; triage, jahaan aap ek severity set karते ho; mitigate, jahaan aap bleeding rोkते ho fastest available means se — roll back, scale up, fail over; resolve; aur review, ek blameless postmortem. Aap root-causing se pehle mitigate karते ho kyunki ek incident ke dauraan goal user impact ko end karना hai, use samajhना nahi — ek rollback jo service ko paanch minute mein restore karता hai ek root cause se kaafi better hai jo do ghante mein mila jabki users abhi bhi fail ho rahe hain. Ek postmortem blameless hai jab ye is assumption se shuru hota hai ki har koi involved reasonably act kiya us samay unke paas jo information thi. "Kisne ye cause kiya" wrong question hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define SLI, SLO, error budget and burn rate with the math, explain how the budget drives dev vs ops decisions, and why more nines is not better.',
        taskHi: 'Ek comment mein, SLI, SLO, error budget aur burn rate define karo.',
        hint: 'SLI (Service Level Indicator) = a number measuring USER EXPERIENCE as a RATIO of good events / total events over a window: AVAILABILITY (non-5xx / total), LATENCY (requests under a threshold / total — a RATIO, not a percentile, so it composes into a budget), CORRECTNESS, FRESHNESS. Measure AT THE USER\'S POV (load balancer, synthetic probe, RUM) — NOT "was the process up" (a cause, not the experience — a process can be up and returning errors). SLO (Objective) = the target for an SLI over a stated window: "99.9% of requests succeed over 28 rolling days". Pick from what USERS NEED + what\'s ACHIEVABLE — NOT "max nines". Each extra 9 ≈ 10× the eng+infra cost: 99.9% = 43 min/month down, 99.99% = 4.3 min, 99.999% = 26 s (a budget you can\'t spend on a deploy). An SLA is a contractual version with penalties; your internal SLO should be tighter. ERROR BUDGET = the ALLOWED failure = (1 − SLO) × total. 99.9% over 28d, ~100M requests → 0.1% = 100,000 failed requests. It is a RESOURCE TO SPEND, not a threshold to avoid. BUDGET REMAINING HIGH → ship fast, take risks, do the scary migration. BUDGET NEARLY SPENT → FREEZE feature work, focus on reliability, no risky deploys until the rolling window refills (bad days age out). THIS IS THE POINT OF AN SLO: it converts "how much reliability" from a recurring dev-vs-ops ARGUMENT into a NUMBER both agreed to in advance, and makes "we\'re too unstable to release" OBJECTIVE + data-backed. BURN RATE = (current error ratio) / (SLO error ratio). Burn 1× = exactly on track to use 100% of the budget at the window\'s end. Burn 10× = exhaust it in 1/10th of the window. WHY MORE NINES ISN\'T BETTER: at 5 nines a routine rolling-deploy blip, a dependency\'s 6-min outage, or any wobble consumes a huge fraction of the budget → every wobble is an "incident" with a postmortem, you can\'t deploy in business hours, you need multi-region active-active. Different SLIs of the SAME service get DIFFERENT SLOs (a payment ledger: 99.999% on CORRECTNESS, maybe only 99.9% on availability).',
        hintHi: 'SLI = ek number jo USER EXPERIENCE ko good events / total events ke RATIO ke roop mein measure karता hai: AVAILABILITY, LATENCY (ek RATIO, percentile nahi), CORRECTNESS, FRESHNESS. USER KE POV PAR measure karो — "kya process up tha" nahi. SLO = ek SLI ke liye target ek window ke over: "99.9% requests succeed 28 rolling days ke over". USERS ko kya chahिए + ACHIEVABLE se pick karो — "max nines" nahi. Har extra 9 ≈ 10× cost: 99.9% = 43 min/month, 99.99% = 4.3 min, 99.999% = 26 s. ERROR BUDGET = ALLOWED failure = (1 − SLO) × total. SPEND karने ke liye ek RESOURCE. BUDGET HIGH → fast ship. BUDGET SPENT → FREEZE feature work. YE SLO KA POINT HAI: "kitni reliability" ko ek ARGUMENT se ek NUMBER mein badalता hai. BURN RATE = (current error ratio) / (SLO error ratio). 1× = track par. 10× = window ke 1/10th mein exhaust. Same service ke different SLIs DIFFERENT SLOs paते hain.',
      },
      {
        task: 'In a comment, explain multi-window multi-burn-rate alerts (the windows, thresholds, page vs ticket) and the 3 tests every page must pass.',
        taskHi: 'Ek comment mein, multi-window multi-burn-rate alerts aur 3 tests samjhao.',
        hint: 'Alerting NAIVELY on burn rate = either noisy (a 30-s spike pages) or slow (a long window is slow to fire AND slow to clear). MULTI-WINDOW MULTI-BURN-RATE (the Google SRE pattern): each alert requires the burn rate to exceed its threshold over BOTH a LONG window AND a SHORT window simultaneously. PAGE (fast burn): burn > 14.4 over 1h AND > 14.4 over 5m → 14.4× consumes 2% of a 30d budget in 1h (exhausts it in ~2 days) → real, urgent, wake someone. PAGE (slower): burn > 6 over 6h AND > 6 over 30m. TICKET (slow burn): burn > 3 over 24h AND > 3 over 2h → not urgent tonight but trending bad → a ticket reviewed next working day, NOT a page. WHY TWO WINDOWS: the LONG window = "is this a SUSTAINED problem, not a brief blip?" (avoids false pages); the SHORT window = "is it STILL happening right now?" → the alert AUTO-RESOLVES ~5 min after the errors stop, instead of hanging firing for an hour after recovery. THE 3 TESTS EVERY PAGE MUST PASS: (1) REAL USER IMPACT now or imminent (a symptom, not a cause); (2) ACTIONABLE by the person paged (they can roll back / scale / failover / flag-off — not "watch it"); (3) linked to a RUNBOOK. Fail ANY → downgrade to a TICKET or DELETE it. WHY: a noisy pager → people stop trusting it → they ack-and-ignore → the ONE real page is missed among the false ones (the "6th page" — 5 non-actionable alerts trained the on-call to dismiss the real SLO burn → a 40-min outage). ALERT ON SYMPTOMS, NOT CAUSES: GOOD = "checkout success rate < 99.5% (SLO burn)", "p99 > 1s for 5m". BAD = "CPU > 80%" (fine if latency is fine), "a pod restarted" (k8s handled it), "disk 70%" (a ticket). Causes go in the RUNBOOK as things to check once the symptom fires.',
        hintHi: 'NAIVELY burn rate par alert = ya noisy ya slow. MULTI-WINDOW MULTI-BURN-RATE: har alert ke liye burn rate ko LONG window AUR SHORT window DONO ke over ek saath threshold exceed karना chahिए. PAGE (fast burn): burn > 14.4 over 1h AND > 14.4 over 5m → 1h mein 30d budget ka 2% → ~2 days mein exhaust → wake someone. PAGE (slower): > 6 over 6h AND > 6 over 30m. TICKET (slow burn): > 3 over 24h AND > 3 over 2h. TWO WINDOWS KYUN: LONG = "SUSTAINED problem?"; SHORT = "STILL happening?" → alert AUTO-RESOLVES ~5 min baad. 3 TESTS: (1) REAL USER IMPACT (symptom, cause nahi); (2) ACTIONABLE; (3) RUNBOOK se linked. Fail ANY → TICKET ya DELETE. SYMPTOMS PAR ALERT, CAUSES PAR NAHI: GOOD = "success rate < 99.5%"; BAD = "CPU > 80%", "pod restarted", "disk 70%".',
      },
      {
        task: 'In a comment, walk the incident lifecycle, explain mitigate-before-root-cause, and describe a blameless postmortem (its assumption, its outputs, and what a good vs bad action item looks like) + runbooks.',
        taskHi: 'Ek comment mein, incident lifecycle walk karo aur blameless postmortem describe karo.',
        hint: 'INCIDENT LIFECYCLE: DETECT (an alert fires / a report comes in) → DECLARE (name it; assign an INCIDENT COMMANDER who COORDINATES — comms, delegation, decisions — rather than fixes) → TRIAGE (set a severity; start a status page / stakeholder comms) → MITIGATE (stop the bleeding by the FASTEST available means: roll back, scale up, fail over, turn a feature flag off) → RESOLVE (confirm the impact is over) → REVIEW (a blameless postmortem). MITIGATE BEFORE ROOT-CAUSE: the goal DURING an incident is to END THE USER IMPACT, not to understand it. A rollback that restores service in 5 minutes beats a root cause found in 2 hours while users are still failing. Understanding comes in the REVIEW. BLAMELESS POSTMORTEM: ASSUMPTION — everyone involved acted REASONABLY given the information they had AT THE TIME. OUTPUTS: (1) a factual TIMELINE (deploy → first errors → alert → IC declared → mitigation started → recovered, with timestamps); (2) CONTRIBUTING FACTORS — almost always PLURAL + SYSTEMIC, not one person\'s error (e.g. "config had no schema so a typo was silently ignored" + "no canary so 100% of traffic hit it at once" + "the burn threshold was too low so it took 36 min to page" + "rollback needed editing 3 files + a manual apply"); (3) ACTION ITEMS, each with a NAMED OWNER + a DUE DATE, each removing ONE link from the chain. GOOD action item: "add a JSON schema + CI validation for this config — @dana by 09-20". BAD action item: "X will be more careful" / "remind the team to double-check" — that\'s a WISH, not a change; the next tired engineer at 2am makes the same class of mistake. "WHO caused it" is the WRONG question — it makes people HIDE information + stop reporting near-misses. "WHAT let a single mistake become an outage" is the RIGHT one. RUNBOOK = the step-by-step for a specific known alert/task (how to confirm it\'s real → how to mitigate → who to escalate to), LINKED directly from the alert, and kept TESTED — a stale runbook is WORSE than none (it sends the responder confidently down a path that no longer works).',
        hintHi: 'INCIDENT LIFECYCLE: DETECT → DECLARE (name karो; ek INCIDENT COMMANDER assign karो jo COORDINATE karता hai, fix nahi) → TRIAGE (severity; status page) → MITIGATE (bleeding rोko FASTEST means se: roll back, scale, failover, flag-off) → RESOLVE → REVIEW. MITIGATE BEFORE ROOT-CAUSE: goal USER IMPACT END karना hai, samajhना nahi. 5-min rollback > 2h root cause. BLAMELESS POSTMORTEM: ASSUMPTION — har koi REASONABLY act kiya us samay jo info thi uske saath. OUTPUTS: (1) factual TIMELINE; (2) CONTRIBUTING FACTORS — PLURAL + SYSTEMIC; (3) ACTION ITEMS, har ek NAMED OWNER + DUE DATE. GOOD: "add a JSON schema + CI validation — @dana by 09-20". BAD: "X will be more careful" — ek WISH. "WHO caused it" WRONG question. "WHAT let a single mistake become an outage" RIGHT. RUNBOOK = ek known alert ke liye step-by-step, alert se LINKED, TESTED — ek stale runbook none se WORSE hai.',
      },
    ],

    keyTakeaways: [
      'SLI = a number measuring USER EXPERIENCE as good-events / total-events over a window (availability, latency-as-a-ratio, correctness, freshness), measured AT THE USER\'S POV not "was the process up". SLO = the target for an SLI over a window ("99.9% over 28 rolling days"), picked from what users NEED + what\'s ACHIEVABLE — NOT max nines (each extra 9 ≈ 10× cost; 99.9% = 43 min/mo, 99.99% = 4.3 min). Different SLIs of one service get different SLOs.',
      'ERROR BUDGET = (1 − SLO) × total — the ALLOWED failure, a RESOURCE TO SPEND. Budget high → ship fast, take risks. Budget spent → FREEZE features, fix reliability until the rolling window refills. This is the point of an SLO: it turns "how much reliability" from a dev-vs-ops argument into a number both agreed to, and makes "too unstable to ship" objective.',
      'BURN RATE = current error ratio / SLO error ratio (1× = on track to use the whole budget by the window end; 14.4× = exhaust it in ~2 days of a 30d window). ALERT with MULTI-WINDOW MULTI-BURN-RATE: page when burn > 14.4 over 1h AND 5m (long window = sustained; short window = still happening, so the alert auto-clears ~5 min after recovery); a slower burn (>3× over 24h + 2h) is a TICKET, not a page.',
      'ALERT ON SYMPTOMS (SLO burn, latency, error rate — what the user feels), NOT CAUSES (CPU, a pod restart, disk % — often normal). Every PAGE must pass 3 tests: (1) real user impact now/imminent, (2) actionable by the person paged, (3) linked to a runbook. Fail any → a ticket or delete it. A noisy pager trains people to ack-and-ignore, and the one real page is missed.',
      'INCIDENT LIFECYCLE: detect → declare (+ an Incident Commander who coordinates) → triage → MITIGATE (roll back / scale / failover / flag-off — BEFORE root-causing; a 5-min rollback beats a 2-hour root cause) → resolve → review. A BLAMELESS POSTMORTEM assumes everyone acted reasonably, produces a TIMELINE + PLURAL SYSTEMIC contributing factors + ACTION ITEMS with owners + due dates ("add schema validation", not "be more careful"). A RUNBOOK is the tested step-by-step linked from each alert.',
    ],
    keyTakeawaysHi: [
      'SLI = ek number jo USER EXPERIENCE ko good-events / total-events ke roop mein ek window ke over measure karता hai, USER KE POV PAR measured, "kya process up tha" nahi. SLO = ek SLI ke liye target ek window ke over ("99.9% over 28 rolling days"), users ko kya CHAHIए + ACHIEVABLE se picked — max nines NAHI (har extra 9 ≈ 10× cost). Ek service ke different SLIs different SLOs paते hain.',
      'ERROR BUDGET = (1 − SLO) × total — ALLOWED failure, ek RESOURCE TO SPEND. Budget high → fast ship, risks. Budget spent → features FREEZE, reliability fix jab tak rolling window refill nahi karता. Ye ek SLO ka point hai: "kitni reliability" ko ek argument se ek number mein badalता hai.',
      'BURN RATE = current error ratio / SLO error ratio (1× = track par; 14.4× = 30d window ke ~2 days mein exhaust). MULTI-WINDOW MULTI-BURN-RATE se ALERT karो: page jab burn > 14.4 over 1h AND 5m (long window = sustained; short window = abhi bhi ho raha hai, to alert ~5 min baad auto-clear); ek slower burn (>3× over 24h + 2h) ek TICKET hai, ek page nahi.',
      'SYMPTOMS PAR ALERT KARO (SLO burn, latency, error rate — jo user feel karता hai), CAUSES PAR NAHI (CPU, ek pod restart, disk % — aksar normal). Har PAGE 3 tests pass karना chahिए: (1) abhi/imminent real user impact, (2) paged person dwara actionable, (3) ek runbook se linked. Fail any → ek ticket ya delete. Ek noisy pager logon ko ack-and-ignore sikhाता hai.',
      'INCIDENT LIFECYCLE: detect → declare (+ ek Incident Commander jo coordinate karता hai) → triage → MITIGATE (roll back / scale / failover / flag-off — root-causing se PEHLE; ek 5-min rollback ek 2-hour root cause se better) → resolve → review. Ek BLAMELESS POSTMORTEM assume karता hai har koi reasonably act kiya, ek TIMELINE + PLURAL SYSTEMIC contributing factors + ACTION ITEMS owners + due dates ke saath produce karता hai ("schema validation add karो", "zyada careful raho" nahi). Ek RUNBOOK har alert se linked tested step-by-step hai.',
    ],
  },
];
