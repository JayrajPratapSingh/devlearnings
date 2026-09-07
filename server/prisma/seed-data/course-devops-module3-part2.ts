/**
 * DevOps Complete Course — Module 3: Networking for DevOps, lessons 4-6.
 *
 * Lesson 4: HTTP & TLS — HTTP versions, methods/status/headers, the TLS handshake,
 *           certificates & chains & SANs, ACME. openssl cert generation + inspection
 *           VERIFIED against a real openssl; the rest is realistic curl output.
 * Lesson 5: Load balancing & reverse proxies — L4 vs L7, algorithms, health checks,
 *           TLS termination, X-Forwarded-*, nginx/Caddy/Envoy. PROSE.
 * Lesson 6: Firewalls, ports, NAT & debugging the network — the 3 firewall layers,
 *           stateful vs stateless, a "can't connect" decision tree. PROSE + a bit verified.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'ops-http-and-tls',
    title: 'HTTP & TLS',
    titleHi: 'HTTP Aur TLS',
    description: 'HTTP is the request/response protocol every web service speaks; TLS is the layer that encrypts it and proves the server\'s identity. Knowing the methods, status classes, key headers, the handshake, and how certificates chain to a trusted root is what lets you read a `curl -v` and diagnose a broken deployment.',
    descriptionHi: 'HTTP wo request/response protocol hai jo har web service bolती hai; TLS wo layer hai jo ise encrypt karता hai aur server ki identity prove karता hai. Methods, status classes, key headers, handshake, aur certificates ek trusted root tak kaise chain karте hain jaanna wo hai jo aapको ek `curl -v` read karने aur ek broken deployment diagnose karने deता hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 4,

    analogy: {
      en: '**HTTP is the format of a formal letter; TLS is the tamper-proof diplomatic pouch it travels in.** The letter has a fixed structure: an instruction line ("PLEASE SEND record 42" — the method and path), a block of "re:" and "from:" notes (headers), a blank line, then the body. The reply comes back with a three-digit outcome code stamped at the top — 200s "done", 300s "look elsewhere", 400s "your letter was wrong", 500s "we broke". The pouch (TLS) is what makes it safe to send over public post: before anything goes in, the receiving embassy shows a credential signed by an authority both sides recognise (the certificate chain), and a shared wax seal is agreed that only these two parties can make or read. If the credential is expired, forged, or issued to a different embassy, the courier refuses to hand over the letter at all.',
      hi: '**HTTP ek formal letter ka format hai; TLS wo tamper-proof diplomatic pouch hai jismें ye travel karता hai.** Letter ki ek fixed structure hai: ek instruction line ("PLEASE SEND record 42" — method aur path), "re:" aur "from:" notes ka ek block (headers), ek blank line, phir body. Reply ek three-digit outcome code ke saath wapas aata hai top par stamped — 200s "done", 300s "kahin aur dekhо", 400s "aapका letter galat tha", 500s "hamне toड़ा". Pouch (TLS) wo hai jo ise public post par bhejना safe banаता hai: kुछ andar jaane se pehle, receiving embassy ek credential dikhती hai jo ek authority dwara signed hai jise dono sides recognise karते hain (certificate chain). Agar credential expired, forged, ya ek alag embassy ko issued hai, courier letter hand karने se poori tarah refuse karता hai.',
    },

    simple: `**HTTP REQUEST:**
\`\`\`
GET /api/orders?limit=10 HTTP/1.1      <- method  path+query  version
Host: api.example.com                  <- which site (required in HTTP/1.1)
Authorization: Bearer eyJ...           <- headers: metadata about the request
Accept: application/json
                                       <- blank line = end of headers
(body, for POST/PUT/PATCH)
\`\`\`
**HTTP RESPONSE:**
\`\`\`
HTTP/1.1 200 OK                        <- version  status-code  reason
Content-Type: application/json
Cache-Control: max-age=60
                                       <- blank line
{"orders": [...]}                      <- body
\`\`\`

**METHODS:**  GET (read, safe, cacheable) · POST (create / non-idempotent action) ·
PUT (replace, idempotent) · PATCH (partial update) · DELETE (idempotent) · HEAD (GET
without a body) · OPTIONS (capabilities / CORS preflight).

**STATUS CLASSES:**
\`\`\`
2xx  success      200 OK · 201 Created · 204 No Content
3xx  redirect     301 moved permanently · 302 found · 304 not modified (use your cache)
4xx  YOU erred    400 bad request · 401 unauthenticated · 403 forbidden · 404 · 409 conflict · 429 too many
5xx  SERVER erred 500 · 502 bad gateway · 503 unavailable · 504 gateway timeout
\`\`\`

**KEY HEADERS:** Host, Content-Type, Content-Length, Authorization, Cache-Control,
ETag / If-None-Match, Location (on 3xx/201), Set-Cookie, X-Forwarded-For/-Proto,
Accept-Encoding / Content-Encoding (gzip, br).

**HTTP VERSIONS:**
\`\`\`
HTTP/1.1  text, one request at a time per connection (keep-alive reuses the connection)
HTTP/2    binary, MULTIPLEXED (many requests concurrently on ONE TCP connection), header compression
HTTP/3    over QUIC (UDP) — no TCP head-of-line blocking, faster connection setup
\`\`\`

**TLS HANDSHAKE (TLS 1.3, one round trip):**
\`\`\`
client -> ClientHello   (TLS versions, cipher suites, key share, SNI = the hostname)
server -> ServerHello   (chosen cipher, key share) + Certificate + CertificateVerify + Finished
client -> (validates the cert) Finished
both  -> application data, encrypted with the derived shared key
\`\`\`

**CERTIFICATE VALIDATION — the client checks ALL of:**
\`\`\`
1. CHAIN   leaf -> intermediate(s) -> a root in the client's trust store, each signature valid
2. DATES   notBefore <= now <= notAfter        (an EXPIRED cert is the #1 real-world TLS outage)
3. NAME    the requested hostname matches a Subject Alternative Name (SAN) in the leaf cert
4. (revocation, via OCSP/CRL — best-effort)
\`\`\`

**ACME / Let's Encrypt:** automated 90-day certs. The client proves control of the
domain (HTTP-01: serve a token at /.well-known/acme-challenge/...; or DNS-01: publish a
TXT record) and the CA issues. A cron/agent renews at ~60 days. Never expires if the
automation works — and pages everyone if it doesn't.

**DEBUG:  curl -v https://host  ·  openssl s_client -connect host:443 -servername host  ·
openssl x509 -in cert.pem -noout -text -dates -ext subjectAltName**`,

    simpleHi: `**HTTP REQUEST:**
\`\`\`
GET /api/orders?limit=10 HTTP/1.1      <- method  path+query  version
Host: api.example.com                  <- kaunसी site (HTTP/1.1 mein required)
Authorization: Bearer eyJ...           <- headers
                                       <- blank line = headers ka end
(body, POST/PUT/PATCH ke liye)
\`\`\`
**HTTP RESPONSE:**  \`HTTP/1.1 200 OK\` + headers + blank line + body.

**METHODS:**  GET (read, safe) · POST (create) · PUT (replace, idempotent) · PATCH (partial) ·
DELETE · HEAD · OPTIONS (CORS preflight).

**STATUS CLASSES:**
\`\`\`
2xx  success      200 · 201 Created · 204 No Content
3xx  redirect     301 · 302 · 304 not modified
4xx  AAP erred    400 · 401 unauthenticated · 403 forbidden · 404 · 409 · 429 too many
5xx  SERVER erred 500 · 502 bad gateway · 503 unavailable · 504 gateway timeout
\`\`\`

**HTTP VERSIONS:**  HTTP/1.1 (text, ek request at a time; keep-alive connection reuse) ·
HTTP/2 (binary, MULTIPLEXED — ek TCP connection par kई requests) · HTTP/3 (QUIC/UDP par).

**TLS HANDSHAKE (TLS 1.3, ek round trip):**
\`\`\`
client -> ClientHello   (versions, ciphers, key share, SNI = hostname)
server -> ServerHello + Certificate + CertificateVerify + Finished
client -> (cert validate karता hai) Finished
both  -> encrypted application data
\`\`\`

**CERTIFICATE VALIDATION — client ye SAB check karता hai:**
\`\`\`
1. CHAIN   leaf -> intermediate(s) -> client ke trust store mein ek root
2. DATES   notBefore <= now <= notAfter        (ek EXPIRED cert #1 real-world TLS outage hai)
3. NAME    requested hostname leaf cert mein ek SAN se match karता hai
\`\`\`

**ACME / Let's Encrypt:** automated 90-day certs. Client domain ka control prove karता hai
(HTTP-01 ya DNS-01) aur CA issue karता hai. Ek agent ~60 days par renew karता hai.

**DEBUG:  curl -v https://host  ·  openssl s_client -connect host:443 -servername host  ·
openssl x509 -in cert.pem -noout -text**`,

    content: `## HTTP: the message format

Every HTTP exchange is a **request** and a **response**, each a block of text (HTTP/1.1) or its binary equivalent (HTTP/2+).

A **request**:

\`\`\`
GET /api/orders?limit=10 HTTP/1.1     ← request line: METHOD  target  version
Host: api.example.com                  ← headers (one per line, "Name: value")
Authorization: Bearer eyJ...
Accept: application/json
                                       ← empty line ends the headers
<body>                                 ← present for POST/PUT/PATCH
\`\`\`

A **response**:

\`\`\`
HTTP/1.1 200 OK                        ← status line: version  code  reason phrase
Content-Type: application/json
Content-Length: 348
                                       ← empty line
{"orders":[...]}                       ← body
\`\`\`

### Methods

| Method | Purpose | Safe? | Idempotent? |
|---|---|---|---|
| **GET** | retrieve a resource | yes | yes |
| **HEAD** | GET but headers only, no body | yes | yes |
| **POST** | create, or a non-idempotent action | no | no |
| **PUT** | create-or-replace at a known URL | no | **yes** |
| **PATCH** | partial update | no | not necessarily |
| **DELETE** | remove a resource | no | **yes** |
| **OPTIONS** | ask what's allowed; CORS preflight | yes | yes |

**Safe** = does not change server state. **Idempotent** = doing it twice has the same effect as once (important: a client that times out can safely retry an idempotent request; retrying a POST may double-charge a card).

### Status codes

| Class | Meaning | Common members |
|---|---|---|
| **1xx** | informational | 101 Switching Protocols (WebSocket upgrade) |
| **2xx** | success | 200 OK, 201 Created (+ \`Location\`), 204 No Content, 206 Partial Content |
| **3xx** | redirect / cache | 301 Moved Permanently, 302 Found, 304 Not Modified, 307/308 (preserve method) |
| **4xx** | the **client** did something wrong | 400 Bad Request, 401 Unauthorized (= unauthenticated), 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 422 Unprocessable, 429 Too Many Requests |
| **5xx** | the **server** failed | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

The 401/403 distinction: **401** means "I don't know who you are" (no or bad credentials — a login fixes it); **403** means "I know who you are and you may not do this" (a login will not help). The 502/503/504 trio is almost always a **proxy** reporting a backend problem (Lesson 5).

### Headers you must know

- **Host** / **:authority** — which site; mandatory, because one server hosts many.
- **Content-Type** — the body's media type (\`application/json\`, \`text/html\`, \`multipart/form-data\`).
- **Content-Length** / **Transfer-Encoding: chunked** — how the body's end is known.
- **Authorization** — credentials (\`Bearer <token>\`, \`Basic <base64>\`).
- **Cache-Control**, **ETag** + **If-None-Match**, **Last-Modified** + **If-Modified-Since** — caching and conditional requests; a matching ETag yields **304 Not Modified** with no body.
- **Location** — the target of a 3xx redirect, or the URL of a newly created resource on 201.
- **Set-Cookie** / **Cookie** — session state.
- **X-Forwarded-For**, **X-Forwarded-Proto**, **Forwarded** — added by proxies; the real client IP and scheme.
- **Accept-Encoding** / **Content-Encoding** — compression (\`gzip\`, \`br\`).
- **Access-Control-Allow-Origin** and friends — CORS.

## HTTP versions

| Version | Transport | Key property |
|---|---|---|
| **HTTP/1.0** | TCP, new connection per request | obsolete |
| **HTTP/1.1** | TCP, **keep-alive** reuses the connection | one request in flight at a time per connection; browsers open ~6 parallel connections. Text-based. |
| **HTTP/2** | TCP + TLS | **multiplexing**: many concurrent requests (streams) on **one** connection; binary framing; header compression (HPACK); server push (deprecated). Still suffers **TCP** head-of-line blocking — one lost packet stalls all streams. |
| **HTTP/3** | **QUIC** (over **UDP**) | streams are independent at the transport layer, so a lost packet stalls only its own stream; connection setup combines transport + TLS in one round trip; connection migration across IP changes. |

For operations: HTTP/2 between clients and your edge is standard; **internal** service-to-service often stays HTTP/1.1 or uses gRPC (which is HTTP/2). A proxy may accept HTTP/2 from clients and speak HTTP/1.1 to backends — normal.

## TLS: the handshake

TLS runs **over** the TCP connection and **under** HTTP. The **TLS 1.3** handshake (one round trip):

1. **ClientHello** — the client offers its supported TLS versions and cipher suites, sends a key share for the key exchange, and includes **SNI** (Server Name Indication) naming the host it wants, in the clear, so a server with many certificates picks the right one.
2. **ServerHello** — the server picks the version and cipher, sends its key share, then (encrypted from here on) its **Certificate** chain, a **CertificateVerify** (a signature proving it holds the certificate's private key), and **Finished**.
3. The client **validates the certificate** (below), sends its own **Finished**, and the connection is now encrypted with the derived shared key.

TLS 1.2 needed two round trips and is still common; TLS 1.3 dropped old ciphers and is the default in modern software. TLS below 1.2 is disabled.

## Certificate validation

When the server presents its certificate, the client checks **all** of:

1. **Chain of trust.** The server sends a **leaf** certificate (for \`api.example.com\`) plus one or more **intermediate** CA certificates. Each is signed by the next one up. The chain must terminate at a **root CA certificate in the client's trust store** (shipped with the OS / browser). A missing intermediate is a common server misconfiguration — it works in browsers (which cache intermediates) but fails from \`curl\` and other services.
2. **Validity dates.** \`notBefore ≤ now ≤ notAfter\`. An **expired certificate** is the single most common real-world TLS outage — the cert was valid when deployed and silently aged out. Automated renewal (ACME) plus expiry monitoring is the fix.
3. **Hostname match.** The hostname the client requested must match a **Subject Alternative Name (SAN)** entry in the leaf certificate. The old **Common Name (CN)** field is ignored by modern clients. \`*.example.com\` matches one label (\`api.example.com\` but not \`a.b.example.com\` and not the apex \`example.com\`).
4. **Revocation** (best-effort): OCSP or CRL checks whether the CA revoked the cert early. OCSP stapling has the server include a fresh proof so the client need not contact the CA.

Any failure aborts the handshake with a specific error: \`certificate has expired\`, \`unable to get local issuer certificate\` (broken chain), \`no alternative certificate subject name matches\` (wrong host), \`self-signed certificate\`.

## ACME / Let's Encrypt

**ACME** is the protocol behind free, automated certificates (Let's Encrypt, ZeroSSL, and every cloud provider's managed certs). The flow:

1. Your ACME client (\`certbot\`, \`lego\`, Caddy's built-in, cert-manager in Kubernetes) asks the CA for a certificate for \`api.example.com\`.
2. The CA issues a **challenge** to prove you control the domain:
   - **HTTP-01**: serve a specific token at \`http://api.example.com/.well-known/acme-challenge/<token>\`.
   - **DNS-01**: publish a specific \`TXT\` record at \`_acme-challenge.api.example.com\`. This one can issue **wildcard** certs and works when port 80 is not reachable.
3. The CA verifies the challenge and issues a certificate valid for **90 days**.
4. The client **auto-renews** at around 60 days (a third of the lifetime remaining).

When the automation works the certificate never visibly expires. When it breaks — the renewal cron dies, the HTTP-01 path gets blocked by a new redirect rule, the DNS credentials rotate — the certificate expires weeks later and every client fails at once. Monitor **days-until-expiry** as a metric and alert well before zero.

## Debugging

\`\`\`
curl -v https://api.example.com/            # the whole handshake + request + response
curl -vI https://api.example.com/           # headers only (HEAD)
curl --resolve api.example.com:443:1.2.3.4 https://api.example.com/   # test a specific IP w/o DNS
openssl s_client -connect api.example.com:443 -servername api.example.com   # raw TLS, full chain
openssl s_client ... </dev/null 2>/dev/null | openssl x509 -noout -dates -text   # inspect the served cert
echo | openssl s_client -connect host:443 -servername host 2>/dev/null | openssl x509 -noout -checkend 604800   # expires within 7 days?
\`\`\``,

    contentHi: `## HTTP: message format

Har HTTP exchange ek **request** aur ek **response** hai. Ek **request**: request line (METHOD target version), headers (\`Name: value\`), ek empty line, phir body (POST/PUT/PATCH ke liye). Ek **response**: status line (version code reason), headers, empty line, body.

### Methods

**GET** (retrieve, safe, idempotent) · **HEAD** (GET, headers only) · **POST** (create, NOT idempotent) · **PUT** (create-or-replace, **idempotent**) · **PATCH** (partial) · **DELETE** (**idempotent**) · **OPTIONS** (CORS preflight). **Safe** = server state nahi badalता. **Idempotent** = do baar karна ek baar jaisा — ek client jo timeout hoता hai safely ek idempotent request retry kar sakта hai; ek POST retry karना ek card double-charge kar sakта hai.

### Status codes

- **2xx** success: 200, 201 Created (+ \`Location\`), 204 No Content.
- **3xx** redirect/cache: 301, 302, 304 Not Modified.
- **4xx** **client** ne kुछ galat kiya: 400, 401 (unauthenticated), 403 (forbidden), 404, 409, 429.
- **5xx** **server** failed: 500, 502 Bad Gateway, 503, 504 Gateway Timeout.

**401** = "main nahi jानता aap kaun ho" (login fix karता hai); **403** = "main jानता hoon aap kaun ho aur aap ye nahi kar sakते" (login madad nahi karega). **502/503/504** lagभag hamesha ek **proxy** ek backend problem report kar raha.

### Headers

**Host**, **Content-Type**, **Content-Length**, **Authorization**, **Cache-Control** + **ETag**/**If-None-Match** (matching ETag → **304**), **Location** (3xx/201), **Set-Cookie**, **X-Forwarded-For**/**-Proto**, **Accept-Encoding**/**Content-Encoding** (gzip, br).

## HTTP versions

- **HTTP/1.1**: TCP, **keep-alive** connection reuse; ek request at a time per connection. Text.
- **HTTP/2**: TCP+TLS, **multiplexing** (ek connection par kई concurrent streams), binary, header compression. Abhi bhi **TCP** head-of-line blocking.
- **HTTP/3**: **QUIC** (UDP) par — streams transport layer par independent, faster setup.

## TLS: handshake

TLS TCP connection ke **over** aur HTTP ke **under** chalता hai. **TLS 1.3** handshake (ek round trip): **ClientHello** (versions, ciphers, key share, **SNI** = hostname) → **ServerHello** + **Certificate** chain + **CertificateVerify** + **Finished** → client cert **validate** karता hai, apna **Finished** bhejता hai → encrypted.

## Certificate validation

Client ye **sab** check karता hai:
1. **Chain of trust**: leaf → intermediate(s) → client ke trust store mein ek **root CA**. Ek missing intermediate ek common misconfiguration hai — browsers mein kaam karता hai, \`curl\` se fail.
2. **Validity dates**: \`notBefore ≤ now ≤ notAfter\`. Ek **expired certificate** #1 real-world TLS outage hai.
3. **Hostname match**: requested hostname leaf cert mein ek **SAN** entry se match karे. Purana **CN** field modern clients dwara ignore kiya jाता hai. \`*.example.com\` ek label match karता hai.
4. **Revocation** (best-effort): OCSP/CRL.

## ACME / Let's Encrypt

**ACME** free, automated certificates ke peeche protocol hai. Client CA se ek cert maangता hai → CA ek **challenge** issue karता hai (HTTP-01: ek token \`/.well-known/acme-challenge/\` par serve karो; DNS-01: ek \`TXT\` record publish karो) → CA verify karके ek **90-day** cert issue karता hai → client ~60 days par **auto-renew** karता hai. Jab automation kaam karता hai cert kabhi visibly expire nahi hoता; jab ye toड़ता hai har client ek saath fail hoता hai. **days-until-expiry** monitor karो.

## Debugging

\`curl -v https://host\` · \`openssl s_client -connect host:443 -servername host\` (raw TLS, full chain) · \`openssl x509 -in cert.pem -noout -dates -text\` (cert inspect).`,

    examples: [
      {
        title: 'Generating and inspecting a TLS certificate with openssl',
        titleHi: 'openssl se ek TLS certificate generate aur inspect karna',
        code: `# VERIFY
exec 2>&1
# a tiny CA, then a leaf cert for api.example.com signed by it — the real chain shape.
openssl genrsa -out ca.key 2048 >/dev/null 2>&1
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 \\
  -subj "/CN=Example Internal Root CA" -out ca.crt 2>/dev/null

openssl genrsa -out leaf.key 2048 >/dev/null 2>&1
openssl req -new -key leaf.key -subj "/CN=api.example.com" -out leaf.csr 2>/dev/null

cat > leaf.ext <<'EOF'
subjectAltName = DNS:api.example.com, DNS:www.api.example.com
EOF

openssl x509 -req -in leaf.csr -CA ca.crt -CAkey ca.key -CAcreateserial \\
  -days 90 -sha256 -extfile leaf.ext -out leaf.crt 2>/dev/null

echo "--- subject / issuer ---"
openssl x509 -in leaf.crt -noout -subject -issuer
echo "--- key + signature ---"
openssl x509 -in leaf.crt -noout -text | grep -E 'Public-Key|Signature Algorithm' | head -2 | sed 's/^ *//'
echo "--- SANs ---"
openssl x509 -in leaf.crt -noout -ext subjectAltName | grep -v '^X509'
echo "--- chain verifies against the CA? ---"
openssl verify -CAfile ca.crt leaf.crt
echo "--- hostname coverage ---"
for h in api.example.com www.api.example.com other.example.com; do
  openssl x509 -in leaf.crt -noout -checkhost "$h" | sed "s/^/  $h: /"
done`,
        output: `--- subject / issuer ---
subject=CN=api.example.com
issuer=CN=Example Internal Root CA
--- key + signature ---
Signature Algorithm: sha256WithRSAEncryption
Public-Key: (2048 bit)
--- SANs ---
    DNS:api.example.com, DNS:www.api.example.com
--- chain verifies against the CA? ---
leaf.crt: OK
--- hostname coverage ---
  api.example.com: Hostname api.example.com does match certificate
  www.api.example.com: Hostname www.api.example.com does match certificate
  other.example.com: Hostname other.example.com does NOT match certificate`,
        explain: 'This builds the exact structure a real HTTPS certificate has: a root CA certificate that signs a leaf certificate for the service hostname. The root is self-signed and long-lived; in production it would be an intermediate belonging to a public CA whose root is in every trust store, but the shape is identical. The leaf is created from a certificate signing request that carries the hostname, and the Subject Alternative Name extension is added at signing time because that is the field modern clients check for hostname matching — the Common Name in the subject is shown but ignored for validation. Inspecting the leaf shows its subject and the issuer that signed it, its key size and signature algorithm, and its list of covered names. Verifying the leaf against the CA certificate confirms the signature chain is intact, which is exactly what a client does when it walks from leaf to root. The per-hostname check demonstrates the matching rule directly: the two names listed in the SAN extension are accepted and any other name is rejected, regardless of what the Common Name says. A served certificate that fails any of these — an untrusted issuer, an expired date, a name not in the SAN list — aborts the TLS handshake with an error naming that specific cause.',
        explainHi: 'Ye exact structure banаता hai jo ek real HTTPS certificate ke paas hai: ek root CA certificate jo service hostname ke liye ek leaf certificate sign karता hai. Root self-signed aur long-lived hai; production mein ye ek public CA ka ek intermediate hoता, par shape identical hai. Leaf ek certificate signing request se create hoता hai jo hostname carry karता hai, aur Subject Alternative Name extension signing time par add kiya jाता hai kyunki wo field modern clients hostname matching ke liye check karते hain — subject mein Common Name dikhाया jाता hai par validation ke liye ignore. Leaf ko CA certificate ke against verify karना confirm karता hai ki signature chain intact hai. Per-hostname check matching rule directly demonstrate karता hai: SAN extension mein listed do names accepted hain aur koi doosरा name rejected hai.',
      },
      {
        title: 'curl -v: reading an HTTP/2 request over TLS',
        titleHi: 'curl -v: TLS par ek HTTP/2 request read karna',
        code: `$ curl -v https://api.example.com/orders 2>&1

* Connected to api.example.com (203.0.113.10) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):        <- ClientHello (incl. SNI + key share)
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
*  subject: CN=api.example.com
*  subjectAltName: host "api.example.com" matched cert's "api.example.com"   <- name check OK
*  start date: Jun 10 00:00:00 2025 GMT
*  expire date: Sep  8 23:59:59 2025 GMT                 <- dates check OK
*  issuer: C=US, O=Let's Encrypt, CN=E5
*  SSL certificate verify ok.                            <- chain check OK
* ALPN: server accepted h2                               <- negotiated HTTP/2
> GET /orders HTTP/2
> host: api.example.com
> authorization: Bearer eyJ...
>
< HTTP/2 200
< content-type: application/json
< cache-control: max-age=30
< etag: "a1b2c3"
<
{"orders":[...]}`,
        output: `The trace shows, in order: the TCP connection, ALPN offering HTTP/2 and HTTP/1.1, the TLS 1.3 handshake messages, the served certificate with its subject/SANs/validity/issuer, the three validation checks passing ("matched", the dates, "verify ok"), ALPN settling on h2, then the HTTP/2 request ('>') and response ('<') including caching headers. A failure replaces one of the "OK" lines with a specific error and the request stops there.`,
        explain: 'The verbose trace is the certificate-validation checklist made visible. After the TCP connection is established, ALPN is the mechanism by which client and server agree on the HTTP version during the TLS handshake rather than after it, so curl lists what it offers and later reports what the server accepted. The TLS handshake lines name each message in sequence. When the certificate arrives, curl prints the fields it validates: the subject and the Subject Alternative Names, with an explicit line stating that the requested hostname matched one of them; the start and expiry dates, which must bracket the current time; and the issuer, followed by the summary line confirming the chain of trust led to a trusted root. Only when all three pass does curl print that verification succeeded and proceed. The lines beginning with a greater-than sign are the request curl sent over the now-encrypted, multiplexed HTTP/2 connection, and the lines beginning with a less-than sign are the response status and headers. If validation had failed, the matching "OK" line would instead be an error such as an expired date or an issuer that could not be verified, and no request would be sent.',
        explainHi: 'Verbose trace certificate-validation checklist ko visible banаया gaya hai. TCP connection establish hone ke baad, ALPN wo mechanism hai jisse client aur server TLS handshake ke dauран HTTP version par agree karते hain, to curl list karता hai kya offer karता hai aur baad mein report karता hai server ne kya accept kiya. Jab certificate aata hai, curl wo fields print karता hai jo ye validate karता hai: subject aur SANs, ek explicit line ke saath jo kehти hai requested hostname unmें se ek se match hua; start aur expiry dates; aur issuer, jiske baad summary line chain of trust confirm karती hai. Sirf jab teenों pass hoते hain curl print karता hai ki verification succeeded. Agar validation fail hoता, matching "OK" line ek error hoती.',
      },
    ],

    mistakes: [
      {
        wrong: `# a server that "works in Chrome but curl and the mobile app get TLS errors"
$ curl https://api.example.com
curl: (60) SSL certificate problem: unable to get local issuer certificate
# "curl is broken" / "add -k" (--insecure)  <- NO. -k disables the check entirely.
# the real cause: the server sends ONLY the leaf cert, not the intermediate(s).
# Chrome has the intermediate cached from another site; curl and the app don't.`,
        right: `# configure the server to send the FULL CHAIN: leaf + intermediate(s), in order.
# most ACME clients produce a 'fullchain.pem' for exactly this — use THAT, not 'cert.pem'.
#   ssl_certificate  /etc/letsencrypt/live/api.example.com/fullchain.pem;   # nginx
# verify what the server actually sends:
$ openssl s_client -connect api.example.com:443 -servername api.example.com -showcerts
#   -> you should see the leaf AND each intermediate up to (not including) the root.
$ curl -v https://api.example.com   # now: "SSL certificate verify ok."`,
        why: 'A TLS server must send not only its own leaf certificate but also the chain of intermediate CA certificates that link the leaf to a trusted root, because the client validates by following signatures from the leaf upward and needs every link to do so. The root itself is not sent — the client already has it in its trust store — but the intermediates are not universally distributed and must come from the server. When a server sends only the leaf, validation still succeeds for some clients: browsers cache intermediate certificates they have seen from other sites and can fill the gap, and some operating systems fetch missing intermediates automatically. Other clients, including curl and many language HTTP libraries and mobile apps, do neither, so they cannot complete the chain and report an inability to get the issuer certificate. The symptom is therefore inconsistent by client, which misleads people into blaming the client. The fix is to configure the server with the full chain file that ACME clients produce for this purpose, and the check is to inspect what the server actually presents with a tool that shows every certificate in the response. Disabling verification is not a fix; it removes the protection TLS provides against a forged or intercepted connection.',
        whyHi: 'Ek TLS server ko na sirf apna leaf certificate balki intermediate CA certificates ki chain bhi bhejनी chahiye jo leaf ko ek trusted root se link karती hai, kyunki client leaf se upar signatures follow karके validate karता hai aur ise har link ki zaroorat hai. Root khud nahi bheja jाता — client ke paas ye apne trust store mein already hai — par intermediates universally distributed nahi hain. Jab ek server sirf leaf bhejता hai, validation kुछ clients ke liye phir bhi succeed karता hai: browsers intermediate certificates cache karते hain. Doosre clients, jismें curl aur bahut sी language HTTP libraries aur mobile apps, aisा nahi karते. Fix server ko full chain file se configure karना hai. Verification disable karना ek fix nahi hai.',
      },
      {
        wrong: `# retrying a failed POST automatically, like a GET
async function call() {
  for (let i = 0; i < 3; i++) {
    try { return await http.post('/api/charge', { amount: 5000 }); }
    catch { /* timeout — try again */ }
  }
}
# -> the first POST actually SUCCEEDED server-side; the response just timed out
//    on the way back. the retry charges the card a second (and third) time.`,
        right: `# only auto-retry IDEMPOTENT methods (GET, PUT, DELETE, HEAD) on timeout/5xx/network.
# for POST, make it idempotent with an idempotency key the server de-dupes on:
await http.post('/api/charge', { amount: 5000 },
  { headers: { 'Idempotency-Key': stableUuidForThisAttempt } });
# the server records the key; a repeat with the same key returns the FIRST result,
# it does not charge again. (Stripe, PayPal, etc. all work this way.)`,
        why: 'A client that does not receive a response cannot tell whether the request failed or whether it succeeded and only the response was lost, because both look identical from the client side: a timeout or a dropped connection. For an idempotent method — one where performing the operation a second time has the same effect as performing it once — this ambiguity is harmless, so retrying is safe and is the standard way to ride out transient failures. POST is not idempotent: it is defined as potentially creating a new resource or triggering an action each time it is processed, so a retry after a lost response can cause the action to happen again — a second charge, a duplicate order, a repeated email. Automatic retry logic must therefore be restricted to idempotent methods. When an operation that is naturally a POST needs to be retriable, the standard solution is an idempotency key: the client generates a unique identifier for the logical operation and sends it with every attempt, and the server records which keys it has processed and, on seeing a repeat, returns the stored result of the first execution instead of executing again. This makes the POST effectively idempotent from the client\'s perspective.',
        whyHi: 'Ek client jo ek response receive nahi karता ye nahi bता sakта ki request fail hui ya ye succeed hui aur sirf response lost hua, kyunki dono client side se identical dikhते hain: ek timeout ya ek dropped connection. Ek idempotent method ke liye — jahaan operation do baar perform karना ek baar jaisा hai — ye ambiguity harmless hai, to retry safe hai. POST idempotent nahi hai: ye har baar potentially ek naya resource create karता hai ya ek action trigger karता hai, to ek lost response ke baad ek retry action ko phir se karवा sakта hai — ek doosरा charge. Automatic retry logic idempotent methods tak restricted honा chahiye. Jab ek POST retriable honा chahiye, standard solution ek idempotency key hai: client ek unique identifier generate karता hai aur ise har attempt ke saath bhejता hai, aur server record karता hai kaunसे keys process kiye.',
      },
      {
        wrong: `# treating an expired cert as a mystery outage
# 02:00 alert: "api.example.com — connection errors from all clients"
# on-call restarts the app. restarts the LB. checks the database. nothing.
# 03:30 someone runs: curl -v https://api.example.com
#   *  expire date: <yesterday>
#   * SSL certificate problem: certificate has expired
# -> the ACME renewal cron had been failing silently for 3 weeks (the HTTP-01
//    path broke when someone added a catch-all HTTPS redirect).`,
        right: `# 1. monitor days-until-expiry as a METRIC, alert at 14 days, page at 3:
$ echo | openssl s_client -connect api.example.com:443 -servername api.example.com \\
    2>/dev/null | openssl x509 -noout -checkend $((14*86400)) \\
    && echo "OK >14d" || echo "EXPIRES SOON"
# 2. alert on RENEWAL failures (certbot/cert-manager emit events/logs) — not just expiry.
# 3. in the incident: 'curl -v' is line one. an expired cert says so immediately.`,
        why: 'A certificate expiry is a fully predictable event with a known date, yet it repeatedly causes emergency incidents because the failure mode is silent until the moment it is total. The certificate works perfectly until its expiry timestamp, then every client rejects it simultaneously, and if attention goes first to the application, the load balancer, and the database, considerable time passes before anyone checks the certificate. Two monitoring practices prevent this. The first is to track the remaining validity of the served certificate as a continuous metric and alert while there is still ample time to act, for instance two weeks out, escalating as the margin shrinks. The second is to alert on failures of the renewal automation itself rather than only on the eventual expiry, because renewal typically runs a month before expiry and a failure there is the real early warning — the automation can be broken for weeks while the certificate is still valid, as happens when a challenge path stops working after an unrelated configuration change. During an incident, a verbose request is the fastest possible check and names an expired certificate explicitly, so it belongs at the very start of the runbook rather than after the infrastructure has been examined.',
        whyHi: 'Ek certificate expiry ek poori tarah predictable event hai ek known date ke saath, phir bhi ye baar-baar emergency incidents cause karता hai kyunki failure mode silent hai jab tak ye total nahi ho jата. Certificate perfectly kaam karता hai apne expiry timestamp tak, phir har client ise simultaneously reject karता hai. Do monitoring practices ise prevent karती hain. Pehli served certificate ki remaining validity ko ek continuous metric ke roop mein track karना aur alert karना jab abhi act karने ke liye kaafi samay hai (do hafte). Doosri renewal automation ke failures par alert karना, sirf eventual expiry par nahi, kyunki renewal typically expiry se ek mahina pehle chalता hai. Ek incident ke dauran, ek verbose request sabse fast possible check hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `days_until_cert_expiry` Prometheus metric with an alert at 14 days and a page at 3** — plus a separate alert on `cert-manager` / `certbot` renewal-failure events, so the automation breaking is caught weeks before any cert expires.',
        hi: '**Ek `days_until_cert_expiry` metric ek alert ke saath 14 days par** — plus renewal-failure events par ek alag alert, to automation toड़ना koi cert expire hone se hafton pehle catch hoता hai.',
      },
      {
        en: '**"Works in the browser, 500s from the backend service"** traced to a missing intermediate cert — the server was configured with `cert.pem` instead of `fullchain.pem`; browsers filled the gap from cache, the service-to-service client could not.',
        hi: '**"Browser mein works, backend service se 500s"** ek missing intermediate cert tak traced — server `cert.pem` se configured tha `fullchain.pem` ke bजaay.',
      },
      {
        en: '**A payment double-charge incident** — a client library auto-retried POST `/charge` on a gateway timeout; the first call had succeeded. Fixed by requiring an `Idempotency-Key` on all mutating endpoints and de-duping server-side.',
        hi: '**Ek payment double-charge incident** — ek client library ne ek gateway timeout par POST `/charge` auto-retry kiya. Fixed by ek `Idempotency-Key` require karके.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a client check when it validates a server\'s TLS certificate, and what does each failure look like?',
        qHi: 'Ek client kya check karता hai jab ye ek server ka TLS certificate validate karता hai, aur har failure kaisा dikhता hai?',
        a: 'The client performs several independent checks and all must pass. First, the chain of trust: the server sends a leaf certificate for its hostname plus one or more intermediate CA certificates, each signed by the next, and the client verifies those signatures up to a root certificate that is present in its own trust store. If an intermediate is missing, the client cannot complete the chain and reports being unable to get the local issuer certificate — a failure that is inconsistent across clients because browsers cache intermediates and other clients do not. Second, the validity period: the current time must be at or after the notBefore date and at or before the notAfter date, and an expired certificate produces a clear "certificate has expired" error and is the most common real-world TLS outage. Third, the hostname: the name the client requested must match one of the Subject Alternative Name entries in the leaf certificate, with wildcards matching a single label; a mismatch reports that no alternative subject name matches, which happens when a certificate is served for the wrong host or a new hostname was added without reissuing. Fourth, best-effort revocation checking through OCSP or CRL, to catch a certificate the CA invalidated before its expiry. A self-signed certificate fails the first check because its issuer is not a trusted CA, reported as a self-signed certificate error.',
        aHi: 'Client kई independent checks perform karता hai aur sab pass honे chahiye. Pehla, chain of trust: server ek leaf certificate plus ek ya zyada intermediate CA certificates bhejता hai, har agle dwara signed, aur client un signatures ko ek root certificate tak verify karता hai jo iske apne trust store mein present hai. Agar ek intermediate missing hai, client chain complete nahi kar sakта. Doosra, validity period: current time notBefore aur notAfter ke beech honा chahiye; ek expired certificate #1 real-world TLS outage hai. Teesra, hostname: requested name leaf certificate mein ek SAN entry se match karे. Chौthा, best-effort revocation checking OCSP/CRL ke through. Ek self-signed certificate pehla check fail karता hai.',
      },
      {
        q: 'Which HTTP methods are safe to retry automatically, and how do you make a POST retriable?',
        qHi: 'Kaunसे HTTP methods automatically retry karना safe hai, aur aap ek POST ko retriable kaise banाते ho?',
        a: 'Automatic retry is safe only for idempotent methods, where processing the request a second time has the same effect as processing it once. GET, HEAD, PUT, and DELETE are idempotent: reading twice, replacing with the same content twice, or deleting an already-deleted resource all leave the same end state. POST is not idempotent, because it is defined as potentially creating a new resource or performing an action each time. The problem this creates is that a client whose request times out or loses its connection cannot distinguish a request that failed from one that succeeded with a lost response, so retrying a POST can repeat the action — a second payment, a duplicate record. To make an operation that is naturally a POST safely retriable, you use an idempotency key: the client generates a unique identifier for the logical operation and includes it as a header on every attempt, and the server maintains a record of processed keys. On the first request with a given key the server performs the operation and stores the result against the key; on any subsequent request with the same key it returns the stored result without performing the operation again. From the client\'s perspective the POST is now idempotent, so retries are safe. Payment providers implement exactly this.',
        aHi: 'Automatic retry sirf idempotent methods ke liye safe hai, jahaan request ko doosri baar process karना ek baar jaisा hai. GET, HEAD, PUT, aur DELETE idempotent hain. POST idempotent nahi hai, kyunki ye har baar potentially ek naya resource create karता hai ya ek action perform karता hai. Problem ye hai ki ek client jiski request timeout hoती hai ek failed request ko ek succeeded se distinguish nahi kar sakта jiska response lost hua, to ek POST retry karना action repeat kar sakта hai. Ek POST ko safely retriable banाने ke liye, aap ek idempotency key istemal karते ho: client ek unique identifier generate karता hai aur ise har attempt par ek header ke roop mein include karता hai, aur server processed keys ka ek record maintain karता hai. Same key ke saath ek subsequent request par ye stored result return karта hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, sort these into 4xx vs 5xx and say who must fix each: 400, 401, 403, 404, 429, 500, 502, 503, 504. Then explain the 401 vs 403 difference in one line.',
        taskHi: 'Ek comment mein, inhe 4xx vs 5xx mein sort karो aur batao har ek kaun fix karे.',
        hint: '4xx = the CLIENT sent a bad request, the client fixes it: 400 malformed, 401 not authenticated (log in), 403 authenticated but not allowed, 404 no such resource, 429 slow down. 5xx = the SERVER/infra failed, the operator fixes it: 500 app bug, 502 proxy got a bad/failed response from a backend, 503 no healthy backend, 504 backend too slow. 401 vs 403: 401 = "I don\'t know who you are" (credentials fix it); 403 = "I know who you are and you still can\'t" (credentials won\'t help).',
        hintHi: '4xx = CLIENT ne bad request bheja: 400, 401 (login), 403 (allowed nahi), 404, 429. 5xx = SERVER failed: 500 app bug, 502 proxy ko bad response mila, 503 no healthy backend, 504 backend too slow. 401 vs 403: 401 = "kaun ho pata nahi"; 403 = "pata hai aur phir bhi nahi".',
      },
      {
        task: 'Using openssl, generate a self-signed cert for `test.local` with a SAN, then (in a comment) give the three commands to check: its validity dates, its SAN list, and whether it expires within 30 days.',
        taskHi: 'openssl se, `test.local` ke liye ek SAN ke saath ek self-signed cert generate karो.',
        hint: 'Generate: `openssl req -x509 -newkey rsa:2048 -nodes -keyout k.pem -out c.pem -days 90 -subj "/CN=test.local" -addext "subjectAltName=DNS:test.local"`. Dates: `openssl x509 -in c.pem -noout -dates`. SANs: `openssl x509 -in c.pem -noout -ext subjectAltName`. Expiry check: `openssl x509 -in c.pem -noout -checkend $((30*86400)) && echo OK || echo "expires <30d"`.',
        hintHi: 'Generate: `openssl req -x509 -newkey rsa:2048 -nodes -keyout k.pem -out c.pem -days 90 -subj "/CN=test.local" -addext "subjectAltName=DNS:test.local"`. Dates: `-noout -dates`. SANs: `-noout -ext subjectAltName`. Expiry: `-noout -checkend $((30*86400))`.',
      },
      {
        task: 'In a comment, explain the ACME flow (HTTP-01 and DNS-01 challenges, cert lifetime, renewal timing) and why "the cert expired" is usually really "the renewal automation broke weeks ago" — and the two things you should monitor.',
        taskHi: 'Ek comment mein, ACME flow samjhाओ aur kyun "cert expired" usually "renewal automation hafton pehle toड़ा" hai.',
        hint: 'ACME: client requests a cert → CA issues a challenge to prove domain control: HTTP-01 (serve a token at `/.well-known/acme-challenge/<token>` over port 80) or DNS-01 (publish a `TXT` at `_acme-challenge.<name>` — can do wildcards, works without port 80) → CA verifies, issues a 90-day cert → client auto-renews at ~60 days. The cert only visibly expires if renewal has been failing silently (broken challenge path, rotated DNS creds, dead cron). Monitor: (1) days-until-expiry of the SERVED cert (alert ~14d, page ~3d); (2) renewal-job success/failure events — this catches it weeks earlier.',
        hintHi: 'ACME: client cert maangता hai → CA ek challenge issue karता hai (HTTP-01: token `/.well-known/acme-challenge/` par; DNS-01: `TXT` record) → CA verify karके 90-day cert issue karता hai → client ~60 days par auto-renew. Cert sirf visibly expire hoता hai agar renewal silently fail ho raha tha. Monitor: (1) served cert ki days-until-expiry; (2) renewal-job success/failure events.',
      },
    ],

    keyTakeaways: [
      'HTTP = request (METHOD path+query version / headers `Name: value` / blank line / body) + response (version STATUS reason / headers / blank line / body). METHODS: GET (read, safe, idempotent), HEAD, POST (create/action — NOT idempotent), PUT (create-or-replace — idempotent), PATCH (partial), DELETE (idempotent), OPTIONS (CORS preflight). SAFE = no state change; IDEMPOTENT = twice ≡ once.',
      'STATUS CLASSES: 2xx success (200, 201 +`Location`, 204). 3xx redirect/cache (301, 302, 304 Not Modified — use your cache). 4xx the CLIENT erred (400 malformed, 401 UNAUTHENTICATED — log in, 403 FORBIDDEN — login won\'t help, 404, 409 conflict, 429 too many). 5xx the SERVER failed (500 app bug; 502/503/504 = almost always a PROXY reporting a backend problem — bad response / no healthy backend / too slow).',
      'HTTP VERSIONS: 1.1 = text, keep-alive reuses the connection, one request in flight at a time. 2 = binary, MULTIPLEXED (many concurrent streams on ONE TCP connection), header compression — but still TCP head-of-line blocking. 3 = over QUIC (UDP), streams independent at the transport layer, faster setup. A proxy speaking h2 to clients and h1.1 to backends is normal.',
      'TLS runs OVER TCP and UNDER HTTP. TLS 1.3 handshake (one round trip): ClientHello (versions, ciphers, key share, SNI = the hostname in the clear) → ServerHello + Certificate chain + CertificateVerify + Finished → client validates the cert, sends Finished → encrypted. CERTIFICATE VALIDATION checks ALL of: (1) CHAIN — leaf → intermediate(s) → a root in the client\'s trust store, every signature valid (a MISSING INTERMEDIATE works in browsers but fails curl/services — configure the server with `fullchain.pem`, not `cert.pem`); (2) DATES — notBefore ≤ now ≤ notAfter (an EXPIRED cert is the #1 real-world TLS outage); (3) NAME — the requested host matches a SAN in the leaf (the CN field is ignored by modern clients; `*.example.com` matches one label). Failures: `certificate has expired`, `unable to get local issuer certificate`, `no alternative certificate subject name matches`, `self-signed certificate`.',
      'ACME (Let\'s Encrypt etc.): client requests a cert → CA issues a domain-control challenge — HTTP-01 (serve a token at `/.well-known/acme-challenge/<token>`) or DNS-01 (publish a `TXT` record — does wildcards, works without port 80) → CA issues a 90-DAY cert → client AUTO-RENEWS at ~60 days. "The cert expired" is almost always "the renewal automation broke weeks ago" (dead cron, blocked challenge path, rotated creds). MONITOR: (1) days-until-expiry of the SERVED cert (alert ~14d, page ~3d); (2) renewal-job failure events (catches it weeks earlier). Only auto-retry IDEMPOTENT methods on timeout/5xx — for POST, use an `Idempotency-Key` the server de-dupes on, or a retry becomes a double-charge. DEBUG: `curl -v`, `openssl s_client -connect host:443 -servername host -showcerts`, `openssl x509 -noout -dates -text -ext subjectAltName`, `openssl x509 -noout -checkend $((14*86400))`.',
    ],
    keyTakeawaysHi: [
      'HTTP = request (METHOD path version / headers / blank line / body) + response (version STATUS reason / headers / blank line / body). METHODS: GET (safe, idempotent), POST (NOT idempotent), PUT (idempotent), PATCH, DELETE (idempotent), OPTIONS. SAFE = no state change; IDEMPOTENT = do baar ≡ ek baar.',
      'STATUS: 2xx success (200, 201, 204). 3xx redirect/cache (301, 302, 304). 4xx CLIENT erred (400, 401 UNAUTHENTICATED — login, 403 FORBIDDEN — login madad nahi, 404, 409, 429). 5xx SERVER failed (500 app bug; 502/503/504 = lagभag hamesha ek PROXY ek backend problem report kar raha).',
      'HTTP VERSIONS: 1.1 = text, keep-alive, ek request at a time. 2 = binary, MULTIPLEXED (ek TCP connection par kई streams), header compression — par abhi bhi TCP head-of-line blocking. 3 = QUIC (UDP) par, streams independent, faster setup.',
      'TLS TCP ke OVER aur HTTP ke UNDER chalता hai. TLS 1.3 handshake: ClientHello (versions, ciphers, key share, SNI) → ServerHello + Certificate chain + CertificateVerify + Finished → client cert validate karता hai → encrypted. VALIDATION ye SAB check karта hai: (1) CHAIN — leaf → intermediate(s) → client ke trust store mein ek root (ek MISSING INTERMEDIATE browsers mein kaam karता hai par curl/services fail — server ko `fullchain.pem` se configure karो); (2) DATES — notBefore ≤ now ≤ notAfter (ek EXPIRED cert #1 real-world TLS outage); (3) NAME — requested host leaf mein ek SAN se match (CN field ignore; `*.example.com` ek label match). Failures: `certificate has expired`, `unable to get local issuer certificate`, `no alternative certificate subject name matches`.',
      'ACME (Let\'s Encrypt): client cert maangता hai → CA ek domain-control challenge issue karता hai — HTTP-01 (ek token serve karो) ya DNS-01 (ek `TXT` record — wildcards, port 80 ke bina) → CA ek 90-DAY cert issue karता hai → client ~60 days par AUTO-RENEW karता hai. "Cert expired" lagभag hamesha "renewal automation hafton pehle toड़ा". MONITOR: (1) SERVED cert ki days-until-expiry; (2) renewal-job failure events. Sirf IDEMPOTENT methods timeout/5xx par auto-retry karो — POST ke liye ek `Idempotency-Key` istemal karो, warna ek retry ek double-charge ban jата hai. DEBUG: `curl -v`, `openssl s_client -connect host:443 -servername host -showcerts`, `openssl x509 -noout -dates -text`.',
    ],
  },

  {
    slug: 'ops-load-balancing-and-reverse-proxies',
    title: 'Load Balancing & Reverse Proxies',
    titleHi: 'Load Balancing Aur Reverse Proxies',
    description: 'A reverse proxy sits in front of your application and owns the connection from the outside world: it terminates TLS, spreads requests across backends, checks their health, routes by path or host, and enforces limits. Understanding L4 vs L7, health checks, and connection draining is what makes deploys and failures non-events.',
    descriptionHi: 'Ek reverse proxy aapki application ke saamne baithता hai aur bahar ki duniya se connection own karता hai: ye TLS terminate karता hai, requests ko backends mein spread karता hai, unki health check karता hai, path ya host se route karता hai, aur limits enforce karता hai. L4 vs L7, health checks, aur connection draining samajhना wo hai jo deploys aur failures ko non-events banаता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**The front desk of a busy clinic.** Patients (requests) never walk straight to a doctor. They arrive at one reception desk (the single public address), which knows which doctors are currently in and free (health checks), sends each patient to one of them by some fair rule (the load-balancing algorithm), and remembers "you saw Dr. Rao last time, go back to her" if your visit needs continuity (session affinity). When a doctor is going off shift, reception simply stops sending them new patients and lets them finish the ones already in the room (connection draining) — nobody in a consultation is thrown out. Reception also handles the shared paperwork once for everybody: checking IDs at the door (TLS termination), turning people away when the waiting room is full (rate limiting), and directing "billing" to a different corridor than "radiology" (path routing).',
      hi: '**Ek busy clinic ka front desk.** Patients (requests) kabhi seedhे ek doctor ke paas nahi jाते. Wo ek reception desk par aate hain (single public address), jo jानता hai kaunसे doctors abhi hain aur free hain (health checks), har patient ko unmें se ek ko kisi fair rule se bhejता hai (load-balancing algorithm), aur "aapne pichli baar Dr. Rao ko dekha, unke paas wapas jाओ" remember karता hai agar aapki visit ko continuity chahiye (session affinity). Jab ek doctor shift se ja raha hoता hai, reception simply unhe naye patients bhejना band kar deता hai aur unhe wo finish karने deता hai jo already room mein hain (connection draining). Reception shared paperwork bhi sabke liye ek baar handle karता hai: door par IDs check karना (TLS termination), logon ko turn away karना jab waiting room full hai (rate limiting).',
    },

    simple: `**REVERSE PROXY = one public front door for many backend servers.** (A FORWARD proxy
sits in front of CLIENTS; a REVERSE proxy sits in front of SERVERS.)

**WHAT IT DOES:**
\`\`\`
- LOAD BALANCE   spread requests across N backends by an algorithm
- HEALTH CHECK   only send traffic to backends currently passing a probe
- TLS TERMINATE  decrypt once at the edge; speak plain HTTP to backends (or re-encrypt)
- ROUTE          /api -> api-svc  ; /  -> web-svc  ; host a.com -> pool A
- ADD HEADERS    X-Forwarded-For / -Proto / -Host  (so the app sees the real client)
- PROTECT        rate limit, request size/time limits, connection limits, WAF
- CACHE / COMPRESS  serve cache hits and static files, gzip/br responses
- BUFFER         absorb slow clients so backends aren't tied up
\`\`\`

**L4 vs L7:**
\`\`\`
L4 (transport)  forwards TCP/UDP by IP:port. fast, protocol-agnostic, no HTTP visibility.
                can't route by path/host, can't add headers, can't terminate TLS (passes it through).
                e.g. AWS NLB, HAProxy in TCP mode, kube-proxy.
L7 (application) parses HTTP. routes by path/host/header, terminates TLS, adds headers,
                retries, rate-limits, canary by header. e.g. nginx, Caddy, Envoy, AWS ALB, Traefik.
\`\`\`

**LOAD-BALANCING ALGORITHMS:**  round-robin (default) · least-connections (good for
uneven request cost) · least-response-time · IP-hash / consistent-hash (stickiness
without cookies) · weighted (bigger boxes get more) · power-of-two-choices (pick 2
at random, send to the less loaded — near-optimal, cheap).

**HEALTH CHECKS:**
\`\`\`
- ACTIVE: the LB probes GET /healthz every few seconds; N failures -> mark DOWN, stop routing.
- PASSIVE: the LB watches real traffic; too many 5xx/timeouts -> eject the backend for a while.
- LIVENESS ("is the process up?") vs READINESS ("can it serve requests right now?" — deps ok,
  warm, not shutting down). Route on READINESS.
\`\`\`

**SESSION AFFINITY (sticky sessions):** pin a client to one backend (cookie or IP hash).
Needed only for in-memory session state — better to make backends STATELESS (session in
Redis/JWT) so any backend can serve any request.

**CONNECTION DRAINING (graceful deploy):** on shutdown, the backend fails its readiness
check -> the LB stops sending NEW requests -> in-flight requests finish -> then the
process exits. No dropped requests during a deploy. (Ties to SIGTERM, Module 2.)

**X-FORWARDED-FOR:** the proxy appends the client IP. Trust it ONLY from your own proxy
(a known IP), and take the right element — or a client spoofs it.`,

    simpleHi: `**REVERSE PROXY = kई backend servers ke liye ek public front door.** (Ek FORWARD proxy
CLIENTS ke saamne baithता hai; ek REVERSE proxy SERVERS ke saamne.)

**YE KYA KARTA HAI:**
\`\`\`
- LOAD BALANCE   requests ko N backends mein ek algorithm se spread karो
- HEALTH CHECK   sirf un backends ko traffic bhejो jo abhi ek probe pass kar rahे hain
- TLS TERMINATE  edge par ek baar decrypt karो; backends se plain HTTP bolो
- ROUTE          /api -> api-svc ; / -> web-svc ; host a.com -> pool A
- ADD HEADERS    X-Forwarded-For / -Proto / -Host
- PROTECT        rate limit, request size/time limits, WAF
- CACHE / COMPRESS  cache hits aur static files serve karो
\`\`\`

**L4 vs L7:**
\`\`\`
L4 (transport)  TCP/UDP ko IP:port se forward karता hai. fast, protocol-agnostic, koi HTTP visibility nahi.
                path/host se route nahi kar sakta, headers add nahi kar sakta.
L7 (application) HTTP parse karता hai. path/host/header se route, TLS terminate, headers add, retries.
                e.g. nginx, Caddy, Envoy, AWS ALB, Traefik.
\`\`\`

**ALGORITHMS:**  round-robin · least-connections · least-response-time · IP-hash/consistent-hash ·
weighted · power-of-two-choices.

**HEALTH CHECKS:**  ACTIVE (LB \`GET /healthz\` probe karता hai; N failures -> DOWN) · PASSIVE
(LB real traffic dekhता hai; bahut 5xx -> eject). LIVENESS ("process up?") vs READINESS
("abhi serve kar sakта hai?" — deps ok, warm, shutting down nahi). READINESS par route karो.

**SESSION AFFINITY:** ek client ko ek backend par pin karो. Sirf in-memory session state ke liye —
better: backends STATELESS banाओ (session Redis/JWT mein).

**CONNECTION DRAINING (graceful deploy):** shutdown par, backend apna readiness check fail karता hai
-> LB naye requests band karता hai -> in-flight finish -> process exit. Deploy ke dauran koi dropped
requests nahi.

**X-FORWARDED-FOR:** proxy client IP append karता hai. Ise SIRF apne proxy se trust karो.`,

    content: `## What a reverse proxy is

A **forward proxy** sits in front of *clients* and makes requests on their behalf (a corporate web filter, \`HTTP_PROXY\`). A **reverse proxy** sits in front of *servers*: clients connect to it, believing it is the service, and it forwards to one of several backends. Every production web service has one — nginx, Caddy, HAProxy, Envoy, Traefik, or a cloud load balancer (AWS ALB/NLB, GCP LB, Azure) — and in Kubernetes it is the **Ingress controller** or the **service mesh** sidecar.

It exists because a pile of responsibilities are better handled **once, at the edge**, than in every application instance:

- **Load balancing** — distribute requests across backends so one machine's failure or slowness does not take down the service, and capacity scales by adding backends.
- **Health checking** — route only to backends that are currently healthy.
- **TLS termination** — do the handshake and decryption once; backends speak plain HTTP on the internal network (or the proxy re-encrypts to them for zero-trust).
- **Routing** — send \`/api/*\` to one backend pool and \`/\` to another; send \`shop.example.com\` and \`admin.example.com\` to different pools; all on one IP and port.
- **Request/response modification** — add \`X-Forwarded-*\` headers, strip hop-by-hop headers, rewrite paths, inject security headers.
- **Protection** — rate limiting, connection limits, request body-size and timeout limits, a Web Application Firewall.
- **Caching and compression** — serve cache hits and static assets without touching the app; gzip/brotli responses.
- **Buffering** — read a slow client's request fully before opening a backend connection, so a slow client cannot tie up a backend worker.

## L4 versus L7

The single most important distinction:

**Layer 4 (transport) load balancing** forwards **TCP/UDP connections** by IP and port. It does not parse what flows through — it does not know it is HTTP. It is fast, has low overhead, is protocol-agnostic (works for databases, gRPC, anything), and preserves the client connection largely as-is. But it **cannot** route by URL path or hostname, cannot add HTTP headers, and cannot terminate TLS (it passes the encrypted bytes straight through). Examples: AWS NLB, HAProxy in \`mode tcp\`, Kubernetes \`kube-proxy\`, IPVS.

**Layer 7 (application) load balancing** parses **HTTP**. It can route by path, host, method, or header; terminate TLS; add and modify headers; retry failed idempotent requests against another backend; do sticky sessions by cookie; split traffic for canary releases by percentage or header; and enforce HTTP-aware rate limits. It costs more per request and must understand the protocol version. Examples: nginx, Caddy, Envoy, HAProxy in \`mode http\`, AWS ALB, Traefik, every Kubernetes Ingress controller.

Real architectures often use **both**: an L4 load balancer spreads raw connections across a fleet of L7 proxies, which then do the HTTP-aware work. In AWS, an NLB in front of a set of nginx pods, or an ALB directly — depending on whether you need the ALB's HTTP features.

## Load-balancing algorithms

| Algorithm | How it picks | Best for |
|---|---|---|
| **Round-robin** | next backend in rotation | uniform request cost, uniform backends (the default) |
| **Weighted round-robin** | rotation, but bigger backends appear more often | a mixed fleet |
| **Least connections** | the backend with the fewest active requests | uneven request durations (some requests slow) |
| **Least response time** | fewest connections + lowest latency | latency-sensitive services |
| **IP hash / consistent hash** | hash of client IP (or a key) → a backend | stickiness without cookies; cache-friendly routing |
| **Power of two choices** | pick 2 backends at random, send to the less loaded | near-optimal balancing at almost no coordination cost — common in modern proxies |

Round-robin is fine until request costs vary a lot; then a backend can get a run of expensive requests while its neighbour idles, and **least-connections** or **power-of-two-choices** distributes real load better.

## Health checks

The proxy must know which backends can serve traffic **right now**.

- **Active health checks**: the proxy periodically sends a probe request (\`GET /healthz\` every 2–10 s). After N consecutive failures the backend is marked **unhealthy** and removed from rotation; after M consecutive successes it is added back. Tunables: interval, timeout, unhealthy threshold, healthy threshold.
- **Passive health checks (outlier detection)**: the proxy watches real traffic and, if a backend returns too many 5xx or times out too often in a window, **ejects** it for a cooldown period, then tentatively returns it. Catches failures a synthetic probe would miss.

And the crucial application-side distinction:

- **Liveness** — "is the process alive?" If this fails, the right action is to **restart** the instance. It should check almost nothing — just that the event loop is responsive. A liveness check that also checks the database will restart-loop your whole fleet during a database blip.
- **Readiness** — "can this instance serve a request successfully right now?" It checks that dependencies are reachable, caches are warm, migrations are done, and the instance is **not shutting down**. The load balancer routes based on **readiness**. An instance can be live but not ready (starting up, or draining).

## Session affinity (sticky sessions)

By default any backend can serve any request. If a backend keeps **per-user state in its own memory** (an in-process session store, a WebSocket connection, an upload in progress), the load balancer must send that user's subsequent requests to the **same** backend — **session affinity**, implemented by a cookie the proxy sets or by hashing the client IP.

Stickiness is a constraint, not a feature: it defeats even load distribution, it breaks when that backend is redeployed (the state is gone), and it complicates scaling. The better design is **stateless backends** — session data in a shared store (Redis, a database) or carried in a signed token (JWT) — so any backend serves any request and affinity is unnecessary. Keep affinity only for genuinely connection-bound things like WebSockets.

## Connection draining / graceful shutdown

When a backend is being removed — a deploy, a scale-down, a node drain — requests already in flight must be allowed to finish. The sequence:

1. The orchestrator sends the instance a signal to stop (SIGTERM in Kubernetes; Module 2).
2. The instance **immediately starts failing its readiness check** (or is removed from the LB's target list).
3. The load balancer notices and **stops routing new requests** to it. Existing connections continue.
4. The instance finishes its in-flight requests, closes idle keep-alive connections, and then exits — within a grace period (e.g. 30 s), after which it is force-killed.

Getting this right means **zero failed requests during a deploy**. Getting it wrong — the process exits on SIGTERM immediately, or there is no readiness gate — means every deploy drops the requests that were mid-flight, showing up as a small spike of 502s correlated with each rollout. In Kubernetes the pieces are a \`preStop\` hook (often a short sleep so the Endpoints update propagates), \`terminationGracePeriodSeconds\`, and the app handling SIGTERM by closing its listener but finishing active requests.

## X-Forwarded-For and the real client IP

Because the backend's TCP connection comes from the proxy, the backend must learn the real client IP from a header the proxy adds:

- **X-Forwarded-For**: a comma-separated list — \`client, proxy1, proxy2\` — each proxy appends the address it received the connection from.
- **X-Forwarded-Proto**: \`http\` or \`https\` — the scheme the *client* used, needed because the backend sees only the proxy's plain HTTP.
- **X-Forwarded-Host**, and the standardized **Forwarded** header carrying all of it.

The security rule: a client can send its own \`X-Forwarded-For\`, so the backend must **only trust the header when the connection comes from a known proxy address**, and must take the correct element — typically the rightmost one that is not itself a trusted proxy. Frameworks have a "trusted proxies" setting for exactly this; misconfiguring it either lets clients spoof their IP (bypassing IP rate limits and allowlists) or makes the app log the proxy's IP for everyone.

## The common proxies

- **nginx** — the workhorse. Fast, battle-tested, config-file driven. Reverse proxy, load balancer, static file server, cache. Reload is graceful. Weak spot: dynamic reconfiguration (needs a reload; commercial nginx+ or OpenResty/Lua for dynamism).
- **Caddy** — automatic HTTPS (built-in ACME) is the headline feature; simple config; good defaults. Popular for small-to-medium deployments.
- **HAProxy** — the load balancer specialist. Excellent L4 and L7, rich balancing algorithms, detailed stats. Less of a general web server.
- **Envoy** — the modern, dynamic, API-driven proxy. Hot reconfiguration without dropping connections, deep observability (per-upstream stats, distributed tracing), the data plane for most service meshes (Istio, Consul) and many API gateways. Heavier to operate standalone.
- **Traefik** — auto-discovers backends from Docker/Kubernetes labels; popular for its zero-config feel in container environments.
- **Cloud LBs** — AWS ALB (L7) / NLB (L4), GCP, Azure: managed, integrated with the cloud's health checks, autoscaling, and certificates.`,

    contentHi: `## Ek reverse proxy kya hai

Ek **forward proxy** *clients* ke saamne baithता hai. Ek **reverse proxy** *servers* ke saamne baithता hai: clients ise connect karते hain, believing ye service hai, aur ye kई backends mein se ek ko forward karता hai. Har production web service mein ek hoता hai — nginx, Caddy, HAProxy, Envoy, Traefik, ya ek cloud load balancer — aur Kubernetes mein ye **Ingress controller** hai.

Ye exist karता hai kyunki responsibilities ka ek dher **ek baar, edge par** better handle hoता hai: **load balancing**, **health checking**, **TLS termination** (handshake ek baar; backends plain HTTP bolते hain), **routing** (\`/api/*\` ek pool ko, \`/\` doosरे ko), **request/response modification** (\`X-Forwarded-*\` headers), **protection** (rate limiting, WAF), **caching aur compression**, **buffering** (ek slow client ko fully padhо backend connection kholने se pehle).

## L4 versus L7

**Layer 4 (transport) load balancing** **TCP/UDP connections** ko IP aur port se forward karता hai. Ye parse nahi karता ki kya flow karता hai. Ye fast hai, protocol-agnostic hai. Par ye URL path ya hostname se route **nahi** kar sakта, HTTP headers add nahi kar sakта, TLS terminate nahi kar sakта. Examples: AWS NLB, HAProxy \`mode tcp\`, \`kube-proxy\`.

**Layer 7 (application) load balancing** **HTTP** parse karता hai. Ye path, host, method, ya header se route kar sakта hai; TLS terminate; headers add aur modify; failed idempotent requests retry; canary releases ke liye traffic split. Examples: nginx, Caddy, Envoy, AWS ALB, Traefik.

Real architectures aksar **dono** istemal karते hain: ek L4 load balancer raw connections ko L7 proxies ke ek fleet mein spread karता hai.

## Load-balancing algorithms

**Round-robin** (rotation mein agla backend — default) · **Weighted round-robin** · **Least connections** (fewest active requests — uneven durations ke liye) · **Least response time** · **IP hash / consistent hash** (cookies ke bina stickiness) · **Power of two choices** (2 random pick karो, kम loaded ko bhejो — near-optimal, cheap).

## Health checks

- **Active health checks**: proxy periodically ek probe request bhejता hai (\`GET /healthz\`). N failures ke baad backend **unhealthy** mark hoता hai.
- **Passive health checks**: proxy real traffic dekhता hai aur, agar ek backend bahut 5xx return karता hai, ise ek cooldown ke liye **eject** karता hai.

**Liveness** — "kya process alive hai?" Fail → **restart**. Ye lagभag kुछ nahi check karे. **Readiness** — "kya ye instance abhi ek request serve kar sakта hai?" Ye check karता hai ki dependencies reachable hain aur instance **shutting down nahi** hai. Load balancer **readiness** ke basis par route karता hai.

## Session affinity

Default se koi bhi backend koi bhi request serve kar sakта hai. Agar ek backend **apni memory mein per-user state** rakhता hai, load balancer ko us user ki subsequent requests **same** backend ko bhejنी chahiye — **session affinity**. Stickiness ek constraint hai, ek feature nahi. Better design **stateless backends** hai — session data ek shared store (Redis) mein ya ek signed token (JWT) mein.

## Connection draining / graceful shutdown

Jab ek backend remove ho raha hai: (1) orchestrator ek stop signal bhejता hai (SIGTERM). (2) instance **turant apna readiness check fail karना shuru karता hai**. (3) load balancer **naye requests routing band karता hai**. (4) instance apne in-flight requests finish karता hai, phir exit karता hai. Ise sahi karना matlab **deploy ke dauran zero failed requests**. Ise galat karना matlab har deploy mid-flight requests drop karता hai (502s ki ek spike).

## X-Forwarded-For

Backend ko real client IP ek header se seekhना chahiye jo proxy add karता hai: **X-Forwarded-For** (comma-separated list), **X-Forwarded-Proto** (\`http\`/\`https\`), **X-Forwarded-Host**. Security rule: ek client apna khud ka \`X-Forwarded-For\` bhej sakта hai, to backend ko header **sirf tab trust karना chahiye jab connection ek known proxy address se aata hai**.

## Common proxies

**nginx** (workhorse — fast, config-file), **Caddy** (automatic HTTPS), **HAProxy** (load balancer specialist), **Envoy** (modern, dynamic, service-mesh data plane), **Traefik** (auto-discovers backends), **Cloud LBs** (AWS ALB/NLB, managed).`,

    examples: [
      {
        title: 'An nginx reverse proxy: routing, upstreams, health, forwarded headers',
        titleHi: 'Ek nginx reverse proxy: routing, upstreams, health, forwarded headers',
        code: `upstream api_backend {
    least_conn;                            # algorithm: fewest active connections
    server 10.0.10.11:8080 max_fails=3 fail_timeout=15s;   # passive health check
    server 10.0.10.12:8080 max_fails=3 fail_timeout=15s;
    server 10.0.10.13:8080 backup;         # only used if all primaries are down
    keepalive 32;                          # reuse connections to backends
}

server {
    listen 443 ssl;
    server_name api.example.com;
    ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;   # FULL chain
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location /healthz { return 200 "ok\\n"; }          # the LB in front probes this

    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;  # append client IP
        proxy_set_header X-Forwarded-Proto $scheme;    # tell the backend it was https
        proxy_read_timeout 30s;                        # a backend slower than this -> 504
        proxy_next_upstream error timeout http_502 http_503;  # retry idempotent on another backend
    }

    location / {
        root /var/www/static;             # static files served directly, no backend
        try_files $uri $uri/ =404;
    }
}`,
        output: `This config: terminates TLS with the FULL chain; routes /api/ to a pool of three backends (two primary, one backup) balanced by least-connections; passively health-checks them (3 fails in 15s ejects a backend); sets Host + X-Forwarded-For + X-Forwarded-Proto so the app sees the real client and scheme; times out a backend at 30s (returning 504); retries a failed request against another backend for safe status codes; and serves static files directly without involving any backend.`,
        explain: 'The upstream block defines the backend pool and how it is used. The algorithm directive selects least-connections rather than the default round-robin, appropriate when request durations vary. Each server line carries passive health-check parameters: after three failed forwarding attempts within the timeout window the backend is removed from rotation for that window, then retried. One server is marked as backup, used only when every primary is unavailable, which is a simple form of overflow capacity. The keepalive setting lets nginx reuse TCP connections to the backends instead of opening a new one per request. In the server block, TLS is terminated using the full-chain file so that clients without cached intermediates still validate. A trivial health endpoint is exposed for whatever load balancer sits in front of nginx to probe. The main proxy location forwards to the pool and sets the forwarding headers: Host so the backend knows which site was requested, X-Forwarded-For appending the client address to any existing list, and X-Forwarded-Proto so the backend, which receives plain HTTP from nginx, knows the client used HTTPS and does not issue insecure redirects. The read timeout bounds how long nginx waits for a backend response before returning a gateway timeout, and the next-upstream directive lets nginx transparently retry against a different backend for errors and specific status codes, which is safe here because the listed conditions do not indicate the request was processed. The final location serves static files from disk with no backend involved at all.',
        explainHi: 'Upstream block backend pool define karता hai aur ise kaise istemal kiya jाता hai. Algorithm directive least-connections select karता hai, appropriate jab request durations vary karती hain. Har server line passive health-check parameters carry karती hai: teen failed attempts ke baad backend rotation se remove hoता hai. Ek server backup mark hai, sirf tab istemal jab har primary unavailable hai. Server block mein, TLS full-chain file istemal karके terminate hoता hai. Main proxy location pool ko forward karता hai aur forwarding headers set karता hai: Host, X-Forwarded-For (client address append karता hai), aur X-Forwarded-Proto (backend jानता hai client ne HTTPS istemal kiya). Read timeout bound karता hai nginx kitna wait karता hai. Next-upstream directive nginx ko ek alag backend ke against transparently retry karने deता hai. Final location disk se static files serve karता hai.',
      },
      {
        title: 'A deploy with and without connection draining',
        titleHi: 'Connection draining ke saath aur bina ek deploy',
        code: `# --- WITHOUT draining: the app exits immediately on SIGTERM ---
# t=0.00  orchestrator sends SIGTERM to pod-A
# t=0.00  pod-A process calls process.exit(0)     <- in-flight requests: DROPPED
# t=0.05  15 clients that had a request open on pod-A get: 502 Bad Gateway
# t=2.00  LB finally notices pod-A is gone and stops routing to it (too late)
# result: every rollout = a small burst of 502s. "deploys cause blips."

# --- WITH draining ---
# t=0.00  orchestrator sends SIGTERM to pod-A
# t=0.00  app: stop accepting NEW connections, start failing GET /ready with 503
# t=0.00  app: keep serving the 15 in-flight requests
# t=0.5-3 LB sees /ready fail (or Endpoints update), removes pod-A from rotation
#         -> NEW requests now go only to pod-B, pod-C
# t=4.20  pod-A finishes the last in-flight request, closes keep-alives, exits 0
# t=4.20  orchestrator sees clean exit (well within the 30s grace period)
# result: zero failed requests. the rollout is invisible to clients.

# Kubernetes pieces that make the WITH case work:
#   lifecycle.preStop: exec: ["sh","-c","sleep 5"]   # let Endpoints propagate first
#   terminationGracePeriodSeconds: 30
#   readinessProbe: httpGet /ready                    # app flips this to 503 on SIGTERM
#   app: on SIGTERM -> server.close() (stop new), await in-flight, then exit`,
        output: `Without draining, the process exits on SIGTERM while requests are still in flight, so those requests become 502s and every deploy produces a visible error spike. With draining, the app first makes itself unready so the load balancer stops sending new requests, then finishes the in-flight ones, then exits cleanly within the grace period - the deploy causes zero failed requests.`,
        explain: 'The difference between a deploy that drops requests and one that does not is entirely in what the application does when it receives the termination signal. If it exits immediately, every request currently being processed on that instance is abandoned mid-response, and the client or the proxy in front reports a gateway error; because the load balancer takes a short time to notice the instance is gone, there is also a brief window where it keeps sending new requests to an instance that is no longer there. The correct behaviour has the application, on receiving the signal, first stop accepting new connections and begin reporting itself as not ready, which causes the load balancer to remove it from rotation so new requests go only to the remaining instances. Meanwhile the application continues serving the requests that were already in progress, and only once those are complete does it exit, which it does well within the grace period the orchestrator allows before it would force-kill. In Kubernetes this requires several cooperating pieces: a preStop hook that pauses briefly so the endpoint removal propagates before the signal is even sent, a grace period long enough for real requests to finish, a readiness probe the application can fail on demand, and application code that handles the signal by closing its listener and draining rather than exiting.',
        explainHi: 'Ek deploy jo requests drop karता hai aur ek jo nahi karता ke beech difference poori tarah ismें hai ki application kya karता hai jab ye termination signal receive karता hai. Agar ye turant exit karता hai, har request jo abhi process ho raha hai us instance par mid-response abandon ho jата hai. Correct behaviour ye hai ki application, signal receive karने par, pehle naye connections accept karना band karे aur apne aap ko not ready report karना shuru karे, jo load balancer ko ise rotation se remove karवाता hai. Meanwhile application wo requests serve karता rehта hai jo already progress mein thे, aur sirf jab wo complete hain ye exit karता hai. Kubernetes mein iske liye kई cooperating pieces chahiye: ek preStop hook, ek grace period, ek readiness probe, aur application code jo signal handle karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a liveness probe that checks the database
livenessProbe:
  httpGet: { path: /health, port: 8080 }
# and /health does:  SELECT 1 from the DB, ping Redis, check the payment API
# -> the database has a 90-second blip. EVERY pod fails liveness. Kubernetes
//    restarts ALL of them, simultaneously, repeatedly. a minor DB hiccup
//    becomes a full outage with a thundering-herd of cold restarts.`,
        right: `# LIVENESS = "is this process wedged?" — check almost nothing:
livenessProbe:
  httpGet: { path: /livez, port: 8080 }     # returns 200 if the event loop responds
# READINESS = "should traffic come here right now?" — check dependencies HERE:
readinessProbe:
  httpGet: { path: /readyz, port: 8080 }     # 503 if DB/Redis unreachable or shutting down
# during a DB blip: pods go NOT READY (traffic pauses), then recover. no restarts.`,
        why: 'Liveness and readiness answer different questions and trigger different actions, so checking the wrong things in each is actively harmful. A liveness check answers whether the process is fundamentally broken and needs to be restarted; its correct response to failure is to kill and recreate the instance. A readiness check answers whether the instance should receive traffic at this moment; its correct response to failure is to route around the instance temporarily while leaving it running. If a liveness check tests external dependencies such as the database, then an outage or slowdown of that dependency makes every instance fail liveness at once, and the orchestrator responds by restarting the entire fleet simultaneously — turning a brief, recoverable dependency problem into a full outage, compounded by every instance starting cold at the same time. The dependency checks belong in the readiness probe, where a dependency problem causes instances to stop receiving traffic but keep running, so that when the dependency recovers the instances immediately become ready again with no restarts. The liveness probe should check only that the process itself is responsive, ideally nothing more than that its request-handling loop is not deadlocked.',
        whyHi: 'Liveness aur readiness alag questions answer karते hain aur alag actions trigger karते hain, to har ek mein galat cheezें check karना actively harmful hai. Ek liveness check answer karता hai ki process fundamentally broken hai aur restart chahiye; failure ka iska correct response instance ko kill aur recreate karना hai. Ek readiness check answer karता hai ki instance ko is moment traffic receive karना chahiye; failure ka iska correct response instance ke around route karना hai jabki ise running chhoड़ना. Agar ek liveness check external dependencies test karता hai jaisे database, to us dependency ka ek outage har instance ko ek saath liveness fail karवाता hai, aur orchestrator poore fleet ko simultaneously restart karके respond karता hai — ek brief, recoverable dependency problem ko ek full outage mein badalta hai. Dependency checks readiness probe mein belong karते hain.',
      },
      {
        wrong: `# relying on sticky sessions to keep an app "working"
# app stores the login session in process memory; LB pins each user to a pod by cookie.
# -> deploy replaces pod-A. every user pinned to pod-A is silently logged out.
# -> autoscaler adds pod-D. it gets no traffic for ages (no one is pinned to it).
# -> pod-B gets a run of heavy users and melts while pod-C idles.
# -> a user's second tab hits a different pod (no cookie yet) and sees "logged out".`,
        right: `# make backends STATELESS: session state in a shared store, not process memory.
#   - session id -> Redis (or the DB), OR
#   - a signed, short-lived JWT the client sends on every request
# now ANY pod serves ANY request. no affinity needed. deploys, scaling, and
# multi-tab all just work. keep affinity ONLY for connection-bound things
# (WebSockets, SSE, long uploads) where it is genuinely unavoidable.`,
        why: 'Session affinity makes the load balancer send a given client repeatedly to the same backend, which is required only when that backend holds state for the client that no other backend can see — typically session data kept in the process\'s own memory. Depending on affinity has several consequences that surface as intermittent bugs. When that backend is replaced during a deploy or lost to a crash, its in-memory state is gone and every client bound to it is abruptly logged out or loses their work. A newly added backend receives no traffic until clients happen to be assigned to it, so autoscaling responds slowly and unevenly. Load distributes poorly because assignment is by client rather than by current load, so one backend can be saturated while another is idle. And a client that arrives without the affinity cookie, such as in a second browser tab, can land on a different backend and see a different state. The fix is to remove the per-client state from backend memory: keep it in a store every backend can read, such as Redis or the database, or encode it into a signed token the client presents with each request. Then any backend can serve any request, affinity is unnecessary, and deploys, scaling, and multi-tab use all behave correctly. Affinity should remain only for inherently connection-bound protocols like WebSockets.',
        whyHi: 'Session affinity load balancer ko ek diye gaye client ko baar-baar same backend ko bhejवाता hai, jo sirf tab required hai jab us backend ke paas client ke liye state hai jo koi doosरा backend nahi dekh sakта — typically session data process ki apni memory mein. Affinity par depend karने ke kई consequences hain jo intermittent bugs ke roop mein surface karते hain. Jab us backend ko ek deploy ke dauran replace kiya jाता hai, iski in-memory state chali jाती hai aur har client jo ise bound hai abruptly logged out ho jата hai. Ek naya added backend koi traffic receive nahi karта. Load poorly distribute hoता hai. Fix per-client state ko backend memory se remove karना hai: ise ek store mein rakhो jo har backend padh sakта hai, jaisे Redis, ya ise ek signed token mein encode karो.',
      },
      {
        wrong: `# trusting X-Forwarded-For unconditionally
client_ip = request.headers['X-Forwarded-For'].split(',')[0].trim()
rate_limit(client_ip)
allowlist_check(client_ip)
# -> ANY client can send  X-Forwarded-For: 1.2.3.4  and become "1.2.3.4".
//    attacker sets it to a trusted/allowlisted IP -> bypasses the allowlist.
//    attacker rotates it per request -> bypasses the per-IP rate limit entirely.`,
        right: `# configure the framework's trusted-proxy list to your ACTUAL proxy IPs/ranges:
#   trusted_proxies = ['10.0.0.0/8']         # or the specific LB addresses
# then the framework computes the client IP correctly: it walks X-Forwarded-For
# from the RIGHT, skipping addresses that are in the trusted list, and takes the
# first one that isn't. a spoofed left-most entry is ignored.
# if the connection didn't come from a trusted proxy, don't honour the header at all.`,
        why: 'The X-Forwarded-For header is added by proxies to record the client address, but it is just a header, and a client connecting directly can set it to any value. If the application reads it without qualification, a client can claim to be any address: setting it to an address that appears on an allowlist grants access that should be denied, and changing it on every request defeats any per-address rate limit because each request appears to come from a new client. The header can only be trusted to the extent that every proxy between the real client and the application is known and appends honestly. The application must therefore be configured with the set of addresses its actual proxies use, and must derive the client address by reading the forwarded list from the end, discarding entries that match known proxies, and taking the first entry that does not — because that is the address the outermost trusted proxy observed the connection coming from. Any value a client placed at the start of the list is then ignored. If a connection reaches the application without coming through a trusted proxy at all, the header should not be honoured. Web frameworks provide a trusted-proxy configuration for exactly this computation; leaving it at a default that trusts everything, or trusts nothing, is the error.',
        whyHi: 'X-Forwarded-For header proxies dwara client address record karने ke liye add kiya jाता hai, par ye sirf ek header hai, aur ek client jo directly connect karता hai ise kisi bhi value par set kar sakта hai. Agar application ise bina qualification ke padhता hai, ek client kisi bhi address hone ka dava kar sakता hai: ise ek allowlisted address par set karना access grant karता hai jo deny honा chahiye; ise har request par change karना kisi bhi per-address rate limit ko defeat karता hai. Header ko sirf us hद tak trust kiya ja sakта hai jitna har proxy known hai. Application ko isliye apne actual proxies ke addresses ke set se configure honा chahiye, aur client address ko forwarded list ko end se padhके derive karना chahiye, known proxies ko discard karके. Web frameworks exactly is computation ke liye ek trusted-proxy configuration provide karते hain.',
      },
    ],

    realWorld: [
      {
        en: '**Every deploy showed a 5-10 request burst of 502s** until the app was changed to handle SIGTERM by failing readiness, draining in-flight requests, and only then exiting — plus a `preStop: sleep 5` so the Endpoints removal propagated first. Deploys became invisible.',
        hi: '**Har deploy ek 502s ka burst dikhता tha** jab tak app ko SIGTERM handle karने ke liye change nahi kiya gaya — readiness fail karके, in-flight drain karके, phir exit. Deploys invisible ban gaye.',
      },
      {
        en: '**A DB failover caused a 4-minute full outage instead of a 40-second pause** because the liveness probe ran `SELECT 1` — every pod restarted at once, cold. Moving the DB check to readiness turned the next failover into a barely-noticed blip.',
        hi: '**Ek DB failover ne ek 40-second pause ke bजaay ek 4-minute full outage cause kiya** kyunki liveness probe `SELECT 1` chalाता tha. DB check ko readiness mein move karना.',
      },
      {
        en: '**An IP allowlist bypassed in a pen test** — the app took `X-Forwarded-For[0]` with no trusted-proxy config, so the tester just sent `X-Forwarded-For: <allowlisted office IP>`. Fixed by setting the trusted-proxy ranges and taking the rightmost-untrusted element.',
        hi: '**Ek pen test mein ek IP allowlist bypass** — app ne bina trusted-proxy config ke `X-Forwarded-For[0]` liya. Fixed by trusted-proxy ranges set karके.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between L4 and L7 load balancing, and when would you use each?',
        qHi: 'L4 aur L7 load balancing ke beech kya difference hai, aur aap har ek kab istemal karोge?',
        a: 'Layer 4 load balancing operates at the transport layer: it forwards TCP or UDP connections based on IP address and port, without inspecting or understanding what travels through the connection. It is fast, has low overhead, works with any protocol including databases and gRPC, and passes traffic through largely unmodified, which also means it passes encrypted TLS straight to the backend without terminating it. What it cannot do is anything that requires reading the request: it cannot route by URL path or hostname, cannot add or modify HTTP headers, and cannot make decisions based on request content. Layer 7 load balancing operates at the application layer: it parses HTTP, so it can route by path, host, method, or header; terminate TLS at the edge; add forwarding headers; retry a failed idempotent request against another backend; implement cookie-based session affinity; and split traffic by percentage or header for canary releases. The cost is more processing per request and the need to support the specific protocol version. You use L4 when you need raw speed, protocol independence, or end-to-end encryption to the backend, or when the routing decision is purely by address. You use L7 when you need HTTP-aware routing, edge TLS termination, or traffic-shaping features. Many real systems use both: an L4 balancer spreads connections across a tier of L7 proxies that do the HTTP work.',
        aHi: 'Layer 4 load balancing transport layer par operate karता hai: ye TCP ya UDP connections ko IP address aur port ke basis par forward karता hai, bina inspect kiye ki kya travel karता hai. Ye fast hai, kisi bhi protocol ke saath kaam karता hai, aur traffic ko largely unmodified pass karता hai, jiska matlab ye encrypted TLS ko seedha backend ko pass karता hai bina terminate kiye. Jo ye nahi kar sakта wo kुछ bhi hai jo request padhने ki zaroorat hai: ye URL path ya hostname se route nahi kar sakта. Layer 7 load balancing application layer par operate karता hai: ye HTTP parse karता hai, to ye path, host, method, ya header se route kar sakта hai; TLS terminate; forwarding headers add; ek failed idempotent request retry; cookie-based session affinity; aur canary releases ke liye traffic split. Aap L4 istemal karते ho jab aapको raw speed, protocol independence, ya end-to-end encryption chahiye. Aap L7 istemal karते ho jab aapको HTTP-aware routing chahiye. Bahut se systems dono istemal karते hain.',
      },
      {
        q: 'How does a zero-downtime deploy work at the load balancer level? What breaks if it is not set up?',
        qHi: 'Ek zero-downtime deploy load balancer level par kaise kaam karता hai? Agar ye set up nahi hai to kya toड़ता hai?',
        a: 'A zero-downtime deploy depends on removing an instance from service gracefully rather than abruptly. When the orchestrator decides to stop an instance, it sends a termination signal. The instance responds by first making itself unready — it stops accepting new connections and begins reporting failure on its readiness endpoint — which causes the load balancer, on its next health check or endpoint update, to remove that instance from the pool so new requests go only to the remaining instances. Crucially, the instance does not exit yet: it continues processing the requests that were already in flight when the signal arrived. Only once those requests have completed does it shut down, and it does so within the grace period the orchestrator allows before it would force-kill. New instances are brought up and must pass their own readiness checks before the load balancer sends them traffic. If this is not set up — if the application simply exits when it receives the signal — then every request being processed on that instance at that moment is dropped and returns a gateway error to the client, and because the load balancer takes a moment to notice the instance is gone, a few more new requests are sent to it and also fail. The visible symptom is a small spike of 502 errors correlated with every deploy, which teams often accept as "deploys cause blips" without realising it is fixable.',
        aHi: 'Ek zero-downtime deploy ek instance ko service se gracefully remove karने par depend karता hai, abruptly nahi. Jab orchestrator ek instance stop karने ka decide karता hai, ye ek termination signal bhejता hai. Instance pehle apne aap ko unready banaकर respond karता hai — ye naye connections accept karना band karता hai aur apne readiness endpoint par failure report karना shuru karता hai — jo load balancer ko us instance ko pool se remove karवाता hai. Crucially, instance abhi exit nahi karता: ye wo requests process karता rehта hai jo signal aane par already in flight thे. Sirf jab wo requests complete hain ye shut down karता hai. Agar ye set up nahi hai — agar application simply exit karता hai — to har request jo us moment process ho raha hai drop ho jата hai aur client ko ek gateway error return karता hai. Visible symptom har deploy ke saath correlated 502 errors ki ek small spike hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list 6 jobs a reverse proxy does at the edge that you would not want each app instance doing, and for each say why "once at the edge" is better.',
        taskHi: 'Ek comment mein, 6 jobs list karो jo ek reverse proxy edge par karता hai.',
        hint: 'TLS termination (one cert config + one handshake cost, not N); load balancing (one place knows all backends + their health); health checking (route away from a bad backend without app changes); routing by path/host (one IP:port serves many services); rate limiting / body-size / timeout limits (protect ALL backends uniformly, reject junk before it costs a worker); caching + compression (serve hits and gzip without waking the app); X-Forwarded-* headers (one trusted place sets them). "Once at the edge" = consistent policy, less per-app code, and protection applied before a request consumes backend resources.',
        hintHi: 'TLS termination, load balancing, health checking, path/host routing, rate limiting/limits, caching+compression, X-Forwarded-* headers. "Once at the edge" = consistent policy, kम per-app code, aur protection ek request ke backend resources consume karने se pehle applied.',
      },
      {
        task: 'In a comment, define liveness vs readiness, give one correct check for each, and explain what goes wrong if a liveness probe checks the database.',
        taskHi: 'Ek comment mein, liveness vs readiness define karो.',
        hint: 'Liveness = "is the process wedged / deadlocked?" → failure means RESTART the instance. Correct check: an endpoint that returns 200 iff the request-handling loop is responsive (checks nothing external). Readiness = "should traffic come here right now?" → failure means STOP ROUTING here but keep it running. Correct check: dependencies reachable, migrations done, caches warm, NOT shutting down. If liveness checks the DB: a DB blip fails liveness on every instance at once → the orchestrator restarts the entire fleet simultaneously, cold → a 60s recoverable blip becomes a multi-minute outage with a thundering herd.',
        hintHi: 'Liveness = "process wedged?" → failure = RESTART. Correct check: ek endpoint jo 200 return karता hai iff request loop responsive hai. Readiness = "abhi traffic aaye?" → failure = STOP ROUTING par running rakhо. Correct check: dependencies reachable, shutting down NAHI. Agar liveness DB check karता hai: ek DB blip har instance par liveness fail karता hai → orchestrator poore fleet ko simultaneously restart karता hai → ek 60s blip ek multi-minute outage ban jата hai.',
      },
      {
        task: 'A user reports "I keep getting logged out during deploys, and sometimes my second tab says I\'m logged out." In a comment, explain the root cause, why sticky sessions do not really fix it, and the correct fix.',
        taskHi: 'Ek user "deploys ke dauran logged out ho jата hoon" report karта hai. Root cause samjhाओ.',
        hint: 'Root cause: the session lives in one backend\'s process memory, and the LB uses sticky sessions to pin the user there. On deploy, that backend is replaced → the in-memory session is gone → logged out. A second tab that arrives without the affinity cookie can hit a different backend that has never seen the session → "logged out". Sticky sessions do not fix this — they just hide it until the pinned backend goes away, and they also wreck load distribution and autoscaling. Correct fix: STATELESS backends — put the session in a shared store (Redis / DB) keyed by a session id cookie, or use a signed JWT the client sends every request. Then any backend serves any request; deploys, scaling, and multi-tab all work. Keep affinity only for WebSockets/SSE.',
        hintHi: 'Root cause: session ek backend ki process memory mein rehта hai, aur LB sticky sessions se user ko wahaan pin karता hai. Deploy par, wo backend replace hoता hai → session chali gayi → logged out. Ek doosरा tab bina cookie ke ek alag backend hit kar sakта hai. Sticky sessions ise fix nahi karते. Correct fix: STATELESS backends — session ek shared store (Redis/DB) mein, ya ek signed JWT. Affinity sirf WebSockets ke liye rakhो.',
      },
    ],

    keyTakeaways: [
      'A REVERSE PROXY (nginx, Caddy, HAProxy, Envoy, Traefik, cloud ALB/NLB, K8s Ingress) is one public front door for many backends. It handles, ONCE AT THE EDGE: load balancing, health checking, TLS termination (handshake once; backends speak plain HTTP internally), routing (`/api`→pool A, host `x`→pool B, all on one IP:port), `X-Forwarded-*` headers, rate/size/time limits + WAF, caching + compression, and buffering slow clients so they don\'t tie up a backend worker. (A FORWARD proxy sits in front of CLIENTS; a reverse proxy in front of SERVERS.)',
      'L4 vs L7 is the key distinction. L4 (transport): forwards TCP/UDP by IP:port, does NOT parse the payload — fast, protocol-agnostic, passes TLS straight through; CANNOT route by path/host, add headers, or terminate TLS (AWS NLB, HAProxy `mode tcp`, kube-proxy). L7 (application): parses HTTP — routes by path/host/header, terminates TLS, adds headers, retries idempotent requests, cookie affinity, canary by %/header (nginx, Caddy, Envoy, ALB, Traefik). Real systems often use BOTH: an L4 LB spreads connections across a tier of L7 proxies.',
      'ALGORITHMS: round-robin (default; fine until request costs vary), weighted (mixed fleet), LEAST-CONNECTIONS (uneven request durations), least-response-time, IP/consistent-hash (stickiness without cookies, cache-friendly), power-of-two-choices (pick 2 at random → less loaded; near-optimal, cheap). HEALTH CHECKS: ACTIVE (proxy probes `GET /healthz` every few s; N fails → mark DOWN) + PASSIVE / outlier detection (watch real traffic; too many 5xx/timeouts → eject for a cooldown).',
      'LIVENESS vs READINESS — different questions, different actions. LIVENESS = "is the process wedged?" → failure means RESTART; it must check ALMOST NOTHING (just that the loop responds). READINESS = "should traffic come here right now?" → failure means STOP ROUTING but keep running; it checks deps reachable, warm, migrations done, NOT shutting down. The LB routes on READINESS. A liveness probe that checks the DB restart-loops the WHOLE fleet, cold, during any DB blip — turning a 60s pause into a multi-minute outage.',
      'CONNECTION DRAINING = zero-downtime deploys: on SIGTERM the instance (1) stops accepting new connections + fails its readiness check → (2) the LB removes it from rotation, new requests go elsewhere → (3) it finishes in-flight requests → (4) exits cleanly within the grace period. Skip this (exit immediately on SIGTERM) and every deploy drops the in-flight requests = a 502 spike per rollout. K8s pieces: `preStop` sleep (let Endpoints propagate), `terminationGracePeriodSeconds`, a readiness probe the app fails on SIGTERM, app code that closes the listener and drains. SESSION AFFINITY (sticky sessions) is a CONSTRAINT not a feature — needed only for in-memory per-user state; it breaks on redeploy, wrecks load distribution + autoscaling, and fails for a cookie-less second tab. Fix: STATELESS backends (session in Redis/DB or a signed JWT) so any backend serves any request; keep affinity only for WebSockets/SSE. X-FORWARDED-FOR: trust it ONLY from a known-proxy connection, take the rightmost-untrusted element (configure the framework\'s trusted-proxy list) — or clients spoof their IP to beat rate limits and allowlists.',
    ],
    keyTakeawaysHi: [
      'Ek REVERSE PROXY (nginx, Caddy, HAProxy, Envoy, Traefik, cloud ALB/NLB, K8s Ingress) kई backends ke liye ek public front door hai. Ye handle karता hai, EK BAAR EDGE PAR: load balancing, health checking, TLS termination, routing, `X-Forwarded-*` headers, rate/size/time limits + WAF, caching + compression, slow clients buffering. (FORWARD proxy CLIENTS ke saamne; reverse proxy SERVERS ke saamne.)',
      'L4 vs L7 key distinction hai. L4 (transport): TCP/UDP ko IP:port se forward, payload parse NAHI — fast, protocol-agnostic, TLS straight through; path/host se route NAHI kar sakta (AWS NLB, kube-proxy). L7 (application): HTTP parse — path/host/header se route, TLS terminate, headers add, idempotent retries, cookie affinity, canary (nginx, Caddy, Envoy, ALB). Real systems aksar DONO istemal karте hain.',
      'ALGORITHMS: round-robin (default), weighted, LEAST-CONNECTIONS (uneven durations), least-response-time, IP/consistent-hash, power-of-two-choices. HEALTH CHECKS: ACTIVE (`GET /healthz` probe; N fails → DOWN) + PASSIVE (real traffic dekhो; bahut 5xx → eject).',
      'LIVENESS vs READINESS — alag questions, alag actions. LIVENESS = "process wedged?" → RESTART; LAGBHAG KUCH NAHI check karे. READINESS = "abhi traffic aaye?" → STOP ROUTING par running rakhо; deps reachable, shutting down NAHI check karे. LB READINESS par route karता hai. Ek liveness probe jo DB check karता hai POORE fleet ko restart-loop karता hai, cold, kisi DB blip ke dauran.',
      'CONNECTION DRAINING = zero-downtime deploys: SIGTERM par instance (1) naye connections band + readiness fail → (2) LB ise rotation se remove → (3) in-flight requests finish → (4) grace period ke andar cleanly exit. Ise skip karो (SIGTERM par turant exit) aur har deploy in-flight requests drop karता hai = ek 502 spike. SESSION AFFINITY ek CONSTRAINT hai feature nahi — sirf in-memory per-user state ke liye; redeploy par toड़ता hai. Fix: STATELESS backends (session Redis/DB ya ek signed JWT). X-FORWARDED-FOR: ise SIRF ek known-proxy connection se trust karो, rightmost-untrusted element lo — warna clients apna IP spoof karте hain.',
    ],
  },

  {
    slug: 'ops-firewalls-ports-nat-and-debugging-the-network',
    title: 'Firewalls, Ports, NAT & Debugging the Network',
    titleHi: 'Firewalls, Ports, NAT Aur Network Debug Karna',
    description: 'A connection has to survive several layers of filtering — the host firewall, the cloud security group, and often a network ACL — each of which can silently drop it. Knowing what each layer does, stateful vs stateless behaviour, and a systematic "cannot connect" decision tree is the difference between a 5-minute fix and a 3-hour hunt.',
    descriptionHi: 'Ek connection ko filtering ki kई layers survive karनी padती hain — host firewall, cloud security group, aur aksar ek network ACL — jinmें se har ek ise silently drop kar sakती hai. Har layer kya karती hai, stateful vs stateless behaviour, aur ek systematic "connect nahi kar sakta" decision tree jaanna ek 5-minute fix aur ek 3-hour hunt ke beech ka difference hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Getting into a secure office building.** Your connection is a visitor. There is a boom gate at the car park (the network ACL — a coarse, stateless rule: "these plate ranges only"), a guard at the lobby who checks you against today\'s visitor list and issues a badge (the cloud security group — stateful: once you\'re in, your return trip is automatically allowed), and finally a lock on the specific office door (the host firewall / whether a service is even listening on that port). A "no" at any of the three stops you, and here is the cruel part: two of them do not tell you no — they just quietly do not let you through, and you stand in the corridor until you give up (a timeout). Debugging is walking the path in order and finding the first gate that is shut.',
      hi: '**Ek secure office building mein ghusna.** Aapका connection ek visitor hai. Car park par ek boom gate hai (network ACL — ek coarse, stateless rule), lobby mein ek guard jo aapko aaj ki visitor list ke against check karता hai aur ek badge issue karता hai (cloud security group — stateful: ek baar aap andar hain, aapki return trip automatically allowed hai), aur aakhir mein specific office door par ek lock (host firewall / kya ek service us port par listen bhi kar raha hai). Teenों mein se kisi bhi par ek "no" aapको rokता hai, aur yahaan cruel part hai: unmें se do aapको no nahi bताते — wo bस quietly aapko through nahi jaane dete, aur aap corridor mein khade rehते ho jab tak aap give up nahi karते (ek timeout).',
    },

    simple: `**A PORT** identifies which service on a host a connection is for. 0-65535.
\`\`\`
well-known:  22 SSH · 53 DNS · 80 HTTP · 443 HTTPS · 5432 Postgres · 6379 Redis · 3306 MySQL
a server LISTENS on a port; a client uses a random high "ephemeral" port as its source.
\`\`\`

**THE FILTERING LAYERS a connection must pass (cloud):**
\`\`\`
1. NETWORK ACL (subnet level)   | STATELESS, coarse, allow+deny, evaluated in order.
                                | must allow BOTH directions explicitly (incl. ephemeral ports for replies).
2. SECURITY GROUP (instance)    | STATEFUL, allow-only, "default deny". if the request is allowed,
                                | the reply is automatically allowed. the main knob you tune.
3. HOST FIREWALL (iptables/nft, | STATEFUL, on the box itself. often open on cloud VMs, strict on-prem.
   ufw, firewalld, Windows FW)  |
4. IS ANYTHING LISTENING?       | the service must be up AND bound to the right address
                                | (0.0.0.0 = all interfaces ; 127.0.0.1 = localhost only -> not reachable remotely)
\`\`\`

**STATEFUL vs STATELESS:**
\`\`\`
STATEFUL (security groups, host firewalls): remembers connections. allow the outbound
  request -> the inbound reply is auto-allowed. you write ONE rule (the request direction).
STATELESS (network ACLs): every packet judged alone. you must allow the request AND
  the reply — and replies come back on EPHEMERAL ports (e.g. 1024-65535), so a
  "allow 443 in, deny all else" ACL blocks the return traffic of your OWN outbound calls.
\`\`\`

**"CONNECTION REFUSED" vs "CONNECTION TIMED OUT" — the most useful distinction:**
\`\`\`
REFUSED  (fast, ~instant)  | reached the host; the OS sent RST; nothing is listening on that port.
                           | -> the SERVICE is down / crashed / bound to the wrong address / wrong port.
TIMED OUT (slow, ~tens of s)| the SYN got no reply at all. a firewall/SG/NACL is DROPPING it,
                           | or the host is down, or you have the wrong IP / no route.
\`\`\`

**"CANNOT CONNECT" DECISION TREE:**
\`\`\`
1. DNS ok?           dig +short host        -> wrong/no IP? fix DNS. right IP? continue.
2. is the service up + bound right?  (on the box)  ss -tlnp | grep :PORT
                     bound to 127.0.0.1 only? that's why remote fails. bind 0.0.0.0.
3. from the client:  curl -v telnet://IP:PORT   OR   nc -vz IP PORT   OR   Test-NetConnection
                     REFUSED -> service/bind problem (go to 2).  TIMEOUT -> filtering (go to 4).
4. walk the filters: security group inbound allows your source IP + port?
                     network ACL allows in AND out (ephemeral)?  host firewall (ufw/nft) open?
5. still stuck?      is there a route? (different VPC/subnet/on-prem -> routing table, peering, VPN)
\`\`\`

**NAT recap (Lesson 2):** SNAT rewrites the SOURCE on the way out (many private -> one public);
DNAT / port-forward rewrites the DESTINATION on the way in (public :443 -> internal host).

**TOOLS:**  ss -tlnp (listening sockets) · ss -tnp (active) · curl -v / nc -vz (test a port) ·
dig (DNS) · ip route / traceroute / mtr (path) · tcpdump (last resort: see the actual packets).`,

    simpleHi: `**EK PORT** identify karता hai ek host par kaunसी service ke liye ek connection hai. 0-65535.
\`\`\`
well-known:  22 SSH · 53 DNS · 80 HTTP · 443 HTTPS · 5432 Postgres · 6379 Redis
ek server ek port par LISTEN karता hai; ek client source ke roop mein ek random high "ephemeral" port istemal karता hai.
\`\`\`

**FILTERING LAYERS jo ek connection ko pass karनी hain (cloud):**
\`\`\`
1. NETWORK ACL (subnet level)   | STATELESS, coarse, allow+deny, order mein evaluated.
                                | DONO directions explicitly allow karना (replies ke liye ephemeral ports incl.).
2. SECURITY GROUP (instance)    | STATEFUL, allow-only, "default deny". request allowed -> reply auto-allowed.
3. HOST FIREWALL (iptables/nft, | STATEFUL, box par khud. cloud VMs par aksar open.
   ufw, firewalld)              |
4. KYA KUCH LISTEN KAR RAHA HAI?| service up AND sahi address par bound honी chahiye
                                | (0.0.0.0 = all interfaces ; 127.0.0.1 = localhost only -> remotely reachable nahi)
\`\`\`

**STATEFUL vs STATELESS:**
\`\`\`
STATEFUL (security groups, host firewalls): connections remember karता hai. outbound request allow karो
  -> inbound reply auto-allowed. aap EK rule likhते ho.
STATELESS (network ACLs): har packet akela judged. aapको request AND reply allow karना — aur
  replies EPHEMERAL ports par wapas aati hain, to ek "allow 443 in, deny all" ACL aapki apni
  outbound calls ka return traffic block karता hai.
\`\`\`

**"CONNECTION REFUSED" vs "CONNECTION TIMED OUT":**
\`\`\`
REFUSED  (fast)  | host tak pahuncha; OS ne RST bheja; kुछ us port par listen nahi kar raha.
                 | -> SERVICE down / crashed / galat address par bound / galat port.
TIMED OUT (slow) | SYN ka koi reply nahi. ek firewall/SG/NACL ise DROP kar raha, ya host down.
\`\`\`

**"CANNOT CONNECT" DECISION TREE:**
\`\`\`
1. DNS ok?  dig +short host -> galat IP? DNS fix karो.
2. service up + bound right?  ss -tlnp | grep :PORT  -> 127.0.0.1 only? isliye remote fail. 0.0.0.0 bind karो.
3. client se:  nc -vz IP PORT  -> REFUSED -> service/bind (2 par jाओ). TIMEOUT -> filtering (4 par jाओ).
4. filters walk karो: security group inbound? network ACL in AND out? host firewall open?
5. abhi bhi stuck? route hai? (routing table, peering, VPN)
\`\`\`

**NAT recap:** SNAT way out par SOURCE rewrite karता hai; DNAT / port-forward way in par DESTINATION rewrite karता hai.

**TOOLS:**  ss -tlnp · curl -v / nc -vz · dig · ip route / traceroute / mtr · tcpdump (last resort).`,

    content: `## Ports

A **port** is a 16-bit number (0–65535) that identifies which service on a host a packet is for; the combination of protocol, source IP, source port, destination IP, and destination port uniquely identifies a connection. A **server** binds and listens on a fixed port; a **client** is assigned a random high **ephemeral port** (commonly 32768–60999 on Linux) as its source, and the reply comes back to that port.

Well-known ports you should recognise: **22** SSH, **25/587** SMTP, **53** DNS, **80** HTTP, **123** NTP, **443** HTTPS, **3306** MySQL, **5432** PostgreSQL, **6379** Redis, **9090** Prometheus, **27017** MongoDB. Ports below 1024 are "privileged" — binding them requires elevated privilege, which is one reason apps run behind a proxy that owns 80/443 while the app itself listens on 8080 or 3000.

## The filtering layers

In a cloud environment a connection to an instance typically passes **three** filtering layers, plus the question of whether anything is listening. Any layer can drop it, and two of them do so **silently**.

### 1. Network ACL (subnet level)

Attached to a **subnet**, so it affects every instance in it. **Stateless**: each packet is evaluated on its own with no memory of prior packets, so you must write rules for **both directions** — including allowing inbound traffic on **ephemeral ports** for the replies to connections your instances initiated outbound. Rules are an **ordered list** of allow and deny entries, evaluated lowest number first, first match wins. Cloud defaults usually allow everything; NACLs are an optional coarse layer, often left open and controlled at the security-group level instead. A hand-tightened NACL that allows \`443 inbound\` and denies the rest will **break the return path of the instance's own outbound calls**, because those replies arrive on high ports.

### 2. Security group (instance level)

Attached to an instance's network interface. **Stateful**: it remembers connections, so if an inbound request is allowed, the outbound reply is automatically allowed (and vice versa) — you write **one rule per intended flow**, in the direction the connection is initiated. **Allow-only**: there are no deny rules; anything not explicitly allowed is denied. This is the layer you tune most: "allow inbound TCP 443 from \`0.0.0.0/0\`", "allow inbound TCP 5432 from the app security group". Referencing another security group as the source, rather than an IP range, is the idiomatic way to express "the app tier may reach the database tier".

### 3. Host firewall

On the instance itself: \`iptables\`/\`nftables\` (via \`ufw\` or \`firewalld\` as friendlier front-ends) on Linux, Windows Firewall on Windows. **Stateful**. On cloud VMs this is frequently left fully open because the security group is doing the work; on-prem and hardened images it is strict. It is the layer people forget exists, because it is inside the box rather than in the cloud console — a connection that passes the security group can still be dropped here.

### 4. Is anything actually listening?

Past all the filters, the service must be **running** and **bound to an address that is reachable**:

- Bound to \`0.0.0.0\` (or \`::\` for IPv6) — listening on **all** interfaces, reachable from other hosts.
- Bound to \`127.0.0.1\` (\`localhost\`) — listening **only** for connections from the same machine. This is a security default in many tools and the single most common reason for "it works when I SSH in and curl localhost, but not from anywhere else". The fix is to bind \`0.0.0.0\` and rely on the firewall layers for access control.

## Stateful versus stateless — why it matters

A **stateful** filter tracks connections. When it allows a packet that starts a connection, it records the connection and automatically permits the packets that belong to it in both directions. You write a rule only for the direction in which the connection is opened.

A **stateless** filter has no such memory; it judges every packet independently against the rule list. If an instance makes an outbound HTTPS request, the request leaves on destination port 443 but the **reply comes back to the instance's ephemeral source port** — some high number. A stateless filter that only allows inbound 443 will drop that reply, and the outbound connection hangs. This is why stateless NACLs need an explicit "allow inbound TCP 1024–65535" companion rule for return traffic, and why they are error-prone and usually left permissive.

## Refused versus timed out

The two failure modes carry different information and it is worth internalising:

- **Connection refused** — **fast**, essentially instant. The TCP SYN reached the host, and the host's OS responded with a **RST** because **no process is listening on that port**. The network path is fine. The problem is the service: it is down, it crashed, it is bound to \`127.0.0.1\` instead of \`0.0.0.0\`, or you have the wrong port.
- **Connection timed out** — **slow**, tens of seconds. The SYN got **no response at all**. Something is **silently dropping** the packet: a security group, a NACL, a host firewall, or the host is down, or you have the wrong IP or no route to it. The network path is broken somewhere.

A tool that says "no route to host" is reporting that the OS has no routing-table entry that covers the destination — an internet-layer problem, usually a missing route, VPC peering, or VPN.

## A "cannot connect" decision tree

Work it in order; each step localises the problem further:

1. **DNS.** \`dig +short host\` (or \`nslookup\`). Wrong IP or no answer → fix DNS (Lesson 3), and check you're not hitting split-horizon. Correct IP → continue with that IP.
2. **Is the service up and bound correctly?** On the box: \`ss -tlnp | grep :PORT\` (or \`netstat -tlnp\`, or \`Get-NetTCPConnection\` on Windows). No line → the service is not running. A line showing \`127.0.0.1:PORT\` → it's bound to localhost only; that's why remote connections fail. A line showing \`0.0.0.0:PORT\` or \`*:PORT\` → it's listening broadly, continue.
3. **Test the port from the client.** \`nc -vz IP PORT\`, or \`curl -v telnet://IP:PORT\`, or PowerShell \`Test-NetConnection IP -Port PORT\`. **Refused** → back to step 2, it's a service/bind problem. **Timed out** → step 4, it's filtering or routing.
4. **Walk the filter layers**, outermost to innermost: does the **security group** have an inbound rule allowing your source (IP or SG) on that port? Does the **network ACL** allow it inbound *and* allow the ephemeral range outbound for the reply? Is the **host firewall** (\`ufw status\`, \`nft list ruleset\`, \`iptables -L -n\`) open for that port? Fix the first closed one.
5. **Still timing out?** It's **routing**. Are the client and server in different subnets / VPCs / on-prem? Check route tables, VPC peering or transit gateway, the VPN tunnel status, and that the two CIDR ranges don't overlap (Lesson 2). \`traceroute\` / \`mtr\` shows where packets stop.

## NAT, recapped

From Lesson 2: **SNAT** (source NAT) rewrites the **source** address of outbound packets so many private hosts share a public address — a NAT gateway for a private subnet, or your home router. **DNAT** (destination NAT, port forwarding) rewrites the **destination** of inbound packets so a public address:port maps to an internal host — a router forwarding \`:443\` to a server, a Kubernetes \`NodePort\`, \`docker run -p 8080:80\`.

## The toolkit

| Tool | Use |
|---|---|
| \`ss -tlnp\` | TCP listening sockets + the process (which ports are open on this box, and bound to what) |
| \`ss -tnp\` | active TCP connections |
| \`curl -v\` / \`curl -vI\` | test HTTP(S) end to end with the full trace |
| \`nc -vz host port\` | test whether a TCP port is reachable (no HTTP) |
| \`dig\` / \`nslookup\` | DNS resolution |
| \`ip addr\` / \`ip route\` | this host's addresses and routing table |
| \`traceroute\` / \`mtr\` | the path to a destination and where it stops (mtr = continuous, shows loss per hop) |
| \`tcpdump -ni any port 443\` | last resort: watch the actual packets — confirms whether a SYN arrives and whether anything answers |
| \`Test-NetConnection\` (PowerShell) | Windows equivalent of \`nc -vz\` plus a ping and route trace |`,

    contentHi: `## Ports

Ek **port** ek 16-bit number (0-65535) hai jo identify karता hai ek host par kaunसी service ke liye ek packet hai. Ek **server** ek fixed port par bind aur listen karता hai; ek **client** ko ek random high **ephemeral port** assign kiya jाता hai source ke roop mein.

Well-known ports: **22** SSH, **53** DNS, **80** HTTP, **443** HTTPS, **3306** MySQL, **5432** PostgreSQL, **6379** Redis, **27017** MongoDB. 1024 se neeche ports "privileged" hain — unhe bind karने ke liye elevated privilege chahiye.

## Filtering layers

Ek cloud environment mein ek connection typically **teen** filtering layers pass karता hai, plus ye sawaal ki kुछ listen kar raha hai ya nahi. Koi bhi layer ise drop kar sakती hai, aur unmें se do aisा **silently** karती hain.

**1. Network ACL (subnet level).** Ek **subnet** se attached. **Stateless**: har packet apne aap par evaluated, to aapको **dono directions** ke liye rules likhने hain — replies ke liye **ephemeral ports** par inbound traffic allow karना incl. Rules ek **ordered list** hain. Ek hand-tightened NACL jo \`443 inbound\` allow karता hai aur baaki deny karता hai **instance ki apni outbound calls ka return path breaks karega**.

**2. Security group (instance level).** Ek instance ke network interface se attached. **Stateful**: ye connections remember karता hai, to agar ek inbound request allowed hai, outbound reply automatically allowed hai — aap **har intended flow ke liye ek rule** likhते ho. **Allow-only**: koi deny rules nahi. Ye wo layer hai jise aap sabse zyada tune karते ho.

**3. Host firewall.** Instance par khud: \`iptables\`/\`nftables\` (\`ufw\`/\`firewalld\` ke through). **Stateful**. Cloud VMs par ye aksar fully open chhoड़ा jाता hai. Ye wo layer hai jise log bhoolते hain ki exist karती hai.

**4. Kya kुछ actually listen kar raha hai?** Service **running** aur **ek reachable address par bound** honी chahiye: \`0.0.0.0\` (all interfaces) vs \`127.0.0.1\` (localhost only — "SSH karके curl localhost kaam karता hai, par kahin aur se nahi" ka #1 reason).

## Stateful versus stateless

Ek **stateful** filter connections track karता hai. Ek **stateless** filter mein aisी memory nahi; ye har packet ko independently judge karता hai. Agar ek instance ek outbound HTTPS request karता hai, reply **instance ke ephemeral source port** par wapas aata hai — koi high number. Ek stateless filter jo sirf inbound 443 allow karता hai us reply ko drop karega.

## Refused versus timed out

- **Connection refused** — **fast**. SYN host tak pahuncha, aur host ke OS ne ek **RST** se respond kiya kyunki **koi process us port par listen nahi kar raha**. Problem service hai.
- **Connection timed out** — **slow**. SYN ko **koi response nahi mila**. Kुछ **silently drop** kar raha hai: ek security group, ek NACL, ek host firewall, ya host down hai.

## "Cannot connect" decision tree

1. **DNS.** \`dig +short host\`. Galat IP → DNS fix karो.
2. **Kya service up aur correctly bound hai?** Box par: \`ss -tlnp | grep :PORT\`. Koi line nahi → service running nahi. \`127.0.0.1:PORT\` → localhost only bound.
3. **Client se port test karो.** \`nc -vz IP PORT\`. **Refused** → step 2. **Timed out** → step 4.
4. **Filter layers walk karो:** security group inbound rule? network ACL in *aur* out? host firewall open?
5. **Abhi bhi timeout?** **Routing** hai. Route tables, VPC peering, VPN tunnel, overlapping CIDRs. \`traceroute\`/\`mtr\`.

## NAT, recapped

**SNAT** outbound packets ka **source** rewrite karता hai (bahut private hosts ek public address share karते hain). **DNAT** (port forwarding) inbound packets ka **destination** rewrite karता hai (\`docker run -p 8080:80\`, K8s \`NodePort\`).

## Toolkit

\`ss -tlnp\` (listening sockets + process) · \`curl -v\` / \`nc -vz\` (test a port) · \`dig\` (DNS) · \`ip route\` / \`traceroute\` / \`mtr\` (path) · \`tcpdump -ni any port 443\` (last resort: actual packets).`,

    examples: [
      {
        title: 'ss: what is listening, and on which address',
        titleHi: 'ss: kya listen kar raha hai, aur kaunse address par',
        code: `$ ss -tlnp
State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port   Process
LISTEN  0       4096     127.0.0.1:5432        0.0.0.0:*           users:(("postgres",pid=812))
LISTEN  0       511      0.0.0.0:80            0.0.0.0:*           users:(("nginx",pid=901))
LISTEN  0       128      0.0.0.0:22            0.0.0.0:*           users:(("sshd",pid=680))
LISTEN  0       4096     *:8080               *:*                users:(("node",pid=1204))

# reading it:
#   postgres  -> 127.0.0.1:5432  = LOCALHOST ONLY. a remote client gets "connection
#                refused". this is correct for a DB that only the local app uses;
#                WRONG if another host needs it (then bind 0.0.0.0 + lock down via SG).
#   nginx     -> 0.0.0.0:80      = all IPv4 interfaces. remotely reachable (if the
#                firewall/SG allows 80).
#   node      -> *:8080          = all interfaces, IPv4 + IPv6.
#
# flags: -t TCP  -l listening  -n numeric (no DNS)  -p process. add -u for UDP.
$ ss -tnp state established        # who is currently connected
ESTAB  0  0  10.0.10.5:8080  10.0.1.20:44122  users:(("node",pid=1204))`,
        output: `ss -tlnp lists every listening TCP socket with its bind address and owning process. A bind of 127.0.0.1:PORT means the service accepts connections only from the same host - a remote client gets "connection refused" no matter how the firewall is set. A bind of 0.0.0.0:PORT (or *:PORT) means it listens on all interfaces and is remotely reachable if the firewall layers permit. This is the first thing to check on the server when a connection is refused.`,
        explain: 'This command answers two of the decision-tree questions at once: whether the service is running, and what address it is bound to. Each line is a listening socket. The process column names the program and its process id, so a missing line for the expected port means the service is not running at all. The local address column is the critical detail. An address of 127.0.0.1 followed by the port means the socket is bound to the loopback interface only, so the operating system will accept connections to it from processes on the same machine and will actively refuse connections arriving from any other host, regardless of firewall configuration — this is why a database or a dev server can be reachable when you are logged into the box and testing against localhost but refuse every connection from elsewhere. An address of 0.0.0.0, or an asterisk, followed by the port means the socket is bound to all interfaces and will accept connections from any address that can route to the host, subject then to the firewall and security-group layers. When a connection is being refused, checking this on the server immediately distinguishes a service that is down from a service that is up but listening only on localhost, which need completely different fixes.',
        explainHi: 'Ye command ek saath decision-tree ke do questions answer karता hai: kya service running hai, aur ye kaunसे address par bound hai. Har line ek listening socket hai. Process column program aur iski process id name karता hai, to expected port ke liye ek missing line ka matlab service bilkul running nahi. Local address column critical detail hai. 127.0.0.1 ke baad port ka matlab socket sirf loopback interface se bound hai, to OS ise same machine ke processes se connections accept karega aur kisi doosरे host se aane wali connections ko actively refuse karega, firewall configuration se independent. 0.0.0.0, ya ek asterisk, ke baad port ka matlab socket all interfaces se bound hai. Jab ek connection refuse ho rahा hai, server par ise check karना turant ek down service ko ek up service se distinguish karता hai jo sirf localhost par listen kar rahी hai.',
      },
      {
        title: 'Refused vs timed out — and walking the layers',
        titleHi: 'Refused vs timed out — aur layers walk karna',
        code: `# CASE A — "connection refused" (fast, instant):
$ curl -v --connect-timeout 5 http://10.0.10.5:8080
*   Trying 10.0.10.5:8080...
* connect to 10.0.10.5 port 8080 failed: Connection refused
# -> the SYN reached the host; its OS sent RST. NETWORK PATH IS FINE.
#    the service isn't listening on :8080. check on the box:
$ ssh 10.0.10.5 'ss -tlnp | grep 8080'   # (nothing) -> service down, OR:
LISTEN 0 4096 127.0.0.1:8080 ...          # bound to localhost -> that's the bug

# CASE B — "connection timed out" (slow, ~tens of seconds):
$ curl -v --connect-timeout 5 http://10.0.20.9:8080
*   Trying 10.0.20.9:8080...
* Connection timed out after 5001 milliseconds
# -> the SYN got NO reply. something is DROPPING it. walk the layers:
$ aws ec2 describe-security-groups --group-ids sg-123 \\
    --query 'SecurityGroups[0].IpPermissions[?FromPort==\`8080\`]'
[]                                         # <- no inbound rule for 8080. FOUND IT.
# add: allow inbound TCP 8080 from the client's SG / CIDR. retry -> works.

# if the SG was fine, next checks:
$ ssh 10.0.20.9 'sudo nft list ruleset | grep -A3 "tcp dport"'   # host firewall
$ aws ec2 describe-network-acls ...        # NACL: inbound 8080 AND outbound ephemeral
$ ip route get 10.0.20.9                   # is there even a route? (from the client)`,
        output: `"Connection refused" is fast and means the host is reachable but nothing is listening on that port - a service or bind problem, checked with ss on the box. "Connection timed out" is slow and means the SYN is being silently dropped - a filtering or routing problem, worked by checking the security group inbound rules, then the host firewall, then the network ACL (both directions), then the route.`,
        explain: 'The two failure modes point at different halves of the problem and are distinguished by speed as much as by message. A refusal is immediate because the host received the connection attempt and its operating system actively rejected it by sending a reset packet, which it does when no process is listening on the requested port. This tells you the entire network path is working and the fault is local to the server: the service has stopped, has crashed, is listening on a different port, or is bound only to the loopback address. The next step is on the server itself, listing listening sockets. A timeout is slow because the connection attempt received no answer of any kind and the client waited for its timer to expire. This means a device on the path is discarding the packet without replying, which is the normal behaviour of a firewall configured to drop rather than reject, or the host is unreachable. The next steps walk the filtering layers in order from the one most likely to be the cause: the instance security group\'s inbound rules, then the host firewall on the instance, then the stateless network ACL where both the inbound rule and the outbound rule for return traffic must be present, and finally whether a route to the destination exists at all. Each layer is checked with a specific command, and the first one found closed is the cause.',
        explainHi: 'Do failure modes problem ke alag halves par point karते hain aur speed se utna hi distinguish kiye jाते hain jitna message se. Ek refusal immediate hai kyunki host ne connection attempt receive kiya aur iske OS ne ek reset packet bhejकar ise actively reject kiya, jo ye tab karता hai jab koi process requested port par listen nahi kar raha. Ye aapको bताता hai ki poora network path kaam kar raha hai aur fault server ke local hai. Agla step server par khud hai, listening sockets list karना. Ek timeout slow hai kyunki connection attempt ko kisi bhi tarah ka koi answer nahi mila. Iska matlab path par ek device packet ko discard kar raha hai bina reply kiye. Agle steps filtering layers ko order mein walk karте hain: instance security group ke inbound rules, phir host firewall, phir stateless network ACL, aur aakhir mein kya ek route exist karта hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "the service is up but nothing can reach it" — and blaming the firewall
$ ss -tlnp | grep :3000
LISTEN 0 511 127.0.0.1:3000 users:(("node",pid=1200))
# spends an hour adding security-group rules, opening ufw, checking NACLs.
# none of it matters: the app is bound to 127.0.0.1. it will NEVER accept a
//   remote connection no matter how open every firewall is.`,
        right: `# bind the service to 0.0.0.0 (all interfaces), THEN control access with the
# security group / firewall:
#   node:   app.listen(3000, '0.0.0.0')       # not '127.0.0.1', not 'localhost'
#   many frameworks: HOST=0.0.0.0  or  --host 0.0.0.0
# verify:
$ ss -tlnp | grep :3000
LISTEN 0 511 0.0.0.0:3000 users:(("node",pid=1200))
# now a remote client that passes the SG/firewall can connect.`,
        why: 'A listening socket bound to the loopback address accepts connections only from the same host, and this is enforced by the operating system\'s network stack before any firewall is consulted. No amount of opening security groups, host firewall rules, or network ACLs can make such a service reachable from another machine, because the packets are refused at the socket layer, not filtered at a firewall. The symptom — the process is clearly running and listening, yet every remote connection is refused — leads people to assume the network is blocking them and to spend time widening firewall rules that were never the constraint. The check that settles it is to list the listening sockets and read the bind address: loopback means local-only by design. The fix is to configure the service to bind to the unspecified address, which makes it listen on all interfaces, and then to use the firewall and security-group layers to control who may actually reach it. Binding broadly and filtering deliberately is the correct order; binding narrowly and hoping the firewall compensates does not work because the firewall never gets the chance.',
        whyHi: 'Ek listening socket jo loopback address se bound hai sirf same host se connections accept karта hai, aur ye OS ke network stack dwara kisi bhi firewall consult hone se pehle enforce kiya jाता hai. Kितना bhi security groups, host firewall rules, ya network ACLs kholना aisी service ko doosरी machine se reachable nahi bana sakта, kyunki packets socket layer par refuse kiye jaते hain, ek firewall par filter nahi. Symptom — process clearly running aur listening hai, phir bhi har remote connection refused hai — logon ko assume karवाता hai ki network unhe block kar raha hai. Jo check ise settle karता hai wo listening sockets list karना aur bind address padhना hai: loopback matlab local-only by design. Fix service ko unspecified address se bind karने ke liye configure karना hai, aur phir firewall layers istemal karना.',
      },
      {
        wrong: `# hand-tightening a network ACL to "only allow 443" and breaking all outbound
# NACL inbound:  allow tcp 443 from 0.0.0.0/0 ; deny all
# NACL outbound: allow tcp 443 to 0.0.0.0/0  ; deny all
# -> inbound web traffic works. but now the instance's OWN outbound calls hang:
//    it connects out to an API on :443 (allowed), the reply comes back to its
//    ephemeral source port ~54321 INBOUND — which the "deny all" inbound blocks.
//    every outbound HTTPS call from the box times out.`,
        right: `# NACLs are STATELESS — you must allow the RETURN traffic explicitly, on the
# ephemeral port range, in BOTH rule sets:
#   inbound:  allow 443 from 0.0.0.0/0 ; allow 1024-65535 from 0.0.0.0/0 (returns) ; deny all
#   outbound: allow 443 to 0.0.0.0/0   ; allow 1024-65535 to 0.0.0.0/0 (returns)   ; deny all
# OR (usually better): leave the NACL permissive and do all filtering in the
# STATEFUL security group, which auto-allows return traffic with no extra rules.`,
        why: 'A network ACL evaluates each packet on its own with no knowledge of connections, so it does not associate a reply with the request that prompted it. When an instance opens an outbound connection, the request goes out to the well-known destination port but the response comes back addressed to the instance\'s ephemeral source port, which is a high number chosen at random for that connection. If the ACL\'s inbound rules permit only the well-known service ports and deny everything else, they deny these return packets, and every connection the instance initiates outbound hangs until it times out — while inbound service traffic, whose replies leave on the outbound rules, may still work, making the failure look unrelated to the ACL. To use a stateless ACL correctly you must add companion rules permitting the entire ephemeral port range for return traffic in both directions. Because this is easy to get wrong and the failure is confusing, the common practice is to leave the network ACL permissive and perform all access control in the security group, which is stateful and therefore permits return traffic automatically without any extra rule.',
        whyHi: 'Ek network ACL har packet ko apne aap par evaluate karता hai bina connections ke knowledge ke, to ye ek reply ko us request ke saath associate nahi karता jisne ise prompt kiya. Jab ek instance ek outbound connection kholता hai, request well-known destination port par jाती hai par response instance ke ephemeral source port par addressed wapas aata hai, jo ek high number hai. Agar ACL ke inbound rules sirf well-known service ports permit karते hain, wo in return packets ko deny karते hain, aur har connection jo instance outbound initiate karता hai hang hoती hai. Ek stateless ACL ko correctly istemal karने ke liye aapको dono directions mein return traffic ke liye poore ephemeral port range ko permit karने wale companion rules add karने hain. Common practice network ACL ko permissive chhoड़ना aur security group mein saara access control karना hai.',
      },
      {
        wrong: `# not distinguishing "refused" from "timed out" and guessing
# "can't connect to the DB" -> immediately starts editing security groups,
# adds 0.0.0.0/0 on 5432 (!), restarts things, escalates.
# the actual error was "Connection refused" the whole time -> the DB process
//   had crashed. no firewall change was ever needed; one was a security hole.`,
        right: `# READ THE ERROR first — it tells you which half of the problem you have:
#   "Connection refused"  (instant) -> host reachable, nothing listening.
#      -> check the service:  ss -tlnp | grep :5432  (down? bound to 127.0.0.1?)
#   "Connection timed out" (slow)   -> SYN dropped.
#      -> walk the filters: SG inbound? host fw? NACL both ways? route?
#   "No route to host"              -> routing / peering / VPN.
#   "Name or service not known"     -> DNS.
# match the fix to the actual failure. never widen a firewall on a guess.`,
        why: 'The text of a connection error identifies which class of problem is present, and acting without reading it leads to changes that do not address the fault and may create new problems. A refusal means the host is reachable and responded, so nothing on the network path is blocking the connection and no firewall change is warranted; the fault is the service not listening, and widening a firewall rule in response does nothing except, if done carelessly such as opening a database port to the entire internet, introduce a security exposure. A timeout means the packet is being dropped without a response, which is a filtering or routing fault and is where firewall and security-group rules are the right place to look. A no-route error is an internet-layer problem about missing routing configuration. A name-resolution error never got as far as attempting a connection. Each of these has a different investigation path and a different fix, and the error text tells you which one you are in before you touch anything. Reading it first, and matching the response to the actual failure mode, avoids both wasted effort and the risk of a panicked change that widens access unnecessarily.',
        whyHi: 'Ek connection error ka text identify karता hai ki kaunसा class of problem present hai, aur ise padhे bina act karना aisे changes ki taraf le jата hai jo fault address nahi karते aur naye problems create kar sakते hain. Ek refusal matlab host reachable hai aur respond kiya, to network path par kुछ connection block nahi kar raha aur koi firewall change warranted nahi; fault service ka listen na karना hai, aur response mein ek firewall rule widen karना kुछ nahi karता sivाy, agar carelessly kiya jaisे ek database port ko poore internet ko kholना, ek security exposure introduce karना. Ek timeout matlab packet bina response ke drop kiya ja raha hai. Ek no-route error ek internet-layer problem hai. Har ek ka ek alag investigation path aur ek alag fix hai, aur error text aapको bताता hai aap kaunसे mein ho.',
      },
    ],

    realWorld: [
      {
        en: '**A day lost to "the new service is unreachable"** — it was bound to `127.0.0.1` by a framework default; every firewall was already open. Now `ss -tlnp` is step one in the team\'s connectivity runbook, before anything in the cloud console.',
        hi: '**Ek din "naya service unreachable hai" par lost** — ye ek framework default se `127.0.0.1` par bound tha. Ab `ss -tlnp` team ke runbook mein step one hai.',
      },
      {
        en: '**All outbound API calls from a subnet started timing out** after someone "hardened" its network ACL to just 443 — the stateless ACL was dropping the return traffic on ephemeral ports. Reverted the NACL to permissive; kept the security group tight.',
        hi: '**Ek subnet se saare outbound API calls timeout hone lage** jab kisi ne iska network ACL "harden" kiya. Stateless ACL ephemeral ports par return traffic drop kar raha tha.',
      },
      {
        en: '**A `0.0.0.0/0` rule on port 5432 found in a security audit** — added during a panicked "can\'t connect to the DB" incident whose actual cause was a crashed Postgres process ("connection refused", not "timed out"). The rule had been open for months.',
        hi: '**Ek security audit mein port 5432 par ek `0.0.0.0/0` rule mila** — ek panicked incident ke dauran add kiya jiska actual cause ek crashed Postgres process tha.',
      },
    ],

    interviewQA: [
      {
        q: 'A client cannot connect to a service. Walk me through how you diagnose it.',
        qHi: 'Ek client ek service se connect nahi kar sakта. Mujhe walk through karो aap ise kaise diagnose karते ho.',
        a: 'I start by reading the exact error, because it partitions the problem. "Name not resolved" is DNS: I check the name resolves to the right address, from the right resolver, watching for split-horizon. Given a correct address, "connection refused" and "connection timed out" mean very different things. Refused is instant and means the host received the SYN and its OS sent a reset because nothing is listening on that port — the network is fine and the fault is the service. I check on the server with ss listing listening sockets: either there is no line for the port, so the service is down, or it is bound to 127.0.0.1, so it only accepts local connections and must be rebound to 0.0.0.0. Timed out is slow and means the SYN got no reply, so something is silently dropping it. I test the port from the client with netcat or curl to confirm, then walk the filtering layers from outside in: the instance security group\'s inbound rules for that port and source, the host firewall on the instance, and the network ACL on the subnet — remembering the ACL is stateless so it needs both an inbound rule and an outbound rule covering the ephemeral range for replies. I fix the first layer found closed. If it still times out, it is routing: different subnets or VPCs or on-prem, so I check route tables, peering or transit gateway, the VPN, and that the CIDR ranges do not overlap, using traceroute to see where packets stop. I never widen a firewall rule on a guess, especially not to the whole internet.',
        aHi: 'Main exact error padhकर shuru karता hoon, kyunki ye problem partition karता hai. "Name not resolved" DNS hai. Ek correct address diya, "connection refused" aur "connection timed out" bahut alag cheezें matlab. Refused instant hai aur matlab host ne SYN receive kiya aur iske OS ne ek reset bheja kyunki koi us port par listen nahi kar raha — network fine hai aur fault service hai. Main server par ss se check karता hoon: ya to port ke liye koi line nahi (service down), ya ye 127.0.0.1 par bound hai (rebind to 0.0.0.0). Timed out slow hai aur matlab SYN ka koi reply nahi. Main client se port test karता hoon, phir filtering layers outside-in walk karता hoon: security group inbound rules, host firewall, network ACL (stateless — inbound aur outbound dono chahiye). Agar abhi bhi timeout, ye routing hai. Main kabhi ek guess par firewall rule widen nahi karता.',
      },
      {
        q: 'Explain stateful versus stateless firewalls and why it matters for return traffic.',
        qHi: 'Stateful versus stateless firewalls samjhाओ aur ye return traffic ke liye kyun matter karता hai.',
        a: 'A stateful firewall tracks connections. When it allows a packet that opens a connection, it records that connection in a table and then automatically permits the subsequent packets that belong to it, in both directions, without needing an explicit rule for the return path. So you write one rule per intended flow, in the direction the connection is initiated, and the replies are handled for you. Cloud security groups and typical host firewalls are stateful. A stateless firewall keeps no connection table and evaluates every packet independently against its rule list. This matters because of how ports work on a connection: a client or an instance making an outbound connection sends to the well-known destination port, but the response comes back addressed to the ephemeral source port that was chosen for that connection, which is some high, effectively random number. A stateless filter that only permits inbound traffic on well-known ports will therefore drop all those responses, and every outbound connection hangs until timeout. To use a stateless filter correctly you must add explicit rules allowing the whole ephemeral port range for return traffic, in both the inbound and outbound directions. Network ACLs in AWS are the common example of stateless filtering, and because getting the return rules right is fiddly and the failures are confusing, the usual practice is to leave the ACL permissive and do the real access control in the stateful security group.',
        aHi: 'Ek stateful firewall connections track karता hai. Jab ye ek packet allow karता hai jo ek connection kholता hai, ye us connection ko ek table mein record karता hai aur phir automatically subsequent packets permit karता hai jo ise belong karते hain, dono directions mein, bina return path ke liye ek explicit rule ki zaroorat ke. To aap har intended flow ke liye ek rule likhते ho. Cloud security groups aur typical host firewalls stateful hain. Ek stateless firewall koi connection table nahi rakhता aur har packet ko independently evaluate karता hai. Ye matter karता hai kyunki: ek outbound connection karने wala client well-known destination port par bhejता hai, par response ephemeral source port par addressed wapas aata hai, jo koi high, effectively random number hai. Ek stateless filter jo sirf well-known ports par inbound permit karता hai un saare responses ko drop karega. Network ACLs stateless filtering ka common example hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the 3 filtering layers a connection to a cloud instance passes (plus the "is it listening?" check), say which are stateful and which stateless, and which one you tune most.',
        taskHi: 'Ek comment mein, 3 filtering layers list karो jo ek cloud instance ka ek connection pass karता hai.',
        hint: '(1) Network ACL — subnet level, STATELESS, ordered allow+deny, must allow BOTH directions incl. ephemeral ports for replies; usually left permissive. (2) Security group — instance level, STATEFUL (reply auto-allowed), allow-only / default-deny; THIS is the one you tune most. (3) Host firewall (iptables/nftables/ufw/firewalld, Windows FW) — on the box, STATEFUL, often open on cloud VMs, strict on-prem. Plus (4) is the service running AND bound to a reachable address — 0.0.0.0 (all interfaces) vs 127.0.0.1 (localhost only, never remotely reachable).',
        hintHi: '(1) Network ACL — subnet level, STATELESS, DONO directions allow karना. (2) Security group — instance level, STATEFUL, allow-only; ise aap sabse zyada tune karते ho. (3) Host firewall — box par, STATEFUL, cloud VMs par aksar open. Plus (4) service running AND ek reachable address par bound — 0.0.0.0 vs 127.0.0.1.',
      },
      {
        task: 'For each: say whether it is "connection refused" or "connection timed out", and the next diagnostic step. (a) Postgres process crashed. (b) Security group has no inbound rule for the port. (c) App bound to 127.0.0.1. (d) Wrong VPC, no peering.',
        taskHi: 'Har ek ke liye: "refused" ya "timed out" batao, aur agla diagnostic step.',
        hint: '(a) REFUSED (fast) — host up, nothing listening → `ss -tlnp | grep :5432` on the box confirms the process is gone. (b) TIMED OUT (slow) — SYN silently dropped → check the SG inbound rules for that port+source. (c) REFUSED (fast) — the OS refuses non-local connections to a loopback bind → `ss -tlnp` shows `127.0.0.1:PORT`; rebind to `0.0.0.0`. (d) TIMED OUT (slow), or "no route to host" — → check route tables / VPC peering / transit gateway / CIDR overlap; `traceroute` shows where it stops.',
        hintHi: '(a) REFUSED (fast) → `ss -tlnp | grep :5432`. (b) TIMED OUT (slow) → SG inbound rules check karो. (c) REFUSED (fast) → `ss -tlnp` `127.0.0.1:PORT` dikhता hai; `0.0.0.0` rebind karो. (d) TIMED OUT / "no route to host" → route tables / VPC peering / CIDR overlap; `traceroute`.',
      },
      {
        task: 'In a comment, explain why "hardening" a network ACL to allow only ports 80 and 443 breaks the instance\'s own outbound HTTPS calls, and give two correct approaches.',
        taskHi: 'Ek comment mein, samjhाओ kyun ek network ACL ko sirf 80 aur 443 allow karने ke liye "harden" karना instance ki apni outbound HTTPS calls ko breaks karता hai.',
        hint: 'Network ACLs are STATELESS: each packet judged alone, no connection tracking. When the instance makes an outbound HTTPS call, the request goes to `:443` but the reply comes back to the instance\'s EPHEMERAL source port (a high number, e.g. 54321) INBOUND. An inbound ruleset of "allow 80, allow 443, deny all" drops that reply → the outbound call hangs and times out. Correct: (a) add companion rules allowing the ephemeral range (1024-65535) for return traffic in BOTH inbound and outbound rulesets; or (b) leave the NACL permissive and do all filtering in the STATEFUL security group, which auto-allows return traffic with no extra rules.',
        hintHi: 'Network ACLs STATELESS hain: har packet akela judged. Jab instance ek outbound HTTPS call karता hai, request `:443` par jाती hai par reply instance ke EPHEMERAL source port par INBOUND wapas aata hai. Ek inbound ruleset "allow 80, allow 443, deny all" us reply ko drop karта hai → outbound call hang. Correct: (a) ephemeral range (1024-65535) ke liye companion rules add karो dono rulesets mein; ya (b) NACL permissive chhoड़о aur STATEFUL security group mein filter karो.',
      },
    ],

    keyTakeaways: [
      'A PORT (0-65535) identifies which service on a host a connection is for; a server LISTENS on a fixed port, a client uses a random high EPHEMERAL port as its source (replies come back there). Know: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 5432 Postgres, 6379 Redis, 27017 Mongo. Ports < 1024 are privileged (need elevated privilege to bind) — a reason apps sit behind a proxy on 80/443 and listen on 8080/3000 themselves.',
      'A connection to a cloud instance passes 3 FILTERING LAYERS + the "is anything listening?" check: (1) NETWORK ACL — subnet level, STATELESS, ordered allow+deny, must allow BOTH directions incl. the ephemeral range for replies; usually left permissive. (2) SECURITY GROUP — instance level, STATEFUL (allow the request → the reply is auto-allowed), allow-only / default-deny; the layer you tune most, and you can reference another SG as the source. (3) HOST FIREWALL — iptables/nftables/ufw/firewalld/Windows FW on the box itself, STATEFUL, often open on cloud VMs, strict on-prem, easy to forget. (4) IS ANYTHING LISTENING — the service must be up AND bound to `0.0.0.0` (all interfaces, remotely reachable) not `127.0.0.1` (localhost only — NO firewall change can make a loopback-bound service remotely reachable).',
      'STATEFUL (security groups, host firewalls) tracks connections → allow the request direction and the reply is automatic; you write ONE rule per flow. STATELESS (network ACLs) judges every packet alone → you must allow the request AND the reply, and replies arrive on EPHEMERAL ports, so an ACL that allows "only 443 in" silently DROPS the return traffic of the instance\'s OWN outbound calls. Fix: companion rules for ports 1024-65535 both ways, OR (better) leave the NACL permissive and filter in the stateful SG.',
      '"CONNECTION REFUSED" (fast, instant) = the SYN reached the host, its OS sent RST, NOTHING is listening on that port → the network path is FINE, the SERVICE is down / crashed / bound to `127.0.0.1` / wrong port → check `ss -tlnp | grep :PORT` on the box. "CONNECTION TIMED OUT" (slow, tens of s) = the SYN got NO reply → something is SILENTLY DROPPING it (SG / NACL / host firewall) or the host is down or there\'s no route → walk the filter layers. "No route to host" = routing/peering/VPN. "Name not known" = DNS. READ THE ERROR before acting — never widen a firewall (especially to `0.0.0.0/0`) on a guess.',
      '"CANNOT CONNECT" DECISION TREE, in order: (1) DNS — `dig +short host`, right IP? (watch split-horizon). (2) service up + bound right — `ss -tlnp | grep :PORT` on the box (`127.0.0.1` = the bug). (3) test the port from the client — `nc -vz IP PORT` / `curl -v telnet://IP:PORT` / `Test-NetConnection` → REFUSED goes to step 2, TIMEOUT goes to step 4. (4) walk the filters outermost-in — SG inbound rule for your source+port? NACL inbound AND outbound-ephemeral? host firewall (`ufw status`, `nft list ruleset`)? (5) still timing out → routing: different subnet/VPC/on-prem → route tables, peering/transit gateway, VPN, non-overlapping CIDRs; `traceroute`/`mtr` shows where packets stop. NAT recap: SNAT rewrites the SOURCE outbound (many private → one public); DNAT/port-forward rewrites the DESTINATION inbound (`docker run -p 8080:80`, K8s NodePort). TOOLKIT: `ss -tlnp` (listening sockets + process), `ss -tnp` (active), `curl -v` / `nc -vz` (test a port), `dig`, `ip route` / `traceroute` / `mtr` (path), `tcpdump -ni any port 443` (last resort — see the actual packets).',
    ],
    keyTakeawaysHi: [
      'Ek PORT (0-65535) identify karता hai ek host par kaunसी service ke liye ek connection hai; ek server ek fixed port par LISTEN karता hai, ek client source ke roop mein ek random high EPHEMERAL port istemal karता hai. Jaano: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 5432 Postgres, 6379 Redis. Ports < 1024 privileged hain.',
      'Ek cloud instance ka ek connection 3 FILTERING LAYERS + "kya kुछ listen kar raha hai?" check pass karता hai: (1) NETWORK ACL — subnet level, STATELESS, DONO directions allow karना incl. replies ke liye ephemeral range; usually permissive. (2) SECURITY GROUP — instance level, STATEFUL, allow-only; ise aap sabse zyada tune karते ho. (3) HOST FIREWALL — box par khud, STATEFUL, cloud VMs par aksar open, bhoolना aasan. (4) KYA KUCH LISTEN KAR RAHA HAI — service up AND `0.0.0.0` par bound honी chahiye (`127.0.0.1` nahi — KOI firewall change ek loopback-bound service ko remotely reachable nahi bana sakта).',
      'STATEFUL (security groups, host firewalls) connections track karता hai → request direction allow karो aur reply automatic; aap har flow ke liye EK rule likhते ho. STATELESS (network ACLs) har packet akela judge karता hai → aapको request AND reply allow karना, aur replies EPHEMERAL ports par aati hain, to ek ACL jo "sirf 443 in" allow karता hai silently instance ki apni outbound calls ka return traffic DROP karता hai.',
      '"CONNECTION REFUSED" (fast) = SYN host tak pahuncha, OS ne RST bheja, KUCH us port par listen nahi kar raha → network path FINE, SERVICE down / crashed / `127.0.0.1` par bound → `ss -tlnp | grep :PORT` check karो. "CONNECTION TIMED OUT" (slow) = SYN ka KOI reply nahi → kुछ SILENTLY DROP kar raha (SG / NACL / host firewall) ya host down → filter layers walk karो. ERROR PADHО act karne se pehle — kabhi ek guess par firewall widen mat karो.',
      '"CANNOT CONNECT" DECISION TREE, order mein: (1) DNS — `dig +short host`. (2) service up + bound right — `ss -tlnp | grep :PORT` (`127.0.0.1` = bug). (3) client se port test karो — `nc -vz IP PORT` → REFUSED step 2 par, TIMEOUT step 4 par. (4) filters walk karो outermost-in — SG inbound? NACL inbound AND outbound-ephemeral? host firewall? (5) abhi bhi timeout → routing: route tables, peering, VPN, non-overlapping CIDRs; `traceroute`/`mtr`. NAT: SNAT SOURCE outbound rewrite karता hai; DNAT/port-forward DESTINATION inbound rewrite karता hai. TOOLKIT: `ss -tlnp`, `curl -v` / `nc -vz`, `dig`, `ip route` / `traceroute` / `mtr`, `tcpdump -ni any port 443` (last resort).',
    ],
  },
];
