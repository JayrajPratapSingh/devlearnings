/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 7.
 *
 * Feature-based (vertical-slice) folder structure for large apps, as
 * opposed to organizing top-level folders by technical type (components/,
 * hooks/, utils/, services/) with every feature's files mixed together
 * inside each one. Broken example: a type-based structure where deleting
 * or safely refactoring one feature requires hunting across many
 * unrelated top-level folders to find every file that belongs to it, and
 * two unrelated features accidentally collide on a generically-named
 * file placed in the same flat folder. Fixed by colocating every file a
 * feature owns under its own folder, exposing only a deliberate public
 * surface via a single index.ts barrel file, and reserving a top-level
 * shared/ folder strictly for code genuinely used by more than one
 * feature.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_5_PART7: CourseLesson[] = [
  {
    slug: 'feature-based-folder-structure',
    title: 'Feature-Based Folder Structure at Scale',
    titleHi: 'Scale Par Feature-Based Folder Structure',
    description: 'A senior engineer is asked to delete the "search" feature from a two-year-old codebase. It takes them an entire afternoon of grep-ing across a dozen unrelated top-level folders just to feel confident they found every file that belongs to it.',
    descriptionHi: 'Ek senior engineer se ek do-saal-purani codebase se "search" feature hataane ko kaha jaata hai. Unhe ek dozen na-judi top-level folders ke aar-paar grep karte hue poora ek dopahar lagta hai bas ye mehsoos karne ke liye ki unhone wo har file dhoondh li jo isse belong karti hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 7,

    analogy: {
      en: '**A workshop organized purely by tool type — every hammer from every project stored together in one giant drawer, every screwdriver from every project in another, regardless of which specific project each tool actually belongs to — versus a workshop where each project gets its own dedicated workbench holding every tool that project needs.** In the tool-type workshop, finishing or abandoning one specific project requires walking to the hammer drawer and finding the one hammer that belongs to that project among dozens of other unrelated hammers, then doing the same at the screwdriver drawer, then the drill drawer, hoping nothing is missed along the way — and if a coworker accidentally used a tool meant for someone else\'s project, there was never anything about the drawer itself that would have stopped them, since all the drawers are shared and none belong to any one project in particular. In the project-workbench workshop, finishing or abandoning a project is as simple as clearing that one workbench; every tool the project ever used is sitting right there, and nothing at another project\'s workbench is at risk of being confused for it, because each workbench\'s contents were never mixed with anyone else\'s. A React codebase organized into top-level components/, hooks/, utils/, and services/ folders, each one containing files from every feature the app has ever grown, is the tool-type workshop: removing or understanding one feature means searching across every one of those folders for files that happen to belong to it, with nothing about the folder structure itself indicating which files are related. A codebase organized into one folder per feature — each holding its own components, hooks, and API calls together — is the project-workbench workshop: a feature\'s entire footprint lives in exactly one place, and deleting that feature is, quite literally, deleting one folder.',
      hi: '**Ek workshop jo bilkul tool type se organize ki gayi hai — har project ka har hammer ek vishaal drawer mein saath rakha jaata hai, har project ka har screwdriver doosre mein, chahe har tool khaas taur par kis project se belong karta ho — versus ek workshop jahan har project ko apna khud ka dedicated workbench milta hai jismein wo har tool hai jo us project ko chahiye.** Tool-type workshop mein, ek khaas project ko poora karna ya chhodna hammer drawer tak chalne aur dusre kayi na-judi hammers ke beech us ek hammer ko dhoondhne ki maang karta hai jo us project se belong karta hai, phir screwdriver drawer par wahi karna, phir drill drawer, ye ummeed karte hue ki raaste mein kuch chhoota na ho — aur agar ek coworker ne galti se koi tool istemal kiya jo kisi aur ke project ke liye tha, drawer ke baare mein khud kabhi kuch nahi tha jo unhe rokta, kyunki sab drawers shared hain aur koi khaas taur par kisi ek project ka nahi hai. Project-workbench workshop mein, ek project ko poora karna ya chhodna sirf us ek workbench ko saaf karne jitna aasaan hai; har tool jo project ne kabhi istemal kiya wahin baitha hai, aur kisi doosre project ke workbench par kuch bhi ise samjhne mein galat hone ka khatra nahi hai, kyunki har workbench ki cheezein kabhi kisi aur ke saath mili nahi thi. Ek React codebase jo top-level \`components/\`, \`hooks/\`, \`utils/\`, aur \`services/\` folders mein organize ki gayi hai, har ek mein us features ki files hain jo app ne kabhi ugaayi hain, tool-type workshop hai: ek feature hataana ya samajhna un har ek folder ke aar-paar un files ke liye khoj karna hai jo isse belong karti hain, folder structure ke baare mein khud kuch bhi ye na darsaate hue ki kaunsi files judi hain. Ek codebase jo har feature ke liye ek folder mein organize ki gayi hai — har ek apne khud ke components, hooks, aur API calls saath rakhte hue — project-workbench workshop hai: ek feature ka poora footprint bilkul ek jagah rehta hai, aur us feature ko hataana, bilkul sach mein, ek folder hataana hai.',
    },

    simple: `**Start broken.** A type-based structure where every feature\'s files are scattered across the same shared top-level folders:

\`\`\`
src/
  components/
    SearchBar.tsx
    SearchResults.tsx
    CheckoutForm.tsx
    CheckoutSummary.tsx
    ProfileAvatar.tsx
  hooks/
    useSearchFilters.ts
    useCheckoutTotals.ts
    useProfileEdit.ts
  services/
    searchApi.ts
    checkoutApi.ts
    profileApi.ts
\`\`\`

Every file that belongs to the "search" feature — its components, its hooks, its API calls — is scattered across three completely different top-level folders, mixed in among files that belong to "checkout" and "profile" instead. There is nothing in this structure itself that groups search\'s own files together; the only thing keeping track of which files belong to which feature is a developer\'s own memory, or a naming convention like a shared "Search" or "search" prefix that nothing actually enforces. Asked to remove the search feature entirely, a developer must open \`components/\`, \`hooks/\`, and \`services/\` one at a time, manually picking out only the files that happen to relate to search from among everything else sitting in each folder — and if even one file is missed, it is silently left behind as dead code with no clear owner.

**The fix: one folder per feature, holding everything that feature owns**

\`\`\`
src/
  features/
    search/
      components/
        SearchBar.tsx
        SearchResults.tsx
      hooks/
        useSearchFilters.ts
      api/
        searchApi.ts
      index.ts
    checkout/
      components/
        CheckoutForm.tsx
        CheckoutSummary.tsx
      hooks/
        useCheckoutTotals.ts
      api/
        checkoutApi.ts
      index.ts
    profile/
      components/
        ProfileAvatar.tsx
      hooks/
        useProfileEdit.ts
      api/
        profileApi.ts
      index.ts
  shared/
    components/
      Button.tsx
      Modal.tsx
    hooks/
      useDebounce.ts
\`\`\`

Every file the "search" feature owns now lives inside \`features/search/\`, regardless of whether it is a component, a hook, or an API call — the folder is organized around what the code is FOR, not around what technical category it happens to fall into. Removing search entirely is now a single, confident action: delete \`features/search/\`, and by construction, nothing belonging to any other feature was ever inside it. A genuinely shared, cross-cutting piece of code — a generic \`Button\` used by every feature, a \`useDebounce\` hook with no feature-specific logic in it at all — lives in its own separate \`shared/\` folder specifically because it does NOT belong to any single feature, which is a deliberate, narrow exception rather than the default way most code is organized.`,

    simpleHi: `**Toote hue se shuru.** Ek type-based structure jahan har feature ki files ek hi shared top-level folders ke aar-paar bikhri hoti hain:

\`\`\`
src/
  components/
    SearchBar.tsx
    SearchResults.tsx
    CheckoutForm.tsx
    CheckoutSummary.tsx
    ProfileAvatar.tsx
  hooks/
    useSearchFilters.ts
    useCheckoutTotals.ts
    useProfileEdit.ts
  services/
    searchApi.ts
    checkoutApi.ts
    profileApi.ts
\`\`\`

Har file jo "search" feature se belong karti hai — uske components, uske hooks, uski API calls — teen bilkul alag top-level folders ke aar-paar bikhri hai, un files ke saath mili hui jo "checkout" aur "profile" se belong karti hain. Is structure mein khud kuch bhi nahi hai jo search ki apni files ko saath group kare; sirf ek developer ki apni yaadaasht, ya ek naming convention jaisa ek shared "Search" ya "search" prefix jise asal mein kuch bhi lagu nahi karta, hi track rakhta hai ki kaunsi file kis feature se belong karti hai. Search feature ko poori tarah hataane ko kaha gaya, ek developer ko \`components/\`, \`hooks/\`, aur \`services/\` ek-ek karke kholna padta hai, har ek mein baithi baaki sab cheezon mein se sirf un files ko haath se chunte hue jo search se mutaalliq hain — aur agar ek bhi file chhoot jaati hai, ye chupchaap dead code ki tarah bina kisi saaf owner ke chhod di jaati hai.

**Fix: har feature ke liye ek folder, wo sab kuch rakhte hue jo feature ka apna hai**

\`\`\`
src/
  features/
    search/
      components/
        SearchBar.tsx
        SearchResults.tsx
      hooks/
        useSearchFilters.ts
      api/
        searchApi.ts
      index.ts
    checkout/
      components/
        CheckoutForm.tsx
        CheckoutSummary.tsx
      hooks/
        useCheckoutTotals.ts
      api/
        checkoutApi.ts
      index.ts
    profile/
      components/
        ProfileAvatar.tsx
      hooks/
        useProfileEdit.ts
      api/
        profileApi.ts
      index.ts
  shared/
    components/
      Button.tsx
      Modal.tsx
    hooks/
      useDebounce.ts
\`\`\`

Har file jo "search" feature ki apni hai ab \`features/search/\` ke andar rehti hai, chahe ye ek component ho, ek hook ho, ya ek API call ho — folder us cheez ke aas-paas organize hai jiske liye code HAI, na ki us technical category ke aas-paas jismein ye samyog se aata hai. Search ko poori tarah hataana ab ek akela, bharosemand kadam hai: \`features/search/\` hataao, aur nirmaan se, kisi bhi doosre feature se belong karti kuch bhi kabhi ismein thi hi nahi. Ek sach mein shared, cross-cutting cheez ka code — ek generic \`Button\` jo har feature istemal karta hai, ek \`useDebounce\` hook jisme koi feature-khaas logic bilkul nahi hai — apne khud ke alag \`shared/\` folder mein rehta hai khaas taur par kyunki ye kisi ek feature ka NAHI hai, jo ek jaan-boojhkar, sankeern apvaad hai zyaadatar code organize hone ke default tarike ke bajaye.`,

    content: `## The public surface: one index.ts barrel per feature

\`\`\`ts
// features/search/index.ts
export { SearchBar } from './components/SearchBar';
export { useSearchFilters } from './hooks/useSearchFilters';
// Internal helpers, like a searchApi.ts implementation detail, are
// deliberately NOT re-exported here, so nothing outside this feature
// can import them directly.
\`\`\`

Grouping a feature\'s files into one folder solves discoverability, but on its own it does not stop another feature from reaching directly into search\'s internals — importing \`features/search/hooks/useSearchFilters\` from inside \`features/checkout\` is still perfectly possible, and nothing about the folder boundary itself prevents it. A single \`index.ts\` file at each feature\'s root, deliberately re-exporting only the specific pieces meant to be used elsewhere, turns the folder into something closer to a genuine module with a real public API: other features import from \`features/search\` itself (which resolves to this \`index.ts\`), never by reaching past it into \`features/search/hooks/...\` directly. Anything not re-exported from that \`index.ts\` — an internal helper function, a feature-specific type only used inside search\'s own components — can be freely renamed, restructured, or deleted without any risk of breaking a completely unrelated feature that happened to import it directly.

## Why the "shared" folder must stay deliberately small

A common failure mode when adopting feature-based structure is treating \`shared/\` as a convenient dumping ground for anything two features happen to both need, which quietly recreates the exact same all-features-tangled-together problem the restructuring was meant to solve, just under a different folder name. A genuinely shared piece of code should be usable, and understandable, with zero knowledge of any specific feature\'s own business logic — a generic \`Button\` or \`Modal\` component, a \`useDebounce\` hook, a date-formatting utility. A component like \`CheckoutSummary\`, even if a second feature briefly starts reusing it, is not automatically "shared" in this sense; it still fundamentally embodies checkout-specific business logic, and the more defensible move is usually for the second feature to import it directly from \`features/checkout\` (via its \`index.ts\`) rather than relocating genuinely feature-specific code into the shared folder purely because more than one place currently uses it.

## Enforcing the boundary so it survives contact with a growing team

\`\`\`json
// .eslintrc — conceptual example, exact syntax depends on the plugin used
{
  "rules": {
    "import/no-restricted-paths": [
      "error",
      { "zones": [{ "target": "./src/features/search", "from": "./src/features/checkout" }] }
    ]
  }
}
\`\`\`

A folder-based convention on its own only works as long as every contributor remembers and respects it by hand — on a large team, someone eventually imports directly from another feature\'s internals simply because nothing stopped them, and the discipline erodes over time. Lint rules restricting cross-feature imports to only a feature\'s own \`index.ts\` (several ESLint plugins support exactly this kind of path-based import restriction) turn the folder convention into something enforced automatically at review time, catching an accidental deep import the same way a type error catches an accidental type mismatch — the architecture is no longer relying purely on everyone remembering the rule.

## This still fits inside the module-level organization this course has already used

This course\'s own React content is itself organized by feature-ish grouping at a coarser level — Module 1 through Module 6 each group topics by what they are actually about (fundamentals, state, effects, hooks, patterns, security) rather than an arbitrary technical split — and a large app\'s own \`features/\` folder is the same underlying idea applied one level deeper, inside the codebase\'s actual source files rather than at the level of a course\'s table of contents.`,

    contentHi: `## Public surface: har feature ke liye ek \`index.ts\` barrel

\`\`\`ts
// features/search/index.ts
export { SearchBar } from './components/SearchBar';
export { useSearchFilters } from './hooks/useSearchFilters';
// Internal helpers, jaise ek searchApi.ts implementation detail,
// jaan-boojhkar yahaan re-export NAHI kiye jaate, taaki is feature
// ke bahar kuch bhi unhe seedhe import na kar sake.
\`\`\`

Ek feature ki files ko ek folder mein group karna discoverability sulajhaata hai, par akela ye kisi doosre feature ko search ke internals mein seedhe pahunchne se nahi rokta — \`features/checkout\` ke andar se \`features/search/hooks/useSearchFilters\` import karna abhi bhi bilkul mumkin hai, aur folder boundary ke baare mein khud kuch bhi ise nahi rokta. Har feature ke root par ek akela \`index.ts\` file, jaan-boojhkar sirf un khaas hisso ko re-export karte hue jo kahin aur istemal hone ke liye hain, folder ko ek asli module ke zyaada kareeb kuch mein badalta hai ek asli public API ke saath: doosre features \`features/search\` se khud import karte hain (jo is \`index.ts\` par resolve hota hai), kabhi ise past karke \`features/search/hooks/...\` mein seedhe pahunch kar nahi. Kuch bhi jo us \`index.ts\` se re-export nahi hua — ek internal helper function, ek feature-khaas type jo sirf search ke apne components ke andar istemal hoti hai — bina kisi khatre ke azaadi se rename, restructure, ya delete kiya jaa sakta hai kisi bilkul na-judi feature ko todne ke jo use seedhe import karti hui.

## "Shared" folder ko jaan-boojhkar chhota kyun rehna chahiye

Feature-based structure apnaane ka ek aam failure mode \`shared/\` ko kisi bhi cheez ke liye ek suvidhaajanak dumping ground ki tarah treat karna hai jo do features samyog se dono chahte hain, jo chupchaap bilkul wahi sab-features-uljhi-hui-saath samasya dobara banaata hai jise restructuring sulajhaane ke liye thi, bas ek alag folder naam ke neeche. Ek sach mein shared code ka hissa istemal-yogya, aur samajhne-yogya, hona chahiye kisi khaas feature ki apni business logic ke shoonya gyaan ke saath — ek generic \`Button\` ya \`Modal\` component, ek \`useDebounce\` hook, ek date-formatting utility. Ek component jaisa \`CheckoutSummary\`, chahe ek doosra feature thodi der ke liye ise dobara istemal karna shuru kare, is arth mein automatically "shared" nahi ban jaata; ye phir bhi buniyaadi roop se checkout-khaas business logic ko darsaata hai, aur zyaada bachaao-yogya kadam aksar doosre feature ke liye ise \`features/checkout\` se seedhe import karna hai (uske \`index.ts\` ke zariye) sach mein feature-khaas code ko shared folder mein relocate karne ke bajaye sirf isliye kyunki abhi ek se zyaada jagah ise istemal karti hai.

## Boundary ko lagu karna taaki ye badhte team ke saamne tik sake

\`\`\`json
// .eslintrc — conceptual example, exact syntax istemal ki gayi plugin par nirbhar karta hai
{
  "rules": {
    "import/no-restricted-paths": [
      "error",
      { "zones": [{ "target": "./src/features/search", "from": "./src/features/checkout" }] }
    ]
  }
}
\`\`\`

Ek akela folder-based convention khud tabhi tak kaam karta hai jab tak har contributor ise haath se yaad rakhta aur maanta hai — ek badi team par, koi ek din doosre feature ke internals se seedhe import karta hai bas isliye kyunki kuch bhi unhe roka nahi, aur discipline waqt ke saath ghisti hai. Cross-feature imports ko sirf ek feature ke apne \`index.ts\` tak seemit karne wale lint rules (kayi ESLint plugins bilkul is tarah ka path-based import restriction support karte hain) folder convention ko kuch aisa banaate hain jo review waqt automatically lagu hota hai, ek galti se hui deep import ko usi tarah pakadte hue jaise ek type error ek galti se hui type mismatch pakadta hai — architecture ab sirf sab ke rule yaad rakhne par nirbhar nahi hai.

## Ye is course ke apne module-level organization ke andar bhi fit baithta hai

Is course ka apna React content khud ek coarser level par feature-jaisi grouping se organize hai — Module 1 se Module 6 har ek topics ko us cheez ke aas-paas group karta hai jiske baare mein wo asal mein hain (fundamentals, state, effects, hooks, patterns, security) na ki ek manmaana technical split ke aas-paas — aur ek badi app ka apna \`features/\` folder wahi underlying idea hai ek star aur andar lagu ki gayi, ek course ke table of contents ke star par nahi balki codebase ki asli source files ke andar.`,

    examples: [
      {
        title: 'Broken: a type-based structure scatters one feature\'s files across three folders',
        titleHi: 'Toota: ek type-based structure ek feature ki files ko teen folders mein bikher deta hai',
        code: `src/components/SearchBar.tsx
src/hooks/useSearchFilters.ts
src/services/searchApi.ts
// three unrelated top-level folders, no single place groups these`,
        codeJs: `// src/components/SearchBar.jsx
export function SearchBar() { /* ... */ }

// src/hooks/useSearchFilters.js
export function useSearchFilters() { /* ... */ }

// src/services/searchApi.js
export async function fetchSearchResults(query) { /* ... */ }
// deleting "search" means finding and removing all three of these,
// each sitting among many unrelated files in its own folder`,
        codeTs: `// src/components/SearchBar.tsx
export function SearchBar(): JSX.Element { /* ... */ }

// src/hooks/useSearchFilters.ts
export function useSearchFilters(): { query: string } { /* ... */ }

// src/services/searchApi.ts
export async function fetchSearchResults(query: string): Promise<unknown[]> { /* ... */ }
// fully valid TypeScript — the fragmentation is architectural, not a type error`,
        output: `Removing the search feature means opening components/, hooks/, and
services/ separately, manually identifying which files belong to
search among everything else in each folder.`,
        explain: 'Nothing in the folder structure itself groups a feature\'s own files together — only a developer\'s memory or a naming convention does, and neither is enforced.',
        explainHi: 'Folder structure mein khud kuch bhi ek feature ki apni files ko saath group nahi karta — sirf ek developer ki yaadaasht ya ek naming convention karti hai, aur dono mein se koi bhi lagu nahi kiya jaata.',
      },
      {
        title: 'Fixed: everything search owns lives inside features/search/',
        titleHi: 'Theek: search jo bhi rakhta hai wo sab \`features/search/\` ke andar rehta hai',
        code: `src/features/search/components/SearchBar.tsx
src/features/search/hooks/useSearchFilters.ts
src/features/search/api/searchApi.ts
src/features/search/index.ts
// one folder, deleting it removes the entire feature`,
        codeJs: `// src/features/search/components/SearchBar.jsx
export function SearchBar() { /* ... */ }

// src/features/search/hooks/useSearchFilters.js
export function useSearchFilters() { /* ... */ }

// src/features/search/api/searchApi.js
export async function fetchSearchResults(query) { /* ... */ }

// src/features/search/index.js
export { SearchBar } from './components/SearchBar';
export { useSearchFilters } from './hooks/useSearchFilters';`,
        codeTs: `// src/features/search/components/SearchBar.tsx
export function SearchBar(): JSX.Element { /* ... */ }

// src/features/search/hooks/useSearchFilters.ts
export function useSearchFilters(): { query: string } { /* ... */ }

// src/features/search/api/searchApi.ts
export async function fetchSearchResults(query: string): Promise<unknown[]> { /* ... */ }

// src/features/search/index.ts
export { SearchBar } from './components/SearchBar';
export { useSearchFilters } from './hooks/useSearchFilters';`,
        outputJs: `Removing the search feature is now a single action: delete
features/search/. By construction, nothing belonging to another
feature was ever inside that folder.`,
        outputTs: `// Identical behaviour. The index.ts barrel additionally gives
// TypeScript's own module resolution a single, well-defined entry
// point for anything importing from this feature.`,
        explain: 'Every file the feature owns, regardless of whether it is a component, hook, or API call, lives under one folder, and index.ts defines exactly what is meant to be used from outside it.',
        explainHi: 'Har file jo feature ki apni hai, chahe ye ek component ho, hook ho, ya API call ho, ek folder ke andar rehti hai, aur \`index.ts\` bilkul tay karta hai ki bahar se kya istemal hone ke liye hai.',
      },
      {
        title: 'A cross-feature import bypassing the index.ts boundary',
        titleHi: 'Ek cross-feature import jo \`index.ts\` boundary ko bypass karta hai',
        code: `// inside features/checkout/, reaching directly into search's internals
import { useSearchFilters } from '../search/hooks/useSearchFilters';
// still compiles and runs, but silently bypasses the feature's own boundary`,
        codeJs: `// features/checkout/components/CheckoutForm.jsx
import { useSearchFilters } from '../search/hooks/useSearchFilters';
// nothing about the folder structure itself prevented this deep import`,
        codeTs: `// features/checkout/components/CheckoutForm.tsx
import { useSearchFilters } from '../search/hooks/useSearchFilters';
// TypeScript happily resolves this path — it has no concept of a
// feature's "intended" public surface unless a lint rule enforces one`,
        outputJs: `Compiles and runs without any error or warning. checkout is now
silently coupled to search's internal file layout, which search's
own team may reorganize at any time without realizing checkout
depends on it.`,
        outputTs: `// Same outcome — TypeScript's type checker has no awareness of
// which imports were "supposed" to go through index.ts and which
// were not; that boundary must be enforced separately, e.g. by a
// lint rule restricting cross-feature import paths.`,
        explain: 'A folder convention alone does not stop a deep import — only an explicitly enforced rule (such as an ESLint path restriction) turns the intended boundary into one that is actually checked.',
        explainHi: 'Akela ek folder convention ek deep import ko nahi rokta — sirf ek explicitly lagu kiya gaya rule (jaisa ek ESLint path restriction) intended boundary ko aisi cheez mein badalta hai jo asal mein check ki jaati hai.',
      },
    ],

    mistakes: [
      {
        wrong: `src/
  components/  (every feature's components mixed together)
  hooks/       (every feature's hooks mixed together)
  services/    (every feature's API calls mixed together)`,
        right: `src/
  features/
    search/     (search's own components, hooks, and API calls together)
    checkout/   (checkout's own components, hooks, and API calls together)`,
        why: 'Organizing top-level folders by technical type scatters one feature\'s files across many unrelated folders, making it impossible to confidently find or remove everything a feature owns.',
        whyHi: 'Top-level folders ko technical type se organize karna ek feature ki files ko kayi na-judi folders mein bikherta hai, jo bharosemand tarike se ek feature ki har cheez dhoondhna ya hataana namumkin banaata hai.',
      },
      {
        wrong: `// shared/components/CheckoutSummary.tsx
// moved here purely because a second feature briefly reused it`,
        right: `// features/checkout/components/CheckoutSummary.tsx
// stays in checkout; the second feature imports it via checkout's own index.ts`,
        why: 'Relocating genuinely feature-specific code into "shared" purely because more than one place currently uses it recreates the same all-features-tangled-together problem under a different folder name.',
        whyHi: 'Sach mein feature-khaas code ko "shared" mein relocate karna sirf isliye kyunki abhi ek se zyaada jagah use istemal karti hai wahi sab-features-uljhi-hui-saath samasya ek alag folder naam ke neeche dobara banaata hai.',
      },
      {
        wrong: `// features/checkout/components/CheckoutForm.tsx
import { useSearchFilters } from '../search/hooks/useSearchFilters';
// reaching directly into another feature's internals`,
        right: `// features/checkout/components/CheckoutForm.tsx
import { useSearchFilters } from '../search'; // via search's own index.ts`,
        why: 'Importing directly from another feature\'s internal file, instead of through its index.ts, silently couples two features to implementation details that were never meant to be a stable, public surface.',
        whyHi: 'Ek doosre feature ki internal file se seedhe import karna, uske \`index.ts\` ke zariye nahi, chupchaap do features ko un implementation details se jodta hai jo kabhi ek sthir, public surface hone ke liye nahi thi.',
      },
    ],

    realWorld: [
      {
        en: '**Feature-based structure (also called "vertical slice" or "colocation" architecture) is the explicitly recommended large-scale organizational pattern in several widely used community style guides for large React and Next.js codebases**, precisely because a type-based structure scales poorly past a handful of features.',
        hi: '**Feature-based structure (jise "vertical slice" ya "colocation" architecture bhi kaha jaata hai) kayi widely used community style guides mein badi React aur Next.js codebases ke liye explicitly recommend kiya gaya large-scale organizational pattern hai**, bilkul isliye kyunki ek type-based structure mutthi-bhar features ke aage kharaab taur par scale karta hai.',
      },
      {
        en: '**ESLint plugins such as eslint-plugin-boundaries and eslint-plugin-import\'s no-restricted-paths rule are real, widely adopted tools specifically built to enforce feature-folder boundaries automatically**, rather than this course inventing a hypothetical enforcement mechanism.',
        hi: '**\`eslint-plugin-boundaries\` jaise ESLint plugins aur \`eslint-plugin-import\` ka \`no-restricted-paths\` rule asli, widely adopted tools hain khaas taur par feature-folder boundaries ko automatically lagu karne ke liye banaaye gaye**, is course dwara ek kalpanik enforcement mechanism banaane ke bajaye.',
      },
      {
        en: '**Large engineering organizations frequently cite feature-based folder structure as what allows independent sub-teams to each own a distinct part of one shared codebase** without constantly stepping on each other\'s files.',
        hi: '**Badi engineering organizations aksar feature-based folder structure ko us cheez ki tarah cite karti hain jo alag-alag sub-teams ko ek shared codebase ke ek alag hisse ka apna-apna malik banne deti hai** ek doosre ki files par lagaataar kadam rakhe bina.',
      },
    ],

    interviewQA: [
      {
        q: 'What specifically goes wrong with a type-based folder structure (components/, hooks/, services/) as an app grows to have many features, and why does feature-based structure avoid that problem?',
        qHi: 'Ek type-based folder structure (\`components/\`, \`hooks/\`, \`services/\`) mein khaas taur par kya galat hota hai jab ek app kayi features ke saath badhti hai, aur feature-based structure us samasya ko kyun avoid karti hai?',
        a: 'A type-based folder structure groups files according to what KIND of file they technically are — a React component, a custom hook, an API call — regardless of which specific business feature that file actually serves. Since every feature\'s components all live together inside one components/ folder, every feature\'s hooks all live together inside one hooks/ folder, and so on, a single feature\'s own complete set of files ends up scattered across as many separate top-level folders as there are technical categories of file it happens to use, with nothing in the folder structure itself indicating which files, across those separate folders, actually belong together as part of the same feature. This becomes a genuinely serious problem specifically as the number of features grows, since a components/ folder containing every feature\'s components together grows correspondingly large and undifferentiated, and finding, safely modifying, or completely removing one specific feature\'s own footprint requires manually identifying its files from among an ever-larger pile of unrelated ones in every technical-category folder, a task that becomes slower and more error-prone precisely as the codebase, and therefore the value of getting it right, grows. Feature-based structure avoids this by organizing folders according to what a file is FOR rather than what kind of file it technically is: every file that belongs to the search feature, whether it happens to be a component, a hook, or an API call, lives together inside one shared features/search/ folder, specifically because they all serve the same feature, not because they happen to share a technical category. This means a single feature\'s complete footprint is always confined to one folder regardless of how many different kinds of file it contains, and locating, modifying, or removing that feature entirely is a matter of working within that one folder rather than searching across several unrelated ones.',
        aHi: 'Ek type-based folder structure files ko is aadhaar par group karta hai ki wo technically KIS TARAH ki file hain — ek React component, ek custom hook, ek API call — chahe wo file asal mein kis khaas business feature ki seva karti ho. Kyunki har feature ke components sab ek \`components/\` folder ke andar saath rehte hain, har feature ke hooks sab ek \`hooks/\` folder ke andar saath rehte hain, waghaira, ek akele feature ka apna poora files ka set utne hi alag top-level folders mein bikhar jaata hai jitni technical categories ki files ye samyog se istemal karta hai, folder structure mein khud kuch bhi ye na darsaate hue ki un alag folders ke aar-paar kaunsi files asal mein usi feature ke hisse ke roop mein saath belong karti hain. Ye sach mein ek gambhir samasya banta hai khaas taur par jab features ki tadaad badhti hai, kyunki ek \`components/\` folder jismein har feature ke components saath hain us anusaar badha aur bina-farak-kiya hua hota hai, aur ek khaas feature ke apne footprint ko dhoondhna, surakshit roop se badalna, ya poori tarah hataana har technical-category folder mein hamesha-badte hue na-jude dher mein se uski files haath se pehchaanna maangta hai, ek kaam jo dheema aur zyaada galti-prone hota jaata hai bilkul jaise codebase, aur isliye ise sahi karne ki keemat, badhti hai. Feature-based structure ise avoid karta hai folders ko is aadhaar par organize karke ki ek file KIS LIYE hai na ki ye technically kis tarah ki file hai: har file jo search feature se belong karti hai, chahe ye samyog se ek component ho, ek hook ho, ya ek API call ho, ek shared \`features/search/\` folder ke andar saath rehti hai, khaas taur par kyunki wo sab usi feature ki seva karti hain, is wajah se nahi ki wo samyog se ek technical category share karti hain. Iska matlab hai ek akele feature ka poora footprint hamesha ek folder tak seemit hota hai chahe ismein kitni bhi alag tarah ki files ho, aur us feature ko dhoondhna, badalna, ya poori tarah hataana us ek folder ke andar kaam karne ki baat hai kayi na-judi folders ke aar-paar khoj karne ke bajaye.',
      },
      {
        q: 'Why isn\'t simply grouping a feature\'s files into one folder enough on its own, and what problem does adding an index.ts barrel file solve on top of that?',
        qHi: 'Sirf ek feature ki files ko ek folder mein group karna khud kyun kaafi nahi hai, aur ek \`index.ts\` barrel file jodna uske oopar kaunsi samasya sulajhaata hai?',
        a: 'Grouping every file a feature owns into one shared folder solves the specific problem of discoverability and confident removal — everything belonging to a feature is now findable in one place, and deleting the feature is a matter of deleting that one folder. This grouping, however, does nothing on its own to control HOW other features are permitted to interact with that folder\'s contents. Since every file inside features/search/ is still an individually importable module, nothing about placing files inside a shared folder prevents a completely different feature, such as checkout, from importing directly from a deeply nested path like features/search/hooks/useSearchFilters, reaching straight past the folder\'s outer boundary into what should arguably be considered its private internals. This matters because it means the folder boundary, on its own, only helps a developer who is trying to find or remove a feature\'s files; it does nothing to stop a developer working on an unrelated feature from casually depending on some other feature\'s internal implementation detail, creating a hidden coupling between the two features that is not visible anywhere in the project\'s overall structure, and that will silently break the moment the search feature\'s own team decides to reorganize its internal file layout, unaware that checkout was depending on the old path. Adding a single index.ts file at each feature\'s root, which deliberately re-exports only the specific pieces meant to be consumed elsewhere, addresses this by giving each feature folder something closer to a genuine module boundary with an explicit public API: other features are expected to import from the feature\'s own index.ts (or equivalently, from the folder itself, which resolves to it) rather than reaching past it into any more deeply nested file, meaning that anything not deliberately re-exported from that index.ts remains genuinely free to be renamed, restructured, or removed without any risk of silently breaking a different feature that was never supposed to have been depending on it in the first place.',
        aHi: 'Ek feature ki har file ko ek shared folder mein group karna discoverability aur bharosemand hataane ki khaas samasya sulajhaata hai — ek feature se belong karti har cheez ab ek jagah dhoondhne-yogya hai, aur feature hataana us ek folder ko hataane ki baat hai. Ye grouping, halaanki, khud is baat ko niyantrit karne mein kuch nahi karta ki doosre features us folder ki cheezon ke saath KAISE interact karne ki anumati rakhte hain. Kyunki \`features/search/\` ke andar har file abhi bhi ek alag-alag import-yogya module hai, files ko ek shared folder ke andar rakhna kuch bhi ek bilkul alag feature, jaisa checkout, ko \`features/search/hooks/useSearchFilters\` jaise ek gehre nested path se seedhe import karne se nahi rokta, folder ki bahri boundary ko seedhe past karke us mein pahunchte hue jise vivaadit roop se iski private internals maana jaana chahiye. Ye maayne rakhta hai kyunki iska matlab hai folder boundary, akela, sirf us developer ki madad karta hai jo ek feature ki files dhoondhne ya hataane ki koshish kar raha hai; ye ek na-judi feature par kaam kar rahe developer ko kisi doosre feature ke internal implementation detail par aaraam se nirbhar hone se rokne mein kuch nahi karta, do features ke beech ek chhupi hui coupling banaate hue jo project ke overall structure mein kahin bhi dikhaayi nahi deti, aur jo chupchaap tootegi jis pal search feature ki apni team apne internal file layout ko reorganize karne ka faisla karti hai, ye jaane bina ki checkout purane path par nirbhar tha. Har feature ke root par ek akela \`index.ts\` file jodna, jo jaan-boojhkar sirf un khaas hisso ko re-export karta hai jo kahin aur consume hone ke liye hain, ise sambodhit karta hai har feature folder ko ek asli module boundary ke zyaada kareeb kuch dekar ek explicit public API ke saath: doosre features feature ke apne \`index.ts\` se import karne ki ummeed rakhi jaati hai (ya samaan roop se, folder se khud, jo isi par resolve hota hai) ise past karke kisi bhi zyaada gehri nested file mein pahunchne ke bajaye, matlab kuch bhi jo jaan-boojhkar us \`index.ts\` se re-export nahi hua sach mein azaad rehta hai rename, restructure, ya remove hone ke liye bina kisi khatre ke ki chupchaap ek alag feature ko toda jaaye jo kabhi bhi ispar nirbhar hone wala nahi tha.',
      },
    ],

    exercises: [
      {
        task: 'Take a small app with a components/, hooks/, and services/ folder structure containing files from two different features. Reorganize it into features/<name>/ folders, moving each file to sit alongside the others its own feature owns.',
        taskHi: 'Ek chhoti app lo jismein ek \`components/\`, \`hooks/\`, aur \`services/\` folder structure hai do alag features ki files ke saath. Ise \`features/<name>/\` folders mein reorganize karo, har file ko uski apni feature ki doosri files ke saath baithne ke liye le jaate hue.',
        hint: 'Start by listing every file that genuinely belongs to just one of the two features before moving anything, so the reorganization plan is complete before any file is actually moved.',
        hintHi: 'Kuch bhi move karne se pehle har file ki list banaake shuru karo jo sach mein do features mein se sirf ek se belong karti hai, taaki reorganization plan poora ho kisi file ko asal mein move karne se pehle.',
      },
      {
        task: 'Add an index.ts barrel file to each feature folder from the previous exercise, re-exporting only what genuinely needs to be used from outside that feature. Then update any cross-feature imports to go through the barrel instead of a deep path.',
        taskHi: 'Pichle exercise ke har feature folder mein ek \`index.ts\` barrel file jodo, sirf wahi re-export karte hue jo sach mein us feature ke bahar se istemal hone ki zaroorat hai. Phir kisi bhi cross-feature imports ko update karo ek gehre path ke bajaye barrel se jaane ke liye.',
        hint: 'If a cross-feature import needs something the barrel does not currently re-export, that is a genuine design decision — either the barrel is missing something it should expose, or the importing feature should not be depending on that internal in the first place.',
        hintHi: 'Agar ek cross-feature import ko kuch chahiye jo barrel abhi re-export nahi karta, ye ek asli design faisla hai — ya toh barrel mein kuch chhoot raha hai jo ise expose karna chahiye, ya import karne wale feature ko us internal par nirbhar hona hi nahi chahiye tha.',
      },
      {
        task: 'Identify one piece of code in your reorganized app that is genuinely used by more than one feature and has no feature-specific business logic in it. Move only that piece into a shared/ folder, and explain in a sentence why the rest of each feature\'s code should NOT also move there.',
        taskHi: 'Apni reorganized app mein ek code ka hissa pehchaano jo sach mein ek se zyaada feature dwara istemal hota hai aur jismein koi feature-khaas business logic bilkul nahi hai. Sirf us hisse ko ek \`shared/\` folder mein le jaao, aur ek vaakya mein samjhaao ki har feature ke baaki code ko wahaan kyun NAHI jaana chahiye.',
        hint: 'A good test: could this piece of code be explained, understood, and correctly used by someone who has never looked at either feature\'s own business logic? If not, it likely is not genuinely shared.',
        hintHi: 'Ek achha test: kya is code ke hisse ko samjhaaya, samjha, aur sahi tarike se istemal kiya jaa sakta hai kisi aise vyakti dwara jisne kabhi kisi bhi feature ki apni business logic nahi dekhi? Agar nahi, ye shaayad sach mein shared nahi hai.',
      },
    ],

    keyTakeaways: [
      'A type-based structure (components/, hooks/, services/) scatters one feature\'s own files across several unrelated top-level folders, with nothing in the structure itself grouping them together.',
      'A feature-based structure groups every file a feature owns under one folder, organized around what the code is FOR rather than what technical category it falls into.',
      'Removing a feature entirely becomes a single, confident action — deleting its one folder — rather than hunting across several unrelated folders for every file that might belong to it.',
      'A single index.ts barrel file per feature, re-exporting only what is meant to be used elsewhere, turns the folder into a genuine module boundary rather than just a grouping convention.',
      'A top-level shared/ folder should stay deliberately small, reserved strictly for code with no feature-specific business logic — not a dumping ground for anything two features happen to both use.',
      'Folder conventions alone rely on every contributor remembering to respect them; lint rules restricting cross-feature imports enforce the boundary automatically, the same way a type checker enforces a type mismatch.',
    ],
    keyTakeawaysHi: [
      'Ek type-based structure (\`components/\`, \`hooks/\`, \`services/\`) ek feature ki apni files ko kayi na-judi top-level folders mein bikher deta hai, structure mein khud kuch bhi unhe saath group na karte hue.',
      'Ek feature-based structure ek feature ki har file ko ek folder ke neeche group karta hai, us cheez ke aas-paas organize hote hue jiske liye code HAI na ki ye kis technical category mein aata hai.',
      'Ek feature ko poori tarah hataana ek akela, bharosemand kadam ban jaata hai — uska ek folder hataana — kayi na-judi folders ke aar-paar har file ke liye khoj karne ke bajaye jo isse belong kar sakti hai.',
      'Har feature ke liye ek akela \`index.ts\` barrel file, sirf wahi re-export karte hue jo kahin aur istemal hone ke liye hai, folder ko ek asli module boundary mein badalta hai sirf ek grouping convention ke bajaye.',
      'Ek top-level \`shared/\` folder ko jaan-boojhkar chhota rehna chahiye, khaas taur par us code ke liye jismein koi feature-khaas business logic nahi hai — kisi bhi cheez ke liye dumping ground nahi jo do features samyog se dono istemal karte hain.',
      'Akele folder conventions har contributor ke unhe yaad rakhne aur maanne par nirbhar karte hain; cross-feature imports ko seemit karne wale lint rules boundary ko automatically lagu karte hain, usi tarah jaise ek type checker ek type mismatch lagu karta hai.',
    ],
  },
];
