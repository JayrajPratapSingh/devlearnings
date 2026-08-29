/**
 * React Complete Course — Module 2: State & Events, lesson 2.
 *
 * Event handling and controlled forms. The broken example is the single most
 * common first forms bug: giving an <input> a `value` prop without an
 * `onChange` handler, which freezes the input and produces a real, verbatim
 * React console warning — not a made-up scenario.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'event-handling-controlled-forms',
    title: 'Event Handling and Controlled Forms',
    titleHi: 'Event Handling Aur Controlled Forms',
    description: 'An input box you can see, click, and type into — where nothing you type ever appears.',
    descriptionHi: 'Ek input box jise aap dekh sakte ho, click kar sakte ho, type kar sakte ho — par jo bhi type karo wo kabhi dikhta hi nahi.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A whiteboard where only the teacher\'s marker can write.** A plain HTML `<input>` is a whiteboard anyone can write on directly — you touch it, marks appear, done. A React *controlled* input is a whiteboard rigged so that only the teacher (React state) is allowed to actually write on it: when you touch it, nothing appears by itself — a request goes to the teacher ("the student wants to write an S"), and only once the teacher decides to update the board (calls `setState`) does the S actually show up. This is why forgetting the "listener" side (`onChange`) leaves an input completely frozen: you can touch the board all you want, but if nobody is listening for your touches and telling the teacher to update it, nothing you do ever reaches the board.',
      hi: '**Ek whiteboard jahan sirf teacher ka marker likh sakta hai.** Saadha HTML \`<input>\` aisa whiteboard hai jispar koi bhi seedha likh sakta hai — chhuo, nishaan aa jaate hain, khatam. React ka *controlled* input aisa whiteboard hai jo isliye taiyar kiya gaya hai ki sirf teacher (React state) hi asal mein usmein likh sake: jab aap chhuo, apne aap kuch nahi aata — ek request teacher ko jaati hai ("student S likhna chahta hai"), aur sirf jab teacher board update karne ka faisla leta hai (\`setState\` bulata hai) tabhi S asal mein dikhta hai. Isi wajah se "listener" wala hissa (\`onChange\`) bhoolne se input poori tarah jam jaata hai: aap board ko jitna chaho chhu sakte ho, par agar koi aapke chhune ko sun hi nahi raha aur teacher ko update karne ko keh hi nahi raha, to aap jo bhi karo board tak kabhi pahunchta hi nahi.',
    },

    simple: `**Start broken.** A search box that looks completely normal:

\`\`\`jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return <input value={query} placeholder="Search..." />;
}
\`\`\`

Click into this input and type. Nothing appears — every keystroke is silently swallowed, and the browser console shows a real React warning: \`You provided a 'value' prop to a form field without an 'onChange' handler.\` Giving \`<input>\` a \`value\` prop hands React full control over what the input displays — React now shows exactly \`query\`\'s current value and nothing else, on every single render, including the render caused by you pressing a key. Since nothing ever calls \`setQuery\`, \`query\` stays \`""\` forever, so React keeps painting the input back to empty immediately after every keystroke.

**The fix: listen for the keystroke, then update state**

\`\`\`jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);   // read what the user just typed, put it in state
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
\`\`\`

\`\`\`tsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
\`\`\`

\`onChange\` fires on every keystroke (unlike plain HTML, where a bare DOM \`onchange\` only fires when the field loses focus — React\'s \`onChange\` behaves like the DOM\'s \`input\` event instead). The browser hands the handler an event object; \`event.target\` is the actual \`<input>\` DOM element, and \`.value\` is whatever it currently displays, which now includes the key you just pressed. Calling \`setQuery(event.target.value)\` puts that new text into state, which triggers a re-render, which paints the input with the new \`query\` value — the entire loop happens once per keystroke, fast enough to feel instant.

In the TypeScript version, \`event: React.ChangeEvent<HTMLInputElement>\` types the event parameter — \`React.ChangeEvent<T>\` is a generic type (TypeScript course, generics module) that describes a change event specifically from an element of type \`T\`, which is what makes \`event.target.value\` known to be a \`string\` rather than \`any\`. Typing this parameter as plain \`Event\` (the built-in DOM type) would compile, but \`event.target\` would then be typed too generically for \`.value\` to be recognized at all.

**This "controlled" pattern is not optional once you add \`value\`** — React always shows exactly what state says to show, so any input with a \`value\` prop needs an \`onChange\` to keep that state in sync with what the user actually types, or it freezes exactly like the broken example above. If you genuinely do not want to control an input\'s value through state, use \`defaultValue\` instead of \`value\` — that sets the *initial* value only, and after that the browser manages it normally, like plain HTML.

**Checkboxes use \`checked\` and \`.checked\`, not \`value\`**

\`\`\`jsx
function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleChange(event) {
    setSubscribed(event.target.checked);   // .checked, not .value — checkboxes are boolean
  }

  return <input type="checkbox" checked={subscribed} onChange={handleChange} />;
}
\`\`\`

A checkbox\'s meaningful state is on/off, not text — so the controlled prop is \`checked\` (a boolean) instead of \`value\`, and the event handler reads \`event.target.checked\` instead of \`event.target.value\`. Forgetting this and reading \`.value\` on a checkbox reads the string \`"on"\` (the checkbox\'s literal HTML attribute value, unrelated to whether it is checked), which is a genuinely common source of confusion.

**Submitting a form: \`onSubmit\` and \`preventDefault\`**

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();   // stop the browser's default full-page reload
    console.log("Submitting:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
function LoginForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log("Submitting:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

A plain HTML \`<form>\`\'s default behaviour on submit is to reload the entire page and send the form data as a browser-native request — exactly what you do NOT want in a React app, where you want to handle the submitted data with JavaScript instead. \`event.preventDefault()\`, called inside the \`onSubmit\` handler, stops that default reload, letting your own code (here, just a \`console.log\`, but in a real app usually an API call) run instead. The \`onChange\` handler is written inline here as an arrow function, \`(e) => setEmail(e.target.value)\` — completely equivalent to a separately-declared \`handleChange\` function, just shorter for a one-line update.`,

    simpleHi: `**Toote hue se shuru.** Ek search box jo bilkul normal dikhta hai:

\`\`\`jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return <input value={query} placeholder="Search..." />;
}
\`\`\`

Is input mein click karo aur type karo. Kuch nahi aata — har keystroke chupchap nigal li jaati hai, aur browser console mein ek asli React warning dikhti hai: \`You provided a 'value' prop to a form field without an 'onChange' handler.\` \`<input>\` ko \`value\` prop dena React ko poora control de deta hai ki input kya dikhaaye — React ab har render par bilkul \`query\` ki abhi ki value dikhaata hai aur kuch nahi, chahe wo render aapke key dabaane se hi kyun na hua ho. Chunki kabhi \`setQuery\` bulaya hi nahi jaata, \`query\` hamesha \`""\` rehta hai, isliye React har keystroke ke turant baad input ko wapas khaali paint kar deta hai.

**Fix: keystroke sunna, phir state update karna**

\`\`\`jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);   // user ne abhi jo type kiya wo padho, state mein daalo
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
\`\`\`

\`\`\`tsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
\`\`\`

\`onChange\` har keystroke par chalta hai (saadhe HTML se ulta, jahan seedha DOM \`onchange\` sirf field se focus hatne par chalta hai — React ka \`onChange\` DOM ke \`input\` event jaisa behave karta hai). Browser handler ko ek event object thamaata hai; \`event.target\` asli \`<input>\` DOM element hai, aur \`.value\` wo hai jo wo abhi dikha raha hai, jisme ab wo key bhi shaamil hai jo aapne abhi dabaayi. \`setQuery(event.target.value)\` bulaana wo naya text state mein daal deta hai, jo dobara render trigger karta hai, jo input ko naye \`query\` value se paint karta hai — poora loop ek keystroke mein ek baar hota hai, itni tezi se ki turant lagta hai.

TypeScript version mein, \`event: React.ChangeEvent<HTMLInputElement>\` event parameter ko type karta hai — \`React.ChangeEvent<T>\` ek generic type hai (TypeScript course, generics module) jo khaas taur par \`T\` kism ke element se hui change event batata hai, aur isi se \`event.target.value\` \`any\` ke bajaye \`string\` maana jaata hai. Is parameter ko plain \`Event\` (built-in DOM type) ki tarah type karna compile to ho jaayega, par \`event.target\` phir itna general type ka hoga ki \`.value\` bilkul pehchaana hi nahi jaayega.

**Ye "controlled" pattern optional nahi hai jaise hi aap \`value\` jodo** — React hamesha bilkul wahi dikhaata hai jo state kehti hai, isliye kisi bhi \`value\` prop wale input ko \`onChange\` chahiye us state ko sync mein rakhne ke liye jo user asal mein type kar raha hai, nahi to wo upar wale toote example ki tarah jam jaata hai. Agar aap sach mein input ki value ko state se control nahi karna chahte, \`value\` ki jagah \`defaultValue\` use karo — wo sirf *shuruaati* value set karta hai, uske baad browser use saadhe HTML jaise khud sambhaalta hai.

**Checkboxes \`checked\` aur \`.checked\` use karte hain, \`value\` nahi**

\`\`\`jsx
function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleChange(event) {
    setSubscribed(event.target.checked);   // .checked, .value nahi — checkboxes boolean hote hain
  }

  return <input type="checkbox" checked={subscribed} onChange={handleChange} />;
}
\`\`\`

Checkbox ki asli state on/off hai, text nahi — isliye controlled prop \`checked\` hai (ek boolean) \`value\` ke bajaye, aur event handler \`event.target.checked\` padhta hai \`event.target.value\` ke bajaye. Ye bhoolna aur checkbox par \`.value\` padhna string \`"on"\` deta hai (checkbox ki literal HTML attribute value, checked hai ya nahi usse bilkul alag), jo sach mein ek aam confusion ka srot hai.

**Form submit karna: \`onSubmit\` aur \`preventDefault\`**

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();   // browser ka default poora-page reload rokna
    console.log("Submitting:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
function LoginForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log("Submitting:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

Saadhe HTML \`<form>\` ka submit par default behaviour poora page reload karna aur form data ko browser-native request ki tarah bhejna hai — bilkul wo jo aap React app mein NAHI chahte, jahan aap submit hui data ko JavaScript se hi sambhaalna chahte ho. \`event.preventDefault()\`, \`onSubmit\` handler ke andar bulaya gaya, us default reload ko rokta hai, aapke apne code (yahan bas ek \`console.log\`, par asli app mein aksar ek API call) ko chalne dete hue. \`onChange\` handler yahan inline arrow function ki tarah likha gaya hai, \`(e) => setEmail(e.target.value)\` — alag se declare kiye \`handleChange\` function ke bilkul barabar, bas ek-line update ke liye chhota.`,

    content: `## The controlled-input contract, precisely

\`\`\`jsx
<input value={query} onChange={handleChange} />
\`\`\`

Once an \`<input>\` receives a \`value\` prop, React treats that input as fully controlled — on every single render, React sets the input\'s displayed text to exactly whatever \`value\` currently is, overwriting whatever the browser\'s own DOM might otherwise have shown. \`onChange\` is the other half of the contract: it is how your code finds out the user tried to change the displayed text, so state can be updated to match what they typed, which in turn triggers the next render, which paints the input with the updated value. Skip \`onChange\` and the input is technically still interactive (clickable, focusable) but visually frozen, because React repaints it back to the unchanging \`value\` after every keystroke.

## SyntheticEvent: one event system, every browser

\`\`\`jsx
function handleChange(event) {
  console.log(event.target.value);     // the DOM element that fired the event, and its value
  console.log(event.type);              // "change"
}
\`\`\`

The \`event\` object React hands your handler is a \`SyntheticEvent\` — a wrapper React builds around the browser\'s native event, normalizing behaviour so it works identically across browsers, since raw native events historically had real cross-browser inconsistencies. \`event.target\` is still the actual underlying DOM element (an \`HTMLInputElement\`, an \`HTMLButtonElement\`, whichever fired the event), so all of the ordinary DOM element properties — \`.value\`, \`.checked\`, \`.name\`, \`.id\` — are available exactly where you would expect.

## Handling different form elements

\`\`\`jsx
// Text input — value is a string, read via .value
<input value={text} onChange={(e) => setText(e.target.value)} />

// Checkbox — value is a boolean, read via .checked
<input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />

// Select — behaves like a text input, value/.value work the same way
<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="in">India</option>
  <option value="us">USA</option>
</select>

// Textarea — also behaves like a text input, DESPITE being a different HTML element
// (plain HTML puts a textarea's text between its tags; React unifies this to "value" too)
<textarea value={bio} onChange={(e) => setBio(e.target.value)} />
\`\`\`

React deliberately makes \`<select>\` and \`<textarea>\` behave like \`<input>\` for consistency, even though the underlying plain-HTML elements work quite differently — plain HTML \`<textarea>\` stores its text as element content rather than a \`value\` attribute, and plain HTML \`<select>\` marks the chosen option with a \`selected\` attribute on the \`<option>\` rather than a \`value\` on the \`<select>\` itself. React\'s controlled-component model papers over both of those differences so every form element follows the identical \`value\`/\`onChange\` pattern, with the sole exception of checkboxes and radio buttons, which use \`checked\` because their meaningful state is boolean rather than textual.

## Handling multiple fields with one handler

\`\`\`jsx
function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleChange(event) {
    const { name, value } = event.target;   // "name" here is the input's HTML "name" attribute
    setForm({ ...form, [name]: value });      // computed property name — updates just that one field
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
\`\`\`

Rather than writing a separate handler function per field, one shared handler reads the field\'s HTML \`name\` attribute off \`event.target\`, then uses it as a computed property name (\`[name]: value\`, JS course\'s objects module) to update just that field inside the state object — the same nested-spread pattern from the previous lesson applies here, since \`form\` is itself an object being immutably updated.

## Form submission: preventDefault and where validation belongs

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    // submit email to the server here
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

Client-side validation lives inside the \`onSubmit\` handler, run before whatever the actual submission logic is (an API call, typically) — checking the condition, setting an error message into state if it fails, and \`return\`ing early to skip the submission. The conditional \`{error && <p>{error}</p>}\` is the JSX conditional-rendering pattern from Module 1: nothing renders while \`error\` is the falsy empty string, and the message appears the instant \`setError\` gives it real text.

## TypeScript: typing event handlers

\`\`\`tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setQuery(event.target.value);      // .value is known to be string
}

function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setSubscribed(event.target.checked);   // .checked is known to be boolean — same event type, different element behaviour
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}
\`\`\`

\`React.ChangeEvent<T>\` and \`React.FormEvent<T>\` are generic types the \`@types/react\` package ships (TypeScript course\'s generics module) — the type parameter \`T\` fixes which specific DOM element type \`event.target\` resolves to, which is what lets TypeScript know \`.value\` and \`.checked\` exist and what type they are, and would flag a typo like \`event.target.valeu\` at compile time rather than leaving it to fail silently at runtime. A checkbox and a text input use the identical \`React.ChangeEvent<HTMLInputElement>\` type for their handler\'s event parameter — the element type is the same \`<input>\` either way, so TypeScript itself does not distinguish between them here; it is a plain runtime convention (checkboxes read \`.checked\`, everything else reads \`.value\`) rather than something the type system separately enforces.`,

    contentHi: `## Controlled-input ka contract, poori tarah se

\`\`\`jsx
<input value={query} onChange={handleChange} />
\`\`\`

Jaise hi \`<input>\` ko \`value\` prop milta hai, React us input ko poori tarah controlled maanta hai — har akele render par, React input ki dikhti hui text ko bilkul \`value\` ki abhi ki value set karta hai, jo bhi browser ka apna DOM warna dikhaata us par likhte hue. \`onChange\` contract ka doosra aadha hissa hai: isi se aapke code ko pata chalta hai ki user ne dikhti hui text badalne ki koshish ki, taaki state ko us hisaab se update kiya jaaye jo unhone type kiya, jo phir agli render trigger karta hai, jo input ko updated value se paint karta hai. \`onChange\` chhod do to input taknik roop se ab bhi interactive hai (click ho sakta hai, focus ho sakta hai) par dikhne mein jam gaya hai, kyunki React use har keystroke ke baad wapas na-badalti \`value\` par repaint kar deta hai.

## SyntheticEvent: ek event system, har browser

\`\`\`jsx
function handleChange(event) {
  console.log(event.target.value);     // wo DOM element jisne event chalaayi, aur uski value
  console.log(event.type);              // "change"
}
\`\`\`

\`event\` object jo React aapke handler ko thamaata hai wo ek \`SyntheticEvent\` hai — ek wrapper jo React browser ki native event ke aas-paas banata hai, behaviour ko normalize karte hue taaki wo har browser mein ek jaisa kaam kare, kyunki raw native events mein purani asli cross-browser asamaanataayen thi. \`event.target\` ab bhi asli underlying DOM element hai (ek \`HTMLInputElement\`, ek \`HTMLButtonElement\`, jo bhi event ne chalaya), isliye saari aam DOM element properties — \`.value\`, \`.checked\`, \`.name\`, \`.id\` — bilkul wahin maujood hain jahan aap ummeed karoge.

## Alag-alag form elements sambhaalna

\`\`\`jsx
// Text input — value ek string hai, .value se padho
<input value={text} onChange={(e) => setText(e.target.value)} />

// Checkbox — value ek boolean hai, .checked se padho
<input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />

// Select — text input jaisa behave karta hai, value/.value wahi tarike se kaam karte hain
<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="in">India</option>
  <option value="us">USA</option>
</select>

// Textarea — ye bhi text input jaisa behave karta hai, ALAG HTML element hone ke BAAWJOOD
// (saadha HTML textarea ka text uske tags ke beech rakhta hai; React ise bhi "value" mein ekjaisa banata hai)
<textarea value={bio} onChange={(e) => setBio(e.target.value)} />
\`\`\`

React jaan-boojhkar \`<select>\` aur \`<textarea>\` ko \`<input>\` jaisa behave karaata hai consistency ke liye, chahe underlying saadhe-HTML elements kaafi alag tarike se kaam karte hon — saadha HTML \`<textarea>\` apna text \`value\` attribute ke bajaye element content ki tarah rakhta hai, aur saadha HTML \`<select>\` chuni hui option ko \`<select>\` par khud \`value\` ke bajaye \`<option>\` par \`selected\` attribute se dikhaata hai. React ka controlled-component model in dono farkon ko dhak deta hai taaki har form element wahi \`value\`/\`onChange\` pattern maane, sirf checkboxes aur radio buttons ke alawa, jo \`checked\` use karte hain kyunki unki asli state boolean hai, text nahi.

## Ek handler se kai fields sambhaalna

\`\`\`jsx
function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleChange(event) {
    const { name, value } = event.target;   // yahan "name" input ka HTML "name" attribute hai
    setForm({ ...form, [name]: value });      // computed property name — sirf wahi ek field update karta hai
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
\`\`\`

Har field ke liye alag handler function likhne ke bajaye, ek shared handler \`event.target\` se field ka HTML \`name\` attribute padhta hai, phir use computed property name ki tarah use karta hai (\`[name]: value\`, JS course ka objects module) sirf wahi ek field state object ke andar update karne ke liye — pichle lesson ka wahi nested-spread pattern yahan lagu hota hai, kyunki \`form\` khud ek object hai jo immutably update ho raha hai.

## Form submission: preventDefault aur validation kahan hoti hai

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    // yahan email server ko submit karo
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

Client-side validation \`onSubmit\` handler ke andar rehti hai, asli submission logic (ek API call, aam taur par) se pehle chalti hai — condition check karke, fail hone par error message state mein daalke, aur submission ko chhodne ke liye jaldi \`return\` karte hue. Conditional \`{error && <p>{error}</p>}\` Module 1 ka wahi JSX conditional-rendering pattern hai: jab tak \`error\` falsy khaali string hai kuch render nahi hota, aur message us pal dikhta hai jab \`setError\` use asli text de deta hai.

## TypeScript: event handlers ko type karna

\`\`\`tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setQuery(event.target.value);      // .value pehchaana hua hai string ki tarah
}

function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setSubscribed(event.target.checked);   // .checked pehchaana hua hai boolean ki tarah — wahi event type, alag element behaviour
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}
\`\`\`

\`React.ChangeEvent<T>\` aur \`React.FormEvent<T>\` \`@types/react\` package ke bheje generic types hain (TypeScript course ka generics module) — type parameter \`T\` tay karta hai \`event.target\` kaunse khaas DOM element type ka nikalta hai, aur isi se TypeScript ko pata chalta hai \`.value\` aur \`.checked\` maujood hain aur unka type kya hai, aur \`event.target.valeu\` jaisi galti ko compile time par pakad leta hai runtime par chupchap fail hone dene ke bajaye. Checkbox aur text input dono ke handler ke event parameter ke liye bilkul wahi \`React.ChangeEvent<HTMLInputElement>\` type use hota hai — element type dono taraf se wahi \`<input>\` hai, isliye TypeScript khud yahan unke beech fark nahi karta; ye ek saadha runtime convention hai (checkboxes \`.checked\` padhte hain, baaki sab \`.value\`) na ki kuch jo type system alag se lagu karta hai.`,

    examples: [
      {
        title: 'Broken: value without onChange freezes the input',
        titleHi: 'Toota: onChange ke bina value input ko jam deta hai',
        code: `function SearchBox() {
  const [query, setQuery] = useState("");
  return <input value={query} placeholder="Search..." />;
}`,
        codeJs: `function SearchBox() {
  const [query, setQuery] = useState("");
  return <input value={query} placeholder="Search..." />;
}
// Console: "You provided a 'value' prop to a form field without an
// 'onChange' handler. This will render a read-only field."`,
        codeTs: `function SearchBox() {
  const [query, setQuery] = useState("");
  return <input value={query} placeholder="Search..." />;
}
// TypeScript does not catch this — value={query} and a missing onChange
// are both perfectly valid JSX. This is a React runtime warning, not a
// type error.`,
        output: `Typing into the input produces no visible change at all — every
keystroke is immediately overwritten back to "" (query's unchanging
value) on the next render. The console warning is the real, verbatim
message React logs in this exact situation.`,
        explain: 'This is the single most common first controlled-forms bug — the input LOOKS interactive because it can be clicked and focused, but is functionally frozen because nothing ever updates the state driving its value.',
        explainHi: 'Ye controlled-forms ka sabse aam pehla bug hai — input interactive DIKHTA hai kyunki use click aur focus kiya ja sakta hai, par functionally jam gaya hai kyunki uski value chalaane wali state ko kabhi koi update nahi karta.',
      },
      {
        title: 'Fixed: onChange completes the controlled-input loop',
        titleHi: 'Theek: onChange controlled-input loop poora karta hai',
        code: `function SearchBox() {
  const [query, setQuery] = useState("");
  function handleChange(e) { setQuery(e.target.value); }
  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}`,
        codeJs: `function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}`,
        codeTs: `function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}`,
        outputJs: `Typing "react" into the box shows "r", then "re", then "rea"... exactly
as expected — each keystroke fires onChange, which updates "query",
which re-renders the input with the new text.`,
        outputTs: `// Identical behaviour. "React.ChangeEvent<HTMLInputElement>" is what
// makes "event.target.value" resolve to type "string" instead of "any"
// — hover over .value in an editor and TypeScript confirms it.`,
        explain: 'Exactly one thing changed from the broken version — an onChange handler that feeds keystrokes back into state — and that alone is the entire difference between a frozen input and a working one.',
        explainHi: 'Toote version se bilkul ek cheez badli — ek onChange handler jo keystrokes wapas state mein daalta hai — aur akela wahi jam hue input aur chalte input ke beech poora fark hai.',
      },
      {
        title: 'Checkbox: checked and .checked, not value',
        titleHi: 'Checkbox: checked aur .checked, value nahi',
        code: `function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  return <input type="checkbox" checked={subscribed}
    onChange={(e) => setSubscribed(e.target.checked)} />;
}`,
        codeJs: `function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleChange(event) {
    setSubscribed(event.target.checked);
  }

  return (
    <label>
      <input type="checkbox" checked={subscribed} onChange={handleChange} />
      Subscribe to updates
    </label>
  );
}`,
        codeTs: `function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSubscribed(event.target.checked);
  }

  return (
    <label>
      <input type="checkbox" checked={subscribed} onChange={handleChange} />
      Subscribe to updates
    </label>
  );
}`,
        outputJs: `Clicking the checkbox correctly toggles it on and off. Reading
"event.target.value" instead of ".checked" here would always log "on"
regardless of checked state — value is the checkbox's fixed HTML
attribute, unrelated to whether it's actually checked.`,
        outputTs: `// Same "React.ChangeEvent<HTMLInputElement>" type as the text input
// example — TypeScript does not distinguish checkbox inputs from text
// inputs at the type level, since both are HTMLInputElement. Reading
// .checked vs .value is a runtime convention, not something the types
// enforce differently per input type.`,
        explain: 'A checkbox\'s value attribute is a fixed string set in the HTML (or defaults to "on") — it has nothing to do with whether the box is checked, which is exactly why `.checked` exists as a separate boolean property.',
        explainHi: 'Checkbox ka value attribute ek fixed string hai jo HTML mein set hai (ya default "on" hai) — uska is baat se koi lena-dena nahi ki box checked hai ya nahi, aur bilkul isi wajah se \`.checked\` alag boolean property ki tarah maujood hai.',
      },
      {
        title: 'Full form: multiple fields, one handler, preventDefault',
        titleHi: 'Poora form: kai fields, ek handler, preventDefault',
        code: `function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "" });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  function handleSubmit(e) { e.preventDefault(); console.log(form); }
  return <form onSubmit={handleSubmit}>...</form>;
}`,
        codeJs: `function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submitting:", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        codeTs: `interface SignupFormState {
  name: string;
  email: string;
}

function SignupForm() {
  const [form, setForm] = useState<SignupFormState>({ name: "", email: "" });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log("Submitting:", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        outputJs: `Typing in either field updates only that field in "form" — the
computed property "[name]: value" keys the update by each input's HTML
"name" attribute. Submitting logs the full object without reloading
the page, because preventDefault() stopped the browser's default
submit behaviour.`,
        outputTs: `// The "SignupFormState" interface documents the form's shape once,
// and both handleChange's spread and any code reading "form" later get
// full autocomplete and typo-checking on "name" and "email" — this is
// the interfaces pattern from the TypeScript course applied directly
// to form state.`,
        explain: 'One shared handler scales to any number of fields because it reads which field changed from the DOM itself (`event.target.name`) instead of needing a separate function written per field.',
        explainHi: 'Ek shared handler kitne bhi fields tak scale karta hai kyunki wo khud DOM se padhta hai kaunsi field badli (\`event.target.name\`), har field ke liye alag function likhne ki zarurat ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `<input value={query} placeholder="Search..." />
// no onChange — every keystroke is silently discarded`,
        right: `<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />`,
        why: 'Giving an input a `value` prop hands React full control over what it displays on every render; without `onChange` updating the state behind that value, React keeps repainting the input back to the same unchanging text after every keystroke.',
        whyHi: 'Input ko \`value\` prop dena React ko poora control de deta hai ki har render par wo kya dikhaaye; agar \`onChange\` us value ke peeche wali state ko update na kare, React har keystroke ke baad input ko wapas usi na-badalti text par paint karta rehta hai.',
      },
      {
        wrong: `<input type="checkbox" value={subscribed} onChange={(e) => setSubscribed(e.target.value)} />
// reads .value on a checkbox — always logs the string "on"`,
        right: `<input type="checkbox" checked={subscribed} onChange={(e) => setSubscribed(e.target.checked)} />`,
        why: 'A checkbox\'s `.value` is a fixed HTML attribute unrelated to whether it is checked (it defaults to the string `"on"`); the actual checked/unchecked state lives on the separate `.checked` boolean property, controlled through the `checked` prop, not `value`.',
        whyHi: 'Checkbox ka \`.value\` ek fixed HTML attribute hai jiska is baat se lena-dena nahi ki wo checked hai ya nahi (default string \`"on"\` hota hai); asli checked/unchecked state alag \`.checked\` boolean property mein rehti hai, \`checked\` prop se control hoti hai, \`value\` se nahi.',
      },
      {
        wrong: `function handleSubmit(event) {
  console.log(email);   // page reloads immediately after this runs
}`,
        right: `function handleSubmit(event) {
  event.preventDefault();
  console.log(email);
}`,
        why: 'A plain HTML form\'s default behaviour on submit is a full-page reload with a browser-native request — without `event.preventDefault()` inside the `onSubmit` handler, that default reload happens regardless of what your own handler code does.',
        whyHi: 'Saadhe HTML form ka submit par default behaviour poora-page reload karna hai browser-native request ke saath — \`onSubmit\` handler ke andar \`event.preventDefault()\` ke bina, wo default reload hoti hai chahe aapka apna handler code kuch bhi kare.',
      },
    ],

    realWorld: [
      {
        en: '**"You provided a `value` prop to a form field without an `onChange` handler" is one of the single most-searched React console warnings on the internet** — precisely because a frozen input with no visible error on the page itself is deeply confusing until you know to check the console.',
        hi: '**"You provided a value prop to a form field without an onChange handler" internet par sabse zyada search ki jaane wali React console warnings mein se ek hai** — bilkul isliye kyunki jam hua input jispar page par koi dikhta error nahi, tab tak gehra confuse karta hai jab tak aapko console check karna na pata ho.',
      },
      {
        en: '**Form libraries like React Hook Form and Formik exist specifically to manage the boilerplate this lesson demonstrated by hand** — one `useState` and one `handleChange` per field gets unwieldy past a handful of fields, which is why production forms in real codebases usually reach for a dedicated library rather than hand-rolling every field.',
        hi: '**React Hook Form aur Formik jaisi form libraries khaas taur par isliye maujood hain ki wo boilerplate sambhaalen jo is lesson ne haath se dikhaaya** — mutthi bhar fields ke baad har field ke liye ek \`useState\` aur ek \`handleChange\` besambhal ho jaata hai, isliye asli codebases mein production forms aksar khud har field haath se banaane ke bajaye ek khaas library uthaate hain.',
      },
      {
        en: '**`event.preventDefault()` inside `onSubmit` is close to universal in production React forms** — any form that talks to a server (which is nearly all of them) needs to intercept the browser\'s default full-page-reload submit behaviour to send the data via `fetch` or a library instead.',
        hi: '**\`onSubmit\` ke andar \`event.preventDefault()\` production React forms mein lagbhag sarvbhaumik hai** — koi bhi form jo server se baat karta hai (jo lagbhag sabhi hain) use browser ke default poora-page-reload submit behaviour ko rokna padta hai taaki data \`fetch\` ya kisi library se bheja ja sake.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does an `<input>` with a `value` prop but no `onChange` handler appear to accept clicks and focus, but never actually display anything typed into it?',
        qHi: 'Ek \`<input>\` jiske paas \`value\` prop hai par \`onChange\` handler nahi, wo clicks aur focus accept karta hua kyun lagta hai, par jo bhi usme type ho use kabhi dikhaata kyun nahi?',
        a: 'A `value` prop hands React full control over what the input displays: on every render, React sets the input\'s text to exactly the current value of the state variable passed as `value`, overwriting anything the DOM might otherwise show. The input remains a genuine, functional DOM element — it can still be clicked, focused, and typed into at the browser level — but since nothing calls the corresponding state setter in response to those keystrokes, the state driving `value` never changes, so React keeps repainting the input back to the same unchanging text on every subsequent render, including the one triggered by the keystroke itself.',
        aHi: '\`value\` prop React ko poora control de deta hai ki input kya dikhaaye: har render par, React input ki text ko bilkul us state variable ki abhi ki value set karta hai jo \`value\` ki tarah pass hua hai, DOM jo bhi warna dikhaata use overwrite karte hue. Input ek asli, functional DOM element rehta hai — use browser level par ab bhi click, focus, aur type kiya ja sakta hai — par chunki un keystrokes ke jawaab mein corresponding state setter kabhi bulaya hi nahi jaata, \`value\` chalaane wali state kabhi badalti nahi, isliye React har aage wali render par input ko wapas usi na-badalti text par paint karta rehta hai, khud us keystroke se trigger hui render bhi shaamil.',
      },
      {
        q: 'Why does a checkbox use `checked` and `event.target.checked` instead of `value` and `event.target.value`?',
        qHi: 'Checkbox \`value\` aur \`event.target.value\` ke bajaye \`checked\` aur \`event.target.checked\` kyun use karta hai?',
        a: 'A checkbox\'s meaningful piece of state is a boolean — whether it is checked or not — not a piece of text, so React exposes a separate `checked` prop and corresponding `event.target.checked` boolean property specifically for controlling and reading that on/off state. The checkbox\'s `value` attribute is a completely separate, fixed piece of data defined in the HTML (defaulting to the string `"on"` if not explicitly set) that has no relationship to whether the box is checked — reading `event.target.value` on a checkbox change event returns that fixed string regardless of the checkbox\'s checked state, which is why using `.value` instead of `.checked` is a common and confusing mistake.',
        aHi: 'Checkbox ka asli state ek boolean hai — checked hai ya nahi — text ka koi tukda nahi, isliye React ek alag \`checked\` prop aur corresponding \`event.target.checked\` boolean property khaas taur par us on/off state ko control aur padhne ke liye deta hai. Checkbox ka \`value\` attribute ek bilkul alag, fixed data hai jo HTML mein defined hai (agar explicitly set na ho to default string \`"on"\` hai) jiska box checked hai ya nahi usse koi rishta nahi — checkbox change event par \`event.target.value\` padhna wo fixed string lautaata hai chahe checkbox ki checked state kuch bhi ho, aur isi wajah se \`.checked\` ke bajaye \`.value\` use karna ek aam aur confuse karne wali galti hai.',
      },
      {
        q: 'Why is `event.preventDefault()` necessary inside a form\'s `onSubmit` handler in a React app?',
        qHi: 'React app mein form ke \`onSubmit\` handler ke andar \`event.preventDefault()\` zaruri kyun hai?',
        a: 'A plain HTML `<form>`\'s built-in default behaviour when submitted is to perform a full-page reload and send the form\'s field values as a browser-native HTTP request — behaviour that predates JavaScript-driven single-page applications entirely. In a React app, the submitted data almost always needs to be handled with JavaScript instead — sent via `fetch` to an API, validated, or used to update state — none of which is possible if the browser has already reloaded the page. Calling `event.preventDefault()` as the first line of the `onSubmit` handler stops that default browser behaviour, letting the rest of the handler\'s own logic run against the current, un-reloaded page.',
        aHi: 'Saadhe HTML \`<form>\` ka submit hone par built-in default behaviour poora-page reload karna aur form ki field values ko browser-native HTTP request ki tarah bhejna hai — aisa behaviour jo JavaScript-driven single-page applications se poori tarah pehle ka hai. React app mein, submit hui data ko lagbhag hamesha JavaScript se hi sambhaalna hota hai — \`fetch\` se kisi API ko bhejna, validate karna, ya state update karne mein use karna — in mein se kuch bhi mumkin nahi agar browser page pehle hi reload kar chuka hai. \`onSubmit\` handler ki pehli line ki tarah \`event.preventDefault()\` bulaana us default browser behaviour ko rokta hai, handler ke baaki apne logic ko abhi ke, na-reload hue page par chalne dete hue.',
      },
      {
        q: 'What does the generic type parameter in `React.ChangeEvent<HTMLInputElement>` actually control, and what would go wrong if you typed the event parameter as plain `Event` instead?',
        qHi: '\`React.ChangeEvent<HTMLInputElement>\` mein generic type parameter asal mein kya control karta hai, aur agar event parameter ko plain \`Event\` ki tarah type karo to kya galat hoga?',
        a: '`React.ChangeEvent<T>` is a generic type where `T` fixes what specific DOM element type the event\'s `target` property resolves to — passing `HTMLInputElement` tells TypeScript that `event.target` is specifically an input element, which is what makes `event.target.value` (and `.checked`) known, correctly-typed properties rather than something TypeScript would reject or treat as `any`. Typing the parameter as the plain built-in `Event` type instead would compile the function signature fine, but `event.target` would then be typed as the much more generic `EventTarget`, which does not have a `.value` or `.checked` property defined at all — accessing either would be a TypeScript compile error, forcing an unsafe type assertion to work around it.',
        aHi: '\`React.ChangeEvent<T>\` ek generic type hai jahan \`T\` tay karta hai event ka \`target\` property kaunse khaas DOM element type ka nikalta hai — \`HTMLInputElement\` pass karna TypeScript ko batata hai ki \`event.target\` khaas taur par ek input element hai, aur isi se \`event.target.value\` (aur \`.checked\`) pehchaani hui, sahi type wali properties ban jaati hain, aisi cheez ke bajaye jise TypeScript reject kare ya \`any\` maane. Parameter ko iske bajaye plain built-in \`Event\` type ki tarah type karna function signature theek compile kar dega, par \`event.target\` phir bahut zyada general \`EventTarget\` type ka ho jaayega, jiske paas \`.value\` ya \`.checked\` property defined hi nahi — dono mein se kisi ko bhi access karna ek TypeScript compile error hoga, jo ise theek karne ke liye ek asurakshit type assertion majboor karega.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken SearchBox with `value` and no `onChange`. Type into it, confirm nothing appears, then open the browser console and read the exact React warning it produces.',
        taskHi: '\`value\` wala aur \`onChange\` na wala toota SearchBox banao. Usme type karo, confirm karo kuch nahi dikhta, phir browser console kholo aur wo asli React warning padho jo wo deta hai.',
        hint: 'The warning names the exact prop that is missing — read it carefully before fixing the component, rather than jumping straight to the fix.',
        hintHi: 'Warning bilkul us prop ka naam leti hai jo missing hai — component theek karne se pehle use dhyaan se padho, seedha fix par kudne ke bajaye.',
      },
      {
        task: 'Build a controlled Newsletter checkbox. First read `event.target.value` in the handler and log it while clicking — confirm it always logs "on". Then switch to `event.target.checked` and confirm it correctly toggles.',
        taskHi: 'Controlled Newsletter checkbox banao. Pehle handler mein \`event.target.value\` padho aur click karte waqt use log karo — confirm karo wo hamesha "on" log karta hai. Phir \`event.target.checked\` par switch karo aur confirm karo wo sahi tarike se toggle karta hai.',
        hint: 'Log both event.target.value and event.target.checked side by side on every click to see the difference directly.',
        hintHi: 'Har click par \`event.target.value\` aur \`event.target.checked\` dono ko saath-saath log karo fark seedha dekhne ke liye.',
      },
      {
        task: 'Build the SignupForm with two fields sharing one handleChange, and a handleSubmit that logs the form object. Remove event.preventDefault() temporarily and confirm the page actually reloads on submit, then add it back.',
        taskHi: 'Do fields wala SignupForm banao jo ek hi handleChange share karte hain, aur ek handleSubmit jo form object log kare. Temporarily event.preventDefault() hatao aur confirm karo submit par page sach mein reload hota hai, phir use wapas jodo.',
        hint: 'Watch the Network tab or the page favicon spinner to see the reload actually happen when preventDefault is missing.',
        hintHi: 'Reload asal mein hote dekhne ke liye Network tab ya page ke favicon spinner ko dekho jab preventDefault missing ho.',
      },
    ],

    keyTakeaways: [
      'An `<input>` with a `value` prop but no `onChange` handler is not a minor oversight — it visibly freezes the input and produces a real React console warning, because React repaints the input to the unchanging state value after every keystroke.',
      'React\'s event object is a SyntheticEvent, a cross-browser-normalized wrapper; `event.target` is still the real underlying DOM element, so `.value`, `.checked`, and `.name` all work as expected.',
      'Checkboxes and radio buttons use `checked`/`event.target.checked` (a boolean) instead of `value`/`event.target.value` (a string), because their meaningful state is on/off, not text.',
      'A single shared `handleChange` can update any number of form fields by reading the changed field\'s HTML `name` attribute off `event.target` and using it as a computed property name to update just that field in a state object.',
      '`event.preventDefault()` inside `onSubmit` is required to stop a form\'s default full-page-reload submit behaviour, which would otherwise discard all React state and any pending API call.',
      '`React.ChangeEvent<T>` and `React.FormEvent<T>` are generic types where `T` fixes the DOM element type of `event.target`, which is what makes properties like `.value` and `.checked` type-checked instead of falling back to `any` or `EventTarget`.',
    ],
    keyTakeawaysHi: [
      '\`value\` prop wala par \`onChange\` handler na wala \`<input>\` koi chhoti si chook nahi hai — ye input ko dikhta hua jam deta hai aur ek asli React console warning deta hai, kyunki React har keystroke ke baad input ko na-badalti state value par repaint karta hai.',
      'React ka event object ek SyntheticEvent hai, ek cross-browser-normalized wrapper; \`event.target\` ab bhi asli underlying DOM element hai, isliye \`.value\`, \`.checked\`, aur \`.name\` sab ummeed ke mutabik kaam karte hain.',
      'Checkboxes aur radio buttons \`value\`/\`event.target.value\` (ek string) ke bajaye \`checked\`/\`event.target.checked\` (ek boolean) use karte hain, kyunki unki asli state on/off hai, text nahi.',
      'Ek shared \`handleChange\` kitne bhi form fields update kar sakta hai badli hui field ka HTML \`name\` attribute \`event.target\` se padhkar aur use computed property name ki tarah use karke sirf wahi field state object mein update karne ke liye.',
      '\`onSubmit\` ke andar \`event.preventDefault()\` chahiye form ke default poora-page-reload submit behaviour ko rokne ke liye, jo warna saara React state aur koi bhi lambit API call chhod deta.',
      '\`React.ChangeEvent<T>\` aur \`React.FormEvent<T>\` generic types hain jahan \`T\` \`event.target\` ka DOM element type tay karta hai, aur isi se \`.value\` aur \`.checked\` jaisi properties type-checked hoti hain \`any\` ya \`EventTarget\` par girne ke bajaye.',
    ],
  },
];
