/**
 * DevOps Complete Course — Module 3: Networking for DevOps, lessons 1-3.
 * Part I of the course: Foundations.
 *
 * Lesson 1: How a request reaches a server — the full path from URL to app,
 *           and the TCP/IP layers in practice. PROSE (realistic tool output).
 * Lesson 2: IP addressing, subnets & CIDR — IPv4, private ranges, CIDR math,
 *           NAT, a note on IPv6. CIDR/subnet math VERIFIED against real bash.
 * Lesson 3: DNS — record types, the resolution walk, TTL & caching, split-horizon,
 *           reading dig output, common failures. PROSE (realistic dig output).
 *
 * Examples whose `code` begins with "# VERIFY" run against a real bash
 * (scratchpad/verify-bash.mjs). The rest show realistic command output.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_3: CourseLesson[] = [
  {
    slug: 'ops-how-a-request-reaches-a-server',
    title: 'How a Request Reaches a Server',
    titleHi: 'Ek Request Ek Server Tak Kaise Pahunchti Hai',
    description: 'Typing a URL and getting a response involves a fixed sequence: resolve the name to an IP, open a TCP connection, negotiate TLS, send an HTTP request, and often pass through a load balancer and a reverse proxy before the application sees it. Knowing the sequence is knowing where to look when it breaks.',
    descriptionHi: 'Ek URL type karke ek response paना ek fixed sequence involve karता hai: naam ko ek IP par resolve karो, ek TCP connection kholो, TLS negotiate karो, ek HTTP request bhejो, aur aksar application ke ise dekhने se pehle ek load balancer aur ek reverse proxy se pass karो. Sequence jaanna wo jaanna hai ki jab ye break hoता hai to kahaan dekhना hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Sending a courier to a company you only know by name.** First you look the company up in a directory to get a street address (DNS). Then the courier drives there and knocks — and waits for someone to open the door and confirm they are ready to receive a package (the TCP handshake). Before handing anything over, both sides show ID and agree on a sealed pouch so nobody in between can read the contents (TLS). Only then does the courier hand over the actual letter with its "to" and "subject" lines (the HTTP request). And often the address is not the company itself but a mailroom that sorts the letter to the right floor and desk (the load balancer and reverse proxy). Every one of those steps can fail, and each fails in its own recognisable way.',
      hi: '**Ek company ko ek courier bhejna jise aap sirf naam se jानते ho.** Pehle aap company ko ek directory mein look up karते ho ek street address paने ke liye (DNS). Phir courier wahaan drive karता hai aur knock karта hai — aur kisi ke door kholने aur confirm karने ka wait karта hai ki wo ek package receive karने ke liye ready hain (TCP handshake). Kुछ hand karने se pehle, dono sides ID dikhाते hain aur ek sealed pouch par agree karते hain (TLS). Sirf tab courier actual letter iski "to" aur "subject" lines ke saath hand karता hai (HTTP request). Aur aksar address company khud nahi balki ek mailroom hai jo letter ko sahi floor aur desk par sort karता hai (load balancer aur reverse proxy).',
    },

    simple: `**THE PATH OF A REQUEST — https://api.example.com/orders**
\`\`\`
1. DNS RESOLUTION   api.example.com  ->  203.0.113.10   (Module 3, Lesson 3)
2. TCP HANDSHAKE    SYN -> SYN-ACK -> ACK   (3 packets; now a connection exists)
3. TLS HANDSHAKE    ClientHello -> ServerHello + cert -> key exchange -> Finished
                    (the server proves it owns api.example.com; a shared key is set up)
4. HTTP REQUEST     GET /orders HTTP/2   Host: api.example.com   Authorization: ...
5. LOAD BALANCER    picks one healthy backend (of N), forwards the request
6. REVERSE PROXY    terminates TLS, routes /orders -> the orders service, adds
                    X-Forwarded-For, rate-limits, serves cache hits
7. APPLICATION      finally runs your handler. sends a response back up the chain.
\`\`\`

**THE LAYERS (TCP/IP model) — each wraps the one above:**
\`\`\`
APPLICATION  | HTTP, gRPC, DNS, SSH        "what" is being said
TRANSPORT    | TCP (reliable, ordered) / UDP (fast, best-effort) — PORTS live here
INTERNET     | IP — addressing + routing between networks. IP ADDRESSES live here.
LINK         | Ethernet / Wi-Fi — the physical hop to the next device. MAC addresses.
\`\`\`
A URL is application-layer; a port is transport-layer; an IP is internet-layer.
"Connection refused" = transport (nothing listening). "Name not resolved" = DNS
(application). "No route to host" = internet layer.

**WHERE FAILURES SHOW UP:**
\`\`\`
DNS fails        | "could not resolve host" / NXDOMAIN
TCP fails        | "connection refused" (port closed) / "connection timed out" (firewall / host down)
TLS fails        | "certificate has expired" / "self-signed" / "hostname mismatch" / "unknown CA"
HTTP 5xx         | the app or an upstream errored (reached the server, it broke)
HTTP 502/503/504 | the PROXY couldn't reach a healthy backend / backend too slow
\`\`\`

**curl -v is the single best tool** — it prints every step: the resolved IP, the TCP
connect, the full TLS handshake + cert, the request headers, the response headers.`,

    simpleHi: `**EK REQUEST KA PATH — https://api.example.com/orders**
\`\`\`
1. DNS RESOLUTION   api.example.com  ->  203.0.113.10
2. TCP HANDSHAKE    SYN -> SYN-ACK -> ACK   (3 packets)
3. TLS HANDSHAKE    ClientHello -> ServerHello + cert -> key exchange -> Finished
4. HTTP REQUEST     GET /orders HTTP/2   Host: api.example.com
5. LOAD BALANCER    ek healthy backend pick karता hai, request forward karता hai
6. REVERSE PROXY    TLS terminate karता hai, /orders route karता hai, X-Forwarded-For add karता hai
7. APPLICATION      aakhirkar aapка handler run karता hai
\`\`\`

**LAYERS (TCP/IP model):**
\`\`\`
APPLICATION  | HTTP, gRPC, DNS, SSH
TRANSPORT    | TCP / UDP — PORTS yahaan rehते hain
INTERNET     | IP — addressing + routing. IP ADDRESSES yahaan.
LINK         | Ethernet / Wi-Fi — next device ka physical hop.
\`\`\`
"Connection refused" = transport (kुछ listen nahi kar raha). "Name not resolved" = DNS.
"No route to host" = internet layer.

**FAILURES KAHAAN DIKHTE HAIN:**
\`\`\`
DNS fails        | "could not resolve host" / NXDOMAIN
TCP fails        | "connection refused" (port closed) / "connection timed out" (firewall / host down)
TLS fails        | "certificate expired" / "self-signed" / "hostname mismatch" / "unknown CA"
HTTP 5xx         | app ya upstream errored
HTTP 502/503/504 | PROXY ek healthy backend tak nahi pahunch saka / backend too slow
\`\`\`

**curl -v single best tool hai** — ye har step print karता hai.`,

    content: `## The sequence, in order

When something requests \`https://api.example.com/orders\`, the following happens, always in this order, and a failure at any stage stops the rest:

### 1. DNS resolution

The client needs an IP address to connect to; it has a name. It asks a **resolver** (configured in the OS, or the one your network hands you via DHCP) for the \`A\` (IPv4) or \`AAAA\` (IPv6) record for \`api.example.com\`. The resolver either answers from cache or walks the DNS hierarchy (Lesson 3) and returns, say, \`203.0.113.10\`. If the name has no record, this fails with **NXDOMAIN**; if the resolver is unreachable, it times out. Nothing else can happen until a name resolves.

### 2. TCP handshake

The client opens a **TCP connection** to \`203.0.113.10\` on port **443** (the default for HTTPS). TCP is connection-oriented: a three-packet exchange establishes it — the client sends **SYN**, the server replies **SYN-ACK**, the client sends **ACK**. Now both sides have agreed sequence numbers and a connection exists. If nothing is listening on port 443, the server's OS replies with a TCP **RST** and the client reports **connection refused** immediately. If a firewall silently drops the SYN, the client gets no reply and reports **connection timed out** after ~tens of seconds.

### 3. TLS handshake

Over the fresh TCP connection, the client and server negotiate **TLS** (the \`S\` in HTTPS):

- The client sends a **ClientHello** listing the TLS versions and cipher suites it supports, and — crucially — the **SNI** (Server Name Indication) field carrying \`api.example.com\`, so a server hosting many sites on one IP knows which certificate to present.
- The server replies with a **ServerHello** choosing the version and cipher, and its **certificate chain** (Lesson 4).
- The client **validates the certificate**: it is signed (transitively) by a CA the client trusts, it is not expired, and one of its names matches \`api.example.com\`. Any failure here aborts with a specific error.
- A key exchange (ECDHE) establishes a **shared symmetric key** without ever sending it. From here the connection is encrypted.

TLS 1.3 does this in **one round trip**; TLS 1.2 took two.

### 4. HTTP request

Now, inside the encrypted tunnel, the client sends an **HTTP request**:

\`\`\`
GET /orders HTTP/2
:authority: api.example.com
authorization: Bearer eyJ...
accept: application/json
\`\`\`

The **Host** header (HTTP/1.1) or **:authority** pseudo-header (HTTP/2) tells the server which site the request is for — again necessary because one server/IP serves many hostnames. The server processes the request and sends a **response**: a status line (\`HTTP/2 200\`), headers, and a body.

### 5. Load balancer

In production, \`203.0.113.10\` is almost never the application server. It is a **load balancer** — a device or managed service that accepts the connection and forwards it to **one of several identical backend servers**, chosen by an algorithm (round-robin, least-connections, etc.), and only among backends that are currently passing **health checks**. This is how a service runs on many machines behind one address, survives a machine failing, and scales by adding machines. (Module 3, Lesson 5; Module 11 for deployment.)

### 6. Reverse proxy

The request often then hits a **reverse proxy** (nginx, Caddy, Envoy, or the ingress controller in Kubernetes) that sits in front of the application and:

- **terminates TLS** (decrypts, so the app speaks plain HTTP internally);
- **routes by path or host** — \`/orders\` to the orders service, \`/users\` to the users service;
- adds forwarding headers (**X-Forwarded-For** = the original client IP, **X-Forwarded-Proto** = \`https\`) so the app, which now sees a connection from the proxy, can still know the real client;
- applies **rate limiting**, request-size limits, and timeouts;
- serves **cached** responses and static files without touching the app;
- **compresses** responses.

### 7. The application

Finally the request reaches your handler. It does its work — queries a database, calls another service — and returns a response that travels back up the same chain: app → proxy → load balancer → TLS re-encryption → TCP → client.

## The layer model

Every one of those steps belongs to a **layer**. The practical model (TCP/IP, four layers) is:

| Layer | Examples | Unit | Addressed by |
|---|---|---|---|
| **Application** | HTTP, gRPC, DNS, SSH, SMTP | message / request | a URL, a hostname |
| **Transport** | **TCP** (reliable, ordered, connection), **UDP** (fast, connectionless) | segment / datagram | a **port** (0–65535) |
| **Internet** | **IP** (v4 / v6) | packet | an **IP address** |
| **Link** | Ethernet, Wi-Fi | frame | a MAC address |

Each layer **encapsulates** the one above: an HTTP request is placed inside a TCP segment, which is placed inside an IP packet, which is placed inside an Ethernet frame for each hop. A router looks only at the IP layer; a firewall rule usually acts on IP + port (internet + transport); TLS and HTTP are application-layer concerns the network does not see.

Knowing which layer a symptom belongs to tells you which tool to reach for:

- **"Could not resolve host"** — application layer, DNS. Use \`dig\` / \`nslookup\`.
- **"Connection refused"** — transport layer: the TCP handshake got an RST because nothing is listening on that port. Use \`ss -tlnp\` on the server, check the process is up and bound to the right address.
- **"Connection timed out"** — the SYN got no reply: the host is down, or a firewall (host firewall, cloud security group, network ACL) is dropping the packet. Use \`curl -v\`, check firewall rules.
- **"No route to host"** — internet layer: there is no path to that network. Routing / VPC configuration.
- **TLS errors** (\`certificate has expired\`, \`unable to verify\`, \`hostname mismatch\`) — application layer, TLS. Use \`openssl s_client\` / \`curl -v\`.
- **HTTP 5xx** — you reached the application (or a proxy) and it errored. Read the app logs.
- **HTTP 502 / 503 / 504** — the **proxy or load balancer** could not get a good response from a backend (502 bad gateway, 503 no healthy backend, 504 backend timed out). Check backend health and the proxy's upstream config.

## The one tool: curl -v

\`curl -v https://api.example.com/orders\` prints every stage of the sequence above:

\`\`\`
* Host api.example.com:443 was resolved.
* IPv4: 203.0.113.10
*   Trying 203.0.113.10:443...
* Connected to api.example.com (203.0.113.10) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* Server certificate:
*  subject: CN=api.example.com
*  start date: Jun  1 00:00:00 2024 GMT
*  expire date: Aug 30 23:59:59 2024 GMT
*  subjectAltName: host "api.example.com" matched cert's "api.example.com"
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
* using HTTP/2
> GET /orders HTTP/2
> Host: api.example.com
> authorization: Bearer eyJ...
>
< HTTP/2 200
< content-type: application/json
< x-served-by: orders-svc-7c9f
<
\`\`\`

Reading this top to bottom tells you exactly how far the request got and what the failure was: no "resolved" line → DNS; no "Connected" → TCP; a certificate error → TLS; a \`< HTTP/2 5xx\` → the application. It is the first command to run for any "the site is down" report.`,

    contentHi: `## Sequence, order mein

Jab kुछ \`https://api.example.com/orders\` request karता hai, ye hoता hai, hamesha is order mein, aur kisi bhi stage par ek failure baaki ko stop karता hai:

**1. DNS resolution.** Client ek **resolver** se \`api.example.com\` ke liye \`A\`/\`AAAA\` record maangता hai. Ye cache se answer karता hai ya DNS hierarchy walk karता hai. Koi record nahi = **NXDOMAIN**.

**2. TCP handshake.** Client port **443** par ek **TCP connection** kholता hai. Teen-packet exchange: **SYN** → **SYN-ACK** → **ACK**. Agar 443 par kुछ listen nahi kar raha, server **RST** bhejता hai → **connection refused**. Agar ek firewall SYN drop karता hai → **connection timed out**.

**3. TLS handshake.** Client **ClientHello** bhejता hai **SNI** field ke saath (\`api.example.com\`). Server **ServerHello** + **certificate chain** bhejता hai. Client **certificate validate** karता hai (trusted CA, not expired, naam match). Ek key exchange ek **shared symmetric key** establish karता hai.

**4. HTTP request.** Encrypted tunnel ke andar, client ek **HTTP request** bhejता hai. **Host** header server ko bताता hai kaunसी site ke liye request hai.

**5. Load balancer.** Production mein, \`203.0.113.10\` lagभag kabhi application server nahi. Ye ek **load balancer** hai jo connection accept karता hai aur ise **several identical backend servers** mein se ek ko forward karता hai, sirf un backends mein se jo abhi **health checks** pass kar rahे hain.

**6. Reverse proxy.** Request aksar ek **reverse proxy** (nginx, Caddy, Envoy) hit karता hai jo: **TLS terminate** karता hai, **path/host se route** karता hai, **X-Forwarded-For** add karता hai, **rate limiting** apply karता hai, **cached** responses serve karता hai.

**7. Application.** Aakhirkar request aapके handler tak pahunchती hai.

## Layer model

| Layer | Examples | Addressed by |
|---|---|---|
| **Application** | HTTP, gRPC, DNS, SSH | a URL, a hostname |
| **Transport** | **TCP**, **UDP** | a **port** (0-65535) |
| **Internet** | **IP** (v4/v6) | an **IP address** |
| **Link** | Ethernet, Wi-Fi | a MAC address |

Har layer ऊpar wali ko **encapsulate** karта hai.

- **"Could not resolve host"** — DNS. \`dig\`/\`nslookup\`.
- **"Connection refused"** — transport: 443 par kुछ listen nahi kar raha. \`ss -tlnp\`.
- **"Connection timed out"** — SYN ka koi reply nahi: host down, ya ek firewall drop kar raha.
- **HTTP 5xx** — aap application tak pahunchе aur ye errored.
- **HTTP 502/503/504** — **proxy/load balancer** ek backend se ek good response nahi le saka.

## Ek tool: curl -v

\`curl -v https://api.example.com/orders\` upar ke sequence ka har stage print karता hai: resolved IP, TCP connect, poora TLS handshake + cert, request headers, response headers. Kisi bhi "site down" report ke liye pehla command.`,

    examples: [
      {
        title: 'curl -v: reading the whole request sequence',
        titleHi: 'curl -v: poora request sequence read karna',
        code: `$ curl -v --http2 https://api.example.com/health 2>&1

* Host api.example.com:443 was resolved.
* IPv4: 203.0.113.10                              <- 1. DNS resolved
*   Trying 203.0.113.10:443...
* Connected to api.example.com (203.0.113.10)     <- 2. TCP handshake done
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):  <- 3. TLS negotiating
* Server certificate:
*  subject: CN=api.example.com
*  expire date: Sep 12 09:00:00 2025 GMT
*  subjectAltName: host "api.example.com" matched cert's "api.example.com"
*  issuer: C=US, O=Let's Encrypt, CN=E5
*  SSL certificate verify ok.                     <- 3. cert validated
* using HTTP/2
> GET /health HTTP/2                              <- 4. HTTP request sent
> host: api.example.com
>
< HTTP/2 200                                      <- response
< content-type: text/plain
< x-served-by: edge-lb-2 -> health-svc-9d4c       <- 5/6. via a load balancer + service
<
ok`,
        output: `curl -v narrates the full path in order: DNS resolution ('was resolved' + the IP), the TCP connect ('Connected to'), the TLS handshake and certificate validation ('SSL certificate verify ok'), the HTTP request line and headers ('>'), and the response ('<'). Where the trace stops tells you which layer failed.`,
        explain: 'The verbose output of curl is a step-by-step transcript of the request sequence, and reading it top to bottom is the fastest way to localise a failure. The first lines report DNS: the hostname being resolved and the address it resolved to; if these are absent and the command fails, the problem is name resolution. The next line reports the TCP connection being established; if resolution succeeded but there is no "Connected to" line, the failure is at the transport layer, either a refused connection or a timeout. The block of lines prefixed with an asterisk about the TLS handshake and the server certificate shows the negotiation and, critically, the line stating whether certificate verification succeeded; a failure here is a TLS problem with a specific cause named in the error. The lines beginning with a greater-than sign are the HTTP request headers curl sent, and the lines beginning with a less-than sign are the response status and headers; a 5xx status here means the request reached an application or proxy that then errored. Custom headers added by infrastructure, such as one naming the load balancer and backend that served the response, confirm the request passed through the expected proxy layers. Because the trace is ordered, the point at which it stops or shows an error identifies the layer to investigate.',
        explainHi: 'curl ka verbose output request sequence ka ek step-by-step transcript hai, aur ise upar se neeche read karना ek failure localise karने ka sabse fast tarika hai. Pehli lines DNS report karती hain: hostname resolve ho raha aur wo address jispar ye resolve hua; agar ye absent hain aur command fail hoता hai, problem name resolution hai. Agli line TCP connection establish hote report karती hai; agar resolution succeeded par koi "Connected to" line nahi hai, failure transport layer par hai. TLS handshake aur server certificate ke baare mein asterisk-prefixed lines negotiation dikhाती hain aur critically wo line jo bताती hai ki certificate verification succeed hua ya nahi. Greater-than sign se shuru hone wali lines HTTP request headers hain, aur less-than sign se shuru hone wali lines response status aur headers hain.',
      },
      {
        title: 'The failure signatures at each layer',
        titleHi: 'Har layer par failure signatures',
        code: `# DNS failure — name has no record:
$ curl https://nope.example.invalid
curl: (6) Could not resolve host: nope.example.invalid

# TCP: nothing listening on the port (server up, service down):
$ curl -v http://api.example.com:9999
*   Trying 203.0.113.10:9999...
curl: (7) Failed to connect to api.example.com port 9999: Connection refused

# TCP: SYN dropped by a firewall / security group (silent):
$ curl -v --connect-timeout 5 http://10.0.5.20:8080
*   Trying 10.0.5.20:8080...
curl: (28) Failed to connect ... Connection timed out after 5001 ms

# TLS: expired certificate:
$ curl https://expired.example.com
curl: (60) SSL certificate problem: certificate has expired

# HTTP 5xx — reached the app, it errored:
$ curl -sD- -o /dev/null https://api.example.com/orders
HTTP/2 500
x-request-id: 7f3a...

# HTTP 502/503 — the proxy couldn't reach a healthy backend:
$ curl -sD- -o /dev/null https://api.example.com/
HTTP/2 503
server: nginx
# nginx returned this itself — no backend was available.`,
        output: `Each layer fails in a recognisable way: DNS -> "Could not resolve host"; TCP with a closed port -> "Connection refused" (fast); TCP with a dropped SYN -> "Connection timed out" (slow); TLS -> a specific "SSL certificate problem"; a 5xx from your app -> it ran and errored; a 502/503/504 from the proxy -> no healthy backend / backend too slow.`,
        explain: 'The value of learning these signatures is that the error message alone usually identifies the layer and often the cause, before any further investigation. A "could not resolve host" message means the request never left the name-resolution stage, so the fix is in DNS configuration or the resolver, not in the server. "Connection refused" is a fast, definite failure that means the target host is reachable and responded, but no process is listening on that port, so the service is down or bound to a different address or port. "Connection timed out" is a slow failure that means the SYN packet got no response at all, which points at the host being down or, more often, a firewall or security group silently discarding the packet. A TLS error names its own cause: an expired certificate, a name that does not match, a chain that does not lead to a trusted authority. A 5xx status returned with the application\'s own headers means the request was processed and the application failed, so the application logs hold the answer. A 502, 503, or 504 returned by the proxy itself, identifiable by the proxy\'s server header and the absence of application headers, means the proxy could not obtain a valid response from any backend, so the investigation moves to backend health and the proxy\'s upstream configuration.',
        explainHi: 'In signatures ko seekhने ki value ye hai ki error message akela usually layer identify karता hai aur aksar cause, kisi further investigation se pehle. Ek "could not resolve host" message matlab request kabhi name-resolution stage se nahi nikла. "Connection refused" ek fast, definite failure hai jiska matlab target host reachable hai par koi process us port par listen nahi kar raha. "Connection timed out" ek slow failure hai jiska matlab SYN packet ko koi response nahi mila — ek firewall silently packet discard kar raha. Ek TLS error apna cause name karता hai. Ek 5xx status application ke apne headers ke saath returned matlab request processed hua aur application failed. Ek 502/503/504 proxy dwara khud returned matlab proxy kisi backend se ek valid response nahi le saka.',
      },
    ],

    mistakes: [
      {
        wrong: `# "the API is down" — and jumping straight to restarting the app
$ ssh prod-api-1 'systemctl restart myapp'
# ...still down. restart another. still down. escalate.
# -> 40 minutes later: the app was fine the whole time. the TLS cert had expired
//    at midnight, so every client got 'certificate has expired' and never
//    reached the app. one 'curl -v' would have shown it in 2 seconds.`,
        right: `# ALWAYS run curl -v first — it tells you which layer failed:
$ curl -v https://api.example.com/health 2>&1 | head -30
# no "resolved" line          -> DNS
# no "Connected to" line       -> TCP (refused = fast, timeout = firewall)
# "certificate has expired"    -> TLS — renew the cert, the app is irrelevant
# "< HTTP/2 500"               -> the app — now go read its logs
# "< HTTP/2 503" from nginx     -> the proxy — check backend health`,
        why: 'Treating every "it is down" report as an application problem and beginning by restarting the application skips the diagnosis and often fixes nothing, because a request can fail at any of several layers before it ever reaches the application. Name resolution can fail, the transport connection can be refused or time out, the TLS handshake can be rejected because a certificate expired or a name does not match, or a proxy in front can be unable to reach any backend. In each of those cases the application is running normally and restarting it changes nothing, while the real cause sits unaddressed. Running a verbose request first produces an ordered trace of exactly how far the request got: which layer completed and which one failed, with the failure\'s cause usually named in the output. That single step routinely turns a long escalating incident into a two-minute fix, because it directs attention to the layer that is actually broken rather than to the one that is most familiar.',
        whyHi: 'Har "ye down hai" report ko ek application problem ke roop mein treat karना aur application restart karके shuru karना diagnosis skip karता hai aur aksar kुछ fix nahi karता, kyunki ek request kई layers mein se kisi par bhi fail ho sakती hai iske pehle ki ye application tak pahunche. Name resolution fail ho sakти hai, transport connection refused ho sakта hai ya timeout ho sakта hai, TLS handshake reject ho sakта hai kyunki ek certificate expired hai, ya ek proxy kisi backend tak nahi pahunch sakта. In mein se har case mein application normally chal raha hai aur ise restart karना kुछ nahi badalता. Pehle ek verbose request chalाना ek ordered trace produce karता hai.',
      },
      {
        wrong: `# assuming the app sees the real client IP directly
# app code: rate_limit(request.remote_addr)   # remote_addr is the LOAD BALANCER
# -> every request appears to come from 10.0.1.5 (the LB). the rate limiter
//    either throttles ALL traffic as one client, or (if you raised the limit)
//    does nothing. per-client anything is broken behind a proxy.`,
        right: `# trust the forwarded header — but ONLY from your own proxy:
# nginx / LB adds:  X-Forwarded-For: <real client>, <any upstream proxies>
# app: take the RIGHTMOST-that-you-don't-control, or configure a trusted-proxy
#      list so a client can't spoof X-Forwarded-For to bypass rate limits.
client_ip = trusted_forwarded_for(request)   # framework-specific, configured
rate_limit(client_ip)`,
        why: 'When a request passes through a load balancer and a reverse proxy before reaching the application, the network connection the application receives originates from the proxy, not from the end user, so the source address the application observes is the proxy\'s address, the same for every request regardless of who sent it. Any logic keyed on the client identity — per-client rate limiting, geo rules, abuse detection, audit logging — is therefore broken: it either treats all traffic as one client or, if limits were raised to compensate, enforces nothing. The proxy layer solves this by adding a header, conventionally X-Forwarded-For, recording the original client address and the chain of proxies the request traversed. The application must be configured to read the client address from that header instead of from the connection. This must be done carefully, because a client can send its own X-Forwarded-For header, so the application has to trust the header only when the connection comes from a known proxy address and must take the correct entry from the chain, otherwise a client can spoof the header to appear as a different address and evade the controls.',
        whyHi: 'Jab ek request ek load balancer aur ek reverse proxy se pass hoती hai application tak pahunchне se pehle, jo network connection application receive karता hai wo proxy se originate hoता hai, end user se nahi, to jo source address application observe karता hai wo proxy ka address hai, har request ke liye same. Client identity par keyed koi bhi logic — per-client rate limiting, abuse detection — isliye broken hai. Proxy layer ise ek header add karके solve karता hai, conventionally X-Forwarded-For. Application ko us header se client address read karने ke liye configure karना chahiye. Ise carefully karना chahiye, kyunki ek client apna khud ka X-Forwarded-For bhej sakта hai.',
      },
      {
        wrong: `# reading a 502 as "the app crashed" and paging the app team
# -> the app is up and healthy. the 502 came from nginx because nginx's
//    upstream config still points at the OLD backend IPs after a deploy moved
//    the pods. or: the backend's response headers exceeded nginx's buffer.
//    or: the app took longer than proxy_read_timeout. all PROXY-side.`,
        right: `# a 5xx WITHOUT your app's headers, WITH the proxy's 'server:' header, is a
# PROXY problem. check, in order:
#   - can the proxy reach a backend?   (backend health checks, upstream list)
#   - is the backend responding in time? (proxy_read_timeout vs app latency)
#   - are response headers/body within the proxy's buffer limits?
#   - 502 = bad/no response, 503 = no healthy backend, 504 = backend timed out`,
        why: 'A 5xx status can be produced either by the application or by the proxy in front of it, and the two require completely different responses. When the application returns a 5xx, the response carries the application\'s own headers — a request ID it generated, framework or service identifiers — because the application built the response. When the proxy returns a 502, 503, or 504, it is because the proxy could not get a usable response from any backend, so the response carries the proxy\'s server identifier and lacks the application\'s headers entirely, because the application was never involved in producing it. The specific code narrows the cause: 502 means a backend was contacted but its response was invalid or the connection failed mid-response, 503 means no backend was available to try, and 504 means a backend accepted the request but did not respond within the proxy\'s timeout. Diagnosing a proxy 5xx as an application crash sends the wrong team to investigate a healthy application, while the real problem — a stale upstream address list, a timeout shorter than the application\'s real latency, a response exceeding the proxy\'s buffer size, a failed health check removing all backends — remains on the proxy side.',
        whyHi: 'Ek 5xx status ya to application dwara ya iske saamne proxy dwara produce ho sakता hai, aur dono ko completely alag responses chahiye. Jab application ek 5xx return karता hai, response application ke apne headers carry karता hai. Jab proxy ek 502/503/504 return karता hai, ye isliye ki proxy kisi backend se ek usable response nahi le saka, to response proxy ka server identifier carry karता hai aur application ke headers ki poori tarah kami hai. Specific code cause narrow karता hai: 502 matlab ek backend contacted tha par iska response invalid tha, 503 matlab koi backend available nahi tha, 504 matlab ek backend ne request accept ki par proxy ke timeout ke andar respond nahi kiya.',
      },
    ],

    realWorld: [
      {
        en: '**A `curl -v https://$HOST/health` as the literal first line of every incident runbook** — before anyone touches a server, the trace shows which layer failed, and half the "outages" turn out to be an expired cert or a DNS change.',
        hi: '**Har incident runbook ki literal pehli line ke roop mein ek `curl -v https://$HOST/health`** — koi server touch karे iske pehle, trace dikhता hai kaunसी layer failed.',
      },
      {
        en: '**A rate limiter that throttled the whole internet as one client** because it read `remote_addr` (the ALB) instead of the rightmost trusted `X-Forwarded-For` entry — fixed by configuring the framework\'s trusted-proxy list.',
        hi: '**Ek rate limiter jo poore internet ko ek client ke roop mein throttle karता tha** kyunki ye `remote_addr` (ALB) read karता tha.',
      },
      {
        en: '**A 502 storm during a deploy** — the ingress\'s endpoint list lagged the pod IP change by 30s; adding a `preStop` sleep and a readiness gate so old pods drained before terminating removed the gap.',
        hi: '**Ek deploy ke dauran ek 502 storm** — ingress ki endpoint list pod IP change se 30s peeche thi.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through everything that happens between typing a URL and the application seeing the request.',
        qHi: 'Ek URL type karne aur application ke request dekhने ke beech jo kुछ hoता hai walk through karो.',
        a: 'First, DNS resolution: the client has a hostname and needs an IP, so it asks a resolver, which answers from cache or walks the DNS hierarchy and returns an A or AAAA record. Nothing proceeds until a name resolves. Second, the TCP handshake: the client opens a connection to that IP on port 443 for HTTPS, sending a SYN, receiving a SYN-ACK, sending an ACK, after which an ordered reliable connection exists. If nothing listens on the port the client gets a reset and reports connection refused; if a firewall drops the SYN the client times out. Third, the TLS handshake over that connection: the client sends a ClientHello including the SNI field naming the host, the server responds with its chosen parameters and its certificate chain, the client validates the certificate against its trusted authorities, its expiry, and its names, and a key exchange establishes a shared symmetric key so the connection is now encrypted. Fourth, the HTTP request inside the encrypted tunnel, including a Host or authority header identifying which site the request is for. Fifth, in production the IP is a load balancer, which forwards the connection to one of several healthy backend servers chosen by an algorithm. Sixth, often a reverse proxy in front of the application terminates TLS, routes by path or host, adds forwarding headers so the app can still see the real client IP, applies rate limits and timeouts, and serves cache hits. Seventh, the application handler finally runs and its response travels back up the same chain.',
        aHi: 'Pehle, DNS resolution: client ke paas ek hostname hai aur ek IP chahiye, to ye ek resolver se poochता hai, jo cache se answer karता hai ya DNS hierarchy walk karता hai. Doosra, TCP handshake: client us IP par port 443 par ek connection kholता hai, ek SYN bhejता hai, ek SYN-ACK receive karта hai, ek ACK bhejता hai. Teesra, TLS handshake: client ek ClientHello bhejता hai SNI field ke saath, server apni parameters aur apni certificate chain se respond karता hai, client certificate validate karता hai, aur ek key exchange ek shared symmetric key establish karता hai. Chौthा, encrypted tunnel ke andar HTTP request. Paanchवा, production mein IP ek load balancer hai. Chhथा, aksar ek reverse proxy TLS terminate karता hai. Saатवा, application handler aakhirkar run karता hai.',
      },
      {
        q: 'A request fails. How does the error message tell you which layer to investigate?',
        qHi: 'Ek request fail hoती hai. Error message aapको kaise bताता hai kaunसी layer investigate karे?',
        a: 'The message usually names the layer. "Could not resolve host" or an NXDOMAIN means the failure was at name resolution, before any connection was attempted, so the problem is in DNS records or the resolver. "Connection refused" is a fast, definite failure meaning the host is reachable and its operating system responded, but no process is listening on that port, so the service is down, crashed, or bound to a different address or port. "Connection timed out" is a slow failure meaning the SYN packet got no response at all, which points at the host being down or, more commonly, a firewall, security group, or network ACL silently discarding the packet. A TLS error states its own cause: "certificate has expired", "hostname mismatch" meaning no name in the certificate matches the requested host, "unable to verify" or "self-signed" meaning the chain does not lead to a trusted authority. An HTTP 5xx status returned with the application\'s own headers, such as a request ID it generated, means the request reached the application and it errored, so the application logs have the detail. A 502, 503, or 504 returned with a proxy\'s server header and without the application\'s headers means the proxy could not get a valid response from any backend: 502 a bad or failed backend response, 503 no healthy backend to try, 504 a backend that did not respond in time. Running curl with the verbose flag makes this explicit by showing exactly how far the request progressed.',
        aHi: 'Message usually layer name karता hai. "Could not resolve host" matlab failure name resolution par tha. "Connection refused" ek fast failure hai jiska matlab host reachable hai par koi process us port par listen nahi kar raha. "Connection timed out" ek slow failure hai jiska matlab SYN packet ko koi response nahi mila — ek firewall silently packet discard kar raha. Ek TLS error apna cause state karта hai. Ek HTTP 5xx application ke apne headers ke saath matlab request application tak pahunchा aur ye errored. Ek 502/503/504 ek proxy ke server header ke saath matlab proxy kisi backend se ek valid response nahi le saka.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the 7 stages of `https://api.example.com/orders` reaching the app handler, in order, and next to each name one failure and the error message a client would see.',
        taskHi: 'Ek comment mein, `https://api.example.com/orders` ke app handler tak pahunchне ke 7 stages order mein list karो.',
        hint: '1) DNS → no record → "Could not resolve host" / NXDOMAIN. 2) TCP handshake → port closed → "Connection refused"; SYN dropped → "Connection timed out". 3) TLS handshake → "certificate has expired" / "hostname mismatch" / "unable to verify". 4) HTTP request → (app error) "HTTP 500". 5) Load balancer → no healthy backend → "HTTP 503". 6) Reverse proxy → backend too slow → "HTTP 504" from nginx. 7) App handler → its own 5xx with its own headers.',
        hintHi: '1) DNS → "Could not resolve host". 2) TCP → "Connection refused" / "Connection timed out". 3) TLS → "certificate has expired". 4) HTTP → "HTTP 500". 5) LB → "HTTP 503". 6) Proxy → "HTTP 504". 7) App handler.',
      },
      {
        task: 'For each `curl` result, name the layer and the most likely cause: (a) `curl: (6) Could not resolve host`, (b) `curl: (7) Connection refused`, (c) `curl: (28) Connection timed out`, (d) `curl: (60) certificate has expired`, (e) `< HTTP/2 503` with `server: nginx` and no app headers.',
        taskHi: 'Har `curl` result ke liye, layer aur most likely cause batao.',
        hint: '(a) Application/DNS — the name has no record, or your resolver is wrong. (b) Transport — the host is up but nothing is listening on that port (service down / wrong bind). (c) Transport — SYN got no reply: a firewall/security-group/NACL is dropping it, or the host is down. (d) Application/TLS — renew the certificate; the app is fine. (e) Proxy — nginx has no healthy backend (all failed health checks, or a stale upstream list).',
        hintHi: '(a) DNS — naam ka koi record nahi. (b) Transport — kुछ us port par listen nahi kar raha. (c) Transport — SYN ka koi reply nahi (firewall drop). (d) TLS — certificate renew karo. (e) Proxy — nginx ke paas koi healthy backend nahi.',
      },
      {
        task: 'In a comment, explain why an app behind a load balancer + reverse proxy sees every request as coming from the same IP, what header fixes it, and the security caveat when reading that header.',
        taskHi: 'Ek comment mein, samjhाओ ki ek load balancer + reverse proxy ke peeche ek app har request ko same IP se aate hue kyun dekhता hai.',
        hint: 'The app\'s TCP connection originates from the proxy, so `remote_addr` is the proxy\'s IP for every request — per-client rate limiting, geo, abuse detection all break. Fix: the proxy adds `X-Forwarded-For: <real client>, <upstream proxies>`; the app reads the client IP from it. Caveat: a client can send its own `X-Forwarded-For`, so the app must ONLY trust it when the connection comes from a known proxy IP, and take the correct entry from the chain — otherwise clients spoof it to evade limits.',
        hintHi: 'App ka TCP connection proxy se originate hoता hai, to `remote_addr` har request ke liye proxy ka IP hai. Fix: proxy `X-Forwarded-For` add karता hai. Caveat: ek client apna khud ka `X-Forwarded-For` bhej sakта hai, to app ise SIRF tab trust karे jab connection ek known proxy IP se aata hai.',
      },
    ],

    keyTakeaways: [
      'A request to `https://host/path` follows a FIXED SEQUENCE, and a failure at any stage stops the rest: (1) DNS resolution (name → IP); (2) TCP handshake (SYN → SYN-ACK → ACK, on port 443 for HTTPS); (3) TLS handshake (ClientHello w/ SNI → ServerHello + cert chain → client validates cert → key exchange → encrypted); (4) HTTP request (inside the tunnel, with a Host/:authority header); (5) LOAD BALANCER (picks one healthy backend of N); (6) REVERSE PROXY (terminates TLS, routes by path/host, adds X-Forwarded-For, rate-limits, serves cache); (7) the APPLICATION handler.',
      'THE LAYER MODEL (TCP/IP): APPLICATION (HTTP/gRPC/DNS/SSH — addressed by a URL/hostname) → TRANSPORT (TCP reliable/ordered, UDP fast/connectionless — addressed by a PORT 0-65535) → INTERNET (IP v4/v6 — addressed by an IP ADDRESS) → LINK (Ethernet/Wi-Fi — MAC). Each layer ENCAPSULATES the one above. A router sees only IP; a firewall rule acts on IP+port; TLS/HTTP are invisible to the network.',
      'FAILURE SIGNATURES tell you the layer BEFORE you investigate: "Could not resolve host" / NXDOMAIN = DNS (application). "Connection refused" = TRANSPORT, fast — host up, nothing listening on that port (service down / wrong bind). "Connection timed out" = TRANSPORT, slow — SYN got NO reply (firewall/security-group/NACL dropping it, or host down). "certificate has expired" / "hostname mismatch" / "unable to verify" = TLS (application) — the app is irrelevant. HTTP 5xx WITH your app\'s headers = the app ran and errored (read its logs). HTTP 502/503/504 WITH the proxy\'s `server:` header and NO app headers = the PROXY couldn\'t get a good response from a backend (502 bad/failed response, 503 no healthy backend, 504 backend timed out).',
      '`curl -v <url>` is THE first tool — it narrates every stage: the resolved IP ("was resolved"), the TCP connect ("Connected to"), the full TLS handshake + certificate + "SSL certificate verify ok", the request headers (`>`), the response status + headers (`<`). Where the trace STOPS or shows an error IS the broken layer. Run it before touching any server — half of "outages" are an expired cert or a DNS change, and restarting the app fixes neither.',
      'An app behind a LOAD BALANCER + REVERSE PROXY sees the TCP connection as coming FROM THE PROXY, so `remote_addr` is the proxy\'s IP for every request — per-client rate limiting / geo / abuse detection / audit all break. Fix: the proxy adds `X-Forwarded-For: <real client>, <upstream proxies>` (and `X-Forwarded-Proto`); the app reads the client IP from it. SECURITY CAVEAT: a client can send its own `X-Forwarded-For` — the app must trust the header ONLY from a known-proxy connection and take the correct entry, or clients spoof it to evade controls.',
    ],
    keyTakeawaysHi: [
      'Ek request ek FIXED SEQUENCE follow karता hai, aur kisi bhi stage par ek failure baaki ko stop karता hai: (1) DNS resolution; (2) TCP handshake (SYN → SYN-ACK → ACK, port 443); (3) TLS handshake (ClientHello w/ SNI → ServerHello + cert chain → cert validate → key exchange); (4) HTTP request (tunnel ke andar, Host header); (5) LOAD BALANCER; (6) REVERSE PROXY (TLS terminate, route, X-Forwarded-For); (7) APPLICATION handler.',
      'LAYER MODEL: APPLICATION (HTTP/DNS/SSH — URL/hostname) → TRANSPORT (TCP/UDP — PORT 0-65535) → INTERNET (IP — IP ADDRESS) → LINK (Ethernet — MAC). Har layer ऊpar wali ko ENCAPSULATE karता hai.',
      'FAILURE SIGNATURES aapको layer bताते hain: "Could not resolve host" = DNS. "Connection refused" = TRANSPORT, fast — kुछ us port par listen nahi. "Connection timed out" = TRANSPORT, slow — SYN ka KOI reply nahi (firewall drop). "certificate has expired" = TLS. HTTP 5xx aapके app ke headers ke saath = app errored. HTTP 502/503/504 proxy ke `server:` header ke saath = PROXY ek backend se good response nahi le saka.',
      '`curl -v <url>` THE pehla tool hai — ye har stage narrate karता hai: resolved IP, TCP connect, poora TLS handshake + certificate, request headers (`>`), response status + headers (`<`). Trace kahaan RUKता hai wo broken layer HAI. Kisi server ko touch karने se pehle chalाओ.',
      'Ek LOAD BALANCER + REVERSE PROXY ke peeche ek app TCP connection ko PROXY SE aate hue dekhता hai, to `remote_addr` har request ke liye proxy ka IP hai. Fix: proxy `X-Forwarded-For` add karता hai; app ise se client IP read karता hai. SECURITY CAVEAT: ek client apna khud ka `X-Forwarded-For` bhej sakта hai — app ise SIRF ek known-proxy connection se trust karे.',
    ],
  },

  {
    slug: 'ops-ip-addressing-subnets-and-cidr',
    title: 'IP Addressing, Subnets & CIDR',
    titleHi: 'IP Addressing, Subnets Aur CIDR',
    description: 'An IPv4 address is 32 bits, written as four bytes. CIDR notation (10.0.0.0/16) splits it into a network part and a host part at the given bit boundary. This is how you carve a VPC into subnets, size an address range, and decide whether two addresses can talk directly.',
    descriptionHi: 'Ek IPv4 address 32 bits hai, chaar bytes ke roop mein likhа. CIDR notation (10.0.0.0/16) ise ek network part aur ek host part mein diye gaye bit boundary par split karता hai. Ye aise aap ek VPC ko subnets mein carve karते ho, ek address range size karते ho, aur decide karते ho ki do addresses directly baat kar sakते hain ya nahi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A postal system where the address is one long number and a "slash" tells you how much of it is the neighbourhood and how much is the specific house.** \`10.0.0.0/16\` means "the first 16 bits identify this neighbourhood; the remaining 16 bits number the houses within it" — so this neighbourhood has 65,536 possible house numbers. Split it \`/24\` and you get 256 smaller streets of 254 usable houses each. Two houses on the same street can hand a letter to each other directly; a letter to another street has to go through the neighbourhood post office (a router / gateway). The private ranges are like internal mail codes that only work inside a company campus and mean nothing to the outside postal service — which is exactly why a translation desk (NAT) rewrites them on the way out.',
      hi: '**Ek postal system jahaan address ek long number hai aur ek "slash" bताता hai ki iska kitna neighbourhood hai aur kitna specific house.** \`10.0.0.0/16\` matlab "pehle 16 bits is neighbourhood ko identify karते hain; baaki 16 bits ismें houses number karते hain" — to is neighbourhood mein 65,536 possible house numbers hain. Ise \`/24\` split karो aur aapको 256 chhoटी streets milती hain har ek mein 254 usable houses. Ek hi street ke do houses ek doosre ko directly letter hand kar sakते hain; ek doosri street ko letter neighbourhood post office (ek router / gateway) se jाना padता hai. Private ranges internal mail codes ki tarah hain jo sirf ek company campus ke andar kaam karते hain.',
    },

    simple: `**IPv4: 32 bits = four 8-bit "octets".  203.0.113.10  is  11001011.00000000.01110001.00001010**
Range per octet: 0-255. Total: ~4.3 billion addresses (exhausted — hence NAT + IPv6).

**CIDR notation:  <address>/<prefix-length>  — the prefix = how many leading bits are the NETWORK.**
\`\`\`
10.20.30.0/24   | first 24 bits = network (10.20.30) ; last 8 = host (0-255)
                | netmask 255.255.255.0 ; 256 addresses ; 254 USABLE
                | (.0 = network id, .255 = broadcast — not assignable)
10.0.0.0/16     | 65,536 addresses ; 65,534 usable ; netmask 255.255.0.0
10.0.0.0/8      | 16,777,216 addresses ; the whole 10.x.x.x block
0.0.0.0/0       | "everything" — the default route
/32             | exactly one address (a single host, e.g. in a firewall rule)
\`\`\`
Smaller prefix number = BIGGER network. Each -1 to the prefix DOUBLES the size.
usable hosts = 2^(32 - prefix) - 2   (the -2 for network id + broadcast)

**PRIVATE RANGES (RFC 1918) — not routable on the public internet, reused everywhere:**
\`\`\`
10.0.0.0/8         | 10.0.0.0     - 10.255.255.255     (16.7M — big VPCs / data centres)
172.16.0.0/12      | 172.16.0.0   - 172.31.255.255     (1M — Docker's default is in here)
192.168.0.0/16     | 192.168.0.0  - 192.168.255.255    (65K — home routers)
\`\`\`
Also: 127.0.0.0/8 = loopback (localhost) ; 169.254.0.0/16 = link-local (no DHCP).

**SAME SUBNET = talk DIRECTLY (link layer). DIFFERENT SUBNET = via a ROUTER / gateway.**
\`(addr_A AND mask) == (addr_B AND mask)\`  ->  same subnet.

**SUBNETTING a VPC:  10.0.0.0/16  ->**
\`\`\`
10.0.0.0/24    public subnet, AZ-a   (has a route to an internet gateway)
10.0.1.0/24    public subnet, AZ-b
10.0.10.0/24   private subnet, AZ-a  (no direct internet; outbound via a NAT gateway)
10.0.11.0/24   private subnet, AZ-b
\`\`\`

**NAT (Network Address Translation):** many private addresses share one public address
on the way out; the NAT device rewrites source IP+port and remembers the mapping so
replies get back to the right host. This is why your laptop and your phone both "are"
the same public IP to a website.

**IPv6:** 128 bits, hex, \`2001:db8::/32\`. So many addresses that NAT is unnecessary;
every device can have a globally-unique address. Adoption is partial; you will meet both.`,

    simpleHi: `**IPv4: 32 bits = chaar 8-bit "octets".  203.0.113.10.  Range per octet: 0-255.**
Total: ~4.3 billion (exhausted — hence NAT + IPv6).

**CIDR notation:  <address>/<prefix-length>  — prefix = kitne leading bits NETWORK hain.**
\`\`\`
10.20.30.0/24   | pehle 24 bits = network ; last 8 = host. 256 addresses ; 254 USABLE
                | (.0 = network id, .255 = broadcast)
10.0.0.0/16     | 65,536 addresses ; 65,534 usable
0.0.0.0/0       | "everything" — default route
/32             | exactly ek address
\`\`\`
Chhoटा prefix number = BADA network. Prefix ko har -1 size DOUBLE karता hai.
usable hosts = 2^(32 - prefix) - 2

**PRIVATE RANGES (RFC 1918) — public internet par routable nahi:**
\`\`\`
10.0.0.0/8         | 16.7M — big VPCs / data centres
172.16.0.0/12      | 1M — Docker ka default ismें hai
192.168.0.0/16     | 65K — home routers
\`\`\`
Also: 127.0.0.0/8 = loopback ; 169.254.0.0/16 = link-local.

**SAME SUBNET = DIRECTLY baat karो. DIFFERENT SUBNET = ek ROUTER / gateway se.**
\`(addr_A AND mask) == (addr_B AND mask)\`  ->  same subnet.

**EK VPC SUBNET karना:  10.0.0.0/16  ->**
\`\`\`
10.0.0.0/24    public subnet, AZ-a   (internet gateway ka route)
10.0.10.0/24   private subnet, AZ-a  (koi direct internet nahi; outbound ek NAT gateway se)
\`\`\`

**NAT:** bahut private addresses ek public address share karते hain; NAT device source
IP+port rewrite karता hai aur mapping remember karता hai. Isliye aapка laptop aur phone
dono ek website ko same public IP "hain".

**IPv6:** 128 bits, hex, \`2001:db8::/32\`. Itne addresses ki NAT unnecessary hai.`,

    content: `## The address

An **IPv4 address** is a 32-bit number, written for humans as four decimal **octets** (each 0–255) separated by dots. \`203.0.113.10\` is \`11001011 00000000 01110001 00001010\` in binary. There are about 4.3 billion possible IPv4 addresses, which ran out years ago — the two consequences you deal with daily are **NAT** (sharing public addresses) and **IPv6** (a vastly larger address space).

## CIDR: splitting an address into network and host

An address by itself does not tell you which network it belongs to. **CIDR** (Classless Inter-Domain Routing) notation adds a **prefix length**: \`10.20.30.0/24\` means "the first **24 bits** are the **network** identifier; the remaining \`32 − 24 = 8\` bits number the **hosts** within that network".

- The **/24** corresponds to a **netmask** of \`255.255.255.0\` — the bits that are 1 mark the network part.
- The network has \`2^8 = 256\` addresses (\`10.20.30.0\` through \`10.20.30.255\`), of which **254 are usable**: \`10.20.30.0\` is the **network identifier** and \`10.20.30.255\` is the **broadcast address**, neither of which is assigned to a host.
- General formula: a \`/n\` network has \`2^(32−n)\` addresses and \`2^(32−n) − 2\` usable host addresses.

Common prefixes:

| CIDR | Addresses | Usable | Netmask | Typical use |
|---|---|---|---|---|
| \`/32\` | 1 | 1 | 255.255.255.255 | a single host (firewall rule, route) |
| \`/24\` | 256 | 254 | 255.255.255.0 | one subnet |
| \`/20\` | 4,096 | 4,094 | 255.255.240.0 | a medium subnet |
| \`/16\` | 65,536 | 65,534 | 255.255.0.0 | a VPC or a large subnet |
| \`/8\` | 16,777,216 | — | 255.0.0.0 | a whole /8 block (e.g. all of 10.x) |
| \`/0\` | everything | — | 0.0.0.0 | the default route |

**A smaller prefix number means a bigger network.** Reducing the prefix by 1 doubles the address count; increasing it by 1 halves it. So \`/16\` is 256 times bigger than \`/24\`.

## Are two addresses on the same subnet?

Two hosts are on the **same subnet** — and can exchange packets **directly** at the link layer, without a router — if their addresses have the **same network part** under the subnet's mask. The test is: \`(address_A AND mask) == (address_B AND mask)\`.

- \`10.20.30.5\` and \`10.20.30.200\` under \`/24\`: both have network \`10.20.30.0\` → same subnet, talk directly.
- \`10.20.30.5\` and \`10.20.31.5\` under \`/24\`: networks \`10.20.30.0\` vs \`10.20.31.0\` → different subnets, traffic goes via the **default gateway** (a router).

This is why a misconfigured netmask breaks connectivity in a confusing way: two hosts that *should* be on the same subnet compute different network parts, so each tries to route to the other through a gateway that may not have a path.

## Private address ranges (RFC 1918)

Three ranges are reserved for **private use** — they are **not routable on the public internet**, so everyone reuses them internally:

| Range | CIDR | Size | Where you see it |
|---|---|---|---|
| \`10.0.0.0\` – \`10.255.255.255\` | \`10.0.0.0/8\` | 16.7M | Cloud VPCs, data centres, Kubernetes pod networks |
| \`172.16.0.0\` – \`172.31.255.255\` | \`172.16.0.0/12\` | 1M | Docker's default bridge (\`172.17.0.0/16\`) |
| \`192.168.0.0\` – \`192.168.255.255\` | \`192.168.0.0/16\` | 65K | Home and small-office routers |

Also reserved: **\`127.0.0.0/8\`** — loopback (\`127.0.0.1\` = \`localhost\`, never leaves the host); **\`169.254.0.0/16\`** — link-local, auto-assigned when DHCP fails (seeing a \`169.254.x.x\` address means "I couldn't get an IP"); **\`0.0.0.0\`** — "all addresses" / "any interface" when binding a socket, or the unspecified address.

## Subnetting a cloud network

A cloud **VPC** (Virtual Private Cloud) is given a CIDR block, say \`10.0.0.0/16\`, and you carve it into **subnets**, each a smaller CIDR, each placed in one **availability zone**:

\`\`\`
VPC 10.0.0.0/16
  ├─ 10.0.0.0/24    public  subnet, AZ-a   route to Internet Gateway
  ├─ 10.0.1.0/24    public  subnet, AZ-b   route to Internet Gateway
  ├─ 10.0.10.0/24   private subnet, AZ-a   route to NAT Gateway (outbound only)
  ├─ 10.0.11.0/24   private subnet, AZ-b   route to NAT Gateway
  └─ 10.0.20.0/24   database subnet, AZ-a  no internet route at all
\`\`\`

- **Public** subnets have a route to an **internet gateway**, so resources there can have public IPs and be reached from outside — load balancers, bastion hosts.
- **Private** subnets have no inbound internet route; for outbound (pulling updates, calling APIs) they route through a **NAT gateway** that lives in a public subnet. Application servers go here.
- **Database** subnets often have no internet route at all — reachable only from within the VPC.

You size the subnet CIDRs for expected growth: a \`/24\` per subnet gives 251 usable addresses (cloud providers also reserve a few), which is fine for most, but a pod-per-IP Kubernetes cluster can exhaust a \`/24\` fast and needs a \`/20\` or bigger. Subnet CIDRs within a VPC **must not overlap**, and picking a VPC CIDR that overlaps with an on-prem network or another VPC you will peer with is a painful mistake to unwind.

## NAT

**Network Address Translation** lets many hosts with private addresses share a smaller number of public addresses. On the way out, the NAT device **rewrites the source IP and source port** of each packet to its own public address and a port it allocates, and records the mapping \`(private IP, private port) ↔ (public IP, public port)\`. When a reply arrives for that public port, it looks up the mapping and rewrites the destination back to the private host. This is why your laptop and your phone both appear as the same public IP to a website, and why a host behind NAT can make outbound connections but cannot receive unsolicited inbound ones (there is no mapping until the host initiates).

- **SNAT** (source NAT) is the outbound case above.
- **DNAT** (destination NAT) / **port forwarding** rewrites the *destination* of inbound packets — how a router sends traffic on its public port 443 to an internal server, and how a Kubernetes \`NodePort\` service works.

## IPv6, briefly

An **IPv6** address is **128 bits**, written as eight groups of four hex digits, with \`::\` collapsing one run of zero groups: \`2001:db8:85a3::8a2e:370:7334\`. The address space is so large (\`3.4 × 10^38\`) that every device can have a globally unique address and **NAT is unnecessary**. Prefixes work the same way (\`2001:db8::/32\`), just with more bits. Adoption is partial and uneven, so you will encounter dual-stack environments (both v4 and v6) and IPv4-only ones for a long time yet; the CIDR concepts transfer directly.`,

    contentHi: `## Address

Ek **IPv4 address** ek 32-bit number hai, humans ke liye chaar decimal **octets** (har 0-255) ke roop mein likhа. Lagभag 4.3 billion possible IPv4 addresses hain, jo saalon pehle khatam ho gaye — do consequences: **NAT** aur **IPv6**.

## CIDR: address ko network aur host mein split karना

**CIDR** notation ek **prefix length** add karता hai: \`10.20.30.0/24\` matlab "pehle **24 bits** **network** identifier hain; baaki 8 bits us network ke andar **hosts** number karते hain".

- **/24** ek **netmask** \`255.255.255.0\` correspond karता hai.
- Network mein \`2^8 = 256\` addresses hain, jinmें se **254 usable** hain: \`.0\` = **network identifier**, \`.255\` = **broadcast address**.
- Formula: ek \`/n\` network mein \`2^(32-n)\` addresses aur \`2^(32-n) - 2\` usable host addresses.

**Ek chhoटा prefix number matlab ek baड़ा network.** Prefix ko 1 se kम karना address count double karता hai.

## Kya do addresses same subnet par hain?

Do hosts **same subnet** par hain — aur **directly** baat kar sakते hain, ek router ke bina — agar unke addresses ka subnet ke mask ke under **same network part** hai. Test: \`(address_A AND mask) == (address_B AND mask)\`.

## Private address ranges (RFC 1918)

| Range | Size | Kahaan |
|---|---|---|
| \`10.0.0.0/8\` | 16.7M | Cloud VPCs, data centres, K8s pod networks |
| \`172.16.0.0/12\` | 1M | Docker ka default bridge |
| \`192.168.0.0/16\` | 65K | Home routers |

Also: **\`127.0.0.0/8\`** loopback ; **\`169.254.0.0/16\`** link-local (DHCP fail).

## Ek cloud network subnet karना

Ek **VPC** ko ek CIDR block diya jाता hai (\`10.0.0.0/16\`), aur aap ise **subnets** mein carve karते ho, har ek ek **availability zone** mein:
- **Public** subnets ka ek **internet gateway** ka route hai.
- **Private** subnets ka koi inbound internet route nahi; outbound ke liye ek **NAT gateway** se route karते hain.
- Subnet CIDRs ek VPC ke andar **overlap NAHI honा chahiye**.

## NAT

**NAT** bahut hosts ko private addresses ke saath ek chhoटी sankhya ke public addresses share karने deता hai. Way out par, NAT device har packet ka **source IP aur source port rewrite karता hai** aur mapping record karता hai. Isliye aapका laptop aur phone dono ek website ko same public IP appear karते hain, aur ek host NAT ke peeche outbound connections kar sakта hai par unsolicited inbound receive nahi kar sakта.

## IPv6, briefly

Ek **IPv6** address **128 bits** hai, hex mein, \`::\` ek run of zero groups collapse karता hai. Address space itna large hai ki **NAT unnecessary hai**. CIDR concepts directly transfer karते hain.`,

    examples: [
      {
        title: 'CIDR math: network, range, size, and membership',
        titleHi: 'CIDR math: network, range, size, aur membership',
        code: `# VERIFY
ip2int() { local a b c d; IFS=. read -r a b c d <<< "$1"; echo $(( (a<<24)|(b<<16)|(c<<8)|d )); }
int2ip() { local n=$1; echo "$(( (n>>24)&255 )).$(( (n>>16)&255 )).$(( (n>>8)&255 )).$(( n&255 ))"; }

cidr="10.20.30.0/24"
net=\${cidr%/*}; bits=\${cidr#*/}
mask=$(( 0xFFFFFFFF << (32-bits) & 0xFFFFFFFF ))
ni=$(ip2int "$net")
first=$(( (ni & mask) + 1 ))
last=$(( ((ni & mask) | (~mask & 0xFFFFFFFF)) - 1 ))
usable=$(( (1 << (32-bits)) - 2 ))

printf 'network:    %s/%s\\n' "$(int2ip $(( ni & mask )))" "$bits"
printf 'netmask:    %s\\n' "$(int2ip "$mask")"
printf 'first host: %s\\n' "$(int2ip "$first")"
printf 'last host:  %s\\n' "$(int2ip "$last")"
printf 'usable:     %s\\n' "$usable"

in_cidr() { local t; t=$(ip2int "$1"); [[ $(( t & mask )) -eq $(( ni & mask )) ]]; }
for ip in 10.20.30.1 10.20.30.254 10.20.31.5 10.20.30.255; do
  in_cidr "$ip" && echo "$ip -> in $cidr" || echo "$ip -> NOT in $cidr"
done`,
        output: `network:    10.20.30.0/24
netmask:    255.255.255.0
first host: 10.20.30.1
last host:  10.20.30.254
usable:     254
10.20.30.1 -> in 10.20.30.0/24
10.20.30.254 -> in 10.20.30.0/24
10.20.31.5 -> NOT in 10.20.30.0/24
10.20.30.255 -> in 10.20.30.0/24`,
        explain: 'The calculation converts the dotted address to its 32-bit integer form, builds the netmask by shifting a full set of ones left by the number of host bits, and applies it. Bitwise-ANDing an address with the mask clears the host bits and leaves the network identifier, so the network of the /24 is 10.20.30.0 and the mask is 255.255.255.0. The first usable host is the network identifier plus one, and the last is the broadcast address minus one, which for a /24 gives 10.20.30.1 through 10.20.30.254, a count of 254 — the total 256 minus the network identifier and the broadcast address. The membership test is the same operation applied to two addresses: an address is inside the CIDR block exactly when its address AND the mask equals the block\'s network identifier. So 10.20.30.1 and 10.20.30.254 are inside, 10.20.31.5 is not because its third octet differs and the /24 mask covers all of it, and 10.20.30.255 tests as inside the block because it shares the network part even though it is the broadcast address and not assignable to a host. This bitwise membership test is exactly what a host uses to decide whether to send a packet directly or hand it to the default gateway.',
        explainHi: 'Calculation dotted address ko iske 32-bit integer form mein convert karता hai, netmask banаता hai ones ke ek full set ko host bits ki sankhya se left shift karके, aur ise apply karता hai. Ek address ko mask ke saath bitwise-AND karना host bits clear karता hai aur network identifier chhoड़ता hai, to /24 ka network 10.20.30.0 hai. Pehla usable host network identifier plus ek hai, aur last broadcast address minus ek hai. Membership test wahi operation do addresses par applied hai: ek address CIDR block ke andar hai exactly jab iska address AND mask block ke network identifier ke barabar hai. Ye bitwise membership test exactly wo hai jo ek host istemal karता hai decide karने ke liye ki ek packet directly bhejना hai ya ise default gateway ko hand karना.',
      },
      {
        title: 'Sizing subnets when carving a VPC',
        titleHi: 'Ek VPC carve karte samay subnets size karna',
        code: `# VPC: 10.0.0.0/16  (65,536 addresses)
# plan: 2 AZs x { public, private, database } = 6 subnets

# option A — /24 per subnet (256 addrs, ~251 usable after cloud reservations):
#   10.0.0.0/24    public-a       10.0.1.0/24    public-b
#   10.0.10.0/24   private-a      10.0.11.0/24   private-b
#   10.0.20.0/24   database-a     10.0.21.0/24   database-b
#   -> uses 6 x /24 out of 256 available /24s. huge room to grow.
#   -> FINE for LBs, DBs, and VMs. NOT fine for a Kubernetes cluster that
#      assigns one IP per pod — 251 pods per subnet fills fast.

# option B — bigger private subnets for a pod-per-IP CNI:
#   10.0.0.0/24     public-a        10.0.1.0/24     public-b       (LBs, NAT GWs)
#   10.0.64.0/19    private-a       10.0.96.0/19    private-b      (8,190 IPs each — pods)
#   10.0.128.0/24   database-a      10.0.129.0/24   database-b

# RULE: subnets within a VPC must NOT overlap. and the VPC CIDR must not overlap
#       an on-prem range or a VPC you'll peer with — that can't be fixed later
#       without re-addressing everything.`,
        output: `A /24 subnet gives ~251 usable addresses (cloud providers reserve ~5), which is plenty for load balancers, databases, and VMs but is quickly exhausted by a Kubernetes cluster that assigns an IP per pod - those need /20 or larger private subnets. Subnet CIDRs must not overlap within a VPC, and the VPC CIDR must not overlap any network it will connect to.`,
        explain: 'Choosing subnet sizes is a capacity-planning decision made when the network is created, and it is expensive to change later because addresses are assigned from it and routing depends on it. A standard subnet size of a /24 provides around 251 usable addresses after the cloud provider takes a handful for its own use, which comfortably covers the number of load balancers, database instances, and virtual machines a typical deployment runs in one availability zone. The case where this is inadequate is a container platform that gives every workload instance its own address from the subnet rather than sharing the host\'s address, because the address count then scales with the number of running containers rather than the number of machines, and a few hundred is not many. Such platforms need private subnets sized a /20 or larger. Two constraints are absolute. Subnets within one virtual network must have non-overlapping CIDR ranges, or routing within the network is ambiguous. And the virtual network\'s own CIDR must not overlap with any other network it will be connected to, whether an on-premises range reached over a VPN or another virtual network it will be peered with, because overlapping ranges make it impossible to route unambiguously between them and the only remedy is to re-address one side.',
        explainHi: 'Subnet sizes choose karना ek capacity-planning decision hai jo network create hone par kiya jाता hai, aur baad mein change karना mehnga hai. Ek /24 ki standard subnet size lagभag 251 usable addresses provide karती hai. Wo case jahaan ye inadequate hai ek container platform hai jo har workload instance ko iska apna address deता hai, kyunki address count phir running containers ki sankhya se scale karता hai. Aisे platforms ko /20 ya baड़ी private subnets chahiye. Do constraints absolute hain: ek virtual network ke andar subnets ki non-overlapping CIDR ranges honी chahiye; aur virtual network ka apna CIDR kisi bhi doosre network ke saath overlap NAHI honा chahiye jise ye connect kiya jaega.',
      },
    ],

    mistakes: [
      {
        wrong: `# picking a VPC CIDR that overlaps with the corporate network
# corp on-prem: 10.0.0.0/8 (everything)
# new VPC:      10.20.0.0/16   <- inside 10.0.0.0/8
# later: set up a VPN / Direct Connect to the corp network.
# -> routing is now ambiguous. is 10.20.5.10 the on-prem host or the VPC host?
//    the VPN can't carry that range. you re-address the entire VPC. weeks.`,
        right: `# check what ranges are ALREADY in use across every network you might ever
# connect, and carve a non-overlapping slice:
#   corp uses 10.0.0.0/8 broadly -> take a VPC CIDR OUTSIDE it:
#   VPC:  172.31.0.0/16   or   192.168.0.0/20   or a carved 100.64.0.0/16
# document the allocation in one place (an IPAM tool or a spreadsheet) so the
# NEXT VPC doesn't collide either.`,
        why: 'When two networks are connected, whether by a VPN, a dedicated link, or cloud network peering, a host in one must be able to send a packet to a host in the other, and the routing that makes this work assumes that each address belongs unambiguously to one network. If the two networks use CIDR ranges that overlap, an address in the overlapping region exists in both, and there is no way to route to it correctly: a packet for that address could belong to either side. Connectivity for the overlapping range simply cannot be established, and often the connection cannot be brought up at all. Because addresses are assigned from the network\'s CIDR and baked into configuration, DNS, firewall rules, and application settings throughout, the only fix is to choose a new non-overlapping range and re-address everything on one side, which is a large disruptive project. The prevention is to treat address allocation as a deliberate, documented decision: before creating a network, determine every range already in use across all networks it might ever connect to, and select a block that does not overlap any of them, recording the allocation so future networks avoid it too.',
        whyHi: 'Jab do networks connected hoते hain, ek mein ek host ko doosरे mein ek host ko ek packet bhejने mein saksham honा chahiye, aur jo routing ise kaam karता hai wo assume karता hai ki har address unambiguously ek network se belong karता hai. Agar do networks overlapping CIDR ranges istemal karते hain, overlapping region mein ek address dono mein exist karता hai, aur ise correctly route karने ka koi tarika nahi. Kyunki addresses network ke CIDR se assigned hain aur configuration mein baked hain, ekmatra fix ek naya non-overlapping range choose karना aur ek side par sab кुछ re-address karना hai.',
      },
      {
        wrong: `# a firewall / security-group rule using the wrong prefix
# intent: "allow the app subnet 10.0.10.0/24 to reach the DB on 5432"
# typo:   allow  10.0.10.0/16  ->  DB:5432
# -> /16 is 256x bigger. you just allowed 10.0.0.0 - 10.0.255.255 — the ENTIRE
//    VPC, including public subnets and anything peered — to reach the database.`,
        right: `# be exact with the prefix, and prefer referencing the resource, not a raw CIDR:
#   allow  source = <app-subnet-id or app-security-group>  ->  DB:5432
# if you must use a CIDR, double-check: /24 = one subnet, /16 = the whole VPC.
# 'usable hosts = 2^(32-prefix) - 2' — sanity-check the count against intent.`,
        why: 'A firewall or security-group rule specifies the source it permits as a CIDR range, and the prefix length in that CIDR determines how large the permitted range is, with each reduction of the prefix by one doubling the number of source addresses allowed. A rule intended to permit a single subnet, a /24 covering 256 addresses, becomes a rule permitting 256 times that range if the prefix is mistyped as /16, which in a typical virtual network is the entire network and everything routed to it. The permitted set is now vastly wider than intended, and because the rule appears to work — the intended source is still allowed — the over-permission is easy to miss until a security review or an incident. Being precise about the prefix is essential, and the count formula, usable addresses equal two to the power of thirty-two minus the prefix, minus two, is a quick check against intent: a /24 should be around 254, a /16 around 65534. Where the platform supports it, referencing the source by its resource identifier, such as a subnet or a security group, rather than by a raw CIDR removes the class of error entirely.',
        whyHi: 'Ek firewall ya security-group rule jo source ye permit karता hai ise ek CIDR range ke roop mein specify karता hai, aur us CIDR mein prefix length determine karता hai ki permitted range kitna large hai, prefix ke har reduction ke saath allowed source addresses ki sankhya double hoती hai. Ek rule jo ek single subnet permit karने ke liye intended hai, 256 addresses cover karता ek /24, 256 guna us range ko permit karता ek rule ban jата hai agar prefix /16 ke roop mein mistyped hai. Prefix ke baare mein precise hona essential hai, aur count formula ek quick check hai. Jahaan platform support karता hai, source ko iske resource identifier se reference karना error ki class poori tarah remove karता hai.',
      },
      {
        wrong: `# assuming a 169.254.x.x address is a normal private IP
$ ip addr show eth0
    inet 169.254.88.213/16 scope link eth0
# "cool, it has an IP" -> no. 169.254.x.x is LINK-LOCAL, auto-assigned because
//   DHCP failed. the host has NO real network config. nothing will route.`,
        right: `# 169.254.0.0/16 means "I could not get an address from DHCP".
# check: is the DHCP server reachable? is the interface in the right VLAN/subnet?
# is there a static config that should be applied? on cloud: is the ENI attached
# and the subnet's DHCP option set correct?
# a working host has a 10.x / 172.16-31.x / 192.168.x address (or a public one).`,
        why: 'The range 169.254.0.0/16 is reserved for link-local addressing, which a host assigns to itself automatically when it is configured to obtain an address dynamically but no DHCP server responds. An address in this range allows only communication with other hosts on the same physical link that have also self-assigned, and it is not routed anywhere, so a host holding a 169.254 address has effectively failed to join the network. Seeing such an address is a specific diagnostic signal, not a sign that networking is working: it means the DHCP exchange did not complete. The investigation is into why the host could not reach a DHCP server or why the server did not answer — the interface may be connected to the wrong network segment or VLAN, the DHCP service may be down or out of leases, a firewall may be blocking the DHCP ports, or in a cloud environment the network interface may not be properly attached or the subnet\'s address-assignment settings may be misconfigured. A host that has successfully joined the network holds an address from one of the private ranges or a public address, never a link-local one.',
        whyHi: 'Range 169.254.0.0/16 link-local addressing ke liye reserved hai, jo ek host apne aap ko automatically assign karता hai jab ye ek address dynamically obtain karने ke liye configured hai par koi DHCP server respond nahi karता. Is range mein ek address sirf same physical link par doosre hosts ke saath communication allow karता hai, aur ye kahin route nahi hoता. Aisा address dekhna ek specific diagnostic signal hai: iska matlab DHCP exchange complete nahi hua. Investigation ye hai ki host ek DHCP server tak kyun nahi pahunch saka. Ek host jo successfully network mein join hua ek private range se ek address rakhता hai ya ek public address, kabhi ek link-local nahi.',
      },
    ],

    realWorld: [
      {
        en: '**An IPAM spreadsheet (later a tool) that records every VPC/subnet CIDR the company has ever allocated** — so a new VPC gets a guaranteed-non-overlapping block, and a future VPN to a partner does not require re-addressing.',
        hi: '**Ek IPAM spreadsheet jo har VPC/subnet CIDR record karता hai jo company ne kabhi allocate kiya** — to ek naya VPC ek guaranteed-non-overlapping block paता hai.',
      },
      {
        en: '**A Kubernetes cluster that hit "no IP addresses available" mid-scale-up** because its nodes were in /24 subnets and the CNI assigns a pod IP per pod — migrated to /19 private subnets and the ceiling disappeared.',
        hi: '**Ek Kubernetes cluster jo scale-up ke beech "no IP addresses available" hit karता tha** kyunki iske nodes /24 subnets mein thे.',
      },
      {
        en: '**A "the database is world-open" finding in a pen test** traced to a security-group rule with `10.0.0.0/16` where the author meant `10.0.40.0/24`** — one character, the whole VPC allowed in.',
        hi: '**Ek pen test mein "database world-open hai" finding** ek security-group rule tak traced jismें `10.0.0.0/16` tha jab author ka matlab `10.0.40.0/24` tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain CIDR notation and how you tell whether two addresses are on the same subnet.',
        qHi: 'CIDR notation samjhाओ aur aap kaise bताते ho ki do addresses same subnet par hain.',
        a: 'CIDR notation writes an address followed by a slash and a prefix length, such as 10.20.30.0/24. The prefix length is the number of leading bits that identify the network; the remaining bits, thirty-two minus the prefix for IPv4, number the hosts within that network. So a /24 has eight host bits, giving two hundred fifty-six addresses, of which two are not usable by hosts — the network identifier, which is all host bits zero, and the broadcast address, which is all host bits one — leaving two hundred fifty-four. The general rule is that a slash-n network contains two to the power of thirty-two minus n addresses, and a smaller prefix number means a larger network, with each decrease of one doubling the size. To determine whether two addresses are on the same subnet, you apply the subnet\'s mask to both by a bitwise AND and compare the results: the mask has ones in the network positions and zeros in the host positions, so ANDing an address with it produces that address\'s network identifier. If the two network identifiers are equal, the addresses are on the same subnet and their hosts can exchange packets directly at the link layer without a router; if they differ, traffic between them must go through the default gateway. This is precisely the check a host performs for every outbound packet to decide whether to send it directly or route it.',
        aHi: 'CIDR notation ek address likhता hai jiske baad ek slash aur ek prefix length, jaisे 10.20.30.0/24. Prefix length leading bits ki sankhya hai jo network identify karते hain; baaki bits us network ke andar hosts number karते hain. To ek /24 mein aath host bits hain, do sौ chhappan addresses, jinmें se do hosts dwara usable nahi hain — network identifier aur broadcast address. Ek chhoटा prefix number matlab ek baड़ा network. Ye determine karने ke liye ki do addresses same subnet par hain, aap dono par subnet ka mask ek bitwise AND se apply karते ho aur results compare karते ho: agar do network identifiers equal hain, addresses same subnet par hain.',
      },
      {
        q: 'What are the RFC 1918 private ranges and how does NAT let them reach the internet?',
        qHi: 'RFC 1918 private ranges kya hain aur NAT unhe internet tak kaise pahunchने deता hai?',
        a: 'RFC 1918 reserves three ranges for private use that are not routable on the public internet, so any organisation can use them internally without coordination: ten-dot-zero-dot-zero-dot-zero slash eight, which is about sixteen million addresses and is used for cloud virtual networks and data centres; one-seventy-two-dot-sixteen slash twelve, about a million addresses; and one-ninety-two-dot-one-sixty-eight slash sixteen, about sixty-five thousand, used by home routers. Because these are not routed on the public internet, a host with a private address cannot be a packet\'s destination from outside. Network Address Translation bridges this. When a host behind NAT sends a packet outbound, the NAT device rewrites the packet\'s source address to its own public address and the source port to one it allocates, and records the mapping between the original private address and port and the new public address and port. The packet then travels the internet appearing to come from the NAT device\'s public address. When a reply arrives addressed to that public address and port, the NAT device consults its table, rewrites the destination back to the original private host and port, and forwards it inward. This lets many private hosts share one or a few public addresses, and it means a host behind NAT can initiate outbound connections but cannot receive unsolicited inbound connections, because no mapping exists until the host sends something first.',
        aHi: 'RFC 1918 teen ranges reserve karता hai private use ke liye jo public internet par routable nahi hain: 10.0.0.0/8 (16M — cloud VPCs), 172.16.0.0/12 (1M), 192.168.0.0/16 (65K — home routers). Kyunki ye public internet par route nahi hoते, ek private address waala host bahar se ek packet ka destination nahi ho sakта. NAT ise bridge karता hai. Jab NAT ke peeche ek host ek packet outbound bhejता hai, NAT device packet ka source address apne public address mein rewrite karता hai aur source port ise allocate karता hai, aur mapping record karता hai. Jab ek reply aata hai, NAT device apni table consult karता hai aur destination wapas original private host mein rewrite karता hai. Iska matlab ek host NAT ke peeche outbound connections initiate kar sakта hai par unsolicited inbound receive nahi kar sakта.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, for `172.20.16.0/20` compute: netmask, total addresses, usable hosts, network id, broadcast, and whether `172.20.24.100` and `172.20.32.1` are inside it.',
        taskHi: 'Ek comment mein, `172.20.16.0/20` ke liye compute karो: netmask, total addresses, usable hosts, network id, broadcast.',
        hint: '/20 → 20 network bits, 12 host bits. Netmask = 255.255.240.0. Total = 2^12 = 4096. Usable = 4094. Network id = 172.20.16.0. Broadcast = 172.20.31.255 (16 + 15 in the 3rd octet). `172.20.24.100`: 24 is in 16–31 → INSIDE. `172.20.32.1`: 32 > 31 → OUTSIDE.',
        hintHi: '/20 → 20 network bits, 12 host bits. Netmask = 255.255.240.0. Total = 4096. Usable = 4094. Network id = 172.20.16.0. Broadcast = 172.20.31.255. `172.20.24.100`: INSIDE. `172.20.32.1`: OUTSIDE.',
      },
      {
        task: 'You must carve `10.50.0.0/16` for 3 AZs × {public, app, db}. In a comment, propose CIDRs where app subnets are large (Kubernetes, pod-per-IP) and public/db are small, and state the one rule they must all obey.',
        taskHi: '`10.50.0.0/16` ko 3 AZs × {public, app, db} ke liye carve karो.',
        hint: 'e.g. public: 10.50.0.0/24, 10.50.1.0/24, 10.50.2.0/24 (LBs/NAT GWs). app: 10.50.64.0/19, 10.50.96.0/19, 10.50.128.0/19 (8190 IPs each — pods). db: 10.50.16.0/24, 10.50.17.0/24, 10.50.18.0/24. Rule: NO two subnet CIDRs may overlap — and the VPC CIDR `10.50.0.0/16` must not overlap any on-prem range or peered VPC.',
        hintHi: 'public: /24s (LBs). app: /19s (8190 IPs — pods). db: /24s. Rule: koi do subnet CIDRs overlap NAHI kar sakते — aur VPC CIDR kisi on-prem range ya peered VPC ke saath overlap NAHI karे.',
      },
      {
        task: 'In a comment, explain what a `169.254.x.x` address on an interface means, what a `127.0.0.1` bind vs a `0.0.0.0` bind means for a server, and why a service "works locally but not from another host" is often the second one.',
        taskHi: 'Ek comment mein, samjhाओ ek interface par ek `169.254.x.x` address ka kya matlab hai.',
        hint: '`169.254.x.x` (link-local) = DHCP failed, the host has no real network config — nothing routes. `127.0.0.1` bind = the server only accepts connections from the same host (loopback). `0.0.0.0` bind = accept on every interface, including the real network IP. "Works locally, not from another host" = the server bound to `127.0.0.1` (or `localhost`) — change it to `0.0.0.0` (and then rely on a firewall/security-group for access control).',
        hintHi: '`169.254.x.x` = DHCP failed. `127.0.0.1` bind = sirf same host se connections. `0.0.0.0` bind = har interface par. "Locally works, doosre host se nahi" = server `127.0.0.1` par bound hua — ise `0.0.0.0` karो.',
      },
    ],

    keyTakeaways: [
      'IPv4 = 32 bits = 4 octets (0-255 each), ~4.3B total (exhausted → NAT + IPv6). CIDR `<addr>/<prefix>` splits it: the prefix = how many LEADING bits are the NETWORK; the rest number the HOSTS. `/24` = 24 network bits, netmask 255.255.255.0, 256 addresses, **254 USABLE** (`.0` = network id, `.255` = broadcast — neither assignable). Formula: a `/n` has 2^(32−n) addresses, 2^(32−n) − 2 usable. SMALLER prefix number = BIGGER network; each −1 to the prefix DOUBLES the size (`/16` is 256× `/24`).',
      'SAME SUBNET (talk DIRECTLY, link layer, no router) ⟺ `(addr_A AND mask) == (addr_B AND mask)` — ANDing an address with the mask clears the host bits and yields the network id. Different network ids → traffic goes via the DEFAULT GATEWAY. A wrong netmask breaks connectivity confusingly because two hosts that should be on one subnet compute different network parts.',
      'RFC 1918 PRIVATE RANGES (not routable on the public internet, reused everywhere): `10.0.0.0/8` (16.7M — cloud VPCs, data centres, K8s pod networks), `172.16.0.0/12` (1M — Docker\'s default bridge `172.17.0.0/16`), `192.168.0.0/16` (65K — home routers). Also: `127.0.0.0/8` = loopback (never leaves the host); `169.254.0.0/16` = link-local (**seeing this = DHCP failed, no real network config**); `0.0.0.0` = "any interface" when binding / the default route as `0.0.0.0/0`.',
      'SUBNETTING a VPC (`10.0.0.0/16` → subnets, each in one AZ): PUBLIC subnets have a route to an INTERNET GATEWAY (LBs, bastions); PRIVATE subnets have no inbound internet, route OUTBOUND via a NAT GATEWAY (app servers); DATABASE subnets often have no internet route at all. A `/24` (~251 usable after cloud reservations) is fine for LBs/DBs/VMs but a pod-per-IP Kubernetes cluster exhausts it fast → use `/20` or bigger. ABSOLUTE RULES: subnet CIDRs within a VPC must NOT overlap; the VPC CIDR must NOT overlap any on-prem range or peered VPC (unfixable without re-addressing everything).',
      'NAT: many private hosts share one/few public addresses. SNAT (outbound) rewrites the SOURCE IP+port to the NAT device\'s public address and records the mapping so replies get back — which is why your laptop + phone are the same public IP to a website, and why a NATed host can make outbound connections but NOT receive unsolicited inbound. DNAT / port-forwarding rewrites the DESTINATION of inbound packets (how a router forwards its public :443 to an internal server; how a K8s NodePort works). IPv6 = 128 bits, hex, `::` collapses zero-runs; so many addresses that NAT is unnecessary — CIDR concepts transfer directly.',
    ],
    keyTakeawaysHi: [
      'IPv4 = 32 bits = 4 octets (0-255), ~4.3B total (exhausted → NAT + IPv6). CIDR `<addr>/<prefix>` split karता hai: prefix = kitne LEADING bits NETWORK hain. `/24` = netmask 255.255.255.0, 256 addresses, **254 USABLE** (`.0` = network id, `.255` = broadcast). Formula: `/n` mein 2^(32−n) addresses, 2^(32−n) − 2 usable. CHHOTA prefix = BADA network.',
      'SAME SUBNET (DIRECTLY baat karो, no router) ⟺ `(addr_A AND mask) == (addr_B AND mask)`. Different network ids → traffic DEFAULT GATEWAY se jाता hai. Ek wrong netmask connectivity confusingly todता hai.',
      'RFC 1918 PRIVATE RANGES: `10.0.0.0/8` (16.7M — cloud VPCs, K8s pods), `172.16.0.0/12` (1M — Docker bridge), `192.168.0.0/16` (65K — home routers). Also: `127.0.0.0/8` loopback; `169.254.0.0/16` link-local (**ye dekhna = DHCP failed**); `0.0.0.0` = "any interface".',
      'SUBNETTING: PUBLIC subnets ka route ek INTERNET GATEWAY tak; PRIVATE subnets OUTBOUND ek NAT GATEWAY se; DATABASE subnets aksar koi internet route nahi. Ek `/24` (~251 usable) LBs/DBs/VMs ke liye fine par ek pod-per-IP K8s cluster ise jaldi exhaust karता hai → `/20` istemal karो. ABSOLUTE RULES: subnet CIDRs overlap NAHI; VPC CIDR kisi on-prem range ya peered VPC ke saath overlap NAHI.',
      'NAT: bahut private hosts ek/kुछ public addresses share karते hain. SNAT (outbound) SOURCE IP+port rewrite karता hai aur mapping record karता hai — isliye aapका laptop + phone ek website ko same public IP hain, aur ek NATed host outbound kar sakта hai par unsolicited inbound NAHI. DNAT / port-forwarding inbound packets ka DESTINATION rewrite karता hai. IPv6 = 128 bits, hex; itne addresses ki NAT unnecessary hai.',
    ],
  },

  {
    slug: 'ops-dns',
    title: 'DNS',
    titleHi: 'DNS',
    description: 'DNS turns names into addresses (and other records). A lookup walks a hierarchy from the root to the authoritative server for the zone, and answers are cached for the record\'s TTL. Most "propagation" delays, stale-record incidents, and split-brain surprises come from not understanding caching and the record types.',
    descriptionHi: 'DNS names ko addresses (aur doosre records) mein badalता hai. Ek lookup root se zone ke authoritative server tak ek hierarchy walk karता hai, aur answers record ke TTL ke liye cached hote hain. Zyaादातर "propagation" delays, stale-record incidents, aur split-brain surprises caching aur record types ko na samajhने se aate hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A chain of phone directories, each one pointing you to a more specific book.** To find "orders desk at Example Inc, Mumbai branch" you first check the global directory, which does not have the number but tells you which national directory covers ".com companies". That one points you to Example Inc\'s own internal directory. Only that last book — the authoritative one — has the actual extension. Every step you take is written on a sticky note with a "keep this for N minutes" instruction (the TTL), so the next person asking the same question skips straight to the answer. Change the extension in the authoritative book and the old sticky notes are still out there until they expire — which is exactly what "DNS hasn\'t propagated yet" means.',
      hi: '**Phone directories ki ek chain, har ek aapको ek zyada specific book par point karती hai.** "Example Inc, Mumbai branch ka orders desk" dhoondने ke liye aap pehle global directory check karते ho, jiske paas number nahi par bताती hai kaunसी national directory ".com companies" cover karती hai. Wo aapको Example Inc ki apni internal directory par point karती hai. Sirf wo last book — authoritative one — ke paas actual extension hai. Har step ek sticky note par likha hai ek "ise N minutes ke liye rakhो" instruction ke saath (TTL). Authoritative book mein extension change karो aur purane sticky notes abhi bhi bahar hain jab tak wo expire nahi hote — jo exactly "DNS abhi tak propagate nahi hui" ka matlab hai.',
    },

    simple: `**DNS: name -> record. The common record types:**
\`\`\`
A       api.example.com      -> 203.0.113.10        (name -> IPv4)
AAAA    api.example.com      -> 2001:db8::10        (name -> IPv6)
CNAME   www.example.com      -> example.com         (alias -> another name; NOT at the zone apex)
MX      example.com          -> 10 mail.example.com (mail servers, with priority)
TXT     example.com          -> "v=spf1 ..."         (free text: SPF, DKIM, domain verification)
NS      example.com          -> ns1.provider.net    (which servers are authoritative for this zone)
SOA     example.com          -> (serial, refresh, retry, expire, minimum-TTL)   (zone metadata)
SRV     _sip._tcp.example.com-> 10 5 5060 sip.example.com   (service location: prio weight port target)
PTR     10.113.0.203.in-addr.arpa -> api.example.com        (reverse: IP -> name)
CAA     example.com          -> 0 issue "letsencrypt.org"   (which CAs may issue certs for this domain)
\`\`\`

**A LOOKUP (recursive resolver does this on your behalf):**
\`\`\`
1. resolver checks its CACHE. hit -> done.
2. ask a ROOT server: "who handles .com?"           -> "the .com TLD servers, here"
3. ask a .com TLD server: "who handles example.com?"-> "example.com's NS: ns1.provider.net"
4. ask ns1.provider.net: "A record for api.example.com?" -> "203.0.113.10, TTL 300"
5. resolver CACHES the answer for 300s and returns it to the client.
\`\`\`
The RESOLVER (8.8.8.8, 1.1.1.1, your ISP's, your company's) is RECURSIVE — it does
the walk. The ROOT / TLD / your-zone servers are AUTHORITATIVE — each answers only
for its slice and refers you onward.

**TTL & CACHING — the source of every "propagation" story:**
\`\`\`
- every record has a TTL (seconds). resolvers cache it for that long.
- change a record: old value is served from caches until each cache's copy expires.
- there is no "push". you WAIT OUT the TTL. lower the TTL *days before* a planned change.
- "propagation" = "waiting for caches (and the domain's NS delegation) to expire".
\`\`\`

**CNAME rules:** an alias to another name. Cannot coexist with other records for the
same name. Cannot be at the ZONE APEX (\`example.com\` itself) — use an A record, or your
DNS provider's "ALIAS/ANAME" pseudo-record, or "flattening".

**SPLIT-HORIZON DNS:** the same name resolves differently inside vs outside a network
(internal clients get a private IP, external get the public one). Common and useful;
also a common "works on the VPN, not off it" cause.

**DEBUG:  dig +short api.example.com  |  dig api.example.com A +trace  |  dig @1.1.1.1 example.com NS**
Check the AUTHORITATIVE answer, not just your local resolver: \`dig @ns1.provider.net ...\`.`,

    simpleHi: `**DNS: name -> record. Common record types:**
\`\`\`
A       api.example.com      -> 203.0.113.10        (name -> IPv4)
AAAA    api.example.com      -> 2001:db8::10        (name -> IPv6)
CNAME   www.example.com      -> example.com         (alias -> doosरा name; zone apex par NAHI)
MX      example.com          -> 10 mail.example.com (mail servers, priority ke saath)
TXT     example.com          -> "v=spf1 ..."         (SPF, DKIM, domain verification)
NS      example.com          -> ns1.provider.net    (is zone ke liye authoritative servers)
SOA     example.com          -> zone metadata
PTR     ...in-addr.arpa      -> api.example.com      (reverse: IP -> name)
CAA     example.com          -> which CAs certs issue kar sakती hain
\`\`\`

**EK LOOKUP (recursive resolver aapki taraf se karता hai):**
\`\`\`
1. resolver apna CACHE check karता hai. hit -> done.
2. ROOT server se poochो: "kaun .com handle karता hai?"
3. .com TLD server se poochо: "kaun example.com handle karता hai?" -> "NS: ns1.provider.net"
4. ns1.provider.net se poochो: "api.example.com ka A record?" -> "203.0.113.10, TTL 300"
5. resolver answer 300s CACHE karता hai.
\`\`\`
RESOLVER (8.8.8.8, 1.1.1.1) RECURSIVE hai — ye walk karता hai. ROOT / TLD / zone servers
AUTHORITATIVE hain — har ek sirf apni slice ke liye answer karता hai.

**TTL & CACHING — har "propagation" story ka source:**
\`\`\`
- har record ka ek TTL (seconds). resolvers ise utni der cache karते hain.
- ek record change karो: purani value caches se serve hoती hai jab tak har cache ki copy expire nahi hoती.
- koi "push" nahi. aap TTL WAIT OUT karते ho. ek planned change se *dinों pehle* TTL lower karो.
\`\`\`

**CNAME rules:** doosre name ko ek alias. Same name ke liye doosre records ke saath coexist nahi kar sakта.
ZONE APEX par NAHI (\`example.com\` khud) — ek A record istemal karो, ya provider ka "ALIAS/ANAME".

**SPLIT-HORIZON DNS:** same name andar vs bahar alag resolve hoता hai. "VPN par works, off nahi" ka common cause.

**DEBUG:  dig +short api.example.com  |  dig api.example.com A +trace  |  dig @1.1.1.1 example.com NS**
AUTHORITATIVE answer check karो: \`dig @ns1.provider.net ...\`.`,

    content: `## What DNS stores

DNS is a distributed database mapping **names** to **records**. It is not only "name to IP" — a **zone** (the records for a domain like \`example.com\`) holds several record types:

| Type | Maps | Example | Notes |
|---|---|---|---|
| **A** | name → IPv4 | \`api.example.com → 203.0.113.10\` | the common case |
| **AAAA** | name → IPv6 | \`api.example.com → 2001:db8::10\` | "quad-A" |
| **CNAME** | name → another **name** | \`www → example.com\` | an alias; resolution follows it. Restrictions below. |
| **MX** | domain → mail servers | \`10 mail1\`, \`20 mail2\` | lower priority number = tried first |
| **TXT** | name → free text | \`"v=spf1 include:..."\` | SPF, DKIM keys, domain-ownership verification |
| **NS** | zone → authoritative servers | \`ns1.provider.net\` | how delegation works |
| **SOA** | zone → metadata | serial, refresh, retry, expire, minimum | one per zone; serial bumps on every edit |
| **SRV** | service → host+port | \`_sip._tcp → 10 5 5060 sip.example.com\` | priority, weight, port, target |
| **PTR** | IP → name | in the \`.in-addr.arpa\` / \`.ip6.arpa\` tree | reverse DNS; used by mail servers |
| **CAA** | domain → allowed CAs | \`0 issue "letsencrypt.org"\` | restricts which CAs may issue certs |

## How a name resolves

Your applications and OS do not walk DNS themselves; they ask a **recursive resolver** — \`8.8.8.8\` (Google), \`1.1.1.1\` (Cloudflare), your ISP's, or your company's internal one — and it does the work:

1. The resolver checks its **cache**. If it has a non-expired answer, it returns it immediately. Most lookups end here.
2. Otherwise it asks a **root server**: "who is authoritative for \`.com\`?" The root replies with the **NS records for the \`.com\` TLD**.
3. It asks a **\`.com\` TLD server**: "who is authoritative for \`example.com\`?" The TLD replies with **\`example.com\`'s NS records** — e.g. \`ns1.provider.net\`, \`ns2.provider.net\`. This is the **delegation**.
4. It asks \`ns1.provider.net\`: "what is the \`A\` record for \`api.example.com\`?" This server is **authoritative for the zone** and returns the actual answer, with a **TTL**.
5. The resolver **caches** the answer (and the intermediate NS answers) for their TTLs, and returns it to the client.

The distinction that matters:

- A **recursive resolver** does the full walk on your behalf and caches aggressively. You configure which one your systems use.
- An **authoritative server** answers only for the zones it hosts, and for anything else it says "not me, ask over there". Root servers, TLD servers, and your DNS provider's nameservers are authoritative.

## TTL and caching — where "propagation" comes from

Every record carries a **TTL** in seconds. When a resolver caches an answer, it serves that cached value to everyone who asks, without re-checking, until the TTL elapses.

The consequence: **when you change a record, the old value keeps being served from every cache that still holds it, until each of those caches' copies expires.** There is no mechanism to push an update or invalidate caches. You simply **wait out the TTL**.

So the standard procedure for a **planned DNS change** (moving a service to a new IP, switching providers):

1. **Days before**, lower the record's TTL to something short (e.g. 300 or 60 seconds). Wait for the *old* (long) TTL to expire everywhere so the short TTL is now in effect.
2. Make the change. Now caches hold the old value for at most the short TTL.
3. After the migration is confirmed stable, **raise the TTL back up** (e.g. 3600) to reduce lookup load and improve resilience.

"DNS propagation" is not a real network process — it is just the sum of: caches expiring, and (for NS/delegation changes) the parent zone's NS records expiring, which can take up to 48 hours because TLD NS records often have a 1–2 day TTL.

## CNAME restrictions

A \`CNAME\` says "this name is an alias for that name; to resolve me, resolve the target". Two hard rules:

- **A name with a CNAME cannot have any other records.** No \`A\`, no \`MX\`, no \`TXT\` alongside a \`CNAME\` for the same name. (The DNS spec requires this; some providers silently break it.)
- **A CNAME cannot exist at the zone apex** — the bare domain \`example.com\` — because the apex must have \`SOA\` and \`NS\` records, and the previous rule forbids a CNAME coexisting with them.

The apex problem is common: you want \`example.com\` to point at a load balancer that only gives you a hostname (\`lb-1234.elb.amazonaws.com\`), not an IP. Solutions: an \`A\` record with the IP (if stable), or your DNS provider's non-standard **ALIAS / ANAME** record (CloudFlare, Route 53, others), which behaves like a CNAME at the apex by resolving the target and serving its \`A\`/\`AAAA\` records itself — a technique called **CNAME flattening**.

## Split-horizon (split-brain) DNS

The same name can be configured to **resolve differently depending on who is asking**:

- Clients **inside** the corporate network / VPC ask the internal resolver, which returns a **private IP** (\`10.0.5.20\`) — direct, fast, not exposed.
- Clients **outside** ask public DNS, which returns the **public IP** or the load balancer.

This is deliberate and useful — internal traffic stays internal — but it is a frequent cause of "it works when I'm on the VPN but not otherwise" or vice versa, and of confusion when \`dig\` from your laptop and \`dig\` from a server return different answers for the same name. Always note *which resolver* answered.

## Debugging DNS

\`dig\` is the tool (\`nslookup\` is the older, less precise one):

\`\`\`
dig +short api.example.com                # just the answer
dig api.example.com A                     # full answer with TTL and sections
dig api.example.com +trace                # do the recursive walk yourself, showing every step
dig @1.1.1.1 example.com                  # ask a specific resolver
dig @ns1.provider.net api.example.com     # ask the AUTHORITATIVE server directly (bypass all caches)
dig example.com NS                        # the delegation
dig example.com SOA                       # the serial (did my edit land?) and TTLs
dig -x 203.0.113.10                       # reverse lookup (PTR)
dig api.example.com +noall +answer        # trim to just the answer section
\`\`\`

The key debugging move: **compare what your resolver returns with what the authoritative server returns.** If \`dig @ns1.provider.net\` shows the new value but \`dig\` (your default resolver) shows the old one, the change is live and you are waiting on caches. If the authoritative server *also* shows the old value, your edit did not take effect — check you edited the right zone and bumped the serial.`,

    contentHi: `## DNS kya store karता hai

DNS ek distributed database hai jo **names** ko **records** par map karता hai. Ek **zone** (\`example.com\` jaisे ek domain ke records) kई record types rakhता hai: **A** (name → IPv4), **AAAA** (name → IPv6), **CNAME** (name → doosरा name; ek alias), **MX** (mail servers), **TXT** (SPF, DKIM, verification), **NS** (authoritative servers), **SOA** (zone metadata), **SRV**, **PTR** (reverse: IP → name), **CAA** (allowed CAs).

## Ek name kaise resolve hoता hai

Aapki applications DNS khud walk nahi karती; wo ek **recursive resolver** se poochती hain (\`8.8.8.8\`, \`1.1.1.1\`, aapki company ki), aur ye kaam karता hai:
1. Resolver apna **cache** check karता hai. Non-expired answer → turant return.
2. Warna ek **root server** se poochता hai: "kaun \`.com\` handle karता hai?" → \`.com\` TLD ke NS records.
3. Ek **\`.com\` TLD server** se poochता hai: "kaun \`example.com\` handle karता hai?" → \`example.com\` ke NS records (**delegation**).
4. \`ns1.provider.net\` se poochता hai: "\`api.example.com\` ka \`A\` record?" Ye server **zone ke liye authoritative** hai.
5. Resolver answer ko iske TTL ke liye **cache** karता hai.

Ek **recursive resolver** poora walk aapki taraf se karता hai. Ek **authoritative server** sirf un zones ke liye answer karता hai jo ye host karता hai.

## TTL aur caching — "propagation" kahaan se aata hai

Har record ek **TTL** carry karता hai. Jab ek resolver ek answer cache karता hai, ye us cached value ko sabko serve karता hai jab tak TTL elapse nahi hoता.

**Jab aap ek record change karते ho, purani value har cache se serve hoती rehти hai jab tak un caches ki copies expire nahi hoती.** Koi push mechanism nahi. Aap TTL **wait out** karते ho.

Ek **planned DNS change** ke liye standard procedure: (1) **Dinों pehle**, TTL lower karो (300/60s). (2) Change karो. (3) Stable confirm hone ke baad, TTL wapas raise karो.

"DNS propagation" ek real network process nahi hai — ye sirf caches expire hone ka sum hai.

## CNAME restrictions

- **Ek CNAME waale name ke koi doosre records nahi ho sakते.**
- **Ek CNAME zone apex par exist nahi kar sakта** (\`example.com\`) — apex ko \`SOA\` aur \`NS\` records chahiye. Solution: ek \`A\` record, ya provider ka **ALIAS / ANAME** (CNAME flattening).

## Split-horizon DNS

Same name **kaun poochता hai iske hisaab se alag resolve** ho sakта hai: **andar** ke clients ek private IP paते hain, **bahar** ke public IP. Ye useful hai par "VPN par works, warna nahi" ka frequent cause hai.

## DNS debug karना

\`dig +short api.example.com\` ; \`dig api.example.com +trace\` ; \`dig @1.1.1.1 example.com\` ; \`dig @ns1.provider.net ...\` (authoritative directly). Key move: **aapका resolver jo return karता hai use authoritative server jo return karता hai se compare karो.**`,

    examples: [
      {
        title: 'dig: reading a lookup and following the delegation',
        titleHi: 'dig: ek lookup read karna aur delegation follow karna',
        code: `$ dig api.example.com A +noall +answer
api.example.com.    300    IN    CNAME    lb-prod.example.com.
lb-prod.example.com. 60     IN    A        203.0.113.10
# -> api is a CNAME to lb-prod (TTL 300); lb-prod is an A record (TTL 60).
#    a resolver caches api's CNAME for 300s and lb-prod's A for 60s independently.

$ dig example.com NS +short
ns1.p05.dynect.net.
ns2.p05.dynect.net.
# -> the zone is delegated to these nameservers. edits go here; they are authoritative.

$ dig @ns1.p05.dynect.net api.example.com A +short     # ask the authoritative server directly
203.0.113.10                                            # bypasses every cache

$ dig api.example.com +trace | tail -6                 # do the walk yourself
example.com.       172800  IN  NS  ns1.p05.dynect.net.
;; Received 100 bytes from 192.5.6.30#53(a.gtld-servers.net) in 20 ms   <- .com TLD referred us
api.example.com.  300     IN  CNAME  lb-prod.example.com.
;; Received 88 bytes from 208.78.70.5#53(ns1.p05.dynect.net) in 15 ms   <- authoritative answered`,
        output: `dig shows records with their TTLs and follows CNAME chains. 'dig example.com NS' shows the delegation - which nameservers are authoritative. 'dig @<nameserver>' asks that server directly, bypassing caches, which is how you check whether an edit has actually taken effect. 'dig +trace' performs the recursive walk step by step, showing the root, then the TLD referral, then the authoritative answer.`,
        explain: 'Each dig invocation targets a different part of the DNS picture. The first shows the resolved records for a name: here the name is a CNAME pointing to another name, which in turn has an A record, and each record has its own TTL that resolvers cache independently, so the alias and the address it ultimately resolves to can expire from caches at different times. The NS query shows the delegation — the set of nameservers that the parent zone says are authoritative for this domain, which is where any edit to the zone must be made and which is the ground truth for what the zone currently contains. Querying one of those nameservers directly, by putting an at-sign and its address before the name, asks the authoritative source and skips every cache in between, which is the definitive way to confirm whether a change has been applied. The trace option makes dig perform the recursion itself rather than delegating to a resolver, printing each referral: the root servers pointing to the TLD, the TLD servers pointing to the zone\'s nameservers, and finally the zone\'s nameservers returning the record. Reading the trace shows exactly where resolution would break if a delegation were wrong or a nameserver unreachable.',
        explainHi: 'Har dig invocation DNS picture ke ek alag part ko target karता hai. Pehla ek name ke resolved records dikhता hai: yahaan name ek CNAME hai jo ek doosरे name par point karता hai, jiska bदले mein ek A record hai, aur har record ka apna TTL hai jise resolvers independently cache karते hain. NS query delegation dikhता hai — nameservers ka set jo parent zone kehта hai is domain ke liye authoritative hain. Un nameservers mein se ek ko directly query karना authoritative source se poochता hai aur beech ka har cache skip karता hai. Trace option dig ko recursion khud perform karवाता hai, har referral print karते hue.',
      },
      {
        title: 'A planned DNS cutover done safely',
        titleHi: 'Ek planned DNS cutover safely kiya gaya',
        code: `# GOAL: move api.example.com from 203.0.113.10 (old) to 198.51.100.20 (new).

# --- T-3 days: lower the TTL FIRST ---
# edit: api.example.com  A  203.0.113.10   TTL 3600  ->  TTL 60
$ dig api.example.com +noall +answer
api.example.com.  3542  IN  A  203.0.113.10       # a cache still has the OLD 3600 TTL
# wait ~1 hour for the old 3600 TTL to age out everywhere.
$ dig api.example.com +noall +answer
api.example.com.  60    IN  A  203.0.113.10       # now everyone honours the 60s TTL

# --- T-0: make the change ---
# edit: api.example.com  A  198.51.100.20  TTL 60
# within ~60s, every resolver worldwide is serving the new IP.
$ dig @1.1.1.1 api.example.com +short
198.51.100.20
$ dig @8.8.8.8 api.example.com +short
198.51.100.20
# keep BOTH old and new servers running until traffic to the old IP drops to zero.

# --- T+2 days: raise the TTL back ---
# edit: api.example.com  A  198.51.100.20  TTL 3600     (less lookup load, more resilient)`,
        output: `The safe cutover has three phases: days before, lower the TTL and wait for the OLD long TTL to expire so the short TTL is genuinely in effect; at cutover, change the record - caches now hold the old value for at most the short TTL; after confirming, raise the TTL back. Keep the old target serving until its traffic drops to zero, because some resolvers ignore TTLs.`,
        explain: 'A DNS change cannot be pushed; it takes effect only as fast as caches expire, and caches expire according to the TTL that was in force when they fetched the record. So lowering the TTL just before a change does not help, because caches that fetched the record under the old long TTL will keep serving the old value for the remainder of that long TTL regardless. The lowering must be done far enough ahead that every cache has re-fetched at least once and is now honouring the short TTL. Once that is true, the actual record change propagates within one short-TTL interval, and querying several independent public resolvers confirms it. The old target must stay in service throughout the window and for a margin afterward, because DNS caching is best-effort and some resolvers and clients hold records longer than the stated TTL, so there is a long tail of requests still arriving at the old address. Only after that traffic has fallen to nothing is it safe to decommission the old target. Raising the TTL again afterward reduces the query load on the authoritative servers and means a brief authoritative-server outage does not immediately break resolution, since caches hold answers longer.',
        explainHi: 'Ek DNS change push nahi kiya ja sakta; ye sirf utni fast take effect karता hai jitni caches expire hoती hain, aur caches us TTL ke hisaab se expire hoती hain jo force mein tha jab unhone record fetch kiya. To ek change se just pehle TTL lower karना madad nahi karता, kyunki jo caches ne purane long TTL ke under record fetch kiya wo purani value serve karती rehेंgी. Lowering itna aage karना chahiye ki har cache ne kम se kम ek baar re-fetch kiya hai. Ek baar wo true hai, actual record change ek short-TTL interval ke andar propagate karता hai. Purana target poore window ke dauран aur baad mein ek margin ke liye in service rehना chahiye, kyunki DNS caching best-effort hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# making a DNS change with a 3600s TTL and expecting it "in a few minutes"
# 09:00  change api.example.com A  ->  new IP  (TTL was, and stays, 3600)
# 09:05  "why are some users still hitting the old server?"
# 09:30  "half of them switched, half didn't — is DNS broken?"
# -> nothing is broken. every resolver that cached the OLD record before 09:00
//    serves it until ITS copy is 3600s old. the cutover takes up to an hour,
//    unevenly, and you had no way to speed it up after the fact.`,
        right: `# lower the TTL to 60s at least (old TTL) seconds before the change:
# T-2h:  api.example.com A  old-IP  TTL 3600 -> 60
# T-1h:  verify 'dig' shows TTL <= 60 from multiple resolvers
# T-0:   change the A record. now fully switched within ~60s.
# T+1d:  raise TTL back to 3600.`,
        why: 'A DNS record change becomes visible to a given resolver only when that resolver\'s cached copy of the record expires, and the copy expires after the number of seconds given by the TTL that applied when the resolver fetched it. A resolver that cached the record with a one-hour TTL shortly before the change will continue to serve the old value for nearly a full hour, and there is no way to make it re-fetch sooner, because DNS has no cache-invalidation signal. Different resolvers fetched the record at different times, so they expire at different times, which produces the pattern of some clients switching immediately and others much later. Lowering the TTL after the change is too late to help those already-cached copies. The lowering has to happen before the change, and far enough before that the old long TTL has itself expired everywhere, so that when the change is made every cache is operating on the new short TTL and will re-fetch within that short interval. This is why a planned DNS migration is scheduled around the TTL: reduce it well ahead, wait, change, then restore it.',
        whyHi: 'Ek DNS record change ek diye gaye resolver ke liye tabhi visible banता hai jab us resolver ki cached copy expire hoती hai, aur copy us TTL ke seconds ke baad expire hoती hai jo applied tha jab resolver ne ise fetch kiya. Ek resolver jisne change se just pehle ek one-hour TTL ke saath record cache kiya lagभag ek poore ghante ke liye purani value serve karता rahega, aur ise jaldi re-fetch karवाने ka koi tarika nahi. Change ke baad TTL lower karна un already-cached copies ki madad karने ke liye bahut late hai. Lowering change se pehle honा chahiye, aur itna aage ki purana long TTL khud har jagah expire ho gaya hai.',
      },
      {
        wrong: `# trying to put a CNAME at the zone apex
# want: example.com -> my-lb-472.elb.amazonaws.com (a hostname, not an IP)
# add:  example.com  CNAME  my-lb-472.elb.amazonaws.com
# -> the provider either rejects it, or accepts it and BREAKS the zone: the apex
//    MUST have SOA and NS records, and a CNAME can't coexist with other records.
//    email (MX at the apex) and the zone itself stop working.`,
        right: `# use the provider's apex-alias feature (ALIAS / ANAME / "CNAME flattening"):
#   example.com  ALIAS  my-lb-472.elb.amazonaws.com
# it resolves the target and serves ITS A/AAAA records at the apex, while still
# allowing SOA/NS/MX. Route 53 'Alias', Cloudflare 'CNAME flattening',
# and most managed DNS providers have an equivalent.
# (or, if the target's IP is genuinely static, just use an A record.)`,
        why: 'The apex of a zone, the bare domain name with no subdomain, is required by the DNS specification to carry the zone\'s SOA record and its NS records, because these define the zone and its delegation. A separate rule states that a name with a CNAME record cannot have any other records of any type. These two rules together make a CNAME at the apex impossible: it would have to coexist with the mandatory SOA and NS records, which the CNAME rule forbids. A provider that rejects the configuration is enforcing the spec; a provider that accepts it produces a broken zone where the SOA, NS, and any MX records at the apex stop being served. The need is real, though, because load balancers and many hosted services provide a hostname rather than a stable IP. Managed DNS providers solve it with a non-standard record type, variously called ALIAS, ANAME, or CNAME flattening, that behaves like a CNAME from the outside but is implemented on the provider\'s side by resolving the target and serving its address records directly under the apex name, so the apex still has real A or AAAA records and can coexist with SOA, NS, and MX.',
        whyHi: 'Ek zone ka apex, bina subdomain ke bare domain name, DNS specification dwara zone ke SOA record aur iske NS records carry karने ke liye required hai. Ek alag rule kehта hai ki ek CNAME record waale name ke kisi bhi type ke koi doosre records nahi ho sakते. Ye do rules saath ek CNAME ko apex par impossible banाते hain. Ek provider jo configuration reject karता hai spec enforce kar raha hai. Zaroorat real hai, kyunki load balancers ek hostname provide karते hain ek stable IP ke bजaay. Managed DNS providers ise ek non-standard record type se solve karते hain, ALIAS/ANAME/CNAME flattening kehते hain.',
      },
      {
        wrong: `# debugging a DNS problem by only checking your own laptop
$ dig api.internal.example.com +short
10.0.5.20
# "resolves fine!" — deploy the change, close the ticket.
# meanwhile: from the CI runners (different network, different resolver) it
//   returns NXDOMAIN, because that name only exists in the INTERNAL (split-
//   horizon) view and CI is outside it. the deploy fails there.`,
        right: `# always note WHICH resolver answered, and check from the relevant vantage points:
$ dig @10.0.0.2 api.internal.example.com +short     # the internal resolver
10.0.5.20
$ dig @1.1.1.1 api.internal.example.com +short      # a public resolver
;; ANSWER SECTION: (empty)  -> NXDOMAIN from outside
# -> this name is split-horizon: internal-only. CI (external) can't resolve it.
# fix: give CI a route to the internal resolver, or a public record, or run the
# step from inside the network.`,
        why: 'DNS answers depend on which resolver is asked, and in an environment with split-horizon DNS the same name deliberately resolves to different values, or exists only, depending on whether the query comes from inside a network or outside it. Checking a name from one machine confirms only what that machine\'s configured resolver returns, which may not be what a different system in a different network sees. A name that resolves cleanly from a workstation on the corporate network can be entirely absent from the public DNS that a build runner or an external monitoring system uses, so a change verified only from the workstation can still fail everywhere else. The correct approach is to always record which resolver produced an answer and to query from, or as, each vantage point that matters: the internal resolver, a public resolver, and ideally the actual environment where the problem is reported. When the answers differ, that difference is the finding, and the fix is to make the name resolvable from where it needs to be, whether by routing those clients to the internal resolver, adding a public record, or running the affected step from inside the network.',
        whyHi: 'DNS answers is par depend karते hain ki kaunसा resolver poocha jाता hai, aur split-horizon DNS waale ek environment mein same name deliberately alag values par resolve hoता hai, ya sirf exist karता hai, is par depend karके ki query ek network ke andar se aati hai ya bahar se. Ek machine se ek name check karना sirf ye confirm karता hai ki us machine ka configured resolver kya return karता hai. Ek name jo ek corporate network par ek workstation se cleanly resolve hoता hai public DNS se poori tarah absent ho sakта hai. Correct approach hamesha record karना hai ki kaunसे resolver ne ek answer produce kiya aur har vantage point se query karना jo matter karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A migration runbook that starts "T-72h: lower the TTL on `api.example.com` to 60s; verify from 1.1.1.1, 8.8.8.8, and 9.9.9.9"** — so the actual cutover day is a 60-second switch, not an all-day guessing game.',
        hi: '**Ek migration runbook jo "T-72h: `api.example.com` par TTL 60s karो" se shuru hoती hai** — to actual cutover day ek 60-second switch hai.',
      },
      {
        en: '**An apex domain that "randomly went down"** — someone had added a `CNAME` at `example.com` alongside the `MX`; the provider served the CNAME and stopped answering `MX`, so email bounced. Replaced with an `ALIAS` record.',
        hi: '**Ek apex domain jo "randomly down gaya"** — kisi ne `example.com` par ek `CNAME` `MX` ke saath add kiya tha.',
      },
      {
        en: '**CI deploys failing with NXDOMAIN on an internal hostname** — split-horizon DNS meant the name existed only inside the VPC; the fix was a private hosted zone attached to the CI VPC too, not a public record.',
        hi: '**CI deploys ek internal hostname par NXDOMAIN se fail hote** — split-horizon DNS ka matlab name sirf VPC ke andar exist karता tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through how a recursive resolver answers a query it has not cached.',
        qHi: 'Ek recursive resolver ek query kaise answer karता hai jise usne cache nahi kiya.',
        a: 'The resolver starts at the top of the DNS hierarchy and works down, asking a more specific authority at each step. First it queries a root server, asking which servers are authoritative for the top-level domain in the name, such as dot-com; the root does not know the final answer but returns the nameserver records for the com zone. The resolver then queries one of those com nameservers, asking which servers are authoritative for the specific domain, such as example dot com; the TLD server returns that domain\'s nameserver records, which is the delegation from the parent zone. The resolver then queries one of the domain\'s own nameservers for the actual record requested, for instance the A record of a hostname within the zone; this server is authoritative for the zone and returns the real answer along with a TTL. The resolver caches this answer, and also the intermediate nameserver answers it received along the way, each for its own TTL, and returns the answer to the client. The next query for the same name, or for another name in the same zone, is served from cache or skips straight to the already-known authoritative nameservers, until the relevant cache entries expire. The root and TLD servers are contacted rarely because their referrals have long TTLs.',
        aHi: 'Resolver DNS hierarchy ke top se shuru karता hai aur neeche kaam karता hai, har step par ek zyada specific authority se poochता hai. Pehle ye ek root server query karता hai, poochता hai kaunसे servers name mein top-level domain ke liye authoritative hain; root final answer nahi jानता par com zone ke nameserver records return karता hai. Resolver phir un com nameservers mein se ek query karता hai, poochता hai kaunसे servers specific domain ke liye authoritative hain; TLD server us domain ke nameserver records return karता hai (delegation). Resolver phir domain ke apne nameservers mein se ek ko actual record ke liye query karता hai; ye server zone ke liye authoritative hai. Resolver is answer ko cache karता hai, aur beech ke nameserver answers bhi, har ek apne TTL ke liye.',
      },
      {
        q: 'Why does a DNS change take time to "propagate", and how do you do a planned change safely?',
        qHi: 'Ek DNS change ko "propagate" hone mein samay kyun lagता hai, aur aap ek planned change safely kaise karते ho?',
        a: 'DNS has no mechanism to push an update or to invalidate cached records. Every record is served with a TTL, and when a resolver fetches a record it may serve that cached value to all its clients, without rechecking, until the TTL elapses. So when the authoritative record is changed, every resolver that already holds the old value keeps serving it until its own cached copy expires, and since resolvers fetched the record at different moments they expire at different moments, producing a gradual and uneven switchover rather than an instant one. This waiting-out of caches is what "propagation" refers to; for changes to nameserver delegation it can take a day or two because TLD nameserver records typically carry long TTLs. A planned change is done in three phases around the TTL. Well before the change, the record\'s TTL is lowered to a small value such as sixty seconds, and you wait for the previous long TTL to expire everywhere so that all caches are now operating on the short TTL. Then the record is changed, and it takes effect everywhere within one short-TTL interval, which you verify against several independent public resolvers. The old target is kept running until traffic to it falls to zero, because some resolvers exceed the stated TTL. Finally, after the change is confirmed stable, the TTL is raised back to a normal value to reduce query load and improve resilience to an authoritative-server outage.',
        aHi: 'DNS ke paas ek update push karने ya cached records invalidate karने ka koi mechanism nahi. Har record ek TTL ke saath serve hoता hai, aur jab ek resolver ek record fetch karता hai ye us cached value ko apne saare clients ko serve kar sakта hai jab tak TTL elapse nahi hoता. To jab authoritative record change hoता hai, har resolver jo purani value already rakhता hai ise serve karता rehта hai. Ye caches ka wait-out "propagation" hai. Ek planned change TTL ke around teen phases mein hoता hai. Change se pehle, TTL ek small value (60s) mein lower kiya jाता hai, aur aap wait karते ho purana long TTL expire hone ke liye. Phir record change hoता hai. Purana target running rakhа jाता hai jab tak traffic zero nahi ho jата. Aakhir mein, TTL wapas raise kiya jाता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, match each record type to its job: A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, CAA. Then state the two hard rules about CNAME.',
        taskHi: 'Ek comment mein, har record type ko iske job se match karो. Phir CNAME ke do hard rules batao.',
        hint: 'A = name→IPv4. AAAA = name→IPv6. CNAME = name→another name (alias). MX = mail servers (with priority). TXT = free text (SPF/DKIM/verification). NS = which servers are authoritative for a zone. SOA = zone metadata (serial, TTLs). PTR = IP→name (reverse). CAA = which CAs may issue certs. CNAME rules: (1) a name with a CNAME can have NO other records; (2) a CNAME cannot be at the zone apex (bare `example.com`) — use A or an ALIAS/ANAME.',
        hintHi: 'A = name→IPv4. AAAA = name→IPv6. CNAME = alias. MX = mail servers. TXT = free text. NS = authoritative servers. SOA = zone metadata. PTR = reverse. CAA = allowed CAs. CNAME rules: (1) koi doosre records nahi; (2) zone apex par nahi.',
      },
      {
        task: 'Write (in a comment) the timeline for moving `www.example.com` to a new load balancer, with the exact TTL steps and what you verify at each point. Explain why lowering the TTL the same day as the change does not help.',
        taskHi: 'Ek comment mein, `www.example.com` ko ek naye load balancer par move karने ki timeline likho.',
        hint: 'T-3d: lower TTL 3600→60. T-2h: `dig www.example.com` from 3+ public resolvers, confirm TTL ≤ 60 everywhere (the old 3600 has aged out). T-0: change the record. T+2min: `dig @1.1.1.1 / @8.8.8.8 / @9.9.9.9` all show the new target. Keep the old LB serving until its traffic → 0. T+2d: raise TTL 60→3600. Same-day lowering fails because caches that fetched under the old 3600 keep serving the old value for up to 3600s regardless — DNS has no invalidation.',
        hintHi: 'T-3d: TTL 3600→60. T-2h: 3+ public resolvers se verify TTL ≤ 60. T-0: record change. T+2min: naya target verify. Purana LB running rakhо jab tak traffic → 0. T+2d: TTL wapas 3600. Same-day lowering fail hoती hai kyunki purane 3600 ke under cached copies 3600s tak purani value serve karती hain.',
      },
      {
        task: 'A name resolves fine from your laptop but CI gets NXDOMAIN for it. In a comment, name the likely cause, the two `dig` commands that would confirm it, and two ways to fix it.',
        taskHi: 'Ek name aapके laptop se fine resolve hoता hai par CI ise NXDOMAIN paता hai. Ek comment mein, likely cause batao.',
        hint: 'Likely cause: split-horizon DNS — the name exists only in the internal/private view; your laptop uses the internal resolver, CI (external network) uses a public resolver. Confirm: `dig @<internal-resolver> name +short` (returns an IP) vs `dig @1.1.1.1 name +short` (NXDOMAIN). Fixes: (a) attach the internal/private hosted zone to the CI network too, or give CI a route to the internal resolver; (b) add a public record; (c) run the affected step from inside the network.',
        hintHi: 'Likely cause: split-horizon DNS — name sirf internal view mein exist karता hai. Confirm: `dig @<internal-resolver> name` vs `dig @1.1.1.1 name`. Fixes: (a) private hosted zone CI network se bhi attach karो; (b) ek public record add karो; (c) step network ke andar se chalाओ.',
      },
    ],

    keyTakeaways: [
      'DNS maps NAMES → RECORDS (not just IPs). A ZONE holds: A (→IPv4), AAAA (→IPv6), CNAME (→another NAME, an alias), MX (mail servers, lower priority number first), TXT (SPF/DKIM/domain-verification), NS (which servers are AUTHORITATIVE for the zone), SOA (zone metadata: serial + TTLs, one per zone), SRV (service→host+port), PTR (IP→name, reverse), CAA (which CAs may issue certs).',
      'A LOOKUP: your systems ask a RECURSIVE RESOLVER (8.8.8.8 / 1.1.1.1 / your ISP\'s / your company\'s) which (1) checks its CACHE, then walks: (2) a ROOT server → "the `.com` TLD servers are here"; (3) a `.com` TLD server → "`example.com`\'s NS records" (the DELEGATION); (4) the zone\'s nameserver → the actual record + a TTL; (5) CACHES everything for its TTL. RECURSIVE resolver = does the walk + caches; AUTHORITATIVE server (root/TLD/your provider) = answers only for its slice, refers you onward.',
      'TTL & CACHING is where "propagation" comes from: every record has a TTL (seconds); a resolver serves the cached value to everyone until its copy expires; there is NO push / NO invalidation — you WAIT OUT the TTL. PLANNED CHANGE = 3 phases: (1) DAYS BEFORE, lower the TTL (e.g. →60s) and wait for the OLD long TTL to expire everywhere so the short TTL is genuinely in effect (lowering it the same day does NOTHING for already-cached copies); (2) make the change — caches now hold the old value for ≤ the short TTL; (3) after confirming from multiple public resolvers, raise the TTL back. Keep the OLD target serving until its traffic → 0 (some resolvers exceed the TTL). NS/delegation changes can take 24-48h (TLD NS records have 1-2 day TTLs).',
      'CNAME RULES (hard): (1) a name with a CNAME can have NO other records (no A/MX/TXT alongside); (2) a CNAME CANNOT be at the ZONE APEX (bare `example.com`) — the apex must carry SOA + NS. Apex pointing at a hostname-only LB → use an A record (if the IP is stable) or the provider\'s ALIAS / ANAME / "CNAME flattening" pseudo-record (Route 53, Cloudflare, etc.) which resolves the target and serves its A/AAAA at the apex.',
      'SPLIT-HORIZON DNS: the same name resolves differently (or only exists) depending on who asks — internal clients get a private IP, external get the public one. Deliberate + useful, but a frequent cause of "works on the VPN, not off it" and of `dig` from your laptop ≠ `dig` from a server. DEBUG with `dig`: `dig +short`, `dig <name> A` (shows TTLs), `dig +trace` (walk it yourself), `dig @1.1.1.1 <name>` (ask a specific resolver), `dig @<authoritative-ns> <name>` (bypass ALL caches). KEY MOVE: compare what YOUR resolver returns vs what the AUTHORITATIVE server returns — if authoritative shows the new value and yours shows old, you\'re just waiting on caches; if authoritative ALSO shows old, your edit didn\'t land (check the zone + bump the serial). Always note WHICH resolver answered.',
    ],
    keyTakeawaysHi: [
      'DNS NAMES → RECORDS map karता hai. Ek ZONE rakhता hai: A (→IPv4), AAAA (→IPv6), CNAME (→doosरा NAME, alias), MX (mail servers), TXT (SPF/DKIM/verification), NS (zone ke liye AUTHORITATIVE servers), SOA (zone metadata), SRV, PTR (reverse), CAA.',
      'EK LOOKUP: aapके systems ek RECURSIVE RESOLVER se poochте hain jo (1) CACHE check karता hai, phir walk: (2) ROOT server → `.com` TLD servers; (3) `.com` TLD → `example.com` ke NS records (DELEGATION); (4) zone ka nameserver → actual record + TTL; (5) sab кुछ CACHE karता hai. RECURSIVE = walk karता hai + caches; AUTHORITATIVE (root/TLD/provider) = sirf apni slice ke liye answer karता hai.',
      'TTL & CACHING "propagation" ka source hai: har record ka ek TTL; ek resolver cached value sabko serve karता hai jab tak copy expire nahi; KOI push / KOI invalidation nahi — aap TTL WAIT OUT karते ho. PLANNED CHANGE = 3 phases: (1) DINON PEHLE TTL lower karो (→60s) aur wait karो purana long TTL expire hone ke liye (same-day lowering already-cached copies ke liye KUCH nahi karता); (2) change karो; (3) confirm ke baad TTL wapas raise karो. PURANA target running rakhо jab tak traffic → 0.',
      'CNAME RULES (hard): (1) ek CNAME waale name ke KOI doosre records nahi; (2) ek CNAME ZONE APEX par NAHI (`example.com` khud) — apex ko SOA + NS chahiye. Apex ek hostname-only LB par → ek A record (agar IP stable) ya provider ka ALIAS / ANAME / "CNAME flattening".',
      'SPLIT-HORIZON DNS: same name kaun poochता hai iske hisaab se alag resolve hoता hai — internal clients private IP, external public. "VPN par works, off nahi" ka frequent cause. `dig` se DEBUG: `dig +short`, `dig +trace`, `dig @1.1.1.1 <name>`, `dig @<authoritative-ns> <name>` (ALL caches bypass). KEY MOVE: AAPKA resolver vs AUTHORITATIVE server compare karो. Hamesha note karो kaunसा resolver ne answer diya.',
    ],
  },
];
