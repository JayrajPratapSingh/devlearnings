import type { CourseLesson } from './course-js-module1';

// DevOps Module 13 — Cloud Fundamentals: The Model, Compute & Identity
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module13-part2.ts.
//
// VERIFICATION: this module is PROSE + realistic hand-written CLI output. There is
// no live cloud account to run against; every `aws` / `az` transcript in an example
// is representative of real output, not executed. Examples do NOT carry a `# VERIFY`
// marker, so `verify-bash.mjs` scans them structurally only (ASCII, no PLACEHOLDER).
// Per Jay's directive: AWS is the worked example, with CONCRETE Azure equivalents
// spelled out in every lesson (and GCP noted briefly).

export const DEVOPS_MODULE_13: CourseLesson[] = [
  {
    slug: 'ops-the-shared-responsibility-model-and-cloud-geography',
    title: 'The Shared-Responsibility Model & Cloud Geography',
    titleHi: 'Shared-Responsibility Model Aur Cloud Geography',
    description:
      'Two ideas that frame everything else about the cloud: who is responsible for what (the provider secures the cloud, you secure what you put in it — and the line moves depending on which service you pick), and where things physically run (regions, availability zones, edge locations) and why that placement decides your latency, your resilience, and your legal obligations.',
    descriptionHi:
      'Do ideas jo cloud ke baare mein baaki sab kuch frame karti hain: kaun kis ke liye responsible hai (provider cloud secure karta hai, aap jo isme daalte ho wo secure karte ho — aur line move karti hai depending on kaun sa service aap pick karte ho), aur cheezen physically kahaan run karti hain (regions, availability zones, edge locations) aur wo placement aapki latency, aapki resilience, aur aapki legal obligations kyun decide karta hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Renting a flat versus renting a serviced apartment versus a hotel room.** In an unfurnished flat (a VM) the landlord maintains the building, the roof and the plumbing; everything inside — furniture, cleaning, locking your own door — is yours. In a serviced apartment (a managed database) they also handle the appliances and a weekly clean; you still own what you keep in the safe. In a hotel room (a SaaS product) they run almost everything and you just use it. The building is the provider\'s responsibility at every tier; what changes as you move up is how much of the *inside* they also take on. And the building has an address — which city, which floor — and that address determines how long your commute is (latency), whether one fire takes out everything you own (availability zones), and which country\'s laws apply to your belongings (data residency).',
      hi: '**Ek flat rent karna versus ek serviced apartment versus ek hotel room.** Ek unfurnished flat (ek VM) mein landlord building, roof aur plumbing maintain karta hai; andar sab kuch — furniture, cleaning, apna door lock karna — aapka hai. Ek serviced apartment (ek managed database) mein wo appliances aur ek weekly clean bhi handle karte hain; aap abhi bhi jo safe mein rakhte ho wo own karte ho. Ek hotel room (ek SaaS product) mein wo lagbhag sab kuch chalate hain. Building har tier par provider ki responsibility hai; jo badalta hai jab aap upar move karte ho wo hai kitna *andar* ka wo bhi lete hain. Aur building ka ek address hai — kaun sa city, kaun sa floor — aur wo address decide karta hai aapka commute kitna lamba hai (latency), kya ek aag sab kuch le leti hai (availability zones), aur kaun se desh ke laws aapki cheezon par apply karte hain (data residency).',
    },

    simple: `**THE SHARED-RESPONSIBILITY MODEL** — the provider and you split the work.
The provider is responsible **for** the cloud; you are responsible **for what you
run in** it. Where the line sits depends on the service tier:
\`\`\`
                     you manage ->                              <- provider manages
IaaS (a VM)     | your data | app | runtime | OS patches | ---- | virtualisation | servers | network | building | power
CaaS (containers)| your data | app | container image | ------- | orchestrator | nodes* | ... (*Fargate/Cloud Run: nodes too)
PaaS (App Service)| your data | app code | config | --------- | runtime | OS | scaling | servers | ...
FaaS (Lambda)  | your data | function code | ---------------- | runtime | OS | scaling | availability | ...
SaaS (a product)| your data | your settings | -------------- | everything else
\`\`\`
**IN EVERY TIER YOU OWN: your data, your access control (IAM), and correct
configuration.** Most cloud breaches are a customer misconfiguration (a public
bucket, an over-broad IAM role), not a provider failure.

**CLOUD GEOGRAPHY:**
\`\`\`
REGION            a geographic area (us-east-1, eu-west-1, ap-south-1 / East US,
                  West Europe). Separate power, separate network, own service catalog
                  + own prices. Data does NOT leave a region unless you move it.
AVAILABILITY ZONE one or more discrete datacentres inside a region, isolated power
                  + cooling + network, km apart, low-latency links between them.
                  Deploy across >=2 (ideally 3) AZs -> one datacentre fire != outage.
EDGE / POP        hundreds of small locations near users, for CDN, DNS, WAF, and
                  "edge functions". Not for your databases - for caching + termination.
LOCAL ZONE / etc  region extensions in a metro for very low latency to that city.
\`\`\`

**WHY PLACEMENT MATTERS:**
\`\`\`
LATENCY        speed of light: ~1ms per 100km each way. user in Mumbai + region in
               Virginia = ~180ms round trip before your code runs. put compute near users.
RESILIENCE     single AZ = a datacentre problem is your outage. multi-AZ = survive one.
               multi-REGION = survive a whole region (expensive, complex - Module 17).
DATA RESIDENCY GDPR / India DPDP / sector rules may REQUIRE data stay in-country.
               region choice is a compliance decision, not just a latency one.
COST           egress + some services are priced differently per region. us-east-1 is
               usually cheapest; that is not a reason to put EU users' data there.
\`\`\`

**THE UNIVERSAL BUILDING BLOCKS** (every cloud has these, different names):
compute, block + object + file storage, virtual network, load balancing, DNS,
identity, a managed relational DB, a managed cache, a queue, object events,
secrets, logs + metrics. Learn the concepts; the names are lookups.`,

    simpleHi: `**SHARED-RESPONSIBILITY MODEL** — provider aur aap kaam split karte ho.
Provider cloud **ke liye** responsible hai; aap jo aap isme **run karte ho uske liye**
responsible ho. Line kahaan baithti hai service tier par depend karta hai:
\`\`\`
                     aap manage karte ->                        <- provider manage karta
IaaS (ek VM)    | aapka data | app | runtime | OS patches | -- | virtualisation | servers | network | building | power
CaaS (containers)| aapka data | app | container image | ----- | orchestrator | nodes* | ... (*Fargate/Cloud Run: nodes bhi)
PaaS (App Service)| aapka data | app code | config | -------- | runtime | OS | scaling | servers | ...
FaaS (Lambda)  | aapka data | function code | -------------- | runtime | OS | scaling | availability | ...
SaaS (ek product)| aapka data | aapki settings | ----------- | baaki sab kuch
\`\`\`
**HAR TIER MEIN AAP OWN KARTE HO: aapka data, aapka access control (IAM), aur sahi
configuration.** Zyadaatar cloud breaches ek customer misconfiguration hain (ek public
bucket, ek over-broad IAM role), ek provider failure nahi.

**CLOUD GEOGRAPHY:**
\`\`\`
REGION            ek geographic area (us-east-1, eu-west-1 / East US, West Europe).
                  Separate power, separate network, apna service catalog + apni prices.
                  Data ek region nahi chhodta jab tak aap ise move nahi karte.
AVAILABILITY ZONE ek region ke andar ek ya zyada discrete datacentres, isolated power
                  + cooling + network, km apart, unke beech low-latency links.
                  >=2 (ideally 3) AZs ke across deploy karo -> ek datacentre aag != outage.
EDGE / POP        users ke paas sainkdon chhote locations, CDN, DNS, WAF, aur
                  "edge functions" ke liye. Aapke databases ke liye nahi.
LOCAL ZONE / etc  ek metro mein region extensions us city ko bahut low latency ke liye.
\`\`\`

**PLACEMENT KYUN MATTER KARTA HAI:**
\`\`\`
LATENCY        speed of light: ~1ms per 100km each way. Mumbai mein user + Virginia mein
               region = aapke code chalne se pehle ~180ms round trip. compute users ke paas rakho.
RESILIENCE     single AZ = ek datacentre problem aapka outage hai. multi-AZ = ek survive karo.
               multi-REGION = ek poora region survive karo (mehnga, complex - Module 17).
DATA RESIDENCY GDPR / India DPDP / sector rules data ko in-country rehne ki REQUIRE kar sakte hain.
               region choice ek compliance decision hai, sirf ek latency wala nahi.
COST           egress + kuch services per region alag priced hain. us-east-1 aam taur par
               sabse sasta hai; wo EU users ka data wahaan daalne ka reason nahi hai.
\`\`\`

**UNIVERSAL BUILDING BLOCKS** (har cloud ke paas ye hain, alag names): compute,
block + object + file storage, virtual network, load balancing, DNS, identity,
ek managed relational DB, ek managed cache, ek queue, object events, secrets,
logs + metrics. Concepts seekho; names lookups hain.`,

    content: `## The shared-responsibility model

Every cloud provider publishes a **shared-responsibility model**, and it is the single most important framing for security and operations in the cloud. The provider is responsible **for** the cloud — the physical datacentres, the power and cooling, the network backbone, the hypervisors, the hardware. The customer is responsible **for what they run in** the cloud — their data, their application code, their access controls, and configuring the services correctly.

The dividing line moves depending on which kind of service you use:

- **Infrastructure as a Service** (a raw VM — EC2, Azure VM, Compute Engine): you get an operating system and everything above it is yours. You patch the OS, you harden it, you install and update the runtime, you run and secure the app. The provider handles virtualisation and below.
- **Containers as a Service** (ECS/EKS, AKS, GKE): you own the container image and what runs in it; the provider owns the control plane. With node-based offerings you still manage the worker nodes\' OS; with serverless container platforms (Fargate, Cloud Run, Container Apps) the provider manages the nodes too.
- **Platform as a Service** (Elastic Beanstalk, App Service, App Engine): you deploy application code and configuration; the provider runs the OS, the runtime, patching, and scaling.
- **Functions as a Service** (Lambda, Azure Functions, Cloud Functions): you deploy a function; the provider runs everything else including scaling to zero and back.
- **Software as a Service** (a finished product): you configure it and put your data in; the provider runs all of it.

**In every tier, three things are always yours: your data, your identity and access management, and correct configuration.** The large majority of publicised "cloud breaches" are not the provider being compromised — they are a customer leaving a storage bucket public, attaching an over-broad IAM policy, exposing a database to the internet, or committing a credential. Moving up the tiers reduces how much you *can* misconfigure, but it never removes your responsibility for data and access.

## Regions

A **region** is a large geographic area — \`us-east-1\` (Northern Virginia), \`eu-west-1\` (Ireland), \`ap-south-1\` (Mumbai) on AWS; \`East US\`, \`West Europe\`, \`Central India\` on Azure; \`us-central1\`, \`europe-west1\` on GCP. Each region is operationally independent: its own power, its own network, its own copy of the provider\'s services (not every service is in every region, and new services roll out to the primary regions first), and its own pricing. **Your data does not leave the region you put it in** unless you explicitly copy or replicate it somewhere else. Choosing a region is therefore a decision about latency to your users, which services are available, price, and — often the deciding factor — where the law requires your data to sit.

## Availability zones

Within a region, an **availability zone** (AZ) is one or more physically separate datacentres with independent power, cooling, and networking, located far enough apart that a fire, flood, or power failure in one does not affect another, but close enough (typically within ~100 km) that the network links between them add only a millisecond or two of latency. A region has three or more AZs.

The single most important resilience practice in the cloud is to **spread your workload across at least two, ideally three, availability zones**. A load balancer with targets in three AZs, a database with a standby in a second AZ, a Kubernetes cluster with nodes in three AZs — any of these survives the complete loss of one datacentre with no outage. A single-AZ deployment, by contrast, means that datacentre\'s problems are your problems. Surviving the loss of an entire *region* is a separate, much harder and more expensive problem covered in Module 17.

## Edge locations

Providers also run **edge locations** (also called points of presence): hundreds of small facilities in metropolitan areas around the world, far more numerous than regions. These do not run your databases or your main compute. They host content-delivery caches (CloudFront, Azure Front Door / CDN, Cloud CDN), DNS resolution (Route 53, Azure DNS, Cloud DNS), web application firewalls, TLS termination, and small "edge functions" (Lambda@Edge / CloudFront Functions, Azure Front Door rules, Cloudflare Workers-style). Their job is to terminate connections and serve cached content as close to the user as possible, reducing the round trips that have to travel all the way to your region. Some providers also offer **local zones** or **edge zones** — small region extensions placed in a specific metro for applications that need single-digit-millisecond latency to that city.

## Why placement decides latency, resilience, and legality

**Latency** is bounded by the speed of light: roughly one millisecond of round-trip time per 100 km of distance, before any processing. A user in Mumbai talking to a region in Virginia pays around 180 ms of round trip on every request just in transit. That is why compute belongs near its users, and why CDNs and edge locations exist — to answer as much as possible without the packet crossing an ocean.

**Resilience** is a direct function of how many failure domains you span. One AZ: a datacentre incident is your outage. Multiple AZs: you survive one datacentre. Multiple regions: you survive a regional event, at a large cost in complexity and money.

**Data residency** is frequently the constraint that overrides everything else. GDPR in the EU, the DPDP Act in India, sector-specific rules in finance and healthcare, and government "sovereign cloud" requirements can legally require that personal or regulated data is stored and processed only within a specific country or region. Region selection is then a compliance decision made by legal and security, not an optimisation made by engineering — and \`us-east-1\` being the cheapest region is not a reason to put European customers\' data there.

## The universal building blocks

Every major cloud provides the same core set of services under different names: elastic compute; block storage (disks), object storage (buckets), and file storage (network shares); a virtual private network with subnets and routing; load balancers; managed DNS; an identity and access management system; a managed relational database; a managed in-memory cache; a managed message queue; object-storage event notifications; a secrets manager; and centralised logs and metrics. Learn what each of these *is* and how they fit together, and the provider-specific names become a lookup table rather than a body of knowledge to memorise.`,

    contentHi: `## Shared-responsibility model

Har cloud provider ek **shared-responsibility model** publish karta hai, aur ye cloud mein security aur operations ke liye sabse important framing hai. Provider cloud **ke liye** responsible hai — physical datacentres, power aur cooling, network backbone, hypervisors, hardware. Customer jo wo cloud **mein run karte hain uske liye** responsible hai — unka data, unka application code, unke access controls, aur services ko sahi tarah configure karna.

Dividing line move karti hai depending on aap kaun sa kind ka service use karte ho:
- **Infrastructure as a Service** (ek raw VM): aapko ek OS milta hai aur uske upar sab kuch aapka hai. Aap OS patch karte ho, harden karte ho, runtime install aur update karte ho.
- **Containers as a Service**: aap container image aur jo isme run karta hai own karte ho; provider control plane own karta hai. Serverless container platforms (Fargate, Cloud Run) ke saath provider nodes bhi manage karta hai.
- **Platform as a Service**: aap application code aur configuration deploy karte ho; provider OS, runtime, patching, aur scaling chalata hai.
- **Functions as a Service**: aap ek function deploy karte ho; provider baaki sab kuch chalata hai.
- **Software as a Service**: aap ise configure karte ho aur apna data isme daalte ho; provider ye sab chalata hai.

**Har tier mein, teen cheezen hamesha aapki hain: aapka data, aapka identity aur access management, aur sahi configuration.** Zyadaatar publicised "cloud breaches" provider ke compromise hone nahi hain — wo ek customer ek storage bucket public chhodne, ek over-broad IAM policy attach karne, ek database ko internet ke expose karne ke hain.

## Regions

Ek **region** ek badha geographic area hai — \`us-east-1\`, \`eu-west-1\`, \`ap-south-1\` AWS par; \`East US\`, \`West Europe\`, \`Central India\` Azure par. Har region operationally independent hai: apna power, apna network, provider ke services ki apni copy, aur apni pricing. **Aapka data us region ko nahi chhodta jisme aap ise daalte ho** jab tak aap explicitly ise copy ya replicate nahi karte.

## Availability zones

Ek region ke andar, ek **availability zone** (AZ) ek ya zyada physically separate datacentres hain independent power, cooling, aur networking ke saath, kaafi door located ki ek mein ek aag doosre ko affect nahi karti, par kaafi paas (typically ~100 km ke andar) ki unke beech network links sirf ek ya do millisecond latency add karti hain. Ek region ke teen ya zyada AZs hote hain.

Cloud mein sabse important resilience practice **apne workload ko kam se kam do, ideally teen, availability zones ke across spread karna** hai. Teen AZs mein targets ke saath ek load balancer, ek doosre AZ mein ek standby ke saath ek database — inme se koi bhi ek datacentre ke complete loss ko bina outage ke survive karta hai.

## Edge locations

Providers **edge locations** bhi chalate hain: duniya bhar mein metropolitan areas mein sainkdon chhote facilities, regions se kaafi zyada numerous. Ye aapke databases ya aapki main compute nahi chalate. Ye content-delivery caches, DNS resolution, web application firewalls, TLS termination, aur chhote "edge functions" host karte hain. Unka kaam connections terminate karna aur cached content user ke jitna paas ho sake serve karna hai.

## Placement latency, resilience, aur legality kyun decide karta hai

**Latency** speed of light se bounded hai: roughly ek millisecond round-trip time per 100 km distance. Virginia mein ek region se baat karta hua Mumbai mein ek user har request par ~180 ms round trip pay karta hai sirf transit mein.

**Resilience** ek direct function hai kitne failure domains aap span karte ho ka.

**Data residency** aksar wo constraint hai jo sab kuch override karta hai. EU mein GDPR, India mein DPDP Act, finance aur healthcare mein sector-specific rules legally require kar sakte hain ki personal ya regulated data sirf ek specific country ya region ke andar store aur process ho.

## Universal building blocks

Har major cloud alag names ke tahat same core set of services provide karta hai: elastic compute; block storage, object storage, aur file storage; subnets aur routing ke saath ek virtual private network; load balancers; managed DNS; ek identity aur access management system; ek managed relational database; ek managed in-memory cache; ek managed message queue; secrets manager; aur centralised logs aur metrics.`,

    examples: [
      {
        title: 'Reading the responsibility line for three deployment choices of the same app',
        titleHi: 'Same app ke teen deployment choices ke liye responsibility line padhna',
        code: `# (illustrative — a table of who patches / secures / scales what)

APP: a Node API + Postgres. three ways to run it, and what YOU own in each:

           | OS patches | runtime  | app deploy | DB patching | DB backups | scaling  | network ACLs
-----------+------------+----------+------------+-------------+------------+----------+-------------
EC2 VM     |    YOU     |   YOU    |    YOU     |     YOU     |    YOU     |   YOU    |    YOU
+ self-run |  (unattended-upgrades,  (nvm/apt)  (pg on the same box or a 2nd VM you run)
  Postgres |   a patch window,
           |   reboots)

ECS Fargate|  provider  | provider |    YOU     |     YOU     |    YOU     | provider* |    YOU
+ RDS      |            | (base    | (push an   | (RDS auto-  | (RDS auto- | *you set  | (security
           |            |  image)  |  image)    |  minor +    |  snapshot  |  min/max) |  groups,
           |            |          |            |  your major |  window)   |           |  subnets)
           |            |          |            |  upgrades)  |            |           |

App Runner |  provider  | provider |    YOU     |     YOU     |    YOU     | provider  |  partial
+ RDS      |            |          | (git push  | (RDS)      | (RDS)      | (auto)   |  (VPC
           |            |          |  or image) |            |            |          |  connector)

# CONSTANT ACROSS ALL THREE (never the provider's job):
#   - the DATA in Postgres
#   - IAM: who/what can reach the API, the DB, the deploy pipeline
#   - app-level security: authn/z, input validation, dependency CVEs
#   - "is the security group / bucket / role scoped correctly?"  <- the usual breach`,
        output: `Takeaway: moving EC2 -> Fargate -> App Runner hands the provider more of the
OS / runtime / scaling work, and shrinks the surface where you can misconfigure
infrastructure. It never hands over your data, your IAM, or your app's own
security. Pick the highest tier that still gives you the control you actually need.`,
        explain: 'The same small application — a Node API backed by Postgres — is shown running three ways, with a column for each operational responsibility. On a plain EC2 VM running its own Postgres, almost everything is the customer\'s: OS patching and reboots, the language runtime, the database engine\'s patching and backups, scaling, and the network rules. Moving to ECS Fargate with a managed RDS database hands the provider the OS and the container base image and the mechanics of scaling, and RDS takes over database patching windows and automated snapshots — but the customer still pushes the application image, chooses the scaling bounds, and configures the network. App Runner goes further, taking deployment triggers and autoscaling too. The bottom block is the point: three things never move to the provider at any tier — the data in the database, the IAM configuration governing who and what can reach each component, and the application\'s own security posture. And the single line most likely to cause a breach — "is this security group, bucket, or role scoped correctly?" — is a customer responsibility in every one of the three. The guidance is to choose the highest abstraction tier that still leaves you the control you genuinely require, because every tier up removes infrastructure you could otherwise get wrong.',
        explainHi: 'Wahi chhota application — ek Node API Postgres se backed — teen tarah se running dikhaya gaya hai, har operational responsibility ke liye ek column ke saath. Ek plain EC2 VM par apna Postgres running, lagbhag sab kuch customer ka hai: OS patching aur reboots, language runtime, database engine ki patching aur backups, scaling, aur network rules. ECS Fargate par ek managed RDS database ke saath move karna provider ko OS aur container base image aur scaling ki mechanics deta hai. App Runner aur aage jaata hai. Bottom block point hai: teen cheezen kisi bhi tier par provider ko move nahi karti — database mein data, IAM configuration, aur application ki apni security posture. Aur wo single line jo sabse zyada breach cause karti hai — "kya ye security group, bucket, ya role sahi tarah scoped hai?" — teenon mein se har ek mein ek customer responsibility hai.',
      },
      {
        title: 'Region and AZ choices, and what each one buys or costs',
        titleHi: 'Region aur AZ choices, aur har ek kya khareedti ya cost karti hai',
        code: `$ aws ec2 describe-availability-zones --region ap-south-1 \\
    --query 'AvailabilityZones[].ZoneName' --output text
ap-south-1a   ap-south-1b   ap-south-1c

# Azure equivalent:
$ az account list-locations --query "[?name=='centralindia'].{name:name, zones:availabilityZoneMappings}" -o json
[ { "name": "centralindia", "zones": [ {"logicalZone":"1"}, {"logicalZone":"2"}, {"logicalZone":"3"} ] } ]

# --- scenario: a SaaS app, users mostly in India, some EU customers, GDPR in scope ---

DECISION 1  primary region
  ap-south-1 (Mumbai) / centralindia         -> ~30-50ms to Indian users
  NOT us-east-1 just because it's cheapest    -> ~180ms + the EU data can't live there anyway

DECISION 2  spread within the region
  app tier:  an ASG / VMSS across 1a, 1b, 1c   (survives losing one datacentre)
  database:  primary in 1a, synchronous standby in 1b  (Multi-AZ / zone-redundant)
  => a single-AZ failure = automatic failover, no data loss, ~60s of impact

DECISION 3  EU customers' data (GDPR)
  a SECOND deployment in eu-west-1 / westeurope, EU customer data stays there
  => not a DR copy - a separate data domain for a legal boundary

DECISION 4  global read latency
  static assets + API responses cached at EDGE (CloudFront / Front Door)
  => a user in Berlin hitting the cache never waits for Mumbai`,
        output: `Result: latency is set by the PRIMARY REGION choice; a one-datacentre failure is
absorbed by the MULTI-AZ spread; the legal boundary is a SEPARATE REGION with its
own data; and global users are served fast by the EDGE cache. Four different
concerns, four different placement levers - none of them "just pick the cheap region".`,
        explain: 'The example walks a realistic placement decision for a SaaS product. First, listing the availability zones shows a region is not one datacentre — ap-south-1 has three, and the Azure equivalent centralindia also exposes three logical zones. Then four separate decisions, each driven by a different concern. The primary region is chosen for latency to the largest user base (Mumbai, ~30-50 ms) and explicitly not for price, because us-east-1 would add ~180 ms and could not legally hold the EU data anyway. Within that region, the application tier is spread across all three AZs and the database runs a synchronous standby in a second AZ, so the loss of one datacentre triggers an automatic failover with no data loss rather than an outage. The EU customers\' data is handled by a completely separate deployment in a European region — not a disaster-recovery copy but a distinct data domain that exists to satisfy a legal residency boundary. And global read latency is addressed with an edge cache, so a user in Berlin hitting cached content never waits for a request to reach Mumbai. Four concerns, four levers; "pick the cheapest region" answers none of them.',
        explainHi: 'Example ek SaaS product ke liye ek realistic placement decision walk karta hai. Pehle, availability zones list karna dikhata hai ki ek region ek datacentre nahi hai — ap-south-1 ke teen hain, aur Azure equivalent centralindia bhi teen logical zones expose karta hai. Phir chaar separate decisions, har ek ek alag concern se driven. Primary region latency ke liye chuna jaata hai sabse badhe user base ko (Mumbai, ~30-50 ms) aur explicitly price ke liye nahi. Us region ke andar, application tier saare teen AZs ke across spread hai aur database ek doosre AZ mein ek synchronous standby chalata hai. EU customers ka data ek poori tarah separate deployment dwara handle hota hai ek European region mein — ek DR copy nahi balki ek distinct data domain jo ek legal residency boundary satisfy karne ke liye exist karta hai. Aur global read latency ek edge cache se address hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# assuming "it's in the cloud" means the provider secures it
# team ships an S3 bucket for user uploads, leaves it at defaults + adds a broad policy
# "AWS is secure, they handle security" -> the bucket is world-readable
# 6 months later: the uploads (some with PII) are indexed by a scanner and posted
# to a leak site. AWS did nothing wrong. the shared-responsibility line put the
# bucket policy, the block-public-access setting, and the data classification
# squarely on the customer.`,
        right: `# know your side of the line and check it:
#   - S3: Block Public Access ON at the account level (and per bucket)
#   - bucket policy: least privilege, no  "Principal": "*"  without a hard condition
#   - default encryption on; versioning on; access logging on
#   - the DATA: classify it. PII -> encryption + access review + a retention policy
#   - a config scanner (AWS Config rules / Azure Policy / a CSPM tool) that FAILS
#     the pipeline on a public bucket, an open security group, an unencrypted volume
# the provider secures the datacentre and the S3 service. YOU secure THIS bucket.`,
        why: 'The phrase "the cloud is secure" collapses two very different claims. The provider does secure the parts it is responsible for — the physical facilities, the hypervisors, the storage service\'s own code — and it does so to a standard most companies could never match. But that has nothing to do with whether a specific bucket you created is readable by the world, whether an IAM role you attached can do far more than it needs, or whether a database you launched is reachable from the internet. Those are configuration choices on the customer side of the line, and the provider will faithfully enforce whatever you configured, including "public". The overwhelming majority of cloud data exposures are exactly this: a customer misconfiguration of a service that was working exactly as designed. Owning your side of the line means knowing which settings are yours — public-access blocks, bucket and resource policies, security groups, encryption defaults, IAM scoping — deliberately setting each one, classifying the data you store so its sensitivity drives its controls, and running an automated posture check that fails your pipeline when something is left open.',
        whyHi: 'Phrase "cloud secure hai" do bahut alag claims collapse karta hai. Provider un parts ko secure karta hai jinke liye ye responsible hai — physical facilities, hypervisors, storage service ka apna code — aur ye ise ek standard tak karta hai jise zyadaatar companies kabhi match nahi kar sakti. Par uska is baat se koi lena dena nahi ki ek specific bucket jo aapne banaya duniya dwara readable hai ya nahi, kya ek IAM role jo aapne attach kiya jitna zaroorat hai usse kaafi zyada kar sakta hai, ya kya ek database jo aapne launch kiya internet se reachable hai. Wo configuration choices customer side par hain, aur provider jo bhi aapne configure kiya faithfully enforce karega, including "public". Cloud data exposures ki overwhelming majority exactly ye hai: ek service ka ek customer misconfiguration jo exactly design ke roop mein kaam kar rahi thi.',
      },
      {
        wrong: `# deploying everything into a single availability zone (usually the default one)
resource "aws_instance" "app" {
  count             = 3
  availability_zone = "us-east-1a"      # all 3 in the same datacentre
}
resource "aws_db_instance" "main" {
  multi_az = false                       # single AZ
}
# on the day us-east-1a has a power event:
#   - all 3 app instances down at once
#   - the DB down, no standby to fail over to
#   - "we have 3 instances, we're highly available" - no, you have 3 in one room`,
        right: `# spread across AZs - the single highest-value resilience move in the cloud:
resource "aws_autoscaling_group" "app" {
  vpc_zone_identifier = [               # subnets in three different AZs
    aws_subnet.app_1a.id,
    aws_subnet.app_1b.id,
    aws_subnet.app_1c.id,
  ]
  min_size = 3   # -> the ASG keeps ~1 per AZ
}
resource "aws_db_instance" "main" {
  multi_az = true                        # synchronous standby in a 2nd AZ, auto-failover
}
# Azure: a VM Scale Set with  zones = ["1","2","3"] ; a zone-redundant SQL DB / Flexible Server.
# now: lose one AZ -> the ASG has capacity in the other two, the DB fails over in ~60s.`,
        why: 'Running three instances feels like redundancy, but redundancy only protects you against the failure modes your copies do not share. Three instances in one availability zone share that zone\'s power, cooling, and network, so a single incident in that datacentre takes all three down together, and if your database is also single-AZ there is nothing to fail over to. The fix is to spread across availability zones, which are engineered specifically to fail independently: put the application tier in subnets across three AZs so the autoscaling group naturally keeps roughly one instance per zone, and run the database in a multi-AZ configuration where a synchronous standby in a second zone can take over automatically in under a minute with no data loss. On Azure the equivalents are a zone-redundant VM Scale Set and a zone-redundant database tier. This is the highest return-on-effort resilience change available in the cloud — a configuration flag and a subnet layout — and it turns "one datacentre had a bad day" from an outage into a non-event. Surviving the loss of an entire region is a much larger undertaking and belongs to a deliberate disaster-recovery design.',
        whyHi: 'Teen instances chalana redundancy jaisa feel karta hai, par redundancy sirf aapko un failure modes ke against protect karti hai jo aapki copies share nahi karti. Ek availability zone mein teen instances us zone ka power, cooling, aur network share karte hain, to us datacentre mein ek single incident teenon ko ek saath neeche le jaata hai, aur agar aapka database bhi single-AZ hai to fail over karne ke liye kuch nahi hai. Fix availability zones ke across spread karna hai, jo specifically independently fail karne ke liye engineered hain: application tier ko teen AZs ke across subnets mein rakho aur database ko ek multi-AZ configuration mein chalao jahaan ek doosre zone mein ek synchronous standby ek minute ke andar automatically take over kar sakta hai bina data loss ke. Azure par equivalents ek zone-redundant VM Scale Set aur ek zone-redundant database tier hain.',
      },
      {
        wrong: `# choosing us-east-1 for an EU-only product "because the tutorials use it and it's cheap"
provider "aws" { region = "us-east-1" }
# your users are all in Germany. every API call is ~90-180ms slower than it needs to be.
# and your DPA / GDPR posture: EU personal data is now being stored and processed
# in the US, which needs a lawful transfer mechanism you probably haven't set up,
# and which some of your customers' procurement teams will simply reject.`,
        right: `# region choice = latency + law + service availability, THEN price:
provider "aws" { region = "eu-central-1" }     # Frankfurt - low latency to DE users
#   - EU personal data stays in the EU -> the simple GDPR story
#   - check the services you need are all in that region (most are; some newer ones lag)
#   - accept it may cost a few % more than us-east-1. that is the correct trade.
# if you have BOTH US and EU users: two regional deployments, data kept in-region,
# a global edge/CDN layer in front for static + cacheable content.
# tutorials use us-east-1 because it's the oldest region with every service and the
# lowest prices - none of which are your constraints.`,
        why: 'The default region in most tutorials and the cheapest region for most services are both \`us-east-1\`, and neither of those facts is relevant to where your application should run. Region choice is driven, in order, by latency to your users (light takes real time to cross an ocean, so an EU-only product served from Virginia is permanently ~100-180 ms slower than it should be), by law (EU personal data stored and processed in the US triggers GDPR transfer obligations, needs a documented lawful mechanism, and is a frequent hard blocker in enterprise procurement), and by whether the specific services you depend on are actually available in the region you want (the primary regions get everything; some newer services take months to reach smaller regions). Price comes after all of that, and the few percent difference between a European region and \`us-east-1\` is not a reason to accept worse latency and a harder compliance story. When you genuinely serve users on multiple continents, the answer is a deployment per region with data kept in-region, and a global edge layer in front for the content that can be cached.',
        whyHi: 'Zyadaatar tutorials mein default region aur zyadaatar services ke liye sabse sasta region dono \`us-east-1\` hain, aur un facts mein se koi bhi relevant nahi hai ki aapka application kahaan run karna chahiye. Region choice driven hoti hai, order mein, aapke users ko latency se (light ko ek ocean cross karne mein real time lagta hai), law se (US mein store aur process kiya gaya EU personal data GDPR transfer obligations trigger karta hai), aur kya specific services jinpar aap depend karte ho actually us region mein available hain. Price us sab ke baad aati hai, aur ek European region aur \`us-east-1\` ke beech ka thoda percent difference worse latency aur ek harder compliance story accept karne ka reason nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**A public bucket, a working service** — a media startup\'s upload bucket was world-readable via a `"Principal": "*"` policy added "to make CDN setup easier". 400k user photos, some with EXIF GPS, were scraped. The post-incident review found AWS had done nothing wrong; the fix was account-level Block Public Access, a CSPM scanner gating deploys, and data classification.',
        hi: '**Ek public bucket, ek working service** — ek media startup ka upload bucket ek `"Principal": "*"` policy ke through world-readable tha. 400k user photos scraped kiye gaye. Fix account-level Block Public Access, ek CSPM scanner deploys gating, aur data classification tha.',
      },
      {
        en: '**"We have three servers"** — an e-commerce team ran three app instances and a single-AZ RDS, all in `eu-west-1a`. A zone-wide network event took the site down for four hours during a sale. Moving to a 3-AZ ASG and Multi-AZ RDS was two Terraform changes; the next zone incident, months later, was a 70-second blip.',
        hi: '**"Humare paas teen servers hain"** — ek e-commerce team ne teen app instances aur ek single-AZ RDS chalaye, sab `eu-west-1a` mein. Ek zone-wide network event ne site ko chaar ghante down kar diya. Ek 3-AZ ASG aur Multi-AZ RDS par move karna do Terraform changes tha.',
      },
      {
        en: '**Procurement said no** — a B2B SaaS built entirely in `us-east-1` lost three enterprise EU deals in a row because their data-processing addendum could not offer EU data residency. Standing up a `eu-central-1` deployment with EU tenant data pinned there took a quarter and unblocked the pipeline.',
        hi: '**Procurement ne mana kar diya** — ek B2B SaaS jo poori tarah `us-east-1` mein bana tha teen enterprise EU deals lagataar khoye kyunki unka data-processing addendum EU data residency offer nahi kar saka. Ek `eu-central-1` deployment khada karna ek quarter laga.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the shared-responsibility model and how the line moves between IaaS, PaaS and SaaS. What is always the customer\'s responsibility?',
        qHi: 'Shared-responsibility model samjhao aur line IaaS, PaaS aur SaaS ke beech kaise move karti hai. Hamesha customer ki responsibility kya hai?',
        a: 'The shared-responsibility model splits ownership between the provider, who is responsible for the cloud — the datacentres, power, cooling, network backbone, hypervisors, and the code of the managed services themselves — and the customer, who is responsible for what they run in the cloud. Where the boundary sits depends on the service tier. With IaaS, a raw VM, the customer owns the operating system and everything above it: OS patching, hardening, the runtime, the application, and the network rules. With PaaS, the customer deploys application code and configuration and the provider takes over the OS, the runtime, patching, and scaling. With FaaS the customer deploys just a function. With SaaS the customer only configures the product and supplies data. Moving up the tiers steadily reduces how much infrastructure the customer can misconfigure, but three things never transfer to the provider at any tier: the customer\'s data, their identity and access management, and correct configuration of the services they use. This matters because the large majority of publicised cloud breaches are not the provider being compromised — they are a customer leaving a bucket public, attaching an over-broad role, or exposing a database, with the service behaving exactly as configured.',
        aHi: 'Shared-responsibility model ownership ko provider ke beech split karta hai, jo cloud ke liye responsible hai — datacentres, power, cooling, network backbone, hypervisors, aur managed services ka code khud — aur customer, jo jo wo cloud mein run karte hain uske liye responsible hai. Boundary kahaan baithti hai service tier par depend karta hai. IaaS ke saath, ek raw VM, customer OS aur uske upar sab kuch own karta hai. PaaS ke saath, customer application code aur configuration deploy karta hai aur provider OS, runtime, patching, aur scaling le leta hai. FaaS ke saath customer sirf ek function deploy karta hai. SaaS ke saath customer sirf product configure karta hai. Teen cheezen kisi bhi tier par provider ko transfer nahi hoti: customer ka data, unka identity aur access management, aur services ka sahi configuration. Ye matter karta hai kyunki cloud breaches ki majority provider ke compromise hone nahi hain.',
      },
      {
        q: 'What is the difference between a region and an availability zone, and what is the single most important thing you do with AZs?',
        qHi: 'Ek region aur ek availability zone mein kya difference hai, aur AZs ke saath aap sabse important cheez kya karte ho?',
        a: 'A region is a large geographic area — Northern Virginia, Ireland, Mumbai — that is operationally independent: its own power, its own network, its own copy of the provider\'s service catalog, and its own pricing. Your data does not leave the region you place it in unless you explicitly move it, which makes region choice a decision about latency to users, service availability, price, and legal data residency. An availability zone is one or more physically separate datacentres within a region, with independent power, cooling, and networking, located far enough apart that a fire or power failure in one does not affect another but close enough that the network links between them add only a millisecond or two. A region has three or more AZs. The single most important thing you do with them is spread every workload across at least two, ideally three, availability zones: an autoscaling group with subnets in three AZs, a database with a synchronous standby in a second AZ, a Kubernetes cluster with nodes in three AZs. Any of these survives the complete loss of one datacentre with automatic failover and no outage. A single-AZ deployment means that datacentre\'s incidents are directly your incidents. Surviving the loss of an entire region is a separate, much harder problem.',
        aHi: 'Ek region ek badha geographic area hai — Northern Virginia, Ireland, Mumbai — jo operationally independent hai: apna power, apna network, provider ke service catalog ki apni copy, aur apni pricing. Aapka data us region ko nahi chhodta jisme aap ise place karte ho jab tak aap explicitly ise move nahi karte. Ek availability zone ek region ke andar ek ya zyada physically separate datacentres hain, independent power, cooling, aur networking ke saath, kaafi door located ki ek mein ek aag doosre ko affect nahi karti par kaafi paas ki unke beech network links sirf ek ya do millisecond add karti hain. Ek region ke teen ya zyada AZs hote hain. Sabse important cheez har workload ko kam se kam do, ideally teen, availability zones ke across spread karna hai. Inme se koi bhi ek datacentre ke complete loss ko automatic failover aur bina outage ke survive karta hai.',
      },
      {
        q: 'What factors decide which region you deploy to, and why is "the cheapest one" usually wrong?',
        qHi: 'Kaun se factors decide karte hain aap kaun se region mein deploy karte ho, aur "sabse sasta wala" aam taur par galat kyun hai?',
        a: 'Region choice is driven, roughly in order, by four factors. Latency: the speed of light imposes about a millisecond of round trip per hundred kilometres, so serving European users from Virginia is permanently around a hundred to a hundred and eighty milliseconds slower than serving them from Frankfurt, on every request, before any processing. Legal data residency: regulations like GDPR in the EU and the DPDP Act in India, plus sector rules in finance and healthcare, can legally require that personal or regulated data is stored and processed only within a specific country or region, and storing EU personal data in the US triggers transfer obligations that are a frequent hard blocker in enterprise procurement. Service availability: the primary regions get every service immediately, while newer services can take months to reach smaller regions, so you must confirm what you depend on is actually there. And only then, price: the difference between a European region and us-east-1 is typically a few percent. The cheapest region, which for most services is us-east-1, is also the default in most tutorials, but neither of those facts has anything to do with where your users are or what the law requires. Accepting worse latency and a harder compliance story to save a few percent is the wrong trade; when you serve multiple continents the answer is a deployment per region with data kept in-region and a global edge layer in front.',
        aHi: 'Region choice driven hoti hai, roughly order mein, chaar factors se. Latency: speed of light per sau kilometre lagbhag ek millisecond round trip impose karti hai, to Virginia se European users ko serve karna Frankfurt se unhe serve karne se permanently lagbhag sau se ek sau assi millisecond slower hai. Legal data residency: GDPR jaise regulations legally require kar sakte hain ki personal data sirf ek specific country ke andar store ho. Service availability: primary regions ko har service turant milti hai, jabki newer services ko smaller regions tak pahunchne mein mahine lag sakte hain. Aur sirf phir, price: ek European region aur us-east-1 ke beech ka difference typically thoda percent hai. Sabse sasta region, jo zyadaatar services ke liye us-east-1 hai, zyadaatar tutorials mein default bhi hai, par un facts mein se kisi ka aapke users kahaan hain ya law kya require karti hai se koi lena dena nahi.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, draw the shared-responsibility line for IaaS, CaaS, PaaS, FaaS and SaaS, and list the three things the customer owns at every tier.',
        taskHi: 'Ek comment mein, IaaS, CaaS, PaaS, FaaS aur SaaS ke liye shared-responsibility line draw karo.',
        hint: 'The PROVIDER is responsible FOR the cloud (physical datacentres, power/cooling, network backbone, hypervisors, the managed services\' own code). The CUSTOMER is responsible FOR what they run IN it. The line by tier (customer owns, top → down): IaaS (a raw VM — EC2 / Azure VM / Compute Engine): your data, app, runtime, **OS patching + hardening**, network rules → provider: virtualisation and below. CaaS (ECS/EKS, AKS, GKE): your data, app, container IMAGE → provider: the control plane; with NODE-based offerings you still patch the worker-node OS, with SERVERLESS containers (Fargate / Cloud Run / Container Apps) the provider does the nodes too. PaaS (Elastic Beanstalk / App Service / App Engine): your data, app CODE + config → provider: OS, runtime, patching, scaling, servers. FaaS (Lambda / Azure Functions / Cloud Functions): your data, FUNCTION code → provider: everything else, including scale-to-zero. SaaS (a finished product): your data + your SETTINGS → provider: all of it. THREE THINGS THE CUSTOMER OWNS AT EVERY TIER: (1) the DATA (classification, encryption choice, retention); (2) IDENTITY & ACCESS MANAGEMENT (who/what can reach each component); (3) correct CONFIGURATION of the services used (public-access blocks, resource policies, security groups, encryption defaults, IAM scoping). Moving up shrinks how much infra you CAN misconfigure but never removes these three — and the large majority of "cloud breaches" are a customer misconfiguration of a service working exactly as designed.',
        hintHi: 'PROVIDER cloud KE LIYE responsible hai (physical datacentres, power/cooling, network backbone, hypervisors, managed services ka apna code). CUSTOMER jo wo ISME run karte hain uske liye responsible hai. Line by tier (customer owns): IaaS (ek raw VM): aapka data, app, runtime, OS patching + hardening, network rules. CaaS: aapka data, app, container IMAGE → provider: control plane; SERVERLESS containers (Fargate / Cloud Run) mein provider nodes bhi karta hai. PaaS: aapka data, app CODE + config. FaaS: aapka data, FUNCTION code. SaaS: aapka data + aapki SETTINGS. TEEN CHEEZEN HAR TIER PAR: (1) DATA; (2) IDENTITY & ACCESS MANAGEMENT; (3) services ka sahi CONFIGURATION. Cloud breaches ki majority ek customer misconfiguration hai.',
      },
      {
        task: 'In a comment, define region, availability zone, and edge location, and explain what multi-AZ versus multi-region each buys you.',
        taskHi: 'Ek comment mein, region, availability zone, aur edge location define karo.',
        hint: 'REGION = a large geographic area (us-east-1 / East US / europe-west1), operationally INDEPENDENT: own power, own network, own copy of the service catalog (not every service in every region; new services hit primaries first), own pricing. Your data does NOT leave a region unless you explicitly move/replicate it → region choice = latency + data-residency law + service availability + (last) price. AVAILABILITY ZONE (AZ) = one or more physically separate datacentres WITHIN a region — independent power/cooling/network, far enough apart that one fire/flood/power event does not hit another, close enough (~100 km) that inter-AZ links add only 1-2 ms. A region has ≥ 3 AZs. EDGE LOCATION / POP = hundreds of small facilities near users (far more numerous than regions) — they host CDN caches, DNS, WAF, TLS termination, small edge functions. NOT your databases or main compute — for terminating connections + serving cached content close to the user. (LOCAL / EDGE ZONES = region extensions in a specific metro for single-digit-ms latency to that city.) WHAT EACH BUYS: MULTI-AZ (app tier across 3 AZs, DB with a synchronous standby in a 2nd AZ) → survive the complete loss of ONE datacentre with automatic failover, no data loss, ~60 s impact — the single highest return-on-effort resilience move, just a config flag + subnet layout. MULTI-REGION → survive the loss of an ENTIRE region (a regional outage, a region-wide control-plane event) — but far more complex and expensive: data replication, failover orchestration, split-brain risk, cost of idle capacity — a deliberate DR design (Module 17), not a default. Latency is set by the PRIMARY REGION; a one-datacentre failure is absorbed by MULTI-AZ; a legal boundary is a SEPARATE REGION with its own data; global read speed is the EDGE cache.',
        hintHi: 'REGION = ek badha geographic area, operationally INDEPENDENT: own power, own network, own service catalog, own pricing. Aapka data ek region nahi chhodta jab tak aap explicitly ise move nahi karte → region choice = latency + data-residency law + service availability + (last) price. AVAILABILITY ZONE (AZ) = ek region ke ANDAR ek ya zyada physically separate datacentres — independent power/cooling/network, kaafi door ki ek event doosre ko na hit kare, kaafi paas (~100 km) ki inter-AZ links sirf 1-2 ms add karti hain. Ek region ke ≥ 3 AZs. EDGE LOCATION = users ke paas sainkdon chhote facilities — CDN caches, DNS, WAF, TLS termination. Aapke databases ke liye NAHI. MULTI-AZ → EK datacentre ka complete loss automatic failover se survive karo. MULTI-REGION → ek POORA region ka loss survive karo — par kaafi zyada complex aur mehnga (Module 17).',
      },
      {
        task: 'In a comment, list the universal cloud building blocks with their AWS and Azure names, and explain why "us-east-1 is cheapest" is a bad reason to choose it.',
        taskHi: 'Ek comment mein, universal cloud building blocks list karo unke AWS aur Azure names ke saath.',
        hint: 'UNIVERSAL BUILDING BLOCKS (concept — AWS — Azure): elastic compute — EC2 — Virtual Machines; block storage (disks) — EBS — Managed Disks; object storage (buckets) — S3 — Blob Storage; file storage (shares) — EFS/FSx — Azure Files; virtual network — VPC — VNet; load balancer — ELB/ALB/NLB — Load Balancer / Application Gateway; managed DNS — Route 53 — Azure DNS; identity & access — IAM — Entra ID + Azure RBAC; managed relational DB — RDS/Aurora — Azure SQL / Database for PostgreSQL; managed cache — ElastiCache — Azure Cache for Redis; managed queue — SQS — Storage Queues / Service Bus; object events — S3 Event Notifications — Event Grid; secrets — Secrets Manager / SSM Parameter Store — Key Vault; logs + metrics — CloudWatch — Azure Monitor. (GCP: Compute Engine, Persistent Disk, Cloud Storage, Filestore, VPC, Cloud Load Balancing, Cloud DNS, Cloud IAM, Cloud SQL, Memorystore, Pub/Sub, Eventarc, Secret Manager, Cloud Monitoring.) Learn the CONCEPTS + how they fit; the names are a lookup table. WHY "us-east-1 IS CHEAPEST" IS A BAD REASON: (1) LATENCY — light is ~1 ms round trip per 100 km; EU users served from Virginia pay ~90-180 ms EXTRA on every request before your code runs. (2) LAW — EU personal data stored/processed in the US triggers GDPR cross-border transfer obligations (a documented lawful mechanism), and is a frequent HARD BLOCKER in enterprise procurement / DPAs. (3) SERVICE AVAILABILITY is not the issue here (us-east-1 has everything) but it IS for other regions — always check. (4) The price delta between a correct region and us-east-1 is typically a FEW PERCENT — not worth permanently worse latency + a harder compliance story. us-east-1 is the tutorial default because it is the oldest region with every service at the lowest price — none of which are YOUR constraints. Multi-continent → a deployment per region, data kept in-region, a global edge/CDN layer in front.',
        hintHi: 'UNIVERSAL BUILDING BLOCKS (concept — AWS — Azure): elastic compute — EC2 — Virtual Machines; block storage — EBS — Managed Disks; object storage — S3 — Blob Storage; virtual network — VPC — VNet; load balancer — ELB/ALB — Load Balancer / Application Gateway; managed DNS — Route 53 — Azure DNS; identity — IAM — Entra ID + Azure RBAC; managed relational DB — RDS/Aurora — Azure SQL / DB for PostgreSQL; managed cache — ElastiCache — Azure Cache for Redis; queue — SQS — Service Bus; secrets — Secrets Manager — Key Vault; logs + metrics — CloudWatch — Azure Monitor. Concepts seekho; names lookup hain. "us-east-1 SABSE SASTA" BAD REASON KYUN: (1) LATENCY — ~1 ms per 100 km; EU users Virginia se ~90-180 ms EXTRA; (2) LAW — US mein EU data GDPR transfer obligations trigger karta hai, procurement mein HARD BLOCKER; (3) price delta typically THODA PERCENT hai.',
      },
    ],

    keyTakeaways: [
      'THE SHARED-RESPONSIBILITY MODEL: the provider secures the cloud (datacentres, power, network, hypervisors, the managed services\' own code); you secure what you run in it. The line moves up as you go IaaS → CaaS → PaaS → FaaS → SaaS, shrinking what you *can* misconfigure — but your DATA, your IAM, and correct CONFIGURATION are always yours. Most "cloud breaches" are a customer misconfiguration of a service working as designed.',
      'A REGION is an operationally independent geographic area (own power, network, service catalog, prices); your data stays in it unless you move it — so region choice is latency + data-residency LAW + service availability, then price. An AVAILABILITY ZONE is one+ physically separate datacentres within a region, engineered to fail independently, ~1-2 ms apart.',
      'The single highest-value resilience move is SPREADING ACROSS ≥ 2 (ideally 3) AZs: an ASG/VMSS across three zones, a DB with a synchronous standby in a second zone → survive the complete loss of one datacentre with automatic failover and no data loss. Surviving a whole REGION is a separate, much harder DR problem (Module 17).',
      'EDGE LOCATIONS (hundreds, near users) host CDN caches, DNS, WAF, TLS termination and small edge functions — for terminating connections and serving cached content close to users, NOT for your databases. Latency is bounded by the speed of light (~1 ms round trip per 100 km), which is why compute belongs near its users and edge caches exist.',
      'DATA RESIDENCY (GDPR, India DPDP, sector rules, sovereign-cloud requirements) frequently overrides everything — region selection becomes a compliance decision, and `us-east-1` being the cheapest/tutorial-default region is not a reason to put EU or regulated data there. Learn the UNIVERSAL BUILDING BLOCKS (compute, block/object/file storage, VNet, LB, DNS, IAM, managed DB/cache/queue, secrets, logs+metrics) as concepts; the AWS/Azure/GCP names are a lookup.',
    ],
    keyTakeawaysHi: [
      'SHARED-RESPONSIBILITY MODEL: provider cloud secure karta hai (datacentres, power, network, hypervisors, managed services ka apna code); aap jo isme run karte ho wo secure karte ho. Line upar move karti hai jab aap IaaS → CaaS → PaaS → FaaS → SaaS jaate ho — par aapka DATA, aapka IAM, aur sahi CONFIGURATION hamesha aapke hain. Zyadaatar "cloud breaches" ek customer misconfiguration hain.',
      'Ek REGION ek operationally independent geographic area hai (own power, network, service catalog, prices); aapka data isme rehta hai jab tak aap ise move nahi karte — to region choice latency + data-residency LAW + service availability hai, phir price. Ek AVAILABILITY ZONE ek region ke andar ek+ physically separate datacentres hai, independently fail karne ke liye engineered, ~1-2 ms apart.',
      'Sabse high-value resilience move ≥ 2 (ideally 3) AZs KE ACROSS SPREAD karna hai: teen zones ke across ek ASG/VMSS, ek doosre zone mein ek synchronous standby ke saath ek DB → ek datacentre ka complete loss automatic failover aur bina data loss ke survive karo. Ek poora REGION survive karna ek separate, kaafi harder DR problem hai (Module 17).',
      'EDGE LOCATIONS (sainkdon, users ke paas) CDN caches, DNS, WAF, TLS termination aur chhote edge functions host karte hain — connections terminate karne aur cached content users ke paas serve karne ke liye, aapke databases ke liye NAHI. Latency speed of light se bounded hai (~1 ms round trip per 100 km).',
      'DATA RESIDENCY (GDPR, India DPDP, sector rules, sovereign-cloud) aksar sab kuch override karta hai — region selection ek compliance decision ban jaata hai, aur `us-east-1` ka sabse sasta/tutorial-default region hona EU ya regulated data wahaan daalne ka reason nahi hai. UNIVERSAL BUILDING BLOCKS (compute, storage, VNet, LB, DNS, IAM, managed DB/cache/queue, secrets, logs+metrics) concepts ke roop mein seekho; AWS/Azure/GCP names ek lookup hain.',
    ],
  },

  {
    slug: 'ops-the-compute-spectrum-vm-container-function-paas',
    title: 'The Compute Spectrum: VM, Container, Function, PaaS',
    titleHi: 'Compute Spectrum: VM, Container, Function, PaaS',
    description:
      'Cloud compute is a spectrum from a raw virtual machine you manage entirely, through containers, up to functions and platform services where the provider runs almost everything. Each step trades control and flexibility for less operational work, a different cost model, and new constraints like cold starts and execution limits. Knowing where a workload sits on this spectrum is the core compute decision.',
    descriptionHi:
      'Cloud compute ek spectrum hai ek raw virtual machine se jo aap poori tarah manage karte ho, containers ke through, functions aur platform services tak jahaan provider lagbhag sab kuch chalata hai. Har step control aur flexibility ko kam operational work, ek alag cost model, aur naye constraints jaise cold starts aur execution limits ke liye trade karta hai. Ek workload is spectrum par kahaan baithta hai jaanna core compute decision hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Ways to get a meal.** Buy raw ingredients and cook (a VM): total control, you own every step, and the kitchen sits idle between meals but you still pay rent on it. A meal kit with pre-measured parts (a container): the hard prep is done, you assemble and heat, it is reproducible every time. A restaurant (PaaS): you order, they cook and plate and wash up, you just say what you want. A vending machine (a function): you press a button, you get exactly one item in seconds, you pay per item and nothing when you are not buying — but you cannot get a five-course dinner out of it. None is "best"; the right one depends on how often you eat, how custom the meal is, and how much of the kitchen work you want to own.',
      hi: '**Ek meal paane ke tarike.** Raw ingredients khareedo aur pakao (ek VM): total control, aap har step own karte ho, aur kitchen meals ke beech idle baithti hai par aap abhi bhi ispar rent pay karte ho. Pre-measured parts ke saath ek meal kit (ek container): hard prep ho gaya, aap assemble aur heat karte ho, ye har baar reproducible hai. Ek restaurant (PaaS): aap order karte ho, wo pakate hain aur plate karte hain aur dhote hain. Ek vending machine (ek function): aap ek button dabate ho, aapko exactly ek item seconds mein milta hai, aap per item pay karte ho aur kuch nahi jab aap nahi khareedte — par aap isse ek five-course dinner nahi nikaal sakte. Koi "best" nahi hai; sahi wala depend karta hai aap kitni baar khaate ho, meal kitna custom hai, aur kitna kitchen work aap own karna chahte ho.',
    },

    simple: `**THE SPECTRUM** (more control + more ops work on the left; less of both on the right):
\`\`\`
BARE METAL --- VM --- CONTAINER (on your nodes) --- CONTAINER (serverless) --- PaaS --- FUNCTION
  you rack    you run    you run the orchestrator      provider runs nodes    you push   you push
  hardware    an OS      + patch the nodes             you push an image      code       a function
\`\`\`

**VM (IaaS)** — EC2 / Azure VM / Compute Engine. A whole machine: full OS control,
any workload (stateful, GPU, weird kernel needs, licensed software). YOU patch,
harden, monitor, scale. Billed per second/hour it runs, whether busy or idle.
Boots in ~30-60s. Use for: legacy apps, stateful services, anything needing the OS.

**CONTAINER** — a packaged app + its deps, run by an orchestrator.
- ON YOUR NODES: ECS on EC2 / EKS / AKS / GKE Standard — you still manage the
  worker-node OS, capacity, and upgrades. Good bin-packing, full control.
- SERVERLESS: Fargate / EKS Auto / AKS "virtual nodes" / Cloud Run / Container Apps
  / GKE Autopilot — provider runs the nodes; you pick CPU/memory per task and pay
  for that. No node patching. Slightly less control, no bin-packing wins.
Use for: most stateless services, anything already containerised, microservices.

**PaaS** — Elastic Beanstalk / App Runner / App Service / App Engine / Cloud Run
(also fits here). Push code (or an image); the platform builds, deploys, runs the
OS + runtime, and autoscales. Least ops for a standard web app. Constraints: the
platform's supported runtimes, its deploy model, less infra visibility.
Use for: standard web apps + APIs where you want to write code, not run infra.

**FUNCTION (FaaS)** — Lambda / Azure Functions / Cloud Functions / Cloud Run
functions. One handler, triggered by an event (HTTP, a queue message, a file
upload, a cron, a stream record). Scales from 0 to thousands automatically. Pay
per invocation + GB-seconds; **zero cost when idle**.
\`\`\`
CONSTRAINTS:  execution time cap (Lambda 15 min), memory cap, package size cap,
              /tmp only, no persistent local state, and COLD STARTS - the first
              call after idle (or during a scale-up) pays 100ms-2s+ of init.
\`\`\`
Use for: event handlers, glue, cron jobs, spiky/low-volume APIs, fan-out work.

**HOW TO CHOOSE** (ask in order):
\`\`\`
1. Does it need the OS / a kernel feature / a GPU / to be stateful? -> VM.
2. Is it event-driven, spiky, or idle most of the time?             -> FUNCTION.
3. Is it a standard long-running web app + you don't want infra?     -> PaaS.
4. Otherwise (most services): CONTAINER, serverless flavour unless you need
   the control or bin-packing of managing your own nodes.
\`\`\``,

    simpleHi: `**SPECTRUM** (baaen par zyada control + zyada ops work; daaen par dono kam):
\`\`\`
BARE METAL --- VM --- CONTAINER (aapke nodes par) --- CONTAINER (serverless) --- PaaS --- FUNCTION
  aap rack    aap ek     aap orchestrator chalate ho     provider nodes chalata   aap code   aap ek
  hardware    OS chalate  + nodes patch karte ho         aap ek image push karte  push       function push
\`\`\`

**VM (IaaS)** — EC2 / Azure VM / Compute Engine. Ek poori machine: full OS control,
koi bhi workload (stateful, GPU, weird kernel needs, licensed software). AAP patch,
harden, monitor, scale karte ho. Per second/hour billed jab ye run karta hai, busy
ya idle. ~30-60s mein boot hota hai. Use for: legacy apps, stateful services.

**CONTAINER** — ek packaged app + iski deps, ek orchestrator dwara run.
- AAPKE NODES PAR: ECS on EC2 / EKS / AKS / GKE Standard — aap abhi bhi worker-node
  OS, capacity, aur upgrades manage karte ho. Achha bin-packing, full control.
- SERVERLESS: Fargate / Cloud Run / Container Apps / GKE Autopilot — provider nodes
  chalata hai; aap per task CPU/memory pick karte ho aur uske liye pay karte ho.
  Koi node patching nahi. Thoda kam control, koi bin-packing wins nahi.
Use for: zyadaatar stateless services, koi bhi jo already containerised hai, microservices.

**PaaS** — Elastic Beanstalk / App Runner / App Service / App Engine. Code push
karo (ya ek image); platform build, deploy, OS + runtime run karta hai, aur
autoscale karta hai. Ek standard web app ke liye sabse kam ops. Constraints:
platform ke supported runtimes, iska deploy model, kam infra visibility.

**FUNCTION (FaaS)** — Lambda / Azure Functions / Cloud Functions. Ek handler, ek
event dwara triggered (HTTP, ek queue message, ek file upload, ek cron, ek stream
record). 0 se hazaron automatically scale karta hai. Per invocation + GB-seconds
pay karo; **idle hone par zero cost**.
\`\`\`
CONSTRAINTS:  execution time cap (Lambda 15 min), memory cap, package size cap,
              sirf /tmp, koi persistent local state nahi, aur COLD STARTS - idle
              ke baad pehla call (ya scale-up ke dauraan) 100ms-2s+ init pay karta hai.
\`\`\`
Use for: event handlers, glue, cron jobs, spiky/low-volume APIs, fan-out work.

**KAISE CHOOSE KARE** (order mein poochho):
\`\`\`
1. Kya ise OS / ek kernel feature / ek GPU / stateful hone ki zaroorat hai? -> VM.
2. Kya ye event-driven, spiky, ya zyadaatar samay idle hai?                 -> FUNCTION.
3. Kya ye ek standard long-running web app hai + aap infra nahi chahte?     -> PaaS.
4. Otherwise (zyadaatar services): CONTAINER, serverless flavour jab tak aapko
   apne nodes manage karne ka control ya bin-packing nahi chahiye.
\`\`\``,

    content: `## Compute is a spectrum, not a menu

Cloud compute options form a continuous spectrum defined by one axis: how much of the stack the provider runs versus how much you run. At one end you rack your own hardware; at the other you upload a single function and never think about a machine again. Every option in between trades some control and flexibility for less operational work and a different cost model. There is no single best point — the right one depends on the workload.

## Virtual machines

A VM — EC2, Azure Virtual Machine, Compute Engine — is a whole machine with an operating system you fully control. You can run anything: stateful databases, GPU workloads, software with unusual kernel requirements, licensed applications that must run on a "real" host, legacy systems that were never containerised. In exchange, everything above the hypervisor is yours: OS patching and hardening, the runtime, monitoring agents, log shipping, and scaling (usually via an autoscaling group). You are billed for every second or hour the instance is running whether it is serving traffic or sitting idle at 3 am. A VM boots in roughly thirty to sixty seconds, which sets how fast you can scale out. VMs are the right choice when the workload needs the operating system itself, needs to be stateful, or is something that simply does not fit a higher abstraction.

## Containers

A container packages an application with its dependencies into an image that runs identically anywhere. An orchestrator schedules containers onto compute and handles restarts, rollouts, and service discovery (Modules 5-9). In the cloud there are two ways to get the compute underneath:

- **On your own nodes**: ECS on EC2, EKS, AKS, or GKE Standard. The provider runs the orchestrator control plane; you run and patch the worker nodes, choose their instance types, and manage their capacity and version upgrades. You get tight bin-packing (many containers per node), full control over the node environment, and the ability to run privileged or special workloads.
- **Serverless containers**: Fargate, EKS with automatic compute, AKS virtual nodes, Cloud Run, Azure Container Apps, GKE Autopilot. You give the platform a container image and a CPU/memory size per task, and it runs that task on infrastructure you never see. No node patching, no capacity planning, no cluster upgrades. You give up bin-packing efficiency (you pay for the size you request per task, not the utilisation of a shared node) and a little low-level control.

Containers are the default for most stateless services, anything already containerised, and microservice architectures. Serverless-container platforms are the right starting point unless you specifically need node-level control or the cost efficiency of packing many workloads onto shared nodes.

## Platform as a Service

A PaaS — Elastic Beanstalk, AWS App Runner, Azure App Service, Google App Engine (and Cloud Run straddles PaaS and serverless containers) — takes application code or a container image and runs everything below it: it builds the artifact, provisions the OS and runtime, deploys, handles TLS, and autoscales, often with a health-check-gated rolling deploy built in. For a standard long-running web application or API this is the least operational work of any option. The constraints are that you work within the platform\'s supported runtimes and versions, its deployment model, and its opinions, and you have less visibility into and control over the underlying infrastructure. PaaS is the right choice when you want to write and ship application code and not operate infrastructure, and your application fits a conventional web-service shape.

## Functions

A function — Lambda, Azure Functions, Google Cloud Functions, Cloud Run functions — is a single handler that runs in response to an event: an HTTP request through an API gateway, a message on a queue, a new object in a bucket, a scheduled timer, a record on a stream. The platform runs zero instances of your function when nothing is calling it and scales to thousands of concurrent executions automatically when load arrives. You pay per invocation plus GB-seconds of compute time, and **nothing at all when the function is idle** — which makes functions extremely cheap for spiky or low-volume workloads.

The constraints are real and shape what functions are good for:

- **Execution time cap** — Lambda allows up to 15 minutes per invocation; a long batch job does not fit.
- **Memory and package-size limits**, an ephemeral \`/tmp\` and no persistent local state — a function cannot hold a large in-memory cache or write files that survive.
- **Cold starts** — when a function is invoked after being idle, or when the platform spins up a new concurrent instance during a scale-up, that invocation pays the initialisation cost: loading the runtime, your code, and your dependencies, and running any top-level setup. This ranges from around 100 ms for a small function to one or two seconds or more for a large one on a heavy runtime, and it appears as tail latency on the affected requests. Provisioned concurrency (keeping N instances warm) mitigates it at a cost.

Functions are the right choice for event handlers, integration glue between services, scheduled jobs, APIs with spiky or low traffic, and fan-out processing where each item is independent.

## Choosing

Work down a short list of questions. Does the workload need the operating system itself, a specific kernel feature, a GPU, or to be stateful? Then it is a VM. Is it event-driven, spiky, or idle most of the time, and does each unit of work finish quickly? Then it is a function. Is it a standard long-running web application and you would rather not operate infrastructure at all? Then it is a PaaS. Otherwise — which covers the majority of services — it is a container, in the serverless flavour unless you specifically need the control or bin-packing of managing your own nodes.

Two workloads in the same system often land in different places: the customer-facing API on serverless containers, a nightly report as a scheduled function, a machine-learning training job on a GPU VM, the marketing site on a PaaS. The spectrum is a per-workload decision, not a per-company one.`,

    contentHi: `## Compute ek spectrum hai, ek menu nahi

Cloud compute options ek continuous spectrum banate hain ek axis se defined: provider stack ka kitna chalata hai versus aap kitna chalate ho. Ek end par aap apna hardware rack karte ho; doosre par aap ek single function upload karte ho aur phir kabhi ek machine ke baare mein nahi sochte. Beech ka har option kuch control aur flexibility ko kam operational work aur ek alag cost model ke liye trade karta hai.

## Virtual machines

Ek VM — EC2, Azure Virtual Machine, Compute Engine — ek poori machine hai ek OS ke saath jise aap fully control karte ho. Aap kuch bhi run kar sakte ho: stateful databases, GPU workloads, unusual kernel requirements wala software, licensed applications. Exchange mein, hypervisor ke upar sab kuch aapka hai: OS patching aur hardening, runtime, monitoring agents, log shipping, aur scaling. Aap har second ya hour ke liye billed ho jab instance run karta hai chahe ye traffic serve kar raha ho ya 3 am par idle baitha ho. Ek VM roughly tees se saath second mein boot hota hai. VMs sahi choice hain jab workload ko OS khud, stateful hone, ya kuch jo simply ek higher abstraction fit nahi karta ki zaroorat hai.

## Containers

Ek container ek application ko iski dependencies ke saath ek image mein package karta hai jo har jagah identically run karta hai. Cloud mein neeche compute paane ke do tarike hain:
- **Apne nodes par**: ECS on EC2, EKS, AKS, ya GKE Standard. Provider orchestrator control plane chalata hai; aap worker nodes chalate aur patch karte ho. Aapko tight bin-packing milta hai, node environment par full control.
- **Serverless containers**: Fargate, Cloud Run, Azure Container Apps, GKE Autopilot. Aap platform ko ek container image aur ek CPU/memory size per task dete ho. Koi node patching nahi, koi capacity planning nahi. Aap bin-packing efficiency de dete ho.

Containers zyadaatar stateless services ke liye default hain. Serverless-container platforms sahi starting point hain jab tak aapko specifically node-level control nahi chahiye.

## Platform as a Service

Ek PaaS — Elastic Beanstalk, AWS App Runner, Azure App Service, Google App Engine — application code ya ek container image leta hai aur uske neeche sab kuch chalata hai: ye artifact build karta hai, OS aur runtime provision karta hai, deploy karta hai, TLS handle karta hai, aur autoscale karta hai. Ek standard long-running web application ke liye ye kisi bhi option ka sabse kam operational work hai. Constraints ye hain ki aap platform ke supported runtimes ke andar kaam karte ho.

## Functions

Ek function — Lambda, Azure Functions, Google Cloud Functions — ek single handler hai jo ek event ke response mein run karta hai. Platform aapke function ke zero instances chalata hai jab kuch ise call nahi kar raha aur automatically hazaron concurrent executions tak scale karta hai. Aap per invocation plus GB-seconds pay karte ho, aur **jab function idle hai to bilkul kuch nahi**.

Constraints real hain:
- **Execution time cap** — Lambda per invocation 15 minute tak allow karta hai.
- **Memory aur package-size limits**, ek ephemeral \`/tmp\` aur koi persistent local state nahi.
- **Cold starts** — jab ek function idle hone ke baad invoke hota hai, wo invocation initialisation cost pay karta hai: runtime, aapka code, aur aapki dependencies load karna. Ye ~100 ms se ek ya do second ya zyada tak range karta hai.

Functions event handlers, integration glue, scheduled jobs, spiky ya low traffic wali APIs ke liye sahi choice hain.

## Choosing

Questions ki ek short list neeche kaam karo. Kya workload ko OS khud, ek specific kernel feature, ek GPU, ya stateful hone ki zaroorat hai? Phir ye ek VM hai. Kya ye event-driven, spiky, ya zyadaatar samay idle hai? Phir ye ek function hai. Kya ye ek standard long-running web application hai aur aap infra bilkul nahi operate karna chahte? Phir ye ek PaaS hai. Otherwise — jo majority services cover karta hai — ye ek container hai, serverless flavour mein jab tak aapko specifically apne nodes manage karne ka control nahi chahiye.`,

    examples: [
      {
        title: 'The same "resize an uploaded image" job, priced four ways',
        titleHi: 'Wahi "ek uploaded image resize karo" job, chaar tarah se priced',
        code: `# WORKLOAD: resize images on upload. ~50,000 uploads/day, bursty (most between
# 18:00-23:00), each resize ~400ms of CPU. NOT latency-critical (async is fine).

OPTION A - a VM running a worker (t3.medium, on 24/7)
  ~730 hrs/mo x $0.0416       = ~$30/mo   + you patch it, monitor it, scale it
  utilisation: ~9%  (50k x 0.4s = 5.5 hrs of actual work in 730 paid hrs)

OPTION B - ECS Fargate service, min 1 task 0.25vCPU/0.5GB, autoscale to 4
  ~1 task-month baseline + bursts  = ~$12-18/mo   no node patching
  still paying for the baseline task overnight when there are ~0 uploads

OPTION C - AWS Lambda, 512MB, triggered by an S3 upload event
  50k/day x 30 = 1.5M invocations/mo
  1.5M x $0.0000002 (req)                    = $0.30
  1.5M x 0.5s x 512MB x $0.0000166667 (GB-s) = ~$6.40
  total ~$7/mo, $0 when idle, scales to the evening burst automatically
  cold start ~300ms on the first calls of a burst - fine for an async resize

OPTION D - App Runner / App Service (a small web service doing resizes)
  ~$25-40/mo for a min instance kept warm + autoscale
  overkill: this isn't a web app, it's an event handler`,
        output: `For THIS workload - event-triggered, bursty, sub-second units, latency-tolerant -
the FUNCTION (Option C) wins on cost (~$7 vs ~$30), on ops (no servers), and on
scaling (0 -> burst -> 0 automatically). The VM's 9% utilisation is the tell: you
are paying for 730 hours to do 5.5 hours of work. Change the shape - make each job
20 minutes of CPU, or make it latency-critical at steady high volume - and the
answer moves toward a container or a VM.`,
        explain: 'A single well-defined workload — resizing uploaded images, fifty thousand a day, bursty in the evening, sub-second per job, tolerant of a little latency — is costed on four compute models. A dedicated VM worker costs about thirty dollars a month and runs at nine percent utilisation, because fifty thousand resizes at four hundred milliseconds each is only five and a half hours of actual work spread across the seven hundred and thirty hours you pay for. A Fargate service is cheaper and removes node patching but still bills for a baseline task overnight when almost nothing is happening. A Lambda function triggered directly by the upload event costs about seven dollars a month, charges nothing when idle, and scales into the evening burst and back down on its own; a three-hundred-millisecond cold start on the first few calls of a burst is irrelevant for an asynchronous resize. A PaaS web service is the wrong shape entirely — this is an event handler, not a web app. The function wins here on all three axes that matter. The final point is the important one: this answer is specific to the workload\'s shape. Make each job twenty minutes of CPU and the execution cap rules Lambda out; make it a steady high-volume latency-critical path and a warm container or VM becomes cheaper and more predictable.',
        explainHi: 'Ek single well-defined workload — uploaded images resize karna, ek din pachas hazaar, shaam mein bursty, per job sub-second, thodi latency tolerant — chaar compute models par costed hai. Ek dedicated VM worker ek mahine lagbhag tees dollar cost karta hai aur nau percent utilisation par run karta hai, kyunki chaar sau millisecond par pachas hazaar resizes sirf saade paanch ghante ka actual work hai. Ek Fargate service sasta hai par abhi bhi ek baseline task ke liye bill karta hai raat mein jab lagbhag kuch nahi ho raha. Ek Lambda function jo directly upload event dwara triggered hai ek mahine lagbhag saat dollar cost karta hai, idle hone par kuch nahi charge karta, aur shaam ke burst mein scale karta hai. Function yahaan un teenon axes par jeetta hai jo matter karte hain. Final point important hai: ye answer workload ke shape ke specific hai.',
      },
      {
        title: 'Cold starts: where they hurt, where they do not, and the AWS/Azure knobs',
        titleHi: 'Cold starts: kahaan chubhte hain, kahaan nahi, aur AWS/Azure knobs',
        code: `# a "cold start" = an invocation that lands on a fresh execution environment and
# must load the runtime + your code + deps + run top-level init before your handler.

TYPICAL COLD-START ADD-ON LATENCY (very rough):
  small function, light runtime (Node/Python, few deps)    ~100-300 ms
  large deps / heavy framework / VPC-attached (old)        ~500 ms - 2 s
  JVM / .NET without tuning                                ~1 - 4 s

WHERE IT HURTS:
  - a synchronous user-facing API at low/spiky traffic: the p99 request that hits
    a cold start feels slow. every scale-up event adds more cold starts.
WHERE IT DOESN'T:
  - async work (queue/stream/S3 event): a 300ms cold start on a background resize
    is invisible.
  - steady high traffic: environments stay warm; cold starts are a tiny fraction.

MITIGATIONS:
  AWS Lambda:
    - Provisioned Concurrency: keep N envs initialised + warm (you pay for them)
    - SnapStart (Java, .NET, Python): snapshot the initialised env, restore fast
    - smaller deploy package, lazy-load heavy SDK clients, more memory (= more CPU
      during init), stay OUT of a VPC unless you need it (or use the modern fast ENI)
  Azure Functions:
    - Premium plan / Dedicated plan: pre-warmed instances, no scale-to-zero
    - "Always Ready" instances on the Flex Consumption plan
  Google Cloud Run / Functions:
    - min-instances = 1 (or more): keep that many warm`,
        output: `Rule of thumb: on the ASYNC and STEADY-HIGH-VOLUME paths, ignore cold starts.
On a SYNCHRONOUS, SPIKY, USER-FACING path where tail latency matters, either pay
for warm capacity (Provisioned Concurrency / Premium plan / min-instances) or
don't use a function there - a small always-on container has no cold start.`,
        explain: 'A cold start is the extra latency an invocation pays when it lands on a freshly created execution environment that must load the runtime, the function code, its dependencies, and run any top-level initialisation before the handler executes. The magnitude varies widely: a small Node or Python function with few dependencies adds a hundred to three hundred milliseconds, a large one or a JVM function without tuning can add one to four seconds. Whether that matters is entirely about the invocation path. On a synchronous user-facing API with low or spiky traffic, the requests unlucky enough to trigger a cold start show up as slow p99s, and every scale-up event creates more of them. On asynchronous work — a queue consumer, a stream processor, an object-created handler — a few hundred milliseconds of cold start is completely invisible. On steady high-volume traffic the environments stay warm and cold starts are a rounding error. The mitigations differ by platform but share a theme: pay to keep some capacity warm. AWS offers Provisioned Concurrency and SnapStart; Azure offers Premium and Flex Consumption "always ready" instances; Google Cloud Run and Functions take a min-instances setting. The decision rule is simple — ignore cold starts on async and steady paths, and on a spiky synchronous path either pay for warm capacity or put a small always-on container there instead.',
        explainHi: 'Ek cold start wo extra latency hai jo ek invocation pay karta hai jab ye ek freshly created execution environment par land karta hai jise handler execute hone se pehle runtime, function code, iski dependencies, aur koi top-level initialisation load karna hai. Magnitude widely vary karta hai: kuch dependencies wala ek chhota Node ya Python function sau se teen sau millisecond add karta hai, ek badha ya bina tuning ke ek JVM function ek se chaar second add kar sakta hai. Kya ye matter karta hai poori tarah invocation path ke baare mein hai. Ek synchronous user-facing API par low ya spiky traffic ke saath, jo requests cold start trigger karne ke liye unlucky hain wo slow p99s ke roop mein dikhti hain. Async work par — ek queue consumer, ek stream processor — kuch sau millisecond cold start poori tarah invisible hai. Mitigations platform se differ karti hain par ek theme share karti hain: kuch capacity warm rakhne ke liye pay karo.',
      },
    ],

    mistakes: [
      {
        wrong: `# forcing a long batch job into a function because "serverless is cheaper"
# Lambda handler that: pulls 2M rows, transforms them, writes a 4GB export file
#   - hits the 15-minute execution cap at ~1.1M rows -> the invocation is killed
#   - can't hold 4GB: /tmp is 512MB-10GB and ephemeral, memory caps at 10GB
#   - so you shard it into 40 Lambdas + a coordinator + a state machine + retries
#     + partial-failure handling ... to avoid running one container for 25 minutes`,
        right: `# match the runtime to the job's shape:
#   - a 25-minute batch job -> ECS/Fargate task, AWS Batch, or a Kubernetes Job.
#     runs to completion, no time cap, gigabytes of scratch space, one retry unit.
#     $ aws ecs run-task ... (or a scheduled EventBridge -> ECS task)
#   - Azure: a Container Apps job, an ACI container group, or an AKS Job
#   - keep the FUNCTION for the part that IS event-shaped: "on export-complete,
#     notify the user" is a fine 200ms Lambda.
# serverless functions are for short, event-triggered units - not a general
# compute platform you bend long jobs to fit.`,
        why: 'Functions are optimised for short, event-triggered units of work, and they enforce that with hard limits: a maximum execution time (15 minutes on Lambda), a memory ceiling, a bounded and ephemeral local filesystem, and no durable local state. A long batch job — pulling millions of rows, doing a large transform, producing a multi-gigabyte artifact — violates all of these. Pushing it into a function anyway means either it is killed mid-run at the time cap, or you decompose it into dozens of coordinated function invocations with a state machine, a coordinator, retry logic, and partial-failure handling, building a distributed system to avoid running a single container for twenty-five minutes. The correct tool for a job that runs to completion, needs unbounded time, and wants gigabytes of scratch space is a container task — Fargate, AWS Batch, a Kubernetes Job, an Azure Container Apps job — triggered on a schedule or by an event, which runs as one unit with one retry boundary. Functions still fit the genuinely event-shaped pieces around the batch job: "when the export finishes, send the notification" is a perfectly good short function. The mistake is treating FaaS as a general compute platform rather than as an event-handler runtime.',
        whyHi: 'Functions short, event-triggered units of work ke liye optimised hain, aur wo ise hard limits ke saath enforce karti hain: ek maximum execution time (Lambda par 15 minute), ek memory ceiling, ek bounded aur ephemeral local filesystem, aur koi durable local state nahi. Ek long batch job — millions of rows pull karna, ek large transform karna, ek multi-gigabyte artifact produce karna — in sab ka violation karta hai. Ise phir bhi ek function mein push karne ka matlab ya to ye time cap par mid-run kill ho jaata hai, ya aap ise dozens coordinated function invocations mein decompose karte ho ek state machine ke saath. Ek job ke liye sahi tool jo completion tak run karta hai ek container task hai — Fargate, AWS Batch, ek Kubernetes Job. Functions abhi bhi genuinely event-shaped pieces fit karti hain.',
      },
      {
        wrong: `# reaching for a self-managed Kubernetes cluster to run three stateless services
# a 4-person team stands up EKS: a control plane, 3 node groups, the VPC CNI, an
# ingress controller, cluster-autoscaler, metrics-server, cert-manager, ArgoCD,
# node AMI patching, K8s version upgrades every ~4 months, an on-call rotation for
# the cluster itself ... to run 3 containers that get ~20 req/s.`,
        right: `# pick the abstraction that matches the team size and the workload:
#   3 stateless HTTP services, low traffic, small team ->
#     AWS: App Runner or ECS Fargate (no cluster, no nodes, deploy an image)
#     Azure: Container Apps      GCP: Cloud Run
#   you get: rolling deploys, autoscaling, TLS, revisions, scale-to-low - and you
#   patch NOTHING. move to EKS/AKS later IF you hit a real need (100s of services,
#   complex networking, operators, multi-tenant platform).
# Kubernetes is a platform to BUILD platforms on. a small product team usually
# wants a platform someone else operates.`,
        why: 'Kubernetes is a powerful, general orchestration platform, and running it yourself — even the managed-control-plane versions like EKS and AKS — brings a substantial permanent operational load: worker-node OS patching, cluster version upgrades every few months, the networking layer, an ingress controller, autoscaling components, certificate management, a deployment tool, and an on-call rotation for the cluster itself, separate from the applications. That load is worth carrying when you are running a large fleet of services, need complex networking or custom operators, or are building an internal platform for many teams. For a small team running a handful of stateless HTTP services at modest traffic, it is enormous overhead for no benefit: a serverless container platform — App Runner, ECS Fargate, Azure Container Apps, Cloud Run — gives you rolling deployments, autoscaling, TLS, revisions, and scale-to-low from a single container image, while patching and upgrading nothing. The right move is to start at the highest abstraction that fits and move down to Kubernetes only when a concrete need forces it. Kubernetes is a platform for building platforms; a small product team usually wants a platform someone else operates.',
        whyHi: 'Kubernetes ek powerful, general orchestration platform hai, aur ise khud chalana — even managed-control-plane versions jaise EKS aur AKS — ek substantial permanent operational load laata hai: worker-node OS patching, har kuch mahine cluster version upgrades, networking layer, ek ingress controller, autoscaling components, certificate management, ek deployment tool, aur cluster khud ke liye ek on-call rotation. Wo load carry karne layak hai jab aap services ka ek large fleet chala rahe ho. Ek small team ke liye jo modest traffic par kuch stateless HTTP services chala rahi hai, ye no benefit ke liye enormous overhead hai: ek serverless container platform — App Runner, ECS Fargate, Azure Container Apps, Cloud Run — aapko rolling deployments, autoscaling, TLS, revisions deta hai, jabki kuch bhi patch aur upgrade nahi karta.',
      },
      {
        wrong: `# putting a stateful workload on a function or a stateless-container platform
# a Lambda that "caches" a big lookup table in a module-level global
#   -> works on a warm instance, cold instances rebuild it (slow), and there are
#      dozens of instances each with their own copy, none shared, none consistent
# OR: a WebSocket server on Cloud Run with the default request-scoped model
#   -> connections drop on scale-in; no sticky routing; no shared connection state`,
        right: `# stateful needs -> a stateful home:
#   - shared cache            -> ElastiCache / Azure Cache for Redis / Memorystore
#   - a big lookup table      -> a DB or Redis, read on each invocation (or DAX-style)
#   - long-lived connections  -> a container platform WITH connection support
#     (Cloud Run now supports WebSockets/session affinity; ECS/EKS behind an ALB/NLB;
#      or API Gateway WebSocket + Lambda where each message is a fresh event)
#   - a database               -> a managed DB service, never a function's /tmp
# functions and stateless-container platforms assume: no durable local state,
# instances come and go, nothing is shared between them. design for that.`,
        why: 'Functions and stateless-container platforms are built on an explicit assumption: any given instance is temporary, instances scale up and down constantly, and nothing is shared between them. Local memory and local disk on one instance are private to that instance and vanish when it is recycled. Building anything that depends on durable local state or on state shared across instances violates that model in ways that appear to work in testing and fail under load. A lookup table cached in a module global is rebuilt on every cold instance and exists as dozens of independent, potentially inconsistent copies. A connection-oriented server — WebSockets, long-polling, streaming — loses connections every time the platform scales in, and has no way to route a client back to the instance holding its session. The fix is to put state where state belongs: a shared cache in a managed Redis service, a lookup table in a database or Redis read per invocation, long-lived connections on a platform that explicitly supports them (modern Cloud Run with session affinity, containers behind a network load balancer, or an API Gateway WebSocket front-end that turns each message into a discrete event for a function). Match the statefulness of the workload to the statefulness the platform actually provides.',
        whyHi: 'Functions aur stateless-container platforms ek explicit assumption par built hain: koi bhi given instance temporary hai, instances constantly scale up aur down hote hain, aur unke beech kuch share nahi hai. Ek instance par local memory aur local disk us instance ke private hain aur gayab ho jaate hain jab ise recycle kiya jaata hai. Kuch bhi build karna jo durable local state ya instances ke across shared state par depend karta hai us model ka violation karta hai. Ek module global mein cached ek lookup table har cold instance par rebuild hota hai aur dozens independent copies ke roop mein exist karta hai. Ek connection-oriented server har baar connections khota hai jab platform scale in karta hai. Fix state ko wahaan rakhna hai jahaan state belong karta hai: ek managed Redis service mein ek shared cache, ek database mein ek lookup table.',
      },
    ],

    realWorld: [
      {
        en: '**A VM at 6% utilisation** — an image-processing worker ran on a `c5.xlarge` 24/7 for two years. Actual CPU work was ~40 minutes a day. Moved to Lambda triggered by the S3 event: cost dropped from ~$125/mo to ~$9/mo, and the "scale the worker fleet for the evening spike" runbook was deleted.',
        hi: '**Ek VM 6% utilisation par** — ek image-processing worker do saal ke liye 24/7 ek `c5.xlarge` par chala. Actual CPU work ek din ~40 minute tha. S3 event dwara triggered Lambda par move kiya: cost ~$125/mo se ~$9/mo tak gira.',
      },
      {
        en: '**EKS for three services** — a seed-stage team spent ~30% of eng time operating a self-run cluster (upgrades, node issues, an ingress migration) to run three low-traffic APIs. Migrated to Cloud Run in a sprint; the cluster on-call rotation ended and deploy time dropped from 9 minutes to 90 seconds.',
        hi: '**Teen services ke liye EKS** — ek seed-stage team ne ~30% eng time ek self-run cluster operate karne mein bitaya teen low-traffic APIs chalane ke liye. Ek sprint mein Cloud Run par migrate kiya; cluster on-call rotation khatam hua.',
      },
      {
        en: '**The 15-minute wall** — a nightly reconciliation job was a Lambda that grew past 15 minutes as data volume rose. It was re-architected into 30 sharded Lambdas + a Step Function + DynamoDB checkpoints over three weeks. A later rewrite as a single Fargate task (55 minutes, one retry) deleted all of that machinery.',
        hi: '**15-minute wall** — ek nightly reconciliation job ek Lambda tha jo data volume badhne par 15 minute se aage badh gaya. Ise 30 sharded Lambdas + ek Step Function mein re-architect kiya gaya. Baad mein ek single Fargate task ke roop mein ek rewrite ne wo saari machinery delete kar di.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the compute spectrum from VM to function. What does each step trade away and gain?',
        qHi: 'VM se function tak compute spectrum walk karo. Har step kya trade karta hai aur gain karta hai?',
        a: 'The spectrum runs from a raw VM, where you control the whole stack above the hypervisor, to a function, where you upload one handler and think about no infrastructure at all. A VM gives you full OS control and the ability to run anything — stateful, GPU, unusual kernels, licensed software — in exchange for owning OS patching, hardening, the runtime, monitoring, and scaling, and paying for the instance whether it is busy or idle. A container packages the app and its dependencies and is run by an orchestrator; on your own nodes you still manage and patch workers and get tight bin-packing and full node control, while serverless container platforms like Fargate and Cloud Run run the nodes for you, removing node operations at the cost of bin-packing efficiency and a little low-level control. A PaaS takes code or an image and runs everything below it — build, OS, runtime, deploy, TLS, autoscaling — which is the least operational work for a standard web app, in exchange for living within the platform\'s supported runtimes and reduced infrastructure visibility. A function runs a single handler on an event, scales from zero to thousands automatically, and costs nothing when idle, in exchange for hard limits — a 15-minute execution cap, memory and package limits, ephemeral local storage, no durable local state — and cold-start latency on invocations that hit a fresh environment. Each step trades control and flexibility for less operational burden and a more usage-proportional cost model.',
        aHi: 'Spectrum ek raw VM se chalta hai, jahaan aap hypervisor ke upar poora stack control karte ho, ek function tak, jahaan aap ek handler upload karte ho aur kisi infrastructure ke baare mein bilkul nahi sochte. Ek VM aapko full OS control aur kuch bhi run karne ki ability deta hai — stateful, GPU, unusual kernels — exchange mein OS patching, hardening, runtime, monitoring, aur scaling own karne ke liye, aur instance ke liye pay karne ke liye chahe ye busy ho ya idle. Ek container app aur iski dependencies package karta hai; apne nodes par aap abhi bhi workers manage aur patch karte ho, jabki serverless container platforms nodes aapke liye chalate hain. Ek PaaS code ya ek image leta hai aur uske neeche sab kuch chalata hai. Ek function ek event par ek single handler chalata hai, 0 se hazaron scale karta hai, aur idle hone par kuch cost nahi karta, exchange mein hard limits aur cold-start latency ke liye.',
      },
      {
        q: 'What are cold starts, when do they matter, and how do you deal with them?',
        qHi: 'Cold starts kya hain, kab matter karte hain, aur aap unse kaise deal karte ho?',
        a: 'A cold start is the extra latency an invocation pays when it lands on a freshly created execution environment that has to load the runtime, your function code, its dependencies, and run any top-level initialisation before the handler runs. It ranges from around a hundred milliseconds for a small function on a light runtime to one to four seconds for a large function or an untuned JVM. It matters only on certain paths. On a synchronous user-facing API with low or spiky traffic, the requests that trigger a cold start show up as slow p99s, and every scale-up event adds more, so tail latency degrades noticeably. On asynchronous work — a queue consumer, a stream processor, an object-created handler — a few hundred milliseconds is invisible. On steady high-volume traffic, environments stay warm and cold starts are a rounding error. To deal with it: on async and steady paths, ignore it. On a spiky synchronous path where tail latency matters, either pay to keep capacity warm — AWS Provisioned Concurrency or SnapStart, Azure Premium or Flex Consumption "always ready" instances, Cloud Run min-instances — or do not use a function there and run a small always-on container instead, which has no cold start. Secondary mitigations: smaller deploy packages, lazy-loading heavy SDK clients, more memory (which also increases init CPU), and staying out of a VPC unless required.',
        aHi: 'Ek cold start wo extra latency hai jo ek invocation pay karta hai jab ye ek freshly created execution environment par land karta hai jise handler run hone se pehle runtime, aapka function code, iski dependencies, aur koi top-level initialisation load karna hai. Ye ek light runtime par ek chhote function ke liye lagbhag sau millisecond se ek badhe function ya ek untuned JVM ke liye ek se chaar second tak range karta hai. Ye sirf certain paths par matter karta hai. Ek synchronous user-facing API par low ya spiky traffic ke saath, jo requests cold start trigger karti hain wo slow p99s ke roop mein dikhti hain. Async work par kuch sau millisecond invisible hai. Steady high-volume traffic par, environments warm rehte hain. Isse deal karne ke liye: async aur steady paths par, ise ignore karo. Ek spiky synchronous path par, ya to capacity warm rakhne ke liye pay karo — AWS Provisioned Concurrency, Azure Premium, Cloud Run min-instances — ya wahaan ek function use mat karo.',
      },
      {
        q: 'How do you decide between a container platform and a function for a given service?',
        qHi: 'Ek given service ke liye aap ek container platform aur ek function ke beech kaise decide karte ho?',
        a: 'I start by ruling things in and out. If the service needs the operating system itself, a kernel feature, a GPU, or has to be stateful, it is a VM, not either of these. If it is a standard long-running web application and the team would rather not operate infrastructure at all, a PaaS is the least work. Between a function and a container platform, the deciding factors are the shape of the work and the traffic. A function fits when the work is genuinely event-driven — an HTTP request, a queue message, an object upload, a timer, a stream record — each unit finishes quickly and well within the execution cap, there is no need for durable local state or large in-memory data, and the traffic is spiky or low-volume so that scaling to zero and paying nothing when idle is a real saving. A container platform fits when the work is long-running or exceeds function limits, needs persistent connections or shared in-memory state, runs at steady high volume where warm capacity is cheaper than per-invocation pricing and cold starts would be a constant tax, or simply is not naturally event-shaped. Serverless container platforms — Fargate, Cloud Run, Container Apps — are the sensible default for most services because they remove node operations while keeping the container model; you move to self-managed Kubernetes only when scale, networking complexity, or a platform-for-many-teams need justifies the operational load.',
        aHi: 'Main cheezon ko rule in aur out karke shuru karta hoon. Agar service ko OS khud, ek kernel feature, ek GPU, ya stateful hone ki zaroorat hai, ye ek VM hai. Agar ye ek standard long-running web application hai aur team infra bilkul nahi operate karna chahti, ek PaaS sabse kam work hai. Ek function aur ek container platform ke beech, deciding factors work ka shape aur traffic hain. Ek function fit karta hai jab work genuinely event-driven hai — ek HTTP request, ek queue message, ek object upload, ek timer — har unit jaldi khatam hota hai aur execution cap ke andar, koi durable local state ki zaroorat nahi, aur traffic spiky ya low-volume hai. Ek container platform fit karta hai jab work long-running hai ya function limits exceed karta hai, persistent connections ya shared in-memory state chahiye, steady high volume par run karta hai, ya simply naturally event-shaped nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out the compute spectrum with AWS and Azure names for each point, and what you own versus what the provider owns at each.',
        taskHi: 'Ek comment mein, compute spectrum layout karo har point ke liye AWS aur Azure names ke saath.',
        hint: 'THE SPECTRUM (more control + more ops on the left): BARE METAL → VM → CONTAINER (your nodes) → CONTAINER (serverless) → PaaS → FUNCTION. VM / IaaS — AWS EC2, Azure Virtual Machines, GCP Compute Engine: you own the OS + up (patching, hardening, runtime, app, scaling, network rules); provider owns virtualisation + down. Billed per second/hour running (busy OR idle); boots ~30-60 s. For: stateful, GPU, unusual kernels, licensed software, un-containerised legacy. CONTAINER ON YOUR NODES — AWS ECS-on-EC2 / EKS, Azure AKS, GCP GKE Standard: you own the image + worker-node OS + capacity + K8s version upgrades; provider owns the control plane. Tight bin-packing, full node control. CONTAINER SERVERLESS — AWS Fargate, Azure Container Apps, GCP Cloud Run / GKE Autopilot: you give an image + CPU/memory per task; provider runs the nodes (no patching, no capacity planning). You lose bin-packing efficiency + a little low-level control. PaaS — AWS Elastic Beanstalk / App Runner, Azure App Service, GCP App Engine: push code or an image; provider builds, provisions OS + runtime, deploys, does TLS + autoscaling. Least ops for a standard web app; constrained to the platform\'s supported runtimes + deploy model + reduced infra visibility. FUNCTION / FaaS — AWS Lambda, Azure Functions, GCP Cloud Functions: one handler on an event; scales 0 → thousands; $0 when idle. Hard limits: 15-min exec cap (Lambda), memory + package-size caps, ephemeral `/tmp`, no durable local state, COLD STARTS. AT EVERY TIER THE CUSTOMER STILL OWNS: the data, IAM, and correct configuration (Lesson 1).',
        hintHi: 'SPECTRUM (baaen par zyada control + zyada ops): BARE METAL → VM → CONTAINER (aapke nodes) → CONTAINER (serverless) → PaaS → FUNCTION. VM / IaaS — AWS EC2, Azure VMs, GCP Compute Engine: aap OS + upar own karte ho; provider virtualisation + neeche. Per second/hour billed (busy YA idle). CONTAINER AAPKE NODES PAR — ECS-on-EC2 / EKS, AKS, GKE Standard: aap image + worker-node OS + version upgrades own karte ho. CONTAINER SERVERLESS — Fargate, Container Apps, Cloud Run / GKE Autopilot: aap image + CPU/memory dete ho; provider nodes chalata hai. PaaS — Elastic Beanstalk / App Runner, App Service, App Engine: code push karo; provider build, OS + runtime, deploy, TLS + autoscaling karta hai. FUNCTION — Lambda, Azure Functions, Cloud Functions: ek handler ek event par; 0 → hazaron scale; idle par $0. Hard limits: 15-min cap, COLD STARTS. HAR TIER PAR CUSTOMER data, IAM, aur sahi configuration own karta hai.',
      },
      {
        task: 'In a comment, explain cold starts fully: what causes them, typical magnitudes, the three path types, and the AWS/Azure/GCP mitigations.',
        taskHi: 'Ek comment mein, cold starts poori tarah samjhao.',
        hint: 'COLD START = an invocation that lands on a FRESH execution environment and must, before your handler runs: (a) provision the micro-VM/container, (b) load the runtime, (c) load your function code + dependencies, (d) run any top-level (module-scope / static / constructor) initialisation. Happens on the first call after idle AND on every new concurrent instance the platform spins up during a scale-up. TYPICAL MAGNITUDE: small Node/Python, few deps ~100-300 ms; large deps / heavy framework / (old) VPC-attached ~500 ms - 2 s; untuned JVM / .NET ~1-4 s. THREE PATH TYPES: (1) SYNCHRONOUS user-facing API, low/spiky traffic → HURTS: the p99 request that hits a cold start feels slow; every scale-up adds more. (2) ASYNCHRONOUS (queue / stream / object-event) → DOESN\'T HURT: a 300 ms cold start on a background job is invisible. (3) STEADY HIGH VOLUME → DOESN\'T HURT: environments stay warm, cold starts are a tiny fraction. MITIGATIONS — AWS Lambda: Provisioned Concurrency (keep N envs warm, you pay), SnapStart (Java/.NET/Python — snapshot the initialised env, restore fast), smaller package, lazy-load SDK clients, more memory (= more init CPU), stay out of a VPC unless needed. Azure Functions: Premium / Dedicated plan (pre-warmed, no scale-to-zero), "Always Ready" instances on Flex Consumption. GCP Cloud Run / Functions: `min-instances >= 1`. RULE OF THUMB: on async + steady-high paths, ignore cold starts. On a spiky synchronous user-facing path where tail latency matters, EITHER pay for warm capacity OR don\'t use a function there — a small always-on container has no cold start.',
        hintHi: 'COLD START = ek invocation jo ek FRESH execution environment par land karta hai aur handler run hone se pehle: micro-VM provision, runtime load, aapka code + deps load, koi top-level init run. Idle ke baad pehle call par AUR har naye concurrent instance par jo platform scale-up ke dauraan spin karta hai. MAGNITUDE: chhota Node/Python ~100-300 ms; large deps / VPC ~500 ms - 2 s; untuned JVM ~1-4 s. THREE PATHS: (1) SYNCHRONOUS user-facing, low/spiky → CHUBHTA HAI; (2) ASYNCHRONOUS → NAHI; (3) STEADY HIGH VOLUME → NAHI. MITIGATIONS — AWS: Provisioned Concurrency, SnapStart, smaller package. Azure: Premium plan, "Always Ready". GCP: `min-instances >= 1`. RULE: async + steady par ignore; spiky synchronous par warm capacity ke liye pay karo ya ek always-on container use karo.',
      },
      {
        task: 'In a comment, give the ordered decision procedure for choosing a compute model, and give a concrete example of one system whose workloads land in three different places.',
        taskHi: 'Ek comment mein, ek compute model choose karne ke liye ordered decision procedure do.',
        hint: 'ORDERED DECISION (stop at the first yes): (1) Does the workload need the OS itself / a specific kernel feature / a GPU / to be genuinely STATEFUL (a database, long-lived in-memory data it owns)? → VM. (2) Is it EVENT-DRIVEN (HTTP via a gateway, a queue message, an object upload, a timer, a stream record), does each unit finish quickly and well under the execution cap, no durable local state needed, AND is traffic spiky or low-volume so scale-to-zero is a real saving? → FUNCTION. (3) Is it a standard long-running web app / API and the team would rather not operate infrastructure at all? → PaaS. (4) Otherwise (the majority of services) → CONTAINER, on a SERVERLESS platform (Fargate / Cloud Run / Container Apps) UNLESS you specifically need node-level control or the bin-packing cost efficiency of managing your own Kubernetes nodes — and you only take on self-managed K8s when scale (100s of services), networking complexity, custom operators, or a platform-for-many-teams justifies the permanent operational load. CONCRETE MULTI-PLACEMENT EXAMPLE — one e-commerce system: the customer-facing storefront API → serverless containers (Fargate / Cloud Run) — steady traffic, needs fast rolling deploys, no cold-start tax; the nightly sales-reconciliation batch (55 min, GBs of scratch) → a Fargate / Container Apps JOB or AWS Batch — exceeds the 15-min function cap; "email the customer when their order ships" → a Lambda / Cloud Function on an order-status event — pure event glue, spiky, $0 when idle; the ML product-recommendation training job → a GPU VM (or a managed training service) — needs the GPU and the OS; the static marketing site → a PaaS / static hosting + CDN. The spectrum is a PER-WORKLOAD decision, not a per-company one.',
        hintHi: 'ORDERED DECISION (pehle yes par ruko): (1) Kya workload ko OS khud / ek kernel feature / ek GPU / genuinely STATEFUL hone ki zaroorat hai? → VM. (2) Kya ye EVENT-DRIVEN hai, har unit jaldi khatam hota hai execution cap ke andar, koi durable local state nahi, AUR traffic spiky ya low-volume hai? → FUNCTION. (3) Kya ye ek standard long-running web app hai aur team infra operate nahi karna chahti? → PaaS. (4) Otherwise → CONTAINER, SERVERLESS platform par JAB TAK aapko node-level control ya bin-packing efficiency nahi chahiye. MULTI-PLACEMENT EXAMPLE — ek e-commerce system: storefront API → serverless containers; nightly batch (55 min) → Fargate JOB / AWS Batch; "order ship hone par email" → Lambda; ML training → GPU VM; static marketing site → PaaS / static hosting + CDN. Spectrum ek PER-WORKLOAD decision hai.',
      },
    ],

    keyTakeaways: [
      'Cloud compute is a SPECTRUM by one axis — how much of the stack the provider runs: BARE METAL → VM → CONTAINER (your nodes) → CONTAINER (serverless) → PaaS → FUNCTION. Each step right = less control + flexibility, less operational work, a more usage-proportional cost model. There is no single best point.',
      'VM (EC2 / Azure VM / Compute Engine): full OS control, runs anything (stateful, GPU, odd kernels, licensed software); YOU patch/harden/monitor/scale; billed running whether busy or idle. CONTAINER on your nodes (ECS-EC2/EKS/AKS/GKE Standard): you patch the worker nodes, get bin-packing + control. SERVERLESS containers (Fargate/Cloud Run/Container Apps/Autopilot): provider runs the nodes — the sensible default for most services.',
      'PaaS (Beanstalk/App Runner/App Service/App Engine): push code or an image, the platform builds + runs OS + runtime + deploy + TLS + autoscale — least ops for a standard web app, at the cost of the platform\'s supported runtimes and reduced infra visibility.',
      'FUNCTION (Lambda/Azure Functions/Cloud Functions): one handler per event, scales 0 → thousands, $0 when idle. HARD LIMITS: ~15-min execution cap, memory + package caps, ephemeral `/tmp`, no durable local state, and COLD STARTS (~100 ms small → 1-4 s untuned JVM). Cold starts hurt on synchronous spiky user-facing paths; they are invisible on async and steady-high-volume paths. Mitigate with warm capacity (Provisioned Concurrency / Premium plan / min-instances) or use an always-on container instead.',
      'CHOOSE in order: needs the OS / kernel / GPU / stateful → VM; event-driven + spiky + short units → FUNCTION; standard web app + no infra appetite → PaaS; otherwise → serverless CONTAINER. It is a PER-WORKLOAD decision — one system\'s API, nightly batch, event glue, and ML training legitimately land on four different models.',
    ],
    keyTakeawaysHi: [
      'Cloud compute ek SPECTRUM hai ek axis se — provider stack ka kitna chalata hai: BARE METAL → VM → CONTAINER (aapke nodes) → CONTAINER (serverless) → PaaS → FUNCTION. Har step daayen = kam control + flexibility, kam operational work, ek zyada usage-proportional cost model. Koi single best point nahi.',
      'VM (EC2 / Azure VM / Compute Engine): full OS control, kuch bhi chalata hai (stateful, GPU, odd kernels, licensed software); AAP patch/harden/monitor/scale; running billed chahe busy ya idle. CONTAINER aapke nodes par (ECS-EC2/EKS/AKS/GKE Standard): aap worker nodes patch karte ho. SERVERLESS containers (Fargate/Cloud Run/Container Apps): provider nodes chalata hai — zyadaatar services ke liye sensible default.',
      'PaaS (Beanstalk/App Runner/App Service/App Engine): code ya ek image push karo, platform build + OS + runtime + deploy + TLS + autoscale chalata hai — ek standard web app ke liye sabse kam ops.',
      'FUNCTION (Lambda/Azure Functions/Cloud Functions): per event ek handler, 0 → hazaron scale, idle par $0. HARD LIMITS: ~15-min execution cap, memory + package caps, ephemeral `/tmp`, koi durable local state nahi, aur COLD STARTS. Cold starts synchronous spiky user-facing paths par chubhte hain; async aur steady-high-volume paths par invisible hain. Warm capacity se mitigate karo ya ek always-on container use karo.',
      'ORDER mein CHOOSE karo: OS / kernel / GPU / stateful chahiye → VM; event-driven + spiky + short units → FUNCTION; standard web app + koi infra appetite nahi → PaaS; otherwise → serverless CONTAINER. Ye ek PER-WORKLOAD decision hai.',
    ],
  },

  {
    slug: 'ops-iam-identities-policies-and-least-privilege',
    title: 'IAM: Identities, Policies & Least Privilege',
    titleHi: 'IAM: Identities, Policies Aur Least Privilege',
    description:
      'Identity and Access Management is the control plane for everything in the cloud — every API call is authenticated as some principal and authorised against some set of policies. This lesson covers the pieces (users, groups, roles, and the policy types), how a request is evaluated (explicit deny wins, then explicit allow, else implicit deny), and least privilege as the discipline that keeps a compromise small. AWS IAM as the worked example, Entra ID plus Azure RBAC alongside.',
    descriptionHi:
      'Identity and Access Management cloud mein sab kuch ke liye control plane hai — har API call kisi principal ke roop mein authenticated hoti hai aur kisi set of policies ke against authorised hoti hai. Ye lesson pieces cover karta hai (users, groups, roles, aur policy types), ek request kaise evaluate hoti hai (explicit deny jeetta hai, phir explicit allow, warna implicit deny), aur least privilege wo discipline jo ek compromise ko chhota rakhta hai. AWS IAM worked example ke roop mein, Entra ID plus Azure RBAC alongside.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A building\'s access-card system.** People (users) carry cards; departments (groups) get a standard set of door permissions so you do not program each card by hand. Contractors and delivery staff do not get their own permanent card — they are issued a temporary badge for a specific job that expires the same day (a role you assume). Each door reader checks a rulebook: a specific "never open this door for anyone" rule always wins (explicit deny), otherwise a rule that says "this badge may open this door" lets you in (explicit allow), and a door with no rule about your badge stays locked (implicit deny). And the whole design principle is that the mailroom badge opens the mailroom and nothing else — so a lost mailroom badge is a small problem, not a building-wide one.',
      hi: '**Ek building ka access-card system.** Log (users) cards carry karte hain; departments (groups) ko ek standard set of door permissions milta hai taaki aap har card haath se program na karo. Contractors aur delivery staff ko unka apna permanent card nahi milta — unhe ek specific job ke liye ek temporary badge issue kiya jaata hai jo usi din expire hota hai (ek role jo aap assume karte ho). Har door reader ek rulebook check karta hai: ek specific "kisi ke liye kabhi ye door mat kholo" rule hamesha jeetta hai (explicit deny), warna ek rule jo kehta hai "ye badge ye door khol sakta hai" aapko andar aane deta hai (explicit allow), aur ek door bina aapke badge ke baare mein koi rule ke locked rehta hai (implicit deny). Aur poora design principle ye hai ki mailroom badge mailroom kholta hai aur kuch nahi.',
    },

    simple: `**IAM decides, for every API call: WHO is calling (authentication) and are they
ALLOWED to do this (authorisation).** Everything in the cloud goes through it.

**PRINCIPALS — the "who":**
\`\`\`
USER    a long-lived identity for a HUMAN or a legacy system. has a password
        (console) and/or access keys (API). MINIMISE these - humans should log in
        via SSO, workloads should use roles (Lesson 4).
GROUP   a bucket of users. attach policies to the GROUP, add users to it. NOT a
        principal itself - you can't "act as" a group.
ROLE    an identity with policies but NO permanent credentials. a principal
        ASSUMES it and gets short-lived temporary credentials. used by: workloads
        (an EC2 instance, a Lambda, a Pod), humans via SSO, other accounts,
        federated identities (GitHub Actions - Lesson 4).
\`\`\`

**POLICIES — the rules. JSON documents of {Effect, Action, Resource, Condition}:**
\`\`\`
IDENTITY-BASED     attached to a user/group/role: "this principal may do X on Y"
RESOURCE-BASED     attached to the resource (an S3 bucket, an SQS queue, a KMS key):
                   "principal P may do X on ME" - enables cross-account access
PERMISSION BOUNDARY a ceiling on a role/user: the MAX it can ever have, regardless
                   of its attached policies. (effective = attached AND boundary)
SCP (Org)          an account-wide ceiling set by the organisation. even the root
                   user can't exceed it. a guardrail, not a grant.
SESSION POLICY     passed at assume-role time to further shrink that session
\`\`\`

**EVALUATION — the request is DENIED unless it's explicitly allowed, and an
explicit deny always wins:**
\`\`\`
1. is there an explicit DENY that matches? (any policy type)   -> DENY. done.
2. does an SCP / permission boundary block it?                 -> DENY.
3. is there an explicit ALLOW that matches?                    -> ALLOW.
4. otherwise                                                   -> DENY (implicit).
\`\`\`
So: no allow = no access. one deny anywhere = no access.

**LEAST PRIVILEGE** — grant the minimum actions on the minimum resources for the
job, and no more. Start from nothing and add what breaks; don't start from \`*\` and
trim. Scope \`Resource\` to specific ARNs, add \`Condition\`s (source IP, MFA present,
tag match, time), split read from write. Why: a leaked credential or an exploited
workload can only do what its identity is allowed to do - least privilege is what
makes that a contained incident instead of a full breach.

**AZURE (Entra ID + Azure RBAC):**
\`\`\`
users/groups/service principals/managed identities  = principals
ROLE DEFINITION (a set of Actions/NotActions/DataActions) + ROLE ASSIGNMENT
  (principal + role definition + SCOPE: management group / subscription / RG / resource)
DENY ASSIGNMENTS = explicit deny (mostly system-managed / Blueprints)
Azure Policy = guardrails on resource config (like SCPs + Config combined)
\`\`\``,

    simpleHi: `**IAM har API call ke liye decide karta hai: KAUN call kar raha hai (authentication)
aur kya wo ye karne ke liye ALLOWED hai (authorisation).** Cloud mein sab kuch ise se guzarta hai.

**PRINCIPALS — "kaun":**
\`\`\`
USER    ek HUMAN ya ek legacy system ke liye ek long-lived identity. ek password
        (console) aur/ya access keys (API). in ko MINIMISE karo - humans SSO ke
        through log in karein, workloads roles use karein (Lesson 4).
GROUP   users ka ek bucket. GROUP par policies attach karo, users ise mein add karo.
        khud ek principal NAHI - aap ek group ke roop mein "act" nahi kar sakte.
ROLE    policies ke saath ek identity par koi permanent credentials NAHI. ek
        principal ise ASSUME karta hai aur short-lived temporary credentials paata
        hai. use by: workloads (ek EC2 instance, ek Lambda, ek Pod), SSO ke through
        humans, doosre accounts, federated identities (GitHub Actions - Lesson 4).
\`\`\`

**POLICIES — rules. {Effect, Action, Resource, Condition} ke JSON documents:**
\`\`\`
IDENTITY-BASED     ek user/group/role par attached: "ye principal Y par X kar sakta hai"
RESOURCE-BASED     resource par attached (ek S3 bucket, ek SQS queue, ek KMS key):
                   "principal P MUJH par X kar sakta hai" - cross-account access enable karta hai
PERMISSION BOUNDARY ek role/user par ek ceiling: MAX jo iske kabhi ho sakta hai.
                   (effective = attached AUR boundary)
SCP (Org)          ek account-wide ceiling organisation dwara set. root user bhi ise
                   exceed nahi kar sakta. ek guardrail, ek grant nahi.
SESSION POLICY     assume-role time par pass kiya us session ko aur shrink karne ke liye
\`\`\`

**EVALUATION — request DENIED hai jab tak ise explicitly allow nahi kiya, aur ek
explicit deny hamesha jeetta hai:**
\`\`\`
1. kya ek explicit DENY hai jo match karta hai? (koi bhi policy type)  -> DENY. done.
2. kya ek SCP / permission boundary ise block karta hai?               -> DENY.
3. kya ek explicit ALLOW hai jo match karta hai?                       -> ALLOW.
4. otherwise                                                          -> DENY (implicit).
\`\`\`
To: koi allow nahi = koi access nahi. kahin bhi ek deny = koi access nahi.

**LEAST PRIVILEGE** — job ke liye minimum resources par minimum actions grant karo,
aur kuch nahi. Kuch nahi se shuru karo aur jo break hota hai add karo; \`*\` se shuru
karke trim mat karo. \`Resource\` ko specific ARNs par scope karo, \`Condition\`s add
karo (source IP, MFA present, tag match, time), read ko write se split karo. Kyun:
ek leaked credential ya ek exploited workload sirf wo kar sakta hai jo iski identity
allowed hai - least privilege wo hai jo ise ek full breach ke bajaay ek contained
incident banata hai.

**AZURE (Entra ID + Azure RBAC):**
\`\`\`
users/groups/service principals/managed identities  = principals
ROLE DEFINITION (Actions/NotActions/DataActions ka ek set) + ROLE ASSIGNMENT
  (principal + role definition + SCOPE: management group / subscription / RG / resource)
DENY ASSIGNMENTS = explicit deny (zyadaatar system-managed / Blueprints)
Azure Policy = resource config par guardrails (SCPs + Config combined jaisa)
\`\`\``,

    content: `## IAM is the control plane

Every operation in a cloud account — starting a VM, reading an object, decrypting a value, calling another service — is an API call, and every API call is subject to Identity and Access Management. IAM answers two questions for each call: **authentication** (which principal is making this call, proven by a credential or a signature) and **authorisation** (is that principal permitted to perform this action on this resource, according to the applicable policies). If either fails, the call is denied. Because everything routes through IAM, a mistake here — an over-broad policy, a leaked long-lived key, a role that trusts too widely — is the mistake that turns a small compromise into a large one.

## Principals

- A **user** is a long-lived identity, historically for a human, with a console password and/or programmatic access keys. Access keys are long-lived static credentials and are the single most common source of cloud credential leaks (committed to git, left in a CI log, embedded in an app). The modern practice is to have humans authenticate through single sign-on (which issues temporary role credentials) and workloads use roles, minimising standing users to a handful of break-glass and legacy cases.
- A **group** is a container for users. You attach policies to the group and add users to it, so permissions are managed by membership rather than per user. A group is not itself a principal — nothing "acts as" a group.
- A **role** is an identity that has policies but no permanent credentials. A principal **assumes** the role and receives short-lived temporary credentials (typically valid for an hour, up to a configurable maximum). Roles are how workloads get permissions (an EC2 instance profile, a Lambda execution role, an EKS pod identity), how humans get permissions via SSO, how one account grants access to another, and how external identities like a GitHub Actions workflow authenticate without any stored secret (Lesson 4). A role has a **trust policy** saying who is allowed to assume it, separate from the permission policies saying what it can do once assumed.

## Policy types

A policy is a JSON document; each statement has an \`Effect\` (\`Allow\` or \`Deny\`), one or more \`Action\`s, one or more \`Resource\`s, and optional \`Condition\`s. The types differ by where they attach and what they do:

- **Identity-based policies** attach to a user, group, or role: "this principal may perform these actions on these resources."
- **Resource-based policies** attach to the resource itself — an S3 bucket policy, an SQS queue policy, a KMS key policy, a Lambda resource policy: "this principal (possibly in another account) may perform these actions on me." Resource-based policies are what enable cross-account access without the calling account granting anything.
- **Permission boundaries** attach to a user or role and define the **maximum** permissions it can ever have. The effective permissions are the intersection of the attached policies and the boundary — a policy granting \`s3:*\` combined with a boundary allowing only \`s3:GetObject\` yields just \`s3:GetObject\`. Boundaries let you delegate policy creation to a team while capping what those policies can grant.
- **Service Control Policies** (in AWS Organizations) attach to an account or organisational unit and set an account-wide ceiling that even the root user cannot exceed. An SCP never grants anything — it only restricts — and is used for organisation-wide guardrails: "no account may disable CloudTrail", "no account may use regions outside the EU".
- **Session policies** are passed at assume-role time to further narrow that specific session.

## Evaluation

The evaluation logic is deny-by-default with an explicit-deny override. For a given request:

1. If any applicable policy (of any type) contains an explicit \`Deny\` that matches the action and resource, the request is **denied**, full stop. Nothing overrides an explicit deny.
2. If an SCP or permission boundary does not allow the action, the request is **denied**.
3. If an identity-based or resource-based policy contains an explicit \`Allow\` that matches, the request is **allowed**.
4. Otherwise, the request is **denied** by the implicit default.

The two things to internalise: there is no access without an explicit allow somewhere, and a single explicit deny anywhere in the applicable policies blocks the request regardless of how many allows exist. This is why explicit \`Deny\` statements are used sparingly and deliberately — usually in SCPs or boundaries as guardrails — because they are absolute.

## Least privilege

**Least privilege** is the practice of granting a principal exactly the actions it needs on exactly the resources it needs, and nothing more. Concretely: scope \`Resource\` to specific ARNs rather than \`*\`; enumerate the specific \`Action\`s rather than \`s3:*\`; split read-only access from write access into separate policies or roles; add \`Condition\`s that constrain when and how the permission applies (only from a corporate IP range, only with MFA present, only on resources tagged with the caller\'s team, only during business hours). Build permissions by starting from nothing and adding what the workload actually needs when something fails, using the provider\'s access-analysis tooling (IAM Access Analyzer, \`iam generate-service-last-accessed-details\`, CloudTrail) to find what is actually used — never by starting from \`*\` and trimming, which almost always leaves excess.

The reason least privilege matters is blast radius. A leaked credential, a compromised CI job, an exploited application, an SSRF that reaches the instance metadata endpoint — each of these gives an attacker exactly the permissions of the identity involved and nothing more. If that identity can only read one bucket, the incident is a contained data-exposure of one bucket. If that identity has \`*\` on \`*\` because someone attached \`AdministratorAccess\` "to unblock a deploy", the same initial foothold is a full account takeover. Least privilege does not prevent the initial compromise; it decides how bad the compromise is.

## Azure: Entra ID and Azure RBAC

Azure separates the directory (Microsoft Entra ID, formerly Azure AD) from resource authorisation (Azure RBAC). Principals are users, groups, service principals (an app\'s identity), and managed identities (Lesson 4). Permissions are expressed as a **role definition** — a named set of \`Actions\`, \`NotActions\`, \`DataActions\`, and \`NotDataActions\` — combined with a **role assignment** that binds a principal to a role definition at a **scope**: a management group, a subscription, a resource group, or an individual resource, with assignments inherited down the hierarchy. **Deny assignments** provide explicit deny and are mostly system-managed (used by Azure Blueprints and managed apps). **Azure Policy** is the guardrail layer, enforcing rules on resource configuration and allowed regions/SKUs across a scope — functionally similar to combining AWS SCPs with AWS Config. The concepts map closely to AWS IAM; the main structural difference is that Azure attaches permissions at a scope in a resource hierarchy rather than primarily to the identity.`,

    contentHi: `## IAM control plane hai

Ek cloud account mein har operation — ek VM start karna, ek object read karna, ek value decrypt karna, doosre service ko call karna — ek API call hai, aur har API call Identity and Access Management ke subject hai. IAM har call ke liye do questions answer karta hai: **authentication** (kaun sा principal ye call kar raha hai) aur **authorisation** (kya wo principal is action ko is resource par perform karne ke liye permitted hai). Agar koi bhi fail hota hai, call denied hai. Kyunki sab kuch IAM ke through route karta hai, yahaan ek mistake — ek over-broad policy, ek leaked long-lived key — wo mistake hai jo ek chhote compromise ko ek badhe mein badalti hai.

## Principals

- Ek **user** ek long-lived identity hai, historically ek human ke liye, ek console password aur/ya programmatic access keys ke saath. Access keys long-lived static credentials hain aur cloud credential leaks ka sabse common source hain. Modern practice ye hai ki humans single sign-on ke through authenticate karein aur workloads roles use karein.
- Ek **group** users ke liye ek container hai. Aap group par policies attach karte ho aur users ise mein add karte ho. Ek group khud ek principal nahi hai.
- Ek **role** ek identity hai jiske paas policies hain par koi permanent credentials nahi. Ek principal role ko **assume** karta hai aur short-lived temporary credentials receive karta hai. Roles wo hain jaise workloads permissions paate hain, jaise humans SSO ke through permissions paate hain, jaise ek account doosre ko access grant karta hai. Ek role ke paas ek **trust policy** hai jo kehta hai kaun ise assume karne ke liye allowed hai.

## Policy types

Ek policy ek JSON document hai; har statement ke paas ek \`Effect\` (\`Allow\` ya \`Deny\`), ek ya zyada \`Action\`s, ek ya zyada \`Resource\`s, aur optional \`Condition\`s hain.
- **Identity-based policies** ek user, group, ya role par attach hoti hain.
- **Resource-based policies** resource khud par attach hoti hain — ek S3 bucket policy, ek SQS queue policy, ek KMS key policy. Ye cross-account access enable karti hain.
- **Permission boundaries** ek user ya role par attach hoti hain aur wo **maximum** permissions define karti hain jo iske kabhi ho sakti hain.
- **Service Control Policies** ek account ya organisational unit par attach hoti hain aur ek account-wide ceiling set karti hain jise root user bhi exceed nahi kar sakta.
- **Session policies** assume-role time par pass ki jaati hain.

## Evaluation

Evaluation logic deny-by-default hai ek explicit-deny override ke saath. Ek given request ke liye:
1. Agar koi bhi applicable policy mein ek explicit \`Deny\` hai jo match karta hai, request **denied** hai.
2. Agar ek SCP ya permission boundary action allow nahi karta, request **denied** hai.
3. Agar ek identity-based ya resource-based policy mein ek explicit \`Allow\` hai jo match karta hai, request **allowed** hai.
4. Otherwise, request **denied** hai implicit default se.

Do cheezen internalise karo: kahin ek explicit allow ke bina koi access nahi hai, aur applicable policies mein kahin bhi ek single explicit deny request ko block karta hai chahe kitne bhi allows exist karein.

## Least privilege

**Least privilege** ek principal ko exactly wo actions grant karne ki practice hai jo ise exactly un resources par chahiye jo ise chahiye, aur kuch nahi. Concretely: \`Resource\` ko specific ARNs par scope karo; specific \`Action\`s enumerate karo; read-only access ko write access se separate policies mein split karo; \`Condition\`s add karo. Permissions kuch nahi se shuru karke aur jo workload actually chahiye add karke build karo — kabhi \`*\` se shuru karke aur trim karke nahi.

Reason least privilege matter karta hai wo blast radius hai. Ek leaked credential, ek compromised CI job, ek exploited application — inme se har ek ek attacker ko exactly involved identity ki permissions deta hai aur kuch nahi. Agar wo identity sirf ek bucket read kar sakti hai, incident ek bucket ka ek contained data-exposure hai. Least privilege initial compromise ko prevent nahi karta; ye decide karta hai compromise kitna bura hai.

## Azure: Entra ID aur Azure RBAC

Azure directory (Microsoft Entra ID) ko resource authorisation (Azure RBAC) se separate karta hai. Principals users, groups, service principals, aur managed identities hain. Permissions ek **role definition** ke roop mein express hoti hain — \`Actions\`, \`NotActions\`, \`DataActions\` ka ek named set — ek **role assignment** ke saath combined jo ek principal ko ek role definition se ek **scope** par bind karta hai: ek management group, ek subscription, ek resource group, ya ek individual resource. **Deny assignments** explicit deny provide karte hain. **Azure Policy** guardrail layer hai. Concepts AWS IAM se closely map karte hain.`,

    examples: [
      {
        title: 'Reading a policy and tracing an evaluation: allow, then an SCP ceiling, then an explicit deny',
        titleHi: 'Ek policy padhna aur ek evaluation trace karna: allow, phir ek SCP ceiling, phir ek explicit deny',
        code: `# an identity-based policy attached to the "reporting" role:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadReportsBucket",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::acme-reports",
        "arn:aws:s3:::acme-reports/*"
      ],
      "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }
    }
  ]
}

# --- trace: role "reporting" calls  s3:GetObject  on  arn:aws:s3:::acme-reports/q3.csv ---

REQUEST 1  MFA present, no other policies
  explicit deny?           none
  SCP allows s3:GetObject? yes
  explicit allow?          YES (ReadReportsBucket, resource + condition match)
  => ALLOW

REQUEST 2  same call, but NO MFA on the session
  explicit allow?          the statement's Condition fails -> it does NOT match
  any other allow?         no
  => DENY (implicit - nothing allowed it)

REQUEST 3  MFA present, but the account has an SCP:
             { "Effect": "Deny", "Action": "s3:*",
               "Resource": "*",
               "Condition": { "StringNotEquals": { "aws:RequestedRegion": "eu-west-1" } } }
           and the bucket is in us-east-1
  explicit deny in the SCP matches (region != eu-west-1) -> DENY. done.
  the role's Allow is irrelevant - an explicit deny always wins.

REQUEST 4  s3:DeleteObject on the same bucket, MFA present, no SCP problem
  explicit allow for s3:DeleteObject?  no (policy only lists GetObject + ListBucket)
  => DENY (implicit)`,
        output: `The pattern: a request needs a matching explicit ALLOW and no matching explicit
DENY and to be within every ceiling (SCP, permission boundary). Request 1 passes
all gates. Request 2 fails because the Condition makes the Allow not match without
MFA. Request 3 is killed by an explicit Deny in the SCP that outranks any Allow.
Request 4 is denied simply because nothing ever allowed DeleteObject - the
default is no.`,
        explain: 'The policy grants the reporting role two actions — reading objects and listing the bucket — on one specific bucket and its contents, and only when the session was authenticated with MFA. Four requests trace the evaluation. The first is a straightforward read with MFA present and no other constraints: there is no matching deny, the account-level SCP permits the action, and the policy\'s Allow matches the action, the resource, and the condition, so the request is allowed. The second is the same read without MFA: the condition on the Allow statement fails, so that statement does not match, no other statement allows the call, and the request falls through to the implicit deny. The third has MFA but runs in an account with an SCP that denies all S3 actions outside the eu-west-1 region, and the bucket is in us-east-1: the explicit deny in the SCP matches and the request is denied immediately, with the role\'s Allow having no effect because an explicit deny always outranks an allow. The fourth is a delete against the same bucket: nothing in the policy lists DeleteObject, so there is no matching allow and the request is denied by default. The rule the four cases illustrate: a request must be explicitly allowed somewhere, must not be explicitly denied anywhere, and must fall within every applicable ceiling.',
        explainHi: 'Policy reporting role ko do actions grant karti hai — objects read karna aur bucket list karna — ek specific bucket aur iske contents par, aur sirf jab session MFA ke saath authenticated tha. Chaar requests evaluation trace karti hain. Pehla ek straightforward read hai MFA present ke saath: koi matching deny nahi, account-level SCP action permit karta hai, aur policy ka Allow action, resource, aur condition match karta hai, to request allowed hai. Doosra wahi read bina MFA ke: Allow statement par condition fail hoti hai, to wo statement match nahi karta, aur request implicit deny mein fall through hoti hai. Teesra MFA rakhta hai par ek account mein run karta hai ek SCP ke saath jo eu-west-1 region ke bahar saari S3 actions deny karti hai: SCP mein explicit deny match karta hai aur request turant denied hai. Chautha same bucket ke against ek delete hai: policy mein kuch bhi DeleteObject list nahi karta, to koi matching allow nahi aur request default se denied hai.',
      },
      {
        title: 'Least privilege in practice: from AdministratorAccess to a scoped role, and what it buys',
        titleHi: 'Least privilege practice mein: AdministratorAccess se ek scoped role tak, aur ye kya khareedti hai',
        code: `# BEFORE - the deploy role a startup actually shipped with:
{ "Effect": "Allow", "Action": "*", "Resource": "*" }        # "AdministratorAccess"
# rationale at the time: "the CI keeps hitting permission errors, just give it admin
# so we can ship". the role is assumed by every GitHub Actions run on every branch.

# threat: a malicious dependency in a PR's build, or a leaked OIDC misconfig, gets
# this role's credentials. blast radius = the ENTIRE account. delete everything,
# exfiltrate every bucket, spin up crypto miners, pivot to connected accounts.

# AFTER - scoped to exactly what "deploy the web service" needs:
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "PushImage", "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken","ecr:BatchCheckLayerAvailability",
                 "ecr:PutImage","ecr:InitiateLayerUpload","ecr:UploadLayerPart",
                 "ecr:CompleteLayerUpload"],
      "Resource": "arn:aws:ecr:eu-west-1:1234:repository/web" },
    { "Sid": "DeployService", "Effect": "Allow",
      "Action": ["ecs:UpdateService","ecs:DescribeServices",
                 "ecs:RegisterTaskDefinition","ecs:DescribeTaskDefinition"],
      "Resource": "*",
      "Condition": { "StringEquals": { "ecs:cluster":
        "arn:aws:ecs:eu-west-1:1234:cluster/prod" } } },
    { "Sid": "PassExecRoleOnly", "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::1234:role/web-task-exec",
      "Condition": { "StringEquals": { "iam:PassedToService": "ecs-tasks.amazonaws.com" } } }
  ]
}
# + a permission boundary on the role capping it to these services, so even a
#   future policy edit can't re-grant admin.
# + the trust policy only lets the OIDC subject  repo:acme/web:ref:refs/heads/main
#   assume it - not every branch, not every repo.`,
        output: `Same compromise, different outcome. With AdministratorAccess: total account loss.
With the scoped role: the attacker can push an image to ONE repo and update ONE
ECS service in ONE cluster - bad, caught fast, fully recoverable, no data
exfiltration, no lateral movement. Least privilege didn't stop the breach; it
turned a company-ending event into an incident ticket.`,
        explain: 'The starting point is a real and common anti-pattern: a deploy role with a wildcard allow on every action and every resource, attached because scoping it properly was more work than clicking AdministratorAccess, and assumed by every CI run on every branch. If an attacker gets those credentials — through a poisoned build dependency, a misconfigured trust policy, a leaked token — they have the entire account. The rewritten role grants exactly three things the deploy actually does: push a container image to the one ECR repository for this service, update the one ECS service in the production cluster (constrained by a condition on the cluster ARN), and pass exactly one specific task execution role to ECS and nothing else. It is wrapped in a permission boundary so a later well-meaning edit cannot re-expand it to admin, and its trust policy only allows the specific OIDC subject for the main branch of one repository to assume it. The same credential compromise now lets an attacker push an image to one repo and poke one service — noisy, quickly noticed, fully reversible, with no path to other data or other accounts. The lesson is that least privilege is not about preventing the breach, which you often cannot; it is about ensuring that when a credential is compromised, the damage is bounded to that one identity\'s narrow job.',
        explainHi: 'Starting point ek real aur common anti-pattern hai: ek deploy role har action aur har resource par ek wildcard allow ke saath, attach kiya gaya kyunki ise properly scope karna AdministratorAccess click karne se zyada work tha, aur har branch par har CI run dwara assumed. Agar ek attacker un credentials ko paata hai — ek poisoned build dependency ke through, ek misconfigured trust policy — unke paas poora account hai. Rewritten role exactly teen cheezen grant karti hai jo deploy actually karta hai: is service ke liye ek ECR repository mein ek container image push karna, production cluster mein ek ECS service update karna, aur exactly ek specific task execution role ECS ko pass karna. Ye ek permission boundary mein wrapped hai taaki ek baad ka edit ise admin tak re-expand na kar sake. Same credential compromise ab ek attacker ko ek repo mein ek image push karne aur ek service poke karne deta hai — noisy, jaldi noticed, fully reversible. Lesson ye hai ki least privilege breach prevent karne ke baare mein nahi hai; ye ensure karne ke baare mein hai ki jab ek credential compromised hai, damage us ek identity ke narrow job tak bounded hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# attaching AdministratorAccess (or "*":"*") to make a permission error go away
$ aws iam attach-role-policy --role-name ci-deploy \\
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
# "we'll scope it down later" -> nobody ever does. now:
#   - the CI role can delete the whole account
#   - a poisoned npm dependency in any PR build inherits that power
#   - the audit finds it 18 months later; nobody remembers which of the 40
#     actions it actually needs, so tightening it is now a scary multi-day project`,
        right: `# scope from the start, using the tools that tell you what's actually used:
#   1. run the workload with a DENY-heavy / minimal policy in staging
#   2. collect the AccessDenied errors from CloudTrail + the app logs
#   3. add exactly those actions, scoped to exactly those resource ARNs
#   4. IAM Access Analyzer -> "generate a policy from CloudTrail activity"
#   5. add a permission boundary so it can't be widened later without removing the boundary
# Azure: start from a built-in role at the tightest scope (resource group, not
#   subscription); use "az role assignment list" + Activity Log to right-size;
#   custom role definitions for anything the built-ins over-grant.`,
        why: 'Attaching a broad managed policy like \`AdministratorAccess\` to silence a permission error is the path of least resistance and it is almost never undone, because once the workload is working nobody has an incentive to spend time narrowing a policy, and later nobody remembers which subset of permissions is genuinely required. Meanwhile that identity — often a CI role assumed by builds of untrusted pull requests — carries the ability to destroy or exfiltrate the entire account, and any code that runs in its context inherits that. The disciplined approach costs a little more up front: run the workload with a deliberately minimal policy, watch the \`AccessDenied\` events in CloudTrail and the application logs, and add back exactly the actions that failed, each scoped to the specific resource ARNs involved. The cloud providers give you tooling for this — IAM Access Analyzer can generate a policy from observed CloudTrail activity, and \`iam generate-service-last-accessed-details\` shows which services a principal has actually used. Finish by attaching a permission boundary so the policy cannot quietly be widened again. On Azure the equivalent is to start from a built-in role at the narrowest useful scope, a resource group rather than a subscription, and use the Activity Log to right-size.',
        whyHi: '\`AdministratorAccess\` jaisi ek broad managed policy attach karna ek permission error silence karne ke liye least resistance ka path hai aur ye lagbhag kabhi undone nahi hota, kyunki ek baar workload kaam kar raha hai kisi ke paas ek policy narrow karne mein time spend karne ka incentive nahi hai, aur baad mein kisi ko yaad nahi kaun sा subset of permissions genuinely required hai. Meanwhile wo identity — aksar ek CI role jo untrusted pull requests ke builds dwara assumed hai — poore account ko destroy ya exfiltrate karne ki ability carry karti hai. Disciplined approach thoda zyada cost karta hai: workload ko ek deliberately minimal policy ke saath run karo, CloudTrail mein \`AccessDenied\` events dekho, aur exactly wo actions add karo jo fail hue, har ek involved specific resource ARNs par scoped. Ek permission boundary attach karke finish karo.',
      },
      {
        wrong: `# using long-lived IAM user access keys for a workload (or a human's daily use)
# an EC2 instance / a container / a script has:
#   AWS_ACCESS_KEY_ID=AKIA...        AWS_SECRET_ACCESS_KEY=...
# baked into an env file / a .env committed to git / a CI variable / an AMI.
# these keys don't expire. when (not if) one leaks - a public repo, a log, a
# stolen laptop, a breached SaaS that had it - it works forever, from anywhere,
# until a human notices and rotates it.`,
        right: `# workloads use ROLES -> short-lived, auto-rotated, auto-scoped credentials:
#   - EC2:     an instance profile (the SDK reads creds from IMDSv2)
#   - ECS:     a task role      - Lambda: the execution role
#   - EKS:     IRSA / EKS Pod Identity (per-ServiceAccount role)
#   - GitHub Actions -> AWS: OIDC federation, no stored key at all (Lesson 4)
# humans use SSO (IAM Identity Center / Entra ID) -> a temporary role session,
#   re-authenticated daily, MFA enforced.
# the only long-lived keys that should exist: a tiny number of documented
# break-glass credentials in a vault, alarmed on use.
# Azure: managed identities for workloads; Conditional Access + PIM for humans.`,
        why: 'A long-lived access key is a static secret with no expiry, and the entire history of cloud security incidents is full of them leaking: committed to a public repository, printed into a build log, embedded in a machine image, stored in a third-party tool that was later breached, left on a decommissioned laptop. Once leaked, the key works indefinitely, from any source IP, with the full permissions of its user, until a human happens to notice and manually rotates it — which is often months. Roles eliminate this by issuing short-lived credentials that expire automatically, usually within an hour, and are re-issued transparently to the workload by the platform. An EC2 instance profile, an ECS task role, a Lambda execution role, and an EKS pod identity each give the workload exactly-scoped credentials with no secret to store or leak. GitHub Actions can authenticate to AWS via OIDC federation with no stored key at all. Humans should authenticate through single sign-on, which issues a temporary role session that expires daily and can enforce MFA. The only long-lived keys that should exist are a small, documented set of break-glass credentials kept in a vault with an alarm on any use. On Azure the equivalents are managed identities for workloads and Conditional Access with Privileged Identity Management for humans.',
        whyHi: 'Ek long-lived access key ek static secret hai bina expiry ke, aur cloud security incidents ka poora history unke leaking se bhara hai: ek public repository mein committed, ek build log mein printed, ek machine image mein embedded, ek third-party tool mein stored jo baad mein breached tha. Ek baar leaked, key indefinitely kaam karti hai, kisi bhi source IP se, iske user ki full permissions ke saath, jab tak ek human notice karke ise manually rotate nahi karta — jo aksar mahine hai. Roles ise eliminate karti hain short-lived credentials issue karke jo automatically expire hoti hain, aam taur par ek hour ke andar. Ek EC2 instance profile, ek ECS task role, ek Lambda execution role — har ek workload ko exactly-scoped credentials deta hai bina store ya leak karne ke liye ek secret ke. GitHub Actions OIDC federation ke through AWS ko authenticate kar sakta hai bina ek stored key ke. Humans single sign-on ke through authenticate karein.',
      },
      {
        wrong: `# a resource-based policy (or a role trust policy) with an unscoped principal
# an S3 bucket policy meant to let a partner account read exports:
{ "Effect": "Allow", "Principal": "*",           # <-- anyone, anywhere
  "Action": "s3:GetObject", "Resource": "arn:aws:s3:::acme-exports/*" }
# or a role trust policy:
{ "Effect": "Allow", "Principal": { "AWS": "arn:aws:iam::999999999999:root" },
  "Action": "sts:AssumeRole" }                    # <-- the WHOLE partner account
# "Principal": "*" + no Condition = a public bucket. the partner-account :root
# trust = every user and role in the partner account, not just the one that needs it.`,
        right: `# scope the principal AND add a condition:
# bucket policy - a specific role in the partner account, and require their external ID:
{ "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::999999999999:role/acme-export-reader" },
  "Action": "s3:GetObject", "Resource": "arn:aws:s3:::acme-exports/*",
  "Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-abc123" } } }
# role trust policy - a specific external role + an ExternalId to stop the
# "confused deputy" problem:
{ "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::999999999999:role/their-integration" },
  "Action": "sts:AssumeRole",
  "Condition": { "StringEquals": { "sts:ExternalId": "acme-<random-shared-secret>" } } }
# if a policy ever needs "Principal": "*", it MUST have a hard Condition
# (aws:SourceVpce, aws:SourceIp, aws:PrincipalOrgID) - never bare.`,
        why: 'Resource-based policies and role trust policies name who is allowed in, and being loose with the principal is how cross-account access becomes public access. \`"Principal": "*"\` with no condition on an S3 bucket policy makes the bucket readable by anyone on the internet — it is the single most common cause of exposed-bucket incidents. Naming a partner account\'s \`:root\` in a trust policy grants every user and every role in that entire account the ability to assume your role, not just the one integration identity that needs it, so a compromise anywhere in the partner\'s account becomes access to yours. The fix on both sides is to scope the principal to the specific role ARN that should have access, and to add a condition as a second control: \`aws:PrincipalOrgID\` to confine access to your own organisation, or an \`sts:ExternalId\` on the trust policy — a shared secret string that the third party must present when assuming the role, which defeats the "confused deputy" attack where an attacker tricks the trusted third party into assuming your role on their behalf. If a policy genuinely must use \`"Principal": "*"\` — for a service like CloudFront that has no fixed principal — it must carry a hard condition such as \`aws:SourceArn\` or \`aws:SourceVpce\` that pins it to the specific caller.',
        whyHi: 'Resource-based policies aur role trust policies name karti hain kaun andar allowed hai, aur principal ke saath loose hona wo hai jaise cross-account access public access ban jaata hai. \`"Principal": "*"\` bina ek condition ke ek S3 bucket policy par bucket ko internet par kisi bhi dwara readable banata hai — ye exposed-bucket incidents ka sabse common cause hai. Ek trust policy mein ek partner account ke \`:root\` ko name karna us poore account mein har user aur har role ko aapki role assume karne ki ability grant karta hai, sirf wo ek integration identity nahi jise chahiye. Dono sides par fix principal ko specific role ARN par scope karna hai, aur ek condition ko ek second control ke roop mein add karna hai: \`aws:PrincipalOrgID\`, ya trust policy par ek \`sts:ExternalId\` — ek shared secret string jo third party ko role assume karte samay present karna chahiye, jo "confused deputy" attack ko defeat karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Admin on the CI role** — a Series A company gave its GitHub Actions deploy role `AdministratorAccess` "temporarily" in year one. A compromised transitive npm dependency in a dependabot PR build read the role\'s creds and enumerated every S3 bucket before the OIDC session expired. The blast radius was total; recovery took the security team a week. Post-incident: a 12-action scoped role + a permission boundary + branch-pinned trust.',
        hi: '**CI role par admin** — ek Series A company ne apne GitHub Actions deploy role ko year one mein "temporarily" `AdministratorAccess` diya. Ek dependabot PR build mein ek compromised npm dependency ne role ki creds read ki. Blast radius total tha. Post-incident: ek 12-action scoped role + ek permission boundary.',
      },
      {
        en: '**The key that lived for three years** — a `.env` with an IAM user\'s access key was committed to a repo that went public during an acquisition due-diligence data room. The key had `s3:*` and `dynamodb:*`. It was still valid. Now: no IAM user keys anywhere, everything on roles/OIDC, and a `git-secrets` pre-commit hook plus a repo scanner.',
        hi: '**Wo key jo teen saal jeeti** — ek IAM user ki access key wali ek `.env` ek repo mein committed thi jo ek acquisition due-diligence data room ke dauraan public ho gayi. Key ke paas `s3:*` aur `dynamodb:*` tha. Ye abhi bhi valid thi.',
      },
      {
        en: '**A `:root` trust that opened a door** — a data vendor\'s cross-account role trusted `arn:aws:iam::<vendor>:root`. The vendor had a breach; the attacker enumerated roles across the vendor\'s account, found the one that could assume into the customer, and pulled two months of exports. Fixed by scoping the trust to one vendor role ARN + requiring an `sts:ExternalId`.',
        hi: '**Ek `:root` trust jisne ek door khola** — ek data vendor ke cross-account role ne `arn:aws:iam::<vendor>:root` par trust kiya. Vendor ke paas ek breach tha; attacker ne vendor ke account ke across roles enumerate kiye. Trust ko ek vendor role ARN par scope karke + ek `sts:ExternalId` require karke fix kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the IAM policy-evaluation logic. What wins between an Allow and a Deny, and what happens with no matching statement?',
        qHi: 'IAM policy-evaluation logic samjhao. Ek Allow aur ek Deny ke beech kya jeetta hai, aur bina ek matching statement ke kya hota hai?',
        a: 'IAM evaluates every request as deny-by-default with an explicit-deny override. The order is: first, if any applicable policy of any type — identity-based, resource-based, a permission boundary, a service control policy, a session policy — contains an explicit Deny that matches the action and resource, the request is denied immediately and nothing overrides that. Second, if a service control policy or a permission boundary does not permit the action, the request is denied because those are ceilings. Third, if an identity-based or resource-based policy contains an explicit Allow that matches, the request is allowed. Fourth, if none of the above applies — no explicit deny and no explicit allow — the request is denied by the implicit default. So the two rules to internalise are: there is no access without an explicit allow somewhere, and a single explicit deny anywhere in the applicable policies blocks the request regardless of how many allows exist. This is why explicit Deny statements are used sparingly and deliberately, usually as guardrails in SCPs or permission boundaries — for example an SCP that denies all actions outside approved regions — because a deny is absolute and cannot be worked around by adding an allow.',
        aHi: 'IAM har request ko deny-by-default ke roop mein evaluate karta hai ek explicit-deny override ke saath. Order hai: pehle, agar koi bhi applicable policy — identity-based, resource-based, ek permission boundary, ek SCP, ek session policy — mein ek explicit Deny hai jo action aur resource match karta hai, request turant denied hai aur kuch bhi use override nahi karta. Doosre, agar ek SCP ya ek permission boundary action permit nahi karta, request denied hai kyunki wo ceilings hain. Teesre, agar ek identity-based ya resource-based policy mein ek explicit Allow hai jo match karta hai, request allowed hai. Chauthe, agar upar ka koi bhi apply nahi hota, request implicit default se denied hai. To do rules: kahin ek explicit allow ke bina koi access nahi hai, aur applicable policies mein kahin bhi ek single explicit deny request ko block karta hai.',
      },
      {
        q: 'What is least privilege, how do you actually build a least-privilege policy, and why does it matter if it does not stop the breach?',
        qHi: 'Least privilege kya hai, aap actually ek least-privilege policy kaise build karte ho, aur ye matter kyun karta hai agar ye breach nahi rokti?',
        a: 'Least privilege means granting a principal exactly the actions it needs on exactly the resources it needs and nothing more. You build such a policy by starting from nothing rather than from a wildcard: run the workload with a deliberately minimal policy, collect the AccessDenied events from CloudTrail and the application logs, and add back precisely the actions that failed, each scoped to the specific resource ARNs involved, splitting read from write, and adding conditions that constrain when and how the permission applies — only with MFA, only from a corporate network, only on resources tagged with the caller\'s team. The providers give you tooling: IAM Access Analyzer can generate a policy from observed CloudTrail activity, and service-last-accessed data shows which services a principal has actually used. You finish by attaching a permission boundary so the policy cannot silently be widened again. It matters even though it does not prevent the initial compromise because it decides the blast radius. A leaked credential, a compromised CI job, an exploited application, or an SSRF that reaches the metadata endpoint gives an attacker exactly the permissions of that one identity. If the identity can read one bucket, the incident is a contained exposure of one bucket, noticed and recovered quickly. If the identity has administrator access because someone attached it to unblock a deploy, the same foothold is a full account takeover. Least privilege converts company-ending events into incident tickets.',
        aHi: 'Least privilege ka matlab ek principal ko exactly wo actions grant karna jo ise exactly un resources par chahiye jo ise chahiye aur kuch nahi. Aap aisi ek policy build karte ho kuch nahi se shuru karke ek wildcard se nahi: workload ko ek deliberately minimal policy ke saath run karo, CloudTrail aur application logs se AccessDenied events collect karo, aur precisely wo actions add karo jo fail hue, har ek involved specific resource ARNs par scoped, read ko write se split karke, aur conditions add karke. Providers tooling dete hain: IAM Access Analyzer observed CloudTrail activity se ek policy generate kar sakta hai. Aap ek permission boundary attach karke finish karte ho. Ye matter karta hai even though ye initial compromise prevent nahi karta kyunki ye blast radius decide karta hai. Ek leaked credential ek attacker ko exactly us ek identity ki permissions deta hai. Least privilege company-ending events ko incident tickets mein convert karta hai.',
      },
      {
        q: 'How do AWS IAM and Azure\'s Entra ID plus Azure RBAC compare?',
        qHi: 'AWS IAM aur Azure ke Entra ID plus Azure RBAC kaise compare karte hain?',
        a: 'Both systems answer the same two questions — who is calling and are they allowed — and both have users, groups, and machine identities. The structural difference is where permissions attach. In AWS, identity-based policies attach primarily to the principal (a user, group, or role), with resource-based policies on the resource for cross-account cases; a role has a trust policy for who may assume it and permission policies for what it can do. In Azure, the directory (Microsoft Entra ID) holds the principals — users, groups, service principals for applications, and managed identities for workloads — and authorisation is a role assignment that binds a principal to a role definition at a scope in the resource hierarchy: a management group, a subscription, a resource group, or a single resource, with assignments inherited downward. A role definition is a named set of Actions, NotActions, DataActions and NotDataActions. Azure\'s explicit-deny mechanism is deny assignments, which are mostly system-managed rather than something you author freely. Azure Policy is the guardrail layer that enforces rules on resource configuration and allowed regions and SKUs across a scope, functionally similar to combining AWS SCPs with AWS Config. The mental model transfers directly; the main adjustment is thinking in terms of "which principal, which role, at which scope in the hierarchy" rather than "which policy on which identity".',
        aHi: 'Dono systems same do questions answer karte hain — kaun call kar raha hai aur kya wo allowed hain — aur dono ke paas users, groups, aur machine identities hain. Structural difference wo hai jahaan permissions attach hoti hain. AWS mein, identity-based policies primarily principal par attach hoti hain, resource-based policies resource par cross-account cases ke liye. Azure mein, directory (Microsoft Entra ID) principals rakhti hai — users, groups, applications ke liye service principals, aur workloads ke liye managed identities — aur authorisation ek role assignment hai jo ek principal ko ek role definition se resource hierarchy mein ek scope par bind karta hai: ek management group, ek subscription, ek resource group, ya ek single resource. Ek role definition Actions, NotActions, DataActions ka ek named set hai. Azure ka explicit-deny mechanism deny assignments hai. Azure Policy guardrail layer hai. Mental model directly transfer karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define the IAM principals (user, group, role) and the policy types (identity-based, resource-based, permission boundary, SCP, session), being precise about what each does.',
        taskHi: 'Ek comment mein, IAM principals aur policy types define karo.',
        hint: 'PRINCIPALS: USER = a long-lived identity (historically for a human / legacy system) with a console password and/or programmatic ACCESS KEYS (long-lived static creds — the #1 cloud leak source; minimise). GROUP = a container for users; you attach policies to the GROUP and manage permissions by membership — it is NOT itself a principal, nothing "acts as" a group. ROLE = an identity with policies but NO permanent credentials; a principal ASSUMES it and gets SHORT-LIVED temporary credentials (~1 h, configurable max). Roles have a TRUST POLICY (who may assume it) separate from the PERMISSION POLICIES (what it can do once assumed). Used by: workloads (EC2 instance profile, ECS task role, Lambda execution role, EKS pod identity), humans via SSO, other accounts, federated identities (GitHub Actions OIDC). POLICY TYPES (JSON: Effect / Action / Resource / Condition): IDENTITY-BASED — on a user/group/role: "this principal may do X on Y". RESOURCE-BASED — on the resource (S3 bucket policy, SQS/KMS/Lambda policy): "principal P may do X on ME" → enables cross-account access without the caller\'s account granting anything. PERMISSION BOUNDARY — on a user/role: the MAXIMUM it can ever have; effective = attached policies ∩ boundary; lets you delegate policy creation with a cap. SCP (AWS Organizations) — on an account / OU: an account-wide CEILING even root cannot exceed; NEVER grants, only restricts; for org guardrails ("no account may disable CloudTrail", "EU regions only"). SESSION POLICY — passed at assume-role time to further narrow that one session.',
        hintHi: 'PRINCIPALS: USER = ek long-lived identity ek console password aur/ya ACCESS KEYS ke saath (long-lived static creds — #1 cloud leak source; minimise). GROUP = users ke liye ek container; aap GROUP par policies attach karte ho — ye khud ek principal NAHI. ROLE = policies ke saath ek identity par koi permanent credentials NAHI; ek principal ise ASSUME karta hai aur SHORT-LIVED temp creds paata hai. TRUST POLICY (kaun assume kar sakta hai) PERMISSION POLICIES se separate. POLICY TYPES: IDENTITY-BASED — ek user/group/role par. RESOURCE-BASED — resource par: "principal P MUJH par X kar sakta hai" → cross-account. PERMISSION BOUNDARY — ek user/role par: MAXIMUM jo iske ho sakta hai. SCP — ek account/OU par: account-wide CEILING, KABHI grant nahi. SESSION POLICY — assume-role time par.',
      },
      {
        task: 'In a comment, walk the four-step IAM evaluation order and trace it for a request that: (a) has a matching Allow, (b) has a matching Allow but a failing Condition, (c) has a matching Allow but a matching Deny in an SCP, (d) has no matching statement.',
        taskHi: 'Ek comment mein, chaar-step IAM evaluation order walk karo aur ise trace karo.',
        hint: 'EVALUATION ORDER (deny-by-default, explicit-deny overrides): (1) is there an explicit DENY matching this action+resource in ANY applicable policy (identity / resource / boundary / SCP / session)? → DENY, full stop, nothing overrides it. (2) does an SCP or permission boundary FAIL to allow the action? → DENY (they are ceilings). (3) is there an explicit ALLOW matching in an identity-based OR resource-based policy? → ALLOW. (4) otherwise → DENY (implicit default). TRACES for `s3:GetObject` on `arn:aws:s3:::acme-reports/q3.csv`: (a) role has `Allow s3:GetObject` on that ARN, MFA present, no SCP issue → step 1 no deny, step 2 SCP ok, step 3 explicit Allow matches → ALLOW. (b) same Allow but it carries `Condition: aws:MultiFactorAuthPresent=true` and the session has NO MFA → the Condition fails so the statement does NOT match → step 3 finds no matching Allow → step 4 → DENY (implicit). (c) MFA present, Allow matches, BUT the account SCP has `Deny s3:* when aws:RequestedRegion != eu-west-1` and the bucket is in us-east-1 → step 1 finds a matching explicit Deny → DENY immediately; the role\'s Allow is irrelevant — an explicit deny always outranks any allow. (d) `s3:DeleteObject` on the same bucket, the policy only lists `GetObject`+`ListBucket` → no explicit deny, SCP fine, but NO explicit Allow for DeleteObject → step 4 → DENY (implicit). THE RULE: a request needs a matching explicit ALLOW somewhere AND no matching explicit DENY anywhere AND to be within every ceiling.',
        hintHi: 'EVALUATION ORDER (deny-by-default, explicit-deny overrides): (1) kya is action+resource ke liye KISI bhi applicable policy mein ek explicit DENY match karta hai? → DENY, full stop. (2) kya ek SCP ya permission boundary action allow karne mein FAIL hota hai? → DENY. (3) kya ek identity-based YA resource-based policy mein ek explicit ALLOW match karta hai? → ALLOW. (4) otherwise → DENY (implicit). TRACES: (a) Allow match, MFA present, no SCP issue → ALLOW. (b) Allow par `Condition: MFA=true`, session mein NO MFA → Condition fail → statement match NAHI → DENY (implicit). (c) MFA present, Allow match, PAR SCP `Deny s3:* when region != eu-west-1`, bucket us-east-1 mein → matching explicit Deny → DENY turant. (d) `s3:DeleteObject`, policy sirf `GetObject` list karti hai → koi explicit Allow nahi → DENY (implicit).',
      },
      {
        task: 'In a comment, explain least privilege: how to build a least-privilege policy from scratch, the specific scoping techniques, why it is about blast radius, and the Azure equivalents.',
        taskHi: 'Ek comment mein, least privilege samjhao.',
        hint: 'LEAST PRIVILEGE = grant a principal EXACTLY the actions it needs on EXACTLY the resources it needs, nothing more. BUILD FROM SCRATCH (never from `*` and trim — that always leaves excess): (1) run the workload with a deliberately minimal policy in staging; (2) collect the `AccessDenied` events from CloudTrail + the app logs; (3) add back precisely those actions, each scoped to the specific resource ARNs; (4) use IAM Access Analyzer → "generate a policy from CloudTrail activity", and `iam generate-service-last-accessed-details` to see what a principal actually used; (5) attach a PERMISSION BOUNDARY so it cannot be silently widened later. SCOPING TECHNIQUES: scope `Resource` to specific ARNs not `*`; enumerate specific `Action`s not `s3:*`; SPLIT read-only from write into separate policies/roles; add `Condition`s — `aws:MultiFactorAuthPresent`, `aws:SourceIp` (corp range), `aws:PrincipalOrgID`, `aws:ResourceTag/team` = `aws:PrincipalTag/team`, a time window; scope `iam:PassRole` to ONE role ARN + `iam:PassedToService`. WHY BLAST RADIUS: least privilege does NOT prevent the initial compromise (a leaked credential, a poisoned CI dependency, an exploited app, an SSRF hitting IMDS) — it decides how BAD it is. Identity can read one bucket → a contained one-bucket exposure, caught fast, recoverable. Identity has `AdministratorAccess` "to unblock a deploy" → the same foothold is full account takeover + data exfiltration + lateral movement. It converts company-ending events into incident tickets. AZURE EQUIVALENTS: start from a BUILT-IN role at the TIGHTEST scope (a resource group, not the subscription); use `az role assignment list` + the Activity Log to right-size; write a CUSTOM role definition (Actions/NotActions/DataActions) for anything the built-ins over-grant; Azure Policy + deny assignments as the guardrail/ceiling layer; PIM (Privileged Identity Management) for just-in-time elevation instead of standing admin.',
        hintHi: 'LEAST PRIVILEGE = ek principal ko EXACTLY wo actions grant karo jo ise EXACTLY un resources par chahiye, kuch nahi. SCRATCH SE BUILD (kabhi `*` se nahi): (1) minimal policy ke saath run karo; (2) CloudTrail + app logs se `AccessDenied` events collect karo; (3) precisely wo actions add karo, specific ARNs par scoped; (4) IAM Access Analyzer use karo; (5) ek PERMISSION BOUNDARY attach karo. SCOPING: `Resource` ko specific ARNs par; specific `Action`s; read ko write se SPLIT; `Condition`s add karo (MFA, SourceIp, PrincipalOrgID, tag match); `iam:PassRole` ko EK role ARN par. WHY BLAST RADIUS: least privilege initial compromise prevent NAHI karta — ye decide karta hai kitna BURA hai. Ek bucket read → contained. `AdministratorAccess` → full account takeover. AZURE: BUILT-IN role at TIGHTEST scope (resource group); Activity Log se right-size; CUSTOM role definition; Azure Policy + deny assignments; PIM just-in-time elevation ke liye.',
      },
    ],

    keyTakeaways: [
      'IAM is the control plane: every API call is AUTHENTICATED as a principal and AUTHORISED against policies. PRINCIPALS: a USER (long-lived, has a password and/or ACCESS KEYS — minimise), a GROUP (a container for users, not itself a principal), a ROLE (policies but NO permanent creds — a principal ASSUMES it for short-lived temporary credentials; used by workloads, SSO, other accounts, OIDC federation). A role\'s TRUST POLICY (who may assume) is separate from its PERMISSION POLICIES.',
      'POLICY TYPES: IDENTITY-BASED (on a user/group/role), RESOURCE-BASED (on the resource — enables cross-account), PERMISSION BOUNDARY (a per-identity ceiling: effective = attached ∩ boundary), SCP (an account-wide ceiling even root cannot exceed — only restricts, never grants), SESSION POLICY (narrows one assume-role session).',
      'EVALUATION is deny-by-default with an explicit-deny override: (1) a matching explicit DENY in ANY policy → denied, absolute; (2) an SCP / boundary that does not allow it → denied; (3) a matching explicit ALLOW → allowed; (4) otherwise → implicit deny. No allow anywhere = no access; one deny anywhere = no access. A failing `Condition` makes an Allow simply not match.',
      'LEAST PRIVILEGE = exactly the actions on exactly the resources, nothing more. BUILD from nothing and add what CloudTrail `AccessDenied` shows you (+ IAM Access Analyzer to generate from activity); scope `Resource` to ARNs, enumerate `Action`s, split read from write, add `Condition`s (MFA, source IP, org ID, tag match), cap `iam:PassRole` to one ARN, wrap in a permission boundary. It does not stop the breach — it decides the BLAST RADIUS (one bucket vs full account takeover).',
      'Workloads use ROLES for short-lived auto-rotated credentials (instance profile / task role / execution role / IRSA / OIDC) — NEVER long-lived IAM user access keys (the #1 leak source, valid forever until a human rotates). Humans use SSO. AZURE: Entra ID holds principals (users/groups/service principals/managed identities); a ROLE ASSIGNMENT binds a principal + role definition at a SCOPE in the resource hierarchy (mgmt group / subscription / RG / resource); deny assignments = explicit deny; Azure Policy = guardrails (≈ SCPs + Config).',
    ],
    keyTakeawaysHi: [
      'IAM control plane hai: har API call ek principal ke roop mein AUTHENTICATED aur policies ke against AUTHORISED hoti hai. PRINCIPALS: ek USER (long-lived, ek password aur/ya ACCESS KEYS — minimise), ek GROUP (users ke liye ek container, khud ek principal nahi), ek ROLE (policies par koi permanent creds NAHI — ek principal ise ASSUME karta hai short-lived temp creds ke liye). Ek role ki TRUST POLICY iski PERMISSION POLICIES se separate hai.',
      'POLICY TYPES: IDENTITY-BASED (ek user/group/role par), RESOURCE-BASED (resource par — cross-account enable karti hai), PERMISSION BOUNDARY (ek per-identity ceiling: effective = attached ∩ boundary), SCP (ek account-wide ceiling jise root bhi exceed nahi kar sakta — sirf restrict, kabhi grant nahi), SESSION POLICY (ek assume-role session ko narrow karti hai).',
      'EVALUATION deny-by-default hai ek explicit-deny override ke saath: (1) KISI bhi policy mein ek matching explicit DENY → denied, absolute; (2) ek SCP / boundary jo ise allow nahi karta → denied; (3) ek matching explicit ALLOW → allowed; (4) otherwise → implicit deny. Kahin koi allow nahi = koi access nahi; kahin ek deny = koi access nahi. Ek failing `Condition` ek Allow ko simply match na karne wala banati hai.',
      'LEAST PRIVILEGE = exactly wo actions exactly un resources par, kuch nahi. Kuch nahi se BUILD karo aur jo CloudTrail `AccessDenied` dikhata hai add karo; `Resource` ko ARNs par scope karo, `Action`s enumerate karo, read ko write se split karo, `Condition`s add karo, ek permission boundary mein wrap karo. Ye breach nahi rokti — ye BLAST RADIUS decide karti hai (ek bucket vs full account takeover).',
      'Workloads short-lived auto-rotated credentials ke liye ROLES use karte hain (instance profile / task role / execution role / IRSA / OIDC) — KABHI long-lived IAM user access keys nahi. Humans SSO use karte hain. AZURE: Entra ID principals rakhti hai; ek ROLE ASSIGNMENT ek principal + role definition ko resource hierarchy mein ek SCOPE par bind karta hai; deny assignments = explicit deny; Azure Policy = guardrails (≈ SCPs + Config).',
    ],
  },
];
