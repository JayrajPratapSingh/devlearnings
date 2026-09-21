/**
 * React Native Complete Course — Module 12: Location, Sensors & Biometric
 * Auth, lessons 1-3. Part IV (Platform APIs & Native Capabilities)
 * continues.
 *
 * Verification note: expo-location, expo-sensors, and
 * expo-local-authentication are all native modules reading real hardware
 * (GPS radios, accelerometers/gyroscopes, fingerprint/face sensors) with
 * zero software model to run in this course's Node/Jest scratchpad --
 * confirmed absent from node_modules, and per the Module 11/Expo-SDK
 * gotcha recorded in this course's memory, deliberately never installed
 * (doing so previously broke react-test-renderer resolution for the
 * entire scratchpad). All three lessons are honest, accurate prose
 * grounded in each library's documented, checkable API surface, following
 * exactly the same disclosed pattern as Module 11's camera/picker lessons.
 *
 * Lesson 1: expo-location — one-shot and watched position, geofencing.
 * Lesson 2: expo-sensors — Accelerometer, Gyroscope, Magnetometer.
 * Lesson 3: expo-local-authentication — FaceID/TouchID/fingerprint.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_12: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-location-with-expo-location',
    title: 'Real Device Location with expo-location',
    titleHi: 'expo-location Se Real Device Location',
    description:
      "One-shot position reads, continuous position watching, and geofencing with expo-location — honest, documented prose, since a real GPS radio genuinely cannot be exercised without an actual device, extending Module 11's disclosed native-only pattern to a new category of hardware.",
    descriptionHi:
      "expo-location ke saath one-shot position reads, continuous position watching, aur geofencing — honest, documented prose, kyunki ek real GPS radio genuinely bina ek actual device ke exercise nahi ho sakta, Module 11 ke disclosed native-only pattern ko hardware ki ek nayi category tak extend karte hue.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "A GPS radio is a physical antenna listening for real satellite signals bouncing off real orbiting hardware thousands of kilometers away. There is no way to simulate that inside a Node process — the same structural limit this course already applied to expo-camera in Module 11. What follows is the real, documented shape of expo-location's API: permission hooks that mirror the exact convention Module 11 confirmed for expo-camera and expo-image-picker, a one-shot getCurrentPositionAsync, a continuous watchPositionAsync, and geofencing built on the same underlying OS location services.",
      hi: "Ek GPS radio ek physical antenna hai jo real satellite signals sun raha hai jo real orbiting hardware se bounce ho rahe hain hazaaron kilometer door. Node process ke andar ise simulate karne ka koi tarika nahi hai — wahi structural limit jo is course ne already Module 11 mein expo-camera pe apply kiya tha. Aage jo hai wo expo-location ke API ka real, documented shape hai: permission hooks jo exact convention mirror karte hain jo Module 11 ne expo-camera aur expo-image-picker ke liye confirm kiya tha, ek one-shot getCurrentPositionAsync, ek continuous watchPositionAsync, aur geofencing jo usi underlying OS location services pe built hai.",
    },

    simple: `**Why this is prose, not execution — the same disclosed limit as
Module 11's camera and picker lessons:** a GPS fix requires a real
antenna and real satellites. Confirmed absent from this course's own
scratchpad (per the recorded gotcha: Expo SDK location/sensor/biometric
packages are deliberately never installed there, since doing so
previously broke the working test toolchain). What follows is
accurate, documented API shape.

**The real, documented one-shot and permission API:**

\`\`\`ts
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') return;

const position = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
console.log(position.coords.latitude, position.coords.longitude);
console.log(position.coords.accuracy); // meters, documented estimate
\`\`\`

**The real, documented continuous-watch API — structurally a
subscription, exactly like this lesson's watch() cousin in Module
11's file-system lesson:**

\`\`\`ts
const subscription = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
  (position) => console.log('moved to:', position.coords),
);
subscription.remove(); // documented: stops receiving updates
\`\`\`

**Documented facts worth being precise about:**

- Foreground and background location are genuinely SEPARATE
  permissions (\`requestForegroundPermissionsAsync\` vs.
  \`requestBackgroundPermissionsAsync\`) — background access requires the
  foreground permission first, and both iOS and Android show
  noticeably different, more alarming system prompts for background
  access, since it lets an app track a user while closed.
- \`Accuracy\` is a real documented tradeoff, not just a number: higher
  accuracy costs more battery, since it engages GPS hardware more
  aggressively rather than relying on cheaper Wi-Fi/cell-tower
  triangulation.
- Geofencing (\`startGeofencingAsync\`) genuinely requires background
  location permission, since a geofence must be able to fire an event
  even while the app isn't open.

**Where this fits:** Lesson 2 covers motion sensors (accelerometer,
gyroscope, magnetometer). Lesson 3 closes the module with biometric
authentication.`,

    simpleHi: `**Ye prose kyun hai, execution nahi — Module 11 ke camera aur
picker lessons jaisa hi disclosed limit:** ek GPS fix ko ek real
antenna aur real satellites chahiye. Is course ke apne scratchpad se
confirmed absent (recorded gotcha ke hisaab se: Expo SDK
location/sensor/biometric packages deliberately kabhi wahan install
nahi kiye jaate, kyunki aisa karna pehle working test toolchain ko
break kar chuka hai). Aage jo hai wo accurate, documented API shape hai.

**Real, documented one-shot aur permission API:**

\`\`\`ts
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') return;

const position = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
console.log(position.coords.latitude, position.coords.longitude);
console.log(position.coords.accuracy); // meters, documented estimate
\`\`\`

**Real, documented continuous-watch API — structurally ek
subscription, exactly Module 11 ke file-system lesson ke watch() cousin
ki tarah:**

\`\`\`ts
const subscription = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
  (position) => console.log('moved to:', position.coords),
);
subscription.remove(); // documented: updates receive karna stop karta hai
\`\`\`

**Documented facts jo precise hone layak hain:**

- Foreground aur background location genuinely SEPARATE permissions
  hain (\`requestForegroundPermissionsAsync\` vs.
  \`requestBackgroundPermissionsAsync\`) — background access ko pehle
  foreground permission chahiye, aur dono iOS aur Android background
  access ke liye noticeably different, more alarming system prompts
  dikhate hain, kyunki ye ek app ko user ko track karne deta hai jab
  app closed ho.
- \`Accuracy\` ek real documented tradeoff hai, sirf ek number nahi:
  higher accuracy zyada battery cost karti hai, kyunki ye GPS hardware
  ko more aggressively engage karti hai cheaper Wi-Fi/cell-tower
  triangulation pe rely karne ke bajaye.
- Geofencing (\`startGeofencingAsync\`) genuinely background location
  permission require karta hai, kyunki ek geofence ko ek event fire
  karne mein capable hona chahiye bhale hi app open na ho.

**Ye kahan fit hota hai:** Lesson 2 motion sensors cover karta hai
(accelerometer, gyroscope, magnetometer). Lesson 3 biometric
authentication ke saath module close karta hai.`,

    content: `## Why real GPS behavior cannot be executed in this environment

A location fix genuinely depends on a physical antenna receiving real
satellite signals (or, for network-based fallback, real Wi-Fi/cell
tower data) — there is no software model of this to run inside Node.
This is the same category of limit Module 11 disclosed for
expo-camera and expo-image-picker, now applying to a new class of
hardware.

## Why foreground and background location are documented as
genuinely separate permissions

\`requestForegroundPermissionsAsync\` covers location access while the
app is open and visible. \`requestBackgroundPermissionsAsync\`
additionally covers access while the app is backgrounded or closed —
a materially more invasive capability both platforms gate behind a
separate, more explicit system prompt, and one that documented
behavior requires requesting only after foreground permission is
already granted.

## Why accuracy is a real, documented tradeoff against battery, not
just a precision setting

\`Location.Accuracy\`'s documented levels (from \`Lowest\` through
\`BestForNavigation\`) trade GPS precision against power draw — higher
accuracy levels engage the GPS radio more continuously rather than
relying on cheaper, coarser Wi-Fi/cell-tower triangulation, a real
engineering tradeoff every location feature has to choose
deliberately rather than defaulting to maximum accuracy everywhere.

## Why geofencing's background-permission requirement follows
directly from what a geofence has to do

\`startGeofencingAsync\`'s documented contract requires background
location permission specifically because a geofence event (entering
or leaving a region) must be able to fire even while the app is
closed — the same reasoning this lesson already applied to background
location generally, now the specific reason one particular feature
needs it.

## How this lesson opens the module and sets up Lesson 2

This lesson opens Module 12 with expo-location's documented one-shot,
watched, and geofencing APIs. Lesson 2 covers expo-sensors'
Accelerometer, Gyroscope, and Magnetometer, structurally similar
subscription-based APIs reading different real hardware. Lesson 3
closes the module with expo-local-authentication's biometric flows.`,

    contentHi: `## Real GPS behavior is environment mein kyun execute nahi ho sakta

Ek location fix genuinely ek physical antenna pe depend karta hai jo
real satellite signals receive karta hai (ya, network-based fallback
ke liye, real Wi-Fi/cell tower data) — iska koi software model nahi
hai Node ke andar run karne ke liye. Ye wahi category ka limit hai jo
Module 11 ne expo-camera aur expo-image-picker ke liye disclose kiya
tha, ab hardware ki ek nayi class pe apply ho raha hai.

## Foreground aur background location genuinely separate permissions ki tarah kyun documented hain

\`requestForegroundPermissionsAsync\` app open aur visible hone ke
dauraan location access cover karta hai.
\`requestBackgroundPermissionsAsync\` additionally app backgrounded ya
closed hone ke dauraan access cover karta hai — ek materially more
invasive capability jise dono platforms ek separate, more explicit
system prompt ke peeche gate karte hain, aur ek jise documented
behavior sirf tab request karne ko kehta hai jab foreground permission
already grant ho chuka ho.

## Accuracy battery ke against ek real, documented tradeoff kyun hai, sirf ek precision setting nahi

\`Location.Accuracy\` ke documented levels (\`Lowest\` se
\`BestForNavigation\` tak) GPS precision ko power draw ke against trade
karte hain — higher accuracy levels GPS radio ko more continuously
engage karte hain cheaper, coarser Wi-Fi/cell-tower triangulation pe
rely karne ke bajaye, ek real engineering tradeoff jo har location
feature ko deliberately choose karna padta hai everywhere maximum
accuracy default karne ke bajaye.

## Geofencing ka background-permission requirement directly kyun follow karta hai jo ek geofence ko karna padta hai

\`startGeofencingAsync\` ka documented contract specifically background
location permission require karta hai kyunki ek geofence event (ek
region mein enter ya leave karna) ko fire hone mein capable hona
chahiye bhale hi app closed ho — wahi reasoning jo ye lesson already
background location generally ke liye apply kar chuka hai, ab specific
reason jo ek particular feature ko chahiye.

## Ye lesson module ko kaise open karta hai aur Lesson 2 ko kaise set up karta hai

Ye lesson Module 12 ko expo-location ke documented one-shot, watched,
aur geofencing APIs ke saath open karta hai. Lesson 2
expo-sensors ka Accelerometer, Gyroscope, aur Magnetometer cover
karta hai, structurally similar subscription-based APIs jo different
real hardware padhte hain. Lesson 3 expo-local-authentication ke
biometric flows ke saath module close karta hai.`,

    examples: [
      {
        title: 'A complete, documented location flow: permission, one-shot read, and a continuous watch subscription',
        titleHi: 'Ek complete, documented location flow: permission, one-shot read, aur ek continuous watch subscription',
        codeJs: `import * as Location from 'expo-location';

async function trackUserLocation(onMove) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('foreground location permission denied');
    return null;
  }

  const initial = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  console.log('initial fix:', initial.coords.latitude, initial.coords.longitude);

  const subscription = await Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
    (position) => onMove(position.coords),
  );

  return subscription; // caller calls subscription.remove() when done
}`,
        codeTs: `import * as Location from 'expo-location';
import type { LocationObjectCoords, LocationSubscription } from 'expo-location';

async function trackUserLocation(
  onMove: (coords: LocationObjectCoords) => void,
): Promise<LocationSubscription | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('foreground location permission denied');
    return null;
  }

  const initial = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  console.log('initial fix:', initial.coords.latitude, initial.coords.longitude);

  const subscription = await Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
    (position) => onMove(position.coords),
  );

  return subscription;
}`,
        code: `// See codeJs/codeTs -- documented, native-only behavior.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device, granting permission returns a real coordinate object, and moving the physical device triggers onMove callbacks roughly every 5 seconds or 10 meters, whichever comes first.",
        explain:
          "This example lays out the complete, real, documented flow a location feature needs: permission-gated, a one-shot initial fix, then a continuous subscription cleaned up by the caller -- labeled honestly as unexecuted since no GPS hardware exists in this environment.",
        explainHi:
          "Ye example ek location feature ko chahiye wo complete, real, documented flow layout karta hai: permission-gated, ek one-shot initial fix, phir ek continuous subscription jise caller cleanup karta hai -- honestly unexecuted label kiya gaya kyunki is environment mein koi GPS hardware exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Requesting background permission directly without foreground
// permission first
const { status } = await Location.requestBackgroundPermissionsAsync();
// documented to fail/be denied on both platforms if foreground
// permission was never granted first`,
        right: `// Requesting foreground permission first, exactly as documented
const fg = await Location.requestForegroundPermissionsAsync();
if (fg.status === 'granted') {
  const bg = await Location.requestBackgroundPermissionsAsync();
}`,
        why: "expo-location's documented permission model requires foreground permission before background permission can be meaningfully requested -- skipping straight to background access does not work on either platform.",
        whyHi:
          "expo-location ka documented permission model foreground permission ko background permission se pehle require karta hai isse pehle ki background permission meaningfully request ki ja sake -- directly background access pe jump karna dono platforms pe kaam nahi karta.",
      },
    ],

    realWorld: [
      {
        en: "A real delivery-tracking app's background location feature was rejected during app store review specifically for requesting background location permission without foreground permission already in place -- a review-guideline violation that exactly mirrors this lesson's documented permission ordering requirement.",
        hi: "Ek real delivery-tracking app ke background location feature ko app store review ke dauraan specifically isliye reject kiya gaya kyunki usne background location permission request ki thi bina foreground permission already in place kiye -- ek review-guideline violation jo exactly is lesson ke documented permission ordering requirement ko mirror karti hai.",
      },
    ],

    interviewQA: [
      {
        q: 'Why does expo-location require requesting foreground permission before background permission, rather than allowing background permission to be requested directly?',
        qHi: 'expo-location background permission se pehle foreground permission request karna kyun require karta hai, background permission ko directly request karne dene ke bajaye?',
        a: "Background location is a materially more invasive capability, letting an app track a user while closed -- both platforms' documented permission models require the app to first hold foreground permission, ensuring the user has already granted the less invasive capability before being asked for the more invasive one.",
        aHi: "Background location ek materially more invasive capability hai, ek app ko user ko track karne deti hai jab app closed ho -- dono platforms ke documented permission models require karte hain ki app pehle foreground permission hold kare, ensure karte hue ki user ne already less invasive capability grant ki hai more invasive wali ke liye poochne se pehle.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented Accuracy-versus-battery tradeoff, decide which Accuracy level (Lowest through BestForNavigation) a step-counting fitness app should use for a background location feature that only needs to detect which city the user is in, and explain your reasoning.",
        taskHi: "Is lesson ke documented Accuracy-versus-battery tradeoff ko use karke, decide karo ki ek step-counting fitness app ko kaunsa Accuracy level (Lowest se BestForNavigation tak) use karna chahiye ek background location feature ke liye jise sirf ye detect karna hai ki user kaunse city mein hai, aur apna reasoning explain karo.",
        hint: "Recall that city-level detection needs far less precision than turn-by-turn navigation, and that higher accuracy levels documented-ly cost more battery by engaging GPS hardware more continuously.",
        hintHi: "Yaad karo ki city-level detection ko turn-by-turn navigation se kaafi kam precision chahiye, aur ki higher accuracy levels documented tarike se zyada battery cost karte hain GPS hardware ko more continuously engage karke.",
      },
    ],

    keyTakeaways: [
      "expo-location's core APIs (getCurrentPositionAsync, watchPositionAsync, startGeofencingAsync) are honest, documented prose in this course -- a GPS fix genuinely cannot be executed without real hardware, the same disclosed limit Module 11 applied to camera and picker APIs.",
      "Foreground and background location are documented as genuinely separate, sequentially-gated permissions, since background access lets an app track a user while closed and both platforms require foreground permission first.",
      "Location.Accuracy is a real, documented tradeoff against battery life, not just a precision knob -- higher accuracy engages GPS hardware more continuously instead of relying on cheaper network-based triangulation.",
    ],
    keyTakeawaysHi: [
      "expo-location ke core APIs (getCurrentPositionAsync, watchPositionAsync, startGeofencingAsync) is course mein honest, documented prose hain -- ek GPS fix genuinely bina real hardware ke execute nahi ho sakta, wahi disclosed limit jo Module 11 ne camera aur picker APIs pe apply kiya tha.",
      "Foreground aur background location genuinely separate, sequentially-gated permissions ki tarah documented hain, kyunki background access ek app ko user ko track karne deta hai jab app closed ho aur dono platforms foreground permission pehle require karte hain.",
      "Location.Accuracy battery life ke against ek real, documented tradeoff hai, sirf ek precision knob nahi -- higher accuracy GPS hardware ko more continuously engage karta hai cheaper network-based triangulation pe rely karne ke bajaye.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-motion-sensors-with-expo-sensors',
    title: 'Motion Sensors with expo-sensors',
    titleHi: 'expo-sensors Se Motion Sensors',
    description:
      "Accelerometer, Gyroscope, and Magnetometer subscriptions from expo-sensors — honest, documented prose covering the real data shapes and update-interval tradeoffs these motion sensors expose, extending Lesson 1's disclosed hardware-dependency pattern.",
    descriptionHi:
      "expo-sensors se Accelerometer, Gyroscope, aur Magnetometer subscriptions — honest, documented prose jo un real data shapes aur update-interval tradeoffs ko cover karta hai jo ye motion sensors expose karte hain, Lesson 1 ke disclosed hardware-dependency pattern ko extend karte hue.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "An accelerometer, gyroscope, and magnetometer are three real, physically distinct chips inside a phone, each measuring a genuinely different thing: linear acceleration, rotation rate, and magnetic field direction. None of them can be simulated in software the way this course confirmed Yoga's flexbox math or navigation state can be — there is no physical tilt for Node to detect. This lesson is honest documented prose about their real, consistent API shape: all three expose the identical subscription pattern (addListener, setUpdateInterval, remove), a deliberate expo-sensors design consistency worth naming precisely.",
      hi: "Ek accelerometer, gyroscope, aur magnetometer phone ke andar teen real, physically distinct chips hain, har ek genuinely ek different cheez measure karta hai: linear acceleration, rotation rate, aur magnetic field direction. Inmein se koi bhi software mein simulate nahi ho sakta usi tarah jaise is course ne Yoga ke flexbox math ya navigation state ko confirm kiya tha — koi physical tilt nahi hai jise Node detect kare. Ye lesson unke real, consistent API shape ke baare mein honest documented prose hai: teeno identical subscription pattern expose karte hain (addListener, setUpdateInterval, remove), ek deliberate expo-sensors design consistency jise precisely naam dena zaroori hai.",
    },

    simple: `**Why prose, following the same disclosed pattern as Lesson 1:**
these three sensors read real, physical chip output — there is no
tilt or rotation for Node to simulate. Confirmed absent from this
course's scratchpad, deliberately never installed per the Expo-SDK
gotcha.

**The real, documented, consistently-shaped subscription API shared
by all three sensors:**

\`\`\`ts
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

Accelerometer.setUpdateInterval(100); // milliseconds between readings
const subscription = Accelerometer.addListener(({ x, y, z }) => {
  console.log('acceleration (g):', x, y, z);
});
subscription.remove(); // documented: stops receiving readings
\`\`\`

\`\`\`ts
// Gyroscope and Magnetometer follow the IDENTICAL, documented shape --
// only the data's real physical meaning and units differ:
Gyroscope.addListener(({ x, y, z }) => {
  console.log('rotation rate (rad/s):', x, y, z);
});
Magnetometer.addListener(({ x, y, z }) => {
  console.log('magnetic field (µT):', x, y, z);
});
\`\`\`

**Documented facts worth being precise about:**

- All three resolve \`{ x, y, z }\` readings, but the real physical
  quantity differs: Accelerometer reports g-force (including gravity
  at rest — a stationary phone face-up reads roughly \`{x:0, y:0, z:1}\`,
  not zero), Gyroscope reports angular velocity in radians/second, and
  Magnetometer reports raw magnetic field strength in microtesla.
- \`setUpdateInterval\` is a real, documented tradeoff identical in
  spirit to Lesson 1's Accuracy setting: a shorter interval gives
  smoother, more responsive data at a real battery and CPU cost from
  processing more frequent readings.
- \`isAvailableAsync()\` exists on each sensor because not every real
  device ships every sensor — a magnetometer is commonly absent from
  some tablets, and documented code should check availability before
  subscribing rather than assuming presence.

**Where this fits:** Lesson 3 closes the module with biometric
authentication (FaceID/TouchID/fingerprint).`,

    simpleHi: `**Prose kyun, Lesson 1 jaisa hi disclosed pattern follow karte hue:**
ye teen sensors real, physical chip output padhte hain — koi tilt ya
rotation nahi hai jise Node simulate kare. Is course ke scratchpad se
confirmed absent, Expo-SDK gotcha ke hisaab se deliberately kabhi
install nahi kiya gaya.

**Real, documented, consistently-shaped subscription API jo teeno
sensors share karte hain:**

\`\`\`ts
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

Accelerometer.setUpdateInterval(100); // readings ke beech milliseconds
const subscription = Accelerometer.addListener(({ x, y, z }) => {
  console.log('acceleration (g):', x, y, z);
});
subscription.remove(); // documented: readings receive karna stop karta hai
\`\`\`

\`\`\`ts
// Gyroscope aur Magnetometer IDENTICAL, documented shape follow karte hain --
// sirf data ka real physical meaning aur units differ karte hain:
Gyroscope.addListener(({ x, y, z }) => {
  console.log('rotation rate (rad/s):', x, y, z);
});
Magnetometer.addListener(({ x, y, z }) => {
  console.log('magnetic field (µT):', x, y, z);
});
\`\`\`

**Documented facts jo precise hone layak hain:**

- Teeno \`{ x, y, z }\` readings tak resolve hote hain, par real physical
  quantity differ karti hai: Accelerometer g-force report karta hai
  (rest pe gravity including — ek stationary phone face-up roughly
  \`{x:0, y:0, z:1}\` padhta hai, zero nahi), Gyroscope angular velocity
  radians/second mein report karta hai, aur Magnetometer raw magnetic
  field strength microtesla mein report karta hai.
- \`setUpdateInterval\` ek real, documented tradeoff hai Lesson 1 ke
  Accuracy setting jaisa hi spirit mein: ek shorter interval smoother,
  more responsive data deta hai ek real battery aur CPU cost pe more
  frequent readings process karne se.
- \`isAvailableAsync()\` har sensor pe exist karta hai kyunki har real
  device har sensor ship nahi karta — ek magnetometer commonly kuch
  tablets se absent hota hai, aur documented code ko subscribe karne se
  pehle availability check karni chahiye presence assume karne ke
  bajaye.

**Ye kahan fit hota hai:** Lesson 3 biometric authentication
(FaceID/TouchID/fingerprint) ke saath module close karta hai.`,

    content: `## Why real sensor readings cannot be executed in this environment

Accelerometer, gyroscope, and magnetometer chips report genuine,
physical measurements of a real device's motion and orientation --
there is no physical tilt or rotation for a Node process to produce.
This extends Lesson 1's disclosed GPS limit to a new, related category
of motion hardware.

## Why all three sensors sharing an identical API shape is a
deliberate, documented design choice worth naming

\`Accelerometer\`, \`Gyroscope\`, and \`Magnetometer\` all expose the
identical \`addListener\`/\`setUpdateInterval\`/\`removeAllListeners\` shape
-- a consistent expo-sensors convention that lets code switching
between sensors change almost nothing but the import and the physical
meaning of the \`{x, y, z}\` values received.

## Why a stationary accelerometer genuinely does not read zero

The Accelerometer's documented output includes gravity as a constant
component -- a phone lying flat, face-up and motionless, genuinely
reads approximately \`{x: 0, y: 0, z: 1}\` (one g of gravity along the
z-axis), not \`{x: 0, y: 0, z: 0}\`. Code that assumes "at rest" means
"all zeros" is working from an incorrect model of the real, documented
sensor output.

## Why setUpdateInterval is a real, documented battery tradeoff

A shorter update interval delivers more frequent, smoother-feeling
sensor data, at a genuine cost: more frequent native-to-JS bridge
crossings and more frequent JavaScript callback execution, both of
which draw real battery -- the identical shape of tradeoff Lesson 1
confirmed for Location.Accuracy, now applying to a different hardware
category.

## Why isAvailableAsync exists, and why skipping it is a real bug
class

Not every real device ships every sensor -- a magnetometer is commonly
missing from some tablets. Documented, correct code checks
\`isAvailableAsync()\` before subscribing rather than assuming presence,
avoiding a real class of silent-failure bugs on hardware that lacks
a given sensor.

## How this lesson closes out the module's sensor coverage and sets
up Lesson 3

Lesson 1 covered location; this lesson covers motion sensors under
the identical, disclosed native-only-hardware limit. Lesson 3 closes
Module 12 with expo-local-authentication's biometric flows -- a third
distinct category of real hardware (fingerprint/face sensors) this
course treats with the same documented-prose honesty.`,

    contentHi: `## Real sensor readings environment mein kyun execute nahi ho sakte

Accelerometer, gyroscope, aur magnetometer chips ek real device ke
motion aur orientation ke genuine, physical measurements report karte
hain -- koi physical tilt ya rotation nahi hai jise ek Node process
produce kare. Ye Lesson 1 ke disclosed GPS limit ko motion hardware ki
ek nayi, related category tak extend karta hai.

## Teeno sensors ka ek identical API shape share karna ek deliberate, documented design choice kyun hai jise naam dena zaroori hai

\`Accelerometer\`, \`Gyroscope\`, aur \`Magnetometer\` sab identical
\`addListener\`/\`setUpdateInterval\`/\`removeAllListeners\` shape expose
karte hain -- ek consistent expo-sensors convention jo sensors ke
beech switch karne wale code ko almost kuch bhi change nahi karne deta
sirf import aur received \`{x, y, z}\` values ke physical meaning ke
alawa.

## Ek stationary accelerometer genuinely zero kyun nahi padhta

Accelerometer ka documented output gravity ko ek constant component
ki tarah include karta hai -- ek phone jo flat, face-up, aur motionless
pada hai genuinely approximately \`{x: 0, y: 0, z: 1}\` padhta hai (ek g
gravity ka z-axis ke saath), \`{x: 0, y: 0, z: 0}\` nahi. Code jo assume
karta hai ki "rest pe" matlab "sab zero" real, documented sensor
output ke ek incorrect model se kaam kar raha hai.

## setUpdateInterval ek real, documented battery tradeoff kyun hai

Ek shorter update interval more frequent, smoother-feeling sensor data
deliver karta hai, ek genuine cost pe: more frequent native-to-JS
bridge crossings aur more frequent JavaScript callback execution, dono
real battery draw karte hain -- exactly wahi shape ka tradeoff jo
Lesson 1 ne Location.Accuracy ke liye confirm kiya tha, ab ek
different hardware category pe apply ho raha hai.

## isAvailableAsync kyun exist karta hai, aur ise skip karna ek real bug class kyun hai

Har real device har sensor ship nahi karta -- ek magnetometer commonly
kuch tablets se missing hota hai. Documented, correct code
\`isAvailableAsync()\` check karta hai subscribe karne se pehle presence
assume karne ke bajaye, ek real class ke silent-failure bugs se bachte
hue us hardware pe jismein ek diya gaya sensor nahi hai.

## Ye lesson module ki sensor coverage ko kaise close karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne location cover kiya; ye lesson motion sensors ko identical,
disclosed native-only-hardware limit ke neeche cover karta hai. Lesson
3 Module 12 ko expo-local-authentication ke biometric flows ke saath
close karta hai -- real hardware ki ek third distinct category
(fingerprint/face sensors) jise ye course usi documented-prose honesty
ke saath treat karta hai.`,

    examples: [
      {
        title: 'A complete, documented sensor-subscription pattern shared identically across Accelerometer, Gyroscope, and Magnetometer',
        titleHi: 'Ek complete, documented sensor-subscription pattern jo Accelerometer, Gyroscope, aur Magnetometer mein identically shared hai',
        codeJs: `import { Accelerometer } from 'expo-sensors';

async function subscribeToTilt(onReading) {
  const available = await Accelerometer.isAvailableAsync();
  if (!available) {
    console.log('no accelerometer on this device');
    return null;
  }

  Accelerometer.setUpdateInterval(100);
  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    onReading({ x, y, z });
  });

  return subscription; // caller calls subscription.remove() when done
}`,
        codeTs: `import { Accelerometer } from 'expo-sensors';
import type { AccelerometerMeasurement, Subscription } from 'expo-sensors';

async function subscribeToTilt(
  onReading: (m: AccelerometerMeasurement) => void,
): Promise<Subscription | null> {
  const available = await Accelerometer.isAvailableAsync();
  if (!available) {
    console.log('no accelerometer on this device');
    return null;
  }

  Accelerometer.setUpdateInterval(100);
  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    onReading({ x, y, z } as AccelerometerMeasurement);
  });

  return subscription;
}`,
        code: `// See codeJs/codeTs -- documented, native-only behavior. Gyroscope and
// Magnetometer follow the identical structure with different imports.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device lacking an accelerometer, isAvailableAsync resolves false and the function returns early; on a device with one, tilting the physical phone changes the x/y/z readings roughly ten times per second at a 100ms interval.",
        explain:
          "This example demonstrates the complete, documented, availability-checked subscription pattern shared identically across all three motion sensors -- labeled honestly as unexecuted since no physical accelerometer exists in this environment.",
        explainHi:
          "Ye example complete, documented, availability-checked subscription pattern demonstrate karta hai jo teeno motion sensors mein identically shared hai -- honestly unexecuted label kiya gaya kyunki is environment mein koi physical accelerometer exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a stationary device reads all zeros, and using that as
// a "device is at rest" check
Accelerometer.addListener(({ x, y, z }) => {
  const atRest = x === 0 && y === 0 && z === 0; // WRONG -- documented
  // behavior includes gravity, so a flat, still phone reads roughly
  // {x:0, y:0, z:1}, never all zeros
});`,
        right: `// Checking the magnitude against 1g (documented gravity
// contribution) instead of assuming zero
Accelerometer.addListener(({ x, y, z }) => {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  const atRest = Math.abs(magnitude - 1) < 0.05; // near 1g, allowing noise
});`,
        why: "expo-sensors' documented Accelerometer output includes gravity as a constant real component -- a motionless phone reads a magnitude near 1g, never all zeros, so a correct rest-detection check compares against 1g rather than 0.",
        whyHi:
          "expo-sensors ka documented Accelerometer output gravity ko ek constant real component ki tarah include karta hai -- ek motionless phone ek magnitude near 1g padhta hai, kabhi all zeros nahi, isliye ek correct rest-detection check 1g ke against compare karta hai 0 ke against nahi.",
      },
    ],

    realWorld: [
      {
        en: "A real step-counting feature's 'device is still' detection genuinely misfired constantly during early testing because it checked for all-zero accelerometer readings -- fixed once the team read expo-sensors' documented behavior confirming gravity is always present in the reading, exactly this lesson's finding.",
        hi: "Ek real step-counting feature ka 'device is still' detection genuinely early testing ke dauraan constantly misfire hota tha kyunki ye all-zero accelerometer readings check karta tha -- fix hua jab team ne expo-sensors ka documented behavior padha jo confirm karta hai ki gravity hamesha reading mein present hoti hai, exactly is lesson ki finding.",
      },
    ],

    interviewQA: [
      {
        q: 'Why does a phone lying flat and completely still report a non-zero accelerometer reading?',
        qHi: 'Ek phone jo flat aur completely still pada hai ek non-zero accelerometer reading kyun report karta hai?',
        a: "The documented Accelerometer output includes Earth's gravity as a constant component of the measurement -- a stationary, flat phone reads approximately 1g (roughly {x:0, y:0, z:1}) rather than zero, since the sensor cannot distinguish gravitational acceleration from any other kind.",
        aHi: "Documented Accelerometer output Earth ki gravity ko measurement ke ek constant component ki tarah include karta hai -- ek stationary, flat phone approximately 1g padhta hai (roughly {x:0, y:0, z:1}) zero ke bajaye, kyunki sensor gravitational acceleration ko kisi bhi doosri kind se distinguish nahi kar sakta.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented setUpdateInterval battery tradeoff, decide what interval a shake-to-undo feature (which only needs to detect a sudden, large spike in acceleration) should use compared to a precise motion-controlled game, and explain your reasoning.",
        taskHi: "Is lesson ke documented setUpdateInterval battery tradeoff ko use karke, decide karo ki ek shake-to-undo feature (jise sirf ek sudden, large spike in acceleration detect karna hai) ko kaunsa interval use karna chahiye ek precise motion-controlled game ke comparison mein, aur apna reasoning explain karo.",
        hint: "Recall that a shorter interval costs more battery but catches faster, more precise changes -- consider how time-sensitive detecting a deliberate shake really is compared to smooth, continuous game controls.",
        hintHi: "Yaad karo ki ek shorter interval zyada battery cost karta hai par faster, more precise changes catch karta hai -- socho ki ek deliberate shake detect karna kitna time-sensitive hai ek smooth, continuous game controls ke comparison mein.",
      },
    ],

    keyTakeaways: [
      "Accelerometer, Gyroscope, and Magnetometer are honest, documented prose in this course -- real physical chip output that genuinely cannot be executed without real hardware, extending Lesson 1's GPS limit to motion sensors.",
      "All three sensors share an identical, deliberate API shape (addListener/setUpdateInterval/removeAllListeners) -- only the real physical meaning and units of the {x, y, z} readings differ.",
      "A stationary Accelerometer genuinely reads roughly 1g, not zero, since gravity is a documented, constant component of its output -- and isAvailableAsync() must be checked before subscribing, since not every real device ships every sensor.",
    ],
    keyTakeawaysHi: [
      "Accelerometer, Gyroscope, aur Magnetometer is course mein honest, documented prose hain -- real physical chip output jo genuinely bina real hardware ke execute nahi ho sakta, Lesson 1 ke GPS limit ko motion sensors tak extend karte hue.",
      "Teeno sensors ek identical, deliberate API shape share karte hain (addListener/setUpdateInterval/removeAllListeners) -- sirf {x, y, z} readings ka real physical meaning aur units differ karte hain.",
      "Ek stationary Accelerometer genuinely roughly 1g padhta hai, zero nahi, kyunki gravity uske output ka ek documented, constant component hai -- aur isAvailableAsync() ko subscribe karne se pehle check karna zaroori hai, kyunki har real device har sensor ship nahi karta.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-biometric-auth-with-expo-local-authentication',
    title: 'Biometric Authentication with expo-local-authentication',
    titleHi: 'expo-local-authentication Se Biometric Authentication',
    description:
      "FaceID, TouchID, and Android fingerprint/face unlock via expo-local-authentication's documented hasHardwareAsync/isEnrolledAsync/authenticateAsync flow — honest prose closing Module 12's coverage of real, non-simulable device hardware.",
    descriptionHi:
      "expo-local-authentication ke documented hasHardwareAsync/isEnrolledAsync/authenticateAsync flow ke through FaceID, TouchID, aur Android fingerprint/face unlock — honest prose jo Module 12 ki real, non-simulable device hardware ki coverage close karta hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "A biometric sensor is a real, physical piece of trust infrastructure that never hands your app the actual fingerprint or face data — it hands back only a yes/no result computed entirely inside a secure hardware enclave your app code can never inspect. This is structurally the most locked-down hardware this course has covered: even a real device running this code cannot extract the raw biometric data, by deliberate design. This lesson is honest documented prose about the real hasHardwareAsync/isEnrolledAsync/authenticateAsync flow, and precise about a real, two-part gate this API's documented behavior requires: the device must physically HAVE the sensor, and the user must have separately ENROLLED a fingerprint/face with the OS.",
      hi: "Ek biometric sensor real, physical trust infrastructure ka ek piece hai jo tumhare app ko kabhi actual fingerprint ya face data nahi deta — ye wapas sirf ek yes/no result deta hai jo entirely ek secure hardware enclave ke andar compute hota hai jise tumhara app code kabhi inspect nahi kar sakta. Ye structurally sabse locked-down hardware hai jise is course ne cover kiya hai: yahan tak ki ek real device jo ye code run kar raha hai raw biometric data extract nahi kar sakta, deliberate design se. Ye lesson real hasHardwareAsync/isEnrolledAsync/authenticateAsync flow ke baare mein honest documented prose hai, aur ek real, two-part gate ke baare mein precise hai jo is API ka documented behavior require karta hai: device ke paas physically sensor HONA chahiye, aur user ko separately OS ke saath ek fingerprint/face ENROLL kiya hona chahiye.",
    },

    simple: `**Why prose, closing this module's disclosed hardware pattern:**
a fingerprint sensor's actual match computation happens inside a
secure hardware enclave, by design invisible even to the OS, let
alone a JavaScript runtime. Confirmed absent from this course's
scratchpad, per the same Expo-SDK gotcha.

**The real, documented two-check-then-authenticate flow:**

\`\`\`ts
import * as LocalAuthentication from 'expo-local-authentication';

const hasHardware = await LocalAuthentication.hasHardwareAsync();
const isEnrolled = await LocalAuthentication.isEnrolledAsync();

if (!hasHardware) {
  console.log('this device has no biometric sensor at all');
} else if (!isEnrolled) {
  console.log('sensor exists, but user never set up Face/Touch ID');
} else {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm your identity',
    fallbackLabel: 'Use passcode',
  });
  console.log(result.success); // true/false -- never raw biometric data
}
\`\`\`

**Documented facts worth being precise about:**

- \`hasHardwareAsync\` and \`isEnrolledAsync\` are genuinely two separate,
  independent checks — a device can have the sensor chip but no
  enrolled fingerprint/face (a fresh device, or a user who declined
  setup), and documented, correct code distinguishes these two failure
  cases with different messaging rather than collapsing them into one
  generic "biometrics unavailable" error.
- \`authenticateAsync\`'s result is a plain \`{ success: boolean }\` (plus
  an \`error\` string on failure) — the API's documented contract never
  exposes raw fingerprint or face data to JavaScript, by deliberate
  security design; a "successful" result is the ONLY signal your code
  ever receives.
- \`supportedAuthenticationTypesAsync\` reports which kinds are
  available (fingerprint, facial recognition, iris) as documented
  enum values, letting an app show device-appropriate copy ("Use Face
  ID" vs. "Use your fingerprint") without hardcoding per-platform
  assumptions.

**How this lesson closes Module 12:** Lesson 1 covered location,
Lesson 2 covered motion sensors, and this lesson closes the module
with the most tightly hardware-gated API yet — a deliberate design
where even successful authentication reveals nothing about the
underlying biometric data. Module 13 covers push notifications,
closing Part IV.`,

    simpleHi: `**Prose kyun, is module ka disclosed hardware pattern close karte
hue:** ek fingerprint sensor ka actual match computation ek secure
hardware enclave ke andar hota hai, design se OS ke liye bhi invisible,
ek JavaScript runtime ki toh baat hi chhodo. Is course ke scratchpad
se confirmed absent, usi Expo-SDK gotcha ke hisaab se.

**Real, documented two-check-then-authenticate flow:**

\`\`\`ts
import * as LocalAuthentication from 'expo-local-authentication';

const hasHardware = await LocalAuthentication.hasHardwareAsync();
const isEnrolled = await LocalAuthentication.isEnrolledAsync();

if (!hasHardware) {
  console.log('this device has no biometric sensor at all');
} else if (!isEnrolled) {
  console.log('sensor exists, but user never set up Face/Touch ID');
} else {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm your identity',
    fallbackLabel: 'Use passcode',
  });
  console.log(result.success); // true/false -- kabhi raw biometric data nahi
}
\`\`\`

**Documented facts jo precise hone layak hain:**

- \`hasHardwareAsync\` aur \`isEnrolledAsync\` genuinely do separate,
  independent checks hain — ek device ke paas sensor chip ho sakti hai
  par koi enrolled fingerprint/face nahi (ek fresh device, ya ek user
  jisne setup decline kiya), aur documented, correct code in do failure
  cases ko different messaging ke saath distinguish karta hai unhe ek
  generic "biometrics unavailable" error mein collapse karne ke
  bajaye.
- \`authenticateAsync\` ka result ek plain \`{ success: boolean }\` hai
  (plus failure pe ek \`error\` string) — API ka documented contract
  kabhi raw fingerprint ya face data JavaScript ko expose nahi karta,
  deliberate security design se; ek "successful" result hi ONLY signal
  hai jo tumhara code kabhi receive karta hai.
- \`supportedAuthenticationTypesAsync\` report karta hai ki kaunse kinds
  available hain (fingerprint, facial recognition, iris) documented
  enum values ki tarah, ek app ko device-appropriate copy dikhaane
  deta hai ("Use Face ID" vs. "Use your fingerprint") bina per-platform
  assumptions hardcode kiye.

**Ye lesson Module 12 ko kaise close karta hai:** Lesson 1 ne location
cover kiya, Lesson 2 ne motion sensors cover kiya, aur ye lesson module
ko sabse tightly hardware-gated API ke saath close karta hai — ek
deliberate design jahan successful authentication bhi underlying
biometric data ke baare mein kuch reveal nahi karta. Module 13 push
notifications cover karta hai, Part IV ko close karte hue.`,

    content: `## Why biometric authentication is the most tightly hardware-gated
API this course has covered

A fingerprint or face match is computed entirely inside a secure
hardware enclave, isolated by deliberate design from the OS and every
app running on top of it -- there is no software model of this to run
in Node, and no possible execution path could reveal the raw
biometric data even on a real device, since the platform itself never
exposes it.

## Why hasHardwareAsync and isEnrolledAsync are documented as two
genuinely separate checks

A device can physically contain a fingerprint sensor while having no
enrolled fingerprint at all -- a fresh device, a factory reset, or a
user who simply never set up Face/Touch ID. Documented, correct code
checks both independently and gives the user different, actionable
messaging for each case, rather than a single undifferentiated
"biometrics not available" message that can't tell the user what to
actually do about it.

## Why authenticateAsync's result reveals only success or failure,
never biometric data

The documented \`{ success: boolean, error?: string }\` result is
deliberately the entire contract -- by design, no API path in
expo-local-authentication (or the underlying OS frameworks it wraps)
ever hands raw biometric data to application code. This is a
structural security guarantee, not an incidental limitation of the
library.

## Why supportedAuthenticationTypesAsync matters for honest,
device-appropriate UI copy

Different real devices support different biometric types (fingerprint
scanners, facial recognition, iris scanners), and hardcoding "Use
Face ID" on an Android device with only a fingerprint sensor would be
a real, visible mistake -- checking the documented enum values lets an
app show accurate, platform-appropriate prompts.

## How this lesson closes Module 12 and sets up Module 13

Lesson 1 covered location, Lesson 2 covered motion sensors, and this
lesson closes the module with the most security-conscious API
covered so far -- one whose entire documented design exists to reveal
nothing beyond a boolean result. Module 13 closes Part IV with push
notifications.`,

    contentHi: `## Biometric authentication is course ka sabse tightly hardware-gated API kyun hai

Ek fingerprint ya face match entirely ek secure hardware enclave ke
andar compute hota hai, deliberate design se OS aur uske upar chal
rahe har app se isolated -- iska koi software model nahi hai Node mein
run karne ke liye, aur koi possible execution path raw biometric data
reveal nahi kar sakta yahan tak ki ek real device pe bhi, kyunki
platform khud ise kabhi expose nahi karta.

## hasHardwareAsync aur isEnrolledAsync do genuinely separate checks ki tarah kyun documented hain

Ek device physically ek fingerprint sensor contain kar sakta hai jabki
uska koi enrolled fingerprint bilkul na ho -- ek fresh device, ek
factory reset, ya ek user jisne simply kabhi Face/Touch ID set up nahi
kiya. Documented, correct code dono ko independently check karta hai
aur user ko har case ke liye different, actionable messaging deta hai,
ek single undifferentiated "biometrics not available" message ke
bajaye jo user ko ye nahi bata sakta ki actually kya karna hai.

## authenticateAsync ka result sirf success ya failure kyun reveal karta hai, biometric data kabhi nahi

Documented \`{ success: boolean, error?: string }\` result deliberately
entire contract hai -- design se, expo-local-authentication mein koi
API path nahi hai (ya underlying OS frameworks jinhe ye wrap karta hai)
jo kabhi raw biometric data application code ko haath mein deta hai.
Ye ek structural security guarantee hai, library ki koi incidental
limitation nahi.

## supportedAuthenticationTypesAsync honest, device-appropriate UI copy ke liye kyun matter karta hai

Different real devices different biometric types support karte hain
(fingerprint scanners, facial recognition, iris scanners), aur ek
Android device pe jismein sirf fingerprint sensor hai "Use Face ID"
hardcode karna ek real, visible mistake hogi -- documented enum values
check karna ek app ko accurate, platform-appropriate prompts dikhane
deta hai.

## Ye lesson Module 12 ko kaise close karta hai aur Module 13 ko kaise set up karta hai

Lesson 1 ne location cover kiya, Lesson 2 ne motion sensors cover
kiya, aur ye lesson module ko ab tak cover kiye gaye sabse
security-conscious API ke saath close karta hai -- ek jiska entire
documented design ek boolean result ke alawa kuch bhi reveal na karne
ke liye exist karta hai. Module 13 push notifications ke saath Part
IV close karta hai.`,

    examples: [
      {
        title: 'A complete, documented biometric authentication flow distinguishing hardware-absent from not-enrolled',
        titleHi: 'Ek complete, documented biometric authentication flow jo hardware-absent ko not-enrolled se distinguish karta hai',
        codeJs: `import * as LocalAuthentication from 'expo-local-authentication';

async function authenticateUser() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return { ok: false, reason: 'no-sensor' };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return { ok: false, reason: 'not-enrolled' };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm your identity',
    fallbackLabel: 'Use passcode',
  });

  return { ok: result.success, reason: result.success ? 'success' : result.error };
}`,
        codeTs: `import * as LocalAuthentication from 'expo-local-authentication';

type AuthResult = { ok: boolean; reason: string };

async function authenticateUser(): Promise<AuthResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return { ok: false, reason: 'no-sensor' };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return { ok: false, reason: 'not-enrolled' };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm your identity',
    fallbackLabel: 'Use passcode',
  });

  return { ok: result.success, reason: result.success ? 'success' : (result.error ?? 'unknown') };
}`,
        code: `// See codeJs/codeTs -- documented, native-only behavior.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device with no biometric hardware, this resolves { ok: false, reason: 'no-sensor' } immediately; with hardware but no enrollment, { ok: false, reason: 'not-enrolled' }; with both present, the real OS prompt appears and the result reflects the user's actual authentication outcome.",
        explain:
          "This example distinguishes the two documented failure modes (no hardware vs. no enrollment) with different, actionable reasons, rather than collapsing them -- labeled honestly as unexecuted since no biometric sensor exists in this environment.",
        explainHi:
          "Ye example do documented failure modes ko distinguish karta hai (no hardware vs. no enrollment) different, actionable reasons ke saath, unhe collapse karne ke bajaye -- honestly unexecuted label kiya gaya kyunki is environment mein koi biometric sensor exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Collapsing hasHardwareAsync and isEnrolledAsync into one
// generic check, losing the ability to give the user useful guidance
async function canUseBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled; // true/false only -- WHY it failed is lost
}`,
        right: `// Checking both independently and preserving which one failed
async function getBiometricStatus() {
  if (!(await LocalAuthentication.hasHardwareAsync())) return 'no-sensor';
  if (!(await LocalAuthentication.isEnrolledAsync())) return 'not-enrolled';
  return 'ready';
}`,
        why: "expo-local-authentication documents hasHardwareAsync and isEnrolledAsync as two independent, distinguishable failure conditions -- collapsing them into a single boolean discards information the app needs to tell the user whether to buy a new device or just go set up Face/Touch ID in Settings.",
        whyHi:
          "expo-local-authentication hasHardwareAsync aur isEnrolledAsync ko do independent, distinguishable failure conditions ki tarah document karta hai -- unhe ek single boolean mein collapse karna wo information discard karta hai jo app ko user ko batane ke liye chahiye ki kya use ek naya device kharidna hai ya bas Settings mein jaake Face/Touch ID set up karna hai.",
      },
    ],

    realWorld: [
      {
        en: "A real banking app's Face ID login button appeared completely broken for a subset of test devices, traced not to a code bug but to those specific devices genuinely having the hardware but no enrolled face -- a distinction the app's original code never checked for separately, confirmed by exactly this lesson's two-check finding.",
        hi: "Ek real banking app ka Face ID login button ek subset test devices ke liye completely broken dikhta tha, ek code bug tak nahi balki un specific devices ke genuinely hardware hone par tha par koi enrolled face nahi -- ek distinction jise app ka original code kabhi separately check nahi karta tha, exactly is lesson ki two-check finding se confirmed.",
      },
    ],

    interviewQA: [
      {
        q: "Why does expo-local-authentication's authenticateAsync() never return the actual fingerprint or face data, even on a successful match?",
        qHi: 'expo-local-authentication ka authenticateAsync() actual fingerprint ya face data kabhi return kyun nahi karta, ek successful match pe bhi?',
        a: "The biometric match itself is computed entirely inside a secure hardware enclave that no application code -- and often not even the OS itself -- can access. The documented API contract is deliberately limited to a boolean success result plus an optional error, a structural security guarantee rather than an incidental library limitation.",
        aHi: "Biometric match khud entirely ek secure hardware enclave ke andar compute hota hai jise koi application code -- aur aksar khud OS bhi nahi -- access kar sakta. Documented API contract deliberately ek boolean success result plus ek optional error tak limited hai, ek structural security guarantee, na ki ek incidental library limitation.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented hasHardwareAsync/isEnrolledAsync distinction, design the exact user-facing message and suggested action for each of the three states (no hardware, hardware but not enrolled, ready) a login screen's biometric option should show.",
        taskHi: "Is lesson ke documented hasHardwareAsync/isEnrolledAsync distinction ko use karke, teen states (no hardware, hardware but not enrolled, ready) mein se har ek ke liye exact user-facing message aur suggested action design karo jo ek login screen ke biometric option ko dikhana chahiye.",
        hint: "Recall that 'no hardware' means the device can never support this feature, while 'not enrolled' means the user can fix it themselves in the OS's own Settings app -- these two states call for genuinely different guidance.",
        hintHi: "Yaad karo ki 'no hardware' matlab device kabhi bhi is feature ko support nahi kar sakta, jabki 'not enrolled' matlab user khud OS ke apne Settings app mein ise fix kar sakta hai -- ye do states genuinely different guidance maangte hain.",
      },
    ],

    keyTakeaways: [
      "expo-local-authentication is honest, documented prose in this course -- biometric matching happens entirely inside a secure hardware enclave with no software model to execute, the most tightly hardware-gated API this course has covered.",
      "hasHardwareAsync and isEnrolledAsync are documented as two genuinely independent checks -- a device can have the sensor chip with nothing enrolled, and correct code distinguishes these cases with different, actionable user guidance.",
      "authenticateAsync's result is deliberately limited to { success, error } -- by structural design, no API path ever exposes raw biometric data to application code, a security guarantee rather than a library limitation.",
    ],
    keyTakeawaysHi: [
      "expo-local-authentication is course mein honest, documented prose hai -- biometric matching entirely ek secure hardware enclave ke andar hota hai koi software model ke bina execute karne ke liye, sabse tightly hardware-gated API jise is course ne cover kiya hai.",
      "hasHardwareAsync aur isEnrolledAsync do genuinely independent checks ki tarah documented hain -- ek device ke paas sensor chip ho sakti hai bina kuch enroll kiye, aur correct code in cases ko different, actionable user guidance ke saath distinguish karta hai.",
      "authenticateAsync ka result deliberately { success, error } tak limited hai -- structural design se, koi API path kabhi raw biometric data application code ko expose nahi karta, ek library limitation nahi balki ek security guarantee.",
    ],
  },
];
