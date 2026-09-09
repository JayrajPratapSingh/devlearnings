import type { CourseLesson } from './course-js-module1';

// DevOps Module 17 — Reliability Engineering, Capacity & Disaster Recovery
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module17-part2.ts.
//
// VERIFICATION: `# VERIFY` examples run real, deterministic, offline computations:
//   L1  availability math       - python (nines, serial/parallel composition)
//   L2  retry backoff + budget  - python (full jitter vs none; a retry-budget cap)
//   L3  token-bucket rate limit - python (burst allowance -> sustained refill rate)
//   L4  k6 v2.2.0 `k6 inspect`  - parses + validates a load script offline (part 2)
// L5 (chaos) and L6 (capacity/backups/DR) are prose + realistic output.

export const DEVOPS_MODULE_17: CourseLesson[] = [
  {
    slug: 'ops-availability-math-and-failure-domains',
    title: 'Availability Math & Failure Domains',
    titleHi: 'Availability Math Aur Failure Domains',
    description:
      'The arithmetic that governs how reliable a system can be: what each "nine" costs in monthly downtime, why dependencies in series multiply their failure rates so a chain is always less available than its weakest link, why redundant copies in parallel multiply their *failure* probabilities and become far more available, and why a failure domain (a shared power feed, a shared deploy, a shared dependency) makes "independent" copies fail together.',
    descriptionHi:
      'Wo arithmetic jo govern karता hai ek system kitna reliable ho sakta hai: har "nine" monthly downtime mein kya cost karता hai, dependencies series mein apne failure rates kyun multiply karती hain to ek chain hamesha apne weakest link se kam available hai, parallel mein redundant copies apni *failure* probabilities kyun multiply karती hain aur kaafi zyada available ban jaती hain, aur ek failure domain (ek shared power feed, ek shared deploy, ek shared dependency) "independent" copies ko ek saath fail kyun karवाता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A chain of ropes versus a bundle of ropes.** If you tie ropes end to end (dependencies in series), the chain snaps when *any* rope snaps — the probability of the whole chain holding is every rope\'s probability multiplied together, so a chain of three 99.9%-reliable ropes holds only 99.7% of the time. If you braid ropes side by side to share the load (redundancy in parallel), the bundle fails only when *every* strand fails — the failure probabilities multiply, so two 99%-reliable strands together give 99.99%. The catch: if all the strands came from the same bad batch, or share the same frayed anchor point, they are not independent, and the bundle is only as strong as that one shared weakness (a failure domain).',
      hi: '**Ropes ki ek chain versus ropes ka ek bundle.** Agar aap ropes ko end to end tie karते ho (series mein dependencies), chain tab snap karती hai jab *koi bhi* rope snap karती hai — poori chain ke hold karने ki probability har rope ki probability ek saath multiply hai, to teen 99.9%-reliable ropes ki ek chain sirf 99.7% samay hold karती hai. Agar aap ropes ko side by side braid karते ho load share karने ke liye (parallel mein redundancy), bundle sirf tab fail karता hai jab *har* strand fail karता hai — failure probabilities multiply hoती hain, to do 99%-reliable strands ek saath 99.99% dete hain. Catch: agar saare strands same bad batch se aaye, ya same frayed anchor point share karते hain, wo independent nahi hain (ek failure domain).',
    },

    simple: `**AVAILABILITY** = fraction of time the system does its job. Stated in "nines":
\`\`\`
        %          downtime/month   downtime/year
99%     (two 9s)   ~7.3 hours       ~3.65 days
99.9%   (three)    ~43 minutes      ~8.8 hours
99.95%             ~22 minutes      ~4.4 hours
99.99%  (four)     ~4.3 minutes     ~53 minutes
99.999% (five)     ~26 seconds      ~5.3 minutes
\`\`\`
each extra nine ~= 10x LESS downtime budget = ~10x the engineering + infra.
99.999% means a routine deploy blip, a dependency's bad minute, or a slow GC pause
can each blow the whole month. don't chase nines you don't need (Module 15 L6 SLOs).

**SERIES (dependencies) - failure rates ADD, availabilities MULTIPLY:**
\`\`\`
if a request needs A AND B AND C, all of which must be up:
  A_up x B_up x C_up
  0.999 x 0.999 x 0.999 = 0.9970   -> a chain of three 99.9%s is only 99.7%
KEY CONSEQUENCE: adding a dependency ALWAYS lowers your availability, even a very
  reliable one.  99.9% service + a 99.99% dependency = 0.999 x 0.9999 = 99.89%.
  -> minimise the number of things on the critical path. cache. degrade gracefully.
\`\`\`

**PARALLEL (redundancy) - FAILURE probabilities MULTIPLY:**
\`\`\`
if the system is up as long as AT LEAST ONE of N replicas is up:
  1 - (1 - r)^N
  two 99% replicas:  1 - (0.01)^2   = 0.9999    (99% -> 99.99%)
  three 99% replicas: 1 - (0.01)^3  = 0.999999  (99% -> 99.9999%)
-> redundancy is the big lever. but only if the replicas fail INDEPENDENTLY.
\`\`\`

**FAILURE DOMAINS - the "independent" assumption is usually a lie:**
\`\`\`
a failure domain = a scope within which one fault takes everything down together.
  - the same RACK / power feed / top-of-rack switch
  - the same AVAILABILITY ZONE (Module 13)
  - the same REGION
  - the same DEPLOY (a bad version rolls to all replicas)
  - the same DEPENDENCY (all replicas call the same broken DB / config service / DNS)
  - the same BUG (a leap-second, a cert expiry, a poison message hits every instance)
CORRELATED FAILURE breaks the parallel math: two replicas that share a power feed
  are NOT  1 - (1-r)^2  - they're closer to  r  for the shared-fault modes.
-> spread replicas across failure domains. AZ-anti-affinity. staggered deploys /
   canaries. per-replica config. and know your SHARED dependencies - they are your
   real availability ceiling.
\`\`\`

**MTBF / MTTR:**  availability ~= MTBF / (MTBF + MTTR). you improve availability
by failing LESS OFTEN (MTBF up) OR RECOVERING FASTER (MTTR down). MTTR is usually
the cheaper lever - a 5-min rollback vs a 2-hour root-cause (Module 15 L6).`,

    simpleHi: `**AVAILABILITY** = system apna kaam karता hai us samay ka fraction. "Nines" mein stated:
\`\`\`
        %          downtime/month   downtime/year
99%     (do 9s)    ~7.3 hours       ~3.65 days
99.9%   (teen)     ~43 minutes      ~8.8 hours
99.95%             ~22 minutes      ~4.4 hours
99.99%  (chaar)    ~4.3 minutes     ~53 minutes
99.999% (paanch)   ~26 seconds      ~5.3 minutes
\`\`\`
har extra nine ~= 10x KAM downtime budget = ~10x engineering + infra. jo nines
aapko nahi chahिए unhe chase mat karो (Module 15 L6 SLOs).

**SERIES (dependencies) - failure rates ADD, availabilities MULTIPLY:**
\`\`\`
agar ek request ko A AUR B AUR C chahिए, jo sab up hone chahिए:
  A_up x B_up x C_up
  0.999 x 0.999 x 0.999 = 0.9970   -> teen 99.9%s ki ek chain sirf 99.7% hai
KEY CONSEQUENCE: ek dependency add karना HAMESHA aapki availability lower karता hai,
  ek bahut reliable bhi.  99.9% service + ek 99.99% dependency = 99.89%.
  -> critical path par cheezon ki number minimise karो. cache karो. gracefully degrade karो.
\`\`\`

**PARALLEL (redundancy) - FAILURE probabilities MULTIPLY:**
\`\`\`
agar system up hai jab tak N replicas mein se KAM SE KAM EK up hai:
  1 - (1 - r)^N
  do 99% replicas:  1 - (0.01)^2   = 0.9999    (99% -> 99.99%)
  teen 99% replicas: 1 - (0.01)^3  = 0.999999  (99% -> 99.9999%)
-> redundancy badha lever hai. par sirf agar replicas INDEPENDENTLY fail hote hain.
\`\`\`

**FAILURE DOMAINS - "independent" assumption usually ek jhooth hai:**
\`\`\`
ek failure domain = ek scope jismें ek fault sab kuch ek saath neeche le jाता hai.
  - same RACK / power feed / top-of-rack switch
  - same AVAILABILITY ZONE (Module 13)
  - same REGION
  - same DEPLOY (ek bad version saare replicas ko rolls hota hai)
  - same DEPENDENCY (saare replicas same broken DB / config service / DNS call karте hain)
  - same BUG (ek leap-second, ek cert expiry, ek poison message har instance ko hit karता hai)
CORRELATED FAILURE parallel math ko tods deta hai: do replicas jo ek power feed share
  karते hain  1 - (1-r)^2  NAHI hain.
-> replicas ko failure domains ke across spread karो. AZ-anti-affinity. staggered
   deploys / canaries. per-replica config. aur apni SHARED dependencies jaanो.
\`\`\`

**MTBF / MTTR:**  availability ~= MTBF / (MTBF + MTTR). aap availability improve karते
ho KAM AKSAR fail karके (MTBF up) YA FASTER RECOVER karके (MTTR down). MTTR usually
sasta lever hai - ek 5-min rollback vs ek 2-hour root-cause (Module 15 L6).`,

    content: `## What availability means and what each nine costs

Availability is the fraction of time a system is doing its job — serving requests successfully, within acceptable latency. It is conventionally quoted as a number of nines, and the practical thing to internalise is the downtime budget each one allows. Two nines, 99%, is about seven hours a month. Three nines, 99.9%, is about forty-three minutes a month. Four nines, 99.99%, is about four minutes a month. Five nines, 99.999%, is about twenty-six seconds a month. Each additional nine cuts the allowed downtime by roughly ten times and costs roughly ten times the engineering and infrastructure to achieve, because at the high end a single routine event — a rolling deploy that drops one instance for thirty seconds, a dependency having a bad minute, a garbage-collection pause — can consume the entire budget. This is why the SLO discipline from Module 15 matters: you choose the number of nines from what users actually need, not by maximising.

## Series: dependencies multiply availabilities

If a request cannot succeed unless component A *and* component B *and* component C are all working, the availability of the whole is the product of the parts:

\`\`\`
A_up × B_up × C_up
0.999 × 0.999 × 0.999 = 0.9970
\`\`\`

Three components that are each 99.9% available compose to a system that is only 99.7% available — worse than any individual component. The general consequence is stark: **adding any dependency to the critical path lowers your availability**, even a very reliable one. A 99.9% service that adds a 99.99% dependency drops to 0.999 × 0.9999 = 99.89%. The dependency did not help; it added its own failure rate to yours. The reliability implications are all about reducing the length of the critical chain: minimise the number of things that must be up for a request to succeed, cache results so a dependency being down does not block a read, and design the service to degrade gracefully — return a cached or default answer rather than an error when a non-essential dependency is unavailable.

## Parallel: redundancy multiplies failure probabilities

If the system is up as long as at least one of N redundant replicas is up, the system is down only when *all* of them are down, so the failure probabilities multiply:

\`\`\`
1 − (1 − r)^N
two 99% replicas:   1 − 0.01²  = 0.9999      (99% → 99.99%)
three 99% replicas: 1 − 0.01³  = 0.999999    (99% → 99.9999%)
\`\`\`

Redundancy is the largest single lever on availability: two copies of a 99% component behind a load balancer give four nines, three copies give six. This is why every serious system runs multiple instances of every stateless service and multi-AZ databases. But the formula depends entirely on the replicas failing **independently**, and that assumption is usually false.

## Failure domains: the independence assumption is a lie

A **failure domain** is a scope within which a single fault takes everything inside it down at once. Replicas in the same rack share a power feed and a top-of-rack switch. Replicas in the same availability zone share the zone\'s power, cooling, and network (Module 13). Replicas running the same software version share a deploy — a bad version rolls to all of them. Replicas that all call the same database, config service, or DNS resolver share that dependency. And every instance shares the same code, so the same bug — a leap-second handling error, a certificate that expires, a message that crashes the parser — hits all of them at the same moment.

When replicas share a failure domain, the parallel math does not apply for the shared fault modes. Two replicas that share a power feed are not \`1 − (1−r)²\` against a power failure; they are closer to \`r\`, the single component\'s failure rate, because the power failure takes both. The reliability work is to spread redundancy across failure domains: anti-affinity rules so replicas land in different zones and racks, staggered or canaried deploys so a bad version does not reach every replica at once, per-replica configuration so a config error does not brick the fleet, and — most importantly — knowing which dependencies are shared by all your replicas, because those shared dependencies are your true availability ceiling regardless of how many replicas you run.

## MTBF, MTTR, and which lever is cheaper

Over the long run, availability is approximately the mean time between failures divided by the sum of the mean time between failures and the mean time to recover: \`MTBF / (MTBF + MTTR)\`. There are two ways to raise it: fail less often, which means increasing MTBF through better testing, safer deploys, and removing fragility; or recover faster, which means decreasing MTTR through fast rollback, good runbooks, and automated failover. Recovering faster is usually the cheaper lever, because reducing the frequency of all possible failures is open-ended work while cutting recovery time is a bounded engineering task — a five-minute automated rollback instead of a two-hour investigation (Module 15, Lesson 6), a one-command failover instead of a manual procedure.`,

    contentHi: `## Availability ka kya matlab hai aur har nine kya cost karता hai

Availability wo fraction hai jismें ek system apna kaam kar raha hai — requests successfully serve karता hai, acceptable latency ke andar. Ye conventionally nines ki ek number ke roop mein quoted hai. Do nines, 99%, ek mahine lagbhag saath ghante hai. Teen nines, 99.9%, ek mahine lagbhag tੈtालीस minute hai. Chaar nines, 99.99%, ek mahine lagbhag chaar minute hai. Har additional nine allowed downtime ko roughly dus times kaatता hai aur ise achieve karने ke liye roughly dus times engineering aur infrastructure cost karता hai.

## Series: dependencies availabilities multiply karती hain

Agar ek request succeed nahi kar sakती jab tak component A *aur* B *aur* C sab kaam nahi kar rahe, poore ki availability parts ka product hai:
\`\`\`
0.999 × 0.999 × 0.999 = 0.9970
\`\`\`
Teen components jo har ek 99.9% available hain ek system mein compose hote hain jo sirf 99.7% available hai. General consequence stark hai: **critical path par koi bhi dependency add karना aapki availability lower karता hai**, ek bahut reliable bhi.

## Parallel: redundancy failure probabilities multiply karती hai

Agar system up hai jab tak N redundant replicas mein se kam se kam ek up hai, system sirf tab down hai jab *sab* down hain, to failure probabilities multiply hoती hain:
\`\`\`
1 − (1 − r)^N
do 99% replicas:   1 − 0.01²  = 0.9999
\`\`\`
Redundancy availability par sabse badha single lever hai. Par formula poori tarah replicas ke **independently** fail hone par depend karता hai.

## Failure domains: independence assumption ek jhooth hai

Ek **failure domain** ek scope hai jismें ek single fault sab kuch ek saath neeche le jाता hai. Same rack mein replicas ek power feed share karते hain. Same availability zone mein replicas zone ka power, cooling, aur network share karते hain. Same software version chal rahe replicas ek deploy share karते hain. Aur har instance same code share karता hai, to same bug sab ko ek saath hit karता hai.

Jab replicas ek failure domain share karते hain, parallel math shared fault modes ke liye apply nahi hoता. Reliability work redundancy ko failure domains ke across spread karना hai.

## MTBF, MTTR, aur kaun sा lever sasta hai

Long run ke over, availability approximately mean time between failures ko mean time between failures aur mean time to recover ke sum se divided hai: \`MTBF / (MTBF + MTTR)\`. Ise raise karने ke do tarike hain: kam aksar fail karो, ya faster recover karो. Faster recover karना usually sasta lever hai.`,

    examples: [
      {
        title: 'The availability arithmetic: nines, a chain of dependencies, and parallel redundancy',
        titleHi: 'Availability arithmetic: nines, ek chain of dependencies, aur parallel redundancy',
        code: `# VERIFY
python - <<'PY'
def down_min_per_month(a): return round((1 - a) * 30 * 24 * 60, 2)

print("--- what each nine costs (downtime per 30-day month) ---")
for a in [0.99, 0.999, 0.9999, 0.99999]:
    print(f"  {a*100:.3f}%  ->  {down_min_per_month(a):>8.2f} min/month")

print()
print("--- SERIES: a request needs 3 dependencies, each 99.9% ---")
serial = 0.999 ** 3
print(f"  0.999 ** 3 = {serial:.4f}  ->  {serial*100:.2f}%  ({down_min_per_month(serial):.1f} min/mo)")
print("  a chain is LESS available than its weakest link.")

print()
print("--- adding a 'very reliable' dependency still makes it WORSE ---")
combined = 0.999 * 0.9999
print(f"  99.9% service x a 99.99% dependency = {combined:.5f}  ->  {combined*100:.3f}%")

print()
print("--- PARALLEL: system up if >= 1 of N replicas up, each 99% ---")
for n in [1, 2, 3]:
    a = 1 - (1 - 0.99) ** n
    print(f"  N={n}:  1 - 0.01**{n} = {a:.6f}  ->  {a*100:.4f}%  ({down_min_per_month(a):.2f} min/mo)")
print("  redundancy is the big lever - IF the replicas fail independently.")
PY`,
        output: `--- what each nine costs (downtime per 30-day month) ---
  99.000%  ->    432.00 min/month
  99.900%  ->     43.20 min/month
  99.990%  ->      4.32 min/month
  99.999%  ->      0.43 min/month

--- SERIES: a request needs 3 dependencies, each 99.9% ---
  0.999 ** 3 = 0.9970  ->  99.70%  (129.5 min/mo)
  a chain is LESS available than its weakest link.

--- adding a 'very reliable' dependency still makes it WORSE ---
  99.9% service x a 99.99% dependency = 0.99890  ->  99.890%

--- PARALLEL: system up if >= 1 of N replicas up, each 99% ---
  N=1:  1 - 0.01**1 = 0.990000  ->  99.0000%  (432.00 min/mo)
  N=2:  1 - 0.01**2 = 0.999900  ->  99.9900%  (4.32 min/mo)
  N=3:  1 - 0.01**3 = 0.999999  ->  99.9999%  (0.04 min/mo)
  redundancy is the big lever - IF the replicas fail independently.`,
        explain: 'The three pieces of availability arithmetic, computed directly. The first block shows the downtime budget for each level: 99% allows over seven hours a month, and every added nine cuts that by ten — 99.999% allows less than half a minute, which no real deployment process can stay inside. The second block composes three dependencies in series, each 99.9% available: multiplying the availabilities gives 99.7%, which is over two hours of monthly downtime, worse than any of the three parts on its own, because the chain fails whenever any link fails. The third block makes the general point explicit — adding a dependency that is more reliable than your service still lowers your number, because 99.9% times 99.99% is 99.89%, not 99.9%. The fourth block shows the opposite effect for redundancy: with the system considered up as long as one of N replicas is up, the failure probabilities multiply, so two 99% replicas give 99.99% and three give 99.9999%. This is why redundancy is the dominant lever for availability — but the formula assumes the replicas fail independently, and the next concern is that they usually do not, because they share failure domains.',
        explainHi: 'Availability arithmetic ke teen pieces, directly computed. Pehla block har level ke liye downtime budget dikhाता hai: 99% ek mahine saath ghante se zyada allow karता hai, aur har added nine ise dus se kaatता hai. Doosra block teen dependencies ko series mein compose karता hai, har ek 99.9% available: availabilities multiply karना 99.7% deता hai, jo ek mahine do ghante se zyada downtime hai, teen parts mein se kisi bhi se worse, kyunki chain tab fail karती hai jab koi bhi link fail karता hai. Teesra block general point ko explicit banाता hai — ek dependency add karना jo aapki service se zyada reliable hai abhi bhi aapka number lower karता hai. Chautha block redundancy ke liye opposite effect dikhाता hai: do 99% replicas 99.99% dete hain aur teen 99.9999%. Formula assume karता hai replicas independently fail hote hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# claiming an availability number by adding up components instead of multiplying
  # "our API is 99.9%, the DB is 99.95%, the auth service is 99.99% - so we're
  #  about 99.9%, right?"  NO.
  # the request path is API -> auth -> DB, all required:
  #   0.999 * 0.9999 * 0.9995 = 0.99840  -> 99.84%, not 99.9%
  # that's ~69 min/month, not 43. and that's BEFORE the load balancer, DNS, TLS
  # cert, the CDN, the client's network... every hop multiplies in.`,
        right: `# multiply the availabilities of everything ON THE CRITICAL PATH:
  #   A_total = product of (each required component's availability)
  # then REDUCE the path:
  #   - is the auth check cacheable for 60s? -> auth is no longer per-request
  #   - can a stale DB read be served from a replica / a cache on DB failure?
  #     -> the DB is no longer a hard dependency for reads
  #   - is that 3rd-party enrichment call essential, or can the response omit it?
  #     -> move it off the critical path (async, or optional)
  # every dependency you remove from the synchronous path multiplies your number UP.`,
        why: 'Availability of a request path is the product of the availabilities of every component the request must traverse successfully, not a sum or an average of them. Intuition tends to average — "these are all around three or four nines, so we\'re around three or four nines" — but multiplication always produces a number lower than the least-available component, and the more components on the path the further it drops. A path through a 99.9% API, a 99.99% auth service, and a 99.95% database is 99.84%, which is about sixty-nine minutes of monthly downtime rather than the forty-three that "99.9%" implies, and that is before counting the load balancer, DNS, the TLS termination, the CDN, and the client\'s own connection, each of which multiplies in further. The correct calculation is to multiply the availabilities of everything genuinely on the critical path, and the correct reliability response is to shorten that path: make the auth check cacheable so it is not consulted on every request, serve reads from a cache or a replica when the primary database is unavailable so it is not a hard synchronous dependency, and move non-essential enrichment calls off the synchronous path entirely. Each dependency removed from the path multiplies the number back up.',
        whyHi: 'Ek request path ki availability har component ki availabilities ka product hai jise request successfully traverse karना chahिए, ek sum ya ek average nahi. Intuition average karता hai — "ye sab teen ya chaar nines ke aas-paas hain, to hum teen ya chaar nines ke aas-paas hain" — par multiplication hamesha ek number produce karता hai jo least-available component se lower hai. Ek 99.9% API, ek 99.99% auth service, aur ek 99.95% database ke through ek path 99.84% hai. Correct calculation critical path par sab kuch ki availabilities ko multiply karना hai, aur correct reliability response us path ko shorten karना hai.',
      },
      {
        wrong: `# running 3 replicas across 3 AZs and calling it "six nines" from the parallel math
  # 1 - (1 - 0.99)^3 = 0.999999. "we're at six nines!"
  # then reality:
  #   - all 3 replicas run version v482, which has the bug. -> a DEPLOY is a failure
  #     domain. one bad deploy = 0% until rollback.
  #   - all 3 replicas read config from the same config service. it has an outage.
  #     -> a shared DEPENDENCY. all 3 down at once.
  #   - all 3 call the same primary DB. the DB fails over (60s). -> 60s at 0%,
  #     3 times a year, no matter how many replicas.
  # the replicas are NOT independent. the parallel formula is a fantasy here.`,
        right: `# the parallel math only applies to the fault modes the replicas DON'T share.
  # enumerate the SHARED failure domains and address each:
  #   shared deploy      -> canary + staged rollout + fast auto-rollback (Module 11)
  #   shared config      -> the config service is now ON your critical path; give it
  #                         its own redundancy, and cache config locally with a long TTL
  #                         so a config outage doesn't take you down
  #   shared primary DB  -> Multi-AZ with fast failover; read replicas so reads survive
  #                         a primary failover; and the DB failover time IS your RTO
  #   shared DNS / TLS   -> multiple resolvers; monitor cert expiry; pin CA
  #   your REAL availability = min(the replica-parallel number,
  #                                each shared dependency's availability)`,
        why: 'The parallel-redundancy formula, which turns three 99% replicas into six nines, only accounts for failures that are independent between the replicas — a single instance crashing, one machine\'s disk failing. It says nothing about the failure modes the replicas share, and every replica of a service shares several. They run the same software version, so a bad deploy takes all of them down until it is rolled back — the deploy is a failure domain. They read configuration from the same source, so a config-service outage affects all of them at once. They connect to the same primary database, so a database failover is downtime for the whole service regardless of replica count. Claiming six nines from the parallel math while these shared dependencies exist is fantasy. The correct approach is to accept that the parallel formula applies only to the unshared fault modes, enumerate the shared failure domains explicitly, and address each: canary and staged rollout with fast rollback for the shared deploy, redundancy and local caching for the shared config service so it is not a single point of failure, multi-AZ and read replicas for the shared database, multiple resolvers and cert monitoring for DNS and TLS. Your real availability is the smaller of the replica-parallel number and the availability of each thing all your replicas depend on.',
        whyHi: 'Parallel-redundancy formula, jo teen 99% replicas ko six nines mein badalता hai, sirf un failures ke liye account karता hai jo replicas ke beech independent hain. Ye un failure modes ke baare mein kuch nahi kehता jo replicas share karते hain, aur ek service ke har replica kई share karता hai. Wo same software version chalाते hain, to ek bad deploy sab ko neeche le jाता hai. Wo same source se configuration read karते hain. Wo same primary database se connect karते hain. Correct approach ye accept karना hai ki parallel formula sirf unshared fault modes ke liye apply hoता hai, shared failure domains ko explicitly enumerate karना, aur har ek ko address karना. Aapki real availability replica-parallel number aur har cheez ki availability jinpar aapke saare replicas depend karते hain ka smaller hai.',
      },
      {
        wrong: `# chasing MTBF (never fail) when MTTR (recover fast) is the cheap win
  # a team spends 2 quarters trying to eliminate every possible cause of failure:
  # more tests, more review gates, a change freeze, a bigger staging environment.
  # failures drop from 6/quarter to 4/quarter. but each one still takes ~90 min to
  # recover because rollback is manual and the runbook is stale.
  #   availability moved from  MTBF/(MTBF+MTTR)  with MTBF=15d, MTTR=90m
  #     -> 0.99584   to   MTBF=22d, MTTR=90m -> 0.99716.  small gain, huge cost.`,
        right: `# attack MTTR - it's bounded work with a bigger payoff:
  #   - one-command / automatic rollback (deploy N-1 in <5 min)     -> MTTR 90m -> 8m
  #   - health-gated deploys that auto-revert (Module 11)           -> some failures
  #     never reach users
  #   - tested runbooks linked from every alert (Module 15 L6)
  #   - automatic failover for stateful things (Module 14 L3)
  #   with MTBF=15d, MTTR=8m:  0.99963  -> from 99.58% to 99.96%, in weeks not quarters.
  # then improve MTBF where it's cheap (kill known fragility), but MTTR first.`,
        why: 'Availability over the long run is mean time between failures divided by that plus mean time to recover, and the two terms are not equally easy to move. Reducing failure frequency — raising MTBF — is open-ended: there is no end to the list of possible causes, each mitigation has diminishing returns, and heavy measures like change freezes and large staging environments cost a lot for a modest reduction. A team that spends two quarters on this might cut failures by a third while each remaining failure still takes ninety minutes to recover because rollback is manual, and the availability gain is small. Reducing recovery time — lowering MTTR — is bounded work with a larger payoff: a one-command or automatic rollback takes recovery from ninety minutes to under ten, health-gated deploys that auto-revert stop some failures from reaching users at all, tested runbooks linked from alerts remove the time spent figuring out what to do, and automatic failover handles stateful components. With the same failure frequency, cutting MTTR from ninety minutes to eight moves a service from about 99.58% to about 99.96% in a few weeks. The right order is to attack MTTR first, then improve MTBF where it is cheap.',
        whyHi: 'Long run ke over availability mean time between failures ko us plus mean time to recover se divided hai, aur do terms move karने ke liye equally aasan nahi hain. Failure frequency reduce karना — MTBF raise karना — open-ended hai: possible causes ki list ka koi end nahi hai, har mitigation ke diminishing returns hain, aur heavy measures jaise change freezes bahut cost karते hain ek modest reduction ke liye. Recovery time reduce karना — MTTR lower karना — bounded work hai ek larger payoff ke saath: ek one-command ya automatic rollback recovery ko navve minute se dus se kam le jाता hai. Right order pehle MTTR attack karना hai, phir MTBF improve karना jahaan ye sasta hai.',
      },
    ],

    realWorld: [
      {
        en: '**"We\'re 99.9%" — actually 99.8%** — a team quoted its API\'s SLA as 99.9% based on the API tier alone. The real path multiplied through auth (99.99%), the DB (99.95%), a 3rd-party tax service (99.9%), and DNS. Actual ~99.79%. Making the tax lookup optional (omit the field on failure) and caching auth took it back above 99.9%.',
        hi: '**"Hum 99.9% hain" — actually 99.8%** — ek team ne apni API ka SLA 99.9% quote kiya sirf API tier ke based par. Real path auth, DB, ek 3rd-party tax service, aur DNS ke through multiply hua. Actual ~99.79%. Tax lookup ko optional banana aur auth cache karna ise wapas 99.9% se upar le gaya.',
      },
      {
        en: '**3 AZs, one bad deploy, 100% down** — a service ran 9 replicas across 3 AZs and treated itself as "can\'t all fail". A deploy of v3.4 had a null-pointer on a common path; all 9 replicas crashed within 40s. 22-minute outage until rollback. Adding a 5%/10-min canary stage caught the next one at 5% blast radius.',
        hi: '**3 AZs, ek bad deploy, 100% down** — ek service ne 3 AZs ke across 9 replicas chalaye. v3.4 ke ek deploy mein ek common path par ek null-pointer tha; saare 9 replicas 40s mein crash ho gaye. 22-minute outage. Ek 5%/10-min canary stage ne agle ko 5% blast radius par pakada.',
      },
      {
        en: '**Two quarters on MTBF, then two weeks on MTTR** — a platform team ran a reliability program focused on preventing failures; availability crept from 99.5% to 99.6%. A follow-up sprint on one-command rollback + auto-revert health gates cut MTTR from ~75 min to ~9 and took availability to 99.95%.',
        hi: '**MTBF par do quarters, phir MTTR par do hafte** — ek platform team ne failures prevent karne par focused ek reliability program chalaya; availability 99.5% se 99.6% tak crept hui. One-command rollback par ek follow-up sprint ne MTTR ko ~75 min se ~9 kata aur availability ko 99.95% le gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'A request passes through 4 services, each 99.9% available. What is the end-to-end availability, and what does that tell you?',
        qHi: 'Ek request 4 services se guzarती hai, har ek 99.9% available. End-to-end availability kya hai, aur wo aapko kya batata hai?',
        a: 'The services are in series — the request needs all four to succeed — so the availabilities multiply: 0.999 to the fourth power is about 0.9960, or 99.6%. That is roughly one hundred and seventy minutes of downtime a month, compared to the forty-three minutes that 99.9% alone would allow. The lesson is that a chain of dependencies is always less available than its weakest link, and it gets worse with every link added. Adding a dependency to the critical path always lowers availability, even a dependency that is more reliable than the service — a 99.9% service that adds a 99.99% dependency becomes 99.89%. The reliability response is to shorten the critical path: minimise the number of components that must all be up for a request to succeed, cache the results of dependencies so a dependency being down does not block the request, serve stale or default data when a non-essential dependency is unavailable rather than returning an error, and move optional work like enrichment calls off the synchronous path. Every dependency removed from the path multiplies the availability number back up.',
        aHi: 'Services series mein hain — request ko chaaron succeed karने ki zaroorat hai — to availabilities multiply hoती hain: 0.999 ki fourth power lagbhag 0.9960 hai, ya 99.6%. Wo ek mahine roughly ek sau sattar minute downtime hai, compared to tੈtालीस minute jo akele 99.9% allow karega. Lesson ye hai ki dependencies ki ek chain hamesha apne weakest link se kam available hai. Critical path par ek dependency add karना hamesha availability lower karता hai, ek dependency bhi jo service se zyada reliable hai. Reliability response critical path ko shorten karना hai: components ki number minimise karो, dependencies ke results cache karो, stale ya default data serve karो jab ek non-essential dependency unavailable hai.',
      },
      {
        q: 'Redundancy makes two 99% replicas into 99.99%. Why is that number usually wrong in practice?',
        qHi: 'Redundancy do 99% replicas ko 99.99% banाता hai. Wo number practice mein usually galat kyun hai?',
        a: 'The parallel-redundancy formula, one minus the failure probability raised to the number of replicas, only accounts for failures that are independent between the replicas — a single instance crashing, one disk failing. In practice every replica of a service shares several failure domains, and the shared fault modes do not follow that formula. All the replicas run the same software version, so a bad deploy takes all of them down until it is rolled back; the deploy is a failure domain. They read configuration from the same source, so a config-service outage hits all of them at once. They connect to the same primary database, so a database failover is downtime for the whole service no matter how many replicas there are. They may sit in the same rack or availability zone and share power and network. They share the same code, so the same bug — a certificate expiry, a leap-second, a message that crashes the parser — affects every instance simultaneously. For these shared modes the availability is closer to a single component\'s than to the parallel number. The real availability of the service is the smaller of the replica-parallel number and the availability of each thing that all the replicas depend on. The reliability work is to spread redundancy across failure domains with anti-affinity, use canaried staged deploys so a bad version does not reach every replica, cache config locally, and give shared dependencies their own redundancy.',
        aHi: 'Parallel-redundancy formula sirf un failures ke liye account karता hai jo replicas ke beech independent hain. Practice mein ek service ka har replica kई failure domains share karता hai, aur shared fault modes us formula ko follow nahi karते. Saare replicas same software version chalाते hain, to ek bad deploy sab ko neeche le jाता hai. Wo same source se configuration read karते hain. Wo same primary database se connect karते hain, to ek database failover poore service ke liye downtime hai. Wo same rack ya availability zone mein baith sakते hain. Wo same code share karते hain, to same bug har instance ko affect karता hai. Service ki real availability replica-parallel number aur har cheez ki availability jinpar saare replicas depend karते hain ka smaller hai.',
      },
      {
        q: 'What is the relationship between MTBF, MTTR, and availability, and which one should a team usually improve first?',
        qHi: 'MTBF, MTTR, aur availability ke beech kya relationship hai, aur ek team ko usually pehle kaun sा improve karना chahिए?',
        a: 'Over the long run, availability is approximately the mean time between failures divided by the sum of the mean time between failures and the mean time to recover. So there are two ways to raise availability: fail less often, which raises MTBF, or recover faster, which lowers MTTR. A team should usually attack MTTR first. Reducing failure frequency is open-ended work — there is no bound on the list of possible causes, each additional mitigation has diminishing returns, and the heavy measures like change freezes and large staging environments cost a great deal for a modest reduction. Reducing recovery time is bounded engineering with a larger payoff: a one-command or automatic rollback takes recovery from an hour or more down to a few minutes, health-gated deploys that automatically revert stop some failures from reaching users at all, tested runbooks linked from alerts remove the time spent deciding what to do, and automatic failover handles stateful components. With the same failure frequency, cutting recovery time from ninety minutes to under ten can move a service from around 99.6% to around 99.96% in a few weeks. Once MTTR is low, then improve MTBF where it is cheap — removing known sources of fragility, safer deploy mechanics — but recovery speed comes first because it is the bounded, high-leverage change.',
        aHi: 'Long run ke over, availability approximately mean time between failures ko mean time between failures aur mean time to recover ke sum se divided hai. To availability raise karने ke do tarike hain: kam aksar fail karो, ya faster recover karो. Ek team ko usually pehle MTTR attack karना chahिए. Failure frequency reduce karना open-ended work hai. Recovery time reduce karना bounded engineering hai ek larger payoff ke saath: ek one-command ya automatic rollback recovery ko ek ghante ya zyada se kuch minute le jाता hai. Same failure frequency ke saath, recovery time ko navve minute se dus se kam karना ek service ko lagbhag 99.6% se lagbhag 99.96% le ja sakता hai. Ek baar MTTR low hai, phir MTBF improve karो jahaan ye sasta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, give the downtime budget for 99% / 99.9% / 99.99% / 99.999%, and explain why more nines is roughly 10x the cost each.',
        taskHi: 'Ek comment mein, 99% / 99.9% / 99.99% / 99.999% ke liye downtime budget do.',
        hint: 'AVAILABILITY = the fraction of time the system is doing its job (serving successfully, within acceptable latency), quoted in "nines". DOWNTIME BUDGET (per 30-day month / per year): 99% (two 9s) ≈ 7.3 HOURS/month ≈ 3.65 DAYS/year. 99.9% (three) ≈ 43 MINUTES/month ≈ 8.8 hours/year. 99.95% ≈ 22 minutes/month. 99.99% (four) ≈ 4.3 MINUTES/month ≈ 53 minutes/year. 99.999% (five) ≈ 26 SECONDS/month ≈ 5.3 minutes/year. WHY EACH NINE IS ~10× THE COST: each added nine cuts the ALLOWED DOWNTIME by roughly 10× → the engineering + infra to stay inside a 10×-smaller budget is roughly 10× more. At the high end, a SINGLE ROUTINE EVENT consumes the whole budget: a rolling deploy dropping one instance for 30s, a dependency having a bad minute, a GC pause, a DB failover (~60s). 99.999% means NO routine deploy process can stay inside it — you need multi-region active-active, automated everything, and zero-downtime-deploy infra. DON\'T CHASE NINES YOU DON\'T NEED (Module 15 L6): pick the target from what USERS actually need — an internal dashboard at 99.5% (a few hours/month, off-peak, unnoticed) is fine; a payment ledger needs 99.999% on CORRECTNESS but maybe only 99.9% on availability (a retry is acceptable). The formula: `downtime = (1 - availability) × window`. `availability ≈ MTBF / (MTBF + MTTR)` — raise it by failing LESS OFTEN (MTBF↑) or RECOVERING FASTER (MTTR↓); MTTR is usually the cheaper lever.',
        hintHi: 'AVAILABILITY = system apna kaam kar raha hai us samay ka fraction, "nines" mein quoted. DOWNTIME BUDGET (per 30-day month): 99% ≈ 7.3 HOURS/month. 99.9% ≈ 43 MINUTES/month. 99.95% ≈ 22 minutes/month. 99.99% ≈ 4.3 MINUTES/month. 99.999% ≈ 26 SECONDS/month. HAR NINE ~10× COST KYUN: har added nine ALLOWED DOWNTIME ko roughly 10× kaatता hai → engineering + infra roughly 10× zyada. High end par, ek SINGLE ROUTINE EVENT poora budget consume karता hai. 99.999% ka matlab KOI routine deploy process ise andar nahi reh sakta. JO NINES AAPKO NAHI CHAHIE UNHE CHASE MAT KARO (Module 15 L6). Formula: `downtime = (1 - availability) × window`. `availability ≈ MTBF / (MTBF + MTTR)`.',
      },
      {
        task: 'In a comment, give the series formula and the parallel formula with worked numbers, and explain why "adding a reliable dependency lowers availability" and why "N replicas ≠ the parallel number".',
        taskHi: 'Ek comment mein, series formula aur parallel formula do.',
        hint: 'SERIES (dependencies — the request needs A AND B AND C, all up): availability = A_up × B_up × C_up (the availabilities MULTIPLY; equivalently the failure rates roughly ADD). WORKED: three 99.9% deps → 0.999³ = 0.9970 → 99.70% → ~129 min/month (WORSE than the 43 min a single 99.9% allows). A CHAIN IS LESS AVAILABLE THAN ITS WEAKEST LINK, and worse with every link. WHY ADDING A RELIABLE DEPENDENCY LOWERS AVAILABILITY: a 99.9% service + a 99.99% dependency = 0.999 × 0.9999 = 0.99890 = 99.89% (NOT 99.9%). The dependency didn\'t help — it ADDED its own failure rate to yours. → minimise the number of things on the CRITICAL PATH; cache dependency results; serve stale/default on failure; move optional work (enrichment) off the synchronous path. PARALLEL (redundancy — system up if ≥ 1 of N replicas up): availability = 1 − (1 − r)^N (the FAILURE probabilities MULTIPLY). WORKED: two 99% replicas → 1 − 0.01² = 0.9999 = 99.99%; three → 1 − 0.01³ = 0.999999 = 99.9999%. REDUNDANCY IS THE BIG LEVER. WHY "N REPLICAS ≠ THE PARALLEL NUMBER": the formula assumes the replicas fail INDEPENDENTLY, but every replica of a service SHARES failure domains: the same DEPLOY (a bad version rolls to all — the deploy is a failure domain), the same CONFIG source, the same primary DB (a failover is downtime for all), the same RACK/AZ/power/network, the same CODE (a cert expiry / a leap-second / a poison message hits every instance). For the SHARED fault modes the availability is closer to a SINGLE component\'s (`r`) than to the parallel number. YOUR REAL AVAILABILITY = min(the replica-parallel number, each SHARED dependency\'s availability). FIX: anti-affinity across AZs/racks; canaried staged deploys + fast auto-rollback (Module 11); per-replica config; local config caching with a long TTL; give shared dependencies their own redundancy.',
        hintHi: 'SERIES (dependencies — request ko A AUR B AUR C chahिए): availability = A_up × B_up × C_up (availabilities MULTIPLY). WORKED: teen 99.9% deps → 0.999³ = 0.9970 → 99.70% → ~129 min/month. EK CHAIN APNE WEAKEST LINK SE KAM AVAILABLE HAI. RELIABLE DEPENDENCY ADD KARNA AVAILABILITY KYUN LOWER KARTA HAI: 99.9% service + 99.99% dependency = 99.89% (NOT 99.9%). → CRITICAL PATH par cheezon ki number minimise karो; cache karो; stale/default serve karो. PARALLEL (redundancy — ≥ 1 of N up): 1 − (1 − r)^N. WORKED: do 99% → 99.99%; teen → 99.9999%. "N REPLICAS ≠ PARALLEL NUMBER" KYUN: formula assume karता hai replicas INDEPENDENTLY fail hote hain, par har replica failure domains SHARE karता hai: same DEPLOY, same CONFIG, same primary DB, same RACK/AZ, same CODE. REAL AVAILABILITY = min(replica-parallel number, har SHARED dependency ki availability).',
      },
      {
        task: 'In a comment, list the kinds of failure domain, explain correlated failure vs the parallel math, and describe the fixes (anti-affinity, staged deploys, per-replica config, knowing shared deps).',
        taskHi: 'Ek comment mein, failure domains ke kinds list karo.',
        hint: 'A FAILURE DOMAIN = a scope within which ONE fault takes EVERYTHING inside it down TOGETHER. KINDS: (1) the same RACK / power feed / top-of-rack switch; (2) the same AVAILABILITY ZONE (shared power/cooling/network — Module 13); (3) the same REGION; (4) the same DEPLOY (a bad version rolls to ALL replicas at once); (5) the same DEPENDENCY (all replicas call the same broken DB / config service / DNS resolver / auth service); (6) the same BUG in the same CODE (a leap-second bug, a cert expiry, a poison message that crashes the parser — hits EVERY instance at the SAME MOMENT). CORRELATED FAILURE vs THE PARALLEL MATH: `1 − (1 − r)^N` ONLY holds for fault modes the replicas DON\'T share (a single instance crash, one disk fail). For a SHARED fault (two replicas on one power feed vs a power failure), it is NOT `1 − (1−r)²` — it is closer to `r` (the single-component rate), because the one fault takes BOTH. Claiming "six nines" from the parallel math while shared dependencies exist is a FANTASY. THE FIXES: (a) ANTI-AFFINITY — pod/instance anti-affinity rules so replicas land in DIFFERENT zones + racks; spread across ≥ 3 AZs (Module 13). (b) STAGED / CANARIED DEPLOYS + fast auto-rollback (Module 11) so a bad version reaches ~5% before it\'s caught, not 100%. (c) PER-REPLICA CONFIG (or at least: validate config before rollout, roll config like code) so a config error doesn\'t brick the whole fleet. (d) KNOW YOUR SHARED DEPENDENCIES — enumerate every service/DB/resolver ALL your replicas call; each one is a single point of failure regardless of replica count; give the critical ones their own redundancy + cache their results locally with a long TTL so an outage of the dependency degrades rather than kills you. YOUR REAL AVAILABILITY CEILING = the least-available shared dependency, not the parallel replica number.',
        hintHi: 'EK FAILURE DOMAIN = ek scope jismें EK fault SAB KUCH ek saath neeche le jाता hai. KINDS: (1) same RACK / power feed; (2) same AZ (Module 13); (3) same REGION; (4) same DEPLOY (ek bad version SAARE replicas ko); (5) same DEPENDENCY (saare replicas same broken DB / config service / DNS call karते hain); (6) same CODE mein same BUG (cert expiry, leap-second, poison message — HAR instance ko SAME MOMENT par). CORRELATED FAILURE vs PARALLEL MATH: `1 − (1 − r)^N` SIRF un fault modes ke liye hold karता hai jo replicas SHARE nahi karते. Ek SHARED fault ke liye ye `r` ke closer hai. FIXES: (a) ANTI-AFFINITY — replicas alag zones + racks mein; ≥ 3 AZs. (b) STAGED / CANARIED DEPLOYS + fast auto-rollback (Module 11). (c) PER-REPLICA CONFIG. (d) apni SHARED DEPENDENCIES JAANO — har ek ek single point of failure hai. REAL AVAILABILITY CEILING = least-available shared dependency.',
      },
    ],

    keyTakeaways: [
      'AVAILABILITY is quoted in nines, and each nine is ~10× less downtime budget for ~10× the cost: 99% ≈ 7.3 h/month, 99.9% ≈ 43 min, 99.99% ≈ 4.3 min, 99.999% ≈ 26 s. At the high end a routine deploy blip or a DB failover blows the whole month — pick the target from what users need (Module 15 L6), don\'t maximise nines.',
      'SERIES (dependencies, all required): availabilities MULTIPLY — three 99.9% deps → 99.7%. A chain is ALWAYS less available than its weakest link, and ADDING ANY DEPENDENCY LOWERS your number, even a more reliable one (99.9% × 99.99% = 99.89%). Shorten the critical path: cache, degrade gracefully, move optional work off the synchronous path.',
      'PARALLEL (redundancy, up if ≥ 1 of N up): FAILURE probabilities MULTIPLY — 1 − (1−r)^N — two 99% replicas → 99.99%, three → 99.9999%. Redundancy is the biggest lever on availability — BUT only if the replicas fail INDEPENDENTLY.',
      'FAILURE DOMAINS break the parallel math: a shared RACK/AZ/region, a shared DEPLOY (a bad version rolls to all), a shared DEPENDENCY (all replicas call the same DB/config/DNS), or a shared BUG (a cert expiry hits every instance) is a CORRELATED failure — closer to `r` than to the parallel number. Your REAL availability ceiling = the least-available thing ALL your replicas depend on. Fix with anti-affinity, canaried staged deploys + fast rollback, per-replica config, and knowing your shared deps.',
      'availability ≈ MTBF / (MTBF + MTTR). Raise it by failing LESS OFTEN (MTBF↑ — open-ended, diminishing returns) or RECOVERING FASTER (MTTR↓ — bounded, high-leverage). ATTACK MTTR FIRST: a one-command/auto rollback (~90 min → ~8), health-gated auto-revert deploys, tested runbooks, automatic failover — this moves a service from ~99.6% to ~99.96% in weeks, not quarters.',
    ],
    keyTakeawaysHi: [
      'AVAILABILITY nines mein quoted hai, aur har nine ~10× kam downtime budget ~10× cost ke liye hai: 99% ≈ 7.3 h/month, 99.9% ≈ 43 min, 99.99% ≈ 4.3 min, 99.999% ≈ 26 s. High end par ek routine deploy blip ya ek DB failover poora mahina blow karता hai — target wo se pick karो jo users ko chahिए (Module 15 L6).',
      'SERIES (dependencies, sab required): availabilities MULTIPLY — teen 99.9% deps → 99.7%. Ek chain HAMESHA apne weakest link se kam available hai, aur KOI BHI DEPENDENCY ADD KARNA aapka number LOWER karता hai, ek zyada reliable bhi (99.9% × 99.99% = 99.89%). Critical path shorten karो: cache, gracefully degrade, optional work synchronous path se hatाओ.',
      'PARALLEL (redundancy, up agar ≥ 1 of N up): FAILURE probabilities MULTIPLY — 1 − (1−r)^N — do 99% replicas → 99.99%, teen → 99.9999%. Redundancy availability par sabse badha lever hai — PAR sirf agar replicas INDEPENDENTLY fail hote hain.',
      'FAILURE DOMAINS parallel math ko tods dete hain: ek shared RACK/AZ/region, ek shared DEPLOY, ek shared DEPENDENCY, ya ek shared BUG ek CORRELATED failure hai — `r` ke closer, parallel number se nahi. Aapki REAL availability ceiling = wo least-available cheez jinpar aapke SAARE replicas depend karते hain. Anti-affinity, canaried staged deploys + fast rollback, per-replica config se fix karो.',
      'availability ≈ MTBF / (MTBF + MTTR). Ise KAM AKSAR fail karके (MTBF↑ — open-ended) ya FASTER RECOVER karके (MTTR↓ — bounded, high-leverage) raise karो. PEHLE MTTR ATTACK karो: ek one-command/auto rollback (~90 min → ~8), health-gated auto-revert deploys, tested runbooks, automatic failover — ye ek service ko ~99.6% se ~99.96% weeks mein le jाता hai.',
    ],
  },

  {
    slug: 'ops-the-resilience-toolkit-timeouts-retries-circuit-breakers',
    title: 'The Resilience Toolkit: Timeouts, Retries & Circuit Breakers',
    titleHi: 'Resilience Toolkit: Timeouts, Retries Aur Circuit Breakers',
    description:
      'The client-side patterns that stop one slow or failing dependency from taking down everything that calls it: a timeout on every network call, retries with exponential backoff plus jitter plus a budget, a circuit breaker that stops calling a dead dependency, bulkheads that isolate resource pools, hedged requests for tail latency, and fallbacks that let the service degrade instead of erroring.',
    descriptionHi:
      'Wo client-side patterns jo ek slow ya failing dependency ko use call karने wali har cheez ko down karने se rोkते hain: har network call par ek timeout, exponential backoff plus jitter plus ek budget ke saath retries, ek circuit breaker jo ek dead dependency ko call karना band karता hai, bulkheads jo resource pools isolate karते hain, tail latency ke liye hedged requests, aur fallbacks jo service ko error karने ke bajaay degrade karने dete hain.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A restaurant kitchen where one supplier stops answering the phone.** A timeout is the rule "if the supplier hasn\'t picked up in 20 seconds, hang up" — without it a line cook stands frozen with the phone to their ear while orders pile up. A retry with backoff and jitter is "try again in a bit, and a bit longer each time, and not at the exact same second as every other cook" — so you don\'t all redial together and jam their switchboard. A circuit breaker is "after five failed calls, stop dialling that supplier for two minutes and use the backup" — so nobody wastes time on a line that\'s clearly down. A bulkhead is having a separate phone for each supplier so a dead line doesn\'t tie up the phone you need for the others. And a fallback is "if the fresh-herb supplier is down, plate it without the garnish" — the dish still goes out.',
      hi: '**Ek restaurant kitchen jahaan ek supplier phone answer karना band kar deta hai.** Ek timeout wo rule hai "agmar supplier ne 20 seconds mein nahi uthaya, hang up karो" — iske bina ek line cook phone kaan par frozen khada rehता hai jabki orders pile up hoते hain. Backoff aur jitter ke saath ek retry "thodi der mein dobara try karो, aur har baar thoda lamba, aur har doosre cook ke exact same second par nahi" hai. Ek circuit breaker "paanch failed calls ke baad, us supplier ko do minute dial karना band karो aur backup use karो" hai. Ek bulkhead har supplier ke liye ek separate phone rakhना hai. Aur ek fallback "agmar fresh-herb supplier down hai, ise bina garnish ke plate karो" hai.',
    },

    simple: `**TIMEOUT** — a hard deadline on every network call. NO exceptions.
\`\`\`
- default timeouts are often INFINITE (or minutes). one slow dependency then
  holds your threads/connections until YOU run out -> you fail too. cascading failure.
- set it from the dependency's OWN p99.9 latency + margin, NOT a round guess.
- BUDGET the timeout down the call tree: if your caller gives you 3s and you call
  A then B, A gets ~1.4s and B ~1.4s (not 3s each) - propagate the remaining deadline.
- separate CONNECT timeout (short, ~1s) from READ timeout (the work).
\`\`\`

**RETRY** — only for TRANSIENT failures, and carefully:
\`\`\`
RETRY:      a timeout, a 503, a connection reset, a 429 (respect Retry-After).
DON'T:      a 400 / 404 / 401 / 422 (retrying a bad request just fails again),
            a non-idempotent write without an idempotency key (Lesson 3 / Module 14),
            anything already past the caller's deadline.
BACKOFF:    exponential - wait  base * 2^attempt , capped.  0.1s, 0.2s, 0.4s, ...
JITTER:     randomise the delay (FULL jitter: uniform[0, exp]). WITHOUT jitter every
            client retries at the same instants -> a synchronised THUNDERING HERD
            that hammers the recovering service back down.
BUDGET:     cap total retries at ~10% of request volume (a token bucket / a ratio).
            past the budget -> fail fast. stops a retry storm 2-3x-ing the load on
            an already-sick dependency and turning a partial outage into a full one.
MAX ATTEMPTS: 2-3. more just delays the inevitable failure and wastes the deadline.
\`\`\`

**CIRCUIT BREAKER** — stop calling a dependency that is clearly down:
\`\`\`
CLOSED     normal. requests flow. count failures in a rolling window.
  --(failure rate > threshold, e.g. 50% over 20 requests)-->
OPEN       reject IMMEDIATELY (fail fast / fallback). don't even try. for  cooldown  (e.g. 30s).
  --(cooldown elapsed)-->
HALF-OPEN  let a FEW trial requests through.
   success -> CLOSED (recovered).   failure -> OPEN (back to cooldown).
WHY: when a dependency is dead, every call you make just wastes a thread for the
full timeout and adds load. the breaker converts "1000 slow-timeout failures" into
"1000 instant failures / fallbacks" - your service stays responsive.
\`\`\`

**BULKHEAD** — isolate resource pools so one dependency can't starve the others:
\`\`\`
a SEPARATE connection pool / thread pool / semaphore PER downstream dependency.
if dependency A hangs and its pool (say 20) fills, calls to B, C, D are unaffected -
they have their own pools. without bulkheads, A's hang consumes the SHARED pool and
everything blocks. (name from ship compartments: one flooded hull section, ship floats.)
\`\`\`

**HEDGED REQUEST** — for TAIL latency: send the request, and if no response in
p95 time, send a SECOND copy to another replica; take whichever returns first;
cancel the other. cuts p99 dramatically at ~5% extra load. only for idempotent reads.

**FALLBACK / GRACEFUL DEGRADATION** — when a dependency is unavailable, return a
DEGRADED-but-useful answer, not an error:
\`\`\`
recommendations service down -> show a generic "popular items" list
pricing enrichment down       -> show the base price, omit the discount badge
the user's avatar service down -> show initials
=> the feature the dependency powered is degraded; the PAGE still works.
   (Module 15 L1: alert on the JOURNEY success rate, which catches this.)
\`\`\``,

    simpleHi: `**TIMEOUT** — har network call par ek hard deadline. KOI exceptions nahi.
\`\`\`
- default timeouts aksar INFINITE (ya minutes) hote hain. ek slow dependency phir
  aapke threads/connections hold karता hai jab tak AAP bhi khatam nahi -> aap bhi fail. cascading failure.
- ise dependency ki APNI p99.9 latency + margin se set karो, ek round guess nahi.
- timeout ko call tree mein neeche BUDGET karो: agmar aapka caller aapko 3s deta hai
  aur aap A phir B call karते ho, A ~1.4s aur B ~1.4s paता hai - remaining deadline propagate karो.
- CONNECT timeout (short, ~1s) ko READ timeout (work) se separate karो.
\`\`\`

**RETRY** — sirf TRANSIENT failures ke liye, aur carefully:
\`\`\`
RETRY:      ek timeout, ek 503, ek connection reset, ek 429 (Retry-After respect karो).
MAT KARO:   ek 400 / 404 / 401 / 422, ek non-idempotent write bina ek idempotency key ke
            (Lesson 3 / Module 14), kuch bhi jo already caller ki deadline ke past hai.
BACKOFF:    exponential - wait  base * 2^attempt , capped.  0.1s, 0.2s, 0.4s, ...
JITTER:     delay ko randomise karो (FULL jitter: uniform[0, exp]). jitter ke BINA har
            client same instants par retry karता hai -> ek synchronised THUNDERING HERD.
BUDGET:     total retries ko request volume ke ~10% par cap karो. budget ke past ->
            fail fast. ek retry storm ko ek already-sick dependency par load 2-3x-ing se rोkता hai.
MAX ATTEMPTS: 2-3. zyada bas inevitable failure delay karता hai aur deadline waste karता hai.
\`\`\`

**CIRCUIT BREAKER** — ek dependency ko call karना band karो jo clearly down hai:
\`\`\`
CLOSED     normal. requests flow. ek rolling window mein failures count karो.
  --(failure rate > threshold, e.g. 50% over 20 requests)-->
OPEN       TURANT reject karो (fail fast / fallback). try bhi mat karो. ek  cooldown  ke liye (e.g. 30s).
  --(cooldown elapsed)-->
HALF-OPEN  kuch trial requests through jaने do.
   success -> CLOSED (recovered).   failure -> OPEN (wapas cooldown).
WHY: jab ek dependency dead hai, har call jo aap karते ho bas ek thread waste karता
hai full timeout ke liye aur load add karता hai. breaker "1000 slow-timeout failures"
ko "1000 instant failures / fallbacks" mein badalता hai.
\`\`\`

**BULKHEAD** — resource pools isolate karो taaki ek dependency doosron ko starve na kar sake:
\`\`\`
per downstream dependency ek SEPARATE connection pool / thread pool / semaphore.
agmar dependency A hang karता hai aur iska pool (say 20) fills, B, C, D ko calls unaffected
hain. bulkheads ke bina, A ka hang SHARED pool consume karता hai aur sab kuch block hota hai.
\`\`\`

**HEDGED REQUEST** — TAIL latency ke liye: request bhejो, aur agmar p95 time mein koi
response nahi, ek DOOSRI copy doosre replica ko bhejो; jo pehle return kare wo lo. sirf idempotent reads ke liye.

**FALLBACK / GRACEFUL DEGRADATION** — jab ek dependency unavailable hai, ek
DEGRADED-but-useful answer return karो, ek error nahi:
\`\`\`
recommendations service down -> ek generic "popular items" list dikhाओ
pricing enrichment down       -> base price dikhाओ, discount badge omit karो
=> jo feature dependency ne power kiya wo degraded hai; PAGE abhi bhi kaam karता hai.
\`\`\``,

    content: `## Timeouts

Every call that crosses the network needs a hard deadline, without exception. The reason is cascading failure: if a dependency becomes slow and you have no timeout, your request threads and connections wait indefinitely, and as more requests arrive they queue behind the stuck ones until your own thread pool or connection pool is exhausted — at which point you fail too, and anything calling *you* starts to back up, and the failure propagates up the stack. A timeout converts "one dependency is slow" into "one dependency\'s calls fail quickly and we move on".

Set the timeout from the dependency\'s own observed p99.9 latency plus a margin, not a round number picked by feel. Budget the timeout down the call tree: if your caller allowed you three seconds and your handler calls A and then B, you cannot give each a three-second timeout — you propagate the *remaining* deadline, so A gets roughly the time left and B gets what is left after A. Separate the connect timeout, which should be short because establishing a TCP connection is fast when the target is healthy, from the read timeout, which covers the actual work.

## Retries

Retry only transient failures — a timeout, a 503, a connection reset, a 429 (and honour its Retry-After). Do not retry a 400, 404, 401, or 422, because a request that was rejected as malformed will be rejected again; do not retry a non-idempotent write without an idempotency key, because you may apply it twice (Lesson 3 and Module 14); and do not retry anything already past the caller\'s deadline.

Use **exponential backoff**: wait \`base × 2^attempt\`, capped at a maximum. Add **jitter** — randomise the delay, with full jitter meaning a uniform random value between zero and the exponential value. Without jitter, every client that failed at the same moment retries at exactly the same later moments, producing a synchronised thundering herd that hits the recovering service in waves and knocks it back down. Enforce a **retry budget**: cap the total volume of retries at a small fraction of request volume, around ten percent, using a token bucket or a ratio check, and once the budget is spent, fail fast without retrying. This stops a retry storm from multiplying the load on an already-struggling dependency by two or three times and turning a partial outage into a total one. Keep **max attempts** low, two or three — more attempts just delay the inevitable failure and consume the caller\'s deadline.

## Circuit breakers

A circuit breaker stops you from calling a dependency that is clearly down. It has three states. **Closed** is normal operation: requests flow through and the breaker counts failures in a rolling window. When the failure rate crosses a threshold — for example fifty percent over the last twenty requests — the breaker trips to **open**: it rejects requests immediately, without attempting the call, either failing fast or invoking a fallback, and it stays open for a cooldown period. When the cooldown elapses the breaker moves to **half-open**: it lets a small number of trial requests through, and if they succeed it returns to closed, while if they fail it returns to open for another cooldown.

The value is that when a dependency is genuinely dead, every call you make against it wastes a thread for the full timeout duration and adds load to a service that cannot handle it. The breaker converts a thousand slow timeout failures into a thousand instant failures or fallbacks, keeping your own service responsive and giving the dependency room to recover.

## Bulkheads

A bulkhead isolates resource pools so that one misbehaving dependency cannot starve the others. Instead of a single shared connection pool or thread pool for all downstream calls, you give each dependency its own pool or its own semaphore. If dependency A hangs and its dedicated pool of, say, twenty fills up, calls to B, C, and D are completely unaffected because they draw from separate pools. Without bulkheads, A\'s hang consumes the shared pool and every downstream call — including the healthy ones — blocks waiting for a slot. The name comes from ship design: a hull divided into sealed compartments stays afloat when one is breached.

## Hedged requests

A hedged request addresses tail latency. You send the request to one replica, and if no response has come back by the time the p95 latency would have elapsed, you send a second copy of the same request to a different replica, take whichever response arrives first, and cancel the other. Because most requests are fast, the second copy is only sent for the slow tail, so this cuts p99 and p99.9 latency dramatically at the cost of roughly five percent extra load. It is only safe for idempotent operations, so reads and idempotent writes.

## Fallbacks and graceful degradation

When a dependency is unavailable, the service should return a degraded but useful answer rather than an error. A recommendations service being down means showing a generic "popular items" list instead of personalised ones. A pricing-enrichment service being down means showing the base price without the discount badge. An avatar service being down means showing the user\'s initials. In each case the feature that the dependency powered is degraded, but the page still renders and the core action still works. This is why Module 15 recommends alerting on the success rate of the whole user journey rather than only on individual dependency errors — a journey-level metric catches the case where every HTTP call returned a 200 but the result was missing something important.`,

    contentHi: `## Timeouts

Har call jo network cross karती hai use ek hard deadline chahिए, bina exception ke. Reason cascading failure hai: agmar ek dependency slow ban jaती hai aur aapke paas koi timeout nahi hai, aapke request threads aur connections indefinitely wait karते hain, aur jaise zyada requests arrive hoती hain wo stuck walon ke peeche queue karती hain jab tak aapka apna thread pool ya connection pool exhausted nahi. Ek timeout "ek dependency slow hai" ko "ek dependency ki calls jaldi fail hoती hain aur hum move on karते hain" mein badalता hai.

Timeout ko dependency ki apni observed p99.9 latency plus ek margin se set karो. Timeout ko call tree mein neeche budget karो: agmar aapka caller ne aapko teen seconds allow kiye aur aapka handler A phir B call karता hai, aap har ek ko ek teen-second timeout nahi de sakte — aap *remaining* deadline propagate karते ho.

## Retries

Sirf transient failures retry karो — ek timeout, ek 503, ek connection reset, ek 429. Ek 400, 404, 401, ya 422 retry mat karो; ek non-idempotent write bina ek idempotency key ke retry mat karो; aur kuch bhi jo already caller ki deadline ke past hai retry mat karो.

**Exponential backoff** use karो: wait \`base × 2^attempt\`, capped. **Jitter** add karो. Jitter ke bina, har client jo same moment par fail hua exactly same later moments par retry karता hai. Ek **retry budget** enforce karो: total retries ko request volume ke ~10% par cap karो. **Max attempts** low rakhो, do ya teen.

## Circuit breakers

Ek circuit breaker aapko ek dependency ko call karने se rोkता hai jo clearly down hai. Iske teen states hain. **Closed** normal operation hai. Jab failure rate ek threshold cross karता hai, breaker **open** mein trip karता hai: ye requests turant reject karता hai. Jab cooldown elapse hoता hai breaker **half-open** mein move karता hai: ye kuch trial requests through jaने deta hai.

Value ye hai ki jab ek dependency genuinely dead hai, har call jo aap iske against karते ho ek thread full timeout duration ke liye waste karता hai. Breaker ek hazaar slow timeout failures ko ek hazaar instant failures ya fallbacks mein badalता hai.

## Bulkheads

Ek bulkhead resource pools isolate karता hai taaki ek misbehaving dependency doosron ko starve na kar sake. Ek single shared connection pool ke bजाय, aap har dependency ko iska apna pool dete ho. Agmar dependency A hang karता hai aur iska dedicated pool fills up, B, C, aur D ko calls completely unaffected hain.

## Hedged requests

Ek hedged request tail latency ko address karता hai. Aap request ek replica ko bhejते ho, aur agmar p95 latency ke elapse hone tak koi response nahi aayi, aap ek doosri copy ek alag replica ko bhejते ho. Ye sirf idempotent operations ke liye safe hai.

## Fallbacks aur graceful degradation

Jab ek dependency unavailable hai, service ko ek degraded but useful answer return karना chahिए ek error ke bजाय. Ek recommendations service down hone ka matlab ek generic "popular items" list dikhाना hai. Har case mein jo feature dependency ne power kiya wo degraded hai, par page abhi bhi renders karता hai.`,

    examples: [
      {
        title: 'Exponential backoff with and without jitter, and a retry budget that caps a storm',
        titleHi: 'Jitter ke saath aur bina exponential backoff, aur ek retry budget jo ek storm cap karता hai',
        code: `# VERIFY
python - <<'PY'
import random
random.seed(7)

def backoff(base, cap, n, jitter):
    ds = []
    for i in range(n):
        exp = min(cap, base * (2 ** i))          # exponential, capped
        d = random.uniform(0, exp) if jitter else exp
        ds.append(round(d, 3))
    return ds

print("exponential backoff, base=0.1s cap=10s, 6 attempts:")
print("  NO jitter  ->", backoff(0.1, 10, 6, False),
      "\\n               (every client retries at the SAME times -> thundering herd)")
print("  FULL jitter->", backoff(0.1, 10, 6, True),
      "\\n               (spread across [0, exp) -> the herd dissolves)")

# a RETRY BUDGET: total retries capped at max(3, 10% of request volume)
reqs = retries = granted = 0
for _ in range(100):                              # 100 requests, all failing, all want a retry
    reqs += 1
    if retries < max(3, reqs * 0.10):
        retries += 1; granted += 1
print()
print("retry BUDGET (cap = max(3, 10% of volume)), 100 failing requests:")
print(f"  {granted} retries granted, {100 - granted} fail fast")
print("  -> a retry storm cannot 2-3x the load on an already-sick dependency")
PY`,
        output: `exponential backoff, base=0.1s cap=10s, 6 attempts:
  NO jitter  -> [0.1, 0.2, 0.4, 0.8, 1.6, 3.2]
               (every client retries at the SAME times -> thundering herd)
  FULL jitter-> [0.032, 0.03, 0.26, 0.058, 0.857, 1.17]
               (spread across [0, exp) -> the herd dissolves)

retry BUDGET (cap = max(3, 10% of volume)), 100 failing requests:
  10 retries granted, 90 fail fast
  -> a retry storm cannot 2-3x the load on an already-sick dependency`,
        explain: 'Two retry mechanics, computed. The backoff schedule doubles each attempt from a hundred milliseconds up to a cap: 0.1, 0.2, 0.4, 0.8, 1.6, 3.2 seconds. Without jitter, every client that failed at the same instant — which is exactly what happens when a dependency goes down and returns errors to everyone at once — retries at precisely those same offsets, so all the retries land together in synchronised waves that hammer the recovering service. With full jitter, each delay is a uniform random value between zero and the exponential value, so the same six attempts spread out irregularly and the retrying clients no longer arrive as a herd. The second part models a retry budget: a hundred requests are all failing and all want to retry, but the budget caps total retries at the larger of three and ten percent of request volume. As the request count climbs to a hundred, the cap climbs to ten, and only ten retries are ever granted — the other ninety requests fail fast without retrying. This is the mechanism that stops a retry storm from multiplying the load on a dependency that is already struggling, which is how a partial outage becomes a total one when every failed request triples the traffic.',
        explainHi: 'Do retry mechanics, computed. Backoff schedule har attempt ko ek sau millisecond se ek cap tak double karता hai: 0.1, 0.2, 0.4, 0.8, 1.6, 3.2 seconds. Jitter ke bina, har client jo same instant par fail hua — jo exactly wo hai jo hota hai jab ek dependency neeche jaती hai aur sab ko ek saath errors return karती hai — precisely un same offsets par retry karता hai, to saare retries ek saath synchronised waves mein land karते hain jo recovering service ko hammer karते hain. Full jitter ke saath, har delay zero aur exponential value ke beech ek uniform random value hai. Doosra part ek retry budget model karता hai: ek sau requests sab fail ho rahi hain aur sab retry karना chahती hain, par budget total retries ko teen aur request volume ke dus percent ke larger par cap karता hai. Sirf dus retries kabhi granted hain — doosri navve requests bina retry kiye fail fast hoती hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# a network call with no timeout (or a default of "infinite" / 60s+)
  client = SomeHttpClient()                 # default timeout: none / 60s
  resp = client.get("http://pricing-svc/price/42")   # blocks... forever
  # pricing-svc gets slow (GC pause, DB lock, its own dependency). your request
  # threads all block on it. new requests queue behind them. your thread pool (200)
  # fills in ~10s. now YOUR service returns 503 to everything - including endpoints
  # that don't even call pricing. one slow dependency -> total outage. cascading.`,
        right: `# a timeout on EVERY call, budgeted down the tree:
  DEADLINE = incoming_request.deadline           # e.g. now + 3s, from the caller
  # calling pricing then inventory:
  t_pricing = min(0.8, DEADLINE.remaining())     # pricing's p99.9 is ~400ms; 0.8 is generous
  resp = client.get(url, connect_timeout=1.0, read_timeout=t_pricing)
  # propagate what's LEFT to the next call:
  t_inventory = min(0.8, DEADLINE.remaining())
  # pass the deadline downstream too: header  X-Deadline: <ms>  or gRPC deadline,
  # so pricing-svc doesn't spend 5s on a request you'll abandon in 0.8s.
  # now: pricing slow -> pricing calls fail in 0.8s -> you serve a fallback or a
  # 503 on THAT endpoint only. the rest of your service is fine.`,
        why: 'A network call without a timeout, or with a default measured in tens of seconds, is the single most common cause of a cascading failure. When the dependency slows down — and every dependency eventually does, from a garbage-collection pause, a lock, or its own downstream problem — the calling request threads block waiting, and because they do not time out they stay blocked. New requests arrive and queue behind them, and within seconds the calling service\'s thread pool or connection pool is fully occupied by threads stuck on the slow dependency. At that point the calling service cannot serve *any* request, including endpoints that have nothing to do with the slow dependency, so it returns errors for everything, and whatever calls it now backs up the same way. The fix is a timeout on every single network call, set from the dependency\'s real p99.9 latency plus margin, and budgeted down the call tree so that a handler with a three-second deadline from its caller does not grant a full three seconds to each of several downstream calls but propagates the remaining time. Passing the deadline downstream as a header or a gRPC deadline additionally stops the dependency from working on a request the caller has already abandoned.',
        whyHi: 'Ek network call bina ek timeout ke, ya ek default ke saath jo tens of seconds mein measured hai, ek cascading failure ka sabse common cause hai. Jab dependency slow ho jaती hai — aur har dependency eventually hoती hai — calling request threads waiting block hoते hain, aur kyunki wo timeout nahi karते wo blocked rehते hain. Naye requests arrive hoते hain aur unke peeche queue karते hain, aur seconds ke andar calling service ka thread pool poori tarah slow dependency par stuck threads dwara occupied hai. Us point par calling service *koi* request serve nahi kar sakती. Fix har single network call par ek timeout hai, dependency ki real p99.9 latency plus margin se set, aur call tree mein neeche budgeted.',
      },
      {
        wrong: `# retrying everything, with no jitter, no budget, on every failure
  for attempt in range(5):
      try:
          return call_downstream()
      except Exception:                     # <-- retries a 400, a 404, an auth error
          time.sleep(2 ** attempt)          # <-- no jitter -> synchronised herd
  # downstream has a 30s blip. 10,000 clients all fail at t=0, all sleep 1s, all
  # retry at t=1 (a 10k-request spike), all fail, all retry at t=2, ... the blip
  # becomes a 5-minute outage because the retries keep re-killing the service as
  # it tries to come back. and the 400s retry 5x for nothing.`,
        right: `# retry ONLY transient errors, with jitter, a budget, and few attempts:
  RETRIABLE = {502, 503, 504, 429}          # + connection errors + timeouts
  budget = TokenBucket(rate=0.10)           # <= 10% of request volume may be retries
  for attempt in range(3):                  # <- 2-3 max
      resp = call_downstream()
      if resp.ok or resp.status not in RETRIABLE:
          return resp                       # success, OR a permanent error - don't retry
      if resp.status == 429 and resp.retry_after:
          delay = resp.retry_after
      else:
          exp = min(10, 0.1 * 2 ** attempt)
          delay = random.uniform(0, exp)    # FULL jitter
      if not budget.take() or DEADLINE.remaining() < delay:
          break                             # budget spent / no time left -> fail fast
      time.sleep(delay)
  return resp                               # give up`,
        why: 'Retrying carelessly turns a brief dependency problem into a sustained one and wastes effort on failures that will never succeed. Retrying every exception means retrying a 400, a 404, or an authentication failure — requests that were rejected for a permanent reason and will be rejected identically every time, so the retries accomplish nothing except load. Retrying without jitter means that ten thousand clients that all failed at the same instant sleep for the same interval and retry at the same instant, producing a synchronised ten-thousand-request spike that hits the dependency exactly as it is trying to recover and knocks it back down, so a thirty-second blip becomes a five-minute outage sustained by the retry pattern itself. Retrying without a budget means that during an outage every failed request generates two or three more, tripling the load on the service least able to handle it. The correct approach retries only genuinely transient status codes and connection errors, applies full jitter so the retrying clients spread out, enforces a budget capping total retries at around ten percent of request volume so a storm cannot form, respects an explicit Retry-After when the server sends one, checks the caller\'s remaining deadline before sleeping, and caps attempts at two or three.',
        whyHi: 'Carelessly retry karना ek brief dependency problem ko ek sustained one mein badalता hai aur un failures par effort waste karता hai jo kabhi succeed nahi karengे. Har exception retry karने ka matlab ek 400, ek 404, ya ek authentication failure retry karना hai — requests jo ek permanent reason ke liye rejected the aur har baar identically rejected honge. Jitter ke bina retry karने ka matlab ki das hazaar clients jo sab same instant par fail hue same interval ke liye sleep karते hain aur same instant par retry karते hain. Ek budget ke bina retry karने ka matlab ki ek outage ke dauraan har failed request do ya teen aur generate karता hai. Correct approach sirf genuinely transient status codes retry karता hai, full jitter apply karता hai, ek budget enforce karता hai, ek explicit Retry-After respect karता hai, aur attempts ko do ya teen par cap karता hai.',
      },
      {
        wrong: `# no circuit breaker: hammering a dead dependency for its full timeout, forever
  # recommendations-svc is completely down (crashed, OOM, deploy gone wrong).
  # every request to your product page calls it, with a (good!) 2s timeout.
  # 500 req/s x 2s each = 1000 threads permanently stuck on the dead service.
  # your latency p50 jumps to 2s+ (every request waits the full timeout), your
  # thread pool is saturated, and you're adding 500 req/s of load to a service
  # that is trying to restart. the 2s timeout HELPED but isn't enough.`,
        right: `# a circuit breaker in front of each dependency:
  breaker = CircuitBreaker(
      failure_threshold=0.5,       # trip if >50% of the last 20 calls failed
      window=20,
      cooldown=30,                 # stay OPEN for 30s
  )
  def get_recs(user):
      if breaker.is_open():
          return POPULAR_ITEMS     # fallback, INSTANT - no thread wasted
      try:
          r = client.get(url, read_timeout=2.0)
          breaker.record_success()
          return r.json()
      except (Timeout, HttpError):
          breaker.record_failure()
          return POPULAR_ITEMS
  # now: recs-svc dies -> ~20 requests fail (2s each) -> breaker OPENS -> the next
  # thousands of requests get POPULAR_ITEMS in <1ms. p50 back to normal. zero load
  # on recs-svc while it restarts. after 30s, a few trial calls; if they work, CLOSED.`,
        why: 'A timeout limits the damage of a single slow call but does nothing to stop you from making thousands more calls to a dependency that is definitively down. If the dependency has crashed and every call to it will time out, then at five hundred requests per second with a two-second timeout you have a thousand threads permanently occupied waiting for a service that will never answer, your own latency rises to the timeout value because every request waits the full two seconds before failing over to a fallback, and you are adding the full request load to a service that is trying to restart. A circuit breaker fixes what the timeout cannot: after a threshold number of failures in a rolling window it trips open and rejects calls immediately, returning the fallback in under a millisecond instead of after a two-second wait, which frees the threads, restores your latency, and removes the load from the failed dependency entirely so it can recover. After a cooldown it lets a few trial requests through, and closes again only if they succeed. The timeout and the breaker work together: the timeout bounds each individual failure, and the breaker stops you from repeating it thousands of times.',
        whyHi: 'Ek timeout ek single slow call ke damage ko limit karता hai par aapko ek dependency ko hazaron aur calls karने se rोkने ke liye kuch nahi karता jo definitively down hai. Agmar dependency crash ho gaya hai aur iske har call timeout karega, to paanch sau requests per second par ek do-second timeout ke saath aapke paas ek hazaar threads permanently occupied hain, aapki apni latency timeout value tak rise karती hai, aur aap full request load ek service par add kar rahe ho jo restart karने ki koshish kar raha hai. Ek circuit breaker wo fix karता hai jo timeout nahi kar sakता: ek threshold number of failures ke baad ek rolling window mein ye open trip karता hai aur calls turant reject karता hai. Timeout aur breaker ek saath kaam karते hain.',
      },
    ],

    realWorld: [
      {
        en: '**No timeout, total outage from a 200ms dependency** — an HTTP client\'s default was infinite. The pricing service had a 4-minute GC-death-spiral; the caller\'s 400-thread pool filled in 90s and it returned 503 to *every* endpoint, including ones that never touched pricing. Adding a 600ms timeout budgeted from the request deadline contained the next one to the pricing endpoint alone.',
        hi: '**Koi timeout nahi, ek 200ms dependency se total outage** — ek HTTP client ka default infinite tha. Pricing service ki ek 4-minute GC-death-spiral thi; caller ka 400-thread pool 90s mein fill hua aur usne *har* endpoint ko 503 return kiya. Ek 600ms timeout add karna agle ko akele pricing endpoint tak contain kiya.',
      },
      {
        en: '**Jitterless retries, a 30s blip → 6-minute outage** — a mobile client retried on any error with `sleep(2**n)` and no jitter. When the API had a brief overload, ~40k clients retried in perfect lockstep at t=1, 3, 7, 15s, each wave re-overloading it. Adding full jitter + a max of 2 retries + honouring `Retry-After` ended the pattern.',
        hi: '**Jitterless retries, ek 30s blip → 6-minute outage** — ek mobile client kisi bhi error par `sleep(2**n)` aur koi jitter ke saath retry karta tha. Jab API mein ek brief overload tha, ~40k clients perfect lockstep mein retry karte the. Full jitter + max 2 retries + `Retry-After` honour karna pattern ko khatam kiya.',
      },
      {
        en: '**Dead recs service, p50 pinned at the timeout** — recommendations crashed on a bad deploy. Every product page waited the full 1.5s timeout then fell back; p50 went from 80ms to 1.6s for 20 minutes. A circuit breaker (trip at 50%/20, 30s cooldown) would have pinned it to ~80ms with an instant fallback after the first ~20 failures. It was added that week.',
        hi: '**Dead recs service, p50 timeout par pinned** — recommendations ek bad deploy par crash hua. Har product page full 1.5s timeout wait karta tha phir fall back karta tha; p50 80ms se 1.6s tak gaya 20 minute ke liye. Ek circuit breaker ise ~80ms par pin kar deta. Ye us hafte add kiya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does every network call need a timeout, and what is "budgeting" the timeout down the call tree?',
        qHi: 'Har network call ko ek timeout kyun chahिए, aur timeout ko call tree mein neeche "budgeting" kya hai?',
        a: 'A network call without a timeout is the most common cause of cascading failure. When a dependency slows down — from a garbage-collection pause, a lock, or its own downstream problem — the request threads calling it block waiting, and with no timeout they stay blocked. New requests queue behind them, and within seconds the calling service\'s thread pool or connection pool is fully occupied by threads stuck on the slow dependency. At that point the calling service cannot serve any request, including endpoints unrelated to that dependency, so it fails for everything, and whatever calls it backs up the same way — the failure propagates up the stack. A timeout converts "one dependency is slow" into "calls to one dependency fail quickly and we serve a fallback or an error on that path only". You set the timeout from the dependency\'s real observed p99.9 latency plus a margin, not a round guess. Budgeting the timeout down the call tree means that if your caller gave you a three-second deadline and your handler calls A and then B, you do not give each a three-second timeout — you propagate the remaining deadline, so A gets roughly the time available and B gets what is left after A returns. You also pass the deadline downstream, as an HTTP header or a gRPC deadline, so the dependency does not spend five seconds computing a response for a request you will abandon in under one.',
        aHi: 'Ek network call bina ek timeout ke cascading failure ka sabse common cause hai. Jab ek dependency slow ho jaती hai, ise call karने wale request threads waiting block hoते hain, aur bina timeout ke wo blocked rehते hain. Naye requests unke peeche queue karते hain, aur seconds ke andar calling service ka thread pool poori tarah slow dependency par stuck threads dwara occupied hai. Us point par calling service koi request serve nahi kar sakती. Ek timeout "ek dependency slow hai" ko "ek dependency ko calls jaldi fail hoती hain" mein badalता hai. Aap timeout ko dependency ki real observed p99.9 latency plus ek margin se set karते ho. Timeout ko call tree mein neeche budgeting karने ka matlab ki agmar aapke caller ne aapko ek teen-second deadline diya, aap har ek ko ek teen-second timeout nahi dete — aap remaining deadline propagate karते ho.',
      },
      {
        q: 'What are the rules for retrying safely — what to retry, backoff, jitter, budget?',
        qHi: 'Safely retry karने ke rules kya hain — kya retry karना, backoff, jitter, budget?',
        a: 'Retry only genuinely transient failures: a timeout, a connection reset, a 502, 503, or 504, and a 429 whose Retry-After you honour. Do not retry a 400, 404, 401, or 422 — those were rejected for a permanent reason and will be rejected identically, so the retry is pure wasted load. Do not retry a non-idempotent write without an idempotency key, because you may apply it twice. And do not retry anything already past the caller\'s deadline. Use exponential backoff — wait a base delay times two to the attempt number, capped at a maximum — so the interval grows as the failure persists. Add full jitter, meaning the actual delay is a uniform random value between zero and the exponential value, because without jitter every client that failed at the same instant retries at exactly the same later instants, producing a synchronised thundering herd that hits the recovering service in waves and keeps knocking it down. Enforce a retry budget: cap the total volume of retries at a small fraction of request volume, around ten percent, with a token bucket or a ratio check, and once the budget is spent, fail fast. This stops a retry storm from doubling or tripling the load on a dependency that is already struggling and turning a partial outage into a total one. Keep max attempts to two or three, because more attempts just delay the inevitable failure and consume the caller\'s deadline.',
        aHi: 'Sirf genuinely transient failures retry karो: ek timeout, ek connection reset, ek 502, 503, ya 504, aur ek 429 jiska Retry-After aap honour karते ho. Ek 400, 404, 401, ya 422 retry mat karो — wo ek permanent reason ke liye rejected the. Ek non-idempotent write bina ek idempotency key ke retry mat karो. Aur kuch bhi jo already caller ki deadline ke past hai retry mat karो. Exponential backoff use karो. Full jitter add karो, matlab actual delay zero aur exponential value ke beech ek uniform random value hai, kyunki jitter ke bina har client jo same instant par fail hua exactly same later instants par retry karता hai. Ek retry budget enforce karो: total retries ko request volume ke ~10% par cap karो. Max attempts ko do ya teen par rakhो.',
      },
      {
        q: 'How does a circuit breaker work, what does it add beyond a timeout, and what is a bulkhead?',
        qHi: 'Ek circuit breaker kaise kaam karता hai, ye ek timeout ke aage kya add karता hai, aur ek bulkhead kya hai?',
        a: 'A circuit breaker has three states. Closed is normal: requests flow through and the breaker counts failures in a rolling window. When the failure rate crosses a threshold — say fifty percent of the last twenty calls — it trips open and rejects requests immediately without attempting the call, failing fast or returning a fallback, and it stays open for a cooldown period. When the cooldown elapses it moves to half-open, lets a small number of trial requests through, and returns to closed if they succeed or back to open if they fail. It adds what a timeout cannot: a timeout bounds the cost of one slow call, but it does not stop you from making thousands more calls to a dependency that is definitively down, each wasting a thread for the full timeout duration, pinning your latency at the timeout value, and adding load to a service trying to restart. The breaker converts a thousand slow timeout failures into a thousand instant failures or fallbacks, freeing threads, restoring latency, and removing load from the dead dependency. A bulkhead is a separate resource pool — connection pool, thread pool, or semaphore — for each downstream dependency, so that if dependency A hangs and its dedicated pool fills, calls to B, C, and D are unaffected because they draw from their own pools. Without bulkheads, A\'s hang consumes a shared pool and every downstream call blocks. The name is from ship compartments: a sealed section floods, the ship stays afloat.',
        aHi: 'Ek circuit breaker ke teen states hain. Closed normal hai: requests flow karते hain aur breaker ek rolling window mein failures count karता hai. Jab failure rate ek threshold cross karता hai, ye open trip karता hai aur requests turant reject karता hai bina call attempt kiye. Jab cooldown elapse hoता hai ye half-open mein move karता hai. Ye wo add karता hai jo ek timeout nahi kar sakता: ek timeout ek slow call ki cost bound karता hai, par ye aapko ek dependency ko hazaron aur calls karने se nahi rोkता jo definitively down hai. Breaker ek hazaar slow timeout failures ko ek hazaar instant failures mein badalता hai. Ek bulkhead har downstream dependency ke liye ek separate resource pool hai, taaki agmar dependency A hang karता hai aur iska dedicated pool fills, B, C, aur D ko calls unaffected hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain timeouts (why every call needs one, how to set it, budgeting down the tree, connect vs read) and how the lack of one causes cascading failure.',
        taskHi: 'Ek comment mein, timeouts samjhao.',
        hint: 'EVERY network call needs a HARD DEADLINE, NO exceptions. WHY (cascading failure): a dependency slows (a GC pause / a lock / its own downstream problem — every dependency eventually does). Your request threads block waiting; with NO timeout they STAY blocked. New requests QUEUE behind them → within ~10s your thread pool / connection pool (say 200/400) is FULLY occupied by threads stuck on the slow dependency → your service now returns 503 to EVERY endpoint, INCLUDING ones that never call that dependency → whatever calls YOU backs up the same way → the failure PROPAGATES UP THE STACK. A timeout converts "one dependency is slow" → "calls to one dependency fail fast, we serve a fallback / a 503 on THAT path only". HOW TO SET IT: from the dependency\'s OWN observed p99.9 latency + a margin — NOT a round guess (not "30s because that feels safe"). BUDGET IT DOWN THE CALL TREE: if your caller gave you a 3s deadline and your handler calls A then B, you CANNOT give each a 3s timeout — propagate the REMAINING deadline: `t_A = min(A_generous, deadline.remaining())`, then `t_B = min(B_generous, deadline.remaining())` (what\'s left after A). Also PASS the deadline downstream (an `X-Deadline` header / a gRPC deadline) so the dependency doesn\'t spend 5s computing a response for a request you\'ll abandon in 0.8s. SEPARATE the CONNECT timeout (SHORT, ~1s — establishing a TCP connection is fast when the target is healthy; a slow connect = the target is down) from the READ timeout (covers the actual work, sized from p99.9). Result: pricing slow → pricing calls fail in 0.8s → fallback or a 503 on the pricing endpoint ONLY → the rest of your service is fine.',
        hintHi: 'HAR network call ko ek HARD DEADLINE chahिए, KOI exceptions nahi. WHY (cascading failure): ek dependency slow hoती hai. Aapke request threads waiting block hoते hain; NO timeout ke saath wo BLOCKED REHTE hain. Naye requests unke peeche QUEUE karते hain → ~10s ke andar aapka thread pool FULLY occupied → aapki service ab HAR endpoint ko 503 return karती hai, INCLUDING jo us dependency ko kabhi call nahi karते → failure UP THE STACK PROPAGATE karता hai. HOW TO SET: dependency ki APNI observed p99.9 latency + ek margin se — ek round guess NAHI. BUDGET IT DOWN THE TREE: agmar caller ne 3s diya aur aap A phir B call karते ho, har ek ko 3s timeout NAHI de sakte — REMAINING deadline propagate karो. Deadline downstream PASS karो. CONNECT timeout (SHORT, ~1s) ko READ timeout se SEPARATE karो.',
      },
      {
        task: 'In a comment, give the full retry ruleset: what is retriable vs not, exponential backoff, why jitter matters, the retry budget, and max attempts.',
        taskHi: 'Ek comment mein, poora retry ruleset do.',
        hint: 'RETRY ONLY GENUINELY TRANSIENT FAILURES: a timeout, a connection reset, a 502/503/504, a 429 (HONOUR its `Retry-After`). DON\'T RETRY: a 400 / 404 / 401 / 422 (rejected for a PERMANENT reason → will be rejected identically → pure wasted load); a NON-IDEMPOTENT WRITE without an idempotency key (you may apply it TWICE — Lesson 3 / Module 14); anything already PAST the caller\'s deadline. EXPONENTIAL BACKOFF: wait `base × 2^attempt`, CAPPED at a max → 0.1s, 0.2s, 0.4s, 0.8s, 1.6s, 3.2s (…cap). The interval grows as the failure persists. WHY JITTER MATTERS: without jitter, EVERY client that failed at the SAME instant (exactly what happens when a dependency goes down and errors to everyone at once) sleeps the SAME interval and retries at the SAME later instants → a SYNCHRONISED THUNDERING HERD that hits the recovering service in WAVES and knocks it back down → a 30s blip becomes a 6-min outage SUSTAINED BY THE RETRY PATTERN ITSELF. FULL JITTER = the actual delay is `uniform(0, exp)` → the retrying clients spread out irregularly, the herd dissolves. (Equal jitter: `exp/2 + uniform(0, exp/2)` — a compromise.) RETRY BUDGET: cap the TOTAL VOLUME of retries at a small fraction of request volume (~10%) with a TOKEN BUCKET or a ratio check; once the budget is spent → FAIL FAST (no retry). This stops a retry storm from 2-3×-ing the load on a dependency that is ALREADY struggling and turning a PARTIAL outage into a TOTAL one (every failed request generating 2-3 more). MAX ATTEMPTS: 2-3. More just DELAYS the inevitable failure and CONSUMES the caller\'s deadline (which could have been spent serving a fallback). Also: check `deadline.remaining() >= delay` BEFORE sleeping — don\'t sleep into a deadline you\'ll miss.',
        hintHi: 'SIRF GENUINELY TRANSIENT FAILURES RETRY karो: ek timeout, connection reset, 502/503/504, ek 429 (`Retry-After` HONOUR karो). MAT RETRY karो: 400/404/401/422 (PERMANENT reason → identically rejected); ek NON-IDEMPOTENT WRITE bina idempotency key ke (DO BAAR apply — Lesson 3); kuch bhi already caller ki deadline ke PAST. EXPONENTIAL BACKOFF: `base × 2^attempt`, CAPPED. JITTER KYUN: bina jitter, HAR client jo SAME instant par fail hua SAME interval sleep karता hai aur SAME later instants par retry → SYNCHRONISED THUNDERING HERD → 30s blip → 6-min outage. FULL JITTER = `uniform(0, exp)`. RETRY BUDGET: total retries ko ~10% par cap (TOKEN BUCKET); budget spent → FAIL FAST. MAX ATTEMPTS: 2-3.',
      },
      {
        task: 'In a comment, explain the circuit breaker (3 states, thresholds, what it adds beyond a timeout), bulkheads, hedged requests, and fallbacks/graceful degradation.',
        taskHi: 'Ek comment mein, circuit breaker, bulkheads, hedged requests, aur fallbacks samjhao.',
        hint: 'CIRCUIT BREAKER — 3 STATES: CLOSED (normal; requests flow; count failures in a ROLLING WINDOW) --[failure rate > threshold, e.g. >50% of the last 20 calls]--> OPEN (REJECT IMMEDIATELY — don\'t even attempt the call; fail fast / return a fallback; stay open for a COOLDOWN, e.g. 30s) --[cooldown elapsed]--> HALF-OPEN (let a FEW trial requests through) → success → CLOSED (recovered); failure → OPEN (another cooldown). WHAT IT ADDS BEYOND A TIMEOUT: a timeout bounds the cost of ONE slow call, but does NOT stop you making THOUSANDS MORE calls to a dependency that is DEFINITIVELY down — each wasting a thread for the FULL timeout duration (500 req/s × 2s = 1000 stuck threads), PINNING your p50 at the timeout value (every request waits the full 2s before the fallback), and ADDING the full load to a service trying to restart. The breaker converts "1000 slow-timeout failures" → "1000 INSTANT failures / fallbacks (<1ms)" → frees the threads, restores latency, removes ALL load from the dead dependency so it can recover. Timeout + breaker work TOGETHER: the timeout bounds each individual failure, the breaker stops you repeating it 1000×. BULKHEAD — a SEPARATE resource pool (connection pool / thread pool / semaphore) PER downstream dependency. If A hangs and its dedicated pool (say 20) fills, calls to B/C/D are UNAFFECTED (their own pools). WITHOUT bulkheads: A\'s hang consumes the SHARED pool → every downstream call (incl. healthy ones) blocks. (Name: ship hull compartments — one floods, the ship floats.) HEDGED REQUEST — for TAIL latency: send the request; if no response by the p95 time, send a SECOND copy to a DIFFERENT replica; take whichever returns FIRST; cancel the other. Cuts p99/p99.9 dramatically at ~5% extra load (the 2nd copy only fires for the slow tail). ONLY for IDEMPOTENT operations (reads, idempotent writes). FALLBACK / GRACEFUL DEGRADATION — when a dependency is unavailable, return a DEGRADED-but-useful answer, NOT an error: recs down → a generic "popular items" list; pricing-enrichment down → the base price, omit the discount badge; avatar service down → the user\'s initials. The FEATURE the dependency powered is degraded; the PAGE still renders + the core action still works. (Module 15 L1: alert on the JOURNEY success rate — it catches the case where every HTTP call returned 200 but the result was missing something.)',
        hintHi: 'CIRCUIT BREAKER — 3 STATES: CLOSED (normal; ROLLING WINDOW mein failures count) --[failure rate > threshold, e.g. >50% of last 20]--> OPEN (TURANT REJECT — call attempt bhi nahi; COOLDOWN ke liye, e.g. 30s) --[cooldown elapsed]--> HALF-OPEN (kuch trial requests) → success → CLOSED; failure → OPEN. TIMEOUT KE AAGE KYA: ek timeout ONE slow call ki cost bound karता hai, par aapko HAZARON AUR calls karने se NAHI rोkता jo DEFINITIVELY down hai. Breaker "1000 slow-timeout failures" → "1000 INSTANT failures / fallbacks". BULKHEAD — per downstream dependency ek SEPARATE pool. A hang → B/C/D UNAFFECTED. HEDGED REQUEST — TAIL latency: p95 time tak koi response nahi → ek DOOSRI copy doosre replica ko; jo pehle return kare. SIRF IDEMPOTENT. FALLBACK — dependency unavailable → DEGRADED-but-useful answer, error NAHI.',
      },
    ],

    keyTakeaways: [
      'TIMEOUT on EVERY network call — no exceptions. Without one, a slow dependency holds your threads/connections until your pool is exhausted → you fail for EVERY endpoint → CASCADING failure up the stack. Set it from the dependency\'s p99.9 + margin; BUDGET the remaining deadline down the call tree (not the full timeout to each downstream); pass the deadline downstream; separate a short CONNECT timeout from the READ timeout.',
      'RETRY only TRANSIENT failures (timeout / reset / 502-504 / 429-honour-Retry-After) — NEVER a 400/404/401/422, a non-idempotent write without an idempotency key, or anything past the deadline. Use EXPONENTIAL BACKOFF + FULL JITTER (`uniform(0, exp)`) — without jitter, clients that failed together retry together → a synchronised THUNDERING HERD that re-kills the recovering service. Enforce a RETRY BUDGET (~10% of volume, a token bucket) → past it, fail fast. MAX 2-3 attempts.',
      'A CIRCUIT BREAKER (CLOSED → [failure rate > threshold] → OPEN [reject instantly for a cooldown] → HALF-OPEN [trial requests] → CLOSED/OPEN) adds what a timeout can\'t: it stops you making thousands more calls to a DEAD dependency, each wasting a thread for the full timeout and pinning your latency there. It converts slow-timeout failures into instant fallbacks and removes load so the dependency can recover.',
      'A BULKHEAD is a SEPARATE resource pool per downstream dependency → one hanging dependency fills only its own pool, the others are unaffected (vs a shared pool where one hang blocks everything). A HEDGED REQUEST sends a second copy to another replica if the first is slow past p95, takes the fastest → cuts p99 hugely at ~5% load — IDEMPOTENT ops only.',
      'FALLBACK / GRACEFUL DEGRADATION: when a dependency is down, return a DEGRADED-but-useful answer (popular items, base price, initials), NOT an error → the feature degrades but the PAGE still works. Alert on the JOURNEY success rate (Module 15 L1) to catch "every call returned 200 but the result is missing something".',
    ],
    keyTakeawaysHi: [
      'HAR network call par TIMEOUT — koi exceptions nahi. Iske bina, ek slow dependency aapke threads/connections hold karता hai jab tak aapka pool exhausted nahi → aap HAR endpoint ke liye fail karते ho → CASCADING failure. Ise dependency ki p99.9 + margin se set karो; remaining deadline ko call tree mein neeche BUDGET karो; deadline downstream pass karो; ek short CONNECT timeout ko READ timeout se separate karो.',
      'SIRF TRANSIENT failures RETRY karो (timeout / reset / 502-504 / 429-Retry-After-honour) — KABHI ek 400/404/401/422, ek non-idempotent write bina idempotency key ke, ya kuch bhi deadline ke past nahi. EXPONENTIAL BACKOFF + FULL JITTER use karो — jitter ke bina, clients jo ek saath fail hue ek saath retry karते hain → ek synchronised THUNDERING HERD. Ek RETRY BUDGET enforce karो (~10% of volume). MAX 2-3 attempts.',
      'Ek CIRCUIT BREAKER (CLOSED → [failure rate > threshold] → OPEN [ek cooldown ke liye turant reject] → HALF-OPEN [trial requests] → CLOSED/OPEN) wo add karता hai jo ek timeout nahi kar sakта: ye aapko ek DEAD dependency ko hazaron aur calls karने se rोkता hai. Ye slow-timeout failures ko instant fallbacks mein badalता hai aur load remove karता hai.',
      'Ek BULKHEAD per downstream dependency ek SEPARATE resource pool hai → ek hanging dependency sirf apna pool fills karता hai, doosre unaffected hain. Ek HEDGED REQUEST ek doosri copy doosre replica ko bhejता hai agmar pehli p95 ke past slow hai → p99 hugely kaatता hai ~5% load par — SIRF IDEMPOTENT ops.',
      'FALLBACK / GRACEFUL DEGRADATION: jab ek dependency down hai, ek DEGRADED-but-useful answer return karो (popular items, base price, initials), ek error NAHI → feature degrade hoता hai par PAGE abhi bhi kaam karता hai. JOURNEY success rate par alert karो (Module 15 L1).',
    ],
  },

  {
    slug: 'ops-idempotency-at-least-once-and-backpressure',
    title: 'Idempotency, At-Least-Once & Backpressure',
    titleHi: 'Idempotency, At-Least-Once Aur Backpressure',
    description:
      'Why "exactly once" is a fiction on a real network, how idempotency keys and deduplication let you build correct systems on at-least-once delivery, and the family of admission-control mechanisms — rate limiting with a token bucket, load shedding, backpressure, and queue-based load levelling — that keep a service from collapsing when demand exceeds capacity.',
    descriptionHi:
      'Kyun "exactly once" ek real network par ek fiction hai, kaise idempotency keys aur deduplication aapko at-least-once delivery par correct systems build karने dete hain, aur admission-control mechanisms ki family — ek token bucket ke saath rate limiting, load shedding, backpressure, aur queue-based load levelling — jo ek service ko collapse hone se rोkते hain jab demand capacity se zyada ho jaती hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Mailing a cheque and then not hearing back.** Did the cheque arrive and the reply get lost, or did the cheque itself get lost? You cannot tell from your end. If you send another cheque and the first one *had* arrived, you have now paid twice — unless each cheque carries the same invoice number and the recipient files by invoice number, in which case the second one is recognised as a duplicate and ignored. That invoice number is an idempotency key. Separately: a bank branch can only serve so many customers an hour. If a coach party of two hundred arrives at once, the sensible branch hands out numbered tickets and asks people to wait or come back — it does not try to serve all two hundred at once, jam every desk, and end up serving nobody. The tickets are a queue; turning people away at the door when even the queue is full is load shedding.',
      hi: '**Ek cheque mail karना aur phir wapas na sunना.** Kya cheque aaya aur reply lost ho gaya, ya cheque khud lost ho gaya? Aap apne end se nahi bata sakte. Agmar aap ek aur cheque bhejते ho aur pehla *aaya tha*, aapne ab do baar pay kiya hai — jab tak har cheque same invoice number carry na kare aur recipient invoice number se file na kare. Wo invoice number ek idempotency key hai. Alag se: ek bank branch ek ghante mein sirf itne customers serve kar sakती hai. Agmar do sau ki ek coach party ek saath aaती hai, sensible branch numbered tickets deती hai aur logon se wait karने ko kehती hai — ye sabhi do sau ko ek saath serve karने, har desk jam karने, aur kisi ko bhi serve na karने ki koshish nahi karती.',
    },

    simple: `**"EXACTLY ONCE" DELIVERY DOES NOT EXIST on an unreliable network.** When you
send a request and get no response, you cannot know whether:
\`\`\`
(a) the request never arrived        -> you SHOULD resend
(b) it arrived, was processed, and the RESPONSE was lost  -> resending = a DUPLICATE
\`\`\`
You can have **at-most-once** (never retry — may lose data) or **at-least-once**
(retry until acked — may duplicate). Everyone real picks **at-least-once** and makes
the duplicates harmless. "Exactly once" = at-least-once delivery + **idempotent
processing / dedup**. It is an illusion built on the receiver, not a network feature.

**IDEMPOTENT** = doing it twice has the same effect as doing it once.
\`\`\`
naturally idempotent:   PUT /users/42 {name:"Jo"}   (set to a value)
                        DELETE /users/42            (gone is gone)
                        GET anything
NOT idempotent:         POST /transfers {amt:100}   (charges $100 EACH time)
                        counter += 1
                        "append a row"
\`\`\`

**IDEMPOTENCY KEY** — make a non-idempotent write safe to retry:
\`\`\`
client generates a unique key per LOGICAL operation (a UUID):
    POST /transfers   Idempotency-Key: 7f3a-...   {amt:100}
server, FIRST time:  process it, store (key -> result) for e.g. 24h, return result
server, SAME key again:  DON'T process. return the STORED result.
=> the client can now retry freely. Stripe, PayPal, every payment API works this way.
Store the key + result in the SAME transaction as the effect (or you can dedup but
still double-process on a crash between the two writes).
\`\`\`

**RATE LIMITING** — cap how fast a client (or the world) can call you:
\`\`\`
TOKEN BUCKET (the common one): a bucket holds up to  capacity  tokens, refills at
   refill_rate /sec. each request takes 1 token. no token -> 429 (or queue).
   -> allows BURSTS up to  capacity , then settles to  refill_rate .
LEAKY BUCKET: requests drain from a queue at a FIXED rate -> smooths, no bursts.
SLIDING WINDOW: count requests in the last 60s -> accurate, more state.
return  429  + a  Retry-After  header + rate-limit headers (limit/remaining/reset).
\`\`\`

**LOAD SHEDDING** — when you are ALREADY overloaded, deliberately drop the
lowest-value work so the rest succeeds:
\`\`\`
at 100% CPU / a full queue: reject NEW requests fast with 429/503 rather than
accept them, queue them, blow your latency SLO, and fall over serving NOTHING.
prioritise: shed health-check-y / retryable / anonymous traffic first;
protect checkout / paying users / already-in-flight requests.
"a fast 503 beats a slow timeout" - it lets the caller fail over NOW.
\`\`\`

**BACKPRESSURE** — a slow consumer tells a fast producer to slow down, rather
than silently building an unbounded queue that eventually OOMs:
\`\`\`
bounded queues everywhere. queue full -> the producer BLOCKS (or gets a 429).
TCP does this natively (the receive window). gRPC/HTTP2 flow control. Reactive
Streams "request(n)". Kafka consumer lag as the signal to scale or slow producers.
the ANTI-pattern: an unbounded in-memory queue -> latency grows without bound,
then the process OOM-kills and drops EVERYTHING in the queue at once.
\`\`\`

**QUEUE-BASED LOAD LEVELLING** — put a durable queue (SQS, a broker) between a
spiky producer and a fixed-capacity consumer. The queue absorbs the spike; the
consumer works at its own steady rate; a backlog builds and drains. Trades
latency (during the spike) for not falling over. Watch queue DEPTH and AGE.`,

    simpleHi: `**"EXACTLY ONCE" DELIVERY EXIST NAHI KARTI ek unreliable network par.** Jab aap
ek request bhejते ho aur koi response nahi milता, aap nahi jaan sakte ki:
\`\`\`
(a) request kabhi nahi aayi           -> aapko RESEND karना CHAHIYE
(b) ye aayi, process hui, aur RESPONSE lost ho gaya  -> resending = ek DUPLICATE
\`\`\`
Aapke paas **at-most-once** (kabhi retry nahi — data lose kar sakta) ya
**at-least-once** (retry jab tak acked — duplicate kar sakta) ho sakता hai. Har
real koi **at-least-once** pick karता hai aur duplicates ko harmless banाता hai.

**IDEMPOTENT** = do baar karने ka wahi effect hai jo ek baar karने ka.
\`\`\`
naturally idempotent:   PUT /users/42 {name:"Jo"}   (ek value par set)
                        DELETE /users/42            (gaya to gaya)
NOT idempotent:         POST /transfers {amt:100}   (HAR baar $100 charge)
                        counter += 1
\`\`\`

**IDEMPOTENCY KEY** — ek non-idempotent write ko retry karने ke liye safe banाओ:
\`\`\`
client per LOGICAL operation ek unique key generate karता hai (ek UUID):
    POST /transfers   Idempotency-Key: 7f3a-...   {amt:100}
server, PEHLI baar:  process karो, (key -> result) store karो e.g. 24h ke liye, result return karो
server, SAME key phir:  process MAT karो. STORED result return karो.
=> client ab freely retry kar sakता hai. Stripe, PayPal, har payment API aise kaam karता hai.
Key + result ko effect ke SAME transaction mein store karो.
\`\`\`

**RATE LIMITING** — cap karो ki ek client kitni tezi se aapko call kar sakता hai:
\`\`\`
TOKEN BUCKET (common wala): ek bucket  capacity  tokens tak rakhता hai, refills at
   refill_rate /sec. har request 1 token leता hai. koi token nahi -> 429.
   -> BURSTS allow karता hai  capacity  tak, phir  refill_rate  par settle.
LEAKY BUCKET: requests ek queue se FIXED rate par drain -> smooths, no bursts.
SLIDING WINDOW: last 60s mein requests count -> accurate, zyada state.
 429  + ek  Retry-After  header return karो.
\`\`\`

**LOAD SHEDDING** — jab aap ALREADY overloaded ho, deliberately lowest-value work
drop karो taaki baaki succeed ho:
\`\`\`
100% CPU / ek full queue par: NEW requests ko fast 429/503 se reject karो bजाय
inhe accept karने, queue karने, latency SLO blow karने, aur NOTHING serve karते girने ke.
prioritise karो: health-check-y / retryable / anonymous traffic pehle shed karो;
checkout / paying users / already-in-flight requests protect karो.
"ek fast 503 ek slow timeout se behtar hai".
\`\`\`

**BACKPRESSURE** — ek slow consumer ek fast producer ko slow down karने ko kehता hai:
\`\`\`
bounded queues har jagah. queue full -> producer BLOCKS (ya ek 429 milता hai).
TCP ye natively karता hai. gRPC/HTTP2 flow control. Kafka consumer lag as the signal.
ANTI-pattern: ek unbounded in-memory queue -> latency bound ke bina grow, phir
process OOM-kill hota hai aur queue mein sab kuch ek saath drop karता hai.
\`\`\`

**QUEUE-BASED LOAD LEVELLING** — ek spiky producer aur ek fixed-capacity consumer
ke beech ek durable queue (SQS, ek broker) rakhो. Queue spike absorb karती hai;
consumer apne steady rate par kaam karता hai. Latency (spike ke dauraan) trade
karता hai girने na ke liye. Queue DEPTH aur AGE watch karो.`,

    content: `## Exactly-once is a fiction

When you send a request over a network and receive no response, there are two possibilities you cannot distinguish from your side: the request never arrived, or it arrived and was fully processed and the response was lost on the way back. If you resend, you are correct in the first case and you create a duplicate in the second. This is fundamental — no protocol removes it. You get to choose between at-most-once delivery, where you never retry and therefore sometimes lose messages, and at-least-once delivery, where you retry until you get an acknowledgement and therefore sometimes deliver twice. Every real system chooses at-least-once and then makes duplicates harmless. "Exactly-once semantics", where it is offered, is at-least-once delivery combined with idempotent processing or deduplication on the receiver — it is a property built at the application layer, not a feature of the network.

## Idempotency

An operation is idempotent if performing it twice has the same effect as performing it once. Setting a value with PUT, deleting a resource with DELETE, and any GET are naturally idempotent. Charging a card with POST, incrementing a counter, and appending a row are not — each repetition adds another effect. To make a non-idempotent write safe to retry, the client generates a unique idempotency key for each logical operation, typically a UUID, and sends it with the request. The first time the server sees that key it processes the request, stores the mapping from key to result for some retention window such as twenty-four hours, and returns the result. If the same key arrives again the server does not process it a second time; it returns the stored result. The client can now retry as much as it likes. This is how Stripe, PayPal, and essentially every payment API work. The critical implementation detail is that the key and the result must be stored in the same transaction as the effect itself — if you write the effect and then separately write the dedup record, a crash between the two leaves you able to double-process.

## Rate limiting

Rate limiting caps how fast a given client, or the whole world, can call you. The most common algorithm is the token bucket: a bucket holds up to some capacity of tokens and refills at a fixed rate per second; each request removes one token, and a request that finds no token is rejected with a 429 or queued. This permits bursts up to the bucket capacity and then settles to the refill rate, which matches how real clients behave. A leaky bucket instead drains queued requests at a fixed rate, smoothing output completely but allowing no bursts. A sliding window counts requests in the trailing period and is accurate but keeps more state. Whatever the algorithm, return a 429 with a Retry-After header and rate-limit headers telling the client its limit, remaining allowance, and reset time.

## Load shedding

Load shedding is what you do when you are already overloaded: deliberately drop the lowest-value work so that the rest succeeds. When CPU is pinned or the queue is full, rejecting new requests quickly with a 429 or 503 is better than accepting them, queueing them, blowing your latency objective, and eventually falling over while serving nothing. Prioritise: shed health-check traffic, retryable background work, and anonymous requests first; protect checkout flows, paying users, and requests already in flight. A fast 503 beats a slow timeout because it lets the caller fail over immediately instead of waiting.

## Backpressure

Backpressure is a slow consumer telling a fast producer to slow down, rather than letting an unbounded queue grow between them until the process runs out of memory. The mechanism is bounded queues everywhere: when a queue is full the producer blocks, or receives a 429, or has its send call return "not now". TCP does this natively through its receive window; HTTP/2 and gRPC have flow control; Reactive Streams expresses it as an explicit request for n more items; with Kafka, consumer lag is the signal that you must add consumers or slow the producers. The anti-pattern is an unbounded in-memory queue, where latency grows without limit as the backlog builds and then the process is OOM-killed and drops the entire backlog at once.

## Queue-based load levelling

Queue-based load levelling puts a durable queue — SQS, or a message broker — between a spiky producer and a consumer with fixed capacity. The queue absorbs the spike, the consumer processes at its own steady rate, and a backlog builds during the spike and drains afterwards. This trades latency during the spike for not falling over at all, which is usually the right trade for work that does not need an immediate response. The metrics to watch are queue depth, the number of messages waiting, and queue age, how long the oldest message has been waiting — age is the better alert signal because it directly reflects how far behind the consumer is.`,

    contentHi: `## Exactly-once ek fiction hai

Jab aap ek network par ek request bhejते ho aur koi response nahi milता, do possibilities hain jo aap apni side se distinguish nahi kar sakte: request kabhi nahi aayi, ya ye aayi aur fully process hui aur response wapas raste mein lost ho gaya. Agmar aap resend karते ho, aap pehle case mein correct ho aur doosre mein ek duplicate create karते ho. Ye fundamental hai. Aap at-most-once delivery (kabhi retry nahi, kabhi messages lose) aur at-least-once delivery (retry jab tak acknowledgement, kabhi do baar deliver) ke beech choose karते ho. Har real system at-least-once choose karता hai aur phir duplicates ko harmless banाता hai.

## Idempotency

Ek operation idempotent hai agmar ise do baar perform karने ka wahi effect hai jo ek baar. PUT se ek value set karना, DELETE se ek resource delete karना, aur koi bhi GET naturally idempotent hain. POST se ek card charge karना, ek counter increment karना, aur ek row append karना nahi hain. Ek non-idempotent write ko retry ke liye safe banाने ke liye, client har logical operation ke liye ek unique idempotency key generate karता hai, typically ek UUID. Pehli baar server us key ko dekhता hai ye request process karता hai, key se result ka mapping store karता hai, aur result return karता hai. Agmar same key phir aati hai server ise doosri baar process nahi karता; ye stored result return karता hai. Critical detail ye hai ki key aur result effect ke same transaction mein store hone chahिए.

## Rate limiting

Rate limiting cap karता hai ki ek client kitni tezi se aapko call kar sakता hai. Sabse common algorithm token bucket hai: ek bucket kuch capacity of tokens rakhता hai aur ek fixed rate per second par refills karता hai; har request ek token remove karता hai. Ye bursts permit karता hai bucket capacity tak aur phir refill rate par settle hota hai. Ek leaky bucket queued requests ko ek fixed rate par drain karता hai. Ek 429 return karो ek Retry-After header ke saath.

## Load shedding

Load shedding wo hai jo aap karते ho jab aap already overloaded ho: deliberately lowest-value work drop karो taaki baaki succeed ho. Jab CPU pinned hai ya queue full hai, naye requests ko jaldi ek 429 ya 503 se reject karना behtar hai. Prioritise karो: health-check traffic, retryable background work, aur anonymous requests pehle shed karो; checkout flows, paying users protect karो. Ek fast 503 ek slow timeout se behtar hai.

## Backpressure

Backpressure ek slow consumer hai ek fast producer ko slow down karने ko kehta hai. Mechanism bounded queues har jagah hai: jab ek queue full hai producer blocks karता hai. TCP ye natively karता hai apne receive window ke through. Anti-pattern ek unbounded in-memory queue hai, jahaan latency bina limit ke grow karती hai aur phir process OOM-killed hota hai.

## Queue-based load levelling

Queue-based load levelling ek durable queue ek spiky producer aur ek fixed capacity consumer ke beech rakhता hai. Queue spike absorb karती hai, consumer apne steady rate par process karता hai. Ye spike ke dauraan latency trade karता hai bilkul na girने ke liye. Watch karने wale metrics queue depth aur queue age hain — age behtar alert signal hai.`,

    examples: [
      {
        title: 'A token-bucket rate limiter: bursts up to capacity, then the refill rate, with idle capped',
        titleHi: 'Ek token-bucket rate limiter: capacity tak bursts, phir refill rate, idle capped ke saath',
        code: `# VERIFY
python - <<'PY'
class TokenBucket:
    def __init__(self, capacity, refill_per_sec):
        self.capacity = capacity
        self.refill = refill_per_sec
        self.tokens = capacity          # start full
        self.t = 0.0

    def advance(self, now):
        self.tokens = min(self.capacity, self.tokens + (now - self.t) * self.refill)
        self.t = now

    def take(self, now, n):
        self.advance(now)
        allowed = rejected = 0
        for _ in range(n):
            if self.tokens >= 1:
                self.tokens -= 1; allowed += 1
            else:
                rejected += 1
        return allowed, rejected

b = TokenBucket(capacity=10, refill_per_sec=5)

a, r = b.take(now=0, n=20)
print(f"t=0s  burst of 20     -> {a} allowed, {r} rejected   (bucket started with 10 tokens)")

a, r = b.take(now=1, n=8)
print(f"t=1s  8 requests      -> {a} allowed, {r} rejected   (+5 refilled in 1s)")

a, r = b.take(now=3, n=12)
print(f"t=3s  12 requests     -> {a} allowed, {r} rejected   (2s idle -> refill CAPPED at capacity 10)")
PY`,
        output: `t=0s  burst of 20     -> 10 allowed, 10 rejected   (bucket started with 10 tokens)
t=1s  8 requests      -> 5 allowed, 3 rejected   (+5 refilled in 1s)
t=3s  12 requests     -> 10 allowed, 2 rejected   (2s idle -> refill CAPPED at capacity 10)`,
        explain: 'The token bucket in three moves. It starts full with ten tokens and refills at five per second up to a maximum of ten. At t=0 a burst of twenty requests arrives: ten find a token and are allowed, the other ten find an empty bucket and are rejected — this is the burst allowance, equal to the capacity. At t=1, one second later, five tokens have refilled, so of eight requests five are allowed and three rejected — once the burst is spent, throughput is limited to the refill rate. At t=3, two seconds have passed with no traffic, but the refill is capped at the bucket capacity, so only ten tokens are available rather than the fifteen that two seconds of refilling would produce; twelve requests means ten allowed and two rejected. The cap on idle accumulation is what stops a client that has been quiet for an hour from being allowed an hour\'s worth of requests in one instant. In production this bucket state lives in Redis keyed by client or API key, the 429 response carries a Retry-After computed from when the next token will be available, and the same structure with a much larger capacity protects the whole service rather than one client.',
        explainHi: 'Token bucket teen moves mein. Ye dus tokens ke saath full start hota hai aur paanch per second par refills karता hai maximum dus tak. t=0 par bees requests ka ek burst aata hai: dus ko ek token milता hai aur allowed hain, doosre dus ko ek empty bucket milता hai aur rejected hain — ye burst allowance hai, capacity ke barabar. t=1 par, ek second baad, paanch tokens refilled hain, to aath requests mein se paanch allowed aur teen rejected — jab burst spent hai, throughput refill rate tak limited hai. t=3 par, do seconds bina traffic ke guzre hain, par refill bucket capacity par capped hai, to sirf dus tokens available hain; baarah requests ka matlab dus allowed aur do rejected. Idle accumulation par cap wo hai jo ek client ko jo ek ghante se quiet hai ek ghante ke worth ke requests ek instant mein allowed hone se rोkता hai. Production mein ye bucket state Redis mein rehता hai client ya API key se keyed.',
      },
    ],

    mistakes: [
      {
        wrong: `# a payment endpoint with no idempotency key - retries double-charge
  @app.post("/transfers")
  def transfer(body):
      account.debit(body.amount)          # <-- runs every time the request arrives
      return {"ok": True}
  # client sends the request. server debits $100, then the 200 response is lost
  # (LB timeout / client network blip). client's retry logic resends. server
  # debits ANOTHER $100. the customer is charged $200 for one transfer. this is
  # not a rare edge case - it happens every time there's a response-path failure.`,
        right: `# an idempotency key, stored in the SAME transaction as the effect:
  @app.post("/transfers")
  def transfer(body, idempotency_key: str = Header(...)):
      with db.transaction():
          existing = db.get("idem", idempotency_key)
          if existing:
              return existing.result          # <-- replay the stored result, do NOT re-debit
          account.debit(body.amount)
          result = {"ok": True, "id": new_id()}
          db.put("idem", idempotency_key,
                 result=result, expires_at=now() + 24h)   # same txn as the debit
          return result
  # client generates ONE key per logical transfer (a UUID). retries reuse it.
  # first request: debit + store. every retry: returns the stored result, no debit.
  # -> the client can retry as aggressively as it likes. exactly-once EFFECT.`,
        why: 'A non-idempotent write with no idempotency key double-applies its effect on every response-path failure, and response-path failures are not rare — a load balancer timeout, a client network blip, or a deploy that drops in-flight connections all cause the client to retry a request the server already processed. For a payment endpoint this means charging the customer twice for one transfer. The fix is an idempotency key generated once by the client per logical operation and reused across all retries of that operation. On the first request the server performs the effect and, in the same database transaction, records the key and the result with an expiry. On any subsequent request carrying the same key the server skips the effect entirely and returns the stored result. The same-transaction requirement is essential: if the debit commits but the process crashes before the dedup record is written, the next retry will debit again, so the two writes must succeed or fail together.',
        whyHi: 'Ek non-idempotent write bina ek idempotency key ke har response-path failure par apna effect double-apply karता hai, aur response-path failures rare nahi hain — ek load balancer timeout, ek client network blip, ya ek deploy jo in-flight connections drop karता hai sab client ko ek request retry karने ka cause karते hain jo server ne already process kiया. Ek payment endpoint ke liye iska matlab customer ko ek transfer ke liye do baar charge karना hai. Fix ek idempotency key hai jo client dwara ek baar per logical operation generate hoती hai aur us operation ke saare retries mein reused hoती hai. Pehli request par server effect perform karता hai aur, same database transaction mein, key aur result ko ek expiry ke saath record karता hai. Same-transaction requirement essential hai: agmar debit commit hota hai par process dedup record likhे jaने se pehle crash hota hai, agla retry phir debit karega.',
      },
      {
        wrong: `# an unbounded in-memory queue between a fast producer and a slow consumer
  work_queue = []                          # <-- no bound
  def ingest(event):
      work_queue.append(event)             # always accepts, instantly
  def worker():
      while True:
          process(work_queue.pop(0))       # 50/s, steady
  # ingest spikes to 5000/s during a flash sale. the worker does 50/s. the queue
  # grows by 4950/s. memory climbs. queue latency (time from append to pop) goes
  # from 20ms to 10s to 5 minutes. then the process hits the memory limit, the
  # OOM killer fires, and ALL 300,000 queued events are lost at once.`,
        right: `# a BOUNDED queue -> backpressure, or a durable queue -> load levelling
  work_queue = Queue(maxsize=1000)         # bounded
  def ingest(event):
      try:
          work_queue.put_nowait(event)
      except Full:
          metrics.incr("shed"); raise Http429("Retry-After: 5")   # shed / backpressure
  # OR, for work that must not be dropped: put the durable queue (SQS/Kafka) in
  # front. the producer writes to SQS (absorbs the spike, persists). the consumer
  # pulls at its steady 50/s. a backlog of 300k builds and drains over ~100 min.
  # alert on QUEUE AGE (oldest message > 5 min) and scale consumers.
  # -> nothing is lost; latency degrades gracefully during the spike, then recovers.`,
        why: 'An unbounded queue does not add capacity — it only defers the moment of failure and makes that failure catastrophic. While the producer outpaces the consumer, the queue grows, memory rises, and the time a item spends waiting in the queue increases without limit, so latency degrades continuously. When memory is exhausted the process is killed and the entire queue contents are lost in one event, which is far worse than having rejected the excess at the door. The correct approaches are a bounded queue, where a full queue causes the producer to block or receive a 429 — this is backpressure, and it propagates the capacity limit back to the caller who can then shed or slow down — or, for work that genuinely must not be dropped, a durable external queue such as SQS or Kafka placed in front, which persists the backlog to disk, lets the producer absorb the spike, and lets the consumer drain at its sustainable rate. With the durable queue the alert signal is queue age: when the oldest unprocessed message exceeds a threshold, add consumer capacity.',
        whyHi: 'Ek unbounded queue capacity add nahi karती — ye sirf failure ke moment ko defer karती hai aur us failure ko catastrophic banाती hai. Jabki producer consumer se aage nikalता hai, queue grow karती hai, memory rise karती hai, aur ek item queue mein wait karने mein jo time spend karता hai wo bina limit ke badhता hai. Jab memory exhausted hai process killed hota hai aur poori queue contents ek event mein lost ho jaती hain. Correct approaches ek bounded queue hain, jahaan ek full queue producer ko block karने ya ek 429 receive karने ka cause banाती hai — ye backpressure hai — ya, work ke liye jo genuinely drop nahi hona chahिए, ek durable external queue jaise SQS ya Kafka aage rakhी jaती hai. Durable queue ke saath alert signal queue age hai.',
      },
      {
        wrong: `# no load shedding: accept everything, then fall over serving nothing
  def handle(req):
      # CPU is already at 100%, p99 latency is already 8s and climbing
      result = do_expensive_work(req)      # every new request makes it worse
      return result
  # requests keep arriving at 2000/s. the server accepts all of them, each one
  # competing for CPU. every request now takes 30s and times out on the client.
  # effective goodput: ~0 req/s. the server is 100% busy producing 100% errors.
  # health checks also time out -> the LB pulls the instance -> the load shifts
  # to the remaining instances -> they fall over too. cascading.`,
        right: `# shed early, by priority, with a fast rejection:
  MAX_CONCURRENT = 200                     # sized from: capacity / per-request latency
  inflight = Semaphore(MAX_CONCURRENT)
  def handle(req):
      if not inflight.acquire(blocking=False):
          # already at capacity -> reject the LOW-value work fast
          if req.priority == "low":        # retryable jobs, prefetch, anon
              return Http503("Retry-After: 2")
          # for high-value work, wait very briefly, then still give up
          if not inflight.acquire(timeout=0.05):
              return Http503("Retry-After: 1")
      try:
          return do_expensive_work(req)
      finally:
          inflight.release()
  # -> the server serves 200 concurrent requests WELL (p99 stays ~normal) and
  # rejects the rest in <1ms. goodput stays high. a fast 503 lets the client
  # retry elsewhere / back off. health checks still pass -> no cascade.`,
        why: 'A server with no admission control accepts every request regardless of whether it has the capacity to serve it, and under sustained overload this drives goodput — the rate of successfully served requests — towards zero, because every request in the system is competing for a resource that is already saturated, so every request is slow and most time out before completing. The server ends up fully busy producing nothing but errors, and because its health checks also time out the load balancer removes it and shifts its traffic to the remaining instances, which then overload the same way. Load shedding fixes this by bounding concurrency to what the instance can actually serve well — derived from its capacity divided by per-request cost — and rejecting excess requests immediately with a 503 and a Retry-After. The requests that are admitted are served at normal latency; the requests that are rejected fail in under a millisecond and can retry elsewhere or back off. Shedding by priority means the low-value traffic — retryable background jobs, prefetches, anonymous requests — is dropped first, protecting checkout flows and paying users.',
        whyHi: 'Ek server bina admission control ke har request accept karता hai chahे uske paas ise serve karने ki capacity ho ya nahi, aur sustained overload ke tehat ye goodput ko zero ki taraf drive karता hai, kyunki system mein har request ek resource ke liye compete kar raha hai jo already saturated hai, to har request slow hai aur zyादातर complete hone se pehle time out hote hain. Server poori tarah busy khatam hota hai errors ke alawa kuch nahi produce karता, aur kyunki iske health checks bhi time out hote hain load balancer ise remove karता hai. Load shedding ise fix karता hai concurrency ko bound karके jo instance actually well serve kar sakता hai, aur excess requests ko turant ek 503 aur ek Retry-After ke saath reject karके. Priority se shedding ka matlab low-value traffic pehle drop hoता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Double-charged on every LB timeout** — a payments service had no idempotency key. The ALB\'s 30s idle timeout cut the response on slow requests; the mobile client retried; the second charge went through. ~0.3% of transfers were duplicated. Adding a client-generated `Idempotency-Key` stored in the same row-write as the ledger entry took it to zero.',
        hi: '**Har LB timeout par double-charged** — ek payments service ke paas koi idempotency key nahi tha. ALB ka 30s idle timeout slow requests par response kaat deta tha; mobile client retry karta tha; doosra charge through ho jaता tha. ~0.3% transfers duplicated the. Ek client-generated `Idempotency-Key` jo ledger entry ke same row-write mein store hua ise zero par le gaya.',
      },
      {
        en: '**The unbounded queue that lost 400k jobs** — an image-processing worker read from an in-memory list. A campaign pushed 20x normal volume; the list grew to ~6 GB, the pod hit its memory limit, and the OOM kill dropped every queued job with no trace. Moving the buffer to SQS (with a DLQ) meant the next spike just built a visible, drainable backlog.',
        hi: '**Unbounded queue jisne 400k jobs khो diye** — ek image-processing worker ek in-memory list se read karta tha. Ek campaign ne 20x normal volume push kiya; list ~6 GB tak badhi, pod apni memory limit par pahuncha, aur OOM kill ne har queued job bina trace ke drop kiya. Buffer ko SQS (ek DLQ ke saath) par move karne ka matlab agla spike bas ek visible, drainable backlog banaता tha.',
      },
      {
        en: '**Goodput to zero under a thundering login herd** — after an outage, every client reconnected at once. The auth service accepted all of it, ran every request to a 45s timeout, and served ~0 successful logins for 12 minutes. Adding a concurrency limiter (a semaphore sized to ~1.5x normal in-flight) + a fast 503 restored ~90% goodput immediately; the herd drained over 3 minutes.',
        hi: '**Ek thundering login herd ke tehat goodput zero par** — ek outage ke baad, har client ek saath reconnect hua. Auth service ne sab accept kiya, har request ko ek 45s timeout tak chalaya, aur 12 minute ke liye ~0 successful logins serve kiye. Ek concurrency limiter + ek fast 503 add karne se ~90% goodput turant restore hua.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is "exactly-once delivery" impossible, and how do real systems get exactly-once effects anyway?',
        qHi: '"Exactly-once delivery" impossible kyun hai, aur real systems phir bhi exactly-once effects kaise paते hain?',
        a: 'When a sender transmits a request and receives no response, it cannot tell whether the request never arrived or whether it arrived, was fully processed, and the response was lost on the way back. Those two cases require opposite actions — resend versus do not resend — and no protocol can distinguish them from the sender\'s side, because the only evidence either way is a message that did not come. So you must choose. At-most-once delivery never retries and therefore loses messages whenever a response is lost. At-least-once delivery retries until acknowledged and therefore delivers twice whenever a response is lost. Real systems universally choose at-least-once and then make duplicate delivery harmless at the receiver. That is done with idempotent processing — designing the operation so that applying it twice has the same effect as applying it once — or with explicit deduplication, where the receiver records an identifier for each operation it has processed and ignores repeats. "Exactly-once semantics" as marketed is always this combination: at-least-once delivery plus receiver-side dedup or idempotency. It is a property built at the application layer, not a guarantee the network provides.',
        aHi: 'Jab ek sender ek request transmit karता hai aur koi response nahi milता, ye nahi bata sakta ki request kabhi nahi aayi ya ye aayi, fully process hui, aur response wapas raste mein lost ho gaya. Wo do cases opposite actions require karते hain — resend versus resend mat karो — aur koi protocol unhe sender ki side se distinguish nahi kar sakта. To aapko choose karना hai. At-most-once delivery kabhi retry nahi karता aur isliye messages lose karता hai. At-least-once delivery retry karता hai jab tak acknowledged aur isliye do baar deliver karता hai. Real systems universally at-least-once choose karते hain aur phir duplicate delivery ko receiver par harmless banाते hain. Ye idempotent processing se hota hai ya explicit deduplication se. "Exactly-once semantics" hamesha ye combination hai: at-least-once delivery plus receiver-side dedup ya idempotency.',
      },
      {
        q: 'Walk through the token-bucket algorithm and why it is usually preferred over a fixed window or a leaky bucket.',
        qHi: 'Token-bucket algorithm ke through chalo aur kyun ye aksar ek fixed window ya ek leaky bucket se preferred hai.',
        a: 'A token bucket has a capacity and a refill rate. Conceptually the bucket holds up to capacity tokens and gains tokens at the refill rate per second, never exceeding capacity. Each incoming request must remove one token; if a token is available the request proceeds, and if not it is rejected with a 429 or queued. The behaviour this produces is a burst allowance equal to the capacity followed by a sustained rate equal to the refill rate: a client that has been idle can immediately send a burst up to the capacity, then is throttled to the refill rate, and the idle accumulation is capped at capacity so a long silence does not earn an unbounded burst. It is preferred over a fixed window counter — count requests per calendar minute, reset at the boundary — because the fixed window allows twice the intended rate across a boundary, since a client can send a full window\'s worth at 59 seconds and another full window\'s worth at 61 seconds. It is preferred over a pure leaky bucket, which drains at exactly a fixed rate and permits no burst at all, because real clients are legitimately bursty and a small controlled burst is usually fine. The token bucket also needs very little state — a token count and a last-update timestamp per key — which makes it cheap to store in Redis.',
        aHi: 'Ek token bucket ki ek capacity aur ek refill rate hoती hai. Bucket capacity tokens tak rakhता hai aur refill rate per second par tokens gain karता hai, kabhi capacity se zyada nahi. Har incoming request ko ek token remove karना hai; agmar ek token available hai request proceed karता hai, aur agmar nahi to ye ek 429 se rejected ya queued hota hai. Behaviour ye produce karता hai wo ek burst allowance capacity ke barabar hai jiske baad ek sustained rate refill rate ke barabar hai. Ye ek fixed window counter se preferred hai kyunki fixed window ek boundary ke across intended rate ka do guna allow karता hai. Ye ek pure leaky bucket se preferred hai jo bilkul burst permit nahi karता. Token bucket ko bahut kam state chahिए — ek token count aur ek last-update timestamp per key.',
      },
      {
        q: 'Distinguish rate limiting, load shedding, backpressure, and queue-based load levelling — when does each apply?',
        qHi: 'Rate limiting, load shedding, backpressure, aur queue-based load levelling distinguish karो — har ek kab apply hota hai?',
        a: 'Rate limiting is a policy limit applied per client or per key regardless of current system load: it caps how fast a given caller may call you, protects against one noisy client and provides fair sharing, and returns a 429 with Retry-After. Load shedding is a reaction to actual overload: when the system is genuinely at capacity — CPU pinned, concurrency limit reached, queue full — it deliberately rejects the lowest-value in-progress demand so the rest is served well, returning a fast 503 rather than accepting work it cannot complete. Backpressure is a signal that flows from a slow consumer back to a fast producer through bounded buffers: when the buffer between them is full the producer blocks or is told to slow down, so the capacity mismatch is communicated rather than absorbed into an ever-growing queue. Queue-based load levelling is an architectural choice: place a durable queue between a spiky producer and a fixed-capacity consumer so the queue absorbs bursts and the consumer works at a steady rate, trading latency during the spike for stability. Rate limiting and shedding both reject requests but for different reasons — policy versus health. Backpressure and load levelling both deal with producer-consumer mismatch — one by pushing back, the other by buffering durably.',
        aHi: 'Rate limiting ek policy limit hai jo per client ya per key apply hoती hai current system load se independent: ye cap karता hai ki ek caller kitni tezi se call kar sakта hai aur ek 429 return karता hai. Load shedding actual overload ki ek reaction hai: jab system genuinely capacity par hai ye deliberately lowest-value demand reject karता hai, ek fast 503 return karता hai. Backpressure ek signal hai jo ek slow consumer se wापas ek fast producer ko bounded buffers ke through flow karता hai: jab buffer full hai producer blocks karता hai. Queue-based load levelling ek architectural choice hai: ek spiky producer aur ek fixed-capacity consumer ke beech ek durable queue rakhो. Rate limiting aur shedding dोnों requests reject karते hain par alag reasons ke liye — policy versus health. Backpressure aur load levelling dोnों producer-consumer mismatch deal karते hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain why exactly-once delivery is impossible, the at-most-once vs at-least-once choice, what "idempotent" means, and how an idempotency key makes a non-idempotent write safe to retry.',
        taskHi: 'Ek comment mein, samjhao kyun exactly-once delivery impossible hai, at-most-once vs at-least-once choice, "idempotent" ka matlab, aur ek idempotency key kaise ek non-idempotent write ko retry ke liye safe banाती hai.',
        hint: 'EXACTLY-ONCE DELIVERY IS IMPOSSIBLE: when you send a request and get NO response, you cannot distinguish (a) the request never arrived [→ you SHOULD resend] from (b) it arrived, was fully processed, and the RESPONSE was lost on the way back [→ resending = a DUPLICATE]. The only evidence either way is "a message that didn\'t come" — no protocol removes this. So you CHOOSE: AT-MOST-ONCE (never retry → sometimes LOSE messages) or AT-LEAST-ONCE (retry until acked → sometimes DELIVER TWICE). Every real system picks AT-LEAST-ONCE and makes duplicates HARMLESS at the receiver. "Exactly-once semantics" = at-least-once delivery + idempotent processing / dedup — an APPLICATION-LAYER property, NOT a network feature. IDEMPOTENT = doing it twice has the SAME effect as doing it once. Naturally idempotent: `PUT /users/42 {…}` (set to a value), `DELETE /users/42` (gone is gone), any `GET`. NOT idempotent: `POST /transfers {amt:100}` (charges $100 EACH time), `counter += 1`, "append a row". IDEMPOTENCY KEY: the client generates ONE unique key (a UUID) per LOGICAL operation and reuses it across ALL retries of that operation. Server, FIRST time it sees the key: process the effect AND, IN THE SAME DB TRANSACTION, store (key → result) with an expiry (e.g. 24h); return the result. Server, SAME key again: do NOT re-process — return the STORED result. → the client can now retry as aggressively as it likes; exactly-once EFFECT. The SAME-TRANSACTION requirement is essential: if the effect (debit) commits but the process crashes BEFORE the dedup record is written, the next retry debits AGAIN — the two writes must succeed or fail together. This is how Stripe / PayPal / every payment API works.',
        hintHi: 'EXACTLY-ONCE DELIVERY IMPOSSIBLE HAI: jab aap ek request bhejते ho aur NO response milता, aap (a) request kabhi nahi aayi [→ RESEND karो] ko (b) ye aayi, process hui, aur RESPONSE lost ho gaya [→ resending = DUPLICATE] se distinguish nahi kar sakte. To aap CHOOSE karते ho: AT-MOST-ONCE (kabhi retry nahi → messages LOSE) ya AT-LEAST-ONCE (retry jab tak acked → DO BAAR DELIVER). Har real system AT-LEAST-ONCE pick karता hai aur duplicates ko receiver par HARMLESS banाता hai. IDEMPOTENT = do baar karने ka wahi effect jo ek baar. IDEMPOTENCY KEY: client per LOGICAL operation ek unique key (UUID) generate karता hai aur saare retries mein reuse karता hai. Server, PEHLI baar: effect process karो AUR SAME DB TRANSACTION mein (key → result) store karो; result return karो. Server, SAME key phir: re-process MAT karो — STORED result return karो. SAME-TRANSACTION requirement essential hai.',
      },
      {
        task: 'In a comment, describe the token-bucket rate limiter (capacity, refill rate, burst behaviour, idle cap) and contrast it with a leaky bucket and a fixed window.',
        taskHi: 'Ek comment mein, token-bucket rate limiter describe karो aur ise ek leaky bucket aur ek fixed window se contrast karो.',
        hint: 'TOKEN BUCKET — two parameters: CAPACITY (max tokens the bucket holds) and REFILL_RATE (tokens added per second, never exceeding capacity). Each request removes 1 token; if a token is available → proceed; if not → reject with `429` (or queue). BEHAVIOUR: a BURST ALLOWANCE equal to the capacity, followed by a SUSTAINED rate equal to the refill rate. A client idle for a while can immediately send a burst up to `capacity`, then is throttled to `refill_rate`. IDLE CAP: accumulated tokens are capped at `capacity`, so a long silence does NOT earn an unbounded burst (2s idle at refill 5/s → 10 tokens, not 15, if capacity is 10). STATE: just a token count + a last-update timestamp per key → cheap in Redis, keyed by client / API key. Response: `429` + `Retry-After` (computed from when the next token frees) + `X-RateLimit-Limit/Remaining/Reset`. vs FIXED WINDOW (count requests per calendar minute, reset at the boundary): simpler, but allows ~2x the intended rate across a boundary — a client sends a full window at :59 and another full window at :61. vs LEAKY BUCKET (requests drain from a queue at exactly a FIXED rate): smooths output completely, permits NO burst at all — too strict for real clients, which are legitimately bursty. vs SLIDING WINDOW (count over the trailing 60s, continuously): accurate, no boundary artefact, but more state (a log or ring buffer of timestamps). Token bucket is the usual default: cheap state + a controlled burst.',
        hintHi: 'TOKEN BUCKET — do parameters: CAPACITY (max tokens) aur REFILL_RATE (tokens per second, kabhi capacity se zyada nahi). Har request 1 token remove karता hai; token available → proceed; nahi → `429` (ya queue). BEHAVIOUR: ek BURST ALLOWANCE capacity ke barabar, phir ek SUSTAINED rate refill rate ke barabar. IDLE CAP: accumulated tokens `capacity` par capped — ek lambi silence unbounded burst nahi earn karती. STATE: bas ek token count + ek last-update timestamp per key → Redis mein cheap. vs FIXED WINDOW: simpler, par ek boundary ke across ~2x rate allow karता hai. vs LEAKY BUCKET: output poori tarah smooth karता hai, KOI burst nahi — real clients ke liye too strict. vs SLIDING WINDOW: accurate, par zyada state.',
      },
      {
        task: 'In a comment, distinguish rate limiting, load shedding, backpressure, and queue-based load levelling, and explain the unbounded-queue anti-pattern.',
        taskHi: 'Ek comment mein, rate limiting, load shedding, backpressure, aur queue-based load levelling distinguish karो, aur unbounded-queue anti-pattern samjhao.',
        hint: 'RATE LIMITING — a POLICY limit per client / per key, applied REGARDLESS of current system load. Caps how fast a given caller may call you; protects against one noisy client; provides fair sharing. Returns `429` + `Retry-After`. LOAD SHEDDING — a REACTION to ACTUAL overload. When the system is genuinely at capacity (CPU pinned / concurrency limit hit / queue full), deliberately REJECT the lowest-value work so the rest is served WELL — a FAST `503` beats a slow timeout (it lets the caller fail over NOW). Bound concurrency to what the instance serves well (capacity ÷ per-request cost, e.g. a semaphore of 200); reject the excess in <1ms. Shed BY PRIORITY: drop health-check-y / retryable / prefetch / anonymous traffic FIRST; protect checkout / paying users / already-in-flight requests. Without it, sustained overload drives GOODPUT → ~0 (every request competes for a saturated resource → all slow → all time out; the server is 100% busy producing 100% errors; health checks time out → the LB pulls the instance → load shifts → the rest fall over → CASCADE). BACKPRESSURE — a SIGNAL from a slow CONSUMER back to a fast PRODUCER through BOUNDED buffers: buffer full → the producer BLOCKS / gets a `429` / `request(n)` stalls. The capacity mismatch is COMMUNICATED, not absorbed. Native examples: TCP receive window, HTTP/2 + gRPC flow control, Reactive Streams `request(n)`, Kafka consumer lag. QUEUE-BASED LOAD LEVELLING — an ARCHITECTURAL choice: put a DURABLE queue (SQS / Kafka / a broker) between a spiky producer and a fixed-capacity consumer. The queue absorbs the spike (persisted to disk), the consumer drains at its steady rate, a backlog builds and drains. Trades LATENCY during the spike for STABILITY. Alert on QUEUE AGE (oldest message > threshold) rather than depth — age directly reflects how far behind the consumer is. THE UNBOUNDED-QUEUE ANTI-PATTERN: an in-memory list/queue with NO bound between a fast producer and slow consumer. It does NOT add capacity — it only DEFERS failure and makes it CATASTROPHIC: while the producer outpaces the consumer the queue grows, memory climbs, queue latency (append→pop time) grows WITHOUT BOUND, then the process hits the memory limit, the OOM killer fires, and the ENTIRE backlog (e.g. 300k events) is lost AT ONCE — far worse than rejecting the excess at the door. Fix: a BOUNDED queue (→ backpressure / shed) or a DURABLE external queue (→ load levelling, nothing lost).',
        hintHi: 'RATE LIMITING — ek POLICY limit per client / per key, current load se INDEPENDENT. `429` + `Retry-After`. LOAD SHEDDING — ACTUAL overload ki ek REACTION. Jab system genuinely capacity par hai, deliberately lowest-value work REJECT karो — ek FAST `503` ek slow timeout se behtar hai. Concurrency ko bound karो (capacity ÷ per-request cost). Shed BY PRIORITY: health-check / retryable / anonymous pehle; checkout / paying users protect karो. Iske bina, sustained overload GOODPUT → ~0 drive karता hai → CASCADE. BACKPRESSURE — ek slow CONSUMER se wापas ek fast PRODUCER ko BOUNDED buffers ke through ek SIGNAL: buffer full → producer BLOCKS. Native: TCP receive window, HTTP/2 flow control, Kafka lag. QUEUE-BASED LOAD LEVELLING — ek DURABLE queue (SQS / Kafka) ek spiky producer aur ek fixed-capacity consumer ke beech. Queue spike absorb karती hai, consumer steady rate par drain karता hai. QUEUE AGE par alert karो. UNBOUNDED-QUEUE ANTI-PATTERN: NO bound wali in-memory queue — capacity add NAHI karती, sirf failure DEFER karती hai aur CATASTROPHIC banाती hai: queue grows → memory climbs → OOM kill → POORA backlog ek saath lost. Fix: ek BOUNDED queue ya ek DURABLE external queue.',
      },
    ],

    keyTakeaways: [
      '"EXACTLY-ONCE DELIVERY" IS IMPOSSIBLE: when a response is lost you can\'t tell "never arrived" from "processed, response lost". You choose AT-MOST-ONCE (may lose) or AT-LEAST-ONCE (may duplicate). Everyone picks at-least-once + makes duplicates harmless → "exactly-once" is at-least-once delivery + idempotent processing / dedup at the RECEIVER, an app-layer property, not a network feature.',
      'IDEMPOTENT = doing it twice = doing it once (PUT/DELETE/GET yes; POST-charge / counter++ / append no). An IDEMPOTENCY KEY (client-generated UUID per logical op, reused across retries) makes a non-idempotent write safe: first time → do it + store (key→result) IN THE SAME TRANSACTION as the effect; same key again → return the stored result, don\'t re-run. This is how every payment API works.',
      'TOKEN BUCKET rate limiter: `capacity` tokens, refills at `refill_rate`/s (capped at capacity), 1 token/request, no token → `429`+`Retry-After`. Allows a BURST up to capacity, then settles to the refill rate; idle accumulation is capped so a long silence earns no unbounded burst. Cheap state (count + timestamp per key). Beats fixed-window (2x across a boundary) and leaky-bucket (no burst at all).',
      'LOAD SHEDDING (react to real overload — bound concurrency to capacity÷cost, reject excess in <1ms with a fast `503`, shed low-value/anonymous/retryable first) prevents goodput collapsing to ~0 under sustained overload. RATE LIMITING is a per-client policy regardless of load; the two reject for different reasons — health vs policy. A fast 503 beats a slow timeout.',
      'BACKPRESSURE = bounded buffers propagate a slow consumer\'s limit back to the producer (block / `429`), vs the UNBOUNDED-QUEUE ANTI-PATTERN where latency grows without limit then the process OOMs and drops the whole backlog. QUEUE-BASED LOAD LEVELLING puts a DURABLE queue between a spiky producer and a steady consumer — absorbs the spike, trades latency for not falling over; alert on queue AGE, not depth.',
    ],
    keyTakeawaysHi: [
      '"EXACTLY-ONCE DELIVERY" IMPOSSIBLE HAI: jab ek response lost hai aap "kabhi nahi aaya" ko "processed, response lost" se nahi bata sakte. Aap AT-MOST-ONCE (lose kar sakta) ya AT-LEAST-ONCE (duplicate kar sakta) choose karते ho. Har koi at-least-once + duplicates ko harmless banाता hai → "exactly-once" at-least-once delivery + RECEIVER par idempotent processing / dedup hai, ek app-layer property, ek network feature nahi.',
      'IDEMPOTENT = do baar karना = ek baar karना (PUT/DELETE/GET haan; POST-charge / counter++ / append nahi). Ek IDEMPOTENCY KEY (per logical op client-generated UUID, retries mein reused) ek non-idempotent write ko safe banाती hai: pehli baar → karो + (key→result) EFFECT KE SAME TRANSACTION mein store karो; same key phir → stored result return karो, re-run mat karो. Har payment API aise kaam karता hai.',
      'TOKEN BUCKET rate limiter: `capacity` tokens, `refill_rate`/s par refills (capacity par capped), 1 token/request, koi token nahi → `429`+`Retry-After`. Ek BURST allow karता hai capacity tak, phir refill rate par settle; idle accumulation capped hai. Cheap state. Fixed-window (ek boundary ke across 2x) aur leaky-bucket (koi burst nahi) se behtar.',
      'LOAD SHEDDING (real overload par react karो — concurrency ko capacity÷cost par bound karो, excess ko <1ms mein ek fast `503` se reject karो, low-value/anonymous/retryable pehle shed karो) goodput ko sustained overload ke tehat ~0 par collapse hone se rोkता hai. RATE LIMITING load se independent ek per-client policy hai; dोnों alag reasons ke liye reject karते hain — health vs policy.',
      'BACKPRESSURE = bounded buffers ek slow consumer ki limit ko wापas producer ko propagate karते hain (block / `429`), vs UNBOUNDED-QUEUE ANTI-PATTERN jahaan latency bina limit ke grow karती hai phir process OOMs karता hai. QUEUE-BASED LOAD LEVELLING ek spiky producer aur ek steady consumer ke beech ek DURABLE queue rakhता hai — spike absorb karता hai; queue AGE par alert karो, depth par nahi.',
    ],
  },
];
