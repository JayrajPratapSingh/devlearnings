/**
 * Generative AI Complete Course — Module 11: Reliability, Retries & Guardrails, lessons 1-3.
 *
 * Lesson 1: Hallucination mitigation techniques — grounding, citations, confidence signals.
 * Lesson 2: Output validation, retry/fallback chains across providers, content moderation.
 * Lesson 3: Circuit breakers for AI calls, extending general resilience patterns.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-hallucination-mitigation-techniques',
    title: 'Hallucination Mitigation — Grounding, Citations & Confidence Signals',
    titleHi: 'Hallucination Mitigation — Grounding, Citations Aur Confidence Signals',
    description:
      "Module 1 established hallucination as structural, and Module 7 introduced RAG as the primary mitigation. This lesson covers the fuller toolkit: grounding, requiring citations, and confidence signals — each reducing, but never eliminating, the risk this course established from the start.",
    descriptionHi:
      'Module 1 ne hallucination ko structural ki tarah establish kiya, aur Module 7 ne RAG ko primary mitigation ki tarah introduce kiya. Ye lesson fuller toolkit cover karta hai: grounding, citations chahna, aur confidence signals — har ek us risk ko kam karta hai, kabhi eliminate nahi karta, jise ye course shuru se establish kar chuka hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A witness testifying in court who's required to cite exactly which specific document or moment they're recalling, rather than simply stating things with confidence.** A witness allowed to simply assert things confidently, with no requirement to point to a specific source, can state a false memory with exactly the same tone and certainty as a true one — confidence alone carries no information about accuracy. A courtroom that requires \"and how do you know this — which document, which specific moment\" forces every claim to be traceable to something checkable, which doesn't make the witness incapable of being wrong, but makes wrongness far easier to catch, since a fabricated claim now has to also fabricate a specific, checkable source rather than just an assertion. Grounding, citations, and confidence signals work exactly this way for a model: none of them make hallucination structurally impossible (Module 1 established that nothing can), but each forces an answer to be more traceable and checkable than a bare, confident assertion — turning an unfalsifiable claim into a falsifiable one is real progress, even without eliminating the underlying risk.",
      hi: 'Ek witness jo court mein testify kar raha hai jise exactly ye cite karna zaroori hai ki wo kaunsa specific document ya moment recall kar raha hai, simply confidence ke saath cheezein state karne ke bajaye. Ek witness jise simply confidently cheezein assert karne diya jaata hai, kisi specific source ki taraf point karne ki requirement ke bina, ek false memory ko exactly wahi tone aur certainty ke saath state kar sakta hai jo ek true wale ki hai — akela confidence accuracy ke baare mein koi information carry nahi karta. Ek courtroom jo "aur aapko ye kaise pata hai — kaunsa document, kaunsa specific moment" chahta hai har claim ko kisi checkable cheez tak traceable hone ke liye force karta hai, jo witness ko galat hone se incapable nahi banata, par galat hona kaafi zyada catch karna aasan banata hai, kyunki ek fabricated claim ko ab ek specific, checkable source bhi fabricate karna padta hai sirf ek assertion ke bajaye. Grounding, citations, aur confidence signals ek model ke liye exactly is tarike se kaam karte hain: inme se koi bhi hallucination ko structurally impossible nahi banata (Module 1 ne establish kiya ki kuch bhi nahi bana sakta), par har ek ek answer ko ek bare, confident assertion se zyada traceable aur checkable hone ke liye force karta hai — ek unfalsifiable claim ko ek falsifiable wale mein badalna real progress hai, underlying risk ko eliminate kiye bina bhi.',
    },

    simple: `**Grounding — revisiting RAG (Module 7-8) specifically as a
hallucination-mitigation mechanism:**

\`\`\`ts
// Ungrounded — the model answers from implicit, unverifiable training-
// time association (Module 1's structural hallucination risk, unmitigated)
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  messages: [{ role: 'user', content: 'What is our refund policy for damaged items?' }],
});

// Grounded — the answer is generated conditioned on real, retrieved
// source material (Module 7, Lesson 1's original argument), not
// implicit association
const relevantPolicy = await retrieveFromKnowledgeBase('refund policy damaged items');
const groundedResponse = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  system: 'Answer using ONLY the provided policy text. If the answer is not present, say so explicitly.',
  messages: [{ role: 'user', content: \`Policy:\n\${relevantPolicy}\n\nQuestion: What is our refund policy for damaged items?\` }],
});
\`\`\`

**Requiring citations — forcing an answer to be traceable to a
specific source, not just plausible-sounding:**

\`\`\`ts
const systemPrompt = \`Answer using ONLY the provided sources. For every
factual claim, cite the specific source number in brackets, like [1].
If a claim cannot be traced to a specific source, do not include it.\`;

// A citation requirement means a fabricated claim has to ALSO
// fabricate a specific, checkable source reference — the same
// mechanism the courtroom analogy uses: making an assertion traceable
// converts an unfalsifiable claim into a checkable one, even though
// it doesn't make fabrication impossible
\`\`\`

**Confidence signals — asking the model to distinguish what it's
actually confident about:**

\`\`\`ts
const systemPrompt = \`For each claim in your answer, indicate your
confidence: HIGH (directly stated in the provided source), MEDIUM
(reasonably inferred from the source), or LOW (not supported by the
source, general knowledge only). Never state a LOW-confidence claim
without explicitly flagging it as such.\`;

// This asks the model to generate an EXPLICIT signal about its own
// reliability alongside the answer — genuinely useful when it works,
// but note the caveat below
\`\`\`

**The critical caveat this lesson establishes about confidence
signals specifically:** a model's stated confidence is ITSELF generated
text, produced by the exact same mechanism (Module 1) as everything
else it says — there's no guarantee a model's self-reported "HIGH
confidence" genuinely correlates with actual accuracy, since generating
"HIGH confidence" is just as much a plausible-continuation choice as
generating any other token. Confidence signals are a USEFUL heuristic
that measurably helps in practice, not a verified, reliable measurement
— treating a model's self-reported confidence as a hard guarantee
repeats the exact mistake Module 1, Lesson 3 warned against: confusing
confident-sounding output with actually-verified output.

**Why all three techniques reduce, but never eliminate, the risk —
tying directly back to Module 1:** Module 1, Lesson 3 established that
hallucination is a structural property of the generation mechanism, not
a bug — no technique built on top of that same mechanism can make it
categorically truth-aware. Grounding, citations, and confidence signals
all work by changing what's generated FROM or adding structure that
makes an answer easier to verify AFTER the fact — genuine, measurable
improvements, but none of them are a claim that hallucination has been
"solved," which is precisely why Lesson 2's validation and Lesson 3's
resilience patterns exist as additional, complementary layers rather
than being made unnecessary by this lesson's techniques.`,

    simpleHi: `**Grounding — RAG (Module 7-8) ko specifically ek hallucination-
mitigation mechanism ki tarah revisit karna:**

\`\`\`ts
// Ungrounded — model implicit, unverifiable training-time association
// se answer karta hai (Module 1 ka structural hallucination risk,
// unmitigated)
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  messages: [{ role: 'user', content: 'What is our refund policy for damaged items?' }],
});

// Grounded — answer real, retrieved source material pe conditioned
// generate hota hai (Module 7, Lesson 1 ka original argument),
// implicit association nahi
const relevantPolicy = await retrieveFromKnowledgeBase('refund policy damaged items');
const groundedResponse = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  system: 'Answer using ONLY the provided policy text. If the answer is not present, say so explicitly.',
  messages: [{ role: 'user', content: \`Policy:\n\${relevantPolicy}\n\nQuestion: What is our refund policy for damaged items?\` }],
});
\`\`\`

**Citations chahna — ek answer ko ek specific source tak traceable
hone ke liye force karna, sirf plausible-sounding nahi:**

\`\`\`ts
const systemPrompt = \`Answer using ONLY the provided sources. For every
factual claim, cite the specific source number in brackets, like [1].
If a claim cannot be traced to a specific source, do not include it.\`;

// Ek citation requirement matlab hai ek fabricated claim ko bhi ek
// specific, checkable source reference fabricate karna padta hai —
// wahi mechanism jo courtroom analogy use karta hai: ek assertion ko
// traceable banana ek unfalsifiable claim ko ek checkable wale mein
// convert karta hai, chahe ye fabrication ko impossible na banaye
\`\`\`

**Confidence signals — model ko poochna ki ye actually kis baare mein
confident hai distinguish kare:**

\`\`\`ts
const systemPrompt = \`For each claim in your answer, indicate your
confidence: HIGH (directly stated in the provided source), MEDIUM
(reasonably inferred from the source), or LOW (not supported by the
source, general knowledge only). Never state a LOW-confidence claim
without explicitly flagging it as such.\`;

// Ye model se poochta hai ki apni khud ki reliability ke baare mein ek
// EXPLICIT signal generate kare answer ke saath — genuinely useful
// jab ye kaam karta hai, par niche caveat note karo
\`\`\`

**Critical caveat jise ye lesson specifically confidence signals ke
baare mein establish karta hai:** ek model ka stated confidence KHUD
generated text hai, wahi exact mechanism (Module 1) dwara produce kiya
gaya jo ye baaki sab kuch kehta hai — koi guarantee nahi hai ki ek model
ka self-reported "HIGH confidence" genuinely actual accuracy se
correlate karta hai, kyunki "HIGH confidence" generate karna utni hi ek
plausible-continuation choice hai jitna kisi bhi doosre token ko generate
karna. Confidence signals ek USEFUL heuristic hain jo practically
measurably help karta hai, ek verified, reliable measurement nahi —
model ke self-reported confidence ko ek hard guarantee ki tarah treat
karna exactly wahi mistake repeat karta hai jiske against Module 1,
Lesson 3 ne warn kiya: confident-sounding output ko actually-verified
output se confuse karna.

**Teenon techniques risk ko kyun kam karti hain, kabhi eliminate nahi
karti — directly Module 1 tak wapas tied:** Module 1, Lesson 3 ne
establish kiya ki hallucination generation mechanism ki ek structural
property hai, ek bug nahi — wahi mechanism ke upar built koi bhi
technique ise categorically truth-aware nahi bana sakti. Grounding,
citations, aur confidence signals sab us cheez ko badalke kaam karte
hain jo GENERATE HOTA HAI or aisi structure add karke jo ek answer ko
baad mein verify karna aasan banata hai — genuine, measurable
improvements, par inme se koi bhi ye claim nahi hai ki hallucination
"solve" ho gaya hai, yahi exactly wajah hai Lesson 2 ke validation aur
Lesson 3 ke resilience patterns additional, complementary layers ki
tarah exist karte hain is lesson ki techniques se unnecessary bane bina.`,

    content: `## Why grounding is the highest-leverage technique, revisited from
Module 7's original argument

Module 7, Lesson 1 established grounding's mechanism precisely: a model
answering from real, retrieved source material present directly in its
context is generating conditioned on something verifiable, rather than
an implicit, unverifiable association formed during training. This
lesson revisits that same mechanism specifically under the heading of
hallucination mitigation because it's the technique with the strongest
theoretical grounding (no pun intended) — it doesn't ask the model to
somehow behave differently, it changes what's actually available for
the model to condition its generation on, the exact lever Module 1,
Lesson 3 identified as the only kind of intervention that can genuinely
work.

## Why requiring citations converts an unfalsifiable claim into a
falsifiable one

A bare factual assertion with no citation requirement can be true or
fabricated with identical surface presentation — there's no way to
check it without independently verifying the underlying fact from
scratch. Requiring a citation to a specific source forces a
fundamentally different failure mode: a fabricated claim must now ALSO
fabricate a plausible-looking but checkable source reference, and
checking whether that specific source actually says what's claimed is a
tractable verification task in a way that verifying an ungrounded
assertion from scratch is not. This doesn't prevent fabrication, but it
converts hallucination from something nearly impossible to catch into
something checkable — a genuine, meaningful improvement in a system's
overall trustworthiness even without eliminating the underlying risk.

## Why confidence signals are useful but require the most caution of
these three techniques

Grounding and citations both change what a model conditions its
generation on or add externally-checkable structure. A confidence
signal, by contrast, is itself just more generated text — a model
producing "HIGH confidence" is doing the same next-token prediction
(Module 1) as producing anything else, with no special mechanism
verifying that the stated confidence level actually tracks the
underlying claim's truth. In practice, confidence signals do provide a
measurably useful heuristic (a model's stated uncertainty correlates
with actual reliability more often than chance), but treating a
stated confidence level as a verified guarantee rather than a useful-
but-imperfect signal repeats exactly the category error Module 1,
Lesson 3 warned against.

## Why none of these techniques individually or together "solve"
hallucination, and why that's the correct framing

Each technique in this lesson demonstrably reduces the RATE of
hallucination in practice — this is real, valuable progress. None of
them, individually or combined, changes the structural fact Module 1
established: the underlying generation mechanism has no built-in
truth-tracking component. This is precisely why Lesson 2's output
validation and Lesson 3's resilience patterns exist as additional
layers rather than being redundant with this lesson's techniques — a
production system's actual reliability comes from combining grounding,
citations, and confidence signals with a validation and fallback
strategy that assumes the model can still be wrong even after all of
this lesson's mitigations are applied.`,

    contentHi: `## Grounding highest-leverage technique kyun hai, Module 7 ke original argument se revisited

Module 7, Lesson 1 ne grounding ka mechanism precisely establish kiya:
ek model jo real, retrieved source material se answer karta hai jo
directly uske context mein present hai kisi verifiable cheez pe
conditioned generate kar raha hai, training ke dauran formed ek
implicit, unverifiable association ke bajaye. Ye lesson wahi mechanism
ko specifically hallucination mitigation ke heading ke under revisit
karta hai kyunki ye technique hai jiski strongest theoretical grounding
hai — ye model se ye nahi poochta ki kisi tarah differently behave kare,
ye us cheez ko badalta hai jo actually model ke liye available hai apne
generation ko condition karne ke liye, exact wo lever jise Module 1,
Lesson 3 ne us kism ke intervention ki tarah identify kiya jo genuinely
kaam kar sakta hai.

## Citations chahna ek unfalsifiable claim ko ek falsifiable wale mein kyun convert karta hai

Ek bare factual assertion koi citation requirement ke bina identical
surface presentation ke saath sach ya fabricated ho sakta hai — ise
check karne ka koi tareeka nahi hai bina underlying fact ko scratch se
independently verify kiye. Ek specific source ke liye ek citation
chahna ek fundamentally alag failure mode force karta hai: ek
fabricated claim ko ab ek plausible-looking par checkable source
reference bhi fabricate karna padta hai, aur ye check karna ki wo
specific source actually wo kehta hai jo claim kiya gaya ek tractable
verification task hai us tarike se jo ek ungrounded assertion ko scratch
se verify karna nahi hai. Ye fabrication ko rokta nahi, par ye
hallucination ko kisi aisi cheez se convert karta hai jise catch karna
almost impossible hai kisi checkable cheez mein — ek system ki overall
trustworthiness mein ek genuine, meaningful improvement underlying risk
ko eliminate kiye bina bhi.

## Confidence signals in teen techniques mein se sabse zyada caution kyun chahte hain

Grounding aur citations dono badalte hain ki ek model apne generation ko
kispe condition karta hai ya externally-checkable structure add karte
hain. Ek confidence signal, iske bajaye, khud sirf aur zyada generated
text hai — ek model "HIGH confidence" produce karta hua wahi next-token
prediction kar raha hai (Module 1) jo kuch bhi doosri cheez produce
karne ke liye karta, koi special mechanism ke bina ye verify karte hue
ki stated confidence level actually underlying claim ki truth ko track
karti hai. Practically, confidence signals ek measurably useful
heuristic provide karte hain (ek model ka stated uncertainty chance se
zyada actual reliability se correlate karta hai), par ek stated
confidence level ko ek verified guarantee ki tarah treat karna ek
useful-but-imperfect signal ke bajaye exactly wahi category error
repeat karta hai jiske against Module 1, Lesson 3 ne warn kiya.

## In techniques mein se koi bhi individually ya saath mein hallucination "solve" kyun nahi karta, aur wo framing correct kyun hai

Is lesson ki har technique practically hallucination ki RATE ko
demonstrably kam karti hai — ye real, valuable progress hai. Inme se
koi bhi, individually ya combined, us structural fact ko nahi badalta
jise Module 1 ne establish kiya: underlying generation mechanism mein
koi built-in truth-tracking component nahi hai. Yahi exactly wajah hai
Lesson 2 ka output validation aur Lesson 3 ke resilience patterns
additional layers ki tarah exist karte hain is lesson ki techniques se
redundant hone ke bajaye — ek production system ki actual reliability
grounding, citations, aur confidence signals ko ek validation aur
fallback strategy ke saath combine karne se aati hai jo assume karti hai
ki model abhi bhi galat ho sakta hai is lesson ke saare mitigations
apply hone ke baad bhi.`,

    examples: [
      {
        title: 'Combining grounding, citations, and confidence signals in one production-shaped prompt',
        titleHi: 'Ek production-shaped prompt mein grounding, citations, aur confidence signals ko combine karna',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function answerWithMitigations(question, retrievedSources) {
  // GROUNDING — real retrieved content, not implicit association
  const sourceBlock = retrievedSources
    .map((s, i) => \`[\${i + 1}] \${s.content}\`)
    .join('\\n\\n');

  const systemPrompt = \`Answer using ONLY the sources below.

Requirements:
- CITATIONS: every factual claim must cite its source number, like [1]
- CONFIDENCE: mark each claim as (HIGH), (MEDIUM), or (LOW) confidence
  based on how directly the source supports it
- If the answer isn't in the sources, say so explicitly rather than guessing

Sources:
\${sourceBlock}\`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  });

  return response.content[0].text;
}

const sources = [
  { content: 'Refunds are issued within 5 business days for items returned within 30 days.' },
  { content: 'Damaged items may be returned regardless of the 30-day window if reported within 48 hours of delivery.' },
];

const answer = await answerWithMitigations(
  'Can I get a refund for a damaged item I received 40 days ago?',
  sources,
);
// Expected shape: "Yes, damaged items can be returned regardless of
// the 30-day window if reported within 48 hours of delivery [2]
// (HIGH). However, whether you reported it within 48 hours isn't
// specified in your question (LOW confidence on eligibility without
// that detail)."`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Source { content: string; }

async function answerWithMitigations(question: string, retrievedSources: Source[]): Promise<string> {
  // GROUNDING — real retrieved content, not implicit association
  const sourceBlock = retrievedSources
    .map((s, i) => \`[\${i + 1}] \${s.content}\`)
    .join('\\n\\n');

  const systemPrompt = \`Answer using ONLY the sources below.

Requirements:
- CITATIONS: every factual claim must cite its source number, like [1]
- CONFIDENCE: mark each claim as (HIGH), (MEDIUM), or (LOW) confidence
  based on how directly the source supports it
- If the answer isn't in the sources, say so explicitly rather than guessing

Sources:
\${sourceBlock}\`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return block.text;
}

const sources: Source[] = [
  { content: 'Refunds are issued within 5 business days for items returned within 30 days.' },
  { content: 'Damaged items may be returned regardless of the 30-day window if reported within 48 hours of delivery.' },
];

const answer = await answerWithMitigations(
  'Can I get a refund for a damaged item I received 40 days ago?',
  sources,
);
// Expected shape: "Yes, damaged items can be returned regardless of
// the 30-day window if reported within 48 hours of delivery [2]
// (HIGH). However, whether you reported it within 48 hours isn't
// specified in your question (LOW confidence on eligibility without
// that detail)."`,
        code: `const systemPrompt = \`Answer using ONLY the sources below.
- CITATIONS: cite source number, like [1]
- CONFIDENCE: mark each claim (HIGH)/(MEDIUM)/(LOW)
- If not in sources, say so explicitly

Sources:
\${sourceBlock}\`;`,
        output:
          "The answer cites source [2] specifically for the damage-return policy claim, marks it HIGH confidence since the source directly supports it, and separately flags LOW confidence on the actual eligibility determination since a required detail (the 48-hour report) wasn't provided — a reviewer can verify the [2] citation against the actual source text rather than trusting an unverifiable assertion.",
        explain:
          "All three techniques are combined but remain distinct: grounding (the sourceBlock) is what the answer is actually conditioned on, citations ([1], [2]) make each claim checkable against that specific source, and confidence markers surface the model's own (imperfect, but useful) sense of how directly each claim is supported — none of them guarantees correctness, but together they make an incorrect answer meaningfully easier to catch than a bare, ungrounded assertion would be.",
        explainHi:
          "Teenon techniques combine ki gayi hain par distinct rehti hain: grounding (sourceBlock) wo hai jispe answer actually conditioned hai, citations ([1], [2]) har claim ko us specific source ke against checkable banate hain, aur confidence markers model ki apni (imperfect, par useful) sense surface karte hain ki har claim kitni directly supported hai — inme se koi bhi correctness guarantee nahi karta, par saath mein wo ek incorrect answer ko meaningfully catch karna aasan banate hain us se jo ek bare, ungrounded assertion hota.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating a model's self-reported confidence as a verified guarantee
async function processHighConfidenceClaims(answer) {
  const claims = parseClaims(answer);
  const highConfidenceClaims = claims.filter((c) => c.confidence === 'HIGH');
  // WRONG — automatically trusting and acting on any claim the model
  // itself labeled "HIGH confidence," with no independent verification
  await autoApplyClaimsToDatabase(highConfidenceClaims);
}`,
        right: `// Treating confidence as a useful heuristic for prioritization, not
// a substitute for verification
async function processHighConfidenceClaims(answer) {
  const claims = parseClaims(answer);
  const highConfidenceClaims = claims.filter((c) => c.confidence === 'HIGH');
  // Confidence helps PRIORITIZE what to check first, but every claim
  // with a real consequence still goes through independent validation
  // (Lesson 2) before being acted on
  const verifiedClaims = await independentlyVerify(highConfidenceClaims);
  await applyClaimsToDatabase(verifiedClaims);
}`,
        why: "A model's stated confidence is itself generated text, produced by the same mechanism (Module 1) as everything else it says — there's no guarantee it genuinely correlates with accuracy. Treating it as a verified guarantee rather than a useful-but-imperfect heuristic repeats the category error of confusing confident-sounding output with actually-verified output.",
        whyHi:
          "Ek model ka stated confidence khud generated text hai, wahi mechanism (Module 1) dwara produce kiya gaya jo ye baaki sab kuch kehta hai — koi guarantee nahi hai ki ye genuinely accuracy se correlate karta hai. Ise ek verified guarantee ki tarah treat karna ek useful-but-imperfect heuristic ke bajaye confident-sounding output ko actually-verified output se confuse karne ka category error repeat karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production legal-research AI tool requires every factual claim about case law to cite a specific, checkable case reference, and explicitly refuses to answer when its retrieved sources don't cover the question — specifically because a legal professional needs to independently verify claims before relying on them, and an ungrounded, uncited assertion offers no way to do that verification at all.",
        hi: 'Ek production legal-research AI tool case law ke baare mein har factual claim ko ek specific, checkable case reference cite karne ki maang karta hai, aur explicitly answer karne se mana karta hai jab uske retrieved sources question cover nahi karte — specifically kyunki ek legal professional ko unpe rely karne se pehle claims independently verify karne ki zaroorat hai, aur ek ungrounded, uncited assertion us verification ko karne ka koi tareeka bilkul nahi deta.',
      },
    ],

    interviewQA: [
      {
        q: "Why is grounding (RAG) considered the highest-leverage hallucination mitigation technique?",
        qHi: 'Grounding (RAG) ko highest-leverage hallucination mitigation technique kyun mana jaata hai?',
        a: "It's the technique most directly aligned with Module 1's core insight: hallucination can only be mitigated by changing what a model's generation is actually conditioned on, since the generation mechanism itself cannot be made truth-aware. Grounding does exactly this — the model answers from real, retrieved, verifiable source material present in its context, rather than an implicit, unverifiable training-time association.",
        aHi: 'Ye wo technique hai jo Module 1 ke core insight se sabse directly aligned hai: hallucination ko sirf ye badalke mitigate kiya ja sakta hai ki ek model ka generation actually kispe conditioned hai, kyunki generation mechanism khud ko truth-aware nahi banaya ja sakta. Grounding exactly yahi karta hai — model real, retrieved, verifiable source material se answer karta hai jo uske context mein present hai, ek implicit, unverifiable training-time association ke bajaye.',
      },
      {
        q: "Why should a model's self-reported confidence level not be treated as a verified guarantee of accuracy?",
        qHi: 'Ek model ke self-reported confidence level ko accuracy ka ek verified guarantee kyun treat nahi karna chahiye?',
        a: "A stated confidence level is itself just more generated text, produced by the exact same next-token prediction mechanism (Module 1) as any other output — there's no special mechanism verifying that the stated confidence genuinely tracks the claim's actual truth. It's a useful heuristic in practice, but treating it as a hard guarantee repeats the mistake of confusing confident-sounding output with actually-verified output.",
        aHi: 'Ek stated confidence level khud sirf aur zyada generated text hai, wahi exact next-token prediction mechanism (Module 1) dwara produce kiya gaya jo kisi bhi doosre output ki tarah hai — koi special mechanism nahi hai ye verify karte hue ki stated confidence genuinely claim ki actual truth ko track karta hai. Ye practically ek useful heuristic hai, par ise ek hard guarantee ki tarah treat karna confident-sounding output ko actually-verified output se confuse karne ki mistake repeat karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team builds a medical-information chatbot that asks the model to self-report confidence and automatically shows only 'HIGH confidence' answers to users, with no other verification. Using this lesson's reasoning, explain the risk in this design and how to address it.",
        taskHi: 'Ek team ek medical-information chatbot banati hai jo model se apna confidence self-report karne ko poochta hai aur users ko automatically sirf \'HIGH confidence\' answers dikhata hai, koi doosri verification ke bina. Is lesson ki reasoning use karke, is design mein risk explain karo aur ise kaise address karein.',
        hint: "Revisit this lesson's caveat about what a stated confidence level actually is, mechanistically, and what it does and doesn't guarantee.",
        hintHi: 'Is lesson ke caveat ko revisit karo ki ek stated confidence level actually kya hai, mechanistically, aur ye kya guarantee karta hai aur kya nahi.',
      },
    ],

    keyTakeaways: [
      "Grounding (Module 7's RAG) is the highest-leverage hallucination mitigation because it changes what a model's generation is conditioned on — the only kind of intervention Module 1 established as capable of genuinely working.",
      "Requiring citations converts an unfalsifiable bare assertion into a falsifiable, checkable one — a fabricated claim must now also fabricate a checkable source, making incorrectness meaningfully easier to catch.",
      "Confidence signals are a useful heuristic, not a verified guarantee — a model's stated confidence is itself generated text, produced by the same mechanism as any other output, with no special truth-tracking component.",
      "None of these techniques, individually or combined, eliminates hallucination's structural risk (Module 1) — this is why Lesson 2's validation and Lesson 3's resilience patterns exist as necessary additional layers, not redundant ones.",
    ],
    keyTakeawaysHi: [
      'Grounding (Module 7 ka RAG) highest-leverage hallucination mitigation hai kyunki ye badalta hai ki ek model ka generation kispe conditioned hai — Module 1 ne establish ki us ekmatra kism ki intervention jo genuinely kaam kar sakti hai.',
      'Citations chahna ek unfalsifiable bare assertion ko ek falsifiable, checkable wale mein convert karta hai — ek fabricated claim ko ab ek checkable source bhi fabricate karna padta hai, incorrectness ko meaningfully catch karna aasan banate hue.',
      'Confidence signals ek useful heuristic hain, ek verified guarantee nahi — ek model ka stated confidence khud generated text hai, wahi mechanism dwara produce kiya gaya jo kisi bhi doosre output ki tarah hai, koi special truth-tracking component ke bina.',
      'In techniques mein se koi bhi, individually ya combined, hallucination ke structural risk (Module 1) ko eliminate nahi karta — yahi wajah hai Lesson 2 ka validation aur Lesson 3 ke resilience patterns zaroori additional layers ki tarah exist karte hain, redundant wale nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-output-validation-and-retry-fallback-chains',
    title: 'Output Validation & Retry/Fallback Chains Across Providers',
    titleHi: 'Output Validation Aur Providers Ke Across Retry/Fallback Chains',
    description:
      "Module 6 covered retrying an individual malformed response. This lesson extends that discipline to full production resilience: mandatory output validation for every response, and retry/fallback chains that can switch providers entirely when one is unavailable or unreliable.",
    descriptionHi:
      'Module 6 ne ek individual malformed response ko retry karna cover kiya. Ye lesson us discipline ko poori production resilience tak extend karta hai: har response ke liye mandatory output validation, aur retry/fallback chains jo ek provider unavailable ya unreliable hone pe poori tarah providers switch kar sakte hain.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A hospital's backup generator system that automatically switches to battery power, then a secondary generator, then a completely different power grid connection, rather than simply hoping the primary power never fails.** A hospital cannot simply assume its primary power source will always work — critical equipment needs power regardless of what happens to any single source, so a well-designed system has a genuine chain of fallbacks: battery power bridges the first few seconds, a backup generator takes over for anything longer, and in a true emergency, a completely separate grid connection provides power independent of the primary source's failure entirely. Each fallback tier activates automatically when the tier above it fails, and the system never simply stops functioning because one specific power source had a problem. An AI feature's reliability needs this same tiered structure: output validation is checking every single response works correctly before using it (never assuming success), a retry is the battery bridging a momentary failure, and a fallback to a genuinely different model or provider is the separate grid connection — available specifically because a single provider's outage or an persistent malformed response shouldn't take down a feature that has a real alternative available.",
      hi: 'Ek hospital ka backup generator system jo automatically battery power pe switch hota hai, phir ek secondary generator, phir ek poori tarah alag power grid connection, simply ye hope karne ke bajaye ki primary power kabhi fail nahi hoga. Ek hospital simply assume nahi kar sakta ki uska primary power source hamesha kaam karega — critical equipment ko power chahiye chahe kisi bhi single source ka kuch bhi ho, isliye ek well-designed system ke paas fallbacks ki ek genuine chain hai: battery power pehle kuch seconds ko bridge karta hai, ek backup generator kisi bhi lambi cheez ke liye takeover karta hai, aur ek true emergency mein, ek poori tarah separate grid connection primary source ki failure se poori tarah independent power provide karta hai. Har fallback tier automatically activate hota hai jab uske upar wala tier fail hota hai, aur system kabhi simply function karna band nahi karta kyunki ek specific power source mein problem thi. Ek AI feature ki reliability ko yahi tiered structure chahiye: output validation har single response ko use karne se pehle check karna hai ki ye correctly kaam karta hai (kabhi success assume nahi karna), ek retry battery hai jo ek momentary failure ko bridge karta hai, aur ek genuinely alag model ya provider tak ek fallback separate grid connection hai — specifically available kyunki ek single provider ka outage ya ek persistent malformed response ek feature ko down nahi le jaana chahiye jiske paas ek real alternative available hai.',
    },

    simple: `**Mandatory output validation — never assuming success, extending
Module 6's structured-output discipline to every response:**

\`\`\`ts
import { z } from 'zod';

const responseSchema = z.object({
  answer: z.string().min(1),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

async function getValidatedAnswer(question) {
  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-5'),
    schema: responseSchema,
    prompt: question,
  });
  // generateObject's schema constraint (Module 6) is ONE layer of
  // validation — a production system adds business-rule checks on
  // top, e.g.:
  if (object.answer.length > 5000) {
    throw new Error('Response suspiciously long — possible runaway generation');
  }
  return object;
}
\`\`\`

**A retry/fallback chain — genuinely different tiers, not just
repeating the same call:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAnswerWithFallbackChain(question) {
  // TIER 1 — the primary provider, retried a bounded number of times
  // (Module 6, Lesson 3's retry discipline)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      });
      return { answer: response.content[0].text, provider: 'anthropic' };
    } catch (err) {
      if (attempt === 2) break; // exhausted primary provider's retries
    }
  }

  // TIER 2 — an entirely DIFFERENT provider, not just another retry of
  // the same one — genuinely useful when the FIRST provider itself is
  // down, not just when a single call happened to fail
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', max_tokens: 500,
      messages: [{ role: 'user', content: question }],
    });
    return { answer: response.choices[0].message.content, provider: 'openai' };
  } catch (err) {
    // TIER 3 — a clear, honest failure — never silently return
    // something wrong or pretend the request succeeded
    throw new Error('All providers unavailable — please try again shortly');
  }
}
\`\`\`

**Why a fallback to a DIFFERENT provider is a genuinely different tier
than retrying the SAME provider:** if Anthropic's API itself is
experiencing an outage, retrying the exact same API repeatedly will
fail every single time — no number of retries against a genuinely down
service helps. A fallback to an entirely different provider (OpenAI, or
a different model family) is resilient against exactly this failure
mode, since the two providers' infrastructure genuinely doesn't share
the same failure surface — this is a different, complementary kind of
protection than simply retrying, the same "genuinely different tier"
principle the analogy's battery-vs-second-grid-connection illustrates.

**Content moderation — a specific validation category worth naming
separately:**

\`\`\`ts
async function checkModeration(text) {
  const moderation = await openai.moderations.create({ input: text });
  if (moderation.results[0].flagged) {
    throw new Error('Content flagged by moderation — response withheld');
  }
}

async function getSafeAnswer(question) {
  const answer = await getAnswerWithFallbackChain(question);
  await checkModeration(answer.answer); // a specific check for a specific risk category
  return answer;
}
\`\`\`

**Why content moderation is validation, applied to a specific risk
category:** a moderation check is structurally identical to the schema
and business-rule validation covered above — it's a check performed on
a response BEFORE it's used or shown to anyone, specifically targeting
harmful or policy-violating content rather than structural correctness.
Grouping it under "validation" (rather than treating it as an unrelated
concern) makes clear it belongs in the same mandatory, never-skipped
pipeline stage as every other check this lesson establishes.`,

    simpleHi: `**Mandatory output validation — kabhi success assume na karna,
Module 6 ke structured-output discipline ko har response tak extend
karna:**

\`\`\`ts
import { z } from 'zod';

const responseSchema = z.object({
  answer: z.string().min(1),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

async function getValidatedAnswer(question) {
  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-5'),
    schema: responseSchema,
    prompt: question,
  });
  // generateObject ka schema constraint (Module 6) validation ka EK
  // layer hai — ek production system uske upar business-rule checks
  // add karta hai, jaise:
  if (object.answer.length > 5000) {
    throw new Error('Response suspiciously long — possible runaway generation');
  }
  return object;
}
\`\`\`

**Ek retry/fallback chain — genuinely alag tiers, sirf wahi call
repeat karna nahi:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAnswerWithFallbackChain(question) {
  // TIER 1 — primary provider, ek bounded number of times retried
  // (Module 6, Lesson 3 ki retry discipline)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      });
      return { answer: response.content[0].text, provider: 'anthropic' };
    } catch (err) {
      if (attempt === 2) break; // primary provider ke retries exhausted
    }
  }

  // TIER 2 — ek poori tarah ALAG provider, sirf wahi ek ka doosra retry
  // nahi — genuinely useful jab PEHLA provider khud down ho, sirf ek
  // single call fail hone pe nahi
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', max_tokens: 500,
      messages: [{ role: 'user', content: question }],
    });
    return { answer: response.choices[0].message.content, provider: 'openai' };
  } catch (err) {
    // TIER 3 — ek clear, honest failure — kabhi silently kuch galat
    // return mat karo ya request succeed hone ka pretend mat karo
    throw new Error('All providers unavailable — please try again shortly');
  }
}
\`\`\`

**Ek ALAG provider pe ek fallback wahi provider ko retry karne se
genuinely ek alag tier kyun hai:** agar Anthropic ka API khud ek outage
experience kar raha hai, wahi exact API ko repeatedly retry karna har
single baar fail hoga — genuinely down service ke against kitni bhi
retries help nahi karti. Ek poori tarah alag provider (OpenAI, ya ek
alag model family) tak ek fallback exactly is failure mode ke against
resilient hai, kyunki do providers ki infrastructure genuinely wahi
failure surface share nahi karti — ye simply retry karne se ek alag,
complementary kism ka protection hai, wahi "genuinely alag tier"
principle jise analogy ka battery-vs-second-grid-connection illustrate
karta hai.

**Content moderation — ek specific validation category jo separately
naam dene layak hai:**

\`\`\`ts
async function checkModeration(text) {
  const moderation = await openai.moderations.create({ input: text });
  if (moderation.results[0].flagged) {
    throw new Error('Content flagged by moderation — response withheld');
  }
}

async function getSafeAnswer(question) {
  const answer = await getAnswerWithFallbackChain(question);
  await checkModeration(answer.answer); // ek specific risk category ke liye ek specific check
  return answer;
}
\`\`\`

**Content moderation validation kyun hai, ek specific risk category pe
applied:** ek moderation check structurally upar cover kiye gaye schema
aur business-rule validation se identical hai — ye ek check hai jo ek
response pe use hone ya kisi ko dikhane se PEHLE perform kiya jata hai,
specifically structural correctness ke bajaye harmful ya policy-
violating content pe target karte hue. Ise "validation" ke under group
karna (ise ek unrelated concern ki tarah treat karne ke bajaye) clear
karta hai ki ye wahi mandatory, never-skipped pipeline stage mein belong
karta hai jo har doosra check jise ye lesson establish karta hai.`,

    content: `## Why mandatory output validation extends, rather than replaces,
Module 6's retry discipline

Module 6, Lesson 3 established a three-tier retry strategy for a
structured response that fails schema validation. This lesson broadens
the scope: validation isn't only about catching malformed JSON — it's
a general discipline applied to every response, checking business rules
(a suspiciously long or short response, a value outside a sensible
range) and specific risk categories (content moderation) that a schema
alone can't capture. The underlying principle is identical to Module
6's — never assume a response is correct just because it was
successfully generated — applied more broadly than structural
correctness alone.

## Why a fallback to a different provider addresses a genuinely
different failure mode than retrying the same one

Retrying the same provider (Module 6's approach) works well for
transient, momentary failures — a brief network hiccup, a temporary
rate limit. It does nothing for a sustained outage of that specific
provider's infrastructure, where every retry against the same down
service fails identically. A fallback to a genuinely different provider
(different infrastructure, different failure modes) provides real
resilience against exactly this scenario, since the two providers don't
share the same underlying causes of failure. This is why a production
fallback chain includes both tiers — bounded retries within one
provider for transient issues, and a switch to a different provider
entirely for sustained ones — rather than treating "retry more" as a
sufficient strategy on its own.

## Why content moderation belongs conceptually under validation,
not as a separate concern

A moderation check and a schema validation check share the identical
structural role: both are checks performed on a response before it's
used or shown to anyone, and both can cause the pipeline to reject that
response rather than proceeding. Treating content moderation as a
distinct, easily-forgotten add-on rather than a mandatory stage in the
same validation pipeline as everything else risks it being skipped in
exactly the cases where it matters most — grouping it explicitly under
"validation" makes clear it belongs in the same never-optional pipeline
stage.

## How this lesson's resilience patterns connect to Lesson 3's
circuit breakers

This lesson's retry/fallback chain handles a single request's
resilience — what happens when THIS call fails. Lesson 3 extends this to
a system-wide concern: what happens when a provider is failing so
frequently that continuing to retry against it, request after request,
becomes counterproductive — wasting time and resources on calls likely
to fail anyway rather than failing fast and giving the fallback tier a
chance to handle the load. The retry/fallback chain this lesson
establishes is the mechanism circuit breakers wrap around, adding a
system-level awareness of a provider's recent reliability that a single
request's retry logic can't see on its own.`,

    contentHi: `## Mandatory output validation Module 6 ke retry discipline ko kyun extend karta hai, replace nahi

Module 6, Lesson 3 ne ek structured response ke liye ek three-tier retry
strategy establish ki jo schema validation fail karta hai. Ye lesson
scope ko broaden karta hai: validation sirf malformed JSON catch karne
ke baare mein nahi hai — ye ek general discipline hai jo har response
pe applied hoti hai, business rules check karte hue (ek suspiciously
long ya short response, ek value jo ek sensible range se bahar hai) aur
specific risk categories (content moderation) jinhe akela ek schema
capture nahi kar sakta. Underlying principle Module 6 ke identical hai
— kabhi ye assume mat karo ki ek response correct hai sirf isliye
kyunki ye successfully generate hua — sirf structural correctness se
zyada broadly applied.

## Ek alag provider tak ek fallback wahi ek ko retry karne se genuinely alag failure mode kyun address karta hai

Wahi provider ko retry karna (Module 6 ka approach) transient, momentary
failures ke liye achhi tarah kaam karta hai — ek brief network hiccup,
ek temporary rate limit. Ye us specific provider ki infrastructure ke
ek sustained outage ke liye kuch nahi karta, jahan wahi down service ke
against har retry identically fail hota hai. Ek genuinely alag provider
(alag infrastructure, alag failure modes) tak ek fallback exactly is
scenario ke against real resilience provide karta hai, kyunki do
providers failure ke wahi underlying causes share nahi karte. Yahi
wajah hai ek production fallback chain dono tiers include karti hai —
transient issues ke liye ek provider ke andar bounded retries, aur
sustained wale ke liye poori tarah ek alag provider pe switch — "zyada
retry karo" ko apne aap mein ek sufficient strategy treat karne ke
bajaye.

## Content moderation conceptually validation ke under kyun belong karta hai, ek separate concern ki tarah nahi

Ek moderation check aur ek schema validation check identical structural
role share karte hain: dono checks hain jo ek response pe perform kiye
jaate hain use hone ya kisi ko dikhane se pehle, aur dono pipeline ko us
response ko reject karne ka cause bana sakte hain proceed karne ke
bajaye. Content moderation ko ek distinct, easily-forgotten add-on ki
tarah treat karna wahi validation pipeline mein ek mandatory stage ke
bajaye exactly un cases mein skip hone ka risk rakhta hai jahan ye sabse
zyada matter karta hai — ise explicitly "validation" ke under group
karna clear karta hai ki ye wahi never-optional pipeline stage mein
belong karta hai.

## Is lesson ke resilience patterns Lesson 3 ke circuit breakers se kaise connect karte hain

Is lesson ka retry/fallback chain ek single request ki resilience
handle karta hai — jab YE call fail hoti hai to kya hota hai. Lesson 3
ise ek system-wide concern tak extend karta hai: kya hota hai jab ek
provider itni frequently fail ho raha hai ki uske against continue
retry karna, request after request, counterproductive ban jaata hai —
un calls pe time aur resources waste karte hue jo anyway fail hone ki
likelihood rakhti hain fast fail karne aur fallback tier ko load handle
karne ka chance dene ke bajaye. Is lesson ka establish kiya retry/
fallback chain wo mechanism hai jiske around circuit breakers wrap
karte hain, ek system-level awareness add karte hue ek provider ki
recent reliability ki jise ek single request ka retry logic apne aap
nahi dekh sakta.`,

    examples: [
      {
        title: 'A complete pipeline with schema validation, business-rule checks, content moderation, and a two-tier provider fallback',
        titleHi: 'Ek complete pipeline schema validation, business-rule checks, content moderation, aur ek two-tier provider fallback ke saath',
        codeJs: `import { z } from 'zod';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai as aiSdkOpenai } from '@ai-sdk/openai';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseSchema = z.object({
  answer: z.string().min(1).max(3000), // business rule: reasonable length bounds
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

async function checkModeration(text) {
  const result = await openaiClient.moderations.create({ input: text });
  if (result.results[0].flagged) {
    throw new Error('Response flagged by content moderation');
  }
}

async function getReliableAnswer(question) {
  let lastError;

  // TIER 1 — primary provider, bounded retries (Module 6, Lesson 3)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: responseSchema, // structural validation
        prompt: question,
      });
      await checkModeration(object.answer); // content validation
      return { ...object, provider: 'anthropic' };
    } catch (err) {
      lastError = err;
    }
  }

  // TIER 2 — a genuinely different provider, not another retry of the same one
  try {
    const { object } = await generateObject({
      model: aiSdkOpenai('gpt-4o'),
      schema: responseSchema,
      prompt: question,
    });
    await checkModeration(object.answer);
    return { ...object, provider: 'openai' };
  } catch (err) {
    // TIER 3 — an honest, clear failure
    throw new Error(\`All providers failed: \${lastError?.message}, \${err.message}\`);
  }
}`,
        codeTs: `import { z } from 'zod';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai as aiSdkOpenai } from '@ai-sdk/openai';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseSchema = z.object({
  answer: z.string().min(1).max(3000), // business rule: reasonable length bounds
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

type Response = z.infer<typeof responseSchema> & { provider: string };

async function checkModeration(text: string): Promise<void> {
  const result = await openaiClient.moderations.create({ input: text });
  if (result.results[0].flagged) {
    throw new Error('Response flagged by content moderation');
  }
}

async function getReliableAnswer(question: string): Promise<Response> {
  let lastError: Error | undefined;

  // TIER 1 — primary provider, bounded retries (Module 6, Lesson 3)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: anthropic('claude-sonnet-4-5'),
        schema: responseSchema, // structural validation
        prompt: question,
      });
      await checkModeration(object.answer); // content validation
      return { ...object, provider: 'anthropic' };
    } catch (err) {
      lastError = err as Error;
    }
  }

  // TIER 2 — a genuinely different provider, not another retry of the same one
  try {
    const { object } = await generateObject({
      model: aiSdkOpenai('gpt-4o'),
      schema: responseSchema,
      prompt: question,
    });
    await checkModeration(object.answer);
    return { ...object, provider: 'openai' };
  } catch (err) {
    // TIER 3 — an honest, clear failure
    throw new Error(\`All providers failed: \${lastError?.message}, \${(err as Error).message}\`);
  }
}`,
        code: `for (let attempt = 1; attempt <= 2; attempt++) {
  try {
    const { object } = await generateObject({ model: anthropic('claude-sonnet-4-5'), schema: responseSchema, prompt: question });
    await checkModeration(object.answer);
    return { ...object, provider: 'anthropic' };
  } catch (err) { lastError = err; }
}
// TIER 2: try openai; TIER 3: throw a clear error`,
        output:
          "During normal operation, tier 1 succeeds after schema and moderation checks. During a sustained Anthropic outage, both tier-1 attempts fail, and tier 2's OpenAI call succeeds instead — the feature keeps working despite one provider being entirely down, something a same-provider-only retry strategy could never achieve.",
        explain:
          "Every check this lesson covers appears explicitly and in order: schema validation (responseSchema), a business rule (the .max(3000) length bound), content moderation (checkModeration), bounded same-provider retries (the for loop), and a genuinely different provider fallback (the openai call) — nothing here is implicit or assumed to work.",
        explainHi:
          "Is lesson ka har check explicitly aur order mein appear karta hai: schema validation (responseSchema), ek business rule (.max(3000) length bound), content moderation (checkModeration), bounded same-provider retries (for loop), aur ek genuinely alag provider fallback (openai call) — yahan kuch bhi implicit ya kaam karne wala assumed nahi hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Only retrying the SAME provider, with no fallback to a different one
async function getAnswer(question) {
  for (let attempt = 1; attempt <= 5; attempt++) { // more retries, same provider
    try {
      return await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      });
    } catch {}
  }
  throw new Error('Failed after 5 attempts');
  // If Anthropic's API itself is experiencing a sustained outage, all
  // 5 retries fail identically — more retries against a genuinely
  // down service provide zero additional resilience
}`,
        right: `// Bounded retries within one provider, THEN a fallback to a different one
async function getAnswer(question) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      });
    } catch {}
  }
  // A genuinely different provider — resilient against Anthropic's
  // own infrastructure being down, not just a single call failing
  return await openai.chat.completions.create({
    model: 'gpt-4o', max_tokens: 500,
    messages: [{ role: 'user', content: question }],
  });
}`,
        why: "Retrying the same provider addresses transient, momentary failures but provides zero protection against a sustained outage of that specific provider's infrastructure, since every retry fails for the same underlying reason. A fallback to a genuinely different provider is resilient against exactly this failure mode, since the two providers don't share the same infrastructure or failure causes.",
        whyHi:
          "Wahi provider ko retry karna transient, momentary failures ko address karta hai par us specific provider ki infrastructure ke ek sustained outage ke against zero protection provide karta hai, kyunki har retry wahi underlying reason ke liye fail hota hai. Ek genuinely alag provider tak ek fallback exactly is failure mode ke against resilient hai, kyunki do providers wahi infrastructure ya failure causes share nahi karte.",
      },
    ],

    realWorld: [
      {
        en: "A production AI writing assistant maintains a fallback chain across two different model providers specifically because a past incident — a several-hour outage at their primary provider that took the entire feature offline — taught them that retrying the same provider more aggressively would never have helped, since the provider's own infrastructure was down, not any individual request.",
        hi: 'Ek production AI writing assistant do alag model providers ke across ek fallback chain maintain karta hai specifically kyunki ek past incident — unke primary provider pe ek several-hour outage jisne poore feature ko offline kar diya — ne unhe sikhaya ki wahi provider ko zyada aggressively retry karna kabhi help nahi karta, kyunki provider ki apni infrastructure down thi, koi individual request nahi.',
      },
    ],

    interviewQA: [
      {
        q: "Why does a fallback to a different AI provider provide resilience that simply retrying the same provider more times cannot?",
        qHi: 'Ek alag AI provider tak ek fallback resilience kyun provide karta hai jo simply wahi provider ko zyada baar retry karna nahi kar sakta?',
        a: "Retrying the same provider only helps with transient, momentary failures. If that provider's own infrastructure is experiencing a sustained outage, every retry against it fails identically, since the underlying cause hasn't changed. A different provider has genuinely separate infrastructure and failure modes, so it remains available even when the first provider is entirely down.",
        aHi: 'Wahi provider ko retry karna sirf transient, momentary failures mein help karta hai. Agar us provider ki apni infrastructure ek sustained outage experience kar rahi hai, uske against har retry identically fail hota hai, kyunki underlying cause nahi badla. Ek alag provider ke paas genuinely separate infrastructure aur failure modes hain, isliye ye available rehta hai jab pehla provider poori tarah down ho.',
      },
      {
        q: 'Why should content moderation be thought of as part of the same validation pipeline as schema checks, rather than a separate concern?',
        qHi: 'Content moderation ko schema checks jaise hi validation pipeline ka hissa kyun socha jaana chahiye, ek separate concern ke bajaye?',
        a: "Both are checks performed on a response before it's used or shown to anyone, and both can cause the response to be rejected — they share the identical structural role in the pipeline. Treating moderation as a distinct add-on rather than a mandatory pipeline stage risks it being skipped, especially under the exact conditions where it matters most.",
        aHi: 'Dono checks hain jo ek response pe perform kiye jaate hain use hone ya kisi ko dikhane se pehle, aur dono response ko reject karne ka cause ban sakte hain — wo pipeline mein identical structural role share karte hain. Moderation ko ek mandatory pipeline stage ke bajaye ek distinct add-on ki tarah treat karna iske skip hone ka risk rakhta hai, especially exactly un conditions ke under jahan ye sabse zyada matter karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team's AI feature has a retry loop that attempts the same provider 5 times before giving up, with no fallback to a different provider. During a 45-minute outage at that provider, their feature was completely unavailable the entire time. Using this lesson's reasoning, redesign their resilience strategy.",
        taskHi: 'Ek team ke AI feature ka ek retry loop hai jo wahi provider ko 5 baar attempt karta hai give up karne se pehle, kisi alag provider ke fallback ke bina. Us provider pe ek 45-minute outage ke dauran, unka feature poore time completely unavailable tha. Is lesson ki reasoning use karke, unki resilience strategy redesign karo.',
        hint: "Distinguish between what bounded same-provider retries actually protect against and what only a genuinely different provider fallback can protect against.",
        hintHi: 'Distinguish karo ki bounded same-provider retries actually kya protect karte hain aur sirf ek genuinely alag provider fallback kya protect kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "Output validation extends Module 6's schema-validation discipline to every response — checking business rules and specific risk categories (content moderation) that structural schema validation alone can't capture.",
      "A fallback to a genuinely different provider protects against a sustained outage of one provider's infrastructure, a failure mode that retrying the same provider repeatedly cannot address at all.",
      "Content moderation belongs conceptually under validation, not as a separate concern — it shares the identical structural role of checking a response before it's used, and treating it as an add-on risks it being skipped.",
      "This lesson's retry/fallback chain handles a single request's resilience; Lesson 3's circuit breakers extend this to a system-wide awareness of a provider's recent reliability across many requests.",
    ],
    keyTakeawaysHi: [
      'Output validation Module 6 ke schema-validation discipline ko har response tak extend karta hai — business rules aur specific risk categories (content moderation) check karte hue jinhe akela structural schema validation capture nahi kar sakta.',
      'Ek genuinely alag provider tak ek fallback ek provider ki infrastructure ke ek sustained outage ke against protect karta hai, ek failure mode jise wahi provider ko repeatedly retry karna bilkul address nahi kar sakta.',
      'Content moderation conceptually validation ke under belong karta hai, ek separate concern ki tarah nahi — ye ek response ko use hone se pehle check karne ka identical structural role share karta hai, aur ise ek add-on ki tarah treat karna iske skip hone ka risk rakhta hai.',
      'Is lesson ka retry/fallback chain ek single request ki resilience handle karta hai; Lesson 3 ke circuit breakers ise kai requests ke across ek provider ki recent reliability ki ek system-wide awareness tak extend karte hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-circuit-breakers-for-ai-calls',
    title: 'Circuit Breakers for AI Calls',
    titleHi: 'AI Calls Ke Liye Circuit Breakers',
    description:
      "Closing this module: extending the general circuit-breaker resilience pattern to AI calls specifically — recognizing when a provider is failing frequently enough that continuing to retry against it wastes real cost and time, and failing fast instead.",
    descriptionHi:
      'Is module ko close karte hue: general circuit-breaker resilience pattern ko specifically AI calls tak extend karna — ye recognize karna ki ek provider kab itni frequently fail kar raha hai ki uske against retry karte rehna real cost aur time waste karta hai, aur iske bajaye fast fail karna.',
    difficulty: 'HARD',
    duration: 18,
    order: 3,

    analogy: {
      en: "**An electrical circuit breaker in a house that trips and cuts power to a faulty circuit, rather than letting the wiring keep drawing current until it overheats and causes real damage.** A house without a circuit breaker would let a short circuit keep drawing more and more current, generating more and more heat, until something actually catches fire — the wiring has no way to recognize \"this is clearly not working, stop trying\" on its own. A circuit breaker's entire function is exactly this: detecting that a circuit is behaving abnormally (drawing far more current than normal) and cutting it off immediately, protecting the rest of the house's electrical system from a problem that's clearly not going to resolve itself by continuing to feed it power. An AI circuit breaker does the identical job for a failing provider: after enough recent calls have failed, it \"trips\" and stops sending new requests to that provider entirely for a cooldown period, going straight to a fallback (Lesson 2) instead of wasting time and money on calls that are very likely to fail anyway — exactly like a breaker cutting power to a faulty circuit rather than letting the house keep feeding it electricity that's clearly causing harm.",
      hi: 'Ek house mein ek electrical circuit breaker jo trip hota hai aur ek faulty circuit ko power cut kar deta hai, wiring ko current khinchte rehne dene ke bajaye jab tak ye overheat na ho jaaye aur real damage cause na kare. Ek house bina circuit breaker ke ek short circuit ko zyada se zyada current khinchte rehne dega, zyada se zyada heat generate karte hue, jab tak kuch actually aag na pakad le — wiring ke paas apne aap "ye clearly kaam nahi kar raha, try karna band karo" recognize karne ka koi tareeka nahi hai. Ek circuit breaker ka poora function exactly yahi hai: ye detect karna ki ek circuit abnormally behave kar raha hai (normal se kaafi zyada current kheenchte hue) aur ise immediately cut karna, house ke baaki electrical system ko ek aisi problem se protect karte hue jo clearly khud ko resolve nahi karegi use power feed karte rehne se. Ek AI circuit breaker ek failing provider ke liye identical kaam karta hai: kaafi recent calls fail hone ke baad, ye "trip" hota hai aur us provider ko naye requests bhejna poori tarah band kar deta hai ek cooldown period ke liye, iske bajaye directly ek fallback (Lesson 2) pe jaate hue calls pe time aur paisa waste karne ke bajaye jo anyway fail hone ki bahut likelihood rakhte hain — exactly ek breaker ki tarah jo ek faulty circuit ko power cut karta hai house ko use electricity feed karte rehne dene ke bajaye jo clearly harm cause kar rahi hai.',
    },

    simple: `**Why bounded retries alone (Lesson 2) aren't enough at the system
level:** Lesson 2's retry/fallback chain handles ONE request's
resilience correctly — but if a provider is genuinely down, EVERY
incoming request independently discovers this the slow, expensive way
(waiting for a timeout, retrying, then falling back), repeating the
exact same wasted time and cost for every single request rather than
the system learning "this provider is currently down" and acting on
that knowledge immediately for subsequent requests.

**A circuit breaker — tracking a provider's recent reliability across
MANY requests, not just reacting within one:**

\`\`\`ts
class CircuitBreaker {
  constructor(failureThreshold = 5, cooldownMs = 30000) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED = normal, OPEN = tripped, HALF_OPEN = testing recovery
    this.openedAt = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt > this.cooldownMs) {
        this.state = 'HALF_OPEN'; // cooldown elapsed — cautiously try again
      } else {
        throw new Error('Circuit breaker OPEN — failing fast without calling the provider');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') this.reset(); // recovery confirmed
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'; // TRIPPED — stop calling this provider entirely
      this.openedAt = Date.now();
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}
\`\`\`

**Using it — wrapping a provider call so the system learns from
recent failures across ALL requests, not just one:**

\`\`\`ts
const anthropicBreaker = new CircuitBreaker(5, 30000);

async function getAnswerWithCircuitBreaker(question) {
  try {
    return await anthropicBreaker.call(() =>
      anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      })
    );
  } catch (err) {
    // The breaker is OPEN (provider recently failing a lot) OR this
    // specific call failed — either way, go straight to the fallback
    // (Lesson 2) rather than wasting more time on the primary
    return await openai.chat.completions.create({
      model: 'gpt-4o', max_tokens: 500,
      messages: [{ role: 'user', content: question }],
    });
  }
}
\`\`\`

**Why the three states (CLOSED, OPEN, HALF_OPEN) matter — this isn't
just an on/off switch:**

\`\`\`
CLOSED — normal operation, calls go through, failures are counted

OPEN — the threshold was crossed; new calls fail FAST without even
  attempting the provider, immediately going to a fallback — this
  saves real time and money on calls very likely to fail anyway
  (Module 2's cost math: a doomed call still costs tokens if it gets
  far enough to fail partway through, and definitely costs latency)

HALF_OPEN — after a cooldown period, ONE cautious attempt is allowed
  through to test whether the provider has recovered, without yet
  fully trusting it — succeeding resets to CLOSED, failing goes back
  to OPEN for another cooldown
\`\`\`

**Why this is genuinely different from, and complements, Lesson 2's
retry/fallback chain:** Lesson 2's chain handles what happens within
ONE request when a call fails. A circuit breaker adds a layer ABOVE
that — a shared, system-wide memory of recent failures across ALL
requests to a given provider, letting the system skip straight to a
fallback for new requests once it's confident the primary is currently
unhealthy, rather than every single new request independently
rediscovering the same outage the slow way. This is the same general
resilience pattern used for any external dependency in software
engineering, applied here specifically to an AI provider's real,
observable failure modes.`,

    simpleHi: `**Akele bounded retries (Lesson 2) system level pe kaafi kyun nahi
hain:** Lesson 2 ka retry/fallback chain EK request ki resilience
correctly handle karta hai — par agar ek provider genuinely down hai,
HAR incoming request independently ise slow, expensive tareeke se
discover karta hai (ek timeout ka wait karna, retry karna, phir
fallback karna), har single request ke liye wahi exact wasted time aur
cost repeat karte hue system ke "ye provider currently down hai"
seekhne aur subsequent requests ke liye immediately us knowledge pe act
karne ke bajaye.

**Ek circuit breaker — MANY requests ke across ek provider ki recent
reliability track karna, sirf ek ke andar react karna nahi:**

\`\`\`ts
class CircuitBreaker {
  constructor(failureThreshold = 5, cooldownMs = 30000) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED = normal, OPEN = tripped, HALF_OPEN = testing recovery
    this.openedAt = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt > this.cooldownMs) {
        this.state = 'HALF_OPEN'; // cooldown elapsed — cautiously phir try karo
      } else {
        throw new Error('Circuit breaker OPEN — failing fast without calling the provider');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') this.reset(); // recovery confirmed
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'; // TRIPPED — is provider ko call karna poori tarah band karo
      this.openedAt = Date.now();
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}
\`\`\`

**Ise use karna — ek provider call ko wrap karna taaki system SAARI
requests ke across recent failures se seekhe, sirf ek se nahi:**

\`\`\`ts
const anthropicBreaker = new CircuitBreaker(5, 30000);

async function getAnswerWithCircuitBreaker(question) {
  try {
    return await anthropicBreaker.call(() =>
      anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      })
    );
  } catch (err) {
    // Breaker OPEN hai (provider recently kaafi fail kar raha hai) YA
    // ye specific call fail hui — dono cases mein, directly fallback
    // (Lesson 2) pe jaao primary pe zyada time waste karne ke bajaye
    return await openai.chat.completions.create({
      model: 'gpt-4o', max_tokens: 500,
      messages: [{ role: 'user', content: question }],
    });
  }
}
\`\`\`

**Teen states (CLOSED, OPEN, HALF_OPEN) kyun matter karte hain — ye
sirf ek on/off switch nahi hai:**

\`\`\`
CLOSED — normal operation, calls guzarti hain, failures count ki jaati hain

OPEN — threshold cross ho gaya; naye calls FAST fail hote hain provider
  ko try kiye bina bhi, immediately ek fallback pe jaate hue — ye un
  calls pe real time aur paisa bachata hai jo anyway fail hone ki
  bahut likelihood rakhte hain (Module 2 ka cost math: ek doomed call
  abhi bhi tokens cost karta hai agar ye kaafi door tak fail hone ke
  liye pahunchta hai, aur definitely latency cost karta hai)

HALF_OPEN — ek cooldown period ke baad, ek cautious attempt through
  aane diya jata hai ye test karne ke liye ki kya provider recover ho
  gaya hai, abhi tak use poori tarah trust kiye bina — succeed hona
  CLOSED pe reset karta hai, fail hona wapas OPEN pe ek aur cooldown ke
  liye jaata hai
\`\`\`

**Ye Lesson 2 ke retry/fallback chain se genuinely alag kyun hai, aur
use complement kyun karta hai:** Lesson 2 ka chain handle karta hai ki
EK request ke andar kya hota hai jab ek call fail hoti hai. Ek circuit
breaker uske UPAR ek layer add karta hai — ek shared, system-wide memory
recent failures ki ek given provider ko SAARI requests ke across, system
ko naye requests ke liye directly ek fallback pe jaane deta hai ek baar
confident ho jaane pe ki primary currently unhealthy hai, har single
naya request independently wahi outage ko slow tareeke se rediscover
karne ke bajaye. Ye wahi general resilience pattern hai jo software
engineering mein kisi bhi external dependency ke liye use hota hai,
yahan specifically ek AI provider ke real, observable failure modes pe
applied.`,

    content: `## Why a per-request retry/fallback chain (Lesson 2) is
insufficient at the system level

Lesson 2's retry/fallback logic correctly handles a single request's
resilience — it retries, then falls back, and returns an answer. But
this logic has no memory across requests: if a provider has been down
for the last 100 requests, request number 101 still has to independently
discover this by attempting the call, waiting for it to fail (possibly
after a timeout), retrying, and only then falling back — repeating the
exact same wasted latency and cost every single request pays while the
provider remains down, rather than the system recognizing the pattern
and acting on it immediately.

## Why the three-state design (CLOSED, OPEN, HALF_OPEN) is more than
a simple flag

A simple boolean "is this provider down" flag would need some separate
mechanism to decide when to clear itself — checking too aggressively
wastes the exact resources the breaker exists to save, while checking
too rarely leaves a recovered provider marked as down longer than
necessary. The three-state design solves this directly: OPEN stops
sending real requests entirely (saving cost and latency on calls very
likely to fail), and HALF_OPEN provides a controlled, low-risk way to
test recovery — one cautious real call, not a full flood of traffic
resuming immediately — before fully trusting the provider is healthy
again and returning to CLOSED.

## Why this pattern is a general software-engineering resilience
technique, not something invented specifically for AI

Circuit breakers are a well-established pattern for any external
dependency a system relies on — a database connection, a third-party
API, a payment processor — wherever repeatedly calling a failing
dependency wastes resources without providing any benefit over failing
fast and using a fallback. This lesson's contribution is recognizing
that an AI provider is exactly this kind of external dependency, with
the same failure characteristics (transient blips and sustained
outages) as any other, and Module 2's cost math (a doomed call can still
consume tokens before failing, and definitely consumes latency) making
the "fail fast rather than keep trying" argument for AI calls at least
as strong as for any other external service.

## How this closes the module's arc from Lesson 1 through Lesson 3

Lesson 1 established that hallucination mitigation reduces but never
eliminates a structural risk; Lesson 2 established that a single
response still needs validation and that a provider outage needs a
fallback to a genuinely different provider; this lesson adds the
system-wide awareness that makes that fallback decision efficient across
many requests, not just correct for one. Together, these three lessons
form the production reliability discipline this module set out to
build: a system that assumes the model can be wrong (Lesson 1), assumes
any individual call can fail (Lesson 2), and assumes a provider can
become unhealthy across many calls (Lesson 3) — building resilience
against each of these realities rather than hoping none of them occur.`,

    contentHi: `## Ek per-request retry/fallback chain (Lesson 2) system level pe insufficient kyun hai

Lesson 2 ki retry/fallback logic ek single request ki resilience
correctly handle karti hai — ye retry karti hai, phir fallback karti
hai, aur ek answer return karti hai. Par is logic ke paas requests ke
across koi memory nahi hai: agar ek provider pichhle 100 requests ke
liye down raha hai, request number 101 ko abhi bhi independently ise
call attempt karke discover karna padta hai, ise fail hone ka wait
karna (possibly ek timeout ke baad), retry karna, aur sirf tab fallback
karna — har single request jo exact wasted latency aur cost pay karti
hai use repeat karte hue jab tak provider down rehta hai, system ke
pattern recognize karke immediately uspe act karne ke bajaye.

## Three-state design (CLOSED, OPEN, HALF_OPEN) ek simple flag se zyada kyun hai

Ek simple boolean "kya ye provider down hai" flag ko khud ko clear
karne ka decide karne ke liye kuch separate mechanism chahiye hoga —
bahut aggressively check karna exactly un resources ko waste karta hai
jinhe bachane ke liye breaker exist karta hai, jabki bahut rarely check
karna ek recovered provider ko zaroorat se zyada der tak down marked
chhod deta hai. Three-state design ise directly solve karta hai: OPEN
real requests bhejna poori tarah band kar deta hai (un calls pe cost
aur latency bachate hue jo anyway fail hone ki bahut likelihood rakhti
hain), aur HALF_OPEN recovery test karne ka ek controlled, low-risk
tareeka provide karta hai — ek cautious real call, immediately resume
hote hue traffic ka poora flood nahi — poori tarah trust karne se pehle
ki provider phir se healthy hai aur CLOSED pe wapas jaane se pehle.

## Ye pattern ek general software-engineering resilience technique kyun hai, kuch aisa nahi jo specifically AI ke liye invent kiya gaya

Circuit breakers kisi bhi external dependency ke liye ek well-established
pattern hain jispe ek system rely karta hai — ek database connection,
ek third-party API, ek payment processor — jahan bhi ek failing
dependency ko repeatedly call karna resources waste karta hai bina fast
fail karne aur ek fallback use karne se zyada koi benefit provide kiye.
Is lesson ka contribution ye recognize karna hai ki ek AI provider
exactly is kism ki external dependency hai, wahi failure characteristics
ke saath (transient blips aur sustained outages) kisi bhi doosre ki
tarah, aur Module 2 ka cost math (ek doomed call abhi bhi tokens consume
kar sakta hai fail hone se pehle, aur definitely latency consume karta
hai) "keep trying ke bajaye fast fail karo" argument ko AI calls ke liye
kisi bhi doosri external service jitna strong banate hue.

## Ye Lesson 1 se Lesson 3 tak module ke arc ko kaise close karta hai

Lesson 1 ne establish kiya ki hallucination mitigation ek structural
risk ko kam karta hai kabhi eliminate nahi karta; Lesson 2 ne establish
kiya ki ek single response ko abhi bhi validation chahiye aur ek
provider outage ko ek genuinely alag provider tak ek fallback chahiye;
ye lesson wo system-wide awareness add karta hai jo us fallback decision
ko kai requests ke across efficient banata hai, sirf ek ke liye correct
nahi. Saath mein, ye teen lessons wo production reliability discipline
banate hain jise ye module banane ke liye nikla: ek system jo assume
karta hai ki model galat ho sakta hai (Lesson 1), assume karta hai ki
koi bhi individual call fail ho sakti hai (Lesson 2), aur assume karta
hai ki ek provider kai calls ke across unhealthy ho sakta hai (Lesson 3)
— in mein se har ek reality ke against resilience build karte hue ye
hope karne ke bajaye ki inme se koi bhi hoga hi nahi.`,

    examples: [
      {
        title: 'A complete resilience stack combining a circuit breaker with the fallback chain from Lesson 2',
        titleHi: 'Ek complete resilience stack jo ek circuit breaker ko Lesson 2 ke fallback chain ke saath combine karta hai',
        codeJs: `class CircuitBreaker {
  constructor(failureThreshold = 5, cooldownMs = 30000) {
    Object.assign(this, { failureThreshold, cooldownMs, failureCount: 0, state: 'CLOSED', openedAt: null });
  }
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt > this.cooldownMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CIRCUIT_OPEN');
      }
    }
    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') { this.failureCount = 0; this.state = 'CLOSED'; }
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) { this.state = 'OPEN'; this.openedAt = Date.now(); }
      throw err;
    }
  }
}

const anthropicBreaker = new CircuitBreaker(5, 30000);
const openaiBreaker = new CircuitBreaker(5, 30000);

async function getResilientAnswer(question) {
  try {
    // Circuit breaker wraps Lesson 2's bounded retry logic for the primary
    return await anthropicBreaker.call(async () => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 500, messages: [{ role: 'user', content: question }] });
          return r.content[0].text;
        } catch (err) {
          if (attempt === 2) throw err;
        }
      }
    });
  } catch {
    // Falls back to a DIFFERENT provider, ALSO behind its own circuit breaker
    return await openaiBreaker.call(async () => {
      const r = await openai.chat.completions.create({ model: 'gpt-4o', max_tokens: 500, messages: [{ role: 'user', content: question }] });
      return r.choices[0].message.content;
    });
  }
}`,
        codeTs: `type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private failureCount = 0;
  private state: BreakerState = 'CLOSED';
  private openedAt: number | null = null;

  constructor(private failureThreshold = 5, private cooldownMs = 30000) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.openedAt !== null && Date.now() - this.openedAt > this.cooldownMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CIRCUIT_OPEN');
      }
    }
    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') { this.failureCount = 0; this.state = 'CLOSED'; }
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) { this.state = 'OPEN'; this.openedAt = Date.now(); }
      throw err;
    }
  }
}

const anthropicBreaker = new CircuitBreaker(5, 30000);
const openaiBreaker = new CircuitBreaker(5, 30000);

async function getResilientAnswer(question: string): Promise<string> {
  try {
    // Circuit breaker wraps Lesson 2's bounded retry logic for the primary
    return await anthropicBreaker.call(async () => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 500, messages: [{ role: 'user', content: question }] });
          const block = r.content[0];
          if (block.type !== 'text') throw new Error('Expected text');
          return block.text;
        } catch (err) {
          if (attempt === 2) throw err;
        }
      }
      throw new Error('unreachable');
    });
  } catch {
    // Falls back to a DIFFERENT provider, ALSO behind its own circuit breaker
    return await openaiBreaker.call(async () => {
      const r = await openai.chat.completions.create({ model: 'gpt-4o', max_tokens: 500, messages: [{ role: 'user', content: question }] });
      return r.choices[0].message.content ?? '';
    });
  }
}`,
        code: `// Circuit breaker wraps Lesson 2's retry logic
return await anthropicBreaker.call(async () => {
  // bounded retries here
});
// on failure or OPEN breaker, fall back to a different provider,
// also wrapped in its own breaker`,
        output:
          "During a sustained Anthropic outage, the first several requests trip the breaker to OPEN after accumulating failures; every subsequent request during the outage fails FAST (no wasted retry attempts against the down provider) and goes straight to the OpenAI fallback. Once Anthropic recovers, a HALF_OPEN test call succeeds and the breaker resets to CLOSED automatically.",
        explain:
          "Both providers have their own independent circuit breaker — the system tracks each provider's recent health separately, so a fallback provider experiencing its own issues doesn't get confused with the primary's health, and each dependency's resilience state is tracked precisely where it belongs.",
        explainHi:
          "Dono providers ke apne independent circuit breaker hain — system har provider ki recent health ko separately track karta hai, isliye ek fallback provider jo apne khud ke issues experience kar raha hai primary ki health se confused nahi hota, aur har dependency ki resilience state exactly wahin track hoti hai jahan ye belong karti hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// No circuit breaker — every request independently rediscovers
// a sustained outage the slow, expensive way
async function getAnswer(question) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 500,
        messages: [{ role: 'user', content: question }],
      });
    } catch {}
  }
  return await openai.chat.completions.create({ /* fallback */ });
  // During a 30-minute Anthropic outage, EVERY single incoming request
  // pays the full cost of attempting and timing out against Anthropic
  // before falling back — no memory of the outage across requests
}`,
        right: `// A circuit breaker gives the system memory of recent failures
// across ALL requests, not just within one
const anthropicBreaker = new CircuitBreaker(5, 30000);

async function getAnswer(question) {
  try {
    return await anthropicBreaker.call(() =>
      anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 500, messages: [{ role: 'user', content: question }] })
    );
  } catch {
    return await openai.chat.completions.create({ /* fallback */ });
    // Once the breaker trips OPEN, subsequent requests skip straight
    // to this fallback WITHOUT wasting time attempting Anthropic first
  }
}`,
        why: "Without a circuit breaker, every request during a sustained outage independently pays the full cost of attempting and timing out against the down provider before falling back — the system has no way to remember 'this provider is currently unhealthy' across requests, wasting real time and money that a circuit breaker's shared state would avoid.",
        whyHi:
          "Circuit breaker ke bina, ek sustained outage ke dauran har request independently down provider ke against attempt karne aur time out hone ka poora cost pay karta hai fallback karne se pehle — system ke paas requests ke across 'ye provider currently unhealthy hai' yaad rakhne ka koi tareeka nahi hai, real time aur paisa waste karte hue jise ek circuit breaker ka shared state avoid kar deta.",
      },
    ],

    realWorld: [
      {
        en: "A production AI platform running millions of daily requests across multiple providers uses circuit breakers on each provider independently, so a degradation at one provider is detected within the first several failed requests and the system automatically routes all subsequent traffic to a healthy provider — without this, the platform's own monitoring showed that a past outage would have cost minutes of wasted latency on every single request until manual intervention, rather than an automatic, immediate response.",
        hi: 'Ek production AI platform jo multiple providers ke across millions of daily requests chalata hai har provider pe independently circuit breakers use karta hai, taaki ek provider pe ek degradation pehle kuch failed requests ke andar detect ho jaaye aur system automatically saara subsequent traffic ek healthy provider ki taraf route kare — iske bina, platform ki apni monitoring ne dikhaya ki ek past outage har single request pe minutes of wasted latency cost karta manual intervention tak, ek automatic, immediate response ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: "Why is a circuit breaker necessary in addition to a per-request retry/fallback chain (Lesson 2)?",
        qHi: 'Per-request retry/fallback chain (Lesson 2) ke alawa ek circuit breaker zaroori kyun hai?',
        a: "A retry/fallback chain has no memory across requests — if a provider is genuinely down, every individual request independently rediscovers this by attempting the call, waiting for failure, and then falling back, repeating the same wasted latency and cost for each one. A circuit breaker maintains shared state across all requests to a provider, letting the system skip straight to a fallback once it's confident the primary is currently unhealthy.",
        aHi: 'Ek retry/fallback chain ke paas requests ke across koi memory nahi hai — agar ek provider genuinely down hai, har individual request independently call attempt karke, failure ka wait karke, aur phir fallback karke ise rediscover karta hai, har ek ke liye wahi wasted latency aur cost repeat karte hue. Ek circuit breaker ek provider ko saari requests ke across shared state maintain karta hai, system ko directly ek fallback pe jaane deta hai ek baar confident hone pe ki primary currently unhealthy hai.',
      },
      {
        q: 'Why does a circuit breaker need three states (CLOSED, OPEN, HALF_OPEN) rather than a simple on/off flag?',
        qHi: 'Ek circuit breaker ko teen states (CLOSED, OPEN, HALF_OPEN) kyun chahiye ek simple on/off flag ke bajaye?',
        a: "A simple flag would need a separate mechanism to decide when to clear itself, risking either wasting resources by checking too aggressively or leaving a recovered provider marked down too long. HALF_OPEN solves this: after a cooldown, one cautious real call tests recovery without a full flood of traffic — succeeding resets to CLOSED, failing returns to OPEN for another cooldown.",
        aHi: 'Ek simple flag ko khud ko clear karne ka decide karne ke liye ek separate mechanism chahiye hoga, ya to bahut aggressively check karke resources waste karne ka risk ya ek recovered provider ko bahut lambe time tak down marked chhodne ka. HALF_OPEN ise solve karta hai: ek cooldown ke baad, ek cautious real call recovery test karta hai traffic ke poore flood ke bina — succeed hona CLOSED pe reset karta hai, fail hona wapas OPEN pe ek aur cooldown ke liye jaata hai.',
      },
    ],

    exercises: [
      {
        task: "A team's monitoring shows that during a recent 20-minute provider outage, every single incoming request during that window took the full timeout duration before falling back, multiplying their total wasted latency across thousands of requests. Using this lesson's reasoning, explain how a circuit breaker would have changed this outcome.",
        taskHi: 'Ek team ki monitoring dikhati hai ki ek recent 20-minute provider outage ke dauran, us window mein har single incoming request ne fallback karne se pehle poora timeout duration liya, hazaron requests ke across unki total wasted latency ko multiply karte hue. Is lesson ki reasoning use karke, explain karo ki ek circuit breaker ye outcome kaise badalta.',
        hint: "Consider what happens after the breaker's failure threshold is crossed, and how quickly subsequent requests during the same outage would then fail and fall back.",
        hintHi: 'Consider karo ki breaker ka failure threshold cross hone ke baad kya hota hai, aur wahi outage ke dauran subsequent requests kitni jaldi fail aur fallback hoti.',
      },
    ],

    keyTakeaways: [
      "A circuit breaker adds system-wide memory of recent failures across ALL requests to a provider — without it, every request during a sustained outage independently pays the full cost of discovering the outage before falling back.",
      "The three-state design (CLOSED, OPEN, HALF_OPEN) provides a controlled, low-risk way to test recovery rather than either wastefully checking too often or leaving a recovered provider marked down too long.",
      "Circuit breakers are a general software-engineering resilience pattern for any external dependency — this lesson applies it specifically to AI providers, whose cost math (Module 2) makes 'fail fast rather than keep trying' at least as strong an argument as for any other service.",
      "This module's three lessons together form a complete reliability discipline: assuming the model can be wrong (Lesson 1), assuming any individual call can fail (Lesson 2), and assuming a provider can become unhealthy across many calls (Lesson 3).",
    ],
    keyTakeawaysHi: [
      'Ek circuit breaker ek provider ko SAARI requests ke across recent failures ki system-wide memory add karta hai — iske bina, ek sustained outage ke dauran har request independently outage discover karne ka poora cost pay karta hai fallback karne se pehle.',
      'Three-state design (CLOSED, OPEN, HALF_OPEN) recovery test karne ka ek controlled, low-risk tareeka provide karta hai bahut zyada baar wastefully check karne ya ek recovered provider ko bahut lambe time tak down marked chhodne ke bajaye.',
      'Circuit breakers kisi bhi external dependency ke liye ek general software-engineering resilience pattern hain — ye lesson ise specifically AI providers pe apply karta hai, jinka cost math (Module 2) "keep trying ke bajaye fast fail karo" ko kisi bhi doosri service jitna strong argument banata hai.',
      'Is module ke teen lessons saath mein ek complete reliability discipline banate hain: assume karna ki model galat ho sakta hai (Lesson 1), assume karna ki koi bhi individual call fail ho sakti hai (Lesson 2), aur assume karna ki ek provider kai calls ke across unhealthy ho sakta hai (Lesson 3).',
    ],
  },
];
