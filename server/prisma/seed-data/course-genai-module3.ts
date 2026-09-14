/**
 * Generative AI Complete Course — Module 3: Prompt Engineering Fundamentals, lessons 1-3.
 *
 * Lesson 1: Zero-shot vs few-shot prompting.
 * Lesson 2: Chain-of-thought and role/system prompting.
 * Lesson 3: JSON mode, prompt templates, and why this is applied context design.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-zero-shot-vs-few-shot-prompting',
    title: 'Zero-Shot vs Few-Shot Prompting',
    titleHi: 'Zero-Shot vs Few-Shot Prompting',
    description:
      "The most direct application of Module 1's attention mechanism: giving a model a few worked examples of the exact task before asking it to do the task itself measurably improves output quality, because those examples become part of the sequence attention weighs when generating the actual answer.",
    descriptionHi:
      'Module 1 ke attention mechanism ka sabse direct application: ek model ko task khud karne ke liye poochne se pehle exact task ke kuch worked examples dena measurably output quality improve karta hai, kyunki wo examples us sequence ka hissa ban jaate hain jise attention actual answer generate karte waqt weigh karta hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: "**Handing a new employee a task description alone versus handing them the same description plus three real, correctly completed examples of that exact kind of task from last week.** A capable new hire given only \"format this report the way we like it\" has to guess at exactly what \"the way we like it\" means — margins, tone, level of detail, all inferred from a vague instruction. The same hire given the instruction PLUS three actual finished reports the team has approved before will almost certainly produce something much closer to what's wanted on the first try, because the examples make the implicit standard explicit and concrete. A model works the same way: told only \"summarize this in a formal tone,\" it has to guess what \"formal\" means for your specific purposes; shown two or three example summaries that ARE what you consider formal, it has direct, concrete evidence of the target pattern to match, not just a word to interpret.",
      hi: 'Ek naye employee ko sirf ek task description dena versus unhe wahi description plus pichhle hafte ke us exact kism ke task ke teen real, correctly completed examples dena. Ek capable naya hire jise sirf "is report ko us tareeke se format karo jaise hume pasand hai" diya gaya use exactly guess karna padta hai ki "jaise hume pasand hai" ka matlab kya hai — margins, tone, detail ka level, sab ek vague instruction se infer kiya gaya. Wahi hire jise instruction PLUS teen actual finished reports diye gaye jo team ne pehle approve kiye hain almost certainly kuch aisa produce karega jo pehli try mein chahiye gayi cheez ke bahut zyada close hoga, kyunki examples implicit standard ko explicit aur concrete banate hain. Ek model wahi tarike se kaam karta hai: sirf "ise ek formal tone mein summarize karo" bataya gaya, ise guess karna padta hai ki aapke specific purposes ke liye "formal" ka matlab kya hai; do ya teen example summaries dikhaye gaye jo WAHI hain jise aap formal maante ho, iske paas target pattern match karne ke liye direct, concrete evidence hai, sirf ek word interpret karne ke liye nahi.',
    },

    simple: `**Zero-shot — asking directly, with no worked examples:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [
    { role: 'user', content: 'Classify the sentiment of this review: "The battery life is disappointing, but the screen is gorgeous." ' },
  ],
});
// The model has to infer, purely from the word "Classify" and its own
// general training, exactly what output FORMAT and granularity you want
// — "Mixed"? "Negative"? "3/5 stars"? "Mostly negative, some positive"?
\`\`\`

**Few-shot — showing the model exactly what a correct answer looks
like, using real worked examples:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [
    { role: 'user', content: 'Classify the sentiment: "Terrible service, cold food."' },
    { role: 'assistant', content: 'Negative' },
    { role: 'user', content: 'Classify the sentiment: "Loved everything about this place!"' },
    { role: 'assistant', content: 'Positive' },
    { role: 'user', content: 'Classify the sentiment: "It was fine, nothing special."' },
    { role: 'assistant', content: 'Neutral' },
    { role: 'user', content: 'Classify the sentiment: "The battery life is disappointing, but the screen is gorgeous."' },
  ],
});
// Now the model has THREE concrete examples of the exact input/output
// pattern wanted (a single word: Negative/Positive/Neutral) — attention
// (Module 1, Lesson 2) can directly weigh this pattern when generating
// the answer to the fourth, real question.
\`\`\`

**Why this measurably works, tied directly to Module 1's mechanism:**
those example turns aren't "training" the model in any permanent sense
— they're literally part of the sequence the model conditions its next
tokens on for THIS one request, exactly as Lesson 1 of Module 2
established. The model's attention mechanism can directly weigh "the
last three times I saw this exact pattern, the answer was a single
category word" when deciding what shape of answer to produce this time.

**When zero-shot is enough, and when few-shot earns its extra tokens
(and therefore extra cost — Module 2, Lesson 3):**

\`\`\`
Zero-shot is usually enough when:
  - The task is common and well-represented in what the model learned
    from (basic translation, well-known factual questions)
  - The desired output format is unambiguous from the instruction alone

Few-shot earns its cost when:
  - The desired output format/style is specific to YOUR use case (a
    particular category taxonomy, a particular tone, a particular
    level of detail) that isn't obvious from words alone
  - Consistency across many calls matters more than the extra input
    tokens the examples cost
  - Early zero-shot attempts produce inconsistent or wrong-shaped output
\`\`\`

**A genuine tradeoff, not a strictly-better technique:** every example
added is real tokens, in every single request, forever (Module 2's cost
math applies directly) — few-shot isn't "always better," it's a
deliberate trade of extra, recurring cost for higher consistency and
accuracy on a specific, well-defined task shape.`,

    simpleHi: `**Zero-shot — directly poochna, koi worked examples ke bina:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [
    { role: 'user', content: 'Classify the sentiment of this review: "The battery life is disappointing, but the screen is gorgeous." ' },
  ],
});
// Model ko infer karna padta hai, purely "Classify" word se aur apni
// khud ki general training se, exactly ki aap kaunsa output FORMAT aur
// granularity chahte ho — "Mixed"? "Negative"? "3/5 stars"? "Mostly
// negative, some positive"?
\`\`\`

**Few-shot — model ko exactly dikhana ki ek correct answer kaisa dikhta
hai, real worked examples use karke:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [
    { role: 'user', content: 'Classify the sentiment: "Terrible service, cold food."' },
    { role: 'assistant', content: 'Negative' },
    { role: 'user', content: 'Classify the sentiment: "Loved everything about this place!"' },
    { role: 'assistant', content: 'Positive' },
    { role: 'user', content: 'Classify the sentiment: "It was fine, nothing special."' },
    { role: 'assistant', content: 'Neutral' },
    { role: 'user', content: 'Classify the sentiment: "The battery life is disappointing, but the screen is gorgeous."' },
  ],
});
// Ab model ke paas chahi gayi exact input/output pattern ke TEEN
// concrete examples hain (ek single word: Negative/Positive/Neutral)
// — attention (Module 1, Lesson 2) is pattern ko directly weigh kar
// sakta hai jab fourth, real question ka answer generate kar raha hai.
\`\`\`

**Ye measurably kyun kaam karta hai, directly Module 1 ke mechanism se
tied:** wo example turns model ko kisi bhi permanent sense mein
"train" nahi kar rahe — wo literally us sequence ka hissa hain jispe
model apne agle tokens ko IS ek request ke liye condition karta hai,
exactly jaise Module 2 ke Lesson 1 ne establish kiya. Model ka attention
mechanism directly "pichhli teen baar jab maine ye exact pattern dekha,
answer ek single category word tha" ko weigh kar sakta hai jab decide
kar raha hai ki is baar kis shape ka answer produce kare.

**Zero-shot kab kaafi hai, aur few-shot kab apne extra tokens (aur is
liye extra cost — Module 2, Lesson 3) deserve karta hai:**

\`\`\`
Zero-shot usually kaafi hai jab:
  - Task common hai aur model jisse seekha usme well-represented hai
    (basic translation, well-known factual questions)
  - Desired output format sirf instruction se hi unambiguous hai

Few-shot apna cost tab deserve karta hai jab:
  - Desired output format/style aapke specific use case ke liye specific
    hai (ek particular category taxonomy, ek particular tone, ek
    particular level of detail) jo sirf words se obvious nahi hai
  - Kai calls ke across consistency extra input tokens se zyada matter
    karti hai jo examples cost karte hain
  - Early zero-shot attempts inconsistent ya wrong-shaped output produce
    karte hain
\`\`\`

**Ek genuine tradeoff, ek strictly-better technique nahi:** add kiya
gaya har example real tokens hai, har single request mein, hamesha
(Module 2 ka cost math directly apply hota hai) — few-shot "hamesha
better" nahi hai, ye ek deliberate trade hai extra, recurring cost ka
higher consistency aur accuracy ke liye ek specific, well-defined task
shape pe.`,

    content: `## Why few-shot examples work through the exact same mechanism as
everything else in this course

There is no separate "few-shot learning mode" the model switches into —
example turns are literally messages in the same array Module 2
established, and the model's generation process (Module 1) conditions
on them exactly as it would any other prior turn. What makes them
effective isn't a special mechanism; it's that they make an otherwise
implicit target pattern (the desired output format, tone, or
granularity) explicit and directly present in the sequence attention can
weigh, rather than something the model has to infer purely from an
instruction's wording.

## Why the number and quality of examples matters more than simply
"more is better"

Two or three well-chosen examples that clearly illustrate the target
pattern, including any edge cases the task will realistically encounter
(a mixed-sentiment review, not just clearly positive/negative ones), are
more effective than many redundant examples that all illustrate the same
easy case. Since every example is real input tokens paid for on every
single call (Module 2's cost math), the practical goal is the smallest
set of examples that clearly disambiguates the target pattern — not the
largest set that could conceivably be included.

## Why zero-shot remains the right default, not something to
automatically upgrade

Adding few-shot examples to every prompt "just in case" is a real,
recurring cost with no benefit when the task is already unambiguous —
correctly translating a well-known phrase, or answering a widely
documented factual question, rarely needs worked examples to produce a
reliable format. The judgment call this lesson asks you to make
practically is diagnostic: try zero-shot first, and reach for few-shot
specifically when zero-shot's output format or consistency is
genuinely inadequate for the task's actual requirements.

## How this connects forward to structured outputs and evaluation

Module 6's structured-output techniques often combine naturally with
few-shot examples — showing the model two or three examples of the exact
JSON shape wanted is frequently more reliable than describing that shape
in prose alone. And Module 14's evaluation practices depend on exactly
this same principle in reverse: a golden dataset of correct
input/output pairs, used to test a system, is structurally identical to
a set of few-shot examples — the same "concrete example teaches the
pattern better than an abstract description" idea, used for verification
rather than generation.`,

    contentHi: `## Few-shot examples exact wahi mechanism se kyun kaam karte hain jo is course mein baaki sab kuch

Koi separate "few-shot learning mode" nahi hai jismein model switch hota
hai — example turns literally us wahi array mein messages hain jo Module
2 ne establish kiya, aur model ka generation process (Module 1) unhe
exactly condition karta hai jaise ye kisi bhi doosre prior turn ko
karega. Unhe effective kya banata hai koi special mechanism nahi hai; ye
hai ki wo ek otherwise implicit target pattern (desired output format,
tone, ya granularity) ko explicit aur directly us sequence mein present
banate hain jise attention weigh kar sakta hai, kisi aisi cheez ke bajaye
jise model ko purely ek instruction ki wording se infer karna pade.

## Examples ki number aur quality "zyada better hai" se zyada kyun matter karti hai

Do ya teen well-chosen examples jo target pattern ko clearly illustrate
karte hain, kisi bhi edge cases samet jo task realistically encounter
karega (ek mixed-sentiment review, sirf clearly positive/negative wale
nahi), kai redundant examples se zyada effective hain jo sab wahi easy
case illustrate karte hain. Kyunki har example har single call pe pay
kiya gaya real input tokens hai (Module 2 ka cost math), practical goal
examples ka sabse chhota set hai jo target pattern ko clearly
disambiguate karta hai — sabse bada set nahi jo conceivably include kiya
ja sakta hai.

## Zero-shot correct default kyun rehta hai, kuch aisa nahi jise automatically upgrade karna hai

Har prompt mein "just in case" few-shot examples add karna ek real,
recurring cost hai bina kisi benefit ke jab task already unambiguous
hai — ek well-known phrase ko correctly translate karna, ya ek widely
documented factual question ka answer dena, rarely worked examples ki
zaroorat rakhta hai ek reliable format produce karne ke liye. Judgment
call jo ye lesson aapse practically karne ko poochta hai diagnostic hai:
pehle zero-shot try karo, aur few-shot ke liye specifically tab reach
karo jab zero-shot ka output format ya consistency task ki actual
requirements ke liye genuinely inadequate ho.

## Ye forward structured outputs aur evaluation se kaise connect karta hai

Module 6 ki structured-output techniques aksar naturally few-shot
examples ke saath combine hoti hain — model ko exact JSON shape ke do ya
teen examples dikhana aksar wo shape prose mein describe karne se zyada
reliable hota hai. Aur Module 14 ki evaluation practices exactly wahi
principle pe reverse mein depend karti hain: correct input/output pairs
ka ek golden dataset, ek system test karne ke liye use kiya gaya,
structurally few-shot examples ke ek set ke identical hai — wahi
"concrete example abstract description se pattern better sikhata hai"
idea, generation ke bajaye verification ke liye use kiya gaya.`,

    examples: [
      {
        title: 'A few-shot prompt that disambiguates a company-specific classification scheme zero-shot couldn\'t infer',
        titleHi: 'Ek few-shot prompt jo ek company-specific classification scheme ko disambiguate karta hai jo zero-shot infer nahi kar sakta tha',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// This company categorizes support tickets into THEIR OWN specific
// taxonomy — not a generic one a model could guess from the word alone
async function classifyTicket(ticketText) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20,
    messages: [
      { role: 'user', content: 'Categorize: "My package arrived damaged."' },
      { role: 'assistant', content: 'Shipping-Damage' },
      { role: 'user', content: 'Categorize: "I was charged twice for one order."' },
      { role: 'assistant', content: 'Billing-Duplicate' },
      { role: 'user', content: 'Categorize: "The app crashes when I upload a photo."' },
      { role: 'assistant', content: 'Bug-Mobile' },
      { role: 'user', content: \`Categorize: "\${ticketText}"\` },
    ],
  });
  return response.content[0].text.trim();
}

console.log(await classifyTicket('The tracking number shows delivered but I never got it.'));
// -> "Shipping-Lost" (a NEW category, but the model infers the naming
// PATTERN — Domain-Specific — from the three examples, not a category
// zero-shot prompting could reliably have guessed the exact naming for)`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// This company categorizes support tickets into THEIR OWN specific
// taxonomy — not a generic one a model could guess from the word alone
async function classifyTicket(ticketText: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20,
    messages: [
      { role: 'user', content: 'Categorize: "My package arrived damaged."' },
      { role: 'assistant', content: 'Shipping-Damage' },
      { role: 'user', content: 'Categorize: "I was charged twice for one order."' },
      { role: 'assistant', content: 'Billing-Duplicate' },
      { role: 'user', content: 'Categorize: "The app crashes when I upload a photo."' },
      { role: 'assistant', content: 'Bug-Mobile' },
      { role: 'user', content: \`Categorize: "\${ticketText}"\` },
    ],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return block.text.trim();
}

console.log(await classifyTicket('The tracking number shows delivered but I never got it.'));
// -> "Shipping-Lost" (a NEW category, but the model infers the naming
// PATTERN — Domain-Specific — from the three examples, not a category
// zero-shot prompting could reliably have guessed the exact naming for)`,
        code: `const messages = [
  { role: 'user', content: 'Categorize: "My package arrived damaged."' },
  { role: 'assistant', content: 'Shipping-Damage' },
  { role: 'user', content: 'Categorize: "I was charged twice for one order."' },
  { role: 'assistant', content: 'Billing-Duplicate' },
  { role: 'user', content: \`Categorize: "\${ticketText}"\` },
];`,
        output:
          "\"Shipping-Lost\" — the model correctly infers both the general naming pattern (Category-Subcategory, hyphenated, no article words) AND the specific domain (shipping) from the three examples, producing a well-formed new category even though this exact ticket text was never shown as an example.",
        explain:
          "Zero-shot prompting for this same task would produce wildly inconsistent formatting across calls (\"Lost package\", \"shipping_lost\", \"Category: Lost Shipment\") since there's no way for the model to infer this company's specific naming convention from the word \"categorize\" alone — the few-shot examples make that convention concrete and directly attendable to.",
        explainHi:
          "Isi task ke liye zero-shot prompting calls ke across wildly inconsistent formatting produce karega (\"Lost package\", \"shipping_lost\", \"Category: Lost Shipment\") kyunki model ke paas is company ki specific naming convention ko sirf \"categorize\" word se infer karne ka koi tareeka nahi hai — few-shot examples us convention ko concrete aur directly attendable banate hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adding few-shot examples to every single prompt "to be safe,"
// even for an unambiguous, well-known task
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 50,
  messages: [
    { role: 'user', content: 'Translate to French: "Hello"' },
    { role: 'assistant', content: 'Bonjour' },
    { role: 'user', content: 'Translate to French: "Goodbye"' },
    { role: 'assistant', content: 'Au revoir' },
    { role: 'user', content: 'Translate to French: "Thank you"' },
  ],
});
// Basic translation is well-represented and unambiguous — these
// examples cost real tokens on EVERY call for zero measurable benefit.`,
        right: `// Using zero-shot for a task that's already unambiguous
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 50,
  messages: [
    { role: 'user', content: 'Translate to French: "Thank you"' },
  ],
});
// "Merci" is produced reliably without examples — reserve few-shot's
// extra, recurring token cost for tasks that genuinely need it.`,
        why: "Every example turn is real input tokens paid for on every single call, permanently. For a task that's already unambiguous from the instruction alone, few-shot examples add ongoing cost with no measurable improvement in output quality or consistency.",
        whyHi:
          "Har example turn har single call pe, permanently, real input tokens hai jo pay kiya jata hai. Ek task ke liye jo already sirf instruction se unambiguous hai, few-shot examples output quality ya consistency mein koi measurable improvement ke bina ongoing cost add karte hain.",
      },
    ],

    realWorld: [
      {
        en: "A production content-moderation system uses few-shot examples specifically because the company's exact line between 'borderline' and 'violating' content is a nuanced, company-specific judgment call that a zero-shot prompt describing the policy in prose alone produces inconsistent decisions on — three or four carefully chosen boundary-case examples measurably tighten consistency across thousands of daily moderation calls.",
        hi: 'Ek production content-moderation system specifically few-shot examples use karta hai kyunki \'borderline\' aur \'violating\' content ke beech company ki exact line ek nuanced, company-specific judgment call hai jispe ek zero-shot prompt jo policy ko sirf prose mein describe karta hai inconsistent decisions produce karta hai — teen ya chaar carefully chosen boundary-case examples hazaron daily moderation calls ke across consistency ko measurably tighten karte hain.',
      },
    ],

    interviewQA: [
      {
        q: "Mechanically, why does showing a model a few worked examples of a task improve its output, rather than the model somehow 'learning' something permanent from them?",
        qHi: 'Mechanically, ek model ko ek task ke kuch worked examples dikhana uske output ko kyun improve karta hai, model ke unse kisi tarah kuch permanent \'seekhne\' ke bajaye?',
        a: "The examples are literally part of the message sequence the model conditions its next tokens on for that one request — nothing permanent changes about the model itself. Attention (Module 1) can directly weigh the pattern demonstrated by the examples when generating the answer to the actual question, making an otherwise implicit target format explicit and concrete rather than something the model has to guess at from an instruction's wording alone.",
        aHi: 'Examples literally us message sequence ka hissa hain jispe model apne agle tokens ko condition karta hai us ek request ke liye — model ke baare mein khud kuch permanent nahi badalta. Attention (Module 1) directly examples dwara demonstrate kiye gaye pattern ko weigh kar sakta hai jab actual question ka answer generate kar raha hai, ek otherwise implicit target format ko explicit aur concrete banate hue ek instruction ki wording se guess karne ke bajaye.',
      },
      {
        q: 'When does few-shot prompting genuinely earn its extra token cost compared to zero-shot?',
        qHi: 'Few-shot prompting zero-shot ke comparison mein genuinely apna extra token cost kab deserve karta hai?',
        a: "When the desired output format, style, or category scheme is specific to a particular use case in a way that isn't obvious from the instruction's wording alone, and consistency across many calls matters. For common, well-represented, unambiguous tasks, zero-shot is usually sufficient and few-shot's recurring cost adds no measurable benefit.",
        aHi: 'Jab desired output format, style, ya category scheme ek particular use case ke liye specific hai ek aise tareeke se jo sirf instruction ki wording se obvious nahi hai, aur kai calls ke across consistency matter karti hai. Common, well-represented, unambiguous tasks ke liye, zero-shot usually sufficient hai aur few-shot ka recurring cost koi measurable benefit add nahi karta.',
      },
    ],

    exercises: [
      {
        task: "A team's zero-shot prompt for extracting a person's name and job title from a bio paragraph sometimes returns 'Name: X, Title: Y' and sometimes returns a full sentence like 'The person's name is X and they work as Y.' Explain, using this lesson's reasoning, why this inconsistency happens and how few-shot examples would fix it.",
        taskHi: 'Ek team ka zero-shot prompt ek bio paragraph se ek insaan ka naam aur job title extract karne ke liye kabhi \'Name: X, Title: Y\' return karta hai aur kabhi ek poora sentence jaise \'The person\'s name is X and they work as Y.\' Is lesson ki reasoning use karke explain karo ki ye inconsistency kyun hoti hai aur few-shot examples ise kaise fix karenge.',
        hint: "Think about what specifically is ambiguous about the zero-shot instruction, and what a worked example would make explicit that the instruction's wording alone doesn't.",
        hintHi: 'Socho ki zero-shot instruction ke baare mein specifically kya ambiguous hai, aur ek worked example kya explicit banayega jo instruction ki wording akele nahi banati.',
      },
    ],

    keyTakeaways: [
      "Few-shot examples work through the exact same mechanism as everything else in this course — they're literal messages in the sequence the model conditions its next tokens on, making an implicit target pattern explicit rather than triggering a special 'learning mode.'",
      'The practical goal is the smallest set of well-chosen examples (including realistic edge cases) that clearly disambiguates the target pattern — not the largest set that could conceivably be included.',
      'Zero-shot remains the right default for common, unambiguous tasks; few-shot earns its recurring token cost specifically when the desired output format/style is use-case-specific and consistency across many calls matters.',
      'This same principle — a concrete example teaches a pattern more reliably than an abstract description — recurs later for structured-output prompting (Module 6) and evaluation datasets (Module 14).',
    ],
    keyTakeawaysHi: [
      'Few-shot examples exact wahi mechanism se kaam karte hain jo is course mein baaki sab kuch — wo us sequence mein literal messages hain jispe model apne agle tokens ko condition karta hai, ek implicit target pattern ko explicit banate hue ek special \'learning mode\' trigger karne ke bajaye.',
      'Practical goal well-chosen examples ka sabse chhota set hai (realistic edge cases samet) jo target pattern ko clearly disambiguate karta hai — sabse bada set nahi jo conceivably include kiya ja sakta hai.',
      'Zero-shot common, unambiguous tasks ke liye correct default rehta hai; few-shot apna recurring token cost specifically tab deserve karta hai jab desired output format/style use-case-specific ho aur kai calls ke across consistency matter kare.',
      'Ye wahi principle — ek concrete example ek pattern ko ek abstract description se zyada reliably sikhata hai — baad mein structured-output prompting (Module 6) aur evaluation datasets (Module 14) ke liye recur hota hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-chain-of-thought-and-role-prompting',
    title: 'Chain-of-Thought & Role/System Prompting',
    titleHi: 'Chain-of-Thought Aur Role/System Prompting',
    description:
      "Why explicitly asking a model to 'think step by step' measurably improves accuracy on multi-step problems — a direct, testable consequence of Module 1's mechanism — and how role/system prompting shapes behavior consistently across an entire conversation.",
    descriptionHi:
      "Ek model ko explicitly 'step by step socho' bolna multi-step problems pe accuracy ko measurably kyun improve karta hai — Module 1 ke mechanism ka ek direct, testable consequence — aur role/system prompting behavior ko poori conversation ke across consistently kaise shape karta hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A student asked to show their work on a multi-step math problem versus one asked to just write the final number.** A student who jumps straight to a final answer on a multi-step problem has no intermediate checkpoints — an error made in step two silently propagates into every later step with nothing to catch it, and the student (or a grader) can't tell where reasoning went wrong. A student who writes out each step has to commit to each intermediate conclusion explicitly, in order, which both makes errors more visible (to a grader, and often to the student themselves mid-solution) and, importantly, makes each step build correctly on a step that was itself written down and available to check against — not held loosely in the head. A model asked to \"think step by step\" is put in exactly the second position: because each generated token is produced by conditioning on everything generated so far (Module 1), writing out intermediate reasoning steps means the FINAL answer is generated while conditioned on those explicit intermediate steps, rather than having to arrive at a complex multi-step conclusion in a single, unbroken leap.",
      hi: 'Ek student jise ek multi-step math problem pe apna kaam dikhane ko kaha gaya versus ek jise bas final number likhne ko kaha gaya. Ek student jo ek multi-step problem pe directly final answer pe jump karta hai uske paas koi intermediate checkpoints nahi hain — step two mein ki gayi ek error silently har baad wale step mein propagate ho jaati hai bina kisi cheez ke jo ise catch kare, aur student (ya ek grader) bata nahi sakta ki reasoning kahan galat gayi. Ek student jo har step likhta hai use har intermediate conclusion ko explicitly, order mein commit karna padta hai, jo dono errors ko zyada visible banata hai (ek grader ke liye, aur aksar student khud ke liye mid-solution) aur, importantly, har step ko ek aise step pe correctly build karne deta hai jo khud likha gaya tha aur against check karne ke liye available tha — sirf head mein loosely hold nahi kiya gaya. Ek model jise "step by step socho" bola gaya exactly doosri position mein rakha gaya hai: kyunki har generated token ab tak jo bhi generate hua uspe condition karke produce hota hai (Module 1), intermediate reasoning steps likhna matlab hai FINAL answer un explicit intermediate steps pe conditioned hote hue generate hota hai, ek complex multi-step conclusion tak ek single, unbroken leap mein pahunchne ke bajaye.',
    },

    simple: `**Chain-of-thought — asking for reasoning steps before the final
answer, and why it works:**

\`\`\`ts
// Without chain-of-thought — the model jumps straight to an answer
const response1 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 50,
  messages: [{ role: 'user', content:
    'A store had 120 apples. It sold 35% on Monday and 20% of what remained on Tuesday. How many apples are left?'
  }],
});
// Higher chance of a silent arithmetic slip with no intermediate check

// With chain-of-thought — explicitly asking for steps first
const response2 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  messages: [{ role: 'user', content:
    'A store had 120 apples. It sold 35% on Monday and 20% of what remained on Tuesday. How many apples are left? Work through this step by step, then give the final answer.'
  }],
});
// The model generates: "Monday: 120 * 0.35 = 42 sold, 78 remain.
// Tuesday: 78 * 0.20 = 15.6 sold, 78 - 15.6 = 62.4 remain."
// — each step is generated CONDITIONED ON the previous step being
// explicitly present in the sequence, per Module 1's mechanism.
\`\`\`

**Why this isn't a trick — it's a direct, testable consequence of
next-token prediction:** Module 1 established that every token is
predicted from the sequence so far. Asking for a direct final answer to
a multi-step problem means that final answer's tokens are generated
while conditioning on nothing but the ORIGINAL QUESTION — the model has
to implicitly do all the intermediate reasoning "in one shot" during
generation of that answer, with no explicit intermediate result to
condition later steps on. Asking for steps first means each subsequent
token (including the final answer) is generated while conditioning on
the actual written-out intermediate results — mechanically similar to
the difference between a person doing complex mental math versus writing
each step on paper as they go.

**Role/system prompting — a different lever, controlling standing
behavior rather than a single answer's reasoning:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  system: 'You are a senior backend engineer reviewing a pull request. Be direct and specific about issues; do not soften criticism with unnecessary praise.',
  messages: [{ role: 'user', content: pullRequestDiff }],
});
// The system role (Module 2, Lesson 1) shapes HOW every response in
// this conversation is generated — tone, level of directness, implicit
// standards for what counts as worth flagging — consistently across
// every turn, not just this one message.
\`\`\`

**Why these are two genuinely different techniques, often combined:**
chain-of-thought is a per-question technique for improving accuracy on
a specific multi-step problem; role/system prompting is a
whole-conversation technique for shaping consistent behavior, tone, or
persona. A production code-review assistant might combine both: a
system prompt establishing "you are a senior engineer, be direct" PLUS
a per-request instruction to "reason through the change's correctness
step by step before giving your verdict" — the two levers control
genuinely different things and compose naturally.`,

    simpleHi: `**Chain-of-thought — final answer se pehle reasoning steps mangna,
aur ye kyun kaam karta hai:**

\`\`\`ts
// Chain-of-thought ke bina — model directly ek answer pe jump karta hai
const response1 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 50,
  messages: [{ role: 'user', content:
    'A store had 120 apples. It sold 35% on Monday and 20% of what remained on Tuesday. How many apples are left?'
  }],
});
// Ek silent arithmetic slip ka higher chance koi intermediate check ke bina

// Chain-of-thought ke saath — explicitly pehle steps mangte hue
const response2 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 300,
  messages: [{ role: 'user', content:
    'A store had 120 apples. It sold 35% on Monday and 20% of what remained on Tuesday. How many apples are left? Work through this step by step, then give the final answer.'
  }],
});
// Model generate karta hai: "Monday: 120 * 0.35 = 42 sold, 78 remain.
// Tuesday: 78 * 0.20 = 15.6 sold, 78 - 15.6 = 62.4 remain."
// — har step CONDITIONED ON generate hota hai us previous step pe jo
// sequence mein explicitly present hai, Module 1 ke mechanism ke hisaab se.
\`\`\`

**Ye ek trick kyun nahi hai — ye next-token prediction ka ek direct,
testable consequence hai:** Module 1 ne establish kiya ki har token ab
tak ki sequence se predict hota hai. Ek multi-step problem ka ek direct
final answer maangna matlab hai us final answer ke tokens generate hote
hain kuch bhi condition karte hue nahi sirf ORIGINAL QUESTION pe — model
ko saare intermediate reasoning ko implicitly "ek shot mein" karna padta
hai us answer ke generation ke dauran, bina kisi explicit intermediate
result ke jispe baad ke steps condition karein. Pehle steps maangna
matlab hai har subsequent token (final answer samet) actual written-out
intermediate results pe condition karte hue generate hota hai —
mechanically similar hai ek insaan ke complex mental math karne aur jaise
jaise aage badhta hai har step paper pe likhne ke beech ke difference se.

**Role/system prompting — ek alag lever, standing behavior control
karta hai, ek single answer ki reasoning nahi:**

\`\`\`ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 500,
  system: 'You are a senior backend engineer reviewing a pull request. Be direct and specific about issues; do not soften criticism with unnecessary praise.',
  messages: [{ role: 'user', content: pullRequestDiff }],
});
// System role (Module 2, Lesson 1) shape karta hai ki is conversation
// mein har response KAISE generate hota hai — tone, directness ka
// level, implicit standards ki kya flag karne layak hai — consistently
// har turn ke across, sirf ye ek message nahi.
\`\`\`

**Ye do genuinely alag techniques kyun hain, aksar combined:**
chain-of-thought ek per-question technique hai ek specific multi-step
problem pe accuracy improve karne ke liye; role/system prompting ek
whole-conversation technique hai consistent behavior, tone, ya persona
shape karne ke liye. Ek production code-review assistant dono combine
kar sakta hai: ek system prompt establish karte hue "you are a senior
engineer, be direct" PLUS ek per-request instruction "change ki
correctness ko step by step reason karo verdict dene se pehle" — do
levers genuinely alag cheezein control karte hain aur naturally compose
karte hain.`,

    content: `## Why "think step by step" is a direct consequence of Module 1's
mechanism, not an incantation

There's nothing magical about the phrase itself — what matters is what
it causes to be generated: explicit intermediate reasoning steps that
become part of the sequence subsequent tokens (including the final
answer) condition on. Compare this to a direct-answer request, where the
model must produce a correct multi-step conclusion's tokens while
conditioning on nothing but the original question — every bit of
implicit intermediate reasoning has to happen "invisibly" within the
generation of that single answer, with no explicit checkpoint the
process can build on. Writing out the steps converts an implicit,
unchecked reasoning process into an explicit sequence of conditioning
points, which measurably reduces errors on tasks with several
dependent steps.

## Why chain-of-thought helps more on some tasks than others

A task that's genuinely single-step (a direct factual lookup, a simple
classification) has no intermediate reasoning to make explicit, so
chain-of-thought adds tokens and cost with little or no accuracy
benefit. A task with several genuinely dependent steps (a multi-step
calculation, a logic puzzle, a "does A imply B, and does B imply C"
argument) benefits substantially, because each step's correctness can be
verified against — and can build on — the actual written intermediate
result rather than an invisible internal one. Recognizing which category
a given task falls into is the practical skill, not applying chain-of-
thought reflexively to everything.

## Why the system role is the correct place for standing behavioral
instructions, extending Module 2's message-role lesson

Module 2 established that the system role shapes behavior across an
entire conversation and is typically weighted more consistently than an
equivalent instruction in a user turn. Role-prompting (giving the model
a persona — "you are a senior security engineer," "you are a patient
tutor for a beginner") is a specific, common application of this: it
establishes a consistent frame for tone, level of assumed expertise in
responses, and what kind of issues get flagged or emphasized, applied
uniformly across every turn without needing to repeat the instruction
each time.

## Why these two techniques compose rather than compete

Chain-of-thought and role prompting operate on different axes — one
shapes the reasoning PROCESS behind a single answer, the other shapes
the standing BEHAVIOR across a whole conversation. A production system
combining both (a system prompt establishing persona and standards, plus
a per-request instruction to reason step by step before concluding) is
using each lever for what it's actually good at, rather than treating
prompt engineering as a single undifferentiated bag of tricks.`,

    contentHi: `## "Step by step socho" Module 1 ke mechanism ka ek direct consequence kyun hai, koi incantation nahi

Phrase khud mein kuch bhi magical nahi hai — kya matter karta hai wo
generate hone ke liye kya cause karta hai: explicit intermediate
reasoning steps jo us sequence ka hissa ban jaate hain jispe subsequent
tokens (final answer samet) condition karte hain. Ise ek direct-answer
request se compare karo, jahan model ko ek correct multi-step
conclusion ke tokens produce karne padte hain kuch bhi condition karte
hue nahi sirf original question pe — implicit intermediate reasoning ka
har bit us single answer ke generation ke andar "invisibly" hona padta
hai, bina kisi explicit checkpoint ke jispe process build kar sake.
Steps likhna ek implicit, unchecked reasoning process ko conditioning
points ki ek explicit sequence mein convert karta hai, jo kai dependent
steps wali tasks pe errors ko measurably kam karta hai.

## Chain-of-thought kuch tasks pe doosri se zyada kyun help karta hai

Ek task jo genuinely single-step hai (ek direct factual lookup, ek
simple classification) ke paas explicit banane ke liye koi intermediate
reasoning nahi hai, isliye chain-of-thought tokens aur cost add karta
hai bina kisi ya bahut kam accuracy benefit ke. Ek task jiske paas kai
genuinely dependent steps hain (ek multi-step calculation, ek logic
puzzle, ek "kya A B ko imply karta hai, aur kya B C ko imply karta hai"
argument) substantially benefit karta hai, kyunki har step ki correctness
verify ki ja sakti hai — aur build ki ja sakti hai — actual written
intermediate result ke against ek invisible internal wale ke bajaye. Ye
recognize karna ki ek given task kaunsi category mein aata hai practical
skill hai, chain-of-thought ko har cheez pe reflexively apply karna
nahi.

## System role standing behavioral instructions ke liye correct jagah kyun hai, Module 2 ke message-role lesson ko extend karte hue

Module 2 ne establish kiya ki system role poori conversation ke across
behavior ko shape karta hai aur typically ek equivalent instruction se
zyada consistently weighted hota hai jo ek user turn mein hai.
Role-prompting (model ko ek persona dena — "you are a senior security
engineer," "you are a patient tutor for a beginner") iska ek specific,
common application hai: ye tone ke liye ek consistent frame establish
karta hai, responses mein assumed expertise ka level, aur kis kism ke
issues flag ya emphasize hote hain, har turn ke across uniformly apply
kiya gaya bina har baar instruction repeat karne ki zaroorat ke.

## Ye do techniques compose kyun karte hain compete nahi

Chain-of-thought aur role prompting alag axes pe operate karte hain —
ek ek single answer ke peeche reasoning PROCESS ko shape karta hai,
doosra poori conversation ke across standing BEHAVIOR ko shape karta
hai. Ek production system jo dono combine karta hai (ek system prompt
jo persona aur standards establish karta hai, plus ek per-request
instruction step by step reason karne ke liye conclude karne se pehle)
har lever ko us cheez ke liye use kar raha hai jiske liye ye actually
achha hai, prompt engineering ko tricks ka ek single undifferentiated
bag treat karne ke bajaye.`,

    examples: [
      {
        title: 'Combining a system-level persona with per-request chain-of-thought for a code review assistant',
        titleHi: 'Ek code review assistant ke liye ek system-level persona ko per-request chain-of-thought ke saath combine karna',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function reviewPullRequest(diff) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 800,
    // ROLE PROMPTING — shapes behavior across this whole review
    system: 'You are a senior backend engineer reviewing a pull request for a production payments system. Be direct and specific; do not soften real issues with unnecessary praise.',
    messages: [{
      role: 'user',
      content: \`Review this diff. First, reason step by step through what
the change does and any edge cases it might affect. Then give your
final verdict as APPROVE, REQUEST_CHANGES, or COMMENT.

Diff:
\${diff}\`,
      // CHAIN-OF-THOUGHT — shapes the reasoning process for THIS answer
    }],
  });
  return response.content[0].text;
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function reviewPullRequest(diff: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 800,
    // ROLE PROMPTING — shapes behavior across this whole review
    system: 'You are a senior backend engineer reviewing a pull request for a production payments system. Be direct and specific; do not soften real issues with unnecessary praise.',
    messages: [{
      role: 'user',
      content: \`Review this diff. First, reason step by step through what
the change does and any edge cases it might affect. Then give your
final verdict as APPROVE, REQUEST_CHANGES, or COMMENT.

Diff:
\${diff}\`,
      // CHAIN-OF-THOUGHT — shapes the reasoning process for THIS answer
    }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return block.text;
}`,
        code: `const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 800,
  system: 'You are a senior backend engineer reviewing a pull request...',
  messages: [{ role: 'user', content: \`Review this diff. First, reason step by step... Diff: \${diff}\` }],
});`,
        output:
          "A response that first walks through what the diff changes and any edge cases (e.g., \"this removes a null check on line 42 — if the upstream caller can ever pass null here, this will throw\"), THEN concludes with REQUEST_CHANGES — the verdict is generated conditioned on the explicit edge-case reasoning that came before it, not produced as an isolated guess.",
        explain:
          "The system prompt (role) shapes tone and standards for the entire review; the per-request chain-of-thought instruction shapes the reasoning process for this specific verdict. Removing the chain-of-thought instruction would still produce a verdict in the same directness/tone (system prompt still applies), but with a meaningfully higher risk of missing the edge case, since the model would have to reach a verdict without first explicitly reasoning through it.",
        explainHi:
          "System prompt (role) poori review ke liye tone aur standards shape karta hai; per-request chain-of-thought instruction is specific verdict ke liye reasoning process shape karta hai. Chain-of-thought instruction hatane se abhi bhi wahi directness/tone mein ek verdict produce hoga (system prompt abhi bhi apply hota hai), par edge case miss karne ka ek meaningfully higher risk ke saath, kyunki model ko pehle explicitly reason kiye bina ek verdict tak pahunchna padega.",
      },
    ],

    mistakes: [
      {
        wrong: `// Applying chain-of-thought reflexively to a trivial, single-step task
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 200,
  messages: [{ role: 'user', content:
    'What is the capital of Japan? Think through this step by step before answering.'
  }],
});
// There is no genuine multi-step reasoning here — this adds tokens
// and cost for a fact-lookup task with no accuracy benefit.`,
        right: `// Reserving chain-of-thought for tasks with genuine multi-step reasoning
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 50,
  messages: [{ role: 'user', content: 'What is the capital of Japan?' }],
});
// A direct factual lookup doesn't benefit from explicit intermediate
// steps — there's nothing genuinely multi-step to make explicit.`,
        why: "Chain-of-thought helps specifically because it converts implicit multi-step reasoning into explicit, checkable intermediate results the final answer can condition on. A single-step factual lookup has no such intermediate reasoning to expose, so the technique adds cost without the accuracy benefit it provides on genuinely multi-step tasks.",
        whyHi:
          "Chain-of-thought specifically isliye help karta hai kyunki ye implicit multi-step reasoning ko explicit, checkable intermediate results mein convert karta hai jinpe final answer condition kar sakta hai. Ek single-step factual lookup ke paas expose karne ke liye aisi koi intermediate reasoning nahi hai, isliye technique cost add karti hai us accuracy benefit ke bina jo ye genuinely multi-step tasks pe provide karti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production math-tutoring AI feature always uses chain-of-thought for word problems (multi-step, genuinely benefits from explicit intermediate steps) but skips it entirely for simple vocabulary or definition questions (single-step, no benefit) — the same system dynamically choosing the technique based on the task's actual structure, exactly the judgment call this lesson teaches.",
        hi: 'Ek production math-tutoring AI feature word problems ke liye hamesha chain-of-thought use karta hai (multi-step, genuinely explicit intermediate steps se benefit karta hai) par ise simple vocabulary ya definition questions ke liye poori tarah skip karta hai (single-step, koi benefit nahi) — wahi system task ki actual structure ke basis pe dynamically technique choose karta hai, exactly wo judgment call jo ye lesson sikhata hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does asking a model to 'think step by step' measurably improve accuracy on multi-step problems, mechanically?",
        qHi: "Ek model ko 'step by step socho' bolna multi-step problems pe accuracy ko mechanically measurably kyun improve karta hai?",
        a: "Because every token is generated conditioned on the sequence so far (Module 1), a direct final answer to a multi-step problem must implicitly perform all intermediate reasoning within the generation of that single answer, with no explicit checkpoint. Writing out intermediate steps first converts that implicit reasoning into explicit tokens the final answer can then condition on, which measurably reduces errors on tasks with genuinely dependent steps.",
        aHi: 'Kyunki har token ab tak ki sequence pe conditioned generate hota hai (Module 1), ek multi-step problem ka ek direct final answer implicitly saara intermediate reasoning us single answer ke generation ke andar perform karna chahiye, bina kisi explicit checkpoint ke. Pehle intermediate steps likhna us implicit reasoning ko explicit tokens mein convert karta hai jinpe final answer phir condition kar sakta hai, jo genuinely dependent steps wali tasks pe errors ko measurably kam karta hai.',
      },
      {
        q: 'How do chain-of-thought prompting and role/system prompting differ in what they actually control?',
        qHi: 'Chain-of-thought prompting aur role/system prompting actually kya control karte hain isme kaise alag hain?',
        a: "Chain-of-thought is a per-question technique that shapes the reasoning process leading to a single answer, useful for tasks with genuine multi-step reasoning. Role/system prompting shapes standing behavior — tone, persona, implicit standards — consistently across an entire conversation. They operate on different axes and compose naturally rather than competing.",
        aHi: 'Chain-of-thought ek per-question technique hai jo ek single answer tak le jaane wale reasoning process ko shape karti hai, genuine multi-step reasoning wali tasks ke liye useful. Role/system prompting standing behavior ko shape karta hai — tone, persona, implicit standards — poori conversation ke across consistently. Ye alag axes pe operate karte hain aur naturally compose karte hain compete karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A team applies 'think step by step' to every single prompt in their system, including simple yes/no questions and single-fact lookups, and notices their AI costs have risen without any measurable accuracy improvement. Diagnose why, and describe the rule they should apply instead.",
        taskHi: 'Ek team apne system ke har single prompt pe \'step by step socho\' apply karti hai, simple yes/no questions aur single-fact lookups samet, aur notice karti hai ki unki AI costs badh gayi hain bina kisi measurable accuracy improvement ke. Diagnose karo kyun, aur wo rule describe karo jo unhe iske bajaye apply karna chahiye.',
        hint: "Revisit which category of task chain-of-thought genuinely helps versus which category it adds cost to with no benefit.",
        hintHi: 'Revisit karo ki task ki kaunsi category ko chain-of-thought genuinely help karta hai versus kaunsi category mein ye bina benefit ke cost add karta hai.',
      },
    ],

    keyTakeaways: [
      "Chain-of-thought (\"think step by step\") converts implicit multi-step reasoning into explicit intermediate results that the final answer's tokens can condition on — a direct, mechanistic consequence of Module 1's next-token prediction, not a magic phrase.",
      "It genuinely helps on tasks with several dependent steps, and adds cost with no accuracy benefit on single-step tasks — recognizing which category a task falls into is the practical skill.",
      "Role/system prompting is a different lever: it shapes standing behavior (tone, persona, implicit standards) consistently across an entire conversation, extending Module 2's lesson on what the system role controls.",
      'Chain-of-thought and role prompting compose naturally in production systems — one shapes a single answer\'s reasoning, the other shapes conversation-wide behavior.',
    ],
    keyTakeawaysHi: [
      'Chain-of-thought ("step by step socho") implicit multi-step reasoning ko explicit intermediate results mein convert karta hai jinpe final answer ke tokens condition kar sakte hain — Module 1 ke next-token prediction ka ek direct, mechanistic consequence, koi magic phrase nahi.',
      'Ye genuinely un tasks pe help karta hai jinke paas kai dependent steps hain, aur single-step tasks pe bina accuracy benefit ke cost add karta hai — ye recognize karna ki ek task kaunsi category mein aata hai practical skill hai.',
      'Role/system prompting ek alag lever hai: ye standing behavior (tone, persona, implicit standards) ko poori conversation ke across consistently shape karta hai, Module 2 ke lesson ko extend karte hue ki system role kya control karta hai.',
      'Chain-of-thought aur role prompting production systems mein naturally compose karte hain — ek ek single answer ki reasoning shape karta hai, doosra poori conversation-wide behavior shape karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-json-mode-and-prompt-templates',
    title: 'JSON Mode, Prompt Templates & Why This Is Applied Context Design',
    titleHi: 'JSON Mode, Prompt Templates Aur Ye Applied Context Design Kyun Hai',
    description:
      "A preview of Module 6's structured outputs, reusable prompt templates for building maintainable AI features, and the module-closing synthesis: prompt engineering isn't superstition — every technique covered is a direct, explainable application of Module 1's mechanism.",
    descriptionHi:
      "Module 6 ke structured outputs ka ek preview, maintainable AI features banane ke liye reusable prompt templates, aur module-closing synthesis: prompt engineering superstition nahi hai — cover ki gayi har technique Module 1 ke mechanism ka ek direct, explainable application hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A restaurant kitchen using a printed order ticket with labeled fields (table number, item, modifications, allergies) versus a server shouting a free-form sentence back to the kitchen.** A shouted sentence — \"table six wants the chicken but no onions and one of them has a nut allergy\" — puts the entire burden of correctly parsing structure onto whoever's listening, and a distracted or rushed cook might miss a detail buried in the middle of the sentence. A ticket with clearly labeled fields makes the SAME information unambiguous and mechanically extractable: table number goes in the table number slot, allergy goes in the allergy slot, regardless of how the words happened to be phrased. Asking a model for a free-form paragraph and then trying to extract a specific fact from it is the shouted sentence — asking for a specific, labeled JSON structure is the printed ticket, and a prompt template is the standardized ticket FORM itself, reused correctly for every order instead of being redesigned from scratch each time.",
      hi: 'Ek restaurant kitchen jo ek printed order ticket use karti hai labeled fields ke saath (table number, item, modifications, allergies) versus ek server jo kitchen ko wapas ek free-form sentence chillata hai. Ek shouted sentence — "table six chicken chahta hai par onions nahi aur unme se ek ko nut allergy hai" — structure ko correctly parse karne ka poora burden jo bhi sun raha hai uspe daal deta hai, aur ek distracted ya rushed cook sentence ke beech mein buried ek detail miss kar sakta hai. Clearly labeled fields wala ek ticket WAHI information ko unambiguous aur mechanically extractable banata hai: table number table number slot mein jata hai, allergy allergy slot mein jata hai, chahe words kaise bhi phrase hue hon. Ek model se ek free-form paragraph maangna aur phir usse ek specific fact extract karne ki koshish karna wo shouted sentence hai — ek specific, labeled JSON structure maangna wo printed ticket hai, aur ek prompt template khud wo standardized ticket FORM hai, har order ke liye correctly reuse kiya gaya scratch se redesign karne ke bajaye har baar.',
    },

    simple: `**JSON mode / structured output — a preview of Module 6's full
treatment:**

\`\`\`ts
// Without structure — free text that has to be parsed manually and
// unreliably (does it always say "Sentiment:"? Always this exact case?)
const response1 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Analyze this review and tell me the sentiment and a one-line summary: "Great food, slow service."' }],
});
// -> "The sentiment is mixed — positive about food, negative about
//     service. Summary: Good food undermined by slow service."
// Extracting a clean sentiment VALUE from this prose is fragile.

// With structured output — the shape of the answer is specified upfront
const response2 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [{ role: 'user', content:
    'Analyze this review: "Great food, slow service." Respond with ONLY valid JSON in this exact shape: {"sentiment": "positive" | "negative" | "mixed", "summary": string}'
  }],
});
// -> '{"sentiment": "mixed", "summary": "Good food undermined by slow service."}'
// Directly JSON.parse()-able — Module 6 covers this in full depth,
// including provider-level JSON-mode flags that enforce this reliably.
\`\`\`

**Prompt templates — treating a prompt as a reusable, parameterized
piece of code, not a one-off string:**

\`\`\`ts
function buildSentimentPrompt(reviewText) {
  return \`Analyze this customer review and respond with ONLY valid JSON
in this exact shape: {"sentiment": "positive" | "negative" | "mixed",
"summary": string}

Review: "\${reviewText}"\`;
}

// Reused consistently everywhere sentiment analysis is needed —
// one place to fix a bug or improve the prompt, not many copy-pasted
// near-duplicates scattered across a codebase
const prompt1 = buildSentimentPrompt('Great food, slow service.');
const prompt2 = buildSentimentPrompt('Absolutely loved it!');
\`\`\`

**Why prompt templates matter the same way a reusable component
matters in ordinary software:** a hardcoded prompt string duplicated in
five places means five places to update when the format changes, five
opportunities for the copies to silently drift apart, and five separate
places a bug can hide — exactly the reasoning this platform's own
courses have applied to component reuse (React), function extraction
(JavaScript), and query builders (Databases). A prompt is a real piece
of a system's logic, and deserves the same engineering discipline as
any other piece of logic, not "just some text we typed into an API
call."

**The module-closing synthesis — why none of this is superstition:**

\`\`\`
Zero-shot vs few-shot (Lesson 1): controls what pattern is directly
  present in the sequence attention (Module 1) weighs.

Chain-of-thought (Lesson 2): converts implicit reasoning into explicit
  intermediate tokens the final answer conditions on.

Role/system prompting (Lesson 2): uses the system role's stronger,
  conversation-wide weighting (Module 2) to shape standing behavior.

Structured output (this lesson): specifies the exact SHAPE of the
  sequence the model should generate, making programmatic extraction
  reliable instead of fragile.

Every single one of these is a specific, explainable strategy for
controlling what's in — or how to interpret — the one sequence Module 1
established as the entire input a model ever reasons from. There is no
trick here that isn't a direct consequence of that one mechanism.
\`\`\``,

    simpleHi: `**JSON mode / structured output — Module 6 ke poore treatment ka
ek preview:**

\`\`\`ts
// Structure ke bina — free text jise manually aur unreliably parse
// karna padta hai (kya ye hamesha "Sentiment:" kehta hai? Hamesha yahi
// exact case?)
const response1 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Analyze this review and tell me the sentiment and a one-line summary: "Great food, slow service."' }],
});
// -> "The sentiment is mixed — positive about food, negative about
//     service. Summary: Good food undermined by slow service."
// Is prose se ek clean sentiment VALUE extract karna fragile hai.

// Structured output ke saath — answer ki shape upfront specify ki gayi hai
const response2 = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 100,
  messages: [{ role: 'user', content:
    'Analyze this review: "Great food, slow service." Respond with ONLY valid JSON in this exact shape: {"sentiment": "positive" | "negative" | "mixed", "summary": string}'
  }],
});
// -> '{"sentiment": "mixed", "summary": "Good food undermined by slow service."}'
// Directly JSON.parse()-able — Module 6 ise poori depth mein cover
// karta hai, provider-level JSON-mode flags samet jo ise reliably
// enforce karte hain.
\`\`\`

**Prompt templates — ek prompt ko ek reusable, parameterized piece of
code ki tarah treat karna, ek one-off string nahi:**

\`\`\`ts
function buildSentimentPrompt(reviewText) {
  return \`Analyze this customer review and respond with ONLY valid JSON
in this exact shape: {"sentiment": "positive" | "negative" | "mixed",
"summary": string}

Review: "\${reviewText}"\`;
}

// Hamesha wahin consistently reuse kiya jata hai jahan sentiment
// analysis chahiye — ek bug fix karne ya prompt improve karne ke liye
// ek jagah, kai copy-pasted near-duplicates scattered across a codebase
// nahi
const prompt1 = buildSentimentPrompt('Great food, slow service.');
const prompt2 = buildSentimentPrompt('Absolutely loved it!');
\`\`\`

**Prompt templates wahi tarike se kyun matter karte hain jaise ek
reusable component ordinary software mein matter karta hai:** ek
hardcoded prompt string paanch jagah duplicated matlab hai paanch jagah
update karni hain jab format badalta hai, paanch opportunities copies
ke silently drift apart hone ki, aur paanch separate jagah jahan ek bug
chhup sakta hai — exactly wahi reasoning jo is platform ke apne courses
ne component reuse (React), function extraction (JavaScript), aur query
builders (Databases) ke liye apply ki hai. Ek prompt ek system ke logic
ka ek real piece hai, aur ise wahi engineering discipline deserve karta
hai jo kisi bhi doosre logic ke piece ko, "bas kuch text jo humne ek API
call mein type kiya" nahi.

**Module-closing synthesis — ye sab kuch superstition kyun nahi hai:**

\`\`\`
Zero-shot vs few-shot (Lesson 1): control karta hai ki kaunsa pattern
  directly attention (Module 1) ki sequence mein present hai jise ye weigh karta hai.

Chain-of-thought (Lesson 2): implicit reasoning ko explicit intermediate
  tokens mein convert karta hai jinpe final answer condition karta hai.

Role/system prompting (Lesson 2): system role ki stronger, conversation-
  wide weighting (Module 2) use karta hai standing behavior shape karne ke liye.

Structured output (ye lesson): us sequence ki exact SHAPE specify karta
  hai jo model ko generate karni chahiye, programmatic extraction ko
  reliable banate hue fragile ke bajaye.

In mein se har ek ek specific, explainable strategy hai us ek sequence
mein kya hai — ya use kaise interpret karna hai — control karne ke liye
jise Module 1 ne poore input ki tarah establish kiya jisse ek model
kabhi reason karta hai. Yahan koi trick nahi hai jo us ek mechanism ka
direct consequence na ho.
\`\`\``,

    content: `## Why structured output is a natural extension of everything this
module has covered

Requesting a specific JSON shape is, mechanically, just another way of
shaping the sequence the model generates — the same category of
technique as few-shot examples or chain-of-thought, applied to output
FORMAT rather than reasoning process or content. Instead of leaving the
model to infer an appropriate format from an instruction's wording (the
same ambiguity Lesson 1 identified with zero-shot prompting), specifying
the exact shape upfront removes that inference step entirely, which is
why it produces far more reliable, programmatically-parseable results.
Module 6 covers the full depth of this (JSON-schema-constrained
generation, provider-level enforcement, retry-on-invalid strategies) —
this lesson previews the concept because it's a direct and natural
consequence of the module's core theme.

## Why a prompt deserves to be treated as a maintained piece of code,
not an inline string

A prompt that's duplicated across several call sites, with small
inconsistent variations accumulating over time as different developers
tweak different copies, is the exact same maintenance problem as
duplicated business logic anywhere else in a codebase — a bug fix or
format change has to be found and applied in every copy, and copies
silently drift. Extracting a prompt into a single function (or template)
that every call site uses gives a prompt the same single-source-of-truth
property good engineering practice already expects from any other piece
of logic; there's nothing special about a prompt that exempts it from
this discipline.

## Why "prompt engineering" deserves that name, and isn't superstition
or trial-and-error

Every technique this module covered — few-shot examples, chain-of-
thought, role prompting, structured output — is a specific, mechanistic
strategy for controlling what's actually present in the sequence a model
conditions its generation on (Module 1), or for using a role's
differential weighting (Module 2) to shape behavior. None of these
techniques work by coincidence or by the model being "tricked" — each
one has a clear, testable causal story for why it changes output the way
it does, grounded directly in the mechanism established at the start of
this course. A developer who understands WHY each technique works, not
just that it does, can correctly predict when a new, unencountered
prompting problem calls for one of these techniques versus a genuinely
different solution (like RAG, Module 7, for a problem that's actually
about missing information rather than an ambiguous instruction).

## How this closes the module and opens the next

This module's techniques all operate on a single API call's input. The
next several modules extend the same underlying idea to more complex
systems: streaming a response into a real UI (Module 4) still just
streams the same generated tokens; tool calling (Module 5) extends the
message array with a new kind of turn (a tool result); RAG (Modules 7-8)
is, at its core, a strategy for automatically constructing the right
prompt content from a knowledge base rather than hardcoding it. Nothing
from here forward introduces a new fundamental mechanism — it's this
same sequence-conditioning idea, applied to increasingly sophisticated
systems.`,

    contentHi: `## Structured output is module mein cover ki gayi har cheez ka ek natural extension kyun hai

Ek specific JSON shape request karna, mechanically, sirf us sequence ko
shape karne ka ek aur tareeka hai jise model generate karta hai — wahi
category ki technique jo few-shot examples ya chain-of-thought hai,
reasoning process ya content ke bajaye output FORMAT pe applied. Model
ko ek instruction ki wording se ek appropriate format infer karne ke
liye chhodne ke bajaye (wahi ambiguity jo Lesson 1 ne zero-shot
prompting ke saath identify ki), exact shape ko upfront specify karna us
inference step ko poori tarah hatata hai, yahi wajah hai ki ye kaafi
zyada reliable, programmatically-parseable results produce karta hai.
Module 6 iski poori depth cover karta hai (JSON-schema-constrained
generation, provider-level enforcement, retry-on-invalid strategies) —
ye lesson concept ko preview karta hai kyunki ye module ke core theme ka
ek direct aur natural consequence hai.

## Ek prompt ko code ka ek maintained piece treat karna deserve karta hai kyun, ek inline string nahi

Ek prompt jo kai call sites ke across duplicated hai, chhoti
inconsistent variations ke saath time ke saath accumulate hote hue jaise
alag developers alag copies tweak karte hain, exactly wahi maintenance
problem hai jo kahin aur codebase mein duplicated business logic hai —
ek bug fix ya format change ko har copy mein dhundhna aur apply karna
padta hai, aur copies silently drift karti hain. Ek prompt ko ek single
function (ya template) mein extract karna jise har call site use karta
hai ek prompt ko wahi single-source-of-truth property deta hai jo good
engineering practice already kisi bhi doosre logic ke piece se expect
karti hai; ek prompt mein kuch bhi special nahi hai jo ise is discipline
se exempt kare.

## "Prompt engineering" wo naam deserve kyun karta hai, aur superstition ya trial-and-error nahi hai

Is module ne cover ki har technique — few-shot examples, chain-of-
thought, role prompting, structured output — ek specific, mechanistic
strategy hai us cheez ko control karne ke liye jo actually us sequence
mein present hai jispe ek model apna generation condition karta hai
(Module 1), ya ek role ki differential weighting (Module 2) use karne ke
liye behavior shape karne ke liye. In mein se koi bhi technique
coincidence se ya model ko "trick" kiye jaane se kaam nahi karti — har
ek ke paas ek clear, testable causal story hai ki ye output ko us tarah
kyun badalti hai, is course ke shuru mein establish ki gayi mechanism
mein directly grounded. Ek developer jo samajhta hai KYUN har technique
kaam karti hai, sirf ye ki ye karti hai nahi, correctly predict kar
sakta hai ki ek naya, unencountered prompting problem in techniques mein
se ek ke liye call karta hai versus ek genuinely alag solution (jaise
RAG, Module 7, ek problem ke liye jo actually missing information ke
baare mein hai ek ambiguous instruction ke bajaye).

## Ye module ko kaise close karta hai aur agla kholta hai

Is module ki techniques sab ek single API call ke input pe operate
karti hain. Agle kai modules wahi underlying idea ko zyada complex
systems tak extend karte hain: ek response ko ek real UI mein stream
karna (Module 4) abhi bhi wahi generated tokens ko stream karta hai;
tool calling (Module 5) message array ko ek naye kism ke turn (ek tool
result) ke saath extend karta hai; RAG (Modules 7-8), apne core mein, ek
knowledge base se sahi prompt content automatically construct karne ki
ek strategy hai use hardcode karne ke bajaye. Yahan se aage kuch bhi ek
naya fundamental mechanism introduce nahi karta — ye wahi
sequence-conditioning idea hai, increasingly sophisticated systems pe
applied.`,

    examples: [
      {
        title: 'A reusable prompt template combining structured output with a clear schema description',
        titleHi: 'Ek reusable prompt template jo structured output ko ek clear schema description ke saath combine karta hai',
        codeJs: `// lib/prompts.js — prompts treated as maintained, reusable code
function buildReviewAnalysisPrompt(reviewText) {
  return \`Analyze the following customer review.

Respond with ONLY valid JSON, no other text, in this exact shape:
{
  "sentiment": "positive" | "negative" | "mixed",
  "summary": string,   // one sentence, under 15 words
  "mentionsPricing": boolean
}

Review: "\${reviewText}"\`;
}

// Used consistently everywhere this analysis is needed
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeReview(reviewText) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: buildReviewAnalysisPrompt(reviewText) }],
  });
  return JSON.parse(response.content[0].text); // Module 6 covers the
  // retry-on-invalid strategy needed for the rare malformed response
}

const result = await analyzeReview('Loved the food, but way overpriced for the portion size.');
// { sentiment: 'mixed', summary: 'Good food but overpriced portions.', mentionsPricing: true }`,
        codeTs: `// lib/prompts.ts — prompts treated as maintained, reusable code
function buildReviewAnalysisPrompt(reviewText: string): string {
  return \`Analyze the following customer review.

Respond with ONLY valid JSON, no other text, in this exact shape:
{
  "sentiment": "positive" | "negative" | "mixed",
  "summary": string,   // one sentence, under 15 words
  "mentionsPricing": boolean
}

Review: "\${reviewText}"\`;
}

interface ReviewAnalysis {
  sentiment: 'positive' | 'negative' | 'mixed';
  summary: string;
  mentionsPricing: boolean;
}

// Used consistently everywhere this analysis is needed
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeReview(reviewText: string): Promise<ReviewAnalysis> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: buildReviewAnalysisPrompt(reviewText) }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return JSON.parse(block.text) as ReviewAnalysis; // Module 6 covers the
  // retry-on-invalid strategy needed for the rare malformed response
}

const result = await analyzeReview('Loved the food, but way overpriced for the portion size.');
// { sentiment: 'mixed', summary: 'Good food but overpriced portions.', mentionsPricing: true }`,
        code: `function buildReviewAnalysisPrompt(reviewText) {
  return \`Respond with ONLY valid JSON: {"sentiment": ..., "summary": ..., "mentionsPricing": ...}
Review: "\${reviewText}"\`;
}
const response = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 200, messages: [{ role: 'user', content: buildReviewAnalysisPrompt(reviewText) }] });
return JSON.parse(response.content[0].text);`,
        output:
          "{ sentiment: 'mixed', summary: 'Good food but overpriced portions.', mentionsPricing: true } — a directly usable JavaScript object, reliably shaped the same way every single time this function is called, anywhere in the codebase.",
        explain:
          "buildReviewAnalysisPrompt is used everywhere review analysis is needed, so a future change to the schema (adding a 'language' field, say) happens in exactly one place. This is the same single-source-of-truth discipline this course's earlier modules applied to reusable components and functions, now applied to a prompt.",
        explainHi:
          "buildReviewAnalysisPrompt har jagah use hota hai jahan review analysis chahiye, isliye schema mein ek future change (jaise ek 'language' field add karna) exactly ek jagah hota hai. Ye wahi single-source-of-truth discipline hai jo is course ke earlier modules ne reusable components aur functions ke liye apply ki, ab ek prompt pe applied.",
      },
    ],

    mistakes: [
      {
        wrong: `// The same prompt, hand-typed slightly differently in three places,
// silently drifting apart over time
// In file A:
const promptA = 'Analyze the review and give sentiment + summary as JSON: ' + text;
// In file B (added a week later by a different developer):
const promptB = 'Give me the sentiment and a summary of this review in JSON format: ' + text;
// In file C:
const promptC = 'Return JSON with sentiment and summary fields for: ' + text;
// Three slightly different instructions produce three slightly
// different, INCONSISTENT output shapes — a real, hard-to-trace bug.`,
        right: `// One template function, imported and used everywhere
import { buildReviewAnalysisPrompt } from './lib/prompts';

// File A:
const promptA = buildReviewAnalysisPrompt(text);
// File B:
const promptB = buildReviewAnalysisPrompt(text);
// File C:
const promptC = buildReviewAnalysisPrompt(text);
// One place to fix a bug or improve the prompt; every call site stays
// consistent automatically.`,
        why: "A prompt duplicated across call sites with small variations is the exact same maintenance liability as duplicated business logic anywhere else in a codebase — inconsistencies accumulate silently, and each duplicate is a separate place a bug can hide or a fix can be forgotten.",
        whyHi:
          "Chhoti variations ke saath call sites ke across duplicated ek prompt exactly wahi maintenance liability hai jo kahin aur codebase mein duplicated business logic hai — inconsistencies silently accumulate hoti hain, aur har duplicate ek separate jagah hai jahan ek bug chhup sakta hai ya ek fix bhoola ja sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS product with a dozen different AI-powered features (summarization, classification, extraction) maintains all of its prompts as versioned template functions in one shared module, specifically so a schema or format change to one feature can be reviewed, tested, and rolled out consistently, rather than requiring a search across the codebase for every hand-typed near-duplicate.",
        hi: 'Ek production SaaS product jiske paas ek dozen alag AI-powered features hain (summarization, classification, extraction) apne saare prompts ko versioned template functions ki tarah ek shared module mein maintain karta hai, specifically taaki ek feature mein ek schema ya format change ko consistently review, test, aur roll out kiya ja sake, codebase ke across har hand-typed near-duplicate ke liye ek search karne ki zaroorat ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does requesting a specific JSON shape from a model produce more reliable, programmatically-usable output than asking for a free-text analysis?',
        qHi: 'Ek model se ek specific JSON shape request karna ek free-text analysis maangne se zyada reliable, programmatically-usable output kyun produce karta hai?',
        a: "Free text leaves the model to infer an appropriate output format from the instruction's wording alone, the same ambiguity underlying zero-shot prompting's inconsistency — the resulting prose has no guaranteed structure to reliably extract a value from. Specifying the exact JSON shape upfront removes that inference step, making the output directly and reliably parseable.",
        aHi: 'Free text model ko ek appropriate output format ko sirf instruction ki wording se infer karne ke liye chhodta hai, wahi ambiguity jo zero-shot prompting ki inconsistency ke underlying hai — resulting prose ke paas ek value ko reliably extract karne ke liye koi guaranteed structure nahi hai. Exact JSON shape ko upfront specify karna us inference step ko hatata hai, output ko directly aur reliably parseable banate hue.',
      },
      {
        q: 'Why should a prompt used across multiple call sites be extracted into a shared function rather than duplicated as an inline string?',
        qHi: 'Multiple call sites ke across use hone wale ek prompt ko ek shared function mein extract kyun kiya jaana chahiye ek inline string ki tarah duplicated hone ke bajaye?',
        a: "A duplicated prompt is the same maintenance liability as duplicated business logic anywhere else — copies silently drift apart as different developers make small independent edits, producing inconsistent output shapes that are hard to trace back to their root cause. A shared template function gives the prompt a single source of truth, the same discipline applied to any other reusable piece of logic.",
        aHi: 'Ek duplicated prompt kahin aur duplicated business logic jaisi hi maintenance liability hai — copies silently drift karti hain jaise alag developers chhote independent edits karte hain, inconsistent output shapes produce karte hue jinhe unke root cause tak trace karna mushkil hota hai. Ek shared template function prompt ko ek single source of truth deta hai, wahi discipline jo kisi bhi doosre reusable logic ke piece pe applied hai.',
      },
    ],

    exercises: [
      {
        task: "Summarize, in your own words, why this module's author calls prompt engineering 'applied context design' rather than trial-and-error or superstition. Reference at least two specific techniques from this module and the mechanism each one controls.",
        taskHi: 'Apne khud ke words mein summarize karo ki is module ka author prompt engineering ko \'applied context design\' kyun kehta hai trial-and-error ya superstition ke bajaye. Is module se kam se kam do specific techniques reference karo aur wo mechanism jise har ek control karta hai.',
        hint: "Revisit Module 1's core claim (a model only ever reasons from the sequence it's given) and trace how each technique in this module is a specific strategy for controlling what's in that sequence.",
        hintHi: 'Module 1 ke core claim ko revisit karo (ek model kabhi sirf us sequence se reason karta hai jo use di gayi hai) aur trace karo ki is module ki har technique us sequence mein kya hai control karne ki ek specific strategy kaise hai.',
      },
    ],

    keyTakeaways: [
      "Requesting a specific output shape (structured output, previewed here and covered fully in Module 6) removes the ambiguity of an inferred format, producing reliably parseable results — the same underlying idea as few-shot prompting, applied to format rather than content.",
      'A prompt duplicated across multiple call sites is the same maintenance liability as duplicated business logic anywhere else — extracting it into a reusable template function gives it a single source of truth.',
      "Every technique in this module (few-shot, chain-of-thought, role prompting, structured output) is a specific, explainable strategy for controlling what's present in — or the shape of — the sequence Module 1 established as a model's entire input. None of it is superstition or trial-and-error.",
      "This module's techniques all operate on a single call's input; every subsequent module (streaming, tool calling, RAG, agents) extends the same underlying sequence-conditioning idea to increasingly sophisticated systems, not a new fundamental mechanism.",
    ],
    keyTakeawaysHi: [
      'Ek specific output shape request karna (structured output, yahan preview kiya gaya aur Module 6 mein poori tarah cover kiya gaya) ek inferred format ki ambiguity hatata hai, reliably parseable results produce karte hue — wahi underlying idea jo few-shot prompting hai, content ke bajaye format pe applied.',
      'Multiple call sites ke across duplicated ek prompt kahin aur duplicated business logic jaisi hi maintenance liability hai — ise ek reusable template function mein extract karna ise ek single source of truth deta hai.',
      'Is module ki har technique (few-shot, chain-of-thought, role prompting, structured output) us cheez ko control karne ki ek specific, explainable strategy hai jo us sequence mein present hai — ya uski shape — jise Module 1 ne ek model ke poore input ki tarah establish kiya. Isme se kuch bhi superstition ya trial-and-error nahi hai.',
      'Is module ki techniques sab ek single call ke input pe operate karti hain; har subsequent module (streaming, tool calling, RAG, agents) wahi underlying sequence-conditioning idea ko increasingly sophisticated systems tak extend karta hai, ek naya fundamental mechanism nahi.',
    ],
  },
];
