import type { CourseLesson } from './course-js-module1';

// DevOps Module 16 — The Monitoring & Alerting Stack in Practice
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module16-part2.ts.
//
// VERIFICATION: `# VERIFY` examples run against REAL tools, all offline:
//   promtool v3.14.0        - `check config`, `check rules`, and `test rules`
//                             (a unit-test engine: input_series -> assert PromQL
//                             results + assert alerts fire with exact labels/annotations)
//   amtool v0.28.1          - `check-config`, `config routes test` (assert which
//                             receiver a labelset routes to)
//   otelcol-contrib v0.160  - `validate` (receivers/processors/exporters + pipeline wiring)
// all in ~/bin/ (PATH-extended by verify-bash.mjs). Grafana (L5) is prose.

export const DEVOPS_MODULE_16: CourseLesson[] = [
  {
    slug: 'ops-prometheus-scrape-config-and-service-discovery',
    title: 'Prometheus: Scrape Config & Service Discovery',
    titleHi: 'Prometheus: Scrape Config Aur Service Discovery',
    description:
      'How Prometheus finds what to monitor and turns raw targets into clean, labelled series: the scrape_config, static targets versus service discovery (Kubernetes, EC2, file), and the relabelling pipeline that filters targets, rewrites the scrape address, and promotes discovery metadata into real labels — plus metric_relabel_configs for dropping bad series at ingestion, and the `up` metric that tells you a scrape failed.',
    descriptionHi:
      'Prometheus kaise dhoondhता hai kya monitor karna hai aur raw targets ko clean, labelled series mein badalता hai: scrape_config, static targets versus service discovery (Kubernetes, EC2, file), aur relabelling pipeline jo targets filter karता hai, scrape address rewrite karता hai, aur discovery metadata ko real labels mein promote karता hai — plus metric_relabel_configs bad series ko ingestion par drop karne ke liye, aur `up` metric jo aapko batata hai ek scrape fail hua.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A census taker with a route sheet.** Service discovery is the route sheet, regenerated every few minutes from the city\'s own address registry — it always knows which houses exist right now, without you editing a list. Before knocking, the census taker applies rules from a clipboard (relabelling): "skip any house flagged \'vacant\'" (keep/drop), "for houses on the new estate, use the side door not the front" (rewrite the address), "write the ward and the street name into the form, not just the house number" (promote metadata to labels). And after collecting the answers, another set of rules discards questions that are known to be junk (metric relabelling). The result is a clean, consistent form for every house, even though the houses come and go and describe themselves inconsistently.',
      hi: '**Ek census taker ek route sheet ke saath.** Service discovery route sheet hai, har kuch minute city ke apne address registry se regenerated — ye hamesha jaanता hai kaun se houses abhi exist karते hain, bina aapke ek list edit kiye. Knock karने se pehle, census taker ek clipboard se rules apply karता hai (relabelling): "kisi bhi house ko skip karो jo \'vacant\' flagged hai" (keep/drop), "new estate par houses ke liye, side door use karो front nahi" (address rewrite), "ward aur street name form mein likhो, sirf house number nahi" (metadata ko labels mein promote). Aur answers collect karने ke baad, ek aur set of rules known junk questions discard karता hai (metric relabelling).',
    },

    simple: `**PROMETHEUS scrapes** — it PULLS \`/metrics\` from every target on an interval.
Everything is configured in \`prometheus.yml\`:
\`\`\`
global:
  scrape_interval: 15s        # how often to scrape (per-job override allowed)
  scrape_timeout: 10s
  external_labels: { cluster: prod-eu }   # added to every series leaving this server
rule_files: [ "rules/*.yml" ]             # recording + alerting rules (Lesson 3)
alerting:
  alertmanagers: [ { static_configs: [ { targets: ['alertmanager:9093'] } ] } ]
scrape_configs:
  - job_name: <name>          # becomes the  job  label on every series from this job
    <discovery>               # static_configs OR a *_sd_config
    relabel_configs: [...]    # act on TARGETS, before scraping
    metric_relabel_configs: [...]   # act on SCRAPED SAMPLES, before storing
\`\`\`

**FINDING TARGETS:**
\`\`\`
static_configs         a hardcoded list. fine for a fixed set (a few exporters).
  - targets: ['node-1:9100', 'node-2:9100']
    labels: { env: prod }
file_sd_configs        read targets from JSON/YAML files, reloaded on change. good
                       glue for anything that can write a file (Terraform, a script).
kubernetes_sd_configs  role: pod | endpoints | service | node | ingress - Prometheus
                       watches the API and the target list updates as pods come/go.
ec2_sd / gce_sd / azure_sd / consul_sd / dns_sd   cloud + registry discovery.
\`\`\`
each discovered target arrives with \`__meta_*\` labels (metadata) + \`__address__\`
(host:port) + \`__scheme__\` + \`__metrics_path__\`. these  __  labels are DROPPED
after relabelling unless you copy them to a real label.

**RELABEL_CONFIGS** (a pipeline, top to bottom, acting on target labels):
\`\`\`
- source_labels: [a, b]   # joined with ';'
  regex: '...'            # matched against the joined value (default '(.*)' )
  action: keep | drop     # keep/drop the target if regex matches
        | replace         # write  replacement  (with $1,$2 from regex) into target_label
        | labelmap | labeldrop | labelkeep | hashmod | lowercase | uppercase
  target_label: '...'
  replacement: '...'
COMMON PATTERN (k8s pods):
  1. keep only pods with  prometheus.io/scrape: "true"   (a keep on the annotation)
  2. rewrite  __address__  to  <pod_ip>:<annotation port>
  3. set  __metrics_path__  from an annotation
  4. copy  __meta_kubernetes_namespace / _pod_name  ->  namespace / pod  labels
\`\`\`

**METRIC_RELABEL_CONFIGS** — same syntax, but runs on each scraped SAMPLE:
\`\`\`
- source_labels: [__name__]
  action: drop
  regex: 'apiserver_request_duration_seconds_bucket'   # a known cardinality bomb
# also: drop a noisy label, keep only an allowlist of metrics, rename a label.
# THIS is where you defend against a cardinality explosion at ingestion (Module 15 L3).
\`\`\`

**THE \`up\` METRIC** — Prometheus writes \`up{job,instance} = 1\` if the scrape
succeeded, \`0\` if it failed (timeout, connection refused, bad status). \`up == 0\`
is the most basic alert. also emitted: \`scrape_duration_seconds\`,
\`scrape_samples_scraped\` (watch this for cardinality growth).

**VALIDATE OFFLINE:** \`promtool check config prometheus.yml\`.`,

    simpleHi: `**PROMETHEUS scrape karता hai** — ye har target se ek interval par \`/metrics\` PULL
karता hai. Sab kuch \`prometheus.yml\` mein configured hai:
\`\`\`
global:
  scrape_interval: 15s        # kitni baar scrape karna (per-job override allowed)
  external_labels: { cluster: prod-eu }   # is server ko chhodने wali har series mein add
rule_files: [ "rules/*.yml" ]             # recording + alerting rules (Lesson 3)
alerting:
  alertmanagers: [ { static_configs: [ { targets: ['alertmanager:9093'] } ] } ]
scrape_configs:
  - job_name: <name>          # is job se har series par  job  label ban jaता hai
    <discovery>               # static_configs YA ek *_sd_config
    relabel_configs: [...]    # TARGETS par act, scraping se pehle
    metric_relabel_configs: [...]   # SCRAPED SAMPLES par act, store karne se pehle
\`\`\`

**TARGETS DHOONDHNA:**
\`\`\`
static_configs         ek hardcoded list. ek fixed set ke liye theek.
file_sd_configs        JSON/YAML files se targets read, change par reloaded.
kubernetes_sd_configs  role: pod | endpoints | service | node | ingress - Prometheus
                       API watch karता hai aur target list update hoती hai jab pods aate/jaते hain.
ec2_sd / gce_sd / azure_sd / consul_sd / dns_sd   cloud + registry discovery.
\`\`\`
har discovered target \`__meta_*\` labels (metadata) + \`__address__\` (host:port) +
\`__scheme__\` + \`__metrics_path__\` ke saath aata hai. ye \`__\` labels relabelling
ke baad DROP kiye jaते hain jab tak aap unhe ek real label par copy nahi karते.

**RELABEL_CONFIGS** (ek pipeline, top to bottom, target labels par acting):
\`\`\`
- source_labels: [a, b]   # ';' se joined
  regex: '...'            # joined value ke against matched (default '(.*)' )
  action: keep | drop     # target keep/drop agar regex match karता hai
        | replace         # replacement ko target_label mein likhो ($1,$2 regex se)
        | labelmap | labeldrop | labelkeep | hashmod | lowercase | uppercase
COMMON PATTERN (k8s pods):
  1. sirf  prometheus.io/scrape: "true"  wale pods keep karो
  2. __address__ ko  <pod_ip>:<annotation port>  par rewrite karो
  3. __metrics_path__ ko ek annotation se set karो
  4. __meta_kubernetes_namespace / _pod_name  ->  namespace / pod  labels par copy karो
\`\`\`

**METRIC_RELABEL_CONFIGS** — same syntax, par har scraped SAMPLE par chalता hai:
\`\`\`
- source_labels: [__name__]
  action: drop
  regex: 'apiserver_request_duration_seconds_bucket'   # ek known cardinality bomb
# YE wahaan hai jahaan aap ek cardinality explosion ke against ingestion par defend karते ho (Module 15 L3).
\`\`\`

**\`up\` METRIC** — Prometheus \`up{job,instance} = 1\` likhता hai agar scrape succeed
hua, \`0\` agar fail hua. \`up == 0\` sabse basic alert hai. bhi emitted:
\`scrape_duration_seconds\`, \`scrape_samples_scraped\` (cardinality growth ke liye ise dekho).

**OFFLINE VALIDATE:** \`promtool check config prometheus.yml\`.`,

    content: `## The scrape config

Prometheus works by pulling: it periodically fetches an HTTP endpoint, conventionally \`/metrics\`, from each target and parses the exposition text into samples. All of this is declared in \`prometheus.yml\`. The \`global\` block sets the default scrape interval and timeout and \`external_labels\` that are attached to every series as it leaves this server (important for federation and for de-duplicating across HA pairs). \`rule_files\` points at the recording and alerting rules (Lesson 3), and \`alerting\` points at the Alertmanager instances that alerts are sent to (Lesson 4).

Each entry under \`scrape_configs\` is a **job**. Its \`job_name\` becomes the \`job\` label on every series it produces. The job declares how to find its targets, and two relabelling pipelines: \`relabel_configs\`, which acts on the target list before scraping, and \`metric_relabel_configs\`, which acts on the samples after scraping and before storage.

## Finding targets

- **static_configs** is a hardcoded list of \`host:port\` targets with optional labels. It is fine for a small fixed set — a handful of exporters that never move.
- **file_sd_configs** reads target lists from JSON or YAML files that Prometheus watches and reloads on change. It is the integration point for anything that can write a file: a Terraform \`local_file\`, a cron job, a small script that queries an inventory API.
- **kubernetes_sd_configs** watches the Kubernetes API. The \`role\` selects what to discover — \`pod\`, \`endpoints\` (the pods behind a Service), \`service\`, \`node\`, or \`ingress\` — and the target list updates automatically as pods are created and destroyed.
- **ec2_sd_configs, gce_sd_configs, azure_sd_configs, consul_sd_configs, dns_sd_configs** discover from cloud provider APIs and service registries.

Every discovered target arrives carrying special labels: \`__meta_*\` labels holding all the metadata the discovery mechanism knows (for Kubernetes, every annotation, label, namespace, node name), plus \`__address__\` (the \`host:port\` to scrape), \`__scheme__\`, and \`__metrics_path__\`. Labels beginning with a double underscore are **internal**: they are used during relabelling and then discarded, so any metadata you want to keep as a real label must be explicitly copied to a non-underscore label.

## relabel_configs — shaping the targets

\`relabel_configs\` is an ordered pipeline. Each rule reads one or more \`source_labels\`, joins their values with a semicolon, matches the joined string against \`regex\` (which defaults to \`(.*)\`), and takes an \`action\`:

- **keep** / **drop**: keep or drop the target entirely if the regex matches. This is how you filter — "keep only pods whose \`prometheus.io/scrape\` annotation is \`true\`".
- **replace**: write \`replacement\` (with \`$1\`, \`$2\` capture groups from the regex) into \`target_label\`. This is how you rewrite \`__address__\` to point at a pod\'s IP and its declared metrics port, or set \`__metrics_path__\` from an annotation.
- **labelmap**: copy every label matching the regex to a new name — the standard way to turn \`__meta_kubernetes_pod_label_*\` into plain labels.
- **labeldrop** / **labelkeep**: remove or retain labels by regex.
- **hashmod**: write \`hash(source) mod N\` into a label, used to shard scraping across multiple Prometheus instances.

The canonical Kubernetes pod scrape config is: keep only annotated pods, rewrite the address to the pod IP and annotation port, set the metrics path from an annotation, and copy the namespace and pod name into real \`namespace\` and \`pod\` labels so every metric is queryable by them.

## metric_relabel_configs — shaping the samples

\`metric_relabel_configs\` uses exactly the same syntax but runs once per scraped sample, on the sample\'s label set (including \`__name__\`, the metric name). Its uses: drop a specific metric known to be a cardinality bomb (\`action: drop\` on \`__name__\` matching \`apiserver_request_duration_seconds_bucket\`), drop a high-cardinality label from an otherwise useful metric, keep only an allowlist of metric names, or rename a label. This is the enforcement point for the cardinality discipline from Module 15 — it is where a known-bad series is discarded before it ever reaches storage.

## The \`up\` metric and scrape health

For every target, on every scrape, Prometheus synthesises \`up{job, instance}\`: \`1\` if the scrape succeeded, \`0\` if it failed — a timeout, a connection refused, a non-200 status, or unparseable output. \`up == 0\` is the most fundamental alert in any Prometheus setup. Alongside it Prometheus emits \`scrape_duration_seconds\`, \`scrape_samples_scraped\` (the number of series returned — watch this rise as an early cardinality warning), and \`scrape_samples_post_metric_relabeling\`.

## Validating

\`promtool check config prometheus.yml\` validates the whole file offline: the YAML structure, every regex in every relabel rule, the rule-file globs, and the discovery config shapes. Run it in CI on every change so a broken regex or a malformed scrape config never reaches a running Prometheus, where it would fail to reload and leave you on stale config.`,

    contentHi: `## Scrape config

Prometheus pulling se kaam karता hai: ye periodically ek HTTP endpoint, conventionally \`/metrics\`, har target se fetch karता hai aur exposition text ko samples mein parse karता hai. Ye sab \`prometheus.yml\` mein declared hai. \`global\` block default scrape interval aur timeout aur \`external_labels\` set karता hai jo har series se attach hoते hain jab ye is server ko chhodता hai. \`rule_files\` recording aur alerting rules par point karता hai (Lesson 3), aur \`alerting\` un Alertmanager instances par point karता hai jinhe alerts bheje jaते hain (Lesson 4).

\`scrape_configs\` ke tahat har entry ek **job** hai. Iska \`job_name\` har series par \`job\` label ban jaता hai jo ye produce karता hai. Job declare karता hai apne targets kaise dhoondhने hain, aur do relabelling pipelines: \`relabel_configs\`, jo scraping se pehle target list par act karता hai, aur \`metric_relabel_configs\`, jo scraping ke baad aur storage se pehle samples par act karता hai.

## Targets dhoondhना

- **static_configs** ek hardcoded list hai. Ek chhote fixed set ke liye theek.
- **file_sd_configs** JSON ya YAML files se target lists read karता hai jinhe Prometheus watch karता hai aur change par reload karता hai.
- **kubernetes_sd_configs** Kubernetes API watch karता hai. \`role\` select karता hai kya discover karna hai — \`pod\`, \`endpoints\`, \`service\`, \`node\`, ya \`ingress\`.
- **ec2_sd_configs** aur baaki cloud provider APIs aur service registries se discover karते hain.

Har discovered target special labels carry karता hua aata hai: \`__meta_*\` labels jo saara metadata rakhते hain, plus \`__address__\`, \`__scheme__\`, aur \`__metrics_path__\`. Double underscore se shuru hone wale labels **internal** hain: wo relabelling ke dauraan use hoते hain aur phir discard, to jo bhi metadata aap ek real label ke roop mein rakhna chahते ho use explicitly ek non-underscore label par copy karna chahिए.

## relabel_configs — targets shape karna

\`relabel_configs\` ek ordered pipeline hai. Har rule ek ya zyada \`source_labels\` read karता hai, unke values ko ek semicolon se join karता hai, joined string ko \`regex\` ke against match karता hai, aur ek \`action\` leता hai:
- **keep** / **drop**: agar regex match karता hai to target ko poori tarah keep ya drop karो.
- **replace**: \`replacement\` ko \`target_label\` mein likhो. Ye kaise aap \`__address__\` ko rewrite karते ho.
- **labelmap**: regex match karने wale har label ko ek naye name par copy karो.
- **labeldrop** / **labelkeep**: regex se labels remove ya retain karो.
- **hashmod**: \`hash(source) mod N\` ek label mein likhो, scraping ko multiple Prometheus instances ke across shard karने ke liye.

## metric_relabel_configs — samples shape karna

\`metric_relabel_configs\` exactly same syntax use karता hai par per scraped sample ek baar chalता hai. Iske uses: ek specific metric drop karो jo ek cardinality bomb hai, ek otherwise useful metric se ek high-cardinality label drop karो, sirf metric names ki ek allowlist keep karो. Ye Module 15 se cardinality discipline ka enforcement point hai.

## \`up\` metric aur scrape health

Har target ke liye, har scrape par, Prometheus \`up{job, instance}\` synthesise karता hai: \`1\` agar scrape succeed hua, \`0\` agar fail. \`up == 0\` kisi bhi Prometheus setup mein sabse fundamental alert hai. Iske saath Prometheus \`scrape_duration_seconds\`, \`scrape_samples_scraped\` emit karता hai.

## Validate karna

\`promtool check config prometheus.yml\` poore file ko offline validate karता hai. Ise har change par CI mein chalाओ taaki ek broken regex kabhi ek running Prometheus tak na pahunche.`,

    examples: [
      {
        title: 'Validating a Kubernetes pod scrape config — and what a broken regex looks like',
        titleHi: 'Ek Kubernetes pod scrape config validate karna — aur ek broken regex kaisा dikhता hai',
        code: `# VERIFY
export PATH="$HOME/bin:$PATH"

cat > prometheus.yml <<'YML'
global:
  scrape_interval: 15s
  external_labels: { cluster: prod-eu }
rule_files: [ "rules/*.yml" ]
alerting:
  alertmanagers:
    - static_configs: [ { targets: ['alertmanager:9093'] } ]
scrape_configs:
  - job_name: node
    static_configs:
      - targets: ['node-1:9100', 'node-2:9100']
  - job_name: kubernetes-pods
    kubernetes_sd_configs: [ { role: pod } ]
    relabel_configs:
      # 1. keep ONLY pods annotated  prometheus.io/scrape: "true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"
      # 2. rewrite __address__ to  <pod_ip>:<annotation port>
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: '([^:]+)(?::\\d+)?;(\\d+)'
        replacement: '\$1:\$2'
        target_label: __address__
      # 3. promote namespace to a real label
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
    metric_relabel_configs:
      # 4. drop a known cardinality-bomb metric at ingestion
      - source_labels: [__name__]
        action: drop
        regex: 'go_gc_duration_seconds'
YML
promtool check config prometheus.yml

echo "--- now BREAK the metric_relabel regex ( ((  is not valid ) and re-check ---"
sed -i "s/regex: 'go_gc_duration_seconds'/regex: '(('/" prometheus.yml
promtool check config prometheus.yml 2>&1 | grep FAILED`,
        output: `Checking prometheus.yml
 SUCCESS: prometheus.yml is valid prometheus config file syntax

--- now BREAK the metric_relabel regex ( ((  is not valid ) and re-check ---
  FAILED: parsing YAML file prometheus.yml: error parsing regexp: missing closing ): \`^(?s:(()$\``,
        explain: 'The config declares two jobs. The \`node\` job uses a static list of two exporters. The \`kubernetes-pods\` job discovers every pod in the cluster and then shapes that raw list with three relabel rules: a \`keep\` that discards any pod not carrying the annotation \`prometheus.io/scrape: "true"\`, a \`replace\` that rewrites the scrape address from the discovered default to the pod\'s IP joined with the port named in an annotation, and a \`replace\` that copies the discovered namespace into a plain \`namespace\` label so every metric from these pods can be filtered by namespace. A \`metric_relabel_config\` then drops a specific metric known to add cardinality, at ingestion, before storage. \`promtool check config\` validates all of this offline — the YAML shape, the discovery config, and critically every regular expression in every relabel rule — and reports the file as valid. The second half deliberately corrupts one regex to \`((\`, which is not a valid expression, and re-runs the check: promtool now fails and names the exact problem, an unbalanced parenthesis in the compiled regex. Running this check in CI on every change means a malformed relabel rule is caught before it reaches a running Prometheus, where a bad config causes the reload to fail and leaves the server running on its last-good configuration without obviously telling anyone.',
        explainHi: 'Config do jobs declare karता hai. \`node\` job do exporters ki ek static list use karता hai. \`kubernetes-pods\` job cluster mein har pod discover karता hai aur phir us raw list ko teen relabel rules ke saath shape karता hai: ek \`keep\` jo kisi bhi pod ko discard karता hai jo annotation \`prometheus.io/scrape: "true"\` carry nahi karता, ek \`replace\` jo scrape address rewrite karता hai, aur ek \`replace\` jo discovered namespace ko ek plain \`namespace\` label mein copy karता hai. Ek \`metric_relabel_config\` phir ek specific metric drop karता hai jo cardinality add karता hai, ingestion par. \`promtool check config\` ye sab offline validate karता hai — YAML shape, discovery config, aur critically har relabel rule mein har regular expression. Doosra half deliberately ek regex ko \`((\` mein corrupt karता hai, aur check re-run karता hai: promtool ab fail karता hai aur exact problem name karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# expecting __meta_* labels to show up on your metrics without copying them
  scrape_configs:
    - job_name: k8s
      kubernetes_sd_configs: [ { role: pod } ]
      # no relabel_configs at all
  # then in PromQL:  http_requests_total{namespace="payments"}   -> returns NOTHING.
  # the namespace was in __meta_kubernetes_namespace during discovery, but every
  # label starting with __ is INTERNAL and gets dropped after relabelling. your
  # series only have  job  and  instance . you cannot slice by namespace, pod,
  # container, node, or any k8s dimension.`,
        right: `# explicitly promote every discovery label you want to query on:
  relabel_configs:
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: pod
    - source_labels: [__meta_kubernetes_pod_node_name]
      target_label: node
    - action: labelmap                    # copy ALL pod labels to plain names
      regex: __meta_kubernetes_pod_label_(.+)
  # now http_requests_total carries namespace / pod / node / app / version and
  # your dashboards and alerts can group and filter by them.
  # (most Helm charts / the kube-prometheus-stack ship these relabels by default -
  #  if you hand-roll the config, you must add them.)`,
        why: 'Service discovery attaches a large amount of metadata to each target as \`__meta_*\` labels, and it is tempting to assume that metadata flows through to the stored metrics. It does not. Every label whose name begins with a double underscore is defined as internal: it exists only during the relabelling phase, is available to relabel rules as a source, and is then stripped before the target is scraped and before any sample is stored. A scrape config with no relabelling therefore produces series carrying only \`job\` and \`instance\`, and a query that filters by \`namespace\` or \`pod\` returns nothing because those labels do not exist on the data. The fix is to explicitly copy each discovery label you intend to query on into a normal label with a \`replace\` rule, and to use \`labelmap\` to bulk-copy a whole family such as the pod\'s own Kubernetes labels. The widely used Helm charts and the kube-prometheus-stack include these relabels out of the box, which is why the problem usually only bites people who write the scrape config by hand.',
        whyHi: 'Service discovery har target par ek badhी amount of metadata \`__meta_*\` labels ke roop mein attach karता hai, aur ye assume karna tempting hai ki wo metadata stored metrics tak flow karता hai. Ye nahi karता. Har label jiska name ek double underscore se shuru hota hai internal define kiya gaya hai: ye sirf relabelling phase ke dauraan exist karता hai, relabel rules ko ek source ke roop mein available hai, aur phir target scrape hone se pehle aur koi sample store hone se pehle stripped hai. Bina relabelling ke ek scrape config isliए series produce karता hai jo sirf \`job\` aur \`instance\` carry karती hain. Fix har discovery label ko explicitly ek normal label mein copy karna hai jispar aap query karna chahते ho, aur \`labelmap\` use karna ek poore family ko bulk-copy karने ke liye.',
      },
      {
        wrong: `# relying on relabel_configs to drop a high-cardinality METRIC
  relabel_configs:
    - source_labels: [__name__]        # <-- __name__ is NOT available here!
      regex: 'apiserver_request_duration_seconds_bucket'
      action: drop
  # relabel_configs runs on TARGETS, before the scrape. at that point there are
  # no metric names - __name__ doesn't exist yet. this rule matches nothing and
  # silently does nothing. the cardinality bomb still lands in the TSDB.`,
        right: `# drop metrics in metric_relabel_configs (runs AFTER the scrape, per sample):
  metric_relabel_configs:
    - source_labels: [__name__]
      regex: 'apiserver_request_duration_seconds_bucket'
      action: drop
    # or keep only an allowlist:
    - source_labels: [__name__]
      regex: '(up|http_.*|process_.*|node_.*)'
      action: keep
    # or strip one runaway label off an otherwise-fine metric:
    - regex: 'id'                       # the label name
      action: labeldrop
  # rule of thumb:
  #   relabel_configs         -> which TARGETS, and their target labels
  #   metric_relabel_configs  -> which SAMPLES, and their sample labels (incl __name__)`,
        why: 'The two relabelling pipelines look identical in syntax but run at different times on different data, and confusing them means a rule silently has no effect. \`relabel_configs\` runs during service discovery, on the list of targets, before any HTTP request is made; the labels available to it are the target\'s labels — \`__address__\`, \`__scheme__\`, the \`__meta_*\` metadata, and \`job\`. There is no metric name at this stage because nothing has been scraped, so a rule matching \`__name__\` matches nothing and does nothing, and a cardinality-heavy metric it was meant to block is stored in full. \`metric_relabel_configs\` runs after the scrape, once per sample returned, on that sample\'s label set which does include \`__name__\`. Dropping a metric by name, keeping only an allowlist of metric names, or stripping a runaway label off a metric all belong here. The mental rule is that \`relabel_configs\` decides which targets to scrape and how to label the target, while \`metric_relabel_configs\` decides which of the resulting samples to keep and how to label each sample.',
        whyHi: 'Do relabelling pipelines syntax mein identical dikhते hain par different data par different times par chalते hain, aur unhe confuse karna ka matlab ek rule silently koi effect nahi rakhता. \`relabel_configs\` service discovery ke dauraan chalता hai, targets ki list par, koi HTTP request banने se pehle; ise available labels target ke labels hain. Is stage par koi metric name nahi hai kyunki kuch scrape nahi hua, to \`__name__\` match karने wala ek rule kuch match nahi karता aur kuch nahi karता. \`metric_relabel_configs\` scrape ke baad chalता hai, per sample returned ek baar, us sample ke label set par jismें \`__name__\` shamil hai. Name se ek metric drop karna yahaan belong karता hai.',
      },
      {
        wrong: `# a config change that fails to reload, silently, in production
  # someone edits prometheus.yml on the running server, adds a scrape job with a
  # typo (indentation wrong / a bad regex / a duplicate job_name), and reloads:
  $ curl -X POST http://prometheus:9090/-/reload
  # response: 400 Bad Request  "failed to load config"
  # -> Prometheus KEEPS RUNNING on the OLD config. no restart, no crash, no page.
  # the new scrape job never happens. days later "why aren't we getting metrics
  # from the new service?" and the answer is a reload that failed a week ago.`,
        right: `# validate BEFORE it reaches the server, and alert if the running config is stale:
  #   CI on the config repo:
  #     promtool check config prometheus.yml
  #     promtool check rules rules/*.yml
  #   deploy via config-as-code (a ConfigMap + a reloader sidecar, or Ansible) so
  #     the file is only updated after it passed check.
  #   alert on a failed reload:
  #     - alert: PrometheusConfigReloadFailed
  #       expr: prometheus_config_last_reload_successful == 0
  #       for: 5m
  #       labels: { severity: page }
  #   ( prometheus_config_last_reload_success_timestamp_seconds  tells you WHEN
  #     the last GOOD reload was - if it's old, you're on stale config. )`,
        why: 'Prometheus does not restart to pick up configuration changes; it reloads on a signal or an HTTP call. If the new configuration is invalid, the reload fails and returns an error, but the process keeps running on the previously loaded configuration — it does not crash and does not fall back to any default. In an interactive session someone sees the error; in an automated pipeline, or when the person doing the reload does not check the response, the failure is silent. The running server continues to work, so nothing looks wrong, and the change simply did not take effect: a new scrape job is not being scraped, a new alerting rule is not evaluated, a fixed rule is still broken. The gap is often discovered days later when someone asks why metrics from a service added last week are missing. The defence is layered: validate the config with \`promtool check config\` in CI before it can be merged, apply it through a config-as-code mechanism that only updates the file after validation, and run an alert on \`prometheus_config_last_reload_successful == 0\` so a failed reload pages someone, with \`prometheus_config_last_reload_success_timestamp_seconds\` available to show how long the server has been running on stale config.',
        whyHi: 'Prometheus configuration changes pick up karने ke liye restart nahi karता; ye ek signal ya ek HTTP call par reload karता hai. Agar nayी configuration invalid hai, reload fail karता hai aur ek error return karता hai, par process previously loaded configuration par chalता rehता hai — ye crash nahi karता aur kisi default par fall back nahi karता. Ek interactive session mein koi error dekhता hai; ek automated pipeline mein, failure silent hai. Running server kaam karता rehता hai, to kuch galat nahi dikhता, aur change simply effect mein nahi aaया. Defence layered hai: config ko \`promtool check config\` se CI mein validate karो merge hone se pehle, ise ek config-as-code mechanism ke through apply karो, aur \`prometheus_config_last_reload_successful == 0\` par ek alert chalाओ.',
      },
    ],

    realWorld: [
      {
        en: '**Hand-rolled scrape config, no k8s labels** — a team migrated off the Helm chart to a custom `prometheus.yml` and lost every Kubernetes label because they didn\'t port the relabel rules. Dashboards that grouped by `namespace` went blank. Re-adding the `labelmap` + three `replace` rules restored them.',
        hi: '**Hand-rolled scrape config, koi k8s labels nahi** — ek team Helm chart se ek custom `prometheus.yml` par migrate hui aur har Kubernetes label kho diya kyunki unhone relabel rules port nahi kiye. `namespace` se group karne wale dashboards blank ho gaye.',
      },
      {
        en: '**A `__name__` drop in `relabel_configs`** — someone put a metric-drop rule in `relabel_configs` instead of `metric_relabel_configs`. It matched nothing; the `apiserver_*_bucket` cardinality bomb (300k series) landed anyway and OOM\'d Prometheus a week later. Moving the rule down one section fixed it.',
        hi: '**`relabel_configs` mein ek `__name__` drop** — kisi ne `metric_relabel_configs` ke bajaay `relabel_configs` mein ek metric-drop rule daala. Ye kuch match nahi kiya; `apiserver_*_bucket` cardinality bomb phir bhi land hua.',
      },
      {
        en: '**Reload failed, stale for 9 days** — a bad indentation in a CI-less config edit made the reload 400. Nobody checked the response. A new service added that day emitted no metrics for 9 days until someone asked. Now: `promtool check config` in CI + an alert on `prometheus_config_last_reload_successful == 0`.',
        hi: '**Reload fail hua, 9 din stale** — ek CI-less config edit mein ek bad indentation ne reload ko 400 kiya. Kisi ne response check nahi kiya. Us din add kiye gaye ek naye service ne 9 din koi metrics emit nahi kiye. Ab: CI mein `promtool check config` + ek alert.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Prometheus discover what to scrape, and what is the difference between relabel_configs and metric_relabel_configs?',
        qHi: 'Prometheus kaise discover karता hai kya scrape karna hai, aur relabel_configs aur metric_relabel_configs mein kya difference hai?',
        a: 'Prometheus finds targets through the discovery mechanism declared in each scrape_config: static_configs for a hardcoded list, file_sd_configs for target lists in files that are watched and reloaded, kubernetes_sd_configs which watches the Kubernetes API and updates the target list as pods come and go with a role selecting pods, endpoints, services, nodes, or ingresses, and cloud discoverers like ec2_sd_configs. Each discovered target arrives carrying __meta_* labels with all the discovery metadata, plus __address__, __scheme__, and __metrics_path__. Labels beginning with double underscore are internal — available during relabelling and then dropped — so metadata you want to query on must be explicitly copied to a normal label. relabel_configs and metric_relabel_configs use identical syntax but run at different times on different data. relabel_configs runs during discovery, on the list of targets, before any scrape; it decides which targets to keep or drop and rewrites the scrape address and target labels — there is no metric name available yet. metric_relabel_configs runs after the scrape, once per sample, on that sample\'s label set which includes __name__; it decides which samples to keep and how to label each one, and it is where you drop a cardinality-bomb metric, keep only an allowlist, or strip a runaway label. Putting a metric-name rule in relabel_configs is a common mistake — it matches nothing because __name__ does not exist at target-discovery time.',
        aHi: 'Prometheus targets ko har scrape_config mein declared discovery mechanism ke through dhoondhता hai: ek hardcoded list ke liye static_configs, files mein target lists ke liye file_sd_configs, kubernetes_sd_configs jo Kubernetes API watch karता hai aur target list update karता hai jab pods aate aur jaते hain, aur cloud discoverers jaise ec2_sd_configs. Har discovered target __meta_* labels carry karता hua aata hai. Double underscore se shuru hone wale labels internal hain — relabelling ke dauraan available aur phir dropped. relabel_configs aur metric_relabel_configs identical syntax use karते hain par different times par different data par chalते hain. relabel_configs discovery ke dauraan chalता hai, targets ki list par, koi scrape se pehle. metric_relabel_configs scrape ke baad chalता hai, per sample, us sample ke label set par jismें __name__ shamil hai.',
      },
      {
        q: 'What is the `up` metric, and how do config reloads work — including what happens on a bad config?',
        qHi: '`up` metric kya hai, aur config reloads kaise kaam karते hain — including ek bad config par kya hota hai?',
        a: 'For every target on every scrape, Prometheus synthesises a series up{job, instance} that is 1 if the scrape succeeded and 0 if it failed — a timeout, a connection refused, a non-200 status, or output that could not be parsed. up == 0 is the most fundamental alert in any Prometheus deployment because it catches a target that has gone away or is unreachable, which no target-specific alert would. Alongside it Prometheus emits scrape_duration_seconds and scrape_samples_scraped, the latter being a useful early warning of cardinality growth if it climbs. Config reloads do not restart the process: you send a SIGHUP or POST to /-/reload and Prometheus re-reads prometheus.yml and the rule files. If the new configuration is valid it takes effect; if it is invalid — a bad regex, wrong indentation, a duplicate job name — the reload fails, returns an error, and Prometheus keeps running on the previously loaded configuration. It does not crash and does not fall back to a default. This makes a failed reload dangerous because it is silent: the server keeps working, nothing looks wrong, and the change simply did not apply, so a new scrape job is not scraped or a fixed rule is still broken, often discovered days later. The defences are validating with promtool check config in CI before merge, applying config through a config-as-code path, and alerting on prometheus_config_last_reload_successful == 0.',
        aHi: 'Har target ke liye har scrape par, Prometheus ek series up{job, instance} synthesise karता hai jo 1 hai agar scrape succeed hua aur 0 agar fail. up == 0 kisi bhi Prometheus deployment mein sabse fundamental alert hai kyunki ye ek target catch karता hai jo chala gaya hai ya unreachable hai. Iske saath Prometheus scrape_duration_seconds aur scrape_samples_scraped emit karता hai. Config reloads process ko restart nahi karते: aap ek SIGHUP ya /-/reload ko POST bhejте ho. Agar nayी configuration valid hai ye effect mein aati hai; agar ye invalid hai reload fail karता hai, ek error return karता hai, aur Prometheus previously loaded configuration par chalता rehता hai. Ye crash nahi karता. Ek failed reload isliए dangerous hai kyunki ye silent hai. Defences promtool check config se CI mein validate karna aur prometheus_config_last_reload_successful == 0 par alert karna hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain the scrape_config structure, the discovery options, and why __meta_* labels don\'t reach your metrics unless you copy them.',
        taskHi: 'Ek comment mein, scrape_config structure aur discovery options samjhao.',
        hint: 'PROMETHEUS PULLS `/metrics` from each target on an interval, all configured in `prometheus.yml`: `global` (scrape_interval / scrape_timeout / `external_labels` added to every series leaving this server), `rule_files` (recording + alerting rules — L3), `alerting.alertmanagers` (where alerts go — L4), `scrape_configs` (a list of JOBS). Each job: `job_name` → becomes the `job` label on every series; a discovery block; `relabel_configs` (act on TARGETS, before scraping); `metric_relabel_configs` (act on SCRAPED SAMPLES, before storing). DISCOVERY: `static_configs` (a hardcoded `host:port` list — a fixed set of exporters); `file_sd_configs` (targets from JSON/YAML files, watched + reloaded on change — glue for anything that writes a file); `kubernetes_sd_configs` (`role: pod | endpoints | service | node | ingress` — Prometheus watches the API, the target list updates as pods come/go); `ec2_sd` / `gce_sd` / `azure_sd` / `consul_sd` / `dns_sd`. Each discovered target arrives with `__meta_*` labels (ALL the discovery metadata), `__address__` (host:port), `__scheme__`, `__metrics_path__`. WHY `__meta_*` DOESN\'T REACH YOUR METRICS: any label starting with `__` is INTERNAL — it exists ONLY during the relabelling phase (available as a `source_labels` value), then is STRIPPED before the scrape and before any sample is stored. A scrape config with NO relabelling → series carry only `job` + `instance` → `http_requests_total{namespace="payments"}` returns NOTHING (the label doesn\'t exist on the data). FIX: explicitly `replace` each discovery label you\'ll query on into a normal label (`__meta_kubernetes_namespace` → `namespace`, `_pod_name` → `pod`, `_pod_node_name` → `node`), and `action: labelmap` `regex: __meta_kubernetes_pod_label_(.+)` to bulk-copy the pod\'s own k8s labels. (The Helm charts / kube-prometheus-stack ship these; hand-rolled configs must add them.)',
        hintHi: 'PROMETHEUS har target se ek interval par `/metrics` PULL karता hai, sab `prometheus.yml` mein: `global` (scrape_interval, `external_labels`), `rule_files` (L3), `alerting.alertmanagers` (L4), `scrape_configs` (JOBS ki list). Har job: `job_name` → `job` label; ek discovery block; `relabel_configs` (TARGETS par, scraping se pehle); `metric_relabel_configs` (SCRAPED SAMPLES par). DISCOVERY: `static_configs`; `file_sd_configs`; `kubernetes_sd_configs` (`role: pod | endpoints | service | node | ingress`); `ec2_sd` / `azure_sd` / `consul_sd` / `dns_sd`. Har target `__meta_*` labels, `__address__`, `__scheme__`, `__metrics_path__` ke saath aata hai. `__meta_*` AAPKI METRICS TAK KYUN NAHI PAHUNCHTA: `__` se shuru hone wala koi label INTERNAL hai — sirf relabelling phase mein exist karता hai, phir STRIPPED. Bina relabelling ke → series sirf `job` + `instance` carry karती hain. FIX: har discovery label ko explicitly `replace` karो, aur `action: labelmap`.',
      },
      {
        task: 'In a comment, list the relabel_configs actions, give the canonical k8s pod scrape pattern, and explain when to use relabel_configs vs metric_relabel_configs.',
        taskHi: 'Ek comment mein, relabel_configs actions list karo.',
        hint: 'RELABEL_CONFIGS = an ordered pipeline. Each rule: read `source_labels: [a, b]` → join with `;` → match against `regex` (default `(.*)`) → take an `action`: KEEP / DROP (keep or drop the whole TARGET if the regex matches — how you FILTER); REPLACE (write `replacement` — with `$1`,`$2` from the regex — into `target_label` — how you REWRITE `__address__`, set `__metrics_path__`, promote metadata); LABELMAP (copy every label matching the regex to a new name — turns `__meta_kubernetes_pod_label_*` into plain labels); LABELDROP / LABELKEEP (remove/retain labels by regex); HASHMOD (write `hash(source) mod N` — shard scraping across N Prometheis); LOWERCASE / UPPERCASE. THE CANONICAL K8s POD PATTERN: (1) `keep` where `__meta_kubernetes_pod_annotation_prometheus_io_scrape == "true"` (only annotated pods); (2) `replace` `__address__` ← `<pod_ip>:<prometheus.io/port annotation>` (regex `([^:]+)(?::\\d+)?;(\\d+)` → `$1:$2`); (3) `replace` `__metrics_path__` ← the `prometheus.io/path` annotation; (4) `replace` `__meta_kubernetes_namespace` → `namespace`, `_pod_name` → `pod`; (5) `labelmap` `__meta_kubernetes_pod_label_(.+)`. RELABEL_CONFIGS vs METRIC_RELABEL_CONFIGS (identical syntax, different time + data): `relabel_configs` runs during DISCOVERY, on the TARGET list, BEFORE any scrape → labels available = `__address__`, `__scheme__`, `__meta_*`, `job` — NO metric name (nothing scraped yet). `metric_relabel_configs` runs AFTER the scrape, once PER SAMPLE, on that sample\'s label set INCLUDING `__name__`. → drop a cardinality-bomb metric by `__name__`, `keep` only an allowlist of metric names, `labeldrop` a runaway label off an otherwise-fine metric → ALL go in `metric_relabel_configs`. Putting a `__name__` rule in `relabel_configs` matches NOTHING (silently does nothing → the bomb lands anyway). RULE: relabel = which TARGETS + target labels; metric_relabel = which SAMPLES + sample labels.',
        hintHi: 'RELABEL_CONFIGS = ek ordered pipeline. Har rule: `source_labels` read → `;` se join → `regex` ke against match → `action`: KEEP / DROP (poore TARGET ko keep/drop — FILTER); REPLACE (`replacement` ko `target_label` mein — `__address__` REWRITE); LABELMAP (regex match karने wale har label ko naye name par); LABELDROP / LABELKEEP; HASHMOD (shard); LOWERCASE / UPPERCASE. CANONICAL K8s PATTERN: (1) `keep` where `prometheus.io/scrape == "true"`; (2) `replace` `__address__` ← `<pod_ip>:<port annotation>`; (3) `replace` `__metrics_path__`; (4) `replace` `namespace`, `pod`; (5) `labelmap` pod labels. RELABEL vs METRIC_RELABEL: `relabel_configs` DISCOVERY ke dauraan, TARGET list par, koi scrape se pehle → NO metric name. `metric_relabel_configs` scrape ke BAAD, PER SAMPLE, `__name__` INCLUDING. Cardinality-bomb drop, allowlist `keep`, `labeldrop` → SAB `metric_relabel_configs` mein. `relabel_configs` mein `__name__` rule kuch MATCH NAHI karता.',
      },
      {
        task: 'In a comment, explain the `up` metric and its companions, and how config reloads behave on a bad config + the layered defence.',
        taskHi: 'Ek comment mein, `up` metric aur config reloads samjhao.',
        hint: 'THE `up` METRIC: for EVERY target on EVERY scrape, Prometheus synthesises `up{job, instance}` = 1 if the scrape SUCCEEDED, 0 if it FAILED (a timeout, connection refused, a non-200 status, unparseable output). `up == 0` is the MOST BASIC alert in any Prometheus setup — it catches a target that vanished / is unreachable, which no target-specific alert would. COMPANIONS: `scrape_duration_seconds` (how long the scrape took), `scrape_samples_scraped` (the number of series returned — WATCH THIS RISE as an early cardinality-growth warning), `scrape_samples_post_metric_relabeling`. CONFIG RELOADS: Prometheus does NOT restart to pick up config changes — send a `SIGHUP` or `POST /-/reload` and it re-reads `prometheus.yml` + the rule files. ON A BAD CONFIG (bad regex / wrong indentation / duplicate `job_name`): the reload FAILS, returns an error (`400`), and Prometheus KEEPS RUNNING on the PREVIOUSLY LOADED config — NO crash, NO restart, NO fallback to a default. This is DANGEROUS because it\'s SILENT: the server keeps working, nothing looks wrong, but the change simply didn\'t apply → a new scrape job isn\'t scraped, a new/fixed rule isn\'t evaluated → often discovered DAYS later ("why no metrics from the service we added last week?"). LAYERED DEFENCE: (1) `promtool check config prometheus.yml` + `promtool check rules rules/*.yml` in CI, BEFORE merge; (2) apply via config-as-code (a ConfigMap + a reloader sidecar, or Ansible) so the file is only updated AFTER it passed the check; (3) an ALERT: `prometheus_config_last_reload_successful == 0` for 5m → page; `prometheus_config_last_reload_success_timestamp_seconds` tells you WHEN the last good reload was (if it\'s old, you\'re on stale config).',
        hintHi: '`up` METRIC: HAR target ke liye HAR scrape par, Prometheus `up{job, instance}` synthesise karता hai = 1 agar scrape SUCCEEDED, 0 agar FAILED. `up == 0` sabse BASIC alert hai. COMPANIONS: `scrape_duration_seconds`, `scrape_samples_scraped` (ISE RISE dekho — cardinality-growth warning), `scrape_samples_post_metric_relabeling`. CONFIG RELOADS: Prometheus config changes ke liye RESTART NAHI karता — `SIGHUP` ya `POST /-/reload`. BAD CONFIG PAR: reload FAILS, ek error (`400`) return karता hai, aur Prometheus PREVIOUSLY LOADED config par CHALTA REHTA hai — NO crash, NO fallback. Ye DANGEROUS hai kyunki SILENT hai. LAYERED DEFENCE: (1) `promtool check config` + `check rules` CI mein; (2) config-as-code; (3) ALERT: `prometheus_config_last_reload_successful == 0`.',
      },
    ],

    keyTakeaways: [
      'Prometheus PULLS `/metrics` from each target on an interval, all in `prometheus.yml`: `global` (interval, `external_labels`), `rule_files`, `alerting.alertmanagers`, and `scrape_configs` (JOBS — `job_name` → the `job` label). DISCOVERY: `static_configs` (fixed), `file_sd` (from files), `kubernetes_sd` (`role: pod|endpoints|service|node|ingress`, auto-updating), `ec2_sd`/`consul_sd`/`dns_sd`.',
      'Every discovered target arrives with `__meta_*` (all discovery metadata), `__address__`, `__scheme__`, `__metrics_path__`. Labels starting with `__` are INTERNAL — used during relabelling, then DROPPED. To query by `namespace`/`pod`/`node` you MUST `replace`-copy each `__meta_*` label into a normal label (+ `labelmap` for the pod\'s own k8s labels). No relabelling → series carry only `job` + `instance`.',
      '`relabel_configs` (an ordered pipeline: `source_labels` → join `;` → `regex` → `action`) acts on TARGETS BEFORE the scrape — `keep`/`drop` to filter, `replace` to rewrite `__address__` and promote metadata, `labelmap`/`labeldrop`, `hashmod` to shard. `metric_relabel_configs` uses the SAME syntax but runs PER SAMPLE AFTER the scrape, on a label set that INCLUDES `__name__` — this is where you drop a cardinality-bomb metric, keep an allowlist, or strip a runaway label. A `__name__` rule in `relabel_configs` matches NOTHING.',
      'The `up{job,instance}` metric is 1 on a successful scrape, 0 on failure — `up == 0` is the most fundamental alert. Watch `scrape_samples_scraped` rising as an early cardinality warning.',
      'Prometheus RELOADS config on `SIGHUP`/`POST /-/reload`, NOT a restart. A BAD config → the reload FAILS and Prometheus KEEPS RUNNING on the old config, SILENTLY — the change never applies, often found days later. Defence: `promtool check config` + `check rules` in CI before merge, config-as-code, and an alert on `prometheus_config_last_reload_successful == 0`.',
    ],
    keyTakeawaysHi: [
      'Prometheus har target se ek interval par `/metrics` PULL karता hai, sab `prometheus.yml` mein: `global` (interval, `external_labels`), `rule_files`, `alerting.alertmanagers`, aur `scrape_configs` (JOBS — `job_name` → `job` label). DISCOVERY: `static_configs`, `file_sd`, `kubernetes_sd` (`role: pod|endpoints|service|node|ingress`, auto-updating), `ec2_sd`/`consul_sd`/`dns_sd`.',
      'Har discovered target `__meta_*` (saara discovery metadata), `__address__`, `__scheme__`, `__metrics_path__` ke saath aata hai. `__` se shuru hone wale labels INTERNAL hain — relabelling ke dauraan use, phir DROPPED. `namespace`/`pod`/`node` se query karne ke liye aapko har `__meta_*` label ko ek normal label mein `replace`-copy karना HOGA. Bina relabelling ke → series sirf `job` + `instance` carry karती hain.',
      '`relabel_configs` (ek ordered pipeline) TARGETS par SCRAPE SE PEHLE act karता hai — filter ke liye `keep`/`drop`, `__address__` rewrite aur metadata promote ke liye `replace`, `labelmap`/`labeldrop`, shard ke liye `hashmod`. `metric_relabel_configs` SAME syntax use karता hai par PER SAMPLE SCRAPE KE BAAD chalता hai, ek label set par jo `__name__` INCLUDE karता hai — yahaan aap ek cardinality-bomb metric drop karते ho. `relabel_configs` mein ek `__name__` rule kuch MATCH NAHI karता.',
      '`up{job,instance}` metric ek successful scrape par 1 hai, failure par 0 — `up == 0` sabse fundamental alert hai. `scrape_samples_scraped` ko rise hote dekho ek early cardinality warning ke roop mein.',
      'Prometheus config ko `SIGHUP`/`POST /-/reload` par RELOAD karता hai, ek restart NAHI. Ek BAD config → reload FAILS aur Prometheus purane config par CHALTA REHTA hai, SILENTLY — change kabhi apply nahi hota. Defence: merge se pehle CI mein `promtool check config` + `check rules`, config-as-code, aur `prometheus_config_last_reload_successful == 0` par ek alert.',
    ],
  },

  {
    slug: 'ops-promql-selectors-rates-and-aggregation',
    title: 'PromQL: Selectors, Rates & Aggregation',
    titleHi: 'PromQL: Selectors, Rates Aur Aggregation',
    description:
      'The query language, built from a small number of pieces: instant and range vectors, label matchers, the rate family for counters, the aggregation operators with by and without, topk and bottomk, and binary operations with explicit vector matching (on, ignoring, group_left). Learn these and almost every dashboard panel and alert expression is a short combination of them.',
    descriptionHi:
      'Query language, ek chhoti number of pieces se built: instant aur range vectors, label matchers, counters ke liye rate family, by aur without ke saath aggregation operators, topk aur bottomk, aur explicit vector matching ke saath binary operations (on, ignoring, group_left). Ye seekho aur lagbhag har dashboard panel aur alert expression unka ek short combination hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A spreadsheet with a time axis.** An instant vector is "the value of every matching cell right now" — one column. A range vector is "every value of every matching cell over the last five minutes" — a block of history, which you cannot chart directly; you have to reduce it, and `rate()` is the reduction that turns a counter\'s history into a slope. Label matchers are the filter on which rows you take. Aggregation with `by` is a pivot table: collapse everything except the columns you name. And a binary operation between two vectors is like a VLOOKUP — it only works if you tell it which column to join on (`on`) and whether the join is one-to-one or many-to-one (`group_left`).',
      hi: '**Ek time axis wali spreadsheet.** Ek instant vector "abhi har matching cell ki value" hai — ek column. Ek range vector "pichle paanch minute ke over har matching cell ki har value" hai — history ka ek block, jise aap directly chart nahi kar sakte; aapko ise reduce karna hoga, aur `rate()` wo reduction hai jo ek counter ki history ko ek slope mein badalता hai. Label matchers filter hain ki aap kaun si rows lete ho. `by` ke saath aggregation ek pivot table hai: aap jo columns name karte ho unke alawa sab kuch collapse karo. Aur do vectors ke beech ek binary operation ek VLOOKUP jaisा hai — ye sirf tab kaam karta hai jab aap ise batao kaun se column par join karna hai (`on`) aur join one-to-one hai ya many-to-one (`group_left`).',
    },

    simple: `**TWO KINDS OF EXPRESSION:**
\`\`\`
INSTANT VECTOR   a set of series, ONE value each, at the eval time.
  http_requests_total                          -> every series of this metric
  http_requests_total{job="api", code=~"5.."}  -> filtered by label matchers
RANGE VECTOR     a set of series, a RANGE of values each, over a duration.
  http_requests_total[5m]     -> the last 5 min of raw samples. can't be graphed
                                 directly - must be reduced by a *_over_time or rate().
\`\`\`

**LABEL MATCHERS:**  \`=\` exact  ·  \`!=\` not  ·  \`=~\` regex  ·  \`!~\` not regex
\`\`\`
{job="api", env=~"prod|staging", code!~"2..", instance!=""}
\`\`\`

**COUNTERS -> RATE FUNCTIONS** (a counter's raw value is meaningless - Module 15 L3):
\`\`\`
rate(c[5m])      per-second average rate of increase over 5m. handles resets.
                 the workhorse. window = 4x your scrape_interval, minimum.
irate(c[5m])     rate between the LAST TWO samples only. spiky, for fast-moving
                 graphs; NEVER for alerts (misses everything between the 2 points).
increase(c[1h])  total increase over 1h  ( = rate(c[1h]) * 3600 ). for "how many in
                 the last hour".
\`\`\`

**AGGREGATION OPERATORS** (collapse a vector across labels):
\`\`\`
sum / avg / min / max / count / stddev / quantile
  sum(rate(http_requests_total[5m])) by (job, code)     # keep only job + code
  sum(rate(http_requests_total[5m])) without (instance) # keep everything EXCEPT instance
topk(3, ...)      the 3 series with the highest values (keeps their labels)
bottomk(3, ...)   the 3 lowest
count(up == 0) by (job)     # how many targets are down, per job
\`\`\`
\`by\` = "group by these, drop the rest". \`without\` = "drop these, keep the rest".

**BINARY OPS + VECTOR MATCHING:**
\`\`\`
one-to-one (default): series match if ALL their labels are equal.
  sum(rate(errs[5m])) by (job) / sum(rate(total[5m])) by (job)   # both sides: {job}

when the label sets DIFFER, you must say how to match:
  ON (job)         match only on the  job  label, ignore the rest
  IGNORING (le)    match on all labels EXCEPT  le
  GROUP_LEFT(team) many-to-one: the LEFT side has more series; copy label  team
                   from the (one) right series onto each matching left series.
  GROUP_RIGHT(...) the mirror image.
example (attach a 'team' from an info metric onto a rate):
  sum(rate(http_requests_total[5m])) by (service)
    * on (service) group_left(team) service_info
\`\`\`

**OTHER USEFUL BITS:**
\`\`\`
offset 1w        evaluate the vector as of 1 week ago (week-over-week comparison)
absent(up{job="x"})   -> 1 if the series doesn't exist (alert on a target that
                         was never scraped, which  up == 0  can't catch)
( ... )[30m:1m]   a SUBQUERY - evaluate the inner expr every 1m over 30m, then
                  aggregate. e.g. max_over_time( rate(x[5m])[1h:1m] ).
clamp_max / clamp_min / round / label_replace / vector(0) / scalar()
\`\`\`

**VERIFY OFFLINE:** \`promtool test rules\` — write \`input_series\` and assert an
expr's \`exp_samples\` at an \`eval_time\`. no server needed.`,

    simpleHi: `**DO KINDS OF EXPRESSION:**
\`\`\`
INSTANT VECTOR   series ka ek set, har ek EK value, eval time par.
  http_requests_total                          -> is metric ki har series
  http_requests_total{job="api", code=~"5.."}  -> label matchers se filtered
RANGE VECTOR     series ka ek set, har ek values ka ek RANGE, ek duration ke over.
  http_requests_total[5m]     -> pichle 5 min ke raw samples. directly graph nahi
                                 ho sakta - ek *_over_time ya rate() se reduce karna hoga.
\`\`\`

**LABEL MATCHERS:**  \`=\` exact  ·  \`!=\` not  ·  \`=~\` regex  ·  \`!~\` not regex

**COUNTERS -> RATE FUNCTIONS** (ek counter ki raw value meaningless hai - Module 15 L3):
\`\`\`
rate(c[5m])      5m ke over per-second average rate of increase. resets handle karता hai.
                 workhorse. window = aapke scrape_interval ka 4x, minimum.
irate(c[5m])     sirf LAST TWO samples ke beech rate. spiky, fast-moving graphs ke liye;
                 KABHI alerts ke liye nahi.
increase(c[1h])  1h ke over total increase. "pichle ghante mein kitne" ke liye.
\`\`\`

**AGGREGATION OPERATORS** (ek vector ko labels ke across collapse karo):
\`\`\`
sum / avg / min / max / count / stddev / quantile
  sum(rate(http_requests_total[5m])) by (job, code)     # sirf job + code rakho
  sum(rate(http_requests_total[5m])) without (instance) # instance ke ALAWA sab rakho
topk(3, ...)      highest values wali 3 series
bottomk(3, ...)   sabse kam 3
count(up == 0) by (job)     # per job kitne targets down hain
\`\`\`
\`by\` = "in se group karो, baaki drop karो". \`without\` = "in ko drop karो, baaki rakho".

**BINARY OPS + VECTOR MATCHING:**
\`\`\`
one-to-one (default): series match karती hain agar unke SAARE labels equal hain.
  sum(rate(errs[5m])) by (job) / sum(rate(total[5m])) by (job)   # dono sides: {job}

jab label sets DIFFER karें, aapko kehना hoga kaise match karें:
  ON (job)         sirf  job  label par match karो
  IGNORING (le)    saare labels par match karो SIVAAY  le
  GROUP_LEFT(team) many-to-one: LEFT side ke zyada series hain; label  team  ko
                   (ek) right series se har matching left series par copy karो.
example ('team' ko ek info metric se ek rate par attach karना):
  sum(rate(http_requests_total[5m])) by (service)
    * on (service) group_left(team) service_info
\`\`\`

**BAAKI USEFUL BITS:**
\`\`\`
offset 1w        vector ko 1 hafte pehle ke as of evaluate karो
absent(up{job="x"})   -> 1 agar series exist nahi karती (ek target par alert jo kabhi
                         scrape nahi hua, jise  up == 0  catch nahi kar sakता)
( ... )[30m:1m]   ek SUBQUERY - inner expr ko har 1m over 30m evaluate karो.
\`\`\`

**OFFLINE VERIFY:** \`promtool test rules\` — \`input_series\` likhो aur ek expr ke
\`exp_samples\` ko ek \`eval_time\` par assert karो.`,

    content: `## Instant vectors and range vectors

Every PromQL expression evaluates to one of a few types, but the two you work with constantly are the **instant vector** and the **range vector**. An instant vector is a set of series, each with a single value, at the evaluation time — \`http_requests_total{job="api"}\` selects every series of that metric matching the label filter and gives its current value. A range vector is a set of series, each with a *range* of values over a stated duration — \`http_requests_total[5m]\` is the raw samples from the last five minutes. A range vector cannot be graphed or compared directly; it must be reduced by a function, either one of the \`*_over_time\` family for gauges or the \`rate\` family for counters.

## Label matchers

Inside the braces, \`=\` matches a label value exactly, \`!=\` excludes it, \`=~\` matches a RE2 regular expression, and \`!~\` excludes one. \`http_requests_total{job="api", env=~"prod|staging", code!~"2..", instance!=""}\` selects the api job in prod or staging, excluding 2xx responses, with a non-empty instance label. An empty-string matcher on a label that some series lack is how you require a label to be present or absent.

## The rate family

A counter\'s stored value is the total since the process started and is meaningless on its own (Module 15). You read a counter through a function:

- **rate(c[5m])** is the per-second average rate of increase over the window, and it correctly handles the counter resetting to zero on a restart. This is the function you use for almost everything. The window must be at least four times the scrape interval so that a scrape or two being missed does not leave the window with too few points.
- **irate(c[5m])** computes the rate between only the last two samples in the window. It is very responsive and good for a fast-moving graph, but it ignores everything between those two points, so it must never be used in an alert — a spike that happened three minutes ago and recovered is invisible to \`irate\`.
- **increase(c[1h])** is the total increase over the window, equal to \`rate\` times the window in seconds. Use it for "how many happened in the last hour".

## Aggregation

The aggregation operators — \`sum\`, \`avg\`, \`min\`, \`max\`, \`count\`, \`stddev\`, \`quantile\` — collapse an instant vector across labels. The clause \`by (job, code)\` means "group the series by these labels and drop all others", so \`sum(rate(http_requests_total[5m])) by (job, code)\` produces one series per job-and-code combination. The clause \`without (instance)\` means the opposite: "drop only the instance label, keep everything else". \`topk(3, expr)\` and \`bottomk(3, expr)\` return the three series with the highest and lowest values, preserving their labels, which is how you find the noisiest instance or the slowest route.

## Binary operations and vector matching

When you combine two instant vectors with an operator — division for a ratio, subtraction for a delta, multiplication to scale — Prometheus has to decide which series on the left pairs with which on the right. By default the matching is **one-to-one**: a series on the left matches a series on the right only if *all* their labels are identical. So \`sum(rate(errs[5m])) by (job) / sum(rate(total[5m])) by (job)\` works because both sides have been reduced to just a \`job\` label and they line up.

When the label sets differ, you must specify the match:

- **on (job)** matches only on the \`job\` label and ignores every other label.
- **ignoring (le)** matches on all labels except \`le\`.
- **group_left(team)** declares a **many-to-one** match: the left side has more series than the right, each left series matches one right series, and the labels named in the parentheses — here \`team\` — are copied from the right series onto each matched left series. \`group_right\` is the mirror image. This is the mechanism for enriching a metric with a label from an "info" metric: \`sum(rate(http_requests_total[5m])) by (service) * on (service) group_left(team) service_info\` attaches the \`team\` label from \`service_info\` onto the per-service request rate.

## Other operators worth knowing

- **offset 1w** evaluates the vector as of one week ago, for week-over-week comparisons.
- **absent(v)** returns \`1\` if \`v\` matched no series, which lets you alert on a target that was never scraped at all — something \`up == 0\` cannot catch because \`up\` only exists for targets that are being scraped.
- A **subquery** \`(inner)[30m:1m]\` evaluates \`inner\` every minute over the last thirty minutes and produces a range vector you can then aggregate, for expressions like "the maximum five-minute rate seen in the last hour".
- \`label_replace\`, \`clamp_max\`, \`round\`, \`vector(0)\` (a way to make an expression return zero instead of nothing when there is no data), and \`scalar\` round out the toolkit.

## Verifying PromQL offline

\`promtool test rules\` runs a unit-test file with no server. You define \`input_series\` using a compact syntax — \`values: "0+240x20"\` means start at 0 and add 240 twenty times, \`values: "1 2 _ 4"\` uses \`_\` for a gap — and assert that an expression produces exact \`exp_samples\` at a given \`eval_time\`. This lets you check that a recording rule or an alert expression computes what you think it does before it ships.`,

    contentHi: `## Instant vectors aur range vectors

Har PromQL expression ek few types mein se ek ko evaluate karता hai, par do jinke saath aap constantly kaam karते ho wo **instant vector** aur **range vector** hain. Ek instant vector series ka ek set hai, har ek ek single value ke saath, evaluation time par. Ek range vector series ka ek set hai, har ek ek stated duration ke over values ka ek *range* ke saath. Ek range vector ko directly graph ya compare nahi kiya ja sakта; ise ek function se reduce karna chahिए.

## Label matchers

Braces ke andar, \`=\` ek label value ko exactly match karता hai, \`!=\` ise exclude karता hai, \`=~\` ek RE2 regular expression match karता hai, aur \`!~\` ek ko exclude karता hai.

## Rate family

Ek counter ki stored value process shuru hone se total hai aur apne aap meaningless hai. Aap ek counter ko ek function ke through padhते ho:
- **rate(c[5m])** window ke over per-second average rate of increase hai, aur ye counter ke ek restart par zero par reset hone ko correctly handle karता hai. Window scrape interval ka kam se kam chaar times hona chahिए.
- **irate(c[5m])** window mein sirf last two samples ke beech rate compute karता hai. Ye kabhi ek alert mein use nahi hona chahिए.
- **increase(c[1h])** window ke over total increase hai. "Pichle ghante mein kitne hue" ke liye ise use karो.

## Aggregation

Aggregation operators — \`sum\`, \`avg\`, \`min\`, \`max\`, \`count\` — ek instant vector ko labels ke across collapse karते hain. Clause \`by (job, code)\` ka matlab "series ko in labels se group karो aur baaki sab drop karो". Clause \`without (instance)\` ka matlab opposite hai. \`topk(3, expr)\` highest values wali teen series return karता hai.

## Binary operations aur vector matching

Jab aap do instant vectors ko ek operator ke saath combine karते ho, Prometheus ko decide karna hoga kaun si series left par kaun si right par pair karती hai. Default se matching **one-to-one** hai. Jab label sets differ karें, aapko match specify karna hoga:
- **on (job)** sirf \`job\` label par match karता hai.
- **ignoring (le)** \`le\` ke alawa saare labels par match karता hai.
- **group_left(team)** ek **many-to-one** match declare karता hai: left side ke zyada series hain, aur parentheses mein named labels right series se har matched left series par copy kiye jaते hain.

## Baaki operators

- **offset 1w** vector ko ek hafte pehle ke as of evaluate karता hai.
- **absent(v)** \`1\` return karता hai agar \`v\` ne koi series match nahi ki.
- Ek **subquery** \`(inner)[30m:1m]\` \`inner\` ko har minute over pichle tees minute evaluate karता hai.

## PromQL ko offline verify karna

\`promtool test rules\` ek unit-test file bina ek server ke chalाता hai. Aap \`input_series\` define karते ho ek compact syntax use karके aur assert karते ho ki ek expression ek given \`eval_time\` par exact \`exp_samples\` produce karता hai.`,

    examples: [
      {
        title: 'Verifying a rate, an error ratio, and a group_left join with promtool test rules',
        titleHi: 'promtool test rules ke saath ek rate, ek error ratio, aur ek group_left join verify karna',
        code: `# VERIFY
export PATH="$HOME/bin:$PATH"

cat > rules.yml <<'YML'
groups:
  - name: promql-demo
    rules:
      - record: job:http_requests:rate5m
        expr: sum(rate(http_requests_total[5m])) by (job)
      - record: job:http_errors:ratio5m
        expr: |
          sum(rate(http_requests_total{code=~"5.."}[5m])) by (job)
          / sum(rate(http_requests_total[5m])) by (job)
      # many-to-one: attach the 'team' label from an info metric onto the rate
      - record: job:http_requests:rate5m:with_team
        expr: |
          sum(rate(http_requests_total[5m])) by (job)
          * on (job) group_left(team) service_info
YML

cat > test.yml <<'YML'
rule_files: [ rules.yml ]
evaluation_interval: 1m
tests:
  - interval: 1m
    input_series:
      - series: 'http_requests_total{job="api", instance="i1", code="200"}'
        values: "0+240x20"
      - series: 'http_requests_total{job="api", instance="i2", code="200"}'
        values: "0+240x20"
      - series: 'http_requests_total{job="api", instance="i1", code="503"}'
        values: "0+60x20"
      - series: 'http_requests_total{job="api", instance="i2", code="503"}'
        values: "0+60x20"
      - series: 'service_info{job="api", team="checkout", version="4.2"}'
        values: "1x20"
    promql_expr_test:
      - expr: job:http_requests:rate5m
        eval_time: 10m
        exp_samples:
          - labels: 'job:http_requests:rate5m{job="api"}'
            value: 10                 # (240+240+60+60)/60s
      - expr: job:http_errors:ratio5m
        eval_time: 10m
        exp_samples:
          - labels: 'job:http_errors:ratio5m{job="api"}'
            value: 0.2                # 120 errs / 600 total per minute = 20%
      - expr: job:http_requests:rate5m:with_team
        eval_time: 10m
        exp_samples:
          - labels: 'job:http_requests:rate5m:with_team{job="api", team="checkout"}'
            value: 10                 # the rate, now carrying team="checkout"
YML

promtool check rules rules.yml
promtool test rules test.yml`,
        output: `Checking rules.yml
  SUCCESS: 3 rules found

  SUCCESS`,
        explain: 'Three recording rules and a unit test that proves each one computes what it claims. The first rule takes the per-second rate of the request counter over five minutes and sums it to one value per job. The second divides the rate of 5xx responses by the rate of all responses, both summed by job, giving the error ratio. The third is a many-to-one join: it multiplies the per-job request rate by the \`service_info\` metric, matching only on the \`job\` label with \`on (job)\`, and \`group_left(team)\` copies the \`team\` label from the single \`service_info\` series onto the rate series, which is how you enrich a numeric metric with a categorical label that lives on a separate info series. The test file defines four counter series — two instances, each with a 200 and a 503 stream — using the compact \`0+240x20\` syntax meaning "start at zero, add 240 twenty times", plus a constant \`service_info\` series. It then asserts the exact value each recording rule produces at the ten-minute mark: a total rate of 10 requests per second, an error ratio of 0.2, and the same rate of 10 now carrying \`team="checkout"\`. \`promtool test rules\` runs this with no Prometheus server and reports SUCCESS, confirming the multiplication, `on`/`group_left` matching, and every arithmetic step are correct before the rules are deployed.',
        explainHi: 'Teen recording rules aur ek unit test jo prove karता hai har ek wo compute karता hai jo ye claim karता hai. Pehla rule request counter ki per-second rate paanch minute ke over leता hai aur ise per job ek value mein sum karता hai. Doosra 5xx responses ki rate ko saari responses ki rate se divide karता hai, dono job se summed, error ratio deता hua. Teesra ek many-to-one join hai: ye per-job request rate ko \`service_info\` metric se multiply karता hai, sirf \`job\` label par match karता hua, aur \`group_left(team)\` \`team\` label ko single \`service_info\` series se rate series par copy karता hai. Test file chaar counter series define karता hai compact \`0+240x20\` syntax use karके. Ye phir exact value assert karता hai jo har recording rule ten-minute mark par produce karता hai. \`promtool test rules\` ise bina ek Prometheus server ke chalाता hai aur SUCCESS report karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# using irate() in an alert
  - alert: HighErrorRate
    expr: sum(irate(http_requests_total{code=~"5.."}[5m])) > 10
    for: 5m
  # irate() uses ONLY the last two samples in the window. so at every evaluation
  # it's asking "what was the rate between the two most recent scrapes?". a burst
  # of errors that started 3 min ago and stopped 1 min ago is INVISIBLE - the last
  # two samples are both post-burst. the alert never fires for a real 4-minute
  # incident. and irate is jumpy: it flaps above/below the threshold on scrape jitter.`,
        right: `# rate() for alerts (and for any slow-moving graph). irate() only for a
  # high-resolution "right now" graph you're staring at during an incident.
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{code=~"5.."}[5m])) by (job)
      / sum(rate(http_requests_total[5m])) by (job)
      > 0.02
    for: 5m
  # rate() averages over the WHOLE window, so a 4-minute burst inside a 5-minute
  # window pulls the average up and the alert fires. and it's smooth - no flapping.
  # (alert on the RATIO, not the raw count - Module 15 L4/L6.)`,
        why: 'The \`rate\` and \`irate\` functions both estimate the per-second rate of a counter over a window, but by different methods. \`rate\` performs a least-squares-like fit over all the samples in the window, so it reflects the average behaviour across the whole window and is smooth. \`irate\` looks only at the last two samples, so it reflects the instantaneous rate at the most recent moment and is jumpy. For a graph you are watching live during an incident, \`irate\`\'s responsiveness is useful. For an alert it is wrong, because an alert evaluates periodically and each evaluation with \`irate\` only sees the gap between the two newest scrapes. A real incident — a burst of errors that lasts three or four minutes and then recovers — leaves the two newest samples both in the recovered state by the time the next evaluation happens, so the alert never sees the burst and never fires. \`irate\` also flaps: normal scrape-to-scrape jitter moves the two-point rate above and below the threshold repeatedly. \`rate\` over a window several times the alert\'s \`for\` duration averages the burst in, so a sustained problem reliably crosses the threshold and stays there.',
        whyHi: '\`rate\` aur \`irate\` functions dono ek counter ki per-second rate ek window ke over estimate karते hain, par different methods se. \`rate\` window mein saare samples ke over ek fit perform karता hai, to ye poore window ke across average behaviour reflect karता hai aur smooth hai. \`irate\` sirf last two samples dekhता hai, to ye most recent moment par instantaneous rate reflect karता hai aur jumpy hai. Ek alert ke liye ye galat hai, kyunki ek alert periodically evaluate karता hai aur \`irate\` ke saath har evaluation sirf do newest scrapes ke beech gap dekhता hai. Ek real incident — errors ka ek burst jo teen ya chaar minute chalता hai aur phir recover hota hai — do newest samples ko dono recovered state mein chhodता hai. \`rate\` ek window ke over burst ko average karता hai.',
      },
      {
        wrong: `# a range vector where an instant vector is required (and vice versa)
  # trying to graph a range vector directly:
    http_requests_total[5m]            -> ERROR: "invalid expression type range vector"
  # trying to rate() an instant vector:
    rate(http_requests_total)          -> ERROR: "expected type range vector ... got instant"
  # forgetting the range on a *_over_time:
    avg_over_time(queue_depth)         -> ERROR
  # or the classic: rate() of a GAUGE (memory, temperature, queue depth):
    rate(node_memory_used_bytes[5m])   -> "works" but is nonsense - rate() assumes
                                          monotonic-increasing; on a gauge it gives
                                          garbage (only counts the increases).`,
        right: `# match the shape to the function:
  #   RAW GRAPH of a gauge          -> the instant vector directly:  queue_depth
  #   SMOOTHED gauge over a window  -> avg_over_time(queue_depth[10m])   (range in!)
  #   a COUNTER's throughput        -> rate(http_requests_total[5m])     (range in!)
  #   a COUNTER's total over 1h     -> increase(http_requests_total[1h])
  #   a gauge's trend/slope         -> deriv(queue_depth[30m])  or  delta(queue_depth[1h])
  # remember:
  #   [5m]  makes a range vector.  rate/increase/*_over_time  CONSUME a range vector
  #   and RETURN an instant vector. everything else wants instant vectors.`,
        why: 'PromQL is strict about expression types, and the two most common shape errors are using a range vector where an instant vector is expected and vice versa. A bare metric with a duration selector, \`http_requests_total[5m]\`, is a range vector — a block of raw samples — and cannot be graphed, compared, or aggregated directly; it only makes sense as the argument to a function that consumes a range and returns an instant value, such as \`rate\`, \`increase\`, or the \`*_over_time\` family. Conversely those functions require the range selector: \`rate(http_requests_total)\` without \`[5m]\` is an error. A subtler mistake is applying \`rate\` to a gauge. \`rate\` is defined for counters and assumes the value only increases except at resets; on a gauge, which goes up and down, it interprets every decrease as a reset and only sums the increases, producing a number that looks plausible but is meaningless. The correct functions for a gauge are the instant vector itself for a raw graph, \`avg_over_time\` or \`max_over_time\` for a smoothed view over a window, and \`deriv\` or \`delta\` for its trend.',
        whyHi: 'PromQL expression types ke baare mein strict hai, aur do sabse common shape errors ek range vector use karna jahaan ek instant vector expected hai aur vice versa hain. Ek bare metric ek duration selector ke saath, \`http_requests_total[5m]\`, ek range vector hai — raw samples ka ek block — aur ise directly graph, compare, ya aggregate nahi kiya ja sakता; ye sirf ek function ke argument ke roop mein sense banाता hai jo ek range consume karता hai aur ek instant value return karता hai. Conversely wo functions range selector require karते hain. Ek subtler mistake ek gauge par \`rate\` apply karna hai. \`rate\` counters ke liye defined hai aur assume karता hai value sirf increase hoती hai; ek gauge par ye har decrease ko ek reset ke roop mein interpret karता hai aur sirf increases sum karता hai.',
      },
      {
        wrong: `# a binary op between two vectors with different labels and no matching clause
    sum(rate(http_request_duration_seconds_sum[5m])) by (job, instance, path)
  /
    sum(rate(http_request_duration_seconds_count[5m])) by (job, instance)
  # -> "many-to-many matching not allowed" OR silently returns FEWER series than
  #    you expect. the left side has a  path  label the right side doesn't, so
  #    most left series find no right series to divide by and vanish from the result.
  # you wanted "avg latency per path" and got a confusing partial result.`,
        right: `# make BOTH sides have the SAME label set, or use ignoring()/on():
  # option A - aggregate both to the same labels:
    sum(rate(http_request_duration_seconds_sum[5m])) by (job, path)
  /
    sum(rate(http_request_duration_seconds_count[5m])) by (job, path)
  # option B - keep the extra label but tell PromQL to ignore it on the right:
    sum(rate(..._sum[5m])) by (job, path)
  /  ignoring(path) group_left
    sum(rate(..._count[5m])) by (job)      # right has no 'path' -> ignoring + group_left
  # rule: a plain  /  requires identical label sets on both sides. any difference
  # -> you must reconcile with by()/without() or on()/ignoring()/group_left().`,
        why: 'A binary operator between two instant vectors defaults to one-to-one matching, which pairs a left series with a right series only when every label is identical on both. If the two sides have been aggregated to different label sets — the left keeps a \`path\` label, the right does not — then for most left series there is no right series with a matching label set, so those left series produce no output and the result silently has fewer series than expected, or if there are duplicates on one side the query fails with a many-to-many error. The intended calculation, average latency per path, comes out as a confusing partial result. The fix is to make the two sides comparable. Either aggregate both to exactly the same label set with matching \`by\` clauses, so every left series has exactly one right series to pair with, or keep the asymmetry deliberately and tell PromQL how to handle it: \`ignoring(path)\` on the operator drops \`path\` from the match, and \`group_left\` declares that the left side is the many side. Any time the two sides of a binary operation do not have identical label sets, the query needs an explicit matching clause.',
        whyHi: 'Do instant vectors ke beech ek binary operator one-to-one matching ko default karता hai, jo ek left series ko ek right series se pair karता hai sirf jab har label dono par identical hai. Agar do sides ko different label sets mein aggregate kiya gaya hai — left ek \`path\` label rakhता hai, right nahi — to zyadaatar left series ke liye ek matching label set wali koi right series nahi hai, to wo left series koi output produce nahi karती aur result silently expected se kam series rakhता hai. Fix do sides ko comparable banana hai. Ya to dono ko exactly same label set mein matching \`by\` clauses ke saath aggregate karो, ya asymmetry ko deliberately rakho aur PromQL ko batao kaise handle karे: \`ignoring(path)\` operator par match se \`path\` drop karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**irate in an alert, missed a 4-minute outage** — an alert used `irate(...[5m])`. A 4-minute 500 storm recovered before the next evaluation caught the last two samples in the recovered state; the alert never fired. Support tickets did. Switching to `rate(...[5m])` over the ratio made the same class of incident page in ~90s.',
        hi: '**Ek alert mein irate, ek 4-minute outage miss** — ek alert ne `irate(...[5m])` use kiya. Ek 4-minute 500 storm agla evaluation last two samples ko recovered state mein catch karne se pehle recover ho gaya; alert kabhi fire nahi hua. `rate(...[5m])` par switch karna same class of incident ko ~90s mein page karवाया.',
      },
      {
        en: '**A `/` between mismatched label sets** — an "average latency per path" panel divided `_sum by (job,path)` by `_count by (job)` and silently showed only 3 of 40 paths (the ones that happened to have a matching series). Adding `path` to both `by` clauses fixed it.',
        hi: '**Mismatched label sets ke beech ek `/`** — ek "per path average latency" panel ne `_sum by (job,path)` ko `_count by (job)` se divide kiya aur silently 40 mein se sirf 3 paths dikhaye. Dono `by` clauses mein `path` add karna fix kiya.',
      },
      {
        en: '**`rate()` on a gauge** — a dashboard graphed `rate(pool_active_connections[5m])` (a gauge). The line was always near zero (it only summed the increases) and hid a pool that was regularly maxing out. `pool_active_connections` directly + `max_over_time` for a smoothed view showed the saturation.',
        hi: '**Ek gauge par `rate()`** — ek dashboard ne `rate(pool_active_connections[5m])` (ek gauge) graph kiya. Line hamesha zero ke paas thi aur ek pool chupaya jo regularly max out ho raha tha. `pool_active_connections` directly saturation dikhaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an instant vector and a range vector, and why must you use rate() rather than reading a counter directly?',
        qHi: 'Ek instant vector aur ek range vector mein kya difference hai, aur aap ek counter ko directly padhne ke bajaay rate() kyun use karना chahिए?',
        a: 'An instant vector is a set of series each with a single value at the evaluation time — a bare metric selector like http_requests_total{job="api"} produces one. A range vector is a set of series each with a range of raw values over a stated duration — the same selector with a duration, http_requests_total[5m], produces one. A range vector cannot be graphed, compared, or aggregated directly; it only makes sense as the argument to a function that consumes a range and returns an instant value, such as rate, increase, or the *_over_time family for gauges. You must read a counter through rate rather than directly because a counter\'s stored value is the cumulative total since the process started, which carries no useful information on its own — the number is large and always climbing, so a graph of it shows the accumulated history rather than current behaviour, and a restart resets it to zero, making the graph drop to zero as if there were an outage. rate(c[5m]) computes the per-second average rate of increase over the window and correctly accounts for the resets, giving you throughput. The window should be at least four times the scrape interval so that one or two missed scrapes do not leave too few points to compute a rate.',
        aHi: 'Ek instant vector series ka ek set hai har ek evaluation time par ek single value ke saath. Ek range vector series ka ek set hai har ek ek stated duration ke over raw values ka ek range ke saath. Ek range vector ko directly graph, compare, ya aggregate nahi kiya ja sakता; ye sirf ek function ke argument ke roop mein sense banाता hai jo ek range consume karता hai aur ek instant value return karता hai. Aap ek counter ko rate ke through padhना chahिए directly ke bajaay kyunki ek counter ki stored value process shuru hone se cumulative total hai, jo apne aap koi useful information carry nahi karती — number badhा hai aur hamesha climbing, aur ek restart ise zero par reset karता hai. rate(c[5m]) window ke over per-second average rate of increase compute karता hai aur resets ke liye correctly account karता hai.',
      },
      {
        q: 'Explain PromQL vector matching: one-to-one, on/ignoring, and group_left. When do you need group_left?',
        qHi: 'PromQL vector matching samjhao: one-to-one, on/ignoring, aur group_left. Aapko group_left kab chahिए?',
        a: 'When you combine two instant vectors with a binary operator, Prometheus has to pair each left series with a right series. The default is one-to-one matching: a left series pairs with a right series only if all their labels are identical. This works when both sides have been aggregated to the same label set, such as an error ratio where both the numerator and denominator are summed by job. When the label sets differ you must specify the match. on (job) matches only on the job label and ignores all others. ignoring (le) matches on every label except le, which is common when dividing a histogram bucket count by a total. group_left declares a many-to-one match: the left side has more series than the right, each left series matches one right series, and the labels named in the parentheses are copied from the right series onto each matched left series. group_right is the mirror. You need group_left when you want to enrich a metric that has many series with a label that lives on a single info metric — for example multiplying a per-service request rate by a service_info metric with on (service) group_left(team) attaches the team label from service_info onto every per-service rate series, so you can then aggregate the rate by team. Without group_left that multiplication would be a many-to-one match with no permission to be many-to-one and would fail.',
        aHi: 'Jab aap do instant vectors ko ek binary operator ke saath combine karते ho, Prometheus ko har left series ko ek right series se pair karna hoga. Default one-to-one matching hai: ek left series ek right series se pair karती hai sirf agar unke saare labels identical hain. Jab label sets differ karें aapko match specify karna hoga. on (job) sirf job label par match karता hai. ignoring (le) le ke alawa har label par match karता hai. group_left ek many-to-one match declare karता hai: left side ke zyada series hain, har left series ek right series se match karती hai, aur parentheses mein named labels right series se har matched left series par copy kiye jaते hain. Aapko group_left chahिए jab aap ek metric jiske kई series hain ko ek label se enrich karna chahते ho jo ek single info metric par rehता hai.',
      },
      {
        q: 'How do you verify a PromQL expression or an alert rule without a running Prometheus?',
        qHi: 'Aap ek PromQL expression ya ek alert rule ko ek running Prometheus ke bina kaise verify karते ho?',
        a: 'promtool test rules runs a YAML unit-test file completely offline, with no server. The file references your rule files, sets an evaluation interval, and defines one or more tests. Each test provides input_series using a compact syntax: values: "0+240x20" means start at zero and add 240 twenty times, and values: "1 2 _ 4" uses an underscore for a missing sample. The test then makes assertions of two kinds. promql_expr_test asserts that a given expression, at a given eval_time, produces exactly the exp_samples you specify — the exact label set and the exact value for each resulting series. alert_rule_test asserts that a named alert, at a given eval_time, produces exactly the exp_alerts you specify, each with its exact exp_labels and exp_annotations, which lets you verify that the for duration works — the alert is pending and not firing before the duration elapses, and firing after — and that the annotation templating produces the text you expect. Running this in CI on every change to a rule file means a broken expression, a wrong threshold, or a rule that does not fire when it should is caught before it is deployed, rather than discovered during an incident when the alert that should have paged did not.',
        aHi: 'promtool test rules ek YAML unit-test file poori tarah offline chalाता hai, bina ek server ke. File aapke rule files reference karता hai, ek evaluation interval set karता hai, aur ek ya zyada tests define karता hai. Har test input_series provide karता hai ek compact syntax use karके: values: "0+240x20" ka matlab zero par shuru karो aur 240 bees baar add karो. Test phir do kinds ki assertions banाता hai. promql_expr_test assert karता hai ki ek given expression, ek given eval_time par, exactly wo exp_samples produce karता hai jo aap specify karते ho. alert_rule_test assert karता hai ki ek named alert, ek given eval_time par, exactly wo exp_alerts produce karता hai, har ek iske exact exp_labels aur exp_annotations ke saath, jo aapko verify karने deta hai ki for duration kaam karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define instant vs range vectors, the rate family (rate/irate/increase) and when to use each, and the aggregation clause by vs without.',
        taskHi: 'Ek comment mein, instant vs range vectors aur rate family samjhao.',
        hint: 'INSTANT VECTOR = a set of series, ONE value each, at the eval time (`http_requests_total{job="api", code=~"5.."}` — filtered by label matchers: `=` exact / `!=` not / `=~` regex / `!~` not-regex). RANGE VECTOR = a set of series, a RANGE of raw values each, over a duration (`http_requests_total[5m]`) — CANNOT be graphed/compared/aggregated directly; ONLY valid as the argument to a function that CONSUMES a range and RETURNS an instant vector. RATE FAMILY (a counter\'s raw value is meaningless — it\'s the cumulative total since process start, always climbing, resets to 0 on restart): `rate(c[5m])` = per-second average rate of increase over the WHOLE window, handles resets, SMOOTH — the workhorse, for alerts + slow graphs; window ≥ 4× the scrape_interval. `irate(c[5m])` = rate between ONLY the LAST TWO samples — very responsive but JUMPY; ONLY for a high-res "right now" graph you\'re watching live; NEVER in an alert (a 4-min burst that recovered leaves both recent samples post-burst → the alert never sees it → and it flaps on scrape jitter). `increase(c[1h])` = total increase over the window (= `rate × window_seconds`) — for "how many happened in the last hour". DON\'T `rate()` a GAUGE (memory/queue depth/temperature) — `rate` assumes monotonic-increasing, so on a gauge it treats every decrease as a reset and only sums the increases → plausible-looking garbage; use the instant vector directly / `avg_over_time` / `max_over_time` / `deriv` / `delta`. AGGREGATION (`sum`/`avg`/`min`/`max`/`count`/`stddev`/`quantile`, + `topk(k,…)`/`bottomk(k,…)` which keep labels): `by (job, code)` = "GROUP BY these labels, DROP all others". `without (instance)` = "DROP only these, KEEP everything else". `by ()` collapses to a single value.',
        hintHi: 'INSTANT VECTOR = series ka ek set, har ek EK value, eval time par (label matchers se filtered: `=` / `!=` / `=~` / `!~`). RANGE VECTOR = series ka ek set, har ek raw values ka ek RANGE, ek duration ke over (`http_requests_total[5m]`) — directly graph/compare/aggregate NAHI ho sakta; SIRF ek function ke argument ke roop mein valid. RATE FAMILY: `rate(c[5m])` = POORE window ke over per-second average rate, resets handle karता hai, SMOOTH — workhorse, alerts + slow graphs ke liye; window ≥ 4× scrape_interval. `irate(c[5m])` = SIRF LAST TWO samples ke beech rate — JUMPY; KABHI alert mein nahi. `increase(c[1h])` = window ke over total increase. GAUGE ko `rate()` MAT karो. AGGREGATION: `by (job, code)` = "in se GROUP BY, baaki DROP". `without (instance)` = "sirf in ko DROP, baaki KEEP".',
      },
      {
        task: 'In a comment, explain binary-op vector matching: the one-to-one default, on()/ignoring(), and group_left/group_right — with the error-ratio and the info-metric-enrichment examples.',
        taskHi: 'Ek comment mein, binary-op vector matching samjhao.',
        hint: 'When two INSTANT VECTORS are combined with an operator (`/` for a ratio, `-` for a delta, `*` to scale/enrich), Prometheus must PAIR each left series with a right series. DEFAULT = ONE-TO-ONE: a left series matches a right series ONLY IF ALL their labels are identical. WORKS for the ERROR RATIO because both sides are reduced to the same label set: `sum(rate(errs[5m])) by (job) / sum(rate(total[5m])) by (job)` — both sides carry only `{job}`, they line up. When the label sets DIFFER you MUST specify the match: `on (job)` = match ONLY on the `job` label, ignore all others. `ignoring (le)` = match on EVERY label EXCEPT `le` (common when dividing a histogram bucket by a total). `group_left(team)` = a MANY-TO-ONE match: the LEFT side has MORE series than the right; each left series matches ONE right series; the labels in the parens (`team`) are COPIED from the (one) right series ONTO each matched left series. `group_right(…)` = the mirror. YOU NEED group_left to ENRICH a many-series metric with a label from a single "info" metric: `sum(rate(http_requests_total[5m])) by (service) * on (service) group_left(team) service_info` → attaches `team` from `service_info` onto every per-service rate series → you can then `sum(...) by (team)`. Without `group_left` that `*` is a disallowed many-to-one and FAILS. COMMON BUG: a plain `/` between `_sum by (job,path)` and `_count by (job)` — the left has a `path` label the right doesn\'t → most left series find no match → SILENTLY fewer result series than expected. FIX: add `path` to BOTH `by` clauses, OR `ignoring(path) group_left`. RULE: any difference in the two sides\' label sets → you MUST reconcile with `by()`/`without()` or `on()`/`ignoring()`/`group_left()`.',
        hintHi: 'Jab do INSTANT VECTORS ek operator ke saath combine hoते hain, Prometheus ko har left series ko ek right series se PAIR karna hoga. DEFAULT = ONE-TO-ONE: ek left series ek right series se match karती hai SIRF AGAR unke SAARE labels identical hain. ERROR RATIO ke liye KAAM karता hai kyunki dono sides same label set mein reduced hain. Jab label sets DIFFER karें: `on (job)` = SIRF `job` label par match. `ignoring (le)` = `le` ke ALAWA HAR label par match. `group_left(team)` = ek MANY-TO-ONE match: LEFT side ke ZYADA series; parens mein labels (`team`) (ek) right series se har matched left series par COPY. AAPKO group_left chahिए ek many-series metric ko ek single "info" metric se ENRICH karने ke liye. COMMON BUG: `_sum by (job,path)` aur `_count by (job)` ke beech ek plain `/` → SILENTLY kam result series. FIX: DONO `by` clauses mein `path` add karो.',
      },
      {
        task: 'In a comment, describe promtool test rules: the file structure, the input_series value syntax, and both assertion types (promql_expr_test, alert_rule_test).',
        taskHi: 'Ek comment mein, promtool test rules describe karo.',
        hint: '`promtool test rules <test.yml>` runs a YAML unit-test file COMPLETELY OFFLINE — no server, no scrape, in <1s. FILE STRUCTURE: `rule_files: [ rules.yml ]` (the recording/alerting rules under test), `evaluation_interval: 1m` (how often rules are evaluated in the test), `tests:` — a list, each with `interval: 1m` (the input-series sample spacing) + `input_series:` + assertions. INPUT_SERIES value syntax (compact): `values: "0+240x20"` = start at 0, ADD 240, TWENTY times (→ 0, 240, 480, … a counter); `values: "5-1x10"` = start at 5, SUBTRACT 1, ten times; `values: "1x20"` = the constant 1, twenty times (a gauge / an info metric); `values: "1 2 3 _ 5"` = literal values with `_` for a GAP (a missing/stale sample); `values: "0+100x5 0+50x5"` = two segments (rate changes). ASSERTION TYPE 1 — `promql_expr_test`: `- expr: <the PromQL>`, `eval_time: 10m`, `exp_samples:` — a list of `{ labels: <name>{k="v",…}, value: <exact float> }`. Asserts the expr at that eval_time produces EXACTLY those series with EXACTLY those values (float comparison is exact — `round(expr, 0.001)` in the rule if interpolation gives you `0.75000…17`). ASSERTION TYPE 2 — `alert_rule_test`: `- eval_time: 6m`, `alertname: HighP99Latency`, `exp_alerts:` — a list of `{ exp_labels: {…}, exp_annotations: {…} }` (or `[]` for "no alert firing"). Asserts that at that eval_time the named alert fires EXACTLY those alert instances with EXACTLY those labels + rendered annotations. This is how you verify a `for: 10m` works (assert `exp_alerts: []` at 6m = still PENDING, then the firing alert at 15m) AND that annotation templating (`{{ $value | humanizeDuration }}` → `750ms`) renders what you expect. RUN IT IN CI on every rule-file change → a broken expr / wrong threshold / a rule that doesn\'t fire when it should is caught BEFORE deploy, not during an incident when the page that should have fired didn\'t.',
        hintHi: '`promtool test rules <test.yml>` ek YAML unit-test file POORI TARAH OFFLINE chalाता hai — no server, <1s. FILE: `rule_files: [ rules.yml ]`, `evaluation_interval: 1m`, `tests:` — ek list, har ek `interval: 1m` + `input_series:` + assertions. INPUT_SERIES value syntax: `"0+240x20"` = 0 par shuru, 240 ADD, BEES baar (counter); `"1x20"` = constant 1 (gauge/info); `"1 2 3 _ 5"` = literal, `_` = GAP. ASSERTION 1 — `promql_expr_test`: `expr`, `eval_time`, `exp_samples` (`{ labels, value }` — exact float; rule mein `round(expr, 0.001)`). ASSERTION 2 — `alert_rule_test`: `eval_time`, `alertname`, `exp_alerts` (`{ exp_labels, exp_annotations }` ya `[]`). `for: 10m` verify karता hai (6m par `[]` = PENDING, 15m par firing) AUR annotation templating. CI mein CHALAO.',
      },
    ],

    keyTakeaways: [
      'An INSTANT VECTOR is a set of series with one value each; a RANGE VECTOR (`metric[5m]`) is raw samples over a duration and CANNOT be used directly — only as the argument to `rate`/`increase`/`*_over_time`, which consume a range and return an instant vector. Label matchers: `=` `!=` `=~` `!~`.',
      'READ A COUNTER VIA `rate(c[5m])` (per-second avg over the whole window, handles resets, smooth — for alerts + graphs; window ≥ 4× scrape_interval), NOT its raw value. `irate` (last 2 samples only) is for a live high-res graph, NEVER an alert (misses a burst that recovered; flaps). `increase(c[1h])` for "how many in the last hour". NEVER `rate()` a gauge.',
      'AGGREGATION (`sum`/`avg`/`count`/`topk`/…): `by (labels)` = group by these, drop the rest; `without (labels)` = drop these, keep the rest. Almost every useful query is `AGGREGATE(RATE(counter[window])) by (…)`.',
      'BINARY OPS between two instant vectors default to ONE-TO-ONE matching (all labels must be identical). Different label sets → you MUST use `on(l)` / `ignoring(l)` and, for a many-to-one join, `group_left(labels)` which copies labels from the single right series onto each matched left series (e.g. enriching a rate with a `team` label from an info metric). A plain `/` between mismatched label sets silently drops most series.',
      'VERIFY OFFLINE with `promtool test rules`: define `input_series` (`values: "0+240x20"` = start 0, +240 ×20; `_` = a gap), then `promql_expr_test` asserts an expr\'s exact `exp_samples` at an `eval_time`, and `alert_rule_test` asserts an alert\'s exact `exp_alerts` (labels + rendered annotations) — verifying the `for:` duration and annotation templating. Run it in CI.',
    ],
    keyTakeawaysHi: [
      'Ek INSTANT VECTOR series ka ek set hai har ek ek value ke saath; ek RANGE VECTOR (`metric[5m]`) ek duration ke over raw samples hai aur DIRECTLY use nahi ho sakta — sirf `rate`/`increase`/`*_over_time` ke argument ke roop mein, jo ek range consume karते hain aur ek instant vector return karते hain. Label matchers: `=` `!=` `=~` `!~`.',
      'EK COUNTER KO `rate(c[5m])` SE PADHO (poore window ke over per-second avg, resets handle, smooth — alerts + graphs ke liye; window ≥ 4× scrape_interval), iski raw value se nahi. `irate` (sirf last 2 samples) ek live high-res graph ke liye hai, KABHI ek alert nahi. `increase(c[1h])` "pichle ghante mein kitne" ke liye. KABHI ek gauge ko `rate()` mat karो.',
      'AGGREGATION (`sum`/`avg`/`count`/`topk`/…): `by (labels)` = in se group karो, baaki drop; `without (labels)` = in ko drop, baaki keep. Lagbhag har useful query `AGGREGATE(RATE(counter[window])) by (…)` hai.',
      'Do instant vectors ke beech BINARY OPS ONE-TO-ONE matching ko default karते hain (saare labels identical hone chahिए). Different label sets → aapko `on(l)` / `ignoring(l)` aur, ek many-to-one join ke liye, `group_left(labels)` use karना HOGA jo labels ko single right series se har matched left series par copy karता hai. Mismatched label sets ke beech ek plain `/` silently zyadaatar series drop karता hai.',
      '`promtool test rules` SE OFFLINE VERIFY karो: `input_series` define karो (`values: "0+240x20"` = 0 par shuru, +240 ×20; `_` = ek gap), phir `promql_expr_test` ek expr ke exact `exp_samples` ko ek `eval_time` par assert karता hai, aur `alert_rule_test` ek alert ke exact `exp_alerts` (labels + rendered annotations) ko assert karता hai — `for:` duration aur annotation templating verify karता hua. Ise CI mein chalाओ.',
    ],
  },

  {
    slug: 'ops-histograms-quantiles-recording-and-alerting-rules',
    title: 'Histograms, Quantiles, Recording & Alerting Rules',
    titleHi: 'Histograms, Quantiles, Recording Aur Alerting Rules',
    description:
      'Computing a percentile from a histogram with histogram_quantile and the le label; the naming convention for recording rules and why you pre-compute; the structure of an alerting rule — expr, for, labels, annotations — and the ALERTS series it produces; how the for duration turns an expression into pending then firing; and validating and unit-testing all of it offline with promtool.',
    descriptionHi:
      'histogram_quantile aur le label ke saath ek histogram se ek percentile compute karna; recording rules ke liye naming convention aur aap kyun pre-compute karते ho; ek alerting rule ki structure — expr, for, labels, annotations — aur ye jo ALERTS series produce karता hai; for duration ek expression ko pending phir firing mein kaise badalता hai; aur ye sab promtool ke saath offline validate aur unit-test karna.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A speed-camera survey that only records bands, not exact speeds.** Each car is tallied into a bucket — "under 30", "under 40", "under 50", cumulative — and to answer "what speed were the fastest 1% doing" you find the bucket where the 99th car falls and interpolate within it. That is `histogram_quantile`. A recording rule is the traffic authority pre-computing "average daily 95th-percentile speed per road" every night so the morning report is instant instead of re-scanning millions of tallies. An alerting rule is the rule that says "if the 99th-percentile speed on this road stays above the limit for ten minutes, raise a flag" — the ten-minute wait is the `for` clause, stopping a single fast car from triggering it.',
      hi: '**Ek speed-camera survey jo sirf bands record karता hai, exact speeds nahi.** Har car ek bucket mein tallied hai — "30 se kam", "40 se kam", "50 se kam", cumulative — aur "sabse fast 1% kis speed par the" answer karne ke liye aap wo bucket dhoondhते ho jahaan 99vaan car falls hota hai aur uske andar interpolate karते ho. Wo `histogram_quantile` hai. Ek recording rule traffic authority hai jo har raat "per road average daily 95th-percentile speed" pre-compute karता hai taaki morning report instant ho. Ek alerting rule wo rule hai jo kehता hai "agar is road par 99th-percentile speed dus minute limit ke upar rehती hai, ek flag raise karो" — dus-minute wait `for` clause hai.',
    },

    simple: `**HISTOGRAM -> QUANTILE:** a histogram metric exposes cumulative BUCKET counters,
one per \`le\` ("less than or equal") boundary, plus \`_sum\` and \`_count\`:
\`\`\`
http_request_duration_seconds_bucket{le="0.1"}   = 940     # <= 100ms
http_request_duration_seconds_bucket{le="0.25"}  = 980     # <= 250ms (cumulative!)
http_request_duration_seconds_bucket{le="0.5"}   = 995
http_request_duration_seconds_bucket{le="1"}     = 1000
http_request_duration_seconds_bucket{le="+Inf"}  = 1000
\`\`\`
compute a percentile:
\`\`\`
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`
- ALWAYS \`rate()\` the buckets first (they're counters), THEN \`sum by (le, ...)\`
  to aggregate across instances, THEN \`histogram_quantile\`. summing per-bucket
  BEFORE the quantile is the ONLY correct way to get a fleet quantile (Module 15 L4).
- the result is INTERPOLATED within the bucket -> accuracy depends on bucket
  boundaries. p99 of "everything is between 0.5 and 1" can only ever be ~0.75.
  pick buckets around your SLO threshold. NATIVE histograms (newer) remove this.

**RECORDING RULES** — pre-compute an expression on a schedule, store it as a new series:
\`\`\`
groups:
  - name: http
    interval: 30s                    # how often to evaluate (default = global)
    rules:
      - record: job:http_request_latency_seconds:p99_5m     # <- the NAMING CONVENTION
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`
NAMING: \`level:metric:operations\` — the aggregation level (\`job\`), the metric,
the operations applied (\`p99_5m\`). why: dashboards + alerts read the cheap
pre-aggregated series instead of re-running a heavy query on every refresh; and
one definition = one source of truth for "the p99".

**ALERTING RULES** — same file, an \`alert\` instead of a \`record\`:
\`\`\`
      - alert: HighP99Latency
        expr: job:http_request_latency_seconds:p99_5m > 0.3    # can use a recording rule!
        for: 10m               # expr must be true CONTINUOUSLY for 10m before FIRING
        labels:
          severity: page       # routed by Alertmanager on this (Lesson 4)
        annotations:
          summary: '{{ $labels.job }} p99 is {{ $value | humanizeDuration }}'
          runbook: 'https://runbooks/high-latency'
\`\`\`
LIFECYCLE:  expr false -> (nothing)  |  expr true, < 10m -> PENDING  |  true >= 10m -> FIRING
Prometheus emits  \`ALERTS{alertname, alertstate="pending|firing", ...}\` = 1  so you
can graph + alert on your own alerting.

**\`$value\`, \`$labels\`, templating:** \`{{ $value }}\` = the expr's value;
\`{{ $labels.x }}\` = a label; \`{{ $value | humanizePercentage }}\` /
\`humanizeDuration\` / \`humanize\` format it.

**VERIFY OFFLINE:**
\`\`\`
promtool check rules rules.yml           # syntax + naming
promtool test rules test.yml             # assert the quantile value AND that the
                                         # alert is PENDING at 6m, FIRING at 15m
\`\`\``,

    simpleHi: `**HISTOGRAM -> QUANTILE:** ek histogram metric cumulative BUCKET counters expose
karता hai, per \`le\` ("less than or equal") boundary ek, plus \`_sum\` aur \`_count\`:
\`\`\`
http_request_duration_seconds_bucket{le="0.1"}   = 940     # <= 100ms
http_request_duration_seconds_bucket{le="0.25"}  = 980     # <= 250ms (cumulative!)
http_request_duration_seconds_bucket{le="0.5"}   = 995
http_request_duration_seconds_bucket{le="1"}     = 1000
\`\`\`
ek percentile compute karो:
\`\`\`
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`
- HAMESHA buckets ko pehle \`rate()\` karो (wo counters hain), PHIR \`sum by (le, ...)\`
  instances ke across aggregate karने ke liye, PHIR \`histogram_quantile\`. quantile
  SE PEHLE per-bucket sum karna ek fleet quantile paane ka EKMATRA correct way hai (Module 15 L4).
- result bucket ke andar INTERPOLATED hai -> accuracy bucket boundaries par depend karती hai.
  apne SLO threshold ke around buckets pick karो. NATIVE histograms (newer) ise remove karते hain.

**RECORDING RULES** — ek expression ko ek schedule par pre-compute karो, ise ek naye series ke roop mein store karो:
\`\`\`
groups:
  - name: http
    interval: 30s                    # kitni baar evaluate karna
    rules:
      - record: job:http_request_latency_seconds:p99_5m     # <- NAMING CONVENTION
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`
NAMING: \`level:metric:operations\` — aggregation level (\`job\`), metric, applied
operations (\`p99_5m\`). kyun: dashboards + alerts cheap pre-aggregated series padhते
hain ek heavy query ko har refresh par re-run karने ke bajaay; aur ek definition = "p99" ke liye ek source of truth.

**ALERTING RULES** — same file, ek \`record\` ke bajaay ek \`alert\`:
\`\`\`
      - alert: HighP99Latency
        expr: job:http_request_latency_seconds:p99_5m > 0.3    # ek recording rule use kar sakта hai!
        for: 10m               # expr FIRING se pehle 10m CONTINUOUSLY true hona chahिए
        labels:
          severity: page       # Alertmanager is par route karता hai (Lesson 4)
        annotations:
          summary: '{{ $labels.job }} p99 is {{ $value | humanizeDuration }}'
\`\`\`
LIFECYCLE:  expr false -> (kuch nahi)  |  expr true, < 10m -> PENDING  |  true >= 10m -> FIRING
Prometheus  \`ALERTS{alertname, alertstate="pending|firing", ...}\` = 1  emit karता hai.

**VERIFY OFFLINE:**
\`\`\`
promtool check rules rules.yml
promtool test rules test.yml             # quantile value AUR ye ki alert 6m par
                                         # PENDING hai, 15m par FIRING hai assert karो
\`\`\``,

    content: `## From a histogram to a percentile

A Prometheus histogram is a family of series: for a metric \`m\`, there is \`m_bucket{le="X"}\` for each configured upper bound \`X\`, and each is a **cumulative counter** of observations less than or equal to \`X\`. There are also \`m_sum\` (the running total of all observed values) and \`m_count\` (the number of observations, equal to \`m_bucket{le="+Inf"}\`). Because each observation increments the counter for every bucket it falls under, the bucket counts are monotonically non-decreasing as \`le\` grows.

To get a percentile you use \`histogram_quantile(φ, buckets)\`, which finds the bucket in which the φ-th observation falls and linearly interpolates a value within that bucket\'s range. The correct expression aggregates across instances *before* computing the quantile:

\`\`\`
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`

The order matters: \`rate\` first because the buckets are counters, then \`sum by (le, job)\` to combine the per-instance bucket counts into fleet-wide bucket counts (keeping \`le\` so each bucket stays distinct), then \`histogram_quantile\` on the combined distribution. Summing the buckets before the quantile is the only correct way to compute a fleet percentile; averaging per-instance percentiles does not work (Module 15).

The result is only as accurate as the bucket boundaries allow. If every observation is between 0.5 and 1 second, the histogram cannot report a p99 more precise than "somewhere in that bucket", and interpolation will return roughly 0.75 regardless of the true distribution. So the buckets must be chosen with boundaries clustered around the latency values you care about, especially your SLO threshold. **Native histograms**, a newer Prometheus feature, use exponentially-spaced buckets generated automatically and remove most of this concern.

## Recording rules

A **recording rule** evaluates an expression on a schedule and stores the result as a new time series. Its purpose is twofold: dashboards and alerts that would otherwise re-run a heavy query — a \`histogram_quantile\` over many instances, a ratio of two aggregations — on every refresh instead read a cheap, already-computed series; and a single rule definition becomes the one source of truth for a derived value like "the p99 latency", so every dashboard and alert that uses it agrees.

The naming convention is \`level:metric:operations\`: the aggregation level the series is at (\`job\`, \`namespace\`, \`instance\`), the underlying metric name, and the operations applied to produce it. \`job:http_request_latency_seconds:p99_5m\` reads as "the 99th-percentile of http request latency, over a five-minute window, aggregated to the job level". This makes a recording rule\'s meaning legible from its name alone.

## Alerting rules

An **alerting rule** lives in the same rule files and has an \`alert\` name instead of a \`record\` name. Its fields:

- **expr**: a PromQL expression. When it returns a non-empty result, each series in the result is a candidate alert. The expression can and often should reference a recording rule.
- **for**: the expression must evaluate to a non-empty result **continuously** for this duration before the alert transitions from pending to firing. It filters out brief spikes — a threshold crossed for one evaluation and then not is never a firing alert.
- **labels**: added to the alert. \`severity\` is the conventional one, and Alertmanager routes on it (Lesson 4).
- **annotations**: human-readable text, templated. \`{{ $value }}\` is the numeric value of the expression for this alert instance, \`{{ $labels.x }}\` is a label from the result series, and template functions like \`humanizePercentage\`, \`humanizeDuration\`, and \`humanize\` format the value.

The alert lifecycle: while \`expr\` is empty there is no alert; when \`expr\` becomes non-empty the alert is **pending** and starts its \`for\` timer; if \`expr\` stays non-empty for the full \`for\` duration the alert becomes **firing** and is sent to Alertmanager; if \`expr\` goes empty at any point the timer resets. Prometheus exposes the state as a metric, \`ALERTS{alertname, alertstate="pending"|"firing", ...} = 1\`, so you can graph your own alerting activity and even alert on it (an alert that has been pending for hours without firing, for instance).

## Validating and testing offline

\`promtool check rules rules.yml\` validates syntax, the recording-rule naming convention, and every expression. \`promtool test rules test.yml\` runs a unit test: you supply \`input_series\` for the histogram buckets, then \`promql_expr_test\` asserts the computed p99 value at an \`eval_time\`, and \`alert_rule_test\` asserts the alert\'s state — \`exp_alerts: []\` at a time before the \`for\` duration has elapsed (confirming it is still pending), and the firing alert with its exact labels and rendered annotations at a later time. Because \`histogram_quantile\` interpolation produces values like \`0.7500000000000017\`, wrap the recording rule in \`round(expr, 0.001)\` so the stored series has a clean, assertable value.`,

    contentHi: `## Ek histogram se ek percentile

Ek Prometheus histogram series ka ek family hai: ek metric \`m\` ke liye, har configured upper bound \`X\` ke liye \`m_bucket{le="X"}\` hai, aur har ek \`X\` se less than or equal observations ka ek **cumulative counter** hai. \`m_sum\` (saari observed values ka running total) aur \`m_count\` bhi hain.

Ek percentile paane ke liye aap \`histogram_quantile(φ, buckets)\` use karते ho, jo wo bucket dhoondhता hai jismें φ-vaan observation falls hota hai aur us bucket ke range ke andar ek value linearly interpolate karता hai. Correct expression quantile compute karने se *pehle* instances ke across aggregate karता hai:
\`\`\`
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
\`\`\`
Order matter karता hai: \`rate\` pehle kyunki buckets counters hain, phir \`sum by (le, job)\` per-instance bucket counts ko fleet-wide bucket counts mein combine karने ke liye, phir combined distribution par \`histogram_quantile\`. Quantile se pehle buckets sum karna ek fleet percentile compute karने ka ekmatra correct way hai.

Result sirf utna accurate hai jitna bucket boundaries allow karते hain. **Native histograms**, ek newer Prometheus feature, is concern ka zyadaatar remove karते hain.

## Recording rules

Ek **recording rule** ek expression ko ek schedule par evaluate karता hai aur result ko ek naye time series ke roop mein store karता hai. Iska purpose twofold hai: dashboards aur alerts jo otherwise ek heavy query re-run karते cheap, already-computed series padhते hain; aur ek single rule definition ek derived value ke liye ek source of truth ban jaता hai.

Naming convention \`level:metric:operations\` hai: aggregation level, underlying metric name, aur produce karने ke liye applied operations. \`job:http_request_latency_seconds:p99_5m\` "http request latency ka 99th-percentile, ek five-minute window ke over, job level par aggregated" ke roop mein padhता hai.

## Alerting rules

Ek **alerting rule** same rule files mein rehता hai aur ek \`record\` name ke bajaay ek \`alert\` name rakhता hai. Iske fields:
- **expr**: ek PromQL expression. Jab ye ek non-empty result return karता hai, result mein har series ek candidate alert hai.
- **for**: expression ko is duration ke liye **continuously** ek non-empty result evaluate karना chahिए alert ke pending se firing transition hone se pehle.
- **labels**: alert par added. \`severity\` conventional hai, aur Alertmanager is par route karता hai (Lesson 4).
- **annotations**: human-readable text, templated. \`{{ $value }}\` numeric value hai, \`{{ $labels.x }}\` ek label hai.

Alert lifecycle: jab \`expr\` empty hai koi alert nahi; jab \`expr\` non-empty ban jaता hai alert **pending** hai; agar \`expr\` poore \`for\` duration ke liye non-empty rehता hai alert **firing** ban jaता hai; agar \`expr\` kisi point par empty jaता hai timer reset hota hai. Prometheus state ko ek metric ke roop mein expose karता hai, \`ALERTS{alertname, alertstate="pending"|"firing", ...} = 1\`.

## Offline validate aur test karna

\`promtool check rules rules.yml\` syntax, recording-rule naming convention, aur har expression validate karता hai. \`promtool test rules test.yml\` ek unit test chalाता hai: aap histogram buckets ke liye \`input_series\` supply karते ho, phir \`promql_expr_test\` computed p99 value ko ek \`eval_time\` par assert karता hai, aur \`alert_rule_test\` alert ki state assert karता hai. Kyunki \`histogram_quantile\` interpolation \`0.7500000000000017\` jaise values produce karता hai, recording rule ko \`round(expr, 0.001)\` mein wrap karो.`,

    examples: [
      {
        title: 'A histogram p99 recording rule + a for:10m alert, unit-tested with promtool',
        titleHi: 'Ek histogram p99 recording rule + ek for:10m alert, promtool ke saath unit-tested',
        code: `# VERIFY
export PATH="$HOME/bin:$PATH"

cat > rules.yml <<'YML'
groups:
  - name: http-latency
    rules:
      # recording rule: level:metric:operations , rounded for a stable series
      - record: job:http_request_latency_seconds:p99_5m
        expr: |
          round(
            histogram_quantile(0.99,
              sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job)),
            0.001)
      - alert: HighP99Latency
        expr: job:http_request_latency_seconds:p99_5m > 0.3
        for: 10m
        labels: { severity: page }
        annotations:
          summary: '{{ $labels.job }} p99 latency is {{ $value | humanizeDuration }}'
YML

cat > test.yml <<'YML'
rule_files: [ rules.yml ]
evaluation_interval: 1m
tests:
  - interval: 1m
    input_series:
      # cumulative buckets: 80 <=0.1, 90 <=0.25, 98 <=0.5, 100 <=1  (per interval)
      - series: 'http_request_duration_seconds_bucket{job="api", le="0.1"}'
        values: "0+80x30"
      - series: 'http_request_duration_seconds_bucket{job="api", le="0.25"}'
        values: "0+90x30"
      - series: 'http_request_duration_seconds_bucket{job="api", le="0.5"}'
        values: "0+98x30"
      - series: 'http_request_duration_seconds_bucket{job="api", le="1"}'
        values: "0+100x30"
      - series: 'http_request_duration_seconds_bucket{job="api", le="+Inf"}'
        values: "0+100x30"
    promql_expr_test:
      - expr: job:http_request_latency_seconds:p99_5m
        eval_time: 15m
        exp_samples:
          - labels: 'job:http_request_latency_seconds:p99_5m{job="api"}'
            value: 0.75              # 99th obs is in the (0.5, 1] bucket -> ~0.75
    alert_rule_test:
      # at 6m: expr has been true only ~4m ( < for:10m ) -> PENDING, no firing alert
      - eval_time: 6m
        alertname: HighP99Latency
        exp_alerts: []
      # at 15m: expr true for > 10m -> FIRING, with the rendered annotation
      - eval_time: 15m
        alertname: HighP99Latency
        exp_alerts:
          - exp_labels: { severity: page, job: api }
            exp_annotations: { summary: 'api p99 latency is 750ms' }
YML

promtool check rules rules.yml
promtool test rules test.yml`,
        output: `Checking rules.yml
  SUCCESS: 2 rules found

  SUCCESS`,
        explain: 'A complete latency-alerting setup and the unit test that proves it works. The recording rule computes the fleet p99 the correct way — rate the buckets, sum them by \`le\` and \`job\`, then \`histogram_quantile\` on the combined distribution — and wraps the whole thing in \`round(..., 0.001)\` so the stored series is a clean number rather than a floating-point artefact like \`0.7500000000000017\`. The alerting rule fires when that recording rule exceeds 0.3 seconds, but only after the condition has held continuously for ten minutes, and its annotation renders the value as a duration. The test file supplies a synthetic histogram: cumulative bucket counts of 80, 90, 98, and 100 per interval, meaning ninety-eight percent of requests finish within half a second and the last two percent spill into the one-second bucket. The ninety-ninth percentile therefore falls in the half-to-one-second bucket and interpolates to 0.75, which the first assertion checks exactly at the fifteen-minute mark. The alert assertions check the \`for\` behaviour: at six minutes the p99 has been over the threshold for only about four minutes, so \`exp_alerts: []\` confirms the alert is still pending and has not fired; at fifteen minutes it has been over for more than ten, so the assertion confirms it is firing with the exact \`severity\` and \`job\` labels and the annotation text "api p99 latency is 750ms". All of this runs through \`promtool\` with no Prometheus server.',
        explainHi: 'Ek complete latency-alerting setup aur unit test jo prove karता hai ye kaam karता hai. Recording rule fleet p99 ko correct way se compute karता hai — buckets ko rate karो, unhe \`le\` aur \`job\` se sum karो, phir combined distribution par \`histogram_quantile\` — aur poori cheez ko \`round(..., 0.001)\` mein wrap karता hai. Alerting rule tab fire karता hai jab wo recording rule 0.3 seconds exceed karता hai, par sirf condition ke continuously dus minute hold karने ke baad. Test file ek synthetic histogram supply karता hai: per interval cumulative bucket counts of 80, 90, 98, aur 100, matlab navve aath percent requests aadhे second ke andar finish hoती hain. 99vaan percentile isliए aadhे-se-ek-second bucket mein falls hota hai aur 0.75 par interpolate hota hai. Alert assertions \`for\` behaviour check karते hain: chhah minute par p99 threshold ke upar sirf lagbhag chaar minute raha hai, to \`exp_alerts: []\` confirm karता hai alert abhi bhi pending hai; pandrah minute par ye dus se zyada ke liye upar raha hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# computing histogram_quantile WITHOUT summing the buckets across instances first
  histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  # -> this gives you a SEPARATE p99 PER INSTANCE (per {instance, le} series pair).
  #    to see "the p99" you then have to avg() or max() those - and averaging
  #    per-instance quantiles is meaningless (Module 15 L4). max() hides which
  #    instance. you never see the TRUE fleet p99.
  # also common: forgetting  by (le)  ->
  histogram_quantile(0.99, sum(rate(..._bucket[5m])) by (job))
  # -> "le" was summed away. histogram_quantile has no buckets to work with.
  #    returns NaN or nonsense.`,
        right: `# rate -> sum by (le, <your grouping labels>) -> histogram_quantile:
  histogram_quantile(0.99,
    sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job, route))
  # - rate() first: the buckets are counters
  # - sum by (le, job, route): combine instances into fleet buckets, but KEEP le
  #   (it's what makes each bucket distinct) and keep any dimension you want to
  #   break the quantile out by
  # - histogram_quantile last: on the combined distribution
  # result: ONE true p99 per (job, route), computed from all instances' data.`,
        why: 'A histogram percentile is only meaningful when computed from the full combined distribution of all the instances you care about, and that requires summing the per-bucket counts across instances before applying \`histogram_quantile\`. Calling \`histogram_quantile\` directly on the per-instance bucket rates produces one percentile per instance, and there is then no valid way to combine those — averaging per-instance quantiles gives a number that describes no real distribution, and taking the maximum tells you the worst instance but not the fleet. The other frequent error is aggregating away the \`le\` label. \`histogram_quantile\` needs the set of \`le\`-tagged bucket series to reconstruct the distribution; if you \`sum by (job)\` without including \`le\`, all the buckets for a job collapse into one number and the function has nothing to interpolate over, returning NaN or garbage. The correct pipeline is always the same three steps in order: \`rate\` the bucket counters, \`sum by (le, ...)\` keeping \`le\` plus whichever dimensions you want to slice the quantile by, then \`histogram_quantile\` on that combined, still-bucketed vector.',
        whyHi: 'Ek histogram percentile sirf tab meaningful hai jab saare instances ki full combined distribution se computed ho, aur ye \`histogram_quantile\` apply karने se pehle per-bucket counts ko instances ke across sum karने ki require karता hai. \`histogram_quantile\` ko directly per-instance bucket rates par call karna per instance ek percentile produce karता hai, aur phir unhe combine karने ka koi valid way nahi hai. Doosra frequent error \`le\` label ko aggregate away karna hai. \`histogram_quantile\` ko \`le\`-tagged bucket series ka set chahिए distribution reconstruct karने ke liye; agar aap \`le\` include kiye bina \`sum by (job)\` karते ho, saare buckets ek number mein collapse ho jaते hain. Correct pipeline hamesha order mein wahi teen steps hain.',
      },
      {
        wrong: `# an alert with no  for:  (or  for: 0s )
  - alert: HighErrorRatio
    expr: error_ratio > 0.02
    # no  for:
  # -> the alert FIRES the instant a single evaluation crosses 0.02 and RESOLVES
  #    the instant it drops back. a 15-second blip during a deploy = a page and an
  #    immediate resolve. on-call gets woken for nothing, twice (fire + resolve).
  # ALSO the opposite:  for: 1h  on a page-severity alert ->
  #    a real outage burns for an hour before anyone is told.`,
        right: `# match  for:  to how long the condition must persist to be a real problem:
  - alert: HighErrorRatioFastBurn
    expr: <burn rate > 14.4 over 1h and 5m>   # Module 15 L6
    for: 2m          # a couple of evaluations, to filter a single-scrape spike,
                     # but not so long that a real fast burn is delayed
  - alert: HighErrorRatioSlowBurn
    expr: <burn rate > 3 over 24h and 2h>
    for: 15m         # a slower-burn ticket can tolerate a longer confirmation
  # rule of thumb: for a PAGE, for: is 2-5 min (filter noise, don't delay response).
  # for a TICKET, 15-60 min is fine. never 0s on anything that pages a human.`,
        why: 'The \`for\` clause is what separates a threshold being briefly crossed from a sustained condition that warrants action. With no \`for\`, or \`for: 0s\`, an alert fires the moment a single evaluation crosses the threshold and resolves the moment the next one does not, so a fifteen-second blip during a deployment — a burst of errors as instances cycle, a latency spike as a cache warms — produces a page immediately followed by a resolve, waking the on-call for a non-event and doing it twice. The opposite error is setting \`for\` too long on a page-severity alert: a \`for: 1h\` means a genuine outage runs for an hour, undetected by the alerting, before anyone is notified. The right value depends on the alert\'s urgency. For an alert that pages a human, \`for\` should be a few minutes — long enough to filter a single-scrape spike, short enough not to delay the response to a real problem. For a lower-severity ticket, a longer confirmation window of fifteen minutes to an hour is fine because nobody is being woken. The multi-window burn-rate alerts from Module 15 use short \`for\` values because the long evaluation window inside the expression already provides the "is this sustained" filter.',
        whyHi: '\`for\` clause wo hai jo ek threshold ke briefly cross hone ko ek sustained condition se separate karता hai jo action warrant karता hai. Bina \`for\` ke, ek alert us pal fire karता hai jab ek single evaluation threshold cross karता hai aur us pal resolve hota hai jab agla nahi karता, to ek pandrah-second blip ek deployment ke dauraan ek page produce karता hai turant ek resolve ke baad. Opposite error ek page-severity alert par \`for\` bahut lamba set karna hai: ek \`for: 1h\` ka matlab ek genuine outage ek ghante chalता hai, alerting dwara undetected, iske pehle koi notified hai. Right value alert ki urgency par depend karता hai. Ek alert ke liye jo ek human ko page karता hai, \`for\` kuch minute hona chahिए.',
      },
      {
        wrong: `# histogram buckets that don't bracket the SLO threshold
  # your SLO: 99% of requests under 300ms. your histogram buckets:
  #   le: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]   # the OLD default
  # there is NO bucket boundary between 0.1 and 0.5. every request that takes
  # 110ms..490ms lands in the SAME bucket. histogram_quantile can only ever place
  # your p99 at ~0.3 (the interpolated midpoint) - you CANNOT measure whether p99
  # is 200ms or 400ms, which is exactly the question your SLO asks.`,
        right: `# choose buckets clustered around the values you actually care about:
  # SLO is 300ms -> put boundaries at 0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.75, 1
  # (dense around 0.3, sparse in the tail you don't SLO on).
  # in the client (Go example):
  #   prometheus.HistogramOpts{ Buckets: []float64{
  #     0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1, 2, 5 } }
  # OR use NATIVE HISTOGRAMS: enable them and the buckets are exponential,
  #   auto-generated, high-resolution everywhere - no manual bucket planning,
  #   and far fewer series. (Prometheus 2.40+, opt-in; the modern default.)`,
        why: 'The accuracy of a percentile from a classic Prometheus histogram is bounded by the spacing of the bucket boundaries, because \`histogram_quantile\` can only interpolate linearly within whichever bucket the target observation falls into. The old default bucket set jumps from 0.1 to 0.5 seconds with nothing in between, so every request between 110 and 490 milliseconds is counted in the same bucket and the function cannot distinguish a p99 of 200 milliseconds from one of 400. If the service has an SLO of "99 percent of requests under 300 milliseconds", the histogram literally cannot answer whether the SLO is being met, because 300 milliseconds is inside that undifferentiated bucket. The fix for a classic histogram is to define buckets with boundaries clustered densely around the latency values that matter — the SLO threshold and a range on either side of it — and sparse in the tail where precision is not needed. Better still is to switch to native histograms, a newer Prometheus feature where the buckets are exponentially spaced, generated automatically, high-resolution across the whole range, and use far fewer series than a fine-grained classic histogram would; they remove bucket planning entirely.',
        whyHi: 'Ek classic Prometheus histogram se ek percentile ki accuracy bucket boundaries ke spacing se bounded hai, kyunki \`histogram_quantile\` sirf whichever bucket ke andar linearly interpolate kar sakता hai jismें target observation falls hota hai. Old default bucket set 0.1 se 0.5 seconds mein jump karता hai beech mein kuch nahi ke saath, to har request 110 aur 490 millisecond ke beech same bucket mein counted hai aur function ek 200 millisecond ke p99 ko ek 400 se distinguish nahi kar sakता. Agar service ke paas "99 percent requests under 300 millisecond" ka ek SLO hai, histogram literally answer nahi kar sakता ki SLO met ho raha hai ya nahi. Classic histogram ke liye fix boundaries ke saath buckets define karna hai jo matter karने wali latency values ke around densely clustered hain. Better native histograms par switch karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**Per-instance p99, averaged, hid the bad node** — a dashboard used `histogram_quantile(0.99, rate(...bucket[5m]))` then `avg()` across instances. It read ~0.3s while one node served 8s p99. Rewriting to `histogram_quantile(0.99, sum(rate(...)) by (le))` surfaced the real 1.9s fleet p99.',
        hi: '**Per-instance p99, averaged, ne bad node chupaya** — ek dashboard ne `histogram_quantile(0.99, rate(...bucket[5m]))` phir instances ke across `avg()` use kiya. Ye ~0.3s read hua jabki ek node 8s p99 serve kar raha tha. `histogram_quantile(0.99, sum(rate(...)) by (le))` par rewrite karna real 1.9s fleet p99 surface kiya.',
      },
      {
        en: '**`for: 0s` woke on-call twice per deploy** — an error-ratio alert with no `for` fired-and-resolved on every rolling-deploy blip. On-call got a page + a resolve within 30s, several times a week. `for: 3m` on a burn-rate expr ended it.',
        hi: '**`for: 0s` ne per deploy on-call ko do baar wakeup kiya** — ek error-ratio alert bina `for` ke har rolling-deploy blip par fired-and-resolved. `for: 3m` ne ise khatam kiya.',
      },
      {
        en: '**SLO at 300ms, buckets [0.1, 0.5]** — a team had a 300ms latency SLO but the default histogram buckets had nothing between 100ms and 500ms, so `histogram_quantile` always returned ~0.3 and the SLO dashboard was flat regardless of reality. Re-bucketing around 0.3 (then moving to native histograms) made it measurable.',
        hi: '**300ms par SLO, buckets [0.1, 0.5]** — ek team ke paas ek 300ms latency SLO tha par default histogram buckets mein 100ms aur 500ms ke beech kuch nahi tha, to `histogram_quantile` hamesha ~0.3 return karta tha. 0.3 ke around re-bucketing (phir native histograms par move) ise measurable banaya.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you compute a p99 latency from a Prometheus histogram, and what is the correct order of operations?',
        qHi: 'Aap ek Prometheus histogram se ek p99 latency kaise compute karते ho, aur operations ka correct order kya hai?',
        a: 'A Prometheus histogram exposes a cumulative bucket counter per le boundary, plus a sum and a count. To get a percentile you use histogram_quantile(0.99, buckets), which locates the bucket containing the 99th-percentile observation and linearly interpolates a value within it. The order of operations is: rate the bucket counters first, because they are counters and their raw values are meaningless; then sum by (le, job) — or by le plus whatever dimensions you want to break the quantile out by, such as route — which combines the per-instance bucket counts into fleet-wide bucket counts, and it is essential to keep the le label because that is what makes each bucket distinct and gives histogram_quantile a distribution to work with; then histogram_quantile last, on that combined, still-bucketed vector. Two mistakes are common. Calling histogram_quantile directly on the per-instance rates gives a separate percentile per instance, which cannot be validly combined — averaging per-instance quantiles is meaningless and taking the max hides the fleet picture. And summing without keeping le collapses all the buckets into one number so the function has nothing to interpolate over and returns NaN. The accuracy is also bounded by the bucket boundaries: if the buckets do not bracket the value you care about, especially your SLO threshold, the quantile cannot be more precise than the width of the containing bucket, which is why native histograms with automatic exponential buckets are preferable.',
        aHi: 'Ek Prometheus histogram per le boundary ek cumulative bucket counter expose karता hai, plus ek sum aur ek count. Ek percentile paane ke liye aap histogram_quantile(0.99, buckets) use karते ho. Operations ka order hai: bucket counters ko pehle rate karो, kyunki wo counters hain; phir sum by (le, job) — jo per-instance bucket counts ko fleet-wide bucket counts mein combine karता hai, aur le label rakhна essential hai; phir histogram_quantile last, us combined vector par. Do mistakes common hain. histogram_quantile ko directly per-instance rates par call karna per instance ek separate percentile deता hai, jise validly combine nahi kiya ja sakта. Aur le rakhे bina sum karna saare buckets ko ek number mein collapse karता hai. Accuracy bucket boundaries se bounded hai.',
      },
      {
        q: 'What is a recording rule, what is the naming convention, and why pre-compute?',
        qHi: 'Ek recording rule kya hai, naming convention kya hai, aur pre-compute kyun?',
        a: 'A recording rule evaluates a PromQL expression on a schedule and stores the result as a new time series. You pre-compute for two reasons. First, performance: an expression like a histogram_quantile over many instances or a ratio of two aggregations is expensive, and if a dashboard panel and several alerts all use it, each of them re-runs that heavy query on every refresh or evaluation. A recording rule computes it once per interval and everything else reads the cheap, already-aggregated series. Second, consistency: the recording rule becomes the single definition of a derived value like "the p99 latency", so every dashboard and alert that references it agrees on exactly how it is computed, rather than each copy-pasting a slightly different expression. The naming convention is level:metric:operations — the aggregation level the resulting series is at, such as job or namespace or instance; the underlying metric name; and the operations applied to produce it. job:http_request_latency_seconds:p99_5m reads as the 99th percentile of http request latency over a five-minute window aggregated to the job level, so the meaning of the recording rule is legible from its name alone. Alerting rules can and often should reference recording rules in their expr, which keeps the alert expression short and ties it to the same canonical definition the dashboards use.',
        aHi: 'Ek recording rule ek PromQL expression ko ek schedule par evaluate karता hai aur result ko ek naye time series ke roop mein store karता hai. Aap do reasons ke liye pre-compute karते ho. Pehle, performance: kई instances ke over ek histogram_quantile jaisा ek expression expensive hai, aur agar ek dashboard panel aur kई alerts sab ise use karते hain, unme se har ek us heavy query ko har refresh par re-run karता hai. Ek recording rule ise per interval ek baar compute karता hai. Doosre, consistency: recording rule "p99 latency" jaise ek derived value ki single definition ban jaता hai. Naming convention level:metric:operations hai. Alerting rules apne expr mein recording rules reference kar sakते hain.',
      },
      {
        q: 'Walk through the alerting rule fields and the pending-to-firing lifecycle. What does the ALERTS metric give you?',
        qHi: 'Alerting rule fields aur pending-to-firing lifecycle walk karो. ALERTS metric aapko kya deता hai?',
        a: 'An alerting rule has an alert name and four fields. expr is a PromQL expression, and every series in its non-empty result is a candidate alert; it can and often should reference a recording rule. for is the duration the expression must evaluate to a non-empty result continuously before the alert transitions from pending to firing — it filters out brief spikes. labels are added to the alert, with severity being the conventional one that Alertmanager routes on. annotations are templated human-readable text, where {{ $value }} is the numeric value of the expression for that alert instance, {{ $labels.x }} is a label from the result series, and functions like humanizeDuration and humanizePercentage format the value. The lifecycle: while expr returns nothing there is no alert; when expr becomes non-empty the alert is pending and starts its for timer; if expr stays non-empty for the full for duration it becomes firing and is sent to Alertmanager; if expr goes empty at any point the timer resets and the alert is inactive again. Prometheus exposes the state as a metric, ALERTS with labels alertname and alertstate set to pending or firing, equal to 1 while in that state. This lets you graph your own alerting activity, see how often an alert flaps, and even write meta-alerts — for example an alert that fires when another alert has been stuck pending for hours without either firing or clearing, which usually means the for is mistuned or the condition is oscillating right at the threshold.',
        aHi: 'Ek alerting rule ke paas ek alert name aur chaar fields hain. expr ek PromQL expression hai, aur iske non-empty result mein har series ek candidate alert hai. for wo duration hai jiske liye expression ko continuously ek non-empty result evaluate karना chahिए alert ke pending se firing transition hone se pehle. labels alert par added hain, severity conventional hone ke saath. annotations templated human-readable text hain. Lifecycle: jab expr kuch return nahi karता koi alert nahi; jab expr non-empty ban jaता hai alert pending hai; agar expr poore for duration ke liye non-empty rehता hai ye firing ban jaता hai; agar expr kisi point par empty jaता hai timer reset hota hai. Prometheus state ko ALERTS metric ke roop mein expose karता hai alertname aur alertstate labels ke saath.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain how a histogram works and the correct histogram_quantile pipeline, and why bucket boundaries around the SLO threshold matter (+ native histograms).',
        taskHi: 'Ek comment mein, ek histogram kaise kaam karता hai samjhao.',
        hint: 'A PROMETHEUS HISTOGRAM = a family of series for a metric `m`: `m_bucket{le="X"}` for each configured upper bound X, each a CUMULATIVE COUNTER of observations ≤ X (so counts are non-decreasing as `le` grows); plus `m_sum` (running total of all values) and `m_count` (= `m_bucket{le="+Inf"}`). THE CORRECT `histogram_quantile` PIPELINE — THREE steps IN ORDER: (1) `rate(m_bucket[5m])` FIRST — the buckets are counters, raw values are meaningless; (2) `sum(...) by (le, job, route)` — combine per-instance bucket counts into FLEET-WIDE bucket counts; KEEP `le` (it\'s what makes each bucket distinct + gives the function a distribution) + keep whatever dimensions you want to break the quantile out by; (3) `histogram_quantile(0.99, ...)` LAST — on the combined, still-bucketed vector; it locates the bucket containing the 99th-percentile observation and LINEARLY INTERPOLATES within it. TWO COMMON BUGS: (a) `histogram_quantile(0.99, rate(...bucket[5m]))` with NO `sum by (le)` → a SEPARATE p99 PER INSTANCE → you then `avg()` (meaningless — Module 15 L4) or `max()` (hides which instance) → never the true fleet p99. (b) `sum(...) by (job)` WITHOUT `le` → all buckets collapse to one number → `histogram_quantile` has nothing to interpolate → NaN / garbage. WHY BUCKETS AROUND THE SLO THRESHOLD MATTER: accuracy is BOUNDED by bucket spacing — the function can only interpolate within the CONTAINING bucket. SLO = "99% < 300ms" but the old default buckets jump 0.1 → 0.5 with nothing between → every 110-490ms request is in the SAME bucket → `histogram_quantile` can only ever say ~0.3 → you CANNOT tell if p99 is 200ms or 400ms — exactly the question the SLO asks. FIX: cluster boundaries DENSELY around the SLO value (0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.75, 1), SPARSE in the tail. BETTER: NATIVE HISTOGRAMS (Prometheus 2.40+, opt-in) — exponentially-spaced buckets, auto-generated, high-resolution EVERYWHERE, FAR fewer series → no manual bucket planning.',
        hintHi: 'EK PROMETHEUS HISTOGRAM = ek metric `m` ke liye series ka ek family: har configured upper bound X ke liye `m_bucket{le="X"}`, har ek X se ≤ observations ka ek CUMULATIVE COUNTER; plus `m_sum` aur `m_count`. CORRECT `histogram_quantile` PIPELINE — TEEN steps ORDER MEIN: (1) `rate(m_bucket[5m])` PEHLE — buckets counters hain; (2) `sum(...) by (le, job, route)` — per-instance bucket counts ko FLEET-WIDE mein combine; `le` KEEP karो; (3) `histogram_quantile(0.99, ...)` LAST — combined vector par, bucket ke andar LINEARLY INTERPOLATE karता hai. DO COMMON BUGS: (a) `sum by (le)` NAHI → per instance ek SEPARATE p99 → `avg()` meaningless; (b) `le` ke BINA `sum by (job)` → saare buckets ek number mein → NaN. BUCKETS SLO THRESHOLD KE AROUND KYUN: accuracy bucket spacing se BOUNDED. SLO = "99% < 300ms" par default buckets 0.1 → 0.5 jump → har 110-490ms request SAME bucket mein → hamesha ~0.3. FIX: SLO value ke around DENSELY cluster karो. BETTER: NATIVE HISTOGRAMS.',
      },
      {
        task: 'In a comment, explain recording rules (purpose + the level:metric:operations naming) and alerting rules (the fields, the pending→firing lifecycle, the for: tuning, and the ALERTS metric).',
        taskHi: 'Ek comment mein, recording rules aur alerting rules samjhao.',
        hint: 'RECORDING RULE = evaluates a PromQL `expr` on a `interval` schedule and STORES the result as a NEW time series (`record: <name>`). PURPOSE: (1) PERFORMANCE — a `histogram_quantile` over many instances / a ratio of two aggregations is EXPENSIVE; if a dashboard panel + several alerts all use it, each RE-RUNS the heavy query on every refresh/evaluation. A recording rule computes it ONCE per interval → everything else reads the cheap pre-aggregated series. (2) CONSISTENCY — the rule becomes the SINGLE definition of a derived value ("the p99 latency") → every dashboard + alert that references it agrees on exactly how it\'s computed (vs each copy-pasting a slightly different expr). NAMING: `level:metric:operations` — the aggregation LEVEL the series is at (`job` / `namespace` / `instance`), the underlying METRIC name, the OPERATIONS applied (`p99_5m`). `job:http_request_latency_seconds:p99_5m` = "the p99 of http request latency over a 5m window, aggregated to job level" — legible from the name alone. ALERTING RULE (same files, `alert: <name>` not `record:`): `expr` (PromQL — every series in its NON-EMPTY result is a candidate alert; CAN + often SHOULD reference a recording rule); `for` (the expr must be non-empty CONTINUOUSLY for this long before PENDING → FIRING — filters brief spikes); `labels` (added to the alert; `severity` is conventional, Alertmanager routes on it — L4); `annotations` (templated: `{{ $value }}` = the expr\'s value, `{{ $labels.x }}` = a label, `| humanizeDuration` / `| humanizePercentage` format it). LIFECYCLE: `expr` empty → nothing; `expr` non-empty, `for` not yet elapsed → PENDING (timer running); non-empty for the FULL `for` → FIRING (sent to Alertmanager); `expr` goes empty at ANY point → timer RESETS. `for:` TUNING: for a PAGE, `for: 2-5m` (filter a single-scrape spike, don\'t delay response). For a TICKET, 15-60m is fine. NEVER `for: 0s` on anything that pages (fires-and-resolves on a 15s deploy blip → wakes on-call twice). NEVER `for: 1h` on a page (a real outage burns an hour undetected). The ALERTS METRIC: Prometheus emits `ALERTS{alertname, alertstate="pending"|"firing", …} = 1` while in that state → graph your own alerting, measure flapping, write META-ALERTS (an alert stuck pending for hours = a mistuned `for` or a condition oscillating at the threshold).',
        hintHi: 'RECORDING RULE = ek PromQL `expr` ko ek `interval` schedule par evaluate karता hai aur result ko ek NAYE time series ke roop mein STORE karता hai. PURPOSE: (1) PERFORMANCE — ek `histogram_quantile` EXPENSIVE hai; recording rule ise per interval EK BAAR compute karता hai. (2) CONSISTENCY — rule ek derived value ki SINGLE definition ban jaता hai. NAMING: `level:metric:operations`. ALERTING RULE: `expr` (non-empty result mein har series ek candidate alert; recording rule reference kar sakта hai); `for` (expr CONTINUOUSLY itni der non-empty hona chahिए PENDING → FIRING se pehle); `labels` (`severity`); `annotations` (`{{ $value }}`, `{{ $labels.x }}`, `| humanizeDuration`). LIFECYCLE: empty → nothing; non-empty, `for` baaki → PENDING; poore `for` → FIRING; kisi point par empty → timer RESET. `for:` TUNING: PAGE ke liye `2-5m`; TICKET `15-60m`; KABHI `0s` nahi; KABHI `1h` page par nahi. ALERTS METRIC: `ALERTS{alertname, alertstate}`.',
      },
      {
        task: 'In a comment, describe how you unit-test a recording rule + an alert rule with promtool test rules — the assertions for the quantile value and for the for: behaviour, and why round() is needed.',
        taskHi: 'Ek comment mein, promtool test rules ke saath unit-test karna describe karो.',
        hint: '`promtool test rules <test.yml>` runs OFFLINE (no server, <1s). Structure: `rule_files: [ rules.yml ]`, `evaluation_interval: 1m`, `tests:` — each with `interval: 1m` + `input_series:` + assertions. FOR A HISTOGRAM: supply the CUMULATIVE bucket series as input — `http_request_duration_seconds_bucket{job="api", le="0.1"}` `values: "0+80x30"`, `le="0.25"` `values: "0+90x30"`, `le="0.5"` `"0+98x30"`, `le="1"` `"0+100x30"`, `le="+Inf"` `"0+100x30"` — meaning 98% of requests finish ≤ 0.5s, the last 2% spill into (0.5, 1]. ASSERTION 1 — `promql_expr_test`: `expr: job:http_request_latency_seconds:p99_5m`, `eval_time: 15m`, `exp_samples: [{ labels: ...{job="api"}, value: 0.75 }]` — the 99th obs is in the (0.5, 1] bucket → interpolates to ~0.75. WHY `round()` IS NEEDED: `histogram_quantile` interpolation produces a FLOATING-POINT ARTEFACT like `0.7500000000000017`, and `promql_expr_test` does an EXACT float comparison → the test fails against `0.75`. FIX: wrap the recording rule in `round(histogram_quantile(...), 0.001)` → a clean, assertable `0.75` stored series (also realistic — recording rules often round for a stable series). ASSERTION 2 — `alert_rule_test` (verifies `for: 10m`): `- eval_time: 6m`, `alertname: HighP99Latency`, `exp_alerts: []` — at 6m the p99 has been over threshold only ~4m (< the `for: 10m`) → still PENDING, NO firing alert → assert the empty list. Then `- eval_time: 15m`, `exp_alerts: [{ exp_labels: { severity: page, job: api }, exp_annotations: { summary: "api p99 latency is 750ms" } }]` — over for > 10m → FIRING, with the EXACT rendered annotation (`{{ $value | humanizeDuration }}` on 0.75 → `750ms`). This proves BOTH that the `for` gate works (pending before, firing after) AND that annotation templating renders what you expect. RUN IN CI on every rule-file change → a broken expr / wrong threshold / a rule that doesn\'t fire when it should is caught BEFORE deploy, not during an incident when the page that should have fired didn\'t.',
        hintHi: '`promtool test rules <test.yml>` OFFLINE chalाता hai (<1s). Structure: `rule_files`, `evaluation_interval`, `tests:` — har ek `interval` + `input_series:` + assertions. HISTOGRAM KE LIYE: CUMULATIVE bucket series input do — `le="0.1"` `"0+80x30"`, `le="0.25"` `"0+90x30"`, `le="0.5"` `"0+98x30"`, `le="1"` `"0+100x30"`, `le="+Inf"` `"0+100x30"`. ASSERTION 1 — `promql_expr_test`: `eval_time: 15m`, `value: 0.75`. `round()` KYUN: `histogram_quantile` interpolation `0.7500000000000017` jaisा ARTEFACT produce karता hai, aur test EXACT float comparison karता hai → fail. FIX: `round(histogram_quantile(...), 0.001)`. ASSERTION 2 — `alert_rule_test` (`for: 10m` verify): `eval_time: 6m` → `exp_alerts: []` (PENDING); `eval_time: 15m` → `exp_alerts: [{ exp_labels, exp_annotations: { summary: "api p99 latency is 750ms" } }]` (FIRING). CI mein CHALAO.',
      },
    ],

    keyTakeaways: [
      'A HISTOGRAM exposes cumulative `_bucket{le="X"}` counters (+ `_sum`, `_count`). Compute a percentile with `histogram_quantile(0.99, sum(rate(m_bucket[5m])) by (le, job))` — the ORDER matters: `rate` (buckets are counters) → `sum by (le, …)` (combine instances, KEEP `le`) → `histogram_quantile` LAST. Calling `histogram_quantile` per-instance, or summing away `le`, both give wrong or NaN results.',
      'Percentile accuracy is BOUNDED by bucket boundaries — `histogram_quantile` only interpolates within the containing bucket. If the buckets don\'t bracket your SLO threshold (the old default jumps 0.1 → 0.5), the quantile can\'t answer the SLO question. Cluster buckets densely around the threshold, or use NATIVE HISTOGRAMS (auto exponential buckets, high-resolution, fewer series).',
      'A RECORDING RULE pre-computes an expression on a schedule and stores it as a new series, named `level:metric:operations` (e.g. `job:http_request_latency_seconds:p99_5m`). Purpose: dashboards + alerts read the cheap pre-aggregated series instead of re-running a heavy query, and it becomes the ONE source of truth for a derived value.',
      'An ALERTING RULE has `expr`, `for` (the expr must be non-empty CONTINUOUSLY for this long: PENDING → FIRING), `labels` (`severity` — Alertmanager routes on it), `annotations` (templated: `{{ $value }}`, `{{ $labels.x }}`, `| humanizeDuration`). LIFECYCLE: empty → nothing; non-empty < `for` → pending; non-empty ≥ `for` → firing; empty at any point → timer resets. Prometheus emits `ALERTS{alertname, alertstate}`. Tune `for`: 2-5 min for a page, NEVER `0s`, NEVER `1h` on a page.',
      'VERIFY OFFLINE: `promtool check rules` (syntax + naming); `promtool test rules` — supply the histogram `input_series`, assert the p99 `value` at an `eval_time` (wrap the rule in `round(expr, 0.001)` — `histogram_quantile` gives `0.75000…17` and the comparison is exact), and assert `alert_rule_test`: `exp_alerts: []` before the `for` elapses, the firing alert with exact labels + rendered annotations after. Run it in CI.',
    ],
    keyTakeawaysHi: [
      'Ek HISTOGRAM cumulative `_bucket{le="X"}` counters expose karता hai (+ `_sum`, `_count`). Ek percentile `histogram_quantile(0.99, sum(rate(m_bucket[5m])) by (le, job))` se compute karो — ORDER matter karता hai: `rate` (buckets counters hain) → `sum by (le, …)` (instances combine, `le` KEEP) → `histogram_quantile` LAST. `histogram_quantile` per-instance, ya `le` ko sum away karna, dono wrong ya NaN deते hain.',
      'Percentile accuracy bucket boundaries se BOUNDED hai. Agar buckets aapke SLO threshold ko bracket nahi karते (old default 0.1 → 0.5 jump), quantile SLO question answer nahi kar sakता. Buckets ko threshold ke around densely cluster karो, ya NATIVE HISTOGRAMS use karो.',
      'Ek RECORDING RULE ek expression ko ek schedule par pre-compute karता hai aur ise ek naye series ke roop mein store karता hai, `level:metric:operations` named (e.g. `job:http_request_latency_seconds:p99_5m`). Purpose: dashboards + alerts cheap pre-aggregated series padhते hain, aur ye ek derived value ke liye EK source of truth ban jaता hai.',
      'Ek ALERTING RULE ke paas `expr`, `for` (expr itni der CONTINUOUSLY non-empty hona chahिए: PENDING → FIRING), `labels` (`severity` — Alertmanager is par route karता hai), `annotations` (templated) hain. LIFECYCLE: empty → nothing; non-empty < `for` → pending; non-empty ≥ `for` → firing; kisi point par empty → timer reset. Prometheus `ALERTS{alertname, alertstate}` emit karता hai. `for` tune karो: page ke liye 2-5 min, KABHI `0s` nahi, KABHI `1h` page par nahi.',
      'OFFLINE VERIFY: `promtool check rules` (syntax + naming); `promtool test rules` — histogram `input_series` supply karो, p99 `value` ko ek `eval_time` par assert karो (rule ko `round(expr, 0.001)` mein wrap karो — `histogram_quantile` `0.75000…17` deता hai aur comparison exact hai), aur `alert_rule_test` assert karो: `for` elapse hone se pehle `exp_alerts: []`, baad mein exact labels + rendered annotations ke saath firing alert. Ise CI mein chalाओ.',
    ],
  },
];
