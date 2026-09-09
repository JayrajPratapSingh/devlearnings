import type { CourseLesson } from './course-js-module1';

// DevOps Module 17 — Reliability Engineering, Capacity & DR (part 2 of 2). L1-3 in course-devops-module17.ts.
// `# VERIFY` examples:
//   L4 - `k6 inspect <script>` (k6 v2.2.0, offline): parses + validates a load script,
//        prints the resolved scenario/threshold config as JSON, exit 0; a broken script
//        prints `level=error msg=...` and exits 107.
//   L5, L6 - prose + realistic hand-run output (chaos experiments and DR drills need
//        live infrastructure; the reasoning is what matters).

export const DEVOPS_MODULE_17_PART2: CourseLesson[] = [
  {
    slug: 'ops-load-and-stress-testing',
    title: 'Load & Stress Testing: Finding the Knee',
    titleHi: 'Load Aur Stress Testing: Knee Dhoondhna',
    description:
      'The difference between load, stress, soak, and spike tests; the open vs closed workload models and why the choice changes your results; think time and Little\'s law; ramp profiles; the "knee" where response time stops being flat and explodes; and validating a k6 script offline with k6 inspect.',
    descriptionHi:
      'Load, stress, soak, aur spike tests ke beech farak; open vs closed workload models aur kyun choice aapke results badalती hai; think time aur Little\'s law; ramp profiles; wo "knee" jahaan response time flat hona band karता hai aur explode karता hai; aur ek k6 script ko k6 inspect ke saath offline validate karना.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Testing how many people a footbridge can carry.** A *load test* walks a known, steady crowd across and measures the sway — does it stay within spec at the expected rush-hour number? A *stress test* keeps adding people until something gives, to learn where the limit actually is and how it fails — does it sag gracefully or crack all at once? A *soak test* parks the design crowd on it for two days to see if a slow bolt-loosening or a hairline crack shows up that a ten-minute test would miss. A *spike test* sends a marching band charging on in one second. And the "knee" is the load at which one more person stops adding a little sway and starts adding a lot — the bridge was fine at 200 and fine at 500 and came apart at 520.',
      hi: '**Test karना ki ek footbridge kitne log carry kar sakता hai.** Ek *load test* ek known, steady crowd ko across walk karता hai aur sway measure karता hai — kya ye expected rush-hour number par spec ke andar rehता hai? Ek *stress test* log add karता rehता hai jab tak kuch nahi girता, ye seekhने ke liye ki limit actually kahaan hai aur ye kaise fail hoती hai. Ek *soak test* design crowd ko do din ke liye park karता hai. Ek *spike test* ek marching band ko ek second mein charging bhejता hai. Aur "knee" wo load hai jispar ek aur person thoda sway add karna band karता hai aur bahut add karna shuru karता hai.',
    },

    simple: `**FOUR SHAPES OF TEST — same tool, different question:**
\`\`\`
LOAD    hold a REALISTIC steady rate (expected peak, or peak x1.5) for 10-30 min.
        Q: do we meet our latency/error SLO at the load we expect? capacity headroom?
STRESS  ramp the rate UP AND UP past the limit until something breaks.
        Q: WHERE is the limit? HOW does it fail - graceful (429s, slower) or cliff
           (crash, OOM, cascade)? does it RECOVER when load drops?
SOAK    hold a normal load for HOURS-DAYS.  (a.k.a. endurance)
        Q: memory leaks? fd leaks? disk fill? connection-pool creep? log-rotation?
           a slow degradation a short test never sees.
SPIKE   jump from ~0 to a huge rate in seconds, hold briefly, drop.
        Q: cold caches, autoscaler lag, connection storms, thundering herds - does
           the system survive the transient and settle, or fall over?
\`\`\`

**OPEN vs CLOSED workload model — this changes your numbers:**
\`\`\`
CLOSED  a fixed pool of N virtual users. each: request -> wait for response ->
        think -> repeat. if the server slows, the VUs just loop slower ->
        offered load DROPS. models a fixed number of users / a connection pool.
        k6: 'constant-vus' / 'ramping-vus'.
OPEN    requests ARRIVE at a set rate regardless of whether earlier ones finished.
        if the server slows, requests PILE UP - this is what a real internet-facing
        service sees, and it's how you find the cliff. k6: 'constant-arrival-rate'
        / 'ramping-arrival-rate'.
=> a CLOSED test hides overload (it self-throttles). test the cliff with an OPEN model.
\`\`\`

**THINK TIME & Little's law:**
\`\`\`
real users pause between actions - include think time (sleep) or your N VUs
generate 10x the load N real users would.
Little's law:  L = X * R    (concurrency = throughput x response time)
  closed model throughput:  X = N / (R + Z)      Z = think time
  -> 100 VUs, R=200ms, Z=1s  ->  X = 100/1.2 = ~83 req/s   (NOT "100 req/s")
\`\`\`

**RAMP PROFILE — never start at full load:**
\`\`\`
stages: [ ramp 0->target over 2m,  hold target 5m,  ramp ->0 over 2m ]
the ramp lets autoscaling / JIT / cache warm-up happen; the hold is where you read
the numbers; a sudden start measures cold-start, not steady state (unless that's a spike test).
\`\`\`

**THE KNEE (a.k.a. the point of congestion collapse):**
\`\`\`
plot response time (y) vs offered load (x).
  low load:   R is ~flat (queueing is negligible)
  near capacity: R rises - M/M/1:  R = S / (1 - rho) ,  rho = load/capacity
  at rho -> 1: R goes vertical. 90% -> 20ms, 98% -> 100ms, 100% -> seconds.
the KNEE is where flat becomes vertical. run BELOW it. that gap is your headroom.
throughput past the knee often DROPS (goodput collapse - Module 17 L3 load shedding).
\`\`\`

**METRICS TO READ:** p50/p95/p99/p99.9 (never the mean), error rate, throughput
(req/s actually completed = goodput), and the SATURATION signal (CPU, pool usage,
queue depth) that hits 100% first - that's your bottleneck.`,

    simpleHi: `**TEST KI CHAAR SHAPES — same tool, alag sawaal:**
\`\`\`
LOAD    ek REALISTIC steady rate (expected peak, ya peak x1.5) 10-30 min hold karो.
        Q: kya hum apna latency/error SLO expected load par meet karते hain? headroom?
STRESS  rate UP aur UP ramp karो limit ke past jab tak kuch nahi tootता.
        Q: limit KAHAAN hai? ye KAISE fail hoती hai - graceful (429s) ya cliff (crash)?
           kya ye RECOVER karता hai jab load girता hai?
SOAK    ek normal load GHANTON-DINON ke liye hold karो.
        Q: memory leaks? fd leaks? disk fill? pool creep? ek slow degradation.
SPIKE   ~0 se ek huge rate mein seconds mein jump, briefly hold, drop.
        Q: cold caches, autoscaler lag, connection storms - kya system survive karता hai?
\`\`\`

**OPEN vs CLOSED workload model — ye aapke numbers badalता hai:**
\`\`\`
CLOSED  N virtual users ka ek fixed pool. har ek: request -> response wait ->
        think -> repeat. agmar server slow hota hai, VUs bas slower loop karते hain ->
        offered load GIRता hai. k6: 'constant-vus' / 'ramping-vus'.
OPEN    requests ek set rate par ARRIVE karते hain chahे pichhle finish hue ya nahi.
        agmar server slow hota hai, requests PILE UP - ye wo hai jo ek real
        internet-facing service dekhता hai. k6: 'constant-arrival-rate'.
=> ek CLOSED test overload chhupाता hai (self-throttles). cliff ko ek OPEN model se test karो.
\`\`\`

**THINK TIME & Little's law:**
\`\`\`
real users actions ke beech pause karते hain - think time (sleep) include karो ya
aapke N VUs 10x load generate karengे jo N real users karते.
Little's law:  L = X * R    (concurrency = throughput x response time)
  closed model throughput:  X = N / (R + Z)      Z = think time
  -> 100 VUs, R=200ms, Z=1s  ->  X = 100/1.2 = ~83 req/s   ("100 req/s" NAHI)
\`\`\`

**RAMP PROFILE — kabhi full load par start mat karो:**
\`\`\`
stages: [ ramp 0->target over 2m,  hold target 5m,  ramp ->0 over 2m ]
ramp autoscaling / JIT / cache warm-up hone deता hai; hold jahaan aap numbers padhते ho.
\`\`\`

**THE KNEE (a.k.a. congestion collapse ka point):**
\`\`\`
response time (y) vs offered load (x) plot karो.
  low load:   R ~flat hai
  near capacity: R rise karता hai - M/M/1:  R = S / (1 - rho) ,  rho = load/capacity
  rho -> 1 par: R vertical ho jaता hai. 90% -> 20ms, 98% -> 100ms, 100% -> seconds.
KNEE wo hai jahaan flat vertical banता hai. iske NEECHE run karो. wo gap aapka headroom hai.
\`\`\`

**PADHNE WALE METRICS:** p50/p95/p99/p99.9 (kabhi mean nahi), error rate, throughput
(req/s actually completed = goodput), aur SATURATION signal (CPU, pool, queue depth)
jo 100% pehle hit karता hai - wo aapka bottleneck hai.`,

    content: `## Four shapes of test

The same load-generation tool answers four different questions depending on how you drive it. A **load test** holds a realistic steady request rate — your expected peak, or peak times a safety factor like 1.5 — for ten to thirty minutes, and asks whether you meet your latency and error objectives at that load and how much headroom remains. A **stress test** ramps the rate up and up past the limit until something breaks, and asks where the limit is, how the system fails when it gets there — gracefully with 429s and rising latency, or off a cliff with a crash or a cascade — and whether it recovers once load drops. A **soak test**, also called an endurance test, holds a normal load for hours or days and looks for slow degradations a short test never sees: memory leaks, file-descriptor leaks, disk filling with logs, connection-pool creep. A **spike test** jumps from near zero to a very high rate within seconds, holds briefly, and drops, exercising cold caches, autoscaler lag, connection storms, and thundering herds to see whether the system survives the transient and settles.

## Open versus closed workload models

This distinction changes your numbers, and getting it wrong invalidates the test. In a **closed model** there is a fixed pool of N virtual users, and each user loops: send a request, wait for the response, think for a while, repeat. If the server slows down, the virtual users simply complete fewer loops per minute, so the offered load automatically drops. This models a fixed population of users or a bounded connection pool. In an **open model**, requests arrive at a configured rate regardless of whether earlier requests have finished; if the server slows down, requests pile up in the queue. This is what a real internet-facing service experiences, and it is the only way to observe congestion collapse, because the closed model self-throttles away from the cliff you are trying to find. In k6 the closed executors are \`constant-vus\` and \`ramping-vus\`; the open executors are \`constant-arrival-rate\` and \`ramping-arrival-rate\`. Use an arrival-rate executor when you want to find the breaking point.

## Think time and Little's law

Real users pause between actions, and if your script does not model that pause with a sleep, then N virtual users generate far more load than N real users would. Little's law relates the three quantities: L = X × R, where L is the number of requests concurrently in the system, X is throughput, and R is response time. For a closed model with think time Z, throughput is X = N / (R + Z). So a hundred virtual users with a 200-millisecond response time and a one-second think time produce about 83 requests per second, not a hundred — and if you reported "100 VUs" as if it meant 100 requests per second you would be describing a test 20 percent lighter than you think.

## Ramp profile

Never start a test at full load unless the test *is* a spike test. A normal profile has three stages: ramp from zero to the target over a couple of minutes, hold at the target for several minutes, then ramp back down. The ramp gives autoscaling, JIT compilation, and cache warm-up time to happen; the hold is the window where you actually read the numbers; a sudden start measures cold-start behaviour rather than steady state.

## The knee

Plot response time on the y-axis against offered load on the x-axis. At low load the curve is nearly flat, because queueing is negligible and each request is served almost immediately. As load approaches capacity, response time rises — a simple M/M/1 queue model gives R = S / (1 − ρ), where S is the base service time and ρ is load divided by capacity. As ρ approaches one, that expression goes to infinity: at 90 percent utilisation response time might be 20 milliseconds, at 98 percent 100 milliseconds, at 100 percent several seconds. The knee is the point where the flat part of the curve turns vertical. You run the system below the knee, and the distance between your normal operating load and the knee is your headroom. Past the knee, throughput often *drops* rather than plateauing, because the system spends its resources on queue management, context switching, and requests that will time out before completing — this is goodput collapse, and it is why load shedding (Module 17 Lesson 3) exists.

## Metrics to read

Report percentiles — p50, p95, p99, p99.9 — never the mean, because the mean hides the tail where your worst user experiences live (Module 15). Report the error rate. Report throughput as requests per second actually *completed*, which is goodput, not requests per second sent. And watch the saturation signals — CPU, connection-pool usage, queue depth, thread-pool occupancy — to see which one reaches 100 percent first, because that is your bottleneck and the thing to fix or scale.`,

    contentHi: `## Test ki chaar shapes

Wahi load-generation tool chaar alag sawaalon ka jawaab deता hai depending on kaise aap ise drive karते ho. Ek **load test** ek realistic steady request rate hold karता hai — aapka expected peak, ya peak times ek safety factor jaise 1.5 — das se tees minute ke liye, aur poochहता hai kya aap apne latency aur error objectives us load par meet karते ho. Ek **stress test** rate up aur up ramp karता hai limit ke past jab tak kuch nahi tootता, aur poochहता hai limit kahaan hai, system kaise fail hoती hai jab ye wahaan pahunchता hai, aur kya ye recover karता hai jab load girता hai. Ek **soak test** ek normal load ghanton ya dinon ke liye hold karता hai aur slow degradations dhoondhता hai. Ek **spike test** near zero se ek bahut high rate mein seconds ke andar jump karता hai.

## Open versus closed workload models

Ye distinction aapke numbers badalता hai. Ek **closed model** mein N virtual users ka ek fixed pool hai, aur har user loop karता hai: ek request bhejो, response wait karो, thodi der think karो, repeat. Agmar server slow hota hai, virtual users bas kam loops complete karते hain, to offered load automatically girता hai. Ek **open model** mein, requests ek configured rate par arrive karते hain chahे pichhle requests finish hue ya nahi; agmar server slow hota hai, requests queue mein pile up hoते hain. Ye wo hai jo ek real internet-facing service experience karता hai, aur ye congestion collapse observe karने ka ekmatra tareeka hai. k6 mein closed executors \`constant-vus\` aur \`ramping-vus\` hain; open executors \`constant-arrival-rate\` aur \`ramping-arrival-rate\` hain.

## Think time aur Little's law

Real users actions ke beech pause karते hain, aur agmar aapka script us pause ko ek sleep se model nahi karता, to N virtual users N real users se kahीं zyada load generate karते hain. Little's law teen quantities relate karता hai: L = X × R. Think time Z ke saath ek closed model ke liye, throughput X = N / (R + Z) hai. To ek sau virtual users ek 200-millisecond response time aur ek one-second think time ke saath लगभग 83 requests per second produce karते hain, ek sau nahi.

## Ramp profile

Kabhi ek test full load par start mat karो jab tak test ek spike test *na* ho. Ek normal profile ke teen stages hain: zero se target tak ramp karो, target par hold karो, phir wापas ramp down karो. Ramp autoscaling, JIT compilation, aur cache warm-up ko hone ka time deता hai; hold wo window hai jahaan aap actually numbers padhते ho.

## The knee

Response time ko y-axis par offered load ke against x-axis par plot karो. Low load par curve लगभग flat hai. Jaise load capacity ke paas aata hai, response time rise karता hai — ek simple M/M/1 queue model R = S / (1 − ρ) deता hai. Jaise ρ ek ke paas aata hai, wo expression infinity ki taraf jaता hai: 90 percent utilisation par response time 20 milliseconds ho sakता hai, 98 percent par 100 milliseconds, 100 percent par kai seconds. Knee wo point hai jahaan curve ka flat part vertical ho jaता hai. Aap system ko knee ke neeche run karते ho, aur aapke normal operating load aur knee ke beech ki doori aapka headroom hai.

## Padhne wale metrics

Percentiles report karो — p50, p95, p99, p99.9 — kabhi mean nahi. Error rate report karो. Throughput ko requests per second actually *completed* ke roop mein report karो, jo goodput hai. Aur saturation signals watch karो — CPU, connection-pool usage, queue depth — ye dekhने ke liye ki konsa 100 percent pehle pahunchता hai, kyunki wo aapka bottleneck hai.`,

    examples: [
      {
        title: 'k6 inspect: validate a ramping load script offline before you run it',
        titleHi: 'k6 inspect: ek ramping load script ko run karने se pehle offline validate karो',
        code: `# VERIFY
cat > load.js <<'JS'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ramp_load: {
      executor: 'ramping-vus',          // CLOSED model - fixed VU pool
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },  // ramp up (warm caches, autoscale)
        { duration: '5m', target: 100 },  // hold - read the numbers here
        { duration: '2m', target: 0 },    // ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.01'],    // <1% errors or the test FAILS
    http_req_duration: ['p(95)<500'],    // p95 under 500ms or the test FAILS
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);                              // <-- think time: without it, 100 VUs != 100 req/s
}
JS

# parse + resolve the config WITHOUT sending a single request (projecting the
# fields we care about; k6 also prints ~50 other keys, all null by default):
k6 inspect load.js | python -c "import json,sys; d=json.load(sys.stdin); s=d['scenarios']['ramp_load']; print(json.dumps({'scenarios':{'ramp_load':{k:s[k] for k in ('executor','startVUs','stages','gracefulRampDown')}},'thresholds':d['thresholds']}, indent=2))"
echo "exit: $?"

# a script with a syntax error is caught HERE, not 5 minutes into a run:
echo 'export default function () { http.get( }' > bad.js
k6 inspect bad.js >/dev/null 2>err.txt ; echo "exit: $?"
grep -c 'level=error' err.txt`,
        output: `{
  "scenarios": {
    "ramp_load": {
      "executor": "ramping-vus",
      "startVUs": 0,
      "stages": [
        {
          "duration": "2m0s",
          "target": 100
        },
        {
          "duration": "5m0s",
          "target": 100
        },
        {
          "duration": "2m0s",
          "target": 0
        }
      ],
      "gracefulRampDown": "30s"
    }
  },
  "thresholds": {
    "http_req_duration": [
      "p(95)<500"
    ],
    "http_req_failed": [
      "rate<0.01"
    ]
  }
}
exit: 0
exit: 107
1`,
        explain: 'k6 inspect parses a load script, resolves the full scenario and threshold configuration, and prints it as JSON without generating any load — so you can confirm the test does what you intend before committing a machine and thirty minutes to running it. Here it confirms the script uses a `ramping-vus` executor (a closed model — a fixed pool of virtual users, appropriate for a "does our expected peak meet SLO" load test but not for finding the cliff), a three-stage profile that ramps up over two minutes, holds for five, and ramps down, and two thresholds that will fail the test if the error rate exceeds one percent or p95 latency exceeds 500 milliseconds. The `sleep(1)` in the default function is the think time: without it, a hundred virtual users would hammer the target back-to-back and generate far more than a hundred requests per second, so the test would not represent a hundred real users. The second invocation shows the other reason to run inspect in CI: a script with a syntax error is rejected immediately with a non-zero exit code and a `level=error` line naming the line, rather than failing partway through a live run after you have already generated traffic.',
        explainHi: 'k6 inspect ek load script parse karता hai, poori scenario aur threshold configuration resolve karता hai, aur ise JSON ke roop mein print karता hai bina koi load generate kiye — to aap confirm kar sakते ho ki test wahi karता hai jo aap chahते ho, ek machine aur tees minute run karने ke liye commit karने se pehle. Yahaan ye confirm karता hai ki script ek `ramping-vus` executor use karता hai (ek closed model — virtual users ka ek fixed pool, ek "kya hamara expected peak SLO meet karता hai" load test ke liye appropriate par cliff dhoondhने ke liye nahi), ek teen-stage profile jo do minute ramp up karता hai, paanch hold karता hai, aur ramp down karता hai, aur do thresholds jo test fail karengे agar error rate ek percent se zyada ya p95 latency 500 milliseconds se zyada hai. `sleep(1)` think time hai. Doosra invocation CI mein inspect run karने ka doosra reason dikhाता hai: ek syntax error wale script ko turant ek non-zero exit code ke saath reject kiya jaता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a "load test" that can never find overload: a closed model with no think time
  export const options = { vus: 500, duration: '10m' };   // 500 fixed VUs
  export default function () {
    http.get('https://api.example.com/checkout');           // no sleep()
  }
  # results: "p95 = 180ms, 0 errors, 2,800 req/s - we're fine!"
  # reality: the server slowed to 180ms, so each VU only managed ~5.6 req/s, so the
  # offered load SELF-THROTTLED to 2,800. you never pushed past capacity. the closed
  # model backed off exactly when it got interesting. and with no think time, those
  # 2,800 req/s came from 500 back-to-back loopers, nothing like 500 real users.`,
        right: `# find the cliff with an OPEN model; model real users with think time
  export const options = {
    scenarios: {
      find_the_knee: {
        executor: 'ramping-arrival-rate',   // OPEN - requests arrive regardless
        startRate: 200, timeUnit: '1s',
        preAllocatedVUs: 200, maxVUs: 3000, // k6 adds VUs to sustain the rate
        stages: [
          { duration: '3m', target: 200 },
          { duration: '3m', target: 1000 },  // keep raising the arrival rate
          { duration: '3m', target: 2000 },  // until p99 / errors explode
          { duration: '3m', target: 3000 },
        ],
      },
    },
  };
  export default function () {
    http.get('https://api.example.com/checkout');
    sleep(Math.random() * 2 + 1);           // 1-3s think time per iteration
  }
  # now: when the server slows, requests PILE UP, maxVUs climbs, and you SEE the
  # knee - the arrival rate where p99 goes vertical and goodput stops rising.`,
        why: 'A closed-model test with no think time cannot find the overload point, which is usually the entire reason for running a stress test. In a closed model each virtual user waits for its response before sending the next request, so when the server slows down under load the virtual users slow down with it and the offered load automatically decreases — the test backs away from the limit at exactly the moment the limit becomes visible, and reports a comfortable-looking result that only describes the equilibrium the closed loop settled into. To observe congestion collapse you need an open model, where requests arrive at a rate you control regardless of whether earlier requests have completed, so that when the server slows the queue grows and you can watch response time go vertical and goodput stop rising as you push the arrival rate up. Separately, omitting think time means N virtual users send requests back-to-back and generate several times the load that N real users, who pause between actions, would produce — so the VU count in the report bears no relation to a number of users and cannot be used for capacity planning.',
        whyHi: 'Ek closed-model test bina think time ke overload point nahi dhoondh sakता, jo aksar ek stress test run karने ka poora reason hai. Ek closed model mein har virtual user apne response ke liye wait karता hai agla request bhejने se pehle, to jab server load ke tehat slow hota hai virtual users iske saath slow hote hain aur offered load automatically kam hota hai — test limit se piche hatता hai exactly us moment jab limit visible banती hai. Congestion collapse observe karने ke liye aapko ek open model chahिए, jahaan requests ek rate par arrive karते hain jo aap control karते ho chahे pichhle requests complete hue ya nahi. Alag se, think time omit karने ka matlab N virtual users back-to-back requests bhejते hain aur kई guna load generate karते hain jo N real users produce karते.',
      },
      {
        wrong: `# reporting the mean, and starting at full load with no ramp
  export const options = { vus: 1000, duration: '5m' };   // slams to 1000 at t=0
  // ... test runs ...
  // report: "average response time: 240ms. LGTM, ship it."
  #
  # problem 1: the first 60-90s are cold-start (empty caches, JIT not warm, no
  #   autoscaling yet). those awful numbers are averaged INTO your result, OR you
  #   eyeball past them and never write down the steady-state figure.
  # problem 2: the MEAN of 240ms can hide p99 = 4s. if 2% of checkout requests
  #   take 4 seconds, that's 1-in-50 users - the mean says nothing about them.`,
        right: `# ramp in, hold, ramp out - and report percentiles + error rate + goodput
  export const options = {
    scenarios: { steady: {
      executor: 'constant-arrival-rate',
      rate: 800, timeUnit: '1s', duration: '10m',
      preAllocatedVUs: 500, maxVUs: 2000,
      gracefulStop: '30s',
      startTime: '2m',                    // <-- 2m warm-up scenario runs first
    }, warmup: {
      executor: 'ramping-arrival-rate', startRate: 0,
      stages: [{ duration: '2m', target: 800 }],
      preAllocatedVUs: 500, maxVUs: 2000,
    }},
    thresholds: {
      http_req_duration: ['p(95)<400', 'p(99)<1000'],   // <-- percentiles, not mean
      http_req_failed:   ['rate<0.005'],
      checks:            ['rate>0.995'],
    },
  };
  # read the numbers from the 10m HOLD only. report p50/p95/p99/p99.9, error rate,
  # and completed req/s. keep the raw histogram - the mean is never enough.`,
        why: 'Two reporting errors that make a load test lie. Starting at full load with no ramp means the first minute or two of the run is cold-start behaviour — caches empty, JIT compiler not yet warm, autoscaling not yet triggered — and those numbers are either averaged into the final result, dragging it in a direction that does not reflect steady-state operation, or mentally skipped over without a disciplined record of what the steady-state figure actually was. A ramp-up stage lets all the warm-up happen before the measurement window, and you read your numbers only from the hold. Reporting the mean response time hides the tail completely: a mean of 240 milliseconds is consistent with a p99 of four seconds, and if two percent of checkout requests take four seconds that is one user in fifty having a broken experience, which the mean is mathematically incapable of revealing. Always report the percentile distribution — p50, p95, p99, p99.9 — the error rate, and the completed-request throughput, and keep the underlying histogram because any single summary statistic loses information you will later wish you had.',
        whyHi: 'Do reporting errors jo ek load test ko jhooth bolने par majboor karते hain. Full load par bina ramp ke start karने ka matlab run ka pehla minute ya do cold-start behaviour hai — caches empty, JIT compiler abhi warm nahi, autoscaling abhi trigger nahi — aur wo numbers ya to final result mein averaged hain, ise ek direction mein drag karते hain jo steady-state operation reflect nahi karता, ya mentally skip kiye jaते hain. Ek ramp-up stage saara warm-up measurement window se pehle hone deता hai. Mean response time report karना tail poori tarah chhupाता hai: 240 milliseconds ka ek mean ek four-second p99 ke saath consistent hai. Hamesha percentile distribution report karो — p50, p95, p99, p99.9 — error rate, aur completed-request throughput.',
      },
      {
        wrong: `# only ever running 10-minute load tests - never a soak
  # every release: a 10-min load test at expected peak. green. ship.
  # in production, ~40 hours after each deploy, memory climbs steadily until the
  # pod hits its limit and the OOM killer restarts it. p99 spikes on every restart.
  # the 10-min test NEVER sees it - the leak is ~4 MB/hour, invisible in 10 minutes,
  # fatal in 40 hours. same blind spot for: fd leaks, slow disk fill from logs,
  # DB connection-pool creep, a cache with no eviction, log files never rotated.`,
        right: `# add a periodic SOAK test: normal load, many hours, watch the slopes
  # nightly (or pre-release for risky changes):
  #   executor: constant-arrival-rate, rate: <expected average>, duration: '8h'
  # and instead of just pass/fail on latency, TREND these over the full run:
  #   - process RSS / heap used            -> should be flat after warm-up
  #   - open file descriptors              -> flat
  #   - DB / HTTP connection-pool in-use   -> flat, returns to baseline
  #   - disk free on the log/data volume   -> flat or slow-and-bounded
  #   - GC pause time, GC frequency        -> flat
  #   - p99 latency                        -> flat (not creeping up hour over hour)
  # a leak shows as a straight-line slope on a multi-hour plot that is simply not
  # visible in a 10-minute window. alert on the SLOPE, not the instantaneous value.`,
        why: 'A short load test and a soak test find different classes of bug, and running only the short one leaves an entire category permanently undetected. Resource leaks — memory, file descriptors, database connections, disk space consumed by logs, cache entries that are never evicted — accumulate at a rate that is imperceptible over ten minutes but fatal over the tens of hours a deployment actually runs in production between releases. A four-megabyte-per-hour heap leak is invisible in a ten-minute test and forces an OOM restart every forty hours in production, with a latency spike on every restart. The soak test holds a representative load for many hours and, crucially, trends the resource metrics over the whole run rather than checking only a pass/fail latency threshold: heap used, open file descriptors, connection-pool occupancy, disk free, and GC behaviour should all be flat after warm-up, and a leak appears as a straight-line slope that only a multi-hour window can show. The alert condition is the slope, not the instantaneous value.',
        whyHi: 'Ek short load test aur ek soak test alag classes ke bugs dhoondhते hain, aur sirf short wala run karने se ek poori category permanently undetected rehती hai. Resource leaks — memory, file descriptors, database connections, logs dwara consumed disk space, cache entries jo kabhi evict nahi hote — ek rate par accumulate hote hain jo das minute mein imperceptible hai par tens of hours mein fatal hai jo ek deployment actually production mein releases ke beech run karता hai. Ek four-megabyte-per-hour heap leak ek das-minute test mein invisible hai aur production mein har chालीस ghante ek OOM restart force karता hai. Soak test ek representative load kई ghanton ke liye hold karता hai aur, crucially, resource metrics ko poore run par trend karता hai. Alert condition slope hai, instantaneous value nahi.',
      },
    ],

    realWorld: [
      {
        en: '**The closed-model test that missed a 3x capacity shortfall** — a team load-tested checkout with 2,000 fixed VUs, no think time, saw 4,500 req/s at p95 190ms, and sized the fleet for it. Black Friday traffic was open-model; real arrivals piled up, p99 hit 12s, and autoscaling could not catch up. Re-testing with `ramping-arrival-rate` found the true knee at ~1,600 req/s per instance, not 4,500.',
        hi: '**Closed-model test jisne ek 3x capacity shortfall miss kiya** — ek team ne checkout ko 2,000 fixed VUs ke saath load-test kiya, koi think time nahi, p95 190ms par 4,500 req/s dekha, aur fleet ko iske liye size kiya. Black Friday traffic open-model tha; real arrivals pile up hue, p99 12s hit hua. `ramping-arrival-rate` ke saath re-testing ne true knee ~1,600 req/s per instance par paya.',
      },
      {
        en: '**A 6-hour soak caught what 30 CI runs missed** — a JSON library upgrade leaked ~2 MB/min under load. Every 12-minute PR load test passed. A pre-release 6-hour soak showed heap climbing on a dead-straight line to the 4 GB limit at ~3h20m; the leak was a per-request cache with no bound. Fixed before it shipped.',
        hi: '**Ek 6-hour soak ne wo pakda jo 30 CI runs ne miss kiya** — ek JSON library upgrade load ke tehat ~2 MB/min leak karता tha. Har 12-minute PR load test pass hua. Ek pre-release 6-hour soak ne heap ko ek dead-straight line par 4 GB limit tak ~3h20m par climbing dikhaya; leak ek per-request cache tha jiska koi bound nahi tha. Ship hone se pehle fix.',
      },
      {
        en: '**Spike test revealed a connection-storm self-DoS** — an API scaled fine under gradual load. A synthetic spike from 0 to 8,000 req/s in 5s showed every new pod opening 200 DB connections at once; the database hit `max_connections`, rejected everyone, and the pods crash-looped. The fix was a connection-pool warm-up delay + a lower per-pod pool cap + PgBouncer.',
        hi: '**Spike test ne ek connection-storm self-DoS reveal kiya** — ek API gradual load ke tehat theek scale hua. 5s mein 0 se 8,000 req/s ka ek synthetic spike ne har naye pod ko ek saath 200 DB connections kholte dikhaya; database ne `max_connections` hit kiya, sabko reject kiya, aur pods crash-loop hue. Fix ek connection-pool warm-up delay + ek lower per-pod pool cap + PgBouncer tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the difference between load, stress, soak, and spike tests. What does each one tell you?',
        qHi: 'Load, stress, soak, aur spike tests ke beech farak samjhाओ. Har ek aapko kya batाता hai?',
        a: 'They use the same tooling but ask different questions. A load test holds a realistic steady rate — your expected peak, or peak with a safety margin — for ten to thirty minutes and asks whether you meet your latency and error objectives at that load, and how much headroom you have above it. A stress test deliberately pushes past the limit, ramping the rate up until something breaks, and asks three things: where the limit actually is, how the system behaves when it reaches it — does it degrade gracefully by shedding load and returning 429s, or does it fall off a cliff with a crash or a cascade — and whether it recovers on its own once the load comes back down. A soak test, or endurance test, holds a normal load for many hours or days and looks for slow-accumulating problems that a short test cannot see: memory leaks, file-descriptor leaks, disk filling with logs, connection-pool creep, caches that never evict. A spike test jumps from almost nothing to a very high rate within seconds, holds briefly, then drops, and checks whether the system survives the sudden transient — cold caches, autoscaler lag, connection storms, thundering herds — and settles afterwards rather than collapsing. Load and stress are about capacity; soak is about stability over time; spike is about the transient response to a sudden change.',
        aHi: 'Wo same tooling use karते hain par alag sawaal poochहte hain. Ek load test ek realistic steady rate hold karता hai — aapka expected peak — das se tees minute ke liye aur poochहता hai kya aap apne latency aur error objectives us load par meet karते ho, aur aapke paas iske upar kitna headroom hai. Ek stress test deliberately limit ke past push karता hai, rate up ramp karता hai jab tak kuch nahi tootता, aur teen cheezein poochहता hai: limit actually kahaan hai, system kaise behave karता hai jab ye ise reach karता hai — kya ye gracefully degrade karता hai ya ek cliff se girता hai — aur kya ye apne aap recover karता hai. Ek soak test ek normal load kई ghanton ya dinon ke liye hold karता hai aur slow-accumulating problems dhoondhता hai. Ek spike test almost nothing se ek bahut high rate mein seconds ke andar jump karता hai. Load aur stress capacity ke baare mein hain; soak time ke saath stability ke baare mein; spike ek sudden change ke transient response ke baare mein.',
      },
      {
        q: 'What is the difference between an open and a closed workload model, and why does it matter which one you use?',
        qHi: 'Ek open aur ek closed workload model ke beech kya farak hai, aur kyun matter karता hai ki aap konsa use karते ho?',
        a: 'In a closed model there is a fixed number of virtual users, and each one works in a loop: send a request, wait for the response, optionally think for a while, then send the next. The key property is that a virtual user cannot send its next request until the previous one has come back, so if the server slows down, the virtual users slow down with it and the offered load falls automatically. This models a bounded population — a fixed set of users, or a connection pool of fixed size. In an open model, requests are generated at a configured arrival rate that does not depend on whether previous requests have completed; if the server slows, the requests queue up and the number of requests in flight grows. This is what a public internet-facing service actually experiences, because the internet does not wait for your server to be ready. It matters because a closed model self-throttles: as you approach capacity the load automatically backs off, so a closed-model test settles into a comfortable equilibrium and never shows you the congestion collapse you were trying to find. If your goal is to locate the knee — the load at which response time goes vertical and goodput stops rising — you must use an open model, an arrival-rate executor, so that the load keeps coming even as the system falls behind.',
        aHi: 'Ek closed model mein virtual users ki ek fixed number hai, aur har ek ek loop mein kaam karता hai: ek request bhejो, response wait karो, optionally thodi der think karो, phir agla bhejो. Key property ye hai ki ek virtual user apna agla request nahi bhej sakта jab tak pichhla wापas nahi aaya, to agmar server slow hota hai, virtual users iske saath slow hote hain aur offered load automatically girता hai. Ek open model mein, requests ek configured arrival rate par generate hote hain jo depend nahi karता ki pichhle requests complete hue ya nahi; agmar server slow hota hai, requests queue up hote hain. Ye wo hai jo ek public internet-facing service actually experience karता hai. Ye matter karता hai kyunki ek closed model self-throttles: jaise aap capacity ke paas aate ho load automatically back off karता hai. Agmar aapka goal knee locate karना hai, aapko ek open model use karना chahिए.',
      },
      {
        q: 'What is the "knee" in a load-vs-latency curve, and how do you use it for capacity planning?',
        qHi: 'Ek load-vs-latency curve mein "knee" kya hai, aur aap ise capacity planning ke liye kaise use karते ho?',
        a: 'If you plot response time against offered load, at low load the curve is nearly flat because there is almost no queueing — a request arrives, a server is free, it is handled immediately. As load rises toward the system\'s capacity, requests increasingly have to wait for a busy resource, and response time climbs. A simple queueing model captures the shape: response time is proportional to one over one-minus-utilisation, so at 80 percent utilisation latency is a few times the base service time, at 95 percent it is much higher, and as utilisation approaches 100 percent the latency goes toward infinity. The knee is the point on the curve where it stops being roughly flat and turns sharply upward. For capacity planning you establish where the knee is for your service through a stress test, then you set your target normal operating load well below it — commonly around 50 to 70 percent of the knee — so that a traffic surge, an instance failure that shifts load onto the survivors, or a latency regression from a deploy still leaves you on the flat part of the curve. The gap between your normal load and the knee is your headroom, and it is what you are buying when you run more instances than the average load strictly requires. Past the knee, throughput often falls rather than levelling off, because the system burns resources on queue management and on requests that time out before completing.',
        aHi: 'Agmar aap response time ko offered load ke against plot karते ho, low load par curve लगभग flat hai kyunki लगभग koi queueing nahi hai. Jaise load system ki capacity ki taraf rise karता hai, requests ko increasingly ek busy resource ke liye wait karना padता hai, aur response time climb karता hai. Ek simple queueing model shape capture karता hai: response time one over one-minus-utilisation ke proportional hai, to 80 percent utilisation par latency base service time ka kुछ guna hai, 95 percent par ye bahut zyada hai. Knee wo point hai jahaan ye roughly flat hona band karता hai aur sharply upward turn karता hai. Capacity planning ke liye aap ek stress test ke through establish karते ho ki knee kahaan hai, phir aap apna target normal operating load iske achhे neeche set karते ho — commonly knee ke लगभग 50 se 70 percent. Aapke normal load aur knee ke beech ka gap aapka headroom hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define load, stress, soak, and spike tests — the question each answers, the drive pattern, and what failure looks like for each.',
        taskHi: 'Ek comment mein, load, stress, soak, aur spike tests define karो.',
        hint: 'Same tool (k6 / Locust / Gatling), four questions. LOAD: hold a REALISTIC steady rate — expected peak, or peak x1.5 — for 10-30 min. Q: do we meet our latency + error SLO at the load we expect, and how much HEADROOM is there above it? Failure = an SLO threshold breached (p95 > target, error rate > target) at expected load → you are under-provisioned. STRESS: ramp the rate UP AND UP, past the limit, until something breaks. Q: WHERE is the limit (req/s per instance)? HOW does it fail — GRACEFUL (sheds load, returns 429/503, latency rises but bounded, recovers when load drops) or CLIFF (crash, OOM, deadlock, cascade, does NOT recover without a restart)? Failure of the SYSTEM (not the test) that does not self-heal is the finding. SOAK / endurance: hold a NORMAL load for HOURS-DAYS. Q: any slow-accumulating resource problem a short test cannot see — memory leak, fd leak, disk fill from logs, DB connection-pool creep, unbounded cache, GC degradation? Failure = a resource metric on a straight-line SLOPE over the multi-hour plot (e.g. heap +4 MB/hr → OOM in 40h) — alert on the SLOPE, not the instantaneous value. SPIKE: jump from ~0 to a huge rate in SECONDS, hold briefly, drop. Q: does the system survive the TRANSIENT — cold caches, autoscaler lag (it reacts in minutes, the spike is in seconds), connection storms (every new instance opens N DB conns at once), thundering herds — and SETTLE, or fall over? Failure = the spike triggers a self-inflicted outage (connection exhaustion, crash-loop) even though the same total load applied gradually is fine.',
        hintHi: 'Same tool, chaar sawaal. LOAD: ek REALISTIC steady rate — expected peak, ya peak x1.5 — 10-30 min hold karो. Q: kya hum apna latency + error SLO expected load par meet karते hain, aur kitna HEADROOM hai? Failure = ek SLO threshold breach expected load par. STRESS: rate UP aur UP ramp karो, limit ke past. Q: limit KAHAAN hai? ye KAISE fail hoती hai — GRACEFUL (sheds, 429/503, recovers) ya CLIFF (crash, OOM, cascade, restart ke bina recover NAHI)? SOAK: ek NORMAL load GHANTON-DINON hold karो. Q: koi slow resource problem — memory/fd leak, disk fill, pool creep, unbounded cache? Failure = ek resource metric ek straight-line SLOPE par — SLOPE par alert karो. SPIKE: ~0 se ek huge rate mein SECONDS mein jump. Q: kya system TRANSIENT survive karता hai — cold caches, autoscaler lag, connection storms — aur SETTLE karता hai?',
      },
      {
        task: 'In a comment, explain the open vs closed workload model, think time, and Little\'s law (L = X·R, X = N/(R+Z)), with the "100 VUs is not 100 req/s" worked number.',
        taskHi: 'Ek comment mein, open vs closed workload model, think time, aur Little\'s law samjhाओ.',
        hint: 'CLOSED model: a FIXED pool of N virtual users. Each VU loops: send request → BLOCK until response → think (sleep Z) → repeat. A VU CANNOT send its next request until the previous returns → if the server SLOWS, the VUs loop slower → offered load DROPS AUTOMATICALLY. Models a bounded population (a fixed user count, a connection pool). k6: `constant-vus`, `ramping-vus`. OPEN model: requests are generated at a configured ARRIVAL RATE, independent of whether earlier requests finished → if the server slows, requests QUEUE UP, in-flight count grows. This is what a public internet-facing service actually sees (the internet does not wait for you). k6: `constant-arrival-rate`, `ramping-arrival-rate` (k6 spins up VUs from a pool up to `maxVUs` to sustain the rate). WHY IT MATTERS: a closed model SELF-THROTTLES — as you approach capacity the load backs off, the test settles into a comfortable equilibrium, and you NEVER see congestion collapse. To find the KNEE you MUST use an OPEN model. THINK TIME (Z): real users pause between actions (read the page, fill a form). If your script has no `sleep()`, N VUs fire requests back-to-back and generate SEVERAL TIMES the load N real users would → the VU count means nothing for capacity planning. LITTLE\'S LAW: L = X · R, where L = requests concurrently in the system, X = throughput (req/s), R = response time (s). For a closed model with think time Z: X = N / (R + Z). WORKED: 100 VUs, R = 200 ms, Z = 1 s → X = 100 / (0.2 + 1.0) = 100 / 1.2 ≈ 83 req/s — NOT 100 req/s. Reporting "100 VUs" as if it were 100 req/s describes a test ~17% lighter than you think. And L = X · R = 83 · 0.2 ≈ 17 requests actually in the server at any instant.',
        hintHi: 'CLOSED model: N virtual users ka ek FIXED pool. Har VU loops: request → BLOCK jab tak response → think (sleep Z) → repeat. Ek VU apna agla request NAHI bhej sakта jab tak pichhla return nahi → server SLOW → VUs slower loop → offered load AUTOMATICALLY GIRता hai. k6: `constant-vus`, `ramping-vus`. OPEN model: requests ek configured ARRIVAL RATE par generate hote hain, independent → server slow → requests QUEUE UP. Ye wo hai jo ek internet-facing service dekhता hai. k6: `constant-arrival-rate`, `ramping-arrival-rate`. WHY: ek closed model SELF-THROTTLES → aap KABHI congestion collapse nahi dekhते. KNEE dhoondhने ke liye OPEN model chahिए. THINK TIME (Z): real users pause karते hain. Bina `sleep()`, N VUs back-to-back fire karते hain → Kई guna load. LITTLE\'S LAW: L = X · R; closed model: X = N / (R + Z). WORKED: 100 VUs, R = 200 ms, Z = 1 s → X = 100 / 1.2 ≈ 83 req/s — 100 NAHI.',
      },
      {
        task: 'In a comment, explain the knee / congestion collapse (the R = S/(1−ρ) shape), how to set a headroom target from it, why goodput drops past it, and which metrics to report from a run.',
        taskHi: 'Ek comment mein, knee / congestion collapse samjhाओ, isse ek headroom target kaise set karें, aur ek run se konse metrics report karें.',
        hint: 'THE KNEE: plot response time R (y) vs offered load (x). LOW load → R is ~FLAT: queueing is negligible, a request arrives, a server is free, it is served immediately. NEAR CAPACITY → requests wait for a busy resource, R climbs. M/M/1 model: R = S / (1 − ρ), where S = base service time, ρ = offered load / capacity (utilisation). ρ=0.5 → R = 2S; ρ=0.8 → R = 5S; ρ=0.9 → R = 10S; ρ=0.98 → R = 50S; ρ→1 → R → ∞ (VERTICAL). The KNEE is where the curve stops being ~flat and turns sharply upward (~ρ 0.7-0.85 depending on variance — more variance in arrival/service time pulls the knee LEFT). HEADROOM TARGET: stress-test to find the knee (req/s per instance), then set NORMAL operating load well below it — commonly 50-70% of the knee — so that a traffic surge + an instance failure shifting load onto survivors + a latency regression from a deploy ALL still leave you on the flat part. The gap between normal load and the knee IS your headroom — it is what you buy by running more instances than the average strictly needs. GOODPUT DROPS PAST THE KNEE: throughput does not plateau, it FALLS — the system burns CPU on queue management, context switching, and processing requests that will time out on the client before they complete (wasted work) → congestion collapse. This is why load shedding exists (Module 17 L3): reject early so the admitted requests are served well. METRICS TO REPORT FROM A RUN: p50 / p95 / p99 / p99.9 (NEVER the mean — a 240 ms mean hides a 4 s p99 = 1-in-50 users broken); error rate; THROUGHPUT as requests actually COMPLETED per second (= goodput), not requests sent; and the SATURATION signal (CPU %, connection-pool in-use, queue depth, thread-pool occupancy) that reaches 100% FIRST — that is the bottleneck to fix or scale. Keep the raw histogram — any single summary stat loses information.',
        hintHi: 'THE KNEE: R (y) vs offered load (x) plot karो. LOW load → R ~FLAT. NEAR CAPACITY → R climbs. M/M/1: R = S / (1 − ρ), ρ = load / capacity. ρ=0.9 → R = 10S; ρ=0.98 → R = 50S; ρ→1 → R → ∞. KNEE jahaan curve ~flat hona band karता hai (~ρ 0.7-0.85; zyada variance knee ko LEFT khींchता hai). HEADROOM: stress-test se knee dhoondho, phir NORMAL load ise achhे neeche set karो — 50-70% of the knee — taaki ek surge + ek instance failure + ek regression sab flat part par chhode. GOODPUT PAST THE KNEE GIRता hai — system CPU queue management aur time-out hone wale requests par burn karता hai → congestion collapse → isliye load shedding (M17 L3). METRICS: p50/p95/p99/p99.9 (mean KABHI nahi), error rate, THROUGHPUT as completed req/s (= goodput), aur wo SATURATION signal jo 100% PEHLE hit karता hai = bottleneck. Raw histogram rakhो.',
      },
    ],

    keyTakeaways: [
      'FOUR TESTS, one tool: LOAD (steady realistic rate, 10-30 min — do we meet SLO + how much headroom?), STRESS (ramp past the limit — WHERE is it, GRACEFUL or CLIFF, does it RECOVER?), SOAK (normal load for hours-days — leaks, fd/disk/pool creep, GC degradation — alert on the SLOPE), SPIKE (~0 → huge in seconds — cold caches, autoscaler lag, connection storms — survive the transient?).',
      'CLOSED model = fixed N VUs, each waits for its response before the next → offered load SELF-THROTTLES as the server slows → HIDES overload. OPEN model = requests arrive at a set rate regardless → they pile up when the server slows → this is what a real internet service sees and the ONLY way to find the cliff. k6: `*-vus` (closed) vs `*-arrival-rate` (open). Use arrival-rate to find the knee.',
      'Include THINK TIME (`sleep`) or N VUs generate several times the load of N real users. Little\'s law: L = X·R; closed-model throughput X = N/(R+Z). 100 VUs @ R=200ms, Z=1s → ~83 req/s, NOT 100. RAMP in (warm caches/JIT/autoscale), HOLD (read numbers here), ramp out — a cold start measures cold start, not steady state.',
      'THE KNEE: R ≈ S/(1−ρ), ρ = load/capacity. Flat until ~70-85% utilisation, then vertical (ρ=0.9→10·S, ρ=0.98→50·S, ρ→1→∞). Find it with a stress test; run NORMAL load at 50-70% of it so a surge + an instance loss + a deploy regression still leave you on the flat part. That gap is your HEADROOM. Past the knee, goodput DROPS (congestion collapse → why load shedding exists).',
      'REPORT percentiles (p50/p95/p99/p99.9 — NEVER the mean; a 240ms mean hides a 4s p99), error rate, and COMPLETED req/s (goodput, not sent). Watch which SATURATION signal (CPU / pool / queue depth) hits 100% first — that is the bottleneck. Validate the script offline first: `k6 inspect load.js` resolves the config as JSON (exit 0); a syntax error exits non-zero with a `level=error` line.',
    ],
    keyTakeawaysHi: [
      'CHAAR TESTS, ek tool: LOAD (steady realistic rate, 10-30 min — SLO meet + kitna headroom?), STRESS (limit ke past ramp — KAHAAN hai, GRACEFUL ya CLIFF, RECOVER karता hai?), SOAK (normal load ghanton-dinon — leaks, fd/disk/pool creep — SLOPE par alert), SPIKE (~0 → huge seconds mein — cold caches, autoscaler lag, connection storms — transient survive?).',
      'CLOSED model = fixed N VUs, har ek apne response ke liye wait karता hai → offered load SELF-THROTTLES jab server slow hota hai → overload CHHUPAता hai. OPEN model = requests ek set rate par arrive karते hain → server slow → pile up → ye wo hai jo ek real internet service dekhता hai aur cliff dhoondhने ka EKMATRA tareeka. k6: `*-vus` (closed) vs `*-arrival-rate` (open).',
      'THINK TIME (`sleep`) include karो ya N VUs N real users ka kई guna load generate karते hain. Little\'s law: L = X·R; closed-model X = N/(R+Z). 100 VUs @ R=200ms, Z=1s → ~83 req/s, 100 NAHI. RAMP in, HOLD (yahaan numbers padhो), ramp out.',
      'THE KNEE: R ≈ S/(1−ρ), ρ = load/capacity. ~70-85% utilisation tak flat, phir vertical (ρ=0.9→10·S, ρ=0.98→50·S). Ise ek stress test se dhoondho; NORMAL load ise 50-70% par run karो. Wo gap aapka HEADROOM hai. Knee ke past, goodput GIRता hai (congestion collapse).',
      'Percentiles REPORT karो (p50/p95/p99/p99.9 — mean KABHI nahi), error rate, aur COMPLETED req/s (goodput). Dekhो konsa SATURATION signal (CPU / pool / queue depth) 100% pehle hit karता hai = bottleneck. Script offline validate karो: `k6 inspect load.js` config JSON resolve karता hai (exit 0); ek syntax error non-zero exit karता hai ek `level=error` line ke saath.',
    ],
  },

  {
    slug: 'ops-chaos-engineering-and-game-days',
    title: 'Chaos Engineering & Game Days',
    titleHi: 'Chaos Engineering Aur Game Days',
    description:
      'Chaos engineering is running controlled experiments on a system to find out how it actually fails before an incident does it for you: form a hypothesis about steady state, inject a realistic failure into a small blast radius, watch whether steady state holds, and have an abort button. Plus game days — scheduled, people-in-the-room rehearsals of an incident — and how the two build the confidence that your resilience patterns actually work.',
    descriptionHi:
      'Chaos engineering ek system par controlled experiments run karना hai ye pata karने ke liye ki ye actually kaise fail hoती hai ek incident ke aapke liye karने se pehle: steady state ke baare mein ek hypothesis banाओ, ek chhote blast radius mein ek realistic failure inject karो, dekhो kya steady state holds karता hai, aur ek abort button rakhो. Plus game days — scheduled, people-in-the-room rehearsals of an incident — aur kaise ye dono wo confidence build karते hain ki aapke resilience patterns actually kaam karते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A fire drill versus discovering the fire exits are chained shut during an actual fire.** You can *assume* the building is safe — the exits are marked, the alarm is wired, the plan is on the wall. Or you can pull the alarm on a Tuesday afternoon with everyone warned, time the evacuation, and find out that the third-floor stairwell door sticks, the assembly point is a car park that fills at 5pm, and half the office never hears the alarm over their headphones. Chaos engineering is pulling the alarm on purpose, in daylight, with the fire marshals ready and a clear "this is a drill" — so that the things that would have killed you in a real fire are found while they are merely embarrassing.',
      hi: '**Ek fire drill versus ek actual fire ke dauraan fire exits ko chained shut discover karना.** Aap *maan* sakते ho ki building safe hai — exits marked hain, alarm wired hai, plan wall par hai. Ya aap ek Tuesday afternoon ko alarm pull kar sakते ho sabke warned hone ke saath, evacuation time karो, aur pata karो ki third-floor stairwell door sticks karता hai, assembly point ek car park hai jo 5pm par fill hota hai, aur aadha office alarm apne headphones ke upar kabhi nahi sunता. Chaos engineering purpose par alarm pull karना hai, daylight mein, fire marshals ready ke saath.',
    },

    simple: `**CHAOS ENGINEERING IS AN EXPERIMENT, not "randomly break things in prod".**
The scientific-method shape:
\`\`\`
1. STEADY STATE  - define it as a MEASURABLE output, not an internal metric.
   "checkout success rate >= 99.5% and p99 < 800ms"  (a business-level SLI)
2. HYPOTHESIS     - "if we kill one of the 3 payment-service pods, steady state
   still holds" (because we have N+1 and the LB reroutes).
3. BLAST RADIUS   - the SMALLEST test that could disprove the hypothesis.
   start: 1 pod, 1% of traffic, a staging clone, business hours, team watching.
4. INJECT         - one realistic failure: kill a pod / add 200ms latency /
   drop a dependency / fill a disk / burn CPU / partition the network / expire a cert.
5. OBSERVE        - did steady state hold? did the alerts fire? did the runbook work?
   how long to detect, to mitigate, to recover?
6. ABORT          - a big red button that instantly removes the fault. ALWAYS have it.
7. LEARN & EXPAND - fix what broke. THEN widen the blast radius (more traffic,
   prod, off-hours, bigger fault). automate it as a regression test.
\`\`\`

**WHY** — you have resilience patterns (Lesson 2: timeouts, retries, breakers,
fallbacks; Lesson 1: redundancy). Chaos engineering is how you find out whether
they ACTUALLY work, because:
\`\`\`
- the timeout is set... but is it set on THAT client? (often one is missed)
- the retry has backoff... but does it also have a budget? (often not)
- the replica exists... but does failover actually complete in <30s? (often not)
- the fallback is coded... but has that code path EVER run in prod? (usually not)
- the alert is defined... but does it fire, reach a human, and have a runbook?
"hope is not a strategy." an untested failover is not a failover.
\`\`\`

**COMMON FAULTS TO INJECT (roughly increasing risk):**
\`\`\`
resource:     CPU burn, memory pressure, disk fill, disk-IO slowdown
network:      added latency, packet loss, DNS failure, a partition, bandwidth cap
dependency:   kill/black-hole a downstream service, a slow database, a poisoned cache
platform:     kill a pod / node / AZ, roll a deploy back, expire a TLS cert / token
state:        clock skew, a full message queue, a read-replica lag spike
\`\`\`

**GAME DAY** — a SCHEDULED, announced exercise where the team responds to an
injected (or tabletop / simulated) incident as if it were real:
\`\`\`
- practises the HUMAN side: who's on call, is the runbook findable, do the dashboards
  answer the question, can we actually roll back, who declares an incident, comms.
- reveals: stale runbooks, missing access, a dashboard that 404s, a pager that
  goes to someone who left, a "break glass" procedure nobody has done.
- blameless. the artefacts are action items, not blame. run them quarterly.
- GameDay != chaos experiment: a game day is people-centric and scheduled; a chaos
  experiment is system-centric and can be continuous/automated. they complement.
\`\`\`

**MATURITY LADDER:** tabletop ("what would happen if...") -> a manual experiment in
staging with the team watching -> automated experiments in staging in CI -> controlled
experiments in prod, business hours, small blast radius -> continuous, automated,
prod (e.g. always-on pod termination). Do NOT start at the last rung.

**AWS FIS** (Fault Injection Service) runs experiments against EC2/ECS/EKS/RDS with
stop-conditions wired to CloudWatch alarms. **Azure Chaos Studio** does the same for
Azure resources with faults as ARM templates. Both give you the abort/stop-condition
machinery so a runaway experiment self-halts. Open source: LitmusChaos, Chaos Mesh
(k8s), Toxiproxy (network faults), Gremlin (commercial).`,

    simpleHi: `**CHAOS ENGINEERING EK EXPERIMENT HAI, "randomly prod mein cheezein todो" nahi.**
Scientific-method shape:
\`\`\`
1. STEADY STATE  - ise ek MEASURABLE output ke roop mein define karो, ek internal metric nahi.
   "checkout success rate >= 99.5% aur p99 < 800ms"  (ek business-level SLI)
2. HYPOTHESIS     - "agar hum 3 payment-service pods mein se ek ko kill karें, steady
   state abhi bhi holds karता hai" (kyunki hamare paas N+1 hai aur LB reroute karता hai).
3. BLAST RADIUS   - SABSE CHHOTA test jo hypothesis ko disprove kar sakta.
   start: 1 pod, 1% traffic, ek staging clone, business hours, team watching.
4. INJECT         - ek realistic failure: ek pod kill / 200ms latency add / ek
   dependency drop / ek disk fill / CPU burn / network partition / ek cert expire.
5. OBSERVE        - kya steady state hold hua? kya alerts fire hue? kya runbook kaam kiya?
   detect karne mein, mitigate, recover mein kitna time?
6. ABORT          - ek bada red button jo turant fault remove karता hai. HAMESHA rakhो.
7. LEARN & EXPAND - jo tootा use fix karो. PHIR blast radius widen karो. ise ek
   regression test ke roop mein automate karो.
\`\`\`

**WHY** — aapke paas resilience patterns hain (Lesson 2: timeouts, retries, breakers;
Lesson 1: redundancy). Chaos engineering wo hai jaise aap pata karते ho kya wo
ACTUALLY kaam karते hain, kyunki:
\`\`\`
- timeout set hai... par kya ye US client par set hai? (aksar ek miss hoती hai)
- retry mein backoff hai... par kya isme ek budget bhi hai? (aksar nahi)
- replica exist karता hai... par kya failover actually <30s mein complete hota hai? (aksar nahi)
- fallback coded hai... par kya wo code path prod mein KABHI chala hai? (usually nahi)
- alert defined hai... par kya ye fire hota hai, ek human tak pahunchता hai, aur ek runbook hai?
"hope ek strategy nahi hai." ek untested failover ek failover nahi hai.
\`\`\`

**INJECT KARNE WALE COMMON FAULTS (roughly increasing risk):**
\`\`\`
resource:     CPU burn, memory pressure, disk fill, disk-IO slowdown
network:      added latency, packet loss, DNS failure, ek partition, bandwidth cap
dependency:   ek downstream service kill/black-hole, ek slow database, ek poisoned cache
platform:     ek pod / node / AZ kill, ek deploy roll back, ek TLS cert / token expire
state:        clock skew, ek full message queue, ek read-replica lag spike
\`\`\`

**GAME DAY** — ek SCHEDULED, announced exercise jahaan team ek injected (ya tabletop
/ simulated) incident ko respond karता hai jaise ye real ho:
\`\`\`
- HUMAN side practise karता hai: kaun on call hai, kya runbook findable hai, kya
  dashboards sawaal ka jawaab dete hain, kya hum actually roll back kar sakते hain, comms.
- reveal karता hai: stale runbooks, missing access, ek dashboard jo 404s, ek pager jo
  kisi ko jaता hai jo chala gaya, ek "break glass" procedure jo kisi ne nahi kiya.
- blameless. artefacts action items hain, blame nahi. inhe quarterly run karो.
- GameDay != chaos experiment: ek game day people-centric aur scheduled hai; ek chaos
  experiment system-centric hai aur continuous/automated ho sakта hai.
\`\`\`

**MATURITY LADDER:** tabletop -> staging mein ek manual experiment team watching ke
saath -> CI mein staging mein automated experiments -> prod mein controlled
experiments, business hours, small blast radius -> continuous, automated, prod. Last
rung par START mat karो.

**AWS FIS** (Fault Injection Service) EC2/ECS/EKS/RDS ke against experiments run karता
hai stop-conditions ke saath CloudWatch alarms se wired. **Azure Chaos Studio** wahi
karता hai Azure resources ke liye faults as ARM templates ke saath. Open source:
LitmusChaos, Chaos Mesh (k8s), Toxiproxy (network faults), Gremlin (commercial).`,

    content: `## Chaos engineering is a discipline, not vandalism

The phrase invites the wrong picture. Chaos engineering is not randomly breaking things in production and seeing what happens; it is running *controlled experiments* to discover how a system behaves under failure conditions, so that the discovery happens on your schedule with your team watching rather than at 3am during a real incident. The structure is the scientific method applied to an operational system.

You begin by defining **steady state** as a measurable output of the system, expressed at the level a user or the business cares about — checkout success rate above 99.5 percent with p99 latency under 800 milliseconds — not an internal metric like CPU usage, because the internal metric can move a lot without the user noticing and can stay still while the user suffers. You then form a **hypothesis**: a specific, falsifiable statement that steady state will continue to hold when a particular failure is introduced, and ideally a statement of *why* you believe it — "killing one of three payment pods will not breach steady state because we run N+1 and the load balancer reroutes within its health-check interval". You choose the smallest **blast radius** that could disprove the hypothesis: one pod, one percent of traffic, a staging environment first, during business hours, with the team present and an abort ready. You **inject** exactly one realistic failure. You **observe** not just whether steady state held, but whether the alerts fired, whether they reached a human, whether the runbook was accurate, and how long detection, mitigation, and recovery each took. You keep an **abort** — a single control that instantly removes the injected fault — available at every moment. And afterwards you **fix what broke and then expand**: more traffic, production, off-hours, a larger fault, and eventually the experiment becomes an automated regression test that runs continuously so the failure mode cannot silently return.

## Why it is necessary

By this point in the module you have a toolkit of resilience patterns — timeouts, retries with backoff and jitter and a budget, circuit breakers, bulkheads, fallbacks, redundancy, automatic failover. Every one of them is a claim about how the system will behave under a failure it has not yet experienced, and claims like that are wrong surprisingly often in ways that are invisible until the failure actually arrives. The timeout is configured, but on one of the six HTTP clients in the codebase somebody forgot it. The retry has exponential backoff, but no budget, so under a real outage it triples the load. The read replica exists, but nobody has measured how long promotion actually takes and it is four minutes, not the thirty seconds the design assumed. The fallback path is written and unit-tested, but it has never executed in production against real data and it throws on a null field that only appears in real traffic. The alert rule is defined, but it routes to a team that was reorganised away and the page goes nowhere. Chaos engineering is the practice of finding each of these while it is a curiosity rather than an outage. An untested failover is not a failover; it is a hypothesis.

## What to inject

Faults fall into a few families. Resource faults: burn CPU, apply memory pressure, fill a disk, slow disk IO. Network faults: add latency, drop packets, fail DNS resolution, create a partition between two groups of nodes, cap bandwidth. Dependency faults: kill or black-hole a downstream service, make a database slow, return errors or stale data from a cache. Platform faults: terminate a pod, a node, or a whole availability zone, roll a deployment back, let a TLS certificate or an auth token expire. State faults: skew a clock, fill a message queue, spike replication lag. A sensible programme works through these roughly in order of increasing risk and blast radius, and always injects one at a time so the observation has a single cause.

## Game days

A game day is a scheduled, announced exercise in which the team responds to an incident — injected for real, or simulated as a tabletop walkthrough — as though it were genuine. Where a chaos experiment is centred on the system and can be automated and continuous, a game day is centred on the people and the process, and its purpose is to exercise the parts of incident response that no automated test touches: whether the on-call rotation is correct, whether the runbook can be found and followed by someone who did not write it, whether the dashboards actually answer the question "what is broken", whether the rollback procedure works when performed under time pressure, who has the authority to declare an incident, and how status is communicated to stakeholders. Game days routinely surface stale runbooks, permissions that were never granted, a dashboard link that 404s, a pager escalation that points at someone who left the company a year ago, and "break glass" emergency-access procedures that nobody has ever actually executed. They are run blameless — the output is a list of action items, never a list of people who did badly — and a quarterly cadence is typical.

## Maturity ladder

Adopt this gradually. The first rung is a tabletop: sit around a table and talk through what would happen if a given component failed, which costs nothing and finds a surprising amount. Then a manual experiment in staging with the whole team watching. Then automated experiments in staging, run in CI so a regression is caught before release. Then controlled experiments in production, during business hours, with a small blast radius and everyone paying attention. Only at the top of the ladder — and only for systems that have climbed the lower rungs successfully — does continuous automated fault injection in production, such as an always-on process that randomly terminates instances, make sense. Starting at the top is how chaos engineering earns its bad reputation.

## Platform tooling

AWS Fault Injection Service runs experiment templates against EC2, ECS, EKS, and RDS, with stop conditions wired to CloudWatch alarms so that if a real user-facing metric degrades past a threshold the experiment halts itself automatically. Azure Chaos Studio provides the equivalent for Azure resources, with faults defined declaratively and the same notion of a health-gated automatic stop. GCP has no first-party equivalent at the same level of integration; teams there typically use open-source tooling. On the open-source side, LitmusChaos and Chaos Mesh are Kubernetes-native experiment frameworks, Toxiproxy sits in front of a dependency and injects network conditions on demand, and Gremlin is a commercial platform. Whatever the tool, the non-negotiable feature is the stop condition and the abort — an experiment that cannot be halted instantly is not a controlled experiment.`,

    contentHi: `## Chaos engineering ek discipline hai, vandalism nahi

Phrase galat picture invite karता hai. Chaos engineering randomly production mein cheezein todना aur dekhना kya hota hai nahi hai; ye *controlled experiments* run karना hai ye discover karने ke liye ki ek system failure conditions ke tehat kaise behave karता hai, taaki discovery aapke schedule par aapke team watching ke saath ho ek real incident ke dauraan 3am par nahi. Structure operational system par apply kiya gaya scientific method hai.

Aap **steady state** ko system ke ek measurable output ke roop mein define karके shuru karते ho, us level par expressed jispar ek user ya business care karता hai — checkout success rate 99.5 percent se upar p99 latency 800 milliseconds ke neeche — CPU usage jaise ek internal metric nahi. Aap phir ek **hypothesis** banाते ho: ek specific, falsifiable statement ki steady state continue karega jab ek particular failure introduce kiya jaता hai, aur ideally ek statement ki aap *kyun* ye maanते ho. Aap sabse chhota **blast radius** choose karते ho jo hypothesis ko disprove kar sakta: ek pod, ek percent traffic, pehle ek staging environment, business hours ke dauraan. Aap exactly ek realistic failure **inject** karते ho. Aap **observe** karते ho na sirf kya steady state hold hua, balki kya alerts fire hue, kya wo ek human tak pahunche, kya runbook accurate tha. Aap ek **abort** rakhते ho. Aur baad mein aap **jo tootा use fix karते ho aur phir expand karते ho**.

## Kyun ye zaroori hai

Module mein is point tak aapke paas resilience patterns ka ek toolkit hai — timeouts, retries, circuit breakers, bulkheads, fallbacks, redundancy, automatic failover. Un mein se har ek ek claim hai ki system ek failure ke tehat kaise behave karega jo isne abhi tak experience nahi kiया, aur us tarah ke claims surprisingly aksar galat hote hain. Timeout configured hai, par codebase mein chhe HTTP clients mein se ek par kisi ne ise bhula diya. Retry mein exponential backoff hai, par koi budget nahi. Read replica exist karता hai, par kisi ne measure nahi kiया ki promotion actually kitna time leता hai aur ye chaar minute hai. Fallback path likha aur unit-tested hai, par isne production mein real data ke against kabhi execute nahi kiया. Ek untested failover ek failover nahi hai; ye ek hypothesis hai.

## Kya inject karें

Faults kुछ families mein aate hain. Resource faults: CPU burn, memory pressure, ek disk fill, disk IO slow. Network faults: latency add, packets drop, DNS resolution fail, ek partition banाओ. Dependency faults: ek downstream service kill ya black-hole karो, ek database ko slow banाओ. Platform faults: ek pod, ek node, ya ek poora availability zone terminate karो. State faults: ek clock skew, ek message queue fill. Ek sensible programme in ke through roughly increasing risk ke order mein kaam karता hai, aur hamesha ek baar mein ek inject karता hai.

## Game days

Ek game day ek scheduled, announced exercise hai jisme team ek incident ko respond karता hai — real ke liye injected, ya ek tabletop walkthrough ke roop mein simulated — jaise ye genuine ho. Jahaan ek chaos experiment system par centred hai aur automated aur continuous ho sakта hai, ek game day people aur process par centred hai, aur iska purpose incident response ke un parts ko exercise karना hai jo koi automated test touch nahi karता: kya on-call rotation correct hai, kya runbook mila aur follow kiya ja sakта hai kisi dwara jisne ise nahi likha, kya dashboards actually sawaal ka jawaab dete hain. Game days routinely stale runbooks surface karते hain. Wo blameless run kiye jaते hain.

## Maturity ladder

Ise gradually adopt karो. Pehla rung ek tabletop hai. Phir staging mein ek manual experiment poore team watching ke saath. Phir staging mein automated experiments, CI mein run. Phir production mein controlled experiments, business hours ke dauraan, ek small blast radius ke saath. Sirf ladder ke top par continuous automated fault injection production mein sense karता hai. Top par start karना wo hai jaise chaos engineering apni bad reputation earn karता hai.

## Platform tooling

AWS Fault Injection Service experiment templates EC2, ECS, EKS, aur RDS ke against run karता hai, stop conditions ke saath CloudWatch alarms se wired. Azure Chaos Studio Azure resources ke liye equivalent provide karता hai. Open-source side par, LitmusChaos aur Chaos Mesh Kubernetes-native experiment frameworks hain, Toxiproxy ek dependency ke saamne baithता hai. Jo bhi tool ho, non-negotiable feature stop condition aur abort hai.`,

    examples: [
      {
        title: 'A chaos experiment written out: hypothesis, blast radius, injection, observation, result',
        titleHi: 'Ek chaos experiment likha gaya: hypothesis, blast radius, injection, observation, result',
        code: `# VERIFY  (this is an experiment DESIGN + a representative run log, not a live tool)
# ---------------------------------------------------------------------------
# EXPERIMENT: payment-service pod loss during business hours
# ---------------------------------------------------------------------------
# STEADY STATE (measured over a 5-min window, from the SLO dashboard):
#     checkout_success_rate >= 99.5%
#     checkout_latency_p99  <  800ms
#
# HYPOTHESIS:
#     Killing 1 of the 3 payment-service pods does NOT breach steady state,
#     because: 3 replicas at ~55% CPU each (N+1 headroom), a readiness probe,
#     and a Service that removes the pod from endpoints within ~5s.
#
# BLAST RADIUS (smallest that can disprove it):
#     - staging-mirror env first, then prod
#     - exactly 1 pod, chosen at random
#     - Tue 14:00 local (low-risk, full team online)
#     - ABORT: 'kubectl rollout restart deploy/payment-service' + stop injecting
#     - AUTO-STOP: if checkout_success_rate < 99.0% for 2 min -> abort
#
# INJECTION:
#     kubectl delete pod -l app=payment-service --field-selector \\
#       'metadata.name=payment-service-7c9f-abcde'   # 1 pod, once
#
# ---- RUN LOG (prod, 2026-03-10) --------------------------------------------
14:00:00  inject: deleted pod payment-service-7c9f-abcde
14:00:02  k8s: endpoint removed; 2 pods serving; new pod Pending->ContainerCreating
14:00:04  observed: p99 320ms -> 610ms (surviving 2 pods absorbing the load)
14:00:07  ALERT fired: "PaymentServicePodsBelowDesired" -> #payments-oncall  (GOOD)
14:00:31  new pod Ready; 3 pods serving again
14:00:40  observed: p99 back to 340ms
14:05:00  window close. checkout_success_rate 99.71%   p99 638ms
# ---------------------------------------------------------------------------
# RESULT: hypothesis SUPPORTED. steady state held (99.71% >= 99.5%, 638 < 800).
# FINDINGS (action items, tracked):
#   1. GOOD: alert fired in 7s and paged the right channel.
#   2. GAP:  the runbook for that alert still referenced the old namespace. Fixed.
#   3. GAP:  p99 briefly touched 610ms - within SLO, but a 4th pod (N+2) would
#            keep headroom during the ~30s replacement gap. Raised for discussion.
# NEXT EXPANSION: kill 2 of 3 pods; then kill a whole node; then during a deploy.`,
        output: `RESULT: hypothesis SUPPORTED
  steady state held:  checkout_success_rate 99.71%  (>= 99.5% target)
                      checkout_latency_p99  638ms   (<  800ms target)
  detection:          alert fired 7s after injection, correct channel paged
  recovery:           replacement pod Ready 31s after injection, p99 normal by 40s

action items:
  [done]  runbook referenced a stale namespace -> corrected
  [open]  consider N+2 to hold p99 headroom during the ~30s pod-replacement gap
  [next]  expand blast radius: 2/3 pods -> full node -> during a rolling deploy`,
        explain: 'This is what a chaos experiment looks like on paper and in its run log — the value is in the structure, not in any tool. Steady state is defined before anything is touched, as two numbers a user would care about, read from the same SLO dashboard the on-call uses. The hypothesis is falsifiable and states its reasoning, so a failure teaches you which part of the reasoning was wrong. The blast radius is deliberately minimal: one pod, a quiet afternoon, staging before production, and two independent ways to stop — a manual abort command everyone knows and an automatic stop condition tied to the user-facing success rate so the experiment cannot run away. The run log captures timing, because the interesting numbers in an incident are how long detection, mitigation, and recovery take, not just whether the system eventually recovered. Here the hypothesis was supported — steady state held comfortably — but the experiment still produced two findings that matter: a runbook pointing at a stale namespace, which would have cost minutes during a real incident, and a marginal latency observation that feeds a capacity discussion. Those findings are the return on the experiment, and the next step is to widen the blast radius one increment at a time.',
        explainHi: 'Ye wo hai jaise ek chaos experiment kagaz par aur apne run log mein dikhता hai — value structure mein hai, kisi tool mein nahi. Steady state kुछ bhi touch hone se pehle define kiya jaता hai, do numbers ke roop mein jispar ek user care karega, usi SLO dashboard se read jo on-call use karता hai. Hypothesis falsifiable hai aur apni reasoning batाता hai, taaki ek failure aapko sikhाता hai reasoning ka konsa part galat tha. Blast radius deliberately minimal hai: ek pod, ek quiet afternoon, production se pehle staging, aur stop karने ke do independent tareeke. Run log timing capture karता hai. Yahaan hypothesis supported tha, par experiment ne phir bhi do findings produce kiye jo matter karते hain: ek runbook ek stale namespace par point karता, aur ek marginal latency observation. Wo findings experiment par return hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# "chaos engineering": SSH into a prod box on a Friday and kill things
  # - no hypothesis: "let's see what happens if I kill the database"
  # - no steady-state metric: nobody's watching a dashboard, so "did it hold?"
  #   has no answer
  # - blast radius = 100%: it's the only database, and it's prod
  # - no abort: the fault is "database is dead", there's no button to un-dead it
  #   faster than a restore
  # - Friday afternoon: minimal staff to respond, weekend ahead
  # result: a real outage that you caused, learned little from (no baseline to
  # compare against), and now have to explain. this is why people distrust the term.`,
        right: `# a controlled experiment:
  # 1. STEADY STATE: "order_success_rate >= 99.5% over 5 min" - on a dashboard, watched
  # 2. HYPOTHESIS: "if the PRIMARY db fails, the replica is promoted and steady
  #    state resumes within 90s" - falsifiable, and states the mechanism
  # 3. BLAST RADIUS: staging first. then prod: Tue 10am, team online, 5% of traffic
  #    shadowed, announced in #eng.
  # 4. ABORT: a one-command failback + "stop the experiment" runbook, tested first.
  #    AUTO-STOP: order_success_rate < 98% for 60s -> abort automatically.
  # 5. INJECT: one fault - block port 5432 to the primary from the app subnet.
  # 6. OBSERVE: did the replica get promoted? how long? did connections drain and
  #    reconnect? did the alert fire and page? was the runbook right?
  # 7. LEARN: promotion took 4m11s, not 90s (finding!). fix, re-run, then expand.`,
        why: 'The caricature version of chaos engineering — logging into production and breaking something to see what happens — has every property that makes an experiment worthless and dangerous. With no defined steady-state metric there is no way to answer the only question that matters, which is whether the system continued to serve users, so you learn nothing even though you caused real harm. With no hypothesis there is nothing to confirm or refute, so the exercise produces a war story rather than a specific correction. With a blast radius of the entire production system and no abort, a wrong guess is a full outage that you must now wait out. And choosing a Friday guarantees the fewest people available to respond and the longest time to the next working day. A real experiment inverts all of this: a steady-state metric on a watched dashboard, a falsifiable hypothesis that names the mechanism it is testing, the smallest blast radius that could disprove it, staging before production, an announced window with the team present, a tested manual abort, and an automatic stop condition tied to a user-facing metric so the experiment halts itself before it becomes an incident.',
        whyHi: 'Chaos engineering ka caricature version — production mein log in karना aur kुछ todना ye dekhने ke liye kya hota hai — mein har property hai jo ek experiment ko worthless aur dangerous banाती hai. Bina ek defined steady-state metric ke us ekmatra sawaal ka jawaab dene ka koi tareeka nahi jo matter karता hai, jo ye hai ki kya system users ko serve karता raha, to aap kुछ nahi seekhते even though aapne real harm cause kiya. Bina ek hypothesis ke confirm ya refute karने ke liye kुछ nahi hai. Bina ek abort ke ek poora production blast radius ke saath, ek galat guess ek full outage hai. Ek real experiment is sab ko invert karता hai: ek watched dashboard par ek steady-state metric, ek falsifiable hypothesis, sabse chhota blast radius, production se pehle staging, ek tested manual abort, aur ek user-facing metric se tied ek automatic stop condition.',
      },
      {
        wrong: `# running the experiment once, it passes, declaring victory, never repeating it
  # Q2: chaos experiment - "kill one cache node, hypothesis holds" -> PASS.
  # writes it up. closes the ticket. moves on.
  # Q3: someone adds a feature that reads 8x from that cache on the hot path.
  # Q3: the cache client's timeout is "temporarily" raised from 50ms to 2s in a hotfix.
  # Q4: a real cache node dies. the hot path now blocks 2s x 8 = 16s per request,
  # the thread pool fills, and the service is down - the exact failure the Q2
  # experiment "proved" couldn't happen. the experiment was a photograph, not a smoke detector.`,
        right: `# turn a passing experiment into a permanent automated regression test
  # after the manual experiment passes in staging:
  #   - encode it: an AWS FIS template / a Litmus workflow / a scripted job
  #   - run it on a SCHEDULE: nightly in staging, weekly in prod (small blast radius)
  #   - wire the steady-state check as the pass/fail assertion
  #   - alert if it ever regresses -> "cache-node-loss experiment FAILED last night"
  # now the Q3 timeout change and the Q3 fan-out change each break the nightly run
  # the day they land, with a clear pointer to the cause, instead of surfacing as
  # a customer-facing outage in Q4. resilience is a property you must RE-verify as
  # the system changes, exactly like a unit test.`,
        why: 'A chaos experiment that runs once and is then filed away verifies resilience at a single instant, but resilience is not a static property — it degrades continuously as the system changes, and every one of those changes is made by someone who is not thinking about the experiment you ran last quarter. A timeout gets raised in a hotfix. A new feature adds fan-out on a hot path. A dependency is added without a circuit breaker. A retry loses its budget in a refactor. Each of these can reintroduce exactly the failure mode a past experiment demonstrated was handled, and because the experiment is not running any more, nothing catches the regression until a real failure does. The fix is to treat a passing experiment the way you treat a passing test: encode it — as an AWS FIS template, a LitmusChaos or Chaos Mesh workflow, or a scripted job — schedule it to run automatically, nightly in staging and periodically in production with a small blast radius, and make the steady-state check its pass/fail assertion so that a regression pages someone with a clear pointer to what broke, the day it broke, rather than months later in front of customers.',
        whyHi: 'Ek chaos experiment jo ek baar run hota hai aur phir file away kiya jaता hai ek single instant par resilience verify karता hai, par resilience ek static property nahi hai — ye continuously degrade karता hai jaise system change hota hai, aur un changes mein se har ek kisi dwara kiya jaता hai jo pichhले quarter aapne jo experiment run kiya uske baare mein nahi soch raha. Ek timeout ek hotfix mein raise hota hai. Ek naya feature ek hot path par fan-out add karता hai. In mein se har ek exactly wo failure mode reintroduce kar sakता hai jo ek past experiment ne demonstrate kiya ki handled tha. Fix ek passing experiment ko us tarah treat karना hai jaise aap ek passing test ko treat karते ho: ise encode karो, ise automatically run karने ke liye schedule karो, aur steady-state check ko iska pass/fail assertion banाओ.',
      },
      {
        wrong: `# a "game day" that is really a solo engineer running a script
  # the calendar invite says "Game Day". in practice:
  #   - one SRE runs the fault-injection script and watches the graphs alone
  #   - the on-call engineer isn't involved ("don't want to bother them")
  #   - nobody opens the runbook - the SRE already knows the system
  #   - no incident is "declared", no comms channel, no scribe
  #   - it passes. the report says "incident response validated."
  # what was NOT tested: whether the ON-CALL person (not the expert) can find the
  # runbook, whether the pager works, whether anyone knows who declares an
  # incident, whether the status page can be updated, whether comms happen.
  # the human half of incident response - the half that fails at 3am - was skipped.`,
        right: `# a real game day exercises the PEOPLE and the PROCESS:
  #   - the ACTUAL on-call engineer responds, cold, as if paged for real
  #   - the system expert plays "observer", only steps in if it goes off the rails
  #   - the responder must: acknowledge the page, find + follow the runbook,
  #     open an incident channel, post updates, decide on mitigation, execute a
  #     rollback, update the status page, write the timeline
  #   - a facilitator injects twists ("now the runbook's rollback step fails")
  #   - blameless retro after: every friction point -> an action item
  # findings are usually about PEOPLE-SYSTEM gaps: "the runbook assumed prod access
  # the on-call doesn't have", "the status page login is in one person's vault",
  # "nobody knew they could page the DBA". quarterly cadence.`,
        why: 'A game day exists to test the half of incident response that automation never exercises: the people and the process. If the exercise is run by the person who knows the system best, working alone, without involving the actual on-call engineer, without anyone opening the runbook, and without going through the motions of declaring an incident and communicating status, then it validates only that the expert can fix the system — which was never in doubt — and tells you nothing about what happens at 3am when the page goes to someone who has been on the team for six weeks. The failures that a game day is supposed to catch are almost all at the boundary between people and systems: a runbook that assumes access the on-call does not have, a status-page credential that lives in one person\'s password vault, an escalation path nobody has tested, a dashboard that everyone assumed existed and does not. A real game day has the actual on-call person respond cold while the expert observes silently, requires them to find and follow the runbook and run the real rollback and communicate as they would in a real incident, has a facilitator inject complications, and ends in a blameless retro where every point of friction becomes a tracked action item.',
        whyHi: 'Ek game day incident response ke us aadhे hisse ko test karने ke liye exist karता hai jo automation kabhi exercise nahi karता: people aur process. Agmar exercise us person dwara run kiya jaता hai jo system ko sabse achha jaनता hai, akele kaam karते hue, actual on-call engineer ko involve kiye bina, kisi dwara runbook khोle bina, to ye sirf validate karता hai ki expert system ko fix kar sakता hai — jo kabhi doubt mein nahi tha. Wo failures jo ek game day catch karने waala hai लगभग sab people aur systems ke beech boundary par hain: ek runbook jo access assume karता hai jo on-call ke paas nahi hai, ek status-page credential jo ek person ke password vault mein rehता hai. Ek real game day mein actual on-call person cold respond karता hai jabki expert silently observe karता hai, aur ek blameless retro mein end hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**Netflix Chaos Monkey** — the canonical example: a service that randomly terminates production instances during business hours, forcing every team to build for instance loss as a normal event rather than an emergency. It only works because it was the *top* of a ladder Netflix had already climbed — auto-scaling, stateless services, fast replacement, and regional redundancy were all in place first.',
        hi: '**Netflix Chaos Monkey** — canonical example: ek service jo randomly production instances ko business hours ke dauraan terminate karता hai, har team ko instance loss ke liye ek normal event ke roop mein build karने par majboor karता hai. Ye sirf isliye kaam karता hai kyunki ye ek ladder ka *top* tha jo Netflix already climb kar chuka tha.',
      },
      {
        en: '**A game day that found the runbook required VPN nobody set up** — a fintech ran a quarterly DR game day. The injected fault (primary region down) was handled by the design, but the on-call could not execute the failover: the runbook\'s first step needed a bastion-host VPN profile that was only ever installed on the platform team\'s laptops. Fixed by baking it into on-call onboarding. The design was fine; the human path was broken.',
        hi: '**Ek game day jisne paya ki runbook ko VPN chahिए tha jo kisi ne set up nahi kiya** — ek fintech ne ek quarterly DR game day run kiya. Injected fault (primary region down) design dwara handled tha, par on-call failover execute nahi kar saka: runbook ke pehle step ko ek bastion-host VPN profile chahिए tha jo sirf platform team ke laptops par installed tha. On-call onboarding mein bake karके fix kiya.',
      },
      {
        en: '**Latency injection revealed a missing timeout that a code review had passed** — a team injected 300ms of latency into calls to a recommendations service. Checkout p99 jumped to 9 seconds. The cause: a newly added "related products" call on the checkout page had no timeout — the linter and two reviewers missed it. The chaos experiment found in 20 minutes what would have been a Black Friday outage.',
        hi: '**Latency injection ne ek missing timeout reveal kiya jo ek code review ne pass kiya tha** — ek team ne ek recommendations service ko calls mein 300ms latency inject kiya. Checkout p99 9 seconds tak jump hua. Cause: checkout page par ek newly added "related products" call ka koi timeout nahi tha — linter aur do reviewers ne ise miss kiya. Chaos experiment ne 20 minute mein wo paya jo ek Black Friday outage hota.',
      },
    ],

    interviewQA: [
      {
        q: 'What is chaos engineering, and what are the parts of a well-formed chaos experiment?',
        qHi: 'Chaos engineering kya hai, aur ek well-formed chaos experiment ke parts kya hain?',
        a: 'Chaos engineering is the practice of running controlled experiments on a system to learn how it behaves under failure, so that you discover its weaknesses deliberately and on your own schedule rather than during a real incident. It is not random breakage; it is the scientific method applied to operations. A well-formed experiment has several parts. First, a definition of steady state as a measurable, user-facing output — a success rate and a latency percentile, not an internal metric like CPU — read from a dashboard someone is watching. Second, a hypothesis: a falsifiable statement that steady state will hold when a specific failure is introduced, ideally including the mechanism you believe will protect it, so that a failure tells you which assumption was wrong. Third, the smallest blast radius that could disprove the hypothesis: one instance rather than all of them, a fraction of traffic, staging before production, a low-risk time window, the team present. Fourth, a single injected fault — one at a time, so the observation has one cause. Fifth, observation not just of whether steady state held but of whether the alerts fired and reached someone, whether the runbook was correct, and how long detection, mitigation, and recovery took. Sixth, an abort: a control that instantly removes the fault, plus ideally an automatic stop condition tied to the user-facing metric. And finally, learning: fix what broke, then expand the blast radius, and eventually encode the experiment as an automated regression test.',
        aHi: 'Chaos engineering ek system par controlled experiments run karने ka practice hai ye seekhने ke liye ki ye failure ke tehat kaise behave karता hai, taaki aap iski weaknesses deliberately aur apne schedule par discover karो ek real incident ke dauraan nahi. Ye random breakage nahi hai; ye operations par apply kiya gaya scientific method hai. Ek well-formed experiment ke kई parts hain. Pehle, steady state ki ek definition ek measurable, user-facing output ke roop mein — ek success rate aur ek latency percentile, CPU jaise ek internal metric nahi. Doosre, ek hypothesis: ek falsifiable statement. Teesre, sabse chhota blast radius jo hypothesis ko disprove kar sakta. Chouthe, ek single injected fault. Paanchve, observation na sirf kya steady state hold hua. Chhathe, ek abort. Aur finally, learning: jo tootा use fix karो, phir blast radius expand karो.',
      },
      {
        q: 'Why run chaos experiments at all if you have already designed in redundancy, timeouts, and failover?',
        qHi: 'Chaos experiments kyun run karें agmar aapne already redundancy, timeouts, aur failover design kar liya hai?',
        a: 'Because every resilience mechanism you have designed is a claim about behaviour under a condition the system has not actually experienced, and claims like that are wrong far more often than people expect, in ways that stay invisible until the real failure arrives. The pattern is consistent. The timeout policy is defined, but one of the several HTTP clients in the codebase was created without it. The retry has exponential backoff, but nobody added a budget, so under a real dependency outage it multiplies the load and makes things worse. The read replica exists and the failover is documented, but nobody has measured how long promotion actually takes under production load, and it turns out to be four minutes rather than the ninety seconds the runbook claims. The fallback code path is written and has unit tests, but it has never run in production against real data and it throws on a field that is only ever null in real traffic. The alert rule exists, but it routes to a team that was reorganised and the page goes nowhere. None of these are found by code review or by testing the happy path; they are only found by actually inducing the failure and watching what happens. An untested failover is not a failover — it is a hypothesis that you are choosing to first evaluate during an outage. Chaos engineering moves that evaluation to a time you control.',
        aHi: 'Kyunki aapne jo har resilience mechanism design kiya hai wo ek condition ke tehat behaviour ke baare mein ek claim hai jo system ne actually experience nahi kiya, aur us tarah ke claims log jitna expect karते hain usse kahीं zyada aksar galat hote hain, un tareekon se jo real failure ke aane tak invisible rehते hain. Pattern consistent hai. Timeout policy defined hai, par codebase mein kई HTTP clients mein se ek iske bina banaya gaya. Retry mein exponential backoff hai, par kisi ne ek budget add nahi kiया. Read replica exist karता hai aur failover documented hai, par kisi ne measure nahi kiया ki promotion actually kitna time leता hai. Fallback code path likha hai aur iske unit tests hain, par isne production mein real data ke against kabhi run nahi kiया. In mein se koi bhi code review dwara nahi paya jaता. Ek untested failover ek failover nahi hai — ye ek hypothesis hai.',
      },
      {
        q: 'How does a game day differ from a chaos experiment, and what does a game day uniquely catch?',
        qHi: 'Ek game day ek chaos experiment se kaise alag hai, aur ek game day uniquely kya catch karता hai?',
        a: 'A chaos experiment is centred on the system: it asks whether the architecture withstands a particular fault, it can be automated, and mature teams run experiments continuously with no human in the loop. A game day is centred on the people and the process: it is a scheduled, announced exercise in which the team responds to an incident — injected for real, or simulated as a tabletop discussion — as though it were genuine, and its purpose is to rehearse the parts of incident response that no automated test touches. That includes whether the on-call rotation is actually correct, whether someone who did not write the runbook can find it and follow it under pressure, whether the dashboards answer the question "what is broken" quickly, whether the rollback works when performed for real rather than described, who has the authority to declare an incident, and how status gets communicated to stakeholders and customers. Game days uniquely catch the failures at the seam between humans and systems: a runbook step that needs access the on-call does not have, a status-page login that lives in one person\'s password manager, a pager escalation pointing at someone who left the company, a "break glass" emergency procedure that has never actually been executed, an assumed dashboard that does not exist. They are run blameless, the output is a list of tracked action items rather than a judgement of individuals, and a quarterly cadence is typical. The two practices complement each other — the experiment validates the machine, the game day validates the response.',
        aHi: 'Ek chaos experiment system par centred hai: ye poochहता hai kya architecture ek particular fault ka saamna karता hai, ise automate kiya ja sakта hai. Ek game day people aur process par centred hai: ye ek scheduled, announced exercise hai jisme team ek incident ko respond karता hai jaise ye genuine ho, aur iska purpose incident response ke un parts ko rehearse karना hai jo koi automated test touch nahi karता. Isme shaamil hai kya on-call rotation actually correct hai, kya koi jisne runbook nahi likha ise pressure ke tehat find aur follow kar sakता hai, kya dashboards sawaal ka jawaab dete hain, kya rollback kaam karता hai jab real ke liye perform kiya jaता hai. Game days uniquely humans aur systems ke beech seam par failures catch karते hain: ek runbook step jise access chahिए jo on-call ke paas nahi hai. Wo blameless run kiye jaते hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write out the seven parts of a well-formed chaos experiment, with a concrete worked example for one fault.',
        taskHi: 'Ek comment mein, ek well-formed chaos experiment ke saat parts likhो, ek fault ke liye ek concrete worked example ke saath.',
        hint: 'Chaos engineering = CONTROLLED experiments to learn how a system fails, on YOUR schedule, not during a real incident. NOT random breakage — the scientific method applied to ops. THE SEVEN PARTS: (1) STEADY STATE — define it as a MEASURABLE, USER-FACING output (a success rate + a latency percentile, e.g. "checkout_success_rate >= 99.5% AND p99 < 800ms"), NOT an internal metric like CPU (which moves without users noticing, and stays flat while users suffer). Read it from a dashboard someone is watching. (2) HYPOTHESIS — a FALSIFIABLE statement that steady state HOLDS when a specific fault is injected, INCLUDING the mechanism you believe protects it ("killing 1 of 3 payment pods won\'t breach steady state because N+1 headroom + a readiness probe + the Service drops the pod from endpoints in ~5s"). Stating the mechanism means a failure tells you WHICH assumption was wrong. (3) BLAST RADIUS — the SMALLEST test that could disprove the hypothesis: 1 pod not all, 1-5% of traffic, staging BEFORE prod, a low-risk window (Tue 2pm not Fri 5pm), team online. (4) INJECT — exactly ONE realistic fault, once (kill a pod / +200ms latency / drop a dependency / fill a disk / partition the network / expire a cert). One at a time → the observation has ONE cause. (5) OBSERVE — not just "did steady state hold?" but: did the ALERT fire, did it reach a HUMAN, was the RUNBOOK correct, and how long to DETECT / MITIGATE / RECOVER (timing is the whole point). (6) ABORT — a single control that INSTANTLY removes the fault, ALWAYS present + tested first; ideally also an AUTO-STOP condition wired to the user-facing metric ("success_rate < 98% for 60s → abort"). (7) LEARN & EXPAND — fix what broke; THEN widen the blast radius one increment (more traffic → prod → off-hours → bigger fault); encode it as an AUTOMATED REGRESSION TEST that runs on a schedule. WORKED EXAMPLE — see the lesson\'s payment-pod-loss experiment: steady state = 99.5%/800ms; hypothesis names N+1 + the endpoint removal; blast radius = 1 random pod, Tue 14:00, staging then prod, auto-stop at 99% for 2min; inject = kubectl delete one pod; observe = alert fired in 7s (good), runbook had a stale namespace (gap), p99 touched 610ms (marginal); result = hypothesis supported, 2 action items, next expansion = 2/3 pods → node → during a deploy.',
        hintHi: 'Chaos engineering = CONTROLLED experiments ye seekhने ke liye ki ek system kaise fail hoती hai, AAPKE schedule par. NOT random breakage. SAAT PARTS: (1) STEADY STATE — ek MEASURABLE, USER-FACING output (success rate + latency percentile), CPU jaise internal metric NAHI. Ek watched dashboard se. (2) HYPOTHESIS — ek FALSIFIABLE statement ki steady state HOLDS jab ek specific fault inject hota hai, MECHANISM ke saath jo aap maanते ho protect karता hai. (3) BLAST RADIUS — SABSE CHHOTA test: 1 pod not all, 1-5% traffic, staging BEFORE prod, low-risk window. (4) INJECT — exactly ONE realistic fault, once. (5) OBSERVE — alert fire hua, HUMAN tak pahuncha, RUNBOOK correct tha, DETECT/MITIGATE/RECOVER mein kitna time. (6) ABORT — ek control jo INSTANTLY fault remove karता hai, HAMESHA + pehle tested; ideally ek AUTO-STOP bhi. (7) LEARN & EXPAND — fix karो; PHIR blast radius widen karो; ek AUTOMATED REGRESSION TEST ke roop mein encode karो. WORKED: lesson ka payment-pod-loss experiment dekhो.',
      },
      {
        task: 'In a comment, explain why resilience patterns (from Lessons 1-2) need chaos experiments to verify them — give at least four concrete "designed but broken" examples.',
        taskHi: 'Ek comment mein, samjhाओ kyun resilience patterns ko unhe verify karने ke liye chaos experiments chahिए.',
        hint: 'Every resilience mechanism you designed is a CLAIM about behaviour under a condition the system has NOT actually experienced — and such claims are wrong far more often than people expect, INVISIBLY, until the real failure hits. Code review and happy-path tests do NOT catch these; only inducing the failure does. CONCRETE "DESIGNED BUT BROKEN" EXAMPLES: (1) The TIMEOUT policy is defined — but one of the 6 HTTP clients in the codebase was constructed without it (someone used the raw constructor). Under a slow dependency, THAT path hangs and fills the thread pool. (2) The RETRY has exponential backoff — but no BUDGET. Under a real dependency outage every failed request retries 3x → the retry traffic TRIPLES the load on the already-sick service → a partial outage becomes total. (3) The READ REPLICA exists and failover is "documented" — but nobody measured promotion time under production load. The runbook says 90s; it is actually 4m11s (replication lag replay + DNS TTL + connection-pool drain). (4) The FALLBACK code path is written and UNIT-TESTED — but it has never executed in production against real data, and it throws a NullPointerException on a field that is only ever null in real traffic (the test fixtures always populated it). (5) The ALERT rule is defined — but it routes to a Slack channel / PagerDuty service for a team that was reorganised 6 months ago; the page goes NOWHERE. (6) The CIRCUIT BREAKER is configured — but with a failure threshold so high (or a window so long) it never actually trips before the thread pool is exhausted. (7) AUTOSCALING is set up — but the reaction time (metric scrape + evaluation + new node boot + image pull + readiness) is 4 minutes and the spike is over in 90 seconds. THE PRINCIPLE: "an untested failover is not a failover — it is a hypothesis you are choosing to first evaluate during an outage." "Hope is not a strategy." Chaos engineering moves that first evaluation to a time you control, with the team watching and an abort ready.',
        hintHi: 'Aapne jo har resilience mechanism design kiya wo ek condition ke tehat behaviour ke baare mein ek CLAIM hai jo system ne actually experience NAHI kiya — aur aise claims aksar galat hote hain, INVISIBLY, real failure tak. Code review aur happy-path tests inhe NAHI catch karते. CONCRETE EXAMPLES: (1) TIMEOUT policy defined hai — par 6 HTTP clients mein se ek iske bina banaya gaya. (2) RETRY mein backoff hai — par koi BUDGET nahi → retry traffic load TRIPLE karता hai. (3) READ REPLICA exist karता hai — par promotion time measure nahi kiया; runbook 90s kehता hai, actually 4m11s. (4) FALLBACK path likha + UNIT-TESTED — par prod mein real data ke against kabhi nahi chala, ek null field par throw karता hai. (5) ALERT rule defined hai — par ek reorganised team ko route karता hai; page KAHIN nahi jaता. (6) CIRCUIT BREAKER configured hai — par threshold itna high ki kabhi trip nahi karता. PRINCIPLE: "ek untested failover ek failover nahi hai — ye ek hypothesis hai."',
      },
      {
        task: 'In a comment, contrast a game day with a chaos experiment, list what a game day uniquely tests, and describe how to run one well (roles, blamelessness, cadence).',
        taskHi: 'Ek comment mein, ek game day ko ek chaos experiment se contrast karो, aur describe karो ise achhे se kaise run karें.',
        hint: 'CHAOS EXPERIMENT = SYSTEM-centric: does the architecture withstand fault X? Can be automated, continuous, no human in the loop. GAME DAY = PEOPLE + PROCESS-centric: a SCHEDULED, ANNOUNCED exercise where the team responds to an incident (injected for real, OR a tabletop / simulated walkthrough) AS IF IT WERE GENUINE. They COMPLEMENT: the experiment validates the machine, the game day validates the RESPONSE. WHAT A GAME DAY UNIQUELY TESTS (the human half — the half that fails at 3am, that no automated test touches): is the on-call ROTATION actually correct? can someone who did NOT write the runbook FIND it and FOLLOW it under pressure? do the DASHBOARDS answer "what is broken" fast? does the ROLLBACK work when actually performed (not just described)? who has AUTHORITY to declare an incident? how is STATUS communicated to stakeholders / the status page / customers? GAME DAYS ROUTINELY SURFACE: stale runbooks; a runbook step needing access the on-call doesn\'t have; a status-page credential in one person\'s password vault; a pager escalation pointing at someone who LEFT the company; a "break glass" procedure NOBODY has ever executed; a dashboard everyone assumed exists and doesn\'t; a "we can page the DBA" that nobody knew. HOW TO RUN ONE WELL: (a) the ACTUAL on-call engineer responds COLD, as if paged for real — NOT the system expert. (b) the expert plays SILENT OBSERVER, only steps in if it goes off the rails. (c) the responder must actually DO it: ack the page, find + follow the runbook, open an incident channel, post updates, decide mitigation, execute the real rollback, update the status page, write the timeline. (d) a FACILITATOR injects twists ("now the runbook\'s rollback step fails"). (e) BLAMELESS retro after: every friction point → a TRACKED ACTION ITEM, never a judgement of a person. (f) CADENCE: quarterly. (g) MATURITY LADDER: tabletop → manual experiment in staging (team watching) → automated in staging/CI → controlled in prod (business hours, small blast radius) → continuous automated in prod (e.g. Chaos Monkey). Do NOT start at the last rung — that is how chaos engineering earns its bad reputation. TOOLING: AWS FIS (stop-conditions wired to CloudWatch alarms), Azure Chaos Studio (faults as ARM templates); OSS: LitmusChaos, Chaos Mesh (k8s), Toxiproxy (network); the non-negotiable feature is the STOP CONDITION + ABORT.',
        hintHi: 'CHAOS EXPERIMENT = SYSTEM-centric: kya architecture fault X ka saamna karता hai? Automated ho sakта hai. GAME DAY = PEOPLE + PROCESS-centric: ek SCHEDULED, ANNOUNCED exercise jahaan team ek incident ko respond karता hai JAISE YE GENUINE HO. COMPLEMENT karते hain. GAME DAY UNIQUELY KYA TEST KARTA HAI (human half — jo 3am par fail hoती hai): kya on-call ROTATION correct hai? kya koi jisne runbook nahi likha ise FIND + FOLLOW kar sakता hai? kya ROLLBACK kaam karता hai jab actually perform kiya jaता hai? kaun incident declare kar sakता hai? STATUS kaise communicate hoता hai? ROUTINELY SURFACE karता hai: stale runbooks; access jo on-call ke paas nahi; ek pager jo kisi ko jaता hai jo CHALA GAYA; ek "break glass" jo kisi ne nahi kiya. ACHHE SE KAISE RUN KAREN: (a) ACTUAL on-call COLD respond karता hai — expert NAHI. (b) expert SILENT OBSERVER. (c) responder actually DO karता hai. (d) FACILITATOR twists inject karता hai. (e) BLAMELESS retro → TRACKED ACTION ITEMS. (f) quarterly. (g) MATURITY LADDER — last rung par START mat karो.',
      },
    ],

    keyTakeaways: [
      'Chaos engineering = CONTROLLED experiments to learn how a system fails, on your schedule — NOT random breakage. Seven parts: (1) STEADY STATE as a measurable user-facing output (success rate + p99, not CPU), (2) a FALSIFIABLE hypothesis that names the protecting mechanism, (3) the SMALLEST blast radius that could disprove it, (4) ONE injected fault, (5) OBSERVE detection/alert/runbook/recovery timing, (6) an ABORT + an auto-stop on the user metric, (7) fix, then EXPAND, then automate as a regression test.',
      'WHY it is necessary: every resilience pattern (timeouts, retries+budget, breakers, fallbacks, replicas, failover) is a CLAIM about untested behaviour, and they are wrong invisibly — a timeout missed on one client, a retry with no budget, a 4-minute "90-second" failover, a fallback path that has never run on real data, an alert routed to a disbanded team. "An untested failover is not a failover — it is a hypothesis." Code review does not catch these; inducing the failure does.',
      'FAULT FAMILIES to inject (increasing risk): resource (CPU/memory/disk), network (latency/loss/partition/DNS), dependency (kill/slow/poison a downstream), platform (kill pod/node/AZ, expire a cert), state (clock skew, full queue, replica lag). One at a time, smallest blast radius first, staging before prod, business hours, team watching, abort ready.',
      'A GAME DAY is people-and-process, not system: a scheduled exercise where the ACTUAL on-call responds cold while the expert observes silently — testing whether the rotation is right, the runbook is findable and followable, the dashboards answer "what is broken", the rollback works for real, who declares an incident, how comms happen. It uniquely catches human-system seam failures: missing access, a credential in one vault, a pager to someone who left. Blameless, quarterly, output = action items.',
      'MATURITY LADDER — climb it, never start at the top: tabletop → manual experiment in staging (team watching) → automated in staging/CI → controlled in prod (small blast radius, business hours) → continuous automated in prod (Chaos Monkey). Tooling: AWS FIS (stop-conditions ↔ CloudWatch alarms), Azure Chaos Studio (faults as ARM templates); OSS LitmusChaos / Chaos Mesh / Toxiproxy. Non-negotiable: the stop condition + abort.',
    ],
    keyTakeawaysHi: [
      'Chaos engineering = CONTROLLED experiments ye seekhने ke liye ki ek system kaise fail hoती hai, aapke schedule par — random breakage NAHI. Saat parts: (1) STEADY STATE ek measurable user-facing output (success rate + p99, CPU nahi), (2) ek FALSIFIABLE hypothesis jo protecting mechanism name karता hai, (3) SABSE CHHOTA blast radius, (4) EK injected fault, (5) OBSERVE detection/alert/runbook/recovery timing, (6) ek ABORT + user metric par ek auto-stop, (7) fix, phir EXPAND, phir ek regression test ke roop mein automate.',
      'KYUN zaroori hai: har resilience pattern (timeouts, retries+budget, breakers, fallbacks, replicas, failover) untested behaviour ke baare mein ek CLAIM hai, aur wo invisibly galat hote hain — ek client par ek timeout miss, ek retry bina budget ke, ek 4-minute "90-second" failover, ek fallback path jo real data par kabhi nahi chala. "Ek untested failover ek failover nahi hai — ye ek hypothesis hai." Code review inhe nahi catch karता; failure induce karना karता hai.',
      'INJECT KARNE WALI FAULT FAMILIES (increasing risk): resource (CPU/memory/disk), network (latency/loss/partition/DNS), dependency (ek downstream kill/slow/poison), platform (pod/node/AZ kill, ek cert expire), state (clock skew, full queue, replica lag). Ek baar mein ek, sabse chhota blast radius pehle, prod se pehle staging, business hours, team watching, abort ready.',
      'Ek GAME DAY people-and-process hai, system nahi: ek scheduled exercise jahaan ACTUAL on-call cold respond karता hai jabki expert silently observe karता hai — test karता hai kya rotation right hai, runbook findable aur followable hai, dashboards "kya tootा hai" answer karते hain, rollback real ke liye kaam karता hai, kaun incident declare karता hai. Ye uniquely human-system seam failures catch karता hai: missing access, ek vault mein ek credential, ek pager kisi ko jo chala gaya. Blameless, quarterly.',
      'MATURITY LADDER — ise climb karो, kabhi top par start mat karो: tabletop → staging mein manual experiment (team watching) → staging/CI mein automated → prod mein controlled (small blast radius, business hours) → prod mein continuous automated (Chaos Monkey). Tooling: AWS FIS (stop-conditions ↔ CloudWatch alarms), Azure Chaos Studio (faults as ARM templates); OSS LitmusChaos / Chaos Mesh / Toxiproxy. Non-negotiable: stop condition + abort.',
    ],
  },

  {
    slug: 'ops-capacity-planning-backups-and-disaster-recovery',
    title: 'Capacity Planning, Backups & Disaster Recovery',
    titleHi: 'Capacity Planning, Backups Aur Disaster Recovery',
    description:
      'The forward-looking half of reliability: sizing headroom from a demand forecast and the knee of your load curve; the backup rules that survive ransomware and fat-fingers (3-2-1, immutability, PITR) and the restore test that is the only thing that proves a backup exists; and choosing a DR strategy — backup-and-restore, pilot light, warm standby, active-active — from an explicit RPO and RTO.',
    descriptionHi:
      'Reliability ka forward-looking aadha hissa: ek demand forecast aur aapke load curve ke knee se headroom size karना; backup rules jo ransomware aur fat-fingers survive karते hain (3-2-1, immutability, PITR) aur restore test jo ekmatra cheez hai jo saabit karती hai ki ek backup exist karता hai; aur ek DR strategy choose karना — backup-and-restore, pilot light, warm standby, active-active — ek explicit RPO aur RTO se.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Running a warehouse for the holiday rush, and insuring it.** Capacity planning is looking at last year\'s December, the growth since, and the promo calendar, then leasing enough floor space and hiring enough staff *before* the trucks arrive — with slack for the day a forklift breaks, because running at 100% of capacity means the first hiccup backs up the loading dock. Backups are keeping a second copy of the inventory ledger off-site, updated continuously, with older monthly snapshots in a vault nobody can overwrite — so a fire, a flood, or a disgruntled clerk deleting rows does not erase what you have. And disaster recovery is the plan for "the whole warehouse is gone": do you have a second building ready to switch on (expensive), a smaller one you can scale up in a day (cheaper, slower), or just the ledger and a phone number for a contractor (cheapest, slowest)? You pick based on how much inventory you can afford to lose and how long you can afford to be shut.',
      hi: '**Holiday rush ke liye ek warehouse chalाना, aur ise insure karना.** Capacity planning pichhले saal ka December, tab se growth, aur promo calendar dekhना hai, phir kaafi floor space lease karना aur kaafi staff hire karना *pehle* trucks aane se — slack ke saath us din ke liye jab ek forklift tootता hai. Backups inventory ledger ki ek doosri copy off-site rakhना hai, continuously updated, purане monthly snapshots ke saath ek vault mein jise koi overwrite nahi kar sakता. Aur disaster recovery "poora warehouse chala gaya" ke liye plan hai: kya aapke paas ek doosri building switch on karने ke liye ready hai (expensive), ek chhoti jise aap ek din mein scale up kar sakते ho (cheaper, slower), ya sirf ledger aur ek contractor ke liye ek phone number (cheapest, slowest)?',
    },

    simple: `**CAPACITY PLANNING — have enough headroom BEFORE you need it:**
\`\`\`
1. FORECAST demand: organic growth (trend the last 6-12 months) + known events
   (a launch, a marketing push, a partner integration, seasonality / Black Friday).
2. KNOW your capacity: from Lesson 4's stress test - the KNEE, in req/s per instance
   (or the bound resource: CPU, connections, IOPS, memory).
3. SET a headroom target: run normal load at ~50-70% of the knee. WHY the slack:
   - a traffic spike above forecast
   - an instance / AZ failure shifts its load onto the survivors (N+1: size so N-1 copes)
   - a latency regression from a deploy (each request now costs more)
   - autoscaling REACTION TIME (metric -> decision -> boot -> warm = minutes; the
     spike can be faster) -> you need static headroom to cover the ramp.
4. RE-FORECAST regularly. track "weeks of headroom left at current growth".
   lead time to add capacity (quota increases, reserved instances, a new region) can be WEEKS.
\`\`\`

**BACKUPS — the 3-2-1 rule (minimum):**
\`\`\`
3  copies of the data (1 primary + 2 backups)
2  different media / storage types (or: 2 different accounts / providers)
1  copy OFF-SITE and OFFLINE-or-IMMUTABLE (air-gapped, or object-lock / WORM)
\`\`\`
plus, for anything transactional:
\`\`\`
PITR (point-in-time recovery): full snapshot + a continuous stream of changes
   (WAL / binlog / oplog) -> restore to ANY second, e.g. "30s before the bad migration".
IMMUTABILITY: S3 Object Lock / Azure immutable blob / GCS retention lock -> a
   compromised admin credential or ransomware CANNOT delete or encrypt the backups.
ENCRYPTION at rest + separate key custody. test that you can DECRYPT too.
RETENTION: e.g. hourly x 48, daily x 30, monthly x 12 - a schedule, not "keep forever".
COVER non-DB state: object storage, secrets, config, IaC state, dashboards, DNS.
\`\`\`

**THE RESTORE TEST — a backup you have never restored is SCHRODINGER'S BACKUP:**
\`\`\`
it is simultaneously working and broken until you actually try it. common failures:
  - the backup job has been silently failing for 3 months (nobody alerted on it)
  - the snapshot is consistent-per-file but not consistent ACROSS files (no quiesce)
  - you can't decrypt it (the key was in the same account you lost)
  - restore takes 14 hours and your RTO is 1 hour
  - the runbook is wrong / the restore needs an IAM role nobody has
=> SCHEDULE a real restore to a scratch environment. MEASURE the time. verify the
   data. this rehearsal IS your RTO evidence. do it quarterly + after big changes.
\`\`\`

**RPO & RTO — the two numbers that drive every DR decision:**
\`\`\`
RPO (Recovery Point Objective) = how much DATA you can afford to lose, in time.
   "RPO = 5 min" -> backups / replication no more than 5 min behind. drives backup FREQUENCY.
RTO (Recovery Time Objective) = how long you can afford to be DOWN.
   "RTO = 1 hour" -> from disaster declared to service restored, <= 1 hour. drives DR STRATEGY.
set them PER system from business impact. tighter = exponentially more expensive.
\`\`\`

**DR STRATEGIES (cheaper/slower -> pricier/faster):**
\`\`\`
BACKUP & RESTORE   backups in another region; on disaster, provision + restore.
   RTO hours-days, RPO = backup interval. cheapest. fine for non-critical.
PILOT LIGHT        core (usually the DB, replicating) always running small in DR;
   everything else off. on disaster: scale up + turn on. RTO ~10s of min, RPO ~min.
WARM STANDBY       a full but SMALL copy of the stack running in DR, taking no
   traffic (or a trickle). on disaster: scale up + cut over DNS. RTO minutes, RPO ~seconds.
ACTIVE-ACTIVE      DR region serves live traffic all the time; on disaster just
   stop routing to the dead one. RTO ~0, RPO ~0. most expensive + most complex (data
   conflicts, global consistency). reserve for the few systems that truly need it.
\`\`\`
plus: a DR RUNBOOK, tested in a game day (Lesson 5); regular FAILOVER DRILLS;
DNS TTLs low enough to actually cut over; and don't forget the failBACK plan.

**AWS:** cross-region snapshot copy, S3 CRR, RDS cross-region read replica /
Aurora Global DB, Route 53 health-check failover, AWS Backup, Elastic Disaster
Recovery. **Azure:** GRS/RA-GRS storage, Azure Backup + Backup Vault immutability,
SQL auto-failover groups, Azure Site Recovery, Traffic Manager / Front Door failover.`,

    simpleHi: `**CAPACITY PLANNING — kaafi headroom rakhо ISSE PEHLE ki aapko chahिए:**
\`\`\`
1. FORECAST demand: organic growth (last 6-12 months trend) + known events
   (ek launch, ek marketing push, seasonality / Black Friday).
2. KNOW your capacity: Lesson 4 ke stress test se - KNEE, req/s per instance mein.
3. SET a headroom target: normal load ko knee ke ~50-70% par run karो. WHY slack:
   - forecast se upar ek traffic spike
   - ek instance / AZ failure iski load survivors par shift karता hai (N+1)
   - ek deploy se ek latency regression
   - autoscaling REACTION TIME (metric -> decision -> boot -> warm = minutes).
4. REGULARLY RE-FORECAST karो. "current growth par kitne weeks headroom bacha" track karो.
   capacity add karने ka lead time (quota increases, reserved instances) WEEKS ho sakта hai.
\`\`\`

**BACKUPS — 3-2-1 rule (minimum):**
\`\`\`
3  data ki copies (1 primary + 2 backups)
2  alag media / storage types (ya: 2 alag accounts / providers)
1  copy OFF-SITE aur OFFLINE-ya-IMMUTABLE (air-gapped, ya object-lock / WORM)
\`\`\`
plus, kisi bhi transactional cheez ke liye:
\`\`\`
PITR (point-in-time recovery): full snapshot + changes ka ek continuous stream
   (WAL / binlog / oplog) -> KISI bhi second par restore, e.g. "bad migration se 30s pehle".
IMMUTABILITY: S3 Object Lock / Azure immutable blob -> ek compromised admin credential
   ya ransomware backups ko delete ya encrypt NAHI kar sakता.
ENCRYPTION at rest + separate key custody. test karो ki aap DECRYPT bhi kar sakते ho.
RETENTION: e.g. hourly x 48, daily x 30, monthly x 12 - ek schedule.
NON-DB state COVER karो: object storage, secrets, config, IaC state, dashboards, DNS.
\`\`\`

**RESTORE TEST — ek backup jo aapne kabhi restore nahi kiya SCHRODINGER'S BACKUP hai:**
\`\`\`
ye ek saath working aur broken hai jab tak aap actually try nahi karते. common failures:
  - backup job 3 mahine se silently fail ho raha hai (kisi ne ispar alert nahi kiya)
  - snapshot consistent-per-file hai par files ke ACROSS consistent nahi
  - aap ise decrypt nahi kar sakते (key usi account mein tha jo aapne khोya)
  - restore 14 ghante leता hai aur aapka RTO 1 ghanta hai
=> ek scratch environment mein ek real restore SCHEDULE karो. time MEASURE karो. data
   verify karो. ye rehearsal AAPKA RTO evidence HAI. ise quarterly + big changes ke baad karो.
\`\`\`

**RPO & RTO — do numbers jo har DR decision drive karते hain:**
\`\`\`
RPO (Recovery Point Objective) = kitna DATA aap lose kar sakते ho, time mein.
   "RPO = 5 min" -> backups / replication 5 min se zyada peeche nahi. backup FREQUENCY drive karता hai.
RTO (Recovery Time Objective) = kitni der aap DOWN reh sakते ho.
   "RTO = 1 hour" -> disaster declared se service restored, <= 1 hour. DR STRATEGY drive karता hai.
inhe PER system business impact se set karो. tighter = exponentially zyada expensive.
\`\`\`

**DR STRATEGIES (cheaper/slower -> pricier/faster):**
\`\`\`
BACKUP & RESTORE   backups doosre region mein; disaster par, provision + restore.
   RTO hours-days, RPO = backup interval. cheapest.
PILOT LIGHT        core (usually DB, replicating) hamesha chhota running DR mein;
   baaki sab off. disaster par: scale up + on karो. RTO ~10s of min, RPO ~min.
WARM STANDBY       stack ki ek full par SMALL copy DR mein running, koi traffic nahi.
   disaster par: scale up + DNS cut over. RTO minutes, RPO ~seconds.
ACTIVE-ACTIVE      DR region hamesha live traffic serve karता hai; disaster par bas
   dead one ko routing band karो. RTO ~0, RPO ~0. sabse expensive + sabse complex.
\`\`\`
plus: ek DR RUNBOOK, ek game day mein tested (Lesson 5); regular FAILOVER DRILLS;
DNS TTLs kaafi kam; aur failBACK plan mat bhoolो.

**AWS:** cross-region snapshot copy, S3 CRR, RDS cross-region read replica / Aurora
Global DB, Route 53 health-check failover, AWS Backup. **Azure:** GRS/RA-GRS storage,
Azure Backup + Backup Vault immutability, SQL auto-failover groups, Azure Site
Recovery, Traffic Manager / Front Door failover.`,

    content: `## Capacity planning

Capacity planning is making sure you have enough headroom before the demand arrives, because the lead time to add capacity — a cloud quota increase, a reserved-instance purchase, standing up a new region, or negotiating a bigger database tier — is often measured in weeks, not minutes. It has three inputs. The first is a demand forecast: extrapolate organic growth from the trend of the last six to twelve months, and add the known step changes — a product launch, a marketing campaign, a large customer going live, and any seasonality, with retail traffic around Black Friday being the classic example of a predictable multiple of baseline. The second is your actual capacity, which you get from the stress test in Lesson 4: the knee of the load curve, expressed as requests per second per instance, or in terms of whichever resource saturates first — CPU, connection count, disk IOPS, memory. The third is a headroom target, and the standard is to run normal load at roughly fifty to seventy percent of the knee.

The slack is not waste; it covers four things that happen routinely. A traffic spike that exceeds the forecast. An instance or availability-zone failure that shifts its share of load onto the survivors — this is the N+1 principle, that you size the fleet so that N−1 instances can carry the whole load. A latency regression shipped in a deploy, which makes every request consume more resource than it did yesterday. And autoscaling reaction time: the loop of scrape a metric, evaluate a policy, boot an instance, pull the image, pass readiness checks takes minutes, and a spike can arrive faster than that, so you need enough static headroom to absorb the surge during the ramp. Finally, re-forecast on a regular cadence and track a forward-looking number like "weeks of headroom remaining at the current growth rate", so that the need to act is visible well before it is urgent.

## Backups

The baseline discipline is the 3-2-1 rule: keep three copies of the data, being the live primary plus two backups; on at least two different media or storage types, or equivalently in two different accounts or providers; with at least one copy off-site and either offline or immutable. For anything transactional, add point-in-time recovery: a periodic full snapshot plus a continuous stream of the change log — the write-ahead log in PostgreSQL, the binlog in MySQL, the oplog in MongoDB — so that you can restore to any second, such as thirty seconds before a bad migration ran, rather than only to the last nightly snapshot. Make the backups immutable using S3 Object Lock, Azure immutable blob storage, or GCS retention lock, so that a compromised administrator credential or a ransomware process cannot delete or encrypt them — this is now a primary threat, not a theoretical one. Encrypt backups at rest, keep the key in separate custody from the data, and confirm you can actually decrypt — a key stored only in the account you just lost is not a key. Set an explicit retention schedule, such as forty-eight hourly, thirty daily, and twelve monthly, rather than keeping everything forever or deleting ad hoc. And back up more than the database: object storage, secrets, configuration, infrastructure-as-code state, dashboard definitions, and DNS records are all state you would need to rebuild.

## The restore test

A backup that has never been restored is Schrödinger's backup — simultaneously working and broken until someone opens the box. The failure modes are numerous and common: the backup job has been failing silently for months because nothing alerted on its absence; the snapshot is internally consistent for each file but not consistent across files because the database was not quiesced or snapshotted atomically; the backup cannot be decrypted because the key was co-located with the data; the restore completes but takes fourteen hours against a one-hour recovery-time objective; the restore runbook is out of date or requires an IAM role nobody currently holds. The only way to know is to schedule a real restore into a scratch environment, measure how long it takes end to end, and verify the restored data. That rehearsal is your evidence for the recovery-time objective — without it, the RTO is a wish. Run it quarterly and after any significant change to the data platform.

## RPO and RTO

Two numbers drive every disaster-recovery decision. The recovery point objective is how much data you can afford to lose, expressed as a duration: an RPO of five minutes means your backups or replication must never be more than five minutes behind the primary, and this drives backup and replication frequency. The recovery time objective is how long you can afford to be down: an RTO of one hour means that from the moment a disaster is declared to the moment the service is serving again must be at most one hour, and this drives the choice of DR strategy. Set both per system according to business impact — the payments database and a batch analytics job do not need the same numbers — and understand that tightening either one costs more, roughly exponentially as you approach zero.

## DR strategies

Four strategies trade cost against recovery speed. **Backup and restore** keeps backups in another region and, on a disaster, provisions fresh infrastructure and restores into it; recovery time is hours to days and the recovery point is the backup interval; it is the cheapest and is appropriate for systems that can tolerate a long outage. **Pilot light** keeps the core stateful component — usually the database, continuously replicating — running small in the DR region at all times, with everything stateless switched off; on a disaster you scale up the compute and turn it on, giving a recovery time of tens of minutes and a recovery point of minutes. **Warm standby** runs a complete but under-scaled copy of the whole stack in the DR region, taking no production traffic or only a trickle; on a disaster you scale it up and cut traffic over via DNS, for a recovery time of minutes and a recovery point of seconds. **Active-active** has the second region serving live production traffic continuously, so a disaster is handled simply by stopping routing to the failed region — recovery time and recovery point both near zero — but this is the most expensive option and by far the most complex, because it forces you to solve cross-region data consistency and write-conflict resolution for real; reserve it for the few systems whose business case genuinely justifies it.

Around whichever strategy you choose: maintain a DR runbook and test it in a game day (Lesson 5); run failover drills on a schedule so the procedure is exercised before you need it; keep DNS TTLs low enough that a cutover actually propagates in reasonable time; and plan the failback — returning to the primary region after it recovers is its own procedure and is often forgotten until it is needed.

## Cloud building blocks

On AWS: cross-region snapshot copy and AWS Backup for backups, S3 Cross-Region Replication for object storage, RDS cross-region read replicas and Aurora Global Database for managed-database DR, Route 53 health-check-based failover routing for the traffic cutover, and Elastic Disaster Recovery for lift-and-shift server replication. On Azure: geo-redundant storage in GRS or RA-GRS mode, Azure Backup with Backup Vault immutability, SQL Database auto-failover groups, Azure Site Recovery for VM replication, and Traffic Manager or Front Door for DNS and edge failover. GCP offers multi-region buckets, Cloud SQL cross-region replicas, and Spanner\'s synchronous multi-region configurations. The primitives differ in name but map onto the same four strategies.`,

    contentHi: `## Capacity planning

Capacity planning ye sunishchit karना hai ki aapke paas kaafi headroom hai demand aane se pehle, kyunki capacity add karने ka lead time — ek cloud quota increase, ek reserved-instance purchase, ek naya region khada karना — aksar weeks mein measured hai, minutes mein nahi. Iske teen inputs hain. Pehla ek demand forecast hai: last chhe se baarah months ke trend se organic growth extrapolate karो, aur known step changes add karो — ek product launch, ek marketing campaign, ek bada customer live jaना, aur koi seasonality. Doosra aapki actual capacity hai, jo aap Lesson 4 ke stress test se paते ho: load curve ka knee, requests per second per instance ke roop mein expressed. Teesra ek headroom target hai, aur standard normal load ko knee ke roughly pachaas se sattar percent par run karना hai.

Slack waste nahi hai; ye chaar cheezein cover karता hai jo routinely hoती hain. Ek traffic spike jo forecast se zyada hai. Ek instance ya availability-zone failure jo iski load ka share survivors par shift karता hai — ye N+1 principle hai. Ek deploy mein shipped ek latency regression. Aur autoscaling reaction time: ek metric scrape karो, ek policy evaluate karो, ek instance boot karो, image pull karो, readiness checks pass karो ka loop minutes leता hai. Finally, ek regular cadence par re-forecast karो aur ek forward-looking number track karो jaise "current growth rate par kitne weeks headroom bacha".

## Backups

Baseline discipline 3-2-1 rule hai: data ki teen copies rakhो, being live primary plus do backups; kam se kam do alag media ya storage types par; kam se kam ek copy off-site aur ya to offline ya immutable ke saath. Kisi bhi transactional cheez ke liye, point-in-time recovery add karो: ek periodic full snapshot plus change log ka ek continuous stream — PostgreSQL mein write-ahead log, MySQL mein binlog, MongoDB mein oplog — taaki aap kisi bhi second par restore kar sakो. Backups ko immutable banाओ S3 Object Lock, Azure immutable blob storage, ya GCS retention lock use karके, taaki ek compromised administrator credential ya ek ransomware process unhe delete ya encrypt na kar sake. Backups ko at rest encrypt karो, key ko data se separate custody mein rakhो, aur confirm karो ki aap actually decrypt kar sakते ho. Ek explicit retention schedule set karो. Aur database se zyada back up karो: object storage, secrets, configuration, infrastructure-as-code state, dashboard definitions, aur DNS records.

## Restore test

Ek backup jo kabhi restore nahi kiya gaya Schrödinger's backup hai — ek saath working aur broken jab tak koi box nahi khोलता. Failure modes numerous aur common hain: backup job months se silently fail ho raha hai kyunki iski absence par kuch alert nahi kiया; snapshot har file ke liye internally consistent hai par files ke across consistent nahi; backup decrypt nahi ho sakта kyunki key data ke saath co-located tha; restore complete hota hai par choudah ghante leता hai ek one-hour recovery-time objective ke against. Jaanne ka ekmatra tareeka ek scratch environment mein ek real restore schedule karना hai, measure karना ki ye end to end kitna time leता hai, aur restored data verify karना hai. Wo rehearsal recovery-time objective ke liye aapka evidence hai. Ise quarterly run karो.

## RPO aur RTO

Do numbers har disaster-recovery decision drive karते hain. Recovery point objective ye hai ki aap kitna data lose kar sakते ho, ek duration ke roop mein expressed: ek RPO of five minutes ka matlab aapke backups ya replication kabhi primary se paanch minute se zyada peeche nahi hone chahिए. Recovery time objective ye hai ki aap kitni der down reh sakते ho: ek RTO of one hour ka matlab ek disaster declared hone ke moment se service serving hone ke moment tak zyada se zyada ek ghanta hona chahिए. Dono ko per system business impact ke according set karो, aur samjhो ki kisi bhi ek ko tighten karना zyada cost karता hai, roughly exponentially jaise aap zero ke paas aate ho.

## DR strategies

Chaar strategies cost ko recovery speed ke against trade karती hain. **Backup and restore** backups doosre region mein rakhता hai aur, ek disaster par, fresh infrastructure provision karता hai aur usme restore karता hai; recovery time hours to days hai. **Pilot light** core stateful component — usually database, continuously replicating — DR region mein har waqt chhota running rakhता hai, sab stateless switched off ke saath; ek disaster par aap compute scale up karते ho aur ise on karते ho, ek recovery time of tens of minutes deता hai. **Warm standby** DR region mein poore stack ki ek complete par under-scaled copy run karता hai, koi production traffic nahi leता; ek disaster par aap ise scale up karते ho aur DNS ke via traffic cut over karते ho. **Active-active** mein doosra region continuously live production traffic serve karता hai, to ek disaster simply failed region ko routing band karके handle kiya jaता hai — recovery time aur recovery point dono near zero — par ye sabse expensive option hai.

Jo bhi strategy aap choose karो uske around: ek DR runbook maintain karो aur ise ek game day mein test karो; failover drills ek schedule par run karो; DNS TTLs kaafi low rakhो; aur failback plan karो.

## Cloud building blocks

AWS par: backups ke liye cross-region snapshot copy aur AWS Backup, object storage ke liye S3 Cross-Region Replication, managed-database DR ke liye RDS cross-region read replicas aur Aurora Global Database, traffic cutover ke liye Route 53 health-check-based failover routing. Azure par: GRS ya RA-GRS mode mein geo-redundant storage, Backup Vault immutability ke saath Azure Backup, SQL Database auto-failover groups, VM replication ke liye Azure Site Recovery, aur DNS aur edge failover ke liye Traffic Manager ya Front Door. Primitives naam mein alag hain par same chaar strategies par map karते hain.`,

    examples: [
      {
        title: 'A capacity forecast and a DR strategy chosen from RPO/RTO — worked with numbers',
        titleHi: 'Ek capacity forecast aur RPO/RTO se chuni gayi ek DR strategy — numbers ke saath worked',
        code: `# VERIFY
python - <<'PY'
import math

# ---------- CAPACITY: how many weeks of headroom is left? ----------
knee_rps_per_instance = 1600          # from Lesson 4's stress test (the KNEE)
target_util           = 0.60          # run at 60% of the knee
safe_rps_per_instance = knee_rps_per_instance * target_util
instances             = 20
capacity              = safe_rps_per_instance * instances

current_peak_rps = 14_000
weekly_growth    = 0.035              # 3.5% / week, from the last 12 months' trend

print(f"safe serving rate  : {safe_rps_per_instance:.0f} rps/instance x {instances} = {capacity:.0f} rps")
print(f"current peak        : {current_peak_rps} rps  ({current_peak_rps/capacity:.0%} of safe capacity)")

wk, peak = 0, current_peak_rps
while peak < capacity:
    peak *= (1 + weekly_growth); wk += 1
print(f"weeks until peak hits safe capacity at {weekly_growth:.1%}/wk : {wk}")
print(f"  -> if adding a region takes 6 weeks, you must START in week {wk-6}")

# a known spike on top of the trend:
bf_multiple = 3.2                     # Black Friday historically 3.2x baseline
print(f"Black Friday ({bf_multiple}x) would need {current_peak_rps*bf_multiple/safe_rps_per_instance:.0f} instances "
      f"(have {instances}) -> pre-scale to {math.ceil(current_peak_rps*bf_multiple/safe_rps_per_instance)}")

# ---------- DR: pick a strategy from RPO / RTO ----------
print()
systems = [
    # name,                RPO,      RTO,      -> strategy
    ("payments ledger",    "5 s",    "5 min",  "warm standby (sync replica) or active-active"),
    ("main web app",       "1 min",  "30 min", "pilot light (DB replicating, compute off)"),
    ("analytics warehouse","24 h",   "3 days", "backup & restore (cross-region snapshots)"),
    ("marketing CMS",      "1 h",    "4 h",    "backup & restore"),
]
for name, rpo, rto, strategy in systems:
    print(f"  {name:22} RPO {rpo:6}  RTO {rto:8} -> {strategy}")

# ---------- restore test: is the RTO real? ----------
print()
measured_restore = {"provision_infra": 8, "restore_snapshot": 22, "replay_wal": 6,
                    "smoke_test": 5, "dns_cutover_ttl": 5}
total = sum(measured_restore.values())
print(f"last restore drill: {measured_restore} = {total} min total")
print(f"  RTO target 30 min -> {'PASS' if total <= 30 else 'FAIL'} (measured {total} min)")
PY`,
        output: `safe serving rate  : 960 rps/instance x 20 = 19200 rps
current peak        : 14000 rps  (73% of safe capacity)
weeks until peak hits safe capacity at 3.5%/wk : 10
  -> if adding a region takes 6 weeks, you must START in week 4
Black Friday (3.2x) would need 47 instances (have 20) -> pre-scale to 47

  payments ledger        RPO 5 s     RTO 5 min    -> warm standby (sync replica) or active-active
  main web app           RPO 1 min   RTO 30 min   -> pilot light (DB replicating, compute off)
  analytics warehouse    RPO 24 h    RTO 3 days   -> backup & restore (cross-region snapshots)
  marketing CMS          RPO 1 h     RTO 4 h      -> backup & restore

last restore drill: {'provision_infra': 8, 'restore_snapshot': 22, 'replay_wal': 6, 'smoke_test': 5, 'dns_cutover_ttl': 5} = 46 min total
  RTO target 30 min -> FAIL (measured 46 min)`,
        explain: 'The capacity block turns a stress-test result and a growth trend into a date. The safe serving rate is the knee — 1,600 requests per second per instance from Lesson 4 — run at 60 percent, giving 960 per instance and 19,200 across twenty instances; the current 14,000 peak is already at 73 percent. Compounding 3.5 percent weekly growth, the peak reaches safe capacity in ten weeks, and because standing up a new region takes six weeks, the work must start in week four. Black Friday is calculated separately because it is a known event, not organic growth: a historical 3.2x multiple needs 47 instances, so that is the pre-scale target, booked rather than left to autoscaling. The DR table maps each system\'s RPO and RTO to a strategy — the payments ledger\'s five-second RPO rules out asynchronous replication and forces a synchronous warm standby or active-active, while the analytics warehouse\'s day-scale objectives are met by cheap cross-region snapshots. The final block is the restore drill: 46 measured minutes against a 30-minute RTO means the RTO is currently fictional, and the finding is to either speed up the restore or renegotiate the number with the business.',
        explainHi: 'Capacity block ek stress-test result aur ek growth trend ko ek date mein badalता hai. Safe serving rate knee hai — Lesson 4 se 1,600 requests per second per instance — 60 percent par run, 960 per instance aur bees instances ke across 19,200 deता hai; current 14,000 peak already 73 percent par hai. 3.5 percent weekly growth compound karके, peak das weeks mein safe capacity reach karता hai, aur kyunki ek naya region khada karने mein chhe weeks lagते hain, kaam week chaar mein start hona chahिए. Black Friday alag se calculate kiya jaता hai kyunki ye ek known event hai: ek historical 3.2x multiple ko 47 instances chahिए. DR table har system ke RPO aur RTO ko ek strategy par map karता hai. Final block restore drill hai: ek 30-minute RTO ke against 46 measured minutes ka matlab RTO currently fictional hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "autoscaling will handle it" - no static headroom, no forecast, no pre-scale
  # the fleet runs at 92% CPU normally because "the HPA scales at 80%, we're fine".
  # a marketing email goes out at 9:00am. traffic 4x in 90 seconds.
  # - the HPA sees the metric at 9:00:30 (30s scrape interval)
  # - it decides to scale at 9:01:00 (stabilization window)
  # - new nodes boot + pull images + pass readiness by 9:04:00
  # for 4 minutes the existing fleet takes 4x load at an already-92% baseline ->
  # CPU pegged, latency 20x, half the requests time out. the email's traffic is
  # GONE by the time capacity arrives. autoscaling covered the aftermath, not the spike.`,
        right: `# forecast known events, pre-scale for them, keep static headroom for the rest
  # 1. run normal load at ~60% CPU, not 92% - the 32% gap absorbs a spike during
  #    the autoscaler's reaction time.
  # 2. the marketing team's calendar is an input: schedule a pre-scale (a scheduled
  #    scaling action / a raised min-replicas) 15 min BEFORE the 9:00am send.
  # 3. size min-replicas so N-1 nodes cover the forecast peak (an AZ can fail).
  # 4. load-test the autoscaler itself (Lesson 4 spike test): does it actually
  #    stabilize, or oscillate? what's the real cold-start time?
  # autoscaling is for the GRADUAL and the UNPREDICTED. it is NOT a substitute for
  # headroom or for planning the events you already know about.`,
        why: 'Autoscaling reacts on a timescale of minutes — a metric scrape interval, a stabilisation window to avoid flapping, then instance boot, image pull, and readiness checks — while a marketing send, a flash sale, or a viral link delivers its spike in seconds to a minute or two. If the fleet has no static headroom because it normally runs near the autoscaler\'s trigger threshold, then during the reaction window the existing instances absorb the entire multiple of load on top of an already-high baseline, and they saturate and start timing out before the new capacity is ready — by which point the spike may have passed, so autoscaling served only the recovery, not the event. The correct posture is to run normal load with real headroom, around sixty percent utilisation, so the gap covers a surge during the reaction time; to treat known events as planning inputs and pre-scale for them ahead of time with scheduled scaling or a raised minimum; to size the floor so that N−1 instances still cover the forecast peak against a zone failure; and to load-test the autoscaler itself so its real cold-start time and stability are known rather than assumed.',
        whyHi: 'Autoscaling minutes ke ek timescale par react karता hai — ek metric scrape interval, flapping avoid karने ke liye ek stabilisation window, phir instance boot, image pull, aur readiness checks — jabki ek marketing send, ek flash sale, ya ek viral link apna spike seconds se ek minute ya do mein deliver karता hai. Agmar fleet ke paas koi static headroom nahi hai kyunki ye normally autoscaler ke trigger threshold ke paas run karता hai, to reaction window ke dauraan existing instances ek already-high baseline ke upar load ka poora multiple absorb karते hain, aur wo saturate hote hain aur time out karना shuru karते hain naye capacity ke ready hone se pehle. Correct posture normal load ko real headroom ke saath run karना hai, known events ko planning inputs ke roop mein treat karना aur unke liye pre-scale karना, floor ko size karना taaki N−1 instances abhi bhi forecast peak cover karें, aur autoscaler ko khud load-test karना.',
      },
      {
        wrong: `# backups that exist but have never been restored, and aren't immutable
  # nightly \`pg_dump\` to an S3 bucket. the bucket is in the SAME account, with
  # normal delete permissions. retention: "we keep everything".
  # incident A: a compromised CI token (same account) runs \`aws s3 rm --recursive\`.
  #   every backup is gone in one command, along with the primary.
  # incident B (a different company, same setup): the \`pg_dump\` cron broke in a
  #   base-image bump 4 months ago - it exits 0 but writes a 0-byte file. nobody
  #   restored, nobody alerted on backup SIZE. the "backups" are 120 empty files.
  # both discover at RESTORE TIME - the worst possible time - that there is nothing.`,
        right: `# 3-2-1 + immutability + PITR + a monitored, tested restore
  # - copy 1: primary DB. copy 2: automated snapshots in-region. copy 3: snapshot
  #   copy + WAL archive to a SEPARATE account / another region.
  # - S3 Object Lock (COMPLIANCE mode) on the backup bucket -> even root cannot
  #   delete within the retention window. ransomware / a bad token can't touch it.
  # - PITR: base backup + continuous WAL -> restore to any second.
  # - ALERT on: backup job exit code, backup FILE SIZE (vs 7-day median), backup
  #   AGE (last success < 25h ago), and WAL continuity.
  # - QUARTERLY: automated restore to a scratch account, run the app's smoke
  #   tests against it, record the wall-clock time. THAT number is your RTO.
  # - encryption key in a DIFFERENT trust domain from the data.`,
        why: 'Two independent failure modes, both catching the team at the worst moment. The first is deletion: if the backups live in the same cloud account as the primary, with ordinary delete permissions, then any credential compromise or automation bug that can reach the primary can also erase every backup in a single command — and modern ransomware specifically hunts for and destroys backups first. Immutability with object lock in compliance mode removes this entire class of risk, because the objects cannot be deleted within their retention window by anyone, including the account root. The second is silent corruption: a backup job that breaks in a way that still exits zero — a base-image change, a permissions shift, a disk-full condition — will happily produce empty or truncated files indefinitely, and if the only monitoring is "did the job run" rather than "is the output the expected size and age and internally valid", nobody notices until a restore is attempted and there is nothing to restore. The defence is monitoring the properties of the backup rather than just its existence, and a scheduled real restore that both verifies the data and produces the measured recovery time that the RTO claim depends on.',
        whyHi: 'Do independent failure modes, dono team ko worst moment par pakadते hain. Pehla deletion hai: agmar backups primary ke same cloud account mein rehते hain, ordinary delete permissions ke saath, to koi bhi credential compromise ya automation bug jo primary tak pahunch sakта hai har backup ko ek single command mein bhi erase kar sakта hai — aur modern ransomware specifically backups ko pehle hunt aur destroy karता hai. Compliance mode mein object lock ke saath immutability ye poori class of risk remove karता hai. Doosra silent corruption hai: ek backup job jo ek tarah se break hoती hai jo abhi bhi zero exit karती hai empty ya truncated files indefinitely produce karेगी, aur agmar ekmatra monitoring "kya job chala" hai "kya output expected size aur age hai" ke bजाय, koi notice nahi karता jab tak ek restore attempt nahi hota. Defence backup ki properties monitor karना hai, aur ek scheduled real restore.',
      },
      {
        wrong: `# an RTO in the runbook that no one has ever measured
  # the DR doc says: "RTO: 1 hour. RPO: 15 minutes." it's been that since 2021.
  # a region outage happens. the team starts the failover:
  #   - the Terraform for the DR region hasn't been applied in a year; it errors
  #     on a deprecated resource type. 40 min to fix.
  #   - the RDS snapshot restore for a 2 TB DB takes 3 hours, not "minutes".
  #   - the app won't start: a secret in the DR region's secret store was never
  #     populated. 25 min to find and fix.
  #   - DNS TTL is 3600s, so even after the app is up, users take an hour to move.
  # actual RTO: ~6 hours. the "1 hour" was a number someone typed, never a tested fact.`,
        right: `# derive the RTO from a real drill, then engineer it down to the target
  # run a full DR failover drill (game day, Lesson 5) at least twice a year:
  #   - actually fail over to the DR region (or a faithful rehearsal of it)
  #   - time every phase: infra apply, DB restore, secret/config load, app start,
  #     smoke tests, DNS cutover + propagation
  #   - the SUM is your real RTO. publish THAT, not an aspiration.
  # then close the gap to the target deliberately:
  #   - keep DR IaC continuously applied (pilot light) so there's no "apply" phase
  #   - pre-restore + keep a replica warm so DB recovery is a promote, not a restore
  #   - replicate secrets/config to DR as part of the pipeline
  #   - drop DNS TTL to 60s for records involved in failover
  # the RTO is an OUTPUT of the architecture + a MEASURED drill, never an input you wish for.`,
        why: 'A recovery-time objective written in a document without a drill behind it is not an objective, it is a hope, and it is routinely wrong by an order of magnitude because every unmeasured phase of a recovery takes longer than people assume. Infrastructure-as-code for a standby region that has not been applied in months has drifted and will error on deprecated resource types. A database "restore" that was imagined as taking minutes takes hours for a multi-terabyte dataset. Secrets and configuration that were set up once in the primary region were never replicated to the DR region and block application start. And even after the service is healthy, a DNS record with a one-hour TTL means users take an hour to arrive. The only way to have a real number is to run a full failover drill, at least twice a year, timing every phase, and take the sum as the RTO — then engineer that number down toward the target deliberately: keep the DR infrastructure continuously applied so there is no apply phase, keep a warm replica so recovery is a fast promotion rather than a slow restore, replicate secrets and config through the pipeline, and lower the TTLs on the records that participate in failover. The RTO is an output of the architecture and a measured drill, never an aspiration typed into a runbook.',
        whyHi: 'Ek recovery-time objective jo ek document mein bina ek drill ke peeche likha hai ek objective nahi hai, ek hope hai, aur ye routinely ek order of magnitude se galat hai kyunki ek recovery ka har unmeasured phase log jitna assume karते hain usse zyada time leता hai. Ek standby region ke liye infrastructure-as-code jo months se apply nahi hui hai drift ho gayi hai aur deprecated resource types par error karेगी. Ek database "restore" jo minutes lene ke roop mein imagine kiya gaya tha ek multi-terabyte dataset ke liye hours leता hai. Secrets aur configuration jo primary region mein ek baar set up kiye gaye the DR region mein kabhi replicate nahi hue aur application start block karते hain. Ekmatra tareeka ek real number rakhने ka ek full failover drill run karना hai, saal mein kam se kam do baar, har phase time karके, aur sum ko RTO ke roop mein lena — phir us number ko target ki taraf deliberately engineer karना neeche. RTO architecture aur ek measured drill ka ek output hai, kabhi ek aspiration nahi.',
      },
    ],

    realWorld: [
      {
        en: '**GitLab\'s 2017 database incident** — an engineer accidentally deleted the primary database directory. Of five documented backup/replication mechanisms, none worked: pg_dump was silently failing on a version mismatch, S3 backups were empty, replication had been re-initialised. They recovered from a six-hour-old staging snapshot one engineer happened to have taken manually. The lesson the whole industry quotes: a backup is not a backup until a restore has succeeded.',
        hi: '**GitLab ka 2017 database incident** — ek engineer ne galti se primary database directory delete kar diya. Paanch documented backup/replication mechanisms mein se, koi kaam nahi kiya: pg_dump ek version mismatch par silently fail ho raha tha, S3 backups empty the. Wo ek chhe-ghante purане staging snapshot se recover hue jo ek engineer ne manually liya tha. Lesson: ek backup ek backup nahi hai jab tak ek restore succeed nahi hua.',
      },
      {
        en: '**A ransomware hit where immutability saved the company** — an attacker with domain admin encrypted the primary and the NAS backups, then ran `aws s3 rm` on the cloud backup bucket. The bucket had Object Lock in compliance mode with a 35-day retention; the delete calls returned AccessDenied. They restored from an object 3 days old. Without the lock, there would have been no company.',
        hi: '**Ek ransomware hit jahaan immutability ne company bachai** — ek attacker jiske paas domain admin tha ne primary aur NAS backups encrypt kiye, phir cloud backup bucket par `aws s3 rm` chalaya. Bucket mein 35-din retention ke saath compliance mode mein Object Lock tha; delete calls ne AccessDenied return kiya. Wo ek 3-din purане object se restore hue.',
      },
      {
        en: '**RPO/RTO mismatch found in a game day, not an outage** — a fintech\'s DR doc claimed RPO 1 min via async replica. A game day measured actual replica lag under production write load at 8-40 minutes during batch jobs. For a payments ledger that was unacceptable; they moved that one database to synchronous replication (accepting the write-latency cost) and left the rest async. Found on a Tuesday, not during a disaster.',
        hi: '**RPO/RTO mismatch ek game day mein paya gaya, ek outage mein nahi** — ek fintech ke DR doc ne async replica ke via RPO 1 min claim kiya. Ek game day ne production write load ke tehat actual replica lag ko batch jobs ke dauraan 8-40 minute par measure kiya. Ek payments ledger ke liye wo unacceptable tha; unhone us ek database ko synchronous replication par move kiya aur baaki ko async chhoda.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you do capacity planning, and why is autoscaling not a substitute for it?',
        qHi: 'Aap capacity planning kaise karते ho, aur kyun autoscaling iska substitute nahi hai?',
        a: 'Capacity planning has three inputs. First, a demand forecast: extrapolate organic growth from the last six to twelve months of trend, then add the known step changes — a launch, a marketing campaign, a big customer onboarding, seasonal peaks like Black Friday. Second, your real capacity, taken from a stress test: the knee of the load curve in requests per second per instance, or whichever resource saturates first. Third, a headroom target — run normal load at roughly fifty to seventy percent of the knee. The headroom is not waste; it absorbs a spike above forecast, the redistribution of load when an instance or zone fails (the N+1 principle, sizing so N−1 carry the load), a latency regression from a deploy, and the autoscaler\'s own reaction time. Then you re-forecast regularly and track weeks of headroom remaining, because adding capacity — quota increases, reserved instances, a new region — can take weeks of lead time. Autoscaling is not a substitute because it reacts in minutes: a scrape interval, a stabilisation window, then boot, image pull, and readiness. A marketing send or a viral moment spikes in seconds, and if there is no static headroom the existing fleet saturates and times out before new capacity arrives, so autoscaling ends up serving the recovery rather than the event. Autoscaling handles gradual growth and the genuinely unpredicted; it does not handle events you already know about, and it does not replace headroom.',
        aHi: 'Capacity planning ke teen inputs hain. Pehle, ek demand forecast: last chhe se baarah months ke trend se organic growth extrapolate karो, phir known step changes add karो — ek launch, ek marketing campaign, seasonal peaks. Doosre, aapki real capacity, ek stress test se li gayi: load curve ka knee requests per second per instance mein. Teesre, ek headroom target — normal load ko knee ke roughly pachaas se sattar percent par run karो. Headroom waste nahi hai; ye forecast se upar ek spike absorb karता hai, ek instance ya zone fail hone par load ka redistribution, ek deploy se ek latency regression, aur autoscaler ka apna reaction time. Autoscaling ek substitute nahi hai kyunki ye minutes mein react karता hai. Ek marketing send seconds mein spike karता hai, aur agmar koi static headroom nahi hai to existing fleet saturate hoती hai aur time out karती hai naye capacity ke aane se pehle. Autoscaling gradual growth aur genuinely unpredicted handle karता hai; ye un events ko handle nahi karता jinke baare mein aap already jaनते ho.',
      },
      {
        q: 'What is the 3-2-1 backup rule, and what do immutability and point-in-time recovery add?',
        qHi: '3-2-1 backup rule kya hai, aur immutability aur point-in-time recovery kya add karते hain?',
        a: 'The 3-2-1 rule is the minimum backup discipline: keep three copies of the data — the live primary plus two backups; store them on at least two different media or storage types, or equivalently in two different accounts or providers; and keep at least one copy off-site and either fully offline or immutable. Point-in-time recovery adds the ability to restore to any moment rather than only to the last snapshot: you take a periodic full backup and then continuously archive the database change log — the write-ahead log, binlog, or oplog — so that recovery can be targeted to, say, thirty seconds before a destructive migration, losing only seconds of data instead of up to a whole snapshot interval. Immutability means the backup storage is configured with object lock, WORM, or a retention lock so that the backup objects physically cannot be deleted or overwritten within their retention window by anyone, including a fully compromised administrator or the account root. This matters because a credential compromise or an automation bug that can reach the primary can usually also reach backups stored in the same account with normal permissions, and modern ransomware deliberately seeks out and destroys backups before encrypting the primary. Immutability turns "the attacker deleted our backups" into "the delete calls returned access-denied". Alongside these, encrypt the backups and keep the key in a separate trust domain, set an explicit retention schedule, and back up non-database state too — object storage, secrets, config, IaC state, DNS.',
        aHi: '3-2-1 rule minimum backup discipline hai: data ki teen copies rakhो — live primary plus do backups; unhe kam se kam do alag media ya storage types par store karो; aur kam se kam ek copy off-site aur ya to fully offline ya immutable rakhो. Point-in-time recovery kisi bhi moment par restore karने ki ability add karता hai: aap ek periodic full backup lete ho aur phir continuously database change log archive karते ho, taaki recovery ko, say, ek destructive migration se tees second pehle target kiya ja sake. Immutability ka matlab backup storage object lock ke saath configured hai taaki backup objects physically delete ya overwrite nahi ho sakते unke retention window ke andar kisi dwara, including ek fully compromised administrator. Ye matter karता hai kyunki modern ransomware deliberately backups ko seek out aur destroy karता hai primary ko encrypt karने se pehle. Inke alongside, backups ko encrypt karो aur key ko ek separate trust domain mein rakhो.',
      },
      {
        q: 'Define RPO and RTO and walk through the four DR strategies and when each fits.',
        qHi: 'RPO aur RTO define karो aur chaar DR strategies ke through chalो.',
        a: 'The recovery point objective is how much data you can afford to lose, expressed as time — an RPO of five minutes means backups or replication must never lag the primary by more than five minutes, and it drives how frequently you back up or how synchronous your replication is. The recovery time objective is how long you can afford to be down — an RTO of one hour means from declaring a disaster to serving traffic again must be under an hour, and it drives the DR strategy. Both are set per system from business impact, and tightening either costs more, roughly exponentially near zero. The four strategies: backup and restore keeps backups in another region and provisions and restores on disaster — recovery time of hours to days, cheapest, fine for systems that tolerate a long outage. Pilot light keeps the stateful core, usually the database, replicating and running small in the DR region with everything stateless switched off; on disaster you scale up and turn on — tens of minutes to recover, minutes of data loss. Warm standby runs a complete but under-scaled copy of the whole stack in DR taking little or no traffic; on disaster you scale up and cut over DNS — minutes to recover, seconds of data loss. Active-active serves live traffic from both regions continuously, so disaster recovery is just withdrawing routing from the failed region — near-zero on both objectives, but the most expensive and most complex because you must solve cross-region consistency and write conflicts. Around all of them you need a tested runbook, scheduled failover drills, low DNS TTLs, and a failback plan.',
        aHi: 'Recovery point objective ye hai ki aap kitna data lose kar sakते ho, time ke roop mein expressed — ek RPO of five minutes ka matlab backups ya replication primary ko paanch minute se zyada lag nahi karने chahिए, aur ye drive karता hai ki aap kitni frequently back up karते ho. Recovery time objective ye hai ki aap kitni der down reh sakते ho — ek RTO of one hour ka matlab ek disaster declare karने se traffic serve karने tak ek ghante ke andar hona chahिए, aur ye DR strategy drive karता hai. Dono per system business impact se set kiye jaते hain. Chaar strategies: backup and restore backups doosre region mein rakhता hai aur disaster par provision aur restore karता hai — hours to days, cheapest. Pilot light stateful core ko replicating aur DR region mein chhota running rakhता hai; disaster par aap scale up karते ho — tens of minutes. Warm standby DR mein poore stack ki ek complete par under-scaled copy run karता hai; disaster par aap scale up karते ho aur DNS cut over karते ho — minutes. Active-active dono regions se continuously live traffic serve karता hai — near-zero dono objectives par, par sabse expensive aur complex. Sab ke around aapko ek tested runbook, scheduled failover drills, low DNS TTLs, aur ek failback plan chahिए.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain capacity planning (the three inputs, the headroom target and the four things it covers) and why autoscaling does not replace it.',
        taskHi: 'Ek comment mein, capacity planning samjhाओ aur kyun autoscaling ise replace nahi karता.',
        hint: 'CAPACITY PLANNING = have enough headroom BEFORE demand arrives, because the LEAD TIME to add capacity (cloud quota increase, reserved-instance purchase, standing up a new region, a bigger DB tier) is WEEKS, not minutes. THREE INPUTS: (1) DEMAND FORECAST — extrapolate ORGANIC growth from the last 6-12 months\' trend, THEN add KNOWN step changes: a product launch, a marketing campaign, a big customer going live, seasonality (Black Friday retail = a predictable multiple of baseline). (2) YOUR CAPACITY — from Lesson 4\'s stress test: the KNEE, in req/s per instance, or the resource that saturates first (CPU / connections / disk IOPS / memory). (3) HEADROOM TARGET — run normal load at ~50-70% of the knee. THE HEADROOM COVERS FOUR THINGS (it is not waste): (a) a traffic spike ABOVE forecast; (b) an instance / AZ failure that shifts its load onto the survivors — the N+1 principle: size the fleet so N-1 instances carry the whole load; (c) a LATENCY REGRESSION shipped in a deploy — every request now costs more resource than yesterday; (d) AUTOSCALER REACTION TIME — the scrape→evaluate→boot→image-pull→readiness loop is MINUTES; a spike can be faster, so you need STATIC headroom to absorb the surge during the ramp. Then RE-FORECAST on a cadence and track a forward number: "weeks of headroom left at current growth" → act well before it is urgent. WHY AUTOSCALING IS NOT A SUBSTITUTE: it reacts in minutes (scrape interval + stabilization window + boot + image pull + readiness); a marketing send / flash sale / viral link spikes in SECONDS. With no static headroom, the existing fleet absorbs the full multiple on top of an already-high baseline → saturates → times out BEFORE new capacity is ready → the spike is often OVER by then → autoscaling served the AFTERMATH, not the event. Autoscaling is for the GRADUAL and the UNPREDICTED; it does NOT handle events you already know about, and it does NOT replace headroom. Also: load-test the autoscaler itself — does it stabilize or oscillate? what is its real cold-start time?',
        hintHi: 'CAPACITY PLANNING = kaafi headroom rakhो demand aane se PEHLE, kyunki capacity add karne ka LEAD TIME (quota increase, reserved instances, ek naya region) WEEKS hai. TEEN INPUTS: (1) DEMAND FORECAST — last 6-12 months ke trend se ORGANIC growth extrapolate karो, PHIR KNOWN step changes add karो (launch, marketing push, bada customer, seasonality). (2) YOUR CAPACITY — Lesson 4 ke stress test se: KNEE, req/s per instance. (3) HEADROOM TARGET — normal load ko knee ke ~50-70% par run karो. HEADROOM CHAAR CHEEZEIN COVER KARTA HAI: (a) forecast se UPAR ek spike; (b) ek instance/AZ failure jo load survivors par shift karता hai — N+1: N-1 instances poori load carry karें; (c) ek deploy se LATENCY REGRESSION; (d) AUTOSCALER REACTION TIME — loop MINUTES hai, spike faster ho sakта hai. RE-FORECAST karो; "weeks of headroom left" track karो. AUTOSCALING SUBSTITUTE KYUN NAHI: ye minutes mein react karता hai; ek marketing send SECONDS mein spike karता hai → existing fleet saturate → time out → spike OVER → autoscaling AFTERMATH serve karता hai. Ye GRADUAL aur UNPREDICTED ke liye hai.',
      },
      {
        task: 'In a comment, give the 3-2-1 rule, explain PITR and immutability and why each matters, the restore test / "Schrödinger\'s backup", and what non-DB state to back up.',
        taskHi: 'Ek comment mein, 3-2-1 rule do, PITR aur immutability samjhाओ, restore test, aur konsa non-DB state back up karें.',
        hint: '3-2-1 RULE (the minimum): 3 copies of the data (1 live primary + 2 backups); on 2 different media / storage types (or 2 different accounts / providers); 1 copy OFF-SITE and OFFLINE-or-IMMUTABLE (air-gapped, or object-lock / WORM). PITR (point-in-time recovery): a periodic full snapshot + a CONTINUOUS stream of the change log — PostgreSQL WAL / MySQL binlog / MongoDB oplog — archived → restore to ANY SECOND (e.g. "30s before the bad migration"), losing seconds of data instead of up to a whole snapshot interval. WHY IT MATTERS: a nightly-snapshot-only design has an RPO of up to 24h; PITR takes the RPO to seconds. IMMUTABILITY: S3 Object Lock (COMPLIANCE mode) / Azure immutable blob / GCS retention lock → the backup objects PHYSICALLY cannot be deleted or overwritten within the retention window by ANYONE, including a fully compromised admin or the account root. WHY IT MATTERS: a credential compromise or automation bug that can reach the PRIMARY can usually also reach backups in the SAME account with normal delete permissions — one `aws s3 rm --recursive` and everything is gone; modern ransomware DELIBERATELY hunts and destroys backups BEFORE encrypting the primary. Immutability turns "the attacker deleted our backups" into "the delete calls returned AccessDenied". THE RESTORE TEST — "a backup you have never restored is SCHRÖDINGER\'S BACKUP": simultaneously working and broken until you actually try it. Common silent failures: the backup job has been failing for months and exits 0 writing a 0-byte file (nobody alerted on SIZE / AGE); the snapshot is consistent per-file but not ACROSS files (no quiesce / not atomic); you cannot DECRYPT it (the key was in the account you lost); the restore takes 14h against a 1h RTO; the runbook is stale / needs an IAM role nobody has. FIX: SCHEDULE a real restore to a scratch environment, MEASURE the wall-clock time end-to-end, VERIFY the data (run the app\'s smoke tests against it) — that measured number IS your RTO evidence; quarterly + after big changes. Also ALERT on: backup job exit code, file SIZE vs a rolling median, backup AGE (last success < 25h), WAL/log continuity. NON-DB STATE TO BACK UP (all of it is state you would need to rebuild): object storage (S3 buckets), secrets, configuration, infrastructure-as-code state (the Terraform state file), dashboard + alert definitions, DNS records, and the encryption keys themselves (in a different trust domain).',
        hintHi: '3-2-1 RULE: 3 copies (1 primary + 2 backups); 2 alag media / storage types (ya 2 accounts / providers); 1 copy OFF-SITE aur OFFLINE-ya-IMMUTABLE. PITR: ek periodic full snapshot + change log (WAL / binlog / oplog) ka ek CONTINUOUS stream → KISI bhi second par restore → RPO seconds tak (24h nahi). IMMUTABILITY: S3 Object Lock (COMPLIANCE) / Azure immutable blob → backup objects PHYSICALLY delete nahi ho sakते retention window mein KISI dwara (compromised admin / root bhi nahi). KYUN: ek credential compromise jo PRIMARY tak pahunchता hai same account ke backups tak bhi pahunchता hai — ek `aws s3 rm` aur sab gaya; ransomware DELIBERATELY backups pehle destroy karता hai. RESTORE TEST — "ek backup jo aapne kabhi restore nahi kiya SCHRÖDINGER\'S BACKUP hai". Silent failures: job months se fail, 0-byte file, exits 0; snapshot files ke ACROSS consistent nahi; DECRYPT nahi kar sakते; restore 14h vs 1h RTO; runbook stale. FIX: ek scratch env mein ek real restore SCHEDULE karो, wall-clock time MEASURE karो, data VERIFY karो — wo number AAPKA RTO evidence hai; quarterly. ALERT on: exit code, file SIZE, AGE (< 25h), WAL continuity. NON-DB STATE: object storage, secrets, config, IaC state (Terraform state file), dashboards, DNS, encryption keys.',
      },
      {
        task: 'In a comment, define RPO and RTO, describe the four DR strategies with their RPO/RTO and cost, and explain why an RTO must come from a measured drill.',
        taskHi: 'Ek comment mein, RPO aur RTO define karो, chaar DR strategies describe karो, aur samjhाओ kyun ek RTO ek measured drill se aana chahिए.',
        hint: 'RPO (Recovery Point Objective) = how much DATA you can afford to lose, as a DURATION. "RPO = 5 min" → backups / replication must never lag the primary by > 5 min. Drives backup FREQUENCY / replication synchrony. RTO (Recovery Time Objective) = how long you can afford to be DOWN. "RTO = 1 hour" → from disaster DECLARED to service SERVING again must be ≤ 1 hour. Drives the DR STRATEGY. Set BOTH per-system from business impact (the payments ledger and a batch analytics job do NOT get the same numbers). Tightening either costs more — roughly EXPONENTIALLY as you approach zero. FOUR DR STRATEGIES (cheaper/slower → pricier/faster): (1) BACKUP & RESTORE — backups in another region; on disaster, provision fresh infra + restore. RTO hours-days, RPO = backup interval. Cheapest. For systems that tolerate a long outage. (2) PILOT LIGHT — the stateful core (usually the DB, continuously replicating) runs SMALL in the DR region at all times; everything stateless is OFF. On disaster: scale up the compute + turn on. RTO ~tens of minutes, RPO ~minutes. (3) WARM STANDBY — a COMPLETE but UNDER-SCALED copy of the whole stack runs in DR, taking no traffic (or a trickle). On disaster: scale up + cut over DNS. RTO ~minutes, RPO ~seconds. (4) ACTIVE-ACTIVE — the DR region serves LIVE traffic continuously; on disaster just STOP routing to the dead region. RTO ~0, RPO ~0. MOST expensive + MOST complex — you must solve cross-region data consistency + write-conflict resolution for real. Reserve for the few systems that truly justify it. AROUND ANY STRATEGY: a DR RUNBOOK tested in a game day (Lesson 5); scheduled FAILOVER DRILLS; DNS TTLs low enough (e.g. 60s) that a cutover actually propagates; and a FAILBACK plan (returning to the primary after it recovers is its own procedure, usually forgotten). WHY THE RTO MUST COME FROM A MEASURED DRILL: an RTO written in a doc without a drill behind it is a HOPE, and it is routinely wrong by an ORDER OF MAGNITUDE because every unmeasured phase takes longer than assumed: DR IaC not applied in a year errors on deprecated resources (40 min); a 2 TB DB "restore" imagined as minutes takes 3 hours; a secret was never populated in the DR region (25 min to find); DNS TTL 3600s means users take an hour to move even after the app is up. Run a FULL failover drill ≥ 2x/year, time EVERY phase (infra apply, DB restore, secret/config load, app start, smoke tests, DNS cutover + propagation), and the SUM is your real RTO — publish THAT. Then engineer it down to target: keep DR IaC continuously applied (no apply phase), keep a warm replica (promote, not restore), replicate secrets/config via the pipeline, drop failover-record TTLs. The RTO is an OUTPUT of the architecture + a measured drill, never an input you wish for.',
        hintHi: 'RPO = kitna DATA lose kar sakते ho, ek DURATION ke roop mein. Drives backup FREQUENCY. RTO = kitni der DOWN reh sakते ho (disaster DECLARED se SERVING tak). Drives DR STRATEGY. BOTH per-system business impact se. Tighten karना EXPONENTIALLY zyada expensive. CHAAR STRATEGIES: (1) BACKUP & RESTORE — backups doosre region mein; disaster par provision + restore. RTO hours-days, RPO = backup interval. Cheapest. (2) PILOT LIGHT — stateful core (DB replicating) SMALL running; stateless OFF. Disaster: scale up + on. RTO ~tens of min, RPO ~min. (3) WARM STANDBY — poore stack ki COMPLETE par UNDER-SCALED copy, koi traffic nahi. Disaster: scale up + DNS cut over. RTO ~min, RPO ~sec. (4) ACTIVE-ACTIVE — DR region LIVE traffic serve karता hai; disaster par bas routing band. RTO ~0, RPO ~0. MOST expensive + complex (cross-region consistency + write conflicts). AROUND ANY: DR RUNBOOK (game day tested), FAILOVER DRILLS, low DNS TTLs, FAILBACK plan. RTO MEASURED DRILL SE KYUN: bina drill ke ek RTO ek HOPE hai, routinely ORDER OF MAGNITUDE se galat — DR IaC saal se apply nahi (40 min), 2 TB DB restore 3 hours, ek secret DR mein kabhi populate nahi (25 min), DNS TTL 3600s. FULL drill ≥ 2x/year, EVERY phase time karो, SUM = real RTO. Phir target tak engineer karो. RTO ek OUTPUT hai, ek wish nahi.',
      },
    ],

    keyTakeaways: [
      'CAPACITY PLANNING = headroom BEFORE you need it (lead time to add capacity = weeks). Three inputs: (1) forecast = organic trend + known events (launches, Black Friday); (2) capacity = the KNEE from a stress test (req/s per instance); (3) headroom target = run at 50-70% of the knee. The slack covers a spike above forecast, an AZ failure redistributing load (N+1: N-1 must cope), a deploy latency regression, and autoscaler reaction time (minutes). Track "weeks of headroom left".',
      'AUTOSCALING IS NOT CAPACITY PLANNING: it reacts in minutes (scrape → stabilize → boot → image pull → readiness); a marketing send / viral spike hits in seconds. With no static headroom the fleet saturates and times out before new capacity lands — autoscaling served the aftermath. Pre-scale for KNOWN events; autoscaling is for gradual growth and the genuinely unpredicted.',
      '3-2-1 BACKUPS: 3 copies, 2 media/accounts, 1 off-site + offline-or-IMMUTABLE. Add PITR (snapshot + continuous WAL/binlog/oplog → restore to any second) to take RPO from ~24h to seconds. Add IMMUTABILITY (S3 Object Lock compliance mode / Azure immutable blob) so a compromised admin or ransomware CANNOT delete the backups — modern ransomware hunts backups first. Encrypt with the key in a separate trust domain. Back up non-DB state too: object storage, secrets, config, IaC state, DNS.',
      'A BACKUP YOU HAVE NEVER RESTORED IS SCHRÖDINGER\'S BACKUP — working and broken until you try it. Silent failures: the job exits 0 writing 0 bytes; not consistent across files; can\'t decrypt; restore takes 14h vs a 1h RTO; stale runbook. SCHEDULE a real restore to a scratch env quarterly, MEASURE the wall-clock time, VERIFY the data — that number IS your RTO evidence. Alert on backup size, age, and job exit code, not just "did it run".',
      'RPO (data loss you can accept, as time → backup frequency) and RTO (downtime you can accept → DR strategy), set per-system, tightening costs ~exponentially. FOUR STRATEGIES: backup & restore (RTO hrs-days, cheapest) → pilot light (DB replicating, compute off; RTO ~10s min) → warm standby (full small stack, no traffic; RTO ~min) → active-active (both regions live; RTO ~0, priciest + hardest: cross-region consistency). Around all: a game-day-tested runbook, failover DRILLS, low DNS TTLs, a failback plan. The RTO is an OUTPUT of a measured drill, never a number typed in a doc.',
    ],
    keyTakeawaysHi: [
      'CAPACITY PLANNING = headroom ISSE PEHLE ki chahिए (capacity add karne ka lead time = weeks). Teen inputs: (1) forecast = organic trend + known events; (2) capacity = ek stress test se KNEE (req/s per instance); (3) headroom target = knee ke 50-70% par run. Slack cover karता hai: forecast se upar spike, ek AZ failure load redistribute karता hua (N+1), ek deploy latency regression, autoscaler reaction time (minutes). "Weeks of headroom left" track karो.',
      'AUTOSCALING CAPACITY PLANNING NAHI HAI: ye minutes mein react karता hai; ek marketing send / viral spike seconds mein hit karता hai. Bina static headroom, fleet saturate hoती hai aur time out karती hai naye capacity ke aane se pehle. KNOWN events ke liye pre-scale karो; autoscaling gradual growth ke liye hai.',
      '3-2-1 BACKUPS: 3 copies, 2 media/accounts, 1 off-site + offline-ya-IMMUTABLE. PITR add karो (snapshot + continuous WAL/binlog/oplog → kisi bhi second par restore) → RPO ~24h se seconds tak. IMMUTABILITY add karो (S3 Object Lock compliance mode) taaki ek compromised admin ya ransomware backups DELETE NA kar sake — modern ransomware backups pehle hunt karता hai. Key ko ek separate trust domain mein rakhके encrypt karो. Non-DB state bhi back up karो: object storage, secrets, config, IaC state, DNS.',
      'EK BACKUP JO AAPNE KABHI RESTORE NAHI KIYA SCHRÖDINGER\'S BACKUP HAI — working aur broken jab tak aap try nahi karते. Silent failures: job 0 bytes likhता exits 0; files ke across consistent nahi; decrypt nahi kar sakते; restore 14h vs 1h RTO; stale runbook. Ek scratch env mein ek real restore quarterly SCHEDULE karो, wall-clock time MEASURE karो, data VERIFY karो — wo number AAPKA RTO evidence hai. Backup size, age, aur exit code par alert karो.',
      'RPO (data loss jo accept kar sakते ho, time ke roop mein → backup frequency) aur RTO (downtime jo accept kar sakते ho → DR strategy), per-system set, tighten karना ~exponentially expensive. CHAAR STRATEGIES: backup & restore (RTO hrs-days, cheapest) → pilot light (DB replicating, compute off; RTO ~10s min) → warm standby (full small stack, koi traffic nahi; RTO ~min) → active-active (dono regions live; RTO ~0, priciest + hardest). Sab ke around: ek game-day-tested runbook, failover DRILLS, low DNS TTLs, ek failback plan. RTO ek measured drill ka OUTPUT hai, kabhi ek doc mein typed number nahi.',
    ],
  },
];
