/**
 * React Complete Course — Module 6: Pro, lesson 5.
 *
 * Redux Toolkit: scaling shared state beyond what Context comfortably
 * handles. The broken example is "classic" hand-written Redux — action type
 * strings, verbose action creators, a switch-based reducer — containing a
 * real, easy-to-make mutation bug (forgetting to spread the rest of the
 * state when updating one field, silently losing other cart data). Fixed
 * with Redux Toolkit's createSlice, whose Immer-powered "mutating" syntax is
 * actually safe. Also covers connecting to React (Provider/useSelector/
 * useDispatch) and createAsyncThunk, tying directly into Module 3's
 * loading/error/data pattern and Module 5's Context lesson.
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

export const REACT_MODULE_6_PART5: CourseLesson[] = [
  {
    slug: 'redux-toolkit-scaling-shared-state',
    title: 'Redux Toolkit: Scaling Shared State Beyond Context',
    titleHi: 'Redux Toolkit: Context Se Aage Shared State Ko Scale Karna',
    description: 'A "remove from cart" button that, because someone forgot one spread operator, quietly wipes out the user\'s shipping address too.',
    descriptionHi: '"Remove from cart" button jo, kyunki koi ek spread operator bhool gaya, chupchap user ka shipping address bhi mita deta hai.',
    difficulty: 'HARD',
    duration: 27,
    order: 5,

    analogy: {
      en: '**Filing every company-wide policy change through a mountain of triplicate paperwork versus updating one shared document everyone already trusts.** Hand-written, "classic" Redux — typing out action type strings by hand, writing a separate action-creator function for every single change, and manually spreading every untouched field in a switch-based reducer — is like a company that requires a five-page triplicate form, filled out perfectly with zero typos, for every single policy update, no matter how small; miss one checkbox (forget one `...state` spread) and the whole updated policy document silently loses a section nobody meant to touch. Redux Toolkit is the same company switching to one shared, live document with sensible built-in safeguards — updating "vacation days" no longer requires re-transcribing every other unrelated policy by hand, and the tool itself quietly prevents you from accidentally deleting sections you never intended to touch, letting you write updates that read like plain, direct edits ("just change this one field") while it safely handles the "make sure nothing else changed" bookkeeping in the background.',
      hi: '**Har company-wide policy change ko triplicate paperwork ke pahaad se file karna versus ek shared document update karna jispar sab pehle se bharosa karte hain.** Haath se likhi, "classic" Redux — action type strings ko haath se type karna, har akele badlaav ke liye ek alag action-creator function likhna, aur switch-based reducer mein har na-chhui field ko haath se spread karna — aisi hai jaise ek company jise har akeli policy update ke liye paanch-panne ka triplicate form chahiye, bilkul zero typos ke saath bhara hua, chahe wo kitna bhi chhota ho; ek checkbox chhoot jaaye (ek \`...state\` spread bhool jao) aur poora updated policy document chupchap ek aisa section kho deta hai jise kisi ne chhuna hi nahi chaha tha. Redux Toolkit wahi company hai jo ek shared, live document mein switch kar leti hai samajhdaari wale built-in safeguards ke saath — "vacation days" update karna ab har doosri na-judi policy ko haath se dobara likhna nahi maangta, aur tool khud chupchap aapko galti se aise sections mitaane se rokta hai jinhe aap chhuna hi nahi chahte the, aapko aise updates likhne dete hue jo saadhe, seedhe edits jaise padhte hain ("bas ye ek field badal do") jabki peeche wo surakshit tarike se "confirm karo aur kuch na badle" wali bookkeeping sambhaalta hai.',
    },

    simple: `**Start broken.** A shopping cart\'s state, managed with hand-written, "classic" Redux:

\`\`\`jsx
// Action types — plain strings, easy to typo, no autocomplete
const REMOVE_ITEM = "cart/REMOVE_ITEM";
const SET_SHIPPING_ADDRESS = "cart/SET_SHIPPING_ADDRESS";

// Action creators — one hand-written function per action
function removeItem(itemId) {
  return { type: REMOVE_ITEM, payload: itemId };
}

// The reducer
function cartReducer(state = { items: [], shippingAddress: null }, action) {
  switch (action.type) {
    case REMOVE_ITEM:
      return {
        items: state.items.filter((item) => item.id !== action.payload),
        // BUG: forgot "...state" — shippingAddress silently resets to undefined
      };
    case SET_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    default:
      return state;
  }
}
\`\`\`

A user sets their shipping address, adds three items to the cart, then removes one item. The remove button works — the item genuinely disappears from the cart — but the shipping address they just entered vanishes too, silently, with no error anywhere. The \`REMOVE_ITEM\` case returns a brand-new object containing only \`items\`, completely omitting \`shippingAddress\` — this is the exact same "forgot to spread the rest of the object" mistake from Module 2\'s immutable-update lesson, just now inside a Redux reducer instead of a \`useState\` setter, and just as easy to miss in a large \`switch\` statement with many cases, each one needing to remember to preserve every field it does not explicitly change.

**The fix: Redux Toolkit\'s \`createSlice\`, where "mutating" code is actually safe**

\`\`\`jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], shippingAddress: null },
  reducers: {
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // shippingAddress is simply never touched — nothing to forget to spread
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;   // action creators, auto-generated
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
\`\`\`

\`\`\`tsx
import { createSlice, configureStore, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
}
interface CartState {
  items: CartItem[];
  shippingAddress: string | null;
}

const initialState: CartState = { items: [], shippingAddress: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setShippingAddress(state, action: PayloadAction<string>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
\`\`\`

Inside a \`createSlice\` reducer function, writing \`state.items = ...\` LOOKS like direct mutation — the exact thing Module 2\'s lesson warned against for \`useState\` — but it is not actually unsafe here: Redux Toolkit wraps every slice reducer with a library called Immer, which lets you write code that reads like ordinary mutation while Immer, behind the scenes, tracks every change and produces a correctly new, immutable state object automatically. Because \`removeItem\` never mentions \`shippingAddress\` at all, Immer leaves it completely untouched in the new state — there is no \`...state\` to forget, because there is no manual spreading happening in the first place; the entire class of bug from the broken version is structurally prevented, not just avoided by being more careful. \`createSlice\` also auto-generates the action creators (\`removeItem\`, \`setShippingAddress\`) and their type strings from the \`reducers\` object\'s keys, eliminating the separate, error-prone action-type-string and action-creator boilerplate entirely.`,

    simpleHi: `**Toote hue se shuru.** Ek shopping cart ki state, haath se likhi, "classic" Redux se manage hoti:

\`\`\`jsx
// Action types — saadhi strings, typo karna aasan, koi autocomplete nahi
const REMOVE_ITEM = "cart/REMOVE_ITEM";
const SET_SHIPPING_ADDRESS = "cart/SET_SHIPPING_ADDRESS";

// Action creators — har action ke liye ek haath se likha function
function removeItem(itemId) {
  return { type: REMOVE_ITEM, payload: itemId };
}

// Reducer
function cartReducer(state = { items: [], shippingAddress: null }, action) {
  switch (action.type) {
    case REMOVE_ITEM:
      return {
        items: state.items.filter((item) => item.id !== action.payload),
        // BUG: "...state" bhool gaye — shippingAddress chupchap undefined mein reset ho jaata hai
      };
    case SET_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    default:
      return state;
  }
}
\`\`\`

Ek user apna shipping address set karta hai, cart mein teen items jodta hai, phir ek item hataata hai. Remove button kaam karta hai — item sach mein cart se gayab ho jaata hai — par abhi diya shipping address bhi chala jaata hai, chupchap, kahin bhi koi error diye bina. \`REMOVE_ITEM\` case ek bilkul naya object lautaata hai jisme sirf \`items\` hai, \`shippingAddress\` ko poori tarah chhodte hue — ye bilkul wahi "object ka baaki hissa spread karna bhoolna" wali galti hai jo Module 2 ke immutable-update lesson se hai, bas ab \`useState\` setter ke bajaye Redux reducer ke andar, aur utni hi aasaani se chhoot jaane wali ek badi \`switch\` statement mein jisme kai cases hon, har ek ko wo har field bachaana yaad rakhna chahiye jise wo explicitly nahi badalta.

**Fix: Redux Toolkit ka \`createSlice\`, jahan "mutating" code asal mein surakshit hai**

\`\`\`jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], shippingAddress: null },
  reducers: {
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // shippingAddress ko bilkul chhua hi nahi jaata — spread karna bhoolne ko kuch nahi
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;   // action creators, apne aap banti hain
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
\`\`\`

\`\`\`tsx
import { createSlice, configureStore, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
}
interface CartState {
  items: CartItem[];
  shippingAddress: string | null;
}

const initialState: CartState = { items: [], shippingAddress: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setShippingAddress(state, action: PayloadAction<string>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
\`\`\`

\`createSlice\` reducer function ke andar, \`state.items = ...\` likhna seedhe mutation jaisa LAGTA hai — bilkul wahi cheez jiske khilaaf Module 2 ke lesson ne \`useState\` ke liye aagaah kiya — par ye yahan asal mein asurakshit nahi hai: Redux Toolkit har slice reducer ko Immer naam ki library se lapetta hai, jo aapko aisa code likhne deti hai jo aam mutation jaisa padhta hai jabki Immer, peeche, har badlaav track karta hai aur apne aap ek sahi naya, immutable state object banaata hai. Chunki \`removeItem\` \`shippingAddress\` ka bilkul zikr hi nahi karta, Immer use naye state mein poori tarah bina chhue chhod deta hai — koi \`...state\` bhoolne ko hai hi nahi, kyunki shuru mein koi manual spreading ho hi nahi rahi; toote version wali poori bug ki kism structurally rokdi jaati hai, sirf zyada saavdhaan rehkar bachi nahi jaati. \`createSlice\` action creators (\`removeItem\`, \`setShippingAddress\`) aur unke type strings ko \`reducers\` object ki keys se apne aap bhi banaata hai, alag, galti-prone action-type-string aur action-creator boilerplate ko poori tarah hataate hue.`,

    content: `## When Redux is worth it over Context, and over local state

\`\`\`jsx
// Local useState/useReducer: state used by one component and its direct children
// Context (Module 5): a rarely-changing value read by many, scattered components
// Redux Toolkit: state read AND written by many components across the whole app,
// often changing frequently, needing centralized, traceable, testable update logic
\`\`\`

Module 5\'s Context lesson covered Context\'s real limitation: every consumer of a Context re-renders whenever its value changes, with no built-in way to subscribe to only part of it — fine for a rarely-changing value like a theme, poorly suited to state that changes often and is both read AND written from many different, unrelated parts of a large application (a shopping cart touched by a product page, a cart icon, a checkout flow, and a saved-for-later list, all needing to both display and modify it). Redux Toolkit is built specifically for that larger-scale case: a single, centralized store, update logic consolidated into slices (the same "centralize related state transitions" reasoning Module 4\'s \`useReducer\` lesson introduced, now applied at application scale rather than component scale), and — critically — Redux DevTools, a browser extension letting a developer inspect every single state change an app has ever made, in order, and even step backward through them, a debugging capability neither plain \`useState\` nor Context provides.

## Connecting Redux to React: \`Provider\`, \`useSelector\`, \`useDispatch\`

\`\`\`jsx
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, removeItem } from "./cartSlice";

function App() {
  return (
    <Provider store={store}>
      <CartPage />
    </Provider>
  );
}

function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`<Provider store={store}>\`, wrapping the app (structurally the same pattern as Module 5\'s Context \`Provider\`, since \`react-redux\` is itself built on Context internally), makes the Redux store available to every component nested inside it. \`useSelector(selectorFn)\` reads a specific piece of state from the store — here, \`state.cart.items\` — and, importantly, only causes THIS component to re-render when the specific piece of state that selector returns actually changes, not on every unrelated store update, which is a more fine-grained subscription than raw Context provides by default. \`useDispatch()\` returns the store\'s \`dispatch\` function; calling \`dispatch(removeItem(item.id))\` sends the auto-generated \`removeItem\` action (from the \`createSlice\` example above) to the store, which runs it through the \`cartSlice\` reducer and updates state exactly the same way \`dispatch\` did for the plain \`useReducer\` lesson in Module 4 — this is not a coincidence; Redux\'s \`dispatch\`/reducer/action pattern is the same shape \`useReducer\` uses, just scaled to an entire application instead of one component.

## Async logic with \`createAsyncThunk\`, tying into Module 3\'s data-fetching pattern

\`\`\`jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await fetch(\`/api/cart/\${userId}\`);
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], isLoading: false, error: null },
  reducers: { /* ...removeItem, etc... */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// In a component:
const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchCart(userId));
}, [userId, dispatch]);
\`\`\`

\`createAsyncThunk\` generates three action types automatically from one async function — \`pending\`, \`fulfilled\`, and \`rejected\` — corresponding exactly to the \`isLoading\`/\`data\`/\`error\` three-state pattern Module 3\'s data-fetching lesson built by hand with \`useState\`. \`extraReducers\` handles those three generated actions the same way \`reducers\` handles ordinary ones: \`pending\` sets \`isLoading\` true and clears any previous error (the same reset-at-the-start principle from Module 3), \`fulfilled\` stores the resolved data, and \`rejected\` stores the error message — the exact same shape of logic, just living in the Redux store instead of local component state, useful specifically when multiple, unrelated components across the app all need access to the same fetched data rather than each needing its own local copy.

## TypeScript: typed \`useSelector\`/\`useDispatch\` hooks

\`\`\`tsx
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage — fully typed, no manual annotation needed at each call site:
function CartPage() {
  const items = useAppSelector((state) => state.cart.items);   // "items" correctly typed as CartItem[]
  const dispatch = useAppDispatch();
  // ...
}
\`\`\`

Plain \`useSelector\`/\`useDispatch\` from \`react-redux\` are generic but untyped-by-default in a way that requires re-specifying \`RootState\` at every single call site — the standard, universally-recommended pattern is defining \`useAppSelector\`/\`useAppDispatch\` ONCE, pre-bound to the app\'s actual \`RootState\`/\`AppDispatch\` types, and using those pre-typed versions everywhere else in the app instead of the raw hooks. This mirrors the custom-hook-as-a-typed-wrapper pattern from Module 4 and the \`useTheme\`/\`useTabsContext\` pattern from Module 5 — a small wrapper written once, giving every consumer full type safety without repeating the same type annotation at every usage.`,

    contentHi: `## Redux kab Context se, aur local state se, zyada kaam ka hai

\`\`\`jsx
// Local useState/useReducer: state jo ek component aur uske seedhe children use karte hain
// Context (Module 5): kam badalti value jise kai, bikhre components padhte hain
// Redux Toolkit: state jise poore app mein kai components PADHTE AUR LIKHTE dono hain,
// aksar baar-baar badalti, jise centralized, traceable, testable update logic chahiye
\`\`\`

Module 5 ke Context lesson ne Context ki asli seema cover ki: kisi Context ka har consumer dobara render hota hai jab bhi uski value badalti hai, uske sirf ek hisse ko subscribe karne ka koi built-in tarika bina — theme jaisi kam-badalti value ke liye theek, aisi state ke liye kharaab fit jo aksar badalti hai aur ek badi application ke kai alag, na-jude hisson se PADHI AUR LIKHI dono jaati hai (ek shopping cart jise product page, cart icon, checkout flow, aur saved-for-later list chhoote hain, sabko use dikhaana aur badalna dono chahiye). Redux Toolkit khaas taur par us badi-scale case ke liye bana hai: ek akela, centralized store, update logic slices mein ekjut (wahi "jude state transitions ko ekjut karo" soch jo Module 4 ka \`useReducer\` lesson introduce karta hai, ab component scale ke bajaye application scale par lagu), aur — sabse zaruri — Redux DevTools, ek browser extension jo developer ko app ne kabhi jo bhi state change ki hai wo sab, kram mein, inspect karne deta hai aur unse peeche bhi step kar sakta hai, ek debugging capability jo na saadha \`useState\` deta hai na Context.

## Redux ko React se jodna: \`Provider\`, \`useSelector\`, \`useDispatch\`

\`\`\`jsx
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, removeItem } from "./cartSlice";

function App() {
  return (
    <Provider store={store}>
      <CartPage />
    </Provider>
  );
}

function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`<Provider store={store}>\`, app ko lapette hue (structurally Module 5 ke Context \`Provider\` jaisa hi pattern, kyunki \`react-redux\` khud internally Context par bana hai), Redux store ko uske andar nested har component ke liye maujood karaata hai. \`useSelector(selectorFn)\` store se ek khaas tukda padhta hai — yahan, \`state.cart.items\` — aur, zaruri baat, sirf tab is component ko dobara render karaata hai jab wo khaas tukda jo selector lautaata hai asal mein badle, har na-judi store update par nahi, jo default roop se raw Context se zyada baarik-daana subscription hai. \`useDispatch()\` store ka \`dispatch\` function lautaata hai; \`dispatch(removeItem(item.id))\` bulaana upar wale \`createSlice\` example se auto-generated \`removeItem\` action store ko bhejta hai, jise store \`cartSlice\` reducer se chalaata hai aur state ko bilkul waise hi update karta hai jaise \`dispatch\` ne Module 4 ke saadhe \`useReducer\` lesson mein kiya tha — ye samyog nahi hai; Redux ka \`dispatch\`/reducer/action pattern wahi shape hai jo \`useReducer\` use karta hai, bas poori application tak scale kiya gaya, ek component ke bajaye.

## \`createAsyncThunk\` se async logic, Module 3 ke data-fetching pattern se jodte hue

\`\`\`jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await fetch(\`/api/cart/\${userId}\`);
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], isLoading: false, error: null },
  reducers: { /* ...removeItem, wagairah... */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// Component ke andar:
const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchCart(userId));
}, [userId, dispatch]);
\`\`\`

\`createAsyncThunk\` ek async function se apne aap teen action types banaata hai — \`pending\`, \`fulfilled\`, aur \`rejected\` — bilkul us \`isLoading\`/\`data\`/\`error\` teen-state pattern se milte hue jo Module 3 ke data-fetching lesson ne \`useState\` se haath se banaya tha. \`extraReducers\` un teen banaaye gaye actions ko wahi tarike se sambhaalta hai jaise \`reducers\` aam actions ko sambhaalta hai: \`pending\` \`isLoading\` ko \`true\` set karta hai aur koi purana error saaf karta hai (Module 3 ka wahi shuru-mein-reset karo principle), \`fulfilled\` resolve hui data store karta hai, aur \`rejected\` error message store karta hai — bilkul wahi logic ki shape, bas local component state ke bajaye Redux store mein rehti hui, khaas taur par tab kaam ki jab app ke kai, na-jude components ko sab ko wahi fetch hui data chahiye, har ek ko apni alag local copy ki zarurat ke bajaye.

## TypeScript: typed \`useSelector\`/\`useDispatch\` hooks

\`\`\`tsx
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Istemal — poori tarah typed, har call site par manual annotation ki zarurat nahi:
function CartPage() {
  const items = useAppSelector((state) => state.cart.items);   // "items" sahi tarike se CartItem[] typed hai
  const dispatch = useAppDispatch();
  // ...
}
\`\`\`

\`react-redux\` ke saadhe \`useSelector\`/\`useDispatch\` generic hain par default roop se aise untyped hain ki har akele call site par \`RootState\` dobara batana padta hai — standard, sarvbhaumik-sujhaayi hui pattern \`useAppSelector\`/\`useAppDispatch\` ko EK BAAR define karna hai, app ke asli \`RootState\`/\`AppDispatch\` types se pehle se bound, aur un pehle-se-typed versions ko app mein har jagah aur use karna hai, raw hooks ke bajaye. Ye Module 4 ke custom-hook-as-a-typed-wrapper pattern aur Module 5 ke \`useTheme\`/\`useTabsContext\` pattern ko wahi darzha karta hai — ek chhota wrapper ek baar likha gaya, har consumer ko poori type safety deta hai bina har istemal par wahi type annotation dohraaye.`,

    examples: [
      {
        title: 'Broken: a missing spread silently wipes unrelated state',
        titleHi: 'Toota: ek missing spread chupchap na-judi state mita deta hai',
        code: `case REMOVE_ITEM:
  return {
    items: state.items.filter((item) => item.id !== action.payload),
    // shippingAddress silently gone — "...state" was never spread
  };`,
        codeJs: `const REMOVE_ITEM = "cart/REMOVE_ITEM";

function removeItem(itemId) {
  return { type: REMOVE_ITEM, payload: itemId };
}

function cartReducer(state = { items: [], shippingAddress: null }, action) {
  switch (action.type) {
    case REMOVE_ITEM:
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}
// dispatch(removeItem("item-2")) after shippingAddress was already set:
// shippingAddress silently becomes undefined in the new state.`,
        codeTs: `interface CartItem {
  id: string;
  name: string;
}
interface CartState {
  items: CartItem[];
  shippingAddress: string | null;
}
interface RemoveItemAction {
  type: "cart/REMOVE_ITEM";
  payload: string;
}

function cartReducer(
  state: CartState = { items: [], shippingAddress: null },
  action: RemoveItemAction
): CartState {
  switch (action.type) {
    case "cart/REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      } as CartState;
    default:
      return state;
  }
}
// TypeScript SHOULD catch this — the returned object is missing
// "shippingAddress" and does not satisfy CartState — but the "as
// CartState" assertion (a common shortcut under deadline pressure)
// silences that exact error, letting the bug through anyway.`,
        output: `dispatch(setShippingAddress("221B Baker Street")) followed by
dispatch(removeItem("item-2")): the item correctly disappears from the
cart, but state.shippingAddress is now undefined — the address the
user just entered is gone, with no error anywhere.`,
        explain: 'This is the identical "forgot to spread the rest of the object" bug from Module 2\'s immutable-update lesson — Redux reducers must follow the exact same immutability rule as useState setters, and a large switch statement with many cases makes it easy to forget in just one of them.',
        explainHi: 'Ye Module 2 ke immutable-update lesson wali bilkul wahi "object ka baaki hissa spread karna bhoolna" bug hai — Redux reducers ko wahi immutability niyam follow karna chahiye jo \`useState\` setters karte hain, aur kai cases wali ek badi switch statement mein sirf ek mein ise bhoolna aasan hai.',
      },
      {
        title: 'Fixed: createSlice\'s Immer-powered "mutation" is structurally safe',
        titleHi: 'Theek: createSlice ka Immer-powered "mutation" structurally surakshit hai',
        code: `const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], shippingAddress: null },
  reducers: {
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});`,
        codeJs: `import { createSlice, configureStore } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], shippingAddress: null },
  reducers: {
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });`,
        codeTs: `import { createSlice, configureStore, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
}
interface CartState {
  items: CartItem[];
  shippingAddress: string | null;
}

const initialState: CartState = { items: [], shippingAddress: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setShippingAddress(state, action: PayloadAction<string>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { removeItem, setShippingAddress } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;`,
        outputJs: `dispatch(setShippingAddress("221B Baker Street")) followed by
dispatch(removeItem("item-2")): the item disappears AND
shippingAddress correctly remains "221B Baker Street" — removeItem
never mentions shippingAddress, so Immer leaves it untouched.`,
        outputTs: `// "PayloadAction<string>" types action.payload as exactly "string" for
// each reducer — dispatch(removeItem(42)) (a number instead of a
// string id) would be a compile-time TypeScript error.`,
        explain: 'The entire class of "forgot to preserve an untouched field" bug is structurally impossible here, not just less likely — there is no manual spreading happening for Immer to get wrong, since each reducer only ever mentions the fields it actually changes.',
        explainHi: '"na-chhui field bachaana bhool gaye" wali poori bug kism yahan structurally namumkin hai, sirf kam sambhaavit nahi — koi manual spreading ho hi nahi rahi jo Immer se galat ho jaaye, kyunki har reducer sirf un fields ka zikr karta hai jo wo asal mein badalta hai.',
      },
      {
        title: 'Connecting to React with useSelector and useDispatch',
        titleHi: 'useSelector aur useDispatch se React se jodna',
        code: `const items = useSelector((state) => state.cart.items);
const dispatch = useDispatch();
<button onClick={() => dispatch(removeItem(item.id))}>Remove</button>`,
        codeJs: `import { Provider, useSelector, useDispatch } from "react-redux";
import { store, removeItem } from "./cartSlice";

function App() {
  return (
    <Provider store={store}>
      <CartPage />
    </Provider>
  );
}

function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}`,
        codeTs: `import { Provider, useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { store, removeItem, type RootState, type AppDispatch } from "./cartSlice";

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {
  return (
    <Provider store={store}>
      <CartPage />
    </Provider>
  );
}

function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}`,
        outputJs: `Clicking "Remove" dispatches the removeItem action to the store,
running it through cartSlice's reducer — the list re-renders showing
the item gone, and any OTHER component elsewhere in the app also
reading state.cart.items (a cart icon in the header, for instance)
updates automatically too, with no props passed between them.`,
        outputTs: `// "useAppSelector" and "useAppDispatch" give "items" and "dispatch"
// full type safety (items: CartItem[], dispatch correctly typed to
// only accept real actions) without re-specifying RootState at this
// or any other call site in the app.`,
        explain: 'Any other component anywhere in the app reading state.cart.items via useSelector updates automatically too — this is the actual payoff over Context/prop-drilling: truly global, centrally-updated state with no manual wiring between unrelated components.',
        explainHi: 'App mein kahin bhi koi doosra component jo \`useSelector\` se \`state.cart.items\` padhta hai wo bhi apne aap update hota hai — ye Context/prop-drilling par asli faayda hai: sach mein global, markazi-roop se update hoti state, na-jude components ke beech kisi manual wiring ke bina.',
      },
    ],

    mistakes: [
      {
        wrong: `case REMOVE_ITEM:
  return {
    items: state.items.filter((item) => item.id !== action.payload),
  };
// missing "...state" — every other field silently resets`,
        right: `case REMOVE_ITEM:
  return {
    ...state,
    items: state.items.filter((item) => item.id !== action.payload),
  };
// or, with createSlice: state.items = state.items.filter(...) — nothing else to forget`,
        why: 'A hand-written reducer case that returns a new object without spreading the rest of the previous state silently discards every field it does not explicitly mention, exactly like the identical mistake covered for useState in Module 2.',
        whyHi: 'Ek haath se likha reducer case jo pichli state ka baaki hissa spread kiye bina naya object lautaata hai chupchap har wo field chhod deta hai jiska wo explicitly zikr nahi karta, bilkul Module 2 mein \`useState\` ke liye cover hui wahi galti jaisa.',
      },
      {
        wrong: `const cart = useSelector((state) => state);   // selecting the ENTIRE store
// component re-renders on ANY state change anywhere in the app`,
        right: `const items = useSelector((state) => state.cart.items);   // selecting only what's needed
// component re-renders only when state.cart.items specifically changes`,
        why: 'useSelector re-renders a component only when the specific value its selector function returns actually changes — selecting the entire state object defeats this fine-grained subscription, causing re-renders on every unrelated state change anywhere in the store.',
        whyHi: '\`useSelector\` ek component ko sirf tab dobara render karaata hai jab uske selector function ka lautaaya khaas value asal mein badle — poori state object select karna is baarik-daane wale subscription ko haraata hai, store mein kahin bhi har na-judi state change par re-renders karaate hue.',
      },
      {
        wrong: `const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action) {
      state = action.payload;   // reassigning the "state" parameter itself does nothing
    },
  },
});`,
        right: `reducers: {
  setItems(state, action) {
    state.items = action.payload;   // mutate a FIELD of state, not the parameter itself
  },
}`,
        why: 'Immer tracks changes made TO the state object\'s fields, not reassignment of the state parameter itself — replacing "state" with a new value (rather than mutating a field on it) breaks Immer\'s ability to detect the change, silently producing no update.',
        whyHi: 'Immer state object ki fields mein hue badlaav track karta hai, state parameter khud ko dobara assign karna nahi — \`state\` ko ek nayi value se badalna (uski kisi field ko mutate karne ke bajaye) Immer ki badlaav pakadne ki kaabiliyat todta hai, chupchap koi update na paida karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**Redux Toolkit is the officially recommended way to write Redux**, explicitly created by the Redux maintainers specifically to eliminate the hand-written action-type-string and boilerplate-reducer pain this lesson\'s broken example demonstrated — "classic" hand-written Redux, while still found in older codebases, is no longer how new Redux code is written in production.',
        hi: '**Redux Toolkit Redux likhne ka officially sujhaaya tarika hai**, Redux maintainers ne khaas taur par banaya hai un haath-se-likhe action-type-string aur boilerplate-reducer dard ko hataane ke liye jo is lesson ke toote example ne dikhaaya — "classic" haath se likhi Redux, purane codebases mein abhi bhi milte hue, ab production mein naya Redux code likhne ka tarika nahi rahi.',
      },
      {
        en: '**Redux DevTools\' time-travel debugging — stepping backward through every state change an app has ever made — is a genuinely unique capability among React state solutions**, widely cited as a major reason large teams choose Redux specifically for complex, hard-to-reproduce state bugs, over Context or purely local state.',
        hi: '**Redux DevTools ka time-travel debugging — app ne ab tak jo bhi state change ki hai unme peeche step karna — React state solutions mein ek sach mein anokhi kaabiliyat hai**, badi taur par cite hoti hai ki badi teams khaas taur par complex, mushkil-se-dobara-paida-hone-wale state bugs ke liye Redux kyun chunti hain, Context ya sirf local state ke bajaye.',
      },
      {
        en: '**Not every application needs Redux — the React ecosystem broadly agrees that local state and Context should be tried first, reaching for a dedicated library like Redux Toolkit only once an application\'s shared-state needs genuinely outgrow them**, exactly the decision framework this lesson\'s content section laid out.',
        hi: '**Har application ko Redux ki zarurat nahi — React ecosystem broadly is baat par sehmat hai ki pehle local state aur Context try karne chahiye, ek khaas library jaise Redux Toolkit sirf tab uthaani chahiye jab application ki shared-state zarurtein unse sach mein aage nikal jaayein**, bilkul wahi decision framework jo is lesson ke content section ne bataya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does writing `state.items = ...` inside a Redux Toolkit `createSlice` reducer not violate the immutability rule covered for `useState` in Module 2, even though it looks like direct mutation?',
        qHi: 'Redux Toolkit ke \`createSlice\` reducer ke andar \`state.items = ...\` likhna Module 2 mein \`useState\` ke liye cover hua immutability niyam kyun nahi todta, chahe ye seedhe mutation jaisa dikhta ho?',
        a: 'Redux Toolkit wraps every reducer function passed to `createSlice` with Immer, a library that intercepts what looks like direct mutation of the `state` parameter and, behind the scenes, records each change and uses it to construct a genuinely new, immutable state object automatically — the underlying store never actually receives a mutated version of the old state object; it receives a correctly-constructed new one, satisfying the exact same reference-equality-based change detection Redux (and React\'s useState) relies on. This means code inside a `createSlice` reducer can read like ordinary, direct property assignment (`state.items = ...`) while Immer guarantees the actual result handed to the store is immutable, which is precisely why this pattern is safe here specifically, and would NOT be safe if the same syntax were written directly inside a `useState` setter or a hand-written Redux reducer without Immer\'s involvement.',
        aHi: 'Redux Toolkit \`createSlice\` ko pass hue har reducer function ko Immer se lapetta hai, ek library jo \`state\` parameter ke seedhe mutation jaise dikhte cheez ko rok leti hai aur, peeche, har badlaav record karti hai aur use apne aap ek sach mein naya, immutable state object banaane ke liye use karti hai — underlying store ko kabhi asal mein purane state object ka mutate hua version nahi milta; use ek sahi-tarike se banaya naya milta hai, bilkul wahi reference-equality-based change detection sant hushta hai jispar Redux (aur React ka useState) bharosa karta hai. Iska matlab \`createSlice\` reducer ke andar ka code aam, seedhe property assignment (\`state.items = ...\`) jaisa padh sakta hai jabki Immer guarantee karta hai store ko diya asli nateeja immutable hai, aur bilkul isi wajah se ye pattern yahan khaas taur par surakshit hai, aur SURAKSHIT NAHI hota agar wahi syntax seedha \`useState\` setter ya Immer ke shaamil hue bina ek haath se likhe Redux reducer ke andar likha jaata.',
      },
      {
        q: 'What real, structural advantage does Redux Toolkit\'s Immer-powered "mutation" have over a hand-written reducer that correctly remembers to spread state, beyond just being less to type?',
        qHi: 'Redux Toolkit ke Immer-powered "mutation" ka ek haath se likhe reducer par jo state spread karna sahi tarike se yaad rakhta hai kya asli, structural faayda hai, sirf kam likhna padne ke alawa?',
        a: 'A hand-written reducer that correctly spreads state is not incorrect, but its correctness depends entirely on the developer remembering to do so on every single case, in every single reducer, for the lifetime of the codebase — a large switch statement with many cases makes forgetting in just one of them easy, and that one omission produces exactly the silent, hard-to-notice bug this lesson\'s broken example demonstrated. Because a createSlice reducer never manually spreads anything at all — it only ever mentions the specific fields it changes, with Immer handling the rest automatically — there is no spreading step to forget in the first place; the entire class of bug is structurally prevented rather than merely made less likely by careful, correct code, which is a meaningfully stronger guarantee than "the developer got every case right this time."',
        aHi: 'Ek haath se likha reducer jo state ko sahi tarike se spread karta hai galat nahi hai, par uski sahi hona poori tarah is baat par nirbhar hai ki developer har akele case mein, har akele reducer mein, codebase ki poori zindagi ke liye aisa karna yaad rakhe — kai cases wali ek badi switch statement inme se sirf ek mein bhoolna aasan banaati hai, aur wo ek chhoot is lesson ke toote example wali bilkul chupchap, dhyaan-mein-na-aane-wali bug paida karti hai. Chunki \`createSlice\` reducer kabhi bhi manually kuch spread nahi karta — ye sirf un khaas fields ka zikr karta hai jo wo badalta hai, Immer baaki apne aap sambhaalta hai — shuru mein spread karne ka koi step hai hi nahi jise bhoola jaaye; poori bug ki kism structurally rokdi jaati hai, sirf saavdhaan, sahi code se kam sambhaavit banaayi jaane ke bajaye, jo "developer ne is baar har case sahi kiya" se ek matlabi taur par mazboot guarantee hai.',
      },
      {
        q: 'Why does `useSelector((state) => state.cart.items)` cause fewer re-renders than `useSelector((state) => state)`, and why does that difference matter in a large application?',
        qHi: '\`useSelector((state) => state.cart.items)\` \`useSelector((state) => state)\` se kam re-renders kyun cause karta hai, aur ek badi application mein ye fark kyun matter karta hai?',
        a: '`useSelector` re-renders the calling component specifically when the value its selector function returns changes, comparing that specific returned value across renders — it does not re-render the component on every possible change to the entire store, only on changes to the specific slice of state the selector actually extracts. A selector that returns `state.cart.items` only causes a re-render when `items` specifically changes; a selector that returns the entire `state` object returns a "different" value (in the sense that matters for this comparison) on literally every single dispatched action anywhere in the store, since the top-level state object reference changes on every update, defeating the fine-grained subscription useSelector is designed to provide. In a large application with many unrelated pieces of state in one store, selecting broadly like this means a component re-renders far more often than its actual data dependencies require, which is exactly the kind of unnecessary re-rendering Module 6\'s React.memo lesson covered avoiding, just caused here by an overly broad selector instead of a missing memoization wrapper.',
        aHi: '\`useSelector\` bulaane wale component ko khaas taur par tab dobara render karaata hai jab uske selector function ka lautaaya value badalta hai, us khaas lautaaye value ko renders ke aar-paar compare karte hue — ye component ko poore store mein har mumkin badlaav par dobara render nahi karaata, sirf state ke us khaas hisse mein badlaav par jise selector asal mein nikaalta hai. \`state.cart.items\` lautaata selector sirf tab re-render karaata hai jab \`items\` khaas taur par badle; poori \`state\` object lautaata selector store mein kahin bhi literally har akele dispatch hue action par ek "alag" value lautaata hai (is comparison ke liye matlabi mane mein), kyunki top-level state object reference har update par badalta hai, useSelector ke diye jaane wale baarik-daane wale subscription ko haraate hue. Ek badi application mein jisme ek store mein kai na-jude state ke tukde hon, aise chaudhe roop se select karna matlab component apne asli data dependencies se kaafi zyada baar dobara render hota hai, jo bilkul wahi bekaar re-rendering hai jo Module 6 ke React.memo lesson ne bachne ke liye cover kiya, bas yahan ek chhoote memoization wrapper ke bajaye ek zyada chaudhe selector se hui.',
      },
      {
        q: 'How does `createAsyncThunk` map onto the same loading/error/data state pattern Module 3\'s data-fetching lesson built by hand?',
        qHi: '\`createAsyncThunk\` Module 3 ke data-fetching lesson wale wahi loading/error/data state pattern par kaise map hota hai jo haath se banaaya gaya tha?',
        a: 'An async operation genuinely has exactly three moments worth representing as state, regardless of how it is implemented: while it is in progress, after it succeeds with a result, and after it fails with an error — this is precisely the `isLoading`/`data`/`error` pattern Module 3 built manually with three separate `useState` calls and an `if (!res.ok) throw` inside a `useEffect`. `createAsyncThunk` automates the exact same three-state shape at the Redux level: given one async function, it automatically generates three action types — `pending` (dispatched immediately when the thunk starts, corresponding to setting `isLoading` true), `fulfilled` (dispatched with the resolved value when the async function succeeds, corresponding to storing `data` and clearing `isLoading`), and `rejected` (dispatched with the error when the async function throws, corresponding to storing `error` and clearing `isLoading`) — with `extraReducers` handling each of those three generated actions the same way ordinary `reducers` handle synchronous ones, producing the identical three-state logic Module 3 covered, just centralized in the Redux store rather than local component state.',
        aHi: 'Ek async operation ke paas sach mein bilkul teen pal hain jo state ki tarah darzha karne laayak hain, chahe use kaise bhi lagu kiya jaaye: jab tak wo chal raha hai, jab wo ek nateeje ke saath safal hota hai, aur jab wo ek error ke saath fail hota hai — ye bilkul wahi \`isLoading\`/\`data\`/\`error\` pattern hai jo Module 3 ne teen alag \`useState\` calls aur ek \`useEffect\` ke andar \`if (!res.ok) throw\` se haath se banaaya. \`createAsyncThunk\` Redux level par bilkul wahi teen-state shape ko automate karta hai: ek async function dekar, ye apne aap teen action types banaata hai — \`pending\` (turant dispatch hota hai jab thunk shuru hota hai, \`isLoading\` \`true\` set karne se milta hua), \`fulfilled\` (resolve hui value ke saath dispatch hota hai jab async function safal hota hai, \`data\` store karne aur \`isLoading\` saaf karne se milta hua), aur \`rejected\` (error ke saath dispatch hota hai jab async function throw karta hai, \`error\` store karne aur \`isLoading\` saaf karne se milta hua) — \`extraReducers\` un teen banaaye gaye actions ko wahi tarike se sambhaalta hai jaise aam \`reducers\` synchronous wale sambhaalte hain, wahi teen-state logic banaate hue jo Module 3 ne cover kiya, bas local component state ke bajaye Redux store mein ekjut.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken hand-written cartReducer with the missing spread in the REMOVE_ITEM case. Dispatch setShippingAddress, then removeItem, and confirm the address is silently lost, inspecting state with a console.log after each dispatch.',
        taskHi: 'REMOVE_ITEM case mein missing spread wala toota haath se likha cartReducer banao. setShippingAddress dispatch karo, phir removeItem, aur confirm karo address chupchap kho jaata hai, har dispatch ke baad ek console.log se state inspect karte hue.',
        hint: 'Log the full state object before and after the removeItem dispatch, side by side, to see exactly which field disappeared.',
        hintHi: 'removeItem dispatch se pehle aur baad poora state object saath-saath log karo, bilkul dekhne ke liye kaunsi field gayab hui.',
      },
      {
        task: 'Rebuild it as a createSlice with removeItem and setShippingAddress reducers. Repeat the same dispatch sequence and confirm shippingAddress now correctly survives.',
        taskHi: 'removeItem aur setShippingAddress reducers wale createSlice ki tarah use dobara banao. Wahi dispatch sequence dohraao aur confirm karo shippingAddress ab sahi tarike se bacha rehta hai.',
        hint: 'Open Redux DevTools (if installed) and step through the dispatched actions one at a time, comparing the state snapshot before and after each one.',
        hintHi: 'Redux DevTools kholo (agar installed hai) aur dispatch hue actions mein ek-ek karke step karo, har ek se pehle aur baad ka state snapshot compare karte hue.',
      },
      {
        task: 'Build the fetchCart createAsyncThunk with extraReducers handling pending/fulfilled/rejected. Mock a failing fetch and confirm the error state populates correctly, then a succeeding one and confirm items populate.',
        taskHi: 'pending/fulfilled/rejected sambhaalta extraReducers wala fetchCart createAsyncThunk banao. Ek fail hoti fetch mock karo aur confirm karo error state sahi tarike se bharti hai, phir ek safal wali aur confirm karo items bharte hain.',
        hint: 'Compare this thunk\'s three generated action types directly against Module 3\'s hand-written isLoading/error/data useState calls to see the one-to-one correspondence.',
        hintHi: 'Is thunk ke teen banaaye action types ko seedha Module 3 ke haath se likhe isLoading/error/data useState calls se compare karo ek-ek se milta rishta dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'Redux is worth reaching for over Context specifically when shared state is both read AND written by many unrelated components across a large application, changes frequently, and benefits from centralized, traceable update logic and DevTools time-travel debugging.',
      'Redux Toolkit\'s createSlice wraps every reducer with Immer, letting code that looks like direct mutation (`state.items = ...`) safely produce a correct, immutable new state object — the same "forgot to spread the rest of the object" bug from Module 2 is structurally prevented, not just avoided.',
      '`createSlice` auto-generates action creators and action-type strings from the reducers object\'s keys, eliminating the separate, error-prone action-type-constant and hand-written-action-creator boilerplate "classic" Redux required.',
      '`useSelector` re-renders a component only when the specific value its selector function returns actually changes, not on every unrelated store update — selecting broadly (the entire state object) defeats this fine-grained subscription.',
      '`createAsyncThunk` automatically generates pending/fulfilled/rejected actions from one async function, mapping directly onto the isLoading/data/error three-state pattern Module 3\'s data-fetching lesson built by hand with useState.',
      'Typed `useAppSelector`/`useAppDispatch` hooks, pre-bound once to the app\'s RootState/AppDispatch, are the standard TypeScript pattern — avoiding re-specifying RootState at every individual call site throughout the app.',
    ],
    keyTakeawaysHi: [
      'Redux ko Context par uthaana khaas taur par tab kaam ka hai jab shared state ko ek badi application ke kai na-jude components PADHTE AUR LIKHTE dono hon, wo aksar badalti ho, aur use centralized, traceable update logic aur DevTools time-travel debugging se faayda ho.',
      'Redux Toolkit ka \`createSlice\` har reducer ko Immer se lapetta hai, aise code ko jo seedhe mutation jaisa dikhta hai (\`state.items = ...\`) surakshit tarike se ek sahi, immutable naya state object banaane deta hai — Module 2 wali wahi "object ka baaki hissa spread karna bhoolna" bug structurally rokdi jaati hai, sirf bachi nahi jaati.',
      '\`createSlice\` reducers object ki keys se action creators aur action-type strings apne aap banaata hai, alag, galti-prone action-type-constant aur haath-se-likhe-action-creator boilerplate ko hataate hue jo "classic" Redux maangta tha.',
      '\`useSelector\` ek component ko sirf tab dobara render karaata hai jab uske selector function ka lautaaya khaas value asal mein badle, har na-judi store update par nahi — chaudhe roop se select karna (poori state object) is baarik-daane wale subscription ko haraata hai.',
      '\`createAsyncThunk\` ek async function se pending/fulfilled/rejected actions apne aap banaata hai, bilkul us isLoading/data/error teen-state pattern par map hote hue jo Module 3 ke data-fetching lesson ne useState se haath se banaaya.',
      'Typed \`useAppSelector\`/\`useAppDispatch\` hooks, ek baar app ke RootState/AppDispatch se pehle-se-bound, standard TypeScript pattern hain — poore app mein har akele call site par RootState dobara batane se bachte hue.',
    ],
  },
];
