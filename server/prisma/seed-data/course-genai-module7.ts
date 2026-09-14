/**
 * Generative AI Complete Course — Module 7: RAG Part 1 — Embeddings & Chunking, lessons 1-3.
 *
 * Lesson 1: Why RAG exists — context limits, freshness, and grounding against hallucination.
 * Lesson 2: Embeddings deep-dive and cosine similarity as the actual comparison mechanism.
 * Lesson 3: Chunking strategies and why chunk boundaries genuinely affect retrieval quality.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-why-rag-exists',
    title: 'Why Retrieval-Augmented Generation Exists At All',
    titleHi: 'Retrieval-Augmented Generation Bilkul Exist Kyun Karta Hai',
    description:
      "Before any RAG mechanics, the actual problem it solves: a model's knowledge is frozen at training time and its context window is finite (Module 1) — RAG is the mechanism for putting genuinely current, private, or otherwise-missing information directly into the sequence a model reasons from.",
    descriptionHi:
      'Kisi bhi RAG mechanics se pehle, wo actual problem jise ye solve karta hai: ek model ka knowledge training time pe frozen hota hai aur uska context window finite hai (Module 1) — RAG wo mechanism hai genuinely current, private, ya otherwise-missing information ko directly us sequence mein daalne ke liye jisse ek model reason karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A brilliant expert who memorized an entire encyclopedia years ago versus the same expert given today's newspaper and your company's private files before answering your question.** The expert who only relied on a memorized encyclopedia would confidently answer questions about anything covered in it, but would have no way to know about anything that happened after they finished memorizing, and would know nothing at all about your company's private internal documents — not because they're unintelligent, but because that information was never in what they learned. Handing that same expert today's newspaper and your company's relevant files right before they answer doesn't make them smarter — it gives them access to genuinely new, specific information their memorized knowledge never contained, which they can now read and reason from directly. RAG is exactly this: rather than hoping a model's frozen training-time knowledge happens to cover what you need, it retrieves the specific, relevant, up-to-date information and places it directly into the context the model reasons from for that one request.",
      hi: 'Ek brilliant expert jisne years pehle ek poori encyclopedia memorize ki thi versus wahi expert jise aaj ka newspaper aur aapki company ke private files diye gaye aapka sawaal answer karne se pehle. Wo expert jo sirf ek memorized encyclopedia pe rely karta tha usme cover ki gayi kisi bhi cheez ke baare mein confidently answer dega, par unhe pata karne ka koi tareeka nahi hoga ki memorize karna khatam karne ke baad kya hua, aur unhe aapki company ke private internal documents ke baare mein bilkul kuch nahi pata hoga — is wajah se nahi ki wo unintelligent hain, balki is wajah se ki wo information kabhi unke seekhe hue mein thi hi nahi. Wahi expert ko aaj ka newspaper aur aapki company ki relevant files unke answer dene se theek pehle dena unhe zyada smart nahi banata — ye unhe genuinely naye, specific information tak access deta hai jo unka memorized knowledge kabhi contain nahi karta tha, jise wo ab directly padh aur reason kar sakte hain. RAG exactly yahi hai: ye hope karne ke bajaye ki ek model ka frozen training-time knowledge aapko jo chahiye wo cover karta hai, ye specific, relevant, up-to-date information retrieve karta hai aur ise directly us context mein daalta hai jisse model us ek request ke liye reason karta hai.',
    },

    simple: `**The three genuine limitations RAG addresses, each a direct
consequence of mechanisms this course already established:**

\`\`\`
1. FROZEN KNOWLEDGE — a model's training data has a cutoff date; it
   cannot know about anything that happened after that, no matter how
   the question is phrased. This isn't a bug to fix with a better
   prompt — the information genuinely was never part of what it learned.

2. PRIVATE/PROPRIETARY INFORMATION — a model was never trained on your
   company's internal documents, your specific customer's order
   history, or your product's actual current pricing. It has no way to
   "know" this, regardless of how the question is asked.

3. CONTEXT WINDOW LIMITS (Module 1) — even for information a model DOES
   have access to (documents you provide directly), the context window
   is a hard, finite budget. You can't paste an entire 10,000-page
   knowledge base into every request — you need a way to find and
   include only the SPECIFIC, relevant pieces.
\`\`\`

**The RAG pattern, at the shape level (mechanics come in Lessons 2-3
and Module 8):**

\`\`\`
1. A knowledge base (documents, a database, internal wikis) is
   pre-processed into a searchable form (embeddings — Lesson 2).

2. When a question arrives, the system searches that knowledge base for
   the specific pieces most relevant to THIS question — not the whole
   knowledge base, just the relevant slice.

3. Those specific, relevant pieces are inserted directly into the
   model's context (Module 1's sequence) alongside the question.

4. The model generates its answer conditioned on that real, retrieved
   content — attention (Module 1, Lesson 2) can now weigh it directly,
   the same mechanism this course has relied on since Module 1.
\`\`\`

**Why RAG is also a hallucination-mitigation strategy, not just an
information-access one:** Module 1, Lesson 3 established that
hallucination is structural — a model has no way to distinguish "this
continuation is true" from "this continuation is merely plausible."
When the model is answering FROM retrieved, verifiable source material
present directly in its context, rather than from an implicit,
un-checkable internal association formed during training, its answer
is far more likely to be grounded in something real — not because the
underlying mechanism changed, but because what it's conditioning on
did.

**Why this is a genuinely different lever than fine-tuning:** it's
tempting to think "the model doesn't know X, so retrain it on X" — but
fine-tuning (Module 16 covers this decision in full) is slow, expensive,
and produces a model whose knowledge is STILL frozen at whatever point
the fine-tuning happened. RAG instead keeps the model unchanged and
supplies fresh information at the moment of the actual request — which
is why RAG, not fine-tuning, is almost always the right lever for
information that changes daily (prices, inventory, recent events) or is
private to a specific customer or company.`,

    simpleHi: `**Teen genuine limitations jinhe RAG address karta hai, har ek is
course ne already establish kiye mechanisms ka ek direct consequence:**

\`\`\`
1. FROZEN KNOWLEDGE — ek model ke training data ki ek cutoff date hai;
   ye us ke baad hui kisi bhi cheez ke baare mein nahi jaan sakta,
   chahe question kaise bhi phrase kiya jaaye. Ye ek bug nahi hai jise
   ek better prompt se fix karna hai — wo information genuinely kabhi
   uske seekhe hue ka hissa thi hi nahi.

2. PRIVATE/PROPRIETARY INFORMATION — ek model kabhi aapki company ke
   internal documents, aapke specific customer ki order history, ya
   aapke product ki actual current pricing pe train nahi hua. Ise ye
   "jaanne" ka koi tareeka nahi hai, chahe sawaal kaise bhi poocha
   jaaye.

3. CONTEXT WINDOW LIMITS (Module 1) — even us information ke liye jise
   model DOES access rakhta hai (documents jo aap directly provide
   karte ho), context window ek hard, finite budget hai. Aap ek poori
   10,000-page knowledge base ko har request mein paste nahi kar sakte
   — aapko sirf SPECIFIC, relevant pieces dhundhne aur include karne ka
   ek tareeka chahiye.
\`\`\`

**RAG pattern, shape level pe (mechanics Lessons 2-3 aur Module 8 mein
aati hain):**

\`\`\`
1. Ek knowledge base (documents, ek database, internal wikis) ko ek
   searchable form mein pre-process kiya jata hai (embeddings — Lesson 2).

2. Jab ek question aata hai, system us knowledge base ko search karta
   hai un specific pieces ke liye jo IS question ke liye sabse relevant
   hain — poori knowledge base nahi, sirf relevant slice.

3. Wo specific, relevant pieces directly model ke context (Module 1 ki
   sequence) mein question ke saath insert kiye jaate hain.

4. Model us real, retrieved content pe conditioned apna answer generate
   karta hai — attention (Module 1, Lesson 2) ab ise directly weigh kar
   sakta hai, wahi mechanism jispe ye course Module 1 se rely karta aaya
   hai.
\`\`\`

**RAG ek hallucination-mitigation strategy bhi kyun hai, sirf ek
information-access wali nahi:** Module 1, Lesson 3 ne establish kiya ki
hallucination structural hai — ek model ke paas "ye continuation sach
hai" ko "ye continuation sirf plausible hai" se distinguish karne ka
koi tareeka nahi hai. Jab model retrieved, verifiable source material se
answer kar raha hota hai jo directly uske context mein present hai,
training ke dauran formed ek implicit, un-checkable internal
association se nahi, uska answer kaafi zyada likely hota hai kisi real
cheez mein grounded hone ke liye — is wajah se nahi ki underlying
mechanism badla, balki is wajah se ki ye kispe condition kar raha hai
wo badla.

**Ye fine-tuning se genuinely alag lever kyun hai:** ye sochna tempting
hai "model X nahi jaanta, isliye ise X pe retrain karo" — par
fine-tuning (Module 16 is decision ko poori tarah cover karta hai) slow,
expensive hai, aur ek model produce karta hai jiska knowledge STILL
frozen hai us point pe jab fine-tuning hui thi. RAG iske bajaye model ko
unchanged rakhta hai aur actual request ke moment pe fresh information
supply karta hai — yahi wajah hai RAG, fine-tuning nahi, almost hamesha
sahi lever hai us information ke liye jo daily badalti hai (prices,
inventory, recent events) ya ek specific customer ya company ke liye
private hai.`,

    content: `## Why this is a lesson before any mechanics, not after

Modules 5-6 established tool calling as one mechanism for extending a
model's abilities beyond fixed training-time knowledge; RAG is the
second, and understanding WHY it's needed — before learning HOW it
works — prevents treating RAG as an arbitrary technique to apply
everywhere rather than a specific solution to specific, identifiable
problems (frozen knowledge, private information, context window
limits). A developer who understands these three limitations precisely
can recognize when RAG is genuinely the right tool versus when a
simpler prompt, a tool call, or nothing at all would suffice.

## Why "frozen knowledge" and "context window limits" are two
genuinely different problems RAG happens to solve with one mechanism

Frozen knowledge is a problem even with an effectively unlimited context
window — no context window size lets a model know about an event that
happened after its training cutoff, because that information simply
isn't part of what it learned to predict from. Context window limits
are a problem even for information the model theoretically has access
to — a company's full internal wiki might be something you could, in
principle, paste into a prompt, but doing so for every single request
is both prohibitively expensive (Module 2's token-cost math) and
unnecessary, since only a small relevant slice matters for any given
question. RAG's retrieval step solves both simultaneously: it finds
genuinely external (frozen-knowledge-solving) AND appropriately-sized
(context-window-respecting) content for each specific request.

## Why RAG is a stronger hallucination mitigation than "just ask it to
be careful"

Module 1, Lesson 3 established that hallucination mitigation works by
changing what's available in the sequence being generated from, not by
making the underlying generation mechanism truth-aware (which it
structurally cannot be). RAG is the most direct application of that
principle: rather than hoping the model's implicit, unverifiable
training-time associations happen to be correct, the model's answer is
generated while conditioned on explicit, verifiable, retrieved source
material actually present in its context — a genuinely different
starting point for generation, not a stronger instruction to the same
starting point.

## Why RAG and fine-tuning are different levers for different
problems, previewing Module 16

Fine-tuning changes a model's weights based on additional training
examples — an expensive, slow process that produces a new frozen
snapshot of knowledge, still subject to the exact same "frozen at some
point in time" limitation this lesson identified. RAG changes what
information is available at the moment of a specific request, with no
retraining required, which is why it's almost always the correct choice
for information that's private, that changes frequently, or that needs
to be current as of right now — fine-tuning would require expensive
retraining every time the underlying information changed, which for
daily-changing data (prices, inventory) is simply not viable. Module 16
develops this decision fully; this lesson establishes the reasoning
that decision rests on.`,

    contentHi: `## Ye lesson kisi bhi mechanics se pehle kyun hai, baad mein nahi

Modules 5-6 ne tool calling ko ek mechanism ki tarah establish kiya ek
model ki abilities ko fixed training-time knowledge se pare extend
karne ke liye; RAG doosra hai, aur ye samajhna ki ye KYUN chahiye —
HOW ye kaam karta hai seekhne se pehle — RAG ko har jagah apply karne
layak ek arbitrary technique ki tarah treat karne se bachata hai, ek
specific, identifiable problems (frozen knowledge, private information,
context window limits) ka specific solution ki tarah nahi. Ek developer
jo in teen limitations ko precisely samajhta hai recognize kar sakta hai
ki RAG genuinely sahi tool kab hai versus kab ek simpler prompt, ek tool
call, ya kuch bhi nahi kaafi hoga.

## "Frozen knowledge" aur "context window limits" do genuinely alag problems kyun hain jinhe RAG ek mechanism se solve kar deta hai

Frozen knowledge ek problem hai even ek effectively unlimited context
window ke saath bhi — koi bhi context window size ek model ko ek aise
event ke baare mein jaanne nahi deta jo uske training cutoff ke baad
hua, kyunki wo information simply uske seekhe hue predict karne ke liye
kabhi hissa thi hi nahi. Context window limits ek problem hain even
us information ke liye bhi jise model theoretically access rakhta hai —
ek company ka poora internal wiki kuch aisa ho sakta hai jise aap,
principle mein, ek prompt mein paste kar sakte ho, par har single
request ke liye aisa karna dono prohibitively expensive hai (Module 2
ka token-cost math) aur unnecessary hai, kyunki kisi bhi given question
ke liye sirf ek chhota relevant slice matter karta hai. RAG ka retrieval
step dono ko simultaneously solve karta hai: ye genuinely external
(frozen-knowledge-solving) AUR appropriately-sized (context-window-
respecting) content har specific request ke liye dhundhta hai.

## RAG "bas ise careful hone ko bolo" se stronger hallucination mitigation kyun hai

Module 1, Lesson 3 ne establish kiya ki hallucination mitigation us
cheez ko badalke kaam karti hai jo generate ho rahi sequence mein
available hai, underlying generation mechanism ko truth-aware banake
nahi (jo ye structurally ho hi nahi sakta). RAG us principle ka sabse
direct application hai: ye hope karne ke bajaye ki model ke implicit,
unverifiable training-time associations sach hote honge, model ka answer
explicit, verifiable, retrieved source material pe conditioned generate
hota hai jo actually uske context mein present hai — generation ke liye
ek genuinely alag starting point, wahi starting point ke liye ek
stronger instruction nahi.

## RAG aur fine-tuning alag problems ke liye alag levers kyun hain, Module 16 ka preview karte hue

Fine-tuning ek model ke weights ko additional training examples ke
basis pe badalta hai — ek expensive, slow process jo knowledge ka ek
naya frozen snapshot produce karta hai, abhi bhi exactly wahi "kisi
point in time pe frozen" limitation ke subject jise ye lesson ne
identify kiya. RAG us information ko badalta hai jo ek specific
request ke moment pe available hai, koi retraining zaroori nahi, yahi
wajah hai ki ye almost hamesha correct choice hai us information ke
liye jo private hai, jo frequently badalti hai, ya jise abhi ke as of
current hona chahiye — fine-tuning ko har baar expensive retraining
chahiye hogi jab underlying information badalti, jo daily-changing data
(prices, inventory) ke liye simply viable nahi hai. Module 16 is
decision ko poori tarah develop karta hai; ye lesson wo reasoning
establish karta hai jispe wo decision rest karta hai.`,

    examples: [
      {
        title: 'Contrasting a question a model can answer from training alone against one that genuinely requires retrieval',
        titleHi: 'Ek question jise model training se akele answer kar sakta hai us wale ke against contrast karna jise genuinely retrieval chahiye',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Question 1 — answerable from general training knowledge alone;
// no retrieval needed, RAG would add cost and complexity for nothing
const generalKnowledge = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  messages: [{ role: 'user', content: 'What is the boiling point of water at sea level?' }],
});
// Reliable, correct, no external information required

// Question 2 — genuinely requires information the model cannot
// possibly have: private, company-specific, current-moment data
const privateQuestion = 'What is order #48213\\'s current shipping status?';
// Without RAG: the model has NO way to answer this correctly — it was
// never trained on this specific, private, constantly-changing record.
// This is exactly the case RAG's retrieval step exists for — fetching
// THIS specific order's real, current record and inserting it into
// context before the model answers (mechanics in Lesson 2 and Module 8).`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Question 1 — answerable from general training knowledge alone;
// no retrieval needed, RAG would add cost and complexity for nothing
const generalKnowledge = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  messages: [{ role: 'user', content: 'What is the boiling point of water at sea level?' }],
});
// Reliable, correct, no external information required

// Question 2 — genuinely requires information the model cannot
// possibly have: private, company-specific, current-moment data
const privateQuestion = "What is order #48213's current shipping status?";
// Without RAG: the model has NO way to answer this correctly — it was
// never trained on this specific, private, constantly-changing record.
// This is exactly the case RAG's retrieval step exists for — fetching
// THIS specific order's real, current record and inserting it into
// context before the model answers (mechanics in Lesson 2 and Module 8).`,
        code: `// No retrieval needed — general, stable knowledge
'What is the boiling point of water at sea level?'

// Genuinely requires retrieval — private, current, constantly-changing
"What is order #48213's current shipping status?"`,
        output:
          "The boiling-point question is answered correctly and reliably with zero external information, because it's stable, well-represented general knowledge. The order-status question CANNOT be answered correctly without retrieval — there is no amount of clever prompting that gives the model access to a private, constantly-changing database record it was never trained on.",
        explain:
          "This contrast is the practical judgment call this lesson develops: recognizing which category a question falls into (general/stable vs. private/current/changing) determines whether RAG is genuinely needed, rather than reaching for it as a default for every AI feature regardless of whether the underlying problem actually calls for it.",
        explainHi:
          "Ye contrast wo practical judgment call hai jise ye lesson develop karta hai: recognize karna ki ek question kaunsi category mein aata hai (general/stable vs. private/current/changing) determine karta hai ki RAG genuinely chahiye ya nahi, ise har AI feature ke liye ek default ki tarah reach karne ke bajaye chahe underlying problem actually ise call kare ya nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reaching for RAG as a default for every AI feature, including
// ones answering stable, general-knowledge questions
async function answerGeneralQuestion(question) {
  const relevantDocs = await retrieveFromKnowledgeBase(question); // unnecessary
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: \`Context: \${relevantDocs}\n\nQuestion: \${question}\` }],
  });
  return response;
  // For "what is 15% of 200?" or "explain what a REST API is," this
  // adds retrieval infrastructure, latency, and cost for zero benefit —
  // the model already reliably knows this from training.
}`,
        right: `// Reserving RAG for questions that genuinely need it — private,
// current, or otherwise-missing information
async function answerQuestion(question, isCompanySpecific) {
  if (isCompanySpecific) {
    const relevantDocs = await retrieveFromKnowledgeBase(question);
    return await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: \`Context: \${relevantDocs}\n\nQuestion: \${question}\` }],
    });
  }
  // General, stable knowledge — no retrieval needed
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: question }],
  });
}`,
        why: "RAG's retrieval step adds real latency, infrastructure complexity, and cost (Module 2). Applying it to questions the model can already answer reliably from stable general training knowledge provides no benefit while incurring all of that cost — the judgment call is recognizing which specific problem (frozen knowledge, private data, context limits) actually applies before reaching for RAG.",
        whyHi:
          "RAG ka retrieval step real latency, infrastructure complexity, aur cost add karta hai (Module 2). Ise un questions pe apply karna jo model already stable general training knowledge se reliably answer kar sakta hai koi benefit provide nahi karta jabki wo poora cost incur karta hai — judgment call ye recognize karna hai ki kaunsi specific problem (frozen knowledge, private data, context limits) actually apply hoti hai RAG ke liye reach karne se pehle.",
      },
    ],

    realWorld: [
      {
        en: "A production customer-support AI uses RAG specifically for questions about a customer's own account, order history, or a company's current policies (all private, current, or frequently-changing) while routing general product-usage questions ('how do I reset my password') to a plain, non-RAG prompt, since that information is stable and the model already handles it reliably without retrieval overhead.",
        hi: 'Ek production customer-support AI RAG ko specifically un questions ke liye use karta hai jo ek customer ke apne account, order history, ya ek company ki current policies (sab private, current, ya frequently-changing) ke baare mein hain jabki general product-usage questions (\'mujhe apna password reset kaise karna hai\') ko ek plain, non-RAG prompt pe route karta hai, kyunki wo information stable hai aur model already ise reliably handle karta hai retrieval overhead ke bina.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three genuine limitations RAG addresses, and why is each a real constraint rather than something a better prompt could fix?',
        qHi: 'Wo teen genuine limitations kya hain jinhe RAG address karta hai, aur har ek ek real constraint kyun hai ek better prompt ke fix kar sakne wali cheez ke bajaye?',
        a: "Frozen knowledge (a model can't know about anything after its training cutoff, regardless of phrasing), private/proprietary information (the model was never trained on a specific company's internal data), and context window limits (even accessible information can't all fit in every request). All three are structural facts about how a model works (Module 1), not gaps a cleverer instruction can close.",
        aHi: 'Frozen knowledge (ek model apne training cutoff ke baad hui kisi bhi cheez ke baare mein nahi jaan sakta, phrasing se independently), private/proprietary information (model kabhi ek specific company ke internal data pe train nahi hua), aur context window limits (even accessible information sab har request mein fit nahi ho sakti). Teenon ek model ke kaam karne ke tareeke ke baare mein structural facts hain (Module 1), aisi gaps nahi jinhe ek cleverer instruction close kar sake.',
      },
      {
        q: 'Why is RAG considered a stronger hallucination mitigation than simply instructing a model to "be more careful" or "only state facts you are sure of"?',
        qHi: 'RAG ko ek model ko simply "zyada careful raho" ya "sirf un facts ko state karo jinme aap sure ho" instruct karne se stronger hallucination mitigation kyun mana jaata hai?',
        a: "Hallucination is structural — a model has no internal mechanism to check a continuation against truth (Module 1). An instruction to 'be careful' doesn't add such a mechanism; it's still generating the most plausible continuation. RAG works by changing what's actually present in the context being generated from — grounding the answer in real, retrieved, verifiable content rather than an implicit, unverifiable training-time association.",
        aHi: 'Hallucination structural hai — ek model ke paas ek continuation ko truth ke against check karne ka koi internal mechanism nahi hai (Module 1). "Careful raho" wala instruction aisa koi mechanism add nahi karta; ye abhi bhi sabse plausible continuation generate kar raha hai. RAG us cheez ko badalke kaam karta hai jo actually generate ho rahe context mein present hai — answer ko real, retrieved, verifiable content mein ground karte hue ek implicit, unverifiable training-time association ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "For each of these, decide whether RAG is genuinely needed, and justify using this lesson's three limitations: (1) 'What's the chemical formula for table salt?', (2) 'What's my current account balance?', (3) 'Summarize the key changes in our company's PTO policy update from last week.'",
        taskHi: 'In sab mein se har ek ke liye, decide karo ki kya RAG genuinely chahiye, aur is lesson ke teen limitations use karke justify karo: (1) \'Table salt ka chemical formula kya hai?\', (2) \'Mera current account balance kya hai?\', (3) \'Pichhle hafte ki hamari company ki PTO policy update ke key changes summarize karo.\'',
        hint: "For each question, ask whether it's stable/general knowledge, or whether it's private, current, or otherwise information the model couldn't possibly have from training.",
        hintHi: 'Har question ke liye poochho ki kya ye stable/general knowledge hai, ya kya ye private, current, ya otherwise wo information hai jo model ke paas training se possibly nahi ho sakti.',
      },
    ],

    keyTakeaways: [
      "RAG addresses three genuine, structural limitations: frozen training-time knowledge, private/proprietary information the model was never trained on, and finite context window budgets (Module 1) that prevent including an entire knowledge base in every request.",
      "The RAG pattern retrieves specific, relevant content from a knowledge base and inserts it directly into the model's context, letting attention (Module 1) weigh real, verifiable material rather than relying on implicit training-time associations.",
      "RAG is a stronger hallucination mitigation than instructing a model to 'be careful,' because it changes what's actually present in the generated-from sequence rather than hoping the same generation mechanism behaves differently.",
      "RAG and fine-tuning (Module 16) are different levers: RAG supplies fresh information at request time with no retraining, making it the right choice for private or frequently-changing information, while fine-tuning produces a new, still-frozen knowledge snapshot.",
    ],
    keyTakeawaysHi: [
      'RAG teen genuine, structural limitations address karta hai: frozen training-time knowledge, private/proprietary information jispe model kabhi train nahi hua, aur finite context window budgets (Module 1) jo poori knowledge base ko har request mein include karne se rokte hain.',
      'RAG pattern ek knowledge base se specific, relevant content retrieve karta hai aur ise directly model ke context mein insert karta hai, attention (Module 1) ko real, verifiable material weigh karne deta hai implicit training-time associations pe rely karne ke bajaye.',
      'RAG ek model ko "careful raho" instruct karne se stronger hallucination mitigation hai, kyunki ye us cheez ko badalta hai jo actually generated-from sequence mein present hai, ye hope karne ke bajaye ki wahi generation mechanism differently behave karega.',
      'RAG aur fine-tuning (Module 16) alag levers hain: RAG request time pe fresh information supply karta hai bina kisi retraining ke, ise private ya frequently-changing information ke liye sahi choice banate hue, jabki fine-tuning ek naya, abhi bhi frozen knowledge snapshot produce karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-embeddings-and-cosine-similarity',
    title: 'Embeddings Deep-Dive & Cosine Similarity',
    titleHi: 'Embeddings Deep-Dive Aur Cosine Similarity',
    description:
      "Module 1 previewed embeddings as a vector representation of meaning. This lesson goes deeper: what embedding models actually capture, why cosine similarity specifically is the comparison mechanism, and the practical mechanics of using embeddings to find relevant content.",
    descriptionHi:
      'Module 1 ne embeddings ka preview meaning ke ek vector representation ki tarah diya. Ye lesson zyada deep jaata hai: embedding models actually kya capture karte hain, cosine similarity specifically comparison mechanism kyun hai, aur relevant content dhundhne ke liye embeddings use karne ke practical mechanics.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A city laid out so that neighborhoods with similar character end up physically near each other, and measuring \"how similar are two neighborhoods\" by the DIRECTION you'd walk from downtown to reach each one, not the distance.** In a thoughtfully planned city, the arts district and the theater district might be right next to each other because they share a similar character, while the industrial zone sits far across town despite being the same physical distance from downtown as the arts district. If you wanted to compare two neighborhoods' similarity, the actual straight-line distance between them is one signal, but the ANGLE of the direction you'd walk from a shared reference point to reach each one captures something more specific about how alike their essential character is, independent of exactly how far out either happens to sit. An embedding space works like this thoughtfully planned city: semantically similar text ends up as vectors pointing in similar directions from the origin, and cosine similarity specifically measures the ANGLE between two vectors — not their raw distance — which is precisely why it's the standard comparison metric: two pieces of text can point in nearly the same direction (very similar meaning) regardless of the vectors' exact magnitudes.",
      hi: 'Ek city jo is tarike se layout ki gayi hai ki similar character wale neighborhoods physically ek doosre ke paas end up hote hain, aur "do neighborhoods kitne similar hain" ko us DIRECTION se measure karna jise aap downtown se har ek tak pahunchne ke liye walk karoge, distance se nahi. Ek thoughtfully planned city mein, arts district aur theater district ek doosre ke bilkul paas ho sakte hain kyunki wo ek similar character share karte hain, jabki industrial zone town ke across door baithta hai is fact ke bawajood ki ye downtown se wahi physical distance pe hai jitni arts district. Agar aap do neighborhoods ki similarity compare karna chahte ho, unke beech actual straight-line distance ek signal hai, par direction ka ANGLE jise aap ek shared reference point se har ek tak pahunchne ke liye walk karoge kuch zyada specific capture karta hai is baare mein ki unka essential character kitna alike hai, exactly kitna door har ek happen hota hai baithne se independently. Ek embedding space is thoughtfully planned city ki tarah kaam karta hai: semantically similar text vectors ki tarah end up hota hai jo origin se similar directions mein point karte hain, aur cosine similarity specifically do vectors ke beech ANGLE measure karta hai — unki raw distance nahi — yahi exactly wajah hai ki ye standard comparison metric hai: text ke do pieces almost wahi direction mein point kar sakte hain (bahut similar meaning) chahe vectors ki exact magnitudes kuch bhi hon.',
    },

    simple: `**What an embedding model actually produces, revisited from Module
1 with more precision:**

\`\`\`ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding; // an array of ~1536 numbers
}

const v1 = await embed('The cat sat on the mat.');
const v2 = await embed('A feline rested on the rug.');
const v3 = await embed('Quarterly revenue exceeded projections.');
// v1 and v2 will be CLOSE in the embedding space (similar meaning,
// almost no shared words); v3 will be FAR from both
\`\`\`

**Why cosine similarity, specifically, is the standard comparison
metric (not raw Euclidean distance):**

\`\`\`ts
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
  // Returns a value from -1 to 1: 1 = pointing in the identical
  // direction (essentially the same meaning), 0 = unrelated, -1 =
  // opposite meaning. CRITICALLY, this measures ANGLE, ignoring each
  // vector's magnitude (length) entirely.
}

// Why magnitude is deliberately ignored: a longer piece of text often
// produces a vector with a different overall magnitude than a short
// one, even when they express near-identical meaning — cosine
// similarity correctly treats these as similar by focusing on
// DIRECTION, where raw distance would be misleadingly affected by
// the length difference
\`\`\`

**The practical retrieval mechanics this powers:**

\`\`\`ts
async function findMostRelevant(query, documents) {
  const queryEmbedding = await embed(query);
  const scored = await Promise.all(
    documents.map(async (doc) => ({
      doc,
      score: cosineSimilarity(queryEmbedding, await embed(doc)),
    })),
  );
  return scored.sort((a, b) => b.score - a.score).slice(0, 3); // top 3
}

const results = await findMostRelevant(
  'How do I reset my password?',
  ['Password reset instructions...', 'Shipping policy...', 'Refund process...'],
);
// The password-reset document scores highest — its embedding points
// in a similar direction to the query's, despite different exact
// wording, because both are ABOUT the same underlying concept
\`\`\`

**Why embeddings genuinely capture meaning rather than surface-level
word overlap:** an embedding model is trained on massive amounts of
text to predict context, which forces it to represent WHAT concepts
mean, not just which literal characters appear — this is why "canine
companion" and "dog" end up with high cosine similarity despite sharing
zero words, the exact property that makes semantic search fundamentally
more capable than traditional keyword matching for retrieval, and the
entire foundation Module 8's vector-database lesson builds a production
retrieval pipeline on top of.`,

    simpleHi: `**Ek embedding model actually kya produce karta hai, Module 1 se
zyada precision ke saath revisited:**

\`\`\`ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding; // ~1536 numbers ka ek array
}

const v1 = await embed('The cat sat on the mat.');
const v2 = await embed('A feline rested on the rug.');
const v3 = await embed('Quarterly revenue exceeded projections.');
// v1 aur v2 embedding space mein CLOSE honge (similar meaning, almost
// koi shared words nahi); v3 dono se FAR hoga
\`\`\`

**Cosine similarity, specifically, standard comparison metric kyun hai
(raw Euclidean distance nahi):**

\`\`\`ts
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
  // -1 se 1 tak ek value return karta hai: 1 = identical direction mein
  // point karna (essentially wahi meaning), 0 = unrelated, -1 = opposite
  // meaning. CRITICALLY, ye ANGLE measure karta hai, har vector ki
  // magnitude (length) ko poori tarah ignore karte hue.
}

// Magnitude deliberately kyun ignore ki jaati hai: text ka ek lamba
// piece aksar ek chhote wale se ek alag overall magnitude wala vector
// produce karta hai, chahe wo near-identical meaning express karein —
// cosine similarity correctly inhe similar treat karta hai DIRECTION
// pe focus karke, jahan raw distance length difference se misleadingly
// affected hoti
\`\`\`

**Practical retrieval mechanics jise ye power karta hai:**

\`\`\`ts
async function findMostRelevant(query, documents) {
  const queryEmbedding = await embed(query);
  const scored = await Promise.all(
    documents.map(async (doc) => ({
      doc,
      score: cosineSimilarity(queryEmbedding, await embed(doc)),
    })),
  );
  return scored.sort((a, b) => b.score - a.score).slice(0, 3); // top 3
}

const results = await findMostRelevant(
  'How do I reset my password?',
  ['Password reset instructions...', 'Shipping policy...', 'Refund process...'],
);
// Password-reset document sabse highest score karta hai — uska
// embedding query ke similar direction mein point karta hai, alag
// exact wording ke bawajood, kyunki dono wahi underlying concept ke
// baare mein hain
\`\`\`

**Embeddings genuinely meaning kyun capture karte hain, surface-level
word overlap nahi:** ek embedding model massive amounts of text pe
context predict karne ke liye trained hai, jo ise force karta hai ye
represent karne ke liye ki concepts ka MATLAB KYA HAI, sirf kaunse
literal characters appear hote hain nahi — yahi wajah hai "canine
companion" aur "dog" high cosine similarity ke saath end up hote hain
zero words share karte hue bhi, exactly wo property jo semantic search
ko retrieval ke liye traditional keyword matching se fundamentally
zyada capable banata hai, aur poora foundation jispe Module 8 ka
vector-database lesson ek production retrieval pipeline build karta
hai.`,

    content: `## Why an embedding model captures meaning rather than surface form

An embedding model is trained on the task of predicting context — given
surrounding text, predict what word or concept plausibly fits. This
training objective forces the model to develop an internal
representation organized around what concepts actually mean and how
they relate to each other, since predicting context accurately requires
understanding meaning, not just memorizing which literal characters
tend to appear together. The resulting vector isn't a lookup of word
frequencies — it's a learned position in a space where the geometry
itself encodes semantic relationships, which is why texts with entirely
different vocabulary but similar meaning end up as nearby vectors.

## Why cosine similarity, specifically, rather than raw distance

Two embedding vectors can point in nearly the same direction (very
similar meaning) while having different magnitudes — this commonly
happens because factors like text length or word frequency can affect a
vector's overall scale without changing what it fundamentally
represents. Cosine similarity measures only the angle between two
vectors, deliberately ignoring magnitude, which makes it robust to
exactly this kind of scale variation. Raw Euclidean distance, by
contrast, is sensitive to magnitude differences that don't actually
reflect a meaningful difference in semantic content — which is why
cosine similarity, not raw distance, became the standard metric for
comparing embeddings in practice.

## Why this comparison mechanism is what makes semantic search
fundamentally different from keyword search

Traditional keyword search matches on literal character overlap — it
would completely miss a semantically relevant document that happens to
use different vocabulary than the search query. Embedding-based
retrieval compares MEANING via cosine similarity between the query's
embedding and each candidate document's embedding, correctly identifying
relevance even when there's zero literal word overlap. This is the
single mechanism that makes RAG's retrieval step (this module's core
purpose) actually capable of finding the right information regardless of
how differently it's phrased from the query.

## How this sets up Module 8's production retrieval pipeline

This lesson covers computing embeddings and comparing them one pair at a
time — computationally fine for a handful of documents, but this
approach doesn't scale to a knowledge base with thousands or millions of
documents, where computing cosine similarity against every single one
for every query becomes prohibitively slow. Module 8 covers the actual
production answer to this: vector databases and indexing strategies
(HNSW/IVF) that make this same underlying cosine-similarity comparison
practically fast at real scale, plus hybrid search and re-ranking to
improve result quality further. Everything in Module 8 is built directly
on the embedding and similarity concepts this lesson establishes.`,

    contentHi: `## Ek embedding model surface form ke bajaye meaning kyun capture karta hai

Ek embedding model context predict karne ke task pe trained hai — given
surrounding text, predict karo ki kaunsa word ya concept plausibly fit
hota hai. Ye training objective model ko force karta hai ek internal
representation develop karne ke liye jo is baat ke around organized hai
ki concepts actually kya matlab rakhte hain aur ek doosre se kaise
related hain, kyunki context ko accurately predict karne ke liye meaning
samajhna zaroori hai, sirf ye memorize karna nahi ki kaunse literal
characters saath appear hote hain. Resulting vector word frequencies ka
ek lookup nahi hai — ye ek learned position hai ek space mein jahan
geometry khud semantic relationships encode karti hai, yahi wajah hai
poori tarah alag vocabulary par similar meaning wale texts nearby
vectors ki tarah end up hote hain.

## Cosine similarity, specifically, raw distance ke bajaye kyun

Do embedding vectors almost wahi direction mein point kar sakte hain
(bahut similar meaning) alag magnitudes rakhte hue — ye commonly hota
hai kyunki text length ya word frequency jaise factors ek vector ke
overall scale ko affect kar sakte hain bina ye badle ki ye
fundamentally kya represent karta hai. Cosine similarity sirf do
vectors ke beech angle measure karta hai, magnitude ko deliberately
ignore karte hue, jo ise exactly is kism ki scale variation ke liye
robust banata hai. Raw Euclidean distance, contrast mein, magnitude
differences ke liye sensitive hai jo actually semantic content mein ek
meaningful difference reflect nahi karte — yahi wajah hai cosine
similarity, raw distance nahi, practically embeddings compare karne ke
liye standard metric ban gaya.

## Ye comparison mechanism semantic search ko keyword search se fundamentally alag kyun banata hai

Traditional keyword search literal character overlap pe match karta hai
— ye ek semantically relevant document ko poori tarah miss kar dega jo
search query se alag vocabulary use karta hai. Embedding-based retrieval
MEANING compare karta hai query ke embedding aur har candidate document
ke embedding ke beech cosine similarity ke through, relevance ko
correctly identify karte hue chahe zero literal word overlap ho. Ye ek
single mechanism hai jo RAG ke retrieval step (is module ka core
purpose) ko actually sahi information dhundhne mein capable banata hai
chahe ye query se kitna bhi differently phrase kiya gaya ho.

## Ye Module 8 ke production retrieval pipeline ko kaise set up karta hai

Ye lesson embeddings compute karna aur unhe ek time pe ek pair compare
karna cover karta hai — computationally theek hai muthi bhar documents
ke liye, par ye approach hazaron ya millions documents wali ek knowledge
base tak scale nahi karta, jahan har single ek ke against har query ke
liye cosine similarity compute karna prohibitively slow ho jaata hai.
Module 8 iske actual production answer ko cover karta hai: vector
databases aur indexing strategies (HNSW/IVF) jo wahi underlying
cosine-similarity comparison ko real scale pe practically fast banate
hain, plus hybrid search aur re-ranking result quality ko aur improve
karne ke liye. Module 8 mein sab kuch directly un embedding aur
similarity concepts pe built hai jise ye lesson establish karta hai.`,

    examples: [
      {
        title: 'Building a small semantic search function and demonstrating retrieval by meaning, not keywords',
        titleHi: 'Ek chhota semantic search function banana aur retrieval by meaning demonstrate karna, keywords nahi',
        codeJs: `import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text) {
  const response = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return response.data[0].embedding;
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

const knowledgeBase = [
  'To reset your password, click "Forgot Password" on the login screen.',
  'Our return policy allows refunds within 30 days of purchase.',
  'Shipping typically takes 3-5 business days within the country.',
];

async function semanticSearch(query, documents) {
  const queryVec = await embed(query);
  const scored = await Promise.all(
    documents.map(async (doc) => ({ doc, score: cosineSimilarity(queryVec, await embed(doc)) })),
  );
  return scored.sort((a, b) => b.score - a.score);
}

// A query using COMPLETELY different words than the matching document
const results = await semanticSearch('I forgot my login credentials, how do I get back in?', knowledgeBase);
console.log(results[0]);
// { doc: 'To reset your password...', score: ~0.72 } — highest score,
// despite sharing almost no literal words with the query`,
        codeTs: `import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return response.data[0].embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

const knowledgeBase = [
  'To reset your password, click "Forgot Password" on the login screen.',
  'Our return policy allows refunds within 30 days of purchase.',
  'Shipping typically takes 3-5 business days within the country.',
];

async function semanticSearch(
  query: string,
  documents: string[],
): Promise<{ doc: string; score: number }[]> {
  const queryVec = await embed(query);
  const scored = await Promise.all(
    documents.map(async (doc) => ({ doc, score: cosineSimilarity(queryVec, await embed(doc)) })),
  );
  return scored.sort((a, b) => b.score - a.score);
}

// A query using COMPLETELY different words than the matching document
const results = await semanticSearch('I forgot my login credentials, how do I get back in?', knowledgeBase);
console.log(results[0]);
// { doc: 'To reset your password...', score: ~0.72 } — highest score,
// despite sharing almost no literal words with the query`,
        code: `async function semanticSearch(query, documents) {
  const queryVec = await embed(query);
  const scored = await Promise.all(documents.map(async (doc) => ({ doc, score: cosineSimilarity(queryVec, await embed(doc)) })));
  return scored.sort((a, b) => b.score - a.score);
}`,
        output:
          "The password-reset document scores highest (~0.72) for a query about 'forgot login credentials,' despite the query and document sharing almost no exact words — 'forgot,' 'login,' and 'credentials' vs. 'reset,' 'password,' and 'Forgot Password.' The shipping and refund documents score noticeably lower.",
        explain:
          "A traditional keyword search for this exact query might miss the password-reset document entirely, since the query doesn't contain the word 'password.' The embedding-based comparison succeeds because both texts are fundamentally ABOUT the same underlying concept (regaining account access), which is exactly what cosine similarity between their embeddings captures.",
        explainHi:
          "Ek traditional keyword search is exact query ke liye password-reset document ko poori tarah miss kar sakta hai, kyunki query mein 'password' word nahi hai. Embedding-based comparison succeed karta hai kyunki dono texts fundamentally wahi underlying concept ke baare mein hain (account access wapas paana), jo exactly wo hai jise unke embeddings ke beech cosine similarity capture karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using raw Euclidean distance to compare embeddings, without
// understanding why magnitude differences can mislead the comparison
function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}
// A long, verbose paraphrase of a short query can end up with a larger
// raw distance than a shorter but LESS relevant document, purely due
// to magnitude differences unrelated to actual semantic similarity.`,
        right: `// Using cosine similarity, which deliberately ignores magnitude
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}
// Comparing DIRECTION rather than raw distance correctly identifies
// semantic similarity regardless of length-driven magnitude differences.`,
        why: "Embedding vectors' magnitudes can vary for reasons unrelated to semantic meaning (text length, word frequency), which makes raw distance an unreliable similarity signal. Cosine similarity's deliberate focus on direction rather than magnitude is precisely why it's the standard, robust metric for this comparison.",
        whyHi:
          "Embedding vectors ki magnitudes semantic meaning se unrelated reasons ki wajah se vary kar sakti hain (text length, word frequency), jo raw distance ko ek unreliable similarity signal banata hai. Cosine similarity ka magnitude ke bajaye direction pe deliberate focus exactly wo wajah hai ki ye is comparison ke liye standard, robust metric hai.",
      },
    ],

    realWorld: [
      {
        en: "A production support-ticket routing system embeds incoming tickets and compares them via cosine similarity against embeddings of past resolved tickets, correctly matching a new ticket phrased as 'the app keeps crashing when I try to upload a photo' with a past ticket about 'image upload causing the mobile client to freeze,' despite the two sharing almost no exact vocabulary.",
        hi: 'Ek production support-ticket routing system incoming tickets ko embed karta hai aur unhe past resolved tickets ke embeddings ke against cosine similarity ke through compare karta hai, ek naye ticket ko jo \'app baar baar crash ho jaata hai jab main ek photo upload karne ki koshish karta hoon\' ki tarah phrase kiya gaya hai correctly ek past ticket ke saath match karte hue jo \'image upload mobile client ko freeze kar deta hai\' ke baare mein hai, do ke almost koi exact vocabulary share na karne ke bawajood.',
      },
    ],

    interviewQA: [
      {
        q: "What does an embedding model's training objective (predicting context) actually force it to learn, and why does that make embeddings useful for semantic search?",
        qHi: 'Ek embedding model ka training objective (context predict karna) actually ise kya seekhne ke liye force karta hai, aur ye embeddings ko semantic search ke liye useful kyun banata hai?',
        a: "Predicting context accurately requires understanding what concepts mean and how they relate, not just memorizing literal character sequences — this forces the model to develop a representation organized around meaning rather than surface form. This is why semantically similar texts with entirely different vocabulary end up as nearby vectors, which is precisely the property semantic search relies on.",
        aHi: 'Context ko accurately predict karne ke liye ye samajhna zaroori hai ki concepts ka matlab kya hai aur wo kaise related hain, sirf literal character sequences memorize karna nahi — ye model ko meaning ke around organized ek representation develop karne ke liye force karta hai, surface form ke around nahi. Yahi wajah hai poori tarah alag vocabulary wale semantically similar texts nearby vectors ki tarah end up hote hain, jo exactly wo property hai jispe semantic search rely karta hai.',
      },
      {
        q: 'Why is cosine similarity, rather than raw Euclidean distance, the standard metric for comparing embedding vectors?',
        qHi: 'Cosine similarity, raw Euclidean distance ke bajaye, embedding vectors compare karne ke liye standard metric kyun hai?',
        a: "Two vectors can point in nearly the same direction (very similar meaning) while having different magnitudes, often due to factors like text length that don't reflect a meaningful semantic difference. Cosine similarity measures only the angle between vectors, deliberately ignoring magnitude, making it robust to this kind of scale variation — raw distance would be misleadingly affected by it.",
        aHi: 'Do vectors almost wahi direction mein point kar sakte hain (bahut similar meaning) alag magnitudes rakhte hue, aksar text length jaise factors ki wajah se jo ek meaningful semantic difference reflect nahi karte. Cosine similarity sirf vectors ke beech angle measure karta hai, magnitude ko deliberately ignore karte hue, ise is kism ki scale variation ke liye robust banate hue — raw distance isse misleadingly affected hota.',
      },
    ],

    exercises: [
      {
        task: "A search feature comparing embeddings with raw Euclidean distance returns a short, barely-relevant document ranked ABOVE a longer document that is genuinely highly relevant to the query. Using this lesson's reasoning, explain the likely cause and the fix.",
        taskHi: 'Ek search feature jo embeddings ko raw Euclidean distance se compare karta hai ek chhota, barely-relevant document ko ek lambe document ke UPAR rank karta hai jo query ke liye genuinely highly relevant hai. Is lesson ki reasoning use karke, likely cause aur fix explain karo.',
        hint: "Consider how document length might affect an embedding vector's magnitude, and which comparison metric is designed to be unaffected by that.",
        hintHi: 'Consider karo ki document length ek embedding vector ki magnitude ko kaise affect kar sakti hai, aur kaunsa comparison metric us se unaffected rehne ke liye design kiya gaya hai.',
      },
    ],

    keyTakeaways: [
      "An embedding model is trained to predict context, which forces it to represent what concepts mean rather than which literal characters appear — this is why semantically similar text with entirely different vocabulary ends up as nearby vectors.",
      'Cosine similarity measures the angle between two vectors, deliberately ignoring magnitude — this makes it robust to scale differences (like text length) that don\'t reflect genuine semantic difference, unlike raw Euclidean distance.',
      "This meaning-based comparison mechanism is what makes semantic search fundamentally more capable than keyword matching for retrieval — it correctly finds relevant content even with zero literal word overlap.",
      "Comparing embeddings pairwise (this lesson's approach) doesn't scale to large knowledge bases — Module 8 covers the production answer: vector databases and indexing strategies built directly on these same embedding and similarity concepts.",
    ],
    keyTakeawaysHi: [
      'Ek embedding model context predict karne ke liye trained hai, jo ise ye represent karne ke liye force karta hai ki concepts ka matlab kya hai, kaunse literal characters appear hote hain nahi — yahi wajah hai poori tarah alag vocabulary wala semantically similar text nearby vectors ki tarah end up hota hai.',
      'Cosine similarity do vectors ke beech angle measure karta hai, magnitude ko deliberately ignore karte hue — ye ise scale differences (jaise text length) ke liye robust banata hai jo genuine semantic difference reflect nahi karte, raw Euclidean distance ke unlike.',
      'Ye meaning-based comparison mechanism wo hai jo semantic search ko retrieval ke liye keyword matching se fundamentally zyada capable banata hai — ye correctly relevant content dhundhta hai zero literal word overlap ke saath bhi.',
      'Embeddings ko pairwise compare karna (is lesson ka approach) bade knowledge bases tak scale nahi karta — Module 8 production answer cover karta hai: vector databases aur indexing strategies jo directly in wahi embedding aur similarity concepts pe built hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-chunking-strategies',
    title: 'Chunking Strategies — Why Boundaries Genuinely Affect Retrieval Quality',
    titleHi: 'Chunking Strategies — Boundaries Genuinely Retrieval Quality Ko Kyun Affect Karte Hain',
    description:
      "Before any document can be embedded and retrieved (Lesson 2), it must be split into chunks small enough to embed meaningfully and retrieve precisely — this lesson covers why that splitting decision is a genuine design choice with real consequences, not an arbitrary implementation detail.",
    descriptionHi:
      'Kisi bhi document ko embed aur retrieve (Lesson 2) karne se pehle, use chunks mein split karna zaroori hai jo meaningfully embed aur precisely retrieve karne ke liye kaafi chhote hon — ye lesson cover karta hai ki wo splitting decision ek genuine design choice kyun hai real consequences ke saath, ek arbitrary implementation detail nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**Cutting a reference book into index cards for a card catalog — cutting exactly at chapter/section boundaries so each card captures one complete idea, versus cutting at fixed page intervals that sometimes slice a single explanation in half across two cards.** A card catalog cut at natural section boundaries means anyone searching for \"how photosynthesis works\" finds ONE card containing the complete, coherent explanation. A catalog cut at rigid, arbitrary page intervals might have that same explanation split awkwardly across two adjacent cards — the first half on one card, the second half on the next — so a search matching only the first card's content retrieves an explanation that's genuinely incomplete, missing the crucial second half that happened to fall on the next page. Chunking a document for RAG is exactly this cutting decision: a chunk boundary that respects the document's actual logical structure (a paragraph, a section) keeps each embeddable, retrievable unit conceptually whole, while a naive fixed-size cut can split a single coherent idea across two chunks, degrading retrieval quality in exactly the way the awkwardly-cut card catalog would.",
      hi: 'Ek reference book ko ek card catalog ke liye index cards mein katna — exactly chapter/section boundaries pe katte hue taaki har card ek complete idea capture kare, versus fixed page intervals pe katna jo kabhi kabhi ek single explanation ko do cards ke across half mein slice kar deta hai. Ek card catalog jo natural section boundaries pe kata gaya hai matlab hai koi bhi jo "photosynthesis kaise kaam karta hai" search karta hai ek ek CARD dhundhta hai jisme complete, coherent explanation ho. Ek catalog jo rigid, arbitrary page intervals pe kata gaya hai us same explanation ko do adjacent cards ke across awkwardly split kar sakta hai — pehla half ek card pe, doosra half agle pe — isliye ek search jo sirf pehle card ke content se match karti hai ek aisa explanation retrieve karti hai jo genuinely incomplete hai, us crucial second half ko miss karte hue jo agle page pe gir gaya tha. RAG ke liye ek document ko chunk karna exactly ye cutting decision hai: ek chunk boundary jo document ki actual logical structure (ek paragraph, ek section) ko respect karti hai har embeddable, retrievable unit ko conceptually whole rakhti hai, jabki ek naive fixed-size cut ek single coherent idea ko do chunks ke across split kar sakta hai, retrieval quality ko exactly us tarike se degrade karte hue jaise ek awkwardly-cut card catalog karega.',
    },

    simple: `**The problem chunking solves — an entire document is too big to
embed as one unit, and definitely too big to retrieve as one unit:**

\`\`\`
An embedding model has an input length limit (much like a model's
context window from Module 1), and even if it didn't, embedding an
entire 50-page document as ONE vector would blur together dozens of
distinct topics into a single, unhelpfully vague point in the embedding
space — a query about one specific topic in that document couldn't
match it precisely, because the embedding represents the AVERAGE of
everything in the whole document, not any one specific part.
\`\`\`

**Fixed-size chunking — simple, but blind to the document's actual
structure:**

\`\`\`ts
function chunkFixedSize(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
// Simple and fast, but a chunk boundary can land in the MIDDLE of a
// sentence, or split a single coherent explanation into two chunks
// that each individually make less sense — the "overlap" parameter is
// a partial mitigation, not a real fix for structural blindness
\`\`\`

**Structure-aware chunking — splitting at natural boundaries the
document already has:**

\`\`\`ts
function chunkByParagraph(text, maxChunkSize = 500) {
  const paragraphs = text.split(/\\n\\s*\\n/); // split at paragraph breaks
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > maxChunkSize && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += para + '\\n\\n';
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
// Each chunk is more likely to contain one or more COMPLETE thoughts,
// because it respects boundaries the author already put in the
// document, rather than cutting blindly at a fixed character count
\`\`\`

**Why chunk SIZE itself is a genuine tradeoff, not just "smaller is
safer":**

\`\`\`
Too large: a chunk covers multiple distinct topics, producing a vague
  embedding (Lesson 2) that doesn't precisely match any specific query
  — the averaging problem from the whole-document case, just less
  severe.

Too small: a chunk loses necessary context — a sentence like "This
  reduces the risk by 40%" is meaningless retrieved alone, without the
  paragraph establishing WHAT "this" refers to. A chunk that's too
  small can be embedded precisely but retrieved USELESSLY.

The right size is task- and document-dependent: a FAQ's short,
self-contained Q&A pairs might chunk naturally at the pair level; a
long-form technical document might need paragraph- or section-level
chunks with enough surrounding context to be independently meaningful.
\`\`\`

**Why chunk overlap is a partial mitigation, not a complete fix:**
overlapping adjacent chunks (each chunk includes the last N characters
of the previous one) reduces the chance that a critical sentence gets
fully isolated at a hard boundary, but it doesn't solve the fundamental
issue — it's a band-aid on fixed-size chunking's structural blindness,
which is exactly why structure-aware chunking (respecting paragraphs,
sections, or other natural document boundaries) is generally the more
reliable approach when a document's structure is available to use.`,

    simpleHi: `**Problem jise chunking solve karta hai — ek poora document ek unit
ki tarah embed karne ke liye bahut bada hai, aur definitely ek unit ki
tarah retrieve karne ke liye bahut bada:**

\`\`\`
Ek embedding model ki ek input length limit hai (Module 1 ke model's
context window ki tarah), aur agar na bhi hoti, ek poore 50-page
document ko EK vector ki tarah embed karna dozens of distinct topics ko
ek single, unhelpfully vague point mein embedding space mein blur kar
deta — us document mein ek specific topic ke baare mein ek query ise
precisely match nahi kar sakti, kyunki embedding poore document mein
har cheez ka AVERAGE represent karta hai, kisi ek specific part ka nahi.
\`\`\`

**Fixed-size chunking — simple, par document ki actual structure ke
liye blind:**

\`\`\`ts
function chunkFixedSize(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
// Simple aur fast, par ek chunk boundary ek sentence ke MIDDLE mein
// land ho sakta hai, ya ek single coherent explanation ko do chunks
// mein split kar sakta hai jo har ek individually kam sense banate
// hain — "overlap" parameter ek partial mitigation hai, structural
// blindness ka ek real fix nahi
\`\`\`

**Structure-aware chunking — natural boundaries pe split karna jo
document mein already hain:**

\`\`\`ts
function chunkByParagraph(text, maxChunkSize = 500) {
  const paragraphs = text.split(/\\n\\s*\\n/); // paragraph breaks pe split karo
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > maxChunkSize && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += para + '\\n\\n';
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
// Har chunk mein ek ya zyada COMPLETE thoughts hone ki zyada likelihood
// hai, kyunki ye un boundaries ko respect karta hai jo author ne
// already document mein daali, ek fixed character count pe blindly
// katne ke bajaye
\`\`\`

**Chunk SIZE khud ek genuine tradeoff kyun hai, sirf "chhota safer hai"
nahi:**

\`\`\`
Bahut bada: ek chunk multiple distinct topics cover karta hai, ek vague
  embedding produce karte hue (Lesson 2) jo kisi specific query se
  precisely match nahi karta — whole-document case ka averaging
  problem, bas kam severe.

Bahut chhota: ek chunk necessary context kho deta hai — ek sentence
  jaise "This reduces the risk by 40%" akela retrieve hone pe meaningless
  hai, us paragraph ke bina jo establish karta hai ki "this" kis cheez
  ko refer karta hai. Ek chunk jo bahut chhota hai precisely embed ho
  sakta hai par USELESSLY retrieve ho sakta hai.

Sahi size task- aur document-dependent hai: ek FAQ ke short,
self-contained Q&A pairs naturally pair level pe chunk ho sakte hain;
ek long-form technical document ko paragraph- ya section-level chunks
chahiye ho sakte hain kaafi surrounding context ke saath independently
meaningful hone ke liye.
\`\`\`

**Chunk overlap ek partial mitigation kyun hai, ek complete fix nahi:**
adjacent chunks ko overlap karna (har chunk previous wale ke last N
characters include karta hai) us chance ko kam karta hai ki ek critical
sentence fully ek hard boundary pe isolate ho jaaye, par ye fundamental
issue solve nahi karta — ye fixed-size chunking ki structural blindness
pe ek band-aid hai, yahi exactly wajah hai structure-aware chunking
(paragraphs, sections, ya doosre natural document boundaries ko
respect karna) generally zyada reliable approach hai jab ek document ki
structure use karne ke liye available ho.`,

    content: `## Why chunking is a necessary step, not an optional optimization

Lesson 2 established that embeddings represent meaning, but a single
embedding for an entire long document averages together every distinct
topic it contains into one vague point — a query about one specific
part of that document has no way to precisely match against an
embedding that represents the whole document's blurred-together
content. Chunking exists to solve this specifically: splitting a
document into smaller, more topically-focused pieces so each piece's
embedding meaningfully represents ONE coherent idea, precise enough for
a specific query to match against accurately.

## Why chunk boundaries are a genuine quality lever, not an
implementation detail

A chunk that splits mid-sentence or mid-explanation produces two
degraded pieces: each is embedded and can be retrieved, but neither
represents a complete, coherent unit of meaning on its own. If a query
happens to match the first half of a split explanation, the retrieved
context handed to the model (Module 1's sequence) is missing the
crucial second half — the model is generating an answer from incomplete
information, a genuinely different failure mode than the ones Module 1,
Lesson 3 covered but with the same underlying consequence: an answer
grounded in something less than the full, real picture. Structure-aware
chunking (respecting paragraph, section, or other natural boundaries) is
worth the modest additional complexity specifically because it reduces
how often this kind of boundary-induced incompleteness happens.

## Why chunk size is a genuine two-sided tradeoff, not "smaller is
always safer"

Oversized chunks reproduce, at a smaller scale, the same averaging
problem whole-document embedding has — multiple topics blurred into one
imprecise embedding. Undersized chunks introduce a different failure:
losing the surrounding context a piece of text needs to be meaningful on
its own, so a chunk can be retrieved successfully (a high cosine
similarity match) while being nearly useless once actually read, because
critical context that would make it interpretable was chunked away into
a different piece entirely. The right size is a genuine, document- and
task-specific judgment call, not a single number that's correct
everywhere — this is a real design decision, developed further in
Module 8's production pipeline.

## Why chunk overlap mitigates but doesn't eliminate the underlying
problem

Overlapping adjacent chunks (repeating the tail of one chunk at the
start of the next) increases the odds that a boundary-straddling
sentence appears intact in at least one chunk, but it doesn't change
the fact that a fixed-size splitting approach has no actual awareness of
where a document's ideas begin and end. This is why structure-aware
chunking is generally the more robust approach when a document's actual
structure (paragraphs, headings, sections) is available to use — it
addresses the root cause (boundaries chosen without regard for meaning)
rather than only reducing the odds of hitting the resulting problem.

## How this sets up Module 8

This lesson establishes the input side of a production RAG pipeline:
chunks, each embedded (Lesson 2) into a vector. Module 8 covers what
happens to those chunks and their embeddings at real scale — storing
and searching potentially millions of them efficiently (vector
databases and indexing), improving on pure semantic search with
keyword-aware hybrid search, and re-ranking retrieved results before
they reach the model. Every technique in Module 8 operates on the
chunks this lesson's decisions produce, which is why getting chunking
right has consequences that propagate through the entire rest of the
RAG pipeline.`,

    contentHi: `## Chunking ek zaroori step kyun hai, ek optional optimization nahi

Lesson 2 ne establish kiya ki embeddings meaning represent karte hain,
par ek poore lambe document ke liye ek single embedding usme contain
har distinct topic ko ek vague point mein average kar deta hai — us
document ke ek specific part ke baare mein ek query ise ek aise
embedding se precisely match nahi kar sakti jo poore document ke
blurred-together content ko represent karta hai. Chunking specifically
isliye exist karta hai: ek document ko chhote, zyada topically-focused
pieces mein split karna taaki har piece ka embedding ONE coherent idea
ko meaningfully represent kare, ek specific query ke accurately match
karne ke liye kaafi precise.

## Chunk boundaries ek genuine quality lever kyun hain, ek implementation detail nahi

Ek chunk jo mid-sentence ya mid-explanation split hota hai do degraded
pieces produce karta hai: har ek embed hota hai aur retrieve ho sakta
hai, par koi bhi apne aap mein ek complete, coherent unit of meaning
represent nahi karta. Agar ek query ek split explanation ke pehle half
se match hoti hai, model ko diya gaya retrieved context (Module 1 ki
sequence) crucial second half miss karta hai — model incomplete
information se ek answer generate kar raha hai, ek genuinely alag
failure mode jo Module 1, Lesson 3 ne cover kiya lekin wahi underlying
consequence ke saath: ek answer jo poori, real picture se kam kisi
cheez mein grounded hai. Structure-aware chunking (paragraph, section,
ya doosre natural boundaries ko respect karna) apni modest additional
complexity deserve karti hai specifically kyunki ye kam karti hai ki
kitni baar is kism ki boundary-induced incompleteness hoti hai.

## Chunk size ek genuine two-sided tradeoff kyun hai, "chhota hamesha safer hai" nahi

Oversized chunks, ek chhote scale pe, wahi averaging problem reproduce
karte hain jo whole-document embedding ka hai — multiple topics ek
imprecise embedding mein blurred. Undersized chunks ek alag failure
introduce karte hain: surrounding context khona jo text ke ek piece ko
apne aap mein meaningful hone ke liye chahiye, isliye ek chunk
successfully retrieve ho sakta hai (ek high cosine similarity match)
jabki actually padhne pe almost useless ho, kyunki critical context jo
ise interpretable banata us se poori tarah alag piece mein chunk ho
gaya. Sahi size ek genuine, document- aur task-specific judgment call
hai, ek single number nahi jo har jagah correct ho — ye ek real design
decision hai, Module 8 ke production pipeline mein further develop
kiya gaya.

## Chunk overlap underlying problem ko mitigate kyun karta hai eliminate nahi

Adjacent chunks ko overlap karna (ek chunk ke tail ko agle ke start pe
repeat karna) chances badhta hai ki ek boundary-straddling sentence kam
se kam ek chunk mein intact appear ho, par ye is fact ko nahi badalta
ki ek fixed-size splitting approach ke paas is baat ka koi actual
awareness nahi hai ki ek document ke ideas kahan shuru aur khatam hote
hain. Yahi wajah hai structure-aware chunking generally zyada robust
approach hai jab ek document ki actual structure (paragraphs, headings,
sections) use karne ke liye available ho — ye root cause (boundaries
jo meaning ko dhyaan mein rakhe bina choose kiye gaye) ko address karta
hai sirf resulting problem ke hit hone ke chances kam karne ke bajaye.

## Ye Module 8 ko kaise set up karta hai

Ye lesson ek production RAG pipeline ka input side establish karta hai:
chunks, har ek embedded (Lesson 2) ek vector mein. Module 8 cover karta
hai ki un chunks aur unke embeddings ka real scale pe kya hota hai —
potentially millions ko efficiently store aur search karna (vector
databases aur indexing), pure semantic search ko keyword-aware hybrid
search se improve karna, aur retrieved results ko re-rank karna model
tak pahunchne se pehle. Module 8 ki har technique un chunks pe operate
karti hai jo is lesson ke decisions produce karte hain, yahi wajah hai
chunking sahi karne ke consequences hain jo poori baaki RAG pipeline ke
through propagate hote hain.`,

    examples: [
      {
        title: 'Comparing fixed-size chunking (splitting mid-sentence) against structure-aware chunking on the same document',
        titleHi: 'Wahi document pe fixed-size chunking (mid-sentence split) ko structure-aware chunking ke against compare karna',
        codeJs: `const document = \`Our refund policy allows returns within 30 days of
purchase. Items must be in their original packaging with all tags
attached.

Shipping costs for returns are the customer's responsibility, except
in cases where the item arrived damaged or defective.\`;

function chunkFixedSize(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

function chunkByParagraph(text) {
  return text.split(/\\n\\s*\\n/).map((p) => p.trim()).filter(Boolean);
}

console.log(chunkFixedSize(document, 80));
// Chunk 2 might read: "purchase. Items must be in their orig" —
// cut mid-word, mid-idea, genuinely incomplete on its own

console.log(chunkByParagraph(document));
// [
//   "Our refund policy allows returns within 30 days of purchase.
//    Items must be in their original packaging with all tags attached.",
//   "Shipping costs for returns are the customer's responsibility,
//    except in cases where the item arrived damaged or defective."
// ]
// Each chunk is a COMPLETE, self-contained thought`,
        codeTs: `const document = \`Our refund policy allows returns within 30 days of
purchase. Items must be in their original packaging with all tags
attached.

Shipping costs for returns are the customer's responsibility, except
in cases where the item arrived damaged or defective.\`;

function chunkFixedSize(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

function chunkByParagraph(text: string): string[] {
  return text.split(/\\n\\s*\\n/).map((p) => p.trim()).filter(Boolean);
}

console.log(chunkFixedSize(document, 80));
// Chunk 2 might read: "purchase. Items must be in their orig" —
// cut mid-word, mid-idea, genuinely incomplete on its own

console.log(chunkByParagraph(document));
// [
//   "Our refund policy allows returns within 30 days of purchase.
//    Items must be in their original packaging with all tags attached.",
//   "Shipping costs for returns are the customer's responsibility,
//    except in cases where the item arrived damaged or defective."
// ]
// Each chunk is a COMPLETE, self-contained thought`,
        code: `function chunkFixedSize(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) chunks.push(text.slice(i, i + chunkSize));
  return chunks;
}
function chunkByParagraph(text) {
  return text.split(/\\n\\s*\\n/).map((p) => p.trim()).filter(Boolean);
}`,
        output:
          "chunkFixedSize with an unlucky chunkSize produces a chunk ending mid-word ('...their orig'), which embeds and could be retrieved, but is genuinely incomprehensible on its own. chunkByParagraph produces two chunks, each a complete, self-contained policy statement — either one, retrieved alone, is fully meaningful.",
        explain:
          "This demonstrates the core claim of this lesson concretely: the SAME document produces meaningfully different retrieval quality depending purely on where the chunk boundaries fall, independent of anything about the embedding model or similarity search (Lesson 2) — chunking is a genuine, consequential design decision made before those mechanisms even come into play.",
        explainHi:
          "Ye is lesson ke core claim ko concretely demonstrate karta hai: WAHI document meaningfully alag retrieval quality produce karta hai purely is baat pe based ki chunk boundaries kahan girte hain, embedding model ya similarity search (Lesson 2) ke baare mein kisi bhi cheez se independently — chunking ek genuine, consequential design decision hai jo un mechanisms ke play mein aane se pehle hi liya jaata hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Choosing a chunk size purely based on a round number, without
// considering the document's actual structure or the retrieval task
function chunkDocument(text) {
  return chunkFixedSize(text, 1000); // "1000 felt like a reasonable number"
  // No consideration of where sentences/paragraphs actually end,
  // whether 1000 characters is too large (blurring multiple topics)
  // or too small (losing necessary context) for THIS document type.
}`,
        right: `// Choosing a chunking strategy based on the document's actual structure
function chunkDocument(text, documentType) {
  if (documentType === 'faq') {
    return chunkByQAPair(text); // each Q&A pair is naturally self-contained
  }
  if (documentType === 'long-form-technical') {
    return chunkByParagraph(text, { maxSize: 800 }); // respects natural breaks
  }
  return chunkByParagraph(text); // a sensible structure-aware default
}`,
        why: "A chunk size or strategy chosen arbitrarily, without considering the document's actual structure or how the resulting chunks will be used, risks both averaging distinct topics together (too large) and losing necessary context (too small) — the right choice is a genuine, document-specific judgment call, not a universal constant.",
        whyHi:
          "Ek chunk size ya strategy arbitrarily choose kiya gaya, document ki actual structure ya resulting chunks kaise use honge iske baare mein consider kiye bina, dono distinct topics ko average karne (bahut bada) aur necessary context khone (bahut chhota) ka risk rakhta hai — sahi choice ek genuine, document-specific judgment call hai, ek universal constant nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production legal-document RAG system chunks by section and subsection (respecting the document's actual numbered structure) rather than by fixed character count, specifically because a legal clause split mid-sentence across two chunks could cause the retrieval step to surface an incomplete, potentially misleading fragment of a contractual term.",
        hi: 'Ek production legal-document RAG system section aur subsection ke hisaab se chunk karta hai (document ki actual numbered structure ko respect karte hue) fixed character count ke hisaab se nahi, specifically kyunki ek legal clause jo do chunks ke across mid-sentence split hoti hai retrieval step ko ek incomplete, potentially misleading fragment ek contractual term ka surface karne ka cause bana sakti hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't an entire long document simply be embedded as a single vector for RAG?",
        qHi: 'Ek poora lamba document RAG ke liye simply ek single vector ki tarah kyun embed nahi kiya ja sakta?',
        a: "An embedding for an entire document averages together every distinct topic it contains into one vague point in the embedding space — a query about one specific part of that document has no way to precisely match against an embedding representing the blurred-together content of the whole thing. Chunking splits the document into smaller, topically-focused pieces so each embedding meaningfully represents one coherent idea.",
        aHi: 'Ek poore document ke liye ek embedding usme contain har distinct topic ko embedding space mein ek vague point mein average kar deta hai — us document ke ek specific part ke baare mein ek query ise ek aise embedding se precisely match nahi kar sakti jo poori cheez ke blurred-together content ko represent karta hai. Chunking document ko chhote, topically-focused pieces mein split karta hai taaki har embedding ek coherent idea ko meaningfully represent kare.',
      },
      {
        q: 'Why does the specific location of a chunk boundary genuinely affect retrieval quality, rather than being an arbitrary implementation detail?',
        qHi: 'Ek chunk boundary ki specific location genuinely retrieval quality ko kyun affect karti hai, ek arbitrary implementation detail hone ke bajaye?',
        a: "A boundary that splits mid-sentence or mid-explanation produces two chunks, neither of which represents a complete, coherent unit of meaning on its own. If a query matches the fragment containing only half an explanation, the model generates its answer from genuinely incomplete retrieved context — a real quality degradation traceable directly to where the boundary happened to fall.",
        aHi: 'Ek boundary jo mid-sentence ya mid-explanation split hoti hai do chunks produce karti hai, jinme se koi bhi apne aap mein ek complete, coherent unit of meaning represent nahi karta. Agar ek query us fragment se match hoti hai jisme sirf aadha explanation hai, model apna answer genuinely incomplete retrieved context se generate karta hai — ek real quality degradation jo directly is baat tak traceable hai ki boundary kahan gira.',
      },
    ],

    exercises: [
      {
        task: "A team chunks a 200-page technical manual using a fixed size of 200 characters per chunk, with no overlap and no awareness of paragraph or section boundaries. Users report that retrieved answers often feel 'cut off' or missing context. Diagnose the likely cause using this lesson's reasoning, and propose a better chunking strategy.",
        taskHi: 'Ek team ek 200-page technical manual ko ek fixed size 200 characters per chunk use karke chunk karti hai, koi overlap nahi aur paragraph ya section boundaries ka koi awareness nahi. Users report karte hain ki retrieved answers aksar \'cut off\' ya missing context feel karte hain. Is lesson ki reasoning use karke likely cause diagnose karo, aur ek better chunking strategy propose karo.',
        hint: "Consider both the chunk size (too small for this document type?) and the boundary-placement strategy (fixed character count vs. respecting the document's actual structure).",
        hintHi: 'Dono chunk size (is document type ke liye bahut chhota?) aur boundary-placement strategy (fixed character count vs. document ki actual structure ko respect karna) consider karo.',
      },
    ],

    keyTakeaways: [
      "Chunking exists because an embedding for an entire long document averages together every distinct topic into one vague point — chunks let each embedding meaningfully represent one coherent idea, precise enough to match a specific query.",
      'A chunk boundary that splits mid-sentence or mid-explanation produces two incomplete units, degrading retrieval quality — structure-aware chunking (respecting paragraphs, sections) generally produces more reliable results than naive fixed-size splitting.',
      "Chunk size is a genuine two-sided tradeoff: too large re-introduces the whole-document averaging problem at a smaller scale; too small loses the surrounding context a piece of text needs to be meaningful on its own.",
      "Chunk overlap mitigates but doesn't eliminate boundary-induced problems — it's a partial fix for fixed-size chunking's structural blindness, not a substitute for respecting a document's actual structure when that structure is available.",
    ],
    keyTakeawaysHi: [
      'Chunking isliye exist karta hai kyunki ek poore lambe document ke liye ek embedding usme har distinct topic ko ek vague point mein average kar deta hai — chunks har embedding ko ek coherent idea ko meaningfully represent karne dete hain, ek specific query se match karne ke liye kaafi precise.',
      'Ek chunk boundary jo mid-sentence ya mid-explanation split hoti hai do incomplete units produce karti hai, retrieval quality ko degrade karte hue — structure-aware chunking (paragraphs, sections ko respect karna) generally naive fixed-size splitting se zyada reliable results produce karta hai.',
      'Chunk size ek genuine two-sided tradeoff hai: bahut bada whole-document averaging problem ko ek chhote scale pe re-introduce karta hai; bahut chhota us surrounding context ko kho deta hai jo text ke ek piece ko apne aap mein meaningful hone ke liye chahiye.',
      'Chunk overlap boundary-induced problems ko mitigate karta hai eliminate nahi — ye fixed-size chunking ki structural blindness ke liye ek partial fix hai, ek document ki actual structure ko respect karne ka substitute nahi jab wo structure available ho.',
    ],
  },
];
