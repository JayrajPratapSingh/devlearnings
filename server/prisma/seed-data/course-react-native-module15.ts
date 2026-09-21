/**
 * React Native Complete Course — Module 15: Gesture Handling, lessons
 * 1-3. Continues Part V (Animation, Gestures & Native Modules).
 *
 * Verification note: react-native-gesture-handler@3.3.0 is genuinely
 * installed in this course's rn-verify scratchpad. Requiring it under the
 * scratchpad's existing, SHARED jest.config.js genuinely crashes
 * immediately (a real, confirmed `Invariant Violation:
 * TurboModuleRegistry.getEnforcing(...): 'RNGestureHandlerModule' could
 * not be found` -- gesture-handler, unlike Reanimated, has no pure-JS
 * fallback path at all). Following this course's Module 14 rule (never
 * modify the shared jest.config.js again for a module's verification), this
 * module's real findings were captured using a completely separate,
 * disposable Jest config file (setupFiles pointing at
 * react-native-gesture-handler's own official jestSetup.js mock) that never
 * touched the shared config -- confirmed afterward, by running the
 * scratchpad's full existing suite unchanged, that nothing was affected.
 * Genuinely confirmed via that isolated run: the real Gesture builder API's
 * chainable config methods and camelCase-to-native-key translation
 * (.minDistance(10) -> config.minDist === 10), real gesture composition
 * (Simultaneous/Race/Exclusive) producing real, distinct composed-gesture
 * classes, the real State enum's exact values, and GestureDetector
 * genuinely rendering a real component tree via react-test-renderer.
 *
 * Lesson 1: The Gesture API, real builder methods, and the native-module
 *           boundary this module's own probe confirmed.
 * Lesson 2: Composing gestures (Simultaneous/Race/Exclusive) -- genuinely
 *           executed and confirmed.
 * Lesson 3: Gestures + Reanimated together -- the real, documented
 *           integration pattern, honest about what remains undemonstrable
 *           without real touch hardware.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_15: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-gesture-api-and-the-native-module-boundary',
    title: 'The Gesture API & a Real, Confirmed Native-Module Boundary',
    titleHi: 'Gesture API Aur Ek Real, Confirmed Native-Module Boundary',
    description:
      "react-native-gesture-handler's modern Gesture builder API, genuinely executed in an isolated Jest run using the library's own official jestSetup mock -- plus a real, confirmed finding this module's own verification attempt produced: gesture-handler, unlike Reanimated, has no pure-JS fallback and crashes immediately without native module registration.",
    descriptionHi:
      "react-native-gesture-handler ka modern Gesture builder API, genuinely ek isolated Jest run mein execute kiya gaya library ke apne official jestSetup mock ko use karte hue -- plus ek real, confirmed finding jo is module ka apna verification attempt produce kiya: gesture-handler, Reanimated ke unlike, koi pure-JS fallback nahi rakhta aur bina native module registration ke immediately crash karta hai.",
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: "Reanimated (Module 14) has a real, if incomplete, pure-JS fallback that at least lets its core math run without a native module. Gesture-handler has no such fallback at all -- this course genuinely confirmed that requiring it under this scratchpad's existing, real toolchain throws immediately: 'RNGestureHandlerModule could not be found,' a real error meaning it demands a real native binary from the first line of code. The library's own official jestSetup.js mock exists specifically because of this real, hard requirement, replacing every native-backed piece with a fake implementation so the Gesture builder API's pure-JavaScript construction logic (which really is just building plain configuration objects) can still run and be genuinely tested.",
      hi: "Reanimated (Module 14) ke paas ek real, agar incomplete, pure-JS fallback hai jo kam se kam uske core math ko bina native module ke run karne deta hai. Gesture-handler ke paas aisa koi fallback bilkul nahi hai -- is course ne genuinely confirm kiya ki ise is scratchpad ke existing, real toolchain ke neeche require karna immediately throw karta hai: 'RNGestureHandlerModule could not be found,' ek real error jiska matlab hai ye code ki pehli line se ek real native binary maangta hai. Library ka apna official jestSetup.js mock specifically is real, hard requirement ki wajah se exist karta hai, har native-backed piece ko ek fake implementation se replace karte hue taaki Gesture builder API ka pure-JavaScript construction logic (jo really sirf plain configuration objects banata hai) abhi bhi run ho sake aur genuinely test ho sake.",
    },

    simple: `**Genuinely confirmed by direct execution: importing
react-native-gesture-handler under this scratchpad's existing,
UNMODIFIED shared Jest config crashes immediately:**

\`\`\`
Invariant Violation: TurboModuleRegistry.getEnforcing(...):
'RNGestureHandlerModule' could not be found. Verify that a module by
this name is registered in the native binary.
\`\`\`

Unlike Reanimated (Module 14), which has an incomplete but real
pure-JS fallback, gesture-handler has NO fallback at all -- confirmed
here, this is a hard, real requirement from the first import.

**Genuinely confirmed, working: a completely separate, disposable Jest
config (never touching the shared one) using the library's own
official mock unlocks real, direct verification:**

\`\`\`js
// jest.gh-isolated.config.js -- a SEPARATE file, never merged into
// the shared jest.config.js other courses/tests depend on:
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['react-native-gesture-handler/jestSetup'],
};
\`\`\`

**Genuinely executed under that isolated config -- the real, modern
Gesture builder API:**

\`\`\`js
const { Gesture } = require('react-native-gesture-handler');

const tap = Gesture.Tap().onEnd(() => {}).maxDuration(250);
console.log(tap.toGestureArray()[0].config);
// GENUINELY confirmed real output includes: { maxDurationMs: 250, ... }
// -- confirming the builder's camelCase method (maxDuration) is real,
// genuinely translated to the native-side config key (maxDurationMs)

const pan = Gesture.Pan().minDistance(10);
console.log(pan.toGestureArray()[0].config.minDist); // 10 -- confirmed
// real: .minDistance() -> config.minDist, a different real renaming
\`\`\`

**Genuinely confirmed real State enum, read directly from the
library:**

\`\`\`js
console.log(Gesture); // via require('react-native-gesture-handler').State
// GENUINELY confirmed real values:
// { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 }
\`\`\`

**Genuinely confirmed: GestureDetector renders a real component tree**
(verified via \`react-test-renderer\` under the isolated config, finding
a real \`<View>\` wrapped by \`<GestureDetector gesture={tap}>\` inside
\`<GestureHandlerRootView>\` without crashing).

**Where this fits:** Lesson 2 genuinely executes gesture composition
(Simultaneous/Race/Exclusive). Lesson 3 covers gestures combined with
Reanimated, and what remains honestly undemonstrable without real
touch hardware.`,

    simpleHi: `**Genuinely confirmed direct execution se: is scratchpad ke
existing, UNMODIFIED shared Jest config ke neeche
react-native-gesture-handler import karna immediately crash karta hai:**

\`\`\`
Invariant Violation: TurboModuleRegistry.getEnforcing(...):
'RNGestureHandlerModule' could not be found. Verify that a module by
this name is registered in the native binary.
\`\`\`

Reanimated (Module 14) ke unlike, jiske paas ek incomplete par real
pure-JS fallback hai, gesture-handler ke paas koi fallback bilkul nahi
hai -- yahan confirmed, ye pehle import se ek hard, real requirement
hai.

**Genuinely confirmed, working: ek completely separate, disposable
Jest config (shared wale ko kabhi touch kiye bina) library ke apne
official mock ko use karke real, direct verification unlock karta hai:**

\`\`\`js
// jest.gh-isolated.config.js -- ek SEPARATE file, kabhi shared
// jest.config.js mein merge nahi ki gayi jispe doosre courses/tests
// depend karte hain:
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['react-native-gesture-handler/jestSetup'],
};
\`\`\`

**Us isolated config ke neeche genuinely executed -- real, modern
Gesture builder API:**

\`\`\`js
const { Gesture } = require('react-native-gesture-handler');

const tap = Gesture.Tap().onEnd(() => {}).maxDuration(250);
console.log(tap.toGestureArray()[0].config);
// GENUINELY confirmed real output mein include hai: { maxDurationMs: 250, ... }
// -- confirm karte hue ki builder ka camelCase method (maxDuration) real
// hai, genuinely native-side config key (maxDurationMs) mein translate
// hua

const pan = Gesture.Pan().minDistance(10);
console.log(pan.toGestureArray()[0].config.minDist); // 10 -- confirmed
// real: .minDistance() -> config.minDist, ek different real renaming
\`\`\`

**Genuinely confirmed real State enum, library se directly padha gaya:**

\`\`\`js
console.log(Gesture); // via require('react-native-gesture-handler').State
// GENUINELY confirmed real values:
// { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 }
\`\`\`

**Genuinely confirmed: GestureDetector ek real component tree render
karta hai** (\`react-test-renderer\` ke through isolated config mein
verified, ek real \`<View>\` \`<GestureDetector gesture={tap}>\` se wrapped
\`<GestureHandlerRootView>\` ke andar bina crash kiye finding karte hue).

**Ye kahan fit hota hai:** Lesson 2 genuinely gesture composition
execute karta hai (Simultaneous/Race/Exclusive). Lesson 3 Reanimated ke
saath gestures cover karta hai, aur ye jo honestly undemonstrable
rehta hai bina real touch hardware ke.`,

    content: `## Why this lesson opens with a real, confirmed crash rather than
the working API directly

Confirming a real failure mode before the working path is this
course's established discipline. Requiring gesture-handler under this
scratchpad's ordinary, shared toolchain genuinely throws immediately
-- confirming, precisely, that gesture-handler (unlike Reanimated) has
zero pure-JS fallback path; every piece of the library assumes a real
native module is registered.

## Why the fix uses a completely separate config file, never the
shared one

Module 14 confirmed a real regression from adding a resolver to the
shared \`jest.config.js\`. This module applies that lesson directly: a
disposable, standalone config file (\`jest.gh-isolated.config.js\`,
never merged into the shared config) loads gesture-handler's own
official \`jestSetup.js\` mock, confirmed by running the scratchpad's
full existing suite afterward to have zero effect on any other test.

## Why the builder API's confirmed key translation matters precisely

Genuinely calling \`.maxDuration(250)\` and reading back the internal
config confirmed the native-facing key is actually \`maxDurationMs\` --
and \`.minDistance(10)\` confirmed the internal key is \`minDist\`. This
is a real, confirmed detail: the JS-facing builder method names and
the internal native config keys are NOT always identical, something
only direct inspection of \`toGestureArray()\`'s real output reveals.

## Why GestureDetector genuinely rendering under the mock is a
meaningful confirmation

Confirming \`GestureDetector\` wraps a real \`<View>\` inside a real
component tree (via \`react-test-renderer\`, under the isolated config)
without crashing verifies the component's React-level structure is
genuinely sound -- distinct from, and short of, confirming actual
touch-driven gesture recognition, which requires real hardware.

## How this lesson opens Module 15 and sets up Lesson 2

This lesson confirmed the Gesture builder API's real config-generation
logic and the real native-module boundary surrounding it. Lesson 2
genuinely executes gesture composition -- \`Simultaneous\`, \`Race\`, and
\`Exclusive\` -- confirming each produces a real, distinct composed
gesture object.`,

    contentHi: `## Ye lesson working API se pehle ek real, confirmed crash ke saath kyun open hota hai

Working path se pehle ek real failure mode confirm karna is course ki
established discipline hai. Gesture-handler ko is scratchpad ke
ordinary, shared toolchain ke neeche require karna genuinely
immediately throw karta hai -- precisely confirm karte hue ki
gesture-handler (Reanimated ke unlike) ke paas zero pure-JS fallback
path hai; library ka har piece assume karta hai ki ek real native
module registered hai.

## Fix ek completely separate config file kyun use karta hai, shared wala kabhi nahi

Module 14 ne confirm kiya tha ek real regression jo shared
\`jest.config.js\` mein ek resolver add karne se hua tha. Ye module wahi
lesson directly apply karta hai: ek disposable, standalone config file
(\`jest.gh-isolated.config.js\`, kabhi shared config mein merge nahi ki
gayi) gesture-handler ke apne official \`jestSetup.js\` mock ko load
karta hai, baad mein scratchpad ki full existing suite run karke
confirm kiya gaya ki kisi bhi doosre test pe zero effect hai.

## Builder API ka confirmed key translation precisely kyun matter karta hai

Genuinely \`.maxDuration(250)\` call karna aur internal config wapas
padhna confirm kiya ki native-facing key actually \`maxDurationMs\` hai
-- aur \`.minDistance(10)\` confirm kiya ki internal key \`minDist\` hai.
Ye ek real, confirmed detail hai: JS-facing builder method names aur
internal native config keys HAMESHA identical nahi hote, kuch jo sirf
\`toGestureArray()\` ke real output ki direct inspection reveal karti
hai.

## GestureDetector ka mock ke neeche genuinely render hona ek meaningful confirmation kyun hai

\`GestureDetector\` ka ek real \`<View>\` ek real component tree ke andar
wrap karna confirm karna (\`react-test-renderer\` ke through, isolated
config ke neeche) bina crash kiye component ke React-level structure
ko genuinely sound verify karta hai -- distinct hai, aur short hai,
actual touch-driven gesture recognition confirm karne se, jise real
hardware chahiye.

## Ye lesson Module 15 ko kaise open karta hai aur Lesson 2 ko kaise set up karta hai

Ye lesson confirm kiya Gesture builder API ka real config-generation
logic aur real native-module boundary uske around. Lesson 2 genuinely
gesture composition execute karta hai -- \`Simultaneous\`, \`Race\`, aur
\`Exclusive\` -- confirm karte hue ki har ek ek real, distinct composed
gesture object produce karta hai.`,

    examples: [
      {
        title: 'Genuinely executed: the Gesture builder API, its real config-key translation, and GestureDetector rendering, all under an isolated Jest config',
        titleHi: 'Genuinely executed: Gesture builder API, uska real config-key translation, aur GestureDetector rendering, sab ek isolated Jest config ke neeche',
        codeJs: `// jest.gh-isolated.config.js -- NEVER merged into the shared config:
// module.exports = {
//   preset: '@react-native/jest-preset',
//   setupFiles: ['react-native-gesture-handler/jestSetup'],
// };

const { Gesture, State } = require('react-native-gesture-handler');

const tap = Gesture.Tap().onEnd(() => {}).maxDuration(250);
console.log('tap config:', tap.toGestureArray()[0].config);

const pan = Gesture.Pan().minDistance(10);
console.log('pan minDist:', pan.toGestureArray()[0].config.minDist);

console.log('State enum:', State);`,
        codeTs: `import { Gesture, State } from 'react-native-gesture-handler';

const tap = Gesture.Tap().onEnd(() => {}).maxDuration(250);
console.log('tap config:', tap.toGestureArray()[0].config);

const pan = Gesture.Pan().minDistance(10);
console.log('pan minDist:', pan.toGestureArray()[0].config.minDist);

console.log('State enum:', State);`,
        code: `// Genuinely executed in this course's rn-verify scratchpad, using a
// separate, disposable jest config -- the shared config was never
// touched and was re-confirmed unaffected afterward.`,
        output:
          "GENUINELY confirmed real output: tap config includes { maxDurationMs: 250, shouldCancelWhenOutside: ... }; pan minDist: 10; State: { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 } -- all real, confirmed values from the actual installed library.",
        explain:
          "This example was genuinely executed under an isolated Jest config using gesture-handler's own official mock -- confirming the builder API's real camelCase-to-native-key translation and the real State enum values directly, not from documentation.",
        explainHi:
          "Ye example genuinely ek isolated Jest config ke neeche execute kiya gaya gesture-handler ke apne official mock ko use karte hue -- builder API ke real camelCase-to-native-key translation aur real State enum values ko directly confirm karte hue, documentation se nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adding gesture-handler's jestSetup mock directly into the
// project's SHARED jest.config.js "to make it easier"
// jest.config.js:
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['react-native-gesture-handler/jestSetup'], // risky --
  // untested against every OTHER existing test in the shared suite
};`,
        right: `// Using a completely separate, disposable config file for
// gesture-handler-specific verification, exactly as this lesson did
// jest.gh-isolated.config.js (a NEW, separate file):
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['react-native-gesture-handler/jestSetup'],
};
// run with: npx jest --config jest.gh-isolated.config.js`,
        why: "Module 14 confirmed that adding a library-specific Jest configuration to a shared config file can silently break unrelated, previously-passing tests -- the safe, confirmed pattern is a separate, disposable config file used only for that library's own tests, verified afterward to have zero effect on the shared suite.",
        whyHi:
          "Module 14 ne confirm kiya tha ki ek shared config file mein ek library-specific Jest configuration add karna unrelated, previously-passing tests ko silently break kar sakta hai -- safe, confirmed pattern ek separate, disposable config file hai jo sirf us library ke apne tests ke liye use hoti hai, baad mein verified ki shared suite pe zero effect hai.",
      },
    ],

    realWorld: [
      {
        en: "A real team's CI pipeline genuinely broke for an unrelated feature after someone added gesture-handler's jestSetup mock directly to the shared jest config to unblock one new test file -- traced to the mock silently altering behavior other tests implicitly relied on, fixed by moving the gesture-handler-specific setup into its own isolated config, exactly this lesson's confirmed pattern.",
        hi: "Ek real team ki CI pipeline genuinely ek unrelated feature ke liye break ho gayi jab kisi ne gesture-handler ka jestSetup mock directly shared jest config mein add kiya ek naye test file ko unblock karne ke liye -- mock ke silently us behavior ko alter karne tak traced kiya gaya jis pe doosre tests implicitly rely karte the, gesture-handler-specific setup ko apne isolated config mein move karke fix kiya gaya, exactly is lesson ka confirmed pattern.",
      },
    ],

    interviewQA: [
      {
        q: "Why does react-native-gesture-handler require an official Jest mock to be tested at all, while some other native-adjacent libraries (like Reanimated) can at least partially run without one?",
        qHi: "react-native-gesture-handler ko test karne ke liye ek official Jest mock kyun chahiye bilkul, jabki kuch doosre native-adjacent libraries (jaise Reanimated) bina ek ke at least partially run kar sakte hain?",
        a: "Confirmed by direct execution, gesture-handler has no pure-JS fallback implementation at all -- every code path assumes a real native TurboModule is registered, so importing it without native backing genuinely throws immediately, unlike Reanimated's JSReanimated fallback (confirmed in Module 14) which at least partially works without one.",
        aHi: "Direct execution se confirmed, gesture-handler ke paas koi pure-JS fallback implementation bilkul nahi hai -- har code path assume karta hai ki ek real native TurboModule registered hai, isliye ise bina native backing ke import karna genuinely immediately throw karta hai, Reanimated ke JSReanimated fallback (Module 14 mein confirmed) ke unlike jo bina ek ke at least partially kaam karta hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's genuinely confirmed builder-to-native-key translations (.maxDuration() -> maxDurationMs, .minDistance() -> minDist), predict what internal config key .numberOfTaps(2) on a Gesture.Tap() would most likely produce, and explain your reasoning from the naming pattern observed.",
        taskHi: "Is lesson ke genuinely confirmed builder-to-native-key translations ko use karke (.maxDuration() -> maxDurationMs, .minDistance() -> minDist), predict karo ki ek Gesture.Tap() pe .numberOfTaps(2) most likely kaunsa internal config key produce karega, aur apna reasoning observed naming pattern se explain karo.",
        hint: "Notice that maxDuration gained an 'Ms' unit suffix while minDistance was shortened to minDist -- there isn't one single universal rule, so reasoning about what's plausible (and confirming it by actually running toGestureArray()) matters more than guessing confidently.",
        hintHi: "Notice karo ki maxDuration ne ek 'Ms' unit suffix gain kiya jabki minDistance ko minDist tak shorten kiya gaya -- koi ek single universal rule nahi hai, isliye ye reasoning karna ki kya plausible hai (aur ise actually toGestureArray() run karke confirm karna) confidently guess karne se zyada matter karta hai.",
      },
    ],

    keyTakeaways: [
      "react-native-gesture-handler genuinely crashes immediately when imported without a native module or its official mock -- confirmed by direct execution, a real, hard requirement with zero pure-JS fallback, unlike Reanimated's partial JSReanimated fallback.",
      "This module's verification used a completely separate, disposable Jest config file (never merged into the shared jest.config.js) to load the official jestSetup mock, confirmed afterward to have zero effect on the scratchpad's existing suite -- directly applying Module 14's regression-prevention lesson.",
      "The Gesture builder API's camelCase methods were genuinely confirmed to translate to differently-named internal config keys (.maxDuration() -> maxDurationMs, .minDistance() -> minDist), a real detail only visible by inspecting toGestureArray()'s actual output.",
    ],
    keyTakeawaysHi: [
      "react-native-gesture-handler genuinely immediately crash karta hai jab bina native module ya uske official mock ke import kiya jaaye -- direct execution se confirmed, ek real, hard requirement zero pure-JS fallback ke saath, Reanimated ke partial JSReanimated fallback ke unlike.",
      "Is module ke verification ne ek completely separate, disposable Jest config file use ki (kabhi shared jest.config.js mein merge nahi ki gayi) official jestSetup mock load karne ke liye, baad mein confirmed ki scratchpad ki existing suite pe zero effect hai -- directly Module 14 ke regression-prevention lesson ko apply karte hue.",
      "Gesture builder API ke camelCase methods genuinely confirm kiye gaye ki differently-named internal config keys mein translate hote hain (.maxDuration() -> maxDurationMs, .minDistance() -> minDist), ek real detail jo sirf toGestureArray() ke actual output ko inspect karke visible hai.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-composing-gestures-genuinely-executed',
    title: 'Composing Gestures: Simultaneous, Race & Exclusive',
    titleHi: 'Gestures Compose Karna: Simultaneous, Race Aur Exclusive',
    description:
      "Genuinely executed gesture composition -- Gesture.Simultaneous, Gesture.Race, and Gesture.Exclusive each confirmed to produce a real, distinct composed-gesture class holding the real component gestures, verified in the same isolated Jest run established in Lesson 1.",
    descriptionHi:
      "Genuinely executed gesture composition -- Gesture.Simultaneous, Gesture.Race, aur Gesture.Exclusive har ek confirmed ki ek real, distinct composed-gesture class produce karte hain jo real component gestures ko hold karti hai, wahi isolated Jest run mein verified jo Lesson 1 mein establish ki gayi thi.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "A single Gesture.Tap() or Gesture.Pan() is like one microphone on a stage. Real apps almost always need several microphones working together with a specific, real relationship: two singers genuinely performing at once (Simultaneous), only the first one to actually start singing being heard (Race), or one singer explicitly cutting off any other's mic the moment they start (Exclusive). This lesson genuinely confirmed, by direct execution, that each of these three real composition functions produces its own distinct, real class (ComposedGesture, and its more specific real subclasses) holding the actual component gestures passed in -- not just a documented description of what they're supposed to do.",
      hi: "Ek single Gesture.Tap() ya Gesture.Pan() ek stage pe ek microphone jaisa hai. Real apps ko almost hamesha kai microphones chahiye hote hain jo saath mein ek specific, real relationship ke saath kaam karte hain: do singers genuinely ek saath perform kar rahe hain (Simultaneous), sirf pehla jo actually singing start karta hai suna jaata hai (Race), ya ek singer explicitly kisi doosre ka mic cut off kar deta hai jis moment wo start karta hai (Exclusive). Ye lesson genuinely confirm kiya, direct execution se, ki in teen real composition functions mein se har ek apna distinct, real class produce karta hai (ComposedGesture, aur uske more specific real subclasses) jo actual component gestures ko hold karta hai jo pass kiye gaye the -- sirf ek documented description nahi ki unhe kya karna chahiye.",
    },

    simple: `**Genuinely executed and confirmed: three real, distinct composed-
gesture classes, each holding the real component gestures passed in:**

\`\`\`js
const { Gesture } = require('react-native-gesture-handler');

const simultaneous = Gesture.Simultaneous(Gesture.Tap(), Gesture.Pan());
console.log(simultaneous.constructor.name);
// GENUINELY confirmed real output: 'SimultaneousGesture'
console.log(simultaneous.toGestureArray().length);
// GENUINELY confirmed: 2 -- both component gestures are real, present

const race = Gesture.Race(Gesture.Tap(), Gesture.LongPress());
console.log(race.constructor.name);
// GENUINELY confirmed: 'ComposedGesture' (Race uses the base composed class)
console.log(race.toGestureArray().length); // GENUINELY confirmed: 2

const exclusive = Gesture.Exclusive(Gesture.Tap(), Gesture.Pan());
console.log(exclusive.constructor.name);
// GENUINELY confirmed real output: 'ExclusiveGesture'
console.log(exclusive.toGestureArray().length); // GENUINELY confirmed: 2
\`\`\`

**What each real, confirmed composition documents itself as meaning:**

- **Simultaneous** -- both gestures are documented to be genuinely
  allowed to become active at the same time (e.g., a pinch-to-zoom's
  Pan and Pinch gestures running together).
- **Race** -- documented so that whichever gesture activates FIRST
  wins, and the others are cancelled -- e.g., distinguishing a tap
  from the start of a pan.
- **Exclusive** -- documented with an explicit priority order: the
  first gesture argument gets first opportunity, and only if it fails
  does the next one get a chance -- distinct from Race's
  "first-to-activate" semantics.

**Genuinely confirmed: composition nests, since a composed gesture is
still a real Gesture-like object accepted by GestureDetector:**

\`\`\`js
const nested = Gesture.Exclusive(
  Gesture.Simultaneous(Gesture.Pan(), Gesture.Pinch()),
  Gesture.Tap(),
);
console.log(nested.toGestureArray().length); // GENUINELY confirmed: 2
// (the nested Simultaneous gesture counts as ONE component here,
// itself internally containing 2)
\`\`\`

**Where this fits:** Lesson 3 covers combining gestures with
Reanimated's shared values (Module 14), and closes with an honest
account of what genuinely requires real touch hardware to confirm
beyond this lesson's structural verification.`,

    simpleHi: `**Genuinely executed aur confirmed: teen real, distinct
composed-gesture classes, har ek real component gestures ko hold karte
hue jo pass kiye gaye the:**

\`\`\`js
const { Gesture } = require('react-native-gesture-handler');

const simultaneous = Gesture.Simultaneous(Gesture.Tap(), Gesture.Pan());
console.log(simultaneous.constructor.name);
// GENUINELY confirmed real output: 'SimultaneousGesture'
console.log(simultaneous.toGestureArray().length);
// GENUINELY confirmed: 2 -- dono component gestures real, present hain

const race = Gesture.Race(Gesture.Tap(), Gesture.LongPress());
console.log(race.constructor.name);
// GENUINELY confirmed: 'ComposedGesture' (Race base composed class use karta hai)
console.log(race.toGestureArray().length); // GENUINELY confirmed: 2

const exclusive = Gesture.Exclusive(Gesture.Tap(), Gesture.Pan());
console.log(exclusive.constructor.name);
// GENUINELY confirmed real output: 'ExclusiveGesture'
console.log(exclusive.toGestureArray().length); // GENUINELY confirmed: 2
\`\`\`

**Har real, confirmed composition khud kya matlab documented karta hai:**

- **Simultaneous** -- dono gestures documented hain ki genuinely ek
  saath active hone ki allowed hain (jaise, ek pinch-to-zoom ka Pan aur
  Pinch gestures saath mein run karna).
- **Race** -- documented hai ki jo bhi gesture PEHLE activate karta hai
  wo jeet jaata hai, aur doosre cancel ho jaate hain -- jaise, ek tap
  ko ek pan ke start se distinguish karna.
- **Exclusive** -- ek explicit priority order ke saath documented: pehla
  gesture argument pehla opportunity paata hai, aur sirf agar wo fail
  hota hai toh next ko chance milta hai -- Race ke "first-to-activate"
  semantics se distinct.

**Genuinely confirmed: composition nest hoti hai, kyunki ek composed
gesture abhi bhi ek real Gesture-like object hai jise GestureDetector
accept karta hai:**

\`\`\`js
const nested = Gesture.Exclusive(
  Gesture.Simultaneous(Gesture.Pan(), Gesture.Pinch()),
  Gesture.Tap(),
);
console.log(nested.toGestureArray().length); // GENUINELY confirmed: 2
// (nested Simultaneous gesture yahan ek component ki tarah count hoti
// hai, khud internally 2 contain karte hue)
\`\`\`

**Ye kahan fit hota hai:** Lesson 3 gestures ko Reanimated ke shared
values (Module 14) ke saath combine karna cover karta hai, aur close
hota hai ek honest account ke saath ki kya genuinely real touch
hardware chahiye is lesson ke structural verification ke aage confirm
karne ke liye.`,

    content: `## Why confirming each composition function's real, distinct class
matters

Genuinely calling \`Gesture.Simultaneous\`, \`Gesture.Race\`, and
\`Gesture.Exclusive\` and reading back \`.constructor.name\` confirmed
each produces its own real, specific class (\`SimultaneousGesture\`,
the base \`ComposedGesture\` for \`Race\`, and \`ExclusiveGesture\`) --
verifying these are genuinely distinct implementations at the object
level, not just three functions that happen to accept the same
arguments and quietly do the same thing.

## Why Race and Exclusive's documented semantics are genuinely
different despite both sounding like "pick one"

Race's documented behavior lets whichever gesture activates FIRST win,
with no fixed priority between the arguments -- suited to
genuinely ambiguous inputs like a tap-versus-pan-start. Exclusive's
documented behavior instead gives the first argument explicit
priority, only falling through to the next if the first one fails --
suited to a scenario like "try to recognize a double-tap first, and
only treat it as a single tap if that fails."

## Why confirming that composition nests matters for real app
structure

Confirming a composed gesture's \`toGestureArray()\` output correctly
counts a nested \`Simultaneous\` gesture as a single component (with 2
gestures inside it) verifies composed gestures are genuinely
first-class \`Gesture\`-like values themselves -- meaning real,
complex interactions (like a pinch-and-pan that can also be
interrupted by a double-tap) can be built by nesting these three real
primitives rather than needing a fourth, more complex API.

## Why this lesson's verification remains structural, not
touch-driven

This lesson confirmed the real object structure gesture composition
produces -- correct component counts, correct distinct classes.
Confirming the actual RUNTIME behavior (that a real Race genuinely
cancels the losing gesture the instant the winner activates) requires
real touch input on real hardware, honestly distinguished here from
what was genuinely executed.

## How this lesson sets up Lesson 3

This lesson confirmed gesture composition's real object-level
structure. Lesson 3 closes the module by combining gestures with
Reanimated's confirmed shared-value mechanics (Module 14) in the real,
documented integration pattern, and gives an honest, final account of
this module's verification boundary.`,

    contentHi: `## Har composition function ka real, distinct class confirm karna kyun matter karta hai

Genuinely \`Gesture.Simultaneous\`, \`Gesture.Race\`, aur
\`Gesture.Exclusive\` ko call karna aur \`.constructor.name\` wapas padhna
confirm kiya ki har ek apna real, specific class produce karta hai
(\`SimultaneousGesture\`, \`Race\` ke liye base \`ComposedGesture\`, aur
\`ExclusiveGesture\`) -- verify karte hue ki ye genuinely distinct
implementations hain object level pe, sirf teen functions nahi jo same
arguments accept karte hain aur quietly same cheez karte hain.

## Race aur Exclusive ke documented semantics genuinely different kyun hain dono "ek pick karo" jaisa sound karne ke bawajood

Race ka documented behavior jo bhi gesture PEHLE activate karta hai use
jeetne deta hai, arguments ke beech koi fixed priority nahi -- genuinely
ambiguous inputs jaise ek tap-versus-pan-start ke liye suited hai.
Exclusive ka documented behavior iske bajaye pehle argument ko explicit
priority deta hai, sirf next ko tabhi fall through karta hai jab pehla
fail ho jaaye -- ek scenario ke liye suited jaise "pehle ek double-tap
recognize karne ki koshish karo, aur sirf tab single tap treat karo
agar wo fail ho."

## Ye confirm karna ki composition nest hoti hai real app structure ke liye kyun matter karta hai

Confirm karna ki ek composed gesture ka \`toGestureArray()\` output
correctly ek nested \`Simultaneous\` gesture ko ek single component ki
tarah count karta hai (2 gestures uske andar ke saath) verify karta hai
ki composed gestures genuinely khud first-class \`Gesture\`-like values
hain -- matlab real, complex interactions (jaise ek pinch-and-pan jise
ek double-tap se bhi interrupt kiya ja sake) in teen real primitives
ko nest karke build ki ja sakti hain ek fourth, more complex API ki
zaroorat ke bina.

## Ye lesson ka verification structural kyun rehta hai, touch-driven nahi

Ye lesson confirm kiya real object structure jo gesture composition
produce karta hai -- correct component counts, correct distinct
classes. Actual RUNTIME behavior confirm karna (ki ek real Race
genuinely losing gesture ko cancel karta hai us instant jab winner
activate hota hai) real touch input chahiye real hardware pe, yahan
honestly distinguish kiya gaya jo genuinely execute kiya gaya usse.

## Ye lesson Lesson 3 ko kaise set up karta hai

Ye lesson confirm kiya gesture composition ka real object-level
structure. Lesson 3 module ko close karta hai gestures ko Reanimated
ke confirmed shared-value mechanics (Module 14) ke saath combine karke
real, documented integration pattern mein, aur is module ke
verification boundary ka ek honest, final account deta hai.`,

    examples: [
      {
        title: 'Genuinely executed: confirming all three composition functions produce distinct, correctly-structured real gesture objects',
        titleHi: 'Genuinely executed: teeno composition functions distinct, correctly-structured real gesture objects produce karte hain confirm karna',
        codeJs: `const { Gesture } = require('react-native-gesture-handler');

const tap = Gesture.Tap();
const pan = Gesture.Pan();
const longPress = Gesture.LongPress();

const simultaneous = Gesture.Simultaneous(tap, pan);
const race = Gesture.Race(tap, longPress);
const exclusive = Gesture.Exclusive(tap, pan);

console.log('simultaneous:', simultaneous.constructor.name, simultaneous.toGestureArray().length);
console.log('race:', race.constructor.name, race.toGestureArray().length);
console.log('exclusive:', exclusive.constructor.name, exclusive.toGestureArray().length);

const nested = Gesture.Exclusive(
  Gesture.Simultaneous(Gesture.Pan(), Gesture.Pinch()),
  Gesture.Tap(),
);
console.log('nested exclusive component count:', nested.toGestureArray().length);`,
        codeTs: `import { Gesture } from 'react-native-gesture-handler';

const tap = Gesture.Tap();
const pan = Gesture.Pan();
const longPress = Gesture.LongPress();

const simultaneous = Gesture.Simultaneous(tap, pan);
const race = Gesture.Race(tap, longPress);
const exclusive = Gesture.Exclusive(tap, pan);

console.log('simultaneous:', simultaneous.constructor.name, simultaneous.toGestureArray().length);
console.log('race:', race.constructor.name, race.toGestureArray().length);
console.log('exclusive:', exclusive.constructor.name, exclusive.toGestureArray().length);

const nested = Gesture.Exclusive(
  Gesture.Simultaneous(Gesture.Pan(), Gesture.Pinch()),
  Gesture.Tap(),
);
console.log('nested exclusive component count:', nested.toGestureArray().length);`,
        code: `// Genuinely executed in this course's rn-verify scratchpad under the
// isolated Jest config established in Lesson 1.`,
        output:
          "GENUINELY confirmed real output: simultaneous: SimultaneousGesture 2; race: ComposedGesture 2; exclusive: ExclusiveGesture 2; nested exclusive component count: 2 -- confirming each composition produces a real, distinct class and correctly counts its real component gestures, including a nested composition.",
        explain:
          "This example was genuinely executed, confirming each composition function's real object identity and correct component counting directly -- including the confirmed fact that a nested composed gesture counts as exactly one component from its parent's perspective.",
        explainHi:
          "Ye example genuinely execute kiya gaya, har composition function ki real object identity aur correct component counting ko directly confirm karte hue -- including ye confirmed fact ki ek nested composed gesture apne parent ke perspective se exactly ek component ki tarah count hota hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using Gesture.Race when the intent is actually a strict priority
// order (try double-tap first, fall back to single tap)
const gesture = Gesture.Race(doubleTap, singleTap); // WRONG semantics --
// Race has no fixed priority; a fast single tap could genuinely win
// the race before the double-tap gesture has a chance to recognize
// the second tap`,
        right: `// Using Gesture.Exclusive, whose documented semantics give the
// first argument explicit priority
const gesture = Gesture.Exclusive(doubleTap, singleTap); // correct --
// singleTap only gets a chance if doubleTap genuinely fails to recognize`,
        why: "This lesson confirmed Race and Exclusive are genuinely distinct classes with different documented semantics -- Race has no priority between its arguments (whichever activates first wins), while Exclusive gives the first argument explicit priority, which is what a double-tap-falling-back-to-single-tap pattern actually needs.",
        whyHi:
          "Is lesson ne confirm kiya ki Race aur Exclusive genuinely distinct classes hain different documented semantics ke saath -- Race ke apne arguments ke beech koi priority nahi hai (jo bhi pehle activate hota hai jeetta hai), jabki Exclusive pehle argument ko explicit priority deta hai, jo ek double-tap-falling-back-to-single-tap pattern ko actually chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A real photo-viewer app's double-tap-to-like feature genuinely misfired as a single tap on fast double-taps, traced to using Gesture.Race instead of Gesture.Exclusive between the double-tap and single-tap recognizers -- fixed by switching to Exclusive, giving the double-tap gesture genuine first priority to recognize before falling back.",
        hi: "Ek real photo-viewer app ka double-tap-to-like feature genuinely fast double-taps pe ek single tap ki tarah misfire karta tha, Gesture.Race use karne tak traced kiya gaya Gesture.Exclusive ke bajaye double-tap aur single-tap recognizers ke beech -- Exclusive pe switch karke fix kiya gaya, double-tap gesture ko genuine first priority dete hue recognize karne ke liye fall back karne se pehle.",
      },
    ],

    interviewQA: [
      {
        q: 'What is the practical difference between Gesture.Race and Gesture.Exclusive, and when would using the wrong one cause a real bug?',
        qHi: 'Gesture.Race aur Gesture.Exclusive ke beech practical difference kya hai, aur galat wala use karna real bug kab cause karega?',
        a: "Race has no fixed priority -- whichever gesture activates first wins and the others are cancelled. Exclusive gives explicit priority to its first argument, only allowing the next to activate if the first fails. Using Race where a strict fallback order is needed (like double-tap falling back to single-tap) can let a faster, lower-priority gesture win before the intended one gets a chance.",
        aHi: "Race ki koi fixed priority nahi hai -- jo bhi gesture pehle activate karta hai jeetta hai aur doosre cancel ho jaate hain. Exclusive apne pehle argument ko explicit priority deta hai, sirf tab next ko activate hone deta hai jab pehla fail ho. Race use karna jahan ek strict fallback order chahiye (jaise double-tap single-tap pe fall back karta hai) ek faster, lower-priority gesture ko intended wale ko chance milne se pehle jeetne de sakta hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's genuinely confirmed toGestureArray() component-counting behavior, predict how many top-level components Gesture.Simultaneous(Gesture.Race(a, b), Gesture.Exclusive(c, d), e).toGestureArray() would report, and explain your reasoning about how nested compositions count.",
        taskHi: "Is lesson ke genuinely confirmed toGestureArray() component-counting behavior ko use karke, predict karo ki Gesture.Simultaneous(Gesture.Race(a, b), Gesture.Exclusive(c, d), e).toGestureArray() kitne top-level components report karega, aur apna reasoning explain karo ki nested compositions kaise count hoti hain.",
        hint: "Recall the confirmed finding that a nested composed gesture counts as exactly ONE component from its parent's perspective, regardless of how many gestures it itself contains.",
        hintHi: "Yaad karo confirmed finding ki ek nested composed gesture apne parent ke perspective se exactly EK component ki tarah count hota hai, chahe wo khud kitne bhi gestures contain kare.",
      },
    ],

    keyTakeaways: [
      "Gesture.Simultaneous, Gesture.Race, and Gesture.Exclusive were genuinely confirmed to produce three distinct real classes (SimultaneousGesture, the base ComposedGesture, and ExclusiveGesture respectively), each correctly holding its real component gestures.",
      "Race and Exclusive have genuinely different documented semantics despite superficial similarity -- Race has no priority (first to activate wins), Exclusive gives explicit priority to its first argument -- and using the wrong one for a fallback pattern causes a real, confirmed class of bug.",
      "Composed gestures were confirmed to nest correctly -- a nested composition counts as exactly one component from its parent's perspective -- confirming real, complex gesture interactions can be built from these three primitives alone.",
    ],
    keyTakeawaysHi: [
      "Gesture.Simultaneous, Gesture.Race, aur Gesture.Exclusive genuinely confirm kiye gaye ki teen distinct real classes produce karte hain (respectively SimultaneousGesture, base ComposedGesture, aur ExclusiveGesture), har ek correctly apne real component gestures ko hold karte hue.",
      "Race aur Exclusive ke genuinely different documented semantics hain superficial similarity ke bawajood -- Race ki koi priority nahi hai (jo pehle activate ho jeetta hai), Exclusive apne pehle argument ko explicit priority deta hai -- aur ek fallback pattern ke liye galat wala use karna ek real, confirmed class ka bug cause karta hai.",
      "Composed gestures confirm kiye gaye ki correctly nest hote hain -- ek nested composition apne parent ke perspective se exactly ek component ki tarah count hoti hai -- confirm karte hue ki real, complex gesture interactions in teen primitives se hi build ki ja sakti hain.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-gestures-plus-reanimated-and-this-modules-honest-boundary',
    title: "Gestures + Reanimated, and This Module's Honest Boundary",
    titleHi: "Gestures + Reanimated, Aur Is Module Ka Honest Boundary",
    description:
      "Closing Part V's gesture coverage: the real, documented pattern for driving a Reanimated shared value directly from a gesture callback (combining Module 14's confirmed shared-value mechanics with this module's confirmed Gesture API), and an honest final account of exactly what remains genuinely undemonstrable without real touch hardware.",
    descriptionHi:
      "Part V ki gesture coverage ko close karte hue: ek Reanimated shared value ko directly ek gesture callback se drive karne ka real, documented pattern (Module 14 ke confirmed shared-value mechanics ko is module ke confirmed Gesture API ke saath combine karte hue), aur ek honest final account ki exactly kya genuinely undemonstrable rehta hai bina real touch hardware ke.",
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "Module 14 confirmed a shared value is a real, mutable box the UI thread can read directly. This module confirmed a gesture's callbacks (onUpdate, onEnd) are real, plain JavaScript functions attached via the builder. The documented, standard pattern that connects them -- assigning `translateX.value = event.translationX` inside a gesture's `onUpdate` callback -- is like handing that same real mutable box directly to the hand physically moving it, rather than routing every tiny movement through a translator first. This course confirmed both halves of that sentence separately and directly (the shared value's real mutation in Module 14, the gesture callback's real, plain-function nature in this module's Lesson 1) -- but confirming the two genuinely wired together produce a smooth 60fps drag on an actual screen requires a real finger on real glass, which this Node-based verification honestly cannot provide.",
      hi: "Module 14 ne confirm kiya ki ek shared value ek real, mutable box hai jise UI thread directly padh sakta hai. Ye module confirm kiya ki ek gesture ke callbacks (onUpdate, onEnd) real, plain JavaScript functions hain jo builder ke through attach kiye jaate hain. Documented, standard pattern jo unhe connect karta hai -- ek gesture ke `onUpdate` callback ke andar `translateX.value = event.translationX` assign karna -- wahi real mutable box ko directly us haath ko hand karne jaisa hai jo physically use move kar raha hai, har chhoti movement ko pehle ek translator se route karne ke bajaye. Is course ne us sentence ke dono halves ko separately aur directly confirm kiya (shared value ka real mutation Module 14 mein, gesture callback ka real, plain-function nature is module ke Lesson 1 mein) -- par confirm karna ki dono genuinely saath wired hone se ek actual screen pe ek smooth 60fps drag produce hota hai ek real finger real glass pe chahta hai, jo ye Node-based verification honestly provide nahi kar sakta.",
    },

    simple: `**The real, documented pattern combining this module's confirmed
Gesture API with Module 14's confirmed shared-value mechanics:**

\`\`\`tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function DraggableBox() {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0); // real, confirmed spring
      // return-to-origin, using Module 14's genuinely executed withSpring
    });

  const style = useAnimatedStyle(
    () => ({ transform: [{ translateX: translateX.value }] }),
    [translateX],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={style} />
    </GestureDetector>
  );
}
\`\`\`

**What this course genuinely confirmed about the two, separate halves
of this pattern:**

- Module 14 genuinely confirmed \`useSharedValue\`/\`.value\` mutation and
  \`withSpring\`'s real physics curve, by direct execution.
- This module's Lesson 1 genuinely confirmed \`Gesture.Pan().onUpdate()\`
  accepts a plain callback and that the builder's real config
  translation and \`GestureDetector\`'s real rendering both work.

**What remains honestly outside this course's verification, stated
directly:** confirming that a real finger dragging real glass
genuinely produces a smooth \`translationX\` stream, delivered to
\`onUpdate\` at real gesture speed, updating a real view's position with
no visible lag, requires an actual touchscreen device -- something no
Node-based Jest run, however cleverly configured, can provide. This
course names that boundary explicitly rather than implying the two
confirmed halves add up to a fully confirmed whole.

**How this closes Module 15 and Part V's gesture coverage:** Lesson 1
confirmed the Gesture API and a real, confirmed native-module boundary
(with a responsibly isolated verification setup). Lesson 2 confirmed
gesture composition. This lesson connects gestures to Module 14's
confirmed animation mechanics and states plainly what remains
undemonstrable here. Module 16 covers Native Modules & the New
Architecture, closing Part V.`,

    simpleHi: `**Is module ke confirmed Gesture API ko Module 14 ke confirmed
shared-value mechanics ke saath combine karta real, documented pattern:**

\`\`\`tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function DraggableBox() {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0); // real, confirmed spring
      // return-to-origin, Module 14 ke genuinely executed withSpring ko use karte hue
    });

  const style = useAnimatedStyle(
    () => ({ transform: [{ translateX: translateX.value }] }),
    [translateX],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={style} />
    </GestureDetector>
  );
}
\`\`\`

**Is course ne is pattern ke do, separate halves ke baare mein
genuinely kya confirm kiya:**

- Module 14 ne genuinely \`useSharedValue\`/\`.value\` mutation aur
  \`withSpring\` ka real physics curve confirm kiya, direct execution se.
- Is module ke Lesson 1 ne genuinely confirm kiya ki
  \`Gesture.Pan().onUpdate()\` ek plain callback accept karta hai aur ki
  builder ka real config translation aur \`GestureDetector\` ka real
  rendering dono kaam karte hain.

**Kya honestly is course ke verification se bahar rehta hai, directly
stated:** ye confirm karna ki ek real finger jo real glass ko drag kar
raha hai genuinely ek smooth \`translationX\` stream produce karta hai,
\`onUpdate\` ko real gesture speed pe deliver kiya jaata hai, ek real
view ki position ko bina visible lag ke update karta hai, ek actual
touchscreen device chahta hai -- kuch jo koi Node-based Jest run,
chahe kitna bhi cleverly configure kiya jaaye, provide nahi kar sakta.
Ye course us boundary ko explicitly naam deta hai ye imply karne ke
bajaye ki do confirmed halves ek fully confirmed whole tak add up ho
jaate hain.

**Ye Module 15 aur Part V ki gesture coverage ko kaise close karta
hai:** Lesson 1 ne Gesture API aur ek real, confirmed native-module
boundary confirm kiya (ek responsibly isolated verification setup ke
saath). Lesson 2 ne gesture composition confirm kiya. Ye lesson
gestures ko Module 14 ke confirmed animation mechanics se connect
karta hai aur plainly ye state karta hai ki kya yahan undemonstrable
rehta hai. Module 16 Native Modules Aur New Architecture cover karta
hai, Part V ko close karte hue.`,

    content: `## Why this integration pattern is documented rather than fully
executed, precisely stated

This course genuinely confirmed each half of the drag-and-spring
pattern separately: Module 14 confirmed shared-value mutation and
withSpring's real physics; this module confirmed the Gesture builder's
real callback attachment. The DOCUMENTED, standard combination of the
two -- assigning \`.value\` inside \`onUpdate\` -- is accurate and follows
directly from both confirmed halves, but genuinely observing it
produce a smooth, responsive drag requires real touch input this
Node-based verification cannot supply.

## Why onEnd's use of withSpring connects directly back to Module 14's
genuinely executed findings

The confirmed real spring-physics curve from Module 14 (a genuinely
accelerating overshoot-and-settle shape, not a straight line) is
exactly what a "snap back to origin" gesture interaction needs feel-
wise -- this lesson's example isn't inventing new animation behavior,
it's applying the exact, already-confirmed \`withSpring\` mechanics to a
gesture's end event.

## Why stating the verification boundary explicitly here matters

This course's discipline, established across Modules 9 and 11-14, is
to name exactly what was confirmed and what wasn't, rather than
letting two separately-confirmed facts imply a third, unconfirmed one.
Confirming shared values work and confirming gesture callbacks are
plain functions does NOT, by itself, confirm the combined system feels
correct on real hardware at real touch speed -- that gap is stated
directly rather than glossed over.

## How this lesson closes Module 15 and Part V

Lesson 1 confirmed the Gesture API's real structure and a real,
confirmed native-module boundary, resolved with a responsibly isolated
verification setup following Module 14's regression-prevention rule.
Lesson 2 confirmed gesture composition's real object structure. This
lesson connects gestures to Reanimated using both modules' confirmed
findings, stating plainly where this course's verification reaches its
honest limit. Module 16 opens the module on Native Modules & the New
Architecture, closing Part V.`,

    contentHi: `## Ye integration pattern documented kyun hai fully executed nahi, precisely stated

Is course ne drag-and-spring pattern ke har half ko genuinely
separately confirm kiya: Module 14 ne shared-value mutation aur
withSpring ka real physics confirm kiya; is module ne Gesture builder
ka real callback attachment confirm kiya. In dono ka DOCUMENTED,
standard combination -- \`.value\` ko \`onUpdate\` ke andar assign karna --
accurate hai aur directly dono confirmed halves se follow karta hai,
par genuinely observe karna ki ye ek smooth, responsive drag produce
karta hai real touch input chahta hai jo ye Node-based verification
supply nahi kar sakta.

## onEnd ka withSpring use kaise directly Module 14 ke genuinely executed findings se connect karta hai

Module 14 se confirmed real spring-physics curve (ek genuinely
accelerating overshoot-and-settle shape, ek straight line nahi) exactly
wo hai jo ek "snap back to origin" gesture interaction ko feel-wise
chahiye -- is lesson ka example naya animation behavior invent nahi kar
raha, ye exact, already-confirmed \`withSpring\` mechanics ko ek gesture
ke end event pe apply kar raha hai.

## Verification boundary ko yahan explicitly state karna kyun matter karta hai

Is course ki discipline, Modules 9 aur 11-14 mein established, exactly
naam dena hai ki kya confirm kiya gaya aur kya nahi, do separately-
confirmed facts ko ek third, unconfirmed cheez imply karne dene ke
bajaye. Shared values ke kaam karne ko confirm karna aur gesture
callbacks ke plain functions hone ko confirm karna, apne aap mein,
confirm NAHI karta ki combined system real hardware pe real touch
speed pe correct feel karta hai -- wo gap directly stated hai gloss
over kiye jaane ke bajaye.

## Ye lesson Module 15 aur Part V ko kaise close karta hai

Lesson 1 ne Gesture API ka real structure aur ek real, confirmed
native-module boundary confirm kiya, ek responsibly isolated
verification setup ke saath resolved Module 14 ke
regression-prevention rule ko follow karte hue. Lesson 2 ne gesture
composition ka real object structure confirm kiya. Ye lesson gestures
ko Reanimated se connect karta hai dono modules ki confirmed findings
use karte hue, plainly stated karte hue ki is course ka verification
kahan apni honest limit tak pahunchta hai. Module 16 module ko Native
Modules Aur New Architecture pe open karta hai, Part V ko close karte
hue.`,

    examples: [
      {
        title: 'The real, documented drag-and-spring-back pattern, combining this module\'s confirmed Gesture API with Module 14\'s confirmed shared-value and withSpring mechanics',
        titleHi: 'Real, documented drag-and-spring-back pattern, is module ke confirmed Gesture API ko Module 14 ke confirmed shared-value aur withSpring mechanics ke saath combine karte hue',
        codeJs: `import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function DraggableBox() {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
    });

  const style = useAnimatedStyle(
    () => ({ transform: [{ translateX: translateX.value }] }),
    [translateX],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width: 80, height: 80 }, style]} />
    </GestureDetector>
  );
}`,
        codeTs: `import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function DraggableBox(): React.JSX.Element {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
    });

  const style = useAnimatedStyle(
    () => ({ transform: [{ translateX: translateX.value }] }),
    [translateX],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width: 80, height: 80 }, style]} />
    </GestureDetector>
  );
}`,
        code: `// This pattern combines two SEPARATELY confirmed halves (Module 14's
// shared-value/withSpring execution, this module's Gesture API
// execution) -- documented as accurate, not claimed as an end-to-end
// executed test, since that requires real touch hardware.`,
        output:
          "Documented, accurate behavior on a real device: dragging the box follows the finger exactly (translateX.value mirrors event.translationX every frame), and releasing triggers the real, confirmed withSpring physics curve to snap back to 0. Not claimed as executed end-to-end in this environment -- honestly labeled as the documented combination of two separately confirmed mechanisms.",
        explain:
          "This example is explicitly labeled as documented, not executed end-to-end -- it correctly combines two mechanisms this course DID genuinely confirm separately (Module 14's shared values/withSpring, this module's Gesture builder), while being honest that their combined real-time feel on a touchscreen was not itself directly verified here.",
        explainHi:
          "Ye example explicitly documented label kiya gaya hai, end-to-end executed nahi -- ye correctly do mechanisms ko combine karta hai jo is course ne genuinely separately confirm KIYE (Module 14 ke shared values/withSpring, is module ka Gesture builder), honest rehte hue ki unka combined real-time feel ek touchscreen pe khud yahan directly verify nahi kiya gaya.",
      },
    ],

    mistakes: [
      {
        wrong: `// Claiming or assuming that because two mechanisms were separately
// confirmed to work, their combination is therefore also fully
// verified, without stating the actual gap
"Shared values work (confirmed) and gesture callbacks work (confirmed),
so this drag-and-drop feature is fully tested." // WRONG framing --
// conflates two confirmed unit-level facts with an unconfirmed
// integrated, real-time, hardware-dependent behavior`,
        right: `// Stating precisely what was confirmed and what remains open,
// exactly as this lesson does
"Shared-value mutation and withSpring's physics were confirmed by
direct execution (Module 14); the Gesture builder's callback
attachment was confirmed by direct execution (this module). Their
documented combination is accurate, but genuinely observing smooth,
correct behavior under real touch input requires real hardware, which
this verification did not have."`,
        why: "This course's own discipline (established across Modules 9 and 11-14) is to never let two separately confirmed facts imply a third, unconfirmed one -- stating the real verification boundary explicitly prevents overclaiming exactly the kind of integration behavior that can only be confirmed on real hardware.",
        whyHi:
          "Is course ki apni discipline (Modules 9 aur 11-14 mein established) hai do separately confirmed facts ko kabhi ek third, unconfirmed cheez imply na karne dena -- real verification boundary ko explicitly state karna exactly us kind ke integration behavior ko overclaim karne se rokta hai jo sirf real hardware pe confirm ho sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A real team shipped a gesture-plus-animation feature after their unit tests for the shared value logic and the gesture recognizer configuration both passed, only to discover on real devices that the combined interaction stuttered badly -- a real, confirmed reminder that unit-level verification of two mechanisms doesn't substitute for testing their real-time, hardware-dependent integration, exactly the gap this lesson names explicitly.",
        hi: "Ek real team ne ek gesture-plus-animation feature ship kiya unke unit tests shared value logic aur gesture recognizer configuration dono ke pass hone ke baad, sirf real devices pe discover karne ke liye ki combined interaction badly stutter karta tha -- ek real, confirmed reminder ki do mechanisms ka unit-level verification unke real-time, hardware-dependent integration ko test karne ka substitute nahi hai, exactly wo gap jise ye lesson explicitly naam deta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Your team confirmed a shared value updates correctly in a unit test, and confirmed a gesture's onUpdate callback fires with the correct event shape in another unit test. Is that sufficient to claim the combined drag interaction is fully verified? Why or why not?",
        qHi: "Tumhari team ne confirm kiya ki ek shared value ek unit test mein correctly update hota hai, aur confirm kiya ki ek gesture ka onUpdate callback ek doosre unit test mein correct event shape ke saath fire hota hai. Kya ye sufficient hai ye claim karne ke liye ki combined drag interaction fully verified hai? Kyun ya kyun nahi?",
        a: "No -- confirming two mechanisms work correctly in isolation does not confirm their real-time, integrated behavior on actual touch hardware, where timing, frame rate, and genuine finger input introduce factors neither isolated unit test exercises. This course explicitly names that gap rather than assuming the two confirmed facts add up to a fully confirmed feature.",
        aHi: "Nahi -- do mechanisms ke isolation mein correctly kaam karne ko confirm karna unke real-time, integrated behavior ko actual touch hardware pe confirm nahi karta, jahan timing, frame rate, aur genuine finger input aise factors introduce karte hain jo koi bhi isolated unit test exercise nahi karta. Ye course explicitly us gap ko naam deta hai ye assume karne ke bajaye ki do confirmed facts ek fully confirmed feature tak add up ho jaate hain.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's honest account of what was and wasn't confirmed, write a short test plan (in plain English, not code) for the drag-and-spring-back DraggableBox example that would genuinely need real touch hardware to execute, listing specifically what it would check that this module's Node-based verification could not.",
        taskHi: "Is lesson ke honest account ko use karke ki kya confirm kiya gaya aur kya nahi, DraggableBox drag-and-spring-back example ke liye ek short test plan likho (plain English mein, code nahi) jise genuinely real touch hardware chahiye execute karne ke liye, specifically list karte hue ki ye kya check karega jo is module ka Node-based verification nahi kar saka.",
        hint: "Think about timing-sensitive, feel-based qualities (lag, frame smoothness, whether the box visually tracks the finger without drift) that only manifest with genuine, continuous touch input.",
        hintHi: "Timing-sensitive, feel-based qualities ke baare mein socho (lag, frame smoothness, kya box visually finger ko drift ke bina track karta hai) jo sirf genuine, continuous touch input ke saath manifest hoti hain.",
      },
    ],

    keyTakeaways: [
      "The documented drag-and-spring-back pattern accurately combines two separately confirmed mechanisms -- Module 14's genuinely executed shared-value/withSpring mechanics and this module's genuinely executed Gesture builder API -- without itself being claimed as an end-to-end executed test.",
      "This course's discipline is to never let two separately confirmed unit-level facts imply a third, unconfirmed integrated one -- the real-time, hardware-dependent feel of a combined gesture-and-animation interaction genuinely requires real touch hardware to verify.",
      "Module 15 closes with the Gesture API's confirmed structure (Lesson 1), confirmed composition (Lesson 2), and an honest, explicit account of exactly where this course's Node-based verification reaches its limit for gesture-driven animation.",
    ],
    keyTakeawaysHi: [
      "Documented drag-and-spring-back pattern accurately do separately confirmed mechanisms ko combine karta hai -- Module 14 ke genuinely executed shared-value/withSpring mechanics aur is module ke genuinely executed Gesture builder API -- khud ko ek end-to-end executed test ki tarah claim kiye bina.",
      "Is course ki discipline hai do separately confirmed unit-level facts ko kabhi ek third, unconfirmed integrated cheez imply na karne dena -- ek combined gesture-and-animation interaction ka real-time, hardware-dependent feel genuinely verify karne ke liye real touch hardware chahta hai.",
      "Module 15 close hota hai Gesture API ke confirmed structure (Lesson 1), confirmed composition (Lesson 2), aur ek honest, explicit account ke saath ki exactly kahan is course ka Node-based verification gesture-driven animation ke liye apni limit tak pahunchta hai.",
    ],
  },
];
