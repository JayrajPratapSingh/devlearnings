/**
 * Generative AI Complete Course — Module 14: Evaluation & Testing Non-Deterministic Systems, lessons 1-3.
 *
 * Lesson 1: Eval datasets as the actual unit of testing — acceptable-output criteria, not a single expected string.
 * Lesson 2: LLM-as-judge for scoring subjective quality at scale.
 * Lesson 3: Regression testing across model/prompt changes, golden datasets, and human-in-the-loop review.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-eval-datasets-as-the-unit-of-testing',
    title: 'Eval Datasets — the Actual Unit of Testing a Non-Deterministic System',
    titleHi: 'Eval Datasets — Ek Non-Deterministic System Test Karne Ki Actual Unit',
    description:
      "Module 1 established that a model can produce a different, equally valid answer to the same input each time. This lesson covers what that means for testing: assert.equal(actual, expected) genuinely doesn't work, and eval datasets with acceptable-output criteria are what replaces it.",
    descriptionHi:
      'Module 1 ne establish kiya ki ek model wahi input ke liye har baar ek alag, equally valid answer produce kar sakta hai. Ye lesson cover karta hai iska testing ke liye kya matlab hai: assert.equal(actual, expected) genuinely kaam nahi karta, aur acceptable-output criteria wale eval datasets wo hain jo ise replace karte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Grading a math exam with a single fixed answer key versus grading an essay exam, where a good grader has a rubric describing what makes ANY answer acceptable, not one memorized correct essay to compare against word for word.** A math exam with a single numeric answer can be graded by simple, exact comparison — the student's answer either matches the answer key or it doesn't, and this works precisely because there's genuinely only one correct answer. An essay exam is categorically different: two students can write completely different sentences, structure their arguments in entirely different orders, and both deserve full marks, because what actually matters is whether the essay demonstrates certain qualities — a clear thesis, supporting evidence, sound reasoning — not whether it matches some single memorized \"correct\" essay word for word. A good essay grader works from a RUBRIC: a description of the criteria a genuinely good answer satisfies, applied to whatever specific essay is in front of them. Testing an LLM's output is exactly the essay-grading problem, not the math-exam one: Module 1 established that a model can produce many different, equally valid phrasings of a correct answer, so a test that only accepts one exact expected string will incorrectly fail perfectly good answers — what's actually needed is a rubric-like set of acceptable-output criteria, applied to whatever the model happens to produce this time.",
      hi: 'Ek math exam ko ek single fixed answer key se grade karna versus ek essay exam ko grade karna, jahan ek good grader ke paas ek rubric hai jo describe karta hai ki ANY answer ko acceptable kya banata hai, ek memorized correct essay nahi jise word for word compare kiya jaaye. Ek single numeric answer wala ek math exam simple, exact comparison se grade kiya ja sakta hai — student ka answer ya to answer key se match karta hai ya nahi, aur ye precisely isliye kaam karta hai kyunki genuinely sirf ek correct answer hai. Ek essay exam categorically alag hai: do students poori tarah alag sentences likh sakte hain, apne arguments ko poori tarah alag orders mein structure kar sakte hain, aur dono full marks deserve karte hain, kyunki actually jo matter karta hai ye hai ki essay kuch qualities demonstrate karta hai ya nahi — ek clear thesis, supporting evidence, sound reasoning — ye nahi ki ye kisi single memorized "correct" essay se word for word match karta hai. Ek achha essay grader ek RUBRIC se kaam karta hai: criteria ka ek description jo ek genuinely good answer satisfy karta hai, jo bhi specific essay unke saamne hai uspe applied. Ek LLM ke output ko test karna exactly essay-grading problem hai, math-exam wala nahi: Module 1 ne establish kiya ki ek model ek correct answer ke kai alag, equally valid phrasings produce kar sakta hai, isliye ek test jo sirf ek exact expected string accept karta hai perfectly good answers ko incorrectly fail karega — actually jo chahiye wo ek rubric-jaisa set of acceptable-output criteria hai, jo bhi model is baar produce karta hai uspe applied.',
    },

    simple: `**Why traditional assert.equal() genuinely fails for an LLM's
output:**

\`\`\`ts
// This is EXACTLY the wrong mental model — treating a non-deterministic
// generation process (Module 1) as if it were a pure function with one
// correct output
test('summarizes correctly', async () => {
  const summary = await summarizeText(sourceText);
  assert.equal(summary, 'The company reported strong Q3 earnings.');
  // FAILS if the model produces "Q3 earnings were strong for the
  // company" — a DIFFERENT, EQUALLY CORRECT phrasing — because
  // exact-string comparison has no concept of "acceptable variation"
});
\`\`\`

**An eval dataset — a representative set of inputs, each with
acceptable-output CRITERIA, not one fixed expected string:**

\`\`\`ts
const evalCases = [
  {
    input: 'Q3 revenue grew 15% year-over-year, driven by strong cloud sales.',
    criteria: {
      mustMention: ['revenue', '15%'], // key facts that must be present
      mustNotMention: ['loss', 'decline'], // facts that would be actively wrong
      maxLength: 50, // a structural constraint, not a content one
    },
  },
  {
    input: 'The product recall affected 10,000 units due to a safety defect.',
    criteria: {
      mustMention: ['recall', '10,000'],
      mustNotMention: ['minor issue', 'routine'], // would understate severity
      maxLength: 50,
    },
  },
];

function evaluateOutput(output, criteria) {
  const hasRequired = criteria.mustMention.every((term) =>
    output.toLowerCase().includes(term.toLowerCase()),
  );
  const hasForbidden = criteria.mustNotMention.some((term) =>
    output.toLowerCase().includes(term.toLowerCase()),
  );
  const withinLength = output.length <= criteria.maxLength;
  return hasRequired && !hasForbidden && withinLength;
}

async function runEval() {
  let passed = 0;
  for (const testCase of evalCases) {
    const output = await summarizeText(testCase.input);
    if (evaluateOutput(output, testCase.criteria)) passed++;
  }
  console.log(\`\${passed}/\${evalCases.length} eval cases passed\`);
}
\`\`\`

**Why this is a genuinely different unit of testing, not just a looser
assertion:** a traditional unit test asks "does the output exactly
match this one expected value?" An eval asks "does the output satisfy
these acceptable-output PROPERTIES, whatever its exact phrasing happens
to be?" This isn't a workaround or a compromise — it's the correct test
design for a system whose valid output space (Module 1's generation
mechanism) genuinely contains many different acceptable answers, the
same way an essay rubric is the correct grading design for an essay,
not a lesser version of an exact-match answer key.

**Why an eval dataset needs to be genuinely representative, not just a
handful of easy cases:** Module 7's chunking lesson established that a
small, unrepresentative sample misses real failure modes; the same
principle applies here — an eval dataset covering only straightforward,
easy inputs will pass reliably while missing exactly the edge cases
(ambiguous phrasing, unusual formatting, adversarial-looking input) most
likely to reveal a genuine problem. A representative eval dataset
deliberately includes known-difficult cases, not just ones the system
is confident about.

**How this sets up Lesson 2 and Lesson 3:** the mustMention/
mustNotMention criteria in this lesson's examples are simple, mechanical
checks — genuinely useful for concrete, checkable facts, but insufficient
for judging subtler qualities like tone, coherence, or overall quality.
Lesson 2 covers LLM-as-judge for exactly this harder category of
evaluation; Lesson 3 covers running this same eval dataset repeatedly
over time to catch regressions as a prompt or model changes.`,

    simpleHi: `**Traditional assert.equal() ek LLM ke output ke liye genuinely
kyun fail hota hai:**

\`\`\`ts
// Ye EXACTLY galat mental model hai — ek non-deterministic generation
// process (Module 1) ko is tarah treat karna jaise ye ek pure function
// ho ek correct output ke saath
test('summarizes correctly', async () => {
  const summary = await summarizeText(sourceText);
  assert.equal(summary, 'The company reported strong Q3 earnings.');
  // FAILS agar model "Q3 earnings were strong for the company"
  // produce karta hai — ek ALAG, EQUALLY CORRECT phrasing — kyunki
  // exact-string comparison ke paas "acceptable variation" ka koi
  // concept nahi hai
});
\`\`\`

**Ek eval dataset — inputs ka ek representative set, har ek acceptable-
output CRITERIA ke saath, ek fixed expected string nahi:**

\`\`\`ts
const evalCases = [
  {
    input: 'Q3 revenue grew 15% year-over-year, driven by strong cloud sales.',
    criteria: {
      mustMention: ['revenue', '15%'], // key facts jo present hone chahiye
      mustNotMention: ['loss', 'decline'], // facts jo actively galat honge
      maxLength: 50, // ek structural constraint, ek content wala nahi
    },
  },
  {
    input: 'The product recall affected 10,000 units due to a safety defect.',
    criteria: {
      mustMention: ['recall', '10,000'],
      mustNotMention: ['minor issue', 'routine'], // severity understate karega
      maxLength: 50,
    },
  },
];

function evaluateOutput(output, criteria) {
  const hasRequired = criteria.mustMention.every((term) =>
    output.toLowerCase().includes(term.toLowerCase()),
  );
  const hasForbidden = criteria.mustNotMention.some((term) =>
    output.toLowerCase().includes(term.toLowerCase()),
  );
  const withinLength = output.length <= criteria.maxLength;
  return hasRequired && !hasForbidden && withinLength;
}

async function runEval() {
  let passed = 0;
  for (const testCase of evalCases) {
    const output = await summarizeText(testCase.input);
    if (evaluateOutput(output, testCase.criteria)) passed++;
  }
  console.log(\`\${passed}/\${evalCases.length} eval cases passed\`);
}
\`\`\`

**Ye genuinely testing ki ek alag unit kyun hai, sirf ek looser
assertion nahi:** ek traditional unit test poochta hai "kya output
exactly is ek expected value se match karta hai?" Ek eval poochta hai
"kya output in acceptable-output PROPERTIES ko satisfy karta hai, chahe
uski exact phrasing kuch bhi ho?" Ye ek workaround ya ek compromise
nahi hai — ye ek aise system ke liye correct test design hai jiski valid
output space (Module 1 ka generation mechanism) genuinely kai alag
acceptable answers contain karti hai, wahi tarike se jaise ek essay
rubric ek essay ke liye correct grading design hai, ek exact-match
answer key ka ek lesser version nahi.

**Ek eval dataset ko genuinely representative hona kyun chahiye, sirf
muthi bhar easy cases nahi:** Module 7 ke chunking lesson ne establish
kiya ki ek chhota, unrepresentative sample real failure modes miss karta
hai; wahi principle yahan apply hoti hai — ek eval dataset jo sirf
straightforward, easy inputs cover karta hai reliably pass karega jabki
exactly un edge cases (ambiguous phrasing, unusual formatting,
adversarial-looking input) miss karega jinme genuinely ek problem reveal
hone ki sabse zyada likelihood hai. Ek representative eval dataset
deliberately known-difficult cases include karta hai, sirf wo nahi
jinke baare mein system confident hai.

**Ye Lesson 2 aur Lesson 3 ko kaise set up karta hai:** is lesson ke
examples mein mustMention/mustNotMention criteria simple, mechanical
checks hain — concrete, checkable facts ke liye genuinely useful, par
tone, coherence, ya overall quality jaisi subtler qualities judge karne
ke liye insufficient. Lesson 2 exactly is harder category ki evaluation
ke liye LLM-as-judge cover karta hai; Lesson 3 wahi eval dataset ko
repeatedly time ke saath chalana cover karta hai regressions catch karne
ke liye jaise ek prompt ya model badalta hai.`,

    content: `## Why the non-determinism Module 1 established makes
assert.equal() a category error, not just an inconvenience

Module 1 established that a model's generation process predicts the
most plausible next token given a sequence, with the specific token
selected influenced by sampling (Module 2's temperature). This means
two genuinely identical calls can, and often do, produce different
token sequences that are equally valid, equally correct answers. A test
comparing output to a single fixed expected string treats this expected
variation as failure — the test isn't measuring correctness, it's
measuring "did the model happen to produce this exact phrasing," which
is a fundamentally different, far less useful question.

## Why acceptable-output criteria are the correct replacement, not a
lesser substitute

An eval dataset's criteria — required facts, forbidden content,
structural constraints — describe the actual PROPERTY a correct answer
must have, independent of its specific phrasing. This mirrors exactly
how a well-designed essay rubric works: it specifies what a good answer
demonstrates (a clear argument, correct facts, appropriate scope), not
which exact sentences it must contain. This isn't a workaround forced
by the model's imperfection — it's the correct test design for any
system whose valid output space genuinely contains multiple correct
answers, which is precisely what Module 1's mechanism guarantees for
any sufficiently open-ended generation task.

## Why a representative eval dataset matters as much as well-designed
criteria

Even excellent acceptable-output criteria are only as useful as the
inputs they're tested against — an eval dataset consisting only of
simple, unambiguous cases will report high pass rates while never
exercising the genuinely difficult inputs (ambiguous phrasing, edge-case
formatting, adversarial-looking content) most likely to reveal a real
weakness. This directly parallels Module 7, Lesson 3's chunking lesson:
just as a chunking strategy needs to be evaluated against a document's
actual structure rather than an idealized simple case, an eval dataset
needs to genuinely represent the range of real inputs a feature will
actually encounter, deliberately including known-hard cases rather than
only comfortable ones.

## How this lesson's mechanical criteria connect to Lesson 2's
harder evaluation problem

The mustMention/mustNotMention style criteria in this lesson work well
for checkable, factual properties — a specific fact was included, a
specific error was avoided. They don't work for judging subtler
qualities: is this response's TONE appropriate, is its REASONING sound,
is it genuinely HELPFUL rather than merely technically correct. These
qualities require judgment, not mechanical string matching, which is
exactly the gap Lesson 2's LLM-as-judge technique fills — using a
second model call specifically to evaluate the kind of quality this
lesson's simple criteria structurally cannot capture.`,

    contentHi: `## Module 1 ka establish kiya non-determinism assert.equal() ko ek category error kyun banata hai, sirf ek inconvenience nahi

Module 1 ne establish kiya ki ek model ka generation process ek sequence
ko dekhkar sabse plausible agla token predict karta hai, specific token
select hona sampling (Module 2 ka temperature) se influenced hote hue.
Iska matlab hai do genuinely identical calls alag token sequences
produce kar sakti hain, aur aksar karti hain, jo equally valid, equally
correct answers hain. Output ko ek single fixed expected string se
compare karne wala ek test is expected variation ko failure ki tarah
treat karta hai — test correctness measure nahi kar raha, ye measure
kar raha hai "kya model ne ye exact phrasing produce karne ka happen
hua," jo ek fundamentally alag, kaafi kam useful question hai.

## Acceptable-output criteria correct replacement kyun hain, ek lesser substitute nahi

Ek eval dataset ke criteria — required facts, forbidden content,
structural constraints — us actual PROPERTY ko describe karte hain jo
ek correct answer mein honi chahiye, uski specific phrasing se
independently. Ye exactly wahi tarike se mirror karta hai jaise ek
well-designed essay rubric kaam karta hai: ye specify karta hai ki ek
achha answer kya demonstrate karta hai (ek clear argument, correct
facts, appropriate scope), ye nahi ki isme kaunse exact sentences hone
chahiye. Ye model ki imperfection se force kiya gaya ek workaround nahi
hai — ye kisi bhi system ke liye correct test design hai jiski valid
output space genuinely multiple correct answers contain karti hai, jo
exactly wo hai jise Module 1 ka mechanism kisi bhi sufficiently
open-ended generation task ke liye guarantee karta hai.

## Ek representative eval dataset well-designed criteria jitna kyun matter karta hai

Even excellent acceptable-output criteria sirf utne hi useful hain
jitne inputs jinke against test kiye jaate hain — ek eval dataset jo
sirf simple, unambiguous cases pe consist karta hai high pass rates
report karega jabki kabhi genuinely difficult inputs (ambiguous
phrasing, edge-case formatting, adversarial-looking content) ko
exercise nahi karega jinme ek real weakness reveal hone ki sabse zyada
likelihood hai. Ye directly Module 7, Lesson 3 ke chunking lesson ko
parallel karta hai: bilkul jaise ek chunking strategy ko ek document ki
actual structure ke against evaluate kiya jaana chahiye ek idealized
simple case ke bajaye, ek eval dataset ko genuinely un real inputs ki
range represent karni chahiye jinhe ek feature actually encounter
karega, deliberately known-hard cases include karte hue sirf comfortable
wale nahi.

## Is lesson ke mechanical criteria Lesson 2 ke harder evaluation problem se kaise connect karte hain

Is lesson mein mustMention/mustNotMention style criteria checkable,
factual properties ke liye achhi tarah kaam karte hain — ek specific
fact include kiya gaya tha, ek specific error avoid kiya gaya tha. Wo
subtler qualities judge karne ke liye kaam nahi karte: kya is response
ka TONE appropriate hai, kya iski REASONING sound hai, kya ye genuinely
HELPFUL hai sirf technically correct hone ke bajaye. In qualities ko
judgment chahiye, mechanical string matching nahi, jo exactly wo gap
hai jise Lesson 2 ki LLM-as-judge technique fill karti hai — specifically
us kism ki quality evaluate karne ke liye ek second model call use
karte hue jise is lesson ke simple criteria structurally capture nahi
kar sakte.`,

    examples: [
      {
        title: 'A complete eval suite demonstrating why exact-match testing fails and how criteria-based evaluation succeeds',
        titleHi: 'Ek complete eval suite jo demonstrate karta hai ki exact-match testing kyun fail hoti hai aur criteria-based evaluation kaise succeed hoti hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function classifySentiment(review) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment as positive, negative, or mixed: "\${review}"\` }],
  });
  return response.content[0].text.trim();
}

const evalDataset = [
  { input: 'Absolutely loved every part of this experience!', acceptableAnswers: ['positive', 'Positive'] },
  { input: 'Terrible service, would not recommend.', acceptableAnswers: ['negative', 'Negative'] },
  { input: 'Great food but the wait was way too long.', acceptableAnswers: ['mixed', 'Mixed'] },
];

async function runEval() {
  let passed = 0;
  const failures = [];

  for (const testCase of evalDataset) {
    const actual = await classifySentiment(testCase.input);
    const isAcceptable = testCase.acceptableAnswers.some(
      (acceptable) => actual.toLowerCase().includes(acceptable.toLowerCase()),
    );
    if (isAcceptable) {
      passed++;
    } else {
      failures.push({ input: testCase.input, expected: testCase.acceptableAnswers, actual });
    }
  }

  console.log(\`\${passed}/\${evalDataset.length} passed\`);
  if (failures.length > 0) console.log('Failures:', failures);
}

await runEval();`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function classifySentiment(review: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20,
    messages: [{ role: 'user', content: \`Classify sentiment as positive, negative, or mixed: "\${review}"\` }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return block.text.trim();
}

interface EvalCase {
  input: string;
  acceptableAnswers: string[];
}

const evalDataset: EvalCase[] = [
  { input: 'Absolutely loved every part of this experience!', acceptableAnswers: ['positive', 'Positive'] },
  { input: 'Terrible service, would not recommend.', acceptableAnswers: ['negative', 'Negative'] },
  { input: 'Great food but the wait was way too long.', acceptableAnswers: ['mixed', 'Mixed'] },
];

async function runEval(): Promise<void> {
  let passed = 0;
  const failures: { input: string; expected: string[]; actual: string }[] = [];

  for (const testCase of evalDataset) {
    const actual = await classifySentiment(testCase.input);
    const isAcceptable = testCase.acceptableAnswers.some(
      (acceptable) => actual.toLowerCase().includes(acceptable.toLowerCase()),
    );
    if (isAcceptable) {
      passed++;
    } else {
      failures.push({ input: testCase.input, expected: testCase.acceptableAnswers, actual });
    }
  }

  console.log(\`\${passed}/\${evalDataset.length} passed\`);
  if (failures.length > 0) console.log('Failures:', failures);
}

await runEval();`,
        code: `const isAcceptable = testCase.acceptableAnswers.some(
  (acceptable) => actual.toLowerCase().includes(acceptable.toLowerCase()),
);
if (isAcceptable) passed++;
else failures.push({ input: testCase.input, expected: testCase.acceptableAnswers, actual });`,
        output:
          "3/3 passed — even if the model returns 'Positive.' with a trailing period, or 'The sentiment is positive' instead of a bare 'positive', the acceptable-answers check correctly recognizes it as a valid match, unlike a strict assert.equal() which would fail on any of these harmless variations.",
        explain:
          "The evaluation logic explicitly accounts for the kind of surface variation Module 1's mechanism makes inevitable — checking whether the acceptable term appears, rather than demanding an exact string match — which is the concrete difference between a test design that fights the model's non-determinism and one that correctly accounts for it.",
        explainHi:
          "Evaluation logic explicitly us kism ki surface variation ko account karta hai jise Module 1 ka mechanism inevitable banata hai — check karte hue ki kya acceptable term appear hota hai, ek exact string match demand karne ke bajaye — jo ek test design ke beech concrete difference hai jo model ki non-determinism se ladta hai aur ek jo ise correctly account karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using exact string comparison to test an LLM's output
test('classifies sentiment correctly', async () => {
  const result = await classifySentiment('Great food but the wait was too long.');
  assert.equal(result, 'mixed');
  // FAILS if the model returns "Mixed", "The sentiment is mixed.", or
  // any other equally-correct phrasing — the test is measuring exact
  // string match, not actual correctness
});`,
        right: `// Testing against acceptable-output criteria instead
test('classifies sentiment correctly', async () => {
  const result = await classifySentiment('Great food but the wait was too long.');
  const isAcceptable = ['mixed'].some((term) => result.toLowerCase().includes(term));
  assert.ok(isAcceptable, \`Expected a mention of "mixed", got: \${result}\`);
  // Passes regardless of exact phrasing, as long as the actual
  // classification is correct
});`,
        why: "Module 1 established that a model's generation process can produce multiple different, equally valid phrasings of a correct answer. A test using exact string comparison treats this expected variation as failure, when the test's actual goal should be verifying correctness, not verifying a specific phrasing was produced.",
        whyHi:
          "Module 1 ne establish kiya ki ek model ka generation process ek correct answer ki multiple alag, equally valid phrasings produce kar sakta hai. Ek test jo exact string comparison use karta hai is expected variation ko failure ki tarah treat karta hai, jab test ka actual goal correctness verify karna hona chahiye, ek specific phrasing produce hui ye verify karna nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production customer-support AI's test suite evaluates response quality against criteria like 'mentions the correct refund policy timeframe' and 'does not promise something outside company policy' rather than comparing against a single expected response string, since the same correct answer can be phrased dozens of legitimately different ways depending on the specific customer's question.",
        hi: 'Ek production customer-support AI ki test suite response quality ko criteria ke against evaluate karti hai jaise \'correct refund policy timeframe mention karta hai\' aur \'company policy se bahar kuch promise nahi karta\' ek single expected response string se compare karne ke bajaye, kyunki wahi correct answer specific customer ke question ke basis pe dozens of legitimately different tareekon se phrase ki ja sakti hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does using assert.equal() with a single expected string fail as a testing strategy for LLM output?",
        qHi: 'Ek LLM output ke liye testing strategy ki tarah ek single expected string ke saath assert.equal() use karna kyun fail hota hai?',
        a: "Module 1 established that a model's generation process can produce multiple different token sequences that are equally valid, correct answers to the same input. A test requiring an exact string match treats this expected variation as a failure, measuring 'did the model produce this specific phrasing' rather than the actual property that matters: is the answer correct.",
        aHi: 'Module 1 ne establish kiya ki ek model ka generation process wahi input ke liye multiple alag token sequences produce kar sakta hai jo equally valid, correct answers hain. Ek test jo ek exact string match require karta hai is expected variation ko ek failure ki tarah treat karta hai, "kya model ne ye specific phrasing produce ki" measure karte hue us actual property ke bajaye jo matter karti hai: kya answer correct hai.',
      },
      {
        q: 'Why does an eval dataset need to be genuinely representative rather than consisting only of easy, unambiguous cases?',
        qHi: 'Ek eval dataset ko genuinely representative hone ki zaroorat kyun hai sirf easy, unambiguous cases pe consist karne ke bajaye?',
        a: "An eval dataset with only simple, comfortable cases will report high pass rates while never exercising the genuinely difficult inputs (ambiguous phrasing, edge cases, adversarial content) most likely to reveal a real weakness — mirroring Module 7's chunking lesson, where a small, unrepresentative sample misses real failure modes that only surface with a genuinely representative test set.",
        aHi: 'Sirf simple, comfortable cases wala ek eval dataset high pass rates report karega jabki kabhi genuinely difficult inputs (ambiguous phrasing, edge cases, adversarial content) ko exercise nahi karega jinme ek real weakness reveal hone ki sabse zyada likelihood hai — Module 7 ke chunking lesson ko mirror karte hue, jahan ek chhota, unrepresentative sample real failure modes miss karta hai jo sirf ek genuinely representative test set ke saath surface hote hain.',
      },
    ],

    exercises: [
      {
        task: "A team's test suite for an AI-powered email-subject-line generator uses assert.equal() to compare generated subject lines against one fixed expected string per test case, and the tests fail unpredictably even when the generated subject lines look perfectly good to a human reviewer. Using this lesson's reasoning, redesign their testing approach.",
        taskHi: 'Ek team ki test suite ek AI-powered email-subject-line generator ke liye assert.equal() use karti hai generated subject lines ko per test case ek fixed expected string se compare karne ke liye, aur tests unpredictably fail hote hain chahe generated subject lines ek human reviewer ko perfectly good lagen. Is lesson ki reasoning use karke, unki testing approach redesign karo.',
        hint: "Think about what acceptable-output criteria (required elements, forbidden elements, structural constraints) would actually capture 'a good subject line' better than one fixed exact string.",
        hintHi: 'Socho ki kaunse acceptable-output criteria (required elements, forbidden elements, structural constraints) actually "ek achha subject line" ko ek fixed exact string se better capture karenge.',
      },
    ],

    keyTakeaways: [
      "assert.equal() against a single expected string is a category error for testing LLM output, since Module 1's generation mechanism can produce multiple different, equally valid phrasings of a correct answer.",
      "Eval datasets replace exact-match assertions with acceptable-output criteria (required content, forbidden content, structural constraints) — the correct test design for a system with a genuinely valid multi-answer output space, not a lesser substitute.",
      "An eval dataset must be genuinely representative, deliberately including known-difficult cases, since a dataset of only easy cases will report misleadingly high pass rates while missing real failure modes.",
      "Simple, mechanical criteria (mustMention/mustNotMention) work well for checkable facts but can't judge subtler qualities like tone or reasoning — the gap Lesson 2's LLM-as-judge technique addresses.",
    ],
    keyTakeawaysHi: [
      'Ek single expected string ke against assert.equal() LLM output test karne ke liye ek category error hai, kyunki Module 1 ka generation mechanism ek correct answer ki multiple alag, equally valid phrasings produce kar sakta hai.',
      'Eval datasets exact-match assertions ko acceptable-output criteria se replace karte hain (required content, forbidden content, structural constraints) — ek genuinely valid multi-answer output space wale system ke liye correct test design, ek lesser substitute nahi.',
      'Ek eval dataset ko genuinely representative hona chahiye, deliberately known-difficult cases include karte hue, kyunki sirf easy cases wala ek dataset misleadingly high pass rates report karega jabki real failure modes miss karega.',
      'Simple, mechanical criteria (mustMention/mustNotMention) checkable facts ke liye achhi tarah kaam karte hain par tone ya reasoning jaisi subtler qualities judge nahi kar sakte — wo gap jise Lesson 2 ki LLM-as-judge technique address karti hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-llm-as-judge',
    title: 'LLM-as-Judge — Scoring Subjective Quality at Scale',
    titleHi: 'LLM-as-Judge — Scale Par Subjective Quality Score Karna',
    description:
      "Lesson 1's mechanical criteria can't judge tone, coherence, or overall helpfulness. This lesson covers using a second model call specifically to evaluate these subjective qualities at scale, and the specific discipline needed to trust that judgment appropriately.",
    descriptionHi:
      'Lesson 1 ke mechanical criteria tone, coherence, ya overall helpfulness judge nahi kar sakte. Ye lesson in subjective qualities ko scale par evaluate karne ke liye specifically ek second model call use karna cover karta hai, aur us judgment ko appropriately trust karne ke liye zaroori specific discipline.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A restaurant that can mechanically verify a dish contains the correct listed ingredients, but needs an actual trained palate to judge whether it genuinely tastes good.** A checklist can mechanically confirm a dish contains the ingredients the menu promises — this is checkable, objective, and doesn't require any taste at all. But whether the dish is actually well-seasoned, well-balanced, and genuinely enjoyable requires a different kind of evaluation entirely — a trained palate applying judgment, not a mechanical ingredient check. Critically, a restaurant doesn't ask a random person off the street for this judgment; it uses a genuinely skilled taster whose judgment is itself periodically checked against expert consensus, because taste judgment, while more capable than a checklist for this specific question, is also more fallible and needs its own calibration. LLM-as-judge works exactly this way: Lesson 1's mechanical criteria are the ingredient checklist, correctly verifying checkable facts. For genuinely subjective qualities — tone, coherence, overall helpfulness — a second model call acts as the trained taster, applying judgment a checklist structurally cannot. And exactly like a restaurant periodically checking its taster's judgment against genuine expert consensus, an LLM-as-judge system needs its own judgments periodically validated against real human judgment, because the judge model is subject to the exact same generation mechanism (Module 1) and hallucination risk (Module 1, Lesson 3) as any other model call.",
      hi: 'Ek restaurant jo mechanically verify kar sakta hai ki ek dish mein correct listed ingredients hain, par actually genuinely tasty hai ya nahi judge karne ke liye ek actual trained palate chahiye. Ek checklist mechanically confirm kar sakti hai ki ek dish mein wo ingredients hain jo menu promise karta hai — ye checkable, objective hai, aur bilkul koi taste ki zaroorat nahi rakhta. Par kya dish actually well-seasoned, well-balanced, aur genuinely enjoyable hai iske liye poori tarah ek alag kism ki evaluation chahiye — ek trained palate judgment apply karta hua, ek mechanical ingredient check nahi. Critically, ek restaurant is judgment ke liye street se ek random person nahi poochta; ye ek genuinely skilled taster use karta hai jiska judgment khud periodically expert consensus ke against check kiya jata hai, kyunki taste judgment, is specific question ke liye ek checklist se zyada capable hote hue bhi, zyada fallible bhi hai aur apni khud ki calibration chahta hai. LLM-as-judge exactly is tarike se kaam karta hai: Lesson 1 ke mechanical criteria wo ingredient checklist hain, checkable facts ko correctly verify karte hue. Genuinely subjective qualities ke liye — tone, coherence, overall helpfulness — ek second model call trained taster ki tarah act karta hai, ek checklist ka structurally na kar sakne wala judgment apply karte hue. Aur exactly ek restaurant ki tarah jo periodically apne taster ke judgment ko genuine expert consensus ke against check karta hai, ek LLM-as-judge system ko apne khud ke judgments periodically real human judgment ke against validated chahiye, kyunki judge model wahi exact generation mechanism (Module 1) aur hallucination risk (Module 1, Lesson 3) ke subject hai jo kisi bhi doosre model call ki tarah hai.',
    },

    simple: `**LLM-as-judge — using a second model call to score a quality
mechanical criteria can't check:**

\`\`\`ts
async function judgeResponseQuality(userQuestion, modelResponse) {
  const judgePrompt = \`You are evaluating an AI assistant's response for
quality. Rate the response on a scale of 1-5 for each dimension:

1. HELPFULNESS: Does it genuinely address what the user asked?
2. TONE: Is it appropriately professional and clear?
3. ACCURACY: Does anything appear factually questionable?

Question: \${userQuestion}
Response: \${modelResponse}

Respond with ONLY a JSON object: {"helpfulness": N, "tone": N, "accuracy": N, "reasoning": "..."}\`;

  const judgment = await anthropic.messages.create({
    model: 'claude-sonnet-4-5', // often a capable model, sometimes DIFFERENT
    max_tokens: 300,            // from the one being evaluated
    messages: [{ role: 'user', content: judgePrompt }],
  });

  return JSON.parse(judgment.content[0].text);
}

async function runQualityEval(evalDataset) {
  const scores = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const judgment = await judgeResponseQuality(testCase.question, response);
    scores.push(judgment);
  }
  return scores;
}
\`\`\`

**Why this is genuinely useful despite the judge being "just another
model call":** Module 1 established that judging is a fundamentally
different task from generating — a model doesn't need to have produced
the best possible answer itself to meaningfully assess whether a GIVEN
answer satisfies specific evaluative criteria, the same way a skilled
critic doesn't need to be a better novelist than the author whose book
they're reviewing. This asymmetry (evaluation being an easier task than
generation for many quality dimensions) is what makes LLM-as-judge
practically useful at scale — running thousands of evaluations a human
reviewer couldn't feasibly do one at a time.

**Why the judge's own reliability needs independent validation, tying
directly back to Module 1's hallucination lesson:** the judge model is
itself generating text via the exact same mechanism (Module 1) as the
model being evaluated — its scores and reasoning are plausible, not
verified, and can themselves be wrong, biased, or influenced by
irrelevant surface features (a longer, more confident-sounding response
scoring higher regardless of actual quality — a documented, real bias in
LLM-as-judge setups). This is why a production eval system periodically
validates the judge's scores against genuine human judgment on a
sample, the same "reduce but never eliminate the underlying risk"
framing Module 11 established for hallucination mitigation generally,
applied here to the specific case of a model judging another model.

**A concrete known bias worth naming — length and confidence bias:**

\`\`\`
LLM judges have been repeatedly observed to score longer, more
confidently-worded responses higher, independent of actual correctness
or helpfulness — a real, documented failure mode, not a hypothetical
concern. A production eval system accounts for this by, e.g.,
periodically checking judge scores against human ratings specifically
on pairs where a shorter/more-hedged response is actually the better
one, to detect whether this specific bias is affecting results.
\`\`\`

**Why LLM-as-judge complements rather than replaces Lesson 1's
mechanical criteria:** mechanical criteria remain the right tool for
genuinely checkable facts (did the response mention the required
figure, did it avoid a specific forbidden claim) — cheaper, faster, and
more reliable than a judge model for exactly this category. LLM-as-
judge is reserved for qualities that genuinely require judgment (tone,
coherence, overall helpfulness) that mechanical string matching
structurally cannot assess — a production eval suite typically combines
both, using each for the category of quality it's actually suited to.`,

    simpleHi: `**LLM-as-judge — ek quality score karne ke liye ek second model call
use karna jise mechanical criteria check nahi kar sakte:**

\`\`\`ts
async function judgeResponseQuality(userQuestion, modelResponse) {
  const judgePrompt = \`You are evaluating an AI assistant's response for
quality. Rate the response on a scale of 1-5 for each dimension:

1. HELPFULNESS: Does it genuinely address what the user asked?
2. TONE: Is it appropriately professional and clear?
3. ACCURACY: Does anything appear factually questionable?

Question: \${userQuestion}
Response: \${modelResponse}

Respond with ONLY a JSON object: {"helpfulness": N, "tone": N, "accuracy": N, "reasoning": "..."}\`;

  const judgment = await anthropic.messages.create({
    model: 'claude-sonnet-4-5', // aksar ek capable model, kabhi kabhi ALAG
    max_tokens: 300,            // us wale se jo evaluate ho raha hai
    messages: [{ role: 'user', content: judgePrompt }],
  });

  return JSON.parse(judgment.content[0].text);
}

async function runQualityEval(evalDataset) {
  const scores = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const judgment = await judgeResponseQuality(testCase.question, response);
    scores.push(judgment);
  }
  return scores;
}
\`\`\`

**Ye genuinely useful kyun hai judge "sirf ek aur model call" hone ke
bawajood:** Module 1 ne establish kiya ki judging generating se ek
fundamentally alag task hai — ek model ko khud best possible answer
produce karne ki zaroorat nahi hai ye meaningfully assess karne ke liye
ki kya ek GIVEN answer specific evaluative criteria satisfy karta hai,
wahi tarike se jaise ek skilled critic ko us author se ek better novelist
hone ki zaroorat nahi jiski book wo review kar rahe hain. Ye asymmetry
(evaluation kai quality dimensions ke liye generation se ek easier task
hona) wo hai jo LLM-as-judge ko practically useful banata hai scale par
— hazaron evaluations chalana jo ek human reviewer feasibly ek time pe
ek nahi kar sakta.

**Judge ki apni reliability ko independent validation kyun chahiye,
directly Module 1 ke hallucination lesson tak wapas tied:** judge model
khud text generate kar raha hai wahi exact mechanism (Module 1) ke
through jaise evaluate ho raha model — iske scores aur reasoning
plausible hain, verified nahi, aur khud galat, biased, ya irrelevant
surface features se influenced ho sakte hain (ek lamba, zyada confident-
sounding response higher score karta hai actual quality se
independently — LLM-as-judge setups mein ek documented, real bias). Yahi
wajah hai ek production eval system periodically judge ke scores ko ek
sample pe genuine human judgment ke against validate karta hai, wahi
"reduce but never eliminate the underlying risk" framing jo Module 11
ne hallucination mitigation generally ke liye establish ki, yahan ek
model doosre model ko judge karne ke specific case pe applied.

**Ek concrete known bias naam dene layak — length aur confidence
bias:**

\`\`\`
LLM judges ko repeatedly observe kiya gaya hai ki wo longer, zyada
confidently-worded responses ko higher score karte hain, actual
correctness ya helpfulness se independently — ek real, documented
failure mode, ek hypothetical concern nahi. Ek production eval system
ise account karta hai, jaise, judge scores ko periodically human ratings
ke against check karke specifically un pairs pe jahan ek shorter/more-
hedged response actually better wala hai, ye detect karne ke liye ki
kya ye specific bias results ko affect kar raha hai.
\`\`\`

**LLM-as-judge Lesson 1 ke mechanical criteria ko replace karne ke
bajaye complement kyun karta hai:** mechanical criteria genuinely
checkable facts ke liye sahi tool rehte hain (kya response ne required
figure mention kiya, kya isne ek specific forbidden claim avoid kiya) —
exactly is category ke liye ek judge model se cheaper, faster, aur zyada
reliable. LLM-as-judge un qualities ke liye reserved hai jinhe genuinely
judgment chahiye (tone, coherence, overall helpfulness) jise mechanical
string matching structurally assess nahi kar sakta — ek production eval
suite typically dono combine karta hai, har ek ko quality ki us category
ke liye use karte hue jiske liye ye actually suited hai.`,

    content: `## Why LLM-as-judge is practically useful despite the judge being
subject to the same generation mechanism as any other model call

Module 1 established that generation is inherently plausible-not-
verified — this is true of a judge model exactly as much as any other.
What makes LLM-as-judge practically valuable anyway is a genuine
asymmetry: evaluating whether a GIVEN response satisfies specific
criteria is, for many quality dimensions, a meaningfully easier task
than generating the best possible response from scratch — a judge model
doesn't need to independently solve the original problem, it needs to
recognize whether a provided solution has certain properties. This
asymmetry (evaluation often being easier than generation) is precisely
what makes running an LLM judge across thousands of eval cases
practically feasible in a way having a human review each one at that
scale genuinely is not.

## Why the judge's reliability needs the exact same skepticism Module
1, Lesson 3 established for any model output

A judge model's scores and reasoning are generated text, produced by
the identical mechanism (Module 1) as the response being judged — there
is no special exemption making a judge model's output more trustworthy
than any other generated content. This is why treating a judge's score
as ground truth without independent validation repeats exactly the
category error Module 1, Lesson 3 warned against: confusing confident,
well-formatted output (a clean JSON score with plausible-sounding
reasoning) with verified accuracy. A production system periodically
checks judge scores against genuine human judgment on a sample,
applying Module 11's "reduce but never eliminate the underlying risk"
framing specifically to this evaluation layer.

## Why documented biases like length/confidence bias matter for how
judge results are interpreted

LLM judges have been repeatedly and specifically documented to favor
longer, more confidently-worded responses independent of actual
correctness or helpfulness — a concrete, known failure mode rather than
an abstract concern. Understanding this specific bias changes how a
team interprets judge scores in practice: a system showing judge scores
consistently favoring verbose responses should trigger a specific
check (validating against human judgment on exactly the cases where
brevity or hedging would be the better answer) rather than being taken
at face value as evidence of genuinely better quality.

## Why LLM-as-judge and Lesson 1's mechanical criteria are
complementary tools, not competing approaches

Mechanical, string-matching criteria remain strictly better suited to
checkable facts — cheaper, faster, and without the judge model's own
reliability concerns — precisely because they don't require judgment at
all, just verification. LLM-as-judge earns its cost and added
reliability concerns specifically for qualities mechanical matching
structurally cannot assess: tone, coherence, whether a response is
genuinely helpful rather than merely technically accurate. A
well-designed eval suite uses each tool for the category of quality it
is actually suited to, rather than reaching for the more expensive,
judgment-based tool for questions a simple string check could answer
just as reliably.`,

    contentHi: `## LLM-as-judge practically useful kyun hai judge ke wahi generation mechanism ke subject hone ke bawajood jo kisi bhi doosre model call ka hai

Module 1 ne establish kiya ki generation inherently plausible-not-
verified hai — ye ek judge model ke liye exactly utna hi sach hai jitna
kisi bhi doosre model call ke liye. Jo LLM-as-judge ko phir bhi
practically valuable banata hai wo ek genuine asymmetry hai: ye evaluate
karna ki kya ek GIVEN response specific criteria satisfy karta hai,
kai quality dimensions ke liye, scratch se best possible response
generate karne se ek meaningfully easier task hai — ek judge model ko
independently original problem solve karne ki zaroorat nahi, ise
recognize karna hai ki kya ek provided solution mein certain properties
hain. Ye asymmetry (evaluation aksar generation se easier hona) exactly
wo hai jo hazaron eval cases ke across ek LLM judge chalana practically
feasible banata hai us tarike se jo us scale pe har ek ko review karne
wale ek human ke liye genuinely nahi hai.

## Judge ki reliability ko exact wahi skepticism kyun chahiye jise Module 1, Lesson 3 ne kisi bhi model output ke liye establish kiya

Ek judge model ke scores aur reasoning generated text hain, identical
mechanism (Module 1) dwara produce kiye gaye jo judge ki ja rahi response
ki hai — koi special exemption nahi hai jo ek judge model ke output ko
kisi bhi doosre generated content se zyada trustworthy banata hai. Yahi
wajah hai ek judge ke score ko bina independent validation ke ground
truth ki tarah treat karna exactly wahi category error repeat karta hai
jiske against Module 1, Lesson 3 ne warn kiya: confident, well-formatted
output (ek clean JSON score plausible-sounding reasoning ke saath) ko
verified accuracy se confuse karna. Ek production system periodically
judge scores ko ek sample pe genuine human judgment ke against check
karta hai, Module 11 ke "reduce but never eliminate the underlying risk"
framing ko specifically is evaluation layer pe apply karte hue.

## Length/confidence bias jaise documented biases judge results ko interpret karne ke tareeke ke liye kyun matter karte hain

LLM judges ko repeatedly aur specifically documented kiya gaya hai ki
wo longer, zyada confidently-worded responses ko favor karte hain actual
correctness ya helpfulness se independently — ek abstract concern ke
bajaye ek concrete, known failure mode. Is specific bias ko samajhna
badalta hai ki ek team practically judge scores ko kaise interpret
karti hai: ek system jo judge scores consistently verbose responses ko
favor karte hue dikhata hai use ek specific check trigger karna chahiye
(exactly un cases pe human judgment ke against validate karte hue jahan
brevity ya hedging actually better answer hoga) face value pe genuinely
better quality ka evidence ki tarah liye jaane ke bajaye.

## LLM-as-judge aur Lesson 1 ke mechanical criteria complementary tools kyun hain, competing approaches nahi

Mechanical, string-matching criteria checkable facts ke liye strictly
zyada suited rehte hain — cheaper, faster, aur judge model ki apni
reliability concerns ke bina — precisely kyunki unhe bilkul judgment
ki zaroorat nahi, sirf verification ki. LLM-as-judge apna cost aur added
reliability concerns specifically un qualities ke liye earn karta hai
jise mechanical matching structurally assess nahi kar sakta: tone,
coherence, kya ek response genuinely helpful hai sirf technically
accurate hone ke bajaye. Ek well-designed eval suite har tool ko quality
ki us category ke liye use karta hai jiske liye ye actually suited hai,
ek simple string check jitni hi reliably answer kar sakti hain aise
questions ke liye zyada expensive, judgment-based tool ke liye reach
karne ke bajaye.`,

    examples: [
      {
        title: 'Combining mechanical criteria and LLM-as-judge in one eval suite, with periodic human validation',
        titleHi: 'Ek eval suite mein mechanical criteria aur LLM-as-judge ko combine karna, periodic human validation ke saath',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// MECHANICAL criteria — for checkable facts (Lesson 1's approach)
function checkMechanicalCriteria(response, criteria) {
  const hasRequired = criteria.mustMention.every((t) => response.toLowerCase().includes(t.toLowerCase()));
  const hasForbidden = criteria.mustNotMention.some((t) => response.toLowerCase().includes(t.toLowerCase()));
  return hasRequired && !hasForbidden;
}

// LLM-AS-JUDGE — for subjective quality mechanical criteria can't assess
async function judgeSubjectiveQuality(question, response) {
  const judgePrompt = \`Rate this response's tone and helpfulness on a
scale of 1-5 each. Be skeptical of length — a longer response is not
automatically better.

Question: \${question}
Response: \${response}

Respond with ONLY JSON: {"tone": N, "helpfulness": N}\`;

  const judgment = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 100,
    messages: [{ role: 'user', content: judgePrompt }],
  });
  return JSON.parse(judgment.content[0].text);
}

async function runFullEval(evalDataset) {
  const results = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const mechanicalPass = checkMechanicalCriteria(response, testCase.criteria);
    const subjectiveScores = await judgeSubjectiveQuality(testCase.question, response);
    results.push({ ...testCase, response, mechanicalPass, subjectiveScores });
  }
  return results;
}

// Periodic validation — sample a subset for a human to independently
// score, then compare against the judge's scores to detect drift/bias
async function validateJudgeAgainstHumans(sampleResults, humanScores) {
  const discrepancies = sampleResults.filter((r, i) =>
    Math.abs(r.subjectiveScores.helpfulness - humanScores[i].helpfulness) > 1,
  );
  if (discrepancies.length / sampleResults.length > 0.2) {
    console.warn('Judge scores diverging significantly from human judgment — investigate');
  }
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Criteria { mustMention: string[]; mustNotMention: string[]; }

// MECHANICAL criteria — for checkable facts (Lesson 1's approach)
function checkMechanicalCriteria(response: string, criteria: Criteria): boolean {
  const hasRequired = criteria.mustMention.every((t) => response.toLowerCase().includes(t.toLowerCase()));
  const hasForbidden = criteria.mustNotMention.some((t) => response.toLowerCase().includes(t.toLowerCase()));
  return hasRequired && !hasForbidden;
}

interface SubjectiveScores { tone: number; helpfulness: number; }

// LLM-AS-JUDGE — for subjective quality mechanical criteria can't assess
async function judgeSubjectiveQuality(question: string, response: string): Promise<SubjectiveScores> {
  const judgePrompt = \`Rate this response's tone and helpfulness on a
scale of 1-5 each. Be skeptical of length — a longer response is not
automatically better.

Question: \${question}
Response: \${response}

Respond with ONLY JSON: {"tone": N, "helpfulness": N}\`;

  const judgment = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 100,
    messages: [{ role: 'user', content: judgePrompt }],
  });
  const block = judgment.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return JSON.parse(block.text) as SubjectiveScores;
}

interface EvalCase { question: string; criteria: Criteria; }

async function runFullEval(evalDataset: EvalCase[]) {
  const results = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const mechanicalPass = checkMechanicalCriteria(response, testCase.criteria);
    const subjectiveScores = await judgeSubjectiveQuality(testCase.question, response);
    results.push({ ...testCase, response, mechanicalPass, subjectiveScores });
  }
  return results;
}

// Periodic validation — sample a subset for a human to independently
// score, then compare against the judge's scores to detect drift/bias
async function validateJudgeAgainstHumans(
  sampleResults: { subjectiveScores: SubjectiveScores }[],
  humanScores: SubjectiveScores[],
): Promise<void> {
  const discrepancies = sampleResults.filter((r, i) =>
    Math.abs(r.subjectiveScores.helpfulness - humanScores[i].helpfulness) > 1,
  );
  if (discrepancies.length / sampleResults.length > 0.2) {
    console.warn('Judge scores diverging significantly from human judgment — investigate');
  }
}`,
        code: `const mechanicalPass = checkMechanicalCriteria(response, testCase.criteria);
const subjectiveScores = await judgeSubjectiveQuality(testCase.question, response);
// periodically: compare subjectiveScores against real human scores on a sample`,
        output:
          "The eval suite produces both a hard pass/fail on checkable facts (mechanicalPass) and a nuanced 1-5 score on tone/helpfulness (subjectiveScores) for every test case, while a separate periodic process flags when the judge's scores drift more than 1 point away from human raters on a validation sample more than 20% of the time.",
        explain:
          "The judge prompt explicitly instructs skepticism of length ('a longer response is not automatically better'), a direct, concrete countermeasure against the documented length-bias this lesson identifies — and the validation function treats the judge as a tool requiring ongoing calibration against ground truth, not an oracle.",
        explainHi:
          "Judge prompt explicitly length ke against skepticism instruct karta hai ('ek lamba response automatically better nahi hai'), documented length-bias ke against ek direct, concrete countermeasure jise ye lesson identify karta hai — aur validation function judge ko ek tool ki tarah treat karta hai jise ground truth ke against ongoing calibration chahiye, ek oracle nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting judge scores as ground truth with no independent validation
async function runEval(evalDataset) {
  const results = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const score = await judgeSubjectiveQuality(testCase.question, response);
    results.push(score);
  }
  // Deploying decisions (which prompt version "wins") based purely on
  // these scores, with no periodic check against actual human judgment
  const bestVersion = pickHighestScoringVersion(results);
  await deployToProduction(bestVersion);
}`,
        right: `// Treating judge scores as a useful but imperfect signal requiring
// periodic validation against human judgment
async function runEval(evalDataset) {
  const results = [];
  for (const testCase of evalDataset) {
    const response = await getModelResponse(testCase.question);
    const score = await judgeSubjectiveQuality(testCase.question, response);
    results.push(score);
  }

  // Periodically validate a sample against real human ratings before
  // trusting the judge's scores for a real deployment decision
  const sample = results.slice(0, 20);
  const humanScores = await getHumanRatingsForSample(sample);
  await validateJudgeAgainstHumans(sample, humanScores);

  const bestVersion = pickHighestScoringVersion(results);
  await deployToProduction(bestVersion);
}`,
        why: "A judge model's scores are generated text, produced by the same mechanism (Module 1) as any other model output — plausible, not verified. Treating them as ground truth without periodic validation against genuine human judgment repeats the exact category error of confusing confident, well-formatted output with actual accuracy.",
        whyHi:
          "Ek judge model ke scores generated text hain, wahi mechanism (Module 1) dwara produce kiye gaye jo kisi bhi doosre model output ka hai — plausible, verified nahi. Genuine human judgment ke against periodic validation ke bina inhe ground truth ki tarah treat karna exactly wahi category error repeat karta hai confident, well-formatted output ko actual accuracy se confuse karne ka.",
      },
    ],

    realWorld: [
      {
        en: "A production AI product uses LLM-as-judge to automatically score thousands of daily conversation quality samples across dimensions like helpfulness and tone, while a separate team independently human-rates a random 2% sample each week specifically to detect whether the judge's scores are drifting away from what a human would actually conclude — catching, on one occasion, that the judge had developed a measurable bias toward longer responses that didn't correspond to genuinely higher quality.",
        hi: 'Ek production AI product LLM-as-judge use karta hai automatically hazaron daily conversation quality samples ko score karne ke liye dimensions ke across jaise helpfulness aur tone, jabki ek separate team independently har hafte ek random 2% sample ko human-rate karti hai specifically ye detect karne ke liye ki kya judge ke scores us se drift kar rahe hain jo ek human actually conclude karega — ek occasion pe catch karte hue ki judge ne longer responses ki taraf ek measurable bias develop kar liya tha jo genuinely higher quality ke saath correspond nahi karta tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is LLM-as-judge practically useful even though the judge model is subject to the same generation mechanism (and thus the same unreliability) as the model being evaluated?',
        qHi: 'LLM-as-judge practically useful kyun hai chahe judge model wahi generation mechanism (aur isliye wahi unreliability) ke subject ho jo evaluate ho rahe model ka hai?',
        a: "There's a genuine asymmetry between generation and evaluation: assessing whether a given response satisfies specific criteria is, for many quality dimensions, a meaningfully easier task than generating the best possible response from scratch. This asymmetry makes running a judge model across thousands of cases practically feasible, even though the judge's own output still requires the same skepticism as any other generated content.",
        aHi: 'Generation aur evaluation ke beech ek genuine asymmetry hai: ye assess karna ki kya ek given response specific criteria satisfy karta hai, kai quality dimensions ke liye, scratch se best possible response generate karne se ek meaningfully easier task hai. Ye asymmetry hazaron cases ke across ek judge model chalana practically feasible banati hai, chahe judge ka apna output abhi bhi kisi bhi doosre generated content jaisi hi skepticism chahta hai.',
      },
      {
        q: 'What is the length/confidence bias documented in LLM-as-judge systems, and why does it matter for interpreting results?',
        qHi: 'LLM-as-judge systems mein documented length/confidence bias kya hai, aur ye results interpret karne ke liye kyun matter karta hai?',
        a: "LLM judges have been repeatedly observed to score longer, more confidently-worded responses higher independent of actual correctness or helpfulness. This means a team seeing judge scores favor verbose responses should specifically validate against human judgment on cases where brevity would be the better answer, rather than assuming the scores reflect genuinely higher quality.",
        aHi: 'LLM judges ko repeatedly observe kiya gaya hai ki wo longer, zyada confidently-worded responses ko higher score karte hain actual correctness ya helpfulness se independently. Iska matlab hai ek team jo judge scores ko verbose responses favor karte hue dekhti hai use specifically un cases pe human judgment ke against validate karna chahiye jahan brevity better answer hoga, scores ko genuinely higher quality reflect karte hue assume karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A team uses LLM-as-judge scores to automatically pick which of two prompt versions performs better, deploying the higher-scoring version to production every week with no human review at all. Using this lesson's reasoning, identify the risk in this process and propose a concrete safeguard.",
        taskHi: 'Ek team LLM-as-judge scores use karti hai automatically pick karne ke liye ki do prompt versions mein se kaunsa behtar perform karta hai, higher-scoring version ko har hafte production mein deploy karte hue koi human review ke bina. Is lesson ki reasoning use karke, is process mein risk identify karo aur ek concrete safeguard propose karo.',
        hint: "Consider what could go wrong if the judge has a systematic bias (like the documented length bias) that happens to favor one prompt version for reasons unrelated to actual quality.",
        hintHi: 'Consider karo ki kya galat ho sakta hai agar judge mein ek systematic bias hai (jaise documented length bias) jo ek prompt version ko favor karne ka happen hota hai un reasons se jinka actual quality se koi lena-dena nahi.',
      },
    ],

    keyTakeaways: [
      "LLM-as-judge uses a second model call to evaluate subjective qualities (tone, coherence, helpfulness) that Lesson 1's mechanical criteria structurally cannot assess, made practical by evaluation genuinely being an easier task than generation for many quality dimensions.",
      "A judge model's scores are generated text via the same mechanism (Module 1) as any other output — plausible, not verified — requiring the same skepticism Module 1, Lesson 3 established for any model output.",
      "Documented biases (notably favoring longer, more confident responses regardless of actual quality) mean judge scores need periodic validation against genuine human judgment, not blind trust.",
      "Mechanical criteria (Lesson 1) and LLM-as-judge are complementary, not competing — each suited to a different category of quality, combined in a well-designed eval suite.",
    ],
    keyTakeawaysHi: [
      'LLM-as-judge subjective qualities (tone, coherence, helpfulness) evaluate karne ke liye ek second model call use karta hai jinhe Lesson 1 ke mechanical criteria structurally assess nahi kar sakte, evaluation ke kai quality dimensions ke liye genuinely generation se ek easier task hone se practical banaya gaya.',
      'Ek judge model ke scores wahi mechanism (Module 1) ke through generated text hain jo kisi bhi doosre output ka hai — plausible, verified nahi — wahi skepticism chahte hue jise Module 1, Lesson 3 ne kisi bhi model output ke liye establish kiya.',
      'Documented biases (notably longer, zyada confident responses ko favor karna actual quality se independently) matlab hai judge scores ko genuine human judgment ke against periodic validation chahiye, blind trust nahi.',
      'Mechanical criteria (Lesson 1) aur LLM-as-judge complementary hain, competing nahi — har ek quality ki ek alag category ke liye suited, ek well-designed eval suite mein combined.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-regression-testing-golden-datasets-human-review',
    title: 'Regression Testing, Golden Datasets & Human-in-the-Loop Review',
    titleHi: 'Regression Testing, Golden Datasets Aur Human-in-the-Loop Review',
    description:
      "Closing this module and Part III: running Lessons 1-2's eval techniques repeatedly over time to catch regressions across a model or prompt change, maintaining a golden dataset as the stable benchmark this requires, and human review's continuing, irreplaceable role.",
    descriptionHi:
      'Is module aur Part III ko close karte hue: Lessons 1-2 ki eval techniques ko repeatedly time ke saath chalana ek model ya prompt change ke across regressions catch karne ke liye, ek golden dataset maintain karna stable benchmark ki tarah jise ye chahta hai, aur human review ka continuing, irreplaceable role.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**A car manufacturer re-running the exact same standardized crash-test protocol on every new model year, rather than inventing new tests each time, specifically so this year's results are genuinely comparable to last year's.** If a manufacturer changed its crash-test methodology every single year, a safety improvement from one year to the next would be impossible to actually confirm — you'd have no way to know if a better score reflects a genuinely safer car or just an easier test. Using the EXACT SAME standardized test, unchanged, is precisely what makes year-over-year comparison meaningful — the test's stability, not its sophistication, is what makes it useful for tracking real change over time. A golden dataset in AI evaluation serves exactly this role: a fixed, stable set of eval cases run identically before and after any prompt or model change, specifically so a score difference can be attributed to the actual change being tested rather than to the test itself having shifted. And exactly as a car manufacturer still employs human safety engineers to review results and investigate anomalies a standardized test alone wouldn't catch, an AI eval system still needs human review for judgment calls (Lesson 2's LLM-as-judge) and genuinely novel failure modes a fixed, automated eval suite was never designed to detect.",
      hi: 'Ek car manufacturer jo har naye model year pe exact wahi standardized crash-test protocol re-run karta hai, har baar naye tests invent karne ke bajaye, specifically taaki is saal ke results pichhle saal se genuinely comparable hon. Agar ek manufacturer apni crash-test methodology har single saal badalta, ek saal se doosre tak ek safety improvement ko actually confirm karna impossible ho jaata — aapke paas ye jaanne ka koi tareeka nahi hota ki kya ek better score genuinely ek safer car reflect karta hai ya sirf ek easier test. EXACT SAME standardized test use karna, unchanged, precisely wo hai jo year-over-year comparison ko meaningful banata hai — test ki stability, uski sophistication nahi, wo hai jo ise time ke saath real change track karne ke liye useful banata hai. AI evaluation mein ek golden dataset exactly ye role serve karta hai: eval cases ka ek fixed, stable set jo kisi bhi prompt ya model change se pehle aur baad mein identically chalaya jata hai, specifically taaki ek score difference us actual change ko attribute kiya ja sake jo test ki jaa rahi hai test khud shift hone ke bajaye. Aur exactly jaise ek car manufacturer abhi bhi human safety engineers employ karta hai results review karne aur anomalies investigate karne ke liye jinhe ek standardized test akela catch nahi karega, ek AI eval system ko abhi bhi human review chahiye judgment calls (Lesson 2 ka LLM-as-judge) aur genuinely novel failure modes ke liye jinhe detect karne ke liye ek fixed, automated eval suite kabhi design nahi ki gayi thi.',
    },

    simple: `**A golden dataset — a fixed, stable eval set kept unchanged
specifically to make before/after comparison meaningful:**

\`\`\`ts
// The golden dataset is versioned and DELIBERATELY kept stable —
// changing it defeats the entire purpose of before/after comparison
const GOLDEN_EVAL_DATASET_V1 = [
  { id: 'faq-refund-01', input: 'Can I return a damaged item after 30 days?', criteria: { /* Lesson 1 */ } },
  { id: 'faq-shipping-02', input: 'How long does international shipping take?', criteria: { /* Lesson 1 */ } },
  // ... a genuinely representative set, including known-hard cases
  // (Lesson 1's point about representativeness)
];

async function runRegressionTest(promptVersion) {
  const results = [];
  for (const testCase of GOLDEN_EVAL_DATASET_V1) {
    const response = await getModelResponse(testCase.input, promptVersion);
    const mechanicalPass = checkMechanicalCriteria(response, testCase.criteria); // Lesson 1
    const qualityScore = await judgeSubjectiveQuality(testCase.input, response); // Lesson 2
    results.push({ id: testCase.id, mechanicalPass, qualityScore });
  }
  return results;
}
\`\`\`

**Regression testing — comparing results across a change, using the
SAME golden dataset both times:**

\`\`\`ts
async function checkForRegressions(oldPromptVersion, newPromptVersion) {
  const before = await runRegressionTest(oldPromptVersion);
  const after = await runRegressionTest(newPromptVersion);

  const regressions = after.filter((result, i) => {
    const previousResult = before[i];
    return (
      (previousResult.mechanicalPass && !result.mechanicalPass) || // newly failing
      result.qualityScore.helpfulness < previousResult.qualityScore.helpfulness - 1 // meaningfully worse
    );
  });

  if (regressions.length > 0) {
    console.warn(\`\${regressions.length} regression(s) detected — review before deploying\`, regressions);
  }
  return regressions;
}
\`\`\`

**Why the golden dataset must stay stable across comparisons, and
what "stable" actually means:** if the eval cases themselves changed
between the "before" and "after" runs, a score difference could reflect
either the actual prompt/model change OR the eval set having changed —
these two explanations become genuinely indistinguishable. Keeping the
dataset explicitly versioned and unchanged for a given comparison is
what isolates the actual variable being tested, mirroring exactly why a
scientific experiment holds all variables constant except the one being
studied.

**Why the golden dataset itself still needs periodic, deliberate
updates — just not silently or mid-comparison:** a golden dataset frozen
forever eventually stops reflecting how the feature is actually used in
production — new failure modes emerge, usage patterns shift, edge cases
discovered in production should be added to prevent the same regression
recurring undetected. The discipline is updating it deliberately, as a
visible, versioned change (V1 to V2), never silently mid-comparison —
the same underlying principle as a car manufacturer eventually updating
its crash-test standard as real-world data reveals new failure modes,
done as a distinct, acknowledged version change, not an invisible drift.

**Human-in-the-loop review — the continuing role neither Lesson 1's
mechanical criteria nor Lesson 2's LLM-as-judge fully replaces:**

\`\`\`
Automated evaluation (Lessons 1-2) scales to thousands of cases but has
real, documented limits: mechanical criteria can't judge subjective
quality, and a judge model has its own biases and failure modes
(Lesson 2). Human review remains necessary for:

  - Validating the judge's scores periodically against real human
    judgment (Lesson 2's calibration requirement)
  - Investigating flagged regressions in depth before a deploy decision
  - Catching genuinely novel failure modes a fixed golden dataset was
    never designed to test for, since it was built from KNOWN cases

This isn't a temporary gap automation will eventually close — it's a
structural role automated evaluation, built on the same generation
mechanism (Module 1) as the system it's testing, cannot fully take over
from itself.
\`\`\`

**How this closes Module 14 and Part III of this course:** Lesson 1
established the correct unit of testing (acceptable-output criteria,
not exact match); Lesson 2 extended this to subjective qualities via
LLM-as-judge, with its own reliability caveats; this lesson assembles
both into a genuine regression-testing discipline — a stable, versioned
golden dataset run consistently across changes, with human review as
the necessary, permanent complement rather than a stopgap. This closes
Part III's arc: cost/model selection (Module 10), reliability (Module
11), security (Module 12), rate limiting (Module 13), and evaluation
(this module) together form the production-readiness discipline the
rest of this course's advanced techniques (Modules 15+) are built on
top of.`,

    simpleHi: `**Ek golden dataset — ek fixed, stable eval set unchanged rakha
gaya specifically before/after comparison ko meaningful banane ke
liye:**

\`\`\`ts
// Golden dataset versioned hai aur DELIBERATELY stable rakha gaya hai —
// ise badalna poore before/after comparison ke purpose ko defeat karta hai
const GOLDEN_EVAL_DATASET_V1 = [
  { id: 'faq-refund-01', input: 'Can I return a damaged item after 30 days?', criteria: { /* Lesson 1 */ } },
  { id: 'faq-shipping-02', input: 'How long does international shipping take?', criteria: { /* Lesson 1 */ } },
  // ... ek genuinely representative set, known-hard cases samet
  // (Lesson 1 ka representativeness ke baare mein point)
];

async function runRegressionTest(promptVersion) {
  const results = [];
  for (const testCase of GOLDEN_EVAL_DATASET_V1) {
    const response = await getModelResponse(testCase.input, promptVersion);
    const mechanicalPass = checkMechanicalCriteria(response, testCase.criteria); // Lesson 1
    const qualityScore = await judgeSubjectiveQuality(testCase.input, response); // Lesson 2
    results.push({ id: testCase.id, mechanicalPass, qualityScore });
  }
  return results;
}
\`\`\`

**Regression testing — ek change ke across results compare karna, dono
baar wahi golden dataset use karte hue:**

\`\`\`ts
async function checkForRegressions(oldPromptVersion, newPromptVersion) {
  const before = await runRegressionTest(oldPromptVersion);
  const after = await runRegressionTest(newPromptVersion);

  const regressions = after.filter((result, i) => {
    const previousResult = before[i];
    return (
      (previousResult.mechanicalPass && !result.mechanicalPass) || // newly failing
      result.qualityScore.helpfulness < previousResult.qualityScore.helpfulness - 1 // meaningfully worse
    );
  });

  if (regressions.length > 0) {
    console.warn(\`\${regressions.length} regression(s) detected — review before deploying\`, regressions);
  }
  return regressions;
}
\`\`\`

**Golden dataset comparisons ke across stable rehna kyun chahiye, aur
"stable" ka actually kya matlab hai:** agar eval cases khud "before" aur
"after" runs ke beech badal jaate, ek score difference ya to actual
prompt/model change ko ya eval set ke badal jaane ko reflect kar sakta
tha — ye do explanations genuinely indistinguishable ban jaate hain.
Dataset ko explicitly versioned aur ek given comparison ke liye unchanged
rakhna wo hai jo actual variable ko isolate karta hai jise test kiya ja
raha hai, exactly wahi mirror karte hue ki ek scientific experiment sab
variables ko constant kyun rakhta hai us ek ko chhodkar jise study kiya
ja raha hai.

**Golden dataset ko khud abhi bhi periodic, deliberate updates kyun
chahiye — bas silently ya mid-comparison nahi:** ek golden dataset jo
hamesha ke liye frozen hai eventually ye reflect karna band kar deta hai
ki feature actually production mein kaise use ho raha hai — naye failure
modes emerge hote hain, usage patterns shift hote hain, production mein
discover kiye gaye edge cases add kiye jaane chahiye wahi regression ko
undetected recur hone se rokne ke liye. Discipline ise deliberately
update karna hai, ek visible, versioned change ki tarah (V1 se V2), kabhi
silently mid-comparison nahi — wahi underlying principle jo ek car
manufacturer eventually apna crash-test standard update karta hai jaise
real-world data naye failure modes reveal karta hai, ek distinct,
acknowledged version change ki tarah kiya gaya, ek invisible drift nahi.

**Human-in-the-loop review — continuing role jise na Lesson 1 ke
mechanical criteria na Lesson 2 ka LLM-as-judge poori tarah replace
karta hai:**

\`\`\`
Automated evaluation (Lessons 1-2) hazaron cases tak scale karta hai par
real, documented limits rakhta hai: mechanical criteria subjective
quality judge nahi kar sakti, aur ek judge model ke apne biases aur
failure modes hain (Lesson 2). Human review zaroori rehta hai:

  - Judge ke scores ko periodically real human judgment ke against
    validate karne ke liye (Lesson 2 ki calibration requirement)
  - Flagged regressions ko depth mein investigate karne ke liye ek
    deploy decision se pehle
  - Genuinely novel failure modes catch karne ke liye jinke liye ek
    fixed golden dataset kabhi test karne ke liye design nahi ki gayi
    thi, kyunki ye KNOWN cases se banaya gaya tha

Ye ek temporary gap nahi hai jise automation eventually close kar dega
— ye ek structural role hai jise automated evaluation, wahi generation
mechanism (Module 1) pe built jis system ko ye test kar raha hai, khud
se poori tarah takeover nahi kar sakta.
\`\`\`

**Ye Module 14 aur is course ke Part III ko kaise close karta hai:**
Lesson 1 ne testing ki correct unit establish ki (acceptable-output
criteria, exact match nahi); Lesson 2 ne ise LLM-as-judge ke through
subjective qualities tak extend kiya, apni khud ki reliability caveats
ke saath; ye lesson dono ko ek genuine regression-testing discipline
mein assemble karta hai — ek stable, versioned golden dataset jo changes
ke across consistently chalaya jata hai, human review ke saath ek
zaroori, permanent complement ki tarah ek stopgap ke bajaye. Ye Part III
ke arc ko close karta hai: cost/model selection (Module 10), reliability
(Module 11), security (Module 12), rate limiting (Module 13), aur
evaluation (ye module) saath mein wo production-readiness discipline
banate hain jispe is course ki baaki advanced techniques (Modules 15+)
built hain.`,

    content: `## Why the golden dataset must stay identical across a before/after
comparison for that comparison to mean anything

If the eval cases themselves changed between measuring "before" and
"after" a prompt or model change, an observed score difference would
have two possible explanations — the actual change being tested, or the
eval set itself having shifted — with no way to distinguish between
them. This is the exact same principle underlying any controlled
comparison: holding everything constant except the single variable being
studied is what makes attributing an observed difference to that
variable valid. A golden dataset's value comes specifically from its
stability across a given comparison, not from being the most
sophisticated possible test set.

## Why the golden dataset still needs periodic updates, just not
silently or mid-comparison

A dataset that never changes eventually stops reflecting how a feature
is genuinely used in production — new failure modes surface, usage
patterns evolve, and edge cases discovered through real usage should be
folded into future testing so the same regression can't recur
undetected. The discipline isn't permanent immutability; it's
deliberate, versioned updates (moving from a V1 dataset to a documented
V2) rather than silent drift — a golden dataset can and should evolve,
as long as any given before/after comparison uses one consistent
version throughout, preserving the validity of that specific comparison.

## Why human review remains a structural necessity, not a temporary
gap automation will eventually close

Both of this module's automated techniques have real, inherent limits:
mechanical criteria (Lesson 1) cannot assess genuinely subjective
qualities by design, and LLM-as-judge (Lesson 2) is itself generated
text from the same mechanism (Module 1) as the system being evaluated,
carrying its own documented biases and requiring its own periodic
validation. Human review fills exactly the gaps these automated layers
cannot close by their own nature: validating whether the judge itself
remains trustworthy, investigating flagged regressions with judgment
a fixed rubric can't apply, and catching genuinely novel failure
patterns a golden dataset — built from known, already-encountered
cases — was never designed to anticipate.

## How this lesson closes Module 14 and Part III's complete arc

This module built, lesson by lesson, from the correct unit of testing
(acceptable-output criteria, not exact match) to scoring subjective
quality at scale (LLM-as-judge, with real caveats) to the production
discipline that ties both into an actual regression-testing practice
(a stable golden dataset, human review as permanent complement, not
stopgap). This closes Part III of the course: Module 10's cost/model
selection, Module 11's reliability patterns, Module 12's security
threat model, Module 13's rate limiting, and this module's evaluation
discipline together constitute what it actually means for an AI feature
to be production-ready — the foundation the rest of this course's
advanced techniques (multi-modal AI, fine-tuning, deployment at scale)
build directly on top of, rather than substitute for.`,

    contentHi: `## Golden dataset ek before/after comparison ke across identical kyun rehna chahiye us comparison ke kuch matlab rakhne ke liye

Agar eval cases khud "before" aur "after" ek prompt ya model change
measure karne ke beech badal jaate, ek observed score difference ke do
possible explanations hote — actual change jise test kiya ja raha hai,
ya eval set khud shift ho gaya — dono ke beech distinguish karne ka koi
tareeka nahi hota. Ye exactly wahi principle hai jo kisi bhi controlled
comparison ke underlying hai: us single variable ko chhodkar sab kuch
constant rakhna jise study kiya ja raha hai wo hai jo ek observed
difference ko us variable ko attribute karna valid banata hai. Ek golden
dataset ki value specifically uski stability se aati hai ek given
comparison ke across, sabse sophisticated possible test set hone se
nahi.

## Golden dataset ko abhi bhi periodic updates kyun chahiye, bas silently ya mid-comparison nahi

Ek dataset jo kabhi nahi badalta eventually ye reflect karna band kar
deta hai ki ek feature genuinely production mein kaise use hota hai —
naye failure modes surface hote hain, usage patterns evolve hote hain,
aur real usage ke through discover kiye gaye edge cases ko future
testing mein fold kiya jaana chahiye taaki wahi regression undetected
recur na ho. Discipline permanent immutability nahi hai; ye deliberate,
versioned updates hain (ek V1 dataset se ek documented V2 tak move karna)
silent drift ke bajaye — ek golden dataset evolve ho sakta hai aur hona
chahiye, jab tak koi bhi given before/after comparison ek consistent
version use karta hai poori tarah, us specific comparison ki validity
preserve karte hue.

## Human review ek structural necessity kyun rehta hai, ek temporary gap nahi jise automation eventually close kar dega

Is module ki dono automated techniques ke real, inherent limits hain:
mechanical criteria (Lesson 1) design se genuinely subjective qualities
assess nahi kar sakte, aur LLM-as-judge (Lesson 2) khud generated text
hai wahi mechanism (Module 1) se jo evaluate ho rahe system ka hai, apne
documented biases carry karte hue aur apni khud ki periodic validation
chahte hue. Human review exactly un gaps ko fill karta hai jinhe ye
automated layers apni khud ki nature se close nahi kar sakte: validate
karna ki kya judge khud trustworthy rehta hai, flagged regressions ko
us judgment ke saath investigate karna jo ek fixed rubric apply nahi kar
sakta, aur genuinely novel failure patterns catch karna jinhe ek golden
dataset — known, already-encountered cases se built — kabhi anticipate
karne ke liye design nahi ki gayi thi.

## Ye lesson Module 14 aur Part III ke complete arc ko kaise close karta hai

Ye module, lesson by lesson, testing ki correct unit se (acceptable-
output criteria, exact match nahi) scale par subjective quality score
karne tak (LLM-as-judge, real caveats ke saath) us production discipline
tak build hua jo dono ko ek actual regression-testing practice mein
tie karta hai (ek stable golden dataset, human review permanent
complement ki tarah, stopgap nahi). Ye course ke Part III ko close karta
hai: Module 10 ka cost/model selection, Module 11 ke reliability
patterns, Module 12 ka security threat model, Module 13 ki rate
limiting, aur is module ki evaluation discipline saath mein wo constitute
karte hain jiska actually matlab hai ek AI feature ka production-ready
hona — wo foundation jispe is course ki baaki advanced techniques
(multi-modal AI, fine-tuning, scale par deployment) directly build karti
hain, substitute nahi karti.`,

    examples: [
      {
        title: 'A complete regression-testing workflow with a versioned golden dataset and a human-review gate',
        titleHi: 'Ek complete regression-testing workflow ek versioned golden dataset aur ek human-review gate ke saath',
        codeJs: `// golden-dataset-v2.js — explicitly versioned, updated deliberately
// (V2 added 3 cases discovered from a real production incident)
const GOLDEN_EVAL_DATASET_V2 = [
  { id: 'faq-refund-01', input: 'Can I return a damaged item after 30 days?', criteria: {/*...*/} },
  { id: 'faq-shipping-02', input: 'How long does international shipping take?', criteria: {/*...*/} },
  { id: 'edge-case-03', input: 'What if I lost my receipt AND the item is damaged?', criteria: {/*...*/} }, // added after a real production failure
];

async function runRegressionSuite(promptVersion, dataset) {
  const results = [];
  for (const testCase of dataset) {
    const response = await getModelResponse(testCase.input, promptVersion);
    results.push({
      id: testCase.id,
      mechanicalPass: checkMechanicalCriteria(response, testCase.criteria),
      qualityScore: await judgeSubjectiveQuality(testCase.input, response),
      response,
    });
  }
  return results;
}

async function deployWithRegressionGate(currentPromptVersion, candidatePromptVersion) {
  // BOTH runs use the EXACT SAME dataset version — this is what
  // makes the comparison valid
  const before = await runRegressionSuite(currentPromptVersion, GOLDEN_EVAL_DATASET_V2);
  const after = await runRegressionSuite(candidatePromptVersion, GOLDEN_EVAL_DATASET_V2);

  const regressions = after.filter((r, i) =>
    (before[i].mechanicalPass && !r.mechanicalPass) ||
    r.qualityScore.helpfulness < before[i].qualityScore.helpfulness - 1,
  );

  if (regressions.length > 0) {
    // HUMAN REVIEW GATE — never auto-deploy past a detected regression
    await flagForHumanReview(regressions, { currentPromptVersion, candidatePromptVersion });
    return { deployed: false, reason: 'Regressions detected, awaiting human review' };
  }

  await deployToProduction(candidatePromptVersion);
  return { deployed: true };
}`,
        codeTs: `// golden-dataset-v2.ts — explicitly versioned, updated deliberately
// (V2 added 3 cases discovered from a real production incident)
interface EvalCase { id: string; input: string; criteria: unknown; }

const GOLDEN_EVAL_DATASET_V2: EvalCase[] = [
  { id: 'faq-refund-01', input: 'Can I return a damaged item after 30 days?', criteria: {/*...*/} },
  { id: 'faq-shipping-02', input: 'How long does international shipping take?', criteria: {/*...*/} },
  { id: 'edge-case-03', input: 'What if I lost my receipt AND the item is damaged?', criteria: {/*...*/} }, // added after a real production failure
];

interface RegressionResult {
  id: string;
  mechanicalPass: boolean;
  qualityScore: { helpfulness: number; tone: number };
  response: string;
}

async function runRegressionSuite(promptVersion: string, dataset: EvalCase[]): Promise<RegressionResult[]> {
  const results: RegressionResult[] = [];
  for (const testCase of dataset) {
    const response = await getModelResponse(testCase.input, promptVersion);
    results.push({
      id: testCase.id,
      mechanicalPass: checkMechanicalCriteria(response, testCase.criteria),
      qualityScore: await judgeSubjectiveQuality(testCase.input, response),
      response,
    });
  }
  return results;
}

async function deployWithRegressionGate(currentPromptVersion: string, candidatePromptVersion: string) {
  // BOTH runs use the EXACT SAME dataset version — this is what
  // makes the comparison valid
  const before = await runRegressionSuite(currentPromptVersion, GOLDEN_EVAL_DATASET_V2);
  const after = await runRegressionSuite(candidatePromptVersion, GOLDEN_EVAL_DATASET_V2);

  const regressions = after.filter((r, i) =>
    (before[i].mechanicalPass && !r.mechanicalPass) ||
    r.qualityScore.helpfulness < before[i].qualityScore.helpfulness - 1,
  );

  if (regressions.length > 0) {
    // HUMAN REVIEW GATE — never auto-deploy past a detected regression
    await flagForHumanReview(regressions, { currentPromptVersion, candidatePromptVersion });
    return { deployed: false, reason: 'Regressions detected, awaiting human review' };
  }

  await deployToProduction(candidatePromptVersion);
  return { deployed: true };
}`,
        code: `const before = await runRegressionSuite(currentPromptVersion, GOLDEN_EVAL_DATASET_V2);
const after = await runRegressionSuite(candidatePromptVersion, GOLDEN_EVAL_DATASET_V2);
// same dataset version both times — isolates the prompt change as the only variable
if (regressions.length > 0) await flagForHumanReview(regressions, {...});
else await deployToProduction(candidatePromptVersion);`,
        output:
          "A candidate prompt change is tested against the exact same 3-case golden dataset used for the current production version — any score difference is attributable purely to the prompt change, not dataset drift. A detected regression halts automatic deployment and routes to human review rather than blocking or silently allowing the deploy.",
        explain:
          "The dataset (GOLDEN_EVAL_DATASET_V2) is used identically in both the 'before' and 'after' runs within the same comparison — this is the concrete implementation of this lesson's core principle that a stable, unchanged dataset is what makes a before/after comparison valid, with human review as the gate for anything the automated check flags rather than an automatic block or automatic pass.",
        explainHi:
          "Dataset (GOLDEN_EVAL_DATASET_V2) wahi comparison ke andar dono 'before' aur 'after' runs mein identically use hota hai — ye is lesson ke core principle ka concrete implementation hai ki ek stable, unchanged dataset wo hai jo ek before/after comparison ko valid banata hai, human review ke saath gate ki tarah kisi bhi cheez ke liye jise automated check flag karta hai ek automatic block ya automatic pass ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Silently modifying the eval dataset between "before" and "after" runs
async function compareVersions(oldVersion, newVersion) {
  const before = await runRegressionSuite(oldVersion, evalDatasetV1);
  // Someone updated the dataset in between, adding new cases, without
  // anyone noticing or documenting it as a version change
  const after = await runRegressionSuite(newVersion, evalDatasetV1_slightly_modified);
  // Any score difference could now be due to the prompt change OR the
  // dataset change — genuinely impossible to distinguish after the fact
  return compareResults(before, after);
}`,
        right: `// Using an explicitly versioned, stable dataset for a valid comparison
import { GOLDEN_EVAL_DATASET_V1 } from './eval-datasets/v1';

async function compareVersions(oldVersion, newVersion) {
  const before = await runRegressionSuite(oldVersion, GOLDEN_EVAL_DATASET_V1);
  const after = await runRegressionSuite(newVersion, GOLDEN_EVAL_DATASET_V1); // SAME dataset
  // Any score difference is now attributable purely to the prompt/model
  // change, since the dataset was held constant
  return compareResults(before, after);
}
// A future dataset update becomes GOLDEN_EVAL_DATASET_V2, used
// consistently for its own future comparisons — never mixed mid-comparison`,
        why: "If the eval dataset changes between measuring 'before' and 'after' a prompt or model change, an observed score difference has two possible explanations with no way to distinguish them — the actual change, or the dataset shift. Holding the dataset constant across a comparison is what isolates the actual variable being tested.",
        whyHi:
          "Agar eval dataset ek prompt ya model change ka 'before' aur 'after' measure karne ke beech badal jaata hai, ek observed score difference ke do possible explanations hain unhe distinguish karne ka koi tareeka ke bina — actual change, ya dataset shift. Ek comparison ke across dataset ko constant rakhna wo hai jo actual variable ko isolate karta hai jise test kiya ja raha hai.",
      },
    ],

    realWorld: [
      {
        en: "A production AI product maintains its golden dataset under version control alongside its actual code, requiring any dataset change to go through the same pull-request review process as a code change, specifically to prevent the exact silent-drift problem that would otherwise make every prompt-version comparison unreliable.",
        hi: 'Ek production AI product apna golden dataset version control ke under apne actual code ke saath maintain karta hai, kisi bhi dataset change ko wahi pull-request review process se guzarne ki maang karte hue jo ek code change ko chahiye, specifically exactly wo silent-drift problem prevent karne ke liye jo otherwise har prompt-version comparison ko unreliable bana degi.',
      },
    ],

    interviewQA: [
      {
        q: "Why must a golden dataset stay identical between a 'before' and 'after' comparison for that comparison to be meaningful?",
        qHi: 'Ek golden dataset ko ek "before" aur "after" comparison ke beech identical kyun rehna chahiye us comparison ke meaningful hone ke liye?',
        a: "If the eval cases changed between the two measurements, an observed score difference could be explained either by the actual prompt/model change or by the dataset itself having shifted — these become genuinely indistinguishable. Holding the dataset constant isolates the single variable actually being tested, the same principle underlying any controlled comparison.",
        aHi: 'Agar do measurements ke beech eval cases badal jaate, ek observed score difference ya to actual prompt/model change se ya dataset khud shift hone se explain ki ja sakti thi — ye genuinely indistinguishable ban jaate hain. Dataset ko constant rakhna us single variable ko isolate karta hai jise actually test kiya ja raha hai, wahi principle jo kisi bhi controlled comparison ke underlying hai.',
      },
      {
        q: 'Why does human review remain a structural necessity rather than a gap that better automated evaluation will eventually close?',
        qHi: 'Human review ek structural necessity kyun rehta hai ek gap ke bajaye jise better automated evaluation eventually close kar degi?',
        a: "Mechanical criteria (Lesson 1) cannot assess subjective quality by design, and LLM-as-judge (Lesson 2) is itself generated text from the same mechanism as the system being evaluated, with its own documented biases requiring periodic validation. Human review fills exactly these structural gaps: validating the judge's own reliability, investigating flagged regressions, and catching genuinely novel failure modes a golden dataset built from known cases was never designed to anticipate.",
        aHi: 'Mechanical criteria (Lesson 1) design se subjective quality assess nahi kar sakte, aur LLM-as-judge (Lesson 2) khud wahi mechanism se generated text hai jo evaluate ho rahe system ka hai, apne documented biases ke saath jinhe periodic validation chahiye. Human review exactly in structural gaps ko fill karta hai: judge ki apni reliability validate karna, flagged regressions investigate karna, aur genuinely novel failure modes catch karna jinhe ek golden dataset known cases se built kabhi anticipate karne ke liye design nahi ki gayi thi.',
      },
    ],

    exercises: [
      {
        task: "A team runs their regression suite against a golden dataset that hasn't been updated in over a year, even though production has surfaced several genuinely new failure modes during that time that aren't represented in the dataset. Using this lesson's reasoning, explain the risk this creates and describe the correct way to address it.",
        taskHi: 'Ek team apna regression suite ek golden dataset ke against chalati hai jo ek saal se zyada se update nahi hua, chahe production ne us time ke dauran kai genuinely naye failure modes surface kiye hain jo dataset mein represented nahi hain. Is lesson ki reasoning use karke, is se create hone wale risk ko explain karo aur ise address karne ka correct tareeka describe karo.',
        hint: "Distinguish between the discipline of keeping a dataset stable WITHIN a single comparison and the separate need to deliberately, visibly update it over time as new failure modes are discovered.",
        hintHi: 'Ek dataset ko EK comparison ke andar stable rakhne ki discipline aur ise time ke saath deliberately, visibly update karne ki separate zaroorat ke beech distinguish karo jaise naye failure modes discover hote hain.',
      },
    ],

    keyTakeaways: [
      "A golden dataset must stay identical across a before/after comparison — changing it mid-comparison makes an observed score difference impossible to attribute to the actual change being tested versus the dataset itself shifting.",
      "The golden dataset still needs periodic updates as new failure modes are discovered in production, but as deliberate, versioned changes (V1 to V2), never silent drift within an ongoing comparison.",
      "Human review remains a structural necessity, not a temporary gap: it validates the judge's own reliability (Lesson 2), investigates flagged regressions, and catches genuinely novel failure modes a golden dataset built from known cases was never designed to anticipate.",
      "This lesson closes Part III's arc: cost/model selection (Module 10), reliability (Module 11), security (Module 12), rate limiting (Module 13), and evaluation (this module) together constitute production-readiness, the foundation this course's remaining advanced techniques build on top of.",
    ],
    keyTakeawaysHi: [
      'Ek golden dataset ko ek before/after comparison ke across identical rehna chahiye — ise mid-comparison badalna ek observed score difference ko attribute karna impossible bana deta hai us actual change ko jo test ki jaa rahi hai versus dataset khud shift hone ko.',
      'Golden dataset ko abhi bhi periodic updates chahiye jaise production mein naye failure modes discover hote hain, par deliberate, versioned changes ki tarah (V1 se V2), kabhi ek ongoing comparison ke andar silent drift nahi.',
      'Human review ek structural necessity rehta hai, ek temporary gap nahi: ye judge ki apni reliability validate karta hai (Lesson 2), flagged regressions investigate karta hai, aur genuinely novel failure modes catch karta hai jinhe ek golden dataset known cases se built kabhi anticipate karne ke liye design nahi ki gayi thi.',
      'Ye lesson Part III ke arc ko close karta hai: cost/model selection (Module 10), reliability (Module 11), security (Module 12), rate limiting (Module 13), aur evaluation (ye module) saath mein production-readiness constitute karte hain, wo foundation jispe is course ki baaki advanced techniques build karti hain.',
    ],
  },
];
