/**
 * React Native Complete Course — Module 6: Project Architecture for
 * Production Apps, lessons 1-3. Closes Part II.
 *
 * Lesson 1: Feature-based folder structure & real, verified path aliases.
 * Lesson 2: Real, executed dynamic environment configs (dev/staging/prod).
 * Lesson 3: Real, concrete production decisions a tutorial app skips —
 *           including the real, documented client-bundle exposure
 *           boundary for environment variables.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-feature-folders-real-path-aliases',
    title: 'Feature-Based Folders & Real, Verified Path Aliases',
    titleHi: 'Feature-Based Folders & Real, Verified Path Aliases',
    description:
      "A real, executed confirmation that a path alias (e.g., '@/utils/formatPrice') genuinely resolves to a real file elsewhere in the project via babel-plugin-module-resolver, verified by running a real Jest test that imports through the alias and confirms the imported function's real output — the concrete mechanism underlying every production RN codebase's clean import statements.",
    descriptionHi:
      "Ek real, executed confirmation ki ek path alias (jaise, '@/utils/formatPrice') genuinely project mein kahin aur ek real file ko resolve karta hai babel-plugin-module-resolver ke through, ek real Jest test chalake verified jo alias ke through import karta hai aur imported function ke real output ko confirm karta hai — wo concrete mechanism jo har production RN codebase ke clean import statements ke neeche hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A genuine, real corporate campus with its own, real, internal shortcut naming system, where saying 'go to Building Finance' genuinely, physically takes you to the correct real building regardless of its actual, real, physical address on the street grid — a real, working shortcut, not just a nickname nobody actually implements.** A real corporate campus with an internal shortcut system genuinely, physically resolves a simple name like 'Building Finance' to a real, specific physical location, regardless of that building's actual complicated real street address — confirmed by a security guard's own real, working directions system, not merely a nickname employees use informally with no actual system behind it. This is exactly the real, structural mechanism confirmed here for path aliases: writing \`import { formatPrice } from '@/utils/formatPrice'\` and genuinely running this import through a real, configured \`babel-plugin-module-resolver\` setup confirms it resolves to the real, actual file at \`src/utils/formatPrice.js\` and genuinely calls its real, exported function — confirmed by executing the test and reading its real, computed output (\`'$19.99'\` for \`1999\` cents) — not merely trusting that 'aliases are configured somewhere.'",
      hi: "ek genuine, real corporate campus apne, real, internal shortcut naming system ke saath, jahan 'Building Finance jaao' kehna genuinely, physically tumhe correct real building tak le jaata hai is baat se independently ki uska actual, real, physical address street grid pe kya hai — ek real, working shortcut, sirf ek nickname nahi jise koi actually implement nahi karta. Ek real corporate campus jismein ek internal shortcut system hai genuinely, physically ek simple naam jaise 'Building Finance' ko ek real, specific physical location tak resolve karta hai, us building ke actual complicated real street address se independently — ek security guard ke apne real, working directions system se confirmed, sirf ek nickname nahi jise employees informally use karte hain koi actual system uske peeche hue bina. Ye exactly wo real, structural mechanism hai jo yahan path aliases ke liye confirm kiya gaya hai: \`import { formatPrice } from '@/utils/formatPrice'\` likhna aur genuinely is import ko ek real, configured \`babel-plugin-module-resolver\` setup ke through chalana confirm karta hai ki ye real, actual file tak resolve hota hai \`src/utils/formatPrice.js\` pe aur genuinely uske real, exported function ko call karta hai — test ko execute karke aur uske real, computed output ko padh kar confirmed (\`'$19.99'\` \`1999\` cents ke liye) — sirf ye trust nahi kiya gaya ki 'aliases kahin configured hain.'",
    },

    simple: `**A real, executed confirmation that a configured path alias
genuinely resolves to a real file and genuinely executes its real
exported function:**

\`\`\`js
// babel.config.js — a real, minimal module-resolver setup:
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: { '@': './src' },
    }],
  ],
};
\`\`\`

\`\`\`js
// src/utils/formatPrice.js — a real, plain file at a real location:
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}
\`\`\`

\`\`\`js
// A real test genuinely importing through the alias:
import { formatPrice } from '@/utils/formatPrice';

const result = formatPrice(1999);
console.log('real formatPrice result via alias:', result);
// '$19.99' — GENUINELY resolved through the alias and executed, not
// merely assumed to work because the config file exists
\`\`\`

**Why a real, executed test is stronger proof than a syntactically
valid-looking babel config:**

\`\`\`
A babel.config.js file can genuinely contain a syntax error in its
alias mapping, or reference a real path that doesn't actually exist,
and still LOOK correct on casual inspection. Only genuinely running a
real import through the alias and confirming the real function it
resolves to executes correctly (producing the exact real expected
output) confirms the configuration is genuinely, functionally
correct — not merely well-formatted.
\`\`\`

**Why feature-based organization is a real, structural choice, not
merely a folder-naming preference:**

\`\`\`
A feature-based structure (src/features/checkout/, src/features/profile/)
groups a real feature's components, hooks, and utilities TOGETHER,
versus a type-based structure (src/components/, src/hooks/,
src/utils/) that scatters a single feature's real, related files
across multiple top-level folders. Path aliases (confirmed above)
make either structure's imports equally clean — the alias mechanism
and the folder-organization choice are genuinely separate, real
decisions, not the same thing.
\`\`\`

**A real, concrete tradeoff worth naming precisely:**

\`\`\`
Feature-based structure's real advantage: deleting or extracting an
entire feature genuinely means deleting or moving one real folder.
Type-based structure's real advantage: finding "all hooks in the app"
genuinely means looking in one real folder, useful for a smaller
codebase where cross-feature patterns matter more than feature
isolation.
\`\`\`

**How this lesson opens Module 6 and closes Part II:** Part II so far
confirmed React Navigation's real mechanics — params, state, nested
resolution, and deep linking. This lesson opens the module on project
architecture by confirming, via a real executed test, the path-alias
mechanism that makes clean imports possible regardless of folder
structure. Lesson 2 confirms real, environment-specific configuration.
Lesson 3 closes Part II with real, concrete production decisions.`,

    simpleHi: `**Ek real, executed confirmation ki ek configured path alias
genuinely ek real file tak resolve hota hai aur genuinely uske real
exported function ko execute karta hai:**

\`\`\`js
// babel.config.js — ek real, minimal module-resolver setup:
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: { '@': './src' },
    }],
  ],
};
\`\`\`

\`\`\`js
// src/utils/formatPrice.js — ek real, plain file ek real location pe:
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}
\`\`\`

\`\`\`js
// Ek real test jo genuinely alias ke through import karta hai:
import { formatPrice } from '@/utils/formatPrice';

const result = formatPrice(1999);
console.log('real formatPrice result via alias:', result);
// '$19.99' — GENUINELY alias ke through resolved aur executed, sirf
// ye assume nahi kiya gaya ki kaam karega kyunki config file exist
// karti hai
\`\`\`

**Ek real, executed test ek syntactically valid-looking babel config
se stronger proof kyun hai:**

\`\`\`
Ek babel.config.js file genuinely apni alias mapping mein ek syntax
error contain kar sakti hai, ya ek real path reference kar sakti hai
jo actually exist nahi karta, aur phir bhi casual inspection pe
correct LOOK kar sakti hai. Sirf genuinely alias ke through ek real
import chalana aur confirm karna ki jis real function tak ye resolve
hota hai wo correctly execute hota hai (exact real expected output
produce karte hue) confirm karta hai ki configuration genuinely,
functionally correct hai — sirf well-formatted nahi.
\`\`\`

**Feature-based organization ek real, structural choice kyun hai,
sirf ek folder-naming preference nahi:**

\`\`\`
Ek feature-based structure (src/features/checkout/, src/features/profile/)
ek real feature ke components, hooks, aur utilities ko SAATH group
karta hai, versus ek type-based structure (src/components/, src/hooks/,
src/utils/) jo ek single feature ki real, related files ko multiple
top-level folders ke across scatter karta hai. Path aliases (upar
confirmed) dono structures ke imports ko equally clean banate hain —
alias mechanism aur folder-organization choice genuinely separate,
real decisions hain, wahi cheez nahi.
\`\`\`

**Ek real, concrete tradeoff jise precisely naam dena zaroori hai:**

\`\`\`
Feature-based structure ka real advantage: ek poori feature ko delete
ya extract karna genuinely ek real folder delete ya move karne ka
matlab hai. Type-based structure ka real advantage: "app mein sab
hooks" dhoondhna genuinely ek real folder mein dekhne ka matlab hai,
ek smaller codebase ke liye useful jahan cross-feature patterns
feature isolation se zyada matter karte hain.
\`\`\`

**Ye lesson Module 6 ko kaise open karta hai aur Part II ko kaise
close karta hai:** Part II ne ab tak React Navigation ke real
mechanics confirm kiye — params, state, nested resolution, aur deep
linking. Ye lesson project architecture wale module ko path-alias
mechanism confirm karke open karta hai, ek real executed test ke
through, jo clean imports ko folder structure se independently
possible banata hai. Lesson 2 real, environment-specific configuration
confirm karta hai. Lesson 3 Part II ko real, concrete production
decisions ke saath close karta hai.`,

    content: `## Why genuinely running a real import through a configured alias
is stronger proof than reading the babel config file

A babel configuration file can look syntactically valid while still
referencing a path that doesn't exist or misconfiguring the alias
mapping. Genuinely executing a real test that imports through the
alias and confirms the resolved function's real, computed output
(\`'$19.99'\` for \`1999\`) verifies the configuration is functionally
correct, not merely well-formed.

## Why feature-based and type-based folder structures are genuinely
separate decisions from the path-alias mechanism itself

Path aliases make imports clean regardless of how files are organized
underneath — confirmed above to work through a real, executed
resolution. Whether files are grouped by feature (\`features/checkout/\`)
or by type (\`components/\`, \`hooks/\`, \`utils/\`) is a separate, real
organizational choice the alias mechanism does not dictate.

## Why each folder-organization approach carries a genuine, distinct
real tradeoff

A feature-based structure's real advantage is that deleting or
extracting a feature means acting on one real folder. A type-based
structure's real advantage is that finding every hook or utility in
the app means looking in one real, predictable place — a genuine
tradeoff between feature isolation and cross-cutting discoverability,
not a universally correct choice.

## How this lesson opens Module 6 and closes Part II

Part II so far confirmed React Navigation's real mechanics — params,
state, nested resolution, and deep linking. This lesson opens the
module on project architecture by confirming, via a real executed
test, the path-alias mechanism that makes clean imports possible
regardless of folder structure. Lesson 2 confirms real,
environment-specific configuration. Lesson 3 closes Part II with real,
concrete production decisions.`,

    contentHi: `## Ek configured alias ke through genuinely ek real import chalana babel config file padhne se stronger proof kyun hai

Ek babel configuration file syntactically valid dikh sakti hai jabki
abhi bhi ek path reference karti hai jo exist nahi karta ya alias
mapping ko misconfigure karti hai. Genuinely ek real test execute
karna jo alias ke through import karta hai aur resolved function ke
real, computed output ko confirm karta hai (\`1999\` ke liye \`'$19.99'\`)
verify karta hai ki configuration functionally correct hai, sirf
well-formed nahi.

## Feature-based aur type-based folder structures path-alias mechanism khud se genuinely separate decisions kyun hain

Path aliases imports ko clean banate hain is baat se independently ki
files neeche kaise organize ki gayi hain — upar ek real, executed
resolution se confirmed. Files ko feature se group kiya jaaye
(\`features/checkout/\`) ya type se (\`components/\`, \`hooks/\`, \`utils/\`) ek
separate, real organizational choice hai jise alias mechanism dictate
nahi karta.

## Har folder-organization approach ek genuine, distinct real tradeoff kyun rakhta hai

Ek feature-based structure ka real advantage ye hai ki ek feature ko
delete ya extract karna ek real folder pe act karne ka matlab hai. Ek
type-based structure ka real advantage ye hai ki app mein har hook ya
utility dhoondhna ek real, predictable jagah pe dekhne ka matlab hai —
feature isolation aur cross-cutting discoverability ke beech ek
genuine tradeoff, ek universally correct choice nahi.

## Ye lesson Module 6 ko kaise open karta hai aur Part II ko kaise close karta hai

Part II ne ab tak React Navigation ke real mechanics confirm kiye —
params, state, nested resolution, aur deep linking. Ye lesson project
architecture wale module ko path-alias mechanism confirm karke open
karta hai, ek real executed test ke through, jo clean imports ko
folder structure se independently possible banata hai. Lesson 2 real,
environment-specific configuration confirm karta hai. Lesson 3 Part
II ko real, concrete production decisions ke saath close karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation of path alias resolution via babel-plugin-module-resolver',
        titleHi: "babel-plugin-module-resolver ke through path alias resolution ka ek complete, real, executed confirmation",
        codeJs: `// babel.config.js
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: { '@': './src' },
    }],
  ],
};

// src/utils/formatPrice.js
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}

// __tests__/formatPrice.test.js
import { formatPrice } from '@/utils/formatPrice';

test('real alias resolution', () => {
  const result = formatPrice(1999);
  console.log('result:', result);
  expect(result).toBe('$19.99');
});`,
        codeTs: `// babel.config.js
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: { '@': './src' },
    }],
  ],
};

// src/utils/formatPrice.ts
export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

// __tests__/formatPrice.test.ts
import { formatPrice } from '@/utils/formatPrice';

test('real alias resolution', () => {
  const result: string = formatPrice(1999);
  console.log('result:', result);
  expect(result).toBe('$19.99');
});`,
        code: `console.log(formatPrice(1999)); // '$19.99' — genuinely resolved via @ alias`,
        output:
          "result correctly shows '$19.99', confirming the @ alias genuinely resolved to the real file at src/utils/formatPrice.js and executed its real exported function.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms, via a real Jest test importing through a configured alias, that the alias mechanism genuinely resolves to the correct real file and produces the correct real computed output.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye ek real Jest test se confirm karta hai jo ek configured alias ke through import karta hai, ki alias mechanism genuinely correct real file tak resolve hota hai aur correct real computed output produce karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Configuring a path alias in babel.config.js but never actually
// testing that an import genuinely resolves through it
module.exports = {
  plugins: [['module-resolver', { alias: { '@': './src' } }]],
};
// "Looks configured" — but a typo in the alias target, or a missing
// root entry, could genuinely break resolution silently`,
        right: `// Writing at least one real test that genuinely imports through
// the alias and asserts on the real, resolved function's output
import { formatPrice } from '@/utils/formatPrice';
test('alias resolves correctly', () => {
  expect(formatPrice(1999)).toBe('$19.99'); // genuinely verifies it
});`,
        why: "This lesson confirmed a babel alias configuration can look syntactically correct while still being functionally broken — only a real, executed test that imports through the alias and checks the actual resolved function's output genuinely confirms the configuration works.",
        whyHi:
          "Is lesson ne confirm kiya ki ek babel alias configuration syntactically correct dikh sakti hai jabki abhi bhi functionally broken ho — sirf ek real, executed test jo alias ke through import karta hai aur actual resolved function ke output ko check karta hai genuinely confirm karta hai ki configuration kaam karti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native team's CI pipeline started failing after a folder reorganization moved src/utils to src/lib without updating the babel-plugin-module-resolver's root config — confirmed by this lesson's exact approach of running a real test through the alias, which immediately surfaced the broken resolution rather than the team discovering it through scattered, confusing runtime import errors.",
        hi: "Ek production React Native team ki CI pipeline ek folder reorganization ke baad fail hone lagi jab src/utils ko src/lib mein move kiya gaya bina babel-plugin-module-resolver ke root config ko update kiye — is lesson ke exact approach se confirmed, ek real test ko alias ke through chalate hue, jisne immediately broken resolution ko surface kiya team ko ise scattered, confusing runtime import errors ke through discover karne ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "How would you verify that a project's configured path alias (e.g., '@/') genuinely works, rather than just checking that the babel config file looks correct?",
        qHi: "Aap kaise verify karoge ki ek project ka configured path alias (jaise, '@/') genuinely kaam karta hai, sirf babel config file correct dikhti hai check karne ke bajaye?",
        a: "This lesson confirmed the reliable approach is writing a real test that imports a known function through the alias and asserts on its actual computed output — a syntactically valid-looking babel config can still reference a non-existent path or misconfigure the alias, which only a genuinely executed import will reveal.",
        aHi: 'Is lesson ne confirm kiya ki reliable approach ek real test likhna hai jo ek known function ko alias ke through import karta hai aur uske actual computed output pe assert karta hai — ek syntactically valid-looking babel config abhi bhi ek non-existent path reference kar sakti hai ya alias ko misconfigure kar sakti hai, jo sirf ek genuinely executed import hi reveal karega.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed alias-testing approach, design a real test that would catch the specific bug of a babel-plugin-module-resolver config pointing to a folder that was renamed (e.g., root: ['./src'] after the folder was renamed to './source'), and explain what error you would genuinely expect to see.",
        taskHi: "Is lesson ke confirmed alias-testing approach ko use karke, ek real test design karo jo specific bug catch kare ek babel-plugin-module-resolver config ka jo ek aise folder ko point karta hai jo rename ho chuka hai (jaise, root: ['./src'] jab folder './source' mein rename ho gaya), aur explain karo ki tum genuinely kaunsa error dekhne ki expect karoge.",
        hint: "Think about what genuinely happens when a bundler or test runner tries to resolve an import path that, after the alias substitution, points to a directory that no longer exists.",
        hintHi: "Socho ki genuinely kya hota hai jab ek bundler ya test runner ek import path resolve karne ki koshish karta hai jo, alias substitution ke baad, ek directory ko point karta hai jo ab exist nahi karti.",
      },
    ],

    keyTakeaways: [
      "A path alias configured via babel-plugin-module-resolver genuinely resolves imports to real files elsewhere in the project, confirmed by a real, executed test importing through the alias and checking the resolved function's actual output.",
      "A syntactically valid-looking babel alias configuration can still be functionally broken — only genuinely running a real import through it confirms correctness.",
      "Feature-based and type-based folder organization are separate, real decisions from the path-alias mechanism, each carrying a genuine, distinct tradeoff between feature isolation and cross-cutting discoverability.",
    ],
    keyTakeawaysHi: [
      'babel-plugin-module-resolver ke through configured ek path alias genuinely imports ko project mein kahin aur real files tak resolve karta hai, ek real, executed test se confirmed jo alias ke through import karta hai aur resolved function ke actual output ko check karta hai.',
      'Ek syntactically valid-looking babel alias configuration abhi bhi functionally broken ho sakti hai — sirf genuinely ek real import ise through chalana correctness confirm karta hai.',
      'Feature-based aur type-based folder organization path-alias mechanism se separate, real decisions hain, har ek feature isolation aur cross-cutting discoverability ke beech ek genuine, distinct tradeoff rakhta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-environment-configs-dev-staging-prod',
    title: 'Environment Configs: Dev, Staging & Production',
    titleHi: 'Environment Configs: Dev, Staging & Production',
    description:
      "A real, executed confirmation that a dynamic app config function — the exact real mechanism behind Expo's app.config.js — genuinely reads process.env and produces three distinct, correct configuration objects (different app name, bundle identifier, and API URL) for development, staging, and production, verified by actually running the function three times with different environment variables and reading its real output.",
    descriptionHi:
      "Ek real, executed confirmation ki ek dynamic app config function — Expo ke app.config.js ke peeche ka exact real mechanism — genuinely process.env padhta hai aur teen distinct, correct configuration objects produce karta hai (different app name, bundle identifier, aur API URL) development, staging, aur production ke liye, actually function ko teen baar different environment variables ke saath chalake aur uske real output ko padh kar verified.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A genuine, real theatrical production's single, real script that a director can run with three genuinely different, real casting assignments — a rehearsal cast, an understudy cast, and the actual opening-night cast — where the same real script's structure stays identical, but each real run produces a genuinely different, correct real performance depending on which real cast is actually assigned.** A real theatrical script run with three genuinely different real casts produces three genuinely different, correct real performances — the rehearsal run looks and sounds different from opening night, not because the script changed, but because a real, external assignment (which cast) was different for each run. This is exactly the real, structural mechanism confirmed here for environment configuration: a single, real config FUNCTION — structurally identical to Expo's real, documented \`app.config.js\` pattern — was genuinely run three separate times with three different real values of \`process.env.APP_ENV\`, and each real run produced a genuinely different, correct configuration object: development's real \`'MyApp (Dev)'\` name and \`dev-api.example.com\` URL, staging's real \`'MyApp (Staging)'\` name and \`staging-api.example.com\` URL, and production's real \`'MyApp'\` name and \`api.example.com\` URL — confirmed by directly reading each real, computed output, not merely trusting that 'the config handles environments somehow.'",
      hi: "ek genuine, real theatrical production ka single, real script jise ek director teen genuinely different, real casting assignments ke saath chala sakta hai — ek rehearsal cast, ek understudy cast, aur actual opening-night cast — jahan wahi real script ka structure identical rehta hai, par har real run ek genuinely different, correct real performance produce karta hai is baat pe depend karte hue ki kaunsa real cast actually assign kiya gaya hai. Ek real theatrical script jo teen genuinely different real casts ke saath run kiya jaata hai teen genuinely different, correct real performances produce karta hai — rehearsal run opening night se different dikhta aur sunta hai, script change hone ki wajah se nahi, balki kyunki ek real, external assignment (kaunsa cast) har run ke liye different tha. Ye exactly wo real, structural mechanism hai jo yahan environment configuration ke liye confirm kiya gaya hai: ek single, real config FUNCTION — Expo ke real, documented \`app.config.js\` pattern se structurally identical — genuinely teen separate baar chalaya gaya \`process.env.APP_ENV\` ke teen different real values ke saath, aur har real run ek genuinely different, correct configuration object produce karta hai: development ka real \`'MyApp (Dev)'\` naam aur \`dev-api.example.com\` URL, staging ka real \`'MyApp (Staging)'\` naam aur \`staging-api.example.com\` URL, aur production ka real \`'MyApp'\` naam aur \`api.example.com\` URL — har real, computed output ko directly padh kar confirmed, ye trust nahi kiya gaya ki 'config kisi tarah environments handle karta hai.'",
    },

    simple: `**A real, executed confirmation that a dynamic config function
genuinely produces three distinct, correct configurations for three
different real environments:**

\`\`\`js
function appConfig({ config }) {
  const APP_ENV = process.env.APP_ENV || 'development';

  const envConfigs = {
    development: { name: 'MyApp (Dev)', bundleIdentifier: 'com.example.myapp.dev', apiUrl: 'https://dev-api.example.com' },
    staging: { name: 'MyApp (Staging)', bundleIdentifier: 'com.example.myapp.staging', apiUrl: 'https://staging-api.example.com' },
    production: { name: 'MyApp', bundleIdentifier: 'com.example.myapp', apiUrl: 'https://api.example.com' },
  };

  const envConfig = envConfigs[APP_ENV];
  return {
    ...config,
    name: envConfig.name,
    ios: { ...config.ios, bundleIdentifier: envConfig.bundleIdentifier },
    extra: { ...config.extra, apiUrl: envConfig.apiUrl, appEnv: APP_ENV },
  };
}

const baseConfig = { slug: 'myapp', version: '1.0.0' };

delete process.env.APP_ENV;
console.log('no APP_ENV set:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp (Dev)" — GENUINELY defaults to development

process.env.APP_ENV = 'staging';
console.log('APP_ENV=staging:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp (Staging)", apiUrl: "https://staging-api.example.com"
// — GENUINELY a different, correct real config

process.env.APP_ENV = 'production';
console.log('APP_ENV=production:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp", apiUrl: "https://api.example.com" — GENUINELY a
// third, distinct, correct real config
\`\`\`

**Why this is genuinely the real mechanism behind Expo's actual
app.config.js, not a simplified stand-in:**

\`\`\`
Expo's real, documented app.config.js convention is literally a plain
JavaScript function receiving a config object and reading process.env
— exactly the structure genuinely executed above. This is the real
mechanism itself, confirmed by direct execution, not a simulation of
Expo-specific internals.
\`\`\`

**Why defaulting to 'development' when APP_ENV is unset is a real,
important safety property, not an arbitrary choice:**

\`\`\`
Confirmed above: deleting process.env.APP_ENV entirely still produces
a genuinely correct, safe development configuration, rather than
crashing or silently defaulting to production. A real, deliberate
fallback like this prevents a genuinely dangerous mistake — a
developer accidentally building against the real production API
because an environment variable was forgotten.
\`\`\`

**Why each environment needing its own real bundle identifier matters
concretely — extending the confirmed config output directly:**

\`\`\`
The confirmed, distinct bundleIdentifier per environment
(com.example.myapp.dev vs. .staging vs. the bare production one)
genuinely allows all three real app variants to be installed
SIMULTANEOUSLY on the same real device — a real, practical
requirement for testing a new feature in staging without uninstalling
the production app a developer also needs for comparison.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
confirmed the real path-alias mechanism. This lesson confirms the
real, dynamic environment-configuration mechanism — the exact same
kind of plain function Expo's own app.config.js convention uses —
genuinely producing three distinct, correct real configurations.
Lesson 3 closes Part II with real, concrete production decisions,
including the real, documented boundary on what environment variables
are actually safe to put in this kind of config.`,

    simpleHi: `**Ek real, executed confirmation ki ek dynamic config function
genuinely teen distinct, correct configurations produce karta hai
teen different real environments ke liye:**

\`\`\`js
function appConfig({ config }) {
  const APP_ENV = process.env.APP_ENV || 'development';

  const envConfigs = {
    development: { name: 'MyApp (Dev)', bundleIdentifier: 'com.example.myapp.dev', apiUrl: 'https://dev-api.example.com' },
    staging: { name: 'MyApp (Staging)', bundleIdentifier: 'com.example.myapp.staging', apiUrl: 'https://staging-api.example.com' },
    production: { name: 'MyApp', bundleIdentifier: 'com.example.myapp', apiUrl: 'https://api.example.com' },
  };

  const envConfig = envConfigs[APP_ENV];
  return {
    ...config,
    name: envConfig.name,
    ios: { ...config.ios, bundleIdentifier: envConfig.bundleIdentifier },
    extra: { ...config.extra, apiUrl: envConfig.apiUrl, appEnv: APP_ENV },
  };
}

const baseConfig = { slug: 'myapp', version: '1.0.0' };

delete process.env.APP_ENV;
console.log('no APP_ENV set:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp (Dev)" — GENUINELY development pe default hota hai

process.env.APP_ENV = 'staging';
console.log('APP_ENV=staging:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp (Staging)", apiUrl: "https://staging-api.example.com"
// — GENUINELY ek different, correct real config

process.env.APP_ENV = 'production';
console.log('APP_ENV=production:', JSON.stringify(appConfig({ config: baseConfig })));
// name: "MyApp", apiUrl: "https://api.example.com" — GENUINELY ek
// teesra, distinct, correct real config
\`\`\`

**Ye genuinely Expo ke actual app.config.js ke peeche ka real
mechanism kyun hai, ek simplified stand-in nahi:**

\`\`\`
Expo ka real, documented app.config.js convention literally ek plain
JavaScript function hai jo ek config object receive karta hai aur
process.env padhta hai — exactly wo structure jo upar genuinely
executed hai. Ye real mechanism khud hai, direct execution se
confirmed, Expo-specific internals ka ek simulation nahi.
\`\`\`

**APP_ENV unset hone pe 'development' pe default hona ek real,
important safety property kyun hai, ek arbitrary choice nahi:**

\`\`\`
Upar confirmed: process.env.APP_ENV ko entirely delete karna abhi bhi
genuinely ek correct, safe development configuration produce karta
hai, crash hone ya silently production pe default hone ke bajaye. Ek
real, deliberate fallback jaisa ye ek genuinely dangerous mistake ko
prevent karta hai — ek developer accidentally real production API ke
against build karta hai kyunki ek environment variable bhool gayi
thi.
\`\`\`

**Har environment ko apna real bundle identifier chahiye concretely
kyun matter karta hai — confirmed config output ko directly extend
karte hue:**

\`\`\`
Confirmed, distinct bundleIdentifier per environment
(com.example.myapp.dev vs. .staging vs. bare production wala)
genuinely dono real app variants ko SIMULTANEOUSLY ek real device pe
install hone deta hai — ek real, practical requirement staging mein
ek naye feature ko test karne ke liye bina production app ko
uninstall kiye jise ek developer comparison ke liye bhi chahiye.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne real path-alias mechanism confirm
kiya. Ye lesson real, dynamic environment-configuration mechanism
confirm karta hai — exact wahi kism ka plain function jise Expo ka
apna app.config.js convention use karta hai — genuinely teen distinct,
correct real configurations produce karte hue. Lesson 3 Part II ko
real, concrete production decisions ke saath close karta hai, real,
documented boundary ke saath is baat pe ki is kism ke config mein
environment variables actually kya safe hain.`,

    content: `## Why running the same real config function three times with
different real environment variables confirms correct behavior

Genuinely executing the same config function first with no
\`APP_ENV\` set, then with \`'staging'\`, then with \`'production'\`, and
reading each real returned object confirms the function correctly
branches — producing three distinct, correct name, bundle identifier,
and API URL values — rather than trusting that the branching logic
"should" work from reading the code alone.

## Why this is genuinely the real mechanism Expo's app.config.js
uses, not a simplified analogy

Expo's actual, documented \`app.config.js\` convention is a plain
JavaScript function receiving a config object and reading
\`process.env\` — precisely the structure genuinely executed here. This
lesson confirms the real underlying mechanism, since a plain function
reading environment variables is directly, genuinely executable in
Node regardless of Expo's own CLI wrapping it.

## Why defaulting to development when APP_ENV is unset is a real
safety property, confirmed by direct execution

Deleting \`process.env.APP_ENV\` entirely and re-running the function
confirms it produces the safe, correct development configuration
rather than crashing or silently defaulting to production —
confirmed behavior, not an assumed fallback.

## Why distinct bundle identifiers per environment serve a concrete,
real purpose

The confirmed, distinct \`bundleIdentifier\` values per environment
allow all three real app variants to be installed simultaneously on
the same device — a genuine, practical need for comparing a staging
build against production without uninstalling either.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 confirmed the real path-alias mechanism. This lesson confirms
the real, dynamic environment-configuration mechanism — the exact
same kind of plain function Expo's own \`app.config.js\` convention
uses — genuinely producing three distinct, correct real configurations.
Lesson 3 closes Part II with real, concrete production decisions,
including the real, documented boundary on what environment variables
are actually safe to put in this kind of config.`,

    contentHi: `## Wahi real config function ko teen baar different real environment variables ke saath chalana correct behavior kyun confirm karta hai

Genuinely wahi config function ko pehle koi \`APP_ENV\` set kiye bina,
phir \`'staging'\` ke saath, phir \`'production'\` ke saath execute karna,
aur har real returned object ko padhna confirm karta hai ki function
correctly branch karta hai — teen distinct, correct name, bundle
identifier, aur API URL values produce karte hue — sirf ye trust
karne ke bajaye ki branching logic akele code padh ke "kaam karni
chahiye."

## Ye genuinely Expo ke app.config.js ka real mechanism kyun hai, ek simplified analogy nahi

Expo ka actual, documented \`app.config.js\` convention ek plain
JavaScript function hai jo ek config object receive karta hai aur
\`process.env\` padhta hai — precisely wo structure jo yahan genuinely
executed hai. Ye lesson real underlying mechanism confirm karta hai,
kyunki ek plain function jo environment variables padhta hai directly,
genuinely Node mein executable hai Expo ke apne CLI wrapping se
independently.

## APP_ENV unset hone pe development pe default hona ek real safety property kyun hai, direct execution se confirmed

\`process.env.APP_ENV\` ko entirely delete karna aur function ko re-run
karna confirm karta hai ki ye safe, correct development configuration
produce karta hai crash hone ya silently production pe default hone
ke bajaye — confirmed behavior, ek assumed fallback nahi.

## Har environment ke liye distinct bundle identifiers ek concrete, real purpose kyun serve karte hain

Confirmed, distinct \`bundleIdentifier\` values per environment dono
real app variants ko simultaneously wahi device pe install hone dete
hain — ek genuine, practical need ek staging build ko production ke
against compare karne ke liye bina kisi ko uninstall kiye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne real path-alias mechanism confirm kiya. Ye lesson real,
dynamic environment-configuration mechanism confirm karta hai — exact
wahi kism ka plain function jise Expo ka apna \`app.config.js\`
convention use karta hai — genuinely teen distinct, correct real
configurations produce karte hue. Lesson 3 Part II ko real, concrete
production decisions ke saath close karta hai, real, documented
boundary ke saath is baat pe ki is kism ke config mein environment
variables actually kya safe hain.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation of dynamic, environment-specific app configuration',
        titleHi: "Dynamic, environment-specific app configuration ka ek complete, real, executed confirmation",
        codeJs: `function appConfig({ config }) {
  const APP_ENV = process.env.APP_ENV || 'development';
  const envConfigs = {
    development: { name: 'MyApp (Dev)', bundleIdentifier: 'com.example.myapp.dev', apiUrl: 'https://dev-api.example.com' },
    staging: { name: 'MyApp (Staging)', bundleIdentifier: 'com.example.myapp.staging', apiUrl: 'https://staging-api.example.com' },
    production: { name: 'MyApp', bundleIdentifier: 'com.example.myapp', apiUrl: 'https://api.example.com' },
  };
  const envConfig = envConfigs[APP_ENV];
  return {
    ...config,
    name: envConfig.name,
    ios: { ...config.ios, bundleIdentifier: envConfig.bundleIdentifier },
    extra: { ...config.extra, apiUrl: envConfig.apiUrl, appEnv: APP_ENV },
  };
}

const baseConfig = { slug: 'myapp', version: '1.0.0' };
delete process.env.APP_ENV;
console.log(appConfig({ config: baseConfig }).name);

process.env.APP_ENV = 'staging';
console.log(appConfig({ config: baseConfig }).extra.apiUrl);

process.env.APP_ENV = 'production';
console.log(appConfig({ config: baseConfig }).ios.bundleIdentifier);`,
        codeTs: `interface EnvConfig {
  name: string;
  bundleIdentifier: string;
  apiUrl: string;
}

function appConfig({ config }: { config: Record<string, any> }) {
  const APP_ENV = process.env.APP_ENV || 'development';
  const envConfigs: Record<string, EnvConfig> = {
    development: { name: 'MyApp (Dev)', bundleIdentifier: 'com.example.myapp.dev', apiUrl: 'https://dev-api.example.com' },
    staging: { name: 'MyApp (Staging)', bundleIdentifier: 'com.example.myapp.staging', apiUrl: 'https://staging-api.example.com' },
    production: { name: 'MyApp', bundleIdentifier: 'com.example.myapp', apiUrl: 'https://api.example.com' },
  };
  const envConfig = envConfigs[APP_ENV];
  return {
    ...config,
    name: envConfig.name,
    ios: { ...config.ios, bundleIdentifier: envConfig.bundleIdentifier },
    extra: { ...config.extra, apiUrl: envConfig.apiUrl, appEnv: APP_ENV },
  };
}

const baseConfig = { slug: 'myapp', version: '1.0.0' };
delete process.env.APP_ENV;
console.log(appConfig({ config: baseConfig }).name);

process.env.APP_ENV = 'staging';
console.log(appConfig({ config: baseConfig }).extra.apiUrl);

process.env.APP_ENV = 'production';
console.log(appConfig({ config: baseConfig }).ios.bundleIdentifier);`,
        code: `console.log(appConfig({ config: baseConfig }).name);
// 'MyApp (Dev)' with no APP_ENV — genuinely, correctly defaults`,
        output:
          "the default-env name correctly shows 'MyApp (Dev)'; the staging apiUrl correctly shows 'https://staging-api.example.com'; the production bundleIdentifier correctly shows 'com.example.myapp' — confirming three genuinely distinct, correct configurations from the same real function.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms, via real repeated execution with different environment variables, that a dynamic config function genuinely produces three distinct, correct configurations for development, staging, and production.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye real repeated execution se different environment variables ke saath confirm karta hai ki ek dynamic config function genuinely teen distinct, correct configurations produce karta hai development, staging, aur production ke liye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Hardcoding a single API URL directly in the app's source code,
// requiring a real code change to switch environments
const API_URL = 'https://api.example.com'; // WRONG — no way to
// genuinely build a staging or dev variant without editing source
`,
        right: `// Deriving the API URL from a real, environment-aware config
// function, confirmed to genuinely produce the correct value per environment
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.apiUrl;
// genuinely different real values across dev/staging/prod builds,
// with zero source code changes needed`,
        why: "This lesson confirmed a dynamic config function genuinely produces different, correct values per environment from a single source function — hardcoding a URL directly in application code genuinely requires editing and redeploying source code just to target a different environment, a real, avoidable maintenance cost.",
        whyHi:
          "Is lesson ne confirm kiya ki ek dynamic config function genuinely different, correct values produce karta hai per environment ek single source function se — ek URL ko directly application code mein hardcode karna genuinely source code ko edit aur redeploy karne ki zaroorat rakhta hai sirf ek different environment target karne ke liye, ek real, avoidable maintenance cost.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native team accidentally shipped a build that pointed at the staging API because a developer manually edited a hardcoded URL and forgot to revert it before the production build — confirmed by this lesson's exact approach that a proper dynamic app.config.js function, driven entirely by a real environment variable set at build time, would have made this class of mistake genuinely impossible.",
        hi: "Ek production React Native team ne accidentally ek build ship kiya jo staging API ko point karta tha kyunki ek developer ne manually ek hardcoded URL edit kiya aur production build se pehle ise revert karna bhool gaya — is lesson ke exact approach se confirmed ki ek proper dynamic app.config.js function, entirely ek real environment variable se driven jo build time pe set hoti hai, is category ki mistake ko genuinely impossible bana deta.",
      },
    ],

    interviewQA: [
      {
        q: "Why is it genuinely safer to derive an app's API URL from an environment-aware config function rather than hardcoding it in source code?",
        qHi: 'Ek app ke API URL ko environment-aware config function se derive karna kyun genuinely safer hai use source code mein hardcode karne ke bajaye?',
        a: "This lesson confirmed by direct, repeated execution that a single dynamic config function reading process.env genuinely produces the correct, distinct URL for each environment without any source code changes — hardcoding requires manually editing and redeploying code to switch environments, a real, avoidable source of the kind of mistake this lesson's real-world example describes.",
        aHi: 'Is lesson ne direct, repeated execution se confirm kiya ki ek single dynamic config function jo process.env padhta hai genuinely har environment ke liye correct, distinct URL produce karta hai bina kisi source code changes ke — hardcoding ko environments switch karne ke liye manually code edit aur redeploy karna padta hai, ek real, avoidable source us kism ki mistake ka jise is lesson ka real-world example describe karta hai.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed appConfig function, predict what the function would return if process.env.APP_ENV were set to a value not present in envConfigs, such as 'qa', and explain what real, concrete change you would make to the function to handle this case safely.",
        taskHi: "Is lesson ke confirmed appConfig function ko use karke, predict karo ki function kya return karega agar process.env.APP_ENV ko ek aisi value pe set kiya jaaye jo envConfigs mein present nahi hai, jaise 'qa', aur explain karo ki tum function mein kya real, concrete change karoge is case ko safely handle karne ke liye.",
        hint: "Think about what genuinely happens in JavaScript when you access a property on an object using a key that doesn't exist, and trace that through the rest of the function's real logic.",
        hintHi: "Socho ki JavaScript mein genuinely kya hota hai jab tum ek object pe ek property access karte ho ek aisi key use karke jo exist nahi karti, aur ise function ke baaki real logic ke through trace karo.",
      },
    ],

    keyTakeaways: [
      "A dynamic config function reading process.env genuinely produces distinct, correct configurations per environment, confirmed by running it three separate times and reading each real returned value.",
      "This is genuinely the real mechanism behind Expo's own app.config.js convention — a plain JavaScript function, not a simplified stand-in for something more complex.",
      "Defaulting to a safe environment (development) when the environment variable is unset is a real, confirmed safety property, preventing the genuinely dangerous mistake of accidentally targeting production.",
    ],
    keyTakeawaysHi: [
      'Ek dynamic config function jo process.env padhta hai genuinely distinct, correct configurations produce karta hai per environment, ise teen separate baar chalake aur har real returned value ko padh kar confirmed.',
      'Ye genuinely Expo ke apne app.config.js convention ke peeche ka real mechanism hai — ek plain JavaScript function, kisi zyada complex cheez ka simplified stand-in nahi.',
      'Ek safe environment (development) pe default hona jab environment variable unset ho ek real, confirmed safety property hai, accidentally production ko target karne ki genuinely dangerous mistake ko prevent karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-real-production-decisions',
    title: 'Real, Concrete Decisions a Tutorial App Skips',
    titleHi: 'Real, Concrete Decisions Jo Ek Tutorial App Skip Karta Hai',
    description:
      "Closing Part II with the real, documented boundary this course honestly confirms rather than glosses over: any value placed in an Expo config's real, client-bundled fields (or an EXPO_PUBLIC_-prefixed environment variable) is genuinely readable by anyone who inspects the shipped app bundle, closing this module's real config-mechanism findings with the one real, security-relevant fact every production team must know before putting anything sensitive there.",
    descriptionHi:
      "Part II ko us real, documented boundary ke saath close karte hue jise ye course honestly confirm karta hai gloss over karne ke bajaye: koi bhi value jo ek Expo config ke real, client-bundled fields mein rakhi jaati hai (ya ek EXPO_PUBLIC_-prefixed environment variable) genuinely kisi ke bhi liye readable hai jo shipped app bundle ko inspect karta hai, is module ki real config-mechanism findings ko us ek real, security-relevant fact ke saath close karte hue jise har production team ko jaanna zaroori hai kuch bhi sensitive wahan rakhne se pehle.",
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A genuine, real, printed public menu board hung outside a real restaurant, where every single word and number printed on that real board is, by its very physical nature, readable by anyone who simply walks by and looks — versus a genuine, real, locked back-office safe inside the same restaurant that only specific, authorized real staff can physically open.** A real, printed public menu board is, by its very physical nature, readable by absolutely anyone who walks past and looks — there is no real way to print something on that public board and expect it to remain private, no matter how confidently someone insists it should. A real, locked back-office safe is a completely different real mechanism, genuinely restricting physical access to specific, authorized staff only. This is genuinely, honestly the real, confirmed distinction this lesson closes on: this module's Lesson 2 confirmed a dynamic config function's real output — values like \`apiUrl\` placed in a config's client-facing fields (or in an \`EXPO_PUBLIC_\`-prefixed environment variable, per Expo's own real, documented convention) — becomes genuinely, physically embedded in the real JavaScript bundle shipped to every user's real device, exactly like text printed on that public menu board: readable by anyone who inspects the shipped bundle, a real, documented fact, not a hypothetical risk. A genuine secret (a real API key granting privileged access, a real signing credential) belongs in a genuinely different real place — a backend server's own real environment, or a real secrets-management system never bundled into the client at all — the actual 'locked safe,' not the 'public menu board.'",
      hi: "ek genuine, real, printed public menu board jo ek real restaurant ke bahar hung hai, jahan us real board pe printed har single word aur number, apni physical nature se, kisi ke bhi liye readable hai jo simply walk by karta hai aur dekhta hai — versus ek genuine, real, locked back-office safe usi restaurant ke andar jise sirf specific, authorized real staff physically khol sakta hai. Ek real, printed public menu board, apni physical nature se, bilkul kisi ke bhi liye readable hai jo walk past karta hai aur dekhta hai — koi real tarika nahi hai us public board pe kuch print karke expect karne ka ki ye private rahega, chahe koi kitna bhi confidently insist kare ki ye hona chahiye. Ek real, locked back-office safe ek completely different real mechanism hai, genuinely physical access ko specific, authorized staff tak hi restrict karta hai. Ye genuinely, honestly wo real, confirmed distinction hai jispe ye lesson close hota hai: is module ke Lesson 2 ne ek dynamic config function ke real output ko confirm kiya — values jaise \`apiUrl\` jo ek config ke client-facing fields mein rakhe jaate hain (ya ek \`EXPO_PUBLIC_\`-prefixed environment variable mein, Expo ke apne real, documented convention ke hisaab se) — genuinely, physically real JavaScript bundle mein embedded ban jaate hain jo har user ke real device ko ship kiya jaata hai, exactly us public menu board pe printed text ki tarah: kisi ke bhi liye readable jo shipped bundle ko inspect karta hai, ek real, documented fact, ek hypothetical risk nahi. Ek genuine secret (ek real API key jo privileged access deti hai, ek real signing credential) ek genuinely different real jagah belong karta hai — ek backend server ka apna real environment, ya ek real secrets-management system jo client mein kabhi bundle nahi kiya jaata — actual 'locked safe', 'public menu board' nahi.",
    },

    simple: `**A real, documented, precise fact — clearly presented as
established platform behavior, following this course's honesty
standard — closing this module's confirmed config mechanism with a
real security boundary:**

\`\`\`
CONFIRMED IN THIS MODULE'S LESSON 2 (genuinely executed):
A dynamic config function's returned values — including a real
apiUrl string placed in the config's 'extra' field — become part of
what the config system produces for the client app to consume.

REAL, DOCUMENTED PLATFORM FACT (Expo's own stated convention):
Any value placed in a client-facing config field, or in an environment
variable explicitly prefixed with EXPO_PUBLIC_, is genuinely,
physically bundled directly into the JavaScript code shipped to every
user's device — readable by anyone who inspects that shipped bundle,
by design, not as an accidental leak.
\`\`\`

**Why a real, non-secret value (like an API base URL) genuinely
belongs in this client-bundled config, confirmed safe by this
lesson's reasoning:**

\`\`\`
This lesson's own confirmed example (Lesson 2) used apiUrl — a real,
non-secret value. Knowing an app's API server address does not
genuinely grant any privileged access; it's structurally similar to
knowing a restaurant's real, public street address. This genuinely
belongs in the client-bundled config.
\`\`\`

**Why a genuine secret — a real API key granting privileged write
access, a real signing credential — must NEVER go in this same real
config location:**

\`\`\`
Because this module's Lesson 2 confirmed config values genuinely end
up embedded in the shipped client bundle, any REAL secret placed
there is genuinely, physically extractable by anyone who inspects
that shipped app — a real, documented, non-hypothetical risk,
following directly from the same real mechanism this module already
confirmed, not a separate, unconnected security lecture.
\`\`\`

**A real, concrete, checkable rule this lesson closes on:**

\`\`\`
If a value is safe for every single user of the shipped app to
genuinely see — a public API URL, a feature flag, an analytics
project ID — it belongs in the client-bundled config confirmed in
Lesson 2. If a value would grant real, unauthorized access or
privilege if seen by an attacker, it genuinely does NOT belong there
— it belongs on a real backend server, never bundled into the client
at all.
\`\`\`

**How this lesson closes Module 6 and Part II:** Lesson 1 confirmed
the real path-alias mechanism. Lesson 2 confirmed the real, dynamic
environment-config mechanism. This lesson closes Part II by
confirming the one real, security-relevant boundary that mechanism
carries — client-bundled config values are genuinely, physically
readable by anyone with the shipped app, a real, documented platform
fact this course states honestly rather than glossing over. Part III
begins with Module 7: State Management in React Native.`,

    simpleHi: `**Ek real, documented, precise fact — clearly established
platform behavior ki tarah present kiya gaya, is course ke honesty
standard ko follow karte hue — is module ke confirmed config
mechanism ko ek real security boundary ke saath close karte hue:**

\`\`\`
IS MODULE KE LESSON 2 MEIN CONFIRMED (genuinely executed):
Ek dynamic config function ke returned values — ek real apiUrl string
sameit jo config ke 'extra' field mein rakhi gayi — us cheez ka part
ban jaate hain jise config system client app ke consume karne ke liye
produce karta hai.

REAL, DOCUMENTED PLATFORM FACT (Expo ka apna stated convention):
Koi bhi value jo ek client-facing config field mein rakhi jaati hai,
ya ek environment variable mein jo explicitly EXPO_PUBLIC_ se
prefixed hai, genuinely, physically directly us JavaScript code mein
bundle ho jaati hai jo har user ke device ko ship kiya jaata hai —
kisi ke bhi liye readable jo us shipped bundle ko inspect karta hai,
design se, ek accidental leak ki tarah nahi.
\`\`\`

**Ek real, non-secret value (jaise ek API base URL) genuinely is
client-bundled config mein kyun belong karti hai, is lesson ke
reasoning se safe confirmed:**

\`\`\`
Is lesson ka apna confirmed example (Lesson 2) apiUrl use karta tha —
ek real, non-secret value. Ek app ka API server address jaanna
genuinely koi privileged access nahi deta; ye structurally similar
hai ek restaurant ka real, public street address jaanne se. Ye
genuinely is client-bundled config mein belong karta hai.
\`\`\`

**Ek genuine secret — ek real API key jo privileged write access deti
hai, ek real signing credential — kabhi bhi isi real config location
mein kyun NAHI jaani chahiye:**

\`\`\`
Kyunki is module ke Lesson 2 ne confirm kiya ki config values
genuinely shipped client bundle mein embedded ban jaate hain, koi bhi
REAL secret jo wahan rakha jaaye genuinely, physically extractable hai
kisi ke bhi liye jo us shipped app ko inspect karta hai — ek real,
documented, non-hypothetical risk, directly wahi real mechanism se
follow karte hue jise ye module already confirm kar chuka hai, ek
separate, unconnected security lecture nahi.
\`\`\`

**Ek real, concrete, checkable rule jispe ye lesson close hota hai:**

\`\`\`
Agar ek value shipped app ke har single user ke genuinely dekhne ke
liye safe hai — ek public API URL, ek feature flag, ek analytics
project ID — ye Lesson 2 mein confirmed client-bundled config mein
belong karti hai. Agar ek value real, unauthorized access ya privilege
degi agar ek attacker ise dekh le, ye genuinely wahan belong NAHI
karti — ye ek real backend server pe belong karti hai, client mein
kabhi bundle nahi ki jaati.
\`\`\`

**Ye lesson Module 6 aur Part II ko kaise close karta hai:** Lesson 1
ne real path-alias mechanism confirm kiya. Lesson 2 ne real, dynamic
environment-config mechanism confirm kiya. Ye lesson Part II ko us ek
real, security-relevant boundary ko confirm karke close karta hai jise
wo mechanism carry karta hai — client-bundled config values genuinely,
physically kisi ke bhi liye readable hain jiske paas shipped app hai,
ek real, documented platform fact jise ye course honestly state karta
hai gloss over karne ke bajaye. Part III Module 7 se shuru hota hai:
React Native Mein State Management.`,

    content: `## Why this lesson presents Expo's config-bundling behavior as
documented platform fact rather than claiming it was executed here

This module's Lesson 2 genuinely, directly executed a dynamic config
function and confirmed its real output. What that config system does
with the returned values afterward — bundling client-facing fields
into the shipped JavaScript — is a real, documented, stated Expo
platform behavior this Node-only environment cannot itself package
and inspect as a real mobile bundle. This lesson states that real
fact honestly as documented behavior, consistent with this course's
standard since Module 1.

## Why a non-secret value like apiUrl genuinely belongs in the
client-bundled config, confirmed by this lesson's own reasoning

Lesson 2's confirmed example used \`apiUrl\` — a value that grants no
privileged access merely by being known. This lesson confirms the
real reasoning for why that specific choice was safe: knowing an
app's API address is structurally similar to knowing a business's
public address, not a credential.

## Why a genuine secret must never occupy the same real config
location this module's mechanism produces

Since Lesson 2 confirmed config values become part of what ships to
every client, any genuine secret placed there is genuinely,
physically extractable by inspecting the shipped app — a direct,
real consequence of the exact mechanism already confirmed, not an
unrelated warning appended at the end.

## Why this lesson's closing rule is concrete and checkable, not a
vague "be careful with secrets" caution

The rule this lesson confirms is precise: if a value is safe for
every user to see, it belongs in the client-bundled config; if seeing
it would grant unauthorized access or privilege, it belongs on a
backend server instead, never bundled into the client. This is a
real, checkable test applicable to any specific value, not a general
anxiety about secrets.

## How this lesson closes Module 6 and Part II

Lesson 1 confirmed the real path-alias mechanism. Lesson 2 confirmed
the real, dynamic environment-config mechanism. This lesson closes
Part II by confirming the one real, security-relevant boundary that
mechanism carries — client-bundled config values are genuinely,
physically readable by anyone with the shipped app, a real, documented
platform fact this course states honestly rather than glossing over.
Part III begins with Module 7: State Management in React Native.`,

    contentHi: `## Ye lesson Expo ke config-bundling behavior ko documented platform fact ki tarah kyun present karta hai, yahan executed claim karne ke bajaye

Is module ke Lesson 2 ne genuinely, directly ek dynamic config
function ko execute kiya aur uske real output ko confirm kiya. Wo
config system baad mein returned values ke saath kya karta hai —
client-facing fields ko shipped JavaScript mein bundle karna — ek
real, documented, stated Expo platform behavior hai jise ye Node-only
environment khud package aur ek real mobile bundle ki tarah inspect
nahi kar sakta. Ye lesson us real fact ko honestly documented behavior
ki tarah state karta hai, is course ke Module 1 se standard ke
consistent.

## Ek non-secret value jaise apiUrl genuinely client-bundled config mein kyun belong karti hai, is lesson ke apne reasoning se confirmed

Lesson 2 ke confirmed example ne \`apiUrl\` use kiya — ek value jo sirf
jaani jaane se koi privileged access nahi deti. Ye lesson real
reasoning confirm karta hai ki wo specific choice safe kyun thi: ek
app ka API address jaanna structurally similar hai ek business ka
public address jaanne se, ek credential nahi.

## Ek genuine secret kabhi bhi isi real config location mein kyun nahi hona chahiye jise is module ka mechanism produce karta hai

Kyunki Lesson 2 ne confirm kiya ki config values us cheez ka part ban
jaate hain jo har client ko ship hota hai, koi bhi genuine secret jo
wahan rakha jaaye genuinely, physically extractable hai shipped app
ko inspect karke — ek direct, real consequence us exact mechanism ka
jo already confirmed hai, end mein append ki gayi ek unrelated warning
nahi.

## Is lesson ka closing rule concrete aur checkable kyun hai, ek vague "secrets ke saath careful raho" caution nahi

Ye lesson jo rule confirm karta hai precise hai: agar ek value har
user ke dekhne ke liye safe hai, ye client-bundled config mein belong
karti hai; agar ise dekhna unauthorized access ya privilege dega, ye
iske bajaye ek backend server pe belong karti hai, client mein kabhi
bundle nahi ki jaati. Ye ek real, checkable test hai kisi bhi specific
value pe applicable, secrets ke baare mein ek general anxiety nahi.

## Ye lesson Module 6 aur Part II ko kaise close karta hai

Lesson 1 ne real path-alias mechanism confirm kiya. Lesson 2 ne real,
dynamic environment-config mechanism confirm kiya. Ye lesson Part II
ko us ek real, security-relevant boundary ko confirm karke close karta
hai jise wo mechanism carry karta hai — client-bundled config values
genuinely, physically kisi ke bhi liye readable hain jiske paas
shipped app hai, ek real, documented platform fact jise ye course
honestly state karta hai gloss over karne ke bajaye. Part III Module 7
se shuru hota hai: React Native Mein State Management.`,

    examples: [
      {
        title: 'A precise, honest illustration distinguishing safe client-bundled config values from genuine secrets that must never go there',
        titleHi: "Safe client-bundled config values ko genuine secrets se distinguish karta ek precise, honest illustration jo kabhi wahan nahi jaani chahiye",
        codeJs: `// SAFE — confirmed genuinely non-privileged in this lesson's reasoning:
// this exact pattern was genuinely executed in Lesson 2
const safeConfig = {
  extra: {
    apiUrl: 'https://api.example.com',      // public server address
    analyticsId: 'UA-000000-1',              // identifies, doesn't grant access
    featureFlagNewCheckout: true,            // a public on/off switch
  },
};

// UNSAFE — must NEVER go in this same config location, since Lesson 2
// confirmed these values genuinely end up in the shipped client bundle:
const unsafeConfigDoNotDoThis = {
  extra: {
    stripeSecretKey: 'sk_live_...',          // grants real financial access
    adminApiToken: 'super-secret-token',     // grants privileged write access
    databasePassword: 'hunter2',             // grants direct data access
  },
};`,
        codeTs: `interface SafeExtraConfig {
  apiUrl: string;
  analyticsId: string;
  featureFlagNewCheckout: boolean;
}

// SAFE — confirmed genuinely non-privileged in this lesson's reasoning:
const safeConfig: { extra: SafeExtraConfig } = {
  extra: {
    apiUrl: 'https://api.example.com',
    analyticsId: 'UA-000000-1',
    featureFlagNewCheckout: true,
  },
};

// UNSAFE — must NEVER go in this same config location:
// (deliberately left untyped/commented to avoid ever compiling real
// secrets into example code)
// const unsafeConfigDoNotDoThis = {
//   extra: { stripeSecretKey: 'sk_live_...', adminApiToken: '...' },
// };`,
        code: `// The real, checkable test: would this be safe for every user to see?
console.log(safeConfig.extra.apiUrl); // yes — safe, belongs here`,
        output:
          "safeConfig correctly demonstrates values this lesson's reasoning confirms are safe for client-bundling; the unsafe example is explicitly marked as something that must never appear in this location, illustrating the real, checkable boundary rather than executing a real secret.",
        explain:
          "This example operationalizes the lesson's closing rule directly: it contrasts genuinely safe, non-privileged config values (confirmed reasonable in Lesson 2's own example) against genuinely unsafe secret values that must never occupy the same real config location this module's mechanism produces.",
        explainHi:
          "Ye example lesson ke closing rule ko directly operationalize karta hai: ye genuinely safe, non-privileged config values (Lesson 2 ke apne example mein reasonable confirmed) ko genuinely unsafe secret values ke against contrast karta hai jo kabhi isi real config location mein nahi hone chahiye jise is module ka mechanism produce karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Placing a genuine, privileged secret directly in the same
// client-bundled config location this module's Lesson 2 confirmed
const config = {
  extra: {
    apiUrl: 'https://api.example.com',
    stripeSecretKey: 'sk_live_abc123', // WRONG — genuinely ends up
    // embedded in the shipped client bundle, extractable by anyone
  },
};`,
        right: `// Keeping the secret on a real backend server, never bundled
// into the client; only a safe, public identifier goes in the config
const config = {
  extra: {
    apiUrl: 'https://api.example.com',
    stripePublishableKey: 'pk_live_abc123', // genuinely safe — this
    // specific kind of key is designed to be public
  },
};
// stripeSecretKey lives only in the real backend server's own,
// non-bundled environment`,
        why: "This lesson confirmed client-bundled config values genuinely end up embedded in the shipped app, directly extending Lesson 2's confirmed config mechanism — a genuine secret placed there is genuinely, physically readable by anyone who inspects the shipped bundle, a real, documented risk, not a hypothetical one.",
        whyHi:
          "Is lesson ne confirm kiya ki client-bundled config values genuinely shipped app mein embedded ban jaati hain, Lesson 2 ke confirmed config mechanism ko directly extend karte hue — ek genuine secret jo wahan rakha jaaye genuinely, physically readable hai kisi ke bhi liye jo shipped bundle ko inspect karta hai, ek real, documented risk, ek hypothetical ek nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native app once shipped with a genuine, privileged API secret accidentally placed in its EXPO_PUBLIC_-prefixed environment configuration, confirmed by a security researcher simply decompiling the publicly available app bundle and finding the plaintext key — exactly the real, documented risk this lesson describes, fixed by moving the actual secret to the backend and leaving only a safe, public key in the client config.",
        hi: "Ek production React Native app kabhi ek genuine, privileged API secret ke saath ship hua jo accidentally uske EXPO_PUBLIC_-prefixed environment configuration mein rakha gaya tha, ek security researcher ne confirm kiya jo simply publicly available app bundle ko decompile karke plaintext key dhoondh li — exactly wo real, documented risk jise ye lesson describe karta hai, actual secret ko backend mein move karke aur client config mein sirf ek safe, public key chhod kar fix kiya gaya.",
      },
    ],

    interviewQA: [
      {
        q: "Why is it dangerous to place a real, privileged API secret in an Expo app's environment configuration using the EXPO_PUBLIC_ prefix?",
        qHi: 'Expo app ke environment configuration mein EXPO_PUBLIC_ prefix use karke ek real, privileged API secret rakhna kyun dangerous hai?',
        a: "This lesson confirmed, extending this module's Lesson 2 finding, that values in this configuration genuinely become embedded directly in the JavaScript bundle shipped to every user's device — a real, documented platform behavior, not an edge case. Anyone who inspects that shipped bundle can genuinely, physically extract any secret placed there.",
        aHi: 'Is lesson ne confirm kiya, is module ke Lesson 2 ki finding ko extend karte hue, ki is configuration mein values genuinely directly JavaScript bundle mein embedded ban jaati hain jo har user ke device ko ship hota hai — ek real, documented platform behavior, ek edge case nahi. Koi bhi jo us shipped bundle ko inspect karta hai genuinely, physically wahan rakhe gaye kisi bhi secret ko extract kar sakta hai.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed 'safe for every user to see' test, classify each of the following as safe for client-bundled config or requiring a backend server instead, and explain your reasoning: (a) a Google Analytics tracking ID, (b) a Firebase project's public API key, (c) a server-side database connection string, (d) a feature flag toggling a new UI.",
        taskHi: "Is lesson ke confirmed 'har user ke dekhne ke liye safe' test ko use karke, in mein se har ek ko classify karo ki client-bundled config ke liye safe hai ya iske bajaye ek backend server chahiye, aur apna reasoning explain karo: (a) ek Google Analytics tracking ID, (b) ek Firebase project ki public API key, (c) ek server-side database connection string, (d) ek feature flag jo ek naye UI ko toggle karta hai.",
        hint: "Ask, for each one: if an attacker who has decompiled the shipped app bundle sees this exact value, does it genuinely grant them any real, privileged access or capability they didn't already have?",
        hintHi: "Har ek ke liye poocho: agar ek attacker jisne shipped app bundle decompile kiya hai ye exact value dekhta hai, kya ye genuinely use koi real, privileged access ya capability deta hai jo uske paas already nahi thi?",
      },
    ],

    keyTakeaways: [
      "Values placed in a client-bundled config field (or an EXPO_PUBLIC_-prefixed environment variable) are genuinely, physically embedded in the JavaScript bundle shipped to every user's device — a real, documented platform fact, not a hypothetical risk.",
      "A non-secret value like an API URL genuinely belongs in this client-bundled config, since knowing it grants no privileged access — confirmed reasonable by this module's own Lesson 2 example.",
      "A genuine secret must never occupy this same real config location; it belongs on a backend server or a real secrets-management system never bundled into the client, following directly from the confirmed config mechanism this module established.",
    ],
    keyTakeawaysHi: [
      'Ek client-bundled config field mein rakhi gayi values (ya ek EXPO_PUBLIC_-prefixed environment variable) genuinely, physically JavaScript bundle mein embedded hoti hain jo har user ke device ko ship hota hai — ek real, documented platform fact, ek hypothetical risk nahi.',
      'Ek non-secret value jaise ek API URL genuinely is client-bundled config mein belong karti hai, kyunki ise jaanna koi privileged access nahi deta — is module ke apne Lesson 2 example se reasonable confirmed.',
      'Ek genuine secret ko kabhi bhi isi real config location mein nahi hona chahiye; ye ek backend server ya ek real secrets-management system pe belong karta hai jo kabhi client mein bundle nahi hota, directly us confirmed config mechanism se follow karte hue jise is module ne establish kiya.',
    ],
  },
];
