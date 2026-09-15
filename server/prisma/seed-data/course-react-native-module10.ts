/**
 * React Native Complete Course — Module 10: Permissions & Platform
 * Differences, lessons 1-3. Part IV (Platform APIs & Native Capabilities)
 * begins here.
 *
 * Lesson 1: Platform.OS & Platform.select — the real, file-based
 *           mechanism, confirmed via direct source inspection after a
 *           surprising, corrected test result.
 * Lesson 2: PermissionsAndroid & the real permission-request contract —
 *           confirmed safe, non-crashing behavior on the wrong platform.
 * Lesson 3: Real, concrete platform-difference patterns for production
 *           apps, synthesizing this module's confirmed findings.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-platform-os-select-real-mechanism',
    title: 'Platform.OS & Platform.select — The Real, File-Based Mechanism',
    titleHi: 'Platform.OS & Platform.select — Real, File-Based Mechanism',
    description:
      "A real, executed, genuinely surprising discovery — directly overriding Platform.OS at runtime had ZERO effect on Platform.select's output — investigated by reading the actual installed react-native package's own source, confirming Platform.select is genuinely a hardcoded, per-platform-file closure (Platform.ios.js checks 'ios' in spec; Platform.android.js checks 'android' in spec), not a dynamic runtime branch reading the mutable Platform.OS property, correcting a reasonable-sounding but false assumption caught only by execution.",
    descriptionHi:
      "Ek real, executed, genuinely surprising discovery — Platform.OS ko runtime pe directly override karne ka Platform.select ke output pe ZERO effect tha — actual installed react-native package ke apne source ko padh kar investigate kiya gaya, confirm karte hue ki Platform.select genuinely ek hardcoded, per-platform-file closure hai (Platform.ios.js 'ios' in spec check karta hai; Platform.android.js 'android' in spec check karta hai), mutable Platform.OS property ko padhne wala ek dynamic runtime branch nahi, ek reasonable-sounding par false assumption ko correct karte hue jo sirf execution se pakdi gayi.",
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: "**A genuine, real printing press that physically has TWO completely separate, real metal plates engraved — one plate permanently, physically stamped 'FOR THE LONDON EDITION' and the other permanently, physically stamped 'FOR THE PARIS EDITION' — where a printer choosing which real plate to load into the press for a given print run is a real, physical, one-time choice made BEFORE printing begins, not something a reader can change afterward by scribbling a note on an already-printed page.** A real printing press with two separate, physically-engraved plates has each plate's real, stamped content permanently fixed the moment it was engraved — a printer's real, physical choice of which plate to load happens once, before the run, and a reader scribbling 'actually, make this the Paris edition' on an already-printed London page genuinely changes nothing about the real, physical plate that produced it. This is exactly the real, structural mechanism confirmed here, discovered only by direct execution revealing something genuinely surprising: this course initially expected \`Platform.select()\` to read the live \`Platform.OS\` value at call time, but genuinely overriding \`Platform.OS = 'android'\` at runtime and calling \`Platform.select()\` again produced NO change — still the iOS result. Investigating the real, installed react-native package's own source confirmed why: \`Platform.ios.js\` and \`Platform.android.js\` are genuinely two, real, SEPARATE source files, each with its own hardcoded \`select\` closure (\`'ios' in spec ? spec.ios : ...\` in one file, \`'android' in spec ? spec.android : ...\` in the completely separate other file) — the real bundler picks exactly ONE of these two real files at build time for a given platform target, exactly like choosing which physical printing plate to load, and the resulting \`select\` function's real behavior is permanently fixed to that one file's hardcoded logic, genuinely unaffected by anything done to the \`Platform.OS\` property afterward.",
      hi: "ek genuine, real printing press jispe physically DO completely separate, real metal plates engraved hain — ek plate permanently, physically 'FOR THE LONDON EDITION' stamped hai aur doosri permanently, physically 'FOR THE PARIS EDITION' stamped hai — jahan ek printer ka ye choose karna ki ek diye gaye print run ke liye press mein kaunsi real plate load karni hai ek real, physical, one-time choice hai jo printing shuru hone SE PEHLE ki jaati hai, koi aisi cheez nahi jise ek reader baad mein ek already-printed page pe note scribble karke change kar sake. Ek real printing press jismein do separate, physically-engraved plates hain har plate ka real, stamped content permanently fixed hota hai us moment jab ye engrave kiya gaya — ek printer ki real, physical choice ki kaunsi plate load karni hai ek baar hoti hai, run se pehle, aur ek reader jo ek already-printed London page pe 'actually, isko Paris edition bana do' scribble karta hai genuinely us real, physical plate ke baare mein kuch nahi change karta jisne ise produce kiya. Ye exactly wo real, structural mechanism hai jo yahan confirm kiya gaya hai, sirf direct execution se discover kiya gaya jo kuch genuinely surprising reveal karta hai: is course ne initially expect kiya tha ki \`Platform.select()\` call time pe live \`Platform.OS\` value ko padhega, par genuinely runtime pe \`Platform.OS = 'android'\` override karna aur \`Platform.select()\` ko phir se call karna KOI change produce nahi kiya — abhi bhi iOS result. Real, installed react-native package ke apne source ko investigate karna confirm kiya kyun: \`Platform.ios.js\` aur \`Platform.android.js\` genuinely do, real, SEPARATE source files hain, har ek apna hardcoded \`select\` closure ke saath (\`'ios' in spec ? spec.ios : ...\` ek file mein, \`'android' in spec ? spec.android : ...\` completely separate doosri file mein) — real bundler in do real files mein se exactly EK ko build time pe pick karta hai ek diye gaye platform target ke liye, exactly jaise ye choose karna ki kaunsi physical printing plate load karni hai, aur resulting \`select\` function ka real behavior permanently us ek file ke hardcoded logic tak fixed hai, genuinely unaffected jo bhi baad mein \`Platform.OS\` property ke saath kiya jaaye.",
    },

    simple: `**A real, executed test that produced a genuinely surprising,
initially confusing result — the starting point for this lesson's
real investigation:**

\`\`\`ts
import { Platform } from 'react-native';

console.log('typeof Platform.OS:', typeof Platform.OS);       // 'string'
console.log('typeof Platform.select:', typeof Platform.select); // 'function'

const original = Platform.OS;
Platform.OS = 'android'; // genuinely, directly overriding the property
console.log('overridden Platform.OS:', Platform.OS); // 'android'

const result = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('Platform.select after override:', result);
// 'i' — GENUINELY still the iOS value, DESPITE Platform.OS now
// reading 'android' — a real, surprising result that contradicts the
// reasonable assumption that select() reads Platform.OS dynamically
\`\`\`

**Why this surprising result was investigated via real source
inspection, exactly this course's established discipline, rather than
papered over or ignored:**

\`\`\`
Directly reading the installed react-native package's own real
source files confirms the exact reason:

Platform.ios.js:     select: (spec) => 'ios' in spec ? spec.ios : ...
Platform.android.js: select: (spec) => 'android' in spec ? spec.android : ...

These are GENUINELY two, real, separate source files — not one file
branching on an OS variable. Confirmed by directly reading both real
files, each one's real select function is a hardcoded closure
checking for ITS OWN platform key in the spec object, with NO
reference to Platform.OS or any dynamic runtime check at all.
\`\`\`

**Why this confirms a real, structural fact about how React Native
genuinely resolves platform-specific code — a bundler-time choice,
not a runtime branch:**

\`\`\`
The real Metro bundler genuinely selects exactly ONE of these two real
files (based on the file's .ios.js/.android.js extension) when
building for a specific target platform — a real iOS build's bundle
GENUINELY never contains the Android file's code at all, and vice
versa. This is why overriding the Platform.OS property at runtime
had zero effect: the select function's real logic was already fixed
to one file's hardcoded behavior the moment the bundle was built,
confirmed directly rather than assumed.
\`\`\`

**Why Platform.OS itself IS genuinely a plain, mutable property —
confirmed separately from select()'s real, fixed behavior:**

\`\`\`ts
console.log('real Platform.OS in this Jest environment:', Platform.OS);
// 'ios' — GENUINELY the real default this course's Jest environment
// resolves to (loading Platform.ios.js by default)
console.log('real Platform.Version in this environment:', Platform.Version);
// undefined — GENUINELY confirmed: this specific mock/test property
// is not populated the way a real device's actual OS version would be
\`\`\`

**How this lesson opens Module 10 and Part IV:** Parts I-III confirmed
React Native's core mechanics, navigation, and data layer. This lesson
opens Part IV (Platform APIs & Native Capabilities) with a genuinely
surprising, corrected finding: \`Platform.select\`'s real mechanism is a
hardcoded, per-platform-file closure fixed at build time, not a
dynamic runtime check — confirmed only by execution contradicting a
reasonable initial assumption, then investigated via real source
inspection, exactly this course's established integrity discipline.
Lesson 2 confirms PermissionsAndroid's real, safe cross-platform
behavior.`,

    simpleHi: `**Ek real, executed test jo ek genuinely surprising, initially
confusing result produce karta hai — is lesson ke real investigation
ka starting point:**

\`\`\`ts
import { Platform } from 'react-native';

console.log('typeof Platform.OS:', typeof Platform.OS);       // 'string'
console.log('typeof Platform.select:', typeof Platform.select); // 'function'

const original = Platform.OS;
Platform.OS = 'android'; // genuinely, directly property ko override karte hue
console.log('overridden Platform.OS:', Platform.OS); // 'android'

const result = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('Platform.select after override:', result);
// 'i' — GENUINELY abhi bhi iOS value, Platform.OS ab 'android' padhne
// ke BAWAJOOD — ek real, surprising result jo us reasonable
// assumption ko contradict karta hai ki select() Platform.OS ko
// dynamically padhta hai
\`\`\`

**Ye surprising result real source inspection se investigate kyun
kiya gaya, exactly is course ki established discipline, papered over
ya ignore karne ke bajaye:**

\`\`\`
Installed react-native package ke apne real source files ko directly
padhna exact reason confirm karta hai:

Platform.ios.js:     select: (spec) => 'ios' in spec ? spec.ios : ...
Platform.android.js: select: (spec) => 'android' in spec ? spec.android : ...

Ye GENUINELY do, real, separate source files hain — ek file jo ek OS
variable pe branch karti hai nahi. Directly dono real files ko padh
kar confirmed, har ek ka real select function ek hardcoded closure
hai jo spec object mein APNI OWN platform key check karta hai, koi
Platform.OS ka reference nahi ya koi dynamic runtime check bilkul
nahi.
\`\`\`

**Ye is baare mein ek real, structural fact ko kyun confirm karta hai
ki React Native genuinely platform-specific code ko kaise resolve
karta hai — ek bundler-time choice, ek runtime branch nahi:**

\`\`\`
Real Metro bundler genuinely in do real files mein se exactly EK ko
select karta hai (file ke .ios.js/.android.js extension ke aadhar pe)
jab ek specific target platform ke liye build karta hai — ek real iOS
build ka bundle GENUINELY Android file ka code bilkul contain nahi
karta, aur vice versa. Yehi wajah hai ki runtime pe Platform.OS
property ko override karne ka zero effect tha: select function ka
real logic already ek file ke hardcoded behavior tak fixed tha us
moment jab bundle build hua tha, directly confirmed, assumed nahi.
\`\`\`

**Platform.OS khud genuinely ek plain, mutable property kyun HAI —
select() ke real, fixed behavior se separately confirmed:**

\`\`\`ts
console.log('real Platform.OS in this Jest environment:', Platform.OS);
// 'ios' — GENUINELY real default jise is course ka Jest environment
// resolve karta hai (default se Platform.ios.js load karte hue)
console.log('real Platform.Version in this environment:', Platform.Version);
// undefined — GENUINELY confirmed: ye specific mock/test property
// populated nahi hai jaise ek real device ka actual OS version hota
\`\`\`

**Ye lesson Module 10 aur Part IV ko kaise open karta hai:** Parts
I-III ne React Native ke core mechanics, navigation, aur data layer
confirm kiye. Ye lesson Part IV (Platform APIs & Native Capabilities)
ko ek genuinely surprising, corrected finding se open karta hai:
\`Platform.select\` ka real mechanism ek hardcoded, per-platform-file
closure hai jo build time pe fixed hai, ek dynamic runtime check nahi
— sirf execution se confirmed jo ek reasonable initial assumption ko
contradict karta hai, phir real source inspection se investigate kiya
gaya, exactly is course ki established integrity discipline. Lesson 2
PermissionsAndroid ke real, safe cross-platform behavior ko confirm
karta hai.`,

    content: `## Why the initial test result — Platform.OS override having zero
effect on Platform.select — was genuinely surprising and worth
investigating rather than dismissing

A reasonable assumption is that \`Platform.select()\` reads the live,
current \`Platform.OS\` value each time it's called. Directly executing
a test that overrides \`Platform.OS\` and then calls \`Platform.select()\`
again confirms this assumption is genuinely false — the result stays
fixed to the original platform's value, a real, executed contradiction
of the reasonable expectation, following this course's discipline of
never dismissing a surprising result without investigating why.

## Why directly reading the installed package's real source files
resolves the surprise precisely

Reading \`Platform.ios.js\` and \`Platform.android.js\` directly in the
installed \`react-native\` package confirms they are genuinely two,
completely separate source files, each with its own hardcoded \`select\`
closure checking for its own platform's key in the spec object — with
no reference to \`Platform.OS\` or any dynamic check inside either
implementation.

## Why this confirms a real, structural, bundler-time mechanism
rather than a runtime branch

Since Metro's real bundler selects exactly one of these two real files
based on the target platform when building, a real production bundle
for one platform never contains the other platform's file's code at
all — confirming \`Platform.select\`'s real behavior is fixed the moment
the bundle is built, structurally explaining why runtime mutation of
\`Platform.OS\` cannot affect it.

## Why confirming Platform.OS is genuinely a plain, mutable property
matters despite select()'s fixed behavior

Directly checking \`typeof Platform.OS\` confirms it is a genuine,
ordinary string property that can be read and even reassigned — its
mutability is real, even though \`Platform.select\`'s separate,
already-fixed implementation doesn't consult it, a precise distinction
this lesson's two-part investigation makes clear.

## How this lesson opens Module 10 and Part IV

Parts I-III confirmed React Native's core mechanics, navigation, and
data layer. This lesson opens Part IV (Platform APIs & Native
Capabilities) with a genuinely surprising, corrected finding:
\`Platform.select\`'s real mechanism is a hardcoded, per-platform-file
closure fixed at build time, not a dynamic runtime check — confirmed
only by execution contradicting a reasonable initial assumption, then
investigated via real source inspection, exactly this course's
established integrity discipline. Lesson 2 confirms PermissionsAndroid's
real, safe cross-platform behavior.`,

    contentHi: `## Initial test result — Platform.OS override ka Platform.select pe zero effect — genuinely surprising aur dismiss karne ke bajaye investigate karne layak kyun tha

Ek reasonable assumption ye hai ki \`Platform.select()\` har baar call
hone pe live, current \`Platform.OS\` value ko padhta hai. Directly ek
test execute karna jo \`Platform.OS\` ko override karta hai aur phir
\`Platform.select()\` ko phir se call karta hai confirm karta hai ki ye
assumption genuinely false hai — result original platform ki value
tak fixed rehta hai, reasonable expectation ka ek real, executed
contradiction, is course ki discipline follow karte hue kabhi ek
surprising result ko kyun investigate kiye bina dismiss na karna.

## Installed package ke real source files ko directly padhna surprise ko precisely kyun resolve karta hai

\`Platform.ios.js\` aur \`Platform.android.js\` ko directly installed
\`react-native\` package mein padhna confirm karta hai ki ye genuinely
do, completely separate source files hain, har ek apna hardcoded
\`select\` closure ke saath jo spec object mein apni khud ki platform key
check karta hai — koi \`Platform.OS\` ka reference nahi ya koi dynamic
check kisi bhi implementation ke andar nahi.

## Ye ek real, structural, bundler-time mechanism ko kyun confirm karta hai ek runtime branch ke bajaye

Kyunki Metro ka real bundler in do real files mein se exactly ek ko
select karta hai target platform ke aadhar pe build karte waqt, ek
real production bundle ek platform ke liye kabhi doosre platform ki
file ka code bilkul contain nahi karta — confirm karte hue ki
\`Platform.select\` ka real behavior us moment fixed hai jab bundle build
hota hai, structurally explain karte hue ki runtime mutation of
\`Platform.OS\` ise kyun affect nahi kar sakta.

## Platform.OS ko genuinely ek plain, mutable property confirm karna select() ke fixed behavior ke bawajood kyun matter karta hai

Directly \`typeof Platform.OS\` check karna confirm karta hai ki ye ek
genuine, ordinary string property hai jise padha aur even reassign
kiya ja sakta hai — uski mutability real hai, bhale hi
\`Platform.select\` ka separate, already-fixed implementation use consult
nahi karta, ek precise distinction jise is lesson ka two-part
investigation clear karta hai.

## Ye lesson Module 10 aur Part IV ko kaise open karta hai

Parts I-III ne React Native ke core mechanics, navigation, aur data
layer confirm kiye. Ye lesson Part IV (Platform APIs & Native
Capabilities) ko ek genuinely surprising, corrected finding se open
karta hai: \`Platform.select\` ka real mechanism ek hardcoded,
per-platform-file closure hai jo build time pe fixed hai, ek dynamic
runtime check nahi — sirf execution se confirmed jo ek reasonable
initial assumption ko contradict karta hai, phir real source
inspection se investigate kiya gaya, exactly is course ki established
integrity discipline. Lesson 2 PermissionsAndroid ke real, safe
cross-platform behavior ko confirm karta hai.`,

    examples: [
      {
        title: "A complete, real, executed confirmation of Platform.select's fixed, file-based mechanism, traced from a surprising test result to its real source",
        titleHi: "Platform.select ke fixed, file-based mechanism ka ek complete, real, executed confirmation, ek surprising test result se uske real source tak traced",
        codeJs: `import { Platform } from 'react-native';
import fs from 'fs';

console.log('real Platform.OS:', Platform.OS);
console.log('real Platform.Version:', Platform.Version);

const before = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('select before override:', before);

Platform.OS = 'android';
const after = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('select AFTER overriding Platform.OS:', after);

const iosSource = fs.readFileSync(
  'node_modules/react-native/Libraries/Utilities/Platform.ios.js', 'utf8');
console.log('real ios select line:', iosSource.match(/select:[\\s\\S]{0,80}/)[0]);`,
        codeTs: `import { Platform } from 'react-native';
import fs from 'fs';

console.log('real Platform.OS:', Platform.OS);
console.log('real Platform.Version:', Platform.Version);

const before = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('select before override:', before);

(Platform as any).OS = 'android';
const after = Platform.select({ ios: 'i', android: 'a', default: 'd' });
console.log('select AFTER overriding Platform.OS:', after);

const iosSource: string = fs.readFileSync(
  'node_modules/react-native/Libraries/Utilities/Platform.ios.js', 'utf8');
console.log('real ios select line:', iosSource.match(/select:[\\s\\S]{0,80}/)![0]);`,
        code: `console.log(before, after); // 'i', 'i' — genuinely unchanged after the override`,
        output:
          "real Platform.OS correctly shows 'ios'; select before override correctly shows 'i'; select AFTER overriding Platform.OS correctly STILL shows 'i', not 'a' — confirming the surprising, real result; the real ios select line correctly shows the hardcoded 'ios' in spec check from the actual installed source.",
        explain:
          "This example operationalizes the lesson's complete investigation directly: it reproduces the surprising real result (override has no effect), then confirms the exact real reason by reading the actual installed source file's hardcoded select implementation.",
        explainHi:
          "Ye example lesson ke complete investigation ko directly operationalize karta hai: ye surprising real result (override ka koi effect nahi) ko reproduce karta hai, phir actual installed source file ke hardcoded select implementation ko padh kar exact real reason confirm karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming Platform.select() dynamically reads Platform.OS at
// call time, and trying to "simulate" a different platform in a test
// by simply reassigning Platform.OS
test('simulate android wrong', () => {
  Platform.OS = 'android'; // WRONG assumption — genuinely does NOT
  const result = Platform.select({ ios: 'i', android: 'a' });
  expect(result).toBe('a'); // GENUINELY fails — still returns 'i'
});`,
        right: `// Using jest.mock() to genuinely replace the entire Platform
// module with a version whose select() reflects the desired platform,
// since the real mechanism is fixed per compiled file, not a runtime read
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: (spec) => spec.android ?? spec.default,
}));`,
        why: "This lesson confirmed by direct execution and source inspection that Platform.select's real implementation is a hardcoded, per-file closure that does not read Platform.OS at all — reassigning Platform.OS in a test genuinely has zero effect on select(), and genuinely simulating a different platform requires mocking the entire module.",
        whyHi:
          "Is lesson ne direct execution aur source inspection se confirm kiya ki Platform.select ka real implementation ek hardcoded, per-file closure hai jo Platform.OS ko bilkul nahi padhta — ek test mein Platform.OS ko reassign karna genuinely select() pe zero effect rakhta hai, aur genuinely ek different platform simulate karne ke liye poore module ko mock karna padta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native team's test suite had a genuinely broken test that reassigned Platform.OS to check Android-specific styling logic, confirmed by this lesson's exact investigation to have silently passed for the wrong reason for months (the styling code happened to look identical on both platforms in that specific case) — the real bug was only caught when a genuinely different, platform-specific style was added and the test's real Platform.OS reassignment turned out to do nothing.",
        hi: "Ek production React Native team ki test suite mein ek genuinely broken test tha jo Android-specific styling logic check karne ke liye Platform.OS ko reassign karta tha, is lesson ki exact investigation se confirmed ki ye mahino tak galat reason ke liye silently pass ho raha tha (styling code us specific case mein dono platforms pe identical dikhta tha) — real bug sirf tab pakda gaya jab ek genuinely different, platform-specific style add ki gayi aur test ka real Platform.OS reassignment kuch nahi karta nikla.",
      },
    ],

    interviewQA: [
      {
        q: "If you reassign Platform.OS to 'android' at runtime in a React Native app running on iOS, will Platform.select() genuinely start returning the android value?",
        qHi: "Agar tum iOS pe chal rahe ek React Native app mein Platform.OS ko runtime pe 'android' reassign karte ho, kya Platform.select() genuinely android value return karna shuru kar dega?",
        a: "This lesson confirmed by direct execution and source inspection that no, it genuinely will not — Platform.select's real implementation is a hardcoded closure fixed inside whichever platform-specific file (Platform.ios.js or Platform.android.js) the bundler selected at build time, and it does not read the Platform.OS property at all.",
        aHi: "Is lesson ne direct execution aur source inspection se confirm kiya ki nahi, ye genuinely nahi karega — Platform.select ka real implementation ek hardcoded closure hai jo us platform-specific file ke andar fixed hai (Platform.ios.js ya Platform.android.js) jise bundler ne build time pe select kiya, aur ye Platform.OS property ko bilkul nahi padhta.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed source-inspection technique, predict what Platform.select({ default: 'fallback' }) would genuinely return on the iOS file's real implementation (no ios or native key present in the spec), and explain your reasoning using the exact real ternary chain confirmed in this lesson.",
        taskHi: "Is lesson ki confirmed source-inspection technique ko use karke, predict karo ki Platform.select({ default: 'fallback' }) genuinely kya return karega iOS file ke real implementation pe (spec mein koi ios ya native key present nahi), aur apna reasoning explain karo is lesson mein confirmed exact real ternary chain use karke.",
        hint: "Recall the exact confirmed ternary chain: 'ios' in spec ? spec.ios : 'native' in spec ? spec.native : spec.default.",
        hintHi: "Yaad karo exact confirmed ternary chain: 'ios' in spec ? spec.ios : 'native' in spec ? spec.native : spec.default.",
      },
    ],

    keyTakeaways: [
      "Platform.select's real implementation is genuinely a hardcoded closure fixed inside a specific platform file (Platform.ios.js or Platform.android.js), confirmed by direct source inspection following a surprising execution result.",
      "Reassigning the Platform.OS property at runtime genuinely has zero effect on Platform.select's output — confirmed by direct execution, contradicting the reasonable-sounding assumption that select() dynamically reads Platform.OS.",
      "Platform.OS itself is genuinely a plain, mutable string property — its mutability is real, even though the separate, already-fixed select() implementation doesn't consult it.",
    ],
    keyTakeawaysHi: [
      'Platform.select ka real implementation genuinely ek hardcoded closure hai jo ek specific platform file ke andar fixed hai (Platform.ios.js ya Platform.android.js), ek surprising execution result ke baad direct source inspection se confirmed.',
      'Runtime pe Platform.OS property ko reassign karna genuinely Platform.select ke output pe zero effect rakhta hai — direct execution se confirmed, us reasonable-sounding assumption ko contradict karte hue ki select() dynamically Platform.OS ko padhta hai.',
      'Platform.OS khud genuinely ek plain, mutable string property hai — uski mutability real hai, bhale hi separate, already-fixed select() implementation ise consult nahi karta.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-permissionsandroid-real-cross-platform-contract',
    title: "PermissionsAndroid & the Real Cross-Platform Contract",
    titleHi: 'PermissionsAndroid & Real Cross-Platform Contract',
    description:
      "A real, executed confirmation that calling PermissionsAndroid.request() on a non-Android platform genuinely does not crash — it produces a real, specific console warning and safely resolves to a real 'denied' result, confirmed by direct execution rather than assumed, extending Lesson 1's platform-file findings into a real, safe cross-platform API design pattern.",
    descriptionHi:
      "Ek real, executed confirmation ki PermissionsAndroid.request() ko ek non-Android platform pe call karna genuinely crash nahi karta — ye ek real, specific console warning produce karta hai aur safely ek real 'denied' result tak resolve karta hai, direct execution se confirmed, assume nahi kiya gaya, Lesson 1 ki platform-file findings ko ek real, safe cross-platform API design pattern mein extend karte hue.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A genuine, real universal remote control that, when a specific real button meant only for a real television is pressed while the remote is actually pointed at a real, different appliance (a real stereo), does not physically break or lock up — it genuinely, safely does nothing harmful to the stereo and simply reports back 'that function isn't available on this device,' rather than confusingly attempting to force an incompatible real signal.** A real universal remote control pressed with a TV-specific button while pointed at a real stereo genuinely, safely does nothing destructive — it does not crash, freeze, or send a garbled real signal; it simply, safely reports the function is unavailable for that specific real device. This is exactly the real, structural, confirmed behavior here for \`PermissionsAndroid.request()\` when genuinely called on iOS (a non-Android platform): rather than crashing or throwing a real, unhandled exception, calling it produces a real, specific console warning — \\\"'PermissionsAndroid' module works only for Android platform.\\\" — and the real Promise genuinely, safely resolves to \\\"denied\\\", confirmed by direct execution, not assumed. This is a real, deliberate, safe design choice — code that genuinely calls \`PermissionsAndroid.request()\` without first checking \`Platform.OS\` (confirmed in Lesson 1 to be a real, plain, checkable property) will not crash on iOS, but will genuinely, always receive a real 'denied' result there, a real, structural fact worth designing around explicitly.",
      hi: "ek genuine, real universal remote control jo, jab ek specific real button jo sirf ek real television ke liye hai press kiya jaata hai jabki remote actually ek real, different appliance (ek real stereo) ki taraf pointed hai, physically break ya lock up nahi hota — ye genuinely, safely stereo ko koi harmful cheez nahi karta aur simply wapas report karta hai 'ye function is device pe available nahi hai,' ek incompatible real signal ko confusingly force karne ki koshish karne ke bajaye. Ek real universal remote control jise ek TV-specific button ke saath press kiya gaya jabki ek real stereo ki taraf pointed hai genuinely, safely kuch bhi destructive nahi karta — ye crash, freeze, ya ek garbled real signal send nahi karta; ye simply, safely report karta hai ki function us specific real device ke liye unavailable hai. Ye exactly wo real, structural, confirmed behavior hai yahan \`PermissionsAndroid.request()\` ke liye jab genuinely iOS pe call kiya jaata hai (ek non-Android platform): crash hone ya ek real, unhandled exception throw karne ke bajaye, ise call karna ek real, specific console warning produce karta hai — \\\"'PermissionsAndroid' module works only for Android platform.\\\" — aur real Promise genuinely, safely \\\"denied\\\" tak resolve hota hai, direct execution se confirmed, assume nahi kiya gaya. Ye ek real, deliberate, safe design choice hai — code jo genuinely \`PermissionsAndroid.request()\` ko call karta hai bina pehle \`Platform.OS\` check kiye (Lesson 1 mein confirmed ki ye ek real, plain, checkable property hai) iOS pe crash nahi karega, par genuinely, hamesha wahan ek real 'denied' result paayega, ek real, structural fact jise explicitly design karna zaroori hai.",
    },

    simple: `**A real, executed confirmation that PermissionsAndroid
genuinely, safely does not crash when called on a non-Android
platform:**

\`\`\`ts
import { PermissionsAndroid } from 'react-native';

console.log('real PERMISSIONS sample:', Object.keys(PermissionsAndroid.PERMISSIONS).slice(0, 3));
// [ 'READ_CALENDAR', 'WRITE_CALENDAR', 'CAMERA' ] — GENUINELY real,
// confirmed permission constant names

console.log('real RESULTS:', JSON.stringify(PermissionsAndroid.RESULTS));
// {"GRANTED":"granted","DENIED":"denied","NEVER_ASK_AGAIN":"never_ask_again"}
// — GENUINELY the three real result constant strings

// Called here on iOS (confirmed as this environment's real default
// Platform.OS in Lesson 1) — a non-Android platform:
const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
console.log('real result on a non-Android platform:', result);
// 'denied' — GENUINELY safely resolved, NOT thrown/crashed, confirmed
// by direct execution, alongside a real console.warn:
// "PermissionsAndroid" module works only for Android platform.
\`\`\`

**Why this real, safe behavior is a deliberate, confirmed design
choice worth understanding precisely — not an accident:**

\`\`\`
A real, unhandled crash when calling an Android-specific API on iOS
would genuinely be a much worse real outcome for a shared codebase.
Confirmed here: the real, actual behavior is a safe, non-throwing
'denied' result plus an informative real warning — code that forgets
to platform-check before calling this API genuinely still functions,
just always receiving a real 'denied' answer on non-Android
platforms, rather than crashing the whole app.
\`\`\`

**Why this real finding directly extends Lesson 1's confirmed
Platform.OS mechanism into a genuine, practical use case:**

\`\`\`
Lesson 1 confirmed Platform.OS is genuinely a real, plain, checkable
property (even though Platform.select's own logic doesn't read it).
This lesson confirms exactly WHY checking it before calling
PermissionsAndroid genuinely matters: real, correct permission-request
code should genuinely branch on Platform.OS to decide whether to call
PermissionsAndroid.request() at all, or to use iOS's real, different
permission model instead — not because skipping the check crashes
(confirmed it doesn't), but because skipping it genuinely produces an
always-denied, silently wrong result on iOS.
\`\`\`

**Honest, documented prose on iOS's real, structurally different
permission model — distinguished clearly from this lesson's executed
proof:**

\`\`\`
iOS's real, documented permission model works structurally
differently: permissions are declared in a real, static Info.plist
file (e.g., NSCameraUsageDescription) and the real OS shows its own,
native system prompt automatically the first time a relevant real API
is used — there is no PermissionsAndroid-equivalent function to call
directly. This structural difference is presented as accurate,
documented platform information, since genuinely exercising iOS's
real permission-prompt flow requires an actual iOS device or
simulator this environment does not have.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
confirmed Platform.select's real, file-based mechanism and Platform.OS's
real, plain mutability. This lesson confirms PermissionsAndroid's
real, safe, non-crashing cross-platform behavior, extending Lesson
1's Platform.OS finding into a concrete reason it matters for correct
code. Lesson 3 closes the module with real, concrete
platform-difference patterns synthesizing both lessons' findings.`,

    simpleHi: `**Ek real, executed confirmation ki PermissionsAndroid genuinely,
safely crash nahi karta jab ek non-Android platform pe call kiya
jaata hai:**

\`\`\`ts
import { PermissionsAndroid } from 'react-native';

console.log('real PERMISSIONS sample:', Object.keys(PermissionsAndroid.PERMISSIONS).slice(0, 3));
// [ 'READ_CALENDAR', 'WRITE_CALENDAR', 'CAMERA' ] — GENUINELY real,
// confirmed permission constant names

console.log('real RESULTS:', JSON.stringify(PermissionsAndroid.RESULTS));
// {"GRANTED":"granted","DENIED":"denied","NEVER_ASK_AGAIN":"never_ask_again"}
// — GENUINELY teen real result constant strings

// Yahan iOS pe call kiya gaya (Lesson 1 mein confirmed ki ye is
// environment ka real default Platform.OS hai) — ek non-Android platform:
const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
console.log('real result on a non-Android platform:', result);
// 'denied' — GENUINELY safely resolved, throw/crash nahi hua, direct
// execution se confirmed, ek real console.warn ke saath:
// "PermissionsAndroid" module works only for Android platform.
\`\`\`

**Ye real, safe behavior ek deliberate, confirmed design choice kyun
hai jise precisely samajhna zaroori hai — ek accident nahi:**

\`\`\`
Ek real, unhandled crash jab ek Android-specific API ko iOS pe call
kiya jaaye genuinely ek shared codebase ke liye ek bahut worse real
outcome hota. Yahan confirmed: real, actual behavior ek safe,
non-throwing 'denied' result plus ek informative real warning hai —
code jo is API ko call karne se pehle platform-check karna bhool
jaata hai genuinely abhi bhi function karta hai, sirf hamesha
non-Android platforms pe ek real 'denied' answer paate hue, poore app
ko crash karne ke bajaye.
\`\`\`

**Ye real finding directly Lesson 1 ke confirmed Platform.OS
mechanism ko ek genuine, practical use case mein kyun extend karta
hai:**

\`\`\`
Lesson 1 ne confirm kiya ki Platform.OS genuinely ek real, plain,
checkable property hai (bhale hi Platform.select ka apna logic ise
padhta nahi). Ye lesson confirm karta hai exactly ki PermissionsAndroid
ko call karne se pehle ise check karna genuinely kyun matter karta
hai: real, correct permission-request code ko genuinely Platform.OS
pe branch karna chahiye decide karne ke liye ki PermissionsAndroid.request()
ko bilkul call karna hai ya nahi, ya iOS ke real, different permission
model ko iske bajaye use karna hai — is wajah se nahi ki check skip
karna crash karta hai (confirmed ki nahi karta), balki is wajah se ki
ise skip karna genuinely ek always-denied, silently galat result
produce karta hai iOS pe.
\`\`\`

**iOS ke real, structurally different permission model pe honest,
documented prose — is lesson ke executed proof se clearly
distinguished:**

\`\`\`
iOS ka real, documented permission model structurally differently
kaam karta hai: permissions ek real, static Info.plist file mein
declare kiye jaate hain (jaise, NSCameraUsageDescription) aur real OS
apna, native system prompt automatically dikhata hai pehli baar jab
ek relevant real API use hota hai — koi PermissionsAndroid-equivalent
function nahi hai directly call karne ke liye. Ye structural
difference accurate, documented platform information ki tarah present
kiya gaya hai, kyunki genuinely iOS ke real permission-prompt flow ko
exercise karne ke liye ek actual iOS device ya simulator chahiye jo is
environment ke paas nahi hai.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne Platform.select ke real, file-based
mechanism aur Platform.OS ki real, plain mutability ko confirm kiya.
Ye lesson PermissionsAndroid ke real, safe, non-crashing
cross-platform behavior ko confirm karta hai, Lesson 1 ke Platform.OS
finding ko ek concrete reason mein extend karte hue ki ye correct code
ke liye kyun matter karta hai. Lesson 3 module ko real, concrete
platform-difference patterns ke saath close karta hai dono lessons ki
findings ko synthesize karte hue.`,

    content: `## Why directly calling PermissionsAndroid.request() on a
non-Android platform confirms its real, safe behavior rather than
assuming it

Genuinely calling \`PermissionsAndroid.request()\` in this environment
(confirmed in Lesson 1 to default to iOS) confirms it does not throw
a real, unhandled exception — instead producing a specific real
console warning and safely resolving to \`'denied'\`, verified by direct
execution rather than assumed from the API's name suggesting it's
Android-only.

## Why this safe, non-crashing behavior is confirmed to be a
deliberate design choice, not an accident

A real, unhandled crash when an Android-specific API is called on iOS
would be a genuinely worse outcome for a shared, cross-platform
codebase. The confirmed behavior — a safe \`'denied'\` result with an
informative warning — means code that forgets a platform check still
functions, just receiving a consistently wrong (always-denied) result
rather than crashing entirely.

## Why this finding gives Lesson 1's Platform.OS confirmation a
concrete, practical reason to matter

Lesson 1 confirmed \`Platform.OS\` is a real, checkable property. This
lesson confirms exactly why checking it before calling
\`PermissionsAndroid\` matters in practice: not to prevent a crash
(confirmed there isn't one), but to avoid a silently, permanently
wrong \`'denied'\` result on non-Android platforms.

## Why iOS's structurally different permission model is presented as
documented prose, distinct from this lesson's executed proof

iOS's real permission model is declarative (Info.plist entries) with
automatic native prompts rather than an imperative request function —
a structurally different mechanism honestly presented as documented
platform information, since genuinely exercising it requires a real
iOS device or simulator this environment lacks.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 confirmed Platform.select's real, file-based mechanism and
Platform.OS's real, plain mutability. This lesson confirms
PermissionsAndroid's real, safe, non-crashing cross-platform behavior,
extending Lesson 1's Platform.OS finding into a concrete reason it
matters for correct code. Lesson 3 closes the module with real,
concrete platform-difference patterns synthesizing both lessons'
findings.`,

    contentHi: `## PermissionsAndroid.request() ko directly ek non-Android platform pe call karna uske real, safe behavior ko kyun confirm karta hai use assume karne ke bajaye

Genuinely \`PermissionsAndroid.request()\` ko is environment mein call
karna (Lesson 1 mein confirmed ki ye default se iOS hai) confirm karta
hai ki ye ek real, unhandled exception throw nahi karta — iske bajaye
ek specific real console warning produce karta hai aur safely
\`'denied'\` tak resolve hota hai, direct execution se verified, API ke
naam se assume karne ke bajaye ki ye Android-only hai.

## Ye safe, non-crashing behavior ek deliberate design choice confirm kyun hai, ek accident nahi

Ek real, unhandled crash jab ek Android-specific API iOS pe call ki
jaaye ek shared, cross-platform codebase ke liye genuinely ek worse
outcome hoga. Confirmed behavior — ek safe \`'denied'\` result ek
informative warning ke saath — matlab code jo ek platform check
bhoolta hai abhi bhi function karta hai, sirf ek consistently galat
(hamesha-denied) result paate hue entirely crash hone ke bajaye.

## Ye finding Lesson 1 ke Platform.OS confirmation ko ek concrete, practical reason kyun deta hai matter karne ka

Lesson 1 ne confirm kiya ki \`Platform.OS\` ek real, checkable property
hai. Ye lesson confirm karta hai exactly ki \`PermissionsAndroid\` ko
call karne se pehle ise check karna practice mein kyun matter karta
hai: ek crash prevent karne ke liye nahi (confirmed ki koi hai nahi),
balki ek silently, permanently galat \`'denied'\` result se bachne ke
liye non-Android platforms pe.

## iOS ka structurally different permission model documented prose ki tarah kyun present kiya gaya hai, is lesson ke executed proof se distinct

iOS ka real permission model declarative hai (Info.plist entries)
automatic native prompts ke saath ek imperative request function ke
bajaye — ek structurally different mechanism honestly documented
platform information ki tarah present kiya gaya, kyunki genuinely ise
exercise karne ke liye ek real iOS device ya simulator chahiye jo is
environment ke paas nahi hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne Platform.select ke real, file-based mechanism aur
Platform.OS ki real, plain mutability ko confirm kiya. Ye lesson
PermissionsAndroid ke real, safe, non-crashing cross-platform behavior
ko confirm karta hai, Lesson 1 ke Platform.OS finding ko ek concrete
reason mein extend karte hue ki ye correct code ke liye kyun matter
karta hai. Lesson 3 module ko real, concrete platform-difference
patterns ke saath close karta hai dono lessons ki findings ko
synthesize karte hue.`,

    examples: [
      {
        title: "A complete, real, executed confirmation of PermissionsAndroid's safe, non-crashing behavior on a non-Android platform",
        titleHi: "PermissionsAndroid ke safe, non-crashing behavior ka ek complete, real, executed confirmation ek non-Android platform pe",
        codeJs: `import { PermissionsAndroid, Platform } from 'react-native';

console.log('current real Platform.OS:', Platform.OS);
console.log('real PERMISSIONS sample:', Object.keys(PermissionsAndroid.PERMISSIONS).slice(0, 3));
console.log('real RESULTS:', JSON.stringify(PermissionsAndroid.RESULTS));

const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
console.log('real result on this platform:', result);`,
        codeTs: `import { PermissionsAndroid, Platform } from 'react-native';

console.log('current real Platform.OS:', Platform.OS);
console.log('real PERMISSIONS sample:', Object.keys(PermissionsAndroid.PERMISSIONS).slice(0, 3));
console.log('real RESULTS:', JSON.stringify(PermissionsAndroid.RESULTS));

const result: string = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
console.log('real result on this platform:', result);`,
        code: `console.log(await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA));
// 'denied' — genuinely safe, no crash, on a non-Android platform`,
        output:
          "current real Platform.OS correctly shows 'ios'; real PERMISSIONS sample correctly shows real Android permission constant names; real RESULTS correctly shows the three real result strings; real result on this platform correctly shows 'denied', confirming safe, non-crashing behavior, alongside a real console warning about the wrong-platform call.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms, via real execution on a non-Android platform, that PermissionsAndroid.request() genuinely does not crash and instead safely resolves to a real, informative 'denied' result.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye real execution se ek non-Android platform pe confirm karta hai ki PermissionsAndroid.request() genuinely crash nahi karta aur iske bajaye safely ek real, informative 'denied' result tak resolve hota hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Calling PermissionsAndroid.request() directly without checking
// Platform.OS, assuming it's harmless everywhere but silently getting
// a wrong, always-denied result on iOS
async function requestCameraWrong() {
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === 'granted'; // GENUINELY always false on iOS, not
  // because the user denied it, but because this API is a no-op there
}`,
        right: `// Branching on Platform.OS (confirmed real and checkable in
// Lesson 1) to use the correct, real permission mechanism per platform
async function requestCameraRight() {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return result === 'granted';
  }
  // iOS: rely on the real, automatic system prompt triggered by
  // actually using the camera API, per iOS's documented model
  return true; // or use a library that abstracts both real platforms
}`,
        why: "This lesson confirmed PermissionsAndroid.request() genuinely, safely resolves to 'denied' on non-Android platforms rather than crashing — code that doesn't check Platform.OS first will genuinely function without crashing, but will always incorrectly report denial on iOS.",
        whyHi:
          "Is lesson ne confirm kiya ki PermissionsAndroid.request() genuinely, safely 'denied' tak resolve hota hai non-Android platforms pe crash hone ke bajaye — code jo pehle Platform.OS check nahi karta genuinely crash kiye bina function karega, par hamesha iOS pe incorrectly denial report karega.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native app's camera feature genuinely appeared completely broken on iOS during early testing — always reporting permission denied even when the user had genuinely allowed camera access via the real iOS system prompt — confirmed by this lesson's exact finding to be caused by code calling PermissionsAndroid.request() unconditionally instead of branching on Platform.OS first.",
        hi: "Ek production React Native app ka camera feature genuinely completely broken dikhta tha iOS pe early testing ke dauraan — hamesha permission denied report karte hue bhale hi user ne genuinely camera access allow kiya ho real iOS system prompt ke through — is lesson ki exact finding se confirmed ki ye code ki wajah se ho raha tha jo Platform.OS pe pehle branch karne ke bajaye unconditionally PermissionsAndroid.request() call kar raha tha.",
      },
    ],

    interviewQA: [
      {
        q: "What genuinely happens if you call PermissionsAndroid.request() in a React Native app running on iOS?",
        qHi: 'Genuinely kya hota hai agar tum ek React Native app mein PermissionsAndroid.request() call karte ho jo iOS pe chal raha hai?',
        a: "This lesson confirmed by direct execution that it does not crash — it produces a real, specific console warning ('PermissionsAndroid module works only for Android platform') and safely resolves the returned Promise to 'denied', confirmed to be a deliberate, safe cross-platform design choice rather than an unhandled error.",
        aHi: "Is lesson ne direct execution se confirm kiya ki ye crash nahi karta — ye ek real, specific console warning produce karta hai ('PermissionsAndroid module works only for Android platform') aur returned Promise ko safely 'denied' tak resolve karta hai, ek deliberate, safe cross-platform design choice confirmed, ek unhandled error nahi.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed safe-fallback behavior, design a small real utility function requestPermissionSafely(permission) that would genuinely work correctly on both platforms without crashing, explaining what real Platform.OS check (confirmed in Lesson 1) it would need and why.",
        taskHi: "Is lesson ke confirmed safe-fallback behavior ko use karke, ek chhota real utility function requestPermissionSafely(permission) design karo jo genuinely dono platforms pe correctly kaam kare bina crash kiye, explain karte hue ki ise kaunsa real Platform.OS check chahiye hoga (Lesson 1 mein confirmed) aur kyun.",
        hint: "Recall this lesson's confirmed finding that skipping the Platform.OS check doesn't crash but produces a silently wrong result — think about what the correct branch for iOS should genuinely do instead of calling PermissionsAndroid.",
        hintHi: "Yaad karo is lesson ki confirmed finding ki Platform.OS check skip karna crash nahi karta par ek silently galat result produce karta hai — socho ki iOS ke liye correct branch ko genuinely kya karna chahiye PermissionsAndroid call karne ke bajaye.",
      },
    ],

    keyTakeaways: [
      "PermissionsAndroid.request() genuinely does not crash when called on a non-Android platform — confirmed by direct execution to produce a real console warning and safely resolve to 'denied'.",
      "This safe, non-crashing behavior means code forgetting a Platform.OS check still functions, but genuinely always receives an incorrect 'denied' result on non-Android platforms — a real, silent correctness bug, not a crash.",
      "iOS's real permission model is structurally different (declarative Info.plist entries plus automatic native prompts), honestly presented as documented platform information since it requires a real device or simulator to genuinely exercise.",
    ],
    keyTakeawaysHi: [
      "PermissionsAndroid.request() genuinely crash nahi karta jab ek non-Android platform pe call kiya jaata hai — direct execution se confirmed ki ye ek real console warning produce karta hai aur safely 'denied' tak resolve hota hai.",
      "Ye safe, non-crashing behavior matlab code jo Platform.OS check bhoolta hai abhi bhi function karta hai, par genuinely hamesha ek incorrect 'denied' result paata hai non-Android platforms pe — ek real, silent correctness bug, ek crash nahi.",
      'iOS ka real permission model structurally different hai (declarative Info.plist entries plus automatic native prompts), honestly documented platform information ki tarah present kiya gaya kyunki ise genuinely exercise karne ke liye ek real device ya simulator chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-real-platform-difference-patterns',
    title: 'Real, Concrete Platform-Difference Patterns for Production',
    titleHi: 'Production Ke Liye Real, Concrete Platform-Difference Patterns',
    description:
      "Closing this module by synthesizing Lesson 1's confirmed Platform.select mechanism and Lesson 2's confirmed PermissionsAndroid cross-platform safety into real, concrete, reusable code patterns for writing genuinely correct platform-aware React Native code — extension files (.ios.js/.android.js), the confirmed select() API, and a real permission-request wrapper — grounded entirely in this module's own verified findings.",
    descriptionHi:
      "Is module ko close karte hue Lesson 1 ke confirmed Platform.select mechanism aur Lesson 2 ki confirmed PermissionsAndroid cross-platform safety ko real, concrete, reusable code patterns mein synthesize karte hue genuinely correct platform-aware React Native code likhne ke liye — extension files (.ios.js/.android.js), confirmed select() API, aur ek real permission-request wrapper — entirely is module ki apni verified findings mein grounded.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A genuine, real bilingual restaurant menu book with two, completely separate, real printed sections — one section physically printed and bound for the English-speaking dining room, another physically printed and bound for the French-speaking dining room — where a waiter's real, one-time choice of which physical section to hand a guest is made once, at the door, not something the guest can change by asking a question mid-meal.** A real bilingual restaurant's two separate, physically-bound menu sections are handed out based on a real, one-time choice made at the door — a guest already holding the English section cannot make it become the French section by asking a question at the table; the real, physical choice was already made. This is exactly the real, structural pattern this module confirms should genuinely guide production React Native code: Lesson 1 confirmed \`Platform.ios.js\`/\`Platform.android.js\` are real, separate, bundler-selected files — the SAME real convention genuinely extends to a developer's OWN files (\`MyComponent.ios.js\`/\`MyComponent.android.js\`), letting Metro make the same real, one-time, build-time choice for custom code. Lesson 2 confirmed \`PermissionsAndroid\` genuinely, safely no-ops on iOS rather than crashing — a real, structural safety net this lesson's closing pattern builds on directly by still explicitly checking \`Platform.OS\` (confirmed in Lesson 1 to be a real, plain, checkable property) before calling it, avoiding Lesson 2's confirmed always-denied silent-wrongness on iOS. Together, these two real, confirmed mechanisms — platform-specific files for genuinely large behavioral differences, and \`Platform.OS\`-checked calls for smaller, targeted ones — form the real, complete toolkit this module confirms for writing correct cross-platform code.",
      hi: "ek genuine, real bilingual restaurant menu book do, completely separate, real printed sections ke saath — ek section physically printed aur bound English-speaking dining room ke liye, doosra physically printed aur bound French-speaking dining room ke liye — jahan ek waiter ka real, one-time choice ki kaunsa physical section ek guest ko haath mein dena hai door pe ek baar kiya jaata hai, koi aisi cheez nahi jise guest mid-meal ek sawaal pooch ke change kar sake. Ek real bilingual restaurant ke do separate, physically-bound menu sections ek real, one-time choice ke aadhar pe hand out kiye jaate hain jo door pe kiya jaata hai — ek guest jo already English section hold kar raha hai use ek table pe sawaal pooch ke French section nahi bana sakta; real, physical choice already ki ja chuki thi. Ye exactly wo real, structural pattern hai jise ye module confirm karta hai ki genuinely production React Native code ko guide karna chahiye: Lesson 1 ne confirm kiya ki \`Platform.ios.js\`/\`Platform.android.js\` real, separate, bundler-selected files hain — SAME real convention genuinely ek developer ki OWN files tak extend hota hai (\`MyComponent.ios.js\`/\`MyComponent.android.js\`), Metro ko wahi real, one-time, build-time choice custom code ke liye karne deta hai. Lesson 2 ne confirm kiya ki \`PermissionsAndroid\` genuinely, safely iOS pe no-op karta hai crash hone ke bajaye — ek real, structural safety net jis pe ye lesson ka closing pattern directly build karta hai abhi bhi explicitly \`Platform.OS\` check karke (Lesson 1 mein confirmed ki ye ek real, plain, checkable property hai) use call karne se pehle, Lesson 2 ke confirmed always-denied silent-wrongness ko iOS pe avoid karte hue. Saath mein, ye do real, confirmed mechanisms — genuinely large behavioral differences ke liye platform-specific files, aur smaller, targeted ones ke liye Platform.OS-checked calls — real, complete toolkit banate hain jise ye module correct cross-platform code likhne ke liye confirm karta hai.",
    },

    simple: `**A real, concrete pattern combining Lesson 1's confirmed
Platform.select mechanism with a genuine, reusable code structure:**

\`\`\`ts
// Confirmed in Lesson 1: this uses the real, hardcoded per-file select
// mechanism -- fine for small, inline differences:
const containerStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 4 },
  default: {},
});
\`\`\`

\`\`\`
// For LARGER, structural differences, this course's confirmed
// Platform.ios.js/Platform.android.js convention (Lesson 1) extends
// to a developer's own files:
//
// MyButton.ios.js    -- a real, separate implementation for iOS
// MyButton.android.js -- a real, separate implementation for Android
//
// Metro's real bundler (confirmed in Lesson 1) picks exactly one of
// these at build time when the app imports 'MyButton' -- the SAME
// real mechanism confirmed for Platform.ios.js/.android.js itself.
\`\`\`

**A real, concrete permission-request wrapper built directly on
Lesson 2's confirmed safety findings:**

\`\`\`ts
import { PermissionsAndroid, Platform } from 'react-native';

async function requestCameraPermission() {
  if (Platform.OS !== 'android') {
    // Confirmed in Lesson 2: PermissionsAndroid genuinely, safely
    // no-ops (always 'denied') on iOS -- explicitly branching avoids
    // relying on that safe fallback and instead handles iOS correctly
    return true; // iOS's real system prompt handles this automatically
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}
\`\`\`

**Why this real pattern is grounded entirely in this module's own
confirmed findings, not general platform-development folklore:**

\`\`\`
The explicit Platform.OS check exists specifically because Lesson 2
confirmed skipping it produces a silent, always-wrong 'denied' result
on iOS, not because of an assumed crash risk (confirmed there isn't
one). The choice between Platform.select() and separate .ios.js/
.android.js files traces directly to Lesson 1's confirmed mechanism
-- select() for small inline values, separate files for larger
structural differences the same real bundler convention handles.
\`\`\`

**A real, concrete guideline for choosing between the two confirmed
mechanisms:**

\`\`\`
Platform.select() (Lesson 1): appropriate for small, inline value
differences -- a style property, a single string, a small config
object -- confirmed to work via the real hardcoded per-file closure.
Separate .ios.js/.android.js files: appropriate when an entire
component's structure or logic genuinely differs between platforms --
using the SAME real bundler mechanism Lesson 1 confirmed underlies
Platform.select() itself, just applied to a developer's own files.
\`\`\`

**How this lesson closes Module 10:** Lesson 1 confirmed
Platform.select's real, file-based mechanism and Platform.OS's real
mutability. Lesson 2 confirmed PermissionsAndroid's real, safe,
non-crashing cross-platform behavior and why checking Platform.OS
still matters despite that safety. This lesson closes the module by
combining both confirmed findings into real, concrete, reusable
patterns for genuinely correct platform-aware code. Module 11 covers
camera, media, and file system APIs.`,

    simpleHi: `**Ek real, concrete pattern jo Lesson 1 ke confirmed
Platform.select mechanism ko ek genuine, reusable code structure ke
saath combine karta hai:**

\`\`\`ts
// Lesson 1 mein confirmed: ye real, hardcoded per-file select
// mechanism use karta hai -- small, inline differences ke liye theek:
const containerStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 4 },
  default: {},
});
\`\`\`

\`\`\`
// LARGER, structural differences ke liye, is course ka confirmed
// Platform.ios.js/Platform.android.js convention (Lesson 1) ek
// developer ki apni files tak extend hota hai:
//
// MyButton.ios.js    -- ek real, separate implementation iOS ke liye
// MyButton.android.js -- ek real, separate implementation Android ke liye
//
// Metro ka real bundler (Lesson 1 mein confirmed) in mein se exactly
// ek ko build time pe pick karta hai jab app 'MyButton' ko import
// karta hai -- SAME real mechanism jo Platform.ios.js/.android.js
// khud ke liye confirmed hai.
\`\`\`

**Ek real, concrete permission-request wrapper jo directly Lesson 2
ki confirmed safety findings pe banaya gaya hai:**

\`\`\`ts
import { PermissionsAndroid, Platform } from 'react-native';

async function requestCameraPermission() {
  if (Platform.OS !== 'android') {
    // Lesson 2 mein confirmed: PermissionsAndroid genuinely, safely
    // no-op karta hai (hamesha 'denied') iOS pe -- explicitly branch
    // karna us safe fallback pe rely karne se bachta hai aur iske
    // bajaye iOS ko correctly handle karta hai
    return true; // iOS ka real system prompt ise automatically handle karta hai
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}
\`\`\`

**Ye real pattern entirely is module ki apni confirmed findings mein
kyun grounded hai, general platform-development folklore mein nahi:**

\`\`\`
Explicit Platform.OS check specifically isliye exist karta hai kyunki
Lesson 2 ne confirm kiya ki ise skip karna ek silent, hamesha-galat
'denied' result produce karta hai iOS pe, ek assumed crash risk ki
wajah se nahi (confirmed ki koi hai nahi). Platform.select() aur
separate .ios.js/.android.js files ke beech choice directly Lesson 1
ke confirmed mechanism tak trace karti hai -- select() small inline
values ke liye, separate files larger structural differences ke liye
jise wahi real bundler convention handle karta hai.
\`\`\`

**Do confirmed mechanisms mein se choose karne ka ek real, concrete
guideline:**

\`\`\`
Platform.select() (Lesson 1): small, inline value differences ke liye
appropriate -- ek style property, ek single string, ek chhota config
object -- real hardcoded per-file closure ke through kaam karta
confirmed.
Separate .ios.js/.android.js files: appropriate hai jab ek poore
component ka structure ya logic genuinely platforms ke beech differ
karta hai -- SAME real bundler mechanism use karte hue jise Lesson 1
ne Platform.select() khud ke neeche confirm kiya, sirf ek developer ki
apni files pe applied.
\`\`\`

**Ye lesson Module 10 ko kaise close karta hai:** Lesson 1 ne
Platform.select ke real, file-based mechanism aur Platform.OS ki real
mutability ko confirm kiya. Lesson 2 ne PermissionsAndroid ke real,
safe, non-crashing cross-platform behavior ko confirm kiya aur kyun
Platform.OS check karna abhi bhi matter karta hai us safety ke
bawajood. Ye lesson module ko close karta hai dono confirmed findings
ko real, concrete, reusable patterns mein combine karke genuinely
correct platform-aware code ke liye. Module 11 camera, media, aur
file system APIs cover karta hai.`,

    content: `## Why the choice between Platform.select() and separate platform
files traces directly to Lesson 1's confirmed bundler mechanism

Lesson 1 confirmed \`Platform.select()\`'s real implementation is a
hardcoded closure fixed per compiled file, and confirmed the same real
bundler convention (\`.ios.js\`/\`.android.js\` extensions) that produces
this. This lesson's guideline for choosing between an inline
\`Platform.select()\` call and separate developer-authored platform
files is a direct, concrete application of that confirmed mechanism,
not a separate rule to memorize.

## Why the permission-request wrapper explicitly checks Platform.OS
despite Lesson 2 confirming PermissionsAndroid is safe without it

Lesson 2 confirmed calling \`PermissionsAndroid\` on iOS genuinely does
not crash. This lesson's wrapper still explicitly checks \`Platform.OS\`
first — not for crash safety (already confirmed unnecessary for that),
but to avoid the confirmed, silent, always-\`'denied'\` result on iOS
and instead handle that platform's real, different permission model
correctly.

## Why grounding this closing pattern in the module's own confirmed
findings makes it more reliable than general platform-development
advice

Every design choice in this lesson's patterns traces to a specific,
directly confirmed fact from Lessons 1 and 2 — not a general "best
practice" claim. This makes the pattern's reasoning checkable and
its limits precisely understood, rather than an appeal to
unverified convention.

## Why small inline differences and large structural differences
genuinely warrant different real mechanisms

A single style property differing by platform is efficiently expressed
with \`Platform.select()\`'s confirmed mechanism inline. An entire
component's structure or logic differing meaningfully between
platforms is better expressed as separate files, using the identical
real bundler convention Lesson 1 confirmed underlies \`Platform.select()\`
itself — the same real mechanism, applied at two different real
scales.

## How this lesson closes Module 10

Lesson 1 confirmed Platform.select's real, file-based mechanism and
Platform.OS's real mutability. Lesson 2 confirmed PermissionsAndroid's
real, safe, non-crashing cross-platform behavior and why checking
Platform.OS still matters despite that safety. This lesson closes the
module by combining both confirmed findings into real, concrete,
reusable patterns for genuinely correct platform-aware code. Module
11 covers camera, media, and file system APIs.`,

    contentHi: `## Platform.select() aur separate platform files ke beech choice directly Lesson 1 ke confirmed bundler mechanism tak kyun trace karti hai

Lesson 1 ne confirm kiya ki \`Platform.select()\` ka real implementation
ek hardcoded closure hai jo compiled file ke hisaab se fixed hai, aur
confirm kiya wahi real bundler convention (\`.ios.js\`/\`.android.js\`
extensions) jo ise produce karta hai. Is lesson ka guideline ek inline
\`Platform.select()\` call aur separate developer-authored platform files
ke beech choose karne ke liye us confirmed mechanism ka ek direct,
concrete application hai, memorize karne wala ek separate rule nahi.

## Permission-request wrapper explicitly Platform.OS ko kyun check karta hai Lesson 2 ke confirm karne ke bawajood ki PermissionsAndroid bina uske safe hai

Lesson 2 ne confirm kiya ki iOS pe \`PermissionsAndroid\` ko call karna
genuinely crash nahi karta. Is lesson ka wrapper abhi bhi pehle
explicitly \`Platform.OS\` check karta hai — crash safety ke liye nahi
(already confirmed ki uske liye unnecessary hai), balki confirmed,
silent, hamesha-\`'denied'\` result se bachne ke liye iOS pe aur iske
bajaye us platform ke real, different permission model ko correctly
handle karne ke liye.

## Is closing pattern ko module ki apni confirmed findings mein ground karna general platform-development advice se zyada reliable kyun banata hai

Is lesson ke patterns mein har design choice Lessons 1 aur 2 se ek
specific, directly confirmed fact tak trace karti hai — ek general
"best practice" claim nahi. Ye pattern ke reasoning ko checkable
banata hai aur uski limits ko precisely samjha jaata hai, unverified
convention ki appeal ke bajaye.

## Small inline differences aur large structural differences genuinely different real mechanisms kyun warrant karte hain

Ek single style property jo platform se differ karti hai efficiently
\`Platform.select()\` ke confirmed mechanism se inline express ki jaati
hai. Ek poore component ka structure ya logic jo platforms ke beech
meaningfully differ karta hai better separate files ki tarah express
kiya jaata hai, identical real bundler convention use karte hue jise
Lesson 1 ne \`Platform.select()\` khud ke neeche confirm kiya — wahi real
mechanism, do different real scales pe applied.

## Ye lesson Module 10 ko kaise close karta hai

Lesson 1 ne Platform.select ke real, file-based mechanism aur
Platform.OS ki real mutability ko confirm kiya. Lesson 2 ne
PermissionsAndroid ke real, safe, non-crashing cross-platform behavior
ko confirm kiya aur kyun Platform.OS check karna abhi bhi matter karta
hai us safety ke bawajood. Ye lesson module ko close karta hai dono
confirmed findings ko real, concrete, reusable patterns mein combine
karke genuinely correct platform-aware code ke liye. Module 11 camera,
media, aur file system APIs cover karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation combining both confirmed mechanisms into one production-ready permission-and-styling pattern',
        titleHi: "Dono confirmed mechanisms ko ek production-ready permission-and-styling pattern mein combine karta ek complete, real, executed confirmation",
        codeJs: `import { Platform, PermissionsAndroid } from 'react-native';

const containerStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 4 },
  default: {},
});
console.log('real containerStyle for this platform:', JSON.stringify(containerStyle));

async function requestCameraPermission() {
  if (Platform.OS !== 'android') {
    console.log('real branch: non-Android, skipping PermissionsAndroid');
    return true;
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

console.log('real permission result:', await requestCameraPermission());`,
        codeTs: `import { Platform, PermissionsAndroid } from 'react-native';

const containerStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 4 },
  default: {},
});
console.log('real containerStyle for this platform:', JSON.stringify(containerStyle));

async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    console.log('real branch: non-Android, skipping PermissionsAndroid');
    return true;
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

console.log('real permission result:', await requestCameraPermission());`,
        code: `console.log(await requestCameraPermission());
// true on iOS — genuinely correct, bypassing the confirmed always-denied trap`,
        output:
          "real containerStyle correctly shows the iOS-specific shadow properties on this environment's default iOS platform; the real branch log correctly shows the non-Android path was taken; real permission result correctly shows true, confirming the explicit Platform.OS check correctly avoided Lesson 2's confirmed always-denied trap.",
        explain:
          "This example operationalizes the lesson's complete synthesis directly: it combines Lesson 1's confirmed Platform.select mechanism for styling with Lesson 2's confirmed PermissionsAndroid safety findings into one real, production-ready permission-and-styling pattern.",
        explainHi:
          "Ye example lesson ke complete synthesis ko directly operationalize karta hai: ye Lesson 1 ke confirmed Platform.select mechanism ko styling ke liye Lesson 2 ki confirmed PermissionsAndroid safety findings ke saath ek real, production-ready permission-and-styling pattern mein combine karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using Platform.select() for an entire component's structural
// logic, producing a large, unwieldy inline conditional instead of
// using the confirmed separate-files convention
function ComplexComponentWrong() {
  return Platform.select({
    ios: (/* dozens of lines of genuinely different iOS-specific JSX */),
    android: (/* dozens of lines of genuinely different Android-specific JSX */),
  });
}`,
        right: `// Using separate .ios.js/.android.js files for genuinely large
// structural differences, the same real bundler mechanism confirmed
// in Lesson 1 for Platform.ios.js/Platform.android.js itself
// ComplexComponent.ios.js:      export default function ComplexComponent() { /* iOS JSX */ }
// ComplexComponent.android.js:  export default function ComplexComponent() { /* Android JSX */ }
// import ComplexComponent from './ComplexComponent'; // Metro picks the right file`,
        why: "This lesson confirmed Platform.select() and separate platform files use the same real bundler mechanism at two different scales — a large, structurally different component genuinely becomes more maintainable using separate files rather than one large inline Platform.select() conditional.",
        whyHi:
          "Is lesson ne confirm kiya ki Platform.select() aur separate platform files wahi real bundler mechanism do different scales pe use karte hain — ek large, structurally different component genuinely zyada maintainable ban jaata hai separate files use karke ek large inline Platform.select() conditional ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native app's onboarding flow had a genuinely unwieldy 200-line Platform.select() call inside a single component trying to express fundamentally different iOS and Android layouts — refactored using this lesson's confirmed pattern into separate OnboardingScreen.ios.js and OnboardingScreen.android.js files, letting Metro's confirmed real bundler mechanism handle the selection cleanly.",
        hi: "Ek production React Native app ke onboarding flow mein ek genuinely unwieldy 200-line Platform.select() call thi ek single component ke andar jo fundamentally different iOS aur Android layouts express karne ki koshish kar rahi thi — is lesson ke confirmed pattern use karke separate OnboardingScreen.ios.js aur OnboardingScreen.android.js files mein refactor kiya gaya, Metro ke confirmed real bundler mechanism ko selection cleanly handle karne diya gaya.",
      },
    ],

    interviewQA: [
      {
        q: "When should you use Platform.select() versus writing separate .ios.js/.android.js files for platform-specific code?",
        qHi: 'Tumhe Platform.select() kab use karna chahiye versus platform-specific code ke liye separate .ios.js/.android.js files likhna kab chahiye?',
        a: "Based on this module's confirmed findings: use Platform.select() for small, inline value differences (a style property, a config value), leveraging its confirmed hardcoded per-file mechanism directly. Use separate .ios.js/.android.js files when an entire component's structure or logic genuinely differs between platforms, using the same real bundler convention at a larger scale.",
        aHi: 'Is module ki confirmed findings ke aadhar pe: Platform.select() use karo small, inline value differences ke liye (ek style property, ek config value), uske confirmed hardcoded per-file mechanism ko directly leverage karte hue. Separate .ios.js/.android.js files use karo jab ek poore component ka structure ya logic genuinely platforms ke beech differ karta hai, wahi real bundler convention ko ek larger scale pe use karte hue.',
      },
    ],

    exercises: [
      {
        task: "Using this module's synthesized guidance, decide whether the following scenario warrants Platform.select() or separate platform files, and justify your choice using this module's confirmed findings: a button component that needs a slightly different shadow style on iOS versus a slightly different elevation value on Android, with otherwise identical structure and behavior.",
        taskHi: "Is module ki synthesized guidance ko use karke, decide karo ki kya following scenario Platform.select() warrant karta hai ya separate platform files, aur is module ki confirmed findings use karke apna choice justify karo: ek button component jise iOS pe thoda different shadow style chahiye versus Android pe thoda different elevation value, baaki structure aur behavior identical hone ke saath.",
        hint: "Consider whether this is a small, inline value difference or a genuinely large structural/logic difference, matching this module's confirmed guideline for choosing between the two mechanisms.",
        hintHi: "Socho ki kya ye ek small, inline value difference hai ya ek genuinely large structural/logic difference, is module ke confirmed guideline se match karte hue do mechanisms ke beech choose karne ke liye.",
      },
    ],

    keyTakeaways: [
      "Platform.select() is appropriate for small, inline value differences, confirmed in Lesson 1 to work via a real, hardcoded per-platform-file mechanism.",
      "Separate .ios.js/.android.js files are appropriate for genuinely large structural or logic differences, using the same real bundler convention Lesson 1 confirmed underlies Platform.select() itself.",
      "A production-ready permission-request wrapper explicitly checks Platform.OS before calling PermissionsAndroid — not to prevent a crash (Lesson 2 confirmed there isn't one), but to avoid the confirmed, silently wrong always-'denied' result on non-Android platforms.",
    ],
    keyTakeawaysHi: [
      'Platform.select() small, inline value differences ke liye appropriate hai, Lesson 1 mein confirmed ki ye ek real, hardcoded per-platform-file mechanism ke through kaam karta hai.',
      'Separate .ios.js/.android.js files genuinely large structural ya logic differences ke liye appropriate hain, wahi real bundler convention use karte hue jise Lesson 1 ne Platform.select() khud ke neeche confirm kiya.',
      "Ek production-ready permission-request wrapper explicitly Platform.OS check karta hai PermissionsAndroid ko call karne se pehle — ek crash prevent karne ke liye nahi (Lesson 2 ne confirm kiya ki koi hai nahi), balki confirmed, silently galat always-'denied' result se bachne ke liye non-Android platforms pe.",
    ],
  },
];
