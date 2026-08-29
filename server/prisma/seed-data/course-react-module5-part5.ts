/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 5.
 *
 * React Hook Form and schema validation with Zod. This course's earlier
 * forms-at-scale lesson correctly solved the touched-state UX bug by
 * hand-rolling a useReducer-based solution — genuinely good pedagogy, but
 * it does not scale painlessly: every additional field means another
 * action type, another reducer case, another manually-wired touched key,
 * and critically, every keystroke in any field re-renders the entire
 * form component, since every field's live value lives in React state.
 * Broken example: continuing to hand-roll a growing form as more fields
 * are added, both accumulating boilerplate linearly and triggering a
 * full form re-render on every single keystroke. Fixed with React Hook
 * Form, whose registered inputs are uncontrolled by default (avoiding
 * the re-render-per-keystroke cost entirely), paired with a Zod schema
 * (the same validation library this course's Node.js curriculum already
 * teaches) via a resolver, replacing the hand-rolled reducer with a
 * single, declarative schema describing every field's rules at once.
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

export const REACT_MODULE_5_PART5: CourseLesson[] = [
  {
    slug: 'react-hook-form-zod-validation',
    title: 'React Hook Form and Schema Validation with Zod',
    titleHi: 'React Hook Form Aur Zod Se Schema Validation',
    description: 'A signup form that started with three fields grows to eleven over a few months of real feature work — and every single keystroke in any one of those eleven fields now re-renders the entire form, including the ten fields the user isn\'t even touching.',
    descriptionHi: 'Ek signup form jo teen fields se shuru hui kuch mahinon ke asli feature kaam mein gyaarah tak badh jaati hai — aur un gyaarah fields mein se kisi bhi ek mein har akela keystroke ab poore form ko dobara render karta hai, un das fields sameet jinhe user chhu bhi nahi raha.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A restaurant kitchen where the head chef personally re-checks and re-plates every single dish on every table\'s order the instant any one diner asks for so much as an extra napkin — versus a kitchen where each station handles its own dish independently, and a request at one table only ever involves that one table\'s own dish.** In the first kitchen, the moment any single diner makes any small request, the head chef treats it as a signal to re-inspect the entire order for the entire table, re-plating dishes that were already finished and perfectly fine, purely because the kitchen\'s process was never built to isolate one small change to just the part it actually affects. This might be tolerable for a table of two, but for a banquet hall serving eleven courses to a large party, re-checking and re-plating all eleven dishes every time any single guest asks for anything at all becomes a genuine, compounding waste of the kitchen\'s time and effort. The second kitchen\'s stations operate independently: a request affecting one specific dish is handled by that dish\'s own station, and every other already-prepared dish on the table sits completely undisturbed, regardless of how many other requests come in from other diners at the same table. A hand-rolled form where every field\'s value lives in one shared piece of component state is the first kitchen: a single keystroke in one field re-renders the entire component, including every other field, no matter how many fields the form has grown to include. A form built with an uncontrolled-input library is the second kitchen: each field manages its own value independently through the browser\'s own DOM, and typing in one field never disturbs any of the others, regardless of how large the form has grown.',
      hi: '**Ek restaurant kitchen jahan head chef bilkul har table ke order ki har akeli dish ko khud dobara check aur dobara plate karta hai jis pal koi ek diner ek extra napkin jitna bhi maangta hai — versus ek kitchen jahan har station apni khud ki dish akele sambhaalta hai, aur ek table par ek request sirf us ek table ki apni dish mein shaamil hoti hai.** Pehli kitchen mein, jis pal koi bhi akela diner koi bhi chhoti request karta hai, head chef ise poore table ke poore order ko dobara inspect karne ka sanket maanta hai, un dishes ko dobara plate karte hue jo pehle se poori aur bilkul theek thin, shuddh roop se isliye kyunki kitchen ka process kabhi ek chhote badlaav ko sirf us hisse tak isolate karne ke liye banaaya hi nahi gaya jise ye asal mein asar karta hai. Ye do logon ki table ke liye sahnaay ho sakta hai, par ek badi party ko gyaarah courses serve karta ek banquet hall ke liye, jis pal bhi koi akela guest kuch bhi maange sabhi gyaarah dishes ko dobara check aur dobara plate karna kitchen ke waqt aur mehanat ki ek asli, badhti barbaadi ban jaata hai. Doosri kitchen ke stations swatantra roop se kaam karte hain: ek khaas dish ko asar karti ek request us dish ke apne station dwara sambhaali jaati hai, aur table par har doosri pehle-se-taiyaar dish poori tarah na-chhedi rehti hai, us table ke doosre diners se chahe kitni bhi doosri requests aayein. Ek haath se banaaya form jahan har field ki value ek shared component state mein rehti hai pehli kitchen hai: ek field mein ek akela keystroke poore component ko dobara render karta hai, har doosri field sameet, chahe form kitni bhi fields tak badh gaya ho. Ek uncontrolled-input library se banaaya form doosri kitchen hai: har field apni value ko browser ke apne DOM ke through swatantra roop se manage karta hai, aur ek field mein type karna doosri kisi ko kabhi na-chhedta, form kitna bhi bada ho gaya ho.',
    },

    simple: `**Start broken.** A growing, hand-rolled form where every field lives in shared component state:

\`\`\`jsx
function SignupForm() {
  const [values, setValues] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", company: "",
  });

  function handleChange(field, value) {
    setValues({ ...values, [field]: value }); // re-renders the ENTIRE form on every keystroke
  }

  return (
    <form>
      <input value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input value={values.email} onChange={(e) => handleChange("email", e.target.value)} />
      <input value={values.password} onChange={(e) => handleChange("password", e.target.value)} />
      <input value={values.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
      <input value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      <input value={values.company} onChange={(e) => handleChange("company", e.target.value)} />
    </form>
  );
}
\`\`\`

This course\'s earlier forms-at-scale lesson correctly solved the touched-state display bug for a small, three-field form — but as real feature work adds field after field to a genuinely large form, two costs grow along with it. First, boilerplate: every new field needs its own entry in \`values\`, its own \`onChange\` handler wiring, its own validation rule, and (following the earlier lesson\'s pattern) its own \`touched\` flag — none of this is complicated, but it is real, repetitive work that scales linearly with field count. Second, and more subtly, every field\'s current value living in this one shared \`values\` state object means a single keystroke in \`phone\`, changing only that one field\'s value, still calls \`setValues\` with a new object, which re-renders the ENTIRE \`SignupForm\` component — every other field, every other piece of JSX inside it, all recompute on every single keystroke anywhere in the form, whether or not the user is even looking at those other fields.

**The fix: React Hook Form registers fields as uncontrolled inputs, avoiding the re-render entirely**

\`\`\`jsx
import { useForm } from "react-hook-form";

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    console.log(data); // { name, email, password, confirmPassword, phone, company }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
import { useForm } from "react-hook-form";

interface SignupFormValues {
  name: string;
  email: string;
}

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();

  function onSubmit(data: SignupFormValues): void {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`register("name", ...)\` returns a set of props (\`name\`, \`onChange\`, \`onBlur\`, \`ref\`) spread directly onto the \`<input>\` — critically, this connects the input to React Hook Form using a \`ref\`, reading its live value directly from the actual DOM node when needed, rather than storing that value in React state and re-rendering on every change the way the broken version does. Typing in the \`name\` field no longer causes \`SignupForm\` to re-render at all; React Hook Form tracks the value internally, outside React\'s own render cycle, and only triggers a re-render when something genuinely needs to change on screen (a validation error appearing, for instance). \`handleSubmit(onSubmit)\` handles gathering every field\'s current value, running validation, and only calling \`onSubmit\` if everything passes — touched-state display, submit-time validation, and the underlying values are all handled by the library, rather than a hand-written reducer.`,

    simpleHi: `**Toote hue se shuru.** Ek badhta, haath se banaaya form jahan har field shared component state mein rehta hai:

\`\`\`jsx
function SignupForm() {
  const [values, setValues] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", company: "",
  });

  function handleChange(field, value) {
    setValues({ ...values, [field]: value }); // har keystroke par POORE form ko dobara render karta hai
  }

  return (
    <form>
      <input value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input value={values.email} onChange={(e) => handleChange("email", e.target.value)} />
      <input value={values.password} onChange={(e) => handleChange("password", e.target.value)} />
      <input value={values.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
      <input value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      <input value={values.company} onChange={(e) => handleChange("company", e.target.value)} />
    </form>
  );
}
\`\`\`

Is course ka pehle wala forms-at-scale lesson sahi tarike se ek chhote, teen-field form ke liye touched-state display bug sulajhaata hai — par jaise-jaise asli feature kaam ek sach mein bade form mein field-dar-field jodta hai, do keematen iske saath badhti hain. Pehli, boilerplate: har nayi field ko \`values\` mein apni khud ki entry chahiye, apna khud ka \`onChange\` handler wiring, apna khud ka validation rule, aur (pehle wale lesson ke pattern ka palan karte hue) apna khud ka \`touched\` flag — inmein se kuch bhi complex nahi hai, par ye asli, dohraayi jaane wali mehanat hai jo field count ke saath seedhi rekha mein scale karti hai. Doosri, aur zyaada sookshm, har field ki current value is ek shared \`values\` state object mein rehna matlab hai \`phone\` mein ek akela keystroke, sirf us ek field ki value badalte hue, phir bhi ek naye object ke saath \`setValues\` bulaata hai, jo POORE \`SignupForm\` component ko dobara render karta hai — har doosri field, uske andar ka har doosra JSX ka tukda, sab dobara ganit hote hain form mein kahin bhi har akele keystroke par, chahe user un doosri fields ko dekh bhi raha ho ya nahi.

**Fix: React Hook Form fields ko uncontrolled inputs ki tarah register karta hai, re-render ko poori tarah avoid karte hue**

\`\`\`jsx
import { useForm } from "react-hook-form";

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    console.log(data); // { name, email, password, confirmPassword, phone, company }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`\`\`tsx
import { useForm } from "react-hook-form";

interface SignupFormValues {
  name: string;
  email: string;
}

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();

  function onSubmit(data: SignupFormValues): void {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

\`register("name", ...)\` props ka ek set lautaata hai (\`name\`, \`onChange\`, \`onBlur\`, \`ref\`) jo seedhe \`<input>\` par spread hota hai — bahut zaruri, ye input ko React Hook Form se ek \`ref\` istemal karke jodta hai, uski live value ko asli DOM node se seedhe padhte hue zaroorat par, us value ko React state mein rakhne aur har badlaav par dobara render karne ke bajaye jaise toota version karta hai. \`name\` field mein type karna ab \`SignupForm\` ko bilkul dobara render karne ka kaaran nahi banaata; React Hook Form value ko internally track karta hai, React ke apne render cycle se baahar, aur sirf tab dobara render trigger karta hai jab screen par asal mein kuch badalne ki zaroorat ho (ek validation error dikhna, misal ke taur par). \`handleSubmit(onSubmit)\` har field ki current value jama karna, validation chalaana, aur sirf \`onSubmit\` bulaana sab kuch pass hone par sambhaalta hai — touched-state display, submit-time validation, aur underlying values sab library dwara sambhaale jaate hain, ek haath se likhe reducer ke bajaye.`,

    content: `## Adding Zod: one declarative schema instead of scattered rules

\`\`\`jsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });
  // ...
}
\`\`\`

This course\'s Node.js curriculum already uses Zod to validate request bodies on the backend — the exact same library, and the exact same declarative style, applies identically on the frontend. Rather than \`register\`\'s own inline validation rules scattered across every input (\`required: "..."\`, a separate \`pattern\`, a separate \`minLength\`), a single Zod schema describes every field\'s rules together in one place, including rules that genuinely depend on more than one field at once (\`.refine\` checking that \`password\` and \`confirmPassword\` match, something considerably more awkward to express with \`register\`\'s own per-field rule syntax alone). \`zodResolver\` is the small adapter connecting the two libraries: it runs the Zod schema against the form\'s current values and translates any validation failures into the exact \`errors\` object shape React Hook Form already expects.

## Why registered inputs don\'t need touched-state logic written by hand

\`\`\`jsx
<input {...register("email")} />
{errors.email && <p>{errors.email.message}</p>}
\`\`\`

This course\'s earlier forms-at-scale lesson hand-built \`touched\` tracking specifically so an error would not display before a user had a genuine chance to interact with that field. React Hook Form handles this same concern internally by default: \`errors.email\` only becomes populated once a field has actually been validated according to the form\'s configured validation timing (commonly on blur, or on submit), meaning the exact same UX principle the earlier lesson built by hand — do not show an error before the user has had a chance to fill the field in — is already the library\'s default behavior, without a developer needing to write or reason about a separate \`touched\` object at all.

## When a hand-rolled reducer is still the right choice, and when a library earns its cost

\`\`\`
Small, simple form (a newsletter signup, one search box):
hand-rolled useState/useReducer is often simpler and requires no
additional dependency at all.

Large, complex form (a multi-field signup, a settings page with
dozens of fields, anything needing cross-field validation):
a library's built-in touched/error/performance handling starts
paying for the dependency it adds.
\`\`\`

Neither approach is universally correct. This course\'s earlier lesson\'s hand-rolled \`useReducer\` pattern remains entirely reasonable, and often preferable, for a small form with only a handful of fields and simple, independent validation rules — adding a library dependency for a two-field newsletter signup is genuine, unnecessary overhead. React Hook Form and a schema library like Zod earn their cost specifically once a form grows large enough, or complex enough (many fields, cross-field rules, a form appearing in multiple places needing the exact same validation), that the boilerplate and re-render cost of the hand-rolled approach becomes a genuine, measurable problem rather than a hypothetical one.

## TypeScript: inferring the form\'s type directly from the Zod schema

\`\`\`tsx
const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type SignupFormValues = z.infer<typeof signupSchema>;
// { name: string; email: string } — derived automatically, never written by hand

const { register, handleSubmit } = useForm<SignupFormValues>({
  resolver: zodResolver(signupSchema),
});
\`\`\`

\`z.infer<typeof signupSchema>\` (this course\'s TypeScript curriculum\'s treatment of \`keyof\` and mapped types, applied here to Zod specifically) derives a precise TypeScript type directly from the schema itself, rather than a developer writing a separate \`interface SignupFormValues\` by hand and needing to keep it manually synchronized with the schema every time a field is added or changed. Passing this inferred type to \`useForm<SignupFormValues>\` means \`register\`\'s own field-name argument is type-checked against the schema\'s actual fields — attempting to \`register("full_name")\` when the schema only defines \`name\` is a compile-time error, catching a typo before it ever reaches a running form.`,

    contentHi: `## Zod jodna: bikhre hue niyamon ke bajaye ek declarative schema

\`\`\`jsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });
  // ...
}
\`\`\`

Is course ka Node.js curriculum pehle se Zod istemal karta hai backend par request bodies validate karne ke liye — bilkul wahi library, aur bilkul wahi declarative style, frontend par identical roop se lagu hoti hai. \`register\` ke apne inline validation rules ke har input mein bikhre hone ke bajaye (\`required: "..."\`, ek alag \`pattern\`, ek alag \`minLength\`), ek akela Zod schema har field ke niyam ek saath ek jagah darsata hai, un niyamon sameet jo sach mein ek se zyaada field par ek saath nirbhar karte hain (\`.refine\` check karte hue ki \`password\` aur \`confirmPassword\` match karte hain, kuch aisa jise \`register\` ke apne prati-field rule syntax akele se express karna kaafi zyaada asuvidhajanak hai). \`zodResolver\` chhota adapter hai jo dono libraries ko jodta hai: ye Zod schema ko form ki current values ke khilaaf chalaata hai aur kisi bhi validation failures ko bilkul us \`errors\` object shape mein translate karta hai jo React Hook Form pehle se ummeed karta hai.

## Registered inputs ko haath se likhi touched-state logic ki zaroorat kyun nahi

\`\`\`jsx
<input {...register("email")} />
{errors.email && <p>{errors.email.message}</p>}
\`\`\`

Is course ka pehle wala forms-at-scale lesson khaas taur par isliye haath se \`touched\` tracking banaata hai taaki ek error tab tak na dikhe jab tak user ko us field se interact karne ka asli mauka na mila ho. React Hook Form isi chinta ko by default internally sambhaalta hai: \`errors.email\` sirf tab bhari jaati hai jab ek field ko asal mein form ki configure ki gayi validation timing (aam taur par blur par, ya submit par) ke hisaab se validate kiya gaya ho, matlab bilkul wahi UX siddhaant jo pehle wale lesson ne haath se banaaya — user ko field bharne ka mauka milne se pehle error mat dikhaao — pehle se library ka default vyavhaar hai, ek developer ko ek alag \`touched\` object likhne ya uske baare mein sochne ki zaroorat bilkul bina.

## Kab ek haath se banaaya reducer abhi bhi sahi chunaav hai, aur kab ek library apni keemat kamaati hai

\`\`\`
Chhota, saadha form (ek newsletter signup, ek search box):
haath se banaaya useState/useReducer aksar zyaada saadha hai aur
koi additional dependency bilkul zaroori nahi.

Bada, complex form (ek multi-field signup, dazanon fields wali
ek settings page, cross-field validation chahiye kuch bhi):
ek library ka built-in touched/error/performance handling us
dependency ke liye kamaana shuru karta hai jo ye jodta hai.
\`\`\`

Koi bhi tarika sarvavyaapi roop se sahi nahi hai. Is course ke pehle wale lesson ka haath se banaaya \`useReducer\` pattern poori tarah samajhdaar rehta hai, aur aksar behtar, mutthi bhar fields aur saadhe, swatantra validation niyamon wale ek chhote form ke liye — ek do-field newsletter signup ke liye ek library dependency jodna asli, bekaar overhead hai. React Hook Form aur Zod jaisi ek schema library apni keemat khaas taur par tab kamaate hain jab ek form itna bada, ya itna complex ho jaata hai (kai fields, cross-field niyam, ek form jo kai jagah dikhta hai bilkul wahi validation chahne wale), ki haath se banaaye tarike ki boilerplate aur re-render keemat ek asli, naapa-jaane-laayak samasya ban jaati hai ek kalpaniya ke bajaye.

## TypeScript: form ka type seedhe Zod schema se nikaalna

\`\`\`tsx
const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type SignupFormValues = z.infer<typeof signupSchema>;
// { name: string; email: string } — automatically nikaala gaya, kabhi haath se nahi likha

const { register, handleSubmit } = useForm<SignupFormValues>({
  resolver: zodResolver(signupSchema),
});
\`\`\`

\`z.infer<typeof signupSchema>\` (is course ka TypeScript curriculum \`keyof\` aur mapped types ke saath jo tarika istemal karta hai, yahaan Zod par khaas taur par lagu) ek sateek TypeScript type seedhe schema se hi nikaalta hai, ek developer ke ek alag \`interface SignupFormValues\` haath se likhne aur ise schema ke saath manually synchronized rakhne ki zaroorat ke bajaye har baar jab ek field jodi ya badli jaaye. Is nikaale gaye type ko \`useForm<SignupFormValues>\` ko dena matlab hai \`register\` ka apna field-name argument schema ki asli fields ke khilaaf type-check hota hai — \`register("full_name")\` karne ki koshish jab schema sirf \`name\` define karta hai ek compile-time error hai, ek typo ko ise kabhi ek chalte form tak pahunchne se pehle pakadte hue.`,

    examples: [
      {
        title: 'Broken: a growing hand-rolled form re-renders entirely on every keystroke',
        titleHi: 'Toota: ek badhta haath se banaaya form har keystroke par poori tarah dobara render hota hai',
        code: `const [values, setValues] = useState({ name: "", email: "", phone: "", company: "" });
function handleChange(field, value) {
  setValues({ ...values, [field]: value }); // re-renders the whole form
}`,
        codeJs: `function SignupForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "" });

  function handleChange(field, value) {
    setValues({ ...values, [field]: value });
  }

  return (
    <form>
      <input value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input value={values.email} onChange={(e) => handleChange("email", e.target.value)} />
      <input value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      <input value={values.company} onChange={(e) => handleChange("company", e.target.value)} />
    </form>
  );
}
// typing one character in "phone" re-renders name, email, and company's inputs too`,
        codeTs: `interface SignupValues {
  name: string;
  email: string;
  phone: string;
  company: string;
}

function SignupForm() {
  const [values, setValues] = useState<SignupValues>({ name: "", email: "", phone: "", company: "" });

  function handleChange(field: keyof SignupValues, value: string): void {
    setValues({ ...values, [field]: value });
  }

  return (
    <form>
      <input value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input value={values.email} onChange={(e) => handleChange("email", e.target.value)} />
      <input value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      <input value={values.company} onChange={(e) => handleChange("company", e.target.value)} />
    </form>
  );
}
// Correctly typed, completely valid TypeScript — the re-render cost is
// architectural, not a type error.`,
        output: `The form works correctly. Using React DevTools' render highlighting,
every field's input visibly flashes on every single keystroke in any
one of them, confirming the entire component re-renders each time.`,
        explain: 'Every field\'s value lives in one shared state object, so any single field changing triggers a re-render of the entire component, including every other field.',
        explainHi: 'Har field ki value ek shared state object mein rehti hai, isliye koi bhi akeli field badalna poore component ka ek dobara render trigger karta hai, har doosri field sameet.',
      },
      {
        title: 'Fixed: React Hook Form avoids the re-render with uncontrolled, registered inputs',
        titleHi: 'Theek: React Hook Form uncontrolled, registered inputs se re-render avoid karta hai',
        code: `const { register, handleSubmit } = useForm();
<input {...register("name")} />
<input {...register("email")} />`,
        codeJs: `import { useForm } from "react-hook-form";

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}
      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register("phone")} />
      <input {...register("company")} />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        codeTs: `import { useForm } from "react-hook-form";

interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
}

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();

  function onSubmit(data: SignupFormValues): void {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <p>{errors.name.message}</p>}
      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register("phone")} />
      <input {...register("company")} />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        outputJs: `With React DevTools' render highlighting on, typing in "phone" no
longer causes any other field to flash — only the specific field
being typed in updates, and even that field's own re-render is
minimized by the library.`,
        outputTs: `// Identical behaviour. "errors" is correctly typed as
// FieldErrors<SignupFormValues>, so errors.name.message is only
// accessible for field names that genuinely exist on the interface.`,
        explain: 'register connects each input to the library via a ref rather than React state, so typing updates the DOM node directly without triggering a React re-render of the surrounding form.',
        explainHi: '\`register\` har input ko library se ek \`ref\` ke zariye jodta hai React state ke bajaye, isliye type karna DOM node ko seedhe update karta hai aas-paas ke form ka ek React re-render trigger kiye bina.',
      },
      {
        title: 'Adding Zod validation via zodResolver, including a cross-field rule',
        titleHi: '\`zodResolver\` ke zariye Zod validation jodna, ek cross-field rule sameet',
        code: `const schema = z.object({ password: z.string().min(8), confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { message: "Must match", path: ["confirmPassword"] });
useForm({ resolver: zodResolver(schema) });`,
        codeJs: `import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("password")} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      <input {...register("confirmPassword")} type="password" />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        codeTs: `import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupFormValues): void {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("password")} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      <input {...register("confirmPassword")} type="password" />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        outputJs: `Typing mismatched passwords and blurring confirmPassword shows
"Passwords must match" — a rule that depends on two fields at once,
expressed once in the schema rather than in per-field register rules.`,
        outputTs: `// Identical behaviour. SignupFormValues is inferred directly from
// signupSchema via z.infer — adding a field to the schema
// automatically updates the type everywhere it's used.`,
        explain: 'The refine rule genuinely needs both fields\' values at once to check — this is considerably more natural to express in one shared schema than by trying to coordinate two separate per-field register rules.',
        explainHi: '\`refine\` rule ko check karne ke liye asal mein dono fields ki values ek saath chahiye — ise ek shared schema mein express karna do alag prati-field \`register\` rules ko coordinate karne ki koshish karne se kaafi zyaada saral hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const [values, setValues] = useState({ a: "", b: "", c: "", d: "", e: "", f: "", g: "" });
// a form with seven-plus fields, every keystroke re-rendering all of them`,
        right: `const { register } = useForm();
// registered inputs update independently, without re-rendering the whole form`,
        why: 'A form with many fields, all living in one shared state object, re-renders entirely on every keystroke in any field — a cost that compounds as the field count grows.',
        whyHi: 'Kai fields wala ek form, sab ek shared state object mein rehte hue, kisi bhi field mein har keystroke par poori tarah dobara render hota hai — ek keemat jo field count badhne ke saath jama hoti hai.',
      },
      {
        wrong: `<input {...register("password")} />
<input {...register("confirmPassword")} onBlur={() => {
  if (getValues("password") !== getValues("confirmPassword")) { /* manual cross-field check */ }
}} />`,
        right: `const schema = z.object({ password: z.string(), confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { message: "Must match", path: ["confirmPassword"] });`,
        why: 'Hand-wiring a cross-field check through individual field event handlers is more error-prone and harder to read than expressing the same rule once in a schema\'s refine step.',
        whyHi: 'Ek cross-field check ko alag-alag field event handlers ke through haath se jodna ek schema ke \`refine\` step mein wahi rule ek baar express karne se zyaada galti-prone aur padhna mushkil hai.',
      },
      {
        wrong: `// Reaching for React Hook Form and Zod for a single-field newsletter signup
const { register, handleSubmit } = useForm({ resolver: zodResolver(z.object({ email: z.string().email() })) });`,
        right: `const [email, setEmail] = useState("");
const error = !email.includes("@") ? "Enter a valid email" : null;
// a single field with one simple rule doesn't need a library dependency at all`,
        why: 'Adding a form library and a schema library for a trivially small form is unnecessary overhead — the pattern earns its cost specifically once a form grows large or genuinely complex.',
        whyHi: 'Ek mamuli chhote form ke liye ek form library aur ek schema library jodna bekaar overhead hai — pattern apni keemat khaas taur par tab kamaata hai jab ek form bada ya sach mein complex ho jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**React Hook Form is one of the most widely adopted form libraries in the React ecosystem**, specifically citing its uncontrolled-input, minimal-re-render design as a primary reason teams adopt it for forms of real size.',
        hi: '**React Hook Form React ecosystem mein sabse vyaapak roop se apnaayi jaane waali form libraries mein se ek hai**, khaas taur par apne uncontrolled-input, minimal-re-render design ko ek mukhya wajah ki tarah cite karte hue jis se teams ise asli size ke forms ke liye apnaati hain.',
      },
      {
        en: '**Zod\'s integration with React Hook Form via a dedicated resolver package is a commonly recommended pairing**, letting teams reuse the exact same validation library and mental model across both their Node.js backend and React frontend.',
        hi: '**React Hook Form ke saath Zod ka ek dedicated resolver package ke zariye integration ek aam taur par recommend ki jaane waali jodi hai**, teams ko bilkul wahi validation library aur mental model apne Node.js backend aur React frontend dono mein dobara istemal karne dete hue.',
      },
      {
        en: '**Multi-step signup wizards, checkout flows, and settings pages with dozens of fields are the most commonly cited real-world use cases justifying a dedicated form library**, since the boilerplate and re-render costs of a hand-rolled solution grow significantly at that scale.',
        hi: '**Multi-step signup wizards, checkout flows, aur dazanon fields wali settings pages ek dedicated form library ko justify karti sabse aam taur par cite ki jaane waali asli-duniya use cases hain**, kyunki haath se banaaye solution ki boilerplate aur re-render keematen us scale par kaafi badhti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does typing in one field of a hand-rolled form built with useState cause every other field to re-render, and why does React Hook Form avoid this?',
        qHi: '\`useState\` se banaaye haath-se-banaaye form ki ek field mein type karna doosri har field ko dobara render karne ka kaaran kyun banaata hai, aur React Hook Form ise kyun avoid karta hai?',
        a: 'When a form\'s field values all live inside one shared state object managed by useState, calling the corresponding setter function with any updated value — even a change to just one specific field — creates a new state object and triggers React\'s standard re-render behavior for the component that owns that state. React has no way to know, and no built-in mechanism to express, that only one specific piece of that state object actually changed and that only the JSX depending specifically on that one piece needs to be recomputed; by default, the entire component function re-executes, and every element within its returned JSX, including inputs bound to completely unrelated fields, gets re-evaluated as part of that same render pass. React Hook Form avoids this entirely by not storing each field\'s live value in React state at all. Instead, register connects each input to the DOM via a ref, and the library reads and tracks each field\'s current value by interacting directly with the actual DOM node — the browser\'s own native input element already holds and updates its own value as a user types, entirely independent of React\'s render cycle, and React Hook Form simply reads from that existing browser behavior rather than duplicating the value into React state and forcing a re-render on every change. This means typing in one field only involves the browser\'s own native, highly optimized input-handling behavior, with React\'s render cycle staying completely uninvolved until something genuinely requires a UI update, such as a validation error needing to be displayed.',
        aHi: 'Jab ek form ki field values sab ek shared state object ke andar rehti hain jise \`useState\` manage karta hai, mutaalliq setter function ko kisi bhi updated value ke saath bulaana — chahe sirf ek khaas field mein badlaav ho — ek naya state object banaata hai aur us component ke liye React ka standard re-render vyavhaar trigger karta hai jo us state ka maalik hai. React ke paas ye jaanne ka koi tarika nahi hai, aur ye express karne ka koi built-in mechanism nahi hai, ki us state object ka sirf ek khaas hissa asal mein badla aur sirf us ek hisse par nirbhar JSX ko dobara ganit karne ki zaroorat hai; by default, poora component function dobara execute hota hai, aur uske lautaaye JSX ke andar har element, poori tarah na-judi fields se juday inputs sameet, us wahi render pass ke hisse ki tarah dobara evaluate hota hai. React Hook Form ise poori tarah avoid karta hai har field ki live value ko React state mein bilkul na rakhkar. Iske bajaye, \`register\` har input ko DOM se ek \`ref\` ke zariye jodta hai, aur library har field ki current value ko asli DOM node se seedhe interact karke track karti hai — browser ka apna native input element pehle se apni khud ki value rakhta aur update karta hai jab ek user type karta hai, React ke render cycle se poori tarah swatantra, aur React Hook Form bas us maujood browser vyavhaar se padhta hai value ko React state mein duplicate karne aur har badlaav par ek re-render majboor karne ke bajaye. Iska matlab hai ek field mein type karna sirf browser ke apne native, bahut optimized input-handling vyavhaar ko shaamil karta hai, React ka render cycle poori tarah bina-shaamil rehta hai jab tak kuch sach mein ek UI update ki zaroorat na ho, jaise ek validation error dikhaane ki zaroorat.',
      },
      {
        q: 'Why does expressing a cross-field validation rule (like matching passwords) in a Zod schema\'s refine step scale better than hand-wiring it through individual field event handlers?',
        qHi: 'Ek Zod schema ke \`refine\` step mein ek cross-field validation rule (jaise matching passwords) express karna alag-alag field event handlers ke through haath se jodne se behtar scale kyun karta hai?',
        a: 'A validation rule that genuinely depends on more than one field\'s value at once — confirming two password fields match, ensuring an end date falls after a start date — does not fit naturally into a validation mechanism scoped to a single field in isolation, since checking the rule correctly requires reading the current value of at least one OTHER field beyond the one currently being validated. Attempting to hand-wire this through individual field event handlers means, for a passwords-must-match rule specifically, deciding which field\'s handler is actually responsible for the check (the confirmPassword field checking against password, or vice versa, or possibly both, to handle either field being edited after the other), manually reading the other field\'s current value at the right moment, and manually managing where the resulting error message should display — logic that is easy to get subtly wrong (checking at the wrong moment, missing the case where the ALREADY-validated field changes after the other one is filled in) and difficult for someone else reading the code to quickly locate, since the actual rule\'s logic is not written in one obvious place. A Zod schema\'s refine method is built specifically to express exactly this kind of rule: it runs against the entire parsed set of field values at once, after each individual field\'s own rules have already passed, and can read as many of those field values together as the rule genuinely requires, with the message and path options directly specifying which field\'s error the resulting message should be associated with. This means the complete rule — what is being compared, under what condition it fails, and where the resulting error should appear — lives in exactly one place, readable as a single, self-contained statement, rather than being reconstructed by tracing through multiple separate event handlers to understand how they cooperate to enforce one shared rule.',
        aHi: 'Ek validation rule jo asal mein ek se zyaada field ki value par ek saath nirbhar karta hai — do password fields ke match hone ki pushti karna, ye sunishchit karna ki ek end date ek start date ke baad aaye — ek akele field tak akele scoped validation mechanism mein prakritik roop se fit nahi hota, kyunki rule ko sahi tarike se check karne ke liye kam-se-kam ek DOOSRI field ki current value padhni maangti hai us se aage jo abhi validate ki jaa rahi hai. Ise alag-alag field event handlers ke through haath se jodne ki koshish karna matlab hai, khaas taur par ek passwords-must-match rule ke liye, ye faisla karna ki kaunsi field ka handler asal mein check ke liye zimmedaar hai (\`confirmPassword\` field \`password\` ke khilaaf check karti hai, ya ulta, ya sambhaavit roop se dono, doosre ke baad edit hui ek field ko sambhaalne ke liye), sahi pal par doosri field ki current value ko manually padhna, aur manmaani taur par manage karna ki natijaa error message kahaan dikhna chahiye — logic jise sookshm roop se galat karna aasaan hai (galat pal par check karna, us case ko miss karna jahan PEHLE-SE-VALIDATE ki gayi field doosri bhar jaane ke baad badalti hai) aur code padh rahe kisi doosre ke liye jaldi dhoondhna mushkil, kyunki asli rule ki logic ek dikhti jagah likhi nahi hai. Ek Zod schema ka \`refine\` method khaas taur par bilkul is tarah ka rule express karne ke liye banaaya gaya hai: ye poori parsed field values ke set ke khilaaf ek saath chalta hai, har akeli field ke apne niyam pehle se pass ho chuke hone ke baad, aur un field values mein se jitni bhi rule ko asal mein chahiye ek saath padh sakta hai, \`message\` aur \`path\` options seedhe darsaate hue ki natijaa message kis field ki error se juda hona chahiye. Iska matlab hai poora rule — kya compare kiya jaa raha hai, kis sthiti mein ye fail hota hai, aur natijaa error kahaan dikhna chahiye — bilkul ek jagah rehta hai, ek akele, khud-mein-poore statement ki tarah padhne-laayak, kai alag event handlers ke through track karke dobara banaaya jaane ke bajaye ye samajhne ke liye ki wo kaise ek shared rule lagu karne ke liye milkar kaam karte hain.',
      },
      {
        q: 'How does deriving a form\'s TypeScript type via z.infer<typeof schema> keep a Zod schema and its corresponding form values type from drifting apart as fields are added or changed?',
        qHi: '\`z.infer<typeof schema>\` ke zariye ek form ka TypeScript type nikaalna ek Zod schema aur uski mutaalliq form values type ko fields jodne ya badalne par ek doosre se bekhabar hone se kaise rokta hai?',
        a: 'If a form\'s TypeScript type were written entirely independently of its Zod validation schema — a developer manually authoring a separate interface SignupFormValues alongside a separate z.object schema, both describing the same conceptual set of fields — nothing about the language or tooling would inherently keep these two independently-written descriptions in agreement with each other going forward. Adding a new field to the schema, renaming an existing field, or changing a field\'s type would each require the developer to separately remember to make the identical change in the hand-written interface as well, and forgetting to update one while updating the other produces a type that either falsely promises a field exists when the schema no longer validates it, or fails to reflect a field the schema genuinely expects, in either case undermining the actual value TypeScript is meant to provide. z.infer<typeof schema> eliminates this risk structurally by deriving the type directly from the schema\'s own structure at compile time, rather than requiring a second, independently-maintained description of the same fields — the interface effectively becomes "whatever fields and types this specific schema object currently declares," which is automatically and immediately correct the moment the schema itself is correct, since there is no second artifact that could fall out of sync with it. This means changing the schema — adding a field, adjusting a validation rule\'s type implications, removing something no longer needed — automatically and immediately updates the inferred type everywhere it is used, including surfacing a compile-time error at every place in the code that now needs to be updated to match, rather than silently continuing to type-check against a stale, hand-maintained definition that no longer reflects what the schema actually validates.',
        aHi: 'Agar ek form ka TypeScript type poori tarah uski Zod validation schema se swatantra likha jaata — ek developer manually ek alag \`interface SignupFormValues\` ek alag \`z.object\` schema ke saath likhta, dono usi conceptual fields ke set ko darsaate hue — language ya tooling ke baare mein kuch bhi buniyaadi taur par in do swatantra-likhi descriptions ko aage badhte hue ek doosre se sehmat nahi rakhega. Schema mein ek nayi field jodna, ek maujooda field ka naam badalna, ya ek field ka type badalna har ek developer ko alag se yaad rakhne ki maang karega ki haath-se-likhe interface mein bhi identical badlaav kare, aur ek ko update karte waqt doosre ko update karna bhoolna ek aisa type paida karta hai jo ya to jhoothe roop se vaada karta hai ek field maujood hai jab schema ab use validate nahi karti, ya ek field ko reflect karne mein fail hota hai jise schema asal mein chahta hai, dono maamlon mein wo asli keemat kamzor karte hue jise TypeScript dene ke liye hai. \`z.infer<typeof schema>\` is khatre ko structurally khatam karta hai type ko seedhe schema ki apni structure se compile time par nikaal kar, usi fields ka ek doosra, swatantra-roop-se-maintain-kiya description maangne ke bajaye — interface asar mein "jo bhi fields aur types ye khaas schema object abhi declare karta hai" ban jaata hai, jo automatically aur turant sahi hai jis pal schema khud sahi hai, kyunki koi doosra artifact nahi hai jo isse bekhabar ho sake. Iska matlab hai schema badalna — ek field jodna, ek validation rule ke type implications adjust karna, koi cheez hataana jiski ab zaroorat nahi — automatically aur turant nikaale gaye type ko har jagah update karta hai jahan ye istemal hota hai, code mein har jagah ek compile-time error zaahir karte hue jise ab match karne ke liye update karne ki zaroorat hai, chupke se ek purani, haath-se-maintain-ki-gayi definition ke khilaaf type-check karte rehne ke bajaye jo ab schema asal mein kya validate karti hai use reflect nahi karti.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken, growing hand-rolled SignupForm with at least six fields sharing one state object. Using React DevTools\' render highlighting, confirm every field visibly re-renders when typing in just one of them.',
        taskHi: 'Kam-se-kam chhe fields ek state object share karti toota, badhta haath-se-banaaya \`SignupForm\` banao. React DevTools ki render highlighting istemal karke, confirm karo ki har field dikhti taur par dobara render hoti hai jab sirf ek mein type kiya jaata hai.',
        hint: 'React DevTools\' Profiler or the "Highlight updates when components render" setting makes re-renders visually obvious without needing to add manual logging.',
        hintHi: 'React DevTools ka Profiler ya "Highlight updates when components render" setting re-renders ko visually saaf banaata hai manual logging jodne ki zaroorat bina.',
      },
      {
        task: 'Rebuild the same six-field form using React Hook Form\'s register and handleSubmit, with no Zod yet. Confirm with the same DevTools highlighting that typing in one field no longer causes the others to re-render.',
        taskHi: 'Wahi chhe-field form React Hook Form ke \`register\` aur \`handleSubmit\` istemal karke dobara banao, abhi Zod bina. Wahi DevTools highlighting se confirm karo ki ek field mein type karna ab doosron ko dobara render karne ka kaaran nahi banaata.',
        hint: 'If you still see every field flashing, double-check that each input uses {...register("fieldName")} rather than a manually-wired value and onChange.',
        hintHi: 'Agar tumhe abhi bhi har field flash hoti dikhe, dobara check karo ki har input \`{...register("fieldName")}\` istemal karta hai ek manually-wired \`value\` aur \`onChange\` ke bajaye.',
      },
      {
        task: 'Add a Zod schema with zodResolver, including a refine rule requiring two fields to match (e.g. password and confirmPassword). Confirm the cross-field error appears and disappears correctly as the fields are edited.',
        taskHi: 'Ek Zod schema jodo \`zodResolver\` ke saath, ek \`refine\` rule sameet jo do fields ke match hone ki maang karta hai (jaise \`password\` aur \`confirmPassword\`). Confirm karo ki cross-field error sahi tarike se dikhta aur gayab hota hai jaise fields edit ki jaati hain.',
        hint: 'Test editing the first password field again after both already match, to confirm the error correctly reappears if that edit breaks the match.',
        hintHi: 'Dono ke match hone ke baad pehli password field ko dobara edit karne ki koshish karo, confirm karne ke liye ki agar wo edit match todta hai to error sahi tarike se dobara dikhta hai.',
      },
    ],

    keyTakeaways: [
      'A hand-rolled form where every field lives in one shared state object re-renders the entire component on every single keystroke, a cost that grows as the field count grows — this course\'s earlier useReducer lesson solved the UX problem but not this performance one.',
      'React Hook Form\'s register connects inputs via a ref rather than React state, so typing in a field updates the DOM directly without triggering a re-render of the surrounding form.',
      'A Zod schema describes every field\'s validation rules declaratively in one place, including cross-field rules (via .refine) that are considerably harder to express correctly through scattered, per-field event handlers.',
      'zodResolver is the adapter connecting React Hook Form to a Zod schema, translating the schema\'s validation results into the errors shape React Hook Form already expects.',
      'React Hook Form handles touched-state display by default, achieving the same UX principle this course\'s earlier lesson built by hand — not showing an error before the user has had a chance to fill in a field.',
      'Neither a hand-rolled reducer nor a form library is universally correct — a small, simple form often does not need the added dependency, while a large or genuinely complex form is where the library\'s cost is earned.',
    ],
    keyTakeawaysHi: [
      'Ek haath-se-banaaya form jahan har field ek shared state object mein rehta hai poore component ko har akele keystroke par dobara render karta hai, ek keemat jo field count badhne ke saath badhti hai — is course ka pehle wala \`useReducer\` lesson UX samasya sulajhaata hai par ye performance wali nahi.',
      'React Hook Form ka \`register\` inputs ko ek \`ref\` ke zariye jodta hai React state ke bajaye, isliye ek field mein type karna DOM ko seedhe update karta hai aas-paas ke form ka re-render trigger kiye bina.',
      'Ek Zod schema har field ke validation rules declaratively ek jagah darsata hai, cross-field rules sameet (\`.refine\` ke zariye) jo bikhre, prati-field event handlers ke through sahi tarike se express karna kaafi zyaada mushkil hain.',
      '\`zodResolver\` wo adapter hai jo React Hook Form ko ek Zod schema se jodta hai, schema ke validation natijon ko us \`errors\` shape mein translate karte hue jo React Hook Form pehle se ummeed karta hai.',
      'React Hook Form by default touched-state display sambhaalta hai, wahi UX siddhaant haasil karte hue jo is course ka pehle wala lesson haath se banaata hai — user ko ek field bharne ka mauka milne se pehle ek error na dikhaana.',
      'Na haath-se-banaaya reducer na form library sarvavyaapi roop se sahi hai — ek chhota, saadha form aksar additional dependency ki zaroorat nahi rakhta, jabki ek bada ya sach mein complex form wahaan hai jahan library ki keemat kamaayi jaati hai.',
    ],
  },
];
