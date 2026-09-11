/**
 * Next.js Complete Course — Module 14: Server Actions & Data Security, lessons 1-3.
 *
 * Lesson 1: The mistake of assuming a Server Action is automatically authorized.
 * Lesson 2: Mass assignment — never spread untrusted input into a database write.
 * Lesson 3: Re-checking auth inside every mutation, and zod-parsing your own client's input.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-server-actions-not-automatically-authorized',
    title: 'The Mistake of Assuming a Server Action Is Automatically Authorized',
    titleHi: 'Ye Assume Karna Ki Ek Server Action Automatically Authorized Hai',
    description:
      "A Server Action feels like private, internal code because it's defined right next to the component that calls it — but it compiles into a real, independently-callable network endpoint, reachable by anyone who can construct the right request, not just the button you wired it to.",
    descriptionHi:
      'Ek Server Action private, internal code jaisa feel karta hai kyunki ye us component ke bilkul paas define hota hai jo ise call karta hai — par ye ek real, independently-callable network endpoint mein compile hota hai, kisi ke bhi dwara reachable jo sahi request construct kar sake, sirf us button se nahi jisse aapne ise wire kiya.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A house's front door that looks like decoration painted onto a wall, but is actually a real, functioning door anyone can open from outside.** If a door LOOKS purely decorative — flush with the wall, no obvious external handle — a homeowner might reasonably start treating the wall behind it as private, unreachable space, storing valuables right up against it without a second thought. But if that door is, in fact, a real functioning door that simply looks unobtrusive, anyone who tries the handle from outside walks right in — the door's inconspicuous appearance never actually made it locked. A Server Action defined inline next to a private-feeling component is exactly this: it LOOKS like an internal implementation detail, but it's a real, externally-reachable door the moment it's marked 'use server' — its appearance of privacy is not the same thing as actual access control.",
      hi: 'Ek ghar ka front door jo ek wall pe painted decoration jaisa dikhta hai, par actually ek real, functioning door hai jise bahar se koi bhi khol sakta hai. Agar ek door purely decorative DIKHTA hai — wall ke saath flush, koi obvious external handle nahi — ek homeowner reasonably uske peeche ki wall ko private, unreachable space ki tarah treat karna shuru kar sakta hai, uske bilkul paas valuables store karte hue bina doosri baar socche. Par agar wo door, actually, ek real functioning door hai jo simply unobtrusive dikhta hai, koi bhi jo bahar se handle try karta hai seedha andar chala jata hai — door ki inconspicuous appearance ne ise kabhi actually locked nahi banaya. Ek private-feeling component ke bilkul paas inline defined ek Server Action exactly yahi hai: ye ek internal implementation detail jaisa DIKHTA hai, par ye ek real, externally-reachable door hai jis moment ye \'use server\' marked hota hai — uski privacy ki appearance actual access control jaisi cheez nahi hai.',
    },

    simple: `**Why this trap is so easy to fall into:** a Server Action is written
INLINE, right next to the component that uses it, looking exactly like a
regular function call:

\`\`\`tsx
// This LOOKS like an internal helper only this component could ever call
export default function AdminPanel() {
  async function deleteUser(userId: string) {
    'use server';
    await db.user.delete({ where: { id: userId } }); // no auth check at all
  }
  return <DeleteButton onDelete={deleteUser} />;
}
\`\`\`

**What actually happens, mechanically:** the moment a function is marked
\`'use server'\`, Next.js generates a real HTTP endpoint for it, with a
stable identifier the client bundle references to invoke it. Anyone who
can inspect that client bundle (i.e., anyone — it's public, sent to every
visitor's browser) can find that identifier and construct a direct request
to invoke \`deleteUser\` with ANY \`userId\` they choose — completely
bypassing the \`<DeleteButton>\` and the \`<AdminPanel>\` page it lives on.

**The fix — check authorization INSIDE the action, every time, using the
current request's own verified session:**

\`\`\`tsx
export default function AdminPanel() {
  async function deleteUser(userId: string) {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Not authorized');
    }
    await db.user.delete({ where: { id: userId } });
  }
  return <DeleteButton onDelete={deleteUser} />;
}
\`\`\`

**Why "it's only rendered on the admin page" is not a security boundary:**
whether a button appears on a page a regular user can't navigate to says
NOTHING about whether the underlying Server Action itself checks
authorization — the action's network endpoint exists and is callable
regardless of which pages happen to render a button that calls it. UI
visibility is a UX concern; the action's own internal check is the actual
security boundary.`,

    simpleHi: `**Ye trap itna aasan hai girna kyun hai:** ek Server Action INLINE
likha jata hai, us component ke bilkul paas jo ise use karta hai, exactly
ek regular function call jaisa dikhte hue:

\`\`\`tsx
// Ye ek internal helper jaisa DIKHTA hai jise sirf ye component kabhi call kar sakta
export default function AdminPanel() {
  async function deleteUser(userId: string) {
    'use server';
    await db.user.delete({ where: { id: userId } }); // koi auth check bilkul nahi
  }
  return <DeleteButton onDelete={deleteUser} />;
}
\`\`\`

**Actually mechanically kya hota hai:** jis moment ek function
\`'use server'\` marked hota hai, Next.js iske liye ek real HTTP endpoint
generate karta hai, ek stable identifier ke saath jise client bundle ise
invoke karne ke liye reference karta hai. Koi bhi jo us client bundle ko
inspect kar sakta hai (yaani, koi bhi — ye public hai, har visitor ke
browser ko bheja jata hai) us identifier ko find kar sakta hai aur ek
direct request construct kar sakta hai \`deleteUser\` ko invoke karne ke
liye KISI BHI \`userId\` ke saath jo wo chahe — \`<DeleteButton>\` aur
\`<AdminPanel>\` page ko poori tarah bypass karte hue jispe ye rehta hai.

**Fix — action ke ANDAR authorization check karo, har baar, current
request ke apne verified session ko use karte hue:**

\`\`\`tsx
export default function AdminPanel() {
  async function deleteUser(userId: string) {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Not authorized');
    }
    await db.user.delete({ where: { id: userId } });
  }
  return <DeleteButton onDelete={deleteUser} />;
}
\`\`\`

**"Ye sirf admin page pe rendered hai" ek security boundary kyun nahi
hai:** kya ek button ek page pe appear hota hai jahan ek regular user
navigate nahi kar sakta ISKE BAARE MEIN KUCH NAHI KEHTA ki kya underlying
Server Action khud authorization check karta hai — action ka network
endpoint exist karta hai aur callable hai chahe kaunse bhi pages ek button
render karte hon jo ise call karta hai. UI visibility ek UX concern hai;
action ka apna khud ka internal check actual security boundary hai.`,

    content: `## Why this specific mistake is so common with Server Actions
particularly

Before Server Actions, the "API endpoint" and the "UI that calls it" were
naturally two separate files, often in separate directories — a developer
writing an API route was constantly reminded, by the very act of creating
a separate file, that they were building something externally reachable.
Server Actions collapse this distinction visually: the action lives
inline, indented inside the same component, reading like private helper
code. This visual proximity is precisely what makes it easy to
subconsciously treat the action as "part of the component" rather than
"a public network endpoint that happens to be defined near a component."

## The specific reasoning error to watch for

The flawed reasoning usually sounds like: "this action is only called from
the delete button, and that button only renders for admins, so this
action is safe." Every step of that reasoning describes the INTENDED path
through the UI — it says nothing about what happens when a request
bypasses the UI entirely and calls the action's endpoint directly. Once a
function is a Server Action, its safety can only be evaluated by asking
"what happens if this specific function is called directly, with
arbitrary arguments, by anyone" — not by tracing through the UI flow that
was intended to lead to it.

## Where the check actually needs to live, and why "once" isn't enough

The authorization check must run INSIDE the action's own function body,
executed on every single invocation — not in a wrapping component, not in
a parent page's own auth check, and not assumed from middleware (Module
8's lesson on middleware's coarse-vs-fine-grained distinction applies
directly here). A page-level check ("redirect if not admin") protects
against a regular user NAVIGATING to the admin page in a browser, but does
nothing to stop a direct, crafted request to the Server Action's endpoint
that never goes through that page's rendering at all.

## This is a specific instance of a general security principle

This lesson is really a concrete, Server-Actions-specific case of a much
older principle: never trust the client, and never assume a UI constraint
is a security constraint. The same principle appeared in Module 12's CSRF
lesson (a form's presence doesn't stop a forged request) and Module 13's
IDOR lesson (a resource id in a URL doesn't imply the requester owns it).
Server Actions simply make the mistake unusually easy to write
accidentally, because the code LOOKS private even though it fundamentally
isn't.`,

    contentHi: `## Ye specific mistake Server Actions ke saath particularly itna
common kyun hai

Server Actions se pehle, "API endpoint" aur "UI jo ise call karti hai"
naturally do separate files thi, aksar separate directories mein — ek
developer jo ek API route likh raha tha use constantly yaad dilaya jata
tha, ek separate file banane ke act se hi, ki wo kuch aisa bana raha hai
jo externally reachable hai. Server Actions is distinction ko visually
collapse kar dete hain: action inline rehta hai, wahi component ke andar
indented, private helper code jaisa padhte hue. Ye visual proximity
precisely wo cheez hai jo isse subconsciously "component ka hissa" ki
tarah treat karna aasan banata hai "ek public network endpoint jo ek
component ke near define hota hai" ke bajaye.

## Dhyan dene wali specific reasoning error

Flawed reasoning usually aisa sunayi deta hai: "ye action sirf delete
button se call hota hai, aur wo button sirf admins ke liye render hota
hai, isliye ye action safe hai." Us reasoning ka har step UI ke through
INTENDED path describe karta hai — ye kuch nahi kehta ki kya hota hai jab
ek request UI ko poori tarah bypass karti hai aur action ke endpoint ko
directly call karti hai. Ek baar ek function ek Server Action ban jaata
hai, uski safety sirf ye poochh kar evaluate ki ja sakti hai "kya hota hai
agar ye specific function directly call kiya jaaye, arbitrary arguments
ke saath, kisi ke bhi dwara" — us UI flow ke through trace kar ke nahi jo
uske liye intended tha.

## Check actually kahan rehna chahiye, aur "ek baar" kyun kaafi nahi hai

Authorization check ko action ke apne function body ke ANDAR chalna
chahiye, har single invocation pe execute hote hue — ek wrapping component
mein nahi, ek parent page ke apne auth check mein nahi, aur middleware se
assume nahi kiya jaana chahiye (Module 8 ka lesson middleware ke
coarse-vs-fine-grained distinction pe directly yahan apply hota hai). Ek
page-level check ("redirect karo agar admin nahi hai") ek regular user ko
ek browser mein admin page tak NAVIGATE karne se protect karta hai, par
ek direct, crafted request ko Server Action ke endpoint tak rokne ke liye
kuch nahi karta jo us page ki rendering se bilkul kabhi guzarta hi nahi.

## Ye ek general security principle ka specific instance hai

Ye lesson really ek bahut purane principle ka ek concrete,
Server-Actions-specific case hai: kabhi client ko trust mat karo, aur
kabhi ye assume mat karo ki ek UI constraint ek security constraint hai.
Wahi principle Module 12 ke CSRF lesson mein appear hua (ek form ka
presence ek forged request ko nahi rokta) aur Module 13 ke IDOR lesson
mein (ek URL mein ek resource id ye imply nahi karta ki requester uska
owner hai). Server Actions simply is mistake ko accidentally likhne mein
unusually aasan bana dete hain, kyunki code private DIKHTA hai chahe ye
fundamentally aisa hai nahi.`,

    examples: [
      {
        title: 'An inline Server Action that looks private but is a real callable endpoint, fixed with an internal check',
        titleHi: 'Ek inline Server Action jo private dikhta hai par ek real callable endpoint hai, ek internal check ke saath fixed',
        codeJs: `// app/admin/products/page.js — looks entirely self-contained
export default function AdminProductsPage() {
  async function deleteProduct(productId) {
    'use server';
    // VULNERABLE: no check that the caller is actually an admin.
    // This function compiles to a real endpoint, callable directly by
    // anyone who inspects the client bundle for its reference — not just
    // from this specific button on this specific admin-only page.
    await db.product.delete({ where: { id: productId } });
  }

  return <ProductList onDelete={deleteProduct} />;
}

// FIXED: authorization is checked INSIDE the action, every time
export default function AdminProductsPageFixed() {
  async function deleteProduct(productId) {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Not authorized');
    }
    await db.product.delete({ where: { id: productId } });
  }

  return <ProductList onDelete={deleteProduct} />;
}`,
        codeTs: `// app/admin/products/page.tsx — looks entirely self-contained
export default function AdminProductsPage() {
  async function deleteProduct(productId: string) {
    'use server';
    // VULNERABLE: no check that the caller is actually an admin.
    // This function compiles to a real endpoint, callable directly by
    // anyone who inspects the client bundle for its reference — not just
    // from this specific button on this specific admin-only page.
    await db.product.delete({ where: { id: productId } });
  }

  return <ProductList onDelete={deleteProduct} />;
}

// FIXED: authorization is checked INSIDE the action, every time
export default function AdminProductsPageFixed() {
  async function deleteProduct(productId: string) {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Not authorized');
    }
    await db.product.delete({ where: { id: productId } });
  }

  return <ProductList onDelete={deleteProduct} />;
}`,
        code: `async function deleteProduct(productId) {
  'use server';
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Not authorized');
  }
  await db.product.delete({ where: { id: productId } });
}`,
        output:
          "A request to this Server Action's endpoint made without a valid admin session throws 'Not authorized' and never reaches the database call — regardless of whether that request came from the intended button, a different page, or a hand-crafted request that never touched the UI at all.",
        explain:
          "The fix doesn't change anything about the button, the page, or the routing — it adds exactly one check, inside the action itself, that runs no matter how the action was invoked. This is what makes the action's own body the actual security boundary rather than any UI arrangement around it.",
        explainHi:
          "Fix button, page, ya routing ke baare mein kuch nahi badalta — ye exactly ek check add karta hai, action ke khud ke andar, jo chalta hai chahe action kaise bhi invoke hua ho. Ye wahi hai jo action ki apni body ko actual security boundary banata hai, uske around kisi bhi UI arrangement ko nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting that a Server Action is safe because of WHERE it's rendered
export default function AdminOnlyPage() {
  // "This entire page is behind an admin check in the layout, so any
  // Server Action defined here must be safe too" — this reasoning is wrong
  async function grantAdminAccess(userId) {
    'use server';
    await db.user.update({ where: { id: userId }, data: { role: 'admin' } });
  }
  return <UserList onGrantAdmin={grantAdminAccess} />;
}`,
        right: `// Checking authorization inside the action itself, regardless of page context
export default function AdminOnlyPage() {
  async function grantAdminAccess(userId) {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Not authorized');
    }
    await db.user.update({ where: { id: userId }, data: { role: 'admin' } });
  }
  return <UserList onGrantAdmin={grantAdminAccess} />;
}`,
        why: "A page-level or layout-level auth check controls whether a browser can NAVIGATE to render that page — it has no effect on whether the Server Action's own network endpoint can be invoked directly, bypassing the page's rendering (and therefore its auth check) entirely.",
        whyHi:
          "Ek page-level ya layout-level auth check control karta hai ki kya ek browser us page ko render karne ke liye NAVIGATE kar sakta hai — iska koi effect nahi hai is baat pe ki kya Server Action ka apna network endpoint directly invoke kiya ja sakta hai, page ki rendering ko (aur isliye uske auth check ko) poori tarah bypass karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A real-world audit of a Next.js admin dashboard commonly finds Server Actions that were correctly gated by a page-level or layout-level auth check but had no independent check inside the action itself — a gap that's invisible in normal use (since a regular user never even reaches the button) but fully exploitable by anyone who directly calls the action's endpoint.",
        hi: 'Ek Next.js admin dashboard ka ek real-world audit commonly aise Server Actions dhundhta hai jo ek page-level ya layout-level auth check se correctly gated the par jinme khud action ke andar koi independent check nahi tha — ek gap jo normal use mein invisible hai (kyunki ek regular user button tak kabhi pahunchta hi nahi) par poori tarah exploitable hai kisi ke bhi dwara jo directly action ke endpoint ko call karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is "this Server Action is only rendered on an admin-only page" not a valid security argument?',
        qHi: '"Ye Server Action sirf ek admin-only page pe rendered hai" ek valid security argument kyun nahi hai?',
        a: "Because a Server Action compiles into a real, independently-callable network endpoint the moment it's marked 'use server' — anyone who inspects the client bundle can find and directly invoke it with arbitrary arguments, entirely bypassing whichever page or button was intended to be its only caller. Page-level UI restrictions control navigation, not the callability of the underlying endpoint.",
        aHi: "Kyunki ek Server Action ek real, independently-callable network endpoint mein compile hota hai jis moment ye 'use server' marked hota hai — koi bhi jo client bundle inspect karta hai ise find aur directly invoke kar sakta hai arbitrary arguments ke saath, poori tarah bypass karte hue jo bhi page ya button uska ekmatra caller hone ke liye intended tha. Page-level UI restrictions navigation control karte hain, underlying endpoint ki callability nahi.",
      },
      {
        q: 'Where must an authorization check for a Server Action actually live?',
        qHi: 'Ek Server Action ke liye ek authorization check actually kahan rehna chahiye?',
        a: "Inside the Server Action's own function body, executed on every invocation — never assumed from a wrapping component, a parent page's auth logic, or middleware alone, since none of those run when the action's endpoint is called directly.",
        aHi: 'Server Action ki apni function body ke andar, har invocation pe execute hote hue — kabhi ek wrapping component se, ek parent page ke auth logic se, ya akele middleware se assume nahi karna chahiye, kyunki inme se koi bhi nahi chalta jab action ka endpoint directly call kiya jata hai.',
      },
    ],

    exercises: [
      {
        task: "A Server Action for 'approve a refund request' is defined inside a component that only renders inside /admin/refunds, which itself is protected by a layout that redirects non-admins. Explain the exact request an attacker could make to bypass this, and write the fix.",
        taskHi: 'Ek Server Action \'refund request approve karo\' ke liye ek component ke andar defined hai jo sirf /admin/refunds ke andar render hota hai, jo khud ek layout se protected hai jo non-admins ko redirect karta hai. Us exact request ko explain karo jo ek attacker isse bypass karne ke liye bana sakta hai, aur fix likho.',
        hint: "The attacker never needs to visit /admin/refunds at all — think about what they'd need to directly invoke the Server Action's underlying endpoint.",
        hintHi: 'Attacker ko kabhi /admin/refunds visit karne ki zaroorat hi nahi hai — socho unhe kya chahiye Server Action ke underlying endpoint ko directly invoke karne ke liye.',
      },
    ],

    keyTakeaways: [
      "A Server Action, once marked 'use server', is a real, independently-callable network endpoint — its inline placement next to a component is purely a code-organization convenience, not a security boundary.",
      'Reasoning like "this action is only called from this specific button on this specific page" describes the intended UI path, not what happens when a request bypasses the UI and calls the action\'s endpoint directly.',
      'Authorization must be checked inside the Server Action\'s own function body, on every invocation — a page-level or layout-level auth check only controls navigation to render that page, not the callability of the action itself.',
      "This is a specific case of a general principle already seen in CSRF (Module 12) and IDOR (Module 13): never assume a UI constraint is a security constraint, and never trust the client.",
    ],
    keyTakeawaysHi: [
      "Ek Server Action, ek baar 'use server' marked hone ke baad, ek real, independently-callable network endpoint hai — ek component ke paas iska inline placement purely ek code-organization convenience hai, ek security boundary nahi.",
      'Reasoning jaisa "ye action sirf is specific page pe is specific button se call hota hai" intended UI path describe karta hai, ye nahi ki kya hota hai jab ek request UI ko bypass karti hai aur action ke endpoint ko directly call karti hai.',
      'Authorization ko Server Action ki apni function body ke andar check karna chahiye, har invocation pe — ek page-level ya layout-level auth check sirf us page ko render karne ke liye navigation control karta hai, action ki khud ki callability nahi.',
      'Ye ek general principle ka ek specific case hai jo already CSRF (Module 12) aur IDOR (Module 13) mein dekha gaya: kabhi ye assume mat karo ki ek UI constraint ek security constraint hai, aur kabhi client ko trust mat karo.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-mass-assignment',
    title: 'Mass Assignment — Never Spread Untrusted Input Into a Write',
    titleHi: 'Mass Assignment — Untrusted Input Ko Kabhi Ek Write Mein Spread Mat Karo',
    description:
      "Spreading an entire incoming object directly into a database write is convenient — and dangerous, because it lets the CALLER decide which fields get written, including fields that were never meant to be user-editable, like a role or an account balance.",
    descriptionHi:
      'Ek poore incoming object ko directly ek database write mein spread karna convenient hai — aur dangerous hai, kyunki ye CALLER ko decide karne deta hai ki kaunse fields likhe jaate hain, un fields samet jo kabhi user-editable hone ke liye meant nahi the, jaise ek role ya ek account balance.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A form that asks for your name and address, but is designed so that whatever you write anywhere on the page — including in the margins — gets typed directly into a company's official records without anyone reviewing it first.** A well-designed intake form has specific boxes for specific fields, and only what's written in the 'name' box becomes your recorded name. A poorly designed process that transcribes literally everything written anywhere on the page directly into official records — including if someone writes 'also set my account tier to Platinum' in the margin — lets the person filling out the form control far more than the form's own visible fields suggest. Spreading an entire request body into a database write is exactly this: whatever fields the caller includes, expected or not, get written.",
      hi: 'Ek form jo aapka naam aur address poochhta hai, par is tarah design kiya gaya hai ki page pe kahin bhi jo bhi aap likhte ho — margins samet — directly ek company ke official records mein type ho jata hai bina kisi ke pehle review kiye. Ek well-designed intake form mein specific fields ke liye specific boxes hote hain, aur sirf jo \'naam\' box mein likha hai wo aapka recorded naam banta hai. Ek poorly designed process jo literally page pe kahin bhi likhi har cheez ko directly official records mein transcribe karta hai — including agar koi margin mein likhe \'mera account tier bhi Platinum set kar do\' — form bharne wale insaan ko form ke apne visible fields suggest karte hain usse kaafi zyada control deta hai. Ek poore request body ko ek database write mein spread karna exactly yahi hai: caller jo bhi fields include karta hai, expected ho ya na ho, likhe jaate hain.',
    },

    simple: `**The convenient but dangerous shortcut:**

\`\`\`ts
// A profile-update Server Action, spreading the entire input object
export async function updateProfile(data: any) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data, // WHATEVER fields the caller sent, all get written
  });
}
\`\`\`

\`\`\`ts
// The intended call: only name and bio are meant to be editable
updateProfile({ name: 'Priya', bio: 'Engineer' });

// What an attacker can ALSO send, since nothing stops them:
updateProfile({ name: 'Priya', role: 'admin', accountBalance: 999999 });
// If 'role' and 'accountBalance' are real columns on the User model,
// this update writes to them too — the caller decided which fields
// to change, not the application.
\`\`\`

**The fix: explicitly list which fields are allowed, never spread the
raw input directly:**

\`\`\`ts
export async function updateProfile(data: { name: string; bio: string }) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: {
      name: data.name, // explicitly named — only what's listed can change
      bio: data.bio,
    },
  });
}
\`\`\`

**Combining this with Zod (Module 5) makes the allowlist explicit AND
validated in one step:**

\`\`\`ts
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1),
  bio: z.string().max(500),
}); // role, accountBalance, or anything else is simply not in this shape

export async function updateProfile(formData: FormData) {
  const result = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });
  if (!result.success) return { error: 'Invalid input' };

  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: result.data, // safe to spread — result.data can ONLY contain
  });                    // name and bio, because the schema defines the shape
}
\`\`\`

**The key insight this reveals about Zod:** a Zod schema isn't just for
rejecting malformed data — \`safeParse\`'s output is a NEW object containing
only the fields the schema defines, which makes spreading \`result.data\`
safe in a way that spreading raw, unvalidated input never is. The
allowlist and the validation are the same mechanism.`,

    simpleHi: `**Convenient par dangerous shortcut:**

\`\`\`ts
// Ek profile-update Server Action, poore input object ko spread karte hue
export async function updateProfile(data: any) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data, // caller ne jo bhi fields bheji, sab likhi jaati hain
  });
}
\`\`\`

\`\`\`ts
// Intended call: sirf name aur bio editable hone ke liye meant hain
updateProfile({ name: 'Priya', bio: 'Engineer' });

// Ek attacker ALSO kya bhej sakta hai, kyunki kuch bhi unhe nahi rokta:
updateProfile({ name: 'Priya', role: 'admin', accountBalance: 999999 });
// Agar 'role' aur 'accountBalance' User model pe real columns hain,
// ye update unhe bhi likh deta hai — caller decide kar chuka tha
// kaunse fields change karne hain, application nahi.
\`\`\`

**Fix: explicitly list karo kaunse fields allowed hain, raw input ko
kabhi directly spread mat karo:**

\`\`\`ts
export async function updateProfile(data: { name: string; bio: string }) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: {
      name: data.name, // explicitly named — sirf jo listed hai wo change ho sakta hai
      bio: data.bio,
    },
  });
}
\`\`\`

**Ise Zod (Module 5) ke saath combine karna allowlist ko explicit AUR
ek step mein validated banata hai:**

\`\`\`ts
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1),
  bio: z.string().max(500),
}); // role, accountBalance, ya kuch aur simply is shape mein hai hi nahi

export async function updateProfile(formData: FormData) {
  const result = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });
  if (!result.success) return { error: 'Invalid input' };

  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: result.data, // spread karna safe hai — result.data mein SIRF
  });                    // name aur bio ho sakte hain, kyunki schema shape define karta hai
}
\`\`\`

**Key insight jo ye Zod ke baare mein reveal karta hai:** ek Zod schema
sirf malformed data reject karne ke liye nahi hai — \`safeParse\` ka output
ek NAYA object hai jisme sirf wo fields hain jo schema define karta hai,
jo \`result.data\` ko spread karna safe banata hai us tarike se jo raw,
unvalidated input ko spread karna kabhi nahi hai. Allowlist aur validation
wahi mechanism hain.`,

    content: `## Why spreading feels natural, and why that's exactly the trap

\`data: rawInput\` or \`{ ...rawInput }\` is genuinely less code to write than
explicitly listing every field, and for a form with many fields, the
temptation to avoid the repetition is real. The problem is that this
convenience inverts who controls which fields get written: instead of the
APPLICATION deciding which fields a given operation is allowed to change,
the CALLER'S input shape decides — and the caller is exactly the untrusted
party in this relationship. Explicitly listing fields (or using a schema
that only contains the intended fields) keeps that decision where it
belongs, with the application's own code.

## Why this is particularly dangerous for fields the UI never exposes

The most damaging mass assignment cases involve fields that don't even
appear in the application's own UI — a \`role\` column, an \`isVerified\`
flag, an \`accountBalance\`. A developer testing the feature through the
normal UI would never notice the vulnerability, because the UI's own form
never sends those fields — the gap only becomes visible to someone
constructing a request directly, bypassing the UI entirely, which is
exactly the same attacker mindset Lesson 1 introduced for Server Actions
generally.

## Why Zod's parsed output, specifically, is safe to spread

This is worth stating precisely: it is NOT generally safe to spread any
object into a database write, but it IS safe to spread the OUTPUT of a
\`safeParse\` call against a schema that only defines the intended fields.
The schema itself is the allowlist — \`z.object({ name: z.string(), bio:
z.string() })\` produces a parsed result that can only ever contain
\`name\` and \`bio\`, regardless of what extra fields the original raw input
contained, because Zod strips (or, depending on configuration, rejects)
anything not defined in the schema.

## The relationship to Prisma's own field-level control

Prisma's \`update\`/\`create\` calls only ever write the fields explicitly
present in the \`data\` object passed to them — Prisma itself has no
concept of "extra" fields being silently ignored versus written; whatever
key-value pairs exist in that object are what get written, if they
correspond to real columns. This means the entire defense against mass
assignment lives in controlling what that \`data\` object actually
contains before it ever reaches Prisma — there's no Prisma-level setting
that provides this protection for you.`,

    contentHi: `## Spreading natural kyun feel karta hai, aur ye exactly trap kyun hai

\`data: rawInput\` ya \`{ ...rawInput }\` genuinely har field ko explicitly
list karne se kam code hai, aur kai fields wale ek form ke liye,
repetition avoid karne ka temptation real hai. Problem ye hai ki ye
convenience iss baat ko invert kar deta hai ki kaunse fields likhe jaate
hain use kaun control karta hai: APPLICATION ke decide karne ke bajaye ki
ek given operation ko kaunse fields change karne allowed hain, CALLER ka
input shape decide karta hai — aur caller exactly wo untrusted party hai
is relationship mein. Fields ko explicitly list karna (ya ek schema use
karna jisme sirf intended fields hon) us decision ko wahin rakhta hai
jahan ye belong karta hai, application ke apne code mein.

## Un fields ke liye ye particularly dangerous kyun hai jo UI kabhi expose nahi karta

Sabse damaging mass assignment cases un fields ko involve karte hain jo
application ke apne UI mein appear bhi nahi hote — ek \`role\` column, ek
\`isVerified\` flag, ek \`accountBalance\`. Ek developer jo feature ko
normal UI ke through test kar raha hai vulnerability kabhi notice nahi
karega, kyunki UI ka apna form un fields ko kabhi bhejta hi nahi — gap sirf
kisi ke liye visible hota hai jo directly ek request construct karta hai,
UI ko poori tarah bypass karte hue, jo exactly wahi attacker mindset hai
jo Lesson 1 ne Server Actions ke liye generally introduce kiya.

## Zod ka parsed output, specifically, spread karna safe kyun hai

Ye precisely state karna worth hai: koi bhi object ko ek database write
mein spread karna generally safe NAHI hai, par ek schema ke against ek
\`safeParse\` call ke OUTPUT ko spread karna safe HAI jo sirf intended
fields define karta hai. Schema khud allowlist hai — \`z.object({ name:
z.string(), bio: z.string() })\` ek parsed result produce karta hai jisme
sirf \`name\` aur \`bio\` ho sakte hain, chahe original raw input mein kuch
bhi extra fields ho, kyunki Zod strip karta hai (ya, configuration pe
depend karte hue, reject karta hai) kuch bhi jo schema mein defined nahi
hai.

## Prisma ke apne field-level control se relationship

Prisma ke \`update\`/\`create\` calls sirf un fields ko likhte hain jo
unhe pass kiye gaye \`data\` object mein explicitly present hain — Prisma
khud "extra" fields ka koi concept nahi rakhta jo silently ignore hone
versus likhe jaane ke beech ho; jo bhi key-value pairs us object mein
exist karte hain wahi likhe jaate hain, agar wo real columns se
correspond karte hain. Iska matlab hai mass assignment ke against poora
defense is baat ko control karne mein rehta hai ki wo \`data\` object
actually kya contain karta hai Prisma tak pahunchne se pehle — koi
Prisma-level setting nahi hai jo aapke liye ye protection provide kare.`,

    examples: [
      {
        title: 'Vulnerable spreading versus a Zod-schema-enforced allowlist',
        titleHi: 'Vulnerable spreading versus ek Zod-schema-enforced allowlist',
        codeJs: `// VULNERABLE: spreading the raw request body directly into a Prisma write
export async function updateProfile(rawData) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: rawData, // caller controls EVERY field that gets written
  });
}
// A crafted call: updateProfile({ name: 'X', role: 'admin' }) silently
// promotes the caller to admin, if 'role' is a real column.

// FIXED: a Zod schema defines exactly which fields are allowed
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

export async function updateProfileFixed(formData) {
  const result = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });
  if (!result.success) return { error: 'Invalid input' };

  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: result.data, // can ONLY ever contain name and bio
  });
}`,
        codeTs: `// VULNERABLE: spreading the raw request body directly into a Prisma write
export async function updateProfile(rawData: Record<string, unknown>) {
  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: rawData, // caller controls EVERY field that gets written
  });
}
// A crafted call: updateProfile({ name: 'X', role: 'admin' }) silently
// promotes the caller to admin, if 'role' is a real column.

// FIXED: a Zod schema defines exactly which fields are allowed
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

export async function updateProfileFixed(formData: FormData) {
  const result = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });
  if (!result.success) return { error: 'Invalid input' };

  const session = await getSession();
  await db.user.update({
    where: { id: session.userId },
    data: result.data, // can ONLY ever contain name and bio
  });
}`,
        code: `const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});
const result = updateProfileSchema.safeParse(input);
await db.user.update({ where: { id: userId }, data: result.data });`,
        output:
          "A request containing { name: 'X', bio: 'Y', role: 'admin' } is parsed by updateProfileSchema into a result.data object containing ONLY { name: 'X', bio: 'Y' } — the extra 'role' field is silently dropped by Zod's parsing, never reaching the database write at all.",
        explain:
          "Zod's default behavior for an object schema is to strip unrecognized keys during parsing (unless configured otherwise with .passthrough()) — this is precisely what makes result.data safe to spread: its shape is guaranteed to match the schema, regardless of what extra fields the original input contained.",
        explainHi:
          "Zod ka default behavior ek object schema ke liye parsing ke dauran unrecognized keys ko strip karna hai (jab tak .passthrough() se otherwise configure na kiya jaaye) — ye precisely wahi hai jo result.data ko spread karna safe banata hai: uska shape guaranteed hai schema se match kare, chahe original input mein kuch bhi extra fields ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// Spreading a partially-typed object, assuming TypeScript's type alone protects it
interface ProfileUpdate { name: string; bio: string }

export async function updateProfile(data: ProfileUpdate) {
  await db.user.update({ where: { id: userId }, data }); // looks safe...
}
// But TypeScript types are erased at runtime — nothing stops a caller
// from sending { name: 'X', bio: 'Y', role: 'admin' } at the network
// level, since the type annotation is not a runtime check.`,
        right: `// Runtime validation with Zod actually enforces the shape, not just types
const schema = z.object({ name: z.string(), bio: z.string() });

export async function updateProfile(rawData: unknown) {
  const result = schema.safeParse(rawData);
  if (!result.success) return { error: 'Invalid input' };
  await db.user.update({ where: { id: userId }, data: result.data });
}`,
        why: "A TypeScript interface is a compile-time-only construct — it provides no runtime enforcement whatsoever. A request arriving over the network isn't type-checked by TypeScript at all; only a runtime validation library like Zod actually inspects and constrains the real data at the moment it arrives.",
        whyHi:
          "Ek TypeScript interface ek compile-time-only construct hai — ye koi runtime enforcement bilkul provide nahi karta. Network ke over aane wali ek request TypeScript se bilkul type-checked nahi hoti; sirf ek runtime validation library jaisa Zod actually real data ko inspect aur constrain karta hai jis moment ye arrive karta hai.",
      },
    ],

    realWorld: [
      {
        en: "Mass assignment vulnerabilities have historically affected major platforms in the wild — a well-known public disclosure involved a social network's profile update endpoint that, through mass assignment, allowed a regular user to set their own account to 'verified' status by including that field in an otherwise ordinary profile-update request.",
        hi: 'Mass assignment vulnerabilities ne historically real world mein major platforms ko affect kiya hai — ek well-known public disclosure ek social network ke profile update endpoint ko involve karta tha jo, mass assignment ke through, ek regular user ko apne account ko \'verified\' status set karne deta tha us field ko ek otherwise ordinary profile-update request mein include karke.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is spreading a raw, unvalidated request body directly into a database write dangerous?',
        qHi: 'Ek raw, unvalidated request body ko directly ek database write mein spread karna dangerous kyun hai?',
        a: "It lets the caller decide which fields get written, rather than the application — a request can include fields the UI never exposes (like a role or account balance column), silently writing to them if they correspond to real database columns, since the database write itself has no concept of which fields were 'supposed' to be editable.",
        aHi: 'Ye caller ko decide karne deta hai ki kaunse fields likhe jaate hain, application ke bajaye — ek request un fields ko include kar sakti hai jo UI kabhi expose nahi karta (jaise ek role ya account balance column), silently unhe likhte hue agar wo real database columns se correspond karte hain, kyunki database write khud iska koi concept nahi rakhta ki kaunse fields "supposed" the editable hone ke liye.',
      },
      {
        q: "Why is a TypeScript interface alone insufficient protection against mass assignment?",
        qHi: 'Akela ek TypeScript interface mass assignment ke against insufficient protection kyun hai?',
        a: "TypeScript types are erased entirely at compile time and provide no runtime enforcement — a request arriving over the network is not checked against a TypeScript type at all. Only runtime validation (like a Zod schema's safeParse) actually inspects and constrains the real data as it arrives.",
        aHi: 'TypeScript types compile time pe poori tarah erase ho jaate hain aur koi runtime enforcement provide nahi karte — network ke over aane wali ek request ek TypeScript type ke against bilkul check nahi hoti. Sirf runtime validation (jaisa ek Zod schema ka safeParse) actually real data ko inspect aur constrain karta hai jaise ye arrive karta hai.',
      },
    ],

    exercises: [
      {
        task: "A Server Action for updating a support ticket accepts { status, priority, assignedAgent } from a customer-facing form, and spreads the input directly into a Prisma update. The Ticket model also has an internalNotes field never exposed in this form. Explain the exploit and write a fix using Zod.",
        taskHi: 'Ek support ticket update karne ke liye ek Server Action { status, priority, assignedAgent } ek customer-facing form se accept karta hai, aur input ko directly ek Prisma update mein spread karta hai. Ticket model mein ek internalNotes field bhi hai jo is form mein kabhi expose nahi hota. Exploit explain karo aur Zod use karke ek fix likho.',
        hint: "Think about what a customer could include in their request beyond the three fields the form's own UI presents.",
        hintHi: 'Socho ki ek customer apni request mein un teen fields se pare kya include kar sakta hai jo form ka apna UI present karta hai.',
      },
    ],

    keyTakeaways: [
      "Spreading an entire incoming object directly into a database write lets the caller decide which fields get changed, rather than the application — a serious risk for fields the UI never intentionally exposes.",
      "This is particularly dangerous because the vulnerability is invisible through normal UI testing, since the UI's own form never sends the dangerous extra fields — it only surfaces to someone crafting a request directly.",
      "A TypeScript type annotation alone provides no runtime protection, since types are erased at compile time — only runtime validation (Zod) actually constrains incoming data.",
      "A Zod schema's parsed output (from safeParse) is safe to spread because it can only ever contain the fields the schema defines — the schema itself functions as an allowlist, unlike raw, unvalidated input.",
    ],
    keyTakeawaysHi: [
      'Ek poore incoming object ko directly ek database write mein spread karna caller ko decide karne deta hai ki kaunse fields change hote hain, application ke bajaye — un fields ke liye ek serious risk jo UI kabhi intentionally expose nahi karta.',
      'Ye particularly dangerous hai kyunki vulnerability normal UI testing ke through invisible hai, kyunki UI ka apna form dangerous extra fields kabhi bhejta hi nahi — ye sirf kisi ke liye surface hota hai jo directly ek request craft karta hai.',
      'Akela ek TypeScript type annotation koi runtime protection provide nahi karta, kyunki types compile time pe erase ho jaate hain — sirf runtime validation (Zod) actually incoming data ko constrain karta hai.',
      'Ek Zod schema ka parsed output (safeParse se) spread karna safe hai kyunki ye sirf un fields ko contain kar sakta hai jo schema define karta hai — schema khud ek allowlist ki tarah function karta hai, raw, unvalidated input ke unlike.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-recheck-auth-every-mutation-zod-own-client',
    title: "Re-Check Auth Inside Every Mutation, and Zod-Parse Your Own Client's Input",
    titleHi: "Har Mutation Ke Andar Auth Re-Check Karo, Aur Apne Khud Ke Client Ke Input Ko Zod-Parse Karo",
    description:
      "Two habits close out this module's throughline: authorization must be re-verified inside every single mutation, not assumed from an earlier check in the request's lifecycle, and every mutation must validate its input with a schema even when the only caller you wrote is your own trusted client component.",
    descriptionHi:
      'Do habits is module ke throughline ko close karte hain: authorization ko har single mutation ke andar re-verify karna chahiye, request ki lifecycle mein ek earlier check se assume nahi karna chahiye, aur har mutation ko apne input ko ek schema se validate karna chahiye chahe ekmatra caller jo aapne likha ho aapka apna trusted client component ho.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: "**A building where showing ID at the front desk once, at 9 AM, is treated as permission for every door in the building for the rest of the day, versus one where a badge is re-checked at every single sensitive door, every time.** A building that checks ID only at the front entrance and then trusts that same person for every subsequent door — the server room, the executive floor, the vault — has effectively made the front-desk check into the ONLY check that matters; anyone who gets past it once (a stolen badge, a tailgating trick) has unlimited access afterward. A well-secured building re-checks a badge at every sensitive door specifically, independent of how the person got that far, because the front door's check was never meant to be the SOLE gate. Re-checking authorization inside every mutation is exactly this discipline, applied to code instead of doors.",
      hi: 'Ek building jahan front desk pe ek baar ID dikhana, subah 9 baje, poore din ke liye building ke har door ke liye permission ki tarah treat kiya jata hai, versus ek jahan ek badge har single sensitive door pe re-check hota hai, har baar. Ek building jo sirf front entrance pe ID check karta hai aur phir har subsequent door ke liye wahi insaan ko trust karta hai — server room, executive floor, vault — effectively front-desk check ko EKMATRA check bana diya hai jo matter karta hai; koi bhi jo ise ek baar cross kar leta hai (ek stolen badge, ek tailgating trick) uske baad unlimited access rakhta hai. Ek well-secured building specifically har sensitive door pe ek badge re-check karta hai, is baat se independent ki insaan wahan tak kaise pahuncha, kyunki front door ka check kabhi SOLE gate hone ke liye meant nahi tha. Har mutation ke andar authorization re-check karna exactly yahi discipline hai, code pe applied, doors ke bajaye.',
    },

    simple: `**Habit 1 — re-check auth inside every mutation, never assume it was
already handled upstream:**

\`\`\`ts
// WRONG mental model: "middleware already checked this user is logged
// in, and the page already checked they're a project member, so this
// Server Action doesn't need its own check"
export async function deleteProjectFile(fileId: string) {
  'use server';
  await db.file.delete({ where: { id: fileId } }); // trusts prior checks
}

// RIGHT: this specific mutation verifies, for ITSELF, that the current
// user owns or has permission for THIS specific file
export async function deleteProjectFile(fileId: string) {
  'use server';
  const session = await getSession();
  const file = await db.file.findUnique({ where: { id: fileId } });
  if (!session || !file || file.projectId !== session.currentProjectId) {
    throw new Error('Not authorized');
  }
  await db.file.delete({ where: { id: fileId } });
}
\`\`\`

**Why "it was already checked earlier" is a fragile assumption:** a
middleware gate (Module 8) only confirms someone is logged in; a page's
render-time check only ran for the specific navigation path that led to
viewing that page — neither of those facts is re-verified when a Server
Action's endpoint is invoked directly (Lesson 1), and neither one
distinguishes "authorized for SOME resource" from "authorized for THIS
SPECIFIC resource" (Module 13's IDOR lesson). Every mutation is a fresh
opportunity for an attacker to skip everything upstream.

**Habit 2 — validate with Zod even for your OWN client component's
input:**

\`\`\`tsx
// "I wrote this form myself, so I know it only ever sends valid data"
// — true today, but this reasoning has two real gaps:
'use client';
function CommentForm() {
  async function submit(formData: FormData) {
    await postComment(formData.get('text')); // no validation — "trust myself"
  }
}
\`\`\`

\`\`\`ts
export async function postComment(text: FormDataEntryValue | null) {
  'use server';
  const result = z.string().min(1).max(1000).safeParse(text);
  if (!result.success) return { error: 'Invalid comment' };
  await db.comment.create({ data: { text: result.data } });
}
\`\`\`

**Why "I wrote the client, so I trust it" doesn't hold up:** the Server
Action's endpoint is reachable by ANY request, not just ones your own
client component happens to send (Lesson 1's core point) — and even
setting that aside, your OWN client code can be modified by a browser
extension, a compromised dependency in the client bundle, or simply a
future teammate editing the form without realizing the server-side
assumption it depended on. Validating on the server is not about
distrusting your own code's intentions; it's about the server never being
able to verify, at the moment a request arrives, WHERE it actually came
from.

**The unifying lesson closing this module:** every mutation is
independently responsible for its own security — who is allowed to call
it, and what shape of data it's willing to act on — because it is, from
the network's perspective, a standalone entry point that must defend
itself, regardless of every assumption about how it was "supposed" to be
reached.`,

    simpleHi: `**Habit 1 — har mutation ke andar auth re-check karo, kabhi assume mat
karo ki ye already upstream handle ho chuka hai:**

\`\`\`ts
// GALAT mental model: "middleware ne already check kar liya ki ye user
// logged in hai, aur page ne already check kar liya ki wo ek project
// member hai, isliye is Server Action ko apna khud ka check nahi chahiye"
export async function deleteProjectFile(fileId: string) {
  'use server';
  await db.file.delete({ where: { id: fileId } }); // prior checks trust karta hai
}

// SAHI: ye specific mutation KHUD KE LIYE verify karta hai, ki current
// user IS specific file ka owner hai ya iske liye permission rakhta hai
export async function deleteProjectFile(fileId: string) {
  'use server';
  const session = await getSession();
  const file = await db.file.findUnique({ where: { id: fileId } });
  if (!session || !file || file.projectId !== session.currentProjectId) {
    throw new Error('Not authorized');
  }
  await db.file.delete({ where: { id: fileId } });
}
\`\`\`

**"Ye already pehle check ho chuka hai" ek fragile assumption kyun hai:**
ek middleware gate (Module 8) sirf confirm karta hai ki koi logged in hai;
ek page ka render-time check sirf us specific navigation path ke liye
chala jo us page dekhne tak le gaya — inme se koi bhi fact re-verify nahi
hota jab ek Server Action ka endpoint directly invoke hota hai (Lesson
1), aur inme se koi bhi "KISI resource ke liye authorized" ko "IS
SPECIFIC resource ke liye authorized" se distinguish nahi karta (Module
13 ka IDOR lesson). Har mutation ek fresh opportunity hai ek attacker ke
liye upstream sab kuch skip karne ki.

**Habit 2 — apne KHUD ke client component ke input ke liye bhi Zod se
validate karo:**

\`\`\`tsx
// "Maine ye form khud likha hai, isliye main jaanta hoon ye sirf valid
// data hi bhejta hai" — aaj sahi hai, par is reasoning mein do real gaps hain:
'use client';
function CommentForm() {
  async function submit(formData: FormData) {
    await postComment(formData.get('text')); // koi validation nahi — "khud pe trust karo"
  }
}
\`\`\`

\`\`\`ts
export async function postComment(text: FormDataEntryValue | null) {
  'use server';
  const result = z.string().min(1).max(1000).safeParse(text);
  if (!result.success) return { error: 'Invalid comment' };
  await db.comment.create({ data: { text: result.data } });
}
\`\`\`

**"Maine client likha hai, isliye main ise trust karta hoon" kyun nahi
tikta:** Server Action ka endpoint KISI BHI request se reachable hai,
sirf un se nahi jo aapka apna client component bhejta hai (Lesson 1 ka
core point) — aur isse alag rakhte hue bhi, aapka APNA client code ek
browser extension se modify ho sakta hai, client bundle mein ek
compromised dependency se, ya simply ek future teammate jo form edit
karta hai bina realize kiye us server-side assumption ka jispe ye depend
karta tha. Server pe validate karna aapke apne code ki intentions ko
distrust karne ke baare mein nahi hai; ye is baat ke baare mein hai ki
server kabhi verify nahi kar sakta, jis moment ek request aati hai, ki ye
actually KAHAN se aayi.

**Is module ko close karne wala unifying lesson:** har mutation apni
khud ki security ke liye independently responsible hai — kaun ise call
karne ke liye allowed hai, aur ye kis shape ke data pe act karne ko
willing hai — kyunki ye, network ke perspective se, ek standalone entry
point hai jise khud ko defend karna chahiye, har us assumption se
independent ki ye "supposedly" kaise reach hona chahiye tha.`,

    content: `## Why "defense in depth" specifically means redundant checks, not
just multiple layers

It's tempting to think of middleware, page-level checks, and
mutation-level checks as three complementary LAYERS, each covering a
different concern — and that's true. But the critical, easy-to-miss
detail is that the mutation-level check must be able to stand ENTIRELY ON
ITS OWN, because it's the only one guaranteed to actually run when the
mutation's endpoint is invoked directly. "Defense in depth" doesn't mean
"spread the responsibility across layers so each does less" — it means
each layer is independently sufficient for what it protects, and their
overlap is a deliberate redundancy, not a division of labor where any one
layer depends on another having already run.

## Why "I control the client, so I trust its input" is a category error

The mistake here is conflating two different things: trusting your OWN
INTENTIONS when you wrote the client code, and trusting what ACTUALLY
ARRIVES at the server at request time. Those are not the same fact. The
server has no way to verify a request came from the specific client
component you wrote, as opposed to a hand-crafted request mimicking it —
this isn't a hypothetical edge case, it's the literal, default reachability
of any Server Action or Route Handler (Lesson 1's entire point). Server-side
validation isn't skepticism about your own code quality; it's an
acknowledgment that "code I trust" and "requests my server actually
receives" are different categories entirely.

## Why this lesson deliberately closes the module by tying earlier
lessons together

This lesson doesn't introduce a new mechanism — it names the discipline
that makes Lessons 1 and 2 (and Module 12's XSS/CSRF, Module 13's
IDOR/rate-limiting) actually stick in practice: treating every mutation as
a fully independent, self-defending unit, never one that inherits safety
from something that happened earlier in a request's journey. A team that
internalizes this single habit — "what does THIS function need to verify,
assuming nothing about how it was reached" — tends to avoid most of the
specific vulnerabilities this module named individually, because the
habit generalizes to attack patterns not explicitly covered here too.

## A closing note on where this leaves the course

Module 15 begins Part V (Performance & Scale), a genuine shift in focus —
but the security discipline built across Modules 8 and 12-14 doesn't stop
applying once the course moves on. A performance optimization that
accidentally skips an authorization check to save a database query, or a
caching layer that inadvertently serves one user's data to another, would
undo exactly the protections this module built. Carrying this module's
habits forward, rather than treating them as complete once this module
ends, is the actual point.`,

    contentHi: `## "Defense in depth" specifically redundant checks kyun matlab rakhta hai, sirf multiple layers nahi

Middleware, page-level checks, aur mutation-level checks ko teen
complementary LAYERS ki tarah sochna tempting hai, har ek ek alag concern
cover karte hue — aur ye sahi hai. Par critical, easy-to-miss detail ye
hai ki mutation-level check ko poori tarah APNE AAP KHADE hone mein
capable hona chahiye, kyunki ye ekmatra hai jo guaranteed hai actually
chalne ke liye jab mutation ka endpoint directly invoke hota hai.
"Defense in depth" ka matlab "responsibility ko layers ke across spread
karo taaki har ek kam kare" nahi hai — iska matlab hai har layer
independently sufficient hai us cheez ke liye jo ye protect karta hai,
aur unka overlap ek deliberate redundancy hai, koi labor ka division
nahi jahan koi ek layer doosre pe depend kare uske already chal chuke
hone ke liye.

## "Main client control karta hoon, isliye main uske input ko trust karta hoon" ek category error kyun hai

Yahan mistake do alag cheezon ko confuse karna hai: apni KHUD KI
INTENTIONS ko trust karna jab aapne client code likha, aur us pe trust
karna jo ACTUALLY server tak request time pe ARRIVE karta hai. Wo wahi
fact nahi hain. Server ke paas ye verify karne ka koi tareeka nahi hai ki
ek request us specific client component se aayi jo aapne likha, uski
naqal karti ek hand-crafted request ke against — ye koi hypothetical
edge case nahi hai, ye kisi bhi Server Action ya Route Handler ki
literal, default reachability hai (Lesson 1 ka poora point). Server-side
validation aapke apne code quality ke baare mein skepticism nahi hai; ye
ek acknowledgment hai ki "code jise main trust karta hoon" aur "requests
jo mera server actually receive karta hai" poori tarah alag categories
hain.

## Ye lesson deliberately earlier lessons ko tie karke module ko kyun close karta hai

Ye lesson koi naya mechanism introduce nahi karta — ye us discipline ko
naam deta hai jo Lessons 1 aur 2 (aur Module 12 ke XSS/CSRF, Module 13 ke
IDOR/rate-limiting) ko practically stick karta hai: har mutation ko ek
poori tarah independent, self-defending unit ki tarah treat karna, kabhi
ek aisi jo kisi cheez se safety inherit kare jo pehle ek request ki
journey mein hui thi. Ek team jo is single habit ko internalize karti hai
— "IS function ko kya verify karna chahiye, ye assume kiye bina ki ye
kaise reach hua" — usually zyadatar us specific vulnerabilities ko avoid
karti hai jo is module ne individually naam di, kyunki habit un attack
patterns tak bhi generalize hoti hai jo yahan explicitly cover nahi ki
gayi.

## Course ko yahan chhodne pe ek closing note

Module 15 Part V (Performance & Scale) shuru karta hai, ek genuine focus
shift — par Modules 8 aur 12-14 mein banaya gaya security discipline
course ke aage badhne ke baad apply hona band nahi karta. Ek performance
optimization jo accidentally ek authorization check skip karta hai ek
database query save karne ke liye, ya ek caching layer jo inadvertently
ek user ka data doosre ko serve karta hai, exactly wo protections undo
kar dega jo is module ne banaye. Is module ki habits ko aage carry karna,
unhe complete treat karne ke bajaye jab ye module khatam hota hai, actual
point hai.`,

    examples: [
      {
        title: 'A mutation that independently re-verifies authorization and validates its own client\'s input',
        titleHi: 'Ek mutation jo independently authorization re-verify karta hai aur apne khud ke client ka input validate karta hai',
        codeJs: `// app/actions.js
'use server';
import { z } from 'zod';

const updateTaskSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1).max(200),
});

export async function updateTask(formData) {
  // 1. Re-verify authentication AND authorization here, independently
  //    of any middleware or page-level check that may have already run
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  // 2. Validate the input with Zod, even though this is called from a
  //    client component you wrote yourself — the server can't verify
  //    a request genuinely came from that specific component
  const result = updateTaskSchema.safeParse({
    taskId: formData.get('taskId'),
    title: formData.get('title'),
  });
  if (!result.success) return { error: 'Invalid input' };

  // 3. Verify authorization for THIS SPECIFIC resource, not just "logged in"
  const task = await db.task.findUnique({ where: { id: result.data.taskId } });
  if (!task || task.ownerId !== session.userId) {
    return { error: 'Not authorized' };
  }

  await db.task.update({
    where: { id: result.data.taskId },
    data: { title: result.data.title },
  });
}`,
        codeTs: `// app/actions.ts
'use server';
import { z } from 'zod';

const updateTaskSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1).max(200),
});

export async function updateTask(formData: FormData) {
  // 1. Re-verify authentication AND authorization here, independently
  //    of any middleware or page-level check that may have already run
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  // 2. Validate the input with Zod, even though this is called from a
  //    client component you wrote yourself — the server can't verify
  //    a request genuinely came from that specific component
  const result = updateTaskSchema.safeParse({
    taskId: formData.get('taskId'),
    title: formData.get('title'),
  });
  if (!result.success) return { error: 'Invalid input' };

  // 3. Verify authorization for THIS SPECIFIC resource, not just "logged in"
  const task = await db.task.findUnique({ where: { id: result.data.taskId } });
  if (!task || task.ownerId !== session.userId) {
    return { error: 'Not authorized' };
  }

  await db.task.update({
    where: { id: result.data.taskId },
    data: { title: result.data.title },
  });
}`,
        code: `export async function updateTask(formData) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');
  const result = updateTaskSchema.safeParse({ /* ... */ });
  if (!result.success) return { error: 'Invalid input' };
  const task = await db.task.findUnique({ where: { id: result.data.taskId } });
  if (!task || task.ownerId !== session.userId) return { error: 'Not authorized' };
  await db.task.update({ where: { id: result.data.taskId }, data: { title: result.data.title } });
}`,
        output:
          "A direct, hand-crafted request to this action's endpoint — with no valid session, malformed data, or a taskId belonging to a different user — is rejected at the corresponding check, regardless of whether it came from the app's own UI or was constructed entirely independently of it.",
        explain:
          "Each of the three checks addresses a distinct question (is anyone authenticated, is the input well-formed, does THIS user own THIS resource) and each runs unconditionally inside the action itself — none of them assume any prior check already happened elsewhere in the request's journey.",
        explainHi:
          "Teenon checks mein se har ek ek distinct question address karta hai (kya koi authenticated hai, kya input well-formed hai, kya IS user ke paas IS resource ka ownership hai) aur har ek unconditionally action ke andar hi chalta hai — inme se koi bhi ye assume nahi karta ki koi prior check already request ki journey mein kahin aur ho chuka hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting the client component's own validation as sufficient
'use client';
function TaskForm() {
  function handleSubmit(formData) {
    const title = formData.get('title');
    if (title.length > 200) {
      alert('Title too long'); // client-side check only
      return;
    }
    updateTask(formData); // Server Action called with NO server-side re-check
  }
}

// app/actions.js
'use server';
export async function updateTask(formData) {
  const title = formData.get('title'); // trusted implicitly — "the client already checked"
  await db.task.update({ where: { id: formData.get('taskId') }, data: { title } });
}`,
        right: `// The Server Action independently validates, regardless of client-side checks
'use server';
const schema = z.object({ taskId: z.string().uuid(), title: z.string().min(1).max(200) });

export async function updateTask(formData) {
  const result = schema.safeParse({
    taskId: formData.get('taskId'),
    title: formData.get('title'),
  });
  if (!result.success) return { error: 'Invalid input' };
  // ... proceed with result.data, plus an authorization check
}`,
        why: "The client-side length check is genuinely useful for instant user feedback (Module 5's UX case for client-side validation), but it runs in code the visitor controls and can be bypassed entirely by calling the Server Action's endpoint directly — the server-side check is the only one that actually constrains what gets written.",
        whyHi:
          "Client-side length check genuinely useful hai instant user feedback ke liye (Module 5 ka client-side validation ke liye UX case), par ye aise code mein chalta hai jise visitor control karta hai aur poori tarah bypass kiya ja sakta hai Server Action ke endpoint ko directly call karke — server-side check ekmatra hai jo actually constrain karta hai ki kya likha jata hai.",
      },
    ],

    realWorld: [
      {
        en: "A mature engineering team's code review checklist for any new Server Action or Route Handler explicitly asks two questions regardless of what UI calls it: 'does this independently verify the caller is authorized for this specific resource' and 'does this validate its input with a schema, even though I wrote the only client that currently calls it' — treating both as non-negotiable, not situational.",
        hi: 'Ek mature engineering team ki code review checklist kisi bhi naye Server Action ya Route Handler ke liye explicitly do sawaal poochhti hai chahe koi bhi UI ise call kare: \'kya ye independently verify karta hai ki caller is specific resource ke liye authorized hai\' aur \'kya ye apne input ko ek schema se validate karta hai, chahe maine hi wo ekmatra client likha ho jo currently ise call karta hai\' — dono ko non-negotiable treat karte hue, situational nahi.',
      },
    ],

    interviewQA: [
      {
        q: "Why must a Server Action re-check authorization even if middleware and a page-level check both already ran for the request that led to it?",
        qHi: 'Ek Server Action ko authorization re-check kyun karna chahiye chahe middleware aur ek page-level check dono already chal chuke hon us request ke liye jo ise le gayi?',
        a: "Because the Server Action's own endpoint can be invoked directly, entirely bypassing the middleware gate and the page render that would normally precede it. Only a check inside the action's own function body is guaranteed to run on every possible way the action could be invoked.",
        aHi: 'Kyunki Server Action ka apna endpoint directly invoke kiya ja sakta hai, middleware gate aur page render ko poori tarah bypass karte hue jo normally usse pehle aata. Sirf action ki apni function body ke andar ek check guaranteed hai chalne ke liye har possible tarike pe jisse action invoke ho sakta hai.',
      },
      {
        q: "Why is validating your own client component's input on the server not redundant, even though you wrote that client code yourself?",
        qHi: 'Apne khud ke client component ke input ko server pe validate karna redundant kyun nahi hai, chahe aapne wo client code khud likha ho?',
        a: "Because the server cannot verify, at the moment a request arrives, that it genuinely came from that specific client component rather than a directly crafted request mimicking it. Trusting your own code's intentions is a different thing from trusting what the server can actually confirm about an incoming request's origin.",
        aHi: 'Kyunki server verify nahi kar sakta, jis moment ek request aati hai, ki ye genuinely us specific client component se aayi na ki uski naqal karti ek directly crafted request se. Apne khud ke code ki intentions ko trust karna ek alag cheez hai us se jo server actually ek incoming request ke origin ke baare mein confirm kar sakta hai.',
      },
    ],

    exercises: [
      {
        task: "Review this module's three lessons together and write, in your own words, the single mental habit that would have prevented all three specific mistakes covered (unchecked Server Actions, mass assignment, and skipped re-validation) if a developer had applied it consistently.",
        taskHi: 'Is module ke teenon lessons ko saath review karo aur apne khud ke words mein likho, wo single mental habit jo un teenon specific mistakes ko rok deta (unchecked Server Actions, mass assignment, aur skipped re-validation) agar ek developer ne ise consistently apply kiya hota.',
        hint: "All three mistakes share the same underlying assumption about something being safe 'because of how it's reached' or 'because of who wrote the caller' — name what should replace that assumption.",
        hintHi: 'Teenon mistakes wahi underlying assumption share karte hain ki kuch safe hai "kyunki ye kaise reach hota hai" ya "kyunki caller ko kisne likha" — naam do ki us assumption ki jagah kya lena chahiye.',
      },
    ],

    keyTakeaways: [
      "Authorization must be checked inside every mutation independently, never assumed from middleware or a page-level check that ran earlier — those checks don't run when a mutation's endpoint is invoked directly.",
      "\"Defense in depth\" means each layer is independently sufficient for what it protects, not that responsibility is divided such that one layer can skip work assuming another already did it.",
      'Every mutation must validate its input with a schema (Zod) even when you wrote the only client that currently calls it, because the server cannot verify a request genuinely came from that specific client rather than a directly crafted one.',
      "This lesson's discipline — treating every mutation as a fully independent, self-defending unit — is what makes the fixes from this module's other lessons, and Module 12/13's security topics, actually hold up in practice.",
    ],
    keyTakeawaysHi: [
      'Authorization ko har mutation ke andar independently check karna chahiye, middleware ya ek page-level check se kabhi assume nahi karna chahiye jo pehle chala — wo checks nahi chalte jab ek mutation ka endpoint directly invoke hota hai.',
      '"Defense in depth" ka matlab hai har layer independently sufficient hai us cheez ke liye jo ye protect karta hai, ye nahi ki responsibility is tarah divide hai ki ek layer kaam skip kar sake ye assume karte hue ki doosre ne already kar diya.',
      'Har mutation ko apne input ko ek schema (Zod) se validate karna chahiye chahe aapne wo ekmatra client likha ho jo currently ise call karta hai, kyunki server verify nahi kar sakta ki ek request genuinely us specific client se aayi na ki ek directly crafted wali se.',
      'Is lesson ki discipline — har mutation ko ek poori tarah independent, self-defending unit ki tarah treat karna — wahi hai jo is module ke doosre lessons ke fixes ko, aur Module 12/13 ke security topics ko, practically tikata hai.',
    ],
  },
];
