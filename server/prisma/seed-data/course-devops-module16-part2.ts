import type { CourseLesson } from './course-js-module1';

// DevOps Module 16 — The Monitoring & Alerting Stack (part 2 of 2). L1-3 in course-devops-module16.ts.
// `# VERIFY` examples run against REAL tools, offline:
//   amtool v0.28.1         - `check-config`, `config routes test`
//   otelcol-contrib v0.160 - `validate`
// Grafana (L5) is prose (dashboard JSON is not meaningfully verifiable offline).

export const DEVOPS_MODULE_16_PART2: CourseLesson[] = [
  {
    slug: 'ops-alertmanager-routing-grouping-inhibition-silences',
    title: 'Alertmanager: Routing, Grouping, Inhibition & Silences',
    titleHi: 'Alertmanager: Routing, Grouping, Inhibition Aur Silences',
    description:
      'Prometheus decides what is wrong; Alertmanager decides who hears about it and how. This lesson covers the routing tree that maps an alert\'s labels to a receiver, grouping that bundles related alerts into one notification, the timing knobs (group_wait, group_interval, repeat_interval), inhibition that suppresses a symptom alert while its cause is firing, silences for planned work, and validating routing offline with amtool.',
    descriptionHi:
      'Prometheus decide karता hai kya galat hai; Alertmanager decide karता hai kaun iske baare mein sunता hai aur kaise. Ye lesson routing tree cover karता hai jo ek alert ke labels ko ek receiver se map karता hai, grouping jo related alerts ko ek notification mein bundle karता hai, timing knobs (group_wait, group_interval, repeat_interval), inhibition jo ek symptom alert ko suppress karता hai jab iska cause firing hai, planned work ke liye silences, aur amtool ke saath routing ko offline validate karना.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A hospital switchboard.** Every incoming call (alert) is routed by a decision tree: a "code blue" goes straight to the crash team\'s pagers, a "supplies low" goes to the ward clerk\'s ticket queue. Calls about the same patient in the same minute are bundled into one page rather than fifty (grouping), and the operator waits a few seconds before sending in case more come in about the same event (group_wait). If the whole east wing has lost power, the switchboard stops forwarding the hundred individual "monitor offline" calls from that wing, because the power outage call already went out and covers them (inhibition). And when a ward is scheduled for maintenance, the operator is told in advance to hold all its calls for that window (a silence).',
      hi: '**Ek hospital switchboard.** Har incoming call (alert) ek decision tree se routed hai: ek "code blue" seedhे crash team ke pagers par jaता hai, ek "supplies low" ward clerk ke ticket queue par jaता hai. Same patient ke baare mein same minute mein calls ek page mein bundle kiye jaते hain pachas ke bajaay (grouping), aur operator send karने se pehle kuch second wait karता hai in case more aayें same event ke baare mein (group_wait). Agar poore east wing ne power kho diya, switchboard us wing se sau individual "monitor offline" calls forward karना band karता hai, kyunki power outage call already gaya (inhibition). Aur jab ek ward maintenance ke liye scheduled hai, operator ko pehle bataya jaता hai ki us window ke liye iski saari calls hold karे (ek silence).',
    },

    simple: `**ALERTMANAGER** receives firing alerts from Prometheus and turns them into
notifications. Config: \`alertmanager.yml\`.

**THE ROUTING TREE** — one root \`route\`, with nested \`routes\`. An alert enters at
the root and walks down; each child is checked in order:
\`\`\`
route:
  receiver: slack-default          # the fallback if nothing more specific matches
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers: [ 'team="data"' ]   # a "tap": data alerts ALSO go to the team channel
      receiver: slack-data
      continue: true                # <- keep matching siblings after this one
    - matchers: [ "severity=page" ]
      receiver: pagerduty            # continue defaults to false -> STOP here
    - matchers: [ 'severity="ticket"' ]
      receiver: jira
\`\`\`
- \`matchers\` (newer) or \`match\`/\`match_re\` (older) test the alert's labels.
- FIRST matching child WINS and routing stops - UNLESS \`continue: true\`, which
  lets the alert also match later siblings (that's how one alert reaches 2 receivers).
- child routes INHERIT \`group_by\` / timing / receiver from the parent unless overridden.
- no child matches -> the alert uses the parent's \`receiver\`.

**GROUPING** — bundle alerts that share the \`group_by\` label values into ONE
notification, so 200 pods down = 1 page listing 200, not 200 pages:
\`\`\`
group_by: ['alertname', 'cluster']     # one group per (alertname, cluster) pair
                                        # group_by: ["..."] with '...' literally = don't group
group_wait: 30s        # after the FIRST alert in a new group, wait this long for more
                       # before sending the first notification (batch the initial burst)
group_interval: 5m     # once a group has notified, wait at least this long before
                       # sending an UPDATE for that group (a new alert joined / one resolved)
repeat_interval: 4h    # re-send an unchanged, still-firing group every this often
                       # (a nag, so a forgotten alert doesn't fade from view)
\`\`\`

**RECEIVERS** — where a notification goes:
\`\`\`
receivers:
  - name: pagerduty
    pagerduty_configs: [ { routing_key: '<key>' } ]
  - name: slack-default
    slack_configs: [ { api_url: '<webhook>', channel: '#alerts' } ]
  - name: jira
    webhook_configs: [ { url: 'https://.../webhook' } ]   # generic - to anything
# also: email, opsgenie, victorops, msteams, sns, telegram, ...
# a receiver with NO configs = a valid "black hole" (route here to drop an alert).
\`\`\`

**INHIBITION** — while a SOURCE alert fires, SUPPRESS matching TARGET alerts:
\`\`\`
inhibit_rules:
  - source_matchers: [ "severity=page" ]
    target_matchers: [ 'severity="warning"' ]
    equal: ['alertname', 'cluster', 'service']   # only inhibit within the same scope
# use: a "whole DB is down" page suppresses the 40 "query slow" warnings it causes.
# a "node down" page suppresses the "pod not ready" alerts for pods on that node.
\`\`\`

**SILENCES** — a time-boxed, matcher-based mute, created via the UI / \`amtool\`:
\`\`\`
amtool silence add alertname="HighLatency" service="checkout" \\
  --duration=2h --comment="deploying v5, expected blip - JIRA-123" --author=you
# for planned maintenance / deploys / known issues. ALWAYS a comment + an expiry.
# a silence is NOT a fix - a permanent silence is a deleted alert with extra steps.
\`\`\`

**HIGH AVAILABILITY** — run 2-3 Alertmanagers; they gossip over a mesh so a group
notifies ONCE even though every Prometheus sends to all of them. NOT a Raft
quorum - it's best-effort dedup; a partition can cause a duplicate, never a miss.

**VALIDATE OFFLINE:**
\`\`\`
amtool check-config alertmanager.yml
amtool config routes test --config.file=alertmanager.yml severity=page service=checkout
  -> prints the receiver(s) that labelset would route to.
\`\`\``,

    simpleHi: `**ALERTMANAGER** Prometheus se firing alerts receive karता hai aur unhe
notifications mein badalता hai. Config: \`alertmanager.yml\`.

**ROUTING TREE** — ek root \`route\`, nested \`routes\` ke saath. Ek alert root par
enter karता hai aur neeche walk karता hai; har child order mein checked hai:
\`\`\`
route:
  receiver: slack-default          # fallback agar kuch zyada specific match nahi karता
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers: [ 'team="data"' ]   # ek "tap": data alerts ALSO team channel par jaते hain
      receiver: slack-data
      continue: true                # <- iske baad siblings match karते raho
    - matchers: [ "severity=page" ]
      receiver: pagerduty            # continue default false -> yahaan STOP
    - matchers: [ 'severity="ticket"' ]
      receiver: jira
\`\`\`
- \`matchers\` (newer) ya \`match\`/\`match_re\` (older) alert ke labels test karते hain.
- FIRST matching child JEETTA hai aur routing rukता hai - JAB TAK \`continue: true\` nahi,
  jo alert ko baad ke siblings bhi match karने deta hai (ek alert 2 receivers tak kaise pahunchta hai).
- child routes parent se \`group_by\` / timing / receiver INHERIT karते hain jab tak overridden nahi.
- koi child match nahi karता -> alert parent ka \`receiver\` use karता hai.

**GROUPING** — alerts jo \`group_by\` label values share karते hain unhe EK notification
mein bundle karो, to 200 pods down = 1 page jo 200 list karता hai, 200 pages nahi:
\`\`\`
group_by: ['alertname', 'cluster']     # per (alertname, cluster) pair ek group
group_wait: 30s        # ek naye group mein PEHLE alert ke baad, itni der wait karो more ke liye
group_interval: 5m     # ek group notify hone ke baad, ek UPDATE bhejने se pehle itni der wait karो
repeat_interval: 4h    # ek unchanged, abhi bhi firing group ko har itni der re-send karो
\`\`\`

**RECEIVERS** — ek notification kahaan jaता hai:
\`\`\`
receivers:
  - name: pagerduty
    pagerduty_configs: [ { routing_key: '<key>' } ]
  - name: slack-default
    slack_configs: [ { api_url: '<webhook>', channel: '#alerts' } ]
  - name: jira
    webhook_configs: [ { url: 'https://.../webhook' } ]   # generic - kisi bhi cheez ko
# ek receiver bina configs ke = ek valid "black hole" (ek alert drop karने ke liye yahaan route karो).
\`\`\`

**INHIBITION** — jab ek SOURCE alert fire karता hai, matching TARGET alerts SUPPRESS karो:
\`\`\`
inhibit_rules:
  - source_matchers: [ "severity=page" ]
    target_matchers: [ 'severity="warning"' ]
    equal: ['alertname', 'cluster', 'service']   # sirf same scope ke andar inhibit karो
# use: ek "poora DB down" page 40 "query slow" warnings ko suppress karता hai jo ye cause karता hai.
\`\`\`

**SILENCES** — ek time-boxed, matcher-based mute, UI / \`amtool\` ke through created:
\`\`\`
amtool silence add alertname="HighLatency" service="checkout" \\
  --duration=2h --comment="deploying v5 - JIRA-123" --author=you
# planned maintenance / deploys ke liye. HAMESHA ek comment + ek expiry.
# ek silence ek fix NAHI hai - ek permanent silence ek deleted alert hai extra steps ke saath.
\`\`\`

**HIGH AVAILABILITY** — 2-3 Alertmanagers chalाओ; wo ek mesh par gossip karते hain
taaki ek group EK BAAR notify kare even though har Prometheus sab ko bhejता hai.
Raft quorum NAHI - best-effort dedup; ek partition ek duplicate cause kar sakта hai, kabhi ek miss nahi.

**OFFLINE VALIDATE:**
\`\`\`
amtool check-config alertmanager.yml
amtool config routes test --config.file=alertmanager.yml severity=page service=checkout
  -> receiver(s) print karता hai jinpar wo labelset route karega.
\`\`\``,

    content: `## What Alertmanager does

Prometheus evaluates alerting rules and sends the *firing* ones to Alertmanager as a stream of label sets. Alertmanager\'s job is everything after that: deciding which team and channel each alert belongs to, bundling related alerts so a hundred failures produce one notification instead of a hundred, controlling how often a persistent problem re-notifies, suppressing alerts that are just downstream symptoms of a bigger alert, and honouring planned silences. It is configured entirely in \`alertmanager.yml\`.

## The routing tree

The \`route\` block is a tree. The top-level \`route\` is the root and always matches; under it, \`routes\` is an ordered list of child routes, each with \`matchers\` (or the older \`match\` / \`match_re\`) that test the alert\'s labels. An alert enters at the root and is checked against each child in order.

- The **first matching child wins** and routing stops there, so the alert is delivered to that child\'s receiver (and the child\'s children are then evaluated the same way).
- **\`continue: true\`** on a child overrides that: after matching, the alert keeps being checked against the *later* siblings, so it can match more than one route. This is how a single alert reaches two receivers — a "tap" route with \`continue: true\` that sends a copy to a team channel, followed by the normal severity routing.
- Child routes **inherit** \`group_by\`, the timing parameters, and the receiver from their parent, overriding only what they specify.
- If no child matches, the alert is delivered to the parent route\'s own \`receiver\`, which is why the root route\'s receiver is the catch-all.

## Grouping

Without grouping, every firing alert produces its own notification, so a node failure that trips fifty pod alerts pages someone fifty times. \`group_by\` is a list of label names; Alertmanager collects all firing alerts that share the same values for those labels into one **group** and sends one notification per group that lists every alert in it. \`group_by: ['alertname', 'cluster']\` produces one group per alert-name-and-cluster pair. The special value \`group_by: ["..."]\` (a literal three dots) disables grouping entirely, one notification per alert.

Three timers control the cadence:

- **\`group_wait\`** (default 30 seconds): when the first alert of a new group fires, Alertmanager waits this long before sending the initial notification, so a burst of related alerts arriving within a few seconds of each other is batched into the first notification rather than the first alert triggering a page and the rest arriving as updates.
- **\`group_interval\`** (default 5 minutes): once a group has sent a notification, this is the minimum time before it sends an *updated* notification for the same group — because a new alert joined the group or one resolved.
- **\`repeat_interval\`** (default 4 hours): if a group is unchanged and still firing, re-send the same notification this often. It is a deliberate nag so a real problem that nobody has acted on does not silently fade from view.

## Receivers

A **receiver** is a named notification destination with a type-specific config: \`pagerduty_configs\`, \`slack_configs\`, \`opsgenie_configs\`, \`email_configs\`, \`webhook_configs\` (a generic HTTP POST that integrates with anything), and others. A receiver defined with a name and no configs is a valid black hole — routing an alert to it drops the alert silently, which is occasionally useful for a known-noisy alert you cannot yet delete.

## Inhibition

An **inhibit rule** suppresses notifications for one set of alerts while another is firing. It has \`source_matchers\` (the alert that, when firing, does the suppressing), \`target_matchers\` (the alerts that get suppressed), and \`equal\` (a list of labels that must have the same value on both the source and the target for the suppression to apply, so you only inhibit within the same scope). The canonical uses: a "the whole database is unreachable" page suppresses the dozens of "this query is slow" warnings it causes; a "node down" page suppresses the "pod not ready" alerts for pods that were on that node. Inhibition prevents an incident from generating a storm of downstream noise that buries the one alert that explains it.

## Silences

A **silence** is a time-boxed mute defined by a set of matchers, created through the Alertmanager UI or the \`amtool silence add\` command. It requires an expiry and should always carry a comment explaining why — a deploy, a maintenance window, a known issue with a ticket reference. A silence is an operational tool for planned or acknowledged disruption, not a fix: a silence that is repeatedly extended is a signal that either the alert is wrong or the problem is being ignored, and a permanent silence is a deleted alert with extra steps and no audit trail.

## High availability

Alertmanager runs as a cluster of two or three instances that gossip over a mesh network. Every Prometheus is configured to send its alerts to *all* of them, and the gossip protocol ensures that a given group notifies only once despite the duplicate delivery. This is deliberately not a strong-consistency quorum: the design goal is that a notification is never missed, and the acceptable failure mode under a network partition is an occasional duplicate notification rather than a lost one.

## Validating offline

\`amtool check-config alertmanager.yml\` validates the whole configuration — the routing tree, the matchers, the receivers, the inhibit rules — without a running Alertmanager. \`amtool config routes test --config.file=alertmanager.yml k=v k=v\` takes a label set and prints which receiver or receivers that alert would be routed to, letting you assert routing behaviour in a test: a \`severity=page\` alert routes to \`pagerduty\`, a data-team alert routes to \`slack-data\` *and* its severity receiver because of the \`continue: true\` tap.`,

    contentHi: `## Alertmanager kya karता hai

Prometheus alerting rules evaluate karता hai aur *firing* walon ko Alertmanager ko label sets ki ek stream ke roop mein bhejता hai. Alertmanager ka job us ke baad sab kuch hai: decide karना kaun si team aur channel har alert belong karता hai, related alerts ko bundle karना, control karना ki ek persistent problem kitni baar re-notify karता hai, un alerts ko suppress karना jo bas downstream symptoms hain, aur planned silences honour karना. Ye poori tarah \`alertmanager.yml\` mein configured hai.

## Routing tree

\`route\` block ek tree hai. Top-level \`route\` root hai aur hamesha match karता hai; iske tahat, \`routes\` child routes ki ek ordered list hai, har ek \`matchers\` ke saath jo alert ke labels test karते hain. Ek alert root par enter karता hai aur har child ke against order mein checked hai.
- **First matching child jeetta hai** aur routing wahaan rukता hai.
- **\`continue: true\`** ek child par use override karता hai: matching ke baad, alert *baad ke* siblings ke against checked rehता hai, to ye ek se zyada route match kar sakता hai.
- Child routes apne parent se \`group_by\`, timing parameters, aur receiver **inherit** karते hain.
- Agar koi child match nahi karता, alert parent route ke apne \`receiver\` ko delivered hai.

## Grouping

Grouping ke bina, har firing alert apna notification produce karता hai. \`group_by\` label names ki ek list hai; Alertmanager saare firing alerts jo un labels ke liye same values share karते hain unhe ek **group** mein collect karता hai aur per group ek notification bhejता hai. Special value \`group_by: ["..."]\` grouping ko poori tarah disable karता hai.

Teen timers cadence control karते hain:
- **\`group_wait\`** (default 30 seconds): jab ek naye group ka pehla alert fire karता hai, Alertmanager initial notification bhejने se pehle itni der wait karता hai.
- **\`group_interval\`** (default 5 minutes): ek baar ek group ne ek notification bheja, ye minimum time hai iske pehle ye same group ke liye ek *updated* notification bhejता hai.
- **\`repeat_interval\`** (default 4 hours): agar ek group unchanged hai aur abhi bhi firing hai, same notification ko itni der re-send karो.

## Receivers

Ek **receiver** ek named notification destination hai ek type-specific config ke saath: \`pagerduty_configs\`, \`slack_configs\`, \`webhook_configs\` (ek generic HTTP POST jo kisi bhi cheez ke saath integrate karता hai), aur doosre. Ek receiver jo ek name aur koi configs ke bina defined hai ek valid black hole hai.

## Inhibition

Ek **inhibit rule** ek set of alerts ke liye notifications suppress karता hai jab doosra firing hai. Iske paas \`source_matchers\`, \`target_matchers\`, aur \`equal\` (labels ki ek list jinka source aur target dono par same value hona chahिए) hain. Canonical uses: ek "poora database unreachable" page dozens "ye query slow hai" warnings ko suppress karता hai jo ye cause karता hai.

## Silences

Ek **silence** ek time-boxed mute hai matchers ke ek set se defined, Alertmanager UI ya \`amtool silence add\` command ke through created. Ise ek expiry chahिए aur hamesha ek comment carry karना chahिए. Ek silence ek fix nahi hai.

## High availability

Alertmanager do ya teen instances ke ek cluster ke roop mein chalता hai jo ek mesh network par gossip karते hain. Har Prometheus apne alerts *sab* ko bhejने ke liye configured hai. Ye deliberately ek strong-consistency quorum nahi hai: design goal ye hai ki ek notification kabhi missed na ho.

## Offline validate karna

\`amtool check-config alertmanager.yml\` poore configuration ko validate karता hai. \`amtool config routes test --config.file=alertmanager.yml k=v k=v\` ek label set leता hai aur print karता hai kaun sा receiver us alert ko routed hoga.`,

    examples: [
      {
        title: 'Validating a routing tree and asserting where three alerts go with amtool',
        titleHi: 'Ek routing tree validate karna aur amtool ke saath teen alerts kahaan jaते hain assert karना',
        code: `# VERIFY
export PATH="$HOME/bin:$PATH"

cat > alertmanager.yml <<'YML'
route:
  receiver: slack-default
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    # a "tap": data-team alerts ALSO go to the team channel, then keep matching
    - matchers: [ 'team="data"' ]
      receiver: slack-data
      continue: true
    # severity routing: first non-continue match wins and STOPS
    - matchers: [ "severity=page" ]
      receiver: pagerduty
    - matchers: [ 'severity="ticket"' ]
      receiver: jira
inhibit_rules:
  # a page suppresses matching warnings for the SAME alertname+service
  - source_matchers: [ "severity=page" ]
    target_matchers: [ 'severity="warning"' ]
    equal: ['alertname', 'service']
receivers:
  - name: slack-default
  - name: slack-data
  - name: pagerduty
  - name: jira
YML

amtool check-config alertmanager.yml

echo "--- a page alert with no team -> pagerduty ---"
amtool config routes test --config.file=alertmanager.yml severity=page alertname=CheckoutDown service=checkout

echo "--- a data-team page -> slack-data (continue) THEN pagerduty ---"
amtool config routes test --config.file=alertmanager.yml team=data severity=page alertname=PipelineDown service=etl

echo "--- a warning with no severity route -> the default receiver ---"
amtool config routes test --config.file=alertmanager.yml severity=warning alertname=DiskFilling service=api`,
        output: `Checking 'alertmanager.yml'  SUCCESS
Found:
 - global config
 - route
 - 1 inhibit rules
 - 4 receivers
 - 0 templates

--- a page alert with no team -> pagerduty ---
pagerduty
--- a data-team page -> slack-data (continue) THEN pagerduty ---
slack-data,pagerduty
--- a warning with no severity route -> the default receiver ---
slack-default`,
        explain: 'A realistic routing tree and the three assertions that prove it behaves as intended. The root route has a catch-all \`slack-default\` receiver and three children. The first child matches any alert with \`team="data"\`, sends it to the team\'s Slack channel, and carries \`continue: true\` so routing does not stop — this is the "tap" pattern for giving a team visibility into all of its own alerts regardless of severity. The next two children route by severity to PagerDuty and Jira, and because they do not set \`continue\`, the first of them that matches ends routing. \`amtool check-config\` validates the whole file offline and confirms the structure. Then \`amtool config routes test\` is given three label sets and prints the receiver each would reach. A plain page alert with no team label skips the data tap and matches the severity route to \`pagerduty\`. A data-team page matches the tap first — so it goes to \`slack-data\` — and because of \`continue: true\` it keeps matching and also hits the severity route to \`pagerduty\`, so the output is both, comma-separated. A warning matches neither severity route (there is no \`severity="warning"\` child) and no team, so it falls through to the root\'s default receiver. This is exactly the kind of check to run in CI on every change to the routing tree, because a mis-ordered route or a forgotten \`continue\` silently sends alerts to the wrong place.',
        explainHi: 'Ek realistic routing tree aur teen assertions jo prove karते hain ye jaisा intended waise behave karता hai. Root route ke paas ek catch-all \`slack-default\` receiver aur teen children hain. Pehla child \`team="data"\` wale kisi bhi alert ko match karता hai, ise team ke Slack channel par bhejता hai, aur \`continue: true\` carry karता hai to routing rukता nahi — ye "tap" pattern hai ek team ko iske apne saare alerts mein visibility dene ke liye. Agle do children severity se PagerDuty aur Jira ko route karते hain. \`amtool check-config\` poore file ko offline validate karता hai. Phir \`amtool config routes test\` ko teen label sets diye jaते hain. Ek plain page alert bina team label ke data tap skip karता hai aur severity route ko \`pagerduty\` match karता hai. Ek data-team page tap ko pehle match karता hai — to ye \`slack-data\` ko jaता hai — aur \`continue: true\` ki wajah se ye match karता rehता hai aur severity route ko \`pagerduty\` bhi hit karता hai. Ek warning na koi severity route match karता hai na koi team, to ye root ke default receiver mein fall through karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# assuming the first matching route ISN'T the end of routing (forgetting 'continue')
  routes:
    - matchers: [ "severity=page" ]
      receiver: pagerduty
    - matchers: [ 'team="payments"' ]      # a payments PAGE will NEVER reach this
      receiver: slack-payments
  # a payments page has BOTH severity=page and team=payments. it matches the FIRST
  # route (severity), goes to pagerduty, and routing STOPS. the payments team
  # channel never gets a copy. "why don't we see our own pages in Slack?"`,
        right: `# put the "also notify" taps FIRST, with continue: true; severity routing LAST:
  routes:
    - matchers: [ 'team="payments"' ]      # tap: a copy to the team channel
      receiver: slack-payments
      continue: true                        # <- keep going
    - matchers: [ 'team="data"' ]
      receiver: slack-data
      continue: true
    - matchers: [ "severity=page" ]       # terminal: the actual paging decision
      receiver: pagerduty
    - matchers: [ 'severity="ticket"' ]
      receiver: jira
  # verify: amtool config routes test ... team=payments severity=page
  #   -> slack-payments,pagerduty`,
        why: 'Alertmanager\'s routing tree stops at the first matching child unless that child has \`continue: true\`, and this is easy to forget when you think of routes as independent rules rather than an ordered decision. If a severity route comes before a team route, an alert that matches both — a payments-team page has \`severity=page\` and \`team=payments\` — is caught by the severity route, sent to PagerDuty, and never checked against the team route, so the team\'s Slack channel never receives a copy. The fix is structural: the routes that are meant to *add* a notification without being the final decision — the team "tap" routes — go first in the list and every one of them carries \`continue: true\`, and the routes that make the terminal decision about how the alert is delivered — the severity routes — come last without \`continue\`. Then an alert flows through every applicable tap, collecting copies to team channels, and finally lands on exactly one severity route. Running \`amtool config routes test\` with a label set that has both a team and a severity confirms the alert reaches both the team channel and the pager.',
        whyHi: 'Alertmanager ka routing tree first matching child par rukता hai jab tak us child ke paas \`continue: true\` nahi hai, aur ye bhoolना aasan hai jab aap routes ko independent rules ke roop mein sochते ho ek ordered decision ke bajaay. Agar ek severity route ek team route se pehle aata hai, ek alert jo dono match karता hai — ek payments-team page ke paas \`severity=page\` aur \`team=payments\` hai — severity route dwara caught hai, PagerDuty ko bheja jaता hai, aur kabhi team route ke against checked nahi hai. Fix structural hai: routes jo ek notification *add* karने ke liye hain final decision hue bina — team "tap" routes — list mein pehle jaते hain aur unme se har ek \`continue: true\` carry karता hai, aur routes jo terminal decision banाते hain — severity routes — last aate hain bina \`continue\` ke.',
      },
      {
        wrong: `# grouping so broadly that unrelated alerts land in one notification
  route:
    group_by: ["cluster"]       # <-- one group per cluster, for EVERYTHING
    group_wait: 30s
    group_interval: 5m
  # now: a DB alert, a disk alert, and a cert-expiry alert on the same cluster all
  # go into ONE notification. group_interval=5m means once it's fired, a NEW
  # unrelated alert on that cluster waits up to 5 min to be added. and resolving
  # one alert doesn't clear the notification. the page becomes an ever-changing
  # blob of unrelated problems.
  #   OR the opposite:  group_by: ['alertname','instance','pod','container',...]
  #   -> effectively no grouping -> 200 pods down = 200 separate pages.`,
        right: `# group by what makes alerts "the same incident": usually alertname + a scope label
  route:
    group_by: ['alertname', 'cluster', 'service']
    group_wait: 30s          # batch the initial burst of one alertname
    group_interval: 5m       # updates to THAT group (more instances, some resolved)
    repeat_interval: 4h
    routes:
      # a page can group tighter/looser than the default; override per-route:
      - matchers: [ "severity=page" ]
        receiver: pagerduty
        group_by: ['alertname', 'service']   # a page: one per (alert, service)
        repeat_interval: 1h                   # nag more often for pages
  # test: 200 pods of ONE service failing -> ONE page listing 200. a different
  # alertname on the same cluster -> a SEPARATE notification.`,
        why: 'The \`group_by\` labels define what Alertmanager treats as "the same problem" for the purpose of bundling notifications, and both extremes are wrong. Grouping too broadly — by \`cluster\` alone — puts every kind of alert on a cluster into one notification, so a database outage, a disk warning, and a certificate expiry become a single ever-changing message, and because \`group_interval\` governs updates to that one group, a genuinely new and unrelated problem can wait minutes to be surfaced while resolved alerts linger in the same notification. Grouping too narrowly — including \`instance\`, \`pod\`, \`container\` — defeats the purpose entirely, because each failing pod has a unique combination of those labels and therefore its own group and its own notification, so a fifty-pod failure is fifty pages. The right \`group_by\` is the set of labels that identify a single incident: almost always \`alertname\` plus one or two scope labels like \`cluster\` and \`service\`. That way all instances of one alert firing for one service collapse into one notification listing them, while a different alert, or the same alert for a different service, is a separate notification. Per-route overrides let a page group differently from a ticket.',
        whyHi: '\`group_by\` labels define karते hain Alertmanager kya "same problem" ke roop mein treat karता hai notifications bundle karने ke purpose ke liye, aur dono extremes galat hain. Bahut broadly group karna — sirf \`cluster\` se — ek cluster par har kind ke alert ko ek notification mein daalता hai. Bahut narrowly group karna — \`instance\`, \`pod\`, \`container\` include karके — purpose ko poori tarah defeat karता hai, kyunki har failing pod ke paas un labels ka ek unique combination hai. Right \`group_by\` un labels ka set hai jo ek single incident identify karते hain: lagbhag hamesha \`alertname\` plus ek ya do scope labels jaise \`cluster\` aur \`service\`.',
      },
      {
        wrong: `# using a silence as a permanent fix for a noisy alert
  # a flaky alert fires nightly during a batch job. someone creates a silence:
  amtool silence add alertname="HighLatency" --duration=720h --comment="noisy"
  # 30 days later it auto-expires. the alert fires again at 2am. someone re-creates
  # the silence. this repeats for a year. the alert is effectively dead but:
  #   - nobody remembers WHY it's silenced
  #   - if the underlying thing ever becomes a REAL problem, no one is told
  #   - the silence list is full of these, hiding the ones that are legitimate`,
        right: `# a silence is for PLANNED, TIME-BOXED disruption. anything longer -> fix the alert:
  #   nightly batch causes latency  -> make the alert AWARE of it:
  #     expr: <p99 latency> > 0.3  unless on() (hour() >= 1 and hour() < 3)
  #     -> the alert simply doesn't evaluate as firing during the known window
  #   OR add an inhibit rule: a "BatchJobRunning" alert (that you WANT to see)
  #     inhibits the latency alert while it's active
  #   OR the threshold/for is wrong -> retune it
  # legit silence use:  amtool silence add service="checkout" --duration=90m \\
  #   --comment="deploying v5.2, expected ~2min blip, JIRA-4821" --author=dana
  #   (short, specific, ticket-linked, expires on its own)`,
        why: 'A silence is an operational tool for a disruption you know about in advance and that will end: a deployment, a maintenance window, a migration. It is defined with an expiry precisely so it cannot outlive the disruption it covers. Using a silence to permanently mute an alert that is genuinely noisy — a nightly batch job that reliably trips a latency threshold — inverts that intent: the silence is repeatedly recreated as it expires, nobody records why beyond a one-word comment, the underlying condition can no longer alert if it ever becomes a real problem, and the silence list fills with these zombies so the legitimate short-term silences are hard to see. The correct responses to a persistently noisy alert are all fixes to the alert itself: make the expression aware of the known window so it does not evaluate as firing then, add an inhibit rule keyed on an alert for the batch job that you deliberately keep visible, or retune the threshold and \`for\` if they are simply set wrong. A silence should be short, specific, tied to a ticket, and left to expire on its own.',
        whyHi: 'Ek silence ek disruption ke liye ek operational tool hai jise aap pehle se jaanते ho aur jo khatam hoga: ek deployment, ek maintenance window, ek migration. Ise ek expiry ke saath define kiya jaता hai precisely taaki ye us disruption ko outlive na kar sake jise ye cover karता hai. Ek alert ko permanently mute karने ke liye ek silence use karna jo genuinely noisy hai us intent ko invert karता hai: silence repeatedly recreated hai jaise ye expire hota hai, koi record nahi karता kyun, underlying condition ab alert nahi kar sakती agar ye kabhi ek real problem ban jaता hai. Ek persistently noisy alert ke correct responses sab alert khud ke fixes hain.',
      },
    ],

    realWorld: [
      {
        en: '**Payments never saw their own pages** — the severity route was before the team route with no `continue`. Payments pages went straight to PagerDuty and the team\'s Slack channel got nothing, for months, until someone asked. Reordering the taps to the front with `continue: true` fixed it; an `amtool config routes test` check went into CI.',
        hi: '**Payments ne apne khud ke pages kabhi nahi dekhe** — severity route team route se pehle tha bina `continue` ke. Payments pages seedhे PagerDuty par gaye aur team ka Slack channel kuch nahi mila. Taps ko front mein `continue: true` ke saath reorder karna fix kiya.',
      },
      {
        en: '**One `group_by: ["cluster"]`, an unreadable page** — a cluster-wide DB outage, a disk warning, and a cert alert all merged into one ever-updating PagerDuty incident. The on-call couldn\'t tell what was new. Changing to `["alertname","cluster","service"]` gave three clean, separate incidents.',
        hi: '**Ek `group_by: ["cluster"]`, ek unreadable page** — ek cluster-wide DB outage, ek disk warning, aur ek cert alert sab ek ever-updating PagerDuty incident mein merge ho gaye. `["alertname","cluster","service"]` par change karna teen clean, separate incidents diye.',
      },
      {
        en: '**A silence re-created for 14 months** — a nightly batch tripped a latency alert; the silence was recreated every 30 days. When the batch genuinely broke and ran 4 hours, no alert fired because the silence was active. The alert expr was changed to exclude the 01:00-03:00 window and the silence deleted.',
        hi: '**Ek silence 14 mahine ke liye re-created** — ek nightly batch ne ek latency alert trip kiya; silence har 30 din recreated hua. Jab batch genuinely toota aur 4 ghante chala, koi alert fire nahi hua kyunki silence active tha.',
      },
    ],

    interviewQA: [
      {
        q: 'How does the Alertmanager routing tree work, and how does an alert reach two receivers?',
        qHi: 'Alertmanager routing tree kaise kaam karता hai, aur ek alert do receivers tak kaise pahunchta hai?',
        a: 'The route block is a tree. The top-level route is the root and always matches; under it, routes is an ordered list of child routes, each with matchers that test the alert\'s labels. An alert enters at the root and is checked against each child in order. The first matching child wins and routing stops there, delivering the alert to that child\'s receiver — and if no child matches, the alert goes to the parent route\'s own receiver, which is why the root\'s receiver is the catch-all. Child routes inherit group_by, the timing parameters, and the receiver from their parent, overriding only what they specify. An alert reaches two receivers through continue: true on a route: after that route matches, the alert keeps being checked against the later siblings, so it can match more than one. The standard pattern is a set of "tap" routes at the front of the list, each matching a team label and carrying continue: true so it sends a copy to the team\'s channel without ending routing, followed by the severity routes at the end without continue, which make the terminal decision about paging or ticketing. A payments-team page then matches the payments tap first, gets a Slack copy, and continues to the severity route and pages. Ordering matters: a severity route placed before a team tap catches the alert first and the team never gets a copy.',
        aHi: 'Route block ek tree hai. Top-level route root hai aur hamesha match karता hai; iske tahat, routes child routes ki ek ordered list hai, har ek matchers ke saath jo alert ke labels test karते hain. Ek alert root par enter karता hai aur har child ke against order mein checked hai. First matching child jeetta hai aur routing wahaan rukता hai — aur agar koi child match nahi karता, alert parent route ke apne receiver ko jaता hai. Child routes apne parent se inherit karते hain. Ek alert do receivers tak continue: true ke through pahunchta hai: us route ke match karने ke baad, alert baad ke siblings ke against checked rehता hai. Standard pattern list ke front mein "tap" routes ka ek set hai, har ek ek team label match karता aur continue: true carry karता. Ordering matter karता hai.',
      },
      {
        q: 'Explain grouping and the three timing parameters. What is a good group_by and why do the extremes fail?',
        qHi: 'Grouping aur teen timing parameters samjhao. Ek achha group_by kya hai aur extremes kyun fail karते hain?',
        a: 'Grouping bundles firing alerts that share the same values for the group_by labels into one group, and Alertmanager sends one notification per group listing every alert in it, so a fifty-pod failure of one service is one notification rather than fifty. Three timers control the cadence. group_wait, default 30 seconds, is how long Alertmanager waits after the first alert of a new group before sending the initial notification, so a burst of related alerts arriving within seconds is batched into that first notification. group_interval, default 5 minutes, is the minimum time before an updated notification is sent for a group that has already notified, when a new alert joins or one resolves. repeat_interval, default 4 hours, re-sends an unchanged still-firing group that often as a deliberate nag. A good group_by is the set of labels that identify a single incident — almost always alertname plus one or two scope labels such as cluster and service. Grouping too broadly, by cluster alone, merges a database outage, a disk warning, and a cert alert into one ever-changing notification where the on-call cannot tell what is new. Grouping too narrowly, adding instance or pod or container, gives every failing pod its own group because those labels are unique per pod, so a fifty-pod failure is fifty notifications. Per-route overrides let a page group differently from a ticket and nag more often.',
        aHi: 'Grouping firing alerts ko bundle karता hai jo group_by labels ke liye same values share karते hain ek group mein, aur Alertmanager per group ek notification bhejता hai. Teen timers cadence control karते hain. group_wait, default 30 seconds, ye hai ki Alertmanager ek naye group ke pehle alert ke baad kitni der wait karता hai initial notification bhejने se pehle. group_interval, default 5 minutes, ek updated notification bheje jaने se pehle minimum time hai. repeat_interval, default 4 hours, ek unchanged still-firing group ko itni der re-send karता hai. Ek achha group_by un labels ka set hai jo ek single incident identify karते hain — lagbhag hamesha alertname plus ek ya do scope labels. Bahut broadly group karna merge karता hai; bahut narrowly group karna har failing pod ko apna group deता hai.',
      },
      {
        q: 'What is inhibition, what is a silence, and how do they differ? When is each misused?',
        qHi: 'Inhibition kya hai, ek silence kya hai, aur wo kaise differ karते hain? Har ek kab misused hai?',
        a: 'An inhibit rule suppresses one set of alerts while another is firing. It has source_matchers for the alert that does the suppressing, target_matchers for the alerts that get suppressed, and equal, a list of labels that must match on both source and target so suppression only applies within the same scope. The canonical use is stopping a big alert from generating a storm of downstream noise: a "whole database unreachable" page suppresses the dozens of "query slow" warnings it causes, and a "node down" page suppresses the "pod not ready" alerts for pods on that node, so the on-call sees the one alert that explains the incident rather than fifty that are its consequences. A silence is a time-boxed mute defined by a set of matchers, created through the UI or amtool silence add, requiring an expiry and a comment. It is for planned or acknowledged disruption — a deployment, a maintenance window, a migration — that you know about in advance and that will end. They differ in that inhibition is a permanent rule in the config that reacts to the live alert state, automatically and scoped, while a silence is a one-off manual mute for a specific known window. Inhibition is misused when the equal labels are too loose and it suppresses alerts it should not. A silence is misused when it is repeatedly recreated to permanently mute a noisy alert — that hides the alert with no audit trail and means a real problem there would never be seen; the fix is to change the alert expression, add an inhibit rule, or retune the threshold.',
        aHi: 'Ek inhibit rule ek set of alerts ko suppress karता hai jab doosra firing hai. Iske paas source_matchers, target_matchers, aur equal (labels ki ek list jo dono par match karना chahिए) hain. Canonical use ek badhे alert ko downstream noise ka ek storm generate karने se rोkना hai: ek "poora database unreachable" page dozens "query slow" warnings ko suppress karता hai. Ek silence ek time-boxed mute hai matchers ke ek set se defined, UI ya amtool se created, ek expiry aur ek comment require karता. Ye planned ya acknowledged disruption ke liye hai. Wo differ karते hain kyunki inhibition config mein ek permanent rule hai jo live alert state par react karता hai, jabki ek silence ek specific known window ke liye ek one-off manual mute hai. Ek silence misused hai jab ise repeatedly recreated kiya jaता hai ek noisy alert ko permanently mute karने ke liye.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the routing tree: how an alert walks it, first-match-wins, continue: true, inheritance, and the tap-then-severity ordering pattern.',
        taskHi: 'Ek comment mein, routing tree samjhao.',
        hint: 'THE ROUTE BLOCK IS A TREE: the top-level `route` is the ROOT and ALWAYS matches; under it, `routes` is an ORDERED list of child routes, each with `matchers` (newer) or `match`/`match_re` (older) that test the alert\'s LABELS. AN ALERT enters at the root and is checked against each child IN ORDER. FIRST MATCHING CHILD WINS and routing STOPS there → delivered to that child\'s `receiver` (then the child\'s own children are evaluated the same way). NO child matches → the alert goes to the PARENT route\'s own `receiver` (this is why the ROOT\'s receiver is the CATCH-ALL). `continue: true` on a child OVERRIDES the stop: after matching, the alert KEEPS being checked against the LATER siblings → it can match MORE THAN ONE route → THIS is how ONE alert reaches TWO receivers. INHERITANCE: child routes INHERIT `group_by`, the timing params (`group_wait`/`group_interval`/`repeat_interval`), and the `receiver` from their parent — overriding ONLY what they explicitly set. THE TAP-THEN-SEVERITY ORDERING PATTERN: put the "ALSO NOTIFY" tap routes FIRST — each matching a `team=` label, each with `continue: true` → sends a copy to the team channel WITHOUT ending routing. Put the TERMINAL severity routes LAST — `severity="page"` → pagerduty, `severity="ticket"` → jira — WITHOUT `continue` → the first one that matches makes the final delivery decision. A payments-team page (`team=payments` + `severity=page`) then: matches the payments tap → slack-payments (copy), continues → matches the severity route → pagerduty. WRONG ORDER (severity route BEFORE the team tap): the severity route catches it first and STOPS → the team channel NEVER gets a copy ("why don\'t we see our own pages in Slack?"). VERIFY: `amtool config routes test --config.file=am.yml team=payments severity=page` → should print `slack-payments,pagerduty`.',
        hintHi: 'ROUTE BLOCK EK TREE HAI: top-level `route` ROOT hai aur HAMESHA match karता hai; iske tahat `routes` child routes ki ek ORDERED list hai, har ek `matchers` ke saath jo alert ke LABELS test karते hain. EK ALERT root par enter karता hai aur har child ke against ORDER MEIN checked hai. FIRST MATCHING CHILD JEETTA hai aur routing wahaan STOP hota hai. KOI child match nahi → alert PARENT route ke apne `receiver` ko jaता hai (ROOT ka receiver CATCH-ALL). `continue: true` stop ko OVERRIDE karता hai → alert BAAD ke siblings ke against checked rehता hai → ONE alert TWO receivers tak. INHERITANCE: child routes `group_by`, timing params, `receiver` INHERIT karते hain. TAP-THEN-SEVERITY: "ALSO NOTIFY" tap routes PEHLE — har ek `team=` label + `continue: true`. TERMINAL severity routes LAST — bina `continue`. GALAT ORDER (severity route PEHLE): severity route pehle catch karता hai aur STOP → team channel kabhi copy nahi. VERIFY: `amtool config routes test`.',
      },
      {
        task: 'In a comment, explain grouping (group_by + the 3 timers) with a good/bad group_by, and receivers (types + the black-hole receiver).',
        taskHi: 'Ek comment mein, grouping aur receivers samjhao.',
        hint: 'GROUPING bundles all firing alerts that SHARE THE SAME VALUES for the `group_by` label names into ONE GROUP → Alertmanager sends ONE notification per group LISTING every alert in it → a 50-pod failure of one service = ONE page listing 50, not 50 pages. `group_by: ["..."]` (a LITERAL three dots) = DISABLE grouping (one notification per alert). THE 3 TIMERS: `group_wait` (default 30s) — after the FIRST alert of a NEW group fires, wait this long before the INITIAL notification → batches a burst of related alerts arriving within seconds into that first notification. `group_interval` (default 5m) — once a group has notified, the MINIMUM time before an UPDATED notification for that SAME group (a new alert joined / one resolved). `repeat_interval` (default 4h) — re-send an UNCHANGED, STILL-FIRING group this often → a deliberate NAG so a real problem nobody acted on doesn\'t fade from view. A GOOD `group_by` = the labels that identify a SINGLE INCIDENT: almost always `alertname` + one or two SCOPE labels (`cluster`, `service`). TOO BROAD (`["cluster"]` alone) → a DB outage + a disk warning + a cert alert on that cluster all merge into ONE ever-changing notification where the on-call can\'t tell what\'s new + `group_interval` delays surfacing a genuinely new problem. TOO NARROW (`+instance +pod +container`) → each failing pod has a UNIQUE label combo → its own group → 50 pods = 50 notifications (grouping defeated). Per-route OVERRIDES: a `page` route can `group_by: ["alertname","service"]` + `repeat_interval: 1h` (nag more) while the default is looser. RECEIVERS: a named destination + a type-specific config — `pagerduty_configs` (`routing_key`), `slack_configs` (`api_url`, `channel`), `email_configs`, `opsgenie_configs`, `webhook_configs` (a GENERIC HTTP POST → integrate with ANYTHING — Jira, a custom bot). A receiver defined with a NAME and NO configs = a valid BLACK HOLE → route an alert there to DROP it silently (occasionally useful for a known-noisy alert you can\'t yet delete).',
        hintHi: 'GROUPING un firing alerts ko bundle karता hai jo `group_by` label names ke liye SAME VALUES SHARE karते hain ek GROUP mein → per group EK notification jo har alert LIST karता hai → ek 50-pod failure = EK page. `group_by: ["..."]` = DISABLE grouping. 3 TIMERS: `group_wait` (30s) — ek NAYE group ke PEHLE alert ke baad, INITIAL notification se pehle itni der wait. `group_interval` (5m) — ek group notify hone ke baad, ek UPDATED notification se pehle MINIMUM time. `repeat_interval` (4h) — ek UNCHANGED, STILL-FIRING group ko itni der re-send (NAG). ACHHA `group_by` = ek SINGLE INCIDENT identify karने wale labels: `alertname` + 1-2 SCOPE labels. BAHUT BROAD (`["cluster"]`) → merge. BAHUT NARROW (`+pod`) → 50 pods = 50 notifications. RECEIVERS: `pagerduty_configs`, `slack_configs`, `webhook_configs` (GENERIC). NAME + NO configs = BLACK HOLE (drop).',
      },
      {
        task: 'In a comment, contrast inhibition and silences (structure, when each applies, misuse), and describe Alertmanager HA + how you validate routing offline.',
        taskHi: 'Ek comment mein, inhibition aur silences ka contrast karo.',
        hint: 'INHIBITION — a PERMANENT rule in the config that SUPPRESSES one set of alerts WHILE ANOTHER IS FIRING, automatically, reacting to the live alert state. STRUCTURE: `source_matchers` (the alert that, when firing, DOES the suppressing), `target_matchers` (the alerts that GET suppressed), `equal` (a list of labels that must have the SAME VALUE on BOTH source + target → only inhibit WITHIN THE SAME SCOPE). CANONICAL USE: stop a big alert generating a STORM of downstream noise — a "whole DB unreachable" page suppresses the 40 "query slow" warnings it causes; a "node down" page suppresses the "pod not ready" alerts for pods on THAT node (`equal: [node]`). MISUSE: `equal` too loose → it suppresses alerts it shouldn\'t (a page on one service silences warnings on an unrelated one). SILENCE — a TIME-BOXED, matcher-based MANUAL mute, created via the UI or `amtool silence add alertname="X" service="Y" --duration=2h --comment="deploying v5, JIRA-123" --author=you`. REQUIRES an expiry + should ALWAYS carry a comment. For PLANNED / ACKNOWLEDGED disruption you know about in advance and that WILL END (a deploy, a maintenance window, a migration). MISUSE: repeatedly recreating a silence to PERMANENTLY mute a noisy alert → hides it with NO audit trail, a real problem there would NEVER be seen, the silence list fills with zombies hiding the legitimate ones. FIX a noisy alert instead: make the expr aware of the known window (`... unless on() (hour() >= 1 and hour() < 3)`), add an inhibit rule keyed on a "BatchRunning" alert you keep visible, or retune the threshold/`for`. DIFFERENCE: inhibition is automatic + config + scoped + reactive; a silence is manual + one-off + for a specific known window. ALERTMANAGER HA: run 2-3 instances that GOSSIP over a mesh; EVERY Prometheus sends to ALL of them; the gossip ensures a group notifies ONCE despite duplicate delivery. NOT a Raft/strong-consistency quorum — best-effort dedup; the acceptable failure mode under a partition is an OCCASIONAL DUPLICATE, NEVER a miss. VALIDATE OFFLINE: `amtool check-config alertmanager.yml` (the whole tree + matchers + receivers + inhibit rules); `amtool config routes test --config.file=am.yml k=v k=v` → prints the receiver(s) that labelset routes to → assert it in CI (`severity=page` → `pagerduty`; `team=data severity=page` → `slack-data,pagerduty`).',
        hintHi: 'INHIBITION — config mein ek PERMANENT rule jo ek set of alerts ko SUPPRESS karता hai JAB DOOSRA FIRING hai, automatically. STRUCTURE: `source_matchers`, `target_matchers`, `equal` (labels jo DONO par SAME value hone chahिए → SAME SCOPE ke andar). USE: ek badhे alert ko downstream noise ka STORM generate karने se rोkना. MISUSE: `equal` bahut loose. SILENCE — ek TIME-BOXED, matcher-based MANUAL mute (`amtool silence add ... --duration=2h --comment=... --author=...`). expiry + comment REQUIRED. PLANNED disruption ke liye jo KHATAM HOGA. MISUSE: ek noisy alert ko PERMANENTLY mute karने ke liye repeatedly recreate karना. DIFFERENCE: inhibition automatic + config + scoped + reactive; silence manual + one-off + specific window. HA: 2-3 instances GOSSIP over a mesh; har Prometheus SAB ko bhejता hai; NOT a Raft quorum — best-effort dedup, ek DUPLICATE OK, ek MISS nahi. VALIDATE: `amtool check-config`; `amtool config routes test`.',
      },
    ],

    keyTakeaways: [
      'ALERTMANAGER turns firing alerts into notifications. The ROUTING TREE: an alert walks from the root; FIRST matching child WINS and routing STOPS (unless `continue: true`, which lets it also match later siblings — how one alert hits 2 receivers). No child matches → the parent\'s `receiver` (the root\'s is the catch-all). Children INHERIT `group_by`/timing/`receiver`. Pattern: `team=` TAP routes first with `continue: true`, terminal `severity=` routes last.',
      'GROUPING bundles firing alerts sharing the `group_by` label values into ONE notification (a 50-pod failure = 1 page listing 50). `group_wait` (~30s) batches the initial burst; `group_interval` (~5m) rate-limits updates to a group; `repeat_interval` (~4h) re-nags an unchanged firing group. GOOD `group_by` = `alertname` + 1-2 scope labels (`cluster`, `service`); too broad merges unrelated incidents, too narrow (`+pod`) defeats grouping.',
      'RECEIVERS: `pagerduty_configs` / `slack_configs` / `email_configs` / `webhook_configs` (a generic POST → anything). A named receiver with NO configs = a black hole (drop the alert).',
      'INHIBITION = a config rule that auto-suppresses `target_matchers` alerts while a `source_matchers` alert fires, scoped by `equal` labels (a "DB down" page suppresses the "query slow" warnings it causes). A SILENCE = a manual, time-boxed, matcher-based mute with an expiry + a comment, for PLANNED disruption (a deploy, maintenance). Misuse: recreating a silence forever to mute a noisy alert — fix the alert instead (window-aware expr / an inhibit rule / retune).',
      'HA: run 2-3 Alertmanagers that GOSSIP; every Prometheus sends to all; the gossip dedups so a group notifies ONCE — best-effort, not a quorum (a partition risks a DUPLICATE, never a miss). VALIDATE OFFLINE: `amtool check-config alertmanager.yml` and `amtool config routes test --config.file=am.yml k=v …` (asserts which receiver a labelset routes to) — run both in CI.',
    ],
    keyTakeawaysHi: [
      'ALERTMANAGER firing alerts ko notifications mein badalता hai. ROUTING TREE: ek alert root se walk karता hai; FIRST matching child JEETTA hai aur routing STOP hota hai (jab tak `continue: true` nahi, jo ise baad ke siblings bhi match karने deta hai — ek alert 2 receivers kaise hit karता hai). Koi child match nahi → parent ka `receiver` (root ka catch-all). Children `group_by`/timing/`receiver` INHERIT karते hain. Pattern: `team=` TAP routes pehle `continue: true` ke saath, terminal `severity=` routes last.',
      'GROUPING firing alerts jo `group_by` label values share karते hain unhe EK notification mein bundle karता hai (ek 50-pod failure = 1 page jo 50 list karता hai). `group_wait` (~30s) initial burst batch karता hai; `group_interval` (~5m) ek group ke updates rate-limit karता hai; `repeat_interval` (~4h) ek unchanged firing group ko re-nag karता hai. ACHHA `group_by` = `alertname` + 1-2 scope labels; bahut broad merge karता hai, bahut narrow (`+pod`) grouping defeat karता hai.',
      'RECEIVERS: `pagerduty_configs` / `slack_configs` / `email_configs` / `webhook_configs` (ek generic POST). Ek named receiver bina configs ke = ek black hole (alert drop karो).',
      'INHIBITION = ek config rule jo `target_matchers` alerts ko auto-suppress karता hai jab ek `source_matchers` alert fire karता hai, `equal` labels se scoped (ek "DB down" page "query slow" warnings ko suppress karता hai). Ek SILENCE = ek manual, time-boxed, matcher-based mute ek expiry + ek comment ke saath, PLANNED disruption ke liye. Misuse: ek noisy alert ko mute karने ke liye ek silence hamesha recreate karना — alert khud fix karो.',
      'HA: 2-3 Alertmanagers chalाओ jo GOSSIP karते hain; har Prometheus sab ko bhejता hai; gossip dedups karता hai to ek group EK BAAR notify karता hai — best-effort, ek quorum nahi (ek partition ek DUPLICATE risk karता hai, kabhi ek miss nahi). OFFLINE VALIDATE: `amtool check-config alertmanager.yml` aur `amtool config routes test --config.file=am.yml k=v …` — dono CI mein chalाओ.',
    ],
  },

  {
    slug: 'ops-grafana-dashboards-datasources-and-variables',
    title: 'Grafana: Dashboards, Datasources & Variables',
    titleHi: 'Grafana: Dashboards, Datasources Aur Variables',
    description:
      'Grafana is the query and visualisation layer over Prometheus, Loki, Tempo, and dozens of other sources. This lesson covers datasources and the mixed-source panel, how a dashboard is a JSON document of panels and targets, template variables that turn one dashboard into a reusable view, the RED dashboard as a concrete build, dashboards as code, and where Grafana alerting fits versus Prometheus alerting.',
    descriptionHi:
      'Grafana Prometheus, Loki, Tempo, aur dozens doosre sources ke over query aur visualisation layer hai. Ye lesson datasources aur mixed-source panel cover karता hai, ek dashboard kaise panels aur targets ka ek JSON document hai, template variables jo ek dashboard ko ek reusable view mein badalते hain, RED dashboard ek concrete build ke roop mein, dashboards as code, aur Grafana alerting Prometheus alerting versus kahaan fit hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A newsroom\'s wall of screens.** Each screen (panel) is wired to a feed (a datasource) and shows one story, drawn from a standing query. A producer can build one screen that says "show the top story for whichever city I select from this dropdown" (a template variable) so the same layout serves every bureau. The wall\'s layout is written down as a script (the dashboard JSON) so it can be rebuilt exactly, version-controlled, and rolled out to every bureau. And the wall does not decide what is breaking news — that call comes from the wire service\'s own alert desk (Prometheus/Alertmanager); the wall just makes it visible.',
      hi: '**Ek newsroom ki screens ki wall.** Har screen (panel) ek feed (ek datasource) se wired hai aur ek story dikhाता hai, ek standing query se drawn. Ek producer ek screen bana sakता hai jo kehता hai "jo bhi city main is dropdown se select karता hoon uske liye top story dikhाओ" (ek template variable) taaki wahi layout har bureau serve kare. Wall ka layout ek script (dashboard JSON) ke roop mein likhा gaya hai taaki ise exactly rebuild kiya ja sake, version-controlled, aur har bureau ko rolled out. Aur wall decide nahi karती kya breaking news hai — wo call wire service ke apne alert desk se aata hai (Prometheus/Alertmanager); wall bas ise visible banाती hai.',
    },

    simple: `**GRAFANA** = query + visualise, over many datasources. It stores no metrics
itself; it asks the source at query time.

**DATASOURCES:**
\`\`\`
Prometheus / Mimir / Thanos   PromQL     - metrics
Loki                          LogQL      - logs
Tempo / Jaeger                TraceQL    - traces
+ many: PostgreSQL, CloudWatch, Elasticsearch, InfluxDB, ...
- provision them as YAML (not click-ops) so they're reproducible.
- a "Mixed" datasource lets ONE panel query several sources (logs + metrics together).
- one datasource is the DEFAULT; panels reference a datasource by UID.
\`\`\`

**A DASHBOARD IS JSON** — a document of:
\`\`\`
{ "title", "uid", "tags", "templating": { "list": [ ...variables... ] },
  "panels": [
    { "type": "timeseries" | "stat" | "table" | "heatmap" | "logs" | ...,
      "gridPos": {x,y,w,h},              # 24-column grid
      "targets": [ { "datasource", "expr": "<PromQL>", "legendFormat": "{{route}}" } ],
      "fieldConfig": { units, thresholds, color mode, ... } } ] }
\`\`\`
you CAN build it in the UI, but the JSON is the artifact - export it, commit it.

**TEMPLATE VARIABLES** — turn one dashboard into N views. Types:
\`\`\`
QUERY      options come from a datasource query:
             label_values(http_requests_total, service)   -> a dropdown of services
             label_values(http_requests_total{service="$service"}, route)  -> chained
CUSTOM     a hand-typed list.   INTERVAL  a list of durations for $__rate_interval.
DATASOURCE a picker for which Prometheus (prod / staging).   CONSTANT / TEXTBOX / ADHOC.
\`\`\`
use in a query as \`$service\` or \`\${service}\`; multi-value -> \`=~"\${service:regex}"\`.
built-ins: \`$__range\`, \`$__interval\`, \`$__rate_interval\` (use this in \`rate()\` -
it adapts the window to the zoom level so a rate is never computed over too few points).

**THE RED DASHBOARD** (Module 15 L4) — one row, templated by \`$service\`:
\`\`\`
RATE panel:     sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)
ERRORS panel:   sum(rate(http_requests_total{service="$service",status=~"5.."}[$__rate_interval])) by (route)
                / sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)
LATENCY panel:  histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="$service"}[$__rate_interval])) by (le, route))
                + the same for 0.50 and 0.90 on the same panel
\`\`\`
one JSON, works for every service - pick from the dropdown.

**DASHBOARDS AS CODE:**
\`\`\`
- provisioning: drop dashboard JSON files in a folder Grafana watches (via a
  ConfigMap / a sidecar) -> UI edits are NON-persistent, git is the source of truth.
- generate the JSON: Grafonnet (jsonnet), grafana-foundation-sdk, or the Terraform
  grafana provider - so 40 services get an identical RED dashboard from one template.
- test: 'dashboard-linter', or CI that renders + diffs.
\`\`\`

**GRAFANA ALERTING vs PROMETHEUS ALERTING:**
\`\`\`
PROMETHEUS rules   evaluated by Prometheus, in the metrics path, versioned with your
                  code, testable with promtool. PREFER for anything metric-based.
GRAFANA alerting   evaluated by Grafana; can span MULTIPLE datasources in one rule
                  (metric AND log AND a SQL query), has a built-in UI. use when a
                  rule genuinely needs cross-source logic Prometheus can't express.
both route to the SAME Alertmanager. don't run two parallel alerting systems by accident.
\`\`\`

**ANNOTATIONS** — vertical markers on a graph for events (a deploy, an incident),
from a query or the API. put your deploy pipeline's "deployed vN" on every dashboard.`,

    simpleHi: `**GRAFANA** = kई datasources ke over query + visualise. Ye khud koi metrics store
nahi karता; ye query time par source se poochता hai.

**DATASOURCES:**
\`\`\`
Prometheus / Mimir / Thanos   PromQL     - metrics
Loki                          LogQL      - logs
Tempo / Jaeger                TraceQL    - traces
+ kई: PostgreSQL, CloudWatch, Elasticsearch, InfluxDB, ...
- unhe YAML ke roop mein provision karो (click-ops nahi) taaki wo reproducible hon.
- ek "Mixed" datasource EK panel ko kई sources query karने deta hai.
- ek datasource DEFAULT hai; panels ek datasource ko UID se reference karते hain.
\`\`\`

**EK DASHBOARD JSON HAI** — ek document of:
\`\`\`
{ "title", "uid", "tags", "templating": { "list": [ ...variables... ] },
  "panels": [
    { "type": "timeseries" | "stat" | "table" | "heatmap" | "logs" | ...,
      "gridPos": {x,y,w,h},              # 24-column grid
      "targets": [ { "datasource", "expr": "<PromQL>", "legendFormat": "{{route}}" } ],
      "fieldConfig": { units, thresholds, color mode, ... } } ] }
\`\`\`
aap ise UI mein bana SAKTE ho, par JSON artifact hai - export karो, commit karो.

**TEMPLATE VARIABLES** — ek dashboard ko N views mein badalो. Types:
\`\`\`
QUERY      options ek datasource query se aate hain:
             label_values(http_requests_total, service)   -> services ka ek dropdown
             label_values(http_requests_total{service="$service"}, route)  -> chained
CUSTOM     ek hand-typed list.   INTERVAL  $__rate_interval ke liye durations ki ek list.
DATASOURCE kaun sा Prometheus (prod / staging) ke liye ek picker.   CONSTANT / TEXTBOX / ADHOC.
\`\`\`
ek query mein \`$service\` ya \`\${service}\` ke roop mein use karो.
built-ins: \`$__range\`, \`$__interval\`, \`$__rate_interval\` (ise \`rate()\` mein use karो -
ye window ko zoom level ke adapt karता hai).

**RED DASHBOARD** (Module 15 L4) — ek row, \`$service\` se templated:
\`\`\`
RATE panel:     sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)
ERRORS panel:   sum(rate(http_requests_total{service="$service",status=~"5.."}[$__rate_interval])) by (route)
                / sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)
LATENCY panel:  histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="$service"}[$__rate_interval])) by (le, route))
\`\`\`
ek JSON, har service ke liye kaam karता hai.

**DASHBOARDS AS CODE:**
\`\`\`
- provisioning: dashboard JSON files ek folder mein daalो jise Grafana watch karता hai
  -> UI edits NON-persistent hain, git source of truth hai.
- JSON generate karो: Grafonnet (jsonnet), ya Terraform grafana provider - taaki 40
  services ek template se ek identical RED dashboard paें.
\`\`\`

**GRAFANA ALERTING vs PROMETHEUS ALERTING:**
\`\`\`
PROMETHEUS rules   Prometheus dwara evaluated, metrics path mein, aapke code ke saath
                  versioned, promtool se testable. kisi bhi metric-based cheez ke liye PREFER.
GRAFANA alerting   Grafana dwara evaluated; ek rule mein MULTIPLE datasources span kar sakता
                  hai. use jab ek rule genuinely cross-source logic chahिए.
dono SAME Alertmanager ko route karते hain.
\`\`\`

**ANNOTATIONS** — ek graph par events ke liye vertical markers (ek deploy, ek incident).`,

    content: `## What Grafana is

Grafana queries and visualises; it does not store telemetry. Every panel issues a query to a **datasource** at the moment it renders, so Grafana is a thin, stateless layer over Prometheus, Loki, Tempo, and dozens of others (PostgreSQL, CloudWatch, Elasticsearch, InfluxDB). Datasources should be **provisioned as YAML** — dropped into a directory Grafana reads at startup — rather than added by clicking, so they are reproducible across environments and version-controlled. One datasource is the default; every panel references a datasource by its UID. A special "Mixed" datasource lets a single panel run queries against several sources at once, which is how you put a metric and its related log lines on the same graph.

## A dashboard is a JSON document

A Grafana dashboard is fundamentally a JSON object: a title, a UID, tags, a \`templating\` block holding the variables, and a \`panels\` array. Each panel has a \`type\` (\`timeseries\`, \`stat\`, \`table\`, \`heatmap\`, \`logs\`, \`gauge\`, and more), a \`gridPos\` placing it on the 24-column grid, one or more \`targets\` (each a datasource plus a query expression plus a \`legendFormat\` template), and a \`fieldConfig\` controlling units, thresholds, colour, and axis behaviour. You can assemble all of this in the UI, but the JSON is the real artifact — the thing you export, review, and commit.

## Template variables

A template variable turns one dashboard into many. The most useful type is **query**: its dropdown options come from a datasource query, typically \`label_values(some_metric, some_label)\` to list every value of a label, and variables can be **chained** so \`label_values(http_requests_total{service="$service"}, route)\` narrows the route list to the selected service. Other types: **custom** (a hand-typed list), **interval** (durations, feeding \`$__rate_interval\`), **datasource** (a picker to swap the whole dashboard between the prod and staging Prometheus), and \`constant\`, \`textbox\`, and \`adhoc\`.

You reference a variable in a query as \`$service\` or \`\${service}\`, and for a multi-value variable you use the regex form \`service=~"\${service:regex}"\`. Grafana also provides built-in variables: \`$__range\` (the current time range), \`$__interval\` (the step Grafana chose for the current width), and \`$__rate_interval\` — which you should use inside \`rate()\` instead of a fixed \`[5m]\`, because it adapts the window to the zoom level and always keeps it at least four scrape intervals wide, so a rate is never computed over too few points when the user zooms in.

## The RED dashboard

The RED method from Module 15 becomes one concrete Grafana row, templated by a \`$service\` query variable. The rate panel sums \`rate(http_requests_total{service="$service"}[$__rate_interval])\` by route. The errors panel divides the 5xx rate by the total rate, both summed by route. The latency panel puts p50, p90, and p99 as three series on one graph using \`histogram_quantile\` over the summed bucket rates. This is a single dashboard JSON that works for every service in the estate — the operator picks the service from the dropdown.

## Dashboards as code

For anything beyond a personal scratch dashboard, the dashboard JSON belongs in version control and is deployed by **provisioning**: Grafana watches a directory (populated from a ConfigMap and a sidecar, or by a config-management tool), and dashboards loaded that way are read-only in the UI, so edits do not silently diverge from the committed version. To avoid hand-editing large JSON, the JSON is **generated** from a higher-level definition — Grafonnet (a jsonnet library), the grafana-foundation-sdk, or the Terraform Grafana provider — so a template applied to a list of forty services produces forty identical RED dashboards. A linter such as \`dashboard-linter\`, or a CI step that renders and diffs, catches regressions.

## Grafana alerting versus Prometheus alerting

Both can evaluate alert rules and both route to the same Alertmanager, so the question is which evaluates a given rule. **Prometheus alerting rules** are evaluated by Prometheus itself, live alongside your metrics and your code, version with your application, and are unit-testable with \`promtool\`. Prefer them for anything expressible in PromQL. **Grafana alerting** is evaluated by Grafana and can combine multiple datasources in a single rule — a metric condition *and* a log-query condition *and* a SQL result — and has a built-in editing UI. Use it only when a rule genuinely needs cross-source logic that Prometheus cannot express. The failure mode to avoid is running both systems in parallel by accident, so an alert exists in two places with slightly different definitions and nobody is sure which one fired.

## Annotations

An **annotation** is a vertical marker on a time-series panel tied to a moment or a range — a deployment, an incident, a config change. Annotations can come from a query (against a datasource that records events) or be pushed via the API. Wiring your deployment pipeline to post a "deployed vN" annotation to every dashboard is one of the highest-value small integrations in observability: when a graph turns bad, the first question is "what changed", and the answer is often a vertical line three minutes to the left.`,

    contentHi: `## Grafana kya hai

Grafana query aur visualise karता hai; ye telemetry store nahi karता. Har panel ek **datasource** ko ek query issue karता hai us moment jab ye render hota hai, to Grafana Prometheus, Loki, Tempo, aur dozens doosron ke over ek thin, stateless layer hai. Datasources ko **YAML ke roop mein provision** kiya jaना chahिए — ek directory mein daalा jaता hai jise Grafana startup par read karता hai — clicking se add karने ke bajaay. Ek special "Mixed" datasource ek single panel ko ek saath kई sources ke against queries run karने deta hai.

## Ek dashboard ek JSON document hai

Ek Grafana dashboard fundamentally ek JSON object hai: ek title, ek UID, tags, ek \`templating\` block jo variables rakhता hai, aur ek \`panels\` array. Har panel ke paas ek \`type\`, ek \`gridPos\`, ek ya zyada \`targets\`, aur ek \`fieldConfig\` hai. Aap ye sab UI mein assemble kar sakते ho, par JSON real artifact hai.

## Template variables

Ek template variable ek dashboard ko kई mein badalता hai. Sabse useful type **query** hai: iske dropdown options ek datasource query se aate hain, typically \`label_values(some_metric, some_label)\`. Variables **chained** ho sakते hain. Doosre types: **custom**, **interval**, **datasource**.

Aap ek variable ko ek query mein \`$service\` ya \`\${service}\` ke roop mein reference karते ho. Grafana built-in variables bhi provide karता hai: \`$__range\`, \`$__interval\`, aur \`$__rate_interval\` — jise aapko \`rate()\` ke andar use karना chahिए ek fixed \`[5m]\` ke bajaay, kyunki ye window ko zoom level ke adapt karता hai.

## RED dashboard

Module 15 se RED method ek concrete Grafana row ban jaता hai, ek \`$service\` query variable se templated. Rate panel \`rate(http_requests_total{service="$service"}[$__rate_interval])\` ko route se sum karता hai. Errors panel 5xx rate ko total rate se divide karता hai. Latency panel p50, p90, aur p99 ko teen series ke roop mein ek graph par daalता hai. Ye ek single dashboard JSON hai jo estate mein har service ke liye kaam karता hai.

## Dashboards as code

Kisi bhi cheez ke liye ek personal scratch dashboard se aage, dashboard JSON version control mein belong karता hai aur **provisioning** dwara deployed hai. Large JSON hand-editing avoid karने ke liye, JSON ek higher-level definition se **generated** hai — Grafonnet, ya Terraform Grafana provider.

## Grafana alerting versus Prometheus alerting

Dono alert rules evaluate kar sakते hain aur dono same Alertmanager ko route karते hain. **Prometheus alerting rules** Prometheus khud dwara evaluated hain, aapke metrics aur aapke code ke alongside rehते hain, aur \`promtool\` se unit-testable hain. Kisi bhi cheez ke liye jo PromQL mein expressible hai unhe prefer karो. **Grafana alerting** Grafana dwara evaluated hai aur ek single rule mein multiple datasources combine kar sakता hai.

## Annotations

Ek **annotation** ek time-series panel par ek vertical marker hai ek moment ya ek range se tied — ek deployment, ek incident, ek config change. Apne deployment pipeline ko har dashboard par ek "deployed vN" annotation post karने ke liye wire karना observability mein sabse high-value chhote integrations mein se ek hai.`,

    examples: [
      {
        title: 'The RED dashboard row as JSON: three panels, one $service variable',
        titleHi: 'RED dashboard row JSON ke roop mein: teen panels, ek $service variable',
        code: `# (illustrative dashboard JSON - the shape, not a full file)
{
  "title": "Service RED",
  "uid": "service-red",
  "templating": { "list": [
    { "name": "service", "type": "query", "datasource": "Prometheus",
      "query": "label_values(http_requests_total, service)",
      "current": { "value": "checkout" }, "includeAll": false }
  ]},
  "panels": [
    { "title": "Rate (req/s) by route", "type": "timeseries",
      "gridPos": { "x": 0, "y": 0, "w": 8, "h": 8 },
      "targets": [ { "datasource": "Prometheus",
        "expr": "sum(rate(http_requests_total{service=\\"$service\\"}[$__rate_interval])) by (route)",
        "legendFormat": "{{route}}" } ],
      "fieldConfig": { "defaults": { "unit": "reqps" } } },

    { "title": "Error ratio by route", "type": "timeseries",
      "gridPos": { "x": 8, "y": 0, "w": 8, "h": 8 },
      "targets": [ { "datasource": "Prometheus",
        "expr": "sum(rate(http_requests_total{service=\\"$service\\",status=~\\"5..\\"}[$__rate_interval])) by (route) / sum(rate(http_requests_total{service=\\"$service\\"}[$__rate_interval])) by (route)",
        "legendFormat": "{{route}}" } ],
      "fieldConfig": { "defaults": { "unit": "percentunit", "max": 0.1,
        "thresholds": { "steps": [ {"value": null, "color": "green"},
                                   {"value": 0.02, "color": "red"} ] } } } },

    { "title": "Latency p50 / p90 / p99", "type": "timeseries",
      "gridPos": { "x": 16, "y": 0, "w": 8, "h": 8 },
      "targets": [
        { "datasource": "Prometheus", "legendFormat": "p50",
          "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket{service=\\"$service\\"}[$__rate_interval])) by (le, route))" },
        { "datasource": "Prometheus", "legendFormat": "p90",
          "expr": "histogram_quantile(0.90, sum(rate(http_request_duration_seconds_bucket{service=\\"$service\\"}[$__rate_interval])) by (le, route))" },
        { "datasource": "Prometheus", "legendFormat": "p99",
          "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\\"$service\\"}[$__rate_interval])) by (le, route))" }
      ],
      "fieldConfig": { "defaults": { "unit": "s" } } }
  ]
}
# provision this one file. every service in  label_values(...)  is in the dropdown.
# generate it from Grafonnet/Terraform if you want it per-team-folder x 40 services.`,
        output: `One dashboard JSON, one $service query variable (its options = every value of the
'service' label), three panels. RATE sums the request rate by route. ERROR RATIO
divides the 5xx rate by the total, with a red threshold at 2%. LATENCY plots p50,
p90, p99 as three series so the gap between them (a growing tail) is visible.
$__rate_interval in every rate() adapts the window to the zoom. Pick any service
from the dropdown and the whole row re-renders for it - one artifact, N views.`,
        explain: 'The RED method translated into a real Grafana dashboard. The \`templating\` block defines one variable, \`service\`, whose dropdown is populated by \`label_values(http_requests_total, service)\` — every distinct value the \`service\` label takes, discovered from the data. The three panels are laid out side by side on the grid, each eight columns wide. The rate panel sums the request rate by route and displays it in requests per second. The error-ratio panel divides the 5xx rate by the total rate, both grouped by route, formats it as a percentage, and colours it red above two percent so a breach is visible at a glance. The latency panel runs three targets on one graph — \`histogram_quantile\` at 0.5, 0.9, and 0.99 over the summed bucket rates — so the operator sees the typical latency, the common tail, and the worst case together, and a widening gap between p50 and p99 is immediately apparent. Every \`rate()\` uses \`$__rate_interval\` rather than a hardcoded window so the calculation stays valid as the user zooms in and out. Because the whole thing is parameterised on \`$service\`, this single JSON file serves every service in the system; provisioning it once, or generating it per team from a template, gives a consistent RED view everywhere with no per-service dashboard maintenance.',
        explainHi: 'RED method ek real Grafana dashboard mein translated. \`templating\` block ek variable define karता hai, \`service\`, jiska dropdown \`label_values(http_requests_total, service)\` dwara populated hai — har distinct value jo \`service\` label leता hai. Teen panels grid par side by side laid out hain. Rate panel request rate ko route se sum karता hai. Error-ratio panel 5xx rate ko total rate se divide karता hai, ise ek percentage ke roop mein format karता hai, aur ise do percent ke upar red colour karता hai. Latency panel ek graph par teen targets run karता hai — \`histogram_quantile\` 0.5, 0.9, aur 0.99 par — to operator typical latency, common tail, aur worst case ek saath dekhता hai. Har \`rate()\` \`$__rate_interval\` use karता hai. Kyunki poori cheez \`$service\` par parameterised hai, ye single JSON file system mein har service serve karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# editing dashboards in the UI on a Grafana that isn't provisioned from git
  # the on-call tweaks a panel query during an incident to see something. it works.
  # they save. now the "official" dashboard has an ad-hoc change nobody reviewed.
  # 3 months later: 40 dashboards, each subtly different, none matching any repo.
  # a Grafana upgrade / a DB restore loses the ones that were never exported.
  # nobody can answer "what does the RED dashboard's error panel actually query?"`,
        right: `# provision dashboards from version control; UI edits are ephemeral:
  #   grafana/provisioning/dashboards/dashboards.yaml:
  #     apiVersion: 1
  #     providers:
  #       - name: 'git-dashboards'
  #         type: file
  #         allowUiUpdates: false            # <- UI 'Save' is disabled for these
  #         options: { path: /var/lib/grafana/dashboards }
  #   deliver the JSON via a ConfigMap + the grafana sidecar (k8s), or config-mgmt.
  #   to change a dashboard: edit the JSON, PR it, merge -> it deploys.
  #   for exploration: "Save as..." to a personal folder, or use Explore (no save).
  #   generate the 40 service dashboards from ONE Grafonnet/Terraform template.`,
        why: 'A Grafana instance where dashboards are created and edited through the UI accumulates drift the same way any click-configured system does. During an incident someone adjusts a panel to investigate, it helps, they save it, and now the shared dashboard carries an unreviewed change. Repeated across many people and many months, the result is dozens of dashboards that are each slightly different, none of which corresponds to anything in version control, and whose queries nobody can fully account for. A Grafana version upgrade that changes the JSON schema, or a restore of the Grafana database, then silently loses whichever dashboards were never exported. The fix is to provision dashboards from files that Grafana reads at startup, with UI saving disabled for provisioned dashboards so an edit cannot persist, and to treat the JSON in the repository as the only source of truth — a dashboard change is a pull request. Exploration still works: a personal copy in a personal folder, or the Explore view which does not save. For a fleet of similar services the dashboards are generated from a single template with Grafonnet or the Terraform provider, so all forty stay identical by construction.',
        whyHi: 'Ek Grafana instance jahaan dashboards UI ke through created aur edited hote hain drift accumulate karता hai usi tarah jaise koi bhi click-configured system karता hai. Ek incident ke dauraan koi ek panel adjust karता hai investigate karने ke liye, ye help karता hai, wo ise save karते hain, aur ab shared dashboard ek unreviewed change carry karता hai. Kई log aur kई mahine ke across repeated, result dozens dashboards hain jo har ek thoda different hai. Fix dashboards ko files se provision karना hai jinhe Grafana startup par read karता hai, provisioned dashboards ke liye UI saving disabled ke saath, aur repository mein JSON ko ekmatra source of truth ke roop mein treat karना. Ek fleet ke liye dashboards ek single template se generated hain.',
      },
      {
        wrong: `# a hardcoded [5m] in every rate() -> broken graphs at high zoom
  sum(rate(http_requests_total{service="$service"}[5m])) by (route)
  # at a 24h view: fine. but zoom into a 15-minute window during an incident and
  # Grafana's step becomes ~5s, while the rate window is still 5m -> the graph is
  # heavily smoothed, a 90-second spike is barely a bump, and you can't see the
  # shape of what just happened. exactly when resolution matters most, you have least.`,
        right: `# use $__rate_interval - Grafana sizes the window to the current view:
  sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)
  # $__rate_interval = max(4 * scrape_interval, $__interval + scrape_interval).
  #   - it's ALWAYS at least 4 scrape intervals (so a rate has enough points)
  #   - it GROWS when you zoom out (fewer, wider points - efficient)
  #   - it SHRINKS toward that minimum when you zoom in (sharp, responsive)
  # for a fixed alerting rule (evaluated at a fixed cadence) a literal [5m] is
  # correct - $__rate_interval is a DASHBOARD thing, not an alert thing.`,
        why: 'The window in \`rate(metric[window])\` is the period over which the per-second rate is averaged, and on a dashboard the right window depends on how far the user has zoomed. A fixed \`[5m]\` is reasonable at a day-long view where each plotted point covers several minutes anyway, but when the user zooms into a fifteen-minute window during an incident, Grafana narrows its rendering step to a few seconds while the rate window stays at five minutes, so every point is a five-minute average and a ninety-second spike is flattened into a gentle rise. The resolution collapses exactly when the incident makes fine detail most valuable. \`$__rate_interval\` fixes this: Grafana computes it as the larger of four scrape intervals and the current rendering step plus one scrape interval, so it is never so small that a rate has too few samples to compute, it widens automatically as the user zooms out for efficiency, and it shrinks toward the four-interval floor as the user zooms in for sharpness. It belongs in every \`rate\` on a dashboard. A Prometheus alerting rule is different — it evaluates at a fixed interval, so a literal window like \`[5m]\` is correct there and \`$__rate_interval\` is not available.',
        whyHi: '\`rate(metric[window])\` mein window wo period hai jiske over per-second rate averaged hai, aur ek dashboard par right window depend karता hai user kitna zoom kiya hai. Ek fixed \`[5m]\` ek day-long view par reasonable hai, par jab user ek pandrah-minute window mein zoom karता hai ek incident ke dauraan, Grafana apna rendering step kuch second tak narrow karता hai jabki rate window paanch minute par rehता hai, to har point ek paanch-minute average hai aur ek navve-second spike ek gentle rise mein flatten ho jaता hai. \`$__rate_interval\` ise fix karता hai: Grafana ise chaar scrape intervals aur current rendering step plus ek scrape interval ke larger ke roop mein compute karता hai. Ye ek dashboard par har \`rate\` mein belong karता hai.',
      },
      {
        wrong: `# running the same alert in BOTH Prometheus and Grafana
  # someone builds a "checkout error rate > 2%" alert in the Grafana UI because
  # it was quick. later, someone else adds the same alert as a Prometheus rule
  # because that's where the team keeps alerts.
  # now: two alerts, two definitions (slightly different windows / thresholds),
  # two evaluation engines, both -> the same Alertmanager -> on-call gets TWO
  # pages for one problem, or worse, one is silently broken and everyone assumes
  # the other is covering it.`,
        right: `# ONE alerting system per rule. default to Prometheus rules:
  #   - lives in the rules repo, versioned with the code
  #   - unit-tested with  promtool test rules
  #   - the SAME expr a recording rule / a dashboard uses
  # use GRAFANA alerting ONLY for rules that genuinely need cross-datasource logic
  #   (e.g. "metric X is high AND a matching error appears in Loki" in one rule).
  #   document WHICH alerts live in Grafana and why.
  # both still route to the same Alertmanager - that part is fine and intended.`,
        why: 'Grafana and Prometheus can each evaluate alerting rules, and both send the results to the same Alertmanager, which is the intended architecture — but it means the same logical alert can accidentally exist in both systems. This usually happens by convenience: someone builds an alert in the Grafana UI because it is a few clicks, and later someone codifies what they believe is the same alert as a Prometheus rule because that is where the team\'s alerts are kept. The two definitions drift — different windows, different thresholds, different \`for\` durations — and both fire into Alertmanager, so a single incident produces two pages, or one of the two is quietly misconfigured and everyone assumes the other one covers the case. The discipline is one evaluation engine per rule, defaulting to Prometheus rules because they live in the rules repository with the code, are unit-testable with \`promtool\`, and can share an expression with a recording rule or a dashboard. Grafana alerting is reserved for the specific case a rule needs logic across datasources that Prometheus cannot express — a metric condition combined with a log-query condition in one rule — and those alerts are explicitly documented as living in Grafana so nobody re-creates them in Prometheus.',
        whyHi: 'Grafana aur Prometheus har ek alerting rules evaluate kar sakते hain, aur dono results ko same Alertmanager ko bhejते hain, jo intended architecture hai — par iska matlab same logical alert accidentally dono systems mein exist kar sakता hai. Ye usually convenience se hota hai: koi Grafana UI mein ek alert banाता hai kyunki ye kuch clicks hai, aur baad mein koi jo wo believe karता hai wahi alert hai use ek Prometheus rule ke roop mein codify karता hai. Do definitions drift karती hain aur dono Alertmanager mein fire karती hain, to ek single incident do pages produce karता hai. Discipline per rule ek evaluation engine hai, Prometheus rules ko default karके.',
      },
    ],

    realWorld: [
      {
        en: '**40 drifted dashboards, none in git** — a team edited dashboards in the UI for two years. A Grafana 10 → 11 upgrade broke several panels and there were no committed copies to restore. Rebuilding took weeks; now every dashboard is provisioned from a repo with `allowUiUpdates: false` and the service dashboards are Grafonnet-generated.',
        hi: '**40 drifted dashboards, koi git mein nahi** — ek team ne do saal UI mein dashboards edit kiye. Ek Grafana 10 → 11 upgrade ne kई panels tode aur restore karne ke liye koi committed copies nahi the. Ab har dashboard ek repo se provisioned hai.',
      },
      {
        en: '**Hardcoded `[5m]`, invisible spike** — during an incident the on-call zoomed into a 10-minute window and the graph looked calm because every `rate()` used `[5m]` and heavily smoothed a 2-minute error burst. Switching all dashboard rates to `$__rate_interval` made the same zoom show the burst clearly.',
        hi: '**Hardcoded `[5m]`, invisible spike** — ek incident ke dauraan on-call ne ek 10-minute window mein zoom kiya aur graph calm dikha kyunki har `rate()` ne `[5m]` use kiya. Saare dashboard rates ko `$__rate_interval` par switch karna same zoom ko burst clearly dikhaya.',
      },
      {
        en: '**Two "error rate" alerts, one broken** — the same alert existed as a Grafana alert and a Prometheus rule with different thresholds (2% vs 5%). The Grafana one had been broken by a datasource UID change for months; everyone assumed the Prometheus one (5%, too loose) was the real one. Consolidated to one Prometheus rule.',
        hi: '**Do "error rate" alerts, ek broken** — same alert ek Grafana alert aur ek Prometheus rule ke roop mein exist kiya different thresholds ke saath. Grafana wala ek datasource UID change se mahino tode tha. Ek Prometheus rule mein consolidate kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is Grafana\'s role in the stack, and why should dashboards be code rather than UI-edited?',
        qHi: 'Stack mein Grafana ka role kya hai, aur dashboards UI-edited ke bajaay code kyun hone chahिए?',
        a: 'Grafana is the query and visualisation layer. It stores no telemetry of its own — every panel issues a query to a datasource at render time, so Grafana is a thin stateless front end over Prometheus, Loki, Tempo, and many other sources. A dashboard is fundamentally a JSON document: a templating block of variables and a panels array where each panel has a type, a grid position, one or more query targets, and field configuration for units and thresholds. Dashboards should be code because a Grafana instance edited through the UI drifts exactly as any click-configured system does. During incidents people adjust panels and save them, and over months the result is dozens of dashboards that are each slightly different and none of which matches anything in version control. A Grafana upgrade that changes the JSON schema, or a database restore, then silently loses whatever was never exported, and nobody can fully account for what a given panel queries. Provisioning dashboards from files that Grafana reads at startup, with UI saving disabled for those dashboards, makes the committed JSON the only source of truth — a change is a pull request. For a fleet of similar services the JSON is generated from one template with Grafonnet or the Terraform provider, so forty services get an identical RED dashboard that stays consistent by construction. Exploration still works through a personal copy or the Explore view.',
        aHi: 'Grafana query aur visualisation layer hai. Ye apna koi telemetry store nahi karता — har panel render time par ek datasource ko ek query issue karता hai, to Grafana Prometheus, Loki, Tempo, aur kई doosre sources ke over ek thin stateless front end hai. Ek dashboard fundamentally ek JSON document hai. Dashboards code hone chahिए kyunki UI ke through edited ek Grafana instance drift karता hai. Incidents ke dauraan log panels adjust karते hain aur unhe save karते hain, aur mahino ke over result dozens dashboards hain jo har ek thoda different hai. Files se dashboards provision karना, un dashboards ke liye UI saving disabled ke saath, committed JSON ko ekmatra source of truth banाता hai.',
      },
      {
        q: 'What is a template variable, and why use $__rate_interval instead of a fixed window on a dashboard?',
        qHi: 'Ek template variable kya hai, aur ek dashboard par ek fixed window ke bajaay $__rate_interval kyun use karें?',
        a: 'A template variable turns one dashboard into many parameterised views. The most useful kind is a query variable, whose dropdown options come from a datasource query such as label_values(http_requests_total, service) to list every value of a label, and variables can be chained so a route variable is filtered to the currently selected service. You reference it in a query as $service, and for a multi-value selection you use the regex form. Other types include a datasource variable to swap the whole dashboard between prod and staging Prometheus, and interval variables. The RED dashboard is the canonical use: one dashboard JSON with a $service query variable, and three panels for rate, error ratio, and latency percentiles, serves every service in the estate. $__rate_interval is a built-in variable that Grafana computes as the larger of four scrape intervals and the current rendering step plus one scrape interval. You use it inside rate() on a dashboard rather than a fixed window like [5m] because the right window depends on how far the user has zoomed. A fixed five-minute window is fine at a day-long view but when the user zooms into a fifteen-minute window during an incident, Grafana narrows its step to seconds while the rate window stays at five minutes, so every point is a five-minute average and a ninety-second spike is smoothed into a gentle rise — the resolution collapses exactly when detail matters most. $__rate_interval widens when zoomed out and shrinks toward the four-interval floor when zoomed in. It is a dashboard concern only; a Prometheus alerting rule evaluates at a fixed cadence so a literal window is correct there.',
        aHi: 'Ek template variable ek dashboard ko kई parameterised views mein badalता hai. Sabse useful kind ek query variable hai, jiske dropdown options ek datasource query se aate hain jaise label_values(http_requests_total, service). Aap ise ek query mein $service ke roop mein reference karते ho. RED dashboard canonical use hai: ek dashboard JSON ek $service query variable ke saath. $__rate_interval ek built-in variable hai jise Grafana chaar scrape intervals aur current rendering step plus ek scrape interval ke larger ke roop mein compute karता hai. Aap ise ek dashboard par rate() ke andar use karते ho ek fixed window ke bajaay kyunki right window depend karता hai user kitna zoom kiya hai. Jab user ek incident ke dauraan zoom karता hai, ek fixed paanch-minute window ek navve-second spike ko smooth karता hai.',
      },
      {
        q: 'When would you use Grafana alerting instead of Prometheus alerting rules?',
        qHi: 'Aap Prometheus alerting rules ke bajaay Grafana alerting kab use karें?',
        a: 'Both can evaluate alert rules and both route to the same Alertmanager, so the question is which engine evaluates a given rule. The default should be Prometheus alerting rules, for several reasons: they live in the rules repository alongside the application code, they version with it, they are unit-testable with promtool test rules so you can prove an alert fires when it should before deploying, and they can share an expression with a recording rule or a dashboard so there is one canonical definition. Anything expressible in PromQL belongs there. Grafana alerting is evaluated by Grafana and its distinguishing capability is combining multiple datasources in a single rule — a metric condition and a log-query condition and a SQL result in one alert expression — which Prometheus cannot do because it only knows about metrics. Use Grafana alerting only for the specific case where a rule genuinely needs that cross-datasource logic, and document explicitly which alerts live in Grafana and why, so nobody re-creates them as Prometheus rules. The failure to avoid is the same logical alert existing in both systems with slightly different definitions, both firing into Alertmanager, so an incident produces two pages or one is quietly broken while everyone assumes the other covers it.',
        aHi: 'Dono alert rules evaluate kar sakते hain aur dono same Alertmanager ko route karते hain. Default Prometheus alerting rules hone chahिए, kई reasons ke liye: wo rules repository mein application code ke alongside rehते hain, wo iske saath version karते hain, wo promtool test rules se unit-testable hain, aur wo ek recording rule ya ek dashboard ke saath ek expression share kar sakते hain. Kuch bhi jo PromQL mein expressible hai wahaan belong karता hai. Grafana alerting Grafana dwara evaluated hai aur iski distinguishing capability ek single rule mein multiple datasources combine karना hai. Grafana alerting sirf us specific case ke liye use karो jahaan ek rule genuinely wo cross-datasource logic chahिए. Avoid karने wala failure same logical alert ka dono systems mein exist karना hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain what Grafana is (datasources, the JSON dashboard, panels/targets), template variables (types + how to reference), and $__rate_interval.',
        taskHi: 'Ek comment mein, Grafana samjhao.',
        hint: 'GRAFANA = query + visualise over MANY datasources; stores NO telemetry itself — every panel issues a query to a datasource AT RENDER TIME (a thin, stateless layer). DATASOURCES: Prometheus/Mimir/Thanos (PromQL — metrics), Loki (LogQL — logs), Tempo/Jaeger (TraceQL — traces), + PostgreSQL / CloudWatch / Elasticsearch / … PROVISION them as YAML (a directory Grafana reads at startup), not click-ops → reproducible + version-controlled. One is the DEFAULT; panels reference a datasource by UID. A special "MIXED" datasource lets ONE panel query SEVERAL sources at once (a metric + its log lines on one graph). A DASHBOARD IS JSON: `{ title, uid, tags, templating: { list: [ variables ] }, panels: [ ... ] }`. Each PANEL: a `type` (`timeseries` / `stat` / `table` / `heatmap` / `logs` / `gauge` / …), a `gridPos` {x,y,w,h} on a 24-COLUMN grid, one+ `targets` (each = a `datasource` + an `expr` (PromQL) + a `legendFormat` template like `{{route}}`), a `fieldConfig` (units / thresholds / colour / axes). You CAN build it in the UI but the JSON is the ARTIFACT — export it, commit it. TEMPLATE VARIABLES turn ONE dashboard into N views. TYPES: QUERY (options from a datasource query — `label_values(http_requests_total, service)` → a services dropdown; CHAINED: `label_values(http_requests_total{service="$service"}, route)`); CUSTOM (hand-typed list); INTERVAL (durations); DATASOURCE (a picker to swap prod ↔ staging Prometheus); CONSTANT / TEXTBOX / ADHOC. REFERENCE in a query as `$service` or `${service}`; multi-value → `service=~"${service:regex}"`. BUILT-INS: `$__range`, `$__interval`, `$__rate_interval`. `$__rate_interval` = `max(4 × scrape_interval, $__interval + scrape_interval)` — USE IT inside `rate()` on a dashboard (NOT a fixed `[5m]`): it\'s ALWAYS ≥ 4 scrape intervals (a rate has enough points), it GROWS when you zoom out (efficient), it SHRINKS toward that floor when you zoom in (sharp) → a 90-second spike stays visible at high zoom, exactly when detail matters most. It\'s a DASHBOARD thing — a Prometheus alerting rule evaluates at a fixed cadence so a literal `[5m]` is correct there.',
        hintHi: 'GRAFANA = kई datasources ke over query + visualise; KHUD koi telemetry store NAHI — har panel RENDER TIME par ek datasource ko ek query issue karता hai. DATASOURCES: Prometheus (PromQL), Loki (LogQL), Tempo (TraceQL), + PostgreSQL / CloudWatch / … YAML ke roop mein PROVISION karो. Ek "MIXED" datasource EK panel ko KAI sources query karने deta hai. EK DASHBOARD JSON HAI: `{ title, uid, templating, panels }`. Har PANEL: `type`, `gridPos` (24-column grid), `targets` (`datasource` + `expr` + `legendFormat`), `fieldConfig`. TEMPLATE VARIABLES: QUERY (`label_values(...)`, CHAINED), CUSTOM, INTERVAL, DATASOURCE. `$service` / `${service}` se REFERENCE. `$__rate_interval` = `max(4 × scrape_interval, $__interval + scrape_interval)` — `rate()` mein USE karो, fixed `[5m]` nahi.',
      },
      {
        task: 'In a comment, describe the RED dashboard as a Grafana build (the $service variable + the 3 panel queries), and dashboards-as-code (provisioning, generation, allowUiUpdates).',
        taskHi: 'Ek comment mein, RED dashboard ek Grafana build ke roop mein describe karो.',
        hint: 'THE RED DASHBOARD (Module 15 L4) as ONE Grafana row, templated by a `$service` QUERY variable whose options = `label_values(http_requests_total, service)`: PANEL 1 — RATE (req/s) by route: `sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)`, unit `reqps`, `legendFormat: {{route}}`. PANEL 2 — ERROR RATIO by route: `sum(rate(http_requests_total{service="$service",status=~"5.."}[$__rate_interval])) by (route) / sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)`, unit `percentunit`, `max: 0.1`, a RED threshold step at `0.02`. PANEL 3 — LATENCY p50/p90/p99: THREE targets on ONE graph, each `histogram_quantile(0.50|0.90|0.99, sum(rate(http_request_duration_seconds_bucket{service="$service"}[$__rate_interval])) by (le, route))`, `legendFormat: p50|p90|p99`, unit `s` → the GAP between p50 and p99 (a growing tail) is visible. ONE JSON, works for EVERY service — pick from the dropdown. DASHBOARDS AS CODE: (1) PROVISIONING — a `providers` YAML (`type: file`, `allowUiUpdates: false` → UI "Save" is DISABLED for these, so an edit can\'t persist and diverge, `options.path: /var/lib/grafana/dashboards`); deliver the JSON via a ConfigMap + the grafana sidecar (k8s) or config-mgmt → git is the SOURCE OF TRUTH, a dashboard change is a PR. (2) GENERATION — don\'t hand-edit large JSON: generate it from a higher-level definition — GRAFONNET (a jsonnet library), the grafana-foundation-sdk, or the TERRAFORM grafana provider → a template applied to a list of 40 services produces 40 IDENTICAL RED dashboards, consistent by construction, zero per-service maintenance. (3) TEST — `dashboard-linter`, or a CI step that renders + diffs. EXPLORATION still works: "Save as…" to a personal folder, or the EXPLORE view (no save).',
        hintHi: 'RED DASHBOARD ek Grafana row ke roop mein, ek `$service` QUERY variable se templated (`label_values(http_requests_total, service)`): PANEL 1 — RATE: `sum(rate(http_requests_total{service="$service"}[$__rate_interval])) by (route)`. PANEL 2 — ERROR RATIO: 5xx rate / total rate, RED threshold `0.02` par. PANEL 3 — LATENCY: TEEN targets EK graph par, `histogram_quantile(0.50|0.90|0.99, ...)`. EK JSON, HAR service ke liye. DASHBOARDS AS CODE: (1) PROVISIONING — `allowUiUpdates: false` → UI "Save" DISABLED; git SOURCE OF TRUTH, ek change ek PR. (2) GENERATION — GRAFONNET / TERRAFORM grafana provider → ek template 40 services ke liye 40 IDENTICAL dashboards. (3) TEST — `dashboard-linter`. EXPLORATION: "Save as…" ya EXPLORE view.',
      },
      {
        task: 'In a comment, contrast Grafana alerting and Prometheus alerting rules — where each is evaluated, the trade-offs, when to use Grafana alerting, and the failure to avoid. Plus annotations.',
        taskHi: 'Ek comment mein, Grafana alerting aur Prometheus alerting rules ka contrast karो.',
        hint: 'BOTH can evaluate alert rules; BOTH route to the SAME Alertmanager (that part is fine + intended). The question is WHICH ENGINE evaluates a given rule. PROMETHEUS ALERTING RULES — evaluated by Prometheus itself, IN the metrics path: (+) live in the RULES REPO alongside the code, VERSION with the application, UNIT-TESTABLE with `promtool test rules` (prove an alert fires when it should BEFORE deploy), can SHARE an `expr` with a recording rule / a dashboard → ONE canonical definition. → PREFER for ANYTHING expressible in PromQL. GRAFANA ALERTING — evaluated by Grafana: (+) can combine MULTIPLE DATASOURCES in a SINGLE rule — a metric condition AND a log-query (Loki) condition AND a SQL result in one alert expr — which Prometheus CANNOT do (it only knows metrics); has a built-in editing UI. (−) not in the code repo by default, not `promtool`-testable, a separate evaluation engine. → USE ONLY when a rule GENUINELY needs cross-datasource logic Prometheus can\'t express, and DOCUMENT explicitly which alerts live in Grafana + why. THE FAILURE TO AVOID: the SAME logical alert existing in BOTH systems with slightly different definitions (different windows / thresholds / `for`), BOTH firing into Alertmanager → an incident produces TWO pages, OR one is quietly broken (a datasource UID changed) for months while everyone assumes the other covers it (and the "other" is too loose). Discipline: ONE evaluation engine PER RULE. ANNOTATIONS: a VERTICAL MARKER on a time-series panel tied to a moment or a range — a deployment, an incident, a config change. From a datasource QUERY (against something that records events) or PUSHED via the API. WIRING YOUR DEPLOY PIPELINE to post a "deployed vN" annotation to every dashboard is one of the HIGHEST-VALUE small integrations: when a graph turns bad the first question is "what changed" and the answer is often a vertical line 3 minutes to the left.',
        hintHi: 'DONO alert rules evaluate kar sakते hain; DONO SAME Alertmanager ko route karते hain. Question WHICH ENGINE. PROMETHEUS ALERTING RULES — Prometheus khud dwara evaluated: (+) RULES REPO mein code ke alongside, VERSION with app, `promtool test rules` se UNIT-TESTABLE, ek recording rule / dashboard ke saath `expr` SHARE. → PROMQL mein expressible KISI BHI CHEEZ ke liye PREFER. GRAFANA ALERTING — Grafana dwara evaluated: (+) ek SINGLE rule mein MULTIPLE DATASOURCES combine — metric AND Loki AND SQL. (−) code repo mein nahi, `promtool`-testable nahi. → SIRF jab GENUINELY cross-datasource logic chahिए. AVOID: SAME alert DONO systems mein different definitions ke saath → DO pages ya ek quietly broken. ANNOTATIONS: ek VERTICAL MARKER — a deployment, an incident. DEPLOY PIPELINE ko "deployed vN" annotation post karने ke liye wire karो.',
      },
    ],

    keyTakeaways: [
      'GRAFANA is a thin, STATELESS query + visualisation layer — it stores NO telemetry; every panel queries a DATASOURCE (Prometheus/PromQL, Loki/LogQL, Tempo/TraceQL, +many) at render time. PROVISION datasources as YAML, not click-ops. A "Mixed" datasource lets one panel query several sources.',
      'A DASHBOARD IS JSON: `templating` (variables) + a `panels` array (each: `type`, `gridPos` on a 24-col grid, `targets` = datasource + `expr` + `legendFormat`, `fieldConfig` for units/thresholds). The JSON is the artifact — export and commit it. TEMPLATE VARIABLES (QUERY via `label_values(...)`, chained; CUSTOM; DATASOURCE; INTERVAL) turn one dashboard into N views; reference as `$service`.',
      'USE `$__rate_interval` (not a fixed `[5m]`) inside `rate()` on a dashboard — it\'s `max(4×scrape_interval, $__interval + scrape_interval)`, so it stays ≥ 4 scrape intervals, widens when zoomed out, and shrinks when zoomed in → a 90-second spike stays visible at high zoom. A fixed window is correct only in a Prometheus alerting rule (fixed evaluation cadence).',
      'DASHBOARDS AS CODE: PROVISION from git with `allowUiUpdates: false` (UI Save disabled → no drift); GENERATE the JSON from Grafonnet / the Terraform provider so 40 services get an identical RED dashboard by construction; explore via a personal copy or the Explore view. UI-editing a shared Grafana produces dozens of drifted, unversioned dashboards that a Grafana upgrade silently loses.',
      'Prometheus and Grafana can BOTH evaluate alerts and both route to the SAME Alertmanager. DEFAULT to PROMETHEUS RULES (in the code repo, `promtool`-testable, shares an expr with recording rules). Use GRAFANA ALERTING only when a rule genuinely needs cross-datasource logic (metric AND log AND SQL in one rule); document which alerts live there. NEVER run the same logical alert in both — you get double pages or a silently broken one.',
    ],
    keyTakeawaysHi: [
      'GRAFANA ek thin, STATELESS query + visualisation layer hai — ye koi telemetry store NAHI karता; har panel render time par ek DATASOURCE query karता hai (Prometheus/PromQL, Loki/LogQL, Tempo/TraceQL). Datasources ko YAML ke roop mein PROVISION karो. Ek "Mixed" datasource ek panel ko kई sources query karने deta hai.',
      'EK DASHBOARD JSON HAI: `templating` (variables) + ek `panels` array (har ek: `type`, `gridPos` 24-col grid par, `targets` = datasource + `expr` + `legendFormat`, `fieldConfig`). JSON artifact hai — export aur commit karो. TEMPLATE VARIABLES (`label_values(...)` ke through QUERY, chained; CUSTOM; DATASOURCE; INTERVAL) ek dashboard ko N views mein badalते hain; `$service` ke roop mein reference karो.',
      '`$__rate_interval` USE karो (ek fixed `[5m]` nahi) ek dashboard par `rate()` ke andar — ye `max(4×scrape_interval, $__interval + scrape_interval)` hai, to ye ≥ 4 scrape intervals rehता hai, zoom out par widen hota hai, zoom in par shrink hota hai → ek 90-second spike high zoom par visible rehता hai. Ek fixed window sirf ek Prometheus alerting rule mein correct hai.',
      'DASHBOARDS AS CODE: git se `allowUiUpdates: false` ke saath PROVISION karो (UI Save disabled → koi drift nahi); JSON ko Grafonnet / Terraform provider se GENERATE karो taaki 40 services ek identical RED dashboard paें; ek personal copy ya Explore view se explore karो. Ek shared Grafana UI-editing dozens drifted, unversioned dashboards produce karता hai.',
      'Prometheus aur Grafana DONO alerts evaluate kar sakते hain aur dono SAME Alertmanager ko route karते hain. PROMETHEUS RULES ko DEFAULT karो (code repo mein, `promtool`-testable). GRAFANA ALERTING sirf tab use karो jab ek rule genuinely cross-datasource logic chahिए; document karो. KABHI same logical alert dono mein run mat karो — aapko double pages ya ek silently broken milता hai.',
    ],
  },

  {
    slug: 'ops-logs-and-traces-in-the-stack-loki-otel-collector-tempo',
    title: 'Logs & Traces in the Stack: Loki, the OTel Collector & Tempo',
    titleHi: 'Stack Mein Logs Aur Traces: Loki, OTel Collector Aur Tempo',
    description:
      'The log and trace halves of the observability stack: Loki\'s label-index-plus-chunks model and LogQL, the promtail/Alloy agent, the OpenTelemetry Collector as the universal telemetry pipeline (receivers, processors, exporters), Tempo and Jaeger for trace storage, and the correlation glue in Grafana — exemplars, metrics-to-logs, logs-to-traces — that lets you move between all three signals in a click.',
    descriptionHi:
      'Observability stack ke log aur trace halves: Loki ka label-index-plus-chunks model aur LogQL, promtail/Alloy agent, OpenTelemetry Collector universal telemetry pipeline ke roop mein (receivers, processors, exporters), trace storage ke liye Tempo aur Jaeger, aur Grafana mein correlation glue — exemplars, metrics-to-logs, logs-to-traces — jo aapko teenon signals ke beech ek click mein move karने deta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A library that indexes by shelf, not by every word.** Loki does not read and index every line of every log (that is what makes it cheap) — it indexes only a small set of labels, like a library that records "row 12, science, 2024" for each box and lets you grep the box once you have narrowed to it. The OpenTelemetry Collector is the loading dock every delivery passes through: trucks (receivers) arrive in any format, the dock re-labels and repackages (processors), and forwards to whichever warehouses you name (exporters) — swap a warehouse without telling the trucks. And the correlation glue is the cross-reference card: from a spike on the metrics chart you flip straight to the trace that caused it, and from any span to the log lines it emitted.',
      hi: '**Ek library jo shelf se index karती hai, har word se nahi.** Loki har log ki har line read aur index nahi karता (wahi ise cheap banाता hai) — ye sirf ek chhota set of labels index karता hai, ek library ki tarah jo har box ke liye "row 12, science, 2024" record karती hai aur aapko box ko grep karने deti hai ek baar aap ise tak narrow kar liye. OpenTelemetry Collector wo loading dock hai jise har delivery guzarती hai: trucks (receivers) kisi bhi format mein aate hain, dock re-label aur repackage karता hai (processors), aur jo bhi warehouses aap name karते ho unhe forward karता hai (exporters). Aur correlation glue cross-reference card hai: metrics chart par ek spike se aap seedhे us trace par flip karते ho jisne ise cause kiya.',
    },

    simple: `**LOKI** — "Prometheus for logs". Cheap because it indexes LABELS, not content.
\`\`\`
- a log stream = a unique set of LABELS  {job, namespace, pod, container, level}
  + the raw log lines for that stream, stored as compressed CHUNKS in object storage.
- the INDEX is tiny (just the label sets). the content is NOT indexed - you grep it
  at query time, over only the chunks the label selector matched.
- KEEP LABELS LOW-CARDINALITY (same rule as metrics! Module 15 L3). NO trace_id,
  request_id, user_id as a LABEL - that's millions of streams. put them in the LINE.
\`\`\`

**LOGQL** = a stream selector + optional line/label filters + optional metric ops:
\`\`\`
{job="api", level="error"}                                   # stream selector (required)
{job="api"} |= "timeout" != "healthcheck"                    # line contains / not-contains
{job="api"} | json | status >= 500 and duration_ms > 1000    # parse + filter on fields
{job="api"} | json | line_format "{{.trace_id}} {{.msg}}"    # reshape the output
# METRIC queries turn logs into a time series (graph it, alert on it):
sum(rate({job="api"} |= "error" [5m])) by (pod)              # error-log rate per pod
sum by (status) (count_over_time({job="api"} | json [5m]))   # count by a parsed field
quantile_over_time(0.99, {job="api"} | json | unwrap duration_ms [5m])  # p99 from logs
\`\`\`

**THE AGENT** — promtail (older) / Grafana Alloy (current, an all-signal agent):
tails files or the journald/k8s log stream, applies pipeline stages (parse a
timestamp, drop a line, extract a label from a path), ships to Loki.

**THE OPENTELEMETRY COLLECTOR** — the universal telemetry pipeline. Config =
RECEIVERS -> PROCESSORS -> EXPORTERS, wired into named PIPELINES per signal:
\`\`\`
receivers:   otlp (grpc+http), prometheus (scrape), filelog, kafka, hostmetrics, ...
processors:  batch (always), memory_limiter (always), resource/attributes (add/rename/
             redact attrs), tail_sampling (traces - Module 15 L5), filter, transform,
             k8sattributes (enrich with pod/node/namespace)
exporters:   otlphttp / otlp (to any OTLP backend), prometheusremotewrite, loki,
             debug, plus vendor exporters (Datadog, ...). the 'debug' exporter prints.
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlp/tempo] }
    metrics: { receivers: [otlp, prometheus], processors: [memory_limiter, batch], exporters: [prometheusremotewrite] }
    logs:    { receivers: [otlp, filelog], processors: [memory_limiter, batch], exporters: [loki] }
\`\`\`
WHY a collector (vs the SDK exporting direct): one place for sampling, redaction,
enrichment, retry/buffer, and BACKEND SWITCHING - change \`exporters\` and no app redeploys.
run it as an agent (DaemonSet, per node) AND/OR a gateway (a central deployment).

**TRACE STORAGE:** Tempo (label-index + object storage, like Loki, cheap; TraceQL)
or Jaeger (its own storage). both queried in Grafana.

**THE CORRELATION GLUE** (the payoff - configured in the Grafana datasources):
\`\`\`
EXEMPLARS        a metric histogram bucket carries a sample trace_id -> click a p99
                spike on a graph, jump to a slow trace.
METRICS -> LOGS  a Prometheus panel links to a Loki query for the same
                {namespace,pod} + time range.
LOGS -> TRACES   Loki sees  trace_id  in a log line (a "derived field" regex) ->
                renders it as a link straight to the trace in Tempo.
TRACES -> LOGS   a Tempo span links to the Loki logs for that trace_id / that service.
\`\`\`
now: alert -> exemplar -> trace -> span's logs, all by clicking. one incident, 4 signals, 90 seconds.

**VALIDATE OFFLINE:** \`otelcol-contrib validate --config otelcol.yaml\` — checks the
receivers/processors/exporters AND that every pipeline only references components
that are configured.`,

    simpleHi: `**LOKI** — "logs ke liye Prometheus". Cheap kyunki ye LABELS index karता hai, content nahi.
\`\`\`
- ek log stream = LABELS ka ek unique set  {job, namespace, pod, container, level}
  + us stream ke raw log lines, compressed CHUNKS ke roop mein object storage mein stored.
- INDEX tiny hai (bas label sets). content INDEXED NAHI hai - aap ise query time par
  grep karते ho, sirf un chunks ke over jo label selector ne match kiye.
- LABELS LOW-CARDINALITY RAKHO (metrics jaisा hi rule! Module 15 L3). KOI trace_id,
  request_id, user_id ek LABEL ke roop mein nahi. unhe LINE mein daalो.
\`\`\`

**LOGQL** = ek stream selector + optional line/label filters + optional metric ops:
\`\`\`
{job="api", level="error"}                                   # stream selector (required)
{job="api"} |= "timeout" != "healthcheck"                    # line contains / not-contains
{job="api"} | json | status >= 500 and duration_ms > 1000    # parse + fields par filter
{job="api"} | json | line_format "{{.trace_id}} {{.msg}}"    # output reshape karो
# METRIC queries logs ko ek time series mein badalते hain:
sum(rate({job="api"} |= "error" [5m])) by (pod)              # per pod error-log rate
quantile_over_time(0.99, {job="api"} | json | unwrap duration_ms [5m])  # logs se p99
\`\`\`

**AGENT** — promtail (older) / Grafana Alloy (current): files ya journald/k8s log
stream tail karता hai, pipeline stages apply karता hai, Loki ko ships karता hai.

**OPENTELEMETRY COLLECTOR** — universal telemetry pipeline. Config =
RECEIVERS -> PROCESSORS -> EXPORTERS, per signal named PIPELINES mein wired:
\`\`\`
receivers:   otlp (grpc+http), prometheus (scrape), filelog, kafka, hostmetrics, ...
processors:  batch (always), memory_limiter (always), resource/attributes (attrs add/
             rename/redact), tail_sampling (traces - Module 15 L5), k8sattributes
exporters:   otlphttp / otlp (kisi bhi OTLP backend ko), prometheusremotewrite, loki,
             debug, plus vendor exporters. 'debug' exporter print karता hai.
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlp/tempo] }
    metrics: { receivers: [otlp, prometheus], processors: [memory_limiter, batch], exporters: [prometheusremotewrite] }
    logs:    { receivers: [otlp, filelog], processors: [memory_limiter, batch], exporters: [loki] }
\`\`\`
WHY ek collector: sampling, redaction, enrichment, retry/buffer, aur BACKEND
SWITCHING ke liye ek jagah - \`exporters\` change karो aur koi app redeploys nahi.

**TRACE STORAGE:** Tempo (label-index + object storage, Loki jaisा, cheap; TraceQL) ya Jaeger.

**CORRELATION GLUE** (payoff - Grafana datasources mein configured):
\`\`\`
EXEMPLARS        ek metric histogram bucket ek sample trace_id carry karता hai -> ek p99
                spike par click, ek slow trace par jump.
METRICS -> LOGS  ek Prometheus panel same {namespace,pod} + time range ke liye ek Loki query se link.
LOGS -> TRACES   Loki ek log line mein  trace_id  dekhता hai -> ise Tempo mein trace ke ek link ke roop mein render karता hai.
TRACES -> LOGS   ek Tempo span us trace_id ke liye Loki logs se link karता hai.
\`\`\`
ab: alert -> exemplar -> trace -> span's logs, sab clicking se. ek incident, 4 signals, 90 seconds.

**OFFLINE VALIDATE:** \`otelcol-contrib validate --config otelcol.yaml\`.`,

    content: `## Loki

Loki is a log store built on the same idea as Prometheus: index a small set of labels, not the content. A **log stream** is a unique combination of label values — \`{job, namespace, pod, container, level}\` — and Loki stores the raw log lines for each stream as compressed **chunks** in object storage, with an index that contains only the label sets, not the line text. A query first uses the label selector to find the matching streams, then greps the raw text of only those streams\' chunks. This makes ingestion and storage cheap compared to a full inverted index like Elasticsearch, at the cost of full-text search being a scan rather than an index lookup.

The critical discipline is the same as for metrics: **labels must be low-cardinality**. A label whose values are unbounded — \`trace_id\`, \`request_id\`, \`user_id\` — creates a separate stream per value, millions of tiny streams, and destroys Loki\'s performance and cost model. Those identifiers go **in the log line**, not in a label, and you filter on them at query time.

## LogQL

A LogQL query is a **stream selector** (required, in braces) followed by optional **line filters** (\`|=\` contains, \`!=\` does not contain, \`|~\` regex), optional **parsers** (\`| json\`, \`| logfmt\`, \`| pattern\`) that turn line fields into label-like values you can filter on, and optional **formatters** (\`| line_format\`, \`| label_format\`). LogQL also has a **metric** form: wrapping a log selector in \`rate\`, \`count_over_time\`, \`sum\`, or \`quantile_over_time\` (with \`| unwrap field\` to extract a numeric value) turns a log stream into a time series you can graph on a dashboard and alert on — an error-log rate per pod, a request count by parsed status, a p99 latency computed directly from a \`duration_ms\` field in the logs.

## The agent and the OpenTelemetry Collector

**promtail**, and its successor **Grafana Alloy** (an agent for all signals), tails log files or the container/journald log stream, runs pipeline stages to parse a timestamp, drop noise, or extract a label from a filename, and ships the result to Loki.

The **OpenTelemetry Collector** is the general telemetry pipeline, and increasingly the single agent for everything. Its config has three component sets — **receivers** that ingest (\`otlp\` for OTLP over gRPC and HTTP, \`prometheus\` for scraping, \`filelog\`, \`kafka\`, \`hostmetrics\`), **processors** that transform (\`batch\` and \`memory_limiter\` on every pipeline, \`resource\` and \`attributes\` to add/rename/redact attributes, \`tail_sampling\` for traces, \`k8sattributes\` to enrich with pod and node metadata), and **exporters** that send (\`otlp\`/\`otlphttp\` to any OTLP backend, \`prometheusremotewrite\`, \`loki\`, \`debug\` which prints, and vendor exporters). These are wired into named **pipelines** under \`service.pipelines\`, one per signal, each listing which receivers, processors in order, and exporters it uses.

Running a collector rather than having each application\'s SDK export directly to the backend gives you one place to do sampling, redaction of sensitive fields, enrichment with infrastructure metadata, retry and buffering when the backend is slow, and — the operationally important one — **backend switching**: to move from one tracing backend to another, or to fan out to two, you change the \`exporters\` in the collector config and no application is redeployed. The collector is commonly run both as an **agent** (a DaemonSet, one per node, close to the workloads) and as a **gateway** (a central deployment that does the heavier processing and the final export).

## Trace storage

**Tempo** stores traces the same way Loki stores logs — a small index plus compressed blocks in object storage — making it cheap, and is queried with **TraceQL**. **Jaeger** is the older option with its own storage backends. Both are queried through Grafana.

## The correlation glue

The reason to run all of this together is the ability to move between the three signals without leaving the investigation, and that is configured in the Grafana datasource settings:

- **Exemplars**: a Prometheus histogram bucket carries a sample \`trace_id\` of a request that fell into it, so clicking a p99 spike on a graph jumps straight to an actual slow trace from that moment.
- **Metrics to logs**: a Prometheus panel is configured to link to a Loki query for the same \`namespace\` and \`pod\` labels over the same time range.
- **Logs to traces**: the Loki datasource has a **derived field** — a regex that extracts \`trace_id\` from a log line — and renders it as a link straight to that trace in Tempo.
- **Traces to logs**: a Tempo span links back to the Loki logs for that \`trace_id\` or that service and time window.

With these wired, an investigation flows from an alert to the exemplar on the graph to the trace to the specific span to that span\'s log lines, entirely by clicking, turning what used to be an hour of manual correlation into ninety seconds.

## Validating offline

\`otelcol-contrib validate --config otelcol.yaml\` checks the collector configuration without running it: every receiver, processor, and exporter is a valid configured component, and — the check that catches the most real mistakes — every pipeline under \`service.pipelines\` only references components that are actually defined, so a pipeline that lists a processor you forgot to configure fails validation with the exact name.`,

    contentHi: `## Loki

Loki ek log store hai jo Prometheus ke same idea par built hai: ek chhota set of labels index karो, content nahi. Ek **log stream** label values ka ek unique combination hai — \`{job, namespace, pod, container, level}\` — aur Loki har stream ke raw log lines ko compressed **chunks** ke roop mein object storage mein store karता hai, ek index ke saath jismें sirf label sets hain, line text nahi. Ye ingestion aur storage ko cheap banाता hai ek full inverted index jaise Elasticsearch ke compared.

Critical discipline metrics ke same hai: **labels low-cardinality hone chahिए**. Ek label jiske values unbounded hain — \`trace_id\`, \`request_id\`, \`user_id\` — per value ek separate stream banाता hai. Wo identifiers **log line mein** jaते hain, ek label mein nahi.

## LogQL

Ek LogQL query ek **stream selector** (required, braces mein) hai jiske baad optional **line filters** (\`|=\` contains, \`!=\` does not contain, \`|~\` regex), optional **parsers** (\`| json\`, \`| logfmt\`), aur optional **formatters** hain. LogQL ka ek **metric** form bhi hai: ek log selector ko \`rate\`, \`count_over_time\`, ya \`quantile_over_time\` mein wrap karना ek log stream ko ek time series mein badalता hai jise aap ek dashboard par graph kar sakते ho aur alert kar sakते ho.

## Agent aur OpenTelemetry Collector

**promtail**, aur iska successor **Grafana Alloy**, log files ya container/journald log stream tail karता hai, pipeline stages run karता hai, aur result ko Loki ko ships karता hai.

**OpenTelemetry Collector** general telemetry pipeline hai. Iske config ke teen component sets hain — **receivers** jo ingest karते hain, **processors** jo transform karते hain (\`batch\` aur \`memory_limiter\` har pipeline par, \`tail_sampling\` traces ke liye, \`k8sattributes\`), aur **exporters** jo send karते hain. Ye named **pipelines** mein wired hain \`service.pipelines\` ke tahat.

Ek collector chalाना rather than har application ke SDK ko directly backend ko export karवाना aapko sampling, sensitive fields ki redaction, infrastructure metadata ke saath enrichment, aur — operationally important — **backend switching** ke liye ek jagah deता hai: ek tracing backend se doosre par move karने ke liye, aap collector config mein \`exporters\` change karते ho aur koi application redeployed nahi hai.

## Trace storage

**Tempo** traces ko usi tarah store karता hai jaise Loki logs store karता hai — ek chhota index plus object storage mein compressed blocks — ise cheap banाता hua, aur **TraceQL** se queried hai. **Jaeger** older option hai.

## Correlation glue

Ye sab ek saath chalाने ka reason teen signals ke beech move karने ki ability hai:
- **Exemplars**: ek Prometheus histogram bucket ek request ka ek sample \`trace_id\` carry karता hai jo isme falls hua.
- **Metrics to logs**: ek Prometheus panel same \`namespace\` aur \`pod\` labels ke liye ek Loki query se link karने ke liye configured hai.
- **Logs to traces**: Loki datasource ke paas ek **derived field** hai — ek regex jo ek log line se \`trace_id\` extract karता hai.
- **Traces to logs**: ek Tempo span us \`trace_id\` ke liye Loki logs se link karता hai.

Iske saath wired, ek investigation ek alert se graph par exemplar se trace se specific span se us span ke log lines tak flow karता hai, poori tarah clicking se.

## Offline validate karna

\`otelcol-contrib validate --config otelcol.yaml\` collector configuration ko check karता hai bina ise run kiye: har receiver, processor, aur exporter ek valid configured component hai, aur — wo check jo sabse zyada real mistakes catch karता hai — \`service.pipelines\` ke tahat har pipeline sirf un components ko reference karता hai jo actually defined hain.`,

    examples: [
      {
        title: 'Validating an OTel Collector config — and catching a pipeline that references an undefined processor',
        titleHi: 'Ek OTel Collector config validate karna — aur ek pipeline catch karna jo ek undefined processor reference karता hai',
        code: `# VERIFY
export PATH="$HOME/bin:$PATH"

cat > otelcol.yaml <<'YML'
receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
processors:
  memory_limiter: { check_interval: 1s, limit_mib: 512 }
  batch: { timeout: 5s, send_batch_size: 1024 }
  resource:
    attributes:
      - { key: deployment.environment, value: prod, action: upsert }
exporters:
  debug: { verbosity: basic }
  otlphttp/tempo: { endpoint: https://tempo.example:4318 }
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resource, batch]
      exporters: [otlphttp/tempo, debug]
YML

otelcol-contrib validate --config otelcol.yaml && echo "config is valid"

echo "--- now make the pipeline reference a processor that isn't configured ---"
sed -i 's/\\[memory_limiter, resource, batch\\]/[memory_limiter, spanmetrics, batch]/' otelcol.yaml
otelcol-contrib validate --config otelcol.yaml 2>&1 | tail -1`,
        output: `config is valid
--- now make the pipeline reference a processor that isn't configured ---
Error: service::pipelines::traces: references processor "spanmetrics" which is not configured`,
        explain: 'A minimal but realistic collector config for traces: an OTLP receiver accepting spans over both gRPC and HTTP, three processors (a memory limiter and a batch processor, which every pipeline should have, plus a resource processor that stamps \`deployment.environment=prod\` onto every span), and two exporters (one sending to Tempo over OTLP-HTTP, and the \`debug\` exporter which prints a summary to the collector\'s own logs). The \`service.pipelines.traces\` block wires them together: receive from \`otlp\`, run the three processors in that order, export to both destinations. \`otelcol-contrib validate\` checks this without starting the collector and confirms it is valid. The second half edits the pipeline to list a \`spanmetrics\` processor in place of \`resource\` — a plausible mistake, since \`spanmetrics\` is a real processor you might want, but here it was never added to the \`processors\` block. Re-running validate now fails and names the exact problem: the traces pipeline references a processor that is not configured. This is the single most common collector misconfiguration — a typo in a component name, or a component referenced in a pipeline but not defined — and it is caught in CI in a fraction of a second rather than by the collector failing to start in production.',
        explainHi: 'Traces ke liye ek minimal par realistic collector config: ek OTLP receiver jo spans ko gRPC aur HTTP dono par accept karता hai, teen processors (ek memory limiter aur ek batch processor, jo har pipeline ke paas hone chahिए, plus ek resource processor jo har span par \`deployment.environment=prod\` stamp karता hai), aur do exporters. \`service.pipelines.traces\` block unhe ek saath wires karता hai. \`otelcol-contrib validate\` ise bina collector start kiye check karता hai. Doosra half pipeline ko edit karता hai ek \`spanmetrics\` processor ko \`resource\` ke place mein list karने ke liye — ek plausible mistake — par yahaan ise kabhi \`processors\` block mein add nahi kiya gaya. Validate re-run karना ab fail karता hai aur exact problem name karता hai. Ye sabse common collector misconfiguration hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# putting trace_id / request_id / user_id in a Loki LABEL
  # promtail / Alloy pipeline:
  - json:
      expressions: { trace_id: trace_id, user_id: user_id }
  - labels: { trace_id: "", user_id: "" }        # <-- promoting them to LABELS
  # every unique trace_id is now a separate STREAM. a busy service = millions of
  # streams. Loki's index explodes, ingestion falls behind, queries time out.
  # this is the metrics cardinality bomb (Module 15 L3) in a different system.`,
        right: `# keep labels LOW-cardinality; leave the ids IN THE LINE and filter at query time:
  # labels: only  {job, namespace, pod, container, level}  (all bounded)
  # the log line still contains  "trace_id":"7f3a..."  as JSON.
  # query:
  #   {job="api"} | json | trace_id = "7f3a2b1c"          # exact id lookup
  #   {job="api"} | json | user_id = "8813" | level="error"
  # Loki greps the (few) chunks the label selector matched - fast enough, and the
  # index stays tiny. and Grafana's "derived field" turns the in-line trace_id into
  # a clickable link to Tempo anyway - you don't need it as a label for that.`,
        why: 'Loki\'s efficiency comes entirely from indexing only a small, bounded set of labels and treating everything else as opaque text to be scanned at query time. Promoting a high-cardinality field like a trace ID, request ID, or user ID to a label breaks that model exactly as it breaks a metrics database: each distinct value creates a new stream, a busy service generates millions of streams, the index that was meant to be tiny grows without bound, ingestion cannot keep up, and queries time out. The fields still need to be searchable, but the right place for them is inside the log line, as JSON or key-value pairs, filtered with \`| json | trace_id = "..."\` at query time — Loki scans only the chunks that the low-cardinality label selector already narrowed to, which is fast enough for an identifier lookup. And for the specific case of linking a log to its trace, Grafana\'s derived-field feature extracts the trace ID from the line text with a regex and renders it as a clickable link to Tempo, so there is no need for it to be a label even for navigation.',
        whyHi: 'Loki ki efficiency poori tarah sirf ek chhota, bounded set of labels index karने se aati hai aur baaki sab kuch ko opaque text ke roop mein treat karने se jise query time par scan kiya jaता hai. Ek high-cardinality field jaise ek trace ID, request ID, ya user ID ko ek label mein promote karना us model ko tods deta hai exactly jaise ye ek metrics database ko tods deta hai: har distinct value ek naya stream banाता hai, ek busy service millions of streams generate karता hai. Fields ko abhi bhi searchable hona chahिए, par unke liye right jagah log line ke andar hai, JSON ya key-value pairs ke roop mein, query time par \`| json | trace_id = "..."\` se filtered.',
      },
      {
        wrong: `# every app's SDK exporting telemetry DIRECTLY to the vendor backend
  # 200 services, each with the OTel SDK configured:
  #   OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.vendor.example
  #   OTEL_TRACES_SAMPLER=parentbased_traceidratio  OTEL_TRACES_SAMPLER_ARG=0.1
  # consequences:
  #   - to change the sampling rate: redeploy 200 services
  #   - to switch vendors / add a second backend: redeploy 200 services
  #   - to redact a PII attribute someone added: redeploy the offending service (if
  #     you even notice)
  #   - each service holds its own retry buffer; a backend blip -> 200 services
  #     buffering / dropping independently`,
        right: `# apps export to a local COLLECTOR; the collector does the policy + the export:
  #   app SDK:  OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317   (that's it)
  #   collector (one config, one deploy):
  #     processors: [ memory_limiter, k8sattributes, tail_sampling, redact-pii, batch ]
  #     exporters:  [ otlp/vendor-a, otlp/tempo ]     # fan out; switch here
  #   change sampling / add a backend / fix redaction -> edit the COLLECTOR config,
  #     roll ONE deployment. zero app redeploys.
  #   run it as a DaemonSet (agent, per node) + a central gateway for heavy work.`,
        why: 'Configuring every application\'s OpenTelemetry SDK to export straight to the observability backend spreads telemetry policy across every service and every deployment. The sampling rate, the destination, attribute redaction, and retry behaviour are then baked into each application\'s configuration, so any change to any of them requires redeploying the services — two hundred of them to change one sampling rate, and the same to switch or add a backend or to strip a personal-data attribute that slipped in. Each service also buffers independently, so a backend outage has every service managing its own retry and drop behaviour with no coordination. Routing all telemetry through a collector moves that policy to one place: the applications only need to know the address of the local collector, and the collector\'s single configuration handles sampling, enrichment with infrastructure metadata, redaction, buffering, and the actual export, including fanning out to multiple backends or switching between them. A change is an edit to the collector config and a roll of one deployment. The standard topology is a collector running as a per-node agent close to the workloads, optionally feeding a central gateway that does the heavier processing before the final export.',
        whyHi: 'Har application ke OpenTelemetry SDK ko directly observability backend ko export karने ke liye configure karना telemetry policy ko har service aur har deployment ke across spread karता hai. Sampling rate, destination, attribute redaction, aur retry behaviour phir har application ke configuration mein baked hain, to unme se kisi bhi ka koi bhi change services ko redeploy karने ki require karता hai — do sau unhe ek sampling rate change karने ke liye. Saara telemetry ek collector ke through route karना us policy ko ek jagah move karता hai: applications ko sirf local collector ka address jaanना chahिए, aur collector ka single configuration sampling, enrichment, redaction, buffering, aur actual export handle karता hai. Ek change collector config ka ek edit aur ek deployment ka ek roll hai.',
      },
      {
        wrong: `# running the observability stack with no correlation configured
  # Loki, Tempo, Prometheus all in Grafana, but:
  #   - no exemplars on the histograms
  #   - no "derived field" on the Loki datasource to detect trace_id
  #   - no metrics->logs or traces->logs links
  # an investigation is: see the p99 spike (Prometheus) -> manually copy the time
  # range -> switch to Loki -> hand-write a stream selector -> find an error line
  # -> copy the trace_id out of the JSON -> switch to Tempo -> paste it.
  # that's 6 manual context switches per hop. you have 3 signals and a walk between
  # each one.`,
        right: `# wire the correlation in the datasource configs (one-time, high payoff):
  #   Prometheus datasource:  exemplars on (needs the app to emit them + a config flag)
  #                           + "Trace to logs" / a metrics->logs data link
  #   Loki datasource:  derivedFields:
  #     - name: trace_id
  #       matcherRegex: '"trace_id":"(\\w+)"'
  #       url: '\${__value.raw}'
  #       datasourceUid: <tempo-uid>            # renders trace_id as a Tempo link
  #   Tempo datasource:  "Trace to logs" -> the Loki datasource, mapped on
  #                       service.name / pod, over the trace's time window
  # now: click the p99 exemplar -> the trace -> the slow span -> its logs. 4 clicks.`,
        why: 'Having Loki, Tempo, and Prometheus all available in the same Grafana is necessary but not sufficient; the value of a unified stack is the ability to pivot between the signals in a click, and that pivoting has to be explicitly configured in the datasource settings. Without it, an investigation that spans all three signals is a sequence of manual steps: read the latency spike on the Prometheus graph, note the time range, switch to the Loki view, type a stream selector from memory, scroll to an error line, copy the trace ID out of the JSON payload, switch to the Tempo view, and paste it — several context switches for every hop between signals, on top of the actual analysis. The configuration that removes this is a one-time setup with a large ongoing payoff: exemplars on the Prometheus histograms so a graph point links to a trace, a derived field on the Loki datasource that recognises a trace ID in a log line and renders it as a link into Tempo, and trace-to-logs and metrics-to-logs data links that carry the relevant labels and time range across. With these in place the same investigation is: click the exemplar on the spike, land on the trace, click the slow span, see its logs — four clicks instead of an hour.',
        whyHi: 'Loki, Tempo, aur Prometheus sab ek hi Grafana mein available hona necessary hai par sufficient nahi; ek unified stack ki value signals ke beech ek click mein pivot karने ki ability hai, aur wo pivoting ko datasource settings mein explicitly configure karना padता hai. Iske bina, ek investigation jo saare teen signals span karता hai manual steps ka ek sequence hai. Configuration jo ise remove karता hai ek one-time setup hai ek badhे ongoing payoff ke saath: Prometheus histograms par exemplars, Loki datasource par ek derived field jo ek log line mein ek trace ID pehchanता hai, aur trace-to-logs aur metrics-to-logs data links. Iske saath, wahi investigation hai: spike par exemplar click karो, trace par land karो, slow span click karो, iske logs dekhो — chaar clicks ek ghante ke bajaay.',
      },
    ],

    realWorld: [
      {
        en: '**`trace_id` as a Loki label, index at 40M streams** — a well-meaning promtail pipeline promoted `trace_id` to a label "for easy lookup". Loki\'s index grew to tens of millions of streams, ingestion lagged by hours, queries timed out. Removing the label and querying `| json | trace_id="..."` on the line dropped it to ~8k streams and fixed everything.',
        hi: '**`trace_id` ek Loki label ke roop mein, 40M streams par index** — ek promtail pipeline ne `trace_id` ko ek label mein promote kiya. Loki ka index tens of millions of streams tak badha. Label hatana aur line par `| json | trace_id="..."` query karna ise ~8k streams tak gira diya.',
      },
      {
        en: '**200 services, one sampling change = 200 deploys** — every app exported OTLP straight to the vendor. Lowering the trace sample rate from 100% to 5% during a cost push required a coordinated redeploy of 200 services over two weeks. Moving to a collector made the next such change one config edit and one rollout.',
        hi: '**200 services, ek sampling change = 200 deploys** — har app ne OTLP directly vendor ko export kiya. Trace sample rate ko 100% se 5% karna 200 services ke ek coordinated redeploy ki require kiya. Ek collector par move karna agle aise change ko ek config edit banaya.',
      },
      {
        en: '**No derived field, 20 min per hop** — a team had Loki + Tempo + Prometheus in Grafana but no correlation configured. Every incident involved copy-pasting time ranges and trace IDs between three tabs. Adding exemplars, a Loki `derivedFields` trace_id regex, and trace-to-logs links cut a typical investigation from ~45 min to ~5.',
        hi: '**Koi derived field nahi, per hop 20 min** — ek team ke paas Grafana mein Loki + Tempo + Prometheus tha par koi correlation configured nahi. Exemplars, ek Loki `derivedFields` trace_id regex, aur trace-to-logs links add karna ek typical investigation ko ~45 min se ~5 tak kata.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Loki\'s storage model work, and what is the cardinality rule for Loki labels?',
        qHi: 'Loki ka storage model kaise kaam karता hai, aur Loki labels ke liye cardinality rule kya hai?',
        a: 'Loki is built on the same idea as Prometheus: index only a small set of labels, not the content. A log stream is a unique combination of label values such as job, namespace, pod, container, and level, and Loki stores the raw log lines for each stream as compressed chunks in object storage. The index contains only the label sets, not the text of the lines. A query first uses the label selector to identify the matching streams, then greps the raw text of only those streams\' chunks. This makes ingestion and storage far cheaper than a full inverted index like Elasticsearch, at the cost that full-text search is a scan of the matched chunks rather than an index lookup. The cardinality rule is identical to the one for metrics: labels must be low-cardinality and bounded. A label whose values are unbounded, such as trace_id, request_id, or user_id, creates a separate stream for every distinct value, so a busy service produces millions of tiny streams, the index grows without bound, ingestion falls behind, and queries time out. Those identifiers belong in the log line itself as JSON or key-value pairs, and you filter on them at query time with a parser stage like json followed by a field comparison. Grafana can still turn an in-line trace ID into a clickable link to the trace using a derived-field regex, so keeping it out of the labels costs nothing for navigation.',
        aHi: 'Loki Prometheus ke same idea par built hai: sirf ek chhota set of labels index karो, content nahi. Ek log stream label values ka ek unique combination hai jaise job, namespace, pod, container, aur level, aur Loki har stream ke raw log lines ko compressed chunks ke roop mein object storage mein store karता hai. Index mein sirf label sets hain, lines ka text nahi. Ye ingestion aur storage ko ek full inverted index se kaafi cheaper banाता hai. Cardinality rule metrics ke same hai: labels low-cardinality aur bounded hone chahिए. Ek label jiske values unbounded hain, jaise trace_id, request_id, ya user_id, har distinct value ke liye ek separate stream banाता hai. Wo identifiers log line mein khud belong karते hain.',
      },
      {
        q: 'What is the OpenTelemetry Collector, and why run it instead of having each SDK export directly?',
        qHi: 'OpenTelemetry Collector kya hai, aur har SDK ko directly export karवाने ke bajaay ise kyun chalाओ?',
        a: 'The OpenTelemetry Collector is a general telemetry pipeline, increasingly the single agent for metrics, logs, and traces. Its configuration has three component sets: receivers that ingest telemetry, such as otlp over gRPC and HTTP, a prometheus scraper, filelog, or kafka; processors that transform it, with batch and memory_limiter on every pipeline, resource and attributes to add rename or redact fields, tail_sampling for traces, and k8sattributes to enrich with pod and node metadata; and exporters that send it onward, such as otlp to any compatible backend, prometheusremotewrite, loki, and vendor-specific ones. These are wired into named pipelines under service.pipelines, one per signal, each listing its receivers, its processors in order, and its exporters. Running a collector rather than pointing every application\'s SDK straight at the backend concentrates telemetry policy in one place. The sampling rate, the redaction of sensitive attributes, the enrichment, the retry and buffering when a backend is slow, and — the operationally decisive one — the choice of backend all live in the collector config. To change the sampling rate, add a second backend, switch vendors, or fix a redaction rule, you edit the collector configuration and roll one deployment, with no application redeployed. Without the collector, each of those changes means redeploying every service. The common topology is a collector as a per-node agent close to the workloads, optionally feeding a central gateway for heavier processing.',
        aHi: 'OpenTelemetry Collector ek general telemetry pipeline hai, increasingly metrics, logs, aur traces ke liye single agent. Iske configuration ke teen component sets hain: receivers jo telemetry ingest karते hain, processors jo ise transform karते hain (batch aur memory_limiter har pipeline par, tail_sampling traces ke liye, k8sattributes), aur exporters jo ise aage bhejते hain. Ye named pipelines mein wired hain service.pipelines ke tahat. Ek collector chalाना rather than har application ke SDK ko directly backend par point karवाना telemetry policy ko ek jagah concentrate karता hai. Sampling rate, sensitive attributes ki redaction, enrichment, retry aur buffering, aur backend ka choice sab collector config mein rehते hain. Sampling rate change karने, ek doosra backend add karने, ya vendors switch karने ke liye, aap collector configuration edit karते ho aur ek deployment roll karते ho.',
      },
      {
        q: 'What is the "correlation glue" in an observability stack, and what does it enable?',
        qHi: 'Ek observability stack mein "correlation glue" kya hai, aur ye kya enable karता hai?',
        a: 'The correlation glue is the set of links, configured in the Grafana datasource settings, that let you move between metrics, logs, and traces without leaving the investigation. There are four pieces. Exemplars: a Prometheus histogram bucket carries a sample trace ID of a request that fell into it, so clicking a p99 spike on a graph jumps straight to an actual slow trace from that moment. Metrics to logs: a Prometheus panel is configured to link to a Loki query for the same namespace and pod labels over the same time range. Logs to traces: the Loki datasource has a derived field, a regex that extracts a trace ID from a log line, and renders it as a link straight to that trace in Tempo. Traces to logs: a Tempo span links back to the Loki logs for that trace ID or that service and time window. Without these configured, an investigation across all three signals is a sequence of manual context switches — reading the spike, noting the time range, switching views, typing selectors, copying IDs out of JSON, pasting them into another view — several steps for every hop between signals. With them configured, the same investigation is: click the exemplar on the spike, land on the trace, click the slow span, see its logs. It converts what used to be most of an hour of manual correlation into about ninety seconds, which is the entire practical reason to run the three stores together rather than separately.',
        aHi: 'Correlation glue links ka set hai, Grafana datasource settings mein configured, jo aapko metrics, logs, aur traces ke beech move karने deta hai bina investigation chhodे. Chaar pieces hain. Exemplars: ek Prometheus histogram bucket ek request ka ek sample trace ID carry karता hai jo isme falls hua. Metrics to logs: ek Prometheus panel same namespace aur pod labels ke liye ek Loki query se link karने ke liye configured hai. Logs to traces: Loki datasource ke paas ek derived field hai, ek regex jo ek log line se ek trace ID extract karता hai. Traces to logs: ek Tempo span us trace ID ke liye Loki logs se link karता hai. Inke bina, ek investigation manual context switches ka ek sequence hai. Inke saath configured, wahi investigation hai: spike par exemplar click karो, trace par land karो, slow span click karो, iske logs dekhो.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain Loki (streams, chunks, the index, the low-cardinality rule) and LogQL (the selector + filters + parsers + the metric form).',
        taskHi: 'Ek comment mein, Loki aur LogQL samjhao.',
        hint: 'LOKI = "Prometheus for logs" — cheap because it indexes LABELS, NOT content. A LOG STREAM = a unique combination of LABEL VALUES (`{job, namespace, pod, container, level}`). Loki stores the raw log lines for each stream as compressed CHUNKS in OBJECT STORAGE; the INDEX contains ONLY the label sets, NOT the line text. A query: (1) uses the label selector to find the MATCHING STREAMS, then (2) GREPS the raw text of ONLY those streams\' chunks. → far cheaper than a full inverted index (Elasticsearch), at the cost that full-text search is a SCAN of the matched chunks, not an index lookup. THE LOW-CARDINALITY RULE (identical to metrics — Module 15 L3): labels MUST be low-cardinality + bounded. A label whose values are unbounded (`trace_id`, `request_id`, `user_id`) → a SEPARATE STREAM per value → a busy service = millions of tiny streams → the index explodes, ingestion lags, queries time out. Those ids go IN THE LOG LINE (as JSON), NOT a label; filter at query time. (Grafana\'s "derived field" turns an in-line trace_id into a clickable Tempo link anyway — you don\'t need it as a label for navigation.) LOGQL = a STREAM SELECTOR (REQUIRED, in braces) + optional LINE FILTERS (`|=` contains, `!=` not-contains, `|~` regex, `!~` not-regex) + optional PARSERS (`| json`, `| logfmt`, `| pattern` — turn line fields into label-like values you can filter on: `| json | status >= 500 and duration_ms > 1000`) + optional FORMATTERS (`| line_format "{{.trace_id}} {{.msg}}"`, `| label_format`). THE METRIC FORM turns logs into a TIME SERIES you can graph + alert on: `sum(rate({job="api"} |= "error" [5m])) by (pod)` (error-log rate per pod); `sum by (status) (count_over_time({job="api"} | json [5m]))` (count by a parsed field); `quantile_over_time(0.99, {job="api"} | json | unwrap duration_ms [5m])` (p99 latency computed DIRECTLY from a log field). THE AGENT: promtail (older) / Grafana Alloy (current, all-signal) — tails files or the journald/k8s log stream, runs pipeline stages (parse a timestamp, drop a line, extract a label from a path), ships to Loki.',
        hintHi: 'LOKI = "logs ke liye Prometheus" — cheap kyunki ye LABELS index karता hai, content NAHI. Ek LOG STREAM = LABEL VALUES ka ek unique combination. Loki raw lines ko compressed CHUNKS ke roop mein OBJECT STORAGE mein store karता hai; INDEX mein SIRF label sets. Query: (1) label selector se MATCHING STREAMS, (2) sirf un chunks ka text GREP. LOW-CARDINALITY RULE: labels low-cardinality + bounded. `trace_id`/`request_id`/`user_id` ek label mein → per value ek SEPARATE STREAM → millions of streams. Wo ids LOG LINE mein (JSON), NOT a label. LOGQL = ek STREAM SELECTOR (REQUIRED) + LINE FILTERS (`|=`, `!=`, `|~`) + PARSERS (`| json | status >= 500`) + FORMATTERS (`| line_format`). METRIC FORM: `sum(rate({job="api"} |= "error" [5m])) by (pod)`; `quantile_over_time(0.99, {job="api"} | json | unwrap duration_ms [5m])`. AGENT: promtail / Grafana Alloy.',
      },
      {
        task: 'In a comment, describe the OTel Collector config (receivers/processors/exporters/pipelines), why a collector beats direct SDK export, and the agent-vs-gateway topology + otelcol validate.',
        taskHi: 'Ek comment mein, OTel Collector config describe karो.',
        hint: 'THE OTEL COLLECTOR = the universal telemetry pipeline (increasingly the single agent for metrics + logs + traces). CONFIG = 3 component sets + a service block. RECEIVERS (ingest): `otlp` (gRPC :4317 + HTTP :4318), `prometheus` (scrape), `filelog`, `kafka`, `hostmetrics`, … PROCESSORS (transform): `batch` (ALWAYS) + `memory_limiter` (ALWAYS) + `resource`/`attributes` (add/rename/REDACT attrs) + `tail_sampling` (traces — Module 15 L5) + `filter` / `transform` + `k8sattributes` (enrich with pod/node/namespace). EXPORTERS (send): `otlp`/`otlphttp` (to ANY OTLP backend), `prometheusremotewrite`, `loki`, `debug` (PRINTS a summary), + vendor exporters (Datadog, …). `service.pipelines` WIRES them into NAMED pipelines, ONE PER SIGNAL, each listing `receivers: [...]`, `processors: [...]` (IN ORDER), `exporters: [...]` — e.g. `traces: { receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlp/tempo] }`. WHY A COLLECTOR (vs the SDK exporting DIRECT to the backend): concentrates ALL telemetry POLICY in ONE place — the sampling rate, redaction of sensitive attrs, enrichment, retry/buffer when the backend is slow, and (the OPERATIONALLY DECISIVE one) BACKEND SWITCHING. To change sampling / add a 2nd backend / switch vendors / fix a redaction rule → edit the COLLECTOR config, roll ONE deployment, ZERO app redeploys. Without it: each of those = redeploy EVERY service (200 services for one sampling change); each service also buffers/drops independently on a backend blip. TOPOLOGY: run it as an AGENT (a DaemonSet, ONE per node, close to the workloads — receives local OTLP, does light processing) AND/OR a GATEWAY (a central deployment — heavier processing like tail-sampling that needs to see whole traces, the final export, fan-out). VALIDATE OFFLINE: `otelcol-contrib validate --config otelcol.yaml` → checks every receiver/processor/exporter is a valid configured component AND (the check that catches the most real mistakes) that every pipeline under `service.pipelines` ONLY references components that are ACTUALLY DEFINED → "references processor X which is not configured" names the exact typo. Run in CI.',
        hintHi: 'OTEL COLLECTOR = universal telemetry pipeline. CONFIG = 3 component sets + service block. RECEIVERS: `otlp` (gRPC :4317 + HTTP :4318), `prometheus`, `filelog`, `kafka`. PROCESSORS: `batch` (ALWAYS) + `memory_limiter` (ALWAYS) + `resource`/`attributes` (REDACT) + `tail_sampling` + `k8sattributes`. EXPORTERS: `otlp`/`otlphttp`, `prometheusremotewrite`, `loki`, `debug`. `service.pipelines` NAMED pipelines mein WIRES karता hai, PER SIGNAL EK. WHY A COLLECTOR: ALL telemetry POLICY ek jagah — sampling, redaction, enrichment, retry/buffer, aur BACKEND SWITCHING. Change → COLLECTOR config edit, ONE deployment roll, ZERO app redeploys. Iske bina: har change = HAR service redeploy. TOPOLOGY: AGENT (DaemonSet, per node) AND/OR GATEWAY (central). VALIDATE: `otelcol-contrib validate --config otelcol.yaml` → pipeline sirf DEFINED components reference karता hai check karता hai. CI mein chalाओ.',
      },
      {
        task: 'In a comment, describe the 4 pieces of correlation glue (exemplars, metrics→logs, logs→traces, traces→logs), where each is configured, and the investigation flow it enables.',
        taskHi: 'Ek comment mein, correlation glue ke 4 pieces describe karो.',
        hint: 'THE CORRELATION GLUE = the links that let you move between metrics/logs/traces WITHOUT leaving the investigation — configured in the GRAFANA DATASOURCE SETTINGS (a one-time setup, huge ongoing payoff). THE 4 PIECES: (1) EXEMPLARS — a Prometheus HISTOGRAM BUCKET carries a sample `trace_id` of a request that fell into it → click a p99 SPIKE on a graph → jump STRAIGHT to an actual slow trace from that moment. (Needs the app to emit exemplars + a flag on the Prometheus datasource.) (2) METRICS → LOGS — a Prometheus panel / datasource is configured with a data link to a LOKI query for the SAME `{namespace, pod}` labels over the SAME time range → from a metric spike, one click to the matching logs. (3) LOGS → TRACES — the LOKI datasource has a DERIVED FIELD: a `matcherRegex` that extracts `trace_id` from a log LINE, plus `datasourceUid: <tempo>` → Loki renders the in-line trace_id as a CLICKABLE LINK straight to that trace in Tempo (this is why trace_id does NOT need to be a Loki label). (4) TRACES → LOGS — the TEMPO datasource has "Trace to logs" → the Loki datasource, mapped on `service.name` / `pod`, over the trace\'s time window → from any span, one click to the logs that span emitted. THE INVESTIGATION FLOW IT ENABLES: an ALERT fires (a metric) → click the EXEMPLAR on the p99 spike → land on a slow TRACE → click the slow SPAN → see THAT SPAN\'s LOGS (the reason). 4 clicks. ONE incident, all THREE signals (Module 15 L1), ~90 SECONDS. WITHOUT the glue: read the spike → note the time range → switch to Loki → hand-type a stream selector → scroll to an error line → copy the trace_id out of the JSON → switch to Tempo → paste it — SEVERAL manual context switches PER HOP, on top of the actual analysis (~45 min for a typical cross-signal investigation). Having Loki + Tempo + Prometheus all in Grafana is NECESSARY but NOT SUFFICIENT — the pivoting must be explicitly configured.',
        hintHi: 'CORRELATION GLUE = links jo aapko metrics/logs/traces ke beech move karने deते hain BINA investigation chhodे — GRAFANA DATASOURCE SETTINGS mein configured. 4 PIECES: (1) EXEMPLARS — ek Prometheus HISTOGRAM BUCKET ek sample `trace_id` carry karता hai → ek p99 SPIKE par click → ek slow trace par jump. (2) METRICS → LOGS — ek Prometheus panel SAME `{namespace, pod}` + time range ke liye ek LOKI query se link. (3) LOGS → TRACES — LOKI datasource ke paas ek DERIVED FIELD: ek regex jo `trace_id` extract karता hai + `datasourceUid: <tempo>` → clickable Tempo link. (4) TRACES → LOGS — TEMPO "Trace to logs" → Loki, `service.name`/`pod` par mapped. FLOW: ALERT (metric) → EXEMPLAR click → slow TRACE → slow SPAN → us SPAN ke LOGS. 4 clicks, ~90 SECONDS. Iske bina: ~45 min. Grafana mein sab hona NECESSARY par SUFFICIENT NAHI.',
      },
    ],

    keyTakeaways: [
      'LOKI = "Prometheus for logs" — indexes only a small set of LOW-CARDINALITY LABELS (`{job, namespace, pod, container, level}`), stores raw lines as compressed CHUNKS in object storage, and GREPS the matched chunks at query time (no full-text index). NEVER put `trace_id` / `request_id` / `user_id` in a LABEL — that\'s millions of streams; keep them IN THE LINE and filter with `| json | trace_id="..."`.',
      'LOGQL = a stream selector `{…}` (required) + line filters (`|=` `!=` `|~`) + parsers (`| json`, `| logfmt` → filter on fields) + formatters (`| line_format`). The METRIC form turns logs into a graphable/alertable series: `sum(rate({…} |= "error" [5m])) by (pod)`, `quantile_over_time(0.99, {…} | json | unwrap duration_ms [5m])`.',
      'The OTEL COLLECTOR is the universal pipeline: RECEIVERS (otlp, prometheus, filelog) → PROCESSORS (always `batch` + `memory_limiter`; + `k8sattributes`, `tail_sampling`, `resource`/redaction) → EXPORTERS (otlp, prometheusremotewrite, loki, debug), wired into per-signal PIPELINES under `service.pipelines`. Run a collector (not direct SDK export) so sampling, redaction, buffering, and BACKEND SWITCHING are one config edit + one rollout, not 200 app redeploys. Topology: per-node AGENT + optional central GATEWAY.',
      'TEMPO stores traces like Loki stores logs (small index + object storage, cheap; TraceQL); Jaeger is the older alternative. Both are queried in Grafana.',
      'The CORRELATION GLUE (configured in the Grafana datasources) is the payoff: EXEMPLARS (a histogram bucket → a sample trace_id → click a p99 spike, jump to a slow trace), METRICS→LOGS (a panel links to a Loki query for the same pod+range), LOGS→TRACES (a Loki `derivedFields` regex extracts trace_id → a Tempo link), TRACES→LOGS (a span → its Loki logs). Result: alert → exemplar → trace → span\'s logs in ~4 clicks. VALIDATE the collector offline with `otelcol-contrib validate --config …` (catches a pipeline referencing an undefined component).',
    ],
    keyTakeawaysHi: [
      'LOKI = "logs ke liye Prometheus" — sirf ek chhota set of LOW-CARDINALITY LABELS index karता hai (`{job, namespace, pod, container, level}`), raw lines ko compressed CHUNKS ke roop mein object storage mein store karता hai, aur query time par matched chunks GREP karता hai. KABHI `trace_id` / `request_id` / `user_id` ek LABEL mein mat daalो — wo millions of streams hai; unhe LINE mein rakhो aur `| json | trace_id="..."` se filter karो.',
      'LOGQL = ek stream selector `{…}` (required) + line filters (`|=` `!=` `|~`) + parsers (`| json` → fields par filter) + formatters (`| line_format`). METRIC form logs ko ek graphable/alertable series mein badalता hai: `sum(rate({…} |= "error" [5m])) by (pod)`, `quantile_over_time(0.99, {…} | json | unwrap duration_ms [5m])`.',
      'OTEL COLLECTOR universal pipeline hai: RECEIVERS (otlp, prometheus, filelog) → PROCESSORS (hamesha `batch` + `memory_limiter`; + `k8sattributes`, `tail_sampling`, `resource`/redaction) → EXPORTERS (otlp, prometheusremotewrite, loki, debug), `service.pipelines` ke tahat per-signal PIPELINES mein wired. Ek collector chalाओ (direct SDK export nahi) taaki sampling, redaction, buffering, aur BACKEND SWITCHING ek config edit + ek rollout hon, 200 app redeploys nahi. Topology: per-node AGENT + optional central GATEWAY.',
      'TEMPO traces ko usi tarah store karता hai jaise Loki logs (chhota index + object storage, cheap; TraceQL); Jaeger older alternative hai. Dono Grafana mein queried hain.',
      'CORRELATION GLUE (Grafana datasources mein configured) payoff hai: EXEMPLARS (ek histogram bucket → ek sample trace_id → ek p99 spike par click, ek slow trace par jump), METRICS→LOGS (ek panel same pod+range ke liye ek Loki query se link), LOGS→TRACES (ek Loki `derivedFields` regex trace_id extract karता hai → ek Tempo link), TRACES→LOGS (ek span → iske Loki logs). Result: alert → exemplar → trace → span ke logs ~4 clicks mein. Collector ko `otelcol-contrib validate --config …` se offline VALIDATE karो.',
    ],
  },
];
