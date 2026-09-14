/**
 * Generative AI Complete Course — Module 15: Multi-modal AI, lessons 1-3.
 *
 * Lesson 1: Vision — sending images to a model and getting structured understanding back.
 * Lesson 2: Audio — speech-to-text and text-to-speech as first-class model capabilities.
 * Lesson 3: Combining modalities — building one feature that genuinely uses more than one.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_15: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-vision-image-understanding',
    title: 'Vision — Sending Images to a Model and Getting Structured Understanding Back',
    titleHi: 'Vision — Ek Model Ko Images Bhejna Aur Structured Understanding Wapas Paana',
    description:
      "Modern multi-modal models accept images alongside text in the same request, treating visual content as just another input the model reasons over — opening up receipt parsing, UI screenshot review, content moderation, and document extraction as genuinely tractable features.",
    descriptionHi:
      'Modern multi-modal models images ko text ke saath wahi request mein accept karte hain, visual content ko sirf ek aur input ki tarah treat karte hue jispe model reason karta hai — receipt parsing, UI screenshot review, content moderation, aur document extraction ko genuinely tractable features ki tarah khol dete hain.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: "**Handing a knowledgeable colleague a printed photo and asking them a question about it, versus having to describe the photo to them in words over the phone before they can answer anything.** Describing a receipt over the phone — reading out every line item, every price, every alignment detail — to someone who can't see it is slow, error-prone, and loses information no verbal description fully captures (was that number aligned under a specific column? was there a smudge over one digit?). Handing that same colleague the actual photo lets them look directly at the real thing and answer immediately, using details you might not have even thought to mention. Text-only language models were, for years, in the position of the person on the phone — everything had to be translated into words before the model could reason about it, and translating an image into words is lossy and effortful. A vision-capable model is the colleague holding the actual photo: the image is sent directly as part of the request, in its original visual form, and the model reasons over the actual pixels rather than over someone else's lossy verbal description of them.",
      hi: 'ek knowledgeable colleague ko ek printed photo dena aur unse uske baare mein ek sawaal poochna, versus phone pe unhe words mein photo describe karna padna kuch bhi answer karne se pehle. Ek receipt ko phone pe describe karna — har line item, har price, har alignment detail padhkar sunana — kisi ko jo ise dekh nahi sakta slow, error-prone hai, aur information khota hai jise koi verbal description poori tarah capture nahi karti (kya wo number ek specific column ke under aligned tha? kya ek digit pe koi smudge tha?). Wahi colleague ko actual photo dena unhe directly real cheez dekhne deta hai aur immediately answer karne deta hai, un details ka use karte hue jinke baare mein aapne mention karna socha bhi nahi hoga. Text-only language models, saalon tak, phone pe wale insaan ki position mein the — har cheez ko words mein translate karna padta tha model ke reason karne se pehle, aur ek image ko words mein translate karna lossy aur effortful hai. Ek vision-capable model wo colleague hai jo actual photo pakde hue hai: image directly request ka part ki tarah bheji jaati hai, uski original visual form mein, aur model actual pixels pe reason karta hai, kisi doosre ke unke lossy verbal description pe nahi.',
    },

    simple: `**How image input actually works — images become part of the same
message content array as text, not a separate API:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeReceipt(imageBase64: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64, // the raw image bytes, base64-encoded
            },
          },
          {
            type: 'text',
            text: 'Extract the total amount, date, and merchant name from this receipt as JSON.',
          },
        ],
      },
    ],
  });
  return response.content[0].type === 'text' ? response.content[0].text : null;
}
\`\`\`

**Why images and text live in the SAME content array, not separate
requests — this is the core mental-model shift from text-only usage:**

\`\`\`
A vision-capable model doesn't run a separate "image analysis" pass
and then feed a text summary to a "text reasoning" pass — the image
is tokenized (Module 1's tokenization concept, extended to visual
input) and reasoned over in the SAME pass as any text in the request.
This is why a single request can ask a nuanced, context-dependent
question about an image ("does this UI screenshot follow the design
system's spacing rules?") rather than only extracting generic,
context-free image labels.
\`\`\`

**Combining Module 6's structured-output pattern with vision — this
is where vision becomes genuinely production-useful, not a novelty:**

\`\`\`ts
import { z } from 'zod';

const ReceiptSchema = z.object({
  merchant: z.string(),
  date: z.string(),
  totalAmount: z.number(),
  lineItems: z.array(z.object({ description: z.string(), price: z.number() })),
});

async function extractReceiptData(imageBase64: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          {
            type: 'text',
            text: \`Extract this receipt's data as JSON matching this exact shape:
{"merchant": string, "date": string, "totalAmount": number, "lineItems": [{"description": string, "price": number}]}
Return ONLY the JSON, no other text.\`,
          },
        ],
      },
    ],
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  // Same validate-and-retry discipline from Module 6 applies here —
  // vision output is still model output, still needs schema validation
  return ReceiptSchema.parse(JSON.parse(text));
}
\`\`\`

**Why image size and count directly affect both cost and latency —
a practical constraint this course's Module 10 (cost/latency) applies
identically here:**

\`\`\`
Images consume tokens just like text does — a larger or higher-
resolution image consumes more tokens than a smaller one, and multiple
images in one request multiply this cost. Resizing/compressing an
image before sending it (when full resolution isn't needed for the
task — extracting text from a receipt rarely needs 4K resolution) is
a direct, practical cost-and-latency optimization, the same category
of lever Module 10 covers for text.
\`\`\`

\`\`\`ts
// A practical pattern: cap image dimensions before sending, since the
// model doesn't need more resolution than the task requires
import sharp from 'sharp';

async function prepareImageForModel(imageBuffer: Buffer): Promise<string> {
  const resized = await sharp(imageBuffer)
    .resize({ width: 1568, withoutEnlargement: true }) // a sensible upper bound
    .jpeg({ quality: 85 })
    .toBuffer();
  return resized.toString('base64');
}
\`\`\`

**Why hallucination (Module 1, Module 11) still applies fully to
vision — a model can confidently misread an image just as it can
confidently fabricate a text fact:**

\`\`\`
A vision-capable model reading a blurry or low-resolution receipt can
confidently produce a plausible-looking but WRONG total amount, the
same structural hallucination risk Module 11 covers for text output.
This is why extracted data from an image — especially anything used
for a financial or otherwise consequential decision — needs the same
validation discipline as any other model output, not an exemption
because "it read it directly from a picture."
\`\`\``,

    simpleHi: `**Image input actually kaise kaam karta hai — images text ke wahi
message content array ka part ban jaati hain, ek separate API nahi:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeReceipt(imageBase64: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64, // raw image bytes, base64-encoded
            },
          },
          {
            type: 'text',
            text: 'Extract the total amount, date, and merchant name from this receipt as JSON.',
          },
        ],
      },
    ],
  });
  return response.content[0].type === 'text' ? response.content[0].text : null;
}
\`\`\`

**Images aur text WAHI content array mein kyun rehte hain, separate
requests mein nahi — ye text-only usage se core mental-model shift hai:**

\`\`\`
Ek vision-capable model ek separate "image analysis" pass run nahi
karta phir ek text summary ko ek "text reasoning" pass ko feed karta —
image tokenize ki jaati hai (Module 1 ka tokenization concept, visual
input tak extended) aur WAHI pass mein reason ki jaati hai kisi bhi
text ke saath jo request mein hai. Yahi wajah hai ek single request
ek image ke baare mein ek nuanced, context-dependent question pooch
sakta hai ("kya ye UI screenshot design system ke spacing rules follow
karta hai?") generic, context-free image labels sirf extract karne ke
bajaye.
\`\`\`

**Module 6 ke structured-output pattern ko vision ke saath combine
karna — yahan vision genuinely production-useful ban jaata hai, ek
novelty nahi:**

\`\`\`ts
import { z } from 'zod';

const ReceiptSchema = z.object({
  merchant: z.string(),
  date: z.string(),
  totalAmount: z.number(),
  lineItems: z.array(z.object({ description: z.string(), price: z.number() })),
});

async function extractReceiptData(imageBase64: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          {
            type: 'text',
            text: \`Extract this receipt's data as JSON matching this exact shape:
{"merchant": string, "date": string, "totalAmount": number, "lineItems": [{"description": string, "price": number}]}
Return ONLY the JSON, no other text.\`,
          },
        ],
      },
    ],
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  // Module 6 ka wahi validate-and-retry discipline yahan bhi apply
  // hota hai — vision output abhi bhi model output hai, abhi bhi
  // schema validation chahiye
  return ReceiptSchema.parse(JSON.parse(text));
}
\`\`\`

**Image size aur count directly cost aur latency ko kyun affect karte
hain — ek practical constraint jise is course ka Module 10
(cost/latency) yahan identically apply karta hai:**

\`\`\`
Images tokens consume karti hain wahi tarike se jaise text karta hai —
ek badi ya higher-resolution image ek chhoti se zyada tokens consume
karti hai, aur ek request mein multiple images is cost ko multiply
karti hain. Ek image ko resize/compress karna use bhejne se pehle (jab
full resolution task ke liye zaroori nahi hai — ek receipt se text
extract karne ko rarely 4K resolution chahiye) ek direct, practical
cost-and-latency optimization hai, wahi category ka lever jo Module 10
text ke liye cover karta hai.
\`\`\`

\`\`\`ts
// Ek practical pattern: image dimensions ko cap karo bhejne se pehle,
// kyunki model ko task ki zaroorat se zyada resolution nahi chahiye
import sharp from 'sharp';

async function prepareImageForModel(imageBuffer: Buffer): Promise<string> {
  const resized = await sharp(imageBuffer)
    .resize({ width: 1568, withoutEnlargement: true }) // ek sensible upper bound
    .jpeg({ quality: 85 })
    .toBuffer();
  return resized.toString('base64');
}
\`\`\`

**Hallucination (Module 1, Module 11) vision pe poori tarah kyun apply
hota hai — ek model ek image ko confidently galat padh sakta hai wahi
tarike se jaise ye confidently ek text fact fabricate kar sakta hai:**

\`\`\`
Ek vision-capable model ek blurry ya low-resolution receipt padhte
hue confidently ek plausible-looking par GALAT total amount produce
kar sakta hai, wahi structural hallucination risk jise Module 11 text
output ke liye cover karta hai. Yahi wajah hai ek image se extract ki
gayi data — especially kuch bhi jo ek financial ya otherwise
consequential decision ke liye use ki jaati hai — ko wahi validation
discipline chahiye kisi bhi doosre model output ki tarah, koi exemption
nahi is wajah se ki "ise directly ek picture se padha."
\`\`\``,

    content: `## Why sending an image alongside text in the same request is a
different mental model from separate "computer vision" pipelines

Before multi-modal LLMs, extracting information from an image typically
required a dedicated computer-vision pipeline (OCR for text, a
classification model for categories, a separate object-detection model
for locating things) whose outputs were then stitched together, often
manually, into something a downstream system could use. A vision-
capable LLM collapses this into a single request: the image is
tokenized and reasoned over in the same pass as any accompanying text
instruction, which is why a single prompt can ask a genuinely
open-ended, context-dependent question about an image ("does this
receipt look like it was altered?", "does this screenshot match our
design system's spacing?") rather than being limited to whatever fixed
categories a specialized model was trained to recognize.

## Why combining vision with Module 6's structured-output discipline
is what makes it production-viable rather than a demo trick

A model that can describe an image in prose is interesting; a model
that can extract specific, schema-validated fields from that image
(exact totals, dates, structured line items) is what makes vision
usable inside a real application's data pipeline. This is a direct
extension of Module 6's JSON-schema-constrained generation pattern —
the same discipline of specifying an exact expected shape, parsing the
response, and validating it against a schema (Zod, in this course's
convention) applies whether the source of the model's raw text output
was a pure-text prompt or an image-plus-text prompt.

## Why image size directly affects cost and latency in a way this
course's Module 10 already established the vocabulary for

Images are tokenized, meaning larger or higher-resolution images
consume proportionally more tokens — this places image-heavy features
squarely within the same cost/latency design space Module 10
introduced for text. A production feature processing many images (a
receipt-scanning app, a content-moderation pipeline) benefits directly
from applying Module 10's principles: resizing images to the smallest
resolution the task genuinely needs before sending them, since most
extraction tasks don't require full original resolution, is a concrete,
often substantial cost reduction with no accuracy loss for the actual
task at hand.

## Why hallucination risk (Module 1, Module 11) is not reduced by
switching from text to image input — it's a property of the model,
not the input modality

A vision-capable model reasoning over a blurry, ambiguous, or
low-resolution image is subject to the same fundamental hallucination
mechanism Module 1 established as structural to how these models
generate output: a confident-sounding, plausible answer is not the
same as a correct one. This is why data extracted from images for any
consequential use (financial figures from a receipt, medical
information from a scanned document) requires the same validation
discipline — schema checks, sanity bounds, human review where the
stakes justify it — that Module 11 established for text output, with
zero exemption for the fact that the source was visual.`,

    contentHi: `## Ek image ko text ke saath wahi request mein bhejna separate "computer vision" pipelines se ek alag mental model kyun hai

Multi-modal LLMs se pehle, ek image se information extract karne ke
liye typically ek dedicated computer-vision pipeline chahiye hoti thi
(text ke liye OCR, categories ke liye ek classification model, cheezein
locate karne ke liye ek separate object-detection model) jinke outputs
phir ek doosre se stitch kiye jaate the, aksar manually, kisi cheez
mein jise ek downstream system use kar sake. Ek vision-capable LLM ise
ek single request mein collapse kar deta hai: image tokenize ki jaati
hai aur wahi pass mein reason ki jaati hai kisi bhi accompanying text
instruction ke saath, yahi wajah hai ek single prompt ek image ke
baare mein ek genuinely open-ended, context-dependent question pooch
sakta hai ("kya ye receipt aisi dikhti hai jaise ise alter kiya gaya
ho?", "kya ye screenshot hamare design system ke spacing se match
karta hai?") kisi fixed categories tak limited hone ke bajaye jinhe ek
specialized model recognize karne ke liye trained tha.

## Vision ko Module 6 ke structured-output discipline ke saath combine karna ise production-viable kyun banata hai, ek demo trick nahi

Ek model jo ek image ko prose mein describe kar sakta hai interesting
hai; ek model jo us image se specific, schema-validated fields extract
kar sakta hai (exact totals, dates, structured line items) wo hai jo
vision ko ek real application ke data pipeline ke andar usable banata
hai. Ye Module 6 ke JSON-schema-constrained generation pattern ka ek
direct extension hai — wahi discipline of specifying ek exact expected
shape, response ko parse karna, aur ise ek schema (Zod, is course ke
convention mein) ke against validate karna apply hota hai chahe model
ke raw text output ka source ek pure-text prompt tha ya ek
image-plus-text prompt.

## Image size directly cost aur latency ko affect karta hai ek tarike se jispe is course ka Module 10 already vocabulary establish kar chuka hai

Images tokenize ki jaati hain, matlab badi ya higher-resolution images
proportionally zyada tokens consume karti hain — ye image-heavy
features ko squarely wahi cost/latency design space mein rakhta hai jo
Module 10 ne text ke liye introduce kiya. Ek production feature jo
kai images process karta hai (ek receipt-scanning app, ek
content-moderation pipeline) directly benefit karta hai Module 10 ke
principles apply karne se: images ko sabse chhoti resolution mein
resize karna jo task ko genuinely chahiye unhe bhejne se pehle, kyunki
zyada tar extraction tasks ko full original resolution ki zaroorat
nahi hoti, ek concrete, aksar substantial cost reduction hai koi
accuracy loss ke bina actual task ke liye.

## Hallucination risk (Module 1, Module 11) text se image input pe switch karke kam kyun nahi hota — ye model ki property hai, input modality ki nahi

Ek vision-capable model jo ek blurry, ambiguous, ya low-resolution
image pe reason kar raha hai wahi fundamental hallucination mechanism
ke subject hai jise Module 1 ne structural establish kiya is baat ka
ki ye models output kaise generate karte hain: ek confident-sounding,
plausible answer wahi nahi hai jo ek correct answer hai. Yahi wajah
hai images se extract ki gayi data kisi bhi consequential use ke liye
(ek receipt se financial figures, ek scanned document se medical
information) wahi validation discipline maangti hai — schema checks,
sanity bounds, human review jahan stakes justify karte hain — jise
Module 11 ne text output ke liye establish kiya, zero exemption is
fact ke liye ki source visual tha.`,

    examples: [
      {
        title: 'A UI-screenshot review feature combining vision with a structured design-system compliance check',
        titleHi: 'Ek UI-screenshot review feature jo vision ko ek structured design-system compliance check ke saath combine karta hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DesignReviewSchema = z.object({
  followsSpacingRules: z.boolean(),
  issues: z.array(z.string()),
  overallAssessment: z.enum(['compliant', 'minor_issues', 'major_issues']),
});

async function reviewUiScreenshot(imageBase64) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } },
          {
            type: 'text',
            text: \`Review this UI screenshot against our design system rules:
- 8px spacing grid (all margins/padding should be multiples of 8px)
- Primary buttons use the brand blue color
- Body text is at least 14px

Return JSON: {"followsSpacingRules": boolean, "issues": string[], "overallAssessment": "compliant"|"minor_issues"|"major_issues"}
Return ONLY the JSON.\`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return DesignReviewSchema.parse(JSON.parse(text));
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DesignReviewSchema = z.object({
  followsSpacingRules: z.boolean(),
  issues: z.array(z.string()),
  overallAssessment: z.enum(['compliant', 'minor_issues', 'major_issues']),
});

type DesignReview = z.infer<typeof DesignReviewSchema>;

async function reviewUiScreenshot(imageBase64: string): Promise<DesignReview> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } },
          {
            type: 'text',
            text: \`Review this UI screenshot against our design system rules:
- 8px spacing grid (all margins/padding should be multiples of 8px)
- Primary buttons use the brand blue color
- Body text is at least 14px

Return JSON: {"followsSpacingRules": boolean, "issues": string[], "overallAssessment": "compliant"|"minor_issues"|"major_issues"}
Return ONLY the JSON.\`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return DesignReviewSchema.parse(JSON.parse(text));
}`,
        code: `const review = await reviewUiScreenshot(screenshotBase64);
// { followsSpacingRules: false, issues: ["Button padding is 10px, not a multiple of 8"], overallAssessment: "minor_issues" }`,
        output:
          "The function returns a schema-validated object identifying specific design-system deviations directly from a screenshot — no separate OCR or object-detection pipeline was needed; the same model call that would answer a text question reasons directly over the image pixels.",
        explain:
          "This demonstrates the lesson's core pattern: an image and a text instruction share one request, and the model's raw text output is disciplined with the same Zod-schema validation Module 6 established, treating vision output with exactly the same rigor as any other model-generated structured data.",
        explainHi:
          "Ye lesson ke core pattern ko demonstrate karta hai: ek image aur ek text instruction ek request share karte hain, aur model ka raw text output wahi Zod-schema validation se disciplined hota hai jise Module 6 ne establish kiya, vision output ko exactly wahi rigor ke saath treat karte hue jo kisi bhi doosre model-generated structured data ko milta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Sending a full-resolution, uncompressed image for a task that
// doesn't need it, needlessly inflating token cost and latency
async function extractTotalWrong(rawImageBuffer) {
  const base64 = rawImageBuffer.toString('base64'); // could be 12MB, 4000x3000px
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
        { type: 'text', text: 'What is the total amount on this receipt?' },
      ],
    }],
  });
}`,
        right: `// Resizing to a sensible resolution before sending — the model
// needs enough resolution to read text clearly, not the original's
// full resolution
import sharp from 'sharp';

async function extractTotalRight(rawImageBuffer) {
  const resized = await sharp(rawImageBuffer)
    .resize({ width: 1568, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const base64 = resized.toString('base64');

  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
        { type: 'text', text: 'What is the total amount on this receipt?' },
      ],
    }],
  });
}`,
        why: "Since images are tokenized proportionally to their resolution, sending an unnecessarily large image directly inflates both cost and latency with no accuracy benefit for a task (reading a receipt total) that doesn't require the original's full resolution — this is Module 10's cost/latency discipline applied specifically to the image modality.",
        whyHi:
          "Kyunki images unki resolution ke proportion mein tokenize hoti hain, ek unnecessarily badi image bhejna directly cost aur latency ko inflate karta hai koi accuracy benefit ke bina ek task ke liye (ek receipt total padhna) jise original ki full resolution ki zaroorat nahi hai — ye Module 10 ka cost/latency discipline hai specifically image modality pe applied.",
      },
    ],

    realWorld: [
      {
        en: "A production expense-management app replaced its dedicated OCR-plus-classification pipeline (three separate services, each with its own failure modes) with a single vision-capable model call for receipt data extraction, reducing both infrastructure complexity and end-to-end latency while measuring accuracy against the same validated test set used to benchmark the old pipeline.",
        hi: 'Ek production expense-management app ne apni dedicated OCR-plus-classification pipeline (teen separate services, har ek ka apna failure modes) ko receipt data extraction ke liye ek single vision-capable model call se replace kiya, dono infrastructure complexity aur end-to-end latency ko kam karte hue jabki accuracy ko wahi validated test set ke against measure kiya jo old pipeline ko benchmark karne ke liye use kiya gaya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'How does sending an image to a multi-modal model differ from a traditional computer-vision pipeline, mechanically?',
        qHi: 'Ek image ko ek multi-modal model ko bhejna ek traditional computer-vision pipeline se mechanically kaise alag hai?',
        a: "A traditional pipeline typically chains separate specialized models (OCR, classification, object detection) whose outputs are combined afterward. A multi-modal LLM tokenizes the image and reasons over it in the same pass as any accompanying text, in a single request — allowing open-ended, context-dependent questions about the image rather than being limited to fixed categories a specialized model was trained to detect.",
        aHi: 'Ek traditional pipeline typically separate specialized models (OCR, classification, object detection) ko chain karti hai jinke outputs baad mein combine kiye jaate hain. Ek multi-modal LLM image ko tokenize karta hai aur wahi pass mein ise reason karta hai kisi bhi accompanying text ke saath, ek single request mein — image ke baare mein open-ended, context-dependent questions allow karte hue fixed categories tak limited hone ke bajaye jinhe ek specialized model detect karne ke liye trained tha.',
      },
      {
        q: "Why does hallucination risk apply just as much to vision-based extraction as it does to text generation?",
        qHi: 'Hallucination risk vision-based extraction pe utna hi kyun apply hota hai jitna text generation pe hota hai?',
        a: "Hallucination is a structural property of how these models generate output (a confident-sounding answer isn't guaranteed to be correct), not something specific to text. A model reading a blurry or ambiguous image can confidently produce a plausible but wrong reading of it, which is why extracted image data for consequential uses needs the same schema validation and human-review discipline established for text output in Module 11.",
        aHi: 'Hallucination ek structural property hai is baat ki ki ye models output kaise generate karte hain (ek confident-sounding answer correct hone ki guarantee nahi hai), text ke liye kuch specific nahi. Ek model jo ek blurry ya ambiguous image padh raha hai confidently ek plausible par galat reading produce kar sakta hai, yahi wajah hai consequential uses ke liye extract ki gayi image data ko wahi schema validation aur human-review discipline chahiye jo Module 11 mein text output ke liye establish ki gayi thi.',
      },
    ],

    exercises: [
      {
        task: "A team builds a feature that sends full-resolution 4000x3000px photos (averaging 8MB each) to a vision model to extract a single total dollar amount from a receipt, and notices both high per-request cost and slow response times. Using this lesson's cost/latency discussion, propose a specific fix and explain why it wouldn't meaningfully reduce extraction accuracy for this task.",
        taskHi: 'Ek team ek feature banati hai jo full-resolution 4000x3000px photos (averaging 8MB each) ko ek vision model ko bhejta hai ek receipt se ek single total dollar amount extract karne ke liye, aur high per-request cost aur slow response times dono notice karti hai. Is lesson ki cost/latency discussion use karke, ek specific fix propose karo aur explain karo ki ye is task ke liye extraction accuracy ko meaningfully kyun kam nahi karega.',
        hint: "Think about what resolution is actually needed to read a printed receipt's text clearly versus the resolution of a typical smartphone photo.",
        hintHi: 'Socho ki ek printed receipt ke text ko clearly padhne ke liye actually kaunsi resolution chahiye versus ek typical smartphone photo ki resolution.',
      },
    ],

    keyTakeaways: [
      "Vision-capable models accept images as part of the same content array as text, reasoning over both in a single pass rather than chaining separate specialized computer-vision models.",
      "Combining vision with Zod schema validation (Module 6's pattern) is what makes image-based extraction production-viable, not just a demo capability.",
      "Images are tokenized proportionally to resolution, meaning image size directly affects cost and latency — resizing to the smallest resolution a task genuinely needs is a concrete optimization.",
      "Hallucination risk (Module 1, Module 11) applies fully to vision — a model can confidently misread an image just as it can confidently fabricate a text fact, requiring the same validation discipline.",
    ],
    keyTakeawaysHi: [
      'Vision-capable models images ko text ke wahi content array ka part ki tarah accept karte hain, dono pe ek single pass mein reason karte hue separate specialized computer-vision models ko chain karne ke bajaye.',
      'Vision ko Zod schema validation (Module 6 ka pattern) ke saath combine karna wo hai jo image-based extraction ko production-viable banata hai, sirf ek demo capability nahi.',
      'Images resolution ke proportion mein tokenize ki jaati hain, matlab image size directly cost aur latency ko affect karti hai — sabse chhoti resolution mein resize karna jo ek task ko genuinely chahiye ek concrete optimization hai.',
      'Hallucination risk (Module 1, Module 11) vision pe poori tarah apply hota hai — ek model ek image ko confidently galat padh sakta hai wahi tarike se jaise ye confidently ek text fact fabricate kar sakta hai, wahi validation discipline maangte hue.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-audio-speech-to-text-text-to-speech',
    title: 'Audio — Speech-to-Text and Text-to-Speech as First-Class Capabilities',
    titleHi: 'Audio — Speech-to-Text Aur Text-to-Speech First-Class Capabilities Ki Tarah',
    description:
      "Speech-to-text (transcription) and text-to-speech (synthesis) are the two audio primitives that turn a text-based AI feature into a voice-capable one — each with genuinely different latency, cost, and quality tradeoffs worth understanding before building a voice feature.",
    descriptionHi:
      'Speech-to-text (transcription) aur text-to-speech (synthesis) do audio primitives hain jo ek text-based AI feature ko ek voice-capable feature mein badalte hain — har ek ke genuinely different latency, cost, aur quality tradeoffs hain jo ek voice feature banane se pehle samajhna zaroori hai.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A skilled court stenographer converting spoken testimony into an exact written transcript in real time, and, separately, a professional voice actor reading a written script aloud with natural pacing and inflection — two genuinely different, specialized skills, even though both connect speech and text.** A stenographer's entire skill is listening to speech and producing an accurate written record of it — they don't need to understand the legal argument being made, only to transcribe it faithfully and quickly. A voice actor's skill runs the opposite direction — reading a written script and producing natural, well-paced, expressive speech from it — and this skill has nothing to do with transcription; a great stenographer isn't necessarily a good voice actor, and vice versa, because the two tasks require genuinely different capabilities even though they both sit at the boundary between spoken and written language. Speech-to-text (transcription) models and text-to-speech (synthesis) models mirror this exact split: a transcription model's entire job is converting spoken audio into an accurate text record, while a synthesis model's job is converting written text into natural-sounding speech — related capabilities that live at the same audio/text boundary, but genuinely different models solving genuinely different problems, each with their own accuracy, latency, and cost characteristics.",
      hi: 'ek skilled court stenographer spoken testimony ko real time mein ek exact written transcript mein convert karta hai, aur, alag se, ek professional voice actor ek written script ko natural pacing aur inflection ke saath zor se padhta hai — do genuinely different, specialized skills, chahe dono speech aur text ko connect karte hon. Ek stenographer ki poori skill speech sunna aur uska ek accurate written record produce karna hai — unhe legal argument ko samajhne ki zaroorat nahi jo banaya ja raha hai, sirf ise faithfully aur quickly transcribe karna hai. Ek voice actor ki skill opposite direction mein chalti hai — ek written script padhna aur usse natural, well-paced, expressive speech produce karna — aur is skill ka transcription se koi lena-dena nahi hai; ek great stenographer necessarily ek achha voice actor nahi hota, aur vice versa, kyunki do tasks ko genuinely different capabilities chahiye chahe dono spoken aur written language ke beech boundary pe baithte hon. Speech-to-text (transcription) models aur text-to-speech (synthesis) models exactly ye split mirror karte hain: ek transcription model ka poora kaam spoken audio ko ek accurate text record mein convert karna hai, jabki ek synthesis model ka kaam written text ko natural-sounding speech mein convert karna hai — related capabilities jo wahi audio/text boundary pe baithti hain, par genuinely different models genuinely different problems solve karte hue, har ek ki apni accuracy, latency, aur cost characteristics ke saath.',
    },

    simple: `**Speech-to-text (transcription) — converting spoken audio into
text:**

\`\`\`ts
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(audioFilePath: string): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });
  return transcription.text;
}

// Once transcribed, the text can feed directly into any of this
// course's earlier patterns — a chat completion, a RAG query, tool
// calling — the transcription step just converts modality, nothing more
async function handleVoiceQuery(audioFilePath: string) {
  const transcript = await transcribeAudio(audioFilePath);
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: transcript }],
  });
}
\`\`\`

**Text-to-speech (synthesis) — converting text into natural-sounding
audio:**

\`\`\`ts
async function synthesizeSpeech(text: string): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  });
  return Buffer.from(await response.arrayBuffer());
}
\`\`\`

**Why transcription and synthesis are genuinely separate models
solving separate problems, not two modes of "the same audio AI":**

\`\`\`
A transcription model's ENTIRE job is accuracy: converting speech into
the correct text, handling accents, background noise, and multiple
speakers. A synthesis model's entire job is naturalness: producing
speech that sounds genuinely human, with appropriate pacing, emphasis,
and intonation for the given text. These are different optimization
targets, often served by entirely different underlying model
architectures, which is why a single "audio model" claiming to do both
equally well is worth scrutinizing.
\`\`\`

**Why latency matters MORE for audio than for text — a direct
extension of Module 10's cost/latency principles to a modality where
delay is more immediately perceptible:**

\`\`\`
A few hundred milliseconds of extra latency in a text chat response is
often unnoticed. The same delay in a VOICE conversation — where a
human expects natural, responsive turn-taking — is immediately,
viscerally noticeable, since human conversational timing has genuinely
tight, well-studied expectations for response gaps. This is why
real-time voice features specifically favor streaming transcription
(partial results as the user speaks, not waiting for them to finish)
and streaming synthesis (starting audio playback before the full
response is generated) far more aggressively than most text-based
chat features need to.
\`\`\`

\`\`\`ts
// A streaming transcription pattern — processing audio in chunks as
// it arrives, rather than waiting for a complete recording
async function streamingTranscribe(audioChunks: AsyncIterable<Buffer>) {
  const partialResults: string[] = [];
  for await (const chunk of audioChunks) {
    const partial = await transcribeChunk(chunk); // conceptual — real
    // streaming transcription APIs handle chunk boundaries internally
    partialResults.push(partial);
  }
  return partialResults.join(' ');
}
\`\`\`

**Why cost accounting for audio features needs its own line item,
distinct from Module 10's token-based text cost math:**

\`\`\`
Transcription and synthesis are typically priced per unit of audio
duration (per minute of audio transcribed, per character of text
synthesized), not per token the way chat completions are. A voice
feature's cost model therefore needs a genuinely separate calculation
from a text feature's — Module 10's PRINCIPLE (estimate cost before
launch, understand the actual pricing unit) applies identically, but
the specific unit being priced is different.
\`\`\`

**How this connects to the rest of the course:** once audio is
converted to text (via transcription) or generated from text (via
synthesis), every other pattern in this course — RAG (Module 7-8),
tool calling (Module 5), structured output (Module 6), reliability
and retries (Module 11) — applies without modification, since the
model-facing interaction is still fundamentally text. Audio is best
understood as a conversion layer at the edges of a feature, not a
parallel set of concepts that replace what this course has already
covered.`,

    simpleHi: `**Speech-to-text (transcription) — spoken audio ko text mein
convert karna:**

\`\`\`ts
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(audioFilePath: string): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });
  return transcription.text;
}

// Ek baar transcribe hone ke baad, text directly is course ke kisi
// bhi earlier pattern mein feed ho sakta hai — ek chat completion, ek
// RAG query, tool calling — transcription step sirf modality convert
// karta hai, kuch aur nahi
async function handleVoiceQuery(audioFilePath: string) {
  const transcript = await transcribeAudio(audioFilePath);
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: transcript }],
  });
}
\`\`\`

**Text-to-speech (synthesis) — text ko natural-sounding audio mein
convert karna:**

\`\`\`ts
async function synthesizeSpeech(text: string): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  });
  return Buffer.from(await response.arrayBuffer());
}
\`\`\`

**Transcription aur synthesis genuinely separate models kyun hain jo
separate problems solve karte hain, "wahi audio AI" ke do modes nahi:**

\`\`\`
Ek transcription model ka POORA kaam accuracy hai: speech ko correct
text mein convert karna, accents, background noise, aur multiple
speakers handle karna. Ek synthesis model ka poora kaam naturalness
hai: aisi speech produce karna jo genuinely human sound kare,
appropriate pacing, emphasis, aur intonation ke saath given text ke
liye. Ye alag optimization targets hain, aksar poori tarah alag
underlying model architectures dwara serve kiye jaate hain, yahi
wajah hai ek single "audio model" jo claim karta hai dono equally
achhe se karna scrutinize karne layak hai.
\`\`\`

**Latency audio ke liye text se ZYADA kyun matter karti hai — Module
10 ke cost/latency principles ka ek direct extension ek modality tak
jahan delay zyada immediately perceptible hai:**

\`\`\`
Ek text chat response mein kuch sau milliseconds ki extra latency
aksar unnoticed rehti hai. Wahi delay ek VOICE conversation mein —
jahan ek human natural, responsive turn-taking expect karta hai —
immediately, viscerally noticeable hai, kyunki human conversational
timing ke response gaps ke liye genuinely tight, well-studied
expectations hain. Yahi wajah hai real-time voice features
specifically streaming transcription (partial results jaise user
bolta hai, unke finish karne ka wait kiye bina) aur streaming
synthesis (audio playback shuru karna full response generate hone se
pehle) ko zyada tar text-based chat features se kaafi zyada
aggressively favor karte hain.
\`\`\`

\`\`\`ts
// Ek streaming transcription pattern — audio ko chunks mein process
// karna jaise ye aata hai, ek complete recording ka wait karne ke
// bajaye
async function streamingTranscribe(audioChunks: AsyncIterable<Buffer>) {
  const partialResults: string[] = [];
  for await (const chunk of audioChunks) {
    const partial = await transcribeChunk(chunk); // conceptual — real
    // streaming transcription APIs chunk boundaries ko internally handle karte hain
    partialResults.push(partial);
  }
  return partialResults.join(' ');
}
\`\`\`

**Audio features ke liye cost accounting ko apna khud ka line item
kyun chahiye, Module 10 ke token-based text cost math se distinct:**

\`\`\`
Transcription aur synthesis typically audio duration ki ek unit ke
per price ki jaati hain (transcribe kiye gaye audio ke per minute,
synthesize kiye gaye text ke per character), token ke per nahi jaise
chat completions ki jaati hain. Ek voice feature ke cost model ko
isliye ek text feature se genuinely separate calculation chahiye —
Module 10 ka PRINCIPLE (launch se pehle cost estimate karo, actual
pricing unit samjho) identically apply hota hai, par jo specific unit
price ki ja rahi hai wo alag hai.
\`\`\`

**Ye course ke baaki hisse se kaise connect karta hai:** ek baar audio
text mein convert ho jaaye (transcription ke through) ya text se
generate ki jaaye (synthesis ke through), is course ka har doosra
pattern — RAG (Module 7-8), tool calling (Module 5), structured
output (Module 6), reliability aur retries (Module 11) — bina
modification ke apply hota hai, kyunki model-facing interaction abhi
bhi fundamentally text hai. Audio ko best ek feature ke edges pe ek
conversion layer ki tarah samjhna chahiye, ek parallel set of concepts
ki tarah nahi jo is course ne already cover kiya hai use replace karte
hue.`,

    content: `## Why transcription and synthesis are genuinely different models
solving genuinely different problems, not two modes of one capability

A speech-to-text model's optimization target is accuracy — correctly
converting spoken audio, with all its accents, background noise, and
overlapping speakers, into the correct text. A text-to-speech model's
optimization target is naturalness — producing audio that sounds
genuinely human, with contextually appropriate pacing and intonation,
from a given text input. These are meaningfully different problems that
happen to sit at the same audio/text boundary, often served by
different underlying architectures with different accuracy and quality
characteristics, which is why evaluating a voice feature requires
separately assessing transcription accuracy and synthesis quality
rather than treating "audio quality" as one undifferentiated metric.

## Why latency requirements for audio are measurably stricter than
for text, extending Module 10's cost/latency framework

Module 10 established that latency tolerance depends on context — a
background batch job tolerates far more latency than an interactive
chat. Voice interaction sits at the strictest end of this spectrum:
human conversational turn-taking has well-studied, fairly tight timing
expectations, and a delay that would be unremarkable in a text chat
interface becomes immediately, viscerally noticeable in a voice
conversation. This is why production voice features lean much more
heavily on streaming patterns — partial transcription results as a
user speaks, and audio synthesis that begins playback before the full
response text is complete — than most text-based features need to,
directly applying Module 10's streaming-for-perceived-latency principle
in a context where the stakes for getting it right are higher.

## Why audio's cost model needs a distinct unit of accounting from
Module 10's token-based text cost math

Transcription and synthesis are typically priced per unit of audio
duration or per character of synthesized text, not per token the way
chat completions are billed. This means a voice feature's cost
estimation — while following the same underlying discipline Module 10
established (understand your actual pricing unit, estimate cost before
launch, monitor per-unit cost in production) — requires modeling audio
duration or character count rather than token count as the primary
cost driver, since applying token-based cost math directly to an
audio-priced API would produce a meaningless estimate.

## Why every other pattern in this course still applies once audio
is converted to or from text

Once spoken audio has been transcribed into text, or a text response
is ready to be synthesized into speech, the actual model-facing
interaction is unchanged from every other pattern this course has
covered: a transcript can feed a RAG query (Modules 7-8), trigger tool
calls (Module 5), request structured output (Module 6), and needs the
same reliability and retry discipline (Module 11) as any other model
interaction. This is the practical reason audio is best understood as
a conversion layer at a feature's edges — converting between speech
and text — rather than as an entirely separate set of concepts that
displaces what the rest of this course has already established.`,

    contentHi: `## Transcription aur synthesis genuinely different models kyun hain jo genuinely different problems solve karte hain, ek capability ke do modes nahi

Ek speech-to-text model ka optimization target accuracy hai — spoken
audio ko, uske sab accents, background noise, aur overlapping speakers
ke saath, correct text mein correctly convert karna. Ek text-to-speech
model ka optimization target naturalness hai — aisi audio produce
karna jo genuinely human sound kare, contextually appropriate pacing
aur intonation ke saath, ek given text input se. Ye meaningfully
different problems hain jo wahi audio/text boundary pe baithte hain,
aksar different underlying architectures dwara serve kiye jaate hain
different accuracy aur quality characteristics ke saath, yahi wajah
hai ek voice feature ko evaluate karna transcription accuracy aur
synthesis quality ko separately assess karna maangta hai "audio
quality" ko ek undifferentiated metric ki tarah treat karne ke bajaye.

## Audio ke liye latency requirements text se measurably strict kyun hain, Module 10 ke cost/latency framework ko extend karte hue

Module 10 ne establish kiya ki latency tolerance context pe depend
karti hai — ek background batch job ek interactive chat se kaafi
zyada latency tolerate karta hai. Voice interaction is spectrum ke
strictest end pe baithta hai: human conversational turn-taking ke
well-studied, fairly tight timing expectations hain, aur ek delay jo
ek text chat interface mein unremarkable hoga ek voice conversation
mein immediately, viscerally noticeable ban jaata hai. Yahi wajah hai
production voice features streaming patterns pe kaafi zyada heavily
lean karte hain — partial transcription results jaise ek user bolta
hai, aur audio synthesis jo full response text complete hone se pehle
playback shuru karti hai — zyada tar text-based features se jinhe ye
utna zyada nahi chahiye, Module 10 ke streaming-for-perceived-latency
principle ko directly apply karte hue ek context mein jahan sahi karne
ke stakes zyada hain.

## Audio ke cost model ko Module 10 ke token-based text cost math se ek distinct unit of accounting kyun chahiye

Transcription aur synthesis typically audio duration ki ek unit ke per
ya synthesized text ke character ke per price ki jaati hain, token ke
per nahi jaise chat completions bill ki jaati hain. Iska matlab hai ek
voice feature ki cost estimation — wahi underlying discipline follow
karte hue jise Module 10 ne establish kiya (apna actual pricing unit
samjho, launch se pehle cost estimate karo, production mein per-unit
cost monitor karo) — ko audio duration ya character count model karna
padta hai token count ke bajaye primary cost driver ki tarah, kyunki
token-based cost math ko directly ek audio-priced API pe apply karna
ek meaningless estimate produce karega.

## Is course ka har doosra pattern abhi bhi kyun apply hota hai ek baar audio text se ya text tak convert ho jaaye

Ek baar spoken audio text mein transcribe ho jaaye, ya ek text response
speech mein synthesize hone ke liye ready ho, actual model-facing
interaction is course ke har doosre pattern se unchanged hai jise cover
kiya gaya hai: ek transcript ek RAG query (Modules 7-8) ko feed kar
sakta hai, tool calls (Module 5) trigger kar sakta hai, structured
output (Module 6) request kar sakta hai, aur wahi reliability aur
retry discipline (Module 11) chahiye kisi bhi doosre model interaction
ki tarah. Yahi practical reason hai audio ko ek feature ke edges pe ek
conversion layer ki tarah samjhna best hai — speech aur text ke beech
convert karte hue — poori tarah ek separate set of concepts ki tarah
nahi jo is course ne already establish kiya hai use displace karte
hue.`,

    examples: [
      {
        title: 'A voice-query handler combining transcription, RAG, and synthesis into one end-to-end flow',
        titleHi: 'Ek voice-query handler jo transcription, RAG, aur synthesis ko ek end-to-end flow mein combine karta hai',
        codeJs: `import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function handleVoiceQueryEndToEnd(audioFilePath, retrieveContext) {
  // Step 1: speech-to-text — pure modality conversion, no reasoning yet
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });

  // Step 2: everything from here is identical to a text-only flow —
  // this is Module 7-8's RAG pattern, unchanged by the audio origin
  const context = await retrieveContext(transcription.text);
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: \`Context: \${context}\\n\\nQuestion: \${transcription.text}\`,
    }],
  });
  const answerText = response.content[0].type === 'text' ? response.content[0].text : '';

  // Step 3: text-to-speech — converting the final answer back to audio
  const speechResponse = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: answerText,
  });

  return Buffer.from(await speechResponse.arrayBuffer());
}`,
        codeTs: `import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type RetrieveContext = (query: string) => Promise<string>;

async function handleVoiceQueryEndToEnd(
  audioFilePath: string,
  retrieveContext: RetrieveContext,
): Promise<Buffer> {
  // Step 1: speech-to-text — pure modality conversion, no reasoning yet
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });

  // Step 2: everything from here is identical to a text-only flow —
  // this is Module 7-8's RAG pattern, unchanged by the audio origin
  const context = await retrieveContext(transcription.text);
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: \`Context: \${context}\\n\\nQuestion: \${transcription.text}\`,
    }],
  });
  const answerText = response.content[0].type === 'text' ? response.content[0].text : '';

  // Step 3: text-to-speech — converting the final answer back to audio
  const speechResponse = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: answerText,
  });

  return Buffer.from(await speechResponse.arrayBuffer());
}`,
        code: `const audioAnswer = await handleVoiceQueryEndToEnd(recordedQuestionPath, retrieveDocs);
// spoken question in, spoken answer out — RAG logic in the middle is
// completely unaware audio was ever involved`,
        output:
          "The function accepts a recorded audio question and returns a synthesized audio answer, with a genuine RAG lookup happening in between — demonstrating that audio is a thin conversion layer at the boundaries of the feature, while the actual reasoning pipeline is unchanged from a pure-text implementation.",
        explain:
          "This example makes the lesson's closing point concrete: transcription and synthesis are isolated to the very start and very end of the function, while everything in between (retrieval, prompting, response generation) is exactly the RAG pattern from Modules 7-8, unmodified by the fact that the input and output happen to be audio.",
        explainHi:
          "Ye example lesson ke closing point ko concrete banata hai: transcription aur synthesis function ke bilkul start aur bilkul end tak isolated hain, jabki beech mein sab kuch (retrieval, prompting, response generation) exactly Modules 7-8 ka RAG pattern hai, is fact se unmodified ki input aur output audio hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Waiting for a user to finish an entire recording before starting
// transcription, in a real-time voice assistant context
async function voiceAssistantWrong(fullRecordingPromise) {
  const fullRecording = await fullRecordingPromise; // waits for the ENTIRE recording
  const transcript = await transcribeAudio(fullRecording);
  return await generateResponse(transcript);
  // In a live conversation, the user experiences total silence for
  // the full duration of their speech PLUS the transcription time —
  // a latency profile real-time voice UX cannot tolerate
}`,
        right: `// Streaming transcription — processing audio as it arrives, so the
// system can begin responding as soon as the user finishes speaking,
// not after an additional full-recording transcription pass
async function voiceAssistantRight(audioStream) {
  const streamingTranscription = openai.audio.transcriptions.create({
    file: audioStream, // a live stream, not a completed recording
    model: 'whisper-1',
    // Real-time transcription APIs are built specifically to minimize
    // the gap between "user stops speaking" and "text is available"
  });
  const transcript = await streamingTranscription;
  return await generateResponse(transcript.text);
}`,
        why: "Because human conversational timing has tight, well-studied expectations for response gaps, waiting for a complete recording before starting transcription stacks the full speech duration and the transcription time as perceived silence — a latency profile that feels broken in a live voice interaction, even if the same total delay would be unremarkable in a text chat.",
        whyHi:
          "Kyunki human conversational timing ke response gaps ke liye tight, well-studied expectations hain, ek complete recording ka wait karna transcription shuru karne se pehle poori speech duration aur transcription time ko perceived silence ki tarah stack karta hai — ek latency profile jo ek live voice interaction mein broken feel karti hai, chahe wahi total delay ek text chat mein unremarkable ho.",
      },
    ],

    realWorld: [
      {
        en: "A production voice-assistant product measured user-perceived responsiveness before and after switching from a wait-for-complete-recording transcription flow to a streaming transcription approach, finding that even though total end-to-end processing time barely changed, the perceived latency (and resulting user satisfaction) improved substantially because partial results appeared while the user was still speaking.",
        hi: 'Ek production voice-assistant product ne user-perceived responsiveness ko measure kiya wait-for-complete-recording transcription flow se ek streaming transcription approach pe switch karne se pehle aur baad mein, ye finding karte hue ki chahe total end-to-end processing time barely badla, perceived latency (aur resulting user satisfaction) substantially improve hui kyunki partial results appear hue jabki user abhi bhi bol raha tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why are speech-to-text (transcription) and text-to-speech (synthesis) treated as genuinely different models rather than two modes of one "audio AI"?',
        qHi: 'Speech-to-text (transcription) aur text-to-speech (synthesis) ko genuinely different models ki tarah kyun treat kiya jaata hai, ek "audio AI" ke do modes ke bajaye?',
        a: "Transcription's optimization target is accuracy — correctly converting spoken audio to text despite accents, noise, and multiple speakers. Synthesis's optimization target is naturalness — producing human-sounding speech with appropriate pacing and intonation from text. These are meaningfully different problems, often served by different underlying architectures with different quality characteristics that need to be evaluated separately.",
        aHi: 'Transcription ka optimization target accuracy hai — spoken audio ko correctly text mein convert karna accents, noise, aur multiple speakers ke bawajood. Synthesis ka optimization target naturalness hai — text se appropriate pacing aur intonation ke saath human-sounding speech produce karna. Ye meaningfully different problems hain, aksar different underlying architectures dwara serve kiye jaate hain different quality characteristics ke saath jinhe separately evaluate karna chahiye.',
      },
      {
        q: "Why do voice features require stricter latency handling than most text-based chat features, and what pattern addresses this?",
        qHi: 'Voice features ko zyada tar text-based chat features se stricter latency handling kyun chahiye, aur kaunsa pattern ise address karta hai?',
        a: "Human conversational turn-taking has tight, well-studied timing expectations, making delays that are unremarkable in text chat immediately noticeable in voice interaction. Streaming transcription (partial results as the user speaks) and streaming synthesis (audio playback starting before the full response is generated) directly address this by minimizing perceived silence, applying Module 10's streaming-for-latency principle more aggressively than most text features require.",
        aHi: 'Human conversational turn-taking ke tight, well-studied timing expectations hain, delays ko jo text chat mein unremarkable hain voice interaction mein immediately noticeable banate hue. Streaming transcription (partial results jaise user bolta hai) aur streaming synthesis (audio playback jo full response generate hone se pehle shuru hoti hai) ise directly address karte hain perceived silence ko minimize karte hue, Module 10 ke streaming-for-latency principle ko zyada tar text features se zyada aggressively apply karte hue.',
      },
    ],

    exercises: [
      {
        task: "A team estimates their voice feature's cost using the same per-token pricing formula they use for their text chat feature, applying it to the number of words in each transcript. Explain why this cost model is fundamentally wrong for the transcription and synthesis portions of the pipeline, and describe what the actual pricing units should be.",
        taskHi: 'Ek team apne voice feature ki cost estimate karti hai wahi per-token pricing formula use karke jo wo apne text chat feature ke liye use karte hain, ise har transcript mein words ki number pe apply karte hue. Explain karo ki ye cost model pipeline ke transcription aur synthesis portions ke liye fundamentally kyun galat hai, aur describe karo ki actual pricing units kya honi chahiye.',
        hint: "Think about what unit transcription and synthesis APIs actually bill by — is it tokens, or something tied to the audio itself?",
        hintHi: 'Socho ki transcription aur synthesis APIs actually kis unit se bill karte hain — kya ye tokens hain, ya kuch jo audio khud se juda hai?',
      },
    ],

    keyTakeaways: [
      "Speech-to-text (transcription, optimized for accuracy) and text-to-speech (synthesis, optimized for naturalness) are genuinely different models solving different problems, not two modes of one capability.",
      "Voice interaction has stricter latency expectations than text chat, due to well-studied human conversational timing norms — which is why streaming transcription and streaming synthesis matter more here than in most text features.",
      "Audio is typically priced per unit of duration or character count, not per token, requiring a distinct cost model from Module 10's token-based text cost math even though the underlying discipline (estimate before launch, know your pricing unit) is the same.",
      "Once audio is converted to or from text, every other pattern in this course (RAG, tool calling, structured output, reliability) applies unmodified — audio is a conversion layer at a feature's edges, not a parallel set of concepts.",
    ],
    keyTakeawaysHi: [
      'Speech-to-text (transcription, accuracy ke liye optimized) aur text-to-speech (synthesis, naturalness ke liye optimized) genuinely different models hain jo different problems solve karte hain, ek capability ke do modes nahi.',
      'Voice interaction ki text chat se stricter latency expectations hain, well-studied human conversational timing norms ki wajah se — yahi wajah hai streaming transcription aur streaming synthesis yahan zyada tar text features se zyada matter karte hain.',
      'Audio typically duration ki unit ya character count ke per price ki jaati hai, token ke per nahi, Module 10 ke token-based text cost math se ek distinct cost model maangte hue chahe underlying discipline (launch se pehle estimate karo, apna pricing unit jaano) wahi hai.',
      'Ek baar audio text se ya text tak convert ho jaaye, is course ka har doosra pattern (RAG, tool calling, structured output, reliability) bina modification ke apply hota hai — audio ek feature ke edges pe ek conversion layer hai, ek parallel set of concepts nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-combining-modalities',
    title: 'Combining Modalities — One Feature That Genuinely Uses More Than One',
    titleHi: 'Combining Modalities — Ek Feature Jo Genuinely Ek Se Zyada Use Karta Hai',
    description:
      "Closing this module: a genuinely multi-modal feature isn't three separate capabilities bolted together — it's a single, coherent flow where each modality's output feeds naturally into the next step, using text, vision, and audio in whatever combination the actual user need requires.",
    descriptionHi:
      'Is module ko close karte hue: ek genuinely multi-modal feature teen separate capabilities bolted together nahi hain — ye ek single, coherent flow hai jahan har modality ka output naturally agle step mein feed hota hai, text, vision, aur audio ko kisi bhi combination mein use karte hue jo actual user need require karti hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A skilled emergency-dispatch operator who listens to a caller's voice, looks at a photo the caller texts in, and reads the caller's typed follow-up messages, weaving all three into one coherent understanding of the situation rather than treating them as three separate, disconnected reports.** A dispatcher doesn't process a caller's panicked voice, a photo of a car accident, and a follow-up text message about an injury as three unrelated pieces of information handled by three different people in three different rooms — a single dispatcher holds all three in mind together, using the photo to clarify something the voice description left ambiguous, and using the follow-up text to add a detail neither the call nor the photo captured. The value isn't in any single channel; it's in how the dispatcher fuses all three into one coherent, more complete picture of the situation than any single channel could have provided alone. A genuinely multi-modal AI feature works the same way: the value isn't in supporting voice input, or supporting image input, or supporting text input as three separate, disconnected capabilities — it's in a single flow where, for instance, a spoken question about a photographed object gets answered using both the audio and the image together, in one coherent reasoning step, the same way the dispatcher reasons over the voice call and the photo as one unified understanding of the emergency.",
      hi: 'ek skilled emergency-dispatch operator jo ek caller ki voice sunta hai, ek photo dekhta hai jo caller text karta hai, aur caller ke typed follow-up messages padhta hai, teenon ko ek coherent understanding of the situation mein weave karte hue unhe teen separate, disconnected reports ki tarah treat karne ke bajaye. Ek dispatcher ek caller ki panicked voice, ek car accident ki photo, aur ek injury ke baare mein ek follow-up text message ko teen unrelated pieces of information ki tarah process nahi karta jo teen different logon dwara teen different rooms mein handle kiye jaate hain — ek single dispatcher sab teenon ko saath mind mein rakhta hai, photo ka use karke kuch clarify karte hue jo voice description ne ambiguous chhoda, aur follow-up text ka use karke ek detail add karte hue jo na call na photo ne capture kiya. Value kisi single channel mein nahi hai; ye is baat mein hai ki dispatcher kaise sab teenon ko ek coherent, zyada complete picture of the situation mein fuse karta hai jo koi bhi single channel akele provide nahi kar sakta tha. Ek genuinely multi-modal AI feature wahi tarike se kaam karta hai: value voice input support karne mein, ya image input support karne mein, ya text input support karne mein teen separate, disconnected capabilities ki tarah nahi hai — ye ek single flow mein hai jahan, for instance, ek photographed object ke baare mein ek spoken question ko audio aur image dono ka use karke answer kiya jaata hai, ek coherent reasoning step mein, wahi tarike se jaise dispatcher voice call aur photo pe reason karta hai emergency ki ek unified understanding ki tarah.',
    },

    simple: `**The core distinction this lesson establishes — modalities
combined in ONE reasoning step versus modalities processed in
SEPARATE, disconnected steps:**

\`\`\`
WEAK multi-modal design: run image analysis, get a text summary; run
audio transcription, get a text summary; then feed BOTH text summaries
into a final text-only reasoning step. Information is lost at each
translation, and the final reasoning step never sees the original
image or audio.

STRONG multi-modal design: pass the image and the transcribed audio
question INTO THE SAME reasoning request, letting the model reason
over both directly, preserving details a lossy intermediate summary
would have dropped.
\`\`\`

**A concrete example — "what's wrong with this product based on my
photo and my spoken description," combining vision and audio-derived
text in ONE request:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'fs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function diagnoseProductIssue(imageBase64: string, audioFilePath: string) {
  // Step 1: audio -> text (a pure modality conversion, per Lesson 2)
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });

  // Step 2: image AND the transcribed question reasoned over TOGETHER,
  // in one request — this is the genuinely multi-modal step
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: \`Customer's spoken description: "\${transcription.text}"\n\nBased on the photo AND this description, what's likely wrong with the product?\` },
      ],
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : null;
}
\`\`\`

**Why this genuinely produces a better answer than analyzing the image
and the audio separately and merging text summaries afterward:**

\`\`\`
If the image were analyzed alone, a generic description of visible
damage might result. If the audio were transcribed and reasoned over
alone, only what the customer explicitly said would be considered. By
reasoning over BOTH together, the model can connect a detail in the
photo (a specific crack location) with a detail in the speech (the
customer describing WHEN the issue started) that neither modality
alone would have surfaced as connected — this is the actual value
genuine multi-modal reasoning adds over independently-processed
modalities merged after the fact.
\`\`\`

**A concrete architectural pattern — a single multi-modal function
signature that accepts whatever combination of modalities a specific
feature genuinely needs, rather than a rigid one-size-fits-all pipeline:**

\`\`\`ts
interface MultiModalInput {
  text?: string;
  imageBase64?: string;
  audioFilePath?: string;
}

async function buildMultiModalContent(input: MultiModalInput) {
  const content: any[] = [];

  if (input.imageBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: input.imageBase64 } });
  }

  let textPart = input.text ?? '';
  if (input.audioFilePath) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(input.audioFilePath),
      model: 'whisper-1',
    });
    textPart = \`\${textPart}\n\${transcription.text}\`.trim();
  }
  content.push({ type: 'text', text: textPart });

  return content; // ready to pass directly into a single model request
}
\`\`\`

**Why every principle from this course still applies unmodified to
multi-modal features:** cost and latency (Module 10) now needs to
account for image tokens and audio duration alongside text tokens;
reliability (Module 11) still requires validating whatever structured
output the model produces, regardless of how many modalities fed into
generating it; security (Module 12) still requires treating any
model output as untrusted before acting on it, whether that output was
derived from a vision request, an audio request, or both. Multi-modal
features are not a separate category requiring new principles — they're
this course's existing principles applied across a richer set of
inputs.`,

    simpleHi: `**Core distinction jo ye lesson establish karta hai — modalities ko
EK reasoning step mein combine karna versus modalities ko SEPARATE,
disconnected steps mein process karna:**

\`\`\`
WEAK multi-modal design: image analysis run karo, ek text summary
paao; audio transcription run karo, ek text summary paao; phir DONO
text summaries ko ek final text-only reasoning step mein feed karo.
Har translation pe information lost hoti hai, aur final reasoning step
kabhi original image ya audio nahi dekhta.

STRONG multi-modal design: image aur transcribed audio question ko
WAHI reasoning request mein pass karo, model ko dono pe directly
reason karne dete hue, un details ko preserve karte hue jo ek lossy
intermediate summary drop kar deta.
\`\`\`

**Ek concrete example — "mere photo aur mere spoken description ke
basis pe is product mein kya galat hai," vision aur audio-derived
text ko EK request mein combine karte hue:**

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'fs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function diagnoseProductIssue(imageBase64: string, audioFilePath: string) {
  // Step 1: audio -> text (ek pure modality conversion, Lesson 2 ke hisaab se)
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });

  // Step 2: image AUR transcribed question SAATH reason kiye gaye,
  // ek request mein — ye genuinely multi-modal step hai
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: \`Customer's spoken description: "\${transcription.text}"\n\nBased on the photo AND this description, what's likely wrong with the product?\` },
      ],
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : null;
}
\`\`\`

**Ye genuinely image aur audio ko separately analyze karke aur text
summaries ko baad mein merge karke se ek behtar answer kyun produce
karta hai:**

\`\`\`
Agar image akeli analyze ki jaati, visible damage ka ek generic
description result ho sakta tha. Agar audio akela transcribe aur
reason kiya jaata, sirf wahi consider kiya jaata jo customer ne
explicitly kaha. DONO ko saath reason karke, model ek photo mein ek
detail (ek specific crack location) ko speech mein ek detail se
connect kar sakta hai (customer describe kar raha hai KAB issue shuru
hua) jise koi bhi modality akele connected ki tarah surface nahi
karti — ye actual value hai jo genuine multi-modal reasoning
independently-processed modalities baad mein merged se zyada add
karta hai.
\`\`\`

**Ek concrete architectural pattern — ek single multi-modal function
signature jo modalities ka jo bhi combination ek specific feature
genuinely chahta hai accept karta hai, ek rigid one-size-fits-all
pipeline ke bajaye:**

\`\`\`ts
interface MultiModalInput {
  text?: string;
  imageBase64?: string;
  audioFilePath?: string;
}

async function buildMultiModalContent(input: MultiModalInput) {
  const content: any[] = [];

  if (input.imageBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: input.imageBase64 } });
  }

  let textPart = input.text ?? '';
  if (input.audioFilePath) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(input.audioFilePath),
      model: 'whisper-1',
    });
    textPart = \`\${textPart}\n\${transcription.text}\`.trim();
  }
  content.push({ type: 'text', text: textPart });

  return content; // directly ek single model request mein pass karne ke liye ready
}
\`\`\`

**Is course ka har principle multi-modal features pe abhi bhi bina
modification ke kyun apply hota hai:** cost aur latency (Module 10)
ko ab text tokens ke saath image tokens aur audio duration ko account
karna hai; reliability (Module 11) ko abhi bhi jo bhi structured
output model produce karta hai use validate karna chahiye, chahe kitni
bhi modalities ne ise generate karne mein feed kiya ho; security
(Module 12) ko abhi bhi kisi bhi model output ko untrusted treat karna
chahiye uspe act karne se pehle, chahe wo output ek vision request se,
ek audio request se, ya dono se derived ho. Multi-modal features ek
separate category nahi hain jinhe naye principles chahiye — ye is
course ke existing principles hain jo inputs ke ek richer set ke
across applied hain.`,

    content: `## Why fusing modalities in a single reasoning step produces
genuinely better results than analyzing them separately and merging
text summaries afterward

Analyzing an image alone and an audio transcript alone, then combining
their independently-generated text summaries, forces information
through two lossy translation steps before the final reasoning happens
— any detail one modality's summary omits is permanently unavailable
to the final step, even if it would have been directly relevant when
considered alongside the other modality's raw content. Passing the
image and the transcribed text into the SAME reasoning request lets the
model draw connections between a specific visual detail and a specific
spoken detail that neither modality's independent summary would have
flagged as related — a customer's photo showing a crack in one
specific location, combined with their spoken mention of when the
product started making noise, can point to a diagnosis that neither
piece of information alone would suggest.

## Why a flexible multi-modal input pattern is architecturally better
than a rigid, fixed pipeline

A feature's actual modality needs vary — one interaction might involve
only text, another text plus an image, another all three. Designing a
single function that accepts whatever combination of modalities a
specific call actually provides (converting audio to text internally
when present, including an image block when present) is more robust
and maintainable than maintaining separate, rigid pipelines for every
possible combination of inputs, and it directly reflects how real
multi-modal interactions actually vary in practice.

## Why every principle from earlier in this course remains fully
applicable, requiring extension rather than replacement

Module 10's cost and latency discipline extends naturally: a
multi-modal request's cost now includes image tokens and/or audio
duration alongside text tokens, but the underlying practice (estimate
before launch, monitor actual costs) is unchanged. Module 11's
reliability discipline extends naturally too: whatever structured
output a multi-modal request produces still requires the same schema
validation and retry logic, regardless of how many modalities
contributed to generating it. Module 12's security discipline extends
as well: model output derived from an image or audio input is exactly
as untrusted as output derived from pure text, and must be sanitized
before being used in any downstream system. This is the core insight
closing this module: multi-modal AI isn't a separate discipline
requiring new principles, it's this course's existing principles
applied to a genuinely richer set of inputs.

## How this lesson completes Module 15

Lesson 1 established vision as a first-class input modality, distinct
from and more direct than legacy computer-vision pipelines. Lesson 2
established that transcription and synthesis are genuinely different,
specialized capabilities with their own latency and cost
characteristics. This lesson ties both together with the module's
central practical claim: the value of multi-modal AI isn't in
supporting multiple input types as separate, disconnected features —
it's in fusing them into a single coherent reasoning step wherever a
real user need genuinely spans more than one modality, while every
other principle this course has already established continues to
apply without modification.`,

    contentHi: `## Modalities ko ek single reasoning step mein fuse karna unhe separately analyze karke aur text summaries ko baad mein merge karke se genuinely behtar results kyun produce karta hai

Ek image ko akele aur ek audio transcript ko akele analyze karna, phir
unke independently-generated text summaries ko combine karna,
information ko do lossy translation steps ke through force karta hai
final reasoning hone se pehle — koi bhi detail jise ek modality ka
summary omit karta hai permanently unavailable ho jaati hai final step
ke liye, even agar ye directly relevant hoti jab doosri modality ke
raw content ke saath consider ki jaati. Image aur transcribed text ko
WAHI reasoning request mein pass karna model ko ek specific visual
detail aur ek specific spoken detail ke beech connections draw karne
deta hai jise koi bhi modality ka independent summary related ki tarah
flag nahi karega — ek customer ki photo ek specific location mein ek
crack dikhate hue, unke spoken mention ke saath ki product kab noise
karna shuru kiya, ek diagnosis ki taraf point kar sakta hai jo koi bhi
piece of information akele suggest nahi karega.

## Ek flexible multi-modal input pattern ek rigid, fixed pipeline se architecturally behtar kyun hai

Ek feature ki actual modality needs vary karti hain — ek interaction
mein sirf text involve ho sakta hai, doosre mein text plus ek image,
doosre mein sab teen. Ek single function design karna jo modalities ka
jo bhi combination ek specific call actually provide karta hai accept
karta hai (audio ko internally text mein convert karte hue jab present
ho, ek image block include karte hue jab present ho) separate, rigid
pipelines ko har possible combination of inputs ke liye maintain karne
se zyada robust aur maintainable hai, aur ye directly reflect karta hai
ki real multi-modal interactions actually practice mein kaise vary
karte hain.

## Is course ke earlier part se har principle poori tarah applicable kyun rehta hai, replacement ke bajaye extension maangte hue

Module 10 ka cost aur latency discipline naturally extend hota hai:
ek multi-modal request ki cost ab text tokens ke saath image tokens
aur/ya audio duration include karti hai, par underlying practice
(launch se pehle estimate karo, actual costs monitor karo) unchanged
hai. Module 11 ka reliability discipline bhi naturally extend hota
hai: jo bhi structured output ek multi-modal request produce karta hai
abhi bhi wahi schema validation aur retry logic chahiye, chahe kitni
bhi modalities ne ise generate karne mein contribute kiya ho. Module
12 ka security discipline bhi extend hota hai: ek image ya audio input
se derived model output exactly utna hi untrusted hai jitna pure text
se derived output, aur kisi bhi downstream system mein use hone se
pehle sanitize kiya jaana chahiye. Yahi core insight hai jo is module
ko close karta hai: multi-modal AI ek separate discipline nahi hai
jise naye principles chahiye, ye is course ke existing principles hain
jo inputs ke ek genuinely richer set pe applied hain.

## Ye lesson Module 15 ko kaise complete karta hai

Lesson 1 ne vision ko ek first-class input modality ki tarah establish
kiya, legacy computer-vision pipelines se distinct aur zyada direct.
Lesson 2 ne establish kiya ki transcription aur synthesis genuinely
different, specialized capabilities hain apni khud ki latency aur cost
characteristics ke saath. Ye lesson dono ko is module ke central
practical claim ke saath tie karta hai: multi-modal AI ki value
multiple input types ko separate, disconnected features ki tarah
support karne mein nahi hai — ye unhe ek single coherent reasoning
step mein fuse karne mein hai jahan bhi ek real user need genuinely
ek se zyada modality ko span karti hai, jabki is course ka har doosra
principle jo already establish kiya gaya hai bina modification ke
apply hona continue karta hai.`,

    examples: [
      {
        title: 'A flexible multi-modal support-ticket triage function accepting any combination of text, image, and audio',
        titleHi: 'Ek flexible multi-modal support-ticket triage function jo text, image, aur audio ka koi bhi combination accept karta hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'fs';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TriageSchema = z.object({
  category: z.enum(['billing', 'technical', 'shipping', 'other']),
  urgency: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
});

async function triageSupportTicket({ text, imageBase64, audioFilePath }) {
  const content = [];

  if (imageBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } });
  }

  let combinedText = text ?? '';
  if (audioFilePath) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1',
    });
    combinedText = \`\${combinedText}\n\${transcription.text}\`.trim();
  }

  content.push({
    type: 'text',
    text: \`\${combinedText}\n\nCategorize this support ticket as JSON: {"category": "billing"|"technical"|"shipping"|"other", "urgency": "low"|"medium"|"high", "summary": string}. Return ONLY JSON.\`,
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content }],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return TriageSchema.parse(JSON.parse(rawText));
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'fs';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TriageSchema = z.object({
  category: z.enum(['billing', 'technical', 'shipping', 'other']),
  urgency: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
});

type TriageResult = z.infer<typeof TriageSchema>;

interface TicketInput {
  text?: string;
  imageBase64?: string;
  audioFilePath?: string;
}

async function triageSupportTicket({ text, imageBase64, audioFilePath }: TicketInput): Promise<TriageResult> {
  const content: any[] = [];

  if (imageBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } });
  }

  let combinedText = text ?? '';
  if (audioFilePath) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1',
    });
    combinedText = \`\${combinedText}\n\${transcription.text}\`.trim();
  }

  content.push({
    type: 'text',
    text: \`\${combinedText}\n\nCategorize this support ticket as JSON: {"category": "billing"|"technical"|"shipping"|"other", "urgency": "low"|"medium"|"high", "summary": string}. Return ONLY JSON.\`,
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content }],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return TriageSchema.parse(JSON.parse(rawText));
}`,
        code: `// Works with any combination — text only, text+image, or text+image+audio
await triageSupportTicket({ text: "My package arrived damaged" });
await triageSupportTicket({ imageBase64: photoOfDamagedBox, audioFilePath: voiceNote });`,
        output:
          "The same function handles a text-only ticket, a ticket with a photo attached, or a ticket with both a photo and a voice note — each combination is fused into a single reasoning request, and the output is validated against the same Zod schema regardless of which modalities were actually present.",
        explain:
          "This example demonstrates the lesson's core architectural point: rather than separate pipelines for text-only, image-only, or audio-included tickets, one flexible function builds whatever content array the available modalities require and reasons over all of them together in a single request.",
        explainHi:
          "Ye example lesson ke core architectural point ko demonstrate karta hai: text-only, image-only, ya audio-included tickets ke liye separate pipelines ke bajaye, ek flexible function jo bhi content array available modalities ko chahiye build karta hai aur unhe saath ek single request mein reason karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Processing image and audio SEPARATELY, then merging lossy text
// summaries in a final, disconnected reasoning step
async function diagnoseIssueWrong(imageBase64, audioFilePath) {
  const imageDescription = await describeImageAlone(imageBase64); // "a plastic case with a small crack"
  const audioSummary = await transcribeAndSummarize(audioFilePath); // "customer mentions a noise"

  // The final reasoning step never sees the actual image or audio —
  // only two independently-generated, potentially lossy text summaries
  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: \`Image shows: \${imageDescription}. Audio says: \${audioSummary}. Diagnose the issue.\` }],
  });
}`,
        right: `// Fusing the image and the transcribed audio into ONE reasoning
// request, letting the model connect details across both directly
async function diagnoseIssueRight(imageBase64, audioFilePath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-1',
  });

  return await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: \`Customer says: "\${transcription.text}"\n\nDiagnose the issue using both the photo and this description.\` },
      ],
    }],
  });
}`,
        why: "Generating separate, independent summaries of the image and the audio before the final reasoning step permanently discards any detail each summary happened to omit — the model reasoning over the actual image and the actual transcribed text together can draw connections neither independent summary would have preserved.",
        whyHi:
          "Image aur audio ke separate, independent summaries generate karna final reasoning step se pehle kisi bhi detail ko permanently discard karta hai jise har summary omit karta hai — model jo actual image aur actual transcribed text pe saath reason karta hai wo connections draw kar sakta hai jise koi bhi independent summary preserve nahi karega.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce returns-processing feature redesigned its damage-claim review from a two-stage pipeline (separate image classification, then separate text-based reason coding) into a single multi-modal request combining the customer's photo and their written description, measurably reducing misclassified claims that had resulted from details visible in the photo not making it into the text-only reasoning stage.",
        hi: 'Ek production e-commerce returns-processing feature ne apna damage-claim review redesign kiya ek two-stage pipeline (separate image classification, phir separate text-based reason coding) se ek single multi-modal request mein jo customer ki photo aur unke written description ko combine karta hai, measurably un misclassified claims ko kam karte hue jo photo mein visible details text-only reasoning stage tak na pahunchne se result hue the.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does reasoning over an image and transcribed audio together in one request produce better results than generating separate text summaries of each and combining those?',
        qHi: 'Ek image aur transcribed audio pe ek request mein saath reason karna dono ke separate text summaries generate karke unhe combine karne se behtar results kyun produce karta hai?',
        a: "Generating an independent summary of each modality forces information through a lossy translation step before final reasoning — any detail a summary happens to omit becomes permanently unavailable. Reasoning over the actual image and the actual transcribed text together in one request lets the model connect specific details across both that neither independent summary would have flagged as related.",
        aHi: 'Har modality ka ek independent summary generate karna information ko ek lossy translation step ke through force karta hai final reasoning se pehle — koi bhi detail jise ek summary omit karta hai permanently unavailable ban jaati hai. Actual image aur actual transcribed text pe ek request mein saath reason karna model ko specific details ko dono ke across connect karne deta hai jise koi bhi independent summary related ki tarah flag nahi karega.',
      },
      {
        q: "Why is multi-modal AI best understood as an extension of this course's earlier principles rather than a separate discipline requiring new ones?",
        qHi: 'Multi-modal AI ko is course ke earlier principles ka ek extension ki tarah samajhna best kyun hai, ek separate discipline nahi jise naye principles chahiye?',
        a: "Cost/latency (Module 10) still applies, just with image tokens and audio duration added to the accounting. Reliability (Module 11) still requires the same schema validation and retries regardless of input modality. Security (Module 12) still requires treating model output as untrusted regardless of whether it came from a vision or audio request. The core disciplines are unchanged — they're applied to a richer set of inputs.",
        aHi: 'Cost/latency (Module 10) abhi bhi apply hota hai, sirf accounting mein image tokens aur audio duration add ki gayi. Reliability (Module 11) ko abhi bhi wahi schema validation aur retries chahiye input modality se independently. Security (Module 12) ko abhi bhi model output ko untrusted treat karna chahiye chahe ye ek vision ya audio request se aaya ho. Core disciplines unchanged hain — wo inputs ke ek richer set pe applied hain.',
      },
    ],

    exercises: [
      {
        task: "A team builds a feature where a user photographs a whiteboard and separately types a question about it, but the team's implementation runs OCR on the photo first, feeds the extracted text (alone) into a summary step, and only then combines that summary with the user's typed question in a final text-only request. Identify what's lost in this pipeline and propose the fix this lesson's principle would suggest.",
        taskHi: 'Ek team ek feature banati hai jahan ek user ek whiteboard ki photo kheenchta hai aur separately uske baare mein ek question type karta hai, par team ka implementation pehle photo pe OCR run karta hai, extracted text ko (akele) ek summary step mein feed karta hai, aur sirf tab us summary ko user ke typed question ke saath ek final text-only request mein combine karta hai. Identify karo ki is pipeline mein kya lost hota hai aur is lesson ka principle jo fix suggest karega use propose karo.',
        hint: "Think about what a whiteboard's photo contains beyond just the text on it — diagram layout, arrows, groupings — and whether an OCR-then-summarize step would preserve any of that.",
        hintHi: 'Socho ki ek whiteboard ki photo mein us pe likhe text se aage kya hota hai — diagram layout, arrows, groupings — aur kya ek OCR-then-summarize step usme se koi bhi preserve karega.',
      },
    ],

    keyTakeaways: [
      "Fusing modalities in a single reasoning step (the image and transcribed text together, in one request) produces measurably better results than analyzing each modality separately and merging lossy text summaries afterward.",
      "A flexible function accepting whatever combination of modalities a feature genuinely needs is architecturally better than maintaining rigid, separate pipelines for every possible input combination.",
      "Every principle from earlier in this course extends naturally to multi-modal features — cost/latency accounting now includes image tokens and audio duration, but the underlying discipline is unchanged.",
      "Multi-modal AI is this course's existing principles (Modules 10, 11, 12) applied to a richer set of inputs, not a separate discipline requiring new ones — closing Module 15's three-lesson arc from vision to audio to genuine fusion.",
    ],
    keyTakeawaysHi: [
      'Modalities ko ek single reasoning step mein fuse karna (image aur transcribed text saath, ek request mein) unhe separately analyze karke aur lossy text summaries ko baad mein merge karke se measurably behtar results produce karta hai.',
      'Ek flexible function jo modalities ka jo bhi combination ek feature genuinely chahta hai accept karta hai rigid, separate pipelines maintain karne se architecturally behtar hai har possible input combination ke liye.',
      'Is course ke earlier part se har principle naturally multi-modal features tak extend hota hai — cost/latency accounting ab image tokens aur audio duration include karti hai, par underlying discipline unchanged hai.',
      'Multi-modal AI is course ke existing principles (Modules 10, 11, 12) hain jo inputs ke ek richer set pe applied hain, ek separate discipline nahi jise naye chahiye — Module 15 ke teen-lesson arc ko vision se audio se genuine fusion tak close karte hue.',
    ],
  },
];
