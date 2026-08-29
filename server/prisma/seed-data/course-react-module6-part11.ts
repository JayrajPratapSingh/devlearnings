/**
 * React Complete Course — Module 6: Pro, lesson 11.
 *
 * CSRF for cookie-authenticated SPAs. This course's previous lesson
 * established that browsers automatically attach cookies to any request
 * sent to the matching domain, regardless of which site actually
 * triggered that request — HttpOnly protects the cookie's VALUE from
 * being read by a malicious script, but says nothing about a malicious
 * site being able to trigger a genuine, cookie-authenticated request in
 * the first place. Broken example: a "change email" endpoint relying
 * solely on a session cookie for authentication, with nothing else
 * verifying the request genuinely originated from the app's own frontend
 * — a hidden auto-submitting form on a completely unrelated,
 * attacker-controlled page can trigger this exact request, and the
 * victim's browser dutifully attaches their real session cookie. Fixed
 * with the double-submit CSRF token pattern: a second, readable cookie
 * whose value the frontend must also attach as a request header on every
 * state-changing request — a value only readable by JavaScript running
 * on the actual origin, and therefore something a cross-site attacker's
 * page can never replicate, even though the browser still auto-attaches
 * the session cookie itself.
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

export const REACT_MODULE_6_PART11: CourseLesson[] = [
  {
    slug: 'csrf-cookie-authenticated-spas',
    title: 'CSRF for Cookie-Authenticated SPAs',
    titleHi: 'Cookie-Authenticated SPAs Ke Liye CSRF',
    description: 'A user, already logged into a real banking app in one browser tab, casually opens a link to a completely unrelated website in another tab — and by the time they close it, their real account\'s email address has silently been changed, without them ever clicking anything on the real app at all.',
    descriptionHi: 'Ek user, ek asli banking app mein ek browser tab mein pehle se logged in, ek doosre tab mein ek poori tarah na-jude website ka link aaraam se kholta hai — aur jab tak wo ise band karte hain, unke asli account ka email address chupke se badal chuka hai, bina unhone asli app par kabhi kuch bhi click kiye.',
    difficulty: 'HARD',
    duration: 20,
    order: 11,

    analogy: {
      en: '**A hotel that delivers whatever is written on a room-service slip the instant that slip is slid under a room\'s door, checking only that the room number written on it is real — versus a hotel that also requires the slip to include a private confirmation code, printed only on the inside surface of that specific guest\'s own room key, which nobody standing in the hallway could ever have seen.** At the careless hotel, anyone at all can walk down the hallway, slide a slip reading "please charge $500 to this room and transfer it to account X" under any door, and the hotel staff dutifully processes it — the slip has a real, valid room number on it, and that is the only thing being checked, with no way to tell whether the actual guest wrote it or a stranger in the hallway did. The careful hotel closes exactly this gap: every legitimate room-service request must also include a private confirmation code that was printed on the inside of the guest\'s own room key when they checked in — something only the guest ever actually held in their hands, and something a stranger sliding a forged slip under the door from the hallway has no way of ever having seen, let alone copying accurately. A cookie-authenticated web application relying solely on the browser automatically attaching a session cookie is the careless hotel: the browser attaches that cookie to a request regardless of which website actually asked for it, the same way any slip with a real room number gets processed regardless of who slid it under the door. The double-submit CSRF token pattern is the careful hotel\'s private confirmation code: a second value that only JavaScript running on the app\'s own actual page can ever read, meaning a forged request originating from a completely different, attacker-controlled website can never include the correct value, even though the browser still happily attaches the session cookie itself alongside it.',
      hi: '**Ek hotel jo jo bhi ek room-service slip par likha hai use turant deliver karta hai jaise hi wo slip ek room ke darwaaze ke neeche se daali jaati hai, sirf ye check karte hue ki uspar likha room number asli hai — versus ek hotel jo slip ko ek private confirmation code bhi shaamil karne ki maang karta hai, jo sirf us khaas guest ki apni room key ki andar wali satah par chhapa hai, jise hallway mein khada koi bhi kabhi nahi dekh sakta tha.** Laapervaah hotel mein, koi bhi hallway mein chal sakta hai, ek slip jismein likha hai "kripya is room mein $500 charge karo aur account X mein transfer karo" kisi bhi darwaaze ke neeche daal sakta hai, aur hotel staff use wafadaari se process karta hai — slip par ek asli, vaidh room number hai, aur wahi ekmatra cheez check ki jaa rahi hai, ye batane ka koi tarika bina ki asli guest ne ise likha ya hallway mein khade ek ajnabi ne. Savdhaan hotel bilkul isi gap ko band karta hai: har vaidh room-service request ko bhi ek private confirmation code shaamil karna chahiye jo guest ki apni room key ke andar check-in ke waqt chhapa gaya tha — kuch aisa jo sirf guest ne asal mein apne haathon mein pakda tha, aur kuch aisa jise hallway se ek forged slip darwaaze ke neeche daalta ek ajnabi kabhi dekh nahi sakta tha, sahi tarike se copy karna to door ki baat. Ek cookie-authenticated web application jo poori tarah browser ke automatically ek session cookie jodne par nirbhar hai laapervaah hotel hai: browser us cookie ko ek request se jodta hai chahe kaunsi website ne asal mein use maanga, bilkul usi tarah jaise koi bhi asli room number wali slip process ho jaati hai kisne use darwaaze ke neeche daala us se bekhabar. Double-submit CSRF token pattern savdhaan hotel ka private confirmation code hai: ek doosri value jise sirf app ke apne asli page par chalti JavaScript hi kabhi padh sakti hai, matlab ek poori tarah alag, attacker-niyantrit website se aati ek forged request kabhi sahi value shaamil nahi kar sakti, chahe browser phir bhi session cookie khud ke saath khushi-khushi jodta hai.',
    },

    simple: `**Start broken.** A state-changing endpoint relying solely on the auto-attached session cookie:

\`\`\`jsx
async function changeEmail(newEmail) {
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: { "Content-Type": "application/json" },
  });
}
\`\`\`

\`\`\`html
<!-- On a completely unrelated, attacker-controlled website: -->
<form id="evil" action="https://real-app.example/api/account/email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.example" />
</form>
<script>document.getElementById("evil").submit();</script>
\`\`\`

This course\'s previous lesson moved the session token into an \`HttpOnly\` cookie specifically so a malicious script could never read its value — and that protection genuinely works. But the browser\'s behavior around cookies has a separate, distinct rule this lesson addresses: whenever a request is sent to a given domain, the browser automatically attaches whatever cookies belong to that domain, regardless of which website\'s page actually triggered the request. A victim who is already logged into \`real-app.example\` in one tab, and who then visits a completely unrelated, attacker-controlled page in another tab, has their browser genuinely attach their real \`real-app.example\` session cookie the instant that malicious page\'s hidden form submits — the request looks, from the server\'s perspective, exactly like a legitimate request from the real user, because it genuinely does carry their real, valid session cookie. The server has no way to tell the difference between "the user\'s own app asked for this" and "some other page on the internet asked for this," since the only thing it is checking is whether a valid session cookie was attached, and it was.

**The fix: require a second value only the real app\'s own JavaScript can read**

\`\`\`jsx
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail) {
  const csrfToken = getCookie("csrfToken"); // a separate, NON-HttpOnly cookie
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });
}
\`\`\`

\`\`\`tsx
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail: string): Promise<Response> {
  const csrfToken = getCookie("csrfToken");
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken ?? "",
    },
  });
}
\`\`\`

The server now sets a SECOND cookie on login — \`csrfToken\`, deliberately NOT marked \`HttpOnly\` — specifically so the app\'s own JavaScript, running on the app\'s own origin, can read it. Every state-changing request must now include this value as a request header, and the server checks that the header\'s value genuinely matches the \`csrfToken\` cookie it received. The attacker\'s forged form submission still causes the browser to attach the victim\'s real session cookie, exactly as before — but the attacker\'s page, running on a completely different origin, has no way to read the victim\'s \`csrfToken\` cookie value at all, since a browser\'s same-origin policy prevents one site\'s JavaScript from reading another site\'s cookies. Without the correct header value, the server rejects the request, even though the session cookie itself was genuinely valid.`,

    simpleHi: `**Toote hue se shuru.** Ek state-badalti endpoint jo poori tarah automatically-attached session cookie par nirbhar hai:

\`\`\`jsx
async function changeEmail(newEmail) {
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: { "Content-Type": "application/json" },
  });
}
\`\`\`

\`\`\`html
<!-- Ek poori tarah na-judi, attacker-niyantrit website par: -->
<form id="evil" action="https://real-app.example/api/account/email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.example" />
</form>
<script>document.getElementById("evil").submit();</script>
\`\`\`

Is course ka pehle wala lesson session token ko ek \`HttpOnly\` cookie mein khaas taur par isliye le gaya taaki ek malicious script iski value kabhi na padh sake — aur wo protection sach mein kaam karti hai. Par cookies ke aas-paas browser ka vyavhaar ek alag, khaas rule rakhta hai jise ye lesson sambodhit karta hai: jab bhi ek request ek diye domain ko bheji jaati hai, browser automatically jo bhi cookies us domain ki hain jodta hai, chahe kaunsi website ke page ne asal mein request trigger ki ho. Ek victim jo pehle se ek tab mein \`real-app.example\` mein logged in hai, aur jo phir doosre tab mein ek poori tarah na-judi, attacker-niyantrit page dekhta hai, unka browser sach mein unki asli \`real-app.example\` session cookie jodta hai jis pal us malicious page ka chhupa form submit hota hai — request, server ke nazariye se, bilkul asli user se ek vaidh request jaisi dikhti hai, kyunki ye sach mein unki asli, vaidh session cookie le kar chalti hai. Server ke paas antar batane ka koi tarika nahi hai "user ke apne app ne ye maanga" aur "internet par kisi doosre page ne ye maanga" ke beech, kyunki ye sirf ye check kar raha hai ki kya ek vaidh session cookie jodi gayi thi, aur wo thi.

**Fix: ek doosri value maango jise sirf asli app ki apni JavaScript padh sake**

\`\`\`jsx
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail) {
  const csrfToken = getCookie("csrfToken"); // ek alag, NON-HttpOnly cookie
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });
}
\`\`\`

\`\`\`tsx
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail: string): Promise<Response> {
  const csrfToken = getCookie("csrfToken");
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken ?? "",
    },
  });
}
\`\`\`

Server ab login par ek DOOSRI cookie set karta hai — \`csrfToken\`, jaan-boojhkar \`HttpOnly\` maark NAHI ki gayi — khaas taur par isliye taaki app ki apni JavaScript, app ke apne origin par chalti hue, ise padh sake. Har state-badalti request ab is value ko ek request header ki tarah shaamil karni chahiye, aur server check karta hai ki header ki value sach mein us \`csrfToken\` cookie se match karti hai jo usse mili. Attacker ka forged form submission phir bhi browser ko victim ki asli session cookie jodne ka kaaran banaata hai, bilkul pehle jaisa — par attacker ka page, ek poori tarah alag origin par chalte hue, victim ki \`csrfToken\` cookie value ko bilkul padhne ka koi tarika nahi rakhta, kyunki ek browser ki same-origin policy ek site ki JavaScript ko doosri site ki cookies padhne se rokti hai. Sahi header value bina, server request reject kar deta hai, chahe session cookie khud sach mein vaidh thi.`,

    content: `## Why SameSite alone often is not treated as a complete answer

\`\`\`
SameSite=Strict: blocks the cookie from being sent on almost any
                 cross-site request — strong, but can break legitimate
                 cross-site flows (arriving from an external link).

SameSite=Lax:    blocks cross-site POST requests, but still allows
                 the cookie on a top-level GET navigation — a gap a
                 state-changing GET endpoint could still fall through.
\`\`\`

This course\'s previous lesson introduced \`SameSite\` as a cookie attribute that controls whether a cookie gets attached to cross-site requests, and it genuinely is the primary, first-line defense against CSRF. \`SameSite=Strict\` blocks the cookie from nearly all cross-site requests, and \`SameSite=Lax\` (a common, slightly more permissive default) still blocks cross-site POST requests specifically, while allowing the cookie on an ordinary top-level navigation (a user clicking an external link that leads to the app). Relying on \`SameSite\` as the sole defense still leaves real gaps: an endpoint that incorrectly performs a state change on a \`GET\` request rather than a \`POST\` remains vulnerable even under \`Lax\`, older browsers may not enforce \`SameSite\` at all, and a legitimate need for \`SameSite=None\` (cookies genuinely needed in a cross-site, embedded context) removes this protection entirely for that cookie. The double-submit token pattern this lesson covers provides a second, independent layer that holds even if any of these \`SameSite\`-related gaps apply.

## The double-submit cookie pattern, end to end

\`\`\`
1. Login: server sets TWO cookies —
   Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict   (opaque, unreadable)
   Set-Cookie: csrfToken=...; Secure; SameSite=Strict            (readable by JS)

2. Every state-changing request: frontend reads csrfToken from
   document.cookie and sends it as a request header (X-CSRF-Token).

3. Server compares the header value to the csrfToken cookie it
   received — they must match exactly, or the request is rejected.
\`\`\`

The pattern\'s name comes from the CSRF token being "double submitted" — once automatically, as a cookie the browser attaches, and once deliberately, as a header the frontend\'s own JavaScript reads and attaches manually. This works specifically because of a browser security rule entirely separate from cookies: JavaScript running on one origin cannot read cookies, or any other data, belonging to a different origin. An attacker\'s forged form submission still causes the browser to attach the victim\'s real \`session\` and \`csrfToken\` cookies to the request (assuming \`SameSite\` does not already block it), but the attacker\'s own page, running on their own origin, has no way to read the value of the victim\'s \`csrfToken\` cookie to construct the matching header — they can trigger a request that carries the cookie, but they cannot read what that cookie actually contains to replicate it in a header.

## Automating the header attachment so no component has to remember it

\`\`\`jsx
async function apiFetch(url, options = {}) {
  const csrfToken = getCookie("csrfToken");
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "X-CSRF-Token": csrfToken,
    },
  });
}
\`\`\`

Relying on every individual component that makes a mutating request to remember to read the cookie and attach the header manually is exactly the kind of convention that eventually gets missed somewhere. Wrapping \`fetch\` (or configuring an \`axios\` instance\'s request interceptor equivalently) in one small, shared function that automatically attaches the CSRF header to every request means the correct behavior happens by construction, the same underlying principle this course\'s earlier lessons applied to centralizing repeated logic — no individual component needs to remember anything, since the only way to make a request is through the wrapper that already does it correctly.

## CSRF and CORS are frequently confused, but protect against different things

\`\`\`
CORS: controls whether JavaScript on one origin is allowed to
      READ the RESPONSE of a request to another origin.

CSRF: concerns whether a request is SENT with credentials attached
      in the first place, regardless of whether the sender can
      ever read the response that comes back.
\`\`\`

CORS (Cross-Origin Resource Sharing) and CSRF are commonly confused specifically because both involve cross-site requests, but they protect against genuinely different things. CORS governs whether a browser lets a script on one origin read the CONTENTS of a response from a different origin — a permissive CORS policy lets an attacker\'s script read data back from a cross-origin request, but has no bearing on whether that request gets sent with cookies attached in the first place. CSRF is entirely about the request being sent and acted upon at all, regardless of whether the attacker\'s script can ever see the response — the attacker in this lesson\'s broken example never needs to read anything back; changing the victim\'s email succeeds the instant the forged request is processed, whether or not the attacker\'s page can see the server\'s response confirming it.`,

    contentHi: `## \`SameSite\` akela aksar ek poora jawaab kyun nahi maana jaata

\`\`\`
SameSite=Strict: cookie ko lagbhag kisi bhi cross-site request par
                 bhejne se rokta hai — mazboot, par vaidh cross-site
                 flows tod sakta hai (ek bahari link se aana).

SameSite=Lax:    cross-site POST requests ko rokta hai, par phir bhi
                 ek top-level GET navigation par cookie ki ijaazat
                 deta hai — ek gap jismein ek state-badalti GET
                 endpoint phir bhi phas sakti hai.
\`\`\`

Is course ka pehle wala lesson \`SameSite\` ko ek cookie attribute ki tarah introduce karta hai jo niyantrit karta hai ki kya ek cookie cross-site requests se jodi jaati hai, aur ye sach mein CSRF ke khilaaf mukhya, pehli-line ka defense hai. \`SameSite=Strict\` cookie ko lagbhag har cross-site request se rokta hai, aur \`SameSite=Lax\` (ek aam, thoda zyaada permissive default) phir bhi khaas taur par cross-site POST requests ko rokta hai, jabki ek aam top-level navigation par cookie ki ijaazat deta hai (ek user ek bahari link click karta hai jo app tak le jaata hai). \`SameSite\` par ekmatra defense ki tarah nirbhar hona phir bhi asli gaps chhodta hai: ek endpoint jo galti se ek \`GET\` request par state badalta hai \`POST\` ke bajaye \`Lax\` ke neeche bhi vulnerable rehta hai, purane browsers shaayad \`SameSite\` ko bilkul lagu na karein, aur \`SameSite=None\` ki ek vaidh zaroorat (ek cross-site, embedded context mein sach mein zaroori cookies) us cookie ke liye ye protection poori tarah hata deti hai. Ye lesson jo double-submit token pattern cover karta hai ek doosri, swatantra layer deta hai jo tikti hai chahe in \`SameSite\`-mutaalliq gaps mein se koi bhi lagu ho.

## Double-submit cookie pattern, shuru se aakhir tak

\`\`\`
1. Login: server DO cookies set karta hai —
   Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict   (opaque, na-padhne-laayak)
   Set-Cookie: csrfToken=...; Secure; SameSite=Strict            (JS ke liye padhne-laayak)

2. Har state-badalti request: frontend \`document.cookie\` se
   \`csrfToken\` padhta hai aur ise ek request header (\`X-CSRF-Token\`) ki tarah bhejta hai.

3. Server header value ko us \`csrfToken\` cookie se compare karta hai
   jo usse mili — dono bilkul match hone chahiye, ya request reject hoti hai.
\`\`\`

Pattern ka naam CSRF token ke "dohara submit" hone se aata hai — ek baar automatically, ek cookie ki tarah jise browser jodta hai, aur ek baar jaan-boojhkar, ek header ki tarah jise frontend ki apni JavaScript padhti aur manually jodti hai. Ye khaas taur par isliye kaam karta hai ek browser security rule ki wajah se jo cookies se poori tarah alag hai: ek origin par chalti JavaScript ek alag origin ki cookies, ya koi bhi doosra data, padh nahi sakti. Attacker ka forged form submission phir bhi browser ko victim ki asli \`session\` aur \`csrfToken\` cookies request se jodne ka kaaran banaata hai (maante hue ki \`SameSite\` pehle se ise nahi rokta), par attacker ka apna page, apne khud ke origin par chalte hue, victim ki \`csrfToken\` cookie ki value padhne ka koi tarika nahi rakhta matching header banaane ke liye — wo ek request trigger kar sakte hain jo cookie le kar chalti hai, par wo padh nahi sakte ki wo cookie asal mein kya rakhti hai ise ek header mein dohraane ke liye.

## Header attachment ko automate karna taaki koi component ise yaad rakhne ki zaroorat na ho

\`\`\`jsx
async function apiFetch(url, options = {}) {
  const csrfToken = getCookie("csrfToken");
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "X-CSRF-Token": csrfToken,
    },
  });
}
\`\`\`

Har akele component par nirbhar hona jo ek mutating request banaata hai ki wo cookie padhna aur header manually jodna yaad rakhe bilkul us tarah ka convention hai jo aakhirkaar kahin bhoola jaata hai. \`fetch\` ko wrap karna (ya \`axios\` ke ek instance ka request interceptor barabar taur par configure karna) ek chhote, shared function mein jo automatically har request mein CSRF header jodta hai matlab hai sahi vyavhaar construction se hota hai, wahi buniyaadi siddhaant jo is course ke pehle wale lessons dohraayi hui logic ko kendrit karne ke liye lagu karte hain — koi bhi akele component ko kuch bhi yaad rakhne ki zaroorat nahi, kyunki request banaane ka ekmatra tarika us wrapper ke through hai jo pehle se ise sahi tarike se karta hai.

## CSRF aur CORS aksar ghulmil jaate hain, par alag cheezon ke khilaaf surakshit karte hain

\`\`\`
CORS: niyantrit karta hai ki kya ek origin par JavaScript ko
      ek doosre origin ki request ka RESPONSE PADHNE ki ijaazat hai.

CSRF: is baat ki chinta karta hai ki kya ek request credentials
      jode hue bilkul BHEJI JAATI HAI, is baat se bekhabar ki
      bhejne waala kabhi jo response wapas aaya use padh sakta hai ya nahi.
\`\`\`

CORS (Cross-Origin Resource Sharing) aur CSRF aam taur par ghulmil jaate hain khaas taur par isliye kyunki dono mein cross-site requests shaamil hain, par wo sach mein alag cheezon ke khilaaf surakshit karte hain. CORS niyantrit karta hai ki kya ek browser ek origin par ek script ko ek alag origin se ek response ki CONTENTS padhne deta hai — ek permissive CORS policy ek attacker ki script ko ek cross-origin request se data wapas padhne deti hai, par iska is baat par koi asar nahi ki wo request pehli jagah cookies jode hue bheji jaati hai ya nahi. CSRF poori tarah is baare mein hai ki request bilkul bheji jaati hai aur uspar kaarvaai ki jaati hai, attacker ki script kabhi response dekh sakti hai ya nahi us se bekhabar — is lesson ke toote example mein attacker ko kabhi kuch wapas padhne ki zaroorat nahi hai; victim ka email badalna forged request process hote hi safal ho jaata hai, chahe attacker ka page server ka response ise confirm karta hua dekh sake ya nahi.`,

    examples: [
      {
        title: 'Broken: an attacker\'s hidden form triggers a genuine, cookie-authenticated request',
        titleHi: 'Toota: ek attacker ka chhupa form ek asli, cookie-authenticated request trigger karta hai',
        code: `<!-- On attacker.example -->
<form action="https://real-app.example/api/account/email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.example" />
</form>
<script>document.forms[0].submit();</script>`,
        codeJs: `// The victim's own app — nothing here defends against a forged request
async function changeEmail(newEmail) {
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: { "Content-Type": "application/json" },
  });
}
// A hidden form on a completely different site can trigger the exact
// same server-side effect, since the browser attaches the real session
// cookie regardless of which page triggered the request`,
        codeTs: `async function changeEmail(newEmail: string): Promise<Response> {
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: { "Content-Type": "application/json" },
  });
}
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about missing request-origin verification, not a type error.`,
        output: `Visiting attacker.example while logged into real-app.example in
another tab silently changes the victim's email address, with no
visible indication anything happened on either page.`,
        explain: 'The server has no way to distinguish this forged request from a genuine one — both carry the victim\'s real, valid session cookie, since the browser attaches it regardless of which site triggered the request.',
        explainHi: 'Server ke paas is forged request ko ek asli request se alag karne ka koi tarika nahi hai — dono victim ki asli, vaidh session cookie le kar chalti hain, kyunki browser ise jodta hai chahe kaunsi site ne request trigger ki ho.',
      },
      {
        title: 'Fixed: a CSRF header only the app\'s own JavaScript can construct',
        titleHi: 'Theek: ek CSRF header jise sirf app ki apni JavaScript banaa sakti hai',
        code: `const csrfToken = getCookie("csrfToken");
fetch(url, { credentials: "include", headers: { "X-CSRF-Token": csrfToken } });`,
        codeJs: `function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail) {
  const csrfToken = getCookie("csrfToken");
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });
}`,
        codeTs: `function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function changeEmail(newEmail: string): Promise<Response> {
  const csrfToken = getCookie("csrfToken");
  return fetch("/api/account/email", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email: newEmail }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken ?? "",
    },
  });
}`,
        outputJs: `The attacker's forged form still triggers a request carrying the
victim's real session cookie, but the request has no way to include
the correct X-CSRF-Token header, since the attacker's page cannot
read the victim's csrfToken cookie value. The server rejects it.`,
        outputTs: `// Identical behaviour. csrfToken ?? "" handles the case where the
// cookie is genuinely missing (e.g. the user was never logged in),
// sending an empty header rather than the literal string "null".`,
        explain: 'The server now requires two things to agree — the auto-attached cookie and a manually-attached header — and a cross-site attacker can only ever force the first one to be sent.',
        explainHi: 'Server ab do cheezon ke sehmat hone ki maang karta hai — automatically-attached cookie aur ek manually-attached header — aur ek cross-site attacker kabhi sirf pehli ko hi bhejne majboor kar sakta hai.',
      },
      {
        title: 'Automating CSRF header attachment with a shared fetch wrapper',
        titleHi: 'Ek shared \`fetch\` wrapper se CSRF header attachment ko automate karna',
        code: `async function apiFetch(url, options) {
  const csrfToken = getCookie("csrfToken");
  return fetch(url, { ...options, credentials: "include", headers: { ...options?.headers, "X-CSRF-Token": csrfToken } });
}`,
        codeJs: `function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function apiFetch(url, options = {}) {
  const csrfToken = getCookie("csrfToken");
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      "X-CSRF-Token": csrfToken,
    },
  });
}

// Every component now just calls apiFetch — the header is never
// something an individual component needs to remember
function changeEmail(newEmail) {
  return apiFetch("/api/account/email", {
    method: "POST",
    body: JSON.stringify({ email: newEmail }),
  });
}`,
        codeTs: `function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const csrfToken = getCookie("csrfToken");
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      "X-CSRF-Token": csrfToken ?? "",
    },
  });
}

function changeEmail(newEmail: string): Promise<Response> {
  return apiFetch("/api/account/email", {
    method: "POST",
    body: JSON.stringify({ email: newEmail }),
  });
}`,
        outputJs: `Every request made through apiFetch automatically carries the correct
CSRF header — a new component added later cannot forget the header,
since there is no other way to make a request.`,
        outputTs: `// Identical behaviour. RequestInit is fetch's own built-in options
// type, so options.headers is correctly typed without a custom
// interface needing to be written.`,
        explain: 'Centralizing the header attachment into one shared function makes the correct behavior structurally unavoidable rather than a convention every component must individually remember.',
        explainHi: 'Header attachment ko ek shared function mein kendrit karna sahi vyavhaar ko structurally avoidable-na-hone-laayak banaata hai ek convention ke bajaye jise har component ko akele yaad rakhna chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `async function changeEmail(newEmail) {
  return fetch("/api/account/email", { method: "POST", credentials: "include", body: JSON.stringify({ email: newEmail }) });
}
// relies solely on the auto-attached session cookie, with nothing verifying request origin`,
        right: `const csrfToken = getCookie("csrfToken");
return fetch("/api/account/email", {
  method: "POST", credentials: "include",
  headers: { "X-CSRF-Token": csrfToken },
  body: JSON.stringify({ email: newEmail }),
});`,
        why: 'A request relying solely on an automatically-attached cookie for authentication can be triggered by any website, since the browser attaches cookies regardless of which site actually initiated the request.',
        whyHi: 'Ek request jo authentication ke liye poori tarah ek automatically-attached cookie par nirbhar hai kisi bhi website dwara trigger ki jaa sakti hai, kyunki browser cookies jodta hai chahe kaunsi site ne asal mein request shuru ki ho.',
      },
      {
        wrong: `Set-Cookie: csrfToken=abc123; HttpOnly; Secure
// marking the CSRF token cookie HttpOnly defeats the entire pattern`,
        right: `Set-Cookie: csrfToken=abc123; Secure; SameSite=Strict
// deliberately readable by JavaScript — that's the entire point of this specific cookie`,
        why: 'Marking the CSRF token cookie HttpOnly prevents the frontend\'s own JavaScript from reading it to attach as a header, breaking the double-submit pattern entirely — this cookie is deliberately meant to be readable.',
        whyHi: 'CSRF token cookie ko \`HttpOnly\` maark karna frontend ki apni JavaScript ko ise header ki tarah jodne ke liye padhne se rokta hai, double-submit pattern ko poori tarah todte hue — ye cookie jaan-boojhkar padhne-laayak hone ke liye hai.',
      },
      {
        wrong: `// Each component individually remembers (or forgets) to read the cookie and attach the header
function ComponentA() { fetch(url, { headers: { "X-CSRF-Token": getCookie("csrfToken") } }); }
function ComponentB() { fetch(url); } // forgot the header entirely`,
        right: `// One shared apiFetch wrapper attaches it automatically, every time
function ComponentA() { apiFetch(url); }
function ComponentB() { apiFetch(url); }`,
        why: 'Scattering the CSRF header logic across every individual component that makes a request is exactly the kind of convention that eventually gets missed somewhere — a shared wrapper makes it structurally unavoidable.',
        whyHi: 'CSRF header logic ko har akele component mein bikhraana jo ek request banaata hai bilkul us tarah ka convention hai jo aakhirkaar kahin bhoola jaata hai — ek shared wrapper ise structurally avoidable-na-hone-laayak banaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Cross-site request forgery has long been included among the OWASP Top 10 web application security risks**, and the double-submit cookie pattern this lesson covers is one of OWASP\'s own officially recommended, standard defenses against it.',
        hi: '**Cross-site request forgery lambe samay se OWASP Top 10 web application security risks mein shaamil rahi hai**, aur double-submit cookie pattern jo ye lesson cover karta hai OWASP ke apne officially recommend kiye gaye, standard defenses mein se ek hai iske khilaaf.',
      },
      {
        en: '**Popular HTTP client libraries and frameworks (including Django, Rails, and various Express middleware packages) provide built-in CSRF token support specifically implementing some version of the double-submit pattern**, reflecting how standard this specific defense is across real production frameworks.',
        hi: '**Popular HTTP client libraries aur frameworks (Django, Rails, aur various Express middleware packages sameet) built-in CSRF token support dete hain jo khaas taur par double-submit pattern ka koi na koi version lagu karte hain**, ye darsata hai ki ye khaas defense asli production frameworks mein kitna standard hai.',
      },
      {
        en: '**Real, publicly documented CSRF vulnerabilities have historically allowed attackers to perform actions ranging from changing a victim\'s account settings to initiating financial transfers**, purely by getting a logged-in victim to visit an unrelated malicious page — no password or stolen credential ever required.',
        hi: '**Asli, saarvajanik roop se documented CSRF vulnerabilities ne historically attackers ko victim ki account settings badalne se lekar financial transfers shuru karne tak ke actions karne diye hain**, shuddh roop se ek logged-in victim ko ek na-judi malicious page dekhne ke liye la kar — koi password ya chori hua credential kabhi zaroori nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does HttpOnly, which correctly prevents a malicious script from reading a session cookie, do nothing to prevent a cross-site request forgery attack?',
        qHi: '\`HttpOnly\`, jo ek malicious script ko session cookie padhne se sahi tarike se rokta hai, ek cross-site request forgery attack ko rokne ke liye kuch kyun nahi karta?',
        a: 'HttpOnly addresses a specific threat: a malicious script running in the same page context reading a cookie\'s actual value, which would let an attacker steal and reuse that value later from anywhere. CSRF is a categorically different threat that does not require reading the cookie\'s value at all — it relies entirely on a separate, unrelated browser behavior: whenever a request is sent to a given domain, the browser automatically attaches whatever cookies belong to that domain, regardless of which website\'s page actually triggered the request. An attacker running a CSRF attack never needs to know or read the victim\'s session cookie value; they only need to cause the victim\'s own browser to send a request to the target application, and the browser handles attaching the correct, genuine cookie entirely on its own, exactly as it would for a request the legitimate page initiated. Since HttpOnly only restricts what JavaScript can read, and CSRF never involves JavaScript reading anything at all, HttpOnly provides no protection against it whatsoever — the two are independent concerns requiring independent defenses, HttpOnly for the "can a malicious script steal the cookie\'s value" question, and CSRF-specific measures like SameSite and double-submit tokens for the "can a malicious site trigger a genuine, cookie-authenticated request" question.',
        aHi: '\`HttpOnly\` ek khaas khatre ko sambodhit karta hai: usi page context mein chalti ek malicious script ek cookie ki asli value padh le, jo ek attacker ko us value ko baad mein kahin se chori karke dobara istemal karne dega. CSRF ek categorically alag khatra hai jise cookie ki value bilkul padhne ki zaroorat nahi hai — ye poori tarah ek alag, na-jude browser vyavhaar par nirbhar karta hai: jab bhi ek request ek diye domain ko bheji jaati hai, browser automatically jo bhi cookies us domain ki hain jodta hai, chahe kaunsi website ke page ne asal mein request trigger ki ho. Ek CSRF attack chalaata attacker ko victim ki session cookie value kabhi jaanne ya padhne ki zaroorat nahi hai; unhe sirf victim ke apne browser ko target application ko ek request bhejne ka kaaran banaana hai, aur browser sahi, asli cookie jodna poori tarah khud sambhaalta hai, bilkul jaise ye ek request ke liye karta jo vaidh page ne shuru ki ho. Kyunki \`HttpOnly\` sirf ye seemit karta hai ki JavaScript kya padh sakti hai, aur CSRF mein kabhi JavaScript kuch bhi padhna shaamil hi nahi hai, \`HttpOnly\` iske khilaaf bilkul koi protection nahi deta — dono swatantra chintaayein hain jinhe swatantra defenses chahiye, \`HttpOnly\` "kya ek malicious script cookie ki value chura sakti hai" sawaal ke liye, aur \`SameSite\` aur double-submit tokens jaise CSRF-khaas measures "kya ek malicious site ek asli, cookie-authenticated request trigger kar sakti hai" sawaal ke liye.',
      },
      {
        q: 'Why does the double-submit cookie pattern actually work — why can\'t an attacker\'s page simply read the victim\'s csrfToken cookie and include it in their forged request?',
        qHi: 'Double-submit cookie pattern asal mein kaam kyun karta hai — ek attacker ka page victim ki \`csrfToken\` cookie ko seedhe padh kar apni forged request mein shaamil kyun nahi kar sakta?',
        a: 'The pattern\'s security rests on a browser rule entirely separate from anything about cookies specifically: the same-origin policy, which prevents JavaScript running on one origin from reading data belonging to a different origin, including that other origin\'s cookies, its DOM, or the contents of responses from requests made to it. When an attacker\'s malicious page runs its own JavaScript, that JavaScript executes in the context of the attacker\'s own origin (their own domain), not the victim\'s target application\'s origin — and same-origin policy means that script has no ability to execute document.cookie or any equivalent read specifically scoped to the target application\'s domain and retrieve its csrfToken value, no matter how the attacker\'s script tries to do so. This is a fundamentally different situation from the cookie simply being attached to a request: a browser attaching a cookie to an outgoing request is the browser\'s own networking behavior, entirely separate from what any page\'s JavaScript is permitted to read, and same-origin policy restricts the latter without restricting the former at all. This is precisely why the pattern works: the browser will still attach the csrfToken cookie to the attacker-triggered request (assuming SameSite settings do not already block this), satisfying half of what the server checks, but the attacker\'s script has no way to read that same cookie\'s actual value to construct the matching X-CSRF-Token header the server also requires, since reading it would require exactly the cross-origin data access same-origin policy exists specifically to prevent.',
        aHi: 'Pattern ki suraksha ek browser rule par tiki hai jo bilkul cookies se alag kuch hai: same-origin policy, jo ek origin par chalti JavaScript ko ek alag origin ka data padhne se rokti hai, us doosre origin ki cookies, uska DOM, ya usse ki gayi requests ke responses ki contents sameet. Jab ek attacker ka malicious page apni khud ki JavaScript chalaata hai, wo JavaScript attacker ke apne origin (unke apne domain) ke context mein execute hoti hai, victim ki target application ke origin mein nahi — aur same-origin policy ka matlab hai us script ke paas \`document.cookie\` ya koi barabar ka read chalaane ki kshamta nahi hai jo khaas taur par target application ke domain tak scoped hai aur uski \`csrfToken\` value retrieve karta hai, attacker ki script chahe kaise bhi koshish kare. Ye ek buniyaadi taur par alag sthiti hai us se jismein cookie bas ek request se jodi jaati hai: ek browser ka ek jaati request se cookie jodna browser ka apna khud ka networking vyavhaar hai, kisi bhi page ki JavaScript ko padhne ki ijaazat hai us se poori tarah alag, aur same-origin policy doosre ko seemit kiye bina pehle ko seemit karti hai. Bilkul isi wajah se pattern kaam karta hai: browser phir bhi \`csrfToken\` cookie ko attacker-trigger-ki-gayi request se jodega (maante hue ki \`SameSite\` settings ise pehle se nahi rokti), server jo check karta hai uska aadha hissa santusht karte hue, par attacker ki script ke paas usi cookie ki asli value padhne ka koi tarika nahi hai matching \`X-CSRF-Token\` header banaane ke liye jo server bhi maangta hai, kyunki ise padhne ke liye bilkul wahi cross-origin data access chahiye hoga jise rokne ke liye khaas taur par same-origin policy maujood hai.',
      },
      {
        q: 'Why is CSRF protection still necessary even after implementing CORS restrictions on the API, and how are the two genuinely different concerns?',
        qHi: 'API par CORS restrictions lagu karne ke baad bhi CSRF protection kyun zaruri hai, aur ye dono sach mein kaise alag chintaayein hain?',
        a: 'CORS (Cross-Origin Resource Sharing) is a browser mechanism that controls whether JavaScript running on one origin is permitted to read the actual response content of a request made to a different origin — by default, browsers block this cross-origin reading, and a server can selectively permit it for specific origins by sending appropriate CORS headers. Critically, CORS restrictions govern only whether the RESPONSE can be READ by the requesting script; they do not, on their own, prevent the underlying request from being SENT in the first place, and they have no bearing on whether the browser attaches cookies to that request. A CSRF attack, as this lesson demonstrates, never requires the attacker to read anything back from the server at all — the attacker\'s hidden form simply triggers the request, the browser attaches the victim\'s real cookies to it exactly as it would for any other request to that domain, and the server processes it and performs the requested action, all without the attacker\'s page ever needing to inspect any response. A restrictive CORS policy would prevent the attacker\'s own JavaScript from directly reading back the server\'s JSON response confirming the email change succeeded, but it does nothing whatsoever to stop the request from being sent and acted upon in the first place, and for many CSRF attacks (changing account settings, initiating a transfer, submitting an order), the attacker does not need to see a confirmation response at all for the attack to have already succeeded. This is why CORS and CSRF protections are both necessary and address entirely non-overlapping concerns: CORS protects data confidentiality (can this script read that response), while CSRF protection concerns request authenticity (did this request genuinely originate from the application\'s own legitimate pages).',
        aHi: 'CORS (Cross-Origin Resource Sharing) ek browser mechanism hai jo niyantrit karta hai ki kya ek origin par chalti JavaScript ko ek alag origin ko ki gayi request ki asli response content padhne ki ijaazat hai — by default, browsers is cross-origin padhne ko block karte hain, aur ek server khaas origins ke liye ise chunkar ijaazat de sakta hai upyukt CORS headers bhejkar. Bahut zaruri, CORS restrictions sirf ye niyantrit karte hain ki kya RESPONSE maang karti script dwara PADHA jaa sakta hai; wo, khud se, underlying request ko pehli jagah BHEJE JAANE se nahi rokte, aur unka is baat par koi asar nahi hai ki kya browser us request se cookies jodta hai. Ek CSRF attack, jaisa ye lesson dikhaata hai, attacker ko server se kabhi kuch bhi wapas padhne ki zaroorat bilkul nahi hai — attacker ka chhupa form bas request trigger karta hai, browser victim ki asli cookies use bilkul waise jodta hai jaise ye us domain ki kisi doosri request ke liye karta, aur server ise process karta hai aur maangaa gaya action poora karta hai, sab attacker ke page ko kabhi koi response inspect karne ki zaroorat bina. Ek restrictive CORS policy attacker ki apni JavaScript ko server ka JSON response seedhe wapas padhne se rokegi jo email change safal hone ko confirm karta hai, par ye request ko pehli jagah bheje aur uspar kaarvaai hone se rokne ke liye bilkul kuch nahi karti, aur kai CSRF attacks ke liye (account settings badalna, ek transfer shuru karna, ek order submit karna), attacker ko attack safal ho chuka hone ke liye ek confirmation response dekhne ki zaroorat bilkul nahi hai. Bilkul isi wajah se CORS aur CSRF protections dono zaruri hain aur poori tarah na-overlapping chintaon ko sambodhit karte hain: CORS data confidentiality ki raksha karta hai (kya ye script us response ko padh sakti hai), jabki CSRF protection request authenticity se sambandhit hai (kya ye request sach mein application ke apne vaidh pages se aayi).',
      },
    ],

    exercises: [
      {
        task: 'Build the broken changeEmail function and a separate HTML file simulating an attacker\'s page with a hidden auto-submitting form targeting it. Open both, "logged in" via a mock cookie, and confirm the forged request succeeds.',
        taskHi: 'Toota \`changeEmail\` function aur ek alag HTML file banao jo ek attacker ke page ko simulate karti hai ek chhupe auto-submitting form ke saath ise target karte hue. Dono kholo, ek mock cookie ke zariye "logged in" ho, aur confirm karo ki forged request safal hoti hai.',
        hint: 'Use a mock backend that just logs the request it received, since this exercise is meant to demonstrate the vulnerability safely without a real server.',
        hintHi: 'Ek mock backend istemal karo jo bas mili request log karta hai, kyunki ye exercise ek asli server ke bina vulnerability ko surakshit taur par dikhaane ke liye hai.',
      },
      {
        task: 'Add a csrfToken cookie set on login (readable, not HttpOnly), update changeEmail to read and attach it as a header, and update the mock backend to reject requests without a matching header value.',
        taskHi: 'Login par set hui ek \`csrfToken\` cookie jodo (padhne-laayak, \`HttpOnly\` nahi), \`changeEmail\` ko update karo ise padhne aur header ki tarah jodne ke liye, aur mock backend ko update karo un requests ko reject karne ke liye jinke paas ek matching header value nahi hai.',
        hint: 'Reopen the attacker\'s HTML file from the previous exercise and confirm the forged request now fails, since it cannot include the correct header value.',
        hintHi: 'Pichle exercise ki attacker ki HTML file dobara kholo aur confirm karo ki forged request ab fail hoti hai, kyunki ye sahi header value shaamil nahi kar sakti.',
      },
      {
        task: 'Build the shared apiFetch wrapper from this lesson\'s third example, and refactor at least two different mutating functions to use it instead of calling fetch directly, confirming both automatically include the correct header.',
        taskHi: 'Is lesson ke teesre example ka shared \`apiFetch\` wrapper banao, aur kam-se-kam do alag mutating functions ko ise istemal karne ke liye refactor karo seedhe \`fetch\` bulaane ke bajaye, confirm karte hue ki dono automatically sahi header shaamil karte hain.',
        hint: 'Deliberately write a third function that calls fetch directly instead of apiFetch, and confirm it fails the backend\'s CSRF check, demonstrating exactly why the shared wrapper matters.',
        hintHi: 'Jaan-boojhkar ek teesra function likho jo \`apiFetch\` ke bajaye seedhe \`fetch\` bulaata hai, aur confirm karo ki ye backend ke CSRF check mein fail hota hai, bilkul dikhaate hue ki shared wrapper kyun maayne rakhta hai.',
      },
    ],

    keyTakeaways: [
      'Browsers automatically attach cookies to a request based purely on the target domain, regardless of which website\'s page actually triggered that request — this is what makes CSRF possible even with HttpOnly cookies.',
      'HttpOnly and CSRF protection address entirely different threats: HttpOnly prevents a script from reading a cookie\'s value, while CSRF concerns a malicious site triggering a genuine, credentialed request in the first place.',
      'The double-submit cookie pattern uses a second, deliberately readable cookie whose value must also be sent as a request header — same-origin policy prevents a cross-site attacker\'s script from ever reading that value to replicate it.',
      'The CSRF token cookie must NOT be marked HttpOnly, since the entire pattern depends on the frontend\'s own JavaScript being able to read it and attach it as a header.',
      'Centralizing CSRF header attachment into one shared fetch wrapper (or an axios interceptor) makes the correct behavior structurally unavoidable, rather than a convention every component must individually remember.',
      'CORS and CSRF are frequently confused but protect against different things: CORS controls whether a script can read a cross-origin response, while CSRF concerns whether a credentialed request gets sent and acted upon at all.',
    ],
    keyTakeawaysHi: [
      'Browsers automatically cookies ko ek request se shuddh roop se target domain ke aadhaar par jodte hain, chahe kaunsi website ke page ne asal mein wo request trigger ki ho — yahi hai jo \`HttpOnly\` cookies ke saath bhi CSRF ko mumkin banaata hai.',
      '\`HttpOnly\` aur CSRF protection poori tarah alag khatron ko sambodhit karte hain: \`HttpOnly\` ek script ko cookie ki value padhne se rokta hai, jabki CSRF ki chinta ek malicious site ke pehli jagah ek asli, credentialed request trigger karne se hai.',
      'Double-submit cookie pattern ek doosri, jaan-boojhkar padhne-laayak cookie istemal karta hai jiski value ek request header ki tarah bhi bheji jaani chahiye — same-origin policy ek cross-site attacker ki script ko kabhi wo value padhkar use dohraane se rokti hai.',
      'CSRF token cookie ko \`HttpOnly\` maark NAHI kiya jaana chahiye, kyunki poora pattern is baat par nirbhar hai ki frontend ki apni JavaScript ise padh sake aur ek header ki tarah jod sake.',
      'CSRF header attachment ko ek shared \`fetch\` wrapper (ya ek \`axios\` interceptor) mein kendrit karna sahi vyavhaar ko structurally avoidable-na-hone-laayak banaata hai, ek convention ke bajaye jise har component ko akele yaad rakhna chahiye.',
      'CORS aur CSRF aksar ghulmil jaate hain par alag cheezon ke khilaaf surakshit karte hain: CORS niyantrit karta hai ki kya ek script ek cross-origin response padh sakti hai, jabki CSRF ki chinta hai ki kya ek credentialed request bilkul bheji aur uspar kaarvaai jaati hai.',
    ],
  },
];
