/**
 * Next.js Complete Course — Module 10: Payments with Stripe, lessons 1-3.
 *
 * Lesson 1: Checkout Sessions and why you never touch card numbers yourself.
 * Lesson 2: Webhooks, signature verification, and why the raw body matters.
 * Lesson 3: Subscriptions, the billing portal, idempotency, and going live.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-stripe-checkout-sessions',
    title: 'Checkout Sessions & Why You Never Touch Card Numbers',
    titleHi: 'Checkout Sessions Aur Card Numbers Ko Kabhi Touch Kyun Nahi Karna',
    description:
      "Stripe Checkout is a page Stripe itself hosts and controls — your server creates a session describing what's being purchased, redirects the customer to Stripe's own page to enter card details, and never sees or handles the actual card number at any point. This isn't just convenient; it's what keeps your application out of the most burdensome compliance requirements entirely.",
    descriptionHi:
      'Stripe Checkout ek page hai jise Stripe khud host aur control karta hai — aapka server ek session banata hai jo describe karta hai ki kya purchase ho raha hai, customer ko Stripe ke apne page pe redirect karta hai card details enter karne ke liye, aur kabhi bhi actual card number ko dekhta ya handle nahi karta. Ye sirf convenient nahi hai; ye wahi hai jo aapki application ko sabse burdensome compliance requirements se poori tarah bahar rakhta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A valet parking service versus personally holding onto a customer's car keys and driving their car yourself.** A valet stand hands the actual driving and key-holding to trained, insured, dedicated staff — the restaurant never touches the mechanics of parking a car, and isn't liable for a scratch caused by inexperienced handling. Stripe Checkout is the valet stand for payment: Stripe's own hosted page handles the actual sensitive work of collecting a card number, and your application never has to become an expert (or liable party) in handling that sensitive data directly — you just tell Stripe what's being purchased and let their page do the collecting.",
      hi: 'Ek valet parking service versus personally ek customer ki car keys hold karna aur unki car khud drive karna. Ek valet stand actual driving aur key-holding ko trained, insured, dedicated staff ko de deta hai — restaurant kabhi car park karne ki mechanics ko touch nahi karta, aur inexperienced handling se hue ek scratch ke liye liable nahi hai. Stripe Checkout payment ke liye valet stand hai: Stripe ka apna hosted page card number collect karne ke actual sensitive kaam ko handle karta hai, aur aapki application ko us sensitive data ko directly handle karne mein kabhi expert (ya liable party) banana nahi padta — aap bas Stripe ko batate ho ki kya purchase ho raha hai aur unke page ko collect karne dete ho.',
    },

    simple: `**The flow, end to end: your server never sees a card number at any
point:**

\`\`\`
1. Customer clicks "Buy" on YOUR page
2. YOUR server creates a Stripe Checkout Session, describing what's
   being purchased (which product, what price, success/cancel URLs)
3. YOUR server redirects the customer to the URL Stripe returns —
   Stripe's OWN hosted page, not anything you built
4. Customer enters their card details on STRIPE's page — this data
   goes directly to Stripe, never through your server at all
5. Stripe redirects back to your "success" URL once payment completes
\`\`\`

\`\`\`ts
// app/actions.ts — creating the Checkout Session
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cart\`,
  });
  return session.url; // redirect the customer here — this IS Stripe's page
}
\`\`\`

\`\`\`tsx
// The button that kicks off the flow
'use client';
export function BuyButton({ priceId }: { priceId: string }) {
  async function handleClick() {
    const url = await createCheckoutSession(priceId);
    window.location.href = url; // off to Stripe's own hosted page
  }
  return <button onClick={handleClick}>Buy Now</button>;
}
\`\`\`

**Why this specific division of labor matters so much — PCI DSS scope:**
PCI DSS is a mandatory security standard for anyone handling card data
directly, and its requirements (network segmentation, specific encryption
standards, regular security audits) are genuinely heavy for a typical
small team. By never having a card number pass through your server at
all — Stripe's hosted Checkout page collects it directly — the vast
majority of that compliance burden simply doesn't apply to you; Stripe
carries it instead, since they're the ones actually handling the data.`,

    simpleHi: `**Flow, end to end: aapka server kabhi bhi kisi bhi point pe ek card
number nahi dekhta:**

\`\`\`
1. Customer AAPKE page pe "Buy" click karta hai
2. AAPKA server ek Stripe Checkout Session banata hai, describe karte
   hue ki kya purchase ho raha hai (kaunsa product, kya price,
   success/cancel URLs)
3. AAPKA server customer ko us URL pe redirect karta hai jo Stripe
   return karta hai — Stripe ka APNA hosted page, aapne kuch nahi banaya
4. Customer STRIPE ke page pe apne card details enter karta hai — ye
   data directly Stripe tak jata hai, aapke server se bilkul nahi guzarta
5. Stripe payment complete hone par aapke "success" URL pe wapas
   redirect karta hai
\`\`\`

\`\`\`ts
// app/actions.ts — Checkout Session banana
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cart\`,
  });
  return session.url; // customer ko yahan redirect karo — ye Stripe ka page HAI
}
\`\`\`

\`\`\`tsx
// Wo button jo flow shuru karta hai
'use client';
export function BuyButton({ priceId }: { priceId: string }) {
  async function handleClick() {
    const url = await createCheckoutSession(priceId);
    window.location.href = url; // Stripe ke apne hosted page ki taraf
  }
  return <button onClick={handleClick}>Buy Now</button>;
}
\`\`\`

**Ye specific division of labor itna kyun matter karta hai — PCI DSS
scope:** PCI DSS ek mandatory security standard hai kisi ke bhi liye jo
card data ko directly handle karta hai, aur iski requirements (network
segmentation, specific encryption standards, regular security audits) ek
typical chhoti team ke liye genuinely heavy hain. Ek card number ko kabhi
bhi aapke server se pass na hone dete hue — Stripe ka hosted Checkout page
ise directly collect karta hai — us compliance burden ka vast majority
simply aap pe apply hi nahi hota; Stripe uski jagah use carry karta hai,
kyunki wo hi hain jo actually data handle kar rahe hain.`,

    content: `## Why "we'll just build our own payment form" is almost always the
wrong instinct

Building a custom card-entry form feels achievable — it's just an HTML
form and an API call. The actual difficulty isn't the form itself; it's
everything downstream of collecting that number: secure storage or
immediate secure transmission, PCI DSS compliance (a real, audited
standard, not a suggestion), and liability for a breach if any of that is
done incorrectly. Stripe's hosted Checkout sidesteps all of this by
ensuring the card number is entered directly into a page Stripe controls
and never becomes YOUR application's responsibility at any point.

## What a Checkout Session actually is

A Checkout Session is a description of an intended purchase — what's being
bought, at what price, where to send the customer afterward — that you
create via a server-side API call. Stripe responds with a URL to its own
hosted payment page, pre-populated according to your session's
description. Your server's involvement ends at creating this description
and (later, covered in Lesson 2) reacting to Stripe telling you the
payment succeeded — it never touches the actual card entry step at all.

## Why the secret key must never reach the client

\`STRIPE_SECRET_KEY\` can create charges, issue refunds, and access your
Stripe account's data — it must only ever be used in server-side code
(a Server Action, a Route Handler), never bundled into client-side
JavaScript where it would be readable by anyone. Stripe separately
provides a PUBLISHABLE key, safe to expose client-side, for the narrow set
of client-side operations (like Stripe.js's card Element, an alternative,
more customizable integration this course doesn't cover in depth) that
genuinely need to run in the browser.

## Test mode versus live mode

Stripe provides an entirely separate set of test API keys and test card
numbers (a well-known one: \`4242 4242 4242 4242\`) that simulate real
payment flows without moving any actual money — every Checkout Session,
webhook, and API call behaves identically in test mode, letting you build
and verify the entire payment flow before ever handling a real
transaction. Switching to live mode later is a matter of swapping API
keys, not rewriting integration logic.`,

    contentHi: `## "Hum apna khud ka payment form banayenge" almost hamesha galat instinct kyun hai

Ek custom card-entry form banana achievable feel karta hai — ye bas ek
HTML form aur ek API call hai. Actual difficulty form khud nahi hai; ye
har wo cheez hai jo us number ko collect karne ke downstream hai: secure
storage ya immediate secure transmission, PCI DSS compliance (ek real,
audited standard, ek suggestion nahi), aur ek breach ke liye liability
agar inme se kuch bhi incorrectly kiya gaya. Stripe ka hosted Checkout in
sab se bachta hai ye ensure karke ki card number directly ek page mein
enter hota hai jise Stripe control karta hai aur kisi bhi point pe AAPKI
application ki responsibility kabhi nahi banta.

## Ek Checkout Session actually kya hai

Ek Checkout Session ek intended purchase ka description hai — kya kharida
ja raha hai, kis price pe, baad mein customer ko kahan bhejna hai — jise
aap ek server-side API call ke through banate ho. Stripe apne khud ke
hosted payment page ke ek URL ke saath respond karta hai, aapke session
ke description ke according pre-populated. Aapke server ka involvement ye
description banane pe khatam hota hai aur (baad mein, Lesson 2 mein
covered) Stripe ke ye batane pe react karna ki payment succeed hua — ye
actual card entry step ko kabhi touch hi nahi karta.

## Secret key ko client tak kabhi kyun nahi pahunchna chahiye

\`STRIPE_SECRET_KEY\` charges create kar sakta hai, refunds issue kar sakta
hai, aur aapke Stripe account ke data tak access kar sakta hai — ise sirf
server-side code mein use kiya jana chahiye (ek Server Action, ek Route
Handler), kabhi client-side JavaScript mein bundle nahi kiya jaana chahiye
jahan ye koi bhi padh sake. Stripe separately ek PUBLISHABLE key provide
karta hai, client-side expose karne ke liye safe, un narrow set ke
client-side operations ke liye (jaise Stripe.js ka card Element, ek
alternative, zyada customizable integration jo ye course depth mein cover
nahi karta) jinhe genuinely browser mein chalne ki zaroorat hai.

## Test mode versus live mode

Stripe test API keys aur test card numbers ka ek poori tarah separate set
provide karta hai (ek well-known: \`4242 4242 4242 4242\`) jo real payment
flows ko simulate karta hai bina koi actual money move kiye — har Checkout
Session, webhook, aur API call test mode mein identically behave karta
hai, aapko poore payment flow ko build aur verify karne dete hue kisi
real transaction ko handle karne se pehle. Baad mein live mode pe switch
karna API keys swap karne ki baat hai, integration logic rewrite karne ki
nahi.`,

    examples: [
      {
        title: 'A complete Checkout Session flow with a redirect to Stripe and back',
        titleHi: 'Ek complete Checkout Session flow, Stripe ki taraf aur wapas redirect ke saath',
        codeJs: `// app/actions.js
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(priceId) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cart\`,
  });
  return session.url;
}

// app/success/page.js — after Stripe redirects back
export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  return <p>Thanks! Payment status: {session.payment_status}</p>;
}`,
        codeTs: `// app/actions.ts
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cart\`,
  });
  return session.url;
}

// app/success/page.tsx — after Stripe redirects back
interface PageProps {
  searchParams: Promise<{ session_id: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  return <p>Thanks! Payment status: {session.payment_status}</p>;
}`,
        code: `export async function createCheckoutSession(priceId) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cart\`,
  });
  return session.url;
}`,
        output:
          "Clicking Buy redirects the browser entirely away from your app to checkout.stripe.com, where the customer enters card details directly on Stripe's page. After payment, Stripe redirects back to your /success page with the session id attached, which you use to confirm the payment status.",
        explain:
          "Notice the customer's browser physically navigates to Stripe's own domain for the card entry step — your server never receives, sees, or processes the card number at any point in this flow, which is precisely what keeps your application outside the heaviest PCI DSS requirements.",
        explainHi:
          "Notice karo ki customer ka browser card entry step ke liye physically Stripe ke apne domain pe navigate karta hai — aapka server is flow mein kisi bhi point pe card number kabhi receive, dekhta, ya process nahi karta, jo precisely wahi hai jo aapki application ko heaviest PCI DSS requirements ke bahar rakhta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Building a custom card entry form and sending raw card details to your own server
'use client';
export function CustomCheckoutForm() {
  async function handleSubmit(cardNumber, expiry, cvv) {
    await fetch('/api/charge', {
      method: 'POST',
      body: JSON.stringify({ cardNumber, expiry, cvv }), // raw card data hits YOUR server
    });
  }
  // ...
}`,
        right: `// Redirecting to Stripe's own hosted Checkout page instead
'use client';
export function BuyButton({ priceId }) {
  async function handleClick() {
    const url = await createCheckoutSession(priceId);
    window.location.href = url; // card entry happens on Stripe's page, not yours
  }
  return <button onClick={handleClick}>Buy Now</button>;
}`,
        why: "The moment raw card data (even briefly, even just passing through) touches your own server, your application falls under the full weight of PCI DSS compliance — network segmentation, specific storage/transmission encryption standards, and regular external audits. Redirecting to Stripe's hosted page means Stripe, not you, bears that compliance burden.",
        whyHi:
          "Jis moment raw card data (chahe briefly ho, chahe sirf guzarta ho) aapke khud ke server ko touch karta hai, aapki application PCI DSS compliance ke poore weight ke under aa jaati hai — network segmentation, specific storage/transmission encryption standards, aur regular external audits. Stripe ke hosted page pe redirect karna matlab hai Stripe, aap nahi, wo compliance burden uthate hain.",
      },
    ],

    realWorld: [
      {
        en: "A small SaaS startup with a two-person engineering team almost always uses Stripe Checkout rather than building a custom payment form — not because a custom form is technically impossible, but because the PCI DSS compliance burden of handling card data directly would consume disproportionate engineering effort for a team that size.",
        hi: 'Ek chhoti SaaS startup jiski do-person engineering team hai almost hamesha Stripe Checkout use karti hai ek custom payment form banane ke bajaye — is wajah se nahi ki ek custom form technically impossible hai, balki isliye kyunki card data ko directly handle karne ka PCI DSS compliance burden us size ki team ke liye disproportionate engineering effort consume karega.',
      },
    ],

    interviewQA: [
      {
        q: "Why does an application using Stripe Checkout avoid most PCI DSS compliance burden?",
        qHi: 'Stripe Checkout use karne wali ek application zyadatar PCI DSS compliance burden kyun avoid karti hai?',
        a: "Because the card number is entered directly on Stripe's own hosted page and never passes through the application's own server at any point. PCI DSS's heaviest requirements apply specifically to entities that handle card data directly — since this application never does, most of that burden falls on Stripe instead.",
        aHi: 'Kyunki card number directly Stripe ke apne hosted page pe enter hota hai aur kisi bhi point pe application ke apne server se kabhi nahi guzarta. PCI DSS ki heaviest requirements specifically un entities pe apply hoti hain jo card data ko directly handle karte hain — kyunki ye application aisa kabhi nahi karti, us burden ka zyadatar hissa Stripe pe padta hai.',
      },
      {
        q: 'What is the STRIPE_SECRET_KEY used for, and why must it never reach client-side code?',
        qHi: 'STRIPE_SECRET_KEY kis liye use hota hai, aur ye client-side code tak kabhi kyun nahi pahunchna chahiye?',
        a: "It authenticates server-side API calls to Stripe that can create charges, issue refunds, and access account data. If it were bundled into client-side JavaScript, anyone inspecting that code could extract it and perform those same privileged operations against the Stripe account — it must stay exclusively in server-side code.",
        aHi: 'Ye server-side API calls ko Stripe ko authenticate karta hai jo charges create kar sakte hain, refunds issue kar sakte hain, aur account data access kar sakte hain. Agar ye client-side JavaScript mein bundle hota, koi bhi jo us code ko inspect karta ise extract kar sakta tha aur Stripe account ke against wahi privileged operations perform kar sakta tha — ise exclusively server-side code mein rehna chahiye.',
      },
    ],

    exercises: [
      {
        task: "A junior developer proposes building a custom checkout form that collects card details and sends them to a Next.js Route Handler, which forwards them to Stripe's API directly. Explain what's wrong with this approach compared to using Stripe Checkout, focusing on compliance rather than just code complexity.",
        taskHi: 'Ek junior developer ek custom checkout form banane ka propose karta hai jo card details collect kare aur unhe ek Next.js Route Handler ko bheje, jo unhe directly Stripe ke API ko forward kare. Explain karo is approach mein Stripe Checkout use karne ke comparison mein kya galat hai, sirf code complexity ke bajaye compliance pe focus karte hue.',
        hint: "Even briefly passing raw card data through your own server, even if you never store it, changes what compliance regime applies to your application.",
        hintHi: 'Raw card data ko apne khud ke server se briefly pass karna bhi, chahe aap use kabhi store na karo, ye badalta hai ki aapki application pe kaunsa compliance regime apply hota hai.',
      },
    ],

    keyTakeaways: [
      "Stripe Checkout is a page Stripe itself hosts — your server creates a Checkout Session describing the purchase and redirects the customer there; card details are entered directly on Stripe's page and never pass through your own server.",
      'This division of labor is what keeps most PCI DSS compliance burden off your application — since you never handle card data directly, the heaviest requirements apply to Stripe instead.',
      'The Stripe secret key must only ever be used in server-side code — it authenticates privileged operations (creating charges, issuing refunds) and would allow anyone who obtained it to perform those operations if exposed client-side.',
      'Stripe test mode (with dedicated test API keys and test card numbers) lets you build and verify an entire payment flow without moving real money, before switching to live mode by swapping keys.',
    ],
    keyTakeawaysHi: [
      'Stripe Checkout ek page hai jise Stripe khud host karta hai — aapka server ek Checkout Session banata hai jo purchase describe karta hai aur customer ko wahan redirect karta hai; card details directly Stripe ke page pe enter hote hain aur kabhi aapke apne server se nahi guzarte.',
      'Ye division of labor wahi hai jo zyadatar PCI DSS compliance burden ko aapki application se dur rakhta hai — kyunki aap kabhi card data ko directly handle nahi karte, heaviest requirements Stripe pe apply hoti hain.',
      'Stripe secret key ko sirf server-side code mein use kiya jana chahiye — ye privileged operations authenticate karta hai (charges create karna, refunds issue karna) aur agar client-side expose ho jaaye to jisne bhi ise obtain kiya wo wo operations perform kar sakega.',
      'Stripe test mode (dedicated test API keys aur test card numbers ke saath) aapko real money move kiye bina ek poora payment flow build aur verify karne deta hai, keys swap karke live mode pe switch karne se pehle.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-stripe-webhooks-signature-verification',
    title: 'Webhooks, Signature Verification & Why the Raw Body Matters',
    titleHi: 'Webhooks, Signature Verification Aur Raw Body Kyun Matter Karta Hai',
    description:
      "Stripe notifies your server about events (a payment succeeded, a subscription renewed) via webhooks — HTTP requests Stripe sends to a URL you provide. Since anyone can send a request to a public URL, every webhook must be verified as genuinely coming from Stripe using a cryptographic signature, and that verification requires the request's raw, unparsed body.",
    descriptionHi:
      'Stripe aapke server ko events ke baare mein notify karta hai (ek payment succeed hui, ek subscription renew hua) webhooks ke through — HTTP requests jo Stripe ek URL pe bhejta hai jo aap provide karte ho. Kyunki koi bhi ek public URL pe ek request bhej sakta hai, har webhook ko genuinely Stripe se aane ki tarah verify karna zaroori hai ek cryptographic signature use karke, aur us verification ke liye request ki raw, unparsed body chahiye.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: "**A sealed, wax-stamped letter versus an anonymous note slipped under your door claiming to be from the bank.** Anyone can slip a note under your door claiming 'your loan was approved, wire the fee now' — the claim alone proves nothing. A letter sealed with the bank's own unique wax stamp, one only the bank's actual seal can produce, lets you verify authenticity by checking the seal itself, not by trusting whatever the letter's content claims. A webhook's signature is that wax seal: Stripe signs the exact bytes it sent using a secret only Stripe and you share, and your server re-computes that signature over the exact same bytes to confirm the request genuinely came from Stripe, not from anyone who merely knows your webhook URL.",
      hi: 'Ek sealed, wax-stamped letter versus ek anonymous note jo aapke darwaze ke neeche slip kiya gaya bank se hone ka claim karte hue. Koi bhi aapke darwaze ke neeche ek note slip kar sakta hai claim karte hue \'aapka loan approved ho gaya, fee abhi wire karo\' — akela claim kuch bhi prove nahi karta. Ek letter jo bank ki apni unique wax stamp se sealed hai, jise sirf bank ki actual seal produce kar sakti hai, aapko authenticity verify karne deta hai seal khud check karke, letter ka content jo bhi claim kare use trust karke nahi. Ek webhook ka signature wahi wax seal hai: Stripe exact bytes ko sign karta hai jo usne bheje the ek secret use karke jo sirf Stripe aur aap share karte ho, aur aapka server wahi signature un exact wahi bytes pe re-compute karta hai confirm karne ke liye ki request genuinely Stripe se aayi, kisi aise se nahi jo sirf aapka webhook URL jaanta hai.',
    },

    simple: `**Why webhooks exist at all:** a Checkout Session's success redirect
tells the CUSTOMER'S BROWSER the payment succeeded, but a customer could
close the tab before that redirect happens, or the redirect could fail —
your server needs an independent, reliable notification from Stripe
itself that doesn't depend on the customer's browser cooperating. That's
what a webhook is: Stripe calling YOUR server directly.

**The security problem a webhook endpoint has to solve:** the webhook URL
is a public endpoint — anyone who discovers it could send a fake request
claiming "payment succeeded" for an order that was never actually paid
for, unless you verify the request genuinely came from Stripe.

\`\`\`ts
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')!;
  const rawBody = await request.text(); // the RAW, unparsed request body

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 }); // reject it
  }

  // Only trust the event's contents AFTER signature verification succeeds
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await fulfillOrder(session);
  }

  return new Response('OK', { status: 200 });
}
\`\`\`

**Why the RAW body specifically — not the parsed JSON:** Stripe's
signature is computed over the exact bytes it sent, character for
character. If your framework automatically parses the incoming JSON body
before you see it (turning it into a JavaScript object) and you then
re-serialize that object to verify the signature, the re-serialized bytes
might differ from Stripe's original bytes in whitespace, key ordering, or
number formatting — and the signature check would fail even for a
genuinely valid request. \`constructEvent\` needs the untouched, original
raw text specifically to recompute the exact same signature Stripe
computed.

**The rule this leads to:** never trust a webhook's claimed content
before signature verification succeeds, and never let your framework's
convenient auto-JSON-parsing get in the way of accessing the raw body this
verification requires.`,

    simpleHi: `**Webhooks bilkul exist kyun karte hain:** ek Checkout Session ka
success redirect CUSTOMER KE BROWSER ko batata hai ki payment succeed hui,
par ek customer redirect hone se pehle tab close kar sakta hai, ya
redirect fail ho sakta hai — aapke server ko Stripe se ek independent,
reliable notification chahiye jo customer ke browser ke cooperate karne
pe depend na kare. Yahi ek webhook hai: Stripe directly AAPKE server ko
call kar raha hai.

**Security problem jo ek webhook endpoint ko solve karna chahiye:**
webhook URL ek public endpoint hai — koi bhi jo ise discover karta hai ek
fake request bhej sakta hai claim karte hue "payment succeed hui" ek order
ke liye jo actually kabhi paid nahi kiya gaya, jab tak aap verify na karo
ki request genuinely Stripe se aayi.

\`\`\`ts
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')!;
  const rawBody = await request.text(); // RAW, unparsed request body

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 }); // reject karo
  }

  // Event ke contents ko sirf signature verification succeed hone ke BAAD trust karo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await fulfillOrder(session);
  }

  return new Response('OK', { status: 200 });
}
\`\`\`

**RAW body specifically kyun — parsed JSON nahi:** Stripe ka signature
exact bytes pe compute hota hai jo usne bheje, character for character.
Agar aapka framework automatically incoming JSON body ko parse kar deta
hai aapke dekhne se pehle (ise ek JavaScript object mein badalte hue) aur
aap phir signature verify karne ke liye us object ko re-serialize karte
ho, re-serialized bytes shayad Stripe ke original bytes se differ karein
whitespace, key ordering, ya number formatting mein — aur signature check
fail ho jayega ek genuinely valid request ke liye bhi. \`constructEvent\`
ko untouched, original raw text specifically chahiye exactly wahi
signature recompute karne ke liye jo Stripe ne compute ki thi.

**Rule jo isse nikalta hai:** signature verification succeed hone se
pehle kisi bhi webhook ke claimed content ko kabhi trust mat karo, aur
apne framework ki convenient auto-JSON-parsing ko is verification ki
zaroorat wali raw body tak access mein kabhi rukavat mat aane do.`,

    content: `## Why a redirect alone can never be a reliable source of truth

The success_url redirect in Lesson 1 tells the CUSTOMER'S browser that
Stripe considers the payment complete — but that information reaching
your server depends on the customer's browser actually completing the
redirect, which can fail for reasons entirely outside your control (the
customer closes the tab, their connection drops, they navigate away
manually). A webhook is Stripe's server directly telling YOUR server about
the event, independent of what the customer's browser does or doesn't do
— this is why order fulfillment logic belongs in the webhook handler, not
in the success page's rendering logic.

## What signature verification actually proves, and what it doesn't

A verified signature proves the request's exact body genuinely originated
from Stripe (using a secret only Stripe and your server know) and wasn't
tampered with in transit. It does NOT, by itself, prevent a REPLAYED
request — an attacker capturing a genuinely valid, previously-used webhook
payload and resending it later. Stripe's SDK also checks a timestamp
included in the signed payload and rejects requests outside a reasonable
time window specifically to mitigate this; genuinely idempotent handling
of the event (covered further in Lesson 3) is the other half of defending
against a replayed, already-processed event being acted on twice.

## Why Next.js's default body parsing has to be bypassed here

Route Handlers in the App Router give you direct access to the raw
\`Request\` object, and calling \`request.text()\` (rather than
\`request.json()\`) is what preserves the exact original bytes needed for
signature verification — \`request.json()\` would parse the body into an
object, discarding the exact byte-for-byte representation Stripe's
signature was computed over. This is a common integration mistake
specifically because \`request.json()\` is the more natural, more commonly
used method for handling JSON payloads everywhere else in an app.

## Handling webhook events idempotently, briefly

Stripe explicitly documents that a webhook endpoint may receive the SAME
event more than once (network retries, Stripe's own redelivery on a
missed acknowledgment) — a correct handler should be safe to run twice
for the same event without double-fulfilling an order or double-crediting
an account. This connects directly to the idempotency concept Lesson 3
covers for Stripe API calls more broadly.`,

    contentHi: `## Ek redirect akela kabhi ek reliable source of truth kyun nahi ho sakta

Lesson 1 mein success_url redirect CUSTOMER KE browser ko batata hai ki
Stripe payment ko complete consider karta hai — par wo information aapke
server tak pahunchna is baat pe depend karta hai ki customer ka browser
actually redirect complete karta hai, jo poori tarah aapke control ke
bahar wajahon se fail ho sakta hai (customer tab close karta hai, unka
connection drop hota hai, wo manually navigate away karte hain). Ek
webhook Stripe ka server directly AAPKE server ko event ke baare mein
batana hai, is baat se independent ki customer ka browser kya karta hai
ya nahi karta — yahi wajah hai ki order fulfillment logic webhook handler
mein belong karta hai, success page ki rendering logic mein nahi.

## Signature verification actually kya prove karta hai, aur kya nahi

Ek verified signature prove karta hai ki request ki exact body genuinely
Stripe se originate hui (ek secret use karke jo sirf Stripe aur aapka
server jaante hain) aur transit mein tamper nahi hui. Ye khud, ek
REPLAYED request nahi prevent karta — ek attacker jo ek genuinely valid,
previously-used webhook payload capture karta hai aur ise baad mein
resend karta hai. Stripe ka SDK bhi signed payload mein included ek
timestamp check karta hai aur ek reasonable time window ke bahar
requests reject karta hai specifically ise mitigate karne ke liye;
genuinely idempotent event handling (Lesson 3 mein aur cover kiya jayega)
ek replayed, already-processed event ko do baar act hone se defend karne
ka doosra half hai.

## Next.js ki default body parsing ko yahan kyun bypass karna padta hai

App Router mein Route Handlers aapko direct access dete hain raw
\`Request\` object tak, aur \`request.json()\` ke bajaye \`request.text()\`
call karna wahi hai jo exact original bytes preserve karta hai jo
signature verification ke liye chahiye — \`request.json()\` body ko ek
object mein parse kar dega, exact byte-for-byte representation discard
karte hue jispe Stripe ka signature compute hua tha. Ye ek common
integration mistake hai specifically isliye kyunki \`request.json()\` app
mein kahin aur JSON payloads handle karne ke liye zyada natural, zyada
commonly used method hai.

## Webhook events ko idempotently handle karna, briefly

Stripe explicitly document karta hai ki ek webhook endpoint ko WAHI event
ek se zyada baar mil sakta hai (network retries, Stripe ka apna
redelivery ek missed acknowledgment pe) — ek correct handler ko wahi
event ke liye do baar chalne ke liye safe hona chahiye bina ek order ko
double-fulfill ya ek account ko double-credit kiye. Ye directly us
idempotency concept se connect karta hai jise Lesson 3 Stripe API calls
ke liye broadly cover karta hai.`,

    examples: [
      {
        title: 'A correctly implemented webhook handler with signature verification',
        titleHi: 'Ek correctly implemented webhook handler signature verification ke saath',
        codeJs: `// app/api/webhooks/stripe/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text(); // critical: raw text, not request.json()

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Idempotent: safe to run even if this event arrives twice
      await db.order.upsert({
        where: { stripeSessionId: session.id },
        create: { stripeSessionId: session.id, status: 'PAID' },
        update: { status: 'PAID' },
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      console.log('Payment failed:', event.data.object.id);
      break;
    }
  }

  return new Response('OK', { status: 200 });
}`,
        codeTs: `// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')!;
  const rawBody = await request.text(); // critical: raw text, not request.json()

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', (err as Error).message);
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Idempotent: safe to run even if this event arrives twice
      await db.order.upsert({
        where: { stripeSessionId: session.id },
        create: { stripeSessionId: session.id, status: 'PAID' },
        update: { status: 'PAID' },
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      console.log('Payment failed:', event.data.object.id);
      break;
    }
  }

  return new Response('OK', { status: 200 });
}`,
        code: `export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === 'checkout.session.completed') {
    await db.order.upsert({ where: { stripeSessionId: event.data.object.id }, /* ... */ });
  }
  return new Response('OK', { status: 200 });
}`,
        output:
          "A genuine webhook from Stripe, with a valid signature, is processed and updates the order to PAID. A forged request claiming the same event, sent by anyone who doesn't know the webhook secret, fails signature verification and is rejected with a 400 before any order is touched.",
        explain:
          "The upsert (rather than a plain create) makes the handler idempotent — if Stripe redelivers the same event (which it explicitly documents as possible), running this handler a second time for the same stripeSessionId simply updates the same row again rather than creating a duplicate order or erroring.",
        explainHi:
          "Upsert (ek plain create ke bajaye) handler ko idempotent banata hai — agar Stripe wahi event redeliver karta hai (jo ye explicitly possible document karta hai), is handler ko wahi stripeSessionId ke liye doosri baar chalana simply wahi row ko phir se update karta hai duplicate order banane ya error karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using request.json() — loses the exact raw bytes needed for signature verification
export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.json(); // ALREADY parsed — original bytes are gone
  const event = stripe.webhooks.constructEvent(
    JSON.stringify(body), // re-serialized, likely NOT byte-identical to Stripe's original
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  ); // signature verification fails even for genuinely valid requests
}`,
        right: `// Using request.text() to preserve the exact raw body
export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text(); // untouched, exact original bytes
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  ); // verifies correctly
}`,
        why: "Stripe's signature is computed over the exact byte sequence it sent. Parsing the body into a JavaScript object and re-serializing it can produce different bytes (whitespace, key order, number formatting) than the original, causing signature verification to fail even for a completely legitimate request from Stripe.",
        whyHi:
          "Stripe ka signature exact byte sequence pe compute hota hai jo usne bheja. Body ko ek JavaScript object mein parse karna aur ise re-serialize karna original se alag bytes produce kar sakta hai (whitespace, key order, number formatting), signature verification ko fail karte hue ek poori tarah legitimate request ke liye bhi Stripe se.",
      },
    ],

    realWorld: [
      {
        en: "A production Stripe integration's order fulfillment (granting access to a purchased digital product, say) always happens inside the checkout.session.completed webhook handler, never on the success page's render — because the success page render depends on the customer's browser cooperating, while the webhook is Stripe's own reliable, server-to-server notification.",
        hi: 'Ek production Stripe integration ka order fulfillment (ek purchased digital product tak access grant karna, maan lo) hamesha checkout.session.completed webhook handler ke andar hota hai, success page ke render pe kabhi nahi — kyunki success page render customer ke browser ke cooperate karne pe depend karta hai, jabki webhook Stripe ka apna reliable, server-to-server notification hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must a webhook handler verify a cryptographic signature before trusting the event it received?',
        qHi: 'Ek webhook handler ko us event ko trust karne se pehle ek cryptographic signature verify kyun karna chahiye jo usne receive kiya?',
        a: "A webhook URL is a public endpoint anyone can send a request to. Without verifying a signature that only Stripe (using a shared secret) could have produced, an attacker could send a forged request claiming a payment succeeded for an order that was never actually paid for.",
        aHi: 'Ek webhook URL ek public endpoint hai jise koi bhi request bhej sakta hai. Ek signature verify kiye bina jo sirf Stripe (ek shared secret use karke) produce kar sakta tha, ek attacker ek forged request bhej sakta tha claim karte hue ki ek payment succeed hui ek order ke liye jo actually kabhi paid nahi ki gayi.',
      },
      {
        q: 'Why does Stripe webhook signature verification specifically require the raw, unparsed request body?',
        qHi: 'Stripe webhook signature verification ko specifically raw, unparsed request body kyun chahiye?',
        a: "The signature is computed over the exact byte sequence Stripe sent. If the body is first parsed into an object (via request.json()) and then re-serialized to check the signature, the re-serialized bytes may differ from the original in whitespace, key order, or formatting, causing a valid request's signature check to fail incorrectly.",
        aHi: 'Signature exact byte sequence pe compute hota hai jo Stripe ne bheja. Agar body pehle ek object mein parse hoti hai (request.json() ke through) aur phir signature check karne ke liye re-serialize hoti hai, re-serialized bytes original se whitespace, key order, ya formatting mein differ kar sakte hain, ek valid request ke signature check ko incorrectly fail karte hue.',
      },
    ],

    exercises: [
      {
        task: "A payment success page currently grants the customer access to a purchased course by updating the database directly inside the page's server component render, based on the session_id in the URL. Explain why this is unreliable and how moving the logic to a webhook handler fixes it.",
        taskHi: 'Ek payment success page currently customer ko ek purchased course tak access grant karta hai database ko directly page ke server component render ke andar update karke, URL mein session_id ke basis par. Explain karo ye kyun unreliable hai aur logic ko ek webhook handler mein move karna ise kaise fix karta hai.',
        hint: "Consider what happens if the customer's browser never successfully loads the success page at all — closed tab, connection drop, navigating away.",
        hintHi: 'Socho kya hota hai agar customer ka browser success page ko successfully load hi na kare — closed tab, connection drop, navigate away.',
      },
    ],

    keyTakeaways: [
      "A webhook is Stripe's server directly notifying your server about an event, independent of whether the customer's browser successfully completes a redirect — this is why order fulfillment belongs in the webhook handler, not the success page.",
      "Every webhook must have its signature verified before its contents are trusted, since the webhook URL is a public endpoint anyone could send a forged request to.",
      "Signature verification requires the exact raw request body — using request.text() instead of request.json() in the Route Handler, since parsing and re-serializing the body can change its exact bytes and break the signature check.",
      "A webhook handler should be idempotent (safe to run more than once for the same event), since Stripe explicitly documents that the same event may be delivered multiple times.",
    ],
    keyTakeawaysHi: [
      'Ek webhook Stripe ka server hai jo directly aapke server ko ek event ke baare mein notify karta hai, is baat se independent ki customer ka browser successfully ek redirect complete karta hai ya nahi — yahi wajah hai ki order fulfillment webhook handler mein belong karta hai, success page mein nahi.',
      'Har webhook ka signature verify hona chahiye uske contents trust hone se pehle, kyunki webhook URL ek public endpoint hai jise koi bhi ek forged request bhej sakta hai.',
      'Signature verification ko exact raw request body chahiye — Route Handler mein request.json() ke bajaye request.text() use karte hue, kyunki body ko parse aur re-serialize karna uske exact bytes badal sakta hai aur signature check tod sakta hai.',
      'Ek webhook handler idempotent hona chahiye (wahi event ke liye ek se zyada baar chalne ke liye safe), kyunki Stripe explicitly document karta hai ki wahi event multiple baar deliver ho sakta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-stripe-subscriptions-idempotency-go-live',
    title: 'Subscriptions, Idempotency & Going Live',
    titleHi: 'Subscriptions, Idempotency Aur Go Live',
    description:
      "A recurring subscription needs a customer-facing way to manage or cancel it (the billing portal), a way to safely retry a failed API call without accidentally double-charging (idempotency keys), and a concrete checklist before flipping from Stripe's test mode to real, live payments.",
    descriptionHi:
      'Ek recurring subscription ko ek customer-facing tareeka chahiye use manage ya cancel karne ka (billing portal), ek safely retry karne ka tareeka ek failed API call ka bina accidentally double-charge kiye (idempotency keys), aur Stripe ke test mode se real, live payments mein flip karne se pehle ek concrete checklist.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A gym membership desk that lets members manage their own plan, versus one where every change requires calling a manager. And a delivery driver who checks a package's tracking number before re-delivering, so a lost signal doesn't cause the same package to be dropped off twice.** A well-run gym gives members a self-service portal — upgrade, downgrade, cancel, update the card on file — without needing an employee for every single change. Stripe's billing portal is exactly this self-service desk for subscriptions. Separately, a delivery driver who loses signal mid-delivery and isn't sure if a package was actually left needs to CHECK before re-delivering, not blindly redeliver — an idempotency key is that check: a unique ticket for 'this exact delivery attempt' that lets the system recognize a retry as the same attempt, not a brand new one.",
      hi: 'Ek gym membership desk jo members ko apna khud ka plan manage karne deta hai, versus ek jahan har change ke liye ek manager ko call karna padta hai. Aur ek delivery driver jo re-deliver karne se pehle ek package ka tracking number check karta hai, taaki ek lost signal wahi package do baar drop off na kar de. Ek well-run gym members ko ek self-service portal deta hai — upgrade, downgrade, cancel, card on file update karna — har single change ke liye ek employee ki zaroorat ke bina. Stripe ka billing portal subscriptions ke liye exactly yahi self-service desk hai. Separately, ek delivery driver jo delivery ke beech signal kho deta hai aur sure nahi hai ki package actually chhoda gaya tha ya nahi use re-deliver karne se pehle CHECK karna chahiye, blindly redeliver nahi karna chahiye — ek idempotency key wahi check hai: "is exact delivery attempt" ke liye ek unique ticket jo system ko ek retry ko wahi attempt recognize karne deta hai, ek bilkul naya nahi.',
    },

    simple: `**The billing portal — a page Stripe hosts, letting customers manage
their own subscription:**

\`\`\`ts
// app/actions.ts
'use server';
export async function createPortalSession(stripeCustomerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: \`\${process.env.APP_URL}/account\`,
  });
  return session.url; // redirect here — Stripe's own hosted "manage my plan" page
}
\`\`\`

**Why the portal matters:** without it, every plan change, cancellation,
or card update requires custom UI and API calls YOU build and maintain.
The portal is the same principle as Checkout (Module 10 Lesson 1) applied
to ongoing subscription management — Stripe hosts the sensitive,
change-prone UI, you just link to it.

**Idempotency keys — making a retried API call provably safe:**

\`\`\`ts
// Without an idempotency key: a network timeout after Stripe successfully
// created a charge, followed by your code retrying, could create TWO charges
await stripe.paymentIntents.create({ amount: 2000, currency: 'usd' });

// With an idempotency key: retrying with the SAME key returns the
// ORIGINAL result instead of creating a second charge
await stripe.paymentIntents.create(
  { amount: 2000, currency: 'usd' },
  { idempotencyKey: \`order-\${orderId}-charge\` }, // unique per LOGICAL attempt
);
// If this exact call is retried (same key) — even after a real network
// failure where you're unsure if the first attempt succeeded — Stripe
// recognizes the key and returns the original result, never double-charging.
\`\`\`

**Going live — the checklist, briefly:**

\`\`\`
1. Complete Stripe's account activation (business details, bank account
   for payouts) — required before live-mode charges are allowed at all
2. Swap test API keys for live API keys (and the webhook secret — it's
   different per mode)
3. Re-create products/prices in live mode — test-mode objects don't
   carry over automatically
4. Point the webhook endpoint's live-mode configuration at the same URL,
   verify it with a real (small) test transaction
5. Confirm error handling and logging are in place BEFORE real money
   moves through the system, not added afterward once something breaks
\`\`\`

**The pattern across this whole module:** every technique — Checkout,
webhooks, the portal, idempotency — exists to move sensitive or
error-prone responsibility onto Stripe's own well-tested infrastructure
rather than reimplementing it yourself, and to make failure modes
(a browser closing, a network timeout, a retried request) survivable
rather than silently corrupting data or money.`,

    simpleHi: `**Billing portal — ek page jise Stripe host karta hai, customers ko
apna khud ka subscription manage karne dete hue:**

\`\`\`ts
// app/actions.ts
'use server';
export async function createPortalSession(stripeCustomerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: \`\${process.env.APP_URL}/account\`,
  });
  return session.url; // yahan redirect karo — Stripe ka apna hosted "manage my plan" page
}
\`\`\`

**Portal kyun matter karta hai:** iske bina, har plan change,
cancellation, ya card update ke liye custom UI aur API calls chahiye jo
AAP banate aur maintain karte ho. Portal wahi principle hai jo Checkout
(Module 10 Lesson 1) ka hai, ongoing subscription management pe applied —
Stripe sensitive, change-prone UI host karta hai, aap bas usse link karte
ho.

**Idempotency keys — ek retried API call ko provably safe banana:**

\`\`\`ts
// Bina ek idempotency key ke: Stripe ke successfully ek charge create
// karne ke baad ek network timeout, uske baad aapke code ka retry karna,
// DO charges create kar sakta hai
await stripe.paymentIntents.create({ amount: 2000, currency: 'usd' });

// Ek idempotency key ke saath: wahi key ke saath retry karna ORIGINAL
// result return karta hai ek second charge banane ke bajaye
await stripe.paymentIntents.create(
  { amount: 2000, currency: 'usd' },
  { idempotencyKey: \`order-\${orderId}-charge\` }, // LOGICAL attempt per unique
);
// Agar ye exact call retry hoti hai (wahi key) — even ek real network
// failure ke baad jahan aap sure nahi ho ki pehla attempt succeed hua ya
// nahi — Stripe key recognize karta hai aur original result return karta
// hai, kabhi double-charge nahi karta.
\`\`\`

**Go live — checklist, briefly:**

\`\`\`
1. Stripe ki account activation complete karo (business details, payouts
   ke liye bank account) — live-mode charges bilkul allowed hone se pehle
   required hai
2. Test API keys ko live API keys ke saath swap karo (aur webhook secret
   — ye har mode ke liye alag hai)
3. Products/prices ko live mode mein re-create karo — test-mode objects
   automatically carry over nahi hote
4. Webhook endpoint ki live-mode configuration ko wahi URL pe point karo,
   ek real (chhoti) test transaction se verify karo
5. Confirm karo ki error handling aur logging jagah pe hai REAL money
   system se guzarne se PEHLE, kuch tootne ke baad add karne ke bajaye
\`\`\`

**Is poore module ke across pattern:** har technique — Checkout,
webhooks, portal, idempotency — exist karta hai sensitive ya error-prone
responsibility ko Stripe ke apne well-tested infrastructure pe move
karne ke liye ise khud reimplement karne ke bajaye, aur failure modes ko
(ek browser close hona, ek network timeout, ek retried request)
survivable banane ke liye silently data ya money corrupt karne ke bajaye.`,

    content: `## Why building a custom subscription-management UI is usually wasted
effort

Letting customers upgrade, downgrade, update payment methods, and cancel
involves genuinely tricky edge cases — proration (charging or crediting
the difference when switching plans mid-cycle), payment method updates
that must re-authenticate with the card network, and cancellation timing
(immediate versus end-of-period). Stripe's billing portal handles all of
this correctly out of the box, hosted and maintained by Stripe, for the
same reason Checkout is preferable to a custom payment form — it's a
solved, well-tested problem you'd otherwise be re-solving with less
resources and expertise than Stripe has.

## Why idempotency keys matter specifically for payment operations

A network request can fail in an ambiguous way: the request might have
reached Stripe and succeeded, with only the RESPONSE failing to arrive
back at your server. Naively retrying in this situation risks creating a
second charge for something that already succeeded once. An idempotency
key tags a specific logical attempt (not a specific HTTP request) — Stripe
remembers the key and, if the same key is submitted again within a
window, returns the original operation's result rather than performing it
a second time. Generating the key from something meaningful and unique to
the logical operation (like \`order-123-charge\`, built from the order's
own id) rather than a random value each time is what makes a genuine
retry recognizable as "the same attempt."

## Why subscriptions specifically need this discipline

A one-time Checkout Session is a single event; a subscription is an
ongoing relationship with monthly or annual billing cycles, upgrades,
downgrades, failed-payment retries, and cancellations, each of which is
itself an operation that could be retried after an ambiguous failure.
Idempotency matters more, not less, for subscriptions precisely because
there are more distinct operations over the lifetime of one customer
relationship, each needing this same protection.

## Going live is an operational checklist, not a code change

Nothing about the application code changes structurally between test and
live mode — the same Checkout Session creation, webhook handler, and
portal integration work identically. What changes is configuration:
different API keys, a different webhook signing secret (Stripe uses a
separate secret per webhook endpoint, and test/live mode endpoints are
configured separately), and re-creating any Products/Prices you reference
by ID, since test-mode and live-mode data are entirely separate within
the same Stripe account. Treating "go live" primarily as a configuration
and verification checklist, rather than a code migration, is what keeps
the transition low-risk.`,

    contentHi: `## Ek custom subscription-management UI banana usually wasted effort kyun hai

Customers ko upgrade, downgrade, payment methods update, aur cancel karne
dena genuinely tricky edge cases involve karta hai — proration (mid-cycle
plans switch karte waqt difference charge ya credit karna), payment
method updates jinhe card network ke saath re-authenticate karna padta
hai, aur cancellation timing (immediate versus end-of-period). Stripe ka
billing portal in sab ko correctly out of the box handle karta hai,
Stripe dwara hosted aur maintained, wahi wajah se jo Checkout ko ek
custom payment form se preferable banati hai — ye ek solved, well-tested
problem hai jise aap warna Stripe ke paas jitne resources aur expertise
hai usse kam mein re-solve kar rahe honge.

## Idempotency keys specifically payment operations ke liye kyun matter karte hain

Ek network request ek ambiguous tareeke se fail ho sakta hai: request
Stripe tak pahunchi ho sakti hai aur succeed hui ho sakti hai, sirf
RESPONSE aapke server tak wapas pahunchne mein fail hua ho. Is situation
mein naively retry karna ek doosra charge create karne ka risk uthata hai
kisi cheez ke liye jo already ek baar succeed hui thi. Ek idempotency key
ek specific logical attempt ko tag karta hai (ek specific HTTP request
nahi) — Stripe key ko yaad rakhta hai aur, agar wahi key ek window ke
andar phir se submit hoti hai, original operation ka result return karta
hai ise doosri baar perform karne ke bajaye. Key ko logical operation ke
liye meaningful aur unique kisi cheez se generate karna (jaise
\`order-123-charge\`, order ki apni id se banaya gaya) har baar ek random
value ke bajaye wahi hai jo ek genuine retry ko "wahi attempt" ki tarah
recognizable banata hai.

## Subscriptions specifically ko ye discipline kyun chahiye

Ek one-time Checkout Session ek single event hai; ek subscription ek
ongoing relationship hai monthly ya annual billing cycles, upgrades,
downgrades, failed-payment retries, aur cancellations ke saath, jinme se
har ek khud ek operation hai jo ek ambiguous failure ke baad retry ho
sakta hai. Idempotency zyada matter karta hai, kam nahi, subscriptions ke
liye precisely isliye kyunki ek customer relationship ki lifetime ke over
zyada distinct operations hain, har ek ko yahi same protection chahiye.

## Go live ek operational checklist hai, koi code change nahi

Application code ke baare mein structurally kuch bhi test aur live mode
ke beech change nahi hota — wahi Checkout Session creation, webhook
handler, aur portal integration identically kaam karte hain. Jo change
hota hai wo configuration hai: alag API keys, ek alag webhook signing
secret (Stripe per webhook endpoint ek separate secret use karta hai, aur
test/live mode endpoints separately configured hote hain), aur kisi bhi
Products/Prices ko re-create karna jinhe aap ID se reference karte ho,
kyunki test-mode aur live-mode data wahi Stripe account ke andar poori
tarah separate hai. "Go live" ko primarily ek configuration aur
verification checklist ki tarah treat karna, ek code migration nahi, wahi
hai jo transition ko low-risk rakhta hai.`,

    examples: [
      {
        title: 'A billing portal link and an idempotent subscription-upgrade call',
        titleHi: 'Ek billing portal link aur ek idempotent subscription-upgrade call',
        codeJs: `// app/actions.js
'use server';
export async function createPortalSession(stripeCustomerId) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: \`\${process.env.APP_URL}/account\`,
  });
  return session.url;
}

export async function upgradeSubscription(subscriptionId, newPriceId, orderId) {
  return stripe.subscriptions.update(
    subscriptionId,
    { items: [{ price: newPriceId }] },
    { idempotencyKey: \`upgrade-\${orderId}\` }, // safe to retry this exact upgrade attempt
  );
}

// app/account/ManageSubscriptionButton.js
'use client';
export function ManageSubscriptionButton({ stripeCustomerId }) {
  async function handleClick() {
    const url = await createPortalSession(stripeCustomerId);
    window.location.href = url;
  }
  return <button onClick={handleClick}>Manage Subscription</button>;
}`,
        codeTs: `// app/actions.ts
'use server';
export async function createPortalSession(stripeCustomerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: \`\${process.env.APP_URL}/account\`,
  });
  return session.url;
}

export async function upgradeSubscription(
  subscriptionId: string,
  newPriceId: string,
  orderId: string,
) {
  return stripe.subscriptions.update(
    subscriptionId,
    { items: [{ price: newPriceId }] },
    { idempotencyKey: \`upgrade-\${orderId}\` }, // safe to retry this exact upgrade attempt
  );
}

// app/account/ManageSubscriptionButton.tsx
'use client';
export function ManageSubscriptionButton({ stripeCustomerId }: { stripeCustomerId: string }) {
  async function handleClick() {
    const url = await createPortalSession(stripeCustomerId);
    window.location.href = url;
  }
  return <button onClick={handleClick}>Manage Subscription</button>;
}`,
        code: `export async function upgradeSubscription(subscriptionId, newPriceId, orderId) {
  return stripe.subscriptions.update(
    subscriptionId,
    { items: [{ price: newPriceId }] },
    { idempotencyKey: \`upgrade-\${orderId}\` },
  );
}`,
        output:
          "Clicking 'Manage Subscription' takes the customer to Stripe's own hosted portal, where they can change plans or cancel without any custom UI you built. If upgradeSubscription's network call times out and the calling code retries it with the same orderId-derived key, Stripe returns the original upgrade's result instead of applying the upgrade twice.",
        explain:
          "The idempotency key is derived from orderId — a stable identifier for this specific logical upgrade attempt — rather than generated fresh each call, which is what allows Stripe to recognize a genuine retry of the SAME attempt rather than treating it as an unrelated new request.",
        explainHi:
          "Idempotency key orderId se derive hoti hai — is specific logical upgrade attempt ke liye ek stable identifier — har call pe fresh generate hone ke bajaye, jo Stripe ko WAHI attempt ke ek genuine retry ko recognize karne deta hai ise ek unrelated naya request treat karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// No idempotency key — a retried call after a timeout can double-charge
async function chargeCustomer(orderId, amount) {
  try {
    return await stripe.paymentIntents.create({ amount, currency: 'usd' });
  } catch (err) {
    // Network timeout — was the charge created or not? Unknown.
    return await stripe.paymentIntents.create({ amount, currency: 'usd' });
    // If the FIRST attempt actually succeeded, this creates a SECOND charge.
  }
}`,
        right: `// An idempotency key makes the retry provably safe
async function chargeCustomer(orderId, amount) {
  const idempotencyKey = \`charge-\${orderId}\`;
  return stripe.paymentIntents.create(
    { amount, currency: 'usd' },
    { idempotencyKey },
  );
  // Any retry with this SAME key — even after an ambiguous network
  // failure — returns the original result instead of creating a new charge.
}`,
        why: "Without an idempotency key, a retry after an ambiguous failure (request succeeded, but the response was lost) has no way to know it's a retry of the same logical operation rather than a brand new one — Stripe processes it as a genuinely new charge, potentially billing the customer twice for one purchase.",
        whyHi:
          "Ek idempotency key ke bina, ek ambiguous failure ke baad ek retry (request succeed hui, par response kho gayi) ye jaanne ka koi tareeka nahi rakhta ki ye wahi logical operation ka ek retry hai ek bilkul naye ke bajaye — Stripe ise ek genuinely naya charge ki tarah process karta hai, potentially customer ko ek purchase ke liye do baar bill karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A subscription SaaS product's 'Manage Billing' button universally links to Stripe's billing portal rather than a custom-built plan-management page — building and maintaining correct proration logic, payment-method re-authentication, and cancellation timing in-house would be substantial, ongoing engineering work duplicating what Stripe already provides.",
        hi: 'Ek subscription SaaS product ka \'Manage Billing\' button universally Stripe ke billing portal se link karta hai ek custom-built plan-management page ke bajaye — correct proration logic, payment-method re-authentication, aur cancellation timing ko in-house build aur maintain karna substantial, ongoing engineering kaam hoga jo duplicate karega jo Stripe already provide karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "What problem does an idempotency key solve that a normal retry doesn't?",
        qHi: 'Ek idempotency key kaunsi problem solve karta hai jo ek normal retry nahi karta?',
        a: "It lets a retried API call be recognized as the same logical attempt rather than a new one, even after an ambiguous failure where it's unclear whether the original request already succeeded. Without it, retrying a payment operation after a timeout risks creating a duplicate charge for an operation that may have already completed.",
        aHi: 'Ye ek retried API call ko wahi logical attempt ki tarah recognize hone deta hai ek naya nahi, ek ambiguous failure ke baad bhi jahan ye clear nahi hai ki original request already succeed hui ya nahi. Iske bina, ek timeout ke baad ek payment operation retry karna ek duplicate charge banane ka risk uthata hai ek operation ke liye jo shayad already complete ho chuka ho.',
      },
      {
        q: 'What actually changes in your application when moving from Stripe test mode to live mode?',
        qHi: 'Stripe test mode se live mode mein move karte waqt aapki application mein actually kya badalta hai?',
        a: "Configuration, not code: different API keys, a different webhook signing secret, and re-created Products/Prices, since test and live mode data are entirely separate within the same Stripe account. The Checkout Session creation, webhook handling, and portal integration logic all remain structurally identical.",
        aHi: 'Configuration, code nahi: alag API keys, ek alag webhook signing secret, aur re-created Products/Prices, kyunki test aur live mode data wahi Stripe account ke andar poori tarah separate hai. Checkout Session creation, webhook handling, aur portal integration logic sab structurally identical rehte hain.',
      },
    ],

    exercises: [
      {
        task: "A subscription upgrade Server Action currently calls stripe.subscriptions.update without an idempotency key. Describe a specific failure scenario where this causes a real problem, and show how adding an idempotency key fixes it.",
        taskHi: 'Ek subscription upgrade Server Action currently stripe.subscriptions.update ko bina idempotency key ke call karta hai. Ek specific failure scenario describe karo jahan ye ek real problem cause karta hai, aur dikhao ki ek idempotency key add karna ise kaise fix karta hai.',
        hint: "Think about a network timeout that occurs after Stripe has already processed the update on its end, followed by client-side retry logic.",
        hintHi: 'Ek network timeout ke baare mein socho jo Stripe ke already update process kar chuke hone ke baad hota hai, uske baad client-side retry logic.',
      },
    ],

    keyTakeaways: [
      "Stripe's billing portal is a hosted page for subscription self-service (plan changes, cancellation, payment method updates) — the same principle as Checkout, applied to ongoing subscription management rather than one-time purchases.",
      'An idempotency key tags a specific logical operation attempt, letting a retried API call (after an ambiguous failure) return the original result instead of performing the operation a second time — critical for avoiding double-charges.',
      "Idempotency keys should be derived from something meaningful and stable to the logical operation (an order id), not generated freshly on each call, so a genuine retry is recognizable as the same attempt.",
      'Going live is primarily a configuration and verification checklist (API keys, webhook secrets, re-created Products/Prices) rather than a code change — the application logic works identically in test and live mode.',
    ],
    keyTakeawaysHi: [
      'Stripe ka billing portal subscription self-service ke liye ek hosted page hai (plan changes, cancellation, payment method updates) — wahi principle jo Checkout ka hai, one-time purchases ke bajaye ongoing subscription management pe applied.',
      'Ek idempotency key ek specific logical operation attempt ko tag karta hai, ek retried API call (ek ambiguous failure ke baad) ko original result return karne deta hai operation ko doosri baar perform karne ke bajaye — double-charges avoid karne ke liye critical.',
      'Idempotency keys ko logical operation ke liye kisi meaningful aur stable cheez se derive karna chahiye (ek order id), har call pe freshly generate karne ke bajaye, taaki ek genuine retry wahi attempt ki tarah recognizable ho.',
      'Go live primarily ek configuration aur verification checklist hai (API keys, webhook secrets, re-created Products/Prices) ek code change ke bajaye — application logic test aur live mode mein identically kaam karta hai.',
    ],
  },
];
