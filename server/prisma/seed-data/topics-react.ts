import type { SeedCategory } from './topics-shared';

export const reactCategory: SeedCategory = {
  slug: 'react',
  name: 'React',
  description: 'Hooks, rendering, reconciliation and performance — what React interviews actually probe.',
  icon: 'react',
  group: 'core',
  topics: [
    {
      slug: 'react-components-and-jsx',
      title: 'Components & JSX',
      difficulty: 'EASY',
      summary: 'JSX compiles to function calls that return element descriptions — React renders those, not DOM nodes.',
      summaryHi: 'JSX function calls mein compile hota hai jo element ka description return karte hain — React unhe render karta hai, DOM nodes ko nahi.',
      content: `JSX is not HTML. \`<Button primary />\` compiles to \`jsx(Button, { primary: true })\`, which returns a **plain object** describing what should appear. React diffs those objects and updates the real DOM itself.

Consequences worth knowing:
- A component must return a **single root** (or a \`<>fragment</>\`).
- Attributes use JS names: \`className\`, \`htmlFor\`, \`onClick\`.
- Components must start with a **capital letter**, otherwise JSX treats them as DOM tags.
- Rendering must be **pure**: same props in, same output, no side effects during render.`,
      contentHi: `JSX HTML nahi hai. \`<Button primary />\` compile hokar \`jsx(Button, { primary: true })\` banta hai, jo ek **plain object** return karta hai — bas ye batata hai ki screen par kya aana chahiye. React un objects ka diff karke asli DOM khud update karta hai.

Isse kya farq padta hai:
- Component ko ek hi **root** return karna hota hai (ya \`<>fragment</>\`).
- Attributes JS naamon se aate hain: \`className\`, \`htmlFor\`, \`onClick\`.
- Components ka naam **capital letter** se shuru hona chahiye, warna JSX unhe DOM tag samajh lega.
- Render **pure** hona chahiye: same props par same output, render ke dauraan koi side effect nahi.`,
      codeExample: `function Badge({ label, tone = 'neutral' }) {
  return <span className={'badge badge-' + tone}>{label}</span>;
}
// compiles to: jsx('span', { className: ..., children: label })`,
      commonMistakes: [
        'Naming a component in lowercase — React renders it as an unknown DOM tag.',
        'Doing side effects (fetching, mutating) during render instead of in an effect.',
        'Returning multiple sibling elements without a fragment.',
      ],
      interviewQuestions: [
        'What does JSX compile to?',
        'Why must component names be capitalised?',
        'What does it mean that rendering should be pure?',
      ],
      practiceQuestions: ['Rewrite a small JSX tree as explicit createElement calls.'],
      tags: ['jsx', 'components', 'basics'],
    },

    {
      slug: 'react-props-and-state',
      title: 'Props vs State',
      difficulty: 'EASY',
      summary: 'Props come from the parent and are read-only; state is owned by the component and triggers re-renders when changed.',
      summaryHi: 'Props parent se aate hain aur read-only hote hain; state component ka apna hai aur badalne par re-render trigger karta hai.',
      content: `**Props** are inputs — read-only, owned by the parent. **State** is internal, owned by the component, and changing it schedules a re-render.

Decision rule: if a value can be computed from props or other state, it should **not** be state. Duplicated state is the number one source of "my UI is out of sync" bugs.

When two siblings need the same value, **lift the state up** to their closest common parent and pass it down.`,
      contentHi: `**Props** inputs hain — read-only, parent ke owned. **State** andar ka hai, component ka apna, aur badalne par re-render schedule hota hai.

Decision rule: agar koi value props ya doosri state se calculate ho sakti hai, to wo state **nahi** honi chahiye. Duplicate state hi "UI sync se bahar hai" wale bugs ki sabse badi wajah hai.

Jab do siblings ko ek hi value chahiye, to state ko unke sabse nazdeeki common parent tak **lift up** karo aur neeche pass karo.`,
      codeExample: `function Cart({ items }) {
  const [coupon, setCoupon] = useState('');
  // derived, NOT state — recomputed on every render
  const total = items.reduce((sum, i) => sum + i.price, 0);
  return <div>{total} {coupon}</div>;
}`,
      commonMistakes: [
        'Copying props into state and letting the two drift apart.',
        'Storing derived values in state instead of computing them during render.',
        'Mutating state directly (state.push(x)) instead of creating a new value.',
      ],
      interviewQuestions: [
        'Difference between props and state?',
        'When should a value be state versus derived?',
        'What does "lifting state up" mean?',
      ],
      practiceQuestions: ['Refactor a component that stores a filtered list in state to compute it during render.'],
      tags: ['props', 'state', 'basics'],
    },

    {
      slug: 'react-usestate',
      title: 'useState',
      difficulty: 'EASY',
      summary: 'State updates are asynchronous and batched. Use the functional form when the next value depends on the previous one.',
      summaryHi: 'State updates asynchronous aur batched hote hain. Agli value pichhli par depend kare to functional form use karo.',
      content: `\`setState\` does not mutate the current variable — it schedules a re-render. Within one event handler, React **batches** updates, so reading the state variable right after setting it still gives the old value.

When the next value depends on the current one, use the **functional updater**: \`setCount(c => c + 1)\`. Calling \`setCount(count + 1)\` three times in a row increments by one, not three.

For expensive initial values, pass a function: \`useState(() => expensive())\` so it runs only on the first render.`,
      contentHi: `\`setState\` current variable ko mutate nahi karta — wo ek re-render schedule karta hai. Ek hi event handler mein React updates ko **batch** karta hai, isliye set karne ke turant baad state padho to purani value hi milegi.

Jab agli value current par depend kare, to **functional updater** use karo: \`setCount(c => c + 1)\`. Lagatar teen baar \`setCount(count + 1)\` likhne par count ek hi badhega, teen nahi.

Mehenga initial value ho to function pass karo: \`useState(() => expensive())\` — tab wo sirf pehle render par chalega.`,
      codeExample: `const [count, setCount] = useState(0);

function tripleWrong() { setCount(count + 1); setCount(count + 1); setCount(count + 1); } // +1
function tripleRight() { setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1); } // +3`,
      commonMistakes: [
        'Reading state immediately after setState and expecting the new value.',
        'Using setCount(count + 1) inside loops or multiple times per handler.',
        'Calling useState(expensive()) instead of useState(() => expensive()) — the call runs every render.',
        'Mutating an object in state and setting the same reference — React sees no change.',
      ],
      interviewQuestions: [
        'Is setState synchronous?',
        'When do you need the functional updater form?',
        'What is lazy initial state?',
        'Why does React re-render when you set the same object reference?',
      ],
      practiceQuestions: ['Build a counter with +1/+3 buttons that behaves correctly under batching.'],
      tags: ['usestate', 'hooks', 'must-know'],
    },

    {
      slug: 'react-useeffect',
      title: 'useEffect',
      difficulty: 'MEDIUM',
      summary: 'Effects synchronise with external systems. The dependency array decides when they re-run, and the cleanup prevents leaks.',
      summaryHi: 'Effects external systems ke saath sync karte hain. Dependency array tay karta hai kab dobara chalein, aur cleanup leaks rokta hai.',
      content: `\`useEffect\` is for **synchronising with something outside React** — a subscription, a timer, a network request, the document title. It is *not* a lifecycle hook.

- **No dependency array** → runs after every render.
- **\`[]\`** → runs once after mount.
- **\`[a, b]\`** → runs when \`a\` or \`b\` changes (compared with \`Object.is\`).
- **Return a cleanup function** — it runs before the next effect and on unmount.

The two bugs that dominate code review: missing dependencies (stale closures reading old props) and missing cleanup (duplicate listeners, race conditions where a slow response overwrites a fast one).

If you can compute a value during render, you do **not** need an effect for it.`,
      contentHi: `\`useEffect\` **React ke bahar ki cheezon ke saath sync** karne ke liye hai — subscription, timer, network request, document title. Ye lifecycle hook *nahi* hai.

- **Dependency array nahi** → har render ke baad chalega.
- **\`[]\`** → sirf ek baar, mount ke baad.
- **\`[a, b]\`** → jab \`a\` ya \`b\` badle (\`Object.is\` se compare hota hai).
- **Cleanup function return karo** — wo agle effect se pehle aur unmount par chalta hai.

Code review mein do bugs sabse zyada dikhte hain: missing dependencies (stale closures purani props padhte hue) aur missing cleanup (duplicate listeners, aur race condition jahan slow response fast wale ko overwrite kar deta hai).

Agar koi value render ke dauraan calculate ho sakti hai, to uske liye effect ki zarurat **nahi** hai.`,
      codeExample: `useEffect(() => {
  const controller = new AbortController();
  let active = true;

  fetch('/api/user/' + id, { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => { if (active) setUser(data); });   // guards the race

  return () => { active = false; controller.abort(); }; // cleanup
}, [id]);`,
      commonMistakes: [
        'Omitting dependencies to "stop it re-running" — this creates stale closures.',
        'No cleanup on subscriptions/timers, causing leaks and duplicate handlers.',
        'Not guarding async responses, so a stale request overwrites fresh data.',
        'Using an effect to derive state that could just be computed during render.',
      ],
      interviewQuestions: [
        'What does the dependency array do?',
        'When does the cleanup function run?',
        'What is a stale closure in useEffect?',
        'How do you cancel a fetch when the component unmounts?',
        'Why does an effect run twice in React 18 StrictMode?',
      ],
      practiceQuestions: [
        'Write a useDebounce hook with correct cleanup.',
        'Fix a search component where slow responses overwrite newer ones.',
      ],
      tags: ['useeffect', 'hooks', 'must-know', 'side-effects'],
    },

    {
      slug: 'react-usememo-usecallback',
      title: 'useMemo & useCallback',
      difficulty: 'MEDIUM',
      summary: 'They cache values and function identities across renders. Useful with React.memo or expensive computation — otherwise they cost more than they save.',
      summaryHi: 'Ye values aur function identity ko renders ke beech cache karte hain. React.memo ya mehengi computation ke saath faydemand — warna fayde se zyada kharcha.',
      content: `\`useMemo(fn, deps)\` caches a **value**. \`useCallback(fn, deps)\` caches a **function reference** (it is \`useMemo(() => fn, deps)\`).

They pay off in exactly two situations:
1. The computation is genuinely expensive (sorting or filtering thousands of rows).
2. The value or function is passed to a \`React.memo\` child or used as an effect dependency, where a new reference each render would defeat the memoisation.

Everywhere else they add allocation and dependency-array maintenance for no gain. Memoising \`a + b\` is slower than recomputing it.

Both are **caches, not guarantees** — React may discard them.`,
      contentHi: `\`useMemo(fn, deps)\` ek **value** cache karta hai. \`useCallback(fn, deps)\` ek **function reference** cache karta hai (ye asal mein \`useMemo(() => fn, deps)\` hi hai).

Fayda sirf do situations mein hota hai:
1. Computation sach mein mehengi ho (hazaron rows sort ya filter karna).
2. Value ya function \`React.memo\` wale child ko jaa raha ho, ya effect dependency ho — jahan har render par nayi reference memoisation todh degi.

Baaki har jagah ye sirf allocation aur dependency-array ka jhanjhat badhate hain. \`a + b\` ko memoise karna dobara calculate karne se dheema hai.

Dono **cache hain, guarantee nahi** — React inhe hata bhi sakta hai.`,
      codeExample: `// worth it: expensive + passed to a memoised child
const sorted = useMemo(() => rows.slice().sort(byName), [rows]);
const onSelect = useCallback((id) => setSelected(id), []);
return <MemoTable rows={sorted} onSelect={onSelect} />;

// not worth it
const total = useMemo(() => a + b, [a, b]);`,
      commonMistakes: [
        'Wrapping everything in useMemo/useCallback as a reflex.',
        'Using useCallback but passing the child a fresh object/array prop anyway, so React.memo still re-renders.',
        'Treating memo results as guaranteed and relying on referential stability for correctness.',
      ],
      interviewQuestions: [
        'Difference between useMemo and useCallback?',
        'When is memoisation actually worth it?',
        'Why might React.memo still re-render despite useCallback?',
        'Is useMemo a guarantee?',
      ],
      practiceQuestions: ['Profile a list component and show where memoisation helps and where it does not.'],
      tags: ['usememo', 'usecallback', 'performance', 'hooks'],
    },

    {
      slug: 'react-useref',
      title: 'useRef',
      difficulty: 'EASY',
      summary: 'A mutable box that survives re-renders without causing them. Used for DOM nodes and for values render does not depend on.',
      summaryHi: 'Ek mutable box jo re-render ke baad bhi bana rehta hai par khud re-render nahi karata. DOM nodes aur un values ke liye jinpar render depend nahi karta.',
      content: `\`useRef(initial)\` returns \`{ current }\` — the same object on every render. Writing to \`.current\` does **not** trigger a re-render.

Two uses:
1. **DOM access** — \`<input ref={inputRef} />\` then \`inputRef.current.focus()\`.
2. **Instance-like values** — timer ids, previous values, "has this already run" flags, the latest value of a prop for a callback.

Rule: if changing the value should update the UI, it is **state**, not a ref.`,
      contentHi: `\`useRef(initial)\` ek \`{ current }\` return karta hai — har render par wahi object. \`.current\` par likhne se re-render **nahi** hota.

Do use:
1. **DOM access** — \`<input ref={inputRef} />\` phir \`inputRef.current.focus()\`.
2. **Instance-jaisi values** — timer ids, previous value, "ye pehle chal chuka hai" flags, callback ke liye prop ki latest value.

Rule: agar value badalne par UI update hona chahiye, to wo **state** hai, ref nahi.`,
      codeExample: `const inputRef = useRef(null);
const renderCount = useRef(0);
renderCount.current += 1;              // no re-render triggered

useEffect(() => { inputRef.current?.focus(); }, []);`,
      commonMistakes: [
        'Using a ref for something the UI must reflect — the screen never updates.',
        'Reading ref.current during render and expecting consistency.',
        'Forgetting refs are null on the first render before the DOM exists.',
      ],
      interviewQuestions: [
        'Difference between useRef and useState?',
        'Why does mutating a ref not re-render?',
        'How do you access a DOM node in React?',
      ],
      practiceQuestions: ['Build a usePrevious(value) hook with useRef.'],
      tags: ['useref', 'hooks', 'dom'],
    },

    {
      slug: 'react-custom-hooks',
      title: 'Custom Hooks',
      difficulty: 'MEDIUM',
      summary: 'A function starting with "use" that calls other hooks. It shares logic, never state — each caller gets its own.',
      summaryHi: '"use" se shuru hone wala function jo doosre hooks call karta hai. Ye logic share karta hai, state nahi — har caller ko apni state milti hai.',
      content: `A custom hook is just a function whose name starts with \`use\` and which may call other hooks. It exists to extract **stateful logic** out of components.

Critically: two components calling \`useUser()\` get **completely separate state**. Hooks share behaviour, not data. For shared data you need Context, a store, or a cache like React Query.

The **rules of hooks** apply: call them at the top level only, never inside conditions or loops, and only from components or other hooks. React tracks hooks by call order, which is why the order must be stable.`,
      contentHi: `Custom hook bas ek function hai jiska naam \`use\` se shuru hota hai aur jo doosre hooks call kar sakta hai. Iska kaam hai components se **stateful logic** bahar nikalna.

Sabse important: do components agar \`useUser()\` call karein to unhe **bilkul alag state** milti hai. Hooks behaviour share karte hain, data nahi. Shared data ke liye Context, store, ya React Query jaisa cache chahiye.

**Rules of hooks** yahan bhi lagte hain: sirf top level par call karo, conditions ya loops ke andar kabhi nahi, aur sirf components ya doosre hooks se. React hooks ko call order se track karta hai, isliye order stable rehna zaroori hai.`,
      codeExample: `function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);      // cleanup on every change
  }, [value, ms]);
  return debounced;
}`,
      commonMistakes: [
        'Expecting two components using the same hook to share state.',
        'Calling hooks conditionally, which breaks the call-order assumption.',
        'Naming a hook without the "use" prefix, so lint rules stop protecting it.',
      ],
      interviewQuestions: [
        'What are the rules of hooks and why do they exist?',
        'Do two components using the same custom hook share state?',
        'How would you extract data fetching into a custom hook?',
      ],
      practiceQuestions: [
        'Write useLocalStorage(key, initial) that syncs state to localStorage.',
        'Write useFetch(url) with loading, error and abort handling.',
      ],
      tags: ['custom-hooks', 'hooks', 'patterns'],
    },

    {
      slug: 'react-keys-and-lists',
      title: 'Lists & Keys',
      difficulty: 'EASY',
      summary: 'Keys let React match elements across renders. Using the array index corrupts state when the list reorders.',
      summaryHi: 'Keys se React renders ke beech elements match karta hai. Index ko key banane par list reorder hone par state kharab ho jati hai.',
      content: `When rendering a list, React uses \`key\` to decide which element in the new tree corresponds to which in the old one.

Use a **stable, unique id from your data**. The index works only if the list is never reordered, filtered or inserted into.

With index keys, deleting the first item makes React think every item's content changed but their identity stayed — so component state (input values, focus, animation) sticks to the wrong row. This is a favourite interview question because the bug is invisible until the list mutates.`,
      contentHi: `List render karte waqt React \`key\` se decide karta hai ki naye tree ka kaunsa element purane tree ke kis element se match karta hai.

Apne data se **stable, unique id** use karo. Index tabhi chalta hai jab list kabhi reorder, filter ya insert na ho.

Index keys ke saath pehla item delete karne par React ko lagta hai ki har item ka content badla par identity wahi rahi — isliye component state (input values, focus, animation) galat row par chipak jati hai. Interview mein ye favourite sawaal hai kyunki bug tabhi dikhta hai jab list badalti hai.`,
      codeExample: `{todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)}   // correct
{todos.map((todo, i) => <TodoRow key={i} todo={todo} />)}      // breaks on reorder`,
      commonMistakes: [
        'Using the array index as a key in a list that can reorder or delete.',
        'Using Math.random() as a key — it changes every render and remounts everything.',
        'Putting the key on a child inside map instead of on the outermost mapped element.',
      ],
      interviewQuestions: [
        'Why does React need keys?',
        'What breaks when you use the index as a key?',
        'What happens if keys are not unique?',
      ],
      practiceQuestions: ['Build a reorderable list with inputs and demonstrate the index-key bug.'],
      tags: ['keys', 'lists', 'reconciliation', 'must-know'],
    },

    {
      slug: 'react-context',
      title: 'Context API',
      difficulty: 'MEDIUM',
      summary: 'Passes values down without prop drilling. Every consumer re-renders when the context value identity changes.',
      summaryHi: 'Prop drilling ke bina values neeche pass karta hai. Context value ki identity badalte hi har consumer re-render hota hai.',
      content: `Context solves **prop drilling**, not state management. \`useContext(MyContext)\` reads the nearest provider's value.

The performance trap: passing an inline object (\`value={{ user, setUser }}\`) creates a **new reference every render**, so every consumer re-renders even when nothing meaningful changed. Memoise the value, and split rarely-changing data (theme, auth) from frequently-changing data into separate contexts.

Good fits: theme, current user, locale, feature flags. Poor fit: fast-changing state shared by many components — that is what a store is for.`,
      contentHi: `Context **prop drilling** ka hal hai, state management ka nahi. \`useContext(MyContext)\` sabse nazdeeki provider ki value padhta hai.

Performance trap: inline object pass karna (\`value={{ user, setUser }}\`) har render par **nayi reference** banata hai, isliye har consumer re-render ho jata hai chahe kuch matlab ka na badla ho. Value ko memoise karo, aur kam badalne wala data (theme, auth) alag context mein aur jaldi badalne wala alag mein rakho.

Achhe use: theme, current user, locale, feature flags. Bura use: bahut jaldi badalti state jo kai components use karte hain — uske liye store hota hai.`,
      codeExample: `const value = useMemo(() => ({ user, setUser }), [user]);   // stable identity
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;`,
      commonMistakes: [
        'Passing an inline object as the context value, re-rendering every consumer.',
        'Putting all app state in one giant context.',
        'Using context where a prop would do, hiding the data flow.',
      ],
      interviewQuestions: [
        'What problem does Context solve?',
        'Why do all consumers re-render when the provider value changes?',
        'Context vs Redux — when would you pick each?',
      ],
      practiceQuestions: ['Build a ThemeContext with a toggle and verify consumers do not re-render needlessly.'],
      tags: ['context', 'state-management', 'hooks'],
    },

    {
      slug: 'react-rendering-reconciliation',
      title: 'Rendering & Reconciliation',
      difficulty: 'HARD',
      summary: 'React renders to a virtual tree, diffs it against the previous one, and commits the minimum set of DOM changes.',
      summaryHi: 'React ek virtual tree banata hai, use pichhle se compare karta hai, aur sirf zaroori DOM changes commit karta hai.',
      content: `A render pass has two phases:
1. **Render** — call components, build the new element tree. Pure and interruptible in concurrent mode.
2. **Commit** — apply the diff to the DOM, run layout effects, then passive effects.

The diffing heuristics that matter:
- **Different element type → destroy and rebuild** the whole subtree, losing its state. Conditionally rendering \`<Input />\` as \`<textarea />\` wipes what the user typed.
- **Same type → update props in place**, recurse into children.
- **Keys** identify siblings across renders.

A parent re-render re-renders children by default; \`React.memo\` opts a child out when its props are shallow-equal.`,
      contentHi: `Render pass ke do phase hote hain:
1. **Render** — components call karo, naya element tree banao. Ye pure hai aur concurrent mode mein interrupt ho sakta hai.
2. **Commit** — diff DOM par lagao, layout effects chalao, phir passive effects.

Kaam ki diffing heuristics:
- **Element type badal gaya → poora subtree destroy aur dobara banao**, uski state chali jayegi. \`<Input />\` ko conditionally \`<textarea />\` banane par user ka type kiya hua data mit jata hai.
- **Same type → props jagah par update**, phir children mein aage badho.
- **Keys** siblings ko renders ke beech pehchante hain.

Parent re-render hone par by default children bhi re-render hote hain; \`React.memo\` child ko tab bahar rakh deta hai jab uske props shallow-equal hon.`,
      codeExample: `// This remounts the input and clears its value whenever isEditing flips.
{isEditing ? <input value={v} /> : <div>{v}</div>}

// Keeping the same element type preserves state:
<input value={v} readOnly={!isEditing} />`,
      commonMistakes: [
        'Defining a component inside another component — it is a new type every render, so children remount and lose state.',
        'Assuming React.memo prevents all re-renders (new object/function props defeat it).',
        'Confusing "re-render" with "DOM update" — most renders commit nothing.',
      ],
      interviewQuestions: [
        'What is reconciliation?',
        'What happens when an element type changes between renders?',
        'Why does defining a component inside another cause remounts?',
        'Does a re-render always touch the DOM?',
      ],
      practiceQuestions: ['Use the React Profiler to find an avoidable re-render and fix it.'],
      tags: ['reconciliation', 'virtual-dom', 'performance', 'advanced'],
    },

    {
      slug: 'react-performance',
      title: 'Performance & Code Splitting',
      difficulty: 'MEDIUM',
      summary: 'Measure first. Then cut re-renders, virtualise long lists and lazy-load routes.',
      summaryHi: 'Pehle measure karo. Phir re-renders kam karo, lambi lists virtualise karo aur routes lazy-load karo.',
      content: `Order of operations, because most "optimisation" is wasted:

1. **Measure** with the React Profiler — find what actually re-renders and how long it takes.
2. **Cut wasted renders** — \`React.memo\` on expensive children, stable callbacks, split context.
3. **Virtualise** lists over a few hundred rows so only visible rows mount.
4. **Code split** by route with \`React.lazy\` + \`Suspense\` to shrink the initial bundle.
5. **Defer non-urgent work** with \`useTransition\`/\`useDeferredValue\` so typing stays responsive while a heavy list filters.`,
      contentHi: `Kaam ka order, kyunki zyadatar "optimisation" bekaar jaati hai:

1. React Profiler se **measure** karo — sach mein kya re-render ho raha hai aur kitna time le raha hai.
2. **Bekaar renders hatao** — mehenge children par \`React.memo\`, stable callbacks, context split.
3. Kuch sau rows se badi lists **virtualise** karo taaki sirf dikhne wali rows mount hon.
4. \`React.lazy\` + \`Suspense\` se route-wise **code split** karo taaki initial bundle chhota rahe.
5. \`useTransition\`/\`useDeferredValue\` se **non-urgent kaam defer** karo taaki heavy list filter hote waqt typing atke na.`,
      codeExample: `const Dashboard = React.lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Skeleton />}>
  <Dashboard />
</Suspense>`,
      commonMistakes: [
        'Optimising before profiling.',
        'Rendering 10,000 rows without virtualisation.',
        'Code splitting so aggressively that every interaction waits on a network round trip.',
      ],
      interviewQuestions: [
        'How do you find a performance problem in a React app?',
        'What is list virtualisation?',
        'How does React.lazy work with Suspense?',
        'What does useTransition do?',
      ],
      practiceQuestions: ['Lazy-load a heavy route and measure the bundle difference.'],
      tags: ['performance', 'code-splitting', 'lazy', 'advanced'],
    },

    {
      slug: 'react-error-boundaries',
      title: 'Error Boundaries',
      difficulty: 'MEDIUM',
      summary: 'Class components that catch render-phase errors in their subtree and show a fallback instead of a blank screen.',
      summaryHi: 'Class components jo apne subtree ke render-phase errors pakadte hain aur blank screen ki jagah fallback dikhate hain.',
      content: `An error boundary implements \`static getDerivedStateFromError\` and/or \`componentDidCatch\`. Without one, a thrown error during render unmounts the **entire** React tree — the user sees a white page.

They **do not** catch:
- errors in event handlers (use try/catch),
- async errors (promise rejections, setTimeout),
- errors in the boundary itself,
- server-side rendering errors.

There is still no hook equivalent; use a class boundary or a library like \`react-error-boundary\`. Place boundaries per route or per widget so one broken panel does not take down the app.`,
      contentHi: `Error boundary \`static getDerivedStateFromError\` aur/ya \`componentDidCatch\` implement karta hai. Iske bina render ke dauraan thrown error **poora** React tree unmount kar deta hai — user ko white page dikhta hai.

Ye **nahi** pakadte:
- event handlers ke errors (try/catch use karo),
- async errors (promise rejections, setTimeout),
- khud boundary ke andar ke errors,
- server-side rendering errors.

Aaj bhi iska hook version nahi hai; class boundary ya \`react-error-boundary\` jaisi library use karo. Boundaries route-wise ya widget-wise lagao taaki ek toota panel poori app na le doobe.`,
      codeExample: `class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { logToService(error, info); }
  render() { return this.state.error ? <Fallback /> : this.props.children; }
}`,
      commonMistakes: [
        'Expecting a boundary to catch errors from event handlers or async code.',
        'Wrapping the whole app in one boundary, so any error blanks everything.',
        'Rendering a fallback that itself throws.',
      ],
      interviewQuestions: [
        'What is an error boundary and what does it catch?',
        'Why can it not be written as a hook?',
        'How do you handle async errors in React?',
      ],
      practiceQuestions: ['Add per-route error boundaries with a retry button.'],
      tags: ['error-boundary', 'errors', 'resilience'],
    },
  ],
};
