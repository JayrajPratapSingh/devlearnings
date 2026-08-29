/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 6.
 *
 * Multi-step wizard forms and dynamic field arrays, the two most common
 * "large form" patterns in real products (checkout, onboarding, a job
 * application) that this course's earlier forms lessons have not yet
 * covered. Broken example: a naive multi-step wizard where each step is
 * its own component holding its own local useState — the moment a user
 * navigates from step 2 back to step 1, step 1's component remounts with
 * fresh, empty state, silently discarding everything they originally
 * entered. Fixed by lifting the form into a single shared React Hook
 * Form instance (this course's previous lesson) that persists for the
 * entire wizard's lifetime, with each step rendering only its own subset
 * of fields from that one shared instance, plus validating only the
 * current step's fields on "Next" rather than the whole form at once.
 * Also covers useFieldArray for a genuinely dynamic, repeating section
 * (adding or removing phone numbers, line items) — including why its
 * own stable field.id, not an array index, must be used as each row's
 * React key.
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

export const REACT_MODULE_5_PART6: CourseLesson[] = [
  {
    slug: 'multi-step-forms-dynamic-field-arrays',
    title: 'Multi-Step Wizard Forms and Dynamic Field Arrays',
    titleHi: 'Multi-Step Wizard Forms Aur Dynamic Field Arrays',
    description: 'A user carefully fills out a three-step signup wizard\'s shipping address, moves on to payment, notices a typo, clicks "Back" to fix it — and finds the entire address form sitting completely empty, as if they had never typed anything at all.',
    descriptionHi: 'Ek user ek teen-step signup wizard ka shipping address savdhaani se bharta hai, payment tak aage badhta hai, ek typo notice karta hai, use theek karne ke liye "Back" click karta hai — aur poora address form bilkul khaali baitha paata hai, jaise unhone kabhi kuch type kiya hi na ho.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A government office where a single physical case file physically travels with an applicant from the photo desk to the document-check desk to the biometrics desk, each station adding to the same file — versus an office where each desk keeps its own separate scrap of paper and throws it away the moment the applicant moves to the next desk.** In the well-run office, if the biometrics desk sends an applicant back to the document-check desk because something needs correcting, the same case file is still sitting right there with everything the applicant already submitted, genuinely unchanged — the correction is made to the existing file, and the applicant does not need to redo anything they already completed correctly. In the broken office, the document-check desk\'s own scrap of paper was already thrown in the bin the moment the applicant walked over to biometrics, so when they are sent back to fix something, that desk has nothing at all on record — the applicant has to start completely over, re-answering every question, re-submitting every document, purely because of how that specific desk chose to (not) hold onto its own notes. A multi-step wizard where each step is a separate component holding its own local state is the broken office: navigating away unmounts that step\'s component, and its local state, including everything the user already entered, is discarded the instant that happens. A wizard built around one shared form instance that persists for the entire flow is the well-run office: the same underlying "case file" travels with the user from step to step, and moving backward to fix something never requires starting over, because the data was never tied to any one step\'s own temporary existence in the first place.',
      hi: '**Ek government office jahan ek akeli physical case file physically ek applicant ke saath photo desk se document-check desk se biometrics desk tak jaati hai, har station usi file mein jodte hue — versus ek office jahan har desk apna khud ka alag kaagaz ka tukda rakhta hai aur use uss pal phenk deta hai jab applicant agle desk par jaata hai.** Achhi tarah chalte office mein, agar biometrics desk ek applicant ko document-check desk par wapas bhejta hai kyunki kuch theek karna hai, wahi case file abhi bhi wahaan baithi hai us sab kuch ke saath jo applicant ne pehle submit kiya tha, sach mein na-badla — sudhaar maujooda file mein kiya jaata hai, aur applicant ko kuch bhi dobara nahi karna padta jo unhone pehle se sahi tarike se poora kiya tha. Toote office mein, document-check desk ka apna kaagaz ka tukda usi pal kachre mein daal diya gaya jab applicant biometrics ki taraf chala gaya, isliye jab unhe kuch theek karne ke liye wapas bheja jaata hai, us desk ke paas record mein kuch bhi nahi hai — applicant ko poori tarah dobara shuru karna padta hai, har sawaal ka dobara jawaab dena, har document dobara submit karna, shuddh roop se is wajah se ki us khaas desk ne apne notes ko rakhne ka (nahi) chunaav kaise kiya. Ek multi-step wizard jahan har step apni khud ki local state rakhta ek alag component hai toota office hai: door jaana us step ke component ko unmount karta hai, aur uski local state, user ne pehle se jo kuch bhi enter kiya us sameet, wo hote hi hataayi jaati hai. Ek wizard jo ek shared form instance ke aas-paas banaaya gaya hai jo poori flow ke liye tikta hai achhi tarah chalta office hai: wahi underlying "case file" user ke saath step-dar-step jaati hai, aur kuch theek karne ke liye peeche jaana kabhi dobara shuru karne ki maang nahi karta, kyunki data kabhi bhi shuru se kisi ek step ke apne asthaayi astitva se bandha hua tha hi nahi.',
    },

    simple: `**Start broken.** Each wizard step holds its own local state, discarded when the step unmounts:

\`\`\`jsx
function ShippingStep({ onNext }) {
  const [address, setAddress] = useState(""); // lives ONLY inside this component

  return (
    <div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={() => onNext({ address })}>Next</button>
    </div>
  );
}

function SignupWizard() {
  const [step, setStep] = useState(1);

  if (step === 1) return <ShippingStep onNext={() => setStep(2)} />;
  if (step === 2) return <PaymentStep onBack={() => setStep(1)} />; // ShippingStep unmounts here
}
\`\`\`

The moment \`step\` changes from \`1\` to \`2\`, React unmounts \`ShippingStep\` entirely — it is no longer rendered anywhere — and its \`useState("")\` for \`address\`, along with whatever the user actually typed into it, is gone. Clicking "Back" from \`PaymentStep\` renders a brand-new \`ShippingStep\` instance, which calls \`useState("")\` again, starting fresh with an empty string, exactly as if the component had never been rendered before at all — because, as far as React is concerned, it genuinely has not; this is a completely new mount, unrelated to the one that existed a moment ago. The user\'s carefully-typed address, and any other data entered on that step, is simply gone, with no way to recover it short of typing everything again from scratch.

**The fix: one shared form instance that persists for the entire wizard**

\`\`\`jsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";

function SignupWizard() {
  const methods = useForm({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }) {
  const { register } = useFormContext(); // the SAME shared form instance
  return (
    <div>
      <input {...register("address")} />
      <button onClick={onNext}>Next</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface WizardValues {
  address: string;
  cardNumber: string;
}

function SignupWizard() {
  const methods = useForm<WizardValues>({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState<number>(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }: { onNext: () => void }) {
  const { register } = useFormContext<WizardValues>();
  return (
    <div>
      <input {...register("address")} />
      <button onClick={onNext}>Next</button>
    </div>
  );
}
\`\`\`

\`useForm\` is now called exactly ONCE, at the \`SignupWizard\` level — the component that stays mounted for the entire wizard, regardless of which step is currently visible. \`FormProvider\` makes that single shared form instance available to every step underneath it via \`useFormContext\`, so \`ShippingStep\`\'s \`register("address")\` and \`PaymentStep\`\'s own fields all read from and write to the exact same underlying form state. When \`step\` changes and \`ShippingStep\` unmounts, its own component instance goes away, but the \`address\` VALUE itself was never actually stored inside \`ShippingStep\` — it lives in the shared \`methods\` object created once in \`SignupWizard\`, which never unmounts, so navigating back to step 1 re-renders \`ShippingStep\` with its input correctly showing whatever value is still sitting in the shared form state.`,

    simpleHi: `**Toote hue se shuru.** Har wizard step apni khud ki local state rakhta hai, jo step unmount hone par hataayi jaati hai:

\`\`\`jsx
function ShippingStep({ onNext }) {
  const [address, setAddress] = useState(""); // sirf is component ke andar rehta hai

  return (
    <div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={() => onNext({ address })}>Next</button>
    </div>
  );
}

function SignupWizard() {
  const [step, setStep] = useState(1);

  if (step === 1) return <ShippingStep onNext={() => setStep(2)} />;
  if (step === 2) return <PaymentStep onBack={() => setStep(1)} />; // yahaan ShippingStep unmount hota hai
}
\`\`\`

Jis pal \`step\` \`1\` se \`2\` mein badalta hai, React \`ShippingStep\` ko poori tarah unmount kar deta hai — ye ab kahin bhi render nahi ho raha — aur uska \`address\` ke liye \`useState("")\`, user ne asal mein isme jo kuch bhi type kiya us sameet, chala jaata hai. \`PaymentStep\` se "Back" click karna ek bilkul-naya \`ShippingStep\` instance render karta hai, jo dobara \`useState("")\` bulaata hai, ek khaali string se taaza shuru hote hue, bilkul jaise component pehle kabhi render hi na hua ho — kyunki, jahan tak React ka sawaal hai, ye sach mein nahi hua; ye ek poori tarah nayi mount hai, ek pal pehle maujood wale se koi rishta nahi. User ka savdhaani se type kiya address, aur us step par enter ki gayi koi bhi doosri data, bas chala jaata hai, ise wapas paane ka koi tarika nahi shuru se sab kuch dobara type karne ke alaawa.

**Fix: ek shared form instance jo poore wizard ke liye tikta hai**

\`\`\`jsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";

function SignupWizard() {
  const methods = useForm({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }) {
  const { register } = useFormContext(); // WAHI shared form instance
  return (
    <div>
      <input {...register("address")} />
      <button onClick={onNext}>Next</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface WizardValues {
  address: string;
  cardNumber: string;
}

function SignupWizard() {
  const methods = useForm<WizardValues>({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState<number>(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }: { onNext: () => void }) {
  const { register } = useFormContext<WizardValues>();
  return (
    <div>
      <input {...register("address")} />
      <button onClick={onNext}>Next</button>
    </div>
  );
}
\`\`\`

\`useForm\` ab bilkul EK BAAR bulaaya jaata hai, \`SignupWizard\` star par — wo component jo poore wizard ke liye mounted rehta hai, chahe abhi kaunsa step dikh raha ho. \`FormProvider\` us akeli shared form instance ko har step ke liye upalabdh banaata hai jo uske neeche hai \`useFormContext\` ke zariye, isliye \`ShippingStep\` ka \`register("address")\` aur \`PaymentStep\` ki apni fields sab bilkul usi underlying form state se padhte aur likhte hain. Jab \`step\` badalta hai aur \`ShippingStep\` unmount hota hai, uska apna component instance chala jaata hai, par \`address\` VALUE khud kabhi asal mein \`ShippingStep\` ke andar store hui hi nahi thi — ye us shared \`methods\` object mein rehti hai jo ek baar \`SignupWizard\` mein banaaya gaya, jo kabhi unmount nahi hota, isliye step 1 par wapas jaana \`ShippingStep\` ko dobara render karta hai uske input mein sahi tarike se wo value dikhaate hue jo abhi bhi shared form state mein baithi hai.`,

    content: `## Validating only the current step\'s fields, not the entire wizard at once

\`\`\`jsx
async function handleNext() {
  const isStepValid = await trigger(["address", "city", "zip"]); // only THIS step's fields
  if (isStepValid) setStep(2);
}
\`\`\`

Once every field across every step lives in one shared form instance, a naive "validate on Next" implementation might accidentally call \`handleSubmit\` or trigger validation against every field in the ENTIRE wizard, including fields on steps the user has not reached yet — a payment step\'s \`cardNumber\` being "required" would then incorrectly block a user from even leaving the very first shipping step. React Hook Form\'s \`trigger\` function accepts a specific list of field names to validate, letting a wizard validate only the fields relevant to the step currently being left, leaving not-yet-visited fields on later steps entirely unvalidated until the user actually reaches them — this is the wizard-specific analogue of this course\'s earlier lesson on validating only touched fields, applied at the level of an entire step rather than a single field.

## Dynamic, repeating sections with useFieldArray

\`\`\`jsx
import { useFieldArray, useFormContext } from "react-hook-form";

function PhoneNumbersSection() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "phoneNumbers" });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`phoneNumbers.\${index}.number\`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ number: "" })}>Add another number</button>
    </div>
  );
}
\`\`\`

A genuinely common large-form requirement is a repeating section the user can freely add to or remove from — additional phone numbers, line items on an invoice, dependents on a tax form — where the exact number of entries is not known in advance. \`useFieldArray\` manages exactly this: \`fields\` is the current array of entries to render, \`append\` adds a new one (with whatever default values are appropriate), and \`remove\` deletes a specific entry by its index, all while keeping every entry\'s values correctly synchronized with the shared form instance the rest of the wizard already uses.

## Why field.id, not the array index, must be used as the React key

\`\`\`
Fields: [ {id: "a1"}, {id: "a2"}, {id: "a3"} ]  → keys: "a1", "a2", "a3"
Remove index 0 (the first phone number)
Fields: [ {id: "a2"}, {id: "a3"} ]              → keys: "a2", "a3" (STABLE — correct)

If array index were used as the key instead:
Before removal: keys 0, 1, 2
After removing index 0: keys 0, 1 — but these now refer to DIFFERENT
underlying entries than they did before removal, confusing React
about which DOM node corresponds to which entry
\`\`\`

This course\'s earlier lesson on rendering lists established that React uses a list item\'s \`key\` to track which DOM element corresponds to which piece of data across re-renders, and that using an array index as that key breaks down specifically when items can be reordered, inserted, or removed from the middle of the list — exactly the situation \`useFieldArray\`\'s \`remove\` and \`append\` create. \`useFieldArray\` addresses this by giving each entry in \`fields\` its own stable, unique \`field.id\`. Unlike using the entry\'s position in the array (which shifts every time an earlier entry is removed), \`field.id\` stays attached to the same logical entry regardless of where it currently sits in the array, letting React correctly preserve each remaining input\'s own internal state (such as focus, or an uncommitted value) when an unrelated entry elsewhere in the list is removed.

## Combining a wizard with Zod: validating each step\'s slice of one larger schema

\`\`\`tsx
const fullSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  cardNumber: z.string().length(16),
});

const shippingStepSchema = fullSchema.pick({ address: true, city: true });
\`\`\`

This course\'s previous lesson introduced a single Zod schema describing an entire form\'s validation rules. For a wizard, that same full schema can still act as the single source of truth for every field across every step, while \`.pick()\` derives a smaller schema containing only the fields relevant to one specific step, used together with \`trigger\`\'s step-specific field list to validate exactly what that step actually asks for — the full schema still governs final submission, but each step\'s own "Next" button only checks its own, relevant slice of it.`,

    contentHi: `## Sirf current step ki fields validate karna, poore wizard ko ek saath nahi

\`\`\`jsx
async function handleNext() {
  const isStepValid = await trigger(["address", "city", "zip"]); // sirf IS step ki fields
  if (isStepValid) setStep(2);
}
\`\`\`

Ek baar har step ke aar-paar har field ek shared form instance mein rehti hai, ek saadha "Next par validate karo" implementation shaayad galti se \`handleSubmit\` bulaaye ya poore WIZARD mein har field ke khilaaf validation trigger kare, un fields sameet jinhe user ne abhi tak pahuncha hi nahi — ek payment step ka \`cardNumber\` "required" hona phir galti se ek user ko bilkul pehle wale shipping step ko chhodne se bhi rokega. React Hook Form ka \`trigger\` function validate karne ke liye field names ki ek khaas list sweekaarta hai, ek wizard ko sirf us step se mutaalliq fields validate karne dete hue jo abhi chhoda jaa raha hai, baad ke steps par abhi-tak-na-dekhi-gayi fields ko poori tarah bina-validate chhodte hue jab tak user unhe asal mein na pahunche — ye is course ke pehle wale sirf touched fields validate karne ke lesson ka wizard-khaas samaan roop hai, ek poore step ke star par lagu, ek akeli field ke bajaye.

## \`useFieldArray\` se dynamic, dohraati sections

\`\`\`jsx
import { useFieldArray, useFormContext } from "react-hook-form";

function PhoneNumbersSection() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "phoneNumbers" });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`phoneNumbers.\${index}.number\`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ number: "" })}>Add another number</button>
    </div>
  );
}
\`\`\`

Ek sach mein aam badi-form zaroorat ek dohraata section hai jise user azaadi se jod ya hata sake — additional phone numbers, ek invoice par line items, ek tax form par dependents — jahan entries ki bilkul tadaad pehle se maloom nahi hai. \`useFieldArray\` bilkul ise manage karta hai: \`fields\` render karne ke liye entries ki current array hai, \`append\` ek naya jodta hai (jo bhi upyukt default values ke saath), aur \`remove\` uske index se ek khaas entry hataata hai, in sabke saath poore waqt har entry ki values ko us shared form instance ke saath sahi tarike se synchronized rakhte hue jise baaki wizard pehle se istemal karta hai.

## \`field.id\`, array index nahi, React key ki tarah kyun istemal hona chahiye

\`\`\`
Fields: [ {id: "a1"}, {id: "a2"}, {id: "a3"} ]  → keys: "a1", "a2", "a3"
Index 0 hataao (pehla phone number)
Fields: [ {id: "a2"}, {id: "a3"} ]              → keys: "a2", "a3" (STABLE — sahi)

Agar array index ko key ki tarah istemal kiya jaata:
Hataane se pehle: keys 0, 1, 2
Index 0 hataane ke baad: keys 0, 1 — par ye ab hataane se pehle jo
the un se ALAG underlying entries darsaate hain, React ko confuse
karte hue ki kaunsa DOM node kaunsi entry se mel khaata hai
\`\`\`

Is course ka pehle wala lists render karne ka lesson sthaapit karta hai ki React ek list item ke \`key\` ka istemal karta hai ye track karne ke liye ki kaunsa DOM element re-renders ke aar-paar kaunsi data se mel khaata hai, aur ek array index ko us key ki tarah istemal karna khaas taur par tab tootta hai jab items ko list ke beech se dobara-order, insert, ya hataaya jaa sakta hai — bilkul wahi sthiti jo \`useFieldArray\` ka \`remove\` aur \`append\` banaate hain. \`useFieldArray\` ise sambodhit karta hai \`fields\` mein har entry ko apna stable, unique \`field.id\` dekar. Entry ki array mein position istemal karne ke ulta (jo har baar ek pehle wali entry hataaye jaane par badalti hai), \`field.id\` usi logical entry se juda rehta hai chahe ye abhi array mein kahin bhi baitha ho, React ko sahi tarike se har bachi hui input ki apni internal state (jaise focus, ya ek bina-commit hui value) preserve karne dete hue jab list mein kahin aur ek na-judi entry hataayi jaati hai.

## Ek wizard ko Zod ke saath jodna: har step ka ek badi schema ka hissa validate karna

\`\`\`tsx
const fullSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  cardNumber: z.string().length(16),
});

const shippingStepSchema = fullSchema.pick({ address: true, city: true });
\`\`\`

Is course ka pehle wala lesson ek akeli Zod schema introduce karta hai jo ek poore form ke validation rules darsata hai. Ek wizard ke liye, wahi poori schema phir bhi har step ke aar-paar har field ke liye ek akela sach ka source ki tarah kaam kar sakti hai, jabki \`.pick()\` ek chhoti schema nikaalta hai jismein sirf ek khaas step se mutaalliq fields hain, \`trigger\` ki step-khaas field list ke saath istemal hote hue bilkul wahi validate karne ke liye jo wo step asal mein maangta hai — poori schema phir bhi aakhri submission ko niyantrit karti hai, par har step ka apna "Next" button sirf uska apna, mutaalliq hissa check karta hai.`,

    examples: [
      {
        title: 'Broken: navigating back to a step loses its data entirely',
        titleHi: 'Toota: ek step par wapas jaana uska data poori tarah kho deta hai',
        code: `function ShippingStep() {
  const [address, setAddress] = useState(""); // local, discarded on unmount
  return <input value={address} onChange={(e) => setAddress(e.target.value)} />;
}`,
        codeJs: `function ShippingStep({ onNext }) {
  const [address, setAddress] = useState("");
  return (
    <div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={() => onNext({ address })}>Next</button>
    </div>
  );
}

function SignupWizard() {
  const [step, setStep] = useState(1);
  if (step === 1) return <ShippingStep onNext={() => setStep(2)} />;
  return <PaymentStep onBack={() => setStep(1)} />;
  // returning to step 1 remounts ShippingStep with fresh, empty state
}`,
        codeTs: `function ShippingStep({ onNext }: { onNext: (data: { address: string }) => void }) {
  const [address, setAddress] = useState<string>("");
  return (
    <div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={() => onNext({ address })}>Next</button>
    </div>
  );
}
// Correctly typed, completely valid TypeScript — the data loss is
// architectural, not a type error.`,
        output: `Filling in the address, moving to payment, then clicking back shows
a completely empty address field, exactly as if it had never been
touched at all.`,
        explain: 'ShippingStep\'s local useState is destroyed the instant the component unmounts — there is no mechanism preserving that value anywhere once the component itself is gone.',
        explainHi: '\`ShippingStep\` ka local \`useState\` component unmount hote hi nasht ho jaata hai — ek baar component khud chala jaaye us value ko kahin bhi preserve karne ka koi mechanism nahi hai.',
      },
      {
        title: 'Fixed: a single shared form instance persists across all steps',
        titleHi: 'Theek: ek akela shared form instance sabhi steps ke aar-paar tikta hai',
        code: `const methods = useForm({ defaultValues: { address: "" } });
<FormProvider {...methods}>
  {step === 1 && <ShippingStep />}
  {step === 2 && <PaymentStep />}
</FormProvider>`,
        codeJs: `import { useForm, FormProvider, useFormContext } from "react-hook-form";

function SignupWizard() {
  const methods = useForm({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }) {
  const { register } = useFormContext();
  return (
    <div>
      <input {...register("address")} />
      <button type="button" onClick={onNext}>Next</button>
    </div>
  );
}`,
        codeTs: `import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface WizardValues {
  address: string;
  cardNumber: string;
}

function SignupWizard() {
  const methods = useForm<WizardValues>({ defaultValues: { address: "", cardNumber: "" } });
  const [step, setStep] = useState<number>(1);

  return (
    <FormProvider {...methods}>
      {step === 1 && <ShippingStep onNext={() => setStep(2)} />}
      {step === 2 && <PaymentStep onBack={() => setStep(1)} />}
    </FormProvider>
  );
}

function ShippingStep({ onNext }: { onNext: () => void }) {
  const { register } = useFormContext<WizardValues>();
  return (
    <div>
      <input {...register("address")} />
      <button type="button" onClick={onNext}>Next</button>
    </div>
  );
}`,
        outputJs: `Filling in the address, moving to payment, then clicking back shows
the address exactly as it was left — the value lives in the shared
form instance, which never unmounted.`,
        outputTs: `// Identical behaviour. useFormContext<WizardValues>() gives
// ShippingStep type-safe access to the exact same fields
// SignupWizard's useForm<WizardValues>() declared.`,
        explain: 'The value never actually lived inside ShippingStep at all — it lives in the shared methods object created once in SignupWizard, which stays mounted for the entire wizard.',
        explainHi: 'Value asal mein kabhi \`ShippingStep\` ke andar rehti hi nahi thi — ye shared \`methods\` object mein rehti hai jo ek baar \`SignupWizard\` mein banaayi gayi, jo poore wizard ke liye mounted rehta hai.',
      },
      {
        title: 'A dynamic phone-numbers section with useFieldArray',
        titleHi: '\`useFieldArray\` se ek dynamic phone-numbers section',
        code: `const { fields, append, remove } = useFieldArray({ control, name: "phoneNumbers" });
{fields.map((field, i) => <input key={field.id} {...register(\`phoneNumbers.\${i}.number\`)} />)}`,
        codeJs: `import { useFieldArray, useFormContext } from "react-hook-form";

function PhoneNumbersSection() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "phoneNumbers" });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`phoneNumbers.\${index}.number\`)} placeholder="Phone number" />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ number: "" })}>Add another number</button>
    </div>
  );
}`,
        codeTs: `import { useFieldArray, useFormContext } from "react-hook-form";

interface FormValues {
  phoneNumbers: { number: string }[];
}

function PhoneNumbersSection() {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "phoneNumbers" });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`phoneNumbers.\${index}.number\` as const)} placeholder="Phone number" />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ number: "" })}>Add another number</button>
    </div>
  );
}`,
        outputJs: `Clicking "Add another number" appends a new, empty input. Removing
a phone number from the middle of the list correctly preserves every
remaining input's own current value and focus state.`,
        outputTs: `// Identical behaviour. FieldValues typing on register ensures
// "phoneNumbers.0.number" style paths are checked against the
// actual shape of FormValues at compile time.`,
        explain: 'field.id, not the array index, is used as the key — this keeps React correctly tracking each entry\'s identity even as entries are added or removed from the middle of the list.',
        explainHi: '\`field.id\`, array index nahi, key ki tarah istemal hota hai — ye React ko har entry ki pehchaan sahi tarike se track karte rehne deta hai chahe entries list ke beech se jodi ya hataayi jaayein.',
      },
    ],

    mistakes: [
      {
        wrong: `function ShippingStep() {
  const [address, setAddress] = useState(""); // local state, lost on unmount
}`,
        right: `function ShippingStep() {
  const { register } = useFormContext(); // reads from the wizard's shared, persistent form instance
}`,
        why: 'Local state inside a wizard step component is discarded the instant that step unmounts — a shared form instance living above every step is what actually preserves data across navigation.',
        whyHi: 'Ek wizard step component ke andar local state us step unmount hote hi hataayi jaati hai — har step ke oopar rehta ek shared form instance hi hai jo asal mein navigation ke aar-paar data preserve karta hai.',
      },
      {
        wrong: `async function handleNext() {
  const isValid = await trigger(); // validates EVERY field in the whole wizard, including later steps
  if (isValid) setStep(2);
}`,
        right: `async function handleNext() {
  const isValid = await trigger(["address", "city"]); // only this step's own fields
  if (isValid) setStep(2);
}`,
        why: 'Validating every field in the entire wizard on a single step\'s "Next" button incorrectly blocks progress based on fields the user has not even reached yet.',
        whyHi: 'Ek akele step ke "Next" button par poore wizard ki har field validate karna galti se un fields ke aadhaar par aage badhna rokta hai jinhe user ne abhi pahuncha bhi nahi hai.',
      },
      {
        wrong: `{fields.map((field, index) => <input key={index} {...register(\`phoneNumbers.\${index}.number\`)} />)}
// using the array index as the key`,
        right: `{fields.map((field, index) => <input key={field.id} {...register(\`phoneNumbers.\${index}.number\`)} />)}
// using useFieldArray's own stable field.id`,
        why: 'Using the array index as the key breaks React\'s ability to correctly track each entry\'s identity once an entry is removed from the middle of the list, since remaining entries\' indices shift.',
        whyHi: 'Array index ko key ki tarah istemal karna React ki har entry ki pehchaan sahi tarike se track karne ki kshamta todta hai ek baar list ke beech se ek entry hataayi jaaye, kyunki bachi hui entries ke indices badal jaate hain.',
      },
    ],

    realWorld: [
      {
        en: '**Multi-step checkout flows, onboarding wizards, and job application forms are among the most commonly cited real-world examples of forms genuinely requiring the shared-instance pattern this lesson covers**, since abandoning a wizard midway due to lost data is a directly measurable source of lost conversions.',
        hi: '**Multi-step checkout flows, onboarding wizards, aur job application forms ek asli-duniya misalon mein sabse aam taur par cite kiye jaane waale hain jinhe sach mein is lesson ka shared-instance pattern chahiye**, kyunki kho hue data ki wajah se ek wizard ko beech mein chhodna kho gaye conversions ka ek seedhe naapa-jaane-laayak srot hai.',
      },
      {
        en: '**React Hook Form\'s FormProvider/useFormContext pattern is its own officially documented, recommended approach for exactly this multi-component-sharing-one-form scenario**, rather than a workaround the community independently discovered.',
        hi: '**React Hook Form ka \`FormProvider\`/\`useFormContext\` pattern iska apna officially documented, recommend kiya gaya tarika hai bilkul isi multi-component-ek-form-share-karne-wale scenario ke liye**, community dwara swatantra roop se discover kiya gaya ek workaround ke bajaye.',
      },
      {
        en: '**useFieldArray is React Hook Form\'s own dedicated solution for repeating form sections**, and its documentation explicitly and specifically warns against using an array index as the React key for exactly the reason this lesson covers.',
        hi: '**\`useFieldArray\` React Hook Form ka apna dedicated solution hai dohraate form sections ke liye**, aur iski documentation explicitly aur khaas taur par array index ko React key ki tarah istemal karne ke khilaaf chetaavni deti hai bilkul us wajah se jo ye lesson cover karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does giving each wizard step its own local useState cause data loss when navigating between steps, and why does lifting the form to a shared instance fix it?',
        qHi: 'Har wizard step ko apna khud ka local \`useState\` dena steps ke beech navigate karte waqt data loss ka kaaran kyun banaata hai, aur form ko ek shared instance tak uthaana ise kyun theek karta hai?',
        a: 'A React component\'s local state, created via useState, is tied directly to that specific component instance\'s own lifecycle — it is created when the component first mounts, and it is genuinely destroyed, not merely hidden, the instant that component instance unmounts. When a wizard structures its steps as separate components that are conditionally rendered based on which step is "current" (an if/else or ternary choosing which step component to render), moving from step 1 to step 2 does not keep step 1\'s component instance alive somewhere in the background — it causes React to unmount that instance entirely, since it is no longer part of what is being rendered, and its local useState, along with whatever value was stored in it, ceases to exist at that moment. When the user later navigates back to step 1, React does not somehow restore the previous instance; it creates a brand-new instance of that step\'s component, which calls useState with its original initial value again, exactly as if this were the very first time that component had ever been rendered, because from React\'s perspective, it genuinely is. Lifting the form into a single shared instance, created once at the wizard\'s own top level (the component that stays mounted for the wizard\'s entire lifetime, regardless of which step is currently visible), fixes this by ensuring the actual field VALUES are never tied to any individual step component\'s own lifecycle at all — they live inside the shared form instance, which persists continuously across every step transition, and each step component merely reads from and writes to that shared, persistent instance rather than owning any value itself. Since a step\'s own component unmounting no longer has any bearing on where the data actually lives, navigating back to a previous step and re-rendering its component simply reconnects that component to the same shared instance, which still holds whatever value was there before, with nothing having been lost in the interim.',
        aHi: 'Ek React component ki local state, \`useState\` ke zariye banaayi gayi, us khaas component instance ke apne lifecycle se seedhe judi hoti hai — ye tab banaayi jaati hai jab component pehli baar mount hota hai, aur ye sach mein nasht hoti hai, sirf chhupti nahi, us pal jab wo component instance unmount hota hai. Jab ek wizard apne steps ko alag components ki tarah structure karta hai jo "current" step ke aadhaar par conditionally render hote hain (ek \`if/else\` ya ternary jo chunta hai kaunsa step component render karna hai), step 1 se step 2 mein jaana step 1 ke component instance ko kahin background mein zinda nahi rakhta — ye React ko us instance ko poori tarah unmount karne ka kaaran banaata hai, kyunki ye ab render ho rahi cheez ka hissa nahi hai, aur uska local \`useState\`, usmein store hui jo bhi value ke saath, us pal astitva mein rehna band kar deta hai. Jab user baad mein step 1 par wapas navigate karta hai, React kisi tarah pehle wala instance wapas restore nahi karta; ye us step ke component ka ek bilkul-naya instance banaata hai, jo apni asli initial value ke saath dobara \`useState\` bulaata hai, bilkul jaise ye pehli baar ho ki wo component kabhi render hua ho, kyunki React ke nazariye se, ye sach mein hai. Form ko ek shared instance mein uthaana, jo ek baar wizard ke apne top level par banaayi jaati hai (wo component jo wizard ki poori umr ke liye mounted rehta hai, chahe abhi kaunsa step dikh raha ho), ise theek karta hai ye sunishchit karke ki asli field VALUES kabhi bhi kisi akele step component ke apne lifecycle se bilkul judi nahi hoti — wo shared form instance ke andar rehti hain, jo har step transition ke aar-paar lagaataar tikta hai, aur har step component sirf us shared, tikte instance se padhta aur likhta hai khud koi value rakhne ke bajaye. Kyunki ek step ka apna component unmount hona ab is baat par koi asar nahi rakhta ki data asal mein kahaan rehta hai, ek pehle wale step par wapas navigate karna aur uska component dobara render karna bas us component ko usi shared instance se dobara jodta hai, jo abhi bhi wahi value rakhta hai jo pehle thi, is beech mein kuch bhi kho hue bina.',
      },
      {
        q: 'Why should a wizard\'s "Next" button validate only the current step\'s fields rather than the entire form, and how does this connect to this course\'s earlier touched-state lesson?',
        qHi: 'Ek wizard ka "Next" button poore form ke bajaye sirf current step ki fields kyun validate karna chahiye, aur ye is course ke pehle wale touched-state lesson se kaise judta hai?',
        a: 'Once a wizard\'s entire set of fields, across every step, lives in a single shared form instance, a validation call that does not specifically scope itself to a subset of fields will, by default, check every field the form knows about — including fields belonging to steps the user has not yet reached and has had no opportunity to fill in at all. If a later step has a genuinely required field, validating the whole form while the user is still on an earlier step would report that later, not-yet-visited field as invalid, and a "Next" button that blocks progress on any validation failure would incorrectly prevent the user from even leaving the very first step, despite having correctly completed everything that step actually asked of them. This is conceptually the same underlying problem this course\'s earlier forms-at-scale lesson solved with touched-state tracking: showing an error, or blocking progress, based on a field the user has not yet had a genuine opportunity to address is not useful feedback, it is a premature judgment that actively obstructs normal use. That earlier lesson solved this at the level of an individual field, using a per-field touched flag to defer showing an error until the user had interacted with that specific field. This lesson\'s wizard scenario applies the same underlying principle at the level of an entire step: React Hook Form\'s trigger function, called with an explicit list of only the current step\'s field names, validates exclusively those fields, leaving every other field\'s validation state completely untouched and unchecked until the user actually reaches the step that field belongs to, ensuring a step\'s own "Next" button only ever blocks progress based on problems within that specific step, never based on fields the user has not yet had any chance to engage with.',
        aHi: 'Ek baar wizard ki poori fields ka set, har step ke aar-paar, ek akeli shared form instance mein rehta hai, ek validation call jo khud ko khaas taur par fields ke ek subset tak scope nahi karti, by default, har field check karegi jise form jaanta hai — un fields sameet jo un steps se belong karti hain jinhe user ne abhi tak pahuncha hi nahi aur unhe bharne ka koi mauka bilkul nahi mila. Agar ek baad ke step mein ek sach mein zaruri field hai, poore form ko validate karna jabki user abhi pehle wale step par hai us baad wali, abhi-tak-na-dekhi-gayi field ko invalid report karega, aur ek "Next" button jo kisi bhi validation failure par aage badhna rokta hai galti se user ko bilkul pehle wale step ko chhodne se bhi rokega, chahe unhone us step ne asal mein kya maanga wo sahi tarike se poora kiya ho. Ye conceptually wahi buniyaadi samasya hai jise is course ka pehle wala forms-at-scale lesson touched-state tracking se sulajhaata hai: ek error dikhaana, ya aage badhna rokna, ek aisi field ke aadhaar par jise user ne abhi tak sambodhit karne ka asli mauka nahi paaya upyogi feedback nahi hai, ye ek waqt-se-pehle ka faisla hai jo aam istemal ko saqriya taur par rokta hai. Wo pehle wala lesson ise ek akeli field ke star par sulajhaata hai, ek prati-field touched flag istemal karke ek error dikhaana taalne ke liye jab tak user ne us khaas field se interact na kiya ho. Is lesson ka wizard scenario wahi buniyaadi siddhaant ek poore step ke star par lagu karta hai: React Hook Form ka \`trigger\` function, sirf current step ke field names ki ek explicit list ke saath bulaaya jaata hai, sirf un fields ko validate karta hai, har doosri field ki validation sthiti ko poori tarah na-chheda aur na-check chhodte hue jab tak user asal mein us step tak na pahunche jise wo field belong karti hai, sunishchit karte hue ki ek step ka apna "Next" button hamesha sirf us khaas step ke andar ki samasyaon ke aadhaar par aage badhna rokta hai, un fields ke aadhaar par kabhi nahi jinse user ko abhi tak koi interact karne ka mauka nahi mila.',
      },
      {
        q: 'Why must useFieldArray\'s own field.id, rather than the array index, be used as each rendered row\'s React key?',
        qHi: '\`useFieldArray\` ki apni \`field.id\`, array index nahi, har render hui row ke React key ki tarah kyun istemal honi chahiye?',
        a: 'This course\'s earlier lesson on rendering lists established that React relies on each list item\'s key to determine, across successive renders, which specific rendered DOM element corresponds to which specific piece of underlying data — this correspondence is what allows React to correctly preserve a DOM element\'s own internal state (an input\'s current focus, an uncommitted keystroke not yet reflected in application state) when the surrounding list changes, rather than incorrectly treating every item as brand new on each render. An array index functions as a key only by coincidence in the common case where a list never has an item removed from or inserted into its middle, since in that specific situation, each item\'s index genuinely does correspond to the same underlying item across renders. The moment an item is removed from the middle of a useFieldArray-managed list, however, this coincidental correspondence breaks: every item that was positioned after the removed one shifts down by one index, meaning the item now at index 2, for instance, is a genuinely different underlying entry than whatever was previously at index 2 before the removal, even though the key value "2" itself is unchanged. If the array index were used as the key in this situation, React would incorrectly conclude that the DOM element previously associated with key "2" is still the correct element for whatever entry now happens to occupy index 2, potentially preserving that DOM element\'s internal state (like which input currently has focus) and incorrectly attaching it to a completely different underlying phone number or line item than the one it was previously associated with. useFieldArray\'s own field.id avoids this entirely by being generated once for each entry when it is first created and remaining attached specifically to that logical entry regardless of its current position in the array — removing an earlier entry causes later entries to shift position, but each one\'s own field.id travels with it, so React can correctly recognize that the entry now at a new position is the same underlying entry it was tracking before, correctly preserving that specific entry\'s own DOM state rather than incorrectly reassigning it based on a position that has changed.',
        aHi: 'Is course ka pehle wala lists render karne ka lesson sthaapit karta hai ki React har list item ki \`key\` par nirbhar karta hai ye tay karne ke liye, lagaataar renders ke aar-paar, ki kaunsa khaas rendered DOM element kaunsi khaas underlying data se mel khaata hai — ye mel hi hai jo React ko ek DOM element ki apni internal state (ek input ka current focus, ek na-commit-hua keystroke jo abhi application state mein reflect nahi hua) sahi tarike se preserve karne deta hai jab aas-paas ki list badalti hai, har item ko har render par galti se bilkul naya maanne ke bajaye. Ek array index sirf uss aam case mein samyog se ek key ki tarah kaam karta hai jahan ek list se kabhi koi item beech se hataaya ya insert nahi hota, kyunki us khaas sthiti mein, har item ka index sach mein renders ke aar-paar wahi underlying item se mel khaata hai. Jis pal ek item ek \`useFieldArray\`-managed list ke beech se hataaya jaata hai, halaanki, ye samyog wala mel toot jaata hai: har item jo hataaye gaye item ke baad position mein tha ek index neeche khisak jaata hai, matlab index 2 par ab jo item hai, misal ke taur par, hataane se pehle index 2 par jo bhi tha us se ek sach mein alag underlying entry hai, chahe key value "2" khud na-badla ho. Agar array index ko is sthiti mein key ki tarah istemal kiya jaata, React galti se ye nateeja nikaalega ki key "2" se pehle judi DOM element abhi bhi jo bhi entry ab index 2 par kabza karti hai uske liye sahi element hai, sambhaavit roop se us DOM element ki internal state (jaise abhi kaunsi input focus mein hai) preserve karte hue aur galti se ise ek poori tarah alag underlying phone number ya line item se jodte hue us se jise ye pehle juda tha. \`useFieldArray\` ki apni \`field.id\` ise poori tarah avoid karti hai har entry ke liye ek baar generate hokar jab ye pehli baar banaayi jaati hai aur khaas taur par us logical entry se judi rehte hue chahe iski current position array mein kuch bhi ho — ek pehle wali entry hataana baad ki entries ko position mein khisakwaata hai, par har ek ki apni \`field.id\` uske saath jaati hai, isliye React sahi tarike se pehchaan sakta hai ki ab ek nayi position par jo entry hai wahi underlying entry hai jise ye pehle track kar raha tha, us khaas entry ki apni DOM state sahi tarike se preserve karte hue galti se ise ek badli hui position ke aadhaar par dobara-assign karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken two-step wizard where each step holds its own local useState. Fill in step 1, move to step 2, navigate back, and confirm step 1\'s data is gone.',
        taskHi: 'Toota do-step wizard banao jahan har step apni khud ki local \`useState\` rakhta hai. Step 1 bharo, step 2 par jaao, wapas navigate karo, aur confirm karo ki step 1 ka data gaayab hai.',
        hint: 'Add a console.log inside step 1\'s component body to confirm it genuinely re-mounts (logs again) when navigated back to, rather than merely being hidden.',
        hintHi: 'Step 1 ke component body ke andar ek \`console.log\` jodo confirm karne ke liye ki ye sach mein dobara mount hota hai (dobara log karta hai) jab wapas navigate kiya jaata hai, sirf chhupaaya jaane ke bajaye.',
      },
      {
        task: 'Refactor the wizard to use a single useForm instance at the top level with FormProvider, and update both steps to read from useFormContext. Confirm navigating back and forth now preserves each step\'s data correctly.',
        taskHi: 'Wizard ko refactor karo ek akeli \`useForm\` instance istemal karne ke liye top level par \`FormProvider\` ke saath, aur dono steps ko update karo \`useFormContext\` se padhne ke liye. Confirm karo ki aage-peeche navigate karna ab har step ka data sahi tarike se preserve karta hai.',
        hint: 'Deliberately introduce a typo in one step\'s data, navigate away and back, and confirm the typo (not a blank field) is still what you see.',
        hintHi: 'Ek step ke data mein jaan-boojhkar ek typo daalo, door aur wapas navigate karo, aur confirm karo ki typo (khaali field nahi) abhi bhi wahi hai jo tum dekhte ho.',
      },
      {
        task: 'Add a dynamic phoneNumbers section using useFieldArray, following this lesson\'s example. Add three entries, remove the middle one, and confirm the remaining two entries keep their own correct values rather than swapping.',
        taskHi: 'Is lesson ke example ka palan karte hue \`useFieldArray\` istemal karke ek dynamic \`phoneNumbers\` section jodo. Teen entries jodo, beech waali hataao, aur confirm karo ki bachi hui do entries apni sahi values rakhti hain badalne ke bajaye.',
        hint: 'Type a distinct, easily recognizable value into each of the three entries before removing the middle one, so you can immediately tell if values got swapped incorrectly.',
        hintHi: 'Beech waali hataane se pehle teenon entries mein ek alag, aasaani se pehchaanne-laayak value type karo, taaki tum turant bata sako agar values galat tarike se badal gayi.',
      },
    ],

    keyTakeaways: [
      'A wizard step\'s local useState is destroyed the instant that step\'s component unmounts — navigating back re-creates a brand-new instance with fresh, empty state, losing whatever the user previously entered.',
      'Lifting the form into a single useForm instance created once at the wizard\'s top level, shared via FormProvider and useFormContext, means field values never depend on any individual step\'s own mount lifecycle.',
      'Validating a wizard step\'s "Next" button should use trigger with an explicit list of that step\'s own field names, not the entire form, to avoid incorrectly blocking progress based on fields on later, not-yet-visited steps.',
      'useFieldArray manages a repeating, dynamic section (fields, append, remove) whose entry count is not known in advance, keeping every entry synchronized with the shared form instance.',
      'useFieldArray\'s own field.id, not the array index, must be used as each row\'s React key, since removing an entry from the middle of the list shifts every later entry\'s index, breaking the index-as-key assumption.',
      'A wizard can still use one full Zod schema as its single source of truth, deriving a smaller per-step schema via .pick() for validating only the fields relevant to whichever step is currently being left.',
    ],
    keyTakeawaysHi: [
      'Ek wizard step ki local \`useState\` us step ka component unmount hote hi nasht ho jaati hai — wapas navigate karna ek bilkul-naya instance banaata hai taazi, khaali state ke saath, jo bhi user ne pehle enter kiya use khote hue.',
      'Form ko ek akeli \`useForm\` instance mein uthaana jo ek baar wizard ke top level par banaayi jaati hai, \`FormProvider\` aur \`useFormContext\` ke zariye shared, matlab hai field values kabhi bhi kisi akele step ke apne mount lifecycle par nirbhar nahi hoti.',
      'Ek wizard step ke "Next" button ko validate karna \`trigger\` ka istemal karna chahiye us step ki apni field names ki ek explicit list ke saath, poore form se nahi, baad ke, abhi-tak-na-dekhe-gaye steps ki fields ke aadhaar par galti se aage badhna rokne se bachne ke liye.',
      '\`useFieldArray\` ek dohraata, dynamic section manage karta hai (\`fields\`, \`append\`, \`remove\`) jiski entry count pehle se maloom nahi hai, har entry ko shared form instance ke saath synchronized rakhte hue.',
      '\`useFieldArray\` ki apni \`field.id\`, array index nahi, har row ke React key ki tarah istemal honi chahiye, kyunki list ke beech se ek entry hataana har baad ki entry ka index khisakaata hai, index-ko-key maanne ki dhaarna todte hue.',
      'Ek wizard phir bhi ek poori Zod schema ko apne akele sach ke source ki tarah istemal kar sakta hai, \`.pick()\` ke zariye ek chhoti prati-step schema nikaalte hue sirf un fields ko validate karne ke liye jo abhi chhode jaa rahe step se mutaalliq hain.',
    ],
  },
];
