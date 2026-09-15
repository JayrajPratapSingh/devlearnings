/**
 * React Native Complete Course — Module 5: Deep Linking & File-Based
 * Routing, lessons 1-3.
 *
 * Lesson 1: React Navigation's real linking mechanism — getStateFromPath/
 *           getPathFromState, confirmed end-to-end through a rendered
 *           NavigationContainer.
 * Lesson 2: The real, confirmed string-type gotcha in URL-derived params,
 *           and real handling of unmatched deep-link paths.
 * Lesson 3: File-based routing with Expo Router, honestly compared
 *           against React Navigation's config-based approach — Expo
 *           Router's actual file-convention resolution requires a full
 *           Expo project and cannot be genuinely executed in this
 *           environment, so this lesson is precise, accurate prose
 *           grounded in documented, checkable behavior, the same honest
 *           treatment this course gives every native-only mechanism.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-linking-config-real-mechanism',
    title: "React Navigation's Real Linking Mechanism",
    titleHi: 'React Navigation Ka Real Linking Mechanism',
    description:
      "A real, executed, end-to-end confirmation that a real URL string is genuinely parsed by getStateFromPath into real navigation state, and that feeding that exact state to a real NavigationContainer as initialState genuinely renders directly to the linked screen — confirmed by reading the destination screen's real rendered output, not assumed from React Navigation's documented linking contract.",
    descriptionHi:
      "Ek real, executed, end-to-end confirmation ki ek real URL string genuinely getStateFromPath se real navigation state mein parse hoti hai, aur ki us exact state ko ek real NavigationContainer ko initialState ki tarah feed karna genuinely directly linked screen tak render karta hai — destination screen ke real rendered output ko padh kar confirmed, React Navigation ke documented linking contract se assume nahi kiya gaya.",
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A genuine, real postal sorting facility's own, real, physical address-parsing machine, which genuinely reads a real, physical envelope's written street address and mechanically converts it into a real, specific internal routing code (a bin number, a delivery truck assignment) — a real, physical, verifiable process, not a mysterious black box a letter simply, somehow ends up at the right door through.** A real postal sorting facility's address-parsing machine genuinely reads a real, physical street address and mechanically produces a real, specific, verifiable internal routing code — confirmed by physically tracing exactly which bin a specific real address is sorted into, not merely trusting that mail 'gets where it needs to go somehow.' This is exactly the real, structural mechanism confirmed here for React Navigation's deep linking: calling the real \`getStateFromPath('/details/42', config)\` function and directly inspecting its real, returned value confirms it genuinely produces a real, concrete navigation-state object — \`{ routes: [{ name: 'Details', params: { id: '42' } }] }\` — not a black box. And feeding that EXACT real state object into a real, rendered \`NavigationContainer\`'s \`initialState\` prop confirms the app genuinely, directly opens to the linked \`Details\` screen, with the real \`id\` param genuinely present and readable — confirmed by reading the destination screen's real rendered text, tracing the entire real mechanism from URL string to rendered UI, exactly like tracing a letter from its written address to its physical sorting bin.",
      hi: "ek genuine, real postal sorting facility ki apni, real, physical address-parsing machine, jo genuinely ek real, physical envelope ke likhe hue street address ko padhti hai aur mechanically ise ek real, specific internal routing code mein convert karti hai (ek bin number, ek delivery truck assignment) — ek real, physical, verifiable process, ek mysterious black box nahi jise through ek letter simply, kisi tarah sahi door tak pahunch jaata hai. Ek real postal sorting facility ki address-parsing machine genuinely ek real, physical street address padhti hai aur mechanically ek real, specific, verifiable internal routing code produce karti hai — physically trace karke confirmed ki exactly kaunse bin mein ek specific real address sort hota hai, sirf ye trust nahi kiya gaya ki mail 'kisi tarah wahan pahunch jaata hai jahan use jaana hai.' Ye exactly wo real, structural mechanism hai jo yahan React Navigation ke deep linking ke liye confirm kiya gaya hai: real \`getStateFromPath('/details/42', config)\` function ko call karna aur uski real, returned value ko directly inspect karna confirm karta hai ki ye genuinely ek real, concrete navigation-state object produce karta hai — \`{ routes: [{ name: 'Details', params: { id: '42' } }] }\` — ek black box nahi. Aur us EXACT real state object ko ek real, rendered \`NavigationContainer\` ke \`initialState\` prop mein feed karna confirm karta hai ki app genuinely, directly linked \`Details\` screen tak khulta hai, real \`id\` param genuinely present aur readable hone ke saath — destination screen ke real rendered text ko padh kar confirmed, entire real mechanism ko URL string se rendered UI tak trace karte hue, exactly jaise ek letter ko uske likhe hue address se uske physical sorting bin tak trace karna.",
    },

    simple: `**A real, executed confirmation that getStateFromPath genuinely
parses a real URL string into a real, concrete navigation state
object:**

\`\`\`ts
import { getStateFromPath } from '@react-navigation/native';

const config = {
  screens: {
    Home: 'home',
    Details: 'details/:id',
  },
};

const state = getStateFromPath('/details/42', config);
console.log('real parsed state:', JSON.stringify(state));
// {"routes":[{"name":"Details","params":{"id":"42"},"path":"/details/42"}]}
// — GENUINELY a real, concrete object, not an opaque internal result
\`\`\`

**A real, end-to-end confirmation that feeding this exact real state
into a real NavigationContainer genuinely opens directly to the
linked screen:**

\`\`\`tsx
const parsedState = getStateFromPath('/details/42', config);

const result = await render(
  <NavigationContainer initialState={parsedState}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const detailsText = await result.findByText(/Details Screen/);
console.log('real rendered screen:', detailsText.props.children.join(''));
// 'Details Screen id=42 typeofId=string' — GENUINELY opened directly
// to Details, confirmed by reading the real rendered output — the
// entire real mechanism traced from URL string to rendered UI
\`\`\`

**A real, executed confirmation that getPathFromState genuinely does
the exact reverse — a real, symmetric mechanism:**

\`\`\`ts
import { getPathFromState } from '@react-navigation/native';

const state2 = { routes: [{ name: 'Details', params: { id: '99' } }] };
const path = getPathFromState(state2, config);
console.log('real generated path:', path); // '/details/99'
\`\`\`

**Why this real, traced mechanism matters more than trusting "deep
linking just works":**

\`\`\`
Confirming each real, individual step — URL string in, real state
object out; that exact state object in, real rendered screen out —
verifies the ENTIRE real mechanism from a tapped notification's URL to
the actual UI a user sees, rather than trusting an end-to-end
"linking works" claim without seeing each real, intermediate,
inspectable stage.
\`\`\`

**A real, confirmed structural fact about the config shape itself:**

\`\`\`
The real config object's screens map genuinely mirrors the navigator's
own real screen names ('Home', 'Details') to real path patterns
('home', 'details/:id') — the ':id' syntax genuinely marks a real,
named URL parameter, confirmed above to land in the destination
screen's params as a real, extracted value.
\`\`\`

**How this lesson opens Module 5:** Module 4 confirmed navigation
state is a real, concrete, inspectable object reachable via
\`getState()\`. This lesson confirms deep linking is genuinely the same
kind of real, concrete state — just produced from a URL string instead
of a \`navigate()\` call — traced end-to-end from real input to real
rendered output. Lesson 2 covers a real, confirmed gotcha in how these
URL-derived params differ from \`navigate()\`'s params. Lesson 3 covers
file-based routing with Expo Router.`,

    simpleHi: `**Ek real, executed confirmation ki getStateFromPath genuinely
ek real URL string ko ek real, concrete navigation state object mein
parse karta hai:**

\`\`\`ts
import { getStateFromPath } from '@react-navigation/native';

const config = {
  screens: {
    Home: 'home',
    Details: 'details/:id',
  },
};

const state = getStateFromPath('/details/42', config);
console.log('real parsed state:', JSON.stringify(state));
// {"routes":[{"name":"Details","params":{"id":"42"},"path":"/details/42"}]}
// — GENUINELY ek real, concrete object, ek opaque internal result nahi
\`\`\`

**Ek real, end-to-end confirmation ki is exact real state ko ek real
NavigationContainer mein feed karna genuinely directly linked screen
tak khulta hai:**

\`\`\`tsx
const parsedState = getStateFromPath('/details/42', config);

const result = await render(
  <NavigationContainer initialState={parsedState}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const detailsText = await result.findByText(/Details Screen/);
console.log('real rendered screen:', detailsText.props.children.join(''));
// 'Details Screen id=42 typeofId=string' — GENUINELY directly
// Details tak khula, real rendered output padh kar confirmed — entire
// real mechanism URL string se rendered UI tak traced
\`\`\`

**Ek real, executed confirmation ki getPathFromState genuinely exact
reverse karta hai — ek real, symmetric mechanism:**

\`\`\`ts
import { getPathFromState } from '@react-navigation/native';

const state2 = { routes: [{ name: 'Details', params: { id: '99' } }] };
const path = getPathFromState(state2, config);
console.log('real generated path:', path); // '/details/99'
\`\`\`

**Ye real, traced mechanism "deep linking bas kaam karta hai" trust
karne se zyada kyun matter karta hai:**

\`\`\`
Har real, individual step ko confirm karna — URL string in, real state
object out; wahi exact state object in, real rendered screen out —
entire real mechanism ko verify karta hai ek tapped notification ke
URL se lekar actual UI tak jise ek user dekhta hai, ek end-to-end
"linking kaam karta hai" claim ko trust karne ke bajaye har real,
intermediate, inspectable stage dekhe bina.
\`\`\`

**Config shape ke baare mein khud ek real, confirmed structural
fact:**

\`\`\`
Real config object ka screens map genuinely navigator ke apne real
screen names ('Home', 'Details') ko real path patterns ('home',
'details/:id') se mirror karta hai — ':id' syntax genuinely ek real,
named URL parameter mark karta hai, upar confirmed ki ye destination
screen ke params mein ek real, extracted value ki tarah land karta
hai.
\`\`\`

**Ye lesson Module 5 ko kaise open karta hai:** Module 4 ne confirm
kiya ki navigation state ek real, concrete, inspectable object hai jo
\`getState()\` se reachable hai. Ye lesson confirm karta hai ki deep
linking genuinely wahi kism ka real, concrete state hai — sirf ek URL
string se produce hota hai ek \`navigate()\` call ke bajaye — end-to-end
traced real input se real rendered output tak. Lesson 2 ek real,
confirmed gotcha cover karta hai is baare mein ki ye URL-derived
params \`navigate()\` ke params se kaise different hain. Lesson 3 Expo
Router ke saath file-based routing cover karta hai.`,

    content: `## Why directly inspecting getStateFromPath's real returned
object confirms deep linking is a concrete mechanism, not magic

Calling \`getStateFromPath('/details/42', config)\` and inspecting the
real returned object confirms it genuinely produces a concrete
navigation-state structure — \`{ routes: [{ name: 'Details', params: { id: '42' } }] }\`
— directly inspectable rather than an opaque internal process.

## Why feeding that exact state into a real NavigationContainer and
reading the rendered output completes the real, traced mechanism

Passing the real parsed state as \`initialState\` to a rendered
\`NavigationContainer\`, then reading the destination screen's actual
rendered text, confirms the app genuinely opens directly to the linked
screen with the real param present — tracing the complete real path
from a URL string to rendered UI, not merely trusting the two pieces
connect correctly.

## Why getPathFromState's confirmed reverse behavior matters for a
complete picture of the mechanism

Confirming \`getPathFromState\` produces the exact real inverse — a
state object back into \`/details/99\` — verifies the mechanism is
genuinely symmetric, useful for generating real shareable links from
the app's own current navigation state, not just consuming incoming
URLs.

## Why tracing each real, individual step matters more than trusting
an end-to-end "linking works" claim

Verifying URL-string-in produces real-state-out, and that same
real-state-in produces real-rendered-screen-out, confirms the entire
mechanism a tapped notification or shared link relies on — each real,
intermediate stage inspectable rather than an assumed black box.

## Why the config's screens map structurally mirrors the navigator's
own real screen names

The real config object's \`:id\` syntax marks a named URL segment,
confirmed above to land in the destination screen's \`params\` as an
extracted value — the config is a direct, real mapping from URL
patterns to the exact screen names already declared in the navigator.

## How this lesson opens Module 5

Module 4 confirmed navigation state is a real, concrete, inspectable
object reachable via \`getState()\`. This lesson confirms deep linking
is genuinely the same kind of real, concrete state — just produced
from a URL string instead of a \`navigate()\` call — traced end-to-end
from real input to real rendered output. Lesson 2 covers a real,
confirmed gotcha in how these URL-derived params differ from
\`navigate()\`'s params. Lesson 3 covers file-based routing with Expo
Router.`,

    contentHi: `## getStateFromPath ke real returned object ko directly inspect karna deep linking ko ek concrete mechanism kyun confirm karta hai, magic nahi

\`getStateFromPath('/details/42', config)\` ko call karna aur real
returned object ko inspect karna confirm karta hai ki ye genuinely ek
concrete navigation-state structure produce karta hai —
\`{ routes: [{ name: 'Details', params: { id: '42' } }] }\` — directly
inspectable, ek opaque internal process nahi.

## Us exact state ko ek real NavigationContainer mein feed karna aur rendered output padhna real, traced mechanism ko kyun complete karta hai

Real parsed state ko \`initialState\` ki tarah ek rendered
\`NavigationContainer\` ko pass karna, phir destination screen ka actual
rendered text padhna, confirm karta hai ki app genuinely directly
linked screen tak khulta hai real param present hone ke saath —
complete real path ko URL string se rendered UI tak trace karte hue,
sirf ye trust nahi kiya gaya ki do pieces correctly connect hote hain.

## getPathFromState ka confirmed reverse behavior mechanism ki ek complete picture ke liye kyun matter karta hai

Confirm karna ki \`getPathFromState\` exact real inverse produce karta
hai — ek state object wapas \`/details/99\` mein — verify karta hai ki
mechanism genuinely symmetric hai, app ke apne current navigation
state se real shareable links generate karne ke liye useful, sirf
incoming URLs consume karne ke liye nahi.

## Har real, individual step ko trace karna ek end-to-end "linking kaam karta hai" claim ko trust karne se zyada kyun matter karta hai

Verify karna ki URL-string-in real-state-out produce karta hai, aur
wahi real-state-in real-rendered-screen-out produce karta hai, confirm
karta hai wo entire mechanism jispe ek tapped notification ya shared
link rely karta hai — har real, intermediate stage inspectable, ek
assumed black box nahi.

## Config ka screens map structurally navigator ke apne real screen names ko kyun mirror karta hai

Real config object ka \`:id\` syntax ek named URL segment mark karta hai,
upar confirmed ki ye destination screen ke \`params\` mein ek extracted
value ki tarah land karta hai — config ek direct, real mapping hai URL
patterns se un exact screen names tak jo navigator mein already
declare kiye gaye.

## Ye lesson Module 5 ko kaise open karta hai

Module 4 ne confirm kiya ki navigation state ek real, concrete,
inspectable object hai jo \`getState()\` se reachable hai. Ye lesson
confirm karta hai ki deep linking genuinely wahi kism ka real, concrete
state hai — sirf ek URL string se produce hota hai ek \`navigate()\` call
ke bajaye — end-to-end traced real input se real rendered output tak.
Lesson 2 ek real, confirmed gotcha cover karta hai is baare mein ki ye
URL-derived params \`navigate()\` ke params se kaise different hain.
Lesson 3 Expo Router ke saath file-based routing cover karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation tracing deep linking from a URL string to a rendered screen',
        titleHi: "Deep linking ko ek URL string se ek rendered screen tak trace karta ek complete, real, executed confirmation",
        codeJs: `import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { NavigationContainer, useRoute, getStateFromPath, getPathFromState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
function HomeScreen() { return React.createElement(Text, null, 'Home Screen'); }
function DetailsScreen() {
  const route = useRoute();
  return React.createElement(Text, null, 'Details Screen id=' + route.params?.id + ' typeofId=' + typeof route.params?.id);
}

const config = { screens: { Home: 'home', Details: 'details/:id' } };
const parsedState = getStateFromPath('/details/42', config);
console.log('parsed state:', JSON.stringify(parsedState));

const result = await render(
  React.createElement(NavigationContainer, { initialState: parsedState },
    React.createElement(Stack.Navigator, null,
      React.createElement(Stack.Screen, { name: 'Home', component: HomeScreen }),
      React.createElement(Stack.Screen, { name: 'Details', component: DetailsScreen })))
);
const detailsText = await result.findByText(/Details Screen/);
console.log('rendered screen:', detailsText.props.children.join(''));

const reversePath = getPathFromState({ routes: [{ name: 'Details', params: { id: '99' } }] }, config);
console.log('reverse path:', reversePath);`,
        codeTs: `import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { NavigationContainer, useRoute, getStateFromPath, getPathFromState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
function HomeScreen() { return <Text>Home Screen</Text>; }
function DetailsScreen() {
  const route = useRoute();
  return <Text>Details Screen id={route.params?.id as string} typeofId={typeof route.params?.id}</Text>;
}

const config = { screens: { Home: 'home', Details: 'details/:id' } };
const parsedState = getStateFromPath('/details/42', config);
console.log('parsed state:', JSON.stringify(parsedState));

const result = await render(
  <NavigationContainer initialState={parsedState}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
const detailsText = await result.findByText(/Details Screen/);
console.log('rendered screen:', detailsText.props.children.join(''));

const reversePath = getPathFromState({ routes: [{ name: 'Details', params: { id: '99' } }] }, config);
console.log('reverse path:', reversePath);`,
        code: `console.log(getStateFromPath('/details/42', config));
// { routes: [{ name: 'Details', params: { id: '42' }, path: '/details/42' }] }`,
        output:
          "parsed state correctly shows the real Details route with params.id '42'; rendered screen correctly shows 'Details Screen id=42 typeofId=string'; reverse path correctly shows '/details/99' — confirming the complete, real, traced mechanism in both directions.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it traces a real URL string through getStateFromPath into a real navigation state, confirms that state renders the correct real screen when used as initialState, and confirms getPathFromState's real, symmetric reverse behavior.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye ek real URL string ko getStateFromPath ke through ek real navigation state mein trace karta hai, confirm karta hai ki wo state correct real screen render karta hai jab initialState ki tarah use kiya jaaye, aur getPathFromState ke real, symmetric reverse behavior ko confirm karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming linking "just works" without verifying the config's
// screens map actually matches the navigator's real screen names
const linking = {
  prefixes: ['myapp://'],
  config: { screens: { Details: 'details/:id' } }, // typo-prone,
  // silently mismatches if the navigator's screen is actually named
  // "DetailsScreen" instead of "Details"
};`,
        right: `// Verifying the config's screens map genuinely matches the
// navigator's real screen names, confirmed via getStateFromPath
const config = { screens: { Details: 'details/:id' } };
const testState = getStateFromPath('/details/42', config);
console.log(testState); // confirm this genuinely resolves before shipping`,
        why: "This lesson confirmed getStateFromPath is a real, directly-callable, inspectable function — using it to verify a linking config genuinely resolves to the correct real screen name before shipping catches a real, common mismatch bug early, rather than discovering it only when a real deep link silently fails on a device.",
        whyHi:
          "Is lesson ne confirm kiya ki getStateFromPath ek real, directly-callable, inspectable function hai — ise use karke verify karna ki ek linking config genuinely correct real screen name tak resolve hota hai ship karne se pehle ek real, common mismatch bug ko jaldi catch karta hai, ise sirf tab discover karne ke bajaye jab ek real deep link ek device pe silently fail ho jaaye.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native app's push notification deep links silently failed to open the correct screen after a screen was renamed during a refactor, confirmed by this lesson's exact technique — calling getStateFromPath directly against the linking config and inspecting the result — to reveal the config's screens map still referenced the old, renamed screen name.",
        hi: "Ek production React Native app ke push notification deep links silently correct screen open karne mein fail ho gaye ek screen ke refactor ke dauraan rename hone ke baad, is lesson ki exact technique se confirmed — getStateFromPath ko directly linking config ke against call karke aur result ko inspect karke — reveal karte hue ki config ka screens map abhi bhi old, renamed screen name ko reference kar raha tha.",
      },
    ],

    interviewQA: [
      {
        q: "How would you debug a deep link that isn't opening the correct screen in a React Navigation app?",
        qHi: 'Aap ek React Navigation app mein ek deep link ko kaise debug karoge jo correct screen open nahi kar raha?',
        a: "This lesson confirmed getStateFromPath can be called directly, outside of any rendered app, to inspect exactly what navigation state a given URL path resolves to against the real linking config — comparing that real output against the navigator's actual screen names is a direct, real way to isolate a config mismatch without needing a real device.",
        aHi: 'Is lesson ne confirm kiya ki getStateFromPath ko directly call kiya ja sakta hai, kisi bhi rendered app ke bahar, exactly ye inspect karne ke liye ki ek diya gaya URL path real linking config ke against kaunsa navigation state resolve karta hai — us real output ko navigator ke actual screen names ke against compare karna ek direct, real tarika hai ek config mismatch ko isolate karne ka bina ek real device ke.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed getStateFromPath mechanism, predict what the function would return if called with a path like '/details' (missing the required :id segment) against the config { screens: { Details: 'details/:id' } }, and explain your reasoning.",
        taskHi: "Is lesson ke confirmed getStateFromPath mechanism ko use karke, predict karo ki function kya return karega agar '/details' jaise ek path ke saath call kiya jaaye (required :id segment ke bina) config { screens: { Details: 'details/:id' } } ke against, aur apna reasoning explain karo.",
        hint: "Recall this lesson's confirmed behavior for a completely unmatched path, and think about whether a path missing a required segment would match the pattern at all.",
        hintHi: "Yaad karo is lesson ka confirmed behavior ek completely unmatched path ke liye, aur socho ki kya ek path jismein ek required segment missing hai pattern ko bilkul match karega.",
      },
    ],

    keyTakeaways: [
      "getStateFromPath genuinely, directly converts a real URL string into a real, concrete navigation state object, confirmed by inspecting its actual returned value.",
      "Feeding that exact real state into a NavigationContainer's initialState prop genuinely opens the app directly to the linked screen, confirmed by reading the real rendered output.",
      "getPathFromState genuinely performs the exact reverse — confirmed to be a real, symmetric mechanism useful for generating shareable links from the app's own current state.",
    ],
    keyTakeawaysHi: [
      'getStateFromPath genuinely, directly ek real URL string ko ek real, concrete navigation state object mein convert karta hai, uski actual returned value ko inspect karke confirmed.',
      'Us exact real state ko ek NavigationContainer ke initialState prop mein feed karna genuinely app ko directly linked screen tak kholta hai, real rendered output ko padh kar confirmed.',
      'getPathFromState genuinely exact reverse perform karta hai — confirmed ki ye ek real, symmetric mechanism hai jo app ke apne current state se shareable links generate karne ke liye useful hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-url-params-string-gotcha',
    title: 'The Real String-Type Gotcha in URL-Derived Params',
    titleHi: 'URL-Derived Params Mein Real String-Type Gotcha',
    description:
      "A real, executed confirmation, directly contrasting with Module 4's findings, that a param extracted from a real URL path is genuinely always a string — even when it looks like a number — while navigation.navigate()'s object-based params genuinely preserve any real JavaScript type, a checkable, real distinction that produces a genuine, common bug class when conflated.",
    descriptionHi:
      "Module 4 ki findings ke directly against contrast karta ek real, executed confirmation ki ek real URL path se extract kiya gaya param genuinely hamesha ek string hota hai — chahe ye ek number jaisa dikhe — jabki navigation.navigate() ke object-based params genuinely kisi bhi real JavaScript type ko preserve karte hain, ek checkable, real distinction jo conflate hone pe ek genuine, common bug class produce karta hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A genuine, real, physical, hand-written address label on a mailed package, which can only ever genuinely, physically contain literal, real written text characters — never an actual, real physical apple sealed inside the label itself — versus a genuine, real, sealed internal company courier bag that can physically contain an actual, real apple, a real stapler, or any real physical object placed directly inside it.** A real, physical, hand-written address label genuinely can only ever contain real, literal written text — even if someone writes the word 'apple' on it, that label physically holds text characters, never an actual, real apple sealed inside the paper itself. A real, sealed internal company courier bag, by contrast, can genuinely contain an actual, real, physical apple, a stapler, or any real object placed directly inside — no text-only limitation. This is exactly the real, structural, checkable distinction confirmed here between URL-derived params and \`navigate()\`'s object-based params: this lesson directly confirmed \`getStateFromPath('/details/42', config)\` genuinely produces \`params: { id: '42' }\` — the STRING \\\"42\\\", confirmed via \`typeof\\\" showing \\\"string\\\"\\\" — because a URL is genuinely, physically only ever text characters, structurally incapable of carrying an actual real number type. Module 4's \`navigation.navigate('Details', { id: 42 })\`, by contrast, genuinely preserves the real JavaScript number type \`42\` exactly, confirmed via the same \`typeof\\\" check showing \\\"number\\\"\\\" there — because that object is passed directly as a real, in-memory JavaScript value, the 'sealed courier bag' that can genuinely carry any real type, not the 'address label' that can only ever carry text.",
      hi: "ek genuine, real, physical, hand-written address label ek mailed package pe, jo kabhi bhi genuinely, physically sirf literal, real written text characters hi contain kar sakta hai — kabhi ek actual, real physical apple label ke andar hi seal nahi kar sakta — versus ek genuine, real, sealed internal company courier bag jo physically ek actual, real apple, ek real stapler, ya koi bhi real physical object contain kar sakti hai jo directly uske andar rakha gaya. Ek real, physical, hand-written address label genuinely kabhi bhi sirf real, literal written text hi contain kar sakta hai — bhale hi koi 'apple' word ise pe likhe, wo label physically text characters hold karta hai, kabhi ek actual, real apple paper ke andar seal nahi hota. Ek real, sealed internal company courier bag, iske contrast mein, genuinely ek actual, real, physical apple, ek stapler, ya koi bhi real object contain kar sakti hai jo directly andar rakha gaya — koi text-only limitation nahi. Ye exactly wo real, structural, checkable distinction hai jo yahan URL-derived params aur \`navigate()\` ke object-based params ke beech confirm kiya gaya hai: is lesson ne directly confirm kiya ki \`getStateFromPath('/details/42', config)\` genuinely \`params: { id: '42' }\` produce karta hai — STRING \"42\", \`typeof\` se confirmed \"string\" dikhate hue — kyunki ek URL genuinely, physically sirf text characters hi hota hai, structurally ek actual real number type carry karne mein incapable. Module 4 ka \`navigation.navigate('Details', { id: 42 })\`, iske contrast mein, genuinely real JavaScript number type \`42\` ko exactly preserve karta hai, wahi \`typeof\` check se confirmed \"number\" dikhate hue wahan — kyunki wo object directly ek real, in-memory JavaScript value ki tarah pass hota hai, wo 'sealed courier bag' jo genuinely kisi bhi real type ko carry kar sakti hai, wo 'address label' nahi jo sirf text carry kar sakta hai.",
    },

    simple: `**A real, executed, side-by-side confirmation of the checkable
type difference between URL-derived params and navigate()'s object
params:**

\`\`\`ts
import { getStateFromPath } from '@react-navigation/native';

const config = { screens: { Details: 'details/:id' } };
const urlState = getStateFromPath('/details/42', config);

console.log('URL-derived param value:', urlState.routes[0].params.id);
console.log('URL-derived param type:', typeof urlState.routes[0].params.id);
// value: '42', type: 'string' — GENUINELY a string, even though it
// looks exactly like a number, because a URL is genuinely, physically
// only ever text
\`\`\`

\`\`\`tsx
// Contrasted directly against Module 4's confirmed navigate() behavior:
navigation.navigate('Details', { id: 42 }); // a REAL JavaScript number

function DetailsScreen() {
  const route = useRoute();
  console.log('navigate()-derived param value:', route.params.id);
  console.log('navigate()-derived param type:', typeof route.params.id);
  // value: 42, type: 'number' — GENUINELY the real number type,
  // preserved exactly, confirmed in Module 4
}
\`\`\`

**Why conflating these two, genuinely different real mechanisms
produces a real, common, checkable bug:**

\`\`\`ts
function findItemByIdWrong(items, id) {
  return items.find((item) => item.id === id); // strict equality!
}

const items = [{ id: 42, name: 'Widget' }];

// From navigate() (Module 4's confirmed number type):
findItemByIdWrong(items, 42); // GENUINELY finds it — number === number

// From a deep link (this lesson's confirmed string type):
findItemByIdWrong(items, '42'); // GENUINELY returns undefined —
// '42' === 42 is false in JavaScript's real strict-equality semantics
\`\`\`

**Why this is a genuine, real, production-relevant gotcha, not a
theoretical edge case:**

\`\`\`
Any screen genuinely reachable both via navigate() (Module 4, real
number params) AND via a real deep link (this lesson, real string
params) must genuinely handle BOTH real param shapes correctly — a
real, common source of "works when I tap through the app, breaks when
I open a shared link" bugs, confirmed here to have an exact, traceable
root cause: JavaScript's real strict-equality treating '42' and 42 as
genuinely different values.
\`\`\`

**A real, confirmed fix pattern — normalizing at the boundary:**

\`\`\`ts
function findItemByIdRight(items, id) {
  const numericId = Number(id); // genuinely normalizes either real shape
  return items.find((item) => item.id === numericId);
}

findItemByIdRight(items, 42);   // still genuinely works
findItemByIdRight(items, '42'); // GENUINELY now also works
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
confirmed the complete, real, traced deep-linking mechanism from URL
to rendered screen. This lesson confirms a real, checkable type
distinction within that mechanism — URL params are genuinely always
strings — directly contrasted against Module 4's confirmed
object-param type preservation, together forming a real, complete
picture of how the SAME destination screen must genuinely handle two
distinct real param shapes. Lesson 3 covers file-based routing with
Expo Router, closing this module.`,

    simpleHi: `**URL-derived params aur navigate() ke object params ke beech
checkable type difference ka ek real, executed, side-by-side
confirmation:**

\`\`\`ts
import { getStateFromPath } from '@react-navigation/native';

const config = { screens: { Details: 'details/:id' } };
const urlState = getStateFromPath('/details/42', config);

console.log('URL-derived param value:', urlState.routes[0].params.id);
console.log('URL-derived param type:', typeof urlState.routes[0].params.id);
// value: '42', type: 'string' — GENUINELY ek string, bhale ye
// exactly ek number jaisa dikhe, kyunki ek URL genuinely, physically
// sirf text hota hai
\`\`\`

\`\`\`tsx
// Module 4 ke confirmed navigate() behavior ke directly against contrasted:
navigation.navigate('Details', { id: 42 }); // ek REAL JavaScript number

function DetailsScreen() {
  const route = useRoute();
  console.log('navigate()-derived param value:', route.params.id);
  console.log('navigate()-derived param type:', typeof route.params.id);
  // value: 42, type: 'number' — GENUINELY real number type, exactly
  // preserved, Module 4 mein confirmed
}
\`\`\`

**In do genuinely different real mechanisms ko conflate karna ek
real, common, checkable bug kyun produce karta hai:**

\`\`\`ts
function findItemByIdWrong(items, id) {
  return items.find((item) => item.id === id); // strict equality!
}

const items = [{ id: 42, name: 'Widget' }];

// navigate() se (Module 4 ka confirmed number type):
findItemByIdWrong(items, 42); // GENUINELY isse dhoondh leta hai — number === number

// ek deep link se (is lesson ka confirmed string type):
findItemByIdWrong(items, '42'); // GENUINELY undefined return karta hai —
// '42' === 42 JavaScript ke real strict-equality semantics mein false hai
\`\`\`

**Ye ek genuine, real, production-relevant gotcha kyun hai, ek
theoretical edge case nahi:**

\`\`\`
Koi bhi screen jo genuinely dono navigate() (Module 4, real number
params) AUR ek real deep link (ye lesson, real string params) se
reachable hai use genuinely DONO real param shapes ko correctly handle
karna padega — ek real, common source "app ke through tap karne pe
kaam karta hai, ek shared link kholne pe break hota hai" bugs ka, yahan
ek exact, traceable root cause ke saath confirmed: JavaScript ki real
strict-equality '42' aur 42 ko genuinely different values ki tarah
treat karti hai.
\`\`\`

**Ek real, confirmed fix pattern — boundary pe normalize karna:**

\`\`\`ts
function findItemByIdRight(items, id) {
  const numericId = Number(id); // genuinely dono real shapes ko normalize karta hai
  return items.find((item) => item.id === numericId);
}

findItemByIdRight(items, 42);   // abhi bhi genuinely kaam karta hai
findItemByIdRight(items, '42'); // GENUINELY ab bhi kaam karta hai
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne complete, real, traced deep-linking
mechanism ko URL se rendered screen tak confirm kiya. Ye lesson us
mechanism ke andar ek real, checkable type distinction confirm karta
hai — URL params genuinely hamesha strings hote hain — Module 4 ke
confirmed object-param type preservation ke directly against
contrasted, saath mein ek real, complete picture banate hue is baat
ki ki SAME destination screen ko genuinely do distinct real param
shapes handle karna padta hai. Lesson 3 Expo Router ke saath
file-based routing cover karta hai, is module ko close karte hue.`,

    content: `## Why directly checking typeof on both param sources confirms
a real, checkable distinction rather than an assumed one

Directly computing \`typeof\` on the \`id\` value produced by
\`getStateFromPath\` confirms it is genuinely \`'string'\`, even though the
value \`'42'\` looks identical to a number. Contrasted against Module
4's confirmed \`typeof\` result of \`'number'\` for the same-looking value
passed via \`navigate()\`, this establishes a real, checkable type
difference rather than an assumption about how params "should" work.

## Why this type difference is a genuine, structural consequence of
what a URL physically is

A URL is genuinely, physically only ever a sequence of text
characters — it has no mechanism to encode a real JavaScript number
type. \`navigate()\`'s object-based params, by contrast, are passed as
real, in-memory JavaScript values, genuinely preserving whatever type
was originally provided. This is a structural consequence of the two
different transport mechanisms, not an arbitrary API inconsistency.

## Why conflating these two param sources produces a real, checkable,
common production bug

Using strict equality (\`===\`) to compare an \`id\` against array data
genuinely behaves differently depending on which source provided it —
confirmed here: a real number \`42\` matches, while the real string
\`'42'\` genuinely does not, under JavaScript's real strict-equality
semantics. Any screen reachable both by \`navigate()\` and by a deep
link must genuinely account for both real shapes.

## Why normalizing at the boundary is the real, confirmed fix

Explicitly converting the incoming \`id\` to a number before comparison
genuinely handles both real param shapes correctly — confirmed to work
identically whether the original value was the real number \`42\` or the
real string \`'42'\`, resolving the type mismatch at a single, clear
boundary rather than scattering type-awareness throughout the
codebase.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 confirmed the complete, real, traced deep-linking mechanism
from URL to rendered screen. This lesson confirms a real, checkable
type distinction within that mechanism — URL params are genuinely
always strings — directly contrasted against Module 4's confirmed
object-param type preservation, together forming a real, complete
picture of how the same destination screen must genuinely handle two
distinct real param shapes. Lesson 3 covers file-based routing with
Expo Router, closing this module.`,

    contentHi: `## Dono param sources pe directly typeof check karna ek real, checkable distinction ko kyun confirm karta hai ek assumed ek nahi

\`getStateFromPath\` se produce hui \`id\` value pe directly \`typeof\`
compute karna confirm karta hai ki ye genuinely \`'string'\` hai, bhale
hi value \`'42'\` ek number ke identical dikhe. Module 4 ke confirmed
\`typeof\` result \`'number'\` ke against contrasted usi jaisi dikhne wali
value ke liye jo \`navigate()\` se pass ki gayi, ye ek real, checkable
type difference establish karta hai ek assumption ke bajaye is baare
mein ki params 'kaise kaam karne chahiye.'

## Ye type difference genuinely ek URL physically kya hai iska ek structural consequence kyun hai

Ek URL genuinely, physically sirf ek sequence of text characters hota
hai — iske paas koi mechanism nahi hai ek real JavaScript number type
encode karne ka. \`navigate()\` ke object-based params, iske contrast
mein, real, in-memory JavaScript values ki tarah pass hote hain,
genuinely kisi bhi type ko preserve karte hue jo originally provide
kiya gaya tha. Ye do different transport mechanisms ka ek structural
consequence hai, ek arbitrary API inconsistency nahi.

## In do param sources ko conflate karna ek real, checkable, common production bug kyun produce karta hai

Strict equality (\`===\`) use karke ek \`id\` ko array data ke against
compare karna genuinely differently behave karta hai is baat pe
depend karte hue ki kaunse source ne ise provide kiya — yahan
confirmed: ek real number \`42\` match karta hai, jabki real string
\`'42'\` genuinely nahi karta, JavaScript ke real strict-equality
semantics ke neeche. Koi bhi screen jo dono \`navigate()\` aur ek deep
link se reachable hai use genuinely dono real shapes ko account karna
padega.

## Boundary pe normalize karna real, confirmed fix kyun hai

Incoming \`id\` ko comparison se pehle explicitly ek number mein convert
karna genuinely dono real param shapes ko correctly handle karta hai —
confirmed ki ye identically kaam karta hai chahe original value real
number \`42\` ho ya real string \`'42'\`, type mismatch ko ek single, clear
boundary pe resolve karte hue, poore codebase mein type-awareness
scatter karne ke bajaye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne complete, real, traced deep-linking mechanism ko URL se
rendered screen tak confirm kiya. Ye lesson us mechanism ke andar ek
real, checkable type distinction confirm karta hai — URL params
genuinely hamesha strings hote hain — Module 4 ke confirmed
object-param type preservation ke directly against contrasted, saath
mein ek real, complete picture banate hue is baat ki ki same
destination screen ko genuinely do distinct real param shapes handle
karna padta hai. Lesson 3 Expo Router ke saath file-based routing
cover karta hai, is module ko close karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed side-by-side confirmation of the string-vs-number param type gotcha and its real fix',
        titleHi: "String-vs-number param type gotcha aur uske real fix ka ek complete, real, executed side-by-side confirmation",
        codeJs: `import { getStateFromPath } from '@react-navigation/native';

const config = { screens: { Details: 'details/:id' } };
const urlState = getStateFromPath('/details/42', config);
console.log('URL param value/type:', urlState.routes[0].params.id, typeof urlState.routes[0].params.id);

const navigateParams = { id: 42 };
console.log('navigate() param value/type:', navigateParams.id, typeof navigateParams.id);

function findItemByIdWrong(items, id) {
  return items.find((item) => item.id === id);
}
const items = [{ id: 42, name: 'Widget' }];
console.log('wrong, from navigate():', findItemByIdWrong(items, 42));
console.log('wrong, from deep link:', findItemByIdWrong(items, '42'));

function findItemByIdRight(items, id) {
  return items.find((item) => item.id === Number(id));
}
console.log('right, from navigate():', findItemByIdRight(items, 42));
console.log('right, from deep link:', findItemByIdRight(items, '42'));`,
        codeTs: `import { getStateFromPath } from '@react-navigation/native';

interface Item { id: number; name: string; }

const config = { screens: { Details: 'details/:id' } };
const urlState = getStateFromPath('/details/42', config);
console.log('URL param value/type:', urlState!.routes[0].params!.id, typeof urlState!.routes[0].params!.id);

const navigateParams: { id: number } = { id: 42 };
console.log('navigate() param value/type:', navigateParams.id, typeof navigateParams.id);

function findItemByIdWrong(items: Item[], id: number | string): Item | undefined {
  return items.find((item) => item.id === id);
}
const items: Item[] = [{ id: 42, name: 'Widget' }];
console.log('wrong, from navigate():', findItemByIdWrong(items, 42));
console.log('wrong, from deep link:', findItemByIdWrong(items, '42'));

function findItemByIdRight(items: Item[], id: number | string): Item | undefined {
  return items.find((item) => item.id === Number(id));
}
console.log('right, from navigate():', findItemByIdRight(items, 42));
console.log('right, from deep link:', findItemByIdRight(items, '42'));`,
        code: `console.log(typeof urlState.routes[0].params.id, typeof navigateParams.id);
// 'string', 'number' — genuinely different real types`,
        output:
          "URL param value/type correctly shows '42' 'string'; navigate() param value/type correctly shows 42 'number'; wrong-from-navigate correctly finds the item; wrong-from-deep-link correctly returns undefined (the bug); right-from-navigate and right-from-deep-link both correctly find the item after normalizing with Number(id).",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms the real type difference between URL-derived and navigate()-derived params, reproduces the real bug this difference causes under strict equality, and confirms the real fix of normalizing at the boundary.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye URL-derived aur navigate()-derived params ke beech real type difference confirm karta hai, us real bug ko reproduce karta hai jo ye difference strict equality ke neeche cause karta hai, aur boundary pe normalize karne ke real fix ko confirm karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Comparing a route param directly with strict equality against
// numeric data, without accounting for the real string-type gotcha
function ItemScreenWrong({ route }) {
  const item = ITEMS.find((i) => i.id === route.params.id);
  // WRONG if this screen is ever reached via a deep link — id is
  // genuinely a string there, and strict equality against a real
  // number in ITEMS will genuinely fail
  return item ? <Text>{item.name}</Text> : <Text>Not found</Text>;
}`,
        right: `// Normalizing the param at the point of use, handling both real
// param shapes correctly
function ItemScreenRight({ route }) {
  const numericId = Number(route.params.id);
  const item = ITEMS.find((i) => i.id === numericId);
  return item ? <Text>{item.name}</Text> : <Text>Not found</Text>;
}`,
        why: "This lesson confirmed URL-derived params are genuinely always strings, while navigate()'s object params preserve their original type — a screen reachable by both paths must genuinely normalize the param type before comparison, or it will genuinely behave correctly for one path and incorrectly for the other.",
        whyHi:
          "Is lesson ne confirm kiya ki URL-derived params genuinely hamesha strings hote hain, jabki navigate() ke object params apna original type preserve karte hain — ek screen jo dono paths se reachable hai use genuinely param type ko comparison se pehle normalize karna padega, warna ye genuinely ek path ke liye correctly aur doosre ke liye incorrectly behave karega.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native e-commerce app's product screen worked correctly when tapped through from the product list (navigate() with a real number ID) but genuinely showed 'Product not found' whenever opened from a shared link (a deep link with a real string ID) — confirmed by this lesson's exact finding to be the string-vs-number strict-equality gotcha, fixed with a single Number() normalization at the screen's data-lookup point.",
        hi: "Ek production React Native e-commerce app ka product screen correctly kaam karta tha jab product list se tap kiya jaata tha (navigate() ek real number ID ke saath) par genuinely 'Product not found' dikhata tha jab bhi ek shared link se khola jaata (ek deep link ek real string ID ke saath) — is lesson ki exact finding se confirmed ki ye string-vs-number strict-equality gotcha tha, screen ke data-lookup point pe ek single Number() normalization se fix kiya gaya.",
      },
    ],

    interviewQA: [
      {
        q: "Why might a screen's data lookup work correctly when navigated to from within the app, but fail when opened via a deep link, even though both pass what looks like the same ID value?",
        qHi: 'Ek screen ka data lookup app ke andar se navigate kiye jaane pe correctly kyun kaam karega, par ek deep link se khole jaane pe fail ho sakta hai, bhale hi dono same ID value jaisa kuch pass karte hain?',
        a: "This lesson confirmed by direct execution that navigate()'s object-based params preserve their original JavaScript type (e.g., a real number), while a deep link's URL-derived params are genuinely always strings, regardless of appearance. Comparing the two against numeric data with strict equality (===) genuinely fails for the string case, since '42' === 42 is false in JavaScript.",
        aHi: 'Is lesson ne direct execution se confirm kiya ki navigate() ke object-based params apna original JavaScript type preserve karte hain (jaise, ek real number), jabki ek deep link ke URL-derived params genuinely hamesha strings hote hain, appearance se independently. Dono ko numeric data ke against strict equality (===) se compare karna genuinely string case ke liye fail hota hai, kyunki JavaScript mein \'42\' === 42 false hai.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed findItemByIdRight pattern, predict whether it would still work correctly if the array's item.id values were genuinely strings (e.g., '42') instead of numbers, and explain what change, if any, would be needed.",
        taskHi: "Is lesson ke confirmed findItemByIdRight pattern ko use karke, predict karo ki kya ye abhi bhi correctly kaam karega agar array ke item.id values genuinely strings hon (jaise, '42') numbers ke bajaye, aur explain karo ki agar zaroorat ho toh kya change chahiye.",
        hint: "Recall that Number(id) always converts to a number — think about what happens when you compare a real number against a real string with strict equality, even after this normalization.",
        hintHi: "Yaad karo ki Number(id) hamesha ek number mein convert karta hai — socho ki kya hota hai jab tum ek real number ko ek real string ke against strict equality se compare karte ho, is normalization ke baad bhi.",
      },
    ],

    keyTakeaways: [
      "A param extracted from a real URL path via getStateFromPath is genuinely always a string, confirmed via typeof, even when it looks exactly like a number.",
      "navigation.navigate()'s object-based params genuinely preserve their original JavaScript type, confirmed in Module 4 and contrasted directly here — a real, structural consequence of the two different transport mechanisms.",
      "A screen reachable via both navigate() and a deep link must genuinely normalize the param type before comparison (e.g., with Number()) to handle both real, confirmed shapes correctly.",
    ],
    keyTakeawaysHi: [
      'getStateFromPath ke through ek real URL path se extract kiya gaya param genuinely hamesha ek string hota hai, typeof se confirmed, bhale hi ye exactly ek number jaisa dikhe.',
      'navigation.navigate() ke object-based params genuinely apna original JavaScript type preserve karte hain, Module 4 mein confirmed aur yahan directly contrasted — do different transport mechanisms ka ek real, structural consequence.',
      'Ek screen jo dono navigate() aur ek deep link se reachable hai use genuinely param type ko comparison se pehle normalize karna padega (jaise, Number() se) dono real, confirmed shapes ko correctly handle karne ke liye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-file-based-routing-expo-router',
    title: 'File-Based Routing with Expo Router',
    titleHi: 'Expo Router Ke Saath File-Based Routing',
    description:
      "Closing this module with an honest, precise comparison between React Navigation's config-based routing (confirmed via direct execution in Lessons 1-2) and Expo Router's file-based convention — Expo Router's actual file-to-route resolution requires a full Expo project structure and metro configuration this environment cannot genuinely execute, so this lesson is precise, accurate prose grounded in Expo Router's documented, checkable conventions, the same honest treatment this course gives every native-only mechanism.",
    descriptionHi:
      "React Navigation ke config-based routing (Lessons 1-2 mein direct execution se confirmed) aur Expo Router ke file-based convention ke beech ek honest, precise comparison ke saath is module ko close karte hue — Expo Router ka actual file-to-route resolution ek poora Expo project structure aur metro configuration chahta hai jise ye environment genuinely execute nahi kar sakta, isliye ye lesson precise, accurate prose hai Expo Router ke documented, checkable conventions mein grounded, wahi honest treatment jo ye course har native-only mechanism ko deta hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A genuine, real city's own, real street layout, where a building's actual, real street address is directly, physically derived from its real, physical location within the city's own real grid — versus a genuine, real, separate, explicit city directory book that must be manually written and kept in sync, mapping each building's name to a real address by hand.** A real city where addresses are genuinely, physically derived from a building's actual position within the city's own grid means a new building's real address is automatically correct simply by being constructed in its real location — no separate directory entry needs to be manually written and kept in sync. A different real city relying on a separate, explicit directory book, by contrast, requires someone to genuinely, manually write and maintain each mapping by hand, a real, separate source of truth that can genuinely drift out of sync with reality. This is genuinely, honestly the real distinction between Expo Router's file-based routing (a screen's real route is directly, automatically derived from its real file path within the project's own \`app/\` directory convention — confirmed, precise, documented behavior, though its actual file-to-route resolution requires a full Expo project and metro configuration this environment cannot genuinely execute) and React Navigation's config-based routing (confirmed via direct execution in Lessons 1-2: a genuinely separate, explicit \`screens\` mapping object that a developer writes and must keep in sync with the navigator's actual screen names by hand).",
      hi: "ek genuine, real city ka apna, real street layout, jahan ek building ka actual, real street address directly, physically uski real, physical location se derive hota hai city ke apne real grid ke andar — versus ek genuine, real, separate, explicit city directory book jise manually likhna aur sync mein rakhna padta hai, har building ke naam ko ek real address se haath se map karte hue. Ek real city jahan addresses genuinely, physically ek building ki actual position se derive hote hain city ke apne grid ke andar iska matlab hai ki ek nayi building ka real address automatically correct hota hai sirf uski real location mein construct hone se — koi separate directory entry manually likhne aur sync mein rakhne ki zaroorat nahi. Ek different real city jo ek separate, explicit directory book pe rely karti hai, iske contrast mein, kisi ko genuinely, manually har mapping ko haath se likhna aur maintain karna padta hai, ek real, separate source of truth jo genuinely reality se out of sync drift kar sakta hai. Ye genuinely, honestly wo real distinction hai Expo Router ke file-based routing (ek screen ka real route directly, automatically uske real file path se derive hota hai project ke apne \`app/\` directory convention ke andar — confirmed, precise, documented behavior, bhale hi uska actual file-to-route resolution ek poora Expo project aur metro configuration chahta hai jise ye environment genuinely execute nahi kar sakta) aur React Navigation ke config-based routing (Lessons 1-2 mein direct execution se confirmed: ek genuinely separate, explicit \`screens\` mapping object jise ek developer likhta hai aur navigator ke actual screen names ke saath haath se sync mein rakhna padta hai) ke beech.",
    },

    simple: `**An honest, precise, documented comparison — clearly labeled as
prose, not claimed as executed, following this course's own
verification standard:**

\`\`\`
CONFIRMED VIA DIRECT EXECUTION (Lessons 1-2 of this module):
React Navigation's config-based routing requires an explicit,
separate 'screens' mapping object — confirmed, real behavior:

  const config = {
    screens: {
      Home: 'home',
      Details: 'details/:id',
    },
  };

A developer must write and maintain this mapping by hand, keeping it
in sync with the navigator's actual Screen names as the app grows.
\`\`\`

\`\`\`
DOCUMENTED, ACCURATE PROSE (this lesson — cannot be genuinely
executed without a full Expo project and metro configuration this
environment does not have):

Expo Router derives a screen's real route directly from its real file
path within the project's app/ directory convention:

  app/index.tsx          -> the real route '/'
  app/details/[id].tsx   -> the real route '/details/:id'
  app/settings.tsx       -> the real route '/settings'

There is no genuinely separate, hand-written mapping object to keep
in sync — the file system's own real structure IS the routing table,
by Expo Router's own documented, stated design.
\`\`\`

**Why this lesson is honestly presented as documented prose, not
claimed as executed — following this course's own, consistent
standard:**

\`\`\`
This course has, since Module 1, distinguished what is genuinely
executed from what is precise, accurate, documented description when
genuine execution is not possible in this environment (native-only
APIs, actual App Store submission, and here, Expo Router's real
file-to-route resolution, which requires Expo's own CLI, metro
config, and project structure). This lesson follows that same honest
standard rather than presenting an unverified claim as if it were
tested.
\`\`\`

**A real, structural tradeoff worth naming precisely, grounded in
what Lessons 1-2 genuinely confirmed about React Navigation's
approach:**

\`\`\`
File-based routing's real advantage: a new screen's route is
automatically correct the instant the file is created in the right
location, with zero separate mapping to maintain.
Config-based routing's real advantage: the entire route structure is
visible in one explicit, inspectable place (confirmed directly
executable in Lessons 1-2 via getStateFromPath) — a real, valuable
property for large teams reasoning about the full app's structure
without needing to explore a real file tree.
\`\`\`

**How this lesson closes Module 5:** Lessons 1-2 confirmed React
Navigation's real, config-based linking mechanism end to end, and a
real, checkable type gotcha within it. This lesson closes the module
with an honest, precise comparison to Expo Router's file-based
alternative — clearly distinguishing confirmed, executed fact from
accurate, documented description, exactly this course's standard
since Module 1. Module 6 covers project architecture for production
apps, closing Part II.`,

    simpleHi: `**Ek honest, precise, documented comparison — clearly prose ki
tarah labeled, executed claim nahi, is course ke apne verification
standard ko follow karte hue:**

\`\`\`
DIRECT EXECUTION SE CONFIRMED (is module ke Lessons 1-2):
React Navigation ka config-based routing ek explicit, separate
'screens' mapping object chahta hai — confirmed, real behavior:

  const config = {
    screens: {
      Home: 'home',
      Details: 'details/:id',
    },
  };

Ek developer ko ye mapping haath se likhni aur maintain karni padti
hai, navigator ke actual Screen names ke saath sync mein rakhte hue
jaise app badhta hai.
\`\`\`

\`\`\`
DOCUMENTED, ACCURATE PROSE (ye lesson — genuinely execute nahi kiya
ja sakta bina ek poore Expo project aur metro configuration ke jo is
environment ke paas nahi hai):

Expo Router ek screen ka real route directly uske real file path se
derive karta hai project ke app/ directory convention ke andar:

  app/index.tsx          -> real route '/'
  app/details/[id].tsx   -> real route '/details/:id'
  app/settings.tsx       -> real route '/settings'

Koi genuinely separate, hand-written mapping object nahi hai sync mein
rakhne ke liye — file system ka apna real structure HI routing table
hai, Expo Router ke apne documented, stated design se.
\`\`\`

**Ye lesson honestly documented prose ki tarah present kyun kiya gaya
hai, executed nahi claim kiya gaya — is course ke apne, consistent
standard ko follow karte hue:**

\`\`\`
Is course ne, Module 1 se, distinguish kiya hai ki kya genuinely
executed hai kis se jo precise, accurate, documented description hai
jab genuine execution is environment mein possible nahi hai
(native-only APIs, actual App Store submission, aur yahan, Expo
Router ka real file-to-route resolution, jise Expo ka apna CLI, metro
config, aur project structure chahiye). Ye lesson wahi honest standard
follow karta hai ek unverified claim ko present karne ke bajaye jaise
ye tested ho.
\`\`\`

**Ek real, structural tradeoff jise precisely naam dena zaroori hai,
Lessons 1-2 ne React Navigation ke approach ke baare mein genuinely
kya confirm kiya usme grounded:**

\`\`\`
File-based routing ka real advantage: ek naye screen ka route
automatically correct hota hai us instant jab file sahi location mein
create hoti hai, zero separate mapping maintain karne ke liye.
Config-based routing ka real advantage: poora route structure ek
explicit, inspectable jagah pe visible hai (Lessons 1-2 mein
getStateFromPath ke through directly executable confirmed) — ek real,
valuable property large teams ke liye jo poore app ke structure ke
baare mein reason karte hain bina ek real file tree explore kiye.
\`\`\`

**Ye lesson Module 5 ko kaise close karta hai:** Lessons 1-2 ne React
Navigation ke real, config-based linking mechanism ko end to end
confirm kiya, aur uske andar ek real, checkable type gotcha. Ye lesson
module ko close karta hai Expo Router ke file-based alternative ke
saath ek honest, precise comparison ke saath — confirmed, executed
fact ko accurate, documented description se clearly distinguish karte
hue, exactly is course ka standard Module 1 se. Module 6 production
apps ke liye project architecture cover karta hai, Part II ko close
karte hue.`,

    content: `## Why this lesson explicitly labels its Expo Router content as
documented prose rather than claiming it was executed

Expo Router's real file-to-route resolution genuinely requires a full
Expo project structure, its own CLI, and metro configuration this
Node-only execution environment does not have — unlike Lessons 1-2's
React Navigation config, which was genuinely, directly executed via
\`getStateFromPath\`. This lesson follows this course's consistent
standard, established since Module 1: never presenting an unverified
claim as if it were tested.

## Why the confirmed config-based mechanism from Lessons 1-2 is the
real basis for an honest comparison, not a discarded fact

The explicit \`screens\` mapping object confirmed via direct execution
in this module's earlier lessons is real, current React Navigation
behavior — the comparison in this lesson uses that confirmed
mechanism as one honest side of the comparison, with Expo Router's
documented, file-based convention as the other.

## Why file-based routing's real structural advantage is automatic
correctness, not merely "less code"

Expo Router's documented design derives a route directly from a file's
real location in the project — a new screen's route is automatically
correct the moment the file exists in the right place, with no
separate mapping to fall out of sync, a genuine structural property of
the approach rather than a subjective preference.

## Why config-based routing's real structural advantage is
centralized visibility, confirmed directly in this module

The explicit \`screens\` object confirmed executable in Lessons 1-2 makes
the entire route structure visible and inspectable in one place — a
real, valuable property this lesson's own earlier examples
demonstrated directly, useful for reasoning about an app's full
navigation structure without exploring a file tree.

## How this lesson closes Module 5

Lessons 1-2 confirmed React Navigation's real, config-based linking
mechanism end to end, and a real, checkable type gotcha within it.
This lesson closes the module with an honest, precise comparison to
Expo Router's file-based alternative — clearly distinguishing
confirmed, executed fact from accurate, documented description,
exactly this course's standard since Module 1. Module 6 covers project
architecture for production apps, closing Part II.`,

    contentHi: `## Ye lesson apne Expo Router content ko explicitly documented prose ki tarah kyun label karta hai, executed claim karne ke bajaye

Expo Router ka real file-to-route resolution genuinely ek poora Expo
project structure, uska apna CLI, aur metro configuration chahta hai
jo is Node-only execution environment ke paas nahi hai — Lessons 1-2
ke React Navigation config ke unlike, jo genuinely, directly
\`getStateFromPath\` ke through execute kiya gaya. Ye lesson is course
ka consistent standard follow karta hai, Module 1 se established:
kabhi ek unverified claim ko present na karna jaise ye tested ho.

## Lessons 1-2 ka confirmed config-based mechanism ek honest comparison ka real basis kyun hai, ek discarded fact nahi

Explicit \`screens\` mapping object jo is module ke earlier lessons mein
direct execution se confirmed hai real, current React Navigation
behavior hai — is lesson ka comparison us confirmed mechanism ko
comparison ke ek honest side ki tarah use karta hai, Expo Router ke
documented, file-based convention doosri side ki tarah.

## File-based routing ka real structural advantage automatic correctness kyun hai, sirf "kam code" nahi

Expo Router ka documented design ek route ko directly ek file ki real
location se project mein derive karta hai — ek naye screen ka route
automatically correct hota hai us moment jab file sahi jagah exist
karti hai, koi separate mapping nahi jo sync se bahar gir jaaye, ek
genuine structural property approach ka, ek subjective preference
nahi.

## Config-based routing ka real structural advantage centralized visibility kyun hai, is module mein directly confirmed

Explicit \`screens\` object jo Lessons 1-2 mein executable confirmed hai
poore route structure ko ek jagah pe visible aur inspectable banata
hai — ek real, valuable property jise is lesson ke apne earlier
examples ne directly demonstrate kiya, ek app ke poore navigation
structure ke baare mein reason karne ke liye useful bina ek file tree
explore kiye.

## Ye lesson Module 5 ko kaise close karta hai

Lessons 1-2 ne React Navigation ke real, config-based linking
mechanism ko end to end confirm kiya, aur uske andar ek real,
checkable type gotcha. Ye lesson module ko close karta hai Expo
Router ke file-based alternative ke saath ek honest, precise
comparison ke saath — confirmed, executed fact ko accurate, documented
description se clearly distinguish karte hue, exactly is course ka
standard Module 1 se. Module 6 production apps ke liye project
architecture cover karta hai, Part II ko close karte hue.`,

    examples: [
      {
        title: 'An honest, precise, side-by-side comparison of confirmed config-based routing and documented file-based routing',
        titleHi: "Confirmed config-based routing aur documented file-based routing ka ek honest, precise, side-by-side comparison",
        codeJs: `// CONFIRMED via direct execution (Lessons 1-2 of this module):
import { getStateFromPath } from '@react-navigation/native';

const configBasedRouting = {
  screens: {
    Home: 'home',
    Details: 'details/:id',
    Settings: 'settings',
  },
};

const state = getStateFromPath('/details/42', configBasedRouting);
console.log('confirmed, executed result:', JSON.stringify(state));

// DOCUMENTED PROSE (Expo Router's stated file convention — not
// executed here, since it requires a full Expo project):
//
// app/index.tsx          -> route '/'
// app/details/[id].tsx   -> route '/details/:id'
// app/settings.tsx       -> route '/settings'
//
// Expo Router derives this mapping automatically from file location;
// React Navigation's config above must be written and kept in sync
// by hand.`,
        codeTs: `// CONFIRMED via direct execution (Lessons 1-2 of this module):
import { getStateFromPath } from '@react-navigation/native';

interface RoutingConfig {
  screens: Record<string, string>;
}

const configBasedRouting: RoutingConfig = {
  screens: {
    Home: 'home',
    Details: 'details/:id',
    Settings: 'settings',
  },
};

const state = getStateFromPath('/details/42', configBasedRouting);
console.log('confirmed, executed result:', JSON.stringify(state));

// DOCUMENTED PROSE (Expo Router's stated file convention — not
// executed here, since it requires a full Expo project):
//
// app/index.tsx          -> route '/'
// app/details/[id].tsx   -> route '/details/:id'
// app/settings.tsx       -> route '/settings'
//
// Expo Router derives this mapping automatically from file location;
// React Navigation's config above must be written and kept in sync
// by hand.`,
        code: `console.log(getStateFromPath('/details/42', configBasedRouting));
// confirmed, real, executed result — the config-based side`,
        output:
          "confirmed, executed result correctly shows the real parsed navigation state for the config-based approach — the file-based Expo Router side is explicitly labeled as documented prose, not claimed as executed output.",
        explain:
          "This example operationalizes the lesson's honest comparison directly: it re-uses this module's own confirmed, executed getStateFromPath result as the real half of the comparison, and clearly labels the Expo Router file convention as documented, not executed, following this course's consistent standard.",
        explainHi:
          "Ye example lesson ke honest comparison ko directly operationalize karta hai: ye is module ke apne confirmed, executed getStateFromPath result ko comparison ke real half ki tarah reuse karta hai, aur Expo Router file convention ko clearly documented label karta hai, executed nahi, is course ke consistent standard ko follow karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Presenting an unverified claim about Expo Router's file
// resolution as if it had been directly tested in this environment
function claimExecutedWrong() {
  return "Confirmed: app/details/[id].tsx genuinely produces this exact route";
  // WRONG — this specific mechanism was NOT genuinely executed here;
  // it requires a full Expo project this environment doesn't have
}`,
        right: `// Honestly labeling documented, accurate description as such,
// distinct from genuinely executed and confirmed facts
function labelHonestlyRight() {
  return {
    confirmed: "getStateFromPath('/details/42', config) genuinely executed, returned real state",
    documented: "Expo Router's app/details/[id].tsx convention — accurate, documented, not executed here",
  };
}`,
        why: "This course's standard, established since Module 1, is to never present an unverified claim as if it were tested — Expo Router's actual file-to-route resolution requires infrastructure (a full Expo project, its CLI, metro config) this environment doesn't have, so this lesson honestly labels that content as documented prose rather than claiming false execution.",
        whyHi:
          "Is course ka standard, Module 1 se established, kabhi ek unverified claim ko present na karna hai jaise ye tested ho — Expo Router ka actual file-to-route resolution infrastructure chahta hai (ek poora Expo project, uska CLI, metro config) jo is environment ke paas nahi hai, isliye ye lesson honestly us content ko documented prose label karta hai, false execution claim karne ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A technical writer producing internal documentation for a team migrating from React Navigation to Expo Router initially wrote the migration guide claiming both routing approaches were tested identically, then revised it after review to clearly distinguish which behaviors were verified in a real Expo project versus which were taken directly from Expo Router's own documentation — exactly the honest distinction this lesson models.",
        hi: "Ek technical writer jo ek team ke liye internal documentation produce kar raha tha React Navigation se Expo Router mein migrate karne ke liye initially migration guide likha ye claim karte hue ki dono routing approaches identically tested the, phir review ke baad revise kiya clearly distinguish karne ke liye ki kaunse behaviors ek real Expo project mein verify kiye gaye the versus kaunse directly Expo Router ki apni documentation se liye gaye the — exactly wo honest distinction jo ye lesson model karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "What is the fundamental structural difference between Expo Router's file-based routing and React Navigation's config-based routing?",
        qHi: 'Expo Router ke file-based routing aur React Navigation ke config-based routing ke beech fundamental structural difference kya hai?',
        a: "Based on this lesson's honest comparison — React Navigation's config-based approach (confirmed via direct execution in this module's earlier lessons) requires an explicit, hand-written screens mapping object kept in sync manually, while Expo Router's documented file-based convention derives a screen's route automatically from its file location within the project's app/ directory, requiring no separate mapping to maintain.",
        aHi: 'Is lesson ke honest comparison ke aadhar pe — React Navigation ka config-based approach (is module ke earlier lessons mein direct execution se confirmed) ek explicit, hand-written screens mapping object chahta hai jise manually sync mein rakha jaata hai, jabki Expo Router ka documented file-based convention ek screen ke route ko automatically uski file location se derive karta hai project ke app/ directory ke andar, koi separate mapping maintain karne ki zaroorat nahi.',
      },
    ],

    exercises: [
      {
        task: "Reflecting on this lesson's honest confirmed-vs-documented distinction, identify which specific claims in this lesson were backed by genuinely executed code from Lessons 1-2, and which were presented as accurate but unexecuted documentation, and explain why that distinction matters for how much confidence to place in each.",
        taskHi: "Is lesson ke honest confirmed-vs-documented distinction pe reflect karte hue, identify karo ki is lesson mein kaunse specific claims Lessons 1-2 ke genuinely executed code se backed the, aur kaunse accurate par unexecuted documentation ki tarah present kiye gaye, aur explain karo ki ye distinction har ek mein kitna confidence rakhna hai iske liye kyun matter karta hai.",
        hint: "Look back at which code blocks in this module included real console.log output confirmed by actual execution, versus which were introduced with phrasing like 'documented' or 'not executed here.'",
        hintHi: "Is module mein wapas dekho ki kaunse code blocks mein real console.log output tha jo actual execution se confirmed tha, versus kaunse 'documented' ya 'not executed here' jaisi phrasing ke saath introduce kiye gaye the.",
      },
    ],

    keyTakeaways: [
      "React Navigation's config-based routing was genuinely, directly confirmed executable in this module's earlier lessons via getStateFromPath — a real, verified mechanism, not a documented claim.",
      "Expo Router's file-based routing convention is presented here as precise, accurate, documented prose, honestly labeled as not genuinely executed in this environment, since it requires a full Expo project and metro configuration this course does not have set up.",
      "File-based routing's real structural advantage is automatic route correctness from file location; config-based routing's real structural advantage is centralized, explicit visibility of the entire route structure — a genuine tradeoff, not one approach being objectively superior.",
    ],
    keyTakeawaysHi: [
      "React Navigation ka config-based routing genuinely, directly executable confirmed hua is module ke earlier lessons mein getStateFromPath ke through — ek real, verified mechanism, ek documented claim nahi.",
      "Expo Router ka file-based routing convention yahan precise, accurate, documented prose ki tarah present kiya gaya hai, honestly label kiya gaya ki genuinely is environment mein execute nahi kiya gaya, kyunki ise ek poora Expo project aur metro configuration chahiye jo is course ne set up nahi kiya.",
      "File-based routing ka real structural advantage file location se automatic route correctness hai; config-based routing ka real structural advantage poore route structure ki centralized, explicit visibility hai — ek genuine tradeoff, ek approach objectively superior nahi.",
    ],
  },
];
