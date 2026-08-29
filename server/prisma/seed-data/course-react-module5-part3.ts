/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 3.
 *
 * Forms at scale: validation, touched-state, and consolidating multi-field
 * form state. The broken example is a signup form that shows EVERY
 * validation error immediately on first render, before the user has typed
 * anything — a genuinely common, well-known UX bug caused by validating and
 * displaying errors unconditionally rather than tracking which fields the
 * user has actually interacted with.
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

export const REACT_MODULE_5_PART3: CourseLesson[] = [
  {
    slug: 'forms-at-scale-validation-touched-state',
    title: 'Forms at Scale: Validation, Touched State, and Consolidated Form State',
    titleHi: 'Badi Scale Ke Forms: Validation, Touched State, Aur Ekjut Form State',
    description: 'A brand-new, empty signup form that immediately greets the user with three red error messages before they have typed a single character.',
    descriptionHi: 'Ek bilkul naya, khaali signup form jo user ko turant teen laal error messages se swagat karta hai use ek akshar bhi type kiye bina.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A teacher marking a blank exam paper "wrong" the instant it is handed out, before the student has written anything.** Validating every field and unconditionally displaying its error the moment a form first renders is like a teacher grading a completely blank exam paper as soon as it is placed on a student\'s desk — every question is technically "unanswered", so every question gets marked wrong, and the student sees a paper covered in red ink before they have even picked up a pen. What the student actually needs is for the teacher to wait until they have attempted a question (or handed in the paper) before judging it — grading before any attempt has been made is not "helpful early feedback", it is just noise that makes a normal, in-progress state look like a wall of failures. "Touched" state is the record of which questions the student has actually attempted — only THOSE get graded as the student works, and the rest stay ungraded until they are reached.',
      hi: '**Ek teacher khaali exam paper ko usi pal "galat" maark karta hai jab wo diya jaata hai, student ke kuch likhne se pehle.** Form pehli baar render hote hi har field ko validate karna aur uska error bina kisi shart ke dikhaana aisa hai jaise ek teacher ek poori tarah khaali exam paper ko turant grade kar de jaise hi wo student ki desk par rakhi jaaye — har sawaal taknik roop se "anutrit" hai, isliye har sawaal galat maark ho jaata hai, aur student ko laal syahi se dhaka hua paper dikhta hai unke pen uthaane se pehle hi. Student ko asal mein jo chahiye wo ye hai ki teacher tab tak intezaar kare jab tak wo kisi sawaal ki koshish na kar le (ya paper de na de) uska nirnay karne se pehle — kisi koshish ke bina grade karna "madadgaar shuruaati feedback" nahi hai, ye bas shor hai jo ek aam, chalti hui state ko asafalta ki deewar jaisi dikhaata hai. "Touched" state us baat ka record hai ki student ne asal mein kaunse sawaal ki koshish ki hai — sirf WOHI grade hote hain jaise student kaam karta hai, aur baaki tab tak ungraded rehte hain jab tak unhe chhua na jaaye.',
    },

    simple: `**Start broken.** A signup form that validates on every render, unconditionally:

\`\`\`jsx
function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      {nameError && <p className="error">{nameError}</p>}

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {emailError && <p className="error">{emailError}</p>}

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

Load this form for the first time, before typing anything at all, and it immediately displays all three error messages — "Name is required," "Enter a valid email," "Password must be at least 8 characters" — because \`name\`, \`email\`, and \`password\` genuinely ARE their invalid initial empty-string values, and nothing here checks whether the user has actually had a chance to fill them in yet. Every keystroke re-runs the same three checks and re-renders the same conditional errors, so the messages never truly go away until each field happens to become valid — a user who is still typing their name sees a "Password must be at least 8 characters" message the entire time, about a field they have not even reached yet. This is not a logic bug — every single check is computing the objectively correct answer — it is a UX bug: validity and "should the user be shown an error right now" are being treated as the same thing, when they are not.

**The fix: track which fields have been \`touched\`, and only show an error for a touched field**

\`\`\`jsx
function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
  }

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        placeholder="Password"
      />
      {touched.password && passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
interface Touched {
  name: boolean;
  email: boolean;
  password: boolean;
}

function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [touched, setTouched] = useState<Touched>({ name: false, email: false, password: false });

  function handleBlur(field: keyof Touched): void {
    setTouched({ ...touched, [field]: true });
  }

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        placeholder="Password"
      />
      {touched.password && passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`onBlur\` (a standard DOM event, distinct from \`onChange\`) fires when a field LOSES focus — the moment a user moves on from it, which is the natural signal that they consider themselves "done" with that field for now. \`touched\` tracks, per field, whether that moment has happened yet; the JSX condition changes from \`{nameError && ...}\` to \`{touched.name && nameError && ...}\`, so an error only renders once BOTH conditions are true — the value is actually invalid, AND the user has had a genuine chance to enter something valid. The validation logic itself (\`emailError\`, \`passwordError\`, \`nameError\`) is completely unchanged — this fix is entirely about WHEN to show the result of that logic, not about the logic itself.

**A common refinement:** re-validating on every keystroke AFTER a field has been touched once (rather than only on blur) gives faster feedback once the user starts correcting a known error — the \`emailError\` calculation already re-runs on every render regardless, so once \`touched.email\` is \`true\`, the displayed error naturally updates in real time as the user fixes it, disappearing the instant it becomes valid.`,

    simpleHi: `**Toote hue se shuru.** Ek signup form jo har render par bina kisi shart ke validate karta hai:

\`\`\`jsx
function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      {nameError && <p className="error">{nameError}</p>}

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {emailError && <p className="error">{emailError}</p>}

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

Is form ko pehli baar load karo, kuch bhi type kiye bina, aur ye turant teeno error messages dikhaata hai — "Name is required," "Enter a valid email," "Password must be at least 8 characters" — kyunki \`name\`, \`email\`, aur \`password\` sach mein unki invalid shuruaati khaali-string values HAIN, aur yahan kuch bhi check nahi karta ki user ko unhe bharne ka mauka mila bhi hai ya nahi. Har keystroke wahi teen checks dobara chalaata hai aur wahi conditional errors dobara render karta hai, isliye messages kabhi asal mein gayab nahi hote jab tak har field samyog se valid na ho jaaye — ek user jo abhi bhi apna naam type kar raha hai use poore waqt "Password must be at least 8 characters" wala message dikhta hai, ek aisi field ke baare mein jise use abhi chuya bhi nahi. Ye koi logic bug nahi hai — har akela check objectively sahi jawaab ganit kar raha hai — ye ek UX bug hai: validity aur "kya user ko abhi error dikhaana chahiye" ko ek hi cheez maana jaa raha hai, jabki wo hain nahi.

**Fix: track karo kaunsi fields \`touched\` hui hain, aur sirf touched field ke liye error dikhaao**

\`\`\`jsx
function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
  }

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        placeholder="Password"
      />
      {touched.password && passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
interface Touched {
  name: boolean;
  email: boolean;
  password: boolean;
}

function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [touched, setTouched] = useState<Touched>({ name: false, email: false, password: false });

  function handleBlur(field: keyof Touched): void {
    setTouched({ ...touched, [field]: true });
  }

  const emailError = !email.includes("@") ? "Enter a valid email" : null;
  const passwordError = password.length < 8 ? "Password must be at least 8 characters" : null;
  const nameError = name.trim() === "" ? "Name is required" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        placeholder="Password"
      />
      {touched.password && passwordError && <p className="error">{passwordError}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`onBlur\` (ek standard DOM event, \`onChange\` se alag) tab chalta hai jab field FOCUS KHO DETI HAI — jab user usse aage badhta hai, jo svaabhaavik ishara hai ki wo abhi ke liye khud ko us field se "khatam" maanta hai. \`touched\` har field ke liye track karta hai ki wo pal hua hai ya nahi; JSX condition \`{nameError && ...}\` se \`{touched.name && nameError && ...}\` mein badal jaata hai, isliye error sirf tab render hota hai jab DONO conditions sach hon — value asal mein invalid hai, AUR user ko sach mein kuch valid daalne ka mauka mila hai. Validation logic khud (\`emailError\`, \`passwordError\`, \`nameError\`) bilkul na-badla hua hai — ye fix poori tarah is baare mein hai ki us logic ka nateeja KAB dikhaana hai, khud logic ke baare mein nahi.

**Ek aam sudhaar:** field ek baar touched hone ke BAAD har keystroke par dobara validate karna (sirf blur par nahi) tezi se feedback deta hai jaise hi user ek jaani-maani galti theek karna shuru karta hai — \`emailError\` ganit waise bhi har render par dobara chalti hai, isliye ek baar \`touched.email\` \`true\` ho jaaye, dikhta error naturally real time mein update hota hai jaise user use theek karta hai, valid hote hi turant gayab hota hai.`,

    content: `## Consolidating multi-field state with \`useReducer\`

\`\`\`jsx
const initialState = {
  values: { name: "", email: "", password: "" },
  touched: { name: false, email: false, password: false },
};

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "BLUR":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  function handleChange(field, value) {
    dispatch({ type: "CHANGE", field, value });
  }
  function handleBlur(field) {
    dispatch({ type: "BLUR", field });
  }

  // ...
}
\`\`\`

As a form grows past a handful of fields, six or more separate \`useState\` calls (one per field, plus one per touched flag) becomes exactly the kind of related, coordinated state the previous \`useReducer\` lesson covered — every field\'s value and touched status are facets of one \`SignupForm\` submission, updated through a small, fixed set of actions (\`CHANGE\`, \`BLUR\`, and typically \`SUBMIT\`). Consolidating into one reducer does not change the form\'s behavior; it changes where the update logic lives, moving it out of scattered inline \`setX\` calls and into one central, testable function, exactly as the previous lesson demonstrated for a simpler loading/error/success flow.

## Validating on submit versus validating as-you-go

\`\`\`jsx
function handleSubmit(event) {
  event.preventDefault();
  const allTouched = { name: true, email: true, password: true };
  setTouched(allTouched);   // mark every field touched, revealing every remaining error at once

  if (nameError || emailError || passwordError) {
    return;   // block submission if anything is still invalid
  }
  // proceed with the actual submission
}
\`\`\`

Touched-based display handles the common case (an error only appears once a user has interacted with that specific field), but a user could still click "Submit" having only touched some fields, leaving others both invalid AND still hidden. Marking every field \`touched\` inside the submit handler itself — not just individual \`onBlur\` handlers — reveals every remaining error at once specifically at the moment the user tries to submit, which is the appropriate final checkpoint before allowing the actual submission logic to run.

## Why validation logic belongs in plain functions, not scattered inline

\`\`\`jsx
function validateEmail(email) {
  if (!email.includes("@")) return "Enter a valid email";
  return null;
}

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}
\`\`\`

Extracting each field\'s validation into its own plain function — the same principle Module 4\'s custom hooks lesson applied to duplicated stateful logic, here applied to duplicated or scattered validation rules — makes each rule independently testable with plain inputs and outputs (\`validateEmail("bad") === "Enter a valid email"\`), reusable across multiple forms that happen to need the same field (a login form and a signup form both needing email validation), and easier to read at the point of use, where \`const emailError = validateEmail(email);\` states its intent more clearly than an inline ternary repeated at every call site.

## TypeScript: typing form values, errors, and touched state together

\`\`\`tsx
interface SignupValues {
  name: string;
  email: string;
  password: string;
}

type SignupErrors = Partial<Record<keyof SignupValues, string>>;
type SignupTouched = Record<keyof SignupValues, boolean>;

function validateForm(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  if (values.name.trim() === "") errors.name = "Name is required";
  if (!values.email.includes("@")) errors.email = "Enter a valid email";
  if (values.password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}
\`\`\`

\`keyof SignupValues\` (TypeScript course, advanced types module) produces the union of \`SignupValues\`\'s field names as a type — \`"name" | "email" | "password"\` — which \`Record<keyof SignupValues, boolean>\` then uses to require exactly one boolean per field, no more, no less, for \`touched\`. \`Partial<Record<keyof SignupValues, string>>\` does the same for \`errors\`, but wrapped in \`Partial\` since a field with no error should have no corresponding key at all, rather than an empty string standing in for "no error." This trio of types — one for values, one derived for touched, one derived for errors — stays automatically in sync if a field is ever added or removed from \`SignupValues\`, since \`SignupTouched\` and \`SignupErrors\` are both defined IN TERMS OF \`SignupValues\` rather than independently listing the same three field names a second and third time.`,

    contentHi: `## \`useReducer\` se multi-field state ekjut karna

\`\`\`jsx
const initialState = {
  values: { name: "", email: "", password: "" },
  touched: { name: false, email: false, password: false },
};

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "BLUR":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  function handleChange(field, value) {
    dispatch({ type: "CHANGE", field, value });
  }
  function handleBlur(field) {
    dispatch({ type: "BLUR", field });
  }

  // ...
}
\`\`\`

Jaise ek form mutthi bhar fields se aage badhta hai, chhe ya zyada alag \`useState\` calls (har field ke liye ek, aur har touched flag ke liye ek) bilkul wahi jude, coordinate state ban jaate hain jise pichle \`useReducer\` lesson ne cover kiya — har field ki value aur touched status ek \`SignupForm\` submission ke pehlu hain, ek chhote, fixed actions ke set se update hote hain (\`CHANGE\`, \`BLUR\`, aur aam taur par \`SUBMIT\`). Ek reducer mein ekjut karna form ke behaviour ko nahi badalta; ye badalta hai ki update logic kahan rehta hai, use bikhre inline \`setX\` calls se nikaalte hue ek akele, testable function mein daalte hue, bilkul jaise pichle lesson ne ek saadhe loading/error/success flow ke liye dikhaaya.

## Submit par validate karna versus as-you-go validate karna

\`\`\`jsx
function handleSubmit(event) {
  event.preventDefault();
  const allTouched = { name: true, email: true, password: true };
  setTouched(allTouched);   // har field ko touched maark karo, baaki bache saare errors ek saath saamne laate hue

  if (nameError || emailError || passwordError) {
    return;   // agar kuch bhi abhi bhi invalid hai to submission roko
  }
  // asli submission ke saath aage badho
}
\`\`\`

Touched-based display aam case sambhaalta hai (error sirf tab dikhta hai jab user ne us khaas field se interact kiya ho), par ek user "Submit" click kar sakta hai sirf kuch fields ko chhukar, baaki dono ko invalid AUR abhi bhi chhupa hua chhodkar. Submit handler ke andar har field ko \`touched\` maark karna — sirf alag-alag \`onBlur\` handlers nahi — baaki bacha har error us pal ek saath saamne laata hai jab user submit karne ki koshish karta hai, jo asli submission logic chalne dene se pehle sahi aakhri checkpoint hai.

## Validation logic saadhe functions mein kyun honi chahiye, bikhri hui nahi

\`\`\`jsx
function validateEmail(email) {
  if (!email.includes("@")) return "Enter a valid email";
  return null;
}

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}
\`\`\`

Har field ki validation ko apne khud ke saadhe function mein nikaalna — Module 4 ke custom hooks lesson wala wahi principle, jo waha duplicated stateful logic par lagu hua, yahan duplicated ya bikhri hui validation rules par lagu hota hai — har niyam ko saadhe inputs aur outputs se alag test karne laayak banaata hai (\`validateEmail("bad") === "Enter a valid email"\`), kai forms ke aar-paar dobara use hone laayak jinhe samyog se wahi field chahiye (login form aur signup form dono ko email validation chahiye), aur istemal ke pal padhne mein aasan, jahan \`const emailError = validateEmail(email);\` apna maqsad ek har call site par dohraaye gaye inline ternary se zyada saaf batata hai.

## TypeScript: form values, errors, aur touched state ko saath type karna

\`\`\`tsx
interface SignupValues {
  name: string;
  email: string;
  password: string;
}

type SignupErrors = Partial<Record<keyof SignupValues, string>>;
type SignupTouched = Record<keyof SignupValues, boolean>;

function validateForm(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  if (values.name.trim() === "") errors.name = "Name is required";
  if (!values.email.includes("@")) errors.email = "Enter a valid email";
  if (values.password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}
\`\`\`

\`keyof SignupValues\` (TypeScript course, advanced types module) \`SignupValues\` ke field naamon ka union ek type ki tarah banaata hai — \`"name" | "email" | "password"\` — jise \`Record<keyof SignupValues, boolean>\` phir istemal karta hai \`touched\` ke liye har field ke liye bilkul ek boolean maangne ke liye, na kam, na zyada. \`Partial<Record<keyof SignupValues, string>>\` \`errors\` ke liye wahi karta hai, par \`Partial\` mein lapeta hua kyunki kisi error na wali field ki koi corresponding key hi nahi honi chahiye, "koi error nahi" ke liye ek khaali string ki jagah lene ke bajaye. Types ki ye teenon — ek values ke liye, ek touched ke liye nikla, ek errors ke liye nikla — apne aap sync mein rehti hain agar kabhi \`SignupValues\` mein koi field jodi ya hataayi jaaye, kyunki \`SignupTouched\` aur \`SignupErrors\` dono \`SignupValues\` KE HISAAB SE define hain, wahi teen field naam doosri aur teesri baar alag se list karne ke bajaye.`,

    examples: [
      {
        title: 'Broken: every error shows immediately, before any interaction',
        titleHi: 'Toota: har error turant dikhta hai, kisi interaction se pehle',
        code: `const nameError = name.trim() === "" ? "Name is required" : null;
return <>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  {nameError && <p>{nameError}</p>}
</>;`,
        codeJs: `function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const nameError = name.trim() === "" ? "Name is required" : null;
  const emailError = !email.includes("@") ? "Enter a valid email" : null;

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      {nameError && <p className="error">{nameError}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {emailError && <p className="error">{emailError}</p>}
    </form>
  );
}`,
        codeTs: `function SignupForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const nameError = name.trim() === "" ? "Name is required" : null;
  const emailError = !email.includes("@") ? "Enter a valid email" : null;

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      {nameError && <p className="error">{nameError}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {emailError && <p className="error">{emailError}</p>}
    </form>
  );
}
// TypeScript does not catch this — every check and render is correctly
// typed. This is a UX/timing problem, not a type error.`,
        output: `Loading this form for the very first time, with nothing typed yet,
immediately shows "Name is required" AND "Enter a valid email" — a
blank, untouched form presented as already full of mistakes.`,
        explain: 'Every individual check is computing the objectively correct answer — name genuinely IS empty, email genuinely IS invalid — the bug is entirely about conflating "this value is invalid" with "the user should see an error about it right now".',
        explainHi: 'Har akela check objectively sahi jawaab ganit kar raha hai — naam sach mein KHAALI HAI, email sach mein invalid HAI — bug poori tarah "ye value invalid hai" ko "user ko abhi iske baare mein error dikhna chahiye" ke saath ghol dene mein hai.',
      },
      {
        title: 'Fixed: touched state gates when an error actually displays',
        titleHi: 'Theek: touched state tay karta hai ki error asal mein kab dikhta hai',
        code: `const [touched, setTouched] = useState({ name: false, email: false });
<input onBlur={() => setTouched({ ...touched, name: true })} />
{touched.name && nameError && <p>{nameError}</p>}`,
        codeJs: `function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false });

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
  }

  const nameError = name.trim() === "" ? "Name is required" : null;
  const emailError = !email.includes("@") ? "Enter a valid email" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}
    </form>
  );
}`,
        codeTs: `interface Touched {
  name: boolean;
  email: boolean;
}

function SignupForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [touched, setTouched] = useState<Touched>({ name: false, email: false });

  function handleBlur(field: keyof Touched): void {
    setTouched({ ...touched, [field]: true });
  }

  const nameError = name.trim() === "" ? "Name is required" : null;
  const emailError = !email.includes("@") ? "Enter a valid email" : null;

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleBlur("name")}
        placeholder="Name"
      />
      {touched.name && nameError && <p className="error">{nameError}</p>}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && emailError && <p className="error">{emailError}</p>}
    </form>
  );
}`,
        outputJs: `Loading the form shows NO errors. Clicking into "Name", typing
nothing, then clicking away (blurring) reveals "Name is required" —
the exact moment the user is done with that specific field, not
before.`,
        outputTs: `// Identical behaviour. "keyof Touched" on handleBlur's parameter
// means calling handleBlur with a typo'd field name (e.g. "naem")
// would be a compile-time TypeScript error, not a silent no-op.`,
        explain: 'The validation logic (nameError, emailError) is byte-for-byte identical to the broken version — every change here is purely about the CONDITION controlling whether that already-correct result gets displayed.',
        explainHi: 'Validation logic (\`nameError\`, \`emailError\`) toote version se byte-for-byte identical hai — yahan har badlaav poori tarah us CONDITION ke baare mein hai jo tay karti hai ki pehle se sahi nateeja dikhta hai ya nahi.',
      },
      {
        title: 'Consolidating with useReducer and marking all fields touched on submit',
        titleHi: 'useReducer se ekjut karna aur submit par saari fields touched maark karna',
        code: `function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE": return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "BLUR": return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "TOUCH_ALL": return { ...state, touched: { name: true, email: true } };
    default: return state;
  }
}`,
        codeJs: `const initialState = {
  values: { name: "", email: "" },
  touched: { name: false, email: false },
};

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "BLUR":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "TOUCH_ALL":
      return { ...state, touched: { name: true, email: true } };
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const nameError = state.values.name.trim() === "" ? "Name is required" : null;
  const emailError = !state.values.email.includes("@") ? "Enter a valid email" : null;

  function handleSubmit(event) {
    event.preventDefault();
    dispatch({ type: "TOUCH_ALL" });
    if (nameError || emailError) return;
    // proceed with submission
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.values.name}
        onChange={(e) => dispatch({ type: "CHANGE", field: "name", value: e.target.value })}
        onBlur={() => dispatch({ type: "BLUR", field: "name" })}
      />
      {state.touched.name && nameError && <p>{nameError}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        codeTs: `interface SignupValues {
  name: string;
  email: string;
}
interface FormState {
  values: SignupValues;
  touched: Record<keyof SignupValues, boolean>;
}
type FormAction =
  | { type: "CHANGE"; field: keyof SignupValues; value: string }
  | { type: "BLUR"; field: keyof SignupValues }
  | { type: "TOUCH_ALL" };

const initialState: FormState = {
  values: { name: "", email: "" },
  touched: { name: false, email: false },
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "CHANGE":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "BLUR":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "TOUCH_ALL":
      return { ...state, touched: { name: true, email: true } };
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const nameError = state.values.name.trim() === "" ? "Name is required" : null;
  const emailError = !state.values.email.includes("@") ? "Enter a valid email" : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    dispatch({ type: "TOUCH_ALL" });
    if (nameError || emailError) return;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.values.name}
        onChange={(e) => dispatch({ type: "CHANGE", field: "name", value: e.target.value })}
        onBlur={() => dispatch({ type: "BLUR", field: "name" })}
      />
      {state.touched.name && nameError && <p>{nameError}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        outputJs: `Filling in "email" but leaving "name" untouched, then clicking
"Sign up", reveals the name error immediately — TOUCH_ALL marks every
field touched at the moment of submission, surfacing every remaining
problem at once, without requiring the user to blur each field
individually first.`,
        outputTs: `// "FormAction" is a discriminated union (the previous lesson) — an
// action missing a required field, like { type: "CHANGE", field:
// "name" } without "value", is a compile-time error, catching a typo
// in a dispatch call before it ever runs.`,
        explain: 'The reducer centralizes every possible form state transition in one place, the same argument the useReducer lesson made for a simpler flow — here scaled to a realistic multi-field form with both values and touched state coordinated together.',
        explainHi: 'Reducer har mumkin form state transition ko ek jagah ekjut karta hai, wahi dalil jo \`useReducer\` lesson ne ek saadhe flow ke liye di thi — yahan ek haqeeqi multi-field form tak scale ki gayi jahan values aur touched state dono saath coordinate hote hain.',
      },
    ],

    mistakes: [
      {
        wrong: `const nameError = name.trim() === "" ? "Name is required" : null;
return <>{nameError && <p>{nameError}</p>}</>;
// shows an error before the user has even touched the field`,
        right: `const [touched, setTouched] = useState({ name: false });
return <>{touched.name && nameError && <p>{nameError}</p>}</>;`,
        why: 'A value being invalid and a user having had a chance to fill it in correctly are two different conditions — displaying an error whenever the first is true, without checking the second, shows errors on a form the user has not even interacted with yet.',
        whyHi: 'Ek value ka invalid hona aur user ko use sahi tarike se bharne ka mauka milna do alag conditions hain — jab bhi pehli sach ho error dikhaana, doosri check kiye bina, aise form par errors dikhaata hai jise user ne abhi chuya bhi nahi.',
      },
      {
        wrong: `function handleSubmit(event) {
  event.preventDefault();
  if (nameError || emailError) return;   // blocks submission but never reveals WHY to an untouched field
}`,
        right: `function handleSubmit(event) {
  event.preventDefault();
  setTouched({ name: true, email: true });   // reveal every remaining error first
  if (nameError || emailError) return;
}`,
        why: 'Blocking submission without marking every field touched can leave a user unable to submit with no visible explanation, if the invalid field is one they never happened to blur.',
        whyHi: 'Har field ko touched maark kiye bina submission rokna user ko koi dikhta explanation ke bina submit karne se roka jaa sakta hai, agar invalid field wo hai jise unhone kabhi blur hi nahi kiya.',
      },
      {
        wrong: `const nameError = name.trim() === "" ? "Name is required" : null;
const emailError = !email.includes("@") ? "Enter a valid email" : null;
const passwordError = password.length < 8 ? "Password too short" : null;
// same three-line pattern copy-pasted for every field in every form`,
        right: `function validateName(name) { return name.trim() === "" ? "Name is required" : null; }
function validateEmail(email) { return !email.includes("@") ? "Enter a valid email" : null; }
// extracted, independently testable, reusable across forms`,
        why: 'Validation logic written inline and repeated per field is harder to test in isolation and cannot be reused by a different form that happens to need the same rule (e.g., email validation shared between login and signup).',
        whyHi: 'Inline likhi aur har field ke liye dohraayi gayi validation logic ko isolation mein test karna mushkil hai aur ise kisi doosre form dwara dobara use nahi kiya ja sakta jise samyog se wahi niyam chahiye (jaise login aur signup ke beech shared email validation).',
      },
    ],

    realWorld: [
      {
        en: '**Showing validation errors before a user has interacted with a field is a widely documented UX anti-pattern**, and usability guidelines (including Nielsen Norman Group\'s widely cited form-design research) specifically recommend deferring error display until after a field has been interacted with, exactly the touched-state pattern this lesson covers.',
        hi: '**Ek user ke kisi field se interact karne se pehle validation errors dikhaana ek achhi tarah documented UX anti-pattern hai**, aur usability guidelines (Nielsen Norman Group ke achhi tarah cite hue form-design research sameet) khaas taur par error display ko field se interact hone ke baad tak taalne ka sujhaav dete hain, bilkul is lesson wala touched-state pattern.',
      },
      {
        en: '**Form libraries like React Hook Form, Formik, and TanStack Form all implement some version of touched/dirty state tracking as a core built-in feature**, precisely because it is such a common, necessary requirement that hand-rolling it correctly in every form is real, repeated effort.',
        hi: '**React Hook Form, Formik, aur TanStack Form jaisi form libraries sab kisi na kisi roop mein touched/dirty state tracking ko core built-in feature ki tarah lagu karti hain**, bilkul isliye kyunki ye itni aam, zaruri zarurat hai ki use har form mein haath se sahi banaana asli, dohraayi jaane wali mehnat hai.',
      },
      {
        en: '**Multi-step signup wizards, checkout flows, and settings pages with dozens of fields are the most common real-world places `useReducer` is reached for over many separate `useState` calls**, since the number of related pieces of form state (values, touched, errors, and often per-step state) grows large enough that keeping them coordinated by hand becomes genuinely error-prone.',
        hi: '**Multi-step signup wizards, checkout flows, aur dus se zyada fields wali settings pages wo sabse aam asli-duniya jagah hain jahan kai alag \`useState\` calls ke bajaye \`useReducer\` uthaaya jaata hai**, kyunki form state ke jude tukdon ki sankhya (values, touched, errors, aur aksar per-step state) itni badi ho jaati hai ki unhe haath se coordinate rakhna sach mein galti-prone ban jaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a form field be genuinely invalid and yet correctly show no error message to the user at the same time?',
        qHi: 'Ek form field sach mein invalid ho sakti hai aur phir bhi user ko sahi tarike se koi error message na dikhaaye, ek hi waqt mein aisa kyun ho sakta hai?',
        a: 'Whether a value is valid and whether the user should currently be shown an error about it are two logically independent questions. A freshly-loaded form\'s empty required field is objectively invalid the instant the component first renders — the validation logic correctly identifies this — but the user has not yet had any opportunity to enter a value, so displaying an error at that moment provides no useful information and instead makes an ordinary, expected starting state look like a list of mistakes. "Touched" state answers the second, separate question — has the user interacted with this specific field yet (typically signaled by the field losing focus, an `onBlur` event) — and gating the error display on both "invalid" AND "touched" being true ensures an error is only shown once it has become relevant feedback rather than a premature judgment.',
        aHi: 'Kya value valid hai aur kya user ko abhi uske baare mein error dikhna chahiye ye do logically alag sawaal hain. Ek taaza load hue form ki khaali zaruri field component ki pehli render hote hi objectively invalid hai — validation logic ise sahi tarike se pehchaanti hai — par user ko abhi tak value daalne ka koi mauka mila hi nahi, isliye us pal error dikhaana koi kaam ki jaankaari nahi deta aur iske bajaye ek aam, ummeed ki hui shuruaati state ko galtiyon ki list jaisa dikhaata hai. "Touched" state doosra, alag sawaal ka jawaab deta hai — kya user ne is khaas field se abhi interact kiya hai (aam taur par field ka focus khona, ek \`onBlur\` event, ishara karta hai) — aur error display ko "invalid" AUR "touched" dono sach hone par gate karna pakka karta hai ki error sirf tab dikhe jab wo matlabi feedback ban chuka ho, waqt se pehle diya faisla nahi.',
      },
      {
        q: 'Why is marking every field "touched" specifically inside the submit handler necessary, even when individual `onBlur` handlers already update touched state per field?',
        qHi: 'Har field ko khaas taur par submit handler ke andar "touched" maark karna zaruri kyun hai, jabki alag-alag \`onBlur\` handlers pehle se har field ke liye touched state update karte hain?',
        a: 'Individual `onBlur` handlers only mark a field touched once the user has actually interacted with and then left that specific field — a user could fill in some fields, skip others entirely (never focusing and then blurring them), and click "Submit" without ever triggering those fields\' `onBlur` handlers. If submission were blocked due to those still-untouched invalid fields without also marking them touched, the user would see a form that silently refuses to submit with no visible indication of which field is the problem, since the corresponding error is still gated behind a `touched` flag that never got set. Marking every field touched as the first step inside the submit handler ensures that, at the specific moment a user attempts to submit, every remaining validation problem becomes visible at once, regardless of which fields the user happened to interact with individually beforehand.',
        aHi: 'Alag-alag \`onBlur\` handlers sirf tab field ko touched maark karte hain jab user ne asal mein us khaas field se interact karke use chhoda ho — ek user kuch fields bhar sakta hai, baaki poori tarah skip kar sakta hai (kabhi unhe focus karke blur na kiya ho), aur "Submit" click kar sakta hai un fields ke \`onBlur\` handlers kabhi trigger kiye bina. Agar submission un abhi bhi na-chhui invalid fields ki wajah se roka jaata bina unhe bhi touched maark kiye, user ko aisa form dikhta jo chupchap submit hone se mana kar deta bina koi dikhta ishara diye ki kaunsi field samasya hai, kyunki corresponding error abhi bhi ek \`touched\` flag ke peeche gate hai jo kabhi set hi nahi hua. Submit handler ke pehle kadam ki tarah har field ko touched maark karna pakka karta hai ki, us khaas pal jab user submit karne ki koshish karta hai, baaki bacha har validation samasya ek saath dikhta hai, chahe user ne pehle khud kaunsi fields se interact kiya ho.',
      },
      {
        q: 'When does it make sense to consolidate a multi-field form\'s values and touched state into a single `useReducer`, rather than several separate `useState` calls?',
        qHi: 'Kab samajh mein aata hai ek multi-field form ki values aur touched state ko ek akele \`useReducer\` mein ekjut karna, kai alag \`useState\` calls ke bajaye?',
        a: 'A form\'s per-field values, per-field touched flags, and often per-field errors are all facets of one coordinated process — a single form submission — updated through a small, well-defined set of possible actions (a field changing, a field being blurred, the whole form being submitted). This is exactly the profile the useReducer lesson identified as worth consolidating: related state that must be kept mutually consistent, changing through a limited set of transitions, rather than independent values with no relationship to each other. As the number of fields grows past a handful, tracking each field\'s value and touched status through separate useState calls means an ever-growing number of individual setter calls scattered across event handlers, whereas a reducer centralizes the update logic for every field into one function, using a single dispatched action per change regardless of how many fields the form has grown to include.',
        aHi: 'Form ki per-field values, per-field touched flags, aur aksar per-field errors sab ek coordinate process ke pehlu hain — ek akela form submission — mumkin actions ke ek chhote, achhi tarah defined set se update hote hue (ek field badalna, ek field blur hona, poora form submit hona). Ye bilkul wahi profile hai jise \`useReducer\` lesson ne ekjut karne laayak pehchaana — jude state jise ek doosre se sangat rakhna zaruri hai, seemit transitions ke set se badalte hue, alag values ke bajaye jinka ek doosre se koi rishta nahi. Jaise fields ki sankhya mutthi bhar se aage badhti hai, alag \`useState\` calls se har field ki value aur touched status track karna matlab event handlers mein bikhri alag setter calls ki hamesha badhti sankhya, jabki reducer har field ke liye update logic ko ek function mein ekjut karta hai, har badlaav ke liye ek akela dispatched action use karte hue chahe form kitni bhi fields tak badh gaya ho.',
      },
      {
        q: 'Why does extracting `validateEmail(email)` into its own plain function have a real practical benefit over writing the same check as an inline ternary at the point where the error is used?',
        qHi: '\`validateEmail(email)\` ko apne khud ke saadhe function mein nikaalna us jagah inline ternary ki tarah wahi check likhne par ek asli practical faayda kyun rakhta hai jahan error use hota hai?',
        a: 'A plain function taking a value and returning either an error message or null can be called and checked in complete isolation — `validateEmail("not-an-email") === "Enter a valid email"` — without needing to render any component or interact with a UI at all, the same testability benefit the useReducer lesson identified for reducer functions. It can also be reused directly by any other form that happens to need the same validation rule (a login form validating an email field does not need to duplicate the same check written inline a second time), and it reads more clearly at its point of use — `const emailError = validateEmail(email);` states the intent directly, rather than requiring a reader to parse an inline conditional expression to understand what is being checked and why.',
        aHi: 'Ek saadha function jo ek value leta hai aur ya to error message ya \`null\` lautaata hai, use poori tarah isolation mein bulaya aur check kiya ja sakta hai — \`validateEmail("not-an-email") === "Enter a valid email"\` — kisi component ko render karne ya UI se interact karne ki zarurat bilkul bina, wahi testability faayda jo \`useReducer\` lesson ne reducer functions ke liye pehchaana. Ise kisi bhi doosre form dwara seedha dobara bhi use kiya ja sakta hai jise samyog se wahi validation niyam chahiye (login form ka email field validate karna wahi check doosri baar inline likhna dohraane ki zarurat nahi), aur ye apne istemal ke pal zyada saaf padhta hai — \`const emailError = validateEmail(email);\` seedha maqsad batata hai, padhne wale ko ye samajhne ke liye ek inline conditional expression parse karne ki zarurat ke bajaye ki kya check ho raha hai aur kyun.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken SignupForm with unconditional error display. Load it fresh and confirm all three errors appear before typing anything, then type a valid name and confirm only the name error disappears while the others remain, exactly as expected from the logic alone.',
        taskHi: 'Bina shart wale error display wala toota SignupForm banao. Use taaza load karo aur confirm karo kuch bhi type kiye bina teeno errors dikhte hain, phir ek valid naam type karo aur confirm karo sirf naam wala error gayab hota hai jabki baaki rehte hain, bilkul jaisi ummeed logic akele se hai.',
        hint: 'Take a screenshot of the form immediately on load, before touching anything, to document the exact broken behavior before fixing it.',
        hintHi: 'Form ka screenshot lo turant load hone par, kuch bhi chhune se pehle, theek karne se pehle asli toota behaviour document karne ke liye.',
      },
      {
        task: 'Fix it with touched state and onBlur handlers. Confirm the form loads with no visible errors, and that blurring an empty field reveals its specific error while other untouched fields remain silent.',
        taskHi: 'Touched state aur onBlur handlers se theek karo. Confirm karo form bina kisi dikhte error ke load hota hai, aur ek khaali field ko blur karna uska khaas error saamne laata hai jabki doosri na-chhui fields chup rehti hain.',
        hint: 'Fill in one field, blur it (confirming no error since it is valid), then clear it again and blur once more, confirming the error now correctly appears since the field is both touched and invalid.',
        hintHi: 'Ek field bharo, use blur karo (confirm karo koi error nahi kyunki wo valid hai), phir use dobara khaali karo aur ek baar aur blur karo, confirm karte hue ki error ab sahi tarike se dikhta hai kyunki field touched aur invalid dono hai.',
      },
      {
        task: 'Build the useReducer version with a TOUCH_ALL action dispatched on submit. Fill in only some fields, leave others untouched, click submit, and confirm every remaining error appears at once.',
        taskHi: 'Submit par dispatch hone wale TOUCH_ALL action wala useReducer version banao. Sirf kuch fields bharo, baaki na-chhui chhodo, submit click karo, aur confirm karo baaki bacha har error ek saath dikhta hai.',
        hint: 'Add a console.log inside the reducer\'s default case to confirm an unrecognized action type is silently ignored rather than crashing, connecting back to the previous lesson\'s reducer discussion.',
        hintHi: 'Reducer ke default case ke andar ek console.log jodo confirm karne ke liye ki ek na-pehchaana action type crash hone ke bajaye chupchap nazarandaaz ho jaata hai, pichle lesson ki reducer charcha se jodte hue.',
      },
    ],

    keyTakeaways: [
      'A value being invalid and a user having had a chance to correct it are two different, independent conditions — displaying an error whenever only the first is true shows errors on a form the user has not yet interacted with.',
      '"Touched" state, typically set on a field\'s `onBlur`, tracks which fields the user has actually interacted with; gating error display on both "invalid" and "touched" being true defers errors until they represent genuinely useful feedback.',
      'Marking every field touched inside the submit handler (not just via individual `onBlur` handlers) ensures every remaining validation problem becomes visible at the moment of submission, even for fields the user never happened to blur.',
      'As a form grows past a handful of fields, consolidating values, touched flags, and errors into a single `useReducer` centralizes the update logic into one testable function, following the same reasoning the previous lesson applied to a simpler flow.',
      'Extracting each field\'s validation rule into its own plain function makes it independently testable and reusable across multiple forms needing the same rule, rather than duplicated inline at every point of use.',
      'In TypeScript, deriving `Touched` and `Errors` types from a single `Values` interface via `keyof` and `Record`/`Partial` keeps all three automatically in sync whenever a field is added or removed, rather than independently listing the same field names three times.',
    ],
    keyTakeawaysHi: [
      'Ek value ka invalid hona aur user ko use theek karne ka mauka milna do alag, na-jude conditions hain — sirf pehli sach hone par error dikhaana aise form par errors dikhaata hai jise user ne abhi interact hi nahi kiya.',
      '"Touched" state, aam taur par field ke \`onBlur\` par set hoti hai, track karti hai user ne asal mein kaunsi fields se interact kiya hai; error display ko "invalid" aur "touched" dono sach hone par gate karna errors ko tab tak taalta hai jab tak wo sach mein kaam ka feedback nahi ban jaate.',
      'Har field ko submit handler ke andar touched maark karna (sirf alag \`onBlur\` handlers se nahi) pakka karta hai ki baaki bacha har validation samasya submission ke pal dikhta hai, un fields ke liye bhi jinhe user ne kabhi blur hi nahi kiya.',
      'Jaise form mutthi bhar fields se aage badhta hai, values, touched flags, aur errors ko ek akele \`useReducer\` mein ekjut karna update logic ko ek testable function mein ekjut karta hai, pichle lesson wali wahi soch ek saadhe flow par lagu karte hue.',
      'Har field ke validation niyam ko apne khud ke saadhe function mein nikaalna use alag test karne laayak aur wahi niyam chahne wale kai forms mein dobara use hone laayak banaata hai, har istemal ke pal inline dohraane ke bajaye.',
      'TypeScript mein, \`Touched\` aur \`Errors\` types ko ek akele \`Values\` interface se \`keyof\` aur \`Record\`/\`Partial\` se nikaalna teeno ko apne aap sync mein rakhta hai jab bhi koi field jodi ya hataayi jaaye, wahi field naam teen baar alag se list karne ke bajaye.',
    ],
  },
];
