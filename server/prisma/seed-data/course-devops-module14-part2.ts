import type { CourseLesson } from './course-js-module1';

// DevOps Module 14 — Cloud in Practice (part 2 of 2). Lessons 1-3 in course-devops-module14.ts.
// PROSE + realistic hand-written CLI output (no live cloud account). No `# VERIFY` markers.
// AWS worked example + concrete Azure equivalents in every lesson; GCP noted briefly.

export const DEVOPS_MODULE_14_PART2: CourseLesson[] = [
  {
    slug: 'ops-object-storage-cdn-and-static-hosting',
    title: 'Object Storage, CDN & Static Hosting',
    titleHi: 'Object Storage, CDN Aur Static Hosting',
    description:
      'Object storage — S3 and its equivalents — is the cloud\'s default home for files, backups, data-lake data, and static site assets, priced per gigabyte across storage classes with lifecycle rules to age data down. A CDN puts cached copies of that content near users worldwide, cutting latency and egress cost. This lesson covers both, plus presigned URLs, event notifications, and the origin-access pattern that keeps a bucket private behind a CDN.',
    descriptionHi:
      'Object storage — S3 aur iske equivalents — files, backups, data-lake data, aur static site assets ka cloud ka default ghar hai, per gigabyte storage classes ke across priced lifecycle rules ke saath data ko age down karne ke liye. Ek CDN us content ki cached copies duniya bhar mein users ke paas rakhta hai, latency aur egress cost kaatta hai. Ye lesson dono cover karta hai, plus presigned URLs, event notifications, aur origin-access pattern jo ek bucket ko ek CDN ke peeche private rakhta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A central archive warehouse with local pickup lockers.** The warehouse (object storage) holds everything — you address each box by a label, not a shelf position, and there is effectively no limit to how many boxes it holds. Boxes you touch daily sit near the door; boxes you might need next year go to deep storage that is cheap to keep but takes a day to retrieve (storage classes), and a standing rule moves boxes to deep storage automatically after ninety days untouched (lifecycle). When people all over the country keep requesting the same popular box, you print copies and stock them in lockers in each city (the CDN) so most requests are served locally and the warehouse barely notices. And the warehouse door stays locked — the only way to get a box is a time-limited claim ticket the office issues (a presigned URL), or through the city lockers, which have their own key to the warehouse that customers never see (origin access).',
      hi: '**Ek central archive warehouse local pickup lockers ke saath.** Warehouse (object storage) sab kuch rakhta hai — aap har box ko ek label se address karte ho, ek shelf position se nahi, aur effectively koi limit nahi hai kitne boxes ye rakhta hai. Jo boxes aap roz touch karte ho door ke paas baithte hain; jo boxes aapko agle saal chahिए deep storage jaate hain jo rakhne ke liye sasta hai par retrieve karne mein ek din leta hai (storage classes), aur ek standing rule boxes ko deep storage par automatically move karta hai nabbe din untouched ke baad (lifecycle). Jab deshbhar mein log wahi popular box request karte rehte hain, aap copies print karte ho aur har city mein lockers mein stock karte ho (CDN). Aur warehouse door locked rehta hai — ek box paane ka ekmatra tarika ek time-limited claim ticket hai jo office issue karta hai (ek presigned URL), ya city lockers ke through.',
    },

    simple: `**OBJECT STORAGE** — S3 / Azure Blob / Google Cloud Storage. Flat key -> blob.
No filesystem, no limit on count or total size, 11 nines of durability (data
replicated across AZs). Addressed by \`bucket\` + \`key\` (\`s3://acme-assets/img/logo.png\`).
\`\`\`
CONSISTENCY   read-after-write for new objects; overwrites + deletes are also
              strongly consistent now (S3 since 2020). list may lag slightly.
STORAGE CLASSES (per-GB storage cheaper -> retrieval slower + pricier):
  Standard          hot data, served constantly
  Intelligent-Tiering  auto-moves objects between tiers by access pattern (small monitoring fee)
  Standard-IA / One Zone-IA  infrequent access; a per-GB RETRIEVAL fee, 30-day minimum
  Glacier Instant / Flexible / Deep Archive  archive; minutes-to-hours retrieval,
              90-180 day minimums, cheap to store ($1/TB/mo range for Deep Archive)
LIFECYCLE     rules: "objects in logs/ -> Standard-IA after 30d -> Glacier after 90d
              -> delete after 365d". also: expire old versions, abort stale multipart uploads.
VERSIONING    keep every version of a key; a delete is a "delete marker" you can undo.
              pair with MFA-delete + Object Lock for ransomware / compliance protection.
REPLICATION   async copy to another bucket/region (CRR) or same region (SRR) for DR / locality.
\`\`\`

**ACCESS PATTERNS:**
\`\`\`
PRIVATE (default + Block Public Access ON)  the norm. reach objects via:
  - PRESIGNED URL: your backend signs a URL valid for N minutes for one object +
    one operation (GET or PUT). the browser uploads/downloads directly, no proxying.
  - a CDN with ORIGIN ACCESS (below)
  - an IAM principal (a role) calling the API
STATIC WEBSITE HOSTING  S3 can serve a bucket as a website (index/error docs), but
  for anything real put a CDN in front (TLS, custom domain, caching, WAF).
EVENT NOTIFICATIONS  "on s3:ObjectCreated:* in uploads/ -> invoke a Lambda / send to
  SQS / EventBridge". the basis of upload-processing pipelines.
\`\`\`

**CDN** — CloudFront / Azure Front Door / Cloud CDN / (Cloudflare, Fastly).
\`\`\`
- edge caches (100s of PoPs) serve cached content near the user; a MISS fetches
  from the ORIGIN (your S3 bucket or your ALB) and caches it per your rules.
- CACHE KEY = which request attributes make responses distinct (path, and only the
  query params / headers / cookies you tell it to include - include too much = no hits).
- TTL from Cache-Control / s-maxage, or a CDN default. INVALIDATION purges a path
  early (costs money past a free tier - prefer versioned URLs: /app.a1b2c3.js).
- ORIGIN ACCESS (OAC on CloudFront): the bucket stays PRIVATE; only the CDN's
  signed requests can read it. users can't hit S3 directly.
- also at the edge: TLS termination, HTTP/3, WAF, geo-blocking, edge functions
  (rewrites, auth checks, A/B), SIGNED URLs / cookies for paid content.
- COST: edge egress is cheaper than S3/ALB egress, and cache HITS incur no origin
  transfer at all -> a CDN in front of a bucket usually LOWERS the bill (Module 13).
\`\`\`

**AZURE:** Blob Storage (Hot/Cool/Cold/Archive tiers, lifecycle mgmt, versioning,
soft delete, immutability policies), SAS tokens (= presigned URLs), Event Grid
(= event notifications), Front Door / Azure CDN (= CloudFront), Private Endpoint
+ Front Door origin = OAC equivalent.`,

    simpleHi: `**OBJECT STORAGE** — S3 / Azure Blob / Google Cloud Storage. Flat key -> blob.
Koi filesystem nahi, count ya total size par koi limit nahi, 11 nines durability.
\`bucket\` + \`key\` se addressed (\`s3://acme-assets/img/logo.png\`).
\`\`\`
CONSISTENCY   naye objects ke liye read-after-write; overwrites + deletes bhi ab
              strongly consistent hain. list thoda lag kar sakti hai.
STORAGE CLASSES (per-GB storage sasta -> retrieval slower + mehnga):
  Standard          hot data, constantly served
  Intelligent-Tiering  access pattern se objects ko tiers ke beech auto-move karta hai
  Standard-IA / One Zone-IA  infrequent access; ek per-GB RETRIEVAL fee, 30-day minimum
  Glacier Instant / Flexible / Deep Archive  archive; minutes-to-hours retrieval,
              90-180 day minimums, store karne ke liye sasta
LIFECYCLE     rules: "logs/ mein objects -> 30d baad Standard-IA -> 90d baad Glacier
              -> 365d baad delete". bhi: old versions expire, stale multipart uploads abort.
VERSIONING    ek key ke har version rakho; ek delete ek "delete marker" hai jise aap undo kar sakte ho.
REPLICATION   DR / locality ke liye doosre bucket/region (CRR) ya same region (SRR) mein async copy.
\`\`\`

**ACCESS PATTERNS:**
\`\`\`
PRIVATE (default + Block Public Access ON)  norm. objects reach karo:
  - PRESIGNED URL: aapka backend ek URL sign karta hai jo N minutes ke liye valid
    hai ek object + ek operation ke liye (GET ya PUT). browser directly upload/download karta hai.
  - ORIGIN ACCESS ke saath ek CDN (neeche)
  - ek IAM principal (ek role) API call karta hua
STATIC WEBSITE HOSTING  S3 ek bucket ko ek website ke roop mein serve kar sakta hai, par
  kisi real cheez ke liye ek CDN saamne rakho (TLS, custom domain, caching, WAF).
EVENT NOTIFICATIONS  "uploads/ mein s3:ObjectCreated:* par -> ek Lambda invoke karo /
  SQS / EventBridge ko bhejo". upload-processing pipelines ka basis.
\`\`\`

**CDN** — CloudFront / Azure Front Door / Cloud CDN / (Cloudflare, Fastly).
\`\`\`
- edge caches (100s PoPs) user ke paas cached content serve karte hain; ek MISS
  ORIGIN (aapka S3 bucket ya aapka ALB) se fetch karta hai aur ise cache karta hai.
- CACHE KEY = kaun se request attributes responses ko distinct banate hain (path, aur
  sirf wo query params / headers / cookies jo aap include batate ho).
- TTL Cache-Control / s-maxage se, ya ek CDN default. INVALIDATION ek path ko jaldi
  purge karta hai (free tier ke aage paisa - versioned URLs prefer karo: /app.a1b2c3.js).
- ORIGIN ACCESS (CloudFront par OAC): bucket PRIVATE rehta hai; sirf CDN ke signed
  requests ise read kar sakte hain.
- edge par bhi: TLS termination, HTTP/3, WAF, geo-blocking, edge functions,
  paid content ke liye SIGNED URLs / cookies.
- COST: edge egress S3/ALB egress se sasta hai, aur cache HITS par koi origin
  transfer bilkul nahi -> ek bucket ke saamne ek CDN usually bill KAM karta hai (Module 13).
\`\`\``,

    content: `## Object storage

Object storage — S3 on AWS, Blob Storage on Azure, Cloud Storage on GCP — stores data as **objects**: an opaque blob addressed by a flat key within a bucket, \`s3://bucket/path/to/object\`. There is no real directory structure (the slashes in a key are just characters, though the console shows them as folders), no limit on the number of objects or the total size, and durability of eleven nines because each object is redundantly stored across multiple availability zones. It is the default home for anything file-shaped: user uploads, backups and snapshots, data-lake and analytics data, build artifacts, logs, and the static assets of a website.

**Consistency**: S3 provides read-after-write consistency for new objects, and since 2020 also for overwrites and deletes, so a \`GET\` immediately after a \`PUT\` returns the new data. Bucket listings can lag slightly behind.

**Storage classes** trade storage price against retrieval speed and cost:

- **Standard** for hot data served constantly.
- **Intelligent-Tiering** monitors each object\'s access pattern and moves it between frequent, infrequent, and archive tiers automatically, for a small per-object monitoring fee — the right default when access patterns are unknown or varied.
- **Standard-Infrequent Access** and **One Zone-IA** are cheaper to store but add a per-gigabyte retrieval charge and a thirty-day minimum storage duration; One Zone-IA drops the cross-AZ redundancy for a further discount.
- **Glacier Instant Retrieval, Glacier Flexible Retrieval, and Glacier Deep Archive** are archive tiers, very cheap to store (Deep Archive is around a dollar per terabyte per month) with retrieval times from milliseconds to hours and minimum durations of ninety to a hundred and eighty days.

**Lifecycle rules** move objects between classes and expire them automatically: "objects under \`logs/\` transition to Standard-IA after 30 days, to Glacier after 90, and are deleted after 365"; rules also expire non-current versions and abort incomplete multipart uploads that would otherwise accumulate as invisible cost.

**Versioning** keeps every version of an object; a delete becomes a recoverable delete marker rather than destroying data. Combined with MFA-delete and Object Lock (write-once-read-many retention), versioning is the primary defence against ransomware and accidental or malicious deletion. **Replication** asynchronously copies objects to another bucket, in the same region or a different one, for disaster recovery or to serve data close to users elsewhere.

## Access patterns

The correct default is a **private bucket with Block Public Access enabled**. Objects are then reached in one of three ways:

- **Presigned URLs**: your backend, holding credentials, generates a URL that embeds a signature valid for a limited time and for exactly one object and one operation. It hands that URL to the client, which uploads or downloads directly to or from S3 without the data passing through your servers. This is how you let a browser upload a large file, or download a private document, without proxying gigabytes through your application.
- **A CDN with origin access** (below): the bucket stays private and only the CDN can read it.
- **An IAM principal calling the API**: a role attached to a workload reads and writes objects directly.

**Static website hosting**: S3 can serve a bucket\'s contents as a website with index and error documents, but this mode has no TLS, no custom domain, and limited caching, so for anything production you put a CDN in front and use the bucket purely as the origin.

**Event notifications**: S3 can fire an event on object creation, deletion, or other operations, delivering it to a Lambda function, an SQS queue, or EventBridge. "On \`s3:ObjectCreated:*\` under \`uploads/\`, invoke the thumbnail Lambda" is the foundation of upload-processing and ingestion pipelines.

## CDN

A **content delivery network** — CloudFront, Azure Front Door, Cloud CDN, or a third party like Cloudflare or Fastly — operates a large fleet of edge locations, each with a cache. A request from a user goes to the nearest edge; if the content is cached there (a hit) it is served immediately, and if not (a miss) the edge fetches it from the **origin** — your S3 bucket for static assets, your load balancer for dynamic responses — caches it according to your rules, and serves it.

- The **cache key** determines which requests are considered the same response. By default it is the path; you configure which query-string parameters, headers, and cookies also form part of the key. Including too many makes every request unique and the cache useless; including too few serves the wrong variant.
- **Time-to-live** comes from the origin\'s \`Cache-Control\` or \`s-maxage\` header, or a CDN default. **Invalidation** purges a path from the cache before its TTL expires; it costs money beyond a small free allowance, so the better pattern for assets is a **versioned URL** — \`/app.a1b2c3.js\` — where a new build produces a new filename and the old one simply ages out.
- **Origin access** (Origin Access Control on CloudFront, a Private Endpoint plus origin configuration on Front Door) keeps the origin bucket private: only requests signed by the CDN can read it, so users cannot bypass the CDN and hit S3 directly.
- The edge also does **TLS termination**, HTTP/3, a **web application firewall**, geo-blocking, small **edge functions** for request rewriting and lightweight authentication and A/B routing, and **signed URLs or signed cookies** to gate access to paid or private content.
- On **cost**, edge egress is priced lower than direct S3 or load-balancer egress, and a cache hit incurs no origin data transfer at all, so putting a CDN in front of a bucket or an application usually reduces the bill as well as the latency (Module 13).

## Azure

Blob Storage provides the Hot, Cool, Cold, and Archive access tiers with lifecycle management, blob versioning, soft delete, and immutability policies. **Shared Access Signature** tokens are the equivalent of presigned URLs. **Event Grid** delivers blob events. **Azure Front Door** (and the older Azure CDN) is the CDN, with a Private Endpoint on the storage account plus Front Door origin configuration providing the equivalent of origin access control.`,

    contentHi: `## Object storage

Object storage — AWS par S3, Azure par Blob Storage, GCP par Cloud Storage — data ko **objects** ke roop mein store karta hai: ek opaque blob jo ek bucket ke andar ek flat key se addressed hai. Koi real directory structure nahi, objects ki number ya total size par koi limit nahi, aur gyarah nines ki durability kyunki har object multiple availability zones ke across redundantly stored hai. Ye kisi bhi file-shaped cheez ka default ghar hai.

**Consistency**: S3 naye objects ke liye read-after-write consistency provide karta hai, aur 2020 se overwrites aur deletes ke liye bhi.

**Storage classes** storage price ko retrieval speed aur cost ke against trade karti hain:
- **Standard** hot data ke liye.
- **Intelligent-Tiering** har object ke access pattern ko monitor karta hai aur ise tiers ke beech automatically move karta hai — jab access patterns unknown hain to right default.
- **Standard-Infrequent Access** aur **One Zone-IA** store karne ke liye sasta hai par ek per-gigabyte retrieval charge aur ek thirty-day minimum add karti hain.
- **Glacier Instant Retrieval, Glacier Flexible Retrieval, aur Glacier Deep Archive** archive tiers hain, store karne ke liye bahut sasta.

**Lifecycle rules** objects ko classes ke beech move karti hain aur unhe automatically expire karti hain. **Versioning** ek object ke har version rakhta hai; ek delete ek recoverable delete marker ban jaata hai. **Replication** asynchronously objects ko doosre bucket mein copy karta hai.

## Access patterns

Correct default ek **private bucket Block Public Access enabled ke saath** hai. Objects phir teen tarikon mein se ek mein reach kiye jaate hain:
- **Presigned URLs**: aapka backend ek URL generate karta hai jo ek limited time ke liye aur exactly ek object aur ek operation ke liye valid ek signature embed karta hai. Client directly S3 se upload ya download karta hai bina data aapke servers se guzre.
- **Origin access ke saath ek CDN** (neeche).
- **Ek IAM principal API call karta hua**.

**Static website hosting**: S3 ek bucket ke contents ko ek website ke roop mein serve kar sakta hai, par is mode mein koi TLS nahi, koi custom domain nahi, to kisi production cheez ke liye aap ek CDN saamne rakhte ho.

**Event notifications**: S3 object creation, deletion, ya doosre operations par ek event fire kar sakta hai, ise ek Lambda function, ek SQS queue, ya EventBridge ko deliver karta hua.

## CDN

Ek **content delivery network** — CloudFront, Azure Front Door, Cloud CDN — edge locations ka ek large fleet operate karta hai, har ek ek cache ke saath. Ek user se ek request nearest edge ko jaati hai; agar content wahaan cached hai (ek hit) ye turant served hai, aur agar nahi (ek miss) edge ise **origin** se fetch karta hai.

- **Cache key** determine karta hai kaun se requests same response consider kiye jaate hain. Bahut zyada include karna har request ko unique banata hai aur cache useless.
- **Time-to-live** origin ke \`Cache-Control\` header se aata hai. **Invalidation** ek path ko cache se purge karta hai; ye paisa cost karta hai, to assets ke liye better pattern ek **versioned URL** hai.
- **Origin access** origin bucket ko private rakhta hai: sirf CDN dwara signed requests ise read kar sakte hain.
- Edge bhi **TLS termination**, HTTP/3, ek **web application firewall**, geo-blocking, chhote **edge functions**, aur **signed URLs ya signed cookies** karta hai.
- **Cost** par, edge egress direct S3 egress se kam priced hai, aur ek cache hit par koi origin data transfer bilkul nahi, to ek bucket ke saamne ek CDN rakhna usually bill kam karta hai (Module 13).

## Azure

Blob Storage Hot, Cool, Cold, aur Archive access tiers provide karta hai lifecycle management, blob versioning, soft delete ke saath. **Shared Access Signature** tokens presigned URLs ka equivalent hain. **Event Grid** blob events deliver karta hai. **Azure Front Door** CDN hai.`,

    examples: [
      {
        title: 'The private-bucket + presigned-URL upload flow, and the same for a CDN download',
        titleHi: 'Private-bucket + presigned-URL upload flow, aur ek CDN download ke liye wahi',
        code: `# BUCKET: acme-uploads. Block Public Access ON. no bucket policy allowing anyone.

# --- UPLOAD: browser -> S3 directly, no bytes through your API ---
# 1. browser asks your API: "I want to upload profile-42.jpg, 2.1 MB, image/jpeg"
# 2. your API (holding an IAM role that can PutObject on acme-uploads/users/*):
$ aws s3 presign s3://acme-uploads/users/42/profile.jpg \\
    --expires-in 300 --region eu-west-1
https://acme-uploads.s3.eu-west-1.amazonaws.com/users/42/profile.jpg?X-Amz-Algorithm=...
  &X-Amz-Expires=300&X-Amz-Signature=...&X-Amz-SignedHeaders=host
#    (in real code: s3_client.generate_presigned_url('put_object', Params={...},
#     ExpiresIn=300, HttpMethod='PUT') - and pin ContentType + a max size via a
#     presigned POST policy)
# 3. browser does  PUT <that url>  with the file bytes -> straight to S3
# 4. S3 fires  s3:ObjectCreated:*  -> a Lambda makes thumbnails, an SQS message
#    tells your app the upload finished

# --- DOWNLOAD via CDN, bucket still private ---
# CloudFront distribution  cdn.acme.io  with:
#   origin = acme-uploads (S3), Origin Access Control enabled
#   -> AWS adds a bucket policy: allow s3:GetObject ONLY from this distribution's
#      service principal, with a condition on the distribution ARN
#   users hit  https://cdn.acme.io/users/42/profile.jpg
#   -> edge cache HIT: served from the PoP near the user, 0 origin transfer
#   -> MISS: CloudFront signs a request to S3 (only it can), caches, serves
#   a direct request to  acme-uploads.s3...amazonaws.com/...  -> 403 AccessDenied

# for PRIVATE downloads (a paid PDF): CloudFront SIGNED URL / signed cookie -
#   your app issues a short-lived signed link; the edge validates the signature.

# Azure: a SAS token (presigned URL equivalent) for upload; Front Door + a Private
#   Endpoint on the storage account for the CDN download path.`,
        output: `The bucket is never public. Uploads go browser -> S3 with a 5-minute presigned
PUT URL your API signs (no file bytes touch your servers). Downloads go through
the CDN, which is the ONLY thing allowed to read the bucket (Origin Access
Control) - a direct S3 URL returns 403. Private/paid content uses CloudFront
signed URLs on top. Your servers proxy no object data in either direction.`,
        explain: 'The bucket has Block Public Access on and no policy granting anyone access, so it is completely private. Uploads work by having the browser talk to S3 directly using a presigned URL: the browser tells the application what it wants to upload, the application — which holds an IAM role permitted to put objects under that prefix — generates a URL containing a signature valid for five minutes and for exactly that one object and the PUT operation, and hands it back. The browser then uploads the file bytes straight to S3 with no data passing through the application servers, and S3 fires an object-created event that triggers thumbnail generation and notifies the application. Downloads go through a CloudFront distribution with Origin Access Control, which causes AWS to add a bucket policy allowing read access only from that specific distribution\'s service principal — so the CDN can read the bucket but a direct request to the S3 URL returns access denied. Cache hits are served from the edge near the user with no origin transfer; misses have CloudFront sign a request to S3, cache the result, and serve it. For genuinely private content like a paid document, a CloudFront signed URL adds a per-user, time-limited signature that the edge validates. The application never proxies object bytes in either direction. The Azure equivalent uses a SAS token for upload and Front Door with a Private Endpoint for the download path.',
        explainHi: 'Bucket par Block Public Access on hai aur koi policy nahi jo kisi ko access grant karti hai, to ye poori tarah private hai. Uploads browser ko S3 se directly baat karwake kaam karte hain ek presigned URL use karke: browser application ko batata hai wo kya upload karna chahta hai, application — jiske paas ek IAM role hai jo us prefix ke tahat objects put karne ke liye permitted hai — ek URL generate karta hai jismें ek signature paanch minute ke liye aur exactly us ek object aur PUT operation ke liye valid hai. Browser phir file bytes seedhे S3 par upload karta hai bina data application servers se guzre. Downloads Origin Access Control ke saath ek CloudFront distribution ke through jaate hain, jo AWS ko ek bucket policy add karwata hai jo read access sirf us specific distribution ke service principal se allow karti hai. Application kabhi object bytes proxy nahi karta kisi bhi direction mein.',
      },
      {
        title: 'A lifecycle policy and the cost it saves — logs aging through the storage classes',
        titleHi: 'Ek lifecycle policy aur wo cost jo ye bachata hai — logs storage classes ke through age hote hue',
        code: `# a bucket 'acme-app-logs' receiving ~500 GB/month of JSON logs.
# access pattern: heavily queried for ~14 days, occasionally for ~90 days,
# then kept 7 years for compliance but essentially never read.

# WITHOUT a lifecycle policy: everything stays in Standard forever.
#   after 3 years: ~18 TB in Standard @ ~$0.023/GB = ~$414/mo, growing $11/mo

# lifecycle rule (applies to the whole bucket):
{
  "Rules": [{
    "ID": "logs-tiering",
    "Filter": { "Prefix": "" },
    "Status": "Enabled",
    "Transitions": [
      { "Days": 30,  "StorageClass": "STANDARD_IA" },
      { "Days": 90,  "StorageClass": "GLACIER_IR" },
      { "Days": 180, "StorageClass": "DEEP_ARCHIVE" }
    ],
    "Expiration": { "Days": 2557 },
    "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
  }]
}

# WITH the policy, steady-state distribution of ~18 TB:
#   ~0.5 TB  Standard      (last 30d)   @ $0.023  = ~$12
#   ~1.0 TB  Standard-IA   (30-90d)     @ $0.0125 = ~$13
#   ~1.5 TB  Glacier IR    (90-180d)    @ $0.004  = ~$6
#   ~15 TB   Deep Archive  (180d-7y)    @ $0.00099= ~$15
#   -----                                            ~$46/mo   (vs ~$414/mo)
# plus: retrieval fees IF you ever read the archived data (rare, by assumption),
#       and 'AbortIncompleteMultipartUpload' sweeps failed uploads that would
#       otherwise bill as invisible storage.

# Azure: identical concept - a lifecycle management policy moving blobs
#   Hot -> Cool (30d) -> Cold (90d) -> Archive (180d) -> delete (2557d).`,
        output: `The logs are worth querying for two weeks, occasionally to three months, then
never - but must be kept seven years. A lifecycle policy encodes exactly that
access curve into the storage classes: hot data in Standard, cooling data in IA
then Glacier IR, cold-forever data in Deep Archive at ~$1/TB/month, and an
expiration at year seven. ~$46/mo instead of ~$414/mo for the same data, with no
application change - just a rule on the bucket.`,
        explain: 'A bucket receives half a terabyte of logs a month, and the access pattern is well understood: the logs are queried heavily for about two weeks, occasionally out to about three months, and then kept for seven years for compliance while essentially never being read. Without a lifecycle policy, every object stays in the Standard class forever, so after three years there is eighteen terabytes in the most expensive tier costing over four hundred dollars a month and rising. The lifecycle rule encodes the access curve directly: objects transition to Standard-Infrequent Access after thirty days, to Glacier Instant Retrieval after ninety, and to Deep Archive after a hundred and eighty, and are deleted after seven years; a separate clause aborts incomplete multipart uploads after a week so failed uploads do not accumulate as invisible billed storage. In steady state the eighteen terabytes are then distributed across the classes according to age, with the vast majority sitting in Deep Archive at roughly a dollar per terabyte per month, and the total drops from over four hundred dollars a month to around forty-six, for exactly the same data, with no change to the application — the rule lives entirely on the bucket. The only caveat is that reading the archived data later incurs retrieval fees, which is acceptable precisely because the access pattern says that almost never happens. Azure\'s lifecycle management does the same thing across its Hot, Cool, Cold, and Archive tiers.',
        explainHi: 'Ek bucket ek mahine aadha terabyte logs receive karta hai, aur access pattern well understood hai: logs lagbhag do hafton ke liye heavily queried hain, occasionally lagbhag teen mahine tak, aur phir saat saal ke liye compliance ke liye rakhे jaate hain jabki essentially kabhi read nahi hote. Ek lifecycle policy ke bina, har object hamesha ke liye Standard class mein rehta hai, to teen saal baad athara terabytes sabse mehnge tier mein hai chaar sau dollar se zyada ek mahine cost karता hua. Lifecycle rule access curve ko directly encode karता hai: objects tees din baad Standard-Infrequent Access mein transition karते hain, navve baad Glacier Instant Retrieval mein, aur ek sau assi baad Deep Archive mein, aur saat saal baad delete hote hain. Total chaar sau dollar se zyada ek mahine se lagbhag chhiyalees tak girता hai, exactly same data ke liye, application mein koi change nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# making a bucket public to serve website assets / user content
$ aws s3api put-bucket-acl --bucket acme-assets --acl public-read
# or a bucket policy with  "Principal": "*"  and  "Action": "s3:GetObject"
# consequences:
#   - anyone can enumerate and download every object (list is often left open too)
#   - a mistakenly-uploaded private file (a DB dump, a .env, a customer export) is
#     instantly world-readable, and scanners find public buckets within minutes
#   - you're paying full S3 egress for every download, from every region, uncached
#   - this is the single most common cloud data-exposure headline`,
        right: `# bucket stays PRIVATE (Block Public Access ON at account + bucket level).
# serve assets through a CDN with Origin Access:
#   CloudFront distribution -> origin = the bucket, OAC enabled
#   -> AWS writes a bucket policy: s3:GetObject allowed ONLY from this
#      distribution (condition: aws:SourceArn = the distribution ARN)
#   users hit  https://cdn.acme.io/...  ; a direct S3 URL -> 403
# benefits: private bucket, cached + cheap egress, TLS + custom domain + WAF for
# free, and a mis-uploaded private file is NOT automatically exposed.
# for user uploads: presigned URLs (upload) + signed CloudFront URLs (private download).`,
        why: 'Making a bucket public to serve assets is convenient and is the cause of a large fraction of publicised cloud data breaches. A public-read bucket policy or ACL grants anyone on the internet the ability to download any object, and often to list the bucket\'s contents as well, so the moment someone accidentally uploads something sensitive — a database dump, an environment file, a customer data export — it is world-readable, and automated scanners that continuously probe for public buckets will find it within minutes. It is also more expensive, because every download is billed at the full S3 egress rate, from wherever the requester is, with no caching. The correct pattern keeps the bucket private with Block Public Access enabled and serves content through a CDN configured with origin access, which makes AWS write a bucket policy allowing reads only from that specific distribution. Users reach the content through the CDN\'s domain, a direct request to the S3 URL is denied, and you get edge caching, cheaper egress, TLS, a custom domain, and a web application firewall as part of the deal — and a file uploaded to the wrong prefix is not automatically exposed to the world. User uploads and private downloads use presigned URLs and CloudFront signed URLs respectively, which grant time-limited access to one object without ever making the bucket public.',
        whyHi: 'Assets serve karne ke liye ek bucket public banana convenient hai aur publicised cloud data breaches ke ek large fraction ka cause hai. Ek public-read bucket policy ya ACL internet par kisi bhi ko koi bhi object download karne ki ability grant karta hai, aur aksar bucket ke contents list karne ki bhi, to jis pal koi accidentally kuch sensitive upload karta hai — ek database dump, ek environment file — ye world-readable hai, aur automated scanners ise minutes ke andar dhoondh lenge. Ye zyada expensive bhi hai. Correct pattern bucket ko Block Public Access enabled ke saath private rakhता hai aur content ek CDN ke through serve karता hai jo origin access ke saath configured hai. Users content ko CDN ke domain ke through reach karते hain, S3 URL ko ek direct request denied hai, aur aapko edge caching, cheaper egress, TLS, ek custom domain milta hai.',
      },
      {
        wrong: `# invalidating the CDN on every deploy to push new asset versions
# deploy pipeline last step:
$ aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
# every deploy -> a full invalidation. problems:
#   - invalidations past the first 1000 paths/month cost $0.005 each; "/*" plus
#     frequent deploys adds up
#   - an invalidation takes minutes to propagate; during it, some edges serve old,
#     some new -> a user can load index.html (new) that references app.js (old,
#     still cached) -> broken page
#   - it's a race, not a guarantee`,
        right: `# use CONTENT-HASHED filenames so a new version is a new URL - no invalidation:
#   build output:  app.4f2a9c.js   vendor.8b1e07.css   (hash in the name)
#   index.html references those exact names; index.html itself is cached SHORT
#   (Cache-Control: no-cache, or s-maxage=60) so it updates quickly
#   old app.<oldhash>.js stays cached and valid for anyone mid-session; it just
#   stops being referenced and ages out on its own TTL
# result: atomic deploys (the new index points at the new bundle), zero
# invalidation cost, no old/new mismatch window.
# keep invalidation for the rare emergency (a leaked file, a bad cache of an API
# response) - not the deploy path.`,
        why: 'Invalidating the CDN on every deployment treats cache invalidation as the mechanism for shipping new asset versions, and it is a poor fit for that. Invalidations cost money beyond a small monthly free allowance, so a wildcard invalidation on every deploy accumulates charges. More importantly, an invalidation is not instantaneous — it takes minutes to propagate across all edge locations, and during that window some edges have purged and refetched while others are still serving the previous version. A user who loads the new \`index.html\` from one edge but gets the old \`app.js\` from another, still-cached, edge sees a broken page, because the HTML references a bundle the JavaScript no longer matches. The correct approach is to make each asset version a distinct URL by putting a content hash in the filename: a new build produces \`app.4f2a9c.js\`, the HTML references that exact name, and the old \`app.<oldhash>.js\` remains cached and valid for anyone who is mid-session, simply ceasing to be referenced and aging out on its own. Only \`index.html\` needs a short cache so it picks up the new references quickly. This gives atomic deployments with no invalidation cost and no window where old and new assets are mixed. Invalidation is then reserved for genuine emergencies like purging a leaked file.',
        whyHi: 'Har deployment par CDN invalidate karna cache invalidation ko naye asset versions ship karne ke mechanism ke roop mein treat karता hai, aur ye us ke liye ek poor fit hai. Invalidations ek chhoti monthly free allowance ke aage paisa cost karते hain. Zyada importantly, ek invalidation instantaneous nahi hai — ise saare edge locations ke across propagate hone mein minutes lagते hain, aur us window ke dauraan kuch edges ne purge aur refetch kiya hai jabki doosre abhi bhi previous version serve kar rahe hain. Ek user jo ek edge se naya \`index.html\` load karता hai par doosre, abhi bhi cached, edge se purana \`app.js\` paता hai ek broken page dekhता hai. Correct approach har asset version ko ek distinct URL banana hai filename mein ek content hash daal kar. Sirf \`index.html\` ko ek short cache chahिए.',
      },
      {
        wrong: `# a cache key that includes every query param, header, and cookie
# CloudFront behavior: "forward all query strings, all headers, all cookies to
# the origin and include them in the cache key"
# now:
#   /product/42?utm_source=x&utm_campaign=y&fbclid=z&sessionid=abc  and
#   /product/42?utm_source=w                                          and
#   /product/42
# are THREE different cache entries for the SAME response. every marketing link,
# every A/B cookie, every session id = a new cache miss. hit rate ~2%.
# the CDN is now a slow proxy that also costs you money.`,
        right: `# the cache key is ONLY what genuinely changes the response:
#   for a product page:  path + maybe  ?variant=  and an  Accept-Language  header.
#   NOTHING else. explicitly:
#     query strings:   whitelist  [variant, page]     (drop utm_*, fbclid, gclid, ...)
#     headers:         whitelist  [Accept-Language]   (NOT User-Agent, NOT Cookie)
#     cookies:         none in the cache key (forward none, or a tiny whitelist)
#   -> /product/42?utm_source=anything  all hit ONE cache entry. hit rate ~95%.
# forward the marketing params to the origin if it needs them for analytics, but
# do NOT put them in the CACHE KEY.
# origin sets  Vary  carefully; the CDN respects it.`,
        why: 'The cache key is the set of request attributes that the CDN treats as making two requests distinct responses, and every attribute you add to it multiplies the number of cache entries for what may be a single underlying response. Forwarding and keying on all query strings means that every marketing parameter — \`utm_source\`, \`fbclid\`, \`gclid\` — produces a separate cache entry for the same page, so a product page shared across a hundred campaigns has a hundred cache entries and a near-zero hit rate. Keying on all headers pulls in \`User-Agent\`, which is effectively unique per device. Keying on cookies pulls in session identifiers, making every user\'s requests uncacheable. The result is a CDN that is functionally a slow proxy in front of the origin, adding a hop and a bill without the caching benefit. The correct cache key contains only the attributes that genuinely change the response: the path, and a short explicit whitelist of the query parameters that select a real variant (\`variant\`, \`page\`) and the headers that do (\`Accept-Language\`). Marketing parameters can still be forwarded to the origin for analytics, but they must be excluded from the cache key so that all the campaign-tagged URLs collapse onto one cached entry.',
        whyHi: 'Cache key request attributes ka wo set hai jise CDN do requests ko distinct responses banane ke roop mein treat karता hai, aur har attribute jo aap ise add karते ho jo ek single underlying response ho sakता hai iske liye cache entries ki number multiply karता hai. Saare query strings par forward aur key karna ka matlab har marketing parameter — \`utm_source\`, \`fbclid\`, \`gclid\` — same page ke liye ek separate cache entry produce karता hai, to ek sau campaigns ke across shared ek product page ke ek sau cache entries hain aur ek near-zero hit rate. Result ek CDN hai jo functionally origin ke saamne ek slow proxy hai. Correct cache key mein sirf wo attributes hain jo genuinely response change karते hain: path, aur real variant select karने wale query parameters ki ek short explicit whitelist. Marketing parameters abhi bhi origin ko forward kiye ja sakते hain analytics ke liye, par unhe cache key se exclude hona chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**A public bucket, an exposed export** — a company served its web app\'s images from a `public-read` bucket. A nightly job wrote customer CSV exports to the same bucket under `exports/`. A researcher found the bucket, listed it, and downloaded 90 days of exports. The fix was Block Public Access + CloudFront OAC, done in an afternoon; the disclosure took months.',
        hi: '**Ek public bucket, ek exposed export** — ek company ne apne web app ki images ek `public-read` bucket se serve ki. Ek nightly job ne customer CSV exports usi bucket mein `exports/` ke tahat likhे. Ek researcher ne bucket dhoondha aur 90 din ke exports download kiye.',
      },
      {
        en: '**`/*` invalidation on every deploy, broken pages** — a frontend team ran a full CloudFront invalidation per deploy. During the ~4-minute propagation, users hit a new `index.html` referencing an `app.js` that some edges still served old — a white screen for ~15% of sessions per deploy. Switching to hashed filenames removed the invalidation and the mismatch window entirely.',
        hi: '**Har deploy par `/*` invalidation, broken pages** — ek frontend team ne per deploy ek full CloudFront invalidation chalaya. ~4-minute propagation ke dauraan, users ek naya `index.html` hit karte the jo ek `app.js` reference karta tha jo kuch edges abhi bhi purana serve karte the. Hashed filenames par switch karna invalidation aur mismatch window poori tarah hata diya.',
      },
      {
        en: '**2% hit rate from over-keyed cache** — an e-commerce CDN forwarded all cookies and query strings. Cache hit rate was 2%; the CDN cost more than the direct-serve would have. Trimming the cache key to path + `?variant` + `Accept-Language` took the hit rate to 94% and cut origin load by 40x.',
        hi: '**Over-keyed cache se 2% hit rate** — ek e-commerce CDN ne saare cookies aur query strings forward kiye. Cache hit rate 2% tha. Cache key ko path + `?variant` + `Accept-Language` tak trim karna hit rate ko 94% tak le gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'How does object storage differ from a filesystem, and what are storage classes and lifecycle rules for?',
        qHi: 'Object storage ek filesystem se kaise differ karta hai, aur storage classes aur lifecycle rules kis liye hain?',
        a: 'Object storage stores data as objects — an opaque blob addressed by a flat key within a bucket — with no real directory hierarchy (slashes in keys are just characters), no limit on object count or total size, and eleven nines of durability because each object is redundantly stored across multiple availability zones. Unlike a filesystem there is no partial write, no append in place, no rename that is not a copy-and-delete, and no POSIX semantics; you PUT and GET whole objects. It is the default home for user uploads, backups, data-lake data, artifacts, logs, and static assets. Storage classes trade storage price against retrieval speed and cost: Standard for hot data, Standard-Infrequent Access and One Zone-IA for data accessed occasionally with a per-gigabyte retrieval fee and a thirty-day minimum, the Glacier tiers for archive data that is very cheap to store but slow and metered to retrieve with ninety-to-a-hundred-and-eighty-day minimums, and Intelligent-Tiering which moves objects between tiers automatically based on observed access for a small monitoring fee. Lifecycle rules automate transitions between classes and expiration by object age and prefix — "logs transition to IA after 30 days, Glacier after 90, delete after seven years" — and also expire old versions and abort incomplete multipart uploads that would otherwise accumulate as invisible cost. Together they encode a workload\'s access curve into the storage cost, often reducing a bill by an order of magnitude with no application change.',
        aHi: 'Object storage data ko objects ke roop mein store karta hai — ek opaque blob jo ek bucket ke andar ek flat key se addressed hai — bina ek real directory hierarchy ke, objects ki count ya total size par koi limit nahi, aur gyarah nines ki durability. Ek filesystem ke ulat koi partial write nahi, koi append in place nahi, koi rename nahi jo copy-and-delete nahi hai. Storage classes storage price ko retrieval speed aur cost ke against trade karti hain: Standard hot data ke liye, Standard-Infrequent Access occasionally accessed data ke liye ek retrieval fee ke saath, Glacier tiers archive data ke liye, aur Intelligent-Tiering jo objects ko tiers ke beech automatically move karta hai. Lifecycle rules classes ke beech transitions aur expiration ko object age aur prefix se automate karti hain. Ek saath wo ek workload ki access curve ko storage cost mein encode karti hain.',
      },
      {
        q: 'What is the correct way to serve assets and user content from a bucket, and why not just make the bucket public?',
        qHi: 'Ek bucket se assets aur user content serve karne ka correct tarika kya hai, aur bucket ko bas public kyun na banayein?',
        a: 'The correct approach keeps the bucket private with Block Public Access enabled and serves content through a CDN configured with origin access — Origin Access Control on CloudFront, a Private Endpoint plus Front Door origin on Azure — which makes the provider write a bucket policy allowing reads only from that specific distribution. Users reach content through the CDN\'s domain, a direct request to the storage URL is denied, and you get edge caching, cheaper egress, TLS, a custom domain, and a web application firewall as part of it. For user uploads the browser talks to storage directly using a presigned URL that your backend signs, valid for a few minutes and for exactly one object and one operation, so file bytes never pass through your servers; for private downloads a CloudFront signed URL grants one user time-limited access. Making the bucket public instead is convenient and is the cause of a large fraction of publicised cloud data breaches. A public-read policy lets anyone download any object and often list the bucket, so the moment someone accidentally uploads something sensitive — a database dump, an environment file, a customer export — it is world-readable and automated scanners find it within minutes. It is also more expensive because every download is billed at full egress with no caching. The private-bucket-plus-CDN pattern is both more secure and cheaper.',
        aHi: 'Correct approach bucket ko Block Public Access enabled ke saath private rakhta hai aur content ek CDN ke through serve karta hai jo origin access ke saath configured hai. Users content ko CDN ke domain ke through reach karte hain, storage URL ko ek direct request denied hai, aur aapko edge caching, cheaper egress, TLS milta hai. User uploads ke liye browser storage se directly baat karta hai ek presigned URL use karke jo aapka backend sign karta hai. Bucket ko public banana convenient hai aur publicised cloud data breaches ke ek large fraction ka cause hai. Ek public-read policy kisi bhi ko koi bhi object download karne deti hai, to jis pal koi accidentally kuch sensitive upload karta hai ye world-readable hai. Ye zyada expensive bhi hai.',
      },
      {
        q: 'How should you handle new asset versions with a CDN, and how do you design the cache key?',
        qHi: 'Aap ek CDN ke saath naye asset versions kaise handle karna chahiye, aur aap cache key kaise design karte ho?',
        a: 'You handle new asset versions with content-hashed filenames rather than cache invalidation. A build produces \`app.4f2a9c.js\`, the HTML references that exact name, and a new build produces a new hash and therefore a new URL; the old \`app.<oldhash>.js\` remains cached and valid for anyone mid-session and simply stops being referenced and ages out. Only \`index.html\` needs a short cache so it picks up the new references quickly. This gives atomic deployments with no invalidation cost and no window where a new HTML file references an old, still-cached bundle — which is exactly the broken-page failure you get from invalidating on every deploy, because invalidation takes minutes to propagate and different edges are in different states during it. Invalidation is reserved for genuine emergencies like purging a leaked file. The cache key is the set of request attributes the CDN treats as making requests distinct, and it should contain only what genuinely changes the response: the path, plus a short explicit whitelist of query parameters that select a real variant and headers that do, such as \`Accept-Language\`. Forwarding and keying on all query strings means every marketing parameter produces a separate cache entry for the same page and the hit rate collapses; keying on all headers pulls in \`User-Agent\`; keying on cookies pulls in session identifiers. Marketing parameters can still be forwarded to the origin for analytics but must be excluded from the cache key.',
        aHi: 'Aap naye asset versions ko content-hashed filenames se handle karte ho cache invalidation ke bajaay. Ek build \`app.4f2a9c.js\` produce karta hai, HTML us exact name ko reference karta hai, aur ek naya build ek naya hash produce karta hai. Purana \`app.<oldhash>.js\` cached aur valid rehta hai kisi ke liye jo mid-session hai. Sirf \`index.html\` ko ek short cache chahिए. Ye no invalidation cost ke saath atomic deployments deta hai aur koi window nahi jahaan ek naya HTML file ek purana, abhi bhi cached bundle reference karta hai. Cache key request attributes ka set hai jise CDN requests ko distinct banane ke roop mein treat karta hai, aur isme sirf wo hona chahिए jo genuinely response change karta hai: path, plus query parameters ki ek short explicit whitelist jo ek real variant select karte hain. Saare query strings par forward aur key karna ka matlab har marketing parameter same page ke liye ek separate cache entry produce karta hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe object storage (key model, durability, consistency), the storage classes, and what a lifecycle rule does — with a concrete logs example.',
        taskHi: 'Ek comment mein, object storage describe karo (key model, durability, consistency), storage classes.',
        hint: 'OBJECT STORAGE (S3 / Azure Blob / GCS): a flat KEY → an opaque BLOB within a bucket (`s3://bucket/path/to/obj` — slashes are just characters, NO real directory hierarchy). No limit on object count or total size. ELEVEN NINES durability (each object redundant across multiple AZs). NOT a filesystem: no partial write, no append in place, no rename-that-isn\'t-copy-and-delete, no POSIX. CONSISTENCY: read-after-write for new objects AND (S3 since 2020) for overwrites + deletes; listings may lag slightly. STORAGE CLASSES (cheaper to store → slower + pricier to retrieve): STANDARD (hot, served constantly); INTELLIGENT-TIERING (auto-moves objects between tiers by observed access, small per-object monitoring fee — the default when access is unknown); STANDARD-IA / ONE ZONE-IA (infrequent access, a per-GB RETRIEVAL fee + a 30-day minimum; One Zone-IA drops cross-AZ redundancy for more discount); GLACIER INSTANT / FLEXIBLE / DEEP ARCHIVE (archive, very cheap to store — Deep Archive ~$1/TB/mo — retrieval ms-to-hours, 90-180 day minimums). LIFECYCLE RULE: automates transitions + expiration by object AGE and PREFIX; also expires non-current VERSIONS and aborts INCOMPLETE MULTIPART UPLOADS (which otherwise bill as invisible storage). CONCRETE LOGS EXAMPLE (500 GB/mo, queried heavily ~14 d, occasionally ~90 d, kept 7 y for compliance, then never read): rule → Standard→Standard-IA @30 d→Glacier IR @90 d→Deep Archive @180 d→expire @2557 d. Steady-state ~18 TB drops from ~$414/mo (all Standard) to ~$46/mo (mostly Deep Archive) — SAME data, NO app change, just a bucket rule. Caveat: reading archived data later incurs retrieval fees (acceptable because the access pattern says it almost never happens). Azure: identical — Hot→Cool→Cold→Archive lifecycle management.',
        hintHi: 'OBJECT STORAGE: ek flat KEY → ek opaque BLOB ek bucket ke andar. Objects count ya total size par koi limit nahi. ELEVEN NINES durability. NOT a filesystem. CONSISTENCY: naye objects AUR overwrites/deletes ke liye read-after-write. STORAGE CLASSES: STANDARD (hot); INTELLIGENT-TIERING (auto-move, default jab access unknown); STANDARD-IA / ONE ZONE-IA (per-GB RETRIEVAL fee + 30-day minimum); GLACIER INSTANT / FLEXIBLE / DEEP ARCHIVE (archive, ~$1/TB/mo, 90-180 day minimums). LIFECYCLE RULE: age + prefix se transitions + expiration automate karti hai; non-current VERSIONS + INCOMPLETE MULTIPART UPLOADS bhi. LOGS EXAMPLE: Standard→Standard-IA @30 d→Glacier IR @90 d→Deep Archive @180 d→expire @2557 d. ~18 TB ~$414/mo se ~$46/mo tak. Azure: Hot→Cool→Cold→Archive.',
      },
      {
        task: 'In a comment, explain the private-bucket + presigned-URL + CDN-with-origin-access pattern, and why making a bucket public is the wrong move.',
        taskHi: 'Ek comment mein, private-bucket + presigned-URL + CDN-with-origin-access pattern samjhao.',
        hint: 'DEFAULT: a PRIVATE bucket, Block Public Access ON at BOTH the account and bucket level, no policy granting anyone. Reach objects 3 ways: (1) PRESIGNED URL — your backend (holding an IAM role that can PutObject/GetObject on the prefix) generates a URL embedding a signature valid for N minutes for EXACTLY ONE object + ONE operation (GET or PUT). The browser uploads/downloads DIRECTLY to/from storage — file bytes NEVER pass through your servers. Pin ContentType + a max size via a presigned POST policy. On `s3:ObjectCreated:*` → an event fires → a Lambda/SQS/EventBridge processes the upload. (2) A CDN with ORIGIN ACCESS — CloudFront distribution, origin = the bucket, Origin Access Control enabled → AWS writes a bucket policy allowing `s3:GetObject` ONLY from this distribution\'s service principal (condition on the distribution ARN). Users hit `https://cdn.acme.io/...`; a DIRECT S3 URL returns 403. For private/paid downloads: a CloudFront SIGNED URL / signed cookie your app issues short-lived; the edge validates the signature. (3) An IAM principal (a role on a workload) calling the API directly. WHY PUBLIC IS WRONG: a `public-read` ACL / a `"Principal":"*"` bucket policy lets ANYONE download any object (and often LIST the bucket) → the moment someone accidentally uploads a DB dump / a `.env` / a customer export, it is world-readable and automated scanners find public buckets within MINUTES (the #1 cloud data-exposure headline). It is also MORE EXPENSIVE — every download is full S3 egress, from any region, uncached. Private-bucket + CDN is BOTH more secure AND cheaper (cached, edge egress is cheaper, cache hits = $0 origin transfer) and throws in TLS + a custom domain + a WAF. STATIC WEBSITE HOSTING mode has no TLS / no custom domain / limited caching — always put a CDN in front and use the bucket purely as the origin. Azure: SAS tokens (= presigned URLs), Event Grid (= event notifications), Front Door + a Private Endpoint (= OAC).',
        hintHi: 'DEFAULT: ek PRIVATE bucket, Block Public Access ON (account + bucket dono). Objects 3 tarikon se reach karo: (1) PRESIGNED URL — aapka backend ek URL generate karta hai ek signature ke saath jo N minutes ke liye EXACTLY EK object + EK operation ke liye valid hai. Browser DIRECTLY storage se upload/download karta hai — file bytes KABHI aapke servers se nahi guzarte. (2) ORIGIN ACCESS ke saath ek CDN — Origin Access Control enabled → AWS ek bucket policy likhta hai `s3:GetObject` SIRF is distribution ke service principal se allow karti. DIRECT S3 URL → 403. Private downloads: ek CloudFront SIGNED URL. (3) Ek IAM principal API call karta hua. PUBLIC KYUN GALAT: ek `public-read` ACL kisi bhi ko koi object download karne deta hai → accidentally uploaded sensitive file world-readable, scanners MINUTES mein dhoondh lete hain. Zyada EXPENSIVE bhi. Private-bucket + CDN DONO zyada secure AUR sasta. Azure: SAS tokens, Event Grid, Front Door + Private Endpoint.',
      },
      {
        task: 'In a comment, explain how to ship new asset versions with a CDN (hashed filenames vs invalidation) and how to design the cache key.',
        taskHi: 'Ek comment mein, ek CDN ke saath naye asset versions kaise ship karein samjhao.',
        hint: 'SHIP NEW VERSIONS WITH CONTENT-HASHED FILENAMES, not invalidation: a build produces `app.4f2a9c.js` / `vendor.8b1e07.css` (hash IN the name); `index.html` references those exact names and is itself cached SHORT (`Cache-Control: no-cache` or `s-maxage=60`) so it updates fast. A new build → a new hash → a NEW URL. The old `app.<oldhash>.js` stays cached + valid for anyone mid-session; it just stops being referenced and ages out on its own TTL. Result: ATOMIC deploys (the new index points at the new bundle), ZERO invalidation cost, NO old/new mismatch window. WHY NOT `create-invalidation --paths "/*"` ON EVERY DEPLOY: (a) invalidations past ~1000 paths/month cost ~$0.005 each; (b) an invalidation takes MINUTES to propagate → during it some edges serve new, some old → a user loads the new `index.html` referencing `app.js` that another edge still serves OLD → BROKEN PAGE (white screen) for a chunk of sessions per deploy. Keep invalidation for genuine EMERGENCIES only (a leaked file, a bad cache of an API response). CACHE KEY = the request attributes the CDN treats as making responses DISTINCT. Include ONLY what genuinely changes the response: the PATH + a short EXPLICIT WHITELIST of query params that select a real variant (`variant`, `page`) + headers that do (`Accept-Language`). EXCLUDE: `utm_*` / `fbclid` / `gclid` (marketing — forward to the origin for analytics if needed, but NOT in the cache key), `User-Agent` (unique per device), `Cookie` / session ids (unique per user). Over-keying → `/product/42?utm_source=x` and `?utm_source=w` and bare are 3 entries for 1 response → hit rate ~2%, the CDN becomes a slow proxy that costs money. Right-sized → ~95% hit rate, origin load down 40×. The origin should set `Vary` carefully; the CDN respects it.',
        hintHi: 'CONTENT-HASHED FILENAMES SE SHIP KARO, invalidation se nahi: ek build `app.4f2a9c.js` produce karta hai (hash NAME mein); `index.html` un exact names ko reference karta hai aur khud SHORT cached hai (`s-maxage=60`). Naya build → naya hash → NAYA URL. Purana `app.<oldhash>.js` cached + valid rehta hai kisi ke liye jo mid-session hai. Result: ATOMIC deploys, ZERO invalidation cost, NO mismatch window. HAR DEPLOY PAR `--paths "/*"` KYUN NAHI: (a) ~1000 paths/month ke aage paisa; (b) invalidation MINUTES leta hai propagate hone mein → kuch edges naya, kuch purana → BROKEN PAGE. Invalidation sirf EMERGENCIES ke liye. CACHE KEY = attributes jo CDN responses ko DISTINCT banane ke roop mein treat karta hai. SIRF wo include karo jo genuinely response change karta hai: PATH + query params ki ek short WHITELIST (`variant`, `page`) + `Accept-Language`. EXCLUDE: `utm_*`/`fbclid` (marketing), `User-Agent`, `Cookie`/session ids. Over-keying → hit rate ~2%. Right-sized → ~95%.',
      },
    ],

    keyTakeaways: [
      'OBJECT STORAGE (S3/Blob/GCS): a flat key → an opaque blob, no count/size limit, 11 nines durability (redundant across AZs), read-after-write consistent. NOT a filesystem. STORAGE CLASSES trade store price vs retrieval: Standard (hot), Intelligent-Tiering (auto-move, the default when access is unknown), Standard-IA / One Zone-IA (retrieval fee + 30-day min), Glacier Instant/Flexible/Deep Archive (~$1/TB/mo, 90-180-day mins).',
      'LIFECYCLE RULES age objects down by age + prefix (Standard → IA @30d → Glacier @90d → Deep Archive @180d → expire), and also expire old versions + abort stale multipart uploads. VERSIONING + Object Lock + MFA-delete are the ransomware / accidental-delete defence. REPLICATION (CRR/SRR) copies to another bucket/region for DR or locality.',
      'DEFAULT: a PRIVATE bucket (Block Public Access ON). Reach objects via a PRESIGNED URL (your backend signs a URL valid N minutes for one object + one op — the browser transfers directly, no bytes through your servers), a CDN with ORIGIN ACCESS (the bucket stays private; only the CDN can read it; a direct S3 URL → 403), or an IAM role. NEVER make the bucket public — it is the #1 cloud data-exposure cause and more expensive.',
      'A CDN caches content at edge PoPs; a MISS fetches from the ORIGIN. Ship new asset versions with CONTENT-HASHED FILENAMES (`app.4f2a9c.js`) + a short-cached `index.html` — atomic, no invalidation cost, no old/new mismatch window. Invalidation is for emergencies only (it takes minutes to propagate → broken pages if used on every deploy).',
      'The CACHE KEY = only what genuinely changes the response: path + a short whitelist of variant-selecting query params + `Accept-Language`. EXCLUDE `utm_*`/`fbclid`, `User-Agent`, and cookies/session ids — over-keying collapses the hit rate and makes the CDN a slow proxy. A CDN usually LOWERS the bill (edge egress is cheaper; cache hits = $0 origin transfer). AZURE: Blob tiers + lifecycle, SAS tokens (= presigned URLs), Event Grid, Front Door + Private Endpoint (= OAC).',
    ],
    keyTakeawaysHi: [
      'OBJECT STORAGE (S3/Blob/GCS): ek flat key → ek opaque blob, koi count/size limit nahi, 11 nines durability, read-after-write consistent. NOT a filesystem. STORAGE CLASSES store price vs retrieval trade karti hain: Standard (hot), Intelligent-Tiering (auto-move, default jab access unknown), Standard-IA / One Zone-IA (retrieval fee + 30-day min), Glacier Instant/Flexible/Deep Archive (~$1/TB/mo, 90-180-day mins).',
      'LIFECYCLE RULES objects ko age + prefix se age down karti hain (Standard → IA @30d → Glacier @90d → Deep Archive @180d → expire), aur old versions + stale multipart uploads bhi. VERSIONING + Object Lock + MFA-delete ransomware defence hain. REPLICATION (CRR/SRR) DR ya locality ke liye doosre bucket/region mein copy karti hai.',
      'DEFAULT: ek PRIVATE bucket (Block Public Access ON). Objects reach karo ek PRESIGNED URL se (aapka backend ek URL sign karta hai N minutes ke liye ek object + ek op ke liye — browser directly transfer karta hai), ORIGIN ACCESS ke saath ek CDN (bucket private rehta hai; direct S3 URL → 403), ya ek IAM role. KABHI bucket public mat banao — ye #1 cloud data-exposure cause hai aur zyada expensive.',
      'Ek CDN content ko edge PoPs par cache karta hai; ek MISS ORIGIN se fetch karta hai. Naye asset versions CONTENT-HASHED FILENAMES se ship karo (`app.4f2a9c.js`) + ek short-cached `index.html` — atomic, no invalidation cost, no mismatch window. Invalidation sirf emergencies ke liye (ye minutes leta hai propagate hone mein).',
      'CACHE KEY = sirf wo jo genuinely response change karta hai: path + variant-selecting query params ki ek short whitelist + `Accept-Language`. EXCLUDE `utm_*`/`fbclid`, `User-Agent`, aur cookies/session ids — over-keying hit rate collapse karta hai. Ek CDN usually bill KAM karta hai. AZURE: Blob tiers + lifecycle, SAS tokens, Event Grid, Front Door + Private Endpoint.',
    ],
  },

  {
    slug: 'ops-load-balancing-dns-and-traffic-management',
    title: 'Load Balancing, DNS & Traffic Management',
    titleHi: 'Load Balancing, DNS Aur Traffic Management',
    description:
      'How a request finds a healthy server: DNS resolves a name to an address (or to a load balancer), the load balancer spreads connections across a target group and removes failing targets, and DNS routing policies steer traffic by weight, latency, geography, or health for canaries, multi-region, and failover. AWS ALB/NLB and Route 53 as the worked example, Azure alongside.',
    descriptionHi:
      'Ek request ek healthy server kaise dhoondhta hai: DNS ek naam ko ek address (ya ek load balancer) mein resolve karta hai, load balancer connections ko ek target group ke across spread karta hai aur failing targets hataता hai, aur DNS routing policies traffic ko weight, latency, geography, ya health se steer karti hain canaries, multi-region, aur failover ke liye. AWS ALB/NLB aur Route 53 worked example ke roop mein, Azure alongside.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A call centre with a phone menu and a floor of agents.** DNS is the phone book: it turns "the support line" into a number you can dial, and it can list several numbers with instructions like "try the nearest office first" or "send 10% of callers to the new team". The number you dial reaches a switchboard (the load balancer), which knows which agents are logged in and free, routes your call to one, and stops sending calls to an agent who has gone quiet (the health check). If a whole office loses power, the phone book\'s failover entry sends everyone to the backup office instead. The caller never picks an agent; the switchboard does, from the pool that is actually answering.',
      hi: '**Ek call centre ek phone menu aur agents ke ek floor ke saath.** DNS phone book hai: ye "support line" ko ek number mein badalता hai jise aap dial kar sakte ho, aur ye kई numbers list kar sakta hai instructions ke saath jaise "pehle nearest office try karo" ya "10% callers ko new team ko bhejo". Jo number aap dial karte ho ek switchboard (load balancer) tak pahunchta hai, jo jaanता hai kaun se agents logged in aur free hain, aapki call ek ko route karta hai, aur ek agent ko calls bhejna band karta hai jo quiet ho gaya (health check). Agar ek poora office power khota hai, phone book ka failover entry sabko backup office ko bhejता hai. Caller kabhi ek agent pick nahi karता; switchboard karता hai.',
    },

    simple: `**DNS** — turns a name into an address. Records:
\`\`\`
A / AAAA   name -> IPv4 / IPv6 address
CNAME      name -> another name (can't be at the zone apex; adds a lookup)
ALIAS / ANAME (Route 53 "alias", Azure "alias record")  name -> an AWS resource
           (an ALB, a CloudFront dist, an S3 website) - works at the apex, no extra
           lookup, free. USE THIS for pointing your domain at a load balancer.
MX/TXT/NS/SRV/CAA  mail / verification / delegation / service / cert-authority
TTL        how long resolvers cache the answer. low (60s) before a planned cutover,
           normal (300-3600s) otherwise. clients + ISPs don't always honour it.
\`\`\`

**LOAD BALANCER** — one stable endpoint in front of many targets.
\`\`\`
LAYER 7 (ALB / Azure Application Gateway / GCLB)  understands HTTP: path + host
  routing ("/api/* -> api-tg", "app.acme.io -> web-tg"), header/cookie rules, TLS
  termination, redirects, WAF integration, sticky sessions via a cookie, gRPC/WS.
LAYER 4 (NLB / Azure Load Balancer)  TCP/UDP only, no HTTP awareness. ultra-low
  latency, millions of connections, static IP / PrivateLink source, preserves the
  client IP. use for: non-HTTP, extreme throughput, or when you need a fixed IP.
TARGET GROUP  the pool: instances / IPs / Lambda / ECS tasks. the LB HEALTH-CHECKS
  each target (a path + expected codes + interval + healthy/unhealthy thresholds)
  and only routes to passing ones. a failing target is drained, not killed.
ALGORITHMS   round-robin, least-outstanding-requests (better for uneven requests),
  or (NLB) flow hash. CONNECTION DRAINING / deregistration delay lets in-flight
  requests finish before a target leaves.
CROSS-ZONE   spread evenly across AZ targets (ALB: always on; NLB: opt-in, may add
  cross-AZ transfer $).
\`\`\`

**ROUTE 53 ROUTING POLICIES** (how DNS picks which record to return):
\`\`\`
SIMPLE        one record. no smarts.
WEIGHTED      split by weight: 90 -> old, 10 -> canary. also blue/green + gradual shift.
LATENCY       return the region with the lowest measured latency to the resolver.
GEOLOCATION   route by the user's continent/country (compliance, localisation, geo-block).
GEOPROXIMITY  route by geographic distance, with a bias knob to shift load between regions.
FAILOVER      primary + secondary; a health check on the primary flips DNS to the
              secondary when it fails (DR). watch the TTL - it bounds your failover time.
MULTI-VALUE   return several healthy records (poor-man's LB / more resilient than simple).
health checks  Route 53 probes an endpoint (or a CloudWatch alarm) and withholds
              unhealthy records from responses.
\`\`\`

**AZURE:** Application Gateway (L7 + WAF) / Azure Load Balancer (L4) / Front Door
(global L7 + CDN + WAF) / Traffic Manager (DNS-based global routing: priority,
weighted, performance, geographic, subnet, multi-value).`,

    simpleHi: `**DNS** — ek naam ko ek address mein badalता hai. Records:
\`\`\`
A / AAAA   naam -> IPv4 / IPv6 address
CNAME      naam -> ek doosra naam (zone apex par nahi ho sakta; ek lookup add karta hai)
ALIAS / ANAME (Route 53 "alias", Azure "alias record")  naam -> ek AWS resource
           (ek ALB, ek CloudFront dist) - apex par kaam karta hai, koi extra lookup
           nahi, free. apne domain ko ek load balancer par point karne ke liye YE USE karo.
MX/TXT/NS/SRV/CAA  mail / verification / delegation / service / cert-authority
TTL        resolvers answer kitni der cache karte hain. ek planned cutover se pehle low (60s).
\`\`\`

**LOAD BALANCER** — kई targets ke saamne ek stable endpoint.
\`\`\`
LAYER 7 (ALB / Azure Application Gateway / GCLB)  HTTP samajhता hai: path + host
  routing, header/cookie rules, TLS termination, redirects, WAF integration,
  ek cookie ke through sticky sessions, gRPC/WS.
LAYER 4 (NLB / Azure Load Balancer)  sirf TCP/UDP, koi HTTP awareness nahi.
  ultra-low latency, millions of connections, static IP / PrivateLink source,
  client IP preserve karta hai. use for: non-HTTP, extreme throughput, ya fixed IP.
TARGET GROUP  pool: instances / IPs / Lambda / ECS tasks. LB har target ko
  HEALTH-CHECK karta hai aur sirf passing walon ko route karta hai. ek failing
  target drained hai, killed nahi.
ALGORITHMS   round-robin, least-outstanding-requests, ya (NLB) flow hash.
  CONNECTION DRAINING in-flight requests ko finish hone deta hai target leave hone se pehle.
CROSS-ZONE   AZ targets ke across evenly spread (ALB: always on; NLB: opt-in).
\`\`\`

**ROUTE 53 ROUTING POLICIES** (DNS kaise pick karta hai kaun sा record return kare):
\`\`\`
SIMPLE        ek record. koi smarts nahi.
WEIGHTED      weight se split: 90 -> old, 10 -> canary. blue/green + gradual shift bhi.
LATENCY       resolver ke lowest measured latency wale region return karo.
GEOLOCATION   user ke continent/country se route karo (compliance, localisation, geo-block).
GEOPROXIMITY  geographic distance se route karo, regions ke beech load shift karne ke bias knob ke saath.
FAILOVER      primary + secondary; primary par ek health check fail hone par DNS ko
              secondary par flip karता hai (DR). TTL dekho - ye aapke failover time ko bound karता hai.
MULTI-VALUE   kई healthy records return karo.
health checks  Route 53 ek endpoint probe karता hai aur unhealthy records ko responses se withhold karता hai.
\`\`\`

**AZURE:** Application Gateway (L7 + WAF) / Azure Load Balancer (L4) / Front Door
(global L7 + CDN + WAF) / Traffic Manager (DNS-based global routing).`,

    content: `## DNS

DNS turns a human-readable name into an address. The record types you use:

- **A** and **AAAA** map a name to an IPv4 and IPv6 address.
- **CNAME** maps a name to another name, adding a resolution step. A CNAME cannot exist at the **zone apex** (the bare domain \`acme.io\`), because the apex must also carry the zone\'s NS and SOA records.
- **Alias records** (Route 53 "alias", Azure "alias record", GCP has similar) map a name directly to a cloud resource — a load balancer, a CloudFront distribution, an S3 website endpoint — and are resolved by the DNS service to the current address of that resource. They work at the apex, add no extra lookup, and are free. This is what you use to point your domain at a load balancer.
- **MX** (mail), **TXT** (verification, SPF, DKIM), **NS** (delegation), **SRV** (service location), **CAA** (which certificate authorities may issue for the domain).
- **TTL** controls how long resolvers cache an answer. You lower it, to something like 60 seconds, a day or two before a planned DNS cutover so the change propagates quickly, and raise it back afterwards. Clients, operating systems, and ISP resolvers do not always honour the TTL, so DNS changes are never truly instantaneous.

## Load balancers

A load balancer presents one stable endpoint and distributes incoming connections across a pool of targets, removing targets that fail a health check.

**Layer 7** load balancers — the AWS Application Load Balancer, Azure Application Gateway, Google Cloud Load Balancing — understand HTTP. They route on path and host (\`/api/*\` to one target group, \`app.acme.io\` to another), match on headers and cookies, terminate TLS, issue redirects, integrate with a web application firewall, provide sticky sessions by setting a cookie, and support gRPC and WebSockets. This is the default for HTTP services.

**Layer 4** load balancers — the AWS Network Load Balancer, Azure Load Balancer — operate on TCP and UDP with no HTTP awareness. They offer the lowest possible latency, scale to millions of connections, can present a static IP address and be an endpoint-service source for PrivateLink, and preserve the client\'s source IP. Use one for non-HTTP protocols, for extreme connection volume, or when you specifically need a fixed IP address.

The **target group** is the pool the load balancer routes to — instances, IP addresses, Lambda functions, ECS tasks. The load balancer runs a **health check** against each target: a request to a configured path, expecting configured status codes, at an interval, with thresholds for how many consecutive successes mark a target healthy and how many failures mark it unhealthy. Traffic goes only to targets currently passing, and a target that starts failing is drained of its existing connections rather than having them cut. **Connection draining** (also called deregistration delay) gives in-flight requests a window to complete when a target is intentionally removed, for example during a deployment.

Routing **algorithms** include round-robin, least-outstanding-requests (which sends each new request to the target with the fewest in flight, better when request cost varies a lot), and for the Network Load Balancer a flow hash. **Cross-zone load balancing** spreads traffic evenly across targets in all availability zones regardless of how many targets are in each; the Application Load Balancer always does this, the Network Load Balancer makes it opt-in because it can add cross-AZ data transfer charges.

## Route 53 routing policies

DNS routing policies decide which record the DNS service returns for a query, which lets DNS itself do traffic steering:

- **Simple**: one record, no logic.
- **Weighted**: multiple records with weights, and the service returns each in proportion — 90 to the current stack and 10 to a canary, shifting the weights gradually for a controlled rollout or a blue-green cutover.
- **Latency-based**: the service measures latency from the resolver\'s network to each region and returns the lowest one, so users are directed to the fastest region for them.
- **Geolocation**: routing by the user\'s continent or country, for compliance ("EU users to the EU region"), localisation, or geo-blocking.
- **Geoproximity**: routing by geographic distance between the user and each resource, with a bias setting that lets you expand or shrink a region\'s catchment to shift load.
- **Failover**: a primary and a secondary record with a health check on the primary; when the primary\'s health check fails, DNS returns the secondary instead. This is the DNS layer of a disaster-recovery design, and its speed is bounded by the record\'s TTL — a 300-second TTL means resolvers can serve the dead primary for up to five minutes after the flip.
- **Multi-value answer**: return several healthy records at once, a lightweight form of load distribution that is more resilient than a single simple record.

**Health checks** in Route 53 probe an endpoint directly, or watch a CloudWatch alarm, and cause the associated records to be withheld from responses while unhealthy.

## Azure

Azure\'s equivalents: **Application Gateway** is the Layer 7 load balancer with an integrated WAF; **Azure Load Balancer** is Layer 4; **Front Door** is a global Layer 7 service combining load balancing, CDN, and WAF at the edge; and **Traffic Manager** is the DNS-based global routing service, with priority, weighted, performance, geographic, subnet, and multi-value routing methods that map closely to Route 53\'s policies.`,

    contentHi: `## DNS

DNS ek human-readable naam ko ek address mein badalता hai. Jo record types aap use karते ho:
- **A** aur **AAAA** ek naam ko ek IPv4 aur IPv6 address se map karते hain.
- **CNAME** ek naam ko ek doosre naam se map karता hai, ek resolution step add karता hua. Ek CNAME **zone apex** (bare domain) par exist nahi kar sakta.
- **Alias records** (Route 53 "alias", Azure "alias record") ek naam ko directly ek cloud resource se map karते hain — ek load balancer, ek CloudFront distribution. Wo apex par kaam karते hain, koi extra lookup add nahi karते, aur free hain. Ye wo hai jo aap apne domain ko ek load balancer par point karne ke liye use karते ho.
- **MX** (mail), **TXT** (verification), **NS** (delegation), **SRV**, **CAA**.
- **TTL** control karता hai resolvers ek answer kitni der cache karते hain. Aap ise ek planned DNS cutover se pehle low karते ho.

## Load balancers

Ek load balancer ek stable endpoint present karता hai aur incoming connections ko targets ke ek pool ke across distribute karता hai, ek health check fail karne wale targets ko hataता hua.

**Layer 7** load balancers — AWS Application Load Balancer, Azure Application Gateway — HTTP samajhते hain. Wo path aur host par route karते hain, headers aur cookies par match karते hain, TLS terminate karते hain, redirects issue karते hain, ek WAF ke saath integrate karते hain, ek cookie set karके sticky sessions provide karते hain.

**Layer 4** load balancers — AWS Network Load Balancer, Azure Load Balancer — TCP aur UDP par operate karते hain bina HTTP awareness ke. Wo lowest possible latency offer karते hain, millions of connections tak scale karते hain, ek static IP address present kar sakते hain, aur client ka source IP preserve karते hain.

**Target group** wo pool hai jise load balancer route karता hai. Load balancer har target ke against ek **health check** chalाता hai. Traffic sirf currently passing targets ko jaता hai, aur ek target jo fail karना shuru karता hai iske existing connections drain kiye jaते hain unhe cut karने ke bajaay. **Connection draining** in-flight requests ko ek window deता hai complete karने ke liye jab ek target intentionally hataya jaता hai.

## Route 53 routing policies

- **Simple**: ek record, koi logic nahi.
- **Weighted**: weights ke saath multiple records — 90 current stack ko aur 10 ek canary ko.
- **Latency-based**: service resolver ke network se har region tak latency measure karता hai aur lowest wala return karता hai.
- **Geolocation**: user ke continent ya country se routing.
- **Geoproximity**: user aur har resource ke beech geographic distance se routing.
- **Failover**: ek primary aur ek secondary record primary par ek health check ke saath; jab primary ka health check fail hota hai, DNS secondary return karता hai. Iski speed record ke TTL se bound hai.
- **Multi-value answer**: ek saath kई healthy records return karो.

## Azure

Azure ke equivalents: **Application Gateway** ek integrated WAF ke saath Layer 7 load balancer hai; **Azure Load Balancer** Layer 4 hai; **Front Door** ek global Layer 7 service hai jo edge par load balancing, CDN, aur WAF combine karता hai; aur **Traffic Manager** DNS-based global routing service hai.`,

    examples: [
      {
        title: 'One ALB, path and host routing to different services and a weighted canary',
        titleHi: 'Ek ALB, alag services ko path aur host routing aur ek weighted canary',
        code: `# DNS (Route 53): all three names are ALIAS records -> the same ALB
  acme.io           A  ALIAS -> web-alb-1234.eu-west-1.elb.amazonaws.com
  www.acme.io       A  ALIAS -> web-alb-1234...   (or a redirect at the LB)
  api.acme.io       A  ALIAS -> web-alb-1234...

# ALB listener :443 (TLS terminated here, cert from ACM), rules evaluated in order:
  1  host = api.acme.io           -> forward to  api-tg   (the API service)
  2  host = acme.io, path /assets/* -> forward to  s3-via-cdn (or a redirect to the CDN)
  3  host = acme.io, path /*        -> forward to  web-tg   (the web app)
  4  (default)                      -> return 404

# each target group health-checks its targets:
  web-tg   GET /healthz   expect 200   every 15s   healthy:2  unhealthy:3
  api-tg   GET /api/health expect 200  every 10s   healthy:3  unhealthy:2
# a target that fails 3 checks is removed from rotation; when it passes 2 again,
# it's added back. connection draining = 30s (in-flight requests finish on removal).

# --- a canary for the web app: shift 5% of traffic to web-v2-tg ---
  rule 3 becomes a WEIGHTED forward:
    web-tg     weight 95
    web-v2-tg  weight 5
  watch web-v2-tg's error rate + latency; raise 5 -> 25 -> 50 -> 100 or roll back
  to 0. (this is L7 canary AT THE LOAD BALANCER - finer + faster than DNS weighting,
   and it respects sticky sessions.)

# Azure: Application Gateway with path-based + multi-site listeners; weighted
#   backend pools via the "weight" on backend targets, or use Front Door rules.`,
        output: `One load balancer, one set of DNS alias records, and the routing intelligence
lives in the listener rules: host picks the service, path splits assets from app,
and a weighted forward runs a 5% canary that you dial up or back at the LB - finer
than DNS-level weighting and sticky-session aware. Each target group independently
health-checks and drains its own targets.`,
        explain: 'Three hostnames all resolve, via alias records, to the same Application Load Balancer, and the load balancer\'s listener rules decide what happens next. The rules are evaluated in order: a request for \`api.acme.io\` forwards to the API target group, a request for the main domain under \`/assets/\` is sent to the CDN path, and everything else on the main domain goes to the web target group, with a default 404 for anything unmatched. Each target group runs its own health check with its own path, expected codes, interval, and thresholds, so the API and the web app can have different health definitions; a target failing three consecutive checks is pulled from rotation and re-added after two successes, and connection draining lets in-flight requests finish when a target is removed. The canary is implemented by changing the web rule from a single forward to a weighted forward across two target groups — ninety-five percent to the current version and five percent to the new one — which you then raise in steps while watching the new group\'s error rate and latency, or drop back to zero to roll back. Doing the canary at the load balancer rather than in DNS is finer-grained, takes effect immediately rather than waiting for DNS caches to expire, and respects sticky sessions so a user is not bounced between versions mid-session.',
        explainHi: 'Teen hostnames sab alias records ke through same Application Load Balancer par resolve karते hain, aur load balancer ke listener rules decide karте hain aage kya hota hai. Rules order mein evaluated hain: \`api.acme.io\` ke liye ek request API target group ko forward karता hai, main domain ke \`/assets/\` ke tahat ek request CDN path ko bheja jaता hai, aur main domain par baaki sab web target group ko jaता hai. Har target group apna health check chalाता hai apne path, expected codes, interval, aur thresholds ke saath. Canary web rule ko ek single forward se do target groups ke across ek weighted forward mein badal kar implement kiya jaता hai — pichaanve percent current version ko aur paanch percent naye ko. Load balancer par canary karना DNS mein karने se finer-grained hai, turant effect leता hai, aur sticky sessions respect karता hai.',
      },
      {
        title: 'Route 53 policies: latency routing, failover, and a weighted DNS shift for a region cutover',
        titleHi: 'Route 53 policies: latency routing, failover, aur ek region cutover ke liye ek weighted DNS shift',
        code: `# app deployed in eu-west-1 AND us-east-1, each behind its own regional ALB.

# --- LATENCY routing: send each user to their fastest region ---
  app.acme.io  LATENCY  us-east-1  -> ALIAS us-alb   (health check: GET /healthz)
  app.acme.io  LATENCY  eu-west-1  -> ALIAS eu-alb   (health check: GET /healthz)
  # a resolver in Frankfurt -> eu-west-1; one in Virginia -> us-east-1.
  # if eu-west-1's health check fails, its record is withheld -> EU users get
  # us-east-1 automatically (higher latency, but up).

# --- FAILOVER routing for a single-region app with a DR standby ---
  api.acme.io  FAILOVER  PRIMARY    -> ALIAS us-alb   (health check on the primary)
  api.acme.io  FAILOVER  SECONDARY  -> ALIAS dr-alb-us-west-2
  TTL = 60
  # primary healthy -> everyone gets us-alb.
  # primary health check fails 3x -> Route 53 serves dr-alb. resolvers still
  # holding the old answer keep hitting the dead primary for UP TO 60s (the TTL).
  # -> failover time floor = TTL + health-check detection time (~90-180s total).

# --- a controlled region migration with WEIGHTED records ---
  day 0:   app.acme.io  WEIGHTED  eu-west-1 (old)  weight 100   ; us-east-1 (new)  weight 0
  day 1:   ...  eu weight 90  ; us weight 10        # watch us-east-1 error rate + latency
  day 3:   ...  eu weight 50  ; us weight 50
  day 7:   ...  eu weight 0   ; us weight 100       # cutover complete
  day 14:  decommission eu-west-1
  # DNS caching means the shift is fuzzy (a 10% weight isn't exactly 10% of users
  # at any instant) - fine for a migration, too coarse for a tight canary (do that
  # at the LB, previous example).

# Azure: Traffic Manager 'Performance' (= latency), 'Priority' (= failover),
#   'Weighted' profiles; nest profiles for combinations.`,
        output: `DNS routing policies do traffic steering ABOVE the load balancer, at the region
level. LATENCY sends each user to their fastest healthy region. FAILOVER flips a
primary to a DR standby on a health check - but the TTL is the floor on how fast
that can happen. WEIGHTED shifts traffic between regions gradually for a
migration. All three withhold a record when its health check fails. DNS is coarse
(caching blurs the split); use the LB for anything needing precision.`,
        explain: 'The application is deployed in two regions, each behind its own regional load balancer, and Route 53 policies steer users between them. Latency routing measures the network latency from each resolver to each region and returns the faster one, so a user in Frankfurt reaches the European region and a user in Virginia reaches the US region; if a region\'s health check fails, its record is simply withheld and its users are transparently sent to the other region at higher latency but with the service up. Failover routing is for a single active region with a disaster-recovery standby: a health check watches the primary, and when it fails Route 53 starts returning the secondary record, but resolvers that already cached the primary\'s answer keep using it until their cache expires, so the failover time cannot be faster than the record\'s TTL plus the health-check detection time — which is why the TTL is set low for failover records. Weighted routing runs a gradual region migration: the weights start at a hundred to the old region and zero to the new, and are shifted over days while watching the new region\'s metrics, until the new region carries everything. The important caveat throughout is that DNS is coarse because of caching — a ten percent weight is not exactly ten percent of users at any given moment — so it suits region-level migrations and failover but not a tight canary, which belongs at the load balancer. Azure\'s Traffic Manager provides the same capabilities under the names Performance, Priority, and Weighted.',
        explainHi: 'Application do regions mein deployed hai, har ek apne regional load balancer ke peeche, aur Route 53 policies users ko unke beech steer karती hain. Latency routing har resolver se har region tak network latency measure karता hai aur faster wala return karता hai. Agar ek region ka health check fail hota hai, iska record simply withheld hai aur iske users transparently doosre region ko bheje jaते hain higher latency par par service up ke saath. Failover routing ek single active region ke liye ek disaster-recovery standby ke saath hai: ek health check primary ko watch karता hai, aur jab ye fail hota hai Route 53 secondary record return karना shuru karता hai, par resolvers jinhone already primary ka answer cache kiya ise use karते rehते hain jab tak unka cache expire nahi hota. Weighted routing ek gradual region migration chalाता hai. Important caveat DNS coarse hai caching ki wajah se.',
      },
    ],

    mistakes: [
      {
        wrong: `# pointing the apex domain at a load balancer with a CNAME
  acme.io.    CNAME  web-alb-1234.eu-west-1.elb.amazonaws.com   # <-- invalid at apex
# most DNS providers reject this outright. some "fake" it with a CNAME-flattening
# hack that has edge cases. and even where it's allowed, the ALB's IPs change over
# time, so a hardcoded A record at the apex breaks when AWS rotates them.`,
        right: `# use an ALIAS record (Route 53) / ANAME / ALIAS (other providers) at the apex:
  acme.io.        A   ALIAS -> web-alb-1234.eu-west-1.elb.amazonaws.com
  www.acme.io.    A   ALIAS -> web-alb-1234...        # or a redirect www -> apex
# an alias:
#   - works at the zone apex (unlike CNAME)
#   - resolves to the load balancer's CURRENT IPs (AWS updates it automatically)
#   - adds no extra DNS lookup, and Route 53 charges nothing for alias queries
# Azure: an "alias record" pointing at the public IP / Front Door / Traffic Manager.
# for a non-cloud target (a partner endpoint) you're stuck with CNAME -> use www
# as the canonical name and redirect the apex to it.`,
        why: 'The DNS specification does not allow a CNAME record to coexist with other records at the same name, and the zone apex — the bare domain — must carry the zone\'s NS and SOA records, so a CNAME cannot be placed there. Most DNS providers reject an apex CNAME outright; the ones that appear to allow it are doing CNAME flattening, a provider-specific workaround that resolves the target at query time and returns A records, which mostly works but has edge cases around TTLs and target changes. Hardcoding an A record with the load balancer\'s current IP addresses at the apex is worse, because a load balancer\'s addresses are not stable — the cloud provider adds and removes them as it scales the load balancer, and a static A record silently points at addresses that no longer serve. The correct mechanism is an alias record, which Route 53, and equivalently named features on Azure and other providers, resolve internally to the cloud resource\'s current set of addresses. An alias works at the apex, tracks the load balancer\'s IPs automatically, adds no extra resolution hop, and is not charged per query. For a target that is not a cloud resource of the same provider — a partner\'s endpoint, say — you cannot use an alias, so the standard pattern is to make \`www\` the canonical hostname with a CNAME and redirect the apex to it.',
        whyHi: 'DNS specification ek CNAME record ko same naam par doosre records ke saath coexist karने nahi deta, aur zone apex — bare domain — ko zone ke NS aur SOA records carry karne chahिए, to ek CNAME wahaan place nahi ho sakта. Zyadaatar DNS providers ek apex CNAME ko outright reject karते hain. Apex par load balancer ke current IP addresses ke saath ek A record hardcode karना worse hai, kyunki ek load balancer ke addresses stable nahi hain — cloud provider unhe add aur remove karता hai jaise ye load balancer ko scale karता hai. Correct mechanism ek alias record hai, jise Route 53 internally cloud resource ke current set of addresses par resolve karता hai. Ek alias apex par kaam karता hai, load balancer ke IPs ko automatically track karता hai.',
      },
      {
        wrong: `# relying on DNS failover with a high TTL for fast recovery
  api.acme.io  FAILOVER  PRIMARY   -> us-alb    (health check)
  api.acme.io  FAILOVER  SECONDARY -> dr-alb
  TTL = 3600          # <-- one hour
# the primary region goes down. Route 53 flips to the secondary in ~90s.
# but every resolver that fetched the answer in the last hour keeps sending users
# to the dead primary for up to an hour. "we have DR failover" -> the outage still
# lasts 30-60 minutes for most users.`,
        right: `# for FAILOVER records, set a LOW TTL and understand the real recovery time:
  api.acme.io  FAILOVER  PRIMARY   -> us-alb    TTL 60
  api.acme.io  FAILOVER  SECONDARY -> dr-alb    TTL 60
# recovery time = health-check detection (interval x failure threshold, ~30-90s)
#                 + TTL (60s) + slow resolvers that ignore TTL (some minutes)
#              ~= 2-5 minutes for most users. document this as your DNS-failover RTO.
# for FASTER regional failover, don't use DNS:
#   - a GLOBAL anycast load balancer (CloudFront / Global Accelerator / Front Door)
#     that health-checks origins and reroutes in SECONDS, no client DNS involved
#   - or an active-active setup where both regions always serve (Module 17)`,
        why: 'DNS-based failover works by having the DNS service stop returning the primary record and start returning the secondary when a health check fails, but a resolver that has already cached the primary\'s answer will keep using it until that cache entry expires, and the cache lifetime is the record\'s TTL. With a one-hour TTL, a resolver that fetched the answer just before the outage will keep sending users to the dead primary for nearly an hour after Route 53 has flipped, so "we have DNS failover" does not mean the outage is short — for most users it lasts most of the TTL. The fix for the DNS layer is to set a low TTL, around 60 seconds, on failover records specifically, and to be honest that the real recovery time is the health-check detection time plus the TTL plus a tail of resolvers that ignore TTLs, adding up to a few minutes rather than seconds. If you need genuinely fast regional failover, DNS is the wrong tool: a global anycast load balancer such as CloudFront, AWS Global Accelerator, or Azure Front Door health-checks the origins itself and reroutes in seconds with no client DNS change involved, and an active-active multi-region design avoids failover entirely by always serving from both regions.',
        whyHi: 'DNS-based failover DNS service ke primary record return karना band karके aur health check fail hone par secondary return karके kaam karता hai, par ek resolver jisne already primary ka answer cache kiya hai ise use karता rahega jab tak wo cache entry expire nahi hoती, aur cache lifetime record ka TTL hai. Ek one-hour TTL ke saath, ek resolver jisne answer outage se ठीक pehle fetch kiya users ko dead primary ko bhejता rahega lagbhag ek ghanta Route 53 ke flip karने ke baad. DNS layer ke liye fix specifically failover records par ek low TTL, lagbhag 60 seconds, set karना hai. Agar aapko genuinely fast regional failover chahिए, DNS galat tool hai: ek global anycast load balancer jaise CloudFront ya Azure Front Door origins ko khud health-check karता hai aur seconds mein reroute karता hai.',
      },
      {
        wrong: `# using an NLB (layer 4) for an HTTP service that needs path routing / TLS / a WAF
# "NLB is faster, use that" -> then you need:
#   - path routing (/api vs /app)  -> NLB can't; it's TCP only
#   - TLS termination + cert rotation -> NLB does TCP passthrough or basic TLS,
#     no header inspection, no redirect-to-HTTPS
#   - a WAF                          -> WAF attaches to ALB/CloudFront, not NLB
#   - per-request access logs        -> NLB logs connections, not HTTP requests
# so you bolt an nginx layer behind the NLB to do all of it - reinventing the ALB.`,
        right: `# match the LB layer to the protocol and the features you need:
#   HTTP/HTTPS/gRPC/WS service, path or host routing, TLS termination, WAF,
#   redirects, request logs, sticky cookies  -> LAYER 7 (ALB / App Gateway)
#   raw TCP/UDP (a game server, a database proxy, MQTT, SMTP), OR you need a
#   STATIC IP / PrivateLink source, OR millions of long-lived connections, OR
#   the absolute lowest latency  -> LAYER 4 (NLB / Azure LB)
#   a common combo: NLB (static IP, PrivateLink) -> forwards to -> ALB (HTTP smarts)
#   global + edge + WAF + CDN in one: CloudFront / Front Door in front of the ALB.`,
        why: 'A Network Load Balancer operates at Layer 4, seeing only TCP and UDP connections, and a large set of features that HTTP services routinely need exist only at Layer 7 because they require understanding the HTTP request. Path and host routing, TLS termination with certificate management, redirecting HTTP to HTTPS, matching on headers and cookies, per-request access logging, and web application firewall integration are all Layer 7 capabilities. Choosing a Network Load Balancer for an HTTP service because it is described as faster means you then discover you need all of those things and end up running an nginx or Envoy layer behind the NLB to provide them — which is reimplementing the Application Load Balancer, worse. The Network Load Balancer is the right choice for genuinely non-HTTP protocols like a game server or a database proxy, for cases that specifically need a static IP address or an endpoint-service source for PrivateLink, for extreme connection counts, or where the lowest possible latency matters more than any HTTP feature. A common pattern combines them: a Network Load Balancer for the static IP and PrivateLink capability forwarding to an Application Load Balancer for the HTTP routing behind it. For global reach with edge caching and WAF, CloudFront or Front Door sits in front of the Application Load Balancer.',
        whyHi: 'Ek Network Load Balancer Layer 4 par operate karता hai, sirf TCP aur UDP connections dekhता hua, aur features ka ek large set jo HTTP services routinely chahिए sirf Layer 7 par exist karता hai kyunki unhe HTTP request samajhne ki zaroorat hai. Path aur host routing, TLS termination certificate management ke saath, HTTP ko HTTPS par redirect karना, headers aur cookies par match karना, per-request access logging, aur web application firewall integration sab Layer 7 capabilities hain. Ek HTTP service ke liye ek Network Load Balancer choose karना kyunki ise faster describe kiya gaya ka matlab aap phir discover karते ho ki aapko wo saari cheezein chahिए aur ek nginx layer chalाना padता hai — jo Application Load Balancer ko reimplement karना hai. Network Load Balancer genuinely non-HTTP protocols ke liye right choice hai.',
      },
    ],

    realWorld: [
      {
        en: '**Apex CNAME rejected at launch** — a team\'s launch was blocked for a day because their DNS provider rejected `acme.io CNAME ...alb...`. Moving the zone to Route 53 and using an alias record fixed it in an hour; `www` was made a redirect to the apex.',
        hi: '**Launch par apex CNAME rejected** — ek team ka launch ek din ke liye blocked tha kyunki unke DNS provider ne `acme.io CNAME ...alb...` reject kiya. Zone ko Route 53 par move karna aur ek alias record use karna ise ek ghante mein fix kiya.',
      },
      {
        en: '**"We have DNS failover" — 47-minute outage** — a company had a Route 53 failover record with a 3600s TTL. When the primary region failed, Route 53 flipped in 90s but most users kept hitting the dead ALB for 30-50 minutes. Post-incident: TTL 60, and a Global Accelerator in front for sub-10s origin failover.',
        hi: '**"Humare paas DNS failover hai" — 47-minute outage** — ek company ke paas ek 3600s TTL wala Route 53 failover record tha. Jab primary region fail hua, Route 53 90s mein flip hua par zyadaatar users 30-50 minute ke liye dead ALB hit karte rahe. Post-incident: TTL 60, aur ek Global Accelerator.',
      },
      {
        en: '**NLB + nginx = a slow ALB** — a team put every service behind NLBs "for performance", then ran nginx pods behind each NLB for path routing, TLS, and redirects. Latency was worse than an ALB (extra hop) and the nginx config was a maintenance burden. Consolidating onto ALBs removed the nginx tier and a class of on-call pages.',
        hi: '**NLB + nginx = ek slow ALB** — ek team ne har service ko NLBs ke peeche rakha "performance ke liye", phir har NLB ke peeche nginx pods chalaye path routing, TLS ke liye. Latency ek ALB se worse thi. ALBs par consolidate karna nginx tier hata diya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is an alias record and why do you use it instead of a CNAME to point a domain at a load balancer?',
        qHi: 'Ek alias record kya hai aur aap ek domain ko ek load balancer par point karne ke liye ek CNAME ke bajaay ise kyun use karte ho?',
        a: 'A CNAME maps a name to another name and adds a resolution step, but the DNS specification does not allow a CNAME to coexist with other records at the same name, and the zone apex — the bare domain — must carry the zone\'s NS and SOA records, so a CNAME cannot be placed at the apex. Most DNS providers reject an apex CNAME; those that appear to allow it are doing CNAME flattening, a provider-specific workaround with edge cases. Hardcoding an A record with the load balancer\'s current IP addresses is worse, because a load balancer\'s addresses change as the provider scales it and a static A record silently points at dead addresses. An alias record — Route 53\'s term, with equivalents on Azure and other providers — maps a name directly to a cloud resource and is resolved internally by the DNS service to that resource\'s current set of addresses. It works at the apex, tracks the load balancer\'s IPs automatically, adds no extra resolution hop, and is not charged per query. You use it whenever you point a domain, especially the apex, at a load balancer, a CloudFront distribution, or an S3 website. For a target that is not a cloud resource of the same provider you cannot use an alias, so the standard pattern is to make www the canonical name with a CNAME and redirect the apex to it.',
        aHi: 'Ek CNAME ek naam ko ek doosre naam se map karta hai aur ek resolution step add karta hai, par DNS specification ek CNAME ko same naam par doosre records ke saath coexist karne nahi deta, aur zone apex ko zone ke NS aur SOA records carry karne chahिए, to ek CNAME apex par place nahi ho sakta. Ek A record hardcode karna worse hai kyunki ek load balancer ke addresses badalte hain. Ek alias record ek naam ko directly ek cloud resource se map karta hai aur DNS service dwara internally us resource ke current set of addresses par resolve hota hai. Ye apex par kaam karta hai, load balancer ke IPs ko automatically track karta hai, koi extra resolution hop add nahi karta. Aap ise tab use karte ho jab bhi aap ek domain ko ek load balancer par point karte ho.',
      },
      {
        q: 'Compare a Layer 7 and a Layer 4 load balancer. When do you use each?',
        qHi: 'Ek Layer 7 aur ek Layer 4 load balancer compare karo. Aap har ek kab use karte ho?',
        a: 'A Layer 7 load balancer — the AWS Application Load Balancer, Azure Application Gateway — understands HTTP. It routes on path and host, matches on headers and cookies, terminates TLS with certificate management, issues redirects, integrates with a web application firewall, provides sticky sessions by setting a cookie, supports gRPC and WebSockets, and produces per-request access logs. It is the default for any HTTP service. A Layer 4 load balancer — the AWS Network Load Balancer, Azure Load Balancer — operates on raw TCP and UDP with no HTTP awareness. It offers the lowest latency, scales to millions of connections, can present a static IP address and be a PrivateLink endpoint-service source, and preserves the client\'s source IP. You use Layer 7 for HTTP, HTTPS, gRPC, or WebSocket services that need any of path routing, TLS termination, a WAF, redirects, or request logging — which is most web workloads. You use Layer 4 for genuinely non-HTTP protocols like a game server, an MQTT broker, or a database proxy, for cases that specifically need a static IP or a PrivateLink source, for extreme connection volume, or where the absolute lowest latency matters more than any HTTP feature. A common combination is a Network Load Balancer providing the static IP and PrivateLink capability forwarding to an Application Load Balancer that does the HTTP routing, and for global edge presence CloudFront or Front Door sits in front of the Application Load Balancer.',
        aHi: 'Ek Layer 7 load balancer — AWS Application Load Balancer, Azure Application Gateway — HTTP samajhta hai. Ye path aur host par route karta hai, headers aur cookies par match karta hai, TLS terminate karta hai, redirects issue karta hai, ek WAF ke saath integrate karta hai, ek cookie set karke sticky sessions provide karta hai. Ye kisi bhi HTTP service ke liye default hai. Ek Layer 4 load balancer — AWS Network Load Balancer, Azure Load Balancer — raw TCP aur UDP par operate karta hai bina HTTP awareness ke. Ye lowest latency offer karta hai, millions of connections tak scale karta hai, ek static IP address present kar sakta hai. Aap Layer 7 HTTP services ke liye use karte ho jinhe path routing, TLS termination, ek WAF chahिए. Aap Layer 4 genuinely non-HTTP protocols ke liye use karte ho, ya jab aapko specifically ek static IP chahिए.',
      },
      {
        q: 'What can DNS routing policies do, and what is the fundamental limitation of doing traffic steering in DNS?',
        qHi: 'DNS routing policies kya kar sakti hain, aur DNS mein traffic steering karne ki fundamental limitation kya hai?',
        a: 'DNS routing policies let the DNS service choose which record to return for a query, which turns DNS into a traffic-steering layer above the load balancer. Weighted routing returns records in proportion to configured weights, for a gradual region migration or a coarse canary. Latency-based routing measures latency from the resolver\'s network to each region and returns the fastest. Geolocation routes by the user\'s country or continent for compliance and localisation. Geoproximity routes by geographic distance with a bias knob to shift load. Failover returns a secondary record when a health check on the primary fails, for disaster recovery. Multi-value answer returns several healthy records at once. All of them can withhold a record whose health check is failing. The fundamental limitation is that DNS answers are cached by resolvers, operating systems, and applications for the record\'s TTL, and not all of them honour the TTL, so any change a policy makes takes effect gradually and imprecisely as caches expire. A ten percent weight is not exactly ten percent of users at any instant; a failover cannot be faster than the TTL plus the health-check detection time plus a tail of slow resolvers. This makes DNS routing suitable for region-level migrations and failover where a few minutes of imprecision is acceptable, but wrong for a tight canary or a fast failover, both of which belong at the load balancer or a global anycast layer like CloudFront or Front Door that reroutes without any client DNS change.',
        aHi: 'DNS routing policies DNS service ko choose karne deti hain kaun sा record ek query ke liye return kare, jo DNS ko load balancer ke upar ek traffic-steering layer mein badalta hai. Weighted routing configured weights ke proportion mein records return karta hai. Latency-based routing resolver ke network se har region tak latency measure karta hai. Geolocation user ke country se route karta hai. Failover ek secondary record return karta hai jab primary par ek health check fail hota hai. Fundamental limitation ye hai ki DNS answers resolvers, operating systems, aur applications dwara record ke TTL ke liye cached hote hain, aur sab TTL honour nahi karte, to koi bhi change jo ek policy karti hai gradually aur imprecisely effect leta hai jaise caches expire hote hain. Ek dus percent weight kisi instant par exactly dus percent users nahi hai. Ye DNS routing ko region-level migrations aur failover ke liye suitable banata hai par ek tight canary ke liye galat.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the DNS record types (A/AAAA/CNAME/ALIAS/MX/TXT/NS/CAA), explain why a CNAME can\'t be at the apex, and what TTL controls.',
        taskHi: 'Ek comment mein, DNS record types list karo.',
        hint: 'A / AAAA: name → IPv4 / IPv6 address. CNAME: name → ANOTHER name (adds a resolution step; CANNOT be at the ZONE APEX — the bare domain must carry the zone\'s NS + SOA records, and DNS forbids a CNAME coexisting with other records at the same name; most providers reject an apex CNAME outright, "CNAME flattening" is a provider hack with edge cases). ALIAS / ANAME (Route 53 "alias", Azure "alias record"): name → a CLOUD RESOURCE (an ALB, a CloudFront distribution, an S3 website) — the DNS service resolves it internally to that resource\'s CURRENT addresses. WORKS AT THE APEX, tracks the LB\'s IPs automatically (they change as the provider scales it — a hardcoded A record silently breaks), adds NO extra lookup, FREE per query. USE THIS to point a domain (especially the apex) at a load balancer. MX: mail servers. TXT: verification / SPF / DKIM / DMARC. NS: delegation (which servers are authoritative for a subzone). SRV: service location (host + port). CAA: which certificate authorities may issue certs for the domain. TTL: how long resolvers / OSes / apps CACHE the answer. Lower it (~60 s) a day or two BEFORE a planned DNS cutover so the change propagates fast; raise it back after. Clients, OSes, and ISP resolvers DON\'T always honour the TTL → DNS changes are NEVER truly instantaneous. FOR A NON-CLOUD TARGET (a partner endpoint): you can\'t use an alias → make `www` the canonical name with a CNAME and redirect the apex to it.',
        hintHi: 'A / AAAA: name → IPv4 / IPv6. CNAME: name → DOOSRA name (resolution step add karta hai; ZONE APEX par NAHI ho sakta — apex ko NS + SOA carry karne chahिए). ALIAS / ANAME: name → ek CLOUD RESOURCE (ALB, CloudFront, S3 website) — DNS service ise internally us resource ke CURRENT addresses par resolve karta hai. APEX PAR KAAM KARTA HAI, LB ke IPs automatically track karta hai, KOI extra lookup nahi, FREE. YE USE karo ek domain ko ek load balancer par point karne ke liye. MX: mail. TXT: verification / SPF / DKIM. NS: delegation. CAA: kaun se CAs certs issue kar sakte hain. TTL: resolvers answer kitni der CACHE karte hain. Ek planned cutover se pehle ~60 s tak lower karo. Clients TTL HAMESHA honour nahi karte. NON-CLOUD TARGET: `www` ko canonical banao + apex ko redirect karo.',
      },
      {
        task: 'In a comment, contrast Layer 7 and Layer 4 load balancers, and describe a target group + health check + connection draining.',
        taskHi: 'Ek comment mein, Layer 7 aur Layer 4 load balancers ka contrast karo.',
        hint: 'LAYER 7 (AWS ALB / Azure Application Gateway / GCLB) — understands HTTP: PATH + HOST routing (`/api/*` → api-tg, `app.acme.io` → web-tg), header/cookie matching, TLS TERMINATION + cert management, redirects (HTTP→HTTPS), WAF integration, STICKY SESSIONS via a cookie, gRPC + WebSockets, PER-REQUEST access logs. THE DEFAULT for any HTTP service. LAYER 4 (AWS NLB / Azure Load Balancer) — raw TCP/UDP, NO HTTP awareness: lowest latency, millions of connections, a STATIC IP / a PrivateLink endpoint-service source, PRESERVES the client source IP. USE FOR: genuinely non-HTTP protocols (a game server, MQTT, SMTP, a DB proxy), OR when you specifically need a static IP / PrivateLink source, OR extreme connection volume, OR the absolute lowest latency. Common combo: NLB (static IP + PrivateLink) → forwards to → ALB (HTTP smarts); global edge + CDN + WAF: CloudFront / Front Door in front of the ALB. TARGET GROUP = the pool the LB routes to — instances / IPs / Lambda / ECS tasks. HEALTH CHECK per target group: a request to a configured PATH, expecting configured STATUS CODES, at an INTERVAL, with HEALTHY (e.g. 2 consecutive passes → in rotation) and UNHEALTHY (e.g. 3 consecutive fails → out) thresholds. Traffic goes ONLY to targets currently passing. CONNECTION DRAINING (a.k.a. deregistration delay, e.g. 30 s): when a target is intentionally removed (a deploy, a scale-in), the LB stops sending it NEW connections but lets IN-FLIGHT requests finish for the drain window — the target is drained, NOT killed. ALGORITHMS: round-robin, LEAST-OUTSTANDING-REQUESTS (better when request cost varies a lot), NLB flow hash. CROSS-ZONE load balancing: spread evenly across targets in ALL AZs regardless of count per AZ (ALB: always on; NLB: opt-in — it can add cross-AZ transfer $).',
        hintHi: 'LAYER 7 (ALB / App Gateway / GCLB) — HTTP samajhta hai: PATH + HOST routing, header/cookie matching, TLS TERMINATION, redirects, WAF, STICKY SESSIONS, gRPC + WS, PER-REQUEST logs. Kisi bhi HTTP service ke liye DEFAULT. LAYER 4 (NLB / Azure LB) — raw TCP/UDP, NO HTTP awareness: lowest latency, millions of connections, STATIC IP / PrivateLink source, client source IP PRESERVE karta hai. USE FOR: non-HTTP protocols, static IP, extreme volume. Combo: NLB → ALB. TARGET GROUP = pool (instances / IPs / Lambda / ECS tasks). HEALTH CHECK: ek PATH par request, STATUS CODES expect, INTERVAL, HEALTHY/UNHEALTHY thresholds. Traffic SIRF passing targets ko. CONNECTION DRAINING (~30 s): target ko NEW connections rok, IN-FLIGHT requests finish hone do — drained, NOT killed. CROSS-ZONE: ALB always on; NLB opt-in.',
      },
      {
        task: 'In a comment, list the Route 53 routing policies and what each is for, and explain why DNS is too coarse for a tight canary or a fast failover.',
        taskHi: 'Ek comment mein, Route 53 routing policies list karo.',
        hint: 'ROUTE 53 ROUTING POLICIES (how the DNS service picks which record to return): SIMPLE — one record, no logic. WEIGHTED — records with weights, returned in proportion (90 old / 10 canary; gradual region migration; blue/green). LATENCY — measure latency from the resolver\'s network to each region, return the lowest → each user gets their fastest region. GEOLOCATION — route by the user\'s continent/country (compliance "EU users → EU region", localisation, geo-blocking). GEOPROXIMITY — route by geographic DISTANCE, with a BIAS knob to expand/shrink a region\'s catchment to shift load. FAILOVER — a PRIMARY + a SECONDARY, a health check on the primary; on failure DNS returns the secondary (the DNS layer of a DR design). MULTI-VALUE ANSWER — return several healthy records at once (a lightweight, more-resilient-than-simple distribution). HEALTH CHECKS probe an endpoint (or watch a CloudWatch alarm) and WITHHOLD unhealthy records from responses. WHY DNS IS TOO COARSE: DNS answers are CACHED by resolvers / OSes / apps for the record\'s TTL, and not all of them honour it → any change takes effect GRADUALLY + IMPRECISELY as caches expire. A 10% weight is NOT exactly 10% of users at any instant (fine for a migration, too fuzzy for a tight canary — do that at the LB with a weighted target-group forward: finer, immediate, sticky-session-aware). A FAILOVER cannot be faster than: health-check detection (interval × failure threshold, ~30-90 s) + the TTL + a tail of slow resolvers → ~2-5 min even with TTL 60. For FASTER regional failover use a GLOBAL ANYCAST layer (CloudFront / AWS Global Accelerator / Azure Front Door) that health-checks origins and reroutes in SECONDS with NO client DNS change, or an active-active multi-region design (Module 17). Azure Traffic Manager: Performance (= latency), Priority (= failover), Weighted, Geographic, Subnet, Multi-value; nest profiles for combinations.',
        hintHi: 'ROUTE 53 ROUTING POLICIES: SIMPLE — ek record. WEIGHTED — weights ke proportion mein (90 old / 10 canary; region migration). LATENCY — resolver se har region tak latency measure, lowest return → har user apna fastest region. GEOLOCATION — user ke country se (compliance, geo-block). GEOPROXIMITY — geographic DISTANCE se, ek BIAS knob ke saath. FAILOVER — PRIMARY + SECONDARY, primary par health check; failure par secondary. MULTI-VALUE — kई healthy records. HEALTH CHECKS unhealthy records WITHHOLD karti hain. DNS COARSE KYUN: answers TTL ke liye CACHED hote hain, sab honour nahi karte → change GRADUALLY + IMPRECISELY. 10% weight kisi instant par exactly 10% nahi. FAILOVER: health-check detection + TTL + slow resolvers → ~2-5 min even TTL 60. FASTER ke liye ek GLOBAL ANYCAST layer (CloudFront / Global Accelerator / Front Door) — SECONDS mein reroute, NO client DNS change. Azure Traffic Manager: Performance / Priority / Weighted.',
      },
    ],

    keyTakeaways: [
      'DNS records: A/AAAA (name → IP), CNAME (name → name, NOT at the apex), ALIAS/ANAME (name → a cloud resource, works at the apex, tracks the LB\'s IPs automatically, no extra lookup, free — USE THIS to point a domain at a load balancer). TTL = how long resolvers cache the answer; lower it before a planned cutover; clients don\'t always honour it.',
      'LAYER 7 LB (ALB / App Gateway) understands HTTP — path/host routing, TLS termination, WAF, redirects, sticky cookies, gRPC/WS, per-request logs — the default for HTTP. LAYER 4 LB (NLB / Azure LB) is raw TCP/UDP — lowest latency, millions of connections, a static IP / PrivateLink source, preserves the client IP — for non-HTTP, a fixed IP, or extreme throughput.',
      'A TARGET GROUP is the pool; the LB HEALTH-CHECKS each target (a path + expected codes + interval + healthy/unhealthy thresholds) and routes only to passing ones. CONNECTION DRAINING lets in-flight requests finish when a target is intentionally removed — the target is drained, not killed. Do a canary at the LB with a weighted target-group forward: finer, immediate, sticky-aware.',
      'ROUTE 53 POLICIES steer traffic ABOVE the LB, at the region level: SIMPLE, WEIGHTED (gradual migration / coarse canary), LATENCY (fastest region per user), GEOLOCATION (by country — compliance), GEOPROXIMITY (by distance + a bias knob), FAILOVER (primary → secondary on a health check), MULTI-VALUE. Health checks withhold unhealthy records.',
      'DNS IS COARSE — answers are cached for the TTL and not all resolvers honour it, so changes are gradual + imprecise. A 10% weight isn\'t exactly 10%; a DNS failover ≈ health-check detection + TTL + slow resolvers ≈ 2-5 min even at TTL 60. For a tight canary or fast failover use the LB or a global anycast layer (CloudFront / Global Accelerator / Front Door) that reroutes in seconds. AZURE: Application Gateway (L7+WAF), Azure LB (L4), Front Door (global L7+CDN+WAF), Traffic Manager (DNS routing).',
    ],
    keyTakeawaysHi: [
      'DNS records: A/AAAA (name → IP), CNAME (name → name, APEX par NAHI), ALIAS/ANAME (name → ek cloud resource, apex par kaam karta hai, LB ke IPs automatically track karta hai, koi extra lookup nahi, free — YE USE karo ek domain ko ek load balancer par point karne ke liye). TTL = resolvers answer kitni der cache karte hain; ek planned cutover se pehle lower karo.',
      'LAYER 7 LB (ALB / App Gateway) HTTP samajhta hai — path/host routing, TLS termination, WAF, redirects, sticky cookies, gRPC/WS — HTTP ke liye default. LAYER 4 LB (NLB / Azure LB) raw TCP/UDP hai — lowest latency, millions of connections, ek static IP / PrivateLink source, client IP preserve karta hai — non-HTTP, ek fixed IP, ya extreme throughput ke liye.',
      'Ek TARGET GROUP pool hai; LB har target ko HEALTH-CHECK karta hai aur sirf passing walon ko route karta hai. CONNECTION DRAINING in-flight requests ko finish hone deta hai jab ek target intentionally hataya jaता hai — target drained hai, killed nahi. Ek canary LB par karo ek weighted target-group forward ke saath.',
      'ROUTE 53 POLICIES traffic ko LB ke UPAR steer karti hain, region level par: SIMPLE, WEIGHTED (gradual migration / coarse canary), LATENCY (per user fastest region), GEOLOCATION (country se — compliance), GEOPROXIMITY (distance + ek bias knob), FAILOVER (primary → secondary ek health check par), MULTI-VALUE. Health checks unhealthy records withhold karti hain.',
      'DNS COARSE HAI — answers TTL ke liye cached hote hain aur sab resolvers honour nahi karte, to changes gradual + imprecise hain. Ek 10% weight exactly 10% nahi; ek DNS failover ≈ health-check detection + TTL + slow resolvers ≈ 2-5 min even TTL 60 par. Ek tight canary ya fast failover ke liye LB ya ek global anycast layer (CloudFront / Global Accelerator / Front Door) use karo. AZURE: Application Gateway (L7+WAF), Azure LB (L4), Front Door (global L7+CDN+WAF), Traffic Manager (DNS routing).',
    ],
  },

  {
    slug: 'ops-serverless-event-driven-and-landing-zones',
    title: 'Serverless, Event-Driven Patterns & Landing Zones',
    titleHi: 'Serverless, Event-Driven Patterns Aur Landing Zones',
    description:
      'Two topics that shape how a cloud estate is built: the serverless and event-driven building blocks — API gateways, functions, queues, topics, event buses, workflow engines — and the patterns that make them reliable (idempotency, dead-letter queues, fan-out). And the account structure a mature organisation uses: multiple accounts, organisational units, service control policies, centralised logging and security, and account vending — the "landing zone".',
    descriptionHi:
      'Do topics jo shape karte hain ek cloud estate kaise build hota hai: serverless aur event-driven building blocks — API gateways, functions, queues, topics, event buses, workflow engines — aur wo patterns jo unhe reliable banate hain (idempotency, dead-letter queues, fan-out). Aur account structure jo ek mature organisation use karti hai: multiple accounts, organisational units, service control policies, centralised logging aur security, aur account vending — "landing zone".',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A post office, and a company with many branch offices.** Serverless messaging is the postal system: you drop a letter in a box (publish an event) and the system delivers it, retries if the recipient is out, and drops undeliverable mail in a returns bin (dead-letter queue) instead of losing it — and the sender does not wait for the reply. Because a letter can be delivered twice after a retry, the recipient has to be able to handle "I already actioned this one" (idempotency). And the company structure: rather than one giant office where every team shares the same filing cabinets and anyone can touch anything, you give each team its own branch (an account) with its own locks, put a company-wide rulebook on every branch that even the branch manager cannot override ("no branch may shred audit records"), and have a central office that collects a copy of every branch\'s records and runs security for all of them.',
      hi: '**Ek post office, aur ek company kई branch offices ke saath.** Serverless messaging postal system hai: aap ek letter ek box mein drop karte ho (ek event publish) aur system ise deliver karता hai, retry karता hai agar recipient bahar hai, aur undeliverable mail ko ek returns bin (dead-letter queue) mein drop karता hai ise khoने ke bajaay — aur sender reply ke liye wait nahi karता. Kyunki ek letter ek retry ke baad do baar deliver ho sakता hai, recipient ko "maine ise already action kiya" handle karने mein able hona chahिए (idempotency). Aur company structure: ek giant office ke bajaay jahaan har team same filing cabinets share karती hai, aap har team ko iski apni branch (ek account) apne locks ke saath dete ho, har branch par ek company-wide rulebook daalते ho jise branch manager bhi override nahi kar sakta.',
    },

    simple: `**SERVERLESS / EVENT-DRIVEN BUILDING BLOCKS:**
\`\`\`
API GATEWAY   turns HTTP requests into events / function invocations. auth (JWT,
              IAM, API keys), throttling, request validation, usage plans. AWS API
              Gateway / Lambda Function URLs / Azure API Management / GCP API Gateway.
FUNCTION      the compute (Module 13 L2). Lambda / Azure Functions / Cloud Functions /
              Cloud Run functions.
QUEUE         point-to-point, one consumer group, at-least-once, ordered (FIFO) or not.
              buffers load, decouples producer speed from consumer speed. SQS /
              Azure Storage Queues / Service Bus queues / Cloud Tasks.
TOPIC / PUB-SUB  fan-out: one publish -> N independent subscribers. SNS / EventBridge
              / Service Bus topics / Pub/Sub.
EVENT BUS     routing + filtering by content: rules match event patterns and send to
              targets. schema registry, archive + replay. EventBridge / Event Grid.
WORKFLOW      orchestrate multi-step processes with retries, branching, waits,
              parallelism, human-approval steps. Step Functions / Durable Functions /
              Cloud Workflows.
STREAM        an ordered, replayable log of records; multiple consumers at their own
              offset. Kinesis / Kafka (MSK) / Event Hubs / Pub/Sub (with retention).
\`\`\`

**PATTERNS THAT MAKE IT RELIABLE:**
\`\`\`
IDEMPOTENCY   delivery is AT-LEAST-ONCE -> a message CAN arrive twice. the consumer
              must produce the same result on a repeat: dedupe on an idempotency key,
              use "INSERT ... ON CONFLICT DO NOTHING", make the operation naturally
              idempotent (set X, not increment X). NON-NEGOTIABLE for event-driven.
DEAD-LETTER QUEUE (DLQ)  after N failed processing attempts, the message goes to a
              DLQ instead of being lost or retried forever. alarm on DLQ depth > 0;
              have a documented redrive process.
RETRIES + BACKOFF  exponential backoff + jitter between attempts; a max attempt count.
FAN-OUT       one event -> a topic -> a queue per consumer -> a function per queue.
              each consumer fails + retries + DLQs independently. (topic straight to
              function loses the per-consumer buffer + retry isolation.)
CLAIM CHECK   large payload -> put it in S3, put the S3 key in the message.
OUTBOX        write the DB row + the "to publish" event in ONE transaction; a relay
              publishes from the outbox -> no lost events on a crash between the two.
\`\`\`

**MULTI-ACCOUNT / LANDING ZONE** (how a real org structures the cloud):
\`\`\`
WHY MANY ACCOUNTS   an account is the hardest security + billing + blast-radius
              boundary. one per (team x environment) is common: prod isolated from
              dev, a compromise or a runaway bill contained, per-account IAM.
ORGANIZATION  AWS Organizations / Azure Management Groups: a tree of accounts.
  OUs / MGs   group accounts (Prod OU, NonProd OU, Sandbox OU, Security OU).
  SCPs / Azure Policy at MG  account-wide GUARDRAILS: "deny leaving approved regions",
              "deny disabling CloudTrail/GuardDuty", "deny root access keys". (Lesson: Module 13 L3)
CENTRAL ACCOUNTS  a LOG ARCHIVE account (all CloudTrail/Config/flow logs, write-only
              from others, immutable), a SECURITY/AUDIT account (GuardDuty, Security
              Hub, read across all), a SHARED-SERVICES / NETWORK account (the TGW, DNS,
              CI). a MANAGEMENT account that does ONLY org admin (nothing else runs there).
ACCOUNT VENDING  Control Tower / Landing Zone Accelerator / a Terraform pipeline:
              request an account -> it's created with the baseline (SCPs, logging,
              guardrails, network, break-glass roles) already applied.
IDENTITY      IAM Identity Center / Entra ID: one login, permission sets mapped to
              roles in each account. no per-account users.
\`\`\``,

    simpleHi: `**SERVERLESS / EVENT-DRIVEN BUILDING BLOCKS:**
\`\`\`
API GATEWAY   HTTP requests ko events / function invocations mein badalta hai. auth,
              throttling, request validation, usage plans. AWS API Gateway / Azure
              API Management / GCP API Gateway.
FUNCTION      compute (Module 13 L2). Lambda / Azure Functions / Cloud Functions.
QUEUE         point-to-point, ek consumer group, at-least-once, ordered (FIFO) ya nahi.
              load buffer karta hai. SQS / Azure Storage Queues / Service Bus queues.
TOPIC / PUB-SUB  fan-out: ek publish -> N independent subscribers. SNS / EventBridge
              / Service Bus topics / Pub/Sub.
EVENT BUS     content se routing + filtering: rules event patterns match karti hain
              aur targets ko bhejti hain. EventBridge / Event Grid.
WORKFLOW      multi-step processes ko retries, branching, waits, parallelism ke saath
              orchestrate karo. Step Functions / Durable Functions / Cloud Workflows.
STREAM        records ka ek ordered, replayable log; multiple consumers apne offset par.
              Kinesis / Kafka (MSK) / Event Hubs / Pub/Sub (retention ke saath).
\`\`\`

**PATTERNS JO ISE RELIABLE BANATE HAIN:**
\`\`\`
IDEMPOTENCY   delivery AT-LEAST-ONCE hai -> ek message do baar aa SAKTA hai. consumer
              ko ek repeat par same result produce karna chahिए: ek idempotency key
              par dedupe karo, "INSERT ... ON CONFLICT DO NOTHING" use karo, operation
              ko naturally idempotent banao (X set karo, X increment nahi). event-driven ke liye NON-NEGOTIABLE.
DEAD-LETTER QUEUE (DLQ)  N failed processing attempts ke baad, message ek DLQ ko jaता
              hai khoने ya forever retry hone ke bajaay. DLQ depth > 0 par alarm karo.
RETRIES + BACKOFF  attempts ke beech exponential backoff + jitter; ek max attempt count.
FAN-OUT       ek event -> ek topic -> per consumer ek queue -> per queue ek function.
              har consumer independently fail + retry + DLQ karta hai.
CLAIM CHECK   large payload -> ise S3 mein daalo, S3 key ko message mein daalo.
OUTBOX        DB row + "to publish" event EK transaction mein likho; ek relay outbox
              se publish karta hai -> dono ke beech ek crash par koi lost events nahi.
\`\`\`

**MULTI-ACCOUNT / LANDING ZONE** (ek real org cloud kaise structure karti hai):
\`\`\`
KAI ACCOUNTS KYUN   ek account sabse hard security + billing + blast-radius boundary
              hai. ek per (team x environment) common hai: prod dev se isolated, ek
              compromise ya ek runaway bill contained, per-account IAM.
ORGANIZATION  AWS Organizations / Azure Management Groups: accounts ka ek tree.
  OUs / MGs   accounts group karo (Prod OU, NonProd OU, Sandbox OU, Security OU).
  SCPs / Azure Policy at MG  account-wide GUARDRAILS: "approved regions chhodne se deny",
              "CloudTrail/GuardDuty disable karne se deny", "root access keys deny". (Module 13 L3)
CENTRAL ACCOUNTS  ek LOG ARCHIVE account (saare logs, others se write-only, immutable),
              ek SECURITY/AUDIT account (GuardDuty, Security Hub), ek SHARED-SERVICES /
              NETWORK account (TGW, DNS, CI). ek MANAGEMENT account jo SIRF org admin karता hai.
ACCOUNT VENDING  Control Tower / Landing Zone Accelerator: ek account request karo ->
              ye baseline (SCPs, logging, guardrails, network, break-glass roles) ke saath banता hai.
IDENTITY      IAM Identity Center / Entra ID: ek login, har account mein roles se mapped permission sets.
\`\`\``,

    content: `## Serverless and event-driven building blocks

An event-driven architecture connects small pieces of compute through messaging rather than direct calls, so producers and consumers scale, fail, and deploy independently.

- An **API gateway** turns incoming HTTP requests into events or function invocations, and handles authentication (JWT validation, IAM, API keys), rate limiting, request validation against a schema, and usage plans. AWS API Gateway, Lambda Function URLs for the simple case, Azure API Management, GCP API Gateway.
- A **function** is the compute unit (Module 13, Lesson 2).
- A **queue** delivers each message to one consumer group, at least once, optionally in order (a FIFO queue). It buffers load so a burst of production does not overwhelm the consumer, and decouples their rates. SQS, Azure Storage Queues, Service Bus queues, Cloud Tasks.
- A **topic** or pub-sub service fans one publish out to many independent subscribers. SNS, Service Bus topics, Pub/Sub.
- An **event bus** adds content-based routing: rules match patterns in the event and forward matching events to targets, with a schema registry and the ability to archive and replay. EventBridge, Event Grid.
- A **workflow engine** orchestrates a multi-step process with retries, branching, waits, parallel branches, and human-approval steps as a state machine. Step Functions, Durable Functions, Cloud Workflows.
- A **stream** is an ordered, replayable log of records that multiple consumers read at their own offset, keeping data for a retention window. Kinesis, Kafka via MSK, Event Hubs, Pub/Sub with retention.

## Patterns that make it reliable

- **Idempotency**. Message delivery in these systems is **at least once** — a network hiccup or a consumer that crashes after processing but before acknowledging causes a redelivery — so a consumer must produce the same outcome when it processes a message twice. You achieve this by deduplicating on an idempotency key carried in the message, using database operations that are safe to repeat (\`INSERT ... ON CONFLICT DO NOTHING\`, conditional writes), or designing the operation to be naturally idempotent (set a value rather than increment it). This is not optional in an event-driven system; a non-idempotent consumer will eventually double-charge a customer or send a duplicate email.
- **Dead-letter queues**. After a message has failed processing a configured number of times, it is moved to a dead-letter queue rather than being retried forever or silently dropped. You alarm when the dead-letter queue depth goes above zero and have a documented process to inspect the failed messages, fix the cause, and redrive them back to the main queue.
- **Retries with backoff**. Between processing attempts, wait an exponentially increasing interval with random jitter, up to a maximum attempt count, so a transient failure recovers without a thundering retry storm.
- **Fan-out done properly**. When one event must reach several consumers, publish it to a topic, have the topic deliver to one queue per consumer, and have a function process each queue. Each consumer then buffers, retries, and dead-letters independently — a topic wired straight to functions loses that per-consumer isolation, so one slow or failing consumer cannot be retried without affecting the others.
- **Claim check**. When a payload is large, put it in object storage and put only the object key in the message, so the messaging system carries small messages and the consumer fetches the body.
- **Transactional outbox**. To avoid losing an event when a service writes to its database and then publishes, write the database row and an "event to publish" record in the same transaction, and have a separate relay read the outbox and publish. A crash between the write and the publish then loses nothing, because the event is durably recorded with the data.

## Multi-account structure and the landing zone

A **cloud account** — an AWS account, an Azure subscription, a GCP project — is the strongest boundary the cloud provides for security, billing, and blast radius. Everything inside an account shares an IAM domain, a bill, and a fate; a compromise, a misconfiguration, or a runaway cost is much harder to contain within a single shared account than across separate ones. A mature organisation therefore runs many accounts, commonly one per team per environment, so that production is isolated from development, each account has its own IAM and its own billing view, and a problem in one is contained.

The **organisation** ties them together:

- **AWS Organizations** (or Azure Management Groups) is a tree of accounts.
- **Organisational units** group accounts by purpose — a Production OU, a Non-Production OU, a Sandbox OU, a Security OU — so policy can be applied to a whole class of accounts at once.
- **Service control policies** attached to an OU (or Azure Policy at a management group) are account-wide guardrails that even the account\'s root user cannot override: deny operating outside approved regions, deny disabling CloudTrail or GuardDuty, deny creating root access keys, deny deleting log buckets (Module 13, Lesson 3).

Certain accounts are **central**:

- A **log archive** account that receives a copy of every other account\'s CloudTrail, Config, and network flow logs, write-only from the source accounts and immutable, so an attacker who compromises a workload account cannot erase the evidence.
- A **security / audit** account running organisation-wide threat detection (GuardDuty, Security Hub, Defender) with read access across all accounts.
- A **shared-services / network** account holding the transit gateway, private DNS, and shared CI infrastructure.
- A **management** account that does only organisation administration and runs no workloads, because it is the most privileged account and its blast radius must be minimal.

**Account vending** — AWS Control Tower, the Landing Zone Accelerator, or a Terraform pipeline — makes creating a new account a request that produces an account with the full baseline already applied: the service control policies, the logging configuration, the guardrails, the network attachment, and the break-glass roles. Nobody creates a bare account by hand.

**Identity** is centralised: IAM Identity Center or Entra ID provides one login, with permission sets that map to roles in each account, so there are no standing users inside the workload accounts and access is granted by assigning a person to a permission set for the accounts and duration they need.

Azure\'s model is the same shape with different names: management groups form the tree, subscriptions are the account boundary, Azure Policy provides the guardrails, and Azure Landing Zones is the reference architecture and tooling for the whole structure.`,

    contentHi: `## Serverless aur event-driven building blocks

Ek event-driven architecture compute ke chhote pieces ko direct calls ke bajaay messaging ke through connect karti hai, to producers aur consumers independently scale, fail, aur deploy karते hain.
- Ek **API gateway** incoming HTTP requests ko events ya function invocations mein badalता hai, aur authentication, rate limiting, request validation, aur usage plans handle karता hai.
- Ek **function** compute unit hai (Module 13, Lesson 2).
- Ek **queue** har message ko ek consumer group ko deliver karता hai, at least once, optionally order mein. Ye load buffer karता hai.
- Ek **topic** ek publish ko kई independent subscribers ko fan out karता hai.
- Ek **event bus** content-based routing add karता hai: rules event mein patterns match karती hain aur matching events targets ko forward karती hain.
- Ek **workflow engine** ek multi-step process ko retries, branching, waits, parallel branches, aur human-approval steps ke saath ek state machine ke roop mein orchestrate karता hai.
- Ek **stream** records ka ek ordered, replayable log hai jise multiple consumers apne offset par read karते hain.

## Patterns jo ise reliable banाते hain

- **Idempotency**. In systems mein message delivery **at least once** hai — ek network hiccup ek redelivery cause karता hai — to ek consumer ko same outcome produce karना chahिए jab ye ek message do baar process karता hai. Aap ise ek idempotency key par deduplicating karके, repeat karने ke liye safe database operations use karके, ya operation ko naturally idempotent banाकर achieve karते ho. Ye ek event-driven system mein optional nahi hai.
- **Dead-letter queues**. Ek message ke ek configured number of times fail karने ke baad, ye ek dead-letter queue mein move hota hai forever retry hone ya silently dropped hone ke bajaay. DLQ depth zero se upar jaane par alarm karo.
- **Retries with backoff**. Processing attempts ke beech, ek exponentially increasing interval random jitter ke saath wait karो.
- **Fan-out done properly**. Jab ek event kई consumers tak pahunchna chahिए, ise ek topic ko publish karो, topic ko per consumer ek queue ko deliver karवाओ, aur ek function ko har queue process karवाओ.
- **Claim check**. Jab ek payload large hai, ise object storage mein daalो aur sirf object key ko message mein daalो.
- **Transactional outbox**. Ek event khoने se bachने ke liye jab ek service apne database mein likhती hai aur phir publish karती hai, database row aur ek "event to publish" record ek same transaction mein likhो.

## Multi-account structure aur landing zone

Ek **cloud account** — ek AWS account, ek Azure subscription, ek GCP project — security, billing, aur blast radius ke liye cloud jo sabse strong boundary provide karता hai wo hai. Ek account ke andar sab kuch ek IAM domain, ek bill, aur ek fate share karता hai. Ek mature organisation isliए kई accounts chalाती hai, commonly ek per team per environment.

**Organisation** unhe ek saath tie karती hai:
- **AWS Organizations** (ya Azure Management Groups) accounts ka ek tree hai.
- **Organisational units** accounts ko purpose se group karती hain.
- **Service control policies** ek OU se attached account-wide guardrails hain jise account ka root user bhi override nahi kar sakता (Module 13, Lesson 3).

Kuch accounts **central** hain:
- Ek **log archive** account jo har doosre account ke logs ki ek copy receive karता hai, write-only aur immutable.
- Ek **security / audit** account jo organisation-wide threat detection chalाता hai.
- Ek **shared-services / network** account jo transit gateway, private DNS rakhता hai.
- Ek **management** account jo sirf organisation administration karता hai aur koi workloads nahi chalाता.

**Account vending** — AWS Control Tower, Landing Zone Accelerator — ek naya account banाना ek request banाता hai jo full baseline already applied ke saath ek account produce karता hai.

**Identity** centralised hai: IAM Identity Center ya Entra ID ek login provide karता hai, permission sets ke saath jo har account mein roles se map karते hain.

Azure ka model different names ke saath same shape hai: management groups tree banाते hain, subscriptions account boundary hain, Azure Policy guardrails provide karता hai, aur Azure Landing Zones poore structure ke liye reference architecture hai.`,

    examples: [
      {
        title: 'An upload-processing pipeline: API → S3 → event → fan-out → functions, with DLQs and idempotency',
        titleHi: 'Ek upload-processing pipeline: API → S3 → event → fan-out → functions, DLQs aur idempotency ke saath',
        code: `# GOAL: user uploads a video; we transcode it, extract a thumbnail, and index it
# for search - three independent consumers, each may fail/retry on its own.

1. API Gateway  POST /uploads  -> Lambda 'create-upload'
     validates, returns a PRESIGNED S3 PUT url (Lesson 4). browser uploads to S3.

2. S3  s3:ObjectCreated:*  on  uploads/  -> EventBridge event

3. EventBridge rule (pattern: detail-type = "Object Created", bucket = uploads)
     -> SNS topic  'new-upload'          (fan-out point)

4. SNS -> three SQS queues, one per consumer:
     transcode-queue  --(has)-->  transcode-dlq   (maxReceiveCount 5)
     thumbnail-queue  --(has)-->  thumbnail-dlq
     index-queue      --(has)-->  index-dlq

5. each queue -> its own Lambda:
     transcode-fn:  reads {bucket,key}, transcodes, writes outputs/*, on success
       deletes the message. IDEMPOTENT: output key = hash(input key + preset);
       if it already exists in S3, skip and ack.
     thumbnail-fn:  IDEMPOTENT: PutObject is a no-op if the thumbnail exists.
     index-fn:      IDEMPOTENT: "INSERT ... ON CONFLICT (video_id) DO UPDATE".

6. alarms:  ANY *-dlq  ApproximateNumberOfMessagesVisible > 0  -> page.
   redrive: fix the bug, then  aws sqs start-message-move-task  dlq -> main queue.

# WHY per-consumer queues (not SNS straight to the 3 Lambdas):
#   - transcode is slow + can fail (a corrupt file); it retries 5x then DLQs
#     WITHOUT blocking or re-running thumbnail/index
#   - each consumer scales its Lambda concurrency independently
#   - a poison message lands in ONE dlq, not all three

# Azure: Event Grid (= EventBridge) -> Service Bus topic -> 3 subscriptions
#   (each with its own dead-letter sub-queue) -> 3 Functions.`,
        output: `The fan-out shape - S3 event -> bus -> topic -> one queue per consumer -> one
function per queue - gives each of the three jobs its OWN buffer, retry policy,
DLQ, and concurrency. A corrupt video that kills the transcoder retries 5 times
and lands in transcode-dlq (alarmed) while thumbnail and index succeed
untouched. And because delivery is at-least-once, every function is written to be
idempotent - a redelivered message re-produces the same output, not a duplicate.`,
        explain: 'An upload-processing pipeline is built entirely from managed serverless pieces. The API gateway invokes a small function that validates the request and returns a presigned URL, so the browser uploads the video directly to object storage. The object-created event flows through the event bus, which matches it with a rule and forwards it to a topic — the fan-out point. The topic delivers to three separate queues, one for each downstream job: transcoding, thumbnail extraction, and search indexing. Each queue has its own dead-letter queue configured to receive a message after five failed processing attempts, and each queue is processed by its own function. The functions are written to be idempotent: the transcoder derives its output key from a hash of the input and preset and skips if that output already exists, the thumbnail function relies on the fact that writing an object that already exists is a no-op, and the indexer uses an insert-or-update so a repeat does not create a duplicate row. Alarms fire on any dead-letter queue having messages, and there is a documented redrive to move fixed messages back. The reason for a queue per consumer rather than wiring the topic straight to three functions is isolation: a corrupt video that repeatedly kills the transcoder is retried and dead-lettered on its own without blocking or re-running the thumbnail and index jobs, each consumer scales its concurrency independently, and a poison message contaminates exactly one dead-letter queue. The Azure shape is Event Grid to a Service Bus topic with three subscriptions each having a dead-letter sub-queue, feeding three functions.',
        explainHi: 'Ek upload-processing pipeline poori tarah managed serverless pieces se built hai. API gateway ek chhota function invoke karता hai jo request validate karता hai aur ek presigned URL return karता hai. Object-created event event bus ke through flow karता hai, jo ise ek rule ke saath match karता hai aur ek topic ko forward karता hai — fan-out point. Topic teen separate queues ko deliver karता hai, har downstream job ke liye ek. Har queue ki apni dead-letter queue hai jo paanch failed processing attempts ke baad ek message receive karने ke liye configured hai. Functions idempotent hone ke liye likhे gaye hain. Alarms kisi bhi dead-letter queue ke messages hone par fire karते hain. Ek queue per consumer ka reason isolation hai: ek corrupt video jo transcoder ko repeatedly kill karता hai retried aur dead-lettered hai apne aap bina thumbnail aur index jobs ko block ya re-run kiye.',
      },
      {
        title: 'A landing zone: the account layout and what each guardrail does',
        titleHi: 'Ek landing zone: account layout aur har guardrail kya karता hai',
        code: `# AWS Organizations tree for a mid-size company:

management account (org root)         <- ONLY org admin. no workloads. tightly locked.
├── Security OU
│   ├── log-archive        <- receives ALL accounts' CloudTrail/Config/VPC flow logs.
│   │                         S3 with Object Lock (immutable), write-only from others.
│   └── audit              <- GuardDuty + Security Hub delegated admin; read-only
│                             cross-account access for the security team.
├── Infrastructure OU
│   ├── network            <- the Transit Gateway, Route 53 private zones, the
│   │                         central egress VPC, Direct Connect.
│   └── shared-services    <- CI/CD runners, the artifact registry, the golden AMIs.
├── Workloads OU
│   ├── Prod OU
│   │   ├── payments-prod   ├── web-prod   ├── data-prod
│   └── NonProd OU
│       ├── payments-staging  ├── web-staging  ├── payments-dev  ├── web-dev
└── Sandbox OU
    └── (per-engineer throwaway accounts, hard $ cap, auto-nuke after 7 days)

# SCPs (guardrails - even root can't override):
  ALL accounts:      deny actions outside [eu-west-1, eu-central-1]
                     deny  cloudtrail:StopLogging / :DeleteTrail
                     deny  organizations:LeaveOrganization
                     deny creating IAM users with access keys (roles/SSO only)
  Prod OU only:      deny  rds:DeleteDBInstance without a "DeletionProtection=false" +
                          a break-glass role; deny disabling backups
  Sandbox OU:        deny  ec2 instance types above 'large'; deny anything outside a
                          short allowlist of services
  NonProd:           deny  buying Reserved Instances / Savings Plans (do that centrally)

# ACCOUNT VENDING (Control Tower / a Terraform module):
#   'request account: web-prod, Prod OU, owner=web-team' ->
#     account created, SCPs inherited, log/GuardDuty enrolment, VPC + TGW attach,
#     an OrganizationAccountAccessRole for break-glass, SSO permission sets bound.
#   time from request to a usable, compliant account: minutes.

# Azure: the same as Management Groups (root > Platform MG {identity, management,
#   connectivity} + Landing Zones MG {corp, online} + Sandbox MG), Azure Policy for
#   the guardrails, Azure Landing Zones bicep/Terraform for vending.`,
        output: `The account is the blast-radius boundary, so the org is a TREE of them grouped by
purpose. Central accounts (log-archive, audit, network, shared-services) are
separated so a workload compromise can't erase logs or reach the network
controls. SCPs at the OU level are guardrails root itself can't break - region
lock, no disabling audit logging, no IAM user keys, prod deletion protection.
Account vending applies the whole baseline automatically, so a new account is
compliant from minute one instead of being hardened later (or never).`,
        explain: 'A landing zone is an account tree structured by purpose. At the top, a management account does only organisation administration and runs no workloads, because it is the most privileged account and its blast radius must be minimal. A Security organisational unit holds a log-archive account that receives every other account\'s audit and flow logs into immutable, write-only storage — so a compromise of a workload account cannot erase the evidence — and an audit account running organisation-wide threat detection with read-only access across everything. An Infrastructure unit holds a network account with the shared connectivity and a shared-services account with CI and artifacts. A Workloads unit splits into Production and Non-Production sub-units, each with one account per service, and a Sandbox unit holds disposable per-engineer accounts with a hard spending cap and automatic deletion. Service control policies are attached at the unit level and cannot be overridden even by an account\'s root user: all accounts are locked to approved regions, prevented from disabling audit logging or leaving the organisation, and prevented from creating IAM users with long-lived keys; the Production unit additionally has deletion protection on databases and backups; the Sandbox unit is restricted to small instances and a short service allowlist. Account vending, through Control Tower or a Terraform module, turns a request for a new account into a fully baselined, compliant account in minutes, with the policies, logging enrolment, network attachment, break-glass role, and single-sign-on bindings all applied automatically. The Azure equivalent uses management groups, Azure Policy, and Azure Landing Zones tooling with the same structure.',
        explainHi: 'Ek landing zone purpose se structured ek account tree hai. Top par, ek management account sirf organisation administration karता hai aur koi workloads nahi chalाता. Ek Security organisational unit ek log-archive account rakhती hai jo har doosre account ke audit aur flow logs immutable, write-only storage mein receive karता hai — to ek workload account ka ek compromise evidence erase nahi kar sakta — aur ek audit account jo organisation-wide threat detection chalाता hai. Ek Workloads unit Production aur Non-Production sub-units mein split hoती hai, har ek per service ek account ke saath. Service control policies unit level par attached hain aur ek account ke root user dwara bhi override nahi ki ja sakती: saare accounts approved regions ke liye locked hain. Account vending ek naye account ke liye ek request ko minutes mein ek fully baselined, compliant account mein badalता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a non-idempotent event consumer (the classic double-charge bug)
def handle_payment_event(msg):
    order = get_order(msg["order_id"])
    stripe.charge(order.customer, order.amount)      # <-- runs again on redelivery
    mark_order_paid(order.id)
# the consumer processes msg, charges the card, then the instance dies BEFORE
# acking. the queue redelivers (at-least-once). the card is charged AGAIN.
# customer sees two charges; support ticket; chargeback; trust gone.`,
        right: `# dedupe on an idempotency key; make the side effect safe to repeat:
def handle_payment_event(msg):
    key = msg["idempotency_key"]           # stable per logical payment, in the message
    if already_processed(key):             # a table: (key) PRIMARY KEY
        return                             # ack, do nothing - we've done this
    order = get_order(msg["order_id"])
    # pass the key to the payment provider - Stripe dedupes on it server-side:
    stripe.charge(order.customer, order.amount, idempotency_key=key)
    with db.transaction():
        record_processed(key)              # INSERT; if it races, ON CONFLICT DO NOTHING
        mark_order_paid(order.id)
# now a redelivery is a no-op: either already_processed() short-circuits, or
# Stripe returns the SAME charge for the same key.`,
        why: 'Message delivery in queues, topics, and event buses is at-least-once by design: the system guarantees a message is delivered, and the only way to guarantee that in the presence of network failures and consumer crashes is to redeliver when an acknowledgement is not received, which means a consumer that crashes after doing its work but before acknowledging will see the message again. A consumer that performs a side effect unconditionally — charging a card, sending an email, decrementing inventory, calling an external API — will therefore perform that side effect twice, and for a payment that is a double charge, a support incident, and a loss of customer trust. The fix has two parts that reinforce each other. First, carry a stable idempotency key in the message that identifies the logical operation, and keep a record of processed keys so the consumer can short-circuit a repeat. Second, make the side effect itself safe to repeat: pass the idempotency key to the payment provider so it deduplicates server-side and returns the same charge for the same key, use database operations that are no-ops on repeat, and record the processed key and the business state change in one transaction so a crash cannot leave them inconsistent. Idempotency is not an optimisation in an event-driven system; a non-idempotent consumer is a bug waiting for its first redelivery.',
        whyHi: 'Queues, topics, aur event buses mein message delivery design se at-least-once hai: system guarantee karता hai ki ek message deliver hota hai, aur network failures aur consumer crashes ki presence mein use guarantee karने ka ekmatra tarika redeliver karना hai jab ek acknowledgement receive nahi hoता, jiska matlab ek consumer jo apna kaam karने ke baad par acknowledge karने se pehle crash karता hai message dobara dekhega. Ek consumer jo ek side effect unconditionally perform karता hai — ek card charge karना, ek email bhejna — isliए wo side effect do baar perform karega. Fix ke do parts hain: pehle, message mein ek stable idempotency key carry karो aur processed keys ka ek record rakhो; doosre, side effect ko khud repeat karने ke liye safe banाओ.',
      },
      {
        wrong: `# no dead-letter queue: a poison message retries forever (or is lost)
# SQS queue with no DLQ configured, or a Lambda with no destination on failure.
# a single malformed message arrives. the consumer throws on it.
# - SQS returns it after the visibility timeout... forever. it blocks the queue's
#   effective throughput and racks up invocations.
# - OR (Lambda async with no DLQ + retries exhausted) it's silently DROPPED and
#   nobody knows an event was lost.`,
        right: `# every queue / async invoker gets a DLQ + an alarm + a redrive plan:
#   SQS:     RedrivePolicy { deadLetterTargetArn: <dlq>, maxReceiveCount: 5 }
#   Lambda async:  OnFailure destination -> an SQS DLQ (or SNS)
#   EventBridge:   a DLQ on the target
#   Step Functions: a Catch state -> a failure-handling branch
# then:
#   CloudWatch alarm: <dlq> ApproximateNumberOfMessagesVisible >= 1  -> page
#   runbook: inspect the message, fix the code/data, then redrive:
#     aws sqs start-message-move-task --source-arn <dlq> --destination-arn <main>
# a DLQ turns "silent data loss" or "infinite retry storm" into "an alarm and a
# handful of messages to look at".`,
        why: 'Without a dead-letter queue, a message that a consumer cannot process has only two possible fates, both bad. If the system retries indefinitely — which SQS does by returning the message after each visibility timeout — a single poison message consumes retry capacity forever, generates a continuous stream of failed invocations that cost money and fill logs, and in an ordered queue blocks everything behind it. If retries are instead capped and there is no dead-letter destination — which is the default for asynchronous Lambda invocations once the retry budget is exhausted — the message is silently discarded and the event it represented is simply lost, with nobody aware that a payment notification or an order event vanished. A dead-letter queue is the third fate: after a configured number of failed attempts the message is moved aside into a separate queue, where it is retained, visible, and inspectable. You attach one to every queue, every asynchronous invoker, and every event-bus target, alarm whenever the dead-letter queue is non-empty, and keep a runbook for inspecting the failed messages, fixing the underlying code or data problem, and redriving the messages back to the main queue. This converts an invisible failure mode into an alarm and a small, bounded pile of messages to deal with.',
        whyHi: 'Ek dead-letter queue ke bina, ek message jise ek consumer process nahi kar sakta ke sirf do possible fates hain, dono bure. Agar system indefinitely retry karता hai — jo SQS karता hai — ek single poison message forever retry capacity consume karता hai, failed invocations ki ek continuous stream generate karता hai jo paisa cost karती hai. Agar retries capped hain aur koi dead-letter destination nahi hai — jo asynchronous Lambda invocations ke liye default hai — message silently discard hota hai aur jo event ise represent karता tha simply lost hai. Ek dead-letter queue teesra fate hai: ek configured number of failed attempts ke baad message ek separate queue mein move hota hai, jahaan ye retained, visible, aur inspectable hai. Aap ise har queue se attach karते ho, alarm karते ho jab bhi DLQ non-empty hai.',
      },
      {
        wrong: `# running everything in one big shared AWS account "to keep it simple"
# prod, staging, dev, the data warehouse, three teams' services, CI - one account.
# consequences:
#   - a dev's over-broad IAM policy or a leaked key can touch prod resources
#   - one team's runaway Athena query / forgotten GPU cluster shows up on
#     EVERYONE's shared bill with no way to attribute it
#   - a compromised CI role has the whole account
#   - you can't apply "prod can't be deleted" without also blocking dev
#   - the account hits a service quota (e.g. VPCs, Lambda concurrency) and every
#     team is stuck`,
        right: `# accounts are the blast-radius boundary. one per (team x environment), plus
# central accounts, under an Organization:
#   management  |  log-archive  |  audit  |  network  |  shared-services
#   web-prod  web-staging  web-dev  |  payments-prod  payments-staging  ...
# then:
#   - SCPs at the OU level (prod deletion protection, region lock, no root keys)
#   - each account = its own IAM domain, its own bill line, its own quotas
#   - central logging is write-only from workload accounts (tamper-proof)
#   - account vending (Control Tower / Terraform) applies the baseline automatically
# a compromise, a cost blowout, or a quota exhaustion is now contained to ONE account.`,
        why: 'A cloud account is the strongest isolation boundary the provider offers — it is a separate IAM domain, a separate billing entity, a separate set of service quotas, and a separate blast radius — and putting production, non-production, multiple teams, and shared infrastructure all in one account collapses all of those boundaries. A development identity with an over-broad policy, or a credential leaked from a development workload, can then reach production resources because they share an IAM domain. One team\'s expensive mistake — a runaway analytical query, a forgotten GPU cluster — appears on a single shared bill with no tag-independent way to attribute it. A compromised CI role has the entire account. A guardrail like "production databases cannot be deleted" cannot be applied without also blocking the same action in development. And when the account hits a service quota, every team sharing it is blocked at once. The multi-account structure restores each of these boundaries: one account per team per environment plus a small set of central accounts, grouped into organisational units, with service control policies applied per unit, centralised tamper-proof logging, and automated account vending that applies the full security baseline to every new account. A compromise, a cost blowout, or a quota exhaustion is then contained to one account instead of affecting the whole organisation.',
        whyHi: 'Ek cloud account provider jo sabse strong isolation boundary offer karता hai wo hai — ye ek separate IAM domain, ek separate billing entity, service quotas ka ek separate set, aur ek separate blast radius hai — aur production, non-production, multiple teams, aur shared infrastructure sab ek account mein daalna un saari boundaries ko collapse karता hai. Ek development identity ek over-broad policy ke saath production resources reach kar sakती hai kyunki wo ek IAM domain share karते hain. Ek team ki expensive mistake ek single shared bill par appear hoती hai. Ek compromised CI role ke paas poora account hai. Multi-account structure in boundaries mein se har ek ko restore karता hai: per team per environment ek account plus central accounts ka ek chhota set. Ek compromise, ek cost blowout, ya ek quota exhaustion phir ek account tak contained hai.',
      },
    ],

    realWorld: [
      {
        en: '**Double-charged on a redelivery** — a payments consumer charged the card then acked. A deploy rolled the consumer pods mid-batch; every in-flight message redelivered and re-charged. ~1,200 customers double-charged. The fix was an idempotency key passed through to Stripe plus a processed-keys table; a policy now requires "prove idempotency" in review for any consumer with a side effect.',
        hi: '**Ek redelivery par double-charged** — ek payments consumer ne card charge kiya phir ack kiya. Ek deploy ne consumer pods ko mid-batch roll kiya; har in-flight message redeliver aur re-charge hua. ~1,200 customers double-charged. Fix ek idempotency key Stripe ke through pass kiya gaya plus ek processed-keys table.',
      },
      {
        en: '**A poison message, 4M wasted invocations** — an SQS→Lambda pipeline had no DLQ. One malformed event threw on every attempt and SQS returned it forever; over a weekend it drove 4 million failed invocations and a $600 bill before anyone noticed. Adding a DLQ with `maxReceiveCount: 5` and an alarm turned the next one into a Monday-morning ticket.',
        hi: '**Ek poison message, 4M wasted invocations** — ek SQS→Lambda pipeline ke paas koi DLQ nahi tha. Ek malformed event har attempt par throw karta tha aur SQS ise forever return karta tha; ek weekend mein isne 4 million failed invocations drive kiye. Ek DLQ `maxReceiveCount: 5` ke saath add karna agle ko ek Monday-morning ticket bana diya.',
      },
      {
        en: '**One account, one quota, everyone stuck** — a company ran everything in one account and hit the default 5-VPC-per-region limit during a launch. The quota increase took AWS 2 days; the launch slipped. The subsequent migration to a multi-account landing zone (Control Tower) took a quarter but removed a whole class of shared-fate problems.',
        hi: '**Ek account, ek quota, sab stuck** — ek company ne sab kuch ek account mein chalaya aur ek launch ke dauraan default 5-VPC-per-region limit hit ki. Quota increase ne AWS ko 2 din lage; launch slip hua. Ek multi-account landing zone par subsequent migration ek quarter laga.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must an event consumer be idempotent, and how do you make one idempotent?',
        qHi: 'Ek event consumer idempotent kyun hona chahिए, aur aap ise idempotent kaise banाते ho?',
        a: 'Message delivery in queues, topics, and event buses is at-least-once by design. The system guarantees delivery, and the only way to guarantee that when networks fail and consumers crash is to redeliver a message whose acknowledgement was not received — so a consumer that finishes its work but crashes before acknowledging will process the same message again. A consumer that performs a side effect unconditionally therefore performs it twice: a double charge, a duplicate email, inventory decremented twice. You make a consumer idempotent in two reinforcing ways. First, carry a stable idempotency key in the message that identifies the logical operation, and keep a table of processed keys so a repeat is detected and short-circuited. Second, make the side effect itself safe to repeat: pass the idempotency key to the external service — payment providers deduplicate on it and return the same result for the same key — use database operations that are no-ops on repeat such as insert-or-do-nothing or conditional writes, design the operation to set a value rather than increment it, and record the processed key and the business state change in the same transaction so a crash cannot leave them inconsistent. Idempotency is not optional in an event-driven system; a non-idempotent consumer with a side effect is a defect that manifests on its first redelivery.',
        aHi: 'Queues, topics, aur event buses mein message delivery design se at-least-once hai. System delivery guarantee karता hai, aur jab networks fail hote hain aur consumers crash karте hain tab use guarantee karने ka ekmatra tarika ek message redeliver karना hai jiska acknowledgement receive nahi hua — to ek consumer jo apna kaam khatam karता hai par acknowledge karने se pehle crash karता hai same message dobara process karega. Aap ek consumer ko do reinforcing tarikon mein idempotent banाते ho. Pehle, message mein ek stable idempotency key carry karो aur processed keys ki ek table rakhо. Doosre, side effect ko khud repeat karने ke liye safe banाओ: idempotency key ko external service ko pass karो, repeat par no-op database operations use karो, operation ko ek value set karने ke liye design karो increment karने ke bajaay.',
      },
      {
        q: 'What is a dead-letter queue and why does every queue need one? Describe the fan-out pattern.',
        qHi: 'Ek dead-letter queue kya hai aur har queue ko ek kyun chahिए? Fan-out pattern describe karो.',
        a: 'A dead-letter queue is where a message goes after it has failed processing a configured number of times, instead of being retried forever or silently dropped. Without one, a message a consumer cannot handle has two bad fates: infinite retry, which consumes capacity, generates cost and log noise, and blocks an ordered queue; or, once a capped retry budget is exhausted with no failure destination, silent loss of the event. A dead-letter queue moves the message aside into a separate queue where it is retained and inspectable. You attach one to every queue, asynchronous invoker, and event-bus target, alarm when its depth is above zero, and keep a runbook to inspect the failed messages, fix the cause, and redrive them to the main queue. The fan-out pattern is how one event reaches several independent consumers reliably: publish the event to a topic, have the topic deliver to one queue per consumer, and have a function process each queue. Each consumer then buffers, retries, dead-letters, and scales its concurrency independently, so a slow or failing consumer is isolated — a poison message contaminates exactly one dead-letter queue, and one consumer being retried does not affect the others. Wiring a topic straight to several functions loses that per-consumer buffer and retry isolation, so the queue-per-consumer layer is what makes fan-out robust rather than fragile.',
        aHi: 'Ek dead-letter queue wo hai jahaan ek message jaता hai ek configured number of times processing fail karने ke baad, forever retry hone ya silently dropped hone ke bajaay. Ek ke bina, ek message jo ek consumer handle nahi kar sakta ke do bure fates hain: infinite retry, ya, ek capped retry budget exhaust hone ke baad bina ek failure destination ke, event ka silent loss. Ek dead-letter queue message ko ek separate queue mein move karता hai jahaan ye retained aur inspectable hai. Aap ise har queue se attach karते ho, alarm karते ho jab iski depth zero se upar hai. Fan-out pattern ye hai ki ek event kई independent consumers tak reliably kaise pahunchta hai: event ko ek topic ko publish karो, topic ko per consumer ek queue ko deliver karवाओ. Har consumer phir independently buffer, retry, dead-letter, aur scale karता hai.',
      },
      {
        q: 'Why does a mature organisation use many cloud accounts, and what is a landing zone?',
        qHi: 'Ek mature organisation kई cloud accounts kyun use karती hai, aur ek landing zone kya hai?',
        a: 'A cloud account is the strongest isolation boundary the provider offers — a separate IAM domain, a separate billing entity, a separate set of service quotas, and a separate blast radius. Putting production, non-production, multiple teams, and shared infrastructure in one account collapses all of those: a development credential can reach production because they share an IAM domain, one team\'s cost mistake lands on a shared bill, a compromised CI role has everything, a guardrail like "production cannot be deleted" also blocks development, and a service quota exhausted by one team blocks all of them. So a mature organisation runs one account per team per environment plus a small set of central accounts, and a landing zone is the structured way to build and govern that. It is an account tree under an organisation, with organisational units grouping accounts by purpose, service control policies applied per unit as guardrails even the root user cannot override, central accounts for tamper-proof log archival, organisation-wide security tooling, shared networking, and a management account that does only org administration, and account vending — Control Tower, the Landing Zone Accelerator, or a Terraform pipeline — that turns a request for a new account into a fully baselined, compliant account in minutes with the policies, logging, network attachment, break-glass role, and single-sign-on bindings applied automatically. Identity is centralised so there are no standing users in workload accounts. Azure uses the same shape with management groups, subscriptions, Azure Policy, and Azure Landing Zones.',
        aHi: 'Ek cloud account provider jo sabse strong isolation boundary offer karता hai wo hai — ek separate IAM domain, ek separate billing entity, service quotas ka ek separate set, aur ek separate blast radius. Production, non-production, multiple teams, aur shared infrastructure ek account mein daalna un sab ko collapse karता hai. To ek mature organisation per team per environment ek account plus central accounts ka ek chhota set chalाती hai, aur ek landing zone use build aur govern karने ka structured tarika hai. Ye ek organisation ke tahat ek account tree hai, organisational units ke saath jo accounts ko purpose se group karती hain, service control policies per unit guardrails ke roop mein applied jise root user bhi override nahi kar sakता, tamper-proof log archival ke liye central accounts, aur account vending jo ek naye account ke liye ek request ko minutes mein ek fully baselined account mein badalता hai. Azure same shape use karता hai management groups, subscriptions, Azure Policy ke saath.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the serverless / event-driven building blocks (API gateway, function, queue, topic, event bus, workflow, stream) with their AWS/Azure names and what each is for.',
        taskHi: 'Ek comment mein, serverless / event-driven building blocks list karo.',
        hint: 'API GATEWAY — turns HTTP requests into events / function invocations; does auth (JWT / IAM / API keys), throttling, request validation against a schema, usage plans. AWS API Gateway / Lambda Function URLs (simple) / Azure API Management / GCP API Gateway. FUNCTION — the compute unit (Module 13 L2). Lambda / Azure Functions / Cloud Functions / Cloud Run functions. QUEUE — point-to-point, ONE consumer group, AT-LEAST-ONCE, ordered (FIFO) or not; buffers load, decouples producer speed from consumer speed. SQS / Azure Storage Queues / Service Bus queues / Cloud Tasks. TOPIC / PUB-SUB — FAN-OUT: one publish → N INDEPENDENT subscribers. SNS / Service Bus topics / Pub/Sub. EVENT BUS — content-based ROUTING + FILTERING: rules match event patterns and forward to targets; schema registry, archive + replay. EventBridge / Event Grid. WORKFLOW ENGINE — orchestrate a multi-step process as a STATE MACHINE with retries, branching, waits, parallel branches, human-approval steps. Step Functions / Durable Functions / Cloud Workflows. STREAM — an ORDERED, REPLAYABLE log of records; multiple consumers each at their OWN offset; retention window. Kinesis / Kafka (MSK) / Event Hubs / Pub/Sub with retention. The point of event-driven: producers and consumers scale, fail, and deploy INDEPENDENTLY, connected by messaging not direct calls.',
        hintHi: 'API GATEWAY — HTTP requests ko events / function invocations mein badalta hai; auth, throttling, request validation, usage plans. AWS API Gateway / Azure API Management / GCP API Gateway. FUNCTION — compute unit (Module 13 L2). QUEUE — point-to-point, EK consumer group, AT-LEAST-ONCE, FIFO ya nahi; load buffer karta hai. SQS / Azure Storage Queues / Service Bus queues. TOPIC / PUB-SUB — FAN-OUT: ek publish → N INDEPENDENT subscribers. SNS / Service Bus topics / Pub/Sub. EVENT BUS — content-based ROUTING + FILTERING. EventBridge / Event Grid. WORKFLOW ENGINE — ek multi-step process ko ek STATE MACHINE ke roop mein orchestrate. Step Functions / Durable Functions / Cloud Workflows. STREAM — ek ORDERED, REPLAYABLE log; multiple consumers apne offset par. Kinesis / Kafka (MSK) / Event Hubs. Point: producers aur consumers INDEPENDENTLY scale/fail/deploy karte hain.',
      },
      {
        task: 'In a comment, explain idempotency (why + how), dead-letter queues (why + the redrive process), and the fan-out pattern (topic → queue-per-consumer → function-per-queue) and why the per-consumer queue matters.',
        taskHi: 'Ek comment mein, idempotency, dead-letter queues, aur fan-out pattern samjhao.',
        hint: 'IDEMPOTENCY — delivery is AT-LEAST-ONCE (the system guarantees delivery → the only way, given network failures + consumer crashes, is to redeliver an un-acked message → a consumer that finishes its work but crashes before ack processes it AGAIN). A consumer with an unconditional side effect (charge a card, send an email, decrement inventory) does it TWICE. MAKE IT IDEMPOTENT two reinforcing ways: (1) carry a STABLE idempotency key in the message identifying the logical op; keep a processed-keys table (`(key) PRIMARY KEY`) and short-circuit a repeat; (2) make the side effect SAFE TO REPEAT — pass the key to the external service (Stripe etc. dedupe server-side, return the SAME result for the SAME key), use `INSERT ... ON CONFLICT DO NOTHING` / conditional writes, SET a value rather than INCREMENT it, and record the processed key + the business state change in ONE transaction. NON-NEGOTIABLE for event-driven. DEAD-LETTER QUEUE (DLQ) — after N failed processing attempts (`maxReceiveCount: 5`) a message goes to a separate DLQ instead of: infinite retry (consumes capacity, cost + log noise, blocks an ordered queue) OR silent loss (capped retries exhausted, no failure destination — the default for async Lambda). Attach one to EVERY queue / async invoker / event-bus target. ALARM on DLQ depth ≥ 1 → page. REDRIVE PROCESS: inspect the message → fix the code/data bug → `aws sqs start-message-move-task --source-arn <dlq> --destination-arn <main>`. FAN-OUT: one event → a TOPIC → ONE QUEUE PER CONSUMER → ONE FUNCTION PER QUEUE. WHY the per-consumer queue (not the topic straight to N functions): each consumer buffers, retries, DLQs, and scales concurrency INDEPENDENTLY → a poison message lands in ONE dlq not all N; a slow/failing consumer (a corrupt file that kills the transcoder, retried 5× then DLQ\'d) does NOT block or re-run the others. (Also: CLAIM CHECK — large payload → S3, put the key in the message. TRANSACTIONAL OUTBOX — write the DB row + the "event to publish" in ONE transaction, a relay publishes from the outbox → no lost events on a crash between the write and the publish.)',
        hintHi: 'IDEMPOTENCY — delivery AT-LEAST-ONCE hai → ek consumer jo apna kaam khatam karta hai par ack se pehle crash karta hai ise DOBARA process karta hai. Unconditional side effect (card charge, email) DO BAAR hota hai. IDEMPOTENT BANAO: (1) message mein ek STABLE idempotency key; processed-keys table; repeat short-circuit; (2) side effect ko SAFE TO REPEAT banao — key ko external service ko pass karo, `INSERT ... ON CONFLICT DO NOTHING`, SET (increment nahi), ek transaction mein record. NON-NEGOTIABLE. DEAD-LETTER QUEUE — N failed attempts (`maxReceiveCount: 5`) ke baad ek DLQ ko jaata hai instead of: infinite retry YA silent loss. HAR queue / async invoker / event-bus target se attach karo. ALARM DLQ depth ≥ 1 par. REDRIVE: inspect → fix → `aws sqs start-message-move-task`. FAN-OUT: ek event → ek TOPIC → PER CONSUMER EK QUEUE → PER QUEUE EK FUNCTION. per-consumer queue KYUN: har consumer INDEPENDENTLY buffer/retry/DLQ/scale karta hai → ek poison message EK dlq mein; ek failing consumer doosron ko block NAHI karta.',
      },
      {
        task: 'In a comment, explain why an org uses many accounts, and describe a landing zone: the OU tree, SCPs, the central accounts, account vending, and centralised identity.',
        taskHi: 'Ek comment mein, ek org kई accounts kyun use karti hai samjhao, aur ek landing zone describe karo.',
        hint: 'WHY MANY ACCOUNTS: an account (AWS account / Azure subscription / GCP project) is the STRONGEST boundary the cloud offers — a separate IAM domain, a separate BILL, a separate set of SERVICE QUOTAS, a separate BLAST RADIUS. One shared account collapses all of these: a dev credential reaches prod (shared IAM domain); one team\'s runaway query lands on the shared bill un-attributable; a compromised CI role has everything; "prod can\'t be deleted" also blocks dev; one team exhausting a quota (VPCs, Lambda concurrency) blocks all teams. So: ONE ACCOUNT PER (team × environment) + a small set of CENTRAL accounts. LANDING ZONE = the structured way to build + govern that. THE TREE (AWS Organizations / Azure Management Groups): a MANAGEMENT account at the root (ONLY org admin, NO workloads, tightly locked) → Security OU {log-archive, audit} → Infrastructure OU {network, shared-services} → Workloads OU {Prod OU {per-service accounts}, NonProd OU {…}} → Sandbox OU {disposable per-engineer accounts, hard $ cap, auto-nuke}. SCPs (per OU, guardrails EVEN ROOT CANNOT OVERRIDE — Module 13 L3): deny actions outside approved regions; deny `cloudtrail:StopLogging`/`DeleteTrail`; deny `organizations:LeaveOrganization`; deny creating IAM users with access keys (roles/SSO only); Prod OU: RDS deletion protection, deny disabling backups; Sandbox: instance-type + service allowlist. CENTRAL ACCOUNTS: LOG-ARCHIVE (all accounts\' CloudTrail/Config/flow logs, WRITE-ONLY from others, S3 Object Lock = IMMUTABLE → a compromised workload account can\'t erase evidence); AUDIT/SECURITY (GuardDuty + Security Hub delegated admin, READ across all); NETWORK (the TGW, private DNS, central egress, Direct Connect); SHARED-SERVICES (CI runners, artifact registry, golden AMIs). ACCOUNT VENDING (Control Tower / Landing Zone Accelerator / a Terraform pipeline): "request account X in OU Y" → created WITH the baseline already applied (SCPs inherited, logging + GuardDuty enrolment, VPC + TGW attach, a break-glass OrganizationAccountAccessRole, SSO permission sets bound) → minutes to a compliant account, never hand-built. IDENTITY: IAM Identity Center / Entra ID — ONE login, permission sets mapped to roles in each account → NO standing users in workload accounts; access = assign a person to a permission set for the accounts + duration they need. Azure: Management Groups (root > Platform MG {identity, management, connectivity} + Landing Zones MG {corp, online} + Sandbox), Azure Policy for guardrails, Azure Landing Zones bicep/Terraform for vending.',
        hintHi: 'WHY MANY ACCOUNTS: ek account cloud jo sabse STRONG boundary offer karta hai — separate IAM domain, separate BILL, separate SERVICE QUOTAS, separate BLAST RADIUS. Ek shared account sab collapse karta hai. To: PER (team × environment) EK ACCOUNT + CENTRAL accounts. LANDING ZONE = use build + govern karne ka structured tarika. TREE: root par ek MANAGEMENT account (SIRF org admin, KOI workloads nahi) → Security OU {log-archive, audit} → Infrastructure OU {network, shared-services} → Workloads OU {Prod, NonProd} → Sandbox OU. SCPs (per OU, ROOT BHI OVERRIDE NAHI kar sakta): approved regions, no disabling CloudTrail/GuardDuty, no IAM user keys, Prod deletion protection. CENTRAL: LOG-ARCHIVE (WRITE-ONLY, IMMUTABLE), AUDIT/SECURITY, NETWORK, SHARED-SERVICES. ACCOUNT VENDING (Control Tower): request → baseline already applied → minutes. IDENTITY: IAM Identity Center / Entra ID — ONE login, NO standing users. Azure: Management Groups, Azure Policy, Azure Landing Zones.',
      },
    ],

    keyTakeaways: [
      'EVENT-DRIVEN BUILDING BLOCKS: API GATEWAY (HTTP → events, auth/throttle/validate), FUNCTION (compute), QUEUE (point-to-point, at-least-once, buffers load — SQS/Service Bus), TOPIC (fan-out to N subscribers — SNS/Pub/Sub), EVENT BUS (content routing + filtering — EventBridge/Event Grid), WORKFLOW (a state machine with retries/branching/waits — Step Functions/Durable Functions), STREAM (ordered replayable log, per-consumer offset — Kinesis/Kafka/Event Hubs).',
      'IDEMPOTENCY is NON-NEGOTIABLE — delivery is AT-LEAST-ONCE, so a message CAN arrive twice (a consumer that crashes after its work but before ack). Dedupe on an idempotency key + a processed-keys table, pass the key to external services, use `INSERT ... ON CONFLICT DO NOTHING`, SET rather than INCREMENT, and record the key + the state change in one transaction. A non-idempotent consumer double-charges customers.',
      'DEAD-LETTER QUEUE: after N failed attempts (`maxReceiveCount`) a message goes to a DLQ instead of infinite retry (blocks the queue, costs money) or silent loss (async Lambda default). Attach one to EVERY queue/async-invoker/target, ALARM on depth ≥ 1, and keep a redrive runbook (inspect → fix → `start-message-move-task`).',
      'FAN-OUT: one event → a TOPIC → ONE QUEUE PER CONSUMER → ONE FUNCTION PER QUEUE. The per-consumer queue is what gives each consumer its own buffer, retry policy, DLQ, and concurrency — a poison message lands in one DLQ, and a slow/failing consumer doesn\'t block the others. (Also: CLAIM CHECK for big payloads, TRANSACTIONAL OUTBOX to not lose events on a crash between the DB write and the publish.)',
      'MANY ACCOUNTS because an account is the strongest security + billing + quota + blast-radius boundary. A LANDING ZONE: an OU tree (management / Security {log-archive, audit} / Infrastructure {network, shared-services} / Workloads {Prod, NonProd} / Sandbox), SCPs per OU as guardrails root can\'t override (region lock, no disabling audit logging, no IAM user keys, prod deletion protection), central tamper-proof logging, ACCOUNT VENDING (Control Tower) that applies the baseline in minutes, and centralised identity (Identity Center / Entra ID — no standing users). Azure: Management Groups + Azure Policy + Azure Landing Zones.',
    ],
    keyTakeawaysHi: [
      'EVENT-DRIVEN BUILDING BLOCKS: API GATEWAY (HTTP → events, auth/throttle/validate), FUNCTION (compute), QUEUE (point-to-point, at-least-once, load buffer — SQS/Service Bus), TOPIC (N subscribers ko fan-out — SNS/Pub/Sub), EVENT BUS (content routing + filtering — EventBridge/Event Grid), WORKFLOW (ek state machine retries/branching/waits ke saath — Step Functions/Durable Functions), STREAM (ordered replayable log, per-consumer offset — Kinesis/Kafka/Event Hubs).',
      'IDEMPOTENCY NON-NEGOTIABLE hai — delivery AT-LEAST-ONCE hai, to ek message do baar aa SAKTA hai. Ek idempotency key + ek processed-keys table par dedupe karo, key ko external services ko pass karo, `INSERT ... ON CONFLICT DO NOTHING`, SET (INCREMENT nahi), aur key + state change ek transaction mein record karo. Ek non-idempotent consumer customers ko double-charge karta hai.',
      'DEAD-LETTER QUEUE: N failed attempts (`maxReceiveCount`) ke baad ek message ek DLQ ko jaata hai instead of infinite retry ya silent loss. HAR queue/async-invoker/target se attach karo, depth ≥ 1 par ALARM karo, aur ek redrive runbook rakho (inspect → fix → `start-message-move-task`).',
      'FAN-OUT: ek event → ek TOPIC → PER CONSUMER EK QUEUE → PER QUEUE EK FUNCTION. Per-consumer queue har consumer ko iska apna buffer, retry policy, DLQ, aur concurrency deti hai — ek poison message ek DLQ mein, aur ek failing consumer doosron ko block nahi karta. (Bhi: bade payloads ke liye CLAIM CHECK, ek crash par events na khone ke liye TRANSACTIONAL OUTBOX.)',
      'KAI ACCOUNTS kyunki ek account sabse strong security + billing + quota + blast-radius boundary hai. Ek LANDING ZONE: ek OU tree (management / Security {log-archive, audit} / Infrastructure {network, shared-services} / Workloads {Prod, NonProd} / Sandbox), per OU SCPs guardrails ke roop mein jise root override nahi kar sakta (region lock, no disabling audit logging, no IAM user keys, prod deletion protection), central tamper-proof logging, ACCOUNT VENDING (Control Tower) jo baseline minutes mein apply karta hai, aur centralised identity. Azure: Management Groups + Azure Policy + Azure Landing Zones.',
    ],
  },
];
