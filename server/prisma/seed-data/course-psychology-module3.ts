/**
 * Psychology for Developers — Module 3: Memory Systems & Learning, lessons 1-3.
 *
 * Lesson 1: Short-term vs long-term memory and why the distinction matters for interface design.
 * Lesson 2: Recognition vs recall — why menus beat command lines for most users, most of the time.
 * Lesson 3: The forgetting curve and its direct implications for onboarding and documentation design.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-short-term-vs-long-term-memory',
    title: 'Short-Term vs Long-Term Memory — Two Genuinely Different Systems',
    titleHi: 'Short-Term Vs Long-Term Memory — Do Genuinely Different Systems',
    description:
      "Working memory (Module 1) is not the only memory system relevant to software design — it is a temporary workspace, genuinely distinct from long-term memory's durable storage, and confusing the two leads to real, avoidable interface mistakes.",
    descriptionHi:
      'Working memory (Module 1) hi ekmatra memory system nahi hai jo software design ke liye relevant hai — ye ek temporary workspace hai, genuinely long-term memory ke durable storage se distinct, aur do ko confuse karna real, avoidable interface mistakes ki taraf le jaata hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A chef's countertop workspace (where ingredients sit mid-recipe, cleared and reused for the next dish) versus the restaurant's walk-in pantry (where ingredients are stored durably across many days and many different recipes).** A chef doesn't store their pantry's entire inventory on the countertop while cooking — the countertop holds only what's actively needed for the current step of the current recipe, gets cleared and reused constantly, and anything left there when the chef moves to a different task is likely to be lost or thrown out. The pantry, by contrast, holds ingredients durably, organized so they can be found again days or weeks later, entirely independent of whatever's happening on the countertop right now. These are genuinely two different storage systems serving two different purposes, not one system at two different sizes — a chef who tried to keep everything on the countertop \"just in case\" would have a chaotic, unusable workspace, and a chef who tried to cook directly out of the disorganized far corners of the pantry without ever consolidating anything onto the countertop would be hopelessly slow. Short-term (working) memory is the countertop — small, temporary, constantly cleared and reused for whatever the current task needs. Long-term memory is the pantry — vast, durable, organized for retrieval across time, but not the place from which active work directly happens. Confusing the two — designing an interface as if everything needs to live in the small, temporary countertop, or as if a user can effortlessly retrieve anything from the vast, durable pantry on demand — produces the same kind of chaos a confused kitchen would.",
      hi: 'Ek chef ka countertop workspace (jahan ingredients mid-recipe baithte hain, cleared aur reused agli dish ke liye) versus restaurant ka walk-in pantry (jahan ingredients durably store kiye jaate hain kai dino aur kai different recipes ke across). Ek chef apni pantry ka poora inventory countertop pe store nahi karta cooking karte hue — countertop sirf wahi rakhta hai jo actively current recipe ke current step ke liye zaroori hai, constantly cleared aur reused hota hai, aur wahan kuch bhi jo chhod diya jaata hai jab chef ek alag task pe move karta hai likely lost ya thrown out ho jaata hai. Pantry, iske contrast mein, ingredients ko durably rakhta hai, organized taaki wo phir se din ya hafton baad mil sakein, poori tarah independently ki abhi countertop pe kya ho raha hai. Ye genuinely do alag storage systems hain do alag purposes serve karte hue, ek system do alag sizes pe nahi — ek chef jo "just in case" sab kuch countertop pe rakhne ki koshish karta ek chaotic, unusable workspace rakhega, aur ek chef jo directly pantry ke disorganized far corners se cook karne ki koshish karta bina kabhi kuch countertop pe consolidate kiye hopelessly slow hoga. Short-term (working) memory countertop hai — chhoti, temporary, constantly cleared aur reused jo bhi current task ko chahiye. Long-term memory pantry hai — vast, durable, retrieval ke liye time ke across organized, par wo jagah nahi jahan se active work directly hota hai. Do ko confuse karna — ek interface ko is tarike se design karna jaise sab kuch chhote, temporary countertop mein rehna chahiye, ya jaise ek user vast, durable pantry se demand pe kuch bhi effortlessly retrieve kar sakta hai — wahi kism ka chaos produce karta hai jo ek confused kitchen karegi.',
    },

    simple: `**The core, well-established distinction (the Atkinson-Shiffrin
multi-store model, still the practical foundation used today):**

\`\`\`
SHORT-TERM / WORKING MEMORY:
  - Small capacity (Module 1's ~4 chunks)
  - Temporary — decays within seconds without active rehearsal
  - What's being actively worked with RIGHT NOW

LONG-TERM MEMORY:
  - Effectively unlimited capacity
  - Durable — can persist for years
  - What's been consolidated through repetition, meaning, or
    strong emotional association — NOT automatically populated
    just because information was once seen
\`\`\`

**Why this distinction produces a concrete, checkable design rule —
never require a user to hold information in working memory across a
navigation boundary that a well-designed interface could instead
preserve for them:**

\`\`\`tsx
// WRONG — forces the user to hold a value in THEIR working memory
// across a page navigation, an entirely avoidable burden
function ProductListWrong() {
  return (
    <div>
      {/* User sees a price here... */}
      <ProductCard price={49.99} onClick={() => navigate('/checkout')} />
    </div>
  );
  // ...then on the checkout page, nothing shows the price again,
  // silently assuming the user remembered it from the previous screen
}

// CORRECT — the interface, not the user's working memory, carries
// the information across the navigation boundary
function CheckoutPageRight({ selectedProduct }) {
  return (
    <div>
      <h2>Checkout</h2>
      {/* The price is shown AGAIN here — the system carries this
          information forward instead of relying on the user's
          fragile, temporary working memory to have retained it */}
      <p>{selectedProduct.name} — \${selectedProduct.price}</p>
    </div>
  );
}
\`\`\`

**Why "the user has seen this before" does NOT mean "the user
remembers this" — a common, costly designer assumption:**

\`\`\`
Seeing a piece of information once, especially briefly and without
active engagement, does NOT reliably transfer it into long-term
memory. Long-term memory formation typically requires repetition,
meaningful connection to existing knowledge, or active retrieval
practice — NOT mere passive exposure.

This is why a single onboarding tour, shown once when a user first
signs up, produces measurably weak long-term retention of the
features it covers — the information was processed briefly in working
memory and then, without reinforcement, was never durably consolidated.
\`\`\`

\`\`\`ts
// A concrete implementation choice this motivates: re-surfacing
// key information at the moment of relevance, not just once upfront
function shouldShowFeatureHint(feature, userHistory) {
  const timesUsedBefore = userHistory.filter((event) => event.feature === feature.id).length;
  const wasShownInOnboarding = userHistory.some((event) => event.type === 'onboarding_tour');

  // Don't rely on a single onboarding-tour exposure — offer a
  // contextual hint at the moment the feature is actually relevant,
  // since that's what has a real chance of producing durable learning
  return wasShownInOnboarding && timesUsedBefore === 0;
}
\`\`\`

**How this connects to Module 1 and 2:** Module 1 established working
memory's chunk-based capacity limit; Module 2 established the visual
mechanisms (Gestalt grouping, scan patterns) that determine what
enters working memory from a screen in the first place. This lesson
adds the crucial next distinction: what enters working memory does NOT
automatically become durable, retrievable knowledge — that requires a
genuinely separate consolidation process this lesson and the next two
lessons will explore.`,

    simpleHi: `**Core, well-established distinction (Atkinson-Shiffrin multi-
store model, aaj bhi practical foundation use ki jaati hai):**

\`\`\`
SHORT-TERM / WORKING MEMORY:
  - Chhoti capacity (Module 1 ka ~4 chunks)
  - Temporary — seconds mein decay ho jaati hai active rehearsal ke bina
  - Jo actively ABHI work kiya ja raha hai

LONG-TERM MEMORY:
  - Effectively unlimited capacity
  - Durable — saalon tak persist kar sakti hai
  - Jo repetition, meaning, ya strong emotional association ke
    through consolidate ki gayi hai — automatically populate NAHI
    hoti sirf is wajah se ki information ek baar dekhi gayi thi
\`\`\`

**Ye distinction ek concrete, checkable design rule kyun produce
karta hai — kabhi ek user ko force mat karo ek navigation boundary ke
across information ko unki working memory mein hold karne ke liye jo
ek well-designed interface unke liye preserve kar sakta tha:**

\`\`\`tsx
// GALAT — user ko force karta hai ek value ko UNKI working memory
// mein hold karne ke liye ek page navigation ke across, ek poori
// tarah avoidable burden
function ProductListWrong() {
  return (
    <div>
      {/* User yahan ek price dekhta hai... */}
      <ProductCard price={49.99} onClick={() => navigate('/checkout')} />
    </div>
  );
  // ...phir checkout page pe, kuch bhi price ko dobara nahi dikhata,
  // silently ye assume karte hue ki user ne pichhle screen se ise
  // yaad rakha
}

// CORRECT — interface, user ki working memory nahi, information ko
// navigation boundary ke across carry karta hai
function CheckoutPageRight({ selectedProduct }) {
  return (
    <div>
      <h2>Checkout</h2>
      {/* Price yahan DOBARA dikhaya gaya hai — system is information
          ko aage carry karta hai user ki fragile, temporary working
          memory pe rely karne ke bajaye ki usne ise retain kiya ho */}
      <p>{selectedProduct.name} — \${selectedProduct.price}</p>
    </div>
  );
}
\`\`\`

**"User ne ye pehle dekha hai" ka matlab "user ko ye yaad hai" NAHI
hai kyun — ek common, costly designer assumption:**

\`\`\`
Ek information ko ek baar dekhna, especially briefly aur bina active
engagement ke, ise reliably long-term memory mein transfer NAHI karta.
Long-term memory formation typically repetition, existing knowledge se
meaningful connection, ya active retrieval practice maangti hai —
sirf passive exposure NAHI.

Yahi wajah hai ek single onboarding tour, jo ek baar dikhaya jaata hai
jab ek user pehli baar sign up karta hai, jin features ko cover karta
hai unki measurably weak long-term retention produce karta hai —
information briefly working memory mein process ki gayi thi aur phir,
reinforcement ke bina, kabhi durably consolidate nahi hui.
\`\`\`

\`\`\`ts
// Ek concrete implementation choice jise ye motivate karta hai:
// key information ko relevance ke moment pe re-surface karna, sirf
// ek baar upfront nahi
function shouldShowFeatureHint(feature, userHistory) {
  const timesUsedBefore = userHistory.filter((event) => event.feature === feature.id).length;
  const wasShownInOnboarding = userHistory.some((event) => event.type === 'onboarding_tour');

  // Ek single onboarding-tour exposure pe rely mat karo — ek
  // contextual hint offer karo us moment pe jab feature actually
  // relevant hai, kyunki yahi hai jiske paas durable learning produce
  // karne ka real chance hai
  return wasShownInOnboarding && timesUsedBefore === 0;
}
\`\`\`

**Ye Module 1 aur 2 se kaise connect karta hai:** Module 1 ne working
memory ki chunk-based capacity limit establish ki; Module 2 ne visual
mechanisms establish kiye (Gestalt grouping, scan patterns) jo
determine karte hain ki ek screen se kya pehli jagah working memory
mein enter karta hai. Ye lesson crucial next distinction add karta hai:
jo working memory mein enter karta hai automatically durable,
retrievable knowledge NAHI ban jaata — usko ek genuinely separate
consolidation process chahiye jise ye lesson aur agle do lessons
explore karenge.`,

    content: `## Why the short-term/long-term distinction is a genuinely
different system, not just "small memory" versus "big memory"

The Atkinson-Shiffrin multi-store model (1968), still the practical
foundation for how memory is discussed today, established that
short-term (working) memory and long-term memory differ in more than
just capacity — they differ in duration (seconds without rehearsal
versus potentially a lifetime), in how information enters them
(automatic exposure versus deliberate consolidation), and in their
functional role (active manipulation versus durable storage). Treating
them as the same system at different sizes leads directly to the
mistaken assumption this lesson's core rule corrects: that showing a
user something once is functionally equivalent to that information
being available to them later.

## Why interfaces should minimize what they ask working memory to
carry across a boundary, rather than treating this as a nice-to-have

Since working memory is small and decays quickly, any interface design
that requires a user to hold information across a navigation, a modal
dismissal, or a multi-step flow is asking the user's most fragile,
limited cognitive resource to do work the interface itself could do
more reliably. This isn't a matter of polish — it's a direct,
mechanical consequence of working memory's actual capacity and
duration limits established in Module 1. The concrete design
implication (re-displaying key information at the point where it's
needed, rather than requiring recall of something shown earlier) is a
direct engineering response to this specific cognitive constraint.

## Why "the user has seen this" is a systematically unreliable proxy
for "the user remembers this"

Long-term memory consolidation is not a passive side effect of
exposure — it typically requires some combination of repetition,
meaningful connection to prior knowledge, or active retrieval practice.
A single, passive viewing (a one-time onboarding tour, a tooltip shown
once) engages working memory briefly but does not reliably transfer
that content into durable, retrievable long-term memory. This is a
well-documented, common design mistake with a name and a direct fix:
instead of relying on a single upfront exposure, effective learning-
oriented design re-surfaces information contextually, at the moment
it's actually needed, which is what gives it a genuine chance at
consolidation.

## How this lesson sets up the next two lessons in this module

This lesson establishes the two-system distinction and the "exposure
does not equal retention" principle; the next lesson (recognition vs.
recall) explains WHY certain interface patterns work better than
others specifically because of how long-term memory retrieval
actually operates, and the lesson after that (the forgetting curve)
quantifies exactly how quickly newly-formed memories decay without
reinforcement, giving a precise, research-backed timeline for when and
how often information needs to be re-surfaced to actually stick.`,

    contentHi: `## Short-term/long-term distinction genuinely alag system kyun hai, "chhoti memory" versus "badi memory" nahi

Atkinson-Shiffrin multi-store model (1968), jo aaj bhi memory discuss
karne ka practical foundation hai, ne establish kiya ki short-term
(working) memory aur long-term memory sirf capacity se zyada differ
karte hain — wo duration mein differ karte hain (seconds bina rehearsal
ke versus potentially ek lifetime), information unme kaise enter karti
hai usme (automatic exposure versus deliberate consolidation), aur
unke functional role mein (active manipulation versus durable storage).
Unhe alag sizes pe wahi system ki tarah treat karna directly us mistaken
assumption ki taraf le jaata hai jise is lesson ka core rule correct
karta hai: ki ek user ko kuch ek baar dikhana functionally equivalent
hai us information ke baad mein unke liye available hone ke.

## Interfaces ko kyun minimize karna chahiye ki wo working memory se kya carry karne ko kehte hain ek boundary ke across, ise nice-to-have treat karne ke bajaye

Kyunki working memory chhoti hai aur jaldi decay hoti hai, koi bhi
interface design jo ek user ko information ko ek navigation, ek modal
dismissal, ya ek multi-step flow ke across hold karne ke liye kehta hai
user ke sabse fragile, limited cognitive resource se wo kaam karwa raha
hai jo interface khud zyada reliably kar sakta tha. Ye polish ki baat
nahi hai — ye Module 1 mein establish ki gayi working memory ki actual
capacity aur duration limits ka ek direct, mechanical consequence hai.
Concrete design implication (key information ko us point pe dobara
dikhana jahan uski zaroorat hai, pehle dikhayi gayi kisi cheez ke recall
ki maang karne ke bajaye) is specific cognitive constraint ka ek direct
engineering response hai.

## "User ne ye dekha hai" "user ko ye yaad hai" ke liye ek systematically unreliable proxy kyun hai

Long-term memory consolidation exposure ka ek passive side effect nahi
hai — usko typically repetition, prior knowledge se meaningful
connection, ya active retrieval practice ka kuch combination chahiye
hota hai. Ek single, passive viewing (ek one-time onboarding tour, ek
tooltip ek baar dikhaya gaya) working memory ko briefly engage karti
hai par us content ko reliably durable, retrievable long-term memory
mein transfer nahi karti. Ye ek well-documented, common design mistake
hai ek naam aur ek direct fix ke saath: ek single upfront exposure pe
rely karne ke bajaye, effective learning-oriented design information
ko contextually re-surface karta hai, us moment pe jab uski actually
zaroorat hai, jo isse consolidation ka ek genuine chance deta hai.

## Ye lesson is module ke agle do lessons ko kaise set up karta hai

Ye lesson two-system distinction aur "exposure retention ke barabar
nahi hai" principle establish karta hai; agla lesson (recognition vs.
recall) explain karta hai ki KYUN certain interface patterns doosron
se behtar kaam karte hain specifically is wajah se ki long-term memory
retrieval actually kaise operate karti hai, aur uske baad wala lesson
(forgetting curve) exactly quantify karta hai ki newly-formed memories
reinforcement ke bina kitni jaldi decay hoti hain, ek precise,
research-backed timeline dete hue is baat ki ki information ko actually
stick karne ke liye kab aur kitni baar re-surface karna chahiye.`,

    examples: [
      {
        title: 'A multi-step checkout flow that carries state forward instead of relying on the user\'s working memory',
        titleHi: 'Ek multi-step checkout flow jo state ko aage carry karta hai user ki working memory pe rely karne ke bajaye',
        codeJs: `function CheckoutFlow() {
  const [step, setStep] = useState('shipping');
  const [order, setOrder] = useState({ items: [], shipping: null, payment: null });

  return (
    <div>
      {/* A persistent summary bar carries key information across
          EVERY step — the user never has to hold the order total or
          item count in their own working memory while filling out
          shipping or payment details */}
      <OrderSummaryBar itemCount={order.items.length} total={order.total} />

      {step === 'shipping' && (
        <ShippingForm onComplete={(shipping) => {
          setOrder((prev) => ({ ...prev, shipping }));
          setStep('payment');
        }} />
      )}

      {step === 'payment' && (
        <PaymentForm
          // The shipping address chosen a step ago is shown again here,
          // not merely assumed to be remembered
          shippingSummary={order.shipping}
          onComplete={(payment) => setOrder((prev) => ({ ...prev, payment }))}
        />
      )}
    </div>
  );
}`,
        codeTs: `interface Order {
  items: { id: string; price: number }[];
  shipping: ShippingDetails | null;
  payment: PaymentDetails | null;
  total?: number;
}

interface ShippingDetails {
  address: string;
  city: string;
}

interface PaymentDetails {
  cardLast4: string;
}

function CheckoutFlow() {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [order, setOrder] = useState<Order>({ items: [], shipping: null, payment: null });

  return (
    <div>
      {/* A persistent summary bar carries key information across
          EVERY step — the user never has to hold the order total or
          item count in their own working memory while filling out
          shipping or payment details */}
      <OrderSummaryBar itemCount={order.items.length} total={order.total ?? 0} />

      {step === 'shipping' && (
        <ShippingForm onComplete={(shipping: ShippingDetails) => {
          setOrder((prev) => ({ ...prev, shipping }));
          setStep('payment');
        }} />
      )}

      {step === 'payment' && (
        <PaymentForm
          // The shipping address chosen a step ago is shown again here,
          // not merely assumed to be remembered
          shippingSummary={order.shipping}
          onComplete={(payment: PaymentDetails) => setOrder((prev) => ({ ...prev, payment }))}
        />
      )}
    </div>
  );
}`,
        code: `<OrderSummaryBar itemCount={order.items.length} total={order.total} />
// persists across every step, so the user's working memory never has
// to carry the order total forward on its own`,
        output:
          "At every step of checkout, the user can see the current order total and, on the payment step, the shipping address they selected — nothing requires them to have memorized information from a previous screen, which measurably reduces checkout abandonment caused by uncertainty ('wait, what did I select again?').",
        explain:
          "This directly implements the lesson's core rule: since working memory is small and decays quickly, the interface — not the user — carries information across navigation boundaries, re-displaying it exactly where it's needed rather than assuming it was retained.",
        explainHi:
          "Ye directly lesson ka core rule implement karta hai: kyunki working memory chhoti hai aur jaldi decay hoti hai, interface — user nahi — information ko navigation boundaries ke across carry karta hai, ise exactly wahan dobara dikhate hue jahan uski zaroorat hai, ye assume karne ke bajaye ki ise retain kiya gaya tha.",
      },
    ],

    mistakes: [
      {
        wrong: `// A settings page assumes a user remembers a value they saw on a
// DIFFERENT page, minutes or hours earlier
function BillingPageWrong() {
  return (
    <div>
      <h2>Update Payment Method</h2>
      {/* No mention of the current plan or its price — silently
          assumes the user remembers this from the separate Plans
          page they may have viewed a while ago */}
      <PaymentForm />
    </div>
  );
}`,
        right: `// The relevant context is re-displayed at the point of the decision
function BillingPageRight({ currentPlan }) {
  return (
    <div>
      <h2>Update Payment Method</h2>
      {/* Re-surfaces the exact context relevant to this decision,
          instead of relying on long-term memory of a separate page */}
      <p>Current plan: {currentPlan.name} — \${currentPlan.price}/month</p>
      <PaymentForm />
    </div>
  );
}`,
        why: "Information viewed on a different page, especially minutes or hours earlier, has very likely already left working memory and was never guaranteed to be consolidated into long-term memory — re-displaying the relevant context at the point of decision removes this unreliable dependency entirely.",
        whyHi:
          "Ek doosre page pe dekhi gayi information, especially minutes ya hours pehle, bahut likely pehle hi working memory chhod chuki hai aur kabhi guarantee nahi thi ki long-term memory mein consolidate ho jaayegi — decision ke point pe relevant context ko dobara dikhana is unreliable dependency ko poori tarah remove kar deta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS app's support ticket volume dropped measurably after the team added a persistent 'plan summary' widget to the billing and account pages, directly addressing user confusion that stemmed from having to remember plan details viewed on a separate pricing page — a real support cost traced directly back to a working-memory/long-term-memory mismatch.",
        hi: 'Ek production SaaS app ki support ticket volume measurably drop hui team ne billing aur account pages mein ek persistent \'plan summary\' widget add karne ke baad, user confusion ko directly address karte hue jo ek separate pricing page pe dekhe gaye plan details ko yaad rakhne se stem hui thi — ek real support cost jo directly ek working-memory/long-term-memory mismatch tak trace ki gayi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the practical difference between short-term (working) memory and long-term memory, and why does this matter for interface design?',
        qHi: 'Short-term (working) memory aur long-term memory ke beech practical difference kya hai, aur ye interface design ke liye kyun matter karta hai?',
        a: "Working memory is small-capacity and decays within seconds without active rehearsal; long-term memory is effectively unlimited but requires deliberate consolidation (repetition, meaning, or retrieval practice) to form. This matters because an interface should never require a user to hold information in working memory across a navigation boundary or multi-step flow when the interface itself could simply re-display it.",
        aHi: 'Working memory small-capacity hai aur seconds mein decay ho jaati hai active rehearsal ke bina; long-term memory effectively unlimited hai par form hone ke liye deliberate consolidation chahiye (repetition, meaning, ya retrieval practice). Ye matter karta hai kyunki ek interface ko kabhi ek user ko information ko working memory mein hold karne ke liye kehna nahi chahiye ek navigation boundary ya multi-step flow ke across jab interface khud simply ise dobara dikha sakta tha.',
      },
      {
        q: "Why is 'the user has seen this information before' a poor proxy for 'the user remembers this information'?",
        qHi: "'User ne ye information pehle dekhi hai' 'user ko ye information yaad hai' ke liye ek poor proxy kyun hai?",
        a: "Long-term memory consolidation typically requires repetition, meaningful connection to existing knowledge, or active retrieval practice — a single passive exposure (like a one-time onboarding tour) engages working memory briefly but does not reliably transfer information into durable, retrievable long-term memory.",
        aHi: 'Long-term memory consolidation ko typically repetition, existing knowledge se meaningful connection, ya active retrieval practice chahiye — ek single passive exposure (jaise ek one-time onboarding tour) working memory ko briefly engage karti hai par information ko reliably durable, retrievable long-term memory mein transfer nahi karti.',
      },
    ],

    exercises: [
      {
        task: "A multi-page job application form shows the applicant's selected job title only on page 1, then never again across the remaining 4 pages of the application. Using this lesson's working-memory/long-term-memory distinction, explain what's likely to go wrong for a user who takes a break partway through, and propose a specific fix.",
        taskHi: 'Ek multi-page job application form applicant ka selected job title sirf page 1 pe dikhata hai, phir application ke remaining 4 pages mein kabhi nahi. Is lesson ki working-memory/long-term-memory distinction use karke, explain karo ki us user ke liye kya likely galat hoga jo beech mein ek break leta hai, aur ek specific fix propose karo.',
        hint: "Think about what happens to working-memory contents after a break long enough that the user closes the tab and returns later — has that information necessarily made it into long-term memory?",
        hintHi: 'Socho ki working-memory contents ka kya hota hai ek break ke baad jo itna lamba hai ki user tab band karta hai aur baad mein return karta hai — kya wo information necessarily long-term memory mein pahunch gayi hai?',
      },
    ],

    keyTakeaways: [
      "Short-term (working) memory and long-term memory are genuinely different systems — differing in capacity, duration, and how information enters them — not the same system at different sizes.",
      "Interfaces should carry information across navigation boundaries themselves rather than requiring a user's working memory to do it, since working memory is small and decays within seconds.",
      "A single passive exposure to information (a one-time onboarding tour, a tooltip shown once) does not reliably consolidate into long-term memory — durable learning typically requires repetition, meaning, or active retrieval practice.",
      "This lesson sets up the next two: recognition-vs-recall explains why certain retrieval patterns work better in interfaces, and the forgetting curve quantifies how quickly unreinforced memories decay.",
    ],
    keyTakeawaysHi: [
      'Short-term (working) memory aur long-term memory genuinely alag systems hain — capacity, duration, aur information unme kaise enter karti hai isme differ karte hue — ek hi system alag sizes pe nahi.',
      "Interfaces ko information ko navigation boundaries ke across khud carry karna chahiye ek user ki working memory se ye karwane ke bajaye, kyunki working memory chhoti hai aur seconds mein decay hoti hai.",
      'Information ka ek single passive exposure (ek one-time onboarding tour, ek tooltip ek baar dikhaya gaya) reliably long-term memory mein consolidate nahi hota — durable learning ko typically repetition, meaning, ya active retrieval practice chahiye.',
      'Ye lesson agle do lessons set up karta hai: recognition-vs-recall explain karta hai ki kyun certain retrieval patterns interfaces mein behtar kaam karte hain, aur forgetting curve quantify karta hai ki unreinforced memories kitni jaldi decay hoti hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-recognition-vs-recall',
    title: 'Recognition vs Recall — Why Menus Beat Command Lines for Most Users',
    titleHi: 'Recognition Vs Recall — Menus Zyadatar Users Ke Liye Command Lines Se Kyun Behtar Hain',
    description:
      "A direct, practical consequence of how long-term memory retrieval actually works: recognizing a correct option among visible choices is a measurably easier cognitive task than recalling that same option from memory alone, unaided.",
    descriptionHi:
      'Ek direct, practical consequence is baat ka ki long-term memory retrieval actually kaise kaam karti hai: visible choices ke beech ek correct option ko recognize karna ek measurably easier cognitive task hai us wahi option ko akele memory se, unaided, recall karne se.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**Being handed a photo lineup of faces to identify a person you met once, versus being asked to describe that person's face from memory with no photos in front of you at all.** Picking the correct face out of a lineup of six photos is a dramatically easier task than describing that same face from memory alone with nothing to look at — in the lineup, the correct answer is physically present, and the mental task is simply comparing it against your memory trace and confirming a match. Describing from memory alone requires actively reconstructing every detail from scratch, with nothing external to check against, which is why eyewitness lineups exist as a task specifically designed around this asymmetry rather than just asking a witness to describe a face in words. This exact asymmetry is why a well-designed software menu (a lineup of visible, labeled options to recognize the right one among) is so much easier to use correctly than a command-line interface requiring the user to recall the exact correct command from memory with no visible list of options to check against — both tasks draw on the same long-term memory, but one gives that memory something external to match against, and the other demands the memory reconstruct the answer entirely unaided.",
      hi: 'ek insaan ke faces ka photo lineup diya jaana jise aap ek baar mile the identify karne ke liye, versus us insaan ke face ko memory se describe karne ke liye kaha jaana koi photos ke bina bilkul aapke saamne. Chhe photos ke ek lineup mein se correct face pick karna ek dramatically easier task hai us wahi face ko akele memory se describe karne se kuch bhi dekhne ko na hote hue — lineup mein, correct answer physically present hai, aur mental task simply ise apne memory trace ke against compare karke ek match confirm karna hai. Akele memory se describe karne ke liye actively har detail ko scratch se reconstruct karna padta hai, external check karne ke liye kuch bhi na hote hue, yahi wajah hai eyewitness lineups exist karte hain ek task ki tarah specifically is asymmetry ke around design kiya gaya bajaye sirf ek witness ko words mein ek face describe karne ko kehne ke. Ye exact asymmetry hai jo batati hai ek well-designed software menu (visible, labeled options ka ek lineup jisme se sahi wale ko recognize karna hai) itna zyada aasan use karna hai ek command-line interface se jise user ko exact correct command memory se recall karna padta hai koi visible list of options ke bina check karne ke liye — dono tasks wahi long-term memory pe draw karte hain, par ek us memory ko kuch external deta hai match karne ke liye, aur doosra memory se demand karta hai ki wo answer ko poori tarah unaided reconstruct kare.',
    },

    simple: `**The core cognitive science finding — recognition and recall are
genuinely different retrieval processes, not the same task at
different difficulty levels:**

\`\`\`
RECOGNITION: given a set of candidate options, determine which one
  matches something in memory. The correct answer is EXTERNALLY
  PRESENT — the cognitive task is comparison and confirmation.

RECALL: reconstruct information from memory with no external candidates
  to check against. The cognitive task is active, unaided
  reconstruction — measurably harder and more error-prone.
\`\`\`

**Why this directly explains a decades-old, still-relevant interface
design principle — "recognition over recall":**

\`\`\`tsx
// RECALL-based interface — the user must remember the exact command,
// with no visible list of valid options to recognize from
function CommandInputWrong() {
  return (
    <input
      placeholder="Type a command..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') executeCommand(e.target.value);
        // The user must recall "archive-thread", "mark-unread", etc.
        // from memory alone — a genuinely harder cognitive task than
        // recognizing the same option in a visible list
      }}
    />
  );
}

// RECOGNITION-based interface — the same functionality, but the user
// recognizes the correct option from a visible, labeled list
function CommandMenuRight({ options }) {
  return (
    <ul role="menu">
      {options.map((opt) => (
        <li key={opt.id} role="menuitem" onClick={() => executeCommand(opt.id)}>
          {opt.icon} {opt.label} {/* "Archive thread", "Mark as unread" */}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

**Why recall isn't always wrong to require — expert, high-frequency
users genuinely benefit from recall-based interfaces once memorization
has occurred through repeated practice:**

\`\`\`
This is precisely why professional tools (IDEs, design software,
command-line tools used daily by their target audience) commonly offer
BOTH: a recognition-based menu for infrequent or new users, AND a
recall-based keyboard shortcut or command for the same action, once
frequent practice has genuinely built the association into memory.

Recall becomes fast and reliable for a user ONLY after enough
repetition to form that memory trace — the same underlying mechanism
Module 3's Lesson 1 and Lesson 3 (the forgetting curve) explain. A
brand-new user has no such trace to recall from, which is exactly why
defaulting new users to recognition-based interfaces and offering
recall-based shortcuts as a secondary, opt-in path for repeat users is
the correct design pattern — not recall-only, and not recognition-only
forever.
\`\`\`

\`\`\`tsx
// A concrete implementation of "offer both" — recognition by default,
// recall available as an accelerator once the user has learned it
function ActionButton({ label, shortcut, onAction }) {
  useKeyboardShortcut(shortcut, onAction); // works once memorized
  return (
    <button onClick={onAction} title={\`\${label} (\${shortcut})\`}>
      {label} {/* visible label — recognition path, always available */}
    </button>
  );
}
\`\`\`

**A concrete, checkable rule this produces for search and
autocomplete UI specifically:**

\`\`\`
An autocomplete dropdown that shows candidate matches as the user
types converts what would otherwise be a pure-recall task (remembering
the exact spelling of a product name, a city, a contact) into a
recognition task (confirming the right match among visible candidates)
— which is precisely why autocomplete measurably reduces input errors
and abandonment in search and form fields, independent of any typing-
speed benefit it also happens to provide.
\`\`\`

**How this builds on Lesson 1:** Lesson 1 established that information
must be consolidated into long-term memory to be reliably available
later, and that this consolidation isn't automatic or guaranteed. This
lesson adds the crucial next layer: even for information that HAS been
consolidated into long-term memory, retrieving it via recall is
measurably harder and more error-prone than retrieving it via
recognition — so interface design should default to recognition
whenever possible, reserving recall-based patterns for contexts where
genuine, repeated practice has already built a reliable memory trace.`,

    simpleHi: `**Core cognitive science finding — recognition aur recall
genuinely alag retrieval processes hain, ek hi task alag difficulty
levels pe nahi:**

\`\`\`
RECOGNITION: candidate options ka ek set diya gaya, determine karo
  kaunsa memory mein kisi cheez se match karta hai. Correct answer
  EXTERNALLY PRESENT hai — cognitive task comparison aur confirmation
  hai.

RECALL: memory se information reconstruct karo koi external candidates
  ke bina check karne ke liye. Cognitive task active, unaided
  reconstruction hai — measurably harder aur more error-prone.
\`\`\`

**Ye directly ek decades-old, aaj bhi relevant interface design
principle kyun explain karta hai — "recognition over recall":**

\`\`\`tsx
// RECALL-based interface — user ko exact command yaad rakhna padta
// hai, koi visible list of valid options ke bina recognize karne ke liye
function CommandInputWrong() {
  return (
    <input
      placeholder="Type a command..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') executeCommand(e.target.value);
        // User ko "archive-thread", "mark-unread", etc. akele memory
        // se recall karna padta hai — ek genuinely harder cognitive
        // task wahi option ko ek visible list mein recognize karne se
      }}
    />
  );
}

// RECOGNITION-based interface — wahi functionality, par user correct
// option ko ek visible, labeled list se recognize karta hai
function CommandMenuRight({ options }) {
  return (
    <ul role="menu">
      {options.map((opt) => (
        <li key={opt.id} role="menuitem" onClick={() => executeCommand(opt.id)}>
          {opt.icon} {opt.label} {/* "Archive thread", "Mark as unread" */}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

**Recall ko kabhi kabhi require karna galat kyun nahi hota — expert,
high-frequency users genuinely recall-based interfaces se benefit
karte hain ek baar repeated practice se memorization ho jaane ke baad:**

\`\`\`
Yahi exactly wajah hai professional tools (IDEs, design software,
command-line tools jo unki target audience daily use karti hai)
commonly DONO offer karte hain: infrequent ya new users ke liye ek
recognition-based menu, AUR ek recall-based keyboard shortcut ya
command wahi action ke liye, ek baar frequent practice ne genuinely us
association ko memory mein build kar diya ho.

Recall ek user ke liye fast aur reliable tabhi banta hai jab enough
repetition ne us memory trace ko form kar diya ho — wahi underlying
mechanism jise Module 3 ka Lesson 1 aur Lesson 3 (forgetting curve)
explain karte hain. Ek brand-new user ke paas aisa koi trace nahi hota
jisse recall kare, yahi exactly wajah hai new users ko default se
recognition-based interfaces dena aur recall-based shortcuts ko ek
secondary, opt-in path ki tarah repeat users ke liye offer karna
correct design pattern hai — recall-only nahi, aur recognition-only
forever bhi nahi.
\`\`\`

\`\`\`tsx
// "Dono offer karo" ka ek concrete implementation — default se
// recognition, recall available ek accelerator ki tarah ek baar user
// ne ise seekh liya
function ActionButton({ label, shortcut, onAction }) {
  useKeyboardShortcut(shortcut, onAction); // ek baar memorized hone pe kaam karta hai
  return (
    <button onClick={onAction} title={\`\${label} (\${shortcut})\`}>
      {label} {/* visible label — recognition path, hamesha available */}
    </button>
  );
}
\`\`\`

**Ek concrete, checkable rule jise ye search aur autocomplete UI ke
liye specifically produce karta hai:**

\`\`\`
Ek autocomplete dropdown jo candidate matches dikhata hai jaise user
type karta hai us cheez ko convert karta hai jo warna ek pure-recall
task hoti (ek product name, ek city, ek contact ki exact spelling yaad
rakhna) ek recognition task mein (visible candidates ke beech sahi
match ko confirm karna) — yahi exactly wajah hai autocomplete
measurably input errors aur abandonment kam karta hai search aur form
fields mein, kisi bhi typing-speed benefit se independently jo ye bhi
happen se provide karta hai.
\`\`\`

**Ye Lesson 1 pe kaise build karta hai:** Lesson 1 ne establish kiya
ki information ko long-term memory mein consolidate hona chahiye baad
mein reliably available hone ke liye, aur ye consolidation automatic
ya guaranteed nahi hai. Ye lesson crucial next layer add karta hai:
even us information ke liye jo long-term memory mein consolidate HO
CHUKI hai, recall ke through ise retrieve karna recognition ke through
retrieve karne se measurably harder aur more error-prone hai — isliye
interface design ko jab bhi possible ho recognition default karna
chahiye, recall-based patterns ko un contexts ke liye reserve karte
hue jahan genuine, repeated practice ne already ek reliable memory
trace build kar diya hai.`,

    content: `## Why recognition and recall are genuinely different cognitive
processes, not the same task at different difficulty levels

Cognitive psychology distinguishes recognition (identifying a correct
item when presented among candidates) from recall (reconstructing an
item from memory with no external candidates present) as two
functionally distinct retrieval processes. Recognition succeeds even
with a weaker or more degraded memory trace, because the external
candidate provides a comparison target; recall requires a
sufficiently strong, precisely-formed memory trace to reconstruct the
answer entirely unaided. This is why recognition is measurably easier
and more reliable across a huge range of tasks, not a minor UX
preference — it reflects a genuine difference in the cognitive demand
each process places on memory.

## Why this directly explains why menus historically won out over
command-line interfaces for general-purpose, mass-market software

Early graphical user interfaces (Xerox PARC, the Macintosh, Windows)
succeeded in making computing accessible to non-expert users
specifically because menus convert what command-line interfaces demand
as pure recall (remembering the exact command syntax) into recognition
(scanning a visible, labeled list of valid options). This wasn't an
aesthetic preference — it directly addressed the cognitive reality that
recall is a harder, more error-prone, more anxiety-inducing task for
someone without extensive prior practice, which describes the vast
majority of general-purpose software users at any given moment.

## Why recall-based interfaces remain the right choice for expert,
high-frequency users — and why this isn't a contradiction

Recall becomes fast and low-effort once sufficient repeated practice
has formed a strong, precise memory trace — which is exactly the
situation for expert users of professional tools they use daily.
Recall-based interaction (keyboard shortcuts, command palettes, CLI
tools) is genuinely faster than recognition-based interaction once
that memory trace exists, because it skips the visual scanning and
comparison step recognition requires. The correct design pattern is
therefore not "always use recognition" but "default to recognition
for accessibility to new and infrequent users, while offering
recall-based accelerators as an opt-in path for users who have
genuinely built the necessary memory trace through repetition" — a
principle directly informed by Lesson 1's short-term/long-term memory
distinction and Lesson 3's forgetting-curve mechanics.

## How autocomplete is a direct, concrete application of this
principle to a specific, extremely common interface pattern

An autocomplete or type-ahead search field converts what would
otherwise be a pure-recall task (remembering an exact spelling or
exact term) into a recognition task, by surfacing candidate matches as
the user types. This is precisely why autocomplete measurably reduces
both input errors and task abandonment in search and form contexts —
not merely because it saves keystrokes, but because it fundamentally
changes which cognitive retrieval process the user is being asked to
perform, from the harder one to the easier one.`,

    contentHi: `## Recognition aur recall genuinely alag cognitive processes kyun hain, ek hi task alag difficulty levels pe nahi

Cognitive psychology recognition (ek correct item ko identify karna
jab candidates ke beech present kiya jaata hai) ko recall (ek item ko
memory se reconstruct karna koi external candidates present na hote
hue) se do functionally distinct retrieval processes ki tarah
distinguish karti hai. Recognition ek weaker ya more degraded memory
trace ke saath bhi succeed karta hai, kyunki external candidate ek
comparison target provide karta hai; recall ko ek sufficiently strong,
precisely-formed memory trace chahiye answer ko poori tarah unaided
reconstruct karne ke liye. Yahi wajah hai recognition measurably
easier aur more reliable hai tasks ki ek huge range ke across, ek
minor UX preference nahi — ye ek genuine difference reflect karta hai
cognitive demand mein jo har process memory pe daalta hai.

## Ye directly kyun explain karta hai ki menus historically command-line interfaces se general-purpose, mass-market software ke liye kyun jeet gaye

Early graphical user interfaces (Xerox PARC, Macintosh, Windows)
computing ko non-expert users ke liye accessible banane mein succeed
hue specifically kyunki menus us cheez ko convert karte hain jo
command-line interfaces pure recall ki tarah demand karte hain (exact
command syntax yaad rakhna) recognition mein (valid options ki ek
visible, labeled list scan karna). Ye ek aesthetic preference nahi thi
— ye directly us cognitive reality ko address karta hai ki recall ek
harder, more error-prone, more anxiety-inducing task hai kisi ke liye
jiske paas extensive prior practice nahi hai, jo kisi bhi given moment
pe general-purpose software users ke vast majority ko describe karta
hai.

## Recall-based interfaces expert, high-frequency users ke liye correct choice kyun rehte hain — aur ye ek contradiction kyun nahi hai

Recall fast aur low-effort ban jaata hai ek baar sufficient repeated
practice ne ek strong, precise memory trace form kar diya — jo exactly
professional tools ke expert users ki situation hai jo unhe daily use
karte hain. Recall-based interaction (keyboard shortcuts, command
palettes, CLI tools) recognition-based interaction se genuinely faster
hai ek baar wo memory trace exist karta hai, kyunki ye visual scanning
aur comparison step skip karta hai jo recognition demand karta hai.
Correct design pattern isliye "hamesha recognition use karo" nahi hai
balki "new aur infrequent users ke liye accessibility ke liye
recognition default karo, jabki recall-based accelerators ko ek
opt-in path ki tarah offer karo un users ke liye jinhone genuinely
repetition ke through necessary memory trace build kar li hai" — ek
principle jo directly Lesson 1 ki short-term/long-term memory
distinction aur Lesson 3 ke forgetting-curve mechanics se informed
hai.

## Autocomplete is principle ka ek direct, concrete application ek specific, extremely common interface pattern pe kaise hai

Ek autocomplete ya type-ahead search field us cheez ko convert karta
hai jo warna ek pure-recall task hoti (ek exact spelling ya exact term
yaad rakhna) ek recognition task mein, candidate matches ko surface
karke jaise user type karta hai. Yahi exactly wajah hai autocomplete
measurably dono input errors aur task abandonment kam karta hai search
aur form contexts mein — sirf is wajah se nahi ki ye keystrokes bachata
hai, balki is wajah se ki ye fundamentally badalta hai ki user ko
kaunsa cognitive retrieval process perform karne ko kaha ja raha hai,
harder wale se easier wale tak.`,

    examples: [
      {
        title: 'A settings search that converts recall into recognition via live-filtered results',
        titleHi: 'Ek settings search jo recall ko recognition mein badalta hai live-filtered results ke through',
        codeJs: `function SettingsSearch({ allSettings }) {
  const [query, setQuery] = useState('');

  // Without this, a user must RECALL the exact settings menu path
  // ("Account > Privacy > Two-factor authentication"). With live
  // filtering, the user only needs to RECOGNIZE the right result
  // among the filtered candidates as they type a rough guess.
  const matches = allSettings.filter((setting) =>
    setting.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search settings..."
      />
      <ul role="listbox">
        {matches.map((setting) => (
          <li key={setting.id} role="option" onClick={() => setting.navigate()}>
            {setting.label} {/* the user recognizes this, doesn't recall it */}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        codeTs: `interface Setting {
  id: string;
  label: string;
  navigate: () => void;
}

function SettingsSearch({ allSettings }: { allSettings: Setting[] }) {
  const [query, setQuery] = useState('');

  // Without this, a user must RECALL the exact settings menu path
  // ("Account > Privacy > Two-factor authentication"). With live
  // filtering, the user only needs to RECOGNIZE the right result
  // among the filtered candidates as they type a rough guess.
  const matches = allSettings.filter((setting) =>
    setting.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search settings..."
      />
      <ul role="listbox">
        {matches.map((setting) => (
          <li key={setting.id} role="option" onClick={() => setting.navigate()}>
            {setting.label} {/* the user recognizes this, doesn't recall it */}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        code: `const matches = allSettings.filter((setting) =>
  setting.label.toLowerCase().includes(query.toLowerCase())
);
// converts an exact-path recall task into a recognition-among-candidates task`,
        output:
          "A user vaguely remembering 'something about two-factor' types 'two-factor' and recognizes 'Two-factor authentication' in the filtered list — they never had to recall the exact menu path (Account > Privacy > Two-factor authentication) from memory, which they likely couldn't have reconstructed precisely anyway.",
        explain:
          "This example makes concrete the lesson's central claim: live-filtered search doesn't just save typing, it changes the underlying cognitive task from recall (reconstructing an exact path) to recognition (confirming a match among visible candidates) — the easier, more reliable retrieval process.",
        explainHi:
          "Ye example lesson ke central claim ko concrete banata hai: live-filtered search sirf typing nahi bachata, ye underlying cognitive task ko recall (ek exact path reconstruct karna) se recognition (visible candidates ke beech ek match confirm karna) mein badal deta hai — easier, more reliable retrieval process.",
      },
    ],

    mistakes: [
      {
        wrong: `// A power-user feature exposed ONLY as a memorized keyboard shortcut,
// with no discoverable, recognition-based path to the same action
function App() {
  useKeyboardShortcut('cmd+shift+d', duplicateCurrentDocument);
  // A brand-new user has no way to discover this action exists, and
  // no visible menu item lets them recognize it — the feature is
  // effectively invisible to anyone without prior, external knowledge
  // of the exact shortcut
  return <Editor />;
}`,
        right: `// The same action, available via BOTH a recognizable menu item AND
// a recall-based shortcut for users who've already learned it
function App() {
  useKeyboardShortcut('cmd+shift+d', duplicateCurrentDocument);
  return (
    <>
      <Menu>
        <MenuItem onClick={duplicateCurrentDocument} shortcut="⌘⇧D">
          Duplicate document {/* recognizable AND teaches the shortcut */}
        </MenuItem>
      </Menu>
      <Editor />
    </>
  );
}`,
        why: "A feature available only via a recall-based shortcut, with no recognition-based discovery path (a labeled menu item), is invisible to new or infrequent users who have no memory trace to recall it from — showing the shortcut alongside a labeled menu item both makes the feature discoverable AND helps build the very memory trace that will eventually make recall-based use possible.",
        whyHi:
          "Ek feature jo sirf ek recall-based shortcut se available hai, koi recognition-based discovery path ke bina (ek labeled menu item), naye ya infrequent users ke liye invisible hai jinke paas koi memory trace nahi hai jisse ise recall kiya ja sake — shortcut ko ek labeled menu item ke saath dikhana dono feature ko discoverable banata hai AUR wahi memory trace build karne mein help karta hai jo eventually recall-based use possible banayega.",
      },
    ],

    realWorld: [
      {
        en: "A production design tool measured a significant drop in new-user activation after hiding a frequently-used action behind a keyboard-only shortcut during a redesign meant to 'declutter' the toolbar — restoring a labeled, recognizable menu entry alongside the shortcut (rather than removing the shortcut) recovered the activation rate while still serving expert users who had already memorized the shortcut.",
        hi: 'Ek production design tool ne ek significant drop measure ki new-user activation mein ek frequently-used action ko keyboard-only shortcut ke peeche chhupane ke baad ek redesign ke dauran jo toolbar ko \'declutter\' karne ke liye tha — ek labeled, recognizable menu entry ko shortcut ke saath restore karna (shortcut hatane ke bajaye) activation rate ko recover kar diya jabki abhi bhi expert users ko serve karte hue jinhone already shortcut memorize kar liya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is recognition a measurably easier cognitive task than recall, and what design principle does this directly justify?',
        qHi: 'Recognition recall se ek measurably easier cognitive task kyun hai, aur ye directly kaunsa design principle justify karta hai?',
        a: "Recognition presents the correct answer as one of several external candidates, so the cognitive task is comparison and confirmation, which succeeds even with a weaker memory trace. Recall requires reconstructing the answer entirely from memory with no external candidates, demanding a stronger, more precisely-formed memory trace. This justifies the 'recognition over recall' design principle: default interfaces to showing visible, labeled options rather than requiring users to remember exact commands or paths.",
        aHi: 'Recognition correct answer ko kai external candidates mein se ek ki tarah present karta hai, isliye cognitive task comparison aur confirmation hai, jo ek weaker memory trace ke saath bhi succeed karta hai. Recall ko answer ko poori tarah memory se reconstruct karna padta hai koi external candidates ke bina, ek stronger, more precisely-formed memory trace demand karte hue. Ye "recognition over recall" design principle ko justify karta hai: interfaces ko default se visible, labeled options dikhana chahiye users ko exact commands ya paths yaad rakhne ke liye kehne ke bajaye.',
      },
      {
        q: "Why do professional tools commonly offer both a menu-based (recognition) path and a keyboard-shortcut-based (recall) path for the same action, rather than choosing just one?",
        qHi: 'Professional tools commonly wahi action ke liye ek menu-based (recognition) path aur ek keyboard-shortcut-based (recall) path dono kyun offer karte hain, sirf ek choose karne ke bajaye?',
        a: "Recall-based interaction is faster once a user has built a strong memory trace through repeated practice, which describes expert, high-frequency users. But new or infrequent users have no such memory trace and need a recognition-based path to discover and use the feature at all. Offering both serves the full range of users, and the labeled menu item also helps build the memory trace that eventually enables fast recall-based use.",
        aHi: 'Recall-based interaction faster hota hai ek baar user ne repeated practice ke through ek strong memory trace build kar liya, jo expert, high-frequency users ko describe karta hai. Par naye ya infrequent users ke paas aisa koi memory trace nahi hota aur unhe feature ko bilkul discover aur use karne ke liye ek recognition-based path chahiye. Dono offer karna users ki poori range ko serve karta hai, aur labeled menu item bhi wahi memory trace build karne mein help karta hai jo eventually fast recall-based use enable karega.',
      },
    ],

    exercises: [
      {
        task: "A CLI-based internal admin tool requires engineers to remember and type exact flag names (e.g., '--force-resync-user-cache') with no built-in help listing or autocomplete. Using this lesson's recognition-vs-recall distinction, explain why this design disproportionately hurts infrequent users of the tool, and propose two specific improvements.",
        taskHi: 'Ek CLI-based internal admin tool engineers ko exact flag names yaad rakhne aur type karne ke liye require karta hai (jaise, \'--force-resync-user-cache\') koi built-in help listing ya autocomplete ke bina. Is lesson ki recognition-vs-recall distinction use karke, explain karo ki ye design disproportionately tool ke infrequent users ko kyun hurt karta hai, aur do specific improvements propose karo.',
        hint: "Think about the difference between an engineer who uses this tool daily (and has likely memorized the flags) versus one who uses it once a quarter — what would give the second engineer a recognition-based path instead of forcing pure recall?",
        hintHi: 'Us engineer ke beech difference socho jo ye tool daily use karta hai (aur likely flags memorize kar chuka hai) versus ek jo ise quarter mein ek baar use karta hai — kya doosre engineer ko ek recognition-based path dega pure recall force karne ke bajaye?',
      },
    ],

    keyTakeaways: [
      "Recognition (identifying a correct option among visible candidates) and recall (reconstructing an answer from memory alone) are genuinely different, measurably unequal cognitive processes — recognition is easier and more reliable.",
      "This is why menus and labeled options historically won out over command-line interfaces for general-purpose, mass-market software aimed at non-expert users.",
      "Recall-based interaction (shortcuts, commands) becomes fast and reliable only after repeated practice builds a strong memory trace — which is why professional tools correctly offer both a recognition-based path and a recall-based accelerator for the same action.",
      "Autocomplete and live-filtered search are concrete, widely-used applications of this principle, converting an exact-recall task into an easier recognition-among-candidates task.",
    ],
    keyTakeawaysHi: [
      'Recognition (visible candidates ke beech ek correct option identify karna) aur recall (akele memory se ek answer reconstruct karna) genuinely alag, measurably unequal cognitive processes hain — recognition easier aur more reliable hai.',
      'Yahi wajah hai menus aur labeled options historically command-line interfaces se jeet gaye general-purpose, mass-market software ke liye jo non-expert users ke liye aimed tha.',
      'Recall-based interaction (shortcuts, commands) fast aur reliable sirf tab banta hai jab repeated practice ek strong memory trace build karti hai — yahi wajah hai professional tools correctly dono offer karte hain ek recognition-based path aur ek recall-based accelerator wahi action ke liye.',
      'Autocomplete aur live-filtered search is principle ke concrete, widely-used applications hain, ek exact-recall task ko ek easier recognition-among-candidates task mein convert karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-the-forgetting-curve',
    title: 'The Forgetting Curve & Its Implications for Onboarding and Docs',
    titleHi: 'The Forgetting Curve & Onboarding Aur Docs Ke Liye Iske Implications',
    description:
      "Closing this module: Ebbinghaus's forgetting curve gives a precise, quantified answer to a question the first two lessons raised but didn't answer — exactly how fast newly-learned information decays without reinforcement, and what that means for how onboarding and documentation should actually be structured.",
    descriptionHi:
      'Is module ko close karte hue: Ebbinghaus ka forgetting curve ek precise, quantified answer deta hai us sawaal ka jo pehle do lessons ne raise kiya par answer nahi kiya — exactly kitni fast newly-learned information reinforcement ke bina decay hoti hai, aur iska matlab hai ki onboarding aur documentation ko actually kaise structure kiya jaana chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A leaking bucket that loses most of its water in the first hour after being filled, then leaks progressively slower and slower, versus a bucket that gets topped off at exactly the right intervals before it empties, eventually needing almost no refilling at all.** A bucket with a slow leak doesn't lose water at a constant rate — it loses a large fraction very quickly right after being filled, then the leak rate slows dramatically, so a bucket left completely alone loses most of its water within the first hour but only a small additional amount over the following day. If you're trying to keep the bucket reasonably full over time, topping it off once, right at the start, and then leaving it alone is a poor strategy — most of that top-off leaks out almost immediately. The dramatically more water-efficient strategy is topping it off multiple times, spaced out, ideally right before each point where the leak would otherwise cause it to run critically low — each top-off requires less water than the last, because the remaining water has already made the bucket's seal a little tighter (a rough analogy for how each successful retrieval strengthens the underlying memory trace). This is exactly the shape of newly-learned information in human memory: it decays fastest immediately after learning, and each well-timed review before it's fully forgotten requires less re-teaching than the last, which is the actual mechanism behind why spaced repetition works so much better than a single, one-time information dump.",
      hi: 'ek leaking bucket jo apna zyada tar paani pehle hour mein khoti hai fill hone ke baad, phir progressively slower aur slower leak karti hai, versus ek bucket jo exactly sahi intervals pe top off ki jaati hai empty hone se pehle, eventually almost koi refilling na chahiye hote hue. Ek slow leak wale bucket paani ko constant rate pe nahi khoti — ye ek bada fraction bahut jaldi khoti hai fill hone ke turant baad, phir leak rate dramatically slow ho jaati hai, isliye ek bucket jo poori tarah akela chhod diya jaaye pehle hour mein apna zyada tar paani khoti hai par sirf ek chhota additional amount agle din mein. Agar aap bucket ko reasonably full rakhne ki koshish kar rahe ho time ke saath, ise ek baar top off karna, bilkul start mein, aur phir akela chhod dena ek poor strategy hai — us top-off ka zyada tar almost immediately leak ho jaata hai. Dramatically zyada water-efficient strategy ise multiple baar top off karna hai, spaced out, ideally har us point se pehle jahan leak warna ise critically low kar deti. Har top-off pichhle se kam paani maangta hai, kyunki bacha hua paani ne bucket ki seal ko thoda tighter bana diya hai (ek rough analogy is baat ke liye ki har successful retrieval underlying memory trace ko kaise strengthen karta hai). Ye exactly newly-learned information ki shape hai human memory mein: ye fastest decay hoti hai learning ke turant baad, aur har well-timed review isse poori tarah bhoolne se pehle pichhle se kam re-teaching maangta hai, jo actual mechanism hai is baat ke peeche ki spaced repetition ek single, one-time information dump se itni behtar kyun kaam karti hai.',
    },

    simple: `**The actual, measured finding — Hermann Ebbinghaus's forgetting
curve (1885, replicated many times since with the same basic shape):**

\`\`\`
Newly-learned information, without any reinforcement, decays
FASTEST immediately after learning and then more slowly over time —
a specific, measured curve shape, not a linear or constant rate of loss.

Roughly (illustrative, not exact for every context): a substantial
portion of newly-learned information can be forgotten within the
first day without reinforcement, with the rate of further loss
slowing considerably after that.

Critically: each well-timed REVIEW before the information is fully
forgotten resets and FLATTENS the curve further — spaced repetition
at increasing intervals is measurably more effective for durable
retention than the same total review time spent all at once.
\`\`\`

**Why a single, one-time onboarding tour is a structurally weak
strategy given this curve — and what a stronger strategy looks like:**

\`\`\`ts
// WEAK — a single upfront information dump, with no reinforcement
// scheduled at all, directly ignoring the forgetting curve's shape
function onUserSignUp(user) {
  showOnboardingTour(user); // shown once, then never revisited
}

// STRONGER — reinforcement scheduled at increasing intervals,
// directly informed by the forgetting curve's actual shape
function scheduleOnboardingReinforcement(user) {
  const touchpoints = [
    { delayDays: 0, type: 'initial_tour' },      // first exposure
    { delayDays: 1, type: 'day1_recap_email' },  // reinforce fast, while the
                                                   // curve is steepest
    { delayDays: 7, type: 'week1_feature_tip' }, // reinforce again, at a
                                                   // longer interval
    { delayDays: 30, type: 'month1_advanced_tip' }, // final reinforcement,
                                                       // longer interval still
  ];
  touchpoints.forEach((tp) => scheduleNotification(user, tp));
}
\`\`\`

**Why documentation design should follow the same principle —
"reference when needed" beats "read once upfront":**

\`\`\`
Comprehensive documentation read once, upfront, before a user has any
practical need for most of it, suffers from the SAME forgetting-curve
decay as a one-time onboarding tour — most of it will be forgotten
long before it's actually needed.

The more effective pattern is contextual, just-in-time documentation:
surfacing the relevant piece of documentation at the exact moment a
user encounters the situation it addresses, which functions as both
the FIRST exposure AND, for anything read before, a well-timed REVIEW
— directly exploiting the forgetting curve's shape rather than working
against it.
\`\`\`

\`\`\`tsx
// A concrete implementation — contextual help surfaced exactly where
// and when it's relevant, not buried in a one-time onboarding tour
function ExportButton() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      <button onClick={exportData} onMouseEnter={() => setShowHint(true)}>
        Export
      </button>
      {showHint && (
        <Tooltip>
          Exports include all filtered results, not just the visible page.
          {/* Surfaced exactly at the moment of relevance — functioning as
              either a first exposure or a well-timed review, whichever
              applies for this specific user */}
        </Tooltip>
      )}
    </div>
  );
}
\`\`\`

**How this lesson closes Module 3:** Lesson 1 established that
information must be actively consolidated to become durable, and that
mere exposure doesn't guarantee this. Lesson 2 established that even
consolidated information is retrieved more reliably via recognition
than recall. This lesson adds the precise, quantified timeline for
WHEN consolidation needs reinforcement to actually stick, converting
Module 3's conceptual findings into a concrete, schedulable pattern:
reinforce early and often at first, then at increasing intervals, and
prefer surfacing information contextually, at the moment of relevance,
over a single comprehensive upfront dump.`,

    simpleHi: `**Actual, measured finding — Hermann Ebbinghaus ka forgetting
curve (1885, tab se kai baar replicated wahi basic shape ke saath):**

\`\`\`
Newly-learned information, kisi bhi reinforcement ke bina, FASTEST
decay hoti hai learning ke turant baad aur phir slower time ke saath —
ek specific, measured curve shape, ek linear ya constant rate of loss
nahi.

Roughly (illustrative, har context ke liye exact nahi): newly-learned
information ka ek substantial portion pehle din mein bhoola ja sakta
hai reinforcement ke bina, further loss ki rate uske baad considerably
slow hoti hue.

Critically: har well-timed REVIEW information poori tarah bhoolne se
pehle curve ko reset aur further FLATTEN karta hai — increasing
intervals pe spaced repetition measurably zyada effective hai durable
retention ke liye wahi total review time ek saath spend karne se.
\`\`\`

**Ek single, one-time onboarding tour is curve ko dekhte hue ek
structurally weak strategy kyun hai — aur ek stronger strategy kaisi
dikhti hai:**

\`\`\`ts
// WEAK — ek single upfront information dump, koi reinforcement
// bilkul schedule na hote hue, directly forgetting curve ki shape ko
// ignore karte hue
function onUserSignUp(user) {
  showOnboardingTour(user); // ek baar dikhaya gaya, phir kabhi revisit nahi
}

// STRONGER — reinforcement increasing intervals pe scheduled, directly
// forgetting curve ki actual shape se informed
function scheduleOnboardingReinforcement(user) {
  const touchpoints = [
    { delayDays: 0, type: 'initial_tour' },      // pehla exposure
    { delayDays: 1, type: 'day1_recap_email' },  // fast reinforce karo, jabki
                                                   // curve steepest hai
    { delayDays: 7, type: 'week1_feature_tip' }, // dobara reinforce karo, ek
                                                   // longer interval pe
    { delayDays: 30, type: 'month1_advanced_tip' }, // final reinforcement,
                                                       // aur bhi longer interval
  ];
  touchpoints.forEach((tp) => scheduleNotification(user, tp));
}
\`\`\`

**Documentation design ko wahi principle kyun follow karna chahiye —
"reference when needed" "read once upfront" se behtar hai:**

\`\`\`
Comprehensive documentation ek baar padhi gayi, upfront, kisi user ke
zyada tar cheezon ki practical zaroorat hone se pehle, wahi
forgetting-curve decay se suffer karti hai jo ek one-time onboarding
tour karti hai — zyada tar isse bhool jaaya jaayega bahut pehle actually
zaroorat padne se.

Zyada effective pattern contextual, just-in-time documentation hai:
documentation ke relevant piece ko exact moment pe surface karna jab
ek user us situation ko encounter karta hai jise ye address karti hai,
jo dono FIRST exposure ki tarah function karti hai AUR, kisi bhi cheez
ke liye jo pehle padhi gayi thi, ek well-timed REVIEW — directly
forgetting curve ki shape ko exploit karte hue iske against kaam karne
ke bajaye.
\`\`\`

\`\`\`tsx
// Ek concrete implementation — contextual help exactly wahan aur tab
// surface ki gayi jahan aur jab ye relevant hai, ek one-time
// onboarding tour mein buried nahi
function ExportButton() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      <button onClick={exportData} onMouseEnter={() => setShowHint(true)}>
        Export
      </button>
      {showHint && (
        <Tooltip>
          Exports include all filtered results, not just the visible page.
          {/* Relevance ke exact moment pe surface kiya gaya — ya to
              first exposure ki tarah ya well-timed review ki tarah
              function karte hue, jo bhi is specific user ke liye
              applicable hai */}
        </Tooltip>
      )}
    </div>
  );
}
\`\`\`

**Ye lesson Module 3 ko kaise close karta hai:** Lesson 1 ne establish
kiya ki information ko actively consolidate hona chahiye durable banne
ke liye, aur sirf exposure ise guarantee nahi karta. Lesson 2 ne
establish kiya ki even consolidated information recognition ke through
zyada reliably retrieve hoti hai recall se. Ye lesson precise,
quantified timeline add karta hai is baat ka ki KAB consolidation ko
reinforcement chahiye actually stick karne ke liye, Module 3 ki
conceptual findings ko ek concrete, schedulable pattern mein convert
karte hue: pehle jaldi aur baar baar reinforce karo, phir increasing
intervals pe, aur information ko contextually surface karna prefer
karo, relevance ke moment pe, ek single comprehensive upfront dump se
zyada.`,

    content: `## Why the forgetting curve's specific shape — fast initial
decay, slower loss afterward — matters more than a single "how much is
forgotten" number

Ebbinghaus's original research (1885), and its substantial replication
since, established that forgetting is not a constant-rate process — it
is steepest immediately after learning and flattens over time. This
specific shape is what makes the timing of reinforcement matter as
much as its existence: reinforcing information while the curve is
still steep (soon after initial learning) recovers much more retained
knowledge per unit of reinforcement effort than waiting until most of
it has already been forgotten and re-teaching from scratch.

## Why spaced repetition at increasing intervals is measurably more
effective than the same total review time spent once

Each successful, well-timed review before information is fully
forgotten appears to reset and further flatten the decay curve for
that specific piece of information — which is why spacing reviews out
at increasing intervals (a well-established finding sometimes called
the spacing effect) produces measurably more durable retention than
cramming the same total amount of review time into one session. This
directly motivates structuring onboarding and educational touchpoints
as a scheduled SEQUENCE across days and weeks, not a single event.

## Why a one-time onboarding tour is a structurally weak strategy,
independent of how well-designed the tour itself is

Even a genuinely excellent, well-designed onboarding tour is subject to
the same forgetting curve as any other newly-learned information — a
single exposure, however well-executed, will decay at the curve's
initial, steep rate without any scheduled reinforcement. This is why
the practical fix isn't "make the onboarding tour better" in isolation,
but "schedule reinforcement at the intervals the forgetting curve
predicts will matter most" — a structural, timing-based fix rather than
a content-quality fix.

## Why contextual, just-in-time documentation directly exploits the
forgetting curve rather than working against it

Documentation read once upfront, before a practical need exists, is
maximally vulnerable to the forgetting curve's steep initial decay,
since there's no natural trigger to reinforce it before it's needed.
Contextual documentation — surfaced at the exact moment a user
encounters the relevant situation — sidesteps this problem entirely:
for a user encountering the content for the first time, it functions
as the initial exposure at the moment it's actually useful; for a user
who saw it before, it functions as a well-timed review precisely when
that information is about to be applied. This is why "reference when
needed" measurably outperforms "read comprehensively upfront" for
information a user won't apply immediately — it aligns documentation
delivery with the actual shape of human memory decay rather than
ignoring it.

## How this lesson completes Module 3

Lesson 1 established that consolidation into long-term memory isn't
automatic. Lesson 2 established that even consolidated information is
retrieved more reliably via recognition than recall. This lesson adds
the final, quantified piece: the specific timeline over which
unreinforced memory decays, and the direct, practical implication that
onboarding and documentation should be structured as scheduled,
contextual reinforcement rather than a single comprehensive exposure
event.`,

    contentHi: `## Forgetting curve ki specific shape kyun matter karti hai — fast initial decay, slower loss baad mein — ek single "kitna bhoola gaya" number se zyada

Ebbinghaus ki original research (1885), aur tab se uski substantial
replication, ne establish kiya ki forgetting ek constant-rate process
nahi hai — ye steepest hai learning ke turant baad aur time ke saath
flatten hoti hai. Ye specific shape wo hai jo reinforcement ki timing
ko utna hi matter karata hai jitna uska existence: information ko
reinforce karna jabki curve abhi bhi steep hai (initial learning ke
turant baad) reinforcement effort ke per unit zyada retained knowledge
recover karta hai us se zyada jo wait karna jab tak zyada tar pehle hi
bhoola ja chuka hai aur scratch se re-teach karna.

## Increasing intervals pe spaced repetition wahi total review time se measurably zyada effective kyun hai ek baar mein spend kiya gaya

Har successful, well-timed review information poori tarah bhoolne se
pehle us specific piece of information ke liye decay curve ko reset
aur further flatten karta hua dikhta hai — yahi wajah hai reviews ko
increasing intervals pe space karna (ek well-established finding jise
kabhi kabhi spacing effect kaha jaata hai) measurably zyada durable
retention produce karta hai wahi total amount of review time ko ek
session mein cram karne se. Ye directly onboarding aur educational
touchpoints ko din aur haftton ke across ek scheduled SEQUENCE ki
tarah structure karne ko motivate karta hai, ek single event nahi.

## Ek one-time onboarding tour ek structurally weak strategy kyun hai, tour khud kitna bhi well-designed ho isse independently

Even ek genuinely excellent, well-designed onboarding tour wahi
forgetting curve ke subject hai jo kisi bhi doosri newly-learned
information ki tarah — ek single exposure, chahe kitni bhi
well-executed ho, curve ki initial, steep rate pe decay hogi koi
scheduled reinforcement ke bina. Yahi wajah hai practical fix
"onboarding tour ko behtar banao" isolation mein nahi hai, balki
"reinforcement ko un intervals pe schedule karo jinhe forgetting curve
predict karta hai sabse zyada matter karenge" — ek structural,
timing-based fix, ek content-quality fix nahi.

## Contextual, just-in-time documentation directly forgetting curve ko exploit kyun karti hai iske against kaam karne ke bajaye

Documentation jo ek baar upfront padhi gayi, ek practical need exist
karne se pehle, forgetting curve ke steep initial decay ke liye
maximally vulnerable hai, kyunki isse zaroorat padne se pehle
reinforce karne ke liye koi natural trigger nahi hai. Contextual
documentation — us exact moment pe surface ki gayi jab ek user relevant
situation encounter karta hai — is problem ko poori tarah sidestep
karti hai: ek user ke liye jo content ko pehli baar encounter karta
hai, ye initial exposure ki tarah function karti hai us moment pe jab
ye actually useful hai; ek user ke liye jisne ise pehle dekha tha, ye
ek well-timed review ki tarah function karti hai precisely jab wo
information apply hone wali hai. Yahi wajah hai "reference when
needed" measurably "read comprehensively upfront" ko outperform karta
hai us information ke liye jise ek user immediately apply nahi karega
— ye documentation delivery ko human memory decay ki actual shape ke
saath align karta hai ise ignore karne ke bajaye.

## Ye lesson Module 3 ko kaise complete karta hai

Lesson 1 ne establish kiya ki long-term memory mein consolidation
automatic nahi hai. Lesson 2 ne establish kiya ki even consolidated
information recognition ke through zyada reliably retrieve hoti hai
recall se. Ye lesson final, quantified piece add karta hai: wo specific
timeline jiske across unreinforced memory decay hoti hai, aur direct,
practical implication ki onboarding aur documentation ko scheduled,
contextual reinforcement ki tarah structure kiya jaana chahiye ek
single comprehensive exposure event ke bajaye.`,

    examples: [
      {
        title: 'A spaced-reinforcement onboarding scheduler and a contextual-help hook, both directly derived from the forgetting curve',
        titleHi: 'Ek spaced-reinforcement onboarding scheduler aur ek contextual-help hook, dono directly forgetting curve se derived',
        codeJs: `// Reinforcement scheduled at increasing intervals — steep-decay
// period reinforced soonest, later reinforcement spaced further out
function scheduleOnboardingReinforcement(userId, signupDate) {
  const touchpoints = [
    { delayDays: 0, type: 'initial_tour' },
    { delayDays: 1, type: 'day1_recap_email' },
    { delayDays: 7, type: 'week1_feature_tip' },
    { delayDays: 30, type: 'month1_advanced_tip' },
  ];

  return touchpoints.map((tp) => ({
    userId,
    type: tp.type,
    scheduledFor: new Date(signupDate.getTime() + tp.delayDays * 86400000),
  }));
}

// A contextual help hook — surfaces the relevant tip AT the moment of
// relevance, functioning as first-exposure or well-timed review
// depending on the individual user's history
function useContextualHint(featureId, userHistory) {
  const hasSeenBefore = userHistory.some((e) => e.type === 'hint_shown' && e.featureId === featureId);
  const daysSinceLastSeen = hasSeenBefore
    ? (Date.now() - userHistory.find((e) => e.featureId === featureId).timestamp) / 86400000
    : null;

  // Show the hint if it's genuinely new, OR if enough time has passed
  // that the forgetting curve makes a refresher worthwhile
  return !hasSeenBefore || daysSinceLastSeen > 14;
}`,
        codeTs: `interface Touchpoint {
  delayDays: number;
  type: string;
}

interface ScheduledReinforcement {
  userId: string;
  type: string;
  scheduledFor: Date;
}

// Reinforcement scheduled at increasing intervals — steep-decay
// period reinforced soonest, later reinforcement spaced further out
function scheduleOnboardingReinforcement(userId: string, signupDate: Date): ScheduledReinforcement[] {
  const touchpoints: Touchpoint[] = [
    { delayDays: 0, type: 'initial_tour' },
    { delayDays: 1, type: 'day1_recap_email' },
    { delayDays: 7, type: 'week1_feature_tip' },
    { delayDays: 30, type: 'month1_advanced_tip' },
  ];

  return touchpoints.map((tp) => ({
    userId,
    type: tp.type,
    scheduledFor: new Date(signupDate.getTime() + tp.delayDays * 86400000),
  }));
}

interface HistoryEvent {
  type: string;
  featureId: string;
  timestamp: number;
}

// A contextual help hook — surfaces the relevant tip AT the moment of
// relevance, functioning as first-exposure or well-timed review
// depending on the individual user's history
function useContextualHint(featureId: string, userHistory: HistoryEvent[]): boolean {
  const hasSeenBefore = userHistory.some((e) => e.type === 'hint_shown' && e.featureId === featureId);
  const lastSeenEvent = userHistory.find((e) => e.featureId === featureId);
  const daysSinceLastSeen = hasSeenBefore && lastSeenEvent
    ? (Date.now() - lastSeenEvent.timestamp) / 86400000
    : null;

  // Show the hint if it's genuinely new, OR if enough time has passed
  // that the forgetting curve makes a refresher worthwhile
  return !hasSeenBefore || (daysSinceLastSeen !== null && daysSinceLastSeen > 14);
}`,
        code: `const touchpoints = [
  { delayDays: 0, type: 'initial_tour' },
  { delayDays: 1, type: 'day1_recap_email' },
  { delayDays: 7, type: 'week1_feature_tip' },
  { delayDays: 30, type: 'month1_advanced_tip' },
];`,
        output:
          "A new user receives their initial tour on day 0, a recap email on day 1 (while the forgetting curve is steepest), a feature tip on day 7, and an advanced tip on day 30 — each spaced reinforcement recovers knowledge that would otherwise have decayed, at intervals that get progressively longer as the underlying memory trace strengthens.",
        explain:
          "Both functions operationalize the forgetting curve's core implication directly: reinforcement should be front-loaded (soonest right after initial exposure, when decay is steepest) and spaced at increasing intervals thereafter, rather than delivered once upfront or at arbitrary, evenly-spaced times.",
        explainHi:
          "Dono functions forgetting curve ke core implication ko directly operationalize karte hain: reinforcement ko front-loaded hona chahiye (sabse jaldi initial exposure ke turant baad, jab decay steepest hai) aur uske baad increasing intervals pe spaced, ek baar upfront ya arbitrary, evenly-spaced times pe deliver karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// A single, comprehensive documentation page covering every feature,
// expected to be read once, upfront, before a user has practical need
// for most of it
function OnboardingDocsWrong() {
  return (
    <article>
      <h1>Complete Feature Guide</h1>
      {/* 40 sections covering every feature, read once at signup —
          most of this will be forgotten long before it's actually
          needed, per the forgetting curve's steep initial decay */}
      {ALL_FEATURES.map((f) => <FeatureSection key={f.id} feature={f} />)}
    </article>
  );
}`,
        right: `// The same information, surfaced contextually at the moment each
// feature is actually encountered — functioning as either a first
// exposure or a well-timed review, whichever applies
function FeatureWithContextualDocs({ feature }) {
  const [showDocs, setShowDocs] = useState(false);
  return (
    <div>
      <FeatureUI feature={feature} />
      <button onClick={() => setShowDocs(true)}>Learn more about {feature.name}</button>
      {showDocs && <FeatureSection feature={feature} />}
      {/* Read at the moment of relevance — directly exploiting the
          forgetting curve rather than fighting it */}
    </div>
  );
}`,
        why: "A comprehensive upfront reading of documentation for features a user won't use for days or weeks is maximally vulnerable to the forgetting curve's steep initial decay — by the time the user actually needs that information, most of it has already decayed. Surfacing the same content contextually, at the point of actual need, sidesteps this by aligning delivery with the moment retention actually matters.",
        whyHi:
          "Un features ke liye documentation ka ek comprehensive upfront reading jinhe user din ya haftton tak use nahi karega forgetting curve ke steep initial decay ke liye maximally vulnerable hai — jab tak user ko actually us information ki zaroorat padti hai, zyada tar already decay ho chuki hoti hai. Wahi content ko contextually surface karna, actual need ke point pe, ise sidestep karta hai delivery ko us moment ke saath align karke jab retention actually matter karti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production developer-tools company measured a significant, sustained increase in feature adoption after replacing a single 90-minute onboarding webinar with a spaced sequence of short, contextual tips delivered at day 0, day 1, day 7, and day 30 — directly informed by the forgetting curve's shape rather than the original all-at-once approach.",
        hi: 'Ek production developer-tools company ne feature adoption mein ek significant, sustained increase measure ki ek single 90-minute onboarding webinar ko day 0, day 1, day 7, aur day 30 pe deliver kiye gaye short, contextual tips ki ek spaced sequence se replace karne ke baad — directly forgetting curve ki shape se informed, original all-at-once approach ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "What is the forgetting curve, and why does its specific shape (fast initial decay, slower loss over time) matter for how reinforcement should be scheduled?",
        qHi: 'Forgetting curve kya hai, aur uski specific shape (fast initial decay, slower loss over time) reinforcement ko kaise schedule kiya jaana chahiye iske liye kyun matter karti hai?',
        a: "The forgetting curve (Ebbinghaus, 1885) describes how newly-learned information decays fastest immediately after learning and more slowly afterward. Because decay is steepest early on, reinforcing information soon after initial exposure recovers much more knowledge per unit of effort than waiting until most of it has already been forgotten — this is why effective reinforcement is front-loaded and then spaced at increasing intervals, rather than delivered once or at arbitrary fixed intervals.",
        aHi: 'Forgetting curve (Ebbinghaus, 1885) describe karta hai ki newly-learned information kitni fast decay hoti hai learning ke turant baad aur uske baad slower. Kyunki decay early on steepest hai, initial exposure ke turant baad information ko reinforce karna effort ke per unit zyada knowledge recover karta hai us se zyada jo wait karna jab tak zyada tar already bhoola ja chuka hai — yahi wajah hai effective reinforcement front-loaded hota hai aur phir increasing intervals pe spaced, ek baar ya arbitrary fixed intervals pe deliver karne ke bajaye.',
      },
      {
        q: "Why does contextual, just-in-time documentation outperform a single, comprehensive upfront read for information a user won't apply immediately?",
        qHi: 'Contextual, just-in-time documentation ek single, comprehensive upfront read se kyun outperform karti hai us information ke liye jise ek user immediately apply nahi karega?',
        a: "Information read upfront, before a practical need exists, decays according to the forgetting curve's steep initial rate with no natural reinforcement trigger. Contextual documentation, surfaced at the exact moment a user encounters the relevant situation, functions as either the first exposure (at the moment it's useful) or a well-timed review (if seen before) — aligning delivery with the actual shape of memory decay instead of ignoring it.",
        aHi: 'Information jo upfront padhi jaati hai, ek practical need exist karne se pehle, forgetting curve ki steep initial rate ke hisaab se decay hoti hai koi natural reinforcement trigger ke bina. Contextual documentation, us exact moment pe surface ki gayi jab ek user relevant situation encounter karta hai, ya to first exposure ki tarah function karti hai (us moment pe jab ye useful hai) ya ek well-timed review ki tarah (agar pehle dekhi gayi thi) — delivery ko memory decay ki actual shape ke saath align karte hue ise ignore karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A company sends new users a single, comprehensive 'Getting Started' email on day 0 with links to every feature, and nothing else afterward. Using the forgetting curve, predict what will happen to feature adoption for features not used within the first day, and propose a specific, scheduled alternative.",
        taskHi: 'Ek company naye users ko ek single, comprehensive \'Getting Started\' email bhejti hai day 0 pe har feature ke links ke saath, aur uske baad kuch aur nahi. Forgetting curve use karke, predict karo ki un features ke liye feature adoption ka kya hoga jo pehle din ke andar use nahi hue, aur ek specific, scheduled alternative propose karo.',
        hint: "Think about how much of that email's content is likely to have decayed from the user's memory by the time they might actually need a feature they haven't tried yet, and at what intervals a reminder could intercept that decay.",
        hintHi: 'Socho ki us email ka content kitna likely decay ho chuka hoga user ki memory se jab tak wo actually ek feature ki zaroorat mehsoos kare jo unhone abhi tak try nahi kiya, aur kis intervals pe ek reminder us decay ko intercept kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "The forgetting curve (Ebbinghaus, 1885) shows newly-learned information decays fastest immediately after learning and more slowly afterward — a specific, measured shape, not a constant rate of loss.",
      "Spaced repetition at increasing intervals produces measurably more durable retention than the same total review time spent in one session, because each well-timed review flattens the curve further.",
      "A single, one-time onboarding tour is structurally weak regardless of its quality, since even excellent content decays at the curve's steep initial rate without scheduled reinforcement.",
      "Contextual, just-in-time documentation directly exploits the forgetting curve's shape — functioning as either a first exposure or a well-timed review depending on the user — outperforming a single comprehensive upfront read.",
    ],
    keyTakeawaysHi: [
      'Forgetting curve (Ebbinghaus, 1885) dikhata hai ki newly-learned information fastest decay hoti hai learning ke turant baad aur slower uske baad — ek specific, measured shape, constant rate of loss nahi.',
      'Increasing intervals pe spaced repetition measurably zyada durable retention produce karti hai wahi total review time ek session mein spend karne se, kyunki har well-timed review curve ko further flatten karta hai.',
      'Ek single, one-time onboarding tour structurally weak hai uski quality se independently, kyunki even excellent content curve ki steep initial rate pe decay hoti hai koi scheduled reinforcement ke bina.',
      'Contextual, just-in-time documentation directly forgetting curve ki shape ko exploit karti hai — ya to ek first exposure ya ek well-timed review ki tarah function karte hue user pe depend karte hue — ek single comprehensive upfront read se outperform karte hue.',
    ],
  },
];
