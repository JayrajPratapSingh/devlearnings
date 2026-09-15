# React Native — noob to pro, production grade

23 modules / 69 lessons (3 lessons per module — this platform's settled
pacing), bilingual EN/Hinglish, JS/TS code toggles for every example
(React Native code is JSX either way — the "JS" side is untyped JSX, the
"TS" side is typed TSX, exactly like this platform's Next.js and React
courses already do).

Course record: slug `react-native-complete`, order `17`, DB `icon` field
(emoji) `📱` (not yet used by any other course), color `#F97316` (orange —
unused by any other course; deliberately avoids the several existing blues
already in use: React's `#61DAFB`, TypeScript's `#3178C6`, Python's
`#3776AB`, PostgreSQL's `#336791`, Docker's `#0db7ed`). Client-side card
icon (`client/src/pages/courses/courseIcons.tsx`): `Smartphone` from
`lucide-react`, not `SiReact` — React Native's real, official brand mark
is genuinely identical to React's own atom logo (confirmed: simple-icons,
which `react-icons/si` wraps, has no separate React Native mark), so
reusing `SiReact` would render two visually identical course-card icons
side by side; `Smartphone` is an honest, accurate, distinct choice for a
mobile-app-development course, matching the precedent of Databases/DevOps
using a purposeful generic icon where a single brand logo wouldn't be
honest.

Rationale: this is DevPrep's first course centered on a genuinely
different target runtime — a real mobile OS (iOS/Android), not a browser
or a Node server. That changes what "verified" can mean for several
lessons (see Verification approach below), but not the standard of rigor:
every runnable claim is either genuinely executed against the real,
installed library or type-checked against its real, installed type
definitions — never asserted from memory or documentation-era knowledge.

## Part I — React Native Fundamentals (The Platform Itself)
1. **What React Native Actually Is** — the JS thread vs. the native/UI
   thread, the old async bridge vs. the new synchronous JSI/Fabric/
   TurboModules architecture, Metro bundler, and the Hermes JS engine —
   what actually executes your code and how it talks to real native views.
2. **Core Components & Real Flexbox Layout** — View/Text/Image/ScrollView,
   StyleSheet, and the actual Yoga layout engine computing real flexbox —
   genuinely executable in Node (see Verification approach), a strong
   verification tier this course leans on repeatedly.
3. **Handling Input, Touch & Lists** — TextInput, Pressable/
   TouchableOpacity, keyboard handling, and FlatList's real virtualization
   model (why it doesn't render 10,000 rows at once).

## Part II — Navigation & App Architecture
4. **React Navigation Fundamentals** — Stack/Tab/Drawer navigators,
   passing and typing route params, nested navigators, and precisely what
   "navigation state" actually is underneath the JSX.
5. **Deep Linking & File-Based Routing** — linking config for real
   `myapp://` URLs and universal/app links; Expo Router's file-based
   routing compared honestly against React Navigation's config-based
   approach.
6. **Project Architecture for Production Apps** — feature-based folder
   structure, environment configs (dev/staging/prod), and the real
   decisions a production RN codebase needs that a tutorial app skips.

## Part III — State, Data & Networking
7. **State Management in React Native** — Context, Zustand (surgical
   re-renders, same real verification technique this project's Three.js
   course already established), and where global state genuinely belongs
   in a mobile app.
8. **Networking & Data Fetching** — fetch/axios, TanStack Query in RN,
   and the real loading/error/offline state machine a mobile network
   connection actually requires (unlike a stable browser tab).
9. **Local Storage & Offline-First Data** — AsyncStorage vs. MMKV vs.
   SQLite/WatermelonDB, real tradeoffs (speed, size limits, queryability),
   and sync strategies for genuinely offline-capable apps.

## Part IV — Platform APIs & Native Capabilities
10. **Permissions & Platform Differences** — the real permission-request
    flow on iOS vs. Android, `Platform.select`/`Platform.OS`, and why the
    same component can genuinely behave differently per platform.
11. **Camera, Media & File System** — expo-camera/image-picker, real file
    system access, and the actual data shapes these APIs return.
12. **Location, Sensors & Biometric Auth** — geolocation, accelerometer/
    gyroscope, and FaceID/TouchID/fingerprint authentication flows.
13. **Push Notifications** — Expo Notifications, the real local-vs-remote
    distinction, FCM/APNs at a conceptual level, and permission handling.

## Part V — Animation, Gestures & Native Modules
14. **Animations with Reanimated** — worklets, shared values, and the
    real UI-thread-vs-JS-thread performance model that is the entire
    reason Reanimated exists instead of the Animated API.
15. **Gesture Handling** — react-native-gesture-handler, composing real
    pan/pinch/swipe gestures, and how gestures and Reanimated genuinely
    work together.
16. **Native Modules & the New Architecture** — what a native module
    actually is (JSI/TurboModules), when a real production app needs one,
    and honestly when to eject from Expo's managed workflow.

## Part VI — Performance & Production Hardening
17. **Performance Optimization** — FlatList virtualization internals,
    real re-render cost in a list, Hermes bytecode precompilation, and
    bundle-size analysis.
18. **Testing React Native Apps** — Jest + React Native Testing Library
    (this course's own real, verified toolchain), and E2E testing with
    Detox/Maestro at a conceptual level.
19. **Error Handling & Crash Reporting** — ErrorBoundary in a mobile app,
    Sentry-style crash reporting, and real recovery UX patterns for a
    crash that happens on someone else's phone, not your dev machine.
20. **Security in React Native** — secure storage (Keychain/Keystore),
    certificate pinning, jailbreak/root detection, and the OWASP Mobile
    Top 10 concerns specific to a shipped mobile binary.

## Part VII — Shipping to Production
21. **Build & Release with EAS** — `app.json`/`app.config.js`, EAS Build
    profiles, and code-signing fundamentals for both app stores.
22. **App Store & Play Store Submission + OTA Updates** — real submission
    requirements and review-guideline gotchas, plus EAS Update/CodePush
    for shipping JS changes without a full store review.
23. **CI/CD for Mobile Apps** — a genuine pipeline (GitHub Actions + EAS)
    automating test → build → release, closing the course.

## Verification approach

This course spans a genuinely different target than DevPrep's web/server
courses: React Native code ultimately runs on a real mobile OS, which
this Node.js execution sandbox cannot simulate (no iOS Simulator, no
Android emulator, no real device). Verification is therefore layered
honestly, by what's actually checkable — extending the same discipline
established across every prior course in this catalog:

- **Real flexbox/layout math** is executed against the ACTUAL Yoga layout
  engine (`yoga-layout@3.2.1`) React Native uses internally for every
  single style computation — confirmed working in plain Node with zero
  React, zero device: a real flex-grow proportional split (1:2 ratio
  genuinely producing 100px/200px widths from a 300px parent) and a real
  `justify-content: space-between` computation (a 50px child genuinely
  landing at `top: 150` in a 200px column) both computed exactly as
  predicted. This is a stronger verification tier than this course
  initially expected going in — directly comparable to the Three.js
  course's mid-course discovery that GLTFLoader and the Rapier physics
  engine were both genuinely Node-executable.
- **Real component rendering, props, and events** are verified via
  `@testing-library/react-native@14.0.1` on top of `react-test-renderer`,
  run through Jest with the real `@react-native/jest-preset` — confirmed
  working: real `<View>`/`<Text>`/`<Pressable>` components render, are
  found by real text/testID queries, and real `onPress` handlers
  genuinely fire via `fireEvent.press`. Two real, version-specific
  gotchas surfaced and were fixed during setup, each worth teaching
  directly: (1) `render()` in this version of `@testing-library/react-native`
  genuinely returns a Promise now (must be awaited) — a real API change
  from older, synchronous versions, caught only by executing the code,
  not by trusting older documentation; (2) Jest's default
  `transformIgnorePatterns` genuinely does not transform third-party
  `node_modules` packages like `@react-navigation/*`, which ship
  un-transpiled ESM syntax — confirmed by the exact real
  `SyntaxError: Unexpected token 'export'`, fixed with a real, standard
  `transformIgnorePatterns` override.
- **Real navigation** is verified the same way: a genuine
  `NavigationContainer` + `createNativeStackNavigator()` tree, rendered
  for real, with a real `Pressable` press genuinely calling
  `navigation.navigate('Details', { id: 42 })` and the destination
  screen's real, rendered text genuinely reflecting that exact param —
  confirmed via `fireEvent.press` + `findByText`, not assumed from React
  Navigation's documentation.
- **Real state-management re-render behavior** (Zustand, Context) reuses
  this project's already-established real render-count instrumentation
  technique from the Three.js course's Module 17.
- **Native-only APIs** (camera, biometrics, push notifications, secure
  storage, native modules, actual App Store/Play Store submission, real
  device performance profiling) genuinely cannot execute without a real
  device or simulator, which this environment does not have — these are
  treated as precise, accurate prose grounded in the library's
  documented, checkable behavior, the exact same honest treatment this
  course's own Three.js/R3F course gave actual GPU-rendered visual output,
  and the Databases course gave Firebase.
- **All TypeScript/TSX code** is type-checked against the real, installed
  type definitions (`@types/react`, React Native's own bundled types,
  `@react-navigation/*`) using an isolated `tsc --noEmit` pass before any
  module is considered complete, exactly as every prior course requires.

Scratchpad verification project: `rn-verify/` (npm-initialized, with
`react@19.2.3`, `react-dom@19.2.3`, `react-native@0.87.1`,
`react-test-renderer@19.2.3`, `@testing-library/react-native@14.0.1`,
`yoga-layout@3.2.1`, `jest@29`, `@react-native/babel-preset`,
`@react-native/jest-preset@0.87.1`, `@react-navigation/native@7.4.0`,
`@react-navigation/native-stack@7.19.0`,
`@react-native-async-storage/async-storage@3.1.1`, `zustand@5.0.15`,
`react-native-screens`, `react-native-safe-area-context`, `typescript`
installed; `babel.config.js` using `@react-native/babel-preset` and
`jest.config.js` using `@react-native/jest-preset` with the
`transformIgnorePatterns` override described above) — reuse this for
every module's verification pass rather than reinstalling.

## Progress

- [x] Course shell in seed.ts (`seedReactNativeCourse`, Course record,
      all 23 module metadata records)
- [x] M1 What React Native Actually Is — 3/3 lessons
- [x] M2 Core Components & Real Flexbox Layout — 3/3 lessons
- [x] M3 Handling Input, Touch & Lists — 3/3 lessons (Part I complete)
- [x] M4 React Navigation Fundamentals — 3/3 lessons (Part II begins)
- [x] M5 Deep Linking & File-Based Routing — 3/3 lessons
- [x] M6 Project Architecture for Production Apps — 3/3 lessons (Part II complete)
- [x] M7 State Management in React Native — 3/3 lessons (Part III begins)
- [x] M8 Networking & Data Fetching — 3/3 lessons
- [x] M9 Local Storage & Offline-First Data — 3/3 lessons (Part III complete)
- [x] M10 Permissions & Platform Differences — 3/3 lessons (Part IV begins)
- [ ] M11 Camera, Media & File System
- [ ] M12 Location, Sensors & Biometric Auth
- [ ] M13 Push Notifications
- [ ] M14 Animations with Reanimated
- [ ] M15 Gesture Handling
- [ ] M16 Native Modules & the New Architecture
- [ ] M17 Performance Optimization
- [ ] M18 Testing React Native Apps
- [ ] M19 Error Handling & Crash Reporting
- [ ] M20 Security in React Native
- [ ] M21 Build & Release with EAS
- [ ] M22 App Store & Play Store Submission + OTA Updates
- [ ] M23 CI/CD for Mobile Apps
