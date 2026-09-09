import type { CourseLesson } from './course-js-module1';

// DevOps Module 15 — Observability: Logs, Metrics & Traces
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module15-part2.ts.
//
// VERIFICATION: PROSE + realistic hand-written output (log lines, PromQL results,
// trace waterfalls, alert rules). No live telemetry stack; examples carry no
// `# VERIFY` marker, so verify-bash.mjs scans them structurally only. Where a tool
// exists offline (promtool, a local Prometheus) it is used in Module 16, not here.

export const DEVOPS_MODULE_15: CourseLesson[] = [
  {
    slug: 'ops-the-three-pillars-and-why-one-is-not-enough',
    title: 'The Three Pillars & Why One Is Not Enough',
    titleHi: 'Teen Pillars Aur Ek Kyun Enough Nahi',
    description:
      'Logs, metrics, and traces each answer a different question about a running system, and none of them answers all three. This lesson defines what each signal is, what it is good and bad at, why a production system needs all three plus the connective tissue between them, and the difference between "monitoring" (watching known failure modes) and "observability" (being able to ask new questions of a system you did not anticipate).',
    descriptionHi:
      'Logs, metrics, aur traces har ek ek running system ke baare mein ek alag question answer karte hain, aur unme se koi bhi teenon answer nahi karta. Ye lesson define karta hai har signal kya hai, ye kis mein achha aur bura hai, ek production system ko teenon plus unke beech connective tissue kyun chahिए, aur "monitoring" (known failure modes dekhna) aur "observability" (ek system se naye questions poochne ki ability jise aapne anticipate nahi kiya) mein difference.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Investigating what happened at a busy restaurant last night.** Metrics are the tallies the manager keeps: covers served per hour, average ticket time, number of complaints — cheap to record, great for spotting that Tuesday was slow, useless for explaining *why* table 12 waited an hour. Logs are the individual dockets: every order, timestamped, with notes ("no onions", "sent back"). You can reconstruct one table\'s whole evening from them, but reading every docket to find a pattern is a night\'s work. Traces are following one specific party from the door to the bill: they were seated at 8:04, the order reached the kitchen at 8:19 (fifteen minutes lost at the host stand), the main sat under the pass for twelve minutes waiting on the fryer. Each view is necessary; the fryer bottleneck is invisible in the tallies, buried in the dockets, and obvious in the trace.',
      hi: '**Kal raat ek busy restaurant mein kya hua investigate karna.** Metrics wo tallies hain jo manager rakhta hai: per hour covers served, average ticket time, complaints ki number — record karne ke liye cheap, ye spot karne ke liye great ki Tuesday slow tha, ye explain karne ke liye useless ki table 12 ne ek ghanta *kyun* wait kiya. Logs individual dockets hain: har order, timestamped, notes ke saath ("no onions", "sent back"). Aap unse ek table ki poori shaam reconstruct kar sakte ho, par ek pattern dhoondhne ke liye har docket padhna ek raat ka kaam hai. Traces ek specific party ko door se bill tak follow karna hai: unhe 8:04 par seated kiya gaya, order 8:19 par kitchen pahuncha (host stand par pandrah minute khoye), main pass ke neeche baarah minute baitha fryer ka wait karta hua. Har view zaroori hai; fryer bottleneck tallies mein invisible hai, dockets mein buried, aur trace mein obvious.',
    },

    simple: `**THE THREE PILLARS** — each answers a different question:
\`\`\`
METRICS   numbers over time, aggregated. "HOW MUCH / HOW MANY / HOW FAST, right now
          and over the last hour?" e.g. request rate, error %, p99 latency, CPU,
          queue depth. cheap to store (a few numbers per series per scrape), fast
          to query, ideal for DASHBOARDS + ALERTS + trends.
          BAD AT: "why is THIS request slow?" - a metric is already an aggregate,
          the individual request is gone.
LOGS      timestamped records of discrete events, one line per event. "WHAT HAPPENED
          to THIS request / user / order?" e.g. "2026-09-09T10:03:12Z level=error
          trace_id=abc msg='payment declined' order=42 code=card_expired".
          great for the DETAIL of a specific thing once you know what to look for.
          BAD AT: aggregation at scale (counting errors by scanning every line is
          slow + expensive), and finding the needle without a starting point.
TRACES    the causally-linked path of ONE request across ALL the services it
          touched, as a tree of timed SPANS. "WHERE did the time go / WHERE did it
          fail, across the whole distributed call?" shows the critical path, the
          slow dependency, the retry storm, the N+1.
          BAD AT: aggregate trends (that's metrics), full payload detail (that's
          logs), and it's usually SAMPLED so any single trace may not exist.
\`\`\`

**WHY YOU NEED ALL THREE** (the workflow):
\`\`\`
1. an ALERT fires off a METRIC:  "checkout error rate > 2% for 5m"
2. a DASHBOARD (metrics) narrows it: errors are all on the /pay endpoint, only in
   eu-west-1, starting 10:02, correlated with a DB latency spike
3. a TRACE of a failing /pay request shows: 4.8s total, 4.6s of it in a single
   call to  payment-gateway.charge  which then timed out
4. the LOGS for that span (found via the trace_id) show:
   "upstream connect timeout, pool exhausted (max=20, active=20)"
   -> root cause: connection pool too small for the retry load. metrics found it,
      the trace localised it, the logs explained it.
\`\`\`

**MONITORING vs OBSERVABILITY:**
\`\`\`
MONITORING     watching a KNOWN set of failure modes: dashboards + alerts you built
               because you predicted "the DB could fill up / the queue could back up".
               answers questions you thought of in advance.
OBSERVABILITY  being able to ask NEW questions of the system - ones you didn't
               anticipate - from the telemetry you already emit, WITHOUT shipping
               new code. "show me p99 latency for requests from customer X, on
               API version 3, hitting a cold cache" - if you can answer that ad hoc,
               the system is observable. requires HIGH-CARDINALITY data (traces,
               structured logs / wide events) - not just pre-aggregated metrics.
\`\`\`
The modern take: emit **wide, structured events** (one rich record per unit of
work, with dozens of dimensions) and derive metrics + traces from them - so you
are never limited to the dimensions someone pre-decided to count.`,

    simpleHi: `**TEEN PILLARS** — har ek ek alag question answer karta hai:
\`\`\`
METRICS   time ke over numbers, aggregated. "KITNA / KITNE / KITNA FAST, abhi aur
          pichle ghante ke over?" e.g. request rate, error %, p99 latency, CPU,
          queue depth. store karne ke liye cheap, query karne ke liye fast,
          DASHBOARDS + ALERTS + trends ke liye ideal.
          BAD AT: "YE request slow kyun hai?" - ek metric already ek aggregate hai.
LOGS      discrete events ke timestamped records, per event ek line. "IS request /
          user / order ko KYA HUA?" e.g. "2026-09-09T10:03:12Z level=error
          trace_id=abc msg='payment declined' order=42 code=card_expired".
          ek specific cheez ke DETAIL ke liye great jab aap jaante ho kya dhoondhna hai.
          BAD AT: scale par aggregation, aur ek starting point ke bina needle dhoondhna.
TRACES   EK request ka causally-linked path SAARE services ke across jo ise touch
          kiye, timed SPANS ke ek tree ke roop mein. "poore distributed call ke
          across time KAHAAN gaya / KAHAAN fail hua?" critical path, slow dependency,
          retry storm, N+1 dikhata hai.
          BAD AT: aggregate trends (wo metrics hai), full payload detail (wo logs
          hai), aur ye usually SAMPLED hai to koi single trace exist nahi kar sakta.
\`\`\`

**AAPKO TEENON KYUN CHAHIE** (workflow):
\`\`\`
1. ek ALERT ek METRIC se fire karta hai:  "checkout error rate > 2% for 5m"
2. ek DASHBOARD (metrics) ise narrow karta hai: errors sab /pay endpoint par hain,
   sirf eu-west-1 mein, 10:02 par shuru, ek DB latency spike se correlated
3. ek failing /pay request ka ek TRACE dikhata hai: 4.8s total, 4.6s iska ek single
   call mein  payment-gateway.charge  ko jo phir timed out
4. us span ke LOGS (trace_id se mile) dikhate hain:
   "upstream connect timeout, pool exhausted (max=20, active=20)"
   -> root cause: retry load ke liye connection pool bahut chhota. metrics ne ise
      paya, trace ne ise localise kiya, logs ne ise explain kiya.
\`\`\`

**MONITORING vs OBSERVABILITY:**
\`\`\`
MONITORING     failure modes ke ek KNOWN set ko dekhna: dashboards + alerts jo aapne
               banaye kyunki aapne predict kiya. wo questions answer karta hai jo
               aapne pehle se socha.
OBSERVABILITY  system se NAYE questions poochne ki ability - jo aapne anticipate nahi
               kiye - us telemetry se jo aap already emit karte ho, bina naya code
               ship kiye. "customer X se, API version 3 par, ek cold cache hit karte
               requests ke liye p99 latency dikhao" - agar aap ise ad hoc answer kar
               sakte ho, system observable hai. HIGH-CARDINALITY data (traces,
               structured logs / wide events) chahिए - sirf pre-aggregated metrics nahi.
\`\`\`
Modern take: **wide, structured events** emit karo (per unit of work ek rich record,
dozens dimensions ke saath) aur unse metrics + traces derive karo - to aap kabhi
un dimensions tak limited nahi ho jo kisi ne pehle se count karne ka decide kiya.`,

    content: `## Three signals, three questions

Observability rests on three kinds of telemetry, each of which answers a question the others cannot answer well.

**Metrics** are numeric measurements recorded over time and stored as time series — a request counter, an error percentage, a latency histogram, CPU utilisation, a queue depth. Each series is a small amount of data (a handful of numbers per scrape), so metrics are cheap to store for long retention, fast to query, and aggregate naturally across many instances. They answer "how much, how many, how fast, right now and over the last hour or week", which makes them the basis of dashboards, alerts, and trend analysis. What they cannot do is explain an individual event: a metric is already an aggregate, so once you know the p99 latency rose, the specific slow requests that caused it are not in the metric.

**Logs** are timestamped records of discrete events, one entry per event, ideally structured as key-value fields rather than free text. They answer "what happened to this specific request, user, order, or job" — the detailed narrative of one thing. They are excellent once you know what you are looking for and have an identifier to search on. They are poor at aggregation at scale, because counting or grouping means scanning every matching line, which is slow and expensive at high volume, and they are poor at the first step of an investigation when you have a symptom but no starting identifier.

**Traces** capture the causally linked path of a single request as it moves through every service, queue, and database it touches, represented as a tree of **spans**, each span being a timed operation with a parent. They answer "where did the time go, and where did it fail, across the entire distributed call" — the critical path, a slow downstream dependency, a retry storm, an N-plus-one query pattern. They are poor at aggregate trends, which is what metrics are for, and at carrying full payload detail, which is what logs are for; and because tracing every request is usually too expensive, traces are typically sampled, so any particular request may not have a stored trace.

## Why a production system needs all three

The three signals form an investigation workflow, each handing off to the next. An alert fires from a **metric** — "checkout error rate above two percent for five minutes". A **dashboard**, also metrics, narrows the scope: the errors are all on one endpoint, only in one region, starting at a specific minute, correlated with a spike in database latency. A **trace** of one failing request localises the problem to a single span — four point six of the request\'s four point eight seconds were spent in one call to a payment gateway that then timed out. The **logs** for that span, found by the trace ID, give the reason — "connection pool exhausted, max twenty, active twenty". Metrics found that something was wrong and roughly where; the trace pinpointed which operation; the logs explained why. Remove any one of the three and the investigation stalls: metrics alone tell you there is a problem but not which call or why, logs alone drown you unless you already have the trace ID, and traces alone show you the shape of the slowness but not the trend or the underlying error message.

## Monitoring versus observability

**Monitoring** is watching a known, predefined set of failure modes. You build a dashboard and an alert for "the database disk could fill up" or "the queue could back up" because you anticipated those failures. Monitoring answers questions you thought of in advance, and it is essential — but it only covers the failures you predicted.

**Observability** is the property of being able to ask *new* questions of the system — questions you did not anticipate — from the telemetry it already emits, without shipping new instrumentation. If a novel problem appears and you can investigate it by slicing your existing data along dimensions you did not pre-plan — "show me p99 latency for requests from this one customer, on API version 3, that hit a cold cache" — then the system is observable. This requires **high-cardinality data**: traces and richly structured logs that carry many dimensions per event, not just a small set of pre-aggregated metric labels. A system that emits only counters labelled with a few low-cardinality dimensions is monitorable but not observable, because the moment the useful dimension is one nobody thought to add as a label, the data to answer the question does not exist.

## The modern synthesis: wide structured events

The current best practice, sometimes called "observability 2.0", is to emit one **wide, structured event** per unit of work — an HTTP request, a job, a message consumed — carrying every dimension that might matter: the endpoint, the customer, the region, the API version, the build SHA, cache hit or miss, downstream call durations, queue wait time, the user\'s plan tier, feature flags in effect, and dozens more. Metrics and traces are then derived from these events rather than emitted separately. The payoff is that you are never limited to the dimensions someone decided to count in advance; any question that can be expressed as a filter and aggregation over the event fields can be answered after the fact. The cost is storage and query infrastructure that can handle high-cardinality event data, which is why this approach is associated with columnar event stores rather than traditional metric databases — covered further in Module 16.`,

    contentHi: `## Teen signals, teen questions

Observability teen kinds ki telemetry par rests karti hai, jinme se har ek ek question answer karti hai jo doosre achhi tarah answer nahi kar sakte.

**Metrics** time ke over recorded numeric measurements hain aur time series ke roop mein stored hain — ek request counter, ek error percentage, ek latency histogram, CPU utilisation, ek queue depth. Har series data ki ek chhoti amount hai, to metrics long retention ke liye store karne ke liye cheap hain, query karne ke liye fast, aur kई instances ke across naturally aggregate hote hain. Wo answer karte hain "kitna, kitne, kitna fast, abhi aur pichle ghante ya hafte ke over". Jo wo nahi kar sakte wo ek individual event explain karna hai: ek metric already ek aggregate hai.

**Logs** discrete events ke timestamped records hain, per event ek entry, ideally key-value fields ke roop mein structured free text ke bajaay. Wo answer karte hain "is specific request, user, order, ya job ko kya hua". Wo excellent hain jab aap jaante ho aap kya dhoondh rahe ho. Wo scale par aggregation mein poor hain, kyunki counting ya grouping ka matlab har matching line scan karna hai.

**Traces** ek single request ka causally linked path capture karte hain jaise ye har service, queue, aur database ke through move karta hai jise ye touch karta hai, **spans** ke ek tree ke roop mein represented. Wo answer karte hain "poore distributed call ke across time kahaan gaya, aur kahaan fail hua". Wo aggregate trends mein poor hain, aur full payload detail carry karne mein; aur kyunki har request trace karna usually bahut expensive hai, traces typically sampled hain.

## Ek production system ko teenon kyun chahिए

Teen signals ek investigation workflow banate hain, har ek agle ko hand off karta hua. Ek alert ek **metric** se fire karta hai. Ek **dashboard** scope narrow karta hai. Ek **trace** problem ko ek single span mein localise karta hai. Us span ke **logs** reason dete hain. Metrics ne paya ki kuch galat tha; trace ne pinpoint kiya kaun sा operation; logs ne explain kiya kyun. Teenon mein se koi ek hatao aur investigation stall ho jaati hai.

## Monitoring versus observability

**Monitoring** failure modes ke ek known, predefined set ko dekhna hai. Aap ek dashboard aur ek alert "database disk fill up ho sakta hai" ke liye banate ho kyunki aapne un failures ko anticipate kiya. Monitoring un questions ko answer karta hai jo aapne pehle se socha.

**Observability** system se *naye* questions poochne ki ability ki property hai — questions jo aapne anticipate nahi kiye — us telemetry se jo ye already emit karta hai, bina naya instrumentation ship kiye. Ye **high-cardinality data** chahिए: traces aur richly structured logs jo per event kई dimensions carry karte hain.

## Modern synthesis: wide structured events

Current best practice per unit of work ek **wide, structured event** emit karna hai — har dimension carry karta hua jo matter kar sakta hai. Metrics aur traces phir in events se derive hote hain. Payoff ye hai ki aap kabhi un dimensions tak limited nahi ho jo kisi ne pehle se count karne ka decide kiya.`,

    examples: [
      {
        title: 'The same incident seen through each pillar — and why you need all three',
        titleHi: 'Wahi incident har pillar ke through dekha — aur aapko teenon kyun chahिए',
        code: `# INCIDENT: "the app feels slow" reported by users at 10:05.

# --- METRICS view (a dashboard) ---
  http_request_duration_seconds{quantile="0.99"}  jumped 0.3s -> 2.1s at 10:02
  http_requests_total{status=~"5.."}  rate went 0.1/s -> 4/s at 10:02
  ...both ONLY for  route="/api/search"  and  region="eu-west-1"
  db_connection_pool_active / db_connection_pool_max  = 20/20 (saturated) since 10:01
  -> WHAT + WHERE + WHEN, roughly. NOT why. NOT which query.

# --- LOGS view (filtered to the window + route, ~40,000 lines) ---
  10:02:14Z level=error route=/api/search trace_id=7f3a msg="query timeout after 3s"
  10:02:14Z level=warn  msg="db pool wait 2.9s" pool=main
  10:02:15Z level=error route=/api/search trace_id=9b1c msg="query timeout after 3s"
  ... thousands more like this ...
  -> confirms "db pool + slow query" but you're scrolling. which query? started by what?

# --- TRACE view (one sampled slow /api/search request, trace_id=7f3a) ---
  GET /api/search .......................................... 3204ms
   ├─ auth.check ............ 12ms
   ├─ db.pool.acquire ....... 2870ms   <-- 90% of the time, WAITING for a connection
   └─ db.query "SELECT ... FROM products WHERE ... ILIKE '%...%'"  312ms (then timeout)
  -> the request isn't slow because the QUERY is slow (312ms). it's slow because it
     WAITS 2.9s to even get a connection. the pool is the bottleneck, not the SQL.

# --- back to LOGS, now targeted (trace_id=7f3a's siblings + the deploy log) ---
  09:58Z msg="deploy complete" version=v481 change="add /api/search autocomplete"
  -> v481 added a new endpoint that fires a search query on every keystroke.
     3x the query volume -> pool exhausted -> everything waiting. ROOT CAUSE.`,
        output: `Metrics said: 5xx + p99 up on /api/search in eu-west-1 since 10:02, pool
saturated. Necessary, not sufficient - no "why". Logs said: pool waits + query
timeouts, thousands of them - the symptom in detail, but you're scrolling for the
cause. The TRACE said: 90% of the request is spent WAITING for a pool connection,
not running the query - so the fix is the pool / the query volume, NOT query
optimisation. Then a targeted log query found the 09:58 deploy that tripled search
volume. Each pillar moved the investigation exactly one step it could not have
taken alone.`,
        explain: 'A vague "the app is slow" report is investigated through each pillar in turn. The metrics dashboard establishes the shape of the problem quickly: fifth-percentile errors and p99 latency both jumped at 10:02, but only for the search route and only in one region, and the database connection pool has been fully saturated since one minute earlier. This is necessary context — what, where, when — but it contains no explanation of why the pool saturated or which operation is responsible. The logs, filtered to that window and route, confirm the symptom in detail — thousands of pool-wait warnings and query timeouts — but reading them is scrolling, and they do not by themselves reveal what triggered the change. A single sampled trace of a slow search request is the decisive step: it shows that ninety percent of the request\'s time is spent in \`db.pool.acquire\`, waiting for a connection, and only three hundred milliseconds in the query itself. That reframes the fix entirely — the query is not slow, the request is starved of connections — so the answer is pool size or query volume, not query tuning. A final targeted log query, now knowing to look for a change in volume, finds a deploy nine minutes before the incident that added an autocomplete endpoint firing a search on every keystroke, tripling query volume and exhausting the pool. Each pillar advanced the investigation by exactly the step the others could not.',
        explainHi: 'Ek vague "app slow hai" report har pillar ke through baari baari investigate ki jaati hai. Metrics dashboard problem ka shape jaldi establish karta hai: 5xx errors aur p99 latency dono 10:02 par jump hue, par sirf search route ke liye aur sirf ek region mein, aur database connection pool ek minute pehle se fully saturated hai. Ye necessary context hai — kya, kahaan, kab — par isme koi explanation nahi hai kyun. Logs, us window aur route ke liye filtered, symptom ko detail mein confirm karte hain — hazaron pool-wait warnings — par unhe padhna scrolling hai. Ek single sampled trace decisive step hai: ye dikhata hai ki request ka navve percent time \`db.pool.acquire\` mein spent hai, ek connection ka wait karta hua, aur sirf teen sau millisecond query mein khud. Ye fix ko poori tarah reframe karta hai. Ek final targeted log query ek deploy dhoondhti hai jo har keystroke par ek search fire karta tha.',
      },
      {
        title: 'A monitorable-but-not-observable system, and the question it cannot answer',
        titleHi: 'Ek monitorable-but-not-observable system, aur wo question jo ye answer nahi kar sakta',
        code: `# SYSTEM A (monitorable): metrics only, a few low-cardinality labels.
  http_requests_total{route, method, status}         # route ~30 values, status ~6
  http_request_duration_seconds{route, method}       # a histogram per route
# what you CAN answer: "error rate by route", "p99 for /checkout", "traffic trend".
# NEW QUESTION (a support escalation): "customer 8813 says every request is slow
#   since this morning. is it them, their region, their plan tier, a feature flag,
#   or a specific API version?"
# what you can do with SYSTEM A:  ...nothing. there is no customer_id label (it
#   would be 200k values - a cardinality bomb), no plan_tier, no flag, no api_version.
#   you'd have to SHIP CODE to add the instrumentation, deploy, and wait for it to
#   recur. hours-to-days.

# SYSTEM B (observable): one wide structured event per request.
  {
    "ts": "2026-09-09T10:03:12.441Z", "route": "/api/orders", "method": "GET",
    "status": 200, "duration_ms": 1840,
    "customer_id": "8813", "plan_tier": "enterprise", "region": "ap-south-1",
    "api_version": "3", "build": "v487", "cache": "miss",
    "db_ms": 1610, "db_queries": 47,          # <-- 47 queries! an N+1
    "upstream_ms": {"pricing": 90, "inventory": 40},
    "flags": ["orders_v3_pagination", "new_pricing_engine"],
    "trace_id": "c1d2e3"
  }
# NEW QUESTION, answered ad hoc in one query, no deploy:
#   SELECT count(*), avg(duration_ms), avg(db_queries)
#   FROM events WHERE customer_id='8813' AND ts > '2026-09-09T06:00Z'
#   GROUP BY flags, cache
#   -> customer 8813, on flag 'orders_v3_pagination', cache=miss: avg 47 db_queries,
#      avg 1840ms. same customer WITHOUT that flag: 3 queries, 120ms.
#   -> the new pagination code has an N+1; it's flag-gated; 8813 is in the rollout.
#   time to answer: 5 minutes.`,
        output: `System A is MONITORABLE - it answers the questions its labels were designed for.
It is NOT OBSERVABLE - a question about a dimension nobody pre-labelled (customer,
plan, flag, api version) cannot be answered without shipping new code. System B
emits a WIDE EVENT with dozens of dimensions per request, so a brand-new question
- "which flag makes customer 8813 slow?" - is a filter + group-by away, answered
in minutes with no deploy. Observability = can you ask questions you didn't plan
for.`,
        explain: 'Two systems instrument the same application differently. System A emits only metrics with a few carefully chosen low-cardinality labels — route, method, status — because adding a high-cardinality label like customer ID would create hundreds of thousands of time series and overwhelm the metrics database. It can answer every question those labels were designed for: error rate per route, p99 for a given endpoint, traffic trends. But when a support escalation arrives asking whether one specific customer\'s slowness is due to their region, their plan tier, a feature flag, or an API version, System A has no data — none of those dimensions exist as labels, and getting them means writing instrumentation code, deploying it, and waiting for the problem to recur, which takes hours to days. System B emits one wide structured event per request carrying dozens of dimensions: customer, plan tier, region, API version, build, cache result, per-downstream durations, the number of database queries, the feature flags in effect, the trace ID. The same brand-new question is now a single filter-and-group-by query over the event store, and it reveals in five minutes that the customer is slow only when a specific pagination feature flag is on and the cache misses, because that code path issues forty-seven database queries instead of three — an N-plus-one in flag-gated code. The difference is not the volume of telemetry but its shape: System B is observable because its data carries the dimensions needed to answer questions nobody planned for.',
        explainHi: 'Do systems same application ko alag tarah instrument karte hain. System A sirf metrics emit karta hai kuch carefully chosen low-cardinality labels ke saath — route, method, status — kyunki ek high-cardinality label jaise customer ID add karna sैंकdon hazaron time series banata. Ye har question answer kar sakta hai jinke liye wo labels designed the. Par jab ek support escalation aati hai poochti hui ki ek specific customer ki slowness unke region, unke plan tier, ek feature flag, ya ek API version ki wajah se hai, System A ke paas koi data nahi hai. System B per request ek wide structured event emit karta hai dozens dimensions carry karta hua. Wahi brand-new question ab ek single filter-and-group-by query hai, aur ye paanch minute mein reveal karta hai ki customer sirf tab slow hai jab ek specific pagination feature flag on hai aur cache misses.',
      },
    ],

    mistakes: [
      {
        wrong: `# treating one pillar as "observability" and skipping the others
# TEAM A: "we have Prometheus + Grafana, we're covered." metrics only.
#   -> every incident: they see the p99 spike, then spend 45 minutes SSHing into
#      boxes and grepping logs by hand because there's no aggregated logging and
#      no tracing. MTTR is dominated by "where is this even happening".
# TEAM B: "we log everything to a big index." logs only.
#   -> the log bill is enormous, dashboards are slow (aggregating over billions of
#      lines), there are no real-time alerts on latency percentiles, and cross-
#      service latency is invisible (you can't see the call graph in logs).`,
        right: `# all three, each doing its job, wired together:
#   METRICS   -> dashboards + alerts + long-term trends (cheap, fast, aggregate)
#   LOGS      -> structured, sampled at high volume, searchable by trace_id/request_id,
#               retained shorter, used for the DETAIL once metrics/traces localise it
#   TRACES    -> sampled, show the cross-service critical path + slow dependency
#   THE GLUE: every log line and every span carries the same trace_id; metrics
#             carry EXEMPLARS (a sample trace_id attached to a histogram bucket)
#             so you click a spike on a graph and jump straight to a slow trace.
# now an investigation is: alert -> dashboard -> exemplar -> trace -> logs, minutes.`,
        why: 'Each pillar is genuinely bad at what the other two are good at, so relying on one forces you to do the others\' jobs badly by hand. A metrics-only team sees that latency spiked but has no aggregated way to find which requests or why, so every incident includes a manual phase of connecting to hosts and grepping, and mean time to resolution is dominated by locating the problem rather than fixing it. A logs-only team pays enormous storage and query costs because logs are the least efficient way to compute aggregates, cannot alert cleanly on latency percentiles because that requires a histogram not a text scan, and cannot see cross-service latency because a flat log stream does not carry the call graph. The correct approach uses all three for their strengths: metrics for cheap fast aggregates that drive dashboards and alerts, structured logs sampled at volume for the per-event detail once you know where to look, and sampled traces for the cross-service critical path. Crucially they are wired together — every log line and span carries the same trace ID, and metrics carry exemplars that attach a sample trace ID to a histogram bucket — so an investigation flows from an alert to a dashboard to an exemplar to a trace to the relevant logs in minutes, with each pillar handing off to the next rather than each team reinventing the others.',
        whyHi: 'Har pillar genuinely bura hai us mein jo doosre do achhe hain, to ek par rely karna aapko doosron ke jobs badly by hand karne ke liye force karta hai. Ek metrics-only team dekhti hai ki latency spiked par uske paas koi aggregated way nahi hai dhoondhne ki kaun se requests ya kyun. Ek logs-only team enormous storage aur query costs pay karti hai kyunki logs aggregates compute karne ka least efficient way hain. Correct approach teenon ko unki strengths ke liye use karta hai: dashboards aur alerts drive karne wale cheap fast aggregates ke liye metrics, per-event detail ke liye volume par sampled structured logs, aur cross-service critical path ke liye sampled traces. Crucially wo ek saath wired hain — har log line aur span same trace ID carry karta hai.',
      },
      {
        wrong: `# adding a high-cardinality label to a metric to make it "observable"
  http_requests_total{route, method, status, user_id, request_id, session_id}
# user_id ~ 300,000 values ; request_id ~ millions ; session_id ~ hundreds of thousands
# -> the number of time series = 30 routes x 6 statuses x 300,000 users x ...
#    = tens of millions of series. Prometheus OOMs. the scrape times out. the
#    query engine falls over. and after the outage you delete the labels and are
#    back to a non-observable system.`,
        right: `# metrics stay LOW-cardinality; put the high-cardinality dimensions where they
# belong - in traces and structured events:
#   metric:  http_requests_total{route, method, status, region}   # all bounded, small
#   event/span:  { route, method, status, region, user_id, request_id, session_id,
#                  plan_tier, api_version, build, cache, db_ms, ... }   # dozens of dims
# then:
#   - aggregate questions ("error rate by route+region")   -> the metric
#   - "why is user 8813 slow" (any dimension, ad hoc)       -> query the events
#   - "walk one slow request end to end"                    -> the trace
# rule of thumb: a metric label's value set should be small and BOUNDED (< ~100,
# ideally < ~20). if it can grow with users/requests/time, it's not a label.`,
        why: 'The cost of a metrics system scales with the number of distinct time series, and a time series is created for every unique combination of label values. Adding a label whose values grow without bound — a user ID, a request ID, a session ID, an email, a full URL — multiplies the series count by the cardinality of that label, and combined with the other labels this reaches tens of millions of series from what was thousands. The metrics database runs out of memory, scrapes time out, and queries collapse, turning the observability system itself into an outage. After the incident the labels get removed and the system is back to being non-observable. The resolution is to keep metrics strictly low-cardinality — every label\'s value set small and bounded, ideally under about twenty and certainly under a hundred — and to put the high-cardinality dimensions where they are designed to live: in trace spans and wide structured events, which are stored in systems built for high cardinality. Aggregate questions are then answered by the bounded metric, ad-hoc questions about any dimension are answered by querying the events, and a single request walkthrough is the trace. The test for whether something can be a metric label is simple: if its set of possible values can grow with the number of users, requests, or the passage of time, it is not a label.',
        whyHi: 'Ek metrics system ki cost distinct time series ki number ke saath scale karti hai, aur ek time series har unique combination of label values ke liye banti hai. Ek label add karna jiske values bina bound ke grow karte hain — ek user ID, ek request ID, ek session ID — us label ki cardinality se series count multiply karta hai, aur doosre labels ke saath combined ye tens of millions series tak pahunch jaata hai. Metrics database memory se bahar ho jaata hai. Resolution metrics ko strictly low-cardinality rakhna hai — har label ka value set chhota aur bounded — aur high-cardinality dimensions ko wahaan daalna jahaan wo live karne ke liye designed hain: trace spans aur wide structured events mein. Test ye hai: agar iske possible values ka set users, requests, ya time ke saath grow kar sakta hai, ye ek label nahi hai.',
      },
      {
        wrong: `# building only "monitoring" - alerts for the failures you predicted - and
# calling the system observable
# the runbook has alerts for: disk > 85%, queue depth > 1000, error rate > 1%,
# p99 > 500ms, cert expiry < 7d. all good.
# then a NEW failure: a specific downstream API starts returning 200 OK with an
# empty body for 3% of requests. no alert fires (it's a 200). error rate is
# "fine". p99 is "fine". users see blank pages. you find out from Twitter, and
# you have no way to slice "empty-body responses by upstream" without new code.`,
        right: `# monitoring (predicted failures) AND observability (ask new questions):
#   - keep all the predictive alerts - they catch the common cases fast
#   - ALSO emit wide events with enough dimensions that a NOVEL failure is
#     investigable: response_size, upstream, upstream_status, content_type,
#     render_ok, ... so "3% empty bodies from the pricing API" is a query, not a
#     code change
#   - alert on SYMPTOMS the user feels (see Module 15 L6: SLO burn), not just on
#     the specific mechanisms you thought of - "success rate of the checkout
#     JOURNEY" would have caught the empty-body bug even though every HTTP call
#     returned 200.`,
        why: 'Monitoring covers the failure modes you predicted and built alerts for, and it is genuinely valuable for catching the common cases quickly, but it is inherently limited to what you anticipated. A novel failure that does not match any predicted pattern — a downstream service returning HTTP 200 with an empty body, so the error-rate and latency alerts all read normal while users get blank pages — produces no alert and, in a monitoring-only system, no way to investigate, because slicing by "response size" or "upstream" or "content type" requires dimensions nobody added. The system is monitorable but not observable. The fix has two parts. First, keep all the predictive alerts, because they are fast for the cases they cover. Second, emit wide events with enough dimensions that an unanticipated failure is still investigable after the fact — response size, upstream identity and status, content type, a render-success flag — so "three percent empty bodies from the pricing API" is a query rather than a new deploy. And alert on symptoms the user actually experiences, such as the success rate of the whole checkout journey, not only on the specific internal mechanisms you thought of, because a journey-level success metric would have caught the empty-body failure even though every individual HTTP call returned a 200.',
        whyHi: 'Monitoring un failure modes ko cover karta hai jo aapne predict kiye aur jinke liye alerts banaye, aur ye common cases ko jaldi catch karne ke liye genuinely valuable hai, par ye inherently us tak limited hai jo aapne anticipate kiya. Ek novel failure jo kisi predicted pattern se match nahi karta — ek downstream service HTTP 200 empty body ke saath return karta hua, to error-rate aur latency alerts sab normal read karte hain jabki users blank pages paate hain — koi alert produce nahi karta. Fix ke do parts hain. Pehle, saare predictive alerts rakho. Doosre, wide events emit karo kaafi dimensions ke saath ki ek unanticipated failure abhi bhi investigable hai. Aur un symptoms par alert karo jo user actually experience karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Metrics-only, 40-minute "where"** — a team ran Prometheus + Grafana and nothing else. Every incident opened with 20-40 minutes of SSH + grep to find which service and which request. Adding aggregated logs (with trace_id) and sampled tracing cut that phase to ~3 minutes; the same alerts, a fifth of the MTTR.',
        hi: '**Metrics-only, 40-minute "kahaan"** — ek team ne Prometheus + Grafana aur kuch nahi chalaya. Har incident 20-40 minute ke SSH + grep se khulta tha. Aggregated logs (trace_id ke saath) aur sampled tracing add karna us phase ko ~3 minute tak kata.',
      },
      {
        en: '**The customer_id label that OOM\'d Prometheus** — someone added `customer_id` to the request counter "to debug a customer issue". Series count went from ~80k to ~9M overnight; Prometheus OOM-looped, all dashboards and alerts went dark for 2 hours. The dimension moved to trace spans + a wide event; metrics stayed bounded.',
        hi: '**Wo customer_id label jisne Prometheus OOM kiya** — kisi ne request counter mein `customer_id` add kiya "ek customer issue debug karne ke liye". Series count ~80k se ~9M tak gaya; Prometheus OOM-loop hua, saare dashboards aur alerts 2 ghante andhere mein gaye.',
      },
      {
        en: '**200 OK, empty body, found on Twitter** — a pricing API started returning empty 200s for ~3% of calls after a deploy. Error-rate and latency alerts stayed green; users saw blank price fields. The team learned from social media 25 minutes in. Now they alert on a journey-level success SLI and emit `response_size` + `upstream` on every event.',
        hi: '**200 OK, empty body, Twitter par mila** — ek pricing API ek deploy ke baad ~3% calls ke liye empty 200s return karne laga. Error-rate aur latency alerts green rahe; users blank price fields dekhe. Team ne 25 minute mein social media se seekha. Ab wo ek journey-level success SLI par alert karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What question does each of logs, metrics, and traces answer best, and what is each bad at?',
        qHi: 'Logs, metrics, aur traces mein se har ek kaun sा question best answer karta hai, aur har ek kis mein bura hai?',
        a: 'Metrics answer "how much, how many, how fast, right now and over time" — request rate, error percentage, latency percentiles, resource utilisation. They are cheap to store, fast to query, and aggregate naturally across instances, which makes them the basis of dashboards, alerts, and trend analysis. They are bad at explaining an individual event, because a metric is already an aggregate: once you know p99 rose, the specific slow requests are not in the metric. Logs answer "what happened to this specific request, user, or job" — the detailed narrative of one thing, ideally as structured key-value fields. They are excellent once you know what you are looking for and have an identifier. They are bad at aggregation at scale, because counting or grouping means scanning every matching line, and bad at the first step of an investigation when you have a symptom but no starting identifier. Traces answer "where did the time go and where did it fail across the entire distributed call" — the critical path, a slow downstream dependency, a retry storm, an N-plus-one, represented as a tree of timed spans. They are bad at aggregate trends, which is metrics\' job, at carrying full payload detail, which is logs\' job, and because tracing every request is too expensive they are usually sampled, so any particular request may have no stored trace. A production system needs all three because each is genuinely bad at what the other two do well.',
        aHi: 'Metrics answer karte hain "kitna, kitne, kitna fast, abhi aur time ke over" — request rate, error percentage, latency percentiles. Wo store karne ke liye cheap hain, query karne ke liye fast, aur instances ke across naturally aggregate hote hain. Wo ek individual event explain karne mein bure hain, kyunki ek metric already ek aggregate hai. Logs answer karte hain "is specific request, user, ya job ko kya hua". Wo excellent hain jab aap jaante ho aap kya dhoondh rahe ho. Wo scale par aggregation mein bure hain. Traces answer karte hain "poore distributed call ke across time kahaan gaya aur kahaan fail hua" — critical path, ek slow downstream dependency. Wo aggregate trends mein bure hain, aur usually sampled hain. Ek production system ko teenon chahिए kyunki har ek genuinely bura hai us mein jo doosre do achhe hain.',
      },
      {
        q: 'What is the difference between monitoring and observability?',
        qHi: 'Monitoring aur observability mein kya difference hai?',
        a: 'Monitoring is watching a known, predefined set of failure modes — you build a dashboard and an alert for "the disk could fill up" or "the queue could back up" because you anticipated those failures. It answers questions you thought of in advance, catches the common cases quickly, and is essential, but it only covers the failures you predicted. Observability is the property of being able to ask new questions of the system — ones you did not anticipate — from the telemetry it already emits, without shipping new instrumentation. If a novel problem appears and you can investigate it by slicing your existing data along dimensions you did not pre-plan, such as "p99 latency for requests from this one customer, on API version 3, that hit a cold cache", the system is observable. This requires high-cardinality data — traces and richly structured logs or wide events that carry many dimensions per record — not just a small set of pre-aggregated metric labels. A system emitting only low-cardinality counters is monitorable but not observable, because the moment the useful dimension is one nobody added as a label, the data to answer the question does not exist and you have to write instrumentation, deploy, and wait for the problem to recur. The modern practice is to emit one wide structured event per unit of work carrying every dimension that might matter, and derive metrics and traces from those events, so you are never limited to what someone decided to count in advance.',
        aHi: 'Monitoring failure modes ke ek known, predefined set ko dekhna hai — aap ek dashboard aur ek alert "disk fill up ho sakta hai" ke liye banate ho kyunki aapne un failures ko anticipate kiya. Ye un questions ko answer karta hai jo aapne pehle se socha, common cases ko jaldi catch karta hai, aur essential hai, par ye sirf un failures ko cover karta hai jo aapne predict kiye. Observability system se naye questions poochne ki ability ki property hai — jo aapne anticipate nahi kiye — us telemetry se jo ye already emit karta hai, bina naya instrumentation ship kiye. Ye high-cardinality data chahिए — traces aur richly structured logs ya wide events. Ek system jo sirf low-cardinality counters emit karta hai monitorable hai par observable nahi.',
      },
      {
        q: 'Why can\'t you just add high-cardinality labels to metrics to make them more useful?',
        qHi: 'Aap metrics ko zyada useful banane ke liye bas high-cardinality labels kyun nahi add kar sakte?',
        a: 'The cost and stability of a metrics system scale with the number of distinct time series it holds, and a separate time series is created for every unique combination of label values. Adding a label whose set of possible values grows without bound — a user ID, a request ID, a session ID, an email, a full URL — multiplies the series count by that label\'s cardinality, and combined with the other labels a system that had thousands of series suddenly has tens of millions. The metrics database runs out of memory, scrapes time out, the query engine collapses, and the observability system itself becomes an outage that takes down every dashboard and alert. After the incident the labels are removed and you are back to a non-observable system. The correct design keeps metrics strictly low-cardinality — every label\'s value set small and bounded, ideally under about twenty, certainly under a hundred — and puts the high-cardinality dimensions where they are built to live: trace spans and wide structured events, stored in systems designed for high cardinality. Aggregate questions are answered by the bounded metric, ad-hoc questions about any dimension are answered by querying the events, and a single request walkthrough is the trace. The test for whether something can be a metric label: if its set of possible values can grow with the number of users, requests, or the passage of time, it is not a label.',
        aHi: 'Ek metrics system ki cost aur stability distinct time series ki number ke saath scale karti hai jo ye rakhta hai, aur ek separate time series har unique combination of label values ke liye banti hai. Ek label add karna jiske possible values ka set bina bound ke grow karta hai — ek user ID, ek request ID — us label ki cardinality se series count multiply karta hai, aur doosre labels ke saath combined ek system jiske hazaron series the achanak tens of millions rakhta hai. Metrics database memory se bahar ho jaata hai. Correct design metrics ko strictly low-cardinality rakhta hai, aur high-cardinality dimensions ko trace spans aur wide structured events mein daalta hai. Test: agar iske possible values ka set users, requests, ya time ke saath grow kar sakta hai, ye ek label nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define metrics, logs, and traces — the question each answers, what each is good at, what each is bad at — and describe the alert → dashboard → trace → logs workflow.',
        taskHi: 'Ek comment mein, metrics, logs, aur traces define karo.',
        hint: 'METRICS = numeric measurements over time, stored as time series (a request counter, error %, a latency histogram, CPU, queue depth). Question: "HOW MUCH / HOW MANY / HOW FAST, now and over the last hour/week?" GOOD AT: cheap to store (a few numbers per series per scrape) → long retention, fast to query, aggregate naturally across instances → the basis of DASHBOARDS + ALERTS + TRENDS. BAD AT: explaining an individual event — a metric IS already an aggregate, so the specific slow requests behind a p99 spike are gone. LOGS = timestamped records of discrete events, one entry per event, ideally STRUCTURED key-value not free text. Question: "WHAT HAPPENED to THIS request / user / order / job?" GOOD AT: the DETAIL of one specific thing once you have an identifier to search on. BAD AT: aggregation at scale (counting/grouping = scanning every matching line, slow + expensive at volume), and the FIRST step when you have a symptom but no starting id. TRACES = the causally-linked path of ONE request across every service/queue/DB it touched, as a tree of timed SPANS (each a timed operation with a parent). Question: "WHERE did the time go / WHERE did it fail, across the whole distributed call?" — the critical path, a slow dependency, a retry storm, an N+1. BAD AT: aggregate trends (metrics), full payload detail (logs), and traces are usually SAMPLED so any single request may have no stored trace. THE WORKFLOW: (1) an ALERT fires off a METRIC ("checkout error rate > 2% for 5m"); (2) a DASHBOARD (metrics) narrows it — one endpoint, one region, a start time, correlated with a DB latency spike; (3) a TRACE of one failing request localises it to a single span (e.g. 4.6s of 4.8s in one payment-gateway call that timed out); (4) the LOGS for that span (found via the trace_id) give the reason ("connection pool exhausted, max=20 active=20"). Each pillar advances the investigation exactly one step the others couldn\'t. THE GLUE: every log line + span carries the same trace_id; metrics carry EXEMPLARS (a sample trace_id on a histogram bucket) so you click a graph spike → jump to a slow trace.',
        hintHi: 'METRICS = time ke over numeric measurements, time series ke roop mein. Question: "KITNA / KITNE / KITNA FAST, abhi aur pichle ghante/hafte ke over?" GOOD AT: cheap to store, fast to query, aggregate → DASHBOARDS + ALERTS + TRENDS. BAD AT: ek individual event explain karna — ek metric already ek aggregate hai. LOGS = discrete events ke timestamped records, ideally STRUCTURED key-value. Question: "IS request / user / order ko KYA HUA?" GOOD AT: ek specific cheez ka DETAIL jab aapke paas ek identifier ho. BAD AT: scale par aggregation, aur pehla step bina ek starting id ke. TRACES = EK request ka path saare services ke across, timed SPANS ke tree ke roop mein. Question: "poore distributed call ke across time KAHAAN gaya / KAHAAN fail hua?" BAD AT: aggregate trends, full payload detail, aur usually SAMPLED. WORKFLOW: ALERT (metric) → DASHBOARD (metrics narrow) → TRACE (ek span mein localise) → LOGS (trace_id se reason). GLUE: har log line + span same trace_id carry karta hai; metrics EXEMPLARS carry karte hain.',
      },
      {
        task: 'In a comment, explain monitoring vs observability, why high-cardinality labels break a metrics system, and where high-cardinality dimensions should live.',
        taskHi: 'Ek comment mein, monitoring vs observability samjhao.',
        hint: 'MONITORING = watching a KNOWN, PREDEFINED set of failure modes — dashboards + alerts you built because you ANTICIPATED "the disk could fill / the queue could back up / cert expiry". Answers questions you thought of IN ADVANCE; catches common cases fast; essential — but ONLY covers the failures you predicted. OBSERVABILITY = the property of being able to ask NEW questions of the system — ones you did NOT anticipate — from the telemetry it ALREADY emits, WITHOUT shipping new instrumentation. Test: a novel problem appears; can you investigate it by slicing existing data along dimensions you did NOT pre-plan ("p99 latency for requests from customer 8813, on API v3, that hit a cold cache")? If yes → observable. Requires HIGH-CARDINALITY data (traces, richly structured logs / wide events with dozens of dimensions per record) — NOT just a small set of pre-aggregated metric labels. A system emitting only low-cardinality counters is MONITORABLE but NOT OBSERVABLE: the moment the useful dimension is one nobody added as a label, the data doesn\'t exist → you write instrumentation, deploy, wait for a recurrence (hours-to-days). WHY HIGH-CARDINALITY LABELS BREAK METRICS: a metrics system\'s cost + stability scale with the number of distinct TIME SERIES, and a separate series is created for EVERY unique combination of label values. A label whose values grow without bound (user_id ~300k, request_id ~millions, session_id, email, full URL) MULTIPLIES the series count by its cardinality → combined with other labels, thousands of series → tens of MILLIONS → the metrics DB OOMs, scrapes time out, the query engine collapses → the observability system itself is now the outage, taking down every dashboard + alert → after the incident the labels are deleted → back to non-observable. WHERE HIGH-CARDINALITY LIVES: trace SPANS and WIDE STRUCTURED EVENTS, stored in systems built for high cardinality (columnar event stores — Module 16). THE RULE: a metric label\'s value set must be small + BOUNDED (< ~100, ideally < ~20); if it can grow with users / requests / time, it is NOT a label. Aggregate questions → the bounded metric; ad-hoc "why is X slow" (any dimension) → query the events; one request end-to-end → the trace.',
        hintHi: 'MONITORING = failure modes ke ek KNOWN, PREDEFINED set ko dekhna — dashboards + alerts jo aapne banaye kyunki aapne ANTICIPATE kiya. PEHLE SE soche questions answer karta hai; essential — par SIRF predicted failures cover karta hai. OBSERVABILITY = system se NAYE questions poochne ki ability — jo aapne anticipate NAHI kiye — telemetry se jo ye ALREADY emit karta hai, bina naya instrumentation ship kiye. HIGH-CARDINALITY data chahिए (traces, wide events). Sirf low-cardinality counters = MONITORABLE par OBSERVABLE nahi. HIGH-CARDINALITY LABELS METRICS KO KYUN TODTE HAIN: cost distinct TIME SERIES ki number se scale hoti hai, har unique combination of label values ke liye ek series. Ek unbounded label (user_id, request_id) series count ko iski cardinality se MULTIPLY karta hai → tens of MILLIONS → metrics DB OOMs → observability system khud outage. HIGH-CARDINALITY KAHAAN: trace SPANS + WIDE EVENTS (Module 16). RULE: ek metric label ka value set chhota + BOUNDED (< ~100); agar ye users / requests / time ke saath grow kar sakta hai, ye ek label NAHI hai.',
      },
      {
        task: 'In a comment, explain the "wide structured event" approach: what a wide event contains, why deriving metrics/traces from events beats emitting them separately, and the cost.',
        taskHi: 'Ek comment mein, "wide structured event" approach samjhao.',
        hint: 'A WIDE STRUCTURED EVENT = ONE rich record per unit of work (an HTTP request, a job, a message consumed), carrying EVERY dimension that might matter: route, method, status, duration_ms, customer_id, plan_tier, region, api_version, build/SHA, cache (hit/miss), per-downstream durations (db_ms, upstream.pricing_ms, ...), db_queries count, queue_wait_ms, feature flags in effect, user-agent class, trace_id — dozens of fields. THE MODERN SYNTHESIS ("observability 2.0"): emit the wide events, then DERIVE metrics + traces FROM them rather than emitting all three separately. WHY IT BEATS SEPARATE EMISSION: (1) you are NEVER limited to the dimensions someone pre-decided to count — ANY question expressible as a filter + aggregation over the event fields can be answered AFTER THE FACT, no deploy ("customer 8813 + flag orders_v3_pagination + cache=miss → avg 47 db_queries vs 3 without the flag" = an N+1 in flag-gated code, found in 5 minutes). (2) the metric and the log and the span for one request are GUARANTEED consistent — same source record, same field values — no drift between "what the counter counted" and "what the log said". (3) one instrumentation call per unit of work instead of three. THE COST: storage + query infrastructure that handles HIGH-CARDINALITY event data — millions of distinct field-value combinations, wide rows, ad-hoc GROUP BY over any column. This is why the approach pairs with COLUMNAR EVENT STORES (ClickHouse-style, or a vendor: Honeycomb, etc.) rather than a traditional time-series metric DB, which is optimised for a bounded label set. You keep a small set of pre-aggregated metrics too (for cheap long-retention trends + the fastest alerts), derived from the same events. Covered further in Module 16.',
        hintHi: 'Ek WIDE STRUCTURED EVENT = per unit of work EK rich record (ek HTTP request, ek job), HAR dimension carry karta hua jo matter kar sakta hai: route, status, duration_ms, customer_id, plan_tier, region, api_version, build, cache, per-downstream durations, db_queries, queue_wait_ms, feature flags, trace_id — dozens fields. MODERN SYNTHESIS: wide events emit karo, phir metrics + traces UNSE DERIVE karo. KYUN BETTER: (1) aap KABHI un dimensions tak limited nahi jo kisi ne pehle se count karne ka decide kiya — KOI bhi question jo ek filter + aggregation ke roop mein express ho AFTER THE FACT answer ho sakta hai, no deploy; (2) ek request ka metric + log + span GUARANTEED consistent hain — same source record; (3) per unit of work ek instrumentation call, teen nahi. COST: storage + query infrastructure jo HIGH-CARDINALITY event data handle karta hai → COLUMNAR EVENT STORES (ClickHouse-style, ya Honeycomb) traditional time-series metric DB ke bajaay. Ek chhota set pre-aggregated metrics bhi rakho (cheap long-retention trends). Module 16 mein aur.',
      },
    ],

    keyTakeaways: [
      'METRICS = numbers over time, aggregated — "how much / how fast, now and over the last hour"; cheap, fast, the basis of DASHBOARDS + ALERTS + TRENDS; BAD at explaining one event (a metric is already an aggregate). LOGS = timestamped records of discrete events — "what happened to THIS request"; great for detail once you have an identifier; BAD at aggregation at scale and at the first step with no starting id. TRACES = one request\'s causally-linked path across all services as timed SPANS — "where did the time go / where did it fail"; BAD at trends, full detail, and usually SAMPLED.',
      'You need ALL THREE, wired together: an ALERT (metric) → a DASHBOARD (metrics, narrows scope) → a TRACE (localises to one span) → the LOGS for that span (via trace_id, the reason). Each pillar advances the investigation exactly one step the others couldn\'t. THE GLUE: every log + span carries the same trace_id; metrics carry EXEMPLARS (a sample trace_id on a histogram bucket).',
      'MONITORING = watching a KNOWN set of failure modes you predicted — answers questions thought of in advance. OBSERVABILITY = being able to ask NEW questions (dimensions you didn\'t pre-plan) from telemetry you already emit, WITHOUT shipping code. A low-cardinality-metrics-only system is monitorable but NOT observable.',
      'NEVER add a high-cardinality label (user_id, request_id, session_id, email, full URL) to a metric — a separate time series is created per unique label-value combination, so an unbounded label multiplies the series count into the millions and OOMs the metrics DB, taking down all dashboards + alerts. A metric label\'s value set must be small + BOUNDED (< ~100, ideally < ~20).',
      'Put high-cardinality dimensions where they belong: TRACE SPANS and WIDE STRUCTURED EVENTS (one rich record per unit of work, dozens of dimensions), stored in systems built for high cardinality. The modern synthesis: emit wide events, DERIVE metrics + traces from them — so any question expressible as a filter + group-by is answerable after the fact with no deploy. Cost: a columnar event store, not just a time-series DB (Module 16).',
    ],
    keyTakeawaysHi: [
      'METRICS = time ke over numbers, aggregated — "kitna / kitna fast, abhi aur pichle ghante"; cheap, fast, DASHBOARDS + ALERTS + TRENDS ka basis; ek event explain karne mein BURA. LOGS = discrete events ke timestamped records — "IS request ko kya hua"; detail ke liye great jab aapke paas ek identifier ho; scale par aggregation mein BURA. TRACES = ek request ka causally-linked path saare services ke across timed SPANS ke roop mein — "time KAHAAN gaya / KAHAAN fail hua"; trends mein BURA, usually SAMPLED.',
      'Aapko TEENON chahिए, ek saath wired: ek ALERT (metric) → ek DASHBOARD (metrics, scope narrow) → ek TRACE (ek span mein localise) → us span ke LOGS (trace_id se, reason). Har pillar investigation ko exactly ek step aage badhाता hai jo doosre nahi kar sakte. GLUE: har log + span same trace_id carry karta hai; metrics EXEMPLARS carry karte hain.',
      'MONITORING = failure modes ke ek KNOWN set ko dekhna jo aapne predict kiye — pehle se soche questions answer karta hai. OBSERVABILITY = NAYE questions poochne ki ability (dimensions jo aapne pehle se plan nahi kiye) telemetry se jo aap already emit karte ho, bina code ship kiye. Ek low-cardinality-metrics-only system monitorable hai par observable NAHI.',
      'KABHI ek high-cardinality label (user_id, request_id, session_id, email, full URL) ek metric mein add mat karo — har unique label-value combination ke liye ek separate time series banti hai, to ek unbounded label series count ko millions mein multiply karta hai aur metrics DB ko OOM karta hai. Ek metric label ka value set chhota + BOUNDED hona chahिए (< ~100).',
      'High-cardinality dimensions ko wahaan daalo jahaan wo belong karti hain: TRACE SPANS aur WIDE STRUCTURED EVENTS (per unit of work ek rich record, dozens dimensions), high cardinality ke liye built systems mein stored. Modern synthesis: wide events emit karo, unse metrics + traces DERIVE karo. Cost: ek columnar event store, sirf ek time-series DB nahi (Module 16).',
    ],
  },

  {
    slug: 'ops-structured-logging-and-log-aggregation',
    title: 'Structured Logging & Log Aggregation',
    titleHi: 'Structured Logging Aur Log Aggregation',
    description:
      'How to make logs useful instead of a wall of text: emit them as structured key-value records, attach the identifiers that let you follow one request across services, choose levels deliberately, keep secrets and personal data out, and sample the high-volume ones. Then the aggregation pipeline — agent, buffer, store, index — that turns millions of lines a second into something queryable, and the retention and cost decisions that come with it.',
    descriptionHi:
      'Logs ko text ki ek wall ke bajaay useful kaise banayein: unhe structured key-value records ke roop mein emit karo, wo identifiers attach karo jo aapko ek request ko services ke across follow karne dete hain, levels deliberately choose karo, secrets aur personal data bahar rakho, aur high-volume walon ko sample karo. Phir aggregation pipeline — agent, buffer, store, index — jo per second millions lines ko kuch queryable mein badalta hai, aur retention aur cost decisions jo iske saath aate hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A shipping company\'s tracking system versus a pile of handwritten notes.** The bad version: every depot scribbles free-form notes in its own notebook — "parcel arrived, looked fine, Dave". To answer "where is order 4471 now" you phone every depot and have someone read their notebook. The good version: every scan is a structured record — {tracking_id, depot, event: "arrived", timestamp, condition: "ok"} — all flowing to one central system. Now "where is 4471" is an instant query, "which depot has the most damaged parcels this week" is a group-by, and the record for one parcel carries the same tracking_id at every depot so you can replay its whole journey. The structure and the shared ID are what turn notes into tracking.',
      hi: '**Ek shipping company ka tracking system versus handwritten notes ka ek pile.** Bad version: har depot apni notebook mein free-form notes scribble karta hai — "parcel arrived, looked fine, Dave". "Order 4471 abhi kahaan hai" answer karne ke liye aap har depot ko phone karte ho. Good version: har scan ek structured record hai — {tracking_id, depot, event: "arrived", timestamp, condition: "ok"} — sab ek central system ko flow karta hua. Ab "4471 kahaan hai" ek instant query hai, "is hafte kaun se depot ke paas sabse zyada damaged parcels hain" ek group-by hai, aur ek parcel ka record har depot par same tracking_id carry karta hai. Structure aur shared ID wo hain jo notes ko tracking mein badalte hain.',
    },

    simple: `**STRUCTURED LOGS** — one JSON object per line (or logfmt), not free text:
\`\`\`
BAD:   "2026-09-09 10:03:12 ERROR payment failed for order 42 - card expired"
GOOD:  {"ts":"2026-09-09T10:03:12.441Z","level":"error","msg":"payment failed",
        "order_id":42,"reason":"card_expired","trace_id":"7f3a2b","service":"checkout",
        "region":"eu-west-1","build":"v487","user_plan":"pro","latency_ms":312}
\`\`\`
now  level=error AND reason=card_expired  is a filter, not a regex; order_id, trace_id,
region are real fields you group + join on.

**WHAT EVERY LOG LINE SHOULD CARRY:**
\`\`\`
ts (RFC3339, UTC, ms)   level   msg (a short stable string, NOT interpolated)
service + version/build   region/AZ   host/pod
trace_id + span_id        (from the incoming request context - THE join key)
request_id / correlation_id   user_id or account_id (if not PII-sensitive; else a hash)
+ the fields relevant to THIS event (order_id, reason, latency_ms, ...)
\`\`\`

**LEVELS** - use them deliberately, and set the prod threshold at INFO:
\`\`\`
ERROR   something failed that needs attention / broke a request. (alert-adjacent)
WARN    recoverable / degraded / retried / approaching a limit. (review, don't page)
INFO    a significant business/lifecycle event: request served, job done, config
        loaded, shutdown. the default prod level. ~1 line per unit of work, ideally.
DEBUG   developer detail: variable values, branch taken. OFF in prod (or sampled /
        dynamically enabled per-request). leaving DEBUG on in prod = 10-50x the bill.
\`\`\`

**NEVER LOG:** passwords, tokens, API keys, session cookies, full card numbers,
CVV, raw PII beyond what you need (redact/hash emails, names, addresses), the full
request/response body by default, Authorization headers. A log pipeline is a
data store with weaker access controls than your DB - treat it that way.

**SAMPLING** - at high volume you cannot keep every line:
\`\`\`
- keep 100% of ERROR/WARN. sample INFO (e.g. 1-in-10, or 1-in-N by route).
- "tail-based": keep ALL logs for a request that ERRORED or was SLOW, drop the
  rest - decided after the request finishes (needs the pipeline to buffer by trace_id).
- always keep a consistent sample: hash(trace_id) % N == 0  -> the whole request's
  logs are kept or dropped together, so a sampled trace has its logs.
\`\`\`

**THE AGGREGATION PIPELINE:**
\`\`\`
app writes JSON to stdout
  -> a node AGENT (Fluent Bit / Vector / promtail / the CloudWatch/Datadog agent)
     tails it, parses, enriches (k8s labels, host), batches
  -> a BUFFER / transport (Kafka, or the agent's own queue) - absorbs spikes,
     decouples producers from the store
  -> a STORE + INDEX: Loki (label index + compressed chunks, cheap) /
     Elasticsearch/OpenSearch (full inverted index, powerful + pricey) /
     CloudWatch Logs / a columnar store (ClickHouse)
  -> QUERY: LogQL / Lucene/DSL / SQL / Insights - filter by fields, aggregate,
     jump to a trace_id
RETENTION: hot 7-30d (fast query) -> archive to object storage 90-400d (cheap, slow)
COST driver: INGEST volume x retention x index type. logs are usually the #1 or #2
  observability cost - hence levels + sampling matter.
\`\`\``,

    simpleHi: `**STRUCTURED LOGS** — per line ek JSON object (ya logfmt), free text nahi:
\`\`\`
BAD:   "2026-09-09 10:03:12 ERROR payment failed for order 42 - card expired"
GOOD:  {"ts":"2026-09-09T10:03:12.441Z","level":"error","msg":"payment failed",
        "order_id":42,"reason":"card_expired","trace_id":"7f3a2b","service":"checkout",
        "region":"eu-west-1","build":"v487","user_plan":"pro","latency_ms":312}
\`\`\`
ab  level=error AND reason=card_expired  ek filter hai, ek regex nahi; order_id,
trace_id, region real fields hain jinpar aap group + join karte ho.

**HAR LOG LINE KYA CARRY KARNA CHAHIE:**
\`\`\`
ts (RFC3339, UTC, ms)   level   msg (ek short stable string, interpolated NAHI)
service + version/build   region/AZ   host/pod
trace_id + span_id        (incoming request context se - THE join key)
request_id / correlation_id   user_id ya account_id (agar PII-sensitive nahi; else ek hash)
+ IS event ke relevant fields (order_id, reason, latency_ms, ...)
\`\`\`

**LEVELS** - unhe deliberately use karo, aur prod threshold INFO par set karo:
\`\`\`
ERROR   kuch fail hua jise attention chahिए / ek request ttodi. (alert-adjacent)
WARN    recoverable / degraded / retried / ek limit ke paas. (review, page nahi)
INFO    ek significant business/lifecycle event: request served, job done, config
        loaded, shutdown. default prod level. ideally ~per unit of work 1 line.
DEBUG   developer detail: variable values, branch taken. prod mein OFF. prod mein
        DEBUG on chhodna = 10-50x bill.
\`\`\`

**KABHI LOG MAT KARO:** passwords, tokens, API keys, session cookies, full card
numbers, CVV, raw PII jitni zaroorat se zyada (emails, names, addresses redact/hash
karo), default ke roop mein full request/response body, Authorization headers. Ek
log pipeline ek data store hai aapke DB se weaker access controls ke saath.

**SAMPLING** - high volume par aap har line nahi rakh sakte:
\`\`\`
- ERROR/WARN ka 100% rakho. INFO sample karo (e.g. 1-in-10, ya route se 1-in-N).
- "tail-based": ek request ke SAARE logs rakho jo ERRORED ya SLOW tha, baaki drop
  karo - request khatam hone ke baad decided (pipeline ko trace_id se buffer karna chahिए).
- hamesha ek consistent sample rakho: hash(trace_id) % N == 0  -> poore request ke
  logs ek saath kept ya dropped hain, to ek sampled trace ke iske logs hain.
\`\`\`

**AGGREGATION PIPELINE:**
\`\`\`
app JSON ko stdout mein likhता hai
  -> ek node AGENT (Fluent Bit / Vector / promtail / CloudWatch/Datadog agent)
     ise tail karता hai, parse, enrich (k8s labels, host), batch
  -> ek BUFFER / transport (Kafka, ya agent ki apni queue) - spikes absorb karता hai
  -> ek STORE + INDEX: Loki (label index + compressed chunks, cheap) /
     Elasticsearch/OpenSearch (full inverted index, powerful + pricey) /
     CloudWatch Logs / ek columnar store (ClickHouse)
  -> QUERY: LogQL / Lucene/DSL / SQL / Insights - fields se filter, aggregate,
     ek trace_id par jump
RETENTION: hot 7-30d (fast query) -> object storage mein archive 90-400d (cheap, slow)
COST driver: INGEST volume x retention x index type. logs usually #1 ya #2
  observability cost hain - isliye levels + sampling matter karte hain.
\`\`\``,

    content: `## Structure, not prose

A log line written as a sentence — "payment failed for order 42 because the card expired" — forces every consumer of that log to parse English with regular expressions. A log line written as a structured record — a JSON object or logfmt key-value pairs — makes every piece of information a named field you can filter, group, and join on. \`level=error AND reason=card_expired\` becomes a query rather than a fragile pattern match, and \`order_id\`, \`trace_id\`, and \`region\` become real fields that connect this event to others.

The \`msg\` field should be a **short, stable string** that identifies the kind of event — "payment failed", not "payment failed for order 42" — with the variable parts as separate fields. This lets you group all instances of one kind of event together regardless of the specific values.

## What every log line should carry

A baseline set of fields on every line, added by the logging library and middleware rather than by hand:

- \`ts\` in RFC 3339 format, UTC, with millisecond precision; \`level\`; \`msg\`.
- \`service\` and its \`version\` or build SHA; the \`region\` or availability zone; the \`host\` or pod name.
- \`trace_id\` and \`span_id\`, extracted from the incoming request\'s trace context — this is the field that lets you pivot from a log to the full trace and back, and from any one service\'s logs to another\'s for the same request.
- \`request_id\` or \`correlation_id\`; a \`user_id\` or \`account_id\` if it is not sensitive, or a hash of it if it is.
- Then the fields specific to this event: \`order_id\`, \`reason\`, \`latency_ms\`, whatever the event is about.

## Levels, used deliberately

- **ERROR** — something failed that needs human attention or broke a request. These are close to alertable.
- **WARN** — something recoverable or degraded happened: a retry succeeded, a fallback was used, a limit is being approached. Worth reviewing, not worth paging.
- **INFO** — a significant business or lifecycle event: a request was served, a job completed, configuration loaded, the process is shutting down. This is the default production level, and a well-instrumented service emits roughly one INFO line per unit of work.
- **DEBUG** — developer detail: variable values, which branch was taken, intermediate state. This should be off in production, or sampled, or dynamically enabled for a specific request or time window. Leaving DEBUG logging on in production routinely multiplies log volume, and therefore the log bill, by ten to fifty times.

## Never log secrets or unnecessary personal data

A log pipeline is a data store, and it almost always has weaker access controls, longer retention, and wider read access than your primary database. Treat it accordingly. Never log passwords, authentication tokens, API keys, session cookies, full payment card numbers, CVV codes, or \`Authorization\` headers. Redact or hash personal data — emails, names, addresses, phone numbers — down to what an operator genuinely needs to do their job. Do not log full request and response bodies by default; log them only for specific debugging, time-boxed, with sensitive fields stripped. A secret that reaches the log pipeline must be treated as compromised and rotated, because you cannot reliably delete it from every index, buffer, and archive.

## Sampling

At high request volume, keeping every log line is neither affordable nor useful. The standard approach:

- Keep one hundred percent of ERROR and WARN lines — they are rare and valuable.
- Sample INFO — keep one in ten, or one in N varying by route so a low-traffic important endpoint keeps more than a chatty health check.
- **Tail-based sampling**: keep all of a request\'s logs if the request errored or was slow, and drop the rest, deciding after the request finishes. This requires the pipeline to buffer logs by trace ID until the request completes.
- Always sample **consistently by trace ID**: \`hash(trace_id) % N == 0\` decides for the whole request, so a request\'s logs are kept or dropped as a unit and a sampled trace always has its corresponding logs.

## The aggregation pipeline

The application writes structured JSON to standard output and does nothing else — it does not know or care where the logs go. From there:

1. A **node agent** — Fluent Bit, Vector, promtail, or the cloud provider\'s or vendor\'s agent — running on each host or as a DaemonSet, tails the container output, parses the JSON, enriches each line with metadata it knows (Kubernetes labels, the node name, the pod), and batches lines for efficient transport.
2. A **buffer or transport** — Kafka, or the agent\'s own on-disk queue — absorbs ingestion spikes and decouples the producers from the store, so a slow or briefly unavailable store does not block or drop application logs.
3. A **store and index**. Loki keeps a small label index and compressed log chunks, which is cheap and fast for label-scoped queries but limited for full-text search. Elasticsearch or OpenSearch builds a full inverted index, which is powerful and flexible but expensive in storage and compute. CloudWatch Logs and a columnar store like ClickHouse are other points on the trade-off.
4. A **query interface** — LogQL, Lucene or the Elasticsearch DSL, SQL, or CloudWatch Insights — to filter by field, aggregate, and jump from a log line to its trace.

**Retention** is tiered: a hot window of seven to thirty days in the fast queryable store, then archival to object storage for ninety to four hundred days, cheap but slow to query. **Cost** is driven by ingestion volume times retention times the index type, and logs are typically the first or second largest line in an observability budget, which is why choosing levels well and sampling aggressively at volume are not optional refinements but the main cost controls.`,

    contentHi: `## Structure, prose nahi

Ek log line jo ek sentence ke roop mein likhी gayi — "order 42 ke liye payment failed kyunki card expire ho gaya" — us log ke har consumer ko regular expressions ke saath English parse karne ke liye force karti hai. Ek log line jo ek structured record ke roop mein likhी gayi — ek JSON object ya logfmt key-value pairs — har piece of information ko ek named field banati hai jispar aap filter, group, aur join kar sakte ho.

\`msg\` field ek **short, stable string** hona chahिए jo event ke kind ko identify karti hai — "payment failed", "order 42 ke liye payment failed" nahi — variable parts ke saath separate fields ke roop mein.

## Har log line kya carry karna chahिए

Har line par fields ka ek baseline set, logging library aur middleware dwara add kiya gaya:
- \`ts\` RFC 3339 format mein, UTC, millisecond precision ke saath; \`level\`; \`msg\`.
- \`service\` aur iska \`version\` ya build SHA; \`region\` ya availability zone; \`host\` ya pod name.
- \`trace_id\` aur \`span_id\`, incoming request ke trace context se extracted — ye wo field hai jo aapko ek log se full trace tak pivot karne deta hai.
- \`request_id\` ya \`correlation_id\`; ek \`user_id\` ya \`account_id\` agar ye sensitive nahi hai.
- Phir is event ke specific fields.

## Levels, deliberately use kiye

- **ERROR** — kuch fail hua jise human attention chahिए ya ek request ttodi.
- **WARN** — kuch recoverable ya degraded hua.
- **INFO** — ek significant business ya lifecycle event. Ye default production level hai.
- **DEBUG** — developer detail. Ye production mein off hona chahिए. Production mein DEBUG logging on chhodna routinely log volume ko dus se pachas times multiply karta hai.

## Kabhi secrets ya unnecessary personal data log mat karo

Ek log pipeline ek data store hai, aur iske lagbhag hamesha aapke primary database se weaker access controls, longer retention, aur wider read access hain. Kabhi passwords, authentication tokens, API keys, session cookies, full payment card numbers, CVV codes, ya \`Authorization\` headers log mat karo. Personal data redact ya hash karo. Ek secret jo log pipeline tak pahunchta hai use compromised treat kiya jaana chahिए aur rotate kiya jaana chahिए.

## Sampling

High request volume par, har log line rakhna neither affordable na useful hai.
- ERROR aur WARN lines ka ek sau percent rakho.
- INFO sample karo — dus mein ek rakho.
- **Tail-based sampling**: ek request ke saare logs rakho agar request errored ya slow tha.
- Hamesha **trace ID se consistently** sample karo.

## Aggregation pipeline

Application structured JSON ko standard output mein likhती hai aur kuch nahi karती.
1. Ek **node agent** — Fluent Bit, Vector, promtail — container output ko tail karता hai, JSON parse karता hai, har line ko metadata se enrich karता hai, aur lines batch karता hai.
2. Ek **buffer ya transport** — Kafka, ya agent ki apni on-disk queue — ingestion spikes absorb karता hai.
3. Ek **store aur index**. Loki ek chhoti label index aur compressed log chunks rakhता hai. Elasticsearch ya OpenSearch ek full inverted index build karता hai.
4. Ek **query interface** — LogQL, Lucene, SQL.

**Retention** tiered hai: fast queryable store mein saat se tees din ki ek hot window, phir object storage mein archival. **Cost** ingestion volume times retention times index type se driven hai.`,

    examples: [
      {
        title: 'Free-text vs structured: the same failure, and the query you can run on each',
        titleHi: 'Free-text vs structured: wahi failure, aur wo query jo aap har par run kar sakte ho',
        code: `# --- FREE TEXT (what a bare console.log / print produces) ---
2026-09-09 10:03:12,441 ERROR [checkout] payment failed for order 42: card expired (took 312ms) req=a1b2
2026-09-09 10:03:13,102 ERROR [checkout] payment failed for order 87: insufficient funds (took 290ms) req=c3d4
2026-09-09 10:03:14,900 ERROR [checkout] payment gateway timeout for order 91 after 3001ms req=e5f6

# question: "how many card_expired vs insufficient_funds vs timeout errors in the
#            last hour, and what's the p95 latency of each?"
# answer with free text: write 3 brittle regexes, extract the reason + the ms,
#   handle "took 312ms" vs "after 3001ms" being different phrasings, bucket the
#   latencies yourself. ~30 min of grep + awk, breaks when someone reworents a message.

# --- STRUCTURED (same events) ---
{"ts":"2026-09-09T10:03:12.441Z","level":"error","service":"checkout","msg":"payment failed",
 "order_id":42,"reason":"card_expired","latency_ms":312,"trace_id":"a1b2","gateway":"stripe"}
{"ts":"2026-09-09T10:03:13.102Z","level":"error","service":"checkout","msg":"payment failed",
 "order_id":87,"reason":"insufficient_funds","latency_ms":290,"trace_id":"c3d4","gateway":"stripe"}
{"ts":"2026-09-09T10:03:14.900Z","level":"error","service":"checkout","msg":"payment gateway timeout",
 "order_id":91,"reason":"gateway_timeout","latency_ms":3001,"trace_id":"e5f6","gateway":"stripe"}

# same question, as a query (LogQL / SQL-ish):
  {service="checkout"} | json | msg=~"payment.*"
    | count by (reason), quantile_over_time(0.95, latency_ms) by (reason)
  -> card_expired: 812 events, p95 340ms
     insufficient_funds: 240 events, p95 300ms
     gateway_timeout: 47 events, p95 3200ms   <-- the timeout is the real problem
# 20 seconds. and "now show me the traces for the gateway_timeout ones" is:
  {service="checkout"} | json | reason="gateway_timeout" | line_format "{{.trace_id}}"`,
        output: `Free text: the information is all there, but every consumer re-parses English with
regexes, and a reworded log message silently breaks the parser. Structured: every
value is a typed field, so "count + p95 by reason" is one query, and pivoting to
the traces for the worst category is one more. The cost is writing
log.error("payment failed", {order_id, reason, latency_ms, ...}) instead of an
f-string - a one-time change that makes every future question cheap.`,
        explain: 'The same three payment failures are shown first as free-text log lines and then as structured records. In the free-text version every field is embedded in an English sentence, and the phrasing is inconsistent — one line says "took 312ms" and another says "after 3001ms" — so answering an aggregate question like "count and p95 latency per failure reason" requires writing several fragile regular expressions, normalising the different latency phrasings by hand, and bucketing the numbers yourself, which is half an hour of work that breaks the next time someone rewords a message. In the structured version each value is a named, typed field: \`reason\` and \`latency_ms\` and \`gateway\` are just fields. The same question becomes a single query that filters to payment messages, counts by reason, and computes the ninety-fifth percentile of latency by reason, returning in seconds that the gateway timeouts, though far fewer in number, have a p95 of over three seconds and are the real problem. Pivoting from that result to the actual traces for the timeout category is one more line, extracting the trace IDs. The cost of getting here is writing the log call as a message plus a map of fields rather than an interpolated string — a one-time habit change that makes every future ad-hoc question cheap to answer.',
        explainHi: 'Wahi teen payment failures pehle free-text log lines ke roop mein aur phir structured records ke roop mein dikhaye gaye hain. Free-text version mein har field ek English sentence mein embedded hai, aur phrasing inconsistent hai — ek line kehti hai "took 312ms" aur doosri kehti hai "after 3001ms" — to ek aggregate question jaise "per failure reason count aur p95 latency" answer karne ke liye kई fragile regular expressions likhna padta hai. Structured version mein har value ek named, typed field hai. Wahi question ek single query ban jaata hai jo payment messages ke liye filter karta hai, reason se count karta hai, aur reason se latency ka pichyaanvaan percentile compute karta hai, seconds mein return karta hua ki gateway timeouts, though number mein kaafi kam, ka p95 teen second se zyada hai aur wo real problem hain. Cost log call ko ek message plus fields ke ek map ke roop mein likhna hai.',
      },
      {
        title: 'A secret in a log, and the redaction that should have been there',
        titleHi: 'Ek log mein ek secret, aur wo redaction jo wahaan honi chahिए thi',
        code: `# --- THE BUG: logging the whole request for "debugging" ---
app.use((req, res, next) => {
  logger.info("incoming request", { method: req.method, path: req.path,
                                     headers: req.headers, body: req.body });   // <-- !!!
  next();
});
# produces, for a login:
{"level":"info","msg":"incoming request","method":"POST","path":"/login",
 "headers":{"authorization":"Bearer eyJhbGc...","cookie":"session=s%3Aabc...","user-agent":"..."},
 "body":{"email":"ada@example.com","password":"hunter2"}}
# now sitting in: the log agent's disk buffer, Kafka (7d), the hot index (14d),
#   the S3 archive (400d), and any dashboard/alert that matched. on EVERY login.
# -> every one of those passwords + tokens is compromised. rotation is a nightmare
#    because you can't reliably purge them all.

# --- THE FIX: an allowlist + redaction at the logging boundary ---
const REDACT = new Set(["authorization","cookie","set-cookie","x-api-key"]);
const SAFE_BODY_FIELDS = new Set(["email_domain","plan","locale"]);  // allowlist, not denylist

function safeHeaders(h) {
  return Object.fromEntries(Object.entries(h).map(([k,v]) =>
    [k, REDACT.has(k.toLowerCase()) ? "<redacted>" : v]));
}
function safeBody(b) {
  const out = {};
  if (b?.email) out.email_domain = String(b.email).split("@")[1] ?? "?";  // domain only
  for (const k of SAFE_BODY_FIELDS) if (k in (b||{})) out[k] = b[k];
  return out;                                    // password: never in the output at all
}
logger.info("incoming request", { method, path, headers: safeHeaders(req.headers),
                                   body: safeBody(req.body), trace_id });
# -> {"headers":{"authorization":"<redacted>","cookie":"<redacted>",...},
#     "body":{"email_domain":"example.com"}}
# also: a CI check that greps diffs for  headers: req.headers / body: req.body /
#   password / token  in a logger call; and a log-pipeline scanner (DLP) that
#   alarms on anything matching a secret pattern getting ingested.`,
        output: `Logging req.headers and req.body wholesale put a password and a bearer token into
five different stores with 7-to-400-day retention, on every single login - and you
cannot reliably delete them, so every credential that passed through is
compromised. The fix redacts known-sensitive headers and, for the body, uses an
ALLOWLIST (email domain only, plan, locale - never the password field) applied at
the logging boundary, plus a CI grep and a pipeline DLP scan as backstops.`,
        explain: 'A common "let\'s log the request so we can debug" middleware logs the method, path, all headers, and the entire body of every incoming request. For a login request this writes the user\'s password in plain text and their bearer token and session cookie into the log stream, and from there into the agent\'s disk buffer, the Kafka transport with a week of retention, the hot index with two weeks, the object-storage archive with over a year, and any dashboard or alert query that matched — on every single login. Those credentials are now compromised, and rotation is severe because you cannot reliably purge a value from every buffer, index, and archive copy. The fix applies redaction at the logging boundary. Sensitive headers are replaced with a placeholder by name. The body is handled with an allowlist rather than a denylist: instead of trying to remove the fields you know are sensitive, you extract only the specific fields that are safe and useful — the email domain rather than the full address, the plan, the locale — and the password field is simply never in the output because it is not on the allowlist. An allowlist is safer because a new sensitive field added to the request later is excluded by default rather than leaking until someone remembers to add it to the denylist. Backstops complete it: a CI check that flags a logger call containing \`req.headers\`, \`req.body\`, \`password\`, or \`token\`, and a data-loss-prevention scanner on the pipeline that alarms when anything matching a secret pattern is ingested.',
        explainHi: 'Ek common "chalo request log karte hain taaki hum debug kar sakein" middleware har incoming request ka method, path, saare headers, aur poora body log karta hai. Ek login request ke liye ye user ka password plain text mein aur unka bearer token aur session cookie log stream mein likhता hai, aur wahaan se agent ke disk buffer mein, ek hafte ke retention wale Kafka transport mein, do hafte wale hot index mein, ek saal se zyada wale object-storage archive mein — har single login par. Wo credentials ab compromised hain. Fix logging boundary par redaction apply karta hai. Sensitive headers name se ek placeholder se replace kiye jaate hain. Body ek denylist ke bajaay ek allowlist ke saath handle ki jaati hai: aap sirf wo specific fields extract karte ho jo safe aur useful hain — full address ke bajaay email domain — aur password field simply output mein kabhi nahi hai. Ek allowlist safer hai kyunki ek naya sensitive field default se excluded hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# interpolating variables into the msg string instead of using fields
logger.info(\`user \${userId} placed order \${orderId} for $\${amount} in \${ms}ms\`)
# -> msg = "user 8813 placed order 4471 for $59.90 in 240ms"
# every order is a UNIQUE msg string. you cannot:
#   - group "all order-placed events" (each msg differs)
#   - filter amount > 100 (it's text inside a sentence)
#   - compute p95 of ms (you'd regex it out first)
#   - the log index treats each unique msg as a distinct term -> index bloat`,
        right: `logger.info("order placed", {
  user_id: userId, order_id: orderId, amount_cents: amount * 100, latency_ms: ms,
  trace_id, service: "checkout",
})
# -> msg = "order placed" (STABLE - the same for every order)
#    the variable parts are typed FIELDS
# now:
#   {service="checkout"} | json | msg="order placed" | count by ()           # volume
#   ... | amount_cents > 10000 | count by ()                                  # big orders
#   ... | quantile_over_time(0.95, latency_ms)                                # p95
# the msg is the event TYPE; the fields are the event DATA. keep them separate.`,
        why: 'Putting the variable data into the message string collapses the distinction between the type of event and the data of a specific event. Every order-placed line then has a different \`msg\` — "user 8813 placed order 4471..." versus "user 2201 placed order 4472..." — so you cannot group all order-placed events together, because the grouping key differs on every line. The amount and the latency are buried inside an English sentence, so filtering on "amount over one hundred" or computing a latency percentile requires extracting them with a regex first. And the log index, which typically treats each distinct message string as a term, bloats because every order creates a new unique term. The fix is to make \`msg\` a stable string that names the event type — "order placed", identical for every order — and put every variable part as a typed field in the structured payload. The message becomes the event type and the fields become the event data, and they stay separate: you group by \`msg\`, filter and aggregate on the fields, and the index stays compact because there are a small fixed number of distinct message strings.',
        whyHi: 'Variable data ko message string mein daalna event ke type aur ek specific event ke data ke beech distinction collapse karta hai. Har order-placed line phir ek alag \`msg\` rakhती hai — "user 8813 placed order 4471..." versus "user 2201 placed order 4472..." — to aap saare order-placed events ko ek saath group nahi kar sakte, kyunki grouping key har line par differ karti hai. Amount aur latency ek English sentence ke andar buried hain. Aur log index, jo typically har distinct message string ko ek term ke roop mein treat karta hai, bloat hota hai. Fix \`msg\` ko ek stable string banana hai jo event type ko name karti hai — "order placed", har order ke liye identical — aur har variable part ko structured payload mein ek typed field ke roop mein daalna. Message event type ban jaata hai aur fields event data.',
      },
      {
        wrong: `# shipping to prod with the log level at DEBUG (or worse, TRACE)
# LOG_LEVEL=debug in the prod config, "so we can see what's happening"
# a service doing 2,000 req/s, each request logs ~30 DEBUG lines:
#   -> 60,000 log lines/second/instance x 20 instances = 1.2M lines/s
#   -> ~200 GB/day of logs. the ingest pipeline can't keep up, the agent's buffer
#      fills, it starts DROPPING lines - INCLUDING the ERROR lines you actually need
#   -> the log bill is 30x the INFO baseline. and DEBUG logs mostly say things
#      like "entering function X" that nobody reads.`,
        right: `# prod runs at INFO. make DEBUG reachable WITHOUT a redeploy when you need it:
#   - a dynamic log level: an admin endpoint / a config flag / an env var read on
#     SIGHUP that flips a service (or one pod) to DEBUG for 15 minutes, then reverts
#   - per-request debug: if the request carries  X-Debug: 1  (from an allowlisted
#     internal caller) OR is in a 0.1% sample, log its DEBUG lines; otherwise don't
#   - "debug for trace_id=X": enable verbose logging only for requests matching a
#     trace you're chasing
# INFO stays ~1 line per unit of work. ERROR/WARN always on. the bill is predictable
# and the ERROR lines never get starved out by DEBUG noise.`,
        why: 'Running production at DEBUG level multiplies log volume by a large factor, because DEBUG lines are emitted many times per request to record internal steps that are only interesting when actively debugging. At even moderate request rates this produces log volume that the ingestion pipeline cannot keep up with, and when the agent\'s buffer fills, it drops lines — and it does not preferentially drop the DEBUG noise, so the ERROR lines that matter get lost along with everything else, exactly when you need them. The log bill also rises to many times the INFO baseline for data that mostly consists of "entered function X" messages nobody reads. The correct arrangement is production at INFO, with roughly one meaningful line per unit of work, and DEBUG made reachable on demand without a redeploy: a dynamic log level that an operator can flip for a service or a single pod for a short window, a per-request debug flag honoured for allowlisted internal callers or a tiny sample, and the ability to enable verbose logging only for requests matching a specific trace being investigated. This keeps the volume and cost predictable, keeps ERROR and WARN always flowing, and still gives you deep detail when a specific investigation needs it.',
        whyHi: 'Production ko DEBUG level par chalana log volume ko ek large factor se multiply karta hai, kyunki DEBUG lines per request kई baar emit hoti hain internal steps record karne ke liye jo sirf tab interesting hain jab actively debugging. Even moderate request rates par ye log volume produce karta hai jise ingestion pipeline keep up nahi kar sakti, aur jab agent ka buffer fills, ye lines drop karta hai — aur ye preferentially DEBUG noise drop nahi karta, to jo ERROR lines matter karti hain wo bhi lost ho jaati hain. Correct arrangement production INFO par hai, aur DEBUG bina ek redeploy ke on demand reachable banaya gaya: ek dynamic log level jo ek operator ek service ya ek single pod ke liye ek short window ke liye flip kar sakta hai, ek per-request debug flag, aur ek specific trace ke liye verbose logging enable karne ki ability.',
      },
      {
        wrong: `# no correlation ID / trace ID -> logs from different services can't be joined
# the checkout service logs:   {"msg":"charging card","order_id":42}
# the payment service logs:    {"msg":"gateway call failed","gateway":"stripe","code":500}
# the fraud service logs:      {"msg":"score computed","score":0.91}
# a customer reports order 42 failed. you have order_id in checkout's logs, but
# payment and fraud don't log order_id (they got a payment_intent_id and a
# session_id). you cannot connect the three. you're guessing based on timestamps.`,
        right: `# generate a trace_id at the edge; propagate it on EVERY hop; log it EVERYWHERE:
#   - the API gateway / first service creates  trace_id  (or continues an incoming
#     W3C traceparent header - Lesson 5)
#   - it's put in the logging context (MDC / contextvars / AsyncLocalStorage) so
#     EVERY log line in that request automatically includes it
#   - it's propagated on outbound calls: HTTP header  traceparent , a message
#     attribute on queue publishes, a field on events
#   - downstream services read it from the header and do the same
# now:  {trace_id="7f3a2b"}  across ALL services returns the complete story of
#   order 42's request, in time order, regardless of which id each service uses
#   internally. this is THE most valuable field in your logs.`,
        why: 'In a system of more than one service, an investigation almost always needs to follow one request across several services, but each service tends to know the request by a different internal identifier — the checkout service has an order ID, the payment service has a payment-intent ID, the fraud service has a session ID — so there is no shared key to join their logs on. Without one, correlating what happened is reduced to lining up timestamps and guessing, which is unreliable under load when many requests overlap. The solution is a single correlation identifier, the trace ID, generated once at the edge of the system (or continued from an incoming trace-context header), placed into the logging context so that every log line emitted anywhere in that request automatically carries it, and propagated on every outbound call — as an HTTP header, a message attribute on queue publishes, a field on emitted events — so downstream services receive it and do the same. With this in place, filtering all logs across all services by one trace ID returns the complete, time-ordered story of a single request regardless of what each service calls it internally. It is the single most valuable field to have on every log line, because it is what makes a pile of per-service logs into a coherent narrative.',
        whyHi: 'Ek se zyada service ke system mein, ek investigation lagbhag hamesha ek request ko kई services ke across follow karne ki zaroorat hoti hai, par har service request ko ek alag internal identifier se jaanti hai — checkout service ke paas ek order ID hai, payment service ke paas ek payment-intent ID hai — to unke logs join karne ke liye koi shared key nahi hai. Iske bina, kya hua correlate karna timestamps line up karne aur guessing tak reduce ho jaata hai. Solution ek single correlation identifier hai, trace ID, system ke edge par ek baar generated, logging context mein placed taaki us request mein kahin bhi emitted har log line automatically ise carry kare, aur har outbound call par propagated. Iske saath, saare services ke across saare logs ko ek trace ID se filter karna ek single request ki complete, time-ordered story return karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Passwords in the login log, 400-day archive** — a request-logging middleware wrote `req.body` for every request. A security audit found ~9 months of plaintext passwords across the hot index and the S3 archive. Every affected account was force-reset; the middleware was changed to an allowlist; a pipeline DLP scan was added.',
        hi: '**Login log mein passwords, 400-day archive** — ek request-logging middleware ne har request ke liye `req.body` likha. Ek security audit ne hot index aur S3 archive ke across ~9 mahine ke plaintext passwords paye. Har affected account force-reset kiya gaya.',
      },
      {
        en: '**DEBUG in prod, ERROR lines dropped** — a service shipped with `LOG_LEVEL=debug`. During an incident the on-call could not find the actual errors because the agent buffer had been full for hours and was dropping lines indiscriminately. Setting prod to INFO and adding a 15-minute dynamic-debug endpoint fixed both the cost and the drops.',
        hi: '**Prod mein DEBUG, ERROR lines dropped** — ek service `LOG_LEVEL=debug` ke saath ship hui. Ek incident ke dauraan on-call actual errors nahi dhoondh saka kyunki agent buffer ghanton se full tha aur lines indiscriminately drop kar raha tha. Prod ko INFO par set karna aur ek 15-minute dynamic-debug endpoint add karna dono fix kiya.',
      },
      {
        en: '**No trace_id, an hour of timestamp guessing** — a 3-service checkout failure took an hour to diagnose because the services logged different IDs and the on-call was correlating by wall-clock time across overlapping requests. Adding a propagated `trace_id` to every log line turned the next such incident into a 2-minute single filter.',
        hi: '**Koi trace_id nahi, ek ghanta timestamp guessing** — ek 3-service checkout failure ko diagnose karne mein ek ghanta laga kyunki services alag IDs log karti thi. Har log line mein ek propagated `trace_id` add karna agle aise incident ko ek 2-minute single filter mein badal diya.',
      },
    ],

    interviewQA: [
      {
        q: 'What makes a log "structured", and what should every log line carry?',
        qHi: 'Ek log ko "structured" kya banata hai, aur har log line kya carry karna chahिए?',
        a: 'A structured log is emitted as a machine-parseable record of named fields — a JSON object or logfmt key-value pairs — rather than an English sentence. This turns every piece of information into a field you can filter, group, and join on, so "level equals error and reason equals card expired" is a query rather than a fragile regular expression, and fields like order ID and trace ID connect the event to others. The message field itself should be a short, stable string naming the kind of event — "payment failed", not "payment failed for order 42" — with the variable parts as separate fields, so all instances of one event type group together. Every line should carry a baseline set added by the logging library and middleware rather than by hand: an RFC 3339 UTC timestamp with millisecond precision, the level, the message; the service name and its version or build SHA, the region or availability zone, the host or pod; the trace ID and span ID extracted from the incoming request context, which is the field that lets you pivot from a log to the full trace and correlate one service\'s logs with another\'s for the same request; a request or correlation ID and a user or account identifier if it is not sensitive; and then the fields specific to that event. The trace ID is the single most valuable field, because it is what makes a pile of per-service logs into one coherent request narrative.',
        aHi: 'Ek structured log ek machine-parseable record of named fields ke roop mein emit hota hai — ek JSON object ya logfmt key-value pairs — ek English sentence ke bajaay. Ye har piece of information ko ek field banata hai jispar aap filter, group, aur join kar sakte ho. Message field khud ek short, stable string hona chahिए jo event ke kind ko name karti hai — "payment failed", "order 42 ke liye payment failed" nahi — variable parts ke saath separate fields ke roop mein. Har line par ek baseline set: ek RFC 3339 UTC timestamp, level, message; service name aur iska version, region, host ya pod; trace ID aur span ID incoming request context se extracted; ek request ya correlation ID; aur phir us event ke specific fields. Trace ID sabse valuable field hai.',
      },
      {
        q: 'How do you decide what NOT to log, and what happens if a secret reaches the log pipeline?',
        qHi: 'Aap kya NAHI log karna decide kaise karte ho, aur agar ek secret log pipeline tak pahunchta hai to kya hota hai?',
        a: 'A log pipeline is a data store, and it almost always has weaker access controls, longer retention, and wider read access than your primary database — many people can read logs who cannot query production data. So you treat it as a place secrets must never reach. Never log passwords, authentication tokens, API keys, session cookies, full payment card numbers, CVV codes, or Authorization headers. Redact or hash personal data — emails, names, addresses, phone numbers — down to what an operator genuinely needs; for an email that often means logging only the domain. Do not log full request or response bodies by default; log them only for a specific, time-boxed investigation with sensitive fields stripped. The safest technique is an allowlist rather than a denylist: for a request body, extract only the specific fields that are safe and useful rather than trying to remove the ones you know are sensitive, so a new sensitive field added later is excluded by default. If a secret does reach the pipeline, it must be treated as compromised and rotated, because you cannot reliably delete a value from every agent buffer, transport queue, hot index, and long-term archive — it has been copied to many places with different retention. Backstops help: a CI check that flags logger calls containing headers, body, password, or token, and a data-loss-prevention scanner on the ingestion path that alarms on secret-shaped strings.',
        aHi: 'Ek log pipeline ek data store hai, aur iske lagbhag hamesha aapke primary database se weaker access controls, longer retention, aur wider read access hain. To aap ise ek jagah treat karte ho jahaan secrets kabhi nahi pahunchne chahिए. Kabhi passwords, authentication tokens, API keys, session cookies, full payment card numbers, CVV codes, ya Authorization headers log mat karo. Personal data redact ya hash karo. Safest technique ek denylist ke bajaay ek allowlist hai: ek request body ke liye, sirf wo specific fields extract karo jo safe aur useful hain. Agar ek secret pipeline tak pahunchta hai, use compromised treat kiya jaana chahिए aur rotate kiya jaana chahिए, kyunki aap ek value ko har agent buffer, transport queue, hot index, aur long-term archive se reliably delete nahi kar sakte.',
      },
      {
        q: 'Why is running production at DEBUG level a problem, and how do you get debug detail when you need it?',
        qHi: 'Production ko DEBUG level par chalana ek problem kyun hai, aur aap debug detail kaise paate ho jab aapko chahिए?',
        a: 'DEBUG lines are emitted many times per request to record internal steps, so running production at DEBUG multiplies log volume by a large factor — often ten to fifty times the INFO baseline. At even moderate request rates this exceeds what the ingestion pipeline can absorb, and when the node agent\'s buffer fills it starts dropping lines. Crucially it does not preferentially drop the DEBUG noise — it drops indiscriminately, so the ERROR lines you actually need during an incident get lost along with everything else, at exactly the wrong moment. The bill also rises sharply for data that is mostly "entered function X" messages nobody reads. Production should run at INFO, emitting roughly one meaningful line per unit of work, with ERROR and WARN always on. Debug detail is then made reachable on demand without a redeploy: a dynamic log level that an operator can flip for a whole service or a single pod for a short window and that auto-reverts; a per-request debug flag honoured when the request comes from an allowlisted internal caller or falls in a tiny sample; and the ability to enable verbose logging only for requests matching a specific trace ID being chased. This keeps volume and cost predictable and the error stream unstarved, while still giving deep detail for a targeted investigation.',
        aHi: 'DEBUG lines per request kई baar emit hoti hain internal steps record karne ke liye, to production ko DEBUG par chalana log volume ko ek large factor se multiply karta hai — aksar INFO baseline ka dus se pachas times. Even moderate request rates par ye ingestion pipeline jo absorb kar sakti hai usse zyada hai, aur jab node agent ka buffer fills ye lines drop karna shuru karta hai. Crucially ye preferentially DEBUG noise drop nahi karta — ye indiscriminately drop karta hai, to jo ERROR lines aapko ek incident ke dauraan actually chahिए wo bhi lost ho jaati hain. Production INFO par chalna chahिए. Debug detail phir bina ek redeploy ke on demand reachable banaya jaata hai: ek dynamic log level, ek per-request debug flag, aur ek specific trace ID ke liye verbose logging enable karne ki ability.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast free-text and structured logs, list the baseline fields every line should carry, and explain why msg must be a stable string.',
        taskHi: 'Ek comment mein, free-text aur structured logs ka contrast karo.',
        hint: 'FREE-TEXT log = an English sentence ("payment failed for order 42: card expired (took 312ms)") → every consumer re-parses English with brittle regexes, inconsistent phrasing ("took 312ms" vs "after 3001ms"), a reworded message silently breaks the parser, the index treats each unique message as a distinct term → bloat. STRUCTURED log = one JSON object (or logfmt) per line: `{"ts":..,"level":"error","msg":"payment failed","order_id":42,"reason":"card_expired","latency_ms":312,"trace_id":"7f3a"}` → every value is a typed FIELD you filter / group / join on; "count + p95 by reason" is one query, not 30 min of grep+awk. BASELINE FIELDS every line carries (added by the logging library + middleware, NOT by hand): `ts` (RFC 3339, UTC, ms precision), `level`, `msg`; `service` + `version`/build SHA; `region`/AZ; `host`/pod; `trace_id` + `span_id` (from the incoming request context — THE join key, lets you pivot log ↔ trace and correlate service A\'s logs with service B\'s for one request); `request_id`/`correlation_id`; `user_id`/`account_id` (if not PII-sensitive, else a hash); + the fields specific to THIS event (`order_id`, `reason`, `latency_ms`, ...). WHY `msg` MUST BE STABLE: `msg` is the event TYPE, the fields are the event DATA — keep them separate. Interpolating (`` `user ${id} placed order ${oid} for $${amt}` ``) makes every line a UNIQUE msg → you can\'t group "all order-placed events", can\'t filter `amount > 100` (it\'s text in a sentence), can\'t compute p95 of latency (regex it out first), and the index bloats (every order = a new term). Fix: `msg = "order placed"` (identical every time), `{user_id, order_id, amount_cents, latency_ms, trace_id}` as fields.',
        hintHi: 'FREE-TEXT log = ek English sentence → har consumer brittle regexes se English re-parse karta hai, inconsistent phrasing, reworded message parser todta hai, index bloat. STRUCTURED log = per line ek JSON object: har value ek typed FIELD hai jispar aap filter / group / join karte ho; "count + p95 by reason" ek query hai. BASELINE FIELDS (logging library + middleware dwara add): `ts` (RFC 3339, UTC, ms), `level`, `msg`; `service` + `version`; `region`/AZ; `host`/pod; `trace_id` + `span_id` (THE join key); `request_id`/`correlation_id`; `user_id`/`account_id` (ya ek hash); + IS event ke specific fields. `msg` KYUN STABLE: `msg` event TYPE hai, fields event DATA — separate rakho. Interpolating har line ko UNIQUE msg banata hai → group nahi kar sakte, filter nahi kar sakte, p95 nahi. Fix: `msg = "order placed"`, `{user_id, order_id, amount_cents, latency_ms}` fields ke roop mein.',
      },
      {
        task: 'In a comment, list what must never be logged, explain the allowlist-vs-denylist choice for bodies, and what to do if a secret reaches the pipeline.',
        taskHi: 'Ek comment mein, kya kabhi log nahi karna chahिए list karo.',
        hint: 'A LOG PIPELINE IS A DATA STORE with WEAKER access controls + LONGER retention + WIDER read access than your primary DB (many people can read logs who can\'t query prod data) — treat it as somewhere secrets must NEVER reach. NEVER LOG: passwords, auth tokens, API keys, session cookies, full payment-card numbers (PAN), CVV, `Authorization` / `Cookie` / `Set-Cookie` headers, and — by default — full request/response bodies. REDACT or HASH personal data (emails → domain only, names, addresses, phone numbers) down to what an operator genuinely needs. ALLOWLIST vs DENYLIST for a body: use an ALLOWLIST — extract ONLY the specific fields that are safe + useful (`email_domain`, `plan`, `locale`) rather than trying to strip the fields you know are sensitive. Why: a NEW sensitive field added to the request later is excluded BY DEFAULT with an allowlist, whereas a denylist leaks it until someone remembers to add it. The `password` field is simply never in the output because it\'s not on the allowlist. IF A SECRET REACHES THE PIPELINE: treat it as COMPROMISED and ROTATE it — you CANNOT reliably delete a value from every agent disk buffer + transport queue (Kafka) + hot index + long-term S3 archive; it\'s been copied to many places with different retention (7d → 400d). BACKSTOPS: (1) a CI check that greps diffs for `req.headers` / `req.body` / `password` / `token` inside a logger call; (2) a pipeline DLP scanner that alarms when anything matching a secret pattern (a JWT, an `AKIA...` key, a PAN) is ingested. Also: log full bodies ONLY for a specific, time-boxed investigation with sensitive fields stripped.',
        hintHi: 'EK LOG PIPELINE EK DATA STORE HAI aapke primary DB se WEAKER access controls + LONGER retention + WIDER read access ke saath — ise ek jagah treat karo jahaan secrets KABHI nahi pahunchne chahिए. KABHI LOG MAT KARO: passwords, auth tokens, API keys, session cookies, full card numbers, CVV, `Authorization`/`Cookie` headers, aur default ke roop mein full bodies. Personal data REDACT/HASH karo (emails → sirf domain). ALLOWLIST vs DENYLIST: ALLOWLIST use karo — SIRF wo specific fields extract karo jo safe + useful hain. Kyun: ek NAYA sensitive field DEFAULT se excluded hai allowlist ke saath. AGAR EK SECRET PIPELINE TAK PAHUNCHTA HAI: COMPROMISED treat karo aur ROTATE karo — aap ise har buffer + queue + index + archive se reliably delete NAHI kar sakte. BACKSTOPS: (1) ek CI grep check; (2) ek pipeline DLP scanner.',
      },
      {
        task: 'In a comment, explain log levels and the prod threshold, why DEBUG-in-prod is dangerous, how to get debug detail on demand, and how sampling works at high volume.',
        taskHi: 'Ek comment mein, log levels aur prod threshold samjhao.',
        hint: 'LEVELS (set the prod threshold at INFO): ERROR = something failed needing attention / broke a request (alert-adjacent). WARN = recoverable / degraded / retried / approaching a limit (review, don\'t page). INFO = a significant business/lifecycle event (request served, job done, config loaded, shutdown) — the DEFAULT prod level, ideally ~1 line per unit of work. DEBUG = developer detail (variable values, branch taken) — OFF in prod. WHY DEBUG-IN-PROD IS DANGEROUS: DEBUG lines are emitted MANY times per request → 10-50× the INFO volume. At even moderate req rates this exceeds what the ingest pipeline can absorb → the node agent\'s buffer fills → it starts DROPPING lines INDISCRIMINATELY (it does NOT preferentially drop DEBUG) → the ERROR lines you need DURING AN INCIDENT get lost too, at exactly the wrong moment. Plus the bill is 10-50× for data that\'s mostly "entered function X" that nobody reads. GET DEBUG ON DEMAND (no redeploy): (1) a DYNAMIC log level — an admin endpoint / config flag / SIGHUP-read env var that flips a service (or ONE pod) to DEBUG for 15 min then auto-reverts; (2) PER-REQUEST debug — honour `X-Debug: 1` from an allowlisted internal caller, OR a 0.1% sample; (3) "debug for trace_id=X" — verbose logging only for requests matching a trace you\'re chasing. SAMPLING at high volume (you can\'t keep every line): keep 100% of ERROR/WARN (rare + valuable); SAMPLE INFO (1-in-10, or 1-in-N by route so a low-traffic important endpoint keeps more than a chatty health check); TAIL-BASED — keep ALL of a request\'s logs if it ERRORED or was SLOW, drop the rest, decided AFTER the request finishes (needs the pipeline to buffer by trace_id); ALWAYS sample CONSISTENTLY by trace_id — `hash(trace_id) % N == 0` decides for the WHOLE request → a request\'s logs are kept/dropped as a unit → a sampled trace always has its logs.',
        hintHi: 'LEVELS (prod threshold INFO par): ERROR = kuch fail hua jise attention chahिए. WARN = recoverable / degraded (review, page nahi). INFO = ek significant business/lifecycle event — DEFAULT prod level, ideally ~per unit of work 1 line. DEBUG = developer detail — prod mein OFF. DEBUG-IN-PROD KYUN DANGEROUS: DEBUG lines per request KAI baar → 10-50× INFO volume → agent buffer fills → lines INDISCRIMINATELY DROP (DEBUG preferentially nahi) → ERROR lines bhi lost. GET DEBUG ON DEMAND (no redeploy): (1) DYNAMIC log level (15 min phir auto-revert); (2) PER-REQUEST (`X-Debug: 1` allowlisted caller, ya 0.1% sample); (3) "debug for trace_id=X". SAMPLING: ERROR/WARN ka 100%; INFO SAMPLE (1-in-10, ya route se 1-in-N); TAIL-BASED (ERRORED/SLOW request ke SAARE logs rakho); HAMESHA trace_id se CONSISTENTLY — `hash(trace_id) % N == 0` poore request ke liye decide karta hai.',
      },
    ],

    keyTakeaways: [
      'STRUCTURED LOGS = one JSON/logfmt record per line, not an English sentence — every value is a typed FIELD you filter/group/join on. `msg` is the event TYPE (a short STABLE string — "order placed", identical every time); the variable parts are FIELDS. Interpolating variables into `msg` makes every line unique → you can\'t group, filter, or aggregate, and the index bloats.',
      'EVERY LINE CARRIES: `ts` (RFC 3339 UTC ms), `level`, `msg`; `service` + build; `region`/AZ; `host`/pod; `trace_id` + `span_id` (from the request context — THE join key, the single most valuable field); `request_id`; `user_id`/`account_id` (or a hash); + this event\'s fields. Without a propagated trace_id, logs from different services can\'t be joined and you\'re guessing by timestamp.',
      'A LOG PIPELINE IS A DATA STORE with weaker access + longer retention + wider read than your DB. NEVER log passwords, tokens, API keys, cookies, PANs, CVV, `Authorization` headers, or full bodies by default. Use an ALLOWLIST for bodies (extract only safe fields → a new sensitive field is excluded by default). A secret that reaches the pipeline is COMPROMISED — rotate it; you can\'t reliably purge every buffer/index/archive.',
      'PROD RUNS AT INFO (~1 line per unit of work; ERROR/WARN always on). DEBUG-in-prod = 10-50× volume → the agent buffer fills → lines drop INDISCRIMINATELY → your ERROR lines are lost mid-incident. Get DEBUG on demand without a redeploy: a dynamic per-service/per-pod level that auto-reverts, a per-request debug flag for allowlisted callers or a tiny sample, or verbose logging for one trace_id.',
      'SAMPLE at high volume: keep 100% of ERROR/WARN, sample INFO (1-in-N by route), use TAIL-BASED (keep all logs for a request that errored or was slow), and ALWAYS sample CONSISTENTLY by trace_id so a request\'s logs are kept/dropped as a unit. THE PIPELINE: app → stdout JSON → node AGENT (Fluent Bit/Vector) parses+enriches+batches → a BUFFER (Kafka) absorbs spikes → a STORE+INDEX (Loki cheap / Elasticsearch powerful+pricey / ClickHouse) → QUERY. Retention: hot 7-30d → archive 90-400d. Cost = ingest × retention × index type — usually the #1-2 observability cost.',
    ],
    keyTakeawaysHi: [
      'STRUCTURED LOGS = per line ek JSON/logfmt record, ek English sentence nahi — har value ek typed FIELD hai jispar aap filter/group/join karte ho. `msg` event TYPE hai (ek short STABLE string — "order placed"); variable parts FIELDS hain. Variables ko `msg` mein interpolate karna har line ko unique banata hai → aap group, filter, ya aggregate nahi kar sakte.',
      'HAR LINE CARRY KARTI HAI: `ts` (RFC 3339 UTC ms), `level`, `msg`; `service` + build; `region`/AZ; `host`/pod; `trace_id` + `span_id` (request context se — THE join key, sabse valuable field); `request_id`; `user_id`/`account_id` (ya ek hash); + is event ke fields. Ek propagated trace_id ke bina, alag services ke logs join nahi ho sakte.',
      'EK LOG PIPELINE EK DATA STORE HAI weaker access + longer retention + wider read ke saath. KABHI passwords, tokens, API keys, cookies, card numbers, CVV, `Authorization` headers, ya default ke roop mein full bodies log mat karo. Bodies ke liye ek ALLOWLIST use karo. Ek secret jo pipeline tak pahunchta hai COMPROMISED hai — rotate karo.',
      'PROD INFO PAR CHALTA HAI (~per unit of work 1 line; ERROR/WARN hamesha on). DEBUG-in-prod = 10-50× volume → agent buffer fills → lines INDISCRIMINATELY drop → aapki ERROR lines mid-incident lost. Bina ek redeploy ke DEBUG on demand paao: ek dynamic per-service/per-pod level jo auto-revert hota hai, ek per-request debug flag, ya ek trace_id ke liye verbose logging.',
      'High volume par SAMPLE karo: ERROR/WARN ka 100% rakho, INFO sample karo (route se 1-in-N), TAIL-BASED use karo, aur HAMESHA trace_id se CONSISTENTLY sample karo. PIPELINE: app → stdout JSON → node AGENT (Fluent Bit/Vector) parse+enrich+batch → ek BUFFER (Kafka) → ek STORE+INDEX (Loki cheap / Elasticsearch powerful+pricey / ClickHouse) → QUERY. Retention: hot 7-30d → archive 90-400d. Cost = ingest × retention × index type — usually #1-2 observability cost.',
    ],
  },

  {
    slug: 'ops-metrics-the-four-types-and-cardinality',
    title: 'Metrics: The Four Types & Cardinality',
    titleHi: 'Metrics: Chaar Types Aur Cardinality',
    description:
      'The four metric types — counter, gauge, histogram, summary — and what each is for; how a metric is a name plus a set of labels plus a value over time; pull versus push collection and exporters; the rate-and-aggregate query pattern; recording rules; and the single failure that takes down more metrics systems than anything else — cardinality explosion, where a label with too many possible values multiplies the number of time series past what the database can hold.',
    descriptionHi:
      'Chaar metric types — counter, gauge, histogram, summary — aur har ek kis liye hai; ek metric ek name plus labels ka ek set plus time ke over ek value kaise hai; pull versus push collection aur exporters; rate-and-aggregate query pattern; recording rules; aur wo single failure jo kisi bhi cheez se zyada metrics systems ko down karta hai — cardinality explosion, jahaan ek label bahut zyada possible values ke saath time series ki number ko database jo hold kar sakta hai usse aage multiply karta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Instruments on a car dashboard.** The odometer is a **counter** — it only goes up, and what you care about is how fast it is climbing (your speed is the *rate* of the odometer). The fuel gauge and the temperature needle are **gauges** — they go up and down, and the current reading is what matters. A **histogram** is like a rev-range display that shows how much of the last minute you spent in each thousand-RPM band — it lets you ask "what fraction of the time was I above 5000 RPM" after the fact. And cardinality is the number of separate instruments: a dashboard with ten gauges is readable; one with a separate fuel gauge for every kilometre of road you have ever driven is not a dashboard, it is a bonfire.',
      hi: '**Ek car dashboard par instruments.** Odometer ek **counter** hai — ye sirf upar jaata hai, aur jo aap care karte ho wo ye hai ki ye kitna fast climb kar raha hai (aapki speed odometer ki *rate* hai). Fuel gauge aur temperature needle **gauges** hain — wo upar aur neeche jaate hain, aur current reading wo hai jo matter karta hai. Ek **histogram** ek rev-range display jaisा hai jo dikhata hai aapne pichle minute ka kitna har thousand-RPM band mein spend kiya — ye aapko poochne deta hai "kitna fraction of the time main 5000 RPM se upar tha" after the fact. Aur cardinality separate instruments ki number hai: dus gauges wala ek dashboard readable hai; har kilometre of road ke liye ek separate fuel gauge wala ek dashboard nahi hai, ek bonfire hai.',
    },

    simple: `**A METRIC** = a name + a set of LABELS + a numeric value, recorded over time.
\`\`\`
http_requests_total{method="GET", route="/api/orders", status="200"}  = 84213
   ^name                ^labels (each label:value pair)                  ^value
\`\`\`
each unique combination of label values = one TIME SERIES.

**THE FOUR TYPES:**
\`\`\`
COUNTER    monotonically increasing (or reset to 0 on restart). you NEVER read the
           raw value - you read its RATE. requests, errors, bytes sent, jobs done.
             rate(http_requests_total[5m])   -> requests/sec, averaged over 5m
GAUGE      goes up AND down; the current value is meaningful. temperature, queue
           depth, in-flight requests, memory used, connection pool active, replicas.
             avg_over_time(queue_depth[10m]) ,  max_over_time(...)
HISTOGRAM  samples an observation (a latency, a size) into pre-defined BUCKETS
           ("<=10ms","<=50ms","<=100ms",...). client-side: cheap, just counters
           per bucket. lets you compute ANY quantile at query time, AND aggregate
           across instances correctly.
             histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le))
SUMMARY    computes quantiles CLIENT-SIDE (streaming) and exposes them directly.
           accurate per-instance, but you CANNOT aggregate quantiles across
           instances (you can't average p99s). prefer HISTOGRAM for anything
           you'll aggregate. summary is fine for a single-instance thing.
\`\`\`

**COLLECTION:**
\`\`\`
PULL (Prometheus model)   your app exposes  GET /metrics  (a text page of all its
   counters/gauges/histograms). Prometheus SCRAPES every target every 15-60s.
   pros: the scrape itself is a health check; targets are discovered dynamically;
   no app-side buffering. cons: needs network reachability to every target.
PUSH (StatsD / OTLP / push gateway)   the app SENDS metrics to a collector.
   pros: works for short-lived jobs (a cron that exits before a scrape), for
   serverless, across a NAT. cons: the collector is a bottleneck + SPOF; a dead
   app is silent (vs a pull target visibly going "down").
EXPORTER   a sidecar/process that translates something's native stats into
   /metrics : node_exporter (host), cAdvisor (containers), postgres_exporter,
   blackbox_exporter (probes a URL/TCP/DNS from outside), kube-state-metrics.
\`\`\`

**THE QUERY PATTERN:** almost every useful metric query is
\`\`\`
   AGGREGATE( RATE( counter[window] ) )  by (the labels you want to keep)
e.g. error ratio per route:
   sum(rate(http_requests_total{status=~"5.."}[5m])) by (route)
   /
   sum(rate(http_requests_total[5m])) by (route)
\`\`\`
RECORDING RULES pre-compute expensive/common expressions on a schedule so
dashboards + alerts read a cheap pre-aggregated series.

**CARDINALITY** = the number of distinct time series. it is the #1 way metrics
systems fall over.
\`\`\`
series count = (values of label A) x (values of label B) x (values of label C) x ...
SAFE labels (bounded, small): method (~5), status (~6), route (~30-100 if templated),
   region (~5), env (~3). -> a few thousand series. fine.
DANGEROUS labels (unbounded): user_id, request_id, session_id, email, full URL
   (un-templated: /users/8813/orders/4471 is its own series), trace_id, IP address,
   error MESSAGE (free text), timestamp.
one dangerous label = millions of series = the metrics DB OOMs, scrapes time out,
   ALL dashboards + alerts go dark. put those in traces/events (Lesson 1), not labels.
GUARDRAILS: templatize route labels (/users/:id), cap label values, alert on
   scrape sample count per target, use  metric_relabel_configs  to drop bad labels.
\`\`\``,

    simpleHi: `**EK METRIC** = ek name + LABELS ka ek set + ek numeric value, time ke over recorded.
\`\`\`
http_requests_total{method="GET", route="/api/orders", status="200"}  = 84213
   ^name                ^labels (har label:value pair)                   ^value
\`\`\`
label values ka har unique combination = ek TIME SERIES.

**CHAAR TYPES:**
\`\`\`
COUNTER    monotonically increasing (ya restart par 0 par reset). aap KABHI raw
           value nahi padhते - aap iski RATE padhते ho. requests, errors, bytes.
             rate(http_requests_total[5m])   -> requests/sec, 5m ke over averaged
GAUGE      upar AUR neeche jaता hai; current value meaningful hai. temperature,
           queue depth, in-flight requests, memory used, connection pool active.
             avg_over_time(queue_depth[10m]) ,  max_over_time(...)
HISTOGRAM  ek observation (ek latency, ek size) ko pre-defined BUCKETS mein sample
           karता hai. client-side: cheap, bas per bucket counters. query time par
           KOI bhi quantile compute karne deta hai, AUR instances ke across sahi tarah aggregate.
             histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le))
SUMMARY    quantiles CLIENT-SIDE compute karता hai aur unhe directly expose karता hai.
           per-instance accurate, par aap instances ke across quantiles AGGREGATE
           NAHI kar sakte. jo bhi aggregate karoge uske liye HISTOGRAM prefer karo.
\`\`\`

**COLLECTION:**
\`\`\`
PULL (Prometheus model)   aapki app  GET /metrics  expose karती hai. Prometheus har
   target ko har 15-60s SCRAPE karता hai.
   pros: scrape khud ek health check hai; targets dynamically discovered.
   cons: har target tak network reachability chahिए.
PUSH (StatsD / OTLP / push gateway)   app metrics ko ek collector ko SEND karती hai.
   pros: short-lived jobs, serverless, ek NAT ke across kaam karता hai.
   cons: collector ek bottleneck + SPOF hai; ek dead app silent hai.
EXPORTER   ek sidecar/process jo kisi cheez ke native stats ko /metrics mein translate
   karता hai: node_exporter (host), cAdvisor (containers), postgres_exporter,
   blackbox_exporter (bahar se ek URL/TCP/DNS probe), kube-state-metrics.
\`\`\`

**QUERY PATTERN:** lagbhag har useful metric query hai
\`\`\`
   AGGREGATE( RATE( counter[window] ) )  by (jo labels aap rakhna chahte ho)
e.g. per route error ratio:
   sum(rate(http_requests_total{status=~"5.."}[5m])) by (route)
   /
   sum(rate(http_requests_total[5m])) by (route)
\`\`\`
RECORDING RULES expensive/common expressions ko ek schedule par pre-compute karती hain.

**CARDINALITY** = distinct time series ki number. ye #1 way hai metrics systems fall over.
\`\`\`
series count = (label A ke values) x (label B ke values) x (label C ke values) x ...
SAFE labels (bounded, chhota): method (~5), status (~6), route (~30-100 agar templated),
   region (~5), env (~3). -> kuch hazaar series. theek.
DANGEROUS labels (unbounded): user_id, request_id, session_id, email, full URL,
   trace_id, IP address, error MESSAGE (free text), timestamp.
ek dangerous label = millions of series = metrics DB OOMs, scrapes time out,
   SAARE dashboards + alerts andhere mein. unhe traces/events mein daalo, labels nahi.
GUARDRAILS: route labels templatize karo (/users/:id), label values cap karo, per
   target scrape sample count par alert karo,  metric_relabel_configs  se bad labels drop karo.
\`\`\``,

    content: `## What a metric is

A metric is a named measurement with a set of **labels** (key-value dimensions) and a numeric value that is recorded repeatedly over time. \`http_requests_total{method="GET", route="/api/orders", status="200"}\` is one metric name with three labels; each distinct combination of label values is a separate **time series**, and the metrics database stores a stream of timestamped values for each series.

## The four types

**Counter**: a value that only ever increases, resetting to zero when the process restarts. You never read a counter\'s raw value — a total number of requests since process start is not meaningful — you read its **rate of change** over a window. \`rate(http_requests_total[5m])\` gives requests per second averaged over the last five minutes, and the rate function handles the resets. Counters are for things you count: requests, errors, bytes transferred, jobs processed.

**Gauge**: a value that goes up and down, where the current reading is meaningful. Temperature, queue depth, number of in-flight requests, memory in use, active connections in a pool, current replica count. You query gauges with functions like \`avg_over_time\` and \`max_over_time\` over a window.

**Histogram**: samples an observation — a request latency, a payload size — into a set of predefined **buckets** ("at most 10 ms", "at most 50 ms", "at most 100 ms", and so on). On the client side this is cheap: each observation just increments the counter for every bucket it falls under. The value is that at query time you can compute any quantile — \`histogram_quantile(0.99, ...)\` for the p99 — and, critically, you can aggregate correctly across instances by summing the bucket counters before computing the quantile.

**Summary**: computes selected quantiles on the client side using a streaming algorithm and exposes those quantile values directly. A summary is accurate for a single instance, but you **cannot aggregate quantiles across instances** — averaging several instances\' p99 values does not give the fleet p99, and there is no correct way to combine them after the fact. Use a histogram for anything you will aggregate across instances, which is almost everything; a summary is acceptable only for a single-instance measurement.

## Collection

**Pull**, the Prometheus model: each application exposes an HTTP endpoint, conventionally \`/metrics\`, that returns a text page listing all its current counter, gauge, and histogram values. A central Prometheus server discovers the targets (from Kubernetes, service discovery, or static config) and scrapes each one every fifteen to sixty seconds. The advantages are that the scrape itself doubles as a liveness check — a target that stops responding visibly goes "down" — targets are discovered dynamically as they come and go, and the application does not buffer or ship anything. The disadvantage is that the Prometheus server needs network reachability to every target.

**Push**, the StatsD, OTLP, or push-gateway model: the application sends its metrics to a collector. This works for cases pull cannot handle — a short-lived batch job or cron task that exits before any scrape could reach it, a serverless function, a target behind a NAT with no inbound path. The disadvantages are that the collector becomes a bottleneck and a single point of failure, and a dead application is simply silent rather than visibly showing as a failed scrape target.

**Exporters** bridge the gap for things that do not natively expose Prometheus metrics: \`node_exporter\` for host CPU, memory, disk, and network; cAdvisor for per-container resource usage; \`postgres_exporter\`, \`redis_exporter\`, and the like for datastores; \`blackbox_exporter\` to probe a URL, TCP port, or DNS name from outside and report reachability and latency; \`kube-state-metrics\` for the state of Kubernetes objects.

## The query pattern

Almost every useful metric query follows one shape: **aggregate the rate of a counter over a window, grouped by the labels you want to keep**. The error ratio per route is the rate of 5xx requests summed by route, divided by the rate of all requests summed by route. A dashboard panel is this expression evaluated over time; an alert is this expression compared to a threshold. **Recording rules** pre-compute an expensive or frequently used expression on a schedule and store the result as a new series, so dashboards and alerts read a cheap pre-aggregated series instead of recomputing a heavy query every time they refresh.

## Cardinality — the failure that dominates

**Cardinality** is the number of distinct time series a metrics system is tracking, and it is the single most common way these systems fall over. The series count for a metric is the product of the number of distinct values of each of its labels: two hundred routes times six statuses times five methods times five regions is thirty thousand series for one metric, which is fine.

The problem is a label whose set of possible values is unbounded — it grows with the number of users, requests, or the passage of time. A user ID has hundreds of thousands of values. A request ID or trace ID has as many values as there have been requests. An un-templated URL path (\`/users/8813/orders/4471\` recorded literally rather than as \`/users/:id/orders/:id\`) is a distinct series per URL. An IP address, an email, a free-text error message, a timestamp — all unbounded. Adding one such label multiplies the series count by its cardinality, and the metrics database runs out of memory, scrapes begin timing out, and the query engine collapses, taking every dashboard and alert down with it — the observability system becomes the outage.

The guardrails: template path labels so \`/users/:id\` is one series rather than one per user; keep every label\'s value set explicitly bounded and small; put the high-cardinality dimensions in traces and wide events, never in metric labels (Lesson 1); alert on the number of samples per scrape target so a cardinality spike is caught before it causes an outage; and use the collector\'s relabelling configuration to drop known-bad labels at ingestion as a backstop.`,

    contentHi: `## Ek metric kya hai

Ek metric ek named measurement hai **labels** (key-value dimensions) ke ek set aur ek numeric value ke saath jo time ke over repeatedly recorded hai. \`http_requests_total{method="GET", route="/api/orders", status="200"}\` teen labels ke saath ek metric name hai; label values ka har distinct combination ek separate **time series** hai.

## Chaar types

**Counter**: ek value jo sirf kabhi increase hoti hai, process restart hone par zero par reset. Aap kabhi ek counter ki raw value nahi padhते — aap iski **rate of change** ek window ke over padhते ho. \`rate(http_requests_total[5m])\` pichle paanch minute ke over averaged per second requests deta hai. Counters un cheezon ke liye hain jo aap count karते ho: requests, errors, bytes transferred.

**Gauge**: ek value jo upar aur neeche jaती hai, jahaan current reading meaningful hai. Temperature, queue depth, in-flight requests ki number, memory in use, active connections. Aap gauges ko \`avg_over_time\` aur \`max_over_time\` jaise functions ke saath query karते ho.

**Histogram**: ek observation ko pre-defined **buckets** ke ek set mein sample karता hai. Client side par ye cheap hai. Value ye hai ki query time par aap koi bhi quantile compute kar sakte ho, aur, critically, aap instances ke across sahi tarah aggregate kar sakte ho.

**Summary**: client side par selected quantiles compute karता hai aur un quantile values ko directly expose karता hai. Ek summary ek single instance ke liye accurate hai, par aap **instances ke across quantiles aggregate nahi kar sakte**. Jo bhi aap instances ke across aggregate karoge uske liye ek histogram use karo.

## Collection

**Pull**, Prometheus model: har application ek HTTP endpoint expose karती hai, conventionally \`/metrics\`. Ek central Prometheus server targets discover karता hai aur har ek ko har pandrah se saath second scrape karता hai. Advantages ye hain ki scrape khud ek liveness check ke roop mein double karता hai, targets dynamically discovered hain. Disadvantage ye hai ki Prometheus server ko har target tak network reachability chahिए.

**Push**, StatsD, OTLP, ya push-gateway model: application apne metrics ek collector ko bhejती hai. Ye un cases ke liye kaam karता hai jo pull handle nahi kar sakta — ek short-lived batch job, ek serverless function. Disadvantages ye hain ki collector ek bottleneck aur ek single point of failure ban jaता hai.

**Exporters** un cheezon ke liye gap bridge karते hain jo natively Prometheus metrics expose nahi karती: \`node_exporter\` host ke liye, cAdvisor per-container ke liye, \`postgres_exporter\`, \`blackbox_exporter\` bahar se ek URL probe karne ke liye.

## Query pattern

Lagbhag har useful metric query ek shape follow karता hai: **ek counter ki rate ko ek window ke over aggregate karo, un labels se grouped jo aap rakhna chahते ho**. Per route error ratio route se summed 5xx requests ki rate hai, route se summed saari requests ki rate se divided. **Recording rules** ek expensive ya frequently used expression ko ek schedule par pre-compute karती hain.

## Cardinality — wo failure jo dominate karता hai

**Cardinality** distinct time series ki number hai jo ek metrics system track kar raha hai, aur ye single most common way hai ye systems fall over karते hain. Ek metric ke liye series count iske har label ke distinct values ki number ka product hai.

Problem ek label hai jiske possible values ka set unbounded hai — ye users, requests, ya time ke saath grow karता hai. Ek user ID ke sैंकdon hazaron values hain. Ek request ID ya trace ID ke utni values hain jitni requests hui hain. Ek aisा label add karna series count ko iski cardinality se multiply karता hai, aur metrics database memory se bahar ho jaता hai.

Guardrails: path labels template karo taaki \`/users/:id\` ek series ho; har label ka value set explicitly bounded aur chhota rakho; high-cardinality dimensions ko traces aur wide events mein daalo; per scrape target samples ki number par alert karo; aur collector ki relabelling configuration se known-bad labels ingestion par drop karo.`,

    examples: [
      {
        title: 'Choosing the right metric type for five measurements',
        titleHi: 'Paanch measurements ke liye sahi metric type choose karna',
        code: `# 1) "how many requests are we serving, and how many are errors?"
#    -> COUNTER.  http_requests_total{route, method, status}
#       query:  sum(rate(http_requests_total[5m]))                      # total req/s
#               sum(rate(http_requests_total{status=~"5.."}[5m]))       # error req/s
#    NOT a gauge - you'd have to compute deltas yourself and lose data on restart.

# 2) "how deep is the job queue right now?"
#    -> GAUGE.  job_queue_depth{queue}
#       query:  max_over_time(job_queue_depth{queue="email"}[15m])
#    NOT a counter - it goes down when jobs are consumed.

# 3) "what's the p50/p95/p99 request latency, per route, across the whole fleet?"
#    -> HISTOGRAM.  http_request_duration_seconds_bucket{route, le}
#       query:  histogram_quantile(0.99,
#                 sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
#    NOT a summary - you need to AGGREGATE p99 across 40 instances, and you cannot
#    average summary quantiles. histogram buckets sum correctly first, THEN quantile.

# 4) "how much memory / CPU is each pod using?"
#    -> GAUGE (from cAdvisor).  container_memory_working_set_bytes{pod}
#                               rate(container_cpu_usage_seconds_total[5m])  # CPU is a counter!
#    (CPU-seconds is monotonic -> counter -> rate() gives cores-used.)

# 5) "how long did the last backup take, and did it succeed?" (a nightly cron)
#    -> a PUSH to a push gateway (the job exits before any scrape):
#       backup_duration_seconds{job="nightly"}         (gauge, set once)
#       backup_last_success_timestamp{job="nightly"}   (gauge)
#       alert:  time() - backup_last_success_timestamp > 36h   -> "backup stale"
#    a pull scrape would never catch a job that runs for 4 min at 3am.`,
        output: `Type follows the question. "How many / how much throughput" -> COUNTER, read via
rate(). "What is it right now" (can go down) -> GAUGE. "What is the distribution /
what percentile" that you must aggregate across instances -> HISTOGRAM (never a
summary - you can't average p99s). Resource usage -> gauges, except CPU-seconds
which is a counter. A short-lived job -> PUSH (a pull scrape can't catch it) and
alert on a staleness gauge, not on the job's absence.`,
        explain: 'Five different measurements each map to a specific metric type based on what question they answer. Request and error counts are counters because they only accumulate; you read them through the rate function to get throughput, and the rate function correctly handles the reset to zero on a process restart, which a manually differenced gauge would not. Queue depth is a gauge because it rises and falls as jobs arrive and are consumed. Request latency percentiles are a histogram, specifically not a summary, because the p99 has to be computed across the whole fleet of instances and there is no valid way to average per-instance p99 values — the histogram works because its bucket counters can be summed across instances first and the quantile computed from the combined buckets. Memory usage is a gauge, but CPU usage is exposed as a counter of CPU-seconds, so it is read through the rate function to get cores in use. The nightly backup job is the interesting case: it runs for a few minutes at three in the morning and exits, so a pull-based scrape on a fifteen-to-sixty-second interval will almost never catch it running; the job pushes its duration and a last-success timestamp to a push gateway, and the alert is on the timestamp going stale rather than on the job being absent.',
        explainHi: 'Paanch alag measurements har ek ek specific metric type se map karते hain based on wo kaun sा question answer karते hain. Request aur error counts counters hain kyunki wo sirf accumulate karते hain; aap unhe rate function ke through padhते ho throughput paane ke liye. Queue depth ek gauge hai kyunki ye rise aur fall karता hai jaise jobs arrive aur consumed hote hain. Request latency percentiles ek histogram hain, specifically ek summary nahi, kyunki p99 ko poore fleet of instances ke across compute karna padता hai aur per-instance p99 values ko average karne ka koi valid way nahi hai. Memory usage ek gauge hai, par CPU usage CPU-seconds ke ek counter ke roop mein expose hota hai. Nightly backup job interesting case hai: ye teen baje kuch minute chalता hai aur exit karता hai, to ek pull-based scrape ise lagbhag kabhi running nahi catch karega.',
      },
      {
        title: 'A cardinality explosion: how one label took down all dashboards',
        titleHi: 'Ek cardinality explosion: ek label ne saare dashboards kaise down kiye',
        code: `# BEFORE: a healthy metric
  http_requests_total{method, route, status, region}
  cardinality:  5 methods x 80 routes x 6 statuses x 4 regions  = ~9,600 series
  Prometheus memory: ~2 GB. queries: fast. all good.

# THE CHANGE (a well-meaning PR: "add customer_id so we can debug per-customer"):
  http_requests_total{method, route, status, region, customer_id}
  customer_id has ~250,000 distinct values.
  new cardinality:  9,600 x 250,000  = ~2.4 BILLION series

# THE TIMELINE:
  T+0min   deploy. Prometheus starts ingesting the new label.
  T+8min   Prometheus memory 12 GB -> 34 GB. GC thrashing. scrape duration 2s -> 45s.
  T+14min  Prometheus OOM-killed. restarts. replays WAL (slow). OOM again. crash loop.
  T+15min  ALL dashboards blank. ALL alerts in "unknown" state - including the
           page-worthy ones. the team is now flying blind DURING whatever else
           might be happening.
  T+40min  someone reverts the PR. Prometheus still crash-looping on the stored
           high-card data -> they have to delete the TSDB block / bump the
           retention to force compaction. ~2h total to full recovery.

# THE FIX (what should have been there):
#   - customer_id -> a field on the TRACE SPAN and the wide EVENT, not a metric label
#   - a global limit:  --storage.tsdb.max-block-... / sample_limit per scrape:
      scrape_configs:
        - job_name: app
          sample_limit: 50000         # a target emitting > 50k series is REFUSED,
                                       # not allowed to poison the whole TSDB
#   - metric_relabel_configs to drop any label not on an allowlist:
      metric_relabel_configs:
        - regex: "customer_id|user_id|request_id|trace_id|session_id"
          action: labeldrop
#   - an alert:  prometheus_tsdb_symbol_table_size_bytes / scrape_samples_scraped
#                trending up fast -> "cardinality growing, investigate NOW"`,
        output: `One unbounded label (customer_id, ~250k values) multiplied a healthy ~9,600-series
metric into ~2.4 billion series. Prometheus OOM-looped, and for ~2 hours EVERY
dashboard and EVERY alert - including the critical ones - was dark. The dimension
belonged on the trace span / the wide event, never a metric label. Guardrails
that would have stopped it: a per-scrape sample_limit (refuse a target emitting
too many series), a labeldrop allowlist, and an alert on samples-scraped
trending up.`,
        explain: 'A healthy metric with four bounded labels has under ten thousand time series and costs Prometheus about two gigabytes of memory. A pull request adds a fifth label, customer ID, to help debug a per-customer issue. Customer ID has a quarter of a million distinct values, so the series count becomes the previous count multiplied by that — roughly two point four billion series. The failure unfolds over minutes: Prometheus memory climbs from twelve to thirty-four gigabytes as it ingests the new label, garbage collection thrashes, scrape durations blow out from two seconds to forty-five, and then Prometheus is killed for running out of memory. It restarts, tries to replay its write-ahead log, runs out of memory again, and enters a crash loop. Within fifteen minutes every dashboard is blank and every alert is in an unknown state, including the ones that would page for a real incident, so the team is blind at the worst possible time. Reverting the pull request does not immediately fix it because the high-cardinality data is already stored and Prometheus keeps crashing trying to compact it, so recovery takes about two hours and involves deleting storage blocks. The fix is that customer ID should have been a field on the trace span and the wide event, not a metric label, and the guardrails that would have prevented the outage entirely: a per-scrape sample limit that refuses a target emitting too many series, a relabelling rule that drops any label not on an allowlist, and an alert on the samples-scraped count trending upward.',
        explainHi: 'Chaar bounded labels wale ek healthy metric ke dus hazaar se kam time series hain aur ye Prometheus ko lagbhag do gigabyte memory cost karता hai. Ek pull request ek paanchvaan label, customer ID, add karता hai. Customer ID ke ek chauthai million distinct values hain, to series count previous count us se multiplied ban jaता hai — roughly do point chaar billion series. Failure minutes ke over unfold hota hai: Prometheus memory barah se chauttees gigabyte tak climb karता hai, scrape durations do second se pantalees tak blow out hote hain, aur phir Prometheus memory se bahar hone ke liye killed hai. Pandrah minute ke andar har dashboard blank hai aur har alert ek unknown state mein hai. Pull request revert karna ise turant fix nahi karता. Fix ye hai ki customer ID ek trace span par ek field hona chahिए tha, ek metric label nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# using a Summary for latency and then trying to see the fleet p99
  # each of 40 pods exposes:  http_latency_seconds{quantile="0.99"}  (a Summary)
  # dashboard query:  avg(http_latency_seconds{quantile="0.99"})
  #   -> "the average of the 40 pods' individual p99s"
  #   this is NOT the fleet p99. it's a meaningless number. if 1 pod is on fire
  #   (p99 = 8s) and 39 are fine (p99 = 0.1s), the "average p99" is ~0.3s and
  #   looks acceptable while 2.5% of users on that pod are having a terrible time.`,
        right: `# use a Histogram; aggregate the BUCKETS, then compute the quantile:
  # each pod exposes:  http_request_duration_seconds_bucket{le="0.1"},{le="0.25"},...
  # fleet p99:
    histogram_quantile(0.99,
      sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
  #   -> sums the per-bucket request counts across ALL 40 pods FIRST, then reads
  #      the 99th-percentile bucket from the combined distribution. CORRECT.
  # the on-fire pod's slow requests are now IN the combined histogram and pull the
  # real fleet p99 up, which is what you want to see.
  # (summary is only ok for a single-instance thing you will never aggregate.)`,
        why: 'A summary computes quantiles on each instance independently and exposes the resulting values, and there is no mathematically valid way to combine quantiles from different instances after the fact — the p99 of a combined population is not the average, the maximum, or any simple function of the per-instance p99 values, because it depends on the full shape of each distribution and how many requests each instance served. Averaging forty pods\' p99 values produces a number that means nothing: if one pod is badly degraded with a p99 of eight seconds and thirty-nine are healthy at a tenth of a second, the average is around three tenths of a second and looks fine, while the users routed to the bad pod are experiencing eight-second responses. A histogram avoids this because it exposes bucket counts — how many observations fell into each latency range — and bucket counts are additive: you sum the per-bucket rates across all instances first, producing the true combined distribution, and then compute the quantile from that. The degraded pod\'s slow requests are now part of the combined histogram and correctly pull the real fleet p99 upward. The rule is to use a histogram for any latency or size measurement you will aggregate across instances, which is essentially all of them, and reserve summaries for a single-instance measurement that will never be combined.',
        whyHi: 'Ek summary har instance par independently quantiles compute karता hai aur resulting values expose karता hai, aur different instances se quantiles ko after the fact combine karne ka koi mathematically valid way nahi hai — ek combined population ka p99 average, maximum, ya per-instance p99 values ka koi simple function nahi hai. Chalees pods ki p99 values ko average karna ek number produce karता hai jiska kuch matlab nahi: agar ek pod badly degraded hai aath second ke p99 ke saath aur unatalis healthy hain, average lagbhag teen dashamlav ek second hai aur theek dikhता hai. Ek histogram ise avoid karता hai kyunki ye bucket counts expose karता hai, aur bucket counts additive hain: aap pehle saare instances ke across per-bucket rates sum karते ho, phir quantile compute karते ho. Rule ek histogram use karna hai kisi bhi latency ya size measurement ke liye jise aap instances ke across aggregate karoge.',
      },
      {
        wrong: `# reading a counter's raw value instead of its rate
  # dashboard panel:  http_requests_total{route="/checkout"}
  #   -> shows a line that goes 1,203,441 ... 1,203,502 ... 1,203,588 ...
  #   -> always climbing, y-axis in the millions, you cannot see the SHAPE of
  #      current traffic. and when a pod restarts, the line drops to 0 and the
  #      panel looks like an outage that isn't one.
  # alert:  http_requests_total{status="500"} > 100
  #   -> fires FOREVER after the 101st error since process start. useless.`,
        right: `# counters are read via rate() / increase(), which handle resets:
  # traffic shape:
    sum(rate(http_requests_total{route="/checkout"}[5m]))     # req/s, right now
  # errors in the last 5 min (not since the dawn of time):
    sum(increase(http_requests_total{status="500"}[5m]))
  # error RATIO (the thing you actually alert on):
    sum(rate(http_requests_total{status=~"5.."}[5m]))
    / sum(rate(http_requests_total[5m]))                       > 0.02
  # rule: you almost never graph or alert on a counter directly. wrap it in
  # rate() (per-second) or increase() (total over the window).`,
        why: 'A counter only accumulates and resets to zero when its process restarts, so its raw value is the total number of events since the current process started, which carries almost no useful information. Graphing it produces an ever-climbing line where the current rate of traffic is invisible because the y-axis is dominated by the accumulated total, and a routine pod restart makes the line drop to zero, which looks like an outage. Alerting on a counter\'s raw value is worse: "more than one hundred errors" fires permanently once the process has served its hundred-and-first error since it started, regardless of whether errors are happening now. The correct way to read a counter is through a function that computes its change over a window and accounts for resets: the rate function gives per-second rate of change, and the increase function gives the total change over the window. Traffic shape is the rate of the request counter; errors in the last five minutes is the increase of the error counter over five minutes; and the error ratio you actually alert on is the rate of 5xx requests divided by the rate of all requests, compared to a threshold. You almost never graph or alert on a counter directly.',
        whyHi: 'Ek counter sirf accumulate karता hai aur apne process restart hone par zero par reset hota hai, to iski raw value current process shuru hone se events ki total number hai, jo lagbhag koi useful information carry nahi karती. Ise graph karna ek ever-climbing line produce karता hai jahaan current rate of traffic invisible hai, aur ek routine pod restart line ko zero par drop karता hai, jo ek outage jaisा dikhता hai. Ek counter ki raw value par alert karna worse hai: "ek sau se zyada errors" permanently fire karता hai ek baar process ne apna ek sau ek va error serve kiya. Ek counter padhne ka correct way ek function ke through hai jo ek window ke over iska change compute karता hai: rate function per-second rate of change deta hai, aur increase function window ke over total change deta hai.',
      },
      {
        wrong: `# assuming pull works everywhere -> silently losing metrics from short jobs +
# serverless + anything the scraper can't reach
# a Lambda function increments an in-memory counter and exposes /metrics... which
# nothing ever scrapes, because the Lambda is gone 200ms after the response.
# a cron job on a box in another VPC exposes /metrics on :9090... which Prometheus
# in the main VPC has no route to.
# result: these workloads have ZERO metrics. nobody notices until an incident.`,
        right: `# match the collection model to the workload:
#   long-lived, network-reachable services   -> PULL (Prometheus scrape /metrics)
#   short-lived jobs (cron, batch, CI)        -> PUSH to a Pushgateway, OR write
#     the result as a metric on completion (duration, exit code, rows processed) +
#     a last_success_timestamp; alert on staleness
#   serverless (Lambda/Functions)             -> PUSH via the OTLP exporter to a
#     collector, or the provider's native metrics (CloudWatch EMF / Azure Monitor)
#   things behind a NAT / in another account  -> PUSH, or a scrape proxy, or
#     remote_write from a local agent
#   external endpoints (is the site up?)      -> blackbox_exporter PROBES from
#     outside (that IS a pull, but of a prober, not the target)`,
        why: 'The pull model requires the metrics server to open a connection to every target on a schedule, which works well for long-lived services with stable network addresses but fails silently for whole categories of workload. A serverless function has already been torn down before any scrape interval elapses, so its in-memory metrics are never collected. A batch or cron job runs for a bounded time and exits; a scrape that happens to fall outside that window sees nothing, and most runs are missed entirely. A workload behind a NAT gateway or in a different account or VPC has no inbound path for the scraper to reach it. In all these cases the result is that the workload emits no metrics at all, and because the absence is silent — there is no failed scrape target to notice — nobody realises until an incident when the data is needed and not there. The fix is to match the collection model to the workload: pull for long-lived reachable services, push to a gateway or a direct write-on-completion for short-lived jobs with an alert on staleness, push via an OTLP exporter or the provider\'s native metrics for serverless, and external probing with a blackbox exporter for checking that an endpoint is reachable from outside.',
        whyHi: 'Pull model ke liye metrics server ko har target par ek schedule par ek connection open karna padता hai, jo stable network addresses wale long-lived services ke liye achha kaam karता hai par workload ki poori categories ke liye silently fail hota hai. Ek serverless function pehle hi torn down hai koi bhi scrape interval elapse hone se pehle. Ek batch ya cron job ek bounded time ke liye chalता hai aur exit karता hai. Ek NAT gateway ke peeche ek workload ke paas koi inbound path nahi hai. In sab cases mein result ye hai ki workload bilkul koi metrics emit nahi karता, aur kyunki absence silent hai, kisi ko incident tak realise nahi hota. Fix collection model ko workload se match karna hai: reachable long-lived services ke liye pull, short-lived jobs ke liye ek gateway ko push, serverless ke liye ek OTLP exporter ke through push.',
      },
    ],

    realWorld: [
      {
        en: '**The `customer_id` label, 2 hours dark** — a PR added `customer_id` (~250k values) to the request counter. Prometheus went from ~10k to ~2.4B series, OOM-looped, and every dashboard + alert was dark for ~2 hours (revert wasn\'t enough — they had to drop TSDB blocks). Now: a `sample_limit` per scrape + a `labeldrop` allowlist + a cardinality-growth alert.',
        hi: '**Wo `customer_id` label, 2 ghante andhere** — ek PR ne request counter mein `customer_id` (~250k values) add kiya. Prometheus ~10k se ~2.4B series par gaya, OOM-loop hua. Ab: per scrape ek `sample_limit` + ek `labeldrop` allowlist + ek cardinality-growth alert.',
      },
      {
        en: '**Averaged summary p99 hid a bad pod** — a dashboard showed `avg(http_latency{quantile="0.99"})` ≈ 0.3s and looked healthy while one pod was serving 8s p99. Switching to a histogram and `histogram_quantile(0.99, sum(rate(...bucket[5m])) by (le))` surfaced the real fleet p99 (1.9s) and the bad pod.',
        hi: '**Averaged summary p99 ne ek bad pod chupaya** — ek dashboard `avg(http_latency{quantile="0.99"})` ≈ 0.3s dikhata tha aur healthy dikhta tha jabki ek pod 8s p99 serve kar raha tha. Ek histogram par switch karna real fleet p99 (1.9s) surface kiya.',
      },
      {
        en: '**Nightly backup had no metrics** — the backup cron exposed `/metrics` but nothing scraped it (it exited in 4 min at 3am). A silent 3-week backup failure was found only when a restore was needed. Now it pushes `backup_last_success_timestamp` and there\'s an alert on `time() - that > 36h`.',
        hi: '**Nightly backup ke koi metrics nahi the** — backup cron ne `/metrics` expose kiya par kuch scrape nahi kiya (ye 3am par 4 min mein exit hua). Ek silent 3-hafte ka backup failure sirf tab mila jab ek restore ki zaroorat thi. Ab ye `backup_last_success_timestamp` push karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the four metric types, and when do you use each? Why prefer a histogram over a summary?',
        qHi: 'Chaar metric types kya hain, aur aap har ek kab use karte ho? Ek summary ke over ek histogram kyun prefer karo?',
        a: 'A counter only ever increases and resets to zero on process restart; you never read its raw value, you read its rate of change over a window with the rate or increase function, which handles the resets. Counters are for things you count: requests, errors, bytes, jobs. A gauge goes up and down and its current value is meaningful — queue depth, in-flight requests, memory in use, active connections, replica count — queried with functions like avg_over_time and max_over_time. A histogram samples an observation such as a latency or a size into predefined buckets; on the client it just increments a counter per bucket, and at query time you compute any quantile and, crucially, aggregate correctly across instances. A summary computes selected quantiles on the client using a streaming algorithm and exposes those values directly. You prefer a histogram over a summary for anything you will aggregate across instances, which is almost everything, because summary quantiles cannot be combined: there is no valid way to derive the fleet p99 from forty per-instance p99 values, and averaging them produces a meaningless number that hides a single badly degraded instance. A histogram works because bucket counts are additive — you sum the per-bucket rates across all instances first, then compute the quantile from the true combined distribution. A summary is acceptable only for a single-instance measurement you will never aggregate.',
        aHi: 'Ek counter sirf kabhi increase hoti hai aur process restart par zero par reset hoti hai; aap kabhi iski raw value nahi padhते, aap iski rate of change ek window ke over padhते ho. Counters un cheezon ke liye hain jo aap count karते ho. Ek gauge upar aur neeche jaती hai aur iski current value meaningful hai. Ek histogram ek observation jaise ek latency ko pre-defined buckets mein sample karता hai; query time par aap koi bhi quantile compute karते ho aur instances ke across sahi tarah aggregate. Ek summary client par selected quantiles compute karता hai. Aap ek summary ke over ek histogram prefer karते ho kisi bhi cheez ke liye jise aap instances ke across aggregate karoge, kyunki summary quantiles combine nahi ho sakte: chalees per-instance p99 values se fleet p99 derive karne ka koi valid way nahi hai. Ek histogram kaam karता hai kyunki bucket counts additive hain.',
      },
      {
        q: 'Compare pull and push metric collection. When must you push?',
        qHi: 'Pull aur push metric collection compare karo. Aapko kab push karna chahिए?',
        a: 'In the pull model, each application exposes an HTTP endpoint listing its current metric values, and a central server discovers targets and scrapes each on an interval. The advantages are that the scrape doubles as a liveness check so a dead target visibly goes down, targets are discovered dynamically as they come and go, and the application ships nothing. The disadvantage is that the server needs network reachability to every target. In the push model the application sends metrics to a collector, which is necessary for cases pull cannot handle. You must push for short-lived jobs — a cron or batch task that runs for a bounded time and exits, so a scrape almost never catches it running and most runs are missed entirely; the pattern is to push a duration and a last-success timestamp and alert on the timestamp going stale. You must push for serverless functions, which are torn down before any scrape interval elapses; you use an OTLP exporter to a collector or the provider\'s native metrics. You must push, or use a proxy, for workloads behind a NAT or in another account or VPC where the scraper has no inbound path. The disadvantages of push are that the collector becomes a bottleneck and a single point of failure, and a dead application is silent rather than visibly a failed scrape target. Exporters are a related tool: a process that translates something\'s native stats into a scrapeable endpoint, such as node_exporter for hosts, cAdvisor for containers, and blackbox_exporter to probe an external URL from outside.',
        aHi: 'Pull model mein, har application ek HTTP endpoint expose karती hai jo iske current metric values list karता hai, aur ek central server targets discover karता hai aur har ek ko ek interval par scrape karता hai. Advantages ye hain ki scrape ek liveness check ke roop mein double karता hai, targets dynamically discovered hain, aur application kuch ship nahi karता. Disadvantage ye hai ki server ko har target tak network reachability chahिए. Aapko push karna chahिए short-lived jobs ke liye — ek cron ya batch task jo ek bounded time ke liye chalता hai aur exit karता hai. Aapko push karna chahिए serverless functions ke liye. Aapko push karna chahिए NAT ke peeche workloads ke liye. Push ke disadvantages ye hain ki collector ek bottleneck aur ek single point of failure ban jaता hai.',
      },
      {
        q: 'What is a cardinality explosion, why is it catastrophic, and how do you prevent it?',
        qHi: 'Ek cardinality explosion kya hai, ye catastrophic kyun hai, aur aap ise kaise prevent karte ho?',
        a: 'Cardinality is the number of distinct time series a metrics system tracks, and the series count for a metric is the product of the number of distinct values of each of its labels. Bounded labels — method, status, region, a templated route — multiply to a few thousand series, which is fine. A cardinality explosion happens when a label whose set of possible values is unbounded is added: a user ID, a request ID, a trace ID, an un-templated URL path, an IP address, a free-text error message, a timestamp — anything that grows with users, requests, or time. Adding one such label multiplies the series count by its cardinality, taking a metric from thousands of series to hundreds of millions or billions. It is catastrophic because the metrics database runs out of memory and enters a crash loop, scrapes time out, and the query engine collapses, so every dashboard goes blank and every alert enters an unknown state — including the critical ones — and the team is blind precisely when they most need visibility. Reverting the change does not immediately fix it because the high-cardinality data is already stored and the database keeps crashing trying to compact it, so recovery involves deleting storage and can take hours. Prevention: keep every metric label\'s value set explicitly bounded and small; template path labels so a route is one series not one per ID; put high-cardinality dimensions in traces and wide events, never in labels; set a per-scrape sample limit that refuses a target emitting too many series; use relabelling to drop any label not on an allowlist; and alert on the samples-scraped count trending upward so a growing cardinality is caught before it causes an outage.',
        aHi: 'Cardinality distinct time series ki number hai jo ek metrics system track karता hai, aur ek metric ke liye series count iske har label ke distinct values ki number ka product hai. Bounded labels kuch hazaar series tak multiply karते hain. Ek cardinality explosion tab hota hai jab ek label jiske possible values ka set unbounded hai add kiya jaता hai: ek user ID, ek request ID, ek trace ID, ek un-templated URL path. Ek aisा label add karna series count ko iski cardinality se multiply karता hai, ek metric ko hazaron series se hundreds of millions ya billions tak le jaता hai. Ye catastrophic hai kyunki metrics database memory se bahar ho jaता hai aur ek crash loop mein enter karता hai, har dashboard blank ho jaता hai aur har alert ek unknown state mein enter karता hai. Prevention: har metric label ka value set bounded aur chhota rakho; path labels template karo; high-cardinality dimensions ko traces aur wide events mein daalo; ek per-scrape sample limit set karo.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define counter/gauge/histogram/summary with an example query for each, and explain why you can\'t aggregate summary quantiles across instances.',
        taskHi: 'Ek comment mein, counter/gauge/histogram/summary define karo.',
        hint: 'A METRIC = a name + a set of LABELS + a numeric value over time; each unique label-value combination = one TIME SERIES. COUNTER: monotonically increasing, resets to 0 on restart. NEVER read the raw value — read its RATE. For: requests, errors, bytes sent, jobs done, CPU-seconds. Query: `sum(rate(http_requests_total[5m]))` → req/s; `sum(increase(http_requests_total{status="500"}[5m]))` → errors in the last 5 min (NOT since process start). GAUGE: goes UP and DOWN, current value is meaningful. For: queue depth, in-flight requests, memory used, connection-pool active, replica count, temperature. Query: `avg_over_time(queue_depth[10m])`, `max_over_time(...)`. HISTOGRAM: samples an observation (a latency, a size) into pre-defined BUCKETS (`le="0.01"`, `le="0.05"`, ...). Client-side = cheap (just a counter per bucket). Query: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))`. SUMMARY: computes quantiles CLIENT-SIDE (streaming) and exposes them directly (`http_latency_seconds{quantile="0.99"}`). Accurate per-instance. WHY YOU CAN\'T AGGREGATE SUMMARY QUANTILES ACROSS INSTANCES: there is NO mathematically valid way to combine quantiles from different instances after the fact — the p99 of a combined population is NOT the average / max / any simple function of the per-instance p99s; it depends on the full SHAPE of each distribution and how many requests each instance served. `avg(the 40 pods\' p99s)`: if 1 pod is on fire (p99 = 8s) and 39 are fine (p99 = 0.1s), the "average p99" ≈ 0.3s and looks acceptable while 2.5% of users on that pod have a terrible time. A HISTOGRAM avoids this because BUCKET COUNTS ARE ADDITIVE: sum the per-bucket rates across ALL instances FIRST → the true combined distribution → THEN compute the quantile. Use a histogram for anything you\'ll aggregate (≈ everything); a summary only for a single-instance thing you\'ll never combine.',
        hintHi: 'A METRIC = ek name + LABELS ka ek set + ek numeric value; har unique label-value combination = ek TIME SERIES. COUNTER: monotonically increasing, restart par 0 par reset. KABHI raw value nahi — iski RATE padho. Query: `sum(rate(http_requests_total[5m]))` → req/s. GAUGE: UP aur DOWN jaता hai. Query: `avg_over_time(queue_depth[10m])`. HISTOGRAM: ek observation ko pre-defined BUCKETS mein sample. Query: `histogram_quantile(0.99, sum(rate(...bucket[5m])) by (le))`. SUMMARY: quantiles CLIENT-SIDE compute karता hai. INSTANCES KE ACROSS SUMMARY QUANTILES AGGREGATE KYUN NAHI: different instances se quantiles combine karne ka koi valid way NAHI — ek combined population ka p99 average/max nahi hai. `avg(40 pods ke p99s)`: 1 pod on fire (8s) + 39 fine (0.1s) → "average" ≈ 0.3s, theek dikhता hai. HISTOGRAM avoid karता hai kyunki BUCKET COUNTS ADDITIVE hain: pehle sum, phir quantile.',
      },
      {
        task: 'In a comment, explain the AGGREGATE(RATE(counter[window])) query pattern with a per-route error-ratio example, what recording rules do, and pull vs push.',
        taskHi: 'Ek comment mein, query pattern aur pull vs push samjhao.',
        hint: 'THE QUERY PATTERN — almost every useful metric query is `AGGREGATE( RATE( counter[window] ) ) by (the labels you want to keep)`. `RATE(...[window])` = per-second rate of change of the counter over the window, handling resets. `AGGREGATE ... by (...)` = `sum` / `avg` / `max` grouped by the labels you keep (dropping the rest). PER-ROUTE ERROR RATIO: `sum(rate(http_requests_total{status=~"5.."}[5m])) by (route) / sum(rate(http_requests_total[5m])) by (route)` → for each route, (5xx req/s) ÷ (total req/s). A dashboard panel = this expression over time; an alert = this expression `> 0.02`. RECORDING RULES: pre-compute an expensive / frequently-used expression on a SCHEDULE and store the result as a NEW series, so dashboards + alerts read a CHEAP pre-aggregated series instead of recomputing a heavy query on every refresh (e.g. `job:http_error_ratio:5m` evaluated every 30s). PULL (Prometheus): each app exposes `GET /metrics` (a text page of all its counters/gauges/histograms); a central server DISCOVERS targets (k8s / service discovery / static) and SCRAPES each every 15-60s. PROS: the scrape doubles as a LIVENESS check (a dead target visibly goes "down"); targets discovered dynamically; the app buffers/ships nothing. CONS: the server needs network reachability to EVERY target. PUSH (StatsD / OTLP / Pushgateway): the app SENDS metrics to a collector. MUST PUSH FOR: short-lived jobs (a cron/batch that exits before any scrape — push a duration + a `last_success_timestamp`, alert on staleness); serverless (torn down before a scrape interval — OTLP exporter or the provider\'s native metrics); workloads behind a NAT / in another account/VPC (no inbound path for the scraper). CONS: the collector is a bottleneck + SPOF; a dead app is SILENT (vs a pull target visibly failing). EXPORTERS: a process that translates something\'s native stats into `/metrics` — `node_exporter` (host), cAdvisor (containers), `postgres_exporter`, `blackbox_exporter` (probes a URL/TCP/DNS FROM OUTSIDE), `kube-state-metrics` (k8s object state).',
        hintHi: 'QUERY PATTERN — lagbhag har useful query `AGGREGATE( RATE( counter[window] ) ) by (jo labels rakhna hai)`. PER-ROUTE ERROR RATIO: `sum(rate(http_requests_total{status=~"5.."}[5m])) by (route) / sum(rate(http_requests_total[5m])) by (route)`. RECORDING RULES: ek expensive expression ko ek SCHEDULE par pre-compute karके ek NAYI series ke roop mein store — dashboards + alerts ek CHEAP pre-aggregated series padhते hain. PULL (Prometheus): app `GET /metrics` expose karती hai; server SCRAPES har 15-60s. PROS: scrape ek LIVENESS check hai; dynamic discovery. CONS: har target tak reachability chahिए. PUSH: MUST PUSH FOR: short-lived jobs, serverless, NAT ke peeche workloads. CONS: collector bottleneck + SPOF; dead app SILENT. EXPORTERS: `node_exporter`, cAdvisor, `postgres_exporter`, `blackbox_exporter`, `kube-state-metrics`.',
      },
      {
        task: 'In a comment, explain cardinality (the series-count formula), list safe vs dangerous labels, describe a cardinality-explosion timeline, and give the guardrails.',
        taskHi: 'Ek comment mein, cardinality samjhao.',
        hint: 'CARDINALITY = the number of DISTINCT time series. SERIES COUNT for a metric = (distinct values of label A) × (distinct values of label B) × (distinct values of label C) × ... SAFE labels (bounded + small): `method` (~5), `status` (~6), `route` (~30-100 IF templated as `/users/:id`), `region` (~5), `env` (~3) → a few thousand series, fine. DANGEROUS labels (UNBOUNDED — grow with users / requests / time): `user_id`, `request_id`, `session_id`, `email`, `trace_id`, IP address, un-templated URL path (`/users/8813/orders/4471` recorded literally = its own series), error MESSAGE (free text), `timestamp`. Adding ONE dangerous label MULTIPLIES the series count by its cardinality. TIMELINE of an explosion (a PR adds `customer_id`, ~250k values, to a ~9,600-series metric → ~2.4 BILLION series): T+0 deploy; T+8min Prometheus memory 12→34 GB, GC thrashing, scrape 2s→45s; T+14min OOM-killed → restart → replays WAL slowly → OOM again → CRASH LOOP; T+15min ALL dashboards blank, ALL alerts "unknown" (incl. the page-worthy ones) → flying blind; T+40min someone reverts the PR but Prometheus STILL crash-loops on the STORED high-card data → must delete the TSDB block / force compaction → ~2h total recovery. GUARDRAILS: (1) TEMPLATIZE route labels (`/users/:id` = 1 series, not 1 per user); (2) put high-cardinality dimensions in TRACES / WIDE EVENTS, never metric labels (Lesson 1); (3) a per-scrape `sample_limit` (e.g. 50000) → a target emitting too many series is REFUSED, not allowed to poison the whole TSDB; (4) `metric_relabel_configs` with `action: labeldrop` on a regex of banned label names (`customer_id|user_id|request_id|trace_id|session_id`); (5) an ALERT on `scrape_samples_scraped` per target (or `prometheus_tsdb_symbol_table_size_bytes`) trending up FAST → "cardinality growing, investigate NOW" — catch it BEFORE the OOM.',
        hintHi: 'CARDINALITY = DISTINCT time series ki number. SERIES COUNT = (label A ke distinct values) × (label B ke) × ... SAFE labels (bounded + small): `method` (~5), `status` (~6), `route` (~30-100 AGAR templated), `region`, `env` → kuch hazaar series. DANGEROUS labels (UNBOUNDED): `user_id`, `request_id`, `session_id`, `email`, `trace_id`, IP, un-templated URL path, error MESSAGE, `timestamp`. EK dangerous label series count ko iski cardinality se MULTIPLY karता hai. TIMELINE (PR `customer_id` ~250k values add karता hai → ~2.4B series): T+0 deploy; T+8min memory 12→34 GB; T+14min OOM → CRASH LOOP; T+15min SAARE dashboards blank, alerts "unknown" → flying blind; T+40min revert PAR Prometheus STILL crash-loop STORED data par → TSDB block delete → ~2h recovery. GUARDRAILS: (1) route labels TEMPLATIZE; (2) high-cardinality → TRACES/EVENTS; (3) per-scrape `sample_limit`; (4) `metric_relabel_configs` `labeldrop`; (5) `scrape_samples_scraped` trending up par ALERT.',
      },
    ],

    keyTakeaways: [
      'A METRIC = a name + LABELS + a value over time; each unique label-value combination is one TIME SERIES. COUNTER (only increases, resets on restart — NEVER read raw, read `rate()`/`increase()` — requests, errors, bytes). GAUGE (up and down, current value meaningful — queue depth, memory, replicas). HISTOGRAM (observations into pre-defined buckets — compute ANY quantile at query time AND aggregate across instances). SUMMARY (client-side quantiles — accurate per-instance, CANNOT aggregate across instances).',
      'PREFER A HISTOGRAM over a summary for anything aggregated across instances (≈ everything): you cannot average per-instance p99s (`avg` of 39 healthy + 1 on-fire pod ≈ 0.3s and hides the bad pod). A histogram works because BUCKET COUNTS ARE ADDITIVE — `histogram_quantile(0.99, sum(rate(...bucket[5m])) by (le))` sums the buckets first, then computes the true fleet quantile.',
      'THE QUERY PATTERN: `AGGREGATE( RATE( counter[window] ) ) by (labels to keep)` — e.g. per-route error ratio = `sum(rate(...{status=~"5.."}[5m])) by (route) / sum(rate(...[5m])) by (route)`. RECORDING RULES pre-compute expensive/common expressions on a schedule so dashboards + alerts read a cheap pre-aggregated series.',
      'PULL (Prometheus scrapes `/metrics` every 15-60s) — the scrape doubles as a liveness check, dynamic discovery, no app buffering; needs reachability to every target. PUSH (StatsD/OTLP/Pushgateway) — MUST use for short-lived jobs (push a `last_success_timestamp`, alert on staleness), serverless, and workloads behind a NAT; the collector is a SPOF and a dead app is silent. EXPORTERS translate native stats to `/metrics` (node_exporter, cAdvisor, blackbox_exporter probes from outside).',
      'CARDINALITY (the count of distinct series) is the #1 way metrics systems fall over. SERIES COUNT = the product of each label\'s distinct-value count. A single UNBOUNDED label (user_id, request_id, trace_id, un-templated URL, IP, error message, timestamp) multiplies thousands of series into billions → the metrics DB OOM-loops → ALL dashboards + alerts go dark for hours (a revert isn\'t enough). GUARDRAILS: templatize route labels, keep high-cardinality in traces/events, a per-scrape `sample_limit`, a `labeldrop` allowlist, and an alert on samples-scraped trending up.',
    ],
    keyTakeawaysHi: [
      'EK METRIC = ek name + LABELS + ek value time ke over; har unique label-value combination ek TIME SERIES. COUNTER (sirf increases, restart par reset — KABHI raw nahi, `rate()`/`increase()` padho). GAUGE (upar aur neeche, current value meaningful). HISTOGRAM (observations pre-defined buckets mein — query time par KOI bhi quantile AUR instances ke across aggregate). SUMMARY (client-side quantiles — per-instance accurate, instances ke across aggregate NAHI kar sakte).',
      'Ek SUMMARY ke over ek HISTOGRAM PREFER karo kisi bhi cheez ke liye jo instances ke across aggregated hai: aap per-instance p99s ko average nahi kar sakte (`avg` of 39 healthy + 1 on-fire ≈ 0.3s aur bad pod chupaता hai). Ek histogram kaam karता hai kyunki BUCKET COUNTS ADDITIVE hain — pehle sum, phir true fleet quantile.',
      'QUERY PATTERN: `AGGREGATE( RATE( counter[window] ) ) by (labels)` — e.g. per-route error ratio = `sum(rate(...{status=~"5.."}[5m])) by (route) / sum(rate(...[5m])) by (route)`. RECORDING RULES expensive/common expressions ko ek schedule par pre-compute karti hain.',
      'PULL (Prometheus har 15-60s `/metrics` scrape karता hai) — scrape ek liveness check hai, dynamic discovery; har target tak reachability chahिए. PUSH (StatsD/OTLP/Pushgateway) — short-lived jobs (ek `last_success_timestamp` push karo, staleness par alert), serverless, aur NAT ke peeche workloads ke liye MUST use. EXPORTERS native stats ko `/metrics` mein translate karते hain.',
      'CARDINALITY (distinct series ki count) #1 way hai metrics systems fall over. SERIES COUNT = har label ke distinct-value count ka product. Ek single UNBOUNDED label (user_id, request_id, trace_id, un-templated URL, IP, error message, timestamp) hazaron series ko billions mein multiply karता hai → metrics DB OOM-loop → SAARE dashboards + alerts ghanton ke liye andhere (ek revert kaafi nahi). GUARDRAILS: route labels templatize, high-cardinality traces/events mein, ek per-scrape `sample_limit`, ek `labeldrop` allowlist, aur samples-scraped trending up par ek alert.',
    ],
  },
];
