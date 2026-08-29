import type { SeedCategory } from './topics-shared';

export const reactNativeCategory: SeedCategory = {
  slug: 'react-native',
  name: 'React Native',
  description: 'Build native iOS and Android apps with JavaScript and React. One codebase, two platforms, near-native performance.',
  icon: 'smartphone',
  group: 'web-dev',
  topics: [
    {
      slug: 'rn-what-is-react-native',
      title: 'What is React Native?',
      difficulty: 'EASY',
      summary: 'Learn why React Native exists and how it differs from React, NativeScript, Flutter, and native development.',
      summaryHi: 'React Native kya hai aur React, Flutter, native development se kaise alag hai samjho.',
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

## The bridge

React Native runs JavaScript in a separate thread. Native code and JS talk via a **bridge** — serialization is slow, so batch updates.

## When to use React Native

✓ Startup/MVP needing quick iOS+Android
✓ Feature-parity between platforms is a priority
✓ Team knows JavaScript/React
✓ App is business logic + UI (not graphics-heavy)`,
      contentHi: `React Native JavaScript aur React se native mobile apps banana sikhata hai.

## Kyon React Native?

- **Ek codebase, do platform**: 90%+ code same hai
- **JavaScript developer ho?** React jante ho? Mobile seekh lo
- **Hot reload** se iteration kahin jyada

## Bridge ka concept

JS separate thread mein run hota hai. Bridge se native code aur JS baat karte hain.

## Kab use karo?

✓ Startup ko iOS+Android jaldi chahiye
✓ Team JavaScript/React jaanti ho
✓ App UI + business logic hai (graphics-heavy nahi)`,
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
      ],
      practiceQuestions: [
        'Build a simple counter app in React Native',
        'Explain why React Native is slower than native but still viable',
      ],
      tags: ['fundamentals', 'architecture', 'native', 'javascript'],
    },
    {
      slug: 'rn-setup-and-environment',
      title: 'Environment Setup & Project Structure',
      difficulty: 'EASY',
      summary: 'Set up React Native development environment, understand project structure, and run your first app.',
      summaryHi: 'React Native development setup karo aur pehla app chalao.',
      content: `## Getting Started: Two Paths

### 1. Expo (Recommended for Learning)
Expo is a managed service that handles native code for you.

\`\`\`bash
npm install -g expo-cli
expo init MyApp
cd MyApp
npm start
\`\`\`

Then scan the QR code with Expo Go app on your phone.

**Pros:** No native code setup, instant preview, rich APIs
**Cons:** Less control, larger app size

### 2. React Native CLI (Bare Workflow)
Full control, but you manage native code.

\`\`\`bash
npx react-native init MyApp
npm run android    # or npm run ios
\`\`\`

## Project Structure

\`\`\`
MyApp/
├── App.js              # Root component
├── app.json            # Expo config
├── package.json
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Full-screen components
│   ├── navigation/     # Navigation config
│   ├── hooks/          # Custom hooks
│   ├── services/       # API calls
│   └── styles/         # Shared styles
└── assets/             # Images, fonts
\`\`\`

## Running Your App

### Expo
\`\`\`bash
npm start          # Start dev server
# Press 'i' for iOS, 'a' for Android
\`\`\`

### React Native CLI
\`\`\`bash
npm start          # Start Metro bundler
npm run android    # In another terminal
\`\`\`

## Debugging

**React Native Debugger** — install globally and attach to your app.
Enable remote debugging: \`Cmd+D\` (iOS) or \`Cmd+M\` (Android).`,
      contentHi: `## Setup: Do Raste

### 1. Expo (Asan)
\`\`\`bash
npm install -g expo-cli
expo init MyApp
npm start
\`\`\`

QR code scan karo Expo Go app se.

### 2. React Native CLI
\`\`\`bash
npx react-native init MyApp
npm run android
\`\`\`

## Project Structure

\`\`\`
MyApp/
├── App.js
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   └── services/
\`\`\`

## Running

\`\`\`bash
npm start
# 'i' for iOS, 'a' for Android
\`\`\``,
      codeExample: `import React from 'react';
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
      ],
      practiceQuestions: [
        'Set up a React Native project with Expo and run it',
        'Modify app.json to change the app name',
        'Install a third-party package and use it',
      ],
      tags: ['setup', 'environment', 'expo', 'tooling'],
    },
  ],
};
