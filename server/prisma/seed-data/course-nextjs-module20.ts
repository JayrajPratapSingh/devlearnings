/**
 * Next.js Complete Course — Module 20: SEO, Accessibility & Production Launch, lessons 1-3.
 *
 * Lesson 1: The Metadata API, sitemap/robots, and structured data (JSON-LD).
 * Lesson 2: An accessibility audit — what actually matters, concretely.
 * Lesson 3: The final go-live checklist — a capstone review of the whole course.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_20: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-metadata-api-sitemap-structured-data',
    title: 'The Metadata API, Sitemap/Robots & Structured Data',
    titleHi: 'Metadata API, Sitemap/Robots Aur Structured Data',
    description:
      "A page can look perfect to a visitor and still be nearly invisible to search engines — the Metadata API, a sitemap, and structured data are how a page describes itself to crawlers and search results in a language they can actually parse, distinct from anything a human visitor sees.",
    descriptionHi:
      'Ek page ek visitor ko perfect dikh sakta hai aur phir bhi search engines ke liye almost invisible ho sakta hai — Metadata API, ek sitemap, aur structured data wo tareeke hain jinse ek page khud ko crawlers aur search results ko ek aisi language mein describe karta hai jise wo actually parse kar sakein, kisi bhi cheez se alag jo ek human visitor dekhta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A beautifully organized store with no sign outside, no listing in any directory, and no label on any shelf — versus one with a clear storefront sign, a directory listing, and labeled aisles.** A store can have genuinely excellent products arranged perfectly inside, but if there's no sign telling passersby what the store even sells, no listing in the area's business directory, and no aisle labels helping someone find what they came for, almost nobody will discover it despite the quality inside. The Metadata API is the storefront sign (what shows up when the page is shared or found), the sitemap is the directory listing (helping search engines discover every page exists at all), and structured data is the aisle labeling (telling a search engine exactly what KIND of content this is — a recipe, a product, an article — not just that text exists on the page).",
      hi: 'Ek khoobsoorati se organized store bina bahar kisi sign ke, kisi directory mein koi listing ke bina, aur kisi shelf pe koi label ke bina — versus ek jisme ek clear storefront sign hai, ek directory listing hai, aur labeled aisles hain. Ek store ke paas genuinely excellent products andar perfectly arranged ho sakte hain, par agar koi sign nahi hai jo passersby ko batae ki store bechta kya hai, area ki business directory mein koi listing nahi hai, aur koi aisle labels nahi hain jo kisi ko wo dhundhne mein help karein jiske liye wo aaye, almost koi bhi ise discover nahi karega andar ki quality ke bawajood. Metadata API storefront sign hai (jab page share ya find hota hai to kya dikhta hai), sitemap directory listing hai (search engines ko har page ke bilkul exist karne ko discover karne mein help karte hue), aur structured data aisle labeling hai (ek search engine ko exactly batate hue ye content kis TARAH ka hai — ek recipe, ek product, ek article — sirf ye nahi ki page pe text exist karta hai).',
    },

    simple: `**The Metadata API — controlling what appears in search results and
when a page is shared, per-page or globally:**

\`\`\`tsx
// app/layout.tsx — global defaults for the whole app
export const metadata = {
  title: { default: 'Acme Store', template: '%s | Acme Store' },
  description: 'Quality products, delivered fast.',
};
\`\`\`

\`\`\`tsx
// app/products/[slug]/page.tsx — per-page, dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return {
    title: product.name, // becomes "Wireless Headphones | Acme Store" via the template
    description: product.shortDescription,
    openGraph: {
      images: [product.imageUrl], // controls the preview when shared on social media
    },
  };
}
\`\`\`

**A sitemap — a list telling search engines every page that exists,
so they can find pages that aren't linked from anywhere obvious:**

\`\`\`ts
// app/sitemap.ts
export default async function sitemap() {
  const products = await getAllProducts();
  return [
    { url: 'https://acmestore.com', lastModified: new Date() },
    ...products.map((p) => ({
      url: \`https://acmestore.com/products/\${p.slug}\`,
      lastModified: p.updatedAt,
    })),
  ];
}
// Automatically served at /sitemap.xml
\`\`\`

**\`robots.ts\` — telling crawlers which parts of the site they should
and shouldn't index:**

\`\`\`ts
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://acmestore.com/sitemap.xml',
  };
}
\`\`\`

**Structured data (JSON-LD) — telling a search engine exactly WHAT KIND
of content a page is, not just that text exists on it:**

\`\`\`tsx
// A product page's structured data, enabling rich search results
// (star ratings, price, availability shown directly in search results)
export default function ProductPage({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD' },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} />
    </>
  );
}
\`\`\`

**Why this last example's \`dangerouslySetInnerHTML\` use is actually
safe, connecting back to Module 12's XSS lesson:** the content being
inserted here is JSON built entirely from trusted, server-controlled data
(the product object), not raw user input — this is exactly the
"developer-authored, trusted content" case Module 12 distinguished from
genuinely dangerous uses of \`dangerouslySetInnerHTML\`, not an exception to
that rule.`,

    simpleHi: `**Metadata API — search results mein kya appear hota hai aur jab ek
page share hota hai control karna, per-page ya globally:**

\`\`\`tsx
// app/layout.tsx — poore app ke liye global defaults
export const metadata = {
  title: { default: 'Acme Store', template: '%s | Acme Store' },
  description: 'Quality products, delivered fast.',
};
\`\`\`

\`\`\`tsx
// app/products/[slug]/page.tsx — per-page, dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return {
    title: product.name, // template ke through "Wireless Headphones | Acme Store" ban jata hai
    description: product.shortDescription,
    openGraph: {
      images: [product.imageUrl], // social media pe share hone par preview control karta hai
    },
  };
}
\`\`\`

**Ek sitemap — ek list jo search engines ko batati hai har page jo exist
karta hai, taaki wo un pages ko dhundh sake jo kisi obvious jagah se
linked nahi hain:**

\`\`\`ts
// app/sitemap.ts
export default async function sitemap() {
  const products = await getAllProducts();
  return [
    { url: 'https://acmestore.com', lastModified: new Date() },
    ...products.map((p) => ({
      url: \`https://acmestore.com/products/\${p.slug}\`,
      lastModified: p.updatedAt,
    })),
  ];
}
// Automatically /sitemap.xml pe serve hota hai
\`\`\`

**\`robots.ts\` — crawlers ko batana ki site ke kaunse hisse unhe index
karne chahiye aur kaunse nahi:**

\`\`\`ts
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://acmestore.com/sitemap.xml',
  };
}
\`\`\`

**Structured data (JSON-LD) — ek search engine ko exactly batana ek page
KIS TARAH ka content hai, sirf ye nahi ki usme text exist karta hai:**

\`\`\`tsx
// Ek product page ka structured data, rich search results enable karte hue
// (star ratings, price, availability directly search results mein dikhte hue)
export default function ProductPage({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD' },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} />
    </>
  );
}
\`\`\`

**Is last example ka \`dangerouslySetInnerHTML\` use actually safe kyun
hai, Module 12 ke XSS lesson se wapas connect karte hue:** yahan insert
hone wala content poori tarah trusted, server-controlled data se bana
JSON hai (product object), raw user input nahi — ye exactly wo
"developer-authored, trusted content" case hai jise Module 12 ne
\`dangerouslySetInnerHTML\` ke genuinely dangerous uses se distinguish
kiya, us rule ka exception nahi.`,

    content: `## Why metadata is a distinct concern from what a visitor sees on the
page

A page's actual content (headings, paragraphs, images) is what a HUMAN
visitor reads once they've already arrived. Metadata — the title tag, the
description, Open Graph tags — is what determines whether they arrive at
all: it's what a search engine shows in results, and what a social media
platform displays when someone shares the link before anyone has actually
clicked through. A page can have excellent, well-written content and
still perform poorly in search or look broken when shared, purely because
its metadata was neglected — these are genuinely separate concerns
requiring separate attention.

## Why a sitemap matters even though crawlers can follow links

Search engines do discover pages by following links from other pages, but
this discovery is neither instant nor guaranteed — a page with no
inbound links from anywhere else on the site (a newly published product,
say) might not be discovered through crawling alone for a meaningful
period of time. A sitemap is an explicit, direct list that removes this
uncertainty, telling a search engine about every page's existence and
recent modification time without requiring it to be discovered purely
through link-following.

## Why structured data changes what a search RESULT looks like, not
just whether a page ranks

Structured data (JSON-LD, using schema.org's vocabulary) doesn't
primarily affect ranking — its main effect is enabling "rich results": a
recipe page with structured data can show its rating and cook time
directly in search results, a product page can show its price and
availability, without the visitor needing to click through first. This is
a genuinely different lever from traditional SEO content optimization —
it's about the PRESENTATION of a result in search, not primarily its
position.

## Why the JSON-LD dangerouslySetInnerHTML pattern is the safe exception,
not a contradiction of Module 12

Module 12's XSS lesson specifically warned against passing UNTRUSTED,
user-generated content into \`dangerouslySetInnerHTML\`. The JSON-LD pattern
here inserts content built entirely by the server from data the
application itself controls (the shape of the JSON-LD object is fixed by
the developer; only trusted fields like a product's name and price —
themselves presumably already validated data, not raw unescaped user
input — populate it). This is precisely the "genuinely trusted content"
case that lesson distinguished from the dangerous one, not a special case
requiring different reasoning.`,

    contentHi: `## Metadata ek page pe ek visitor kya dekhta hai usse distinct concern kyun hai

Ek page ka actual content (headings, paragraphs, images) wo hai jo ek
HUMAN visitor padhta hai ek baar wo already arrive kar chuka ho. Metadata
— title tag, description, Open Graph tags — wo hai jo determine karta hai
ki kya wo bilkul arrive karte hain: ye wo hai jo ek search engine results
mein dikhata hai, aur jo ek social media platform dikhata hai jab koi
link share karta hai kisi ke actually click through karne se pehle. Ek
page ka excellent, well-written content ho sakta hai aur phir bhi search
mein poorly perform kar sakta hai ya share hone par broken lag sakta hai,
purely isliye kyunki uska metadata neglect hua tha — ye genuinely separate
concerns hain jinhe separate attention chahiye.

## Ek sitemap kyun matter karta hai chahe crawlers links follow kar sakte hon

Search engines genuinely pages ko discover karte hain doosre pages se
links follow karke, par ye discovery na instant hai na guaranteed — ek
page jisme site pe kahin aur se koi inbound links nahi hain (ek newly
published product, maan lo) shayad crawling akele se ek meaningful period
ke liye discover na ho. Ek sitemap ek explicit, direct list hai jo is
uncertainty ko hataata hai, ek search engine ko har page ke existence aur
recent modification time ke baare mein batate hue bina ise purely
link-following ke through discover hone ki zaroorat ke.

## Structured data search RESULT kaisa dikhta hai use kyun badalta hai, sirf ye ki page rank karta hai ya nahi

Structured data (JSON-LD, schema.org ka vocabulary use karte hue)
primarily ranking ko affect nahi karta — uska main effect "rich results"
enable karna hai: ek recipe page structured data ke saath apni rating aur
cook time directly search results mein dikha sakta hai, ek product page
apna price aur availability dikha sakta hai, bina visitor ko pehle click
through karne ki zaroorat ke. Ye traditional SEO content optimization se
ek genuinely alag lever hai — ye search mein ek result ki PRESENTATION ke
baare mein hai, primarily uski position ke baare mein nahi.

## JSON-LD dangerouslySetInnerHTML pattern safe exception kyun hai, Module 12 ka contradiction nahi

Module 12 ka XSS lesson specifically UNTRUSTED, user-generated content ko
\`dangerouslySetInnerHTML\` mein pass karne ke against warn karta tha. Yahan
JSON-LD pattern poori tarah server dwara banaya gaya content insert karta
hai us data se jise application khud control karta hai (JSON-LD object ka
shape developer dwara fixed hai; sirf trusted fields jaise ek product ka
naam aur price — khud presumably already validated data, raw unescaped
user input nahi — ise populate karte hain). Ye exactly wo "genuinely
trusted content" case hai jise wo lesson dangerous wale se distinguish
karta hai, koi special case nahi jise alag reasoning chahiye.`,

    examples: [
      {
        title: 'Complete per-page metadata, a dynamic sitemap, and product structured data together',
        titleHi: 'Complete per-page metadata, ek dynamic sitemap, aur product structured data saath',
        codeJs: `// app/products/[slug]/page.js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      images: [{ url: product.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetails product={product} />
    </>
  );
}

// app/sitemap.js
export default async function sitemap() {
  const products = await getAllProducts();
  return products.map((p) => ({
    url: \`https://acmestore.com/products/\${p.slug}\`,
    lastModified: p.updatedAt,
  }));
}`,
        codeTs: `// app/products/[slug]/page.tsx
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      images: [{ url: product.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetails product={product} />
    </>
  );
}

// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  return products.map((p) => ({
    url: \`https://acmestore.com/products/\${p.slug}\`,
    lastModified: p.updatedAt,
  }));
}`,
        code: `export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product.name, description: product.shortDescription };
}`,
        output:
          "Each product page has its own title and description in search results, a proper preview image when shared on social media (via Open Graph), a rich search result showing price and availability (via JSON-LD), and every product URL discoverable through the generated sitemap.xml regardless of internal linking.",
        explain:
          "generateMetadata, the JSON-LD script, and sitemap.ts each address a genuinely different visibility concern — what search results show, what a shared link previews as, and whether the page is discovered at all — which is why a thorough SEO setup includes all three rather than treating any one as sufficient alone.",
        explainHi:
          "generateMetadata, JSON-LD script, aur sitemap.ts har ek genuinely alag visibility concern address karte hain — search results kya dikhate hain, ek shared link kya preview karta hai, aur kya page bilkul discover hota hai — yahi wajah hai ki ek thorough SEO setup teenon include karta hai kisi ek ko akela sufficient treat karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using the same static metadata for every product page
export const metadata = {
  title: 'Product', // identical for every single product on the site
  description: 'Buy our products.',
};
// Search results and shared links look identical for every product,
// giving search engines and visitors no way to distinguish them.`,
        right: `// Dynamic, per-product metadata via generateMetadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product.name,
    description: product.shortDescription,
  };
}`,
        why: "Static metadata applied identically across many distinct pages defeats the entire purpose of metadata — helping search engines and visitors distinguish what each specific page actually is. generateMetadata lets each page's metadata reflect its own actual content.",
        whyHi:
          "Kai distinct pages ke across identically applied static metadata metadata ke poore purpose ko defeat karta hai — search engines aur visitors ko ye distinguish karne mein help karna ki har specific page actually kya hai. generateMetadata har page ke metadata ko uske apne actual content ko reflect karne deta hai.",
      },
    ],

    realWorld: [
      {
        en: "A recipe website's structured data (JSON-LD marking up ingredients, cook time, and rating) is why some recipe search results show a star rating and preparation time directly in Google's results, before a visitor ever clicks through — a direct, visible consequence of structured data that plain, well-written page content alone cannot produce.",
        hi: 'Ek recipe website ka structured data (JSON-LD jo ingredients, cook time, aur rating mark up karta hai) wajah hai ki kuch recipe search results Google ke results mein directly ek star rating aur preparation time dikhate hain, ek visitor ke kabhi click through karne se pehle — structured data ka ek direct, visible consequence jise plain, well-written page content akela produce nahi kar sakta.',
      },
    ],

    interviewQA: [
      {
        q: "What is the difference between what a page's actual content communicates and what its metadata communicates?",
        qHi: 'Ek page ka actual content kya communicate karta hai aur uska metadata kya communicate karta hai iske beech kya farak hai?',
        a: "A page's content is what a visitor reads once they've already arrived on the page. Metadata (title, description, Open Graph tags) is what determines whether and how they arrive at all — what a search engine displays in results, and what a social platform shows when the link is shared, before anyone has clicked through.",
        aHi: 'Ek page ka content wo hai jo ek visitor padhta hai ek baar wo already page pe arrive kar chuka ho. Metadata (title, description, Open Graph tags) wo hai jo determine karta hai ki kya aur kaise wo bilkul arrive karte hain — ek search engine results mein kya display karta hai, aur ek social platform kya dikhata hai jab link share hota hai, kisi ke click through karne se pehle.',
      },
      {
        q: "Why is inserting a JSON-LD script via dangerouslySetInnerHTML not a contradiction of Module 12's XSS warning?",
        qHi: 'JSON-LD script ko dangerouslySetInnerHTML ke through insert karna Module 12 ki XSS warning ka contradiction kyun nahi hai?',
        a: "Module 12 warned specifically against inserting untrusted, user-generated content this way. The JSON-LD content here is built entirely by server-side code from data the application itself controls, not raw user input — exactly the 'genuinely trusted content' case that lesson distinguished as safe, not an exception requiring different reasoning.",
        aHi: 'Module 12 specifically untrusted, user-generated content ko is tarike se insert karne ke against warn karta tha. Yahan JSON-LD content poori tarah server-side code se banaya gaya hai us data se jise application khud control karta hai, raw user input nahi — exactly wo "genuinely trusted content" case jise wo lesson safe ki tarah distinguish karta hai, koi exception nahi jise alag reasoning chahiye.',
      },
    ],

    exercises: [
      {
        task: "A blog's article pages currently have no generateMetadata function, no sitemap, and no structured data. Prioritize which of these three to add first for a blog specifically, and justify the order based on what each one actually affects.",
        taskHi: 'Ek blog ke article pages mein currently koi generateMetadata function nahi hai, koi sitemap nahi hai, aur koi structured data nahi hai. In teen mein se kaunsa pehle add karna hai prioritize karo ek blog ke liye specifically, aur order ko justify karo har ek actually kya affect karta hai iske basis par.',
        hint: "Consider which gap would most directly prevent articles from being found or correctly represented in search and social sharing, versus which is a more incremental enhancement.",
        hintHi: 'Socho kaunsa gap articles ko search aur social sharing mein find hone ya correctly represent hone se most directly rokega, versus kaunsa ek zyada incremental enhancement hai.',
      },
    ],

    keyTakeaways: [
      "The Metadata API (generateMetadata, static metadata exports) controls what search engines and social platforms show for a page — a genuinely separate concern from the page's actual visible content.",
      'A sitemap explicitly lists every page for search engines, removing the uncertainty of relying purely on link-following for discovery, especially for pages with few or no inbound links.',
      "Structured data (JSON-LD) primarily affects how a search result is PRESENTED (rich results showing ratings, price, availability) rather than directly affecting ranking.",
      "Inserting JSON-LD via dangerouslySetInnerHTML is safe specifically because the content is built entirely from trusted, server-controlled data — the same 'genuinely trusted content' exception Module 12's XSS lesson described, not a contradiction of it.",
    ],
    keyTakeawaysHi: [
      'Metadata API (generateMetadata, static metadata exports) control karta hai ki search engines aur social platforms ek page ke liye kya dikhate hain — page ke actual visible content se ek genuinely separate concern.',
      'Ek sitemap search engines ke liye har page ko explicitly list karta hai, discovery ke liye purely link-following pe rely karne ki uncertainty hatate hue, especially un pages ke liye jinke paas kam ya koi inbound links nahi.',
      'Structured data (JSON-LD) primarily affect karta hai ki ek search result kaise PRESENT hota hai (rich results jo ratings, price, availability dikhate hain) directly ranking ko affect karne ke bajaye.',
      'JSON-LD ko dangerouslySetInnerHTML ke through insert karna safe hai specifically kyunki content poori tarah trusted, server-controlled data se banaya gaya hai — wahi "genuinely trusted content" exception jise Module 12 ke XSS lesson ne describe kiya, uska contradiction nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-accessibility-audit',
    title: 'An Accessibility Audit — What Actually Matters, Concretely',
    titleHi: 'Ek Accessibility Audit — Actually Kya Matter Karta Hai, Concretely',
    description:
      "Accessibility isn't a vague, abstract virtue — it's a concrete set of checks that determine whether a real person using a screen reader, navigating by keyboard alone, or with low vision can actually use the app, and most of the highest-impact fixes are specific and mechanical, not subjective.",
    descriptionHi:
      'Accessibility ek vague, abstract virtue nahi hai — ye ek concrete set of checks hai jo determine karta hai ki kya ek real insaan jo ek screen reader use karta hai, sirf keyboard se navigate karta hai, ya low vision ke saath, app ko actually use kar sakta hai, aur zyadatar highest-impact fixes specific aur mechanical hain, subjective nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A building with stairs only, versus one with a ramp — but also a building whose signage is genuinely readable versus one whose signs are technically present but illegibly small or oddly placed.** A ramp for wheelchair access is the obvious, well-known accessibility feature. But a building can have a perfect ramp and still fail people in other concrete ways: signage in tiny, low-contrast text is technically 'there' but genuinely unusable for someone with low vision, and a door that only opens via a hard-to-reach handle high on the wall fails someone using a wheelchair the moment they're past the ramp. Web accessibility works the same way — it's a specific checklist of concrete, fixable issues (keyboard reachability, color contrast, accessible names, focus indicators), not one single feature to add, and missing any one of them genuinely locks out a real category of users, not a hypothetical one.",
      hi: 'Ek building jisme sirf stairs hain, versus ek jisme ek ramp hai — par ek building jiska signage genuinely readable hai versus ek jiske signs technically present hain par illegibly small ya oddly placed hain. Wheelchair access ke liye ek ramp obvious, well-known accessibility feature hai. Par ek building ke paas ek perfect ramp ho sakta hai aur phir bhi doosre concrete tareekon se logon ko fail kar sakta hai: tiny, low-contrast text mein signage technically \'wahan hai\' par genuinely unusable hai kisi ke liye jiski low vision hai, aur ek door jo sirf ek hard-to-reach handle se khulta hai wall pe high, ek wheelchair use karne wale kisi ko fail karta hai jis moment wo ramp cross kar chuke hon. Web accessibility isi tarah kaam karta hai — ye concrete, fixable issues ki ek specific checklist hai (keyboard reachability, color contrast, accessible names, focus indicators), ek single feature add karne ke liye nahi, aur inme se kisi ek ko miss karna genuinely users ki ek real category ko lock out karta hai, ek hypothetical wale ko nahi.',
    },

    simple: `**A concrete, checkable list — not a vague aspiration:**

\`\`\`
1. KEYBOARD REACHABILITY — can every interactive element be reached and
   operated using ONLY a keyboard (Tab, Enter, Space, arrow keys), with
   no mouse at all?

2. ACCESSIBLE NAMES — does every button, link, and form field have a
   name a screen reader can announce (visible text, or an explicit label
   when visible text isn't practical)?

3. COLOR CONTRAST — is text readable against its background at a
   sufficient contrast ratio, for someone with low vision or color
   blindness?

4. FOCUS INDICATORS — when navigating by keyboard, is it ALWAYS visually
   obvious which element currently has focus?

5. SEMANTIC HTML — are headings, lists, and buttons actual <h1>-<h6>,
   <ul>/<li>, and <button> elements (which come with built-in
   accessibility behavior for free), rather than styled <div>s?
\`\`\`

**A common, concrete failure — an icon-only button with no accessible
name:**

\`\`\`tsx
// INACCESSIBLE: a screen reader announces this as just "button" —
// no indication of what it actually does
<button onClick={closeModal}>
  <XIcon />
</button>

// ACCESSIBLE: an explicit accessible name via aria-label
<button onClick={closeModal} aria-label="Close dialog">
  <XIcon />
</button>
\`\`\`

**Another common, concrete failure — a \`<div>\` doing a button's job:**

\`\`\`tsx
// INACCESSIBLE: not keyboard-reachable at all, no accessible role
<div onClick={handleClick}>Submit</div>

// ACCESSIBLE: a real <button> — keyboard support and the right
// accessible role come for free, with zero extra code
<button onClick={handleClick}>Submit</button>
\`\`\`

**Tools that make most of this mechanically checkable, not subjective:**

\`\`\`
axe DevTools / Lighthouse's accessibility audit -> automatically flags
a genuinely large share of common issues (missing accessible names,
insufficient contrast, missing form labels) without needing a human
judgment call for most of them

Manual keyboard-only testing (unplug the mouse, navigate with Tab alone)
-> catches the specific class of issue automated tools often miss:
whether the actual EXPERIENCE of using only a keyboard feels coherent
\`\`\`

**Why this connects back to Lesson 1's React Testing Library discussion:**
Module 18 noted that querying by \`getByRole\` has a side benefit of
surfacing accessibility gaps — this lesson is that side benefit made
explicit and central: writing tests the way a screen reader "sees" a page
and running an accessibility audit are checking overlapping, related
things, because both are fundamentally about whether the page's structure
is genuinely meaningful beyond its visual appearance.`,

    simpleHi: `**Ek concrete, checkable list — ek vague aspiration nahi:**

\`\`\`
1. KEYBOARD REACHABILITY — kya har interactive element ko SIRF ek
   keyboard use karke reach aur operate kiya ja sakta hai (Tab, Enter,
   Space, arrow keys), bilkul mouse ke bina?

2. ACCESSIBLE NAMES — kya har button, link, aur form field ka ek naam
   hai jo ek screen reader announce kar sake (visible text, ya ek
   explicit label jab visible text practical na ho)?

3. COLOR CONTRAST — kya text apne background ke against ek sufficient
   contrast ratio pe readable hai, kisi ke liye jiski low vision ya
   color blindness hai?

4. FOCUS INDICATORS — jab keyboard se navigate karte ho, kya ye HAMESHA
   visually obvious hai ki kaunsa element currently focus rakhta hai?

5. SEMANTIC HTML — kya headings, lists, aur buttons actual <h1>-<h6>,
   <ul>/<li>, aur <button> elements hain (jo built-in accessibility
   behavior free mein dete hain), styled <div>s ke bajaye?
\`\`\`

**Ek common, concrete failure — ek icon-only button jiska koi accessible
naam nahi:**

\`\`\`tsx
// INACCESSIBLE: ek screen reader ise bas "button" announce karta hai —
// koi indication nahi ki ye actually kya karta hai
<button onClick={closeModal}>
  <XIcon />
</button>

// ACCESSIBLE: aria-label ke through ek explicit accessible name
<button onClick={closeModal} aria-label="Close dialog">
  <XIcon />
</button>
\`\`\`

**Ek aur common, concrete failure — ek \`<div>\` jo ek button ka kaam
kar raha hai:**

\`\`\`tsx
// INACCESSIBLE: keyboard-reachable bilkul nahi, koi accessible role nahi
<div onClick={handleClick}>Submit</div>

// ACCESSIBLE: ek real <button> — keyboard support aur sahi accessible
// role free mein aate hain, zero extra code ke saath
<button onClick={handleClick}>Submit</button>
\`\`\`

**Tools jo isme se zyadatar ko mechanically checkable banate hain,
subjective nahi:**

\`\`\`
axe DevTools / Lighthouse ka accessibility audit -> automatically ek
genuinely bade share ke common issues ko flag karta hai (missing
accessible names, insufficient contrast, missing form labels) bina
zyadatar ke liye ek human judgment call chahiye

Manual keyboard-only testing (mouse unplug karo, sirf Tab se navigate
karo) -> is specific class ke issue ko catch karta hai jise automated
tools aksar miss karte hain: kya sirf keyboard use karne ka actual
EXPERIENCE coherent feel karta hai
\`\`\`

**Ye Lesson 1 ki React Testing Library discussion se wapas kyun connect
karta hai:** Module 18 ne note kiya ki \`getByRole\` se query karne ka ek
side benefit accessibility gaps surface karna hai — ye lesson wo side
benefit hai jo explicit aur central banaya gaya: tests likhna us tarike se
jaise ek screen reader ek page ko "dekhta" hai aur ek accessibility audit
chalana overlapping, related cheezein check kar rahe hain, kyunki dono
fundamentally is baat ke baare mein hain ki kya page ki structure uski
visual appearance se pare genuinely meaningful hai.`,

    content: `## Why treating accessibility as a fixed checklist rather than a vague
value is what makes it actionable

"Make the app accessible" is genuinely hard to act on directly, because
it doesn't specify what to actually check or fix. Breaking it into
concrete, individually verifiable items (keyboard reachability, accessible
names, contrast ratios, focus indicators, semantic HTML) turns an abstract
goal into a list a developer can actually work through and a tool can
actually automate checking for — this is precisely why automated
accessibility auditing tools can catch a genuinely large share of real
issues without needing subjective human judgment for most of them.

## Why semantic HTML elements matter beyond just "best practice"

A native \`<button>\` element comes with keyboard support (activatable via
Enter and Space), a correct accessible role announced to screen readers,
and standard focus behavior — all built into the browser, for free, the
moment you use the actual element. Recreating a button's visual appearance
with a styled \`<div>\` and an \`onClick\` handler discards ALL of this free
behavior, requiring a developer to manually reimplement keyboard handling,
ARIA roles, and focus management correctly to reach the same baseline a
plain \`<button>\` provides automatically. This is why reaching for the
correct semantic element first is usually less total work, not more,
despite feeling like a constraint on styling flexibility.

## What automated tools catch, and what genuinely still requires manual
testing

Tools like axe DevTools and Lighthouse's accessibility audit are
excellent at catching structural, mechanically-detectable issues — a
missing \`alt\` attribute, insufficient color contrast, a form input with no
associated label. What they cannot fully verify is the actual EXPERIENCE
of using the page with a specific assistive technology — whether tabbing
through a complex interactive widget (a custom dropdown, a modal) actually
feels coherent and doesn't trap keyboard focus, whether the order elements
receive focus in makes logical sense. This is why manual keyboard-only
testing (literally unplugging the mouse and navigating with Tab, Enter,
and arrow keys alone) remains a necessary complement to automated
scanning, the same "automated tools catch a lot, but not everything"
pattern Module 18 covered for unit versus E2E testing.

## Why this lesson is positioned right before the final go-live checklist

Accessibility issues share a specific quality with several other topics
this course has covered — XSS (Module 12), CSRF (Module 12), IDOR
(Module 13): each is invisible in the MOST common path through an app (a
sighted, mouse-using visitor never notices a missing accessible name) but
genuinely excludes or harms a specific, real population when neglected.
Placing a concrete accessibility audit immediately before the final launch
checklist (Lesson 3) reflects that accessibility deserves the same
deliberate, checklist-driven attention before shipping as security and
correctness do — not an afterthought bolted on if time permits.`,

    contentHi: `## Accessibility ko ek fixed checklist ki tarah treat karna ek vague value ke bajaye ise actionable kyun banata hai

"App ko accessible banao" directly act karna genuinely mushkil hai,
kyunki ye specify nahi karta ki actually kya check ya fix karna hai. Ise
concrete, individually verifiable items mein todna (keyboard
reachability, accessible names, contrast ratios, focus indicators,
semantic HTML) ek abstract goal ko ek list mein badal deta hai jise ek
developer actually kaam kar sakta hai aur ek tool actually automate kar
sakta hai check karne ke liye — yahi precisely wajah hai ki automated
accessibility auditing tools real issues ke ek genuinely bade share ko
catch kar sakte hain bina zyadatar ke liye subjective human judgment
chahiye.

## Semantic HTML elements sirf "best practice" se pare kyun matter karte hain

Ek native \`<button>\` element keyboard support ke saath aata hai
(Enter aur Space se activatable), screen readers ko announce hone wala
ek correct accessible role, aur standard focus behavior — sab browser
mein built-in, free mein, jis moment aap actual element use karte ho. Ek
button ki visual appearance ko ek styled \`<div>\` aur ek \`onClick\` handler
se recreate karna is FREE behavior ko poori tarah discard kar deta hai,
ek developer ko manually keyboard handling, ARIA roles, aur focus
management ko correctly reimplement karne ki zaroorat rakhte hue wahi
baseline paane ke liye jo ek plain \`<button>\` automatically provide karta
hai. Yahi wajah hai ki pehle correct semantic element ko reach karna
usually kam total kaam hai, zyada nahi, chahe ye styling flexibility pe
ek constraint jaisa feel kare.

## Automated tools kya catch karte hain, aur genuinely kya abhi bhi manual testing chahta hai

axe DevTools aur Lighthouse ka accessibility audit jaise tools
structural, mechanically-detectable issues ko catch karne mein excellent
hain — ek missing \`alt\` attribute, insufficient color contrast, ek form
input jiska koi associated label nahi. Jo wo poori tarah verify nahi kar
sakte wo ek specific assistive technology ke saath page use karne ka
actual EXPERIENCE hai — kya ek complex interactive widget (ek custom
dropdown, ek modal) ke through tab karna actually coherent feel karta hai
aur keyboard focus trap nahi karta, kya jis order mein elements focus
receive karte hain wo logical sense banata hai. Yahi wajah hai ki manual
keyboard-only testing (literally mouse unplug karke aur Tab, Enter, aur
arrow keys akele se navigate karke) automated scanning ka ek zaroori
complement rehta hai, wahi "automated tools kaafi catch karte hain, par
sab kuch nahi" pattern jise Module 18 ne unit versus E2E testing ke liye
cover kiya.

## Ye lesson final go-live checklist se bilkul pehle kyun position kiya gaya

Accessibility issues is course ne cover ki hai un kai doosre topics ke
saath ek specific quality share karte hain — XSS (Module 12), CSRF
(Module 12), IDOR (Module 13): har ek ek app ke through sabse common
path mein invisible hai (ek sighted, mouse-using visitor ek missing
accessible name kabhi notice nahi karta) par genuinely ek specific, real
population ko exclude ya harm karta hai jab neglect kiya jaaye. Final
launch checklist (Lesson 3) se bilkul pehle ek concrete accessibility
audit rakhna reflect karta hai ki accessibility ko shipping se pehle wahi
deliberate, checklist-driven attention deserve karta hai jo security aur
correctness dete hain — koi afterthought nahi jo time permit karne pe
bolt kiya jaaye.`,

    examples: [
      {
        title: 'Fixing three common, mechanically-detectable accessibility issues',
        titleHi: 'Teen common, mechanically-detectable accessibility issues fix karna',
        codeJs: `// BEFORE: three real, common accessibility failures
function SearchWidget() {
  return (
    <div>
      {/* 1. Icon-only button, no accessible name */}
      <button onClick={handleSearch}><SearchIcon /></button>

      {/* 2. Input with no associated label */}
      <input type="text" placeholder="Search..." />

      {/* 3. A div doing a link's job — not keyboard-reachable */}
      <div onClick={goToAdvancedSearch}>Advanced search</div>
    </div>
  );
}

// AFTER: each issue fixed with a small, specific change
function SearchWidget() {
  return (
    <div>
      <button onClick={handleSearch} aria-label="Search">
        <SearchIcon />
      </button>

      <label htmlFor="search-input">Search</label>
      <input id="search-input" type="text" placeholder="Search..." />

      <a href="/search/advanced">Advanced search</a>
    </div>
  );
}`,
        codeTs: `// BEFORE: three real, common accessibility failures
function SearchWidget() {
  return (
    <div>
      {/* 1. Icon-only button, no accessible name */}
      <button onClick={handleSearch}><SearchIcon /></button>

      {/* 2. Input with no associated label */}
      <input type="text" placeholder="Search..." />

      {/* 3. A div doing a link's job — not keyboard-reachable */}
      <div onClick={goToAdvancedSearch}>Advanced search</div>
    </div>
  );
}

// AFTER: each issue fixed with a small, specific change
function SearchWidget() {
  return (
    <div>
      <button onClick={handleSearch} aria-label="Search">
        <SearchIcon />
      </button>

      <label htmlFor="search-input">Search</label>
      <input id="search-input" type="text" placeholder="Search..." />

      <a href="/search/advanced">Advanced search</a>
    </div>
  );
}`,
        code: `<button onClick={handleSearch} aria-label="Search"><SearchIcon /></button>
<label htmlFor="search-input">Search</label>
<input id="search-input" type="text" placeholder="Search..." />
<a href="/search/advanced">Advanced search</a>`,
        output:
          "A screen reader now announces 'Search, button' instead of just 'button', the search input's label is programmatically associated so a screen reader announces it correctly, and 'Advanced search' is now reachable and activatable via keyboard Tab and Enter, exactly like every other link on the page.",
        explain:
          "Each fix is small, specific, and mechanically verifiable (an automated audit tool would flag all three issues before the fix and confirm all three resolved after) — this is what makes accessibility work tractable rather than an open-ended, subjective effort.",
        explainHi:
          "Har fix chhota, specific, aur mechanically verifiable hai (ek automated audit tool fix se pehle teenon issues flag karta aur fix ke baad teenon resolved confirm karta) — yahi wajah hai jo accessibility kaam ko tractable banata hai ek open-ended, subjective effort ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using a styled div instead of a real button, discarding built-in accessibility
function DeleteButton({ onDelete }) {
  return (
    <div className="delete-btn" onClick={onDelete}>
      Delete
    </div>
  );
  // Not reachable via Tab, no accessible role announced, Enter/Space
  // do nothing — all of this would need to be manually reimplemented
  // to match what a real <button> provides automatically.
}`,
        right: `// Using the actual button element
function DeleteButton({ onDelete }) {
  return (
    <button className="delete-btn" onClick={onDelete}>
      Delete
    </button>
  );
  // Keyboard reachability, accessible role, and Enter/Space activation
  // all come free, with zero additional code.
}`,
        why: "A styled <div> with an onClick handler discards every accessibility behavior a real <button> provides automatically — keyboard focusability, activation via Enter/Space, and an accessible role announced to screen readers. Recreating these manually is more total work than simply using the correct semantic element from the start.",
        whyHi:
          "Ek onClick handler wala styled <div> har accessibility behavior discard kar deta hai jo ek real <button> automatically provide karta hai — keyboard focusability, Enter/Space se activation, aur screen readers ko announce hone wala ek accessible role. Inhe manually recreate karna shuru se correct semantic element use karne se zyada total kaam hai.",
      },
    ],

    realWorld: [
      {
        en: "A legal requirement in many jurisdictions (ADA in the US, similar laws elsewhere) makes web accessibility a genuine compliance concern, not just a courtesy — companies have faced real lawsuits over inaccessible websites, which is why a growing number of production teams run automated accessibility audits (axe, Lighthouse) as a required, blocking step in their CI pipeline (Module 19), the same way tests and builds are required to pass before a deploy proceeds.",
        hi: 'Kai jurisdictions mein ek legal requirement (US mein ADA, kahin aur similar laws) web accessibility ko ek genuine compliance concern banata hai, sirf ek courtesy nahi — companies ne inaccessible websites ke over real lawsuits face ki hain, yahi wajah hai ki badhti hui number mein production teams automated accessibility audits (axe, Lighthouse) apne CI pipeline mein ek required, blocking step ki tarah chalate hain (Module 19), wahi tarike se jaise tests aur builds ko ek deploy proceed karne se pehle pass karna required hota hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does using a native <button> element instead of a styled <div> matter for accessibility, beyond convention?",
        qHi: 'Ek styled <div> ke bajaye ek native <button> element use karna accessibility ke liye convention se pare kyun matter karta hai?',
        a: "A native <button> comes with keyboard reachability, activation via Enter/Space, and a correct accessible role announced to screen readers, all built into the browser for free. A styled div with an onClick handler has none of this by default, requiring a developer to manually and correctly reimplement all of it to reach the same baseline.",
        aHi: 'Ek native <button> keyboard reachability, Enter/Space se activation, aur screen readers ko announce hone wala ek correct accessible role ke saath aata hai, sab browser mein free mein built-in. Ek onClick handler wale styled div mein default se inme se kuch nahi hota, ek developer ko wahi baseline paane ke liye in sab ko manually aur correctly reimplement karna padta hai.',
      },
      {
        q: "What can automated accessibility tools (axe, Lighthouse) NOT fully verify, requiring manual testing instead?",
        qHi: 'Automated accessibility tools (axe, Lighthouse) kya poori tarah verify NAHI kar sakte, manual testing ki zaroorat rakhte hue?',
        a: "They cannot fully verify the actual experience of using a page with specific assistive technology — whether navigating a complex interactive widget by keyboard alone feels coherent, whether focus order makes logical sense, or whether keyboard focus ever gets trapped. This requires literally testing with a keyboard alone (or a real screen reader), the same way automated unit tests can't substitute for E2E testing a real user flow (Module 18).",
        aHi: 'Wo poori tarah verify nahi kar sakte ki specific assistive technology ke saath ek page use karne ka actual experience kaisa hai — kya sirf keyboard se ek complex interactive widget navigate karna coherent feel karta hai, kya focus order logical sense banata hai, ya kya keyboard focus kabhi trap ho jata hai. Isko literally akele keyboard se (ya ek real screen reader se) test karna chahiye, wahi tarike se jaise automated unit tests ek real user flow (Module 18) ko E2E test karne ka substitute nahi ho sakte.',
      },
    ],

    exercises: [
      {
        task: "A modal dialog on a page can be opened with a mouse click but, once open, pressing Tab moves keyboard focus to elements behind the modal rather than staying within it. Explain why this is a real accessibility failure, and what category of testing (automated or manual) would be needed to catch it.",
        taskHi: 'Ek page pe ek modal dialog ko mouse click se khola ja sakta hai par, ek baar open hone ke baad, Tab press karna keyboard focus ko modal ke peeche ke elements pe move kar deta hai uske andar rehne ke bajaye. Explain karo ye ek real accessibility failure kyun hai, aur ise catch karne ke liye kis category ki testing (automated ya manual) chahiye.',
        hint: "Think about what a keyboard-only user (who cannot click outside the modal to dismiss the confusion) would actually experience in this situation.",
        hintHi: 'Socho ki ek keyboard-only user (jo modal ke bahar click nahi kar sakta confusion dismiss karne ke liye) is situation mein actually kya experience karega.',
      },
    ],

    keyTakeaways: [
      "Accessibility is a concrete, checkable list (keyboard reachability, accessible names, color contrast, focus indicators, semantic HTML) rather than a vague aspiration — this is what makes it actionable and largely automatable.",
      'Native semantic HTML elements (button, a, label) provide keyboard support, correct accessible roles, and focus behavior for free — recreating a button\'s appearance with a styled div discards all of this, requiring manual reimplementation.',
      'Automated tools (axe, Lighthouse) catch a large share of structural issues mechanically, but the actual experience of using a page with a specific assistive technology (keyboard-only navigation, focus order) still requires manual testing.',
      "Accessibility issues share the same invisible-in-the-common-path quality as security bugs (XSS, IDOR) — invisible to a typical sighted, mouse-using visitor but genuinely excluding a real population when neglected.",
    ],
    keyTakeawaysHi: [
      'Accessibility ek concrete, checkable list hai (keyboard reachability, accessible names, color contrast, focus indicators, semantic HTML) ek vague aspiration ke bajaye — yahi wajah hai jo ise actionable aur largely automatable banata hai.',
      'Native semantic HTML elements (button, a, label) keyboard support, correct accessible roles, aur focus behavior free mein provide karte hain — ek button ki appearance ko ek styled div se recreate karna in sab ko discard kar deta hai, manual reimplementation chahte hue.',
      'Automated tools (axe, Lighthouse) structural issues ke ek bade share ko mechanically catch karte hain, par ek specific assistive technology ke saath ek page use karne ka actual experience (keyboard-only navigation, focus order) abhi bhi manual testing chahta hai.',
      'Accessibility issues security bugs (XSS, IDOR) ke saath wahi invisible-in-the-common-path quality share karte hain — ek typical sighted, mouse-using visitor ke liye invisible par neglect hone pe ek real population ko genuinely exclude karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-final-go-live-checklist-capstone',
    title: 'The Final Go-Live Checklist — A Capstone Review',
    titleHi: 'Final Go-Live Checklist — Ek Capstone Review',
    description:
      "Every module in this course added one piece to a production-ready app — this final lesson doesn't introduce anything new. It's a single, concrete checklist tying every module's specific contribution together, reviewed the way a real team would review a small app right before its first real launch.",
    descriptionHi:
      'Is course ke har module ne ek production-ready app mein ek piece add kiya — ye final lesson kuch naya introduce nahi karta. Ye ek single, concrete checklist hai jo har module ke specific contribution ko saath tie karta hai, review kiya gaya us tarike se jaise ek real team ek chhote app ko uske pehle real launch se bilkul pehle review karegi.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A pilot's pre-flight checklist, gone through methodically one item at a time, right before every single takeoff — not because the pilot forgot how planes work, but because a checklist catches exactly the specific thing that skill and experience alone reliably miss under real pressure.** An experienced pilot genuinely knows how to fly the plane — the checklist isn't teaching them anything new. Its entire value is structural: it forces a specific, complete review of specific systems in a specific order, every single time, regardless of how confident or rushed anyone feels in the moment. This course's final checklist plays exactly that role — not new material, but the discipline of actually walking through everything already learned, deliberately, before the moment (launch) where a skipped check has real consequences.",
      hi: 'Ek pilot ki pre-flight checklist, methodically ek time pe ek item ke through jaate hue, har single takeoff se bilkul pehle — is wajah se nahi ki pilot bhool gaya planes kaise kaam karte hain, balki isliye kyunki ek checklist exactly wo specific cheez catch karti hai jise skill aur experience akele reliably real pressure ke under miss kar dete hain. Ek experienced pilot genuinely jaanta hai plane kaise udaya jata hai — checklist unhe kuch naya nahi sikha rahi. Iski poori value structural hai: ye ek specific, complete review force karti hai specific systems ka ek specific order mein, har single baar, chahe us moment koi kitna bhi confident ya rushed feel kare. Is course ki final checklist exactly wahi role play karti hai — koi naya material nahi, balki wo discipline jo actually har us cheez ko walk through karti hai jo already seekhi ja chuki hai, deliberately, us moment (launch) se pehle jahan ek skipped check ke real consequences hote hain.',
    },

    simple: `**A go-live checklist, organized by which module of this course each
item traces back to — every item here is a review, not new material:**

\`\`\`
FOUNDATIONS & RENDERING (Modules 1-4)
[ ] Each route uses the rendering strategy (SSR/SSG/ISR) matched to
    how often its data actually changes
[ ] No unnecessary sequential-await waterfalls in data fetching

FORMS & DATA AT SCALE (Modules 5-7)
[ ] Every form validates with Zod on the server, not just the client
[ ] Large lists/datasets use pagination or virtualization as needed
[ ] File uploads use presigned URLs, never proxied through the app server

IDENTITY & MONEY (Modules 8-10)
[ ] Passwords are hashed (bcrypt/argon2), never stored in plain text
[ ] Middleware auth gate + fine-grained role checks are both in place
[ ] Database connections use a pooler appropriate for the deploy target
[ ] Stripe webhooks verify signatures using the RAW request body
[ ] Payment API calls that could be retried use idempotency keys

REAL-TIME & SECURITY (Modules 11-14)
[ ] dangerouslySetInnerHTML usages are grepped and each one verified safe
[ ] Security headers and a CSP are configured
[ ] No secret is prefixed NEXT_PUBLIC_
[ ] Rate limiting is in place on auth and any metered endpoints
[ ] Every Server Action independently re-checks auth — none assume
    a prior check already ran

PERFORMANCE & SCALE (Modules 15-17)
[ ] Bundle analysis has been run at least once; large/rare dependencies
    are dynamically imported
[ ] Fonts are loaded via next/font, not an external CDN link
[ ] Core Web Vitals have actually been measured, not assumed acceptable

SHIPPING IT (Modules 18-20)
[ ] Critical user flows (signup, checkout) have E2E test coverage
[ ] Error boundaries are in place AND reporting to an error tracker
[ ] A real health check endpoint exists and is wired to infrastructure
[ ] Environment variables are correctly, separately configured per
    environment — verified, not assumed
[ ] Metadata, sitemap, and structured data are in place
[ ] An accessibility audit has actually been run, not just assumed fine
\`\`\`

**Why this checklist is organized by module rather than alphabetically or
by "importance":** the organization itself is the point — it demonstrates
that a genuinely production-ready app isn't the result of one single
"security pass" or "performance pass" done at the end; it's the
accumulated result of dozens of specific, deliberate decisions made
throughout building the app, each traceable to a specific lesson in this
course. Going through this checklist right before a real launch isn't
learning anything new — it's confirming that what was already learned
was actually APPLIED, consistently, across the whole app.`,

    simpleHi: `**Ek go-live checklist, is course ke kaunse module se har item trace
hota hai uske basis par organized — yahan har item ek review hai, naya
material nahi:**

\`\`\`
FOUNDATIONS & RENDERING (Modules 1-4)
[ ] Har route ek rendering strategy (SSR/SSG/ISR) use karta hai jo match
    karta hai ki uska data actually kitni baar change hota hai
[ ] Data fetching mein koi unnecessary sequential-await waterfalls nahi

FORMS & DATA AT SCALE (Modules 5-7)
[ ] Har form Zod se server pe validate hota hai, sirf client pe nahi
[ ] Large lists/datasets zaroorat ke hisab se pagination ya
    virtualization use karte hain
[ ] File uploads presigned URLs use karte hain, kabhi app server se
    proxied nahi

IDENTITY & MONEY (Modules 8-10)
[ ] Passwords hashed hain (bcrypt/argon2), kabhi plain text mein
    store nahi
[ ] Middleware auth gate + fine-grained role checks dono jagah pe hain
[ ] Database connections deploy target ke liye appropriate ek pooler
    use karte hain
[ ] Stripe webhooks RAW request body use karke signatures verify karte hain
[ ] Payment API calls jo retry ho sakte hain idempotency keys use karte hain

REAL-TIME & SECURITY (Modules 11-14)
[ ] dangerouslySetInnerHTML usages grepped hain aur har ek safe verify
    kiya gaya hai
[ ] Security headers aur ek CSP configured hain
[ ] Koi secret NEXT_PUBLIC_ prefixed nahi hai
[ ] Rate limiting auth aur kisi bhi metered endpoints pe jagah pe hai
[ ] Har Server Action independently auth re-check karta hai — koi bhi
    ye assume nahi karta ki ek prior check already chal chuka hai

PERFORMANCE & SCALE (Modules 15-17)
[ ] Bundle analysis kam se kam ek baar chala hai; large/rare
    dependencies dynamically imported hain
[ ] Fonts next/font ke through load hote hain, ek external CDN link se nahi
[ ] Core Web Vitals actually measure kiye gaye hain, acceptable assume
    nahi kiye gaye

SHIPPING IT (Modules 18-20)
[ ] Critical user flows (signup, checkout) mein E2E test coverage hai
[ ] Error boundaries jagah pe hain AUR ek error tracker ko report kar
    rahe hain
[ ] Ek real health check endpoint exist karta hai aur infrastructure se
    wired hai
[ ] Environment variables correctly, separately per environment
    configured hain — verified, assume nahi kiye gaye
[ ] Metadata, sitemap, aur structured data jagah pe hain
[ ] Ek accessibility audit actually chalaya gaya hai, sirf fine assume
    nahi kiya gaya
\`\`\`

**Ye checklist module se organized kyun hai alphabetically ya
"importance" se nahi:** organization khud point hai — ye demonstrate
karta hai ki ek genuinely production-ready app ek single "security pass"
ya "performance pass" ka result nahi hai jo ant mein kiya gaya; ye
dozens of specific, deliberate decisions ka accumulated result hai jo
poori app banate waqt liye gaye, har ek is course ke ek specific lesson
tak traceable. Ek real launch se bilkul pehle is checklist ke through
jaana kuch naya seekhna nahi hai — ye confirm karna hai ki jo already
seekha gaya wo actually APPLY kiya gaya, consistently, poori app mein.`,

    content: `## Why a capstone checklist is the right way to close this course, not
a new topic

Every lesson in this course taught something specific and, in isolation,
easy to nod along with. The genuine, harder skill a working engineer needs
is different: actually remembering and applying dozens of these lessons
simultaneously, under real time pressure, on an app that's grown complex
enough that no single lesson is obviously "the" relevant one anymore. A
checklist is the practical answer to this — not a replacement for
understanding WHY each item matters (which every prior lesson already
covered), but a structural guarantee that nothing gets silently skipped
simply because the person reviewing didn't happen to think of it at that
moment.

## Why the checklist is organized by module, not by severity or
alphabetically

Organizing by module (rather than, say, "critical/important/nice-to-have")
makes a specific point visible: production-readiness isn't a single
axis you optimize once. Security items sit alongside performance items
sit alongside SEO items because a genuinely production-ready app needs
all of these simultaneously, not ranked against each other — a site with
perfect security and terrible SEO isn't "more done" than one with the
reverse; both are incomplete in a real, specific way this checklist makes
concrete rather than abstract.

## Why "review" is different from "re-learn" at this point in the course

By this point in the course, every item on this checklist should feel
familiar — that's the intended experience, not a flaw in the checklist.
The value of walking through it deliberately, one item at a time, right
before a real launch, is specifically that familiarity with a concept
and confirmed application of that concept in THIS SPECIFIC app are
different facts. A developer can genuinely understand why Server Actions
need independent auth checks (Module 14) and still have shipped one that
doesn't, simply because that specific function was written on a rushed
afternoon three weeks before launch — the checklist exists to catch
exactly this gap between understanding and verified application.

## What this checklist deliberately does not cover, and why

This checklist is scoped to what THIS course covered — it is not an
exhaustive, universal production checklist for every possible app (it
doesn't cover industry-specific compliance requirements, internationalization,
or business-specific launch criteria, for instance). Treating any
checklist as complete and final, rather than as a living document
extended with lessons learned from each specific app and each specific
team's history, is itself a mistake — the discipline of maintaining and
extending a checklist matters more than any single version of it ever
being "finished."

## Closing thought

Across these twenty modules, the throughline was never a single
technique — it was a way of asking questions before writing code: what
happens if this is called directly, bypassing the UI; what happens under
real traffic, not just a local test; who is this data actually visible
to; what does a real user with a screen reader or a slow connection
actually experience. A framework, a library, or a checklist can encode
good defaults, but the habit of asking those questions on every new
feature — not just the ones covered explicitly in a course — is the
actual skill this course was building toward the whole time.`,

    contentHi: `## Ek capstone checklist is course ko close karne ka sahi tareeka kyun hai, koi naya topic nahi

Is course ke har lesson ne kuch specific sikhaya aur, isolation mein,
saath sehmat hona aasan tha. Ek working engineer ko jo genuine, harder
skill chahiye wo alag hai: actually in dozens lessons ko simultaneously
yaad rakhna aur apply karna, real time pressure ke under, ek aise app pe
jo itna complex ho gaya hai ki koi single lesson ab obviously "wo" relevant
wala nahi hai. Ek checklist iska practical jawab hai — ye samajhne ka
replacement nahi hai ki har item KYUN matter karta hai (jo har prior
lesson already cover kar chuka hai), par ek structural guarantee hai ki
kuch bhi silently skip nahi hota simply isliye kyunki review karne wale
insaan ko us moment iske baare mein sochna nahi hua.

## Checklist module se organized hai kyun, severity ya alphabetically nahi

Module se organize karna (kisi aur cheez ke bajaye, jaise
"critical/important/nice-to-have") ek specific point ko visible banata
hai: production-readiness ek single axis nahi hai jise aap ek baar
optimize karte ho. Security items performance items ke saath baithte hain
SEO items ke saath, kyunki ek genuinely production-ready app ko in sab ki
simultaneously zaroorat hai, ek doosre ke against ranked nahi — ek site
perfect security aur terrible SEO ke saath "zyada done" nahi hai reverse
wali se; dono incomplete hain ek real, specific tarike se jise ye
checklist concrete banata hai abstract ke bajaye.

## Is point pe course mein "review" "re-learn" se kyun alag hai

Course ke is point tak, is checklist ka har item familiar feel karna
chahiye — yahi intended experience hai, checklist mein koi flaw nahi.
Ise deliberately, ek time pe ek item, ek real launch se bilkul pehle
walk through karne ki value specifically ye hai ki ek concept se
familiarity aur IS SPECIFIC app mein us concept ka confirmed application
alag facts hain. Ek developer genuinely samajh sakta hai ki Server
Actions ko independent auth checks (Module 14) kyun chahiye aur phir bhi
ek aisa ship kar chuka ho jo nahi karta, simply isliye kyunki wo specific
function ek rushed afternoon pe likha gaya tha launch se teen hafte
pehle — checklist exactly is gap ko catch karne ke liye exist karti hai
understanding aur verified application ke beech.

## Ye checklist deliberately kya cover nahi karti, aur kyun

Ye checklist us cheez tak scoped hai jo IS course ne cover ki — ye har
possible app ke liye ek exhaustive, universal production checklist nahi
hai (ye industry-specific compliance requirements, internationalization,
ya business-specific launch criteria cover nahi karti, misaal ke taur
pe). Kisi bhi checklist ko complete aur final treat karna, ek living
document ke bajaye jise har specific app aur har specific team ki history
se seekhe gaye lessons se extend kiya jata hai, khud ek mistake hai —
ek checklist ko maintain aur extend karne ki discipline kisi bhi single
version se zyada matter karti hai kabhi "finished" hone se.

## Closing thought

In bees modules ke across, throughline kabhi ek single technique nahi
tha — ye code likhne se pehle sawaal poochhne ka ek tareeka tha: kya
hota hai agar ise directly call kiya jaaye, UI ko bypass karte hue; kya
hota hai real traffic ke under, sirf ek local test nahi; ye data actually
kise visible hai; ek real user jiske paas ek screen reader ya ek slow
connection hai actually kya experience karta hai. Ek framework, ek
library, ya ek checklist achhe defaults encode kar sakti hai, par har
naye feature pe wo sawaal poochhne ki habit — sirf un pe nahi jo ek
course mein explicitly cover kiye gaye — wo actual skill hai jise ye
course poore time build karne ki taraf kaam kar raha tha.`,

    examples: [
      {
        title: 'Applying the checklist to a small app and finding one genuine gap',
        titleHi: 'Ek chhote app pe checklist apply karna aur ek genuine gap dhundhna',
        codeJs: `// A small team runs through the go-live checklist on their app before launch.
// Most items check out — but one specific gap surfaces:

// app/actions.js — found while checking "every Server Action independently
// re-checks auth" (Module 14's item)
export async function updateTeamSettings(teamId, settings) {
  'use server';
  // NO auth check at all — written quickly, assumed the settings page
  // (which DOES check auth) was the only possible caller
  await db.team.update({ where: { id: teamId }, data: settings });
}

// THE FIX — applying Module 14's lesson, caught specifically because
// the checklist forced a deliberate re-check of this exact item
export async function updateTeamSettings(teamId, settings) {
  'use server';
  const session = await getSession();
  const membership = await db.teamMember.findFirst({
    where: { teamId, userId: session.userId, role: 'admin' },
  });
  if (!membership) throw new Error('Not authorized');
  await db.team.update({ where: { id: teamId }, data: settings });
}`,
        codeTs: `// A small team runs through the go-live checklist on their app before launch.
// Most items check out — but one specific gap surfaces:

// app/actions.ts — found while checking "every Server Action independently
// re-checks auth" (Module 14's item)
export async function updateTeamSettings(teamId: string, settings: object) {
  'use server';
  // NO auth check at all — written quickly, assumed the settings page
  // (which DOES check auth) was the only possible caller
  await db.team.update({ where: { id: teamId }, data: settings });
}

// THE FIX — applying Module 14's lesson, caught specifically because
// the checklist forced a deliberate re-check of this exact item
export async function updateTeamSettings(teamId: string, settings: object) {
  'use server';
  const session = await getSession();
  const membership = await db.teamMember.findFirst({
    where: { teamId, userId: session.userId, role: 'admin' },
  });
  if (!membership) throw new Error('Not authorized');
  await db.team.update({ where: { id: teamId }, data: settings });
}`,
        code: `const membership = await db.teamMember.findFirst({
  where: { teamId, userId: session.userId, role: 'admin' },
});
if (!membership) throw new Error('Not authorized');
await db.team.update({ where: { id: teamId }, data: settings });`,
        output:
          "Before the checklist review: updateTeamSettings works correctly through the app's own UI (since the settings page does check auth) but is a real, exploitable gap if called directly. After: the action independently verifies the caller is actually an admin of that specific team, closing the gap regardless of how the action is invoked.",
        explain:
          "This is a realistic illustration of the checklist's actual value: the team didn't need to relearn Module 14's lesson (they clearly understood it, since the settings PAGE correctly checks auth) — they needed a structural prompt to go back and verify that understanding was applied to EVERY relevant piece of code, not just the ones that came to mind first.",
        explainHi:
          "Ye checklist ki actual value ka ek realistic illustration hai: team ko Module 14 ka lesson relearn karne ki zaroorat nahi thi (wo clearly ise samajhte the, kyunki settings PAGE correctly auth check karta hai) — unhe ek structural prompt chahiye tha wapas jaake verify karne ke liye ki wo understanding HAR relevant piece of code pe applied thi, sirf un pe nahi jo pehle dimaag mein aaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating the checklist as a formality to rush through without actually verifying each item
// "We use Zod everywhere, bcrypt for passwords, and next/image — we're good."
// (said without actually grepping the codebase to confirm any of these
// claims are true for every relevant file, not just the ones remembered)`,
        right: `// Actually verifying each item concretely — e.g. grepping for a specific pattern
// grep -r "dangerouslySetInnerHTML" --include="*.tsx" .
// grep -rL "next/image" --include="*.tsx" app/ | xargs grep -l "<img"
// (searching for the ACTUAL absence of a pattern, not relying on memory
// of "we probably did this everywhere")`,
        why: "A checklist's value comes entirely from actually checking each item against the real codebase, not from confidently recalling that the team generally follows good practices. Memory of intent is not the same as verified fact — the entire premise of a checklist is that specific, deliberate verification catches gaps that general confidence does not.",
        whyHi:
          "Ek checklist ki value poori tarah har item ko real codebase ke against actually check karne se aati hai, confidently ye recall karne se nahi ki team generally good practices follow karti hai. Intent ki memory verified fact jaisa nahi hai — ek checklist ka poora premise ye hai ki specific, deliberate verification un gaps ko catch karta hai jo general confidence nahi karta.",
      },
    ],

    realWorld: [
      {
        en: "A mature engineering team's actual go-live checklist is typically a living document in their own repository, extended over time with specific lessons from past incidents — the exact same principle this course's checklist demonstrates, applied concretely to that team's own accumulated experience rather than a generic template.",
        hi: 'Ek mature engineering team ki actual go-live checklist typically unki apni repository mein ek living document hai, time ke saath past incidents se specific lessons ke saath extend ki gayi — exactly wahi principle jo is course ki checklist demonstrate karti hai, us team ke apne accumulated experience pe concretely applied ek generic template ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "Why is a go-live checklist valuable even for a developer who genuinely understands every individual item on it?",
        qHi: 'Ek go-live checklist ek developer ke liye bhi valuable kyun hai jo genuinely uske har individual item ko samajhta hai?',
        a: "Understanding why something matters and having verified it was actually applied consistently across a real, complex app are different facts. A checklist provides a structural guarantee that every item gets deliberately reviewed against the actual codebase, catching gaps that arise not from lack of knowledge but from a specific function being written quickly and not revisited.",
        aHi: 'Ye samajhna ki kuch cheez kyun matter karti hai aur ye verify karna ki ye actually ek real, complex app mein consistently apply hui alag facts hain. Ek checklist ek structural guarantee provide karti hai ki har item deliberately actual codebase ke against review hota hai, un gaps ko catch karte hue jo knowledge ki kami se nahi balki ek specific function ke jaldi likhe jaane aur revisit na hone se aate hain.',
      },
      {
        q: "Why is this course's final checklist organized by module rather than by severity or alphabetically?",
        qHi: 'Is course ki final checklist module se organized kyun hai severity ya alphabetically se nahi?',
        a: "Organizing by module makes visible that production-readiness spans many genuinely different, equally necessary concerns (rendering strategy, forms, payments, security, performance, testing, SEO) simultaneously, rather than being a single axis to optimize — a site excelling at one category isn't 'more done' than one excelling at another; a real launch needs all of them addressed together.",
        aHi: 'Module se organize karna visible banata hai ki production-readiness kai genuinely alag, equally necessary concerns (rendering strategy, forms, payments, security, performance, testing, SEO) ko simultaneously span karti hai, ek single axis hone ke bajaye jise optimize karna hai — ek site jo ek category mein excel karti hai doosri mein excel karne wali se "zyada done" nahi hai; ek real launch ko in sab ko saath addressed chahiye.',
      },
    ],

    exercises: [
      {
        task: "Pick any small personal or practice project you've built. Go through this lesson's checklist against it item by item, and honestly note which items you can verify are actually true (not just 'probably fine') versus which ones you genuinely don't know the answer to without checking.",
        taskHi: 'Koi bhi chhota personal ya practice project chuno jo aapne banaya hai. Is lesson ki checklist ko uske against item by item se guzaro, aur honestly note karo kaunse items aap verify kar sakte ho ki actually true hain (sirf \'probably fine\' nahi) versus kaunse ka jawab aap genuinely check kiye bina nahi jaante.',
        hint: "Be specific and honest rather than generous — the value of this exercise comes entirely from identifying real gaps, not from confirming things feel generally fine.",
        hintHi: 'Generous hone ke bajaye specific aur honest raho — is exercise ki value poori tarah real gaps identify karne se aati hai, ye confirm karne se nahi ki cheezein generally theek feel karti hain.',
      },
    ],

    keyTakeaways: [
      "A go-live checklist doesn't teach anything new — its value is structural, forcing deliberate verification of dozens of previously-learned lessons applied consistently across a real, complex app, catching gaps that arise from specific rushed code rather than lack of understanding.",
      'Organizing the checklist by module (rather than by severity) makes visible that production-readiness is many genuinely different, simultaneously necessary concerns, not a single axis to optimize.',
      "This checklist is scoped to what this specific course covered, not a universal, exhaustive standard — a real team's checklist should be a living document extended with lessons from their own specific incidents over time.",
      "The actual skill this course built toward is a habit of asking specific questions before writing code — what happens if this is called directly, under real traffic, visible to the wrong person, or experienced by a user with different needs — which generalizes beyond any single technique covered explicitly.",
    ],
    keyTakeawaysHi: [
      'Ek go-live checklist kuch naya nahi sikhati — uski value structural hai, dozens of previously-learned lessons ke deliberate verification ko force karte hue jo ek real, complex app mein consistently applied hain, un gaps ko catch karte hue jo specific rushed code se aate hain understanding ki kami se nahi.',
      'Checklist ko module se organize karna (severity se nahi) visible banata hai ki production-readiness kai genuinely alag, simultaneously necessary concerns hain, ek single axis nahi jise optimize karna hai.',
      'Ye checklist us cheez tak scoped hai jo is specific course ne cover ki, ek universal, exhaustive standard nahi — ek real team ki checklist ek living document honi chahiye jise time ke saath unke apne specific incidents se lessons ke saath extend kiya jaaye.',
      'Actual skill jise ye course build karne ki taraf kaam kar raha tha code likhne se pehle specific sawaal poochhne ki ek habit hai — kya hota hai agar ise directly call kiya jaaye, real traffic ke under, galat insaan ko visible, ya alag needs wale ek user dwara experienced — jo kisi bhi single technique se pare generalize hoti hai jo explicitly cover ki gayi.',
    ],
  },
];
