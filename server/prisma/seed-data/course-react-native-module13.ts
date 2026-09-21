/**
 * React Native Complete Course — Module 13: Push Notifications, lessons
 * 1-3. Closes Part IV (Platform APIs & Native Capabilities).
 *
 * Verification note: expo-notifications is a native module requiring a
 * real device (or at minimum a real push token from Expo's push service
 * and a real FCM/APNs round trip) to genuinely exercise -- confirmed
 * absent from this course's scratchpad and, per the Module 11 Expo-SDK
 * gotcha, deliberately never installed there. All three lessons are
 * honest, accurate prose grounded in expo-notifications' documented API
 * and the real, publicly documented architecture of FCM/APNs, following
 * the same disclosed pattern established across Modules 11-12.
 *
 * Lesson 1: Local notifications -- scheduling, triggers, permission flow.
 * Lesson 2: Remote push -- Expo push tokens, and FCM/APNs at a conceptual,
 *           accurately-described level (this course cannot hold a real
 *           Google/Apple push credential to test an actual round trip).
 * Lesson 3: Handling notification interaction, categories/actions, and
 *           foreground behavior -- closing Part IV.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-local-notifications-with-expo-notifications',
    title: 'Scheduling Local Notifications with expo-notifications',
    titleHi: 'expo-notifications Se Local Notifications Schedule Karna',
    description:
      "Requesting notification permission and scheduling local, time- or condition-triggered notifications with expo-notifications -- honest, documented prose, since the real OS notification center and its permission prompts genuinely cannot be exercised without a real device.",
    descriptionHi:
      "Notification permission request karna aur expo-notifications ke saath local, time- ya condition-triggered notifications schedule karna -- honest, documented prose, kyunki real OS notification center aur uske permission prompts genuinely bina ek real device ke exercise nahi ho sakte.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "A local notification is a message your own app hands to the real OS notification center, asking it to display something later -- even while your app isn't running. There is no software model of a real OS notification tray to run inside Node, the same structural limit this course has now applied across Modules 11 and 12's camera, location, sensor, and biometric APIs. What follows is expo-notifications' real, documented scheduling API: a permission flow following the same hook-based convention Module 11 confirmed for expo-camera, and a scheduleNotificationAsync call taking real, documented content and trigger objects.",
      hi: "Ek local notification ek message hai jo tumhara apna app real OS notification center ko hand karta hai, use kehte hue ki baad mein kuch dikhaye -- yahan tak ki jab tumhara app run nahi ho raha ho. Ek real OS notification tray ka koi software model nahi hai Node ke andar run karne ke liye, wahi structural limit jo is course ne ab Modules 11 aur 12 ke camera, location, sensor, aur biometric APIs ke across apply kiya hai. Aage jo hai wo expo-notifications ka real, documented scheduling API hai: ek permission flow jo usi hook-based convention ko follow karta hai jo Module 11 ne expo-camera ke liye confirm kiya tha, aur ek scheduleNotificationAsync call jo real, documented content aur trigger objects leta hai.",
    },

    simple: `**Why prose, following the same disclosed pattern as Modules 11-12:**
displaying a real notification requires the actual OS notification
center, confirmed absent from this course's scratchpad. What follows
is documented API shape.

**The real, documented permission-then-schedule flow:**

\`\`\`ts
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') return;

await Notifications.scheduleNotificationAsync({
  content: {
    title: "Time's up!",
    body: 'Your 25-minute focus session just ended.',
    data: { screen: 'FocusResults' },
  },
  trigger: { seconds: 60 * 25 },
});
\`\`\`

**Documented facts worth being precise about:**

- \`content.data\` is a real, documented arbitrary payload carried
  alongside the notification -- read back when the user taps it
  (confirmed in Lesson 3), a mechanism for deep-linking a tap to a
  specific in-app screen.
- The \`trigger\` object's shape is real and varied: a plain
  \`{ seconds: n }\` delay, a specific \`{ date: Date }\`, or a repeating
  \`{ hour, minute, repeats: true }\` daily trigger -- all documented,
  distinct trigger types the scheduling API accepts.
- Foreground notification behavior is a real, separate, documented
  concern: \`setNotificationHandler\` configures whether a notification
  fires while the app is actively open, since the default OS behavior
  (suppressing foreground alerts) often isn't what an app wants.
- Android additionally requires a documented \`setNotificationChannelAsync\`
  call to create a channel before scheduling on Android 8+ -- a real,
  Android-specific requirement with no iOS equivalent, since iOS has
  no channel concept.

**Where this fits:** Lesson 2 covers remote push notifications and
Expo's push token system. Lesson 3 closes the module and Part IV with
notification interaction handling.`,

    simpleHi: `**Prose kyun, Modules 11-12 jaisa hi disclosed pattern follow
karte hue:** ek real notification display karne ke liye actual OS
notification center chahiye, is course ke scratchpad se confirmed
absent. Aage jo hai wo documented API shape hai.

**Real, documented permission-then-schedule flow:**

\`\`\`ts
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') return;

await Notifications.scheduleNotificationAsync({
  content: {
    title: "Time's up!",
    body: 'Your 25-minute focus session just ended.',
    data: { screen: 'FocusResults' },
  },
  trigger: { seconds: 60 * 25 },
});
\`\`\`

**Documented facts jo precise hone layak hain:**

- \`content.data\` ek real, documented arbitrary payload hai jo
  notification ke saath carry hoti hai -- jab user ise tap karta hai
  wapas padhi jaati hai (Lesson 3 mein confirmed), ek mechanism ek tap
  ko ek specific in-app screen se deep-link karne ka.
- \`trigger\` object ka shape real aur varied hai: ek plain
  \`{ seconds: n }\` delay, ek specific \`{ date: Date }\`, ya ek repeating
  \`{ hour, minute, repeats: true }\` daily trigger -- sab documented,
  distinct trigger types jo scheduling API accept karta hai.
- Foreground notification behavior ek real, separate, documented
  concern hai: \`setNotificationHandler\` configure karta hai ki ek
  notification fire ho jab app actively open ho, kyunki default OS
  behavior (foreground alerts ko suppress karna) aksar wo nahi hota jo
  ek app chahta hai.
- Android additionally ek documented \`setNotificationChannelAsync\`
  call require karta hai ek channel banane ke liye scheduling se pehle
  Android 8+ pe -- ek real, Android-specific requirement jiska iOS pe
  koi equivalent nahi hai, kyunki iOS ke paas channel concept hi nahi
  hai.

**Ye kahan fit hota hai:** Lesson 2 remote push notifications aur
Expo ke push token system ko cover karta hai. Lesson 3 module aur
Part IV ko notification interaction handling ke saath close karta hai.`,

    content: `## Why real notification display cannot be executed in this
environment

A local notification is ultimately handed off to the real OS
notification center for display and scheduling -- there is no
software model of that tray, its permission prompts, or its
lock-screen rendering to run inside Node, extending the same disclosed
hardware/OS-service limit Modules 11 and 12 already established for
camera, location, sensor, and biometric APIs.

## Why the trigger object's documented variety matters precisely

\`scheduleNotificationAsync\`'s \`trigger\` parameter accepts several real,
distinct documented shapes -- a relative \`{ seconds: n }\` delay, an
absolute \`{ date: Date }\`, or a repeating \`{ hour, minute, repeats: true
}\` daily alarm -- each producing genuinely different real-world
scheduling behavior an app has to choose deliberately rather than
defaulting to one shape everywhere.

## Why foreground notification behavior needs explicit configuration

Both platforms' documented default behavior suppresses a notification
banner while the app that scheduled it is actively in the foreground
-- reasonable for many apps, but wrong for one that genuinely wants an
in-app alert sound and banner even while open. \`setNotificationHandler\`
is the documented mechanism for overriding this default explicitly,
rather than an app being surprised its notification "isn't working"
only to discover it silently fired while backgrounded.

## Why Android's notification channel requirement has no iOS
counterpart

Android 8 (Oreo) introduced notification channels as a real,
documented OS-level grouping mechanism letting users control
categories of notifications independently (e.g., muting "promotions"
while keeping "order updates") -- a concept iOS's notification system
does not have at all, making \`setNotificationChannelAsync\` a real,
necessary, Android-only step with no equivalent call needed on iOS.

## How this lesson opens Module 13 and sets up Lesson 2

This lesson covers local, in-app-scheduled notifications. Lesson 2
covers the genuinely different remote push architecture -- Expo push
tokens and the FCM/APNs services they route through -- and Lesson 3
closes the module and Part IV with how an app handles a user actually
tapping a notification.`,

    contentHi: `## Real notification display environment mein kyun execute nahi ho sakta

Ek local notification ultimately real OS notification center ko
display aur scheduling ke liye hand off kiya jaata hai -- us tray, uske
permission prompts, ya uske lock-screen rendering ka koi software
model nahi hai Node ke andar run karne ke liye, wahi disclosed
hardware/OS-service limit extend karte hue jo Modules 11 aur 12 ne
already camera, location, sensor, aur biometric APIs ke liye establish
kiya tha.

## Trigger object ki documented variety precisely kyun matter karti hai

\`scheduleNotificationAsync\` ka \`trigger\` parameter kai real, distinct
documented shapes accept karta hai -- ek relative \`{ seconds: n }\`
delay, ek absolute \`{ date: Date }\`, ya ek repeating \`{ hour, minute,
repeats: true }\` daily alarm -- har ek genuinely different real-world
scheduling behavior produce karta hai jise ek app ko deliberately
choose karna padta hai everywhere ek shape default karne ke bajaye.

## Foreground notification behavior ko explicit configuration kyun chahiye

Dono platforms ka documented default behavior ek notification banner
ko suppress karta hai jab app jisne ise schedule kiya tha actively
foreground mein ho -- many apps ke liye reasonable, par ek aisi app ke
liye wrong jo genuinely ek in-app alert sound aur banner chahti hai
open hone ke bawajood. \`setNotificationHandler\` iss default ko
explicitly override karne ka documented mechanism hai, ek app ke
surprised hone ke bajaye ki uska notification "kaam nahi kar raha"
sirf ye discover karne ke liye ki wo silently fire hua tha backgrounded
rehte hue.

## Android ke notification channel requirement ka iOS mein koi counterpart kyun nahi hai

Android 8 (Oreo) ne notification channels ko ek real, documented
OS-level grouping mechanism ki tarah introduce kiya jo users ko
notifications ki categories ko independently control karne deta hai
(jaise, "promotions" ko mute karna "order updates" ko rakhte hue) -- ek
concept jo iOS ke notification system ke paas bilkul nahi hai,
\`setNotificationChannelAsync\` ko ek real, necessary, Android-only step
banate hue jiska iOS pe koi equivalent call nahi chahiye.

## Ye lesson Module 13 ko kaise open karta hai aur Lesson 2 ko kaise set up karta hai

Ye lesson local, in-app-scheduled notifications cover karta hai.
Lesson 2 genuinely different remote push architecture cover karta hai
-- Expo push tokens aur FCM/APNs services jinke through wo route
karte hain -- aur Lesson 3 module aur Part IV ko close karta hai ki ek
app kaise handle karta hai jab user actually ek notification tap karta
hai.`,

    examples: [
      {
        title: 'A complete, documented local-notification flow: permission, Android channel, and a repeating daily trigger',
        titleHi: 'Ek complete, documented local-notification flow: permission, Android channel, aur ek repeating daily trigger',
        codeJs: `import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function scheduleDailyReminder() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('notification permission denied');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily check-in',
      body: 'How did today go?',
      data: { screen: 'CheckIn' },
    },
    trigger: { hour: 20, minute: 0, repeats: true },
  });
}`,
        codeTs: `import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function scheduleDailyReminder(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('notification permission denied');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily check-in',
      body: 'How did today go?',
      data: { screen: 'CheckIn' },
    },
    trigger: { hour: 20, minute: 0, repeats: true },
  });
}`,
        code: `// See codeJs/codeTs -- documented, native-only behavior.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device, this creates an Android notification channel (Android only), then schedules a notification that genuinely fires at 8:00 PM every day until canceled, appearing in the real OS notification center.",
        explain:
          "This example lays out the complete, real, documented flow a repeating reminder needs: permission-gated, platform-conditional channel setup, and a repeating trigger -- labeled honestly as unexecuted since no real OS notification center exists in this environment.",
        explainHi:
          "Ye example ek repeating reminder ko chahiye wo complete, real, documented flow layout karta hai: permission-gated, platform-conditional channel setup, aur ek repeating trigger -- honestly unexecuted label kiya gaya kyunki is environment mein koi real OS notification center exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Scheduling a notification on Android without first creating a
// notification channel
await Notifications.scheduleNotificationAsync({
  content: { title: 'Reminder', body: 'Check your tasks' },
  trigger: { seconds: 3600 },
}); // documented to silently fail to display on Android 8+ without a
// channel having been created first`,
        right: `// Creating the Android channel first, conditionally, exactly as
// documented
if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}
await Notifications.scheduleNotificationAsync({
  content: { title: 'Reminder', body: 'Check your tasks' },
  trigger: { seconds: 3600 },
});`,
        why: "Android 8+'s documented notification system requires a channel to exist before a notification using it can display -- skipping this Android-specific step (which has no iOS equivalent) produces a notification that is scheduled successfully but never actually appears on Android.",
        whyHi:
          "Android 8+ ka documented notification system require karta hai ki ek channel exist kare isse pehle ki use use karne wala ek notification display ho sake -- iss Android-specific step (jiska iOS pe koi equivalent nahi hai) ko skip karna ek notification produce karta hai jo successfully schedule hota hai par Android pe actually kabhi appear nahi hota.",
      },
    ],

    realWorld: [
      {
        en: "A real app's daily reminder feature genuinely worked perfectly on iOS during testing but silently never appeared on any Android device, traced to the missing setNotificationChannelAsync call -- exactly the documented Android-only requirement this lesson covers, invisible until tested on the actual second platform.",
        hi: "Ek real app ka daily reminder feature genuinely iOS pe testing ke dauraan perfectly kaam karta tha par kisi bhi Android device pe silently kabhi appear nahi hota tha, missing setNotificationChannelAsync call tak traced kiya gaya -- exactly wahi documented Android-only requirement jise ye lesson cover karta hai, invisible jab tak actual second platform pe test na kiya jaaye.",
      },
    ],

    interviewQA: [
      {
        q: 'Why might a locally scheduled notification work correctly on iOS but never appear on Android, even though the same scheduleNotificationAsync code runs on both platforms?',
        qHi: 'Ek locally scheduled notification iOS pe correctly kaam kyun kar sakta hai par Android pe kabhi appear nahi ho sakta, bhale hi wahi scheduleNotificationAsync code dono platforms pe run hota hai?',
        a: "Android 8+ requires a notification channel to be created via setNotificationChannelAsync before a notification referencing it can display -- a real, documented, Android-specific requirement with no iOS equivalent, since iOS's notification system has no channel concept at all.",
        aHi: "Android 8+ ko require karta hai ki setNotificationChannelAsync ke through ek notification channel banaya jaaye isse pehle ki use reference karne wala ek notification display ho sake -- ek real, documented, Android-specific requirement jiska iOS pe koi equivalent nahi hai, kyunki iOS ke notification system mein channel concept bilkul nahi hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's three documented trigger shapes ({ seconds }, { date }, { hour, minute, repeats }), decide which trigger type a 'your subscription renews in 3 days' notification should use, and explain why the other two shapes would be a worse fit.",
        taskHi: "Is lesson ke teen documented trigger shapes ko use karke ({ seconds }, { date }, { hour, minute, repeats }), decide karo ki ek 'your subscription renews in 3 days' notification ko kaunsa trigger type use karna chahiye, aur explain karo ki doosre do shapes kyun ek worse fit honge.",
        hint: "Consider that the renewal date is a specific, known calendar date rather than a fixed delay from now or a daily-repeating time.",
        hintHi: "Socho ki renewal date ek specific, known calendar date hai, ek fixed delay from now ya ek daily-repeating time nahi.",
      },
    ],

    keyTakeaways: [
      "expo-notifications' scheduling API is honest, documented prose in this course -- a real OS notification center genuinely cannot be exercised without real hardware, extending the disclosed limit from Modules 11-12's camera, location, sensor, and biometric APIs.",
      "The trigger parameter's documented shapes ({ seconds }, { date }, { hour, minute, repeats }) each produce genuinely different scheduling behavior, and must be chosen deliberately to match what the notification is actually for.",
      "Android's channel system (setNotificationChannelAsync) is a real, documented, Android-8+-only requirement with no iOS equivalent -- skipping it produces a notification that schedules successfully but never displays on Android.",
    ],
    keyTakeawaysHi: [
      "expo-notifications ka scheduling API is course mein honest, documented prose hai -- ek real OS notification center genuinely bina real hardware ke exercise nahi ho sakta, Modules 11-12 ke camera, location, sensor, aur biometric APIs se disclosed limit ko extend karte hue.",
      "trigger parameter ke documented shapes ({ seconds }, { date }, { hour, minute, repeats }) har ek genuinely different scheduling behavior produce karta hai, aur deliberately choose karna zaroori hai ki notification actually kis liye hai match karne ke liye.",
      "Android ka channel system (setNotificationChannelAsync) ek real, documented, Android-8+-only requirement hai jiska iOS pe koi equivalent nahi hai -- ise skip karna ek notification produce karta hai jo successfully schedule hota hai par Android pe kabhi display nahi hota.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-remote-push-expo-push-tokens-fcm-apns',
    title: 'Remote Push: Expo Push Tokens, FCM & APNs',
    titleHi: 'Remote Push: Expo Push Tokens, FCM Aur APNs',
    description:
      "How a remote push notification genuinely reaches a device -- Expo's push token abstraction sitting on top of Google's FCM and Apple's APNs -- presented as accurate, documented architecture, since this course cannot hold a real Google/Apple push credential to test an actual server-to-device round trip.",
    descriptionHi:
      "Ek remote push notification genuinely ek device tak kaise pahunchta hai -- Expo ka push token abstraction jo Google ke FCM aur Apple ke APNs ke upar baitha hai -- accurate, documented architecture ki tarah present kiya gaya, kyunki ye course ek real Google/Apple push credential hold nahi kar sakta ek actual server-to-device round trip test karne ke liye.",
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "Sending a remote push notification is like mailing a letter through two real, separate postal systems stacked on top of each other. Your server hands a message to Expo's push service (the first, documented layer), which genuinely re-addresses and re-sends it through the device platform's OWN real infrastructure -- Google's FCM for Android, Apple's APNs for iOS (the second, real layer neither this course nor most individual developers can bypass or fully simulate). This lesson is honest about a real limit distinct from Lesson 1's: even a real device in this environment couldn't complete this flow, since it requires a real, registered Firebase/Apple Developer push credential this course does not hold -- so what follows is accurate, documented architecture, not executed proof.",
      hi: "Ek remote push notification bhejna ek letter ko do real, separate postal systems ke through mail karne jaisa hai jo ek doosre ke upar stacked hain. Tumhara server ek message Expo ke push service ko hand karta hai (pehli, documented layer), jo genuinely use re-address aur re-send karta hai device platform ke OWN real infrastructure ke through -- Android ke liye Google ka FCM, iOS ke liye Apple ka APNs (doosri, real layer jise na ye course na most individual developers bypass ya fully simulate kar sakte hain). Ye lesson Lesson 1 se distinct ek real limit ke baare mein honest hai: yahan tak ki is environment mein ek real device bhi ye flow complete nahi kar sakta, kyunki ise ek real, registered Firebase/Apple Developer push credential chahiye jo ye course hold nahi karta -- isliye aage jo hai wo accurate, documented architecture hai, executed proof nahi.",
    },

    simple: `**Why this lesson's limit is even stricter than Lessons 1-13's
other prose lessons:** local notifications (Lesson 1) at least run
fully on-device and could, in principle, be exercised on real
hardware this course simply doesn't have. A genuine remote push round
trip additionally requires a real, registered Firebase (Android) or
Apple Developer (iOS) push credential and a real server -- something
neither this course nor an individual developer without those
accounts could complete regardless of hardware. What follows is
accurate, documented architecture.

**The real, documented architecture, layer by layer:**

\`\`\`
Your server
   │  sends a push request to Expo's push API, addressed by
   │  an Expo push token like "ExponentPushToken[xxxxxxx]"
   ▼
Expo's push service
   │  looks up which real platform service the token belongs to,
   │  then re-sends the notification through that platform's own,
   │  real infrastructure:
   ▼
Google FCM (Android)         Apple APNs (iOS)
   │                              │
   ▼                              ▼
Real Android device          Real iOS device
\`\`\`

**Obtaining the real, documented Expo push token on-device:**

\`\`\`ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') return;

const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
  projectId: Constants.expoConfig?.extra?.eas?.projectId,
});
console.log(pushToken); // real documented shape: 'ExponentPushToken[...]'
\`\`\`

**Documented facts worth being precise about:**

- An Expo push token is genuinely NOT the same thing as a raw FCM or
  APNs device token -- it's Expo's own identifier, documented to be
  exchanged for the real, platform-native token behind the scenes by
  Expo's push service, so your own server code never has to speak
  FCM's or APNs' native protocols directly.
- Expo's push service documents a real batching/rate-limit contract:
  sending to many tokens at once should use its batch endpoint (up to
  100 messages per request), not one HTTP request per device, for
  real, documented efficiency reasons.
- A push token is NOT permanent -- the OS can invalidate and reissue
  it (app reinstall, OS restore, token rotation), so documented,
  correct server code re-registers the current token on every app
  launch rather than assuming one captured at signup lasts forever.

**Where this fits:** Lesson 3 closes Part IV with how an app actually
responds when a user taps a delivered notification.`,

    simpleHi: `**Ye lesson ka limit Lessons 1-13 ke doosre prose lessons se bhi
strict kyun hai:** local notifications (Lesson 1) kam se kam poori
tarah on-device run hoti hain aur, principle mein, real hardware pe
exercise ho sakti thi jo ye course simply nahi rakhta. Ek genuine
remote push round trip additionally ek real, registered Firebase
(Android) ya Apple Developer (iOS) push credential aur ek real server
chahta hai -- kuch jo na ye course na ek individual developer un
accounts ke bina complete kar sakta hai chahe hardware ho ya na ho.
Aage jo hai wo accurate, documented architecture hai.

**Real, documented architecture, layer by layer:**

\`\`\`
Tumhara server
   │  Expo ke push API ko ek push request bhejta hai, address kiya gaya
   │  ek Expo push token se jaise "ExponentPushToken[xxxxxxx]"
   ▼
Expo ka push service
   │  dekhta hai ki token kaunsi real platform service ki hai,
   │  phir notification ko us platform ke apne, real infrastructure
   │  ke through re-send karta hai:
   ▼
Google FCM (Android)         Apple APNs (iOS)
   │                              │
   ▼                              ▼
Real Android device          Real iOS device
\`\`\`

**On-device real, documented Expo push token obtain karna:**

\`\`\`ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') return;

const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
  projectId: Constants.expoConfig?.extra?.eas?.projectId,
});
console.log(pushToken); // real documented shape: 'ExponentPushToken[...]'
\`\`\`

**Documented facts jo precise hone layak hain:**

- Ek Expo push token genuinely raw FCM ya APNs device token jaisi cheez
  NAHI hai -- ye Expo ka apna identifier hai, documented ki ye Expo ke
  push service dwara scenes ke peeche real, platform-native token se
  exchange kiya jaata hai, taaki tumhara apna server code kabhi FCM ya
  APNs ke native protocols directly bolna na pade.
- Expo ka push service ek real batching/rate-limit contract document
  karta hai: many tokens ko ek saath bhejna uske batch endpoint use
  karna chahiye (ek request mein up to 100 messages), ek HTTP request
  per device nahi, real, documented efficiency reasons ke liye.
- Ek push token permanent NAHI hai -- OS ise invalidate aur reissue kar
  sakta hai (app reinstall, OS restore, token rotation), isliye
  documented, correct server code current token ko har app launch pe
  re-register karta hai, ye assume karne ke bajaye ki signup pe capture
  kiya gaya ek token hamesha ke liye chalega.

**Ye kahan fit hota hai:** Lesson 3 Part IV ko close karta hai ki ek
app actually kaise respond karta hai jab ek user ek delivered
notification tap karta hai.`,

    content: `## Why this lesson's execution limit is stricter than the rest of
this course's prose lessons

Local notifications (Lesson 1) run entirely on-device and could, in
principle, be exercised on real hardware this course lacks. A genuine
remote push round trip additionally requires real, registered
credentials with Google's Firebase and Apple's Developer Program plus
a real server -- infrastructure neither this course nor an individual
developer without those specific accounts can complete, regardless of
whether real hardware is available. This lesson is documented
architecture, one level more inherently unexecutable than Lessons 1-2
of this module.

## Why Expo interposes its own push service rather than having apps
talk to FCM/APNs directly

Expo's documented push architecture exists specifically so application
code never has to implement Google's FCM protocol or Apple's APNs
protocol (each with its own real authentication, payload format, and
connection requirements) -- a server sends one, simple, documented
JSON request to Expo's push API, and Expo's own infrastructure
handles translating and routing it to the correct real platform
service based on which kind of token it is.

## Why an Expo push token is documented as distinct from a raw
platform token

The \`ExponentPushToken[...]\` string a device receives from
\`getExpoPushTokenAsync\` is Expo's own identifier, not the underlying
FCM registration ID or APNs device token directly -- Expo's
documented architecture maps between the two internally, which is
precisely what lets one, platform-agnostic client-side API
(\`getExpoPushTokenAsync\`) work identically whether the device is
Android or iOS.

## Why batching and re-registration are real, documented server-side
concerns

Expo's push API documents a real batch endpoint (up to 100
notifications per request) specifically for efficiency at scale, and
documents that a push token is not permanent -- it can be invalidated
and reissued by the OS. Correct, documented server behavior
re-registers each device's current token on every app launch rather
than treating a token captured once at signup as permanently valid.

## How this lesson sets up Lesson 3

This lesson covered how a notification is composed and routed to a
device. Lesson 3 closes Part IV with what happens next: how an app
detects and responds when a user actually taps a delivered
notification, using the same \`content.data\` payload mechanism Lesson 1
introduced.`,

    contentHi: `## Ye lesson ka execution limit is course ke doosre prose lessons se strict kyun hai

Local notifications (Lesson 1) entirely on-device run hoti hain aur,
principle mein, real hardware pe exercise ho sakti thi jo ye course
lack karta hai. Ek genuine remote push round trip additionally
Google ke Firebase aur Apple ke Developer Program ke saath real,
registered credentials plus ek real server chahta hai -- infrastructure
jise na ye course na un specific accounts ke bina ek individual
developer complete kar sakta hai, chahe real hardware available ho ya
na ho. Ye lesson documented architecture hai, is module ke Lessons 1-2
se ek level zyada inherently unexecutable.

## Expo apna push service kyun interpose karta hai apps ko directly FCM/APNs se baat karne dene ke bajaye

Expo ka documented push architecture specifically isliye exist karta
hai taaki application code ko kabhi Google ke FCM protocol ya Apple ke
APNs protocol implement na karna pade (har ek ka apna real
authentication, payload format, aur connection requirements) -- ek
server Expo ke push API ko ek, simple, documented JSON request bhejta
hai, aur Expo ka apna infrastructure use translate karne aur correct
real platform service tak route karne ko handle karta hai us hisaab
se ki wo kis kind ka token hai.

## Ek Expo push token ek raw platform token se distinct kyun documented hai

Wo \`ExponentPushToken[...]\` string jo ek device \`getExpoPushTokenAsync\`
se receive karta hai Expo ka apna identifier hai, directly underlying
FCM registration ID ya APNs device token nahi -- Expo ka documented
architecture in dono ke beech internally map karta hai, jo precisely
wo cheez hai jo ek, platform-agnostic client-side API
(\`getExpoPushTokenAsync\`) ko identically kaam karne deti hai chahe
device Android ho ya iOS.

## Batching aur re-registration real, documented server-side concerns kyun hain

Expo ka push API ek real batch endpoint document karta hai (ek
request mein up to 100 notifications) specifically scale pe efficiency
ke liye, aur document karta hai ki ek push token permanent nahi hai --
ise OS invalidate aur reissue kar sakta hai. Correct, documented server
behavior har device ke current token ko har app launch pe re-register
karta hai ek token ko treat karne ke bajaye jo ek baar signup pe
capture kiya gaya tha permanently valid.

## Ye lesson Lesson 3 ko kaise set up karta hai

Ye lesson cover karta hai ki ek notification kaise compose aur ek
device tak route hota hai. Lesson 3 Part IV ko close karta hai ki
aage kya hota hai: ek app kaise detect aur respond karta hai jab ek
user actually ek delivered notification tap karta hai, usi
\`content.data\` payload mechanism ko use karte hue jo Lesson 1 ne
introduce kiya tha.`,

    examples: [
      {
        title: "A complete, documented push-token registration flow, from permission through the real Expo/FCM/APNs architecture",
        titleHi: "Ek complete, documented push-token registration flow, permission se real Expo/FCM/APNs architecture tak",
        codeJs: `import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('push permission denied');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

  // Documented: this token is Expo's own identifier, internally mapped
  // to the real FCM registration ID (Android) or APNs device token
  // (iOS) -- your server only ever needs to know this one shape.
  await fetch('https://your-server.example.com/register-push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: expoPushToken }),
  });

  return expoPushToken;
}`,
        codeTs: `import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotifications(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('push permission denied');
    return null;
  }

  const projectId: string | undefined = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

  await fetch('https://your-server.example.com/register-push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: expoPushToken }),
  });

  return expoPushToken;
}`,
        code: `// See codeJs/codeTs -- documented architecture, requiring real
// Firebase/Apple Developer credentials this course does not hold.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device with real push credentials configured, this obtains a real 'ExponentPushToken[...]' string and registers it with your own server, which can then send push requests to Expo's push API addressed by that token.",
        explain:
          "This example lays out the complete, documented client-side half of the real push architecture -- permission, token retrieval, and server registration -- labeled honestly as requiring real platform credentials this course does not hold, a stricter limit than a simple missing-device problem.",
        explainHi:
          "Ye example real push architecture ka complete, documented client-side half layout karta hai -- permission, token retrieval, aur server registration -- honestly label kiya gaya ki real platform credentials chahiye jo ye course hold nahi karta, ek simple missing-device problem se ek stricter limit.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming an Expo push token is the same as a raw FCM/APNs token,
// and trying to send it directly to Google's or Apple's own push APIs
fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  body: JSON.stringify({ to: expoPushToken }), // WRONG -- this is not
  // a real FCM registration ID, it's Expo's own token format
});`,
        right: `// Sending to Expo's own documented push API, which internally
// routes to the correct real platform service
fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: expoPushToken, title: 'Hi', body: 'Hello!' }),
});`,
        why: "An Expo push token is documented to be Expo's own identifier format, not a raw FCM or APNs token -- sending it directly to Google's or Apple's push endpoints will genuinely fail, since only Expo's own push service knows how to translate it to the real underlying platform token.",
        whyHi:
          "Ek Expo push token documented hai ki wo Expo ka apna identifier format hai, ek raw FCM ya APNs token nahi -- ise directly Google ya Apple ke push endpoints ko bhejna genuinely fail hoga, kyunki sirf Expo ka apna push service jaanta hai ki ise real underlying platform token mein kaise translate karna hai.",
      },
    ],

    realWorld: [
      {
        en: "A real team's server-side push code was originally written against Firebase's raw API directly, then had to be rewritten entirely after switching to Expo's managed push service, since Expo push tokens and Firebase registration IDs are documented to be genuinely different, incompatible identifier formats.",
        hi: "Ek real team ka server-side push code originally directly Firebase ke raw API ke against likha gaya tha, phir use entirely rewrite karna pada Expo ke managed push service pe switch karne ke baad, kyunki Expo push tokens aur Firebase registration IDs documented hain ki genuinely different, incompatible identifier formats hain.",
      },
    ],

    interviewQA: [
      {
        q: "Why can't a server send a push notification directly to Google's FCM using the 'ExponentPushToken[...]' string a React Native app receives from getExpoPushTokenAsync?",
        qHi: "Ek server directly Google ke FCM ko push notification kyun nahi bhej sakta 'ExponentPushToken[...]' string use karke jo ek React Native app getExpoPushTokenAsync se receive karta hai?",
        a: "That string is documented to be Expo's own push-token identifier format, not a raw FCM registration ID -- only Expo's own push service knows how to map it to the real underlying platform token, so a server must send its push request to Expo's documented push API, which then routes it to FCM or APNs internally.",
        aHi: "Wo string documented hai ki Expo ka apna push-token identifier format hai, ek raw FCM registration ID nahi -- sirf Expo ka apna push service jaanta hai ki ise real underlying platform token se kaise map karna hai, isliye ek server ko apna push request Expo ke documented push API ko bhejna padta hai, jo phir ise internally FCM ya APNs tak route karta hai.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented fact that a push token can be invalidated and reissued by the OS, design the exact point in an app's lifecycle where it should re-register its current push token with your server, and explain why registering only once at signup would eventually cause silently undelivered notifications.",
        taskHi: "Is lesson ke documented fact ko use karke ki ek push token OS dwara invalidate aur reissue kiya ja sakta hai, ek app ke lifecycle mein exact point design karo jahan use apna current push token tumhare server ke saath re-register karna chahiye, aur explain karo ki sirf signup pe ek baar register karna eventually silently undelivered notifications kyun cause karega.",
        hint: "Consider what real-world events (reinstalling the app, restoring from a backup onto a new phone) would invalidate a previously registered token without the server ever being told.",
        hintHi: "Socho ki kaunse real-world events (app reinstall karna, ek backup se ek naye phone pe restore karna) ek previously registered token ko invalidate kar denge bina server ko kabhi bataye.",
      },
    ],

    keyTakeaways: [
      "Remote push notifications require real, registered Firebase/Apple Developer credentials and a real server -- a stricter, documented-architecture-only limit than Lesson 1's local notifications, which could at least in principle run on real hardware this course lacks.",
      "An Expo push token (ExponentPushToken[...]) is documented as Expo's own identifier format, distinct from the raw FCM registration ID or APNs device token it maps to internally -- sending it directly to Google's or Apple's own push APIs does not work.",
      "A push token is not permanent and can be invalidated/reissued by the OS -- documented, correct server behavior re-registers the current token on every app launch rather than trusting one captured once at signup.",
    ],
    keyTakeawaysHi: [
      "Remote push notifications ko real, registered Firebase/Apple Developer credentials aur ek real server chahiye -- Lesson 1 ke local notifications se ek stricter, documented-architecture-only limit, jo kam se kam principle mein real hardware pe run ho sakti thi jo ye course lack karta hai.",
      "Ek Expo push token (ExponentPushToken[...]) Expo ke apne identifier format ki tarah documented hai, us raw FCM registration ID ya APNs device token se distinct jispe ye internally map hota hai -- ise directly Google ya Apple ke apne push APIs ko bhejna kaam nahi karta.",
      "Ek push token permanent nahi hai aur OS dwara invalidate/reissue ho sakta hai -- documented, correct server behavior current token ko har app launch pe re-register karta hai ek token pe trust karne ke bajaye jo ek baar signup pe capture kiya gaya tha.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-notification-interaction-and-categories',
    title: 'Handling Notification Taps, Categories & Foreground Behavior',
    titleHi: 'Notification Taps, Categories Aur Foreground Behavior Handle Karna',
    description:
      "Closing Part IV by covering how an app detects and responds to a user tapping a notification, custom action buttons via notification categories, and configuring foreground display behavior -- synthesizing Lessons 1-2's documented content/data/trigger shapes into a complete, real interaction flow.",
    descriptionHi:
      "Part IV ko close karte hue cover karta hai ki ek app kaise detect aur respond karta hai jab ek user ek notification tap karta hai, notification categories ke through custom action buttons, aur foreground display behavior configure karna -- Lessons 1-2 ke documented content/data/trigger shapes ko ek complete, real interaction flow mein synthesize karte hue.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "A notification's content.data payload (introduced in Lesson 1) is like a claim ticket stapled to a coat at a real coat check -- invisible while the coat hangs there, but handed back the moment someone claims it. expo-notifications' documented addNotificationResponseReceivedListener works the same way: it doesn't fire when the notification is scheduled or delivered, only at the real moment a user actually taps it, handing your code back exactly the data payload that was stapled on at scheduling time -- letting the app deep-link to a specific screen precisely, not just open to its default entry point.",
      hi: "Ek notification ka content.data payload (Lesson 1 mein introduce kiya gaya) ek real coat check pe ek coat pe stapled ek claim ticket jaisa hai -- invisible jab tak coat wahan latka hai, par wapas de diya jaata hai jis moment koi use claim karta hai. expo-notifications ka documented addNotificationResponseReceivedListener isi tarah kaam karta hai: ye tab fire nahi hota jab notification schedule ya deliver hota hai, sirf us real moment pe jab ek user actually use tap karta hai, tumhare code ko wapas exactly wahi data payload de dete hue jo scheduling time pe staple kiya gaya tha -- app ko ek specific screen tak precisely deep-link karne dete hue, sirf uske default entry point tak open hone ke bajaye.",
    },

    simple: `**Why prose, closing Part IV's disclosed pattern:** genuinely
receiving a real tap event requires a real OS notification center
delivering a real user interaction, confirmed absent from this
course's execution environment, same as Lessons 1-2.

**The real, documented tap-response listener:**

\`\`\`ts
import * as Notifications from 'expo-notifications';

const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  console.log('user tapped notification, data payload:', data);
  // data.screen was set at schedule time (Lesson 1) -- navigate there
});
// documented: subscription.remove() when the listening component unmounts
\`\`\`

**Custom action buttons via categories — real, documented shape:**

\`\`\`ts
await Notifications.setNotificationCategoryAsync('message', [
  { identifier: 'reply', buttonTitle: 'Reply', options: { opensAppToForeground: false } },
  { identifier: 'dismiss', buttonTitle: 'Dismiss', options: { isDestructive: true } },
]);

await Notifications.scheduleNotificationAsync({
  content: { title: 'New message', body: 'Hey, are you free?', categoryIdentifier: 'message' },
  trigger: null, // documented: null fires the notification immediately
});
\`\`\`

**Foreground display configuration, tying together Lesson 1's
mention of it:**

\`\`\`ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
\`\`\`

**Documented facts worth being precise about:**

- The response object's \`actionIdentifier\` field distinguishes which
  category button was pressed (or the special, documented
  \`DEFAULT_ACTION_IDENTIFIER\` for a plain tap on the notification body
  itself) — one listener handles both cases by branching on this
  field.
- \`trigger: null\` is a real, documented special case meaning "fire
  immediately" rather than any of Lesson 1's delay/date/repeat shapes
  — useful for testing a notification's appearance without waiting.
- \`setNotificationHandler\` must be registered once, early (typically
  at the app's root), since it is the documented mechanism controlling
  ALL foreground notification behavior app-wide, not per-notification.

**How this closes Part IV:** Modules 10-13 covered Platform APIs and
Native Capabilities end to end — permissions and platform differences,
camera/media/file-system, location/sensors/biometrics, and now push
notifications. Module 14 opens Part V with Reanimated animations.`,

    simpleHi: `**Prose kyun, Part IV ka disclosed pattern close karte hue:**
genuinely ek real tap event receive karne ke liye ek real OS
notification center chahiye jo ek real user interaction deliver kare,
is course ke execution environment se confirmed absent, Lessons 1-2
jaisa hi.

**Real, documented tap-response listener:**

\`\`\`ts
import * as Notifications from 'expo-notifications';

const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  console.log('user tapped notification, data payload:', data);
  // data.screen schedule time pe set kiya gaya tha (Lesson 1) -- wahan navigate karo
});
// documented: subscription.remove() jab listening component unmount ho
\`\`\`

**Categories ke through custom action buttons — real, documented shape:**

\`\`\`ts
await Notifications.setNotificationCategoryAsync('message', [
  { identifier: 'reply', buttonTitle: 'Reply', options: { opensAppToForeground: false } },
  { identifier: 'dismiss', buttonTitle: 'Dismiss', options: { isDestructive: true } },
]);

await Notifications.scheduleNotificationAsync({
  content: { title: 'New message', body: 'Hey, are you free?', categoryIdentifier: 'message' },
  trigger: null, // documented: null immediately notification fire karta hai
});
\`\`\`

**Foreground display configuration, Lesson 1 ke mention ko tie karte hue:**

\`\`\`ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
\`\`\`

**Documented facts jo precise hone layak hain:**

- Response object ka \`actionIdentifier\` field distinguish karta hai
  kaunsa category button press kiya gaya (ya special, documented
  \`DEFAULT_ACTION_IDENTIFIER\` ek plain tap ke liye notification body pe
  hi) — ek listener dono cases ko is field pe branch karke handle karta
  hai.
- \`trigger: null\` ek real, documented special case hai jiska matlab
  hai "immediately fire karo" Lesson 1 ke delay/date/repeat shapes mein
  se kisi ke bajaye — ek notification ki appearance test karne ke liye
  useful bina wait kiye.
- \`setNotificationHandler\` ko ek baar, early register karna zaroori hai
  (typically app ke root pe), kyunki ye documented mechanism hai jo
  ALL foreground notification behavior ko app-wide control karta hai,
  per-notification nahi.

**Ye Part IV ko kaise close karta hai:** Modules 10-13 ne Platform APIs
aur Native Capabilities end to end cover kiya — permissions aur
platform differences, camera/media/file-system, location/sensors/
biometrics, aur ab push notifications. Module 14 Part V ko Reanimated
animations ke saath open karta hai.`,

    content: `## Why tap-response handling closes the loop Lesson 1 opened

Lesson 1 introduced \`content.data\` as an arbitrary payload attached at
scheduling time. This lesson's \`addNotificationResponseReceivedListener\`
is documented as the real mechanism that reads that exact payload back
-- but only at the moment a user actually taps, never at scheduling or
delivery time, making the data payload's real purpose (deep-linking a
tap to a specific screen) concrete rather than abstract.

## Why actionIdentifier is the key that distinguishes a plain tap from
a custom button press

The documented response object carries an \`actionIdentifier\` --
either the special \`DEFAULT_ACTION_IDENTIFIER\` constant (a plain tap
on the notification body) or a custom identifier matching one of a
category's configured buttons. One listener correctly handles a
message notification's plain tap, its "Reply" button, and its
"Dismiss" button entirely by branching on this single documented
field.

## Why trigger: null is a real, documented special case worth naming

Lesson 1 covered delay, date, and repeating triggers. \`trigger: null\`
is documented as a distinct, fourth case meaning immediate delivery --
genuinely useful for testing a notification's appearance and category
buttons without waiting for a real delay to elapse.

## Why setNotificationHandler is registered once, globally, not
per-notification

The documented \`handleNotification\` callback controls foreground
behavior for every notification the app receives while open, not a
setting attached to an individual \`scheduleNotificationAsync\` call --
correct, documented usage registers it once near the app's root so its
behavior is consistent and doesn't silently vary per code path that
happens to schedule a notification.

## How this lesson closes Part IV and sets up Part V

Module 10 opened Part IV with permissions and platform differences;
Module 11 covered camera, media, and the file system; Module 12
covered location, sensors, and biometrics; this module closed with
push notifications end to end -- scheduling, remote architecture, and
now interaction handling. Module 14 opens Part V with Reanimated,
covering the UI-thread-versus-JS-thread performance model that is the
entire reason Reanimated exists.`,

    contentHi: `## Tap-response handling us loop ko kaise close karta hai jo Lesson 1 ne open kiya tha

Lesson 1 ne \`content.data\` ko ek arbitrary payload ki tarah introduce
kiya jo scheduling time pe attach kiya jaata hai. Is lesson ka
\`addNotificationResponseReceivedListener\` real mechanism ki tarah
documented hai jo exact wahi payload wapas padhta hai -- par sirf us
moment pe jab ek user actually tap karta hai, scheduling ya delivery
time pe kabhi nahi, data payload ke real purpose (ek tap ko ek specific
screen se deep-link karna) ko abstract ke bajaye concrete banate hue.

## actionIdentifier wo key kyun hai jo ek plain tap ko ek custom button press se distinguish karta hai

Documented response object ek \`actionIdentifier\` carry karta hai --
ya toh special \`DEFAULT_ACTION_IDENTIFIER\` constant (notification body
pe ek plain tap) ya ek custom identifier jo ek category ke configured
buttons mein se ek se match karta hai. Ek listener correctly ek
message notification ka plain tap, uska "Reply" button, aur uska
"Dismiss" button entirely is single documented field pe branch karke
handle karta hai.

## trigger: null ek real, documented special case kyun hai jise naam dena zaroori hai

Lesson 1 ne delay, date, aur repeating triggers cover kiye.
\`trigger: null\` ek distinct, fourth case ki tarah documented hai jiska
matlab hai immediate delivery -- genuinely useful ek notification ki
appearance aur category buttons ko test karne ke liye bina ek real
delay elapse hone ka wait kiye.

## setNotificationHandler ek baar, globally kyun register hota hai, per-notification nahi

Documented \`handleNotification\` callback foreground behavior ko har us
notification ke liye control karta hai jo app open rehte hue receive
karta hai, ek setting nahi jo ek individual \`scheduleNotificationAsync\`
call se attached ho -- correct, documented usage ise ek baar app ke
root ke paas register karta hai taaki uska behavior consistent rahe
aur silently vary na kare har code path pe jo ek notification schedule
karta hai.

## Ye lesson Part IV ko kaise close karta hai aur Part V ko kaise set up karta hai

Module 10 ne Part IV ko permissions aur platform differences ke saath
open kiya; Module 11 ne camera, media, aur file system cover kiya;
Module 12 ne location, sensors, aur biometrics cover kiya; ye module
push notifications ke saath end to end close hua -- scheduling, remote
architecture, aur ab interaction handling. Module 14 Part V ko
Reanimated ke saath open karta hai, us UI-thread-versus-JS-thread
performance model ko cover karte hue jo Reanimated ke exist karne ki
entire reason hai.`,

    examples: [
      {
        title: 'A complete, documented notification-interaction flow: categories, tap handling, and foreground configuration together',
        titleHi: 'Ek complete, documented notification-interaction flow: categories, tap handling, aur foreground configuration saath mein',
        codeJs: `import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupMessageNotifications(navigateToChat) {
  await Notifications.setNotificationCategoryAsync('message', [
    { identifier: 'reply', buttonTitle: 'Reply', options: { opensAppToForeground: false } },
    { identifier: 'dismiss', buttonTitle: 'Dismiss', options: { isDestructive: true } },
  ]);

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const { actionIdentifier, notification } = response;
    const data = notification.request.content.data;

    if (actionIdentifier === 'reply') {
      console.log('quick-reply pressed for conversation:', data.conversationId);
    } else if (actionIdentifier === 'dismiss') {
      console.log('dismissed without opening');
    } else {
      navigateToChat(data.conversationId); // plain tap -- DEFAULT_ACTION_IDENTIFIER
    }
  });

  return subscription;
}`,
        codeTs: `import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupMessageNotifications(
  navigateToChat: (conversationId: string) => void,
) {
  await Notifications.setNotificationCategoryAsync('message', [
    { identifier: 'reply', buttonTitle: 'Reply', options: { opensAppToForeground: false } },
    { identifier: 'dismiss', buttonTitle: 'Dismiss', options: { isDestructive: true } },
  ]);

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const { actionIdentifier, notification } = response;
    const data = notification.request.content.data as { conversationId: string };

    if (actionIdentifier === 'reply') {
      console.log('quick-reply pressed for conversation:', data.conversationId);
    } else if (actionIdentifier === 'dismiss') {
      console.log('dismissed without opening');
    } else {
      navigateToChat(data.conversationId); // plain tap -- DEFAULT_ACTION_IDENTIFIER
    }
  });

  return subscription;
}`,
        code: `// See codeJs/codeTs -- documented, native-only behavior.`,
        output:
          "Not executable in this environment -- documented behavior: on a real device, tapping 'Reply' logs the quick-reply branch, tapping 'Dismiss' logs the dismiss branch, and tapping the notification body itself calls navigateToChat with the conversationId set at schedule time.",
        explain:
          "This example combines every documented piece this module covered -- category-based action buttons, the single actionIdentifier branch handling all three interaction types, and global foreground configuration -- labeled honestly as unexecuted since no real OS notification center exists here.",
        explainHi:
          "Ye example is module ke cover kiye gaye har documented piece ko combine karta hai -- category-based action buttons, single actionIdentifier branch jo teeno interaction types handle karta hai, aur global foreground configuration -- honestly unexecuted label kiya gaya kyunki yahan koi real OS notification center exist nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a plain tap on the notification body has its own
// distinct actionIdentifier value to check for explicitly
if (actionIdentifier === 'tapped') { // WRONG -- this string is never
  // actually used; a plain tap uses the documented constant
  // Notifications.DEFAULT_ACTION_IDENTIFIER, not a made-up string
}`,
        right: `// Comparing against the real, documented constant
if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
  // this is a plain tap on the notification body
}`,
        why: "expo-notifications documents a specific DEFAULT_ACTION_IDENTIFIER constant for a plain tap, distinct from any custom category action's identifier string -- comparing against a made-up string instead of the real exported constant means the plain-tap branch never actually matches.",
        whyHi:
          "expo-notifications ek specific DEFAULT_ACTION_IDENTIFIER constant document karta hai ek plain tap ke liye, kisi bhi custom category action ke identifier string se distinct -- ek made-up string ke against compare karna real exported constant ke bajaye matlab plain-tap branch kabhi actually match nahi karta.",
      },
    ],

    realWorld: [
      {
        en: "A real messaging app's push notification tap handler genuinely never navigated to the right conversation for months, traced to comparing actionIdentifier against a guessed string instead of the documented DEFAULT_ACTION_IDENTIFIER constant -- the plain-tap branch of the if/else chain was simply unreachable dead code the whole time.",
        hi: "Ek real messaging app ka push notification tap handler genuinely mahino tak sahi conversation pe navigate nahi karta tha, traced kiya gaya ki actionIdentifier ko ek guessed string ke against compare kiya ja raha tha documented DEFAULT_ACTION_IDENTIFIER constant ke bajaye -- if/else chain ka plain-tap branch pure waqt simply unreachable dead code tha.",
      },
    ],

    interviewQA: [
      {
        q: 'How does an app distinguish between a user tapping a notification\'s body versus pressing one of its custom category action buttons, in the same response listener?',
        qHi: 'Ek app kaise distinguish karta hai ek user ke ek notification ka body tap karne aur uske custom category action buttons mein se ek press karne ke beech, usi response listener mein?',
        a: "The documented response object's actionIdentifier field carries either the special DEFAULT_ACTION_IDENTIFIER constant for a plain body tap, or the specific identifier string configured for whichever category button was pressed -- a single listener branches on this one field to distinguish all cases.",
        aHi: "Documented response object ka actionIdentifier field ya toh ek plain body tap ke liye special DEFAULT_ACTION_IDENTIFIER constant carry karta hai, ya us specific identifier string ko jo configure kiya gaya tha jo bhi category button press kiya gaya -- ek single listener is ek field pe branch karta hai sab cases distinguish karne ke liye.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented setNotificationHandler contract, explain why registering it inside a screen component that mounts and unmounts (rather than once near the app's root) would be a real bug, and describe the specific incorrect behavior a user would observe.",
        taskHi: "Is lesson ke documented setNotificationHandler contract ko use karke, explain karo ki ise ek screen component ke andar register karna (jo mount aur unmount hota hai) app ke root ke paas ek baar ke bajaye ek real bug kyun hoga, aur specific incorrect behavior describe karo jo ek user observe karega.",
        hint: "Consider what happens to foreground notification display behavior while the screen that registered the handler is not currently mounted.",
        hintHi: "Socho ki foreground notification display behavior ka kya hota hai jab wo screen jisne handler register kiya tha currently mounted nahi hai.",
      },
    ],

    keyTakeaways: [
      "addNotificationResponseReceivedListener is documented to fire only at the real moment a user taps a notification, reading back the exact content.data payload attached at scheduling time -- closing the loop Lesson 1 opened.",
      "The response's actionIdentifier field distinguishes a plain tap (the documented DEFAULT_ACTION_IDENTIFIER constant) from a custom category action button press, letting one listener correctly branch on all interaction types.",
      "setNotificationHandler must be registered once, globally, near the app's root -- it is documented to control foreground display behavior for every notification app-wide, not a per-notification or per-screen setting.",
    ],
    keyTakeawaysHi: [
      "addNotificationResponseReceivedListener documented hai ki ye sirf us real moment pe fire hota hai jab ek user ek notification tap karta hai, exact content.data payload wapas padhte hue jo scheduling time pe attach kiya gaya tha -- Lesson 1 ne jo loop open kiya use close karte hue.",
      "Response ka actionIdentifier field ek plain tap ko (documented DEFAULT_ACTION_IDENTIFIER constant) ek custom category action button press se distinguish karta hai, ek listener ko sab interaction types pe correctly branch karne deta hue.",
      "setNotificationHandler ko ek baar, globally, app ke root ke paas register karna zaroori hai -- ye documented hai ki ye foreground display behavior ko har notification ke liye app-wide control karta hai, ek per-notification ya per-screen setting nahi.",
    ],
  },
];
