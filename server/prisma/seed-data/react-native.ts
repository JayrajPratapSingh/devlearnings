import type { SeedProblem } from './shared';

/**
 * React Native — Mobile app development with React.
 * Covers fundamentals, navigation, styling, state management, and performance.
 */

export const REACT_NATIVE_CATEGORIES = [
  'Fundamentals',
  'Components & APIs',
  'Navigation',
  'Styling',
  'State Management',
  'Performance & Optimization',
] as const;

export const reactNativeTopics = [
  /* ────────────────────── Fundamentals ────────────────────── */
  {
    slug: 'rn-what-is-react-native',
    title: 'What is React Native?',
    category: 'Fundamentals',
    difficulty: 'EASY',
    summary: 'Learn why React Native exists and how it differs from React, NativeScript, Flutter, and native development.',
    content: `React Native lets you build native mobile apps using JavaScript and React. Instead of compiling to HTML/CSS/JS like React, it compiles to native iOS (Swift/Objective-C) and Android (Java/Kotlin) code.

## Why React Native?

- **One codebase, two platforms**: 90%+ code shared between iOS and Android
- **JavaScript developer?** You already know React. Pick up mobile fast
- **Hot reload** and **Fast refresh** keep iteration speed insane
- **Leverage native APIs** through JavaScript bridges

## React Native vs alternatives

| | React Native | Flutter | NativeScript | Native |
|---|---|---|---|---|
| Language | JavaScript | Dart | JavaScript/TypeScript | Swift/Java |
| Code sharing | ~90% | ~95% | ~85% | 0% |
| Performance | Near-native | Excellent | Good | Best |
| Learning curve | Low (if you know React) | Medium | Medium | High |
| Maturity | Proven in production | Growing | Stable | Stable |

## The bridge

React Native runs JavaScript in a separate thread. Native code and JS talk via a **bridge** — serialization is slow, so batch updates and avoid the bridge in tight loops.

## When to use React Native

✓ Startup/MVP needing quick iOS+Android
✓ Feature-parity between platforms is a priority
✓ Team knows JavaScript/React
✓ App is business logic + UI (not graphics-heavy)

✗ Game engine you're building from scratch
✗ Extreme performance required (but most apps are fine)
✗ Heavy native code you can't isolate
`,
    contentHi: `React Native JavaScript aur React se native mobile apps banana sikhata hai. React ki tarah HTML/CSS/JS mein compile hone ki jaga, yeh iOS (Swift/Objective-C) aur Android (Java/Kotlin) ke native code mein compile hota hai.

## Kyon React Native?

- **Ek codebase, do platform**: 90%+ code iOS aur Android mein same hai
- **JavaScript developer ho?** React jante ho? Mobile seekh lo jaldi
- **Hot reload** aur **Fast refresh** se iteration speed kahin jyada
- **Native APIs ko leverage** karo JavaScript bridges se

## Bridge ka concept

React Native JavaScript ko separate thread mein run karta hai. Native code aur JS ek **bridge** se baat karte hain — serialization slow hoti hai, isliye updates batch karo aur tight loops mein bridge avoid karo.

## Kab use karo?

✓ Startup/MVP ko iOS+Android jaldi chahiye
✓ Dono platforms mein same features hona zaroori ho
✓ Team JavaScript/React jaanti ho
✓ App sirf UI + business logic hai (graphics-heavy nahi)
`,
    simple: `Think of React Native like taking your React knowledge and deploying it on both iPhone and Android phone at once. You write JavaScript, it becomes native apps.`,
    simpleHi: `React Native samjho jaise aapke React ki knowledge ko iPhone aur Android dono par ek saath deploy karna. JavaScript likho, native apps ban jayenge.`,
    tricks: `Bridge = bottleneck. Batch your updates, don't spam the bridge.`,
    tricksHi: `Bridge = bottleneck. Updates batch karo, bridge ko spam mat karo.`,
    codeExample: `// index.js - Entry point for React Native app
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('MyApp', () => App);

// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, React Native!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});`,
    expectedOutput: `Native app renders "Hello, React Native!" centered on screen`,
    commonMistakes: [
      'Assuming 100% code sharing (native features vary)',
      'Treating it like web React (no DOM, different APIs)',
      'Not understanding the bridge bottleneck',
      'Using web libraries that depend on DOM',
    ],
    interviewQuestions: [
      'How is React Native different from React?',
      'Explain the React Native bridge and why it matters',
      'When would you choose React Native over native development?',
      'What percentage of code is typically shared in a React Native project?',
    ],
    practiceQuestions: [
      'Build a simple counter app in React Native',
      'Explain why React Native is slower than native but still viable',
      'Compare performance profiles: React Native vs Flutter vs Native',
    ],
    relatedProblemSlugs: [],
    tags: ['fundamentals', 'architecture', 'native', 'javascript'],
  },

  {
    slug: 'rn-setup-and-environment',
    title: 'Environment Setup & Project Structure',
    category: 'Fundamentals',
    difficulty: 'EASY',
    summary: 'Set up React Native development environment, understand project structure, and run your first app.',
    content: `## Getting Started: Two Paths

### 1. Expo (Recommended for Learning)
Expo is a managed service that handles native code for you.

\`\`\`bash
npm install -g expo-cli
expo init MyApp
cd MyApp
npm start
\`\`\`

Then scan the QR code with Expo Go app on your phone. Your changes hot-reload instantly.

**Pros:**
- No native code setup needed
- Instant preview on phone
- Rich built-in APIs (Camera, Location, etc)

**Cons:**
- Less control over native code
- Larger app size
- Some native modules unavailable

### 2. React Native CLI (Bare Workflow)
Full control, but you manage native code.

\`\`\`bash
npx react-native init MyApp
cd MyApp
npm start
\`\`\`

Then in another terminal:
\`\`\`bash
npm run android    # Emulator or device
# or
npm run ios        # iOS only on Mac
\`\`\`

## Project Structure

\`\`\`
MyApp/
├── App.js              # Root component
├── app.json            # Expo config
├── index.js            # Entry point (CLI)
├── package.json
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Full-screen components
│   ├── navigation/     # Navigation config
│   ├── hooks/          # Custom hooks
│   ├── services/       # API calls, etc
│   └── styles/         # Shared styles
└── assets/             # Images, fonts
\`\`\`

## Key Files Explained

**app.json** (Expo projects)
\`\`\`json
{
  "expo": {
    "name": "MyApp",
    "slug": "myapp",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "ios": { "bundleIdentifier": "com.myapp" },
    "android": { "package": "com.myapp" }
  }
}
\`\`\`

**package.json**
\`\`\`json
{
  "name": "MyApp",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "react": "~18.2.0",
    "react-native": "~0.73.0",
    "react-native-screens": "~3.27.0",
    "@react-navigation/native": "^6.0.0"
  }
}
\`\`\`

## Running Your App

### Expo
\`\`\`bash
npm start          # Start dev server
# Press 'i' for iOS, 'a' for Android
# Or scan QR code with Expo Go
\`\`\`

### React Native CLI
\`\`\`bash
npm start          # Start Metro bundler
npm run android    # In another terminal, run Android
npm run ios        # Or iOS (Mac only)
\`\`\`

## Debugging

**React Native Debugger**
\`\`\`bash
npm install -g react-native-debugger
react-native-debugger
\`\`\`

Then enable remote debugging in-app: \`Cmd+D\` (iOS) or \`Cmd+M\` (Android).

**Common Debug Features:**
- Inspect components (like React DevTools)
- Network requests
- Async Storage inspection
- Redux debugging
`,
    contentHi: `## Setup ke Do Raste

### 1. Expo (Learning ke liye best)
Expo ek managed service hai jo native code handle karta hai.

\`\`\`bash
npm install -g expo-cli
expo init MyApp
cd MyApp
npm start
\`\`\`

Phir QR code ko Expo Go app se scan karo. Aapke changes instantly hot-reload honge.

### 2. React Native CLI (Zyada control chahiye)
Full control, lekin aap native code manage karte ho.

\`\`\`bash
npx react-native init MyApp
npm run android    # ya npm run ios
\`\`\`

## Project ka Structure

\`\`\`
MyApp/
├── App.js              # Root component
├── app.json            # Expo config (agar Expo use kar rahe ho)
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Puri screen components
│   ├── navigation/     # Navigation setup
│   └── services/       # API calls
\`\`\`

## Running

\`\`\`bash
npm start          # Dev server start karo
# Phir 'i' press karo iOS ke liye ya 'a' Android ke liye
\`\`\`
`,
    simple: `React Native projects start with either Expo (simpler, recommended) or React Native CLI (more control). Download Expo Go on your phone, run \`npm start\`, and scan the QR code to see your app instantly.`,
    simpleHi: `React Native project Expo (zyada aasan) ya React Native CLI (zyada control) se start hota hai. Apne phone mein Expo Go app download karo, \`npm start\` chalao, QR code scan karo, aur apki app phone par directly dikhe.`,
    tricks: `Always start with Expo. Only switch to bare workflow when you need native modules Expo doesn't provide.`,
    tricksHi: `Expo se shuru karo. Sirf bare workflow mein switch karo jab aapko native modules chahiye jo Expo mein nahi hain.`,
    codeExample: `// First Expo app
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>My React Native App</Text>
    </View>
  );
}`,
    expectedOutput: `App runs on Expo Go, displays centered text`,
    commonMistakes: [
      'Not installing dependencies properly',
      'Mixing web and native code carelessly',
      'Ignoring Metro bundler errors',
      'Not clearing cache when things break',
    ],
    interviewQuestions: [
      'Explain Expo vs bare React Native workflow',
      'What is the Metro bundler?',
      'How do you debug a React Native app?',
      'What files must exist in a React Native project?',
    ],
    practiceQuestions: [
      'Set up a React Native project with Expo and run it',
      'Modify app.json to change the app name and splash screen',
      'Install a third-party package and use it',
    ],
    relatedProblemSlugs: [],
    tags: ['setup', 'environment', 'expo', 'tooling'],
  },
];
