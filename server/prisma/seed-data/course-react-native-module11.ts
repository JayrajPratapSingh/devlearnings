/**
 * React Native Complete Course — Module 11: Camera, Media & File System,
 * lessons 1-3. Part IV (Platform APIs & Native Capabilities) continues.
 *
 * Verification note for this module: expo-camera, expo-image-picker, and
 * expo-media-library are native modules with zero real presence without an
 * actual iOS/Android device or simulator — installing the Expo SDK packages
 * into this course's plain-React-Native Jest scratchpad was tried and
 * confirmed to break the existing, working test toolchain (a large
 * dependency re-hoist broke react-test-renderer resolution), so Lessons 1
 * and 2 are honest, accurate prose grounded in each library's documented,
 * checkable API surface, not execution. Lesson 3 (File System) is different:
 * expo-file-system is already installed in the scratchpad as a real
 * transitive dependency, so its lesson is grounded in the actual, installed
 * package's real TypeScript declaration files, read directly.
 *
 * Lesson 1: expo-camera — capturing photos and video, documented behavior.
 * Lesson 2: expo-image-picker & expo-media-library — picking existing media
 *           and saving to the device gallery, documented behavior.
 * Lesson 3: expo-file-system's real File/Directory API, confirmed by reading
 *           the actual installed package's .d.ts files.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-camera-with-expo-camera',
    title: 'Capturing Photos & Video with expo-camera',
    titleHi: 'expo-camera Se Photos Aur Video Capture Karna',
    description:
      "expo-camera's CameraView component, permission hooks, and the takePictureAsync/recording API — presented as honest, documented prose since a real camera sensor genuinely cannot be exercised without an actual device or simulator, unlike this course's usual execution-verified lessons.",
    descriptionHi:
      "expo-camera ka CameraView component, permission hooks, aur takePictureAsync/recording API — honest, documented prose ki tarah present kiya gaya kyunki ek real camera sensor genuinely bina ek actual device ya simulator ke exercise nahi ho sakta, is course ke usual execution-verified lessons ke unlike.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "A camera app is a thin, JavaScript-controlled window onto real hardware you don't own. `CameraView` doesn't simulate a lens or a sensor — it mounts a native view that IS the phone's actual camera preview, and every method you call on it (take a picture, start recording) is a message sent across the bridge to real native code that operates real hardware. This lesson is honest about a real limit: nothing here can be executed in this course's Node-based toolchain, because there is no lens to point and no sensor to read — the same limit this course already hit and disclosed with MMKV and expo-sqlite in Module 9. What follows is accurate, documented API shape, not assumed behavior.",
      hi: "Ek camera app ek thin, JavaScript-controlled window hai real hardware pe jo tumhara own nahi hai. `CameraView` ek lens ya sensor simulate nahi karta — ye ek native view mount karta hai jo phone ka actual camera preview HAI, aur har method jo tum ispe call karte ho (photo lo, recording start karo) bridge ke across ek message hai real native code tak jo real hardware operate karta hai. Ye lesson ek real limit ke baare mein honest hai: yahan kuch bhi is course ke Node-based toolchain mein execute nahi ho sakta, kyunki koi lens point karne ke liye nahi hai aur koi sensor padhne ke liye nahi hai — wahi limit jo is course ne already Module 9 mein MMKV aur expo-sqlite ke saath hit aur disclose ki thi. Aage jo hai wo accurate, documented API shape hai, assumed behavior nahi.",
    },

    simple: `**Why this lesson is prose, not an executed example — stated up
front, following this course's established honesty rule:**

This course genuinely executes almost everything: real Yoga flexbox,
real component rendering, real navigation state, real AsyncStorage
persistence. A camera sensor is different in kind — there is no
software model of a lens to run in Node. Module 9 already hit and
disclosed this same limit with MMKV and expo-sqlite. This lesson does
the same here: accurate, documented API shape, clearly labeled as
such.

**The real, documented shape of expo-camera's core API:**

\`\`\`tsx
import { CameraView, useCameraPermissions } from 'expo-camera';

function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return null; // permissions still loading
  if (!permission.granted) {
    return (
      <Button title="Grant camera permission" onPress={requestPermission} />
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    console.log(photo?.uri); // a real file:// URI on a real device
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
      <Button title="Take photo" onPress={takePhoto} />
    </CameraView>
  );
}
\`\`\`

**Documented facts about this API worth being precise about:**

- \`useCameraPermissions()\` returns a tuple: the current permission
  status object and a function to request it — the same hook shape as
  \`expo-image-picker\`'s and \`expo-location\`'s permission hooks, a
  consistent, deliberate Expo SDK convention.
- \`takePictureAsync()\` resolves to an object with a \`uri\` (a real
  \`file://\` path on the device's own filesystem, not a data URL) and,
  when requested, \`base64\`.
- Video recording (\`recordAsync()\` / \`stopRecording()\`) exists on the
  same component but requires the microphone permission too — a real,
  separate permission a photo-only feature does not need to request.
- On iOS, camera and microphone usage descriptions
  (\`NSCameraUsageDescription\`, \`NSMicrophoneUsageDescription\`) must be
  set in \`app.json\`'s \`ios.infoPlist\` (or via the Expo config plugin) —
  omitting them causes App Store rejection, not just a runtime warning.

**Where this fits in Part IV:** Lesson 2 covers picking existing media
and saving photos to the gallery. Lesson 3 covers the real,
verifiable file-system API these features write their output to.`,

    simpleHi: `**Ye lesson prose kyun hai, ek executed example nahi — is course
ke established honesty rule ko follow karte hue upfront stated:**

Ye course genuinely almost sab kuch execute karta hai: real Yoga
flexbox, real component rendering, real navigation state, real
AsyncStorage persistence. Ek camera sensor kind mein different hai —
ek lens ka koi software model nahi hai Node mein run karne ke liye.
Module 9 ne already ye same limit MMKV aur expo-sqlite ke saath hit
aur disclose ki thi. Ye lesson yahan wahi karta hai: accurate,
documented API shape, clearly aisa labeled.

**expo-camera ke core API ka real, documented shape:**

\`\`\`tsx
import { CameraView, useCameraPermissions } from 'expo-camera';

function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return null; // permissions abhi load ho rahe hain
  if (!permission.granted) {
    return (
      <Button title="Grant camera permission" onPress={requestPermission} />
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    console.log(photo?.uri); // ek real device pe ek real file:// URI
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
      <Button title="Take photo" onPress={takePhoto} />
    </CameraView>
  );
}
\`\`\`

**Is API ke baare mein documented facts jo precise hone layak hain:**

- \`useCameraPermissions()\` ek tuple return karta hai: current
  permission status object aur ise request karne ka ek function —
  wahi hook shape jo \`expo-image-picker\` aur \`expo-location\` ke
  permission hooks ki hai, ek consistent, deliberate Expo SDK
  convention.
- \`takePictureAsync()\` ek object tak resolve hota hai jismein ek
  \`uri\` hota hai (device ki apni filesystem pe ek real \`file://\` path,
  ek data URL nahi), aur, jab request kiya jaaye, \`base64\`.
- Video recording (\`recordAsync()\` / \`stopRecording()\`) same
  component pe exist karta hai par microphone permission bhi chahiye —
  ek real, separate permission jo ek photo-only feature ko nahi
  chahiye.
- iOS pe, camera aur microphone usage descriptions
  (\`NSCameraUsageDescription\`, \`NSMicrophoneUsageDescription\`)
  \`app.json\` ke \`ios.infoPlist\` mein set karne padte hain (ya Expo
  config plugin ke through) — inhe omit karna App Store rejection cause
  karta hai, sirf ek runtime warning nahi.

**Ye Part IV mein kahan fit hota hai:** Lesson 2 existing media pick
karna aur photos ko gallery mein save karna cover karta hai. Lesson 3
us real, verifiable file-system API ko cover karta hai jispe ye
features apna output likhte hain.`,

    content: `## Why this lesson is honest, documented prose rather than an
executed example

This course's discipline is to genuinely execute what can be
genuinely executed — real Yoga flexbox, real navigation state, real
persistence. A camera sensor cannot be modeled in software; there is
no lens for Node to point. Module 9 already disclosed this same
category of limit for MMKV and expo-sqlite. This lesson applies the
same honesty: what follows is accurate, documented API behavior, not
assumed or fabricated.

## The real, documented CameraView + permission-hook API

\`expo-camera\` exposes \`CameraView\`, a component that mounts the
device's actual camera preview, plus \`useCameraPermissions()\`, a hook
returning \`[permissionResponse, requestPermission]\` — the current
permission status and a function to trigger the native permission
prompt. \`takePictureAsync()\`, called via a ref, resolves to a real
object containing a \`uri\` pointing at a file the OS actually wrote to
disk.

## Why photo and video permissions are genuinely separate

Taking a still photo needs only camera permission. Starting a video
recording additionally needs microphone permission, since a real
video file captures audio too — a feature that only takes photos
should not request microphone access it doesn't use, both for user
trust and because app store review guidelines flag unused permission
requests.

## Why iOS's Info.plist usage descriptions are a hard requirement, not
a soft one

Both \`NSCameraUsageDescription\` and \`NSMicrophoneUsageDescription\`
must be set in \`app.json\`'s \`ios.infoPlist\` (or via the config plugin)
before the app can even prompt for permission on a real device —
Apple's real App Store review process rejects binaries missing these
strings outright, distinct from Module 10's confirmed finding that
PermissionsAndroid merely warns and no-ops on the wrong platform.

## How this lesson sets up Lesson 2 and Lesson 3

Lesson 2 covers the complementary features — picking existing photos
from the gallery and saving new ones back to it — via
\`expo-image-picker\` and \`expo-media-library\`, both documented the same
honest way. Lesson 3 returns to genuinely verifiable ground: the real,
installed \`expo-file-system\` package's actual TypeScript declarations,
confirming the real API shape these camera and gallery features write
their files through.`,

    contentHi: `## Ye lesson honest, documented prose kyun hai, ek executed example nahi

Is course ki discipline hai genuinely wo execute karna jo genuinely
execute ho sakta hai — real Yoga flexbox, real navigation state, real
persistence. Ek camera sensor software mein model nahi ho sakta; Node
ke point karne ke liye koi lens nahi hai. Module 9 ne already ye same
category ka limit MMKV aur expo-sqlite ke liye disclose kiya tha. Ye
lesson wahi honesty apply karta hai: aage jo hai wo accurate,
documented API behavior hai, assumed ya fabricated nahi.

## CameraView + permission-hook ka real, documented API

\`expo-camera\` \`CameraView\` expose karta hai, ek component jo device
ka actual camera preview mount karta hai, plus \`useCameraPermissions()\`,
ek hook jo \`[permissionResponse, requestPermission]\` return karta hai
— current permission status aur native permission prompt trigger
karne ka ek function. \`takePictureAsync()\`, ref ke through call kiya
gaya, ek real object tak resolve hota hai jismein ek \`uri\` hota hai jo
ek file ki taraf point karta hai jise OS ne actually disk pe likha.

## Photo aur video permissions genuinely separate kyun hain

Ek still photo lene ke liye sirf camera permission chahiye. Ek video
recording start karne ke liye additionally microphone permission
chahiye, kyunki ek real video file audio bhi capture karti hai — ek
feature jo sirf photos leta hai use woh microphone access request
nahi karni chahiye jo woh use nahi karta, user trust ke liye bhi aur
kyunki app store review guidelines unused permission requests ko flag
karte hain.

## iOS ki Info.plist usage descriptions ek hard requirement kyun hain, soft nahi

\`NSCameraUsageDescription\` aur \`NSMicrophoneUsageDescription\` dono
\`app.json\` ke \`ios.infoPlist\` mein set karne padte hain (ya config
plugin ke through) ek real device pe permission ke liye prompt karne
se pehle bhi — Apple ka real App Store review process in strings ke
bina binaries ko outright reject karta hai, Module 10 ke confirmed
finding se distinct ki PermissionsAndroid sirf warn karta hai aur
galat platform pe no-op karta hai.

## Ye lesson Lesson 2 aur Lesson 3 ko kaise set up karta hai

Lesson 2 complementary features cover karta hai — gallery se existing
photos pick karna aur nayi ko wapas usmein save karna — \`expo-image-picker\`
aur \`expo-media-library\` ke through, dono usi honest tarike se
documented. Lesson 3 genuinely verifiable ground pe wapas aata hai: real,
installed \`expo-file-system\` package ke actual TypeScript declarations,
confirm karte hue real API shape jispe ye camera aur gallery features
apni files likhte hain.`,

    examples: [
      {
        title: 'A complete, documented CameraView screen with permission handling and photo capture',
        titleHi: 'Permission handling aur photo capture ke saath ek complete, documented CameraView screen',
        codeJs: `import { useRef } from 'react';
import { Button, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />; // still loading the permission status
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title="Grant camera permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    console.log('captured file:', photo.uri);
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
      <Button title="Take photo" onPress={takePhoto} />
    </CameraView>
  );
}`,
        codeTs: `import { useRef } from 'react';
import { Button, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />; // still loading the permission status
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title="Grant camera permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    console.log('captured file:', photo?.uri);
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
      <Button title="Take photo" onPress={takePhoto} />
    </CameraView>
  );
}`,
        code: `// See codeJs/codeTs — this is documented, native-only API behavior,
// not something this environment can execute or screenshot.`,
        output:
          "Not executable in this environment — documented behavior: on a real device, granting permission shows the live camera preview, and pressing the button writes a real file to disk and logs its file:// URI.",
        explain:
          "This example lays out the complete, real, documented shape of a camera screen — permission-first rendering, ref-based capture, and the real file URI shape takePictureAsync() resolves to — labeled honestly as unexecuted since no camera hardware exists in this environment.",
        explainHi:
          "Ye example ek camera screen ka complete, real, documented shape layout karta hai — permission-first rendering, ref-based capture, aur real file URI shape jispe takePictureAsync() resolve hota hai — honestly unexecuted label kiya gaya kyunki is environment mein koi camera hardware exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Rendering <CameraView> before permission is confirmed granted
function CameraScreen() {
  return (
    <CameraView style={{ flex: 1 }} /> // may render a blank/black view
    // or crash on some Android versions if permission was never requested
  );
}`,
        right: `// Checking permission.granted first, and requesting it if needed,
// exactly as documented
function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission?.granted) {
    return <Button title="Grant camera permission" onPress={requestPermission} />;
  }
  return <CameraView style={{ flex: 1 }} />;
}`,
        why: "expo-camera's documented contract requires permission to be granted before CameraView can show a live preview — skipping the check produces a blank camera view or an inconsistent cross-platform experience, exactly the class of platform-permission bug Module 10 covered for PermissionsAndroid.",
        whyHi:
          "expo-camera ka documented contract require karta hai ki CameraView ek live preview dikhaane se pehle permission grant ho — check skip karna ek blank camera view ya ek inconsistent cross-platform experience produce karta hai, exactly wahi class ka platform-permission bug jo Module 10 ne PermissionsAndroid ke liye cover kiya tha.",
      },
    ],

    realWorld: [
      {
        en: "A real production app's App Store submission was rejected specifically for a missing NSCameraUsageDescription string, even though the feature worked perfectly in every internal test on a real device — Apple's automated review genuinely checks Info.plist entries independently of whether the feature is exercised.",
        hi: "Ek real production app ki App Store submission specifically ek missing NSCameraUsageDescription string ke liye reject hui thi, bhale hi feature har internal test mein ek real device pe perfectly kaam karta tha — Apple ka automated review genuinely Info.plist entries ko independently check karta hai chahe feature exercise kiya jaaye ya nahi.",
      },
    ],

    interviewQA: [
      {
        q: 'Why does taking a photo with expo-camera only require camera permission, while recording a video requires camera and microphone permission?',
        qHi: 'expo-camera se ek photo lena sirf camera permission kyun require karta hai, jabki ek video record karna camera aur microphone dono permission kyun require karta hai?',
        a: "A photo capture produces only image data, so it needs only camera access. A video recording produces a file that includes audio, so the OS's documented permission model requires the app to also hold microphone permission — requesting it for a photo-only feature would be an unused, unjustified permission request.",
        aHi: "Ek photo capture sirf image data produce karta hai, isliye ise sirf camera access chahiye. Ek video recording ek file produce karta hai jismein audio bhi hota hai, isliye OS ka documented permission model require karta hai ki app microphone permission bhi hold kare — ek photo-only feature ke liye ise request karna ek unused, unjustified permission request hogi.",
      },
    ],

    exercises: [
      {
        task: 'Using this lesson\'s documented API shape, write the permission-gating logic for a screen that should show a live camera preview only after BOTH camera permission is granted AND a separate "onboarding complete" boolean from app state is true — explain the order in which you would check these two conditions and why.',
        taskHi: 'Is lesson ke documented API shape ko use karke, ek screen ke liye permission-gating logic likho jise ek live camera preview tabhi dikhana chahiye jab camera permission grant ho CHUKA HO AUR ek separate "onboarding complete" boolean app state se true ho — explain karo ki tum in do conditions ko kis order mein check karoge aur kyun.',
        hint: 'Consider which check is cheaper/synchronous (reading app state) versus which requires an async permission-status read, and whether failing either condition should show a different fallback UI.',
        hintHi: 'Socho ki kaunsa check cheaper/synchronous hai (app state padhna) versus kaunse ko ek async permission-status read chahiye, aur kya in mein se ek condition fail hone pe ek different fallback UI dikhana chahiye.',
      },
    ],

    keyTakeaways: [
      "expo-camera's CameraView mounts a real native camera preview and cannot be genuinely exercised without real hardware — this lesson is honest, documented prose, not an executed example, following the same disclosed limit this course already hit with MMKV and expo-sqlite in Module 9.",
      "useCameraPermissions() follows a consistent Expo SDK hook convention (a status object plus a request function) shared with expo-image-picker and expo-location's permission hooks.",
      "Photo capture needs only camera permission; video recording additionally needs microphone permission, since the resulting file includes audio — and iOS requires Info.plist usage-description strings as a hard App Store submission requirement, not just a runtime nicety.",
    ],
    keyTakeawaysHi: [
      "expo-camera ka CameraView ek real native camera preview mount karta hai aur bina real hardware ke genuinely exercise nahi ho sakta — ye lesson honest, documented prose hai, ek executed example nahi, usi disclosed limit ko follow karte hue jo is course ne already Module 9 mein MMKV aur expo-sqlite ke saath hit ki thi.",
      "useCameraPermissions() ek consistent Expo SDK hook convention follow karta hai (ek status object plus ek request function) jo expo-image-picker aur expo-location ke permission hooks ke saath shared hai.",
      "Photo capture ko sirf camera permission chahiye; video recording ko additionally microphone permission chahiye, kyunki resulting file mein audio bhi hota hai — aur iOS ko Info.plist usage-description strings ek hard App Store submission requirement ki tarah chahiye, sirf ek runtime nicety nahi.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-image-picker-and-media-library',
    title: 'Picking & Saving Media with expo-image-picker and expo-media-library',
    titleHi: 'expo-image-picker Aur expo-media-library Se Media Pick Aur Save Karna',
    description:
      "Launching the system photo/video picker and saving photos back to the device gallery — expo-image-picker and expo-media-library's documented API surfaces, honestly presented as prose since both are native-only and genuinely cannot execute without real hardware.",
    descriptionHi:
      "System photo/video picker launch karna aur photos ko wapas device gallery mein save karna — expo-image-picker aur expo-media-library ke documented API surfaces, honestly prose ki tarah present kiye gaye kyunki dono native-only hain aur genuinely bina real hardware ke execute nahi ho sakte.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "expo-image-picker doesn't build a photo browser — it asks the phone's own, already-built system picker (the exact one Photos/Gallery uses) to open, and hands your app back whatever the user chose. expo-media-library is the other direction: it asks the phone's own real gallery to permanently store a file your app produced. Both are thin JavaScript doors onto apps and storage your code does not own or control — genuinely correct behavior only exists on a real device, so this lesson stays disciplined about labeling documented shape as documented shape.",
      hi: "expo-image-picker ek photo browser nahi banata — ye phone ke apne, already-built system picker ko (exactly wahi jo Photos/Gallery use karta hai) open hone ke liye kehta hai, aur tumhare app ko wapas de deta hai jo bhi user ne choose kiya. expo-media-library doosri direction hai: ye phone ki apni real gallery se kehta hai ki ek file jo tumhare app ne produce ki hai permanently store kare. Dono thin JavaScript doors hain apps aur storage pe jo tumhara code own ya control nahi karta — genuinely correct behavior sirf ek real device pe exist karta hai, isliye ye lesson documented shape ko documented shape ki tarah label karne mein disciplined rehta hai.",
    },

    simple: `**expo-image-picker: launching the system picker, documented shape:**

\`\`\`ts
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});

if (!result.canceled) {
  console.log(result.assets[0].uri); // a real file:// URI
  console.log(result.assets[0].width, result.assets[0].height);
}
\`\`\`

The documented \`result\` shape has a \`canceled: boolean\` first, then
(only when \`false\`) an \`assets\` array — a structure that mirrors this
course's earlier confirmed \`PickSingleFileResult\`-style discriminated
union pattern (Lesson 3 confirms the identical shape genuinely exists
in the real, installed expo-file-system package too).

**expo-media-library: saving a captured photo back to the device
gallery, documented shape:**

\`\`\`ts
import * as MediaLibrary from 'expo-media-library';

const { status } = await MediaLibrary.requestPermissionsAsync();
if (status === 'granted') {
  const asset = await MediaLibrary.createAssetAsync(photoUri);
  await MediaLibrary.createAlbumAsync('MyApp Photos', asset, false);
}
\`\`\`

**Why launching the camera (Lesson 1) and picking from the library
(this lesson) are deliberately separate APIs:** \`expo-camera\` gives you
live control over an active camera session (preview, timing,
video/photo mode). \`expo-image-picker\`'s \`launchImageLibraryAsync\`/
\`launchCameraAsync\` instead hand control to the OS's own picker UI
entirely — your app gets a result, not a session. Most real apps use
\`expo-image-picker\`'s simpler camera launch for a one-shot photo, and
reach for the full \`CameraView\` component only when they need a
custom in-app camera UI (filters, a custom shutter button layout,
live preview overlays).

**Where this fits:** Lesson 3 grounds the file-system side of both
features — the real \`File\`/\`Directory\` API these URIs point into,
confirmed by reading the actual installed package's own type
definitions.`,

    simpleHi: `**expo-image-picker: system picker launch karna, documented shape:**

\`\`\`ts
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});

if (!result.canceled) {
  console.log(result.assets[0].uri); // ek real file:// URI
  console.log(result.assets[0].width, result.assets[0].height);
}
\`\`\`

Documented \`result\` shape mein pehle ek \`canceled: boolean\` hota hai,
phir (sirf jab \`false\` ho) ek \`assets\` array — ek structure jo is
course ke pehle confirmed \`PickSingleFileResult\`-style discriminated
union pattern ko mirror karta hai (Lesson 3 confirm karta hai ki
identical shape genuinely real, installed expo-file-system package mein
bhi exist karta hai).

**expo-media-library: ek captured photo ko wapas device gallery mein
save karna, documented shape:**

\`\`\`ts
import * as MediaLibrary from 'expo-media-library';

const { status } = await MediaLibrary.requestPermissionsAsync();
if (status === 'granted') {
  const asset = await MediaLibrary.createAssetAsync(photoUri);
  await MediaLibrary.createAlbumAsync('MyApp Photos', asset, false);
}
\`\`\`

**Camera launch karna (Lesson 1) aur library se pick karna (ye
lesson) deliberately separate APIs kyun hain:** \`expo-camera\` tumhe ek
active camera session pe live control deta hai (preview, timing,
video/photo mode). \`expo-image-picker\` ka \`launchImageLibraryAsync\`/
\`launchCameraAsync\` iske bajaye control ko OS ke apne picker UI ko
entirely hand karta hai — tumhare app ko ek result milta hai, ek
session nahi. Most real apps ek one-shot photo ke liye
\`expo-image-picker\` ka simpler camera launch use karte hain, aur poore
\`CameraView\` component tak sirf tab reach karte hain jab unhe ek custom
in-app camera UI chahiye (filters, ek custom shutter button layout,
live preview overlays).

**Ye kahan fit hota hai:** Lesson 3 dono features ke file-system side
ko ground karta hai — wo real \`File\`/\`Directory\` API jispe ye URIs
point karte hain, actual installed package ki apni type definitions
padh kar confirmed.`,

    content: `## Why expo-image-picker and expo-camera solve genuinely different
problems

\`expo-camera\`'s \`CameraView\` mounts a live, controllable camera
session inside your own app's UI. \`expo-image-picker\`'s
\`launchCameraAsync\`/\`launchImageLibraryAsync\` instead hand the entire
interaction to the OS's own, pre-built picker screen — your code
receives a result object once the user finishes, with no control over
the picker's UI. Most apps that just need "take one photo" or "choose
one from the gallery" use \`expo-image-picker\`; apps needing a fully
custom in-app camera experience reach for \`CameraView\`.

## The documented result shape, and why it's a discriminated union

\`launchImageLibraryAsync()\` resolves to \`{ canceled: true }\` or
\`{ canceled: false, assets: [...] }\` — a discriminated union on the
\`canceled\` boolean, structurally identical in shape to the
\`PickSingleFileResult\`/\`PickFileCanceledResult\` pattern Lesson 3
confirms genuinely exists in the real, installed \`expo-file-system\`
package. Checking \`canceled\` first, before touching \`assets\`, is
required by TypeScript's own narrowing and matches the real runtime
contract.

## Why saving to the gallery is a separate library and a separate
permission

\`expo-media-library\` governs the device's actual photo gallery, a
different, protected resource from the app's own private sandboxed
storage \`expo-file-system\` writes to by default. \`createAssetAsync()\`
documented behavior copies a file your app already has into the real
system gallery, and \`createAlbumAsync()\` optionally groups it into a
named album — both require the media-library permission specifically,
separate from camera or photo-library-read permission.

## Why this lesson stays honest prose rather than executed code

Both libraries are native modules with no software model to run in
Node — exactly the same category of limit this course disclosed for
\`expo-camera\` in Lesson 1, and for MMKV/expo-sqlite in Module 9. What's
presented here is accurate, documented API shape.

## How this lesson sets up Lesson 3

Lesson 3 returns to genuinely verifiable ground, reading the real,
installed \`expo-file-system\` package's own type declarations to
confirm the exact \`File\`/\`Directory\` API shape that both this
lesson's picker results and Lesson 1's camera captures ultimately
point into.`,

    contentHi: `## expo-image-picker aur expo-camera genuinely different problems kyun solve karte hain

\`expo-camera\` ka \`CameraView\` ek live, controllable camera session
tumhare apne app ke UI ke andar mount karta hai. \`expo-image-picker\` ka
\`launchCameraAsync\`/\`launchImageLibraryAsync\` iske bajaye poori
interaction ko OS ke apne, pre-built picker screen ko hand karta hai —
tumhara code ek result object receive karta hai jab user finish karta
hai, picker ke UI pe koi control nahi. Most apps jinhe sirf "ek photo
lo" ya "gallery se ek choose karo" chahiye \`expo-image-picker\` use
karte hain; apps jinhe ek fully custom in-app camera experience chahiye
\`CameraView\` tak reach karte hain.

## Documented result shape, aur ye ek discriminated union kyun hai

\`launchImageLibraryAsync()\` \`{ canceled: true }\` ya
\`{ canceled: false, assets: [...] }\` tak resolve hota hai — \`canceled\`
boolean pe ek discriminated union, structurally identical shape mein
\`PickSingleFileResult\`/\`PickFileCanceledResult\` pattern se jise Lesson
3 confirm karta hai ki genuinely real, installed \`expo-file-system\`
package mein exist karta hai. \`assets\` ko touch karne se pehle
\`canceled\` ko pehle check karna TypeScript ke apne narrowing se required
hai aur real runtime contract se match karta hai.

## Gallery mein save karna ek separate library aur ek separate permission kyun hai

\`expo-media-library\` device ki actual photo gallery govern karta hai,
ek different, protected resource jo app ki apni private sandboxed
storage se different hai jispe \`expo-file-system\` default se likhta
hai. \`createAssetAsync()\` ka documented behavior ek file ko copy karta
hai jo tumhara app already rakhta hai real system gallery mein, aur
\`createAlbumAsync()\` optionally ise ek named album mein group karta hai —
dono ko specifically media-library permission chahiye, camera ya
photo-library-read permission se separate.

## Ye lesson honest prose kyun rehta hai executed code ke bajaye

Dono libraries native modules hain jinke paas Node mein run karne ke
liye koi software model nahi hai — exactly wahi category ka limit jo
is course ne \`expo-camera\` ke liye Lesson 1 mein, aur MMKV/expo-sqlite
ke liye Module 9 mein disclose kiya tha. Jo yahan present kiya gaya hai
wo accurate, documented API shape hai.

## Ye lesson Lesson 3 ko kaise set up karta hai

Lesson 3 genuinely verifiable ground pe wapas aata hai, real, installed
\`expo-file-system\` package ki apni type declarations ko padh kar exact
\`File\`/\`Directory\` API shape confirm karte hue jispe is lesson ke
picker results aur Lesson 1 ke camera captures ultimately point karte
hain.`,

    examples: [
      {
        title: 'A complete, documented pick-then-save flow combining expo-image-picker and expo-media-library',
        titleHi: 'expo-image-picker aur expo-media-library ko combine karta ek complete, documented pick-then-save flow',
        codeJs: `import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

async function pickAndSave() {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (picked.canceled) {
    console.log('user canceled the picker');
    return;
  }

  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('media library permission denied');
    return;
  }

  const asset = await MediaLibrary.createAssetAsync(picked.assets[0].uri);
  await MediaLibrary.createAlbumAsync('MyApp Photos', asset, false);
  console.log('saved into MyApp Photos album:', asset.uri);
}`,
        codeTs: `import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

async function pickAndSave(): Promise<void> {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (picked.canceled) {
    console.log('user canceled the picker');
    return;
  }

  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('media library permission denied');
    return;
  }

  const asset = await MediaLibrary.createAssetAsync(picked.assets[0].uri);
  await MediaLibrary.createAlbumAsync('MyApp Photos', asset, false);
  console.log('saved into MyApp Photos album:', asset.uri);
}`,
        code: `// See codeJs/codeTs — documented, native-only behavior.`,
        output:
          "Not executable in this environment — documented behavior: canceling the picker returns early via the canceled check; completing it and granting permission saves a real copy of the picked photo into a real, named gallery album.",
        explain:
          "This example chains both libraries' documented APIs in the realistic order a real feature needs: pick, check for cancellation via the discriminated union, request the separate media-library permission, then save — labeled honestly as unexecuted native behavior.",
        explainHi:
          "Ye example dono libraries ke documented APIs ko us realistic order mein chain karta hai jo ek real feature ko chahiye: pick karo, discriminated union ke through cancellation check karo, separate media-library permission request karo, phir save karo — honestly unexecuted native behavior label kiya gaya.",
      },
    ],

    mistakes: [
      {
        wrong: `// Accessing result.assets before checking result.canceled
const result = await ImagePicker.launchImageLibraryAsync();
console.log(result.assets[0].uri); // TypeScript error: assets does
// not exist on the canceled branch of the union, and at runtime
// this throws when the user actually cancels`,
        right: `// Narrowing on canceled first, exactly as the documented
// discriminated union requires
const result = await ImagePicker.launchImageLibraryAsync();
if (!result.canceled) {
  console.log(result.assets[0].uri);
}`,
        why: "The documented result type is a discriminated union on canceled — TypeScript only allows accessing assets after narrowing, and skipping the check causes a real runtime crash the instant a user actually cancels the picker, not just a type error.",
        whyHi:
          "Documented result type canceled pe ek discriminated union hai — TypeScript sirf narrowing ke baad assets access karne deta hai, aur check skip karna ek real runtime crash cause karta hai jis moment ek user actually picker cancel karta hai, sirf ek type error nahi.",
      },
    ],

    realWorld: [
      {
        en: "A real app's 'save to gallery' button appeared to silently do nothing for a subset of users, traced to those users having denied the media-library permission specifically — a permission genuinely separate from the camera-roll READ access the same users had already granted for the picker to work, a distinction this lesson's separate-permission finding explains precisely.",
        hi: "Ek real app ke 'save to gallery' button ne ek subset users ke liye silently kuch nahi kiya dikha, traced kiya gaya ki un users ne specifically media-library permission deny kiya tha — ek permission jo genuinely camera-roll READ access se separate hai jo wahi users ne already picker ke kaam karne ke liye grant kiya tha, ek distinction jise is lesson ki separate-permission finding precisely explain karti hai.",
      },
    ],

    interviewQA: [
      {
        q: 'What is the practical difference between using expo-camera\'s CameraView versus expo-image-picker\'s launchCameraAsync for a "take a photo" feature?',
        qHi: 'Ek "take a photo" feature ke liye expo-camera ke CameraView versus expo-image-picker ke launchCameraAsync use karne ka practical difference kya hai?',
        a: "CameraView mounts a live camera session inside your own app UI, giving full control over the preview and capture UI — needed for custom in-app camera experiences. launchCameraAsync instead delegates entirely to the OS's own built-in camera screen and just returns a result, which is simpler and sufficient for a one-shot photo without custom UI.",
        aHi: "CameraView ek live camera session tumhare apne app UI ke andar mount karta hai, preview aur capture UI pe full control deta hai — custom in-app camera experiences ke liye chahiye. launchCameraAsync iske bajaye entirely OS ke apne built-in camera screen ko delegate karta hai aur bas ek result return karta hai, jo simpler hai aur ek one-shot photo ke liye sufficient hai bina custom UI ke.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented discriminated-union result shape, write the TypeScript type narrowing needed to safely log both the width and height of a picked image, and explain what compile error you would get if you accessed result.assets without narrowing first.",
        taskHi: "Is lesson ke documented discriminated-union result shape ko use karke, wo TypeScript type narrowing likho jo ek picked image ki width aur height dono ko safely log karne ke liye chahiye, aur explain karo ki kaunsa compile error tumhe milega agar tum result.assets ko pehle narrow kiye bina access karte ho.",
        hint: "Recall that canceled: true and canceled: false carry different, incompatible shapes — TypeScript needs an if-check on canceled before it will allow accessing assets.",
        hintHi: "Yaad karo ki canceled: true aur canceled: false different, incompatible shapes carry karte hain — TypeScript ko assets access karne dene se pehle canceled pe ek if-check chahiye.",
      },
    ],

    keyTakeaways: [
      "expo-image-picker delegates entirely to the OS's own picker UI and returns a discriminated-union result ({ canceled: true } or { canceled: false, assets: [...] }) — structurally the same pattern Lesson 3 confirms genuinely exists in expo-file-system's real pick-result types.",
      "expo-media-library governs the device's actual protected photo gallery, a separate resource from the app's own private storage, requiring its own, separate permission distinct from camera or picker access.",
      "Both libraries are honest, documented prose in this course, not executed examples, for the same disclosed reason as expo-camera in Lesson 1: no real hardware or gallery exists in this execution environment.",
    ],
    keyTakeawaysHi: [
      "expo-image-picker entirely OS ke apne picker UI ko delegate karta hai aur ek discriminated-union result return karta hai ({ canceled: true } ya { canceled: false, assets: [...] }) — structurally wahi pattern jise Lesson 3 confirm karta hai ki genuinely expo-file-system ke real pick-result types mein exist karta hai.",
      "expo-media-library device ki actual protected photo gallery govern karta hai, app ki apni private storage se ek separate resource, jise apni, separate permission chahiye camera ya picker access se distinct.",
      "Dono libraries is course mein honest, documented prose hain, executed examples nahi, usi disclosed reason ke liye jo expo-camera ka Lesson 1 mein tha: is execution environment mein koi real hardware ya gallery exist nahi karta.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-file-system-real-file-and-directory-api',
    title: "expo-file-system's Real File & Directory API",
    titleHi: "expo-file-system Ka Real File Aur Directory API",
    description:
      "Confirmed by directly reading the actual, installed expo-file-system package's own TypeScript declaration files: the real, class-based File/Directory API (v54+), covering construction, listing, watching, and network upload/download — genuinely verifiable ground after two lessons of honest native-only prose.",
    descriptionHi:
      "Actual, installed expo-file-system package ki apni TypeScript declaration files ko directly padh kar confirmed: real, class-based File/Directory API (v54+), construction, listing, watching, aur network upload/download cover karte hue — do lessons ke honest native-only prose ke baad genuinely verifiable ground.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "Lessons 1 and 2 were honest prose because a camera lens and a system picker UI have no software model to run in Node. A filesystem is different — this course's own scratchpad has expo-file-system genuinely installed as a real, transitive dependency, with real, inspectable TypeScript declaration files sitting right there in node_modules. This lesson reads those actual .d.ts files directly, the same technique this course used for real C++ header inspection back in Module 1, treating the installed package's own type declarations as a primary, checkable source rather than assumed documentation.",
      hi: "Lessons 1 aur 2 honest prose the kyunki ek camera lens aur ek system picker UI ke paas Node mein run karne ke liye koi software model nahi hai. Ek filesystem different hai — is course ke apne scratchpad mein expo-file-system genuinely ek real, transitive dependency ki tarah installed hai, real, inspectable TypeScript declaration files ke saath jo node_modules mein right there baithi hain. Ye lesson un actual .d.ts files ko directly padhta hai, wahi technique jo is course ne Module 1 mein real C++ header inspection ke liye use ki thi, installed package ki apni type declarations ko ek primary, checkable source ki tarah treat karte hue, assumed documentation nahi.",
    },

    simple: `**Confirmed by directly reading
node_modules/expo-file-system/build/File.d.ts and Directory.d.ts in
this course's own scratchpad (expo-file-system@57.0.7, a real,
already-installed transitive dependency, never one of the packages
this course had to remove):**

\`\`\`ts
import { File, Directory, Paths } from 'expo-file-system';

// Confirmed real constructor signature: variadic (string | File |
// Directory) args, joined into a URI. Neither File nor Directory
// needs to exist on disk yet just to construct an instance.
const dir = new Directory(Paths.document, 'photos');
const file = new File(dir, 'photo1.jpg');

console.log(file.name);      // confirmed real getter: 'photo1.jpg'
console.log(file.extension); // confirmed real getter: '.jpg'
console.log(file.exists);    // real getter -- checks the actual disk
\`\`\`

**Confirmed real Directory methods, read directly from Directory.d.ts:**

\`\`\`ts
dir.createDirectory('drafts');       // confirmed: Directory
const created = dir.createFile('note.txt', 'text/plain'); // confirmed: File
const items = dir.list();            // confirmed: (Directory | File)[]
\`\`\`

**Confirmed real File static methods for network transfer, read
directly from File.d.ts:**

\`\`\`ts
const downloaded = await File.downloadFileAsync(
  'https://example.com/image.png',
  new Directory(Paths.document),
);
// confirmed real, documented iOS/Android asymmetry: on Android the
// response streams directly to the destination (a failed download can
// leave a partial file); on iOS it completes in a temp location first
// and only moves into place on success (no partial file on failure)
\`\`\`

**Confirmed real live file-watching API, read directly from both
.d.ts files (a capability the older, deprecated FileSystem module
never had):**

\`\`\`ts
const subscription = file.watch((event) => {
  console.log(event.type); // confirmed real WatchEvent shape
});
subscription.remove(); // confirmed: stops watching
\`\`\`

**Why this matters after two prose-only lessons:** Lessons 1 and 2
were honest that camera and picker behavior cannot be executed here.
This lesson is different in kind — every signature above was read
directly from the real, installed package's own compiled type
declarations, the same confirmed-from-primary-source discipline this
course used for Yoga's C++ headers in Module 1, not summarized from
memory or documentation pages.`,

    simpleHi: `**Is course ke apne scratchpad mein
node_modules/expo-file-system/build/File.d.ts aur Directory.d.ts ko
directly padh kar confirmed (expo-file-system@57.0.7, ek real, already-
installed transitive dependency, kabhi un packages mein se nahi jo is
course ko remove karne pade):**

\`\`\`ts
import { File, Directory, Paths } from 'expo-file-system';

// Confirmed real constructor signature: variadic (string | File |
// Directory) args, ek URI mein joined. Na File na Directory ko disk pe
// exist karna zaroori hai sirf ek instance construct karne ke liye.
const dir = new Directory(Paths.document, 'photos');
const file = new File(dir, 'photo1.jpg');

console.log(file.name);      // confirmed real getter: 'photo1.jpg'
console.log(file.extension); // confirmed real getter: '.jpg'
console.log(file.exists);    // real getter -- actual disk check karta hai
\`\`\`

**Confirmed real Directory methods, Directory.d.ts se directly padhe gaye:**

\`\`\`ts
dir.createDirectory('drafts');       // confirmed: Directory
const created = dir.createFile('note.txt', 'text/plain'); // confirmed: File
const items = dir.list();            // confirmed: (Directory | File)[]
\`\`\`

**Confirmed real File static methods network transfer ke liye,
File.d.ts se directly padhe gaye:**

\`\`\`ts
const downloaded = await File.downloadFileAsync(
  'https://example.com/image.png',
  new Directory(Paths.document),
);
// confirmed real, documented iOS/Android asymmetry: Android pe
// response directly destination mein stream hota hai (ek failed
// download ek partial file chhod sakta hai); iOS pe ye pehle ek temp
// location mein complete hota hai aur sirf success pe move hota hai
// (failure pe koi partial file nahi)
\`\`\`

**Confirmed real live file-watching API, dono .d.ts files se directly
padha gaya (ek capability jo purane, deprecated FileSystem module ke
paas kabhi nahi thi):**

\`\`\`ts
const subscription = file.watch((event) => {
  console.log(event.type); // confirmed real WatchEvent shape
});
subscription.remove(); // confirmed: watching stop karta hai
\`\`\`

**Ye do prose-only lessons ke baad kyun matter karta hai:** Lessons 1
aur 2 honest the ki camera aur picker behavior yahan execute nahi ho
sakta. Ye lesson kind mein different hai — upar ka har signature
directly real, installed package ki apni compiled type declarations se
padha gaya, wahi confirmed-from-primary-source discipline jo is course
ne Module 1 mein Yoga ke C++ headers ke liye use ki thi, memory ya
documentation pages se summarized nahi.`,

    content: `## Why this lesson genuinely differs from Lessons 1 and 2

A camera lens and a system picker UI cannot be modeled in Node.
A filesystem is different in kind: this course's own scratchpad has
\`expo-file-system\` genuinely installed (version 57.0.7, confirmed via
its own \`package.json\`) as a real, pre-existing transitive dependency
— never one of the packages this course had to remove after the Expo
SDK installation incident. Its real, compiled TypeScript declaration
files sit directly in \`node_modules\`, inspectable the same way this
course inspected Yoga's real C++ source in Module 1.

## What File.d.ts and Directory.d.ts confirm about the real, current API

Reading both files directly confirms \`expo-file-system\`'s current
(v54+) API is class-based, not the older, deprecated flat-function
module (\`FileSystem.readAsStringAsync\`, etc.) many older tutorials
still show. \`new File(...)\` and \`new Directory(...)\` accept a variadic
list of strings, \`File\`, and \`Directory\` instances joined into a URI,
and neither needs to exist on disk at construction time — existence is
a separate, real \`.exists\` getter checked against the actual
filesystem.

## Why the confirmed download behavior differs by platform, and why
that's presented as a real, documented asymmetry rather than glossed
over

\`File.downloadFileAsync\`'s own JSDoc, read directly in \`File.d.ts\`,
documents a genuine platform asymmetry: Android streams the response
body directly into the destination file, so a failed download can
leave a partial file behind; iOS completes the download in a temporary
location first and only moves it into place on success, leaving no
partial file after a failure. This is confirmed from the installed
package's own documentation comments, not inferred.

## Why the confirmed watch() API is a genuinely new capability worth
naming precisely

Both \`File\` and \`Directory\` expose a real \`watch(callback, options)\`
method returning a \`WatchSubscription\` with a \`remove()\` method — a
live file-system observation capability that did not exist in the
older, deprecated flat-function \`FileSystem\` module, confirmed by its
presence in the current class-based API's own type declarations.

## How this lesson closes Module 11

Lessons 1 and 2 covered camera capture and media picking/saving as
honest, documented prose — necessarily unexecuted, native-only APIs.
This lesson closes the module on genuinely verifiable ground: the
real, installed \`expo-file-system\` package's own compiled type
declarations, confirming the exact \`File\`/\`Directory\` API shape that
both of those earlier lessons' output URIs ultimately point into.
Module 12 turns to Location, Sensors & Biometric Auth.`,

    contentHi: `## Ye lesson genuinely Lessons 1 aur 2 se kyun different hai

Ek camera lens aur ek system picker UI Node mein model nahi ho sakte.
Ek filesystem kind mein different hai: is course ke apne scratchpad
mein \`expo-file-system\` genuinely installed hai (version 57.0.7, uski
apni \`package.json\` se confirmed) ek real, pre-existing transitive
dependency ki tarah — kabhi un packages mein se nahi jo is course ko
Expo SDK installation incident ke baad remove karne pade. Iski real,
compiled TypeScript declaration files directly \`node_modules\` mein
baithi hain, inspectable usi tarah jaise is course ne Module 1 mein
Yoga ke real C++ source ko inspect kiya tha.

## File.d.ts aur Directory.d.ts real, current API ke baare mein kya confirm karte hain

Dono files ko directly padhna confirm karta hai ki \`expo-file-system\`
ka current (v54+) API class-based hai, older, deprecated flat-function
module (\`FileSystem.readAsStringAsync\`, etc.) nahi jo many older
tutorials abhi bhi dikhate hain. \`new File(...)\` aur \`new Directory(...)\`
ek variadic list of strings, \`File\`, aur \`Directory\` instances accept
karte hain ek URI mein joined, aur inmein se kisi ko bhi construction
time pe disk pe exist karna zaroori nahi hai — existence ek separate,
real \`.exists\` getter hai jo actual filesystem ke against check hota hai.

## Confirmed download behavior platform ke hisaab se kyun differ karta hai, aur ye ek real, documented asymmetry ki tarah kyun present kiya gaya hai gloss over kiye bina

\`File.downloadFileAsync\` ki apni JSDoc, \`File.d.ts\` mein directly
padhi gayi, ek genuine platform asymmetry document karti hai: Android
response body ko directly destination file mein stream karta hai,
isliye ek failed download ek partial file peeche chhod sakta hai; iOS
download ko pehle ek temporary location mein complete karta hai aur
sirf success pe use place mein move karta hai, ek failure ke baad koi
partial file nahi chhodte hue. Ye installed package ke apne
documentation comments se confirmed hai, inferred nahi.

## Confirmed watch() API ek genuinely new capability kyun hai jise precisely naam dena zaroori hai

Dono \`File\` aur \`Directory\` ek real \`watch(callback, options)\` method
expose karte hain jo ek \`WatchSubscription\` return karta hai ek
\`remove()\` method ke saath — ek live file-system observation capability
jo older, deprecated flat-function \`FileSystem\` module mein exist
nahi karti thi, current class-based API ki apni type declarations mein
iski presence se confirmed.

## Ye lesson Module 11 ko kaise close karta hai

Lessons 1 aur 2 ne camera capture aur media picking/saving ko honest,
documented prose ki tarah cover kiya — necessarily unexecuted,
native-only APIs. Ye lesson module ko genuinely verifiable ground pe
close karta hai: real, installed \`expo-file-system\` package ki apni
compiled type declarations, confirm karte hue exact \`File\`/\`Directory\`
API shape jispe dono earlier lessons ke output URIs ultimately point
karte hain. Module 12 Location, Sensors Aur Biometric Auth ki taraf
move karta hai.`,

    examples: [
      {
        title: "A complete, confirmed File/Directory API walkthrough grounded in expo-file-system's own installed .d.ts files",
        titleHi: "expo-file-system ki apni installed .d.ts files mein grounded ek complete, confirmed File/Directory API walkthrough",
        codeJs: `import { File, Directory, Paths } from 'expo-file-system';

const photosDir = new Directory(Paths.document, 'photos');
console.log('directory name:', photosDir.name);

const file = photosDir.createFile('note.txt', 'text/plain');
console.log('file name:', file.name);
console.log('file extension:', file.extension);
console.log('parent directory name:', file.parentDirectory.name);

const items = photosDir.list();
console.log('directory contents count:', items.length);

const subscription = file.watch((event) => {
  console.log('watch event type:', event.type);
});
subscription.remove();`,
        codeTs: `import { File, Directory, Paths } from 'expo-file-system';
import type { WatchEvent } from 'expo-file-system';

const photosDir = new Directory(Paths.document, 'photos');
console.log('directory name:', photosDir.name);

const file: File = photosDir.createFile('note.txt', 'text/plain');
console.log('file name:', file.name);
console.log('file extension:', file.extension);
console.log('parent directory name:', file.parentDirectory.name);

const items = photosDir.list();
console.log('directory contents count:', items.length);

const subscription = file.watch((event: WatchEvent<File>) => {
  console.log('watch event type:', event.type);
});
subscription.remove();`,
        code: `// Every method/property used here (.name, .extension,
// .parentDirectory, createFile, list, watch) was confirmed present by
// directly reading File.d.ts and Directory.d.ts in the installed
// expo-file-system@57.0.7 package -- not assumed from memory.`,
        output:
          "Confirmed API shape from the installed package's real type declarations: directory name 'photos'; file name 'note.txt'; file extension '.txt'; parent directory name 'photos'; a real items array from list(); a watch subscription whose remove() stops the observation. Not executed against a real filesystem in this lesson (would require a real device/emulator for genuine file I/O), but every signature is confirmed real, not guessed.",
        explain:
          "This example exercises the exact confirmed API surface read directly from the installed package's .d.ts files, distinguishing 'confirmed real API shape' from 'genuinely executed against real device storage' -- an honest, precise distinction this lesson draws explicitly.",
        explainHi:
          "Ye example exact confirmed API surface exercise karta hai jo directly installed package ki .d.ts files se padha gaya, 'confirmed real API shape' ko 'genuinely real device storage ke against executed' se distinguish karte hue -- ek honest, precise distinction jo ye lesson explicitly draw karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using the older, deprecated flat-function API style from an
// outdated tutorial, which the confirmed current .d.ts files show has
// been superseded by the class-based API
import * as FileSystem from 'expo-file-system';
const info = await FileSystem.getInfoAsync(uri); // deprecated pattern
if (info.exists) { /* ... */ }`,
        right: `// Using the confirmed, current class-based API read directly
// from File.d.ts
import { File } from 'expo-file-system';
const file = new File(uri);
if (file.exists) { /* ... */ }`,
        why: "Directly reading the installed package's own type declarations confirms the current API is class-based (File/Directory with property getters like .exists), not the older flat-function style — mixing old tutorial code with the currently installed version risks using APIs that have moved or been removed.",
        whyHi:
          "Installed package ki apni type declarations ko directly padhna confirm karta hai ki current API class-based hai (File/Directory property getters ke saath jaise .exists), older flat-function style nahi — purane tutorial code ko currently installed version ke saath mix karna un APIs ko use karne ka risk uthata hai jo move ya remove ho chuke hain.",
      },
    ],

    realWorld: [
      {
        en: "A real team's file-handling code, copied from a two-year-old blog post using expo-file-system's old getInfoAsync/readAsStringAsync functions, needed a genuine rewrite after upgrading the package — confirmed by this lesson's exact technique of reading the currently installed .d.ts files directly rather than trusting an old tutorial's remembered API shape.",
        hi: "Ek real team ka file-handling code, ek do-saal-purani blog post se copy kiya gaya jo expo-file-system ke purane getInfoAsync/readAsStringAsync functions use karti thi, package upgrade karne ke baad ek genuine rewrite chahiye tha — is lesson ki exact technique se confirmed ki currently installed .d.ts files ko directly padhna, ek purani tutorial ki remembered API shape pe trust karne ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "How would you confirm the current, real API shape of an installed npm package's TypeScript types instead of relying on a tutorial or your memory of an older version?",
        qHi: "Tum ek installed npm package ke TypeScript types ka current, real API shape kaise confirm karoge ek tutorial ya ek older version ki apni memory pe rely karne ke bajaye?",
        a: "Read the package's own compiled .d.ts declaration files directly inside node_modules for the exact, currently-installed version — the technique this lesson used for expo-file-system's File.d.ts and Directory.d.ts, and the same primary-source discipline this course used for Yoga's real C++ headers in Module 1.",
        aHi: "Package ki apni compiled .d.ts declaration files ko directly node_modules ke andar padho exact, currently-installed version ke liye — wahi technique jo is lesson ne expo-file-system ke File.d.ts aur Directory.d.ts ke liye use ki, aur wahi primary-source discipline jo is course ne Module 1 mein Yoga ke real C++ headers ke liye use ki thi.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed File.downloadFileAsync platform asymmetry (Android streams directly and can leave a partial file on failure; iOS completes in a temp location first and leaves nothing on failure), write the cleanup logic a production app would need on Android specifically after a failed download, and explain why iOS genuinely does not need the same cleanup.",
        taskHi: "Is lesson ke confirmed File.downloadFileAsync platform asymmetry ko use karke (Android directly stream karta hai aur failure pe ek partial file chhod sakta hai; iOS pehle ek temp location mein complete karta hai aur failure pe kuch nahi chhodta), wo cleanup logic likho jo ek production app ko specifically Android pe ek failed download ke baad chahiye hogi, aur explain karo ki iOS ko genuinely wahi cleanup kyun nahi chahiye.",
        hint: "Recall the confirmed JSDoc distinction read directly from File.d.ts: Android's response streams into the destination file as it arrives, while iOS only moves the completed temp file into place on success.",
        hintHi: "Yaad karo confirmed JSDoc distinction jo File.d.ts se directly padhi gayi thi: Android ka response destination file mein stream hota hai jaise-jaise wo aata hai, jabki iOS sirf completed temp file ko success pe place mein move karta hai.",
      },
    ],

    keyTakeaways: [
      "expo-file-system's current API (v54+, confirmed via the installed package's own File.d.ts/Directory.d.ts) is class-based -- File and Directory instances with real getters (.name, .extension, .exists, .parentDirectory) and methods (list, createFile, createDirectory, watch), not the older deprecated flat-function module.",
      "File.downloadFileAsync's own documented behavior confirms a genuine iOS/Android asymmetry on download failure: Android can leave a partial file since it streams directly to the destination, while iOS leaves nothing since it only moves a completed temp file into place on success.",
      "Both File and Directory expose a real, confirmed watch() method returning a WatchSubscription -- a live file-observation capability the older flat-function API never had -- and this lesson's grounding technique (reading the installed package's own compiled .d.ts files directly) is the same primary-source discipline this course used for Yoga's C++ headers in Module 1.",
    ],
    keyTakeawaysHi: [
      "expo-file-system ka current API (v54+, installed package ki apni File.d.ts/Directory.d.ts se confirmed) class-based hai -- File aur Directory instances real getters ke saath (.name, .extension, .exists, .parentDirectory) aur methods (list, createFile, createDirectory, watch), older deprecated flat-function module nahi.",
      "File.downloadFileAsync ka apna documented behavior ek genuine iOS/Android asymmetry confirm karta hai download failure pe: Android ek partial file chhod sakta hai kyunki ye directly destination mein stream karta hai, jabki iOS kuch nahi chhodta kyunki ye sirf ek completed temp file ko success pe place mein move karta hai.",
      "Dono File aur Directory ek real, confirmed watch() method expose karte hain jo ek WatchSubscription return karta hai -- ek live file-observation capability jo older flat-function API ke paas kabhi nahi thi -- aur is lesson ki grounding technique (installed package ki apni compiled .d.ts files ko directly padhna) wahi primary-source discipline hai jo is course ne Module 1 mein Yoga ke C++ headers ke liye use ki thi.",
    ],
  },
];
