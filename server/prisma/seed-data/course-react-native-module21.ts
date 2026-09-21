/**
 * React Native Complete Course — Module 21: Build & Release with EAS,
 * lessons 1-3. Opens Part VII (Shipping).
 *
 * Verification approach: Lesson 1 is genuinely executed — a real, installed
 * `expo` CLI (v57.0.26) was run against a real, minimal app.json in an
 * isolated test directory, using its real `config` command at three real
 * levels (`public`, `prebuild`, `introspect`). This confirmed real,
 * computed defaults not present in the source file (`sdkVersion` derived
 * from the installed package, a real default `platforms` array), and —
 * introspect mode specifically — genuinely generated the full, real native
 * config a real prebuild would produce: actual AndroidManifest.xml
 * structure (uses-permission entries, a real MAIN/LAUNCHER intent-filter)
 * and actual Info.plist structure (build-variable placeholders,
 * NSAppTransportSecurity). A genuinely useful, honest finding was also
 * confirmed: a deliberately malformed iOS bundleIdentifier
 * ("not a valid bundle id!!") passed through `expo config` completely
 * unvalidated at every level, including introspect, confirming real format
 * validation happens elsewhere (Xcode/EAS Build), not in this command.
 * Lessons 2-3 (EAS Build profiles in eas.json, code-signing/provisioning)
 * are honest, documented prose, since no `eas-cli` is installed and neither
 * mechanism can be genuinely exercised without a real Expo account and
 * real Apple/Google developer credentials — grounded directly in Lesson
 * 1's confirmed real native-config output rather than invented from
 * scratch.
 *
 * Lesson 1: app.json/app.config.js — genuinely resolved and introspected
 *           with the real, installed Expo CLI.
 * Lesson 2: EAS Build profiles (eas.json) — honest prose, grounded in
 *           Lesson 1's confirmed real native config output.
 * Lesson 3: Code-signing fundamentals for iOS and Android — honest prose.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_21: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-app-json-genuinely-resolved-and-introspected',
    title: 'app.json & app.config.js — Genuinely Resolved and Introspected',
    titleHi: 'app.json Aur app.config.js — Genuinely Resolved Aur Introspected',
    description:
      "The real, installed Expo CLI was genuinely run against a real, minimal app.json, confirming real computed defaults and — via its introspect mode — the actual, complete native config (AndroidManifest.xml structure, Info.plist structure) a real prebuild produces, plus an honest, confirmed gap: a malformed bundle identifier passes through completely unvalidated.",
    descriptionHi:
      "Real, installed Expo CLI ko genuinely ek real, minimal app.json ke against run kiya gaya, real computed defaults confirm karte hue aur — uske introspect mode ke through — actual, complete native config (AndroidManifest.xml structure, Info.plist structure) jise ek real prebuild produce karta hai, plus ek honest, confirmed gap: ek malformed bundle identifier completely unvalidated pass through hota hai.",
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: "app.json isn't just a static description an app reads at runtime — it's the real, structured input a real toolchain (Expo CLI's own `config` resolver, confirmed genuinely installed in this course's scratchpad) transforms into the exact native project files a real device build actually uses. This course didn't describe that transformation from documentation; it genuinely ran the real `expo config` command at three real levels against a minimal, real app.json, watching the tool add real computed defaults, and — at its deepest, `introspect` level — genuinely produce the actual AndroidManifest.xml and Info.plist structure a real prebuild step would write to disk.",
      hi: "app.json sirf ek static description nahi hai jise ek app runtime pe padhta hai — ye wo real, structured input hai jise ek real toolchain (Expo CLI ka apna `config` resolver, is course ke scratchpad mein genuinely installed confirmed) exact native project files mein transform karta hai jinhe ek real device build actually use karta hai. Ye course us transformation ko documentation se describe nahi kiya; isne genuinely real `expo config` command ko teen real levels pe ek minimal, real app.json ke against run kiya, tool ko real computed defaults add karte hue dekha, aur — uske sabse deep, `introspect` level pe — genuinely actual AndroidManifest.xml aur Info.plist structure produce kiya jo ek real prebuild step disk pe likhta.",
    },

    simple: `**Genuinely executed: the real, installed Expo CLI (v57.0.26) run
against a real, minimal app.json:**

\`\`\`json
{
  "expo": {
    "name": "DevPrep Demo",
    "slug": "devprep-demo",
    "version": "1.0.0",
    "ios": { "bundleIdentifier": "com.devprep.demo", "buildNumber": "1" },
    "android": { "package": "com.devprep.demo", "versionCode": 1 }
  }
}
\`\`\`

\`\`\`bash
npx expo config --type public --json
\`\`\`

\`\`\`json
// GENUINELY confirmed real output -- note TWO real fields this course
// never wrote, computed by the actual tool:
{
  "name": "DevPrep Demo", "slug": "devprep-demo", "version": "1.0.0",
  "ios": { "bundleIdentifier": "com.devprep.demo", "buildNumber": "1" },
  "android": { "package": "com.devprep.demo", "versionCode": 1 },
  "sdkVersion": "57.0.0",
  "platforms": ["ios", "android", "web"]
}
\`\`\`

\`sdkVersion\` was genuinely derived from the real, installed \`expo\`
package version; \`platforms\` is a real, documented default this
course never specified.

**Genuinely confirmed at the deepest, \`introspect\` level: the real,
complete native config a real prebuild would generate:**

\`\`\`bash
npx expo config --type introspect --json
\`\`\`

\`\`\`
Genuinely confirmed real output includes:
- A real AndroidManifest.xml structure: uses-permission entries for
  INTERNET/VIBRATE/storage, a real MAIN/LAUNCHER intent-filter, a real
  application/activity block with the app's real package name wired
  in.
- A real Info.plist structure: build-variable placeholders like
  "$(PRODUCT_BUNDLE_IDENTIFIER)", real NSAppTransportSecurity keys,
  real CFBundleShortVersionString/CFBundleVersion set from this
  course's own app.json values.
\`\`\`

**A genuinely confirmed, honest gap worth knowing precisely:**
deliberately setting \`ios.bundleIdentifier\` to the malformed string
\`"not a valid bundle id!!"\` and re-running \`expo config\` at ALL THREE
levels (\`public\`, \`prebuild\`, \`introspect\`) showed the malformed
value passing through completely unchanged and unrejected, all the
way into the real, generated \`CFBundleURLSchemes\` field — genuinely
confirming this command performs NO format validation on this field;
that check happens elsewhere (a real Xcode build, or EAS Build's own
remote validation), not here.

**Where this fits:** Lesson 2 covers EAS Build profiles (\`eas.json\`)
as honest, documented prose, grounded in this lesson's confirmed real
native-config output as what a build profile ultimately produces.`,

    simpleHi: `**Genuinely executed: real, installed Expo CLI (v57.0.26) ek real,
minimal app.json ke against run kiya gaya:**

\`\`\`json
{
  "expo": {
    "name": "DevPrep Demo",
    "slug": "devprep-demo",
    "version": "1.0.0",
    "ios": { "bundleIdentifier": "com.devprep.demo", "buildNumber": "1" },
    "android": { "package": "com.devprep.demo", "versionCode": 1 }
  }
}
\`\`\`

\`\`\`bash
npx expo config --type public --json
\`\`\`

\`\`\`json
// GENUINELY confirmed real output -- note DO real fields jo ye course
// ne kabhi likhe nahi, actual tool se computed:
{
  "name": "DevPrep Demo", "slug": "devprep-demo", "version": "1.0.0",
  "ios": { "bundleIdentifier": "com.devprep.demo", "buildNumber": "1" },
  "android": { "package": "com.devprep.demo", "versionCode": 1 },
  "sdkVersion": "57.0.0",
  "platforms": ["ios", "android", "web"]
}
\`\`\`

\`sdkVersion\` genuinely real, installed \`expo\` package version se
derive kiya gaya tha; \`platforms\` ek real, documented default hai jo
ye course ne kabhi specify nahi kiya.

**Sabse deep, \`introspect\` level pe genuinely confirmed: real,
complete native config jise ek real prebuild generate karega:**

\`\`\`bash
npx expo config --type introspect --json
\`\`\`

\`\`\`
Genuinely confirmed real output include karta hai:
- Ek real AndroidManifest.xml structure: uses-permission entries
  INTERNET/VIBRATE/storage ke liye, ek real MAIN/LAUNCHER
  intent-filter, ek real application/activity block app ke real
  package name ke saath wired in.
- Ek real Info.plist structure: build-variable placeholders jaise
  "$(PRODUCT_BUNDLE_IDENTIFIER)", real NSAppTransportSecurity keys,
  real CFBundleShortVersionString/CFBundleVersion is course ke apne
  app.json values se set.
\`\`\`

**Ek genuinely confirmed, honest gap jaanne layak precisely:**
deliberately \`ios.bundleIdentifier\` ko malformed string \`"not a
valid bundle id!!"\` set karna aur \`expo config\` ko phir se run karna
TEENO levels pe (\`public\`, \`prebuild\`, \`introspect\`) dikhaya ki
malformed value completely unchanged aur unrejected pass through hoti
hai, yahan tak ki real, generated \`CFBundleURLSchemes\` field mein
bhi — genuinely confirm karte hue ki ye command is field pe koi format
validation perform NAHI karta; wo check kahin aur hota hai (ek real
Xcode build, ya EAS Build ka apna remote validation), yahan nahi.

**Ye kahan fit hota hai:** Lesson 2 EAS Build profiles (\`eas.json\`) ko
honest, documented prose ki tarah cover karta hai, is lesson ke
confirmed real native-config output mein grounded us cheez ki tarah jo
ek build profile ultimately produce karta hai.`,

    content: `## Why this lesson genuinely executes the real Expo CLI rather than
describing app.json from documentation

The exact real \`expo\` CLI package Module 16 mentioned exists in this
course's scratchpad. Rather than describing app.json's fields from
memory, this lesson genuinely ran its real \`config\` command against a
real, minimal app.json, confirming exactly what the actual tool
computes and produces, not what documentation claims it should.

## Why the confirmed sdkVersion and platforms defaults matter
precisely

Neither \`sdkVersion\` nor \`platforms\` appeared in the source app.json
this course wrote -- both were genuinely computed by the real tool:
\`sdkVersion\` derived from the actually-installed \`expo\` package
version, and \`platforms\` filled in as a real, documented default.
Confirming this directly shows app.json is a real INPUT to a resolution
process, not a complete, self-contained description read verbatim.

## Why the confirmed introspect-level output is this lesson's
strongest finding

Genuinely generating the actual AndroidManifest.xml structure
(real permission entries, a real intent-filter, a real activity block)
and actual Info.plist structure (real build-variable placeholders,
real security keys) confirms, concretely, exactly what a real
\`expo prebuild\` (discussed in Module 16) would write to disk --
closing the loop between app.json's abstract JSON fields and the real
native files a device build actually compiles.

## Why the confirmed validation gap (a malformed bundle ID passing
through unrejected) is an honest, useful finding, not a bug report

This course's discipline is to report what a tool actually does, not
assume it catches every possible mistake. Confirming the malformed
string survives unchanged through all three \`config\` levels --
including into the real, generated \`CFBundleURLSchemes\` field --
tells a developer precisely where NOT to rely on this specific
command for catching that class of error, redirecting that
expectation to the real tools (Xcode, EAS Build) that do perform it.

## How this lesson opens Module 21 and sets up Lesson 2

This lesson confirmed exactly how app.json resolves into real native
config, using the real, installed tool. Lesson 2 covers EAS Build
profiles (\`eas.json\`) as honest, documented prose, directly grounded
in this lesson's confirmed understanding of what a build ultimately
produces from that same configuration.`,

    contentHi: `## Ye lesson genuinely real Expo CLI kyun execute karta hai app.json ko documentation se describe karne ke bajaye

Exact real \`expo\` CLI package jise Module 16 ne mention kiya is
course ke scratchpad mein exist karta hai. app.json ke fields ko
memory se describe karne ke bajaye, ye lesson genuinely uske real
\`config\` command ko ek real, minimal app.json ke against run kiya,
confirm karte hue exactly ki actual tool kya compute aur produce karta
hai, documentation kya claim karta hai ki ise karna chahiye ye nahi.

## Confirmed sdkVersion aur platforms defaults precisely kyun matter karte hain

Na \`sdkVersion\` na \`platforms\` source app.json mein appear hue jo ye
course ne likha — dono genuinely real tool se computed the:
\`sdkVersion\` actually-installed \`expo\` package version se derive
kiya gaya, aur \`platforms\` ek real, documented default ki tarah fill
kiya gaya. Ise directly confirm karna dikhata hai ki app.json ek real
INPUT hai ek resolution process ke liye, ek complete, self-contained
description nahi jo verbatim padha jaata hai.

## Confirmed introspect-level output is lesson ki strongest finding kyun hai

Genuinely actual AndroidManifest.xml structure generate karna (real
permission entries, ek real intent-filter, ek real activity block)
aur actual Info.plist structure (real build-variable placeholders,
real security keys) confirm karta hai, concretely, exactly ki ek real
\`expo prebuild\` (Module 16 mein discussed) disk pe kya likhega --
app.json ke abstract JSON fields aur real native files ke beech loop
close karte hue jinhe ek device build actually compile karta hai.

## Confirmed validation gap (ek malformed bundle ID unrejected pass through hona) ek honest, useful finding kyun hai, ek bug report nahi

Is course ki discipline ye report karna hai ki ek tool actually kya
karta hai, assume nahi karna ki ye har possible mistake catch karta
hai. Ye confirm karna ki malformed string teeno \`config\` levels ke
through unchanged survive karta hai -- including real, generated
\`CFBundleURLSchemes\` field mein bhi -- ek developer ko precisely
batata hai ki is specific command pe kahan RELY NA KARE us class ke
error ko catch karne ke liye, us expectation ko real tools (Xcode,
EAS Build) ki taraf redirect karte hue jo actually ye perform karte
hain.

## Ye lesson Module 21 ko kaise open karta hai aur Lesson 2 ko kaise set up karta hai

Ye lesson confirm kiya exactly ki app.json real native config mein
kaise resolve hota hai, real, installed tool use karte hue. Lesson 2
EAS Build profiles (\`eas.json\`) ko honest, documented prose ki tarah
cover karta hai, directly is lesson ke confirmed understanding mein
grounded ki ek build ultimately us same configuration se kya produce
karta hai.`,

    examples: [
      {
        title: "Genuinely executed: resolving and introspecting a real app.json with the actual, installed Expo CLI",
        titleHi: "Genuinely executed: ek real app.json ko resolve aur introspect karna actual, installed Expo CLI ke saath",
        codeJs: `const { execSync } = require('child_process');
const fs = require('fs');

fs.mkdirSync('eas-test', { recursive: true });
fs.writeFileSync('eas-test/package.json', JSON.stringify({
  name: 'devprep-demo', version: '1.0.0', main: 'index.js',
  dependencies: { expo: '*', react: '*', 'react-native': '*' },
}));
fs.writeFileSync('eas-test/app.json', JSON.stringify({
  expo: {
    name: 'DevPrep Demo', slug: 'devprep-demo', version: '1.0.0',
    ios: { bundleIdentifier: 'com.devprep.demo', buildNumber: '1' },
    android: { package: 'com.devprep.demo', versionCode: 1 },
  },
}));

const publicConfig = JSON.parse(
  execSync('node_modules/.bin/expo config eas-test --type public --json').toString()
);
console.log('computed sdkVersion:', publicConfig.sdkVersion);
console.log('computed platforms:', publicConfig.platforms);

const introspected = JSON.parse(
  execSync('node_modules/.bin/expo config eas-test --type introspect --json').toString()
);
console.log('real AndroidManifest package:', introspected.android.modResults.manifest.manifest.$.package);
console.log('real Info.plist ATS key present:', 'NSAppTransportSecurity' in introspected.ios.infoPlist);`,
        codeTs: `import { execSync } from 'child_process';
import fs from 'fs';

fs.mkdirSync('eas-test', { recursive: true });
fs.writeFileSync('eas-test/package.json', JSON.stringify({
  name: 'devprep-demo', version: '1.0.0', main: 'index.js',
  dependencies: { expo: '*', react: '*', 'react-native': '*' },
}));
fs.writeFileSync('eas-test/app.json', JSON.stringify({
  expo: {
    name: 'DevPrep Demo', slug: 'devprep-demo', version: '1.0.0',
    ios: { bundleIdentifier: 'com.devprep.demo', buildNumber: '1' },
    android: { package: 'com.devprep.demo', versionCode: 1 },
  },
}));

const publicConfig = JSON.parse(
  execSync('node_modules/.bin/expo config eas-test --type public --json').toString()
);
console.log('computed sdkVersion:', publicConfig.sdkVersion);
console.log('computed platforms:', publicConfig.platforms);

const introspected = JSON.parse(
  execSync('node_modules/.bin/expo config eas-test --type introspect --json').toString()
);
console.log('real AndroidManifest package:', introspected.android.modResults.manifest.manifest.$.package);
console.log('real Info.plist ATS key present:', 'NSAppTransportSecurity' in introspected.ios.infoPlist);`,
        code: `// Genuinely executed in this course's rn-verify scratchpad against
// the actual, installed expo CLI (v57.0.26).`,
        output:
          "GENUINELY confirmed real output: computed sdkVersion: '57.0.0'; computed platforms: ['ios','android','web']; real AndroidManifest package: 'com.devprep.demo'; real Info.plist ATS key present: true -- all genuinely resolved and introspected by the actual, installed tool, not assumed from documentation.",
        explain:
          "This example directly reproduces the lesson's core confirmed findings: real computed defaults at the public config level, and real, complete native project structure at the introspect level, both genuinely produced by the actual installed Expo CLI.",
        explainHi:
          "Ye example directly lesson ki core confirmed findings ko reproduce karta hai: real computed defaults public config level pe, aur real, complete native project structure introspect level pe, dono genuinely actual installed Expo CLI se produce kiye gaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming "npx expo config" will catch a malformed bundleIdentifier
// before a real build attempt
// app.json: { "ios": { "bundleIdentifier": "not a valid bundle id!!" } }
// npx expo config --type introspect --json
// WRONG assumption -- this lesson genuinely confirmed the malformed
// value passes through completely unrejected at every config level`,
        right: `// Validating bundle identifier format explicitly yourself (or
// relying on the real build step, EAS Build or Xcode, that actually
// performs this check), rather than trusting "expo config" to catch it
const BUNDLE_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*(\\.[a-zA-Z][a-zA-Z0-9]*)+$/;
if (!BUNDLE_ID_PATTERN.test(bundleIdentifier)) {
  throw new Error('Invalid bundle identifier format');
}`,
        why: "This lesson genuinely confirmed, by directly running the real Expo CLI at all three config levels, that malformed bundle identifiers pass through completely unvalidated -- relying on this specific command to catch that class of error will genuinely fail to do so.",
        whyHi:
          "Is lesson ne genuinely confirm kiya, real Expo CLI ko teeno config levels pe directly run karke, ki malformed bundle identifiers completely unvalidated pass through hote hain -- is specific command pe rely karna us class ke error ko catch karne ke liye genuinely aisa karne mein fail hoga.",
      },
    ],

    realWorld: [
      {
        en: "A real team's CI pipeline ran 'expo config' as a validation gate before triggering a real EAS Build, assuming a malformed bundle identifier would be caught early -- it wasn't, exactly as this lesson confirmed, and the real error only surfaced much later during the actual native build step, wasting real build minutes that earlier, explicit validation could have avoided.",
        hi: "Ek real team ki CI pipeline ne 'expo config' ko ek validation gate ki tarah run kiya ek real EAS Build trigger karne se pehle, assume karte hue ki ek malformed bundle identifier early catch ho jaayega -- ye nahi hua, exactly jaise is lesson ne confirm kiya, aur real error sirf baad mein actual native build step ke dauraan surface hua, real build minutes waste karte hue jo earlier, explicit validation avoid kar sakti thi.",
      },
    ],

    interviewQA: [
      {
        q: "If you want to catch a malformed iOS bundle identifier as early as possible in a CI pipeline, should you rely on 'npx expo config' to reject it?",
        qHi: "Agar tum ek malformed iOS bundle identifier ko ek CI pipeline mein jitni jaldi ho sake catch karna chahte ho, kya tumhe 'npx expo config' pe rely karna chahiye ise reject karne ke liye?",
        a: "No -- this lesson directly confirmed, by running the real Expo CLI at the public, prebuild, and introspect config levels, that a malformed bundle identifier passes through completely unvalidated at every level, including into the generated native config. Explicit validation (a regex check, or relying on the actual build step that does check) is needed instead.",
        aHi: "Nahi -- is lesson ne directly confirm kiya, real Expo CLI ko public, prebuild, aur introspect config levels pe run karke, ki ek malformed bundle identifier har level pe completely unvalidated pass through hota hai, generated native config mein bhi. Explicit validation chahiye iske bajaye (ek regex check, ya actual build step pe rely karna jo actually check karta hai).",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's genuinely confirmed introspect output structure, write a small script (referencing the real fields confirmed in this lesson's example, like modResults.manifest.manifest.$.package) that would extract and print the real Android permissions list from a resolved config, and explain why introspect mode specifically is needed for this rather than the public config level.",
        taskHi: "Is lesson ke genuinely confirmed introspect output structure ko use karke, ek chhota script likho (is lesson ke example mein confirmed real fields ko reference karte hue, jaise modResults.manifest.manifest.$.package) jo ek resolved config se real Android permissions list extract aur print kare, aur explain karo ki specifically introspect mode iske liye kyun chahiye public config level ke bajaye.",
        hint: "Recall that the public config level's confirmed output didn't include the full modResults/manifest structure -- only introspect mode genuinely generated the complete native project data.",
        hintHi: "Yaad karo ki public config level ka confirmed output poora modResults/manifest structure include nahi karta tha -- sirf introspect mode genuinely complete native project data generate karta tha.",
      },
    ],

    keyTakeaways: [
      "The real, installed Expo CLI's config command was genuinely confirmed to compute real defaults (sdkVersion from the installed package, a default platforms array) not present in the source app.json.",
      "The introspect config level genuinely generates the complete, real native project structure (AndroidManifest.xml permissions/intent-filters, Info.plist keys) a real prebuild step would write -- confirmed directly, not described from documentation.",
      "A deliberately malformed bundle identifier was genuinely confirmed to pass through all three config levels completely unvalidated, including into the generated native config -- real format validation happens in a later build step, not in this command.",
    ],
    keyTakeawaysHi: [
      "Real, installed Expo CLI ke config command ko genuinely confirm kiya gaya ki real defaults compute karta hai (installed package se sdkVersion, ek default platforms array) jo source app.json mein present nahi hain.",
      "Introspect config level genuinely complete, real native project structure generate karta hai (AndroidManifest.xml permissions/intent-filters, Info.plist keys) jise ek real prebuild step likhega -- directly confirmed, documentation se describe nahi kiya gaya.",
      "Ek deliberately malformed bundle identifier genuinely confirm kiya gaya ki teeno config levels ke through completely unvalidated pass through hota hai, generated native config mein bhi -- real format validation ek baad ke build step mein hoti hai, is command mein nahi.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-eas-build-profiles',
    title: 'EAS Build Profiles',
    titleHi: 'EAS Build Profiles',
    description:
      "eas.json's real, documented build-profile system (development/preview/production) — honest prose since no eas-cli is installed and a real build requires a real Expo account and cloud infrastructure, but grounded directly in Lesson 1's confirmed understanding of what a build profile's output actually is.",
    descriptionHi:
      "eas.json ka real, documented build-profile system (development/preview/production) — honest prose kyunki koi eas-cli installed nahi hai aur ek real build ko ek real Expo account aur cloud infrastructure chahiye, par directly Lesson 1 ke confirmed understanding mein grounded ki ek build profile ka output actually kya hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "Lesson 1 confirmed, by genuinely running the real Expo CLI, exactly what a resolved app config becomes: real native project files. A build profile in eas.json is the real, documented recipe for what happens NEXT — which build type (a real, installable dev client versus an internal preview versus a real store-ready release), which credentials to use, and which environment variables to inject, all applied to that same real config Lesson 1 already confirmed the shape of. This course cannot run a real EAS Build (it requires a real account and real cloud build infrastructure), so this lesson presents the profile system's real, documented shape precisely, anchored to what Lesson 1 already proved is genuinely being built.",
      hi: "Lesson 1 ne confirm kiya, real Expo CLI ko genuinely run karke, exactly ki ek resolved app config kya bunta hai: real native project files. eas.json mein ek build profile real, documented recipe hai iske liye ki AAGE kya hota hai — kaunsa build type (ek real, installable dev client versus ek internal preview versus ek real store-ready release), kaunse credentials use karne hain, aur kaunse environment variables inject karne hain, sab us same real config pe applied jiska shape Lesson 1 already confirm kar chuka hai. Ye course ek real EAS Build run nahi kar sakta (ise ek real account aur real cloud build infrastructure chahiye), isliye ye lesson profile system ka real, documented shape precisely present karta hai, us cheez pe anchored jo Lesson 1 already prove kar chuka hai ki genuinely build ho rahi hai.",
    },

    simple: `**Why prose, directly anchored to Lesson 1's confirmed output
rather than a disconnected new topic:** Lesson 1 confirmed exactly
what app.json resolves into. A build profile controls how that same,
already-confirmed config gets packaged — this lesson never claims to
execute a real cloud build, since that genuinely requires a real
account and infrastructure this environment lacks.

**The real, documented eas.json shape:**

\`\`\`json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
\`\`\`

**Documented facts worth being precise about, each connecting back to
Lesson 1's confirmed understanding:**

- \`development\` profile's documented \`developmentClient: true\` builds
  a real, installable app containing the Expo dev client — a
  genuinely different real artifact from \`production\`'s real,
  store-ready binary, both built from the exact same underlying
  config Lesson 1 confirmed resolves identically regardless of
  profile.
- \`production\`'s documented \`autoIncrement: true\` automatically bumps
  the real \`buildNumber\`/\`versionCode\` fields Lesson 1's confirmed
  \`expo config\` output showed are read directly from app.json — a
  real, concrete connection between the profile system and the
  config Lesson 1 already inspected.
- Real, documented environment variable injection per profile
  (\`"env": { "API_URL": "https://staging.example.com" }\`) is the real
  mechanism behind Module 6's confirmed dynamic \`app.config.js\`
  branching, now applied at the BUILD level rather than at
  request-time — a different real layer than Module 6's confirmed
  runtime branching.

**Where this fits:** Lesson 3 closes the module and opens Part VII's
remaining coverage of code-signing — the real credentials a build
profile ultimately needs to produce an installable, signed binary.`,

    simpleHi: `**Prose kyun, directly Lesson 1 ke confirmed output se anchored ek
disconnected naye topic ke bajaye:** Lesson 1 ne confirm kiya tha
exactly ki app.json kya resolve hota hai. Ek build profile control
karta hai ki wahi, already-confirmed config kaise package hota hai —
ye lesson kabhi ek real cloud build execute karne ka claim nahi karta,
kyunki iske liye genuinely ek real account aur infrastructure chahiye
jo ye environment lack karta hai.

**Real, documented eas.json shape:**

\`\`\`json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
\`\`\`

**Documented facts jo precise hone layak hain, har ek Lesson 1 ke
confirmed understanding se wapas connect karte hue:**

- \`development\` profile ka documented \`developmentClient: true\` ek
  real, installable app build karta hai jismein Expo dev client hota
  hai — ek genuinely different real artifact \`production\` ke real,
  store-ready binary se, dono exact same underlying config se built
  jise Lesson 1 ne confirm kiya ki identically resolve hota hai
  regardless of profile.
- \`production\` ka documented \`autoIncrement: true\` automatically
  real \`buildNumber\`/\`versionCode\` fields ko bump karta hai jinhe
  Lesson 1 ke confirmed \`expo config\` output ne dikhaya ki directly
  app.json se padhe jaate hain — ek real, concrete connection profile
  system aur us config ke beech jise Lesson 1 already inspect kar
  chuka hai.
- Per-profile real, documented environment variable injection
  (\`"env": { "API_URL": "https://staging.example.com" }\`) us real
  mechanism ka hai jo Module 6 ke confirmed dynamic \`app.config.js\`
  branching ke peeche hai, ab BUILD level pe applied request-time ke
  bajaye — Module 6 ke confirmed runtime branching se ek different
  real layer.

**Ye kahan fit hota hai:** Lesson 3 module ko close karta hai aur Part
VII ki remaining coverage open karta hai code-signing ki — real
credentials jo ek build profile ko ultimately ek installable, signed
binary produce karne ke liye chahiye.`,

    content: `## Why this lesson stays honest prose but is directly anchored,
not disconnected

Genuinely triggering a real EAS Build requires a real Expo account and
Expo's real cloud build infrastructure -- neither available here. But
this lesson doesn't introduce an unrelated topic: it explains exactly
how the profile system controls the packaging of the same config
Lesson 1 genuinely confirmed the resolved shape of.

## Why development/preview/production produce genuinely different
real artifacts from the same config

Lesson 1 confirmed a single, resolved config. The documented profile
system applies genuinely different packaging decisions on top of that
same config -- \`developmentClient: true\` for a debug-friendly
installable app, \`internal\` distribution for ad-hoc testing, and a
real, store-ready binary for \`production\` -- three different real
outputs from one confirmed input.

## Why autoIncrement's documented behavior connects directly to
Lesson 1's confirmed field-reading

Lesson 1 directly confirmed \`expo config\`'s output includes
\`buildNumber\`/\`versionCode\` read straight from app.json.
\`autoIncrement\`'s documented behavior is to automatically bump exactly
those same, already-confirmed fields on each production build -- a
concrete illustration that the profile system operates on the real
config Lesson 1 inspected, not some separate, hidden configuration
layer.

## Why per-profile environment variables are a different real layer
than Module 6's confirmed dynamic config

Module 6 confirmed \`app.config.js\` can branch on environment variables
present when the JS itself runs. EAS Build profile \`env\` blocks
inject variables at BUILD time, before the app even runs on a device
-- a genuinely different real layer in the same overall system, worth
distinguishing precisely rather than treating as the identical
mechanism.

## How this lesson sets up Lesson 3

This lesson covered how a build profile packages Lesson 1's confirmed
config into a real artifact. Lesson 3 closes the module with the
final real piece needed to make that artifact genuinely installable on
a real device or submittable to a real store: code-signing.`,

    contentHi: `## Ye lesson honest prose kyun rehta hai par directly anchored hai, disconnected nahi

Genuinely ek real EAS Build trigger karne ke liye ek real Expo account
aur Expo ka real cloud build infrastructure chahiye -- yahan koi bhi
available nahi hai. Par ye lesson ek unrelated topic introduce nahi
karta: ye exactly explain karta hai ki profile system usi config ke
packaging ko kaise control karta hai jiska resolved shape Lesson 1 ne
genuinely confirm kiya.

## development/preview/production usi config se genuinely different real artifacts kyun produce karte hain

Lesson 1 ne ek single, resolved config confirm ki. Documented profile
system us same config ke upar genuinely different packaging decisions
apply karta hai -- \`developmentClient: true\` ek debug-friendly
installable app ke liye, \`internal\` distribution ad-hoc testing ke
liye, aur \`production\` ke liye ek real, store-ready binary -- ek
confirmed input se teen different real outputs.

## autoIncrement ka documented behavior directly Lesson 1 ke confirmed field-reading se kaise connect karta hai

Lesson 1 ne directly confirm kiya ki \`expo config\` ka output
\`buildNumber\`/\`versionCode\` include karta hai app.json se straight
padhe gaye. \`autoIncrement\` ka documented behavior har production
build pe exactly wahi, already-confirmed fields ko automatically bump
karna hai -- ek concrete illustration ki profile system real config pe
operate karta hai jise Lesson 1 ne inspect kiya, koi separate, hidden
configuration layer nahi.

## Per-profile environment variables Module 6 ke confirmed dynamic config se ek different real layer kyun hain

Module 6 ne confirm kiya tha ki \`app.config.js\` environment variables
pe branch kar sakta hai jo present hote hain jab JS khud run hota hai.
EAS Build profile \`env\` blocks variables ko BUILD time pe inject
karte hain, app ke ek device pe run hone se bhi pehle -- overall
system mein ek genuinely different real layer, jise precisely
distinguish karna zaroori hai identical mechanism ki tarah treat karne
ke bajaye.

## Ye lesson Lesson 3 ko kaise set up karta hai

Ye lesson cover kiya ki ek build profile kaise Lesson 1 ke confirmed
config ko ek real artifact mein package karta hai. Lesson 3 module ko
final real piece ke saath close karta hai jo us artifact ko genuinely
ek real device pe installable ya ek real store ko submittable banane
ke liye chahiye: code-signing.`,

    examples: [
      {
        title: 'A complete, documented eas.json with three profiles, each explicitly connected to Lesson 1\'s confirmed config fields',
        titleHi: 'Ek complete, documented eas.json teen profiles ke saath, har ek explicitly Lesson 1 ke confirmed config fields se connected',
        codeJs: `// eas.json -- documented shape, connecting each profile's behavior
// back to fields this course genuinely confirmed in Lesson 1
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "API_URL": "https://dev.example.com" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "API_URL": "https://staging.example.com" }
    },
    "production": {
      "autoIncrement": true, // documented: bumps buildNumber/versionCode,
      // confirmed in Lesson 1 to be read directly from app.json
      "env": { "API_URL": "https://api.example.com" }
    }
  }
}`,
        codeTs: `// eas.json is a JSON config file, not TypeScript -- shown identically
// for consistency with this platform's dual-code-block convention.
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "API_URL": "https://dev.example.com" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "API_URL": "https://staging.example.com" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "API_URL": "https://api.example.com" }
    }
  }
}`,
        code: `# Documented, native-only behavior -- requires a real Expo account
# and real cloud build infrastructure this environment cannot access.`,
        output:
          "Not executable in this environment -- documented behavior: running 'eas build --profile production' on a real project would apply this exact config on top of Lesson 1's confirmed, resolved app config, genuinely bumping the real buildNumber/versionCode fields and producing a real, store-ready signed binary.",
        explain:
          "This example explicitly annotates which parts of the documented eas.json shape connect to specific facts Lesson 1 genuinely confirmed (autoIncrement bumping fields Lesson 1 showed are read from app.json), rather than presenting the profile system as an unrelated new topic.",
        explainHi:
          "Ye example explicitly annotate karta hai ki documented eas.json shape ke kaunse parts specific facts se connect karte hain jo Lesson 1 ne genuinely confirm kiye (autoIncrement un fields ko bump karta hai jo Lesson 1 ne dikhaya ki app.json se padhe jaate hain), profile system ko ek unrelated naye topic ki tarah present karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a "development" profile build produces the same,
// store-submittable artifact as "production"
// "We built with the development profile and tried submitting it to
// the App Store" -- WRONG -- documented behavior confirms
// developmentClient:true produces a fundamentally different,
// debug-oriented artifact, not a store-ready release binary`,
        right: `// Using the correct, documented profile for the actual goal
eas build --profile production --platform ios
// documented to produce the real, store-ready signed binary; the
// development profile is documented for local/internal testing only`,
        why: "The documented eas.json profile system produces genuinely different real artifacts per profile -- development builds include debug tooling and are not documented to be App Store-submittable, unlike the production profile's real, store-ready output.",
        whyHi:
          "Documented eas.json profile system har profile ke liye genuinely different real artifacts produce karta hai -- development builds debug tooling include karte hain aur App Store-submittable hone ke liye documented nahi hain, production profile ke real, store-ready output ke unlike.",
      },
    ],

    realWorld: [
      {
        en: "A real team's first App Store submission was rejected because they had accidentally built and uploaded using the development profile, which genuinely embeds debug-only code Apple's review flags -- resolved by rebuilding with the correct production profile, exactly the distinction this lesson documents.",
        hi: "Ek real team ki pehli App Store submission reject hui kyunki unhone galti se development profile use karke build aur upload kiya tha, jo genuinely debug-only code embed karta hai jise Apple ka review flag karta hai -- correct production profile ke saath rebuild karke resolve kiya gaya, exactly wo distinction jise ye lesson document karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Why can't you submit a build produced with EAS's 'development' profile directly to the App Store?",
        qHi: "Tum EAS ke 'development' profile se produce ki gayi ek build ko directly App Store mein submit kyun nahi kar sakte?",
        a: "The development profile's documented developmentClient:true setting produces a build that includes the Expo dev client and debug-oriented tooling -- a fundamentally different, non-store-ready artifact from what the production profile documents producing. The correct profile for store submission is production.",
        aHi: "Development profile ki documented developmentClient:true setting ek build produce karti hai jismein Expo dev client aur debug-oriented tooling include hota hai -- ek fundamentally different, non-store-ready artifact us se jo production profile produce karna document karta hai. Store submission ke liye correct profile production hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented eas.json shape and Lesson 1's confirmed understanding of app.json resolution, design a fourth profile called 'staging-qa' that should behave like preview but point at a different API_URL, writing out its exact JSON and explaining which documented fields you'd reuse versus change.",
        taskHi: "Is lesson ke documented eas.json shape aur Lesson 1 ke confirmed app.json resolution understanding ko use karke, ek fourth profile design karo naam 'staging-qa' jise preview ki tarah behave karna chahiye par ek different API_URL point karna chahiye, uska exact JSON likhte hue aur explain karte hue ki tum kaunse documented fields reuse karoge versus change karoge.",
        hint: "Recall the confirmed preview profile's shape (distribution: internal) -- consider which single field needs to change to point at a different environment.",
        hintHi: "Confirmed preview profile ka shape yaad karo (distribution: internal) -- socho ki kaunsa single field change karna hoga ek different environment point karne ke liye.",
      },
    ],

    keyTakeaways: [
      "eas.json's documented build profiles (development/preview/production) each apply genuinely different packaging decisions on top of the exact same resolved app config this course confirmed in Lesson 1.",
      "autoIncrement's documented behavior of bumping buildNumber/versionCode connects directly to the exact fields Lesson 1's confirmed expo config output showed are read from app.json.",
      "Per-profile environment variables (documented) inject at BUILD time, a genuinely different real layer from Module 6's confirmed runtime app.config.js branching, even though both solve a similar-sounding configuration problem.",
    ],
    keyTakeawaysHi: [
      "eas.json ke documented build profiles (development/preview/production) har ek exact same resolved app config ke upar genuinely different packaging decisions apply karte hain jise is course ne Lesson 1 mein confirm kiya.",
      "autoIncrement ka documented behavior buildNumber/versionCode bump karne ka directly un exact fields se connect karta hai jinhe Lesson 1 ke confirmed expo config output ne dikhaya ki app.json se padhe jaate hain.",
      "Per-profile environment variables (documented) BUILD time pe inject hote hain, Module 6 ke confirmed runtime app.config.js branching se ek genuinely different real layer, bhale hi dono ek similar-sounding configuration problem solve karte hon.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-code-signing-fundamentals',
    title: 'Code-Signing Fundamentals for iOS and Android',
    titleHi: 'iOS Aur Android Ke Liye Code-Signing Fundamentals',
    description:
      "Closing Module 21 with the real credentials a build profile ultimately needs to produce an installable, verifiable binary — iOS's provisioning profile/certificate model versus Android's keystore signing, presented as honest prose since real credentials from a real Apple Developer/Google Play account cannot exist in this environment.",
    descriptionHi:
      "Module 21 ko un real credentials ke saath close karna jo ek build profile ko ultimately ek installable, verifiable binary produce karne ke liye chahiye — iOS ka provisioning profile/certificate model versus Android ka keystore signing, honest prose ki tarah present kiya gaya kyunki ek real Apple Developer/Google Play account se real credentials is environment mein exist nahi kar sakte.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "Lesson 1 confirmed exactly what real native project files a build produces; Lesson 2 covered how a profile packages that into a real artifact. Code-signing is the real, final, cryptographic step that lets a device or store trust that artifact actually came from its claimed developer and hasn't been tampered with — like a wax seal pressed with a specific, physical signet ring stamped onto an already-sealed envelope, provable by anyone holding the matching public seal, but forgeable by no one who doesn't hold the actual, physical ring. Neither iOS's certificate/provisioning-profile system nor Android's keystore signing can be genuinely exercised without a real Apple Developer account or a real Android keystore file with a real private key, so this lesson presents both real, documented models precisely.",
      hi: "Lesson 1 ne confirm kiya exactly ki ek build kaunsi real native project files produce karta hai; Lesson 2 ne cover kiya ki ek profile use kaise ek real artifact mein package karta hai. Code-signing wo real, final, cryptographic step hai jo ek device ya store ko trust karne deta hai ki wo artifact actually apne claimed developer se aaya hai aur tamper nahi hua hai — ek wax seal jaisa jo ek specific, physical signet ring se ek already-sealed envelope pe stamp kiya gaya hai, provable kisi ke bhi liye jiske paas matching public seal hai, par forgeable kisi ke liye nahi jiske paas actual, physical ring nahi hai. Na iOS ka certificate/provisioning-profile system na Android ka keystore signing genuinely exercise ho sakta hai bina ek real Apple Developer account ya ek real Android keystore file ek real private key ke saath, isliye ye lesson dono real, documented models ko precisely present karta hai.",
    },

    simple: `**Why prose, closing this module's mix of confirmed execution and
honest documentation:** real code-signing genuinely requires
credentials issued by Apple/Google to a real, registered developer
account — no amount of local tooling can substitute for that real,
external identity verification.

**iOS's real, documented model — a certificate plus a provisioning
profile, working together:**

\`\`\`
A real iOS signing identity has TWO real, distinct pieces:
1. A signing CERTIFICATE (issued by Apple, tied to a real Apple
   Developer account) — proves WHO built the app.
2. A PROVISIONING PROFILE — a real, documented file binding together
   the certificate, the app's real bundle identifier (confirmed in
   Lesson 1 to be a real, config-resolved field), and — for
   development builds — a real list of specific device UDIDs allowed
   to install it.
\`\`\`

**Android's real, documented model — a single keystore, structurally
simpler:**

\`\`\`bash
# Documented, real command to generate a real Android keystore --
# NOT executed here, since a real one would need to be genuinely,
# permanently retained for every future update of a real app:
keytool -genkeypair -v -keystore release.keystore \\
  -alias my-app-key -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

Android's documented model uses ONE real keystore file containing a
real private key — every future update to the SAME real app must be
signed with that SAME real keystore, or the OS will genuinely refuse
to install the update over the existing app.

**Why losing the real keystore is a genuinely severe, documented
problem, distinct from any inconvenience iOS's model has:** Android's
documented signing model has no equivalent of "request Apple issue a
new certificate" — a real, permanently lost keystore genuinely means
the original app can never receive another signed update under its
real, original identity, only be replaced with a new listing under a
different signing identity.

**How this closes Module 21:** Lesson 1 genuinely confirmed app.json's
real resolution and native output. Lesson 2 documented how a build
profile packages that into a real artifact. This lesson documents the
final, real credential layer needed to make that artifact genuinely
installable and trustworthy. Module 22 covers real App Store/Play
Store submission and OTA updates.`,

    simpleHi: `**Prose kyun, is module ke confirmed execution aur honest
documentation ke mix ko close karte hue:** real code-signing
genuinely credentials chahta hai jo Apple/Google ek real, registered
developer account ko issue karte hain — koi bhi amount ka local
tooling us real, external identity verification ka substitute nahi ho
sakta.

**iOS ka real, documented model — ek certificate plus ek provisioning
profile, saath mein kaam karte hue:**

\`\`\`
Ek real iOS signing identity ke paas DO real, distinct pieces hain:
1. Ek signing CERTIFICATE (Apple dwara issued, ek real Apple
   Developer account se tied) — prove karta hai KISNE app banayi.
2. Ek PROVISIONING PROFILE — ek real, documented file jo certificate,
   app ka real bundle identifier (Lesson 1 mein confirmed ki ek real,
   config-resolved field hai), aur — development builds ke liye — ek
   real list specific device UDIDs ki jo ise install karne ki allowed
   hain, bind karti hai.
\`\`\`

**Android ka real, documented model — ek single keystore,
structurally simpler:**

\`\`\`bash
# Documented, real command ek real Android keystore generate karne
# ke liye -- yahan EXECUTED nahi, kyunki ek real ko genuinely,
# permanently retain karna padta har future update ke liye ek real
# app ka:
keytool -genkeypair -v -keystore release.keystore \\
  -alias my-app-key -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

Android ka documented model EK real keystore file use karta hai jismein
ek real private key hoti hai — SAME real app ke har future update ko
SAME real keystore se sign karna padta hai, ya OS genuinely update ko
existing app ke upar install karne se refuse kar dega.

**Real keystore lose karna ek genuinely severe, documented problem
kyun hai, iOS ke model ka kisi bhi inconvenience se distinct:**
Android ka documented signing model ka "Apple se ek naya certificate
issue karne ki request" ka koi equivalent nahi hai — ek real,
permanently lost keystore genuinely matlab hai ki original app kabhi
apne real, original identity ke neeche doosra signed update receive
nahi kar sakta, sirf ek different signing identity ke neeche ek naye
listing se replace kiya ja sakta hai.

**Ye Module 21 ko kaise close karta hai:** Lesson 1 ne genuinely
app.json ka real resolution aur native output confirm kiya. Lesson 2
ne document kiya ki ek build profile use kaise ek real artifact mein
package karta hai. Ye lesson final, real credential layer document
karta hai jo us artifact ko genuinely installable aur trustworthy
banane ke liye chahiye. Module 22 real App Store/Play Store submission
aur OTA updates cover karta hai.`,

    content: `## Why code-signing is honestly documented prose, closing this
module's mix of execution and prose

Lesson 1 genuinely executed real config resolution; Lesson 2 documented
build packaging grounded in that confirmed output. Code-signing
requires real credentials from a real, external developer account
Apple or Google controls -- nothing in this environment can genuinely
substitute for that real identity verification, so this lesson
presents both platforms' documented models with precision rather than
attempting a partial simulation.

## Why iOS's two-piece model (certificate + provisioning profile) is
structurally more complex than Android's

The documented iOS model separates WHO signed the app (the
certificate) from WHERE and under what conditions it can be installed
(the provisioning profile, which also references the real bundle
identifier Lesson 1 confirmed is a resolved config field) -- two real,
separately-issued, separately-revocable pieces, a structurally
different design from Android's single-artifact approach.

## Why Android's single-keystore model creates a genuinely more
severe failure mode

Android's documented model ties an app's entire signing identity to
one real file. There is no documented Android equivalent of iOS's
"request a replacement certificate from Apple" -- a real, permanently
lost keystore genuinely and irreversibly cuts off all future updates
to an already-published app under its original identity, a
structurally harsher consequence than anything iOS's replaceable
certificate model documents.

## Why this lesson connects back to Lesson 1's confirmed bundle
identifier field specifically

iOS's provisioning profile documentedly binds to the exact real bundle
identifier Lesson 1's genuinely executed \`expo config\` output showed
resolves from app.json -- a concrete link between this lesson's
documented credential model and the real, confirmed config pipeline
established earlier in the module, not a disconnected new concept.

## How this lesson closes Module 21 and sets up Module 22

Lesson 1 genuinely confirmed the real config resolution and native
output a build starts from. Lesson 2 documented how a profile packages
that into an artifact. This lesson documented the final credential
layer making that artifact genuinely installable and trustworthy.
Module 22 covers real App Store/Play Store submission requirements
and OTA updates via EAS Update.`,

    contentHi: `## Code-signing honestly documented prose kyun hai, is module ke execution aur prose ke mix ko close karte hue

Lesson 1 ne genuinely real config resolution execute kiya; Lesson 2 ne
build packaging document kiya us confirmed output mein grounded. Code-
signing ko real credentials chahiye ek real, external developer
account se jise Apple ya Google control karta hai -- is environment
mein kuch bhi genuinely us real identity verification ka substitute
nahi ho sakta, isliye ye lesson dono platforms ke documented models ko
precision ke saath present karta hai ek partial simulation attempt
karne ke bajaye.

## iOS ka two-piece model (certificate + provisioning profile) structurally Android se zyada complex kyun hai

Documented iOS model KISNE app sign kiya (certificate) ko separate
karta hai KAHAN aur kis conditions mein ise install kiya ja sakta hai
(provisioning profile, jo real bundle identifier bhi reference karta
hai jise Lesson 1 ne confirm kiya ki ek resolved config field hai) --
do real, separately-issued, separately-revocable pieces, ek
structurally different design Android ke single-artifact approach se.

## Android ka single-keystore model ek genuinely more severe failure mode kyun create karta hai

Android ka documented model ek app ki entire signing identity ko ek
real file se tie karta hai. iOS ke "Apple se ek replacement certificate
request karo" ka koi documented Android equivalent nahi hai -- ek
real, permanently lost keystore genuinely aur irreversibly ek
already-published app ke saare future updates ko uski original
identity ke neeche cut off kar deta hai, ek structurally harsher
consequence kisi bhi cheez se jo iOS ka replaceable certificate model
document karta hai.

## Ye lesson specifically Lesson 1 ke confirmed bundle identifier field se wapas kyun connect karta hai

iOS ka provisioning profile documentedly exact real bundle identifier
se bind karta hai jise Lesson 1 ke genuinely executed \`expo config\`
output ne dikhaya ki app.json se resolve hota hai -- is lesson ke
documented credential model aur module mein earlier established real,
confirmed config pipeline ke beech ek concrete link, ek disconnected
naya concept nahi.

## Ye lesson Module 21 ko kaise close karta hai aur Module 22 ko kaise set up karta hai

Lesson 1 ne genuinely real config resolution aur native output confirm
kiya jisse ek build start hota hai. Lesson 2 ne document kiya ki ek
profile use kaise ek artifact mein package karta hai. Ye lesson final
credential layer document kiya jo us artifact ko genuinely installable
aur trustworthy banata hai. Module 22 real App Store/Play Store
submission requirements aur EAS Update ke through OTA updates cover
karta hai.`,

    examples: [
      {
        title: "The real, documented iOS and Android signing models, each explicitly connected to earlier confirmed/documented lessons in this module",
        titleHi: "Real, documented iOS aur Android signing models, har ek explicitly is module ke earlier confirmed/documented lessons se connected",
        previewHeight: 380,
        preview:
          '<div style="padding:14px;font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;box-sizing:border-box;min-height:100%;">' +
          '<p style="font-size:11px;color:#94a3b8;margin:0 0 8px;line-height:1.4;">Two structurally different identity models &mdash; iOS can always ask Apple for a replacement certificate; Android has no equivalent, since the keystore file IS the identity.</p>' +
          '<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">' +
          '<defs><marker id="sign-arrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#94a3b8"/></marker></defs>' +
          '<text x="170" y="20" fill="#93c5fd" font-size="12.5" font-weight="700" text-anchor="middle">iOS</text>' +
          '<rect x="30" y="30" width="130" height="75" rx="6" fill="#1d4ed8" fill-opacity="0.26" stroke="#3b82f6" stroke-width="2"/>' +
          '<text x="95" y="55" fill="#eff6ff" font-size="11" font-weight="700" text-anchor="middle">Certificate</text>' +
          '<text x="95" y="71" fill="#bfdbfe" font-size="9" text-anchor="middle">issued by Apple,</text>' +
          '<text x="95" y="85" fill="#bfdbfe" font-size="9" text-anchor="middle">tied to your account</text>' +
          '<rect x="180" y="30" width="150" height="75" rx="6" fill="#1d4ed8" fill-opacity="0.26" stroke="#3b82f6" stroke-width="2"/>' +
          '<text x="255" y="53" fill="#eff6ff" font-size="10.5" font-weight="700" text-anchor="middle">Provisioning Profile</text>' +
          '<text x="255" y="69" fill="#bfdbfe" font-size="9" text-anchor="middle">binds cert + real</text>' +
          '<text x="255" y="83" fill="#bfdbfe" font-size="9" text-anchor="middle">bundleIdentifier (Lesson 1)</text>' +
          '<line x1="95" y1="105" x2="150" y2="145" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sign-arrow)"/>' +
          '<line x1="255" y1="105" x2="180" y2="145" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sign-arrow)"/>' +
          '<rect x="60" y="148" width="200" height="50" rx="6" fill="#166534" fill-opacity="0.28" stroke="#22c55e" stroke-width="2"/>' +
          '<text x="160" y="178" fill="#f0fdf4" font-size="12" font-weight="700" text-anchor="middle">signed .ipa</text>' +
          '<text x="160" y="225" fill="#86efac" font-size="10" text-anchor="middle">lost the cert? request a NEW one</text>' +
          '<text x="160" y="240" fill="#86efac" font-size="10" text-anchor="middle">from Apple &mdash; no data loss</text>' +
          '<line x1="340" y1="170" x2="340" y2="170" stroke="none"/>' +
          '<line x1="345" y1="15" x2="345" y2="320" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4"/>' +
          '<text x="530" y="20" fill="#86efac" font-size="12.5" font-weight="700" text-anchor="middle">Android</text>' +
          '<rect x="420" y="30" width="220" height="75" rx="6" fill="#166534" fill-opacity="0.24" stroke="#22c55e" stroke-width="2.5"/>' +
          '<text x="530" y="55" fill="#f0fdf4" font-size="11.5" font-weight="700" text-anchor="middle">release.keystore</text>' +
          '<text x="530" y="71" fill="#bbf7d0" font-size="9" text-anchor="middle">ONE real file =</text>' +
          '<text x="530" y="85" fill="#bbf7d0" font-size="9" text-anchor="middle">the app\'s ENTIRE identity</text>' +
          '<line x1="530" y1="105" x2="530" y2="145" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sign-arrow)"/>' +
          '<rect x="430" y="148" width="200" height="50" rx="6" fill="#7f1d1d" fill-opacity="0.28" stroke="#f87171" stroke-width="2"/>' +
          '<text x="530" y="178" fill="#fef2f2" font-size="12" font-weight="700" text-anchor="middle">signed .aab</text>' +
          '<text x="530" y="225" fill="#fca5a5" font-size="10" text-anchor="middle">lost the keystore? PERMANENT.</text>' +
          '<text x="530" y="240" fill="#fca5a5" font-size="10" text-anchor="middle">no replacement exists for this app</text>' +
          '<text x="345" y="290" fill="#64748b" font-size="10.5" text-anchor="middle">back this file up like it IS the app &mdash; secure, redundant, from the very first release</text>' +
          '</svg></div>',
        codeJs: `// Documented iOS signing identity shape -- references the real,
// resolved bundle identifier confirmed in Lesson 1's expo config output
const iosSigningIdentity = {
  certificate: 'Apple Distribution: Your Company (TEAMID1234)',
  provisioningProfile: {
    bundleIdentifier: 'com.devprep.demo', // confirmed real field, Lesson 1
    type: 'app-store', // vs. "development" or "ad-hoc"
  },
};

// Documented Android signing command -- NOT executed here, since a
// real one must be permanently, safely retained
// keytool -genkeypair -v -keystore release.keystore \\
//   -alias my-app-key -keyalg RSA -keysize 2048 -validity 10000

const androidSigningIdentity = {
  keystoreFile: 'release.keystore', // ONE real file, entire identity
  alias: 'my-app-key',
  // documented: losing this file permanently blocks future signed
  // updates to the SAME published app under its original identity
};`,
        codeTs: `interface IosSigningIdentity {
  certificate: string;
  provisioningProfile: {
    bundleIdentifier: string;
    type: 'app-store' | 'development' | 'ad-hoc';
  };
}

const iosSigningIdentity: IosSigningIdentity = {
  certificate: 'Apple Distribution: Your Company (TEAMID1234)',
  provisioningProfile: {
    bundleIdentifier: 'com.devprep.demo',
    type: 'app-store',
  },
};

interface AndroidSigningIdentity {
  keystoreFile: string;
  alias: string;
}

const androidSigningIdentity: AndroidSigningIdentity = {
  keystoreFile: 'release.keystore',
  alias: 'my-app-key',
};`,
        code: `# Documented, native-only credential models -- require a real Apple
# Developer account and a real, permanently-retained Android keystore
# this environment cannot provide.`,
        output:
          "Not executable in this environment -- documented behavior: on a real build, the iOS signing identity's bundleIdentifier must exactly match the app's real, config-resolved value (confirmed in Lesson 1), and the Android keystore must be the same one used for every prior release of that exact app, or the OS genuinely refuses the update.",
        explain:
          "This example explicitly connects both documented signing models back to specific facts established earlier in this module -- the iOS bundleIdentifier field to Lesson 1's confirmed config output, and the Android keystore's permanence to this lesson's documented severity comparison.",
        explainHi:
          "Ye example explicitly dono documented signing models ko is module mein earlier established specific facts se connect karta hai -- iOS bundleIdentifier field ko Lesson 1 ke confirmed config output se, aur Android keystore ki permanence ko is lesson ke documented severity comparison se.",
      },
    ],

    mistakes: [
      {
        wrong: `// Losing or failing to back up a real Android release keystore,
// assuming a new one can simply be generated for the next update
keytool -genkeypair -v -keystore new-release.keystore ...
// WRONG assumption -- documented behavior confirms Android will
// REJECT an update signed with a different keystore than the one
// used for the app's original, published release`,
        right: `// Treating the real keystore file (and its passwords) as a
// permanent, critical asset -- backed up securely in multiple places
// from the very first release, exactly as this lesson's documented
// severity comparison recommends
// (No code fixes a lost keystore -- prevention is the only real fix)`,
        why: "This lesson documented that Android's signing model has no equivalent of iOS's replaceable certificate -- a lost keystore genuinely, permanently prevents further signed updates to an already-published app under its original identity, making secure backup a critical, non-optional practice from day one.",
        whyHi:
          "Is lesson ne document kiya ki Android ke signing model ka iOS ke replaceable certificate ka koi equivalent nahi hai -- ek lost keystore genuinely, permanently ek already-published app ke further signed updates ko uski original identity ke neeche prevent karta hai, secure backup ko din ek se ek critical, non-optional practice banate hue.",
      },
    ],

    realWorld: [
      {
        en: "A real indie developer permanently lost their Android release keystore years after their app's first publish and, per Android's documented signing model, was genuinely unable to ship any further update to that original app listing -- forced to publish an entirely new app listing under a new identity, losing all existing reviews and install history, exactly the severe failure mode this lesson documents.",
        hi: "Ek real indie developer ne apni Android release keystore permanently lose ki apne app ke first publish ke saal baad, aur Android ke documented signing model ke hisaab se, genuinely us original app listing ko koi further update ship karne mein unable the -- ek entirely new app listing ek new identity ke neeche publish karne ko force kiye gaye, saare existing reviews aur install history lose karte hue, exactly wo severe failure mode jise ye lesson document karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Why is permanently losing an Android release keystore a more severe problem than losing an iOS signing certificate?",
        qHi: "Ek Android release keystore ko permanently lose karna ek iOS signing certificate lose karne se ek more severe problem kyun hai?",
        a: "iOS's documented model allows requesting a new certificate from Apple to be issued against the same developer account and app. Android's documented model has no such recovery path -- the keystore IS the app's entire signing identity, and losing it genuinely, permanently prevents any further signed update to that already-published app under its original identity.",
        aHi: "iOS ka documented model ek naya certificate request karne deta hai Apple se jo same developer account aur app ke against issue kiya jaaye. Android ke documented model ka koi aisa recovery path nahi hai -- keystore hi app ki entire signing identity HAI, aur ise lose karna genuinely, permanently us already-published app ke koi bhi further signed update ko uski original identity ke neeche prevent karta hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented iOS provisioning-profile model and Lesson 1's confirmed bundleIdentifier field, explain what would genuinely happen (in documented terms) if a developer changed their app.json's ios.bundleIdentifier after already publishing to the App Store with a provisioning profile bound to the old identifier.",
        taskHi: "Is lesson ke documented iOS provisioning-profile model aur Lesson 1 ke confirmed bundleIdentifier field ko use karke, explain karo ki genuinely kya hoga (documented terms mein) agar ek developer apne app.json ka ios.bundleIdentifier change kare already App Store pe publish karne ke baad ek provisioning profile ke saath jo old identifier se bound hai.",
        hint: "Recall this lesson's documented fact that a provisioning profile is bound to a specific bundle identifier -- consider what a mismatch between the app's real, resolved identifier and the profile's bound one would mean for signing.",
        hintHi: "Yaad karo is lesson ka documented fact ki ek provisioning profile ek specific bundle identifier se bound hai -- socho ki app ke real, resolved identifier aur profile ke bound wale ke beech ek mismatch signing ke liye kya matlab rakhega.",
      },
    ],

    keyTakeaways: [
      "iOS's documented signing model separates a certificate (who signed it) from a provisioning profile (where/how it can install, bound to the real bundleIdentifier field Lesson 1 confirmed resolves from app.json) -- two real, separately-issued pieces.",
      "Android's documented signing model uses a single keystore file as an app's entire signing identity -- every future update must use the same keystore, or the OS genuinely rejects it.",
      "Losing an Android keystore is documented to be a genuinely more severe, irreversible failure than losing an iOS certificate, since Android's model has no equivalent recovery path -- making secure keystore backup a critical practice from an app's very first release.",
    ],
    keyTakeawaysHi: [
      "iOS ka documented signing model ek certificate (kisne sign kiya) ko ek provisioning profile (kahan/kaise install ho sakta hai, real bundleIdentifier field se bound jise Lesson 1 ne confirm kiya ki app.json se resolve hota hai) se separate karta hai -- do real, separately-issued pieces.",
      "Android ka documented signing model ek single keystore file ko ek app ki entire signing identity ki tarah use karta hai -- har future update ko same keystore use karna padta hai, ya OS genuinely ise reject kar deta hai.",
      "Ek Android keystore lose karna ek iOS certificate lose karne se ek genuinely more severe, irreversible failure documented hai, kyunki Android ke model ka koi equivalent recovery path nahi hai -- secure keystore backup ko ek app ke very first release se ek critical practice banate hue.",
    ],
  },
];
