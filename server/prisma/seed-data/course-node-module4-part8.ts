/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 8.
 *
 * CSRF (Cross-Site Request Forgery): why a cookie-authenticated route can be
 * triggered by a completely different, malicious website, without that
 * malicious site ever needing to read the response — directly distinct
 * from CORS (this module's earlier lesson), which only controls whether
 * cross-origin JavaScript can READ a response, never whether the browser
 * SENDS cookies with a cross-site request in the first place. Broken
 * example: an account settings route relying purely on a session cookie
 * for authentication — a hidden, auto-submitting form on a malicious page,
 * visited by a logged-in victim in another tab, silently changes the
 * victim's email address, because the browser automatically attaches the
 * session cookie to the cross-site request and the server has no way to
 * tell the request did not originate from its own pages. Fixed with the
 * SameSite cookie attribute (the modern, simplest primary defense) and the
 * double-submit CSRF token pattern (for cases needing SameSite=None or
 * defense-in-depth) — explicitly clarifying why a correctly configured
 * CORS policy provides zero protection against this specific attack.
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

export const NODE_MODULE_4_PART8: CourseLesson[] = [
  {
    slug: 'csrf-protection',
    title: 'CSRF: Why a Different Website Can Trigger Your Logged-In Actions',
    titleHi: 'CSRF: Ek Alag Website Tumhaare Logged-In Actions Trigger Kyun Kar Sakti Hai',
    description: 'A user, logged into their bank in one browser tab, visits a completely unrelated website in another tab — and their account email silently changes to an attacker\'s address, without that malicious site ever needing to read a single byte of the response.',
    descriptionHi: 'Ek user, ek tab mein apne bank mein login hai, ek doosre tab mein ek poori tarah na-judi website visit karta hai — aur unke account ki email chupke se ek attacker ke address mein badal jaati hai, us malicious site ko response ka ek bhi byte kabhi padhne ki zarurat bina.',
    difficulty: 'HARD',
    duration: 24,
    order: 8,

    analogy: {
      en: '**A signature stamp kept on your own desk that anyone who walks past can pick up and stamp any document with — the bank does not check whose hand is holding the stamp, only that the correct stamp mark is present on the paper.** A cookie-based session, sent automatically by the browser with every request to a given site regardless of which page or tab actually triggered that request, is like a personal signature stamp a bank has agreed to trust completely — any document bearing that exact stamp mark is treated as genuinely authorized by its owner, no further questions asked. The bank\'s trust in the stamp itself is entirely reasonable; the problem is where the stamp physically lives: sitting on the owner\'s own desk, in a room other people can walk into. If the owner leaves their office door open and steps away, anyone who wanders in can pick up that exact stamp and mark any document they like with it — a request to change the mailing address, a request to transfer funds — and hand it to the bank, which sees the genuine stamp mark and processes it exactly as if the actual owner had personally requested it, because the stamp itself carries the same authorization whoever happens to be pressing it onto the paper at that moment. The stamp\'s owner never authorized this specific document, never even saw it, and may not even realize anyone else was ever in the room — but from the bank\'s perspective, examining only the mark on the paper itself, there is no way to distinguish this from a document the owner genuinely, personally stamped themselves.',
      hi: '**Ek signature stamp jo tumhaari apni desk par rakha hai jise koi bhi jo waha se guzarta hai utha sakta hai aur kisi bhi document par stamp kar sakta hai — bank ye check nahi karta ki stamp kiske haath mein hai, sirf ye ki paper par sahi stamp nishaan maujood hai.** Ek cookie-based session, browser dwara ek diye site ko har request ke saath apne aap bheja jaata hai chahe koi bhi page ya tab asal mein us request ko trigger kare, ek personal signature stamp jaisa hai jise ek bank ne poori tarah bharosa karne ke liye sehmat kiya hai — wo bilkul stamp nishaan rakhta koi bhi document uske malik dwara sach mein adhikrit ki tarah treat hota hai, aage koi sawaal nahi. Bank ka stamp par bharosa poori tarah samajhdaari-bhara hai; samasya ye hai ki stamp physically kahan rehta hai: malik ki apni desk par baithha hua, ek kamre mein jahan doosre log ghus sakte hain. Agar malik apna office darwaaza khula chhod deta hai aur chala jaata hai, koi bhi jo bhatakte hue andar aata hai wo bilkul stamp utha sakta hai aur jo bhi document chahe use mark kar sakta hai — ek mailing address badalne ka request, ek funds transfer karne ka request — aur ise bank ko de sakta hai, jo asli stamp nishaan dekhta hai aur ise bilkul aise process karta hai jaise asli malik ne khud personally maanga ho, kyunki stamp khud wahi authorization le kar chalta hai jo bhi us pal use paper par daba raha ho. Stamp ka malik is khaas document ko kabhi adhikrit nahi karta, kabhi dekha bhi nahi, aur shaayad ye bhi na jaane ki koi aur kabhi kamre mein tha — par bank ke nazariye se, sirf paper par nishaan jaanchte hue, ise us document se alag karne ka koi tarika nahi hai jise malik ne sach mein, personally khud stamp kiya ho.',
    },

    simple: `**Start broken.** An account settings route relying purely on a session cookie for authentication, with no protection against a cross-site request:

\`\`\`js
app.post("/account/email", requireAuth, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Following this course\'s sessions-vs-tokens lesson, \`requireAuth\` here reads the current user\'s identity from a session cookie the browser automatically attaches to every request sent to this domain — this is entirely correct and expected behavior for a legitimately logged-in user genuinely using the application\'s own pages. The catastrophic gap is that a browser attaches this exact same cookie to a request to this exact same domain REGARDLESS of which website or page actually triggered that request — a completely unrelated, malicious website, visited in a different browser tab while the user happens to still be logged into this application in another tab, can host a simple, invisible HTML form:

\`\`\`html
<!-- On a completely different, malicious website -->
<form action="https://realapp.example.com/account/email" method="POST" id="csrf-form">
  <input type="hidden" name="email" value="attacker@evil.com" />
</form>
<script>document.getElementById("csrf-form").submit();</script>
\`\`\`

The instant a logged-in victim\'s browser loads this malicious page, the hidden form submits automatically, sending a genuine \`POST\` request to the real application\'s own domain — and because the victim\'s browser has a valid session cookie for that domain, it attaches that cookie automatically, exactly as it would for any legitimate request from the application\'s own pages. The server has absolutely no way to tell this request originated from a malicious, unrelated website rather than from the application\'s own settings page — \`requireAuth\` sees a perfectly valid session cookie, correctly identifies the genuine victim, and the route genuinely updates their email to the attacker\'s address, all without the malicious page ever needing to read a single byte of the response — the ENTIRE ATTACK is complete the instant the request is sent, regardless of whether the attacker\'s page can see what comes back.

**The fix: SameSite cookies, the modern, primary defense**

\`\`\`js
res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
\`\`\`

\`\`\`ts
res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
});
\`\`\`

The \`SameSite\` cookie attribute tells the browser itself, directly, whether to include a specific cookie when a request is being made as a result of navigation or a form submission FROM A DIFFERENT SITE — set to \`"strict"\` (or, with a small, deliberate exception for top-level navigation, \`"lax"\`), the browser simply does not attach the session cookie at all when the malicious page\'s form submits its cross-site request, regardless of how the request is triggered. With no session cookie attached, \`requireAuth\` on the server sees no valid session at all and correctly rejects the request as unauthenticated — the malicious form still submits, the request still reaches the real server, but it arrives with no proof of identity whatsoever, and the account\'s email is never touched. This is a browser-level protection, requiring no changes to the route\'s own logic at all — the fix lives entirely in how the cookie itself is issued.`,

    simpleHi: `**Toote hue se shuru.** Ek account settings route jo authentication ke liye poori tarah ek session cookie par bharosa karta hai, ek cross-site request ke khilaaf koi protection bina:

\`\`\`js
app.post("/account/email", requireAuth, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Is course ke sessions-vs-tokens lesson ka palan karte hue, \`requireAuth\` yahan abhi ke user ki pehchaan ek session cookie se padhta hai jise browser is domain ko bheji har request ke saath apne aap attach karta hai — ye ek legitimate taur par login hue user ke liye poori tarah sahi aur ummeed kiya vyavhaar hai jo sach mein application ke apne pages istemal kar raha hai. Vinaashak kami ye hai ki ek browser bilkul yehi cookie is bilkul domain ko ek request ke saath attach karta hai ye baat se BEKHABAR ki asal mein kaunsi website ya page ne wo request trigger ki — ek poori tarah na-judi, malicious website, ek alag browser tab mein visit ki gayi jab user samyog se abhi bhi ek doosre tab mein is application mein login hai, ek saadha, adrishya HTML form host kar sakti hai:

\`\`\`html
<!-- Ek poori tarah alag, malicious website par -->
<form action="https://realapp.example.com/account/email" method="POST" id="csrf-form">
  <input type="hidden" name="email" value="attacker@evil.com" />
</form>
<script>document.getElementById("csrf-form").submit();</script>
\`\`\`

Jis pal ek login hue victim ka browser ye malicious page load karta hai, chhupa hua form apne aap submit hota hai, asli application ke apne domain ko ek asli \`POST\` request bhejta hua — aur kyunki victim ke browser ke paas us domain ke liye ek valid session cookie hai, ye us cookie ko apne aap attach karta hai, bilkul waisa jaise ye application ke apne pages se kisi bhi legitimate request ke liye karta. Server ke paas bilkul koi tarika nahi hai ye bataane ka ki ye request ek malicious, na-judi website se aayi na ki application ke apne settings page se — \`requireAuth\` ek poori tarah valid session cookie dekhta hai, sahi tarike se asli victim ko pehchaanta hai, aur route sach mein unki email ko attacker ke address mein update kar deta hai, sab kuch malicious page ko response ka ek bhi byte kabhi padhne ki zarurat bina — POORA ATTACK request bhejte hi poora hota hai, attacker ka page dekh sake ki kya wapas aata hai ya nahi us se bekhabar.

**Fix: \`SameSite\` cookies, modern, mukhya bachaav**

\`\`\`js
res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
\`\`\`

\`\`\`ts
res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
});
\`\`\`

\`SameSite\` cookie attribute browser ko khud, seedha batata hai ki kya ek khaas cookie shaamil kare jab ek request EK ALAG SITE se navigation ya form submission ke nateeje ki tarah ban rahi ho — \`"strict"\` par set kiya gaya (ya, top-level navigation ke liye ek chhoti, jaan-boojhkar apvaad ke saath, \`"lax"\`), browser bas bilkul session cookie attach nahi karta jab malicious page ka form apni cross-site request submit karta hai, request kaise trigger hui us se bekhabar. Koi session cookie attach na hone par, server par \`requireAuth\` bilkul koi valid session nahi dekhta aur sahi tarike se request ko unauthenticated ki tarah reject karta hai — malicious form abhi bhi submit hota hai, request abhi bhi asli server tak pahunchti hai, par ye pehchaan ka bilkul koi saboot bina pahunchti hai, aur account ki email kabhi chhui hi nahi jaati. Ye ek browser-level protection hai, route ki apni logic mein koi badlaav bina — fix poori tarah isme rehta hai ki cookie khud kaise issue hoti hai.`,

    content: `## Why a correctly configured CORS policy provides zero protection against CSRF

\`\`\`js
// This CORS configuration (from this module's earlier CORS lesson) does
// NOT stop the CSRF attack this lesson describes at all
app.use(cors({ origin: "https://realapp.example.com", credentials: true }));
\`\`\`

This module\'s earlier CORS lesson established that CORS controls whether JavaScript running on one origin is permitted to READ the response of a cross-origin request made from that origin\'s own page. CSRF is a fundamentally different attack that does not require reading any response at all — the malicious page\'s form submission is a genuine, ordinary HTML form submission, which browsers have always permitted across origins (this is how a search engine\'s results page can link to a form submitting to a completely different site, entirely unrelated to any API call), and simple form submissions are not even subject to the CORS preflight mechanism this course\'s earlier lesson covered. The attacker\'s form does not need to read anything back — changing a victim\'s email address, transferring funds, or deleting an account are all attacks that succeed completely the instant the request is processed server-side, regardless of whether the attacker ever sees any response at all. A correctly configured CORS policy, exactly as covered in this module\'s earlier lesson, does nothing whatsoever to prevent the malicious form from submitting or the browser from attaching the victim\'s cookie to it — CORS and CSRF protection are two entirely separate concerns, and having one correctly configured provides no protection against the other.

## SameSite=Lax vs. Strict: a real, practical trade-off

\`\`\`js
// Strict: the cookie is never sent on any cross-site request, including
// a user clicking a genuine link from an email or another website into your app
res.cookie("sessionId", sessionId, { sameSite: "strict" });

// Lax: the cookie IS sent for top-level navigation (clicking a link), but
// still withheld for cross-site form submissions and background requests
res.cookie("sessionId", sessionId, { sameSite: "lax" });
\`\`\`

\`SameSite: "strict"\` provides the strongest protection, withholding the cookie on every cross-site request without exception — but this includes a genuine, honest scenario: a real user clicking a legitimate link to the application from an email or a different website entirely, landing on the application while NOT already having an active, matching-site browsing context, would find themselves not logged in even though they have a perfectly valid session, since the browser withholds the cookie for that initial cross-site navigation too. \`SameSite: "lax"\` (the default in modern browsers when unspecified) makes one deliberate exception: the cookie IS still sent when a user directly navigates to the site by clicking a link (a top-level \`GET\` navigation), but remains withheld for the cross-site form submissions and background requests CSRF attacks actually rely on — this preserves the legitimate "click a link, land on the site while still logged in" experience while still blocking the specific attack pattern this lesson demonstrates, which is why \`lax\` is the more commonly recommended default for most applications, with \`strict\` reserved for especially sensitive actions where even that narrow exception is not acceptable.

## The double-submit CSRF token pattern: a defense-in-depth backup

\`\`\`js
// The server sets a random token, readable by the page's own JavaScript (not httpOnly)
app.get("/account/settings", requireAuth, (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("csrfToken", csrfToken, { httpOnly: false, sameSite: "strict" });
  res.render("settings", { csrfToken });
});

// The page's own form includes this token as a hidden field, read from the DOM
// <input type="hidden" name="csrfToken" value="{{csrfToken}}">

// The server checks the submitted token matches the cookie's token
app.post("/account/email", requireAuth, (req, res, next) => {
  if (req.body.csrfToken !== req.cookies.csrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  // ...proceed...
});
\`\`\`

\`SameSite\` cookies are a strong, modern, browser-enforced defense, but some applications still layer an additional, explicit CSRF token check on top, particularly for older browser support or especially sensitive actions. The "double-submit cookie" pattern works because a malicious cross-site page can trigger a request carrying the victim\'s COOKIES automatically, but has no way to read the CONTENTS of those cookies or the application\'s own page to discover the specific random token value it would need to include as a matching form field or header — the browser\'s same-origin policy prevents the malicious page\'s JavaScript from reading the real application\'s DOM or its non-httpOnly cookie value directly. The server then simply checks that the token submitted as ordinary request data matches the token stored in the cookie — a mismatch (or a missing token entirely, as the forged request would have) is rejected, providing a second, independent layer of defense that does not rely on the browser\'s \`SameSite\` enforcement alone.

## Why CSRF specifically threatens cookie-based auth, and is largely moot for header-based tokens

\`\`\`js
// A JWT sent via an Authorization header (this module's JWT lesson) is
// NEVER automatically attached by the browser to any request —
// JavaScript on the legitimate page must deliberately read it and attach it
fetch("/account/email", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` }, // a malicious page has no way to obtain this value
  body: JSON.stringify({ email: newEmail }),
});
\`\`\`

This lesson\'s entire attack depends on one specific browser behavior: automatically attaching a COOKIE to every request to a given domain, regardless of which page triggered that request. This is precisely why CSRF is a much smaller concern for applications using this module\'s JWT-based authentication instead of cookies — a JWT sent via an \`Authorization\` header is never automatically attached by the browser to anything; it must be explicitly read from wherever the legitimate application stored it (commonly \`localStorage\` or an in-memory variable) and manually included in each request\'s headers by the application\'s own JavaScript, which a malicious, unrelated page has no way to do, since it cannot read another origin\'s storage or in-memory state. This does not mean JWT-based authentication is automatically immune to every related risk (a stolen token via XSS remains a genuine concern, covered by this course\'s other security lessons), but the SPECIFIC cross-site-cookie-attachment mechanism this lesson demonstrates simply does not apply when authentication does not rely on an automatically-attached cookie in the first place.`,

    contentHi: `## Ek sahi taur par configure ki gayi CORS policy CSRF ke khilaaf zero protection kyun deti hai

\`\`\`js
// Ye CORS configuration (is module ke pehle wale CORS lesson se) is
// lesson mein describe hua CSRF attack ko bilkul NAHI rokti
app.use(cors({ origin: "https://realapp.example.com", credentials: true }));
\`\`\`

Is module ke pehle wale CORS lesson ne sthaapit kiya tha ki CORS control karta hai ki kya ek origin par chal raha JavaScript us origin ke apne page se banayi gayi ek cross-origin request ke response ko PADH sakta hai. CSRF ek buniyaadi taur par alag attack hai jise bilkul koi response padhne ki zarurat nahi — malicious page ka form submission ek asli, aam HTML form submission hai, jise browsers ne hamesha origins ke aar-paar ijaazat di hai (isi tarike se ek search engine ki results page ek poori tarah alag site ko submit karte ek form se link kar sakti hai, kisi bhi API call se poori tarah bekhabar), aur saadhe form submissions is course ke pehle wale lesson mein cover hue CORS preflight mechanism ke adheen bhi nahi hain. Attacker ke form ko kuch bhi wapas padhne ki zarurat nahi — ek victim ki email address badalna, funds transfer karna, ya ek account delete karna sab hamle hain jo poori tarah safal hote hain jis pal request server-side process hoti hai, attacker kabhi koi response dekhe ya na dekhe us se bekhabar. Ek sahi taur par configure ki gayi CORS policy, bilkul is module ke pehle wale lesson mein cover hui jaisi, malicious form ko submit hone se ya browser ko victim ki cookie use attach karne se rokne ke liye bilkul kuch nahi karti — CORS aur CSRF protection do poori tarah alag chintaayen hain, aur ek ko sahi configure kiya hona doosre ke khilaaf koi protection nahi deta.

## \`SameSite=Lax\` vs. \`Strict\`: ek asli, practical trade-off

\`\`\`js
// Strict: cookie kabhi kisi bhi cross-site request par nahi bheji jaati, ek user ke
// ek email ya doosri website se ek asli link click karke tumhaari app mein aane sameet
res.cookie("sessionId", sessionId, { sameSite: "strict" });

// Lax: cookie top-level navigation (ek link click karna) ke liye BHEJI JAATI HAI, par
// abhi bhi cross-site form submissions aur background requests ke liye rokh li jaati hai
res.cookie("sessionId", sessionId, { sameSite: "lax" });
\`\`\`

\`SameSite: "strict"\` sabse mazboot protection deta hai, cookie ko har cross-site request par bina apvaad ke rokte hue — par ismein ek asli, imandaar scenario shaamil hai: ek asli user jo ek email ya ek poori tarah alag website se application ka ek legitimate link click karta hai, application par pahunchta hai jabki pehle se ek active, milte-site browsing context na rakhte hue, apne aap ko login nahi paayega chahe unke paas ek poori tarah valid session ho, kyunki browser us shuruaati cross-site navigation ke liye bhi cookie rokta hai. \`SameSite: "lax"\` (modern browsers mein default jab specify na kiya jaaye) ek jaan-boojhkar apvaad banaata hai: cookie ABHI BHI BHEJI JAATI HAI jab ek user seedha site par navigate karta hai ek link click karke (ek top-level \`GET\` navigation), par cross-site form submissions aur background requests ke liye rokhi rehti hai jin par CSRF attacks asal mein bharosa karte hain — ye legitimate "ek link click karo, site par login hote hue pahuncho" anubhav ko surakshit rakhta hai jabki abhi bhi is lesson mein dikhaaye khaas attack pattern ko rokta hai, isi wajah se \`lax\` zyaadatar applications ke liye zyaada aam taur par sujhaaya jaata default hai, \`strict\` khaas taur par sensitive actions ke liye rakha jaata hai jahan wo sankeern apvaad bhi swikaarya nahi hai.

## Double-submit CSRF token pattern: ek defense-in-depth backup

\`\`\`js
// Server ek random token set karta hai, page ke apne JavaScript se padhne-laayak (httpOnly nahi)
app.get("/account/settings", requireAuth, (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("csrfToken", csrfToken, { httpOnly: false, sameSite: "strict" });
  res.render("settings", { csrfToken });
});

// Page ka apna form is token ko ek hidden field ki tarah shaamil karta hai, DOM se padha hua
// <input type="hidden" name="csrfToken" value="{{csrfToken}}">

// Server check karta hai submit ki gayi token cookie ki token se milti hai
app.post("/account/email", requireAuth, (req, res, next) => {
  if (req.body.csrfToken !== req.cookies.csrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  // ...aage badho...
});
\`\`\`

\`SameSite\` cookies ek mazboot, modern, browser-lagu ki hui bachaav hain, par kuch applications abhi bhi uske oopar ek additional, explicit CSRF token check layer karte hain, khaaskar purane browser support ya khaas taur par sensitive actions ke liye. "Double-submit cookie" pattern kaam karta hai kyunki ek malicious cross-site page ek request trigger kar sakta hai jo victim ki COOKIES apne aap le kar aati hai, par uske paas un cookies ki CONTENTS ya application ke apne page ko padhne ka koi tarika nahi hai us khaas random token value dhoondhne ke liye jise use ek milti form field ya header ki tarah shaamil karna chahiye — browser ki same-origin policy malicious page ke JavaScript ko asli application ki DOM ya uski non-httpOnly cookie value seedha padhne se rokti hai. Server phir bas check karta hai ki aam request data ki tarah submit ki gayi token cookie mein store hui token se milti hai — ek mismatch (ya ek bilkul missing token, jaisa forge ki gayi request ka hoga) reject hota hai, ek doosri, mustaqil bachaav ki layer deta hai jo akele browser ki \`SameSite\` enforcement par bharosa nahi karta.

## CSRF khaas taur par cookie-based auth ko kyun khatra pahunchata hai, aur header-based tokens ke liye lagbhag bemaani hai

\`\`\`js
// Ek JWT jo ek Authorization header se bheja jaata hai (is module ka JWT lesson) browser
// dwara KABHI apne aap kisi bhi request se attach NAHI hoti —
// legitimate page ka JavaScript ise jaan-boojhkar padhkar attach karna chahiye
fetch("/account/email", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` }, // ek malicious page ke paas ye value paane ka koi tarika nahi
  body: JSON.stringify({ email: newEmail }),
});
\`\`\`

Is lesson ka poora attack ek khaas browser vyavhaar par nirbhar karta hai: ek COOKIE ko ek diye domain ko har request ke saath apne aap attach karna, us request ko kis page ne trigger kiya us se bekhabar. Bilkul isi wajah se CSRF ek kaafi chhoti chinta hai un applications ke liye jo cookies ke bajaye is module ke JWT-based authentication ka istemal karte hain — ek JWT jo ek \`Authorization\` header se bheja jaata hai browser dwara kabhi apne aap kisi bhi cheez se attach nahi hota; ise jahan bhi legitimate application ne store kiya tha (aam taur par \`localStorage\` ya ek in-memory variable) wahan se explicitly padha jaana chahiye aur manually application ke apne JavaScript dwara har request ke headers mein shaamil kiya jaana chahiye, jo ek malicious, na-judi page karne ka koi tarika nahi rakhta, kyunki ye doosre origin ki storage ya in-memory sthiti nahi padh sakta. Iska matlab ye nahi hai ki JWT-based authentication apne aap har jude khatre se surakshit hai (ek XSS ke through churaaya token abhi bhi ek asli chinta hai, is course ke doosre security lessons mein cover hui), par is lesson mein dikhaaya KHAAS cross-site-cookie-attachment mechanism bilkul lagu nahi hota jab authentication pehli jagah ek apne-aap-attach-hote cookie par nirbhar hi nahi karta.`,

    examples: [
      {
        title: 'Broken: a hidden cross-site form silently changes a victim\'s email',
        titleHi: 'Toota: ek chhupa hua cross-site form chupke se ek victim ki email badalta hai',
        code: `<form action="https://realapp.example.com/account/email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.com" />
</form>
<script>document.forms[0].submit();</script>
// the victim's browser attaches their session cookie automatically`,
        codeJs: `// server.js — no CSRF protection at all
app.post("/account/email", requireAuth, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});
// session cookie: res.cookie("sessionId", sessionId) — no sameSite set at all`,
        codeTs: `app.post("/account/email", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about the cookie's own attributes, not this route's logic.`,
        output: `A logged-in victim visits an unrelated malicious page in another tab.
Their email is silently changed to the attacker's address — the
malicious page never needed to read any response; the side effect
alone completes the attack.`,
        explain: 'The server has no way to distinguish a request triggered by the application\'s own page from one triggered by a completely different, malicious page — both arrive with the same valid session cookie attached.',
        explainHi: 'Server ke paas application ke apne page se trigger hui ek request ko ek poori tarah alag, malicious page se trigger hui se alag karne ka koi tarika nahi hai — dono wahi valid session cookie attach hue aati hain.',
      },
      {
        title: 'Fixed: SameSite=Strict prevents the browser from attaching the cookie at all',
        titleHi: 'Theek: \`SameSite=Strict\` browser ko cookie bilkul attach karne se rokta hai',
        code: `res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "strict" });
// the same malicious form now submits with no session cookie attached at all`,
        codeJs: `app.post("/login", async (req, res, next) => {
  // ...password verification...
  const sessionId = crypto.randomUUID();
  await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [
    sessionId, user.id, new Date(Date.now() + 60 * 60 * 1000),
  ]);
  res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ message: "Logged in" });
});

app.post("/account/email", requireAuth, async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // ...password verification...
  const sessionId = crypto.randomUUID();
  await pool.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [
    sessionId, user.id, new Date(Date.now() + 60 * 60 * 1000),
  ]);
  res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ message: "Logged in" });
});

app.post("/account/email", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The malicious page's form still submits, and the request still
reaches the real server — but the browser withholds the session
cookie entirely for this cross-site request, so requireAuth correctly
rejects it as unauthenticated.`,
        outputTs: `// Identical behaviour. The fix required no change to the route's own
// logic at all — it lives entirely in the cookie's own attributes set
// once, at login.`,
        explain: 'The browser itself, not the server\'s own logic, is what refuses to attach the cookie — this is a protection enforced at the browser level, based purely on the cookie\'s own declared attributes.',
        explainHi: 'Browser khud, server ki apni logic nahi, wo hai jo cookie attach karne se mana karta hai — ye ek protection hai jo browser level par lagu hoti hai, poori tarah cookie ke apne declare kiye attributes ke aadhaar par.',
      },
      {
        title: 'A second layer: the double-submit CSRF token pattern',
        titleHi: 'Ek doosri layer: double-submit CSRF token pattern',
        code: `if (req.body.csrfToken !== req.cookies.csrfToken) {
  return res.status(403).json({ error: "Invalid CSRF token" });
}
// a malicious page cannot read the real page's DOM to obtain this token`,
        codeJs: `const crypto = require("crypto");

app.get("/account/settings", requireAuth, (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("csrfToken", csrfToken, { httpOnly: false, sameSite: "strict" });
  res.render("settings", { csrfToken });
});

app.post("/account/email", requireAuth, async (req, res, next) => {
  if (req.body.csrfToken !== req.cookies.csrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import crypto from "crypto";

app.get("/account/settings", requireAuth, (req: Request, res: Response): void => {
  const csrfToken: string = crypto.randomBytes(32).toString("hex");
  res.cookie("csrfToken", csrfToken, { httpOnly: false, sameSite: "strict" });
  res.render("settings", { csrfToken });
});

app.post("/account/email", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.body.csrfToken !== req.cookies.csrfToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }
  try {
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [req.body.email, req.userId]);
    res.json({ message: "Email updated" });
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A forged request from a malicious page has no way to know or include
the correct csrfToken value, since it cannot read the real
application's page or non-httpOnly cookie directly — the request is
correctly rejected with 403, independent of the SameSite protection.`,
        outputTs: `// Identical behaviour. This provides a second, independent layer of
// defense that does not rely solely on SameSite enforcement, useful
// for older browsers or especially sensitive routes.`,
        explain: 'The malicious page can trigger a request carrying the victim\'s cookies automatically, but has no way to read those cookies\' contents or the real page\'s DOM to discover the specific token value it would need to include.',
        explainHi: 'Malicious page ek aisi request trigger kar sakta hai jo victim ki cookies apne aap le kar aati hai, par uske paas un cookies ki contents ya asli page ki DOM ko padhne ka koi tarika nahi hai us khaas token value dhoondhne ke liye jise use shaamil karna chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `app.use(cors({ origin: "https://realapp.example.com", credentials: true }));
// assuming a correctly configured CORS policy also prevents CSRF`,
        right: `res.cookie("sessionId", sessionId, { sameSite: "strict" });
// CORS and CSRF are separate concerns — CSRF needs its own explicit defense`,
        why: 'CORS controls whether cross-origin JavaScript can READ a response — it does nothing to stop a browser from SENDING a cookie-carrying cross-site request in the first place, which is exactly what CSRF exploits.',
        whyHi: 'CORS control karta hai ki kya cross-origin JavaScript ek response PADH sakta hai — ye ek browser ko ek cookie-le-jaati cross-site request BHEJNE se rokne ke liye bilkul kuch nahi karta, jo bilkul wo hai jise CSRF exploit karta hai.',
      },
      {
        wrong: `res.cookie("sessionId", sessionId);
// no sameSite attribute at all — the browser attaches this cookie to any cross-site request`,
        right: `res.cookie("sessionId", sessionId, { sameSite: "lax" }); // or "strict" for maximum protection
// the browser withholds the cookie on cross-site form submissions and background requests`,
        why: 'Without an explicit SameSite attribute, the cookie may be sent on cross-site requests depending on the browser\'s own default behavior — explicitly setting it removes any ambiguity about this critical protection.',
        whyHi: 'Bina ek explicit \`SameSite\` attribute ke, cookie cross-site requests par bheji jaa sakti hai browser ke apne default vyavhaar par nirbhar karte hue — explicitly ise set karna is zaruri protection ke baare mein koi asaspashtta hataata hai.',
      },
      {
        wrong: `if (req.body.csrfToken) { /* proceed, treating any non-empty token as valid */ }
// never actually comparing the submitted token against the stored one`,
        right: `if (req.body.csrfToken !== req.cookies.csrfToken) return res.status(403).json({ error: "Invalid CSRF token" });
// explicitly comparing the submitted token against the one issued to this session`,
        why: 'A CSRF token check only provides protection if the submitted value is genuinely compared against the specific token issued to this session — merely checking that some token was present provides no protection at all.',
        whyHi: 'Ek CSRF token check sirf tab protection deta hai jab submit ki gayi value ko sach mein us khaas token se compare kiya jaaye jo is session ko issue hua tha — bas ye check karna ki koi token maujood tha bilkul koi protection nahi deta.',
      },
    ],

    realWorld: [
      {
        en: '**CSRF has been a formally recognized entry in the OWASP Top 10 web application security risks for many years**, and modern browsers\' shift toward defaulting cookies to SameSite=Lax when unspecified is a direct, platform-level response to how common and consequential this attack has historically been.',
        hi: '**CSRF kai saalon se OWASP Top 10 web application security risks mein ek formal taur par pehchaana gaya entry raha hai**, aur modern browsers ka cookies ko \`SameSite=Lax\` default banaane ki taraf jhukaav jab specify na kiya jaaye is baat ka ek seedha, platform-level jawaab hai ki ye attack historically kitna aam aur nateeja-wala raha hai.',
      },
      {
        en: '**Real, publicly documented CSRF vulnerabilities have been found and patched in major consumer and enterprise applications**, commonly involving exactly this class of scenario — a state-changing action (a password reset, a fund transfer, an account setting change) triggerable by a hidden cross-site request.',
        hi: '**Asli, saarvajanik roop se documented CSRF vulnerabilities badi consumer aur enterprise applications mein paayi aur patch ki gayi hain**, aam taur par bilkul is kism ki scenario shaamil karte hue — ek state-badalti action (ek password reset, ek fund transfer, ek account setting badlaav) jo ek chhupi cross-site request se trigger ho sakti hai.',
      },
      {
        en: '**Popular server-side frameworks (Rails, Django, Laravel) ship with CSRF protection enabled by default for form-based requests**, reflecting an industry-wide consensus that this protection should be a standard, expected baseline rather than something a developer must remember to add manually.',
        hi: '**Popular server-side frameworks (Rails, Django, Laravel) form-based requests ke liye default taur par CSRF protection enabled ke saath aate hain**, ek industry-wide sehmati zaahir karte hue ki ye protection ek standard, ummeed kiya baseline hona chahiye, kuch aisa nahi jise ek developer ko manually jodna yaad rakhna chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a correctly configured CORS policy provide no protection against a CSRF attack, even though both concern requests from a different origin?',
        qHi: 'Ek sahi taur par configure ki gayi CORS policy ek CSRF attack ke khilaaf koi protection kyun nahi deti, chahe dono ek alag origin se aati requests se sambandhit hain?',
        a: 'CORS specifically governs one particular question: whether JavaScript running on one origin is permitted to READ the response of a request made to a different origin — it is a protection built around controlling what a script can subsequently DO with a response it receives, after that response has already been sent back by the server. CSRF is a fundamentally different kind of attack that does not depend on reading any response at all: an ordinary HTML form, submitted via a standard, full-page navigation, is something browsers have always permitted to target a different origin entirely, and this specific submission mechanism is not even subject to the CORS preflight check this course\'s earlier lesson covered, since a simple form submission does not go through the same request-permission negotiation an XHR/fetch-based cross-origin request does. The CSRF attack this lesson describes completes its entire goal the moment the server processes the forged request server-side (changing an email address, for instance) — the attacker\'s page never needs to see what the server responded with, since the damage is already done purely by the request being processed at all. Because CORS\'s entire mechanism is about restricting what happens to a RESPONSE after it comes back, and CSRF never requires the attacker to see that response in the first place, a correctly configured CORS policy has literally nothing to say about, or effect on, whether the forged cross-site request itself gets sent and processed.',
        aHi: 'CORS khaas taur par ek khaas sawaal ko manage karta hai: kya ek origin par chal raha JavaScript ek doosre origin ko ki gayi request ke response ko PADH sakta hai — ye ek protection hai jo control karne ke aas-paas bani hai ki ek script ek response ke saath baad mein kya kar sakta hai, us response ke server dwara wapas bheje jaane ke baad. CSRF ek buniyaadi taur par alag kism ka attack hai jo bilkul kisi response ko padhne par nirbhar nahi karta: ek aam HTML form, ek standard, poori-page navigation ke through submit hua, kuch aisa hai jise browsers ne hamesha ek poori tarah alag origin ko nishaana banaane ki ijaazat di hai, aur ye khaas submission mechanism is course ke pehle wale lesson mein cover hue CORS preflight check ke adheen bhi nahi hai, kyunki ek saadha form submission wahi request-permission negotiation se nahi guzarta jo ek XHR/fetch-based cross-origin request se guzarta hai. Is lesson mein describe hua CSRF attack apna poora lakshya us pal poora karta hai jab server forge ki gayi request server-side process karta hai (ek email address badalte hue, misal ke taur par) — attacker ke page ko kabhi ye dekhne ki zarurat nahi ki server ne kya jawaab diya, kyunki nuksaan bilkul request process hone se hi poora ho chuka hota hai. Kyunki CORS ka poora mechanism iske baare mein hai ki wapas aane ke baad ek RESPONSE ke saath kya hota hai use seemit karna, aur CSRF ko kabhi ye zarurat nahi ki attacker wo response dekhe, ek sahi taur par configure ki gayi CORS policy literally kuch nahi kehti, ya asar nahi karti, is baare mein ki kya forge ki gayi cross-site request khud bheji aur process hoti hai.',
      },
      {
        q: 'How does the SameSite=Strict cookie attribute actually prevent the CSRF attack this lesson describes, and why is this a browser-enforced protection rather than something the server\'s route logic decides?',
        qHi: '\`SameSite=Strict\` cookie attribute asal mein is lesson mein describe hua CSRF attack ko kaise rokta hai, aur ye ek browser-lagu ki hui protection kyun hai koi aisi cheez nahi jise server ki route logic tay karti hai?',
        a: 'The SameSite attribute is a piece of metadata set on the cookie itself at the moment it is created (when the server sends it via a Set-Cookie response header), and it is the BROWSER — not the server\'s own application logic — that reads this attribute and decides, for every subsequent request, whether to include that specific cookie based on whether the request is being made as a same-site or cross-site request. When set to "strict," the browser\'s own internal logic withholds the cookie entirely whenever it determines the current request originates from a different site than the cookie was issued for — this determination and the resulting decision to attach or withhold the cookie happens entirely within the browser, before the request is even sent over the network, meaning the malicious page\'s form submission genuinely leaves the victim\'s browser with no session cookie attached at all. The server\'s route logic never needs to do anything differently to benefit from this — by the time the forged request actually arrives at the server, it simply lacks the cookie the server would need to identify the request as belonging to an authenticated session, and the existing authentication logic (checking for a valid session cookie) correctly fails exactly as it would for any other request with no session cookie present. This is precisely why the fix required no changes to the account settings route\'s own code at all — the protection is enforced entirely by the browser\'s handling of the cookie, based purely on an attribute set once, at the moment the cookie was originally issued during login.',
        aHi: '\`SameSite\` attribute ek metadata ka tukda hai jo cookie khud par set hota hai us pal jab ye banaayi jaati hai (jab server ise ek \`Set-Cookie\` response header ke through bhejta hai), aur ye BROWSER hai — server ki apni application logic nahi — jo is attribute ko padhta hai aur faisla karta hai, har baad wali request ke liye, ki kya us khaas cookie ko shaamil kare is baat ke aadhaar par ki request ek same-site ya cross-site request ki tarah banaayi jaa rahi hai. \`"strict"\` par set hone par, browser ki apni internal logic cookie ko poori tarah rokh leti hai jab bhi ye tay karti hai ki abhi ki request ek alag site se aati hai jismein cookie issue hui thi us se — ye faisla aur nateeja hua cookie attach ya rokhne ka faisla poori tarah browser ke andar hota hai, request network par bheje jaane se bhi pehle, matlab malicious page ka form submission sach mein victim ke browser ko koi session cookie attach kiye bina chhodta hai. Server ki route logic ko is se faayda uthaane ke liye kabhi kuch alag karne ki zarurat nahi — jab forge ki gayi request asal mein server tak pahunchti hai, ismein bas wo cookie nahi hoti jo server ko chahiye request ko ek authenticated session ki tarah pehchaanne ke liye, aur maujooda authentication logic (ek valid session cookie check karte hue) sahi tarike se fail hoti hai bilkul waisa jaisa wo kisi bhi doosri request ke liye karti koi session cookie maujood na hone par. Bilkul isi wajah se fix ko account settings route ke apne code mein koi badlaav ki zarurat nahi thi bilkul — protection poori tarah browser ke cookie ko sambhaalne se lagu hoti hai, poori tarah ek attribute ke aadhaar par jo ek baar set hua, us pal jab cookie asal mein login ke dauraan issue hui thi.',
      },
      {
        q: 'Why does the double-submit CSRF token pattern work as a defense, given that the malicious page can still trigger the victim\'s browser to send their session cookie automatically?',
        qHi: 'Double-submit CSRF token pattern ek bachaav ki tarah kyun kaam karta hai, jab ki malicious page abhi bhi victim ke browser ko unki session cookie apne aap bhejne ke liye trigger kar sakta hai?',
        a: 'The double-submit pattern deliberately relies on a genuine asymmetry between what a malicious cross-site page CAN and CANNOT do. It genuinely can trigger the victim\'s browser to automatically attach cookies to a request targeting the real application\'s domain, since that is simply how cookies work by default — this is exactly the capability the earlier part of this lesson demonstrated being exploited. However, the malicious page has no way at all to read the CONTENTS of those cookies directly (browsers\' same-origin policy prevents one origin\'s JavaScript from reading another origin\'s cookies, storage, or DOM), and it has no way to read the real application\'s own page — the actual HTML, with its embedded hidden form field containing the specific random CSRF token value the legitimate page generated for that session. The defense works by requiring the forged request to include, as ordinary submitted data (a form field or header), a token value that must exactly match a value simultaneously stored in a cookie for that session — since correctly obtaining this value from a legitimate page requires either reading that page\'s own DOM or reading the cookie\'s actual contents directly, both of which the malicious page is prevented from doing by the browser\'s same-origin policy, a forged request has no way to include the correct value alongside the cookie it can still automatically attach. The server then simply checks whether the submitted value and the cookie\'s value genuinely match — a forged request either omits this field entirely or includes an incorrect value, and either case is correctly rejected, even in a hypothetical scenario where SameSite protection alone might have been bypassed or was not configured.',
        aHi: 'Double-submit pattern jaan-boojhkar ek asli asymmetry par bharosa karta hai ki ek malicious cross-site page KYA KAR SAKTA HAI aur KYA NAHI KAR SAKTA. Ye sach mein victim ke browser ko trigger kar sakta hai asli application ke domain ko nishaana banaati ek request mein apne aap cookies attach karne ke liye, kyunki cookies default taur par bas isi tarah kaam karti hain — bilkul yehi kshamta hai jo is lesson ka pehla hissa exploit hote dikhaata hai. Halaanki, malicious page ke paas un cookies ki CONTENTS seedha padhne ka koi tarika nahi hai (browsers ki same-origin policy ek origin ke JavaScript ko doosre origin ki cookies, storage, ya DOM padhne se rokti hai), aur uske paas asli application ke apne page ko padhne ka koi tarika nahi hai — asli HTML, apne embedded hidden form field ke saath jismein khaas random CSRF token value hai jo legitimate page ne us session ke liye banaayi. Bachaav ye maangte hue kaam karta hai ki forge ki gayi request mein, aam submit ki gayi data ki tarah (ek form field ya header), ek token value shaamil ho jo bilkul us value se milni chahiye jo us session ke liye ek saath ek cookie mein store hui hai — kyunki ek legitimate page se ye value sahi tarike se paane ke liye ya to us page ki apni DOM padhni chahiye ya cookie ki asli contents seedha padhni chahiye, dono jinse malicious page ko browser ki same-origin policy dwara roka jaata hai, ek forge ki gayi request ke paas us cookie ke saath sahi value shaamil karne ka koi tarika nahi hai jise wo abhi bhi apne aap attach kar sakti hai. Server phir bas check karta hai ki kya submit ki gayi value aur cookie ki value sach mein milti hain — ek forge ki gayi request ya to is field ko poori tarah chhod deti hai ya ek galat value shaamil karti hai, aur dono cases sahi tarike se reject hote hain, ek kalpaniya scenario mein bhi jahan akele SameSite protection bypass ho gayi ho ya configure na ki gayi ho.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /account/email route with a session cookie set with no SameSite attribute. Build a simple, separate HTML file (served from a different port, simulating a different origin) with a hidden auto-submitting form targeting this route, and confirm it successfully changes a logged-in test user\'s email.',
        taskHi: 'Bina \`SameSite\` attribute ke set ki gayi ek session cookie ke saath toota \`/account/email\` route banao. Ek saadhi, alag HTML file banao (ek alag port se serve ki hui, ek alag origin simulate karte hue) ek chhupe hue auto-submitting form ke saath jo is route ko nishaana banaaye, aur confirm karo ye ek login-hue test user ki email safaltapoorvak badal deta hai.',
        hint: 'Open the malicious HTML file directly in the browser (as a separate tab) while your test user is still logged into the real app in another tab, to accurately simulate the real attack scenario.',
        hintHi: 'Malicious HTML file ko seedha browser mein kholo (ek alag tab ki tarah) jabki tumhaara test user abhi bhi ek doosre tab mein asli app mein login hai, asli attack scenario ko sahi tarike se simulate karne ke liye.',
      },
      {
        task: 'Set sameSite: "strict" on the session cookie at login. Repeat the exact same attack attempt and confirm the email is no longer changed, with the request correctly failing authentication.',
        taskHi: 'Login par session cookie par \`sameSite: "strict"\` set karo. Bilkul wahi attack koshish dohraao aur confirm karo email ab nahi badalti, request sahi tarike se authentication mein fail hoti hui.',
        hint: 'Use your browser\'s network tab to directly confirm whether the session cookie is or is not present in the request headers sent by the malicious page\'s form submission.',
        hintHi: 'Apne browser ka network tab istemal karo seedha confirm karne ke liye ki kya session cookie malicious page ke form submission se bheji request headers mein maujood hai ya nahi.',
      },
      {
        task: 'Implement the double-submit CSRF token pattern as an additional layer. Confirm a genuine request from the real application\'s own settings page (including the correct token) succeeds, while the forged request (which cannot include a valid token) is rejected even if you temporarily remove the SameSite attribute to test this layer in isolation.',
        taskHi: 'Double-submit CSRF token pattern ko ek additional layer ki tarah lagu karo. Confirm karo asli application ke apne settings page se ek asli request (sahi token sameet) safal hoti hai, jabki forge ki gayi request (jo ek valid token shaamil nahi kar sakti) reject hoti hai chahe tum is layer ko akele test karne ke liye asthaayi taur par \`SameSite\` attribute hataao.',
        hint: 'Temporarily removing SameSite specifically to test the CSRF token layer in isolation is a reasonable way to confirm each defense genuinely works independently of the other.',
        hintHi: 'Asthaayi taur par \`SameSite\` hataana khaas taur par CSRF token layer ko akele test karne ke liye har bachaav ko mustaqil taur par kaam karta confirm karne ka ek uchit tarika hai.',
      },
    ],

    keyTakeaways: [
      'CSRF exploits a browser automatically attaching cookies to any request to a given domain, regardless of which page triggered that request — a malicious page\'s hidden form can trigger a state-changing action without ever reading the response.',
      'CORS and CSRF are entirely separate concerns: CORS controls whether cross-origin JavaScript can read a response; it does nothing to stop a browser from sending a cookie-carrying cross-site request in the first place.',
      'The SameSite cookie attribute (set to "strict" or "lax") is the modern, primary defense — the browser itself withholds the cookie on cross-site requests, requiring no change to the route\'s own logic.',
      '"Strict" provides the strongest protection but breaks the "click a link, arrive still logged in" experience; "lax" preserves that experience while still blocking the form-submission and background-request patterns CSRF relies on.',
      'The double-submit CSRF token pattern provides a second, independent layer of defense: a malicious page cannot read the real page\'s DOM or non-httpOnly cookie contents to obtain the specific token value it would need to include.',
      'CSRF is specifically a cookie-based-authentication concern — a JWT sent via an Authorization header is never automatically attached by the browser, so a malicious page cannot forge a request carrying it without explicitly reading it first.',
    ],
    keyTakeawaysHi: [
      'CSRF ek browser ke apne aap kisi bhi diye domain ko har request ke saath cookies attach karne ka faayda uthaata hai, us request ko kis page ne trigger kiya us se bekhabar — ek malicious page ka chhupa hua form ek state-badalti action trigger kar sakta hai kabhi response padhe bina.',
      'CORS aur CSRF poori tarah alag chintaayen hain: CORS control karta hai ki kya cross-origin JavaScript ek response padh sakta hai; ye ek browser ko pehli jagah ek cookie-le-jaati cross-site request bhejne se rokne ke liye bilkul kuch nahi karta.',
      '\`SameSite\` cookie attribute (\`"strict"\` ya \`"lax"\` par set) modern, mukhya bachaav hai — browser khud cross-site requests par cookie rokta hai, route ki apni logic mein koi badlaav zaruri hue bina.',
      '\`"Strict"\` sabse mazboot protection deta hai par "ek link click karo, login hote hue pahuncho" anubhav todta hai; \`"lax"\` us anubhav ko surakshit rakhta hai jabki abhi bhi un form-submission aur background-request patterns ko block karta hai jin par CSRF bharosa karta hai.',
      'Double-submit CSRF token pattern bachaav ki ek doosri, mustaqil layer deta hai: ek malicious page asli page ki DOM ya non-httpOnly cookie contents nahi padh sakta us khaas token value paane ke liye jise use shaamil karna chahiye.',
      'CSRF khaas taur par ek cookie-based-authentication chinta hai — ek JWT jo ek \`Authorization\` header se bheja jaata hai browser dwara kabhi apne aap attach nahi hota, isliye ek malicious page ise le kar ek request forge nahi kar sakta pehle ise explicitly padhe bina.',
    ],
  },
];
