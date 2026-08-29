/**
 * React Complete Course — Module 6: Pro, lesson 12.
 *
 * Client-side environment variables are public. A developer, having
 * learned in a backend context that .env files keep secrets out of
 * source code, ports that exact same mental model to the frontend and
 * puts a genuine secret (a real, paid third-party API key) into a
 * VITE_-prefixed or REACT_APP_-prefixed environment variable, assuming
 * it stays hidden the same way a server-side .env value does. It does
 * not: build tools deliberately substitute every such variable directly
 * into the plain-text JavaScript bundle shipped to every visitor's
 * browser, at build time — anyone can view page source, inspect the
 * built bundle, or open DevTools and read the exact value in seconds.
 * Fixed by treating any client-exposed environment variable as fully
 * public by construction, reserving genuine secrets for the backend
 * exclusively, and having the frontend call its own backend endpoint for
 * any operation that genuinely requires a secret credential.
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

export const REACT_MODULE_6_PART12: CourseLesson[] = [
  {
    slug: 'client-env-vars-are-public',
    title: 'Client-Side Environment Variables Are Public',
    titleHi: 'Client-Side Environment Variables Public Hain',
    description: 'A "secret" third-party API key sits quietly in a .env file, prefixed with VITE_ exactly like the tutorial showed — and it has been fully, plainly readable by anyone who ever opened the browser\'s DevTools since the very first production deploy.',
    descriptionHi: 'Ek "secret" third-party API key chupchap ek \`.env\` file mein baithi hai, \`VITE_\` se prefix ki hui bilkul tutorial jaisa dikhaaya gaya tha — aur ye poori tarah, saaf taur par padhne-laayak rahi hai kisi ke liye bhi jisne kabhi browser ke DevTools khole hain bilkul pehle production deploy se hi.',
    difficulty: 'MEDIUM',
    duration: 16,
    order: 12,

    analogy: {
      en: '**A shop\'s storefront window display, where anything placed inside it is, by definition, visible to every single passerby on the street — versus the shop\'s back office, where only staff can actually go.** No shopkeeper places their cash register key or their safe\'s combination in the window display, no matter how far back in a dim corner of that window they tuck it, because the display case itself is a fundamentally public space — every square inch of it is meant to be looked at by anyone walking past, and "I put it in a corner nobody usually looks at" provides no real protection at all, since a curious or determined passerby can simply look more closely at any part of a window that is, by its very nature, on public display. Genuinely sensitive items belong in the back office instead — a space customers on the street have no access to at all, regardless of how they look or how long they stand there. A frontend build tool\'s "expose this environment variable to the client" mechanism is the storefront window: anything referenced this way gets placed directly into the bundle every visitor\'s browser downloads and can inspect, and the specific variable name used to opt into this exposure changes nothing about how visible the resulting value actually is, the same way naming a hiding spot in a display window does not make it any less part of the window. A backend server, reached only through its own defined API, is the back office: a genuine secret kept there is never placed somewhere the public can look at all, regardless of how the frontend asks for something that depends on it.',
      hi: '**Ek dukaan ki storefront window display, jahan usmein rakhi koi bhi cheez, definition se, sadak par har akele raahgir ko dikhti hai — versus dukaan ka back office, jahan sirf staff hi asal mein jaa sakta hai.** Koi bhi dukaandaar apni cash register ki chaabi ya apne safe ka combination window display mein nahi rakhta, chahe wo us window ke kitne bhi dhundhle kone mein use kyun na chhupaaye, kyunki display case khud buniyaadi taur par ek public jagah hai — iska har akela square inch kisi ke bhi dwara dekhe jaane ke liye hai jo guzarta hai, aur "maine ise ek aise kone mein rakha jahan aam taur par koi nahi dekhta" bilkul koi asli protection nahi deta, kyunki ek jigyaasu ya tay-shuda raahgir bas ek window ke kisi bhi hisse ko zyaada gaur se dekh sakta hai jo, apni prakriti se, public display par hai. Sach mein sanvedansheel cheezein iske bajaye back office mein rehni chahiye — ek jagah jahan sadak par customers ki koi access hi nahi hai, chahe wo kaise dekhein ya kitni der khade rahein. Ek frontend build tool ka "is environment variable ko client tak expose karo" mechanism storefront window hai: is tarike se reference ki gayi koi bhi cheez seedhe us bundle mein rakh di jaati hai jise har visitor ka browser download karta hai aur inspect kar sakta hai, aur is exposure ko opt-in karne ke liye istemal hui khaas variable naam ise kitna asal mein dikhta hai us baare mein kuch nahi badalti, bilkul usi tarah jaise ek display window mein ek chhupne ki jagah ka naam dena use window ka hissa hone se kam nahi banaata. Ek backend server, sirf apne define kiye API se pahuncha jaata hai, back office hai: ek asli secret jo wahaan rakha jaata hai kabhi wahaan nahi rakha jaata jahan public bilkul dekh sake, frontend chahe kaise bhi kisi cheez ki maang kare jo uspar nirbhar hai.',
    },

    simple: `**Start broken.** A real third-party API key placed in a client-exposed environment variable:

\`\`\`
# .env
VITE_PAYMENT_API_SECRET=sk_live_a1b2c3d4e5f6...
\`\`\`

\`\`\`jsx
async function chargeCard(amount) {
  return fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${import.meta.env.VITE_PAYMENT_API_SECRET}\` },
    body: JSON.stringify({ amount }),
  });
}
\`\`\`

This looks, on the surface, exactly like the backend \`.env\` pattern this course\'s Node.js curriculum teaches: put the real value in \`.env\`, gitignore that file, reference it through an environment variable in code. The critical difference this pattern misses entirely is WHERE the code referencing \`import.meta.env.VITE_PAYMENT_API_SECRET\` actually runs. A backend\'s \`process.env\` values stay on the server, in the server\'s own process memory, never sent anywhere. A Vite (or Create React App) project\'s client-exposed environment variables work completely differently: at build time, the build tool finds every reference to \`import.meta.env.VITE_*\` (or \`process.env.REACT_APP_*\`) in the code and substitutes the actual value directly into the plain-text JavaScript file that gets shipped to and downloaded by every single visitor\'s browser. The real payment provider secret key is not hidden at all — it sits in plain text inside a \`.js\` file anyone can view by opening the browser\'s DevTools, viewing the page\'s source, or simply downloading that JavaScript file directly, exactly as visible as any other string literal written directly into the code.

**The fix: keep the real secret on the backend, and have the frontend call your own API**

\`\`\`jsx
// Frontend: calls the app's OWN backend, which holds the real secret
async function chargeCard(amount) {
  return fetch("/api/charge", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ amount }),
  });
}
\`\`\`

\`\`\`js
// Backend (Node.js/Express) — the real secret lives here, and only here
app.post("/api/charge", requireAuth, async (req, res) => {
  const response = await fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.PAYMENT_API_SECRET}\` }, // server's own process.env
    body: JSON.stringify({ amount: req.body.amount }),
  });
  res.json(await response.json());
});
\`\`\`

The frontend never references the real secret at all — it calls the application\'s own backend endpoint, exactly like any other authenticated API call this course has covered. The backend, running entirely on a server nobody in the public can inspect the source or memory of, holds the real \`PAYMENT_API_SECRET\` in its own \`process.env\` (this course\'s Node.js curriculum\'s environment-variable lesson) and makes the actual authenticated call to the payment provider itself. The frontend gets back only whatever minimal result it genuinely needs (a confirmation, a charge ID) — the secret credential capable of charging arbitrary amounts never exists anywhere the browser, or anyone inspecting it, could ever read.`,

    simpleHi: `**Toote hue se shuru.** Ek asli third-party API key ek client-exposed environment variable mein rakhi gayi:

\`\`\`
# .env
VITE_PAYMENT_API_SECRET=sk_live_a1b2c3d4e5f6...
\`\`\`

\`\`\`jsx
async function chargeCard(amount) {
  return fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${import.meta.env.VITE_PAYMENT_API_SECRET}\` },
    body: JSON.stringify({ amount }),
  });
}
\`\`\`

Ye oopar se bilkul us backend \`.env\` pattern jaisa dikhta hai jo is course ka Node.js curriculum sikhaata hai: asli value \`.env\` mein daalo, us file ko gitignore karo, code mein ek environment variable ke zariye ise reference karo. Jo critical antar ye pattern poori tarah miss karta hai wo hai KAHAAN code jo \`import.meta.env.VITE_PAYMENT_API_SECRET\` reference karta hai asal mein chalta hai. Ek backend ki \`process.env\` values server par rehti hain, server ki apni process memory mein, kabhi kahin bheji nahi jaatin. Ek Vite (ya Create React App) project ke client-exposed environment variables poori tarah alag tarike se kaam karte hain: build time par, build tool code mein \`import.meta.env.VITE_*\` (ya \`process.env.REACT_APP_*\`) ke har reference ko dhoondta hai aur asli value ko seedhe us plain-text JavaScript file mein daal deta hai jo har akele visitor ke browser ko ship aur download ki jaati hai. Asli payment provider secret key bilkul chhupi hui nahi hai — ye plain text mein ek \`.js\` file ke andar baithi hai jise koi bhi browser ke DevTools kholkar, page ka source dekhkar, ya bas us JavaScript file ko seedhe download karke dekh sakta hai, bilkul utni hi dikhti hai jitna koi doosra string literal seedhe code mein likha gaya ho.

**Fix: asli secret ko backend par rakho, aur frontend ko apni khud ki API bulaane do**

\`\`\`jsx
// Frontend: app ki APNI backend ko bulaata hai, jo asli secret rakhti hai
async function chargeCard(amount) {
  return fetch("/api/charge", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ amount }),
  });
}
\`\`\`

\`\`\`js
// Backend (Node.js/Express) — asli secret yahaan rehta hai, aur sirf yahaan
app.post("/api/charge", requireAuth, async (req, res) => {
  const response = await fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.PAYMENT_API_SECRET}\` }, // server ka apna process.env
    body: JSON.stringify({ amount: req.body.amount }),
  });
  res.json(await response.json());
});
\`\`\`

Frontend asli secret ko kabhi bilkul reference hi nahi karta — ye application ki apni backend endpoint ko bulaata hai, bilkul kisi bhi doosri authenticated API call ki tarah jo is course ne cover ki hai. Backend, poori tarah ek aise server par chalte hue jiske source ya memory ko public mein koi bhi inspect nahi kar sakta, apni \`process.env\` mein asli \`PAYMENT_API_SECRET\` rakhta hai (is course ka Node.js curriculum ka environment-variable lesson) aur payment provider ko khud asli authenticated call banaata hai. Frontend ko wapas sirf itna hi milta hai jo ise asal mein chahiye (ek confirmation, ek charge ID) — manmaani raqam charge karne ke kaabil credential kahin bhi maujood nahi hoti jise browser, ya use inspect karta koi bhi, kabhi padh sake.`,

    content: `## Verifying it for yourself: grep the actual built bundle

\`\`\`bash
npm run build
grep -r "sk_live" dist/assets/*.js
# dist/assets/index-a1b2c3.js:...headers:{Authorization:\`Bearer sk_live_a1b2c3d4e5f6...\`}...
\`\`\`

The clearest way to internalize this is to actually look: after running a production build, the real secret string appears in plain text, unobfuscated and unencrypted, directly inside the built \`.js\` file sitting in the \`dist\` (or \`build\`) folder that gets uploaded to a hosting provider and downloaded by every visitor. This is not a theoretical risk that requires a sophisticated attacker or special tools to exploit — anyone with a web browser can open DevTools\' Network tab, find the loaded \`.js\` file, and either read it directly or run it through a formatter to make it more readable, and the value is right there, exactly as if it had been typed directly into the page\'s visible HTML.

## The prefix (VITE_ / REACT_APP_) is a build-tool filter, not a security boundary

\`\`\`
# .env — during local development and the build process
DATABASE_URL=postgres://...          ← used only by backend code, NEVER exposed to the client
VITE_API_BASE_URL=https://api.example ← this prefix means "expose this one to the client bundle"
\`\`\`

Vite (and, with a different prefix, Create React App) requires a specific prefix specifically so that OTHER environment variables — ones genuinely meant only for server-side or build-time use, like a database connection string used by a build script — do not accidentally leak into the client bundle by default. This is a real, useful safety mechanism, but it protects against a narrower problem than it might first appear to: it prevents ACCIDENTAL exposure of variables nobody meant to expose at all, but it provides absolutely no additional protection once a developer has deliberately used the required prefix on a variable. Placing a genuine secret behind the \`VITE_\` prefix does not partially protect it, or protect it "unless someone looks hard enough" — the prefix is purely an opt-in signal telling the build tool "yes, put this specific value directly into the public bundle," and once given that instruction, the build tool does exactly that with no further judgment about whether the value being exposed was actually meant to be a secret.

## Distinguishing genuinely public keys from genuine secrets

\`\`\`
Genuinely fine to expose to the client:
- A payment provider's PUBLISHABLE key (explicitly designed to be public,
  e.g. Stripe's pk_live_... key)
- A public analytics or error-tracking project ID
- A public API base URL

Never expose to the client:
- A payment provider's SECRET key (sk_live_...) — capable of directly
  charging cards or issuing refunds
- A database connection string or credential
- Any API key without built-in usage restrictions tied to the request's origin
\`\`\`

Not every credential is equally dangerous if exposed — some third-party services deliberately issue two distinct kinds of key specifically so one of them is safe to ship to a browser: a "publishable" key is explicitly designed by the provider to be embedded in public client-side code, restricted so it can only perform a narrow, safe set of actions (creating a payment intent, never directly charging or refunding), while the corresponding "secret" key can perform the powerful, dangerous operations and must never leave a trusted server. Recognizing which specific kind of key a service actually issued — checking its own documentation rather than assuming based on the variable\'s name — is essential before deciding whether it is safe to reference through a client-exposed environment variable at all.

## Some "public" keys still need additional restriction

\`\`\`
Google Maps API key, restricted in the provider's dashboard to:
- Only the app's actual production domain
- Only the specific Maps APIs the app actually uses
\`\`\`

Being safe to expose publicly does not always mean a key can be used entirely without restriction — a Google Maps browser API key, for instance, is explicitly designed to be embedded in client-side code, but an unrestricted one could still be copied from a competitor\'s or an unrelated site\'s bundle and used to rack up usage charges against the original owner\'s account. Providers that issue genuinely public client-side keys typically also offer dashboard settings restricting that key\'s use to specific domains (only requests originating from the app\'s own production URL) or specific APIs — configuring these restrictions is a separate, additional step worth taking even for a key that is otherwise safe to expose.`,

    contentHi: `## Khud ke liye ise verify karna: asli built bundle ko grep karo

\`\`\`bash
npm run build
grep -r "sk_live" dist/assets/*.js
# dist/assets/index-a1b2c3.js:...headers:{Authorization:\`Bearer sk_live_a1b2c3d4e5f6...\`}...
\`\`\`

Ise samajhne ka sabse saaf tarika asal mein dekhna hai: ek production build chalaane ke baad, asli secret string plain text mein, un-obfuscated aur un-encrypted, seedhe us built \`.js\` file ke andar dikhti hai jo \`dist\` (ya \`build\`) folder mein baithi hai jo ek hosting provider ko upload ki jaati hai aur har visitor dwara download ki jaati hai. Ye koi kalpaniya khatra nahi hai jise exploit karne ke liye ek sophisticated attacker ya khaas tools chahiye — koi bhi web browser waala DevTools ka Network tab khol sakta hai, loaded \`.js\` file dhoondh sakta hai, aur ise seedhe padh sakta hai ya ek formatter se guzaar kar zyaada padhne-laayak banaa sakta hai, aur value bilkul wahaan hai, bilkul jaise ye seedhe page ki dikhti HTML mein type ki gayi ho.

## Prefix (\`VITE_\` / \`REACT_APP_\`) ek build-tool filter hai, ek security boundary nahi

\`\`\`
# .env — local development aur build process ke dauraan
DATABASE_URL=postgres://...          ← sirf backend code istemal karta hai, kabhi client ko expose nahi
VITE_API_BASE_URL=https://api.example ← ye prefix matlab hai "ise client bundle ko expose karo"
\`\`\`

Vite (aur, ek alag prefix ke saath, Create React App) ko ek khaas prefix khaas taur par isliye chahiye taaki DOOSRI environment variables — wo jo sach mein sirf server-side ya build-time istemal ke liye hain, jaise ek build script dwara istemal ki jaati database connection string — by default client bundle mein galti se leak na ho jaayein. Ye ek asli, upyogi safety mechanism hai, par ye us se sankuchit ek samasya ke khilaaf surakshit karta hai jo pehli baar dikhta hai: ye un variables ke ANJAANE exposure ko rokta hai jinhe kisi ne bilkul expose karne ka iraada nahi kiya, par ye bilkul koi additional protection nahi deta ek baar ek developer ne jaan-boojhkar zaroori prefix ek variable par istemal kar liya. Ek asli secret ko \`VITE_\` prefix ke peeche rakhna ise aadhaa surakshit nahi karta, ya "jab tak koi kaafi gehraai se na dekhe" surakshit nahi karta — prefix shuddh roop se ek opt-in sanket hai jo build tool ko batata hai "haan, is khaas value ko seedhe public bundle mein daalo," aur ek baar wo nirdesh diye jaane par, build tool bilkul yahi karta hai koi aage ka faisla kiye bina ki expose ki jaa rahi value asal mein secret hone ke liye thi ya nahi.

## Sach mein public keys ko asli secrets se alag karna

\`\`\`
Client ko expose karne ke liye sach mein theek:
- Ek payment provider ki PUBLISHABLE key (explicitly public hone ke liye
  design ki gayi, jaise Stripe ki pk_live_... key)
- Ek public analytics ya error-tracking project ID
- Ek public API base URL

Client ko kabhi expose mat karo:
- Ek payment provider ki SECRET key (sk_live_...) — seedhe cards charge
  ya refunds issue karne ke kaabil
- Ek database connection string ya credential
- Koi bhi API key jismein request ke origin se judi built-in usage
  restrictions nahi hain
\`\`\`

Har credential samaan roop se khatarnaak nahi hai agar expose ho — kuch third-party services jaan-boojhkar do alag tarah ki keys jaari karti hain khaas taur par isliye taaki inmein se ek browser ko bhejna surakshit ho: ek "publishable" key provider dwara explicitly public client-side code mein embed karne ke liye design ki gayi hai, seemit ki gayi taaki ye sirf ek sankuchit, surakshit set of actions poori kar sake (ek payment intent banaana, kabhi seedhe charge ya refund nahi), jabki mutaalliq "secret" key shaktishaali, khatarnaak operations poori kar sakti hai aur ise kabhi ek bharosemand server se baahar nahi jaana chahiye. Ye pehchaanna ki ek service ne asal mein kis khaas tarah ki key jaari ki — variable ke naam ke aadhaar par maan lene ke bajaye uski apni documentation check karke — zaruri hai isse pehle faisla karne se ki kya ise ek client-exposed environment variable ke zariye bilkul reference karna surakshit hai.

## Kuch "public" keys ko phir bhi additional restriction chahiye

\`\`\`
Google Maps API key, provider ke dashboard mein seemit ki gayi:
- Sirf app ke asli production domain tak
- Sirf khaas Maps APIs tak jo app asal mein istemal karta hai
\`\`\`

Saarvajanik roop se expose karne ke liye surakshit hona hamesha ye matlab nahi rakhta ki ek key bilkul bina restriction ke istemal ki jaa sakti hai — ek Google Maps browser API key, misal ke taur par, explicitly client-side code mein embed karne ke liye design ki gayi hai, par ek unrestricted key phir bhi ek pratispardhi ya ek na-jude site ke bundle se copy ki jaa sakti hai aur asli maalik ke account ke khilaaf usage charges badhaane ke liye istemal ki jaa sakti hai. Providers jo sach mein public client-side keys jaari karte hain aam taur par dashboard settings bhi dete hain jo us key ke istemal ko khaas domains (sirf app ke apne production URL se aati requests) ya khaas APIs tak seemit karti hain — in restrictions ko configure karna ek alag, additional step hai jo uthaane ke laayak hai ek aisi key ke liye bhi jo iske alaawa expose karna surakshit hai.`,

    examples: [
      {
        title: 'Broken: a real secret key exposed via VITE_, visible in the build',
        titleHi: 'Toota: \`VITE_\` ke zariye expose ki gayi ek asli secret key, build mein dikhti hui',
        code: `// .env
VITE_PAYMENT_API_SECRET=sk_live_a1b2c3d4e5f6...

// component.jsx
fetch(url, { headers: { Authorization: \`Bearer \${import.meta.env.VITE_PAYMENT_API_SECRET}\` } });`,
        codeJs: `// .env
VITE_PAYMENT_API_SECRET=sk_live_a1b2c3d4e5f6...

// PaymentForm.jsx
async function chargeCard(amount) {
  return fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${import.meta.env.VITE_PAYMENT_API_SECRET}\` },
    body: JSON.stringify({ amount }),
  });
}
// after "npm run build", this exact secret string appears in plain
// text inside the built .js file shipped to every visitor's browser`,
        codeTs: `// .env
VITE_PAYMENT_API_SECRET=sk_live_a1b2c3d4e5f6...

// PaymentForm.tsx
async function chargeCard(amount: number): Promise<Response> {
  return fetch("https://payment-provider.example/charge", {
    method: "POST",
    headers: { Authorization: \`Bearer \${import.meta.env.VITE_PAYMENT_API_SECRET}\` },
    body: JSON.stringify({ amount }),
  });
}
// TypeScript does not catch this — import.meta.env.VITE_PAYMENT_API_SECRET
// is correctly typed as a string. This is a security practice issue,
// entirely outside what a type checker can catch.`,
        output: `The app works correctly in development and appears to work in
production. Anyone opening DevTools' Network tab, or simply viewing
the downloaded .js file, can read the real secret key in plain text.`,
        explain: 'Build tools substitute every client-exposed environment variable directly into the plain-text JavaScript bundle at build time — there is no hiding, obfuscation, or encryption involved at all.',
        explainHi: 'Build tools har client-exposed environment variable ko seedhe plain-text JavaScript bundle mein build time par daal dete hain — ismein koi chhupaana, obfuscation, ya encryption bilkul shaamil nahi hai.',
      },
      {
        title: 'Fixed: the real secret stays on the backend, the frontend calls its own API',
        titleHi: 'Theek: asli secret backend par rehti hai, frontend apni khud ki API bulaata hai',
        code: `// Frontend
fetch("/api/charge", { method: "POST", credentials: "include", body: JSON.stringify({ amount }) });

// Backend
Authorization: \`Bearer \${process.env.PAYMENT_API_SECRET}\``,
        codeJs: `// Frontend — PaymentForm.jsx
async function chargeCard(amount) {
  return fetch("/api/charge", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ amount }),
  });
}

// Backend — Express route (this course's Node.js curriculum)
app.post("/api/charge", requireAuth, async (req, res, next) => {
  try {
    const response = await fetch("https://payment-provider.example/charge", {
      method: "POST",
      headers: { Authorization: \`Bearer \${process.env.PAYMENT_API_SECRET}\` },
      body: JSON.stringify({ amount: req.body.amount }),
    });
    res.json(await response.json());
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `// Frontend — PaymentForm.tsx
async function chargeCard(amount: number): Promise<Response> {
  return fetch("/api/charge", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ amount }),
  });
}

// Backend — Express route
app.post("/api/charge", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await fetch("https://payment-provider.example/charge", {
      method: "POST",
      headers: { Authorization: \`Bearer \${process.env.PAYMENT_API_SECRET}\` },
      body: JSON.stringify({ amount: req.body.amount }),
    });
    res.json(await response.json());
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `The built frontend bundle contains no reference to the real secret
at all — grepping it for the key finds nothing, since the key only
ever exists in the backend server's own process.env.`,
        outputTs: `// Identical behaviour. The frontend's own TypeScript code has no
// variable or import referencing the secret anywhere in its source,
// let alone its build output.`,
        explain: 'The frontend and backend now have clearly separated responsibilities: the frontend requests an action, and the backend, running somewhere the public cannot inspect, is the only place the real credential is ever used.',
        explainHi: 'Frontend aur backend ke ab saaf taur par alag zimmedariyaan hain: frontend ek action maangta hai, aur backend, kahin chalte hue jise public inspect nahi kar sakta, ekmatra jagah hai jahan asli credential kabhi istemal hoti hai.',
      },
      {
        title: 'A genuinely public key, appropriate to expose to the client',
        titleHi: 'Ek sach mein public key, client ko expose karne ke liye upyukt',
        code: `// .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_a1b2c3...
// this specific key is explicitly designed by Stripe to be public`,
        codeJs: `// .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_a1b2c3d4e5f6...

// CheckoutForm.jsx
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// Stripe's own documentation explicitly states this key is meant to
// be embedded in public client-side code`,
        codeTs: `// .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_a1b2c3d4e5f6...

// CheckoutForm.tsx
import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);`,
        outputJs: `This key genuinely appearing in the built bundle is expected and
safe — Stripe's own publishable key is designed to be restricted to
narrow, non-destructive actions even if anyone reads it.`,
        outputTs: `// Identical behaviour. "Stripe | null" correctly types the possible
// failure case where Stripe.js itself fails to load in the browser.`,
        explain: 'The distinction is not the environment-variable mechanism itself, which behaves identically either way — it is whether the specific key being exposed was actually designed by its provider to be safe for public use.',
        explainHi: 'Antar environment-variable mechanism mein nahi hai, jo dono tarah se identical vyavhaar karta hai — ye is baat mein hai ki kya expose ki jaa rahi khaas key ko uske provider ne asal mein public istemal ke liye surakshit hone ke liye design kiya tha.',
      },
    ],

    mistakes: [
      {
        wrong: `VITE_PAYMENT_API_SECRET=sk_live_...
// a genuine secret key, exposed to the client bundle`,
        right: `// The real secret stays in the backend's own .env, referenced via
// process.env — never given a VITE_/REACT_APP_ prefix at all
PAYMENT_API_SECRET=sk_live_...`,
        why: 'Any value referenced through a client-exposed environment variable gets substituted directly into the public JavaScript bundle — a genuine secret must never be given the prefix that exposes it this way.',
        whyHi: 'Ek client-exposed environment variable ke zariye reference ki gayi koi bhi value seedhe public JavaScript bundle mein daal di jaati hai — ek asli secret ko kabhi wo prefix nahi diya jaana chahiye jo ise is tarike se expose karta hai.',
      },
      {
        wrong: `VITE_ADMIN_API_KEY=super-secret-value
// "it's in a corner of the .env file, nobody will notice this specific one"`,
        right: `// There is no "hidden corner" — every VITE_/REACT_APP_ prefixed
// variable is equally, fully exposed in the built bundle`,
        why: 'Assuming a specific variable somehow stays less visible than others because of how it\'s named or where it sits in the file provides no actual protection — every client-exposed variable is equally readable.',
        whyHi: 'Ye maan lena ki ek khaas variable kisi tarah doosron se kam dikhti hai iske naam ya file mein sthiti ki wajah se koi asli protection nahi deta — har client-exposed variable samaan roop se padhne-laayak hai.',
      },
      {
        wrong: `// Using an unrestricted "public" API key with no domain restriction configured
VITE_MAPS_API_KEY=AIzaSy... // works from any domain, including a copy on someone else's site`,
        right: `// Same key, but restricted in the provider's dashboard to only the
// app's actual production domain and only the specific APIs it uses`,
        why: 'A key genuinely designed to be public can still be misused if left unrestricted — anyone copying it from the bundle can use it from their own site, running up usage charges against the original owner.',
        whyHi: 'Ek key jo sach mein public hone ke liye design ki gayi hai phir bhi galat istemal ki jaa sakti hai agar unrestricted chhodi jaaye — koi bhi ise bundle se copy karke apni site se istemal kar sakta hai, asli maalik ke khilaaf usage charges badhaate hue.',
      },
    ],

    realWorld: [
      {
        en: '**Vite\'s own official documentation explicitly and prominently warns that any variable prefixed VITE_ is exposed to client-side code and should never hold sensitive information**, the same warning Create React App issues for its own REACT_APP_ prefix.',
        hi: '**Vite ki apni official documentation explicitly aur prominently chetaavni deti hai ki koi bhi \`VITE_\`-prefixed variable client-side code ko expose hoti hai aur ise kabhi sanvedansheel jaankaari nahi rakhni chahiye**, wahi chetaavni jo Create React App apne \`REACT_APP_\` prefix ke liye deta hai.',
      },
      {
        en: '**Real, publicly documented incidents of accidentally exposed API keys in production JavaScript bundles have led to unexpected charges, quota exhaustion, and unauthorized use** at companies of every size, precisely because this specific mistake is so easy to make while porting backend conventions to a frontend context.',
        hi: '**Production JavaScript bundles mein galti se expose hui API keys ki asli, saarvajanik roop se documented incidents ne anapekshit charges, quota khatam hona, aur anadhikrit istemal ki taraf le jaaya hai** har size ki companies mein, bilkul isliye kyunki backend conventions ko ek frontend context mein le jaate waqt ye khaas galti itni aasaan hai karna.',
      },
      {
        en: '**Payment providers like Stripe deliberately issue separate "publishable" and "secret" keys specifically to make this exact mistake harder to make by accident**, a design pattern many other API providers have since adopted for the same reason.',
        hi: '**Stripe jaisi payment providers jaan-boojhkar alag "publishable" aur "secret" keys jaari karti hain khaas taur par isliye taaki bilkul yahi galti galti se karna mushkil ho**, ek design pattern jise kai doosri API providers ne isi wajah se apnaaya hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a value referenced through import.meta.env.VITE_SOMETHING or process.env.REACT_APP_SOMETHING end up fully readable by anyone, when the exact same .env-based pattern keeps a value hidden on a Node.js backend?',
        qHi: 'Ek value jo \`import.meta.env.VITE_SOMETHING\` ya \`process.env.REACT_APP_SOMETHING\` ke zariye reference ki jaati hai kisi ke liye bhi poori tarah padhne-laayak kyun ban jaati hai, jab bilkul wahi \`.env\`-aadhaarit pattern ek Node.js backend par ek value ko chhupaa kar rakhta hai?',
        a: 'On a Node.js backend, process.env.SOME_VARIABLE is read at runtime, directly by code executing inside the server\'s own process, on a machine the public has no direct access to at all — the value never leaves that server\'s memory unless the server\'s own code deliberately sends it somewhere, and the server\'s source code itself, including whichever line reads that environment variable, is also never transmitted to anyone; only whatever specific response the server\'s code chooses to send back reaches a client. A frontend built with Vite, Create React App, or a similar tool works through a fundamentally different mechanism: rather than the environment variable being read at runtime by code running somewhere private, the BUILD TOOL itself, running once during the build process, scans through the actual source code, finds every reference to a client-exposed environment variable, and literally replaces that reference with the real value, producing a plain JavaScript file with the actual value baked directly into its text. That resulting file is not executed somewhere private at all — it is the literal file uploaded to a hosting provider and downloaded, in its entirety, by every single visitor\'s browser, exactly the same file for every visitor, containing exactly the same substituted values for everyone. This means the meaningful distinction is not about which language or environment-variable mechanism is being used at a syntactic level, but about WHERE the code that reads the variable actually executes and who has access to that execution context: backend code executes somewhere private and only ever sends back deliberately chosen responses, while a client-exposed environment variable becomes part of a file the code\'s own execution context is, by definition, the requesting user\'s own browser.',
        aHi: 'Ek Node.js backend par, \`process.env.SOME_VARIABLE\` runtime par padha jaata hai, seedhe server ki apni process ke andar chalte code dwara, ek aisi machine par jise public ki koi seedhi access hi nahi hai — value us server ki memory se kabhi baahar nahi jaati jab tak server ka apna code jaan-boojhkar ise kahin na bheje, aur server ka apna source code khud, jis line ne wo environment variable padhi ho use sameet, bhi kabhi kisi ko transmit nahi kiya jaata; sirf jo bhi khaas response server ka code wapas bhejne ka chunaav karta hai wo ek client tak pahunchta hai. Vite, Create React App, ya isi tarah ke tool se banaaya ek frontend ek buniyaadi taur par alag mechanism se kaam karta hai: environment variable ke runtime par kahin private chalte code dwara padhe jaane ke bajaye, BUILD TOOL khud, build process ke dauraan ek baar chalte hue, asli source code ko scan karta hai, ek client-exposed environment variable ke har reference ko dhoondta hai, aur literally us reference ko asli value se badal deta hai, ek saadhi JavaScript file paida karte hue jismein asli value seedhe uske text mein pakki hui hai. Wo natijaa file kahin private chali hi nahi jaati — ye wahi literal file hai jo ek hosting provider ko upload ki jaati hai aur, poori tarah, har akele visitor ke browser dwara download ki jaati hai, har visitor ke liye bilkul wahi file, sabke liye bilkul wahi substituted values rakhte hue. Iska matlab hai maayne-rakhta antar us baare mein nahi hai ki syntactic star par kaunsi language ya environment-variable mechanism istemal ho rahi hai, balki is baat mein hai ki variable padhta code ASAL MEIN KAHAAN execute hota hai aur us execution context tak kiski access hai: backend code kahin private execute hota hai aur sirf jaan-boojhkar chune gaye responses wapas bhejta hai, jabki ek client-exposed environment variable ek file ka hissa ban jaati hai jiska code ka apna execution context, definition se, maang karte user ka apna browser hai.',
      },
      {
        q: 'Why does the VITE_/REACT_APP_ prefix requirement not provide any meaningful security protection, even though it exists specifically to control which variables are exposed?',
        qHi: '\`VITE_\`/\`REACT_APP_\` prefix zaroorat koi maayne-rakhta security protection kyun nahi deti, chahe ye khaas taur par ise control karne ke liye maujood hai ki kaunsi variables expose hoti hain?',
        a: 'The prefix requirement genuinely solves a real, distinct problem: without it, EVERY environment variable defined anywhere, including ones a developer only ever intended for build-time or server-side use (a database connection string used by a build script, a deployment API token), would risk being accidentally swept into the client bundle by a build tool that could not otherwise distinguish "meant for the client" from "meant to stay private." Requiring an explicit, deliberate prefix means a developer must actively opt a specific variable into client exposure, which correctly prevents ACCIDENTAL leakage of variables nobody meant to expose in the first place. However, this mechanism provides absolutely no protection once a developer has deliberately applied that prefix to a variable, regardless of whether that specific variable genuinely should have been exposed or not — the build tool has no way to know or judge whether the value behind VITE_PAYMENT_SECRET is a genuine secret that should never leave the server or a genuinely public value like an API base URL; it simply does exactly what the prefix instructs, substituting the value into the public bundle unconditionally. This means the prefix functions purely as an opt-in signal controlling WHICH variables get this treatment, with zero judgment about whether a given variable\'s actual contents were safe to expose this way — the responsibility for that judgment rests entirely on the developer choosing which variables to prefix, not on any protection the prefix mechanism itself provides.',
        aHi: 'Prefix zaroorat sach mein ek asli, alag samasya sulajhaati hai: iske bina, kahin bhi define ki gayi HAR environment variable, jinhe ek developer ne sirf build-time ya server-side istemal ke liye banaaya tha (ek build script dwara istemal ki jaati database connection string, ek deployment API token), ek build tool dwara galti se client bundle mein bahaayi jaane ka khatra uthaayegi jo iske alaawa "client ke liye" ko "private rehne ke liye" se alag nahi kar sakta. Ek explicit, jaan-boojhkar prefix ki maang karna matlab hai ek developer ko saqriya taur par ek khaas variable ko client exposure mein opt karna hoga, jo sahi tarike se un variables ke ANJAANE leak ko rokta hai jinhe kisi ne bilkul expose karne ka iraada nahi kiya tha. Halaanki, ye mechanism bilkul koi protection nahi deta ek baar ek developer ne jaan-boojhkar wo prefix ek variable par lagu kar diya, chahe wo khaas variable sach mein expose hona chahiye tha ya nahi — build tool ke paas jaanne ya faisla karne ka koi tarika nahi hai ki \`VITE_PAYMENT_SECRET\` ke peeche ki value ek asli secret hai jo kabhi server se baahar nahi jaani chahiye ya ek sach mein public value hai jaise ek API base URL; ye bas bilkul wahi karta hai jo prefix nirdesh deta hai, value ko bina-shart public bundle mein daalte hue. Iska matlab hai prefix shuddh roop se ek opt-in sanket ki tarah kaam karta hai jo niyantrit karta hai KAUNSI variables ko ye treatment milta hai, is baat par bilkul koi faisla bina ki ek diyi gayi variable ki asli contents is tarike se expose karna surakshit thin ya nahi — us faisle ki zimmedaari poori tarah us developer par hai jo chunta hai kaunsi variables ko prefix karna hai, khud prefix mechanism dwara diye gaye kisi protection par nahi.',
      },
      {
        q: 'Why do some third-party services deliberately issue two separate kinds of API key, and how should a developer decide which kind is safe to reference through a client-exposed environment variable?',
        qHi: 'Kuch third-party services jaan-boojhkar do alag tarah ki API keys kyun jaari karti hain, aur ek developer ko kaise faisla karna chahiye ki kaunsi tarah client-exposed environment variable ke zariye reference karna surakshit hai?',
        a: 'A significant number of services that expect to be integrated with directly from client-side code recognize that some meaningful fraction of their customers will, inevitably, expose whatever key is used in their frontend code, whether deliberately or through exactly the kind of mistake this lesson describes. Rather than simply warning against this and hoping every customer avoids the mistake perfectly, some providers address it more robustly by issuing two categorically different keys with genuinely different capabilities: a "publishable" (or similarly named "public") key is deliberately restricted, often by the provider\'s own backend systems, to only perform a narrow set of actions considered safe even if anyone in the world could see and use that specific key value, while a separate "secret" key retains full, unrestricted capability and is intended to only ever be used from a trusted backend server the provider assumes is not publicly readable. Because this distinction is a genuine, deliberate design decision made by each specific provider, a developer cannot safely assume based purely on a key\'s name, its prefix, or a general intuition about how sensitive it feels which category a given key falls into — the only reliable way to know is checking that specific provider\'s own documentation for explicit language describing which of their keys are safe for client-side use and which are not. Once that distinction is confirmed for the specific service being integrated with, only a key genuinely documented as safe for public, client-side use should ever be referenced through a client-exposed environment variable; anything documented as a secret, admin, or server-side-only key must be kept exclusively on the backend, with the frontend calling the application\'s own API for any operation that depends on it.',
        aHi: 'Kaafi tadaad ki services jo seedhe client-side code se integrate hone ki umeed rakhti hain ye pehchaanti hain ki unke kuch maayne-rakhta hissa customers, avashyambhaavi roop se, apni frontend code mein istemal hoti jo bhi key hai use expose karenge, chahe jaan-boojhkar ho ya bilkul isi tarah ki galti se jo ye lesson darsata hai. Iske bajaye bas iske khilaaf chetaavni dene aur ye umeed karne ke ki har customer galti ko poori tarah avoid kare, kuch providers ise zyaada mazbooti se sambodhit karte hain do categorically alag keys jaari karke sach mein alag kshamtaon ke saath: ek "publishable" (ya isi tarah naam diya "public") key jaan-boojhkar seemit hai, aksar provider ke apne backend systems dwara, sirf ek sankuchit set of actions poora karne ke liye jinhe surakshit maana jaata hai chahe duniya mein koi bhi wo khaas key value dekh aur istemal kar sake, jabki ek alag "secret" key poori, na-seemit kshamta rakhti hai aur sirf kabhi ek bharosemand backend server se istemal hone ke liye hai jise provider maanta hai ki public roop se padhne-laayak nahi hai. Kyunki ye antar har khaas provider dwara liya gaya ek asli, jaan-boojhkar design faisla hai, ek developer safe taur par ye maan nahi sakta shuddh roop se ek key ke naam, uske prefix, ya ye kitni sanvedansheel mehsoos hoti hai iske baare mein ek aam intuition ke aadhaar par ki ek diyi gayi key kaunsi category mein aati hai — jaanne ka ekmatra bharosemand tarika us khaas provider ki apni documentation check karna hai explicit bhaasha ke liye jo darsati hai ki unki kaunsi keys client-side istemal ke liye surakshit hain aur kaunsi nahi. Ek baar wo antar us khaas service ke liye confirm ho jaaye jise integrate kiya jaa raha hai, sirf ek key jo sach mein public, client-side istemal ke liye surakshit documented hai use kabhi client-exposed environment variable ke zariye reference kiya jaana chahiye; secret, admin, ya server-side-hi key ki tarah documented kuch bhi poori tarah backend par rakha jaana chahiye, frontend ke iske uspar nirbhar kisi bhi operation ke liye application ki apni API bulaate hue.',
      },
    ],

    exercises: [
      {
        task: 'Create a Vite project with a fake "secret" value in a VITE_-prefixed environment variable, referenced in a component. Run a production build, then grep the built output for the fake secret value to confirm it appears in plain text.',
        taskHi: 'Ek Vite project banao ek nakli "secret" value ke saath ek \`VITE_\`-prefixed environment variable mein, ek component mein reference ki hui. Ek production build chalaao, phir built output ko nakli secret value ke liye grep karo confirm karne ke liye ki ye plain text mein dikhti hai.',
        hint: 'Use a distinctive, easy-to-search fake value like "THIS-IS-A-TEST-SECRET-12345" so it is unmistakable when you find it in the built files.',
        hintHi: 'Ek distinctive, aasaani-se-dhoondh-jaane-laayak nakli value istemal karo jaise "THIS-IS-A-TEST-SECRET-12345" taaki ye bilkul saaf ho jab tum ise built files mein paao.',
      },
      {
        task: 'Refactor the component to instead call a mock backend endpoint that holds the fake secret in its own process.env. Rebuild the frontend and confirm the fake secret no longer appears anywhere in the built output.',
        taskHi: 'Component ko refactor karo iske bajaye ek mock backend endpoint bulaane ke liye jo nakli secret ko apni khud ki \`process.env\` mein rakhta hai. Frontend ko dobara build karo aur confirm karo ki nakli secret ab built output mein kahin bhi nahi dikhta.',
        hint: 'A simple Express route that just logs whatever it receives is enough to demonstrate the frontend no longer needs the secret directly.',
        hintHi: 'Ek saadha Express route jo bas jo bhi paata hai use log karta hai ye dikhaane ke liye kaafi hai ki frontend ko ab seedhe secret ki zaroorat nahi hai.',
      },
      {
        task: 'Research one real payment provider\'s documentation (Stripe, or a similar service) and identify exactly which of their keys are documented as safe for client-side use versus which must stay server-side only.',
        taskHi: 'Ek asli payment provider ki documentation research karo (Stripe, ya isi tarah ki koi service) aur bilkul pehchaano ki unki kaunsi keys client-side istemal ke liye surakshit documented hain versus kaunsi sirf server-side rehni chahiye.',
        hint: 'Look specifically for the words "publishable" and "secret" in the provider\'s own API keys documentation page.',
        hintHi: 'Provider ke apne API keys documentation page mein khaas taur par "publishable" aur "secret" shabdon ko dhoondho.',
      },
    ],

    keyTakeaways: [
      'Any value referenced through import.meta.env.VITE_* (Vite) or process.env.REACT_APP_* (Create React App) gets substituted directly into the plain-text JavaScript bundle at build time — it is fully public, not hidden.',
      'A backend\'s .env values stay on the server and are never transmitted; a frontend build tool\'s client-exposed variables become part of the literal file every visitor\'s browser downloads — the two mechanisms only look similar syntactically.',
      'The VITE_/REACT_APP_ prefix requirement prevents accidental exposure of variables nobody meant to expose, but provides zero protection once a developer deliberately applies it to a genuine secret.',
      'Genuine secrets (a payment provider\'s secret key, a database credential) must live only in the backend\'s own environment, with the frontend calling the application\'s own API for any operation that depends on them.',
      'Some services deliberately issue a separate "publishable" key restricted to safe actions specifically so it can be exposed client-side — checking the provider\'s own documentation is the only reliable way to know which kind a given key is.',
      'Even a genuinely public key can still be misused if left unrestricted — configuring domain or API restrictions in the provider\'s dashboard is a worthwhile additional step even for keys safe to expose.',
    ],
    keyTakeawaysHi: [
      '\`import.meta.env.VITE_*\` (Vite) ya \`process.env.REACT_APP_*\` (Create React App) ke zariye reference ki gayi koi bhi value build time par seedhe plain-text JavaScript bundle mein daal di jaati hai — ye poori tarah public hai, chhupi hui nahi.',
      'Ek backend ki \`.env\` values server par rehti hain aur kabhi transmit nahi hoti; ek frontend build tool ki client-exposed variables us literal file ka hissa ban jaati hain jise har visitor ka browser download karta hai — dono mechanisms sirf syntactically milte-julte dikhte hain.',
      '\`VITE_\`/\`REACT_APP_\` prefix zaroorat un variables ke anjaane exposure ko rokti hai jinhe kisi ne expose karne ka iraada nahi kiya, par ek baar ek developer jaan-boojhkar ise ek asli secret par lagu karta hai to bilkul koi protection nahi deti.',
      'Asli secrets (ek payment provider ki secret key, ek database credential) ko sirf backend ke apne environment mein rehna chahiye, frontend inpar nirbhar kisi bhi operation ke liye application ki apni API bulaate hue.',
      'Kuch services jaan-boojhkar ek alag "publishable" key jaari karti hain jo surakshit actions tak seemit hai khaas taur par isliye taaki ise client-side expose kiya jaa sake — provider ki apni documentation check karna ekmatra bharosemand tarika hai ye jaanne ka ki ek diyi gayi key kaunsi tarah ki hai.',
      'Ek sach mein public key bhi phir bhi galat istemal ki jaa sakti hai agar unrestricted chhodi jaaye — provider ke dashboard mein domain ya API restrictions configure karna un keys ke liye bhi ek keemti additional step hai jo expose karna surakshit hain.',
    ],
  },
];
