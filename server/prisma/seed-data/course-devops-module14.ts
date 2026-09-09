import type { CourseLesson } from './course-js-module1';

// DevOps Module 14 — Cloud in Practice: Networking, Managed Services, Serverless & Landing Zones
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module14-part2.ts.
//
// VERIFICATION: PROSE + realistic hand-written CLI output (no live cloud account).
// Examples carry no `# VERIFY` marker, so verify-bash.mjs scans them structurally
// only. AWS is the worked example with concrete Azure equivalents in every lesson;
// GCP noted briefly. Per Jay's directive.

export const DEVOPS_MODULE_14: CourseLesson[] = [
  {
    slug: 'ops-vpc-subnets-routing-and-gateways',
    title: 'VPC, Subnets, Routing & Gateways',
    titleHi: 'VPC, Subnets, Routing Aur Gateways',
    description:
      'The virtual private network is the foundation everything else in the cloud sits on. This lesson covers how to size a VPC and carve it into public and private subnets across availability zones, how route tables decide where a packet goes, and the gateways — internet gateway, NAT gateway, egress-only gateway — that connect the private network to the outside world. AWS VPC as the worked example, Azure VNet alongside.',
    descriptionHi:
      'Virtual private network wo foundation hai jis par cloud mein baaki sab kuch baithta hai. Ye lesson cover karta hai ek VPC kaise size karein aur ise availability zones ke across public aur private subnets mein kaise carve karein, route tables kaise decide karti hain ek packet kahaan jaata hai, aur gateways — internet gateway, NAT gateway, egress-only gateway — jo private network ko bahar ki duniya se connect karte hain. AWS VPC worked example ke roop mein, Azure VNet alongside.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A private office building on a public street.** The VPC is the building and its land; you pick a plot size (the CIDR block) big enough for now and for growth, because you cannot easily move the walls later. Inside, you partition floors into rooms (subnets), and each floor is in a different part of town (availability zone) so one power cut does not darken them all. Some rooms have a window and a door to the street (public subnets); most are interior rooms with no external door (private subnets). A directory board by each lift decides where people go (route tables). The lobby has a door to the street (the internet gateway). And there is a mailroom that can send parcels out and receive replies but through which nobody from outside can walk in (the NAT gateway) — that is how interior rooms order supplies without being exposed.',
      hi: '**Ek public street par ek private office building.** VPC building aur iski land hai; aap ek plot size (CIDR block) pick karte ho jo abhi ke liye aur growth ke liye kaafi badha ho, kyunki aap baad mein aasani se walls move nahi kar sakte. Andar, aap floors ko rooms (subnets) mein partition karte ho, aur har floor town ke ek alag part mein hai (availability zone) taaki ek power cut sabko dark na kare. Kuch rooms ke paas ek window aur street ka ek door hai (public subnets); zyadaatar interior rooms hain bina ek external door ke (private subnets). Har lift ke paas ek directory board decide karta hai log kahaan jaate hain (route tables). Lobby mein street ka ek door hai (internet gateway). Aur ek mailroom hai jo parcels bahar bhej sakti hai aur replies receive kar sakti hai par jiske through bahar se koi andar nahi chal sakta (NAT gateway).',
    },

    simple: `**VPC / VNet** — your own isolated virtual network in one region. Nothing gets in
or out except through gateways you create. Defined by a **CIDR block** (address range).
\`\`\`
CIDR PLANNING (do this once, carefully - resizing is painful):
  pick a private range: 10.0.0.0/16  (65,536 IPs)  - big enough for years
  DON'T overlap with: your other VPCs, on-prem networks, partner networks you'll
    ever peer with, or the Kubernetes pod/service CIDRs
  carve /20 per AZ (4,096 IPs), then /24 subnets inside (256 IPs, ~251 usable -
    the cloud reserves ~5 per subnet)
\`\`\`

**SUBNETS** — a slice of the VPC CIDR, pinned to ONE availability zone. "Public"
vs "private" is not a setting - it's whether the route table sends 0.0.0.0/0 to
an internet gateway or not.
\`\`\`
TYPICAL LAYOUT (3 AZs):
  public   subnets  (1 per AZ): ALB/NLB, NAT gateways, bastion. small (/26-/24).
  private  app      (1 per AZ): your compute (EC2/ECS/EKS nodes/Lambda-in-VPC). large.
  private  data     (1 per AZ): RDS, ElastiCache, no route to the internet at all.
\`\`\`

**ROUTE TABLES** — a list of "for destination X, send to target Y". Each subnet is
associated with exactly one. Most specific prefix wins.
\`\`\`
PUBLIC subnet's route table:
  10.0.0.0/16 -> local          (traffic within the VPC)
  0.0.0.0/0   -> igw-xxxx       (everything else -> the internet gateway)
PRIVATE app subnet's route table:
  10.0.0.0/16 -> local
  0.0.0.0/0   -> nat-xxxx       (outbound internet via the NAT gateway)
PRIVATE data subnet's route table:
  10.0.0.0/16 -> local          (that's it - no default route = no internet, in or out)
\`\`\`

**GATEWAYS:**
\`\`\`
INTERNET GATEWAY (IGW)   VPC <-> internet, both ways. free. one per VPC. a subnet is
                         "public" iff its route table points 0.0.0.0/0 at the IGW
                         AND the resource has a public IP.
NAT GATEWAY              lets PRIVATE subnets reach OUT to the internet (updates,
                         package pulls, external APIs) while blocking inbound. managed,
                         per-AZ (put one per AZ for HA), $/hour + $/GB processed (Module 13!).
EGRESS-ONLY IGW          the IPv6 equivalent of a NAT gateway (IPv6 has no NAT;
                         this provides outbound-only for IPv6).
VPC ENDPOINT / PrivateLink  reach S3, DynamoDB, and other AWS services (or a partner
                         service) over the AWS private network - NO internet, NO NAT
                         gateway charge. GATEWAY endpoint (S3/DDB, free) vs INTERFACE
                         endpoint (an ENI in your subnet, $/hour + $/GB).
\`\`\`

**AZURE:**
\`\`\`
VNet + subnets (subnet = a range of the VNet space, spans AZs unlike AWS)
Route table = "Route Table" resource with User-Defined Routes (UDRs)
IGW           implicit (a public IP + "Internet" system route)
NAT gateway   "NAT Gateway" resource, associated to a subnet, zonal
S3/DDB endpoint equivalent = "Service Endpoints" (simple) or "Private Endpoint" (a
              private IP in your subnet, like an AWS interface endpoint)
\`\`\``,

    simpleHi: `**VPC / VNet** — ek region mein aapka apna isolated virtual network. Kuch andar ya
bahar nahi jaata sivaay un gateways ke jo aap banate ho. Ek **CIDR block** (address range) se defined.
\`\`\`
CIDR PLANNING (ise ek baar carefully karo - resize karna painful hai):
  ek private range pick karo: 10.0.0.0/16  (65,536 IPs)  - saalon ke liye kaafi badha
  OVERLAP MAT karo: aapke doosre VPCs, on-prem networks, partner networks jinse aap
    kabhi peer karoge, ya Kubernetes pod/service CIDRs ke saath
  per AZ /20 carve karo (4,096 IPs), phir andar /24 subnets (256 IPs, ~251 usable)
\`\`\`

**SUBNETS** — VPC CIDR ka ek slice, EK availability zone par pinned. "Public" vs
"private" ek setting nahi hai - ye ye hai ki route table 0.0.0.0/0 ko ek internet
gateway ko bhejti hai ya nahi.
\`\`\`
TYPICAL LAYOUT (3 AZs):
  public   subnets  (per AZ 1): ALB/NLB, NAT gateways, bastion. chhota (/26-/24).
  private  app      (per AZ 1): aapki compute. badha.
  private  data     (per AZ 1): RDS, ElastiCache, internet ka koi route bilkul nahi.
\`\`\`

**ROUTE TABLES** — "destination X ke liye, target Y ko bhejo" ki ek list. Har subnet
exactly ek se associated hai. Sabse specific prefix jeetta hai.
\`\`\`
PUBLIC subnet ki route table:
  10.0.0.0/16 -> local          (VPC ke andar traffic)
  0.0.0.0/0   -> igw-xxxx       (baaki sab kuch -> internet gateway)
PRIVATE app subnet ki route table:
  10.0.0.0/16 -> local
  0.0.0.0/0   -> nat-xxxx       (NAT gateway ke through outbound internet)
PRIVATE data subnet ki route table:
  10.0.0.0/16 -> local          (bas itna - koi default route nahi = koi internet nahi)
\`\`\`

**GATEWAYS:**
\`\`\`
INTERNET GATEWAY (IGW)   VPC <-> internet, dono ways. free. per VPC ek. ek subnet
                         "public" hai iff iski route table 0.0.0.0/0 IGW par point karti
                         hai AUR resource ke paas ek public IP hai.
NAT GATEWAY              PRIVATE subnets ko internet tak BAHAR pahunchne deta hai jabki
                         inbound block karta hai. managed, per-AZ, $/hour + $/GB processed (Module 13!).
EGRESS-ONLY IGW          ek NAT gateway ka IPv6 equivalent.
VPC ENDPOINT / PrivateLink  S3, DynamoDB, aur doosri AWS services ko AWS private network
                         par pahuncho - KOI internet nahi, KOI NAT gateway charge nahi.
                         GATEWAY endpoint (S3/DDB, free) vs INTERFACE endpoint ($/hour + $/GB).
\`\`\`

**AZURE:**
\`\`\`
VNet + subnets (subnet = VNet space ka ek range, AZs span karta hai AWS ke ulat)
Route table = "Route Table" resource User-Defined Routes (UDRs) ke saath
IGW           implicit (ek public IP + "Internet" system route)
NAT gateway   "NAT Gateway" resource, ek subnet se associated, zonal
S3/DDB endpoint equivalent = "Service Endpoints" (simple) ya "Private Endpoint"
\`\`\``,

    content: `## The VPC

A **virtual private cloud** (AWS) or **virtual network** (Azure, VNet) is your own logically isolated network inside one region. Resources you launch go inside it, and nothing reaches them from outside — and nothing they send leaves — except through gateways you explicitly create and route to. It is the security and connectivity boundary that every other cloud resource sits within.

A VPC is defined by a **CIDR block**: a private IPv4 range from RFC 1918 (\`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`), optionally with an IPv6 block as well. **Plan this once and carefully**, because while you can add secondary CIDR blocks later, you cannot shrink or renumber the primary one without rebuilding, and overlapping ranges make future connectivity impossible.

- Pick a range large enough for years of growth — \`/16\` (65,536 addresses) is a common default.
- Make sure it does **not overlap** with your other VPCs, your on-premises networks, any partner network you might ever peer or VPN with, or the pod and service CIDR ranges your Kubernetes clusters will use (those are separate address spaces that still must not collide for routing to work).
- Sub-divide deliberately: a common scheme is a \`/20\` per availability zone, then \`/24\` subnets within each. A \`/24\` gives 256 addresses of which around 251 are usable, because the cloud reserves roughly five per subnet (network address, gateway, DNS, future use, broadcast).

## Subnets

A **subnet** is a contiguous slice of the VPC\'s CIDR block. On AWS a subnet lives in exactly one availability zone; on Azure a subnet spans the zones of its region. "Public" and "private" are not properties of a subnet — they describe whether the subnet\'s route table sends internet-bound traffic to an internet gateway or not.

A standard three-tier layout across three AZs:

- **Public subnets**, one per AZ, small: they host internet-facing load balancers, NAT gateways, and (if used) bastion hosts. Only things that genuinely need a public IP go here.
- **Private application subnets**, one per AZ, large: your compute — EC2 instances, ECS tasks, EKS worker nodes, VPC-attached Lambda functions. These reach the internet outbound through a NAT gateway but accept no inbound connections from it.
- **Private data subnets**, one per AZ: databases, caches, and internal-only services. These have no route to the internet at all, in either direction — the strongest network isolation you can give a data store.

## Route tables

A **route table** is an ordered evaluation of rules of the form "for destination prefix X, send the packet to target Y". Every subnet is associated with exactly one route table (the VPC\'s main route table by default). When a packet leaves a resource, the route table for its subnet is consulted and the **most specific matching prefix** wins.

- Every route table has an un-removable \`local\` route for the VPC\'s own CIDR, so all in-VPC traffic stays internal.
- A **public** subnet\'s route table adds \`0.0.0.0/0 -> internet gateway\`.
- A **private application** subnet\'s route table adds \`0.0.0.0/0 -> NAT gateway\`.
- A **private data** subnet\'s route table adds nothing beyond \`local\` — no default route means no path to or from the internet.
- More specific routes are added for peered VPCs, transit gateways, VPN connections, and gateway endpoints (Lesson 2).

## Gateways

**Internet gateway** (IGW): a horizontally scaled, free, redundant component that connects the VPC to the internet in both directions. There is one per VPC. A resource is reachable from the internet only if all three of these hold: it is in a subnet whose route table points \`0.0.0.0/0\` at the IGW, it has a public IP address (or an Elastic IP), and its security group and network ACL allow the traffic.

**NAT gateway**: lets resources in private subnets initiate outbound connections to the internet — to download OS updates and packages, pull container images, and call third-party APIs — while ensuring nothing on the internet can initiate a connection inward. It is a managed, availability-zone-scoped resource; for high availability you deploy one per AZ and point each AZ\'s private route table at its local NAT gateway. It is billed per hour and, significantly, **per gigabyte processed** — which, as Module 13 covered, is a line that surprises teams when a large private fleet pulls a lot of data through it.

**Egress-only internet gateway**: the IPv6 equivalent of a NAT gateway. IPv6 has no address translation, so instead this component allows IPv6 outbound and blocks IPv6 inbound.

**VPC endpoints / PrivateLink**: a way to reach AWS services and partner services over the AWS private network without traversing the internet or a NAT gateway. A **gateway endpoint** (available for S3 and DynamoDB, and free) adds a route in your route table so traffic to those services stays on the AWS backbone. An **interface endpoint** (for most other services, and for partner PrivateLink services) puts a network interface with a private IP into your subnet that you address instead of the public service endpoint; it is billed per hour and per gigabyte. Endpoints both improve security (traffic never leaves the private network) and cut cost (no NAT processing charge for that traffic) — covered further in Lesson 2.

## Azure

Azure\'s model maps closely with a few differences. A **VNet** with **subnets** is the equivalent structure, but an Azure subnet spans its region\'s availability zones rather than being pinned to one. Routing uses a **Route Table** resource containing **user-defined routes** that override Azure\'s default system routes. There is no explicit internet gateway object — a resource with a public IP and the default "Internet" system route is internet-connected. A **NAT Gateway** resource is associated with one or more subnets and is zonal. Azure\'s equivalent of gateway endpoints is **Service Endpoints** (a simpler route-based mechanism), and its equivalent of interface endpoints is **Private Endpoint**, which places a private IP for a specific service instance into your subnet.`,

    contentHi: `## VPC

Ek **virtual private cloud** (AWS) ya **virtual network** (Azure, VNet) ek region ke andar aapka apna logically isolated network hai. Jo resources aap launch karte ho wo iske andar jaate hain, aur kuch unhe bahar se reach nahi karta — aur jo wo bhejते hain wo nahi jaata — sivaay un gateways ke jo aap explicitly banate ho.

Ek VPC ek **CIDR block** se defined hai: RFC 1918 se ek private IPv4 range. **Ise ek baar aur carefully plan karo**, kyunki jabki aap baad mein secondary CIDR blocks add kar sakte ho, aap primary ko shrink ya renumber nahi kar sakte bina rebuild kiye.
- Ek range pick karo jo saalon ki growth ke liye kaafi badha ho — \`/16\` ek common default hai.
- Sure karo ye aapke doosre VPCs, on-premises networks, kisi partner network jinse aap kabhi peer karoge, ya aapke Kubernetes clusters ke pod aur service CIDR ranges ke saath **overlap nahi** karta.
- Deliberately sub-divide karo: per availability zone ek \`/20\`, phir har ke andar \`/24\` subnets.

## Subnets

Ek **subnet** VPC ke CIDR block ka ek contiguous slice hai. AWS par ek subnet exactly ek availability zone mein rehta hai; Azure par ek subnet iske region ke zones span karta hai. "Public" aur "private" ek subnet ki properties nahi hain — wo describe karte hain ki subnet ki route table internet-bound traffic ko ek internet gateway ko bhejती hai ya nahi.

Ek standard three-tier layout teen AZs ke across:
- **Public subnets**, per AZ ek, chhota: internet-facing load balancers, NAT gateways, aur bastion hosts.
- **Private application subnets**, per AZ ek, badha: aapki compute. Ye NAT gateway ke through outbound internet reach karte hain par isse koi inbound connections accept nahi karte.
- **Private data subnets**, per AZ ek: databases, caches, aur internal-only services. Inka internet ka koi route bilkul nahi hai.

## Route tables

Ek **route table** "destination prefix X ke liye, packet ko target Y ko bhejo" form ke rules ka ek ordered evaluation hai. Har subnet exactly ek route table se associated hai. Jab ek packet ek resource se leave karta hai, iske subnet ki route table consult ki jaati hai aur **sabse specific matching prefix** jeetta hai.
- Har route table ke paas VPC ke apne CIDR ke liye ek un-removable \`local\` route hai.
- Ek **public** subnet ki route table \`0.0.0.0/0 -> internet gateway\` add karti hai.
- Ek **private application** subnet ki route table \`0.0.0.0/0 -> NAT gateway\` add karti hai.
- Ek **private data** subnet ki route table \`local\` ke aage kuch nahi add karti.

## Gateways

**Internet gateway** (IGW): ek horizontally scaled, free, redundant component jo VPC ko internet se dono directions mein connect karta hai. Per VPC ek. Ek resource internet se reachable hai sirf agar teenon hold karte hain: ye ek subnet mein hai jiski route table \`0.0.0.0/0\` ko IGW par point karti hai, iske paas ek public IP hai, aur iske security group aur network ACL traffic allow karte hain.

**NAT gateway**: private subnets mein resources ko internet ko outbound connections initiate karne deta hai jabki ensure karta hai ki internet par kuch bhi ek connection inward initiate nahi kar sakta. Ye ek managed, availability-zone-scoped resource hai; HA ke liye aap per AZ ek deploy karte ho. Ye per hour aur, significantly, **per gigabyte processed** billed hai.

**Egress-only internet gateway**: ek NAT gateway ka IPv6 equivalent.

**VPC endpoints / PrivateLink**: AWS services aur partner services ko AWS private network par reach karne ka ek tarika bina internet ya ek NAT gateway traverse kiye. Ek **gateway endpoint** (S3 aur DynamoDB ke liye available, aur free) aapki route table mein ek route add karta hai. Ek **interface endpoint** aapke subnet mein ek private IP ke saath ek network interface daalता hai. Endpoints dono security improve karte hain aur cost cut karte hain.

## Azure

Azure ka model kuch differences ke saath closely map karta hai. Ek **VNet** **subnets** ke saath equivalent structure hai, par ek Azure subnet iske region ke availability zones span karta hai ek mein pinned hone ke bajaay. Routing ek **Route Table** resource use karta hai **user-defined routes** ke saath. Koi explicit internet gateway object nahi hai. Ek **NAT Gateway** resource ek ya zyada subnets se associated hai aur zonal hai. Azure ka gateway endpoints ka equivalent **Service Endpoints** hai, aur iska interface endpoints ka equivalent **Private Endpoint** hai.`,

    examples: [
      {
        title: 'A three-tier VPC CIDR plan across three AZs',
        titleHi: 'Teen AZs ke across ek three-tier VPC CIDR plan',
        code: `# VPC:  10.20.0.0/16   (65,536 addresses; chosen NOT to overlap the other VPCs
#                       10.10.0.0/16 and 10.30.0.0/16, nor on-prem 10.0.0.0/16... wait)
#   -> on-prem is 172.16.0.0/12. good. and the EKS pod CIDR will be 100.64.0.0/16.

# carve /20 per AZ (4,096 addresses each), room for 16 AZs of headroom:
#   AZ-a: 10.20.0.0/20     AZ-b: 10.20.16.0/20     AZ-c: 10.20.32.0/20

# inside AZ-a's /20, /24 subnets by tier:
  10.20.0.0/24    public-a       (ALB nodes, NAT gateway a, bastion)      ~251 usable
  10.20.1.0/24    app-a          (ECS/EKS)                                ~251
  10.20.2.0/24    app-a-2        (spare / a second app tier)              ~251
  10.20.3.0/24    data-a         (RDS, ElastiCache)                       ~251
  10.20.4.0/22    (reserved for future growth in AZ-a)

# ...mirrored in AZ-b (10.20.16.x) and AZ-c (10.20.32.x).

# route table associations:
  public-a, public-b, public-c   -> RT-public   (0.0.0.0/0 -> igw)
  app-*                          -> RT-app-<az>  (0.0.0.0/0 -> nat-gw-<az>)   # per-AZ NAT!
  data-*                         -> RT-data      (only 10.20.0.0/16 -> local)

# Azure: one VNet 10.20.0.0/16, subnets snet-public / snet-app / snet-data
#   (each spans the region's zones), a Route Table with a UDR 0.0.0.0/0 -> the
#   NAT Gateway on snet-app, and NO 0.0.0.0/0 route on snet-data.`,
        output: `Key decisions visible here: (1) the /16 was picked to avoid overlap with every
network this VPC might ever connect to - other VPCs, on-prem, and the K8s pod
CIDR. (2) /20 per AZ leaves huge headroom to add subnets later without
renumbering. (3) the data tier's route table has NO default route - the database
literally cannot reach or be reached from the internet. (4) NAT is PER-AZ so
losing one AZ doesn't take out egress for the other two.`,
        explain: 'A concrete address plan for a production VPC. The overall block is a /16 with sixty-five thousand addresses, and the number was chosen specifically so it does not overlap with the other two VPCs in the organisation, the on-premises network, or the address range the Kubernetes clusters will use for pod networking — because any overlap makes routing between those networks impossible later, and you cannot renumber a VPC in place. Within the /16, each availability zone gets a /20 of four thousand addresses, which is far more than the current subnets need but leaves room to add tiers without re-planning. Inside each AZ\'s /20, individual /24 subnets are assigned by tier: a small public subnet for load balancer nodes and the NAT gateway, larger app subnets for compute, and a data subnet for the database and cache. The route table associations encode the tiering: public subnets route the default to the internet gateway, each AZ\'s app subnets route the default to that AZ\'s own NAT gateway so a single AZ failure does not remove egress for the others, and the data subnets have only the local route, meaning the database has no path to or from the internet at all. The Azure version is structurally the same with a single VNet and zone-spanning subnets.',
        explainHi: 'Ek production VPC ke liye ek concrete address plan. Overall block ek /16 hai pachees-sixty-five hazaar addresses ke saath, aur number specifically chuna gaya taaki ye organisation mein doosre do VPCs, on-premises network, ya wo address range jo Kubernetes clusters pod networking ke liye use karega ke saath overlap na kare — kyunki koi bhi overlap un networks ke beech routing ko baad mein impossible banata hai, aur aap ek VPC ko in place renumber nahi kar sakte. /16 ke andar, har availability zone ko chaar hazaar addresses ka ek /20 milta hai. Route table associations tiering encode karti hain: public subnets default ko internet gateway ko route karte hain, har AZ ke app subnets default ko us AZ ke apne NAT gateway ko route karte hain, aur data subnets ke paas sirf local route hai, matlab database ka internet ko ya se koi path bilkul nahi hai.',
      },
      {
        title: 'Why a resource is or is not reachable: the route-table + gateway logic',
        titleHi: 'Ek resource kyun reachable hai ya nahi: route-table + gateway logic',
        code: `# four resources, same VPC, different reachability - trace WHY:

# 1) an ALB in  public-a  (RT: 0.0.0.0/0 -> igw), with a public IP, SG allows :443
#    -> reachable FROM the internet. traffic in via the IGW.

# 2) an EC2 in  app-a  (RT: 0.0.0.0/0 -> nat-a), no public IP, SG allows :8080 from
#    the ALB's SG only
#    -> NOT reachable from the internet (no route in via IGW, no public IP).
#       CAN reach out: 'curl https://api.stripe.com' -> out via the NAT gateway.
#       ALB -> EC2:8080 works because that's intra-VPC (the 'local' route).

# 3) an RDS in  data-a  (RT: only 10.20.0.0/16 -> local), SG allows :5432 from the
#    app SG only
#    -> NOT reachable from the internet. and CANNOT reach out either:
#       'curl https://example.com' from a debug session on the DB host -> TIMEOUT.
#       (this is intentional. a compromised DB can't exfiltrate to the internet.)

# 4) a Lambda function NOT attached to the VPC
#    -> runs in the Lambda-service network. reaches the internet directly (AWS-managed).
#       to reach the RDS in data-a it must be VPC-attached (into app-a subnets) -
#       and THEN it needs a NAT gateway or endpoints for any internet calls it makes.

# the rule, every time:
#   INBOUND from internet  = a route (igw) + a public IP + SG/NACL allow  (ALL THREE)
#   OUTBOUND to internet   = a route (igw for public, nat for private) + SG/NACL allow
#   no default route at all = an island (data tier) - the most secure, least convenient`,
        output: `Reachability is never one flag. INBOUND needs a route via the IGW AND a public IP
AND a security-group/NACL allow - miss any one and it's unreachable. OUTBOUND
needs a route (IGW if public, NAT if private) AND an allow. A subnet with no
default route (the data tier) is an island: nothing in, nothing out, which is
exactly what you want for a database - a compromise there cannot phone home.`,
        explain: 'Four resources in the same VPC have four different connectivity outcomes, and each is explained by the combination of route table, public IP, and security rules. The load balancer in a public subnet is reachable from the internet because its route table has a path in via the internet gateway, it has a public IP, and its security group permits the traffic — all three conditions hold. The EC2 instance in an app subnet is not reachable inbound because it has no public IP and its subnet has no route from the internet gateway, but it can make outbound calls because its route table sends the default route to the NAT gateway. The database in a data subnet is unreachable inbound for the same reasons and also cannot make outbound calls, because its route table contains only the local route — this is deliberate, so that a compromised database cannot exfiltrate data to an external host. The Lambda function, when not attached to the VPC, runs in AWS\'s own network and reaches the internet directly, but to talk to the database it must be attached into the app subnets, at which point its own internet calls need a NAT gateway or endpoints. The consistent rule is that inbound reachability from the internet requires a route, a public IP, and a security allow simultaneously, and a subnet with no default route is a fully isolated island.',
        explainHi: 'Same VPC mein chaar resources ke chaar alag connectivity outcomes hain, aur har ek route table, public IP, aur security rules ke combination se explain hota hai. Public subnet mein load balancer internet se reachable hai kyunki iski route table ke paas internet gateway ke through ek path hai, iske paas ek public IP hai, aur iska security group traffic permit karta hai — teenon conditions hold karti hain. App subnet mein EC2 instance inbound reachable nahi hai kyunki iske paas koi public IP nahi hai aur iske subnet ke paas internet gateway se koi route nahi hai, par ye outbound calls kar sakta hai kyunki iski route table default route ko NAT gateway ko bhejती hai. Data subnet mein database inbound unreachable hai aur outbound calls bhi nahi kar sakta, kyunki iski route table mein sirf local route hai — ye deliberate hai. Consistent rule ye hai ki internet se inbound reachability ke liye ek route, ek public IP, aur ek security allow ek saath chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `# picking the VPC CIDR carelessly (the default 172.31.0.0/16, or a small /24)
# the default VPC is 172.31.0.0/16. a team builds prod in it "to move fast".
# 18 months later:
#   - they need to peer with a partner whose VPC is ALSO 172.31.0.0/16 -> impossible,
#     the ranges overlap, no routing possible
#   - or they picked 10.0.0.0/24 (251 IPs) and the EKS cluster + ALBs + RDS +
#     a few hundred pods have run out of addresses. adding a subnet fails.
#   - renumbering a live VPC = rebuild everything. weeks of work + downtime.`,
        right: `# plan the address space once, deliberately, with room to grow:
#   - a /16 from RFC 1918, NOT the default VPC's range
#   - documented in an IPAM (AWS VPC IP Address Manager / a spreadsheet):
#       10.20.0.0/16  prod-eu       10.21.0.0/16  prod-us
#       10.30.0.0/16  staging       10.40.0.0/16  shared-services
#   - checked against: on-prem ranges, every partner you might peer, the K8s
#     pod/service CIDRs (use the 100.64.0.0/10 carrier-grade NAT space for pods
#     to keep them out of the VPC range entirely)
#   - /20 per AZ, /24 subnets, /22+ reserved per AZ for growth
# do this in the FIRST hour of a new environment. it is nearly unfixable later.`,
        why: 'A VPC\'s primary CIDR block is effectively permanent — you can add secondary blocks but you cannot change or shrink the primary without rebuilding every resource in the VPC. Two carelessly-chosen defaults cause most of the pain. Using the default VPC\'s \`172.31.0.0/16\`, or any commonly-used range, means that the day you need to connect to another network — a partner via VPC peering, your own data centre via VPN, another of your VPCs via a transit gateway — you have a significant chance the ranges overlap, and overlapping ranges cannot be routed between at all. Choosing too small a block, like a \`/24\` with 251 usable addresses, means you run out of address space as the environment grows, particularly once a Kubernetes cluster with hundreds of pods and several load balancers is in the mix, and there is no way to enlarge it. The fix is to treat address planning as a first-hour task for any new environment: pick a \`/16\` from RFC 1918 that is not the default range, record it in an IP address manager alongside every other network you own or might connect to, keep Kubernetes pod networking in a separate range (the \`100.64.0.0/10\` space is designed for this), and leave generous headroom per availability zone. It costs an hour up front and is close to unfixable afterwards.',
        whyHi: 'Ek VPC ka primary CIDR block effectively permanent hai — aap secondary blocks add kar sakte ho par aap primary ko change ya shrink nahi kar sakte bina VPC mein har resource ko rebuild kiye. Do carelessly-chosen defaults zyadaatar pain cause karte hain. Default VPC ka \`172.31.0.0/16\` use karna ka matlab jis din aapko doosre network se connect karna hai — ek partner VPC peering ke through, aapka apna data centre VPN ke through — aapke paas ek significant chance hai ki ranges overlap karti hain, aur overlapping ranges ke beech bilkul route nahi ho sakta. Ek chhota block choose karna, jaise ek \`/24\`, ka matlab aap address space se bahar ho jaate ho jaise environment badhta hai. Fix address planning ko kisi bhi naye environment ke liye ek first-hour task ke roop mein treat karna hai.',
      },
      {
        wrong: `# one NAT gateway for the whole VPC (in a single AZ) to "save money"
# all three private route tables point 0.0.0.0/0 at  nat-gw-a  (in AZ-a).
# saves ~$65/mo vs three NAT gateways.
# the day AZ-a has an issue:
#   - the NAT gateway in AZ-a is down
#   - app instances in AZ-b and AZ-c are FINE, but their outbound internet is
#     routed through the dead NAT in AZ-a -> all package pulls, all external API
#     calls, all OS updates fail. the app is up but broken.
# ALSO: every byte from AZ-b/c to nat-a crosses an AZ boundary = cross-AZ transfer $.`,
        right: `# one NAT gateway PER AZ, each private route table pointing at its local one:
#   RT-app-a: 0.0.0.0/0 -> nat-gw-a   (in public-a)
#   RT-app-b: 0.0.0.0/0 -> nat-gw-b   (in public-b)
#   RT-app-c: 0.0.0.0/0 -> nat-gw-c   (in public-c)
# now: losing AZ-a affects only AZ-a's egress; b and c keep working.
# and: no cross-AZ transfer charge on egress traffic (each AZ's traffic stays local).
# for cost: cut the VOLUME through NAT instead - VPC endpoints for S3/ECR/DynamoDB
# (so image pulls + object access skip NAT entirely), a pull-through image cache.
# a single NAT is acceptable ONLY in dev/non-critical environments.`,
        why: 'A NAT gateway is an availability-zone-scoped resource, and routing every private subnet\'s outbound traffic through one NAT gateway in a single AZ creates a dependency that undermines the whole point of spreading across AZs. If that AZ has a problem, the application instances in the other two AZs are healthy and serving, but every outbound call they make — pulling a container image, fetching a package, calling a payment API, downloading an OS update — is routed to a NAT gateway that is now unreachable, so the application is up but unable to do its job. There is also a continuous cost: traffic from instances in AZ-b and AZ-c to a NAT gateway in AZ-a crosses an availability-zone boundary and is billed as cross-AZ transfer in addition to the NAT processing charge. The correct design is one NAT gateway per availability zone, with each AZ\'s private route table pointing at its own local NAT gateway, so an AZ failure is contained and egress traffic never crosses a zone boundary. If NAT cost is the concern, the answer is to reduce the volume flowing through it — gateway and interface VPC endpoints so that S3, ECR, DynamoDB and similar traffic bypasses NAT entirely, plus an image cache — not to consolidate to a single gateway. A single NAT gateway is acceptable only in development or other environments where an AZ-correlated outage does not matter.',
        whyHi: 'Ek NAT gateway ek availability-zone-scoped resource hai, aur har private subnet ke outbound traffic ko ek single AZ mein ek NAT gateway ke through route karna ek dependency banata hai jo AZs ke across spread karne ka poora point undermine karta hai. Agar us AZ mein ek problem hai, doosre do AZs mein application instances healthy aur serving hain, par har outbound call jo wo karte hain ek NAT gateway ko routed hai jo ab unreachable hai. Ek continuous cost bhi hai: AZ-b aur AZ-c mein instances se AZ-a mein ek NAT gateway ko traffic ek availability-zone boundary cross karta hai. Correct design per availability zone ek NAT gateway hai. Agar NAT cost concern hai, answer isse flow karne wala volume reduce karna hai — gateway aur interface VPC endpoints — ek single gateway par consolidate karna nahi.',
      },
      {
        wrong: `# putting the database in a subnet with a route to the internet "for convenience"
# the RDS instance is in the app subnet (0.0.0.0/0 -> NAT gateway), so a dev can
# 'apt install' the postgres client on a debug box next to it, etc.
# now: if the app server or the DB host is compromised, the attacker's process on
# the DB can open an outbound connection to their server and stream the database
# out through the NAT gateway. the data tier's isolation was the last line of
# defence and it's gone.`,
        right: `# the data tier gets its own subnets with NO internet route, ever:
#   RT-data: 10.20.0.0/16 -> local     (and nothing else)
# consequences you accept and design around:
#   - the DB can't 'apt update' -> use a managed DB (RDS/Aurora - AWS patches it)
#     or bake the AMI with everything, or patch via SSM (which uses VPC endpoints)
#   - a migration job that needs the internet runs in the APP tier and connects
#     IN to the DB, not the other way round
#   - monitoring agents reach CloudWatch via an INTERFACE ENDPOINT, not the internet
# the payoff: a compromise of the DB host has no path to exfiltrate. that's worth
# the inconvenience.`,
        why: 'The strongest network control you can place on a data store is to put it in a subnet with no default route, so it has no path to the internet in either direction. The temptation to give the data subnet a route through the NAT gateway is usually about convenience — installing a client, running a migration that fetches something, letting a monitoring agent reach a SaaS endpoint. But that route is also the path an attacker uses. If the database host is compromised, whether through the application, a vulnerable extension, or a stolen credential, a route to the internet lets the attacker\'s process open an outbound connection and stream the entire database to an external server, and the NAT gateway will faithfully carry it because it only blocks inbound. Removing the default route removes that capability entirely: even a fully compromised database host cannot reach out. The cost is that you design around the isolation — use a managed database so the provider handles patching, run internet-needing jobs in the application tier and have them connect inward to the database, and route agent traffic to cloud services through interface endpoints rather than the internet. For a data store holding anything sensitive, that isolation is the last line of defence and worth the extra design work.',
        whyHi: 'Sabse strong network control jo aap ek data store par place kar sakte ho wo ise ek subnet mein rakhna hai bina ek default route ke, taaki iska internet ko dono directions mein koi path na ho. Data subnet ko NAT gateway ke through ek route dene ka temptation aam taur par convenience ke baare mein hai. Par wo route wo path bhi hai jo ek attacker use karta hai. Agar database host compromised hai, ek internet ka route attacker ke process ko ek outbound connection open karne aur poore database ko ek external server par stream karne deta hai, aur NAT gateway faithfully ise carry karega kyunki ye sirf inbound block karta hai. Default route hatana wo capability poori tarah hataता hai. Cost ye hai ki aap isolation ke aas-paas design karte ho.',
      },
    ],

    realWorld: [
      {
        en: '**The overlapping /16** — a company built prod in a VPC using `10.0.0.0/16`. Two years later an acquisition\'s network was also `10.0.0.0/16`. Merging the two required re-IPing one entire environment — six weeks, a maintenance window, and a frozen release train. Now every VPC CIDR is registered in AWS IPAM before creation.',
        hi: '**Overlapping /16** — ek company ne prod `10.0.0.0/16` use karke ek VPC mein banaya. Do saal baad ek acquisition ka network bhi `10.0.0.0/16` tha. Dono ko merge karne ke liye ek poore environment ko re-IP karna pada — chhah hafte.',
      },
      {
        en: '**Single NAT, AZ outage** — a fintech ran one NAT gateway in `us-east-1a`. During a zone network event, the app instances in 1b and 1c stayed up but could not reach the KMS or Stripe endpoints (routed through the dead NAT), so every transaction failed. Moving to per-AZ NAT plus VPC endpoints for KMS/S3 fixed both the availability and ~$1.1k/mo of NAT + cross-AZ charges.',
        hi: '**Single NAT, AZ outage** — ek fintech ne `us-east-1a` mein ek NAT gateway chalaya. Ek zone network event ke dauraan, 1b aur 1c mein app instances up rahe par KMS ya Stripe endpoints reach nahi kar sake, to har transaction fail hua. Per-AZ NAT plus VPC endpoints par move karna dono fix kiya.',
      },
      {
        en: '**The data tier that could phone home** — a breach investigation found the compromised app had exfiltrated ~2 GB of customer records from the database over 3 hours. The DB subnet had a `0.0.0.0/0 -> NAT` route added months earlier for a one-off migration and never removed. Post-incident: data subnets have `local`-only route tables, enforced by a Config rule.',
        hi: '**Wo data tier jo phone home kar sakta tha** — ek breach investigation ne paya ki compromised app ne 3 ghante mein database se ~2 GB customer records exfiltrate kiye. DB subnet mein mahine pehle ek one-off migration ke liye ek `0.0.0.0/0 -> NAT` route add kiya gaya tha aur kabhi hataya nahi gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you plan a VPC CIDR and subnet layout for a production environment, and why is getting it right up front important?',
        qHi: 'Aap ek production environment ke liye ek VPC CIDR aur subnet layout kaise plan karte ho, aur ise up front sahi karna kyun important hai?',
        a: 'You pick a private range from RFC 1918, typically a /16 with sixty-five thousand addresses so there is room for years of growth, and you choose it specifically so it does not overlap with your other VPCs, your on-premises networks, any partner network you might ever peer or VPN with, or the pod and service CIDR ranges your Kubernetes clusters will use. Then you sub-divide deliberately — a common scheme is a /20 per availability zone, then /24 subnets within each — with generous headroom reserved per AZ. The subnet layout is a three-tier pattern across three AZs: small public subnets for internet-facing load balancers and NAT gateways, larger private app subnets for compute, and private data subnets for databases and caches with no internet route at all. Getting this right up front matters because the primary CIDR block is effectively permanent: you can add secondary blocks but you cannot shrink or renumber the primary without rebuilding every resource in the VPC. An overlapping range makes it impossible to route to another network later, and a range that is too small runs out of addresses once a Kubernetes cluster and several load balancers are in the mix, with no way to enlarge it. It is an hour of planning that is close to unfixable afterwards, so it belongs in the first hour of any new environment, recorded in an IP address manager.',
        aHi: 'Aap RFC 1918 se ek private range pick karte ho, typically ek /16 taaki saalon ki growth ke liye room ho, aur aap ise specifically choose karte ho taaki ye aapke doosre VPCs, on-premises networks, kisi partner network jinse aap kabhi peer karoge, ya aapke Kubernetes clusters ke pod aur service CIDR ranges ke saath overlap na kare. Phir aap deliberately sub-divide karte ho — per availability zone ek /20, phir har ke andar /24 subnets. Subnet layout teen AZs ke across ek three-tier pattern hai: internet-facing load balancers ke liye chhote public subnets, compute ke liye badhे private app subnets, aur databases ke liye private data subnets bina internet route ke. Ise up front sahi karna matter karta hai kyunki primary CIDR block effectively permanent hai. Ek overlapping range baad mein doosre network ko route karna impossible banata hai.',
      },
      {
        q: 'What makes a subnet "public" versus "private", and what three things must be true for a resource to be reachable from the internet?',
        qHi: 'Ek subnet ko "public" versus "private" kya banata hai, aur ek resource ko internet se reachable hone ke liye kaun si teen cheezein sach honi chahiye?',
        a: 'There is no "public" or "private" flag on a subnet — the distinction is entirely about routing. A subnet is public if its associated route table sends the default route, 0.0.0.0/0, to an internet gateway. It is private if the default route goes to a NAT gateway, or if there is no default route at all. A private app subnet routes the default to a NAT gateway so its resources can make outbound connections but accept no inbound ones; a private data subnet has only the local route for the VPC\'s own CIDR, so its resources cannot reach the internet in either direction. For a resource to be reachable from the internet, three things must all be true simultaneously: it must be in a subnet whose route table has a path in via the internet gateway, it must have a public IP address or an Elastic IP, and its security group and network ACL must allow the inbound traffic. Missing any one of the three makes it unreachable. This is why simply giving an instance a public IP does not expose it if its subnet has no internet gateway route, and why an instance in a public subnet with no public IP is still only reachable from inside the VPC.',
        aHi: 'Ek subnet par koi "public" ya "private" flag nahi hai — distinction poori tarah routing ke baare mein hai. Ek subnet public hai agar iski associated route table default route, 0.0.0.0/0, ko ek internet gateway ko bhejती hai. Ye private hai agar default route ek NAT gateway ko jaata hai, ya agar koi default route bilkul nahi hai. Ek resource ko internet se reachable hone ke liye, teen cheezein ek saath sach honi chahiye: ye ek subnet mein hona chahiye jiski route table ke paas internet gateway ke through ek path hai, iske paas ek public IP address hona chahiye, aur iske security group aur network ACL inbound traffic allow karne chahiye. Teenon mein se koi bhi miss karna ise unreachable banata hai.',
      },
      {
        q: 'Compare an internet gateway, a NAT gateway, and a VPC endpoint. When does each apply?',
        qHi: 'Ek internet gateway, ek NAT gateway, aur ek VPC endpoint compare karo. Har ek kab apply hota hai?',
        a: 'An internet gateway connects the VPC to the internet in both directions and is free, with one per VPC; a subnet whose route table points the default route at it, with resources that have public IPs, is a public subnet exposed to inbound and outbound internet traffic. A NAT gateway lets resources in private subnets initiate outbound connections to the internet — for OS updates, package downloads, container image pulls, and third-party API calls — while blocking all inbound connections; it is a managed availability-zone-scoped resource, so you deploy one per AZ for resilience, and it is billed per hour and per gigabyte processed, which makes it a cost line to watch. A VPC endpoint reaches AWS services and partner services over the AWS private network without going through the internet or a NAT gateway: a gateway endpoint, available for S3 and DynamoDB and free, adds a route so that traffic to those services stays on the AWS backbone; an interface endpoint, for most other services, places a network interface with a private IP into your subnet that you address instead of the public endpoint, billed per hour and per gigabyte. You use an internet gateway for anything that must be directly reachable from the internet, a NAT gateway for private-subnet resources that need general outbound internet access, and VPC endpoints to keep traffic to specific cloud services private and off the NAT gateway — which improves security and reduces the NAT processing bill.',
        aHi: 'Ek internet gateway VPC ko internet se dono directions mein connect karta hai aur free hai, per VPC ek ke saath. Ek NAT gateway private subnets mein resources ko internet ko outbound connections initiate karne deta hai jabki saare inbound connections block karta hai; ye ek managed availability-zone-scoped resource hai, to aap resilience ke liye per AZ ek deploy karte ho, aur ye per hour aur per gigabyte processed billed hai. Ek VPC endpoint AWS services aur partner services ko AWS private network par reach karta hai bina internet ya ek NAT gateway ke through jaaye: ek gateway endpoint, S3 aur DynamoDB ke liye available aur free; ek interface endpoint, zyadaatar doosri services ke liye, aapke subnet mein ek private IP ke saath ek network interface daalता hai. Aap ek internet gateway kisi bhi cheez ke liye use karte ho jo internet se directly reachable honi chahiye, ek NAT gateway private-subnet resources ke liye jinhe general outbound internet access chahiye, aur VPC endpoints specific cloud services ko private aur NAT gateway se off rakhne ke liye.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out a CIDR plan for a production VPC across 3 AZs with public/app/data tiers, and list what the primary CIDR must not overlap with.',
        taskHi: 'Ek comment mein, 3 AZs ke across ek production VPC ke liye ek CIDR plan layout karo.',
        hint: 'PICK a private range from RFC 1918 (10.0.0.0/8 / 172.16.0.0/12 / 192.168.0.0/16), typically a /16 (65,536 addresses — years of headroom). NOT the default VPC\'s 172.31.0.0/16. MUST NOT OVERLAP with: (1) your other VPCs (now + planned); (2) on-premises networks you\'ll VPN/Direct-Connect to; (3) any partner network you might ever VPC-peer with; (4) the Kubernetes POD and SERVICE CIDR ranges your clusters use (a separate address space — use the 100.64.0.0/10 carrier-grade-NAT space for pods to keep them entirely out of the VPC range). CARVE: a /20 per AZ (4,096 addresses), leaving 13 more /20s of headroom in a /16; then /24 subnets inside each /20 (256 addresses, ~251 usable — the cloud reserves ~5 per subnet). Example: VPC 10.20.0.0/16; AZ-a 10.20.0.0/20 → 10.20.0.0/24 public-a, 10.20.1.0/24 app-a, 10.20.3.0/24 data-a, 10.20.4.0/22 reserved; AZ-b 10.20.16.0/20 (mirrored); AZ-c 10.20.32.0/20 (mirrored). TIERS (3 AZs each): PUBLIC subnets (small /26-/24) — ALB/NLB nodes, NAT gateways, bastion; only things needing a public IP. PRIVATE APP (large) — EC2/ECS/EKS nodes/VPC-Lambda; outbound via NAT, no inbound from it. PRIVATE DATA — RDS/ElastiCache; NO internet route at all (route table = local only). ROUTE TABLE ASSOCIATIONS: public → RT-public (0.0.0.0/0 → igw); app-<az> → RT-app-<az> (0.0.0.0/0 → nat-gw-<az>, PER-AZ NAT); data → RT-data (only the VPC CIDR → local). Do this in the FIRST HOUR — the primary CIDR is effectively permanent (add secondary blocks yes, shrink/renumber no without a full rebuild).',
        hintHi: 'RFC 1918 se ek private range PICK karo, typically ek /16 (65,536 addresses). NOT default VPC ka 172.31.0.0/16. OVERLAP NAHI honi chahiye: (1) aapke doosre VPCs; (2) on-premises networks jinse aap VPN karoge; (3) koi partner network jinse aap VPC-peer karoge; (4) Kubernetes POD aur SERVICE CIDR ranges (100.64.0.0/10 space use karo). CARVE: per AZ ek /20, phir har /20 ke andar /24 subnets. TIERS (har 3 AZs): PUBLIC (chhota) — ALB/NLB, NAT gateways, bastion; PRIVATE APP (badha) — compute; PRIVATE DATA — RDS/ElastiCache; KOI internet route nahi. ROUTE TABLES: public → 0.0.0.0/0 → igw; app-<az> → 0.0.0.0/0 → nat-gw-<az> (PER-AZ); data → sirf VPC CIDR → local. Ise PEHLE GHANTE mein karo — primary CIDR effectively permanent hai.',
      },
      {
        task: 'In a comment, explain public vs private subnets in terms of route tables, and trace exactly why 4 resources (ALB, app EC2, RDS, unattached Lambda) have the reachability they do.',
        taskHi: 'Ek comment mein, route tables ke terms mein public vs private subnets samjhao.',
        hint: '"Public" / "private" is NOT a subnet flag — it is whether the subnet\'s ROUTE TABLE sends 0.0.0.0/0 to an internet gateway (public), a NAT gateway (private-app), or nowhere (private-data, only the `local` route for the VPC CIDR). Every route table has an un-removable `local` route; most-specific prefix wins. REACHABILITY RULE, every time: INBOUND from the internet needs ALL THREE — (a) a route in via the IGW, (b) a public/Elastic IP on the resource, (c) a security-group + NACL allow. OUTBOUND to the internet needs a route (IGW if public, NAT if private) + an SG/NACL allow. No default route = an ISLAND. TRACE 4 RESOURCES in one VPC: (1) ALB in public-a (RT: 0.0.0.0/0 → igw), public IP, SG allows :443 → REACHABLE from the internet (traffic in via the IGW). (2) app EC2 in app-a (RT: 0.0.0.0/0 → nat-a), NO public IP, SG allows :8080 from the ALB\'s SG only → NOT reachable from the internet (no IGW route in, no public IP); CAN curl `https://api.stripe.com` outbound via the NAT gateway; ALB→EC2:8080 works because that\'s the intra-VPC `local` route. (3) RDS in data-a (RT: only VPC-CIDR → local), SG allows :5432 from the app SG only → NOT reachable from the internet AND cannot reach out (curl from a debug box on the DB host → TIMEOUT) — intentional: a compromised DB cannot exfiltrate. (4) Lambda NOT attached to the VPC → runs in the Lambda-service network, reaches the internet directly (AWS-managed); to reach the RDS it must be VPC-attached into app-a subnets, and THEN its own internet calls need a NAT gateway or interface endpoints.',
        hintHi: '"Public" / "private" ek subnet flag NAHI hai — ye ye hai ki subnet ki ROUTE TABLE 0.0.0.0/0 ko ek internet gateway (public), ek NAT gateway (private-app), ya kahin nahi (private-data, sirf `local` route) bhejती hai. REACHABILITY RULE: INBOUND ke liye TEENON chahiye — (a) IGW ke through ek route, (b) resource par ek public IP, (c) ek SG + NACL allow. OUTBOUND ke liye ek route + ek allow. Koi default route nahi = ek ISLAND. TRACE: (1) ALB public-a mein, public IP, SG :443 → REACHABLE. (2) app EC2 app-a mein, NO public IP → NOT reachable inbound; CAN curl outbound via NAT. (3) RDS data-a mein, sirf `local` route → NOT reachable AUR reach out nahi kar sakta (TIMEOUT) — intentional. (4) Lambda NOT VPC-attached → Lambda-service network mein, internet directly; RDS reach karne ke liye VPC-attach chahiye.',
      },
      {
        task: 'In a comment, explain internet gateway / NAT gateway / egress-only IGW / VPC endpoints, why NAT must be per-AZ, and why the data subnet has no default route.',
        taskHi: 'Ek comment mein, internet gateway / NAT gateway / egress-only IGW / VPC endpoints samjhao.',
        hint: 'INTERNET GATEWAY (IGW): VPC ↔ internet both ways; FREE; one per VPC; horizontally-scaled + redundant. A subnet is "public" iff its RT points 0.0.0.0/0 at the IGW AND the resource has a public IP AND SG/NACL allow. NAT GATEWAY: lets PRIVATE subnets initiate OUTBOUND to the internet (OS updates, package/image pulls, 3rd-party APIs) while blocking ALL inbound; a managed, AZ-SCOPED resource; billed $/hour + $/GB PROCESSED (a Module 13 cost surprise). EGRESS-ONLY IGW: the IPv6 equivalent of NAT — IPv6 has no address translation, so this just allows IPv6 outbound + blocks IPv6 inbound. VPC ENDPOINTS / PrivateLink: reach AWS/partner services over the AWS PRIVATE NETWORK — no internet, no NAT charge. GATEWAY endpoint (S3 + DynamoDB only, FREE) = a route entry keeping that traffic on the AWS backbone. INTERFACE endpoint (most other services + partner PrivateLink) = an ENI with a private IP in your subnet you address instead of the public endpoint; billed $/hour + $/GB (still far cheaper than NAT for that traffic, and private). WHY NAT PER-AZ: a NAT gateway is AZ-scoped. One NAT in AZ-a for all three private route tables → if AZ-a fails, app instances in AZ-b/c are healthy but their outbound internet routes through a DEAD NAT → all package pulls / API calls / updates fail (app is "up but broken"); ALSO every byte from AZ-b/c → nat-a crosses an AZ boundary = cross-AZ transfer $ on top of NAT processing $. Fix: one NAT per AZ, each private RT → its LOCAL NAT. WHY DATA SUBNET HAS NO DEFAULT ROUTE: the RT is `local`-only, so the DB has NO path to the internet in EITHER direction. That route would be the path an attacker uses — a compromised DB host (bad extension, stolen cred, app RCE) with a route out can open an outbound connection and stream the whole database to their server; NAT carries it faithfully (it only blocks inbound). No default route = even a fully compromised DB cannot phone home. You design around it: a managed DB (provider patches it), internet-needing migration jobs run in the APP tier connecting INWARD, agents reach CloudWatch via an interface endpoint.',
        hintHi: 'INTERNET GATEWAY (IGW): VPC ↔ internet both ways; FREE; per VPC ek. NAT GATEWAY: PRIVATE subnets ko OUTBOUND initiate karne deta hai jabki SAARE inbound block karta hai; AZ-SCOPED; billed $/hour + $/GB PROCESSED. EGRESS-ONLY IGW: NAT ka IPv6 equivalent. VPC ENDPOINTS: AWS/partner services ko PRIVATE NETWORK par reach karo — koi internet, koi NAT charge nahi. GATEWAY endpoint (S3 + DynamoDB, FREE); INTERFACE endpoint (baaki services, $/hour + $/GB). NAT PER-AZ KYUN: ek NAT AZ-scoped hai. AZ-a mein ek NAT sab ke liye → AZ-a fail → AZ-b/c healthy par outbound DEAD NAT ke through → sab fail; ALSO cross-AZ transfer $. Fix: per AZ ek NAT. DATA SUBNET MEIN KOI DEFAULT ROUTE KYUN NAHI: RT `local`-only, to DB ka internet ko koi path NAHI. Wo route wo path hai jo ek attacker use karta hai — ek compromised DB host stream out kar sakta hai. No default route = even fully compromised DB phone home nahi kar sakta.',
      },
    ],

    keyTakeaways: [
      'A VPC/VNet is your isolated network in one region, defined by a CIDR block. PLAN THE CIDR ONCE — the primary block is effectively permanent (add secondaries yes, shrink/renumber no without a rebuild). Pick a /16, and make sure it does NOT overlap your other VPCs, on-prem, any peer, or the K8s pod/service CIDRs. Carve /20 per AZ, /24 subnets, headroom reserved.',
      '"Public" vs "private" is NOT a subnet flag — it is whether the ROUTE TABLE sends 0.0.0.0/0 to an internet gateway (public), a NAT gateway (private-app), or nowhere (private-data, `local`-only). Standard 3-tier layout across 3 AZs: small public (LBs, NAT), large private-app (compute), private-data (DB/cache, NO internet route).',
      'INTERNET REACHABILITY needs ALL THREE at once: a route in via the IGW, a public IP on the resource, and a security-group + NACL allow. OUTBOUND needs a route (IGW if public, NAT if private) + an allow. A subnet with no default route is an ISLAND — nothing in, nothing out.',
      'GATEWAYS: IGW (VPC ↔ internet, free, one per VPC). NAT GATEWAY (private subnets → outbound only; managed, AZ-scoped, $/hr + $/GB PROCESSED — deploy ONE PER AZ so an AZ failure doesn\'t kill egress for the others, and to avoid cross-AZ transfer). EGRESS-ONLY IGW = the IPv6 NAT. VPC ENDPOINTS/PrivateLink reach S3/DynamoDB/services over the AWS private network — no internet, no NAT charge (gateway endpoint free for S3/DDB; interface endpoint = an ENI, $/hr+$/GB).',
      'The DATA TIER gets `local`-only route tables (no internet, either direction) as the last line of defence — a compromised DB host with a route out can stream the whole database to an attacker (NAT carries it; it only blocks inbound). Design around it: a managed DB, internet-needing jobs in the app tier connecting inward, agents via interface endpoints. AZURE: VNet + zone-spanning subnets, a Route Table with UDRs, an implicit IGW, a zonal NAT Gateway resource, Service Endpoints (simple) / Private Endpoint (a private IP in your subnet).',
    ],
    keyTakeawaysHi: [
      'Ek VPC/VNet ek region mein aapka isolated network hai, ek CIDR block se defined. CIDR EK BAAR PLAN KARO — primary block effectively permanent hai. Ek /16 pick karo, aur sure karo ye aapke doosre VPCs, on-prem, kisi peer, ya K8s pod/service CIDRs ke saath OVERLAP NAHI karta. Per AZ /20 carve karo, /24 subnets, headroom reserved.',
      '"Public" vs "private" ek subnet flag NAHI hai — ye ye hai ki ROUTE TABLE 0.0.0.0/0 ko ek internet gateway (public), ek NAT gateway (private-app), ya kahin nahi (private-data, `local`-only) bhejती hai. Standard 3-tier layout: chhota public (LBs, NAT), badha private-app (compute), private-data (DB/cache, KOI internet route nahi).',
      'INTERNET REACHABILITY ke liye TEENON ek saath chahiye: IGW ke through ek route, resource par ek public IP, aur ek SG + NACL allow. OUTBOUND ke liye ek route + ek allow. Koi default route nahi = ek ISLAND.',
      'GATEWAYS: IGW (VPC ↔ internet, free, per VPC ek). NAT GATEWAY (private subnets → outbound only; managed, AZ-scoped, $/hr + $/GB PROCESSED — PER AZ EK deploy karo). EGRESS-ONLY IGW = IPv6 NAT. VPC ENDPOINTS S3/DynamoDB/services ko AWS private network par reach karte hain — koi internet, koi NAT charge nahi.',
      'DATA TIER `local`-only route tables paata hai (koi internet, dono directions) last line of defence ke roop mein — ek compromised DB host ek route out ke saath poore database ko ek attacker par stream kar sakta hai. Iske aas-paas design karo: ek managed DB, app tier mein internet-needing jobs INWARD connect karte hue, agents interface endpoints ke through. AZURE: VNet + zone-spanning subnets, ek Route Table UDRs ke saath, ek implicit IGW, ek zonal NAT Gateway, Service Endpoints / Private Endpoint.',
    ],
  },

  {
    slug: 'ops-security-groups-nacls-and-private-connectivity',
    title: 'Security Groups, NACLs & Private Connectivity',
    titleHi: 'Security Groups, NACLs Aur Private Connectivity',
    description:
      'Two layers of packet filtering — stateful security groups attached to resources, and stateless network ACLs attached to subnets — and how to design them for least access. Then the ways to connect a VPC to other networks privately: VPC peering, transit gateways, PrivateLink and endpoints, and the VPN and dedicated-line options for reaching on-premises. AWS as the worked example, Azure NSGs and peering alongside.',
    descriptionHi:
      'Packet filtering ki do layers — resources se attached stateful security groups, aur subnets se attached stateless network ACLs — aur unhe least access ke liye kaise design karein. Phir ek VPC ko doosre networks se privately connect karne ke tarike: VPC peering, transit gateways, PrivateLink aur endpoints, aur on-premises reach karne ke liye VPN aur dedicated-line options. AWS worked example ke roop mein, Azure NSGs aur peering alongside.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Building security: a bouncer at each door, and a gate on each floor.** The bouncer at a room door (a security group) knows you — "this person came in, so they can leave the same way" — and only checks people trying to enter, by a guest list of who is allowed. The floor gate (a network ACL) is a dumb turnstile: it checks every person in both directions against a numbered list of rules and does not remember anyone, so if you want to let a reply back out you must also add a rule for the reply. Most buildings rely on the bouncers and leave the floor gates wide open. And connecting your building to a partner\'s: you can build a private skywalk between two specific buildings (peering), route several buildings through one central hub (a transit gateway), or run a single locked tube to exactly one service in their building and nothing else (PrivateLink).',
      hi: '**Building security: har door par ek bouncer, aur har floor par ek gate.** Ek room door par bouncer (ek security group) aapko jaanta hai — "ye person andar aaya, to ye usi tarah leave kar sakta hai" — aur sirf andar aane ki koshish kar rahe logon ko check karta hai, ek guest list se. Floor gate (ek network ACL) ek dumb turnstile hai: ye har person ko dono directions mein ek numbered list of rules ke against check karta hai aur kisi ko yaad nahi rakhta, to agar aap ek reply wapas bahar jaane dena chahte ho to aapko reply ke liye bhi ek rule add karna hoga. Zyadaatar buildings bouncers par rely karte hain. Aur apni building ko ek partner ki se connect karna: aap do specific buildings ke beech ek private skywalk bana sakte ho (peering), kई buildings ko ek central hub ke through route kar sakte ho (transit gateway), ya exactly ek service ke liye ek single locked tube (PrivateLink).',
    },

    simple: `**SECURITY GROUP (SG)** — attached to a resource (an ENI): EC2, RDS, an ALB, a
Lambda-in-VPC, a VPC endpoint. **STATEFUL**: if you allow inbound on a port, the
reply is automatically allowed out (and vice versa). **Allow-only** - no deny rules.
\`\`\`
- default: DENY all inbound, ALLOW all outbound. you add ALLOW rules.
- a rule source/dest can be a CIDR *or ANOTHER SECURITY GROUP* - the powerful bit:
    app-sg  inbound  :8080  from  alb-sg          (not a CIDR - the ALB's SG)
    db-sg   inbound  :5432  from  app-sg          (only the app tier, whatever its IPs)
- this gives you identity-based rules that don't break when instances change IP.
\`\`\`

**NETWORK ACL (NACL)** — attached to a SUBNET. **STATELESS**: every packet checked
in its direction; a reply needs its OWN rule (usually inbound on the ephemeral
range 1024-65535). **Numbered rules, first match wins, explicit DENY allowed.**
\`\`\`
- default NACL: ALLOW all in + all out. a custom NACL: DENY all until you add rules.
- use for: a coarse subnet-wide guardrail (block a bad CIDR, deny a protocol,
  isolate the data subnet at the subnet edge). NOT your primary control.
- most designs: leave NACLs permissive, do the real work in security groups.
\`\`\`

**SG vs NACL:**  SG = per-resource, stateful, allow-only, can reference SGs — your
main control. NACL = per-subnet, stateless, allow+deny, CIDR-only — a blunt backstop.

**PRIVATE CONNECTIVITY between networks:**
\`\`\`
VPC PEERING       a 1:1 private link between two VPCs (same or cross-account/region).
                  NON-transitive (A-B and B-C does NOT give A-C). CIDRs must not overlap.
                  routes + SG references (same region) needed. good for a few VPCs.
TRANSIT GATEWAY   a hub-and-spoke router. attach many VPCs + VPN + Direct Connect to
                  ONE TGW; route between them centrally. scales to hundreds. $/attachment
                  + $/GB. Azure = "Virtual WAN" / a hub VNet with peering.
PRIVATELINK /     expose ONE service (behind an NLB) to other VPCs/accounts as an
INTERFACE EP      interface endpoint - a private IP in their subnet. one-directional,
                  one-service, no CIDR coordination, no route to the rest of your VPC.
                  the safest way to share a service across an org or with a partner.
\`\`\`

**REACHING ON-PREMISES:**
\`\`\`
SITE-TO-SITE VPN  IPsec tunnels over the internet. quick, cheap, ~1.25 Gbps/tunnel,
                  internet-variable latency. fine for management traffic, DR, small sites.
DIRECT CONNECT /  a dedicated physical circuit from your datacentre/colo to the cloud.
EXPRESSROUTE      consistent latency, high bandwidth (1-100 Gbps), no internet. weeks to
                  provision, $$$. for production data planes + compliance. often VPN as backup.
\`\`\``,

    simpleHi: `**SECURITY GROUP (SG)** — ek resource (ek ENI) se attached: EC2, RDS, ek ALB, ek
Lambda-in-VPC, ek VPC endpoint. **STATEFUL**: agar aap ek port par inbound allow
karte ho, reply automatically bahar allowed hai (aur vice versa). **Allow-only** - koi deny rules nahi.
\`\`\`
- default: saara inbound DENY, saara outbound ALLOW. aap ALLOW rules add karte ho.
- ek rule source/dest ek CIDR *ya ek DOOSRA SECURITY GROUP* ho sakta hai - powerful bit:
    app-sg  inbound  :8080  from  alb-sg          (ek CIDR nahi - ALB ki SG)
    db-sg   inbound  :5432  from  app-sg          (sirf app tier, iske IPs jo bhi hon)
- ye aapko identity-based rules deta hai jo instances IP change karne par nahi tootte.
\`\`\`

**NETWORK ACL (NACL)** — ek SUBNET se attached. **STATELESS**: har packet iski
direction mein checked; ek reply ko iska APNA rule chahiye (usually ephemeral range
1024-65535 par inbound). **Numbered rules, first match jeetta hai, explicit DENY allowed.**
\`\`\`
- default NACL: saara in + saara out ALLOW. ek custom NACL: saara DENY jab tak rules add nahi.
- use for: ek coarse subnet-wide guardrail (ek bad CIDR block karo, ek protocol deny karo).
  aapka primary control NAHI.
- zyadaatar designs: NACLs ko permissive chhodo, real work security groups mein karo.
\`\`\`

**SG vs NACL:**  SG = per-resource, stateful, allow-only, SGs reference kar sakta hai —
aapka main control. NACL = per-subnet, stateless, allow+deny, CIDR-only — ek blunt backstop.

**NETWORKS ke beech PRIVATE CONNECTIVITY:**
\`\`\`
VPC PEERING       do VPCs ke beech ek 1:1 private link. NON-transitive (A-B aur B-C se
                  A-C NAHI milta). CIDRs overlap nahi honi chahiye. few VPCs ke liye achha.
TRANSIT GATEWAY   ek hub-and-spoke router. kई VPCs + VPN + Direct Connect ko EK TGW se
                  attach karo. sainkdon tak scale. $/attachment + $/GB. Azure = "Virtual WAN".
PRIVATELINK /     EK service (ek NLB ke peeche) ko doosre VPCs/accounts ke expose karo ek
INTERFACE EP      interface endpoint ke roop mein - unke subnet mein ek private IP.
                  one-directional, one-service, koi CIDR coordination nahi.
\`\`\`

**ON-PREMISES REACH KARNA:**
\`\`\`
SITE-TO-SITE VPN  internet par IPsec tunnels. quick, cheap, ~1.25 Gbps/tunnel,
                  internet-variable latency. management traffic, DR, small sites ke liye theek.
DIRECT CONNECT /  aapke datacentre se cloud tak ek dedicated physical circuit.
EXPRESSROUTE      consistent latency, high bandwidth, koi internet nahi. provision karne
                  mein hafte, $$$. production data planes + compliance ke liye.
\`\`\``,

    content: `## Security groups

A **security group** is a set of allow rules attached to a resource\'s network interface — an EC2 instance, an RDS database, a load balancer, a VPC-attached Lambda, a VPC endpoint. It is **stateful**: when you add a rule allowing inbound traffic on a port, the return traffic for connections on that port is automatically allowed outbound, and vice versa, so you never write rules for reply packets. It is **allow-only**: there are no deny rules, only allows, and anything not explicitly allowed is denied.

The default security group behaviour is to deny all inbound and allow all outbound; you add inbound allow rules for the ports the resource needs to accept, and optionally tighten the outbound rules.

The feature that makes security groups powerful is that a rule\'s source (for inbound) or destination (for outbound) can be **another security group** rather than a CIDR range. So instead of "allow port 8080 from 10.20.1.0/24", you write "allow port 8080 from the ALB\'s security group", and instead of "allow port 5432 from the app subnets", you write "allow port 5432 from the app tier\'s security group". These rules are identity-based: they keep working correctly no matter how the instances scale, change IP, or move between subnets, because they reference the logical tier, not its addresses. A well-designed VPC has a small set of security groups — one per tier — that reference each other in a chain: internet to the ALB, ALB to the app, app to the database.

## Network ACLs

A **network ACL** is a set of rules attached to a **subnet**, filtering every packet entering or leaving that subnet. It is **stateless**: each packet is evaluated in its own direction against the rules, and the return traffic is not automatically permitted — if you allow an inbound request on port 443, you must separately allow the outbound response, which typically means allowing outbound on the ephemeral port range 1024–65535 that clients use for the source port. It uses **numbered rules evaluated in order, first match wins**, and it **supports explicit deny** rules.

The default network ACL allows all traffic in both directions. A custom network ACL denies everything until you add rules. Network ACLs are a coarse, subnet-wide backstop: block a known-bad CIDR range across an entire subnet, deny a protocol you never use, or add a belt-and-braces isolation on the data subnet at the subnet boundary. They are not the primary access control — the stateless model and the need to hand-manage ephemeral-port rules make them awkward for fine-grained work. Most designs leave network ACLs permissive and do the real access control in security groups.

## SG versus NACL, summarised

Security groups are per-resource, stateful, allow-only, and can reference other security groups — they are the main control and where you express your intended access model. Network ACLs are per-subnet, stateless, support allow and deny, and can only match CIDR ranges — they are a blunt guardrail used sparingly for subnet-wide rules that a security group cannot express.

## Connecting VPCs privately

- **VPC peering** is a one-to-one private connection between two VPCs, which can be in the same or different accounts and regions. Traffic stays on the cloud backbone. Peering is **not transitive**: if A peers with B and B peers with C, A cannot reach C — you would need an A–C peering as well. The VPCs\' CIDR blocks must not overlap, and you add routes on both sides pointing the other VPC\'s CIDR at the peering connection. Peering is the right choice for connecting a small number of VPCs.
- **Transit gateway** is a hub-and-spoke router: you attach many VPCs, VPN connections, and Direct Connect links to a single transit gateway and it routes between them according to route tables you configure on it. It scales to hundreds of attachments and replaces a mesh of peerings that would otherwise grow quadratically. It is billed per attachment per hour plus per gigabyte processed. Azure\'s equivalent is Virtual WAN, or a hub-and-spoke topology built with VNet peering to a central hub VNet.
- **PrivateLink / interface endpoints** expose a **single service** — put it behind a network load balancer and publish it as an endpoint service — to other VPCs and accounts, which consume it as an interface endpoint: a private IP in their own subnet that they connect to. This is one-directional and one-service: the consumer reaches exactly that service and has no route to anything else in your VPC, the CIDRs do not need to be coordinated, and there is no transitive exposure. It is the safest way to share a service across an organisation or with a partner.

## Reaching on-premises

- **Site-to-site VPN** builds IPsec tunnels between your on-premises network equipment and the cloud VPN gateway, over the public internet. It is quick to set up and inexpensive, delivers around 1.25 Gbps per tunnel, and has the latency and jitter characteristics of the internet path between the two points. It suits management traffic, disaster-recovery replication, small branch sites, and as a backup path.
- **Direct Connect** (AWS) / **ExpressRoute** (Azure) is a dedicated physical circuit from your data centre or a colocation facility into the cloud provider\'s network, bypassing the internet entirely. It provides consistent low latency and high, guaranteed bandwidth from 1 to 100 Gbps, at a significant cost and with a provisioning lead time of weeks because physical cross-connects are involved. It is used for production data-plane traffic between on-premises and cloud, for large data transfers, and where compliance requires traffic not to traverse the public internet. A common pattern is a Direct Connect for the primary path with a site-to-site VPN as an automatic backup.`,

    contentHi: `## Security groups

Ek **security group** ek resource ke network interface se attached allow rules ka ek set hai — ek EC2 instance, ek RDS database, ek load balancer, ek VPC-attached Lambda, ek VPC endpoint. Ye **stateful** hai: jab aap ek port par inbound traffic allow karne wala ek rule add karte ho, us port par connections ke liye return traffic automatically outbound allowed hai, aur vice versa. Ye **allow-only** hai: koi deny rules nahi, sirf allows.

Default security group behaviour saara inbound deny aur saara outbound allow karna hai; aap un ports ke liye inbound allow rules add karte ho jinhe resource ko accept karna hai.

Jo feature security groups ko powerful banata hai wo ye hai ki ek rule ka source (inbound ke liye) ya destination (outbound ke liye) ek CIDR range ke bajaay **ek doosra security group** ho sakta hai. To "allow port 8080 from 10.20.1.0/24" ke bajaay, aap likhते ho "allow port 8080 from the ALB\'s security group". Ye rules identity-based hain: wo correctly kaam karte rehte hain chahe instances kaise scale karें, IP change karें, ya subnets ke beech move karें.

## Network ACLs

Ek **network ACL** ek **subnet** se attached rules ka ek set hai, us subnet mein enter ya leave karne wale har packet ko filter karta hai. Ye **stateless** hai: har packet iski apni direction mein rules ke against evaluated hai, aur return traffic automatically permitted nahi hai — agar aap port 443 par ek inbound request allow karte ho, aapko separately outbound response allow karna chahiye. Ye **numbered rules order mein evaluated, first match jeetta hai** use karta hai, aur ye **explicit deny** rules support karta hai.

Default network ACL dono directions mein saara traffic allow karta hai. Network ACLs ek coarse, subnet-wide backstop hain. Wo primary access control nahi hain. Zyadaatar designs network ACLs ko permissive chhodते hain aur real access control security groups mein karते hain.

## SG versus NACL

Security groups per-resource, stateful, allow-only hain, aur doosre security groups reference kar sakte hain — wo main control hain. Network ACLs per-subnet, stateless hain, allow aur deny support karते hain, aur sirf CIDR ranges match kar sakte hain — wo ek blunt guardrail hain.

## VPCs ko privately connect karna

- **VPC peering** do VPCs ke beech ek one-to-one private connection hai. Peering **transitive nahi hai**. VPCs ke CIDR blocks overlap nahi honi chahiye. Peering ek chhoti number of VPCs connect karne ke liye sahi choice hai.
- **Transit gateway** ek hub-and-spoke router hai: aap kई VPCs, VPN connections, aur Direct Connect links ko ek single transit gateway se attach karte ho. Ye sainkdon attachments tak scale karta hai. Azure ka equivalent Virtual WAN hai.
- **PrivateLink / interface endpoints** ek **single service** ko doosre VPCs aur accounts ke expose karते hain. Ye one-directional aur one-service hai. Ye ek organisation ke across ya ek partner ke saath ek service share karne ka sabse safe tarika hai.

## On-premises reach karna

- **Site-to-site VPN** aapke on-premises network equipment aur cloud VPN gateway ke beech IPsec tunnels build karता hai, public internet par. Ye quick aur inexpensive hai. Ye management traffic, disaster-recovery replication, small branch sites ke liye suit karता hai.
- **Direct Connect** (AWS) / **ExpressRoute** (Azure) aapke data centre se cloud provider ke network mein ek dedicated physical circuit hai, internet ko poori tarah bypass karता hai. Ye consistent low latency aur high bandwidth provide karта hai, ek significant cost par. Ek common pattern primary path ke liye ek Direct Connect ek automatic backup ke roop mein ek site-to-site VPN ke saath hai.`,

    examples: [
      {
        title: 'A tiered security-group chain: each tier only accepts from the tier in front of it',
        titleHi: 'Ek tiered security-group chain: har tier sirf apne aage wale tier se accept karta hai',
        code: `# four security groups, referencing each other - NO CIDRs except the very front:

alb-sg:
  inbound   443  from  0.0.0.0/0          # the internet (this is the only public door)
  outbound  all                            # (stateful - replies handled automatically)

app-sg:
  inbound   8080 from  alb-sg              # ONLY the ALB. not a CIDR - the ALB's SG.
  outbound  443  to    0.0.0.0/0           # call external HTTPS APIs (via NAT)
  outbound  5432 to    db-sg               # talk to the database

db-sg:
  inbound   5432 from  app-sg              # ONLY the app tier
  # no outbound rules needed (it never initiates; stateful replies are automatic)

cache-sg:
  inbound   6379 from  app-sg              # ONLY the app tier

# what this buys:
#  - a scan from the internet on :8080 or :5432 -> nothing is listening publicly;
#    app-sg and db-sg have NO rule allowing 0.0.0.0/0
#  - the app fleet autoscales 3 -> 30, instances get new IPs -> the rules DON'T
#    CHANGE, because they reference alb-sg / app-sg, not addresses
#  - a compromised ALB can reach app:8080 and nothing else. a compromised app pod
#    can reach db:5432, cache:6379, and outbound HTTPS - a bounded set.
#  - the database SG has one inbound rule, from one source. that is the whole
#    attack surface of the data tier at the network layer.

# Azure: identical shape with Network Security Groups, using Application Security
#   Groups (ASGs) as the referenceable "tier" identity instead of another NSG.`,
        output: `Security groups referencing security groups give you an access model expressed in
terms of TIERS, not IP addresses - so it survives autoscaling, IP churn, and
subnet moves untouched. Each tier's inbound rule names exactly one source (the
tier in front). The blast radius of compromising any single tier is precisely
what that tier's SG allows it to reach - small and auditable at a glance.`,
        explain: 'Four security groups form a chain that mirrors the request path. The ALB\'s group is the only one with a rule allowing the internet, and only on port 443. The app group allows inbound only on port 8080 and only from the ALB\'s security group — not a CIDR range, the security group itself — so nothing else in the VPC or on the internet can reach the app port. The database group allows inbound only on 5432 and only from the app group. The cache group is the same. Because the rules reference security groups rather than addresses, they are completely unaffected by the app tier autoscaling from three instances to thirty, by instances getting new IP addresses on replacement, or by instances moving between subnets — the rule "from the app tier" continues to mean exactly that. The security properties fall out directly: an internet scan on the app or database ports finds nothing listening publicly because no rule allows 0.0.0.0/0 to those ports; compromising the ALB grants reach to the app port and nothing else; compromising an app instance grants reach to the database, the cache, and outbound HTTPS, which is a small, enumerable set; and the entire network attack surface of the data tier is one inbound rule from one source. The Azure equivalent uses network security groups with application security groups as the referenceable tier identity.',
        explainHi: 'Chaar security groups ek chain banate hain jo request path ko mirror karti hai. ALB ka group ekmatra hai ek rule ke saath jo internet ko allow karता hai, aur sirf port 443 par. App group inbound sirf port 8080 par aur sirf ALB ke security group se allow karता hai — ek CIDR range nahi, security group khud. Database group inbound sirf 5432 par aur sirf app group se allow karता hai. Kyunki rules addresses ke bajaay security groups reference karते hain, wo poori tarah unaffected hain jab app tier teen instances se tees tak autoscale karता hai, jab instances replacement par naye IP addresses paate hain. Security properties directly fall out: app ya database ports par ek internet scan publicly kuch listening nahi paता; ALB compromise karna app port tak reach grant karता hai aur kuch nahi; ek app instance compromise karna database, cache, aur outbound HTTPS tak reach grant karता hai.',
      },
      {
        title: 'Choosing between peering, transit gateway, and PrivateLink for three connectivity needs',
        titleHi: 'Teen connectivity needs ke liye peering, transit gateway, aur PrivateLink ke beech choose karna',
        code: `# NEED 1: prod-app VPC must reach the shared-services VPC (CI, artifact registry,
#         monitoring). two VPCs, stable, bidirectional, moderate traffic.
#   -> VPC PEERING.  add a peering connection, routes on both sides, SG rules.
#      CIDRs already planned non-overlapping (Lesson 1). done. ~$free + data transfer.

# NEED 2: 14 VPCs across 3 environments + 2 on-prem sites (VPN) + a Direct Connect,
#         and it keeps growing. a full mesh would be 14*13/2 = 91 peerings.
#   -> TRANSIT GATEWAY.  one TGW, attach all 14 VPCs + the 2 VPN connections + the
#      DX gateway. TGW route tables control who can reach whom (e.g. dev VPCs can't
#      reach prod). adding VPC #15 = one attachment, not 14 new peerings.
#      cost: ~$0.05/attachment/hr (~$36/mo each) + $0.02/GB. Azure: Virtual WAN.

# NEED 3: expose ONE internal API (the "entitlements service") to 40 other teams'
#         VPCs, and to 2 external partners. must NOT give them a route to anything
#         else in our VPC. no CIDR coordination with 40 teams.
#   -> PRIVATELINK.  put the entitlements service behind an NLB, create an endpoint
#      service. each consumer creates an interface endpoint -> a private IP in
#      THEIR subnet. they reach ONLY that service. no peering, no routes, no shared
#      CIDR space, no transitive access. revoke a partner = remove their endpoint
#      permission. Azure: a Private Link Service + Private Endpoints.

# the decision:
#   few VPCs, mutual, full access      -> PEERING
#   many networks, central routing     -> TRANSIT GATEWAY
#   share ONE service, minimal exposure -> PRIVATELINK`,
        output: `Three different shapes, three different tools. Peering is a direct 1:1 link -
simple, cheap, right for a handful of VPCs. A transit gateway is a router - it
replaces an O(n^2) mesh of peerings with O(n) attachments and gives you central
control of who reaches whom. PrivateLink is a one-way pinhole to a single service
- it is the only option that shares a service WITHOUT granting network reach to
the rest of the VPC, which is what you want for cross-org and partner sharing.`,
        explain: 'Three connectivity requirements, each best served by a different mechanism. The first is two stable VPCs that need full bidirectional reach — a production application VPC and a shared-services VPC — which is exactly what VPC peering is for: a direct one-to-one link, routes on both sides, security group rules to control the actual access, and essentially no cost beyond data transfer. The second is a growing estate of fourteen VPCs plus two on-premises sites over VPN plus a Direct Connect, where building peerings between every pair would mean ninety-one connections and adding one more VPC would mean fourteen new ones. A transit gateway replaces that with a single hub: every VPC, VPN, and Direct Connect attaches once, route tables on the transit gateway control which attachments can reach which others (so development VPCs can be prevented from reaching production), and growth is linear. The third is exposing a single internal API to forty other teams and two external partners without giving any of them a route to the rest of the VPC and without coordinating CIDR ranges with forty teams. PrivateLink is the only fit: the service goes behind a network load balancer and is published as an endpoint service, each consumer creates an interface endpoint that is just a private IP in their own subnet, and they can reach that one service and nothing else, with no peering, no routes, and no shared address space.',
        explainHi: 'Teen connectivity requirements, har ek ek alag mechanism dwara best served. Pehla do stable VPCs hain jinhe full bidirectional reach chahiye — ek production application VPC aur ek shared-services VPC — jo exactly wo hai jiske liye VPC peering hai. Doosra chaudah VPCs plus VPN par do on-premises sites plus ek Direct Connect ka ek growing estate hai, jahaan har pair ke beech peerings build karna ninety-one connections ka matlab hoga. Ek transit gateway ise ek single hub se replace karta hai. Teesra ek single internal API ko chalees doosri teams aur do external partners ko expose karna hai bina unme se kisi ko VPC ke baaki tak ek route diye. PrivateLink ekmatra fit hai: service ek network load balancer ke peeche jaता hai, har consumer ek interface endpoint banाता hai jo bas unke apne subnet mein ek private IP hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# using CIDR ranges in security groups instead of security-group references
db-sg:
  inbound  5432  from  10.20.1.0/24        # "the app subnet"
  inbound  5432  from  10.20.17.0/24       # app subnet in AZ-b
  inbound  5432  from  10.20.33.0/24       # app subnet in AZ-c
  inbound  5432  from  10.20.2.0/24        # oh, and the second app subnet
  inbound  5432  from  10.20.5.0/24        # the migration-job subnet someone added
# now: a NEW app subnet -> the DB rule silently doesn't cover it -> "connection
# refused" in prod, debugged for an hour. and any workload that lands in one of
# those /24s (a random batch job) can hit the DB.`,
        right: `# reference the security group - it IS the tier's identity, IP-independent:
db-sg:
  inbound  5432  from  app-sg              # whatever instances, whatever subnets, whatever IPs
# the app tier's SG membership is the source of truth. autoscale, add an AZ, move
# a subnet -> nothing to update. and ONLY things explicitly in app-sg can connect -
# a batch job in the same subnet but not in app-sg cannot reach the DB.
# use CIDRs in an SG only for genuinely external sources: the internet on the ALB,
# a partner's fixed IP range, an on-prem range over VPN.`,
        why: 'Writing security-group rules against CIDR ranges reintroduces exactly the fragility that security-group references exist to eliminate. A rule that says "allow the database port from 10.20.1.0/24" is really trying to say "allow it from the application tier", but it expresses that as a set of subnet ranges that has to be kept manually in sync with reality. Every time a subnet is added, split, or moved, the rule silently stops covering part of the tier, producing connection failures that look like application bugs, and conversely any workload that happens to be placed in one of those ranges — a batch job, a debugging instance, a different service — gets database access it was never meant to have, because the rule grants by location rather than by identity. Referencing the application tier\'s security group instead makes the rule mean what it is supposed to mean: the source is defined by security-group membership, which is the actual identity of the tier, so autoscaling, adding an availability zone, and moving subnets require no rule changes, and only workloads explicitly placed in that security group can connect. CIDR ranges belong in security-group rules only for sources that are genuinely external and have fixed addresses: the internet on a public load balancer, a partner\'s published IP range, an on-premises network reached over VPN.',
        whyHi: 'CIDR ranges ke against security-group rules likhna exactly wo fragility reintroduce karta hai jise eliminate karne ke liye security-group references exist karte hain. Ek rule jo kehta hai "database port from 10.20.1.0/24 allow karo" actually kehne ki koshish kar raha hai "ise application tier se allow karo", par ye ise subnet ranges ke ek set ke roop mein express karta hai jise manually reality ke saath sync mein rakha jaana hai. Har baar ek subnet add, split, ya move hota hai, rule silently tier ke part ko cover karna band kar deta hai. Application tier ke security group ko reference karna ise wo matlab deta hai jo iska matlab hona chahiye: source security-group membership se defined hai. CIDR ranges security-group rules mein sirf genuinely external sources ke liye belong karti hain.',
      },
      {
        wrong: `# relying on network ACLs as the primary access control
# a team locks down everything with NACLs: numbered rules on every subnet, deny
# rules, allow rules for specific ports and ephemeral ranges.
# 3 weeks later:
#   - a service on a non-standard port doesn't work; someone forgot the ephemeral
#     RETURN-traffic rule (1024-65535 inbound) because NACLs are stateless
#   - rule 100 (allow) and rule 110 (deny) conflict; first-match-wins means the
#     order matters and nobody documented why rule 105 exists
#   - a legitimate change requires editing 6 subnets' NACLs in lockstep`,
        right: `# security groups first, NACLs as a thin backstop:
#   - do ALL fine-grained access control in SECURITY GROUPS (stateful, per-resource,
#     SG-referencing) - this is 95% of your rules
#   - leave NACLs at the default "allow all" on most subnets
#   - use a NACL only for a coarse, stable, subnet-wide rule that an SG can't do:
#       * deny an abusive CIDR at the subnet edge (fast, cheap, wide)
#       * belt-and-braces: on the data subnet, deny 0.0.0.0/0 outbound as a second
#         layer behind the route-table isolation
#   - keep NACL rules few, numbered with gaps (100, 200, 300), and commented`,
        why: 'Network ACLs are stateless, subnet-scoped, and evaluated by numbered first-match-wins ordering, and every one of those properties makes them a poor primary access control. Stateless means that for every rule allowing a request in, you must add a matching rule allowing the response out on the ephemeral port range, and forgetting the return rule produces failures that are hard to diagnose because the request clearly arrived. Subnet-scoped means a change to the intended access between two tiers requires editing the ACLs of every subnet involved, in lockstep, rather than one rule. First-match-wins numbered ordering means the interaction between an allow at rule 100 and a deny at rule 110 depends on their numbers, and without disciplined documentation nobody can safely reason about why a given rule is where it is. Security groups avoid all of this: they are stateful so you never write return rules, per-resource so a change is localised, and allow-only with security-group references so the model is expressed in terms of tiers. The right division is to do essentially all access control in security groups and use network ACLs only for a small number of coarse, stable, subnet-wide rules that a security group genuinely cannot express — blocking an abusive CIDR at the subnet edge, or adding a second layer of outbound denial on the data subnet behind the route-table isolation.',
        whyHi: 'Network ACLs stateless, subnet-scoped hain, aur numbered first-match-wins ordering se evaluated hain, aur un properties mein se har ek unhe ek poor primary access control banati hai. Stateless ka matlab har rule jo ek request ko andar allow karta hai ke liye, aapko ephemeral port range par response ko bahar allow karne wala ek matching rule add karna chahiye, aur return rule bhoolna failures produce karta hai jo diagnose karna hard hai. Subnet-scoped ka matlab do tiers ke beech intended access ka ek change har involved subnet ke ACLs ko edit karne ki require karta hai. Security groups ye sab avoid karte hain. Right division essentially saara access control security groups mein karna aur network ACLs sirf ek chhoti number of coarse, stable, subnet-wide rules ke liye use karna hai.',
      },
      {
        wrong: `# building a full mesh of VPC peerings as the network grows
# 3 VPCs -> 3 peerings. fine.
# 6 VPCs -> 15 peerings.
# 12 VPCs -> 66 peerings, each needing routes on both sides + SG updates.
# adding VPC #13 -> 12 new peerings to create, 24 route-table edits.
# and peering is non-transitive, so a hub VPC can't route between spokes -> you
# genuinely need every pair. the routing config becomes unmaintainable.`,
        right: `# past ~4-5 VPCs, move to a hub: a transit gateway (or Azure Virtual WAN):
#   - attach every VPC, VPN, and Direct Connect to ONE transit gateway
#   - TGW route tables decide reachability centrally (dev spokes isolated from prod,
#     shared-services reachable from all, etc.)
#   - adding VPC #13 = ONE attachment + one route table association
#   - it IS transitive through the TGW (that's the point)
#   cost: ~$36/mo per attachment + $0.02/GB processed - worth it past a handful of VPCs
# keep direct peering only for a hot path where the TGW's per-GB charge or the
# extra hop actually matters.`,
        why: 'VPC peering is a direct one-to-one link and it is non-transitive, so a network of N VPCs that all need to reach each other requires a peering for every pair, which is N times N-minus-one over two connections — three for three VPCs, fifteen for six, sixty-six for twelve — and each peering needs routes configured on both sides and security group rules updated. Adding one more VPC to a mesh of twelve means creating twelve new peerings and editing twenty-four route tables, and because peering is non-transitive you cannot simplify by routing spokes through a hub VPC. The configuration becomes genuinely unmaintainable and error-prone past a handful of VPCs. A transit gateway replaces the mesh with a hub: every VPC, VPN connection, and Direct Connect link attaches once, the transit gateway routes between attachments transitively according to route tables you configure centrally, and those route tables let you express policy like "development VPCs cannot reach production" in one place. Adding a VPC is a single attachment. The cost is a per-attachment hourly charge plus per-gigabyte processing, which is easily justified once you are past four or five VPCs, and direct peering is kept only for a specific hot path where the transit gateway\'s per-gigabyte charge or the additional hop is measurably significant.',
        whyHi: 'VPC peering ek direct one-to-one link hai aur ye non-transitive hai, to N VPCs ka ek network jinhe sabko ek doosre ko reach karna hai har pair ke liye ek peering require karta hai — teen VPCs ke liye teen, chhah ke liye pandrah, baarah ke liye chhiyasath — aur har peering ko dono sides par routes configured chahiye. Ek transit gateway mesh ko ek hub se replace karta hai: har VPC, VPN connection, aur Direct Connect link ek baar attach hota hai, transit gateway attachments ke beech transitively route karta hai. Ek VPC add karna ek single attachment hai. Cost ek per-attachment hourly charge plus per-gigabyte processing hai, jo aasani se justify hai ek baar aap chaar ya paanch VPCs se aage ho.',
      },
    ],

    realWorld: [
      {
        en: '**CIDR rules and a silent gap** — a team\'s DB security group listed the three app subnets by CIDR. A capacity project added a fourth app subnet; deploys to instances there got "connection refused" from the DB and it was blamed on the app for two hours. Switched every internal rule to SG-references; the class of bug ended.',
        hi: '**CIDR rules aur ek silent gap** — ek team ke DB security group ne teen app subnets ko CIDR se list kiya. Ek capacity project ne ek chautha app subnet add kiya; wahaan instances ko deploys ko DB se "connection refused" mila. Har internal rule ko SG-references par switch kiya.',
      },
      {
        en: '**91-peering mesh** — a platform team had grown to 14 VPCs on direct peering. A quarterly audit found 6 peerings with asymmetric routes (worked one way only) and 2 that were unused but still billed. Migrating to a transit gateway took a week and made "which VPCs can reach prod" a single readable route table.',
        hi: '**91-peering mesh** — ek platform team 14 VPCs tak direct peering par badh gayi thi. Ek quarterly audit ne 6 peerings asymmetric routes ke saath paye. Ek transit gateway par migrate karna ek hafta laga.',
      },
      {
        en: '**PrivateLink for a partner** — a company needed to give a data partner access to one internal lookup API. The first design was a cross-account VPC peering, which would have given the partner a route into the whole VPC. Security rejected it. PrivateLink exposed exactly the one service; revoking access later was deleting one endpoint permission.',
        hi: '**Ek partner ke liye PrivateLink** — ek company ko ek data partner ko ek internal lookup API tak access dena tha. Pehla design ek cross-account VPC peering tha, jo partner ko poore VPC mein ek route deta. Security ne ise reject kiya. PrivateLink ne exactly ek service expose kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a security group and a network ACL, and how should you use each?',
        qHi: 'Ek security group aur ek network ACL mein kya difference hai, aur aap har ek ko kaise use karna chahiye?',
        a: 'A security group is a set of allow rules attached to a resource\'s network interface — an instance, a database, a load balancer, a VPC endpoint. It is stateful, so when you allow inbound traffic on a port the return traffic is automatically allowed out and you never write rules for replies. It is allow-only, with no deny rules. Its defining feature is that a rule\'s source or destination can be another security group rather than a CIDR range, which lets you express access in terms of tiers — "allow the database port from the app tier\'s security group" — that keep working through autoscaling and IP changes. A network ACL is a set of numbered rules attached to a subnet, filtering every packet in and out of it. It is stateless, so you must add a matching rule for return traffic on the ephemeral port range, and forgetting it causes hard-to-diagnose failures. It is evaluated first-match-wins by rule number and it supports explicit deny. The right division is to do essentially all access control in security groups, because stateful per-resource SG-referencing rules are precise and survive change, and to leave network ACLs permissive except for a small number of coarse, stable, subnet-wide rules a security group cannot express — blocking an abusive CIDR at the subnet edge, or a second layer of outbound denial on the data subnet.',
        aHi: 'Ek security group ek resource ke network interface se attached allow rules ka ek set hai. Ye stateful hai, to jab aap ek port par inbound traffic allow karte ho return traffic automatically bahar allowed hai. Ye allow-only hai. Iska defining feature ye hai ki ek rule ka source ya destination ek CIDR range ke bajaay ek doosra security group ho sakta hai. Ek network ACL ek subnet se attached numbered rules ka ek set hai. Ye stateless hai, to aapko ephemeral port range par return traffic ke liye ek matching rule add karna chahiye. Ye first-match-wins rule number se evaluated hai aur ye explicit deny support karta hai. Right division essentially saara access control security groups mein karna hai, aur network ACLs ko permissive chhodna sivaay ek chhoti number of coarse, stable, subnet-wide rules ke.',
      },
      {
        q: 'When do you use VPC peering, a transit gateway, and PrivateLink?',
        qHi: 'Aap VPC peering, ek transit gateway, aur PrivateLink kab use karte ho?',
        a: 'VPC peering is a direct one-to-one private link between two VPCs, in the same or different accounts and regions. It is non-transitive, the CIDRs must not overlap, and you add routes on both sides. It is the right choice for connecting a small number of VPCs that need full bidirectional access — up to about four or five before the mesh becomes unmanageable, because N VPCs all reaching each other need N-times-N-minus-one-over-two peerings. A transit gateway is a hub-and-spoke router: you attach many VPCs, VPN connections, and Direct Connect links to one transit gateway, and its route tables control which attachments can reach which others, transitively. It replaces an O(n squared) mesh of peerings with O(n) attachments, lets you express policy like "dev cannot reach prod" centrally, and makes adding a VPC a single attachment. It is billed per attachment per hour plus per gigabyte. PrivateLink exposes a single service — placed behind a network load balancer and published as an endpoint service — to other VPCs and accounts, which consume it as an interface endpoint, a private IP in their own subnet. It is one-directional and one-service: the consumer reaches exactly that service with no route to anything else in your VPC, no CIDR coordination, and no transitive exposure. It is the right choice for sharing one service across an organisation or with an external partner where you must not grant network reach to the rest of the VPC.',
        aHi: 'VPC peering do VPCs ke beech ek direct one-to-one private link hai. Ye non-transitive hai, CIDRs overlap nahi honi chahiye. Ye ek chhoti number of VPCs connect karne ke liye sahi choice hai jinhe full bidirectional access chahiye. Ek transit gateway ek hub-and-spoke router hai: aap kई VPCs, VPN connections, aur Direct Connect links ko ek transit gateway se attach karte ho, aur iske route tables control karte hain kaun se attachments kaun se doosre ko reach kar sakte hain, transitively. Ye ek O(n squared) mesh ko O(n) attachments se replace karta hai. PrivateLink ek single service ko doosre VPCs aur accounts ke expose karta hai, jo ise ek interface endpoint ke roop mein consume karte hain. Ye one-directional aur one-service hai. Ye ek organisation ke across ya ek external partner ke saath ek service share karne ke liye sahi choice hai jahaan aapko VPC ke baaki tak network reach grant nahi karna chahiye.',
      },
      {
        q: 'How do you connect a VPC to an on-premises data centre, and what are the trade-offs?',
        qHi: 'Aap ek VPC ko ek on-premises data centre se kaise connect karte ho, aur trade-offs kya hain?',
        a: 'There are two options. A site-to-site VPN builds IPsec tunnels between your on-premises network equipment and the cloud VPN gateway over the public internet. It is quick to set up, inexpensive, delivers around 1.25 gigabits per second per tunnel, and inherits the latency and jitter of the internet path between the two endpoints. It suits management traffic, disaster-recovery replication, small branch sites, and use as a backup path. Direct Connect on AWS, or ExpressRoute on Azure, is a dedicated physical circuit from your data centre or a colocation facility into the cloud provider\'s network, bypassing the internet entirely. It provides consistent low latency and guaranteed bandwidth from one to a hundred gigabits per second, but at significant cost and with a lead time of weeks because a physical cross-connect has to be provisioned. It is used for production data-plane traffic between on-premises and cloud, for large recurring data transfers, and where compliance requires that traffic not traverse the public internet. The common production pattern is a Direct Connect for the primary path with a site-to-site VPN configured as an automatic failover, giving you the performance and consistency of the dedicated circuit with the resilience of a second, independent path.',
        aHi: 'Do options hain. Ek site-to-site VPN aapke on-premises network equipment aur cloud VPN gateway ke beech IPsec tunnels build karta hai, public internet par. Ye quick, inexpensive hai, per tunnel lagbhag 1.25 gigabits per second deta hai, aur do endpoints ke beech internet path ki latency aur jitter inherit karta hai. Ye management traffic, disaster-recovery replication, small branch sites ke liye suit karta hai. AWS par Direct Connect, ya Azure par ExpressRoute, aapke data centre se cloud provider ke network mein ek dedicated physical circuit hai, internet ko poori tarah bypass karta hai. Ye consistent low latency aur guaranteed bandwidth provide karta hai, par significant cost par aur hafton ke lead time ke saath. Common production pattern primary path ke liye ek Direct Connect ek automatic failover ke roop mein configured ek site-to-site VPN ke saath hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast security groups and network ACLs on all their properties, and describe a tiered SG chain for internet → ALB → app → DB → cache.',
        taskHi: 'Ek comment mein, security groups aur network ACLs ka contrast karo.',
        hint: 'SECURITY GROUP: attached to a RESOURCE (an ENI — EC2/RDS/ALB/VPC-Lambda/VPC endpoint). STATEFUL — allow inbound on a port → the reply is automatically allowed out (never write return rules). ALLOW-ONLY — no deny rules; default = deny all inbound, allow all outbound. KEY FEATURE: a rule\'s source/dest can be ANOTHER SECURITY GROUP, not just a CIDR → identity-based rules that survive autoscaling, IP churn, subnet moves. NETWORK ACL: attached to a SUBNET. STATELESS — every packet checked in its own direction; a reply needs its OWN rule (usually inbound on the ephemeral range 1024-65535). NUMBERED rules, FIRST-MATCH-WINS, explicit DENY allowed. Default NACL = allow all both ways; a custom NACL = deny all until you add rules. USAGE: do ~95% of access control in SECURITY GROUPS (precise, per-resource, SG-referencing); leave NACLs permissive except a few COARSE subnet-wide rules an SG can\'t express (block an abusive CIDR at the subnet edge; a belt-and-braces deny-0.0.0.0/0-outbound on the data subnet behind the route-table isolation). TIERED SG CHAIN (no CIDRs except the very front): `alb-sg` inbound 443 from 0.0.0.0/0 (the only public door); `app-sg` inbound 8080 from `alb-sg` only + outbound 443 to 0.0.0.0/0 (external APIs via NAT) + outbound 5432 to `db-sg`; `db-sg` inbound 5432 from `app-sg` only (no outbound rules — it never initiates); `cache-sg` inbound 6379 from `app-sg` only. Blast radius of compromising a tier = exactly what its SG allows it to reach — small + auditable at a glance. Azure: identical with Network Security Groups + Application Security Groups (ASGs) as the referenceable tier identity.',
        hintHi: 'SECURITY GROUP: ek RESOURCE se attached. STATEFUL — port par inbound allow → reply automatically bahar allowed. ALLOW-ONLY — koi deny rules nahi; default = saara inbound deny, saara outbound allow. KEY FEATURE: ek rule ka source/dest ek DOOSRA SECURITY GROUP ho sakta hai → identity-based rules jo autoscaling/IP churn survive karte hain. NETWORK ACL: ek SUBNET se attached. STATELESS — har packet iski direction mein checked; reply ko APNA rule chahiye (ephemeral 1024-65535). NUMBERED rules, FIRST-MATCH-WINS, explicit DENY allowed. USAGE: ~95% access control SECURITY GROUPS mein; NACLs permissive chhodo sivaay kuch COARSE subnet-wide rules. TIERED SG CHAIN: `alb-sg` inbound 443 from 0.0.0.0/0; `app-sg` inbound 8080 from `alb-sg` only; `db-sg` inbound 5432 from `app-sg` only; `cache-sg` inbound 6379 from `app-sg` only. Azure: NSGs + ASGs.',
      },
      {
        task: 'In a comment, explain VPC peering, transit gateway, and PrivateLink — their topology, transitivity, scaling, and the exact case each fits.',
        taskHi: 'Ek comment mein, VPC peering, transit gateway, aur PrivateLink samjhao.',
        hint: 'VPC PEERING: a direct 1:1 private link between two VPCs (same or cross-account/region); traffic stays on the cloud backbone. NON-TRANSITIVE (A↔B and B↔C does NOT give A↔C — you need an explicit A↔C peering). CIDRs must NOT overlap. You add routes on BOTH sides + SG rules. SCALING: N VPCs all reaching each other = N(N-1)/2 peerings (3→3, 6→15, 12→66); adding VPC #13 to a mesh of 12 = 12 new peerings + 24 route-table edits → unmanageable past ~4-5 VPCs. FITS: a small number of stable VPCs needing full bidirectional access. ~free + data transfer. TRANSIT GATEWAY (Azure: Virtual WAN / a hub VNet): a hub-and-spoke ROUTER — attach many VPCs + VPN connections + Direct Connect to ONE TGW; its route tables control which attachments reach which others, TRANSITIVELY. Replaces an O(n²) peering mesh with O(n) attachments; lets you express policy centrally ("dev spokes isolated from prod", "shared-services reachable from all"); adding a VPC = ONE attachment. Cost: ~$36/mo per attachment + ~$0.02/GB processed. FITS: many networks (5+), central routing + policy. PRIVATELINK / interface endpoints (Azure: Private Link Service + Private Endpoints): expose ONE service (behind an NLB, published as an endpoint service) to other VPCs/accounts, consumed as an INTERFACE ENDPOINT = a private IP in the CONSUMER\'s subnet. ONE-DIRECTIONAL, ONE-SERVICE: the consumer reaches EXACTLY that service, NO route to anything else in your VPC, NO CIDR coordination, NO transitive exposure. Revoke access = remove one endpoint permission. FITS: sharing ONE service across an org or with an external partner where you must NOT grant network reach to the rest of the VPC — the safest sharing mechanism.',
        hintHi: 'VPC PEERING: do VPCs ke beech ek direct 1:1 private link. NON-TRANSITIVE. CIDRs OVERLAP NAHI honi chahiye. Dono sides par routes. SCALING: N VPCs = N(N-1)/2 peerings (3→3, 6→15, 12→66) → ~4-5 VPCs ke aage unmanageable. FITS: kuch stable VPCs full bidirectional access ke saath. TRANSIT GATEWAY (Azure: Virtual WAN): ek hub-and-spoke ROUTER — kई VPCs + VPN + Direct Connect ko EK TGW se attach; route tables TRANSITIVELY control karti hain; O(n²) mesh ko O(n) attachments se replace; policy centrally ("dev isolated from prod"); ek VPC add = ONE attachment. Cost: ~$36/mo per attachment + ~$0.02/GB. FITS: kई networks (5+). PRIVATELINK: EK service (NLB ke peeche) ko doosre VPCs/accounts ke expose karo, INTERFACE ENDPOINT ke roop mein consumed = CONSUMER ke subnet mein ek private IP. ONE-DIRECTIONAL, ONE-SERVICE: NO route to anything else, NO CIDR coordination. FITS: ORG/partner ke saath EK service share karna.',
      },
      {
        task: 'In a comment, compare site-to-site VPN and Direct Connect / ExpressRoute on setup time, bandwidth, latency consistency, cost, internet exposure, and typical use — and give the common production pattern.',
        taskHi: 'Ek comment mein, site-to-site VPN aur Direct Connect / ExpressRoute compare karo.',
        hint: 'SITE-TO-SITE VPN: IPsec tunnels between your on-prem network equipment and the cloud VPN gateway, OVER THE PUBLIC INTERNET. Setup: QUICK (hours-days, all software config). Bandwidth: ~1.25 Gbps PER TUNNEL (add tunnels/ECMP for more). Latency: INTERNET-VARIABLE (jitter, path changes, congestion). Cost: CHEAP ($/hr for the gateway + data transfer). Internet exposure: encrypted but traverses the public internet. TYPICAL USE: management traffic, DR replication, small branch sites, a BACKUP path, quick PoCs. DIRECT CONNECT (AWS) / EXPRESSROUTE (Azure): a DEDICATED PHYSICAL CIRCUIT from your data centre / a colo facility into the cloud provider\'s network — BYPASSES THE INTERNET ENTIRELY. Setup: WEEKS (a physical cross-connect must be provisioned; involves a partner/colo). Bandwidth: HIGH + GUARANTEED, 1-100 Gbps. Latency: CONSISTENT + LOW (a dedicated path, no internet variability). Cost: $$$ (port hours + data transfer, often a partner fee). Internet exposure: NONE — traffic never touches the public internet (a compliance requirement for some sectors). TYPICAL USE: production data-plane traffic between on-prem and cloud, large recurring data transfers, latency-sensitive hybrid apps, compliance-driven "no public internet" mandates. THE COMMON PRODUCTION PATTERN: a Direct Connect / ExpressRoute for the PRIMARY path + a site-to-site VPN configured as an AUTOMATIC FAILOVER — you get the performance + consistency + no-internet of the dedicated circuit, plus the resilience of a second, independent path if the circuit or the facility fails. Both can terminate on a Transit Gateway / Virtual WAN hub so all VPCs reach on-prem through one attachment.',
        hintHi: 'SITE-TO-SITE VPN: aapke on-prem equipment aur cloud VPN gateway ke beech IPsec tunnels, PUBLIC INTERNET PAR. Setup: QUICK (hours-days). Bandwidth: ~1.25 Gbps PER TUNNEL. Latency: INTERNET-VARIABLE. Cost: CHEAP. USE: management traffic, DR, small sites, BACKUP path. DIRECT CONNECT / EXPRESSROUTE: aapke data centre se cloud network mein ek DEDICATED PHYSICAL CIRCUIT — INTERNET KO POORI TARAH BYPASS. Setup: WEEKS (physical cross-connect). Bandwidth: HIGH + GUARANTEED, 1-100 Gbps. Latency: CONSISTENT + LOW. Cost: $$$. Internet exposure: NONE (compliance). USE: production data-plane, large transfers, compliance mandates. PRODUCTION PATTERN: PRIMARY ke liye Direct Connect / ExpressRoute + AUTOMATIC FAILOVER ke roop mein ek site-to-site VPN.',
      },
    ],

    keyTakeaways: [
      'SECURITY GROUP: attached to a RESOURCE, STATEFUL (allow inbound → reply auto-allowed out), ALLOW-ONLY, default deny-inbound/allow-outbound. KEY: a rule\'s source/dest can be ANOTHER SG — identity-based rules that survive autoscaling and IP churn. This is your PRIMARY access control. AZURE: Network Security Groups + Application Security Groups.',
      'NETWORK ACL: attached to a SUBNET, STATELESS (a reply needs its own rule on the ephemeral range), NUMBERED first-match-wins, supports explicit DENY. It is a BLUNT subnet-wide BACKSTOP — leave it permissive and use it only for coarse rules an SG can\'t express (block an abusive CIDR at the edge; a second-layer outbound deny on the data subnet).',
      'A TIERED SG CHAIN references SGs, not CIDRs (except the internet on the ALB): alb-sg ← 0.0.0.0/0:443; app-sg ← alb-sg:8080; db-sg ← app-sg:5432; cache-sg ← app-sg:6379. Blast radius of compromising a tier = exactly what its SG lets it reach. CIDRs in SG rules only for genuinely external fixed sources (the internet, a partner IP range, an on-prem range over VPN).',
      'VPC PEERING = a direct NON-TRANSITIVE 1:1 link, CIDRs must not overlap, routes on both sides — good for ≤ ~4-5 VPCs (a full mesh is N(N-1)/2). TRANSIT GATEWAY = a hub-and-spoke router, attach many VPCs/VPN/Direct Connect once, transitive, central route-table policy, ~$36/mo per attachment — for a growing estate. PRIVATELINK = expose ONE service (behind an NLB) as an interface endpoint (a private IP in the consumer\'s subnet), one-directional, no route to the rest of your VPC, no CIDR coordination — the safest cross-org / partner sharing.',
      'ON-PREM: SITE-TO-SITE VPN (IPsec over the internet — quick, cheap, ~1.25 Gbps/tunnel, internet-variable latency — for management/DR/small sites/backup) vs DIRECT CONNECT / EXPRESSROUTE (a dedicated physical circuit — weeks to provision, $$$, consistent latency, 1-100 Gbps, no internet — for production data planes + compliance). Common pattern: Direct Connect primary + VPN automatic failover.',
    ],
    keyTakeawaysHi: [
      'SECURITY GROUP: ek RESOURCE se attached, STATEFUL (inbound allow → reply auto-allowed), ALLOW-ONLY, default deny-inbound/allow-outbound. KEY: ek rule ka source/dest ek DOOSRA SG ho sakta hai — identity-based rules jo autoscaling survive karte hain. Ye aapka PRIMARY access control hai. AZURE: NSGs + ASGs.',
      'NETWORK ACL: ek SUBNET se attached, STATELESS (reply ko ephemeral range par apna rule chahiye), NUMBERED first-match-wins, explicit DENY support karta hai. Ye ek BLUNT subnet-wide BACKSTOP hai — permissive chhodo, sirf coarse rules ke liye use karo.',
      'Ek TIERED SG CHAIN SGs reference karti hai, CIDRs nahi (sivaay ALB par internet): alb-sg ← 0.0.0.0/0:443; app-sg ← alb-sg:8080; db-sg ← app-sg:5432; cache-sg ← app-sg:6379. Ek tier compromise karne ka blast radius = exactly jo iska SG ise reach karne deta hai.',
      'VPC PEERING = ek direct NON-TRANSITIVE 1:1 link, CIDRs overlap nahi honi chahiye — ≤ ~4-5 VPCs ke liye achha. TRANSIT GATEWAY = ek hub-and-spoke router, kई VPCs/VPN/Direct Connect ek baar attach, transitive, central route-table policy — ek growing estate ke liye. PRIVATELINK = EK service ko ek interface endpoint ke roop mein expose karo, one-directional, VPC ke baaki tak koi route nahi — sabse safe cross-org / partner sharing.',
      'ON-PREM: SITE-TO-SITE VPN (internet par IPsec — quick, cheap, ~1.25 Gbps/tunnel, internet-variable latency — management/DR/small sites/backup ke liye) vs DIRECT CONNECT / EXPRESSROUTE (ek dedicated physical circuit — provision karne mein hafte, $$$, consistent latency, 1-100 Gbps, koi internet nahi — production data planes + compliance ke liye). Common pattern: Direct Connect primary + VPN automatic failover.',
    ],
  },

  {
    slug: 'ops-managed-databases-caches-and-what-you-trade',
    title: 'Managed Databases, Caches & What You Trade',
    titleHi: 'Managed Databases, Caches Aur Aap Kya Trade Karte Ho',
    description:
      'A managed database service takes over the operational work of running a database — provisioning, patching, backups, failover, replication, monitoring — in exchange for giving up some control: superuser access, arbitrary extensions, the exact version, and portability. This lesson covers what you actually get, what you actually lose, the Multi-AZ versus read-replica distinction, and where a managed cache fits. Ties back to the Databases course.',
    descriptionHi:
      'Ek managed database service ek database chalane ka operational work le leta hai — provisioning, patching, backups, failover, replication, monitoring — kuch control chhodne ke exchange mein: superuser access, arbitrary extensions, exact version, aur portability. Ye lesson cover karta hai aap actually kya paate ho, actually kya khote ho, Multi-AZ versus read-replica distinction, aur ek managed cache kahaan fit hota hai. Databases course se ties back.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Leasing a car with a full maintenance plan versus owning one you service yourself.** With the lease, someone else handles the oil changes, the tyres, the recalls, and gives you a loaner the day yours is in the shop — you just drive it. You cannot fit a turbocharger, you cannot skip this year\'s mandatory software update, and when the lease ends you hand the car back rather than sell it. Owning your own means you can modify anything and keep it for twenty years, but every service, every failure, and every recall is your problem, at 2 a.m. if that is when it happens. A managed database is the lease: the provider runs the engine, you run your queries and your data.',
      hi: '**Ek full maintenance plan ke saath ek car lease karna versus ek own karna jise aap khud service karte ho.** Lease ke saath, koi aur oil changes, tyres, recalls handle karta hai, aur aapko ek loaner deta hai jis din aapki shop mein hai — aap bas ise drive karte ho. Aap ek turbocharger fit nahi kar sakte, aap is saal ka mandatory software update skip nahi kar sakte, aur jab lease khatam hota hai aap car wapas de dete ho. Apni khud own karna ka matlab aap kuch bhi modify kar sakte ho aur ise bees saal rakh sakte ho, par har service, har failure, aur har recall aapki problem hai, 2 a.m. par agar tab hota hai. Ek managed database lease hai: provider engine chalata hai, aap apni queries aur apna data chalate ho.',
    },

    simple: `**MANAGED DATABASE** — RDS / Aurora / Azure SQL / Azure Database for PostgreSQL /
Cloud SQL / DynamoDB / Cosmos DB. The provider runs the DB engine and its ops.

**WHAT YOU GET:**
\`\`\`
PROVISIONING     a running, network-isolated, tuned instance in minutes (vs days)
PATCHING         minor versions auto-applied in your maintenance window; major = a
                 button (you still test + choose when)
BACKUPS          automated daily snapshot + continuous transaction-log archiving ->
                 POINT-IN-TIME RESTORE to any second in the retention window (Databases M12)
HIGH AVAILABILITY  Multi-AZ: a synchronous standby in another AZ; automatic failover
                 in ~60-120s on primary failure, no data loss. one flag.
READ SCALING     read replicas (async) you can add/remove; route reads to them
MONITORING       engine metrics, slow-query logs, Performance Insights / Query Store
ENCRYPTION       at rest (KMS) + in transit, on by default or one flag
\`\`\`

**WHAT YOU GIVE UP:**
\`\`\`
NO SUPERUSER     you get a powerful admin role, NOT real superuser. some commands
                 blocked (things that touch the OS / filesystem / replication internals)
LIMITED EXTENSIONS  only the extensions the provider allows + has vetted (a long list
                 for Postgres, but not everything; no custom C extensions)
VERSION LAG      new engine versions arrive months after upstream; old ones are
                 force-deprecated on the provider's schedule (you WILL be upgraded)
NO OS ACCESS     can't ssh in, can't read the raw data files, can't run a profiler
                 on the host, can't tune kernel params
COST PREMIUM     ~15-40% over raw compute + storage for the same hardware
LOCK-IN          Aurora / DynamoDB / Cosmos have proprietary APIs or behaviours;
                 migrating out is a project. (plain RDS Postgres/MySQL is portable.)
\`\`\`

**MULTI-AZ vs READ REPLICA — different jobs, often confused:**
\`\`\`
MULTI-AZ         a SYNCHRONOUS standby, SAME region, NOT readable, sole purpose =
                 automatic failover for AVAILABILITY. one instance's worth of cost.
READ REPLICA     an ASYNCHRONOUS copy, readable, for READ SCALING (and can be
                 cross-region for DR / geo-local reads). replication LAG exists.
                 promoting one to standalone is manual (Aurora is faster).
you often want BOTH: Multi-AZ for HA + N read replicas for read throughput.
\`\`\`

**MANAGED CACHE** — ElastiCache / MemoryDB / Azure Cache for Redis / Memorystore.
Redis or Memcached, managed. Use for: session store, hot-key cache, rate-limit
counters, a leaderboard, a job queue (Redis). Modes: cache-aside (app checks
cache, falls back to DB, populates), write-through, TTL eviction. **A cache is not
a database** - it can lose data on failover; don't store the only copy of anything.

**AZURE / GCP names:**
\`\`\`
relational   Azure SQL Database, Azure DB for PostgreSQL/MySQL Flexible Server / Cloud SQL, AlloyDB
doc/wide     Cosmos DB (multi-model) / Firestore, Bigtable
cache        Azure Cache for Redis / Memorystore
DR pattern   zone-redundant tier (= Multi-AZ) + geo-replica (= cross-region read replica)
\`\`\``,

    simpleHi: `**MANAGED DATABASE** — RDS / Aurora / Azure SQL / Azure Database for PostgreSQL /
Cloud SQL / DynamoDB / Cosmos DB. Provider DB engine aur iske ops chalata hai.

**AAP KYA PAATE HO:**
\`\`\`
PROVISIONING     minutes mein ek running, network-isolated, tuned instance (days ke bajaay)
PATCHING         minor versions aapke maintenance window mein auto-applied; major = ek button
BACKUPS          automated daily snapshot + continuous transaction-log archiving ->
                 retention window mein kisi bhi second par POINT-IN-TIME RESTORE (Databases M12)
HIGH AVAILABILITY  Multi-AZ: doosre AZ mein ek synchronous standby; primary failure par
                 ~60-120s mein automatic failover, koi data loss nahi. ek flag.
READ SCALING     read replicas (async) jo aap add/remove kar sakte ho
MONITORING       engine metrics, slow-query logs, Performance Insights / Query Store
ENCRYPTION       at rest (KMS) + in transit, default par on ya ek flag
\`\`\`

**AAP KYA CHHODTE HO:**
\`\`\`
NO SUPERUSER     aapko ek powerful admin role milta hai, real superuser NAHI. kuch commands
                 blocked (OS / filesystem / replication internals touch karne wali cheezein)
LIMITED EXTENSIONS  sirf wo extensions jo provider allow karta hai + vet kiye hain
VERSION LAG      naye engine versions upstream ke mahine baad aate hain; purane
                 provider ke schedule par force-deprecated hote hain (aap upgrade HONGE)
NO OS ACCESS     ssh nahi kar sakte, raw data files read nahi kar sakte, host par ek
                 profiler nahi chalा sakte, kernel params tune nahi kar sakte
COST PREMIUM     same hardware ke liye raw compute + storage par ~15-40%
LOCK-IN          Aurora / DynamoDB / Cosmos ke proprietary APIs ya behaviours hain;
                 migrate out ek project hai. (plain RDS Postgres/MySQL portable hai.)
\`\`\`

**MULTI-AZ vs READ REPLICA — alag jobs, aksar confused:**
\`\`\`
MULTI-AZ         ek SYNCHRONOUS standby, SAME region, readable NAHI, sole purpose =
                 AVAILABILITY ke liye automatic failover. ek instance ki cost.
READ REPLICA     ek ASYNCHRONOUS copy, readable, READ SCALING ke liye (aur DR ke liye
                 cross-region ho sakta hai). replication LAG exist karta hai.
                 ise standalone promote karna manual hai (Aurora faster hai).
aap aksar DONO chahte ho: HA ke liye Multi-AZ + read throughput ke liye N read replicas.
\`\`\`

**MANAGED CACHE** — ElastiCache / MemoryDB / Azure Cache for Redis / Memorystore.
Redis ya Memcached, managed. Use for: session store, hot-key cache, rate-limit
counters, ek leaderboard, ek job queue (Redis). **Ek cache ek database nahi hai** -
ye failover par data kho sakta hai; kisi cheez ki ekmatra copy store mat karo.`,

    content: `## What a managed database service is

A managed database service — RDS and Aurora on AWS, Azure SQL Database and the Azure Database for PostgreSQL / MySQL Flexible Servers, Cloud SQL and AlloyDB on GCP, and the NoSQL offerings DynamoDB, Cosmos DB, and Firestore — runs the database engine and all the operational work around it, while you retain your data and your schema and your queries. The trade is explicit: you hand over control of the operating system, the engine internals, and the upgrade schedule, and in return you stop being responsible for the work that keeps a database running well and available.

## What you get

- **Provisioning** in minutes: a running instance, placed in your private subnets, with sensible defaults, instead of days of installing, configuring, hardening, and tuning.
- **Patching**: minor engine versions are applied automatically during a maintenance window you choose; major version upgrades are initiated by you, on your schedule, after you test — but the mechanics are handled.
- **Backups**: an automated daily snapshot plus continuous archiving of the transaction log, which together give **point-in-time restore** — you can restore the database to its exact state at any second within the retention window, which is what you need after a bad deployment or an accidental \`DELETE\` (Databases course, Module 12).
- **High availability**: a **Multi-AZ** deployment maintains a synchronous standby replica in a second availability zone; if the primary fails, the service fails over to the standby automatically in roughly a minute or two with no data loss, and this is a single configuration flag.
- **Read scaling**: **read replicas** that asynchronously copy the primary and serve read queries, which you add and remove as needed.
- **Monitoring**: engine-level metrics, slow-query logs, and a query-analysis tool (Performance Insights on RDS, Query Store on Azure SQL) without setting up any of it.
- **Encryption** at rest via the cloud key-management service and in transit via TLS, either on by default or enabled with one setting.

## What you give up

- **No true superuser**: you get a highly privileged administrative role, but not the real superuser account. Commands that would let you touch the host operating system, the filesystem, or the replication internals are blocked.
- **Restricted extensions**: for PostgreSQL you get a long list of vetted extensions, but not every extension exists on it, and you cannot install a custom C extension of your own.
- **Version lag and forced upgrades**: new engine versions appear on the managed service months after they are released upstream, and old versions are deprecated on the provider\'s timetable — you will eventually be upgraded whether or not you initiate it.
- **No operating-system access**: you cannot log into the host, read the raw data files, run a system profiler, or tune kernel parameters.
- **A cost premium**: roughly fifteen to forty percent more than the raw compute and storage would cost for equivalent hardware, which is the price of the operational work.
- **Lock-in on the proprietary options**: Aurora, DynamoDB, and Cosmos DB have APIs or behaviours that do not exist elsewhere, so migrating off them is a real project. Plain RDS for PostgreSQL or MySQL, by contrast, is standard and portable.

For almost every team, on almost every workload, the operational work the managed service takes over is worth far more than the premium and the lost control — which is why running your own database on a VM is now the exception, reserved for cases that genuinely need an unavailable extension, a specific unsupported version, or OS-level access.

## Multi-AZ versus read replica

These are frequently confused because both involve a second copy of the database, but they do different jobs.

A **Multi-AZ** standby is a synchronous replica in another availability zone in the same region. Every write is committed on both the primary and the standby before it is acknowledged, so there is no data loss on failover. The standby is **not readable** — it exists purely to take over if the primary fails, which it does automatically in about a minute or two. It roughly doubles the instance cost. Its job is **availability**.

A **read replica** is an asynchronous copy that lags the primary by some amount of replication delay. It **is readable**, and you point read-heavy queries at it to take load off the primary. You can have several, and they can be in other regions for disaster recovery or to serve reads with low latency near users elsewhere. Promoting a read replica to a standalone primary is a manual operation (faster on Aurora, which shares storage). Its job is **read scaling**.

A production database typically wants both: Multi-AZ for availability, and one or more read replicas for read throughput. On Azure the equivalents are the zone-redundant service tier (Multi-AZ) and geo-replicas (cross-region read replicas).

## Managed caches

A managed cache — ElastiCache and MemoryDB on AWS, Azure Cache for Redis, Memorystore on GCP — runs Redis or Memcached as a service. Common uses: a session store, a cache of hot database rows or expensive computed results, rate-limiting counters, a leaderboard sorted set, and a lightweight job queue (Redis). The standard pattern is **cache-aside**: the application checks the cache, and on a miss reads from the database and populates the cache with a time-to-live; alternatives are write-through (write to cache and database together) and various eviction policies.

The important discipline is that **a cache is not a database**. It holds data in memory, it can lose recent data on a failover, and its whole point is that the authoritative copy is elsewhere. Never store the only copy of anything in a cache. MemoryDB is an exception designed to be durable, but the general rule stands.

This lesson connects directly to the Databases course, which covers the engines themselves — the SQL and NoSQL data models, indexing, transactions, and the point-in-time-restore mechanics — in depth. Here the focus is the operational envelope the cloud puts around them.`,

    contentHi: `## Ek managed database service kya hai

Ek managed database service — AWS par RDS aur Aurora, Azure SQL Database aur Azure Database for PostgreSQL / MySQL Flexible Servers, GCP par Cloud SQL aur AlloyDB, aur NoSQL offerings DynamoDB, Cosmos DB, aur Firestore — database engine aur iske aas-paas saara operational work chalata hai, jabki aap apna data aur apni schema aur apni queries retain karte ho. Trade explicit hai: aap operating system, engine internals, aur upgrade schedule ka control hand over karte ho, aur return mein aap us work ke liye responsible hona band karte ho jo ek database ko achha chalne aur available rakhta hai.

## Aap kya paate ho

- **Provisioning** minutes mein: ek running instance, aapke private subnets mein placed, sensible defaults ke saath.
- **Patching**: minor engine versions automatically apply hote hain ek maintenance window mein jo aap choose karte ho; major version upgrades aap initiate karte ho.
- **Backups**: ek automated daily snapshot plus transaction log ka continuous archiving, jo ek saath **point-in-time restore** dete hain (Databases course, Module 12).
- **High availability**: ek **Multi-AZ** deployment ek doosre availability zone mein ek synchronous standby replica maintain karta hai; agar primary fail hota hai, service ~ek ya do minute mein automatically standby par fail over hota hai bina data loss ke.
- **Read scaling**: **read replicas** jo asynchronously primary ko copy karti hain aur read queries serve karti hain.
- **Monitoring**: engine-level metrics, slow-query logs, aur ek query-analysis tool.
- **Encryption** at rest cloud key-management service ke through aur in transit TLS ke through.

## Aap kya chhodte ho

- **Koi true superuser nahi**: aapko ek highly privileged administrative role milta hai, par real superuser account nahi.
- **Restricted extensions**: PostgreSQL ke liye aapko vetted extensions ki ek long list milti hai, par har extension ispar exist nahi karta.
- **Version lag aur forced upgrades**: naye engine versions managed service par upstream ke mahine baad aate hain, aur purane versions provider ke timetable par deprecated hote hain.
- **Koi operating-system access nahi**: aap host mein log in nahi kar sakte, raw data files read nahi kar sakte.
- **Ek cost premium**: equivalent hardware ke liye raw compute aur storage se lagbhag pandrah se chalees percent zyada.
- **Proprietary options par lock-in**: Aurora, DynamoDB, aur Cosmos DB ke APIs ya behaviours hain jo kahin aur exist nahi karte.

Lagbhag har team ke liye, lagbhag har workload par, jo operational work managed service le leta hai wo premium aur lost control se kaafi zyada worth hai.

## Multi-AZ versus read replica

Ye aksar confused hote hain kyunki dono database ki ek doosri copy involve karte hain, par wo alag jobs karte hain.

Ek **Multi-AZ** standby same region mein ek doosre availability zone mein ek synchronous replica hai. Har write acknowledge hone se pehle primary aur standby dono par commit hota hai, to failover par koi data loss nahi hai. Standby **readable nahi** hai. Iska job **availability** hai.

Ek **read replica** ek asynchronous copy hai jo primary ko kuch replication delay se lag karti hai. Ye **readable hai**, aur aap read-heavy queries ise par point karte ho. Ye doosre regions mein ho sakti hain disaster recovery ke liye. Iska job **read scaling** hai.

Ek production database typically dono chahता hai: availability ke liye Multi-AZ, aur read throughput ke liye ek ya zyada read replicas.

## Managed caches

Ek managed cache — AWS par ElastiCache aur MemoryDB, Azure Cache for Redis, GCP par Memorystore — Redis ya Memcached ko ek service ke roop mein chalata hai. Common uses: ek session store, hot database rows ya expensive computed results ka ek cache, rate-limiting counters, ek leaderboard. Standard pattern **cache-aside** hai.

Important discipline ye hai ki **ek cache ek database nahi hai**. Ye data memory mein rakhta hai, ye ek failover par recent data kho sakta hai. Kisi cheez ki ekmatra copy ek cache mein kabhi store mat karo.`,

    examples: [
      {
        title: 'Multi-AZ vs read replicas: which failure or load each one addresses',
        titleHi: 'Multi-AZ vs read replicas: kaun sा failure ya load har ek address karta hai',
        code: `# a read-heavy app: ~85% reads, ~15% writes. one RDS PostgreSQL primary.

SYMPTOM A  "the primary's CPU is at 90%, reads are slow, writes are fine"
  -> READ SCALING problem. add read replicas:
     rds create-db-instance-read-replica --source-db-instance-identifier prod
     ...x2, in the same region.
     app: route SELECTs (that tolerate ~ms of lag) to the replica endpoint,
          route writes + read-your-own-write to the primary.
  -> primary CPU drops to ~30%. Multi-AZ would NOT have helped (standby isn't readable).

SYMPTOM B  "AZ us-east-1a had a network event; the DB was unreachable for 25 min"
  -> AVAILABILITY problem. enable Multi-AZ:
     rds modify-db-instance --db-instance-identifier prod --multi-az
  -> now a primary/AZ failure fails over to the synchronous standby in 1b in
     ~70 seconds, no data loss. read replicas would NOT have helped (async = data
     loss on promotion, and promotion is manual + minutes).

SYMPTOM C  "EU users see 180ms on every read; the DB is in us-east-1"
  -> LATENCY problem. a CROSS-REGION read replica in eu-west-1:
     rds create-db-instance-read-replica --source-db ... --region eu-west-1
     EU app reads hit the local replica; writes still go to us-east-1 (accept the
     write latency, or move to a multi-region DB like Aurora Global / Cosmos).

# the production shape for this app:
#   1 primary (Multi-AZ)  +  2 same-region read replicas  +  1 cross-region replica
#   Multi-AZ = survives an AZ.  replicas = read throughput + geo-local reads + a
#   warm cross-region copy for DR.`,
        output: `Each "add a copy of the database" decision answers a different question. CPU-bound
reads -> read replicas (Multi-AZ can't help; the standby isn't readable). An AZ
outage -> Multi-AZ (read replicas can't help; async replication loses data on a
rushed promotion). Far-away users -> a cross-region read replica. A serious
production DB usually has Multi-AZ AND several read replicas - they are not
alternatives.`,
        explain: 'A read-heavy application on a single database instance runs into three different problems, and each is solved by a different kind of replica. When the primary is CPU-bound on read traffic, the fix is read replicas: asynchronous copies that serve select queries, so the application routes reads that can tolerate a few milliseconds of lag to a replica endpoint and keeps writes and read-your-own-writes on the primary. A Multi-AZ standby would not help here because it is not readable. When an availability zone has an outage and the database is unreachable, the fix is Multi-AZ: a synchronous standby in another zone that the service fails over to automatically in about a minute with no data loss. Read replicas would not help here because their replication is asynchronous, so promoting one loses the writes that had not yet replicated, and promotion is a manual operation that takes minutes. When users in a distant region see high read latency, the fix is a cross-region read replica so their reads are served locally, with writes still going to the primary region. The production configuration for this application ends up with all three: a Multi-AZ primary for zone resilience, two same-region read replicas for read throughput, and a cross-region replica that serves EU reads and doubles as a warm disaster-recovery copy. Multi-AZ and read replicas are not alternatives; a serious database has both.',
        explainHi: 'Ek single database instance par ek read-heavy application teen alag problems mein run karti hai, aur har ek ek alag kind ke replica se solved hai. Jab primary read traffic par CPU-bound hai, fix read replicas hain: asynchronous copies jo select queries serve karti hain. Ek Multi-AZ standby yahaan help nahi karega kyunki ye readable nahi hai. Jab ek availability zone mein ek outage hai aur database unreachable hai, fix Multi-AZ hai: ek doosre zone mein ek synchronous standby jis par service ~ek minute mein automatically fail over hoti hai bina data loss ke. Read replicas yahaan help nahi karengi kyunki unki replication asynchronous hai. Jab ek distant region mein users high read latency dekhते hain, fix ek cross-region read replica hai. Is application ke liye production configuration teenon ke saath end hoti hai. Multi-AZ aur read replicas alternatives nahi hain.',
      },
      {
        title: 'What "managed" costs you: three cases where the trade did or did not work',
        titleHi: '"Managed" aapko kya cost karta hai: teen cases jahaan trade kaam kiya ya nahi',
        code: `# CASE 1  a standard Rails app on PostgreSQL 15, standard extensions (pgcrypto,
#         uuid-ossp, pg_stat_statements). team of 6, no DBA.
#   managed (RDS): ~$310/mo for the instance. gets: PITR, Multi-AZ failover,
#     auto minor patching, Performance Insights, encrypted, in private subnets.
#   self-run on EC2: ~$210/mo + someone owns pg_dump cron, WAL archiving, a standby
#     + failover script, patching, monitoring setup, and 2am pages.
#   VERDICT: managed. the $100/mo premium buys back multiple engineer-days/month.

# CASE 2  a team needs the TimescaleDB extension (not on RDS) and pg_partman with
#         a specific version, plus a custom C extension they wrote.
#   managed: TimescaleDB isn't in the RDS extension allowlist. dead end.
#     (Timescale Cloud is an option; RDS is not.)
#   self-run: full control, install anything. accept the ops burden, or use a
#     specialist managed provider (Timescale Cloud, Aiven).
#   VERDICT: the managed *generalist* can't do it. a self-run or a specialist managed.

# CASE 3  a team picks Aurora Serverless v2 for "no capacity planning", then 2
#         years later wants to move to a cheaper self-hosted Postgres for cost.
#   the app uses Aurora-specific features: fast cloning, the Data API, custom
#     endpoints, Aurora's replication behaviour. the migration is a 2-quarter project
#     with a data-model review and a load-test cycle.
#   VERDICT: the managed service was right operationally; the LOCK-IN was
#     underestimated. plain RDS Postgres would have been portable; Aurora is not.`,
        output: `The managed trade is usually right: for a standard workload, the operational work
the provider takes over (PITR, failover, patching, monitoring) is worth far more
than the ~15-40% premium and the lost superuser. It is wrong when you need an
extension or version the managed generalist doesn't offer - then use self-run or
a SPECIALIST managed service. And "managed" is not one decision: plain RDS
Postgres is portable; Aurora/DynamoDB/Cosmos trade portability for their
proprietary strengths - know which you are choosing.`,
        explain: 'Three cases show the managed-versus-self-run decision landing differently. In the first, a standard application on a standard PostgreSQL version with common extensions and a small team with no dedicated database administrator: the managed service costs about a hundred dollars a month more than running it on a VM, and in exchange the team gets point-in-time restore, automatic failover, patching, and query analysis without building or operating any of it, which is worth several engineer-days a month — the trade is clearly right. In the second, a team that needs the TimescaleDB extension, which is not on the RDS allowlist, plus a custom C extension of their own: the managed generalist simply cannot run this, so the options are self-running the database with full control and the operational burden, or using a specialist managed provider that supports exactly this stack. In the third, a team that chose Aurora Serverless for its operational convenience and later wanted to move to self-hosted PostgreSQL for cost: the operational choice was fine, but they had built on Aurora-specific features, and migrating off is a multi-quarter project — the lock-in was underestimated. The lesson is that the managed trade is usually worth making, that it fails specifically when you need something the managed generalist does not offer, and that "managed" is not a single decision because plain RDS PostgreSQL is portable while the proprietary services trade that portability for their particular strengths.',
        explainHi: 'Teen cases dikhाते hain managed-versus-self-run decision alag tarah se land hote hue. Pehle mein, ek standard PostgreSQL version par ek standard application common extensions ke saath aur ek chhoti team bina ek dedicated database administrator ke: managed service ise ek VM par chalane se lagbhag ek sau dollar ek mahine zyada cost karता hai, aur exchange mein team ko point-in-time restore, automatic failover, patching milta hai — trade clearly sahi hai. Doosre mein, ek team jise TimescaleDB extension chahiye, jo RDS allowlist par nahi hai: managed generalist simply ise chala nahi sakta. Teesre mein, ek team jisne Aurora Serverless choose kiya iski operational convenience ke liye aur baad mein cost ke liye self-hosted PostgreSQL par move karna chahti thi: operational choice theek thi, par unhone Aurora-specific features par build kiya tha, aur migrate off ek multi-quarter project hai. Lesson ye hai ki managed trade aam taur par worth making hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# thinking a Multi-AZ standby gives you read scaling
# the app is read-bound. someone enables Multi-AZ expecting reads to go to the standby.
$ psql -h prod-standby.xxx.rds.amazonaws.com    # there is no such endpoint
# the standby is not reachable, not readable. it does one thing: take over on
# failover. the primary is still at 90% CPU serving all the reads.
# meanwhile the team is paying 2x for a hot spare they think is doing work.`,
        right: `# Multi-AZ = AVAILABILITY (a synchronous, non-readable failover target).
# READ SCALING = read replicas (asynchronous, readable, N of them):
#   create 2-3 read replicas -> get their endpoints
#   in the app / via a proxy (RDS Proxy, pgbouncer):
#     writes + "read after my own write" -> primary
#     everything else that tolerates replication lag -> replica pool
#   watch ReplicaLag; if a read needs strong consistency, send it to the primary.
# Aurora makes this cleaner: a single READER endpoint that load-balances across
# all replicas automatically.`,
        why: 'Multi-AZ and read replicas are constantly confused because both create a second copy of the database, but they are built for completely different purposes and behave differently. A Multi-AZ standby replicates synchronously so there is no data loss, but precisely because it must stay perfectly in step it is not exposed for reads — it is a passive failover target and nothing else. Enabling Multi-AZ therefore does nothing for a read-bound workload: the primary still serves every query and stays pinned at high CPU, and you are now paying roughly double for a standby that is doing no useful work until the day the primary fails. Read scaling requires read replicas, which replicate asynchronously and are readable, so you can have several of them and route read queries that tolerate a small replication lag to a replica pool while keeping writes and any read that must see its own prior write on the primary. RDS Proxy or a connection pooler in front makes the routing manageable, and you monitor replica lag so that a query needing strong consistency can be sent to the primary. Aurora simplifies this further with a single reader endpoint that automatically balances across all replicas.',
        whyHi: 'Multi-AZ aur read replicas constantly confused hote hain kyunki dono database ki ek doosri copy banाते hain, par wo poori tarah alag purposes ke liye built hain aur alag tarah behave karते hain. Ek Multi-AZ standby synchronously replicate karता hai to koi data loss nahi hai, par precisely kyunki ise perfectly in step rehna hai ye reads ke liye exposed nahi hai — ye ek passive failover target hai aur kuch nahi. Multi-AZ enable karna isliए ek read-bound workload ke liye kuch nahi karता: primary abhi bhi har query serve karता hai. Read scaling ke liye read replicas chahiye, jo asynchronously replicate karती hain aur readable hain. RDS Proxy ya ek connection pooler routing ko manageable banाता hai. Aurora ise ek single reader endpoint ke saath aur simplify karता hai.',
      },
      {
        wrong: `# storing the only copy of important data in a cache "because it's fast"
# a team keeps user sessions AND shopping-cart contents ONLY in ElastiCache Redis,
# no persistent backing store.
# a Redis node fails and the replica is promoted -> the last few seconds of writes
# that hadn't replicated are gone. every user with an in-flight cart at that moment
# loses it. and a full cluster restart (a patch, an incident) = everyone logged
# out, every cart empty.
# "it's fine, Redis has AOF persistence" -> AOF on ElastiCache is best-effort and
# still loses the window since the last fsync; and it's off by default.`,
        right: `# a cache is a fast COPY of data whose source of truth is elsewhere:
#   session store   -> Redis for speed, but a signed stateless JWT or a DB row is
#                      the fallback; or use a store built to be durable (DynamoDB,
#                      MemoryDB, Azure Cache 'persistence' tier) for sessions
#   shopping cart    -> the authoritative cart is a DB row (or DynamoDB); Redis
#                      caches it for read speed; on a cache miss, rebuild from the DB
#   rate-limit count -> Redis is fine (losing a few counts on failover is harmless)
#   computed result  -> Redis with a TTL; on miss, recompute from the DB
# rule: if losing it on a node failover would be a real incident, it needs a
# durable home, and the cache is only an accelerator in front of that home.`,
        why: 'A cache holds data in memory for speed, and that is exactly why it cannot be the authoritative store for anything that matters. Standard managed Redis replicates asynchronously, so a node failure and replica promotion loses the writes from the last window that had not yet replicated, and any event that restarts the whole cluster — a version upgrade, an incident, a configuration change — clears everything. Storing user sessions and shopping-cart contents only in the cache means that a routine failover logs users out and empties carts, and a cluster restart does it to everyone at once. Persistence features like Redis AOF are best-effort on managed services, still lose the window since the last flush, and are frequently off by default, so they are not a substitute for a durable store. The correct model is that the cache is a fast copy in front of a source of truth that lives elsewhere: the authoritative shopping cart is a database row or a DynamoDB item that Redis caches for read speed and rebuilds from on a miss; sessions either fall back to a stateless signed token or a database row, or use a store specifically built to be durable such as DynamoDB or MemoryDB. Data whose loss on a failover would be a genuine incident needs a durable home, with the cache acting only as an accelerator in front of it.',
        whyHi: 'Ek cache data ko speed ke liye memory mein rakhता hai, aur wo exactly kyun ye kisi aisी cheez ke liye authoritative store nahi ho sakта jo matter karती hai. Standard managed Redis asynchronously replicate karता hai, to ek node failure aur replica promotion aakhri window ke writes khoता hai jo abhi tak replicate nahi hue the, aur koi bhi event jo poore cluster ko restart karता hai sab kuch clear karता hai. User sessions aur shopping-cart contents sirf cache mein store karne ka matlab ek routine failover users ko log out karता hai aur carts empty karता hai. Persistence features jaise Redis AOF managed services par best-effort hain. Correct model ye hai ki cache ek source of truth ke saamne ek fast copy hai jo kahin aur rehta hai.',
      },
      {
        wrong: `# choosing a proprietary managed DB (Aurora, DynamoDB, Cosmos) for a workload that
# a standard engine handles fine, without weighing the lock-in
# "Aurora is AWS's flagship Postgres, obviously use that" - for a 50GB, 200 QPS,
# entirely standard relational workload.
# you get: Aurora's storage architecture, fast clones, the Data API... none of
# which this workload needs. and you've traded portability - moving to plain
# Postgres later, or to another cloud, is now a migration project.`,
        right: `# match the DB to the workload's real needs, and know the portability cost:
#   standard relational, moderate scale, want portability
#     -> plain RDS/Cloud SQL for PostgreSQL or MySQL. drop-in standard engine.
#        move to self-hosted or another cloud = a pg_dump/restore, not a rewrite.
#   need Aurora's specific strengths (huge scale, fast clone-per-branch, global
#   database, serverless autoscaling) AND accept the lock-in -> Aurora.
#   key-value / document at massive scale, single-digit-ms, don't need SQL
#     -> DynamoDB / Cosmos - but design the access patterns up front (Databases M13)
#        and know you're committed.
# the proprietary services are excellent AT WHAT THEY'RE FOR. don't pick them by
# default for workloads a standard engine serves.`,
        why: 'The proprietary managed databases — Aurora, DynamoDB, Cosmos DB — are genuinely excellent at the problems they were built for: Aurora at very large relational scale with fast storage-level cloning and a global-database mode, DynamoDB and Cosmos at massive key-value and document workloads with single-digit-millisecond latency and no capacity planning. But those strengths come with APIs, behaviours, and operational models that do not exist on a standard engine, so building on them is a commitment: moving to a plain PostgreSQL or MySQL later, or to a different cloud, becomes a migration project involving a data-model review and a re-test cycle rather than a dump and restore. Choosing one of these for a workload that a standard engine handles comfortably — a moderate-scale, entirely conventional relational database — means paying that portability cost for strengths the workload does not use. The right approach is to match the database to what the workload actually needs: plain RDS or Cloud SQL for a standard relational workload where portability has value, the proprietary service only when its specific strengths are genuinely required and the lock-in is a deliberate, accepted trade, and for a NoSQL choice, designing the access patterns up front because that decision is even harder to reverse.',
        whyHi: 'Proprietary managed databases — Aurora, DynamoDB, Cosmos DB — genuinely excellent hain un problems par jinke liye wo built the: Aurora bahut large relational scale par, DynamoDB aur Cosmos massive key-value aur document workloads par single-digit-millisecond latency ke saath. Par wo strengths APIs, behaviours, aur operational models ke saath aate hain jo ek standard engine par exist nahi karते, to un par build karna ek commitment hai: baad mein ek plain PostgreSQL ya MySQL par move karna, ya ek alag cloud par, ek migration project ban jaता hai. Inme se ek ko ek workload ke liye choose karna jise ek standard engine comfortably handle karता hai ka matlab wo portability cost pay karना un strengths ke liye jo workload use nahi karता. Right approach database ko match karना hai jo workload actually chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**Multi-AZ, no read replicas, and a slow read path** — a team enabled Multi-AZ and expected read relief; the primary stayed at 88% CPU because the standby is not readable. Adding two read replicas and routing analytics + list queries to them dropped the primary to 35% and cut p95 read latency by 60%.',
        hi: '**Multi-AZ, koi read replicas nahi, aur ek slow read path** — ek team ne Multi-AZ enable kiya aur read relief expect kiya; primary 88% CPU par raha kyunki standby readable nahi hai. Do read replicas add karna primary ko 35% tak gira diya.',
      },
      {
        en: '**Sessions in a cache, cleared on a patch** — a marketplace kept sessions only in ElastiCache. A scheduled minor-version patch restarted the cluster; every user was logged out mid-checkout on a Friday evening. Moved sessions to DynamoDB with a TTL; Redis now only caches product data with a rebuild-on-miss path.',
        hi: '**Ek cache mein sessions, ek patch par cleared** — ek marketplace ne sessions sirf ElastiCache mein rakhe. Ek scheduled minor-version patch ne cluster restart kiya; har user Friday shaam checkout ke beech logged out ho gaya. Sessions ko ek TTL ke saath DynamoDB par move kiya.',
      },
      {
        en: '**Aurora lock-in, discovered at cost-cut time** — a startup on Aurora Serverless v2 wanted to move to self-hosted Postgres to cut ~$4k/mo. The app used the Data API and fast cloning in CI; the migration was scoped at 8 weeks. They stayed on Aurora and optimised capacity instead. The lesson went into the "choosing a datastore" checklist.',
        hi: '**Aurora lock-in, cost-cut time par discovered** — ek startup Aurora Serverless v2 par ~$4k/mo cut karne ke liye self-hosted Postgres par move karna chahti thi. App ne CI mein Data API aur fast cloning use kiya; migration 8 hafte par scoped tha. Wo Aurora par rahe.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a managed database service give you, and what do you give up in exchange?',
        qHi: 'Ek managed database service aapko kya deta hai, aur aap exchange mein kya chhodte ho?',
        a: 'You get provisioning in minutes into your private subnets with sensible defaults; automatic minor-version patching in a maintenance window you choose; automated daily snapshots plus continuous transaction-log archiving that together give point-in-time restore to any second in the retention window; high availability via a Multi-AZ synchronous standby that fails over automatically in about a minute with no data loss, from a single flag; read replicas you add and remove for read scaling; engine metrics, slow-query logs, and a query-analysis tool without setting any of it up; and encryption at rest and in transit. What you give up: no true superuser, just a highly privileged role with host-and-filesystem operations blocked; a restricted set of extensions, vetted by the provider, with no custom C extensions; version lag, so new engine versions arrive months after upstream, and forced upgrades on the provider\'s deprecation schedule; no operating-system access, so no logging into the host, no reading raw data files, no kernel tuning; a cost premium of roughly fifteen to forty percent over equivalent raw hardware; and lock-in on the proprietary options like Aurora, DynamoDB and Cosmos, whose APIs and behaviours make migrating off a real project — though plain RDS for PostgreSQL or MySQL stays portable. For almost every team on almost every workload the trade is clearly worth it, because the operational work the service takes over is worth far more than the premium and the lost control.',
        aHi: 'Aap paate ho: minutes mein aapke private subnets mein provisioning; ek maintenance window mein automatic minor-version patching; automated daily snapshots plus continuous transaction-log archiving jo ek saath retention window mein kisi bhi second par point-in-time restore dete hain; ek Multi-AZ synchronous standby ke through high availability jo ~ek minute mein automatically fail over hota hai bina data loss ke; read scaling ke liye read replicas; engine metrics, slow-query logs, aur ek query-analysis tool; aur encryption at rest aur in transit. Aap kya chhodte ho: koi true superuser nahi; provider dwara vetted extensions ka ek restricted set; version lag aur forced upgrades; koi operating-system access nahi; equipment hardware par lagbhag pandrah se chalees percent ka ek cost premium; aur Aurora, DynamoDB aur Cosmos jaise proprietary options par lock-in. Lagbhag har team ke liye trade clearly worth it hai.',
      },
      {
        q: 'Explain the difference between Multi-AZ and a read replica. When would you use each, and would you ever use both?',
        qHi: 'Multi-AZ aur ek read replica mein difference samjhao. Aap har ek ko kab use karoge, aur kya aap kabhi dono use karoge?',
        a: 'A Multi-AZ deployment maintains a synchronous standby replica in another availability zone in the same region. Every write commits on both the primary and the standby before it is acknowledged, so there is no data loss if the primary fails, and the service fails over to the standby automatically in about a minute or two. The standby is not readable — its only purpose is to take over. Its job is availability, and it roughly doubles the instance cost. A read replica is an asynchronous copy that lags the primary by some replication delay. It is readable, and you point read-heavy queries at it to offload the primary; you can have several, and they can be in other regions to serve reads with low latency near distant users or as a warm disaster-recovery copy. Promoting a read replica to standalone is a manual operation that takes minutes, and because replication is asynchronous, a rushed promotion loses the writes that had not replicated. Its job is read scaling. You use Multi-AZ when an availability-zone failure must not be an outage. You use read replicas when the primary is CPU-bound on reads, or when users in another region see high read latency. A serious production database usually has both — Multi-AZ for zone resilience and one or more read replicas for read throughput — because they solve different problems and are not alternatives to each other.',
        aHi: 'Ek Multi-AZ deployment same region mein ek doosre availability zone mein ek synchronous standby replica maintain karta hai. Har write acknowledge hone se pehle primary aur standby dono par commit hota hai, to primary fail hone par koi data loss nahi hai, aur service ~ek ya do minute mein automatically standby par fail over hoti hai. Standby readable nahi hai. Iska job availability hai. Ek read replica ek asynchronous copy hai jo primary ko kuch replication delay se lag karti hai. Ye readable hai, aur aap read-heavy queries ise par point karte ho; ye doosre regions mein ho sakti hain. Iska job read scaling hai. Aap Multi-AZ use karte ho jab ek availability-zone failure ek outage nahi hona chahिए. Aap read replicas use karte ho jab primary reads par CPU-bound hai. Ek serious production database aam taur par dono rakhता hai.',
      },
      {
        q: 'Why is "a cache is not a database", and how should a cache relate to the source of truth?',
        qHi: '"Ek cache ek database nahi hai" kyun, aur ek cache source of truth se kaise relate karna chahiye?',
        a: 'A cache holds data in memory for speed, and that is precisely why it cannot be the authoritative store for anything important. Standard managed Redis replicates asynchronously, so a node failure with a replica promotion loses the writes from the last window that had not replicated, and any event that restarts the whole cluster — a version patch, an incident, a config change — clears everything. Persistence features like Redis append-only-file are best-effort on managed services, still lose the window since the last flush, and are often off by default, so they are not a substitute for durability. If you store user sessions and shopping-cart contents only in a cache, a routine failover logs people out and empties carts, and a cluster restart does it to everyone at once. The correct model is that the cache is a fast copy sitting in front of a source of truth that lives elsewhere. The authoritative shopping cart is a database row or a DynamoDB item; Redis caches it for read speed and rebuilds from the database on a miss. Sessions either fall back to a stateless signed token or a database row, or use a store built to be durable such as DynamoDB or MemoryDB. Data that is genuinely fine to lose on a failover — rate-limit counters, recomputable results with a time-to-live — can live in the cache alone. The rule is: if losing it on a node failover would be a real incident, it needs a durable home and the cache is only an accelerator in front of that home.',
        aHi: 'Ek cache data ko speed ke liye memory mein rakhta hai, aur wo precisely kyun ye kisi important cheez ke liye authoritative store nahi ho sakta. Standard managed Redis asynchronously replicate karta hai, to ek node failure ek replica promotion ke saath aakhri window ke writes khota hai jo replicate nahi hue the, aur koi bhi event jo poore cluster ko restart karta hai sab kuch clear karta hai. Persistence features jaise Redis append-only-file managed services par best-effort hain. Agar aap user sessions aur shopping-cart contents sirf ek cache mein store karte ho, ek routine failover logon ko log out karta hai aur carts empty karta hai. Correct model ye hai ki cache ek source of truth ke saamne ek fast copy hai jo kahin aur rehta hai. Authoritative shopping cart ek database row ya ek DynamoDB item hai; Redis ise read speed ke liye cache karta hai. Rule: agar ise ek node failover par khona ek real incident hoga, ise ek durable home chahिए.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list what a managed database gives you and what you give up, and note which AWS options are portable vs locked-in.',
        taskHi: 'Ek comment mein, ek managed database aapko kya deta hai aur aap kya chhodte ho list karo.',
        hint: 'YOU GET: PROVISIONING in minutes (running, network-isolated, tuned — vs days); PATCHING (minor auto-applied in your maintenance window; major = a button you initiate + test); BACKUPS (automated daily snapshot + continuous transaction-log archiving → POINT-IN-TIME RESTORE to any second in the retention window — Databases M12); HIGH AVAILABILITY (Multi-AZ synchronous standby, ~60-120 s automatic failover, no data loss, one flag); READ SCALING (add/remove read replicas); MONITORING (engine metrics, slow-query logs, Performance Insights / Query Store); ENCRYPTION at rest (KMS) + in transit. YOU GIVE UP: NO TRUE SUPERUSER (a powerful admin role, but host/filesystem/replication-internals commands blocked); RESTRICTED EXTENSIONS (only the provider\'s vetted allowlist; no custom C extensions); VERSION LAG + FORCED UPGRADES (new versions months after upstream; old ones force-deprecated on the provider\'s schedule); NO OS ACCESS (no ssh, no raw data files, no host profiler, no kernel tuning); COST PREMIUM (~15-40% over equivalent raw compute + storage); LOCK-IN on proprietary options. PORTABILITY: plain RDS / Cloud SQL / Azure DB for PostgreSQL or MySQL = a STANDARD engine → moving to self-hosted or another cloud is a `pg_dump`/restore, not a rewrite. Aurora / DynamoDB / Cosmos DB / Firestore = PROPRIETARY APIs + behaviours (Aurora storage architecture, fast clones, the Data API, global database; DynamoDB/Cosmos access-pattern-first design) → migrating off is a multi-quarter project. For ~every team on ~every standard workload the trade is clearly worth it (the ops work the provider takes over > the premium + lost control); self-run only when you genuinely need an unsupported extension/version or OS access — and then consider a SPECIALIST managed provider (Timescale Cloud, Aiven) over self-running.',
        hintHi: 'AAP PAATE HO: PROVISIONING minutes mein; PATCHING (minor auto, major = ek button); BACKUPS (daily snapshot + continuous transaction-log archiving → POINT-IN-TIME RESTORE); HIGH AVAILABILITY (Multi-AZ synchronous standby, ~60-120 s automatic failover, ek flag); READ SCALING (read replicas); MONITORING; ENCRYPTION at rest + in transit. AAP CHHODTE HO: NO TRUE SUPERUSER; RESTRICTED EXTENSIONS (provider ka vetted allowlist); VERSION LAG + FORCED UPGRADES; NO OS ACCESS; COST PREMIUM (~15-40%); LOCK-IN. PORTABILITY: plain RDS / Cloud SQL / Azure DB for PostgreSQL/MySQL = STANDARD engine → `pg_dump`/restore. Aurora / DynamoDB / Cosmos / Firestore = PROPRIETARY → multi-quarter migration. ~Har team ke liye trade worth it hai.',
      },
      {
        task: 'In a comment, contrast Multi-AZ and read replicas fully (sync vs async, readable, purpose, promotion, cost), and give the 3 symptoms and which one each addresses.',
        taskHi: 'Ek comment mein, Multi-AZ aur read replicas ka poora contrast karo.',
        hint: 'MULTI-AZ: a SYNCHRONOUS standby, SAME region, another AZ. Every write commits on BOTH primary + standby before ack → NO data loss on failover. NOT readable (no endpoint for it) — its sole purpose is automatic FAILOVER for AVAILABILITY, ~60-120 s, one config flag. Cost ≈ 2× the instance. READ REPLICA: an ASYNCHRONOUS copy, lags the primary by some replication delay (watch `ReplicaLag`). IS readable — route read-heavy queries at it for READ SCALING; have several; can be CROSS-REGION for DR / geo-local reads. Promotion to standalone is MANUAL + minutes, and because replication is async a rushed promotion LOSES the un-replicated writes (Aurora is faster — shared storage). THE 3 SYMPTOMS: (A) "primary CPU at 90%, reads slow, writes fine" → READ SCALING → add read replicas, route lag-tolerant SELECTs to them, keep writes + read-your-own-write on the primary. Multi-AZ would NOT help (standby not readable). (B) "AZ had a network event, DB unreachable 25 min" → AVAILABILITY → enable Multi-AZ → a primary/AZ failure fails over to the synchronous standby in ~70 s, no data loss. Read replicas would NOT help (async → data loss on a rushed manual promotion). (C) "EU users see 180 ms on every read; DB is in us-east-1" → LATENCY → a CROSS-REGION read replica in eu-west-1; EU reads hit the local replica, writes still go to us-east-1 (accept the write latency, or move to Aurora Global / Cosmos multi-region). PRODUCTION SHAPE for a read-heavy app: 1 primary (Multi-AZ) + 2 same-region read replicas + 1 cross-region replica. Multi-AZ and read replicas are NOT alternatives — a serious DB has BOTH. Aurora: a single READER endpoint auto-load-balances all replicas. Azure: zone-redundant tier (= Multi-AZ) + geo-replicas (= cross-region read replicas).',
        hintHi: 'MULTI-AZ: ek SYNCHRONOUS standby, SAME region, doosra AZ. Har write DONO par commit hota hai → NO data loss. NOT readable — sole purpose automatic FAILOVER for AVAILABILITY, ~60-120 s, ek flag. Cost ≈ 2×. READ REPLICA: ek ASYNCHRONOUS copy, primary ko lag karti hai. IS readable — READ SCALING ke liye; kई; CROSS-REGION ho sakti hain. Promotion MANUAL + minutes, async → rushed promotion un-replicated writes KHOTI hai. 3 SYMPTOMS: (A) "primary CPU 90%, reads slow" → READ SCALING → read replicas. (B) "AZ event, DB unreachable" → AVAILABILITY → Multi-AZ. (C) "EU users 180 ms" → LATENCY → CROSS-REGION read replica. PRODUCTION: 1 primary (Multi-AZ) + 2 same-region + 1 cross-region. DONO chahiye. Azure: zone-redundant tier + geo-replicas.',
      },
      {
        task: 'In a comment, explain the cache-aside pattern, why a cache is not a database, and what each of (session store / shopping cart / rate-limit count / computed result) needs for durability.',
        taskHi: 'Ek comment mein, cache-aside pattern samjhao aur ek cache ek database kyun nahi hai.',
        hint: 'MANAGED CACHE = ElastiCache / MemoryDB / Azure Cache for Redis / Memorystore — Redis or Memcached as a service. CACHE-ASIDE (the standard pattern): the app checks the cache; on a MISS it reads from the DB and populates the cache with a TTL; on a HIT it returns the cached value. Alternatives: WRITE-THROUGH (write to cache + DB together), TTL eviction, LRU/LFU eviction. A CACHE IS NOT A DATABASE: it holds data in MEMORY for speed. Standard managed Redis replicates ASYNCHRONOUSLY → a node failure + replica promotion LOSES the un-replicated writes from the last window; any full cluster restart (a patch, an incident, a config change) CLEARS EVERYTHING. Persistence (Redis AOF) on managed services is BEST-EFFORT, still loses the window since the last fsync, and is often OFF by default — NOT a substitute for durability. DURABILITY BY DATA TYPE: SESSION STORE → Redis for speed BUT the fallback is a stateless signed JWT or a DB row; OR use a store built to be durable (DynamoDB with a TTL, MemoryDB, Azure Cache "persistence" tier). SHOPPING CART → the AUTHORITATIVE cart is a DB row / DynamoDB item; Redis caches it for read speed; on a miss, rebuild from the DB. RATE-LIMIT COUNT → Redis alone is FINE (losing a few counts on failover is harmless). COMPUTED RESULT → Redis with a TTL; on a miss, RECOMPUTE from the DB. THE RULE: if losing it on a node failover would be a real incident, it needs a DURABLE HOME, and the cache is only an accelerator in front of that home. (This lesson connects to the Databases course, which covers the engines + PITR mechanics in depth; here the focus is the cloud operational envelope.)',
        hintHi: 'MANAGED CACHE = ElastiCache / MemoryDB / Azure Cache for Redis / Memorystore. CACHE-ASIDE: app cache check karta hai; MISS par DB se read karke cache ko TTL ke saath populate; HIT par cached value return. A CACHE IS NOT A DATABASE: data MEMORY mein. Standard managed Redis ASYNCHRONOUSLY replicate karta hai → node failure + replica promotion un-replicated writes KHOTA hai; full cluster restart SAB CLEAR karta hai. Persistence (AOF) BEST-EFFORT + often OFF. DURABILITY: SESSION STORE → Redis for speed PAR fallback ek stateless JWT / DB row; ya DynamoDB TTL / MemoryDB. SHOPPING CART → AUTHORITATIVE cart ek DB row; Redis cache karta hai; miss par rebuild. RATE-LIMIT COUNT → Redis alone FINE. COMPUTED RESULT → Redis + TTL; miss par recompute. RULE: agar ise node failover par khona ek real incident hoga, ise ek DURABLE HOME chahiye.',
      },
    ],

    keyTakeaways: [
      'A MANAGED DATABASE (RDS/Aurora/Azure SQL/Cloud SQL/DynamoDB/Cosmos) runs the engine + its ops. YOU GET: fast provisioning, auto minor patching, snapshot + transaction-log archiving → POINT-IN-TIME RESTORE, Multi-AZ automatic failover (one flag), read replicas, engine monitoring, encryption. YOU GIVE UP: no true superuser, a vetted-extensions-only list, version lag + forced upgrades, no OS access, a ~15-40% premium, and lock-in on the proprietary options.',
      'PORTABILITY: plain RDS / Cloud SQL / Azure DB for PostgreSQL or MySQL is a STANDARD engine — moving off is a dump/restore. AURORA / DYNAMODB / COSMOS trade portability for proprietary strengths (scale, fast clones, single-digit-ms, no capacity planning) — migrating off is a multi-quarter project. Pick the proprietary services only when their specific strengths are genuinely needed.',
      'MULTI-AZ = a SYNCHRONOUS, NON-readable standby in another AZ for AVAILABILITY (auto-failover ~60-120 s, no data loss, ~2× cost). READ REPLICA = an ASYNCHRONOUS, READABLE copy for READ SCALING (several, can be cross-region; promotion is manual + loses un-replicated writes). They solve DIFFERENT problems — a serious DB has BOTH.',
      'THE 3 SYMPTOMS: primary CPU-bound on reads → read replicas (Multi-AZ can\'t help); an AZ outage → Multi-AZ (read replicas can\'t help — async loses data on a rushed promotion); far-away users with high read latency → a cross-region read replica.',
      'A MANAGED CACHE (ElastiCache / Azure Cache for Redis / Memorystore) uses CACHE-ASIDE (check cache → miss → read DB → populate with a TTL). A CACHE IS NOT A DATABASE — standard Redis replicates async and a failover/restart loses recent data (AOF is best-effort + often off). Sessions + carts need a DURABLE home (a DB row / DynamoDB / MemoryDB) with the cache only in front; rate-limit counts + recomputable results can live in the cache alone.',
    ],
    keyTakeawaysHi: [
      'Ek MANAGED DATABASE (RDS/Aurora/Azure SQL/Cloud SQL/DynamoDB/Cosmos) engine + iske ops chalata hai. AAP PAATE HO: fast provisioning, auto minor patching, snapshot + transaction-log archiving → POINT-IN-TIME RESTORE, Multi-AZ automatic failover (ek flag), read replicas, engine monitoring, encryption. AAP CHHODTE HO: koi true superuser nahi, ek vetted-extensions-only list, version lag + forced upgrades, koi OS access nahi, ek ~15-40% premium, aur proprietary options par lock-in.',
      'PORTABILITY: plain RDS / Cloud SQL / Azure DB for PostgreSQL/MySQL ek STANDARD engine hai — move off ek dump/restore hai. AURORA / DYNAMODB / COSMOS portability ko proprietary strengths ke liye trade karte hain — migrate off ek multi-quarter project hai. Proprietary services sirf tab pick karo jab unki specific strengths genuinely chahिए.',
      'MULTI-AZ = ek SYNCHRONOUS, NON-readable standby doosre AZ mein AVAILABILITY ke liye (auto-failover ~60-120 s, koi data loss nahi, ~2× cost). READ REPLICA = ek ASYNCHRONOUS, READABLE copy READ SCALING ke liye (kई, cross-region ho sakti hain; promotion manual + un-replicated writes khoता hai). Wo ALAG problems solve karте hain — ek serious DB ke DONO hain.',
      '3 SYMPTOMS: primary reads par CPU-bound → read replicas (Multi-AZ help nahi kar sakta); ek AZ outage → Multi-AZ (read replicas help nahi kar sakti); far-away users high read latency ke saath → ek cross-region read replica.',
      'Ek MANAGED CACHE (ElastiCache / Azure Cache for Redis / Memorystore) CACHE-ASIDE use karta hai (cache check → miss → DB read → TTL ke saath populate). A CACHE IS NOT A DATABASE — standard Redis async replicate karta hai aur ek failover/restart recent data khota hai. Sessions + carts ko ek DURABLE home chahिए; rate-limit counts + recomputable results sirf cache mein reh sakte hain.',
    ],
  },
];
