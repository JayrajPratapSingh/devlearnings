/**
 * DevOps Complete Course — Module 11: Deployment Strategies & Progressive
 * Delivery, lessons 4-6.
 *
 * Lesson 4: Expand/contract — the parallel-change pattern for code, config and
 *           API contracts; add-new-alongside-old, migrate readers, migrate
 *           writers, remove old. PROSE (a worked rename, step by step).
 * Lesson 5: Database migrations in the pipeline — backward-compatible schema
 *           change, migrate-then-deploy ordering, NOT VALID -> VALIDATE, online
 *           index, batched backfill. VERIFIED against real PostgreSQL 16.
 * Lesson 6: Health gates, automated rollback & release safety — smoke gates vs
 *           `rollout status`, automated rollback, rollback vs roll-forward,
 *           forward-only for data, freezes, DORA. VERIFIED against a real
 *           cluster (kind).
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_11_PART2: CourseLesson[] = [
  {
    slug: 'ops-expand-contract-the-parallel-change-pattern',
    title: 'Expand / Contract — the Parallel-Change Pattern',
    titleHi: 'Expand / Contract — Parallel-Change Pattern',
    description: 'You cannot safely rename a field, a column, a queue message, or an API path in one step while old and new code run side by side. Expand/contract splits the change into a sequence where every intermediate state is backward-compatible: add the new thing, make everything write both, migrate readers, migrate writers, then remove the old thing.',
    descriptionHi: 'Aap ek field, ek column, ek queue message, ya ek API path ko ek step mein safely rename nahi kar sakte jabki old aur new code saath chalते hain. Expand/contract change ko ek sequence mein split karता hai jahaan har intermediate state backward-compatible hai: naya cheez add karo, sab kuch dono likhwाओ, readers migrate karo, writers migrate karo, phir old cheez remove karo.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Moving a bus stop across the street without stranding a single passenger.** You cannot pick up the sign, walk it over, and plant it — for the minutes you are carrying it, some passengers wait where it used to be and the bus does not know where to stop. So you do it in phases. First you *add* a second sign on the far side and announce "both stops are active" — the bus now pulls in at either (expand). Then you update the timetables and the app to point at the new stop, while both signs stay up (migrate readers). Then you tell the drivers the primary stop is now the new one (migrate writers). Only once nobody is using the old sign — you have checked for a week — do you finally *remove* it (contract). At no single moment was there a stop that some part of the system did not know about.',
      hi: '**Ek bus stop ko sadak ke paar move karna bina ek bhi passenger ko strand kiye.** Aap sign utha kar, ise paar le jaकर, aur plant nahi kar sakte — jitne minutes aap ise carry kar rahe ho, kuch passengers wahaan wait karते hain jahaan ye pehle tha. To aap ise phases mein karते ho. Pehle aap far side par ek doosra sign *add* karते ho aur announce karते ho "dono stops active hain" (expand). Phir aap timetables aur app ko naye stop par point karने ke liye update karते ho, jabki dono signs up rehते hain (readers migrate). Phir aap drivers ko bataते ho ki primary stop ab naya hai (writers migrate). Sirf ek baar koi old sign use nahi kar raha — aapne ek hafte check kiya — aap finally ise *remove* karते ho (contract).',
    },

    simple: `**YOU CANNOT rename X in one step while old + new code run together** (rolling update,
blue-green DB, multiple consumers). Every "one-step" rename breaks the mixed-version window.

**EXPAND / CONTRACT (a.k.a. parallel change):** turn the rename into 3-5 backward-compatible releases.
\`\`\`
GOAL: rename  full_name  ->  first_name + last_name   (column / field / message key / API param)

R1  EXPAND         add first_name, last_name (nullable, no default).       old code: unaffected.
    (deploy)       new code WRITES all three (full_name + the split) and can READ either.
                   -> old + new coexist. every row/message has both forms.

R2  BACKFILL       a batched job fills first_name/last_name for old rows.  no deploy - a Job.
    (job)          run to completion; verify 0 rows missing the new columns.

R3  MIGRATE READERS  new code now READS first_name/last_name; still writes both.
    (deploy)         -> anything still reading full_name (old pods mid-roll) still works.

R4  MIGRATE WRITERS  new code STOPS writing full_name; add the NOT NULL on first_name
    (deploy)         (as NOT VALID then VALIDATE - Lesson 5).  full_name now stale but harmless.

R5  CONTRACT       once NOTHING reads full_name (check logs / a "column unused" period) ->
    (deploy/migr)  DROP COLUMN full_name. delete the dead read/write code. delete old tests.
\`\`\`
**KEY RULE: each release is compatible with the one immediately before it.** You can stop,
pause, or roll back one release at any point without breakage. Never skip R1 straight to R5.

**APPLIES TO:**
\`\`\`
DB COLUMN / TABLE   the classic case (Lesson 5 has the SQL)
JSON / API FIELD    add the new field, emit both, migrate clients, stop emitting old, (major-version / sunset the old)
QUEUE / EVENT MSG   producers emit v1+v2 (or a versioned envelope); consumers handle both;
                    migrate consumers; producers stop emitting v1; remove v1 handling
CONFIG KEY          read NEW ?? OLD; ship; set NEW everywhere; stop reading OLD; remove OLD
RPC / gRPC METHOD   add the new method; migrate callers; deprecate then remove the old (reserve the field number)
\`\`\`

**THE ANTI-PATTERN:** "big bang" - change producer and all consumers in one PR, deploy
"atomically". there is no atomic deploy across a fleet; something is always mid-roll, and
a consumer that restarts at the wrong second gets a message it can't parse.`,

    simpleHi: `**AAP X ko ek step mein rename NAHI kar sakte jabki old + new code saath chalते hain**
(rolling update, blue-green DB, multiple consumers). Har "one-step" rename mixed-version window todता hai.

**EXPAND / CONTRACT (parallel change):** rename ko 3-5 backward-compatible releases mein badlo.
\`\`\`
GOAL: rename  full_name  ->  first_name + last_name

R1  EXPAND         first_name, last_name add karo (nullable).       old code: unaffected.
    (deploy)       new code SAB TEEN WRITES karता hai aur EITHER READ kar sakta hai.
                   -> old + new coexist.

R2  BACKFILL       ek batched job old rows ke liye first_name/last_name bharता hai.  no deploy - ek Job.

R3  MIGRATE READERS  new code ab first_name/last_name READS karता hai; abhi bhi dono likhता hai.
    (deploy)         -> jo abhi bhi full_name read kar raha hai abhi bhi kaam karता hai.

R4  MIGRATE WRITERS  new code full_name likhना BAND karता hai; first_name par NOT NULL add karo.
    (deploy)

R5  CONTRACT       ek baar KUCH BHI full_name read nahi karता -> DROP COLUMN full_name.
    (deploy/migr)  dead code delete karo. old tests delete karo.
\`\`\`
**KEY RULE: har release us se compatible hai jo iske turant pehle hai.** Aap kisi bhi point par
stop, pause, ya ek release roll back kar sakte ho bina breakage ke. R1 se seedhे R5 kabhi skip mat karo.

**APPLIES TO:** DB column/table (classic), JSON/API field, queue/event message, config key, RPC/gRPC method.

**ANTI-PATTERN:** "big bang" - producer aur saare consumers ko ek PR mein change, "atomically"
deploy. Ek fleet ke across koi atomic deploy nahi hai; kuch hamesha mid-roll hai.`,

    content: `## Why one-step renames break

Every deployment strategy that avoids downtime — rolling update, blue-green sharing a database, a fleet of independently-restarting queue consumers — has a window in which the old version and the new version are both live. A change that renames or restructures something shared, done in a single step, is inconsistent during that window:

- A **rolling update** that renames a JSON response field means, for the minutes of the roll, some Pods return the old name and some the new; a client making several requests gets both.
- A **schema change** that renames a column breaks the old code the instant it is applied, because the old code, still running, queries the old name.
- A **queue producer** that changes a message format emits messages that the old consumers — some of which have not restarted yet — cannot parse, and they either crash or dead-letter.

The fix is never "deploy everything at once" — there is no atomic deploy across a fleet, and there is no atomic "restart every consumer simultaneously." The fix is to make the change in a sequence of steps where **no step is incompatible with the step before it**.

## The pattern

**Expand/contract**, also called **parallel change**, has three phases — expand, migrate, contract — usually realised as four or five releases. Take the concrete goal of replacing a \`full_name\` field with separate \`first_name\` and \`last_name\`:

### R1 — Expand: add the new alongside the old

Add \`first_name\` and \`last_name\` as **nullable columns with no default** (so the schema change is instant and does not rewrite the table — Lesson 5). Deploy code that **writes all three** — it populates \`full_name\` as before *and* the split — and can **read either** form. After this release, old code (mid-roll, or on the blue side) is completely unaffected because \`full_name\` still exists and is still written; new code has what it needs. Both versions coexist safely, and every new row has both forms.

### R2 — Backfill the old rows

The rows written before R1 have \`first_name\` and \`last_name\` null. A **batched backfill job** — not a deployment, a Job — walks the table in chunks (\`WHERE first_name IS NULL LIMIT 10000\`, commit, repeat) filling them in from \`full_name\`. Batching keeps each transaction short so it does not lock the table or bloat the WAL. Run it to completion and verify zero rows are still missing the new columns.

### R3 — Migrate readers

Deploy code that **reads \`first_name\`/\`last_name\`** everywhere it used to read \`full_name\`, while **still writing all three**. Now the new behaviour is fully in effect for reads, but anything still reading \`full_name\` — old Pods finishing their roll, a reporting query, another service — is unaffected because \`full_name\` is still being maintained.

### R4 — Migrate writers

Deploy code that **stops writing \`full_name\`**. It is now stale but harmless — nothing reads it. This is also the point to add the \`NOT NULL\` constraint on \`first_name\`, applied as \`NOT VALID\` then \`VALIDATE\` so it does not take a long lock (Lesson 5).

### R5 — Contract: remove the old

Only when you are confident **nothing reads \`full_name\`** — you have grepped the codebase, checked query logs, and let a "this column is unused" period elapse — run the migration to \`DROP COLUMN full_name\`, and in the same or an adjacent release delete the now-dead code that referenced it and the tests for the old behaviour.

## The invariant

The property that makes this safe is simple and absolute: **each release is backward-compatible with the release immediately before it.** That means at every point in the sequence, a fleet running a mix of release N and release N−1 is consistent, so a rolling update between any two consecutive releases is safe, and you can **pause the sequence anywhere** — hold at R1 for a week, or indefinitely — or **roll back one release** without anything breaking. What you cannot do is jump from R1 to R5, because a fleet running a mix of "writes both, reads old" and "column dropped" is broken.

## It is not just databases

The same pattern applies to every kind of shared contract:

- **API / JSON fields.** Add the new field to responses while keeping the old; migrate clients to read the new; stop populating the old (or, for a public API, deprecate it with a sunset date and remove it in a major version).
- **Queue and event messages.** Producers emit both the old and new shape, or a versioned envelope carrying both; consumers are updated to handle both; consumers migrate to the new; producers stop emitting the old; the old handling is removed. Each step is independently deployable.
- **Configuration keys.** Renaming \`OLD_KEY\` to \`NEW_KEY\`: ship code that reads \`NEW_KEY\` falling back to \`OLD_KEY\`; set \`NEW_KEY\` in every environment; ship code that reads only \`NEW_KEY\`; remove \`OLD_KEY\`.
- **RPC / gRPC methods and fields.** Add the new method or field; migrate callers; deprecate and then remove the old, reserving the field number so it is never reused.

## The anti-pattern

The tempting shortcut is the "big bang": change the producer and every consumer in one pull request and deploy it "atomically." There is no atomic deploy across more than one process. Something is always mid-roll, a consumer always restarts at an inconvenient moment, and the coordination required to truly deploy everything simultaneously — freeze all services, deploy in lockstep, unfreeze — is exactly the kind of high-risk manual operation that continuous delivery exists to eliminate. Expand/contract trades one risky step for several boring ones, and boring is the goal.`,

    contentHi: `## One-step renames kyun tootते hain

Har deployment strategy jo downtime avoid karती hai — rolling update, ek database share karता blue-green, independently-restarting queue consumers ka ek fleet — ek window hai jismें old version aur new version dono live hain. Ek change jo kuch shared rename ya restructure karता hai, ek single step mein, us window ke dauraan inconsistent hai:
- Ek **rolling update** jo ek JSON response field rename karता hai matlab, roll ke minutes ke liye, kuch Pods old name return karते hain kuch new.
- Ek **schema change** jo ek column rename karता hai old code ko jis instant apply hota hai break karता hai.
- Ek **queue producer** jo ek message format badalता hai messages emit karता hai jo old consumers parse nahi kar sakte.

Fix kabhi "sab kuch ek saath deploy karo" nahi hai. Fix change ko steps ke ek sequence mein banaना hai jahaan **koi step iske pehle wale step ke saath incompatible nahi hai**.

## Pattern

**Expand/contract**, jise **parallel change** bhi kehte hain, ke teen phases hain — expand, migrate, contract. \`full_name\` field ko separate \`first_name\` aur \`last_name\` se replace karne ka concrete goal lo:

### R1 — Expand: naye ko old ke bagal add karo

\`first_name\` aur \`last_name\` ko **nullable columns bina default ke** add karo. Code deploy karo jo **saare teen writes** karता hai aur **either** form **read** kar sakta hai. Is release ke baad, old code completely unaffected hai.

### R2 — Old rows backfill karo

Ek **batched backfill job** — ek deployment nahi, ek Job — table ko chunks mein walk karता hai unhe \`full_name\` se bharता hai.

### R3 — Readers migrate karo

Code deploy karo jo **\`first_name\`/\`last_name\` read karता hai**, jabki **abhi bhi saare teen likhता hai**.

### R4 — Writers migrate karo

Code deploy karo jo **\`full_name\` likhना band karता hai**. Ye ab stale hai par harmless.

### R5 — Contract: old remove karo

Sirf jab aap confident ho ki **kuch bhi \`full_name\` read nahi karता** — \`DROP COLUMN full_name\` migration chalाओ, aur dead code delete karo.

## Invariant

Wo property jo ise safe banati hai simple aur absolute hai: **har release iske turant pehle wale release ke saath backward-compatible hai.** Iska matlab sequence mein har point par, release N aur N-1 ka ek mix chalाता fleet consistent hai. Aap **sequence ko kahin bhi pause kar sakte ho** ya **ek release roll back kar sakte ho** bina kuch tootे. Jo aap nahi kar sakte wo R1 se R5 tak jump karna hai.

## Ye sirf databases nahi hai

Same pattern har kind ke shared contract par apply hota hai: API/JSON fields, queue aur event messages, configuration keys, RPC/gRPC methods.

## Anti-pattern

Tempting shortcut "big bang" hai: producer aur har consumer ko ek pull request mein change karo aur ise "atomically" deploy karo. Ek se zyada process ke across koi atomic deploy nahi hai. Expand/contract ek risky step ko kई boring ke liye trade karता hai, aur boring goal hai.`,

    examples: [
      {
        title: 'Why a mid-roll fleet with a renamed field fails — traced request by request (a model)',
        titleHi: 'Ek renamed field ke saath ek mid-roll fleet kyun fail hota hai — request by request traced',
        code: `# VERIFY
exec 2>&1
# a model of ONE client's 4-request flow hitting a fleet that is 50% rolled to v2,
# where v2 renamed the response field  userName -> user_name  in a single step (BAD).
respond() {  # $1 = pod version ; emits the JSON that pod would return
  if [ "$1" = v2 ]; then echo '{"user_name":"ada"}'; else echo '{"userName":"ada"}'; fi
}
client_parse() {  # the client expects ONE field name; here it was updated to expect user_name
  echo "$1" | grep -oE '"user_name":"[^"]*"' | cut -d'"' -f4
}

echo "--- BIG-BANG rename: client updated to read user_name, fleet is a v1/v2 mix ---"
i=0; ok=0
for pod in v1 v2 v1 v2; do          # load balancer sends the 4 requests round-robin
  i=$((i+1)); body=$(respond "$pod"); name=$(client_parse "$body")
  if [ -n "$name" ]; then echo "  req $i -> $pod pod -> $body -> parsed '$name'  OK"; ok=$((ok+1))
  else                   echo "  req $i -> $pod pod -> $body -> parsed ''       BROKEN"; fi
done
echo "  $ok / 4 requests parsed. the client breaks on every v1 pod - intermittently, irreproducibly."

echo
echo "--- EXPAND step instead: v2 emits BOTH fields; client reads user_name; v1 still emits userName ---"
respond2() { if [ "$1" = v2 ]; then echo '{"userName":"ada","user_name":"ada"}'; else echo '{"userName":"ada"}'; fi; }
ok=0; i=0
for pod in v1 v2 v1 v2; do
  i=$((i+1)); body=$(respond2 "$pod"); name=$(client_parse "$body")
  [ -n "$name" ] && { echo "  req $i -> $pod pod -> parsed '$name'  OK"; ok=$((ok+1)); } || echo "  req $i -> $pod pod -> parsed ''  BROKEN"
done
echo "  $ok / 4 - still not enough: v1 pods don't emit user_name yet."
echo "  the client must read  user_name ?? userName  until R3/R4 retire the old field."`,
        output: `--- BIG-BANG rename: client updated to read user_name, fleet is a v1/v2 mix ---
  req 1 -> v1 pod -> {"userName":"ada"} -> parsed ''       BROKEN
  req 2 -> v2 pod -> {"user_name":"ada"} -> parsed 'ada'  OK
  req 3 -> v1 pod -> {"userName":"ada"} -> parsed ''       BROKEN
  req 4 -> v2 pod -> {"user_name":"ada"} -> parsed 'ada'  OK
  2 / 4 requests parsed. the client breaks on every v1 pod - intermittently, irreproducibly.

--- EXPAND step instead: v2 emits BOTH fields; client reads user_name; v1 still emits userName ---
  req 1 -> v1 pod -> parsed ''  BROKEN
  req 2 -> v2 pod -> parsed 'ada'  OK
  req 3 -> v1 pod -> parsed ''  BROKEN
  req 4 -> v2 pod -> parsed 'ada'  OK
  2 / 4 - still not enough: v1 pods don't emit user_name yet.
  the client must read  user_name ?? userName  until R3/R4 retire the old field.`,
        explain: 'This is a small model of a single client making four requests to a service whose fleet is half rolled to a version that renamed a response field in one step. The load balancer distributes the requests across old and new Pods, so two of the four hit a v1 Pod returning the old field name and two hit a v2 Pod returning the new one. The client was updated in the same release to expect the new name, so it parses successfully only on the v2 responses and comes up empty on the v1 responses — two of four requests fail, and which two depends entirely on load-balancer routing, so the failure is intermittent and cannot be reproduced on demand. The second block shows that even doing the expand step in isolation is not sufficient: having v2 emit both field names helps requests that hit v2, but requests that hit a v1 Pod still get only the old name, and the client reading only the new name still fails on them. The resolution, which the output spells out, is that during the transition the client must read the new field with a fallback to the old — user_name if present, otherwise userName — and the old field is only removed once every Pod emits the new one and every reader has the fallback. That is precisely the expand/migrate/contract sequence: you cannot make the reader depend on the new field until every writer produces it.',
        explainHi: 'Ye ek single client ka ek chhota model hai jo ek service ko chaar requests karता hai jiska fleet aadha ek version par rolled hai jisne ek response field ek step mein rename kiya. Load balancer requests ko old aur new Pods ke across distribute karता hai, to chaar mein se do ek v1 Pod hit karती hain jo old field name return karता hai aur do ek v2 Pod. Client ko same release mein naye name ki expect karने ke liye update kiya gaya, to ye sirf v2 responses par successfully parse karता hai aur v1 responses par empty aata hai. Doosra block dikhाता hai ki expand step ko isolation mein karna bhi sufficient nahi hai. Resolution ye hai ki transition ke dauraan client ko naye field ko old ke fallback ke saath read karना chahiye, aur old field sirf tab remove hota hai jab har Pod naya emit karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# the "big bang" contract change: producer + all consumers in one PR
# PR #4412: "rename OrderPlaced.total -> OrderPlaced.total_cents"
#   - order-service: emit total_cents instead of total
#   - billing-service: read total_cents
#   - analytics-service: read total_cents
#   - email-service: read total_cents
# deploy "all at once". but: order-service rolls first, emits total_cents; billing-service
# hasn't rolled yet, reads .total -> undefined -> charges $0 or NaN. or email-service
# consumer restarts mid-deploy and picks up a total_cents message with old code.`,
        right: `# expand/contract, each service deployed independently:
# 1. order-service: emit BOTH  total  AND  total_cents  (expand)
# 2. billing / analytics / email: read  total_cents ?? (total * 100)   (readers, any order)
# 3. order-service: stop emitting  total   (writer)  -- only after step 2 is everywhere
# 4. all consumers: remove the  ?? total*100  fallback   (contract)
# 5. (optional) a schema-registry / envelope version bump documents the retirement
# at every step, a consumer on the previous release still works. no lockstep deploy.`,
        why: 'A single pull request that changes a message producer and all of its consumers still has to be deployed, and deployment across multiple independently-running services is never atomic. Whichever service rolls first creates an inconsistency: if the producer rolls first it emits the new format to consumers that still expect the old one; if a consumer rolls first it expects a format the producer is not yet sending. Queue consumers make this worse because they also restart independently to pick up new code, so even within one service there is a moment where a new-code consumer pulls an old-format message or vice versa. Coordinating a truly simultaneous deploy — freezing every service, deploying them in lockstep, unfreezing — is a heavyweight manual operation and exactly the kind of risky release that continuous delivery is meant to remove. Expand/contract replaces it with a sequence of independently deployable steps, each backward-compatible with the last: the producer first emits both the old and new shape, then consumers are updated one at a time in any order to read the new shape with a fallback to the old, then the producer stops emitting the old shape once every consumer handles the new one, then the fallbacks are removed. No step requires any other service to deploy at the same time.',
        whyHi: 'Ek single pull request jo ek message producer aur iske saare consumers change karता hai abhi bhi deploy hona chahiye, aur multiple independently-running services ke across deployment kabhi atomic nahi hai. Jo bhi service pehle rolls hai ek inconsistency banाता hai. Queue consumers ise worse banाते hain kyunki wo bhi naye code ko pick up karने ke liye independently restart karते hain. Ek truly simultaneous deploy coordinate karना ek heavyweight manual operation hai. Expand/contract ise independently deployable steps ke ek sequence se replace karता hai, har ek pichhle ke saath backward-compatible.',
      },
      {
        wrong: `# skipping the backfill: R1 (expand) then straight to R3 (readers migrate)
# R1: add first_name/last_name nullable; new code writes all three
# R3: new code READS first_name/last_name
# ...but the 8 million rows created before R1 have first_name = NULL.
# every user who signed up before the deploy now shows a blank name / a crash on
// "cannot read property of null". the bug is invisible in staging (fresh data).`,
        right: `# R2 backfill is not optional. between expand and migrate-readers:
#   run a BATCHED job:  UPDATE users SET first_name = split_part(full_name,' ',1), ...
//                       WHERE first_name IS NULL  LIMIT 10000;   -- commit; repeat
#   - batched so each txn is short (no long lock, no WAL bloat, resumable)
#   - throttled if the DB is under load (sleep between batches, watch replica lag)
#   - VERIFY:  SELECT count(*) FROM users WHERE first_name IS NULL;   must be 0
#   - only THEN deploy R3 (readers). the new column is now populated for every row.`,
        why: 'The expand step adds the new columns and makes new writes populate them, but it does nothing to the rows that already exist — those keep whatever the new columns default to, which for a nullable column with no default is null. If the reader migration is deployed before those existing rows are filled in, then every request that touches an old row reads a null where the code now expects a value, producing blank fields or null-dereference crashes for exactly the users who were created before the change. This is easy to miss because staging and test databases are usually populated with fresh data created after the schema change, so the old-row case never occurs there. The backfill closes the gap: a job that updates the existing rows in bounded batches, each in its own short transaction so it does not hold locks or bloat the write-ahead log and can be stopped and resumed, throttled if necessary to avoid overloading the database or lagging replicas, run to completion, and then verified with a count query that returns zero rows still missing the new value. Only after that verification is the reader migration safe to deploy.',
        whyHi: 'Expand step naye columns add karता hai aur naye writes unhe populate karवाता hai, par ye un rows ke saath kuch nahi karता jo already exist karती hain. Agar reader migration un existing rows ke bharे jaने se pehle deployed hai, to har request jo ek old row ko touch karती hai ek null read karती hai jahaan code ab ek value expect karता hai. Ye miss karna aasan hai kyunki staging aur test databases usually fresh data se populated hain. Backfill gap band karता hai: ek job jo existing rows ko bounded batches mein update karता hai, har ek apni short transaction mein, aur phir ek count query se verified.',
      },
      {
        wrong: `# dropping the old column while something still reads it
# grep shows no code references 'full_name'. R5: ALTER TABLE users DROP COLUMN full_name;
# ...30 minutes later the nightly analytics export fails:
//   ERROR: column "full_name" does not exist
# and a downstream BI dashboard, a Metabase question, and a partner CSV feed all break.
# the grep only covered the application repo - not the data pipeline, not saved queries.`,
        right: `# before R5, prove NOTHING reads the column - across ALL consumers:
#   - grep every service repo + shared libs
#   - check the DB query logs / pg_stat_statements for any query naming the column
//     over a full cycle (a week, covering monthly/quarterly jobs)
#   - audit BI tools (saved questions, dashboards), ETL/analytics pipelines, partner feeds
#   - a "tombstone" period: keep the column but rename it full_name__deprecated or add a
//     rule that logs on access, for N weeks. zero access -> safe to drop.
#   - drop in its own migration, reversible-ish (you have a backup), off-peak.`,
        why: 'The contract step is the one that is actually destructive: dropping a column deletes data and makes every query that names it fail immediately. Deciding it is safe by grepping the application codebase is insufficient because a database column is read from many places that are not the application: scheduled analytics and ETL jobs, business-intelligence tools with saved queries and dashboards, replication into a data warehouse, direct queries by data analysts, exports to partners. A grep of one repository sees none of those. Establishing that nothing reads the column requires checking all of those consumers — searching every code repository including shared libraries, examining the database\'s own record of executed queries over a period long enough to include infrequent jobs such as monthly or quarterly reports, and auditing the BI and pipeline layers directly. A safer intermediate step is a tombstone period: rename the column to signal deprecation or add logging on any access, leave it for several weeks, and drop it only after confirming zero accesses. The drop itself should be its own migration, run off-peak, with a backup taken first.',
        whyHi: 'Contract step wo hai jo actually destructive hai: ek column drop karna data delete karता hai aur har query jo ise name karती hai turant fail karवाता hai. Ise safe decide karना application codebase ko grep karके insufficient hai kyunki ek database column kई jagahon se read hota hai jo application nahi hain: scheduled analytics aur ETL jobs, BI tools, ek data warehouse mein replication, data analysts dwara direct queries. Ek repository ka ek grep unmें se koi nahi dekhता. Ek safer intermediate step ek tombstone period hai: column ko rename karके deprecation signal karo, ise kई hafton ke liye chhodो, aur ise sirf zero accesses confirm karने ke baad drop karo.',
      },
    ],

    realWorld: [
      {
        en: '**A `$0` charge bug from a big-bang message rename** — `OrderPlaced.total` became `total_cents` in one PR touching 4 services. order-service rolled first; billing-service (not yet rolled) read `.total` as `undefined`, `undefined * 1` = NaN, and a batch of orders was invoiced at $0. Reworked as expand/contract; each service now deploys independently.',
        hi: '**Ek big-bang message rename se ek `$0` charge bug** — `OrderPlaced.total` ek PR mein `total_cents` bana. order-service pehle rolled; billing-service ne `.total` ko `undefined` read kiya. Expand/contract ke roop mein rework kiya.',
      },
      {
        en: '**Every pre-launch user got a blank name for a week** — a `full_name` → `first_name`/`last_name` change shipped the expand and the reader migration together, skipping the backfill. 8M existing rows had `first_name = NULL`. Staging looked fine (all fresh data). Added a mandatory backfill-verify gate between expand and reader releases.',
        hi: '**Har pre-launch user ko ek hafte blank name mila** — ek `full_name` → `first_name`/`last_name` change ne expand aur reader migration saath shipped, backfill skip karके. Ek mandatory backfill-verify gate add kiya.',
      },
      {
        en: '**A `DROP COLUMN` that broke the finance close** — grep of the app repo showed no references, so the column was dropped. The monthly revenue-recognition job (a separate Python repo) named it directly and failed on the 1st. Now every column drop needs a sign-off from data-eng + a 3-week tombstone.',
        hi: '**Ek `DROP COLUMN` jisne finance close toda** — app repo ke grep ne koi references nahi dikhाye. Monthly revenue-recognition job ne ise directly name kiya. Ab har column drop ko data-eng se sign-off + ek 3-week tombstone chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the expand/contract (parallel change) pattern, and why is it necessary?',
        qHi: 'Expand/contract (parallel change) pattern kya hai, aur ye zaroori kyun hai?',
        a: 'It is a way of making a change to a shared contract — a database column, an API field, a message format, a config key — safely, when old and new code will be running at the same time. It is necessary because every zero-downtime deployment has a window where both versions are live: a rolling update runs a mix of Pods for minutes, a blue-green pair shares a database, a fleet of queue consumers restarts independently. A one-step rename is inconsistent during that window — some responses have the old field, some the new; the old code queries a column that no longer exists; a consumer gets a message format it cannot parse. And there is no atomic deploy across a fleet or an atomic simultaneous restart of every consumer to escape the window. The pattern replaces the one incompatible step with a sequence of individually compatible releases. First expand: add the new thing alongside the old and make everything write both and read either. Then backfill any existing data into the new form with a batched job. Then migrate readers to the new form while still writing both. Then migrate writers to stop writing the old form. Then contract: once nothing reads the old form, remove it and delete the dead code. The invariant is that each release is backward-compatible with the release immediately before it, so a fleet running any two consecutive releases is consistent, the sequence can be paused anywhere, and any single release can be rolled back without breakage.',
        aHi: 'Ye ek shared contract mein ek change safely karne ka ek tarika hai — ek database column, ek API field, ek message format — jab old aur new code same time par chal rahe honge. Ye zaroori hai kyunki har zero-downtime deployment ka ek window hai jahaan dono versions live hain. Ek one-step rename us window ke dauraan inconsistent hai. Pattern us ek incompatible step ko individually compatible releases ke ek sequence se replace karता hai. Pehle expand: naye ko old ke bagal add karo aur sab kuch dono likhwाओ. Phir backfill. Phir readers migrate karo. Phir writers migrate karo. Phir contract. Invariant ye hai ki har release iske turant pehle wale release ke saath backward-compatible hai.',
      },
      {
        q: 'Walk through renaming a database column with zero downtime.',
        qHi: 'Zero downtime ke saath ek database column rename karना samjhao.',
        a: 'Take renaming full_name to first_name and last_name. Release one, expand: add first_name and last_name as nullable columns with no default, so the ALTER is instant and does not rewrite the table, and deploy code that writes all three columns and can read either form. Old code, still running during the roll, is unaffected because full_name still exists and is still populated. Then, not a deploy but a job: backfill the rows that existed before release one, whose new columns are null, by updating the table in bounded batches — a few thousand rows per transaction, commit, repeat, throttled if the database is busy — and verify with a count query that zero rows are still missing the new values. Release two, migrate readers: deploy code that reads first_name and last_name everywhere it used to read full_name, while still writing all three; anything still reading full_name is fine because it is still maintained. Release three, migrate writers: deploy code that stops writing full_name, and add the NOT NULL constraint on first_name as NOT VALID then VALIDATE so it does not take a long lock. Release four, contract: once you have confirmed nothing anywhere reads full_name — the app repos, the analytics and ETL jobs, BI saved queries, partner feeds, ideally after a tombstone period — run a migration to drop the column and delete the now-dead code and its tests. Each release is safe to roll between and to roll back.',
        aHi: 'full_name ko first_name aur last_name mein rename karना lo. Release one, expand: first_name aur last_name ko nullable columns bina default ke add karo, to ALTER instant hai, aur code deploy karo jo saare teen columns likhता hai aur either form read kar sakta hai. Phir, ek deploy nahi balki ek job: un rows ko backfill karo jo release one se pehle exist karती thीं, table ko bounded batches mein update karके, aur ek count query se verify karo. Release two, migrate readers. Release three, migrate writers, aur first_name par NOT NULL constraint NOT VALID phir VALIDATE ke roop mein add karo. Release four, contract: ek baar aapne confirm kiya ki kuch bhi kahin full_name read nahi karता, column drop karने ki migration chalाओ.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain why a one-step rename breaks a zero-downtime deploy, and list the expand/contract sequence for renaming a DB column.',
        taskHi: 'Ek comment mein, samjhao ki ek one-step rename ek zero-downtime deploy ko kyun todता hai.',
        hint: 'Every zero-downtime strategy has a MIXED-VERSION WINDOW where old + new code are BOTH live: a rolling update runs a mix of Pods for minutes; a blue-green pair shares one DB; a fleet of queue consumers restarts INDEPENDENTLY. A one-step rename is inconsistent during that window — some responses have the old field / some the new (a client making several requests gets both); the old code queries a column that no longer exists; a consumer gets a message format it can\'t parse → crash or dead-letter. There is NO atomic deploy across a fleet and NO atomic "restart every consumer at once" to escape the window. EXPAND/CONTRACT SEQUENCE (rename `full_name` → `first_name` + `last_name`): R1 EXPAND (deploy) — add `first_name`/`last_name` as NULLABLE, NO DEFAULT (instant ALTER, no table rewrite); code WRITES all three + READS either → old code unaffected (`full_name` still exists + written). R2 BACKFILL (a JOB, not a deploy) — batched `UPDATE ... WHERE first_name IS NULL LIMIT 10000; commit; repeat` (short txns, resumable, throttleable); VERIFY `count(*) WHERE first_name IS NULL` = 0. R3 MIGRATE READERS (deploy) — code now READS `first_name`/`last_name`, still writes all three. R4 MIGRATE WRITERS (deploy) — code STOPS writing `full_name`; add the `NOT NULL` on `first_name` as `NOT VALID` then `VALIDATE` (Lesson 5). R5 CONTRACT (deploy + migration) — once NOTHING reads `full_name` (grep ALL repos + DB query logs over a full cycle + BI/ETL/partner feeds + a tombstone period) → `DROP COLUMN full_name` + delete the dead code + old tests. THE INVARIANT: each release is backward-compatible with the one IMMEDIATELY BEFORE → any two consecutive releases coexist, you can PAUSE anywhere or ROLL BACK ONE release with no breakage. NEVER jump R1→R5.',
        hintHi: 'Har zero-downtime strategy ka ek MIXED-VERSION WINDOW hai jahaan old + new code DONO live hain. Ek one-step rename us window ke dauraan inconsistent hai. Ek fleet ke across KOI atomic deploy nahi. EXPAND/CONTRACT: R1 EXPAND — `first_name`/`last_name` NULLABLE add karo; code SAARE TEEN WRITES + EITHER READS. R2 BACKFILL (ek JOB) — batched UPDATE; VERIFY count = 0. R3 MIGRATE READERS. R4 MIGRATE WRITERS — `full_name` likhना BAND; `NOT NULL` as `NOT VALID` then `VALIDATE`. R5 CONTRACT — ek baar KUCH BHI `full_name` read nahi karता → `DROP COLUMN`. INVARIANT: har release iske TURANT PEHLE wale ke saath backward-compatible. R1→R5 KABHI jump mat karo.',
      },
      {
        task: 'In a comment, describe how expand/contract applies to a queue message, an API field, and a config key.',
        taskHi: 'Ek comment mein, describe karo ki expand/contract ek queue message, ek API field, aur ek config key par kaise apply hota hai.',
        hint: 'QUEUE / EVENT MESSAGE (e.g. `OrderPlaced.total` → `total_cents`): (1) producers emit BOTH `total` AND `total_cents` (or a versioned envelope carrying both); (2) each consumer, independently, in ANY order, is updated to read `total_cents ?? total*100`; (3) producers STOP emitting `total` — only after step 2 is everywhere; (4) consumers REMOVE the `?? total*100` fallback; (5) optional: a schema-registry / envelope version bump documents the retirement. At every step a consumer on the previous release still works — NO lockstep deploy. API / JSON FIELD: add the new field to responses while KEEPING the old; migrate clients to read the new (with a fallback for a private API); STOP populating the old — for a PUBLIC API instead deprecate it with a documented SUNSET date and remove it only in a MAJOR version. CONFIG KEY (`OLD_KEY` → `NEW_KEY`): (1) ship code that reads `NEW_KEY ?? OLD_KEY`; (2) set `NEW_KEY` in EVERY environment; (3) ship code that reads ONLY `NEW_KEY`; (4) remove `OLD_KEY`. (RPC/gRPC: add the new method/field; migrate callers; deprecate then remove the old, RESERVING the field number so it\'s never reused.) THE ANTI-PATTERN everywhere: the "big bang" — change the producer + all consumers in one PR, deploy "atomically". There is NO atomic deploy across >1 process; something is always mid-roll; a consumer restarts at the wrong second and gets a message it can\'t parse. Expand/contract trades ONE risky step for SEVERAL boring ones — boring is the goal.',
        hintHi: 'QUEUE / EVENT MESSAGE: (1) producers DONO emit karते hain (ya ek versioned envelope); (2) har consumer, independently, KISI BHI order mein, `total_cents ?? total*100` read karने ke liye updated; (3) producers `total` emit karना BAND — sirf step 2 everywhere ke baad; (4) consumers fallback REMOVE karते hain. API / JSON FIELD: naya field add, old KEEP; clients migrate; old populate karना STOP — ek PUBLIC API ke liye ek SUNSET date ke saath deprecate. CONFIG KEY: (1) `NEW_KEY ?? OLD_KEY` read karo; (2) HAR environment mein `NEW_KEY` set karo; (3) SIRF `NEW_KEY`; (4) `OLD_KEY` remove. ANTI-PATTERN: "big bang" — koi atomic deploy nahi hai.',
      },
      {
        task: 'In a comment, explain the two most dangerous shortcuts — skipping the backfill, and dropping the old column too early — and how to guard against each.',
        taskHi: 'Ek comment mein, do sabse khatarnak shortcuts samjhao.',
        hint: 'SKIPPING THE BACKFILL (R1 expand → straight to R3 readers-migrate): expand adds the new columns and populates them for NEW writes, but does NOTHING to rows created BEFORE R1 — those keep the nullable-no-default value = NULL. Deploy R3 (readers) and every request touching an OLD row reads NULL where the code now expects a value → blank fields / "cannot read property of null" crashes, for EXACTLY the users created before the change. INVISIBLE IN STAGING (fresh data — the old-row case never occurs). GUARD: R2 is NOT optional — a BATCHED job (`UPDATE ... WHERE first_name IS NULL LIMIT 10000; commit; repeat` — short txns, resumable, throttle if the DB is busy / replicas lag), then a MANDATORY gate: `SELECT count(*) FROM users WHERE first_name IS NULL` must be 0 before R3 ships. DROPPING THE OLD COLUMN TOO EARLY (R5 contract): a grep of the APP repo showing no references is INSUFFICIENT — a DB column is read from many non-app places: scheduled analytics / ETL jobs (separate repos), BI tools (saved questions, dashboards), replication into a warehouse, direct analyst queries, partner CSV exports. A one-repo grep sees NONE of them → `DROP COLUMN` → the nightly export / the monthly finance close / a partner feed fails with "column does not exist". GUARD: before R5, prove NOTHING reads it — grep EVERY service repo + shared libs; check `pg_stat_statements` / query logs over a FULL cycle (a week+, covering monthly/quarterly jobs); audit BI + ETL + partner feeds directly; a TOMBSTONE period (rename to `full_name__deprecated` or log on access, N weeks, zero access → safe); drop in its OWN migration, off-peak, backup first.',
        hintHi: 'BACKFILL SKIP KARNA (R1 → seedhे R3): expand naye columns NAYE writes ke liye populate karता hai, par R1 se PEHLE bani rows ke saath KUCH NAHI — wo NULL rehती hain. R3 deploy karo aur har request jo ek OLD row touch karती hai NULL read karती hai → blank fields / crashes. STAGING MEIN INVISIBLE. GUARD: R2 optional NAHI — ek BATCHED job, phir ek MANDATORY gate: `count(*) WHERE first_name IS NULL` = 0. OLD COLUMN JALDI DROP KARNA (R5): APP repo ka ek grep INSUFFICIENT hai — ek DB column kई non-app jagahon se read hota hai. GUARD: HAR repo grep karo; query logs ek FULL cycle par check karo; BI + ETL audit karo; ek TOMBSTONE period.',
      },
    ],

    keyTakeaways: [
      'A ONE-STEP rename/restructure of anything SHARED breaks every zero-downtime deploy, because there is always a MIXED-VERSION WINDOW (a rolling update runs a Pod mix for minutes; blue-green shares a DB; queue consumers restart independently) and NO atomic deploy across a fleet. Some responses have the old field / some the new; the old code queries a dropped column; a consumer gets an unparseable message.',
      'EXPAND/CONTRACT (parallel change) = one incompatible step → a SEQUENCE of individually-compatible releases. Renaming a DB column: R1 EXPAND (add nullable/no-default columns — instant ALTER; code writes ALL, reads EITHER), R2 BACKFILL (a batched JOB, then VERIFY count = 0 — NOT optional), R3 MIGRATE READERS (read new, still write all), R4 MIGRATE WRITERS (stop writing old; add `NOT NULL` as `NOT VALID` then `VALIDATE`), R5 CONTRACT (once NOTHING reads old → `DROP COLUMN` + delete dead code + old tests).',
      'THE INVARIANT: each release is backward-compatible with the one IMMEDIATELY BEFORE IT → any two consecutive releases coexist safely, the sequence can be PAUSED anywhere (hold at R1 for weeks), and any SINGLE release can be rolled back with no breakage. You CANNOT jump R1 → R5 (a fleet of "writes both / reads old" + "column dropped" is broken).',
      'SAME PATTERN, EVERY SHARED CONTRACT: QUEUE/EVENT MSG — producers emit both (or a versioned envelope), consumers updated independently in any order to read `new ?? old`, producers stop emitting old, remove fallbacks. API/JSON FIELD — add new, keep old, migrate clients, stop populating old (public API: deprecate with a SUNSET date, remove in a major version). CONFIG KEY — read `NEW ?? OLD`, set `NEW` everywhere, read only `NEW`, remove `OLD`. gRPC — add method/field, migrate callers, deprecate + remove, RESERVE the field number.',
      'THE TWO DANGEROUS SHORTCUTS: (1) SKIPPING THE BACKFILL — rows created before R1 keep NULL; deploy readers and every OLD row crashes for exactly the pre-change users; invisible in staging (fresh data). Guard: a batched job + a mandatory `count = 0` gate. (2) DROPPING THE OLD COLUMN TOO EARLY — an app-repo grep misses analytics/ETL jobs, BI saved queries, warehouse replication, partner feeds. Guard: grep ALL repos + query logs over a full cycle + audit BI/ETL + a tombstone period, drop off-peak with a backup. THE ANTI-PATTERN: the "big bang" — producer + all consumers in one PR, "deploy atomically" (there is no atomic deploy across >1 process). Expand/contract trades ONE risky step for SEVERAL boring ones.',
    ],
    keyTakeawaysHi: [
      'Kuch bhi SHARED ka ek ONE-STEP rename har zero-downtime deploy ko todता hai, kyunki hamesha ek MIXED-VERSION WINDOW hai aur ek fleet ke across KOI atomic deploy nahi. Kuch responses mein old field / kuch mein new; old code ek dropped column query karता hai; ek consumer ek unparseable message paता hai.',
      'EXPAND/CONTRACT = ek incompatible step → individually-compatible releases ka ek SEQUENCE. Ek DB column rename: R1 EXPAND (nullable columns add karo — instant ALTER; code SAB writes, EITHER reads), R2 BACKFILL (ek batched JOB, phir VERIFY count = 0 — optional NAHI), R3 MIGRATE READERS, R4 MIGRATE WRITERS (`NOT NULL` as `NOT VALID` then `VALIDATE`), R5 CONTRACT (`DROP COLUMN` + dead code delete).',
      'INVARIANT: har release iske TURANT PEHLE wale ke saath backward-compatible → koi bhi do consecutive releases safely coexist, sequence ko kahin bhi PAUSE kar sakte ho, aur koi bhi SINGLE release roll back ho sakti hai. R1 → R5 KABHI jump mat karo.',
      'SAME PATTERN, HAR SHARED CONTRACT: QUEUE/EVENT MSG — producers dono emit karते hain, consumers independently updated, producers old emit karना band karते hain. API/JSON FIELD — naya add, old keep, clients migrate (public API: ek SUNSET date). CONFIG KEY — `NEW ?? OLD` read karo, HAR jagah `NEW` set karo, sirf `NEW`, `OLD` remove.',
      'DO KHATARNAK SHORTCUTS: (1) BACKFILL SKIP KARNA — R1 se pehle bani rows NULL rehती hain; readers deploy karo aur har OLD row crash karती hai; staging mein invisible. Guard: ek batched job + ek mandatory `count = 0` gate. (2) OLD COLUMN JALDI DROP KARNA — ek app-repo grep analytics/ETL, BI, partner feeds miss karता hai. Guard: HAR repo grep + query logs + ek tombstone period. ANTI-PATTERN: "big bang".',
    ],
  },

  {
    slug: 'ops-database-migrations-in-the-pipeline',
    title: 'Database Migrations in the Pipeline',
    titleHi: 'Pipeline Mein Database Migrations',
    description: 'A schema change and the code that depends on it deploy at different moments and cannot be rolled back together. The rule: every migration must leave the database usable by both the old code and the new code. That means additive-only changes, constraints added as NOT VALID then VALIDATE, indexes built CONCURRENTLY, and destructive changes deferred to a much later release.',
    descriptionHi: 'Ek schema change aur wo code jo ispar depend karता hai alag moments par deploy hote hain aur saath roll back nahi ho sakte. Rule: har migration ko database ko old code AUR new code dono dwara usable chhodना chahiye. Iska matlab additive-only changes, constraints NOT VALID phir VALIDATE ke roop mein added, indexes CONCURRENTLY built, aur destructive changes ek bahut baad ke release ke liye deferred.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Renovating a restaurant kitchen while service continues every night.** You never rip out the old stoves and install the new ones between lunch and dinner — the kitchen would be unusable for the shift. Instead every change is made so that *both* the current crew and the crew you are training can work through it: you *add* a new prep station without removing the old one, you route new orders to it gradually, you keep the old station wired up until the new one has run a full weekend, and only weeks later — once nobody has touched the old station in a month — do you unbolt it. A constraint like "every plate must be checked by the expeditor" is introduced softly: first it applies only to new orders (\`NOT VALID\`), then, on a slow afternoon, you quietly re-check the plates already out (\`VALIDATE\`) rather than halting the line to do it.',
      hi: '**Ek restaurant kitchen renovate karna jabki service har raat continue hoती hai.** Aap kabhi purane stoves rip out karके naye lunch aur dinner ke beech install nahi karte. Iske bajaay har change aisा kiya jaata hai ki *dono* current crew aur wo crew jise aap train kar rahe ho iske through kaam kar sakें: aap ek naya prep station *add* karते ho bina old ko remove kiye, aap naye orders ise gradually route karते ho, aap old station ko wired up rakhते ho jab tak naya ek poora weekend na chal jaaye, aur sirf hafton baad aap ise unbolt karते ho. Ek constraint jaise "har plate expeditor dwara check hoना chahiye" softly introduce kiya jaata hai: pehle ye sirf naye orders par apply hoता hai (\`NOT VALID\`), phir ek slow afternoon par aap quietly already-out plates ko re-check karते ho (\`VALIDATE\`).',
    },

    simple: `**THE MIGRATION AND THE CODE DEPLOY SEPARATELY AND CAN'T ROLL BACK TOGETHER.**
The rule: **every migration leaves the DB usable by BOTH the currently-running code AND the
next version** (they overlap: rolling update, blue-green sharing one DB).

**ORDERING — migrate-then-deploy for ADDITIVE changes:**
\`\`\`
1. run the migration (backward-compatible: old code doesn't know the new column, doesn't care)
2. THEN roll out the code that uses it
# for a rolling update the migration must be safe for the OLD pods still running.
# NEVER: deploy code that needs a column, then migrate. the new pods crash until the migration lands.
\`\`\`

**SAFE (additive, non-locking) vs UNSAFE (locking / destructive):**
\`\`\`
SAFE now                                  UNSAFE - defer / do carefully
------------------------------------      -------------------------------------------
ADD COLUMN ... NULL  (no default)*        ADD COLUMN ... NOT NULL DEFAULT <expr>  (table rewrite, old PG)
CREATE INDEX CONCURRENTLY                 CREATE INDEX  (locks writes for the whole build)
ADD CONSTRAINT ... NOT VALID              ADD CONSTRAINT  (full scan + lock)
   then, separately: VALIDATE CONSTRAINT  (weak lock)
CREATE TABLE / new nullable FK            DROP COLUMN / DROP TABLE / RENAME  (breaks old code NOW)
ALTER ... SET DEFAULT (new rows only)     ALTER COLUMN TYPE  (rewrite + lock; do it expand/contract)
\`\`\`
*modern PG: \`ADD COLUMN ... DEFAULT <constant>\` is also fast (metadata-only). A \`DEFAULT now()\` or a volatile expr still rewrites.

**BACKFILL in batches, as a JOB (not in the migration):**
\`\`\`sql
-- loop until 0 rows affected; commit between batches; throttle if replicas lag
UPDATE users SET first_name = split_part(full_name,' ',1)
WHERE id IN (SELECT id FROM users WHERE first_name IS NULL LIMIT 5000);
\`\`\`
a single \`UPDATE\` over millions of rows = one giant transaction = long lock + WAL blowup + can't resume.

**EXPAND/CONTRACT FOR SCHEMA (Lesson 4), destructive step LAST:**
R1 \`ADD COLUMN\` nullable · R2 backfill job · R3 code reads new (writes both) · R4 code writes
only new + \`ADD CONSTRAINT NOT VALID\` → \`VALIDATE\` · R5 (weeks later) \`DROP COLUMN\` old.

**FORWARD-ONLY FOR DATA:** \`kubectl rollout undo\` reverts *code*, not a migration. If a
migration or a backfill corrupted data, "rollback" = a NEW migration that fixes it forward
(+ restore from backup / PITR if it's unrecoverable). So: destructive migrations are their
own release, off-peak, with a fresh backup, and never bundled with the code that stops using
the thing.`,

    simpleHi: `**MIGRATION AUR CODE ALAG DEPLOY HOTE HAIN AUR SAATH ROLL BACK NAHI HO SAKTE.**
Rule: **har migration DB ko DONO currently-running code AUR agle version dwara usable chhodता hai**.

**ORDERING — ADDITIVE changes ke liye migrate-then-deploy:**
\`\`\`
1. migration chalाओ (backward-compatible: old code naye column ko nahi jaanta, parwah nahi)
2. PHIR wo code roll out karo jo ise use karता hai
# KABHI: code deploy karo jise ek column chahiye, phir migrate. naye pods crash karте hain.
\`\`\`

**SAFE (additive, non-locking) vs UNSAFE (locking / destructive):**
\`\`\`
SAFE now                                  UNSAFE - defer / carefully karo
ADD COLUMN ... NULL  (no default)         ADD COLUMN ... NOT NULL DEFAULT <expr>  (table rewrite)
CREATE INDEX CONCURRENTLY                 CREATE INDEX  (writes lock)
ADD CONSTRAINT ... NOT VALID              ADD CONSTRAINT  (full scan + lock)
   phir separately: VALIDATE CONSTRAINT   (weak lock)
CREATE TABLE / new nullable FK            DROP COLUMN / DROP TABLE / RENAME  (old code ABHI todता hai)
\`\`\`

**BACKFILL batches mein, ek JOB ke roop mein (migration mein nahi):**
\`\`\`sql
-- 0 rows affected tak loop; batches ke beech commit; throttle agar replicas lag
UPDATE users SET first_name = split_part(full_name,' ',1)
WHERE id IN (SELECT id FROM users WHERE first_name IS NULL LIMIT 5000);
\`\`\`
millions rows par ek single \`UPDATE\` = ek giant transaction = long lock + WAL blowup + resume nahi.

**SCHEMA KE LIYE EXPAND/CONTRACT (Lesson 4), destructive step LAST.**

**DATA KE LIYE FORWARD-ONLY:** \`kubectl rollout undo\` *code* revert karता hai, ek migration nahi.
Agar ek migration ne data corrupt kiya, "rollback" = ek NAYI migration jo ise forward fix karती
hai (+ backup / PITR se restore agar unrecoverable). To: destructive migrations apna release hain,
off-peak, ek fresh backup ke saath.`,

    content: `## The core constraint

A schema migration runs at one moment; the code that uses the new schema deploys at another, and for a rolling update or a blue-green pair the two versions of the code overlap in time against the same database. And crucially, \`kubectl rollout undo\` reverts the application to a previous version, but it does not revert a migration — the schema stays changed. So a migration and its code cannot be rolled back as a unit.

The rule that follows: **every migration must leave the database in a state that both the currently-running code and the next version of the code can use.** A migration that only the new code can tolerate breaks the old Pods the instant it applies (or the instant the roll starts). A code deploy that requires a column the migration has not added yet breaks the new Pods until the migration lands.

## Ordering: migrate first, for additive changes

For an **additive, backward-compatible** change — a new nullable column, a new table, a new nullable foreign key — the safe order is **migrate then deploy**:

1. Run the migration. The old code does not know the new column exists and never references it, so it is unaffected.
2. Then roll out the code that uses the new column.

Never the reverse. If you deploy code that reads or writes a column and only then run the migration, the new Pods error on every request that touches that column until the migration completes, which in a pipeline can be minutes.

The order that is genuinely hard is a change that is *not* backward-compatible — and the answer there is expand/contract (Lesson 4), which decomposes it into a series of additive steps so that migrate-then-deploy applies to each.

## Safe versus unsafe operations

The difference between a safe migration and an outage is usually whether the operation takes a **lock** that blocks reads or writes, or **rewrites the table**, while it runs.

**Adding a column.** \`ADD COLUMN foo text\` (nullable, no default) is instant — it is a catalog change only. On modern PostgreSQL, \`ADD COLUMN foo text DEFAULT 'x'\` with a *constant* default is also instant. But \`ADD COLUMN foo text NOT NULL DEFAULT some_function()\`, or a non-constant default, or \`NOT NULL\` without a default on a non-empty table, forces a full table rewrite under an exclusive lock. Add the column nullable, backfill separately, then add the constraint.

**Adding an index.** \`CREATE INDEX\` locks the table against writes for the entire duration of the build, which on a large table is minutes to hours. \`CREATE INDEX CONCURRENTLY\` builds it without blocking writes, at the cost of taking longer and not being runnable inside a transaction (so a migration tool has to be told to run it outside one). Always use \`CONCURRENTLY\` for indexes on tables that are in use.

**Adding a constraint.** \`ADD CONSTRAINT ... CHECK (...)\` or a foreign key scans the whole table to verify existing rows, holding a lock during the scan. \`ADD CONSTRAINT ... NOT VALID\` skips the scan — the constraint applies to new and modified rows immediately but existing rows are not checked — and takes only a brief lock. Then, in a **separate statement** (and usually a separate migration), \`VALIDATE CONSTRAINT\` performs the scan under a much weaker lock that does not block reads or writes. Splitting it this way turns one long blocking operation into two short ones.

**Destructive changes.** \`DROP COLUMN\`, \`DROP TABLE\`, \`RENAME\`, and \`ALTER COLUMN ... TYPE\` (which rewrites) either break the old code immediately or take a heavy lock. These are the operations that must be deferred to a release well after the code has stopped using the thing, and handled with the expand/contract sequence.

## Backfilling

When a new column needs values for the rows that existed before it was added, the backfill is **not part of the migration** and **not a single statement**. A single \`UPDATE users SET x = ...\` across millions of rows is one enormous transaction: it holds row locks for its entire duration, generates a huge amount of write-ahead log, blocks vacuum, and cannot be paused or resumed — if it fails at 90% you start over.

The backfill is a **job** that updates the table in **bounded batches**:

\`\`\`sql
-- repeat until it affects 0 rows
UPDATE users SET first_name = split_part(full_name, ' ', 1),
                 last_name  = split_part(full_name, ' ', 2)
WHERE id IN (SELECT id FROM users WHERE first_name IS NULL LIMIT 5000);
\`\`\`

Each batch is a short transaction. Between batches the job commits, optionally sleeps to throttle load, and checks replication lag. It can be stopped and restarted from where it left off because the \`WHERE first_name IS NULL\` predicate naturally resumes. When it affects zero rows, the backfill is done, and a verification query confirms it.

## Expand/contract applied to a column rename

Putting it together, the full sequence for renaming \`full_name\` to \`first_name\` and \`last_name\` with zero downtime:

| release | migration | code |
|---|---|---|
| **R1 expand** | \`ADD COLUMN first_name text, ADD COLUMN last_name text\` (nullable, instant) | writes all three, reads either |
| **R2 backfill** | — | a batched job fills the new columns; verify \`count(*) WHERE first_name IS NULL = 0\` |
| **R3 readers** | — | reads \`first_name\`/\`last_name\`, still writes all three |
| **R4 writers** | \`ADD CONSTRAINT first_name_nn CHECK (first_name IS NOT NULL) NOT VALID\` then (separate) \`VALIDATE CONSTRAINT first_name_nn\` | stops writing \`full_name\` |
| **R5 contract** | \`DROP COLUMN full_name\` (its own release, off-peak, backup first) | delete the dead code and its tests |

At every row of that table, the database is usable by the code of that release and the one before it.

## Forward-only for data

Code rollback is \`kubectl rollout undo\` — instant and lossless. Data has no equivalent. If a migration or a backfill writes wrong values or drops something, "rolling back" is not an option that exists: the schema-level change can sometimes be reversed with another migration, but any data that was overwritten or deleted is gone unless you restore it. So:

- A destructive migration is **its own release** — never bundled with the code change that stops using the column, so that if the code change has to be rolled back, the column is still there.
- It runs **off-peak** and with a **fresh backup or a known point-in-time-recovery target** taken immediately before.
- The recovery plan for "the migration corrupted data" is a **forward fix**: a new migration that corrects the values, plus, if the corruption is unrecoverable, a restore from that backup. It is never "undo the deploy."

This is why the DORA metric is *change failure rate and time to restore*, not "rollback rate" — for schema and data changes, restoring often means rolling forward, and the pipeline has to be fast enough to ship a fix, not just revert one.`,

    contentHi: `## Core constraint

Ek schema migration ek moment par chalती hai; wo code jo naya schema use karता hai doosre par deploy hota hai, aur ek rolling update ke liye code ke do versions same database ke against time mein overlap karते hain. Aur crucially, \`kubectl rollout undo\` application ko ek previous version par revert karता hai, par ye ek migration revert nahi karता — schema changed rehता hai. To ek migration aur iska code ek unit ke roop mein roll back nahi ho sakte.

Jo rule follow hota hai: **har migration ko database ko ek aisी state mein chhodना chahiye jise dono currently-running code aur code ka agla version use kar sakें.**

## Ordering: additive changes ke liye pehle migrate

Ek **additive, backward-compatible** change ke liye — ek naya nullable column, ek nayi table — safe order **migrate phir deploy** hai:
1. Migration chalाओ. Old code naye column ke exist hone ko nahi jaanta.
2. Phir wo code roll out karo jo naya column use karता hai.

Kabhi reverse nahi. Agar aap code deploy karते ho jo ek column read ya write karता hai aur sirf phir migration chalाते ho, naye Pods har request par error karते hain.

## Safe versus unsafe operations

Ek safe migration aur ek outage ke beech difference usually ye hai ki operation ek **lock** leता hai jo reads ya writes block karता hai, ya **table rewrite** karता hai, jabki ye chalता hai.

**Ek column add karna.** \`ADD COLUMN foo text\` (nullable, no default) instant hai. \`ADD COLUMN foo text NOT NULL DEFAULT some_function()\` ek full table rewrite force karता hai ek exclusive lock ke tahat.

**Ek index add karna.** \`CREATE INDEX\` table ko writes ke against poore build ke liye lock karता hai. \`CREATE INDEX CONCURRENTLY\` ise bina blocking ke build karता hai.

**Ek constraint add karna.** \`ADD CONSTRAINT ... NOT VALID\` scan skip karता hai. Phir, ek **separate statement** mein, \`VALIDATE CONSTRAINT\` scan ek bahut weaker lock ke tahat perform karता hai.

**Destructive changes.** \`DROP COLUMN\`, \`DROP TABLE\`, \`RENAME\` ya to old code ko turant todते hain ya ek heavy lock leते hain. Ye defer hone chahiye.

## Backfilling

Backfill **migration ka part nahi** hai aur **ek single statement nahi** hai. Millions rows par ek single \`UPDATE\` ek enormous transaction hai. Backfill ek **job** hai jo table ko **bounded batches** mein update karता hai. Har batch ek short transaction hai. Batches ke beech job commit karता hai.

## Forward-only for data

Code rollback \`kubectl rollout undo\` hai — instant aur lossless. Data ka koi equivalent nahi hai. Agar ek migration ne wrong values likhीं, "rolling back" ek option nahi hai. To:
- Ek destructive migration **apna release** hai.
- Ye **off-peak** aur ek **fresh backup** ke saath chalती hai.
- "Migration ne data corrupt kiya" ka recovery plan ek **forward fix** hai.

Isliye DORA metric *change failure rate aur time to restore* hai, "rollback rate" nahi.`,

    examples: [
      {
        title: 'Expand/contract on real PostgreSQL: rename a column with the app usable at every step',
        titleHi: 'Real PostgreSQL par expand/contract: ek column rename karo app ke har step par usable hone ke saath',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
cid="m11pg-$$"
docker run -d --name "$cid" -e POSTGRES_PASSWORD=x -e POSTGRES_DB=app postgres:16-alpine >/dev/null
trap 'docker rm -f "$cid" >/dev/null 2>&1' EXIT
for i in $(seq 1 30); do docker exec "$cid" pg_isready -U postgres >/dev/null 2>&1 && break; sleep 1; done
q() { docker exec -i "$cid" psql -U postgres -d app -qAtX -c "$1"; }

q "CREATE TABLE users(id serial primary key, full_name text not null);" >/dev/null
q "INSERT INTO users(full_name) VALUES ('Ada Lovelace'),('Alan Turing');" >/dev/null
echo "start:  columns = $(q "SELECT string_agg(column_name,',' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_name='users'")"

echo "--- R1 EXPAND: add the new columns, nullable, no default (instant - no table rewrite) ---"
q "ALTER TABLE users ADD COLUMN first_name text, ADD COLUMN last_name text;" >/dev/null
echo "  old code path (writes full_name) still works: id $(q "INSERT INTO users(full_name) VALUES ('Grace Hopper') RETURNING id") inserted"

echo "--- R2 BACKFILL: a batched job fills the pre-R1 rows (one batch shown; real = LIMIT + loop) ---"
q "UPDATE users SET first_name = split_part(full_name,' ',1), last_name = split_part(full_name,' ',2) WHERE first_name IS NULL;" >/dev/null
echo "  rows still missing the new columns: $(q "SELECT count(*) FROM users WHERE first_name IS NULL")   (must be 0 before R3)"

echo "--- R4 WRITERS: enforce NOT NULL as NOT VALID (brief lock), then VALIDATE (weak lock) ---"
q "ALTER TABLE users ADD CONSTRAINT users_first_name_nn CHECK (first_name IS NOT NULL) NOT VALID;" >/dev/null
q "ALTER TABLE users VALIDATE CONSTRAINT users_first_name_nn;" >/dev/null
echo "  constraint validated: $(q "SELECT convalidated FROM pg_constraint WHERE conname='users_first_name_nn'")"

echo "--- R5 CONTRACT (weeks later, own release, backup first): drop the old column ---"
q "ALTER TABLE users DROP COLUMN full_name;" >/dev/null
echo "end:    columns = $(q "SELECT string_agg(column_name,',' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_name='users'")"
echo "  data intact: $(q "SELECT string_agg(first_name||' '||last_name,'; ' ORDER BY id) FROM users")"`,
        output: `start:  columns = id,full_name
--- R1 EXPAND: add the new columns, nullable, no default (instant - no table rewrite) ---
  old code path (writes full_name) still works: id 3 inserted
--- R2 BACKFILL: a batched job fills the pre-R1 rows (one batch shown; real = LIMIT + loop) ---
  rows still missing the new columns: 0   (must be 0 before R3)
--- R4 WRITERS: enforce NOT NULL as NOT VALID (brief lock), then VALIDATE (weak lock) ---
  constraint validated: t
--- R5 CONTRACT (weeks later, own release, backup first): drop the old column ---
end:    columns = id,first_name,last_name
  data intact: Ada Lovelace; Alan Turing; Grace Hopper`,
        explain: 'A real PostgreSQL 16 instance runs the full expand/contract sequence for renaming a name column. The table starts with just id and full_name and two rows. R1 adds first_name and last_name as nullable columns with no default, which PostgreSQL performs as a catalog-only change with no table rewrite and no meaningful lock; immediately after, the example inserts a row the way the old code would — writing only full_name — and it succeeds, confirming the old code path is unaffected by the expand. R2 is the backfill, shown here as a single UPDATE for brevity but described as what it should be in production: a batched loop with a LIMIT, committing between batches. After it, a count of rows still missing the new columns returns zero, which is the gate that must pass before the reader migration ships. R4 adds the NOT NULL requirement in two steps — first as a CHECK constraint marked NOT VALID, which applies to new writes but does not scan the existing table and takes only a brief lock, then a separate VALIDATE statement that scans under a lock weak enough not to block traffic — and the constraint ends up validated. R5 drops full_name, which in a real pipeline is a standalone release run off-peak after a backup and only after confirming nothing reads the column. The final check shows the table now has id, first_name, last_name, and every row\'s data survived the whole sequence intact.',
        explainHi: 'Ek real PostgreSQL 16 instance ek name column rename karने ke liye poora expand/contract sequence chalाता hai. Table sirf id aur full_name aur do rows se shuru hoती hai. R1 first_name aur last_name ko nullable columns bina default ke add karता hai, jise PostgreSQL ek catalog-only change ke roop mein perform karता hai bina table rewrite ke; turant baad, example ek row insert karता hai jaisा old code karता — sirf full_name likhकर — aur ye succeed karता hai. R2 backfill hai. Iske baad, un rows ka ek count jo abhi bhi naye columns miss kar rahe hain zero return karता hai. R4 NOT NULL requirement ko do steps mein add karता hai — pehle ek CHECK constraint NOT VALID marked, phir ek separate VALIDATE statement. R5 full_name drop karता hai. Final check dikhाता hai ki table ke ab id, first_name, last_name hain, aur har row ka data poore sequence ke through intact survive kiya.',
      },
    ],

    mistakes: [
      {
        wrong: `# deploy-then-migrate: ship code that needs the column, then run the migration
# pipeline: [build] -> [deploy] -> [run migrations]
# the new pods start, every request does  SELECT ..., new_column FROM ...
#   ERROR: column "new_column" does not exist
# for the 90 seconds until the migration job finishes, the new pods 500 on every request
# that touches that table. and if the migration job itself fails, they 500 indefinitely.`,
        right: `# migrate-then-deploy for ADDITIVE changes (the migration is backward-compatible):
# pipeline: [build] -> [run migrations] -> [deploy]
#   1. the migration adds  new_column  (nullable). the OLD pods, still running, don't
//      reference it -> unaffected.
#   2. THEN the new pods roll out and use it. the column is already there.
# make migrations a distinct, gated pipeline stage that MUST succeed before deploy starts.
# (for NON-additive changes: expand/contract, Lesson 4 - each step is then additive.)`,
        why: 'When a change is additive and backward-compatible — a new nullable column, a new table — running the migration before the deploy is safe in both directions. The old code that is still running does not know the new column exists and never selects or writes it, so the migration does not affect it. The new code, once deployed, finds the column already present. Reversing the order breaks the new code: it is deployed expecting a schema that does not exist yet, so every request that reads or writes the new column fails with a "column does not exist" error for the entire time between the deploy completing and the migration finishing, which in a pipeline is often a minute or more, and indefinitely if the migration step fails. The correct structure is a pipeline where running migrations is a distinct stage that must complete successfully before the deploy stage begins. Non-additive changes cannot be handled by simple ordering at all and require the expand/contract decomposition, but that decomposition exists precisely so that each individual step is additive and the migrate-then-deploy rule applies to it.',
        whyHi: 'Jab ek change additive aur backward-compatible hai — ek naya nullable column, ek nayi table — migration ko deploy se pehle chalाना dono directions mein safe hai. Old code jo abhi bhi run kar raha hai naye column ke exist hone ko nahi jaanta. Naya code, ek baar deployed, column ko already present paता hai. Order reverse karna naye code ko todता hai: ye ek schema expect karके deployed hai jo abhi exist nahi karता, to har request jo naya column read ya write karती hai "column does not exist" error ke saath fail hoती hai. Correct structure ek pipeline hai jahaan migrations chalाना ek distinct stage hai jo deploy stage shuru hone se pehle successfully complete hona chahiye.',
      },
      {
        wrong: `# a "quick" schema change that locks the table in production
ALTER TABLE orders ADD COLUMN status text NOT NULL DEFAULT 'pending';   -- 40M rows, old PG
-- or:
CREATE INDEX idx_orders_customer ON orders (customer_id);               -- 40M rows
-- or:
ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
# each of these takes an ACCESS EXCLUSIVE (or write) lock and scans/rewrites 40M rows.
# every INSERT and UPDATE to 'orders' blocks for the minutes-to-hours it runs. checkout is down.`,
        right: `# split each into a non-locking form + a deferred heavy step:
# ADD COLUMN NOT NULL DEFAULT:
ALTER TABLE orders ADD COLUMN status text;                              -- instant, nullable
#   (batched backfill job sets 'pending')  ->  then:
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';           -- new rows
ALTER TABLE orders ADD CONSTRAINT orders_status_nn CHECK (status IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_status_nn;                -- separate, weak lock
# INDEX:
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);  -- no write lock (outside a txn)
# FOREIGN KEY:
ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id)
  REFERENCES customers(id) NOT VALID;                                    -- brief lock
ALTER TABLE orders VALIDATE CONSTRAINT fk_customer;                      -- separate, weak lock`,
        why: 'Several common DDL operations acquire a lock that blocks writes, or reads and writes, for as long as they run, and on a large table that is long enough to be an outage. Adding a column with a NOT NULL constraint and a non-constant default, on older PostgreSQL or with a volatile default, rewrites every row while holding an exclusive lock. A plain CREATE INDEX holds a lock against writes for the entire build. Adding a CHECK constraint or a foreign key scans the whole table to validate existing rows, under a lock, before the statement returns. The safe versions decompose each into a fast, non-blocking part and a deferred heavy part. The column is added nullable and instant, a batched job backfills it, the default is set for future rows, and the NOT NULL is enforced as a NOT VALID check followed by a separate VALIDATE. The index is built with CONCURRENTLY, which does not block writes, at the cost of running outside a transaction and taking longer. The foreign key is added NOT VALID for a brief lock, then VALIDATE separately under a weak lock. In every case one long blocking operation becomes a sequence of short ones, and the table stays writable throughout.',
        whyHi: 'Kई common DDL operations ek lock acquire karते hain jo writes, ya reads aur writes, block karता hai jab tak wo chalते hain, aur ek large table par wo ek outage hone ke liye kaafi lamba hai. Ek NOT NULL constraint aur ek non-constant default ke saath ek column add karna har row rewrite karता hai ek exclusive lock rakhते hue. Ek plain CREATE INDEX writes ke against poore build ke liye ek lock rakhता hai. Safe versions har ek ko ek fast, non-blocking part aur ek deferred heavy part mein decompose karते hain. Column nullable aur instant add hota hai, ek batched job ise backfill karता hai, aur NOT NULL ek NOT VALID check ke roop mein enforce hota hai ek separate VALIDATE ke saath. Index CONCURRENTLY ke saath build hota hai.',
      },
      {
        wrong: `# bundling a destructive migration with the code that stops using the column,
# and treating "rollback" as the recovery plan
# release: [ migration: DROP COLUMN legacy_price ] + [ code: stop reading legacy_price ]
# ...an unrelated bug in the same release forces a rollback.
#   kubectl rollout undo   -> code reverts to the version that READS legacy_price
#   ...but legacy_price is GONE. the reverted code now 500s on every request.
# you've turned a small code bug into a schema-mismatch outage with no clean way back.`,
        right: `# 1. a destructive migration is ITS OWN release, weeks AFTER the code stopped using the column
#      release N:   code stops reading/writing legacy_price   (column still there)
#      release N+1..N+k:  normal work; verify NOTHING touches the column (logs, BI, ETL)
#      release N+k:  migration: DROP COLUMN legacy_price   (own release, off-peak, BACKUP first)
#    -> now rolling back release N is safe: the column still exists.
# 2. "rollback" is not the recovery plan for data. if a migration/backfill corrupts data:
#      - forward fix: a NEW migration that corrects the values
#      - if unrecoverable: restore from the backup / PITR taken right before
#    code rollback (rollout undo) reverts CODE, never a migration.`,
        why: 'A code rollback with kubectl rollout undo is instant and lossless, but it only moves the application between versions; it does not touch the database. If a release bundles a destructive migration with the code that stops depending on the dropped column, and that release then has to be rolled back for any reason — an unrelated bug, a performance regression — the rollback restores the code that still expects the column while the column is already gone, so the reverted code fails on every request that touches it. A small, ordinary code problem has become a schema-mismatch outage with no straightforward recovery. The way to avoid this is to keep the destructive migration entirely separate from and much later than the code change: the code stops using the column in one release, several releases of normal work go by during which you confirm through logs and audits that nothing anywhere reads it, and only then, in a dedicated release run off-peak with a backup taken immediately before, is the column dropped. Rolling back any of the code releases in between is safe because the column is still present. And the recovery plan for a migration that damages data is never rollback — it is a forward fix, a new migration that corrects the values, with a restore from the pre-migration backup as the fallback when the damage cannot be corrected in place.',
        whyHi: 'kubectl rollout undo ke saath ek code rollback instant aur lossless hai, par ye sirf application ko versions ke beech move karता hai; ye database ko touch nahi karता. Agar ek release ek destructive migration ko us code ke saath bundle karता hai jo dropped column par depend karना band karता hai, aur us release ko phir kisi reason se roll back karना pade, rollback us code ko restore karता hai jo abhi bhi column expect karता hai jabki column already gaya hai. Ise avoid karने ka tarika destructive migration ko code change se poori tarah separate aur bahut baad rakhना hai. Aur data ko damage karने wali ek migration ka recovery plan kabhi rollback nahi hai — ye ek forward fix hai.',
      },
    ],

    realWorld: [
      {
        en: '**A 40-minute checkout outage from `CREATE INDEX`** — a migration added a plain (non-concurrent) index to a 60M-row `orders` table. Every `INSERT` blocked for the build. Switched all index migrations to `CONCURRENTLY` and added a CI lint that rejects `CREATE INDEX` without it.',
        hi: '**`CREATE INDEX` se ek 40-minute checkout outage** — ek migration ne ek 60M-row `orders` table par ek plain index add kiya. Har `INSERT` build ke liye block hua. Saare index migrations ko `CONCURRENTLY` par switch kiya.',
      },
      {
        en: '**A rollback that made the outage worse** — a release bundled `DROP COLUMN old_status` with the code that stopped reading it. An unrelated NPE forced a `rollout undo`; the reverted code read `old_status`, which was gone, and 500\'d everything. Now destructive migrations are a separate release, 2+ weeks after the code, with a backup.',
        hi: '**Ek rollback jisne outage worse kiya** — ek release ne `DROP COLUMN old_status` ko us code ke saath bundle kiya jo ise read karना band karता tha. Ab destructive migrations ek separate release hain.',
      },
      {
        en: '**A backfill `UPDATE` that ran for 3 hours and blocked vacuum** — a single `UPDATE users SET ...` over 20M rows held row locks and generated 40GB of WAL; replication fell 45 minutes behind. Rewritten as a batched job (`LIMIT 5000`, commit, sleep 100ms, watch lag); the same backfill took 90 min with no impact.',
        hi: '**Ek backfill `UPDATE` jo 3 ghante chala aur vacuum block kiya** — 20M rows par ek single `UPDATE`. Ek batched job ke roop mein rewrite kiya (`LIMIT 5000`, commit, sleep).',
      },
    ],

    interviewQA: [
      {
        q: 'What is the rule for database migrations in a continuous-delivery pipeline, and why?',
        qHi: 'Ek continuous-delivery pipeline mein database migrations ke liye rule kya hai, aur kyun?',
        a: 'The rule is that every migration must leave the database in a state that both the currently-running code and the next version of the code can use. The reason is timing and rollback. A migration runs at one moment and the code that depends on it deploys at another, and for a rolling update or a blue-green pair the two code versions overlap in time against the same database, so a migration that only the new code can tolerate breaks the old Pods. And a code rollback with kubectl rollout undo reverts the application but does not revert a migration, so a migration and its code cannot be rolled back as a unit — if the code is reverted, it must still work against the migrated schema. In practice this means additive-only changes: add nullable columns and new tables, never drop or rename in the same step as the code change. Run migrations before the deploy, as a distinct gated stage, so the old code sees a superset schema it ignores and the new code finds what it needs. Add constraints as NOT VALID and then VALIDATE in a separate statement so neither takes a long lock. Build indexes CONCURRENTLY. Do backfills as batched jobs, not single statements and not inside the migration. And decompose any non-backward-compatible change into an expand/contract sequence where each step is additive, with the one destructive step — the DROP — deferred to its own release weeks later, run off-peak with a backup, only after confirming nothing reads the old thing.',
        aHi: 'Rule ye hai ki har migration ko database ko ek aisी state mein chhodना chahiye jise dono currently-running code aur code ka agla version use kar sakें. Reason timing aur rollback hai. Ek migration ek moment par chalती hai aur wo code jo ispar depend karता hai doosre par deploy hota hai, aur ek rolling update ke liye do code versions same database ke against time mein overlap karते hain. Aur kubectl rollout undo ke saath ek code rollback application revert karता hai par ek migration revert nahi karता. Practice mein iska matlab additive-only changes: nullable columns aur new tables add karo, kabhi same step mein drop ya rename nahi. Migrations ko deploy se pehle chalाओ. Constraints ko NOT VALID phir VALIDATE ke roop mein add karo. Indexes CONCURRENTLY build karo. Backfills ko batched jobs ke roop mein karo. Aur kisi bhi non-backward-compatible change ko ek expand/contract sequence mein decompose karo.',
      },
      {
        q: 'Why is data "forward-only" and what does that mean for rollback and the DORA metrics?',
        qHi: 'Data "forward-only" kyun hai aur iska rollback aur DORA metrics ke liye kya matlab hai?',
        a: 'Code rollback is a clean operation: kubectl rollout undo moves the application back to a previous version, instantly and without losing anything. Data has no equivalent. A migration that overwrites values, or a backfill that computes them wrong, or a DROP, cannot be reversed by any "undo" — the schema-level part can sometimes be re-migrated back, but any data that was overwritten or deleted is gone unless it is restored from a backup. So for data, the recovery path is forward: if a migration or backfill damages data, you write a new migration that corrects the values and ship it through the pipeline, and only if the damage is genuinely unrecoverable do you fall back to restoring from a point-in-time-recovery target taken immediately before the bad migration. This is why destructive migrations are run as their own release, off-peak, with a fresh backup, and never bundled with a code change that might itself need rolling back. And it is why the DORA reliability metric is change failure rate together with time to restore service, not "rollback rate" — for a large class of changes, restoring service means rolling forward a fix, so what matters is that the pipeline is fast and reliable enough to ship that fix quickly, not just that a revert button exists.',
        aHi: 'Code rollback ek clean operation hai: kubectl rollout undo application ko ek previous version par wapas move karता hai, instantly aur bina kuch khoye. Data ka koi equivalent nahi hai. Ek migration jo values overwrite karती hai kisi bhi "undo" se reverse nahi ho sakti — schema-level part kभी-kभी re-migrate ho sakta hai, par jo bhi data overwrite ya delete kiya gaya wo gaya jab tak ise ek backup se restore na kiya jaaye. To data ke liye, recovery path forward hai: agar ek migration data damage karती hai, aap ek nayi migration likhते ho jo values correct karती hai. Isliye destructive migrations apna release hain. Aur isliye DORA reliability metric change failure rate together with time to restore service hai, "rollback rate" nahi.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, state the migration rule, the migrate-then-deploy ordering for additive changes, and why the reverse breaks.',
        taskHi: 'Ek comment mein, migration rule batao.',
        hint: 'THE RULE: every migration must leave the DB usable by BOTH the currently-running code AND the next version. WHY: (a) TIMING — the migration runs at one moment, the code that uses it deploys at another; for a rolling update / blue-green the two code versions OVERLAP against the SAME DB → a migration only the new code tolerates breaks the OLD pods. (b) ROLLBACK — `kubectl rollout undo` reverts the CODE but NOT a migration → a migration + its code can\'t be rolled back as a unit; if the code is reverted it must still work against the migrated schema. ORDERING for ADDITIVE, backward-compatible changes (new nullable column / new table / new nullable FK): MIGRATE-THEN-DEPLOY — (1) run the migration as a DISTINCT GATED pipeline stage that MUST succeed first; the OLD pods don\'t reference the new column → unaffected; (2) THEN roll out the code that uses it → the column is already there. WHY THE REVERSE BREAKS: deploy-then-migrate means the new pods start expecting a schema that doesn\'t exist yet → every request touching the new column fails `ERROR: column "x" does not exist` for the ~90s (or minutes) until the migration job finishes — and INDEFINITELY if the migration step fails. NON-ADDITIVE changes can\'t be fixed by ordering alone → expand/contract (Lesson 4), which decomposes into additive steps so migrate-then-deploy applies to each.',
        hintHi: 'THE RULE: har migration ko DB ko DONO currently-running code AUR agle version dwara usable chhodना chahiye. WHY: (a) TIMING — migration ek moment par, code doosre par; do code versions SAME DB ke against OVERLAP karते hain. (b) ROLLBACK — `kubectl rollout undo` CODE revert karता hai par migration NAHI. ORDERING ADDITIVE changes ke liye: MIGRATE-THEN-DEPLOY — (1) migration ek DISTINCT GATED stage ke roop mein pehle; OLD pods naye column ko reference nahi karते; (2) PHIR code roll out. REVERSE KYUN TODता hai: deploy-then-migrate matlab naye pods ek schema expect karके start hote hain jo abhi exist nahi karता → har request fail hoती hai.',
      },
      {
        task: 'In a comment, list the safe vs unsafe forms of ADD COLUMN, CREATE INDEX and ADD CONSTRAINT, and the NOT VALID → VALIDATE split.',
        taskHi: 'Ek comment mein, ADD COLUMN, CREATE INDEX aur ADD CONSTRAINT ke safe vs unsafe forms list karo.',
        hint: 'The difference between a safe migration and an OUTAGE = whether the op takes a LOCK blocking reads/writes, or REWRITES the table, while it runs (long on a big table). ADD COLUMN: SAFE — `ADD COLUMN foo text` (nullable, no default) = catalog-only, instant; modern PG: `ADD COLUMN foo text DEFAULT \'x\'` with a CONSTANT default is also instant. UNSAFE — `NOT NULL DEFAULT some_function()` / a volatile default / `NOT NULL` with no default on a non-empty table = FULL TABLE REWRITE under an ACCESS EXCLUSIVE lock. Do it: add nullable → batched backfill → `ALTER COLUMN SET DEFAULT` (new rows) → `NOT NULL` via the constraint split below. CREATE INDEX: UNSAFE — plain `CREATE INDEX` locks the table against WRITES for the ENTIRE build (minutes-hours on a big table). SAFE — `CREATE INDEX CONCURRENTLY` builds without a write lock (costs: slower, can\'t run inside a txn — tell the migration tool). ALWAYS use CONCURRENTLY on a live table. ADD CONSTRAINT (CHECK or FOREIGN KEY): UNSAFE — `ADD CONSTRAINT ...` scans the WHOLE table to verify existing rows, holding a lock during the scan. SAFE — TWO STEPS: (1) `ADD CONSTRAINT ... NOT VALID` — skips the scan, applies to new/modified rows immediately, brief lock; (2) SEPARATE statement (usually a separate migration): `VALIDATE CONSTRAINT ...` — does the scan under a MUCH WEAKER lock that does NOT block reads/writes. → one long blocking op becomes two short ones. DESTRUCTIVE (`DROP COLUMN`/`DROP TABLE`/`RENAME`/`ALTER COLUMN TYPE` which rewrites) — break old code immediately OR take a heavy lock → DEFER to a release well after the code stopped using the thing, via expand/contract.',
        hintHi: 'Safe migration vs OUTAGE ka farak = op ek LOCK leता hai jo reads/writes block karता hai, ya table REWRITE karता hai. ADD COLUMN: SAFE — `ADD COLUMN foo text` (nullable, no default) instant; modern PG `DEFAULT \'x\'` constant bhi instant. UNSAFE — `NOT NULL DEFAULT some_function()` = FULL TABLE REWRITE. CREATE INDEX: UNSAFE — plain `CREATE INDEX` WRITES ke against poore build ke liye lock. SAFE — `CREATE INDEX CONCURRENTLY`. ADD CONSTRAINT: UNSAFE — `ADD CONSTRAINT` poori table scan karता hai. SAFE — DO STEPS: (1) `NOT VALID` (scan skip, brief lock); (2) SEPARATE `VALIDATE CONSTRAINT` (weak lock). DESTRUCTIVE — DEFER karo.',
      },
      {
        task: 'In a comment, explain why a backfill is a batched job not a single statement, and why data is "forward-only" (with the DORA connection).',
        taskHi: 'Ek comment mein, samjhao ki ek backfill ek batched job kyun hai.',
        hint: 'BACKFILL ≠ part of the migration, ≠ a single statement. A single `UPDATE users SET x = ...` over millions of rows = ONE ENORMOUS TRANSACTION: holds row locks for its ENTIRE duration, generates a huge amount of WAL (write-ahead log), BLOCKS vacuum, and CAN\'T be paused/resumed (fail at 90% → start over). Instead: a JOB that updates in BOUNDED BATCHES — `UPDATE ... WHERE id IN (SELECT id FROM users WHERE first_name IS NULL LIMIT 5000)` — repeat until it affects 0 rows; each batch is a SHORT txn; between batches the job COMMITS, optionally SLEEPS to throttle load, and checks REPLICATION LAG; it resumes naturally from where it stopped (the `WHERE ... IS NULL` predicate). Verify done: `count(*) WHERE first_name IS NULL` = 0. DATA IS FORWARD-ONLY: code rollback (`kubectl rollout undo`) is instant + lossless but only moves the APP between versions — it does NOT touch the DB. A migration that overwrites values / a backfill that computes them wrong / a `DROP` has NO "undo": the schema part can sometimes be re-migrated back, but overwritten/deleted DATA is GONE unless restored from a backup. So recovery is FORWARD: write a NEW migration that corrects the values + ship it; only if genuinely unrecoverable, restore from a PITR target taken immediately BEFORE the bad migration. Hence: destructive migrations = their OWN release, off-peak, with a fresh backup, NEVER bundled with a code change that might itself need rolling back. THE DORA CONNECTION: the reliability metric is CHANGE FAILURE RATE + TIME TO RESTORE SERVICE, NOT "rollback rate" — for schema/data changes, restoring service often means rolling FORWARD a fix, so what matters is a pipeline fast + reliable enough to SHIP a fix quickly, not just that a revert button exists.',
        hintHi: 'BACKFILL ≠ migration ka part, ≠ ek single statement. Millions rows par ek single `UPDATE` = EK ENORMOUS TRANSACTION: row locks poore duration ke liye, huge WAL, vacuum BLOCK, pause/resume NAHI. Iske bajaay: ek JOB jo BOUNDED BATCHES mein update karता hai — `LIMIT 5000` — 0 rows tak repeat; har batch ek SHORT txn; batches ke beech COMMIT + SLEEP + replication LAG check. DATA FORWARD-ONLY: code rollback instant + lossless par sirf APP move karता hai — DB ko touch NAHI karता. Ek migration jo values overwrite karती hai ka koi "undo" nahi. Recovery FORWARD: ek NAYI migration jo values correct karती hai. THE DORA CONNECTION: metric CHANGE FAILURE RATE + TIME TO RESTORE hai, "rollback rate" NAHI.',
      },
    ],

    keyTakeaways: [
      'THE RULE: every migration must leave the DB usable by BOTH the currently-running code AND the next version. WHY: the migration and the code deploy at different moments and OVERLAP against the same DB (rolling update / blue-green); and `kubectl rollout undo` reverts the CODE but NOT a migration, so they can\'t roll back as a unit. ORDERING for ADDITIVE changes: MIGRATE-THEN-DEPLOY as a distinct GATED stage — the old pods ignore the new column, the new pods find it there. Deploy-then-migrate → the new pods 500 on every request touching the column until (and unless) the migration lands.',
      'SAFE vs UNSAFE (the line is: does it LOCK / REWRITE while it runs?): ADD COLUMN nullable-no-default = instant (constant DEFAULT also instant on modern PG); `NOT NULL DEFAULT func()` = full table rewrite under an exclusive lock. `CREATE INDEX` locks writes for the whole build → use `CREATE INDEX CONCURRENTLY` (slower, outside a txn). `ADD CONSTRAINT` scans the whole table under a lock → `ADD CONSTRAINT ... NOT VALID` (brief lock, applies to new rows) THEN a SEPARATE `VALIDATE CONSTRAINT` (weak lock, no block). `DROP`/`RENAME`/`ALTER COLUMN TYPE` break old code now or lock hard → DEFER.',
      'BACKFILL is a BATCHED JOB, not a single statement and not in the migration: one `UPDATE` over millions of rows = one giant transaction (row locks the whole time, huge WAL, blocks vacuum, can\'t resume). Instead: `UPDATE ... WHERE id IN (SELECT id ... WHERE new_col IS NULL LIMIT 5000)` — loop to 0 rows, commit between batches, throttle on replica lag, resumes via the `IS NULL` predicate. GATE: `count(*) WHERE new_col IS NULL` = 0 before the reader migration ships.',
      'EXPAND/CONTRACT FOR SCHEMA (Lesson 4), destructive step LAST: R1 `ADD COLUMN` nullable (code writes all, reads either) → R2 batched backfill + verify → R3 code reads new (writes both) → R4 code writes only new + `ADD CONSTRAINT NOT VALID` then `VALIDATE` → R5 (weeks later, its OWN release, off-peak, BACKUP first, only after confirming nothing reads it) `DROP COLUMN` + delete the dead code. At every step the DB works for that release and the one before it.',
      'DATA IS FORWARD-ONLY: `rollout undo` reverts CODE, never a migration; overwritten/deleted data is GONE unless restored. Recovery for a bad migration = a NEW migration that fixes it FORWARD (+ PITR/backup restore if unrecoverable). So a destructive migration is ITS OWN release, off-peak, with a fresh backup, NEVER bundled with the code that stops using the column (or a rollback of that code hits a schema that no longer matches). THE DORA CONNECTION: the metric is CHANGE FAILURE RATE + TIME TO RESTORE, not "rollback rate" — restoring often means rolling a fix FORWARD, so the pipeline must be fast enough to ship one.',
    ],
    keyTakeawaysHi: [
      'THE RULE: har migration ko DB ko DONO currently-running code AUR agle version dwara usable chhodना chahiye. WHY: migration aur code alag moments par deploy hote hain aur SAME DB ke against OVERLAP karते hain; aur `kubectl rollout undo` CODE revert karता hai par migration NAHI. ORDERING ADDITIVE changes ke liye: MIGRATE-THEN-DEPLOY ek distinct GATED stage ke roop mein. Deploy-then-migrate → naye pods har request par 500 karते hain.',
      'SAFE vs UNSAFE (line: kya ye LOCK/REWRITE karता hai jab chalता hai?): ADD COLUMN nullable-no-default = instant; `NOT NULL DEFAULT func()` = full table rewrite. `CREATE INDEX` writes lock karता hai → `CREATE INDEX CONCURRENTLY`. `ADD CONSTRAINT` poori table scan karता hai → `NOT VALID` PHIR ek SEPARATE `VALIDATE CONSTRAINT`. `DROP`/`RENAME` old code ko ab todते hain → DEFER karo.',
      'BACKFILL ek BATCHED JOB hai, ek single statement nahi: millions rows par ek `UPDATE` = ek giant transaction. Iske bajaay: `LIMIT 5000` — 0 rows tak loop, batches ke beech commit, replica lag par throttle. GATE: `count(*) WHERE new_col IS NULL` = 0.',
      'SCHEMA KE LIYE EXPAND/CONTRACT, destructive step LAST: R1 `ADD COLUMN` nullable → R2 batched backfill + verify → R3 code reads new → R4 code writes only new + `NOT VALID` then `VALIDATE` → R5 (weeks later, apna release, off-peak, BACKUP) `DROP COLUMN`.',
      'DATA FORWARD-ONLY: `rollout undo` CODE revert karता hai, kabhi ek migration nahi; overwritten/deleted data GAYA. Recovery = ek NAYI migration jo ise FORWARD fix karती hai. To ek destructive migration APNA release hai, off-peak, ek fresh backup ke saath, KABHI us code ke saath bundled nahi. THE DORA CONNECTION: metric CHANGE FAILURE RATE + TIME TO RESTORE hai, "rollback rate" NAHI.',
    ],
  },

  {
    slug: 'ops-health-gates-automated-rollback-and-release-safety',
    title: 'Health Gates, Automated Rollback & Release Safety',
    titleHi: 'Health Gates, Automated Rollback & Release Safety',
    description: 'A deploy is not finished when the Pods are Ready — it is finished when a smoke check confirms the service actually works. A health gate is that check wired into the pipeline; if it fails, the pipeline rolls back automatically. And for changes that touched data, rollback is not always possible, so the plan has to include rolling forward a fix.',
    descriptionHi: 'Ek deploy tab khatam nahi hota jab Pods Ready hain — ye tab khatam hota hai jab ek smoke check confirm karता hai ki service actually kaam karती hai. Ek health gate wo check hai jo pipeline mein wired hai; agar ye fail hota hai, pipeline automatically roll back karता hai. Aur data ko touch karne wale changes ke liye, rollback hamesha possible nahi hai, to plan mein ek fix forward roll karना include hona chahiye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Reopening a bridge after maintenance.** "The crew has left and the barriers are down" is not the same as "the bridge is safe to drive." Before you let traffic on, an inspection vehicle drives the full span at speed — the load test, the *smoke check*. Only if it comes back clean does the pipeline open the lanes. If the inspection vehicle finds a problem, the barriers go straight back up, automatically, no meeting — that is the *automated rollback*. And if the maintenance involved re-pouring part of the deck, "putting the barriers back up" does not un-pour the concrete: you cannot roll back a physical change, you can only bring in a crew to fix it forward. Deploys that only moved code roll back cleanly; deploys that changed data need a forward plan.',
      hi: '**Maintenance ke baad ek bridge reopen karna.** "Crew chala gaya aur barriers neeche hain" "bridge drive karने ke liye safe hai" ke same nahi hai. Aap traffic on karने se pehle, ek inspection vehicle full span ko speed par drive karता hai — load test, *smoke check*. Sirf agar ye clean wapas aata hai to pipeline lanes kholता hai. Agar inspection vehicle ek problem paता hai, barriers seedhे wapas up jaate hain, automatically, koi meeting nahi — wo *automated rollback* hai. Aur agar maintenance mein deck ka part re-pour karना shamil tha, "barriers wapas up karना" concrete un-pour nahi karता: aap ek physical change roll back nahi kar sakte, aap sirf ise forward fix karने ke liye ek crew la sakte ho.',
    },

    simple: `**"PODS READY" != "THE DEPLOY WORKED".** A HEALTH GATE is an explicit check after the
rollout, and its failure triggers an automatic rollback.

**WHAT \`kubectl rollout status\` CATCHES vs MISSES:**
\`\`\`
CATCHES   pods didn't start, image pull failed, readiness probe never passed,
          rollout stalled past progressDeadlineSeconds
MISSES    pods are Ready but the app returns 500s / wrong data / listens on the wrong port /
          can't reach its DB / a config key is missing / a downstream dependency is broken
\`\`\`
The readiness probe is shallow by design (fast, cheap). The health gate is the deep check.

**THE HEALTH GATE — a pipeline stage after deploy:**
\`\`\`
- deploy (rolling / canary / blue-green)
- WAIT for rollout to be available        (kubectl rollout status --timeout=...)
- SMOKE TEST                               (real requests: GET /healthz AND a real endpoint;
                                            create+read a test record; check a downstream call)
- SLO GATE (progressive delivery)          (error rate / p95 latency within bounds over N min)
- if any gate fails  ->  ROLL BACK, automatically, and alert
    kubectl rollout undo deploy/web        (or: Argo Rollouts auto-abort, or: flip blue-green back)
- if all pass  ->  the deploy is DONE. record it.
\`\`\`

**ROLLBACK vs ROLL-FORWARD:**
\`\`\`
ROLLBACK      revert to the last-good version. instant for CODE (rollout undo / selector flip /
              rollout abort). the default reaction to a bad deploy.
ROLL-FORWARD  ship a NEW fix through the pipeline. use when: rollback is impossible (a migration
              already ran, data changed), or rollback would lose in-flight work, or the bug is
              trivial and a fix is faster + safer than a revert.
FORWARD-ONLY FOR DATA  a migration/backfill can't be "undone" -> the recovery is a new migration
              + (if unrecoverable) a restore from the pre-change backup. (Lesson 5)
\`\`\`

**RELEASE SAFETY, the rest:**
\`\`\`
DEPLOYMENT FREEZE   pause deploys during a high-risk window (Black Friday, a launch, an
                    incident). automate it (a required "freeze" check) so it's not tribal knowledge.
DEPLOY OFF-PEAK / SLOW HOURS  for higher-risk changes - smaller blast radius, more time to react.
POST-DEPLOY VERIFICATION  the gate above, plus a human glance at dashboards for the first N min.
DORA (Module 1)    CHANGE FAILURE RATE (% of deploys causing a rollback/hotfix/incident) +
                   TIME TO RESTORE. small frequent deploys move BOTH the right way.
BLAMELESS on failure  a bad deploy that was caught by the gate and auto-rolled-back is the
                   system WORKING, not a person failing.
\`\`\``,

    simpleHi: `**"PODS READY" != "DEPLOY KAAM KIYA".** Ek HEALTH GATE rollout ke baad ek explicit check
hai, aur iska failure ek automatic rollback trigger karता hai.

**\`kubectl rollout status\` KYA CATCH karता hai vs MISS:**
\`\`\`
CATCHES   pods start nahi hue, image pull fail, readiness probe kabhi pass nahi hua,
          rollout progressDeadlineSeconds ke aage stall hua
MISSES    pods Ready hain par app 500s return karता hai / wrong data / wrong port par listen /
          apne DB tak nahi pahunch sakta / ek config key missing / ek downstream dependency broken
\`\`\`

**HEALTH GATE — deploy ke baad ek pipeline stage:**
\`\`\`
- deploy (rolling / canary / blue-green)
- rollout ke available hone ka WAIT karo    (kubectl rollout status --timeout=...)
- SMOKE TEST                                 (real requests; ek test record create+read karo)
- SLO GATE (progressive delivery)            (error rate / p95 latency N min ke dauraan bounds mein)
- agar koi gate fail hota hai  ->  automatically ROLL BACK karo, aur alert karo
    kubectl rollout undo deploy/web
- agar sab pass  ->  deploy DONE hai. ise record karo.
\`\`\`

**ROLLBACK vs ROLL-FORWARD:**
\`\`\`
ROLLBACK      last-good version par revert karo. CODE ke liye instant. bad deploy ki default reaction.
ROLL-FORWARD  pipeline ke through ek NAYA fix ship karo. use jab: rollback impossible hai (ek migration
              already chala, data changed), ya bug trivial hai.
DATA KE LIYE FORWARD-ONLY  ek migration/backfill "undo" nahi ho sakti -> recovery ek nayi migration hai.
\`\`\`

**RELEASE SAFETY, baaki:**
\`\`\`
DEPLOYMENT FREEZE   ek high-risk window ke dauraan deploys pause karo. ise automate karo.
DEPLOY OFF-PEAK     higher-risk changes ke liye - smaller blast radius, react karने ka zyada samay.
DORA (Module 1)    CHANGE FAILURE RATE + TIME TO RESTORE. chhote frequent deploys DONO ko sahi tarah move karते hain.
BLAMELESS on failure  ek bad deploy jo gate ne catch kiya aur auto-rolled-back system ka KAAM karna hai.
\`\`\``,

    content: `## The deploy is not done when the Pods are Ready

A rolling update completes, \`kubectl rollout status\` returns success, and the pipeline moves on. But "the Pods reached Ready" only means the readiness probe passed, and the readiness probe is deliberately shallow — it checks that the process is up and the port is listening, quickly and cheaply, so it can run every couple of seconds. It does not exercise the actual functionality. A deploy can pass \`rollout status\` and still be broken:

- The app is up but returns 500s because a config value is missing or wrong.
- The Pods listen on the wrong port, so the readiness probe (which the deploy controls) passes but the Service (which routes real traffic) cannot reach them.
- The new version cannot connect to its database, a cache, or a downstream service.
- The code is fine but a data migration it depended on did not run.
- The response is a 200 but the *content* is wrong — an empty list, a stale value, a broken serialization.

\`rollout status\` catches the failures that stop Pods from starting: image pull errors, crash loops, a readiness probe that never passes, a rollout that stalls past its \`progressDeadlineSeconds\`. Everything past "the process started" needs a deeper check.

## The health gate

A **health gate** is an explicit verification stage in the pipeline, after the deploy, whose failure triggers an automatic rollback. A typical sequence:

1. **Deploy** with the chosen strategy.
2. **Wait for availability** — \`kubectl rollout status --timeout\`, or the equivalent for a \`Rollout\`. This is the shallow check; it must pass first.
3. **Smoke test.** Make real requests against the deployed service through its real address: a health endpoint, and at least one endpoint that exercises a real code path — create a test record and read it back, call something that touches the database, check a downstream dependency. Assert on the status code *and* the content.
4. **SLO gate** (for progressive delivery). Over a bake window, check that the new version's error rate and latency percentiles are within agreed bounds, compared against the stable version (Lesson 3).
5. **On any gate failure, roll back automatically** and alert a human. For a Deployment that is \`kubectl rollout undo\`; for blue-green it is flipping the selector back; for Argo Rollouts the failed analysis triggers the abort itself.
6. **On all gates passing, the deploy is done** — record it as a deployment event.

The critical design point is that steps 3–5 are pipeline stages, not a person watching. The rollback is automatic, triggered by the gate, in seconds — not "someone notices in an hour and manually reverts."

## Rollback versus roll-forward

**Rollback** returns the system to the last known-good version. For a code-only change it is fast and clean: \`kubectl rollout undo\`, flip the blue-green pointer, or \`kubectl argo rollouts abort\`. It is the default reaction to a bad deploy because it is the fastest way back to a known state.

**Roll-forward** means shipping a *new* change through the pipeline to fix the problem, rather than reverting. You roll forward when:

- **Rollback is not possible.** A database migration ran and cannot be un-run without data loss; a message was consumed; an external system was called. The previous code version may no longer work against the current state.
- **Rollback would lose work.** Reverting would discard changes that are fine and only re-introduce the problem you are trying to escape.
- **The fix is trivial and faster than a revert.** A one-line correction shipped through a fast pipeline can be safer than reverting a large change and re-testing it.

For **data**, roll-forward is often the *only* option: a migration or backfill that wrote wrong values cannot be "rolled back"; the recovery is a new migration that corrects them, with a restore from a pre-change backup as the fallback when the damage is unrecoverable (Lesson 5). This is why a mature pipeline is optimised for shipping a fix quickly, not just for reverting.

## The rest of release safety

- **Deployment freezes.** During a known high-risk window — a major sales event, a product launch, an active incident — deploys are paused. This should be **automated**: a required status check that fails during the freeze, or a pipeline flag, so it is enforced rather than being tribal knowledge that someone forgets.
- **Deploy timing.** Higher-risk changes go out **off-peak or during slow hours**, when the blast radius of a problem is smaller and there is more time and attention to react. Routine low-risk changes can deploy any time — that is the point of making them low-risk.
- **Post-deploy verification.** The automated gate above, plus, for significant changes, a human keeping an eye on the dashboards for the first several minutes. The automation catches the clear failures fast; the human catches the ambiguous ones.
- **DORA metrics** (Module 1). **Change failure rate** — the percentage of deploys that result in a rollback, a hotfix, or an incident — and **time to restore service** are the two reliability metrics. Small, frequent, well-gated deploys improve both: each change is smaller so less can go wrong, and when something does the fix or revert is smaller and faster.
- **Blameless response.** A bad change that the health gate caught and automatically rolled back is the system **working as designed**. The postmortem is about why the gate did or did not catch it and how to make the next one safer, not about who wrote the code.`,

    contentHi: `## Deploy khatam nahi hota jab Pods Ready hain

Ek rolling update complete hota hai, \`kubectl rollout status\` success return karता hai, aur pipeline move on karती hai. Par "Pods Ready pahunche" ka matlab sirf readiness probe pass hua, aur readiness probe deliberately shallow hai — ye check karता hai ki process up hai aur port listening hai, quickly aur cheaply. Ye actual functionality exercise nahi karता. Ek deploy \`rollout status\` pass kar sakta hai aur abhi bhi broken ho sakta hai:
- App up hai par 500s return karता hai kyunki ek config value missing hai.
- Pods wrong port par listen karते hain, to readiness probe pass hota hai par Service unhe reach nahi kar sakta.
- Naya version apne database, ek cache, ya ek downstream service se connect nahi kar sakta.
- Response ek 200 hai par *content* wrong hai.

\`rollout status\` un failures ko catch karता hai jo Pods ko start hone se rokते hain. "Process started" ke aage sab kuch ek deeper check chahiye.

## Health gate

Ek **health gate** pipeline mein ek explicit verification stage hai, deploy ke baad, jiska failure ek automatic rollback trigger karता hai. Ek typical sequence:
1. **Deploy** chosen strategy ke saath.
2. **Availability ke liye wait karo** — \`kubectl rollout status --timeout\`. Ye shallow check hai.
3. **Smoke test.** Deployed service ke against iske real address ke through real requests karo: ek health endpoint, aur kam se kam ek endpoint jo ek real code path exercise karता hai. Status code *aur* content par assert karo.
4. **SLO gate** (progressive delivery ke liye).
5. **Kisi bhi gate failure par, automatically roll back karo** aur ek human ko alert karo.
6. **Saare gates pass hone par, deploy done hai.**

Critical design point ye hai ki steps 3-5 pipeline stages hain, ek person dekhते hue nahi.

## Rollback versus roll-forward

**Rollback** system ko last known-good version par wapas laता hai. Ek code-only change ke liye ye fast aur clean hai.

**Roll-forward** ka matlab problem fix karने ke liye pipeline ke through ek *naya* change ship karना hai. Aap roll forward karते ho jab: **rollback possible nahi hai** (ek database migration chali); **rollback work khoyेga**; **fix trivial hai**.

**Data** ke liye, roll-forward often *ekmatra* option hai: ek migration jo wrong values likhी "roll back" nahi ho sakti; recovery ek nayi migration hai (Lesson 5).

## Baaki release safety

- **Deployment freezes.** Ek known high-risk window ke dauraan deploys pause hote hain. Ye **automated** hona chahiye.
- **Deploy timing.** Higher-risk changes **off-peak** jaate hain.
- **Post-deploy verification.** Automated gate plus ek human jo pehle kई minutes dashboards par nazar rakhता hai.
- **DORA metrics** (Module 1). **Change failure rate** aur **time to restore service**. Chhote, frequent, well-gated deploys dono improve karते hain.
- **Blameless response.** Ek bad change jise health gate ne catch kiya aur automatically roll back kiya system ka **design ke roop mein kaam karna** hai.`,

    examples: [
      {
        title: 'A health gate: bad image stalls the rollout, the pipeline auto-runs rollout undo',
        titleHi: 'Ek health gate: bad image rollout stall karता hai, pipeline auto rollout undo chalाता hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l6-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

kubectl -n "$ns" create deployment web --image=nginx:1.27-alpine --replicas=3 >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null

# this is the PIPELINE's deploy step: set the image, then GATE on 'rollout status'
deploy_gated() {
  local img=$1
  kubectl -n "$ns" set image deploy/web nginx="$img" >/dev/null
  kubectl -n "$ns" patch deploy web --type=merge -p '{"spec":{"progressDeadlineSeconds":40}}' >/dev/null
  echo "  deploying $img"
  if kubectl -n "$ns" rollout status deploy/web --timeout=55s >/dev/null 2>&1; then
    echo "  health gate (kubectl rollout status): PASSED"
    return 0
  fi
  echo "  health gate: FAILED - rollout stalled past the deadline"
  echo "  -> pipeline auto-runs: kubectl rollout undo"
  kubectl -n "$ns" rollout undo deploy/web >/dev/null
  kubectl -n "$ns" rollout status deploy/web --timeout=55s >/dev/null
  return 1
}

echo "--- deploy a GOOD image ---"
deploy_gated nginx:1.28-alpine && echo "  promoted. live image = $(kubectl -n "$ns" get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}')"
echo "--- deploy a BAD image (tag does not exist) ---"
deploy_gated nginx:this-tag-does-not-exist-9999 || true
echo "  after auto-rollback: live image = $(kubectl -n "$ns" get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}')  ready=$(kubectl -n "$ns" get deploy web -o jsonpath='{.status.readyReplicas}')/3"`,
        output: `--- deploy a GOOD image ---
  deploying nginx:1.28-alpine
  health gate (kubectl rollout status): PASSED
  promoted. live image = nginx:1.28-alpine
--- deploy a BAD image (tag does not exist) ---
  deploying nginx:this-tag-does-not-exist-9999
  health gate: FAILED - rollout stalled past the deadline
  -> pipeline auto-runs: kubectl rollout undo
  after auto-rollback: live image = nginx:1.28-alpine  ready=3/3`,
        explain: 'The deploy step of a pipeline is modelled as a function that sets a new image and then gates on kubectl rollout status. The Deployment is given a short progress deadline so a stalled rollout is declared failed quickly. For a good image, the rollout completes within the deadline, rollout status returns success, the gate passes, and the pipeline records the new image as live. For a bad image whose tag does not exist, the new Pods sit in an image-pull error and never become Ready; the rollout does not progress, the progress deadline expires, and rollout status exits non-zero. The pipeline treats that as a failed health gate and immediately runs kubectl rollout undo, which scales the previous good ReplicaSet back to full and the broken new one to zero. After the undo completes, the live image is back to the previous version and all three Pods are Ready. The whole failure and recovery is automatic and takes about a minute — there is no human in the loop for the common case. This is the minimum health gate: the rollout-status check catches everything that stops Pods from starting. The next example shows why it is not sufficient on its own.',
        explainHi: 'Ek pipeline ka deploy step ek function ke roop mein model kiya gaya hai jo ek naya image set karता hai aur phir kubectl rollout status par gate karता hai. Deployment ko ek short progress deadline diya jaata hai. Ek good image ke liye, rollout deadline ke andar complete hota hai, gate pass hota hai. Ek bad image ke liye jiska tag exist nahi karता, naye Pods ek image-pull error mein baithते hain aur kabhi Ready nahi hote; progress deadline expire hota hai, aur rollout status non-zero exit karता hai. Pipeline ise ek failed health gate ke roop mein treat karता hai aur turant kubectl rollout undo chalाता hai. Undo ke complete hone ke baad, live image wapas previous version par hai aur saare teen Pods Ready hain. Poora failure aur recovery automatic hai.',
      },
      {
        title: 'The smoke gate catches what rollout status cannot: Pods Ready, but the Service returns nothing',
        titleHi: 'Smoke gate wo catch karता hai jo rollout status nahi kar sakta: Pods Ready, par Service kuch return nahi karता',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
ns="m11l6b-$$"; kubectl create namespace "$ns" >/dev/null
trap 'kubectl delete namespace "$ns" --wait=false >/dev/null 2>&1' EXIT

cat <<'YAML' | kubectl apply -n "$ns" -f - >/dev/null
apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers: [ { name: c, image: registry.k8s.io/e2e-test-images/agnhost:2.47, args: [ netexec, --http-port=8080 ] } ]
---
apiVersion: v1
kind: Service
metadata: { name: web }
spec: { selector: { app: web }, ports: [ { port: 80, targetPort: 8080 } ] }
YAML
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null

smoke() {  # the pipeline's SMOKE TEST: a real request through the Service. PASS only on a 2xx.
  kubectl -n "$ns" run s --image=busybox:1.36 --restart=Never --rm -i --quiet -- \\
    sh -c 'if wget -q -T 3 -O /dev/null http://web/ 2>/dev/null; then echo PASS; else echo FAIL; fi' 2>/dev/null | tr -d '[:space:]'
}
echo "v1:  kubectl rollout status = OK,  smoke test = $(smoke)"

echo "--- deploy v2 with a config bug: it listens on port 8081, not 8080 ---"
kubectl -n "$ns" patch deploy web --type=json -p '[{"op":"replace","path":"/spec/template/spec/containers/0/args","value":["netexec","--http-port=8081"]}]' >/dev/null
kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null && echo "  kubectl rollout status = OK   <- it PASSES: the Pods started fine and are Ready"
sc=$(smoke)
echo "  smoke test = $sc   <- the SMOKE GATE catches what 'rollout status' alone cannot"
if [ "$sc" = FAIL ]; then
  echo "  -> pipeline: smoke gate failed -> kubectl rollout undo"
  kubectl -n "$ns" rollout undo deploy/web >/dev/null
  kubectl -n "$ns" rollout status deploy/web --timeout=90s >/dev/null
  rec=FAIL; for i in $(seq 1 10); do [ "$(smoke)" = PASS ] && { rec=PASS; break; }; sleep 3; done
  echo "  recovered: smoke test = $rec"
fi`,
        output: `v1:  kubectl rollout status = OK,  smoke test = PASS
--- deploy v2 with a config bug: it listens on port 8081, not 8080 ---
  kubectl rollout status = OK   <- it PASSES: the Pods started fine and are Ready
  smoke test = FAIL   <- the SMOKE GATE catches what 'rollout status' alone cannot
  -> pipeline: smoke gate failed -> kubectl rollout undo
  recovered: smoke test = PASS`,
        explain: 'The Deployment is fronted by a Service that forwards port 80 to container port 8080. Version two is deployed with a configuration bug: the container is told to listen on 8081 instead of 8080. Nothing about that stops the Pods from starting — the process runs, so the Pods reach Ready, and kubectl rollout status reports the rollout as successfully completed. But the Service is still forwarding to 8080, where nothing is now listening, so a request through the Service gets a connection refused. The pipeline\'s smoke test, which makes a real request through the Service and only passes on a 2xx response, returns FAIL. This is a class of failure that the rollout-status check cannot see, because it only knows whether Pods started, not whether the service they compose actually works end to end. The pipeline treats the failed smoke gate exactly as it treated the failed rollout in the previous example — it runs kubectl rollout undo automatically — and after the rollback the smoke test passes again. The lesson is that a health gate needs both checks: rollout status to confirm the Pods came up, and a smoke test against the real service address to confirm the deploy is actually serving.',
        explainHi: 'Deployment ek Service dwara fronted hai jo port 80 ko container port 8080 par forward karता hai. Version two ek configuration bug ke saath deployed hai: container ko 8080 ke bajaay 8081 par listen karने ko kaha jaata hai. Us baare mein kuch bhi Pods ko start hone se nahi rokता — process run karता hai, to Pods Ready pahunchते hain, aur kubectl rollout status rollout ko successfully completed report karता hai. Par Service abhi bhi 8080 par forward kar raha hai, jahaan ab kuch listen nahi kar raha, to Service ke through ek request connection refused paती hai. Pipeline ka smoke test FAIL return karता hai. Ye ek class of failure hai jise rollout-status check nahi dekh sakta. Pipeline failed smoke gate ko exactly waise treat karता hai — ye kubectl rollout undo automatically chalाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# calling the deploy "done" when 'kubectl rollout status' succeeds
# pipeline: [deploy] -> [kubectl rollout status --timeout=300s] -> [mark released] -> DONE
# the readiness probe is  tcpSocket: { port: 8080 }  (just "is the port open").
# a bad config deploy: app starts, opens 8080, but every real request 500s.
# rollout status: SUCCESS. pipeline: DONE. users: getting 500s.
# nobody knows until support tickets pile up 20 minutes later.`,
        right: `# add a SMOKE stage after rollout status - real requests, assert status AND content:
# pipeline: [deploy] -> [rollout status] -> [SMOKE TEST] -> [SLO gate] -> [mark released]
#   smoke test (run as a Job / a step against the real Service URL):
#     - GET /healthz            -> expect 200 + {"status":"ok"}
#     - GET /api/widgets        -> expect 200 + a non-empty JSON array
#     - POST /api/widgets {...} -> expect 201; then GET it back -> expect the value you wrote
#     - a call that touches the DB, and one that hits a downstream dep
#   ANY failure -> kubectl rollout undo (automatically) + page on-call
# only after the smoke stage passes is the deploy "done".`,
        why: 'A readiness probe is intentionally shallow so that it is cheap enough to run every few seconds: it typically checks that a TCP port is open or that a lightweight health endpoint returns 200, which confirms the process started and is listening but nothing about whether the service actually functions. \`kubectl rollout status\` reports success once the desired number of Pods have passed that probe, so a deploy where the application starts, opens its port, and then fails every real request — because a configuration value is wrong, a dependency is unreachable, a migration did not run — passes \`rollout status\` and is marked released while it is serving errors to users. The gap is only discovered when someone notices the error rate or support tickets accumulate, which can be many minutes. Closing it requires an explicit smoke-test stage after the rollout check: a set of real requests against the service\'s actual address that exercise real code paths — a functional endpoint, a write followed by a read-back, a call that touches the database, a call to a downstream dependency — asserting on both the status code and the response content, run as a pipeline stage whose failure automatically triggers a rollback. The deploy is not "done" until that stage passes.',
        whyHi: 'Ek readiness probe intentionally shallow hai taaki ye har kuch seconds chalाने ke liye kaafi cheap ho: ye typically check karता hai ki ek TCP port open hai ya ek lightweight health endpoint 200 return karता hai. \`kubectl rollout status\` success report karता hai jab desired number of Pods ne wo probe pass kiya, to ek deploy jahaan application start hoती hai, apna port kholती hai, aur phir har real request fail karती hai \`rollout status\` pass karता hai aur released mark hota hai jabki ye users ko errors serve kar raha hai. Ise band karने ke liye rollout check ke baad ek explicit smoke-test stage chahiye: service ke actual address ke against real requests ka ek set jo real code paths exercise karता hai.',
      },
      {
        wrong: `# a health gate with no automatic action - it just alerts
# pipeline: [deploy] -> [smoke test] -> if FAIL: send a Slack message. that's it.
# 2am: smoke test fails, Slack fires. on-call is asleep for 25 minutes. then wakes up,
# reads the alert, VPNs in, figures out which service, runs 'kubectl rollout undo' by hand.
# the bad version served users for ~35 minutes. the gate DETECTED it in 90 seconds.`,
        right: `# the gate must ACT, not just notify. detection and remediation are both automated:
# pipeline: [deploy] -> [smoke test] -> if FAIL:
#     1. kubectl rollout undo deploy/web        (AUTOMATIC - the gate does this)
#     2. wait for the rollback to be healthy + re-run the smoke test to confirm recovery
#     3. THEN page on-call with: "auto-rolled-back release X of service Y, gate Z failed, here's the diff"
#   -> the bad version served for ~90s, not 35 min. the human investigates a recovered system.
# (Argo Rollouts / Flagger do the abort automatically on analysis failure - same principle.)`,
        why: 'Detecting a bad deploy quickly is only half the value; the other half is acting on that detection just as quickly, and a gate that only sends an alert leaves the acting to a human who may be asleep, on another task, or slow to orient. The time between the alert firing and the human completing a manual rollback — waking up, reading the alert, connecting, identifying the affected service, running the command, confirming — is often far longer than the detection took, and the bad version serves users for that entire span. The correct design makes remediation automatic too: when the gate fails, the pipeline itself runs the rollback, waits for the reverted version to become healthy, re-runs the smoke test to confirm the system has actually recovered, and only then pages a human, who arrives to investigate a system that is already back to a good state rather than one that is actively broken. Progressive-delivery controllers implement exactly this — a failed analysis triggers the abort without a human — and the same principle applies to a hand-built pipeline: the gate must both detect and remediate, with the human notification coming after the automatic recovery, not instead of it.',
        whyHi: 'Ek bad deploy ko jaldi detect karना value ka sirf aadha hai; doosra aadha us detection par utni hi jaldi act karना hai, aur ek gate jo sirf ek alert bhejता hai acting ko ek human ke liye chhodता hai jo so raha ho sakta hai. Alert firing aur human ke ek manual rollback complete karने ke beech ka samay often detection se kaafi lamba hota hai, aur bad version us poore span ke liye users ko serve karता hai. Correct design remediation ko bhi automatic banाता hai: jab gate fail hota hai, pipeline khud rollback chalाता hai, reverted version ke healthy hone ka wait karता hai, recovery confirm karने ke liye smoke test re-run karता hai, aur sirf phir ek human ko page karता hai.',
      },
      {
        wrong: `# bundling a migration into the release, then trying to "roll back" when the code breaks
# release: migration adds 'orders.discount_cents' + backfills it +
#          code that reads/writes discount_cents
# the code has a bug (unrelated to the schema). on-call runs 'kubectl rollout undo'.
# ...but the reverted code doesn't know about discount_cents, and the backfill overwrote
# the old 'discount' column's values with a bad conversion. rollback doesn't fix the data.
# now you have: old code + half-migrated schema + corrupted discount data. worse than before.`,
        right: `# separate the code from the data change; know that data is FORWARD-ONLY:
#   - the SCHEMA migration is additive + backward-compatible (Lesson 5): old code tolerates it
#   - the BACKFILL is a separate job, verified, and does NOT overwrite the old column
#   - the CODE change is its own release; 'rollout undo' on it is safe because the schema
//     is a superset the old code ignores
#   - if a migration/backfill corrupted data: the fix is a NEW migration that repairs it
//     forward (+ restore from the pre-migration backup if unrecoverable). NOT 'rollout undo'.
# destructive schema steps (DROP) come weeks later, in their own release, off-peak, backup first.`,
        why: 'Code rollback and data rollback are fundamentally different operations. \`kubectl rollout undo\` cleanly moves the application between versions and loses nothing, but it does not and cannot touch the database. When a release bundles a schema migration and a backfill with the code that uses them, and the code has a bug, running a code rollback reverts the application to a version that does not understand the new schema, while the schema is still changed and any data the backfill overwrote is still overwritten. The result is a mismatch — old code against a partly-migrated schema, possibly with corrupted data from the backfill — that is worse than the original bug and has no clean recovery. The way to keep rollback viable is to separate the concerns: the schema migration is additive and backward-compatible so the old code tolerates it, the backfill is a separate verified job that does not destroy the old values, and the code change is its own release that can be rolled back safely against the superset schema. And the recovery plan for data that a migration or backfill actually corrupted is not rollback at all — it is a forward fix, a new migration that repairs the values, with a restore from the backup taken before the migration as the last resort. Destructive schema changes are deferred to their own much later release.',
        whyHi: 'Code rollback aur data rollback fundamentally alag operations hain. \`kubectl rollout undo\` cleanly application ko versions ke beech move karता hai aur kuch nahi khoता, par ye database ko touch nahi karता aur nahi kar sakता. Jab ek release ek schema migration aur ek backfill ko us code ke saath bundle karता hai jo unhe use karता hai, aur code mein ek bug hai, ek code rollback chalाना application ko ek version par revert karता hai jo naye schema ko nahi samajhता, jabki schema abhi bhi changed hai. Result ek mismatch hai — old code against ek partly-migrated schema — jo original bug se worse hai. Rollback ko viable rakhने ka tarika concerns ko separate karना hai. Aur data ka recovery plan jo ek migration ne corrupt kiya rollback bilkul nahi hai — ye ek forward fix hai.',
      },
    ],

    realWorld: [
      {
        en: '**A config typo served 500s for 22 minutes** — the deploy passed `kubectl rollout status` (readiness was `tcpSocket`), and the pipeline marked it released. No smoke test. Added a post-deploy smoke Job hitting 4 real endpoints + a DB write/read; the next bad config deploy auto-rolled back in 80 seconds.',
        hi: '**Ek config typo ne 22 minute 500s serve kiye** — deploy ne `kubectl rollout status` pass kiya. Koi smoke test nahi. Ek post-deploy smoke Job add kiya.',
      },
      {
        en: '**A health gate that only Slacked** — smoke failed at 3am, alert fired, on-call took 30 min to wake, orient, VPN, and `rollout undo` by hand. The gate detected it in 90s. Changed the gate to run `rollout undo` itself, then re-verify, then page "already rolled back, here\'s the diff."',
        hi: '**Ek health gate jo sirf Slack karता tha** — smoke 3am par fail hua, on-call ko 30 min lage. Gate ko khud `rollout undo` chalाने ke liye badla.',
      },
      {
        en: '**A rollback that corrupted a column** — a release bundled a backfill that rewrote `discount` in place + code with an unrelated bug. `rollout undo` reverted the code but not the bad backfill; old code + corrupted data was worse than the bug. Now: additive migrations only, backfills never overwrite, migrations are separate releases, data recovery is forward-only.',
        hi: '**Ek rollback jisne ek column corrupt kiya** — ek release ne ek backfill bundle kiya jisne `discount` ko in place rewrite kiya + unrelated bug wala code. `rollout undo` ne code revert kiya par bad backfill nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is "kubectl rollout status succeeded" not enough to call a deploy done, and what does a health gate add?',
        qHi: '"kubectl rollout status succeeded" ek deploy ko done kehने ke liye kaafi kyun nahi hai?',
        a: 'kubectl rollout status reports success once the desired number of Pods have passed their readiness probe, and the readiness probe is deliberately shallow — a TCP port check or a lightweight health endpoint — because it runs every couple of seconds and has to be cheap. It confirms the process started and is listening, and nothing more. A deploy can pass it and still be broken: the app returns 500s because a config value is wrong, the Pods listen on the wrong port so the Service can\'t route to them, the new version can\'t reach its database or a downstream dependency, a required migration did not run, or the responses are 200 but the content is wrong. rollout status catches the failures that prevent Pods from starting — image pull errors, crash loops, a stalled rollout past its progress deadline — but not functional failures past that point. A health gate closes the gap with an explicit verification stage after the rollout check: a smoke test that makes real requests against the service\'s actual address and asserts on status and content — a functional endpoint, a write then a read-back, a call that touches the database, a downstream call — and, for progressive delivery, an SLO gate comparing error rate and latency against the stable version over a bake window. Crucially, the gate\'s failure automatically triggers a rollback and then pages a human, rather than just alerting; the deploy is only done when every gate has passed.',
        aHi: 'kubectl rollout status success report karता hai jab desired number of Pods ne apna readiness probe pass kiya, aur readiness probe deliberately shallow hai — ek TCP port check ya ek lightweight health endpoint. Ye confirm karता hai ki process start hua aur listening hai, aur kuch nahi. Ek deploy ise pass kar sakta hai aur abhi bhi broken ho sakता hai: app 500s return karता hai, Pods wrong port par listen karते hain, naya version apne database tak nahi pahunch sakта. Ek health gate gap ko rollout check ke baad ek explicit verification stage se band karता hai: ek smoke test jo service ke actual address ke against real requests karता hai aur status aur content par assert karता hai. Crucially, gate ka failure automatically ek rollback trigger karता hai.',
      },
      {
        q: 'When do you roll forward instead of rolling back?',
        qHi: 'Aap roll back karने ke bajaay roll forward kab karते ho?',
        a: 'Rollback returns the system to the last known-good version and for a code-only change it is fast and clean, so it is the default. You roll forward — ship a new fix through the pipeline instead of reverting — in three situations. First, when rollback is not possible: a database migration ran and cannot be un-run without losing data, a message was already consumed, an external system was already called, so the previous code version may no longer work against the current state. Second, when rollback would lose work: reverting would discard changes that are fine and only re-introduce the problem. Third, when the fix is trivial and faster than a revert: a one-line correction through a fast pipeline can be lower-risk than reverting a large change and re-testing it. For data specifically, roll-forward is often the only option, because a migration or backfill that wrote wrong values cannot be rolled back — the recovery is a new migration that corrects them, with a restore from a pre-change backup as the fallback when the damage is unrecoverable. This is why destructive migrations are run as their own release separate from the code, and why a mature pipeline is optimised for shipping a fix quickly, not just for having a revert button. The DORA metric reflects this: it is time to restore service, and for many changes restoring means rolling forward.',
        aHi: 'Rollback system ko last known-good version par wapas laता hai aur ek code-only change ke liye ye fast aur clean hai, to ye default hai. Aap roll forward karते ho — revert karने ke bajaay pipeline ke through ek naya fix ship karते ho — teen situations mein. Pehle, jab rollback possible nahi hai: ek database migration chali aur data khoye bina un-run nahi ho sakti. Doosre, jab rollback work khoyेga. Teesre, jab fix trivial hai aur ek revert se fast hai. Data ke liye specifically, roll-forward often ekmatra option hai, kyunki ek migration jo wrong values likhी roll back nahi ho sakti — recovery ek nayi migration hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list what `kubectl rollout status` catches vs misses, and the stages of a health gate that ends in an automatic rollback.',
        taskHi: 'Ek comment mein, list karo ki `kubectl rollout status` kya catch karता hai vs miss.',
        hint: '"PODS READY" != "THE DEPLOY WORKED". The readiness probe is deliberately SHALLOW (a TCP port check / a lightweight `/healthz`) — cheap enough to run every ~2s; it only confirms the process started + is listening. `kubectl rollout status` = success once the desired Pod count passed that probe. CATCHES: Pods didn\'t start, image pull failed, crash loop, readiness probe never passed, rollout stalled past `progressDeadlineSeconds`. MISSES: Pods are Ready but the app 500s (bad config / missing key), listens on the WRONG PORT (probe passes, Service can\'t route), can\'t reach its DB / cache / a downstream dep, a required migration didn\'t run, or the response is 200 but the CONTENT is wrong (empty list / stale value / broken serialization). THE HEALTH GATE (pipeline stages AFTER deploy): (1) deploy (rolling/canary/blue-green); (2) WAIT for availability — `kubectl rollout status --timeout` (the shallow check, must pass first); (3) SMOKE TEST — real requests through the REAL Service address: a functional endpoint, a WRITE then a READ-BACK, a call that touches the DB, a downstream call — assert on status code AND content; (4) SLO GATE (progressive delivery) — error rate / p95 latency within bounds vs stable over a bake window (Lesson 3); (5) ON ANY GATE FAILURE → ROLL BACK AUTOMATICALLY (`kubectl rollout undo` / flip the blue-green selector / Argo Rollouts auto-abort), wait for the rollback to be healthy, RE-RUN the smoke test to confirm recovery, THEN page on-call ("already rolled back, here\'s the diff"); (6) ALL PASS → the deploy is DONE, record it as a deployment event. The gate must ACT, not just alert — detection AND remediation are both automated; the human arrives to a recovered system.',
        hintHi: '"PODS READY" != "DEPLOY KAAM KIYA". Readiness probe deliberately SHALLOW hai. `kubectl rollout status` = success jab desired Pod count ne wo probe pass kiya. CATCHES: Pods start nahi hue, image pull fail, crash loop, rollout `progressDeadlineSeconds` ke aage stall. MISSES: Pods Ready hain par app 500s / WRONG PORT par listen / DB tak nahi pahunch sakта / ek migration nahi chali / content wrong hai. HEALTH GATE: (1) deploy; (2) `kubectl rollout status --timeout` WAIT; (3) SMOKE TEST — REAL address ke through real requests, status AUR content par assert; (4) SLO GATE; (5) KISI BHI FAILURE par AUTOMATICALLY ROLL BACK, recovery confirm karo, PHIR page karo; (6) SAB PASS → DONE. Gate ko ACT karना chahiye, sirf alert nahi.',
      },
      {
        task: 'In a comment, contrast rollback and roll-forward, give the three cases for rolling forward, and explain "forward-only for data".',
        taskHi: 'Ek comment mein, rollback aur roll-forward ka contrast karo.',
        hint: 'ROLLBACK = revert to the last known-good version. For a CODE-ONLY change it\'s fast + clean: `kubectl rollout undo` / flip the blue-green pointer / `kubectl argo rollouts abort`. It\'s the DEFAULT reaction to a bad deploy — the fastest way back to a known state. ROLL-FORWARD = ship a NEW fix through the pipeline instead of reverting. THREE CASES: (1) ROLLBACK IS NOT POSSIBLE — a DB migration ran and can\'t be un-run without data loss, a message was consumed, an external system was called → the previous code version may no longer work against the current state. (2) ROLLBACK WOULD LOSE WORK — reverting discards changes that are fine and only re-introduces the problem you\'re escaping. (3) THE FIX IS TRIVIAL + FASTER — a one-line correction through a fast pipeline is lower-risk than reverting a large change and re-testing it. FORWARD-ONLY FOR DATA: `kubectl rollout undo` reverts the APP between versions instantly + losslessly but does NOT and CANNOT touch the DB. A migration that overwrote values / a backfill that computed them wrong / a `DROP` has NO "undo" — the schema part can sometimes be re-migrated back, but overwritten/deleted DATA is GONE unless restored. Recovery = a NEW migration that repairs the values forward + (if genuinely unrecoverable) a restore from a PITR/backup target taken immediately BEFORE the bad migration. HENCE: a destructive migration is its OWN release, off-peak, backup first, NEVER bundled with the code that stops using the column (or a rollback of that code hits a schema/data that no longer matches → old code + half-migrated schema + corrupted data = worse than the bug). THE DORA CONNECTION: the metric is TIME TO RESTORE SERVICE, not "rollback rate" — for many changes restoring means rolling a fix FORWARD, so the pipeline must be fast + reliable enough to ship one.',
        hintHi: 'ROLLBACK = last known-good version par revert. CODE-ONLY change ke liye fast + clean: `kubectl rollout undo`. DEFAULT reaction. ROLL-FORWARD = revert ke bajaay pipeline ke through ek NAYA fix ship karo. TEEN CASES: (1) ROLLBACK POSSIBLE NAHI — ek DB migration chali; (2) ROLLBACK WORK KHOYेGA; (3) FIX TRIVIAL + FASTER. FORWARD-ONLY FOR DATA: `kubectl rollout undo` APP revert karता hai par DB ko touch NAHI karता. Ek migration jo values overwrite karती hai ka koi "undo" nahi. Recovery = ek NAYI migration jo forward repair karती hai. HENCE: ek destructive migration APNA release hai, KABHI us code ke saath bundled nahi. THE DORA CONNECTION: metric TIME TO RESTORE hai.',
      },
      {
        task: 'In a comment, describe the rest of release safety: deployment freezes, deploy timing, post-deploy verification, the DORA metrics, and blameless response.',
        taskHi: 'Ek comment mein, baaki release safety describe karo.',
        hint: 'DEPLOYMENT FREEZE — pause deploys during a KNOWN high-risk window (a major sales event / a launch / an ACTIVE incident). AUTOMATE it: a required status check that FAILS during the freeze, or a pipeline flag → enforced, not tribal knowledge someone forgets. DEPLOY TIMING — higher-risk changes go OFF-PEAK / slow hours (smaller blast radius, more time + attention to react); routine low-risk changes deploy ANY time (that\'s the point of making them low-risk). POST-DEPLOY VERIFICATION — the automated health gate (above), PLUS for significant changes a human keeping an eye on dashboards for the first several minutes (automation catches the CLEAR failures fast; the human catches the AMBIGUOUS ones). DORA METRICS (Module 1): the two reliability metrics are CHANGE FAILURE RATE (% of deploys that cause a rollback / hotfix / incident) + TIME TO RESTORE SERVICE. Small, frequent, well-gated deploys improve BOTH — each change is smaller so less can go wrong, and when something does the fix/revert is smaller + faster. BLAMELESS RESPONSE — a bad change that the health gate CAUGHT and AUTO-ROLLED-BACK is the system WORKING AS DESIGNED, not a person failing. The postmortem asks why the gate did/didn\'t catch it and how to make the next one safer — NOT who wrote the code. (This is the culture half of Module 1\'s CALMS / DORA — the whole module\'s point: automate the path from commit to production, make every step observable AND reversible, and treat a caught-and-recovered failure as success.)',
        hintHi: 'DEPLOYMENT FREEZE — ek KNOWN high-risk window ke dauraan deploys pause karo. AUTOMATE karo: ek required status check jo freeze ke dauraan FAIL hota hai → enforced, tribal knowledge nahi. DEPLOY TIMING — higher-risk changes OFF-PEAK; routine low-risk KISI BHI time. POST-DEPLOY VERIFICATION — automated health gate PLUS ek human jo pehle kई minutes dashboards par nazar rakhता hai. DORA METRICS: CHANGE FAILURE RATE + TIME TO RESTORE SERVICE. Chhote, frequent, well-gated deploys DONO improve karते hain. BLAMELESS RESPONSE — ek bad change jise health gate ne CAUGHT kiya aur AUTO-ROLLED-BACK system ka DESIGN KE ROOP MEIN KAAM KARNA hai.',
      },
    ],

    keyTakeaways: [
      '"PODS READY" != "THE DEPLOY WORKED". The readiness probe is deliberately SHALLOW (a port check / a light `/healthz`) so it can run every ~2s. `kubectl rollout status` CATCHES: Pods not starting, image pull errors, crash loops, a rollout stalled past `progressDeadlineSeconds`. It MISSES: Pods Ready but the app 500s (bad config), listens on the wrong port (probe passes, Service can\'t route), can\'t reach its DB / a downstream dep, a required migration didn\'t run, or a 200 with wrong content.',
      'A HEALTH GATE is a pipeline stage AFTER the deploy: (1) `kubectl rollout status --timeout` (the shallow check, first); (2) SMOKE TEST — real requests through the REAL Service address, a functional endpoint + a write-then-read-back + a DB-touching call + a downstream call, asserting on status AND content; (3) SLO GATE (progressive delivery — error rate / p95 vs stable over a bake window). ON FAILURE the gate must ACT, not just alert: run the rollback AUTOMATICALLY, wait for it to be healthy, RE-RUN the smoke test to confirm recovery, THEN page on-call. The deploy is DONE only when every gate passes.',
      'ROLLBACK (revert to last-good — instant + clean for CODE: `rollout undo` / blue-green selector flip / `argo rollouts abort`) is the default. ROLL-FORWARD (ship a NEW fix through the pipeline) when: rollback is impossible (a migration ran, a message was consumed), rollback would lose work, or the fix is trivial + faster than a revert.',
      'FORWARD-ONLY FOR DATA: `rollout undo` reverts the APP between versions but does NOT touch the DB. A migration/backfill that wrote wrong values or a `DROP` has NO "undo" — overwritten/deleted data is GONE unless restored. Recovery = a NEW migration that repairs it forward (+ a PITR/backup restore if unrecoverable). So a destructive migration is its OWN release, off-peak, backup first, NEVER bundled with the code that stops using the column — else a rollback of that code hits old-code + half-migrated schema + corrupted data, worse than the bug.',
      'RELEASE SAFETY, the rest: DEPLOYMENT FREEZES during known high-risk windows, AUTOMATED (a required check, not tribal knowledge); higher-risk changes deploy OFF-PEAK; POST-DEPLOY VERIFICATION = the automated gate + a human on the dashboards for significant changes. DORA (Module 1): CHANGE FAILURE RATE + TIME TO RESTORE SERVICE — small, frequent, well-gated deploys move BOTH the right way (less can break; the fix/revert is smaller). BLAMELESS: a bad change the gate CAUGHT and AUTO-ROLLED-BACK is the system WORKING — the postmortem is about the gate, not the author.',
    ],
    keyTakeawaysHi: [
      '"PODS READY" != "DEPLOY KAAM KIYA". Readiness probe deliberately SHALLOW hai. `kubectl rollout status` CATCHES: Pods start nahi hue, image pull errors, crash loops, rollout stall. MISSES: Pods Ready par app 500s (bad config), wrong port par listen, DB tak nahi pahunch sakта, ek migration nahi chali, ya 200 with wrong content.',
      'Ek HEALTH GATE deploy ke BAAD ek pipeline stage hai: (1) `kubectl rollout status --timeout`; (2) SMOKE TEST — REAL Service address ke through real requests, status AUR content par assert; (3) SLO GATE. FAILURE par gate ko ACT karना chahiye, sirf alert nahi: rollback AUTOMATICALLY chalाओ, recovery confirm karo, PHIR page karo. Deploy DONE tabhi jab har gate pass hota hai.',
      'ROLLBACK (last-good par revert — CODE ke liye instant + clean) default hai. ROLL-FORWARD (pipeline ke through ek NAYA fix ship karo) jab: rollback impossible hai (ek migration chali), rollback work khoyेga, ya fix trivial + faster hai.',
      'FORWARD-ONLY FOR DATA: `rollout undo` APP revert karता hai par DB ko touch NAHI karता. Ek migration jo wrong values likhी ka koi "undo" nahi. Recovery = ek NAYI migration jo forward repair karती hai. To ek destructive migration APNA release hai, KABHI us code ke saath bundled nahi.',
      'RELEASE SAFETY, baaki: DEPLOYMENT FREEZES known high-risk windows ke dauraan, AUTOMATED; higher-risk changes OFF-PEAK deploy hote hain; POST-DEPLOY VERIFICATION = automated gate + ek human. DORA: CHANGE FAILURE RATE + TIME TO RESTORE SERVICE — chhote, frequent, well-gated deploys DONO ko sahi tarah move karते hain. BLAMELESS: ek bad change jise gate ne CAUGHT kiya aur AUTO-ROLLED-BACK system ka KAAM KARNA hai.',
    ],
  },
];
