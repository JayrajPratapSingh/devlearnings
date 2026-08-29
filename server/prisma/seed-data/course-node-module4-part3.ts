/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 3.
 *
 * CORS (Cross-Origin Resource Sharing): why a browser blocks a frontend on
 * one origin from reading a backend's response on another origin by
 * default, and why the common "fix" of wildcarding
 * Access-Control-Allow-Origin: * combined with credentials is a serious
 * security hole rather than a real fix. Broken example: a developer sees a
 * CORS error in the browser console and reflexively sets a wildcard origin
 * with credentials enabled, which either silently fails (browsers reject
 * that exact combination) or, if misconfigured slightly differently,
 * genuinely allows any website on the internet to make authenticated
 * requests using a logged-in user's cookies. Fixed with the cors middleware
 * configured against a specific allowlist of trusted origins.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_4_PART3: CourseLesson[] = [
  {
    slug: 'cors-cross-origin-requests',
    title: 'CORS: Why the Browser Blocks Your Own API, and How to Fix It Safely',
    titleHi: 'CORS: Browser Tumhaari Apni API Ko Kyun Rokta Hai, Aur Ise Surakshit Tarike Se Kaise Theek Karo',
    description: 'A frontend on localhost:3000 calls a backend on localhost:4000 and the browser console shows "blocked by CORS policy" — even though the request never even reached a login check.',
    descriptionHi: 'Ek frontend localhost:3000 par ek backend localhost:4000 ko call karta hai aur browser console "blocked by CORS policy" dikhaata hai — chahe request kabhi ek login check tak pahunchi hi nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**An apartment building\'s front desk that, by default, refuses to accept packages addressed to a resident unless the delivery company is on a pre-approved list — versus a front desk that, in a moment of frustration, starts accepting packages from literally any delivery company, no questions asked, including ones carrying the master key to every resident\'s mailbox.** A browser refusing to let JavaScript running on one website (\`http://localhost:3000\`) read a response from a different website (\`http://localhost:4000\`) is like a front desk that, by default policy, will not hand a package to just anyone who walks in claiming to be a courier — only couriers from companies the building has explicitly pre-approved are allowed to complete a delivery. This is not the front desk being needlessly difficult; it exists specifically because, without this check, literally any courier company (including ones with bad intentions) could walk in, claim to be delivering something, and instead walk out with whatever they wanted from a resident\'s held mail. A frustrated building manager who just wants deliveries to stop being rejected might be tempted to simply tell the front desk "accept packages from ANY courier, no ID check at all" — which does make the immediate annoyance go away, but also means any courier, good or bad, now has exactly the same access as a pre-approved one; if that "any courier" policy is combined with also handing over a resident\'s spare mailbox key to whoever asks (the credentialed-request equivalent), the building has gone from "annoyingly strict" to "handing out master keys to strangers." The correct fix is not removing the check — it is properly adding the SPECIFIC couriers that genuinely should be allowed to the pre-approved list, so legitimate deliveries succeed while the check itself keeps doing its job against everyone else.',
      hi: '**Ek apartment building ka front desk jo, default taur par, ek resident ke naam kisi package ko accept karne se mana karta hai jab tak delivery company ek pehle-se-approved list mein na ho — versus ek front desk jo, gusse ke ek pal mein, literally kisi bhi delivery company se packages accept karna shuru kar deta hai, koi sawaal nahi, un companies sameet jo har resident ke mailbox ki master key le kar aati hain.** Ek browser jo ek website (\`http://localhost:3000\`) par chal rahe JavaScript ko ek alag website (\`http://localhost:4000\`) se ek jawaab padhne se mana karta hai aise hai jaise ek front desk jo, default policy se, kisi ko bhi package nahi degi jo bas andar aakar courier hone ka daava kare — sirf un companies ke couriers ko delivery poori karne diya jaata hai jise building ne explicitly pehle-se-approve kiya hai. Ye front desk ka bewajah mushkil hona nahi hai; ye khaas taur par isliye maujood hai kyunki, is check ke bina, literally koi bhi courier company (bure iraade wali sameet) andar aa sakti hai, kuch deliver karne ka daava kar sakti hai, aur iske bajaye ek resident ke rakhe hue mail se jo bhi chahe le kar bahar ja sakti hai. Ek gussa hua building manager jo bas chahta hai ki deliveries reject hona band ho jaayein front desk ko bas "KISI BHI courier se accept karo, koi ID check bilkul nahi" kehne ke liye lubhaaya jaa sakta hai — jo turant taklif ko khatam kar deta hai, par iska matlab ye bhi hai ki koi bhi courier, achha ya bura, ab bilkul wahi access rakhta hai jo ek pehle-se-approved wala. Agar wo "koi bhi courier" policy ek resident ki extra mailbox key kisi ke bhi maangne par dene ke saath jodi jaaye (credentialed-request ka barabar), building "bewajah sakht" se "ajnabiyon ko master keys de dena" tak chala gaya hai. Sahi fix check hataana nahi hai — ye theek tarike se un KHAAS couriers ko pehle-se-approved list mein jodna hai jinhe sach mein allow hona chahiye, taaki legitimate deliveries safal hon jabki check khud har kisi doosre ke khilaaf apna kaam karta rahe.',
    },

    simple: `**Start broken.** A frontend on \`http://localhost:3000\` calling a backend on \`http://localhost:4000\`, the backend written with nothing special done about CORS at all:

\`\`\`js
// frontend, running at http://localhost:3000
fetch("http://localhost:4000/api/posts")
  .then((res) => res.json())
  .then((data) => console.log(data));
\`\`\`

Opening the browser\'s developer console reveals an error along the lines of \`Access to fetch at 'http://localhost:4000/api/posts' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource\` — and, importantly, this happens even though the backend route itself works perfectly (testing the exact same URL directly in the browser\'s address bar, or with \`curl\`, returns the data with no problem at all). This is specifically a BROWSER-enforced restriction, not a backend bug: browsers implement a security policy called the "same-origin policy," which blocks JavaScript running on one origin (a combination of protocol, domain, and port — \`http://localhost:3000\` is a different origin from \`http://localhost:4000\` purely because the port differs) from reading the response of a request made to a different origin, UNLESS that different origin explicitly says, via specific response headers, that it permits being read by the requesting origin. The backend, by default, sends no such permission headers at all, so the browser — correctly following its own security policy — throws the response away before the frontend\'s JavaScript ever gets to see it.

**A tempting but dangerous "fix": wildcard everything**

\`\`\`js
// DANGEROUS — allows literally any website to read this API's responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
\`\`\`

Seeing the CORS error and wanting it to simply go away, a common but dangerous reflex is to set \`Access-Control-Allow-Origin\` to \`*\` (a wildcard meaning "any origin is allowed"). For routes that genuinely serve public, non-sensitive data to anyone, a wildcard alone is a reasonable, deliberate choice — but the moment credentials (cookies, or an \`Authorization\` header carrying a session or token tied to a specific logged-in user) are involved, this becomes seriously dangerous: browsers actually REJECT the specific combination of a wildcard origin together with \`Access-Control-Allow-Credentials: true\` (recognizing exactly this risk), but developers attempting to work around that rejection sometimes reflect the REQUESTING origin back dynamically instead of a literal \`*\`, which technically satisfies the browser\'s rule while accidentally recreating the exact same danger a wildcard would have caused: any website on the internet, including a malicious one, can now make a request that includes a victim\'s login cookies, and the backend will happily process it as if it came from a trusted, legitimate frontend.

**The actual fix: an explicit allowlist of trusted origins**

\`\`\`js
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
\`\`\`

\`\`\`ts
import cors from "cors";

const allowedOrigins: string[] = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
\`\`\`

The \`cors\` package (an Express middleware, following the same middleware pattern covered earlier in this course) sends the correct \`Access-Control-Allow-Origin\` response header automatically, but crucially, it checks the actual REQUESTING origin against an explicit list the developer controls, rather than blindly allowing everyone. Requests from \`http://localhost:3000\` (a trusted frontend) succeed exactly as intended; requests from any other, unrecognized origin are correctly rejected by the browser, because the response never includes permission for that specific origin. This is the actual fix: not removing the browser\'s protection, but correctly telling it exactly which origins are genuinely trusted, so legitimate cross-origin requests work while the protection keeps doing its job against everyone else.`,

    simpleHi: `**Toote hue se shuru.** Ek frontend \`http://localhost:3000\` par jo ek backend \`http://localhost:4000\` par call karta hai, backend mein CORS ke baare mein kuch bhi khaas kiya bina likha hua:

\`\`\`js
// frontend, http://localhost:3000 par chal raha
fetch("http://localhost:4000/api/posts")
  .then((res) => res.json())
  .then((data) => console.log(data));
\`\`\`

Browser ka developer console kholna ek error dikhaata hai kuch is tarah \`Access to fetch at 'http://localhost:4000/api/posts' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource\` — aur, zaruri baat, ye tab hota hai chahe backend route khud poori tarah theek kaam karta ho (bilkul wahi URL ko seedha browser ke address bar mein test karna, ya \`curl\` se, bina kisi samasya ke data lautaata hai). Ye khaas taur par ek BROWSER-lagu ki hui rok hai, koi backend bug nahi: browsers ek security policy lagu karte hain jise "same-origin policy" kehte hain, jo ek origin (protocol, domain, aur port ka ek milaan — \`http://localhost:3000\` ek alag origin hai \`http://localhost:4000\` se sirf isliye kyunki port alag hai) par chal rahe JavaScript ko ek alag origin ko ki gayi request ke jawaab ko padhne se rokti hai, SIRF AGAR wo alag origin explicitly, khaas response headers ke through, ye kehta hai ki wo requesting origin dwara padhe jaane ki ijaazat deta hai. Backend, default taur par, koi aisi permission headers bilkul nahi bhejta, isliye browser — apni khud ki security policy ko sahi tarike se follow karte hue — jawaab ko phenk deta hai us se pehle ki frontend ka JavaScript use kabhi dekhe.

**Ek lubhaawana par khatarnaak "fix": sab kuch wildcard karo**

\`\`\`js
// KHATARNAAK — literally kisi bhi website ko is API ke jawaab padhne deta hai
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
\`\`\`

CORS error dekhkar aur ise bas chahte hue ki ye chala jaaye, ek aam par khatarnaak jhatka \`Access-Control-Allow-Origin\` ko \`*\` (ek wildcard jiska matlab hai "koi bhi origin allowed hai") set karna hai. Un routes ke liye jo sach mein saarvajanik, non-sensitive data kisi ko bhi dete hain, akela ek wildcard ek uchit, jaan-boojhkar choice hai — par jis pal credentials (cookies, ya ek \`Authorization\` header jo ek khaas logged-in user se juda session ya token le jaata hai) shaamil hote hain, ye gambhir taur par khatarnaak ban jaata hai: browsers asal mein ek wildcard origin aur \`Access-Control-Allow-Credentials: true\` ke khaas milaan ko REJECT karte hain (bilkul isi khatre ko pehchaante hue), par jo developers us rejection ke aas-paas kaam karne ki koshish karte hain kabhi-kabhi ek literal \`*\` ke bajaye REQUESTING origin ko dynamically wapas reflect karte hain, jo technically browser ke rule ko santusht karta hai jabki samyog se bilkul wahi khatra dobara paida karta hai jo ek wildcard ne kiya hota: internet par koi bhi website, ek malicious sameet, ab ek aisi request kar sakti hai jismein ek victim ke login cookies shaamil hon, aur backend use khushi-khushi process karega jaise ye ek bharosemand, legitimate frontend se aayi ho.

**Asli fix: bharosemand origins ki ek explicit allowlist**

\`\`\`js
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
\`\`\`

\`\`\`ts
import cors from "cors";

const allowedOrigins: string[] = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
\`\`\`

\`cors\` package (ek Express middleware, is course mein pehle cover hue usi middleware pattern ka palan karte hue) apne aap sahi \`Access-Control-Allow-Origin\` response header bhejta hai, par bahut zaruri, ye asli REQUESTING origin ko ek explicit list ke khilaaf check karta hai jise developer control karta hai, har kisi ko andhe taur par allow karne ke bajaye. \`http://localhost:3000\` (ek bharosemand frontend) se requests bilkul iraade ke hisaab se safal hoti hain; kisi bhi doosre, na-pehchaane origin se requests browser dwara sahi tarike se reject hoti hain, kyunki jawaab mein us khaas origin ke liye kabhi permission shaamil nahi hoti. Yehi asli fix hai: browser ke protection ko hataana nahi, balki use sahi tarike se bataana ki bilkul kaunse origins sach mein bharosemand hain, taaki legitimate cross-origin requests kaam karein jabki protection khud har kisi doosre ke khilaaf apna kaam karta rahe.`,

    content: `## Preflight requests: why some requests trigger an extra OPTIONS call first

\`\`\`
OPTIONS /api/posts HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization
\`\`\`

For requests that go beyond a small set of "simple" cases (a plain \`GET\`, or a \`POST\` with only ordinary form-style content types), the browser does not send the actual request immediately — it first sends a separate \`OPTIONS\` request, called a "preflight," asking the server in advance whether the real request (its method, and any custom headers like \`Authorization\`) will actually be permitted. Only if the server\'s preflight response confirms permission does the browser then send the real request at all — a \`DELETE\` request, or a request carrying a JWT in an \`Authorization\` header (exactly the pattern from the previous lesson), is a common case that triggers this. The \`cors\` middleware handles responding to these \`OPTIONS\` preflight requests automatically as part of its normal operation, which is one of the reasons using the well-tested \`cors\` package is preferable to hand-writing individual response headers — hand-rolled CORS handling frequently forgets to correctly handle preflight requests, causing routes that work fine with \`GET\` to mysteriously fail specifically for \`DELETE\`, \`PUT\`, or requests carrying custom headers.

## credentials: true on both sides — a request that must opt in from the client too

\`\`\`js
// Backend: allows credentialed requests from a specific trusted origin
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Frontend: must ALSO explicitly opt in to sending credentials
fetch("http://localhost:4000/api/profile", { credentials: "include" });
\`\`\`

Enabling \`credentials: true\` on the server is only half of what is required for cookies or credential-carrying headers to actually be sent cross-origin — the client-side request must ALSO explicitly opt in, typically via \`credentials: "include"\` on a \`fetch\` call (or the equivalent option on whatever HTTP client is in use). This double opt-in (server AND client both explicitly agreeing) is a deliberate safety design: it prevents cookies from being silently sent cross-origin by default in situations where neither side intended it, requiring both the origin sending the request and the origin receiving it to deliberately agree that credentials should be included.

## CORS protects browsers, not servers directly — server-to-server requests are unaffected

\`\`\`js
// A server calling another server — CORS does not apply here at all
const response = await fetch("http://localhost:4000/api/posts");
// This works from a Node.js script or another backend service with zero CORS
// configuration, because CORS is a BROWSER-enforced policy, not a server one.
\`\`\`

A detail that is easy to misunderstand at first: CORS is enforced entirely by the BROWSER, as a protection for the browser\'s own user, not a security mechanism the SERVER itself relies on to protect its own data. A request made directly from one backend server to another (using \`fetch\`, \`axios\`, or any HTTP client running in a plain Node.js process rather than inside a browser), a request made with \`curl\`, or a request made from a mobile app\'s native networking code, is not subject to CORS restrictions at all — those clients simply are not browsers, and have no same-origin policy to enforce. This means CORS configuration is never a substitute for genuine backend authentication and authorization (the JWT-based approach from the previous lesson) — a correctly configured CORS allowlist stops a malicious WEBSITE\'s JavaScript from making unauthorized credentialed requests on a victim\'s behalf, but it does nothing at all to stop a direct, deliberate request made outside a browser context; that protection has to come from properly verifying identity on every request, regardless of where it originated.

## Development-only wildcards: a real, narrower exception worth understanding

\`\`\`js
// Reasonable ONLY for a local development environment, never in production
app.use(cors({ origin: process.env.NODE_ENV === "development" ? "*" : allowedOrigins }));
\`\`\`

It is common, and reasonable, to relax CORS restrictions specifically during local development (where the convenience of not managing an exact origin list outweighs the risk, since no real user data is at stake on a developer\'s own machine), while keeping a strict, explicit allowlist in production. The key discipline this requires is making sure the relaxed development configuration can never accidentally ship to production — typically enforced by branching the CORS configuration on an environment variable (like \`NODE_ENV\`, covered in this course\'s earlier configuration lesson) and treating a mistakenly-permissive production CORS policy with the same seriousness as any other security misconfiguration.`,

    contentHi: `## Preflight requests: kuch requests pehle ek extra \`OPTIONS\` call kyun trigger karti hain

\`\`\`
OPTIONS /api/posts HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization
\`\`\`

Un requests ke liye jo "simple" cases ke ek chhote set se aage jaate hain (ek saadha \`GET\`, ya ek \`POST\` sirf aam form-style content types ke saath), browser turant asli request nahi bhejta — ye pehle ek alag \`OPTIONS\` request bhejta hai, "preflight" kehlaati hai, server se pehle hi poochte hue ki kya asli request (uska method, aur \`Authorization\` jaise koi khaas headers) sach mein permit hogi. Sirf tab jab server ka preflight response permission confirm karta hai browser tab asli request bhejta hai — ek \`DELETE\` request, ya ek request jo ek \`Authorization\` header mein ek JWT le jaati hai (bilkul pichhle lesson ka pattern), ek aam case hai jo ise trigger karta hai. \`cors\` middleware in \`OPTIONS\` preflight requests ka jawaab dena apni normal operation ke hisse ki tarah apne aap sambhaalta hai, jo ek wajah hai ki achhi tarah test kiya \`cors\` package istemal karna alag-alag response headers haath se likhne se behtar hai — haath-se-likhi CORS handling aksar preflight requests ko sahi tarike se sambhaalna bhool jaati hai, jis wajah se routes jo \`GET\` ke saath theek kaam karte hain khaas taur par \`DELETE\`, \`PUT\`, ya khaas headers le jaati requests ke liye rahasyamayi taur par fail hote hain.

## \`credentials: true\` dono taraf — ek request jise client se bhi opt in karna chahiye

\`\`\`js
// Backend: ek khaas bharosemand origin se credentialed requests allow karta hai
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Frontend: BHI explicitly credentials bhejne ke liye opt in karna chahiye
fetch("http://localhost:4000/api/profile", { credentials: "include" });
\`\`\`

Server par \`credentials: true\` enable karna sirf aadha hai jo zaruri hai cookies ya credential-le-jaati headers ko sach mein cross-origin bhejne ke liye — client-side request ko BHI explicitly opt in karna chahiye, aam taur par \`fetch\` call par \`credentials: "include"\` ke through (ya jo bhi HTTP client istemal ho raha hai uska barabar option). Ye dohra opt-in (server AUR client dono explicitly sehmat) ek jaan-boojhkar safety design hai: ye cookies ko default taur par chupke se cross-origin bheje jaane se rokta hai un sthitiyon mein jahan kisi bhi taraf ka iraada nahi tha, dono origin — request bhejne wala aur use paane wala — dono ko jaan-boojhkar sehmat hone ki maang karte hue ki credentials shaamil hone chahiye.

## CORS browsers ko surakshit karta hai, servers ko seedha nahi — server-to-server requests isse bekhabar hain

\`\`\`js
// Ek server jo ek doosre server ko bulaata hai — yahan CORS bilkul lagu nahi hota
const response = await fetch("http://localhost:4000/api/posts");
// Ye ek Node.js script ya ek doosre backend service se zero CORS configuration
// ke saath kaam karta hai, kyunki CORS ek BROWSER-lagu ki hui policy hai, koi server wali nahi.
\`\`\`

Ek detail jise shuru mein galat samajhna aasaan hai: CORS poori tarah BROWSER dwara lagu kiya jaata hai, browser ke apne user ke liye ek protection ki tarah, koi security mechanism nahi jis par SERVER khud apna data surakshit karne ke liye bharosa karta hai. Ek request jo seedha ek backend server se ek doosre ko ki jaati hai (\`fetch\`, \`axios\`, ya koi bhi HTTP client istemal karte hue jo ek saadhe Node.js process mein chal raha hai browser ke andar nahi), \`curl\` se ki gayi ek request, ya ek mobile app ke native networking code se ki gayi ek request, CORS restrictions ke bilkul adheen nahi hai — wo clients bas browsers hain hi nahi, aur unke paas lagu karne ke liye koi same-origin policy nahi hai. Iska matlab hai CORS configuration kabhi asli backend authentication aur authorization (pichhle lesson wala JWT-based tarika) ka substitute nahi hai — ek sahi tarike se configure ki gayi CORS allowlist ek malicious WEBSITE ke JavaScript ko ek victim ki taraf se anadhikrit credentialed requests karne se rokti hai, par ye ek seedhi, jaan-boojhkar browser context ke bahar ki gayi request ko rokne ke liye bilkul kuch nahi karti; wo protection har request par pehchaan ko sahi tarike se verify karne se aani chahiye, chahe wo kahin se bhi shuru hui ho.

## Development-only wildcards: ek asli, sankeern apvaad jise samajhna kaam ka hai

\`\`\`js
// Sirf ek local development environment ke liye uchit, kabhi production mein nahi
app.use(cors({ origin: process.env.NODE_ENV === "development" ? "*" : allowedOrigins }));
\`\`\`

Khaas taur par local development ke dauraan CORS restrictions dheela karna aam, aur uchit hai (jahan ek theek origin list na maintain karne ki suvidha khatre se zyaada bhaari hai, kyunki ek developer ki apni machine par koi asli user data daanv par nahi hai), jabki production mein ek sakht, explicit allowlist rakhte hue. Zaruri anushasan jo iske liye chahiye ye sunishchit karna hai ki dheeli development configuration kabhi samyog se production mein ship na ho — aam taur par CORS configuration ko ek environment variable par branch karke lagu kiya jaata hai (jaise \`NODE_ENV\`, is course ke pehle wale configuration lesson mein cover hua) aur ek galti-se-permissive production CORS policy ko kisi doosri security misconfiguration jitni hi gambhirta se treat karte hue.`,

    examples: [
      {
        title: 'Broken: no CORS headers at all — every cross-origin request is blocked',
        titleHi: 'Toota: bilkul koi CORS headers nahi — har cross-origin request block hoti hai',
        code: `// No CORS middleware, no headers at all
app.get("/api/posts", (req, res) => {
  res.json({ posts: [] });
});
// A browser-based frontend on a different origin cannot read this response`,
        codeJs: `const express = require("express");
const app = express();

app.get("/api/posts", (req, res) => {
  res.json({ posts: [] });
});

app.listen(4000);
// curl http://localhost:4000/api/posts works fine — the route itself is correct.
// fetch("http://localhost:4000/api/posts") from http://localhost:3000's
// JavaScript throws a CORS error in the browser console.`,
        codeTs: `import express, { Request, Response } from "express";
const app = express();

app.get("/api/posts", (req: Request, res: Response): void => {
  res.json({ posts: [] });
});

app.listen(4000);
// Correctly typed, completely valid TypeScript — the missing CORS
// headers are not a type error, since headers are a runtime HTTP
// concern the type system has no visibility into.`,
        output: `curl -i http://localhost:4000/api/posts returns 200 OK with no
Access-Control-Allow-Origin header. A browser fetch() from a different
origin's JavaScript fails with a CORS policy error, even though the
server itself processed the request successfully.`,
        explain: 'The backend genuinely handled the request correctly — the browser is the one refusing to hand the response to the frontend\'s JavaScript, specifically because no permission header was present.',
        explainHi: 'Backend ne request ko sach mein sahi tarike se handle kiya — browser wo hai jo response ko frontend ke JavaScript ko dene se mana kar raha hai, khaas taur par isliye kyunki koi permission header maujood nahi tha.',
      },
      {
        title: 'Dangerous: wildcard origin combined with credentials',
        titleHi: 'Khatarnaak: wildcard origin credentials ke saath jodi hui',
        code: `app.use(cors({ origin: "*", credentials: true }));
// browsers reject this exact combination — and workarounds that dynamically
// reflect the requesting origin recreate the same danger a wildcard would cause`,
        codeJs: `const cors = require("cors");
const express = require("express");
const app = express();

// DANGEROUS attempted workaround — reflects back whatever origin asked
app.use(cors({
  origin: (origin, callback) => callback(null, true), // accepts ANY origin
  credentials: true,
}));

app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ email: "user@example.com" });
});`,
        codeTs: `import cors from "cors";
import express, { Request, Response } from "express";
const app = express();

// DANGEROUS attempted workaround — reflects back whatever origin asked
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    callback(null, true); // accepts ANY origin — this is the bug
  },
  credentials: true,
}));

app.get("/api/profile", requireAuth, (req: Request, res: Response): void => {
  res.json({ email: "user@example.com" });
});`,
        output: `A malicious website, visited by a user who is separately logged into
this app, can now silently make a credentialed request to /api/profile
using that user's real cookies, and successfully read the response —
exactly what CORS exists to prevent.`,
        explain: 'Accepting every origin while also allowing credentials defeats the entire purpose of CORS — it removes the browser\'s protection instead of correctly configuring it.',
        explainHi: 'Har origin accept karna credentials allow karte hue CORS ke poore maqsad ko haraata hai — ye browser ke protection ko sahi tarike se configure karne ke bajaye hataata hai.',
      },
      {
        title: 'Fixed: an explicit allowlist of trusted origins',
        titleHi: 'Theek: bharosemand origins ki ek explicit allowlist',
        code: `const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));`,
        codeJs: `const cors = require("cors");
const express = require("express");
const app = express();

const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ email: "user@example.com" });
});`,
        codeTs: `import cors from "cors";
import express, { Request, Response } from "express";
const app = express();

const allowedOrigins: string[] = ["http://localhost:3000", "https://myapp.com"];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.get("/api/profile", requireAuth, (req: Request, res: Response): void => {
  res.json({ email: "user@example.com" });
});`,
        outputJs: `Requests from http://localhost:3000 succeed, correctly receiving the
Access-Control-Allow-Origin header matching that specific origin. A
request from any other, unrecognized origin is correctly rejected by
the browser.`,
        outputTs: `// Identical behaviour. The origin callback's typed signature
// (Error | null, boolean | undefined) makes the accept/reject contract
// explicit at compile time.`,
        explain: 'Legitimate cross-origin requests from trusted frontends now succeed exactly as intended, while the browser\'s protection continues correctly rejecting requests from anywhere else.',
        explainHi: 'Bharosemand frontends se legitimate cross-origin requests ab bilkul iraade ke hisaab se safal hoti hain, jabki browser ka protection kahin aur se requests ko sahi tarike se reject karta rehta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `app.use(cors({ origin: "*", credentials: true }));
// browsers reject this combination, or a workaround reflecting any origin recreates the same risk`,
        right: `app.use(cors({ origin: allowedOrigins, credentials: true }));
// an explicit list of specific, trusted origins`,
        why: 'Combining a wildcard (or an equivalent "accept any origin" workaround) with credentials allows any website on the internet to make authenticated requests using a victim\'s real cookies or tokens.',
        whyHi: 'Ek wildcard (ya ek barabar "koi bhi origin accept karo" workaround) ko credentials ke saath jodna internet par kisi bhi website ko ek victim ke asli cookies ya tokens istemal karke authenticated requests karne deta hai.',
      },
      {
        wrong: `// hand-written headers, missing OPTIONS preflight handling
res.header("Access-Control-Allow-Origin", "http://localhost:3000");
// DELETE and requests with custom headers mysteriously fail`,
        right: `app.use(cors({ origin: "http://localhost:3000" }));
// the cors package correctly handles OPTIONS preflight requests automatically`,
        why: 'Requests beyond simple GETs (DELETE, PUT, or requests carrying custom headers like Authorization) trigger a browser preflight OPTIONS request first — hand-written CORS headers frequently forget to handle this correctly.',
        whyHi: 'Saadhe GETs se aage ki requests (\`DELETE\`, \`PUT\`, ya \`Authorization\` jaisi khaas headers le jaati requests) pehle ek browser preflight \`OPTIONS\` request trigger karti hain — haath-se-likhi CORS headers aksar ise sahi tarike se sambhaalna bhool jaati hain.',
      },
      {
        wrong: `// assuming CORS protects the backend itself from unauthorized access
app.use(cors({ origin: allowedOrigins }));
app.get("/api/profile", (req, res) => { /* no auth check at all */ });`,
        right: `app.use(cors({ origin: allowedOrigins }));
app.get("/api/profile", requireAuth, (req, res) => { /* verified identity required */ });`,
        why: 'CORS is enforced by browsers only — a direct request from curl, a server, or a mobile app is not subject to CORS at all, so it can never substitute for genuine authentication and authorization on the backend.',
        whyHi: 'CORS sirf browsers dwara lagu kiya jaata hai — curl, ek server, ya ek mobile app se ek seedhi request CORS ke bilkul adheen nahi hai, isliye ye kabhi backend par asli authentication aur authorization ka substitute nahi ban sakta.',
      },
    ],

    realWorld: [
      {
        en: '**Nearly every full-stack application with a separately deployed frontend and backend (a common, standard architecture) needs correctly configured CORS to function at all** — this is one of the most commonly hit real-world configuration issues when a frontend and backend are first connected, and one of the most commonly misconfigured in a security-relevant way.',
        hi: '**Lagbhag har full-stack application jismein ek alag-alag deploy kiya frontend aur backend hai (ek aam, standard architecture) kaam karne ke liye sahi tarike se configure ki gayi CORS chahiye** — ye un sabse aam real-world configuration issues mein se ek hai jab ek frontend aur backend pehli baar jode jaate hain, aur security-relevant tarike se sabse aam misconfigure hone waalon mein se ek.',
      },
      {
        en: '**The wildcard-origin-plus-credentials mistake is common enough that browsers themselves explicitly reject that exact combination as a built-in safety measure** — the fact that browser vendors specifically built in a rejection for this pattern is strong evidence of how frequently developers have historically gotten this wrong.',
        hi: '**Wildcard-origin-plus-credentials galti itni aam hai ki browsers khud bilkul us khaas milaan ko ek built-in safety measure ki tarah explicitly reject karte hain** — is baat ka hona ki browser vendors ne khaas taur par is pattern ke liye ek rejection banaaya, iska strong saboot hai ki historically developers ise kitni baar galat karte aaye hain.',
      },
      {
        en: '**The cors npm package is one of the most widely used Express middleware packages in the entire ecosystem**, specifically because correctly handling every edge case (preflight requests, credentials, multiple allowed methods and headers) by hand is genuinely easy to get subtly wrong.',
        hi: '**\`cors\` npm package poore ecosystem mein sabse vyapak taur par istemal hone waale Express middleware packages mein se ek hai**, khaas taur par isliye kyunki har edge case (preflight requests, credentials, kai allowed methods aur headers) haath se sahi tarike se sambhaalna sach mein subtle taur par galat hona aasaan hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a browser block a cross-origin request by default, and why is this a browser-enforced restriction rather than something the backend server itself decides?',
        qHi: 'Ek browser default taur par ek cross-origin request kyun block karta hai, aur ye ek browser-lagu ki hui rok kyun hai koi aisi cheez nahi jise backend server khud faisla karta hai?',
        a: 'Browsers implement a security policy called the same-origin policy specifically to protect a user who is logged into one website (with cookies or credentials stored for that site) from a completely different, potentially malicious website silently making requests to the first site on the user\'s behalf and reading the results. Without this restriction, simply visiting a malicious webpage while separately logged into, say, a banking site in another tab could let that malicious page\'s JavaScript make requests to the banking site, automatically carrying the user\'s existing login cookies, and read whatever sensitive data comes back — entirely without the user\'s knowledge or any action beyond visiting the malicious page. This protection has to be enforced by the browser rather than the destination server because the browser is the only party positioned to know which website\'s JavaScript is actually making the request and, critically, to control whether that JavaScript is allowed to read the response at all — the server can send whatever response headers it wants, but it is the browser that decides, based on those headers, whether to actually hand the response back to the requesting page\'s JavaScript or block it.',
        aHi: 'Browsers ek security policy lagu karte hain jise same-origin policy kehte hain khaas taur par ek aise user ko bachaane ke liye jo ek website mein logged in hai (us site ke liye cookies ya credentials stored hone ke saath) ek poori tarah alag, mumkin taur par malicious website se jo chupke se user ki taraf se pehli site ko requests karti hai aur nateeje padhti hai. Is rok ke bina, bas ek malicious webpage visit karna jabki alag se, maano, ek banking site mein ek doosre tab mein logged in ho, us malicious page ke JavaScript ko banking site ko requests karne de sakta hai, apne aap user ke maujoodaa login cookies le kar, aur jo bhi sensitive data wapas aata hai use padh sakta hai — poori tarah bina user ki jaankaari ke ya malicious page visit karne se zyaada kisi action ke. Ye protection browser dwara lagu hona chahiye destination server ke bajaye kyunki browser hi aikela hai jo ye jaanne ki sthiti mein hai ki kaunsi website ka JavaScript asal mein request kar raha hai aur, bahut zaruri, ye control karne ki sthiti mein hai ki kya us JavaScript ko jawaab padhne ki ijaazat hai bilkul — server jo chaahe response headers bhej sakta hai, par browser hi faisla karta hai, un headers ke aadhaar par, ki asal mein requesting page ke JavaScript ko jawaab wapas de ya block kare.',
      },
      {
        q: 'Why is combining Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true a serious security problem, and why does simply reflecting the requesting origin back dynamically not actually fix it?',
        qHi: '\`Access-Control-Allow-Origin: *\` ko \`Access-Control-Allow-Credentials: true\` ke saath jodna ek gambhir security samasya kyun hai, aur bas requesting origin ko dynamically wapas reflect karna ise asal mein kyun theek nahi karta?',
        a: 'A wildcard Access-Control-Allow-Origin combined with allowing credentials would mean literally any website on the internet, including a deliberately malicious one, can make a request to the server carrying a visiting user\'s real cookies or authorization credentials, and successfully read the response — a malicious site could, for instance, silently trigger a request to a victim\'s bank or social media account and read the victim\'s private data, entirely because the browser was told this specific combination is permitted for any origin whatsoever. Browsers themselves recognize this exact danger and outright reject a literal wildcard combined with credentials as a built-in safety measure — but some developers attempt to route around this by writing server logic that reads the actual requesting Origin header from each incoming request and reflects that same value back as the Access-Control-Allow-Origin response header, rather than literally sending "*". This technically satisfies the browser\'s rule (since a specific, non-wildcard origin value is present), but it recreates the identical underlying danger: the server is still, functionally, saying "yes" to every possible origin that asks, one at a time, which has the exact same real-world effect as a wildcard would — the fix that actually matters is checking the requesting origin against a genuine, curated allowlist of specifically trusted origins, and only reflecting back (or approving) an origin that is actually on that list.',
        aHi: 'Ek wildcard \`Access-Control-Allow-Origin\` ko credentials allow karne ke saath jodna matlab hoga literally internet par koi bhi website, ek jaan-boojhkar malicious sameet, server ko ek visiting user ke asli cookies ya authorization credentials le jaate hue ek request kar sakti hai, aur safaltapoorvak jawaab padh sakti hai — ek malicious site, misal ke taur par, chupke se ek victim ke bank ya social media account ko ek request trigger kar sakti hai aur victim ka private data padh sakti hai, poori tarah isliye kyunki browser ko bataaya gaya tha ki ye khaas milaan kisi bhi origin ke liye permit hai. Browsers khud bilkul isi khatre ko pehchaante hain aur ek literal wildcard ko credentials ke saath jode hue seedha reject karte hain ek built-in safety measure ki tarah — par kuch developers iske aas-paas kaam karne ki koshish karte hain server logic likh kar jo har aati request se asli requesting \`Origin\` header padhta hai aur us wahi value ko \`Access-Control-Allow-Origin\` response header ki tarah wapas reflect karta hai, "*" literally bhejne ke bajaye. Ye technically browser ke rule ko santusht karta hai (kyunki ek khaas, non-wildcard origin value maujood hai), par ye bilkul wahi underlying khatra dobara paida karta hai: server abhi bhi, functionally, "haan" keh raha hai har mumkin origin ko jo poochti hai, ek-ek karke, jiska bilkul wahi asli-duniya asar hai jo ek wildcard karta — asli fix jo maayne rakhta hai requesting origin ko ek asli, chuni hui khaas bharosemand origins ki allowlist ke khilaaf check karna hai, aur sirf us origin ko reflect (ya approve) karna jo asal mein us list mein hai.',
      },
      {
        q: 'Why does CORS provide no protection at all against a direct request made using curl, a server-to-server call, or a mobile app, and what does this imply about relying on CORS as a security mechanism?',
        qHi: 'CORS curl, ek server-to-server call, ya ek mobile app istemal karke ki gayi ek seedhi request ke khilaaf bilkul koi protection kyun nahi deta, aur security mechanism ki tarah CORS par bharosa karne ke baare mein ye kya sujhaata hai?',
        a: 'CORS is a policy enforced entirely by the browser\'s own networking and JavaScript execution environment — specifically, it governs whether a browser permits JavaScript running on one webpage to read the response of a cross-origin request that same browser made. Every part of this mechanism (checking the response\'s Access-Control-Allow-Origin header, blocking or allowing the response from reaching the requesting page\'s JavaScript, sending preflight OPTIONS requests) is implemented inside the browser itself. A tool like curl, a request made directly from one backend server to another, or a mobile app\'s native networking layer is not a browser and has no same-origin policy or CORS enforcement logic built into it at all — such a client simply sends the request and receives the full response with no restriction whatsoever, entirely unaffected by whatever CORS configuration the server happens to have. This means CORS specifically and only protects against the scenario of a malicious WEBSITE\'s JavaScript abusing a logged-in user\'s browser to make unauthorized requests on their behalf — it provides zero protection against a direct, deliberate attacker simply making requests to the API using any non-browser tool, which is precisely why genuine authentication and authorization (verifying a valid JWT or session on every request, as covered in the previous lesson) must always be the actual security boundary, with CORS serving only as an additional, browser-specific safeguard layered on top, never as a replacement for it.',
        aHi: 'CORS ek policy hai jo poori tarah browser ke apne networking aur JavaScript execution environment dwara lagu ki jaati hai — khaas taur par, ye control karti hai ki kya ek browser ek webpage par chal rahe JavaScript ko us hi browser ne banaayi ek cross-origin request ka jawaab padhne deta hai. Is mechanism ka har hissa (jawaab ka \`Access-Control-Allow-Origin\` header check karna, jawaab ko requesting page ke JavaScript tak pahunchne se block ya allow karna, preflight \`OPTIONS\` requests bhejna) browser ke andar hi lagu kiya jaata hai. \`curl\` jaisa ek tool, ek backend server se seedha doosre ko ki gayi ek request, ya ek mobile app ka native networking layer koi browser nahi hai aur uske andar bilkul koi same-origin policy ya CORS enforcement logic built-in nahi hai — aisa ek client bas request bhejta hai aur poora jawaab kisi bhi rok ke bina paata hai, server ke paas jo bhi CORS configuration hai us se poori tarah bekhabar. Iska matlab hai CORS khaas taur par aur sirf us scenario ke khilaaf surakshit karta hai jahan ek malicious WEBSITE ka JavaScript ek logged-in user ke browser ka durupyog karta hai unki taraf se anadhikrit requests karne ke liye — ye ek seedhe, jaan-boojhkar attacker ke khilaaf zero protection deta hai jo bas kisi bhi non-browser tool istemal karke API ko requests karta hai, bilkul isi wajah se asli authentication aur authorization (har request par ek valid JWT ya session verify karna, jaisa pichhle lesson mein cover hua) hamesha asli security boundary hona chahiye, CORS sirf ek additional, browser-khaas safeguard ki tarah kaam karta hai jo uske oopar layered hai, kabhi uska replacement nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build a backend route with no CORS configuration at all, and a separate frontend page (on a different port) that fetches it. Confirm the CORS error appears in the browser console, and confirm the same URL works fine with curl.',
        taskHi: 'Bilkul koi CORS configuration na hone wala ek backend route banao, aur ek alag frontend page (ek alag port par) jo use fetch kare. Confirm karo CORS error browser console mein dikhta hai, aur confirm karo wahi URL curl ke saath theek kaam karta hai.',
        hint: 'A simple static HTML file opened with a local static server on a different port than the backend (e.g. one on 5500, backend on 4000) reproduces this easily.',
        hintHi: 'Ek saadha static HTML file ek local static server ke saath khola gaya backend se alag port par (jaise ek 5500 par, backend 4000 par) ise aasaani se dobara paida karta hai.',
      },
      {
        task: 'Fix it with the cors package configured with an explicit allowlist containing your frontend\'s exact origin. Confirm the fetch now succeeds, and confirm a request from a different, unlisted origin is still correctly blocked.',
        taskHi: 'Tumhaare frontend ke bilkul asli origin wali ek explicit allowlist ke saath configure kiye \`cors\` package se theek karo. Confirm karo fetch ab safal hota hai, aur confirm karo ek alag, list-mein-na-hui origin se ek request abhi bhi sahi tarike se block hoti hai.',
        hint: 'Try opening your frontend from two different ports (e.g. via two different static server instances) to directly see one succeed and one get blocked with the same code.',
        hintHi: 'Apna frontend do alag ports se kholne ki koshish karo (jaise do alag static server instances ke through) ek ko safal hote aur doosre ko wahi code ke saath block hote seedha dekhne ke liye.',
      },
      {
        task: 'Add credentials: true on both the cors config and the frontend fetch call for a route requiring the JWT auth middleware from the previous lesson. Confirm a logged-in request succeeds and an unauthenticated one is still correctly rejected by the auth middleware, not by CORS.',
        taskHi: '\`cors\` config aur frontend \`fetch\` call dono par \`credentials: true\` jodo pichhle lesson wale JWT auth middleware ki zarurat wale ek route ke liye. Confirm karo ek logged-in request safal hoti hai aur ek unauthenticated request abhi bhi auth middleware dwara sahi tarike se reject hoti hai, CORS dwara nahi.',
        hint: 'Temporarily remove credentials: "include" from just the frontend fetch call while keeping the backend cors config unchanged, and observe that the request now fails to carry the token even though CORS itself still permits it.',
        hintHi: 'Asthaayi taur par \`credentials: "include"\` ko sirf frontend \`fetch\` call se hataao backend \`cors\` config ko badle bina, aur dekho ki request ab token le jaane mein fail hoti hai chahe CORS khud abhi bhi ise permit karta ho.',
      },
    ],

    keyTakeaways: [
      'CORS is a browser-enforced security policy that blocks JavaScript on one origin from reading a response from a different origin, unless that origin explicitly permits it via specific response headers.',
      'A backend route can work perfectly (tested directly or with curl) while still being blocked by CORS in a browser — the block happens on the client side, not because the server itself failed.',
      'Combining a wildcard Access-Control-Allow-Origin (or a workaround that dynamically reflects any requesting origin) with credentials allows any website to make authenticated requests using a victim\'s real cookies or tokens.',
      'The correct fix is an explicit allowlist of specifically trusted origins, typically via the cors middleware, which also correctly handles preflight OPTIONS requests that hand-written headers frequently miss.',
      'credentials: true must be set on both the server\'s CORS configuration and the client\'s individual request for cookies or credential headers to actually be sent cross-origin.',
      'CORS is enforced only by browsers — a direct request via curl, a server-to-server call, or a mobile app is entirely unaffected by it, so genuine authentication and authorization on the backend must always be the real security boundary.',
    ],
    keyTakeawaysHi: [
      'CORS ek browser-lagu ki hui security policy hai jo ek origin par JavaScript ko ek alag origin ke jawaab ko padhne se rokti hai, jab tak wo origin explicitly khaas response headers ke through ise permit na kare.',
      'Ek backend route poori tarah theek kaam kar sakta hai (seedha ya curl se test kiya) jabki abhi bhi ek browser mein CORS dwara block ho — block client side par hota hai, isliye nahi ki server khud fail hua.',
      'Ek wildcard \`Access-Control-Allow-Origin\` (ya ek workaround jo kisi bhi requesting origin ko dynamically reflect karta hai) ko credentials ke saath jodna kisi bhi website ko ek victim ke asli cookies ya tokens istemal karke authenticated requests karne deta hai.',
      'Sahi fix khaas bharosemand origins ki ek explicit allowlist hai, aam taur par \`cors\` middleware ke through, jo preflight \`OPTIONS\` requests ko bhi sahi tarike se sambhaalta hai jo haath-se-likhi headers aksar chhoot jaati hain.',
      '\`credentials: true\` server ke CORS configuration aur client ki akeli request dono par set hona chahiye taaki cookies ya credential headers sach mein cross-origin bheji jaayein.',
      'CORS sirf browsers dwara lagu kiya jaata hai — curl se ek seedhi request, ek server-to-server call, ya ek mobile app ismein se poori tarah bekhabar hai, isliye backend par asli authentication aur authorization hamesha asli security boundary hona chahiye.',
    ],
  },
];
